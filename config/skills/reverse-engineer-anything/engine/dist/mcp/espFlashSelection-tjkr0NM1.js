import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { n as init_toolEffects, r as toolContractMetadata } from "./toolEffects-DDE_QF7o.js";
import { _ as init_localPath, g as absoluteLocalPathStringSchema } from "./jsonValue-CbQQraup.js";
import { $u as analysisDetailSchema, a as init_toolOutputSchemaGroups, dd as requireOutputSchema, ld as init_toolOutputSchemaPrimitives, o as managedOutputSchemas, td as init_analysisDetail } from "./toolOutputSchemaGroups-3HUmDmX5.js";
import { l as init_espPartitionTable, r as ESP_PARTITION_TABLE_SECTOR_BYTES } from "./espPartitionTable-CfnqElVz.js";
import { z } from "zod";

//#region dist/contracts/managed/managedToolContracts.js
var managedTargetInputSchema, managedArtifactInputSchema, managedMembersInputSchema, outputSchema, memberOutputSchema, nativeBoundaryOutputSchema, MANAGED_TOOL_CONTRACTS, isManagedToolName;
function init_managedToolContracts() {
	return (init_managedToolContracts = __esmMin((() => {
		init_toolOutputSchemaPrimitives();
		init_toolOutputSchemaGroups();
		init_toolEffects();
		init_localPath();
		init_analysisDetail();
		managedTargetInputSchema = z.strictObject({ path: absoluteLocalPathStringSchema.describe("Explicit absolute managed PE/CLI path; omit to reuse the previously selected managed target").optional() });
		managedArtifactInputSchema = managedTargetInputSchema.extend({ detail: analysisDetailSchema });
		managedMembersInputSchema = managedArtifactInputSchema.extend({ type_names: z.array(z.string().min(1).describe("Exact declaring-type full_name: namespace-qualified for top-level types (System.Threading.Monitor); nested types report their bare name, so it selects every nested type of that name")).min(1).refine((names) => new Set(names).size === names.length, { message: "type_names must not repeat a name" }).meta({ uniqueItems: true }).describe("Inspect only the fields, methods, call edges, and field accesses declared by these exact type full names, and the user strings their method bodies load; omit to inspect every type. Unmatched names are reported in selection.unmatched_type_names.").optional() });
		outputSchema = requireOutputSchema(managedOutputSchemas, "inspect_managed_artifact");
		memberOutputSchema = requireOutputSchema(managedOutputSchemas, "inspect_managed_members");
		nativeBoundaryOutputSchema = requireOutputSchema(managedOutputSchemas, "inspect_managed_native_boundaries");
		MANAGED_TOOL_CONTRACTS = [
			{
				name: "inspect_managed_artifact",
				retainedSummary: { evidenceParameters: "omit-detail" },
				...toolContractMetadata("inspect_managed_artifact"),
				description: "Inspect an explicit PE/CLI path, or the selected managed target, without loading or executing target code. Omitted or complete detail returns complete metadata inventories with original coverage. Select detail: \"summary\" on the first call for complete identity, PE/CLI, classification with its evidence, module/MVID, assembly, frameworks, returned-collection counts, coverage/issues and limitations. It retains complete Evidence and returns a distinct linked inspect_analysis_view summary. Page original references/resources/attributes with view kind managed and normalized_result.parent_evidence_id. Counts cover producer-returned rows; partial, unavailable or malformed metadata remains explicit and tokens remain build-local.",
				kind: "managed-provider",
				inputSchema: managedArtifactInputSchema,
				outputSchema,
				examples: [{
					title: "Example inspect managed artifact request",
					input: { path: "/tmp/Example.dll" }
				}, {
					title: "Inspect identity and coverage without unrelated metadata inventories",
					input: {
						path: "/tmp/Example.dll",
						detail: "summary"
					}
				}]
			},
			{
				name: "inspect_managed_members",
				retainedSummary: { evidenceParameters: "omit-detail" },
				...toolContractMetadata("inspect_managed_members"),
				description: "Inspect PE/CLI metadata members, signatures, raw CIL hashes, decoded-instruction-tuple hashes, separately reported exception regions, call edges, field-access anchors, and the #US string literals that ldstr loads, without loading or executing target code. Select type_names to decode only the members of those exact declaring types and the literals their bodies load, which keeps large assemblies such as a base class library within the representation budget. Metadata tokens are reported as build-local coordinates bound to the artifact SHA-256 and MVID; the tuple hash does not resolve them or fully commit control flow. Omitted or complete detail returns every collection, including the assembly-wide member_refs and exported_types, which type_names does not narrow. Select detail: \"summary\" for identity, metadata status, selection with unmatched names, coverage/issues, limitations and per-collection counts; it retains complete Evidence and returns a linked inspect_analysis_view summary. Page original rows with view kind managed-members, normalized_result.parent_evidence_id and collection types/exported_types/fields/methods/member_refs/call_edges/field_accesses/user_strings. Filter retained members by exact names/declaring_types and select fields; omit body to avoid returning IL anchors.",
				kind: "managed-provider",
				inputSchema: managedMembersInputSchema,
				outputSchema: memberOutputSchema,
				examples: [
					{
						title: "Example inspect managed members request",
						input: {}
					},
					{
						title: "Example inspect selected managed types request",
						input: {
							path: "/tmp/mscorlib.dll",
							type_names: ["System.Threading.Monitor"]
						}
					},
					{
						title: "Summarize selected managed types and retain their members",
						input: {
							path: "/tmp/mscorlib.dll",
							type_names: ["System.Threading.Monitor"],
							detail: "summary"
						}
					}
				]
			},
			{
				name: "inspect_managed_native_boundaries",
				...toolContractMetadata("inspect_managed_native_boundaries"),
				description: "Inspect PE/CLI ModuleRef, ImplMap/PInvoke declarations, CLI native-header indicators, and non-IL method implementation flags without loading or executing target code. Results are managed declarations and degraded native-boundary observations, not verified native exports or addresses.",
				kind: "managed-provider",
				inputSchema: managedTargetInputSchema,
				outputSchema: nativeBoundaryOutputSchema,
				examples: [{
					title: "Example inspect managed/native boundary request",
					input: {}
				}]
			}
		];
		isManagedToolName = (name) => MANAGED_TOOL_CONTRACTS.some((contract) => contract.name === name);
	})))();
}

//#endregion
//#region dist/domain/dosCom.js
var executableFormatHintSchema, validateDosComLength;
function init_dosCom() {
	return (init_dosCom = __esmMin((() => {
		init_result();
		executableFormatHintSchema = z.enum([
			"dos-com",
			"raw-binary",
			"gamecube-dol",
			"esp-flash-image"
		]);
		validateDosComLength = (length) => Number.isSafeInteger(length) && length >= 1 && length <= 65280 ? ok(null) : err("DOS COM requires 1..65280 file bytes (64 KiB segment minus the 256-byte PSP prefix)");
	})))();
}

//#endregion
//#region dist/domain/firmware/espFlashSelection.js
var espFlashAddressSchema, parseEspFlashAddress, espFlashSelectionError;
function init_espFlashSelection() {
	return (init_espFlashSelection = __esmMin((() => {
		init_espPartitionTable();
		espFlashAddressSchema = z.string().regex(/^0x[0-9a-fA-F]{1,8}$/u, { message: "must be a hexadecimal flash address of the form 0x…" });
		parseEspFlashAddress = (text) => Number.parseInt(text.slice(2), 16);
		espFlashSelectionError = (input) => {
			if ((input.flashOffset !== undefined || input.partitionTableOffset !== undefined) && input.format !== "esp-flash-image") return "flash_offset and partition_table_offset apply only with format=esp-flash-image";
			if (input.partitionTableOffset !== undefined && input.partitionTableOffset % 4096 !== 0) return "partition_table_offset must be a multiple of 0x1000, as ESP-IDF requires";
			return undefined;
		};
	})))();
}

//#endregion
export { executableFormatHintSchema as a, MANAGED_TOOL_CONTRACTS as c, managedMembersInputSchema as d, managedTargetInputSchema as f, parseEspFlashAddress as i, init_managedToolContracts as l, espFlashSelectionError as n, init_dosCom as o, init_espFlashSelection as r, validateDosComLength as s, espFlashAddressSchema as t, isManagedToolName as u };