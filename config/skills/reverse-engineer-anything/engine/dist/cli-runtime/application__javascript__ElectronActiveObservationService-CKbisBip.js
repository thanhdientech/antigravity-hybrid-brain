import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisAccessDeniedError, AnalysisCapabilityUnavailableError, AnalysisInputError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { createEvidence, digestCanonicalValue, init_canonicalDigest, init_evidence } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_jsonValue, jsonObjectSchema } from "./jsonValue-DGGrC1lE.js";
import { constants } from "node:fs";
import { dirname } from "node:path";
import { access, realpath, stat } from "node:fs/promises";

//#region dist/application/javascript/ElectronActiveEvidence.js
var createElectronActiveEvidence, parameters;
function init_ElectronActiveEvidence() {
	return (init_ElectronActiveEvidence = __esmMin((() => {
		init_canonicalDigest();
		init_evidence();
		init_jsonValue();
		createElectronActiveEvidence = (input, result, provider, resolvedInput) => createEvidence(undefined, provider, {
			predicateType: "rea.electron-active-scenario",
			operation: "capture_electron_scenario",
			parameters: parameters(input, resolvedInput),
			result,
			confidence: "observed",
			authority: "controlled-replay",
			environment: {
				id: `${result.application.electron_version}@unknown`,
				platform: "unknown",
				architecture: "unknown",
				isolation: "none"
			},
			limitations: [...result.limitations, "Application host platform and architecture were not observed."]
		});
		parameters = (input, resolvedInput) => {
			const scenario = jsonObjectSchema.parse(input);
			return {
				...scenario,
				scenario_sha256: digestCanonicalValue(scenario, "Electron scenario"),
				...resolvedInput === undefined ? {} : { resolved_paths: {
					executable_path: resolvedInput.executable_path,
					application_path: resolvedInput.application_path,
					application_root: resolvedInput.application_root
				} }
			};
		};
	})))();
}

//#endregion
//#region dist/application/javascript/ElectronActiveObservationService.js
var OPERATION, PROVIDER_ID, hostAccessDenial, resolveInputPath, resolveExecutablePath, notExecutable, canonicalizeInput, captureElectronScenario;
function init_ElectronActiveObservationService() {
	return (init_ElectronActiveObservationService = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		init_ElectronActiveEvidence();
		OPERATION = "capture_electron_scenario";
		PROVIDER_ID = "rea-playwright-electron-active";
		hostAccessDenial = (selected, cause) => {
			const code = cause instanceof Error ? Reflect.get(cause, "code") : undefined;
			return code === "EACCES" || code === "EPERM" ? {
				kind: "denied",
				error: new AnalysisAccessDeniedError(OPERATION, selected, code, { cause })
			} : undefined;
		};
		resolveInputPath = async (field, selected) => {
			try {
				const metadata = await stat(selected);
				if (field === "application_root" && !metadata.isDirectory()) {
					const cause = new Error("not a directory");
					return err({
						kind: "invalid",
						issue: {
							path: [field],
							reason: "invalid_value",
							message: `application_root ${selected} is not a directory`
						},
						cause
					});
				}
				return ok(await realpath(selected));
			} catch (cause) {
				return err(hostAccessDenial(selected, cause) ?? {
					kind: "invalid",
					issue: {
						path: [field],
						reason: "invalid_value",
						message: `Cannot resolve ${field} ${selected}: ${cause instanceof Error ? cause.message : String(cause)}`
					},
					cause
				});
			}
		};
		resolveExecutablePath = async (selected) => {
			const resolved = await resolveInputPath("executable_path", selected);
			if (!resolved.ok) return resolved;
			let metadata;
			try {
				metadata = await stat(resolved.value);
			} catch (cause) {
				return err(hostAccessDenial(selected, cause) ?? notExecutable(selected, cause));
			}
			if (!metadata.isFile()) return err(notExecutable(selected, new Error("not a regular file")));
			if (process.platform !== "win32") try {
				await access(resolved.value, constants.X_OK);
			} catch (cause) {
				return err(notExecutable(selected, cause));
			}
			return resolved;
		};
		notExecutable = (selected, cause) => ({
			kind: "invalid",
			issue: {
				path: ["executable_path"],
				reason: "invalid_value",
				message: `executable_path ${selected} is not an executable file: ${cause instanceof Error ? cause.message : String(cause)}`
			},
			cause
		});
		canonicalizeInput = async (input) => {
			const [executable, application, root] = await Promise.all([
				resolveExecutablePath(input.executable_path),
				resolveInputPath("application_path", input.application_path),
				input.application_root === undefined ? Promise.resolve(ok(undefined)) : resolveInputPath("application_root", input.application_root)
			]);
			if (!executable.ok || !application.ok || !root.ok) {
				const failures = [
					executable,
					application,
					root
				].flatMap((result) => result.ok ? [] : [result.error]);
				const issues = failures.flatMap((failure) => failure.kind === "invalid" ? [failure.issue] : []);
				const denial = failures.find((failure) => failure.kind === "denied");
				if (issues.length === 0 && denial !== undefined) return err(denial.error);
				return err(new AnalysisInputError(OPERATION, { cause: new AggregateError(failures.map((failure) => failure.kind === "invalid" ? failure.cause : failure.error), "Electron paths could not be resolved") }, issues));
			}
			return ok({
				...input,
				executable_path: executable.value,
				application_path: application.value,
				application_root: root.value ?? dirname(application.value)
			});
		};
		captureElectronScenario = async (provider, input, options = {}) => {
			const canonical = await canonicalizeInput(input);
			if (!canonical.ok) return canonical;
			if (provider === undefined) return err(new AnalysisCapabilityUnavailableError(PROVIDER_ID, OPERATION, "active Electron observation provider is not configured"));
			const captured = await provider.capture(canonical.value, options);
			return captured.ok ? {
				ok: true,
				value: createElectronActiveEvidence(input, captured.value, provider.identity(), canonical.value)
			} : captured;
		};
	})))();
}

//#endregion
init_ElectronActiveObservationService();
export { captureElectronScenario };