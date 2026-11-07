import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { ArtifactEntryContentUnavailable, ArtifactReaderFailure, NonRegularFileReadError, OwnedFileHandle, RegularFileAdmissionFailure, RegularFileChangedError, artifactFixedLimitFailure, assertStableRegularFileIdentity, copyArtifactEntry, init_ArtifactReader, init_OwnedFileHandle, init_OwnedRegularFile, init_RegularFile, openRegularFile, regularFileCancellation, regularFileState, sameArtifactEntry, sameRegularFileState } from "./ArtifactReader-DJ9rniiL.js";
import { fixedAllowanceRemediation, init_fixedAllowanceRemediation } from "./fixedAllowanceRemediation-Gm2892s1.js";
import { ARTIFACT_FORMAT_IDS, ESP_PARTITION_TABLE_SECTOR_BYTES, ESP_SIGNATURE_BLOCK_BYTES, MAX_DEVICETREE_FILE_BYTES, MAX_INSPECT_PE_DIRECTORY_ENTRIES, MAX_INSPECT_PE_FILE_BYTES, ZIP_NON_ENTRY_LIMITATION, ZIP_PACKAGE_FORMATS, artifactContradictionId, artifactEdgeId, artifactGraphDigest, artifactIdForContent, artifactInventoryResultSchema, artifactManifestId, compareUnicodeCodePoints, digestCanonicalValue, espBootPartitions, espPartitionSubtypeName, espPartitionTypeName, espPrimaryLayoutRole, firstUnerased, hasZipSignature, hex, init_artifactGraph, init_artifactIdentity, init_canonicalDigest, init_devicetree, init_espImageStructures, init_espPartitionTable, init_inesContainer, init_javascriptArtifactFiles, init_jsonValueByteLength, init_machoCpuIdentity, init_peResources, init_unicodeCodePointOrder, init_zipPackageFormat, isEspAppPartition, isJavaScriptSourcePath, isZipPackageFormat, jsonValueByteLength, locateTrailingZipArchive, logicalPathNfc, machoArchitectureFamily, machoCpuSubtypeBase, nesContainerFormat, occurrenceIdForLocation, offsetText, parseInesLayout, u32, zipPackageFormatForPath, zipRootPackageFormat } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { artifactContainerIntegrityDetails, artifactIntegrityDetails, artifactIntegrityPair, init_artifactIntegrity } from "./javascriptAnalysisResourceControls-CEcnXNLc.js";
import { appendCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { assertArtifactReadActive, init_ArtifactFileOperation } from "./ArtifactFileOperation-YawaP_UN.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-C6Clg7Wy.js";
import { BinaryFormatFailure, BinaryResourceFailure, init_BinaryContainer } from "./BinaryContainer-ko58VRqA.js";
import { DevicetreeLimitFailure, DirectoryArtifactEntryAccessDenied, DirectoryArtifactReader, assertArtifactSelectedSource, decodeLz4Block, decodeMarshalUtf8, elfNoteAlignment, elfNoteLayout, hasPeResourceName, hostExecutableMarking, init_ArtifactFileRange, init_ArtifactSelectedSource, init_DevicetreeParser, init_DirectoryArtifactReader, init_GodotPckLocation, init_Lz4Block, init_PeResourceLayout, init_PeResourceParser, init_elfNoteLayout, init_hostExecutableMarking, init_marshalUtf8, init_pythonBytecodeIdentity, locateGodotPck, observePythonBytecodePrefix, parseDevicetree, parsePeResources, readArtifactFileBytes, readElfNoteHeader, readPeResourceLayout } from "./DevicetreeParser-Bhfj4kUz.js";
import { init_dosMz, observeMzWindowsHeader, parseMzHeaderEvidence } from "./peOptionalHeader-DFX4E6Yt.js";
import { ESP8266_REFUSAL, ESP_CHIP_TABLE_SOURCE, ESP_IMAGE_LIMITATIONS, HEX_RECORD_ENCODING_LABELS, UIMAGE_MAGIC, UIMAGE_MULTI_TABLE_WINDOW, UNITYFS_HEADER_STRING_MAX, UNITYFS_SIGNATURE, artifactNameForClassification, claimsExecutableHeader, createEspImageDecoder, createHexRecordDecoder, createUf2Decoder, detectHexRecordEncoding, espChipForId, espFlashDumpOrigin, hasDiskImageSignature, hasFitImagesNode, hasGodotPckHeader, hasUImageMagic, hasUImageSizeTable, hasUf2Block, hasUnityFsHeader, hasWxapkgEncryptedMagic, hasWxapkgHeader, init_artifactNameSelection, init_binaryTarget, init_diskImageFormat, init_elfProgramHeader, init_elfRawTableDeclarations, init_elfSectionHeader, init_espChips, init_espFlashLocation, init_espImage, init_espImageFacts, init_fitImage, init_godotPckFormat, init_hexRecords, init_uf2, init_uimageFormat, init_unityfsFormat, init_wxapkgFormat, locateEspFlashLayout, parseMultiImageTable, parseUImageHeaderFields, readElfProgramHeader, readElfRawTableDeclarations, readElfSectionHeader, readGodotPckHeaderFacts, readUnityFsHeaderFacts, readWxapkgHeaderFacts, recognizeEspImage, resolveWxapkgIndexLayouts, selectWxapkgIndexLayout, unityFsLayoutFlags } from "./espFlashLocation-BGP6V_tl.js";
import { init_elfFixedHeader, readElfFixedHeader } from "./peMachine-ZLBsjOQY.js";
import { init_readFileHandleRange, readFileHandleRange } from "./readFileHandleRange-BmDM59_X.js";
import { ExecFileOutputCancelledError, execFileOutput, execFileOutputFailure, init_ExecFileOutput } from "./ExecFileOutput-CjfCq1cQ.js";
import { init_readFileHandleChunks, readFileHandleChunks } from "./readFileHandleChunks-Cuq9fZuV.js";
import { init_readArtifactFileChunks, readArtifactFileChunks } from "./readArtifactFileChunks-wfySSpVr.js";
import { init_StreamBytes, streamChunkToBuffer } from "./StreamBytes-5y_bghjt.js";
import { admitAsarHeader, asarHeaderAdmissionFailure, init_AsarHeader, readAsarHeader } from "./AsarHeader-CcLQy135.js";
import { createDfuSeDecoder, hasBinaryPlistSignature, hasDfuSePrefix, hasXmlPlistSignature, init_appleArchiveFormat, init_dfuse, isDfuSeFile } from "./dfuse-Berfn6y4.js";
import { MachoLoadCommandCursor, classifyFatContainerEvidence, init_machoContainer, init_machoLoadCommands, readFatContainerHeader, readFatHeaderPrefix, readMachoHeaderPrefixFacts, readMachoLoadCommandTableHeader } from "./machoLoadCommands-B9RyDzRE.js";
import { ARTIFACT_CLASSIFICATION_PREFIX_BYTES, abortIfNeeded, createArtifactClassificationProbe, hashReadable, init_ArtifactClassificationProbe, init_ArtifactHash } from "./ArtifactHash-CV4Xsn55.js";
import { init_machoSectionHeader, readMachoSectionHeader } from "./machoSectionHeader-Dv0Z9dfl.js";
import { init_MachoLoadCommandReader, init_machoSegmentHeader, readMachoImage, readMachoSegmentHeader } from "./MachoLoadCommandReader-i7E7LXUs.js";
import { ArtifactPathRegistry, annotateEnglishUnicodeCaseCollisions, hasDestinationPath, init_ArtifactPaths, normalizeArtifactPath } from "./ArtifactPaths-pHh1q13p.js";
import { ArtifactFileSource, ZipArtifactReader, artifactExpansionBudgetBytes, artifactFileAdmissionFailure, init_ArtifactFileAdmission, init_ArtifactFileSource, init_ZipArtifactReader, init_artifactExpansionBudget } from "./ZipArtifactReader-BSSIfAtk.js";
import { asarDeclaredSizeSchema, asarNodeSchema, init_AsarNode } from "./AsarNode-yk_oPQSf.js";
import { LipoFieldRetentionError, XcrunCommandRunner, hashStableRootArtifact, hashStableRootArtifactHandle, init_CommandRunner, init_hashStableRootArtifact, init_lipo, openRootArtifact, parseLipoOutputResult, releaseRootArtifact } from "./hashStableRootArtifact-c9zqp67k.js";
import { constants, createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";
import { lstat, mkdtemp, open, realpath, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { z } from "zod";
import { setImmediate } from "node:timers/promises";
import { finished, pipeline } from "node:stream/promises";
import { crc32, createInflate, createInflateRaw } from "node:zlib";
import { Readable, Transform, pipeline as pipeline$1 } from "node:stream";
import { parse } from "plist";

//#region dist/artifacts/AsarFailure.js
var asarCancellationFailure, assertAsarReadActive, asarFailure, isFilesystemFailure;
function init_AsarFailure() {
	return (init_AsarFailure = __esmMin((() => {
		init_ArtifactReader();
		asarCancellationFailure = (reason) => new ArtifactReaderFailure("cancelled", "ASAR operation cancelled", { cause: reason });
		assertAsarReadActive = (signal) => {
			if (signal?.aborted === true) throw asarCancellationFailure(signal.reason);
		};
		asarFailure = (path, operation, cause) => {
			if (cause instanceof ArtifactReaderFailure) return cause;
			if (isFilesystemFailure(cause)) return new ArtifactReaderFailure("io", `Could not ${operation} ASAR at ${path}: ${cause.message}`, { cause });
			return new ArtifactReaderFailure("format", `Malformed ASAR during ${operation}: ${path}`, { cause });
		};
		isFilesystemFailure = (cause) => cause instanceof Error && "errno" in cause && typeof cause.errno === "number" && "syscall" in cause && typeof cause.syscall === "string";
	})))();
}

//#endregion
//#region dist/artifacts/AsarEntryStream.js
var closeAsarHandle, readValidatedAsarEntry;
function init_AsarEntryStream() {
	return (init_AsarEntryStream = __esmMin((() => {
		init_ArtifactReader();
		init_AsarFailure();
		closeAsarHandle = async (close, signal) => {
			await close();
			assertAsarReadActive(signal);
		};
		readValidatedAsarEntry = (source, expectedBytes, entryPath, archivePath, signal) => {
			const expectedExtent = expectedBytes === undefined ? undefined : BigInt(expectedBytes);
			const completionFailure = () => {
				const coverage = source.readCoverage();
				if (coverage.kind !== "complete") return new ArtifactReaderFailure("integrity", `ASAR entry read coverage is incomplete: ${entryPath}`);
				if (expectedExtent !== undefined && coverage.bytes !== expectedExtent) return new ArtifactReaderFailure("integrity", `ASAR entry size disagrees with its header: ${entryPath}`);
				if (signal?.aborted) return asarCancellationFailure(signal.reason);
				return undefined;
			};
			const output = Readable.from((async function* () {
				const iterator = source[Symbol.asyncIterator]();
				try {
					while (true) {
						const next = await iterator.next();
						if (next.done) break;
						const chunk = next.value;
						if (!Buffer.isBuffer(chunk) && !(chunk instanceof Uint8Array)) throw new ArtifactReaderFailure("format", `ASAR entry did not return bytes: ${entryPath}`);
						const coverage = source.readCoverage();
						if (expectedExtent !== undefined && coverage.bytes > expectedExtent) throw new ArtifactReaderFailure("integrity", `ASAR entry exceeded its declared size: ${entryPath}`);
						if (coverage.kind === "complete" && signal?.aborted) {
							const failure = completionFailure();
							if (failure !== undefined) throw failure;
						}
						yield chunk;
					}
					const failure = completionFailure();
					if (failure !== undefined) throw failure;
				} catch (cause) {
					throw asarFailure(archivePath, `read ${entryPath}`, cause);
				} finally {
					try {
						await iterator.return?.();
					} catch {}
					if (!source.destroyed) source.destroy();
				}
			})());
			output.on("error", () => undefined);
			const onSourceError = (cause) => {
				const completedCancellation = cause instanceof ArtifactReaderFailure && cause.reason === "cancelled" && source.readCoverage().kind === "complete" ? completionFailure() : undefined;
				output.destroy(completedCancellation ?? asarFailure(archivePath, `read ${entryPath}`, cause));
			};
			source.on("error", onSourceError);
			source.once("close", () => source.removeListener("error", onSourceError));
			const onAbort = () => {
				if (source.readCoverage().kind === "complete" && !output.destroyed && (source.errored === null || source.errored instanceof ArtifactReaderFailure && source.errored.reason === "cancelled")) {
					const failure = completionFailure();
					if (failure !== undefined) output.destroy(failure);
				}
			};
			signal?.addEventListener("abort", onAbort, { once: true });
			output.once("close", () => {
				signal?.removeEventListener("abort", onAbort);
				if (!source.destroyed) source.destroy();
			});
			if (signal?.aborted) onAbort();
			return output;
		};
	})))();
}

//#endregion
//#region dist/artifacts/AsarListing.js
function* ownChildren(files) {
	for (const name in files) if (Object.hasOwn(files, name)) yield [name, files[name]];
}
var MAX_LISTING_BYTES, BLOCK_INTEGRITY_LIMITATION, MAX_QUOTED_SOURCE_UNITS, quoteSource, asarListingNodeSchema, malformedMetadata, readDeclaredSize, parseArchiveOffset, readAsarListing;
function init_AsarListing() {
	return (init_AsarListing = __esmMin((() => {
		init_AsarNode();
		init_ArtifactReader();
		init_AsarFailure();
		init_unicodeCodePointOrder();
		MAX_LISTING_BYTES = 64 * 1024 * 1024;
		BLOCK_INTEGRITY_LIMITATION = "ASAR block integrity declarations were not validated. Whole-file digest comparison does not establish block integrity or Electron runtime acceptance.";
		MAX_QUOTED_SOURCE_UNITS = 256;
		quoteSource = (value) => value.length <= MAX_QUOTED_SOURCE_UNITS ? JSON.stringify(value) : `${JSON.stringify(value.slice(0, MAX_QUOTED_SOURCE_UNITS))}... (${String(value.length)} UTF-16 code units)`;
		asarListingNodeSchema = asarNodeSchema.extend({ size: z.unknown().optional() });
		malformedMetadata = (subject, error) => {
			const fields = [...new Set(error.issues.map((issue) => issue.path.length === 0 ? "entry" : issue.path.join(".")))].join(", ");
			return new ArtifactReaderFailure("format", `${subject} metadata is malformed (${fields})`, { cause: error });
		};
		readDeclaredSize = (value) => {
			if (value === undefined) return { size: null };
			const parsed = asarDeclaredSizeSchema.safeParse(value);
			if (parsed.success) return { size: parsed.data };
			if (typeof value === "number" && !(Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER)) return {
				size: null,
				limitation: "ASAR entry declares a numeric size outside the safe-integer range; its exact source value was not retained."
			};
			const declared = typeof value === "number" ? `size ${String(value)}` : typeof value === "string" ? `size ${quoteSource(value)}` : value === null ? "a null size" : Array.isArray(value) ? "an array size" : typeof value === "object" ? "an object size" : `a ${typeof value} size`;
			return {
				size: null,
				limitation: `ASAR entry declares ${declared}, which is not a non-negative safe integer.`
			};
		};
		parseArchiveOffset = (value) => {
			if (value === undefined || !/^(?:0|[1-9][0-9]*)$/u.test(value)) return undefined;
			const offset = Number(value);
			return Number.isSafeInteger(offset) ? offset : undefined;
		};
		readAsarListing = async (header, signal) => {
			const parsedRoot = asarListingNodeSchema.safeParse(header);
			if (!parsedRoot.success) throw malformedMetadata("ASAR root", parsedRoot.error);
			const root = parsedRoot.data;
			if (root.files === undefined) throw new ArtifactReaderFailure("format", "ASAR root has no files table");
			const entries = [];
			const pending = [{
				parent: "",
				children: ownChildren(root.files)
			}];
			let retainedBytes = 0;
			const admitRetainedBytes = (bytes) => {
				retainedBytes += bytes;
				if (retainedBytes > MAX_LISTING_BYTES) throw new ArtifactReaderFailure("limit", "ASAR expanded listing exceeds its 64 MiB representation budget");
			};
			let examined = 0;
			while (pending.length > 0) {
				if (examined++ % 128 === 0) {
					await setImmediate();
					assertAsarReadActive(signal);
				}
				const frame = pending.at(-1);
				if (frame === undefined) break;
				const next = frame.children.next();
				if (next.done) {
					pending.pop();
					continue;
				}
				const [name, raw] = next.value;
				if (name.length === 0 || name === "." || name === ".." || name.includes("/") || name.includes("\0") || process.platform === "win32" && name.includes("\\")) throw new ArtifactReaderFailure("path", `ASAR header has an unsafe path component under ${frame.parent.length === 0 ? "the archive root" : quoteSource(frame.parent)}: ${quoteSource(name)}`);
				const units = frame.parent.length + name.length + (frame.parent.length === 0 ? 0 : 1);
				admitRetainedBytes(units * 2 + 256);
				const path = frame.parent.length === 0 ? name : `${frame.parent}/${name}`;
				const parsed = asarListingNodeSchema.safeParse(raw);
				if (!parsed.success) throw malformedMetadata(`ASAR entry ${quoteSource(path)}`, parsed.error);
				const metadata = parsed.data;
				if (metadata.files === undefined && metadata.link === undefined && metadata.size === undefined) throw new ArtifactReaderFailure("format", `ASAR entry ${quoteSource(path)} has no directory, link or file metadata`);
				const declaration = metadata.integrity;
				const supportedIntegrity = declaration?.algorithm === "SHA256" && /^[a-f0-9]{64}$/u.test(declaration.hash);
				const limitations = [];
				const { size, limitation: sizeLimitation } = readDeclaredSize(metadata.size);
				if (sizeLimitation !== undefined) {
					admitRetainedBytes(sizeLimitation.length * 2 + 64);
					limitations.push(sizeLimitation);
				}
				if (declaration !== undefined && (Object.hasOwn(declaration, "blockSize") || Object.hasOwn(declaration, "blocks"))) {
					admitRetainedBytes(BLOCK_INTEGRITY_LIMITATION.length * 2 + 64);
					limitations.push(BLOCK_INTEGRITY_LIMITATION);
				}
				if (declaration !== undefined && !supportedIntegrity) {
					admitRetainedBytes((declaration.algorithm.length + declaration.hash.length) * 12 + 512);
					const reason = declaration.algorithm === "SHA256" ? "has an invalid digest representation" : "uses an unsupported algorithm";
					limitations.push(`ASAR integrity declaration ${reason}; no declaration comparison was performed: ${JSON.stringify({
						algorithm: declaration.algorithm,
						hash: declaration.hash
					})}.`);
				}
				const facts = {
					path,
					executable: metadata.executable === true,
					unpacked: metadata.unpacked === true,
					declaredIntegrity: supportedIntegrity ? {
						algorithm: "sha256",
						digest: declaration.hash
					} : null,
					limitations
				};
				if (metadata.files !== undefined || metadata.link !== undefined) entries.push({
					...facts,
					kind: metadata.files !== undefined ? "directory" : "symlink",
					size
				});
				else if (metadata.size !== undefined) entries.push({
					...facts,
					kind: "file",
					size,
					packedOffset: parseArchiveOffset(metadata.offset)
				});
				if (metadata.files !== undefined) pending.push({
					parent: path,
					children: ownChildren(metadata.files)
				});
			}
			return entries.sort((left, right) => compareUnicodeCodePoints(left.path, right.path));
		};
	})))();
}

//#endregion
//#region dist/artifacts/AsarArtifactReader.js
var AsarArtifactReader, defaultRemoveSnapshot, asarUnpackedEntryFailure, waitForOperation, isMissingFile;
function init_AsarArtifactReader() {
	return (init_AsarArtifactReader = __esmMin((() => {
		init_ArtifactSelectedSource();
		init_callerPath();
		init_artifactIntegrity();
		init_ArtifactReader();
		init_AsarEntryStream();
		init_AsarHeader();
		init_OwnedFileHandle();
		init_readArtifactFileChunks();
		init_AsarFailure();
		init_AsarListing();
		AsarArtifactReader = class {
			path;
			options;
			format = "asar";
			#extents;
			#selectedCanonicalSource;
			#entries = new Map();
			#ownedHandles = new Map();
			#snapshot;
			#snapshotRoot;
			#snapshotOperation = Promise.resolve();
			constructor(path, options = {}) {
				this.path = path;
				this.options = options;
			}
			async *entries(signal) {
				let paths;
				try {
					await this.prepareContainer(undefined, signal);
					paths = await this.#withSnapshotOperation(async () => {
						const snapshotPath = this.#snapshotPath();
						this.#resetArchiveState();
						this.#entries.clear();
						const admitted = await this.#admitHeader(snapshotPath, signal);
						this.#extents = {
							archiveBytes: admitted.archiveBytes,
							headerBytes: admitted.headerBytes,
							jsonBytes: admitted.jsonBytes
						};
						assertAsarReadActive(signal);
						try {
							return await readAsarListing(admitted.header, signal);
						} catch (cause) {
							if (cause instanceof ArtifactReaderFailure && (cause.reason === "format" || cause.reason === "path")) throw new ArtifactReaderFailure(cause.reason, `${cause.message} in ${this.path}`, { cause });
							throw cause;
						}
					}, signal);
				} catch (cause) {
					throw asarFailure(this.path, "inventory", cause);
				}
				for (const facts of paths) {
					assertAsarReadActive(signal);
					const { path, kind } = facts;
					const providerPath = path.split("/").join(sep);
					const entry = {
						path,
						kind,
						declaredSize: facts.size,
						compressedSize: null,
						executable: facts.executable,
						encrypted: false,
						byteOffset: null,
						declaredIntegrity: facts.declaredIntegrity,
						unpacked: facts.unpacked,
						limitations: [...facts.limitations, ...kind === "symlink" ? ["ASAR symlink target was not followed or disclosed."] : []],
						adapterKey: providerPath
					};
					if (facts.kind === "file") this.#entries.set(providerPath, {
						facts,
						entry: copyArtifactEntry(entry)
					});
					yield entry;
				}
			}
			async #admitHeader(snapshotPath, signal) {
				const headerHandle = await this.#openOwned(snapshotPath, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
				let admission;
				try {
					const extents = await admitAsarHeader(headerHandle, signal, this.options.headerAdmission);
					admission = {
						ok: true,
						value: {
							...extents,
							header: await readAsarHeader(headerHandle, extents, signal)
						}
					};
				} catch (cause) {
					admission = {
						ok: false,
						cause
					};
				}
				try {
					await this.#closeOwnedHandle(headerHandle);
				} catch (cleanupCause) {
					if (!admission.ok) throw ArtifactReaderFailure.withCleanup(admission.cause, ArtifactReaderFailure.cleanupObservation(cleanupCause, snapshotPath));
					throw cleanupCause;
				}
				if (!admission.ok) throw admission.cause;
				return admission.value;
			}
			async open(entry, signal) {
				return this.#withSnapshotOperation(() => this.#openEntry(entry, signal), signal);
			}
			async #openEntry(entry, signal) {
				assertAsarReadActive(signal);
				const state = this.#entries.get(entry.adapterKey);
				if (state === undefined && entry.kind !== "file") throw new ArtifactReaderFailure("format", "ASAR entry is not a regular file");
				if (state === undefined) throw new ArtifactReaderFailure("integrity", `ASAR entry was not produced by this reader: ${entry.path}`);
				if (!sameArtifactEntry(entry, state.entry)) throw new ArtifactReaderFailure("integrity", `ASAR entry metadata changed since inventory: ${state.entry.path}`);
				if (state.entry.unpacked) return this.#openUnpackedStream(state.entry, signal);
				return this.#openPackedStream(state, signal);
			}
			async #openPackedStream(state, signal) {
				const { facts, entry: producedEntry } = state;
				const archiveSize = this.#extents?.archiveBytes;
				const headerSize = this.#extents?.headerBytes;
				const offset = facts.packedOffset;
				const start = offset === undefined || headerSize === undefined ? undefined : 8 + headerSize + offset;
				if (facts.size === null) throw new ArtifactEntryContentUnavailable(`ASAR entry declares no readable size: ${producedEntry.path}`, "ASAR packed entry bytes were not read because its declared size cannot bound them; no content hash or child artifact was produced.", undefined, artifactIntegrityDetails(producedEntry.path, producedEntry.declaredIntegrity, null, false));
				if (archiveSize === undefined || start === undefined || !Number.isSafeInteger(start) || start > archiveSize || facts.size > archiveSize - start) throw new ArtifactReaderFailure("format", `ASAR entry range is outside its container: ${producedEntry.path}`);
				const snapshotPath = this.#snapshotPath();
				let handle;
				try {
					const openedHandle = await this.#openOwned(snapshotPath, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
					handle = openedHandle;
					const observed = await openedHandle.stat();
					assertAsarReadActive(signal);
					if (!observed.isFile() || observed.size !== archiveSize) throw new ArtifactReaderFailure("integrity", `ASAR container changed before read: ${producedEntry.path}`);
					if (facts.size === 0) {
						handle = undefined;
						await closeAsarHandle(() => this.#closeOwnedHandle(openedHandle), signal);
						return Readable.from([]);
					}
					const source = this.#ownedReadStream(openedHandle, {
						start,
						end: start + facts.size - 1,
						signal
					});
					handle = undefined;
					const output = readValidatedAsarEntry(source, facts.size, producedEntry.path, this.path, signal);
					this.#setOwnedOutput(openedHandle, output);
					return output;
				} catch (cause) {
					const failure = asarFailure(this.path, `read ${producedEntry.path}`, cause);
					if (handle !== undefined) {
						try {
							await this.#closeOwnedHandle(handle);
						} catch (cleanupCause) {
							throw ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cleanupCause, snapshotPath));
						}
					}
					throw failure;
				}
			}
			/** Capture once per reader lifetime; bind all interpretation to these exact bytes. */
			async prepareContainer(expectedSha256, signal) {
				await this.#withSnapshotOperation(async () => {
					assertAsarReadActive(signal);
					await this.#validateSelectedArchive();
					if (this.#snapshot === undefined && this.#snapshotRoot !== undefined) await this.#closeSnapshot();
					if (this.#snapshot === undefined) await this.#captureSnapshot(signal);
					if (expectedSha256 !== undefined && this.#snapshot?.sha256 !== expectedSha256) throw new ArtifactReaderFailure("integrity", `ASAR container changed before interpretation: ${this.path}`);
				}, signal);
			}
			/** Read the same captured container that supplies headers and packed members. */
			async openContainer(signal) {
				await this.prepareContainer(undefined, signal);
				return this.#withSnapshotOperation(async () => {
					assertAsarReadActive(signal);
					const snapshotPath = this.#snapshotPath();
					const handle = await this.#openOwned(snapshotPath, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
					return this.#ownedReadStream(handle, { signal });
				}, signal);
			}
			async close() {
				await this.#withSnapshotOperation(() => this.#closeSnapshot());
			}
			async #captureSnapshot(signal) {
				let inputHandle;
				try {
					this.#snapshotRoot = await mkdtemp(join(tmpdir(), "rea-asar-snapshot-"));
					const snapshotPath = join(this.#snapshotRoot, "container.asar");
					const hash = createHash("sha256");
					inputHandle = await this.#openOwned(this.path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
					const source = this.#ownedReadStream(inputHandle, {
						signal,
						releaseOnClose: false
					});
					const digesting = new Transform({ transform(chunk, _encoding, callback) {
						hash.update(chunk);
						callback(null, chunk);
					} });
					await pipeline(source, digesting, createWriteStream(snapshotPath, {
						flags: "wx",
						mode: 384
					}));
					const completedInput = inputHandle;
					inputHandle = undefined;
					await this.#closeOwnedHandle(completedInput);
					assertAsarReadActive(signal);
					this.#snapshot = {
						path: snapshotPath,
						sha256: hash.digest("hex")
					};
				} catch (cause) {
					let failure = asarFailure(this.path, "snapshot", cause);
					if (inputHandle !== undefined) {
						const failedInput = inputHandle;
						inputHandle = undefined;
						try {
							await this.#closeOwnedHandle(failedInput);
						} catch (cleanupCause) {
							failure = ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cleanupCause, this.path));
						}
					}
					try {
						if (this.#ownedHandles.size === 0) await this.#closeSnapshot();
					} catch (cleanupCause) {
						throw ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cleanupCause, this.#snapshotRoot ?? this.path));
					}
					throw failure;
				}
			}
			async #closeSnapshot() {
				await this.#closeOwnedHandles();
				const root = this.#snapshotRoot;
				if (root !== undefined) {
					try {
						await (this.options.removeSnapshot ?? defaultRemoveSnapshot)(root);
						if (this.#snapshotRoot === root) this.#snapshotRoot = undefined;
					} catch (cause) {
						throw ArtifactReaderFailure.withCleanup(cause, {
							reason: `Could not remove ASAR snapshot: ${root}`,
							resources: [root]
						});
					}
				}
				if (root === undefined || this.#snapshotRoot === undefined) {
					this.#snapshot = undefined;
					this.#resetArchiveState();
					this.#entries.clear();
				}
			}
			async #withSnapshotOperation(operation, signal) {
				const previous = this.#snapshotOperation;
				let release;
				this.#snapshotOperation = new Promise((resolve) => {
					release = resolve;
				});
				try {
					await waitForOperation(previous, signal);
				} catch (cause) {
					void previous.then(release, release);
					throw cause;
				}
				try {
					assertAsarReadActive(signal);
					return await operation();
				} finally {
					release();
				}
			}
			#snapshotPath() {
				if (this.#snapshot === undefined) throw new ArtifactReaderFailure("integrity", "ASAR snapshot is not available");
				return this.#snapshot.path;
			}
			provenance() {
				return [];
			}
			/** A selected companion cannot silently migrate to another packed target. */
			async #validateSelectedArchive() {
				const selected = this.options.selectedPath;
				if (selected === undefined) return;
				this.#selectedCanonicalSource ??= await realpath(this.path);
				await assertArtifactSelectedSource(this.#selectedCanonicalSource, selected);
			}
			async #openUnpackedStream(entry, signal) {
				const unpackedRoot = `${this.options.selectedPath ?? this.path}.unpacked`;
				let handle;
				try {
					await this.#validateSelectedArchive();
					const rootMetadata = await lstat(unpackedRoot);
					if (!rootMetadata.isDirectory() || rootMetadata.isSymbolicLink()) throw new ArtifactReaderFailure("path", "ASAR unpacked companion is not a regular directory");
					const canonicalRoot = await realpath(unpackedRoot);
					const candidate = appendCallerPath(unpackedRoot, entry.adapterKey);
					const canonical = await realpath(candidate);
					const relativePath = relative(canonicalRoot, canonical);
					if (relativePath === ".." || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) throw new ArtifactReaderFailure("path", `ASAR unpacked entry escaped its companion directory: ${entry.path}`);
					const pathMetadata = await lstat(candidate);
					if (!pathMetadata.isFile() || pathMetadata.isSymbolicLink()) throw new ArtifactReaderFailure("path", `ASAR unpacked entry is not a regular file: ${entry.path}`);
					handle = await (this.options.openUnpackedFile ?? open)(canonical, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
					const openedHandle = handle;
					this.#adoptHandle(openedHandle, canonical);
					const openedMetadata = await openedHandle.stat();
					if (!openedMetadata.isFile() || openedMetadata.dev !== pathMetadata.dev || openedMetadata.ino !== pathMetadata.ino) {
						throw new ArtifactReaderFailure("integrity", `ASAR unpacked entry changed before read: ${entry.path}`, {}, artifactIntegrityDetails(entry.path, entry.declaredIntegrity, null, true));
					}
					assertAsarReadActive(signal);
					const source = this.#ownedReadStream(openedHandle, {
						start: 0,
						signal
					});
					handle = undefined;
					const output = readValidatedAsarEntry(source, undefined, entry.path, this.path, signal);
					this.#setOwnedOutput(openedHandle, output);
					return output;
				} catch (cause) {
					let failure = asarUnpackedEntryFailure(this.path, entry, cause);
					if (handle !== undefined && this.#ownedHandles.has(handle)) {
						try {
							await this.#closeOwnedHandle(handle);
						} catch (cleanupCause) {
							failure = ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cleanupCause, this.#ownedHandles.get(handle)?.path ?? entry.path));
						}
					}
					throw failure;
				}
			}
			async #closeOwnedHandle(handle) {
				const owned = this.#ownedHandles.get(handle);
				if (owned === undefined) return;
				owned.output?.destroy();
				owned.source?.destroy();
				try {
					await owned.owner.close();
				} catch (cause) {
					throw ArtifactReaderFailure.withCleanup(cause, ArtifactReaderFailure.cleanupObservation(cause, owned.path));
				}
				this.#ownedHandles.delete(handle);
			}
			async #closeOwnedHandles() {
				let failure;
				for (const [handle, owned] of this.#ownedHandles) {
					try {
						await this.#closeOwnedHandle(handle);
					} catch (cause) {
						failure = ArtifactReaderFailure.withCleanup(failure ?? cause, ArtifactReaderFailure.cleanupObservation(cause, owned.path));
					}
				}
				if (failure !== undefined) throw failure;
			}
			async #openOwned(path, flags) {
				const handle = await (this.options.openFile ?? open)(path, flags);
				this.#adoptHandle(handle, path);
				return handle;
			}
			#adoptHandle(handle, path) {
				this.#ownedHandles.set(handle, {
					path,
					owner: new OwnedFileHandle(handle)
				});
			}
			#ownedReadStream(handle, options) {
				const { releaseOnClose, ...readOptions } = options;
				const source = readArtifactFileChunks(handle, readOptions);
				const owned = this.#ownedHandles.get(handle);
				if (owned === undefined) throw new ArtifactReaderFailure("integrity", "ASAR handle has no owner");
				owned.source = source;
				owned.output = source;
				if (releaseOnClose !== false) source.once("close", () => {
					void this.#closeOwnedHandle(handle).catch(() => undefined);
				});
				return source;
			}
			#setOwnedOutput(handle, output) {
				const owned = this.#ownedHandles.get(handle);
				if (owned !== undefined) owned.output = output;
			}
			#resetArchiveState() {
				this.#extents = undefined;
			}
		};
		defaultRemoveSnapshot = (path) => rm(path, {
			recursive: true,
			force: true
		});
		asarUnpackedEntryFailure = (archivePath, entry, cause) => {
			if (cause instanceof ArtifactReaderFailure) return cause;
			if (entry.unpacked && isMissingFile(cause)) return new ArtifactEntryContentUnavailable(`ASAR unpacked entry bytes are unavailable: ${entry.path}`, "ASAR unpacked companion bytes were unavailable; no content hash or child artifact was produced.", { cause }, artifactIntegrityDetails(entry.path, entry.declaredIntegrity, null, true));
			return asarFailure(archivePath, `read ${entry.path}`, cause);
		};
		waitForOperation = async (operation, signal) => {
			if (signal === undefined) return operation;
			assertAsarReadActive(signal);
			await new Promise((resolve, reject) => {
				const removeAbortListener = () => signal.removeEventListener("abort", onAbort);
				const onAbort = () => {
					removeAbortListener();
					reject(asarCancellationFailure(signal.reason));
				};
				signal.addEventListener("abort", onAbort, { once: true });
				operation.then(() => {
					removeAbortListener();
					resolve();
				}, (cause) => {
					removeAbortListener();
					reject(cause);
				});
			});
		};
		isMissingFile = (cause) => typeof cause === "object" && cause !== null && "code" in cause && cause.code === "ENOENT";
	})))();
}

//#endregion
//#region dist/filesystem/readFileHandlePrefix.js
var readFileHandlePrefix;
function init_readFileHandlePrefix() {
	return (init_readFileHandlePrefix = __esmMin((() => {
		readFileHandlePrefix = async (handle, length, checkCancellation) => {
			const prefix = Buffer.alloc(length);
			let offset = 0;
			while (offset < length) {
				checkCancellation();
				let bytesRead;
				try {
					({bytesRead} = await handle.read(prefix, offset, length - offset, offset));
				} catch (cause) {
					checkCancellation();
					throw cause;
				}
				checkCancellation();
				if (bytesRead === 0) break;
				offset += bytesRead;
			}
			return prefix.subarray(0, offset);
		};
	})))();
}

//#endregion
//#region dist/artifacts/InesArtifactReader.js
var INES_LIMITATION, InesArtifactReader;
function init_InesArtifactReader() {
	return (init_InesArtifactReader = __esmMin((() => {
		init_readFileHandlePrefix();
		init_inesContainer();
		init_RegularFile();
		init_readFileHandleChunks();
		init_ArtifactReader();
		init_ArtifactHash();
		init_StreamBytes();
		INES_LIMITATION = "Classic iNES file regions are observed; mapper execution, CPU bank mappings, CHR-RAM contents, 6502 analysis and emulator behavior are not observed. Trailing bytes are retained without interpretation. NES 2.0 and UNIF are unsupported.";
		InesArtifactReader = class {
			path;
			source;
			ownedSource;
			format = "ines";
			#entries = new Map();
			#layout;
			#closed = false;
			constructor(path, source, ownedSource) {
				this.path = path;
				this.source = source;
				this.ownedSource = ownedSource;
			}
			async *entries(signal) {
				abortIfNeeded(signal);
				await this.#verifySource(signal);
				const prefix = await readFileHandlePrefix(this.source.handle, 16, () => abortIfNeeded(signal));
				abortIfNeeded(signal);
				await this.#verifySource(signal);
				const parsed = parseInesLayout(prefix, this.source.initial.size);
				if (!parsed.ok) throw new ArtifactReaderFailure("format", parsed.error);
				this.#layout = parsed.value;
				this.#entries.clear();
				for (const region of parsed.value.regions) {
					abortIfNeeded(signal);
					const entry = {
						path: region.path,
						kind: "file",
						declaredSize: region.length,
						compressedSize: null,
						executable: false,
						encrypted: false,
						byteOffset: region.offset,
						declaredIntegrity: null,
						unpacked: false,
						limitations: [],
						adapterKey: region.path
					};
					this.#entries.set(entry.adapterKey, copyArtifactEntry(entry));
					yield entry;
				}
			}
			async open(entry, signal) {
				abortIfNeeded(signal);
				const produced = this.#entries.get(entry.adapterKey);
				if (produced === undefined || !sameArtifactEntry(entry, produced)) throw new ArtifactReaderFailure("integrity", "iNES region does not match this reader's inventory");
				await this.#verifySource(signal);
				const offset = produced.byteOffset;
				const size = produced.declaredSize;
				if (offset === null || size === null || size <= 0) throw new ArtifactReaderFailure("integrity", "Invalid iNES region range");
				const stream = readFileHandleChunks(this.source.handle, {
					start: offset,
					end: offset + size - 1,
					signal
				});
				const verify = () => this.#verifySource(signal);
				return Readable.from((async function* () {
					let bytes = 0;
					try {
						for await (const raw of stream) {
							abortIfNeeded(signal);
							const chunk = streamChunkToBuffer(raw);
							bytes += chunk.length;
							yield chunk;
						}
						if (bytes !== size) throw new ArtifactReaderFailure("integrity", "Truncated iNES region");
						await verify();
					} catch (cause) {
						abortIfNeeded(signal);
						if (cause instanceof ArtifactReaderFailure) throw cause;
						throw new ArtifactReaderFailure("io", "Could not read iNES region", { cause });
					}
				})(), { objectMode: false });
			}
			/** Validate the completed region scan without rereading its payload. */
			async verifyReconstruction(expectedSha256, observed, signal) {
				abortIfNeeded(signal);
				const layout = this.#layout;
				if (layout === undefined || this.#entries.size !== layout.regions.length) throw new ArtifactReaderFailure("integrity", "Incomplete iNES inventory");
				await this.#verifySource(signal);
				if (observed.region_order.length !== layout.regions.length || layout.regions.some((region, index) => observed.region_order[index] !== region.path) || observed.bytes !== this.source.initial.size || observed.sha256 !== expectedSha256) throw new ArtifactReaderFailure("integrity", "iNES reconstruction differs from the source");
				return {
					header: layout.header,
					reconstruction: {
						...observed,
						verified: true
					}
				};
			}
			provenance() {
				return [];
			}
			close() {
				this.#closed = true;
				return this.ownedSource?.close() ?? Promise.resolve();
			}
			async #verifySource(signal) {
				abortIfNeeded(signal);
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "iNES reader is closed");
				try {
					await assertStableRegularFileIdentity(this.source.handle, this.path, this.source.initial, {
						symlinks: "reject",
						...signal === undefined ? {} : { signal }
					});
				} catch (cause) {
					abortIfNeeded(signal);
					if (cause instanceof RegularFileChangedError) throw new ArtifactReaderFailure("integrity", "iNES source changed during reading", { cause: cause.cause ?? cause });
					throw cause;
				}
				abortIfNeeded(signal);
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/bun/BunModuleGraphLayout.js
var BUN_TRAILER, BUN_TRAILER_BYTES, BUN_OFFSETS_BYTES, BUN_GRAPH_SUFFIX_BYTES, BUN_LENGTH_PREFIX_BYTES, BUN_RECORD_BYTES_1_3_3, BUN_RECORD_BYTES_1_3_9, MAX_BUN_MODULE_COUNT, MAX_BUN_RETAINED_BYTES, MAX_LOAD_COMMAND_BYTES, MAX_SECTION_TABLE_BYTES, MAX_PE_SECTIONS, LC_SEGMENT$1, LC_SEGMENT_64$1, SEGMENT_64_HEADER_BYTES, SEGMENT_32_HEADER_BYTES, SECTION_64_BYTES, SECTION_32_BYTES, BUN_LAYOUT_REVISIONS, BUN_CARRIERS, locateBunStandaloneGraph, probeBunStandaloneGraph, loadBunStandaloneGraph, MAX_METADATA_READ_BYTES, METADATA_CACHE_BYTES, METADATA_CACHE_ENTRIES, BunGraphRangeReader, bunByteLimit, bunPayloadBytesLimit, bunMetadataBytesLimit, bunModuleCountLimit, bunFormatFailure, presentFailure, evaluateSection, evaluateAppendedTrailer, suffixFailure, readPointer, machOClaims, segmentClaims, fatClaims, peClaims, elfClaims, elfSectionBounds, ELF_BUN_NAME, elfNameIsBun, windowFor, exactName, readBoundedU64, readU32$1, readU16, tryRead, readExact$1;
function init_BunModuleGraphLayout() {
	return (init_BunModuleGraphLayout = __esmMin((() => {
		init_machoContainer();
		init_machoLoadCommands();
		init_fixedAllowanceRemediation();
		init_ArtifactHash();
		init_ArtifactReader();
		BUN_TRAILER = Buffer.from("\n---- Bun! ----\n");
		BUN_TRAILER_BYTES = BUN_TRAILER.length;
		BUN_OFFSETS_BYTES = 32;
		BUN_GRAPH_SUFFIX_BYTES = 32 + BUN_TRAILER_BYTES;
		BUN_LENGTH_PREFIX_BYTES = 8;
		BUN_RECORD_BYTES_1_3_3 = 36;
		BUN_RECORD_BYTES_1_3_9 = 52;
		MAX_BUN_MODULE_COUNT = 1e5;
		MAX_BUN_RETAINED_BYTES = 256 * 1024 * 1024;
		MAX_LOAD_COMMAND_BYTES = 16 * 1024 * 1024;
		MAX_SECTION_TABLE_BYTES = 1024 * 1024;
		MAX_PE_SECTIONS = 96;
		LC_SEGMENT$1 = 1;
		LC_SEGMENT_64$1 = 25;
		SEGMENT_64_HEADER_BYTES = 72;
		SEGMENT_32_HEADER_BYTES = 56;
		SECTION_64_BYTES = 80;
		SECTION_32_BYTES = 68;
		BUN_LAYOUT_REVISIONS = ["bun-1.3.3", "bun-1.3.9"];
		BUN_CARRIERS = [
			"mach-o-section",
			"pe-section",
			"elf-section",
			"appended-trailer"
		];
		locateBunStandaloneGraph = async (handle, fileSize, signal) => {
			const probed = await probeBunStandaloneGraph(handle, fileSize, signal);
			if (probed.status === "absent" || probed.claim === undefined) return probed;
			return loadBunStandaloneGraph(handle, probed.claim, signal);
		};
		probeBunStandaloneGraph = async (handle, fileSize, signal) => {
			abortIfNeeded(signal);
			const claims = [
				...await machOClaims(handle, fileSize, 0, fileSize, signal),
				...await peClaims(handle, fileSize, signal),
				...await elfClaims(handle, fileSize, signal)
			];
			const real = [];
			for (const claim of claims) {
				abortIfNeeded(signal);
				const evaluated = await evaluateSection(handle, fileSize, claim, signal);
				if (evaluated.status === "present") {
					if (real.length > 0) return presentFailure(new ArtifactReaderFailure("unavailable", "Bun standalone module graph layout is unsupported: multiple embedded graphs were located"));
					real.push(evaluated);
				}
			}
			const only = real[0];
			if (only !== undefined) return only;
			return evaluateAppendedTrailer(handle, fileSize, signal);
		};
		loadBunStandaloneGraph = async (handle, claim, signal) => {
			const suffix = await readExact$1(handle, claim.payloadOffset + claim.payloadLength - BUN_GRAPH_SUFFIX_BYTES, BUN_GRAPH_SUFFIX_BYTES, signal);
			const failure = suffixFailure(suffix, claim.payloadLength);
			if (failure !== undefined) return {
				status: "present",
				failure
			};
			const offsets = suffix.subarray(0, 32);
			return {
				status: "present",
				graph: {
					...claim,
					data: new BunGraphRangeReader(handle, claim.payloadOffset, claim.payloadLength - BUN_GRAPH_SUFFIX_BYTES, signal),
					modules: readPointer(offsets, 8),
					entryPointId: offsets.readUInt32LE(16),
					compileExecArgv: readPointer(offsets, 20),
					flags: offsets.readUInt32LE(28)
				}
			};
		};
		MAX_METADATA_READ_BYTES = 256 * 1024 * 1024;
		METADATA_CACHE_BYTES = 256 * 1024;
		METADATA_CACHE_ENTRIES = 1024;
		BunGraphRangeReader = class {
			handle;
			start;
			length;
			signal;
			#ranges = new Map();
			#retainedBytes = 0;
			#readBytes = 0;
			constructor(handle, start, length, signal) {
				this.handle = handle;
				this.start = start;
				this.length = length;
				this.signal = signal;
			}
			async read(offset, length) {
				abortIfNeeded(this.signal);
				if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 0 || offset > this.length || length > this.length - offset) throw bunFormatFailure("metadata range exceeds the Bun module graph");
				if (length === 0) return Buffer.alloc(0);
				const key = `${String(offset)}:${String(length)}`;
				const existing = this.#ranges.get(key);
				if (existing !== undefined) {
					this.#ranges.delete(key);
					this.#ranges.set(key, existing);
					return Buffer.from(existing);
				}
				if (length > MAX_METADATA_READ_BYTES - this.#readBytes) throw artifactFixedLimitFailure("Bun metadata read work", MAX_METADATA_READ_BYTES, "bytes");
				this.#readBytes += length;
				const bytes = await readExact$1(this.handle, this.start + offset, length, this.signal);
				if (length > METADATA_CACHE_BYTES) return bytes;
				while (this.#ranges.size >= METADATA_CACHE_ENTRIES || this.#retainedBytes + length > METADATA_CACHE_BYTES) {
					const oldest = this.#ranges.keys().next().value;
					this.#retainedBytes -= this.#ranges.get(oldest).length;
					this.#ranges.delete(oldest);
				}
				this.#ranges.set(key, bytes);
				this.#retainedBytes += length;
				return Buffer.from(bytes);
			}
		};
		bunByteLimit = (claimed, scope) => {
			const allowance = `Bun standalone ${scope} allowance of ${String(MAX_BUN_RETAINED_BYTES)} bytes`;
			const message = `The ${scope} claims ${String(claimed)} bytes. ${fixedAllowanceRemediation(allowance, "parser")} This release has no runtime override.`;
			return new ArtifactReaderFailure("limit", message, {
				boundary: scope === "payload" ? "file-size" : "memory",
				userMessage: message
			});
		};
		bunPayloadBytesLimit = (claimed) => bunByteLimit(claimed, "payload");
		bunMetadataBytesLimit = (claimed) => bunByteLimit(claimed, "metadata");
		bunModuleCountLimit = (count) => new ArtifactReaderFailure("limit", `Bun standalone module graph claims ${String(count)} modules, exceeding MAX_BUN_MODULE_COUNT (${String(MAX_BUN_MODULE_COUNT)} modules). This release has no runtime override. Host memory and NODE_OPTIONS do not raise it.`, { boundary: "capacity" });
		bunFormatFailure = (detail) => new ArtifactReaderFailure("format", `Bun standalone module graph is malformed: ${detail}`);
		presentFailure = (failure) => ({
			status: "present",
			failure
		});
		evaluateSection = async (handle, fileSize, claim, signal) => {
			if (claim.truncated) return presentFailure(bunFormatFailure("section extends past the end of the file"));
			if (claim.available < 8) return presentFailure(bunFormatFailure("trailer is truncated"));
			const prefix = await readExact$1(handle, claim.fileOffset, 8, signal);
			let prefixBytes = 8;
			let payloadLength = prefix.readBigUInt64LE(0);
			if (claim.carrier === "mach-o-section") {
				const legacyLength = prefix.readUInt32LE(0);
				if (legacyLength >= BUN_GRAPH_SUFFIX_BYTES && legacyLength + 4 <= claim.available) {
					const suffix = await readExact$1(handle, claim.fileOffset + 4 + legacyLength - BUN_GRAPH_SUFFIX_BYTES, BUN_GRAPH_SUFFIX_BYTES, signal);
					if (suffix.subarray(32).equals(BUN_TRAILER) && suffix.readBigUInt64LE(0) + BigInt(BUN_GRAPH_SUFFIX_BYTES) === BigInt(legacyLength)) {
						prefixBytes = 4;
						payloadLength = BigInt(legacyLength);
					}
				}
			}
			if (payloadLength === 0n) return { status: "placeholder" };
			if (payloadLength > BigInt(268435456)) return presentFailure(bunPayloadBytesLimit(payloadLength));
			if (payloadLength < BigInt(BUN_GRAPH_SUFFIX_BYTES)) return presentFailure(bunFormatFailure("trailer is truncated"));
			const length = Number(payloadLength);
			if (claim.available < prefixBytes + length) return presentFailure(bunFormatFailure("trailer is truncated"));
			const payloadOffset = claim.fileOffset + prefixBytes;
			const suffix = await readExact$1(handle, payloadOffset + length - BUN_GRAPH_SUFFIX_BYTES, BUN_GRAPH_SUFFIX_BYTES, signal);
			const failure = suffixFailure(suffix, length);
			if (failure !== undefined) return presentFailure(failure);
			return {
				status: "present",
				claim: {
					carrier: claim.carrier,
					payloadOffset,
					payloadLength: length
				}
			};
		};
		evaluateAppendedTrailer = async (handle, fileSize, signal) => {
			if (fileSize < BUN_GRAPH_SUFFIX_BYTES) return { status: "absent" };
			let graphEnd = fileSize;
			let trailer = await readExact$1(handle, graphEnd - BUN_TRAILER_BYTES, BUN_TRAILER_BYTES, signal);
			if (!trailer.equals(BUN_TRAILER)) {
				if (fileSize < BUN_GRAPH_SUFFIX_BYTES + 8) return { status: "absent" };
				graphEnd -= 8;
				trailer = await readExact$1(handle, graphEnd - BUN_TRAILER_BYTES, BUN_TRAILER_BYTES, signal);
				if (!trailer.equals(BUN_TRAILER)) return { status: "absent" };
				const length = await readExact$1(handle, graphEnd, 8, signal);
				if (length.readBigUInt64LE() !== BigInt(fileSize)) return presentFailure(bunFormatFailure("appended carrier length does not match file size"));
			}
			const offsets = await readExact$1(handle, graphEnd - BUN_GRAPH_SUFFIX_BYTES, 32, signal);
			const byteCount = offsets.readBigUInt64LE(0);
			if (byteCount + BigInt(BUN_GRAPH_SUFFIX_BYTES) > BigInt(268435456)) return presentFailure(bunPayloadBytesLimit(byteCount + BigInt(BUN_GRAPH_SUFFIX_BYTES)));
			const payloadLength = byteCount + BigInt(BUN_GRAPH_SUFFIX_BYTES);
			if (payloadLength > BigInt(graphEnd)) return presentFailure(bunFormatFailure("trailer is truncated"));
			const length = Number(payloadLength);
			return {
				status: "present",
				claim: {
					carrier: "appended-trailer",
					payloadOffset: graphEnd - length,
					payloadLength: length
				}
			};
		};
		suffixFailure = (suffix, payloadLength) => {
			if (suffix.length < BUN_GRAPH_SUFFIX_BYTES) return bunFormatFailure("trailer is truncated");
			if (!suffix.subarray(32).equals(BUN_TRAILER)) return bunFormatFailure("trailer does not match the Bun sentinel");
			const byteCount = suffix.readBigUInt64LE(0);
			if (byteCount > BigInt(268435456)) return bunPayloadBytesLimit(byteCount);
			if (byteCount + BigInt(BUN_GRAPH_SUFFIX_BYTES) !== BigInt(payloadLength)) return bunFormatFailure("byte_count does not match the located payload");
			return undefined;
		};
		readPointer = (bytes, offset) => ({
			offset: bytes.readUInt32LE(offset),
			length: bytes.readUInt32LE(offset + 4)
		});
		machOClaims = async (handle, fileSize, imageOffset, imageLimit, signal) => {
			if (imageOffset < 0 || imageOffset >= fileSize) return [];
			const header = await tryRead(handle, imageOffset, 12, fileSize, signal);
			if (header === null || header.length < 4) return [];
			const facts = readMachoHeaderPrefixFacts(header);
			if (facts.identity === null) return imageOffset === 0 ? fatClaims(handle, fileSize, header, signal) : [];
			const full = await tryRead(handle, imageOffset, Math.min(32, imageLimit), fileSize, signal);
			if (full === null) return [];
			const parsed = readMachoLoadCommandTableHeader(full, imageLimit);
			if (!parsed.ok || parsed.value === null) return [];
			const table = parsed.value;
			const { littleEndian, headerSize: headerBytes, commandBytes: sizeofcmds } = table;
			if (sizeofcmds > MAX_LOAD_COMMAND_BYTES) return [];
			const commands = await tryRead(handle, imageOffset + headerBytes, sizeofcmds, Math.min(fileSize, imageOffset + imageLimit), signal);
			if (commands === null || commands.length !== sizeofcmds) return [];
			const claims = [];
			const cursor = new MachoLoadCommandCursor(table);
			while (cursor.nextOffset !== null) {
				abortIfNeeded(signal);
				const read = cursor.read(commands.subarray(cursor.nextOffset));
				if (!read.ok) break;
				const { command: cmd, offset, size } = read.value;
				if (cmd === LC_SEGMENT_64$1 || cmd === LC_SEGMENT$1) claims.push(...segmentClaims(commands.subarray(offset, offset + size), littleEndian, cmd === LC_SEGMENT_64$1, imageOffset, Math.min(fileSize, imageOffset + imageLimit)));
			}
			return claims;
		};
		segmentClaims = (command, littleEndian, wide, imageOffset, fileSize) => {
			const headerBytes = wide ? SEGMENT_64_HEADER_BYTES : SEGMENT_32_HEADER_BYTES;
			const sectionBytes = wide ? SECTION_64_BYTES : SECTION_32_BYTES;
			if (command.length < headerBytes) return [];
			const nsects = readU32$1(command, wide ? 64 : 48, littleEndian);
			if (headerBytes + nsects * sectionBytes > command.length) return [];
			const claims = [];
			for (let index = 0; index < nsects; index += 1) {
				const start = headerBytes + index * sectionBytes;
				const section = command.subarray(start, start + sectionBytes);
				if (!exactName(section.subarray(0, 16), "__bun")) continue;
				if (!exactName(section.subarray(16, 32), "__BUN")) continue;
				const size = wide ? readBoundedU64(section, 40, littleEndian) : readU32$1(section, 36, littleEndian);
				const offset = readU32$1(section, wide ? 48 : 40, littleEndian);
				if (size === undefined) {
					claims.push({
						carrier: "mach-o-section",
						fileOffset: imageOffset + offset,
						declaredSize: MAX_BUN_RETAINED_BYTES + 1,
						available: 0,
						truncated: false
					});
					continue;
				}
				claims.push(windowFor("mach-o-section", imageOffset + offset, size, fileSize));
			}
			return claims;
		};
		fatClaims = async (handle, fileSize, prefix, signal) => {
			let parsed = readFatContainerHeader(prefix, fileSize);
			if (parsed.state === "needs-data") {
				const table = await tryRead(handle, 0, parsed.requiredBytes, fileSize, signal);
				if (table === null) return [];
				parsed = readFatContainerHeader(table, fileSize);
			}
			if (parsed.state !== "parsed") return [];
			const claims = [];
			for (const slice of parsed.slices) {
				abortIfNeeded(signal);
				if (parsed.rangeIssues[slice.index] !== null) continue;
				claims.push(...await machOClaims(handle, fileSize, slice.offset, slice.size, signal));
			}
			return claims;
		};
		peClaims = async (handle, fileSize, signal) => {
			const dos = await tryRead(handle, 0, 64, fileSize, signal);
			if (dos === null || dos.length < 64 || dos[0] !== 77 || dos[1] !== 90) return [];
			const eLfanew = dos.readUInt32LE(60);
			if (eLfanew < 64 || eLfanew > fileSize - 24) return [];
			const pe = await tryRead(handle, eLfanew, 24, fileSize, signal);
			if (pe === null || !pe.subarray(0, 4).equals(Buffer.from("PE\0\0"))) return [];
			const sectionCount = Math.min(pe.readUInt16LE(6), MAX_PE_SECTIONS);
			const optionalSize = pe.readUInt16LE(20);
			const tableOffset = eLfanew + 24 + optionalSize;
			const table = await tryRead(handle, tableOffset, sectionCount * 40, fileSize, signal);
			if (table === null) return [];
			const claims = [];
			for (let index = 0; index < sectionCount; index += 1) {
				const start = index * 40;
				if (start + 40 > table.length) break;
				if (!exactName(table.subarray(start, start + 8), ".bun")) continue;
				const virtualSize = table.readUInt32LE(start + 8);
				const rawSize = table.readUInt32LE(start + 16);
				const rawPointer = table.readUInt32LE(start + 20);
				const declared = virtualSize === 0 ? rawSize : virtualSize;
				const readable = Math.min(declared, rawSize);
				claims.push(windowFor("pe-section", rawPointer, readable, fileSize));
			}
			return claims;
		};
		elfClaims = async (handle, fileSize, signal) => {
			const header = await tryRead(handle, 0, 64, fileSize, signal);
			if (header === null || header.length < 16 || !header.subarray(0, 4).equals(Buffer.from([
				127,
				69,
				76,
				70
			]))) return [];
			const wide = header[4] === 2;
			if (header[4] !== 1 && header[4] !== 2) return [];
			if (header[5] !== 1 && header[5] !== 2) return [];
			const littleEndian = header[5] === 1;
			const shentsize = wide ? 64 : 40;
			const shoffOffset = wide ? 40 : 32;
			const shnumOffset = wide ? 60 : 48;
			const shstrndxOffset = wide ? 62 : 50;
			if (header.length < (wide ? 64 : 52)) return [];
			const observedShentsize = readU16(header, wide ? 58 : 46, littleEndian);
			if (observedShentsize !== 0 && observedShentsize !== shentsize) return [];
			const shoff = wide ? readBoundedU64(header, shoffOffset, littleEndian) : readU32$1(header, shoffOffset, littleEndian);
			const shnum = readU16(header, shnumOffset, littleEndian);
			const shstrndx = readU16(header, shstrndxOffset, littleEndian);
			if (shoff === undefined || shoff === 0 || shnum === 0 || shnum === 65535 || shstrndx >= shnum || shnum * shentsize > MAX_SECTION_TABLE_BYTES) return [];
			const table = await tryRead(handle, shoff, shnum * shentsize, fileSize, signal);
			if (table === null) return [];
			const strings = elfSectionBounds(table, shstrndx, wide, littleEndian);
			if (strings === null) return [];
			const stringTable = await tryRead(handle, strings.offset, Math.min(strings.size, MAX_SECTION_TABLE_BYTES), fileSize, signal);
			if (stringTable === null) return [];
			const claims = [];
			for (let index = 0; index < shnum; index += 1) {
				const bounds = elfSectionBounds(table, index, wide, littleEndian);
				if (bounds === null) continue;
				const nameOffset = readU32$1(table, index * shentsize, littleEndian);
				if (!elfNameIsBun(stringTable, nameOffset)) continue;
				claims.push(windowFor("elf-section", bounds.offset, bounds.size, fileSize));
			}
			return claims;
		};
		elfSectionBounds = (table, index, wide, littleEndian) => {
			const shentsize = wide ? 64 : 40;
			const start = index * shentsize;
			if (start + shentsize > table.length) return null;
			const offset = wide ? readBoundedU64(table, start + 24, littleEndian) : readU32$1(table, start + 16, littleEndian);
			const size = wide ? readBoundedU64(table, start + 32, littleEndian) : readU32$1(table, start + 20, littleEndian);
			if (offset === undefined || size === undefined) return null;
			return {
				offset,
				size
			};
		};
		ELF_BUN_NAME = Buffer.from(".bun");
		elfNameIsBun = (table, offset) => {
			const end = offset + ELF_BUN_NAME.length;
			if (end > table.length) return false;
			if (end < table.length && table[end] !== 0) return false;
			return table.subarray(offset, end).equals(ELF_BUN_NAME);
		};
		windowFor = (carrier, fileOffset, declaredSize, fileSize) => {
			if (!Number.isSafeInteger(fileOffset) || fileOffset < 0 || fileOffset >= fileSize) return {
				carrier,
				fileOffset,
				declaredSize,
				available: 0,
				truncated: false
			};
			const room = fileSize - fileOffset;
			return {
				carrier,
				fileOffset,
				declaredSize,
				available: Math.min(declaredSize, room),
				truncated: declaredSize > room
			};
		};
		exactName = (bytes, text) => {
			const encoded = Buffer.alloc(bytes.length);
			encoded.write(text, "utf8");
			return encoded.equals(bytes);
		};
		readBoundedU64 = (bytes, offset, littleEndian) => {
			if (offset < 0 || offset + 8 > bytes.length) return undefined;
			const value = littleEndian ? bytes.readBigUInt64LE(offset) : bytes.readBigUInt64BE(offset);
			if (value > BigInt(Number.MAX_SAFE_INTEGER)) return undefined;
			return Number(value);
		};
		readU32$1 = (bytes, offset, littleEndian) => littleEndian ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
		readU16 = (bytes, offset, littleEndian) => littleEndian ? bytes.readUInt16LE(offset) : bytes.readUInt16BE(offset);
		tryRead = async (handle, position, length, fileSize, signal) => {
			abortIfNeeded(signal);
			if (!Number.isSafeInteger(position) || !Number.isSafeInteger(length) || length < 0 || position < 0 || length === 0 || position > fileSize || fileSize - position < length) return length === 0 ? Buffer.alloc(0) : null;
			return readExact$1(handle, position, length, signal);
		};
		readExact$1 = async (handle, position, length, signal) => {
			const bytes = Buffer.alloc(length);
			let offset = 0;
			while (offset < length) {
				abortIfNeeded(signal);
				const read = await handle.read(bytes, offset, length - offset, position + offset);
				abortIfNeeded(signal);
				if (read.bytesRead === 0) throw bunFormatFailure("trailer is truncated");
				offset += read.bytesRead;
			}
			return bytes;
		};
	})))();
}

//#endregion
//#region dist/artifacts/bun/BunModuleGraphMembers.js
var LOADERS, MODULE_FORMATS, SIDES, decodeBunModuleGraph, recordSizes, assessLayout, recordPointerFailure, decodeRecord, optionalRange, named, textFact, readNul, pointerFits, pointerFailure, unsupported;
function init_BunModuleGraphMembers() {
	return (init_BunModuleGraphMembers = __esmMin((() => {
		init_ArtifactReader();
		init_BunModuleGraphLayout();
		LOADERS = [
			"jsx",
			"js",
			"ts",
			"tsx",
			"css",
			"file",
			"json",
			"jsonc",
			"toml",
			"wasm",
			"napi",
			"base64",
			"dataurl",
			"text",
			"bunsh",
			"sqlite",
			"sqlite-embedded",
			"html",
			"yaml",
			"json5",
			"md",
			"xml"
		];
		MODULE_FORMATS = [
			"none",
			"esm",
			"cjs"
		];
		SIDES = ["server", "client"];
		decodeBunModuleGraph = async (graph) => {
			const { data } = graph;
			const table = graph.modules;
			if (!pointerFits(data, table)) throw bunFormatFailure("modules pointer exceeds the Bun module graph");
			if (table.length === 0) throw unsupported("the module table is empty");
			const candidates = recordSizes(table.length);
			if (candidates.length === 0) throw unsupported(`record table length ${String(table.length)} matches no known revision`);
			if (candidates.every((size) => table.length / size > 1e5)) throw bunModuleCountLimit(table.length / Math.max(...candidates));
			const records = await data.read(table.offset, table.length);
			let recordBytes = candidates[0];
			if (candidates.length > 1) {
				const assessments = [];
				for (const recordBytes of candidates) assessments.push({
					recordBytes,
					failure: await assessLayout(data, records, recordBytes, graph.entryPointId)
				});
				const valid = assessments.filter((item) => item.failure === null);
				if (valid.length > 1) throw unsupported(`record table length ${String(table.length)} matches more than one known revision`);
				const selected = valid[0] ?? assessments[0];
				if (selected === undefined || selected.failure !== null) throw selected?.failure ?? unsupported(`record table length ${String(table.length)} matches no known revision`);
				recordBytes = selected.recordBytes;
			}
			const count = table.length / recordBytes;
			if (graph.entryPointId >= count) throw bunFormatFailure(`entry_point_id ${String(graph.entryPointId)} is outside the module table`);
			const revision = recordBytes === 52 ? "bun-1.3.9" : "bun-1.3.3";
			if (!pointerFits(data, graph.compileExecArgv)) throw bunFormatFailure("compile_exec_argv pointer exceeds the Bun module graph");
			const modules = [];
			let retained = graph.compileExecArgv.length * 6;
			if (retained > 268435456) throw bunMetadataBytesLimit(retained);
			for (let index = 0; index < count; index += 1) {
				const record = records.subarray(index * recordBytes, (index + 1) * recordBytes);
				retained += 512 + readPointer(record, 0).length * 6;
				if (recordBytes === 52) retained += readPointer(record, 40).length * 6;
				if (retained > 268435456) throw bunMetadataBytesLimit(retained);
				if (index % 256 === 0) await setImmediate();
				if (candidates.length === 1) {
					const failure = await recordPointerFailure(data, record, recordBytes, false);
					if (failure !== null) throw failure;
				}
				modules.push(await decodeRecord(data, record, index, revision));
			}
			return {
				revision,
				entryPointId: graph.entryPointId,
				flags: graph.flags,
				compileExecArgv: textFact(await readNul(data, graph.compileExecArgv, "compile_exec_argv"), true),
				modules
			};
		};
		recordSizes = (length) => {
			const sizes = [];
			if (length % 36 === 0) sizes.push(36);
			if (length % 52 === 0) sizes.push(52);
			return sizes;
		};
		assessLayout = async (data, records, recordBytes, entryPointId) => {
			const count = records.length / recordBytes;
			if (count > 1e5) return bunModuleCountLimit(count);
			for (let index = 0; index < count; index += 1) {
				const record = records.subarray(index * recordBytes, (index + 1) * recordBytes);
				if (index % 256 === 0) await setImmediate();
				const failure = await recordPointerFailure(data, record, recordBytes);
				if (failure !== null) return failure;
			}
			if (entryPointId >= count) return bunFormatFailure(`entry_point_id ${String(entryPointId)} is outside the module table`);
			return null;
		};
		recordPointerFailure = async (data, record, recordBytes, verifyTextNuls = true) => {
			const fields = recordBytes === 52 ? [
				[
					0,
					true,
					"name"
				],
				[
					8,
					true,
					"contents"
				],
				[
					16,
					false,
					"sourcemap"
				],
				[
					24,
					false,
					"bytecode"
				],
				[
					32,
					false,
					"module_info"
				],
				[
					40,
					true,
					"bytecode_origin"
				]
			] : [
				[
					0,
					true,
					"name"
				],
				[
					8,
					true,
					"contents"
				],
				[
					16,
					false,
					"sourcemap"
				],
				[
					24,
					false,
					"bytecode"
				]
			];
			for (const [offset, nul, label] of fields) {
				const failure = await pointerFailure(data, readPointer(record, offset), nul && (verifyTextNuls || offset === 8), label);
				if (failure !== null) return failure;
			}
			return null;
		};
		decodeRecord = async (data, record, index, revision) => {
			const wide = revision === "bun-1.3.9";
			const metadataAt = wide ? 48 : 32;
			const encoding = record[metadataAt] ?? 0;
			const loader = record[metadataAt + 1] ?? 0;
			const moduleFormat = record[metadataAt + 2] ?? 0;
			const side = record[metadataAt + 3] ?? 0;
			const name = await readNul(data, readPointer(record, 0), "name");
			const contents = readPointer(record, 8);
			const sourcemap = optionalRange(readPointer(record, 16));
			const bytecode = optionalRange(readPointer(record, 24));
			const moduleInfo = wide ? optionalRange(readPointer(record, 32)) : null;
			const origin = wide ? textFact(await readNul(data, readPointer(record, 40), "bytecode_origin"), false) : null;
			const encodingName = encoding === 2 ? wide ? null : "utf8" : named(["binary", "latin1"], encoding);
			return {
				index,
				nameText: textFact(name, true),
				contents: {
					offset: contents.offset,
					length: contents.length
				},
				sourcemap,
				bytecode,
				moduleInfo,
				bytecodeOrigin: origin === null || origin.text === null && origin.hex === null ? null : origin,
				encoding,
				encodingName,
				loader,
				loaderName: named(LOADERS, loader),
				moduleFormat,
				moduleFormatName: named(MODULE_FORMATS, moduleFormat),
				side,
				sideName: named(SIDES, side)
			};
		};
		optionalRange = (pointer) => pointer.length === 0 ? null : {
			offset: pointer.offset,
			length: pointer.length
		};
		named = (table, value) => table[value] ?? null;
		textFact = (bytes, emptyIsText) => {
			if (bytes.length === 0) return emptyIsText ? {
				text: "",
				hex: null
			} : {
				text: null,
				hex: null
			};
			const text = bytes.toString("utf8");
			if (Buffer.from(text, "utf8").equals(bytes)) return {
				text,
				hex: null
			};
			return {
				text: null,
				hex: bytes.toString("hex")
			};
		};
		readNul = async (data, pointer, label) => {
			const end = pointer.offset + pointer.length;
			if (!pointerFits(data, pointer) || pointer.length > 0 && end >= data.length) throw bunFormatFailure(`${label} pointer exceeds the Bun module graph`);
			const bytes = await data.read(pointer.offset, pointer.length + (pointer.length > 0 ? 1 : 0));
			if (pointer.length > 0 && bytes[pointer.length] !== 0) throw bunFormatFailure(`${label} is missing its terminating NUL`);
			return bytes.subarray(0, pointer.length);
		};
		pointerFits = (data, pointer) => pointer.offset <= data.length && pointer.offset + pointer.length <= data.length;
		pointerFailure = async (data, pointer, nul, label) => {
			const end = pointer.offset + pointer.length;
			if (pointer.offset > data.length || end > data.length) return bunFormatFailure(`${label} pointer exceeds the Bun module graph`);
			if (!nul || pointer.length === 0) return null;
			if (end >= data.length) return bunFormatFailure(`${label} pointer exceeds the Bun module graph`);
			if ((await data.read(end, 1))[0] !== 0) return bunFormatFailure(`${label} is missing its terminating NUL`);
			return null;
		};
		unsupported = (detail) => new ArtifactReaderFailure("unavailable", `Bun standalone module graph layout is unsupported: ${detail}`);
	})))();
}

//#endregion
//#region dist/artifacts/BunStandaloneArtifactReader.js
var REGIONS, MAX_LOGICAL_PATH_PARTS, MAX_LOGICAL_PATH_NODES, BunStandaloneArtifactReader, regionRange, moduleEntry, logicalModulePath, memberStream, entryMetadataJson;
function init_BunStandaloneArtifactReader() {
	return (init_BunStandaloneArtifactReader = __esmMin((() => {
		init_artifactExpansionBudget();
		init_jsonValueByteLength();
		init_readFileHandleChunks();
		init_ArtifactFileOperation();
		init_ArtifactPaths();
		init_ArtifactReader();
		init_ArtifactFileSource();
		init_ArtifactResourceScope();
		init_BunModuleGraphLayout();
		init_BunModuleGraphMembers();
		REGIONS = [
			"contents",
			"sourcemap",
			"bytecode",
			"module-info"
		];
		MAX_LOGICAL_PATH_PARTS = 256;
		MAX_LOGICAL_PATH_NODES = 25e4;
		BunStandaloneArtifactReader = class {
			format = "bun-standalone";
			#scope = new ArtifactResourceScope();
			#entries = new Map();
			#streams = new Set();
			#source;
			#admission;
			#prepared;
			#header;
			#closing = false;
			constructor(path, admitted) {
				if (admitted !== undefined && "kind" in admitted) {
					this.#admission = admitted;
					this.#source = new ArtifactFileSource(path, "Bun standalone", admitted.source);
				} else this.#source = new ArtifactFileSource(path, "Bun standalone", admitted);
			}
			formatMetadata() {
				return this.#header === undefined ? undefined : { ...this.#header };
			}
			async prepareContainer(expectedSha256, signal) {
				await this.#scope.run(async () => {
					this.#assertOpen(signal);
					await this.#source.bindSelectedPathSha256(expectedSha256, signal);
				});
			}
			async *entries(signal, _options) {
				await this.#scope.run(async () => {
					this.#assertOpen(signal);
					this.#prepared ??= this.#prepare(signal);
					await this.#prepared;
					await this.#source.readSelectedPath(signal);
				});
				let index = 0;
				for (const entry of this.#entries.values()) {
					if (index++ % 256 === 0) await setImmediate();
					this.#assertOpen(signal);
					yield copyArtifactEntry(entry);
				}
			}
			async open(entry, signal) {
				return this.#scope.run(async () => {
					this.#assertOpen(signal);
					const stored = this.#entries.get(entry.adapterKey);
					if (stored === undefined || !sameArtifactEntry(entry, stored)) throw new ArtifactReaderFailure("integrity", "Bun standalone entry does not match its owning inventory");
					const { handle } = await this.#source.readSelectedPath(signal);
					this.#assertOpen(signal);
					if (stored.byteOffset === null || stored.declaredSize === null) throw bunFormatFailure("member has no physical byte range");
					const source = stored.declaredSize === 0 ? Readable.from([]) : readFileHandleChunks(handle, {
						start: stored.byteOffset,
						end: stored.byteOffset + stored.declaredSize - 1,
						signal,
						cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", "Bun standalone read cancelled", { cause: reason })
					});
					const output = memberStream(stored);
					output.on("error", () => undefined);
					this.#streams.add(output);
					output.once("close", () => this.#streams.delete(output));
					void this.#scope.run(() => new Promise((resolve) => {
						pipeline$1(source, output, () => {
							resolve();
						});
					})).catch((cause) => output.destroy(cause instanceof Error ? cause : new Error("Bun standalone stream ownership failed", { cause })));
					return output;
				});
			}
			async close() {
				this.#closing = true;
				for (const stream of this.#streams) stream.destroy(new ArtifactReaderFailure("unavailable", "Bun standalone reader closed"));
				await this.#scope.close();
				await Promise.all([...this.#streams].map((stream) => finished(stream).catch(() => undefined)));
				await this.#source.close();
				this.#entries.clear();
				this.#header = undefined;
				this.#admission = undefined;
				this.#prepared = undefined;
			}
			provenance() {
				return [];
			}
			#assertOpen(signal) {
				assertArtifactReadActive(signal);
				if (this.#closing) throw new ArtifactReaderFailure("unavailable", "Bun standalone reader is closed");
			}
			async #prepare(signal) {
				const source = await this.#source.readSelectedPath(signal);
				const probe = this.#admission?.probe ?? await probeBunStandaloneGraph(source.handle, source.initial.size, signal);
				if (probe.status === "absent") throw bunFormatFailure("no Bun section or trailer");
				if (probe.failure !== undefined) throw probe.failure;
				if (probe.claim === undefined) throw bunFormatFailure("graph claim was not admitted");
				const located = await loadBunStandaloneGraph(source.handle, probe.claim, signal);
				if (located.status === "absent") throw bunFormatFailure("no Bun section or trailer");
				if (located.failure !== undefined) throw located.failure;
				if (located.graph === undefined) throw bunFormatFailure("graph data was not admitted");
				const decoded = await decodeBunModuleGraph(located.graph);
				const entryModule = decoded.modules[decoded.entryPointId];
				const entryDestination = entryModule === undefined ? null : logicalModulePath(entryModule);
				const header = {
					kind: "bun-standalone",
					layout_revision: decoded.revision,
					carrier: located.graph.carrier,
					payload_offset: located.graph.payloadOffset,
					payload_length: located.graph.payloadLength,
					module_count: decoded.modules.length,
					entry_point_id: decoded.entryPointId,
					entry_point_source_name: entryModule?.nameText.text ?? null,
					entry_point_logical_path: entryDestination?.path ?? null,
					compile_exec_argv: decoded.compileExecArgv.text,
					compile_exec_argv_hex: decoded.compileExecArgv.hex,
					flags: decoded.flags
				};
				let retainedBytes = jsonValueByteLength(header, MAX_BUN_RETAINED_BYTES);
				if (retainedBytes > 268435456) throw bunMetadataBytesLimit(retainedBytes);
				let declaredPlaintext = 0n;
				const expansionBudget = BigInt(artifactExpansionBudgetBytes(located.graph.payloadLength));
				const paths = new ArtifactPathRegistry({
					maxParts: MAX_LOGICAL_PATH_PARTS,
					maxNodes: MAX_LOGICAL_PATH_NODES
				});
				for (const module of decoded.modules) {
					assertArtifactReadActive(signal);
					const destination = module.index === decoded.entryPointId && entryDestination !== null ? entryDestination : logicalModulePath(module);
					for (const region of REGIONS) {
						const range = regionRange(module, region);
						if (range === null) continue;
						declaredPlaintext += BigInt(range.length);
						if (declaredPlaintext > expansionBudget) throw new ArtifactReaderFailure("limit", `Bun standalone readable entries declare ${String(declaredPlaintext)} plaintext bytes, exceeding this graph's ${String(expansionBudget)}-byte expansion budget. This release has no runtime override. Host memory and NODE_OPTIONS do not raise it.`, { boundary: "capacity" });
						const entry = moduleEntry(located.graph, module, region, range, destination);
						paths.reservePath(entry.path);
						retainedBytes += jsonValueByteLength(entryMetadataJson(entry), Math.max(0, MAX_BUN_RETAINED_BYTES - retainedBytes));
						if (retainedBytes > 268435456) throw bunMetadataBytesLimit(retainedBytes);
						this.#entries.set(entry.adapterKey, entry);
					}
				}
				await this.#source.readSelectedPath(signal);
				this.#assertOpen(signal);
				this.#header = header;
				this.#admission = undefined;
			}
		};
		regionRange = (module, region) => {
			if (region === "contents") return module.contents;
			if (region === "sourcemap") return module.sourcemap;
			if (region === "bytecode") return module.bytecode;
			return module.moduleInfo;
		};
		moduleEntry = (graph, module, region, range, located) => {
			const suffix = region === "contents" ? "" : region === "sourcemap" ? ".bunmap" : region === "bytecode" ? ".bytecode" : ".module-info";
			const metadata = {
				kind: "bun-standalone-entry",
				index: module.index,
				region,
				source_name: module.nameText.text,
				source_name_hex: module.nameText.hex,
				encoding: module.encoding,
				encoding_name: module.encodingName,
				loader: module.loader,
				loader_name: module.loaderName,
				module_format: module.moduleFormat,
				module_format_name: module.moduleFormatName,
				side: module.side,
				side_name: module.sideName,
				entry_point: module.index === graph.entryPointId,
				sourcemap_bytes: module.sourcemap?.length ?? 0,
				bytecode_bytes: module.bytecode?.length ?? 0,
				module_info_bytes: module.moduleInfo?.length ?? 0,
				bytecode_origin: module.bytecodeOrigin?.text ?? null,
				bytecode_origin_hex: module.bytecodeOrigin?.hex ?? null
			};
			return {
				path: `${located.path}${suffix}`,
				...located.sourcePath === undefined ? {} : { sourcePath: located.sourcePath },
				kind: "file",
				declaredSize: range.length,
				compressedSize: null,
				executable: false,
				encrypted: false,
				byteOffset: graph.payloadOffset + range.offset,
				declaredIntegrity: null,
				unpacked: false,
				limitations: [...located.limitations ?? []],
				adapterKey: `bun:${String(module.index)}:${region}`,
				formatMetadata: metadata
			};
		};
		logicalModulePath = (module) => {
			const fallback = `bun-modules/${String(module.index)}`;
			const text = module.nameText.text;
			if (text === null || text.length === 0) return { path: fallback };
			const candidate = text.startsWith("/") ? text.slice(1) : text;
			let parts = 1;
			for (let index = 0; index < candidate.length; index++) if (candidate.charCodeAt(index) === 47 && ++parts > MAX_LOGICAL_PATH_PARTS) return {
				path: fallback,
				sourcePath: text,
				limitations: [`The virtual name exceeds the fixed ${String(MAX_LOGICAL_PATH_PARTS)}-part logical path allowance; an indexed path is used and the original name is retained.`]
			};
			try {
				return {
					path: normalizeArtifactPath(candidate),
					sourcePath: text
				};
			} catch (cause) {
				if (!(cause instanceof ArtifactReaderFailure) || cause.reason !== "path") throw cause;
				return {
					path: fallback,
					sourcePath: text
				};
			}
		};
		memberStream = (entry) => {
			let bytes = 0;
			return new Transform({
				transform(chunk, _encoding, callback) {
					bytes += chunk.length;
					callback(null, chunk);
				},
				flush(callback) {
					callback(bytes === entry.declaredSize ? null : bunFormatFailure(`member ended early: ${entry.path}`));
				}
			});
		};
		entryMetadataJson = (entry) => entry.formatMetadata === undefined ? null : { ...entry.formatMetadata };
	})))();
}

//#endregion
//#region dist/artifacts/DecodedRegionArtifactReader.js
var addressText, regionFileName, DecodedRegionArtifactReader;
function init_DecodedRegionArtifactReader() {
	return (init_DecodedRegionArtifactReader = __esmMin((() => {
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_ArtifactFileOperation();
		init_ArtifactFileSource();
		init_readFileHandleChunks();
		addressText = (address) => `0x${address.toString(16).padStart(8, "0")}`;
		regionFileName = (start, end) => `${addressText(start)}-${addressText(end)}.bin`;
		DecodedRegionArtifactReader = class {
			format;
			#scope = new ArtifactResourceScope();
			#entries = new Map();
			#regions = new Map();
			#streams = new Set();
			#source;
			#decoding;
			#prepared;
			/** Whole-file facts only; the region map is the sole owner of region bytes. */
			#described;
			#closing = false;
			constructor(path, format, decoding, admitted) {
				this.format = format;
				this.#decoding = decoding;
				this.#source = new ArtifactFileSource(path, decoding.label, admitted);
			}
			formatMetadata() {
				const metadata = this.#described?.metadata;
				return metadata === undefined ? undefined : { ...metadata };
			}
			containerIntegrity() {
				const integrity = this.#described?.containerIntegrity;
				return integrity === undefined ? undefined : { ...integrity };
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
				const coverage = this.#described?.coverage;
				if (coverage !== undefined) options?.onCoverage?.({
					...coverage,
					limitations: [...coverage.limitations]
				});
				let index = 0;
				for (const entry of this.#entries.values()) {
					if (index % 256 === 0) await setImmediate();
					index += 1;
					this.#assertOpen(signal);
					yield copyArtifactEntry(entry);
				}
			}
			async open(entry, signal) {
				return this.#scope.run(async () => {
					this.#assertOpen(signal);
					const stored = this.#entries.get(entry.adapterKey);
					const bytes = this.#regions.get(entry.adapterKey);
					if (stored === undefined || bytes === undefined || !sameArtifactEntry(entry, stored)) throw new ArtifactReaderFailure("integrity", `${this.#decoding.label} entry does not match its owning inventory`);
					await this.#source.read(signal);
					this.#assertOpen(signal);
					const output = Readable.from(this.#regionChunks(bytes, signal), { objectMode: false });
					const onAbort = () => {
						output.destroy(new ArtifactReaderFailure("cancelled", `${this.#decoding.label} region read cancelled`, { cause: signal?.reason }));
					};
					signal?.addEventListener("abort", onAbort, { once: true });
					output.once("close", () => signal?.removeEventListener("abort", onAbort));
					output.on("error", () => undefined);
					this.#streams.add(output);
					output.once("close", () => this.#streams.delete(output));
					void this.#scope.run(() => new Promise((resolve) => {
						output.once("close", () => resolve());
					})).catch((cause) => output.destroy(cause instanceof Error ? cause : new ArtifactReaderFailure("unavailable", `${this.#decoding.label} stream ownership failed`, { cause })));
					return output;
				});
			}
			async *#regionChunks(bytes, signal) {
				for (let offset = 0; offset < bytes.length; offset += 64 * 1024) {
					await setImmediate();
					this.#assertOpen(signal);
					yield Buffer.from(bytes.subarray(offset, offset + 64 * 1024));
				}
			}
			async close() {
				this.#closing = true;
				for (const stream of this.#streams) stream.destroy(new ArtifactReaderFailure("unavailable", `${this.#decoding.label} reader closed`));
				await this.#scope.close();
				await this.#source.close();
				this.#entries.clear();
				this.#regions.clear();
			}
			provenance() {
				return [];
			}
			#assertOpen(signal) {
				assertArtifactReadActive(signal);
				if (this.#closing) throw new ArtifactReaderFailure("unavailable", `${this.#decoding.label} reader is closed`);
			}
			async #prepare(signal) {
				const described = this.#decoding.describe(await this.#decode(signal));
				let index = 0;
				for (const region of described.regions) {
					if (index % 256 === 0) await setImmediate();
					this.#assertOpen(signal);
					const entry = {
						path: region.path,
						kind: "file",
						declaredSize: region.bytes.length,
						compressedSize: null,
						executable: false,
						encrypted: false,
						byteOffset: region.byteOffset,
						declaredIntegrity: null,
						unpacked: false,
						limitations: [],
						adapterKey: `${this.#decoding.keyPrefix}:${String(index)}`,
						formatMetadata: region.formatMetadata
					};
					this.#entries.set(entry.adapterKey, entry);
					this.#regions.set(entry.adapterKey, region.bytes);
					index += 1;
				}
				const { regions: _regions, ...facts } = described;
				this.#described = facts;
				await this.#source.read(signal);
			}
			async #decode(signal) {
				const { handle, initial } = await this.#source.read(signal);
				const decoder = this.#decoding.createDecoder(initial.size);
				if (!decoder.ok) throw this.#failure(decoder.error);
				if (initial.size > 0) for await (const chunk of readFileHandleChunks(handle, {
					end: initial.size - 1,
					signal,
					cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", `${this.#decoding.label} read cancelled`, { cause: reason })
				})) {
					this.#assertOpen(signal);
					const written = decoder.value.write(chunk);
					if (!written.ok) throw this.#failure(written.error);
				}
				const image = decoder.value.finish();
				if (!image.ok) throw this.#failure(image.error);
				return image.value;
			}
			#failure(failure) {
				return failure.kind === "format" ? new ArtifactReaderFailure("format", `${this.#decoding.label} is malformed: ${failure.message}`) : new ArtifactReaderFailure("limit", `${this.#decoding.label} exceeds a fixed limit: ${failure.message}`, failure.boundary === undefined ? {} : { boundary: failure.boundary });
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/DfuSeArtifactReader.js
var crcText, dfuSeRegions, DfuSeArtifactReader;
function init_DfuSeArtifactReader() {
	return (init_DfuSeArtifactReader = __esmMin((() => {
		init_dfuse();
		init_DecodedRegionArtifactReader();
		crcText = (value) => value.toString(16).padStart(8, "0");
		dfuSeRegions = {
			label: "DfuSe",
			keyPrefix: "dfuse",
			createDecoder: createDfuSeDecoder,
			describe: (image) => ({
				metadata: image.metadata,
				regions: image.elements.map((element) => {
					const end = element.address + element.bytes.length - 1;
					return {
						path: `target-${String(element.targetIndex)}/element-${String(element.elementIndex)}-${regionFileName(element.address, end)}`,
						byteOffset: element.dataOffset,
						formatMetadata: {
							kind: "dfuse-element",
							target_index: element.targetIndex,
							alternate_setting: element.alternateSetting,
							target_name: element.targetName,
							element_index: element.elementIndex,
							start_address: element.address,
							end_address: end,
							length: element.bytes.length
						},
						bytes: element.bytes
					};
				}),
				...image.limitations.length === 0 ? {} : { coverage: {
					status: "complete",
					limitations: image.limitations
				} },
				containerIntegrity: {
					algorithm: "dfu-crc32",
					declared_crc32: crcText(image.metadata.suffix_crc),
					observed_crc32: crcText(image.metadata.computed_crc)
				}
			})
		};
		DfuSeArtifactReader = class extends DecodedRegionArtifactReader {
			constructor(path, admitted) {
				super(path, "dfuse", dfuSeRegions, admitted);
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/dotnet/DotnetBundle.js
var DOTNET_BUNDLE_SIGNATURE, MAX_METADATA_BYTES, MAX_ENTRIES, MAX_PATH_BYTES, MAX_PATH_PARTS, MAX_PATH_NODES, MAX_BUNDLE_ENTRY_BYTES, MAX_EXPANDED_BYTES, findDotnetBundleHeader, readDotnetBundle, BundleCursor, fail;
function init_DotnetBundle() {
	return (init_DotnetBundle = __esmMin((() => {
		init_readFileHandleChunks();
		init_ArtifactPaths();
		init_ArtifactHash();
		init_ArtifactReader();
		DOTNET_BUNDLE_SIGNATURE = Buffer.from("8b1202b96a612038727b930214d7a03213f5b9e6efae3318ee3b2dce24b36aae", "hex");
		MAX_METADATA_BYTES = 16 * 1024 * 1024;
		MAX_ENTRIES = 1e5;
		MAX_PATH_BYTES = 64 * 1024;
		MAX_PATH_PARTS = 256;
		MAX_PATH_NODES = 25e4;
		MAX_BUNDLE_ENTRY_BYTES = 512 * 1024 * 1024;
		MAX_EXPANDED_BYTES = 2 * 1024 * 1024 * 1024;
		findDotnetBundleHeader = async (handle, size, signal, markerSearchEnd = size) => {
			abortIfNeeded(signal);
			let tail = Buffer.alloc(0);
			if (markerSearchEnd === 0) return undefined;
			try {
				for await (const value of readFileHandleChunks(handle, {
					end: markerSearchEnd - 1,
					signal
				})) {
					abortIfNeeded(signal);
					const chunk = value;
					const bytes = Buffer.concat([tail, chunk]);
					for (let index = bytes.indexOf(DOTNET_BUNDLE_SIGNATURE); index >= 0; index = bytes.indexOf(DOTNET_BUNDLE_SIGNATURE, index + 1)) {
						if (index < 8) continue;
						const offset = bytes.readBigUInt64LE(index - 8);
						if (offset === 0n) return undefined;
						if (offset > BigInt(size - 12)) fail(".NET bundle header is outside the host file");
						return Number(offset);
					}
					tail = bytes.subarray(Math.max(0, bytes.length - 39));
				}
			} catch (cause) {
				abortIfNeeded(signal);
				throw cause;
			}
			return undefined;
		};
		readDotnetBundle = async (handle, size, headerOffset, signal) => {
			const cursor = new BundleCursor(handle, size, headerOffset, signal);
			const majorVersion = await cursor.u32();
			const minorVersion = await cursor.u32();
			if (![
				1,
				2,
				6
			].includes(majorVersion) || minorVersion !== 0) throw new ArtifactReaderFailure("unavailable", `Unsupported .NET bundle header ${majorVersion}.${minorVersion}; supported versions are 1.0, 2.0 and 6.0`);
			const count = await cursor.u32();
			if (count > MAX_ENTRIES) throw artifactFixedLimitFailure(".NET bundle entry count", MAX_ENTRIES, "entries");
			await cursor.string();
			const configuration = [];
			if (majorVersion >= 2) {
				configuration.push({
					offset: await cursor.u64(),
					size: await cursor.u64(),
					type: 3
				});
				configuration.push({
					offset: await cursor.u64(),
					size: await cursor.u64(),
					type: 4
				});
				const flags = await cursor.u64();
				if (flags > 1) throw new ArtifactReaderFailure("unavailable", `Unsupported .NET bundle flags: ${flags}`);
			}
			const files = [];
			const paths = new ArtifactPathRegistry({
				maxParts: MAX_PATH_PARTS,
				maxNodes: MAX_PATH_NODES
			});
			let expandedBytes = 0;
			for (let index = 0; index < count; index++) {
				abortIfNeeded(signal);
				const offset = await cursor.u64();
				const fileSize = await cursor.u64();
				const compressedSize = majorVersion === 6 ? await cursor.u64() : 0;
				const fileType = (await cursor.take(1))[0];
				const path = await cursor.string();
				const normalized = normalizeArtifactPath(path);
				paths.add(normalized, "file");
				if (fileSize > MAX_BUNDLE_ENTRY_BYTES || compressedSize > MAX_BUNDLE_ENTRY_BYTES) throw artifactFixedLimitFailure(".NET bundle member stored or expanded size", MAX_BUNDLE_ENTRY_BYTES, "bytes");
				expandedBytes += fileSize;
				if (expandedBytes > MAX_EXPANDED_BYTES) throw artifactFixedLimitFailure(".NET bundle aggregate expanded size", MAX_EXPANDED_BYTES, "bytes");
				const storedSize = compressedSize || fileSize;
				if (offset > headerOffset || storedSize > headerOffset - offset) fail(`.NET bundle entry crosses the manifest or file boundary: ${path}`);
				files.push({
					path,
					offset,
					size: fileSize,
					compressedSize,
					fileType
				});
			}
			const ranges = files.filter((file) => (file.compressedSize || file.size) > 0).toSorted((a, b) => a.offset - b.offset);
			let end = 0;
			for (const file of ranges) {
				if (file.offset < end) fail(`Overlapping .NET bundle entries: ${file.path}`);
				end = file.offset + (file.compressedSize || file.size);
			}
			for (const item of configuration) {
				if (item.offset === 0 && item.size === 0) continue;
				if (!files.some((file) => file.fileType === item.type && file.offset === item.offset && file.size === item.size && file.compressedSize === 0)) fail(".NET bundle configuration location disagrees with its file table");
			}
			return {
				majorVersion,
				minorVersion,
				headerOffset,
				files
			};
		};
		BundleCursor = class {
			handle;
			size;
			start;
			signal;
			#position;
			#cache = Buffer.alloc(0);
			#cacheOffset = 0;
			constructor(handle, size, start, signal) {
				this.handle = handle;
				this.size = size;
				this.start = start;
				this.signal = signal;
				this.#position = start;
			}
			async take(length) {
				abortIfNeeded(this.signal);
				if (this.#position - this.start + length > MAX_METADATA_BYTES) throw artifactFixedLimitFailure(".NET bundle metadata", MAX_METADATA_BYTES, "bytes");
				if (length > this.size - this.#position) fail("Truncated .NET bundle manifest");
				const cached = this.#position - this.#cacheOffset;
				if (cached < 0 || cached + length > this.#cache.length) {
					this.#cacheOffset = this.#position;
					this.#cache = Buffer.alloc(Math.min(Math.max(length, 64 * 1024), this.size - this.#position));
					let read = 0;
					while (read < this.#cache.length) {
						abortIfNeeded(this.signal);
						const reply = await this.handle.read(this.#cache, read, this.#cache.length - read, this.#cacheOffset + read).catch((cause) => {
							abortIfNeeded(this.signal);
							throw cause;
						});
						if (reply.bytesRead === 0) fail("Truncated .NET bundle manifest");
						read += reply.bytesRead;
					}
				}
				const at = this.#position - this.#cacheOffset;
				this.#position += length;
				return this.#cache.subarray(at, at + length);
			}
			async u32() {
				return (await this.take(4)).readUInt32LE();
			}
			async u64() {
				const value = (await this.take(8)).readBigUInt64LE();
				if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw artifactFixedLimitFailure(".NET bundle exact integer range", Number.MAX_SAFE_INTEGER, "integer units");
				return Number(value);
			}
			async string() {
				let length = 0;
				for (let shift = 0; shift <= 28; shift += 7) {
					const byte = (await this.take(1))[0];
					if (shift === 28 && byte > 15) fail("Invalid .NET bundle string length");
					length += (byte & 127) * 2 ** shift;
					if ((byte & 128) !== 0) continue;
					if (length > MAX_PATH_BYTES) throw artifactFixedLimitFailure(".NET bundle decoded string", MAX_PATH_BYTES, "UTF-8 bytes");
					const bytes = await this.take(length);
					try {
						return new TextDecoder("utf-8", {
							fatal: true,
							ignoreBOM: true
						}).decode(bytes);
					} catch (cause) {
						throw new ArtifactReaderFailure("format", "Invalid UTF-8 in .NET bundle manifest", { cause });
					}
				}
				return fail("Invalid .NET bundle string length");
			}
		};
		fail = (message) => {
			throw new ArtifactReaderFailure("format", message);
		};
	})))();
}

//#endregion
//#region dist/artifacts/DotnetBundleArtifactReader.js
var DotnetBundleArtifactReader;
function init_DotnetBundleArtifactReader() {
	return (init_DotnetBundleArtifactReader = __esmMin((() => {
		init_ArtifactFileSource();
		init_ArtifactResourceScope();
		init_readFileHandleChunks();
		init_ArtifactHash();
		init_ArtifactReader();
		init_DotnetBundle();
		DotnetBundleArtifactReader = class {
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
				} else this.#source = new ArtifactFileSource(path, ".NET bundle", admitted);
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
						const header = this.#admission?.headerOffset ?? await findDotnetBundleHeader(source.handle, source.initial.size, signal);
						if (header === undefined) throw new ArtifactReaderFailure("format", "Selected file has no .NET bundle header");
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
							file_type: file.fileType
						},
						limitations: [".NET bundle file types are declarations, not proof of assembly validity or executable authority.", ...file.fileType > 5 ? [`Unknown .NET bundle file type ${file.fileType}; bytes are retained without interpreting the type.`] : []]
					};
					this.#entries.set(entry.adapterKey, {
						entry: copyArtifactEntry(entry),
						file
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
					if (selected === undefined || !sameArtifactEntry(entry, selected.entry)) throw new ArtifactReaderFailure("integrity", "Selected .NET bundle entry differs from its observed manifest");
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
				for (const stream of this.#streams) stream.destroy();
				await this.#scope.close();
				await Promise.all([...this.#streams].map((stream) => finished(stream).catch(() => undefined)));
				await this.#source.close();
				this.#entries.clear();
				this.#admission = undefined;
				this.#bundle = undefined;
			}
			#assertOpen(signal) {
				abortIfNeeded(signal);
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", ".NET bundle reader is closed");
			}
			async *#readMember(source, file, signal) {
				const storedBytes = file.compressedSize || file.size;
				const input = storedBytes === 0 ? Readable.from([]) : readFileHandleChunks(source.handle, {
					start: file.offset,
					end: file.offset + storedBytes - 1,
					signal
				});
				const inflater = file.compressedSize === 0 ? undefined : createInflateRaw();
				const decoded = inflater ?? input;
				const pumping = inflater === undefined ? undefined : pipeline(input, inflater);
				void pumping?.catch(() => undefined);
				let bytes = 0;
				try {
					for await (const raw of decoded) {
						abortIfNeeded(signal);
						const chunk = raw;
						bytes += chunk.length;
						if (bytes > file.size) throw new ArtifactReaderFailure("limit", `.NET bundle entry expands beyond its declared size: ${file.path}`);
						yield chunk;
					}
					await pumping;
					if (bytes !== file.size || inflater !== undefined && inflater.bytesWritten !== storedBytes) throw new ArtifactReaderFailure("format", `.NET bundle member length or compressed extent does not match its declaration: ${file.path}`);
					await this.#source.readSelectedPath(signal);
				} catch (cause) {
					abortIfNeeded(signal);
					if (cause instanceof ArtifactReaderFailure) throw cause;
					const malformedCompression = inflater !== undefined && cause instanceof Error && "code" in cause && ["Z_DATA_ERROR", "Z_BUF_ERROR"].includes(String(cause.code));
					throw new ArtifactReaderFailure(malformedCompression ? "format" : "io", `Could not read .NET bundle member: ${file.path}`, { cause });
				} finally {
					input.destroy();
					decoded.destroy();
					await pumping?.catch(() => undefined);
				}
			}
		};
	})))();
}

//#endregion
//#region dist/domain/firmware/espOtaData.js
var ESP_OTA_DATA_SECTOR_BYTES, ESP_OTA_DATA_MIN_BYTES, ESP_OTA_SELECT_ENTRY_BYTES, UNSET, STATE_NAMES, decodeEspOtaRecord, RECORDS_ASSUMPTION, BOOT_ASSUMPTIONS, unusable, selectEspBootPartition;
function init_espOtaData() {
	return (init_espOtaData = __esmMin((() => {
		init_espImageStructures();
		ESP_OTA_DATA_SECTOR_BYTES = 4096;
		ESP_OTA_DATA_MIN_BYTES = 2 * ESP_OTA_DATA_SECTOR_BYTES;
		ESP_OTA_SELECT_ENTRY_BYTES = 32;
		UNSET = 4294967295;
		STATE_NAMES = {
			0: "new",
			1: "pending-verify",
			2: "valid",
			3: "invalid",
			4: "aborted",
			[UNSET]: "undefined"
		};
		decodeEspOtaRecord = (bytes, index) => {
			const sequence = bytes.subarray(0, 4);
			const otaSeq = u32(bytes, 0);
			const state = u32(bytes, 24);
			const crc = u32(bytes, 28);
			const crcMatches = crc32(sequence, UNSET) >>> 0 === crc;
			return {
				index,
				ota_seq: otaSeq,
				seq_label: hex(bytes.subarray(4, 24)),
				ota_state: state,
				state_name: STATE_NAMES[state] ?? null,
				crc,
				crc_matches: crcMatches,
				valid: otaSeq !== UNSET && state !== 3 && state !== 4 && crcMatches
			};
		};
		RECORDS_ASSUMPTION = "Records are used as written: the bootloader may first mark a pending-verify record aborted when app rollback is enabled.";
		BOOT_ASSUMPTIONS = [
			"Anti-rollback, which compares the app's secure_version with eFuse, is not applied.",
			"The selected app is not checked for a loadable image; the bootloader falls back to other partitions when it fails to load or is not declared.",
			"Factory-reset and test-app GPIO holds and a wake from deep sleep, which can override the selection, are not applied."
		];
		unusable = ({ ota_seq, ota_state }) => ota_seq === UNSET || ota_state === 3 || ota_state === 4;
		selectEspBootPartition = (boot, otadata, tableRejected = false) => {
			const selection = (basis, fields = {}) => ({
				basis,
				active_record: null,
				slot: null,
				partition_index: null,
				...fields,
				assumptions: basis === "none" || basis === "unknown" ? [] : basis === "no-otadata" ? [...BOOT_ASSUMPTIONS] : [RECORDS_ASSUMPTION, ...BOOT_ASSUMPTIONS],
				running_partition: "unknown"
			});
			const factoryIndex = { partition_index: boot.factory?.index ?? null };
			if (tableRejected) return selection("none");
			if (otadata === undefined || otadata.offset === 0) return selection("no-otadata", factoryIndex);
			const { records, size } = otadata;
			if (size < 8192) return selection("none");
			const factory = selection("factory-fallback", factoryIndex);
			const fallback = boot.factory !== undefined ? factory : selection("ota_0-fallback", {
				slot: 0,
				partition_index: boot.otaSlots.get(0)?.index ?? null
			});
			if (boot.otaAppCount === 0) return fallback;
			if (records.length < 2) return selection("unknown");
			if (records.every(unusable)) return fallback;
			const valid = records.filter(({ valid }) => valid);
			const [first, second] = valid;
			const active = first !== undefined && second !== undefined && second.ota_seq > first.ota_seq ? second : first;
			if (active === undefined) return factory;
			const slot = (active.ota_seq - 1 >>> 0) % boot.otaAppCount;
			return selection("otadata", {
				active_record: active.index,
				slot,
				partition_index: boot.otaSlots.get(slot)?.index ?? null
			});
		};
	})))();
}

//#endregion
//#region dist/domain/firmware/espFlashLayout.js
var SAFE_LABEL, WINDOWS_DEVICE_NAME, partitionPaths, region, rangeText, partitionName, otadataPlan, planEspFlashLayout, regionEnd, declaresRegion, overlaps, gapsBetween, finishEspFlashLayout, otaFacts, espFlashPartitionFacts, espErasedSlotLimitation;
function init_espFlashLayout() {
	return (init_espFlashLayout = __esmMin((() => {
		init_espImageStructures();
		init_espPartitionTable();
		init_espOtaData();
		SAFE_LABEL = /^(?=.*[A-Za-z_])[A-Za-z0-9_][A-Za-z0-9._-]{0,15}$/u;
		WINDOWS_DEVICE_NAME = /^(?:con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)/iu;
		partitionPaths = (partitions) => {
			const counts = new Map();
			for (const { label } of partitions) if (label !== null) {
				const folded = label.toLowerCase();
				counts.set(folded, (counts.get(folded) ?? 0) + 1);
			}
			return new Map(partitions.map((part) => {
				const label = part.label;
				const named = label !== null && SAFE_LABEL.test(label) && !WINDOWS_DEVICE_NAME.test(label) && counts.get(label.toLowerCase()) === 1;
				return [part.index, `partitions/${named ? label : String(part.index)}.bin`];
			}));
		};
		region = (input, fields) => {
			const fileOffset = fields.flashAddress - input.origin.value;
			const start = Math.max(0, fileOffset);
			const end = Math.min(input.fileSize, fileOffset + fields.length);
			return {
				...fields,
				fileOffset,
				available: Math.max(0, end - start)
			};
		};
		rangeText = (address, length) => `${offsetText(address)}-${offsetText(address + length)}`;
		partitionName = (part) => part.label ?? `#${String(part.index)}`;
		otadataPlan = (input, partition, limitations) => {
			const name = partitionName(partition);
			const small = partition.size < ESP_OTA_DATA_MIN_BYTES;
			if (small) limitations.push(`The otadata partition ${name} is ${offsetText(partition.size)} bytes, smaller than the two 4 KiB sectors ESP-IDF's bootloader reads; the bootloader resets without selecting an app.`);
			const records = [];
			for (const index of [0, 1]) {
				const within = index * ESP_OTA_DATA_SECTOR_BYTES;
				if (within + 32 > partition.size) continue;
				const fileOffset = partition.offset + within - input.origin.value;
				const available = fileOffset >= 0 && fileOffset + 32 <= input.fileSize;
				if (!available) limitations.push(`otadata record ${String(index)} of partition ${name} at flash ${offsetText(partition.offset + within)} is outside the dump${small ? "." : "; the OTA selection is unknown."}`);
				records.push({
					index,
					fileOffset,
					available
				});
			}
			return {
				partition,
				records
			};
		};
		planEspFlashLayout = (input) => {
			const limitations = [...input.table.limitations];
			const regions = [];
			const tableEnd = input.tableAddress + ESP_PARTITION_TABLE_SECTOR_BYTES;
			const { bootloader } = input;
			if (bootloader !== undefined) {
				if (bootloader.flashAddress < input.tableAddress) regions.push(region(input, {
					path: "bootloader.bin",
					role: "bootloader",
					flashAddress: bootloader.flashAddress,
					length: input.tableAddress - bootloader.flashAddress,
					partition: undefined
				}));
				else limitations.push(`The partition table at ${offsetText(input.tableAddress)} does not follow the bootloader at ${offsetText(bootloader.flashAddress)}; the bootloader region is not described.`);
			}
			regions.push(region(input, {
				path: "partition-table.bin",
				role: "partition-table",
				flashAddress: input.tableAddress,
				length: ESP_PARTITION_TABLE_SECTOR_BYTES,
				partition: undefined
			}));
			const paths = partitionPaths(input.table.partitions);
			for (const part of input.table.partitions) {
				const placed = region(input, {
					path: paths.get(part.index) ?? `partitions/${String(part.index)}.bin`,
					role: "partition",
					flashAddress: part.offset,
					length: part.size,
					partition: part
				});
				const name = partitionName(part);
				if (part.offset < tableEnd && espPrimaryLayoutRole(part) === undefined) limitations.push(`Partition ${name} at ${offsetText(part.offset)} starts before the end of the partition table at ${offsetText(tableEnd)}; gen_esp32part.py rejects such a table.`);
				if (placed.fileOffset < 0) limitations.push(`Partition ${name} at ${offsetText(part.offset)} begins before the dump's first byte at flash ${offsetText(input.origin.value)}; it is not read.`);
				else if (placed.available === 0) limitations.push(`Partition ${name} at ${rangeText(part.offset, part.size)} lies outside the dump, which ends at flash ${offsetText(input.origin.value + input.fileSize)}.`);
				else if (placed.available < part.size) limitations.push(`Partition ${name} at ${rangeText(part.offset, part.size)} is truncated: the dump holds ${String(placed.available)} of its ${String(part.size)} bytes.`);
				if (placed.fileOffset >= 0) regions.push(placed);
			}
			limitations.push(...overlaps(regions));
			const boot = espBootPartitions(input.table.partitions);
			limitations.push(...boot.limitations);
			return {
				input,
				regions,
				gaps: gapsBetween(regions, input.fileSize),
				boot,
				otadata: boot.otadata === undefined ? undefined : otadataPlan(input, boot.otadata, limitations),
				limitations
			};
		};
		regionEnd = ({ flashAddress, length }) => flashAddress + length;
		declaresRegion = (first, second) => {
			const [region, entry] = first.partition === undefined ? [first, second] : [second, first];
			return region.partition === undefined && entry.partition !== undefined && espPrimaryLayoutRole(entry.partition) === region.role && region.flashAddress === entry.flashAddress && region.length === entry.length;
		};
		overlaps = (regions) => {
			const ordered = [...regions].sort((left, right) => left.flashAddress - right.flashAddress);
			const found = [];
			let furthest;
			for (const current of ordered) {
				if (furthest !== undefined && current.flashAddress < regionEnd(furthest) && !declaresRegion(furthest, current)) found.push(`${current.path} at ${offsetText(current.flashAddress)} overlaps ${furthest.path}, which ends at ${offsetText(regionEnd(furthest))}.`);
				if (furthest === undefined || regionEnd(current) > regionEnd(furthest)) furthest = current;
			}
			return found;
		};
		gapsBetween = (regions, fileSize) => {
			const covered = regions.map(({ fileOffset, available }) => ({
				start: Math.max(0, fileOffset),
				end: Math.max(0, fileOffset) + available
			})).filter(({ end, start }) => end > start).sort((left, right) => left.start - right.start);
			const gaps = [];
			let cursor = 0;
			for (const { start, end } of covered) {
				if (start > cursor) gaps.push({
					offset: cursor,
					length: start - cursor
				});
				cursor = Math.max(cursor, end);
			}
			if (fileSize > cursor) gaps.push({
				offset: cursor,
				length: fileSize - cursor
			});
			return gaps;
		};
		finishEspFlashLayout = (plan, reads) => {
			const limitations = [...plan.limitations];
			const undescribed = [];
			plan.gaps.forEach((gap, index) => {
				const first = reads.gapFirstUnerased[index];
				if (first !== undefined) undescribed.push({
					offset: first,
					length: gap.offset + gap.length - first
				});
			});
			const total = undescribed.reduce((sum, { length }) => sum + length, 0);
			if (undescribed.length > 0) limitations.push(`${String(undescribed.length)} range(s) of the dump, ${String(total)} bytes in all, lie outside the bootloader region, the partition table and every partition and are not described; each runs from a byte that is not erased flash to the end of its gap.`);
			const otadata = plan.otadata === undefined ? null : otaFacts(plan.otadata, reads.otadataRecords);
			const unplaced = plan.input.table.partitions.some((part) => !plan.regions.some(({ partition }) => partition === part));
			return {
				otadata,
				boot_selection: selectEspBootPartition(plan.boot, plan.otadata === undefined || otadata === null ? undefined : {
					offset: plan.otadata.partition.offset,
					size: plan.otadata.partition.size,
					records: otadata.records
				}, plan.input.table.md5.status === "invalid"),
				undescribed,
				coverage: undescribed.length > 0 || plan.input.bootloader === undefined || unplaced ? "unknown" : "complete",
				limitations
			};
		};
		otaFacts = (otadata, bytes) => ({
			partition_index: otadata.partition.index,
			records: otadata.records.flatMap(({ index, available }, position) => {
				const read = bytes[position];
				return available && read !== undefined && read.length >= 32 ? [decodeEspOtaRecord(read, index)] : [];
			})
		});
		espFlashPartitionFacts = (part, written) => ({
			kind: "esp-flash-partition",
			index: part.index,
			label: part.label,
			label_hex: part.labelHex,
			type: part.type,
			subtype: part.subtype,
			type_name: espPartitionTypeName(part.type),
			subtype_name: espPartitionSubtypeName(part.type, part.subtype),
			flash_address: part.offset,
			size: part.size,
			encrypted: part.encrypted,
			readonly: part.readonly,
			unknown_flags: part.unknownFlags,
			written_offset: written?.offset ?? null,
			written_end: written?.end ?? null,
			written_bytes: written?.bytes ?? null
		});
		espErasedSlotLimitation = (path, written) => written.offset === null || written.end === null ? undefined : `${path} begins with erased flash, so ESP-IDF's bootloader finds no app in it, but ${String(written.bytes)} of its bytes from offset ${offsetText(written.offset)} to ${offsetText(written.end)} are not erased flash; they are not read as an image.`;
	})))();
}

//#endregion
//#region dist/artifacts/EspFlashRegionReads.js
var LABEL$2, HEADER_BYTES, PROBE_BYTES, chunks, readEspFlashRange, firstUnerasedInRange, coveredSegments, tally, readSegments, regionExtent, writtenExtents, noImage, decodeEspFlashImage;
function init_EspFlashRegionReads() {
	return (init_EspFlashRegionReads = __esmMin((() => {
		init_espImage();
		init_espImageStructures();
		init_readFileHandleChunks();
		init_ArtifactReader();
		LABEL$2 = "ESP flash image";
		HEADER_BYTES = 24;
		PROBE_BYTES = 32;
		chunks = ({ handle, signal }, start, length) => readFileHandleChunks(handle, {
			start,
			end: start + length - 1,
			signal,
			cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", `${LABEL$2} read cancelled`, { cause: reason })
		});
		readEspFlashRange = async (context, position, length) => {
			const available = Math.min(length, context.fileSize - position);
			if (position < 0 || available <= 0) return Buffer.alloc(0);
			const parts = [];
			for await (const chunk of chunks(context, position, available)) parts.push(chunk);
			return Buffer.concat(parts);
		};
		firstUnerasedInRange = async (context, range, assertOpen) => {
			if (range.length <= 0) return undefined;
			let position = range.start;
			for await (const chunk of chunks(context, range.start, range.length)) {
				assertOpen();
				const found = firstUnerased(chunk, position);
				if (found !== undefined) return found;
				position += chunk.length;
			}
			return undefined;
		};
		coveredSegments = (ranges) => {
			const cuts = [...new Set(ranges.flatMap(({ start, length }) => [start, start + length]))].sort((left, right) => left - right);
			return cuts.slice(1).flatMap((end, index) => {
				const start = cuts[index];
				const covered = ranges.some((range) => range.start <= start && end <= range.start + range.length);
				return covered ? [{
					start,
					end,
					first: -1,
					last: -1,
					bytes: 0
				}] : [];
			});
		};
		tally = (segment, bytes, position) => {
			for (let index = 0; index < bytes.length; index += 1) if (bytes[index] !== 255) {
				segment.bytes += 1;
				segment.last = position + index;
				if (segment.first < 0) segment.first = segment.last;
			}
		};
		readSegments = async (context, segments, assertOpen) => {
			const start = segments[0].start;
			let position = start;
			let current = 0;
			for await (const chunk of chunks(context, start, segments.at(-1).end - start)) {
				assertOpen();
				let offset = 0;
				while (offset < chunk.length) {
					const segment = segments[current];
					const taken = Math.min(chunk.length - offset, segment.end - position);
					tally(segment, chunk.subarray(offset, offset + taken), position);
					offset += taken;
					position += taken;
					if (position === segment.end) current += 1;
				}
			}
		};
		regionExtent = ({ start, length }, segments) => {
			let first = -1;
			let last = -1;
			let bytes = 0;
			for (const segment of segments) {
				if (segment.start < start || segment.end > start + length) continue;
				bytes += segment.bytes;
				if (first < 0) first = segment.first;
				last = Math.max(last, segment.last);
			}
			return first < 0 ? {
				offset: null,
				end: null,
				bytes: 0
			} : {
				offset: first - start,
				end: last + 1 - start,
				bytes
			};
		};
		writtenExtents = async (context, regions, assertOpen) => {
			const segments = coveredSegments(regions.filter(({ length }) => length > 0));
			let run = 0;
			for (let index = 1; index <= segments.length; index += 1) if (index === segments.length || segments[index].start !== segments[index - 1].end) {
				await readSegments(context, segments.slice(run, index), assertOpen);
				run = index;
			}
			return regions.map((region) => regionExtent(region, segments));
		};
		noImage = (status, limitations) => ({
			status,
			image: null,
			segments: [],
			signature_blocks: [],
			coverage: null,
			limitations: [...limitations]
		});
		decodeEspFlashImage = async (context, region, assertOpen) => {
			const prefix = await readEspFlashRange({
				...context,
				fileSize: region.start + region.length
			}, region.start, PROBE_BYTES);
			if (prefix.length > 0 && prefix.subarray(0, HEADER_BYTES).every((byte) => byte === 255)) return noImage("erased", []);
			const recognized = recognizeEspImage(prefix, region.length);
			if (recognized === "esp8266") return noImage("unrecognized", [ESP8266_REFUSAL]);
			if (recognized !== "esp-image") return noImage("unrecognized", ["The region does not begin with a recognized ESP image header; it may be encrypted or hold other data."]);
			const decoder = createEspImageDecoder(region.length);
			for await (const chunk of chunks(context, region.start, region.length)) {
				assertOpen();
				decoder.write(chunk);
				if (decoder.satisfied) break;
			}
			const image = decoder.finish();
			if (!image.ok) return noImage("unrecognized", [image.error.message]);
			return {
				status: "esp-image",
				image: image.value.metadata,
				segments: image.value.segments.map(({ metadata }) => ({ ...metadata })),
				signature_blocks: image.value.signatureBlocks.map(({ metadata }) => ({ ...metadata })),
				coverage: image.value.coverage,
				limitations: [...image.value.limitations]
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/PositionalArtifactReader.js
var PositionalArtifactReader;
function init_PositionalArtifactReader() {
	return (init_PositionalArtifactReader = __esmMin((() => {
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_ArtifactFileOperation();
		init_ArtifactFileSource();
		init_readFileHandleChunks();
		PositionalArtifactReader = class {
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
				if (this.#coverage !== undefined) options?.onCoverage?.({
					...this.#coverage,
					limitations: [...this.#coverage.limitations]
				});
				let index = 0;
				for (const entry of this.#entries.values()) {
					if (index++ % 256 === 0) await setImmediate();
					this.assertOpen(signal);
					yield copyArtifactEntry(entry);
				}
				this.assertOpen(signal);
			}
			async open(entry, signal) {
				return this.#scope.run(async () => {
					this.assertOpen(signal);
					const stored = this.#entries.get(entry.adapterKey);
					if (stored === undefined || !sameArtifactEntry(entry, stored)) throw new ArtifactReaderFailure("integrity", `${this.#label} entry does not match its owning inventory`);
					if (stored.encrypted) throw new ArtifactReaderFailure("unavailable", `Encrypted ${this.#label} member is unsupported: ${stored.path}`);
					const { handle } = await this.#source.read(signal);
					this.assertOpen(signal);
					const source = stored.declaredSize === 0 ? Readable.from([]) : readFileHandleChunks(handle, {
						start: stored.byteOffset,
						end: stored.byteOffset + stored.declaredSize - 1,
						signal,
						cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", `${this.#label} read cancelled`, { cause: reason })
					});
					const output = this.#entryStream(stored, signal);
					output.on("error", () => undefined);
					this.#streams.add(output);
					let producerComplete = false;
					const onAbort = () => {
						if (!producerComplete || output.destroyed) return;
						output.destroy(new ArtifactReaderFailure("cancelled", `${this.#label} read cancelled`, { cause: signal?.reason }));
					};
					const retired = new Promise((resolve) => {
						output.once("close", () => {
							this.#streams.delete(output);
							signal?.removeEventListener("abort", onAbort);
							resolve();
						});
					});
					signal?.addEventListener("abort", onAbort, { once: true });
					if (signal?.aborted) onAbort();
					void this.#scope.run(async () => {
						await Promise.all([new Promise((resolve) => {
							pipeline$1(source, output, () => {
								producerComplete = true;
								if (signal?.aborted) onAbort();
								resolve();
							});
						}), retired]);
					}).catch((cause) => output.destroy(cause instanceof Error ? cause : new Error(`${this.#label} stream ownership failed`, { cause })));
					return output;
				});
			}
			async close() {
				this.#closing = true;
				for (const stream of this.#streams) stream.destroy(new ArtifactReaderFailure("unavailable", `${this.#label} reader closed`));
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
				if (this.#closing) throw new ArtifactReaderFailure("unavailable", `${this.#label} reader is closed`);
			}
			async #prepare(signal) {
				const { entries, coverage } = await this.prepareEntries(signal);
				for (const entry of entries) this.#entries.set(entry.adapterKey, entry);
				this.#coverage = coverage;
			}
			#entryStream(entry, signal) {
				const label = this.#label;
				let bytes = 0;
				const check = async () => {
					if (bytes !== entry.declaredSize) throw new ArtifactReaderFailure("integrity", `${label} entry ended early: ${entry.path}`);
					await this.#source.read(signal);
				};
				return new Transform({
					transform(chunk, _encoding, callback) {
						bytes += chunk.length;
						callback(null, chunk);
					},
					flush(callback) {
						void check().then(() => callback(), (cause) => callback(cause instanceof Error ? cause : new Error(`${label} read failed`, { cause })));
					}
				});
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/EspFlashImageArtifactReader.js
var LABEL$1, EspFlashImageArtifactReader, erasedSlotLimitations, regionEntry, layoutMetadata;
function init_EspFlashImageArtifactReader() {
	return (init_EspFlashImageArtifactReader = __esmMin((() => {
		init_espChips();
		init_espFlashLayout();
		init_espFlashLocation();
		init_espImageStructures();
		init_espOtaData();
		init_espPartitionTable();
		init_ArtifactReader();
		init_EspFlashRegionReads();
		init_PositionalArtifactReader();
		LABEL$1 = "ESP flash image";
		EspFlashImageArtifactReader = class extends PositionalArtifactReader {
			format = "esp-flash-image";
			#located;
			#selection;
			#metadata;
			constructor(path, admitted, selection = {}) {
				const admission = admitted !== undefined && "kind" in admitted ? admitted : undefined;
				super(path, LABEL$1, admission?.source ?? admitted);
				this.#located = admission?.location;
				this.#selection = selection;
			}
			formatMetadata() {
				return this.#metadata === undefined ? undefined : structuredClone(this.#metadata);
			}
			async prepareEntries(signal) {
				const { handle, initial } = await this.verifyCarrier(signal);
				const fileSize = initial.size;
				const location = this.#located ?? await this.#locate(handle, fileSize, signal);
				const plan = planEspFlashLayout({
					fileSize,
					origin: location.origin,
					bootloader: location.bootloader,
					tableAddress: location.tableAddress,
					tableMethod: location.tableMethod,
					table: location.table
				});
				const context = {
					handle,
					fileSize,
					signal
				};
				const facts = await this.#readFacts(context, plan);
				const images = await this.#decodeImages(context, plan);
				const written = await this.#readWritten(context, plan);
				await this.verifyCarrier(signal);
				this.#metadata = layoutMetadata(location, plan, facts, images);
				const limitations = [
					...location.limitations,
					...location.tableMethod === "scan" ? [`The partition table at ${offsetText(location.tableAddress)} was found by scanning 0x1000-aligned flash sectors for a table whose MD5 verifies; the dump does not record the bootloader's configured table offset.`] : [],
					...facts.limitations,
					...erasedSlotLimitations(images, written)
				];
				return {
					entries: plan.regions.map((region) => regionEntry(region, written.get(region), fileSize)),
					coverage: facts.coverage === "unknown" || limitations.length > 0 ? {
						status: facts.coverage,
						limitations
					} : undefined
				};
			}
			async #locate(handle, fileSize, signal) {
				const located = await locateEspFlashLayout(fileSize, (position, length) => readEspFlashRange({
					handle,
					fileSize,
					signal
				}, position, length), this.#selection, {
					explicit: true,
					...signal === undefined ? {} : { signal }
				});
				if (!located.ok) throw new ArtifactReaderFailure("unavailable", `${LABEL$1} layout is not recognized: ${located.error}`);
				return located.value;
			}
			async #readFacts(context, plan) {
				const otadataRecords = [];
				for (const { fileOffset, available } of plan.otadata?.records ?? []) otadataRecords.push(available ? await readEspFlashRange(context, fileOffset, 32) : undefined);
				const gapFirstUnerased = [];
				for (const gap of plan.gaps) {
					this.assertOpen(context.signal);
					gapFirstUnerased.push(await firstUnerasedInRange(context, {
						start: gap.offset,
						length: gap.length
					}, () => this.assertOpen(context.signal)));
				}
				return finishEspFlashLayout(plan, {
					otadataRecords,
					gapFirstUnerased
				});
			}
			/**
			* Where each partition the dump holds is not erased flash, from one read
			* of the bytes the partitions cover, however many overlap.
			*/
			async #readWritten(context, plan) {
				const held = plan.regions.filter(({ partition, available }) => partition !== undefined && available > 0);
				this.assertOpen(context.signal);
				const extents = await writtenExtents(context, held.map(({ fileOffset, available }) => ({
					start: fileOffset,
					length: available
				})), () => this.assertOpen(context.signal));
				return new Map(held.map((region, index) => [region, extents[index]]));
			}
			/**
			* ESP image facts for the bootloader region and each app partition.
			* Regions over the same bytes share one decode, however many the table
			* declares.
			*/
			async #decodeImages(context, plan) {
				const images = new Map();
				const decoded = new Map();
				for (const region of plan.regions) {
					const image = region.role === "bootloader" || region.partition !== undefined && isEspAppPartition(region.partition);
					if (!image || region.available === 0) continue;
					this.assertOpen(context.signal);
					const range = `${String(region.fileOffset)}+${String(region.available)}`;
					let facts = decoded.get(range);
					if (facts === undefined) {
						facts = await decodeEspFlashImage(context, {
							start: region.fileOffset,
							length: region.available
						}, () => this.assertOpen(context.signal));
						decoded.set(range, facts);
					}
					images.set(region, structuredClone(facts));
				}
				return images;
			}
		};
		erasedSlotLimitations = (images, written) => [...images].flatMap(([region, image]) => {
			const extent = written.get(region);
			const limitation = region.partition === undefined || image.status !== "erased" || extent === undefined ? undefined : espErasedSlotLimitation(region.path, extent);
			return limitation === undefined ? [] : [limitation];
		});
		regionEntry = (region, written, fileSize) => ({
			path: region.path,
			...region.partition?.label === null || region.partition === undefined ? {} : { sourcePath: region.partition.label },
			kind: "file",
			declaredSize: region.available,
			compressedSize: null,
			executable: false,
			encrypted: false,
			byteOffset: Math.min(region.fileOffset, fileSize),
			declaredIntegrity: null,
			unpacked: false,
			limitations: region.available === 0 ? [`${region.path} lies outside the dump: the file holds none of its ${String(region.length)} bytes.`] : region.available < region.length ? [`${region.path} is truncated: the dump holds ${String(region.available)} of its ${String(region.length)} bytes.`] : [],
			adapterKey: `esp-flash-image:${region.path}`,
			...region.partition === undefined ? {} : { formatMetadata: espFlashPartitionFacts(region.partition, written) }
		});
		layoutMetadata = (location, plan, facts, images) => {
			const bootloaderRegion = plan.regions.find(({ role }) => role === "bootloader");
			const bootloaderFacts = bootloaderRegion === undefined ? undefined : images.get(bootloaderRegion);
			const placed = new Set(plan.regions.flatMap(({ partition }) => partition === undefined ? [] : [partition.index]));
			const { bootloader, table } = location;
			return {
				kind: "esp-flash-image",
				flash_offset: location.origin,
				chip: bootloader === undefined ? null : {
					target: bootloader.chip.target,
					isa: bootloader.chip.isa,
					source: ESP_CHIP_TABLE_SOURCE
				},
				bootloader: bootloaderRegion === undefined || bootloaderFacts === undefined ? null : {
					path: bootloaderRegion.path,
					flash_address: bootloaderRegion.flashAddress,
					region_size: bootloaderRegion.length,
					facts: bootloaderFacts
				},
				partition_table: {
					flash_address: location.tableAddress,
					method: location.tableMethod,
					partition_count: table.partitions.length,
					md5: {
						status: table.md5.status,
						stored: table.md5.stored,
						computed: table.md5.computed
					}
				},
				partitions_outside_dump: table.partitions.filter(({ index }) => !placed.has(index)).map((part) => espFlashPartitionFacts(part)),
				apps: [...images].flatMap(([region, image]) => region.partition === undefined ? [] : [{
					path: region.path,
					partition_index: region.partition.index,
					facts: image
				}]),
				otadata: facts.otadata === null ? null : {
					partition_index: facts.otadata.partition_index,
					records: facts.otadata.records.map((record) => ({ ...record }))
				},
				boot_selection: {
					...facts.boot_selection,
					assumptions: [...facts.boot_selection.assumptions]
				},
				undescribed: [...facts.undescribed]
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/EspImageArtifactReader.js
var LABEL, EspImageArtifactReader, flashDumpLimitation, decodeFailure;
function init_EspImageArtifactReader() {
	return (init_EspImageArtifactReader = __esmMin((() => {
		init_espChips();
		init_espFlashLocation();
		init_espImage();
		init_espImageFacts();
		init_espImageStructures();
		init_ArtifactReader();
		init_EspFlashRegionReads();
		init_PositionalArtifactReader();
		init_readFileHandleChunks();
		LABEL = "ESP image";
		EspImageArtifactReader = class extends PositionalArtifactReader {
			format = "esp-image";
			#metadata;
			constructor(path, admitted) {
				super(path, LABEL, admitted);
			}
			formatMetadata() {
				return this.#metadata === undefined ? undefined : structuredClone(this.#metadata);
			}
			async prepareEntries(signal) {
				const image = await this.#decode(signal);
				const entries = [];
				for (const segment of image.segments) {
					const { index, data_len } = segment.metadata;
					const entry = {
						path: `segment-${String(index).padStart(2, "0")}.bin`,
						kind: "file",
						declaredSize: segment.availableLength,
						compressedSize: null,
						executable: false,
						encrypted: false,
						byteOffset: segment.dataOffset,
						declaredIntegrity: null,
						unpacked: false,
						limitations: segment.availableLength < data_len ? [ESP_IMAGE_LIMITATIONS.segmentEntryTruncated(index, data_len, segment.availableLength)] : [],
						adapterKey: `esp-image:segment:${String(index)}`,
						formatMetadata: { ...segment.metadata }
					};
					entries.push(entry);
				}
				for (const block of image.signatureBlocks) {
					const entry = {
						path: `signature-block-${String(block.metadata.index)}.bin`,
						kind: "file",
						declaredSize: ESP_SIGNATURE_BLOCK_BYTES,
						compressedSize: null,
						executable: false,
						encrypted: false,
						byteOffset: block.offset,
						declaredIntegrity: null,
						unpacked: false,
						limitations: [],
						adapterKey: `esp-image:signature-block:${String(block.metadata.index)}`,
						formatMetadata: { ...block.metadata }
					};
					entries.push(entry);
				}
				const dump = await this.#flashDump(image, signal);
				this.#metadata = {
					...image.metadata,
					flash_dump: dump === undefined ? null : {
						flash_offset: dump.flashOffset,
						table_file_offset: dump.tableFileOffset
					}
				};
				const limitations = [...image.limitations, ...dump === undefined ? [] : [flashDumpLimitation(image, dump)]];
				return {
					entries,
					coverage: image.coverage === "unknown" || limitations.length > 0 ? {
						status: image.coverage,
						limitations
					} : undefined
				};
			}
			/**
			* Whether this image is the bootloader at the start of a flash dump read
			* from a later flash address. An app carries `esp_app_desc_t` and is not.
			*/
			async #flashDump(image, signal) {
				const chip = espChipForId(image.metadata.header.chip_id);
				if (chip === undefined || chip.romBootloaderOffset === 0 || image.metadata.descriptor?.kind === "app") return undefined;
				this.assertOpen(signal);
				const { handle, initial } = await this.verifyCarrier(signal);
				const context = {
					handle,
					fileSize: initial.size,
					signal
				};
				return espFlashDumpOrigin((position, length) => readEspFlashRange(context, position, length), initial.size, {
					chip,
					fileOffset: 0,
					end: image.metadata.image_end ?? initial.size
				});
			}
			/** Stream the carrier once, stopping when later bytes cannot matter. */
			async #decode(signal) {
				const { handle, initial } = await this.verifyCarrier(signal);
				const decoder = createEspImageDecoder(initial.size);
				if (initial.size > 0) for await (const chunk of readFileHandleChunks(handle, {
					end: initial.size - 1,
					signal,
					cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", `${LABEL} read cancelled`, { cause: reason })
				})) {
					this.assertOpen(signal);
					decoder.write(chunk);
					if (decoder.satisfied) break;
				}
				await this.verifyCarrier(signal);
				const image = decoder.finish();
				if (!image.ok) throw decodeFailure(image.error);
				return image.value;
			}
		};
		flashDumpLimitation = (image, dump) => `This file looks like a flash dump read from flash ${offsetText(dump.flashOffset)}, not one ESP image: its ${image.metadata.chip?.target ?? "ESP"} image at file offset 0 is where the ROM loads the bootloader from ${offsetText(dump.flashOffset)}, and a partition table sits at file offset ${offsetText(dump.tableFileOffset)}, which is flash 0x8000 from that origin. Reopen it with format esp-flash-image and flash_offset ${offsetText(dump.flashOffset)}.`;
		decodeFailure = (failure) => failure.kind === "unsupported" ? new ArtifactReaderFailure("unavailable", failure.message) : new ArtifactReaderFailure("format", `${LABEL} is malformed: ${failure.message}`);
	})))();
}

//#endregion
//#region dist/artifacts/fit/FitStructure.js
var FIT_MAX_IMAGES, FIT_MAX_HASH_NODES_PER_IMAGE, FIT_MAX_CONFIGURATIONS, FIT_MAX_CONFIGURATION_REFERENCES, DIGEST_BYTES, DATA_SOURCES, CONFIGURATION_REFERENCES, align4, formatFailure$5, capacityFailure, nodeName, propertyOf, valueOf, utf8, nulCount, nulStrings, createFitDigest, fitString, fitStrings, fitU32, fitAddress, strictCell, imageRange, imageHashes, signatureAlgorithms, imageDeclaration, assertImageDataLinks, assertDisjoint, fitConfiguration, fitConfigurations, parseFit, readFitStructure;
function init_FitStructure() {
	return (init_FitStructure = __esmMin((() => {
		init_artifactExpansionBudget();
		init_devicetree();
		init_DevicetreeParser();
		init_BinaryContainer();
		init_ArtifactReader();
		FIT_MAX_IMAGES = 1024;
		FIT_MAX_HASH_NODES_PER_IMAGE = 8;
		FIT_MAX_CONFIGURATIONS = 1024;
		FIT_MAX_CONFIGURATION_REFERENCES = 16384;
		DIGEST_BYTES = new Map([
			["crc32", 4],
			["md5", 16],
			["sha1", 20],
			["sha256", 32],
			["sha384", 48],
			["sha512", 64]
		]);
		DATA_SOURCES = [
			"data",
			"data-offset",
			"data-position"
		];
		CONFIGURATION_REFERENCES = [
			"kernel",
			"firmware",
			"fdt",
			"ramdisk",
			"loadables"
		];
		align4 = (value) => Math.ceil(value / 4) * 4;
		formatFailure$5 = (detail) => new ArtifactReaderFailure("format", `FIT is malformed: ${detail}`);
		capacityFailure = (message) => new ArtifactReaderFailure("limit", message, { boundary: "capacity" });
		nodeName = (node) => node.path.slice(node.path.lastIndexOf("/") + 1);
		propertyOf = (node, name) => node.properties.find((property) => property.name === name);
		valueOf = (fdt, property) => fdt.subarray(property.offset, property.offset + property.bytes);
		utf8 = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
		nulCount = (raw) => {
			let count = 0;
			for (const byte of raw) if (byte === 0) count += 1;
			return count;
		};
		nulStrings = (fdt, property, maxStrings = 1) => {
			if (property === undefined) return undefined;
			const raw = valueOf(fdt, property);
			if (raw.at(-1) !== 0 || nulCount(raw) > maxStrings) return undefined;
			try {
				return utf8.decode(raw.subarray(0, -1)).split("\0");
			} catch {
				return undefined;
			}
		};
		createFitDigest = (algo) => {
			if (!DIGEST_BYTES.has(algo)) return undefined;
			if (algo !== "crc32") {
				const hash = createHash(algo);
				return {
					update: (chunk) => {
						hash.update(chunk);
					},
					digest: () => hash.digest()
				};
			}
			let value = 0;
			return {
				update: (chunk) => {
					value = crc32(chunk, value);
				},
				digest: () => Buffer.from(value.toString(16).padStart(8, "0"), "hex")
			};
		};
		fitString = (facts, node, name) => {
			const property = propertyOf(node, name);
			if (property === undefined) return null;
			const strings = nulStrings(facts.fdt, property);
			if (strings?.length === 1) return strings[0] ?? null;
			facts.limitations.push(`${node.path}: ${name} is not a NUL-terminated UTF-8 string`);
			return null;
		};
		fitStrings = (facts, node, name) => {
			const property = propertyOf(node, name);
			if (property === undefined) return [];
			const strings = nulStrings(facts.fdt, property, FIT_MAX_CONFIGURATION_REFERENCES);
			if (strings !== undefined) return strings;
			facts.limitations.push(`${node.path}: ${name} is not a NUL-terminated UTF-8 string list`);
			return [];
		};
		fitU32 = (facts, node, name) => {
			const property = propertyOf(node, name);
			if (property === undefined) return null;
			if (property.bytes === 4) return facts.fdt.readUInt32BE(property.offset);
			facts.limitations.push(`${node.path}: ${name} is not a single 32-bit cell`);
			return null;
		};
		fitAddress = (facts, node, name) => {
			const property = propertyOf(node, name);
			if (property === undefined) return null;
			if (property.bytes !== 4 && property.bytes !== 8) {
				facts.limitations.push(`${node.path}: ${name} is not a 1- or 2-cell address`);
				return null;
			}
			let value = 0n;
			for (let offset = 0; offset < property.bytes; offset += 4) value = value << 32n | BigInt(facts.fdt.readUInt32BE(property.offset + offset));
			return `0x${value.toString(16)}`;
		};
		strictCell = (fdt, node, property) => {
			if (property.bytes !== 4) throw formatFailure$5(`${node.path}: ${property.name} is not a single 32-bit cell`);
			return fdt.readUInt32BE(property.offset);
		};
		imageRange = (layout, node) => {
			const declared = DATA_SOURCES.flatMap((name) => {
				const property = propertyOf(node, name);
				return property === undefined ? [] : [{
					name,
					property
				}];
			});
			const [source] = declared;
			if (source === undefined) throw formatFailure$5(`${node.path} has no data, data-offset or data-position`);
			if (declared.length > 1) throw formatFailure$5(`${node.path} declares more than one data source`);
			if (source.name === "data") return {
				start: source.property.offset,
				size: source.property.bytes,
				data_source: "embedded",
				declared_offset: null
			};
			const declaredOffset = strictCell(layout.fdt, node, source.property);
			const sizeProperty = propertyOf(node, "data-size");
			if (sizeProperty === undefined) throw formatFailure$5(`${node.path}: ${source.name} requires data-size`);
			const size = strictCell(layout.fdt, node, sizeProperty);
			const start = source.name === "data-offset" ? align4(layout.totalsize) + declaredOffset : declaredOffset;
			if (start + size > layout.fileSize) throw formatFailure$5(`${node.path}: data at [${String(start)}, ${String(start + size)}) lies outside the ${String(layout.fileSize)}-byte file`);
			return {
				start,
				size,
				data_source: source.name,
				declared_offset: declaredOffset
			};
		};
		imageHashes = (facts, image, children) => {
			const nodes = children.filter((child) => nodeName(child).startsWith("hash"));
			if (nodes.length > 8) throw capacityFailure(`FIT image ${nodeName(image)} declares ${String(nodes.length)} hash nodes, above the fixed ${String(8)}-node allowance`);
			const hashes = [];
			const algorithms = [];
			let unverified = 0;
			for (const node of nodes) {
				const name = nodeName(node);
				const algos = nulStrings(facts.fdt, propertyOf(node, "algo"));
				const algo = algos?.length === 1 ? algos[0] : undefined;
				const value = propertyOf(node, "value");
				const expected = algo === undefined ? undefined : DIGEST_BYTES.get(algo);
				if (algo !== undefined) algorithms.push(algo);
				if (algo === undefined || expected === undefined || value === undefined) {
					unverified += 1;
					facts.limitations.push(algo === undefined ? `${name} has no NUL-terminated UTF-8 algo; it is not verified` : expected === undefined ? `${name} algorithm "${algo}" is not verified` : `${name} has no value; it is not verified`);
					continue;
				}
				if (value.bytes !== expected) throw new ArtifactReaderFailure("integrity", `FIT image ${nodeName(image)} ${name} ${algo} value is ${String(value.bytes)} bytes; ${algo} values are ${String(expected)} bytes`);
				hashes.push({
					node: name,
					algo,
					value: Buffer.from(valueOf(facts.fdt, value))
				});
			}
			return {
				hashes,
				algorithms,
				unverified
			};
		};
		signatureAlgorithms = (facts, children) => {
			const algorithms = [];
			let count = 0;
			let unreadable = 0;
			for (const child of children) {
				if (!nodeName(child).startsWith("signature")) continue;
				count += 1;
				const algo = fitString(facts, child, "algo");
				if (algo !== null) algorithms.push(algo);
				else {
					unreadable += 1;
					if (propertyOf(child, "algo") === undefined) facts.limitations.push(`${child.path}: signature algo is missing`);
				}
			}
			return {
				algorithms,
				count,
				unreadable
			};
		};
		imageDeclaration = (layout, node, index) => {
			const facts = {
				fdt: layout.fdt,
				limitations: []
			};
			const name = nodeName(node);
			const children = layout.children.get(node.path) ?? [];
			const range = imageRange(layout, node);
			const imageDataProperty = propertyOf(node, "image-data");
			const imageData = nulStrings(layout.fdt, imageDataProperty);
			if (imageDataProperty !== undefined && imageData?.length !== 1) throw formatFailure$5(`${node.path}: image-data is not one string`);
			const cipher = children.find((child) => nodeName(child) === "cipher");
			const unreadable = new Set();
			const field = (key, reader, source = node, property = key) => {
				const value = reader(facts, source, property);
				if (value === null && propertyOf(source, property) !== undefined) unreadable.add(key);
				return value;
			};
			const metadata = {
				kind: "fit-image",
				index,
				name,
				description: field("description", fitString),
				type: field("type", fitString),
				arch: field("arch", fitString),
				os: field("os", fitString),
				compression: field("compression", fitString),
				load: field("load", fitAddress),
				entry: field("entry", fitAddress),
				data_source: range.data_source,
				declared_offset: range.declared_offset,
				image_data: imageData?.[0] ?? null,
				cipher_present: cipher !== undefined,
				cipher_algo: cipher === undefined ? null : field("cipher_algo", fitString, cipher, "algo")
			};
			const { hashes, algorithms, unverified } = imageHashes(facts, node, children);
			const signatures = signatureAlgorithms(facts, children);
			return {
				index,
				name,
				start: range.start,
				size: range.size,
				limitations: facts.limitations,
				hashes,
				metadata: {
					...metadata,
					unreadable_fields: [...unreadable].sort(),
					hash_algorithms: algorithms,
					hashes_verified: hashes.length,
					hashes_unverified: unverified,
					signature_count: signatures.count,
					signatures_unreadable: signatures.unreadable,
					signature_algorithms: signatures.algorithms
				}
			};
		};
		assertImageDataLinks = (images, fdt) => {
			const byName = new Map(images.map((image) => [image.name, image]));
			for (const image of images) {
				const name = image.metadata.image_data;
				if (name === null) continue;
				const target = byName.get(name);
				const path = `/images/${image.name}`;
				if (target === undefined) throw formatFailure$5(`${path}: image-data names no image: ${name}`);
				if (target.metadata.image_data !== null) throw formatFailure$5(`${path}: image-data target /images/${name} has its own image-data`);
				if (target.metadata.data_source === "embedded" !== (image.metadata.data_source === "embedded") || target.size !== image.size || (image.metadata.data_source === "embedded" ? !fdt.subarray(image.start, image.start + image.size).equals(fdt.subarray(target.start, target.start + target.size)) : target.start !== image.start)) throw formatFailure$5(`${path}: data does not match its image-data target /images/${name}`);
			}
		};
		assertDisjoint = (images, totalsize) => {
			const owner = (image) => image.metadata.image_data ?? image.name;
			const ranges = images.filter((image) => image.metadata.data_source !== "embedded" && image.size > 0).sort((a, b) => a.start - b.start || a.index - b.index);
			let previous;
			let end = totalsize;
			for (const image of ranges) {
				if (image.start < end) {
					if (previous !== undefined && previous.start === image.start && previous.size === image.size && owner(previous) === owner(image)) continue;
					throw formatFailure$5(`image data overlaps: /images/${image.name} and ${previous === undefined ? "the FIT devicetree" : `/images/${previous.name}`}`);
				}
				previous = image;
				end = image.start + image.size;
			}
		};
		fitConfiguration = (layout, facts, node, images) => {
			const references = {
				kernel: fitStrings(facts, node, "kernel"),
				firmware: fitStrings(facts, node, "firmware"),
				fdt: fitStrings(facts, node, "fdt"),
				ramdisk: fitStrings(facts, node, "ramdisk"),
				loadables: fitStrings(facts, node, "loadables")
			};
			let unresolved = 0;
			for (const values of Object.values(references)) for (const reference of values) if (!images.has(reference)) unresolved += 1;
			if (unresolved > 0) facts.limitations.push(`${node.path}: ${String(unresolved)} image references do not name an /images node`);
			const signatures = signatureAlgorithms(facts, layout.children.get(node.path) ?? []);
			return {
				name: nodeName(node),
				description: fitString(facts, node, "description"),
				...references,
				unresolved_reference_count: unresolved,
				signature_count: signatures.count,
				signatures_unreadable: signatures.unreadable,
				signature_algorithms: signatures.algorithms
			};
		};
		fitConfigurations = (layout, facts, node, images) => {
			if (node === undefined) return {
				default_configuration: null,
				configurations: []
			};
			const children = layout.children.get(node.path) ?? [];
			if (children.length > 1024) throw capacityFailure(`FIT declares ${String(children.length)} configurations, above the fixed ${String(FIT_MAX_CONFIGURATIONS)}-configuration allowance`);
			let references = 0;
			for (const child of children) for (const name of CONFIGURATION_REFERENCES) {
				const property = propertyOf(child, name);
				if (property !== undefined) references += nulCount(valueOf(layout.fdt, property));
			}
			if (references > 16384) throw capacityFailure(`FIT configurations declare ${String(references)} image references, above the fixed ${String(FIT_MAX_CONFIGURATION_REFERENCES)}-reference allowance`);
			const configurations = children.map((child) => fitConfiguration(layout, facts, child, images));
			const defaultConfiguration = fitString(facts, node, "default");
			if (defaultConfiguration !== null && !configurations.some((entry) => entry.name === defaultConfiguration)) facts.limitations.push(`${node.path}: default ${defaultConfiguration} names no configuration`);
			return {
				default_configuration: defaultConfiguration,
				configurations
			};
		};
		parseFit = (fdt, path) => {
			try {
				return parseDevicetree(fdt, {
					path,
					sha256: "",
					bytes: fdt.length
				}, {
					path,
					max_file_bytes: MAX_DEVICETREE_FILE_BYTES,
					max_nodes: 8192,
					max_properties: 32768,
					max_depth: 64
				});
			} catch (cause) {
				if (cause instanceof BinaryFormatFailure) throw formatFailure$5(cause.message);
				if (cause instanceof DevicetreeLimitFailure) throw new ArtifactReaderFailure("limit", `FIT devicetree exceeds the fixed ${cause.limit} allowance`, {
					boundary: cause.limit === "decoded_bytes" ? "memory" : "capacity",
					cause
				});
				throw cause;
			}
		};
		readFitStructure = (fdt, path, fileSize) => {
			const tree = parseFit(fdt, path);
			const byPath = new Map(tree.nodes.map((node) => [node.path, node]));
			const children = new Map();
			for (const node of tree.nodes) {
				if (node.parent === null) continue;
				const siblings = children.get(node.parent);
				if (siblings === undefined) children.set(node.parent, [node]);
				else siblings.push(node);
			}
			const root = byPath.get("/");
			if (root === undefined || !byPath.has("/images")) throw formatFailure$5("/images node is missing");
			const { totalsize } = tree.header;
			const layout = {
				fdt,
				children,
				totalsize,
				fileSize
			};
			const imageNodes = children.get("/images") ?? [];
			if (imageNodes.length > 1024) throw capacityFailure(`FIT declares ${String(imageNodes.length)} images, above the fixed ${String(FIT_MAX_IMAGES)}-image allowance`);
			const images = imageNodes.map((node, index) => imageDeclaration(layout, node, index));
			assertImageDataLinks(images, fdt);
			assertDisjoint(images, totalsize);
			const declared = images.reduce((sum, image) => sum + image.size, 0);
			const budget = artifactExpansionBudgetBytes(fileSize);
			if (declared > budget) throw new ArtifactReaderFailure("limit", `FIT images declare ${String(declared)} bytes, exceeding this file's ${String(budget)}-byte expansion budget`, { boundary: "memory" });
			const facts = {
				fdt,
				limitations: []
			};
			return {
				images,
				limitations: facts.limitations,
				metadata: {
					kind: "fit",
					fdt_version: tree.header.version,
					fdt_totalsize: totalsize,
					external_data_base: align4(totalsize),
					description: fitString(facts, root, "description"),
					timestamp: fitU32(facts, root, "timestamp"),
					address_cells: fitU32(facts, root, "#address-cells"),
					...fitConfigurations(layout, facts, byPath.get("/configurations"), new Set(images.map((image) => image.name)))
				}
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/FitArtifactReader.js
var FDT_HEADER_BYTES, FitArtifactReader, cancellationFailure;
function init_FitArtifactReader() {
	return (init_FitArtifactReader = __esmMin((() => {
		init_devicetree();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_ArtifactFileOperation();
		init_ArtifactFileSource();
		init_FitStructure();
		init_readFileHandleChunks();
		init_readFileHandleRange();
		FDT_HEADER_BYTES = 40;
		FitArtifactReader = class {
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
				return this.#metadata === undefined ? undefined : structuredClone(this.#metadata);
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
				if (this.#coverage !== undefined) options?.onCoverage?.({
					...this.#coverage,
					limitations: [...this.#coverage.limitations]
				});
				let index = 0;
				for (const entry of this.#entries.values()) {
					if (index % 256 === 0) await setImmediate();
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
					if (stored === undefined || !sameArtifactEntry(entry, stored)) throw new ArtifactReaderFailure("integrity", "FIT entry does not match its owning inventory");
					const { handle } = await this.#source.read(signal);
					this.#assertOpen(signal);
					if (stored.byteOffset === null || stored.declaredSize === null) throw new ArtifactReaderFailure("format", `FIT image has no byte range: ${stored.path}`);
					const source = stored.declaredSize === 0 ? Readable.from([]) : readFileHandleChunks(handle, {
						start: stored.byteOffset,
						end: stored.byteOffset + stored.declaredSize - 1,
						signal,
						cancellationFailure
					});
					const output = this.#imageStream(stored, signal);
					output.on("error", () => undefined);
					this.#streams.add(output);
					let producerComplete = false;
					const onAbort = () => {
						if (!producerComplete || output.destroyed) return;
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
					if (signal?.aborted) onAbort();
					void this.#scope.run(async () => {
						await Promise.all([new Promise((resolve) => pipeline$1(source, output, () => {
							producerComplete = true;
							if (signal?.aborted) onAbort();
							resolve();
						})), retired]);
					}).catch((cause) => output.destroy(cause instanceof Error ? cause : new Error("FIT stream ownership failed", { cause })));
					return output;
				});
			}
			async close() {
				this.#closing = true;
				for (const stream of this.#streams) stream.destroy(new ArtifactReaderFailure("unavailable", "FIT reader closed"));
				await this.#scope.close();
				await this.#source.close();
				this.#entries.clear();
			}
			provenance() {
				return [];
			}
			#assertOpen(signal) {
				assertArtifactReadActive(signal);
				if (this.#closing) throw new ArtifactReaderFailure("unavailable", "FIT reader is closed");
			}
			async #prepare(signal) {
				const { handle, initial } = await this.#source.read(signal);
				const assertActive = () => this.#assertOpen(signal);
				const header = await readFileHandleRange(handle, 0, FDT_HEADER_BYTES, assertActive);
				if (header.length < FDT_HEADER_BYTES) throw new ArtifactReaderFailure("format", "FIT devicetree header is truncated");
				const totalsize = header.readUInt32BE(4);
				if (totalsize > initial.size) throw new ArtifactReaderFailure("format", `FIT devicetree is truncated: totalsize ${String(totalsize)} exceeds the ${String(initial.size)}-byte file`);
				if (totalsize > 16777216) throw new ArtifactReaderFailure("limit", `FIT devicetree is ${String(totalsize)} bytes, above the fixed 16 MiB devicetree allowance; embedded image data this large is not supported (mkimage -E stores data externally). No runtime override.`, { boundary: "memory" });
				const structure = readFitStructure(await readFileHandleRange(handle, 0, totalsize, assertActive), this.#path, initial.size);
				let index = 0;
				for (const image of structure.images) {
					if (index % 256 === 0) await setImmediate();
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
						formatMetadata: image.metadata
					};
					this.#entries.set(entry.adapterKey, entry);
				}
				this.#metadata = structure.metadata;
				if (structure.limitations.length > 0) this.#coverage = {
					status: "complete",
					limitations: structure.limitations
				};
				await this.#source.read(signal);
			}
			/** One streamed pass per image feeds every supported digest. */
			async #verifyHashes(image, signal) {
				const digests = image.hashes.flatMap((hash) => {
					const digest = createFitDigest(hash.algo);
					return digest === undefined ? [] : [{
						hash,
						digest
					}];
				});
				if (digests.length === 0) return;
				const { handle } = await this.#source.read(signal);
				if (image.size > 0) for await (const chunk of readFileHandleChunks(handle, {
					start: image.start,
					end: image.start + image.size - 1,
					signal,
					cancellationFailure
				})) {
					this.#assertOpen(signal);
					for (const { digest } of digests) digest.update(chunk);
				}
				for (const { hash, digest } of digests) {
					const computed = digest.digest();
					if (!computed.equals(hash.value)) throw new ArtifactReaderFailure("integrity", `FIT image ${image.name} ${hash.node} ${hash.algo} does not match: declared ${hash.value.toString("hex")}, computed ${computed.toString("hex")}`);
				}
			}
			#imageStream(entry, signal) {
				let bytes = 0;
				const check = async () => {
					if (bytes !== entry.declaredSize) throw new ArtifactReaderFailure("format", `FIT image ended early: ${entry.path}`);
					await this.#source.read(signal);
				};
				return new Transform({
					transform(chunk, _encoding, callback) {
						bytes += chunk.length;
						callback(null, chunk);
					},
					flush(callback) {
						void check().then(() => callback(), (cause) => callback(cause instanceof Error ? cause : new Error("FIT read failed", { cause })));
					}
				});
			}
		};
		cancellationFailure = (reason) => new ArtifactReaderFailure("cancelled", "FIT read cancelled", { cause: reason });
	})))();
}

//#endregion
//#region dist/artifacts/GodotPckArtifactReader.js
var PACK_DIR_ENCRYPTED, PACK_REL_FILEBASE, PACK_SPARSE_BUNDLE, PACK_FILE_ENCRYPTED, DIRECTORY_CHUNK_BYTES, MAX_DIRECTORY_METADATA_BYTES, UTF8$2, GodotPckArtifactReader, readGodotPckHeader, pckMemberPath, PckCursor, toSafeOffset, formatFailure$4, metadataLimit;
function init_GodotPckArtifactReader() {
	return (init_GodotPckArtifactReader = __esmMin((() => {
		init_ArtifactFileRange();
		init_godotPckFormat();
		init_artifactExpansionBudget();
		init_ArtifactReader();
		init_ArtifactFileOperation();
		init_GodotPckLocation();
		init_jsonValueByteLength();
		init_PositionalArtifactReader();
		PACK_DIR_ENCRYPTED = 1;
		PACK_REL_FILEBASE = 2;
		PACK_SPARSE_BUNDLE = 4;
		PACK_FILE_ENCRYPTED = 1;
		DIRECTORY_CHUNK_BYTES = 64 * 1024;
		MAX_DIRECTORY_METADATA_BYTES = 64 * 1024 * 1024;
		UTF8$2 = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
		GodotPckArtifactReader = class extends PositionalArtifactReader {
			format = "godot-pck";
			#location;
			#header;
			constructor(path, admitted) {
				const admission = admitted !== undefined && "kind" in admitted ? admitted : undefined;
				super(path, "Godot PCK", admitted !== undefined && "kind" in admitted ? admitted.source : admitted);
				this.#location = admission?.location;
			}
			formatMetadata() {
				return this.#header === undefined ? undefined : { ...this.#header };
			}
			async prepareEntries(signal) {
				const { handle, initial } = await this.verifyCarrier(signal);
				const header = await readGodotPckHeader(handle, initial.size, signal, this.#location);
				this.#header = header;
				if (header.directory_status !== "available") return {
					entries: [],
					coverage: {
						status: "unknown",
						limitations: [header.directory_status === "encrypted" ? "Godot PCK directory is encrypted; member identities and contents remain unknown." : "Godot PCK sparse-bundle member bytes are external and were not traversed."]
					}
				};
				const cursor = new PckCursor(handle, header.directory_start + 4, header.pack_end, signal);
				const entries = [];
				let retainedBytes = 0;
				let declaredPlaintextBytes = 0n;
				const expansionBudget = BigInt(artifactExpansionBudgetBytes(header.pack_end - header.pack_start));
				for (let index = 0; index < header.declared_file_count; index++) {
					if (index % 256 === 0) await setImmediate();
					assertArtifactReadActive(signal);
					const pathBytes = await cursor.uint32();
					if (pathBytes * 18 > MAX_DIRECTORY_METADATA_BYTES - retainedBytes) throw metadataLimit();
					const rawPath = await cursor.bytes(pathBytes);
					const offset = await cursor.uint64();
					const size = await cursor.uint64();
					const md5 = (await cursor.bytes(16)).toString("hex");
					const flags = header.format_version === 1 ? 0 : await cursor.uint32();
					if ((flags & ~PACK_FILE_ENCRYPTED) !== 0) throw new ArtifactReaderFailure("unavailable", `Godot patch or unknown member flags are unsupported: 0x${flags.toString(16)}`);
					const sourcePath = pckMemberPath(rawPath);
					if (header.format_version === 1 && offset === 0n) throw new ArtifactReaderFailure("unavailable", `Godot PCK patch removal entry is unsupported: ${sourcePath}`);
					const start = toSafeOffset(offset, header.file_base, header.pack_end, sourcePath);
					if (size > BigInt(header.pack_end - start)) throw formatFailure$4(`member exceeds the pack: ${sourcePath}`);
					if ((flags & PACK_FILE_ENCRYPTED) === 0) {
						declaredPlaintextBytes += size;
						if (declaredPlaintextBytes > expansionBudget) throw new ArtifactReaderFailure("limit", `Godot PCK readable entries declare ${String(declaredPlaintextBytes)} plaintext bytes, exceeding this pack's ${String(expansionBudget)}-byte expansion budget`);
					}
					const metadata = {
						path: sourcePath.startsWith("res://") ? sourcePath.slice(6) : sourcePath,
						sourcePath,
						kind: "file",
						declaredSize: Number(size),
						compressedSize: null,
						executable: false,
						encrypted: (flags & PACK_FILE_ENCRYPTED) !== 0,
						byteOffset: start,
						declaredIntegrity: /^0{32}$/u.test(md5) ? null : {
							algorithm: "md5",
							digest: md5
						},
						unpacked: false,
						limitations: /^0{32}$/u.test(md5) ? ["Godot PCK declares an all-zero MD5; source integrity is unknown."] : [],
						adapterKey: `godot-pck-entry:${String(index)}`,
						formatMetadata: {
							kind: "godot-pck-entry",
							index,
							source_path: sourcePath,
							declared_offset: Number(offset),
							flags,
							md5_status: /^0{32}$/u.test(md5) ? "all-zero" : "declared"
						}
					};
					retainedBytes += jsonValueByteLength(metadata, MAX_DIRECTORY_METADATA_BYTES - retainedBytes);
					if (retainedBytes > MAX_DIRECTORY_METADATA_BYTES) throw metadataLimit();
					entries.push(metadata);
				}
				await this.verifyCarrier(signal);
				return {
					entries,
					coverage: undefined
				};
			}
		};
		readGodotPckHeader = async (handle, size, signal, admittedLocation) => {
			const location = admittedLocation ?? await locateGodotPck(handle, size, signal);
			if (location === undefined) throw formatFailure$4("no standalone header or executable trailer");
			const { start, end, embedded } = location;
			const fixed = await readArtifactFileBytes(handle, start, 40, end, signal);
			const header = readGodotPckHeaderFacts(fixed);
			const version = header.formatVersion;
			if (![
				1,
				2,
				3,
				4
			].includes(version)) throw new ArtifactReaderFailure("unavailable", `Godot PCK format ${String(version)} is unsupported; plain formats 1, 2, 3 and 4 are supported`);
			const flags = version === 1 ? 0 : fixed.readUInt32LE(20);
			if ((flags & ~(PACK_DIR_ENCRYPTED | PACK_REL_FILEBASE | PACK_SPARSE_BUNDLE)) !== 0) throw new ArtifactReaderFailure("unavailable", `Godot PCK declares unknown pack flags 0x${flags.toString(16)}`);
			const fileBase = version === 1 ? 0 : toSafeOffset(fixed.readBigUInt64LE(24), version >= 3 || (flags & PACK_REL_FILEBASE) !== 0 ? start : 0, end, "file base");
			const directory = version >= 3 ? toSafeOffset(fixed.readBigUInt64LE(32), start, end, "directory") : start + (version === 1 ? 84 : 96);
			const count = (await readArtifactFileBytes(handle, directory, 4, end, signal)).readUInt32LE(0);
			const status = (flags & PACK_DIR_ENCRYPTED) !== 0 ? "encrypted" : (flags & PACK_SPARSE_BUNDLE) !== 0 ? "sparse-bundle" : "available";
			if (status === "available" && count * (version === 1 ? 36 : 40) > end - directory - 4) throw formatFailure$4("declared member count cannot fit in the directory");
			return {
				kind: "godot-pck",
				format_version: version,
				engine_major: header.engineMajor,
				engine_minor: header.engineMinor,
				engine_patch: header.enginePatch,
				pack_start: start,
				pack_end: end,
				embedded,
				pack_flags: flags,
				file_base: fileBase,
				directory_start: directory,
				declared_file_count: count,
				directory_status: status
			};
		};
		pckMemberPath = (raw) => {
			let end = raw.length;
			while (end > 0 && raw[end - 1] === 0) end--;
			let path;
			try {
				path = UTF8$2.decode(raw.subarray(0, end));
			} catch (cause) {
				throw new ArtifactReaderFailure("format", "Godot PCK path is not valid UTF-8", { cause });
			}
			if (path.length === 0 || path === "res://" || path.includes("\0")) throw formatFailure$4("empty or NUL-containing member path");
			return path;
		};
		PckCursor = class {
			handle;
			position;
			end;
			signal;
			#buffer = Buffer.alloc(0);
			#bufferStart = 0;
			constructor(handle, position, end, signal) {
				this.handle = handle;
				this.position = position;
				this.end = end;
				this.signal = signal;
			}
			async bytes(length) {
				if (length > this.end - this.position) throw formatFailure$4("directory entry exceeds the pack");
				if (length > MAX_DIRECTORY_METADATA_BYTES / 18) throw metadataLimit();
				if (length > DIRECTORY_CHUNK_BYTES) {
					const value = await readArtifactFileBytes(this.handle, this.position, length, this.end, this.signal);
					this.position += length;
					return value;
				}
				const offset = this.position - this.#bufferStart;
				if (offset < 0 || offset + length > this.#buffer.length) {
					this.#buffer = await readArtifactFileBytes(this.handle, this.position, Math.min(DIRECTORY_CHUNK_BYTES, this.end - this.position), this.end, this.signal);
					this.#bufferStart = this.position;
				}
				const start = this.position - this.#bufferStart;
				this.position += length;
				return this.#buffer.subarray(start, start + length);
			}
			async uint32() {
				return (await this.bytes(4)).readUInt32LE(0);
			}
			async uint64() {
				return (await this.bytes(8)).readBigUInt64LE(0);
			}
		};
		toSafeOffset = (offset, base, end, subject) => {
			if (base > end || offset > BigInt(end - base)) throw formatFailure$4(`${subject} offset exceeds the pack`);
			return base + Number(offset);
		};
		formatFailure$4 = (detail) => new ArtifactReaderFailure("format", `Godot PCK is malformed: ${detail}`);
		metadataLimit = () => new ArtifactReaderFailure("limit", "Godot PCK directory exceeds the 64 MiB encoded metadata budget", { boundary: "memory" });
	})))();
}

//#endregion
//#region dist/artifacts/HexRecordArtifactReader.js
var hexRecordRegions, HexRecordArtifactReader;
function init_HexRecordArtifactReader() {
	return (init_HexRecordArtifactReader = __esmMin((() => {
		init_hexRecords();
		init_DecodedRegionArtifactReader();
		hexRecordRegions = (format) => ({
			label: HEX_RECORD_ENCODING_LABELS[format],
			keyPrefix: "hex-records",
			createDecoder: (fileBytes) => createHexRecordDecoder(format, fileBytes),
			describe: (image) => ({
				metadata: image.metadata,
				regions: image.regions.map((region) => ({
					path: regionFileName(region.start, region.end),
					byteOffset: null,
					formatMetadata: {
						kind: "hex-record-region",
						start_address: region.start,
						end_address: region.end,
						length: region.bytes.length,
						record_count: region.recordCount,
						first_line: region.firstLine,
						last_line: region.lastLine
					},
					bytes: region.bytes
				})),
				...image.terminated && image.limitations.length === 0 ? {} : { coverage: {
					status: image.terminated ? "complete" : "unknown",
					limitations: image.limitations
				} }
			})
		});
		HexRecordArtifactReader = class extends DecodedRegionArtifactReader {
			constructor(path, format, admitted) {
				super(path, format, hexRecordRegions(format), admitted);
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/MachOSliceArtifactReader.js
var MachOSliceArtifactReader, readStructuralSlices, lipoMatchesSlice, lipoSubtypeMatches, ARM_SUBTYPES, lipoNameMatches;
function init_MachOSliceArtifactReader() {
	return (init_MachOSliceArtifactReader = __esmMin((() => {
		init_ArtifactFileOperation();
		init_CommandRunner();
		init_lipo();
		init_machoCpuIdentity();
		init_MachoLoadCommandReader();
		init_ArtifactReader();
		init_StreamBytes();
		init_readArtifactFileChunks();
		init_ArtifactFileSource();
		init_readFileHandleRange();
		MachOSliceArtifactReader = class {
			path;
			runner;
			format = "file";
			#command;
			#source;
			#entries = new Map();
			#enumerations = new Set();
			#pendingOpens = new Set();
			#streams = new Map();
			#closed = false;
			#closePromise;
			constructor(path, environment, runner = new XcrunCommandRunner(environment), source) {
				this.path = path;
				this.runner = runner;
				this.#source = new ArtifactFileSource(path, "Universal Mach-O", source);
			}
			async *entries(signal) {
				const enumeration = this.#readEntries(signal);
				this.#enumerations.add(enumeration);
				try {
					yield* enumeration;
				} finally {
					this.#enumerations.delete(enumeration);
				}
			}
			async *#readEntries(signal) {
				this.#entries.clear();
				const source = await this.#ensureSource();
				await this.#source.readSelectedPath();
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader is closed");
				const command = this.runner.run("lipo", ["-detailed_info", this.path], signal === undefined ? {} : { signal });
				const captured = await command;
				if (!captured.ok) throw new ArtifactReaderFailure(captured.error.reason === "cancelled" ? "cancelled" : "unavailable", captured.error.detail === null ? "lipo could not enumerate universal Mach-O slices" : `lipo could not enumerate universal Mach-O slices: ${captured.error.detail}`, {
					cause: captured.error,
					...captured.error.cleanupFailure === null && captured.error.cleanupResources.length === 0 ? {} : { cleanup: {
						reason: captured.error.cleanupFailure ?? "Native command cleanup remains unverified",
						resources: [...captured.error.cleanupResources]
					} }
				});
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader closed during slice discovery");
				this.#command = {
					tool: captured.value.tool,
					arguments: ["-detailed_info", "$ARTIFACT"],
					tool_version: captured.value.toolVersion,
					executable_sha256: captured.value.executableSha256,
					exit_code: captured.value.exitCode,
					effects: ["read"]
				};
				await this.#source.readSelectedPath();
				const fileSize = source.initial.size;
				const parsed = parseLipoOutputResult(captured.value.stdout, this.path);
				if (!parsed.ok) throw new ArtifactReaderFailure(parsed.error instanceof LipoFieldRetentionError ? "limit" : "format", `lipo did not produce readable architecture records: ${parsed.error.message}`, {
					cause: parsed.error,
					...parsed.error instanceof LipoFieldRetentionError ? { boundary: "memory" } : {}
				});
				const lipo = parsed.value;
				const { architectures } = lipo;
				const structural = await readStructuralSlices(source.handle, fileSize, signal);
				await this.#source.readSelectedPath();
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader is closed");
				if (structural.status === "malformed") throw new ArtifactReaderFailure("integrity", `Mach-O structural slice index is malformed: ${structural.reason}`);
				if (structural.status === "unsupported" && architectures.some(({ file_offset, size }) => file_offset === null || size === null)) throw new ArtifactReaderFailure("unavailable", `Mach-O structural slice index is unsupported: ${structural.reason}`);
				const hiddenArchitectures = architectures.filter(({ hidden }) => hidden);
				const visibleArchitectures = architectures.filter(({ hidden }) => !hidden);
				if (lipo.hiddenArchitectureCount !== null && lipo.hiddenArchitectureCount !== hiddenArchitectures.length) throw new ArtifactReaderFailure("integrity", "lipo hidden architecture count disagrees with its architecture rows");
				if (lipo.declaredArchitectureCount !== null && lipo.declaredArchitectureCount !== visibleArchitectures.length) throw new ArtifactReaderFailure("integrity", "lipo declared architecture count disagrees with its visible rows");
				if ((hiddenArchitectures.length > 0 || (lipo.hiddenArchitectureCount ?? 0) > 0) && structural.status !== "parsed") throw new ArtifactReaderFailure("unavailable", "Apple hidden ARM64 slice could not be verified against the FAT table");
				const slices = structural.status === "parsed" ? structural.slices : null;
				const hiddenSlices = structural.status === "parsed" ? structural.hiddenSlices ?? [] : [];
				const matchingSlices = new Map();
				if (slices !== null) {
					if (slices.length !== visibleArchitectures.length || hiddenSlices.length !== hiddenArchitectures.length || hiddenArchitectures.length > 0 && (lipo.declaredArchitectureCount === null || lipo.hiddenArchitectureCount === null) || lipo.declaredArchitectureCount !== null && lipo.declaredArchitectureCount !== slices.length || lipo.hiddenArchitectureCount !== null && lipo.hiddenArchitectureCount !== hiddenSlices.length) throw new ArtifactReaderFailure("integrity", "lipo declared and hidden architecture counts disagree with the Mach-O FAT table");
					for (const [reportedRows, observedRows] of [[visibleArchitectures, slices], [hiddenArchitectures, hiddenSlices]]) {
						const unmatched = [...observedRows];
						for (const reported of reportedRows) {
							const match = unmatched.findIndex((observed) => lipoMatchesSlice(reported, observed, observedRows.length === 1));
							if (match < 0) throw new ArtifactReaderFailure("integrity", `lipo slice metadata disagrees with the Mach-O FAT table: ${reported.name} (cputype=${reported.cpu_type ?? "unknown"}, cpusubtype=${reported.cpu_subtype ?? "unknown"}, offset=${reported.file_offset ?? "unknown"}, size=${reported.size ?? "unknown"}, alignment=${reported.alignment ?? "unknown"})`);
							const [observed] = unmatched.splice(match, 1);
							if (observed !== undefined) matchingSlices.set(reported, observed);
						}
					}
				}
				for (const architecture of architectures) {
					const structuralSlice = matchingSlices.get(architecture);
					const offset = architecture.file_offset ?? structuralSlice?.slice_offset;
					const sliceSize = architecture.size ?? structuralSlice?.slice_size;
					if (offset === undefined || sliceSize === undefined) throw new ArtifactReaderFailure("integrity", "lipo omitted a universal slice byte range");
					if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(sliceSize) || offset < 0 || sliceSize <= 0 || !Number.isSafeInteger(offset + sliceSize) || offset + sliceSize > fileSize) throw new ArtifactReaderFailure("integrity", `lipo reported an out-of-bounds Mach-O slice: ${architecture.name}`);
					const entry = {
						path: `slices/${architecture.name}`,
						kind: "slice",
						declaredSize: sliceSize,
						compressedSize: null,
						executable: true,
						encrypted: false,
						byteOffset: offset,
						declaredIntegrity: null,
						unpacked: false,
						limitations: [
							...architecture.limitations,
							...structural.status === "not-mach-o" ? ["Structural Mach-O facts were unavailable; slice range is based on lipo output."] : structural.status === "unsupported" ? [`Structural Mach-O facts were unsupported (${structural.reason}); slice range is based on lipo output.`] : [],
							...architecture.file_offset === null || architecture.size === null ? [architecture.fields.offset.kind === "uninterpretable" || architecture.fields.size.kind === "uninterpretable" ? "Slice range was derived from structural Mach-O facts because lipo's range declarations could not all be interpreted." : "Slice range was derived from structural Mach-O facts because lipo omitted it."] : [],
							...architecture.cpu_type !== null && architecture.cpu_type_code === null ? [`lipo CPU type is retained as unnormalized source text: ${architecture.cpu_type}`] : [],
							...architecture.cpu_subtype !== null && architecture.cpu_subtype_code === null ? [`lipo CPU subtype is retained as unnormalized source text: ${architecture.cpu_subtype}${architecture.capabilities === null ? "" : `; capabilities ${architecture.capabilities}`}`] : []
						],
						adapterKey: `${String(offset)}:${String(sliceSize)}`
					};
					this.#entries.set(entry.adapterKey, copyArtifactEntry(entry));
					yield entry;
				}
			}
			open(entry, signal) {
				const operation = this.#open(entry, signal);
				this.#pendingOpens.add(operation);
				const release = () => this.#pendingOpens.delete(operation);
				void operation.then(release, release);
				return operation;
			}
			async #open(entry, signal) {
				if (signal?.aborted === true) return Promise.reject(new ArtifactReaderFailure("cancelled", "Mach-O slice read cancelled", { cause: signal.reason }));
				const produced = this.#entries.get(entry.adapterKey);
				if (produced === undefined || !sameArtifactEntry(entry, produced)) throw new ArtifactReaderFailure("integrity", "Mach-O slice entry metadata does not match this reader's inventory");
				const offset = produced.byteOffset;
				const size = produced.declaredSize;
				if (offset === null || size === null || !Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size <= 0) throw new ArtifactReaderFailure("integrity", "Invalid Mach-O slice byte range");
				const source = await this.#ensureSource();
				await this.#source.readSelectedPath();
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader is closed");
				if (!Number.isSafeInteger(offset + size) || offset + size > source.initial.size) throw new ArtifactReaderFailure("integrity", `Mach-O slice range is outside the artifact: ${entry.path}`);
				const sourceStream = readArtifactFileChunks(source.handle, {
					start: offset,
					end: offset + size - 1,
					...signal === undefined ? {} : { signal }
				});
				const verifySource = () => this.#source.readSelectedPath();
				let validatingSource = false;
				const completionFailure = () => {
					const coverage = sourceStream.readCoverage();
					if (coverage.kind !== "complete") return new ArtifactReaderFailure("integrity", `Mach-O slice read coverage is incomplete: ${entry.path}`);
					if (coverage.bytes !== BigInt(size)) return new ArtifactReaderFailure("integrity", `Mach-O slice size disagrees with lipo metadata: ${entry.path}`);
					if (signal?.aborted) return new ArtifactReaderFailure("cancelled", "Mach-O slice read cancelled", { cause: signal.reason });
					return undefined;
				};
				const output = Readable.from((async function* () {
					try {
						for await (const raw of sourceStream) {
							const chunk = streamChunkToBuffer(raw);
							if (sourceStream.readCoverage().kind === "complete" && signal?.aborted) {
								const failure = completionFailure();
								if (failure !== undefined) throw failure;
							}
							yield chunk;
						}
					} catch (cause) {
						if (cause instanceof ArtifactReaderFailure) throw cause;
						throw new ArtifactReaderFailure("integrity", `Could not read Mach-O slice range: ${entry.path}`, { cause });
					}
					validatingSource = true;
					const failure = completionFailure();
					if (failure !== undefined) throw failure;
					try {
						await verifySource();
						assertArtifactReadActive(signal);
					} finally {
						validatingSource = false;
					}
				})());
				output.on("error", () => undefined);
				const completion = Promise.all([sourceStream, output].map((stream) => new Promise((resolve) => stream.once("close", resolve))));
				this.#streams.set(output, {
					source: sourceStream,
					completion
				});
				void completion.then(() => this.#streams.delete(output));
				const onSourceError = (cause) => {
					const completedCancellation = cause instanceof ArtifactReaderFailure && cause.reason === "cancelled" && sourceStream.readCoverage().kind === "complete" && !validatingSource ? completionFailure() : undefined;
					output.destroy(completedCancellation ?? (cause instanceof ArtifactReaderFailure ? cause : new ArtifactReaderFailure("integrity", `Could not read Mach-O slice range: ${entry.path}`, { cause })));
				};
				sourceStream.on("error", onSourceError);
				sourceStream.once("close", () => sourceStream.removeListener("error", onSourceError));
				const onAbort = () => {
					if (sourceStream.readCoverage().kind === "complete" && (sourceStream.errored === null || sourceStream.errored instanceof ArtifactReaderFailure && sourceStream.errored.reason === "cancelled") && !validatingSource && !output.destroyed) {
						const failure = completionFailure();
						if (failure !== undefined) output.destroy(failure);
					}
				};
				signal?.addEventListener("abort", onAbort, { once: true });
				output.once("close", () => {
					signal?.removeEventListener("abort", onAbort);
					if (!sourceStream.destroyed) sourceStream.destroy();
				});
				if (signal?.aborted) onAbort();
				return output;
			}
			provenance() {
				return this.#command === undefined ? [] : [structuredClone(this.#command)];
			}
			async close() {
				this.#closed = true;
				this.#closePromise ??= this.#releaseResources().catch((cause) => {
					this.#closePromise = undefined;
					throw cause;
				});
				return this.#closePromise;
			}
			async #releaseResources() {
				for (const [output, { source }] of this.#streams) {
					output.destroy(new ArtifactReaderFailure("unavailable", "Universal Mach-O reader closed"));
					source.destroy();
				}
				const outcomes = await Promise.allSettled([
					Promise.allSettled(this.#pendingOpens),
					...Array.from(this.#enumerations, (enumeration) => enumeration.return()),
					...Array.from(this.#streams.values(), ({ completion }) => completion)
				]);
				this.#enumerations.clear();
				const failures = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
				let cleanup;
				try {
					const failures = await this.runner.retryCleanup?.() ?? [];
					if (failures.length > 0) cleanup = {
						reason: failures.map(({ reason, resources }) => `${resources.join(", ")}: ${reason}`).join("; "),
						resources: [...new Set(failures.flatMap(({ resources }) => resources))]
					};
				} catch (cause) {
					cleanup = ArtifactReaderFailure.cleanupObservation(cause, "native-command-process-cleanup");
				}
				for (const cause of failures) cleanup = {
					reason: [cleanup?.reason, ArtifactReaderFailure.cleanupObservation(cause, this.path).reason].filter((reason) => reason !== undefined).join("; "),
					resources: [...new Set([...cleanup?.resources ?? [], this.path])]
				};
				try {
					await this.#source.close();
				} catch (cause) {
					if (cleanup === undefined) throw cause;
					throw ArtifactReaderFailure.withCleanup(cause, cleanup);
				}
				if (cleanup !== undefined) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader cleanup remains incomplete", { cleanup });
			}
			async #ensureSource() {
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader is closed");
				const source = await this.#source.read();
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Universal Mach-O reader closed during source acquisition");
				return source;
			}
		};
		readStructuralSlices = async (file, size, signal) => {
			const readAt = (offset, length) => readFileHandleRange(file, offset, length, () => assertArtifactReadActive(signal));
			return readMachoImage(readAt, size);
		};
		lipoMatchesSlice = (reported, observed, structurallyUnique) => {
			const observedCpuType = observed.fat_cpu_type ?? observed.cpu_type;
			const observedCpuSubtype = observed.fat_cpu_subtype ?? observed.cpu_subtype;
			const hasPhysicalIdentity = reported.file_offset !== null || reported.size !== null || reported.cpu_type_code !== null || reported.cpu_subtype_code !== null;
			return (hasPhysicalIdentity || structurallyUnique) && lipoNameMatches(reported.name, observed) && (reported.file_offset === null || reported.file_offset === observed.slice_offset) && (reported.size === null || reported.size === observed.slice_size) && (reported.cpu_type_code === null || reported.cpu_type_code === observedCpuType) && lipoSubtypeMatches(reported, observedCpuSubtype) && (reported.alignment === null || observed.fat_alignment_exponent === null || reported.alignment === 2 ** observed.fat_alignment_exponent);
		};
		lipoSubtypeMatches = (reported, observedCpuSubtype) => {
			if (reported.cpu_subtype_code !== null) return reported.cpu_subtype_code === observedCpuSubtype;
			return reported.cpu_subtype_base === null || reported.cpu_subtype_base === machoCpuSubtypeBase(observedCpuSubtype);
		};
		ARM_SUBTYPES = {
			armv4t: 5,
			armv5: 7,
			xscale: 8,
			armv6: 6,
			armv7: 9,
			armv7f: 10,
			armv7s: 11,
			armv7k: 12,
			armv6m: 14,
			armv7m: 15,
			armv7em: 16,
			"armv8m.main": 17,
			"armv8m.base": 18,
			"armv8.1m.main": 19
		};
		lipoNameMatches = (reported, observed) => {
			if (reported === observed.architecture) return true;
			if (observed.cpu_type === 12 && observed.architecture === "arm") return ARM_SUBTYPES[reported] === machoCpuSubtypeBase(observed.fat_cpu_subtype ?? observed.cpu_subtype);
			if (reported === machoArchitectureFamily(observed.architecture)) return true;
			return machoArchitectureFamily(observed.architecture) === "arm64e" && /^arm64e\.[A-Za-z0-9_]+$/u.test(reported);
		};
	})))();
}

//#endregion
//#region dist/artifacts/NativeDmgOwnership.js
var systemEntitySchema, attachOutputSchema, infoOutputSchema, parseNativeDmgInfo, parseNativeDmgAttachOutput, resolveNativeDmgOwnership, ownershipFromAttachOutput, topLevelDevices, isBelowRoot;
function init_NativeDmgOwnership() {
	return (init_NativeDmgOwnership = __esmMin((() => {
		systemEntitySchema = z.object({
			"dev-entry": z.string().startsWith("/dev/"),
			"mount-point": z.string().optional()
		});
		attachOutputSchema = z.object({ "system-entities": z.array(systemEntitySchema) });
		infoOutputSchema = z.object({ images: z.array(z.object({
			"image-path": z.string().optional(),
			"system-entities": z.array(systemEntitySchema)
		})) });
		parseNativeDmgInfo = (stdout) => infoOutputSchema.parse(parse(stdout));
		parseNativeDmgAttachOutput = (stdout) => attachOutputSchema.parse(parse(stdout));
		resolveNativeDmgOwnership = (input) => {
			const rootedImages = input.info.images.filter((image) => image["system-entities"].some(({ "mount-point": mountPoint }) => mountPoint !== undefined && isBelowRoot(input.mountRoot, mountPoint)));
			if (rootedImages.length > 1) return {
				status: "unknown",
				reason: "multiple hdiutil image groups report mounts beneath the owned root"
			};
			const rootedImage = rootedImages[0];
			if (rootedImage !== undefined) {
				const hasOutsideMount = rootedImage["system-entities"].some(({ "mount-point": mountPoint }) => mountPoint !== undefined && !isBelowRoot(input.mountRoot, mountPoint));
				const groupDevices = rootedImage["system-entities"].map(({ "dev-entry": device }) => device);
				const devices = topLevelDevices(groupDevices);
				const overlapsBaseline = groupDevices.some((device) => input.baselineDevices.has(device));
				if (hasOutsideMount || overlapsBaseline || devices.length === 0) return {
					status: "unknown",
					reason: hasOutsideMount ? "the image group contains a mount outside the owned root" : overlapsBaseline ? "the image group includes a device present before attachment" : "the owned mount group contains no detachable device"
				};
				return {
					status: "owned",
					devices,
					source: "info"
				};
			}
			if (input.attachOutputReturned) {
				const attachOwnership = ownershipFromAttachOutput(input.attachOutput, input.mountRoot, input.baselineDevices);
				if (attachOwnership.status === "owned") {
					return attachOwnership;
				}
				if (attachOwnership.status === "unknown") return attachOwnership;
			}
			const newlyListedDevice = input.info.images.some((image) => image["system-entities"].some(({ "dev-entry": device }) => !input.baselineDevices.has(device)));
			if (newlyListedDevice) return {
				status: "unknown",
				reason: "hdiutil lists devices absent from the pre-attach baseline, but none is tied uniquely to the owned root; ownership is unknown"
			};
			return { status: "none" };
		};
		ownershipFromAttachOutput = (output, mountRoot, baselineDevices) => {
			if (output === undefined) return {
				status: "unknown",
				reason: "hdiutil attach succeeded but its ownership facts were malformed"
			};
			const entities = output["system-entities"];
			const hasRootMount = entities.some(({ "mount-point": mountPoint }) => mountPoint !== undefined && isBelowRoot(mountRoot, mountPoint));
			const hasOutsideMount = entities.some(({ "mount-point": mountPoint }) => mountPoint !== undefined && !isBelowRoot(mountRoot, mountPoint));
			const devices = entities.map(({ "dev-entry": device }) => device);
			const uniqueDevices = topLevelDevices(devices);
			const overlapsBaseline = devices.some((device) => baselineDevices.has(device));
			if (hasRootMount) {
				if (hasOutsideMount || overlapsBaseline || uniqueDevices.length === 0) return {
					status: "unknown",
					reason: hasOutsideMount ? "the attach result includes a mount outside the owned root" : overlapsBaseline ? "the attach result includes a device present before attachment" : "the attach result's owned mount has no detachable device"
				};
				return {
					status: "owned",
					devices: uniqueDevices,
					source: "attach"
				};
			}
			if (devices.length === 0) return {
				status: "unknown",
				reason: "hdiutil attach succeeded without reporting device ownership facts"
			};
			if (devices.some((device) => !baselineDevices.has(device))) return {
				status: "unknown",
				reason: "the attach result reports new devices without a mount beneath the owned root"
			};
			return { status: "none" };
		};
		topLevelDevices = (devices) => {
			const unique = [...new Set(devices)];
			return unique.filter((device) => !unique.some((parent) => /^\/dev\/disk\d+$/u.test(parent) && device.startsWith(`${parent}s`) && /^\d+$/u.test(device.slice(parent.length + 1))));
		};
		isBelowRoot = (root, path) => {
			const child = relative(root, resolve(path));
			return child !== "" && child !== "." && child !== ".." && !child.startsWith(`..${sep}`);
		};
	})))();
}

//#endregion
//#region dist/artifacts/NativeDmgArtifactReader.js
var HDIUTIL_COMMAND_TIMEOUT_MS, DMG_EXISTING_ATTACHMENT_RECOVERY, DMG_CHECKSUM_ABSENT_LIMITATION, VERIFY_TRANSIENT_DELAY_MS, VERIFY_UNKNOWN_SETTLE_DELAYS_MS, DETACH_SETTLE_DELAYS_MS, delay, NativeDmgCommandFailure, createSystemHost, NativeDmgArtifactReader, existingImagePathListed, failureMessage, processNotStarted, runChecked, describeCommandFailure, processExitCode, processOutput, classifyCommandFailure, classifyVerifyFailure, verifyFailureReason, verifyFailureDiagnostic, INVALID_CHECKSUM_LINE, NO_CHECKSUM_LINE, UNRECOGNIZED_IMAGE_LINE, untranslatedVerifyFailure, outputLines, command;
function init_NativeDmgArtifactReader() {
	return (init_NativeDmgArtifactReader = __esmMin((() => {
		init_OwnedRegularFile();
		init_ArtifactReader();
		init_DirectoryArtifactReader();
		init_RegularFile();
		init_OwnedFileHandle();
		init_ExecFileOutput();
		init_NativeDmgOwnership();
		HDIUTIL_COMMAND_TIMEOUT_MS = 12e4;
		DMG_EXISTING_ATTACHMENT_RECOVERY = "hdiutil refused a private read-only DMG attachment after listing an existing attachment of this image path. If it is still attached, ask its owner to release it when safe, then retry. REA does not borrow or detach existing attachments.";
		DMG_CHECKSUM_ABSENT_LIMITATION = "hdiutil verify found no stored checksum in this disk image, so its integrity was not verified; the root SHA-256 identifies the inventoried bytes.";
		VERIFY_TRANSIENT_DELAY_MS = 250;
		VERIFY_UNKNOWN_SETTLE_DELAYS_MS = [250, 500];
		DETACH_SETTLE_DELAYS_MS = [
			250,
			500,
			1e3
		];
		delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
		NativeDmgCommandFailure = class extends ArtifactReaderFailure {
			stdout;
			processNotStarted;
			verifyDiagnostic;
			unrecognizedImage;
			checksumAbsent;
			exitCode;
			constructor(failure, message, stdout, options) {
				super(failure.reason, message, options === undefined ? undefined : {
					...options.cause === undefined ? {} : { cause: options.cause },
					...options.cancellation === undefined ? {} : { cancellation: options.cancellation }
				});
				this.stdout = stdout;
				this.processNotStarted = options?.processNotStarted ?? false;
				this.verifyDiagnostic = failure.verifyDiagnostic;
				this.unrecognizedImage = failure.unrecognizedImage ?? false;
				this.checksumAbsent = failure.checksumAbsent ?? false;
				this.exitCode = options?.exitCode ?? null;
			}
		};
		createSystemHost = (environment) => ({
			delay,
			async run(arguments_, signal, options) {
				try {
					const { stdout, stderr } = await execFileOutput("/usr/bin/hdiutil", [...arguments_], {
						env: environment,
						stopSignal: "SIGTERM",
						...options === undefined ? {} : { timeout: options.timeoutMs },
						...signal === undefined ? {} : { signal }
					});
					return {
						stdout,
						stderr,
						exitCode: 0
					};
				} catch (cause) {
					const output = execFileOutputFailure(cause);
					if (cause instanceof ExecFileOutputCancelledError) throw new NativeDmgCommandFailure({ reason: "cancelled" }, "DMG operation cancelled", output?.stdout ?? "", {
						cause,
						cancellation: { reason: cause.cause }
					});
					const exitCode = typeof output?.code === "number" ? output.code : processExitCode(cause);
					if (exitCode !== undefined) return {
						stdout: output?.stdout ?? processOutput(cause, "stdout"),
						stderr: output?.stderr ?? processOutput(cause, "stderr"),
						exitCode,
						cause
					};
					throw new NativeDmgCommandFailure(classifyCommandFailure(cause, arguments_[0]), `hdiutil ${arguments_[0] ?? "operation"} failed: ${describeCommandFailure(cause, arguments_)}`, output?.stdout ?? "", {
						cause,
						processNotStarted: processNotStarted(cause)
					});
				}
			}
		});
		NativeDmgArtifactReader = class {
			path;
			format = "file";
			host;
			#provenance = [];
			#initialization;
			#directory;
			#devices = [];
			#inventoryConfirmedDevices = new Set();
			#mountRoot;
			#baselineDevices = new Set();
			#attachOutput;
			#attachOutputReturned = false;
			#attachMayHaveMounted = false;
			#ownershipUncertainty;
			#closed = false;
			#closePromise;
			#activeDirectoryOperations = new Set();
			#verificationProbeHandle;
			#checksumAbsent = false;
			constructor(path, environment, host) {
				this.path = path;
				if (process.platform !== "darwin" && host === undefined) throw new ArtifactReaderFailure("unavailable", "Native DMG traversal is available only on macOS");
				this.host = host ?? createSystemHost(environment);
			}
			async *entries(signal, options) {
				await this.#ensureAttached(signal);
				const directory = this.#directory;
				if (directory === undefined) throw new ArtifactReaderFailure("unavailable", "DMG is not attached");
				if (this.#checksumAbsent) options?.onCoverage?.({
					status: "complete",
					limitations: [DMG_CHECKSUM_ABSENT_LIMITATION]
				});
				const prefix = basename(this.path);
				const entries = directory.entries(signal, {
					onCoverage: (coverage) => options?.onCoverage?.(coverage),
					onOmission: (omission) => options?.onOmission?.({
						...omission,
						path: `${prefix}/${omission.path}`
					})
				})[Symbol.asyncIterator]();
				try {
					for (;;) {
						if (this.#closed) return;
						const next = await this.#trackDirectoryOperation(() => entries.next());
						if (this.#closed) return;
						if (next.done) return;
						yield {
							...next.value,
							path: `${prefix}/${next.value.path}`
						};
					}
				} finally {
					await entries.return?.();
				}
			}
			async open(entry, signal) {
				await this.#ensureAttached(signal);
				const directory = this.#directory;
				if (directory === undefined) throw new ArtifactReaderFailure("unavailable", "DMG is not attached");
				return this.#trackDirectoryOperation(() => directory.open(entry, signal));
			}
			provenance() {
				return structuredClone(this.#provenance);
			}
			close() {
				this.#closed = true;
				this.#closePromise ??= this.#closeOwnedResources().catch((cause) => {
					this.#closePromise = undefined;
					throw cause;
				});
				return this.#closePromise;
			}
			async #closeOwnedResources() {
				await this.#initialization?.catch(() => undefined);
				await Promise.allSettled(this.#activeDirectoryOperations);
				await this.#closeVerificationProbeHandle();
				await this.#closeMountedDirectory();
				let detachFailure = await this.#detachOwnedDevices();
				if (this.#devices.length === 0 && this.#mountRoot !== undefined && !this.#attachMayHaveMounted) await rm(this.#mountRoot, {
					recursive: true,
					force: true
				}).then(() => {
					this.#mountRoot = undefined;
					this.#directory = undefined;
				}, (cause) => {
					detachFailure ??= cause;
				});
				if (this.#attachMayHaveMounted) {
					detachFailure ??= new Error(this.#ownershipUncertainty ?? "hdiutil attachment ownership remains unknown");
				}
				if (detachFailure !== undefined) throw new ArtifactReaderFailure("unavailable", `DMG detach or mount-root cleanup failed for ${JSON.stringify(this.path)}: ${failureMessage(detachFailure)}`, {
					cause: detachFailure,
					cleanup: {
						reason: failureMessage(detachFailure),
						resources: [
							...this.#devices.map((device) => `DMG device ${device}`),
							...this.#attachMayHaveMounted ? [`DMG attachment ownership unknown at mount root ${this.#mountRoot ?? this.path}`] : [],
							...this.#mountRoot === undefined ? [] : [`DMG mount root ${this.#mountRoot}`]
						]
					}
				});
			}
			async #closeVerificationProbeHandle() {
				const owner = this.#verificationProbeHandle;
				if (owner === undefined) return;
				try {
					await owner.close();
					this.#verificationProbeHandle = undefined;
				} catch (cause) {
					throw ArtifactReaderFailure.withCleanup(cause, ArtifactReaderFailure.cleanupObservation(cause, `DMG verification target descriptor ${this.path}`));
				}
			}
			async #detachOwnedDevices() {
				let detachFailure = await this.#reconcileAttachState();
				let remainingDevices = [];
				for (const device of [...this.#devices].reverse()) {
					const failure = await this.#detach(device);
					if (failure !== undefined) {
						remainingDevices.push(device);
						detachFailure ??= failure;
					}
				}
				for (const delayMs of DETACH_SETTLE_DELAYS_MS) {
					if (remainingDevices.length === 0) break;
					await (this.host.delay ?? delay)(delayMs);
					const stillAttached = [];
					for (const device of remainingDevices) {
						if (!await this.#isAttached(device)) continue;
						const failure = await this.#detach(device);
						if (failure !== undefined) {
							stillAttached.push(device);
							detachFailure = failure;
						}
					}
					remainingDevices = stillAttached;
				}
				if (remainingDevices.length === 0) detachFailure = undefined;
				this.#devices = remainingDevices.reverse();
				return detachFailure;
			}
			async #closeMountedDirectory() {
				if (this.#directory !== undefined) {
					try {
						await this.#directory.close();
						this.#directory = undefined;
					} catch (cause) {
						const mountRoot = this.#mountRoot ?? this.path;
						throw ArtifactReaderFailure.withCleanup(cause, {
							reason: `DMG mounted directory remains owned: ${failureMessage(cause)}`,
							resources: [
								`DMG mounted directory at ${mountRoot}`,
								`DMG mount root ${mountRoot}`,
								...this.#devices.map((device) => `DMG device ${device}`)
							]
						});
					}
				}
			}
			/** Detach one device; return the failure only while it remains attached. */
			async #detach(device) {
				try {
					await runChecked(this.host, ["detach", device], undefined, { timeoutMs: HDIUTIL_COMMAND_TIMEOUT_MS });
					this.#provenance.push(command(["detach", device], ["mount"]));
					return undefined;
				} catch (cause) {
					return await this.#isAttached(device) ? cause : undefined;
				}
			}
			async #reconcileAttachState() {
				if (!this.#attachMayHaveMounted) return undefined;
				try {
					await this.#resolveAttachOwnership();
					return undefined;
				} catch (cause) {
					this.#ownershipUncertainty = failureMessage(cause);
					return cause;
				}
			}
			/** Treat unknown hdiutil state as attached during cleanup. */
			async #isAttached(device) {
				try {
					const parsed = await this.#readInfo();
					const isListed = parsed.images.some((image) => image["system-entities"].some((entity) => entity["dev-entry"] === device));
					if (isListed) {
						this.#inventoryConfirmedDevices.add(device);
						return true;
					}
					return !this.#inventoryConfirmedDevices.has(device);
				} catch {
					return true;
				}
			}
			async #ensureAttached(signal) {
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "DMG reader is closed");
				this.#initialization ??= this.#attach(signal);
				await this.#initialization;
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "DMG reader is closed");
			}
			async #trackDirectoryOperation(operation) {
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "DMG reader is closed");
				const running = Promise.resolve().then(operation);
				this.#activeDirectoryOperations.add(running);
				try {
					return await running;
				} finally {
					this.#activeDirectoryOperations.delete(running);
				}
			}
			async #attach(signal) {
				await this.#verify(signal);
				const baseline = await this.#readInfo();
				this.#baselineDevices = new Set(baseline.images.flatMap((image) => image["system-entities"].map(({ "dev-entry": device }) => device)));
				const mountRoot = await realpath(await mkdtemp(join(tmpdir(), "rea-dmg-")));
				this.#mountRoot = mountRoot;
				const arguments_ = [
					"attach",
					"-readonly",
					"-nobrowse",
					"-plist",
					"-mountroot",
					mountRoot,
					this.path
				];
				try {
					this.#attachMayHaveMounted = true;
					const attached = await runChecked(this.host, arguments_, signal, { timeoutMs: HDIUTIL_COMMAND_TIMEOUT_MS });
					this.#provenance.push(command(arguments_, ["read", "mount"]));
					this.#attachOutputReturned = true;
					let parsed;
					try {
						parsed = parseNativeDmgAttachOutput(attached.stdout);
					} catch (cause) {
						throw new ArtifactReaderFailure("format", "hdiutil returned a malformed attachment plist", { cause });
					}
					if (parsed["system-entities"].length === 0) throw new ArtifactReaderFailure("format", "hdiutil returned no attached devices");
					this.#attachOutput = parsed;
					const ownership = await this.#resolveAttachOwnership();
					if (ownership !== "owned") throw new ArtifactReaderFailure(ownership === "unknown" ? "unavailable" : "path", ownership === "unknown" ? `DMG attachment ownership is uncertain: ${this.#ownershipUncertainty ?? "no unique mount under the owned root"}` : "hdiutil did not mount a new image beneath the owned root");
					this.#directory = new DirectoryArtifactReader(mountRoot);
				} catch (cause) {
					if (cause instanceof NativeDmgCommandFailure) this.#provenance.push(command(arguments_, ["read", "mount"], cause.exitCode));
					if (cause instanceof NativeDmgCommandFailure && cause.stdout !== "") {
						try {
							this.#attachOutput = parseNativeDmgAttachOutput(cause.stdout);
							this.#attachOutputReturned = true;
						} catch {}
					}
					if (cause instanceof NativeDmgCommandFailure && cause.processNotStarted) {
						this.#attachMayHaveMounted = false;
						this.#ownershipUncertainty = undefined;
					}
					if (cause instanceof NativeDmgCommandFailure && cause.reason === "unavailable" && cause.exitCode !== null && await existingImagePathListed(this.path, baseline)) throw new ArtifactReaderFailure("unavailable", cause.message, {
						cause,
						userMessage: DMG_EXISTING_ATTACHMENT_RECOVERY
					});
					throw cause;
				}
			}
			async #verify(signal) {
				const arguments_ = ["verify", this.path];
				const deadline = performance.now() + HDIUTIL_COMMAND_TIMEOUT_MS;
				for (let attempt = 0;; attempt += 1) {
					this.#throwIfVerificationCancelled(signal);
					try {
						await runChecked(this.host, arguments_, signal, { timeoutMs: Math.max(1, Math.ceil(deadline - performance.now())) });
						this.#provenance.push(command(arguments_, ["read"]));
						return;
					} catch (cause) {
						if (!(cause instanceof NativeDmgCommandFailure)) throw cause;
						this.#provenance.push(command(arguments_, ["read"], cause.exitCode));
						if (cause.checksumAbsent) {
							this.#checksumAbsent = true;
							return;
						}
						if (cause.unrecognizedImage) {
							const unreadable = await this.#isUnreadableTarget(signal, cause);
							this.#throwIfVerificationCancelled(signal);
							if (unreadable) throw new NativeDmgCommandFailure({ reason: "io" }, cause.message, cause.stdout, {
								cause: cause.cause,
								...cause.exitCode === null ? {} : { exitCode: cause.exitCode }
							});
						}
						const delayMs = cause.verifyDiagnostic === "Resource temporarily unavailable" ? VERIFY_TRANSIENT_DELAY_MS : VERIFY_UNKNOWN_SETTLE_DELAYS_MS[attempt];
						if (cause.verifyDiagnostic !== "Resource temporarily unavailable" && !cause.unrecognizedImage || delayMs === undefined || deadline - performance.now() <= delayMs) throw cause;
						await (this.host.delay ?? delay)(delayMs);
						if (performance.now() >= deadline) throw cause;
					}
				}
			}
			async #readInfo() {
				const info = await runChecked(this.host, ["info", "-plist"], undefined, { timeoutMs: HDIUTIL_COMMAND_TIMEOUT_MS });
				try {
					return parseNativeDmgInfo(info.stdout);
				} catch (cause) {
					throw new ArtifactReaderFailure("format", "hdiutil info -plist returned malformed image inventory", { cause });
				}
			}
			async #resolveAttachOwnership() {
				const mountRoot = this.#mountRoot;
				if (mountRoot === undefined) throw new Error("DMG mount root is unavailable for ownership discovery");
				const ownership = resolveNativeDmgOwnership({
					info: await this.#readInfo(),
					...this.#attachOutput === undefined ? {} : { attachOutput: this.#attachOutput },
					attachOutputReturned: this.#attachOutputReturned,
					mountRoot,
					baselineDevices: this.#baselineDevices
				});
				if (ownership.status === "owned") {
					this.#devices = [...ownership.devices];
					if (ownership.source === "info") for (const device of ownership.devices) this.#inventoryConfirmedDevices.add(device);
					this.#attachMayHaveMounted = false;
					this.#ownershipUncertainty = undefined;
					return "owned";
				}
				if (ownership.status === "unknown") {
					this.#ownershipUncertainty = ownership.reason;
					return "unknown";
				}
				this.#attachMayHaveMounted = false;
				this.#ownershipUncertainty = undefined;
				this.#devices = [];
				return "none";
			}
			#cancelledVerification(cause) {
				return new NativeDmgCommandFailure({ reason: "cancelled" }, "DMG operation cancelled", "", { cause });
			}
			#throwIfVerificationCancelled(signal) {
				if (signal?.aborted === true) throw this.#cancelledVerification(signal.reason);
			}
			async #isUnreadableTarget(signal, primaryFailure) {
				let handle;
				try {
					({handle} = await openRegularFile(this.path, {
						symlinks: "follow",
						...signal === undefined ? {} : { signal }
					}));
				} catch (cause) {
					if (cause instanceof RegularFileAdmissionFailure) {
						this.#verificationProbeHandle = cause.owner;
						const cancellation = regularFileCancellation(cause.cause);
						const failure = cancellation === undefined ? primaryFailure : this.#cancelledVerification(cancellation.reason);
						throw ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cause.cleanupCause, `DMG verification target descriptor ${this.path}`));
					}
					const cancellation = regularFileCancellation(cause);
					if (cancellation !== undefined) throw this.#cancelledVerification(cancellation.reason);
					if (cause instanceof NonRegularFileReadError) return false;
					return classifyCommandFailure(cause, undefined).reason === "io";
				}
				const owner = new OwnedFileHandle(handle);
				this.#verificationProbeHandle = owner;
				try {
					await owner.close();
					this.#verificationProbeHandle = undefined;
				} catch (cause) {
					throw ArtifactReaderFailure.withCleanup(signal?.aborted === true ? this.#cancelledVerification(signal.reason) : primaryFailure, ArtifactReaderFailure.cleanupObservation(cause, `DMG verification target descriptor ${this.path}`));
				}
				if (signal?.aborted === true) throw this.#cancelledVerification(signal.reason);
				return false;
			}
		};
		existingImagePathListed = async (path, info) => {
			let target;
			try {
				target = await realpath(path);
			} catch {
				return false;
			}
			for (const image of info.images) {
				if (image["image-path"] === undefined || image["system-entities"].length === 0) continue;
				try {
					if (await realpath(image["image-path"]) === target) return true;
				} catch {}
			}
			return false;
		};
		failureMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
		processNotStarted = (cause) => {
			if (!(cause instanceof Error)) return false;
			const syscall = Reflect.get(cause, "syscall");
			const code = Reflect.get(cause, "code");
			const errno = Reflect.get(cause, "errno");
			return typeof syscall === "string" && syscall.startsWith("spawn ") && (typeof code === "string" || typeof code === "number" || typeof errno === "number");
		};
		runChecked = async (host, arguments_, signal, options) => {
			let result;
			try {
				result = await host.run(arguments_, signal, options);
			} catch (cause) {
				if (cause instanceof ArtifactReaderFailure) throw cause;
				if (cause instanceof ExecFileOutputCancelledError) throw new NativeDmgCommandFailure({ reason: "cancelled" }, "DMG operation cancelled", execFileOutputFailure(cause)?.stdout ?? "", {
					cause,
					cancellation: { reason: cause.cause }
				});
				const output = execFileOutputFailure(cause);
				throw new NativeDmgCommandFailure(classifyCommandFailure(cause, arguments_[0]), `hdiutil ${arguments_[0] ?? "operation"} failed: ${describeCommandFailure(cause, arguments_)}`, output?.stdout ?? "", {
					cause,
					processNotStarted: processNotStarted(cause)
				});
			}
			if (result.exitCode !== 0) {
				const failure = {
					command: "/usr/bin/hdiutil",
					exitCode: result.exitCode,
					...result.cause === undefined ? {} : { code: processExitCode(result.cause) },
					stdout: result.stdout,
					...result.stderr === undefined ? {} : { stderr: result.stderr }
				};
				const classification = classifyCommandFailure(failure, arguments_[0]);
				const details = describeCommandFailure(failure, arguments_);
				const unknownVerifyFailure = arguments_[0] === "verify" && classification.reason === "unavailable";
				throw new NativeDmgCommandFailure(classification, unknownVerifyFailure ? `hdiutil verify failed; captured diagnostics do not establish the failure cause: ${details}` : `hdiutil ${arguments_[0] ?? "operation"} failed: ${details}`, result.stdout, {
					cause: result.cause ?? failure,
					exitCode: result.exitCode
				});
			}
			return {
				stdout: result.stdout,
				exitCode: 0
			};
		};
		describeCommandFailure = (cause, arguments_) => {
			const fields = {
				command: "/usr/bin/hdiutil",
				arguments: [...arguments_]
			};
			if (typeof cause === "object" && cause !== null) {
				for (const key of [
					"code",
					"exitCode",
					"errno",
					"syscall",
					"signal",
					"stdout",
					"stderr"
				]) {
					const value = Reflect.get(cause, key);
					if (typeof value === "string" || typeof value === "number") fields[key] = value;
				}
				const code = Reflect.get(cause, "code");
				if (typeof code === "number") fields.exitCode = code;
			}
			if (cause instanceof ArtifactReaderFailure) fields.message = cause.message;
			else if (cause instanceof Error) fields.message = cause.message;
			return JSON.stringify(fields);
		};
		processExitCode = (cause) => {
			if (typeof cause !== "object" || cause === null) return undefined;
			const exitCode = Reflect.get(cause, "exitCode");
			if (typeof exitCode === "number") return exitCode;
			const code = Reflect.get(cause, "code");
			return typeof code === "number" ? code : undefined;
		};
		processOutput = (cause, field) => {
			if (typeof cause !== "object" || cause === null) return "";
			const value = Reflect.get(cause, field);
			return typeof value === "string" ? value : "";
		};
		classifyCommandFailure = (cause, operation) => {
			if (typeof cause !== "object" || cause === null) return { reason: "unavailable" };
			const code = Reflect.get(cause, "code");
			const exitCode = Reflect.get(cause, "exitCode");
			if (typeof code === "number" || typeof exitCode === "number") {
				if (operation !== "verify") return { reason: "unavailable" };
				return classifyVerifyFailure(processOutput(cause, "stdout"), processOutput(cause, "stderr"));
			}
			if (code === "ENOENT") {
				const syscall = Reflect.get(cause, "syscall");
				return { reason: typeof syscall === "string" && syscall.startsWith("spawn") ? "unavailable" : "io" };
			}
			if (code === "EACCES" || code === "EPERM" || code === "EIO" || code === "ENOTDIR" || code === "EISDIR" || code === "ENODEV" || code === "EROFS" || code === "EMFILE" || code === "ENFILE") return { reason: "io" };
			return { reason: "unavailable" };
		};
		classifyVerifyFailure = (stdout, stderr) => {
			const diagnostic = verifyFailureDiagnostic(stdout, stderr);
			const reason = verifyFailureReason(diagnostic);
			const untranslated = reason === undefined ? untranslatedVerifyFailure(stdout, stderr) : undefined;
			return {
				...untranslated,
				reason: reason ?? untranslated?.reason ?? "unavailable",
				...diagnostic === undefined ? {} : { verifyDiagnostic: diagnostic }
			};
		};
		verifyFailureReason = (diagnostic) => {
			switch (diagnostic) {
				case "image not recognized":
				case "image not recognised": return "format";
				case "invalid checksum":
				case "image data corrupted": return "integrity";
				case "No such file or directory":
				case "Permission denied":
				case "Input/output error": return "io";
				case "Resource temporarily unavailable": return "unavailable";
				default: return undefined;
			}
		};
		verifyFailureDiagnostic = (stdout, stderr) => {
			const prefix = "hdiutil: verify failed - ";
			return outputLines(stdout, stderr).find((line) => line.startsWith(prefix))?.slice(prefix.length);
		};
		INVALID_CHECKSUM_LINE = /^hdiutil: verify: checksum of ".*" is INVALID$/u;
		NO_CHECKSUM_LINE = /^hdiutil: verify: ".*" has no checksum\.$/u;
		UNRECOGNIZED_IMAGE_LINE = /^hdiutil: verify: unable to recognize ".*" as a disk image\./u;
		untranslatedVerifyFailure = (stdout, stderr) => {
			const lines = outputLines(stdout, stderr);
			if (lines.some((line) => INVALID_CHECKSUM_LINE.test(line))) return { reason: "integrity" };
			if (lines.some((line) => NO_CHECKSUM_LINE.test(line))) return {
				reason: "unavailable",
				checksumAbsent: true
			};
			if (lines.some((line) => UNRECOGNIZED_IMAGE_LINE.test(line))) return {
				reason: "unavailable",
				unrecognizedImage: true
			};
			return undefined;
		};
		outputLines = (stdout, stderr) => `${stdout}\n${stderr}`.split(/\r?\n/u).map((line) => line.trim());
		command = (arguments_, effects, exitCode = 0) => ({
			tool: "/usr/bin/hdiutil",
			arguments: [...arguments_],
			tool_version: null,
			executable_sha256: null,
			exit_code: exitCode,
			effects
		});
	})))();
}

//#endregion
//#region dist/artifacts/nodeSea/NodeSeaBlob.js
var NODE_SEA_MAGIC, NODE_SEA_MAX_BLOB_BYTES, FLAG_DISABLE_EXPERIMENTAL_SEA_WARNING, FLAG_USE_SNAPSHOT, FLAG_USE_CODE_CACHE, FLAG_INCLUDE_ASSETS, FLAG_INCLUDE_EXEC_ARGV, KNOWN_FLAGS, MAX_ASSET_COUNT, MAX_ASSET_NAME_BYTES, MAX_EXEC_ARGV, MAX_EXEC_ARGV_TEXT_BYTES, NO_OVERRIDE, NODE_SEA_BAD_MAGIC, NODE_SEA_TRUNCATED, NODE_SEA_UNKNOWN_FLAGS, NODE_SEA_UNKNOWN_EXTENSION, NODE_SEA_TRAILING_BYTES, NODE_SEA_DUPLICATE_BLOB, NODE_SEA_ELF_DESCRIPTOR_TRUNCATED, NODE_SEA_ELF_TABLE_TRUNCATED, NODE_SEA_ELF_NOTES_REPEATED, NODE_SEA_MACHO_COMMANDS_TRUNCATED, NODE_SEA_MACHO_SEGMENT_TRUNCATED, NODE_SEA_FUSE_ABSENT, NODE_SEA_FUSE_UNSET, NODE_SEA_FUSE_CONFLICT, NODE_SEA_EMPTY_CODE_PATH, NODE_SEA_INVALID_UTF8, NODE_SEA_ASSET_COUNT, NODE_SEA_ASSET_NAME_BYTES, NODE_SEA_EXEC_ARGV_COUNT, NODE_SEA_EXEC_ARGV_TEXT, NODE_SEA_BLOB_TOO_LARGE, nodeSeaAssetCollision, FUSE_PREFIX, limitFailure$1, formatFailure$3, decodeNodeSeaBlob, observeNodeSeaFuseMatches, extensionName, BlobCursor;
function init_NodeSeaBlob() {
	return (init_NodeSeaBlob = __esmMin((() => {
		init_ArtifactFileOperation();
		init_ArtifactReader();
		NODE_SEA_MAGIC = 21223968;
		NODE_SEA_MAX_BLOB_BYTES = 256 * 1024 * 1024;
		FLAG_DISABLE_EXPERIMENTAL_SEA_WARNING = 1 << 0;
		FLAG_USE_SNAPSHOT = 1 << 1;
		FLAG_USE_CODE_CACHE = 1 << 2;
		FLAG_INCLUDE_ASSETS = 1 << 3;
		FLAG_INCLUDE_EXEC_ARGV = 1 << 4;
		KNOWN_FLAGS = FLAG_DISABLE_EXPERIMENTAL_SEA_WARNING | FLAG_USE_SNAPSHOT | FLAG_USE_CODE_CACHE | FLAG_INCLUDE_ASSETS | FLAG_INCLUDE_EXEC_ARGV;
		MAX_ASSET_COUNT = 1e5;
		MAX_ASSET_NAME_BYTES = 8 * 1024 * 1024;
		MAX_EXEC_ARGV = 4096;
		MAX_EXEC_ARGV_TEXT_BYTES = 1024 * 1024;
		NO_OVERRIDE = "This release has no runtime override.";
		NODE_SEA_BAD_MAGIC = "Node SEA blob magic is not 0x143da20";
		NODE_SEA_TRUNCATED = "Node SEA blob is truncated";
		NODE_SEA_UNKNOWN_FLAGS = "Node SEA blob flags contain unknown bits";
		NODE_SEA_UNKNOWN_EXTENSION = "Node SEA exec argv extension is unknown";
		NODE_SEA_TRAILING_BYTES = "Node SEA blob has trailing bytes";
		NODE_SEA_DUPLICATE_BLOB = "Node SEA blob is declared more than once";
		NODE_SEA_ELF_DESCRIPTOR_TRUNCATED = "Node SEA ELF note descriptor is truncated";
		NODE_SEA_ELF_TABLE_TRUNCATED = "Node SEA ELF note table is truncated";
		NODE_SEA_ELF_NOTES_REPEATED = "Node SEA ELF note tables declare more notes than the file holds";
		NODE_SEA_MACHO_COMMANDS_TRUNCATED = "Node SEA Mach-O load commands are truncated";
		NODE_SEA_MACHO_SEGMENT_TRUNCATED = "Node SEA Mach-O segment table is truncated";
		NODE_SEA_FUSE_ABSENT = "Node SEA blob is present but no NODE_SEA_FUSE sentinel was observed";
		NODE_SEA_FUSE_UNSET = "Node SEA blob is present but the NODE_SEA_FUSE sentinel is unset";
		NODE_SEA_FUSE_CONFLICT = "Node SEA fuse sentinels disagree";
		NODE_SEA_EMPTY_CODE_PATH = "Node SEA code path is empty";
		NODE_SEA_INVALID_UTF8 = "Node SEA string is not valid UTF-8";
		NODE_SEA_ASSET_COUNT = `Node SEA asset count exceeds the ${String(MAX_ASSET_COUNT)}-asset bound. ${NO_OVERRIDE}`;
		NODE_SEA_ASSET_NAME_BYTES = `Node SEA asset names exceed the ${String(MAX_ASSET_NAME_BYTES)}-byte name budget. ${NO_OVERRIDE}`;
		NODE_SEA_EXEC_ARGV_COUNT = `Node SEA exec argv count exceeds the ${String(MAX_EXEC_ARGV)}-argument bound. ${NO_OVERRIDE}`;
		NODE_SEA_EXEC_ARGV_TEXT = `Node SEA exec argv text exceeds the ${String(MAX_EXEC_ARGV_TEXT_BYTES)}-byte bound. ${NO_OVERRIDE}`;
		NODE_SEA_BLOB_TOO_LARGE = `Node SEA blob exceeds the ${String(NODE_SEA_MAX_BLOB_BYTES)}-byte in-memory bound`;
		nodeSeaAssetCollision = (name) => `Node SEA asset name collides: ${name}`;
		FUSE_PREFIX = "NODE_SEA_FUSE_";
		limitFailure$1 = (message, boundary) => new ArtifactReaderFailure("limit", message, { boundary });
		formatFailure$3 = (message, cause) => new ArtifactReaderFailure("format", message, cause === undefined ? undefined : { cause });
		decodeNodeSeaBlob = async (bytes, signal) => {
			assertArtifactReadActive(signal);
			const cursor = new BlobCursor(bytes);
			if (cursor.remaining < 4) throw formatFailure$3(NODE_SEA_TRUNCATED);
			const magic = cursor.u32();
			if (magic !== 21223968) throw formatFailure$3(NODE_SEA_BAD_MAGIC);
			if (cursor.remaining < 5) throw formatFailure$3(NODE_SEA_TRUNCATED);
			const flags = cursor.u32();
			if ((flags & ~KNOWN_FLAGS) !== 0) throw formatFailure$3(NODE_SEA_UNKNOWN_FLAGS);
			const execArgvExtension = extensionName(cursor.u8());
			const codePath = cursor.text(false, NODE_SEA_EMPTY_CODE_PATH);
			const useSnapshot = (flags & FLAG_USE_SNAPSHOT) !== 0;
			const body = cursor.byteRange();
			const useCodeCache = (flags & FLAG_USE_CODE_CACHE) !== 0;
			const codeCache = useCodeCache ? cursor.byteRange() : null;
			const includeAssets = (flags & FLAG_INCLUDE_ASSETS) !== 0;
			const assets = includeAssets ? await cursor.assets(signal) : [];
			const includeExecArgv = (flags & FLAG_INCLUDE_EXEC_ARGV) !== 0;
			const execArgv = includeExecArgv ? await cursor.execArgv(signal) : [];
			if (await cursor.hasNonZeroTail(signal)) throw formatFailure$3(NODE_SEA_TRAILING_BYTES);
			return {
				magic: NODE_SEA_MAGIC,
				flags,
				disableExperimentalSeaWarning: (flags & FLAG_DISABLE_EXPERIMENTAL_SEA_WARNING) !== 0,
				useSnapshot,
				useCodeCache,
				includeAssets,
				includeExecArgv,
				execArgvExtension,
				codePath,
				mainScript: useSnapshot ? null : body,
				snapshot: useSnapshot ? body : null,
				codeCache,
				assets,
				execArgv
			};
		};
		observeNodeSeaFuseMatches = (matches) => {
			const unique = [...new Set(matches)];
			if (unique.length === 0) return {
				fuseState: "absent",
				fuseSentinel: null,
				fuseContradiction: NODE_SEA_FUSE_ABSENT
			};
			const hashes = new Set(unique.map((item) => item.slice(FUSE_PREFIX.length, FUSE_PREFIX.length + 32)));
			const digits = new Set(unique.map((item) => item.at(-1)));
			if (hashes.size !== 1 || digits.size !== 1) return {
				fuseState: "conflicting",
				fuseSentinel: null,
				fuseContradiction: NODE_SEA_FUSE_CONFLICT
			};
			const sentinel = unique[0];
			if (sentinel === undefined) throw formatFailure$3(NODE_SEA_FUSE_CONFLICT);
			if (digits.has("1")) return {
				fuseState: "set",
				fuseSentinel: sentinel,
				fuseContradiction: null
			};
			return {
				fuseState: "unset",
				fuseSentinel: sentinel,
				fuseContradiction: NODE_SEA_FUSE_UNSET
			};
		};
		extensionName = (value) => {
			if (value === 0) return "none";
			if (value === 1) return "env";
			if (value === 2) return "cli";
			throw formatFailure$3(NODE_SEA_UNKNOWN_EXTENSION);
		};
		BlobCursor = class {
			bytes;
			#offset = 0;
			constructor(bytes) {
				this.bytes = bytes;
			}
			get remaining() {
				return this.bytes.length - this.#offset;
			}
			u32() {
				return this.#demand(4).readUInt32LE(0);
			}
			u8() {
				return this.#demand(1).readUInt8(0);
			}
			/** `charge` sees the raw byte length before decoding allocates a string. */
			text(allowEmpty, emptyMessage, charge) {
				const length = this.#size();
				charge?.(length);
				const raw = this.#demand(length);
				let text;
				try {
					text = new TextDecoder("utf-8", {
						fatal: true,
						ignoreBOM: true
					}).decode(raw);
				} catch (cause) {
					throw formatFailure$3(NODE_SEA_INVALID_UTF8, cause);
				}
				if (!allowEmpty && text.length === 0) throw formatFailure$3(emptyMessage);
				return text;
			}
			byteRange() {
				const length = this.#size();
				const offset = this.#offset;
				this.#offset += length;
				return {
					offset,
					length
				};
			}
			async assets(signal) {
				const count = this.#count(MAX_ASSET_COUNT, NODE_SEA_ASSET_COUNT);
				if (count * 16 > this.remaining) throw formatFailure$3(NODE_SEA_TRUNCATED);
				const seen = new Set();
				const assets = [];
				let nameBytes = 0;
				const charge = (bytes) => {
					nameBytes += bytes;
					if (nameBytes > MAX_ASSET_NAME_BYTES) throw limitFailure$1(NODE_SEA_ASSET_NAME_BYTES, "memory");
				};
				for (let index = 0; index < count; index += 1) {
					if (index % 256 === 0) {
						await setImmediate();
						assertArtifactReadActive(signal);
					}
					const name = this.text(true, NODE_SEA_INVALID_UTF8, charge);
					if (seen.has(name)) throw formatFailure$3(nodeSeaAssetCollision(name));
					seen.add(name);
					assets.push({
						name,
						range: this.byteRange()
					});
				}
				return assets;
			}
			async execArgv(signal) {
				const count = this.#count(MAX_EXEC_ARGV, NODE_SEA_EXEC_ARGV_COUNT);
				if (count * 8 > this.remaining) throw formatFailure$3(NODE_SEA_TRUNCATED);
				const values = [];
				let textBytes = 0;
				const charge = (bytes) => {
					textBytes += bytes;
					if (textBytes > MAX_EXEC_ARGV_TEXT_BYTES) throw limitFailure$1(NODE_SEA_EXEC_ARGV_TEXT, "memory");
				};
				for (let index = 0; index < count; index += 1) {
					if (index % 256 === 0) {
						await setImmediate();
						assertArtifactReadActive(signal);
					}
					values.push(this.text(true, NODE_SEA_INVALID_UTF8, charge));
				}
				return values;
			}
			async hasNonZeroTail(signal) {
				for (let start = this.#offset; start < this.bytes.length; start += 64 * 1024) {
					await setImmediate();
					assertArtifactReadActive(signal);
					const end = Math.min(start + 64 * 1024, this.bytes.length);
					for (let index = start; index < end; index += 1) if (this.bytes[index] !== 0) return true;
				}
				assertArtifactReadActive(signal);
				return false;
			}
			#size() {
				if (this.remaining < 8) throw formatFailure$3(NODE_SEA_TRUNCATED);
				const value = this.#demand(8).readBigUInt64LE(0);
				if (value > BigInt(Number.MAX_SAFE_INTEGER) || value > BigInt(this.remaining)) throw formatFailure$3(NODE_SEA_TRUNCATED);
				return Number(value);
			}
			#count(limit, message) {
				if (this.remaining < 8) throw formatFailure$3(NODE_SEA_TRUNCATED);
				const value = this.#demand(8).readBigUInt64LE(0);
				if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw formatFailure$3(NODE_SEA_TRUNCATED);
				const count = Number(value);
				if (count > limit) throw limitFailure$1(message, "capacity");
				return count;
			}
			#demand(length) {
				if (length > this.remaining) throw formatFailure$3(NODE_SEA_TRUNCATED);
				const start = this.#offset;
				this.#offset += length;
				return this.bytes.subarray(start, this.#offset);
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/nodeSea/NodeSeaLocation.js
var LC_SEGMENT, LC_SEGMENT_64, PT_NOTE, SHT_NOTE, RT_RCDATA, RESOURCE_NAME, SEA_SECTION, MAX_COMMAND_BYTES, MAX_ELF_HEADERS, MAX_NOTE_NAME_BYTES, FUSE_LENGTH, PE_HEADER_PROBE_BYTES, formatFailure$2, limitFailure, locateNodeSea, readNodeSeaBlob, scanNodeSeaFuse, collapseRanges, locateFatMachO, locateThinMachO, locateElfNotes, readElfTables, scanElfNoteTable, failNoteTable, locatePeResources, digestRange, readExact, cString, readU32;
function init_NodeSeaLocation() {
	return (init_NodeSeaLocation = __esmMin((() => {
		init_machoSegmentHeader();
		init_machoSectionHeader();
		init_elfSectionHeader();
		init_elfProgramHeader();
		init_elfRawTableDeclarations();
		init_PeResourceParser();
		init_PeResourceLayout();
		init_peResources();
		init_ArtifactHash();
		init_ArtifactReader();
		init_machoContainer();
		init_elfFixedHeader();
		init_machoLoadCommands();
		init_elfNoteLayout();
		init_NodeSeaBlob();
		LC_SEGMENT = 1;
		LC_SEGMENT_64 = 25;
		PT_NOTE = 4;
		SHT_NOTE = 7;
		RT_RCDATA = 10;
		RESOURCE_NAME = "NODE_SEA_BLOB";
		SEA_SECTION = "__NODE_SEA_BLOB";
		MAX_COMMAND_BYTES = 8 * 1024 * 1024;
		MAX_ELF_HEADERS = 4096;
		MAX_NOTE_NAME_BYTES = 4096;
		FUSE_LENGTH = "NODE_SEA_FUSE_".length + 32 + 2;
		PE_HEADER_PROBE_BYTES = 64 * 1024;
		formatFailure$2 = (message) => new ArtifactReaderFailure("format", message);
		limitFailure = (message) => new ArtifactReaderFailure("limit", message, { boundary: "memory" });
		locateNodeSea = async (handle, fileSize, signal) => {
			if (!Number.isSafeInteger(fileSize) || fileSize < 4) return undefined;
			const carrier = {
				handle,
				fileSize,
				signal
			};
			const prefix = await readExact(carrier, 0, Math.min(fileSize, 64));
			if (prefix === undefined || prefix.length < 4) return undefined;
			const thin = readMachoHeaderPrefixFacts(prefix).format;
			const fat = readFatHeaderPrefix(prefix);
			if (thin !== null || fat.state === "incomplete" || fat.state === "parsed") {
				const ranges = thin !== null ? await locateThinMachO(carrier, 0, fileSize) : await locateFatMachO(carrier, prefix);
				return collapseRanges(carrier, "mach-o", ranges);
			}
			if (prefix.subarray(0, 4).equals(Buffer.from([
				127,
				69,
				76,
				70
			]))) return collapseRanges(carrier, "elf", await locateElfNotes(carrier, prefix));
			if (prefix[0] === 77 && prefix[1] === 90) return collapseRanges(carrier, "pe", await locatePeResources(carrier));
			return undefined;
		};
		readNodeSeaBlob = async (handle, location, fileSize, signal) => {
			if (location.blobLength > 268435456) throw limitFailure(NODE_SEA_BLOB_TOO_LARGE);
			const bytes = await readExact({
				handle,
				fileSize,
				signal
			}, location.blobOffset, location.blobLength);
			if (bytes === undefined) throw formatFailure$2(NODE_SEA_TRUNCATED);
			return bytes;
		};
		scanNodeSeaFuse = async (handle, fileSize, signal) => {
			const carrier = {
				handle,
				fileSize,
				signal
			};
			const matches = new Set();
			const overlap = FUSE_LENGTH - 1;
			let carry = Buffer.alloc(0);
			let position = 0;
			while (position < fileSize) {
				const length = Math.min(64 * 1024, fileSize - position);
				const chunk = await readExact(carrier, position, length);
				if (chunk === undefined) throw new ArtifactReaderFailure("integrity", "Node SEA carrier shrank during the fuse scan");
				const window = carry.length === 0 ? chunk : Buffer.concat([carry, chunk]);
				for (const match of window.toString("latin1").matchAll(/NODE_SEA_FUSE_[0-9a-f]{32}:[01]/gu)) if (match[0] !== undefined) {
					matches.add(match[0]);
					if (matches.size > 1) return observeNodeSeaFuseMatches([...matches]);
				}
				carry = window.subarray(Math.max(0, window.length - overlap));
				position += length;
			}
			return observeNodeSeaFuseMatches([...matches]);
		};
		collapseRanges = async (carrier, kind, ranges) => {
			const unique = [];
			const seen = new Set();
			for (const range of ranges) {
				const key = `${String(range.offset)}:${String(range.length)}`;
				if (seen.has(key)) continue;
				seen.add(key);
				unique.push(range);
			}
			const chosen = unique[0];
			if (chosen === undefined) return undefined;
			if (unique.length > 1) {
				const hashes = new Set();
				for (const range of unique) hashes.add(await digestRange(carrier, range.offset, range.length));
				if (hashes.size !== 1) throw formatFailure$2(NODE_SEA_DUPLICATE_BLOB);
			}
			return {
				carrier: kind,
				blobOffset: chosen.offset,
				blobLength: chosen.length
			};
		};
		locateFatMachO = async (carrier, prefix) => {
			let bytes = prefix;
			let header = readFatContainerHeader(bytes, carrier.fileSize);
			if (header.state === "needs-data") {
				const required = await readExact(carrier, 0, Math.min(carrier.fileSize, header.requiredBytes));
				if (required === undefined || required.length < header.requiredBytes) return [];
				bytes = required;
				header = readFatContainerHeader(bytes, carrier.fileSize);
			}
			if (header.state !== "parsed") {
				if (readMachoHeaderPrefixFacts(bytes).format !== null) return locateThinMachO(carrier, 0, carrier.fileSize);
				return [];
			}
			const found = [];
			for (const [index, slice] of header.slices.entries()) {
				if (slice === undefined || header.rangeIssues[index] != null) continue;
				found.push(...await locateThinMachO(carrier, slice.offset, slice.size));
			}
			return found;
		};
		locateThinMachO = async (carrier, base, sliceSize) => {
			if (!Number.isSafeInteger(base) || !Number.isSafeInteger(sliceSize) || base < 0 || sliceSize < 32 || base > carrier.fileSize || sliceSize > carrier.fileSize - base) return [];
			const header = await readExact(carrier, base, 32);
			if (header === undefined) return [];
			const framing = readMachoLoadCommandTableHeader(header, sliceSize);
			if (!framing.ok || framing.value === null) return [];
			const { headerSize, littleEndian: little, commandCount: ncmds, commandBytes: sizeofcmds } = framing.value;
			if (sizeofcmds > MAX_COMMAND_BYTES) return [];
			const commands = await readExact(carrier, base + headerSize, sizeofcmds);
			if (commands === undefined) return [];
			const found = [];
			let offset = 0;
			let seen = 0;
			while (offset + 8 <= commands.length && seen < ncmds) {
				abortIfNeeded(carrier.signal);
				const cmd = readU32(commands, offset, little);
				const cmdsize = readU32(commands, offset + 4, little);
				if (cmdsize < 8 || offset + cmdsize > commands.length) {
					if (found.length > 0) throw formatFailure$2(NODE_SEA_MACHO_COMMANDS_TRUNCATED);
					return found;
				}
				if (cmd === LC_SEGMENT || cmd === LC_SEGMENT_64) {
					const segment64 = cmd === LC_SEGMENT_64;
					const sectionSize = segment64 ? 80 : 68;
					const parsedSegment = readMachoSegmentHeader(commands.subarray(offset, offset + cmdsize), segment64, little);
					const segment = parsedSegment.ok ? parsedSegment.value : undefined;
					const name = segment === undefined ? undefined : cString(segment.nameBytes, 0, 16);
					if (segment !== undefined && (name === "NODE_SEA" || name === "__NODE_SEA")) {
						const segmentHeader = segment.headerSize;
						const nsects = segment.sectionCount;
						const table = offset + segmentHeader;
						if (nsects > Math.floor((cmdsize - segmentHeader) / sectionSize) || table + nsects * sectionSize > offset + cmdsize) throw formatFailure$2(NODE_SEA_MACHO_SEGMENT_TRUNCATED);
						for (let index = 0; index < nsects; index += 1) {
							const section = table + index * sectionSize;
							const parsedSection = readMachoSectionHeader(commands.subarray(section, section + sectionSize), segment64, little);
							if (!parsedSection.ok) throw formatFailure$2(NODE_SEA_MACHO_SEGMENT_TRUNCATED);
							const record = parsedSection.value;
							if (cString(record.nameBytes, 0, 16) !== SEA_SECTION) continue;
							const length = Number(record.size);
							const fileOffset = record.offset;
							if (!Number.isSafeInteger(length) || length > 268435456) throw limitFailure(NODE_SEA_BLOB_TOO_LARGE);
							if (fileOffset > sliceSize || length > sliceSize - fileOffset) throw formatFailure$2(NODE_SEA_TRUNCATED);
							found.push({
								offset: base + fileOffset,
								length
							});
						}
					}
				}
				offset += cmdsize;
				seen += 1;
			}
			if (found.length > 0 && (seen !== ncmds || offset !== commands.length)) throw formatFailure$2(NODE_SEA_MACHO_COMMANDS_TRUNCATED);
			return found;
		};
		locateElfNotes = async (carrier, prefix) => {
			const header = readElfFixedHeader(prefix, carrier.fileSize);
			if (!header.ok) return [];
			const little = header.value.byteOrder === "little";
			const elf64 = header.value.elfClass === 64;
			const fields = await readExact(carrier, 0, Math.min(carrier.fileSize, header.value.headerSize));
			if (fields === undefined) return [];
			const raw = readElfRawTableDeclarations(fields, header.value);
			if (!raw.ok) return [];
			const { programs: programDeclarations, sections: sectionDeclarations } = raw.value;
			const phoff = programDeclarations.offset <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(programDeclarations.offset) : undefined;
			const shoff = sectionDeclarations.offset <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(sectionDeclarations.offset) : undefined;
			const phentsize = programDeclarations.width;
			const phnum = programDeclarations.count;
			const shentsize = sectionDeclarations.width;
			const shnum = sectionDeclarations.count;
			const minimumProgram = elf64 ? 56 : 32;
			const minimumSection = elf64 ? 64 : 40;
			const found = [];
			let opaque = false;
			const scan = {
				little,
				notes: Math.floor(carrier.fileSize / 12)
			};
			const programs = await readElfTables(carrier, {
				offset: phoff,
				count: phnum,
				entrySize: phentsize,
				minimumEntry: minimumProgram
			});
			if (programs === undefined) opaque = phnum > 0;
			else for (const entry of programs) {
				const parsedProgram = readElfProgramHeader(entry, header.value.elfClass, little);
				if (!parsedProgram.ok) continue;
				const program = parsedProgram.value;
				if (program.type !== PT_NOTE) continue;
				const note = {
					offset: program.offset <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(program.offset) : undefined,
					length: program.fileSize <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(program.fileSize) : undefined,
					align: program.alignment <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(program.alignment) : undefined
				};
				const scanned = await scanElfNoteTable(carrier, note, scan, found.length > 0);
				if (scanned === undefined) opaque = true;
				else found.push(...scanned);
			}
			if (programs !== undefined && phnum > 0) {
				if (found.length > 0 && opaque) throw formatFailure$2(NODE_SEA_ELF_TABLE_TRUNCATED);
				return found;
			}
			const sections = await readElfTables(carrier, {
				offset: shoff,
				count: shnum,
				entrySize: shentsize,
				minimumEntry: minimumSection
			});
			if (sections === undefined) opaque = opaque || shnum > 0;
			else for (const entry of sections) {
				const parsedSection = readElfSectionHeader(entry, header.value.elfClass, little);
				if (!parsedSection.ok) continue;
				const section = parsedSection.value;
				if (section.type !== SHT_NOTE) continue;
				const note = {
					offset: section.offset <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(section.offset) : undefined,
					length: section.size <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(section.size) : undefined,
					align: section.alignment <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(section.alignment) : undefined
				};
				const scanned = await scanElfNoteTable(carrier, note, scan, found.length > 0);
				if (scanned === undefined) opaque = true;
				else found.push(...scanned);
			}
			if (found.length > 0 && opaque) throw formatFailure$2(NODE_SEA_ELF_TABLE_TRUNCATED);
			return found;
		};
		readElfTables = async (carrier, table) => {
			if (table.count === 0) return [];
			if (table.offset === undefined || table.count > MAX_ELF_HEADERS || table.entrySize < table.minimumEntry || table.entrySize > 1024 || table.offset > carrier.fileSize) return undefined;
			const entries = [];
			for (let index = 0; index < table.count; index += 1) {
				if (index % 128 === 0) abortIfNeeded(carrier.signal);
				const offset = table.offset + index * table.entrySize;
				if (offset > carrier.fileSize || table.entrySize > carrier.fileSize - offset) return undefined;
				const entry = await readExact(carrier, offset, table.entrySize);
				if (entry === undefined) return undefined;
				entries.push(entry);
			}
			return entries;
		};
		scanElfNoteTable = async (carrier, note, scan, alreadyFound) => {
			if (note.offset === undefined || note.length === undefined || note.offset > carrier.fileSize || note.length > carrier.fileSize - note.offset) return undefined;
			const alignment = elfNoteAlignment(note.align === 8 ? 8 : 4);
			const found = [];
			let cursor = 0;
			while (cursor + 12 <= note.length) {
				abortIfNeeded(carrier.signal);
				if (scan.notes === 0) {
					if (alreadyFound || found.length > 0) throw formatFailure$2(NODE_SEA_ELF_NOTES_REPEATED);
					return undefined;
				}
				scan.notes -= 1;
				const header = await readExact(carrier, note.offset + cursor, 12);
				if (header === undefined) return failNoteTable(alreadyFound || found.length > 0);
				const parsedHeader = readElfNoteHeader(header, scan.little);
				if (!parsedHeader.ok) return failNoteTable(alreadyFound || found.length > 0);
				const { namesz, descsz } = parsedHeader.value;
				if (namesz > MAX_NOTE_NAME_BYTES) return failNoteTable(alreadyFound || found.length > 0);
				if (cursor > note.length - 12 || namesz > note.length - cursor - 12) return failNoteTable(alreadyFound || found.length > 0);
				let layout;
				try {
					layout = elfNoteLayout(namesz, descsz, alignment);
				} catch {
					return failNoteTable(alreadyFound || found.length > 0);
				}
				if (!Number.isSafeInteger(layout.descriptor) || !Number.isSafeInteger(layout.next) || layout.next < 12) return failNoteTable(alreadyFound || found.length > 0);
				const name = await readExact(carrier, note.offset + cursor + 12, namesz);
				if (name === undefined) return failNoteTable(alreadyFound || found.length > 0);
				const owner = cString(name, 0, name.length);
				const descriptorFits = layout.descriptor <= note.length - cursor && descsz <= note.length - cursor - layout.descriptor;
				if (owner === RESOURCE_NAME) {
					if (!descriptorFits) throw formatFailure$2(NODE_SEA_ELF_DESCRIPTOR_TRUNCATED);
					if (descsz > 268435456) throw limitFailure(NODE_SEA_BLOB_TOO_LARGE);
					const blobOffset = note.offset + cursor + layout.descriptor;
					if (blobOffset > carrier.fileSize || descsz > carrier.fileSize - blobOffset) throw formatFailure$2(NODE_SEA_ELF_DESCRIPTOR_TRUNCATED);
					found.push({
						offset: blobOffset,
						length: descsz
					});
				}
				if (layout.next > note.length - cursor) return failNoteTable(alreadyFound || found.length > 0 || owner === RESOURCE_NAME);
				cursor += layout.next;
			}
			return found;
		};
		failNoteTable = (confirmed) => {
			if (confirmed) throw formatFailure$2(NODE_SEA_ELF_TABLE_TRUNCATED);
			return undefined;
		};
		locatePeResources = async (carrier) => {
			const headers = await readExact(carrier, 0, Math.min(carrier.fileSize, PE_HEADER_PROBE_BYTES));
			if (headers === undefined || !await hasPeResourceName(headers, carrier.fileSize, (offset, length) => readExact(carrier, offset, length), RT_RCDATA, RESOURCE_NAME, 65536)) return [];
			if (carrier.fileSize > 536870912) {
				throw limitFailure("Node SEA PE inspection exceeds the 512 MiB PE parser input ceiling");
			}
			const bytes = await readExact(carrier, 0, carrier.fileSize);
			if (bytes === undefined) throw formatFailure$2(NODE_SEA_TRUNCATED);
			let layout;
			try {
				layout = readPeResourceLayout(bytes);
			} catch (cause) {
				if (cause instanceof ArtifactReaderFailure && cause.reason === "format") return [];
				throw cause;
			}
			const resources = await parsePeResources(bytes, {
				path: "<admitted SEA carrier>",
				sha256: createHash("sha256").update(bytes).digest("hex"),
				bytes: bytes.length
			}, {
				path: "/admitted-sea-carrier",
				max_file_bytes: MAX_INSPECT_PE_FILE_BYTES,
				max_entries: MAX_INSPECT_PE_DIRECTORY_ENTRIES
			}, carrier.signal, layout);
			return resources.resources.flatMap((resource) => {
				if (resource.type.kind !== "id" || resource.type.id !== RT_RCDATA || resource.name.kind !== "name" || resource.name.name !== RESOURCE_NAME) return [];
				const range = resource.payload.location;
				if (range.bytes > 268435456) throw limitFailure(NODE_SEA_BLOB_TOO_LARGE);
				return [{
					offset: range.offset,
					length: range.bytes
				}];
			});
		};
		digestRange = async (carrier, offset, length) => {
			const hash = createHash("sha256");
			let remaining = length;
			let position = offset;
			while (remaining > 0) {
				const chunkLength = Math.min(64 * 1024, remaining);
				const chunk = await readExact(carrier, position, chunkLength);
				if (chunk === undefined) throw formatFailure$2(NODE_SEA_TRUNCATED);
				hash.update(chunk);
				position += chunkLength;
				remaining -= chunkLength;
			}
			return hash.digest("hex");
		};
		readExact = async (carrier, offset, length) => {
			abortIfNeeded(carrier.signal);
			if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 0 || offset > carrier.fileSize || length > carrier.fileSize - offset) return undefined;
			if (length === 0) return Buffer.alloc(0);
			const bytes = Buffer.alloc(length);
			let filled = 0;
			while (filled < length) {
				abortIfNeeded(carrier.signal);
				const read = await carrier.handle.read(bytes, filled, length - filled, offset + filled);
				abortIfNeeded(carrier.signal);
				if (read.bytesRead === 0) return undefined;
				filled += read.bytesRead;
			}
			return bytes;
		};
		cString = (bytes, offset, length) => {
			let end = offset;
			const limit = Math.min(bytes.length, offset + length);
			while (end < limit && bytes[end] !== 0) end += 1;
			return bytes.toString("latin1", offset, end);
		};
		readU32 = (bytes, offset, little) => little ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
	})))();
}

//#endregion
//#region dist/artifacts/NodeSeaArtifactReader.js
function* seaMembers(decoded) {
	const registry = new ArtifactPathRegistry();
	const claimed = new Set();
	const reserve = (path) => {
		if (claimed.has(path)) throw new ArtifactReaderFailure("path", `Node SEA entry path collides: ${path}`);
		registry.add(path, "file");
		claimed.add(path);
		return path;
	};
	const mappedPath = (raw, fallback) => {
		try {
			const normalized = normalizeArtifactPath(raw);
			if (normalized !== "__node_sea__" && !normalized.startsWith("__node_sea__/")) return reserve(normalized);
		} catch (cause) {
			if (!(cause instanceof ArtifactReaderFailure) || cause.reason !== "path") throw cause;
		}
		return reserve(fallback);
	};
	if (decoded.mainScript !== null) yield {
		path: mappedPath(decoded.codePath, MAIN_FALLBACK_PATH),
		sourcePath: decoded.codePath,
		role: "main-script",
		range: decoded.mainScript
	};
	if (decoded.snapshot !== null) yield {
		path: reserve(SNAPSHOT_PATH),
		sourcePath: SNAPSHOT_PATH,
		role: "snapshot",
		range: decoded.snapshot
	};
	if (decoded.codeCache !== null) yield {
		path: reserve(CODE_CACHE_PATH),
		sourcePath: CODE_CACHE_PATH,
		role: "code-cache",
		range: decoded.codeCache
	};
	for (const [ordinal, asset] of decoded.assets.entries()) yield {
		path: mappedPath(asset.name, `${ASSET_FALLBACK_PREFIX}${String(ordinal)}`),
		sourcePath: asset.name,
		role: "asset",
		range: asset.range
	};
}
var SNAPSHOT_PATH, CODE_CACHE_PATH, MAIN_FALLBACK_PATH, ASSET_FALLBACK_PREFIX, NodeSeaArtifactReader, formatFailure$1;
function init_NodeSeaArtifactReader() {
	return (init_NodeSeaArtifactReader = __esmMin((() => {
		init_artifactExpansionBudget();
		init_ArtifactPaths();
		init_ArtifactReader();
		init_NodeSeaBlob();
		init_NodeSeaLocation();
		init_PositionalArtifactReader();
		SNAPSHOT_PATH = "__node_sea__/snapshot";
		CODE_CACHE_PATH = "__node_sea__/code-cache";
		MAIN_FALLBACK_PATH = "__node_sea__/main.cjs";
		ASSET_FALLBACK_PREFIX = "__node_sea__/assets/";
		NodeSeaArtifactReader = class extends PositionalArtifactReader {
			format = "node-sea";
			#header;
			#admission;
			constructor(path, admitted) {
				const admission = admitted !== undefined && "kind" in admitted ? admitted : undefined;
				super(path, "Node SEA", admitted !== undefined && "kind" in admitted ? admitted.source : admitted);
				this.#admission = admission;
			}
			formatMetadata() {
				if (this.#header === undefined) return undefined;
				return {
					...this.#header,
					exec_argv: [...this.#header.exec_argv]
				};
			}
			/** Also drop the admitted decode, which only a completed preparation releases. */
			async close() {
				await super.close();
				this.#admission = undefined;
			}
			async prepareEntries(signal) {
				const { handle, initial } = await this.verifyCarrier(signal);
				let location;
				let decoded;
				if (this.#admission !== undefined) {
					({location, decoded} = this.#admission);
				} else {
					const found = await locateNodeSea(handle, initial.size, signal);
					if (found === undefined) throw formatFailure$1("blob was not found");
					location = found;
					if (location.blobLength > 268435456) throw new ArtifactReaderFailure("limit", NODE_SEA_BLOB_TOO_LARGE, { boundary: "memory" });
					decoded = await decodeNodeSeaBlob(await readNodeSeaBlob(handle, location, initial.size, signal), signal);
				}
				const fuse = await scanNodeSeaFuse(handle, initial.size, signal);
				const entries = [];
				let declaredBytes = 0n;
				const expansionBudget = BigInt(artifactExpansionBudgetBytes(location.blobLength));
				let index = 0;
				for (const member of seaMembers(decoded)) {
					if (index % 256 === 0) await setImmediate();
					this.assertOpen(signal);
					declaredBytes += BigInt(member.range.length);
					if (declaredBytes > expansionBudget) throw new ArtifactReaderFailure("limit", `Node SEA readable entries declare ${String(declaredBytes)} bytes, exceeding this blob's ${String(expansionBudget)}-byte expansion budget`, { boundary: "memory" });
					const start = location.blobOffset + member.range.offset;
					if (start > initial.size || member.range.length > initial.size - start) throw formatFailure$1(`member exceeds the carrier: ${member.path}`);
					const entry = {
						path: member.path,
						kind: "file",
						declaredSize: member.range.length,
						compressedSize: null,
						executable: false,
						encrypted: false,
						byteOffset: start,
						declaredIntegrity: null,
						unpacked: false,
						limitations: [],
						adapterKey: `node-sea:${String(index)}`,
						formatMetadata: {
							kind: "node-sea-entry",
							role: member.role,
							source_path: member.sourcePath,
							index
						},
						sourcePath: member.sourcePath
					};
					entries.push(entry);
					index += 1;
				}
				this.#header = {
					kind: "node-sea",
					magic: decoded.magic,
					flags: decoded.flags,
					disable_experimental_sea_warning: decoded.disableExperimentalSeaWarning,
					use_snapshot: decoded.useSnapshot,
					use_code_cache: decoded.useCodeCache,
					include_assets: decoded.includeAssets,
					include_exec_argv: decoded.includeExecArgv,
					exec_argv_extension: decoded.execArgvExtension,
					exec_argv: [...decoded.execArgv],
					code_path: decoded.codePath,
					carrier: location.carrier,
					blob_offset: location.blobOffset,
					blob_length: location.blobLength,
					fuse_state: fuse.fuseState,
					fuse_sentinel: fuse.fuseSentinel,
					fuse_contradiction: fuse.fuseContradiction
				};
				await this.verifyCarrier(signal);
				this.#admission = undefined;
				return {
					entries,
					coverage: fuse.fuseContradiction === null ? undefined : {
						status: "complete",
						limitations: [fuse.fuseContradiction]
					}
				};
			}
		};
		formatFailure$1 = (detail) => new ArtifactReaderFailure("format", `Node SEA blob is malformed: ${detail}`);
	})))();
}

//#endregion
//#region dist/artifacts/pyinstaller/PyInstallerFailure.js
var pyInstallerFailure;
function init_PyInstallerFailure() {
	return (init_PyInstallerFailure = __esmMin((() => {
		pyInstallerFailure = (reason, message) => ({
			reason,
			message
		});
	})))();
}

//#endregion
//#region dist/artifacts/pyinstaller/PyInstallerBytes.js
var readPyInstallerBytes;
function init_PyInstallerBytes() {
	return (init_PyInstallerBytes = __esmMin((() => {
		init_result();
		init_ArtifactReader();
		init_ArtifactHash();
		init_PyInstallerFailure();
		readPyInstallerBytes = async (handle, input) => {
			abortIfNeeded(input.signal);
			if (!Number.isSafeInteger(input.position) || !Number.isSafeInteger(input.length) || input.position < 0 || input.length < 0 || !Number.isSafeInteger(input.position + input.length)) return err(pyInstallerFailure("format", `${input.label} has an invalid source range`));
			const bytes = Buffer.alloc(input.length);
			let offset = 0;
			while (offset < bytes.length) {
				abortIfNeeded(input.signal);
				let count;
				try {
					const read = await handle.read(bytes, offset, bytes.length - offset, input.position + offset);
					count = read.bytesRead;
				} catch (cause) {
					throw new ArtifactReaderFailure("io", `${input.label} could not be read`, { cause });
				}
				abortIfNeeded(input.signal);
				if (count === 0) return err(pyInstallerFailure("format", `${input.label} is truncated`));
				offset += count;
			}
			return ok(bytes);
		};
	})))();
}

//#endregion
//#region dist/artifacts/pyinstaller/CArchiveLayout.js
var PYINSTALLER_COOKIE_MAGIC, PYINSTALLER_COOKIE_V21_BYTES, PYINSTALLER_COOKIE_V20_BYTES, PYINSTALLER_COOKIE_SEARCH_BYTES, MAX_TOC_BYTES, MAX_TOC_ENTRIES, TOC_HEADER_BYTES, CARCHIVE_ENTRY_ROLES, isCArchiveDeclaration, isCArchivePythonModule, observePyInstallerCookie, readCArchiveToc, parseCArchiveToc, parseCookieAt, parseCookie, libraryName, tocName, safeSum, validateCArchiveMembers;
function init_CArchiveLayout() {
	return (init_CArchiveLayout = __esmMin((() => {
		init_PyInstallerBytes();
		init_result();
		init_PyInstallerFailure();
		PYINSTALLER_COOKIE_MAGIC = Buffer.from("MEI\f\v\n\v");
		PYINSTALLER_COOKIE_V21_BYTES = 88;
		PYINSTALLER_COOKIE_V20_BYTES = 24;
		PYINSTALLER_COOKIE_SEARCH_BYTES = 16 * 1024 * 1024;
		MAX_TOC_BYTES = 32 * 1024 * 1024;
		MAX_TOC_ENTRIES = 1e5;
		TOC_HEADER_BYTES = 18;
		CARCHIVE_ENTRY_ROLES = new Map([
			["s", "script"],
			["m", "module"],
			["M", "package"],
			["o", "runtime-option"],
			["d", "dependency"],
			["n", "symlink"],
			["b", "binary"],
			["z", "pyz"]
		]);
		isCArchiveDeclaration = (entry) => entry.role === "runtime-option" || entry.role === "dependency";
		isCArchivePythonModule = (entry) => entry.role === "module" || entry.role === "package";
		observePyInstallerCookie = async (handle, fileSize, signal) => {
			if (!Number.isSafeInteger(fileSize) || fileSize < 24) return ok({ state: "absent" });
			const tailSize = Math.min(fileSize, PYINSTALLER_COOKIE_SEARCH_BYTES);
			const read = await readPyInstallerBytes(handle, {
				position: fileSize - tailSize,
				length: tailSize,
				label: "CArchive tail",
				signal
			});
			if (!read.ok) return read;
			const observed = read.value;
			let failure;
			let from = observed.length;
			while (from >= PYINSTALLER_COOKIE_MAGIC.length) {
				const relative = observed.subarray(0, from).lastIndexOf(PYINSTALLER_COOKIE_MAGIC);
				if (relative < 0) break;
				const cookieOffset = fileSize - tailSize + relative;
				const parsed = parseCookieAt(observed, relative, cookieOffset, fileSize);
				if (parsed.ok) return ok({
					state: "located",
					cookie: parsed.value
				});
				failure = parsed.error;
				from = relative;
			}
			return ok(failure === undefined ? { state: "absent" } : {
				state: "rejected-candidates",
				failure
			});
		};
		readCArchiveToc = async (handle, cookie, signal) => {
			if (cookie.tocLength > MAX_TOC_BYTES) return err(pyInstallerFailure("limit", "CArchive table of contents exceeds its bound"));
			const position = cookie.archiveStart + cookie.tocOffset;
			const read = await readPyInstallerBytes(handle, {
				position,
				length: cookie.tocLength,
				label: "CArchive table of contents",
				signal
			});
			if (!read.ok) return read;
			const parsed = parseCArchiveToc(read.value);
			if (!parsed.ok) return parsed;
			const valid = validateCArchiveMembers(parsed.value, cookie.tocOffset);
			return valid.ok ? parsed : valid;
		};
		parseCArchiveToc = (bytes) => {
			const entries = [];
			let offset = 0;
			const malformedEntry = (message) => err(pyInstallerFailure("format", `CArchive table index ${String(entries.length)} at TOC offset ${String(offset)}: ${message}`));
			while (offset < bytes.length) {
				if (entries.length >= MAX_TOC_ENTRIES) return err(pyInstallerFailure("limit", "CArchive table of contents exceeds its entry bound"));
				if (offset + TOC_HEADER_BYTES > bytes.length) return malformedEntry("CArchive table of contents entry is truncated");
				const entryLength = bytes.readUInt32BE(offset);
				if (entryLength < TOC_HEADER_BYTES || offset + entryLength > bytes.length) return malformedEntry("CArchive table of contents entry extends outside the table");
				const nameBytes = bytes.subarray(offset + TOC_HEADER_BYTES, offset + entryLength);
				const name = tocName(nameBytes);
				if (!name.ok) return malformedEntry(name.error.message);
				const compressionFlag = bytes[offset + 16] ?? 0;
				if (compressionFlag !== 0 && compressionFlag !== 1) return malformedEntry(`CArchive compression flag ${String(compressionFlag)} is not stored or zlib`);
				const typeCode = bytes[offset + 17] ?? 0;
				if (typeCode < 32 || typeCode > 126) return malformedEntry("CArchive type code is not a printable character");
				const sourceTypeCode = String.fromCharCode(typeCode);
				entries.push({
					index: entries.length,
					tocRecordOffset: offset,
					tocRecordLength: entryLength,
					name: name.value,
					typeCode: sourceTypeCode,
					role: CARCHIVE_ENTRY_ROLES.get(sourceTypeCode) ?? "other",
					offset: bytes.readUInt32BE(offset + 4),
					compressedSize: bytes.readUInt32BE(offset + 8),
					uncompressedSize: bytes.readUInt32BE(offset + 12),
					compressionFlag
				});
				offset += entryLength;
			}
			return ok(entries);
		};
		parseCookieAt = (tail, relative, cookieOffset, fileSize) => {
			const modern = parseCookie(tail, relative, cookieOffset, fileSize, "2.1");
			if (modern.ok) return modern;
			const legacy = parseCookie(tail, relative, cookieOffset, fileSize, "2.0");
			return legacy.ok ? legacy : modern;
		};
		parseCookie = (tail, relative, cookieOffset, fileSize, layout) => {
			const cookieBytes = layout === "2.1" ? 88 : 24;
			if (relative + cookieBytes > tail.length) return err(pyInstallerFailure("format", "CArchive cookie extends past the end of the file"));
			const view = tail.subarray(relative, relative + cookieBytes);
			const packageLength = view.readUInt32BE(8);
			const tocOffset = view.readUInt32BE(12);
			const tocLength = view.readUInt32BE(16);
			const pythonVersion = view.readUInt32BE(20);
			if (!safeSum(tocOffset, tocLength, cookieBytes) || packageLength !== tocOffset + tocLength + cookieBytes) return err(pyInstallerFailure("format", "CArchive cookie does not describe a table of contents inside the package"));
			const archiveStart = cookieOffset + cookieBytes - packageLength;
			if (archiveStart < 0 || archiveStart + packageLength > fileSize) return err(pyInstallerFailure("format", "CArchive cookie range is outside the file"));
			const library = layout === "2.1" ? libraryName(view.subarray(24, 88)) : ok(null);
			if (!library.ok) return library;
			return ok({
				layout,
				archiveStart,
				packageLength,
				tocOffset,
				tocLength,
				pythonVersion,
				pythonLibrary: library.value,
				cookieOffset
			});
		};
		libraryName = (bytes) => {
			const end = bytes.indexOf(0);
			const text = end < 0 ? bytes : bytes.subarray(0, end);
			if (end >= 0 && bytes.subarray(end).some((byte) => byte !== 0)) return err(pyInstallerFailure("format", "CArchive Python library name is not NUL-padded"));
			if (text.length === 0) return ok(null);
			try {
				return ok(new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(text));
			} catch {
				return err(pyInstallerFailure("format", "CArchive Python library name is not valid UTF-8"));
			}
		};
		tocName = (bytes) => {
			const end = bytes.indexOf(0);
			const text = end < 0 ? bytes : bytes.subarray(0, end);
			if (text.length === 0) return err(pyInstallerFailure("format", "CArchive entry name is empty"));
			try {
				return ok(new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(text));
			} catch {
				return err(pyInstallerFailure("format", "CArchive entry name is not valid UTF-8"));
			}
		};
		safeSum = (left, middle, right) => Number.isSafeInteger(left) && Number.isSafeInteger(middle) && Number.isSafeInteger(right) && left >= 0 && middle >= 0 && right >= 0 && left + middle + right <= Number.MAX_SAFE_INTEGER;
		validateCArchiveMembers = (entries, tocOffset) => {
			for (const entry of entries) {
				if (isCArchiveDeclaration(entry)) {
					if (entry.compressedSize !== 0 || entry.uncompressedSize !== 0 || entry.compressionFlag !== 0) return err(pyInstallerFailure("integrity", `CArchive declaration at table index ${String(entry.index)} has local payload or compression`));
				}
				if (entry.compressionFlag === 0 && entry.compressedSize !== entry.uncompressedSize) return err(pyInstallerFailure("integrity", `Stored CArchive member size disagrees with its table entry at table index ${String(entry.index)}`));
				if (entry.offset > tocOffset) return err(pyInstallerFailure("format", `CArchive member offset is outside the archive at table index ${String(entry.index)}`));
			}
			const ranges = entries.filter((entry) => entry.compressedSize > 0).map((entry) => ({
				index: entry.index,
				start: entry.offset,
				end: entry.offset + entry.compressedSize
			})).sort((left, right) => left.start - right.start);
			let occupied = 0;
			for (const range of ranges) {
				if (!Number.isSafeInteger(range.end) || range.end > tocOffset || range.start < occupied) return err(pyInstallerFailure("integrity", `CArchive member extends outside the archive or overlaps another member at table index ${String(range.index)}`));
				occupied = range.end;
			}
			return ok(null);
		};
	})))();
}

//#endregion
//#region dist/artifacts/pyinstaller/PyInstallerMetadata.js
var cookiePythonVersion, cookieMetadata, scriptPythonMagic, entryMetadata, cArchiveEntryMetadata, dependencyMetadata, pyzEntryEncrypted, pyzEntryMetadata;
function init_PyInstallerMetadata() {
	return (init_PyInstallerMetadata = __esmMin((() => {
		init_CArchiveLayout();
		cookiePythonVersion = (value) => value >= 100 ? {
			major: Math.floor(value / 100),
			minor: value % 100
		} : value >= 20 ? {
			major: Math.floor(value / 10),
			minor: value % 10
		} : undefined;
		cookieMetadata = (cookie, entries, encryptionMarker) => {
			const version = cookiePythonVersion(cookie.pythonVersion);
			return {
				kind: "pyinstaller",
				layout_version: cookie.layout,
				archive_start: cookie.archiveStart,
				archive_size: cookie.packageLength,
				cookie_offset: cookie.cookieOffset,
				toc_offset: cookie.tocOffset,
				toc_size: cookie.tocLength,
				entry_count: entries.length,
				runtime_option_count: entries.filter((entry) => entry.role === "runtime-option").length,
				external_dependency_count: entries.filter((entry) => entry.role === "dependency").length,
				python_version_raw: cookie.pythonVersion,
				python_major: version?.major ?? null,
				python_minor: version?.minor ?? null,
				python_library: cookie.pythonLibrary,
				encryption_marker_present: encryptionMarker
			};
		};
		scriptPythonMagic = (cookie, archives) => {
			const version = cookiePythonVersion(cookie.pythonVersion);
			if (version === undefined) return undefined;
			let selected;
			for (const archive of archives) {
				const magic = archive.pythonMagic;
				if (archive.pythonVersion !== `${String(version.major)}.${String(version.minor)}` || selected !== undefined && !selected.equals(magic)) return undefined;
				selected = magic;
			}
			return selected;
		};
		entryMetadata = (source, bytecode, header) => ({
			kind: "pyinstaller-entry",
			...source,
			bytecode_header: bytecode ? header === undefined ? "unknown" : "derived" : "not-bytecode",
			bytecode_magic: header?.subarray(0, 4).toString("hex") ?? null,
			pyz_status: "not-pyz",
			directory_record_offset: null,
			directory_record_size: null,
			pyz_sha256: null,
			pyz_python_magic: null,
			pyz_python_version: null,
			pyz_entry_count: null,
			encryption_source: null
		});
		cArchiveEntryMetadata = (entry, header, archive, encryptionMarker = false) => ({
			...entryMetadata({
				container: "carchive",
				container_name: null,
				index: entry.index,
				source_name: entry.name,
				type_code: entry.typeCode,
				relative_offset: entry.offset,
				compression_flag: entry.compressionFlag
			}, entry.role === "script" || isCArchivePythonModule(entry), header),
			...entry.role === "dependency" ? dependencyMetadata(entry.name) : {},
			pyz_status: archive?.kind === "entries" ? "decoded" : archive === undefined ? "not-pyz" : "opaque",
			directory_record_offset: entry.tocRecordOffset,
			directory_record_size: entry.tocRecordLength,
			pyz_sha256: archive?.sha256 ?? null,
			pyz_python_magic: archive?.pythonMagic.toString("hex") ?? null,
			pyz_python_version: archive?.pythonVersion ?? null,
			pyz_entry_count: archive?.kind === "entries" ? archive.entries.length : null,
			encryption_source: archive !== undefined && encryptionMarker ? "carchive-marker" : null
		});
		dependencyMetadata = (source) => {
			const colon = source.indexOf(":");
			const valid = colon > 0 && colon < source.length - 1;
			return {
				dependency_status: valid ? "unresolved" : "invalid-reference",
				dependency_archive: valid ? source.slice(0, colon) : null,
				dependency_member: valid ? source.slice(colon + 1) : null
			};
		};
		pyzEntryEncrypted = (entry, encryptionMarker) => encryptionMarker && entry.length > 0;
		pyzEntryMetadata = (container, entry, header, encryptionMarker) => ({
			...entryMetadata({
				container: "pyz",
				container_name: container.name,
				index: entry.index,
				source_name: entry.name,
				type_code: entry.typeCode,
				relative_offset: entry.offset,
				compression_flag: entry.compressionFlag
			}, entry.role === "module" || entry.role === "package", header),
			encryption_source: pyzEntryEncrypted(entry, encryptionMarker) ? "carchive-marker" : null
		});
	})))();
}

//#endregion
//#region dist/artifacts/pyinstaller/PyInstallerMemberStream.js
var readPyInstallerMemberPrefix, pyInstallerMemberStream, asError;
function init_PyInstallerMemberStream() {
	return (init_PyInstallerMemberStream = __esmMin((() => {
		init_ArtifactReader();
		init_ArtifactHash();
		readPyInstallerMemberPrefix = async (openSource, options, length) => {
			const stopped = new AbortController();
			const prefixComplete = new Error("PyInstaller member prefix observed");
			const signal = AbortSignal.any([options.signal, stopped.signal]);
			const source = await openSource(signal);
			const stream = pyInstallerMemberStream(source, {
				...options,
				header: undefined,
				signal
			});
			const prefix = Buffer.alloc(length);
			let copied = 0;
			stream.output.on("data", (chunk) => {
				copied += chunk.copy(prefix, copied, 0, length - copied);
				if (copied === length) stopped.abort(prefixComplete);
			});
			try {
				await stream.completion;
			} catch (cause) {
				if (!(cause instanceof ArtifactReaderFailure) || cause.reason !== "cancelled" || cause.cause !== prefixComplete) throw cause;
			}
			abortIfNeeded(options.signal);
			return prefix.subarray(0, copied);
		};
		pyInstallerMemberStream = (source, options) => {
			let bytes = 0;
			let headerSent = false;
			let completing = false;
			let failure;
			const prependHeader = () => {
				if (!headerSent && options.header !== undefined) output.push(options.header);
				headerSent = true;
			};
			const output = new Transform({
				transform(chunk, _encoding, callback) {
					try {
						abortIfNeeded(options.signal);
						bytes += chunk.length;
						if (bytes > options.maxBytes) throw new ArtifactReaderFailure("limit", "PyInstaller member exceeds its plaintext budget");
						options.charge?.(chunk.length);
						prependHeader();
						callback(null, chunk);
					} catch (cause) {
						callback(asError(cause));
					}
				},
				flush(callback) {
					completing = true;
					void (async () => {
						abortIfNeeded(options.signal);
						if (inflate !== undefined && inflate.bytesWritten !== options.sourceBytes) throw new ArtifactReaderFailure("integrity", "Compressed PyInstaller member did not consume its complete declared source span");
						if (options.expectedBytes !== undefined && bytes !== options.expectedBytes) throw new ArtifactReaderFailure("integrity", "PyInstaller member size disagrees with its declaration or previous observation");
						await options.complete?.(bytes);
						abortIfNeeded(options.signal);
						prependHeader();
					})().then(() => {
						completing = false;
						try {
							abortIfNeeded(options.signal);
						} catch (cause) {
							callback(asError(cause));
							return;
						}
						callback();
					}, (cause) => {
						completing = false;
						callback(asError(cause));
					});
				}
			});
			output.on("error", () => undefined);
			const onAbort = () => {
				if (completing) return;
				if (!source.readableEnded && !source.destroyed) return;
				output.destroy(new ArtifactReaderFailure("cancelled", "PyInstaller member read cancelled", { cause: options.signal.reason }));
			};
			options.signal.addEventListener("abort", onAbort, { once: true });
			const onSourceFailure = (cause) => {
				failure ??= cause instanceof ArtifactReaderFailure ? cause : new ArtifactReaderFailure("io", "PyInstaller member source could not be read", { cause });
				output.destroy(failure);
			};
			source.on("error", onSourceFailure);
			const inflate = options.compressed ? createInflate() : undefined;
			inflate?.on("error", (cause) => {
				failure ??= cause instanceof ArtifactReaderFailure ? cause : new ArtifactReaderFailure("format", "Compressed PyInstaller member is not a complete zlib stream", { cause });
				output.destroy(failure);
			});
			const completion = (inflate === undefined ? pipeline(source, output) : pipeline(source, inflate, output)).catch((cause) => {
				throw failure ?? cause;
			}).finally(() => {
				options.signal.removeEventListener("abort", onAbort);
				source.removeListener("error", onSourceFailure);
			});
			void completion.catch(() => undefined);
			if (options.signal.aborted) onAbort();
			return {
				output,
				completion
			};
		};
		asError = (cause) => cause instanceof Error ? cause : new ArtifactReaderFailure("format", "PyInstaller member read failed", { cause });
	})))();
}

//#endregion
//#region dist/artifacts/pyinstaller/PythonBytecode.js
var RECONSTRUCTABLE_PYTHON_MAGICS, RECONSTRUCTED_PYTHON_HEADER_LIMITATION, pythonVersionForMagic, reconstructedPycHeader, isHeaderlessPythonCode;
function init_PythonBytecode() {
	return (init_PythonBytecode = __esmMin((() => {
		init_pythonBytecodeIdentity();
		RECONSTRUCTABLE_PYTHON_MAGICS = new Set([
			3394,
			3413,
			3425,
			3439,
			3495,
			3531,
			3571,
			3627
		]);
		RECONSTRUCTED_PYTHON_HEADER_LIMITATION = "Python bytecode header was reconstructed from the archive Python magic; this digest covers the derived file.";
		pythonVersionForMagic = (magic) => {
			if (magic.length !== 4) return undefined;
			const observed = observePythonBytecodePrefix(magic);
			return observed.state === "framed" && RECONSTRUCTABLE_PYTHON_MAGICS.has(observed.magic) ? observed.identity?.pythonVersion : undefined;
		};
		reconstructedPycHeader = (magic) => {
			const header = Buffer.alloc(16);
			magic.copy(header, 0, 0, 4);
			return header;
		};
		isHeaderlessPythonCode = (prefix) => prefix.length === 4 && observePythonBytecodePrefix(prefix).state !== "framed" && (prefix[0] === 99 || prefix[0] === 227);
	})))();
}

//#endregion
//#region dist/artifacts/pyinstaller/PyInstallerPyzStore.js
var MAX_PRIVATE_PYZ_IMAGES, PyInstallerPyzStore;
function init_PyInstallerPyzStore() {
	return (init_PyInstallerPyzStore = __esmMin((() => {
		init_OwnedFileHandle();
		init_RegularFile();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_ArtifactHash();
		init_readArtifactFileChunks();
		init_PyInstallerMemberStream();
		init_CArchiveLayout();
		init_ArtifactFileAdmission();
		init_PythonBytecode();
		MAX_PRIVATE_PYZ_IMAGES = 128;
		PyInstallerPyzStore = class {
			#root;
			#serial = 0;
			#owners = new Map();
			#cleanup = new ArtifactResourceScope();
			#images = new Map();
			reserveImages(count) {
				if (count > MAX_PRIVATE_PYZ_IMAGES) throw new ArtifactReaderFailure("limit", "PyInstaller compressed PYZ images exceed the 128-file private storage budget", { boundary: "capacity" });
			}
			async bytecodeHeader(handle, archiveStart, entry, magic, signal) {
				const unchanged = {
					header: undefined,
					limitation: undefined
				};
				if (magic === undefined) return unchanged;
				if (entry.role === "script") return {
					header: reconstructedPycHeader(magic),
					limitation: undefined
				};
				if (!isCArchivePythonModule(entry)) return unchanged;
				const prefix = await readPyInstallerMemberPrefix(async (active) => (await this.memberSource({
					kind: "carchive",
					archiveStart,
					source: entry,
					header: undefined
				}, handle, active)).source, {
					sourceBytes: entry.compressedSize,
					compressed: entry.compressionFlag === 1,
					expectedBytes: entry.uncompressedSize,
					maxBytes: entry.uncompressedSize,
					signal: signal ?? new AbortController().signal
				}, 4);
				return isHeaderlessPythonCode(prefix) ? {
					header: reconstructedPycHeader(magic),
					limitation: undefined
				} : {
					header: undefined,
					limitation: "CArchive module is not identified as headerless marshal code; its original bytes are preserved without reconstructing a Python bytecode header."
				};
			}
			async spool(handle, archiveStart, entry, signal) {
				abortIfNeeded(signal);
				if (entry.compressedSize === 0) throw new ArtifactReaderFailure("format", "Compressed PYZ image has no zlib bytes");
				this.#root ??= await mkdtemp(join(tmpdir(), "rea-pyz-"));
				const path = join(this.#root, String(this.#serial++));
				const writer = await open(path, "wx", 384);
				this.#retain(path, new OwnedFileHandle(writer));
				abortIfNeeded(signal);
				const source = readArtifactFileChunks(handle, {
					start: archiveStart + entry.offset,
					end: archiveStart + entry.offset + entry.compressedSize - 1,
					signal
				});
				const stream = pyInstallerMemberStream(source, {
					sourceBytes: entry.compressedSize,
					compressed: true,
					header: undefined,
					expectedBytes: entry.uncompressedSize,
					maxBytes: entry.uncompressedSize,
					signal: signal ?? new AbortController().signal
				});
				const copied = this.#writeImage(writer, stream.output, signal);
				const outcomes = await Promise.allSettled([stream.completion, copied]);
				const copy = outcomes[1];
				if (copy?.status === "rejected") throw copy.reason;
				const decoded = outcomes[0];
				if (decoded?.status === "rejected") throw decoded.reason;
				await this.release(writer);
				abortIfNeeded(signal);
				const { handle: opened, initial } = await this.#admit(path, signal);
				this.#images.set(opened, {
					path,
					initial
				});
				return {
					handle: opened,
					start: 0
				};
			}
			async release(handle) {
				const owner = this.#owners.get(handle);
				if (owner === undefined) return;
				const outcome = await this.#cleanup.release(owner);
				if (outcome.kind === "failed") throw outcome.cause;
				this.#owners.delete(handle);
			}
			async memberSource(read, root, signal) {
				let handle = read.kind === "carchive" ? root : read.handle;
				if (handle === undefined) throw new ArtifactReaderFailure("unavailable", "PyInstaller archive is closed");
				const image = read.kind === "pyz" ? this.#images.get(handle) : undefined;
				let verify;
				let close;
				if (image !== undefined) {
					({handle} = await this.#admit(image.path, signal));
					const opened = handle;
					verify = () => this.#verifyImage(opened, image);
					close = async (primary) => {
						try {
							await this.release(opened);
						} catch (cause) {
							throw ArtifactReaderFailure.withCleanup(primary ?? cause, ArtifactReaderFailure.cleanupObservation(cause, image.path));
						}
					};
					await verify();
				}
				abortIfNeeded(signal);
				const start = read.kind === "carchive" ? read.archiveStart + read.source.offset : read.offset;
				const length = read.kind === "carchive" ? read.source.compressedSize : read.length;
				const source = length === 0 ? Readable.from([]) : readArtifactFileChunks(handle, {
					start,
					end: start + length - 1,
					signal
				});
				source.on("error", () => undefined);
				return {
					source,
					...verify === undefined ? {} : { verify },
					...close === undefined ? {} : { close }
				};
			}
			async close() {
				await this.#cleanup.close();
				this.#owners.clear();
				if (this.#root !== undefined) {
					try {
						await rm(this.#root, {
							recursive: true,
							force: true
						});
					} catch (cause) {
						throw ArtifactReaderFailure.withCleanup(cause, ArtifactReaderFailure.cleanupObservation(cause, this.#root));
					}
					this.#root = undefined;
				}
				this.#images.clear();
			}
			async #admit(path, signal) {
				try {
					const source = await openRegularFile(path, {
						symlinks: "reject",
						signal
					});
					this.#retain(path, new OwnedFileHandle(source.handle));
					return source;
				} catch (cause) {
					if (cause instanceof RegularFileAdmissionFailure) this.#retain(path, cause.owner);
					throw artifactFileAdmissionFailure(path, "PyInstaller", cause);
				}
			}
			#retain(path, handle) {
				const owner = {
					kind: "file-handle",
					resource: path,
					handle
				};
				this.#owners.set(handle.handle, owner);
				this.#cleanup.retain(owner);
			}
			async #writeImage(handle, source, signal) {
				let position = 0;
				for await (const chunk of source) {
					if (signal?.aborted) continue;
					let offset = 0;
					try {
						while (offset < chunk.length) {
							const { bytesWritten } = await handle.write(chunk, offset, chunk.length - offset, position);
							if (bytesWritten === 0) throw new ArtifactReaderFailure("io", "Private PYZ write made no progress");
							offset += bytesWritten;
							position += bytesWritten;
							if (signal?.aborted) break;
						}
					} catch (cause) {
						const failure = cause instanceof ArtifactReaderFailure ? cause : new ArtifactReaderFailure("io", "Private PYZ image could not be written", { cause });
						source.destroy(failure);
						throw failure;
					}
				}
				abortIfNeeded(signal);
			}
			async #verifyImage(handle, image) {
				const states = await Promise.all([handle.stat(), lstat(image.path)]);
				if (states.some((state) => !sameRegularFileState(image.initial, state))) throw new ArtifactReaderFailure("integrity", "Private PYZ image changed after parsing");
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/pyinstaller/CArchiveMembers.js
var CRYPTO_KEY_NAME, hasEncryptionMarker, projectStoredMember, projectPyzContainer, projectPyzMember, canonicalMemberPath, sourceByteOffset, pyzMemberPath, projectEntry, sealMember;
function init_CArchiveMembers() {
	return (init_CArchiveMembers = __esmMin((() => {
		init_ArtifactReader();
		init_CArchiveLayout();
		init_PythonBytecode();
		init_PyInstallerMetadata();
		CRYPTO_KEY_NAME = "pyimod00_crypto_key";
		hasEncryptionMarker = (entries) => entries.some((entry) => entry.name === CRYPTO_KEY_NAME && isCArchivePythonModule(entry) && entry.uncompressedSize > 0);
		projectStoredMember = (entry, archiveStart, bytecode, pathDialect) => {
			if (isCArchiveDeclaration(entry)) return {
				entry: projectEntry({
					path: `__pyinstaller__/${entry.role === "runtime-option" ? "runtime-options" : "dependencies"}/${String(entry.index)}`,
					kind: "metadata",
					declaredSize: entry.uncompressedSize,
					compressedSize: entry.compressedSize,
					byteOffset: null,
					limitations: entry.role === "dependency" ? ["Multipackage dependency bytes belong to another executable and remain unresolved."] : [],
					adapterKey: `carchive:${String(entry.index)}:${entry.name}`,
					formatMetadata: cArchiveEntryMetadata(entry)
				}),
				read: undefined
			};
			const { header } = bytecode;
			const path = canonicalMemberPath(entry.name, pathDialect);
			const symlink = entry.role === "symlink";
			const limitations = [];
			if (symlink) limitations.push("PyInstaller symlink target was not read.");
			if (header !== undefined) limitations.push(RECONSTRUCTED_PYTHON_HEADER_LIMITATION);
			if (bytecode.limitation !== undefined) limitations.push(bytecode.limitation);
			const declaredSize = entry.uncompressedSize;
			return {
				entry: projectEntry({
					path,
					kind: symlink ? "symlink" : "file",
					declaredSize,
					compressedSize: entry.compressedSize,
					executable: pathDialect === "posix" && entry.role === "binary",
					byteOffset: sourceByteOffset(entry, archiveStart),
					limitations,
					adapterKey: `carchive:${String(entry.index)}:${entry.name}`,
					formatMetadata: cArchiveEntryMetadata(entry, header)
				}),
				read: {
					kind: "carchive",
					archiveStart,
					source: entry,
					header
				}
			};
		};
		projectPyzContainer = (entry, archiveStart, image, encrypted, pathDialect) => {
			const { archive } = image;
			const path = canonicalMemberPath(entry.name, pathDialect);
			const byteOffset = sourceByteOffset(entry, archiveStart);
			const limitations = [];
			if (archive.kind === "opaque") return {
				entry: projectEntry({
					path,
					declaredSize: entry.uncompressedSize,
					compressedSize: entry.compressedSize,
					byteOffset,
					encrypted: false,
					limitations: [
						...limitations,
						archive.limitation,
						...encrypted ? ["PYZ entries are encrypted and were not decoded."] : []
					],
					adapterKey: `carchive:${String(entry.index)}:${entry.name}`,
					formatMetadata: cArchiveEntryMetadata(entry, undefined, archive, encrypted)
				}),
				read: entry.compressionFlag === 1 ? {
					kind: "pyz",
					handle: image.handle,
					offset: image.start,
					length: entry.uncompressedSize,
					compressed: false,
					uncompressedSize: entry.uncompressedSize,
					header: undefined
				} : {
					kind: "carchive",
					archiveStart,
					source: entry,
					header: undefined
				}
			};
			return {
				entry: projectEntry({
					path,
					kind: "directory",
					declaredSize: entry.uncompressedSize,
					compressedSize: entry.compressedSize,
					byteOffset,
					limitations: [
						...limitations,
						`PyInstaller PYZ sha256 ${archive.sha256}.`,
						...encrypted ? ["PYZ entries are encrypted and were not decoded."] : []
					],
					adapterKey: `carchive:${String(entry.index)}:${entry.name}`,
					formatMetadata: cArchiveEntryMetadata(entry, undefined, archive, encrypted)
				}),
				read: undefined
			};
		};
		projectPyzMember = (container, item, encryptionMarker, pythonMagic, pathDialect, range) => {
			const path = pyzMemberPath(canonicalMemberPath(container.name, pathDialect), item, pathDialect);
			const encrypted = pyzEntryEncrypted(item, encryptionMarker);
			if (item.role === "namespace") return {
				entry: projectEntry({
					path,
					kind: "metadata",
					declaredSize: 0,
					compressedSize: item.length,
					encrypted,
					byteOffset: null,
					limitations: ["Namespace package has no importable bytecode; its declared payload is not materialized.", ...encrypted ? ["PYZ namespace payload is declared encrypted and is not materialized."] : []],
					adapterKey: `pyz:${String(container.index)}:${String(item.index)}:${path}`,
					formatMetadata: pyzEntryMetadata(container, item, undefined, encryptionMarker)
				}),
				read: undefined
			};
			const header = !encrypted && pythonMagic !== undefined && (item.role === "module" || item.role === "package") ? reconstructedPycHeader(pythonMagic) : undefined;
			const limitations = [];
			if (encrypted) limitations.push("PYZ entry is encrypted and was not decoded.");
			if (header !== undefined) limitations.push(RECONSTRUCTED_PYTHON_HEADER_LIMITATION);
			limitations.push("PYZ tables declare compressed lengths; the uncompressed size is unknown until decoding.");
			return {
				entry: projectEntry({
					path,
					declaredSize: null,
					compressedSize: item.length,
					byteOffset: null,
					encrypted,
					limitations,
					adapterKey: `pyz:${String(container.index)}:${String(item.index)}:${path}`,
					formatMetadata: pyzEntryMetadata(container, item, header, encryptionMarker)
				}),
				read: range === undefined ? undefined : {
					kind: "pyz",
					...range,
					compressed: true,
					uncompressedSize: undefined,
					header
				}
			};
		};
		canonicalMemberPath = (storedName, pathDialect) => pathDialect === "windows" ? storedName.replaceAll("\\", "/") : storedName;
		sourceByteOffset = (entry, archiveStart) => entry.compressionFlag === 0 ? archiveStart + entry.offset : null;
		pyzMemberPath = (container, item, pathDialect) => {
			if (item.role === "data") return `${container}/${canonicalMemberPath(item.name, pathDialect)}`;
			const dotted = item.name.replaceAll(".", "/");
			if (item.role === "namespace") return `${container}/${dotted}`;
			if (item.role === "package") return `${container}/${dotted}/__init__.pyc`;
			return `${container}/${dotted}.pyc`;
		};
		projectEntry = (input) => ({
			path: input.path,
			sourcePath: input.formatMetadata.source_name,
			kind: input.kind ?? "file",
			declaredSize: input.declaredSize,
			compressedSize: input.compressedSize,
			executable: input.executable === true,
			encrypted: input.encrypted === true,
			byteOffset: input.byteOffset,
			declaredIntegrity: null,
			unpacked: false,
			limitations: input.limitations,
			adapterKey: input.adapterKey,
			formatMetadata: input.formatMetadata
		});
		sealMember = (member) => ({
			...member,
			entry: copyArtifactEntry(member.entry)
		});
	})))();
}

//#endregion
//#region dist/artifacts/pyinstaller/MarshalSubset.js
var MAX_DEPTH, MAX_NODES, MAX_SEQUENCE, MAX_STRING_BYTES, FLAG_REF, readMarshalSubset, readObject, storeScalar, readSequence, readReference, readShortAscii, readCountedAscii, readAsciiBytes, readUtf8, readByteString, readLong, readBytes, readByte, readInt32, readUint16;
function init_MarshalSubset() {
	return (init_MarshalSubset = __esmMin((() => {
		init_result();
		init_marshalUtf8();
		init_PyInstallerFailure();
		MAX_DEPTH = 16;
		MAX_NODES = 1e5;
		MAX_SEQUENCE = 1e5;
		MAX_STRING_BYTES = 65536;
		FLAG_REF = 128;
		readMarshalSubset = (bytes) => {
			const cursor = {
				bytes,
				offset: 0,
				refs: [],
				depth: 0,
				nodes: 0
			};
			const value = readObject(cursor);
			if (!value.ok) return value;
			if (cursor.offset !== bytes.length) return err(pyInstallerFailure("format", "PYZ marshal value did not consume its table of contents"));
			return value;
		};
		readObject = (cursor) => {
			if (cursor.depth > MAX_DEPTH || cursor.nodes >= MAX_NODES) return err(pyInstallerFailure("limit", "PYZ marshal value exceeds the depth or object bound"));
			cursor.nodes += 1;
			const code = readByte(cursor);
			if (!code.ok) return code;
			const flag = (code.value & FLAG_REF) !== 0;
			const type = code.value & ~FLAG_REF;
			if (type === 114) return readReference(cursor);
			if (type === 105) return storeScalar(cursor, flag, readInt32(cursor));
			if (type === 108) return storeScalar(cursor, flag, readLong(cursor));
			if (type === 122 || type === 90) return storeScalar(cursor, flag, readShortAscii(cursor));
			if (type === 97 || type === 65) return storeScalar(cursor, flag, readCountedAscii(cursor));
			if (type === 116 || type === 117) return storeScalar(cursor, flag, readUtf8(cursor));
			if (type === 115) return storeScalar(cursor, flag, readByteString(cursor));
			if (type === 40) return readSequence(cursor, flag, readInt32(cursor));
			if (type === 41) return readSequence(cursor, flag, readByte(cursor));
			if (type === 91) return readSequence(cursor, flag, readInt32(cursor));
			return err(pyInstallerFailure("format", "PYZ marshal value uses a type outside the supported subset"));
		};
		storeScalar = (cursor, flag, value) => {
			if (!value.ok) return value;
			if (flag) cursor.refs.push(value.value);
			return value;
		};
		readSequence = (cursor, flag, count) => {
			if (!count.ok) return count;
			if (count.value < 0) return err(pyInstallerFailure("format", "PYZ marshal sequence has a negative count"));
			if (count.value > MAX_SEQUENCE) return err(pyInstallerFailure("limit", "PYZ marshal sequence exceeds the supported count"));
			const slot = flag ? cursor.refs.length : undefined;
			if (slot !== undefined) cursor.refs.push(undefined);
			const items = [];
			cursor.depth += 1;
			for (let index = 0; index < count.value; index += 1) {
				const item = readObject(cursor);
				if (!item.ok) return item;
				items.push(item.value);
			}
			cursor.depth -= 1;
			if (slot !== undefined) cursor.refs[slot] = items;
			return ok(items);
		};
		readReference = (cursor) => {
			const index = readInt32(cursor);
			if (!index.ok) return index;
			const value = cursor.refs[index.value];
			if (value === undefined) return err(pyInstallerFailure("format", "PYZ marshal reference does not point at a completed value"));
			return ok(value);
		};
		readShortAscii = (cursor) => {
			const length = readByte(cursor);
			if (!length.ok) return length;
			return readAsciiBytes(cursor, length.value);
		};
		readCountedAscii = (cursor) => {
			const length = readInt32(cursor);
			if (!length.ok) return length;
			return readAsciiBytes(cursor, length.value);
		};
		readAsciiBytes = (cursor, length) => {
			const bytes = readBytes(cursor, length);
			if (!bytes.ok) return bytes;
			if (bytes.value.some((byte) => byte > 127)) return err(pyInstallerFailure("format", "PYZ marshal ASCII string contains a non-ASCII byte"));
			return ok(bytes.value.toString("ascii"));
		};
		readUtf8 = (cursor) => {
			const length = readInt32(cursor);
			if (!length.ok) return length;
			const bytes = readBytes(cursor, length.value);
			if (!bytes.ok) return bytes;
			const value = decodeMarshalUtf8(bytes.value);
			if (!value.ok) return err(pyInstallerFailure("format", "PYZ marshal string is not valid UTF-8"));
			return ok(value.value.text);
		};
		readByteString = (cursor) => {
			const length = readInt32(cursor);
			if (!length.ok) return length;
			const bytes = readBytes(cursor, length.value);
			if (!bytes.ok) return bytes;
			return ok(bytes.value);
		};
		readLong = (cursor) => {
			const digits = readInt32(cursor);
			if (!digits.ok) return digits;
			const count = Math.abs(digits.value);
			if (count > 8) return err(pyInstallerFailure("limit", "PYZ marshal integer exceeds the safe range"));
			let magnitude = 0n;
			let mostSignificantDigit = 0;
			for (let index = 0; index < count; index += 1) {
				const digit = readUint16(cursor);
				if (!digit.ok) return digit;
				if (digit.value > 32767) return err(pyInstallerFailure("format", "PYZ marshal long digit is out of range"));
				mostSignificantDigit = digit.value;
				magnitude += BigInt(digit.value) << BigInt(15 * index);
			}
			if (count > 0 && mostSignificantDigit === 0) return err(pyInstallerFailure("format", "PYZ marshal long is not normalized"));
			if (magnitude > BigInt(Number.MAX_SAFE_INTEGER)) return err(pyInstallerFailure("limit", "PYZ marshal integer exceeds the safe range"));
			const signed = digits.value < 0 ? -Number(magnitude) : Number(magnitude);
			return ok(signed);
		};
		readBytes = (cursor, length) => {
			if (length < 0) return err(pyInstallerFailure("format", "PYZ marshal string has a negative length"));
			if (!Number.isSafeInteger(length) || length > MAX_STRING_BYTES) return err(pyInstallerFailure("limit", "PYZ marshal string exceeds the supported length"));
			const end = cursor.offset + length;
			if (end > cursor.bytes.length) return err(pyInstallerFailure("format", "PYZ marshal value is truncated"));
			const bytes = cursor.bytes.subarray(cursor.offset, end);
			cursor.offset = end;
			return ok(bytes);
		};
		readByte = (cursor) => {
			if (cursor.offset >= cursor.bytes.length) return err(pyInstallerFailure("format", "PYZ marshal value is truncated"));
			const value = cursor.bytes[cursor.offset] ?? 0;
			cursor.offset += 1;
			return ok(value);
		};
		readInt32 = (cursor) => {
			if (cursor.offset + 4 > cursor.bytes.length) return err(pyInstallerFailure("format", "PYZ marshal value is truncated"));
			const value = cursor.bytes.readInt32LE(cursor.offset);
			cursor.offset += 4;
			return ok(value);
		};
		readUint16 = (cursor) => {
			if (cursor.offset + 2 > cursor.bytes.length) return err(pyInstallerFailure("format", "PYZ marshal value is truncated"));
			const value = cursor.bytes.readUInt16LE(cursor.offset);
			cursor.offset += 2;
			return ok(value);
		};
	})))();
}

//#endregion
//#region dist/artifacts/pyinstaller/PyzArchive.js
var PYZ_MAGIC, PYZ_HEADER_BYTES, PYZ_ENTRY_ROLES, MAX_PYZ_TABLE_BYTES, readPyzHeaderFacts, readPyzArchive, parsePyzParts, pyzEntries, onePyzEntry;
function init_PyzArchive() {
	return (init_PyzArchive = __esmMin((() => {
		init_ArtifactHash();
		init_readArtifactFileChunks();
		init_PyInstallerBytes();
		init_result();
		init_MarshalSubset();
		init_PyInstallerFailure();
		init_PythonBytecode();
		PYZ_MAGIC = Buffer.from("PYZ\0");
		PYZ_HEADER_BYTES = 12;
		PYZ_ENTRY_ROLES = [
			"module",
			"package",
			"data",
			"namespace"
		];
		MAX_PYZ_TABLE_BYTES = 16 * 1024 * 1024;
		readPyzHeaderFacts = (header, size) => {
			const pythonMagic = Buffer.from(header.subarray(4, 8));
			const tocOffset = header.readUInt32BE(8);
			return {
				signatureMatches: header.subarray(0, 4).equals(PYZ_MAGIC),
				pythonMagic,
				pythonVersion: pythonVersionForMagic(pythonMagic),
				tocOffset,
				tableBytes: tocOffset >= PYZ_HEADER_BYTES && tocOffset <= size ? size - tocOffset : null
			};
		};
		readPyzArchive = async (handle, start, size, signal) => {
			if (size < PYZ_HEADER_BYTES) return err(pyInstallerFailure("format", "PYZ archive magic does not match"));
			const headerRead = await readPyInstallerBytes(handle, {
				position: start,
				length: PYZ_HEADER_BYTES,
				label: "PYZ header",
				signal
			});
			if (!headerRead.ok) return headerRead;
			const header = readPyzHeaderFacts(headerRead.value, size);
			const tableSize = header.pythonVersion === undefined ? 0 : header.tableBytes ?? 0;
			if (tableSize > 16777216) return err(pyInstallerFailure("limit", "PYZ table exceeds the 16 MiB in-memory table budget"));
			const read = await readPyInstallerBytes(handle, {
				position: start + header.tocOffset,
				length: tableSize,
				label: "PYZ table",
				signal
			});
			if (!read.ok) return read;
			const table = read.value;
			const digest = await hashReadable(readArtifactFileChunks(handle, {
				start,
				end: start + size - 1,
				...signal === undefined ? {} : { signal }
			}), signal);
			if (digest.bytes !== size) return err(pyInstallerFailure("format", "PYZ image extends outside the file"));
			return parsePyzParts(header, table, digest.sha256);
		};
		parsePyzParts = (header, table, sha256) => {
			if (!header.signatureMatches) return err(pyInstallerFailure("format", "PYZ archive magic does not match"));
			const { pythonMagic, pythonVersion, tocOffset } = header;
			if (pythonVersion === undefined) return ok({
				kind: "opaque",
				pythonMagic,
				pythonVersion,
				sha256,
				limitation: `PYZ Python magic ${pythonMagic.toString("hex")} is not in the supported set; the member was left opaque.`
			});
			if (header.tableBytes === null) return err(pyInstallerFailure("format", "PYZ table of contents is outside the archive"));
			const marshalled = readMarshalSubset(table);
			if (!marshalled.ok) {
				if (marshalled.error.reason !== "format") return marshalled;
				return ok({
					kind: "opaque",
					pythonMagic,
					pythonVersion,
					sha256,
					limitation: `PYZ table of contents could not be parsed (${marshalled.error.message}); the member was left opaque.`
				});
			}
			const entries = pyzEntries(marshalled.value, tocOffset, table.length);
			if (!entries.ok) return entries.error.reason === "format" ? ok({
				kind: "opaque",
				pythonMagic,
				pythonVersion,
				sha256,
				limitation: `${entries.error.message}; the member was left opaque.`
			}) : entries;
			return ok({
				kind: "entries",
				pythonMagic,
				pythonVersion,
				sha256,
				entries: entries.value
			});
		};
		pyzEntries = (value, payloadEnd, tableBytes) => {
			if (!Array.isArray(value)) return err(pyInstallerFailure("format", "PYZ table of contents is not a list"));
			const entries = [];
			let nameBytes = 0;
			for (const item of value) {
				const entry = onePyzEntry(item, payloadEnd, entries.length);
				if (!entry.ok) return entry;
				nameBytes += Buffer.byteLength(entry.value.name, "utf8");
				if (nameBytes > tableBytes) return err(pyInstallerFailure("limit", `PYZ table entry names expand past the ${String(tableBytes)}-byte table that stores them`));
				entries.push(entry.value);
			}
			return ok(entries);
		};
		onePyzEntry = (item, payloadEnd, index) => {
			if (!Array.isArray(item) || item.length !== 2) return err(pyInstallerFailure("format", "PYZ table entry is not a name and position pair"));
			const [name, position] = item;
			if (typeof name !== "string" || !Array.isArray(position) || position.length !== 3) return err(pyInstallerFailure("format", "PYZ table entry is not a name, type, offset, and length"));
			const [typeCode, offset, length] = position;
			if (!Number.isSafeInteger(typeCode) || !Number.isSafeInteger(offset) || !Number.isSafeInteger(length)) return err(pyInstallerFailure("format", "PYZ table entry positions are not integers"));
			const role = PYZ_ENTRY_ROLES[typeCode];
			if (role === undefined) return err(pyInstallerFailure("format", `PYZ table entry type ${String(typeCode)} is not a known module, package, data, or namespace code`));
			if (role !== "namespace" && length === 0) return err(pyInstallerFailure("format", `PYZ entry at table index ${String(index)} has no compressed bytes`));
			if (length < 0 || offset < 0 || offset > payloadEnd || length > payloadEnd - offset || length > 0 && offset < PYZ_HEADER_BYTES) return err(pyInstallerFailure("integrity", `PYZ entry at table index ${String(index)} extends outside the archive payload region`));
			return ok({
				index,
				name,
				typeCode,
				offset,
				length,
				compressionFlag: length === 0 ? 0 : 1,
				role
			});
		};
	})))();
}

//#endregion
//#region dist/artifacts/PyInstallerArtifactReader.js
var MAX_PARSED_FACT_BYTES, MAX_RETAINED_ENTRY_BYTES, RECORD_OWNERSHIP_RESERVATION, PATH_COMPONENT_RESERVATION, carrierPathDialect, PyInstallerArtifactReader, failure;
function init_PyInstallerArtifactReader() {
	return (init_PyInstallerArtifactReader = __esmMin((() => {
		init_jsonValueByteLength();
		init_ArtifactPaths();
		init_PyInstallerMetadata();
		init_artifactExpansionBudget();
		init_ArtifactReader();
		init_ArtifactHash();
		init_ArtifactFileSource();
		init_ArtifactResourceScope();
		init_dosMz();
		init_machoContainer();
		init_ArtifactClassificationProbe();
		init_PyInstallerPyzStore();
		init_PyInstallerMemberStream();
		init_CArchiveLayout();
		init_CArchiveMembers();
		init_PyzArchive();
		init_PyInstallerBytes();
		MAX_PARSED_FACT_BYTES = 32 * 1024 * 1024;
		MAX_RETAINED_ENTRY_BYTES = 64 * 1024 * 1024;
		RECORD_OWNERSHIP_RESERVATION = 256;
		PATH_COMPONENT_RESERVATION = 1024;
		carrierPathDialect = async (handle, fileSize, signal) => {
			const prefixRead = await readPyInstallerBytes(handle, {
				position: 0,
				length: Math.min(fileSize, ARTIFACT_CLASSIFICATION_PREFIX_BYTES),
				label: "carrier header",
				signal
			});
			if (!prefixRead.ok) return "unknown";
			const prefix = prefixRead.value;
			let windowsHeader = parseMzHeaderEvidence(prefix, fileSize).windowsHeader;
			if (windowsHeader.state === "signature-needed") {
				const signatureRead = await readPyInstallerBytes(handle, {
					position: windowsHeader.offset,
					length: 4,
					label: "PE signature",
					signal
				});
				if (!signatureRead.ok) return "unknown";
				windowsHeader = parseMzHeaderEvidence(prefix, fileSize, {
					offset: windowsHeader.offset,
					bytes: signatureRead.value
				}).windowsHeader;
			}
			if (windowsHeader.state === "declared") return windowsHeader.signature === "PE" ? "windows" : "unknown";
			if (prefix.subarray(0, 4).equals(Buffer.from([
				127,
				69,
				76,
				70
			]))) return "posix";
			const thinMachO = readMachoHeaderPrefixFacts(prefix);
			if (thinMachO.identity !== null) return "posix";
			if (readFatContainerHeader(prefix, fileSize).state === "parsed") return "posix";
			return "unknown";
		};
		PyInstallerArtifactReader = class {
			format = "pyinstaller";
			#source;
			#admission;
			#closed = false;
			#scope = new ArtifactResourceScope();
			#cleanup = new ArtifactResourceScope();
			#lifecycle = new AbortController();
			#loaded;
			#budget = 0;
			#charged = 0;
			#parsedFactBytes = 0;
			#retainedEntryBytes = 0;
			#metadata;
			#pyzStore = new PyInstallerPyzStore();
			#members = new Map();
			#openedPyzSizes = new Map();
			constructor(path, source) {
				if (source !== undefined && "kind" in source) {
					this.#admission = source;
					this.#source = new ArtifactFileSource(path, "PyInstaller", source.source);
				} else {
					this.#source = new ArtifactFileSource(path, "PyInstaller", source);
				}
				this.#cleanup.retain({
					kind: "lease",
					resource: "PyInstaller private PYZ images",
					lease: { release: () => this.#pyzStore.close() }
				});
				this.#cleanup.retain({
					kind: "lease",
					resource: path,
					lease: { release: () => this.#source.close() }
				});
			}
			formatMetadata() {
				return this.#metadata === undefined ? undefined : { ...this.#metadata };
			}
			async prepareContainer(expectedSha256, signal) {
				const active = this.#signal(signal);
				await this.#scope.run(async () => {
					await this.#openHandle(active);
					await this.#source.bindSelectedPathSha256(expectedSha256, active);
				});
			}
			async *entries(signal, options) {
				const active = this.#signal(signal);
				const loaded = await this.#scope.run(async () => {
					const value = await this.#load(active);
					await this.#source.readSelectedPath();
					this.#members.clear();
					return value;
				});
				options?.onCoverage?.(loaded.traversal);
				for (const member of loaded.members) {
					abortIfNeeded(active);
					const sealed = sealMember(member);
					this.#members.set(sealed.entry.adapterKey, sealed);
					yield sealed.entry;
				}
			}
			async open(entry, signal) {
				const active = this.#signal(signal);
				return this.#scope.run(async () => {
					const stored = this.#members.get(entry.adapterKey);
					if (stored === undefined || !sameArtifactEntry(entry, stored.entry)) throw new ArtifactReaderFailure("integrity", `PyInstaller entry was not produced by this reader: ${entry.path}`);
					if (entry.kind !== "file") throw new ArtifactReaderFailure("format", `PyInstaller entry is not a regular file: ${entry.path}`);
					if (entry.encrypted) throw new ArtifactReaderFailure("unavailable", `PYZ entry is encrypted and was not decoded: ${entry.path}`);
					const read = stored.read;
					if (read === undefined) throw new ArtifactReaderFailure("format", `PyInstaller entry has no readable bytes: ${entry.path}`);
					const { handle } = await this.#source.readSelectedPath();
					const knownSize = read.kind === "pyz" ? read.uncompressedSize ?? this.#openedPyzSizes.get(entry.adapterKey) : undefined;
					if (read.kind === "pyz" && knownSize === undefined) this.#charge(read.header?.length ?? 0);
					const parts = await this.#pyzStore.memberSource(read, handle, active);
					if (active.aborted) {
						parts.source.destroy();
						await finished(parts.source, { cleanup: true }).catch(() => undefined);
						abortIfNeeded(active);
					}
					let closeAttempt;
					const closeSource = (primary) => closeAttempt ??= parts.close?.(primary);
					const stream = pyInstallerMemberStream(parts.source, {
						sourceBytes: read.kind === "carchive" ? read.source.compressedSize : read.length,
						compressed: read.kind === "pyz" ? read.compressed : read.source.compressionFlag === 1,
						header: read.header,
						expectedBytes: read.kind === "carchive" ? read.source.uncompressedSize : knownSize,
						maxBytes: read.kind === "carchive" ? read.source.uncompressedSize : knownSize ?? this.#budget - this.#charged,
						signal: active,
						...read.kind === "pyz" && knownSize === undefined ? { charge: (bytes) => this.#charge(bytes) } : {},
						complete: async (bytes) => {
							try {
								await parts.verify?.();
								await this.#source.readSelectedPath();
								abortIfNeeded(active);
							} catch (cause) {
								await closeSource(cause);
								throw cause;
							}
							await closeSource();
							abortIfNeeded(active);
							if (read.kind === "pyz" && knownSize === undefined) this.#openedPyzSizes.set(entry.adapterKey, bytes);
						}
					});
					void this.#scope.run(async () => {
						let primary;
						try {
							await stream.completion;
						} catch (cause) {
							primary = cause;
						}
						await closeSource(primary);
						if (primary !== undefined) throw primary;
					}).catch((cause) => stream.output.destroy(cause instanceof Error ? cause : new Error("PyInstaller stream failed", { cause })));
					return stream.output;
				});
			}
			provenance() {
				return [];
			}
			async close() {
				this.#closed = true;
				const closing = new ArtifactReaderFailure("unavailable", "PyInstaller reader closed");
				this.#lifecycle.abort(closing);
				await this.#scope.close();
				await this.#cleanup.close();
				this.#closed = true;
				this.#loaded = undefined;
				this.#admission = undefined;
				this.#members.clear();
				this.#openedPyzSizes.clear();
			}
			#signal(signal) {
				abortIfNeeded(signal);
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "PyInstaller archive is closed");
				return signal === undefined ? this.#lifecycle.signal : AbortSignal.any([signal, this.#lifecycle.signal]);
			}
			async #load(signal) {
				this.#loaded ??= this.#parse(signal);
				return this.#loaded;
			}
			async #parse(signal) {
				await this.#openHandle(signal);
				const { handle, initial } = await this.#source.readSelectedPath();
				const size = initial.size;
				const pathDialect = this.#admission?.carrierPathDialect ?? await carrierPathDialect(handle, size, signal);
				const cookie = this.#admission?.cookie ?? await this.#cookie(handle, size, signal);
				this.#budget = artifactExpansionBudgetBytes(cookie.packageLength);
				const toc = await this.#toc(handle, cookie, signal);
				for (const entry of toc) {
					this.#charge(entry.uncompressedSize);
					this.#reserveMetadata({ ...entry }, false);
				}
				const images = await this.#pyzImages(handle, cookie, toc, signal);
				const magic = scriptPythonMagic(cookie, [...images.values()].map((image) => image.archive));
				const encrypted = hasEncryptionMarker(toc);
				const members = await this.#project(toc, cookie, images, magic, encrypted, pathDialect, signal);
				for (const member of members) if (member.read?.kind === "carchive") this.#charge(member.read.header?.length ?? 0);
				await this.#source.readSelectedPath();
				this.#admission = undefined;
				this.#metadata = cookieMetadata(cookie, toc, encrypted);
				let opaqueImages = 0;
				for (const image of images.values()) if (image.archive.kind === "opaque") opaqueImages++;
				return {
					members,
					traversal: {
						status: opaqueImages === 0 ? "complete" : "unknown",
						limitations: opaqueImages === 0 ? [] : [`${String(opaqueImages)} PYZ archives remain opaque; module traversal is unknown. See opaque PYZ occurrences for source magic and per-archive limitations.`]
					}
				};
			}
			async #openHandle(signal) {
				abortIfNeeded(signal);
				if (this.#closed) throw new ArtifactReaderFailure("unavailable", "PyInstaller archive is closed");
				let handle;
				try {
					({handle} = await this.#source.read(this.#lifecycle.signal));
				} catch (cause) {
					if (cause instanceof ArtifactReaderFailure && cause.reason === "cancelled" && signal?.aborted) throw new ArtifactReaderFailure("cancelled", cause.message, {
						cause: signal.reason,
						cleanup: cause.cleanup,
						cleanupLeases: cause.cleanupLeases
					});
					throw cause;
				}
				abortIfNeeded(signal);
				return handle;
			}
			async #cookie(handle, size, signal) {
				const found = await observePyInstallerCookie(handle, size, signal);
				if (!found.ok) throw failure(found.error);
				const observed = found.value;
				if (observed.state === "absent") throw new ArtifactReaderFailure("format", "PyInstaller CArchive cookie was not found");
				if (observed.state === "rejected-candidates") throw failure(observed.failure);
				return observed.cookie;
			}
			async #toc(handle, cookie, signal) {
				const toc = await readCArchiveToc(handle, cookie, signal);
				if (!toc.ok) throw failure(toc.error);
				return toc.value;
			}
			async #pyzImages(handle, cookie, toc, signal) {
				const images = new Map();
				this.#pyzStore.reserveImages(toc.reduce((count, entry) => count + (entry.role === "pyz" && entry.compressionFlag === 1 ? 1 : 0), 0));
				for (const entry of toc) {
					if (entry.role !== "pyz") continue;
					abortIfNeeded(signal);
					const spooled = entry.compressionFlag === 0 ? undefined : await this.#pyzStore.spool(handle, cookie.archiveStart, entry, signal);
					const source = spooled ?? {
						handle,
						start: cookie.archiveStart + entry.offset
					};
					const parsed = await readPyzArchive(source.handle, source.start, entry.uncompressedSize, signal);
					if (!parsed.ok) throw failure(parsed.error);
					if (parsed.value.kind === "entries") for (const item of parsed.value.entries) this.#reserveMetadata({
						...item,
						container: entry.name
					}, false);
					if (spooled !== undefined) await this.#pyzStore.release(spooled.handle);
					images.set(entry, {
						archive: parsed.value,
						handle: source.handle,
						start: source.start
					});
				}
				return images;
			}
			async #project(toc, cookie, images, magic, encrypted, pathDialect, signal) {
				const handle = await this.#openHandle(signal);
				const members = [];
				const append = (member) => {
					this.#reservePathComponents(member.entry.path);
					const entry = {
						...member.entry,
						path: normalizeArtifactPath(member.entry.path)
					};
					this.#reserveMetadata({
						path: entry.path,
						source_path: entry.sourcePath ?? null,
						adapter_key: entry.adapterKey,
						format_metadata: entry.formatMetadata ?? null,
						limitations: [...entry.limitations]
					}, true);
					members.push({
						...member,
						entry
					});
				};
				for (const entry of toc) {
					if (members.length % 256 === 0) await setImmediate();
					abortIfNeeded(signal);
					const image = entry.role === "pyz" ? images.get(entry) : undefined;
					if (image === undefined) {
						const bytecode = await this.#pyzStore.bytecodeHeader(handle, cookie.archiveStart, entry, magic, signal);
						append(projectStoredMember(entry, cookie.archiveStart, bytecode, pathDialect));
						continue;
					}
					append(projectPyzContainer(entry, cookie.archiveStart, image, encrypted, pathDialect));
					if (image.archive.kind !== "entries") continue;
					for (const item of image.archive.entries) {
						if (members.length % 256 === 0) await setImmediate();
						abortIfNeeded(signal);
						append(projectPyzMember(entry, item, encrypted, image.archive.pythonMagic, pathDialect, item.role === "namespace" || encrypted ? undefined : {
							handle: image.handle,
							offset: image.start + item.offset,
							length: item.length
						}));
					}
				}
				return members;
			}
			#reservePathComponents(path) {
				const remaining = MAX_RETAINED_ENTRY_BYTES - this.#retainedEntryBytes;
				const componentCost = PATH_COMPONENT_RESERVATION + 6 * jsonValueByteLength(path);
				let reservation = componentCost;
				for (let index = 0; index < path.length && reservation <= remaining; index++) if (path.charCodeAt(index) === 47) reservation += componentCost;
				if (reservation > remaining) throw new ArtifactReaderFailure("limit", "PyInstaller paths exceed their retained namespace budget", { boundary: "memory" });
				this.#retainedEntryBytes += reservation;
			}
			#reserveMetadata(value, projected) {
				const used = projected ? this.#retainedEntryBytes : this.#parsedFactBytes;
				const limit = projected ? MAX_RETAINED_ENTRY_BYTES : MAX_PARSED_FACT_BYTES;
				const remaining = limit - used - RECORD_OWNERSHIP_RESERVATION;
				const bytes = remaining < 0 ? 0 : jsonValueByteLength(value, remaining);
				if (remaining < 0 || bytes > remaining) throw new ArtifactReaderFailure("limit", "PyInstaller directory facts exceed their retained metadata budget", { boundary: "memory" });
				if (projected) this.#retainedEntryBytes += bytes + RECORD_OWNERSHIP_RESERVATION;
				else this.#parsedFactBytes += bytes + RECORD_OWNERSHIP_RESERVATION;
			}
			#charge(bytes) {
				if (!Number.isSafeInteger(bytes) || bytes < 0 || this.#charged + bytes > this.#budget) throw new ArtifactReaderFailure("limit", `PyInstaller members declare ${String(this.#charged + Math.max(0, bytes))} uncompressed bytes, exceeding the decompression budget`);
				this.#charged += bytes;
			}
		};
		failure = (error) => new ArtifactReaderFailure(error.reason, error.message);
	})))();
}

//#endregion
//#region dist/artifacts/Uf2ArtifactReader.js
var familyDirectory, uf2Regions, Uf2ArtifactReader;
function init_Uf2ArtifactReader() {
	return (init_Uf2ArtifactReader = __esmMin((() => {
		init_uf2();
		init_DecodedRegionArtifactReader();
		familyDirectory = (familyId) => familyId === null ? "no-family" : `family-0x${familyId.toString(16).padStart(8, "0")}`;
		uf2Regions = {
			label: "UF2",
			keyPrefix: "uf2",
			createDecoder: createUf2Decoder,
			describe: (image) => ({
				metadata: image.metadata,
				regions: image.regions.map((region) => ({
					path: `${familyDirectory(region.familyId)}/${regionFileName(region.start, region.end)}`,
					byteOffset: null,
					formatMetadata: {
						kind: "uf2-region",
						family_id: region.familyId,
						family_name: region.familyName,
						start_address: region.start,
						end_address: region.end,
						length: region.bytes.length,
						block_count: region.blockCount,
						first_file_block: region.firstFileBlock,
						last_file_block: region.lastFileBlock
					},
					bytes: region.bytes
				})),
				...image.complete && image.limitations.length === 0 ? {} : { coverage: {
					status: image.complete ? "complete" : "unknown",
					limitations: image.limitations
				} }
			})
		};
		Uf2ArtifactReader = class extends DecodedRegionArtifactReader {
			constructor(path, admitted) {
				super(path, "uf2", uf2Regions, admitted);
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/UImageArtifactReader.js
var PAYLOAD_PATH, READ_CHUNK_BYTES, UImageArtifactReader, formatFailure, parseFailure, entryFor, toMetadata;
function init_UImageArtifactReader() {
	return (init_UImageArtifactReader = __esmMin((() => {
		init_ArtifactFileRange();
		init_ArtifactFileSource();
		init_ArtifactFileOperation();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_readFileHandleChunks();
		init_uimageFormat();
		PAYLOAD_PATH = "payload.bin";
		READ_CHUNK_BYTES = 64 * 1024;
		UImageArtifactReader = class {
			format = "uimage";
			#scope = new ArtifactResourceScope();
			#entries = new Map();
			#streams = new Set();
			#source;
			#prepared;
			#header;
			#closing = false;
			constructor(path, admitted) {
				this.#source = new ArtifactFileSource(path, "U-Boot uImage", admitted);
			}
			formatMetadata() {
				return this.#header === undefined ? undefined : { ...this.#header };
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
				this.#assertOpen(signal);
				options?.onCoverage?.({
					status: "complete",
					limitations: this.#header !== undefined && hasUImageSizeTable(this.#header.type) ? ["Multi-image sub-images are split from the stored size table; the payload entry retains the full stored bytes."] : []
				});
				let index = 0;
				for (const entry of this.#entries.values()) {
					if (index % 256 === 0) await setImmediate();
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
					if (stored === undefined || !sameArtifactEntry(entry, stored)) throw new ArtifactReaderFailure("integrity", "uImage entry does not match its owning inventory");
					const { handle } = await this.#source.read(signal);
					this.#assertOpen(signal);
					const source = stored.declaredSize === 0 ? Readable.from([]) : readFileHandleChunks(handle, {
						start: stored.byteOffset,
						end: stored.byteOffset + stored.declaredSize - 1,
						signal,
						cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", "uImage read cancelled", { cause: reason })
					});
					const output = this.#memberStream(stored, signal);
					output.on("error", () => undefined);
					this.#streams.add(output);
					let producerComplete = false;
					const onAbort = () => {
						if (!producerComplete || output.destroyed) return;
						output.destroy(new ArtifactReaderFailure("cancelled", "uImage read cancelled", { cause: signal?.reason }));
					};
					const retired = new Promise((resolve) => {
						output.once("close", () => {
							this.#streams.delete(output);
							signal?.removeEventListener("abort", onAbort);
							resolve();
						});
					});
					signal?.addEventListener("abort", onAbort, { once: true });
					if (signal?.aborted) onAbort();
					void this.#scope.run(async () => {
						await Promise.all([new Promise((resolve) => pipeline$1(source, output, () => {
							producerComplete = true;
							if (signal?.aborted) onAbort();
							resolve();
						})), retired]);
					}).catch((cause) => output.destroy(cause instanceof Error ? cause : new Error("uImage stream ownership failed", { cause })));
					return output;
				});
			}
			async close() {
				this.#closing = true;
				for (const stream of this.#streams) stream.destroy(new ArtifactReaderFailure("unavailable", "uImage reader closed"));
				await this.#scope.close();
				await this.#source.close();
				this.#entries.clear();
			}
			provenance() {
				return [];
			}
			#assertOpen(signal) {
				assertArtifactReadActive(signal);
				if (this.#closing) throw new ArtifactReaderFailure("unavailable", "uImage reader closed");
			}
			async #prepare(signal) {
				const { handle, initial } = await this.#source.read(signal);
				const headerBytes = await readArtifactFileBytes(handle, 0, Math.min(initial.size, 64), initial.size, signal);
				const fields = parseUImageHeaderFields(headerBytes);
				if (!fields.ok) throw parseFailure(fields.error);
				const header = fields.value;
				if (initial.size < 64 + header.payloadSize) throw formatFailure(`uImage payload is truncated: header declares ${header.payloadSize} payload bytes but only ${initial.size - 64} follow the header`);
				let dataCrc32 = 0;
				let read = 0;
				let subImages = [];
				if (hasUImageSizeTable(header.type)) {
					const tablePrefix = await readArtifactFileBytes(handle, 64, Math.min(header.payloadSize, UIMAGE_MULTI_TABLE_WINDOW), initial.size, signal);
					const parsed = parseMultiImageTable(tablePrefix, header.payloadSize);
					if (!parsed.ok) throw parseFailure(parsed.error);
					subImages = parsed.value;
					dataCrc32 = crc32(tablePrefix);
					read = tablePrefix.length;
				}
				while (read < header.payloadSize) {
					this.#assertOpen(signal);
					const chunk = await readArtifactFileBytes(handle, 64 + read, Math.min(READ_CHUNK_BYTES, header.payloadSize - read), initial.size, signal);
					dataCrc32 = crc32(chunk, dataCrc32);
					read += chunk.length;
				}
				if (dataCrc32 !== header.dataCrc32) throw formatFailure(`uImage data CRC32 mismatch: declared 0x${header.dataCrc32.toString(16)}, computed 0x${dataCrc32.toString(16)}`);
				this.#header = toMetadata(header, subImages.length);
				const payload = entryFor("payload", 0, {
					byteOffset: 64,
					declaredSize: header.payloadSize
				});
				this.#entries.set(payload.adapterKey, payload);
				for (const sub of subImages) {
					const entry = entryFor("sub-image", sub.index, sub);
					this.#entries.set(entry.adapterKey, entry);
				}
			}
			#memberStream(entry, signal) {
				let bytes = 0;
				const check = async () => {
					if (bytes !== entry.declaredSize) throw formatFailure(`member ended early: ${entry.path}`);
					await this.#source.read(signal);
				};
				return new Transform({
					transform(chunk, _encoding, callback) {
						bytes += chunk.length;
						callback(null, chunk);
					},
					flush(callback) {
						void check().then(() => callback(), (cause) => callback(cause instanceof Error ? cause : new Error("uImage read failed", { cause })));
					}
				});
			}
		};
		formatFailure = (detail, options) => new ArtifactReaderFailure("format", `uImage is malformed: ${detail}`, options);
		parseFailure = (failure) => failure._tag === "UImageCapacityFailure" ? new ArtifactReaderFailure("limit", failure.message, {
			boundary: "capacity",
			cause: failure
		}) : formatFailure(failure.message, { cause: failure });
		entryFor = (role, index, range) => {
			const payload = role === "payload";
			const path = payload ? PAYLOAD_PATH : `image-${String(index)}.bin`;
			const adapterKey = payload ? "uimage:payload" : `uimage:image-${String(index)}`;
			return {
				path,
				kind: "file",
				declaredSize: range.declaredSize,
				compressedSize: null,
				executable: false,
				encrypted: false,
				byteOffset: range.byteOffset,
				declaredIntegrity: null,
				unpacked: false,
				limitations: [],
				adapterKey,
				formatMetadata: {
					kind: "uimage-entry",
					role,
					index
				},
				sourcePath: path
			};
		};
		toMetadata = (facts, subImageCount) => ({
			kind: "uimage",
			magic: UIMAGE_MAGIC,
			timestamp: facts.timestamp,
			timestamp_iso: facts.timestampIso,
			payload_size: facts.payloadSize,
			load_address: facts.loadAddress,
			entry_point: facts.entryPoint,
			header_crc32: facts.headerCrc32,
			data_crc32: facts.dataCrc32,
			crc_verified: true,
			os: facts.os,
			os_name: facts.osName,
			arch: facts.arch,
			arch_name: facts.archName,
			type: facts.type,
			type_name: facts.typeName,
			compression: facts.compression,
			compression_name: facts.compressionName,
			name: facts.name,
			name_bytes_hex: facts.nameBytesHex,
			sub_image_count: subImageCount
		});
	})))();
}

//#endregion
//#region dist/artifacts/UnityFsStructures.js
var MAX_BLOCK_UNCOMPRESSED_BYTES, MAX_BLOCK_ENCODED_BYTES, MAX_TABLE_BYTES$1, DIRECTORY_BUDGET_BYTES$1, directoryLimit, UnityFsDirectoryBudget, HEADER_PREFIX_MAX, UTF8$1, unityFsFormatFailure, align16, readUnityFsHeader, decodeBlocksInfoTable, decodeUnityFsLz4, parseBlocks, parseNodes, resolveDataStart, readUnityFsBlocksInfo;
function init_UnityFsStructures() {
	return (init_UnityFsStructures = __esmMin((() => {
		init_ArtifactReader();
		init_ArtifactFileRange();
		init_Lz4Block();
		init_BinaryContainer();
		init_ArtifactFileOperation();
		init_unityfsFormat();
		MAX_BLOCK_UNCOMPRESSED_BYTES = 64 * 1024 * 1024;
		MAX_BLOCK_ENCODED_BYTES = MAX_BLOCK_UNCOMPRESSED_BYTES + Math.floor(MAX_BLOCK_UNCOMPRESSED_BYTES / 255) + 16;
		MAX_TABLE_BYTES$1 = 16 * 1024 * 1024;
		DIRECTORY_BUDGET_BYTES$1 = 64 * 1024 * 1024;
		directoryLimit = () => new ArtifactReaderFailure("limit", "UnityFS directory exceeds its 16 MiB buffer or 64 MiB representation budget", { boundary: "memory" });
		UnityFsDirectoryBudget = class {
			#remaining = DIRECTORY_BUDGET_BYTES$1;
			reserve(bytes) {
				if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.#remaining) throw directoryLimit();
				this.#remaining -= bytes;
			}
		};
		HEADER_PREFIX_MAX = 8 + 4 + UNITYFS_HEADER_STRING_MAX * 2 + 20;
		UTF8$1 = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
		unityFsFormatFailure = (detail) => new ArtifactReaderFailure("format", `UnityFS is malformed: ${detail}`);
		align16 = (value) => value + 15 & ~15;
		readUnityFsHeader = async (handle, size, signal) => {
			const prefix = await readArtifactFileBytes(handle, 0, Math.min(size, HEADER_PREFIX_MAX), size, signal);
			if (prefix.length < 20 || !prefix.subarray(0, 8).equals(UNITYFS_SIGNATURE)) return undefined;
			const facts = readUnityFsHeaderFacts(prefix);
			if (facts === undefined) throw unityFsFormatFailure("header is truncated or exceeds its bounds");
			if (facts.formatVersion < 6 || facts.formatVersion > 8) throw new ArtifactReaderFailure("unavailable", `UnityFS format ${String(facts.formatVersion)} is unsupported; ${String(6)}-${String(8)} are supported`);
			if (facts.declaredSize > BigInt(size)) throw unityFsFormatFailure("declared size exceeds the file");
			const blocksInfoAtEnd = (facts.flags & 128) !== 0;
			if (blocksInfoAtEnd && facts.compressedBlocksInfoSize > size) throw unityFsFormatFailure("declared blocks-info exceeds the file");
			const compression = facts.flags & 63;
			const common = {
				formatVersion: facts.formatVersion,
				playerVersion: facts.playerVersion,
				engineVersion: facts.engineVersion,
				declaredSize: Number(facts.declaredSize),
				flags: facts.flags,
				compressedBlocksInfoSize: facts.compressedBlocksInfoSize,
				uncompressedBlocksInfoSize: facts.uncompressedBlocksInfoSize,
				blocksInfoAtEnd,
				compression
			};
			const layout = unityFsLayoutFlags(facts.formatVersion, facts.engineVersion, facts.flags);
			if (layout.encrypted === true) return {
				...common,
				layout: { status: "encrypted" }
			};
			if (layout.encrypted === undefined || layout.headerAligned === undefined || layout.dataPadding === undefined) return {
				...common,
				layout: { status: "unsupported-layout" }
			};
			if (compression !== 0 && compression !== 2 && compression !== 3) return {
				...common,
				layout: { status: "unsupported-compression" }
			};
			const position = layout.headerAligned ? align16(facts.afterFixed) : facts.afterFixed;
			return {
				...common,
				layout: {
					status: "available",
					afterHeader: position,
					blocksInfoOffset: blocksInfoAtEnd ? size - facts.compressedBlocksInfoSize : position,
					dataPadding: layout.dataPadding
				}
			};
		};
		decodeBlocksInfoTable = async (header, compressed, signal) => {
			const compression = header.compression;
			if (compression === 0) {
				if (compressed.length !== header.uncompressedBlocksInfoSize) throw unityFsFormatFailure("plain directory size disagrees with its declaration");
				return compressed;
			}
			if (compression === 2 || compression === 3) return decodeUnityFsLz4(compressed, header.uncompressedBlocksInfoSize, signal);
			throw new ArtifactReaderFailure("unavailable", `UnityFS blocks-info compression ${String(compression)} is unsupported`);
		};
		decodeUnityFsLz4 = async (encoded, expected, signal) => {
			try {
				return await decodeLz4Block(encoded, expected, signal);
			} catch (cause) {
				if (cause instanceof ArtifactReaderFailure) throw cause;
				if (cause instanceof BinaryResourceFailure) throw new ArtifactReaderFailure("limit", "UnityFS LZ4 exceeds the decoder memory budget", {
					cause,
					boundary: "memory"
				});
				if (cause instanceof BinaryFormatFailure) throw new ArtifactReaderFailure("format", "UnityFS is malformed: LZ4 block does not decode to its declared size", { cause });
				throw cause;
			}
		};
		parseBlocks = async (table, budget, signal) => {
			if (table.length < 24) throw unityFsFormatFailure("blocks-info table is truncated");
			const blockCount = table.readUInt32BE(16);
			if (20 + blockCount * 10 + 4 > table.length) throw unityFsFormatFailure("declared block count exceeds the table");
			budget.reserve(blockCount * 256);
			const blocks = [];
			let cursor = 20;
			let compressedStart = 0;
			let streamStart = 0;
			let unavailableCount = 0;
			for (let index = 0; index < blockCount; index++) {
				if (index % 256 === 0) await setImmediate();
				assertArtifactReadActive(signal);
				const uncompressedSize = table.readUInt32BE(cursor);
				const compressedSize = table.readUInt32BE(cursor + 4);
				const flags = table.readUInt16BE(cursor + 8);
				const compression = flags & 63;
				cursor += 10;
				const lz4 = compression === 2 || compression === 3;
				if (lz4 && (uncompressedSize > MAX_BLOCK_UNCOMPRESSED_BYTES || compressedSize > MAX_BLOCK_ENCODED_BYTES)) throw new ArtifactReaderFailure("limit", "UnityFS LZ4 block exceeds its 64 MiB decoded or bounded encoded buffer budget", { boundary: "memory" });
				if (compression === 0 && compressedSize !== uncompressedSize) throw unityFsFormatFailure("plain block size disagrees with its declaration");
				if (uncompressedSize > 0 && compression !== 0 && !lz4) unavailableCount++;
				if (compression !== 0 && compressedSize === 0) throw unityFsFormatFailure("compressed block declares no bytes");
				blocks.push({
					uncompressedSize,
					compressedSize,
					flags,
					compression,
					unavailableCount,
					compressedStart,
					streamStart
				});
				compressedStart += compressedSize;
				streamStart += uncompressedSize;
			}
			return blocks;
		};
		parseNodes = async (table, blocks, budget, signal) => {
			let cursor = 20 + blocks.length * 10;
			if (cursor + 4 > table.length) throw unityFsFormatFailure("node count is missing from the table");
			const nodeCount = table.readUInt32BE(cursor);
			cursor += 4;
			if (cursor + nodeCount * 21 > table.length) throw unityFsFormatFailure("declared node count exceeds the table");
			budget.reserve(nodeCount * 512);
			const streamSize = blocks.length === 0 ? 0 : (blocks[blocks.length - 1]?.streamStart ?? 0) + (blocks[blocks.length - 1]?.uncompressedSize ?? 0);
			const nodes = [];
			for (let index = 0; index < nodeCount; index++) {
				if (index % 256 === 0) await setImmediate();
				assertArtifactReadActive(signal);
				if (cursor + 20 > table.length) throw unityFsFormatFailure("node fixed fields are truncated");
				const offsetBig = table.readBigUInt64BE(cursor);
				const sizeBig = table.readBigUInt64BE(cursor + 8);
				const flags = table.readUInt32BE(cursor + 16);
				cursor += 20;
				const nameEnd = table.indexOf(0, cursor);
				if (nameEnd === -1) throw unityFsFormatFailure("node path is unterminated");
				budget.reserve((nameEnd - cursor) * 24);
				let path;
				try {
					path = UTF8$1.decode(table.subarray(cursor, nameEnd));
				} catch (cause) {
					throw new ArtifactReaderFailure("format", "UnityFS node path is not valid UTF-8", { cause });
				}
				cursor = nameEnd + 1;
				if (path.length === 0) throw unityFsFormatFailure("empty member path");
				if (offsetBig > BigInt(streamSize) || sizeBig > BigInt(streamSize) - offsetBig) throw unityFsFormatFailure(`member exceeds the stream: ${path}`);
				nodes.push({
					offset: Number(offsetBig),
					size: Number(sizeBig),
					flags,
					path
				});
			}
			return nodes;
		};
		resolveDataStart = (header, blocks, size) => {
			const layout = header.layout;
			if (layout.status !== "available") throw new ArtifactReaderFailure("unavailable", "UnityFS directory layout is unavailable");
			let dataStart = header.blocksInfoAtEnd ? layout.afterHeader : layout.blocksInfoOffset + header.compressedBlocksInfoSize;
			if (layout.dataPadding) dataStart = align16(dataStart);
			const compressedTotal = blocks.reduce((total, block) => total + block.compressedSize, 0);
			const dataEnd = header.blocksInfoAtEnd ? layout.blocksInfoOffset : size;
			if (dataStart < 0 || dataStart + compressedTotal > dataEnd) throw unityFsFormatFailure("declared data area exceeds the file");
			return dataStart;
		};
		readUnityFsBlocksInfo = async (handle, header, size, signal) => {
			const layout = header.layout;
			if (layout.status !== "available") throw new ArtifactReaderFailure("unavailable", "UnityFS directory layout is unavailable");
			if (header.compressedBlocksInfoSize > MAX_TABLE_BYTES$1 || header.uncompressedBlocksInfoSize > MAX_TABLE_BYTES$1) throw directoryLimit();
			const budget = new UnityFsDirectoryBudget();
			budget.reserve(header.compressedBlocksInfoSize);
			if (header.compression !== 0) budget.reserve(header.uncompressedBlocksInfoSize);
			const compressed = await readArtifactFileBytes(handle, layout.blocksInfoOffset, header.compressedBlocksInfoSize, size, signal);
			const table = await decodeBlocksInfoTable(header, compressed, signal);
			if (table.length < 20) throw unityFsFormatFailure("blocks-info table is truncated");
			const blocks = await parseBlocks(table, budget, signal);
			const nodes = await parseNodes(table, blocks, budget, signal);
			return {
				dataHash: table.subarray(0, 16).toString("hex"),
				blocks,
				nodes,
				dataStart: resolveDataStart(header, blocks, size)
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/UnityFsArtifactReader.js
var CHUNK_BYTES$1, MAX_MEMBER_STREAMS$1, UnityFsArtifactReader, expansionLimit, blockEndingAfter, firstUnavailableBlock;
function init_UnityFsArtifactReader() {
	return (init_UnityFsArtifactReader = __esmMin((() => {
		init_artifactExpansionBudget();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_ArtifactFileOperation();
		init_ArtifactFileRange();
		init_ArtifactFileSource();
		init_unityfsFormat();
		init_UnityFsStructures();
		CHUNK_BYTES$1 = 64 * 1024;
		MAX_MEMBER_STREAMS$1 = 4;
		UnityFsArtifactReader = class {
			format = "unityfs";
			#scope = new ArtifactResourceScope();
			#entries = new Map();
			#streams = new Map();
			#source;
			#prepared;
			#header;
			#blocks = [];
			#dataStart = 0;
			#remainingDecodeBytes = 0;
			#remainingReadOperations = 0;
			#cachedBlock;
			#closing = false;
			constructor(path, admitted) {
				this.#source = new ArtifactFileSource(path, "UnityFS bundle", admitted);
			}
			formatMetadata() {
				return this.#header === undefined ? undefined : { ...this.#header };
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
				this.#assertOpen(signal);
				if (this.#header?.directory_status !== "available") {
					options?.onCoverage?.({
						status: "unknown",
						limitations: [this.#header?.directory_status === "encrypted" ? "UnityFS bundle declares asset-bundle encryption; member identities and contents remain unknown." : this.#header?.directory_status === "unsupported-layout" ? "UnityFS producer revision does not establish alignment or flag semantics; member identities remain unknown." : "UnityFS blocks-and-directory table uses an unsupported compression; member identities remain unknown."]
					});
					return;
				}
				let index = 0;
				for (const { entry } of this.#entries.values()) {
					if (index++ % 256 === 0) await setImmediate();
					this.#assertOpen(signal);
					yield copyArtifactEntry(entry);
				}
				this.#assertOpen(signal);
			}
			async open(entry, signal) {
				return this.#scope.run(async () => {
					this.#assertOpen(signal);
					const state = this.#entries.get(entry.adapterKey);
					if (state === undefined || !sameArtifactEntry(entry, state.entry)) throw new ArtifactReaderFailure("integrity", "UnityFS entry does not match its owning inventory");
					const { handle } = await this.#source.read(signal);
					this.#assertOpen(signal);
					if (state.entry.kind !== "file") throw new ArtifactReaderFailure("unavailable", "UnityFS directory entries have no file contents");
					if (state.unavailableCompression !== undefined) {
						const compression = String(state.unavailableCompression);
						const limitation = `UnityFS member compression ${compression} is unsupported; no content hash or child artifact was produced.`;
						throw new ArtifactEntryContentUnavailable(`UnityFS directory entry ${String(state.entry.formatMetadata.index)} requires unsupported compression ${compression}`, limitation, { traversal: {
							status: "unknown",
							limitations: [limitation]
						} });
					}
					if (this.#streams.size >= MAX_MEMBER_STREAMS$1) throw new ArtifactReaderFailure("limit", "UnityFS reader already owns four active member streams", { boundary: "capacity" });
					const controller = new AbortController();
					const output = Readable.from(this.#memberChunks(handle, state, controller.signal), {
						objectMode: false,
						highWaterMark: CHUNK_BYTES$1
					});
					const onAbort = () => {
						controller.abort(signal?.reason);
						output.destroy(new ArtifactReaderFailure("cancelled", "UnityFS member read cancelled", { cause: signal?.reason }));
					};
					output.on("error", () => undefined);
					this.#streams.set(output, controller);
					const completion = new Promise((resolve) => {
						output.once("close", () => {
							signal?.removeEventListener("abort", onAbort);
							this.#streams.delete(output);
							resolve();
						});
					});
					void this.#scope.run(() => completion).catch((cause) => {
						controller.abort(cause);
						output.destroy(cause instanceof Error ? cause : new Error("UnityFS stream ownership failed", { cause }));
					});
					signal?.addEventListener("abort", onAbort, { once: true });
					if (signal?.aborted === true) onAbort();
					return output;
				});
			}
			async close() {
				this.#closing = true;
				for (const [stream, controller] of this.#streams) {
					const cause = new ArtifactReaderFailure("unavailable", "UnityFS reader closed");
					controller.abort(cause);
					stream.destroy(cause);
				}
				await this.#scope.close();
				await this.#source.close();
				this.#entries.clear();
				this.#blocks = [];
				this.#cachedBlock = undefined;
			}
			provenance() {
				return [];
			}
			#assertOpen(signal) {
				assertArtifactReadActive(signal);
				if (this.#closing) throw new ArtifactReaderFailure("unavailable", "UnityFS reader is closed");
			}
			async #prepare(signal) {
				const { handle, initial } = await this.#source.read(signal);
				const header = await readUnityFsHeader(handle, initial.size, signal);
				if (header === undefined) throw unityFsFormatFailure("no complete UnityFS header");
				const status = header.layout.status;
				this.#header = {
					kind: "unityfs",
					signature: "UnityFS",
					format_version: header.formatVersion,
					player_version: header.playerVersion,
					engine_version: header.engineVersion,
					declared_size: header.declaredSize,
					flags: header.flags,
					blocks_info_compressed_size: header.compressedBlocksInfoSize,
					blocks_info_uncompressed_size: header.uncompressedBlocksInfoSize,
					blocks_info_at_end: header.blocksInfoAtEnd,
					data_start: null,
					block_count: null,
					data_hash: null,
					directory_status: status
				};
				if (status !== "available") return;
				const { dataHash, blocks, nodes, dataStart } = await readUnityFsBlocksInfo(handle, header, initial.size, signal);
				const budget = artifactExpansionBudgetBytes(initial.size);
				let streamBytes = 0n;
				for (const block of blocks) {
					streamBytes += BigInt(block.uncompressedSize);
					if (streamBytes > BigInt(budget)) throw expansionLimit("declared virtual stream", streamBytes, budget);
				}
				this.#header = {
					...this.#header,
					data_hash: dataHash,
					block_count: blocks.length,
					data_start: dataStart
				};
				this.#dataStart = dataStart;
				this.#blocks = blocks.filter((block) => block.uncompressedSize > 0);
				this.#remainingDecodeBytes = budget;
				await this.#registerNodes(nodes, budget, signal);
				await this.#source.read(signal);
			}
			async #registerNodes(nodes, budget, signal) {
				let readableBytes = 0n;
				for (let index = 0; index < nodes.length; index++) {
					if (index % 256 === 0) await setImmediate();
					this.#assertOpen(signal);
					const node = nodes[index];
					const firstBlock = node.size === 0 ? -1 : blockEndingAfter(this.#blocks, node.offset);
					const lastBlock = node.size === 0 ? -1 : blockEndingAfter(this.#blocks, node.offset + node.size - 1);
					if (node.size !== 0 && (firstBlock < 0 || lastBlock < firstBlock)) throw unityFsFormatFailure("member has no block range");
					const unavailable = firstUnavailableBlock(this.#blocks, firstBlock, lastBlock);
					const kind = (node.flags & 1) !== 0 ? "directory" : "file";
					if (kind === "file" && unavailable === undefined) {
						readableBytes += BigInt(node.size);
						if (readableBytes > BigInt(budget)) throw expansionLimit("readable members including aliases", readableBytes, budget);
					}
					const adapterKey = `unityfs-entry:${String(index)}`;
					const entry = {
						path: node.path,
						sourcePath: node.path,
						kind,
						declaredSize: node.size,
						compressedSize: null,
						executable: false,
						encrypted: false,
						byteOffset: null,
						declaredIntegrity: null,
						unpacked: false,
						limitations: [],
						adapterKey,
						formatMetadata: {
							kind: "unityfs-entry",
							index,
							source_path: node.path,
							declared_offset: node.offset,
							flags: node.flags
						}
					};
					this.#entries.set(adapterKey, {
						entry,
						firstBlock,
						lastBlock,
						unavailableCompression: unavailable?.compression
					});
				}
				this.#remainingReadOperations = 4 * Math.max(1024, this.#blocks.length + nodes.length + Math.ceil(Number(readableBytes) / CHUNK_BYTES$1));
			}
			async *#memberChunks(handle, state, signal) {
				const start = state.entry.formatMetadata.declared_offset;
				const end = start + state.entry.declaredSize;
				let delivered = 0, chunks = 0;
				for (let index = state.firstBlock; state.entry.declaredSize > 0 && index <= state.lastBlock; index++) {
					this.#assertOpen(signal);
					const block = this.#blocks[index];
					const first = Math.max(start - block.streamStart, 0);
					const last = Math.min(end - block.streamStart, block.uncompressedSize);
					if (last <= first) continue;
					const plain = block.compression === 0 ? undefined : await this.#decodedBlock(handle, index, signal);
					for (let offset = first; offset < last; offset += CHUNK_BYTES$1) {
						if (chunks++ % 64 === 0) await setImmediate();
						this.#assertOpen(signal);
						const size = Math.min(CHUNK_BYTES$1, last - offset);
						if (plain === undefined) this.#reserveMemberRead();
						const chunk = plain === undefined ? await readArtifactFileBytes(handle, this.#dataStart + block.compressedStart + offset, size, this.#dataStart + block.compressedStart + block.compressedSize, signal) : Buffer.from(plain.subarray(offset, offset + size));
						delivered += chunk.length;
						yield chunk;
					}
				}
				if (delivered !== state.entry.declaredSize) throw unityFsFormatFailure("member ended before its declared size");
				await this.#source.read(signal);
			}
			async #decodedBlock(handle, index, signal) {
				if (this.#cachedBlock?.index === index) return this.#cachedBlock.bytes;
				const block = this.#blocks[index];
				if (block.uncompressedSize > this.#remainingDecodeBytes) throw expansionLimit("cumulative block decoding", BigInt(block.uncompressedSize), this.#remainingDecodeBytes);
				this.#reserveMemberRead();
				this.#remainingDecodeBytes -= block.uncompressedSize;
				const encoded = await readArtifactFileBytes(handle, this.#dataStart + block.compressedStart, block.compressedSize, this.#dataStart + block.compressedStart + block.compressedSize, signal);
				const bytes = await decodeUnityFsLz4(encoded, block.uncompressedSize, signal);
				this.#assertOpen(signal);
				this.#cachedBlock = {
					index,
					bytes
				};
				return bytes;
			}
			#reserveMemberRead() {
				if (this.#remainingReadOperations <= 0) throw new ArtifactReaderFailure("limit", "UnityFS exceeds its directory-and-chunk I/O work budget", { boundary: "capacity" });
				this.#remainingReadOperations--;
			}
		};
		expansionLimit = (stage, bytes, budget) => new ArtifactReaderFailure("limit", `UnityFS ${stage} requires ${String(bytes)} bytes, exceeding the ${String(budget)}-byte plaintext-work budget`);
		blockEndingAfter = (blocks, offset) => {
			let low = 0, high = blocks.length;
			while (low < high) {
				const middle = low + Math.floor((high - low) / 2), block = blocks[middle];
				if (block.streamStart + block.uncompressedSize <= offset) low = middle + 1;
				else high = middle;
			}
			return low < blocks.length ? low : -1;
		};
		firstUnavailableBlock = (blocks, first, last) => {
			if (first < 0) return undefined;
			const before = first === 0 ? 0 : blocks[first - 1].unavailableCount;
			if (blocks[last].unavailableCount === before) return undefined;
			let low = first, high = last;
			while (low < high) {
				const middle = low + Math.floor((high - low) / 2);
				if (blocks[middle].unavailableCount > before) high = middle;
				else low = middle + 1;
			}
			return blocks[low];
		};
	})))();
}

//#endregion
//#region dist/artifacts/WxapkgStructures.js
var MAX_TABLE_BYTES, DIRECTORY_BUDGET_BYTES, MAX_MEMBER_NAME_BYTES, HEADER_PREFIX_BYTES, UTF8, wxapkgFormatFailure, WxapkgDirectoryBudget, readWxapkgHeader, wxapkgIndexLayoutFailure, readWxapkgFileTable;
function init_WxapkgStructures() {
	return (init_WxapkgStructures = __esmMin((() => {
		init_ArtifactReader();
		init_ArtifactFileRange();
		init_ArtifactFileOperation();
		init_wxapkgFormat();
		MAX_TABLE_BYTES = 16 * 1024 * 1024;
		DIRECTORY_BUDGET_BYTES = 64 * 1024 * 1024;
		MAX_MEMBER_NAME_BYTES = 64 * 1024;
		HEADER_PREFIX_BYTES = 64;
		UTF8 = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
		wxapkgFormatFailure = (detail) => new ArtifactReaderFailure("format", `wxapkg is malformed: ${detail}`);
		WxapkgDirectoryBudget = class {
			#remaining = DIRECTORY_BUDGET_BYTES;
			reserve(bytes) {
				if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.#remaining) throw artifactFixedLimitFailure("wxapkg directory representation", DIRECTORY_BUDGET_BYTES, "bytes");
				this.#remaining -= bytes;
			}
		};
		readWxapkgHeader = async (handle, size, signal) => {
			const prefix = await readArtifactFileBytes(handle, 0, Math.min(size, HEADER_PREFIX_BYTES), size, signal);
			if (hasWxapkgEncryptedMagic(prefix)) return {
				info: 0,
				indexLength: 0,
				dataLength: 0,
				fileCount: 0,
				layout: { status: "encrypted" }
			};
			const facts = readWxapkgHeaderFacts(prefix);
			if (facts === undefined) return undefined;
			const indexes = resolveWxapkgIndexLayouts(facts, size);
			if (!indexes.ok) throw wxapkgIndexLayoutFailure(indexes.error);
			return {
				...facts,
				layout: {
					status: "available",
					indexLayouts: indexes.value
				}
			};
		};
		wxapkgIndexLayoutFailure = (failure) => wxapkgFormatFailure(failure._tag === "DataRegionExceedsFile" ? "declared data region exceeds the file" : "declared member table exceeds the file");
		readWxapkgFileTable = async (handle, header, size, signal) => {
			const layout = header.layout;
			if (layout.status !== "available") throw new ArtifactReaderFailure("unavailable", "wxapkg directory is encrypted");
			const indexLayouts = layout.indexLayouts;
			let readBytes = 0;
			let tableStart;
			for (const indexLayout of indexLayouts) {
				if (tableStart === undefined) tableStart = indexLayout.tableStart;
				if (indexLayout.tableBytes > readBytes) readBytes = indexLayout.tableBytes;
			}
			if (tableStart === undefined) throw wxapkgFormatFailure("declared member table exceeds the file");
			if (readBytes > MAX_TABLE_BYTES) throw artifactFixedLimitFailure("wxapkg member table", MAX_TABLE_BYTES, "bytes");
			const budget = new WxapkgDirectoryBudget();
			budget.reserve(readBytes);
			const table = await readArtifactFileBytes(handle, tableStart, readBytes, size, signal);
			if (table.length < header.fileCount * 12) throw wxapkgFormatFailure("member table is truncated");
			const members = [];
			let cursor = 0;
			for (let index = 0; index < header.fileCount; index++) {
				if (index % 256 === 0) await setImmediate();
				assertArtifactReadActive(signal);
				if (cursor + 4 > table.length) throw wxapkgFormatFailure("member row is truncated");
				const nameLength = table.readUInt32BE(cursor);
				cursor += 4;
				if (nameLength === 0 || nameLength > MAX_MEMBER_NAME_BYTES || cursor + nameLength + 8 > table.length) throw wxapkgFormatFailure("member row exceeds the table");
				budget.reserve(512 + nameLength * 24);
				let declaredPath;
				try {
					declaredPath = UTF8.decode(table.subarray(cursor, cursor + nameLength));
				} catch (cause) {
					throw new ArtifactReaderFailure("format", "wxapkg member path is not valid UTF-8", { cause });
				}
				cursor += nameLength;
				const offset = table.readUInt32BE(cursor);
				const sizeMember = table.readUInt32BE(cursor + 4);
				cursor += 8;
				const path = declaredPath.startsWith("/") ? declaredPath.slice(1) : declaredPath;
				if (path.length === 0) throw wxapkgFormatFailure("member name has no package-relative path");
				members.push({
					offset,
					size: sizeMember,
					path,
					declaredPath
				});
			}
			const candidates = indexLayouts.filter((index) => index.tableBytes >= cursor);
			if (candidates.length === 0) throw wxapkgFormatFailure("member table is truncated");
			const index = selectWxapkgIndexLayout(candidates, cursor, members);
			if (index === undefined) {
				const outside = members.find((member) => {
					const extentEnd = member.offset + member.size;
					return candidates.every((candidate) => member.offset < candidate.dataStart || extentEnd > candidate.dataEnd || extentEnd < member.offset);
				});
				throw wxapkgFormatFailure(`member exceeds the data region: ${outside?.path ?? ""}`);
			}
			return { members };
		};
	})))();
}

//#endregion
//#region dist/artifacts/WxapkgArtifactReader.js
var CHUNK_BYTES, MAX_MEMBER_STREAMS, WxapkgArtifactReader;
function init_WxapkgArtifactReader() {
	return (init_WxapkgArtifactReader = __esmMin((() => {
		init_artifactExpansionBudget();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_ArtifactFileOperation();
		init_ArtifactFileRange();
		init_ArtifactFileSource();
		init_WxapkgStructures();
		CHUNK_BYTES = 64 * 1024;
		MAX_MEMBER_STREAMS = 4;
		WxapkgArtifactReader = class {
			format = "wxapkg";
			#scope = new ArtifactResourceScope();
			#entries = new Map();
			#streams = new Map();
			#source;
			#prepared;
			#header;
			#remainingReadOperations = 0;
			#admittedReadOperations = 0;
			#closing = false;
			constructor(path, admitted) {
				this.#source = new ArtifactFileSource(path, "wxapkg package", admitted);
			}
			formatMetadata() {
				return this.#header === undefined ? undefined : { ...this.#header };
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
				this.#assertOpen(signal);
				if (this.#header?.directory_status === "encrypted") {
					options?.onCoverage?.({
						status: "unknown",
						limitations: ["wxapkg package is V1MMWX-encrypted; member identities and contents remain unknown."]
					});
					return;
				}
				let index = 0;
				for (const { entry } of this.#entries.values()) {
					if (index++ % 256 === 0) await setImmediate();
					this.#assertOpen(signal);
					yield copyArtifactEntry(entry);
				}
				this.#assertOpen(signal);
			}
			async open(entry, signal) {
				return this.#scope.run(async () => {
					this.#assertOpen(signal);
					const state = this.#entries.get(entry.adapterKey);
					if (state === undefined || !sameArtifactEntry(entry, state.entry)) throw new ArtifactReaderFailure("integrity", "wxapkg entry does not match its owning inventory");
					this.#reserveMemberRead();
					const { handle } = await this.#source.read(signal);
					this.#assertOpen(signal);
					if (this.#streams.size >= MAX_MEMBER_STREAMS) throw new ArtifactReaderFailure("limit", "wxapkg reader already owns four active member streams", { boundary: "capacity" });
					const controller = new AbortController();
					const output = Readable.from(this.#memberChunks(handle, state, controller.signal), {
						objectMode: false,
						highWaterMark: CHUNK_BYTES
					});
					const onAbort = () => {
						controller.abort(signal?.reason);
						output.destroy(new ArtifactReaderFailure("cancelled", "wxapkg member read cancelled", { cause: signal?.reason }));
					};
					output.on("error", () => undefined);
					this.#streams.set(output, controller);
					const completion = new Promise((resolve) => {
						output.once("close", () => {
							signal?.removeEventListener("abort", onAbort);
							this.#streams.delete(output);
							resolve();
						});
					});
					void this.#scope.run(() => completion).catch((cause) => {
						controller.abort(cause);
						output.destroy(cause instanceof Error ? cause : new Error("wxapkg stream ownership failed", { cause }));
					});
					signal?.addEventListener("abort", onAbort, { once: true });
					if (signal?.aborted === true) onAbort();
					return output;
				});
			}
			async close() {
				this.#closing = true;
				for (const [stream, controller] of this.#streams) {
					const cause = new ArtifactReaderFailure("unavailable", "wxapkg reader closed");
					controller.abort(cause);
					stream.destroy(cause);
				}
				await this.#scope.close();
				await this.#source.close();
				this.#entries.clear();
			}
			provenance() {
				return [];
			}
			#assertOpen(signal) {
				assertArtifactReadActive(signal);
				if (this.#closing) throw new ArtifactReaderFailure("unavailable", "wxapkg reader is closed");
			}
			async #prepare(signal) {
				const { handle, initial } = await this.#source.read(signal);
				const header = await readWxapkgHeader(handle, initial.size, signal);
				if (header === undefined) throw wxapkgFormatFailure("no complete wxapkg header");
				this.#header = {
					kind: "wxapkg",
					info: header.layout.status === "available" ? header.info : null,
					index_length: header.layout.status === "available" ? header.indexLength : null,
					data_length: header.layout.status === "available" ? header.dataLength : null,
					file_count: header.layout.status === "available" ? header.fileCount : null,
					directory_status: header.layout.status
				};
				if (header.layout.status !== "available") return;
				const { members } = await readWxapkgFileTable(handle, header, initial.size, signal);
				const budget = artifactExpansionBudgetBytes(initial.size);
				let declaredBytes = 0n;
				for (let index = 0; index < members.length; index++) {
					if (index % 256 === 0) await setImmediate();
					this.#assertOpen(signal);
					const member = members[index];
					declaredBytes += BigInt(member.size);
					if (declaredBytes > BigInt(budget)) throw new ArtifactReaderFailure("limit", `wxapkg members declare ${String(declaredBytes)} bytes, exceeding the ${String(budget)}-byte plaintext-work budget`, { boundary: "memory" });
					const adapterKey = `wxapkg-entry:${String(index)}`;
					this.#entries.set(adapterKey, {
						entry: {
							path: member.path,
							sourcePath: member.declaredPath,
							kind: "file",
							declaredSize: member.size,
							compressedSize: null,
							executable: false,
							encrypted: false,
							byteOffset: member.offset,
							declaredIntegrity: null,
							unpacked: false,
							limitations: [],
							adapterKey,
							formatMetadata: {
								kind: "wxapkg-entry",
								index,
								source_path: member.declaredPath,
								declared_offset: member.offset
							}
						},
						member
					});
				}
				this.#admittedReadOperations = 4 * Math.max(1024, members.length + Math.ceil(Number(declaredBytes) / CHUNK_BYTES));
				this.#remainingReadOperations = this.#admittedReadOperations;
				await this.#source.read(signal);
			}
			async *#memberChunks(handle, state, signal) {
				const { offset, size } = state.member;
				let delivered = 0, chunks = 0;
				for (let position = offset; position < offset + size;) {
					if (chunks++ % 64 === 0) await setImmediate();
					this.#assertOpen(signal);
					this.#reserveMemberRead();
					const length = Math.min(CHUNK_BYTES, offset + size - position);
					const chunk = await readArtifactFileBytes(handle, position, length, offset + size, signal);
					position += chunk.length;
					delivered += chunk.length;
					yield chunk;
				}
				if (delivered !== size) throw wxapkgFormatFailure("member ended before its declared size");
				await this.#source.read(signal);
			}
			#reserveMemberRead() {
				if (this.#remainingReadOperations <= 0) throw artifactFixedLimitFailure("wxapkg directory-and-chunk I/O work", this.#admittedReadOperations, "operations");
				this.#remainingReadOperations--;
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/artifactFormats.js
function admittedAs(kind, options) {
	const admission = options.admission;
	return admission !== undefined && "kind" in admission && admission.kind === kind ? admission : sourceOf(options);
}
function described(id, descriptor) {
	const { createReader, ...capabilities } = descriptor;
	return createReader === undefined ? withoutReader(id, capabilities) : withReader(id, capabilities, createReader);
}
function container(id, descriptor = {}) {
	const { createReader, ...rest } = descriptor;
	const capabilities = {
		...plain,
		occurrenceContainer: true,
		...rest
	};
	return createReader === undefined ? withoutReader(id, capabilities) : withReader(id, capabilities, createReader);
}
var sourceOf, ZIP_FAMILY_CAPABILITIES, withReader, withoutReader, zipDescriptor, plain, NON_ZIP_FORMATS, ZIP_FORMATS, ARTIFACT_FORMAT_REGISTRY, ARTIFACT_FORMATS, listedFormatIds, artifactFormatDescriptor;
function init_artifactFormats() {
	return (init_artifactFormats = __esmMin((() => {
		init_artifactGraph();
		init_espImageFacts();
		init_zipPackageFormat();
		init_ArtifactReader();
		init_AsarArtifactReader();
		init_BunStandaloneArtifactReader();
		init_DfuSeArtifactReader();
		init_DirectoryArtifactReader();
		init_DotnetBundleArtifactReader();
		init_EspFlashImageArtifactReader();
		init_EspImageArtifactReader();
		init_FitArtifactReader();
		init_GodotPckArtifactReader();
		init_InesArtifactReader();
		init_HexRecordArtifactReader();
		init_MachOSliceArtifactReader();
		init_NativeDmgArtifactReader();
		init_NodeSeaArtifactReader();
		init_PyInstallerArtifactReader();
		init_Uf2ArtifactReader();
		init_UImageArtifactReader();
		init_UnityFsArtifactReader();
		init_WxapkgArtifactReader();
		init_ZipArtifactReader();
		sourceOf = (options) => {
			const admission = options.admission;
			return admission !== undefined && "kind" in admission ? admission.source : admission;
		};
		ZIP_FAMILY_CAPABILITIES = {
			zipFamily: true,
			occurrenceContainer: true,
			roleContainer: false,
			retainClassifiedSource: true,
			extractable: true,
			requiresDarwin: false,
			absentInventory: "unavailable"
		};
		withReader = (id, capabilities, createReader) => ({
			id,
			...capabilities,
			createReader
		});
		withoutReader = (id, capabilities) => ({
			id,
			...capabilities
		});
		zipDescriptor = (id) => withReader(id, ZIP_FAMILY_CAPABILITIES, (path, options) => new ZipArtifactReader(path, id, undefined, sourceOf(options)));
		plain = {
			zipFamily: false,
			occurrenceContainer: false,
			roleContainer: false,
			retainClassifiedSource: false,
			extractable: false,
			requiresDarwin: false,
			absentInventory: "root"
		};
		NON_ZIP_FORMATS = {
			"dotnet-bundle": container("dotnet-bundle", {
				retainClassifiedSource: true,
				absentInventory: "root",
				createReader: (path, options) => new DotnetBundleArtifactReader(path, admittedAs("dotnet-bundle", options))
			}),
			"bun-standalone": container("bun-standalone", {
				retainClassifiedSource: true,
				absentInventory: "unavailable",
				createReader: (path, options) => new BunStandaloneArtifactReader(path, admittedAs("bun-standalone", options))
			}),
			dmg: container("dmg", {
				requiresDarwin: true,
				absentInventory: "platform",
				createReader: (path, options) => new NativeDmgArtifactReader(path, options.environment)
			}),
			pkg: container("pkg", { absentInventory: "platform" }),
			asar: container("asar", {
				extractable: true,
				absentInventory: "unavailable",
				createReader: (path, options) => new AsarArtifactReader(path, {
					...options.asarHeaderAdmission === undefined ? {} : { headerAdmission: options.asarHeaderAdmission },
					...options.selectedPath === undefined ? {} : { selectedPath: options.selectedPath }
				})
			}),
			ines: container("ines", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: INES_LIMITATION,
				createReader: (path, options) => {
					const source = sourceOf(options);
					if (source === undefined) throw new ArtifactReaderFailure("integrity", "iNES inventory requires its admitted source descriptor");
					return new InesArtifactReader(path, source);
				}
			}),
			"godot-pck": container("godot-pck", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: "PCK inventory establishes packaged bytes and metadata; scenes, binary resources, GDScript bytecode and runtime signal behavior were not decoded.",
				createReader: (path, options) => new GodotPckArtifactReader(path, admittedAs("godot-pck", options))
			}),
			unityfs: container("unityfs", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: "UnityFS inventory establishes packaged bytes and metadata; serialized objects, textures, meshes and runtime asset behavior were not decoded. LZMA-compressed members are unsupported.",
				createReader: (path, options) => new UnityFsArtifactReader(path, sourceOf(options))
			}),
			wxapkg: container("wxapkg", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: "wxapkg inventory establishes packaged member names and stored bytes; wxml/wxss sources, compiled bundles and runtime behavior are not reconstructed. V1MMWX-encrypted packages are unsupported.",
				createReader: (path, options) => new WxapkgArtifactReader(path, sourceOf(options))
			}),
			uimage: container("uimage", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: "uImage inventory establishes the 64-byte legacy header facts and stored payload bytes. Compressed payloads are not decompressed, and the image is not executed.",
				createReader: (path, options) => new UImageArtifactReader(path, sourceOf(options))
			}),
			"javascript-bundle": described("javascript-bundle", plain),
			"source-map": described("source-map", plain),
			"mach-o-universal": described("mach-o-universal", {
				...plain,
				retainClassifiedSource: true,
				extractable: true,
				requiresDarwin: true,
				absentInventory: "universal",
				createReader: (path, options) => new MachOSliceArtifactReader(path, options.environment, undefined, sourceOf(options))
			}),
			"mach-o": described("mach-o", plain),
			elf: described("elf", plain),
			pe: described("pe", plain),
			"dos-mz": described("dos-mz", plain),
			"dos-com": described("dos-com", plain),
			"raw-binary": described("raw-binary", plain),
			"gamecube-dol": described("gamecube-dol", plain),
			hopper: described("hopper", plain),
			"analysis-database": described("analysis-database", plain),
			plist: described("plist", plain),
			entitlements: described("entitlements", plain),
			directory: container("directory", {
				absentInventory: "unavailable",
				createReader: (path, options) => new DirectoryArtifactReader(path, options.unreadableDirectories)
			}),
			file: described("file", plain),
			pyinstaller: container("pyinstaller", {
				retainClassifiedSource: true,
				createReader: (path, options) => new PyInstallerArtifactReader(path, admittedAs("pyinstaller", options))
			}),
			"node-sea": container("node-sea", {
				retainClassifiedSource: true,
				absentInventory: "unavailable",
				readerLimitation: "Node SEA inventory establishes the injected blob, flags, fuse sentinel, main script, optional code cache, snapshot, and assets. V8 snapshots and code cache are not deserialized, and the application is not executed.",
				createReader: (path, options) => new NodeSeaArtifactReader(path, admittedAs("node-sea", options))
			}),
			"intel-hex": container("intel-hex", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: "Intel HEX/S-record inventory decodes data records into address-contiguous regions. It does not establish CPU, byte order, memory map, or that a declared start address is executable; gaps are unwritten, not zero.",
				createReader: (path, options) => new HexRecordArtifactReader(path, "intel-hex", sourceOf(options))
			}),
			srec: container("srec", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: "Intel HEX/S-record inventory decodes data records into address-contiguous regions. It does not establish CPU, byte order, memory map, or that a declared start address is executable; gaps are unwritten, not zero.",
				createReader: (path, options) => new HexRecordArtifactReader(path, "srec", sourceOf(options))
			}),
			"esp-image": container("esp-image", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: ESP_IMAGE_LIMITATIONS.inventoryScope,
				createReader: (path, options) => new EspImageArtifactReader(path, sourceOf(options))
			}),
			uf2: container("uf2", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: "UF2 inventory decodes main-flash block payloads into address-contiguous regions per familyID. It does not establish CPU, byte order, memory map, or an entry point; a familyID names a target family, and gaps are unwritten, not zero.",
				createReader: (path, options) => new Uf2ArtifactReader(path, sourceOf(options))
			}),
			dfuse: container("dfuse", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: "DfuSe inventory lists each target element as one region at its declared address. It does not establish CPU, byte order, memory map, or an entry point; an alternate setting selects a device memory, not an address space REA can interpret.",
				createReader: (path, options) => new DfuSeArtifactReader(path, sourceOf(options))
			}),
			"esp-flash-image": container("esp-flash-image", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: "ESP flash layout inventory reads a dump's bootloader region, partition table and partitions and decodes the bootloader and app partitions as ESP images. The OTA selection is derived without app rollback or anti-rollback, and the running partition is unknown. Partitions, nvs_keys included, are extracted as ordinary data; nothing is decrypted.",
				createReader: (path, options) => new EspFlashImageArtifactReader(path, admittedAs("esp-flash-image", options), options.espFlashSelection)
			}),
			fit: container("fit", {
				roleContainer: true,
				retainClassifiedSource: true,
				extractable: true,
				absentInventory: "unavailable",
				readerLimitation: "FIT inventory reports each /images node's stored bytes and its declared type, architecture, OS, compression, load and entry. Image data is not decompressed or decrypted, signatures are not verified, nothing is executed, and load and entry addresses are declarations.",
				createReader: (path, options) => new FitArtifactReader(path, sourceOf(options))
			}),
			unknown: described("unknown", plain)
		};
		ZIP_FORMATS = Object.fromEntries(ZIP_PACKAGE_FORMATS.map((id) => [id, zipDescriptor(id)]));
		ARTIFACT_FORMAT_REGISTRY = {
			...NON_ZIP_FORMATS,
			...ZIP_FORMATS
		};
		ARTIFACT_FORMATS = ARTIFACT_FORMAT_REGISTRY;
		listedFormatIds = ARTIFACT_FORMAT_IDS;
		artifactFormatDescriptor = (format) => listedFormatIds.some((id) => id === format) ? ARTIFACT_FORMATS[format] : undefined;
	})))();
}

//#endregion
//#region dist/artifacts/inventory/ArtifactGraphConstruction.js
var indexDestinationOccurrencesByPath, createOccurrence, noteUnreadContainerSuffix, containerSuffixFamily, materializeDirectoryNodes, createRootNode, createArtifactNode, rootOccurrenceFor, rekeyOccurrences, createArtifactEdges, resolveOccurrenceParents, classifyArtifactPath, classifyArtifactContent, artifactRoleForFormat, classifyArtifactBytes, classifyFatArtifact, relationFor, depth;
function init_ArtifactGraphConstruction() {
	return (init_ArtifactGraphConstruction = __esmMin((() => {
		init_artifactFormats();
		init_godotPckFormat();
		init_uimageFormat();
		init_unityfsFormat();
		init_wxapkgFormat();
		init_hexRecords();
		init_espImage();
		init_uf2();
		init_dfuse();
		init_fitImage();
		init_AsarHeader();
		init_ArtifactPaths();
		init_unicodeCodePointOrder();
		init_javascriptArtifactFiles();
		init_canonicalDigest();
		init_appleArchiveFormat();
		init_artifactIdentity();
		init_zipPackageFormat();
		init_dosMz();
		init_machoContainer();
		init_inesContainer();
		indexDestinationOccurrencesByPath = (occurrences) => {
			const byPath = new Map();
			for (const occurrence of occurrences) {
				if (!hasDestinationPath(occurrence.entry_kind)) continue;
				const matches = byPath.get(occurrence.logical_path);
				if (matches === undefined) byPath.set(occurrence.logical_path, [occurrence]);
				else matches.push(occurrence);
			}
			return byPath;
		};
		createOccurrence = (entry, path, parent, options = {}) => {
			const duplicateOrdinal = options.duplicateOrdinal ?? 0;
			const role = entry.kind === "metadata" ? {
				kind: "package-metadata",
				format: "unknown"
			} : entry.kind === "directory" ? {
				kind: path.toLowerCase().endsWith(".framework") ? "framework" : "container",
				format: "directory"
			} : containerSuffixFamily(path) === undefined ? classifyArtifactPath(path) : {
				kind: "unknown",
				format: "unknown"
			};
			return {
				occurrence_id: `occ_${digestCanonicalValue(duplicateOrdinal === 0 ? {
					path,
					kind: entry.kind
				} : {
					path,
					kind: entry.kind,
					duplicate_ordinal: duplicateOrdinal
				}, "Artifact")}`,
				artifact_id: null,
				parent_occurrence_id: parent,
				logical_path: path,
				...entry.sourcePath !== undefined || entry.path !== logicalPathNfc(entry.path) ? { source_path: entry.sourcePath ?? entry.path } : {},
				entry_kind: entry.kind,
				artifact_kind: role.kind,
				artifact_format: role.format,
				declared_size: entry.declaredSize,
				compressed_size: entry.compressedSize,
				executable: entry.executable,
				encrypted: entry.encrypted,
				...entry.unpacked || options.sourceFormat === "asar" && entry.kind === "file" ? { unpacked: entry.unpacked } : {},
				hash_status: entry.encrypted ? "unavailable" : "not-hashed",
				source_location: entry.encrypted || entry.byteOffset === null || entry.declaredSize === null ? null : {
					offset: entry.byteOffset,
					length: entry.byteLength ?? entry.declaredSize
				},
				limitations: [...entry.limitations],
				...entry.declaredIntegrity === null ? {} : { declared_integrity: { ...entry.declaredIntegrity } },
				...entry.formatMetadata === undefined ? {} : { format_metadata: { ...entry.formatMetadata } }
			};
		};
		noteUnreadContainerSuffix = (occurrence) => {
			if (occurrence.entry_kind === "directory") return;
			const family = containerSuffixFamily(occurrence.logical_path);
			if (family === undefined) return;
			occurrence.limitations.push(`The path suffix suggests ${family.toUpperCase()}, but these bytes were not read, so the container family is unknown.`);
		};
		containerSuffixFamily = (path) => {
			const lower = path.toLowerCase();
			return lower.endsWith(".asar") ? "asar" : zipPackageFormatForPath(lower);
		};
		materializeDirectoryNodes = (occurrences, nodes) => {
			const directories = occurrences.filter(({ entry_kind: kind, hash_status }) => kind === "directory" && hash_status !== "unavailable").sort((left, right) => depth(right.logical_path) - depth(left.logical_path));
			const childrenByParent = new Map();
			for (const occurrence of occurrences) {
				if (occurrence.parent_occurrence_id === null) continue;
				const children = childrenByParent.get(occurrence.parent_occurrence_id);
				if (children === undefined) childrenByParent.set(occurrence.parent_occurrence_id, [occurrence]);
				else children.push(occurrence);
			}
			for (const directory of directories) {
				const children = (childrenByParent.get(directory.occurrence_id) ?? []).map(({ logical_path, artifact_id, entry_kind }) => ({
					name: logical_path.slice(directory.logical_path.length + 1),
					artifact_id,
					entry_kind
				})).sort((left, right) => compareUnicodeCodePoints(left.name, right.name));
				const node = createArtifactNode({
					sha256: digestCanonicalValue({
						kind: "directory",
						children
					}, "Artifact"),
					size: 0,
					format: "directory",
					contentState: "virtual"
				});
				nodes.set(node.artifact_id, node);
				directory.artifact_id = node.artifact_id;
				directory.hash_status = "verified";
			}
		};
		createRootNode = (input) => createArtifactNode({
			sha256: input.digest?.sha256 ?? digestCanonicalValue({
				kind: "directory-root",
				children: input.occurrences.map(({ logical_path, artifact_id }) => ({
					logical_path,
					artifact_id
				})).sort((left, right) => compareUnicodeCodePoints(left.logical_path, right.logical_path))
			}, "Artifact"),
			size: input.digest?.bytes ?? 0,
			format: input.digest === null ? "directory" : classifyArtifactBytes(input.digest, input.digest.bytes),
			contentState: "materialized"
		});
		createArtifactNode = (input) => ({
			artifact_id: artifactIdForContent(input.sha256),
			format: input.format,
			sha256: input.sha256,
			size: input.size,
			media_type: null,
			architecture: null,
			content_state: input.contentState,
			limitations: []
		});
		rootOccurrenceFor = (node, metadata) => ({
			occurrence_id: occurrenceIdForLocation({
				rootArtifactId: node.artifact_id,
				logicalPath: ".",
				entryKind: metadata.format === "directory" ? "directory" : "file"
			}),
			artifact_id: node.artifact_id,
			parent_occurrence_id: null,
			logical_path: ".",
			entry_kind: metadata.format === "directory" ? "directory" : "file",
			artifact_kind: artifactFormatDescriptor(metadata.format)?.occurrenceContainer === true ? "container" : artifactRoleForFormat(metadata.path, metadata.format).kind,
			artifact_format: metadata.format,
			declared_size: metadata.size,
			compressed_size: null,
			executable: metadata.executable,
			encrypted: (metadata.formatMetadata?.kind === "godot-pck" || metadata.formatMetadata?.kind === "unityfs" || metadata.formatMetadata?.kind === "wxapkg") && metadata.formatMetadata.directory_status === "encrypted",
			hash_status: "verified",
			source_location: null,
			...metadata.formatMetadata === undefined ? {} : { format_metadata: metadata.formatMetadata },
			limitations: []
		});
		rekeyOccurrences = (rootArtifactId, occurrences) => {
			const replacements = new Map();
			const ordinalByPath = new Map();
			for (const occurrence of occurrences) {
				const ordinal = ordinalByPath.get(occurrence.logical_path) ?? 0;
				ordinalByPath.set(occurrence.logical_path, ordinal + 1);
				replacements.set(occurrence.occurrence_id, occurrenceIdForLocation({
					rootArtifactId,
					logicalPath: occurrence.logical_path,
					entryKind: occurrence.entry_kind,
					...ordinal === 0 ? {} : { duplicateOrdinal: ordinal }
				}));
			}
			for (const occurrence of occurrences) {
				occurrence.occurrence_id = replacements.get(occurrence.occurrence_id) ?? occurrence.occurrence_id;
				if (occurrence.parent_occurrence_id !== null) occurrence.parent_occurrence_id = replacements.get(occurrence.parent_occurrence_id) ?? occurrence.parent_occurrence_id;
			}
		};
		createArtifactEdges = (rootArtifactId, occurrences, producer) => {
			const byId = new Map(occurrences.map((item) => [item.occurrence_id, item]));
			const byPath = indexDestinationOccurrencesByPath(occurrences);
			const edges = [];
			const limitations = [];
			for (const occurrence of occurrences) {
				const isSourceMap = occurrence.artifact_kind === "source-map";
				const sourcePath = isSourceMap ? occurrence.logical_path.slice(0, -".map".length) : undefined;
				const sourceCandidates = sourcePath === undefined ? [] : byPath.get(sourcePath) ?? [];
				const mappedSource = sourceCandidates.length === 1 && sourceCandidates[0]?.entry_kind === "file" && sourceCandidates[0].artifact_id !== null ? sourceCandidates[0] : undefined;
				if (sourcePath !== undefined) {
					const unknownMapping = sourceCandidates.length > 1 ? {
						occurrence: `Source-map target is unknown because multiple occurrences share ${JSON.stringify(sourcePath)}.`,
						coverage: `Source-map relationships are unknown because multiple occurrences share ${JSON.stringify(sourcePath)}.`
					} : sourceCandidates.length === 1 && sourceCandidates[0]?.entry_kind === "file" && mappedSource === undefined ? {
						occurrence: `Source-map target identity is unknown because the matching occurrence at ${JSON.stringify(sourcePath)} has no content identity.`,
						coverage: `Source-map relationships are unknown because the matching occurrence at ${JSON.stringify(sourcePath)} has no content identity.`
					} : undefined;
					if (unknownMapping !== undefined) {
						occurrence.limitations.push(unknownMapping.occurrence);
						limitations.push(unknownMapping.coverage);
					}
				}
				if (occurrence.parent_occurrence_id === null || occurrence.artifact_id === null) continue;
				const parentArtifactId = mappedSource?.artifact_id ?? byId.get(occurrence.parent_occurrence_id)?.artifact_id ?? rootArtifactId;
				const semantic = {
					parent_artifact_id: parentArtifactId,
					relation: occurrence.entry_kind === "slice" ? "slice-of" : occurrence.format_metadata?.kind === "pyinstaller-entry" && occurrence.format_metadata.bytecode_header === "derived" ? "derived-from" : isSourceMap ? mappedSource === undefined ? "contains" : "maps-source" : relationFor(occurrence.logical_path),
					occurrence_id: occurrence.occurrence_id
				};
				edges.push({
					edge_id: artifactEdgeId(semantic, occurrence),
					...semantic,
					producer: occurrence.entry_kind === "slice" ? producer ?? null : null,
					ordinal: edges.length
				});
			}
			return {
				edges,
				limitations
			};
		};
		resolveOccurrenceParents = (occurrences, byPath, expandedContainerIds) => {
			const root = { children: new Map() };
			for (const matches of byPath.values()) {
				const parents = matches.filter((occurrence) => occurrence.entry_kind === "directory" || expandedContainerIds.has(occurrence.occurrence_id));
				if (parents.length === 0) continue;
				if (parents.length > 1) {
					for (const parent of parents) if (parent.entry_kind === "directory") {
						parent.artifact_id = null;
						parent.hash_status = "unavailable";
						parent.limitations.push("This directory occurrence cannot be materialized because multiple directory entries share its logical path.");
					}
				}
				const path = matches[0]?.logical_path;
				if (path === undefined) continue;
				let branch = root;
				for (const segment of path.split("/")) {
					let child = branch.children.get(segment);
					if (child === undefined) {
						child = { children: new Map() };
						branch.children.set(segment, child);
					}
					branch = child;
				}
				branch.occurrences = parents;
			}
			const limitations = new Set();
			const unknownParentOccurrences = new Set();
			for (const occurrence of occurrences) {
				if (occurrence.entry_kind === "metadata") continue;
				const path = occurrence.logical_path;
				let branch = root;
				let parent;
				let ambiguousParentPath;
				let prefix = "";
				for (let start = 0;;) {
					const slash = path.indexOf("/", start);
					if (slash < 0) break;
					const segment = path.slice(start, slash);
					const child = branch.children.get(segment);
					if (child === undefined) break;
					branch = child;
					prefix = prefix.length === 0 ? segment : `${prefix}/${segment}`;
					const candidates = branch.occurrences ?? [];
					if (candidates.length === 1) {
						parent = candidates[0];
						ambiguousParentPath = undefined;
					} else if (candidates.length > 1) {
						parent = undefined;
						ambiguousParentPath = prefix;
					}
					start = slash + 1;
				}
				occurrence.parent_occurrence_id = parent?.occurrence_id ?? null;
				if (ambiguousParentPath !== undefined) {
					const limitation = `The parent occurrence for ${JSON.stringify(path)} is unknown because multiple observed directory or container occurrences share ${JSON.stringify(ambiguousParentPath)}.`;
					occurrence.limitations.push(limitation);
					limitations.add(limitation);
					unknownParentOccurrences.add(occurrence);
				}
			}
			return {
				limitations: [...limitations].sort(compareUnicodeCodePoints),
				unknownParentOccurrences
			};
		};
		classifyArtifactPath = (path) => {
			const lower = path.toLowerCase();
			if (lower.endsWith(".map")) return {
				kind: "source-map",
				format: "source-map"
			};
			if (isJavaScriptSourcePath(path)) return {
				kind: "javascript",
				format: "javascript-bundle"
			};
			if (/\.framework(?:\/|$)/u.test(lower)) return {
				kind: "framework",
				format: "file"
			};
			if (/\.(?:node|dylib|so)$/u.test(lower)) return {
				kind: lower.endsWith(".node") ? "native-addon" : "dynamic-library",
				format: "file"
			};
			if (lower.endsWith(".plist")) return {
				kind: "plist",
				format: "plist"
			};
			if (lower.endsWith(".entitlements")) return {
				kind: "entitlements",
				format: "entitlements"
			};
			return {
				kind: "resource",
				format: "file"
			};
		};
		classifyArtifactContent = (path, evidence, fileSize = evidence.prefix.length) => {
			const { prefix, asarHeader } = evidence;
			const contentFormat = classifyArtifactBytes(evidence, fileSize);
			const byPath = classifyArtifactPath(path);
			let role;
			if (contentFormat === "plist" && !hasBinaryPlistSignature(prefix) && ([
				"javascript",
				"source-map",
				"entitlements"
			].includes(byPath.kind) || path.toLowerCase().endsWith(".asar"))) role = byPath;
			else if (contentFormat === "file" && path.toLowerCase().endsWith(".asar") && asarHeader.state !== "rejected") {
				if (asarHeader.state === "limit") throw asarHeaderAdmissionFailure(asarHeader.admission, asarHeader.extents?.headerBytes);
				if (asarHeader.state === "matched") role = {
					kind: "container",
					format: "asar"
				};
				else role = artifactRoleForFormat(path, contentFormat);
			} else role = artifactRoleForFormat(path, contentFormat);
			return {
				...role,
				contentFormat
			};
		};
		artifactRoleForFormat = (path, format) => {
			const byPath = classifyArtifactPath(path);
			if (format === "file" || format === byPath.format) return byPath;
			if (format === "unknown") return {
				kind: "unknown",
				format
			};
			if (format === "zip") return {
				kind: "container",
				format: zipPackageFormatForPath(path) ?? format
			};
			if (format === "plist") return {
				kind: "plist",
				format
			};
			if (artifactFormatDescriptor(format)?.roleContainer === true) return {
				kind: "container",
				format
			};
			return {
				kind: ["native-addon", "dynamic-library"].includes(byPath.kind) ? byPath.kind : "executable",
				format
			};
		};
		classifyArtifactBytes = (evidence, fileSize = evidence.prefix.length) => {
			const { prefix, suffix, mzWindowsHeaderSignature } = evidence;
			if (nesContainerFormat(prefix) === "ines" && parseInesLayout(prefix, fileSize).ok) return "ines";
			if (hasZipSignature(prefix)) return "zip";
			if (hasGodotPckHeader(prefix)) return "godot-pck";
			if (hasUnityFsHeader(prefix)) return "unityfs";
			if (hasWxapkgEncryptedMagic(prefix) || hasWxapkgHeader(prefix)) return "wxapkg";
			if (hasUImageMagic(prefix)) return "uimage";
			const hexRecords = detectHexRecordEncoding(prefix);
			if (hexRecords !== undefined) return hexRecords;
			if (hasUf2Block(prefix)) return "uf2";
			if (suffix !== undefined && isDfuSeFile(prefix, suffix, fileSize)) return "dfuse";
			if (recognizeEspImage(prefix, fileSize) === "esp-image") return "esp-image";
			if (hasFitImagesNode(prefix)) return "fit";
			if (hasBinaryPlistSignature(prefix)) return "plist";
			if (hasXmlPlistSignature(prefix)) return "plist";
			const fatFormat = classifyFatArtifact(evidence, fileSize);
			if (fatFormat !== null) return fatFormat;
			if (prefix.length >= 4) {
				if (readMachoHeaderPrefixFacts(prefix).format !== null) return "mach-o";
				if (prefix.subarray(0, 4).equals(Buffer.from([
					127,
					69,
					76,
					70
				]))) return "elf";
			}
			if (prefix.length >= 2 && prefix[0] === 77 && prefix[1] === 90) {
				if (!Number.isSafeInteger(fileSize) || fileSize < prefix.length || prefix.length < Math.min(fileSize, 64)) return "unknown";
				const mzEvidence = parseMzHeaderEvidence(prefix, fileSize, mzWindowsHeaderSignature);
				const { windowsHeader } = mzEvidence;
				if (windowsHeader.state === "signature-needed") return "unknown";
				if (windowsHeader.state === "candidate") return "unknown";
				if (windowsHeader.state === "declared") {
					const windowsOffset = windowsHeader.offset;
					if (windowsHeader.signature === "PE" && windowsOffset >= 64 && (windowsOffset <= prefix.length - 4 || mzWindowsHeaderSignature?.offset === windowsOffset && mzWindowsHeaderSignature.bytes.length >= 4)) return "pe";
					return "unknown";
				}
				if (mzEvidence.dos.ok) return "dos-mz";
				return "unknown";
			}
			return "file";
		};
		classifyFatArtifact = (evidence, fileSize) => {
			const { prefix, fatSliceHeaders } = evidence;
			const fatHeader = fatSliceHeaders?.header ?? readFatContainerHeader(prefix, fileSize);
			if (fatHeader.state === "needs-data" || fatHeader.state === "malformed") return "unknown";
			if (fatHeader.state === "not-fat") return null;
			const identity = classifyFatContainerEvidence(fatHeader, prefix, fatSliceHeaders?.sliceHeadersByOffset);
			return identity.state === "mach-o" ? "mach-o-universal" : "unknown";
		};
		relationFor = (path) => path.toLowerCase().includes(".framework/") ? "embeds" : "contains";
		depth = (path) => path.split("/").length;
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactEmbeddedFormatProbes.js
var ArtifactEmbeddedFormatProbes;
function init_ArtifactEmbeddedFormatProbes() {
	return (init_ArtifactEmbeddedFormatProbes = __esmMin((() => {
		init_BunModuleGraphLayout();
		init_RegularFile();
		init_DotnetBundle();
		init_ArtifactReader();
		init_ArtifactHash();
		init_GodotPckLocation();
		init_NodeSeaLocation();
		init_CArchiveLayout();
		ArtifactEmbeddedFormatProbes = class {
			source;
			signal;
			#facts;
			constructor(path, source, signal, previous) {
				this.source = source;
				this.signal = signal;
				abortIfNeeded(signal);
				if (previous !== undefined && !sameRegularFileState(previous.sourceState, source.initial)) throw new ArtifactReaderFailure("integrity", `Root artifact changed before inventory: ${path}`);
				this.#facts = previous ?? { sourceState: regularFileState(source.initial) };
			}
			async godotPck(prefix) {
				abortIfNeeded(this.signal);
				if (this.#facts.godotPck !== undefined) return this.#facts.godotPck ?? undefined;
				const location = await locateGodotPck(this.source.handle, this.source.initial.size, this.signal, prefix);
				this.#facts = {
					...this.#facts,
					godotPck: location ?? null
				};
				return location;
			}
			async nodeSea() {
				abortIfNeeded(this.signal);
				if (this.#facts.nodeSea !== undefined) return this.#facts.nodeSea ?? undefined;
				const location = await locateNodeSea(this.source.handle, this.source.initial.size, this.signal);
				this.#facts = {
					...this.#facts,
					nodeSea: location ?? null
				};
				return location;
			}
			async pyInstaller() {
				abortIfNeeded(this.signal);
				if (this.#facts.pyInstaller !== undefined) return this.#facts.pyInstaller.state === "located" ? this.#facts.pyInstaller.cookie : undefined;
				const found = await observePyInstallerCookie(this.source.handle, this.source.initial.size, this.signal);
				abortIfNeeded(this.signal);
				if (!found.ok) throw new ArtifactReaderFailure(found.error.reason, found.error.message);
				this.#facts = {
					...this.#facts,
					pyInstaller: found.value
				};
				return found.value.state === "located" ? found.value.cookie : undefined;
			}
			async dotnetBundle() {
				abortIfNeeded(this.signal);
				if (this.#facts.dotnetBundleHeaderOffset !== undefined) return this.#facts.dotnetBundleHeaderOffset ?? undefined;
				const packaged = await this.pyInstaller();
				const header = await findDotnetBundleHeader(this.source.handle, this.source.initial.size, this.signal, packaged?.archiveStart ?? this.source.initial.size);
				abortIfNeeded(this.signal);
				this.#facts = {
					...this.#facts,
					dotnetBundleHeaderOffset: header ?? null
				};
				return header;
			}
			async bunStandalone() {
				abortIfNeeded(this.signal);
				if (this.#facts.bunStandalone !== undefined) return this.#facts.bunStandalone;
				const observed = await probeBunStandaloneGraph(this.source.handle, this.source.initial.size, this.signal);
				abortIfNeeded(this.signal);
				this.#facts = {
					...this.#facts,
					bunStandalone: observed
				};
				return observed;
			}
			completedFacts() {
				return this.#facts;
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/inventory/classify.js
var classifyAndHashRootForInventory, classifyRootFormat, readRootFatSliceHeaders, readRootMzWindowsHeaderSignature, assertAdmittedRootDigest;
function init_classify() {
	return (init_classify = __esmMin((() => {
		init_inesContainer();
		init_espFlashLocation();
		init_ArtifactSelectedSource();
		init_artifactNameSelection();
		init_ArtifactEmbeddedFormatProbes();
		init_RegularFile();
		init_NodeSeaBlob();
		init_NodeSeaLocation();
		init_ArtifactGraphConstruction();
		init_ArtifactHash();
		init_binaryTarget();
		init_ArtifactClassificationProbe();
		init_zipPackageFormat();
		init_artifactFormats();
		init_ArtifactReader();
		init_hashStableRootArtifact();
		init_machoContainer();
		init_diskImageFormat();
		init_dfuse();
		init_dosMz();
		classifyAndHashRootForInventory = async (path, directory, expectedMetadata, options, probeFacts) => {
			if (directory && probeFacts !== undefined) {
				abortIfNeeded(options.signal);
				throw new ArtifactReaderFailure("integrity", `Root artifact changed before inventory: ${path}`);
			}
			if (directory && options.expectedRootSha256 !== undefined) throw new ArtifactReaderFailure("integrity", `Artifact root changed after target admission: expected an admitted file at ${path}, observed a directory`, { userMessage: "The opened file was replaced by a directory. Select the intended artifact and reopen it before retrying." });
			if (directory) return {
				format: "directory",
				digest: null,
				rootSource: undefined,
				readerAdmission: undefined
			};
			if (options.expectedRootSha256 !== undefined) await assertArtifactSelectedSource(path, options.selectedPath);
			const source = await openRootArtifact(path, options.resourceScope, options.signal);
			const { handle, initial } = source;
			let outcome;
			try {
				if (!sameRegularFileState(expectedMetadata, initial)) throw new ArtifactReaderFailure("integrity", `Root artifact changed before inventory: ${path}`);
				const probes = new ArtifactEmbeddedFormatProbes(path, source, options.signal, probeFacts);
				const admittedDigest = options.expectedRootSha256 === undefined ? undefined : await hashStableRootArtifactHandle(path, handle, initial, options.signal);
				if (admittedDigest !== undefined) assertAdmittedRootDigest(path, options.expectedRootSha256, admittedDigest.sha256);
				const classified = await classifyRootFormat(path, source, probes, options.signal, options.asarHeaderAdmission, options.selectedPath, options.espFlashSelection);
				const format = typeof classified === "string" ? classified : classified.kind;
				const digest = admittedDigest ?? await hashStableRootArtifactHandle(path, handle, initial, options.signal);
				const retainSource = artifactFormatDescriptor(format)?.retainClassifiedSource === true;
				outcome = {
					kind: "completed",
					value: {
						format,
						digest,
						rootSource: retainSource ? source : undefined,
						readerAdmission: typeof classified !== "string" ? classified : retainSource ? source : undefined
					}
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			if (outcome.kind === "failed" || outcome.value.rootSource === undefined) {
				await releaseRootArtifact(path, source.owner, options.resourceScope, outcome.kind === "completed" ? {
					kind: "completed",
					digest: outcome.value.digest
				} : outcome, options.signal);
			}
			if (outcome.kind === "failed") throw outcome.cause;
			return outcome.value;
		};
		classifyRootFormat = async (path, source, embeddedProbes, signal, asarHeaderAdmission, selectedPath, espFlashSelection) => {
			const { handle } = source;
			const probe = createArtifactClassificationProbe(asarHeaderAdmission);
			const chunk = Buffer.alloc(64 * 1024);
			while (probe.length < probe.limit) {
				abortIfNeeded(signal);
				const read = await handle.read(chunk, 0, Math.min(chunk.length, probe.limit - probe.length), probe.length);
				abortIfNeeded(signal);
				if (read.bytesRead === 0) break;
				probe.write(chunk.subarray(0, read.bytesRead));
			}
			const archiveBytes = (await handle.stat()).size;
			const evidence = probe.finish(archiveBytes);
			abortIfNeeded(signal);
			try {
				await assertStableRegularFileIdentity(handle, path, source.initial, {
					symlinks: "reject",
					...signal === undefined ? {} : { signal }
				});
			} catch (cause) {
				abortIfNeeded(signal);
				if (cause instanceof RegularFileChangedError) throw new ArtifactReaderFailure("integrity", `Root artifact changed during classification: ${path}`, { cause: cause.cause ?? cause });
				throw cause;
			}
			const read = async (position, length) => {
				const bytes = Buffer.alloc(length);
				let filled = 0;
				while (filled < length) {
					abortIfNeeded(signal);
					const observed = await handle.read(bytes, filled, length - filled, position + filled);
					abortIfNeeded(signal);
					if (observed.bytesRead === 0) break;
					filled += observed.bytesRead;
				}
				return bytes.subarray(0, filled);
			};
			const locateFlash = (selection, explicit) => locateEspFlashLayout(archiveBytes, read, selection, {
				explicit,
				...signal === undefined ? {} : { signal }
			});
			if (espFlashSelection !== undefined) {
				const selected = await locateFlash(espFlashSelection, true);
				if (!selected.ok) throw new ArtifactReaderFailure("unavailable", `ESP flash image layout is not recognized: ${selected.error}`);
				return {
					kind: "esp-flash-image",
					source,
					location: selected.value
				};
			}
			if (nesContainerFormat(evidence.prefix) !== undefined) {
				const parsed = parseInesLayout(evidence.prefix, archiveBytes);
				if (!parsed.ok) throw new ArtifactReaderFailure("format", parsed.error);
				return "ines";
			}
			const classificationPath = artifactNameForClassification(selectedPath ?? path, path);
			const lower = classificationPath.toLowerCase();
			if (hasZipSignature(evidence.prefix)) return zipRootPackageFormat(lower);
			if (lower.endsWith(".pkg") && evidence.prefix.subarray(0, 4).equals(Buffer.from("xar!"))) return "pkg";
			if (lower.endsWith(".dmg") && await hasDiskImageSignature(archiveBytes, read)) return "dmg";
			const pck = await embeddedProbes.godotPck(evidence.prefix);
			if (pck !== undefined) return {
				kind: "godot-pck",
				source,
				location: pck
			};
			const flash = await locateFlash({}, false);
			if (flash.ok) return {
				kind: "esp-flash-image",
				source,
				location: flash.value
			};
			const fatEvidence = await readRootFatSliceHeaders(handle, evidence, signal);
			const mzWindowsHeaderSignature = await readRootMzWindowsHeaderSignature(handle, fatEvidence, archiveBytes, signal);
			const suffix = fatEvidence.suffix === undefined && archiveBytes >= 16 && hasDfuSePrefix(evidence.prefix) ? await read(archiveBytes - 16, 16) : fatEvidence.suffix;
			const classificationEvidence = {
				...fatEvidence,
				...suffix === undefined ? {} : { suffix },
				...mzWindowsHeaderSignature === undefined ? {} : { mzWindowsHeaderSignature }
			};
			const format = classifyArtifactContent(classificationPath, classificationEvidence, archiveBytes).format;
			if ((format === "file" || format === "unknown") && !claimsExecutableHeader(evidence.prefix, archiveBytes) && await locateTrailingZipArchive(archiveBytes, read) !== undefined) return zipRootPackageFormat(lower);
			if ([
				"elf",
				"pe",
				"mach-o",
				"mach-o-universal"
			].includes(format)) {
				const sea = await embeddedProbes.nodeSea();
				abortIfNeeded(signal);
				if (sea !== undefined) {
					const decoded = await decodeNodeSeaBlob(await readNodeSeaBlob(handle, sea, archiveBytes, signal), signal);
					return {
						kind: "node-sea",
						source,
						location: sea,
						decoded
					};
				}
				const bun = await embeddedProbes.bunStandalone();
				if (bun.status === "present") return {
					kind: "bun-standalone",
					source,
					probe: bun
				};
				const packaged = await embeddedProbes.pyInstaller();
				abortIfNeeded(signal);
				if (format !== "mach-o-universal") {
					const headerOffset = await embeddedProbes.dotnetBundle();
					if (headerOffset !== undefined) return {
						kind: "dotnet-bundle",
						source,
						headerOffset
					};
				}
				if (packaged !== undefined) return {
					kind: "pyinstaller",
					source,
					cookie: packaged,
					carrierPathDialect: format === "pe" ? "windows" : "posix"
				};
			}
			return format;
		};
		readRootFatSliceHeaders = async (handle, evidence, signal) => {
			const existing = evidence.fatSliceHeaders;
			if (existing === undefined) return evidence;
			const { header } = existing;
			const sliceHeadersByOffset = new Map(existing.sliceHeadersByOffset);
			for (let index = 0; index < header.slices.length; index += 1) {
				const slice = header.slices[index];
				const observed = slice === undefined ? undefined : sliceHeadersByOffset.get(slice.offset);
				if (slice === undefined || header.rangeIssues[index] !== null || slice.size < 4 || observed !== undefined && observed.magic !== null) continue;
				const headerLength = Math.min(12, slice.size);
				const thinHeader = Buffer.alloc(headerLength);
				let bytesRead = 0;
				while (bytesRead < thinHeader.length) {
					abortIfNeeded(signal);
					const read = await handle.read(thinHeader, bytesRead, thinHeader.length - bytesRead, slice.offset + bytesRead);
					abortIfNeeded(signal);
					if (read.bytesRead === 0) break;
					bytesRead += read.bytesRead;
				}
				sliceHeadersByOffset.set(slice.offset, readMachoHeaderPrefixFacts(thinHeader.subarray(0, bytesRead)));
			}
			return {
				...evidence,
				fatSliceHeaders: {
					header,
					sliceHeadersByOffset
				}
			};
		};
		readRootMzWindowsHeaderSignature = async (handle, evidence, fileSize, signal) => {
			const observation = observeMzWindowsHeader(evidence.prefix, fileSize);
			if (observation.state !== "signature-needed") return evidence.mzWindowsHeaderSignature;
			const { offset } = observation;
			if (!Number.isSafeInteger(offset) || offset < 0 || offset >= fileSize) return evidence.mzWindowsHeaderSignature;
			const window = Buffer.alloc(4);
			const existing = evidence.mzWindowsHeaderSignature?.offset === offset ? evidence.mzWindowsHeaderSignature.bytes : undefined;
			const inline = offset < evidence.prefix.length ? evidence.prefix.subarray(offset, Math.min(offset + 4, evidence.prefix.length)) : undefined;
			const known = existing !== undefined && (inline === undefined || existing.length > inline.length) ? existing : inline;
			known?.copy(window);
			let available = known?.length ?? 0;
			const requiredLength = () => available >= 2 && window[0] === 80 && window[1] === 69 ? 4 : 2;
			while (available < requiredLength() && offset + available < fileSize) {
				abortIfNeeded(signal);
				const length = Math.min(requiredLength() - available, fileSize - offset - available);
				const chunk = Buffer.alloc(length);
				const read = await handle.read(chunk, 0, length, offset + available);
				abortIfNeeded(signal);
				if (read.bytesRead === 0) break;
				chunk.copy(window, available, 0, read.bytesRead);
				available += read.bytesRead;
			}
			if (available === 0) return undefined;
			return {
				offset,
				bytes: window.subarray(0, available)
			};
		};
		assertAdmittedRootDigest = (path, expected, observed) => {
			if (expected !== undefined && observed !== expected) throw new ArtifactReaderFailure("integrity", `Artifact root changed after target admission at ${path}: expected ${expected}, observed ${observed}`, { userMessage: "The artifact changed after it was opened. Reopen the selected artifact, then retry." });
		};
	})))();
}

//#endregion
//#region dist/artifacts/createArtifactReader.js
/** Construct a reader without acquiring or transferring its source ownership. */
function createArtifactReader(path, format, options) {
	const descriptor = ARTIFACT_FORMATS[format];
	return "createReader" in descriptor ? descriptor.createReader(path, options) : undefined;
}
function init_createArtifactReader() {
	return (init_createArtifactReader = __esmMin((() => {
		init_artifactFormats();
	})))();
}

//#endregion
//#region dist/artifacts/inventory/reader.js
var createReader, inventoryCoverage;
function init_reader() {
	return (init_reader = __esmMin((() => {
		init_artifactFormats();
		init_createArtifactReader();
		init_zipPackageFormat();
		createReader = (path, format, environment, readerAdmission, asarHeaderAdmission, selectedPath) => {
			if (artifactFormatDescriptor(format)?.requiresDarwin === true && process.platform !== "darwin") return undefined;
			return createArtifactReader(path, format, {
				environment,
				unreadableDirectories: "omit",
				admission: readerAdmission,
				asarHeaderAdmission,
				selectedPath
			});
		};
		inventoryCoverage = (format, reader, traversal) => {
			if (reader !== undefined) return {
				coverage: {
					scope: "container-entries",
					status: traversal.status
				},
				limitations: [
					...isZipPackageFormat(reader.format) ? [ZIP_NON_ENTRY_LIMITATION] : [],
					...artifactFormatDescriptor(reader.format)?.readerLimitation === undefined ? [] : [artifactFormatDescriptor(reader.format).readerLimitation],
					...traversal.limitations
				]
			};
			const absent = artifactFormatDescriptor(format)?.absentInventory ?? "root";
			if (absent === "platform") return {
				coverage: {
					scope: "container-entries",
					status: "unknown"
				},
				limitations: [`${format.toUpperCase()} root hash is observed; child inventory requires a native macOS adapter.`]
			};
			if (absent === "universal") return {
				coverage: {
					scope: "container-entries",
					status: "unknown"
				},
				limitations: ["Universal Mach-O slices require the native macOS lipo adapter."]
			};
			if (absent === "unavailable") return {
				coverage: {
					scope: "container-entries",
					status: "unknown"
				},
				limitations: [`${format} child inventory reader is unavailable.`]
			};
			return {
				coverage: {
					scope: "root",
					status: "complete"
				},
				limitations: ["Inventory covers root bytes only; child container entries were not examined."]
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactTraversalObservation.js
var ArtifactTraversalObservation;
function init_ArtifactTraversalObservation() {
	return (init_ArtifactTraversalObservation = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_ArtifactPaths();
		ArtifactTraversalObservation = class {
			#limitations = new Set();
			#unknown = false;
			onCoverage = (coverage) => {
				this.#unknown ||= coverage.status === "unknown";
				for (const limitation of coverage.limitations) this.#limitations.add(limitation);
			};
			onOmission = (omission) => {
				const path = normalizeArtifactPath(omission.path);
				this.#unknown = true;
				this.#limitations.add(`Artifact traversal omitted ${omission.kind} at ${JSON.stringify(path)}.`);
			};
			snapshot() {
				return {
					status: this.#unknown ? "unknown" : "complete",
					limitations: [...this.#limitations].sort(compareUnicodeCodePoints)
				};
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/inventory/scanReader.js
var emptyScan, scanReader, containerContradiction, inventoryEntries, visitArtifactEntries, digestArtifactEntry, isExpandableAsar;
function init_scanReader() {
	return (init_scanReader = __esmMin((() => {
		init_artifactIntegrity();
		init_ArtifactPaths();
		init_ArtifactReader();
		init_ArtifactTraversalObservation();
		init_DirectoryArtifactReader();
		init_AsarArtifactReader();
		init_InesArtifactReader();
		init_ArtifactGraphConstruction();
		init_ArtifactHash();
		emptyScan = () => ({
			nodes: new Map(),
			occurrences: [],
			pendingContradictions: []
		});
		scanReader = async (reader, ownedReaders, signal, integrity = "fail", asarHeaderAdmission) => {
			const { nodes, occurrences, pendingContradictions } = emptyScan();
			if (reader === undefined) return {
				nodes,
				occurrences,
				pendingContradictions,
				caseCollisionLimitation: undefined,
				inesRegionScan: undefined,
				unknownParentOccurrences: new Set(),
				traversal: {
					status: "complete",
					limitations: []
				},
				rootContradiction: undefined
			};
			const context = {
				reader,
				signal,
				integrity,
				asarHeaderAdmission,
				nodes,
				occurrences,
				pendingContradictions,
				occurrenceCountByPath: new Map(),
				registry: new ArtifactPathRegistry(),
				expandedContainerIds: new Set(),
				ownedReaders,
				reconstruction: reader instanceof InesArtifactReader ? {
					hash: createHash("sha256"),
					regionOrder: [],
					bytes: 0
				} : undefined,
				traversal: new ArtifactTraversalObservation()
			};
			await visitArtifactEntries(context, reader, "");
			const rootContradiction = containerContradiction(reader, integrity);
			const byPath = indexDestinationOccurrencesByPath(occurrences);
			const parentResolution = resolveOccurrenceParents(occurrences, byPath, context.expandedContainerIds);
			const structuralLimitations = [...parentResolution.limitations];
			context.traversal.onCoverage({
				status: structuralLimitations.length === 0 ? "complete" : "unknown",
				limitations: structuralLimitations
			});
			return {
				nodes,
				occurrences,
				pendingContradictions,
				caseCollisionLimitation: annotateEnglishUnicodeCaseCollisions(occurrences),
				inesRegionScan: context.reconstruction === undefined ? undefined : {
					region_order: context.reconstruction.regionOrder,
					bytes: context.reconstruction.bytes,
					sha256: context.reconstruction.hash.digest("hex")
				},
				unknownParentOccurrences: parentResolution.unknownParentOccurrences,
				traversal: context.traversal.snapshot(),
				rootContradiction
			};
		};
		containerContradiction = (reader, integrity) => {
			const pair = reader.containerIntegrity?.();
			if (pair === undefined || pair.declared_crc32 === pair.observed_crc32) return undefined;
			if (integrity === "fail") throw new ArtifactReaderFailure("integrity", "Artifact integrity metadata disagrees with content: .", undefined, artifactContainerIntegrityDetails(".", pair));
			return pair;
		};
		inventoryEntries = (context, reader, prefix) => reader.entries(context.signal, {
			onCoverage: context.traversal.onCoverage,
			onOmission: (omission) => context.traversal.onOmission({
				...omission,
				path: prefix.length === 0 ? omission.path : `${prefix}/${omission.path}`
			})
		})[Symbol.asyncIterator]();
		visitArtifactEntries = async (context, currentReader, prefix) => {
			const stack = [{
				reader: currentReader,
				prefix,
				containerId: null,
				iterator: inventoryEntries(context, currentReader, prefix)
			}];
			let failure;
			try {
				while (stack.length > 0) {
					const frame = stack.at(-1);
					if (frame === undefined) break;
					const next = await frame.iterator.next();
					if (next.done) {
						stack.pop();
						continue;
					}
					const entry = next.value;
					const logicalPath = normalizeArtifactPath(frame.prefix.length === 0 ? entry.path : `${frame.prefix}/${entry.path}`);
					const expandableAsar = isExpandableAsar(entry, logicalPath);
					if (frame.reader.format !== "pyinstaller" && frame.reader.format !== "bun-standalone") context.registry.add(logicalPath, expandableAsar ? "directory" : entry.kind);
					const duplicateOrdinal = context.occurrenceCountByPath.get(logicalPath) ?? 0;
					context.occurrenceCountByPath.set(logicalPath, duplicateOrdinal + 1);
					const occurrence = createOccurrence(entry, logicalPath, entry.kind === "metadata" ? frame.containerId : null, {
						duplicateOrdinal,
						sourceFormat: frame.reader.format
					});
					let digested;
					try {
						digested = await digestArtifactEntry(context, frame.reader, entry, logicalPath, occurrence);
					} catch (cause) {
						if (!(cause instanceof DirectoryArtifactEntryAccessDenied) && !(cause instanceof ArtifactEntryContentUnavailable)) throw cause;
						abortIfNeeded(context.signal);
						const limitation = cause instanceof ArtifactEntryContentUnavailable ? cause.limitation : cause.message;
						const traversal = cause instanceof ArtifactEntryContentUnavailable ? cause.traversal : {
							status: "unknown",
							limitations: [limitation]
						};
						if (traversal !== undefined) context.traversal.onCoverage(traversal);
						occurrence.hash_status = "unavailable";
						occurrence.limitations.push(limitation);
					}
					if (digested === undefined) noteUnreadContainerSuffix(occurrence);
					else {
						context.nodes.set(digested.node.artifact_id, digested.node);
						occurrence.artifact_id = digested.node.artifact_id;
						const seaMainScript = entry.formatMetadata?.kind === "node-sea-entry" && entry.formatMetadata.role === "main-script";
						occurrence.artifact_kind = seaMainScript ? "javascript" : digested.classification.kind;
						occurrence.artifact_format = seaMainScript ? "javascript-bundle" : digested.classification.format;
						occurrence.hash_status = digested.mismatched ? "mismatched" : "verified";
						if (digested.mismatched) occurrence.limitations.push("Declared integrity metadata contradicts observed bytes.");
					}
					context.occurrences.push(occurrence);
					if (expandableAsar && digested !== undefined && digested.classification.format === "asar" && !digested.mismatched) {
						const nested = new AsarArtifactReader(entry.adapterKey, context.asarHeaderAdmission === undefined ? {} : { headerAdmission: context.asarHeaderAdmission });
						context.ownedReaders.push(nested);
						await nested.prepareContainer(digested.node.sha256, context.signal);
						context.expandedContainerIds.add(occurrence.occurrence_id);
						stack.push({
							reader: nested,
							prefix: logicalPath,
							containerId: occurrence.occurrence_id,
							iterator: inventoryEntries(context, nested, logicalPath)
						});
					}
				}
			} catch (cause) {
				failure = { cause };
			} finally {
				for (const { iterator, prefix, reader } of stack.reverse()) {
					try {
						await iterator.return?.();
					} catch (cause) {
						failure = { cause: ArtifactReaderFailure.withCleanup(failure === undefined ? cause : failure.cause, ArtifactReaderFailure.cleanupObservation(cause, `artifact traversal for ${prefix || reader.format}`)) };
					}
				}
			}
			if (failure !== undefined) throw failure.cause;
		};
		digestArtifactEntry = async (context, currentReader, entry, logicalPath, occurrence) => {
			if (entry.kind !== "file" && entry.kind !== "slice" || entry.encrypted) return undefined;
			const reconstruction = currentReader === context.reader ? context.reconstruction : undefined;
			if (reconstruction !== undefined && entry.byteOffset !== reconstruction.bytes) throw new ArtifactReaderFailure("integrity", "Noncontiguous iNES regions");
			const digest = await hashReadable(await currentReader.open(entry, context.signal), context.signal, entry.declaredIntegrity?.algorithm, context.asarHeaderAdmission, reconstruction === undefined ? undefined : (chunk) => {
				reconstruction.hash.update(chunk);
				reconstruction.bytes += chunk.length;
			});
			reconstruction?.regionOrder.push(entry.path);
			const claim = entry.declaredIntegrity;
			const observed = claim?.algorithm === "md5" ? digest.md5 : digest.sha256;
			if (claim !== null && observed === undefined) throw new ArtifactReaderFailure("integrity", "The selected integrity digest was not computed");
			const mismatched = claim !== null && claim.digest !== observed;
			if (mismatched && claim !== null && observed !== undefined) {
				if (context.integrity === "fail") throw new ArtifactReaderFailure("integrity", `Artifact integrity metadata disagrees with content: ${logicalPath}`, undefined, artifactIntegrityDetails(logicalPath, claim, observed, entry.unpacked));
				context.pendingContradictions.push({
					occurrence,
					integrity: artifactIntegrityPair(claim, observed),
					entryKind: entry.kind,
					unpacked: entry.unpacked
				});
			}
			const classified = entry.kind === "slice" ? {
				kind: "universal-slice",
				format: "mach-o",
				contentFormat: classifyArtifactBytes(digest, digest.bytes)
			} : classifyArtifactContent(logicalPath, digest, digest.bytes);
			return {
				node: createArtifactNode({
					sha256: digest.sha256,
					size: digest.bytes,
					format: classified.contentFormat,
					contentState: "embedded"
				}),
				mismatched,
				classification: classified
			};
		};
		isExpandableAsar = (entry, logicalPath) => entry.kind === "file" && logicalPath.toLowerCase().endsWith(".asar") && isAbsolute(entry.adapterKey);
	})))();
}

//#endregion
//#region dist/artifacts/inventory/scanCanonical.js
var scanCanonicalArtifactInventoryInScope, scanCanonicalArtifactInventoryForExtractionInScope, scanCanonical, cleanupInventoryOwners, buildInventorySnapshot, buildIntegrityContradictions, verifyRootDigest, sortNodes, sortOccurrences, sortEdges, buildManifest, buildLimitations;
function init_scanCanonical() {
	return (init_scanCanonical = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_AsarArtifactReader();
		init_InesArtifactReader();
		init_zipPackageFormat();
		init_ArtifactReader();
		init_artifactGraph();
		init_ArtifactGraphConstruction();
		init_artifactIdentity();
		init_classify();
		init_hostExecutableMarking();
		init_hashStableRootArtifact();
		init_reader();
		init_scanReader();
		scanCanonicalArtifactInventoryInScope = async (path, options, readerFactory = createReader, selectedPath = path) => (await scanCanonical(path, options, readerFactory, "release", undefined, selectedPath)).snapshot;
		scanCanonicalArtifactInventoryForExtractionInScope = async (path, options, probeFacts, selectedPath = path) => scanCanonical(path, options, createReader, "transfer-source", probeFacts, selectedPath);
		scanCanonical = async (path, options, readerFactory, rootDisposition, probeFacts, selectedPath = path) => {
			const metadata = await lstat(path);
			const { format: rootFormat, digest: rootDigest, rootSource, readerAdmission } = await classifyAndHashRootForInventory(path, metadata.isDirectory(), metadata, {
				...options,
				selectedPath
			}, probeFacts);
			let reader;
			let readerCreationFailure;
			try {
				reader = readerFactory(path, rootFormat, options.environment ?? {}, readerAdmission, options.asarHeaderAdmission, selectedPath);
			} catch (cause) {
				readerCreationFailure = { cause };
			}
			const ownedReaders = reader === undefined ? [] : [reader];
			let outcome;
			try {
				if (readerCreationFailure !== undefined) throw readerCreationFailure.cause;
				if (reader instanceof AsarArtifactReader) await reader.prepareContainer(rootDigest?.sha256, options.signal);
				const { nodes, occurrences, pendingContradictions, caseCollisionLimitation, inesRegionScan, unknownParentOccurrences, traversal, rootContradiction } = await scanReader(reader, ownedReaders, options.signal, options.integrity, options.asarHeaderAdmission);
				outcome = {
					kind: "completed",
					snapshot: await buildInventorySnapshot({
						path,
						metadata,
						rootFormat,
						rootDigest,
						rootSource,
						resourceScope: options.resourceScope,
						reader,
						signal: options.signal,
						nodes,
						occurrences,
						pendingContradictions,
						caseCollisionLimitation,
						inesRegionScan,
						unknownParentOccurrences,
						traversal,
						rootContradiction
					})
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
				if (rootFormat === "dmg" && cause instanceof ArtifactReaderFailure && cause.reason === "unavailable" && cause.partialObservation === undefined && options.signal?.aborted !== true) {
					let retained;
					let rootFailure;
					try {
						retained = await buildInventorySnapshot({
							path,
							metadata,
							rootFormat,
							rootDigest,
							rootSource,
							resourceScope: options.resourceScope,
							reader,
							signal: options.signal,
							nodes: new Map(),
							occurrences: [],
							pendingContradictions: [],
							caseCollisionLimitation: undefined,
							inesRegionScan: undefined,
							unknownParentOccurrences: new Set(),
							rootContradiction: undefined,
							traversal: {
								status: "unknown",
								limitations: [`DMG child traversal was unavailable: ${cause.message}`]
							}
						});
					} catch (failure) {
						rootFailure = failure;
					}
					outcome = {
						kind: "failed",
						cause: new ArtifactReaderFailure(cause.reason, rootFailure === undefined ? cause.message : `${cause.message}; root observations could not be revalidated: ${rootFailure instanceof Error ? rootFailure.message : String(rootFailure)}`, {
							cause: rootFailure === undefined ? cause : new AggregateError([cause, rootFailure], "DMG traversal and root revalidation failed", { cause }),
							cleanup: cause.cleanup,
							cleanupLeases: cause.cleanupLeases,
							userMessage: cause.userMessage,
							...retained === undefined ? {} : { partialObservation: {
								kind: "artifact-inventory",
								inventory: retained
							} }
						}, cause.details)
					};
				}
			}
			const cleanup = await cleanupInventoryOwners({
				path,
				options,
				rootSource,
				ownedReaders,
				readerAdmission,
				outcome,
				rootDisposition: rootDisposition === "transfer-source" && outcome.kind === "completed" && rootSource !== undefined && (isZipPackageFormat(rootFormat) || rootFormat === "ines" || readerAdmission !== undefined && "kind" in readerAdmission) ? "transfer" : "release"
			});
			if (cleanup.failure !== undefined) throw cleanup.failure;
			if (cleanup.outcome.kind === "failed") throw cleanup.outcome.cause;
			return {
				snapshot: cleanup.outcome.snapshot,
				transferredSource: cleanup.transferred
			};
		};
		cleanupInventoryOwners = async ({ path, options, rootSource, ownedReaders, readerAdmission, outcome, rootDisposition }) => {
			let finalOutcome = outcome;
			let cleanupFailure;
			const observeCancellation = () => {
				if (finalOutcome.kind === "completed" && cleanupFailure === undefined && options.signal?.aborted === true) finalOutcome = {
					kind: "failed",
					cause: new ArtifactReaderFailure("cancelled", "Artifact inventory cancelled during finalization", {
						cause: options.signal.reason,
						partialObservation: {
							kind: "artifact-inventory",
							inventory: finalOutcome.snapshot
						}
					})
				};
			};
			observeCancellation();
			const readerOwners = [...ownedReaders].reverse().map((reader) => ({
				kind: "reader",
				reader,
				resource: `artifact reader for ${path}`
			}));
			const rootOwner = rootSource === undefined ? undefined : {
				kind: "file-handle",
				handle: rootSource.owner,
				resource: `root artifact descriptor for ${path}`
			};
			for (const owner of readerOwners) {
				const attempt = await options.resourceScope.release(owner);
				observeCancellation();
				if (attempt.kind === "released") continue;
				cleanupFailure = options.resourceScope.cleanupFailure(cleanupFailure === undefined ? finalOutcome : {
					kind: "failed",
					cause: cleanupFailure
				}, [attempt], outcome.kind === "completed" ? {
					kind: "artifact-inventory",
					inventory: outcome.snapshot
				} : undefined);
			}
			if (rootDisposition === "transfer" && finalOutcome.kind === "completed" && cleanupFailure === undefined && rootSource !== undefined && rootOwner !== undefined && readerAdmission !== undefined) return {
				failure: undefined,
				transferred: {
					owner: rootOwner,
					admission: readerAdmission
				},
				outcome: finalOutcome
			};
			if (rootOwner !== undefined) {
				const attempt = await options.resourceScope.release(rootOwner);
				observeCancellation();
				if (attempt.kind === "failed") cleanupFailure = options.resourceScope.cleanupFailure(cleanupFailure === undefined ? finalOutcome : {
					kind: "failed",
					cause: cleanupFailure
				}, [attempt], outcome.kind === "completed" ? {
					kind: "artifact-inventory",
					inventory: outcome.snapshot
				} : undefined);
			}
			return {
				failure: cleanupFailure,
				transferred: undefined,
				outcome: finalOutcome
			};
		};
		buildInventorySnapshot = async (input) => {
			const { path, metadata, rootFormat, rootDigest, rootSource, reader, signal } = input;
			materializeDirectoryNodes(input.occurrences, input.nodes);
			const rootNode = createRootNode({
				digest: rootDigest,
				occurrences: input.occurrences
			});
			input.nodes.set(rootNode.artifact_id, rootNode);
			rekeyOccurrences(rootNode.artifact_id, input.occurrences);
			const rootOccurrence = rootOccurrenceFor(rootNode, {
				size: metadata.size,
				executable: hostExecutableMarking(path, metadata),
				format: rootFormat,
				path,
				formatMetadata: reader?.formatMetadata?.()
			});
			for (const occurrence of input.occurrences) if (occurrence.parent_occurrence_id === null && !input.unknownParentOccurrences.has(occurrence)) occurrence.parent_occurrence_id = rootOccurrence.occurrence_id;
			input.occurrences.unshift(rootOccurrence);
			if (input.rootContradiction !== undefined) {
				rootOccurrence.hash_status = "mismatched";
				rootOccurrence.limitations.push("Declared integrity metadata contradicts observed bytes.");
				input.pendingContradictions.push({
					occurrence: rootOccurrence,
					integrity: input.rootContradiction,
					entryKind: "file",
					unpacked: false
				});
			}
			const occurrenceById = new Map(input.occurrences.map((occurrence) => [occurrence.occurrence_id, occurrence]));
			const integrityContradictions = buildIntegrityContradictions(input.pendingContradictions, occurrenceById, rootNode);
			const edgeResult = createArtifactEdges(rootNode.artifact_id, input.occurrences, reader?.provenance()[0]);
			const { edges } = edgeResult;
			const orderedNodes = sortNodes([...input.nodes.values()]);
			const orderedOccurrences = sortOccurrences(input.occurrences);
			const orderedEdges = sortEdges(edges).map((edge, ordinal) => ({
				...edge,
				ordinal
			}));
			await verifyRootDigest(path, rootDigest, rootSource, input.resourceScope, signal);
			const graphSha256 = artifactGraphDigest({
				nodes: orderedNodes,
				occurrences: orderedOccurrences,
				edges: orderedEdges,
				contradictions: integrityContradictions
			});
			const manifest = buildManifest({
				rootNode,
				rootFormat,
				graphSha256,
				orderedNodes,
				orderedOccurrences,
				orderedEdges
			});
			let ines;
			if (reader instanceof InesArtifactReader) {
				if (rootDigest === null || input.inesRegionScan === undefined) throw new ArtifactReaderFailure("integrity", "Missing iNES reconstruction scan");
				ines = await reader.verifyReconstruction(rootDigest.sha256, input.inesRegionScan, signal);
			}
			const traversal = inventoryCoverage(rootFormat, reader, input.traversal);
			const coverage = edgeResult.limitations.length === 0 ? traversal.coverage : {
				...traversal.coverage,
				status: "unknown"
			};
			return {
				manifest,
				...ines === undefined ? {} : { ines },
				nodes: orderedNodes,
				occurrences: orderedOccurrences,
				edges: orderedEdges,
				provenance: reader?.provenance() ?? [],
				integrity_contradictions: integrityContradictions,
				coverage,
				limitations: buildLimitations([...traversal.limitations, ...edgeResult.limitations], integrityContradictions, input.caseCollisionLimitation)
			};
		};
		buildIntegrityContradictions = (pending, occurrenceById, rootNode) => pending.map((contradiction) => {
			const occurrence = contradiction.occurrence;
			const parent = occurrence.parent_occurrence_id === null ? undefined : occurrenceById.get(occurrence.parent_occurrence_id);
			const parentArtifactId = parent?.artifact_id ?? rootNode.artifact_id;
			return {
				contradiction_id: artifactContradictionId({
					rootArtifactId: rootNode.artifact_id,
					logicalPath: occurrence.logical_path,
					integrity: contradiction.integrity
				}),
				occurrence_id: occurrence.occurrence_id,
				parent_artifact_id: parentArtifactId,
				logical_path: occurrence.logical_path,
				...contradiction.integrity,
				entry_kind: contradiction.entryKind,
				unpacked: contradiction.unpacked,
				trust: "observed-untrusted",
				provenance: "container-integrity-metadata-versus-observed-bytes",
				limitations: ["Observed bytes contradict declared integrity metadata and cannot support equivalence."]
			};
		});
		verifyRootDigest = async (path, rootDigest, rootSource, resourceScope, signal) => {
			if (rootDigest === null) return;
			const verified = rootSource === undefined ? await hashStableRootArtifact(path, resourceScope, signal) : await hashStableRootArtifactHandle(path, rootSource.handle, rootSource.initial, signal);
			if (verified.sha256 !== rootDigest.sha256 || verified.bytes !== rootDigest.bytes) throw new ArtifactReaderFailure("integrity", "Root artifact changed during inventory");
		};
		sortNodes = (nodes) => nodes.sort((left, right) => compareUnicodeCodePoints(left.artifact_id, right.artifact_id));
		sortOccurrences = (occurrences) => occurrences.sort((left, right) => compareUnicodeCodePoints(left.logical_path, right.logical_path));
		sortEdges = (edges) => edges.sort((left, right) => compareUnicodeCodePoints(left.edge_id, right.edge_id));
		buildManifest = ({ rootNode, rootFormat, graphSha256, orderedNodes, orderedOccurrences, orderedEdges }) => artifactInventoryResultSchema.shape.manifest.parse({
			manifest_id: artifactManifestId(rootNode.artifact_id, graphSha256),
			root_artifact_id: rootNode.artifact_id,
			root_sha256: rootNode.sha256,
			root_format: rootFormat,
			graph_sha256: graphSha256,
			node_count: orderedNodes.length,
			occurrence_count: orderedOccurrences.length,
			edge_count: orderedEdges.length
		});
		buildLimitations = (scopeLimitations, integrityContradictions, caseCollisionLimitation) => [
			...scopeLimitations,
			...caseCollisionLimitation === undefined ? [] : [caseCollisionLimitation],
			...integrityContradictions.length === 0 ? [] : [`${String(integrityContradictions.length)} integrity contradiction(s) were recorded; mismatched content is observed-untrusted.`]
		];
	})))();
}

//#endregion
export { ArtifactEmbeddedFormatProbes, ArtifactTraversalObservation, AsarArtifactReader, InesArtifactReader, artifactFormatDescriptor, assertAdmittedRootDigest, createArtifactReader, init_ArtifactEmbeddedFormatProbes, init_ArtifactTraversalObservation, init_AsarArtifactReader, init_InesArtifactReader, init_artifactFormats, init_classify, init_createArtifactReader, init_scanCanonical, scanCanonicalArtifactInventoryForExtractionInScope, scanCanonicalArtifactInventoryInScope };