import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ConfigurationError, DEBUGGER_CONTROL_REPLY_BYTES, DEFAULT_DEBUGGER_COMMAND_DEADLINE_MS, DEFAULT_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES, DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS, DEFAULT_HOPPER_CALLER_SCAN_BUDGET_MS, DEFAULT_HOPPER_STARTUP_TIMEOUT_MS, MAXIMUM_DEBUGGER_COMMAND_DEADLINE_MS, MAXIMUM_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES, err, init_analysisResourceLimits, init_configurationErrors, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { ArtifactReaderFailure, NonRegularFileReadError, OwnedFileHandle, RegularFileChangedError, RegularFileCleanupFailure, init_ArtifactReader, init_OwnedFileHandle, init_OwnedRegularFile, init_RegularFile, sameRegularFileState } from "./ArtifactReader-DJ9rniiL.js";
import { init_BoundedFileBytes, readBoundedFileBytes } from "./BoundedFileBytes-DNoM_zCF.js";
import { AnalysisCleanupLease, init_AnalysisCleanupLease } from "./AnalysisCleanupLease-DZIxbgES.js";
import { AnalysisInputError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { init_RegularFileRead, readRegularFile, withRegularFile } from "./RegularFileRead-KmOamg1_.js";
import { PRODUCT_IDENTITY, analysisProviderSelectorSchema, compareUnicodeCodePoints, init_identity, init_mcpInputSchemaProfile, init_mcpOutputSchemaProfile, init_mcpStartupBudgets, init_mcpToolFamilies, init_positiveDecimalInteger, init_providerSelection, init_safeJson, init_unicodeCodePointOrder, init_urlComponents, mcpDoctorDeadlineMsSchema, mcpFirstCatalogBudgetMsSchema, mcpInitializeBudgetMsSchema, mcpInputSchemaProfileSchema, mcpOutputSchemaProfileSchema, mcpToolFamiliesSchema, mcpToolsListBudgetMsSchema, positiveDecimalIntegerSchema, safeParseJson, urlDeclaresQueryOrFragment } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_localPath, nulFreeStringSchema } from "./jsonValue-DGGrC1lE.js";
import { absoluteCallerPath, appendCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { OwnedStagedOutput, init_OwnedStagedOutput } from "./OwnedStagedOutput-3JChZ1GD.js";
import { init_processStart, init_runtimeVersion, javaScriptRuntime, processStartConfigurationSchema } from "./cliOutput-BK02eMs-.js";
import { DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS, ghidraDecompileTimeoutSchema, init_providerStartupTimeout, providerStartupTimeoutSchema } from "./snapshotEnvironment-C6Y7aHfj.js";
import { bridgeMaxRequestBytesSchema, ghidraDisabledAnalyzersSchema, ghidraProgramNameSchema, ghidraProjectPathSchema, init_bridgeMaxRequestBytes, init_ghidraDisabledAnalyzers, init_ghidraExistingProject, init_regexMatchingDeadline, init_regexWorkerHeapRequest, regexMatchingDeadlineMsSchema, regexWorkerHeapRequestMiBSchema } from "./homeDirectory-DLIK7QRT.js";
import { asarMaxHeaderBytesSchema, init_asarHeaderAdmission } from "./asarHeaderAdmission-CX-emtPE.js";
import { captureDecoderOldGenerationMiBSchema, init_captureDecoderHeap } from "./captureDecoderHeap-D2nJpzko.js";
import { CURRENT_ENTRYPOINT_PATH, init_CurrentEntrypointPath, normalizeEntrypointPath } from "./CurrentEntrypointPath-Chqij9jD.js";
import { accessSync, constants, existsSync, lstatSync, opendirSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { userInfo } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve, sep, win32 } from "node:path";
import { copyFile, link, lstat, mkdir, mkdtemp, open, readFile, realpath, rename } from "node:fs/promises";
import { createHash } from "node:crypto";
import { z } from "zod";
import { fileURLToPath } from "node:url";
import { valid } from "semver";
import { isMap, parseDocument } from "yaml";

//#region dist/application/SetupRecoveryBackup.js
var isMissing$1, errorDetail, selectCurrentRecoveryBackup, copyExclusive, preserveCurrentRecoveryBackup;
function init_SetupRecoveryBackup() {
	return (init_SetupRecoveryBackup = __esmMin((() => {
		init_result();
		init_OwnedRegularFile();
		init_RegularFileRead();
		isMissing$1 = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
		errorDetail = (cause) => cause instanceof Error ? cause.message : String(cause);
		selectCurrentRecoveryBackup = async (firstBackupPath, original, resources) => {
			const read = (path) => readRegularFile(path, {
				symlinks: "reject",
				...resources === undefined ? {} : { resources }
			});
			const expected = Buffer.isBuffer(original) ? original : Buffer.from(original, "utf8");
			let firstBackup;
			try {
				firstBackup = await read(firstBackupPath);
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				if (!isMissing$1(cause)) return err({
					kind: "unreadable",
					path: firstBackupPath,
					detail: `The recovery backup could not be checked: ${errorDetail(cause)}`
				});
			}
			if (firstBackup === undefined) return ok({
				backupPath: firstBackupPath,
				present: false
			});
			if (firstBackup.equals(expected)) return ok({
				backupPath: firstBackupPath,
				present: true
			});
			const digest = createHash("sha256").update(expected).digest("hex");
			const recoveryPath = `${firstBackupPath}.${digest}.recovery`;
			let recovery;
			try {
				recovery = await read(recoveryPath);
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				if (!isMissing$1(cause)) return err({
					kind: "unreadable",
					path: recoveryPath,
					detail: `The recovery backup could not be checked: ${errorDetail(cause)}`
				});
			}
			if (recovery !== undefined && !recovery.equals(expected)) return err({
				kind: "occupied",
				path: recoveryPath,
				detail: `The recovery path already contains different data: ${recoveryPath}`
			});
			return ok({
				backupPath: recoveryPath,
				present: recovery !== undefined
			});
		};
		copyExclusive = (source, destination) => copyFile(source, destination, constants.COPYFILE_EXCL);
		preserveCurrentRecoveryBackup = async (firstBackupPath, source, original, { copy = copyExclusive, resources } = {}) => {
			const selection = await selectCurrentRecoveryBackup(firstBackupPath, original, resources);
			if (!selection.ok) return selection;
			const { backupPath } = selection.value;
			if (!selection.value.present) {
				try {
					await copy(source, backupPath);
				} catch (cause) {
					if (!(cause instanceof Error && "code" in cause && cause.code === "EEXIST")) return err({
						kind: "copy",
						path: backupPath,
						detail: `The recovery backup could not be written: ${errorDetail(cause)}`
					});
				}
			}
			const verified = await selectCurrentRecoveryBackup(firstBackupPath, original, resources);
			if (!verified.ok) return verified;
			if (verified.value.backupPath !== backupPath || !verified.value.present) return err({
				kind: "unverified",
				path: backupPath,
				detail: `The recovery backup does not match the configuration it preserves: ${backupPath}`
			});
			return ok(backupPath);
		};
	})))();
}

//#endregion
//#region dist/config/mcpInputBudget.js
var DEFAULT_MCP_MAX_INPUT_ELEMENTS, setting, constraint, mcpInputBudgetSchema, parseMcpInputBudget;
function init_mcpInputBudget() {
	return (init_mcpInputBudget = __esmMin((() => {
		init_positiveDecimalInteger();
		init_configurationErrors();
		init_result();
		DEFAULT_MCP_MAX_INPUT_ELEMENTS = 1024;
		setting = "REA_MCP_MAX_INPUT_ELEMENTS";
		constraint = `${setting} must be a positive decimal safe integer counting combined array elements and object members; the default is ${String(DEFAULT_MCP_MAX_INPUT_ELEMENTS)}.`;
		mcpInputBudgetSchema = positiveDecimalIntegerSchema(1, Number.MAX_SAFE_INTEGER, constraint);
		parseMcpInputBudget = (value) => {
			if (value === undefined) return ok(DEFAULT_MCP_MAX_INPUT_ELEMENTS);
			const parsed = mcpInputBudgetSchema.safeParse(value);
			return parsed.success ? ok(parsed.data) : err(new ConfigurationError(constraint, { settings: [{
				setting,
				constraint
			}] }));
		};
	})))();
}

//#endregion
//#region dist/config/ghidraLanguageOverride.js
var ghidraLanguageIdSchema, ghidraCompilerSpecIdSchema;
function init_ghidraLanguageOverride() {
	return (init_ghidraLanguageOverride = __esmMin((() => {
		ghidraLanguageIdSchema = z.string().regex(/^[A-Za-z0-9_.+-]+(?:\/[A-Za-z0-9_.+-]+)*:(?:LE|BE|LEBE):[1-9]\d*:[A-Za-z0-9_.+-](?:[A-Za-z0-9_.+ -]*[A-Za-z0-9_.+-])?$/u, "must be a Ghidra language ID such as x86:LE:32:default");
		ghidraCompilerSpecIdSchema = z.string().regex(/^[A-Za-z0-9_.+-]+$/u, "must be a Ghidra compiler-spec ID such as default or borlandcpp");
	})))();
}

//#endregion
//#region dist/config/mcpResponseBudget.js
var MINIMUM_RESPONSE_BYTES, stdioResponseBudgetRecovery, nodeStringCeilingRecovery, mcpResponseBudgetSchema, budgetConstraint, parseMcpResponseBudget;
function init_mcpResponseBudget() {
	return (init_mcpResponseBudget = __esmMin((() => {
		init_configurationErrors();
		init_result();
		MINIMUM_RESPONSE_BYTES = 10 * 1024 * 1024;
		stdioResponseBudgetRecovery = (effectiveResponseBytes, reservedStringCodeUnits, nodeStringCeilingCodeUnits) => `The effective REA_MCP_MAX_RESPONSE_BYTES value is ${String(effectiveResponseBytes)} bytes (floor ${String(MINIMUM_RESPONSE_BYTES)} bytes, 10 MiB). A change requires restarting the REA process and a matching client receive buffer. It does not raise REA's reserved single-string limit of ${String(reservedStringCodeUnits)} UTF-16 code units or Node's single-string ceiling of ${String(nodeStringCeilingCodeUnits)} UTF-16 code units. This release has no runtime override for either limit.`;
		nodeStringCeilingRecovery = (reservedStringCodeUnits, nodeStringCeilingCodeUnits) => `REA's reserved single-string limit is ${String(reservedStringCodeUnits)} UTF-16 code units, below Node's single-string ceiling of ${String(nodeStringCeilingCodeUnits)} UTF-16 code units. This release has no runtime override for either limit, and REA_MCP_MAX_RESPONSE_BYTES does not raise them.`;
		mcpResponseBudgetSchema = z.string().regex(/^[1-9]\d*$/u).transform(Number).pipe(z.int().safe().min(MINIMUM_RESPONSE_BYTES));
		budgetConstraint = `REA_MCP_MAX_RESPONSE_BYTES must be a decimal safe integer at least ${String(MINIMUM_RESPONSE_BYTES)} bytes, the default stdio receive-buffer size.`;
		parseMcpResponseBudget = (value) => {
			if (value === undefined) return ok(undefined);
			const parsed = mcpResponseBudgetSchema.safeParse(value);
			return parsed.success ? ok(parsed.data) : err(new ConfigurationError(budgetConstraint, { settings: [{
				setting: "REA_MCP_MAX_RESPONSE_BYTES",
				constraint: budgetConstraint
			}] }));
		};
	})))();
}

//#endregion
//#region dist/config/debuggerSessionLimits.js
var DEBUGGER_COMMAND_DEADLINE_SETTING, DEBUGGER_MAX_SESSIONS_SETTING, DEBUGGER_MAX_PENDING_COMMANDS_SETTING, DEBUGGER_MAX_COMMAND_OUTPUT_BYTES_SETTING, limit, DEFAULT_DEBUGGER_COMMAND_DEADLINE, DEFAULT_DEBUGGER_MAX_SESSIONS_LIMIT, DEFAULT_DEBUGGER_MAX_PENDING_COMMANDS_LIMIT, DEFAULT_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES_LIMIT, constraintFor, debuggerCommandDeadlineConstraint, debuggerMaxSessionsConstraint, debuggerMaxPendingCommandsConstraint, debuggerMaxCommandOutputBytesConstraint, debuggerCommandDeadlineMsSchema, debuggerMaxSessionsSchema, debuggerMaxPendingCommandsSchema, debuggerMaxCommandOutputBytesSchema, debuggerSessionLimitEnvironmentShape, parseOne, parseDebuggerSessionLimits, resolveDebuggerSessionLimits, debuggerControlReplyOutput, applyDebuggerAdmissionOverride;
function init_debuggerSessionLimits() {
	return (init_debuggerSessionLimits = __esmMin((() => {
		init_analysisResourceLimits();
		init_configurationErrors();
		init_result();
		init_positiveDecimalInteger();
		DEBUGGER_COMMAND_DEADLINE_SETTING = "REA_DEBUGGER_COMMAND_DEADLINE_MS";
		DEBUGGER_MAX_SESSIONS_SETTING = "REA_DEBUGGER_MAX_SESSIONS";
		DEBUGGER_MAX_PENDING_COMMANDS_SETTING = "REA_DEBUGGER_MAX_PENDING_COMMANDS";
		DEBUGGER_MAX_COMMAND_OUTPUT_BYTES_SETTING = "REA_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES";
		limit = (setting, value, minimum, maximum, unit) => ({
			setting,
			value,
			source: "default",
			defaultValue: value,
			minimum,
			maximum,
			unit
		});
		DEFAULT_DEBUGGER_COMMAND_DEADLINE = limit(DEBUGGER_COMMAND_DEADLINE_SETTING, DEFAULT_DEBUGGER_COMMAND_DEADLINE_MS, 1, MAXIMUM_DEBUGGER_COMMAND_DEADLINE_MS, "ms");
		DEFAULT_DEBUGGER_MAX_SESSIONS_LIMIT = limit(DEBUGGER_MAX_SESSIONS_SETTING, 8, 1, 64, "sessions");
		DEFAULT_DEBUGGER_MAX_PENDING_COMMANDS_LIMIT = limit(DEBUGGER_MAX_PENDING_COMMANDS_SETTING, 16, 1, 256, "commands");
		DEFAULT_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES_LIMIT = limit(DEBUGGER_MAX_COMMAND_OUTPUT_BYTES_SETTING, DEFAULT_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES, 1, MAXIMUM_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES, "bytes");
		constraintFor = (admission) => `${admission.setting} must be a positive decimal integer from ${String(admission.minimum)} to ${String(admission.maximum)} ${admission.unit}; the default is ${String(admission.defaultValue)} ${admission.unit}.${admission.unit === "ms" ? " Node schedules a delay above that maximum as 1 ms, so a larger value is refused." : ""}`;
		debuggerCommandDeadlineConstraint = constraintFor(DEFAULT_DEBUGGER_COMMAND_DEADLINE);
		debuggerMaxSessionsConstraint = constraintFor(DEFAULT_DEBUGGER_MAX_SESSIONS_LIMIT);
		debuggerMaxPendingCommandsConstraint = constraintFor(DEFAULT_DEBUGGER_MAX_PENDING_COMMANDS_LIMIT);
		debuggerMaxCommandOutputBytesConstraint = constraintFor(DEFAULT_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES_LIMIT);
		debuggerCommandDeadlineMsSchema = positiveDecimalIntegerSchema(1, MAXIMUM_DEBUGGER_COMMAND_DEADLINE_MS, debuggerCommandDeadlineConstraint);
		debuggerMaxSessionsSchema = positiveDecimalIntegerSchema(1, 64, debuggerMaxSessionsConstraint);
		debuggerMaxPendingCommandsSchema = positiveDecimalIntegerSchema(1, 256, debuggerMaxPendingCommandsConstraint);
		debuggerMaxCommandOutputBytesSchema = positiveDecimalIntegerSchema(1, MAXIMUM_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES, debuggerMaxCommandOutputBytesConstraint);
		debuggerSessionLimitEnvironmentShape = {
			[DEBUGGER_COMMAND_DEADLINE_SETTING]: debuggerCommandDeadlineMsSchema.optional(),
			[DEBUGGER_MAX_SESSIONS_SETTING]: debuggerMaxSessionsSchema.optional(),
			[DEBUGGER_MAX_PENDING_COMMANDS_SETTING]: debuggerMaxPendingCommandsSchema.optional(),
			[DEBUGGER_MAX_COMMAND_OUTPUT_BYTES_SETTING]: debuggerMaxCommandOutputBytesSchema.optional()
		};
		parseOne = (admission, schema, constraint, value) => {
			if (value === undefined) return ok(admission);
			const parsed = schema.safeParse(value);
			return parsed.success ? ok({
				...admission,
				value: parsed.data,
				source: "setting"
			}) : err(new ConfigurationError(constraint, { settings: [{
				setting: admission.setting,
				constraint
			}] }));
		};
		parseDebuggerSessionLimits = (environment) => {
			const commandDeadline = parseOne(DEFAULT_DEBUGGER_COMMAND_DEADLINE, debuggerCommandDeadlineMsSchema, debuggerCommandDeadlineConstraint, environment[DEBUGGER_COMMAND_DEADLINE_SETTING]);
			const maxSessions = parseOne(DEFAULT_DEBUGGER_MAX_SESSIONS_LIMIT, debuggerMaxSessionsSchema, debuggerMaxSessionsConstraint, environment[DEBUGGER_MAX_SESSIONS_SETTING]);
			const maxPendingCommands = parseOne(DEFAULT_DEBUGGER_MAX_PENDING_COMMANDS_LIMIT, debuggerMaxPendingCommandsSchema, debuggerMaxPendingCommandsConstraint, environment[DEBUGGER_MAX_PENDING_COMMANDS_SETTING]);
			const maxCommandOutputBytes = parseOne(DEFAULT_DEBUGGER_MAX_COMMAND_OUTPUT_BYTES_LIMIT, debuggerMaxCommandOutputBytesSchema, debuggerMaxCommandOutputBytesConstraint, environment[DEBUGGER_MAX_COMMAND_OUTPUT_BYTES_SETTING]);
			const settings = [
				commandDeadline,
				maxSessions,
				maxPendingCommands,
				maxCommandOutputBytes
			].flatMap((result) => result.ok ? [] : result.error.settings);
			if (settings.length > 0 || !commandDeadline.ok || !maxSessions.ok || !maxPendingCommands.ok || !maxCommandOutputBytes.ok) return err(new ConfigurationError("Invalid REA environment configuration", { settings }));
			return ok({
				commandDeadline: commandDeadline.value,
				maxSessions: maxSessions.value,
				maxPendingCommands: maxPendingCommands.value,
				maxCommandOutputBytes: maxCommandOutputBytes.value
			});
		};
		resolveDebuggerSessionLimits = (environment) => {
			const parsed = parseDebuggerSessionLimits(environment);
			if (!parsed.ok) throw parsed.error;
			return parsed.value;
		};
		debuggerControlReplyOutput = {
			setting: "debugger control-reply budget",
			value: DEBUGGER_CONTROL_REPLY_BYTES,
			source: "default",
			defaultValue: DEBUGGER_CONTROL_REPLY_BYTES,
			minimum: DEBUGGER_CONTROL_REPLY_BYTES,
			maximum: DEBUGGER_CONTROL_REPLY_BYTES,
			unit: "bytes"
		};
		applyDebuggerAdmissionOverride = (admission, value) => value === undefined ? admission : {
			...admission,
			value,
			source: "runtime"
		};
	})))();
}

//#endregion
//#region dist/config/parsers.js
var parseStringArray, parseLoaderArgs, parseConfiguredStringArray, configuredArrayError;
function init_parsers() {
	return (init_parsers = __esmMin((() => {
		init_configurationErrors();
		init_localPath();
		init_result();
		init_safeJson();
		parseStringArray = (encoded, name) => {
			return parseConfiguredStringArray(encoded, name, z.string().min(1));
		};
		parseLoaderArgs = (encoded) => {
			if (encoded === undefined) return ok([]);
			return parseConfiguredStringArray(encoded, "HOPPER_LOADER_ARGS_JSON", nulFreeStringSchema, "must encode an array of strings without NUL bytes");
		};
		parseConfiguredStringArray = (encoded, setting, itemSchema, requirement = "must encode an array of strings") => {
			const decoded = safeParseJson(encoded);
			if (!decoded.ok) return err(configuredArrayError(setting, "must be valid JSON", decoded.cause));
			const parsed = z.array(itemSchema).safeParse(decoded.value);
			return parsed.success ? ok(parsed.data) : err(configuredArrayError(setting, requirement, parsed.error));
		};
		configuredArrayError = (setting, requirement, cause) => {
			const constraint = `${setting} ${requirement}`;
			return new ConfigurationError(constraint, {
				cause,
				settings: [{
					setting,
					constraint
				}]
			});
		};
	})))();
}

//#endregion
//#region dist/config/jebMcpEndpoint.js
var DEFAULT_JEB_MCP_ENDPOINT, parseJebMcpEndpoint;
function init_jebMcpEndpoint() {
	return (init_jebMcpEndpoint = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		init_urlComponents();
		DEFAULT_JEB_MCP_ENDPOINT = "http://127.0.0.1:8425/mcp";
		parseJebMcpEndpoint = (value) => {
			const raw = value === undefined || value.length === 0 ? null : value;
			let url;
			try {
				url = new URL(raw ?? "http://127.0.0.1:8425/mcp");
			} catch {
				return err(new AnalysisInputError("jeb_mcp_endpoint", { cause: "Expected an absolute http(s) URL" }));
			}
			if (url.protocol !== "http:" && url.protocol !== "https:") return err(new AnalysisInputError("jeb_mcp_endpoint", { cause: "Only http and https JEB MCP endpoints are supported" }));
			if (url.hostname !== "127.0.0.1" && url.hostname !== "[::1]") return err(new AnalysisInputError("jeb_mcp_endpoint", { cause: "JEB MCP endpoint must use a literal loopback host (127.0.0.1 or ::1)" }));
			if (url.username !== "" || url.password !== "") return err(new AnalysisInputError("jeb_mcp_endpoint", { cause: "Embedding credentials in the JEB MCP endpoint is not supported; configure authentication with the engine" }));
			if (url.pathname !== "/mcp" && url.pathname !== "/mcp/") return err(new AnalysisInputError("jeb_mcp_endpoint", { cause: "JEB MCP endpoint must use the /mcp route" }));
			if (urlDeclaresQueryOrFragment(url)) return err(new AnalysisInputError("jeb_mcp_endpoint", { cause: "JEB MCP endpoint query strings and fragments are not supported" }));
			return ok(url);
		};
	})))();
}

//#endregion
//#region dist/config/environment.js
var environmentSchema, parseJebMcpTimeoutMs, parseEnvironmentValues, parseEnvironment;
function init_environment() {
	return (init_environment = __esmMin((() => {
		init_ghidraExistingProject();
		init_mcpInputBudget();
		init_configurationErrors();
		init_result();
		init_providerSelection();
		init_ghidraLanguageOverride();
		init_ghidraDisabledAnalyzers();
		init_providerStartupTimeout();
		init_analysisResourceLimits();
		init_mcpInputSchemaProfile();
		init_mcpOutputSchemaProfile();
		init_mcpResponseBudget();
		init_asarHeaderAdmission();
		init_bridgeMaxRequestBytes();
		init_captureDecoderHeap();
		init_debuggerSessionLimits();
		init_regexMatchingDeadline();
		init_regexWorkerHeapRequest();
		init_mcpStartupBudgets();
		init_mcpToolFamilies();
		init_parsers();
		init_processStart();
		init_jebMcpEndpoint();
		environmentSchema = z.object({
			...debuggerSessionLimitEnvironmentShape,
			REA_ANALYSIS_PROVIDER: analysisProviderSelectorSchema.default("auto"),
			REA_BRIDGE_MAX_REQUEST_BYTES: bridgeMaxRequestBytesSchema.optional(),
			REA_MCP_MAX_RESPONSE_BYTES: mcpResponseBudgetSchema.optional(),
			REA_MCP_MAX_INPUT_ELEMENTS: mcpInputBudgetSchema.optional(),
			REA_ASAR_MAX_HEADER_BYTES: asarMaxHeaderBytesSchema.optional(),
			REA_CAPTURE_DECODER_OLD_GENERATION_MIB: captureDecoderOldGenerationMiBSchema.optional(),
			REA_REGEX_MATCHING_DEADLINE_MS: regexMatchingDeadlineMsSchema.optional(),
			REA_REGEX_WORKER_HEAP_REQUEST_MIB: regexWorkerHeapRequestMiBSchema.optional(),
			REA_MCP_INITIALIZE_BUDGET_MS: mcpInitializeBudgetMsSchema.optional(),
			REA_MCP_TOOLS_LIST_BUDGET_MS: mcpToolsListBudgetMsSchema.optional(),
			REA_MCP_FIRST_CATALOG_BUDGET_MS: mcpFirstCatalogBudgetMsSchema.optional(),
			REA_MCP_DOCTOR_DEADLINE_MS: mcpDoctorDeadlineMsSchema.optional(),
			REA_MCP_INPUT_SCHEMA_PROFILE: mcpInputSchemaProfileSchema.optional(),
			REA_MCP_TOOL_FAMILIES: mcpToolFamiliesSchema.optional(),
			REA_MCP_OUTPUT_SCHEMA_PROFILE: mcpOutputSchemaProfileSchema.optional(),
			REA_IDA_MCP_CONFIG: z.string().min(1).refine(isAbsolute, "REA_IDA_MCP_CONFIG must be absolute").optional(),
			REA_JEB_MCP_TIMEOUT_MS: providerStartupTimeoutSchema.optional(),
			REA_JEB_MCP_URL: z.string().superRefine((value, context) => {
				const parsed = parseJebMcpEndpoint(value);
				if (!parsed.ok) context.addIssue({
					code: "custom",
					message: typeof parsed.error.cause === "string" ? parsed.error.cause : parsed.error.message
				});
			}).optional(),
			GHIDRA_INSTALL_DIR: z.string().min(1).refine(isAbsolute, "GHIDRA_INSTALL_DIR must be absolute").optional(),
			JAVA_HOME: z.string().min(1).refine(isAbsolute, "JAVA_HOME must be absolute").optional(),
			REA_GHIDRA_NATIVEAOT_JAR: z.string().min(1).refine(isAbsolute, "REA_GHIDRA_NATIVEAOT_JAR must be absolute").optional(),
			REA_GHIDRA_STARTUP_TIMEOUT_MS: providerStartupTimeoutSchema.default(DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS),
			REA_HOPPER_STARTUP_TIMEOUT_MS: providerStartupTimeoutSchema.default(DEFAULT_HOPPER_STARTUP_TIMEOUT_MS),
			REA_HOPPER_CALLER_SCAN_BUDGET_MS: providerStartupTimeoutSchema.default(DEFAULT_HOPPER_CALLER_SCAN_BUDGET_MS),
			REA_SWIFTC_COMPILE_TIMEOUT_MS: providerStartupTimeoutSchema.default(DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS),
			REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS: ghidraDecompileTimeoutSchema.optional(),
			REA_GHIDRA_PROJECT_PATH: ghidraProjectPathSchema.optional(),
			REA_GHIDRA_PROGRAM_NAME: ghidraProgramNameSchema.optional(),
			REA_GHIDRA_LANGUAGE_ID: ghidraLanguageIdSchema.optional(),
			REA_GHIDRA_COMPILER_SPEC_ID: ghidraCompilerSpecIdSchema.optional(),
			REA_GHIDRA_DISABLED_ANALYZERS: ghidraDisabledAnalyzersSchema.optional(),
			REA_GHIDRA_SEED_FILE: z.string().min(1).refine(isAbsolute, "REA_GHIDRA_SEED_FILE must be absolute").optional(),
			REA_ILSPY_CMD_PATH: z.string().min(1).refine(isAbsolute, "REA_ILSPY_CMD_PATH must be absolute").optional(),
			HOPPER_LAUNCHER_PATH: z.string().min(1).optional(),
			HOPPER_TARGET_PATH: z.string().min(1).optional(),
			HOPPER_TARGET_KIND: z.enum(["executable", "database"]).default("executable"),
			HOPPER_LOADER_ARGS_JSON: z.string().optional(),
			REA_LOG_LEVEL: processStartConfigurationSchema.shape.REA_LOG_LEVEL,
			REA_REFERENCE_SECRET_PATTERNS_JSON: z.string().default("[]")
		});
		parseJebMcpTimeoutMs = (value) => {
			if (value === undefined) return ok(undefined);
			const parsed = providerStartupTimeoutSchema.safeParse(value);
			if (parsed.success) return ok(parsed.data);
			return err(new ConfigurationError("Invalid REA environment configuration", {
				cause: parsed.error,
				settings: [{
					setting: "REA_JEB_MCP_TIMEOUT_MS",
					constraint: parsed.error.issues[0]?.message ?? "must be a valid timeout"
				}]
			}));
		};
		parseEnvironmentValues = (environment, unresolvedSettings = new Set()) => {
			const keys = new Set([...Object.keys(environment), ...unresolvedSettings]);
			const invalidEntries = [...keys].filter((key) => key.includes("\0") || Object.hasOwn(environment, key) && environment[key]?.includes("\0")).map((setting) => ({
				setting,
				constraint: "Environment variable names and values must not contain NUL bytes"
			}));
			if (invalidEntries.length > 0) return err(new ConfigurationError("Invalid REA environment configuration", { settings: invalidEntries }));
			const parsed = environmentSchema.safeParse(environment);
			if (!parsed.success) {
				const settings = parsed.error.issues.map((issue) => ({
					setting: String(issue.path[0] ?? "environment"),
					constraint: issue.message
				}));
				return err(new ConfigurationError("Invalid REA environment configuration", {
					cause: parsed.error,
					settings
				}));
			}
			const { HOPPER_LOADER_ARGS_JSON: encodedLoaderArgs, REA_REFERENCE_SECRET_PATTERNS_JSON: encodedSecretPatterns, ...env } = parsed.data;
			const loaderArgs = parseLoaderArgs(encodedLoaderArgs);
			if (!loaderArgs.ok) return loaderArgs;
			const secretPatterns = parseStringArray(encodedSecretPatterns, "REA_REFERENCE_SECRET_PATTERNS_JSON");
			if (!secretPatterns.ok) return secretPatterns;
			return ok({
				...env,
				loaderArgs: loaderArgs.value,
				referenceSecretPatterns: secretPatterns.value
			});
		};
		parseEnvironment = (environment, unresolvedSettings = new Set()) => {
			const parsed = parseEnvironmentValues(environment, unresolvedSettings);
			if (!parsed.ok) return parsed;
			const env = parsed.value;
			const project = env.REA_GHIDRA_PROJECT_PATH;
			const incompatible = project === undefined ? env.REA_GHIDRA_PROGRAM_NAME === undefined || unresolvedSettings.has("REA_GHIDRA_PROJECT_PATH") ? [] : ["REA_GHIDRA_PROGRAM_NAME"] : [
				"REA_GHIDRA_LANGUAGE_ID",
				"REA_GHIDRA_COMPILER_SPEC_ID",
				"REA_GHIDRA_SEED_FILE",
				"REA_GHIDRA_DISABLED_ANALYZERS",
				"REA_GHIDRA_NATIVEAOT_JAR"
			].filter((setting) => (setting === "REA_GHIDRA_DISABLED_ANALYZERS" ? env[setting] : environment[setting]) !== undefined);
			if (incompatible.length > 0) return err(new ConfigurationError("Invalid existing Ghidra project configuration", { settings: incompatible.map((setting) => ({
				setting,
				constraint: project === undefined ? "requires REA_GHIDRA_PROJECT_PATH" : "Import and analysis overrides cannot be combined with an existing project"
			})) }));
			if (env.REA_GHIDRA_COMPILER_SPEC_ID !== undefined && env.REA_GHIDRA_LANGUAGE_ID === undefined && !unresolvedSettings.has("REA_GHIDRA_LANGUAGE_ID")) return err(new ConfigurationError("Invalid REA environment configuration", { settings: [{
				setting: "REA_GHIDRA_COMPILER_SPEC_ID",
				constraint: "requires REA_GHIDRA_LANGUAGE_ID"
			}] }));
			return parsed;
		};
	})))();
}

//#endregion
//#region dist/application/ClientRegistrationIdentity.js
var environmentValue, invokingPackageRunner, withoutPackageRunnerIdentity, currentClientRegistrationCommand, unwrapCmdCommand, clientRegistrationPackageReference, entrypointIdentity, directEntrypointIdentity, sameFileExecutableAlias, registrationEntrypointPath, registrationRuntimePath, equivalentClientRegistrationCommands, inspectClientRegistrationCommand, classifyClientRegistrationCommand, inspectDirectRegistrationCommand;
function init_ClientRegistrationIdentity() {
	return (init_ClientRegistrationIdentity = __esmMin((() => {
		init_CurrentEntrypointPath();
		init_runtimeVersion();
		init_callerPath();
		init_identity();
		environmentValue = (environment, name, platform) => {
			if (platform !== "win32") return environment[name];
			const target = name.toLowerCase();
			const key = Object.keys(environment).findLast((candidate) => candidate.toLowerCase() === target);
			return key === undefined ? undefined : environment[key];
		};
		invokingPackageRunner = (environment, platform = process.platform) => {
			if (environmentValue(environment, "npm_command", platform) !== "exec") return undefined;
			return environmentValue(environment, "npm_config_user_agent", platform)?.startsWith("bun/") === true ? "bunx" : "npx";
		};
		withoutPackageRunnerIdentity = (environment, platform = process.platform) => Object.fromEntries(Object.entries(environment).filter(([key]) => platform === "win32" ? key.toLowerCase() !== "npm_command" : key !== "npm_command"));
		currentClientRegistrationCommand = (selection = {}) => {
			const platform = selection.platform ?? process.platform;
			const environment = selection.environment ?? process.env;
			const entrypointPath = Object.hasOwn(selection, "entrypointPath") ? selection.entrypointPath : CURRENT_ENTRYPOINT_PATH;
			if (entrypointPath === undefined || entrypointPath.length === 0) return [];
			return [
				registrationRuntimePath(process.execPath, javaScriptRuntime(process.versions).id, environment, platform),
				registrationEntrypointPath(entrypointPath, environment, platform),
				"mcp"
			];
		};
		unwrapCmdCommand = (command) => {
			const executable = command[0]?.toLowerCase();
			if (executable !== "cmd" && executable !== "cmd.exe") return command;
			if (command[1]?.toLowerCase() === "/c") return command.slice(2);
			if (command[1]?.toLowerCase() === "/d" && command[2]?.toLowerCase() === "/c") return command.slice(3);
			return [];
		};
		clientRegistrationPackageReference = (command) => {
			const arguments_ = unwrapCmdCommand(command);
			if (arguments_.length === 4 && arguments_[0] === "npx" && arguments_[1] === "-y" && arguments_[3] === "mcp") return arguments_[2];
			if (arguments_.length === 3 && arguments_[0] === "bunx" && arguments_[2] === "mcp") return arguments_[1];
			return undefined;
		};
		entrypointIdentity = (candidate, current) => {
			if (!isAbsolute(candidate) || !isAbsolute(current)) return "unknown";
			if (candidate === current) return "owned";
			if (process.platform !== "win32" && javaScriptRuntime(process.versions).id === "bun" && [candidate, current].some((path) => path.split("/").includes(".."))) return "unknown";
			try {
				return realpathSync.native(candidate) === realpathSync.native(current) ? "owned" : "foreign";
			} catch {
				return "unknown";
			}
		};
		directEntrypointIdentity = (candidate, current) => {
			const nativeIdentity = entrypointIdentity(candidate, current);
			const scriptPath = normalizeEntrypointPath(candidate, "node");
			if (scriptPath === candidate) return nativeIdentity;
			return scriptPath !== undefined && entrypointIdentity(scriptPath, current) === nativeIdentity ? nativeIdentity : "unknown";
		};
		sameFileExecutableAlias = (selected, name, environment, identify) => {
			for (const directory of (environment.PATH ?? "").split(":")) {
				if (!isAbsolute(directory)) continue;
				const candidate = absoluteCallerPath(`${directory}/${name}`);
				if (identify(candidate, selected) !== "owned") continue;
				try {
					accessSync(candidate, constants.X_OK);
					return candidate;
				} catch {}
			}
			return selected;
		};
		registrationEntrypointPath = (entrypoint, environment, platform) => platform === "win32" ? entrypoint : sameFileExecutableAlias(entrypoint, PRODUCT_IDENTITY.cliBinary, environment, directEntrypointIdentity);
		registrationRuntimePath = (executable, runtime, environment, platform) => platform === "win32" ? executable : sameFileExecutableAlias(executable, runtime, environment, entrypointIdentity);
		equivalentClientRegistrationCommands = (previous, requested) => {
			if (previous.length === requested.length && previous.every((value, index) => value === requested[index])) return true;
			const requestedFacts = inspectClientRegistrationCommand(requested, undefined);
			const current = requestedFacts.entrypoint;
			if (current === undefined) return false;
			const prior = inspectClientRegistrationCommand(previous, current);
			return prior.entrypoint !== undefined && prior.identity === "owned" && prior.launch === requestedFacts.launch;
		};
		inspectClientRegistrationCommand = (command, currentCommandPath) => {
			const reference = clientRegistrationPackageReference(command);
			if (reference !== undefined) {
				const prefix = `${PRODUCT_IDENTITY.packageName}@`;
				const version = reference.startsWith(prefix) ? reference.slice(prefix.length) : undefined;
				const normalized = version === undefined ? null : valid(version);
				const owned = reference === PRODUCT_IDENTITY.packageName || reference === PRODUCT_IDENTITY.packageSpecifier || reference === PRODUCT_IDENTITY.registrationPackageSpecifier || normalized !== null;
				return {
					identity: owned ? "owned" : "foreign",
					launch: "package_runner",
					entrypoint: undefined,
					package: {
						reference,
						exactVersion: normalized === version ? version : undefined
					}
				};
			}
			return inspectDirectRegistrationCommand(command, currentCommandPath);
		};
		classifyClientRegistrationCommand = (command, currentCommandPath) => inspectClientRegistrationCommand(command, currentCommandPath).identity;
		inspectDirectRegistrationCommand = (command, currentCommandPath) => {
			const currentPathAvailable = currentCommandPath !== undefined && currentCommandPath.length > 0;
			if (command.length === 3 && command[2] === "mcp") {
				const interpreter = command[0] ?? "";
				const entrypoint = command[1] ?? "";
				if (!isAbsolute(interpreter) || !isAbsolute(entrypoint)) return {
					identity: "unknown",
					launch: "runtime_script",
					entrypoint: undefined,
					package: undefined
				};
				const interpreterIdentity = entrypointIdentity(interpreter, process.execPath);
				if (interpreterIdentity !== "owned") return {
					identity: currentPathAvailable ? interpreterIdentity : "unknown",
					launch: "runtime_script",
					entrypoint: undefined,
					package: undefined
				};
				const selectedEntrypoint = normalizeEntrypointPath(entrypoint);
				return {
					launch: "runtime_script",
					identity: selectedEntrypoint === undefined || !currentPathAvailable ? "unknown" : entrypointIdentity(selectedEntrypoint, currentCommandPath),
					entrypoint: selectedEntrypoint,
					package: undefined
				};
			}
			if (command.length === 2 && command[1] === "mcp") {
				const executable = command[0] ?? "";
				if (executable === PRODUCT_IDENTITY.cliBinary) return {
					identity: "owned",
					launch: "direct",
					entrypoint: undefined,
					package: undefined
				};
				if (isAbsolute(executable)) return {
					launch: "direct",
					identity: currentPathAvailable ? directEntrypointIdentity(executable, currentCommandPath) : "unknown",
					entrypoint: executable,
					package: undefined
				};
				if (/[./\\]/u.test(executable)) return {
					identity: "unknown",
					launch: "direct",
					entrypoint: undefined,
					package: undefined
				};
			}
			return {
				identity: "foreign",
				launch: "unknown",
				entrypoint: undefined,
				package: undefined
			};
		};
	})))();
}

//#endregion
//#region dist/application/HermesClientHome.js
var HermesClientPathError, defaultDirectory, expandedDirectory, physicalPath, within, PROFILE_MARKERS, RESERVED_PROFILES, liveProfile, resolveHermesClientHome;
function init_HermesClientHome() {
	return (init_HermesClientHome = __esmMin((() => {
		init_callerPath();
		HermesClientPathError = class extends Error {
			path;
			constructor(path, message) {
				super(message);
				this.path = path;
				this.name = "HermesClientPathError";
			}
		};
		defaultDirectory = (home, platform, env) => {
			const suffix = env.HERMES_DATA_DIR_SUFFIX ?? "";
			return platform === "win32" ? join(env.LOCALAPPDATA?.trim() || join(home, "AppData", "Local"), `hermes${suffix}`) : appendCallerPath(home, `.hermes${suffix}`, platform);
		};
		expandedDirectory = (home, platform, env) => {
			const override = env.HERMES_HOME?.trim();
			if (!override) return undefined;
			const variables = override.replace(/\$(\w+|\{[^}]*\})/gu, (match, variable) => {
				const key = variable.startsWith("{") ? variable.slice(1, -1) : variable;
				return env[key] ?? match;
			});
			const expanded = platform === "win32" ? variables.replace(/%([^%]+)%/gu, (match, variable) => env[variable] ?? match) : variables;
			if (expanded === "~") return home;
			if (expanded.startsWith("~/") || platform === "win32" && expanded.startsWith("~\\")) return absoluteCallerPath(appendCallerPath(home, expanded.slice(2), platform));
			if (expanded.startsWith("~")) {
				if (platform !== "win32") {
					const separator = expanded.indexOf("/");
					const username = expanded.slice(1, separator < 0 ? undefined : separator);
					let account;
					try {
						account = userInfo();
					} catch {
						throw new HermesClientPathError(override, "Cannot resolve the OS account for this named Hermes home. Set an absolute HERMES_HOME before configuring Hermes.");
					}
					if (account.username === username && isAbsolute(account.homedir)) return separator < 0 ? account.homedir : absoluteCallerPath(appendCallerPath(account.homedir, expanded.slice(separator + 1)));
				}
				throw new HermesClientPathError(override, "Cannot resolve this named Hermes home. Set an absolute HERMES_HOME before configuring Hermes.");
			}
			return absoluteCallerPath(expanded);
		};
		physicalPath = (path) => {
			let ancestor = absoluteCallerPath(path);
			const missing = [];
			try {
				while (true) {
					try {
						return join(realpathSync(ancestor), ...missing);
					} catch (cause) {
						if (!(cause instanceof Error) || !("code" in cause) || cause.code !== "ENOENT" || dirname(ancestor) === ancestor || basename(ancestor) === "..") throw cause;
						if (lstatSync(ancestor, { throwIfNoEntry: false })?.isSymbolicLink()) throw cause;
						missing.unshift(basename(ancestor));
						ancestor = dirname(ancestor);
					}
				}
			} catch {
				throw new HermesClientPathError(path, "Cannot resolve the Hermes home root. Restore access to this path before configuring Hermes.");
			}
		};
		within = (root, path) => {
			const difference = relative(physicalPath(root), physicalPath(path));
			return difference === "" || !isAbsolute(difference) && difference !== ".." && !difference.startsWith(`..${sep}`);
		};
		PROFILE_MARKERS = [
			"config.yaml",
			".env",
			"SOUL.md",
			"profile.yaml",
			"auth.json",
			"state.db"
		];
		RESERVED_PROFILES = new Set([
			"hermes",
			"test",
			"tmp",
			"root",
			"sudo"
		]);
		liveProfile = (path) => {
			try {
				if (!statSync(path).isDirectory()) return false;
				try {
					statSync(appendCallerPath(dirname(path), `.deleted/${basename(path)}`));
					return false;
				} catch {}
				return PROFILE_MARKERS.some((marker) => {
					try {
						const status = lstatSync(appendCallerPath(path, marker));
						return status.isFile() || status.isSymbolicLink();
					} catch {
						return false;
					}
				});
			} catch {
				return false;
			}
		};
		resolveHermesClientHome = (home, platform, env) => {
			const native = defaultDirectory(home, platform, env);
			const root = expandedDirectory(home, platform, env) ?? native;
			if (basename(dirname(root)) === "profiles") return root;
			const stickyRoot = within(native, root) ? native : root;
			let name;
			try {
				name = new TextDecoder("utf-8", { fatal: true }).decode(readFileSync(appendCallerPath(stickyRoot, "active_profile"))).trim();
			} catch {
				return root;
			}
			if (name === "" || name === "default") return root;
			const canonical = name.toLowerCase();
			if (canonical === "default") return root;
			if (!/^[a-z0-9][a-z0-9_-]{0,63}$/u.test(canonical) || RESERVED_PROFILES.has(canonical)) throw new HermesClientPathError(appendCallerPath(stickyRoot, "active_profile"), `Invalid saved Hermes profile ${JSON.stringify(name)}. Run 'hermes profile use default' or repair active_profile.`);
			const selected = appendCallerPath(stickyRoot, `profiles/${canonical}`);
			if (!liveProfile(selected)) throw new HermesClientPathError(selected, `Saved Hermes profile ${JSON.stringify(name)} is missing, deleted, or has no profile identity. Run 'hermes profile use default' or restore that profile before configuring it.`);
			return selected;
		};
	})))();
}

//#endregion
//#region dist/application/MsixPackageStorage.js
var windowsAppDataRoots, msixPackagesDirectory, pathWithin, packagePrivateStorageFamily, packagePrivateLauncherBlocker, canonicalDestination, redirectedWriteBlocker, packageReadTargetChanged;
function init_MsixPackageStorage() {
	return (init_MsixPackageStorage = __esmMin((() => {
		init_result();
		windowsAppDataRoots = (home, env) => ({
			roaming: env.APPDATA || join(home, "AppData", "Roaming"),
			local: env.LOCALAPPDATA || join(home, "AppData", "Local")
		});
		msixPackagesDirectory = (home, env) => join(windowsAppDataRoots(home, env).local, "Packages");
		pathWithin = (path, root) => {
			const inner = relative(root, path);
			return inner === "" || inner !== ".." && !inner.startsWith(`..${sep}`) && !isAbsolute(inner);
		};
		packagePrivateStorageFamily = (canonicalPath, packagesDirectory) => {
			if (!pathWithin(canonicalPath, packagesDirectory)) return undefined;
			const [family, storage] = relative(packagesDirectory, canonicalPath).split(/[\\/]/u);
			return family !== undefined && family !== "" && storage?.toLowerCase() === "localcache" ? family : undefined;
		};
		packagePrivateLauncherBlocker = (command, packagesDirectory, canonicalPath = realpathSync.native) => {
			let packages = packagesDirectory;
			try {
				packages = canonicalPath(packagesDirectory);
			} catch (cause) {
				void cause;
			}
			for (const part of command) {
				if (!isAbsolute(part)) continue;
				let resolved;
				try {
					resolved = canonicalPath(part);
				} catch (cause) {
					void cause;
					continue;
				}
				const family = packagePrivateStorageFamily(resolved, packages);
				if (family !== undefined) return `The REA launcher ${part} is stored at ${resolved}, inside the private storage of MSIX package ${family}. Only processes started by that app can see it at ${part}, and Windows removes it with the package, so other clients could not start this registration. Install REA from a terminal that the app did not start (for example with \`npm install -g rea-agents\`), then rerun setup from that terminal.`;
			}
			return undefined;
		};
		canonicalDestination = (path, canonicalPath) => {
			let ancestor = path;
			const missing = [];
			while (true) {
				try {
					return ok(join(canonicalPath(ancestor), ...missing));
				} catch (cause) {
					if (cause instanceof Error && "code" in cause && (cause.code === "ENOENT" || cause.code === "ENOTDIR") && dirname(ancestor) !== ancestor) {
						missing.unshift(basename(ancestor));
						ancestor = dirname(ancestor);
						continue;
					}
					return err({
						path,
						detail: cause instanceof Error ? cause.message : String(cause)
					});
				}
			}
		};
		redirectedWriteBlocker = (view, targets, operation, canonicalPath = realpathSync.native) => {
			if (view?.processView !== "redirected" || targets.length === 0) return undefined;
			const roots = [];
			const redirected = [];
			for (const root of view.virtualizedRoots) {
				const resolved = canonicalDestination(root, canonicalPath);
				if (!resolved.ok) return `Cannot establish the MSIX write location for ${resolved.error.path}: ${resolved.error.detail}. Rerun ${operation} from a terminal that this app did not start.`;
				roots.push(resolved.value);
			}
			for (const target of targets) {
				const resolved = canonicalDestination(target, canonicalPath);
				if (!resolved.ok) return `Cannot establish the MSIX write location for ${resolved.error.path}: ${resolved.error.detail}. Rerun ${operation} from a terminal that this app did not start.`;
				if (roots.some((root) => pathWithin(resolved.value, root))) redirected.push(target);
			}
			if (redirected.length === 0) return undefined;
			return `This process was started by MSIX package ${view.packageFamilyName}, which redirects its writes under ${view.virtualizedRoots.join(" and ")} into the package's private storage. Changes to ${redirected.join(", ")} would not reach the files other apps read. Rerun ${operation} from a terminal that this app did not start.`;
		};
		packageReadTargetChanged = async (view, configPath) => {
			if (configPath !== view.appDataConfigPath) return ok(false);
			try {
				await lstat(view.privateConfigPath);
				return ok(true);
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && (cause.code === "ENOENT" || cause.code === "ENOTDIR")) return ok(false);
				return err({
					_tag: "MsixReadTargetInspectionFailure",
					path: view.privateConfigPath,
					detail: cause instanceof Error ? cause.message : String(cause),
					cause
				});
			}
		};
	})))();
}

//#endregion
//#region dist/application/ClaudeDesktopConfigLocation.js
var CONFIG_FILE, PROCESS_VIEW_PROBES, ROAMING_DIRECTORY_LIMIT, ROAMING_DEPTH_LIMIT, ROAMING_ENTRY_LIMIT, PROBES_PER_DIRECTORY, CLAUDE_DESKTOP_PACKAGE_FAMILY, CLAUDE_PACKAGE_FAMILY, readNames, systemFileSystem, resolveWindowsClaudeDesktopLocation, processView, resolveAppData, claudeFolderProbes, roamingProbes, isPrivateFile, entryKind, present, isMissing, errorMessage;
function init_ClaudeDesktopConfigLocation() {
	return (init_ClaudeDesktopConfigLocation = __esmMin((() => {
		init_result();
		init_MsixPackageStorage();
		CONFIG_FILE = "claude_desktop_config.json";
		PROCESS_VIEW_PROBES = 8;
		ROAMING_DIRECTORY_LIMIT = 64;
		ROAMING_DEPTH_LIMIT = 4;
		ROAMING_ENTRY_LIMIT = 1024;
		PROBES_PER_DIRECTORY = 2;
		CLAUDE_DESKTOP_PACKAGE_FAMILY = "Claude_pzs8sxrjxfjjc";
		CLAUDE_PACKAGE_FAMILY = /^(?:AnthropicPBC\.)?Claude_[0-9a-hjkmnp-tv-z]{13}$/iu;
		readNames = (path, limit) => {
			const directory = opendirSync(path);
			const names = [];
			try {
				while (names.length < limit) {
					const entry = directory.readSync();
					if (entry === null) break;
					names.push(entry.name);
				}
			} finally {
				directory.closeSync();
			}
			return names;
		};
		systemFileSystem = {
			readdir: (path, limit) => limit === undefined ? readdirSync(path) : readNames(path, limit),
			lstat: (path) => lstatSync(path),
			realpath: (path) => realpathSync.native(path)
		};
		resolveWindowsClaudeDesktopLocation = (home, env, fileSystem = systemFileSystem) => {
			const roots = windowsAppDataRoots(home, env);
			const appDataDirectory = join(roots.roaming, "Claude");
			const appDataConfigPath = join(appDataDirectory, CONFIG_FILE);
			const packagesDirectory = join(roots.local, "Packages");
			let families;
			try {
				families = fileSystem.readdir(packagesDirectory).filter((name) => CLAUDE_PACKAGE_FAMILY.test(name));
			} catch (cause) {
				if (!isMissing(cause)) return err({
					path: packagesDirectory,
					message: `MSIX package storage ${packagesDirectory} could not be inspected, so REA cannot establish whether Claude Desktop reads ${appDataConfigPath} or a package-private copy: ${errorMessage(cause)}. Repair access to that directory, then rerun.`
				});
				families = [];
			}
			const foreign = families.filter((name) => name.toLowerCase() !== CLAUDE_DESKTOP_PACKAGE_FAMILY.toLowerCase());
			if (foreign.length > 0) return err({
				path: join(packagesDirectory, foreign[0] ?? ""),
				message: `MSIX package storage ${foreign.map((name) => join(packagesDirectory, name)).join(", ")} has an unrecognized Claude Desktop package identity or deployment (the supported identity is ${CLAUDE_DESKTOP_PACKAGE_FAMILY}). REA cannot establish which ${CONFIG_FILE} that package reads and does not fall back to ${appDataConfigPath}. Quit Claude Desktop fully and register REA in the configuration the installed app reads.`
			});
			const migratedDirectory = join(roots.local, "Claude-Data", CLAUDE_DESKTOP_PACKAGE_FAMILY.toLowerCase());
			const migrated = present(fileSystem, migratedDirectory);
			const migratedConfigPath = join(migratedDirectory, CONFIG_FILE);
			const migrationFailure = !migrated.ok ? migrated.error : migrated.value ? {
				path: migratedConfigPath,
				message: `Found migrated Claude Desktop storage at ${migratedDirectory}. REA cannot verify which configuration the installed app reads. Quit Claude Desktop fully, verify whether it reads ${migratedConfigPath}, then register REA manually in the active file.`
			} : undefined;
			const family = families[0];
			if (family === undefined) return migrationFailure === undefined ? ok({
				configPath: appDataConfigPath,
				markerPath: appDataDirectory
			}) : err(migrationFailure);
			const container = join(packagesDirectory, family);
			const privateRoaming = join(container, "LocalCache", "Roaming");
			const privateDirectory = join(privateRoaming, "Claude");
			const privateConfigPath = join(privateDirectory, CONFIG_FILE);
			const privateCopy = present(fileSystem, privateConfigPath);
			const packageView = () => ({
				packageFamilyName: family,
				privateConfigPath,
				appDataConfigPath,
				virtualizedRoots: [roots.roaming, roots.local],
				processView: processView(fileSystem, privateRoaming, roots.roaming, privateCopy.ok && privateCopy.value)
			});
			if (migrationFailure !== undefined) return err({
				...migrationFailure,
				msixPackage: packageView()
			});
			if (!privateCopy.ok) return privateCopy;
			const appDataCopy = privateCopy.value ? ok(false) : present(fileSystem, appDataConfigPath);
			if (!appDataCopy.ok) return appDataCopy;
			return ok({
				configPath: privateCopy.value || !appDataCopy.value ? privateConfigPath : appDataConfigPath,
				markerPath: container,
				msixPackage: packageView()
			});
		};
		processView = (fileSystem, privateRoaming, appDataRoaming, privateConfig) => {
			const entryBudget = { inspected: 0 };
			const ownProbes = privateConfig ? [join("Claude", CONFIG_FILE)] : claudeFolderProbes(fileSystem, privateRoaming, entryBudget);
			const probes = ownProbes.length > 0 ? ownProbes : roamingProbes(fileSystem, privateRoaming, entryBudget);
			let view = "unknown";
			for (const probe of probes) {
				let privateTarget;
				try {
					privateTarget = fileSystem.realpath(join(privateRoaming, probe));
				} catch (cause) {
					void cause;
					continue;
				}
				const appDataPath = join(appDataRoaming, probe);
				const first = resolveAppData(fileSystem, appDataPath);
				if (first === undefined) return "unknown";
				if (first === privateTarget) return "redirected";
				if (!isPrivateFile(fileSystem, privateRoaming, probe)) continue;
				const second = resolveAppData(fileSystem, appDataPath);
				if (second === undefined) return "unknown";
				if (second === privateTarget) return "redirected";
				if (second === first) view = "direct";
			}
			return view;
		};
		resolveAppData = (fileSystem, path) => {
			try {
				return fileSystem.realpath(path);
			} catch (cause) {
				return isMissing(cause) ? null : undefined;
			}
		};
		claudeFolderProbes = (fileSystem, privateRoaming, entryBudget) => {
			try {
				const remaining = ROAMING_ENTRY_LIMIT - entryBudget.inspected;
				if (remaining <= 0) return [];
				const names = fileSystem.readdir(join(privateRoaming, "Claude"), remaining);
				entryBudget.inspected += names.length;
				const probes = [];
				for (const name of names) {
					if (isPrivateFile(fileSystem, privateRoaming, join("Claude", name))) {
						probes.push(join("Claude", name));
						if (probes.length === PROCESS_VIEW_PROBES) break;
					}
				}
				return probes;
			} catch (cause) {
				void cause;
				return [];
			}
		};
		roamingProbes = (fileSystem, privateRoaming, entryBudget) => {
			const probes = [];
			const queue = [{
				path: "",
				depth: 0
			}];
			for (let listed = 0; listed < ROAMING_DIRECTORY_LIMIT && probes.length < PROCESS_VIEW_PROBES && entryBudget.inspected < ROAMING_ENTRY_LIMIT; listed++) {
				const directory = queue.shift();
				if (directory === undefined) break;
				let names;
				try {
					const enumerated = fileSystem.readdir(join(privateRoaming, directory.path), ROAMING_ENTRY_LIMIT - entryBudget.inspected);
					entryBudget.inspected += enumerated.length;
					names = [...enumerated].sort();
				} catch (cause) {
					void cause;
					continue;
				}
				let taken = 0;
				for (const name of names) {
					const wantsFile = taken < PROBES_PER_DIRECTORY;
					const wantsFolder = directory.depth < ROAMING_DEPTH_LIMIT && listed + queue.length < ROAMING_DIRECTORY_LIMIT - 1;
					if (!wantsFile && !wantsFolder) break;
					const path = join(directory.path, name);
					const entry = entryKind(fileSystem, join(privateRoaming, path));
					if (entry === "file" && wantsFile) {
						probes.push(path);
						taken += 1;
						if (probes.length === PROCESS_VIEW_PROBES) break;
					} else if (entry === "directory" && wantsFolder) queue.push({
						path,
						depth: directory.depth + 1
					});
				}
			}
			return probes;
		};
		isPrivateFile = (fileSystem, privateRoaming, path) => entryKind(fileSystem, join(privateRoaming, path)) === "file";
		entryKind = (fileSystem, path) => {
			try {
				const entry = fileSystem.lstat(path);
				return entry.isFile() ? "file" : entry.isDirectory() ? "directory" : undefined;
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		present = (fileSystem, path) => {
			try {
				fileSystem.lstat(path);
				return ok(true);
			} catch (cause) {
				if (isMissing(cause)) return ok(false);
				return err({
					path,
					message: `${path} could not be inspected, so REA cannot establish which ${CONFIG_FILE} Claude Desktop's MSIX package reads: ${errorMessage(cause)}. Repair access to that path, then rerun.`
				});
			}
		};
		isMissing = (cause) => cause instanceof Error && "code" in cause && (cause.code === "ENOENT" || cause.code === "ENOTDIR");
		errorMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
	})))();
}

//#endregion
//#region dist/application/SupportedClients.js
var xdgConfigHome, vscodeUserDirectory, traeUserDirectory, claudeDesktopLocation, claudeCodeConfigDirectory, claudeCodeMarkerDirectory, codexDirectory, kimiDirectory, compactInputSchemaByDefault, lmStudioLocation, qoderDirectory, factoryDirectory, qwenCodeDirectory, grokDirectory, dshDirectory, dshHomeDirectory, dshPatchDirectory, hermesDirectory, grokBotDirectory, GROK_BOT_MANUAL_REGISTRATION_REMEDIATION, manualRegistrationRemediation, registrationPersistenceDetail, registrationWriteBlocker, appDataRedirection, OMP_PROFILE_NAME, OMP_RESERVED_PROFILE, ompAgentDirectory, piAgentDirectory, copilotDirectory, commandCodeDirectory, openCodeOverrideDirectory, opencodeDirectory, openCodeConfigurationPaths, existingOpenCodeConfigPath, geminiSettings, devinDirectory, freebuffProfileDirectory, SUPPORTED_CLIENT_DEFINITIONS, clientEvidencePaths, clientOwnershipEvidencePaths, clientSharedRegistrationPaths, resolvePath, resolveLocation, supportedClients, clientSkillDirectories;
function init_SupportedClients() {
	return (init_SupportedClients = __esmMin((() => {
		init_result();
		init_HermesClientHome();
		init_unicodeCodePointOrder();
		init_callerPath();
		init_ClaudeDesktopConfigLocation();
		init_MsixPackageStorage();
		xdgConfigHome = ({ home, env }) => env.XDG_CONFIG_HOME || join(home, ".config");
		vscodeUserDirectory = ({ home, platform, env }) => {
			const userData = env.VSCODE_PORTABLE ? join(env.VSCODE_PORTABLE, "user-data") : env.VSCODE_APPDATA ? join(env.VSCODE_APPDATA, "Code") : platform === "win32" ? join(windowsAppDataRoots(home, env).roaming, "Code") : platform === "darwin" ? join(home, "Library", "Application Support", "Code") : join(xdgConfigHome({
				home,
				platform,
				env
			}), "Code");
			const absoluteUserData = platform === "win32" && win32.isAbsolute(userData) && !isAbsolute(userData) ? userData : isAbsolute(userData) ? resolve(userData) : resolve(env.VSCODE_CWD || process.cwd(), userData);
			return join(absoluteUserData, "User");
		};
		traeUserDirectory = ({ home, platform, env }) => {
			if (platform === "win32") return join(windowsAppDataRoots(home, env).roaming, "Trae", "User");
			if (platform === "darwin") return join(home, "Library", "Application Support", "Trae", "User");
			return join(xdgConfigHome({
				home,
				platform,
				env
			}), "Trae", "User");
		};
		claudeDesktopLocation = (context) => {
			if (context.platform === "win32") return resolveWindowsClaudeDesktopLocation(context.home, context.env);
			const directory = context.platform === "linux" ? join(xdgConfigHome(context), "Claude") : join(context.home, "Library", "Application Support", "Claude");
			return ok({
				configPath: join(directory, "claude_desktop_config.json"),
				markerPath: directory
			});
		};
		claudeCodeConfigDirectory = ({ home, env }) => env.CLAUDE_CONFIG_DIR || home;
		claudeCodeMarkerDirectory = ({ home, env }) => env.CLAUDE_CONFIG_DIR || join(home, ".claude");
		codexDirectory = ({ home, env }) => env.CODEX_HOME || join(home, ".codex");
		kimiDirectory = ({ home, env }) => env.KIMI_CODE_HOME || join(home, ".kimi-code");
		compactInputSchemaByDefault = ({ name }) => name === "kimi" || name === "lm_studio";
		lmStudioLocation = ({ home }) => {
			const pointerPath = join(home, ".lmstudio-home-pointer");
			let directory;
			try {
				directory = readFileSync(pointerPath, "utf8").trim();
			} catch (cause) {
				if (!(cause instanceof Error && "code" in cause && cause.code === "ENOENT")) return err({
					path: pointerPath,
					message: `${pointerPath} could not be read, so REA cannot establish which LM Studio home holds mcp.json: ${cause instanceof Error ? cause.message : String(cause)}. Repair access to that file, then rerun.`
				});
				const cache = join(home, ".cache", "lm-studio");
				directory = existsSync(cache) ? cache : join(home, ".lmstudio");
			}
			if (!isAbsolute(directory)) return err({
				path: pointerPath,
				message: `${pointerPath} does not hold an absolute LM Studio home path. Correct or remove that file, then rerun.`
			});
			return ok({
				configPath: join(directory, "mcp.json"),
				markerPath: directory
			});
		};
		qoderDirectory = ({ home, env }) => env.QODER_CONFIG_DIR || join(home, ".qoder");
		factoryDirectory = ({ home, env }) => join(env.FACTORY_HOME_OVERRIDE || home, ".factory");
		qwenCodeDirectory = ({ home, env }) => {
			const override = env.QWEN_HOME;
			if (!override) return join(home, ".qwen");
			const expanded = override === "~" ? home : override.startsWith("~/") || override.startsWith("~\\") ? join(home, ...override.slice(2).split(/[/\\]+/).filter(Boolean)) : override;
			return isAbsolute(expanded) ? expanded : resolve(expanded);
		};
		grokDirectory = ({ home, env }) => env.GROK_HOME || join(home, ".grok");
		dshDirectory = (home, override, fallback) => {
			const selected = override !== undefined && override.trim().length > 0 ? override : join(home, fallback);
			const expanded = selected === "~" ? home : selected.startsWith("~/") || selected.startsWith("~\\") ? join(home, selected.slice(2)) : selected;
			return resolve(expanded);
		};
		dshHomeDirectory = ({ home, env }) => dshDirectory(home, env.DSH_HOME, ".dsh");
		dshPatchDirectory = (context) => join(dshHomeDirectory(context), "cordis.patch.yml");
		hermesDirectory = ({ home, platform, env }) => resolveHermesClientHome(home, platform, env);
		grokBotDirectory = ({ home, env }) => {
			const root = env.SAND_DATA_ROOT;
			return root !== undefined && root !== "" && isAbsolute(root) ? root : join(home, ".grokbot");
		};
		GROK_BOT_MANUAL_REGISTRATION_REMEDIATION = "Grok Bot keeps connectors in the signed-in account and runs them on its hosted computer. Setup does not write that account store, and a data-directory mcp.json is not a registration. In the Grok Bot chat, add a custom MCP server named rea that runs on the Bot's computer with `npx -y rea-agents@<version> mcp`. Do not put credentials in the command or arguments. A stdio server on this machine is not attached.";
		manualRegistrationRemediation = (clientName) => clientName === "grok_bot" ? GROK_BOT_MANUAL_REGISTRATION_REMEDIATION : undefined;
		registrationPersistenceDetail = (client) => {
			const name = client.displayName ?? client.name;
			const msix = client.msixPackage;
			const packageDetail = msix === undefined ? undefined : client.configPath === msix.privateConfigPath ? `${name} is installed as MSIX package ${msix.packageFamilyName}, which reads this package-private file instead of ${msix.appDataConfigPath}.` : `${name} is installed as MSIX package ${msix.packageFamilyName}, which reads this file until it saves its own copy at ${msix.privateConfigPath}.`;
			const quitDetail = client.quitBeforeSetup === true ? `Quit ${name} fully before approving; closing its window is not enough. A running ${name} can rewrite this file from memory and drop the registration. Start it again after setup.` : undefined;
			const details = [packageDetail, quitDetail].filter((detail) => detail !== undefined);
			return details.length === 0 ? undefined : details.join(" ");
		};
		registrationWriteBlocker = (client, operation) => {
			const msix = client.msixPackage;
			if (msix === undefined || msix.processView === "direct") return undefined;
			const name = client.displayName ?? client.name;
			if (msix.processView === "redirected") return `This process was started from ${name}'s MSIX package ${msix.packageFamilyName}: its AppData is redirected into that package, so ${name} is running and would overwrite ${msix.privateConfigPath} from memory. Quit ${name} fully, then rerun ${operation} from a terminal that ${name} did not start.`;
			const manualEdit = operation === "setup" ? `Add REA's entry to ${client.configPath} by hand` : `Remove REA's entry by hand from each of ${msix.privateConfigPath} and ${msix.appDataConfigPath} that has one`;
			return `REA cannot tell whether ${name}'s MSIX package ${msix.packageFamilyName} started this process, because no private file under ${dirname(dirname(msix.privateConfigPath))} could be compared with ${dirname(dirname(msix.appDataConfigPath))}, and a ${name} that started it would overwrite the change from memory. ${manualEdit} while ${name} is fully quit, or rerun ${operation} from a terminal that ${name} did not start once REA can compare a private file there.`;
		};
		appDataRedirection = (clients) => clients.find(({ msixPackage }) => msixPackage?.processView === "redirected")?.msixPackage;
		OMP_PROFILE_NAME = /^[a-z0-9][a-z0-9._-]{0,63}$/u;
		OMP_RESERVED_PROFILE = /^(?:CON|PRN|AUX|NUL|COM[0-9]|LPT[0-9])(?:\..*)?$/iu;
		ompAgentDirectory = (context) => {
			const root = join(context.home, context.env.PI_CONFIG_DIR || ".omp");
			const profile = (context.env.OMP_PROFILE ?? context.env.PI_PROFILE)?.trim();
			if (profile !== undefined && profile !== "" && profile !== "default") {
				if (!OMP_PROFILE_NAME.test(profile) || profile.endsWith(".") || OMP_RESERVED_PROFILE.test(profile)) return err({
					path: root,
					message: `Invalid OMP profile ${JSON.stringify(profile)}: names must match ^[a-z0-9][a-z0-9._-]{0,63}$, cannot end with ".", and cannot be a Windows reserved device name (CON, PRN, AUX, NUL, COM0-9, LPT0-9, including extensions). Repair OMP_PROFILE or PI_PROFILE before configuring OMP.`
				});
				return ok(join(root, "profiles", profile, "agent"));
			}
			const override = context.env.PI_CODING_AGENT_DIR;
			return ok(override ? resolve(override) : join(root, "agent"));
		};
		piAgentDirectory = ({ home, platform, env }) => {
			const paths = platform === "win32" ? win32 : { join };
			let directory = env.PI_CODING_AGENT_DIR;
			if (!directory) return paths.join(home, ".pi", "agent");
			if (platform === "win32" && directory.startsWith("/") && !directory.startsWith("//") && !directory.includes("\\")) {
				const drive = /^\/(?:mnt\/|cygdrive\/)?([a-z])(?:\/(.*))?$/iu.exec(directory);
				if (drive !== null) directory = `${drive[1]?.toUpperCase()}:\\${drive[2]?.replaceAll("/", "\\") ?? ""}`;
			}
			if (directory === "~") return home;
			if (directory.startsWith("~/") || platform === "win32" && directory.startsWith("~\\")) return paths.join(home, directory.slice(2));
			if (directory.startsWith("file://")) return fileURLToPath(directory, { windows: platform === "win32" });
			return directory;
		};
		copilotDirectory = ({ home, env }) => env.COPILOT_HOME || join(home, ".copilot");
		commandCodeDirectory = ({ home }) => join(home, ".commandcode");
		openCodeOverrideDirectory = (env) => {
			const directory = env.OPENCODE_CONFIG_DIR;
			return directory === undefined || directory === "" ? undefined : directory;
		};
		opencodeDirectory = (context) => openCodeOverrideDirectory(context.env) ?? join(xdgConfigHome(context), "opencode");
		openCodeConfigurationPaths = (context) => {
			const directory = join(xdgConfigHome(context), "opencode");
			const overrideDirectory = openCodeOverrideDirectory(context.env);
			const paths = [
				join(directory, "config.json"),
				join(directory, "opencode.json"),
				join(directory, "opencode.jsonc"),
				...context.env.OPENCODE_CONFIG ? [context.env.OPENCODE_CONFIG] : [],
				...overrideDirectory !== undefined ? [join(overrideDirectory, "opencode.json"), join(overrideDirectory, "opencode.jsonc")] : []
			];
			const resolved = paths.map((path) => resolve(path));
			return resolved.filter((path, index) => resolved.lastIndexOf(path) === index);
		};
		existingOpenCodeConfigPath = (context) => {
			const overrideDirectory = openCodeOverrideDirectory(context.env);
			const candidates = overrideDirectory !== undefined ? [join(overrideDirectory, "opencode.json"), join(overrideDirectory, "opencode.jsonc")].map((path) => resolve(path)) : context.env.OPENCODE_CONFIG ? [resolve(context.env.OPENCODE_CONFIG)] : [join(opencodeDirectory(context), "opencode.json"), join(opencodeDirectory(context), "opencode.jsonc")].map((path) => resolve(path));
			return [...candidates].reverse().find((path) => {
				try {
					lstatSync(path);
					return true;
				} catch (cause) {
					return !(cause instanceof Error && "code" in cause && cause.code === "ENOENT");
				}
			}) ?? resolve(overrideDirectory !== undefined ? join(overrideDirectory, "opencode.json") : context.env.OPENCODE_CONFIG || join(opencodeDirectory(context), "opencode.json"));
		};
		geminiSettings = ({ home, platform, env }) => {
			const system = env.GEMINI_CLI_SYSTEM_SETTINGS_PATH || (platform === "darwin" ? "/Library/Application Support/GeminiCli/settings.json" : platform === "win32" ? "C:\\ProgramData\\gemini-cli\\settings.json" : "/etc/gemini-cli/settings.json");
			const trustOverride = env.GEMINI_RESTRICTED_MODE === "true" || env.GEMINI_CLI_TRUST_WORKSPACE === "false" ? false : env.GEMINI_CLI_TRUST_WORKSPACE === "true" ? true : undefined;
			return {
				systemPath: system,
				defaultsPath: env.GEMINI_CLI_SYSTEM_DEFAULTS_PATH || join(dirname(system), "system-defaults.json"),
				workspaceDirectory: process.cwd(),
				trustedFoldersPath: env.GEMINI_CLI_TRUSTED_FOLDERS_PATH || join(env.GEMINI_CLI_HOME || home, ".gemini", "trustedFolders.json"),
				...trustOverride === undefined ? {} : { trustOverride },
				platform
			};
		};
		devinDirectory = ({ home, platform, env }) => platform === "win32" ? join(windowsAppDataRoots(home, env).roaming, "devin") : join(env.XDG_CONFIG_HOME || join(home, ".config"), "devin");
		freebuffProfileDirectory = ({ home }) => join(home, ".config", "freebuff-desktop");
		SUPPORTED_CLIENT_DEFINITIONS = [
			{
				name: "claude_code",
				displayName: "Claude Code",
				skillPath: (context) => join(claudeCodeMarkerDirectory(context), "skills"),
				configPath: (context) => join(claudeCodeConfigDirectory(context), ".claude.json"),
				markerPath: claudeCodeMarkerDirectory,
				format: "claude_code"
			},
			{
				name: "claude_desktop",
				displayName: "Claude Desktop",
				location: claudeDesktopLocation,
				quitBeforeSetup: true,
				format: "json"
			},
			{
				name: "codex",
				displayName: "Codex",
				configPath: (context) => appendCallerPath(codexDirectory(context), "config.toml"),
				markerPath: codexDirectory,
				format: "toml"
			},
			{
				name: "cursor",
				displayName: "Cursor",
				configPath: [".cursor", "mcp.json"],
				markerPath: [".cursor"],
				format: "json"
			},
			{
				name: "gemini_cli",
				displayName: "Gemini CLI",
				geminiSettings,
				configPath: ({ home, env }) => join(env.GEMINI_CLI_HOME || home, ".gemini", "settings.json"),
				markerPath: ({ home, env }) => join(env.GEMINI_CLI_HOME || home, ".gemini"),
				skillPath: ({ home, env }) => join(env.GEMINI_CLI_HOME || home, ".agents", "skills"),
				format: "json"
			},
			{
				name: "windsurf",
				displayName: "Windsurf",
				configPath: [
					".codeium",
					"windsurf",
					"mcp_config.json"
				],
				markerPath: [".codeium", "windsurf"],
				format: "json"
			},
			{
				name: "devin",
				displayName: "Devin",
				configPath: ({ home, platform, env }) => join(devinDirectory({
					home,
					platform,
					env
				}), "mcp_config.json"),
				markerPath: devinDirectory,
				format: "json"
			},
			{
				name: "opencode",
				displayName: "OpenCode",
				configPath: existingOpenCodeConfigPath,
				configPaths: openCodeConfigurationPaths,
				markerPath: opencodeDirectory,
				format: "opencode"
			},
			{
				name: "antigravity",
				displayName: "Antigravity",
				skillPath: [
					".gemini",
					"config",
					"skills"
				],
				configPath: [
					".gemini",
					"config",
					"mcp_config.json"
				],
				markerPath: [".gemini", "config"],
				format: "json"
			},
			{
				name: "copilot_cli",
				displayName: "GitHub Copilot CLI",
				configPath: (context) => join(copilotDirectory(context), "mcp-config.json"),
				markerPath: copilotDirectory,
				format: "copilot_cli"
			},
			{
				name: "commandcode",
				displayName: "Command Code",
				configPath: (context) => join(commandCodeDirectory(context), "mcp.json"),
				markerPath: commandCodeDirectory,
				format: "commandcode"
			},
			{
				name: "qwen_code",
				displayName: "Qwen Code",
				configPath: (context) => join(qwenCodeDirectory(context), "settings.json"),
				markerPath: qwenCodeDirectory,
				format: "json"
			},
			{
				name: "kimi",
				displayName: "Kimi Code",
				configPath: (context) => join(kimiDirectory(context), "mcp.json"),
				markerPath: kimiDirectory,
				format: "kimi"
			},
			{
				name: "vscode",
				displayName: "VS Code",
				configPath: (context) => join(vscodeUserDirectory(context), "mcp.json"),
				markerPath: vscodeUserDirectory,
				format: "vscode"
			},
			{
				name: "trae",
				displayName: "Trae",
				skillPath: [".trae", "skills"],
				configPath: (context) => join(traeUserDirectory(context), "mcp.json"),
				markerPath: traeUserDirectory,
				format: "json"
			},
			{
				name: "workbuddy",
				displayName: "WorkBuddy",
				skillPath: [".workbuddy", "skills"],
				configPath: [".workbuddy", "mcp.json"],
				markerPath: [".workbuddy"],
				format: "json"
			},
			{
				name: "lm_studio",
				displayName: "LM Studio",
				location: lmStudioLocation,
				format: "lm_studio"
			},
			{
				name: "grok_build",
				displayName: "Grok Build",
				configPath: (context) => join(grokDirectory(context), "config.toml"),
				markerPath: grokDirectory,
				format: "grok"
			},
			{
				name: "omp",
				displayName: "OMP",
				configPath: (context) => {
					const directory = ompAgentDirectory(context);
					return directory.ok ? ok(join(directory.value, "mcp.json")) : directory;
				},
				markerPath: ompAgentDirectory,
				format: "omp"
			},
			{
				name: "pi",
				displayName: "Pi",
				configPath: (context) => (context.platform === "win32" ? win32 : { join }).join(piAgentDirectory(context), "mcp.json"),
				markerPath: piAgentDirectory,
				format: "pi"
			},
			{
				name: "hermes",
				displayName: "Hermes",
				skillPath: (context) => appendCallerPath(hermesDirectory(context), "skills"),
				configPath: (context) => appendCallerPath(hermesDirectory(context), "config.yaml"),
				markerPath: hermesDirectory,
				format: "hermes"
			},
			{
				name: "qoder",
				displayName: "Qoder",
				skillPath: (context) => join(qoderDirectory(context), "skills"),
				configPath: (context) => join(qoderDirectory(context), "settings.json"),
				markerPath: qoderDirectory,
				format: "json"
			},
			{
				name: "droid",
				displayName: "Factory Droid",
				skillPath: (context) => join(factoryDirectory(context), "skills"),
				configPath: (context) => join(factoryDirectory(context), "mcp.json"),
				markerPath: factoryDirectory,
				format: "json"
			},
			{
				name: "zcode",
				zcodeFallbackPath: ({ home }) => join(home, ".agents", "mcp.json"),
				displayName: "ZCode",
				configPath: [
					".zcode",
					"cli",
					"config.json"
				],
				markerPath: [".zcode", "cli"],
				skillPath: [".zcode", "skills"],
				discoveryPaths: ({ home }) => [join(home, ".zcode", "cli")],
				format: "zcode"
			},
			{
				name: "dsh",
				displayName: "DeepSeek Harness",
				skillPath: ({ home, env }) => join(dshDirectory(home, env.DSH_AGENTS_HOME, ".agents"), "skills"),
				configPath: dshPatchDirectory,
				markerPath: dshHomeDirectory,
				format: "dsh"
			},
			{
				name: "freebuff",
				displayName: "FreeBuff",
				skillPath: ({ home }) => join(home, ".agents", "skills"),
				configPath: ({ home }) => join(home, ".agents", "mcp.json"),
				markerPath: freebuffProfileDirectory,
				discoveryPaths: (context) => [freebuffProfileDirectory(context)],
				sharedRegistration: true,
				format: "json"
			},
			{
				name: "grok_bot",
				displayName: "Grok Bot",
				configPath: grokBotDirectory,
				markerPath: grokBotDirectory,
				format: "unsupported"
			}
		];
		clientEvidencePaths = (client) => [...new Set((client.discoveryPaths ?? [
			client.configPath,
			...client.configPaths ?? [],
			client.markerPath
		]).filter((path) => path !== undefined && path.length > 0))];
		clientOwnershipEvidencePaths = (client) => client.sharedRegistration === true ? [client.configPath, ...client.configPaths ?? []].filter((path) => path !== undefined && path.length > 0) : [];
		clientSharedRegistrationPaths = (client) => new Set([...clientOwnershipEvidencePaths(client), ...client.zcodeFallbackPath === undefined ? [] : [client.zcodeFallbackPath]]);
		resolvePath = (path, context) => {
			const resolved = typeof path === "function" ? path(context) : join(context.home, ...path);
			return typeof resolved === "string" ? ok(resolved) : resolved;
		};
		resolveLocation = (definition, context) => {
			if (definition.location !== undefined) return definition.location(context);
			const config = resolvePath(definition.configPath, context);
			if (!config.ok) return config;
			const marker = resolvePath(definition.markerPath, context);
			return marker.ok ? ok({
				configPath: config.value,
				markerPath: marker.value
			}) : marker;
		};
		supportedClients = (home, platform = process.platform, env = process.env) => {
			const context = {
				home,
				platform,
				env
			};
			const definitions = SUPPORTED_CLIENT_DEFINITIONS;
			return definitions.map((definition) => {
				try {
					const location = resolveLocation(definition, context);
					if (!location.ok) return {
						name: definition.name,
						displayName: definition.displayName,
						format: definition.format,
						configPath: location.error.path,
						configPathError: location.error.message,
						...location.error.msixPackage === undefined ? {} : { msixPackage: location.error.msixPackage }
					};
					const { configPath, markerPath, msixPackage } = location.value;
					return {
						name: definition.name,
						displayName: definition.displayName,
						configPath,
						...definition.geminiSettings === undefined ? {} : { geminiSettings: definition.geminiSettings(context) },
						...definition.configPaths === undefined ? {} : { configPaths: [...new Set([...definition.configPaths(context), configPath])] },
						...definition.zcodeFallbackPath === undefined ? {} : { zcodeFallbackPath: definition.zcodeFallbackPath(context) },
						markerPath,
						...msixPackage === undefined ? {} : { msixPackage },
						...definition.quitBeforeSetup === true ? { quitBeforeSetup: true } : {},
						...definition.discoveryPaths === undefined ? {} : { discoveryPaths: definition.discoveryPaths(context) },
						...definition.sharedRegistration === true ? { sharedRegistration: true } : {},
						format: definition.format
					};
				} catch (cause) {
					if (cause instanceof HermesClientPathError) return {
						name: definition.name,
						displayName: definition.displayName,
						format: definition.format,
						configPath: cause.path,
						configPathError: cause.message
					};
					if (definition.name !== "pi") throw cause;
					return {
						name: definition.name,
						displayName: definition.displayName,
						format: definition.format,
						configPath: env.PI_CODING_AGENT_DIR ?? "",
						configPathError: `Invalid PI_CODING_AGENT_DIR: ${cause instanceof Error ? cause.message : String(cause)}. Repair the override before configuring Pi.`
					};
				}
			});
		};
		clientSkillDirectories = (home, clientIds, environment = {}, platform = process.platform) => {
			const unresolved = [];
			const definitions = SUPPORTED_CLIENT_DEFINITIONS;
			const selected = clientIds === undefined ? ["shared", ...definitions.filter(({ skillPath }) => skillPath !== undefined).map(({ name }) => name)] : clientIds.length === 0 ? ["shared"] : clientIds;
			const sharedDirectory = appendCallerPath(home, ".agents/skills", platform);
			const destinations = new Map();
			for (const client of selected) {
				const definition = definitions.find(({ name }) => name === client);
				if (definition === undefined && client !== "shared") {
					unresolved.push({
						client,
						path: client,
						detail: `Unsupported skill client: ${client}`
					});
					continue;
				}
				let directory;
				try {
					const resolved = definition?.skillPath === undefined ? ok(sharedDirectory) : resolvePath(definition.skillPath, {
						home,
						platform,
						env: environment
					});
					if (!resolved.ok) {
						unresolved.push({
							client,
							path: resolved.error.path,
							detail: resolved.error.message
						});
						continue;
					}
					directory = resolved.value;
				} catch (cause) {
					if (cause instanceof HermesClientPathError) {
						unresolved.push({
							client,
							path: cause.path,
							detail: cause.message
						});
						continue;
					}
					throw cause;
				}
				if (!destinations.has(directory)) destinations.set(directory, {
					client: directory === sharedDirectory ? "shared" : client,
					directory
				});
			}
			return {
				directories: [...destinations.values()].sort((left, right) => compareUnicodeCodePoints(left.directory, right.directory)),
				unresolved
			};
		};
	})))();
}

//#endregion
//#region dist/domain/skillManifest.js
var SkillManifestMetadataError, emptyMetadata, readFrontmatter, metadataOf, parseSkillManifestMetadata, addSkillManifestToolCount;
function init_skillManifest() {
	return (init_skillManifest = __esmMin((() => {
		init_result();
		SkillManifestMetadataError = class extends Error {
			metadata;
			_tag = "SkillManifestMetadataError";
			constructor(message, metadata) {
				super(message);
				this.metadata = metadata;
			}
		};
		emptyMetadata = () => ({
			version: null,
			toolCount: null,
			hasToolCount: false,
			hasCatalogDigest: false
		});
		readFrontmatter = (content) => {
			const opening = /^---\r?\n/u.exec(content);
			if (opening === null) return err(new SkillManifestMetadataError("Skill manifest has no YAML frontmatter", emptyMetadata()));
			const remainder = content.slice(opening[0].length);
			const closing = /^---(?:\r?\n|$)/mu.exec(remainder);
			if (closing === null) return err(new SkillManifestMetadataError("Skill manifest YAML frontmatter is unterminated", emptyMetadata()));
			const document = parseDocument(remainder.slice(0, closing.index), { logLevel: "silent" });
			if (document.errors.length > 0) return err(new SkillManifestMetadataError(`Invalid skill YAML frontmatter: ${document.errors.map((error) => error.message).join("; ")}`, emptyMetadata()));
			if (document.warnings.length > 0) return err(new SkillManifestMetadataError(`Unsupported skill YAML frontmatter: ${document.warnings.map((warning) => warning.message).join("; ")}`, emptyMetadata()));
			if (!isMap(document.contents)) return err(new SkillManifestMetadataError("Skill YAML frontmatter must be a mapping", emptyMetadata()));
			return ok({
				document,
				body: remainder.slice(closing.index + closing[0].length)
			});
		};
		metadataOf = (document) => {
			const metadata = document.get("metadata", true);
			if (metadata === undefined) return ok(emptyMetadata());
			if (!isMap(metadata)) return err(new SkillManifestMetadataError("Skill metadata must be a mapping", emptyMetadata()));
			const version = document.getIn(["metadata", "version"]);
			const toolCount = document.getIn(["metadata", "tool_count"]);
			const facts = {
				version: typeof version === "string" && version.length > 0 ? version : null,
				toolCount: typeof toolCount === "number" && Number.isSafeInteger(toolCount) && toolCount >= 0 ? toolCount : null,
				hasToolCount: metadata.has("tool_count"),
				hasCatalogDigest: metadata.has("catalog_digest")
			};
			const issues = [];
			if (metadata.has("version") && facts.version === null) issues.push("version must be a nonempty string");
			if (facts.hasToolCount && facts.toolCount === null) issues.push("tool_count must be a safe nonnegative integer");
			return issues.length === 0 ? ok(facts) : err(new SkillManifestMetadataError(`Invalid skill metadata: ${issues.join("; ")}`, facts));
		};
		parseSkillManifestMetadata = (content) => {
			const frontmatter = readFrontmatter(content);
			return frontmatter.ok ? metadataOf(frontmatter.value.document) : frontmatter;
		};
		addSkillManifestToolCount = (content, toolCount) => {
			const frontmatter = readFrontmatter(content);
			if (!frontmatter.ok) return frontmatter;
			const metadata = metadataOf(frontmatter.value.document);
			if (!metadata.ok) return metadata;
			if (metadata.value.version === null) return err(new SkillManifestMetadataError("Missing authored skill version", metadata.value));
			if (metadata.value.hasToolCount || metadata.value.hasCatalogDigest) return err(new SkillManifestMetadataError("Catalog metadata belongs in the generated skill, not the authored source", metadata.value));
			if (!Number.isSafeInteger(toolCount) || toolCount < 0) return err(new SkillManifestMetadataError("Generated tool_count must be a safe nonnegative integer", metadata.value));
			const { document, body } = frontmatter.value;
			document.setIn(["metadata", "tool_count"], toolCount);
			return ok(`---\n${document.toString({ lineWidth: 0 })}---\n${body}`);
		};
	})))();
}

//#endregion
//#region dist/filesystem/fileHandleMatchesBytes.js
var fileHandleMatchesBytes;
function init_fileHandleMatchesBytes() {
	return (init_fileHandleMatchesBytes = __esmMin((() => {
		fileHandleMatchesBytes = async (handle, expected) => {
			if ((await handle.stat()).size !== expected.length) return false;
			const chunk = Buffer.allocUnsafe(Math.min(64 * 1024, expected.length));
			for (let position = 0; position < expected.length;) {
				const { bytesRead } = await handle.read(chunk, 0, Math.min(chunk.length, expected.length - position), position);
				if (bytesRead === 0 || !chunk.subarray(0, bytesRead).equals(expected.subarray(position, position + bytesRead))) return false;
				position += bytesRead;
			}
			return true;
		};
	})))();
}

//#endregion
//#region dist/application/SkillFilePublication.js
var SkillDestinationChangedError, SkillFilePreparationFailure, SkillFilePublication, optionalState;
function init_SkillFilePublication() {
	return (init_SkillFilePublication = __esmMin((() => {
		init_AnalysisCleanupLease();
		init_fileHandleMatchesBytes();
		init_OwnedFileHandle();
		init_OwnedStagedOutput();
		init_RegularFile();
		SkillDestinationChangedError = class extends Error {
			path;
			_tag = "SkillDestinationChangedError";
			constructor(path, cause) {
				super(`Skill destination appeared or changed during installation: ${path}`, { cause });
				this.path = path;
			}
		};
		SkillFilePreparationFailure = class extends Error {
			publication;
			primary;
			cleanupCause;
			_tag = "SkillFilePreparationFailure";
			constructor(publication, primary, cleanupCause) {
				super(`Skill staging cleanup failed for ${publication.path}: ${primary instanceof Error ? primary.message : String(primary)}; cleanup: ${cleanupCause instanceof Error ? cleanupCause.message : String(cleanupCause)}`, { cause: new AggregateError([primary, cleanupCause]) });
				this.publication = publication;
				this.primary = primary;
				this.cleanupCause = cleanupCause;
			}
		};
		SkillFilePublication = class SkillFilePublication {
			path;
			bytes;
			original;
			staging;
			owner;
			stagedPath;
			#attempted = false;
			#restored = false;
			#publishedState;
			kind = "lease";
			resource;
			lease;
			constructor(path, bytes, original, staging, owner, stagedPath) {
				this.path = path;
				this.bytes = bytes;
				this.original = original;
				this.staging = staging;
				this.owner = owner;
				this.stagedPath = stagedPath;
				this.resource = staging.directory;
				this.lease = new AnalysisCleanupLease(() => staging.close(), [staging.directory]);
			}
			static async prepare(path, bytes, original) {
				const parent = await realpath(dirname(path));
				const destination = join(parent, basename(path));
				const directory = await mkdtemp(join(parent, ".rea-skill-"));
				const staging = await OwnedStagedOutput.create(directory);
				let publication;
				try {
					const stagedPath = join(directory, "content");
					const owner = new OwnedFileHandle(await open(stagedPath, constants.O_RDWR | constants.O_CREAT | constants.O_EXCL | (constants.O_NOFOLLOW ?? 0), 384));
					staging.setFile(owner);
					publication = new SkillFilePublication(destination, Buffer.from(bytes), original, staging, owner, stagedPath);
					await owner.handle.writeFile(bytes);
					const created = await owner.handle.stat();
					if (original !== undefined && (created.uid !== original.state.uid || created.gid !== original.state.gid)) await owner.handle.chown(original.state.uid, original.state.gid);
					await owner.handle.chmod(original?.mode ?? 384);
					await owner.handle.sync();
					await staging.assertReadyForPublication(stagedPath);
					return publication;
				} catch (primary) {
					try {
						await staging.close();
					} catch (cleanupCause) {
						if (publication === undefined) {
							const lease = new AnalysisCleanupLease(() => staging.close(), [directory]);
							throw new SkillFilePreparationFailure({
								path: destination,
								kind: "lease",
								resource: directory,
								lease,
								close: () => lease.release()
							}, primary, cleanupCause);
						}
						throw new SkillFilePreparationFailure(publication, primary, cleanupCause);
					}
					throw primary;
				}
			}
			async publish() {
				await this.staging.assertReadyForPublication(this.stagedPath);
				await this.#assertSelected();
				this.#attempted = true;
				if (this.original === undefined) {
					try {
						await link(this.stagedPath, this.path);
					} catch (cause) {
						if (cause instanceof Error && "code" in cause && cause.code === "EEXIST") {
							this.#attempted = false;
							throw new SkillDestinationChangedError(this.path, cause);
						}
						throw cause;
					}
				} else {
					await rename(this.stagedPath, this.path);
					this.staging.recordPublishedRename();
				}
				this.#publishedState = await this.owner.handle.stat();
			}
			async assertCurrent() {
				const before = this.#publishedState;
				if (before === undefined || !sameRegularFileState(before, await this.owner.handle.stat())) throw new SkillDestinationChangedError(this.path);
				await this.#assertNamed(before);
				if (!await fileHandleMatchesBytes(this.owner.handle, this.bytes)) throw new SkillDestinationChangedError(this.path);
				if (!sameRegularFileState(before, await this.owner.handle.stat())) throw new SkillDestinationChangedError(this.path);
				await this.#assertNamed(before);
			}
			/** Restore through the owned descriptor; a changed name never grants write authority. */
			async restore() {
				if (!this.#attempted || this.#restored) return;
				const named = await optionalState(this.path);
				if (this.original !== undefined && named !== undefined && sameRegularFileState(this.original.state, named)) return;
				if (this.original === undefined && named === undefined) return;
				await this.assertCurrent();
				if (this.original === undefined) throw new Error("First-install skill recovery requires manual removal; pathname deletion cannot prove ownership");
				const original = this.original;
				for (let position = 0; position < original.bytes.length;) {
					const { bytesWritten } = await this.owner.handle.write(original.bytes, position, original.bytes.length - position, position);
					if (bytesWritten === 0) throw new Error("Skill restoration made no write progress");
					position += bytesWritten;
				}
				await this.owner.handle.truncate(original.bytes.length);
				await this.owner.handle.chmod(original.mode);
				await this.owner.handle.sync();
				await this.#assertNamed(await this.owner.handle.stat());
				if (!await fileHandleMatchesBytes(this.owner.handle, original.bytes)) throw new SkillDestinationChangedError(this.path);
				this.#restored = true;
			}
			close() {
				return this.lease.release();
			}
			async #assertNamed(expected) {
				const named = await optionalState(this.path);
				if (expected.ino === 0 || named === undefined || named.isSymbolicLink() || !sameRegularFileState(expected, named)) throw new SkillDestinationChangedError(this.path);
			}
			async #assertSelected() {
				const current = await optionalState(this.path);
				if (this.original === undefined ? current !== undefined : current === undefined || current.isSymbolicLink() || !sameRegularFileState(this.original.state, current)) throw new SkillDestinationChangedError(this.path);
			}
		};
		optionalState = async (path) => {
			try {
				return await lstat(path);
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && cause.code === "ENOENT") return undefined;
				throw cause;
			}
		};
	})))();
}

//#endregion
//#region dist/application/SetupSkill.js
var MANAGED_SKILL_FILES, isManagedSkillManifest, readSkillFile, readSkillFileSnapshot, canonicalSkillContent, SetupSkillInstallError, systemSkillInstallFileOperations, skillDestinationSelection, skillDestinations, existingSkillDestinations, readOptionalSkillState, inspectSkillDirectory, skillDirectoryIssues, skillDirectoryFailure, validateCanonicalSkillDirectories, canonicalSkillFiles, inspectCanonicalSkill, canonicalSkillNeedsInstall, causeReason, causePath, closeSkillPublications, installCanonicalSkill, readInstalledSkillIdentity;
function init_SetupSkill() {
	return (init_SetupSkill = __esmMin((() => {
		init_callerPath();
		init_result();
		init_skillManifest();
		init_BoundedFileBytes();
		init_ArtifactReader();
		init_identity();
		init_RegularFile();
		init_OwnedRegularFile();
		init_RegularFileRead();
		init_SupportedClients();
		init_SetupRecoveryBackup();
		init_SkillFilePublication();
		MANAGED_SKILL_FILES = [
			"SKILL.md",
			"references/connection-and-recovery.md",
			"references/native-and-artifacts.md",
			"references/javascript-applications.md",
			"references/android-applications.md",
			"references/runtime-observation.md",
			"references/evidence-workflows.md",
			"references/environments.md"
		];
		isManagedSkillManifest = (content) => content.startsWith(`---\nname: ${PRODUCT_IDENTITY.skillName}\n`) || content.startsWith(`---\r\nname: ${PRODUCT_IDENTITY.skillName}\r\n`);
		readSkillFile = (path, resources, maxBytes = Number.MAX_SAFE_INTEGER) => readSkillFileSnapshot(path, resources, maxBytes).then(({ bytes }) => bytes.toString("utf8"));
		readSkillFileSnapshot = async (path, resources, maxBytes = Number.MAX_SAFE_INTEGER) => withRegularFile(path, async (handle, stats) => {
			const bytes = await readBoundedFileBytes(handle, Math.min(stats.size, maxBytes), { expectedSize: stats.size });
			if (bytes === undefined || bytes.length !== stats.size) throw new RegularFileChangedError(path);
			return {
				bytes,
				mode: stats.mode & 4095,
				state: stats
			};
		}, {
			symlinks: "reject",
			...resources === undefined ? {} : { resources }
		});
		canonicalSkillContent = (relativePath) => readFile(new URL(`../../skills/${PRODUCT_IDENTITY.skillName}/${relativePath}`, new URL("../application/SetupSkill.js", import.meta.url).href), "utf8");
		SetupSkillInstallError = class extends Error {
			_tag = "SetupSkillInstallError";
			path;
			stage;
			reason;
			rollbackFailures;
			recoveryBackupPaths;
			cleanupOwners;
			remediationAction;
			/** Retry only retained staging cleanup; never reapply a pathname rollback. */
			async retryCleanup() {
				return closeSkillPublications(this.cleanupOwners);
			}
			constructor(input) {
				const message = [
					`REA skill ${input.stage} failed at ${input.path}.`,
					`Reason: ${input.reason}`,
					...input.rollbackFailures.length === 0 ? [] : [`Rollback also failed for ${input.rollbackFailures.map(({ path, reason }) => `${path} (${reason})`).join(", ")}.`],
					...input.recoveryBackupPaths.length === 0 ? [] : [`Existing-file backups remain at ${input.recoveryBackupPaths.join(", ")}.`]
				].join("\n");
				super(message, { cause: input.cause });
				this.path = input.path;
				this.stage = input.stage;
				this.reason = input.reason;
				this.rollbackFailures = input.rollbackFailures;
				this.recoveryBackupPaths = input.recoveryBackupPaths;
				this.cleanupOwners = input.cleanupOwners ?? [];
				this.remediationAction = input.remediationAction ?? "Correct the reported skill installation failure and rerun setup.";
			}
			get remediation() {
				if (this.cause instanceof SkillDestinationChangedError) return `${this.message}\nStop concurrent setup activity, inspect the destination and any reported rollback failures, then retry setup.`;
				return `${this.message}\n${this.remediationAction}`;
			}
		};
		systemSkillInstallFileOperations = {
			mkdir: async (path) => {
				await mkdir(path, { recursive: true });
			},
			backup: (source, destination) => copyFile(source, destination, constants.COPYFILE_EXCL),
			prepare: SkillFilePublication.prepare
		};
		skillDestinationSelection = (home, clientIds, environment = {}, platform = process.platform) => {
			const selection = clientSkillDirectories(home, clientIds, environment, platform);
			return {
				destinations: selection.directories.map(({ client, directory }) => ({
					client,
					path: appendCallerPath(directory, PRODUCT_IDENTITY.skillName, platform)
				})),
				issues: selection.unresolved.map(({ client, path, detail }) => ({
					client,
					path,
					detail,
					kind: "unresolved"
				}))
			};
		};
		skillDestinations = (home, clientIds, environment = {}, platform = process.platform) => {
			const selection = skillDestinationSelection(home, clientIds, environment, platform);
			if (selection.issues.length > 0) throw skillDirectoryFailure(selection.issues);
			return selection.destinations;
		};
		existingSkillDestinations = async (home, environment = {}, platform = process.platform, resources) => {
			const selection = skillDestinationSelection(home, undefined, environment, platform);
			const issues = [...selection.issues];
			const existing = [];
			for (const destination of selection.destinations) {
				try {
					const pathIssues = await skillDirectoryIssues([destination]);
					if (pathIssues.some(({ kind }) => kind === "unreadable")) {
						issues.push(...pathIssues);
						continue;
					}
					if (pathIssues.length > 0) continue;
					const manifest = appendCallerPath(destination.path, "SKILL.md");
					const content = await readSkillFile(manifest, resources);
					if (isManagedSkillManifest(content)) existing.push(destination);
				} catch (cause) {
					if (cause instanceof Error && "code" in cause && cause.code === "ENOENT") continue;
					if (cause instanceof RegularFileCleanupFailure || cause instanceof ArtifactReaderFailure) throw cause;
					if (cause instanceof NonRegularFileReadError) continue;
					issues.push({
						client: destination.client,
						path: destination.path,
						kind: "unreadable",
						detail: causeReason(cause)
					});
				}
			}
			return {
				destinations: existing,
				issues
			};
		};
		readOptionalSkillState = async (path, resources) => {
			try {
				return await readSkillFileSnapshot(path, resources);
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && cause.code === "ENOENT") return undefined;
				throw cause;
			}
		};
		inspectSkillDirectory = async (path) => {
			try {
				const directory = await lstat(path);
				if (directory.isSymbolicLink()) return err({
					path,
					kind: "symbolic_link",
					detail: "Skill directory is a symbolic link."
				});
				if (!directory.isDirectory()) return err({
					path,
					kind: "not_directory",
					detail: "Skill path is not a directory."
				});
				return ok(undefined);
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && cause.code === "ENOENT") return ok(undefined);
				if (cause instanceof Error && "code" in cause && cause.code === "ENOTDIR") return err({
					path,
					kind: "not_directory",
					detail: "A component of the skill path is not a directory (ENOTDIR)."
				});
				return err({
					path,
					kind: "unreadable",
					detail: cause instanceof Error ? cause.message : String(cause)
				});
			}
		};
		skillDirectoryIssues = async (destinations) => {
			const issues = [];
			for (const { path } of destinations) {
				const root = await inspectSkillDirectory(path);
				if (!root.ok) {
					issues.push(root.error);
					continue;
				}
				const references = await inspectSkillDirectory(appendCallerPath(path, "references"));
				if (!references.ok) issues.push(references.error);
			}
			return issues;
		};
		skillDirectoryFailure = (issues) => new SetupSkillInstallError({
			path: issues[0]?.path ?? "skill bundle",
			stage: "prepare",
			reason: issues.map(({ path, detail }, index) => index === 0 ? detail : `${path}: ${detail}`).join("\n"),
			remediationAction: issues.some(({ kind }) => kind === "unreadable" || kind === "unresolved") ? "Resolve the reported skill directory inspection failure, or run setup with --skill=false to configure the client without installing the skill." : "Use a regular skill directory, or run setup with --skill=false to configure the client without installing the skill.",
			rollbackFailures: [],
			recoveryBackupPaths: [],
			cause: issues
		});
		validateCanonicalSkillDirectories = async (home, clientIds, environment = {}, platform = process.platform) => {
			const selection = skillDestinationSelection(home, clientIds, environment, platform);
			const issues = [...selection.issues, ...await skillDirectoryIssues(selection.destinations)];
			return issues.length === 0 ? ok(undefined) : err(skillDirectoryFailure(issues));
		};
		canonicalSkillFiles = async (home, clientIds, environment = {}, platform = process.platform, resources) => {
			const destinations = skillDestinations(home, clientIds, environment, platform);
			const admission = await validateCanonicalSkillDirectories(home, clientIds, environment, platform);
			if (!admission.ok) throw admission.error;
			return Promise.all(destinations.flatMap(({ path: root }) => MANAGED_SKILL_FILES.map(async (relativePath) => {
				const destination = appendCallerPath(root, relativePath);
				return {
					destination,
					content: await canonicalSkillContent(relativePath),
					original: await readOptionalSkillState(destination, resources)
				};
			})));
		};
		inspectCanonicalSkill = async (home, clientIds, environment, platform, resources) => {
			const selection = skillDestinationSelection(home, clientIds, environment, platform);
			const destinations = selection.destinations;
			const issues = [...selection.issues];
			let canonical = true;
			let manifest;
			let failureCause = issues.length > 0 ? issues : undefined;
			let installedDestination = false;
			for (const destination of destinations) {
				const { path: root } = destination;
				const pathIssues = await skillDirectoryIssues([destination]);
				if (pathIssues.length > 0) {
					issues.push(...pathIssues);
					if (failureCause === undefined) failureCause = pathIssues;
					installedDestination = true;
					canonical = false;
					continue;
				}
				let rootCanonical = true;
				let rootHasFiles = false;
				const rootIssues = [];
				for (const relativePath of MANAGED_SKILL_FILES) {
					const destination = appendCallerPath(root, relativePath);
					let original;
					try {
						original = await readOptionalSkillState(destination, resources);
					} catch (cause) {
						if (cause instanceof RegularFileCleanupFailure || cause instanceof ArtifactReaderFailure) throw cause;
						rootIssues.push({
							path: destination,
							kind: "unreadable",
							detail: causeReason(cause)
						});
						if (failureCause === undefined) failureCause = cause;
						rootCanonical = false;
						rootHasFiles = true;
						continue;
					}
					if (original !== undefined) rootHasFiles = true;
					if (relativePath === "SKILL.md" && manifest === undefined) manifest = original?.bytes.toString("utf8");
					if (original === undefined) rootCanonical = false;
					else if (rootCanonical) {
						const content = await canonicalSkillContent(relativePath);
						rootCanonical = original.bytes.equals(Buffer.from(content, "utf8"));
					}
				}
				if (clientIds !== undefined || rootHasFiles || rootIssues.length > 0) {
					installedDestination ||= rootHasFiles;
					canonical = canonical && rootCanonical;
					issues.push(...rootIssues);
					if (!rootCanonical && rootIssues.length === 0) issues.push({
						client: destination.client,
						path: root,
						kind: rootHasFiles ? "stale" : "missing",
						detail: `Selected skill copy is ${rootHasFiles ? "stale" : "missing"}`
					});
				}
			}
			return issues.length === 0 ? ok({
				canonical,
				manifest,
				installedDestination
			}) : err({
				_tag: "SkillInspectionFailure",
				issues,
				cause: failureCause,
				manifest
			});
		};
		canonicalSkillNeedsInstall = async (home, clientIds = [], environment = {}, platform = process.platform, resources) => {
			try {
				const inspection = await inspectCanonicalSkill(home, clientIds, environment, platform, resources);
				return !inspection.ok || !inspection.value.canonical;
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure || cause instanceof ArtifactReaderFailure) throw cause;
				void cause;
				return true;
			}
		};
		causeReason = (cause) => cause instanceof Error ? cause.message : String(cause);
		causePath = (cause) => cause instanceof Error && "path" in cause && typeof cause.path === "string" ? cause.path : undefined;
		closeSkillPublications = async (publications, resources) => {
			const failures = [];
			for (const publication of publications) {
				if (publication.lease.released) continue;
				try {
					if (resources === undefined) await publication.close();
					else {
						const released = await resources.release(publication);
						if (released.kind === "failed") throw released.cause;
					}
				} catch (cause) {
					failures.push({
						path: publication.resource,
						reason: causeReason(cause)
					});
				}
			}
			return failures;
		};
		installCanonicalSkill = async (home, clientIds = [], environment = {}, platform = process.platform, operations = systemSkillInstallFileOperations, resources) => {
			const publications = [];
			const preparedCleanupOwners = [];
			let verified = false;
			let stage = "prepare";
			let failingPath = "skill bundle";
			const recoveryPaths = new Map();
			try {
				const canonical = await canonicalSkillFiles(home, clientIds, environment, platform, resources);
				const changed = canonical.filter(({ content, original }) => original?.bytes.equals(Buffer.from(content, "utf8")) !== true);
				if (changed.length === 0) return ok("unchanged");
				stage = "backup";
				for (const { destination, original } of changed) {
					failingPath = destination;
					await operations.mkdir(dirname(destination));
					if (original !== undefined) {
						const preserved = await preserveCurrentRecoveryBackup(`${destination}.rea.backup`, destination, original.bytes, {
							copy: operations.backup,
							...resources === undefined ? {} : { resources }
						});
						if (!preserved.ok) throw new Error(preserved.error.detail);
						recoveryPaths.set(destination, preserved.value);
					}
				}
				stage = "write";
				for (const file of changed) {
					failingPath = file.destination;
					const publication = await operations.prepare(file.destination, Buffer.from(file.content, "utf8"), file.original);
					publications.push(publication);
					await publication.publish();
				}
				stage = "readback";
				for (const publication of publications) {
					failingPath = publication.path;
					await publication.assertCurrent();
				}
				verified = true;
				const cleanupFailures = await closeSkillPublications(publications, resources);
				if (cleanupFailures.length > 0) throw new Error(`Skill publication cleanup incomplete: ${cleanupFailures.map(({ path, reason }) => `${path} (${reason})`).join(", ")}`);
				return ok("installed");
			} catch (cause) {
				if (stage === "prepare" && cause instanceof SetupSkillInstallError) return err(cause);
				failingPath = causePath(cause) ?? failingPath;
				if (cause instanceof SkillFilePreparationFailure) preparedCleanupOwners.push(cause.publication);
				const rollbackFailures = [];
				if (!verified) {
					for (const publication of [...publications].reverse()) {
						try {
							await publication.restore();
						} catch (rollbackCause) {
							rollbackFailures.push({
								path: publication.path,
								reason: causeReason(rollbackCause)
							});
						}
					}
				}
				const cleanupOwners = [...publications, ...preparedCleanupOwners];
				rollbackFailures.push(...await closeSkillPublications(cleanupOwners, resources));
				return err(new SetupSkillInstallError({
					path: failingPath,
					stage,
					reason: causeReason(cause),
					rollbackFailures,
					recoveryBackupPaths: [...recoveryPaths.values()],
					cleanupOwners,
					cause
				}));
			}
		};
		readInstalledSkillIdentity = async (home, clientIds, environment = {}, platform = process.platform, resources) => {
			const inspection = await inspectCanonicalSkill(home, clientIds, environment, platform, resources);
			if (inspection.ok && !inspection.value.installedDestination) return undefined;
			const content = inspection.ok ? inspection.value.manifest : inspection.error.manifest;
			const issues = inspection.ok ? [] : inspection.error.issues;
			const parsedMetadata = content === undefined ? undefined : parseSkillManifestMetadata(content);
			const metadata = parsedMetadata?.ok ? parsedMetadata.value : parsedMetadata?.error.metadata;
			return {
				canonical: inspection.ok && inspection.value.canonical,
				version: metadata?.version ?? null,
				toolCount: metadata?.toolCount ?? null,
				...issues.length === 0 ? {} : { issues }
			};
		};
	})))();
}

//#endregion
export { DEFAULT_JEB_MCP_ENDPOINT, MANAGED_SKILL_FILES, SUPPORTED_CLIENT_DEFINITIONS, SetupSkillInstallError, appDataRedirection, applyDebuggerAdmissionOverride, canonicalSkillNeedsInstall, classifyClientRegistrationCommand, clientEvidencePaths, clientOwnershipEvidencePaths, clientSharedRegistrationPaths, compactInputSchemaByDefault, currentClientRegistrationCommand, debuggerControlReplyOutput, equivalentClientRegistrationCommands, existingSkillDestinations, fileHandleMatchesBytes, init_ClientRegistrationIdentity, init_MsixPackageStorage, init_SetupRecoveryBackup, init_SetupSkill, init_SupportedClients, init_debuggerSessionLimits, init_environment, init_fileHandleMatchesBytes, init_jebMcpEndpoint, inspectClientRegistrationCommand, installCanonicalSkill, invokingPackageRunner, isManagedSkillManifest, manualRegistrationRemediation, msixPackagesDirectory, packagePrivateLauncherBlocker, packageReadTargetChanged, parseEnvironment, parseEnvironmentValues, parseJebMcpEndpoint, parseJebMcpTimeoutMs, preserveCurrentRecoveryBackup, readInstalledSkillIdentity, readSkillFile, redirectedWriteBlocker, registrationPersistenceDetail, registrationWriteBlocker, resolveDebuggerSessionLimits, selectCurrentRecoveryBackup, skillDestinationSelection, skillDestinations, supportedClients, validateCanonicalSkillDirectories, withoutPackageRunnerIdentity };