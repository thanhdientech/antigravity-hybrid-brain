import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ConfigurationError, DEFAULT_NATIVE_MATCHING_REPRESENTATION_BYTES, MAXIMUM_NATIVE_MATCHING_REPRESENTATION_BYTES, err, init_analysisResourceLimits, init_configurationErrors, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { init_asarHeaderAdmission, parseAsarHeaderAdmission } from "./asarHeaderAdmission-CX-emtPE.js";
import { init_captureDecoderHeap, resolveCaptureDecoderHeap } from "./captureDecoderHeap-D2nJpzko.js";
import { z } from "zod";

//#region dist/config/nativeMatchingAllowance.js
var NATIVE_MATCHING_ALLOWANCE_SETTING, DEFAULT_NATIVE_MATCHING_ALLOWANCE, nativeMatchingRepresentationBytesConstraint, nativeMatchingRepresentationBytesSchema, parseNativeMatchingAllowance, MEBIBYTE, nativeMatchingByteAllowance, nativeMatchingAllowanceRecovery;
function init_nativeMatchingAllowance() {
	return (init_nativeMatchingAllowance = __esmMin((() => {
		init_analysisResourceLimits();
		init_configurationErrors();
		init_result();
		NATIVE_MATCHING_ALLOWANCE_SETTING = "REA_NATIVE_MATCHING_REPRESENTATION_BYTES";
		DEFAULT_NATIVE_MATCHING_ALLOWANCE = {
			maximumBytes: DEFAULT_NATIVE_MATCHING_REPRESENTATION_BYTES,
			source: "default"
		};
		nativeMatchingRepresentationBytesConstraint = `${NATIVE_MATCHING_ALLOWANCE_SETTING} must be a positive decimal integer of at most ${String(MAXIMUM_NATIVE_MATCHING_REPRESENTATION_BYTES)} bytes (1 GiB); the default is ${String(DEFAULT_NATIVE_MATCHING_REPRESENTATION_BYTES)} bytes (96 MiB).`;
		nativeMatchingRepresentationBytesSchema = z.string().regex(/^[1-9]\d*$/u, { error: nativeMatchingRepresentationBytesConstraint }).transform(Number).pipe(z.number().int().max(MAXIMUM_NATIVE_MATCHING_REPRESENTATION_BYTES, { error: nativeMatchingRepresentationBytesConstraint }));
		parseNativeMatchingAllowance = (environment) => {
			const value = environment[NATIVE_MATCHING_ALLOWANCE_SETTING];
			if (value === undefined) return ok(DEFAULT_NATIVE_MATCHING_ALLOWANCE);
			const parsed = nativeMatchingRepresentationBytesSchema.safeParse(value);
			return parsed.success ? ok({
				maximumBytes: parsed.data,
				source: "setting"
			}) : err(new ConfigurationError(nativeMatchingRepresentationBytesConstraint, {
				remediationAction: `On a running MCP session, call update_analysis_settings with ${JSON.stringify({ changes: [{
					setting: "native.matching_representation_bytes",
					action: "set",
					value: DEFAULT_NATIVE_MATCHING_REPRESENTATION_BYTES
				}] })}, then retry matching. This repairs the current session for the next operation. For CLI or future REA processes, correct ${NATIVE_MATCHING_ALLOWANCE_SETTING} in the launch environment.`,
				settings: [{
					setting: NATIVE_MATCHING_ALLOWANCE_SETTING,
					constraint: nativeMatchingRepresentationBytesConstraint
				}]
			}));
		};
		MEBIBYTE = 1024 * 1024;
		nativeMatchingByteAllowance = (bytes) => Number.isInteger(bytes / MEBIBYTE) ? `${String(bytes / MEBIBYTE)} MiB / ${String(bytes)} bytes` : `${String(bytes)} bytes`;
		nativeMatchingAllowanceRecovery = (allowance) => [
			`Native function matching is limited to ${nativeMatchingByteAllowance(allowance.maximumBytes)} of representation${allowance.source === "setting" ? ` by ${NATIVE_MATCHING_ALLOWANCE_SETTING}` : ""}.`,
			`On MCP, call update_analysis_settings with setting native.matching_representation_bytes, action set, and a value in bytes up to ${nativeMatchingByteAllowance(MAXIMUM_NATIVE_MATCHING_REPRESENTATION_BYTES)} (default ${nativeMatchingByteAllowance(DEFAULT_NATIVE_MATCHING_REPRESENTATION_BYTES)}), then retry the original request. It applies to the next operation without restarting REA. For CLI or future REA processes, set ${NATIVE_MATCHING_ALLOWANCE_SETTING} in the launch environment.`,
			"This budget is not a bound on total process RSS; raising it lets matching retain more representation in the REA process.",
			"Splitting inventories into separate matches changes global name and body uniqueness, so it is not an equivalent workaround.",
			"Repeating the unchanged request fails the same way."
		].join(" ");
	})))();
}

//#endregion
//#region dist/config/runtimeAnalysisSettings.js
var runtimeAnalysisConfig, runtimeAsarHeaderAdmission, runtimeCaptureDecoderHeap, runtimeNativeMatchingAllowance;
function init_runtimeAnalysisSettings() {
	return (init_runtimeAnalysisSettings = __esmMin((() => {
		init_result();
		init_asarHeaderAdmission();
		init_captureDecoderHeap();
		init_nativeMatchingAllowance();
		runtimeAnalysisConfig = (config, read) => {
			if (read === undefined) return config;
			const deadline = config.regexMatchingDeadline;
			const heap = config.regexWorkerHeapRequest;
			return {
				...config,
				get ghidraStartupTimeoutMs() {
					return read().overrides["ghidra.startup_timeout_ms"] ?? config.ghidraStartupTimeoutMs;
				},
				get hopperStartupTimeoutMs() {
					return read().overrides["hopper.startup_timeout_ms"] ?? config.hopperStartupTimeoutMs;
				},
				get ghidraDecompileTimeoutSeconds() {
					const value = read().overrides["ghidra.decompile_timeout_seconds"];
					return value === undefined ? config.ghidraDecompileTimeoutSeconds : value === null ? undefined : value;
				},
				regexMatchingDeadline: {
					get deadlineMs() {
						return read().overrides["regex.matching_deadline_ms"] ?? deadline.deadlineMs;
					},
					get source() {
						return read().overrides["regex.matching_deadline_ms"] === undefined ? deadline.source : "runtime";
					}
				},
				regexWorkerHeapRequest: {
					get heapMiB() {
						return read().overrides["regex.worker_heap_request_mib"] ?? heap.heapMiB;
					},
					get source() {
						return read().overrides["regex.worker_heap_request_mib"] === undefined ? heap.source : "runtime";
					}
				}
			};
		};
		runtimeAsarHeaderAdmission = (environment, read) => {
			const parsed = parseAsarHeaderAdmission(environment.REA_ASAR_MAX_HEADER_BYTES);
			if (!parsed.ok) throw parsed.error;
			const baseline = parsed.value;
			return read === undefined ? baseline : {
				get maximumBytes() {
					return read().overrides["asar.max_header_bytes"] ?? baseline.maximumBytes;
				},
				get source() {
					return read().overrides["asar.max_header_bytes"] === undefined ? baseline.source : "runtime";
				}
			};
		};
		runtimeCaptureDecoderHeap = (environment, read) => {
			const baseline = resolveCaptureDecoderHeap(environment);
			return read === undefined ? baseline : {
				get oldGenerationMiB() {
					return read().overrides["capture.decoder_old_generation_mib"] ?? baseline.oldGenerationMiB;
				},
				get source() {
					return read().overrides["capture.decoder_old_generation_mib"] === undefined ? baseline.source : "runtime";
				}
			};
		};
		runtimeNativeMatchingAllowance = (environment, read) => () => {
			const override = read?.().overrides["native.matching_representation_bytes"];
			return override === undefined ? parseNativeMatchingAllowance(environment) : ok({
				maximumBytes: override,
				source: "runtime"
			});
		};
	})))();
}

//#endregion
export { DEFAULT_NATIVE_MATCHING_ALLOWANCE, init_nativeMatchingAllowance, init_runtimeAnalysisSettings, nativeMatchingAllowanceRecovery, nativeMatchingByteAllowance, parseNativeMatchingAllowance, runtimeAnalysisConfig, runtimeAsarHeaderAdmission, runtimeCaptureDecoderHeap };