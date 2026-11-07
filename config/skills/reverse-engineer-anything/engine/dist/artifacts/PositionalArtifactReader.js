import { Readable, Transform, pipeline } from "node:stream";
import { setImmediate } from "node:timers/promises";
import { ArtifactReaderFailure, copyArtifactEntry, sameArtifactEntry, } from "./ArtifactReader.js";
import { ArtifactResourceScope } from "./ArtifactResourceScope.js";
import { assertArtifactReadActive } from "./ArtifactFileOperation.js";
import { ArtifactFileSource } from "./ArtifactFileSource.js";
import { readFileHandleChunks } from "../filesystem/readFileHandleChunks.js";
/**
 * Serve entries that are byte ranges of one carrier file. Preparation runs
 * once; every traversal, open and completed entry stream rechecks the
 * carrier's identity, and close retires open streams before the carrier.
 * Encrypted entries are listed but never opened.
 */
export class PositionalArtifactReader {
    #scope = new ArtifactResourceScope();
    #entries = new Map();
    #streams = new Set();
    #label;
    #source;
    #prepared;
    #coverage;
    #closing = false;
    constructor(path, label, admitted) {
        this.#label = label;
        this.#source = new ArtifactFileSource(path, label, admitted);
    }
    async prepareContainer(expectedSha256, signal) {
        await this.#scope.run(async () => {
            this.assertOpen(signal);
            await this.#source.bindSha256(expectedSha256, signal);
        });
    }
    async *entries(signal, options) {
        await this.#scope.run(async () => {
            this.assertOpen(signal);
            this.#prepared ??= this.#prepare(signal);
            await this.#prepared;
            await this.#source.read(signal);
        });
        this.assertOpen(signal);
        if (this.#coverage !== undefined)
            options?.onCoverage?.({
                ...this.#coverage,
                limitations: [...this.#coverage.limitations],
            });
        let index = 0;
        for (const entry of this.#entries.values()) {
            // Yield between batches so a large inventory does not hold the loop.
            if (index++ % 256 === 0)
                await setImmediate();
            this.assertOpen(signal);
            yield copyArtifactEntry(entry);
        }
        this.assertOpen(signal);
    }
    async open(entry, signal) {
        return this.#scope.run(async () => {
            this.assertOpen(signal);
            const stored = this.#entries.get(entry.adapterKey);
            if (stored === undefined || !sameArtifactEntry(entry, stored))
                throw new ArtifactReaderFailure("integrity", `${this.#label} entry does not match its owning inventory`);
            if (stored.encrypted)
                throw new ArtifactReaderFailure("unavailable", `Encrypted ${this.#label} member is unsupported: ${stored.path}`);
            const { handle } = await this.#source.read(signal);
            this.assertOpen(signal);
            const source = stored.declaredSize === 0
                ? Readable.from([])
                : readFileHandleChunks(handle, {
                    start: stored.byteOffset,
                    end: stored.byteOffset + stored.declaredSize - 1,
                    signal,
                    cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", `${this.#label} read cancelled`, { cause: reason }),
                });
            const output = this.#entryStream(stored, signal);
            // Retirement can destroy the stream before its consumer listens.
            output.on("error", () => undefined);
            this.#streams.add(output);
            let producerComplete = false;
            const onAbort = () => {
                // Preserve active read/validation errors; after production, the caller
                // still owns buffered bytes and cancellation must retire that result.
                if (!producerComplete || output.destroyed)
                    return;
                output.destroy(new ArtifactReaderFailure("cancelled", `${this.#label} read cancelled`, { cause: signal?.reason }));
            };
            // Writable completion can leave unread bytes buffered on the readable
            // side, so the stream stays owned until that side closes too.
            const retired = new Promise((resolve) => {
                output.once("close", () => {
                    this.#streams.delete(output);
                    signal?.removeEventListener("abort", onAbort);
                    resolve();
                });
            });
            signal?.addEventListener("abort", onAbort, { once: true });
            if (signal?.aborted)
                onAbort();
            void this.#scope
                .run(async () => {
                await Promise.all([
                    new Promise((resolve) => {
                        pipeline(source, output, () => {
                            producerComplete = true;
                            if (signal?.aborted)
                                onAbort();
                            resolve();
                        });
                    }),
                    retired,
                ]);
            })
                .catch((cause) => output.destroy(cause instanceof Error
                ? cause
                : new Error(`${this.#label} stream ownership failed`, {
                    cause,
                })));
            return output;
        });
    }
    async close() {
        this.#closing = true;
        for (const stream of this.#streams)
            stream.destroy(new ArtifactReaderFailure("unavailable", `${this.#label} reader closed`));
        await this.#scope.close();
        await this.#source.close();
        this.#entries.clear();
    }
    provenance() {
        return [];
    }
    /** Recheck the carrier's identity and borrow its descriptor. */
    verifyCarrier(signal) {
        return this.#source.read(signal);
    }
    /** Refuse work once the caller cancels or close begins. */
    assertOpen(signal) {
        assertArtifactReadActive(signal);
        if (this.#closing)
            throw new ArtifactReaderFailure("unavailable", `${this.#label} reader is closed`);
    }
    async #prepare(signal) {
        const { entries, coverage } = await this.prepareEntries(signal);
        for (const entry of entries)
            this.#entries.set(entry.adapterKey, entry);
        this.#coverage = coverage;
    }
    #entryStream(entry, signal) {
        const label = this.#label;
        let bytes = 0;
        const check = async () => {
            if (bytes !== entry.declaredSize)
                throw new ArtifactReaderFailure("integrity", `${label} entry ended early: ${entry.path}`);
            await this.#source.read(signal);
        };
        return new Transform({
            transform(chunk, _encoding, callback) {
                bytes += chunk.length;
                callback(null, chunk);
            },
            flush(callback) {
                void check().then(() => callback(), (cause) => callback(cause instanceof Error
                    ? cause
                    : new Error(`${label} read failed`, { cause })));
            },
        });
    }
}
