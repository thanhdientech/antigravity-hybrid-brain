import { Readable, Transform, pipeline } from "node:stream";
import { setImmediate } from "node:timers/promises";
import { MAX_DEVICETREE_FILE_BYTES } from "../domain/firmware/devicetree.js";
import { ArtifactReaderFailure, copyArtifactEntry, sameArtifactEntry, } from "./ArtifactReader.js";
import { ArtifactResourceScope } from "./ArtifactResourceScope.js";
import { assertArtifactReadActive } from "./ArtifactFileOperation.js";
import { ArtifactFileSource } from "./ArtifactFileSource.js";
import { createFitDigest, readFitStructure, } from "./fit/FitStructure.js";
import { readFileHandleChunks } from "../filesystem/readFileHandleChunks.js";
import { readFileHandleRange } from "../filesystem/readFileHandleRange.js";
const FDT_HEADER_BYTES = 40;
/** Inventory U-Boot FIT /images nodes as stored byte ranges without loading them. */
export class FitArtifactReader {
    format = "fit";
    #scope = new ArtifactResourceScope();
    #entries = new Map();
    #streams = new Set();
    #path;
    #source;
    #prepared;
    #metadata;
    #coverage;
    #closing = false;
    constructor(path, admitted) {
        this.#path = path;
        this.#source = new ArtifactFileSource(path, "FIT", admitted);
    }
    formatMetadata() {
        return this.#metadata === undefined
            ? undefined
            : structuredClone(this.#metadata);
    }
    async prepareContainer(expectedSha256, signal) {
        await this.#scope.run(async () => {
            this.#assertOpen(signal);
            await this.#source.bindSha256(expectedSha256, signal);
        });
    }
    async *entries(signal, options) {
        await this.#scope.run(async () => {
            this.#assertOpen(signal);
            this.#prepared ??= this.#prepare(signal);
            await this.#prepared;
            await this.#source.read(signal);
        });
        if (this.#coverage !== undefined)
            options?.onCoverage?.({
                ...this.#coverage,
                limitations: [...this.#coverage.limitations],
            });
        let index = 0;
        for (const entry of this.#entries.values()) {
            if (index % 256 === 0)
                await setImmediate();
            index += 1;
            this.#assertOpen(signal);
            yield copyArtifactEntry(entry);
        }
        this.#assertOpen(signal);
    }
    async open(entry, signal) {
        return this.#scope.run(async () => {
            this.#assertOpen(signal);
            const stored = this.#entries.get(entry.adapterKey);
            if (stored === undefined || !sameArtifactEntry(entry, stored))
                throw new ArtifactReaderFailure("integrity", "FIT entry does not match its owning inventory");
            const { handle } = await this.#source.read(signal);
            this.#assertOpen(signal);
            if (stored.byteOffset === null || stored.declaredSize === null)
                throw new ArtifactReaderFailure("format", `FIT image has no byte range: ${stored.path}`);
            const source = stored.declaredSize === 0
                ? Readable.from([])
                : readFileHandleChunks(handle, {
                    start: stored.byteOffset,
                    end: stored.byteOffset + stored.declaredSize - 1,
                    signal,
                    cancellationFailure,
                });
            const output = this.#imageStream(stored, signal);
            output.on("error", () => undefined);
            this.#streams.add(output);
            let producerComplete = false;
            const onAbort = () => {
                // Active I/O and final validation own failure precedence. Buffered
                // readable bytes still belong to the caller after they finish.
                if (!producerComplete || output.destroyed)
                    return;
                output.destroy(cancellationFailure(signal?.reason));
            };
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
                // Retain both producer work and the unconsumed readable stream.
                await Promise.all([
                    new Promise((resolve) => pipeline(source, output, () => {
                        producerComplete = true;
                        if (signal?.aborted)
                            onAbort();
                        resolve();
                    })),
                    retired,
                ]);
            })
                .catch((cause) => output.destroy(cause instanceof Error
                ? cause
                : new Error("FIT stream ownership failed", { cause })));
            return output;
        });
    }
    async close() {
        this.#closing = true;
        for (const stream of this.#streams)
            stream.destroy(new ArtifactReaderFailure("unavailable", "FIT reader closed"));
        await this.#scope.close();
        await this.#source.close();
        this.#entries.clear();
    }
    provenance() {
        return [];
    }
    #assertOpen(signal) {
        assertArtifactReadActive(signal);
        if (this.#closing)
            throw new ArtifactReaderFailure("unavailable", "FIT reader is closed");
    }
    async #prepare(signal) {
        const { handle, initial } = await this.#source.read(signal);
        const assertActive = () => this.#assertOpen(signal);
        const header = await readFileHandleRange(handle, 0, FDT_HEADER_BYTES, assertActive);
        if (header.length < FDT_HEADER_BYTES)
            throw new ArtifactReaderFailure("format", "FIT devicetree header is truncated");
        const totalsize = header.readUInt32BE(4);
        if (totalsize > initial.size)
            throw new ArtifactReaderFailure("format", `FIT devicetree is truncated: totalsize ${String(totalsize)} exceeds the ${String(initial.size)}-byte file`);
        if (totalsize > MAX_DEVICETREE_FILE_BYTES)
            throw new ArtifactReaderFailure("limit", `FIT devicetree is ${String(totalsize)} bytes, above the fixed 16 MiB devicetree allowance; embedded image data this large is not supported (mkimage -E stores data externally). No runtime override.`, { boundary: "memory" });
        // Only the devicetree is read; external image data stays on disk.
        const structure = readFitStructure(await readFileHandleRange(handle, 0, totalsize, assertActive), this.#path, initial.size);
        let index = 0;
        for (const image of structure.images) {
            if (index % 256 === 0)
                await setImmediate();
            index += 1;
            this.#assertOpen(signal);
            await this.#verifyHashes(image, signal);
            const entry = {
                path: `images/${image.name}.bin`,
                sourcePath: `/images/${image.name}`,
                kind: "file",
                declaredSize: image.size,
                compressedSize: null,
                executable: false,
                encrypted: false,
                byteOffset: image.start,
                declaredIntegrity: null,
                unpacked: false,
                limitations: image.limitations,
                adapterKey: `fit:${String(image.index)}`,
                formatMetadata: image.metadata,
            };
            this.#entries.set(entry.adapterKey, entry);
        }
        this.#metadata = structure.metadata;
        if (structure.limitations.length > 0)
            this.#coverage = {
                status: "complete",
                limitations: structure.limitations,
            };
        await this.#source.read(signal);
    }
    /** One streamed pass per image feeds every supported digest. */
    async #verifyHashes(image, signal) {
        const digests = image.hashes.flatMap((hash) => {
            const digest = createFitDigest(hash.algo);
            return digest === undefined ? [] : [{ hash, digest }];
        });
        if (digests.length === 0)
            return;
        const { handle } = await this.#source.read(signal);
        if (image.size > 0)
            for await (const chunk of readFileHandleChunks(handle, {
                start: image.start,
                end: image.start + image.size - 1,
                signal,
                cancellationFailure,
            })) {
                this.#assertOpen(signal);
                for (const { digest } of digests)
                    digest.update(chunk);
            }
        for (const { hash, digest } of digests) {
            const computed = digest.digest();
            if (!computed.equals(hash.value))
                throw new ArtifactReaderFailure("integrity", `FIT image ${image.name} ${hash.node} ${hash.algo} does not match: declared ${hash.value.toString("hex")}, computed ${computed.toString("hex")}`);
        }
    }
    #imageStream(entry, signal) {
        let bytes = 0;
        const check = async () => {
            if (bytes !== entry.declaredSize)
                throw new ArtifactReaderFailure("format", `FIT image ended early: ${entry.path}`);
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
                    : new Error("FIT read failed", { cause })));
            },
        });
    }
}
const cancellationFailure = (reason) => new ArtifactReaderFailure("cancelled", "FIT read cancelled", {
    cause: reason,
});
