import { Readable } from "node:stream";
import { finished, pipeline } from "node:stream/promises";
import { createInflateRaw } from "node:zlib";
import { ArtifactFileSource } from "./ArtifactFileSource.js";
import { ArtifactResourceScope } from "./ArtifactResourceScope.js";
import { readFileHandleChunks } from "../filesystem/readFileHandleChunks.js";
import { abortIfNeeded } from "./ArtifactHash.js";
import { ArtifactReaderFailure, copyArtifactEntry, sameArtifactEntry, } from "./ArtifactReader.js";
import { findDotnetBundleHeader, readDotnetBundle, } from "./dotnet/DotnetBundle.js";
/** Stable, range-streamed .NET bundle reader; extraction paths remain owned by SafeOutputTree. */
export class DotnetBundleArtifactReader {
    format = "dotnet-bundle";
    #source;
    #scope = new ArtifactResourceScope();
    #admission;
    #bundle;
    #closed = false;
    #entries = new Map();
    #streams = new Set();
    constructor(path, admitted) {
        if (admitted !== undefined && "kind" in admitted) {
            this.#admission = admitted;
            this.#source = new ArtifactFileSource(path, ".NET bundle", admitted.source);
        }
        else
            this.#source = new ArtifactFileSource(path, ".NET bundle", admitted);
    }
    /** Bind extraction to the whole host that produced its inventory snapshot. */
    async prepareContainer(expectedSha256, signal) {
        await this.#scope.run(async () => {
            this.#assertOpen(signal);
            await this.#source.bindSelectedPathSha256(expectedSha256, signal);
        });
    }
    async *entries(signal) {
        const bundle = await this.#scope.run(async () => {
            this.#assertOpen(signal);
            const source = await this.#source.readSelectedPath(signal);
            if (this.#bundle === undefined) {
                const header = this.#admission?.headerOffset ??
                    (await findDotnetBundleHeader(source.handle, source.initial.size, signal));
                if (header === undefined)
                    throw new ArtifactReaderFailure("format", "Selected file has no .NET bundle header");
                this.#bundle = await readDotnetBundle(source.handle, source.initial.size, header, signal);
                this.#admission = undefined;
            }
            await this.#source.readSelectedPath(signal);
            return this.#bundle;
        });
        this.#entries.clear();
        for (const [index, file] of bundle.files.entries()) {
            this.#assertOpen(signal);
            const entry = {
                path: file.path,
                kind: "file",
                declaredSize: file.size,
                compressedSize: file.compressedSize || null,
                byteOffset: file.offset,
                byteLength: file.compressedSize || file.size,
                executable: false,
                encrypted: false,
                declaredIntegrity: null,
                unpacked: false,
                adapterKey: String(index),
                formatMetadata: {
                    kind: "dotnet-bundle-entry",
                    major_version: bundle.majorVersion,
                    minor_version: bundle.minorVersion,
                    file_type: file.fileType,
                },
                limitations: [
                    ".NET bundle file types are declarations, not proof of assembly validity or executable authority.",
                    ...(file.fileType > 5
                        ? [
                            `Unknown .NET bundle file type ${file.fileType}; bytes are retained without interpreting the type.`,
                        ]
                        : []),
                ],
            };
            this.#entries.set(entry.adapterKey, {
                entry: copyArtifactEntry(entry),
                file,
            });
            yield entry;
        }
        await this.#source.readSelectedPath(signal);
    }
    async open(entry, signal) {
        return this.#scope.run(async () => {
            this.#assertOpen(signal);
            const source = await this.#source.readSelectedPath(signal);
            this.#assertOpen(signal);
            const selected = this.#entries.get(entry.adapterKey);
            if (selected === undefined || !sameArtifactEntry(entry, selected.entry))
                throw new ArtifactReaderFailure("integrity", "Selected .NET bundle entry differs from its observed manifest");
            const stream = Readable.from(this.#readMember(source, selected.file, signal), { objectMode: false });
            this.#streams.add(stream);
            stream.once("close", () => this.#streams.delete(stream));
            return stream;
        });
    }
    provenance() {
        return [];
    }
    async close() {
        this.#closed = true;
        for (const stream of this.#streams)
            stream.destroy();
        await this.#scope.close();
        await Promise.all([...this.#streams].map((stream) => finished(stream).catch(() => undefined)));
        await this.#source.close();
        this.#entries.clear();
        this.#admission = undefined;
        this.#bundle = undefined;
    }
    #assertOpen(signal) {
        abortIfNeeded(signal);
        if (this.#closed)
            throw new ArtifactReaderFailure("unavailable", ".NET bundle reader is closed");
    }
    async *#readMember(source, file, signal) {
        const storedBytes = file.compressedSize || file.size;
        const input = storedBytes === 0
            ? Readable.from([])
            : readFileHandleChunks(source.handle, {
                start: file.offset,
                end: file.offset + storedBytes - 1,
                signal,
            });
        const inflater = file.compressedSize === 0 ? undefined : createInflateRaw();
        const decoded = inflater ?? input;
        const pumping = inflater === undefined ? undefined : pipeline(input, inflater);
        // Observe early pipeline rejections while the output iterator is still reading.
        void pumping?.catch(() => undefined);
        let bytes = 0;
        try {
            for await (const raw of decoded) {
                abortIfNeeded(signal);
                const chunk = raw;
                bytes += chunk.length;
                if (bytes > file.size)
                    throw new ArtifactReaderFailure("limit", `.NET bundle entry expands beyond its declared size: ${file.path}`);
                yield chunk;
            }
            await pumping;
            if (bytes !== file.size ||
                (inflater !== undefined && inflater.bytesWritten !== storedBytes))
                throw new ArtifactReaderFailure("format", `.NET bundle member length or compressed extent does not match its declaration: ${file.path}`);
            await this.#source.readSelectedPath(signal);
        }
        catch (cause) {
            abortIfNeeded(signal);
            if (cause instanceof ArtifactReaderFailure)
                throw cause;
            const malformedCompression = inflater !== undefined &&
                cause instanceof Error &&
                "code" in cause &&
                ["Z_DATA_ERROR", "Z_BUF_ERROR"].includes(String(cause.code));
            throw new ArtifactReaderFailure(malformedCompression ? "format" : "io", `Could not read .NET bundle member: ${file.path}`, { cause });
        }
        finally {
            input.destroy();
            decoded.destroy();
            await pumping?.catch(() => undefined);
        }
    }
}
