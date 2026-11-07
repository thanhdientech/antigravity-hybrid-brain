import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ArtifactOperationError, analysisSettingLimit, err, init_analysisSettingDefinitions, init_artifactOperationError, init_jsonSerialization, init_result, jsonParts, ok } from "./jsonLines-CKG28FwL.js";
import { ArtifactReaderFailure, OwnedFileHandle, RegularFileCancelled, RegularFileCleanupFailure, RegularFileOperationCancelled, init_ArtifactReader, init_OwnedFileHandle, init_OwnedRegularFile, init_RegularFile, sameArtifactSourceIdentity, withOwnedFileHandle } from "./ArtifactReader-DJ9rniiL.js";
import { AnalysisCleanupLease, init_AnalysisCleanupLease } from "./AnalysisCleanupLease-DZIxbgES.js";
import { AnalysisError, init_analysisErrorBase } from "./analysisErrorCore-Dm6oHouq.js";
import { ArtifactFileCancelled, ArtifactFileCleanupFailure, artifactFileCancellationCause, artifactSelectedPathErrno, assertArtifactReadActive, bindArtifactFileCleanup, init_ArtifactFileOperation } from "./ArtifactFileOperation-YawaP_UN.js";
import { BinaryFormatFailure, BinaryResourceFailure, init_BinaryContainer } from "./BinaryContainer-ko58VRqA.js";
import { init_dosMz, init_peCoffHeader, init_peOptionalHeader, parseMzHeaderEvidence, readPeCoffHeader, readPeOptionalHeaderStructure } from "./peOptionalHeader-DFX4E6Yt.js";
import { hasGodotPckHeader, init_godotPckFormat, init_peSectionHeader, readGodotPckTrailerFacts, readPeSectionHeader } from "./espFlashLocation-BGP6V_tl.js";
import { OwnedDirectoryHandle, init_OwnedDirectoryHandle } from "./OwnedDirectoryHandle-Cq1F1Ded.js";
import { init_readArtifactFileChunks, readArtifactFileChunks } from "./readArtifactFileChunks-wfySSpVr.js";
import { constants } from "node:fs";
import { extname, isAbsolute, join, relative, sep } from "node:path";
import { lstat, open, opendir, realpath, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { scheduler, setImmediate } from "node:timers/promises";
import { Readable } from "node:stream";

//#region dist/gpu/GpuSource.js
var GPU_OBJECT_BYTES, GPU_REPORT_BYTES, GpuReportCapacityFailure, rejectGpu, gpuCount, checkGpuRange, GpuFileSource, GpuBufferSource, readGpuNativeDirectory, gpuSha256, nextGpuContainerOffset;
function init_GpuSource() {
	return (init_GpuSource = __esmMin((() => {
		init_ArtifactFileOperation();
		init_ArtifactReader();
		init_BinaryContainer();
		GPU_OBJECT_BYTES = 128 * 1024 * 1024;
		GPU_REPORT_BYTES = 16 * 1024 * 1024;
		GpuReportCapacityFailure = class extends BinaryResourceFailure {
			constructor() {
				super("structure", GPU_REPORT_BYTES, "GPU facts exceed the 16 MiB retained report budget");
			}
		};
		rejectGpu = (message) => {
			throw new BinaryFormatFailure("malformed", message);
		};
		gpuCount = (value) => {
			if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) rejectGpu("GPU range exceeds exact host offset precision");
			return Number(value);
		};
		checkGpuRange = (length, offset, size) => {
			if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 || offset > length || size > length - offset) rejectGpu("GPU byte range is outside its containing object");
			if (size > 134217728) throw new BinaryResourceFailure("structure", GPU_OBJECT_BYTES, "GPU object exceeds the 128 MiB decoding budget");
		};
		GpuFileSource = class {
			file;
			size;
			signal;
			containerId = null;
			bytesRead = 0;
			constructor(file, size, signal) {
				this.file = file;
				this.size = size;
				this.signal = signal;
			}
			async read(offset, size) {
				checkGpuRange(this.size, offset, size);
				const bytes = Buffer.alloc(size);
				let position = 0;
				while (position < size) {
					assertArtifactReadActive(this.signal);
					const result = await this.file.read(bytes, position, size - position, offset + position);
					if (result.bytesRead === 0) throw new ArtifactReaderFailure("integrity", "GPU source was truncated during inspection");
					position += result.bytesRead;
					this.bytesRead += result.bytesRead;
				}
				return bytes;
			}
			async digest() {
				const hash = createHash("sha256");
				for (let position = 0; position < this.size;) {
					const bytes = await this.read(position, Math.min(1024 * 1024, this.size - position));
					hash.update(bytes);
					position += bytes.length;
				}
				return hash.digest("hex");
			}
		};
		GpuBufferSource = class {
			bytes;
			containerId;
			size;
			constructor(bytes, containerId) {
				this.bytes = bytes;
				this.containerId = containerId;
				this.size = bytes.length;
			}
			async read(offset, size) {
				checkGpuRange(this.size, offset, size);
				return this.bytes.subarray(offset, offset + size);
			}
		};
		readGpuNativeDirectory = async (source, steps) => {
			let next = steps.next();
			while (!next.done) {
				const { offset, size } = next.value;
				next = steps.next(await source.read(offset, size));
			}
			return next.value;
		};
		gpuSha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
		nextGpuContainerOffset = async (source, start) => {
			let width = 64;
			for (let position = start; position < source.size;) {
				const bytes = await source.read(position, Math.min(width, source.size - position));
				const index = bytes.findIndex((byte) => byte !== 0);
				if (index >= 0) return position + index;
				position += bytes.length;
				width = 65536;
			}
			return source.size;
		};
	})))();
}

//#endregion
//#region dist/gpu/Lz4Block.js
var decodeLz4Block;
function init_Lz4Block() {
	return (init_Lz4Block = __esmMin((() => {
		init_ArtifactFileOperation();
		init_GpuSource();
		init_BinaryContainer();
		decodeLz4Block = async (input, expected, signal) => {
			if (!Number.isSafeInteger(expected) || expected < 0 || expected > 134217728) throw new BinaryResourceFailure("structure", GPU_OBJECT_BYTES, "LZ4 decoded length exceeds the object budget");
			const output = Buffer.alloc(expected);
			let read = 0, write = 0, checkpoint = 0;
			const byte = () => {
				if (read >= input.length) return rejectGpu("Truncated LZ4 block");
				return input[read++];
			};
			const length = (nibble, remaining) => {
				let total = nibble;
				if (nibble === 15) {
					let extra;
					do {
						extra = byte();
						if (extra > remaining - total) rejectGpu("LZ4 length exceeds its declared output");
						total += extra;
					} while (extra === 255);
				}
				if (total > remaining) rejectGpu("LZ4 length exceeds its declared output");
				return total;
			};
			while (read < input.length) {
				if (write - checkpoint >= 4 * 1024 * 1024) {
					await scheduler.yield();
					checkpoint = write;
				}
				assertArtifactReadActive(signal);
				const token = byte();
				const literals = length(token >>> 4, expected - write);
				if (literals > input.length - read) rejectGpu("LZ4 literals exceed their encoded input");
				input.copy(output, write, read, read + literals);
				read += literals;
				write += literals;
				if (read === input.length) break;
				const distance = byte() | byte() << 8;
				if (distance === 0 || distance > write) rejectGpu("LZ4 match has an invalid backward distance");
				const match = length(token & 15, expected - write - 4) + 4;
				let copied = Math.min(distance, match);
				output.copy(output, write, write - distance, write - distance + copied);
				while (copied < match) {
					const count = Math.min(copied, match - copied);
					output.copy(output, write + copied, write, write + count);
					copied += count;
				}
				write += match;
			}
			if (write !== expected) rejectGpu("LZ4 decoded length disagrees with its declaration");
			assertArtifactReadActive(signal);
			return output;
		};
	})))();
}

//#endregion
//#region dist/domain/native/elfNoteLayout.js
var elfNoteAlignment, elfNoteLayout, readElfNoteHeader;
function init_elfNoteLayout() {
	return (init_elfNoteLayout = __esmMin((() => {
		init_result();
		elfNoteAlignment = (declared) => declared === 8 || declared === 8n ? 8 : 4;
		elfNoteLayout = (namesz, descsz, alignment) => {
			const descriptor = Math.ceil((12 + namesz) / alignment) * alignment;
			return {
				descriptor,
				next: Math.ceil((descriptor + descsz) / alignment) * alignment
			};
		};
		readElfNoteHeader = (bytes, littleEndian) => {
			if (bytes.byteLength < 12) return err({
				kind: "malformed",
				message: "ELF note header is truncated"
			});
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			return ok({
				namesz: view.getUint32(0, littleEndian),
				descsz: view.getUint32(4, littleEndian),
				type: view.getUint32(8, littleEndian)
			});
		};
	})))();
}

//#endregion
//#region dist/artifacts/hostExecutableMarking.js
var windowsLaunchableExtensions, hostExecutableMarking;
function init_hostExecutableMarking() {
	return (init_hostExecutableMarking = __esmMin((() => {
		windowsLaunchableExtensions = new Set([
			".bat",
			".cmd",
			".com",
			".exe"
		]);
		hostExecutableMarking = (path, metadata, platform = process.platform) => metadata.isSymbolicLink() ? false : platform === "win32" ? metadata.isFile() && windowsLaunchableExtensions.has(extname(path).toLowerCase()) : typeof metadata.mode === "bigint" ? (metadata.mode & 73n) !== 0n : (metadata.mode & 73) !== 0;
	})))();
}

//#endregion
//#region dist/filesystem/decodeDirectoryEntryName.js
var decodeDirectoryEntryName;
function init_decodeDirectoryEntryName() {
	return (init_decodeDirectoryEntryName = __esmMin((() => {
		decodeDirectoryEntryName = (raw) => {
			if (typeof raw === "string") return {
				kind: "decoded",
				name: raw
			};
			const name = raw.toString("utf8");
			return Buffer.from(name, "utf8").equals(raw) ? {
				kind: "decoded",
				name
			} : {
				kind: "unrepresentable",
				rawHex: raw.toString("hex")
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactSelectedSource.js
var resolveArtifactSourcePath, assertArtifactSelectedSource;
function init_ArtifactSelectedSource() {
	return (init_ArtifactSelectedSource = __esmMin((() => {
		init_ArtifactReader();
		init_ArtifactFileOperation();
		resolveArtifactSourcePath = async (path) => {
			await stat(path);
			return realpath(path);
		};
		assertArtifactSelectedSource = async (canonicalPath, selectedPath) => {
			if (selectedPath === undefined) return;
			const changed = (cause) => new ArtifactReaderFailure("integrity", `Selected artifact no longer resolves to its admitted source: ${selectedPath}`, {
				userMessage: "The selected artifact path no longer names the opened file. Reopen the selected artifact, then retry.",
				...cause === undefined ? {} : { cause }
			});
			let current;
			try {
				current = await resolveArtifactSourcePath(selectedPath);
			} catch (cause) {
				if (artifactSelectedPathErrno(cause) !== undefined) throw changed(cause);
				throw cause;
			}
			if (current !== canonicalPath) throw changed();
		};
	})))();
}

//#endregion
//#region dist/artifacts/DirectoryArtifactReader.js
var DirectoryArtifactTraversalLimit, DirectoryArtifactRootFailure, DirectoryArtifactEntryAccessDenied, DirectoryArtifactReader, unsupportedEntryKind, artifactEntry, safeArtifactSize, directoryIoFailure, hostErrorCode, entryOpenFailure, failureMessage, mapStableFileRead, withDirectoryIoContext, abortIfNeeded, assertContainedDirectory;
function init_DirectoryArtifactReader() {
	return (init_DirectoryArtifactReader = __esmMin((() => {
		init_ArtifactReader();
		init_hostExecutableMarking();
		init_OwnedDirectoryHandle();
		init_OwnedFileHandle();
		init_readArtifactFileChunks();
		init_OwnedRegularFile();
		init_RegularFile();
		init_ArtifactFileOperation();
		init_AnalysisCleanupLease();
		init_decodeDirectoryEntryName();
		init_ArtifactSelectedSource();
		DirectoryArtifactTraversalLimit = class extends ArtifactReaderFailure {
			examinedEntries;
			maximumEntries;
			constructor(examinedEntries, maximumEntries) {
				super("limit", "Directory traversal reached its examined-entry budget", { boundary: "capacity" });
				this.examinedEntries = examinedEntries;
				this.maximumEntries = maximumEntries;
			}
		};
		DirectoryArtifactRootFailure = class extends ArtifactReaderFailure {};
		DirectoryArtifactEntryAccessDenied = class extends ArtifactReaderFailure {
			systemCode;
			entryPath;
			constructor(systemCode, entryPath, message, options) {
				super("io", message, options);
				this.systemCode = systemCode;
				this.entryPath = entryPath;
			}
		};
		DirectoryArtifactReader = class {
			unreadableDirectories;
			format = "directory";
			#rootPromise;
			#rootPath;
			#directories = new Set();
			#files = new Map();
			#fileCleanup = new WeakMap();
			constructor(root, unreadableDirectories = "fail") {
				this.unreadableDirectories = unreadableDirectories;
				this.#rootPath = root;
			}
			/** Enumerate entries, optionally restricting descent while retaining directories. */
			async *entries(signal, selection) {
				const admittedRoot = await this.#resolveRoot();
				const root = admittedRoot.canonicalPath;
				const options = typeof selection === "function" ? { descendInto: selection } : selection;
				const maximum = options?.maximumEntries;
				if (maximum !== undefined && (!Number.isSafeInteger(maximum) || maximum < 0)) throw new RangeError("Directory traversal maximumEntries must be a nonnegative safe integer");
				let examined = 0;
				const examine = () => {
					if (maximum !== undefined && examined >= maximum) throw new DirectoryArtifactTraversalLimit(examined, maximum);
					examined += 1;
				};
				const pending = [root];
				let unrepresentableNameCount = 0;
				let firstUnrepresentableNameHex;
				while (pending.length > 0) {
					abortIfNeeded(signal);
					const directory = pending.pop();
					if (directory === undefined) break;
					await withDirectoryIoContext("inspect directory", directory, () => assertContainedDirectory(root, directory, admittedRoot.identity));
					try {
						for await (const entry of this.#readDirectory(directory, pending, signal, options, examine, (rawHex) => {
							unrepresentableNameCount += 1;
							firstUnrepresentableNameHex ??= rawHex;
						})) yield entry;
					} catch (cause) {
						if (this.unreadableDirectories !== "omit" || !(cause instanceof DirectoryArtifactEntryAccessDenied)) throw cause;
						abortIfNeeded(signal);
						options?.onOmission?.({
							path: cause.entryPath,
							kind: "directory-descendants"
						});
						options?.onCoverage?.({
							status: "unknown",
							limitations: [cause.message]
						});
						continue;
					}
					await withDirectoryIoContext("inspect directory", directory, () => assertContainedDirectory(root, directory, admittedRoot.identity));
				}
				if (unrepresentableNameCount > 0) options?.onCoverage?.({
					status: "unknown",
					examinedEntries: examined,
					limitations: [`Directory contains ${String(unrepresentableNameCount)} entry name(s) that are not valid UTF-8; no filesystem operations were performed for them. First raw basename bytes: ${firstUnrepresentableNameHex ?? "unknown"}.`]
				});
			}
			/** Admission facts, shared with traversal; the selected root may be a symlink. */
			rootObservation() {
				return this.#resolveRoot();
			}
			async #resolveRoot() {
				return this.#rootPromise ??= (async () => {
					const root = await resolveArtifactSourcePath(this.#rootPath);
					const metadata = await lstat(root, { bigint: true });
					if (metadata.isSymbolicLink()) throw new ArtifactReaderFailure("path", "Artifact root changed during traversal");
					if (!metadata.isDirectory()) throw new DirectoryArtifactRootFailure("path", "Artifact root must be a directory");
					return Object.freeze({
						canonicalPath: root,
						identity: Object.freeze({
							dev: metadata.dev,
							ino: metadata.ino
						})
					});
				})().catch((cause) => {
					if (cause instanceof ArtifactReaderFailure) throw cause;
					throw directoryIoFailure("resolve artifact root", this.#rootPath, cause, DirectoryArtifactRootFailure);
				});
			}
			async *#readDirectory(directory, pending, signal, options, examine, noteUnrepresentableName) {
				const admittedRoot = await this.#resolveRoot();
				const root = admittedRoot.canonicalPath;
				const handle = new OwnedDirectoryHandle(await opendir(directory, { encoding: "buffer" }).catch((cause) => {
					const code = hostErrorCode(cause);
					if (directory !== root && (code === "EACCES" || code === "EPERM")) throw new DirectoryArtifactEntryAccessDenied(code, relative(root, directory).split(sep).join("/"), directoryIoFailure("open directory", directory, cause).message, { cause });
					throw directoryIoFailure("open directory", directory, cause, directory === root ? DirectoryArtifactRootFailure : ArtifactReaderFailure);
				}));
				this.#directories.add(handle);
				const childDirectories = [];
				let traversal = { kind: "complete" };
				try {
					for (;;) {
						await withDirectoryIoContext("inspect directory", directory, () => assertContainedDirectory(root, directory, admittedRoot.identity));
						const child = await handle.handle.read();
						if (child === null) break;
						examine();
						abortIfNeeded(signal);
						const decoded = decodeDirectoryEntryName(child.name);
						if (decoded.kind === "unrepresentable") {
							noteUnrepresentableName(decoded.rawHex);
							continue;
						}
						const absolute = join(directory, decoded.name);
						const metadata = await lstat(absolute, { bigint: true }).catch((cause) => {
							throw directoryIoFailure("inspect entry", absolute, cause);
						});
						const path = relative(root, absolute).split(sep).join("/");
						const entry = artifactEntry(path, absolute, metadata);
						if (entry === undefined) {
							options?.onOmission?.({
								path,
								kind: unsupportedEntryKind(metadata)
							});
							continue;
						}
						yield entry;
						if (entry.kind === "directory") {
							if (options?.descendInto?.(path) ?? true) childDirectories.push(absolute);
							else options?.onOmission?.({
								path,
								kind: "directory-descendants"
							});
						}
					}
				} catch (cause) {
					traversal = {
						kind: "failed",
						cause: cause instanceof ArtifactReaderFailure ? cause : directoryIoFailure("read directory", directory, cause)
					};
				} finally {
					await this.#finishDirectory(handle, directory, traversal);
				}
				if (traversal.kind === "failed") throw traversal.cause;
				childDirectories.reverse();
				pending.push(...childDirectories);
			}
			async #finishDirectory(handle, path, traversal) {
				try {
					await handle.close();
					this.#directories.delete(handle);
				} catch (cause) {
					const closeFailure = directoryIoFailure("close directory", path, cause);
					if (traversal.kind === "failed") throw ArtifactReaderFailure.withCleanup(traversal.cause, ArtifactReaderFailure.cleanupObservation(closeFailure, path));
					throw closeFailure;
				}
			}
			async #openFile(entry, signal) {
				abortIfNeeded(signal);
				await this.#validateRoot();
				if (entry.kind !== "file") throw new ArtifactReaderFailure("format", "Only regular files can be opened");
				const fileHandle = await open(entry.adapterKey, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK).catch((cause) => {
					throw entryOpenFailure(entry, cause);
				});
				const owner = new OwnedFileHandle(fileHandle);
				this.#files.set(owner, entry.adapterKey);
				try {
					const observed = await owner.handle.stat({ bigint: true }).catch((cause) => {
						throw directoryIoFailure("inspect opened entry", entry.adapterKey, cause);
					});
					if (!observed.isFile() || !sameArtifactSourceIdentity(entry.sourceIdentity, observed)) {
						throw new ArtifactReaderFailure("integrity", `Directory entry changed before open: ${entry.path}`);
					}
					abortIfNeeded(signal);
					return owner;
				} catch (cause) {
					try {
						await this.#closeFile(owner);
					} catch (closeCause) {
						throw ArtifactReaderFailure.withCleanup(cause, ArtifactReaderFailure.cleanupObservation(directoryIoFailure("close opened entry", entry.adapterKey, closeCause), entry.adapterKey));
					}
					throw cause;
				}
			}
			async #validateRoot() {
				const root = await this.#resolveRoot();
				await withDirectoryIoContext("inspect artifact root", root.canonicalPath, () => assertContainedDirectory(root.canonicalPath, root.canonicalPath, root.identity, "integrity"));
			}
			/** Borrow an admitted entry for bounded random reads; retain failed cleanup. */
			async inspectFile(entry, inspect, signal) {
				const owner = await this.#openFile(entry, signal);
				try {
					const value = await withOwnedFileHandle(entry.adapterKey, owner, signal === undefined ? {} : { signal }, async (file) => {
						let outcome;
						try {
							outcome = {
								kind: "completed",
								value: await inspect(file)
							};
						} catch (cause) {
							outcome = {
								kind: "failed",
								cause
							};
						}
						const [opened, named] = await Promise.all([
							file.stat({ bigint: true }),
							lstat(entry.adapterKey, { bigint: true }),
							this.#validateRoot()
						]).catch((validationCause) => {
							if (outcome.kind !== "failed") throw validationCause;
							throw new ArtifactReaderFailure("io", `Directory inspection failed: ${failureMessage(outcome.cause)}; final source identity could not be validated: ${failureMessage(validationCause)}`, { cause: new AggregateError([outcome.cause, validationCause], "Directory inspection and final source validation failed") });
						});
						if (!opened.isFile() || !named.isFile() || !sameArtifactSourceIdentity(entry.sourceIdentity, opened) || !sameArtifactSourceIdentity(entry.sourceIdentity, named)) throw new ArtifactReaderFailure("integrity", `Directory entry changed during inspection: ${entry.path}${outcome.kind === "failed" ? `; inspection failed: ${failureMessage(outcome.cause)}` : ""}`, outcome.kind === "failed" ? { cause: outcome.cause } : {});
						if (outcome.kind === "failed") throw outcome.cause;
						abortIfNeeded(signal);
						return outcome.value;
					});
					this.#files.delete(owner);
					return value;
				} catch (cause) {
					if (cause instanceof RegularFileCleanupFailure) {
						const lease = new AnalysisCleanupLease(() => this.#closeFile(owner), [entry.adapterKey]);
						this.#fileCleanup.set(owner, lease);
						throw new ArtifactFileCleanupFailure(cause, lease);
					}
					this.#files.delete(owner);
					if (cause instanceof RegularFileCancelled) throw new ArtifactFileCancelled(cause);
					if (cause instanceof RegularFileOperationCancelled) throw new ArtifactReaderFailure("cancelled", "Directory inspection cancelled", { cause: cause.reason });
					throw directoryIoFailure("inspect entry", entry.adapterKey, cause);
				}
			}
			async open(entry, signal) {
				const owner = await this.#openFile(entry, signal);
				const source = Readable.from(mapStableFileRead(owner.handle, entry, () => this.#validateRoot(), signal), { objectMode: false });
				source.once("close", () => {
					void this.#closeFile(owner).catch(() => undefined);
				});
				return source;
			}
			async close() {
				const failures = [];
				for (const [owner, path] of this.#files) {
					try {
						const lease = this.#fileCleanup.get(owner);
						if (lease === undefined) await this.#closeFile(owner);
						else await lease.release();
					} catch (cause) {
						failures.push(directoryIoFailure("close opened entry", path, cause));
					}
				}
				for (const owner of this.#directories) {
					try {
						await owner.close();
						this.#directories.delete(owner);
					} catch (cause) {
						failures.push(directoryIoFailure("close directory", owner.handle.path, cause));
					}
				}
				if (failures.length > 0) {
					const reason = failures.map(failureMessage).join("; ");
					throw new ArtifactReaderFailure("io", `Directory artifact cleanup failed: ${reason}`, {
						cause: new AggregateError(failures),
						cleanup: {
							reason,
							resources: [...this.#files.values(), ...[...this.#directories].map((owner) => owner.handle.path)]
						}
					});
				}
			}
			async #closeFile(owner) {
				await owner.close();
				this.#files.delete(owner);
				this.#fileCleanup.delete(owner);
			}
			provenance() {
				return [];
			}
		};
		unsupportedEntryKind = (metadata) => metadata.isFIFO() ? "fifo" : metadata.isSocket() ? "socket" : metadata.isBlockDevice() ? "block-device" : metadata.isCharacterDevice() ? "character-device" : "unsupported";
		artifactEntry = (path, absolute, metadata) => {
			const kind = metadata.isSymbolicLink() ? "symlink" : metadata.isDirectory() ? "directory" : metadata.isFile() ? "file" : undefined;
			if (kind === undefined) return undefined;
			return {
				path,
				kind,
				declaredSize: kind === "file" ? safeArtifactSize(metadata.size) : null,
				compressedSize: null,
				executable: hostExecutableMarking(absolute, metadata),
				encrypted: false,
				byteOffset: null,
				declaredIntegrity: null,
				unpacked: false,
				limitations: kind === "symlink" ? ["Symlink target was not followed or disclosed."] : [],
				adapterKey: absolute,
				...kind === "file" ? { sourceIdentity: {
					device: metadata.dev,
					inode: metadata.ino,
					size: metadata.size,
					mode: metadata.mode,
					mtimeNs: metadata.mtimeNs,
					ctimeNs: metadata.ctimeNs
				} } : {}
			};
		};
		safeArtifactSize = (size) => {
			if (size < 0n || size > BigInt(Number.MAX_SAFE_INTEGER)) return null;
			return Number(size);
		};
		directoryIoFailure = (operation, path, cause, Failure = ArtifactReaderFailure) => {
			if (cause instanceof ArtifactReaderFailure) return cause;
			const code = hostErrorCode(cause);
			const suffix = code === undefined ? "" : ` (${code})`;
			const detail = failureMessage(cause);
			return new Failure("io", `Could not ${operation} at ${path}${suffix}: ${detail}`, { cause });
		};
		hostErrorCode = (cause) => typeof cause === "object" && cause !== null && "code" in cause && typeof cause.code === "string" ? cause.code : undefined;
		entryOpenFailure = (entry, cause) => {
			const failure = directoryIoFailure("open entry", entry.adapterKey, cause);
			const code = hostErrorCode(cause);
			return code === "EACCES" || code === "EPERM" ? new DirectoryArtifactEntryAccessDenied(code, entry.path, failure.message, { cause }) : failure;
		};
		failureMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
		mapStableFileRead = async function* (handle, entry, validateRoot, signal) {
			let bytes = 0n;
			try {
				const expectedBytes = entry.sourceIdentity?.size;
				if (expectedBytes === undefined) throw new ArtifactReaderFailure("integrity", `Directory entry has no captured file state: ${entry.path}`);
				for await (const chunk of readArtifactFileChunks(handle, {
					end: expectedBytes,
					signal
				})) {
					abortIfNeeded(signal);
					bytes += BigInt(chunk.length);
					yield chunk;
				}
				abortIfNeeded(signal);
				const [opened, current] = await Promise.all([
					handle.stat({ bigint: true }),
					lstat(entry.adapterKey, { bigint: true }),
					validateRoot()
				]);
				abortIfNeeded(signal);
				if (!opened.isFile() || !current.isFile() || !sameArtifactSourceIdentity(entry.sourceIdentity, opened) || !sameArtifactSourceIdentity(entry.sourceIdentity, current) || bytes !== expectedBytes) throw new ArtifactReaderFailure("integrity", `Directory entry changed during read: ${entry.path}`);
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && [
					"ENOENT",
					"ENOTDIR",
					"ELOOP"
				].includes(String(cause.code))) throw new ArtifactReaderFailure("integrity", `Directory entry changed during read: ${entry.path}`, { cause });
				if (!(cause instanceof ArtifactReaderFailure)) throw directoryIoFailure("validate read entry", entry.adapterKey, cause);
				throw cause;
			}
		};
		withDirectoryIoContext = async (operation, path, action) => {
			try {
				return await action();
			} catch (cause) {
				throw directoryIoFailure(operation, path, cause);
			}
		};
		abortIfNeeded = (signal) => {
			if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Artifact traversal cancelled", { cause: signal.reason });
		};
		assertContainedDirectory = async (root, directory, rootIdentity, failureReason = "path") => {
			const canonical = await realpath(directory);
			const fromRoot = relative(root, canonical);
			const metadata = await lstat(directory);
			const currentRoot = await lstat(root, { bigint: true });
			if (rootIdentity === undefined || currentRoot.dev !== rootIdentity.dev || currentRoot.ino !== rootIdentity.ino || metadata.isSymbolicLink() || !metadata.isDirectory() || fromRoot === ".." || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) throw new ArtifactReaderFailure(failureReason, "Directory traversal escaped or changed its artifact root");
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactOperationFailure.js
var translateArtifactFailure;
function init_ArtifactOperationFailure() {
	return (init_ArtifactOperationFailure = __esmMin((() => {
		init_analysisSettingDefinitions();
		init_analysisErrorBase();
		init_artifactOperationError();
		init_ArtifactReader();
		init_ArtifactFileOperation();
		translateArtifactFailure = (operation, cause) => {
			if (cause instanceof ArtifactReaderFailure) {
				const error = new ArtifactOperationError(operation, cause.reason, cause.details, cause.message, {
					...cause.userMessage === undefined ? {} : { userMessage: cause.userMessage },
					cause: cause.reason === "cancelled" ? artifactFileCancellationCause(cause) : cause,
					...cause.cleanup === undefined ? {} : { cleanup: cause.cleanup },
					...cause.partialObservation === undefined ? {} : { partialObservation: cause.partialObservation },
					...cause.admission === undefined ? {} : { admission: cause.admission },
					...cause.boundary === undefined ? {} : { boundary: cause.boundary }
				});
				if (cause.admission !== undefined) error.bindLimit({
					...analysisSettingLimit("asar.max_header_bytes", cause.admission.maximumBytes, cause.admission.source),
					...cause.admission.requiredBytes === undefined ? {} : { required_value: cause.admission.requiredBytes }
				});
				bindArtifactFileCleanup(cause, error);
				return error;
			}
			if (cause instanceof AnalysisError) return cause;
			return new ArtifactOperationError(operation, "io", undefined, undefined, { cause });
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactFileRange.js
var readArtifactFileBytes;
function init_ArtifactFileRange() {
	return (init_ArtifactFileRange = __esmMin((() => {
		init_ArtifactReader();
		init_ArtifactFileOperation();
		readArtifactFileBytes = async (handle, position, length, end, signal) => {
			if (!Number.isSafeInteger(end) || end < 0 || !Number.isSafeInteger(position) || !Number.isSafeInteger(length) || length < 0 || position < 0 || length > end - position) throw new ArtifactReaderFailure("format", "Artifact read exceeds its source range");
			const buffer = Buffer.alloc(length);
			let consumed = 0;
			while (consumed < length) {
				assertArtifactReadActive(signal);
				const { bytesRead } = await handle.read(buffer, consumed, length - consumed, position + consumed);
				assertArtifactReadActive(signal);
				if (bytesRead === 0) throw new ArtifactReaderFailure("format", "Artifact source is truncated");
				consumed += bytesRead;
			}
			return buffer;
		};
	})))();
}

//#endregion
//#region dist/artifacts/GodotPckLocation.js
var observeEmbeddedGodotPck, locateGodotPck;
function init_GodotPckLocation() {
	return (init_GodotPckLocation = __esmMin((() => {
		init_godotPckFormat();
		init_ArtifactFileRange();
		init_ArtifactFileOperation();
		observeEmbeddedGodotPck = async (size, headerBytes, read) => {
			const trailer = await read(size - 12, 12, size);
			const declaration = readGodotPckTrailerFacts(trailer, size);
			if (declaration.state === "absent") return declaration;
			const { start, end, packBytes } = declaration;
			if (start === null || packBytes < BigInt(headerBytes)) return {
				state: "invalid-extent",
				declaration
			};
			const header = await read(start, headerBytes, end);
			if (!hasGodotPckHeader(header)) return {
				state: "header-mismatch",
				declaration
			};
			return {
				state: "located",
				declaration,
				start,
				header
			};
		};
		locateGodotPck = async (handle, size, signal, prefix) => {
			assertArtifactReadActive(signal);
			if (!Number.isSafeInteger(size) || size < 4) return undefined;
			const magic = prefix !== undefined && prefix.length >= 4 ? Buffer.from(prefix.buffer, prefix.byteOffset, 4) : await readArtifactFileBytes(handle, 0, 4, size, signal);
			if (hasGodotPckHeader(magic)) return {
				start: 0,
				end: size,
				embedded: false
			};
			if (size < 12) return undefined;
			const observation = await observeEmbeddedGodotPck(size, 4, (offset, bytes, end) => readArtifactFileBytes(handle, offset, bytes, end, signal));
			if (observation.state !== "located") return undefined;
			return {
				start: observation.start,
				end: observation.declaration.end,
				embedded: true
			};
		};
	})))();
}

//#endregion
//#region dist/domain/python/pythonBytecodeIdentity.js
var identities, range, PYTHON_BYTECODE_IDENTITIES, pythonBytecodeIdentity, observePythonBytecodePrefix;
function init_pythonBytecodeIdentity() {
	return (init_pythonBytecodeIdentity = __esmMin((() => {
		identities = (values, pythonVersion, headerBytes = 16) => values.map((magic) => [magic, {
			pythonVersion,
			headerBytes
		}]);
		range = (start, end) => Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
		PYTHON_BYTECODE_IDENTITIES = new Map([
			...identities([3390, 3391], "3.7", 12),
			...identities([
				3392,
				3393,
				3394
			], "3.7"),
			...identities([
				3400,
				3401,
				3410,
				3411,
				3412,
				3413
			], "3.8"),
			...identities(range(3420, 3425), "3.9"),
			...identities(range(3430, 3439), "3.10"),
			...identities([3494, 3495], "3.11"),
			...identities(range(3500, 3531), "3.12"),
			...identities(range(3550, 3571), "3.13"),
			...identities([3627], "3.14")
		]);
		pythonBytecodeIdentity = (magic) => PYTHON_BYTECODE_IDENTITIES.get(magic) ?? null;
		observePythonBytecodePrefix = (bytes) => {
			const prefix = bytes.subarray(0, 4);
			const magic = prefix.byteLength < 2 ? null : new DataView(prefix.buffer, prefix.byteOffset, prefix.byteLength).getUint16(0, true);
			if (prefix.byteLength < 4 || magic === null) return {
				state: "incomplete",
				prefix,
				magic,
				identity: null
			};
			if (prefix[2] !== 13 || prefix[3] !== 10) return {
				state: "invalid-crlf",
				prefix,
				magic,
				identity: null
			};
			return {
				state: "framed",
				prefix,
				magic,
				identity: pythonBytecodeIdentity(magic)
			};
		};
	})))();
}

//#endregion
//#region dist/domain/python/marshalUtf8.js
var UTF8, spanPrefixEnd, decodeMarshalUtf8;
function init_marshalUtf8() {
	return (init_marshalUtf8 = __esmMin((() => {
		init_result();
		UTF8 = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
		spanPrefixEnd = (text, limit) => {
			const end = Math.min(text.length, limit);
			return end > 0 && end < text.length && text.charCodeAt(end - 1) >= 55296 && text.charCodeAt(end - 1) <= 56319 && text.charCodeAt(end) >= 56320 && text.charCodeAt(end) <= 57343 ? end - 1 : end;
		};
		decodeMarshalUtf8 = (bytes, maximumPrefixUnits = Infinity) => {
			if (maximumPrefixUnits !== Infinity && (!Number.isSafeInteger(maximumPrefixUnits) || maximumPrefixUnits < 0)) throw new RangeError("Marshal prefix limit must be a nonnegative safe integer.");
			const chunks = [];
			let start = 0;
			let prefixEnd = 0;
			let prefixOpen = true;
			const append = (text) => {
				if (text.length !== 0) chunks.push(text);
				if (!prefixOpen) return;
				const end = spanPrefixEnd(text, maximumPrefixUnits - prefixEnd);
				prefixEnd += end;
				prefixOpen = end === text.length && prefixEnd < maximumPrefixUnits;
			};
			try {
				for (let offset = bytes.indexOf(237); offset !== -1; offset = bytes.indexOf(237, offset + 1)) {
					const second = bytes[offset + 1];
					const third = bytes[offset + 2];
					if (second === undefined || second < 160 || second > 191 || third === undefined || third < 128 || third > 191) continue;
					append(UTF8.decode(bytes.subarray(start, offset)));
					append(String.fromCharCode(53248 | (second & 63) << 6 | third & 63));
					start = offset + 3;
					offset += 2;
				}
				if (start === 0) {
					const text = UTF8.decode(bytes);
					return ok({
						text,
						prefixEnd: spanPrefixEnd(text, maximumPrefixUnits)
					});
				}
				append(UTF8.decode(bytes.subarray(start)));
				return ok({
					text: chunks.join(""),
					prefixEnd
				});
			} catch (cause) {
				if (cause instanceof TypeError) return err({ kind: "invalid-marshal-utf8" });
				throw cause;
			}
		};
	})))();
}

//#endregion
//#region dist/native/pe/PeResourceTreeFacts.js
var PE_RESOURCE_DIRECTORY_BYTES, PE_RESOURCE_ENTRY_BYTES, PE_RESOURCE_NAME_PREFIX_BYTES, readPeResourceDirectoryFacts, readPeResourceEntryFacts, readPeResourceNameFacts;
function init_PeResourceTreeFacts() {
	return (init_PeResourceTreeFacts = __esmMin((() => {
		PE_RESOURCE_DIRECTORY_BYTES = 16;
		PE_RESOURCE_ENTRY_BYTES = 8;
		PE_RESOURCE_NAME_PREFIX_BYTES = 2;
		readPeResourceDirectoryFacts = (bytes) => {
			const namedEntries = bytes.readUInt16LE(12);
			const idEntries = bytes.readUInt16LE(14);
			return {
				characteristics: bytes.readUInt32LE(0),
				timestamp: bytes.readUInt32LE(4),
				majorVersion: bytes.readUInt16LE(8),
				minorVersion: bytes.readUInt16LE(10),
				namedEntries,
				idEntries,
				entryCount: namedEntries + idEntries
			};
		};
		readPeResourceEntryFacts = (bytes) => {
			const encodedIdentity = bytes.readUInt32LE(0);
			const encodedTarget = bytes.readUInt32LE(4);
			const identity = (encodedIdentity & 2147483648) === 0 ? {
				kind: "id",
				id: encodedIdentity
			} : {
				kind: "name",
				offset: encodedIdentity & 2147483647
			};
			return {
				identity,
				target: {
					kind: (encodedTarget & 2147483648) === 0 ? "data" : "directory",
					offset: encodedTarget & 2147483647
				}
			};
		};
		readPeResourceNameFacts = (bytes) => {
			const utf16Units = bytes.readUInt16LE(0);
			return {
				utf16Units,
				payloadBytes: utf16Units * 2
			};
		};
	})))();
}

//#endregion
//#region dist/native/pe/PeResourceLayout.js
var OPTIONAL_HEADER_FAILURES, peFailure, requirePeRange, requirePeExtent, virtualExtent, intersectsResource, readPeHeaders, readPeResourceLayout, hasPeResourceName;
function init_PeResourceLayout() {
	return (init_PeResourceLayout = __esmMin((() => {
		init_PeResourceTreeFacts();
		init_dosMz();
		init_BinaryContainer();
		init_peCoffHeader();
		init_peSectionHeader();
		init_ArtifactReader();
		init_peOptionalHeader();
		OPTIONAL_HEADER_FAILURES = {
			"truncated-magic": "Truncated PE optional header.",
			"unsupported-magic": "Unsupported PE optional header magic.",
			"truncated-fixed-fields": "Truncated PE data directory count.",
			"truncated-directory-table": "PE directory count exceeds its optional header."
		};
		peFailure = (message) => {
			throw new ArtifactReaderFailure("format", message);
		};
		requirePeRange = (bytes, offset, length) => requirePeExtent(bytes.length, offset, length);
		requirePeExtent = (fileSize, offset, length) => {
			if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 0 || offset > fileSize - length) peFailure(`PE range ${String(offset)} + ${String(length)} leaves the artifact.`);
		};
		virtualExtent = (section) => section.virtualSize === 0 ? section.size : section.virtualSize;
		intersectsResource = (section, rva, size) => {
			const extent = virtualExtent(section);
			return extent > 0 && section.rva < rva + Math.max(size, 1) && rva < section.rva + extent;
		};
		readPeHeaders = (bytes, fileSize = bytes.length) => {
			requirePeRange(bytes, 0, 64);
			if (bytes.readUInt16LE(0) !== 23117) peFailure("Expected an MZ PE image.");
			const evidence = parseMzHeaderEvidence(bytes, fileSize);
			const observed = evidence.windowsHeader;
			if (observed.state === "absent" && evidence.dos.ok) throw new BinaryFormatFailure("unsupported", "DOS MZ images do not contain PE resource or certificate tables");
			if (observed.state === "candidate" || observed.state === "signature-needed") requirePeRange(bytes, observed.offset, 24);
			if (observed.state !== "declared" || observed.signature !== "PE") return peFailure("MZ header does not declare a PE image in the inspected bytes.");
			const pe = observed.offset;
			requirePeRange(bytes, pe, 24);
			const coff = readPeCoffHeader(bytes.subarray(pe + 4, pe + 24));
			if (!coff.ok) return peFailure(coff.error.message);
			const { sectionCount, optionalHeaderSize: optionalSize, machine } = coff.value;
			const optionalHeaderOffset = pe + 24;
			requirePeRange(bytes, optionalHeaderOffset, optionalSize);
			if (optionalSize < 64) peFailure("Truncated PE optional header.");
			const parsed = readPeOptionalHeaderStructure(bytes.subarray(optionalHeaderOffset, optionalHeaderOffset + optionalSize));
			if (!parsed.ok) return peFailure(OPTIONAL_HEADER_FAILURES[parsed.error.reason]);
			const { sizeOfHeaders: headerSize, format, directoryOffset, dataDirectories } = parsed.value;
			const table = optionalHeaderOffset + optionalSize;
			requirePeRange(bytes, table, sectionCount * 40);
			if (headerSize < table + sectionCount * 40 || headerSize > fileSize) peFailure("Invalid PE SizeOfHeaders.");
			return {
				machine,
				format,
				sectionCount,
				optionalHeaderOffset,
				directoryOffset,
				dataDirectories,
				headerSize,
				table
			};
		};
		readPeResourceLayout = (bytes, fileSize = bytes.length) => {
			const { machine, format, sectionCount, optionalHeaderOffset, directoryOffset, dataDirectories, headerSize, table } = readPeHeaders(bytes, fileSize);
			const sections = [];
			for (let index = 0; index < sectionCount; index++) {
				const at = table + index * 40;
				const parsed = readPeSectionHeader(bytes.subarray(at, at + 40));
				if (!parsed.ok) return peFailure(parsed.error.message);
				const row = parsed.value;
				const section = {
					rva: row.virtual_address,
					virtualSize: row.virtual_size,
					offset: row.offset,
					size: row.raw_size
				};
				if (section.rva + virtualExtent(section) > 4294967296) peFailure("PE section RVA range overflows.");
				if (section.size > 0) {
					requirePeExtent(fileSize, section.offset, section.size);
					if (section.offset < headerSize) peFailure("PE section raw bytes overlap headers.");
				}
				sections.push(section);
			}
			const backed = sections.filter(({ size }) => size > 0).sort((left, right) => left.offset - right.offset);
			for (let index = 1; index < backed.length; index++) {
				const previous = backed[index - 1];
				const current = backed[index];
				if (previous !== undefined && current !== undefined && current.offset < previous.offset + previous.size) peFailure("PE sections have overlapping raw file ranges.");
			}
			const map = (rva, size) => {
				if (rva + size > 4294967296) peFailure("Resource RVA range overflows.");
				const containing = sections.filter((section) => rva >= section.rva && rva - section.rva < virtualExtent(section));
				const candidates = size === 0 && containing.length === 0 ? sections.filter((section) => virtualExtent(section) > 0 && rva - section.rva === virtualExtent(section)) : containing;
				if (rva < headerSize) {
					if (sections.some((section) => intersectsResource(section, rva, size)) || size > headerSize - rva) peFailure("Ambiguous resource header RVA mapping.");
					requirePeExtent(fileSize, rva, size);
					return rva;
				}
				if (candidates.length !== 1) peFailure("Resource RVA has missing or overlapping section mappings.");
				const section = candidates[0];
				if (section === undefined) return peFailure("Missing resource section.");
				const within = rva - section.rva;
				if (size > virtualExtent(section) - within) peFailure("Resource range leaves its section's virtual size.");
				if (within > section.size || size > section.size - within) peFailure("Resource range is not entirely file-backed in one section.");
				if (sections.some((other) => other !== section && intersectsResource(other, rva, size))) peFailure("Resource interval intersects overlapping virtual sections.");
				const offset = section.offset + within;
				requirePeExtent(fileSize, offset, size);
				return offset;
			};
			const resource = dataDirectories[2];
			const directoryAt = optionalHeaderOffset + (resource?.offset ?? directoryOffset + 2 * 8);
			const rva = resource?.address ?? 0;
			const size = resource?.size ?? 0;
			if (rva === 0 !== (size === 0)) peFailure("Inconsistent PE resource directory RVA/size.");
			return {
				format,
				machine,
				directoryAt,
				rva,
				size,
				map
			};
		};
		hasPeResourceName = async (headers, fileSize, read, typeId, name, maxEntries) => {
			let layout;
			let root;
			try {
				layout = readPeResourceLayout(headers, fileSize);
				if (layout.size < 16) return false;
				root = layout.map(layout.rva, layout.size);
			} catch (cause) {
				if (cause instanceof ArtifactReaderFailure && cause.reason === "format") return false;
				throw cause;
			}
			const { size } = layout;
			const relative = (at, length) => at < 0 || at > size - length ? Promise.resolve(undefined) : read(root + at, length);
			let examined = 0;
			const directory = async (at) => {
				const header = await relative(at, 16);
				if (header === undefined) return undefined;
				const { entryCount: entries } = readPeResourceDirectoryFacts(header);
				if (entries > maxEntries - examined) return undefined;
				examined += entries;
				return relative(at + 16, entries * 8);
			};
			const types = await directory(0);
			if (types === undefined) return false;
			const expected = Buffer.from(name, "utf16le");
			for (let at = 0; at < types.length; at += 8) {
				const type = readPeResourceEntryFacts(types.subarray(at, at + 8));
				if (type.identity.kind !== "id" || type.identity.id !== typeId) continue;
				if (type.target.kind !== "directory") continue;
				const names = await directory(type.target.offset);
				if (names === undefined) continue;
				for (let entry = 0; entry < names.length; entry += 8) {
					const { identity } = readPeResourceEntryFacts(names.subarray(entry, entry + 8));
					if (identity.kind !== "name") continue;
					const nameAt = identity.offset;
					const length = await relative(nameAt, 2);
					if (length === undefined || readPeResourceNameFacts(length).utf16Units !== name.length) continue;
					const candidate = await relative(nameAt + 2, expected.length);
					if (candidate?.equals(expected)) return true;
				}
			}
			return false;
		};
	})))();
}

//#endregion
//#region dist/native/pe/PeResourceParser.js
var PE_RESOURCE_METADATA_BYTES, METADATA_BYTES, limit, jsonBytes, identityKey, parsePeResources, rejectOverlappingRanges, readIconGroups;
function init_PeResourceParser() {
	return (init_PeResourceParser = __esmMin((() => {
		init_PeResourceTreeFacts();
		init_ArtifactFileOperation();
		init_ArtifactReader();
		init_jsonSerialization();
		init_PeResourceLayout();
		PE_RESOURCE_METADATA_BYTES = 8 * 1024 * 1024;
		METADATA_BYTES = PE_RESOURCE_METADATA_BYTES;
		limit = (message, boundary) => {
			throw new ArtifactReaderFailure("limit", message, { boundary });
		};
		jsonBytes = (value, maximum) => {
			let size = 0;
			for (const part of jsonParts(value)) {
				size += Buffer.byteLength(part, "utf8");
				if (size > maximum) return size;
			}
			return size;
		};
		identityKey = (id) => id.kind === "id" ? `id:${String(id.id)}` : `name:${id.utf16le_hex}`;
		parsePeResources = async (bytes, artifact, input, signal, admittedLayout) => {
			assertArtifactReadActive(signal);
			const layout = admittedLayout ?? readPeResourceLayout(bytes);
			const directories = [];
			const resources = [];
			const occupied = [];
			const names = new Map();
			let examined = 0;
			let metadataBytes = 0;
			const ensureCapacity = (projectedBytes) => {
				if (metadataBytes + projectedBytes > METADATA_BYTES) limit("PE resource metadata exceeds the 8 MiB complete-result allocation budget.", "memory");
			};
			const accountBytes = (projectedBytes) => {
				ensureCapacity(projectedBytes);
				metadataBytes += projectedBytes;
			};
			const account = (value) => {
				accountBytes(jsonBytes(value, METADATA_BYTES - metadataBytes - 1) + 1);
			};
			const reserveDecodedName = (utf16Units) => {
				const projectedBytes = 10 * utf16Units + 256;
				ensureCapacity(projectedBytes);
			};
			const root = layout.size === 0 ? 0 : layout.map(layout.rva, layout.size);
			const relative = (at, length) => {
				if (at > layout.size - length || at < 0) peFailure("Resource directory offset leaves the declared resource interval.");
				requirePeRange(bytes, root + at, length);
				return root + at;
			};
			const recordRange = (offset, size, kind) => {
				const range = {
					offset,
					bytes: size
				};
				if (size > 0) occupied.push({
					...range,
					kind
				});
				return range;
			};
			const readIdentity = (declaration) => {
				if (declaration.kind === "id") return {
					kind: "id",
					id: declaration.id
				};
				const at = declaration.offset;
				const previous = names.get(at);
				if (previous !== undefined) return previous;
				if (at % 2 !== 0) peFailure("Unaligned PE resource name.");
				const start = relative(at, 2);
				const { utf16Units, payloadBytes: length } = readPeResourceNameFacts(bytes.subarray(start, start + 2));
				reserveDecodedName(utf16Units);
				relative(at, 2 + length);
				const raw = bytes.subarray(start + 2, start + 2 + length);
				const value = {
					kind: "name",
					name: raw.toString("utf16le"),
					utf16le_hex: raw.toString("hex"),
					location: recordRange(start, 2 + length, "name")
				};
				names.set(at, value);
				return value;
			};
			const visit = async (at, path, entryLocations, ancestors) => {
				if (ancestors.has(at)) peFailure("Cyclic PE resource directory.");
				const header = relative(at, 16);
				const facts = readPeResourceDirectoryFacts(bytes.subarray(header, header + 16));
				const { namedEntries: named, idEntries: ids, entryCount: count } = facts;
				if (count > input.max_entries - examined) limit("PE resource directory entry budget exceeded; no partial inventory was returned.", "capacity");
				examined += count;
				relative(at, 16 + 8 * count);
				const directory = {
					path,
					entry_locations: entryLocations,
					location: recordRange(header, 16 + 8 * count, "directory"),
					characteristics: facts.characteristics,
					timestamp: facts.timestamp,
					major_version: facts.majorVersion,
					minor_version: facts.minorVersion,
					named_entries: named,
					id_entries: ids
				};
				account(directory);
				directories.push(directory);
				const keys = new Set();
				const nested = new Set([...ancestors, at]);
				for (let index = 0; index < count; index++) {
					if (index % 128 === 0) {
						await setImmediate();
						assertArtifactReadActive(signal);
					}
					const entry = header + 16 + index * 8;
					const record = readPeResourceEntryFacts(bytes.subarray(entry, entry + 8));
					if (record.identity.kind === "name" !== index < named) peFailure("Resource name/ID entry counts disagree with encoded identities.");
					const identity = readIdentity(record.identity);
					const key = identityKey(identity);
					if (keys.has(key)) peFailure("Duplicate identity within a resource directory.");
					keys.add(key);
					const next = [...path, identity];
					const locations = [...entryLocations, {
						offset: entry,
						bytes: 8
					}];
					const { offset } = record.target;
					if (record.target.kind === "directory") {
						if (next.length >= 3) peFailure("Unsupported resource tree deeper than type/name/language.");
						await visit(offset, next, locations, nested);
					} else {
						if (next.length !== 3) peFailure("Unsupported resource leaf outside the type/name/language profile.");
						const data = relative(offset, 16);
						const rva = bytes.readUInt32LE(data);
						const size = bytes.readUInt32LE(data + 4);
						const payloadOffset = layout.map(rva, size);
						const [type, name, language] = next;
						if (type === undefined || name === undefined || language === undefined) return peFailure("Incomplete resource identity.");
						const resource = {
							index: resources.length,
							type,
							name,
							language,
							entry_locations: locations,
							data_entry_location: recordRange(data, 16, "data-entry"),
							code_page: bytes.readUInt32LE(data + 8),
							reserved: bytes.readUInt32LE(data + 12),
							payload: {
								rva,
								location: recordRange(payloadOffset, size, "payload"),
								sha256: "0".repeat(64)
							}
						};
						account(resource);
						resources.push(resource);
					}
				}
			};
			if (layout.size > 0) await visit(0, [], [], new Set());
			rejectOverlappingRanges(occupied);
			const hashes = new Map();
			for (const resource of resources) {
				const range = resource.payload.location;
				const key = `${String(range.offset)}:${String(range.bytes)}`;
				let digest = hashes.get(key);
				if (digest === undefined) {
					const hash = createHash("sha256");
					for (let offset = 0; offset < range.bytes; offset += 1048576) {
						await setImmediate();
						assertArtifactReadActive(signal);
						hash.update(bytes.subarray(range.offset + offset, range.offset + Math.min(range.bytes, offset + 1048576)));
					}
					digest = hash.digest("hex");
					hashes.set(key, digest);
				}
				resource.payload.sha256 = digest;
			}
			const iconGroups = readIconGroups(bytes, resources, account, ensureCapacity);
			const report = {
				artifact,
				format: layout.format,
				machine: layout.machine,
				directory: layout.size === 0 ? null : {
					rva: layout.rva,
					location: {
						offset: root,
						bytes: layout.size
					},
					data_directory_location: {
						offset: layout.directoryAt,
						bytes: 8
					}
				},
				directories,
				resources,
				icon_groups: iconGroups,
				coverage: {
					status: "complete",
					examined_entries: examined,
					resources: resources.length
				},
				limitations: [
					"Static PE32/PE32+ type/name/language resource inventory; payloads other than RT_GROUP_ICON remain opaque.",
					"Icon candidates are resource-table relationships. Language fallback, image decoding and actual shell/window loading are not observed.",
					"Exact shared byte ranges are retained; non-identical overlapping resource structures or payloads are rejected."
				]
			};
			assertArtifactReadActive(signal);
			if (jsonBytes(report, METADATA_BYTES) > METADATA_BYTES) limit("PE resource result exceeds the 8 MiB allocation budget.", "memory");
			return report;
		};
		rejectOverlappingRanges = (ranges) => {
			ranges.sort((left, right) => left.offset - right.offset || right.bytes - left.bytes);
			let previous;
			for (const current of ranges) {
				if (previous !== undefined && current.offset < previous.offset + previous.bytes && (current.offset !== previous.offset || current.bytes !== previous.bytes || current.kind !== previous.kind)) peFailure("Non-identical resource byte ranges overlap.");
				previous = current;
			}
		};
		readIconGroups = (bytes, resources, account, ensureCapacity) => {
			const imagesById = new Map();
			for (const resource of resources) {
				if (resource.type.kind !== "id" || resource.type.id !== 3 || resource.name.kind !== "id") continue;
				const candidates = imagesById.get(resource.name.id) ?? [];
				candidates.push(resource);
				imagesById.set(resource.name.id, candidates);
			}
			return resources.filter((resource) => resource.type.kind === "id" && resource.type.id === 14).map((group) => {
				const { offset, bytes: size } = group.payload.location;
				if (size < 6 || bytes.readUInt16LE(offset) !== 0 || bytes.readUInt16LE(offset + 2) !== 1) peFailure("Malformed RT_GROUP_ICON header.");
				const count = bytes.readUInt16LE(offset + 4);
				if (size !== 6 + count * 14) peFailure("RT_GROUP_ICON length does not match its image count.");
				const images = [];
				for (let index = 0; index < count; index++) {
					const at = offset + 6 + index * 14;
					const id = bytes.readUInt16LE(at + 12);
					const candidates = imagesById.get(id) ?? [];
					const exact = candidates.find((resource) => identityKey(resource.language) === identityKey(group.language));
					ensureCapacity(302 + candidates.length * 11);
					const declaredBytes = bytes.readUInt32LE(at + 8);
					const image = {
						location: {
							offset: at,
							bytes: 14
						},
						width: bytes[at] ?? 0,
						height: bytes[at + 1] ?? 0,
						color_count: bytes[at + 2] ?? 0,
						reserved: bytes[at + 3] ?? 0,
						planes: bytes.readUInt16LE(at + 4),
						bit_count: bytes.readUInt16LE(at + 6),
						declared_bytes: declaredBytes,
						resource_id: id,
						candidate_resource_indices: candidates.map(({ index }) => index),
						same_language_resource_index: exact?.index ?? null,
						size_matches: exact === undefined ? null : exact.payload.location.bytes === declaredBytes
					};
					account(image);
					images.push(image);
				}
				account({
					resource_index: group.index,
					images: []
				});
				return {
					resource_index: group.index,
					images
				};
			});
		};
	})))();
}

//#endregion
//#region dist/firmware/devicetree/DevicetreeParser.js
var DevicetreeLimitFailure, malformed, align, hex, parseDevicetree;
function init_DevicetreeParser() {
	return (init_DevicetreeParser = __esmMin((() => {
		init_BinaryContainer();
		DevicetreeLimitFailure = class extends Error {
			limit;
			constructor(limit) {
				super(limit === "decoded_bytes" ? "Devicetree exceeds its fixed 32 MiB decoded representation allowance; select a smaller blob. This allowance has no runtime override." : `Devicetree exceeds ${limit}; raise that caller-selected limit within its schema ceiling or select a smaller blob.`);
				this.limit = limit;
			}
		};
		malformed = (message) => {
			throw new BinaryFormatFailure("malformed", message);
		};
		align = (n) => Math.ceil(n / 4) * 4;
		hex = (n) => `0x${n.toString(16)}`;
		parseDevicetree = (bytes, artifact, input) => {
			if (bytes.length > input.max_file_bytes) throw new DevicetreeLimitFailure("max_file_bytes");
			if (bytes.length < 28) malformed("Truncated FDT header");
			const u32 = (offset) => bytes.readUInt32BE(offset);
			if (u32(0) !== 3490578157) throw new BinaryFormatFailure("unsupported", "Not a flattened devicetree blob");
			const version = u32(20);
			if (version !== 16 && version !== 17) throw new BinaryFormatFailure("unsupported", `FDT version ${version} is unsupported; supported versions are 16 and 17`);
			const headerBytes = version === 17 ? 40 : 36;
			if (bytes.length < headerBytes) malformed("Truncated FDT header");
			const header = {
				magic: u32(0),
				totalsize: u32(4),
				off_dt_struct: u32(8),
				off_dt_strings: u32(12),
				off_mem_rsvmap: u32(16),
				version,
				last_comp_version: u32(24),
				boot_cpuid_phys: u32(28),
				size_dt_strings: u32(32),
				size_dt_struct: version === 17 ? u32(36) : null
			};
			const end = header.totalsize;
			if (end > bytes.length || end < headerBytes || header.last_comp_version > version || header.last_comp_version > 17) malformed("Invalid FDT header size or compatibility version");
			let decodedBytes = 0;
			const admit = (size) => {
				decodedBytes += size;
				if (decodedBytes > 33554432) throw new DevicetreeLimitFailure("decoded_bytes");
			};
			const ranges = [{
				start: 0,
				end: headerBytes
			}];
			const range = (start, size) => {
				if (size < 0 || start < headerBytes || start > end - size) malformed("FDT block outside totalsize");
				const r = {
					start,
					end: start + size
				};
				if (ranges.some((other) => r.start < other.end && other.start < r.end)) malformed("Overlapping FDT blocks");
				ranges.push(r);
			};
			if (header.off_dt_struct % 4 || header.off_mem_rsvmap % 8) malformed("Misaligned FDT block");
			range(header.off_dt_strings, header.size_dt_strings);
			const structEnd = header.size_dt_struct === null ? Math.min(end, ...[header.off_dt_strings, header.off_mem_rsvmap].filter((n) => n > header.off_dt_struct)) : header.off_dt_struct + header.size_dt_struct;
			range(header.off_dt_struct, structEnd - header.off_dt_struct);
			const reservations = [];
			let cursor = header.off_mem_rsvmap;
			const reservationEnd = Math.min(end, ...[header.off_dt_struct, header.off_dt_strings].filter((n) => n >= cursor));
			if (ranges.some((r) => cursor >= r.start && cursor < r.end)) malformed("Reservation block overlaps another FDT block");
			for (;;) {
				if (cursor > reservationEnd - 16) malformed("Unterminated or overlapping FDT reservation block");
				const address = bytes.readBigUInt64BE(cursor), size = bytes.readBigUInt64BE(cursor + 8);
				cursor += 16;
				if (address === 0n && size === 0n) break;
				if (reservations.length >= input.max_properties) throw new DevicetreeLimitFailure("max_properties");
				admit(128);
				reservations.push({
					offset: cursor - 16,
					address: hex(address),
					size: hex(size)
				});
			}
			range(header.off_mem_rsvmap, cursor - header.off_mem_rsvmap);
			const text = (start, stop) => {
				const nul = bytes.indexOf(0, start);
				if (nul < start || nul >= stop) return malformed("Unterminated FDT name");
				const raw = bytes.subarray(start, nul);
				if (raw.some((c) => c < 32 || c > 126)) malformed("Non-ASCII FDT name");
				admit(raw.length * 2);
				return {
					value: raw.toString("ascii"),
					next: nul + 1
				};
			};
			const names = new Map();
			const propertiesByPath = new Map();
			const nodes = [];
			const stack = [];
			const paths = new Set();
			let properties = 0, finished = false;
			cursor = header.off_dt_struct;
			const need = (n) => {
				if (cursor > structEnd - n) malformed("Truncated FDT structure token or property");
			};
			while (cursor < structEnd) {
				need(4);
				const offset = cursor, token = u32(cursor);
				cursor += 4;
				if (token === 1) {
					if (stack.length >= input.max_depth) throw new DevicetreeLimitFailure("max_depth");
					if (nodes.length >= input.max_nodes) throw new DevicetreeLimitFailure("max_nodes");
					const name = text(cursor, structEnd);
					cursor = align(name.next);
					need(0);
					const parent = stack.at(-1);
					if (name.value.includes("/") || !parent && (nodes.length > 0 || name.value !== "") || parent && !name.value) malformed("Invalid FDT node name or multiple roots");
					admit((parent?.node.path.length ?? 0) * 4 + name.value.length * 2 + 128);
					const path = parent ? `${parent.node.path === "/" ? "" : parent.node.path}/${name.value}` : "/";
					if (paths.has(path)) malformed("Duplicate FDT node path");
					paths.add(path);
					const node = {
						path,
						parent: parent?.node.path ?? null,
						offset,
						properties: []
					};
					if (parent) parent.children = true;
					propertiesByPath.set(path, new Map());
					nodes.push(node);
					stack.push({
						node,
						children: false
					});
				} else if (token === 2) {
					if (!stack.pop()) malformed("Unbalanced FDT_END_NODE");
				} else if (token === 3) {
					const owner = stack.at(-1);
					if (!owner || owner.children) return malformed("FDT property outside node or after children");
					need(8);
					const length = u32(cursor), nameoff = u32(cursor + 4);
					cursor += 8;
					need(length);
					if (++properties > input.max_properties) throw new DevicetreeLimitFailure("max_properties");
					if (nameoff >= header.size_dt_strings) malformed("FDT property string offset out of range");
					let name = names.get(nameoff);
					if (name === undefined) {
						name = text(header.off_dt_strings + nameoff, header.off_dt_strings + header.size_dt_strings).value;
						names.set(nameoff, name);
					}
					const propertyMap = propertiesByPath.get(owner.node.path);
					if (!name || propertyMap?.has(name)) malformed("Empty or duplicate FDT property name");
					admit(name.length * 2 + Math.min(length, 256) * 2 + 256);
					const raw = bytes.subarray(cursor, cursor + length);
					const stringProperty = [
						"compatible",
						"model",
						"status",
						"bootargs",
						"stdout-path"
					].includes(name) || owner.node.path === "/aliases";
					if (stringProperty) admit(raw.length * 4);
					let strings = null;
					if (stringProperty && raw.length > 0 && raw.at(-1) === 0 && raw.subarray(0, -1).every((c) => c === 0 || c >= 32 && c <= 126)) {
						let entries = 0;
						for (const byte of raw) if (byte === 0) entries++;
						admit(entries * 32);
						const repeatedInSummary = owner.node.path === "/" && name === "compatible" || entries === 1 && (owner.node.path === "/" && name === "model" || owner.node.path === "/chosen" && ["bootargs", "stdout-path"].includes(name) || owner.node.path === "/aliases");
						if (repeatedInSummary) admit(raw.length * 2 + entries * 3 + 2);
						strings = raw.subarray(0, -1).toString("ascii").split("\0");
					}
					const cells = [
						"phandle",
						"linux,phandle",
						"#address-cells",
						"#size-cells",
						"interrupt-parent",
						"remote-endpoint",
						"msi-parent"
					].includes(name) && length === 4 ? [raw.readUInt32BE(0)] : null;
					const property = {
						name,
						offset: cursor,
						bytes: length,
						hex: raw.subarray(0, 256).toString("hex"),
						truncated: length > 256,
						derived: {
							confidence: "derived",
							strings,
							cells,
							reg: null
						}
					};
					owner.node.properties.push(property);
					propertyMap?.set(name, property);
					cursor = align(cursor + length);
					need(0);
				} else if (token === 9) {
					if (stack.length || nodes.length === 0) malformed("Premature FDT_END");
					if (header.size_dt_struct !== null && cursor !== structEnd) malformed("FDT_END does not terminate the declared structure block");
					finished = true;
					break;
				} else if (token !== 4) malformed(`Unknown FDT token ${token}`);
			}
			if (!finished) malformed("Missing FDT_END");
			const byPath = new Map(nodes.map((n) => [n.path, n]));
			const prop = (path, name) => propertiesByPath.get(path)?.get(name);
			const singleString = (path, name) => {
				const s = prop(path, name)?.derived.strings;
				return s?.length === 1 ? s[0] ?? null : null;
			};
			const handles = new Map();
			const limitations = ["Raw property previews are limited to 256 bytes; offsets and lengths identify complete values in the hashed artifact.", "Phandle references cover only single-cell interrupt-parent, remote-endpoint and msi-parent; binding-specific arrays and overlays are not resolved."];
			for (const node of nodes) {
				const canonical = prop(node.path, "phandle");
				const legacy = prop(node.path, "linux,phandle");
				const malformedCanonical = canonical !== undefined && canonical.derived.cells === null;
				const declared = [canonical, legacy].flatMap((property) => {
					const handle = property?.derived.cells?.[0];
					return handle === undefined ? [] : [handle];
				});
				if (malformedCanonical) {
					admit(node.path.length * 2 + 256);
					limitations.push(`phandle at ${node.path} is not a single cell; this node's reference identity remains unresolved.`);
				}
				const conflict = declared.length === 2 && declared[0] !== declared[1];
				if (conflict) {
					admit(node.path.length * 2 + 256);
					limitations.push(`phandle at ${node.path} conflicts with linux,phandle (0x${declared[0]?.toString(16)} vs 0x${declared[1]?.toString(16)}); references to either value are unresolved.`);
				}
				const unambiguous = !malformedCanonical && !conflict;
				for (const handle of declared) if (handle !== 0 && handle !== 4294967295) {
					const existing = handles.get(handle);
					handles.set(handle, unambiguous && (existing === undefined || existing === node.path) ? node.path : null);
				}
				const reg = prop(node.path, "reg");
				if (!reg || node.parent === null) continue;
				const count = (name, fallback) => {
					const p = prop(node.parent ?? "", name);
					return p === undefined ? fallback : p.derived.cells?.[0];
				};
				const addresses = count("#address-cells", 2), sizes = count("#size-cells", 1);
				if (addresses === undefined || sizes === undefined || addresses > 4 || sizes > 4 || addresses + sizes === 0 || reg.bytes % ((addresses + sizes) * 4)) {
					admit(node.path.length * 2 + 256);
					limitations.push(`reg at ${node.path} was not decoded: unsupported or malformed parent cell sizes or tuple length.`);
					continue;
				}
				const readCells = (start, n) => {
					if (n === 0) return null;
					let value = 0n;
					for (let i = 0; i < n; i++) value = value << 32n | BigInt(u32(start + i * 4));
					return hex(value);
				};
				admit(reg.bytes / ((addresses + sizes) * 4) * 160);
				reg.derived.reg = [];
				for (let p = reg.offset; p < reg.offset + reg.bytes; p += (addresses + sizes) * 4) reg.derived.reg.push({
					address: readCells(p, addresses),
					size: readCells(p + addresses * 4, sizes)
				});
			}
			const references = [];
			for (const node of nodes) for (const property of node.properties) {
				const phandle = property.derived.cells?.[0];
				if ([
					"interrupt-parent",
					"remote-endpoint",
					"msi-parent"
				].includes(property.name) && phandle !== undefined) {
					const target = handles.get(phandle) ?? null;
					admit(256 + (node.path.length + property.name.length + (target?.length ?? 0)) * 2);
					references.push({
						source: node.path,
						property: property.name,
						phandle,
						target,
						confidence: "derived"
					});
				}
			}
			return {
				artifact,
				header,
				reservations,
				nodes,
				references,
				summary: {
					confidence: "derived",
					compatible: prop("/", "compatible")?.derived.strings ?? null,
					model: singleString("/", "model"),
					bootargs: singleString("/chosen", "bootargs"),
					stdout_path: singleString("/chosen", "stdout-path"),
					aliases: (byPath.get("/aliases")?.properties ?? []).map((p) => ({
						name: p.name,
						path: singleString("/aliases", p.name)
					}))
				},
				coverage: {
					status: "complete",
					examined_nodes: nodes.length,
					examined_properties: properties
				},
				limitations
			};
		};
	})))();
}

//#endregion
export { DevicetreeLimitFailure, DirectoryArtifactEntryAccessDenied, DirectoryArtifactReader, DirectoryArtifactRootFailure, DirectoryArtifactTraversalLimit, GPU_OBJECT_BYTES, GPU_REPORT_BYTES, GpuBufferSource, GpuFileSource, GpuReportCapacityFailure, PE_RESOURCE_METADATA_BYTES, assertArtifactSelectedSource, checkGpuRange, decodeDirectoryEntryName, decodeLz4Block, decodeMarshalUtf8, elfNoteAlignment, elfNoteLayout, gpuCount, gpuSha256, hasPeResourceName, hostExecutableMarking, init_ArtifactFileRange, init_ArtifactOperationFailure, init_ArtifactSelectedSource, init_DevicetreeParser, init_DirectoryArtifactReader, init_GodotPckLocation, init_GpuSource, init_Lz4Block, init_PeResourceLayout, init_PeResourceParser, init_decodeDirectoryEntryName, init_elfNoteLayout, init_hostExecutableMarking, init_marshalUtf8, init_pythonBytecodeIdentity, locateGodotPck, nextGpuContainerOffset, observeEmbeddedGodotPck, observePythonBytecodePrefix, parseDevicetree, parsePeResources, readArtifactFileBytes, readElfNoteHeader, readGpuNativeDirectory, readPeHeaders, readPeResourceLayout, rejectGpu, resolveArtifactSourcePath, translateArtifactFailure };