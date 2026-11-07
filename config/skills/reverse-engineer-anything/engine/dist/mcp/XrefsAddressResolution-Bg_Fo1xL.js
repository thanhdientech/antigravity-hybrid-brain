import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { a as AnalysisCapabilityUnavailableError, f as init_analysisErrorCore, i as AnalysisCancelledError, o as AnalysisInputError, s as AnalysisOutputError } from "./analysisErrorCore-BCqhUcUc.js";
import { E as addressedValueSchema, O as init_nativeInventory } from "./interfaceBuilderGraph-D6-wBpmX.js";
import { r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";

//#region dist/application/SourceLimitations.js
var sourceLimitationKey, sourceLimitationGroupKey, renderSourceLimitations;
function init_SourceLimitations() {
	return (init_SourceLimitations = __esmMin((() => {
		init_unicodeCodePointOrder();
		sourceLimitationKey = ({ provider, operation, limitation }) => JSON.stringify([
			provider.id,
			provider.name,
			provider.version,
			operation,
			limitation
		]);
		sourceLimitationGroupKey = ({ provider, limitation }) => JSON.stringify([
			provider.id,
			provider.name,
			provider.version,
			limitation
		]);
		renderSourceLimitations = (limitations) => {
			const groups = new Map();
			for (const { provider, operation, limitation } of limitations) {
				const key = sourceLimitationGroupKey({
					provider,
					limitation
				});
				const group = groups.get(key) ?? {
					provider,
					limitation,
					operations: new Set()
				};
				group.operations.add(operation);
				groups.set(key, group);
			}
			return [...groups.values()].map(({ provider, limitation, operations }) => {
				const version = provider.version === null ? "" : ` ${provider.version}`;
				const operationList = [...operations].sort(compareUnicodeCodePoints);
				return `${provider.name} (${provider.id}${version}) ${operationList.join(", ")}: ${limitation}`;
			}).sort(compareUnicodeCodePoints);
		};
	})))();
}

//#endregion
//#region dist/application/CapabilityFallback.js
var permitsCapabilityFallback;
function init_CapabilityFallback() {
	return (init_CapabilityFallback = __esmMin((() => {
		init_analysisErrorCore();
		permitsCapabilityFallback = (error) => error instanceof AnalysisCapabilityUnavailableError && !error.cleanupIncomplete;
	})))();
}

//#endregion
//#region dist/application/ProcedureAddressResolution.js
var resolveProcedureAddress, parseProcedureAddress;
function init_ProcedureAddressResolution() {
	return (init_ProcedureAddressResolution = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		resolveProcedureAddress = async (call, procedure, signal) => {
			const result = await call("procedure_address", { procedure }, signal);
			if (!result.ok) return result;
			return parseProcedureAddress(result.value);
		};
		parseProcedureAddress = (value) => typeof value === "string" && value.length > 0 ? ok(value) : err(new AnalysisOutputError("procedure_address", "provider returned no canonical procedure address"));
	})))();
}

//#endregion
//#region dist/application/XrefsAddressResolution.js
var resolveXrefsAddress, resolveXrefsName;
function init_XrefsAddressResolution() {
	return (init_XrefsAddressResolution = __esmMin((() => {
		init_CapabilityFallback();
		init_nativeInventory();
		init_analysisErrorCore();
		init_result();
		init_ProcedureAddressResolution();
		resolveXrefsAddress = async (analysis, selector, signal) => {
			const named = await resolveXrefsName(analysis, selector, signal);
			if (!named.ok) return named;
			return named.value !== null ? ok(named.value) : err(new AnalysisInputError("xrefs", {
				conformsToInputContract: true,
				remediationAction: "For a function, use rea search --kind procedures to find an analyzed address. For exports, inspect-macho (Mach-O) or inspect-native-exports (PE/ELF) may help; exports can omit local symbols and use different address coordinates. Verify the address in the selected provider, then retry xrefs."
			}, [{
				path: ["address"],
				reason: "invalid_value",
				message: `Unknown analyzed symbol name ${JSON.stringify(selector)}. Use an exact analyzed name or a hexadecimal address.`
			}]));
		};
		resolveXrefsName = async (analysis, selector, signal, operation = "xrefs") => {
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			const inventory = await analysis.execute("list_names", {}, signal === undefined ? {} : { signal });
			if (!inventory.ok) {
				if (operation === "xrefs" && permitsCapabilityFallback(inventory.error) && inventory.error.operation === "list_names") return resolveProcedureAddress(async (operation, parameters, signal) => {
					const result = await analysis.execute(operation, parameters, signal === undefined ? {} : { signal });
					return result.ok ? ok(result.value.result) : result;
				}, selector, signal);
				return inventory;
			}
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			if (!Array.isArray(inventory.value.result)) return err(new AnalysisOutputError("list_names", "Expected a symbol inventory array"));
			const addresses = new Set();
			for (const [index, item] of inventory.value.result.entries()) {
				const parsed = addressedValueSchema.safeParse(item);
				if (!parsed.success || parsed.data.address.length === 0) return err(new AnalysisOutputError("list_names", `Invalid symbol inventory entry at index ${index}`));
				if (parsed.data.value === selector) addresses.add(parsed.data.address);
			}
			const [address] = addresses;
			if (addresses.size <= 1) return ok(address ?? null);
			return err(new AnalysisInputError(operation, {
				conformsToInputContract: true,
				remediationAction: "Select an exact address from the candidates and call xrefs with that address."
			}, [{
				path: [operation === "xrefs" ? "address" : "name"],
				reason: "invalid_value",
				message: `Analyzed symbol name ${JSON.stringify(selector)} is ambiguous at ${[...addresses].sort().join(", ")}. Select an exact address.`
			}]));
		};
	})))();
}

//#endregion
export { parseProcedureAddress as a, permitsCapabilityFallback as c, sourceLimitationGroupKey as d, sourceLimitationKey as f, init_ProcedureAddressResolution as i, init_SourceLimitations as l, resolveXrefsAddress as n, resolveProcedureAddress as o, resolveXrefsName as r, init_CapabilityFallback as s, init_XrefsAddressResolution as t, renderSourceLimitations as u };