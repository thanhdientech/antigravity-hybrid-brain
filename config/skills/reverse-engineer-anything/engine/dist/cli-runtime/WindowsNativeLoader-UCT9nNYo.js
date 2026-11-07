import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisCapabilityUnavailableError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { init_dosMz, init_peCoffHeader, init_peOptionalHeader, observeMzWindowsHeader, readPeCoffHeader, readPeOptionalHeaderIdentity } from "./peOptionalHeader-DFX4E6Yt.js";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { z } from "zod";
import { fileURLToPath } from "node:url";
import { PACKAGE_METADATA } from "../generatedPackageMetadata.js";

//#region dist/process/RuntimeControlUnavailableError.js
var RuntimeControlUnavailableError, runtimeControlCapabilityError;
function init_RuntimeControlUnavailableError() {
	return (init_RuntimeControlUnavailableError = __esmMin((() => {
		init_analysisErrorCore();
		RuntimeControlUnavailableError = class extends Error {
			retryable;
			/** Caller-facing recovery, when the owner knows a specific one. */
			remediationAction;
			constructor(message, options) {
				super(message, options);
				this.retryable = options?.retryable ?? false;
				this.remediationAction = options?.remediationAction;
			}
		};
		runtimeControlCapabilityError = (providerId, operation, cause) => new AnalysisCapabilityUnavailableError(providerId, operation, cause.message, {
			cause,
			retryable: cause.retryable,
			...cause.remediationAction === undefined ? {} : {
				userMessage: cause.message,
				remediationAction: cause.remediationAction
			}
		});
	})))();
}

//#endregion
//#region dist/domain/windowsNativeArtifact.js
var WINDOWS_NATIVE_ARTIFACT, WindowsNativeArtifactError, parseWindowsNativeManifest, validateWindowsX64Artifact, validateWindowsNativeArtifact, createWindowsNativeManifest;
function init_windowsNativeArtifact() {
	return (init_windowsNativeArtifact = __esmMin((() => {
		init_dosMz();
		init_peCoffHeader();
		init_peOptionalHeader();
		init_result();
		WINDOWS_NATIVE_ARTIFACT = {
			platform: "win32",
			architecture: "x64",
			abiVersion: 1,
			nodeApiVersion: 8,
			artifact: "rea-windows-x64.node"
		};
		WindowsNativeArtifactError = class extends Error {
			_tag = "WindowsNativeArtifactError";
		};
		parseWindowsNativeManifest = (value, packageVersion) => {
			if (value === null || typeof value !== "object" || Array.isArray(value)) return err(new WindowsNativeArtifactError("Windows native artifact manifest must be an object"));
			const manifest = value;
			const keys = [
				"packageVersion",
				...Object.keys(WINDOWS_NATIVE_ARTIFACT),
				"artifactSha256"
			];
			if (Object.keys(manifest).length !== keys.length || keys.some((key) => !Object.hasOwn(manifest, key))) return err(new WindowsNativeArtifactError("Windows native artifact manifest has missing or unknown fields"));
			for (const [key, expected] of Object.entries(WINDOWS_NATIVE_ARTIFACT)) if (manifest[key] !== expected) return err(new WindowsNativeArtifactError(`Windows native artifact manifest has an invalid ${key}`));
			if (typeof manifest.packageVersion !== "string") return err(new WindowsNativeArtifactError("Windows native artifact manifest has an invalid packageVersion"));
			if (typeof manifest.artifactSha256 !== "string" || !/^[a-f0-9]{64}$/u.test(manifest.artifactSha256)) return err(new WindowsNativeArtifactError("Windows native artifact manifest has an invalid artifactSha256"));
			if (manifest.packageVersion !== packageVersion) return err(new WindowsNativeArtifactError("Windows native artifact belongs to another REA version"));
			return ok({
				...WINDOWS_NATIVE_ARTIFACT,
				packageVersion: manifest.packageVersion,
				artifactSha256: manifest.artifactSha256
			});
		};
		validateWindowsX64Artifact = (bytes) => {
			if (bytes.length < 64 || bytes.toString("latin1", 0, 2) !== "MZ") return err(new WindowsNativeArtifactError("Windows native artifact is not a PE image"));
			const observed = observeMzWindowsHeader(bytes);
			if (observed.state !== "declared" || observed.signature !== "PE") return err(new WindowsNativeArtifactError("Windows native artifact is not a Windows x64 PE32+ image"));
			const offset = observed.offset;
			const coff = readPeCoffHeader(bytes.subarray(offset + 4, offset + 24));
			if (!coff.ok || coff.value.machine !== 34404 || coff.value.optionalHeaderSize > bytes.length - offset - 24) return err(new WindowsNativeArtifactError("Windows native artifact is not a Windows x64 PE32+ image"));
			const optional = readPeOptionalHeaderIdentity(bytes.subarray(offset + 24, offset + 24 + coff.value.optionalHeaderSize));
			if (!optional.ok || optional.value.bits !== 64) return err(new WindowsNativeArtifactError("Windows native artifact is not a Windows x64 PE32+ image"));
			return ok(undefined);
		};
		validateWindowsNativeArtifact = (manifest, bytes) => {
			if (createHash("sha256").update(bytes).digest("hex") !== manifest.artifactSha256) return err(new WindowsNativeArtifactError("Windows native artifact SHA-256 does not match package metadata"));
			return validateWindowsX64Artifact(bytes);
		};
		createWindowsNativeManifest = (packageVersion, bytes) => {
			const valid = validateWindowsX64Artifact(bytes);
			if (!valid.ok) return valid;
			return parseWindowsNativeManifest({
				...WINDOWS_NATIVE_ARTIFACT,
				packageVersion,
				artifactSha256: createHash("sha256").update(bytes).digest("hex")
			}, packageVersion);
		};
	})))();
}

//#endregion
//#region dist/windows/WindowsNativeLoader.js
var windowsHandleSchema, windowsFileIdentitySchema, inspectionSchema, bindingSchema, missingWindowsNativeFileReason, WINDOWS_NATIVE_LOAD_REFUSED_REMEDIATION, readPackagedWindowsNativeFile, loadWindowsNativeAuthority, cached, systemWindowsNativeAuthority, requireWindowsNativeAuthority;
function init_WindowsNativeLoader() {
	return (init_WindowsNativeLoader = __esmMin((() => {
		init_windowsNativeArtifact();
		windowsHandleSchema = z.custom((value) => typeof value === "object" && value !== null && !Array.isArray(value));
		windowsFileIdentitySchema = z.strictObject({
			requestedPath: z.string(),
			finalPath: z.string(),
			filesystem: z.literal("NTFS"),
			volumeSerial: z.string().regex(/^[a-f0-9]{16}$/u),
			fileId: z.string().regex(/^[a-f0-9]{32}$/u),
			size: z.int().nonnegative().max(Number.MAX_SAFE_INTEGER),
			directory: z.boolean()
		});
		inspectionSchema = z.strictObject({
			abiVersion: z.literal(WINDOWS_NATIVE_ARTIFACT.abiVersion),
			nodeApiVersion: z.literal(WINDOWS_NATIVE_ARTIFACT.nodeApiVersion),
			architecture: z.literal(WINDOWS_NATIVE_ARTIFACT.architecture),
			filesystem: windowsFileIdentitySchema,
			privateDacl: z.literal(true),
			privateBridgeDescriptorAccess: z.literal(true),
			atomicJobAssignment: z.literal(true),
			killOnOwnerClose: z.literal(true),
			protocolStdin: z.boolean().optional(),
			/** Absent from artifacts built before owned Job Object commit limits. */
			jobMemoryLimit: z.literal(true).optional()
		});
		bindingSchema = z.strictObject({ call: z.custom((value) => typeof value === "function") });
		missingWindowsNativeFileReason = (file) => `Missing packaged Windows native file native/windows/build/${file} (ENOENT). Restore both native/windows/build/manifest.json and native/windows/build/rea-windows-x64.node from the rea-agents@${PACKAGE_METADATA.version} tarball or build them with native/windows/README.md; no native artifact was loaded.`;
		WINDOWS_NATIVE_LOAD_REFUSED_REMEDIATION = "The file matched the package manifest, so restoring or reinstalling it will not help. If Windows reports that an Application Control policy blocked the file, Smart App Control or an App Control for Business policy refused it. Windows native controls, which Ghidra and JADX need on Windows, stay unavailable; rea setup can still register clients. Run REA on a host whose policy allows this file, or ask the REA maintainers about a signed build.";
		readPackagedWindowsNativeFile = (file, read) => {
			try {
				return read();
			} catch (cause) {
				if (typeof cause === "object" && cause !== null && "code" in cause && cause.code === "ENOENT") throw new Error(missingWindowsNativeFileReason(file), { cause });
				throw cause;
			}
		};
		loadWindowsNativeAuthority = (host) => {
			if (host.platform !== "win32" || host.architecture !== "x64") return {
				available: false,
				failureStage: "host",
				reason: "REA Windows native controls require a Windows x64 host."
			};
			const nodeApiVersion = Number(host.nodeApiVersion);
			if (!Number.isSafeInteger(nodeApiVersion) || nodeApiVersion < WINDOWS_NATIVE_ARTIFACT.nodeApiVersion) return {
				available: false,
				failureStage: "host",
				reason: "REA Windows native controls require Node-API 8 or newer."
			};
			try {
				const manifest = parseWindowsNativeManifest(readPackagedWindowsNativeFile("manifest.json", () => host.readManifest()), host.packageVersion);
				if (!manifest.ok) throw manifest.error;
				const artifact = readPackagedWindowsNativeFile(WINDOWS_NATIVE_ARTIFACT.artifact, () => host.readArtifact());
				const valid = validateWindowsNativeArtifact(manifest.value, artifact);
				if (!valid.ok) throw valid.error;
				let loadedModule;
				try {
					loadedModule = host.loadArtifact();
				} catch (cause) {
					return {
						available: false,
						failureStage: "load",
						reason: `REA Windows native controls are unavailable: Windows refused to load the verified native/windows/build/rea-windows-x64.node: ${cause instanceof Error ? cause.message : String(cause)} ${WINDOWS_NATIVE_LOAD_REFUSED_REMEDIATION}`
					};
				}
				const binding = bindingSchema.parse(loadedModule);
				let observed;
				try {
					observed = binding.call("inspect", []);
				} catch (cause) {
					return {
						available: false,
						failureStage: "self-test",
						retryable: true,
						reason: `REA Windows native self-test failed: ${cause instanceof Error ? cause.message : String(cause)}`
					};
				}
				const parsed = inspectionSchema.safeParse(observed);
				if (!parsed.success) return {
					available: false,
					failureStage: "inspection",
					reason: `REA Windows native inspection is invalid: ${parsed.error.message}`
				};
				const inspection = parsed.data;
				return {
					available: true,
					authority: {
						call: binding.call,
						inspection
					}
				};
			} catch (cause) {
				return {
					available: false,
					failureStage: "artifact",
					reason: `REA Windows native controls are unavailable: ${cause instanceof Error ? cause.message : String(cause)}`
				};
			}
		};
		;
		systemWindowsNativeAuthority = () => {
			if (cached?.available === false && cached.retryable === true) cached = undefined;
			cached ??= loadWindowsNativeAuthority({
				platform: process.platform,
				architecture: process.arch,
				nodeApiVersion: process.versions.napi,
				packageVersion: PACKAGE_METADATA.version,
				readManifest: () => {
					const encoded = readFileSync(new URL("../../native/windows/build/manifest.json", new URL("../windows/WindowsNativeLoader.js", import.meta.url).href), "utf8");
					const value = JSON.parse(encoded);
					return value;
				},
				readArtifact: () => readFileSync(new URL("../../native/windows/build/rea-windows-x64.node", new URL("../windows/WindowsNativeLoader.js", import.meta.url).href)),
				loadArtifact: () => {
					const value = createRequire(new URL("../windows/WindowsNativeLoader.js", import.meta.url).href)(fileURLToPath(new URL("../../native/windows/build/rea-windows-x64.node", new URL("../windows/WindowsNativeLoader.js", import.meta.url).href)));
					return value;
				}
			});
			return cached;
		};
		requireWindowsNativeAuthority = () => {
			const loaded = systemWindowsNativeAuthority();
			if (!loaded.available) throw new Error(loaded.reason);
			return loaded.authority;
		};
	})))();
}

//#endregion
export { RuntimeControlUnavailableError, WINDOWS_NATIVE_LOAD_REFUSED_REMEDIATION, init_RuntimeControlUnavailableError, init_WindowsNativeLoader, requireWindowsNativeAuthority, runtimeControlCapabilityError, systemWindowsNativeAuthority, windowsFileIdentitySchema, windowsHandleSchema };