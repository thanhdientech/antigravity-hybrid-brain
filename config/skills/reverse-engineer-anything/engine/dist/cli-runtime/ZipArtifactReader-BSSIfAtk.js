import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ArtifactReaderFailure, NonRegularFileReadError, OwnedFileHandle, RegularFileAdmissionFailure, RegularFileChangedError, RegularFileOperationCancelled, copyArtifactEntry, init_ArtifactReader, init_OwnedFileHandle, init_RegularFile, openRegularFile, sameArtifactEntry, sameRegularFileState } from "./ArtifactReader-DJ9rniiL.js";
import { artifactIntegrityDetails, init_artifactIntegrity } from "./javascriptAnalysisResourceControls-CEcnXNLc.js";
import { artifactSelectedPathErrno, assertArtifactReadActive, init_ArtifactFileOperation } from "./ArtifactFileOperation-YawaP_UN.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-C6Clg7Wy.js";
import { init_readFileHandleRange, readFileHandleRange } from "./readFileHandleRange-BmDM59_X.js";
import { init_readFileHandleChunks, readFileHandleChunks } from "./readFileHandleChunks-Cuq9fZuV.js";
import { hashReadable, init_ArtifactHash } from "./ArtifactHash-CV4Xsn55.js";
import { lstat } from "node:fs/promises";
import { constants, createZstdDecompress } from "node:zlib";
import { once } from "node:events";
import { Duplex, PassThrough } from "node:stream";
import { ERR_AMBIGUOUS_ARCHIVE, ERR_BAD_FORMAT, ERR_CENTRAL_DIRECTORY_NOT_FOUND, ERR_ENCRYPTED_CENTRAL_DIRECTORY, ERR_ENTRY_DATA_OUT_OF_BOUNDS, ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND, ERR_EOCDR_NOT_FOUND, ERR_EXTRAFIELD_ZIP64_NOT_FOUND, ERR_INVALID_COMPRESSED_DATA, ERR_INVALID_CRC32, ERR_INVALID_UNCOMPRESSED_SIZE, ERR_LOCAL_FILE_HEADER_NOT_FOUND, ERR_OVERLAPPING_ENTRY, ERR_SPLIT_ZIP_FILE, ERR_UNSUPPORTED_COMPRESSION, ERR_UNSUPPORTED_ENCRYPTION, ERR_UNSUPPORTED_UINT64, Reader, ZipReader, registerCodec } from "@zip.js/zip.js";

//#region dist/domain/artifactExpansionBudget.js
var ARTIFACT_EXPANSION_RATIO, MINIMUM_ARTIFACT_EXPANDED_BYTES, artifactExpansionBudgetBytes;
function init_artifactExpansionBudget() {
	return (init_artifactExpansionBudget = __esmMin((() => {
		ARTIFACT_EXPANSION_RATIO = 500;
		MINIMUM_ARTIFACT_EXPANDED_BYTES = 256 * 1024 * 1024;
		artifactExpansionBudgetBytes = (archiveBytes) => Math.max(MINIMUM_ARTIFACT_EXPANDED_BYTES, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(archiveBytes) * 500));
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactFileAdmission.js
var artifactFileAdmissionFailure;
function init_ArtifactFileAdmission() {
	return (init_ArtifactFileAdmission = __esmMin((() => {
		init_RegularFile();
		init_ArtifactReader();
		artifactFileAdmissionFailure = (path, diagnosticLabel, cause) => {
			if (cause instanceof ArtifactReaderFailure) return cause;
			if (cause instanceof RegularFileOperationCancelled) return new ArtifactReaderFailure("cancelled", `${diagnosticLabel} admission cancelled`, { cause: cause.reason });
			if (cause instanceof RegularFileAdmissionFailure) return ArtifactReaderFailure.withCleanup(artifactFileAdmissionFailure(path, diagnosticLabel, cause.cause), ArtifactReaderFailure.cleanupObservation(cause.cleanupCause, path));
			if (cause instanceof RegularFileChangedError) return new ArtifactReaderFailure("integrity", `${diagnosticLabel} source changed during admission: ${path}`, { cause });
			if (cause instanceof NonRegularFileReadError) return new ArtifactReaderFailure("format", `${diagnosticLabel} source is not a regular file: ${path}`, { cause });
			return new ArtifactReaderFailure("io", cause instanceof Error ? cause.message : `Cannot admit ${diagnosticLabel} source: ${path}`, { cause });
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactFileSource.js
var assertArtifactFileSelectedSource, ArtifactFileSource;
function init_ArtifactFileSource() {
	return (init_ArtifactFileSource = __esmMin((() => {
		init_artifactIntegrity();
		init_OwnedFileHandle();
		init_readFileHandleChunks();
		init_RegularFile();
		init_ArtifactFileOperation();
		init_ArtifactFileAdmission();
		init_ArtifactHash();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		assertArtifactFileSelectedSource = async (path, source, diagnosticLabel) => {
			const [observed, selected] = await Promise.all([source.handle.stat(), lstat(path).catch((cause) => {
				if (artifactSelectedPathErrno(cause) !== undefined) throw new ArtifactReaderFailure("integrity", `${diagnosticLabel} source identity changed: ${path}`, { cause });
				throw cause;
			})]);
			if (!sameRegularFileState(source.initial, observed) || !sameRegularFileState(source.initial, selected)) throw new ArtifactReaderFailure("integrity", `${diagnosticLabel} source identity changed: ${path}`);
		};
		ArtifactFileSource = class {
			path;
			diagnosticLabel;
			admitted;
			#scope = new ArtifactResourceScope();
			#owner;
			#opening;
			#boundSha256;
			constructor(path, diagnosticLabel, admitted) {
				this.path = path;
				this.diagnosticLabel = diagnosticLabel;
				this.admitted = admitted;
				this.#scope.addCloseHook(async () => {
					if (this.#owner !== undefined) {
						await this.#owner.close();
						this.#owner = undefined;
					}
					this.#opening = undefined;
					this.#boundSha256 = undefined;
				});
			}
			/** Verify the admitted descriptor; the selected pathname is not reinterpreted. */
			read(signal) {
				return this.#scope.run(() => this.#verify(signal));
			}
			/** Verify both the descriptor and the file currently at the caller-selected path. */
			readSelectedPath(signal) {
				return this.#scope.run(() => this.#verifySelectedPath(signal));
			}
			/** Bind verified bytes to the inventory's expected whole-carrier identity. */
			bindSha256(expectedSha256, signal) {
				return this.#scope.run(() => this.#bind(expectedSha256, signal, () => this.#verify(signal), () => this.#verify()));
			}
			/** Bind carrier bytes while the selected pathname continues to name the same source. */
			bindSelectedPathSha256(expectedSha256, signal) {
				return this.#scope.run(() => this.#bind(expectedSha256, signal, () => this.#verifySelectedPath(signal), () => this.#verifySelectedPath()));
			}
			/** Join admitted operations before closing; failed descriptor ownership stays retained. */
			close() {
				return this.#scope.close();
			}
			async #bind(expectedSha256, signal, verify, verifyCompletion) {
				const { handle } = await verify();
				const observed = this.#boundSha256 ?? (await hashReadable(readFileHandleChunks(handle, {
					signal,
					cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", `${this.diagnosticLabel} verification cancelled`, { cause: reason })
				}), signal)).sha256;
				await verifyCompletion();
				if (observed !== expectedSha256) throw new ArtifactReaderFailure("integrity", `${this.diagnosticLabel} carrier changed after inventory`, undefined, artifactIntegrityDetails(".", {
					algorithm: "sha256",
					digest: expectedSha256
				}, observed, false));
				assertArtifactReadActive(signal);
				this.#boundSha256 = observed;
			}
			async #verify(signal) {
				assertArtifactReadActive(signal);
				this.#opening ??= this.#admit(signal);
				const source = await this.#opening;
				const observed = await source.handle.stat();
				if (!sameRegularFileState(source.initial, observed)) throw new ArtifactReaderFailure("integrity", `${this.diagnosticLabel} source identity changed: ${this.path}`);
				assertArtifactReadActive(signal);
				return source;
			}
			async #verifySelectedPath(signal) {
				assertArtifactReadActive(signal);
				this.#opening ??= this.#admit(signal);
				const source = await this.#opening;
				await assertArtifactFileSelectedSource(this.path, source, this.diagnosticLabel);
				assertArtifactReadActive(signal);
				return source;
			}
			async #admit(signal) {
				try {
					if (this.admitted !== undefined) return {
						handle: this.admitted.handle,
						initial: this.admitted.initial
					};
					const source = await openRegularFile(this.path, {
						symlinks: "reject",
						signal
					});
					this.#owner = new OwnedFileHandle(source.handle);
					return source;
				} catch (cause) {
					if (cause instanceof RegularFileAdmissionFailure) this.#owner = cause.owner;
					throw artifactFileAdmissionFailure(this.path, this.diagnosticLabel, cause);
				}
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/ZipArtifactReader.js
async function* typedZipFailures(source) {
	try {
		yield* source;
	} catch (cause) {
		throw typedZipFailure(cause);
	}
}
var ZIP_UTF8_DECODER, ZipZstandardDecompressionStream, NodeFileReader, ZipArtifactReader, projectZipEntry, legacyNameLimitations, decodeZipEntryText, CP437_HIGH_HALF, decodeCp437, zipEntryPath, decodeStrictZipUtf8, extractStream, ZIP_FAILURE_REASONS, typedZipFailure, toError;
function init_ZipArtifactReader() {
	return (init_ZipArtifactReader = __esmMin((() => {
		init_ArtifactFileOperation();
		init_ArtifactReader();
		init_artifactExpansionBudget();
		init_ArtifactFileSource();
		init_readFileHandleRange();
		ZIP_UTF8_DECODER = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
		ZipZstandardDecompressionStream = class {
			readable;
			writable;
			constructor(_format, options) {
				const stream = Duplex.toWeb(createZstdDecompress({
					chunkSize: options?.chunkSize,
					params: { [constants.ZSTD_d_windowLogMax]: 27 }
				}));
				this.readable = stream.readable;
				this.writable = stream.writable;
			}
		};
		registerCodec({
			compressionMethod: 93,
			format: "rea-zip-zstd",
			DecompressionStream: ZipZstandardDecompressionStream
		});
		NodeFileReader = class extends Reader {
			path;
			maximumReadBytes;
			#handle;
			#source;
			#initPromise;
			constructor(path, maximumReadBytes, admitted) {
				super(path);
				this.path = path;
				this.maximumReadBytes = maximumReadBytes;
				this.#source = new ArtifactFileSource(path, "ZIP", admitted);
			}
			init() {
				this.#initPromise ??= this.#initialize();
				return this.#initPromise;
			}
			async #initialize() {
				const source = await this.#source.read();
				this.#handle = source.handle;
				this.size = source.initial.size;
			}
			async verify() {
				await this.#source.read();
			}
			async readUint8Array(index, length) {
				await this.verify();
				const handle = this.#handle;
				if (handle === undefined) throw new Error("ZIP reader is not initialized");
				const readBytes = Math.min(length, this.size - index);
				if (readBytes < 0) throw new ArtifactReaderFailure("format", `ZIP archive is malformed: read at ${index} extends beyond the ${this.size}-byte archive`);
				if (this.maximumReadBytes !== undefined && readBytes > this.maximumReadBytes) throw new ArtifactReaderFailure("limit", `ZIP metadata read requires ${readBytes} bytes, exceeding the ${this.maximumReadBytes}-byte read budget`);
				const bytes = await readFileHandleRange(handle, index, readBytes);
				if (bytes.length !== readBytes) throw new ArtifactReaderFailure("integrity", `ZIP source ended before its admitted extent: ${this.path}`);
				await this.verify();
				return bytes;
			}
			async closeHandle() {
				await this.#initPromise?.catch(() => undefined);
				await this.#source.close();
				this.#handle = undefined;
			}
		};
		ZipArtifactReader = class {
			format;
			#source;
			#reader;
			#streams = new Map();
			#enumerations = new Set();
			#closing = false;
			#closePromise;
			#entries = new Map();
			/** Optionally bound each metadata read before allocating its backing buffer. */
			constructor(path, format, maximumMetadataReadBytes, admitted) {
				this.format = format;
				this.#source = new NodeFileReader(path, maximumMetadataReadBytes, admitted);
				this.#reader = new ZipReader(this.#source, {
					checkSignature: true,
					checkOverlappingEntry: true,
					filenameEncoding: "cp437",
					filenameValidation: "tolerant"
				});
			}
			async *entries(signal) {
				this.#assertOpen(signal);
				let index = 0;
				let declaredFileBytes = 0;
				const enumeration = typedZipFailures(this.#reader.getEntriesGenerator({ decodeText: decodeZipEntryText }));
				this.#enumerations.add(enumeration);
				try {
					for await (const entry of enumeration) {
						await this.#source.verify();
						this.#assertOpen(signal);
						const metadata = projectZipEntry(entry, index++);
						if (metadata === undefined) continue;
						if (metadata.kind === "file" && !metadata.encrypted && metadata.declaredSize !== null && Number.isSafeInteger(metadata.declaredSize) && metadata.declaredSize >= 0) {
							declaredFileBytes += metadata.declaredSize;
							const budget = artifactExpansionBudgetBytes(this.#source.size);
							if (declaredFileBytes > budget) throw new ArtifactReaderFailure("limit", `ZIP entries declare ${String(declaredFileBytes)} uncompressed bytes, exceeding this archive's ${String(budget)}-byte decompression budget (${String(MINIMUM_ARTIFACT_EXPANDED_BYTES)}-byte minimum, ${String(500)}x archive size); a small archive cannot expand this far`);
						}
						const stored = this.#entries.get(metadata.adapterKey);
						if (stored !== undefined && !sameArtifactEntry(metadata, stored.metadata)) throw new ArtifactReaderFailure("integrity", `ZIP member identity changed during enumeration: ${entry.filename}`);
						if (stored === undefined) this.#entries.set(metadata.adapterKey, {
							source: entry,
							metadata: copyArtifactEntry(metadata)
						});
						yield metadata;
					}
					await this.#source.verify();
				} finally {
					this.#enumerations.delete(enumeration);
				}
			}
			open(entry, signal) {
				this.#assertOpen(signal);
				const stored = this.#entries.get(entry.adapterKey);
				if (stored === undefined || !sameArtifactEntry(entry, stored.metadata)) return Promise.reject(new ArtifactReaderFailure("integrity", "ZIP entry metadata does not match this reader's inventory"));
				const source = stored.source;
				if (source.directory || source.symlink) return Promise.reject(new ArtifactReaderFailure("format", "ZIP entry is not a regular file"));
				if (source.encrypted) return Promise.reject(new ArtifactReaderFailure("unavailable", "Encrypted ZIP entry is unsupported"));
				const { output, completion } = extractStream(source, () => this.#source.verify(), signal);
				this.#streams.set(output, completion);
				output.once("close", () => {
					void completion.then(() => this.#streams.delete(output));
				});
				return Promise.resolve(output);
			}
			close() {
				this.#closing = true;
				this.#closePromise ??= this.#close().finally(() => {
					this.#closePromise = undefined;
				});
				return this.#closePromise;
			}
			async #close() {
				for (const output of this.#streams.keys()) output.destroy(new ArtifactReaderFailure("unavailable", "ZIP reader closed"));
				const outcomes = await Promise.allSettled([...this.#streams.values(), ...Array.from(this.#enumerations, (enumeration) => enumeration.return())]);
				this.#enumerations.clear();
				await this.#reader.close().catch(() => undefined);
				const failures = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
				try {
					await this.#source.closeHandle();
					this.#entries.clear();
				} catch (cause) {
					failures.push(cause);
				}
				if (failures.length === 1) throw failures[0];
				if (failures.length > 1) throw new AggregateError(failures, "ZIP reader cleanup failed");
			}
			#assertOpen(signal) {
				assertArtifactReadActive(signal);
				if (this.#closing) throw new ArtifactReaderFailure("unavailable", "ZIP reader is closed");
			}
			provenance() {
				return [];
			}
		};
		projectZipEntry = (entry, index) => {
			const kind = entry.symlink ? "symlink" : entry.directory ? "directory" : "file";
			const sourcePath = zipEntryPath(entry);
			const path = sourcePath.replace(/^(?:\.\/)+/u, "");
			if (kind === "directory" && (path === "" || path === ".")) return undefined;
			return {
				path,
				...path === sourcePath ? {} : { sourcePath },
				kind,
				declaredSize: kind === "directory" ? null : entry.uncompressedSize,
				compressedSize: kind === "directory" ? null : entry.compressedSize,
				executable: entry.executable,
				encrypted: entry.encrypted,
				byteOffset: null,
				declaredIntegrity: null,
				unpacked: false,
				limitations: [
					...kind === "symlink" ? ["Archive symlink target was not read."] : [],
					...path === sourcePath ? [] : [`ZIP member name ${JSON.stringify(sourcePath)} has a leading current-directory prefix omitted from its logical path.`],
					...legacyNameLimitations(entry)
				],
				adapterKey: `zip-entry:${index}`
			};
		};
		legacyNameLimitations = (entry) => {
			if (entry.filenameUTF8 || entry.extraFieldUnicodePath?.valid === true) return [];
			const bytes = entry.rawFilename;
			if (!bytes.some((byte) => byte >= 128)) return [];
			const hex = Buffer.from(bytes).toString("hex");
			return [`ZIP name uses CP437 fallback; source encoding unverified; raw hex: ${hex}.`];
		};
		decodeZipEntryText = (bytes, encoding, type) => {
			if (type !== "filename") return undefined;
			if (encoding === "utf-8") return decodeStrictZipUtf8(bytes, "ZIP filename is not valid UTF-8");
			return encoding === "cp437" ? decodeCp437(bytes) : undefined;
		};
		CP437_HIGH_HALF = "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■\xA0";
		decodeCp437 = (bytes) => Array.from(bytes, (byte) => byte < 128 ? String.fromCharCode(byte) : CP437_HIGH_HALF.charAt(byte - 128)).join("");
		zipEntryPath = (entry) => {
			const field = entry.extraFieldUnicodePath;
			if (field?.valid !== true) return entry.filename;
			return decodeStrictZipUtf8(field.data.subarray(5), "ZIP Unicode Path extra field is not valid UTF-8");
		};
		decodeStrictZipUtf8 = (bytes, message) => {
			try {
				return ZIP_UTF8_DECODER.decode(bytes);
			} catch (cause) {
				throw new ArtifactReaderFailure("format", message, { cause });
			}
		};
		extractStream = (entry, verifySource, signal) => {
			const output = new PassThrough();
			output.on("error", () => undefined);
			const controller = new AbortController();
			const onAbort = () => {
				controller.abort(signal?.reason);
				output.destroy(new ArtifactReaderFailure("cancelled", "ZIP operation cancelled", { cause: signal?.reason }));
			};
			signal?.addEventListener("abort", onAbort, { once: true });
			output.once("close", () => {
				signal?.removeEventListener("abort", onAbort);
				controller.abort();
			});
			const writable = new WritableStream({
				write: async (chunk) => {
					assertArtifactReadActive(signal);
					if (!output.write(Buffer.from(chunk))) await once(output, "drain", { signal: controller.signal });
				},
				close: async () => {
					await verifySource();
					assertArtifactReadActive(signal);
					output.end();
				},
				abort: (reason) => {
					output.destroy(toError(typedZipFailure(reason, entry.compressionMethod)));
				}
			});
			const completion = verifySource().then(() => entry.getData(writable, {
				signal: controller.signal,
				checkSignature: true,
				checkOverlappingEntry: true,
				onprogress: () => assertArtifactReadActive(signal)
			})).then(() => undefined, (cause) => {
				output.destroy(toError(typedZipFailure(cause, entry.compressionMethod)));
			});
			return {
				output,
				completion
			};
		};
		ZIP_FAILURE_REASONS = new Map([...[
			ERR_AMBIGUOUS_ARCHIVE,
			ERR_BAD_FORMAT,
			ERR_CENTRAL_DIRECTORY_NOT_FOUND,
			ERR_ENTRY_DATA_OUT_OF_BOUNDS,
			ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND,
			ERR_EOCDR_NOT_FOUND,
			ERR_EXTRAFIELD_ZIP64_NOT_FOUND,
			ERR_INVALID_COMPRESSED_DATA,
			ERR_INVALID_CRC32,
			ERR_INVALID_UNCOMPRESSED_SIZE,
			ERR_LOCAL_FILE_HEADER_NOT_FOUND,
			ERR_OVERLAPPING_ENTRY,
			ERR_UNSUPPORTED_UINT64
		].map((message) => [message, "format"]), ...[
			ERR_ENCRYPTED_CENTRAL_DIRECTORY,
			ERR_SPLIT_ZIP_FILE,
			ERR_UNSUPPORTED_COMPRESSION,
			ERR_UNSUPPORTED_ENCRYPTION
		].map((message) => [message, "unavailable"])]);
		typedZipFailure = (cause, compressionMethod) => {
			if (!(cause instanceof Error) || cause instanceof ArtifactReaderFailure) return cause;
			const code = "code" in cause ? cause.code : undefined;
			if (compressionMethod === 93 && code === "ZSTD_error_dictionary_wrong") return new ArtifactReaderFailure("unavailable", "ZIP archive uses an unsupported Zstandard dictionary", { cause });
			const invalidZstandard = compressionMethod === 93 && (code === "ZSTD_error_prefix_unknown" || code === "ZSTD_error_checksum_wrong" || code === "ZSTD_error_corruption_detected" || code === "ZSTD_error_dictionary_corrupted" || code === "ZSTD_error_frameParameter_unsupported" || code === "ZSTD_error_frameParameter_windowTooLarge" || code === "Z_BUF_ERROR");
			const reason = ZIP_FAILURE_REASONS.get(cause.message) ?? (invalidZstandard ? "format" : undefined);
			if (reason === undefined) return cause;
			return new ArtifactReaderFailure(reason, reason === "format" ? `ZIP archive is malformed: ${invalidZstandard ? ERR_INVALID_COMPRESSED_DATA : cause.message}` : `ZIP archive uses an unsupported feature: ${cause.message}`, { cause });
		};
		toError = (cause) => cause instanceof Error ? cause : new Error("ZIP extraction failed");
	})))();
}

//#endregion
export { ArtifactFileSource, ZipArtifactReader, artifactExpansionBudgetBytes, artifactFileAdmissionFailure, assertArtifactFileSelectedSource, init_ArtifactFileAdmission, init_ArtifactFileSource, init_ZipArtifactReader, init_artifactExpansionBudget };