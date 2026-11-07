import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_analysisErrorBase, t as AnalysisError } from "./analysisErrorBase-DIqf4-vY.js";
import { X as init_providerAdapterError, Y as ProviderAdapterError } from "./analysisErrorProjection-B_6dTGtM.js";
import { i as init_asarHeaderAdmission, n as DEFAULT_ASAR_HEADER_ADMISSION } from "./asarHeaderAdmission-BLia88KI.js";
import { f as init_analysisErrorCore, i as AnalysisCancelledError } from "./analysisErrorCore-BCqhUcUc.js";
import { C as ArtifactReaderFailure, D as init_ArtifactReader, m as init_RegularFile, v as regularFileState, y as sameRegularFileState } from "./OwnedRegularFile-CufsBAJJ.js";
import { n as ArtifactResourceScope, r as init_ArtifactResourceScope } from "./ArtifactResourceScope-CStgM9Qm.js";
import { c as bindArtifactFileCleanup, d as withArtifactFileHandle, l as init_ArtifactFileOperation, n as ArtifactFileCleanupFailure, s as assertArtifactReadActive } from "./ArtifactFileOperation-cr4zEunz.js";
import { Ti as init_AsarNode, wi as asarNodeSchema } from "./createServer-CMxQrH3I.js";
import { n as init_analysisErrorCleanup, t as analysisErrorWithCleanupFailure } from "./analysisErrorCleanup-CLocSgSR.js";
import { n as init_providerCleanupError, t as ProviderCleanupError } from "./providerCleanupError-CbzQ5mbk.js";
import { i as init_AsarHeader, n as asarHeaderAdmissionFailure, t as admitAsarHeader } from "./AsarHeader-Cc-q_e3d.js";
import { isAbsolute, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { open, realpath, stat } from "node:fs/promises";

//#region dist/browser/ElectronFileScope.js
var ElectronFileScope, processElectronFiles, authorizedElectronFile, retryElectronFileCleanup, mapElectronFileAuthorizationFailure, resolveAuthorizedElectronFile, authorizedAsarMember, MAX_CACHED_HEADERS, headerCache, asarFiles, asarFileScopeNodeSchema, isAsarRegularFile, isRecord, throwIfAborted;
function init_ElectronFileScope() {
	return (init_ElectronFileScope = __esmMin((() => {
		init_analysisErrorCore();
		init_analysisErrorBase();
		init_analysisErrorCleanup();
		init_providerAdapterError();
		init_providerCleanupError();
		init_ArtifactFileOperation();
		init_AsarNode();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_RegularFile();
		init_AsarHeader();
		init_asarHeaderAdmission();
		ElectronFileScope = class {
			#resources = new ArtifactResourceScope();
			async authorize(value, signal, operation = "inspect_electron_page", asarHeaderAdmission = DEFAULT_ASAR_HEADER_ADMISSION) {
				try {
					return await this.#resources.run(async () => await resolveAuthorizedElectronFile(value, signal, asarHeaderAdmission, this.#resources));
				} catch (cause) {
					if (cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined) throw cause;
					if (signal?.aborted === true) throw new AnalysisCancelledError(operation, { cause: signal.reason });
					throw cause;
				}
			}
			retryCleanup() {
				return this.#resources.retryCleanup();
			}
		};
		processElectronFiles = new ElectronFileScope();
		authorizedElectronFile = (value, signal, operation = "inspect_electron_page", asarHeaderAdmission = DEFAULT_ASAR_HEADER_ADMISSION, files = processElectronFiles) => files.authorize(value, signal, operation, asarHeaderAdmission);
		retryElectronFileCleanup = (files = processElectronFiles) => files.retryCleanup();
		mapElectronFileAuthorizationFailure = (cause, providerId, operation, diagnostics) => {
			if (!(cause instanceof ArtifactReaderFailure) || cause.cleanup === undefined) return undefined;
			const physical = cause instanceof ArtifactFileCleanupFailure ? cause.fileCleanupFailure : undefined;
			const physicalPrimary = physical?.outcome.kind === "failed" ? physical.outcome.cause : undefined;
			const cancellationReason = physical?.completionCancellation === undefined ? physicalPrimary instanceof ArtifactReaderFailure && physicalPrimary.reason === "cancelled" ? physicalPrimary.cancellation === undefined ? physicalPrimary.cause : physicalPrimary.cancellation.reason : undefined : physical.completionCancellation.reason;
			const hasCancellation = physical?.completionCancellation !== undefined || physicalPrimary instanceof ArtifactReaderFailure && physicalPrimary.reason === "cancelled";
			const primary = hasCancellation ? new AnalysisCancelledError(operation, { cause: cancellationReason }) : physicalPrimary instanceof AnalysisError ? physicalPrimary : physicalPrimary === undefined ? undefined : new ProviderAdapterError(providerId, operation, { cause: physicalPrimary });
			const cleanup = new ProviderCleanupError(providerId, cause.cleanup.resources, { reason: cause.cleanup.reason }, {
				operation,
				cause
			});
			bindArtifactFileCleanup(cause, cleanup);
			if (diagnostics !== undefined) (primary ?? cleanup).retainDiagnostics(diagnostics);
			if (primary === undefined) return cleanup;
			const composed = analysisErrorWithCleanupFailure(primary, cleanup, operation).bindCleanupDependencies([primary, cleanup]);
			bindArtifactFileCleanup(cause, composed);
			return composed;
		};
		resolveAuthorizedElectronFile = async (value, signal, asarHeaderAdmission, resources) => {
			throwIfAborted(signal);
			let url;
			try {
				url = new URL(value);
			} catch (cause) {
				void cause;
				return undefined;
			}
			if (url.protocol !== "file:" || url.hostname !== "" || url.username !== "" || url.password !== "" || /%(?:2f|5c)/iu.test(url.pathname)) return undefined;
			let path;
			try {
				path = fileURLToPath(url);
			} catch (cause) {
				void cause;
				return undefined;
			}
			if (!isAbsolute(path) || path.includes("\0")) return undefined;
			try {
				const metadata = await stat(path);
				throwIfAborted(signal);
				if (metadata.isFile()) {
					const canonical = await realpath(path);
					throwIfAborted(signal);
					return canonical;
				}
			} catch (cause) {
				throwIfAborted(signal);
				void cause;
			}
			throwIfAborted(signal);
			return await authorizedAsarMember(path, signal, asarHeaderAdmission, resources);
		};
		authorizedAsarMember = async (path, signal, asarHeaderAdmission, resources) => {
			const segments = path.split(sep);
			for (let index = 1; index < segments.length - 1; index += 1) {
				throwIfAborted(signal);
				if (!(segments[index] ?? "").toLowerCase().endsWith(".asar")) continue;
				const archive = segments.slice(0, index + 1).join(sep);
				const member = segments.slice(index + 1);
				if (member.some((part) => part === "" || part === "." || part === "..")) return undefined;
				try {
					const metadata = await stat(archive);
					throwIfAborted(signal);
					if (!metadata.isFile()) continue;
					const canonical = await realpath(archive);
					throwIfAborted(signal);
					const files = await asarFiles(canonical, metadata, asarHeaderAdmission, signal, resources);
					throwIfAborted(signal);
					return isAsarRegularFile(files, member) ? join(canonical, ...member) : undefined;
				} catch (cause) {
					if (cause instanceof ArtifactFileCleanupFailure) throw cause;
					if (cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined) throw cause;
					throwIfAborted(signal);
					void cause;
					return undefined;
				}
			}
			return undefined;
		};
		MAX_CACHED_HEADERS = 8;
		headerCache = new Map();
		asarFiles = async (archive, metadata, admission, signal, resources) => {
			throwIfAborted(signal);
			const identity = regularFileState(metadata);
			const cached = headerCache.get(archive);
			if (cached !== undefined && sameRegularFileState(cached.identity, metadata)) {
				if (cached.headerBytes > admission.maximumBytes) throw asarHeaderAdmissionFailure(admission, cached.headerBytes);
				return cached.files;
			}
			const handle = await open(archive, "r");
			const admitted = await withArtifactFileHandle(archive, handle, resources, signal, async (file) => {
				let jsonBytes;
				let headerBytes;
				throwIfAborted(signal);
				const opened = await file.stat();
				throwIfAborted(signal);
				if (!sameRegularFileState(identity, opened)) throw new Error("ASAR identity changed before header read");
				const header = await admitAsarHeader(file, signal, admission);
				throwIfAborted(signal);
				jsonBytes = header.jsonBytes;
				headerBytes = header.headerBytes;
				const json = Buffer.alloc(jsonBytes);
				let offset = 0;
				while (offset < json.length) {
					throwIfAborted(signal);
					const part = await file.read(json, offset, json.length - offset, 16 + offset);
					throwIfAborted(signal);
					if (part.bytesRead === 0) throw new Error("Truncated ASAR JSON header");
					offset += part.bytesRead;
				}
				const afterRead = await file.stat();
				throwIfAborted(signal);
				if (!sameRegularFileState(identity, afterRead)) throw new Error("ASAR identity changed during header read");
				const parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(json));
				if (!isRecord(parsed) || !isRecord(parsed.files)) throw new Error("ASAR header has no file tree");
				return {
					files: parsed.files,
					jsonBytes,
					headerBytes
				};
			});
			throwIfAborted(signal);
			headerCache.delete(archive);
			headerCache.set(archive, {
				identity,
				files: admitted.files,
				bytes: admitted.jsonBytes,
				headerBytes: admitted.headerBytes
			});
			const retainedBytes = () => [...headerCache.values()].reduce((sum, entry) => sum + entry.bytes, 0);
			while (headerCache.size > MAX_CACHED_HEADERS || retainedBytes() > admission.maximumBytes) headerCache.delete(headerCache.keys().next().value ?? archive);
			return admitted.files;
		};
		asarFileScopeNodeSchema = asarNodeSchema.pick({
			files: true,
			link: true,
			size: true
		}).strip();
		isAsarRegularFile = (files, member) => {
			let node = { files };
			for (const part of member) {
				if (!isRecord(node) || Object.hasOwn(node, "link")) return false;
				const children = node.files;
				if (!isRecord(children) || !Object.hasOwn(children, part)) return false;
				node = children[part];
			}
			const parsed = asarFileScopeNodeSchema.safeParse(node);
			return parsed.success && parsed.data.size !== undefined && parsed.data.files === undefined && parsed.data.link === undefined;
		};
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		throwIfAborted = (signal) => {
			assertArtifactReadActive(signal);
		};
	})))();
}

//#endregion
export { retryElectronFileCleanup as a, mapElectronFileAuthorizationFailure as i, authorizedElectronFile as n, init_ElectronFileScope as r, ElectronFileScope as t };