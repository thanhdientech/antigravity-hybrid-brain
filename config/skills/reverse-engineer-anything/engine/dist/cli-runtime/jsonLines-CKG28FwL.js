import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { fixedAllowanceRemediation, init_fixedAllowanceRemediation } from "./fixedAllowanceRemediation-Gm2892s1.js";
import { AnalysisAccessDeniedError, AnalysisArtifactChangedError, AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisError, AnalysisInputError, AnalysisOutputError, AnalysisResourceConstraintError, AnalysisTimeoutError, AnalysisUnsupportedTargetError, init_analysisErrorBase, init_analysisErrorCore, primaryAnalysisError, resolvedAnalysisError } from "./analysisErrorCore-Dm6oHouq.js";
import { init_immutableJson, init_jsonValue, isImmutableJsonSnapshot, jsonValueSchema } from "./jsonValue-DGGrC1lE.js";
import { JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS, JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM, init_artifactIntegrity, init_javascriptAnalysisResourceControls, projectArtifactIntegrityDetails } from "./javascriptAnalysisResourceControls-CEcnXNLc.js";
import { DEFAULT_WASM_COMMAND_TIMEOUT_MS, MAX_WASM_COMMAND_TIMEOUT_MS, cleanupRetryRecovery, cleanupRetryRemediation, init_analysisErrorRecovery, init_wasmArtifact } from "./wasmArtifact-BLJlxLKg.js";
import { describeResidualUnknownGraphConstraint, init_residualUnknownGraphError } from "./residualUnknownGraphError-Dik3wsXE.js";
import { z } from "zod";
import { Formatter } from "incur";

//#region dist/domain/result.js
var ok, err;
function init_result() {
	return (init_result = __esmMin((() => {
		ok = (value) => ({
			ok: true,
			value
		});
		err = (error) => ({
			ok: false,
			error
		});
	})))();
}

//#endregion
//#region dist/domain/artifactOperationError.js
var ArtifactOperationError, artifactDetailsMessage;
function init_artifactOperationError() {
	return (init_artifactOperationError = __esmMin((() => {
		init_artifactIntegrity();
		init_analysisErrorBase();
		ArtifactOperationError = class extends AnalysisError {
			operation;
			reason;
			artifactDetails;
			detail;
			_tag = "ArtifactOperationError";
			userMessage;
			admission;
			boundary;
			constructor(operation, reason, artifactDetails, detail, options) {
				super(artifactDetails === undefined ? `Artifact ${operation} failed: ${reason}` : artifactDetailsMessage(operation, reason, artifactDetails), options);
				this.operation = operation;
				this.reason = reason;
				this.artifactDetails = artifactDetails;
				this.detail = detail;
				this.admission = options?.admission;
				this.boundary = options?.boundary;
				this.userMessage = options?.userMessage ?? (options?.admission === undefined ? undefined : detail);
			}
		};
		artifactDetailsMessage = (operation, reason, details) => {
			const { logical_path, ...facts } = projectArtifactIntegrityDetails(details);
			const description = Object.entries(facts).map(([key, value]) => `${key}=${String(value ?? "unavailable")}`).join(", ");
			return `Artifact ${operation} failed: ${reason} at ${logical_path} (${description})`;
		};
	})))();
}

//#endregion
//#region dist/domain/apple/appleBundleTypes.js
var APPLE_BUNDLE_EXTENSION, OPENABLE_APPLE_BUNDLE_EXTENSIONS, openableAppleBundleExtension, UNOPENED_APPLE_BUNDLE_EXTENSIONS, isUnopenedAppleBundleExtension, OPENABLE_APPLE_BUNDLE_TYPES_TEXT;
function init_appleBundleTypes() {
	return (init_appleBundleTypes = __esmMin((() => {
		APPLE_BUNDLE_EXTENSION = /\.(?:app|appex|xpc|framework|systemextension|dext|bundle|plugin|qlgenerator|mdimporter)$/iu;
		OPENABLE_APPLE_BUNDLE_EXTENSIONS = [
			".app",
			".appex",
			".framework",
			".xpc",
			".systemextension",
			".bundle",
			".plugin"
		];
		openableAppleBundleExtension = (extension) => {
			const lower = extension.toLowerCase();
			return OPENABLE_APPLE_BUNDLE_EXTENSIONS.find((candidate) => candidate === lower);
		};
		UNOPENED_APPLE_BUNDLE_EXTENSIONS = [
			".dext",
			".kext",
			".qlgenerator",
			".mdimporter"
		];
		isUnopenedAppleBundleExtension = (extension) => UNOPENED_APPLE_BUNDLE_EXTENSIONS.includes(extension.toLowerCase());
		OPENABLE_APPLE_BUNDLE_TYPES_TEXT = OPENABLE_APPLE_BUNDLE_EXTENSIONS.join(", ");
	})))();
}

//#endregion
//#region dist/domain/configurationErrors.js
var ConfigurationError, NoBinaryOpenError, BinaryTargetError, readPermissionCode;
function init_configurationErrors() {
	return (init_configurationErrors = __esmMin((() => {
		init_analysisErrorBase();
		ConfigurationError = class extends AnalysisError {
			_tag = "ConfigurationError";
			settings;
			remediationAction;
			constructor(message, options) {
				super(message, options);
				this.remediationAction = options?.remediationAction;
				this.settings = (options?.settings ?? []).map(({ setting, constraint }) => ({
					setting,
					constraint
				}));
			}
		};
		NoBinaryOpenError = class extends AnalysisError {
			_tag = "NoBinaryOpenError";
			constructor() {
				super("No app is open. Ask the user which app to investigate, then call open_binary with its local path.");
			}
		};
		BinaryTargetError = class extends AnalysisError {
			path;
			reason;
			_tag = "BinaryTargetError";
			constraint;
			infoPlist;
			probedPaths;
			/** The OS read-permission code of the cause, when the host denied access. */
			systemCode;
			constructor(path, reason, options) {
				super(`Cannot open artifact: ${reason}`, options);
				this.path = path;
				this.reason = reason;
				this.constraint = options?.constraint;
				this.infoPlist = options?.infoPlist;
				this.probedPaths = options?.probedPaths;
				this.systemCode = readPermissionCode(options?.cause);
			}
		};
		readPermissionCode = (cause) => {
			const code = cause instanceof Error ? Reflect.get(cause, "code") : undefined;
			return code === "EACCES" || code === "EPERM" ? code : undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/browserObservationError.js
var browserCleanupObservation, BrowserObservationError, observationFailureMessage;
function init_browserObservationError() {
	return (init_browserObservationError = __esmMin((() => {
		init_analysisErrorBase();
		init_analysisErrorCore();
		browserCleanupObservation = (cause) => cause instanceof AnalysisError && cause.cleanup !== undefined ? cause.cleanup : {
			reason: cause instanceof Error ? cause.message : String(cause),
			resources: cause instanceof AnalysisError && cause.cleanupResources.length > 0 ? cause.cleanupResources : ["browser_transport"]
		};
		BrowserObservationError = class BrowserObservationError extends AnalysisError {
			operation;
			reason;
			_tag = "BrowserObservationError";
			cleanupIncomplete;
			userCategory;
			userMessage;
			/** Producer-supplied explanation; undefined selects the operation default. */
			detail;
			remediationAction;
			constructor(operation, reason, options) {
				super(`Browser observation ${operation} failed: ${reason}`, options);
				this.operation = operation;
				this.reason = reason;
				this.detail = options?.detail;
				this.userMessage = options?.detail ?? observationFailureMessage(operation, reason);
				this.remediationAction = options?.remediationAction;
				this.cleanupIncomplete = this.cleanup !== undefined || reason === "cleanup_failed";
				this.setCleanupResources(this.cleanup?.resources ?? (reason === "cleanup_failed" ? ["browser_transport"] : []));
				this.userCategory = reason === "cancelled" || options?.cause instanceof AnalysisCancelledError || options?.cause instanceof AnalysisError && options.cause.userCategory === "cancelled" ? "cancelled" : undefined;
			}
			/**
			* Attribute this failure to the caller's operation without discarding
			* producer facts; the original cause keeps the primary failure chain intact.
			*/
			forOperation(operation) {
				if (operation === this.operation) return this;
				return new BrowserObservationError(operation, this.reason, {
					cause: this.cause,
					...this.detail === undefined ? {} : { detail: this.detail },
					...this.remediationAction === undefined ? {} : { remediationAction: this.remediationAction },
					cleanupPrimary: this.cleanupPrimary,
					diagnostics: this.diagnostics,
					capturedOutput: this.capturedOutput,
					cleanup: this.cleanup,
					partialObservation: this.partialObservation
				});
			}
		};
		observationFailureMessage = (operation, reason) => {
			if (reason === "cancelled") return `${operation} was cancelled. Collected observations and cleanup status are reported when available.`;
			if (reason === "timeout") return `${operation} exceeded its execution deadline. Review the target's responsiveness and retained observations before retrying.`;
			if (reason === "endpoint_unreachable") return `${operation} could not reach the selected loopback debugging endpoint. Verify that the target process is running with debugging enabled and that the endpoint's port matches it, then retry.`;
			if (reason === "target_not_found") return `${operation} could not find the selected target at the debugging endpoint. Refresh target discovery for that endpoint and retry with a returned target ID.`;
			if (reason === "target_session_detached") return `${operation} lost its debugging session while the target may still exist. Refresh target discovery and attach to the selected target again.`;
			if (reason === "target_changed") return `${operation} could not retain a stable document because the target changed during observation. Retry after navigation settles; refresh target discovery if the selected page was replaced.`;
			if (reason === "service_worker_blocked") return `${operation} refused the selected page because it is controlled by or has a registered service worker while the service-worker policy is block. Set environment.service_workers to allow to permit observation, or remove the service worker registration through the browser.`;
			if (reason === "disconnected") return `${operation} lost its debugging connection. Verify that the target process is still running, refresh target discovery, and retry the observation.`;
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/evidenceErrors.js
var EvidenceIntegrityError, AnalysisSnapshotMismatchError, ResourceSnapshotMismatchError, EvidenceReferenceError, EvidenceFileError;
function init_evidenceErrors() {
	return (init_evidenceErrors = __esmMin((() => {
		init_analysisErrorBase();
		EvidenceIntegrityError = class extends AnalysisError {
			_tag = "EvidenceIntegrityError";
			userMessage;
			constructor(message, options) {
				super(message, options);
				this.userMessage = options?.userMessage;
			}
		};
		AnalysisSnapshotMismatchError = class extends EvidenceIntegrityError {
			bindingMismatch;
			constructor(message, bindingMismatch) {
				super(message);
				this.bindingMismatch = bindingMismatch;
			}
		};
		ResourceSnapshotMismatchError = class extends AnalysisSnapshotMismatchError {
			operation;
			constructor(operation) {
				super("Analysis snapshots do not apply to a resource-only app session because it has no executable identity or replay binding.");
				this.operation = operation;
			}
		};
		EvidenceReferenceError = class extends EvidenceIntegrityError {
			evidenceId;
			reason;
			expected;
			actual;
			/** Set when the consuming workflow requires retained closure. */
			referenceScope;
			constructor(evidenceId, reason, options) {
				super(`Evidence reference ${reason}: ${evidenceId}`, options);
				this.evidenceId = evidenceId;
				this.reason = reason;
				this.expected = options.expected;
				this.actual = options.actual;
				this.referenceScope = options.referenceScope;
			}
		};
		EvidenceFileError = class extends AnalysisError {
			operation;
			reason;
			_tag = "EvidenceFileError";
			userMessage;
			/** Caller-selected path that failed, resolved against the working directory. */
			path;
			/** Present only when a write committed before cleanup failed. */
			published;
			/** Schema issues relative to the selected file's JSON root, never the request envelope. */
			contentIssues;
			systemCode;
			constructor(operation, reason, options) {
				super(`Evidence bundle ${operation} failed: ${reason}`, options);
				this.operation = operation;
				this.reason = reason;
				this.path = options?.path;
				this.published = options?.published;
				this.userMessage = options?.userMessage;
				this.contentIssues = options?.contentIssues;
				this.systemCode = options?.systemCode;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/analysisResourceLimits.js
var DEFAULT_ASAR_MAX_HEADER_BYTES, MAXIMUM_ASAR_MAX_HEADER_BYTES, DEFAULT_NATIVE_MATCHING_REPRESENTATION_BYTES, MAXIMUM_NATIVE_MATCHING_REPRESENTATION_BYTES, DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS, DEFAULT_HOPPER_STARTUP_TIMEOUT_MS, DEFAULT_HOPPER_CALLER_SCAN_BUDGET_MS, MINIMUM_HOPPER_CALLER_SCAN_BUDGET_MS, MAX_NODE_TIMER_DELAY_MS, MAX_GHIDRA_DECOMPILE_TIMEOUT_SECONDS, DEFAULT_REGEX_MATCHING_DEADLINE_MS, MAXIMUM_REGEX_MATCHING_DEADLINE_MS, DEFAULT_REGEX_WORKER_HEAP_REQUEST_MIB, MINIMUM_REGEX_WORKER_HEAP_REQUEST_MIB, MAXIMUM_REGEX_WORKER_HEAP_REQUEST_MIB, DEFAULT_CAPTURE_DECODER_OLD_GENERATION_MIB, CAPTURE_DECODER_SEMI_SPACE_MIB, MAXIMUM_CAPTURE_DECODER_OLD_GENERATION_MIB, DEFAULT_JADX_OPERATION_TIMEOUT_MS, DEFAULT_DEBUGGER_COMMAND_DEADLINE_MS, MINIMUM_DEBUGGER_COMMAND_DEADLINE_MS, MAXIMUM_DEBUGGER_COMMAND_DEADLINE_MS, DEFAULT_DEBUGGER_MAX_SESSIONS, MINIMUM_DEBUGGER_MAX_SESSIONS, MAXIMUM_DEBUGGER_MAX_SESSIONS, DEFAULT_DEBUGGER_MAX_PENDING_COMMANDS, MINIMUM_DEBUGGER_MAX_PENDING_COMMANDS, MAXIMUM_DEBUGGER_MAX_PENDING_COMMANDS, DEFAULT_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES, NODE_MAX_STRING_LENGTH, DEBUGGER_OUTPUT_JSON_ESCAPE_CODE_UNITS, DEBUGGER_OUTPUT_EVIDENCE_ENVELOPE_CODE_UNITS, MINIMUM_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES, MAXIMUM_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES, DEBUGGER_CONTROL_REPLY_BYTES;
function init_analysisResourceLimits() {
	return (init_analysisResourceLimits = __esmMin((() => {
		DEFAULT_ASAR_MAX_HEADER_BYTES = 16 * 1024 * 1024;
		MAXIMUM_ASAR_MAX_HEADER_BYTES = 256 * 1024 * 1024;
		DEFAULT_NATIVE_MATCHING_REPRESENTATION_BYTES = 96 * 1024 * 1024;
		MAXIMUM_NATIVE_MATCHING_REPRESENTATION_BYTES = 1024 * 1024 * 1024;
		DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS = 33e4;
		DEFAULT_HOPPER_STARTUP_TIMEOUT_MS = 12e4;
		DEFAULT_HOPPER_CALLER_SCAN_BUDGET_MS = 2e3;
		MINIMUM_HOPPER_CALLER_SCAN_BUDGET_MS = 1;
		MAX_NODE_TIMER_DELAY_MS = 2147483647;
		MAX_GHIDRA_DECOMPILE_TIMEOUT_SECONDS = Math.floor(MAX_NODE_TIMER_DELAY_MS / 1e3);
		DEFAULT_REGEX_MATCHING_DEADLINE_MS = 5e3;
		MAXIMUM_REGEX_MATCHING_DEADLINE_MS = 2147483647;
		DEFAULT_REGEX_WORKER_HEAP_REQUEST_MIB = 128;
		MINIMUM_REGEX_WORKER_HEAP_REQUEST_MIB = 7;
		MAXIMUM_REGEX_WORKER_HEAP_REQUEST_MIB = 16384;
		DEFAULT_CAPTURE_DECODER_OLD_GENERATION_MIB = 192;
		CAPTURE_DECODER_SEMI_SPACE_MIB = 8;
		MAXIMUM_CAPTURE_DECODER_OLD_GENERATION_MIB = 16384;
		DEFAULT_JADX_OPERATION_TIMEOUT_MS = 12e4;
		DEFAULT_DEBUGGER_COMMAND_DEADLINE_MS = 12e4;
		MINIMUM_DEBUGGER_COMMAND_DEADLINE_MS = 1;
		MAXIMUM_DEBUGGER_COMMAND_DEADLINE_MS = 2147483647;
		DEFAULT_DEBUGGER_MAX_SESSIONS = 8;
		MINIMUM_DEBUGGER_MAX_SESSIONS = 1;
		MAXIMUM_DEBUGGER_MAX_SESSIONS = 64;
		DEFAULT_DEBUGGER_MAX_PENDING_COMMANDS = 16;
		MINIMUM_DEBUGGER_MAX_PENDING_COMMANDS = 1;
		MAXIMUM_DEBUGGER_MAX_PENDING_COMMANDS = 256;
		DEFAULT_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES = 16 * 1024 * 1024;
		NODE_MAX_STRING_LENGTH = 536870888;
		DEBUGGER_OUTPUT_JSON_ESCAPE_CODE_UNITS = 6;
		DEBUGGER_OUTPUT_EVIDENCE_ENVELOPE_CODE_UNITS = 1024 * 1024;
		MINIMUM_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES = 1;
		MAXIMUM_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES = Math.floor((NODE_MAX_STRING_LENGTH - DEBUGGER_OUTPUT_EVIDENCE_ENVELOPE_CODE_UNITS) / DEBUGGER_OUTPUT_JSON_ESCAPE_CODE_UNITS);
		DEBUGGER_CONTROL_REPLY_BYTES = 16 * 1024 * 1024;
	})))();
}

//#endregion
//#region dist/domain/hopperStartupFailure.js
var HOPPER_DEMO_DIALOG_TIMEOUT_SETTING, DEFAULT_HOPPER_DEMO_DIALOG_TIMEOUT_MS, MINIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS, MAXIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS, invalidDialogTimeoutMessage, failures, HOPPER_STARTUP_FAILURES, hopperStartupFailure, hopperStartupExitCode, isDialogTimeoutRejection, dialogTimeoutFromDiagnostic, isHopperStartupFailureCode;
function init_hopperStartupFailure() {
	return (init_hopperStartupFailure = __esmMin((() => {
		init_analysisResourceLimits();
		HOPPER_DEMO_DIALOG_TIMEOUT_SETTING = "REA_HOPPER_DEMO_DIALOG_TIMEOUT_MS";
		DEFAULT_HOPPER_DEMO_DIALOG_TIMEOUT_MS = 1e4;
		MINIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS = 1;
		MAXIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS = MAX_NODE_TIMER_DELAY_MS;
		invalidDialogTimeoutMessage = (setting) => {
			const current = setting === undefined ? "was rejected" : `is ${JSON.stringify(setting.value)} ms`;
			const floor = String(1);
			const maximum = String(MAXIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS);
			const source = setting?.source ?? "setting";
			return [`The effective ${HOPPER_DEMO_DIALOG_TIMEOUT_SETTING} value ${current} (source ${source}; default ${String(DEFAULT_HOPPER_DEMO_DIALOG_TIMEOUT_MS)} ms, floor ${floor} ms, maximum ${maximum} ms).`, `Set ${HOPPER_DEMO_DIALOG_TIMEOUT_SETTING} in the environment that starts REA to a positive decimal integer from ${floor} to ${maximum}, then restart REA.`].join(" ");
		};
		failures = [
			[
				70,
				"private_display_unavailable",
				"REA could not start its private Linux display. Install Xvfb, then rerun rea doctor."
			],
			[
				71,
				"x11_authorization_failed",
				"REA could not authorize its private Linux display. Install xauth, then rerun rea doctor."
			],
			[
				72,
				"unsupported_hopper_build",
				"This Hopper build is not supported for unattended Linux analysis. Unset HOPPER_LAUNCHER_PATH and rerun rea setup --yes --install-hopper, or update REA."
			],
			[
				73,
				"invalid_launch_command",
				"REA refused an unexpected Hopper launch command. Check HOPPER_LAUNCHER_PATH and rerun rea doctor."
			],
			[
				74,
				"process_ownership_mismatch",
				"REA could not verify ownership of the launched Hopper process and stopped safely. Close other Hopper sessions and retry."
			],
			[
				75,
				"hopper_exited_during_startup",
				"Hopper exited before the REA bridge was ready. In CI, run rea doctor --provider hopper --json; if Hopper showed a UI or license prompt, complete it in the runner user session, otherwise close stale Hopper sessions and retry."
			],
			[
				76,
				"unsupported_demo_dialog",
				"This Hopper demo dialog is not supported for unattended Linux analysis. Update REA or use a supported Hopper build."
			],
			[
				77,
				"unexpected_display_geometry",
				"REA's private Linux display did not match the validated layout. Close custom display overrides and retry."
			],
			[
				78,
				"x11_input_failed",
				"REA could not activate Hopper's validated demo control. Install the XTEST runtime, then rerun rea doctor."
			],
			[
				79,
				"runtime_dependency_unavailable",
				"A Linux demo-session dependency is unavailable. Rerun rea setup --yes --install-hopper, then rea doctor."
			],
			[
				80,
				"x11_socket_directory_unusable",
				"REA cannot use the host X11 socket directory for a private display. Run rea doctor --provider hopper for exact mount and namespace diagnostics."
			],
			[
				81,
				"demo_dialog_absent",
				"Hopper passed launcher authentication but did not present a registration dialog within the wait window. If this host is slow, raise REA_HOPPER_DEMO_DIALOG_TIMEOUT_MS and retry; otherwise complete Hopper setup or close stale sessions and retry."
			],
			[
				82,
				"invalid_dialog_timeout",
				invalidDialogTimeoutMessage()
			]
		];
		HOPPER_STARTUP_FAILURES = new Map(failures.map(([exitCode, code, message]) => [exitCode, {
			code,
			message
		}]));
		hopperStartupFailure = (exitCode) => exitCode === null ? undefined : HOPPER_STARTUP_FAILURES.get(exitCode);
		hopperStartupExitCode = (code) => failures.find(([, candidate]) => candidate === code)?.[0];
		isDialogTimeoutRejection = (value) => {
			if (typeof value !== "object" || value === null) return false;
			const setting = Reflect.get(value, "setting");
			const shown = Reflect.get(value, "value");
			const source = Reflect.get(value, "source");
			return setting === "REA_HOPPER_DEMO_DIALOG_TIMEOUT_MS" && typeof shown === "string" && shown.length <= 128 && source === "setting" && Reflect.get(value, "minimum_ms") === 1 && Reflect.get(value, "maximum_ms") === MAXIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS && Reflect.get(value, "default_ms") === 1e4;
		};
		dialogTimeoutFromDiagnostic = (diagnostic) => {
			if (diagnostic?.status !== "error") return undefined;
			const value = Reflect.get(diagnostic, "dialog_timeout");
			return isDialogTimeoutRejection(value) ? value : undefined;
		};
		isHopperStartupFailureCode = (value) => failures.some(([, candidate]) => candidate === value);
	})))();
}

//#endregion
//#region dist/domain/hopperErrors.js
var HopperError, HOPPER_STARTUP_TIMEOUT_REMEDIATION, HOPPER_STARTUP_TIMEOUT_CONTINUING_REMEDIATION, HopperTimeoutError, HopperCancelledError, hopperCancelledBySignal, HopperProtocolError, HopperRemoteError, HopperProcessError, HopperStartError;
function init_hopperErrors() {
	return (init_hopperErrors = __esmMin((() => {
		init_analysisErrorBase();
		init_hopperStartupFailure();
		HopperError = class extends AnalysisError {};
		HOPPER_STARTUP_TIMEOUT_REMEDIATION = "Review details.launcher and inspect Hopper for ongoing initial analysis or a pending loader, demo, or license dialog. For a large target, set REA_HOPPER_STARTUP_TIMEOUT_MS higher in the environment of a new REA invocation, then rerun the command; that invocation starts Hopper again. Resolve retained cleanup before rerunning.";
		HOPPER_STARTUP_TIMEOUT_CONTINUING_REMEDIATION = "Review details.launcher and inspect Hopper for ongoing initial analysis or a pending loader, demo, or license dialog. For a large target, use update_analysis_settings with setting hopper.startup_timeout_ms and action set for the next startup attempt without restarting REA, or increase REA_HOPPER_STARTUP_TIMEOUT_MS for future REA processes. Allow at least that long in the MCP client. Resolve retained cleanup before reopening.";
		HopperTimeoutError = class extends HopperError {
			timeoutMs;
			operation;
			requestId;
			providerState;
			stage;
			launcherOutcome;
			_tag = "HopperTimeoutError";
			constructor(timeoutMs, operation, requestId, providerState = "not_started", stage = operation === undefined ? "launch" : "analysis", launcherOutcome, options = {}) {
				super(`Hopper ${operation === undefined ? "startup" : operation} timed out after ${String(timeoutMs)}ms`, operation === undefined ? {
					...options,
					continuingCallerGuidance: { remediationAction: HOPPER_STARTUP_TIMEOUT_CONTINUING_REMEDIATION }
				} : options);
				this.timeoutMs = timeoutMs;
				this.operation = operation;
				this.requestId = requestId;
				this.providerState = providerState;
				this.stage = stage;
				this.launcherOutcome = launcherOutcome;
			}
		};
		HopperCancelledError = class extends HopperError {
			_tag = "HopperCancelledError";
			constructor(...parameters) {
				const errorOptions = { ...parameters[1] };
				if (parameters.length > 0) Object.defineProperty(errorOptions, "cause", {
					configurable: true,
					enumerable: true,
					value: parameters[0],
					writable: true
				});
				super("Hopper operation was cancelled", errorOptions);
			}
		};
		hopperCancelledBySignal = (signal) => signal?.aborted === true ? new HopperCancelledError(signal.reason) : new HopperCancelledError();
		HopperProtocolError = class extends HopperError {
			_tag = "HopperProtocolError";
		};
		HopperRemoteError = class extends HopperError {
			code;
			safeMessage;
			_tag = "HopperRemoteError";
			diagnosticType;
			operation;
			requestId;
			constructor(code, safeMessage, context = {}) {
				super(`Hopper request failed (${String(code)}): ${safeMessage}`, context);
				this.code = code;
				this.safeMessage = safeMessage;
				this.diagnosticType = context.diagnosticType ?? "remote";
				this.operation = context.operation;
				this.requestId = context.requestId;
			}
		};
		HopperProcessError = class extends HopperError {
			exitCode;
			_tag = "HopperProcessError";
			failureCode;
			userMessage;
			providerState;
			stage;
			diagnostic;
			operation;
			requestId;
			launcherFailure;
			constructor(exitCode, context = {}) {
				super(`Hopper bridge stopped unexpectedly with code ${String(exitCode)}`, context);
				this.exitCode = exitCode;
				this.diagnostic = context.diagnostic;
				this.operation = context.operation;
				this.requestId = context.requestId;
				this.launcherFailure = context.launcherFailure;
				const failure = hopperStartupFailure(exitCode);
				this.userMessage = failure?.code === "invalid_dialog_timeout" ? invalidDialogTimeoutMessage(dialogTimeoutFromDiagnostic(context.diagnostic)) : failure?.message;
				this.stage = context.stage ?? (failure === undefined ? context.operation === undefined ? "connection" : "analysis" : "launch");
				this.failureCode = failure?.code;
				this.providerState = context.providerState ?? (exitCode === null ? "unknown" : "exited");
			}
		};
		HopperStartError = class extends HopperError {
			_tag = "HopperStartError";
			userMessage;
			ownerRunId;
			launcherFailure;
			launchRejection;
			constructor(options) {
				super("Hopper application bridge could not be started", options);
				this.userMessage = options?.userMessage;
				this.ownerRunId = options?.ownerRunId;
				this.launcherFailure = options?.launcherFailure;
				this.launchRejection = options?.launchRejection;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/providerSelectionError.js
var ProviderSelectionError, providerSelectionDiagnostic, requestedProviderRepair, providerAvailabilityOnly, providerSelectionUserMessage;
function init_providerSelectionError() {
	return (init_providerSelectionError = __esmMin((() => {
		init_analysisErrorBase();
		ProviderSelectionError = class extends AnalysisError {
			_tag = "ProviderSelectionError";
			operation;
			reason;
			requestedProviderId;
			candidateIds;
			rejections;
			remediationAction;
			userMessage;
			constructor(options) {
				const operation = options.operation ?? "open_binary";
				super(providerSelectionDiagnostic(options), {
					capturedOutput: options.capturedOutput,
					diagnostics: options.diagnostics,
					partialObservation: options.partialObservation,
					...options.cause === undefined ? {} : { cause: options.cause }
				});
				this.operation = operation;
				this.reason = options.reason;
				this.requestedProviderId = options.requestedProviderId;
				this.candidateIds = [...options.candidateIds];
				this.rejections = [...options.rejections ?? []].map((rejection) => ({
					...rejection,
					diagnostics: structuredClone(rejection.diagnostics)
				}));
				this.remediationAction = options.remediationAction ?? requestedProviderRepair(options);
				this.userMessage = options.userMessage ?? providerSelectionUserMessage(options);
			}
		};
		providerSelectionDiagnostic = (options) => {
			const candidates = options.candidateIds.length === 0 ? "none" : options.candidateIds.join(", ");
			return `Analysis provider selection failed (${options.reason}) for ${options.requestedProviderId}; candidates: ${candidates}`;
		};
		requestedProviderRepair = (options) => options.reason === "provider_unavailable" ? options.rejections?.find(({ providerId, origin }) => providerId === options.requestedProviderId && origin === "availability")?.remediation : undefined;
		providerAvailabilityOnly = (rejections) => rejections !== undefined && rejections.length > 0 && rejections.every(({ origin }) => origin === "availability");
		providerSelectionUserMessage = (options) => {
			switch (options.reason) {
				case "ambiguous": return "Multiple analysis providers support this target. Choose one with provider_id, --provider, or REA_ANALYSIS_PROVIDER.";
				case "unknown_provider": return `The requested analysis provider is unknown. Choose one of: ${options.candidateIds.join(", ") || "no configured providers"}.`;
				case "provider_unavailable": return providerAvailabilityOnly(options.rejections) ? "Provider selection failed local readiness checks. No target-support refusal was reported. Review the local provider diagnostics or run `rea doctor`, then retry." : "The selected analysis provider is unavailable. Review the reported local diagnostics or run `rea doctor`, then retry.";
				case "target_unsupported": return "The selected analysis provider does not support this target. Choose another provider or open a supported extracted binary.";
				case "invalid_options": return "The analysis provider selection or open options are invalid. Correct them and try again.";
			}
		};
	})))();
}

//#endregion
//#region dist/domain/providerAdapterError.js
var ProviderAdapterError;
function init_providerAdapterError() {
	return (init_providerAdapterError = __esmMin((() => {
		init_analysisErrorBase();
		ProviderAdapterError = class extends AnalysisError {
			providerId;
			operation;
			_tag = "ProviderAdapterError";
			userMessage;
			remediationAction;
			constructor(providerId, operation, options = {}) {
				super(`Provider ${providerId} adapter failed during ${operation}`, options);
				this.providerId = providerId;
				this.operation = operation;
				this.userMessage = options.userMessage;
				this.remediationAction = options.remediationAction;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/unknownRegistryError.js
var UnknownRegistryError;
function init_unknownRegistryError() {
	return (init_unknownRegistryError = __esmMin((() => {
		init_analysisErrorBase();
		UnknownRegistryError = class extends AnalysisError {
			_tag = "UnknownRegistryError";
			constraint;
			reason;
			constructor(failure, options) {
				const reason = typeof failure === "string" ? failure : failure.kind === "history_gap" || failure.kind === "revision_chain" ? "integrity" : "constraint";
				super(`Residual unknown registry mutation failed: ${reason}`, options);
				this.reason = reason;
				this.constraint = typeof failure === "string" ? undefined : failure;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/providerOperationHealth.js
var PROVIDER_OPERATION_STATES, PROVIDER_RETRY_ACTIONS, PROVIDER_FAILURE_STAGES, providerRetryAction, sharedProviderFailureStage;
function init_providerOperationHealth() {
	return (init_providerOperationHealth = __esmMin((() => {
		PROVIDER_OPERATION_STATES = [
			"idle",
			"busy",
			"exited",
			"unreachable",
			"not_started",
			"unknown"
		];
		PROVIDER_RETRY_ACTIONS = [
			"retry",
			"wait",
			"restart_provider",
			"unknown"
		];
		PROVIDER_FAILURE_STAGES = [
			"launch",
			"connection",
			"analysis",
			"decompilation",
			"unknown"
		];
		providerRetryAction = (state, startupFailure = false) => {
			if (state === "idle") return null;
			if (startupFailure && state === "exited") return "retry";
			switch (state) {
				case "busy": return "wait";
				case "exited":
				case "unreachable": return "restart_provider";
				case "not_started": return "retry";
				case "unknown": return "unknown";
			}
		};
		sharedProviderFailureStage = (requests) => {
			const first = requests[0]?.stage;
			if (first === undefined) return null;
			return requests.every((request) => request.stage === first) ? first : "unknown";
		};
	})))();
}

//#endregion
//#region dist/domain/analysisErrorPresentation.js
var MCP_TRANSPORT_EVIDENCE_EXPORT, MCP_TRANSPORT_EVIDENCE_DISCOVERY, MCP_TRANSPORT_EVIDENCE_RECORDS, MCP_TRANSPORT_EVIDENCE_LINKS, analysisErrorRemediationAction, analysisErrorCategory, browserErrorCategory, artifactErrorCategory, STATIC_ERROR_CATEGORIES, analysisErrorUserMessage, analysisErrorUserMessageParts, composedCallerGuidance, outcomeUserMessage, hopperErrorUserMessage, RESTART_OWNED_PROVIDER, RESTART_UNREACHABLE_HOPPER, hopperProcessRemediation, hopperProcessMessage, standardErrorMessage, timeoutUserMessage, timeoutRemediation, UNREADABLE_OUTPUT_TAGS, UNSUPPORTED_PROVIDER_TAGS, CANCELLED_TAGS, TIMEOUT_TAGS, ADAPTER_FAILURE_TAGS, START_FAILURE_TAGS, INTEGRITY_POLICY_OPERATIONS, artifactMessage, evidenceFileMessage, KNOWN_ERROR_TAGS, assertKnownAnalysisErrorTag;
function init_analysisErrorPresentation() {
	return (init_analysisErrorPresentation = __esmMin((() => {
		init_residualUnknownGraphError();
		init_analysisErrorCore();
		init_artifactOperationError();
		init_appleBundleTypes();
		init_configurationErrors();
		init_browserObservationError();
		init_evidenceErrors();
		init_hopperErrors();
		init_providerSelectionError();
		init_providerAdapterError();
		init_unknownRegistryError();
		init_providerOperationHealth();
		init_fixedAllowanceRemediation();
		init_analysisErrorBase();
		MCP_TRANSPORT_EVIDENCE_EXPORT = "Export complete retained session evidence through export_evidence_bundle to a caller-selected path, or use complete CLI JSON output. The connection remains usable.";
		MCP_TRANSPORT_EVIDENCE_DISCOVERY = `Discover retained records with get_evidence_bundle and detail: summary, then read selected complete records with detail: records and an exact evidence_id, or inspect compatible records through inspect_analysis_view using an exact Evidence reference. ${MCP_TRANSPORT_EVIDENCE_EXPORT}`;
		MCP_TRANSPORT_EVIDENCE_RECORDS = `Request fewer records with get_evidence_bundle detail: records, a smaller limit or an exact evidence_id filter; inspect compatible records in pages through inspect_analysis_view. A single record larger than one response needs export. ${MCP_TRANSPORT_EVIDENCE_EXPORT}`;
		MCP_TRANSPORT_EVIDENCE_LINKS = "Request fewer rows with get_evidence_bundle detail: links, a smaller limit or an exact evidence_id filter, then follow next_offset.";
		analysisErrorRemediationAction = (error, callerLifetime = "continuing") => {
			error = resolvedAnalysisError(error);
			const continuing = callerLifetime === "continuing" ? error.continuingCallerGuidance?.remediationAction : undefined;
			if (continuing !== undefined) return continuing;
			if ((error instanceof ProviderAdapterError || error instanceof AnalysisCapabilityUnavailableError) && error.remediationAction !== undefined) return error.remediationAction;
			if (error instanceof BrowserObservationError && error.remediationAction !== undefined) return error.remediationAction;
			if (error instanceof BrowserObservationError && error.reason === "service_worker_blocked") return "Set environment.service_workers to allow to permit this capture, or remove the service worker registration through the browser. REA never removes existing registrations.";
			if (error instanceof AnalysisCapabilityUnavailableError && error.retryable) return "Review details.reason, then retry the same analysis after the condition clears.";
			if (error instanceof EvidenceFileError && error.published !== undefined) return error.published.path === undefined ? "Resolve the reported staging cleanup failure. Publication completed; its path identity is excluded." : "Use the published file at details.published_path and resolve the reported staging cleanup failure.";
			if (error instanceof ProviderSelectionError && error.remediationAction !== undefined) return error.remediationAction;
			if (error instanceof ResourceSnapshotMismatchError) return error.operation === "export" ? "Call close_binary without snapshot_path to close this resource-only session." : "Open an executable analysis target before importing a binary analysis snapshot.";
			if (error instanceof AnalysisSnapshotMismatchError) return "Select an artifact, provider, and analysis profile matching the snapshot, or run analysis without it and save a fresh snapshot for the intended binding.";
			if (error instanceof AnalysisUnsupportedTargetError) return error.remediationAction ?? "Select a target supported by this operation or choose an operation supporting the reported target format.";
			if (error instanceof AnalysisResourceConstraintError) return error.remediationAction ?? (error.fixedAllowance !== undefined ? fixedAllowanceRemediation(error.fixedAllowance.name, error.fixedAllowance.kind) : error.resource === "capacity" ? "Wait for an active analysis to complete, then retry within the reported admission limits." : error.resource === "transport" ? MCP_TRANSPORT_EVIDENCE_DISCOVERY : error.resource === "cpu" ? "Review the reported worker CPU limits and observed signal. Retry with sufficient CPU time or a smaller artifact; REA retains tighter inherited limits." : error.resource === "file-size" ? "Review the reported worker file-size limits and write failure. Retry with a sufficient file-size allowance for the evidence reply; REA retains tighter inherited limits." : "Review the reported worker memory limits and available host memory. Retry with sufficient memory or a smaller artifact; REA retains tighter inherited limits.");
			if (error instanceof AnalysisTimeoutError && error.remediationAction !== undefined) return error.remediationAction;
			if (error instanceof AnalysisTimeoutError) return timeoutRemediation(error);
			if (error instanceof ArtifactOperationError && error.reason === "limit" && error.boundary === "capacity") return "Use an artifact within the capacity reported in details.detail. Changing output detail or retrying the unchanged input does not remove this boundary.";
			if (error instanceof HopperTimeoutError) return error.operation === undefined ? HOPPER_STARTUP_TIMEOUT_REMEDIATION : error.providerState === "busy" ? "Check binary_session.analysis_activity, wait for the active Hopper request to finish, then retry." : "Check binary_session for Hopper health, then retry the operation.";
			if (error instanceof HopperProcessError) return hopperProcessRemediation(error);
			if (error instanceof HopperStartError) return error.ownerRunId === undefined ? "Check the Hopper launcher and target details, then retry opening the target." : `Use the active REA session ${error.ownerRunId} or close it before opening this target again.`;
			if (error instanceof HopperRemoteError) return error.diagnosticType === "invalid_request" ? "Correct the reported address, document, or arguments and retry." : "Review the Hopper diagnostic details and correct the request or target; run `rea doctor` if the provider itself is failing. Repeating the unchanged request is not expected to succeed.";
			if (error instanceof EvidenceReferenceError) return error.reason === "missing" && error.referenceScope === "retained-closure" ? "Import the originating Evidence bundle with the selected records and their complete linked sources into the current investigation, or re-run their producers there. Retry after the required records are retained. reset_investigation clears retained records; close_binary preserves them." : "Use an exact Evidence reference available from the selected source, supply the complete inline Evidence, re-run its producer, or select/import its Evidence bundle. reset_investigation clears retained records; close_binary preserves them.";
			if (error instanceof BinaryTargetError && error.constraint === "directory_requires_file") return `For a JavaScript/Electron application directory, call analyze_javascript_application with input_path or run \`rea analyze <directory>\`. For binary analysis, select its executable file or an Apple bundle directory (${OPENABLE_APPLE_BUNDLE_TYPES_TEXT}).`;
			if (error instanceof BinaryTargetError && error.constraint === "bundle_type_unsupported") return `Select the bundle's program file directly, or open a bundle directory of a supported type (${OPENABLE_APPLE_BUNDLE_TYPES_TEXT}).`;
			if (error instanceof BinaryTargetError && (error.constraint === "bundle_executable_undeclared" || error.constraint === "bundle_program_missing") && error.infoPlist !== undefined) return `Read ${error.infoPlist} with inspect_plist (\`rea inspect-plist <path>\`) to review its CFBundleExecutable, then select an existing program file directly.`;
			if (error instanceof BinaryTargetError && (error.constraint === "bundle_info_plist_missing" || error.constraint === "bundle_layout_ambiguous" || error.constraint === "bundle_current_version_missing" || error.constraint === "bundle_path_escapes")) return "Review the bundle paths listed in details, then select the bundle's program file directly or repair the bundle layout.";
			if (error instanceof BinaryTargetError && error.constraint === "load_selection_rejected") return "Correct the reported load argument (--target-format, --architecture, or --entry-point on the CLI; format, architecture, or entry_point through MCP) and retry.";
			if (error instanceof BinaryTargetError && error.constraint === "file_format_rejected") return "Review the reported file-format reason and select a supported, well-formed target.";
			if (error instanceof BinaryTargetError && error.constraint === "wasm_requires_static_inspection") return `For static inspection, call inspect_wasm_artifact with ${JSON.stringify({ path: error.path })} or run \`rea inspect-wasm-artifact <path> --format json\`. This separate lane requires caller-supplied WABT 1.0.42 via absolute REA_WABT_BIN_DIRECTORY; check its availability in binary_session. REA does not execute WASM or install tools, and the header alone does not establish that the complete module is valid.`;
			if (error instanceof AnalysisAccessDeniedError || error instanceof BinaryTargetError && error.systemCode !== undefined) return "Check the current process's read access to the selected path. Retry with a readable local file.";
			if (error instanceof AnalysisArtifactChangedError) return "Wait until the selected file is stable. For an active binary session, reopen the target with open_binary before retrying so REA acquires its current identity; for a CLI command or target-free tool, rerun the operation.";
			if (error instanceof ConfigurationError) return error.remediationAction ?? (error.settings.length > 0 ? `Correct ${[...new Set(error.settings.map(({ setting }) => setting))].join(", ")} in the environment that starts REA (your shell or the MCP client's registration), then rerun.` : analysisErrorUserMessage(error));
			if (error instanceof AnalysisInputError) return error.remediationAction ?? `Read the declared input schema or CLI usage for ${error.operation}; if using MCP and the catalog may be stale, call tools/list. Correct the listed fields, then retry. Do not repeat the unchanged call.`;
			if (error instanceof AnalysisOutputError && error.remediationAction !== undefined) return error.remediationAction;
			if (error instanceof UnknownRegistryError && error.reason === "constraint" && error.constraint !== undefined) {
				const suffix = " Do not repeat the unchanged call.";
				switch (error.constraint.kind) {
					case "missing_evidence": return "Use an Evidence ID retained in this session; obtain or import the missing Evidence before referencing it." + suffix;
					case "missing_unknown": return "Use an unknown_id retained in this session; create or import the related unknown before referencing it." + suffix;
					case "resolution_unproven": return "Supply supporting non-mutation Evidence matching the unknown's required authority, confidence and environment, or withdraw the unsupported resolution." + suffix;
					case "contradicting_evidence": return "Reconcile the contradicting Evidence before claiming a verified resolution." + suffix;
					case "dependency_cycle": return "Correct the depends-on relationships to remove the dependency cycle." + suffix;
					case "history_gap":
					case "revision_chain": break;
				}
			}
			if (error instanceof UnknownRegistryError && error.reason === "not-found") return "Check that the unknown_id belongs to this session, then retry.";
			return analysisErrorUserMessage(error);
		};
		analysisErrorCategory = (error) => {
			error = primaryAnalysisError(error);
			if (error instanceof AnalysisCapabilityUnavailableError && error.retryable) return "unavailable";
			if (error instanceof BinaryTargetError && error.constraint === "load_selection_rejected") return "invalid_input";
			if (error instanceof BinaryTargetError && (error.constraint === "wasm_requires_static_inspection" || error.constraint === "file_format_rejected" || error.constraint === "bundle_type_unsupported")) return "unsupported_target";
			if (error instanceof ProviderSelectionError && error.reason === "provider_unavailable") return "unavailable";
			if (error._tag === "ProcessCaptureError") return error.userCategory ?? "execution_failure";
			if (error instanceof BrowserObservationError) return error.userCategory ?? browserErrorCategory(error.reason);
			if (error instanceof HopperRemoteError && error.diagnosticType === "invalid_request") return "invalid_input";
			if (error instanceof HopperRemoteError && error.diagnosticType === "authorization") return "unavailable";
			if (error instanceof HopperProcessError || error instanceof HopperStartError) return "unavailable";
			if (error instanceof ArtifactOperationError) return artifactErrorCategory(error.reason);
			if (error instanceof EvidenceFileError && (error.reason === "path-limit" || error.reason === "storage-limit")) return "resource_constraint";
			if (error instanceof EvidenceFileError && (error.reason === "missing" || error.reason === "symlink-traversal" || error.reason === "not-file" || error.reason === "wrong-kind" || error.reason === "exists")) return "invalid_input";
			if (error instanceof UnknownRegistryError && (error.reason === "already-exists" || error.reason === "constraint")) return "invalid_input";
			return STATIC_ERROR_CATEGORIES[error._tag] ?? "execution_failure";
		};
		browserErrorCategory = (reason) => {
			if (reason === "cancelled") return "cancelled";
			if (reason === "timeout") return "timeout";
			if (reason === "payload_limit") return "truncated";
			if (reason === "target_not_found" || reason === "target_not_allowed" || reason === "service_worker_blocked" || reason === "target_changed" || reason === "target_session_detached" || reason === "endpoint_unreachable" || reason === "disconnected") return "unavailable";
			return "execution_failure";
		};
		artifactErrorCategory = (reason) => {
			if (reason === "integrity") return "integrity_mismatch";
			if (reason === "limit") return "truncated";
			if (reason === "cancelled") return "cancelled";
			if (reason === "unavailable") return "unavailable";
			return "execution_failure";
		};
		STATIC_ERROR_CATEGORIES = {
			ConfigurationError: "invalid_input",
			AnalysisInputError: "invalid_input",
			AnalysisAccessDeniedError: "unavailable",
			AnalysisArtifactChangedError: "integrity_mismatch",
			AnalysisCapabilityUnavailableError: "unsupported_provider",
			AnalysisUnsupportedTargetError: "unsupported_target",
			ProviderSelectionError: "unsupported_provider",
			EvidenceIntegrityError: "integrity_mismatch",
			AnalysisCancelledError: "cancelled",
			HopperCancelledError: "cancelled",
			AnalysisTimeoutError: "timeout",
			AnalysisResourceConstraintError: "resource_constraint",
			HopperTimeoutError: "timeout",
			NoBinaryOpenError: "unavailable",
			BinaryTargetError: "unavailable"
		};
		analysisErrorUserMessage = (error, callerLifetime = "continuing") => {
			const { outcome, continuing } = analysisErrorUserMessageParts(error);
			return callerLifetime === "invocation" || continuing === undefined ? outcome : `${outcome} ${continuing}`;
		};
		analysisErrorUserMessageParts = (error) => {
			error = resolvedAnalysisError(error);
			const outcome = outcomeUserMessage(error);
			const continuing = error.continuingCallerGuidance?.userMessage;
			return continuing === undefined ? { outcome } : {
				outcome,
				continuing
			};
		};
		composedCallerGuidance = (sources) => {
			const message = sources.message === undefined ? undefined : analysisErrorUserMessageParts(sources.message);
			const remediationAction = analysisErrorRemediationAction(sources.remediation, "invocation");
			const continuingRemediation = analysisErrorRemediationAction(sources.remediation);
			const continuingCallerGuidance = {
				...message?.continuing === undefined ? {} : { userMessage: message.continuing },
				...continuingRemediation === remediationAction ? {} : { remediationAction: continuingRemediation }
			};
			return {
				...message === undefined ? {} : { userMessage: message.outcome },
				remediationAction,
				...Object.keys(continuingCallerGuidance).length === 0 ? {} : { continuingCallerGuidance }
			};
		};
		outcomeUserMessage = (error) => {
			if (error instanceof AnalysisSnapshotMismatchError) return error.message;
			if (error instanceof AnalysisUnsupportedTargetError) return error.message;
			if (error instanceof AnalysisResourceConstraintError) return error.reason;
			if (error instanceof AnalysisAccessDeniedError) return "Host filesystem permissions denied read access to the selected path.";
			if (error instanceof AnalysisArtifactChangedError) return "The selected artifact changed during acquisition; no stable snapshot was decoded.";
			if (error instanceof AnalysisInputError) return error.userMessage ?? "Analysis input is invalid. Check the arguments and try again.";
			if (error instanceof AnalysisTimeoutError) return error.userMessage ?? timeoutUserMessage(error);
			const hopperMessage = hopperErrorUserMessage(error);
			if (hopperMessage !== undefined) return hopperMessage;
			if (error.userMessage !== undefined) return error.userMessage;
			if (error instanceof AnalysisCapabilityUnavailableError && error.retryable) return "Required runtime controls are unavailable for this attempt.";
			const standardMessage = standardErrorMessage(error._tag);
			if (standardMessage !== undefined) return standardMessage;
			if (error instanceof ArtifactOperationError) return artifactMessage(error);
			if (error instanceof EvidenceReferenceError) return error.reason === "missing" ? error.referenceScope === "retained-closure" ? `Evidence ${error.evidenceId} is missing from the required retained Evidence closure in the current investigation. Import its originating bundle or re-create the required observations before retrying.` : `Evidence ${error.evidenceId} is not available from the selected source. Supply complete inline Evidence, re-run its producer, or select/import its bundle before using this reference.` : `Evidence ${error.evidenceId} does not match the requested reference (${error.reason}). Check the expected and actual identity in the diagnostic details.`;
			if (error instanceof EvidenceIntegrityError) return "Evidence is invalid or has changed. Recreate or re-import it, then try again.";
			if (error instanceof EvidenceFileError) return evidenceFileMessage(error);
			if (error instanceof UnknownRegistryError && error.reason === "already-exists") return "This residual unknown already exists in the session. Reuse it or call update_unknown with its current expected_revision; do not repeat record_unknown.";
			if (error instanceof UnknownRegistryError && error.reason === "not-found") return "The requested residual unknown does not exist in this session. Check the unknown_id and try again.";
			if (error instanceof UnknownRegistryError && error.constraint !== undefined) return describeResidualUnknownGraphConstraint(error.constraint);
			if (error instanceof UnknownRegistryError) return "Evidence state changed before the update completed. Refresh the current state and try again.";
			if (error instanceof ConfigurationError) return error.settings.length === 0 ? "REA configuration is invalid. Run `rea doctor` and fix the reported setting." : `REA configuration is invalid: ${error.settings.map(({ setting, constraint }) => constraint.includes(setting) ? constraint.replace(/\.$/u, "") : `${setting}: ${constraint}`).join("; ")}.`;
			if (error instanceof NoBinaryOpenError) return error.message;
			if (error instanceof BinaryTargetError && error.constraint === "wasm_requires_static_inspection") return `${error.message}. Static WebAssembly inspection uses a separate optional WABT lane, not a native analysis engine.`;
			if (error instanceof BinaryTargetError) return error.constraint === "directory_requires_file" ? `open_binary accepts files and Apple bundle directories (${OPENABLE_APPLE_BUNDLE_TYPES_TEXT}). This target is another directory; JavaScript/Electron application directories can be analyzed directly with analyze_javascript_application or \`rea analyze <directory>\`.` : error.constraint === undefined ? `${error.message}. Check that the path exists, is readable, and points to a supported file.` : `${error.message}.`;
			if (error._tag === "ProcessCaptureError") return error.userMessage ?? "Process capture could not complete. Run `rea doctor`, then review capture policy and try again.";
			return "Analysis could not complete. Run `rea doctor`, then try again.";
		};
		hopperErrorUserMessage = (error) => {
			if (error instanceof HopperTimeoutError) {
				if (error.operation === undefined) return "REA timed out waiting for Hopper bridge readiness, which includes initial analysis. Hopper may still be analyzing the target or waiting for a loader, demo, or license dialog. Review the captured launcher outcome and resolve retained cleanup before retrying.";
				const request = error.operation;
				return error.providerState === "busy" ? `Hopper timed out during ${request} while the provider remained busy. Check binary_session.analysis_activity, wait for the active request to finish, then retry.` : `Hopper timed out during ${request} before it started. Check binary_session for provider health, then retry.`;
			}
			if (error instanceof HopperProcessError) return hopperProcessMessage(error);
			if (error instanceof HopperStartError) return error.userMessage ?? "Hopper could not start. Check the launcher and target details, then retry opening the target.";
			if (error instanceof HopperRemoteError) return `Hopper ${error.operation ?? "analysis"} failed (${String(error.code)}, ${error.diagnosticType}): ${error.safeMessage}`;
			return undefined;
		};
		RESTART_OWNED_PROVIDER = "Restart the owned provider by calling close_binary, then open the target again and retry.";
		RESTART_UNREACHABLE_HOPPER = `${RESTART_OWNED_PROVIDER} close_binary preserves retained Evidence and Unknown history on this connection; export_evidence_bundle before ending the REA process if you need to resume later.`;
		hopperProcessRemediation = (error) => {
			if (error.failureCode !== undefined && error.userMessage !== undefined) return error.userMessage;
			if (error.stage === "launch") return "Review the captured launcher diagnostics and Hopper setup, then retry opening the target.";
			if (error.providerState === "unreachable") return RESTART_UNREACHABLE_HOPPER;
			if (providerRetryAction(error.providerState) === "restart_provider") return RESTART_OWNED_PROVIDER;
			return "Read binary_session.provider_operation_health for this request before retrying or restarting the owned provider.";
		};
		hopperProcessMessage = (error) => {
			const stage = error.stage;
			const where = error.operation ?? stage;
			const request = error.requestId === undefined ? "" : ` Request id ${String(error.requestId)}.`;
			const startup = error.userMessage === undefined ? "" : ` ${error.userMessage}`;
			if (error.providerState === "exited") {
				const signal = error.launcherFailure?.signal;
				const exit = error.exitCode === null ? signal === undefined || signal === null ? "no exit code was observed" : `signal ${signal}` : `exit code ${String(error.exitCode)}`;
				const recovery = error.failureCode === undefined && stage !== "launch" ? ` ${RESTART_OWNED_PROVIDER}` : "";
				return `Hopper exited during ${where} (${exit}).${startup}${recovery}${request}`;
			}
			if (error.providerState === "unreachable") return `Hopper became unreachable during ${where}; its process exit was not observed. ${RESTART_UNREACHABLE_HOPPER}${startup}${request}`;
			return `Hopper failed during ${where} and REA could not determine whether the provider is busy, exited, or unreachable.${startup} Read binary_session.provider_operation_health for this request before retrying or restarting.${request}`;
		};
		standardErrorMessage = (tag) => {
			if (UNREADABLE_OUTPUT_TAGS.has(tag)) return "Analysis returned an unreadable result. Run `rea doctor` and review the reported details; repeating the unchanged request is not expected to succeed.";
			if (UNSUPPORTED_PROVIDER_TAGS.has(tag)) return "This analysis is unavailable for the current target. Choose another analysis or target.";
			if (CANCELLED_TAGS.has(tag)) return "Analysis was cancelled. Start it again when ready.";
			if (TIMEOUT_TAGS.has(tag)) return "Analysis took too long. Try a smaller request, then run `rea doctor` if it continues.";
			if (ADAPTER_FAILURE_TAGS.has(tag)) return "Analysis could not complete. Run `rea doctor` and review the reported details; repeating the unchanged request is not expected to succeed.";
			if (START_FAILURE_TAGS.has(tag)) return "Analysis could not start or stopped unexpectedly. Run `rea doctor`, then try again.";
			return undefined;
		};
		timeoutUserMessage = (error) => `REA's ${error.operation} operation reached its ${String(error.timeoutMs)}ms server/provider deadline. This is not a client-side timeout; extending only the MCP client's deadline does not change this budget.`;
		timeoutRemediation = (error) => `Inspect any partial Evidence, provider diagnostics and reported session/provider cleanup state for ${error.operation}. Reduce the request if supported, or resolve the reported provider condition before retrying. Do not repeat the unchanged call or retry while work or cleanup may still be active.`;
		UNREADABLE_OUTPUT_TAGS = new Set([
			"AnalysisProtocolError",
			"AnalysisOutputError",
			"HopperProtocolError"
		]);
		UNSUPPORTED_PROVIDER_TAGS = new Set(["AnalysisCapabilityUnavailableError", "ProviderSelectionError"]);
		CANCELLED_TAGS = new Set(["AnalysisCancelledError", "HopperCancelledError"]);
		TIMEOUT_TAGS = new Set(["AnalysisTimeoutError", "HopperTimeoutError"]);
		ADAPTER_FAILURE_TAGS = new Set(["ProviderAdapterError", "HopperRemoteError"]);
		START_FAILURE_TAGS = new Set(["HopperProcessError", "HopperStartError"]);
		INTEGRITY_POLICY_OPERATIONS = new Set([
			"inventory_artifact",
			"inspect_artifact",
			"extract_artifact",
			"analyze_javascript_application"
		]);
		artifactMessage = ({ operation, reason, artifactDetails: details, detail }) => {
			if (reason === "cancelled") return "Artifact operation was cancelled. Start it again when ready.";
			if (reason === "limit") return detail ?? "Artifact processing reached a resource limit. Select an artifact within the reported limits and retry.";
			if (reason === "path") return detail ?? "Artifact contains a conflicting internal path. Inspect the reported path before retrying.";
			if (reason === "unavailable" && details?.unpacked === true) return `ASAR unpacked companion bytes are unavailable for ${details.logicalPath}. Select the archive in place with its .unpacked directory beside it, then retry.`;
			if (reason === "unavailable") return "Artifact processing is unavailable. Review the reported availability reason and resolve that condition before retrying.";
			if (reason === "integrity" && details !== undefined && INTEGRITY_POLICY_OPERATIONS.has(operation)) return `${details?.unpacked === true && "calculatedSha256" in details && details.calculatedSha256 !== null ? `Declared ASAR integrity for unpacked entry ${details.logicalPath} contradicts its companion file; packaging tools commonly sign or strip unpacked native binaries after writing the archive.` : "Artifact bytes contradict declared integrity."} If expected, rerun ${operation === "inventory_artifact" ? "inspect_artifact" : operation} with integrity_policy=record-and-continue (CLI: --integrity-policy record-and-continue) to retain observed bytes as untrusted; otherwise get a fresh copy.`;
			if (reason === "format" || reason === "integrity") return "Artifact is invalid or has changed. Get a fresh copy and try again.";
			return "Artifact could not be read or written. Check file access and try again.";
		};
		evidenceFileMessage = ({ operation, reason, published, systemCode }) => {
			if (published !== undefined) return "The output file was published, but staging cleanup remains incomplete.";
			if (reason === "path-limit") return "Filesystem path-length constraints prevented reading or atomic publication at the selected path. Choose a shorter local path.";
			if (reason === "storage-limit") return systemCode === "EFBIG" ? "The host file-size limit prevented Evidence publication. Increase the inherited file-size allowance and retry." : systemCode === undefined ? "A host filesystem resource limit prevented Evidence publication. Check the file-size allowance, filesystem space and quota before retrying." : "The filesystem lacks space or quota for Evidence publication. Free space or increase quota and retry.";
			if (reason === "symlink-traversal") return "The selected path cannot be resolved because its symbolic-link chain loops or exceeds the host traversal limit. Repair the chain or select another path.";
			if (reason === "missing") return operation === "read" ? "Evidence file does not exist at the selected path. Check the path and try again." : "Evidence output directory does not exist. Choose an existing directory and try again.";
			if (reason === "not-file") return "Evidence path does not point to a regular file. Choose a file and try again.";
			if (reason === "exists") return "Evidence file already exists. Choose another path or allow overwrite.";
			if (reason === "invalid-json") return "Evidence file is not valid JSON. Repair or recreate the file and try again.";
			return "Evidence file could not be accessed. Check file permissions and try again.";
		};
		KNOWN_ERROR_TAGS = {
			AnalysisProtocolError: true,
			AnalysisInputError: true,
			AnalysisAccessDeniedError: true,
			AnalysisArtifactChangedError: true,
			AnalysisOutputError: true,
			AnalysisCapabilityUnavailableError: true,
			AnalysisUnsupportedTargetError: true,
			AnalysisCancelledError: true,
			AnalysisTimeoutError: true,
			AnalysisResourceConstraintError: true,
			ProviderSelectionError: true,
			ProviderAdapterError: true,
			BrowserObservationError: true,
			ArtifactOperationError: true,
			ProcessCaptureError: true,
			EvidenceIntegrityError: true,
			EvidenceFileError: true,
			UnknownRegistryError: true,
			HopperTimeoutError: true,
			HopperCancelledError: true,
			HopperProtocolError: true,
			HopperRemoteError: true,
			HopperProcessError: true,
			HopperStartError: true,
			ConfigurationError: true,
			NoBinaryOpenError: true,
			BinaryTargetError: true
		};
		assertKnownAnalysisErrorTag = (tag) => {
			if (KNOWN_ERROR_TAGS[tag] !== true) throw new TypeError("Unknown analysis error tag");
		};
	})))();
}

//#endregion
//#region dist/domain/analysisSettingDefinitions.js
var timer, ANALYSIS_SETTINGS, analysisSettingIds, analysisSettingIdSchema, analysisSettingDefinition, analysisSettingValueSchema, analysisSettingLimit, invocationSettingLimit;
function init_analysisSettingDefinitions() {
	return (init_analysisSettingDefinitions = __esmMin((() => {
		init_analysisResourceLimits();
		init_javascriptAnalysisResourceControls();
		init_wasmArtifact();
		timer = {
			minimum: 1,
			maximum: MAX_NODE_TIMER_DELAY_MS,
			unit: "ms",
			appliesAt: "next_operation"
		};
		ANALYSIS_SETTINGS = {
			"asar.max_header_bytes": {
				environment: "REA_ASAR_MAX_HEADER_BYTES",
				defaultValue: DEFAULT_ASAR_MAX_HEADER_BYTES,
				minimum: 1,
				maximum: MAXIMUM_ASAR_MAX_HEADER_BYTES,
				unit: "bytes",
				appliesAt: "next_operation",
				provider: "rea-artifact-graph",
				relatedProviders: [
					"rea-javascript-application",
					"rea-cdp-electron",
					"rea-v8-inspector"
				],
				operations: [
					"open_binary",
					"inspect_artifact",
					"inventory_artifact",
					"extract_artifact",
					"analyze_javascript_application",
					"inspect_electron_page",
					"observe_javascript_runtime"
				]
			},
			"ghidra.startup_timeout_ms": {
				...timer,
				environment: "REA_GHIDRA_STARTUP_TIMEOUT_MS",
				defaultValue: DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS,
				appliesAt: "next_startup",
				provider: "ghidra",
				operations: [
					"binary_overview",
					"list_documents",
					"list_procedures",
					"search_procedures",
					"list_strings",
					"search_strings",
					"procedure_pseudo_code",
					"procedure_assembly",
					"analyze_function",
					"decompile_all",
					"trace_native_values"
				]
			},
			"hopper.startup_timeout_ms": {
				...timer,
				environment: "REA_HOPPER_STARTUP_TIMEOUT_MS",
				defaultValue: DEFAULT_HOPPER_STARTUP_TIMEOUT_MS,
				appliesAt: "next_startup",
				provider: "hopper",
				operations: [
					"binary_overview",
					"list_documents",
					"list_procedures",
					"search_procedures",
					"list_strings",
					"search_strings",
					"procedure_pseudo_code",
					"procedure_assembly",
					"analyze_function",
					"decompile_all",
					"trace_native_values"
				]
			},
			"ghidra.decompile_timeout_seconds": {
				environment: "REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS",
				defaultValue: null,
				minimum: 1,
				maximum: MAX_GHIDRA_DECOMPILE_TIMEOUT_SECONDS,
				unit: "seconds",
				appliesAt: "next_operation",
				provider: "ghidra",
				operations: [
					"procedure_pseudo_code",
					"analyze_function",
					"decompile_all",
					"trace_native_values"
				]
			},
			"jadx.operation_timeout_ms": {
				...timer,
				environment: "REA_JADX_OPERATION_TIMEOUT_MS",
				defaultValue: DEFAULT_JADX_OPERATION_TIMEOUT_MS,
				provider: "jadx",
				operations: [
					"inspect_android_package",
					"search_android_classes",
					"inspect_android_class",
					"inspect_android_method",
					"trace_android_references"
				]
			},
			"regex.matching_deadline_ms": {
				...timer,
				environment: "REA_REGEX_MATCHING_DEADLINE_MS",
				defaultValue: DEFAULT_REGEX_MATCHING_DEADLINE_MS,
				maximum: MAXIMUM_REGEX_MATCHING_DEADLINE_MS,
				provider: "regex",
				relatedProviders: [
					"ida",
					"hopper",
					"kuna"
				],
				operations: ["search_strings", "search_procedures"]
			},
			"regex.worker_heap_request_mib": {
				environment: "REA_REGEX_WORKER_HEAP_REQUEST_MIB",
				defaultValue: 128,
				minimum: 7,
				maximum: MAXIMUM_REGEX_WORKER_HEAP_REQUEST_MIB,
				unit: "MiB",
				appliesAt: "next_worker",
				provider: "regex",
				relatedProviders: [
					"ida",
					"hopper",
					"kuna"
				],
				operations: ["search_strings", "search_procedures"]
			},
			"capture.decoder_old_generation_mib": {
				environment: "REA_CAPTURE_DECODER_OLD_GENERATION_MIB",
				defaultValue: 192,
				minimum: 8,
				maximum: MAXIMUM_CAPTURE_DECODER_OLD_GENERATION_MIB,
				unit: "MiB",
				appliesAt: "next_worker",
				provider: "capture",
				operations: ["inspect_web_network_capture"]
			},
			"javascript.analysis_timeout_ms": {
				...timer,
				defaultValue: JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.timeoutMs,
				provider: "rea-javascript-application",
				operations: ["analyze_javascript_application"],
				parameter: "analysis_timeout_ms"
			},
			"javascript.max_heap_mb": {
				defaultValue: JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.heapMb,
				minimum: 128,
				maximum: JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM,
				unit: "MiB",
				appliesAt: "next_worker",
				provider: "rea-javascript-application",
				operations: ["analyze_javascript_application"],
				parameter: "max_heap_mb"
			},
			"wasm.command_timeout_ms": {
				...timer,
				defaultValue: DEFAULT_WASM_COMMAND_TIMEOUT_MS,
				maximum: MAX_WASM_COMMAND_TIMEOUT_MS,
				provider: "wabt-artifact",
				operations: ["inspect_wasm_artifact"],
				parameter: "command_timeout_ms"
			},
			"native.matching_representation_bytes": {
				environment: "REA_NATIVE_MATCHING_REPRESENTATION_BYTES",
				defaultValue: DEFAULT_NATIVE_MATCHING_REPRESENTATION_BYTES,
				minimum: 1,
				maximum: MAXIMUM_NATIVE_MATCHING_REPRESENTATION_BYTES,
				unit: "bytes",
				appliesAt: "next_operation",
				provider: "rea-function-comparison",
				operations: ["match_native_functions"]
			}
		};
		analysisSettingIds = Object.keys(ANALYSIS_SETTINGS);
		analysisSettingIdSchema = z.enum(analysisSettingIds);
		analysisSettingDefinition = (id) => ANALYSIS_SETTINGS[id];
		analysisSettingValueSchema = (id) => {
			const definition = analysisSettingDefinition(id);
			const number = z.number().int().min(definition.minimum).max(definition.maximum);
			return id === "ghidra.decompile_timeout_seconds" ? number.nullable() : number;
		};
		analysisSettingLimit = (setting, effective_value, source) => {
			const definition = analysisSettingDefinition(setting);
			return {
				setting,
				effective_value,
				...source === undefined ? {} : { source },
				unit: definition.unit,
				minimum: definition.minimum,
				maximum: definition.maximum,
				applies_at: definition.appliesAt,
				agent_editable: true,
				scope: "rea-runtime",
				rea_restart_required: false,
				...definition.parameter === undefined ? {} : { parameter: definition.parameter }
			};
		};
		invocationSettingLimit = ({ applies_at: _appliesAt, scope: _scope, ...facts }) => {
			const environment = analysisSettingDefinition(facts.setting).environment;
			return {
				...facts,
				applies_at: "next_invocation",
				scope: "rea-invocation",
				...environment === undefined ? {} : { environment }
			};
		};
	})))();
}

//#endregion
//#region dist/domain/analysisErrorProjection.js
var projectAnalysisError, projectAnalysisErrorWithoutCapturedOutput, childFailureDiagnostics, projectionDependsOnCallerLifetime, projectError, errorRecovery, underlyingErrorCode, BROWSER_ERROR_CODES, artifactOperationCode, evidenceFileCode, unknownRegistryCode, processCaptureCode, STATIC_ERROR_CODES, staticErrorCode, errorDetails, requestErrorDetails, artifactStateErrorDetails, providerErrorDetails, primaryBrowserFailureReason, lifecycleErrorDetails, RETRYABLE_CODES;
function init_analysisErrorProjection() {
	return (init_analysisErrorProjection = __esmMin((() => {
		init_artifactIntegrity();
		init_analysisErrorRecovery();
		init_jsonValue();
		init_immutableJson();
		init_analysisErrorPresentation();
		init_analysisErrorCore();
		init_artifactOperationError();
		init_configurationErrors();
		init_browserObservationError();
		init_evidenceErrors();
		init_hopperErrors();
		init_providerAdapterError();
		init_providerSelectionError();
		init_unknownRegistryError();
		init_providerOperationHealth();
		init_analysisErrorBase();
		init_analysisSettingDefinitions();
		projectAnalysisError = (error, callerLifetime = "continuing") => projectError(error, true, callerLifetime);
		projectAnalysisErrorWithoutCapturedOutput = (error, callerLifetime = "continuing") => projectError(error, false, callerLifetime);
		childFailureDiagnostics = (children, diagnostics = {}) => {
			const entries = Object.entries(children);
			const project = ({ error, capturedOutput }, callerLifetime) => projectError(error, capturedOutput !== "omit", callerLifetime);
			const continuing = {
				...diagnostics,
				...Object.fromEntries(entries.map(([key, child]) => [key, project(child, "continuing")]))
			};
			const varying = entries.filter(([, { error }]) => projectionDependsOnCallerLifetime(error));
			return varying.length === 0 ? { diagnostics: continuing } : {
				diagnostics: continuing,
				invocationDiagnostics: {
					...continuing,
					...Object.fromEntries(varying.map(([key, child]) => [key, project(child, "invocation")]))
				}
			};
		};
		projectionDependsOnCallerLifetime = (error) => {
			for (let node = error; node !== undefined; node = node.cleanupPrimary) if (node.limit !== undefined || node.continuingCallerGuidance !== undefined || node.invocationDiagnostics !== undefined || node.workflowUnknownPublication !== undefined) return true;
			return false;
		};
		projectError = (error, includeCapturedOutput, callerLifetime) => {
			const composed = error;
			error = resolvedAnalysisError(error);
			let diagnosticSource = error;
			while (diagnosticSource.diagnostics === undefined && diagnosticSource.cleanupPrimary !== undefined) diagnosticSource = diagnosticSource.cleanupPrimary;
			const diagnostics = diagnosticSource.diagnosticsFor(callerLifetime);
			const cleanupHistory = composed === error ? undefined : composed.diagnosticsFor(callerLifetime);
			const capturedOutput = composed.capturedOutput ?? error.capturedOutput;
			const partialObservation = composed.partialObservation ?? error.partialObservation;
			let cleanupReport = composed.cleanupReport;
			for (let owner = composed.cleanupPrimary; cleanupReport === undefined && owner !== undefined; owner = owner.cleanupPrimary) cleanupReport = owner.cleanupReport;
			assertKnownAnalysisErrorTag(error._tag);
			const primary = primaryAnalysisError(error);
			assertKnownAnalysisErrorTag(primary._tag);
			const underlyingCode = underlyingErrorCode(primary);
			const code = error.cleanupIncomplete ? "cleanup_incomplete" : underlyingCode;
			const primaryDetails = errorDetails(primary);
			const publication = composed.workflowUnknownPublication ?? primary.workflowUnknownPublication;
			const details = {
				...primaryDetails,
				...publication === undefined ? {} : { workflow_unknown_publication: {
					...publication,
					evidence_retention: callerLifetime === "invocation" && publication.evidence_retention === "retained" ? "invocation-only" : publication.evidence_retention
				} },
				...primary.limit === undefined ? {} : { limit: callerLifetime === "invocation" ? { ...invocationSettingLimit(primary.limit) } : { ...primary.limit } },
				...cleanupReport === undefined ? {} : { cleanup_report: jsonValueSchema.parse(cleanupReport) },
				...diagnostics === undefined ? {} : {
					diagnostics,
					...primaryDetails?.diagnostics === undefined ? {} : { provider_diagnostics: primaryDetails.diagnostics }
				},
				...cleanupHistory === undefined ? {} : { cleanup_history: cleanupHistory },
				...error.cleanupIncomplete ? {
					cleanup: "incomplete",
					resources: [...error.cleanupResources],
					...error.cleanup === undefined ? {} : { cleanup_reason: error.cleanup.reason },
					execution_failure: primaryDetails?.execution_failure ?? underlyingCode
				} : {},
				...!includeCapturedOutput || capturedOutput === undefined ? {} : { captured_output: { ...capturedOutput } },
				...partialObservation === undefined ? {} : { partial_observation: isImmutableJsonSnapshot(partialObservation) ? partialObservation : jsonValueSchema.parse(partialObservation) }
			};
			const cleanupRetry = error.cleanupRetry;
			const recovery = cleanupRetry === undefined ? errorRecovery(error) : cleanupRetryRecovery(cleanupRetry);
			const remediation = analysisErrorRemediationAction(error, callerLifetime);
			const publicationRemediation = callerLifetime === "continuing" && publication?.evidence_retention === "retained" ? " Use get_evidence_bundle with the Evidence ID in details.workflow_unknown_publication to retrieve the completed result; use list_unknowns to inspect recorded questions. Publication stopped at the reported index; later questions were not checked in this attempt." : "";
			return {
				code,
				category: analysisErrorCategory(error),
				message: analysisErrorUserMessage(error, callerLifetime),
				retryable: RETRYABLE_CODES.has(code) || error instanceof AnalysisCapabilityUnavailableError && error.retryable || code === "resource_constraint" && error instanceof AnalysisResourceConstraintError && (error.retryable ?? error.resource === "capacity"),
				remediation: { action: cleanupRetry === undefined ? `${remediation}${publicationRemediation}` : `${remediation} ${cleanupRetryRemediation(cleanupRetry)}${publicationRemediation}` },
				...recovery === undefined ? {} : { recovery },
				...Object.keys(details).length === 0 ? {} : { details }
			};
		};
		errorRecovery = (error) => {
			if (error instanceof AnalysisInputError) return error.conformsToInputContract ? undefined : {
				kind: "inspect_input_contract",
				operation: error.operation
			};
			if (error instanceof AnalysisTimeoutError) return {
				kind: "inspect_timeout_state",
				operation: error.operation,
				timeout_ms: error.timeoutMs
			};
			return undefined;
		};
		underlyingErrorCode = (error) => {
			if (error instanceof HopperRemoteError && error.diagnosticType === "invalid_request") return "invalid_request";
			if (error instanceof ProviderSelectionError) return error.reason === "provider_unavailable" ? "provider_unavailable" : "capability_unavailable";
			if (error instanceof BrowserObservationError) return error.userCategory === "cancelled" ? "cancelled" : BROWSER_ERROR_CODES[error.reason];
			if (error instanceof ArtifactOperationError) return artifactOperationCode(error);
			if (error instanceof BinaryTargetError) return error.constraint === "load_selection_rejected" ? "invalid_request" : error.systemCode === undefined ? "target_unavailable" : "access_denied";
			if (error instanceof EvidenceFileError) return evidenceFileCode(error.reason);
			if (error instanceof UnknownRegistryError) return unknownRegistryCode(error.reason);
			if (error._tag === "ProcessCaptureError") return processCaptureCode(error);
			return staticErrorCode(error._tag);
		};
		BROWSER_ERROR_CODES = {
			endpoint_unreachable: "provider_unavailable",
			invalid_endpoint_response: "unreadable_output",
			target_not_found: "target_unavailable",
			target_not_allowed: "target_unavailable",
			service_worker_blocked: "target_unavailable",
			target_changed: "target_unavailable",
			target_session_detached: "target_unavailable",
			protocol_error: "unreadable_output",
			disconnected: "provider_unavailable",
			payload_limit: "truncated",
			window_not_found: "unreadable_output",
			window_metadata_missing: "unreadable_output",
			process_ownership_unavailable: "unreadable_output",
			cleanup_failed: "execution_failure",
			cancelled: "cancelled",
			timeout: "provider_timeout"
		};
		artifactOperationCode = (error) => {
			if (error.reason === "integrity" && error.artifactDetails !== undefined) return "artifact_integrity_mismatch";
			if (error.reason === "limit") return "truncated";
			if (error.reason === "cancelled") return "cancelled";
			return "artifact_operation_failed";
		};
		evidenceFileCode = (reason) => {
			if (reason === "invalid-json") return "evidence_integrity_mismatch";
			if (reason === "path-limit" || reason === "storage-limit") return "resource_constraint";
			if (reason === "io") return "execution_failure";
			return "invalid_request";
		};
		unknownRegistryCode = (reason) => {
			if (reason === "revision-conflict") return "revision_conflict";
			if (reason === "already-exists" || reason === "constraint") return "invalid_request";
			if (reason === "limit") return "truncated";
			if (reason === "integrity") return "evidence_integrity_mismatch";
			return "execution_failure";
		};
		processCaptureCode = (error) => {
			if (error.cleanupIncomplete) return "cleanup_incomplete";
			if (error.userCategory === "cancelled") return "cancelled";
			return "process_capture_failed";
		};
		STATIC_ERROR_CODES = {
			AnalysisProtocolError: "unreadable_output",
			AnalysisOutputError: "unreadable_output",
			HopperProtocolError: "unreadable_output",
			AnalysisInputError: "invalid_request",
			AnalysisAccessDeniedError: "access_denied",
			AnalysisArtifactChangedError: "artifact_changed",
			AnalysisCapabilityUnavailableError: "capability_unavailable",
			AnalysisUnsupportedTargetError: "unsupported_target",
			AnalysisCancelledError: "cancelled",
			HopperCancelledError: "cancelled",
			AnalysisTimeoutError: "provider_timeout",
			AnalysisResourceConstraintError: "resource_constraint",
			HopperTimeoutError: "provider_timeout",
			HopperProcessError: "provider_unavailable",
			HopperStartError: "provider_unavailable",
			ConfigurationError: "configuration_invalid",
			NoBinaryOpenError: "target_unavailable",
			EvidenceIntegrityError: "evidence_integrity_mismatch",
			ProviderAdapterError: "execution_failure",
			HopperRemoteError: "execution_failure"
		};
		staticErrorCode = (tag) => {
			switch (tag) {
				case "ArtifactOperationError":
				case "BinaryTargetError":
				case "BrowserObservationError":
				case "EvidenceFileError":
				case "ProcessCaptureError":
				case "ProviderSelectionError":
				case "UnknownRegistryError": throw new TypeError(`Unhandled specialized analysis error: ${tag}`);
				default: return STATIC_ERROR_CODES[tag];
			}
		};
		errorDetails = (error) => requestErrorDetails(error) ?? artifactStateErrorDetails(error) ?? providerErrorDetails(error) ?? lifecycleErrorDetails(error);
		requestErrorDetails = (error) => {
			if (error instanceof AnalysisUnsupportedTargetError) return {
				operation: error.operation,
				path: error.path,
				reason: error.reason
			};
			if (error instanceof AnalysisResourceConstraintError) return {
				operation: error.operation,
				resource: error.resource,
				reason: error.reason,
				reported_limits: error.reportedLimits
			};
			if (error instanceof AnalysisArtifactChangedError) return {
				operation: error.operation,
				path: error.path,
				reason: error.reason,
				boundary: "stable-artifact-read"
			};
			if (error instanceof AnalysisAccessDeniedError) return {
				operation: error.operation,
				path: error.path,
				system_code: error.systemCode,
				boundary: "filesystem-read"
			};
			if (error instanceof AnalysisOutputError) return {
				operation: error.operation,
				reason: error.reason,
				...error.diagnostics === undefined ? {} : { diagnostics: error.diagnostics }
			};
			if (error instanceof AnalysisInputError && error.issues.length > 0) return {
				operation: error.operation,
				issues: error.issues.map((issue) => ({
					path: [...issue.path],
					reason: issue.reason,
					...issue.message === undefined ? {} : { message: issue.message },
					...issue.expected === undefined ? {} : { expected: issue.expected },
					...issue.observed === undefined ? {} : { observed: issue.observed },
					...issue.minimum === undefined ? {} : { minimum: issue.minimum },
					...issue.maximum === undefined ? {} : { maximum: issue.maximum }
				}))
			};
			if (error instanceof EvidenceReferenceError) return {
				evidence_id: error.evidenceId,
				reason: error.reason,
				...typeof error.diagnostics?.operation === "string" ? { operation: error.diagnostics.operation } : {},
				...error.referenceScope === undefined ? {} : { reference_scope: error.referenceScope },
				expected: error.expected,
				actual: error.actual
			};
			if (error instanceof AnalysisSnapshotMismatchError) return {
				reason: error.message,
				...error.bindingMismatch === undefined ? {} : { binding_mismatch: jsonValueSchema.parse(error.bindingMismatch) }
			};
			if (error instanceof EvidenceIntegrityError) return { reason: error.message };
			return undefined;
		};
		artifactStateErrorDetails = (error) => {
			if (error instanceof ArtifactOperationError && error.artifactDetails) return projectArtifactIntegrityDetails(error.artifactDetails);
			if (error instanceof ArtifactOperationError) return {
				operation: error.operation,
				reason: error.reason,
				...error.reason === "limit" ? { truncated: true } : {},
				...error.detail === undefined ? {} : { detail: error.detail },
				...error.boundary === undefined ? {} : { boundary: error.boundary },
				...error.admission === undefined ? {} : {
					admission: error.admission.kind,
					maximum_header_bytes: error.admission.maximumBytes,
					maximum_header_bytes_source: error.admission.source,
					setting: "REA_ASAR_MAX_HEADER_BYTES"
				}
			};
			if (error instanceof UnknownRegistryError) return {
				reason: error.reason,
				...error.constraint === undefined ? {} : { constraint: error.constraint }
			};
			if (error instanceof EvidenceFileError) return {
				operation: error.operation,
				reason: error.reason,
				...error.reason === "path-limit" ? { boundary: "filesystem-path" } : {},
				...error.systemCode === undefined ? {} : { system_code: error.systemCode },
				...error.path === undefined ? {} : { path: error.path },
				...error.contentIssues === undefined ? {} : { content_issues: error.contentIssues.map((issue) => ({
					...issue,
					path: [...issue.path]
				})) },
				...error.published === undefined ? {} : {
					published: true,
					bytes: error.published.bytes,
					...error.published.path === undefined ? {} : { published_path: error.published.path }
				}
			};
			return undefined;
		};
		providerErrorDetails = (error) => {
			if (error instanceof AnalysisCapabilityUnavailableError) return {
				provider_id: error.providerId,
				operation: error.operation,
				reason: error.reason
			};
			if (error instanceof ProviderSelectionError) return {
				operation: error.operation,
				selection_reason: error.reason,
				requested_provider_id: error.requestedProviderId,
				candidate_ids: [...error.candidateIds],
				rejections: error.rejections.map((rejection) => ({
					provider_id: rejection.providerId,
					origin: rejection.origin,
					code: rejection.code,
					reason: rejection.reason,
					...rejection.remediation === undefined ? {} : { remediation: rejection.remediation },
					diagnostics: rejection.diagnostics
				}))
			};
			if (error instanceof ProviderAdapterError) return {
				provider_id: error.providerId,
				operation: error.operation,
				...error.cleanupIncomplete ? {
					cleanup: "incomplete",
					resources: [...error.cleanupResources]
				} : {}
			};
			if (error instanceof BrowserObservationError) {
				const primaryReason = primaryBrowserFailureReason(error);
				return {
					operation: error.operation,
					reason: error.reason,
					...error.cleanupIncomplete ? {
						cleanup: "incomplete",
						resources: [...error.cleanupResources],
						...primaryReason === undefined ? {} : { primary_reason: primaryReason }
					} : {}
				};
			}
			if (error instanceof HopperRemoteError) return {
				stage: "analysis",
				provider_code: error.code,
				diagnostic_type: error.diagnosticType,
				...error.operation === undefined ? {} : { operation: error.operation },
				...error.requestId === undefined ? {} : { request_id: error.requestId }
			};
			if (error instanceof HopperProcessError) {
				const stage = error.stage;
				return {
					exit_code: error.exitCode,
					stage,
					provider_state: error.providerState,
					retry_action: providerRetryAction(error.providerState, error.failureCode !== undefined || error.stage === "launch"),
					...error.failureCode === undefined ? {} : { failure_code: error.failureCode },
					...error.operation === undefined ? {} : { operation: error.operation },
					...error.requestId === undefined ? {} : { request_id: error.requestId },
					...error.diagnostic === undefined ? {} : { diagnostics: { ...error.diagnostic } },
					...error.launcherFailure === undefined ? {} : { launcher: error.launcherFailure }
				};
			}
			if (error instanceof HopperStartError) return {
				stage: "launch",
				provider_state: "unknown",
				...error.launchRejection === undefined ? {} : { launch_rejection: { ...error.launchRejection } },
				retry_action: error.ownerRunId === undefined ? "retry" : "unknown",
				...error.ownerRunId === undefined ? {} : { owner_run_id: error.ownerRunId },
				...error.launcherFailure === undefined ? {} : { launcher: error.launcherFailure }
			};
			return undefined;
		};
		primaryBrowserFailureReason = (error) => {
			const aggregate = error.cause instanceof AggregateError;
			const primary = error.cause instanceof AggregateError ? error.cause.errors[0] : error.cause;
			if (primary instanceof BrowserObservationError) return primary.reason;
			if (primary instanceof AnalysisCancelledError) return "cancelled";
			if (primary instanceof AnalysisTimeoutError) return "timeout";
			if (typeof primary === "object" && primary !== null && "_tag" in primary) return typeof primary._tag === "string" ? primary._tag : "execution_failure";
			return aggregate ? "execution_failure" : undefined;
		};
		lifecycleErrorDetails = (error) => {
			if (error instanceof AnalysisCancelledError) return {
				operation: error.operation,
				cleanup: error.cleanupIncomplete ? "incomplete" : "complete",
				...error.cleanup === undefined || !error.cleanupIncomplete ? {} : {
					cleanup_reason: error.cleanup.reason,
					resources: [...error.cleanup.resources],
					execution_failure: "cancelled"
				}
			};
			if (error instanceof HopperCancelledError) return {
				operation: "hopper",
				cleanup: "complete"
			};
			if (error instanceof AnalysisTimeoutError) return {
				operation: error.operation,
				timeout_ms: error.timeoutMs,
				...error.cleanup === undefined || !error.cleanupIncomplete ? {} : {
					cleanup: "incomplete",
					cleanup_reason: error.cleanup.reason,
					resources: [...error.cleanup.resources]
				}
			};
			if (error instanceof HopperTimeoutError) return {
				stage: error.operation === undefined ? "startup" : error.stage,
				timeout_ms: error.timeoutMs,
				...error.launcherOutcome === undefined ? {} : { launcher: error.launcherOutcome },
				provider_state: error.providerState,
				retry_action: error.providerState === "busy" ? "wait" : "retry",
				...error.operation === undefined ? {} : { operation: error.operation },
				...error.requestId === undefined ? {} : { request_id: error.requestId }
			};
			if (error._tag === "ProcessCaptureError" && error.cleanupIncomplete) return {
				cleanup: "incomplete",
				resources: [...error.cleanupResources],
				...error.cleanupReport === undefined ? {} : { cleanup_report: jsonValueSchema.parse(error.cleanupReport) },
				...error.executionFailure === undefined ? {} : { execution_failure: error.executionFailure }
			};
			if (error._tag === "ProcessCaptureError") {
				const details = {
					...error.userCategory === "cancelled" ? {
						operation: "process_capture",
						cleanup: "complete"
					} : {},
					...error.cleanupReport === undefined ? {} : { cleanup_report: jsonValueSchema.parse(error.cleanupReport) },
					...error.executionFailure === undefined ? {} : { execution_failure: error.executionFailure }
				};
				return Object.keys(details).length === 0 ? undefined : details;
			}
			if (error instanceof ConfigurationError && error.settings.length > 0) return { settings: error.settings.map(({ setting, constraint }) => ({
				setting,
				constraint
			})) };
			if (error instanceof BinaryTargetError) return {
				path: error.path,
				reason: error.reason,
				...error.constraint === undefined ? {} : { constraint: error.constraint },
				...error.infoPlist === undefined ? {} : { info_plist: error.infoPlist },
				...error.probedPaths === undefined ? {} : { probed_paths: [...error.probedPaths] },
				...error.systemCode === undefined ? {} : {
					system_code: error.systemCode,
					boundary: "filesystem-read"
				}
			};
			return undefined;
		};
		RETRYABLE_CODES = new Set([
			"artifact_changed",
			"provider_timeout",
			"cancelled",
			"revision_conflict",
			"provider_unavailable"
		]);
	})))();
}

//#endregion
//#region dist/domain/jsonSerialization.js
/** Encode ordinary JSON as bounded string parts without a document-sized allocation. */
function* jsonParts(value, pretty = false) {
	yield* encodeValue(value, pretty, false);
}
/** Encode validated JSON with canonical key ordering without allocating the whole document. */
function* canonicalJsonParts(value) {
	yield* encodeValue(value, false, true);
}
/** Buffer JSON parts while preserving complete UTF-16 surrogate pairs. */
function* bufferedJsonParts(parts) {
	let buffer = "";
	for (const part of parts) {
		if (buffer.length + part.length > 64 * 1024 && buffer !== "") {
			yield buffer;
			buffer = "";
		}
		buffer += part;
	}
	if (buffer !== "") yield buffer;
}
function* encodeString(value) {
	if (value.length <= 8192) {
		yield JSON.stringify(value);
		return;
	}
	yield "\"";
	for (let start = 0; start < value.length;) {
		let end = Math.min(start + 8192, value.length);
		const last = value.charCodeAt(end - 1);
		const next = value.charCodeAt(end);
		if (end < value.length && last >= 55296 && last <= 56319 && next >= 56320 && next <= 57343) end -= 1;
		yield JSON.stringify(value.slice(start, end)).slice(1, -1);
		start = end;
	}
	yield "\"";
}
/**
* Encode iteratively into bounded parts. Recursive `yield*` delegation passed
* every token through one generator frame per nesting level, which dominated
* the cost of writing large nested results.
*/
function* encodeValue(root, pretty, canonical) {
	const ancestors = new Set();
	const stack = [];
	let buffer = "";
	let pending = root;
	let hasPending = true;
	while (true) {
		if (hasPending) {
			hasPending = false;
			const text = scalarText(pending);
			if (text !== undefined) buffer += text;
			else if (typeof pending === "string") {
				if (buffer !== "") yield buffer;
				buffer = "";
				yield* encodeString(pending);
			} else {
				const frame = openContainer(pending, stack.length, ancestors, canonical);
				stack.push(frame);
				buffer += frame.array ? "[" : "{";
			}
		}
		if (buffer.length >= PART_CHARACTERS) {
			yield buffer;
			buffer = "";
		}
		const frame = stack.at(-1);
		if (frame === undefined) break;
		const member = nextMember(frame);
		if (member === undefined) {
			if (pretty && frame.written > 0) buffer += indent(frame.depth);
			buffer += frame.array ? "]" : "}";
			ancestors.delete(frame.value);
			stack.pop();
			continue;
		}
		if (frame.written > 0) buffer += ",";
		if (pretty) buffer += indent(frame.depth + 1);
		if (member.key !== undefined) {
			const key = scalarText(member.key);
			if (key !== undefined) buffer += key;
			else {
				if (buffer !== "") yield buffer;
				buffer = "";
				yield* encodeString(member.key);
			}
			buffer += pretty ? ": " : ":";
		}
		frame.written += 1;
		pending = member.item;
		hasPending = true;
	}
	if (buffer !== "") yield buffer;
}
var jsonStringCodeUnits, jsonByteLength, jsonTextCodeUnits, equalJsonText, PART_CHARACTERS, indentation, indent, scalarText, openContainer, nextMember;
function init_jsonSerialization() {
	return (init_jsonSerialization = __esmMin((() => {
		jsonStringCodeUnits = (value) => {
			let length = value.length + 2;
			for (let index = 0; index < value.length; index += 1) {
				const code = value.charCodeAt(index);
				if (code === 34 || code === 92) length += 1;
				else if (code < 32) length += code === 8 || code === 9 || code === 10 || code === 12 || code === 13 ? 1 : 5;
				else if (code >= 55296 && code <= 57343) {
					const next = value.charCodeAt(index + 1);
					if (code <= 56319 && next >= 56320 && next <= 57343) index += 1;
					else length += 5;
				}
			}
			return length;
		};
		jsonByteLength = (value) => {
			let bytes = 0;
			for (const part of jsonParts(value)) bytes += Buffer.byteLength(part, "utf8");
			return bytes;
		};
		jsonTextCodeUnits = (value) => {
			let length = 0;
			for (const part of jsonParts(value)) length += part.length;
			return length;
		};
		equalJsonText = (left, right) => {
			const a = jsonParts(left);
			const b = jsonParts(right);
			let x = a.next();
			let y = b.next();
			let i = 0;
			let j = 0;
			try {
				while (!x.done && !y.done) {
					const length = Math.min(x.value.length - i, y.value.length - j);
					if (x.value.slice(i, i + length) !== y.value.slice(j, j + length)) return false;
					i += length;
					j += length;
					if (i === x.value.length) {
						x = a.next();
						i = 0;
					}
					if (j === y.value.length) {
						y = b.next();
						j = 0;
					}
				}
				return x.done === true && y.done === true;
			} finally {
				a.return(undefined);
				b.return(undefined);
			}
		};
		PART_CHARACTERS = 16 * 1024;
		indentation = [];
		indent = (depth) => indentation[depth] ??= `\n${"  ".repeat(depth)}`;
		scalarText = (value) => {
			if (typeof value === "string") return value.length <= 8192 ? JSON.stringify(value) : undefined;
			if (value === null) return "null";
			if (typeof value === "boolean") return String(value);
			if (typeof value === "number" && Number.isFinite(value)) return String(value);
			return undefined;
		};
		openContainer = (value, depth, ancestors, canonical) => {
			if (typeof value !== "object" || value === null) throw new TypeError("JSON output requires ordinary JSON values");
			if (ancestors.has(value)) throw new TypeError("JSON output contains a circular reference");
			const array = Array.isArray(value);
			if (!array && Object.prototype.toString.call(value) !== "[object Object]") throw new TypeError("JSON output requires ordinary JSON objects");
			ancestors.add(value);
			const keys = array ? undefined : Object.keys(value);
			if (canonical) keys?.sort();
			const count = array ? value.length : keys?.length ?? 0;
			return {
				value,
				array,
				keys,
				count,
				depth,
				index: 0,
				written: 0
			};
		};
		nextMember = (frame) => {
			while (frame.index < frame.count) {
				const index = frame.index;
				frame.index += 1;
				if (frame.array) return {
					key: undefined,
					item: Reflect.get(frame.value, index)
				};
				const key = frame.keys?.[index];
				if (key === undefined) throw new TypeError("JSON object changed during serialization");
				const item = Reflect.get(frame.value, key);
				if (item !== undefined && typeof item !== "function" && typeof item !== "symbol") return {
					key,
					item
				};
			}
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/cli/cliOutputFormatter.js
function* outputValues(value) {
	if (Array.isArray(value)) {
		yield* value;
		return;
	}
	for (const key of Object.keys(value)) {
		yield key;
		yield value[key];
	}
}
/** Stream a page after its rows and cells have been validated and snapshotted. */
function* formatDelimitedOutputParts({ encodedHeaders, rows, metadata, delimiter, lineEnding, format }) {
	yield `# rea-delimited-v1 ${JSON.stringify(metadata)}${lineEnding}`;
	yield `${encodedHeaders.join(delimiter)}${lineEnding}`;
	for (const row of rows) yield `${row.map((value) => encodeDelimitedScalar(value, format)).join(delimiter)}${lineEnding}`;
}
var hasUnpairedSurrogate, containsUnpairedSurrogate, containsUnrepresentableMarkdown, containsText, formatCliOutput, prepareDelimitedOutput, delimitedOutputInputError, formatDelimitedRows, encodeDelimitedScalar, encodeDelimitedText, isSpreadsheetFormula, isPlainObjectArray, isScalar, isFlatObject, isObjectArray, isWordCharacter, escapeInlineSyntax, escapeTableCell, encodeMarkdownWhitespace, escapeMarkdownText, markdownHeading, encodeMarkdownTableCell, renderTable, markdownCell, formatKeyValueTable, formatObjectTable, formatMarkdown;
function init_cliOutputFormatter() {
	return (init_cliOutputFormatter = __esmMin((() => {
		init_analysisErrorCore();
		init_analysisErrorProjection();
		init_result();
		hasUnpairedSurrogate = (value) => /[\ud800-\udfff]/u.test(value);
		containsUnpairedSurrogate = (value) => {
			return containsText(value, hasUnpairedSurrogate);
		};
		containsUnrepresentableMarkdown = (value) => containsText(value, (text) => text.includes("\0") || hasUnpairedSurrogate(text));
		containsText = (value, predicate) => {
			const pending = [[value][Symbol.iterator]()];
			const seen = new WeakSet();
			while (pending.length > 0) {
				const next = pending.at(-1).next();
				if (next.done === true) {
					pending.pop();
					continue;
				}
				const current = next.value;
				if (typeof current === "string") {
					if (predicate(current)) return true;
					continue;
				}
				if (typeof current !== "object" || current === null || seen.has(current)) continue;
				seen.add(current);
				pending.push(outputValues(current));
			}
			return false;
		};
		formatCliOutput = (value, format, delimited) => {
			if (format === "csv" || format === "tsv") {
				const prepared = prepareDelimitedOutput(value, format, delimited ?? {
					fields: [],
					metadata: {}
				});
				return prepared.ok ? [...formatDelimitedOutputParts(prepared.value)].join("") : Formatter.format(projectAnalysisError(prepared.error), "json");
			}
			return format === "md" ? formatMarkdown(value) : Formatter.format(value, format);
		};
		prepareDelimitedOutput = (rows, format, { fields, metadata }) => {
			const operation = typeof metadata.command === "string" ? metadata.command : "render-cli-delimited-output";
			if (!isPlainObjectArray(rows)) return err(delimitedOutputInputError(["--filter-output"], Array.isArray(rows) ? "CSV/TSV output requires every selected row to be a plain object." : "The selected output path does not contain a row array.", operation));
			if (fields.length === 0) return err(delimitedOutputInputError(["--columns"], "CSV/TSV output requires at least one explicitly selected field.", operation));
			const encodedHeaders = [];
			for (const field of fields) {
				if (hasUnpairedSurrogate(field)) return err(delimitedOutputInputError(["--columns"], "CSV/TSV cannot preserve unpaired UTF-16 surrogates in UTF-8 output; use JSON.", operation));
				if (isSpreadsheetFormula(field)) return err(delimitedOutputInputError(["--columns", field], "CSV/TSV output refuses spreadsheet formula-leading text; JSON retains the exact value.", operation));
				encodedHeaders.push(encodeDelimitedText(field, format));
			}
			const preparedRows = [];
			for (const record of rows) {
				const preparedRow = [];
				for (const field of fields) {
					const value = Object.hasOwn(record, field) ? record[field] : undefined;
					if (value !== null && value !== undefined && typeof value !== "string" && typeof value !== "boolean" && !(typeof value === "number" && Number.isFinite(value))) return err(delimitedOutputInputError(["--columns", field], "CSV/TSV cells must be scalar values; nested objects and arrays are not flattened.", operation));
					if (typeof value === "string" && isSpreadsheetFormula(value)) return err(delimitedOutputInputError(["--columns", field], "CSV/TSV output refuses spreadsheet formula-leading text; JSON retains the exact value.", operation));
					if (typeof value === "string" && hasUnpairedSurrogate(value)) return err(delimitedOutputInputError(["--columns", field], "CSV/TSV cannot preserve unpaired UTF-16 surrogates in UTF-8 output; use JSON.", operation));
					preparedRow.push(value);
				}
				preparedRows.push(preparedRow);
			}
			return ok({
				encodedHeaders,
				rows: preparedRows,
				metadata,
				delimiter: format === "csv" ? "," : "	",
				lineEnding: format === "csv" ? "\r\n" : "\n",
				format
			});
		};
		delimitedOutputInputError = (path, message, operation = "render-cli-delimited-output") => new AnalysisInputError(operation, { userMessage: message }, [{
			path,
			reason: "invalid_value",
			message
		}]);
		formatDelimitedRows = (rows, format, options) => {
			const prepared = prepareDelimitedOutput(rows, format, options);
			return prepared.ok ? ok([...formatDelimitedOutputParts(prepared.value)].join("")) : prepared;
		};
		encodeDelimitedScalar = (value, format) => {
			if (value === null || value === undefined) return "";
			const text = String(value);
			return encodeDelimitedText(text, format);
		};
		encodeDelimitedText = (text, format) => {
			const needsQuotes = format === "csv" ? /[",\r\n]/u.test(text) : /["\t\r\n]/u.test(text);
			return needsQuotes ? `"${text.replace(/"/gu, "\"\"")}"` : text;
		};
		isSpreadsheetFormula = (value) => /^[\u0000-\u0020]*[=+\-@]/u.test(value) || /^[\t\r]/u.test(value);
		isPlainObjectArray = (value) => Array.isArray(value) && value.every((row) => typeof row === "object" && row !== null && !Array.isArray(row) && (Object.getPrototypeOf(row) === Object.prototype || Object.getPrototypeOf(row) === null));
		isScalar = (value) => value === null || value === undefined || typeof value !== "object";
		isFlatObject = (value) => Object.values(value).every(isScalar);
		isObjectArray = (value) => Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "object" && item !== null && !Array.isArray(item)) && value.some((item) => Object.keys(item).length > 0);
		isWordCharacter = (character) => character !== undefined && /[\p{L}\p{N}]/u.test(character);
		escapeInlineSyntax = (match, offset, text) => match.startsWith("_") && isWordCharacter(text[offset - 1]) && isWordCharacter(text[offset + match.length]) ? match : match.replace(/./g, "\\$&");
		escapeTableCell = (value) => value.replace(/\u0000|[\ud800-\udfff]/gu, (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`).replace(/[\\|`*[\]~{}#]|_+/g, escapeInlineSyntax).replace(/[&<>:]|;(?=-?[)(])/g, (character) => {
			switch (character) {
				case "&": return "&amp;";
				case "<": return "&lt;";
				case ">": return "&gt;";
				case ":": return "&#58;";
				default: return "&#59;";
			}
		}).replace(/([xXB8]-)\)/g, "$1&#41;").replace(/\r\n|\r|\n/g, "<br>");
		encodeMarkdownWhitespace = (whitespace) => whitespace.replace(/ /g, "&#32;").replace(/\t/g, "&#9;");
		escapeMarkdownText = (value) => escapeTableCell(value).replace(/^(\s*)([-+=])/, "$1\\$2").replace(/^(\s*\d{1,9})([.)])(?=\s|$)/, "$1\\$2").replace(/^[ \t]+/, encodeMarkdownWhitespace).replace(/[ \t]+$/u, encodeMarkdownWhitespace);
		markdownHeading = (path) => `## ${escapeMarkdownText(path.join("."))}\n\n`;
		encodeMarkdownTableCell = (value) => escapeTableCell(value).replace(/^[ \t]+|[ \t]+$/g, (whitespace) => encodeMarkdownWhitespace(whitespace));
		renderTable = (headers, rows) => {
			if (headers.length === 0) return "";
			const escapedHeaders = headers.map(encodeMarkdownTableCell);
			const widths = escapedHeaders.map((header) => header.length);
			for (const row of rows) {
				for (let index = 0; index < escapedHeaders.length; index += 1) {
					const width = encodeMarkdownTableCell(row[index] ?? "").length;
					if (width > widths[index]) widths[index] = width;
				}
			}
			const pad = (value, index) => value.padEnd(widths[index]);
			const lines = [`| ${escapedHeaders.map(pad).join(" | ")} |`, `|${widths.map((width) => "-".repeat(width + 2)).join("|")}|`];
			for (const row of rows) {
				lines.push(`| ${escapedHeaders.map((_, index) => pad(encodeMarkdownTableCell(row[index] ?? ""), index)).join(" | ")} |`);
			}
			return lines.join("\n");
		};
		markdownCell = (value) => value !== null && typeof value === "object" ? JSON.stringify(value) : value === undefined ? "" : String(value);
		formatKeyValueTable = (value) => renderTable(["Key", "Value"], Object.entries(value).map(([key, child]) => [key, markdownCell(child)]));
		formatObjectTable = (items) => {
			const headers = [];
			const seen = new Set();
			for (const item of items) for (const key of Object.keys(item)) if (!seen.has(key)) {
				seen.add(key);
				headers.push(key);
			}
			if (headers.length === 0) return markdownCell(items);
			return renderTable(headers, items.map((item) => headers.map((key) => markdownCell(Object.hasOwn(item, key) ? item[key] : undefined))));
		};
		formatMarkdown = (value, path = []) => {
			if (value == null && path.length === 0) return "";
			if (isScalar(value)) {
				if (path.length === 0) return escapeMarkdownText(String(value));
				return `${markdownHeading(path)}${escapeMarkdownText(String(value))}`;
			}
			if (Array.isArray(value)) {
				if (isObjectArray(value)) {
					const table = formatObjectTable(value);
					return path.length === 0 ? table : `${markdownHeading(path)}${table}`;
				}
				return formatMarkdown(markdownCell(value), path);
			}
			const object = value;
			const entries = Object.entries(object);
			if (path.length === 0 && isFlatObject(object)) return formatKeyValueTable(object);
			const needsHeadings = path.length > 0 || entries.length > 1 || entries.some(([, child]) => !isScalar(child));
			if (!needsHeadings) return formatKeyValueTable(object);
			return entries.map(([key, child]) => {
				const childPath = [...path, key];
				const heading = markdownHeading(childPath);
				if (isScalar(child)) return `${heading}${escapeMarkdownText(String(child))}`;
				if (isObjectArray(child)) return `${heading}${formatObjectTable(child)}`;
				if (typeof child === "object" && child !== null && !Array.isArray(child)) {
					const nested = child;
					return isFlatObject(nested) ? `${heading}${formatKeyValueTable(nested)}` : formatMarkdown(nested, childPath);
				}
				return `${heading}${escapeMarkdownText(markdownCell(child))}`;
			}).join("\n\n");
		};
	})))();
}

//#endregion
//#region dist/cli/jsonOutput.js
/** The exact formatted document, including its final newline. */
function* jsonOutputParts(value, format, pretty = true) {
	if (format === "jsonl" && Array.isArray(value)) {
		for (const item of value) {
			yield* jsonParts(item);
			yield "\n";
		}
		return;
	}
	yield* jsonParts(value, pretty && format === "json");
	yield "\n";
}
var writeJsonOutput, writeOutputParts, isTerminalOutput, writeOutputText;
function init_jsonOutput() {
	return (init_jsonOutput = __esmMin((() => {
		init_jsonSerialization();
		writeJsonOutput = async (value, destination, format = "json") => {
			await writeOutputParts(destination, jsonOutputParts(value, format, isTerminalOutput(destination)));
		};
		writeOutputParts = async (destination, parts) => {
			for (const part of bufferedJsonParts(parts)) await writeOutputText(destination, part);
		};
		isTerminalOutput = (destination) => "isTTY" in destination && destination.isTTY === true;
		writeOutputText = (destination, part) => new Promise((resolve, reject) => {
			const onError = (cause) => reject(cause);
			destination.once("error", onError);
			try {
				destination.write(part, (cause) => {
					if (cause) {
						setImmediate(() => destination.off("error", onError));
						reject(cause);
					} else {
						destination.off("error", onError);
						resolve();
					}
				});
			} catch (cause) {
				destination.off("error", onError);
				reject(cause);
			}
		});
	})))();
}

//#endregion
//#region dist/cli/jsonLines.js
function* jsonLinesParts(plan) {
	for (const record of jsonLinesRecords(plan)) {
		yield* jsonLineParts(record);
	}
}
/** One record stays one line even when the record itself is an array. */
function* jsonLineParts(record) {
	yield* jsonParts(record);
	yield "\n";
}
/** Newline-separated records also bound the token estimator's working set. */
function* jsonLinesRecords(plan) {
	yield* plan.records;
	if (plan.context !== undefined || plan.path.length > 0) {
		const metadata = {
			$rea: JSON_LINES_PROTOCOL,
			type: "metadata",
			records: {
				path: plan.path,
				emitted: plan.records.length,
				source: plan.sourceRecords,
				...plan.filter === undefined ? {} : { filter: plan.filter }
			},
			context: plan.context ?? null
		};
		yield metadata;
	}
}
var JSON_LINES_PROTOCOL, COLLECTION_KEYS, RECORD_BOUNDARIES, RECORD_BOUNDARY_PATHS, JSON_LINES_SELECTION_REMEDIATION, isRecord, atPath, examineBoundaries, shapeOf, observe, describe, selectionPaths, withoutRecords, selectCollection, prepareJsonLines, jsonLinesErrorRecord;
function init_jsonLines() {
	return (init_jsonLines = __esmMin((() => {
		init_result();
		init_analysisErrorCore();
		init_jsonSerialization();
		JSON_LINES_PROTOCOL = "jsonl/v1";
		COLLECTION_KEYS = [
			"rows",
			"items",
			"records",
			"occurrences"
		];
		RECORD_BOUNDARIES = "JSON Lines needs a top-level array, or exactly one rows, items, records, or occurrences array directly in the result, under page, or under normalized_result.";
		RECORD_BOUNDARY_PATHS = [
			[],
			["page"],
			["normalized_result"],
			["normalized_result", "page"]
		];
		JSON_LINES_SELECTION_REMEDIATION = "Use --format json for the complete document, or select one record collection with --filter-output.";
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		atPath = (value, path) => {
			for (const key of path) {
				if (!isRecord(value) || !Object.hasOwn(value, key)) return undefined;
				value = value[key];
			}
			return value;
		};
		examineBoundaries = (value, fullOutput) => {
			const prefix = fullOutput ? ["data"] : [];
			const data = atPath(value, prefix);
			const found = [];
			const rejected = [];
			for (const boundary of RECORD_BOUNDARY_PATHS) {
				const object = atPath(data, boundary);
				const path = [...prefix, ...boundary];
				if (Array.isArray(object) && boundary.at(-1) !== "page") found.push({
					records: object,
					path
				});
				if (!isRecord(object)) continue;
				for (const key of COLLECTION_KEYS) {
					if (!Object.hasOwn(object, key)) continue;
					const records = object[key];
					if (Array.isArray(records)) found.push({
						records,
						path: [...path, key]
					});
					else rejected.push(observe([...path, key], records));
				}
			}
			return {
				found,
				rejected
			};
		};
		shapeOf = (value) => {
			if (value === null) return "null";
			if (Array.isArray(value)) return "array";
			switch (typeof value) {
				case "object": return "object";
				case "string": return "string";
				case "boolean": return "boolean";
				case "number":
				case "bigint": return "number";
				default: return "absent";
			}
		};
		observe = (path, value) => ({
			path,
			shape: shapeOf(value)
		});
		describe = ({ path, shape }) => `${path.length === 0 ? "the result" : path.join(".")} is ${shape === "absent" || shape === "null" ? shape : shape === "array" || shape === "object" ? `an ${shape}` : `a ${shape}`}`;
		selectionPaths = (paths) => {
			const selected = new Map();
			for (const path of paths ?? []) {
				const keys = [];
				for (const segment of path) {
					if (!("key" in segment)) break;
					keys.push(segment.key);
				}
				selected.set(JSON.stringify(keys), keys);
			}
			return [...selected.values()];
		};
		withoutRecords = (source, selected, path, filtered) => {
			if (path.length === 0 || !isRecord(source)) return undefined;
			const context = { ...source };
			const selectedObject = isRecord(selected) ? selected : undefined;
			if (filtered && Object.hasOwn(source, "evidence_id") && typeof source.evidence_id === "string" && Object.hasOwn(source, "normalized_result")) {
				if (selectedObject && Object.hasOwn(selectedObject, "raw_result")) context.raw_result = selectedObject.raw_result;
				else delete context.raw_result;
			}
			const [key, ...rest] = path;
			if (key === undefined) return context;
			if (rest.length === 0) delete context[key];
			else context[key] = withoutRecords(source[key], selectedObject?.[key], rest, filtered);
			return context;
		};
		selectCollection = (selected, source, options, { found, rejected }) => {
			const prefix = options.fullOutput === true ? ["data"] : [];
			const filtered = options.filter !== undefined;
			const selections = selectionPaths(options.filterPaths).filter((path) => path.length > 0);
			const subject = filtered && selections.length > 0 ? `The --filter-output selection ${selections.map((path) => path.join(".")).join(", ")}` : "The command result";
			const refuse = (statement, observed, rule) => {
				const observation = `${subject} ${statement}: ${observed.map(describe).join("; ")}.`;
				return err(new AnalysisInputError(options.command, {
					userMessage: `${observation} ${rule}`,
					remediationAction: JSON_LINES_SELECTION_REMEDIATION
				}, [{
					path: [filtered ? "filter-output" : "format"],
					reason: "invalid_value",
					message: observation,
					observed: observed.map(({ path, shape }) => ({
						path: [...path],
						shape
					}))
				}]));
			};
			if (found.length > 1) return refuse("is not one JSON Lines record collection", found.map(({ path }) => observe(path, [])), "Select one with --filter-output.");
			const [collection] = found;
			if (collection === undefined) {
				const [selection] = selections;
				const observed = rejected.length > 0 ? rejected : [selections.length === 1 && selection !== undefined ? observe([...prefix, ...selection], atPath(atPath(source, prefix), selection)) : observe(prefix, atPath(selected, prefix))];
				return refuse("is not a JSON Lines record collection", observed, RECORD_BOUNDARIES);
			}
			for (const [index, record] of collection.records.entries()) {
				if (isRecord(record) && Object.hasOwn(record, "$rea")) return refuse("uses the field JSON Lines reserves for control records", [observe([
					...collection.path,
					index,
					"$rea"
				], record.$rea)], "Nested $rea values are ordinary data.");
			}
			return ok(collection);
		};
		prepareJsonLines = (selected, options) => {
			const fullOutput = options.fullOutput === true;
			const examination = examineBoundaries(selected, fullOutput);
			const source = Object.hasOwn(options, "source") ? options.source : selected;
			const chosen = selectCollection(selected, source, options, examination);
			if (!chosen.ok) return chosen;
			const collection = chosen.value;
			const originalRecords = atPath(source, collection.path);
			const sourceMatches = Array.isArray(originalRecords);
			let context = withoutRecords(sourceMatches ? source : selected, selected, collection.path, options.filter !== undefined);
			if (options.filter !== undefined && sourceMatches) {
				for (const peer of examineBoundaries(source, fullOutput).found) {
					if (peer.path.join(".") !== collection.path.join(".")) context = withoutRecords(context, selected, peer.path, true);
				}
			}
			return ok({
				...collection,
				context,
				sourceRecords: sourceMatches ? originalRecords.length : null,
				filter: options.filter
			});
		};
		jsonLinesErrorRecord = (result) => ({
			$rea: JSON_LINES_PROTOCOL,
			type: "error",
			ok: false,
			result
		});
	})))();
}

//#endregion
export { APPLE_BUNDLE_EXTENSION, AnalysisSnapshotMismatchError, ArtifactOperationError, BinaryTargetError, BrowserObservationError, ConfigurationError, DEBUGGER_CONTROL_REPLY_BYTES, DEFAULT_ASAR_MAX_HEADER_BYTES, DEFAULT_DEBUGGER_COMMAND_DEADLINE_MS, DEFAULT_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES, DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS, DEFAULT_HOPPER_CALLER_SCAN_BUDGET_MS, DEFAULT_HOPPER_DEMO_DIALOG_TIMEOUT_MS, DEFAULT_HOPPER_STARTUP_TIMEOUT_MS, DEFAULT_JADX_OPERATION_TIMEOUT_MS, DEFAULT_NATIVE_MATCHING_REPRESENTATION_BYTES, DEFAULT_REGEX_MATCHING_DEADLINE_MS, EvidenceFileError, EvidenceIntegrityError, EvidenceReferenceError, HOPPER_DEMO_DIALOG_TIMEOUT_SETTING, HopperCancelledError, HopperProcessError, HopperProtocolError, HopperRemoteError, HopperStartError, HopperTimeoutError, MAXIMUM_ASAR_MAX_HEADER_BYTES, MAXIMUM_CAPTURE_DECODER_OLD_GENERATION_MIB, MAXIMUM_DEBUGGER_COMMAND_DEADLINE_MS, MAXIMUM_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES, MAXIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS, MAXIMUM_NATIVE_MATCHING_REPRESENTATION_BYTES, MAXIMUM_REGEX_MATCHING_DEADLINE_MS, MAXIMUM_REGEX_WORKER_HEAP_REQUEST_MIB, MAX_GHIDRA_DECOMPILE_TIMEOUT_SECONDS, MAX_NODE_TIMER_DELAY_MS, NoBinaryOpenError, OPENABLE_APPLE_BUNDLE_TYPES_TEXT, PROVIDER_FAILURE_STAGES, PROVIDER_OPERATION_STATES, PROVIDER_RETRY_ACTIONS, ProviderAdapterError, ProviderSelectionError, ResourceSnapshotMismatchError, UnknownRegistryError, analysisErrorRemediationAction, analysisErrorUserMessage, analysisSettingIdSchema, analysisSettingIds, analysisSettingLimit, analysisSettingValueSchema, browserCleanupObservation, bufferedJsonParts, canonicalJsonParts, childFailureDiagnostics, composedCallerGuidance, containsUnpairedSurrogate, containsUnrepresentableMarkdown, delimitedOutputInputError, encodeMarkdownTableCell, equalJsonText, err, formatCliOutput, formatDelimitedOutputParts, hasUnpairedSurrogate, hopperCancelledBySignal, hopperStartupExitCode, hopperStartupFailure, init_analysisErrorPresentation, init_analysisErrorProjection, init_analysisResourceLimits, init_analysisSettingDefinitions, init_appleBundleTypes, init_artifactOperationError, init_browserObservationError, init_cliOutputFormatter, init_configurationErrors, init_evidenceErrors, init_hopperErrors, init_hopperStartupFailure, init_jsonLines, init_jsonOutput, init_jsonSerialization, init_providerAdapterError, init_providerOperationHealth, init_providerSelectionError, init_result, init_unknownRegistryError, isHopperStartupFailureCode, isTerminalOutput, isUnopenedAppleBundleExtension, jsonByteLength, jsonLineParts, jsonLinesErrorRecord, jsonLinesParts, jsonLinesRecords, jsonOutputParts, jsonParts, jsonStringCodeUnits, jsonTextCodeUnits, ok, openableAppleBundleExtension, prepareDelimitedOutput, prepareJsonLines, projectAnalysisError, projectAnalysisErrorWithoutCapturedOutput, providerRetryAction, sharedProviderFailureStage, writeJsonOutput, writeOutputParts, writeOutputText };