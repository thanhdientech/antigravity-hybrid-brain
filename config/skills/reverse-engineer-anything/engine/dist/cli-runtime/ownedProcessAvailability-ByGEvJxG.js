import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { HopperProcessError, HopperRemoteError, HopperTimeoutError, ProviderAdapterError, init_hopperErrors, init_providerAdapterError } from "./jsonLines-CKG28FwL.js";
import { ArtifactReaderFailure, RegularFileChangedError, init_ArtifactReader, init_RegularFile } from "./ArtifactReader-DJ9rniiL.js";
import { AnalysisCleanupLease, init_AnalysisCleanupLease } from "./AnalysisCleanupLease-DZIxbgES.js";
import { AnalysisAccessDeniedError, AnalysisArtifactChangedError, AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisError, AnalysisOutputError, AnalysisResourceConstraintError, AnalysisTimeoutError, init_analysisErrorBase, init_analysisErrorCore, resourceConstraintRecovery } from "./analysisErrorCore-Dm6oHouq.js";
import { init_jsonValue, jsonValueSchema } from "./jsonValue-DGGrC1lE.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";
import { artifactFileCancellationCause, artifactFilePrimaryFacts, assertArtifactReadActive, bindArtifactFileCleanup, init_ArtifactFileOperation, mapArtifactFileFailure, withArtifactFileHandle, withArtifactRegularFile } from "./ArtifactFileOperation-YawaP_UN.js";
import { ProviderCleanupError, init_providerCleanupError } from "./providerCleanupError-7gv3MO0l.js";
import { DarwinProcessOwnershipInspectionError, LinuxOwnedProcessPrerequisiteError, init_DarwinProcessRunTokenReader, init_ProcessOwnershipObservation } from "./ProcessOwnershipEvidence-7mvEaeb9.js";
import { RegularFileCapacityError, init_readStableFileBytes, readStableFileBytes } from "./readStableFileBytes-ygI763vO.js";
import { OwnedCommandFailure, init_OwnedCommand } from "./OwnedCommand-D1Jn3JfF.js";
import { open } from "node:fs/promises";

//#region dist/ghidra/GhidraAdmissionError.js
var GHIDRA_ADMISSION_CODES, GhidraAdmissionError;
function init_GhidraAdmissionError() {
	return (init_GhidraAdmissionError = __esmMin((() => {
		GHIDRA_ADMISSION_CODES = [
			"existing_project_windows",
			"existing_project_program_name",
			"existing_project_psp",
			"existing_project_dos",
			"existing_project_raw_binary",
			"existing_project_language_override",
			"existing_project_mips_soft_float",
			"existing_project_riscv_calling_convention",
			"existing_project_analysis",
			"gamecube_dol_combined",
			"psp_combined",
			"psp_raw_binary",
			"mips_soft_float_scope",
			"riscv_calling_convention_scope",
			"language_override_dos",
			"language_override_raw_binary",
			"raw_binary_dos",
			"invalid_environment_entry",
			"invalid_jvm_argument",
			"unterminated_quote",
			"platform_override",
			"argument_files_exceed_bound",
			"nested_argument_file",
			"argument_file_unreadable",
			"argument_file_path_invalid",
			"argument_files_require_scope",
			"prepared_options_exceed_bound",
			"output_unobserved",
			"handshake_identity",
			"import_identity_unavailable",
			"import_identity_mismatch",
			"response_shape",
			"response_json",
			"seed_path_differs",
			"seed_changed",
			"canonical_path",
			"nesting_exceeds_limit",
			"entry_kind",
			"component_missing",
			"loader_jar_missing",
			"bytes_exceed_limit",
			"properties_exceed_limit",
			"component_changed",
			"component_truncated",
			"properties_invalid",
			"metadata_mismatch",
			"host_unsupported",
			"inventory_exceeds_limit",
			"not_jar",
			"unregistered",
			"path_differs",
			"digest_differs"
		];
		GhidraAdmissionError = class extends Error {
			code;
			detail;
			_tag = "GhidraAdmissionError";
			constructor(code, detail, options) {
				super(code, options);
				this.code = code;
				this.detail = detail;
				this.name = "GhidraAdmissionError";
			}
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraFileArtifacts.js
var readGhidraProfileArtifact, writeGhidraProfileArtifact, ghidraFileFailure;
function init_GhidraFileArtifacts() {
	return (init_GhidraFileArtifacts = __esmMin((() => {
		init_GhidraAdmissionError();
		init_ArtifactReader();
		init_ArtifactFileOperation();
		init_readStableFileBytes();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_RegularFile();
		init_providerAdapterError();
		init_providerCleanupError();
		init_analysisErrorCleanup();
		readGhidraProfileArtifact = (path, maximumBytes, resources, signal, interpret) => withArtifactRegularFile(path, resources, signal, async ({ handle: file }) => {
			const bytes = await readStableFileBytes(file, path, maximumBytes, {
				symlinks: "reject",
				...signal === undefined ? {} : { signal }
			});
			return interpret(bytes);
		});
		writeGhidraProfileArtifact = async (path, bytes, resources, signal) => {
			assertArtifactReadActive(signal);
			const file = await open(path, "wx", 384);
			await withArtifactFileHandle(path, file, resources, signal, (handle) => handle.writeFile(bytes));
		};
		ghidraFileFailure = (cause, operation, diagnostics = {}) => {
			cause = mapArtifactFileFailure(cause, (primary) => {
				if (primary instanceof RegularFileCapacityError) return new AnalysisResourceConstraintError(operation, "file-size", primary.message, {
					maximum_bytes: primary.maximumBytes,
					observed_bytes: primary.observedBytes.toString()
				}, {
					cause: primary,
					diagnostics,
					retryable: false
				});
				if (primary instanceof RegularFileChangedError) return new AnalysisArtifactChangedError(operation, primary.path, primary.message, {
					cause: primary,
					diagnostics
				});
				if (primary instanceof Error && "code" in primary && (primary.code === "EACCES" || primary.code === "EPERM")) {
					const path = "path" in primary && typeof primary.path === "string" ? primary.path : diagnostics.path;
					if (typeof path === "string") return new AnalysisAccessDeniedError(operation, path, primary.code, {
						cause: primary,
						diagnostics
					});
				}
				return primary;
			});
			const { cause: primary, origin } = artifactFilePrimaryFacts(cause);
			const admission = primary instanceof GhidraAdmissionError ? primary : undefined;
			const reason = admission?.code ?? (primary instanceof Error ? primary.message : String(primary));
			const systemCode = admission === undefined && primary instanceof Error && "code" in primary && typeof primary.code === "string" ? primary.code : undefined;
			const cleanup = cause instanceof ArtifactReaderFailure ? cause.cleanup : undefined;
			if (origin === "owned-or-classified" && primary instanceof AnalysisError) {
				if (cleanup === undefined) return primary;
				const failure = new ProviderCleanupError("ghidra", cleanup.resources, { reason: cleanup.reason }, { cause });
				bindArtifactFileCleanup(cause, failure);
				return analysisErrorWithCleanupFailure(primary, failure, operation).bindCleanupDependencies([...primary.cleanupIncomplete ? [primary] : [], failure]);
			}
			const error = cause instanceof ArtifactReaderFailure && cause.reason === "cancelled" ? new AnalysisCancelledError(operation, {
				cause: artifactFileCancellationCause(cause),
				cleanup,
				diagnostics
			}) : new ProviderAdapterError("ghidra", operation, {
				cause,
				cleanup,
				diagnostics: {
					...admission?.detail,
					...diagnostics,
					...admission === undefined ? {} : { code: admission.code },
					...systemCode === undefined ? {} : { system_code: systemCode },
					...primary instanceof Error && "syscall" in primary && typeof primary.syscall === "string" ? { syscall: primary.syscall } : {},
					reason
				},
				userMessage: reason
			});
			bindArtifactFileCleanup(cause, error);
			return error;
		};
	})))();
}

//#endregion
//#region dist/providers/AnalysisClientFailure.js
var analysisClientFailureContext, analysisClientFailureForOperation;
function init_AnalysisClientFailure() {
	return (init_AnalysisClientFailure = __esmMin((() => {
		init_hopperErrors();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_providerAdapterError();
		init_providerCleanupError();
		init_ArtifactReader();
		init_ArtifactFileOperation();
		analysisClientFailureContext = (cause, providerId, operation) => {
			const providerRequest = cause instanceof HopperRemoteError || cause instanceof HopperTimeoutError || cause instanceof HopperProcessError ? {
				...cause.operation === undefined ? {} : { operation: cause.operation },
				...cause.requestId === undefined ? {} : { request_id: cause.requestId },
				...cause instanceof HopperRemoteError ? {
					provider_code: cause.code,
					diagnostic_type: cause.diagnosticType
				} : {}
			} : undefined;
			const attribute = (recorded) => providerRequest === undefined ? recorded : {
				provider_request: providerRequest,
				...recorded === undefined ? {} : { provider_diagnostics: recorded }
			};
			const diagnostics = attribute(cause.diagnostics);
			const invocationDiagnostics = cause.invocationDiagnostics === undefined ? undefined : attribute(cause.invocationDiagnostics);
			return {
				cause,
				...cause.limit === undefined ? {} : { limit: cause.limit },
				...cause.continuingCallerGuidance === undefined ? {} : { continuingCallerGuidance: cause.continuingCallerGuidance },
				...cause.cleanupPrimary === undefined ? {} : { cleanupPrimary: analysisClientFailureForOperation(cause.cleanupPrimary, providerId, operation) },
				...cause.partialObservation === undefined ? {} : { partialObservation: cause.partialObservation },
				...cause.capturedOutput === undefined ? {} : { capturedOutput: cause.capturedOutput },
				...diagnostics === undefined ? {} : { diagnostics },
				...invocationDiagnostics === undefined ? {} : { invocationDiagnostics },
				...cause.cleanupIncomplete ? { cleanup: {
					reason: cause.cleanup?.reason ?? cause.message,
					resources: cause.cleanupResources
				} } : {}
			};
		};
		analysisClientFailureForOperation = (cause, providerId, operation, callerDiagnostics) => {
			if (!(cause instanceof AnalysisError)) {
				const failure = new ProviderAdapterError(providerId, operation, {
					cause,
					...callerDiagnostics === undefined ? {} : { diagnostics: callerDiagnostics },
					...cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined ? { cleanup: cause.cleanup } : {}
				});
				bindArtifactFileCleanup(cause, failure);
				return failure;
			}
			if (!(cause instanceof HopperRemoteError) && !(cause instanceof HopperTimeoutError) && !(cause instanceof HopperProcessError) && !(cause instanceof AnalysisCancelledError) && !(cause instanceof ProviderAdapterError) && !(cause instanceof AnalysisCapabilityUnavailableError) && !(cause instanceof AnalysisAccessDeniedError) && !(cause instanceof AnalysisArtifactChangedError) && !(cause instanceof AnalysisTimeoutError) && !(cause instanceof AnalysisOutputError) && !(cause instanceof AnalysisResourceConstraintError)) return cause;
			const sourceContext = analysisClientFailureContext(cause, providerId, operation);
			const context = {
				...sourceContext,
				...callerDiagnostics === undefined ? {} : { diagnostics: {
					...sourceContext.diagnostics,
					...callerDiagnostics
				} }
			};
			let result;
			if (cause instanceof HopperRemoteError) result = new HopperRemoteError(cause.code, cause.safeMessage, {
				...context,
				operation,
				requestId: cause.requestId,
				diagnosticType: cause.diagnosticType
			});
			else if (cause instanceof HopperTimeoutError) result = new HopperTimeoutError(cause.timeoutMs, operation, cause.requestId, cause.providerState, cause.stage, cause.launcherOutcome, context);
			else if (cause instanceof HopperProcessError) result = new HopperProcessError(cause.exitCode, {
				...context,
				operation,
				requestId: cause.requestId,
				providerState: cause.providerState,
				stage: cause.stage,
				...cause.diagnostic === undefined ? {} : { diagnostic: cause.diagnostic },
				...cause.launcherFailure === undefined ? {} : { launcherFailure: cause.launcherFailure }
			});
			else if (cause instanceof ProviderCleanupError) {
				const { diagnostics, ...outcomeContext } = context;
				result = new ProviderCleanupError(cause.providerId, cause.cleanupResources, diagnostics ?? {}, {
					...outcomeContext,
					operation,
					...cause.completedObservation === undefined ? {} : { completedObservation: cause.completedObservation },
					...cause.remediationAction === undefined ? {} : { remediationAction: cause.remediationAction }
				});
			} else if (cause instanceof AnalysisTimeoutError) result = new AnalysisTimeoutError(operation, cause.timeoutMs, {
				...context,
				...cause.userMessage === undefined ? {} : { userMessage: cause.userMessage },
				...cause.remediationAction === undefined ? {} : { remediationAction: cause.remediationAction }
			});
			else if (cause instanceof AnalysisOutputError) result = new AnalysisOutputError(operation, cause.reason, {
				...context,
				cleanupOnly: cause.cleanupOnly,
				...cause.userMessage === undefined ? {} : { userMessage: cause.userMessage },
				...cause.remediationAction === undefined ? {} : { remediationAction: cause.remediationAction }
			});
			else if (cause instanceof AnalysisCancelledError) result = new AnalysisCancelledError(operation, {
				...context,
				cause: cause.cause
			});
			else if (cause instanceof AnalysisCapabilityUnavailableError) result = new AnalysisCapabilityUnavailableError(cause.providerId, operation, cause.reason, {
				...context,
				...cause.userMessage === undefined ? {} : { userMessage: cause.userMessage },
				retryable: cause.retryable
			});
			else if (cause instanceof AnalysisAccessDeniedError) result = new AnalysisAccessDeniedError(operation, cause.path, cause.systemCode, context);
			else if (cause instanceof AnalysisArtifactChangedError) result = new AnalysisArtifactChangedError(operation, cause.path, cause.reason, context);
			else if (cause instanceof AnalysisResourceConstraintError) result = new AnalysisResourceConstraintError(operation, cause.resource, cause.reason, cause.reportedLimits, {
				...context,
				...resourceConstraintRecovery(cause)
			});
			else result = new ProviderAdapterError(providerId, operation, {
				...context,
				...cause.userMessage === undefined ? {} : { userMessage: cause.userMessage },
				...cause.remediationAction === undefined ? {} : { remediationAction: cause.remediationAction }
			});
			return cause.cleanupIncomplete ? result.bindCleanupDependencies([cause]) : result.resolveCleanup();
		};
	})))();
}

//#endregion
//#region dist/providers/OwnedCommandCleanup.js
var retainOwnedCommandCleanup;
function init_OwnedCommandCleanup() {
	return (init_OwnedCommandCleanup = __esmMin((() => {
		init_jsonValue();
		init_AnalysisCleanupLease();
		init_providerCleanupError();
		init_DarwinProcessRunTokenReader();
		init_OwnedCommand();
		retainOwnedCommandCleanup = (cause, resourceOwner, providerId, operation) => {
			const commandFailure = cause instanceof OwnedCommandFailure ? cause : undefined;
			const preparation = commandFailure?.preparationFailure ?? (cause instanceof DarwinProcessOwnershipInspectionError ? cause : undefined);
			const cleanups = [];
			if (preparation?.cleanupFailure !== undefined) {
				const cleanup = preparation.cleanupFailure;
				const lease = new AnalysisCleanupLease(async () => {
					if (!cleanup.cleanupIncomplete) return;
					if (preparation.cleanupOwner === undefined) throw cleanup;
					await preparation.cleanupOwner.close();
					if (cleanup.cleanupIncomplete) throw cleanup;
				}, cleanup);
				resourceOwner.retain({
					close: () => lease.release(),
					get cleanupResources() {
						return cleanup.cleanupResources;
					}
				}, cleanup.cleanupResources[0] ?? "Provider prerequisite ownership preparation");
				cleanups.push(cleanup);
			}
			if (commandFailure !== undefined && (commandFailure.cleanupOwner !== undefined || commandFailure.cleanupFailure !== null)) {
				const supervisor = commandFailure.cleanupOwner;
				const failureForStop = (reason, result) => new ProviderCleanupError(providerId, commandFailure.resources, {
					reason,
					...result === undefined ? {} : { process_cleanup: jsonValueSchema.parse(result) }
				}, {
					cause,
					operation
				});
				const cleanup = failureForStop(commandFailure.cleanupFailure ?? "Provider prerequisite cleanup remains incomplete", commandFailure.cleanupResult);
				const lease = new AnalysisCleanupLease(async () => {
					if (supervisor === undefined) throw cleanup;
					const stopped = await supervisor.stop();
					if (stopped.status === "incomplete") {
						const failure = failureForStop(stopped.reason, stopped.cleanupResult);
						failure.bindCleanupResourceOwner(lease);
						lease.bindCleanupError(failure);
						throw failure;
					}
				}, commandFailure.resources);
				cleanup.bindCleanupResourceOwner(lease);
				lease.bindCleanupError(cleanup);
				resourceOwner.retain({
					close: () => lease.release(),
					get cleanupResources() {
						return cleanup.cleanupResources;
					}
				}, commandFailure.resources[0] ?? "Provider prerequisite process");
				cleanups.push(cleanup);
			}
			return cleanups;
		};
	})))();
}

//#endregion
//#region dist/application/ownedProcessAvailability.js
var REMEDIATION, DARWIN_REMEDIATION, prerequisiteRefusal, darwinPrerequisiteRefusal, ownedProcessPrerequisiteAvailability;
function init_ownedProcessAvailability() {
	return (init_ownedProcessAvailability = __esmMin((() => {
		init_analysisErrorCore();
		init_providerAdapterError();
		init_jsonValue();
		init_DarwinProcessRunTokenReader();
		init_OwnedCommand();
		init_ProcessOwnershipObservation();
		REMEDIATION = "Install your distribution's procps or procps-ng package, or put a procps-compatible ps on REA's PATH, then retry.";
		DARWIN_REMEDIATION = "Check the selected Xcode or Command Line Tools and Swift compiler configuration, then restart REA and retry.";
		prerequisiteRefusal = (cause) => {
			if (!(cause instanceof AnalysisCapabilityUnavailableError) || cause.cleanupIncomplete) return undefined;
			for (let current = cause; current instanceof AnalysisCapabilityUnavailableError; current = current.cause) if (current instanceof LinuxOwnedProcessPrerequisiteError) return current;
			return undefined;
		};
		darwinPrerequisiteRefusal = (cause) => {
			let current = cause;
			while (current instanceof ProviderAdapterError) {
				if (current.cleanupIncomplete || current.diagnostics?.stage !== "ownership_preparation") return undefined;
				current = current.cause;
			}
			if (current instanceof OwnedCommandFailure) {
				if (current.reason !== "process" || current.cleanupOwner !== undefined || current.cleanupFailure !== null || current.cleanupResult !== undefined || current.cancellation !== undefined) return undefined;
				current = current.preparationFailure;
			}
			return current instanceof DarwinProcessOwnershipInspectionError && current.cleanupFailure === undefined && current.cleanupOwner === undefined && current.cancellation === undefined ? current : undefined;
		};
		ownedProcessPrerequisiteAvailability = (cause) => {
			const refusal = prerequisiteRefusal(cause);
			if (refusal !== undefined) return {
				status: "unavailable",
				code: "runtime_unavailable",
				reason: `${refusal.reason}. ${REMEDIATION}`,
				remediation: REMEDIATION,
				diagnostics: {
					stage: "ownership_preparation",
					prerequisite_provider_id: refusal.providerId,
					prerequisite_operation: refusal.operation
				}
			};
			const darwin = darwinPrerequisiteRefusal(cause);
			if (darwin === undefined) return undefined;
			return {
				status: "unavailable",
				code: "runtime_unavailable",
				reason: `${darwin.message}. ${DARWIN_REMEDIATION}`,
				remediation: DARWIN_REMEDIATION,
				diagnostics: {
					stage: "ownership_preparation",
					...darwin.compilerOutcome === undefined ? {} : { compiler_outcome: jsonValueSchema.parse(darwin.compilerOutcome) }
				}
			};
		};
	})))();
}

//#endregion
export { GhidraAdmissionError, analysisClientFailureContext, analysisClientFailureForOperation, ghidraFileFailure, init_AnalysisClientFailure, init_GhidraAdmissionError, init_GhidraFileArtifacts, init_OwnedCommandCleanup, init_ownedProcessAvailability, ownedProcessPrerequisiteAvailability, readGhidraProfileArtifact, retainOwnedCommandCleanup, writeGhidraProfileArtifact };