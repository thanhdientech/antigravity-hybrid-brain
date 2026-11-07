import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { i as resolvedAnalysisError, n as init_analysisErrorBase, r as primaryAnalysisError, t as AnalysisError } from "./analysisErrorBase-DIqf4-vY.js";
import { i as init_configurationErrors, n as ConfigurationError, r as NoBinaryOpenError, t as BinaryTargetError } from "./configurationErrors-Dc_G1uM0.js";
import { a as AnalysisCapabilityUnavailableError, d as AnalysisUnsupportedTargetError, f as init_analysisErrorCore, i as AnalysisCancelledError, l as AnalysisResourceConstraintError, n as AnalysisAccessDeniedError, o as AnalysisInputError, r as AnalysisArtifactChangedError, s as AnalysisOutputError, u as AnalysisTimeoutError } from "./analysisErrorCore-BCqhUcUc.js";
import { _ as init_localPath, g as absoluteLocalPathStringSchema, h as isImmutableJsonSnapshot, i as jsonValueSchema, m as init_immutableJson, n as init_jsonValue } from "./jsonValue-CbQQraup.js";
import { a as UnknownRegistryError, c as EvidenceFileError, d as ResourceSnapshotMismatchError, f as init_evidenceErrors, h as init_residualUnknownGraphError, l as EvidenceIntegrityError, m as describeResidualUnknownGraphConstraint, o as init_unknownRegistryError, s as AnalysisSnapshotMismatchError, u as EvidenceReferenceError } from "./digests-Ct-nksBF.js";
import { z } from "zod";
import { createHash } from "node:crypto";

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
//#region dist/domain/safeJson.js
var safeParseUtf8Json, safeParseJson;
function init_safeJson() {
	return (init_safeJson = __esmMin((() => {
		safeParseUtf8Json = (bytes) => {
			let text;
			try {
				text = new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(bytes);
			} catch (cause) {
				return {
					ok: false,
					error: cause instanceof Error ? cause.message : String(cause),
					cause
				};
			}
			return safeParseJson(text);
		};
		safeParseJson = (value, reviver) => {
			try {
				return {
					ok: true,
					value: JSON.parse(value, reviver)
				};
			} catch (cause) {
				return {
					ok: false,
					error: cause instanceof Error ? cause.message : String(cause),
					cause
				};
			}
		};
	})))();
}

//#endregion
//#region dist/domain/fixedAllowanceRemediation.js
var unchangedRequest, fixedAllowanceRemediation, fixedAllowanceOptions, fixedProducerInputAllowance;
function init_fixedAllowanceRemediation() {
	return (init_fixedAllowanceRemediation = __esmMin((() => {
		unchangedRequest = "Repeating the unchanged request fails the same way.";
		fixedAllowanceRemediation = (allowance, kind) => {
			switch (kind) {
				case "parser": return `${allowance} is a fixed allowance. Worker memory limits, inherited limits, and additional host memory do not raise it. Select another complete input within the allowance when that preserves the needed observation. ${unchangedRequest}`;
				case "count": return `${allowance} is a fixed count. Waiting for an active analysis to finish does not raise it. ${unchangedRequest}`;
				case "bytes": return `${allowance} is a fixed byte allowance. Waiting for an active analysis to finish does not raise it. ${unchangedRequest}`;
				case "report": return `${allowance} is a fixed report allowance. This refusal does not leave a completed report or Evidence record to retrieve, and complete CLI JSON does not raise it. ${unchangedRequest}`;
				case "input": return `Select a suitable complete artifact within ${allowance}. Increasing an evidence-reply file-size allowance does not admit this input. Do not truncate required bytes. ${unchangedRequest}`;
				case "capture": return `${allowance} is a fixed capture allowance. Worker memory limits, inherited limits, and additional host memory do not raise it. ${unchangedRequest}`;
				case "live": return `${allowance} is a fixed capture allowance. Worker memory limits, inherited limits, and additional host memory do not raise it. Capturing the same output exceeds the allowance again; live output may change between requests.`;
				case "work": return `${allowance} is a fixed work allowance. Worker CPU limits and additional CPU time do not raise it. Select another complete artifact within the allowance. ${unchangedRequest}`;
			}
		};
		fixedAllowanceOptions = (allowance, kind) => ({
			retryable: false,
			fixedAllowance: {
				name: allowance,
				kind
			}
		});
		fixedProducerInputAllowance = (bytes, allowance) => fixedAllowanceOptions(`${allowance} of ${String(bytes)} bytes (this release has no runtime override)`, "input");
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
//#region dist/domain/artifactIntegrity.js
var sha256, md5, crc32, artifactIntegrityClaimSchema, artifactSha256PairSchema, artifactMd5PairSchema, artifactDfuCrc32PairSchema, artifactIntegrityPair, artifactIntegrityPairOf, artifactIntegrityDetails, artifactContainerIntegrityDetails, projectedDigests, projectArtifactIntegrityDetails;
function init_artifactIntegrity() {
	return (init_artifactIntegrity = __esmMin((() => {
		sha256 = z.string().regex(/^[a-f0-9]{64}$/u);
		md5 = z.string().regex(/^[a-f0-9]{32}$/u);
		crc32 = z.string().regex(/^[a-f0-9]{8}$/u);
		artifactIntegrityClaimSchema = z.discriminatedUnion("algorithm", [z.strictObject({
			algorithm: z.literal("sha256"),
			digest: sha256
		}), z.strictObject({
			algorithm: z.literal("md5"),
			digest: md5
		})]);
		artifactSha256PairSchema = z.object({
			declared_sha256: sha256,
			observed_sha256: sha256
		});
		artifactMd5PairSchema = z.object({
			algorithm: z.literal("md5"),
			declared_md5: md5,
			observed_md5: md5
		});
		artifactDfuCrc32PairSchema = z.object({
			algorithm: z.literal("dfu-crc32"),
			declared_crc32: crc32,
			observed_crc32: crc32
		});
		artifactIntegrityPair = (claim, observed) => claim.algorithm === "sha256" ? {
			declared_sha256: claim.digest,
			observed_sha256: observed
		} : {
			algorithm: "md5",
			declared_md5: claim.digest,
			observed_md5: observed
		};
		artifactIntegrityPairOf = (pair) => {
			if ("declared_sha256" in pair) return {
				declared_sha256: pair.declared_sha256,
				observed_sha256: pair.observed_sha256
			};
			return pair.algorithm === "md5" ? {
				algorithm: pair.algorithm,
				declared_md5: pair.declared_md5,
				observed_md5: pair.observed_md5
			} : {
				algorithm: pair.algorithm,
				declared_crc32: pair.declared_crc32,
				observed_crc32: pair.observed_crc32
			};
		};
		artifactIntegrityDetails = (logicalPath, claim, observed, unpacked) => ({
			logicalPath,
			unpacked,
			...claim?.algorithm === "md5" ? {
				algorithm: "md5",
				declaredMd5: claim.digest,
				calculatedMd5: observed
			} : {
				declaredSha256: claim?.digest ?? null,
				calculatedSha256: observed
			}
		});
		artifactContainerIntegrityDetails = (logicalPath, pair) => ({
			logicalPath,
			unpacked: false,
			algorithm: pair.algorithm,
			declaredCrc32: pair.declared_crc32,
			calculatedCrc32: pair.observed_crc32
		});
		projectedDigests = (details) => {
			if ("declaredSha256" in details) return {
				declared_sha256: details.declaredSha256,
				calculated_sha256: details.calculatedSha256
			};
			return details.algorithm === "md5" ? {
				algorithm: details.algorithm,
				declared_md5: details.declaredMd5,
				calculated_md5: details.calculatedMd5
			} : {
				algorithm: details.algorithm,
				declared_crc32: details.declaredCrc32,
				calculated_crc32: details.calculatedCrc32
			};
		};
		projectArtifactIntegrityDetails = (details) => ({
			logical_path: details.logicalPath,
			...projectedDigests(details),
			unpacked: details.unpacked
		});
	})))();
}

//#endregion
//#region dist/domain/analysisErrorRecovery.js
var analysisCleanupRetrySchema, cleanupRetryRecovery, cleanupRetryRemediation, analysisErrorRecoverySchema;
function init_analysisErrorRecovery() {
	return (init_analysisErrorRecovery = __esmMin((() => {
		analysisCleanupRetrySchema = z.object({ operation: z.literal("close_binary") }).strict();
		cleanupRetryRecovery = (retry) => ({
			kind: "retry_cleanup",
			operation: retry.operation
		});
		cleanupRetryRemediation = (retry) => `This connection retains that cleanup. Keep it open; after the reported condition settles or is resolved, call ${retry.operation} without snapshot_path and check its result. That call retries the retained cleanup without rerunning the failed analysis, preserves investigation Evidence and Unknown history, and can report cleanup_incomplete again.`;
		analysisErrorRecoverySchema = z.discriminatedUnion("kind", [
			z.object({
				kind: z.literal("inspect_input_contract"),
				operation: z.string().min(1)
			}).strict(),
			z.object({
				kind: z.literal("inspect_timeout_state"),
				operation: z.string().min(1),
				timeout_ms: z.number().int().positive()
			}).strict(),
			z.object({
				kind: z.literal("retry_cleanup"),
				operation: z.string().min(1)
			}).strict()
		]);
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
//#region dist/domain/javascript/javascriptAnalysisResourceControls.js
var JAVASCRIPT_STATIC_FACT_BYTES, JAVASCRIPT_ANALYSIS_TRANSFER_RECORD_BYTES, JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS, JAVASCRIPT_WORKER_HEAP_MIB_MINIMUM, JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM, JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM, HEAP_DOES_NOT_RAISE, javaScriptWorkerHeapRemediation, JAVASCRIPT_PARENT_HEAP_NODE_OPTIONS, JAVASCRIPT_PARENT_RESULT_BUDGET_REMEDIATION, JAVASCRIPT_PARENT_CHECKPOINT_HEAP_REMEDIATION, javaScriptWorkerHeapExhaustionRecovery, semanticControl, semanticAdjustment, javaScriptSemanticCeilingCoverage, javaScriptAnalysisCoverageLimits, javaScriptAnalysisResourceControlsSchema;
function init_javascriptAnalysisResourceControls() {
	return (init_javascriptAnalysisResourceControls = __esmMin((() => {
		JAVASCRIPT_STATIC_FACT_BYTES = 8 * 1024 * 1024;
		JAVASCRIPT_ANALYSIS_TRANSFER_RECORD_BYTES = 8 * 1024 * 1024;
		JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS = {
			heapMb: 1024,
			timeoutMs: 3e5,
			semanticNodes: 1e5,
			semanticNodesPerFile: 2e4,
			semanticUnknowns: 1e5,
			semanticUnknownsPerFile: 2e4
		};
		JAVASCRIPT_WORKER_HEAP_MIB_MINIMUM = 128;
		JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM = 16384;
		JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM = 1e6;
		HEAP_DOES_NOT_RAISE = "Raising max_heap_mb does not raise the parent result budget, transfer record or transfer file byte ceilings, the CLI/MCP process heap, or fixed parser limits.";
		javaScriptWorkerHeapRemediation = (heapMb) => {
			const bounds = `an integer from ${String(128)} to ${String(JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM)} (default ${String(JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.heapMb)} MiB)`;
			const adjustment = heapMb >= 16384 ? `max_heap_mb is already ${String(heapMb)} MiB, the maximum ${String(JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM)}. Do not increase it further.` : `Increase max_heap_mb (CLI: rea analyze-javascript-application <input_path> --max-heap-mb <mebibytes>), ${bounds}.`;
			return `${adjustment} The effective worker heap for this analysis is ${String(heapMb)} MiB. A changed max_heap_mb applies on the next analysis, which starts a new worker. It does not change a worker that is already running, and it does not require restarting the REA server. ${HEAP_DOES_NOT_RAISE} On Bun, V8 heap flags are ignored: Windows limits the analyzer's committed memory to max_heap_mb plus a 512 MiB reserve, and other Bun hosts enforce no analyzer heap limit.`;
		};
		JAVASCRIPT_PARENT_HEAP_NODE_OPTIONS = "On Node, set NODE_OPTIONS (for example --max-old-space-size=<MiB>) in the environment that starts the CLI or MCP server, then restart that process,";
		JAVASCRIPT_PARENT_RESULT_BUDGET_REMEDIATION = `This limit belongs to the parent result budget. That budget follows the parent V8 heap limit. Increasing max_heap_mb does not raise it. ${JAVASCRIPT_PARENT_HEAP_NODE_OPTIONS} to raise the parent heap and this budget. Use the retained static facts or analyze fewer source files.`;
		JAVASCRIPT_PARENT_CHECKPOINT_HEAP_REMEDIATION = `This limit belongs to the parent process heap. Increasing max_heap_mb does not raise it. max_heap_mb changes only the isolated analyzer, on the next analysis, by starting a new worker. ${JAVASCRIPT_PARENT_HEAP_NODE_OPTIONS} to raise the parent heap and admit this checkpoint.`;
		javaScriptWorkerHeapExhaustionRecovery = (input) => {
			if (input.heapFlagsEnforced) return {
				reason: `Owned JavaScript worker exhausted its ${String(input.heapMb)} MiB V8 old-space heap (max_heap_mb) while analyzing ${input.path} during ${input.phase}`,
				remediationAction: javaScriptWorkerHeapRemediation(input.heapMb)
			};
			return {
				reason: `Owned JavaScript worker ran out of memory while analyzing ${input.path} during ${input.phase}. Bun ignores the V8 old-space flag, so this exit is not the configured max_heap_mb limit of ${String(input.heapMb)} MiB.`,
				remediationAction: "Bun ignores V8 heap flags, so raising max_heap_mb does not change this exit. Windows limits the analyzer's committed memory to max_heap_mb plus a 512 MiB reserve and reports that separately as a process memory limit. Other Bun hosts enforce no analyzer heap limit. Reduce the analysis instead of increasing max_heap_mb."
			};
		};
		semanticControl = {
			nodes: {
				total: "max_semantic_nodes",
				perFile: "max_semantic_nodes_per_file",
				ceiling: "semantic_graph_node_ceiling",
				fileCeiling: "semantic_graph_file_node_ceiling",
				totalDefault: JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.semanticNodes,
				perFileDefault: JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.semanticNodesPerFile,
				cliTotal: "--max-semantic-nodes",
				cliPerFile: "--max-semantic-nodes-per-file",
				doesNotRaise: "max_semantic_unknowns, max_heap_mb, transfer ceilings, or the parent result budget"
			},
			unknowns: {
				total: "max_semantic_unknowns",
				perFile: "max_semantic_unknowns_per_file",
				ceiling: "semantic_graph_unknown_ceiling",
				fileCeiling: "semantic_graph_file_unknown_ceiling",
				totalDefault: JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.semanticUnknowns,
				perFileDefault: JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.semanticUnknownsPerFile,
				cliTotal: "--max-semantic-unknowns",
				cliPerFile: "--max-semantic-unknowns-per-file",
				doesNotRaise: "max_semantic_nodes, max_heap_mb, transfer ceilings, or the parent result budget"
			}
		};
		semanticAdjustment = (name, value, fallback) => value >= 1e6 ? `${name} is already ${String(value)}, the maximum ${String(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM)}. Do not increase it further.` : `${name} is ${String(value)} (default ${String(fallback)}; an integer from 1 to ${String(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM)})`;
		javaScriptSemanticCeilingCoverage = (kind, total, perFile, reached) => {
			const control = semanticControl[kind];
			const limits = [
				{
					name: control.ceiling,
					value: total,
					unit: "items"
				},
				{
					name: control.fileCeiling,
					value: perFile,
					unit: "items"
				},
				{
					name: control.total,
					value: total,
					unit: "items"
				},
				{
					name: control.perFile,
					value: perFile,
					unit: "items"
				}
			];
			const reachedControls = [...reached.total ? [{
				name: control.total,
				value: total,
				fallback: control.totalDefault,
				cli: control.cliTotal
			}] : [], ...reached.perFile ? [{
				name: control.perFile,
				value: perFile,
				fallback: control.perFileDefault,
				cli: control.cliPerFile
			}] : []];
			if (reachedControls.length === 0) throw new RangeError("Semantic ceiling coverage requires a ceiling that stopped retention");
			const reachedText = reachedControls.map((item) => semanticAdjustment(item.name, item.value, item.fallback)).join(" and ");
			const names = reachedControls.map((item) => item.name).join(" and ");
			const cli = reachedControls.map((item) => item.cli).join(" and ");
			const raising = reachedControls.length === 1 ? "Raising it" : "Raising them";
			const limitation = `Semantic ${kind === "nodes" ? "node" : "unknown"} retention reached ${reachedText}. Set ${names} on the next analyze_javascript_application call (CLI: ${cli}). The change applies to that next analysis and does not restart the worker or the REA server. ${raising} does not raise ${control.doesNotRaise}. Coverage reports the same effective values as ${control.ceiling} and ${control.fileCeiling}.`;
			return {
				limits,
				limitation
			};
		};
		javaScriptAnalysisCoverageLimits = (limits) => {
			const result = [];
			for (const key of [
				"worker_heap_limit_bytes",
				"worker_process_memory_limit_bytes",
				"worker_timeout_ms",
				"parent_result_budget_bytes",
				"parent_available_result_budget_bytes",
				"semantic_result_budget_bytes",
				"transfer_record_bytes",
				"transfer_file_bytes"
			]) {
				const value = limits?.[key];
				if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) continue;
				result.push({
					name: `javascript_analysis_${key}`,
					value,
					unit: key.endsWith("_ms") ? "milliseconds" : "bytes"
				});
			}
			return result;
		};
		javaScriptAnalysisResourceControlsSchema = z.strictObject({
			max_semantic_nodes: z.number().int().min(1).max(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM).optional().describe("Maximum retained semantic nodes across the application; defaults to 100000. Worker heap and parent result admission remain enforced."),
			max_semantic_nodes_per_file: z.number().int().min(1).max(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM).optional().describe("Maximum retained semantic nodes per source file; defaults to 20000, additionally bounded by max_semantic_nodes and memory/transfer limits."),
			max_semantic_unknowns: z.number().int().min(1).max(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM).optional().describe("Maximum retained semantic unknown records across the application; defaults to 100000. Omitted emission occurrences are counted by family and reason."),
			max_semantic_unknowns_per_file: z.number().int().min(1).max(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM).optional().describe("Maximum retained semantic unknown records per source file; defaults to 20000, additionally bounded by max_semantic_unknowns and memory/transfer limits."),
			max_heap_mb: z.number().int().min(128).max(JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM).optional().describe("Maximum V8 old-space heap in MiB for the isolated JavaScript source analyzer; defaults to 1024. This does not change the CLI/MCP process heap. When REA runs on Bun, which ignores V8 heap flags, Windows instead limits the analyzer's committed memory to this budget plus a 512 MiB runtime reserve; other Bun hosts enforce no limit."),
			analysis_timeout_ms: z.number().int().min(1).max(2147483647).optional().describe("Maximum startup, analysis and transfer time per JavaScript source, in milliseconds; defaults to 300000. On timeout, return collected partial Evidence and stop the analysis.")
		});
	})))();
}

//#endregion
//#region dist/domain/wasm/wasmInterface.js
var kind, valueType, limit, signature, wasmInterfaceSchema, WASM_INTERFACE_REPRESENTATION_BYTES, wasmInterfaceEntryRepresentationBytes;
function init_wasmInterface() {
	return (init_wasmInterface = __esmMin((() => {
		kind = z.enum([
			"func",
			"table",
			"memory",
			"global",
			"tag",
			"unknown"
		]);
		valueType = z.enum([
			"i32",
			"i64",
			"f32",
			"f64",
			"v128",
			"funcref",
			"externref"
		]);
		limit = z.string().regex(/^(?:0|[1-9][0-9]*)$/u);
		signature = z.discriminatedUnion("kind", [
			z.object({
				kind: z.literal("func"),
				params: z.array(valueType),
				results: z.array(valueType)
			}),
			z.object({
				kind: z.literal("tag"),
				params: z.array(valueType),
				results: z.array(valueType)
			}),
			z.object({
				kind: z.literal("table"),
				element: z.enum(["funcref", "externref"]),
				address_type: z.enum(["i32", "i64"]),
				minimum: limit,
				maximum: limit.nullable(),
				shared: z.boolean()
			}),
			z.object({
				kind: z.literal("memory"),
				page_size: limit,
				address_type: z.enum(["i32", "i64"]),
				minimum: limit,
				maximum: limit.nullable(),
				shared: z.boolean()
			}),
			z.object({
				kind: z.literal("global"),
				value_type: valueType,
				mutable: z.boolean()
			})
		]);
		wasmInterfaceSchema = z.object({
			state: z.enum(["complete", "partial"]),
			entries: z.array(z.object({
				direction: z.enum(["import", "export"]),
				module: z.string().nullable(),
				name: z.string(),
				kind,
				index: z.int().nonnegative().max(4294967295).nullable(),
				signature: signature.nullable(),
				wat_form: z.string(),
				issue: z.string().nullable()
			}).superRefine((entry, context) => {
				if (entry.direction === "export" && entry.module !== null || entry.direction === "import" && entry.module === null) context.addIssue({
					code: "custom",
					message: "Interface direction does not match module-name presence"
				});
				if (entry.signature !== null && entry.signature.kind !== entry.kind) context.addIssue({
					code: "custom",
					message: "Interface kind does not match its typed signature"
				});
			})),
			issues: z.array(z.string())
		});
		WASM_INTERFACE_REPRESENTATION_BYTES = 32 * 1024 * 1024;
		wasmInterfaceEntryRepresentationBytes = (entry) => {
			let bytes = 1024 + [
				entry.module,
				entry.name,
				entry.wat_form,
				entry.issue
			].reduce((sum, value) => sum + (value?.length ?? 0) * 6, 0);
			const signature = entry.signature;
			if (signature?.kind === "func" || signature?.kind === "tag") bytes += (signature.params.length + signature.results.length) * 16;
			else if (signature !== null) {
				for (const value of Object.values(signature)) if (typeof value === "string") bytes += value.length * 6;
			}
			return bytes;
		};
	})))();
}

//#endregion
//#region dist/domain/wasm/wasmArtifact.js
var digest, artifact, DEFAULT_WASM_COMMAND_TIMEOUT_MS, MAX_WASM_COMMAND_TIMEOUT_MS, wasmArtifactPathsSchema, inspectWasmArtifactInputSchema, wasmArtifactSchema, wasmArtifactMatchesSubject;
function init_wasmArtifact() {
	return (init_wasmArtifact = __esmMin((() => {
		init_wasmInterface();
		init_localPath();
		digest = z.string().regex(/^[a-f0-9]{64}$/);
		artifact = z.strictObject({
			path: z.string().min(1),
			sha256: digest,
			bytes: z.int().nonnegative()
		});
		DEFAULT_WASM_COMMAND_TIMEOUT_MS = 3e4;
		MAX_WASM_COMMAND_TIMEOUT_MS = 2147483647;
		wasmArtifactPathsSchema = (pathSchema = absoluteLocalPathStringSchema) => z.array(pathSchema).max(16);
		inspectWasmArtifactInputSchema = z.strictObject({
			path: absoluteLocalPathStringSchema.describe("Absolute selected local WASM artifact path"),
			glue_paths: wasmArtifactPathsSchema().default([]),
			candidate_paths: wasmArtifactPathsSchema().default([]),
			command_timeout_ms: z.number().int().min(1).max(MAX_WASM_COMMAND_TIMEOUT_MS).exactOptional().describe(`Deadline in milliseconds for each WABT version/analysis command (default ${String(DEFAULT_WASM_COMMAND_TIMEOUT_MS)}), not the whole inspection. Allow additional client time for all commands, file checks and cleanup. Input/output safety limits remain fixed.`)
		});
		wasmArtifactSchema = z.strictObject({
			artifact,
			validation: z.literal("valid"),
			sections: z.array(z.strictObject({
				kind: z.string().min(1),
				start: z.int().nonnegative(),
				end: z.int().nonnegative(),
				bytes: z.int().nonnegative(),
				description: z.string()
			})),
			interface: wasmInterfaceSchema.exactOptional(),
			imports: z.array(z.string()),
			exports: z.array(z.string()),
			debug_name_metadata: z.enum([
				"unknown",
				"not-present",
				"complete",
				"uninterpretable"
			]).default("unknown"),
			custom_section_warnings: z.array(z.strictObject({
				tool: z.enum([
					"wasm-validate",
					"wasm-objdump",
					"wasm2wat"
				]),
				text: z.string().min(1)
			})).nullable().default(null),
			headers: z.string(),
			details: z.string(),
			wat: z.strictObject({
				text: z.string().min(1),
				sha256: digest,
				representation: z.literal("decoded-wat")
			}),
			tool_profile: z.strictObject({
				source: z.literal("https://github.com/WebAssembly/wabt"),
				release: z.literal("1.0.42"),
				source_commit: z.literal("ff0ef7e0009402740c805a9744c09b05be063e48"),
				commands: z.array(z.strictObject({
					tool: z.enum([
						"wasm-validate",
						"wasm-objdump",
						"wasm2wat"
					]),
					path: z.string().min(1),
					sha256: digest,
					version_banner: z.string(),
					arguments: z.array(z.string())
				})).length(3),
				timeout_ms: z.int().positive(),
				output_budget_bytes: z.int().positive()
			}),
			candidates: z.array(artifact),
			glue: z.array(z.strictObject({
				artifact,
				parse_status: z.enum([
					"complete",
					"partial",
					"failed"
				]),
				references: z.array(z.strictObject({
					value: z.string(),
					line: z.int().positive(),
					column: z.int().nonnegative(),
					candidate_paths: z.array(z.string()),
					association: z.enum([
						"local-path-candidate",
						"basename-candidates",
						"unresolved"
					]),
					evidence_kind: z.literal("static-literal")
				}))
			})),
			runtime_execution: z.literal("not-performed"),
			network_fetch: z.literal("not-performed"),
			limitations: z.array(z.string())
		}).superRefine((value, context) => {
			if (createHash("sha256").update(value.wat.text, "utf8").digest("hex") !== value.wat.sha256) context.addIssue({
				code: "custom",
				path: ["wat", "sha256"],
				message: "Decoded WAT digest does not match its UTF-8 text."
			});
			const selected = value.candidates[0];
			if (selected?.path !== value.artifact.path || selected.sha256 !== value.artifact.sha256 || selected.bytes !== value.artifact.bytes) context.addIssue({
				code: "custom",
				path: ["candidates"],
				message: "Selected candidate does not match artifact identity."
			});
			const tolerantCustomSections = value.tool_profile.commands[0]?.arguments.includes("--ignore-custom-section-errors");
			for (const [index, command] of value.tool_profile.commands.entries()) {
				const expected = [
					"wasm-validate",
					"wasm-objdump",
					"wasm2wat"
				][index];
				const argumentsExpected = command.tool === "wasm-objdump" ? [
					"-h",
					"-x",
					"module.wasm"
				] : tolerantCustomSections ? [
					"--enable-all",
					"--ignore-custom-section-errors",
					"module.wasm"
				] : ["--enable-all", "module.wasm"];
				if (command.tool !== expected || command.version_banner.trim() !== "1.0.42" || JSON.stringify(command.arguments) !== JSON.stringify(argumentsExpected)) context.addIssue({
					code: "custom",
					path: [
						"tool_profile",
						"commands",
						index
					],
					message: "Unexpected WABT command profile."
				});
			}
			for (const [index, section] of value.sections.entries()) if (section.end > value.artifact.bytes || section.end - section.start !== section.bytes) context.addIssue({
				code: "custom",
				path: ["sections", index],
				message: "Section range does not match selected artifact bytes."
			});
		});
		wasmArtifactMatchesSubject = (artifact, subject) => subject != null && subject.sha256 === artifact.sha256 && subject.format === "file";
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
export { BrowserObservationError as $, DEFAULT_REGEX_MATCHING_DEADLINE_MS as $t, javaScriptAnalysisCoverageLimits as A, DEFAULT_HOPPER_DEMO_DIALOG_TIMEOUT_MS as At, analysisErrorUserMessage as B, init_fixedAllowanceRemediation as Bt, JAVASCRIPT_PARENT_CHECKPOINT_HEAP_REMEDIATION as C, HopperProcessError as Ct, JAVASCRIPT_STATIC_FACT_BYTES as D, HopperTimeoutError as Dt, JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM as E, HopperStartError as Et, MCP_TRANSPORT_EVIDENCE_DISCOVERY as F, init_hopperStartupFailure as Ft, PROVIDER_RETRY_ACTIONS as G, DEFAULT_ASAR_MAX_HEADER_BYTES as Gt, init_analysisErrorPresentation as H, safeParseJson as Ht, MCP_TRANSPORT_EVIDENCE_EXPORT as I, isHopperStartupFailureCode as It, sharedProviderFailureStage as J, DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS as Jt, init_providerOperationHealth as K, DEFAULT_DEBUGGER_COMMAND_DEADLINE_MS as Kt, MCP_TRANSPORT_EVIDENCE_LINKS as L, fixedAllowanceOptions as Lt, javaScriptSemanticCeilingCoverage as M, MAXIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS as Mt, javaScriptWorkerHeapExhaustionRecovery as N, hopperStartupExitCode as Nt, JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM as O, hopperCancelledBySignal as Ot, javaScriptWorkerHeapRemediation as P, hopperStartupFailure as Pt, init_providerSelectionError as Q, DEFAULT_NATIVE_MATCHING_REPRESENTATION_BYTES as Qt, MCP_TRANSPORT_EVIDENCE_RECORDS as R, fixedAllowanceRemediation as Rt, JAVASCRIPT_ANALYSIS_TRANSFER_RECORD_BYTES as S, HopperCancelledError as St, JAVASCRIPT_PARENT_RESULT_BUDGET_REMEDIATION as T, HopperRemoteError as Tt, PROVIDER_FAILURE_STAGES as U, safeParseUtf8Json as Ut, composedCallerGuidance as V, init_safeJson as Vt, PROVIDER_OPERATION_STATES as W, DEBUGGER_CONTROL_REPLY_BYTES as Wt, init_providerAdapterError as X, DEFAULT_HOPPER_STARTUP_TIMEOUT_MS as Xt, ProviderAdapterError as Y, DEFAULT_HOPPER_CALLER_SCAN_BUDGET_MS as Yt, ProviderSelectionError as Z, DEFAULT_JADX_OPERATION_TIMEOUT_MS as Zt, WASM_INTERFACE_REPRESENTATION_BYTES as _, artifactIntegrityPair as _t, analysisSettingDefinition as a, MAXIMUM_REGEX_MATCHING_DEADLINE_MS as an, isUnopenedAppleBundleExtension as at, wasmInterfaceSchema as b, artifactSha256PairSchema as bt, analysisSettingLimit as c, MAX_NODE_TIMER_DELAY_MS as cn, init_artifactOperationError as ct, DEFAULT_WASM_COMMAND_TIMEOUT_MS as d, cleanupRetryRemediation as dt, MAXIMUM_ASAR_MAX_HEADER_BYTES as en, browserCleanupObservation as et, MAX_WASM_COMMAND_TIMEOUT_MS as f, init_analysisErrorRecovery as ft, wasmArtifactSchema as g, artifactIntegrityDetails as gt, wasmArtifactMatchesSubject as h, artifactIntegrityClaimSchema as ht, projectAnalysisErrorWithoutCapturedOutput as i, MAXIMUM_NATIVE_MATCHING_REPRESENTATION_BYTES as in, init_appleBundleTypes as it, javaScriptAnalysisResourceControlsSchema as j, HOPPER_DEMO_DIALOG_TIMEOUT_SETTING as jt, init_javascriptAnalysisResourceControls as k, init_hopperErrors as kt, analysisSettingValueSchema as l, init_analysisResourceLimits as ln, analysisCleanupRetrySchema as lt, inspectWasmArtifactInputSchema as m, artifactDfuCrc32PairSchema as mt, init_analysisErrorProjection as n, MAXIMUM_DEBUGGER_COMMAND_DEADLINE_MS as nn, APPLE_BUNDLE_EXTENSION as nt, analysisSettingIdSchema as o, MAXIMUM_REGEX_WORKER_HEAP_REQUEST_MIB as on, openableAppleBundleExtension as ot, init_wasmArtifact as p, artifactContainerIntegrityDetails as pt, providerRetryAction as q, DEFAULT_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES as qt, projectAnalysisError as r, MAXIMUM_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES as rn, OPENABLE_APPLE_BUNDLE_TYPES_TEXT as rt, analysisSettingIds as s, MAX_GHIDRA_DECOMPILE_TIMEOUT_SECONDS as sn, ArtifactOperationError as st, childFailureDiagnostics as t, MAXIMUM_CAPTURE_DECODER_OLD_GENERATION_MIB as tn, init_browserObservationError as tt, init_analysisSettingDefinitions as u, analysisErrorRecoverySchema as ut, init_wasmInterface as v, artifactIntegrityPairOf as vt, JAVASCRIPT_PARENT_HEAP_NODE_OPTIONS as w, HopperProtocolError as wt, JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS as x, init_artifactIntegrity as xt, wasmInterfaceEntryRepresentationBytes as y, artifactMd5PairSchema as yt, analysisErrorRemediationAction as z, fixedProducerInputAllowance as zt };