import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { MAX_GHIDRA_DECOMPILE_TIMEOUT_SECONDS, MAX_NODE_TIMER_DELAY_MS, init_analysisResourceLimits } from "./jsonLines-CKG28FwL.js";
import { z } from "zod";

//#region dist/config/providerStartupTimeout.js
var DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS, ghidraDecompileTimeoutSchema, providerStartupTimeoutSchema;
function init_providerStartupTimeout() {
	return (init_providerStartupTimeout = __esmMin((() => {
		init_analysisResourceLimits();
		DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS = 12e4;
		ghidraDecompileTimeoutSchema = z.string().regex(/^[1-9]\d*$/u, "must be a positive decimal integer").transform(Number).pipe(z.number().int().min(1).max(MAX_GHIDRA_DECOMPILE_TIMEOUT_SECONDS));
		providerStartupTimeoutSchema = z.string().regex(/^[1-9]\d*$/u, "must be a positive decimal integer").transform(Number).pipe(z.int().min(1).max(MAX_NODE_TIMER_DELAY_MS));
	})))();
}

//#endregion
//#region dist/process/snapshotEnvironment.js
var mergeEnvironmentOverrides, snapshotEnvironment;
function init_snapshotEnvironment() {
	return (init_snapshotEnvironment = __esmMin((() => {
		mergeEnvironmentOverrides = (existing, overrides, platform = process.platform) => {
			const selected = new Map();
			for (const layer of [existing, overrides]) for (const [key, value] of Object.entries(layer)) selected.set(platform === "win32" ? key.toUpperCase() : key, [key, value]);
			return Object.freeze(Object.fromEntries(selected.values()));
		};
		snapshotEnvironment = (environment, platform = process.platform) => {
			const selected = mergeEnvironmentOverrides({}, environment, platform);
			if (platform !== "win32") return selected;
			return Object.freeze(Object.fromEntries(Object.entries(selected).map(([key, value]) => [key.toUpperCase(), value]).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)));
		};
	})))();
}

//#endregion
export { DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS, ghidraDecompileTimeoutSchema, init_providerStartupTimeout, init_snapshotEnvironment, mergeEnvironmentOverrides, providerStartupTimeoutSchema, snapshotEnvironment };