import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { Mt as nativeDispatchMetadataInputSchema, Q as init_nativeInvestigationGraph, _t as decompileDirectoryInputSchema, at as nativeInvestigationTraceLimitsSchema, ct as init_nativeValueTrace, kt as init_objcSwiftMetadata, lt as nativeValueTraceInputSchema, xt as init_decompileDirectory } from "./interfaceBuilderGraph-D6-wBpmX.js";
import { n as nativeProcedureInputSchema, t as init_nativeProcedureInput } from "./nativeProcedureInput-k8ruuY5t.js";
import { z } from "zod";

//#region dist/contracts/enhancedInputs.js
var traceLiteralInputSchema, DEFAULT_CALL_RELATIONSHIP_DIRECTION, MAX_ENHANCED_RECORDS, callRelationshipDirectionSchema, enhancedInputSchemas;
function init_enhancedInputs() {
	return (init_enhancedInputs = __esmMin((() => {
		init_objcSwiftMetadata();
		init_nativeProcedureInput();
		init_decompileDirectory();
		init_nativeValueTrace();
		init_nativeInvestigationGraph();
		traceLiteralInputSchema = z.strictObject({
			query: z.string().min(1),
			case_sensitive: z.boolean().default(false)
		});
		DEFAULT_CALL_RELATIONSHIP_DIRECTION = "forward";
		MAX_ENHANCED_RECORDS = 2e4;
		callRelationshipDirectionSchema = z.enum(["forward", "backward"]).default(DEFAULT_CALL_RELATIONSHIP_DIRECTION);
		enhancedInputSchemas = {
			trace_native_values: nativeValueTraceInputSchema,
			inspect_native_dispatch_metadata: nativeDispatchMetadataInputSchema,
			get_objc_classes: z.strictObject({ pattern: z.string().default("") }),
			get_objc_protocols: z.strictObject({}),
			batch_decompile: z.strictObject({ addresses: z.array(z.string().describe("A provider-normalized procedure address")).max(MAX_ENHANCED_RECORDS).default([]) }),
			decompile_all: decompileDirectoryInputSchema,
			get_call_graph: z.strictObject({
				address: z.string().describe("A procedure symbol or address to resolve to its canonical entry"),
				direction: callRelationshipDirectionSchema
			}),
			analyze_swift_types: z.strictObject({
				category: z.enum([
					"classes",
					"structs",
					"enums",
					"protocols",
					"extensions",
					"other"
				]).optional().describe("Limit categorized results to one Swift category; unresolved category observations remain in unclassified."),
				pattern: z.string().optional().describe("Case-sensitive literal filter applied to provider procedure names and their supporting Swift manglings.")
			}),
			find_xrefs_to_name: z.strictObject({ name: z.string() }),
			binary_overview: z.strictObject({}),
			analyze_function: nativeProcedureInputSchema,
			inspect_native_api: nativeProcedureInputSchema,
			trace_feature: traceLiteralInputSchema,
			trace_call_path: z.strictObject({
				start: z.string().describe("A starting procedure symbol or address"),
				goal: z.string().describe("An optional destination procedure symbol or address").optional(),
				direction: callRelationshipDirectionSchema
			}),
			trace_native_ui_action: nativeInvestigationTraceLimitsSchema.extend({ action: z.string().min(1).describe("A unique compiled UI action selector, interface object ID, native symbol or exact function address") })
		};
	})))();
}

//#endregion
export { enhancedInputSchemas as n, init_enhancedInputs as r, DEFAULT_CALL_RELATIONSHIP_DIRECTION as t };