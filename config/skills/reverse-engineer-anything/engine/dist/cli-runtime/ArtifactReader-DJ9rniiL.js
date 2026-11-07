import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { fixedAllowanceRemediation, init_fixedAllowanceRemediation } from "./fixedAllowanceRemediation-Gm2892s1.js";
import { AnalysisError, init_analysisErrorBase } from "./analysisErrorCore-Dm6oHouq.js";
import { constants } from "node:fs";
import { constants as constants$1 } from "node:os";
import { lstat, open, stat } from "node:fs/promises";

//#region dist/filesystem/OwnedFileHandle.js
var OwnedFileHandleError, OwnedFileHandle;
function init_OwnedFileHandle() {
	return (init_OwnedFileHandle = __esmMin((() => {
		OwnedFileHandleError = class extends Error {
			code;
			_tag = "OwnedFileHandleError";
			constructor(code) {
				super(code);
				this.code = code;
				this.name = "OwnedFileHandleError";
			}
		};
		OwnedFileHandle = class {
			handle;
			#state = { kind: "open" };
			constructor(handle) {
				this.handle = handle;
			}
			/** Close the owned handle, retaining an unconfirmed close as a sticky failure. */
			close() {
				if (this.#state.kind === "closed") return Promise.resolve();
				if (this.#state.kind === "closing") return this.#state.attempt;
				if (this.#state.kind === "failed") return Promise.reject(this.#state.cause);
				if (this.handle.fd < 0) {
					const cause = new OwnedFileHandleError("handle_invalidated");
					this.#state = {
						kind: "failed",
						cause
					};
					return Promise.reject(cause);
				}
				const attempt = Promise.resolve().then(() => this.#attemptClose());
				this.#state = {
					kind: "closing",
					attempt
				};
				return attempt;
			}
			async #attemptClose() {
				try {
					await this.handle.close();
					this.#state = { kind: "closed" };
				} catch (cause) {
					this.#state = this.handle.fd < 0 ? {
						kind: "failed",
						cause
					} : { kind: "open" };
					throw cause;
				}
			}
		};
	})))();
}

//#endregion
//#region dist/filesystem/RegularFile.js
var RegularFileOperationCancelled, assertRegularFileActive, NonRegularFileReadError, RegularFileAdmissionFailure, RegularFileChangedError, UNRESOLVED_PATH_ERROR_CODES, isUnresolvedPathErrorCode, SELECTED_REGULAR_FILE_ERROR_CODES, isSelectedRegularFileError, openRegularFile, nonRegularOpenFailure, errnos, UNOPENABLE_FILE_TYPE_ERRNOS, isUnopenableFileTypeError, regularFileState, sameRegularFileState, assertStableRegularFileIdentity;
function init_RegularFile() {
	return (init_RegularFile = __esmMin((() => {
		init_OwnedFileHandle();
		RegularFileOperationCancelled = class extends Error {
			reason;
			_tag = "RegularFileOperationCancelled";
			constructor(reason) {
				super("Regular file operation cancelled", { cause: reason });
				this.reason = reason;
				this.name = this._tag;
			}
		};
		assertRegularFileActive = (signal) => {
			if (signal?.aborted === true) throw new RegularFileOperationCancelled(signal.reason);
		};
		NonRegularFileReadError = class extends Error {
			path;
			code;
			constructor(path, directory) {
				super(`Selected input must be a regular file: ${path}`);
				this.path = path;
				this.name = "NonRegularFileReadError";
				this.code = directory ? "EISDIR" : "ENOTFILE";
			}
		};
		RegularFileAdmissionFailure = class extends Error {
			path;
			cleanupCause;
			owner;
			cause;
			constructor(path, admissionCause, cleanupCause, owner) {
				super(`Selected input failed admission and its descriptor close failed: ${path}`);
				this.path = path;
				this.cleanupCause = cleanupCause;
				this.owner = owner;
				this.name = "RegularFileAdmissionFailure";
				this.cause = admissionCause;
			}
		};
		RegularFileChangedError = class extends Error {
			path;
			code = "ESTALE";
			constructor(path, options) {
				super(`Selected input changed while being read: ${path}`, options);
				this.path = path;
				this.name = "RegularFileChangedError";
			}
		};
		UNRESOLVED_PATH_ERROR_CODES = new Set([
			"ENOENT",
			"ENOTDIR",
			"ELOOP",
			"ENAMETOOLONG"
		]);
		isUnresolvedPathErrorCode = (code) => typeof code === "string" && UNRESOLVED_PATH_ERROR_CODES.has(code);
		SELECTED_REGULAR_FILE_ERROR_CODES = new Set([
			...UNRESOLVED_PATH_ERROR_CODES,
			"EISDIR",
			"ENOTFILE",
			"ESTALE"
		]);
		isSelectedRegularFileError = (cause) => {
			if (!(cause instanceof Error)) return false;
			const code = Reflect.get(cause, "code");
			return typeof code === "string" && SELECTED_REGULAR_FILE_ERROR_CODES.has(code);
		};
		openRegularFile = async (path, options) => {
			assertRegularFileActive(options.signal);
			const handle = await open(path, constants.O_RDONLY | (constants.O_NONBLOCK ?? 0) | (constants.O_NOCTTY ?? 0) | (options.symlinks === "reject" ? constants.O_NOFOLLOW ?? 0 : 0)).catch(async (cause) => {
				const nonRegular = await nonRegularOpenFailure(path, options.symlinks, cause);
				if (nonRegular === undefined) throw cause;
				throw nonRegular;
			});
			const owner = new OwnedFileHandle(handle);
			try {
				assertRegularFileActive(options.signal);
				const metadata = await handle.stat();
				if (!metadata.isFile()) throw new NonRegularFileReadError(path, metadata.isDirectory());
				assertRegularFileActive(options.signal);
				if (options.symlinks === "reject" && (constants.O_NOFOLLOW ?? 0) === 0) {
					const named = await lstat(path);
					if (named.isSymbolicLink()) throw new NonRegularFileReadError(path, false);
					if (!sameRegularFileState(metadata, named)) throw new RegularFileChangedError(path);
					assertRegularFileActive(options.signal);
				}
				return {
					handle,
					initial: metadata
				};
			} catch (cause) {
				try {
					await owner.close();
				} catch (cleanupCause) {
					throw new RegularFileAdmissionFailure(path, cause, cleanupCause, owner);
				}
				throw cause;
			}
		};
		nonRegularOpenFailure = async (path, symlinks, cause) => {
			if (!isUnopenableFileTypeError(cause)) return undefined;
			const metadata = await (symlinks === "reject" ? lstat : stat)(path).catch(() => undefined);
			if (metadata === undefined || metadata.isFile()) return undefined;
			return new NonRegularFileReadError(path, metadata.isDirectory());
		};
		errnos = constants$1.errno;
		UNOPENABLE_FILE_TYPE_ERRNOS = new Set([
			errnos.ENXIO,
			errnos.EOPNOTSUPP,
			errnos.ENOTSUP
		].flatMap((errno) => errno === undefined ? [] : [-errno]));
		isUnopenableFileTypeError = (cause) => cause instanceof Error && "errno" in cause && typeof cause.errno === "number" && UNOPENABLE_FILE_TYPE_ERRNOS.has(cause.errno);
		regularFileState = (stats) => ({
			dev: stats.dev,
			ino: stats.ino,
			size: stats.size,
			mode: stats.mode,
			mtimeMs: stats.mtimeMs,
			ctimeMs: stats.ctimeMs
		});
		sameRegularFileState = (expected, observed) => observed.isFile() && expected.dev === observed.dev && expected.ino === observed.ino && expected.size === observed.size && expected.mode === observed.mode && ("mtimeNs" in expected && "mtimeNs" in observed ? expected.mtimeNs === observed.mtimeNs && expected.ctimeNs === observed.ctimeNs : expected.mtimeMs === observed.mtimeMs && expected.ctimeMs === observed.ctimeMs);
		assertStableRegularFileIdentity = async (file, path, before, options) => {
			assertRegularFileActive(options.signal);
			const bigint = typeof before.dev === "bigint";
			const named = async () => {
				try {
					const lookup = options.symlinks === "follow" ? stat : lstat;
					return bigint ? await lookup(path, { bigint: true }) : await lookup(path);
				} catch (cause) {
					if (isSelectedRegularFileError(cause)) throw new RegularFileChangedError(path, { cause });
					throw cause;
				}
			};
			const selected = await named();
			assertRegularFileActive(options.signal);
			const opened = await file.stat({ bigint });
			assertRegularFileActive(options.signal);
			if (!sameRegularFileState(before, opened) || !sameRegularFileState(before, selected)) throw new RegularFileChangedError(path);
		};
	})))();
}

//#endregion
//#region dist/filesystem/OwnedRegularFile.js
var OwnedRegularFileOperationFailure, RegularFileCancelled, RegularFileCleanupFailure, regularFileCancellation, withOwnedRegularFile, withOwnedFileHandle, retainOwner;
function init_OwnedRegularFile() {
	return (init_OwnedRegularFile = __esmMin((() => {
		init_OwnedFileHandle();
		init_RegularFile();
		OwnedRegularFileOperationFailure = class extends Error {
			operationCause;
			_tag = "OwnedRegularFileOperationFailure";
			constructor(operationCause) {
				super("Owned regular-file operation failed", { cause: operationCause });
				this.operationCause = operationCause;
				this.name = this._tag;
			}
		};
		RegularFileCancelled = class extends Error {
			path;
			owner;
			_tag = "RegularFileCancelled";
			outcome;
			reason;
			constructor(path, owner, completion) {
				super(`Regular file operation cancelled after closing ${path}`, { cause: completion.reason });
				this.path = path;
				this.owner = owner;
				this.name = this._tag;
				this.outcome = completion.outcome;
				this.reason = completion.reason;
			}
		};
		RegularFileCleanupFailure = class extends Error {
			path;
			owner;
			outcome;
			cleanupCause;
			retention;
			completionCancellation;
			operationFailure;
			constructor(facts) {
				const { path, owner, outcome, cleanupCause, retention = { kind: "not_requested" }, completionCancellation, operationFailure } = facts;
				super(`Regular file cleanup failed for ${path}`, { cause: new AggregateError([
					...outcome.kind === "failed" ? [outcome.cause] : [],
					cleanupCause,
					...retention.kind === "callback_threw" ? [retention.cause] : []
				], "File operation and cleanup failures") });
				this.name = "RegularFileCleanupFailure";
				this.path = path;
				this.owner = owner;
				this.outcome = outcome;
				this.cleanupCause = cleanupCause;
				this.retention = retention;
				this.completionCancellation = completionCancellation;
				this.operationFailure = operationFailure;
			}
		};
		regularFileCancellation = (cause) => {
			if (cause instanceof RegularFileCleanupFailure && cause.operationFailure !== undefined) return cause.outcome.kind === "completed" ? cause.completionCancellation : undefined;
			const primary = cause instanceof RegularFileCleanupFailure && cause.outcome.kind === "failed" ? cause.outcome.cause : cause;
			if (primary instanceof RegularFileOperationCancelled || primary instanceof RegularFileCancelled) return { reason: primary.reason };
			return cause instanceof RegularFileCleanupFailure && cause.outcome.kind === "completed" ? cause.completionCancellation : undefined;
		};
		withOwnedRegularFile = async (path, options, operation) => {
			const source = await openRegularFile(path, {
				symlinks: options.symlinks ?? "follow",
				signal: options.signal
			}).catch((cause) => {
				if (!(cause instanceof RegularFileAdmissionFailure)) throw cause;
				const retention = retainOwner(options.retainFailedClose, cause.owner);
				throw new RegularFileCleanupFailure({
					path,
					owner: cause.owner,
					outcome: {
						kind: "failed",
						cause: cause.cause
					},
					cleanupCause: cause.cleanupCause,
					retention
				});
			});
			return withOwnedFileHandle(path, new OwnedFileHandle(source.handle), options, () => operation(source));
		};
		withOwnedFileHandle = async (path, owner, options, operation) => {
			const handle = owner.handle;
			let outcome;
			try {
				assertRegularFileActive(options.signal);
				outcome = {
					kind: "completed",
					value: await operation(handle)
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			try {
				await owner.close();
			} catch (cleanupCause) {
				const operationFailure = outcome.kind === "failed" && outcome.cause instanceof OwnedRegularFileOperationFailure ? outcome.cause : undefined;
				const retainedOutcome = operationFailure === undefined ? outcome : {
					kind: "failed",
					cause: operationFailure.operationCause
				};
				const completionCancellation = outcome.kind === "completed" && options.signal?.aborted === true ? { reason: options.signal.reason } : undefined;
				throw new RegularFileCleanupFailure({
					path,
					owner,
					outcome: retainedOutcome,
					cleanupCause,
					retention: retainOwner(options.retainFailedClose, owner),
					completionCancellation,
					operationFailure
				});
			}
			if (outcome.kind === "failed") throw outcome.cause;
			if (options.signal?.aborted === true) throw new RegularFileCancelled(path, owner, {
				outcome,
				reason: options.signal.reason
			});
			return outcome.value;
		};
		retainOwner = (retain, owner) => {
			if (retain === undefined) return { kind: "not_requested" };
			try {
				retain(owner);
				return { kind: "callback_returned" };
			} catch (cause) {
				return {
					kind: "callback_threw",
					cause
				};
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactReader.js
var sameArtifactSourceIdentity, copyArtifactEntry, sameArtifactEntry, sameDeclaredIntegrity, sameFormatMetadata, ArtifactReaderFailure, artifactFixedLimitFailure, combineCleanup, errorMessage, artifactPrimaryCleanupLeases, ArtifactEntryContentUnavailable;
function init_ArtifactReader() {
	return (init_ArtifactReader = __esmMin((() => {
		init_fixedAllowanceRemediation();
		init_analysisErrorBase();
		sameArtifactSourceIdentity = (expected, observed) => expected !== undefined && observed.dev === expected.device && observed.ino === expected.inode && observed.size === expected.size && observed.mode === expected.mode && observed.mtimeNs === expected.mtimeNs && observed.ctimeNs === expected.ctimeNs;
		copyArtifactEntry = (entry) => ({
			...entry,
			limitations: [...entry.limitations],
			declaredIntegrity: entry.declaredIntegrity === null ? null : { ...entry.declaredIntegrity },
			...entry.formatMetadata === undefined ? {} : { formatMetadata: structuredClone(entry.formatMetadata) },
			...entry.sourceIdentity === undefined ? {} : { sourceIdentity: { ...entry.sourceIdentity } }
		});
		sameArtifactEntry = (entry, produced) => entry.path === produced.path && entry.sourcePath === produced.sourcePath && entry.kind === produced.kind && entry.declaredSize === produced.declaredSize && entry.compressedSize === produced.compressedSize && entry.executable === produced.executable && entry.encrypted === produced.encrypted && entry.byteOffset === produced.byteOffset && entry.byteLength === produced.byteLength && sameDeclaredIntegrity(entry.declaredIntegrity, produced.declaredIntegrity) && sameFormatMetadata(entry.formatMetadata, produced.formatMetadata) && entry.unpacked === produced.unpacked && entry.adapterKey === produced.adapterKey && entry.limitations.length === produced.limitations.length && entry.limitations.every((limitation, index) => limitation === produced.limitations[index]) && entry.sourceIdentity?.device === produced.sourceIdentity?.device && entry.sourceIdentity?.inode === produced.sourceIdentity?.inode && entry.sourceIdentity?.size === produced.sourceIdentity?.size && entry.sourceIdentity?.mode === produced.sourceIdentity?.mode && entry.sourceIdentity?.mtimeNs === produced.sourceIdentity?.mtimeNs && entry.sourceIdentity?.ctimeNs === produced.sourceIdentity?.ctimeNs;
		sameDeclaredIntegrity = (left, right) => left === right || left !== null && left !== undefined && right !== null && right !== undefined && left.algorithm === right.algorithm && left.digest === right.digest;
		sameFormatMetadata = (left, right) => {
			if (left === right) return true;
			if (Array.isArray(left) || Array.isArray(right)) return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((value, index) => sameFormatMetadata(value, right[index]));
			if (left === null || right === null || typeof left !== "object" || typeof right !== "object") return false;
			return Object.keys(left).length === Object.keys(right).length && Object.entries(left).every(([key, value]) => Object.hasOwn(right, key) && sameFormatMetadata(value, Reflect.get(right, key)));
		};
		ArtifactReaderFailure = class ArtifactReaderFailure extends Error {
			reason;
			details;
			userMessage;
			resolvedPath;
			cancellation;
			cleanup;
			cleanupLeases;
			partialObservation;
			/** The constrained bound for a `limit` reason, when the reader knows it. */
			boundary;
			/** Named admission for a limit whose public recovery is owned by the producer. */
			admission;
			constructor(reason, message, options, details) {
				super(message, options);
				this.reason = reason;
				this.details = details;
				this.name = "ArtifactReaderFailure";
				this.userMessage = options?.userMessage;
				this.resolvedPath = options?.resolvedPath;
				this.cancellation = reason === "cancelled" ? options?.cancellation ?? { reason: options?.cause } : undefined;
				this.cleanup = options?.cleanup;
				this.cleanupLeases = options?.cleanupLeases ?? (this.cleanup === undefined ? [] : undefined);
				this.partialObservation = options?.partialObservation;
				this.boundary = options?.boundary;
				this.admission = options?.admission;
			}
			/** Retain completed facts when a later artifact step fails. */
			retainPartialObservation(observation) {
				this.partialObservation ??= observation;
				return this;
			}
			/** Preserve the primary failure and observation. Supplied leases must cover all merged cleanup. */
			static withCleanup(cause, cleanup, partialObservation, cleanupLeases) {
				const primary = cause instanceof ArtifactReaderFailure ? cause : new ArtifactReaderFailure("io", errorMessage(cause), {
					cause,
					...cause instanceof AnalysisError ? {
						partialObservation: cause.partialObservation,
						...cause.cleanupIncomplete ? { cleanup: ArtifactReaderFailure.cleanupObservation(cause, []) } : {}
					} : {}
				});
				const mergedObservation = partialObservation ?? primary.partialObservation;
				return new ArtifactReaderFailure(primary.reason, primary.message, {
					cause: primary,
					userMessage: primary.userMessage,
					resolvedPath: primary.resolvedPath,
					cancellation: primary.cancellation,
					cleanup: combineCleanup(primary.cleanup, cleanup),
					cleanupLeases: cleanupLeases ?? (cleanup === primary.cleanup ? primary.cleanupLeases : undefined),
					...primary.boundary === undefined ? {} : { boundary: primary.boundary },
					...primary.admission === undefined ? {} : { admission: primary.admission },
					...mergedObservation === undefined ? {} : { partialObservation: mergedObservation }
				}, primary.details);
			}
			/** Give otherwise opaque cleanup failures a concrete owned resource. */
			static cleanupObservation(cause, resource) {
				if (cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined) return cause.cleanup;
				if (cause instanceof AnalysisError && cause.cleanupIncomplete) return {
					reason: cause.cleanup?.reason ?? cause.message,
					resources: [...cause.cleanupResources]
				};
				return {
					reason: errorMessage(cause),
					resources: typeof resource === "string" ? [resource] : [...resource]
				};
			}
		};
		artifactFixedLimitFailure = (name, maximum, unit) => {
			const message = `${fixedAllowanceRemediation(`${name} of ${String(maximum)} ${unit}`, "parser")} This release has no runtime override. Summary delivery and pagination do not raise this input limit.`;
			return new ArtifactReaderFailure("limit", message, {
				boundary: "capacity",
				userMessage: message
			});
		};
		combineCleanup = (primary, cleanup) => primary === undefined || primary === cleanup ? cleanup : {
			reason: `${primary.reason}; ${cleanup.reason}`,
			resources: [...new Set([...primary.resources, ...cleanup.resources])]
		};
		errorMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
		artifactPrimaryCleanupLeases = (cause) => cause instanceof ArtifactReaderFailure ? cause.cleanupLeases : cause instanceof AnalysisError && cause.cleanupIncomplete ? undefined : [];
		ArtifactEntryContentUnavailable = class extends ArtifactReaderFailure {
			limitation;
			traversal;
			constructor(message, limitation, options, details) {
				super("unavailable", message, options, details);
				this.limitation = limitation;
				this.traversal = options?.traversal;
			}
		};
	})))();
}

//#endregion
export { ArtifactEntryContentUnavailable, ArtifactReaderFailure, NonRegularFileReadError, OwnedFileHandle, OwnedRegularFileOperationFailure, RegularFileAdmissionFailure, RegularFileCancelled, RegularFileChangedError, RegularFileCleanupFailure, RegularFileOperationCancelled, artifactFixedLimitFailure, artifactPrimaryCleanupLeases, assertRegularFileActive, assertStableRegularFileIdentity, copyArtifactEntry, init_ArtifactReader, init_OwnedFileHandle, init_OwnedRegularFile, init_RegularFile, isSelectedRegularFileError, isUnresolvedPathErrorCode, openRegularFile, regularFileCancellation, regularFileState, sameArtifactEntry, sameArtifactSourceIdentity, sameRegularFileState, withOwnedFileHandle, withOwnedRegularFile };