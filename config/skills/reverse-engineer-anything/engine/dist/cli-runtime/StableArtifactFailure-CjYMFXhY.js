import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ArtifactReaderFailure, init_ArtifactReader, init_RegularFile, sameRegularFileState } from "./ArtifactReader-DJ9rniiL.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";
import { artifactFileCompletion, artifactSelectedPathErrno, assertArtifactReadActive, bindArtifactFileCleanup, init_ArtifactFileOperation, withArtifactFileHandle } from "./ArtifactFileOperation-YawaP_UN.js";
import { ProviderCleanupError, init_providerCleanupError } from "./providerCleanupError-7gv3MO0l.js";
import { fileSnapshotPartialObservationSchema, init_fileSnapshotObservation } from "./fileSnapshotObservation-CHL-8gjP.js";
import { constants } from "node:fs";
import { lstat, open, realpath } from "node:fs/promises";
import { createHash } from "node:crypto";

//#region dist/artifacts/readStableArtifact.js
var completedStableArtifact, FILE_SYSTEM, resolvedRegularFile, afterValidation, readStableArtifact;
function init_readStableArtifact() {
	return (init_readStableArtifact = __esmMin((() => {
		init_RegularFile();
		init_ArtifactReader();
		init_ArtifactFileOperation();
		completedStableArtifact = (cause) => {
			const value = artifactFileCompletion(cause)?.value;
			if (value === null || typeof value !== "object" || !("bytes" in value) || !Buffer.isBuffer(value.bytes) || !("sha256" in value) || typeof value.sha256 !== "string") return undefined;
			return {
				bytes: value.bytes,
				sha256: value.sha256
			};
		};
		FILE_SYSTEM = {
			lstat: (path) => lstat(path, { bigint: true }),
			open,
			realpath
		};
		resolvedRegularFile = async (path, fileSystem) => {
			try {
				const resolved = await fileSystem.realpath?.(path);
				if (resolved === undefined) return undefined;
				const target = await fileSystem.lstat(resolved);
				return target.isFile() && !target.isSymbolicLink() ? resolved : undefined;
			} catch {
				return undefined;
			}
		};
		afterValidation = async (path, stage, read) => {
			try {
				return await read();
			} catch (cause) {
				if (artifactSelectedPathErrno(cause) !== undefined) throw new ArtifactReaderFailure("integrity", `Artifact changed ${stage}: ${path}`, { cause });
				throw cause;
			}
		};
		readStableArtifact = async (path, maximumBytes, signal, fileSystem = FILE_SYSTEM, resourceScope) => {
			assertArtifactReadActive(signal);
			const before = await fileSystem.lstat(path);
			if (!before.isFile() || before.isSymbolicLink()) throw new ArtifactReaderFailure("path", `Expected a regular file without a symlink: ${path}`, before.isSymbolicLink() ? { resolvedPath: await resolvedRegularFile(path, fileSystem) } : {});
			const maximumSize = BigInt(maximumBytes);
			if (before.size > maximumSize) throw new ArtifactReaderFailure("limit", `Selected artifact exceeds ${String(maximumBytes)} bytes: ${path}`, { boundary: "file-size" });
			const file = await afterValidation(path, "before open", () => fileSystem.open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK));
			return withArtifactFileHandle(path, file, resourceScope, signal, async (file) => {
				const initial = await file.stat({ bigint: true });
				if (!initial.isFile() || initial.dev !== before.dev || initial.ino !== before.ino) throw new ArtifactReaderFailure("integrity", `Artifact changed before open: ${path}`);
				assertArtifactReadActive(signal);
				const bytes = Buffer.allocUnsafe(Number(initial.size > maximumSize ? maximumSize : initial.size));
				const overflow = Buffer.allocUnsafe(65536);
				const hash = createHash("sha256");
				let count = 0;
				for (;;) {
					assertArtifactReadActive(signal);
					const inside = count < bytes.length;
					const target = inside ? bytes : overflow;
					const offset = inside ? count : 0;
					const wanted = Math.min(65536, target.length - offset);
					const { bytesRead } = await file.read(target, offset, wanted, count);
					if (bytesRead === 0) break;
					assertArtifactReadActive(signal);
					if (!Number.isSafeInteger(bytesRead) || bytesRead < 0 || bytesRead > wanted) throw new ArtifactReaderFailure("format", `Artifact descriptor returned an invalid byte count: ${path}`);
					count += bytesRead;
					if (count > maximumBytes) throw new ArtifactReaderFailure("limit", `Selected artifact grew beyond its byte limit: ${path}`, { boundary: "file-size" });
					hash.update(target.subarray(offset, offset + bytesRead));
				}
				const after = await file.stat({ bigint: true });
				const current = await afterValidation(path, "during read", () => fileSystem.lstat(path));
				if ([after, current].some((stat) => !sameRegularFileState(initial, stat)) || BigInt(count) !== initial.size) throw new ArtifactReaderFailure("integrity", `Artifact changed during read: ${path}`);
				assertArtifactReadActive(signal);
				return {
					bytes,
					sha256: hash.digest("hex")
				};
			});
		};
	})))();
}

//#endregion
//#region dist/artifacts/StableArtifactObservation.js
var completedStableArtifactObservation;
function init_StableArtifactObservation() {
	return (init_StableArtifactObservation = __esmMin((() => {
		init_fileSnapshotObservation();
		init_readStableArtifact();
		completedStableArtifactObservation = (cause, path) => {
			const snapshot = completedStableArtifact(cause);
			return snapshot === undefined ? undefined : fileSnapshotPartialObservationSchema.parse({
				kind: "file-snapshot-hash",
				path,
				sha256: snapshot.sha256,
				bytes: snapshot.bytes.length
			});
		};
	})))();
}

//#endregion
//#region dist/artifacts/StableArtifactFailure.js
var stableArtifactInputRecovery, artifactCleanupFailure, projectArtifactCloseFailure, projectStableArtifactFailure;
function init_StableArtifactFailure() {
	return (init_StableArtifactFailure = __esmMin((() => {
		init_analysisErrorCleanup();
		init_providerCleanupError();
		init_ArtifactReader();
		init_ArtifactFileOperation();
		init_StableArtifactObservation();
		stableArtifactInputRecovery = (cause) => cause.reason === "path" && cause.resolvedPath !== undefined ? {
			remediationAction: `Retry with the resolved regular file path ${cause.resolvedPath}. The selected symlink is not admitted; the retry will validate the target again.`,
			conformsToInputContract: true
		} : {};
		artifactCleanupFailure = (cause, providerId, operation) => {
			if (!(cause instanceof ArtifactReaderFailure) || cause.cleanup === undefined) return undefined;
			return new ProviderCleanupError(providerId, cause.cleanup.resources, { reason: cause.cleanup.reason }, {
				cause,
				operation
			});
		};
		projectArtifactCloseFailure = (cause, providerId, operation) => {
			const error = artifactCleanupFailure(cause, providerId, operation);
			if (error === undefined) return cause;
			bindArtifactFileCleanup(cause, error);
			return error;
		};
		projectStableArtifactFailure = (cause, primary, path, providerId, operation) => {
			const observation = completedStableArtifactObservation(cause, path);
			if (observation !== undefined) primary.retainPartialObservation(observation);
			const cleanup = artifactCleanupFailure(cause, providerId, operation);
			if (cleanup === undefined) return primary;
			const error = analysisErrorWithCleanupFailure(primary, cleanup, operation);
			bindArtifactFileCleanup(cause, error);
			return error;
		};
	})))();
}

//#endregion
export { completedStableArtifact, completedStableArtifactObservation, init_StableArtifactFailure, init_StableArtifactObservation, init_readStableArtifact, projectArtifactCloseFailure, projectStableArtifactFailure, readStableArtifact, stableArtifactInputRecovery };