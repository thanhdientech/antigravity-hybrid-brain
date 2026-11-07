import { __esmMin, __exportAll } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_jsonSerialization, init_result, jsonByteLength, jsonParts, ok } from "./jsonLines-CKG28FwL.js";
import { ArtifactReaderFailure, RegularFileChangedError, RegularFileCleanupFailure, init_ArtifactReader, init_OwnedRegularFile, init_RegularFile } from "./ArtifactReader-DJ9rniiL.js";
import { AnalysisCleanupLease, init_AnalysisCleanupLease } from "./AnalysisCleanupLease-DZIxbgES.js";
import { AnalysisAccessDeniedError, AnalysisArtifactChangedError, AnalysisError, AnalysisInputError, AnalysisOutputError, AnalysisResourceConstraintError, init_analysisErrorBase, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { init_RegularFileRead, readRegularFile, withRegularFile } from "./RegularFileRead-KmOamg1_.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";
import { JSON_INPUT_RESOURCE_REMEDIATION, init_JsonInputFile, init_OwnedJsonInput, init_Utf8JsonInput, nativeJsonParseRequiredBytes, parseUtf8Json, sealOwnedJsonInput } from "./JsonFiles-DTY4ojTz.js";
import { ArtifactFileCleanupFailure, bindArtifactFileCleanup, init_ArtifactFileOperation } from "./ArtifactFileOperation-YawaP_UN.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-C6Clg7Wy.js";
import { init_readFileHandleChunks, readFileHandleChunks } from "./readFileHandleChunks-Cuq9fZuV.js";
import { init_StreamBytes, streamChunkToBuffer } from "./StreamBytes-5y_bghjt.js";
import { SafeOutputTree, SafeOutputTreeCreationFailure, init_SafeOutputTree, init_SafeOutputTreeAdmission, init_SafeOutputTreeCreationFailure, outputDirectoryAdmissionRefusal } from "./SafeOutputTree-C4FfDjZW.js";
import { init_environmentState, prepareServedState } from "./environmentState-B4zIh8BF.js";
import { ENVIRONMENT_EXPORT_OPERATION, init_environmentBundle, planEnvironmentBundle, registryPackageSource } from "./environmentBundle-C8C1qE7A.js";
import { dirname, isAbsolute, join } from "node:path";
import { mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { getHeapStatistics } from "node:v8";
import { Readable } from "node:stream";

//#region dist/application/environment/environmentEvidenceBytes.js
var evidenceFileBytes;
function init_environmentEvidenceBytes() {
	return (init_environmentEvidenceBytes = __esmMin((() => {
		init_jsonSerialization();
		evidenceFileBytes = (evidence, admit) => {
			const size = jsonByteLength(evidence) + 1;
			admit?.(size);
			const bytes = Buffer.allocUnsafe(size);
			let offset = 0;
			for (const part of jsonParts(evidence)) offset += bytes.write(part, offset);
			if (offset !== bytes.length - 1) throw new Error("Evidence serialized to a different length than measured");
			bytes[offset] = 10;
			return bytes;
		};
	})))();
}

//#endregion
//#region dist/application/environment/environmentBundleWrite.js
/** Read the admitted tarball, attributing host failures to the source. */
async function* tarballChunks(source) {
	try {
		yield* readFileHandleChunks(source.handle);
	} catch (cause) {
		if (isHostSystemFailure(cause)) throw new BundleFileHostFailure(source.path, "reading", cause);
		throw cause;
	}
}
var BundleFileHostFailure, isHostSystemFailure, writingBundleFile, writeBytes, bundleTarballDigest, writeTarball, writeBundleFiles, packageTarballRefusal, withBundleTarball, writeEnvironmentBundle;
function init_environmentBundleWrite() {
	return (init_environmentBundleWrite = __esmMin((() => {
		init_analysisErrorCore();
		init_AnalysisCleanupLease();
		init_ArtifactFileOperation();
		init_OwnedRegularFile();
		init_readFileHandleChunks();
		init_StreamBytes();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_SafeOutputTree();
		init_SafeOutputTreeAdmission();
		init_SafeOutputTreeCreationFailure();
		init_RegularFile();
		init_RegularFileRead();
		init_environmentBundle();
		BundleFileHostFailure = class extends Error {
			path;
			operation;
			constructor(path, operation, cause) {
				super(`${cause.message}, ${operation} ${path}`, { cause });
				this.path = path;
				this.operation = operation;
			}
		};
		isHostSystemFailure = (cause) => cause instanceof Error && !(cause instanceof ArtifactReaderFailure) && typeof Reflect.get(cause, "code") === "string";
		writingBundleFile = async (directory, relative, write) => {
			try {
				return await write();
			} catch (cause) {
				if (isHostSystemFailure(cause) && Reflect.get(cause, "path") === undefined) throw new BundleFileHostFailure(join(directory, relative), "writing", cause);
				throw cause;
			}
		};
		writeBytes = async (tree, directory, relative, bytes) => {
			const written = await writingBundleFile(directory, relative, () => tree.write(relative, Readable.from([bytes]), {
				bytes: bytes.length,
				sha256: createHash("sha256").update(bytes).digest("hex")
			}));
			return {
				path: written.relativePath,
				bytes: written.bytesWritten
			};
		};
		bundleTarballDigest = async (source) => {
			const hash = createHash("sha256");
			let observed = 0;
			for await (const chunk of tarballChunks(source)) {
				const bytes = streamChunkToBuffer(chunk);
				observed += bytes.length;
				if (observed > source.size) throw new RegularFileChangedError(source.path);
				hash.update(bytes);
			}
			if (observed !== source.size) throw new RegularFileChangedError(source.path);
			return hash.digest("hex");
		};
		writeTarball = async (tree, directory, relative, source) => {
			const sha256 = await bundleTarballDigest(source);
			const written = await writingBundleFile(directory, relative, () => tree.write(relative, Readable.from(tarballChunks(source)), {
				bytes: source.size,
				sha256
			}));
			return {
				path: written.relativePath,
				bytes: written.bytesWritten
			};
		};
		writeBundleFiles = async (input, plan, tarball) => {
			const resources = new ArtifactResourceScope();
			let tree;
			let written;
			let outcome;
			try {
				if (input.exclusiveDestination !== true) await mkdir(dirname(input.directory), {
					recursive: true,
					mode: 448
				});
				try {
					tree = await SafeOutputTree.create(input.directory, process.platform, { acceptExistingEmpty: input.exclusiveDestination !== true });
				} catch (cause) {
					if (cause instanceof SafeOutputTreeCreationFailure) tree = cause.tree;
					throw cause;
				}
				written = [];
				for (const file of plan.files) written.push(await writeBytes(tree, input.directory, file.path, Buffer.from(file.content)));
				written.push(await writeBytes(tree, input.directory, plan.copies.manifest, input.manifest.bytes));
				written.push(await writeBytes(tree, input.directory, plan.copies.evidence, input.evidence.bytes));
				if (plan.copies.tarball !== null && tarball !== undefined) written.push(await writeTarball(tree, input.directory, plan.copies.tarball, tarball));
				await tree.commit();
				outcome = {
					kind: "completed",
					files: written
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			const owner = tree;
			if (owner !== undefined) {
				const closed = await resources.release({
					kind: "lease",
					resource: input.directory,
					lease: { release: () => owner.closeHandles() }
				});
				if (closed.kind === "failed") throw resources.cleanupFailure(outcome, [closed]);
			}
			if (outcome.kind === "failed") {
				if (owner?.published === true && written !== undefined) return written;
				throw outputDirectoryAdmissionRefusal(ENVIRONMENT_EXPORT_OPERATION, "directory", outcome.cause);
			}
			return outcome.files;
		};
		packageTarballRefusal = (path, cause) => new AnalysisInputError(ENVIRONMENT_EXPORT_OPERATION, {
			cause,
			userMessage: `${path} must name a readable regular package tarball.`
		}, [{
			path: ["package_tarball"],
			reason: "invalid_value",
			message: "The package tarball must be an existing regular file."
		}]);
		withBundleTarball = async (path, use) => {
			const resources = new ArtifactResourceScope();
			let admitted = false;
			try {
				return await withRegularFile(path, async (handle, state) => {
					admitted = true;
					return use({
						path,
						handle,
						size: state.size
					});
				}, { resources });
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw new ArtifactFileCleanupFailure(cause, AnalysisCleanupLease.forCloseOwner(cause.owner, path));
				if (!admitted && cause instanceof Error && "code" in cause) {
					if (cause.code === "EACCES" || cause.code === "EPERM") throw new AnalysisAccessDeniedError(ENVIRONMENT_EXPORT_OPERATION, path, cause.code, { cause });
					if ([
						"ENOENT",
						"ENOTDIR",
						"ENAMETOOLONG",
						"EISDIR",
						"ENOTFILE"
					].includes(String(cause.code))) throw packageTarballRefusal(path, cause);
				}
				throw cause;
			}
		};
		writeEnvironmentBundle = (input, plan) => plan.packageSource.kind === "tarball" ? withBundleTarball(plan.packageSource.path, (tarball) => writeBundleFiles(input, plan, tarball)) : writeBundleFiles(input, plan);
	})))();
}

//#endregion
//#region dist/application/environment/environmentExport.js
var environmentExport_exports = /* @__PURE__ */ __exportAll({
	environmentExportEvidenceFile: () => environmentExportEvidenceFile,
	exportEnvironmentBundle: () => exportEnvironmentBundle,
	readEnvironmentExportFile: () => readEnvironmentExportFile,
	readEnvironmentExportInputs: () => readEnvironmentExportInputs
});
var inputError, systemCode, hostWriteFailure, hostReadFailure, hostSystemError, accessDeniedError, hostFailurePath, NOT_A_FILE_CODES, headroomRefusal, environmentExportEvidenceFile, environmentExportFile, readEnvironmentExportFile, readEnvironmentExportInputs, packageSourceValue, changedArtifact, readerFailureError, packageTarballBytes, exportEnvironmentBundle;
function init_environmentExport() {
	return (init_environmentExport = __esmMin((() => {
		init_analysisErrorBase();
		init_analysisErrorCleanup();
		init_analysisErrorCore();
		init_environmentEvidenceBytes();
		init_result();
		init_RegularFile();
		init_ArtifactFileOperation();
		init_AnalysisCleanupLease();
		init_ArtifactResourceScope();
		init_OwnedRegularFile();
		init_ArtifactReader();
		init_environmentBundleWrite();
		init_OwnedJsonInput();
		init_JsonInputFile();
		init_RegularFileRead();
		init_Utf8JsonInput();
		init_environmentBundle();
		init_environmentState();
		inputError = (operation, issue, userMessage) => new AnalysisInputError(operation, { userMessage }, [issue]);
		systemCode = (cause) => cause instanceof Error && "code" in cause && typeof cause.code === "string" ? cause.code : undefined;
		hostWriteFailure = (directory) => ({
			userMessage: `Writing the environment bundle to ${directory} failed on the host; the details name the cause and, when it failed on one bundle file, that file.`,
			remediationAction: `Resolve the reported host failure (for example, choose a shorter destination path or free disk space). Inspect ${directory} and remove any partial output this export wrote before retrying, since a retry refuses a non-empty directory.`,
			diagnostics: { output_directory: directory }
		});
		hostReadFailure = (source, directory) => ({
			userMessage: `Reading ${source} failed on the host while writing the environment bundle to ${directory}; the details name the cause.`,
			remediationAction: `Resolve the reported host failure reading ${source}. Inspect ${directory} and remove any partial output this export wrote before retrying, since a retry refuses a non-empty directory.`,
			diagnostics: { output_directory: directory }
		});
		hostSystemError = (cause) => {
			const seen = new Set([cause]);
			let current = cause.cause;
			while (current instanceof Error && !seen.has(current)) {
				if (systemCode(current) !== undefined) return current;
				seen.add(current);
				current = current.cause;
			}
			return undefined;
		};
		accessDeniedError = (cause, path, diagnostics, access = "read", operation = ENVIRONMENT_EXPORT_OPERATION) => {
			const seen = new Set();
			let current = cause;
			while (current instanceof Error && !seen.has(current)) {
				seen.add(current);
				if (current instanceof BundleFileHostFailure) access = current.operation === "reading" ? "read" : "write";
				const code = systemCode(current);
				if (code === "EACCES" || code === "EPERM") {
					const options = {
						cause,
						...diagnostics === undefined ? {} : { diagnostics },
						...cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined ? { cleanup: cause.cleanup } : {}
					};
					const error = access === "read" ? new AnalysisAccessDeniedError(operation, path, code, options) : new AnalysisOutputError(operation, `Host filesystem permissions denied write access: ${path}`, {
						...options,
						userMessage: `Host filesystem permissions denied writing the environment bundle at ${path}.`,
						remediationAction: "Check write access or select a writable destination. Inspect the output directory for partial output before retrying; export refuses a non-empty directory.",
						diagnostics: {
							...diagnostics,
							path,
							system_code: code,
							boundary: "filesystem-write"
						}
					});
					bindArtifactFileCleanup(cause, error);
					return error;
				}
				current = current.cause;
			}
			return undefined;
		};
		hostFailurePath = (cause) => {
			const seen = new Set();
			let current = cause;
			while (current instanceof Error && !seen.has(current)) {
				seen.add(current);
				if (current instanceof BundleFileHostFailure) return current.path;
				const path = Reflect.get(current, "path");
				if (systemCode(current) !== undefined && typeof path === "string") return isAbsolute(path) ? path : undefined;
				current = current.cause;
			}
			return undefined;
		};
		NOT_A_FILE_CODES = new Set([
			"ENOENT",
			"EISDIR",
			"ENOTFILE",
			"ENOTDIR",
			"ENAMETOOLONG"
		]);
		headroomRefusal = (operation, path, inputBytes) => {
			const heap = getHeapStatistics();
			const requiredBytes = nativeJsonParseRequiredBytes(inputBytes, true);
			return requiredBytes <= heap.total_available_size ? undefined : new AnalysisResourceConstraintError(operation, "memory", "Insufficient heap headroom to read, parse and seal the complete JSON file", {
				input_path: path,
				input_file_bytes: inputBytes,
				required_heap_bytes: requiredBytes,
				available_heap_bytes: heap.total_available_size,
				heap_size_limit_bytes: heap.heap_size_limit
			}, { remediationAction: JSON_INPUT_RESOURCE_REMEDIATION });
		};
		environmentExportEvidenceFile = async (role, path, evidence, operation = ENVIRONMENT_EXPORT_OPERATION) => {
			try {
				const bytes = evidenceFileBytes(evidence, (size) => {
					const refused = headroomRefusal(operation, path, size);
					if (refused !== undefined) throw refused;
				});
				return await environmentExportFile(role, path, bytes, { operation });
			} catch (cause) {
				if (cause instanceof AnalysisResourceConstraintError) return err(cause);
				throw cause;
			}
		};
		environmentExportFile = async (role, path, bytes, context = {}) => {
			const operation = context.operation ?? "environment-export";
			const refusal = headroomRefusal(operation, path, bytes.length);
			if (refusal !== undefined) return err(refusal);
			let parsed;
			try {
				parsed = parseUtf8Json(bytes, operation, path);
			} catch (cause) {
				if (cause instanceof AnalysisResourceConstraintError) return err(cause);
				throw cause;
			}
			if (!parsed.ok) return err(inputError(operation, {
				path: context.fieldPath ?? [role],
				reason: "invalid_format",
				expected: "JSON",
				message: parsed.error
			}, `${path} is not valid JSON: ${parsed.error}`));
			const snapshot = await sealOwnedJsonInput(parsed.value, operation);
			if (!snapshot.ok) return snapshot;
			return ok({
				path,
				bytes,
				value: snapshot.value
			});
		};
		readEnvironmentExportFile = async (role, path, operation = ENVIRONMENT_EXPORT_OPERATION, fieldPath) => {
			const resources = new ArtifactResourceScope();
			let bytes;
			try {
				bytes = await readRegularFile(path, {
					resources,
					admit: (state) => {
						const refused = headroomRefusal(operation, path, state.size);
						if (refused !== undefined) throw refused;
					}
				});
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) {
					const failure = new ArtifactFileCleanupFailure(cause, AnalysisCleanupLease.forCloseOwner(cause.owner, path));
					const cleanup = new AnalysisOutputError(operation, `Could not confirm closing the ${role} input file.`, {
						cause: failure,
						cleanup: failure.cleanup,
						diagnostics: {
							input_path: path,
							input_role: role
						}
					});
					bindArtifactFileCleanup(failure, cleanup);
					const primary = cause.outcome.kind === "failed" ? cause.outcome.cause : undefined;
					return err(primary instanceof AnalysisError ? analysisErrorWithCleanupFailure(primary, cleanup, operation).bindCleanupDependencies([primary, cleanup]) : cleanup);
				}
				if (cause instanceof AnalysisResourceConstraintError) return err(cause);
				if (cause instanceof RegularFileChangedError) return err(inputError(operation, {
					path: fieldPath ?? [role],
					reason: "invalid_value",
					expected: "one stable regular file snapshot",
					message: `The ${role} file changed while it was read.`
				}, `${path} changed while being read; retry with stable input files.`));
				if (NOT_A_FILE_CODES.has(systemCode(cause) ?? "")) return err(inputError(operation, {
					path: fieldPath ?? [role],
					reason: "invalid_value",
					message: fieldPath === undefined ? `The ${role} argument must be a readable file path; inline JSON cannot be exported.` : "The selected source path must be a readable regular file."
				}, `${path} could not be read as the ${role} file.`));
				const denied = accessDeniedError(cause, path, undefined, "read", operation);
				if (denied !== undefined) return err(denied);
				throw cause;
			}
			return environmentExportFile(role, path, bytes, {
				operation,
				fieldPath
			});
		};
		readEnvironmentExportInputs = async (manifestPath, evidencePath) => {
			const manifest = await readEnvironmentExportFile("manifest", manifestPath);
			if (!manifest.ok) return manifest;
			const evidence = await readEnvironmentExportFile("evidence", evidencePath);
			if (!evidence.ok) return evidence;
			return ok({
				manifest: manifest.value,
				evidence: evidence.value
			});
		};
		packageSourceValue = (source) => source.kind === "registry" ? {
			kind: "registry",
			specifier: source.specifier
		} : {
			kind: "tarball",
			path: source.path
		};
		changedArtifact = (cause) => new AnalysisArtifactChangedError(ENVIRONMENT_EXPORT_OPERATION, cause.path, cause.message, { cause });
		readerFailureError = (cause, directory) => {
			const host = hostSystemError(cause);
			const error = new AnalysisOutputError(ENVIRONMENT_EXPORT_OPERATION, host === undefined ? cause.message : `${cause.message}: ${host.message}`, {
				cause,
				...cause.cleanup !== undefined ? { cleanup: cause.cleanup } : directory === undefined ? {} : host === undefined ? { diagnostics: { output_directory: directory } } : hostWriteFailure(directory)
			});
			bindArtifactFileCleanup(cause, error);
			return error;
		};
		packageTarballBytes = async (path) => {
			try {
				return ok(await withBundleTarball(path, async (tarball) => {
					await bundleTarballDigest(tarball);
					return tarball.size;
				}));
			} catch (cause) {
				if (cause instanceof AnalysisError) return err(cause);
				if (cause instanceof RegularFileChangedError) return err(changedArtifact(cause));
				if (cause instanceof ArtifactReaderFailure) return err(readerFailureError(cause, undefined));
				if (cause instanceof BundleFileHostFailure) return err(packageTarballRefusal(path, cause));
				if (systemCode(cause) !== undefined) return err(packageTarballRefusal(path, cause));
				throw cause;
			}
		};
		exportEnvironmentBundle = async (input) => {
			const packageSource = input.packageTarball === undefined ? registryPackageSource() : {
				kind: "tarball",
				path: input.packageTarball
			};
			const plan = planEnvironmentBundle(input.source, {
				name: input.name,
				packageSource,
				served: (name) => input.served ?? prepareServedState(input.source, input.evidence.value, {
					name,
					operation: "environment-export"
				})
			});
			if (!plan.ok) return plan;
			let files;
			try {
				files = await writeEnvironmentBundle(input, plan.value);
			} catch (cause) {
				if (cause instanceof AnalysisError) return err(cause);
				const denied = accessDeniedError(cause, hostFailurePath(cause) ?? input.directory, { output_directory: input.directory }, cause instanceof BundleFileHostFailure && cause.operation === "reading" ? "read" : "write");
				if (denied !== undefined) return err(denied);
				if (cause instanceof RegularFileChangedError) return err(changedArtifact(cause));
				if (cause instanceof ArtifactReaderFailure) return err(readerFailureError(cause, input.directory));
				if (cause instanceof BundleFileHostFailure || cause instanceof Error && systemCode(cause) !== undefined) return err(new AnalysisOutputError(ENVIRONMENT_EXPORT_OPERATION, cause.message, {
					cause,
					...cause instanceof BundleFileHostFailure && cause.operation === "reading" ? hostReadFailure(cause.path, input.directory) : hostWriteFailure(input.directory)
				}));
				throw cause;
			}
			return ok({
				status: "exported",
				directory: input.directory,
				name: plan.value.name,
				tool_count: plan.value.toolCount,
				evidence_id: input.source.evidenceId,
				manifest_evidence_id: input.source.manifestEvidenceId,
				state: plan.value.state,
				package_source: packageSourceValue(plan.value.packageSource),
				files
			});
		};
	})))();
}

//#endregion
export { environmentExportEvidenceFile, environmentExport_exports, exportEnvironmentBundle, init_environmentExport, packageTarballBytes };