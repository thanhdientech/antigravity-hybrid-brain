import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { digestSchema, evidenceInputSchema, evidenceSchema, init_digests, init_evidence, init_evidenceReference, prefixedDigestSchema } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { absoluteLocalPathStringSchema, init_localPath, localPathStringSchema } from "./jsonValue-DGGrC1lE.js";
import { compareSourceToBundleInputSchema, featureTraceViewRequestSchema, init_featureTraceView, init_javascriptFeatureTraceSchemas, init_sourceToBundleComparisonSchemas, init_sourceToBundleView, sourceToBundleViewRequestSchema, traceApplicationFeatureInputSchema } from "./featureTraceView-DIA-boVl.js";
import { JAVASCRIPT_SEMANTIC_NODE_KINDS, JAVASCRIPT_SEMANTIC_RELATIONS, init_javascriptSemanticGraphSchemas, init_javascriptSourceCoordinates, javaScriptSemanticEvidenceContextSchema, javaScriptSemanticNodeSchema, javaScriptSemanticRelationSchema, javaScriptSemanticUnknownSchema, javascriptSourceRangeSchema } from "./javascriptApplicationAnalysis-BPf1N9PJ.js";
import { init_javascriptRuntimeReconciliationSchemas, reconcileJavaScriptRuntimeInputSchema } from "./javascriptRuntimeReconciliationSchemas-DnGvlNG6.js";
import { z } from "zod";

//#region dist/domain/javascript/javascriptExportShapeComparisonSchemas.js
function isJsonPointer(value) {
	if (value === "") return true;
	if (!value.startsWith("/")) return false;
	for (let index = 0; index < value.length; index += 1) {
		if (value[index] !== "~") continue;
		const escaped = value[index + 1];
		if (escaped !== "0" && escaped !== "1") return false;
		index += 1;
	}
	return true;
}
var evidenceIdSchema$1, graphIdSchema, nodeIdSchema, textSchema, exportNameSchema, semanticPrimitiveSchema, jsonPointerSchema, validateJavaScriptExportShapeIdentities, evidenceIdentitySchema, javaScriptExportShapeIdentitiesSchema, compareJavaScriptExportShapesInputSchema, projectedReturnFieldShape, projectedReturnFieldSchema, projectedPropertyCoverageSchema, projectedReturnShapeSchema, projectedExportReturnShapesSchema, exportCandidateSchema, selectorResultShape, selectorResultSchema, valueAvailabilitySchema, discriminantSchema, propertyPresenceSchema, javaScriptExportShapeComparisonChangeSchema, inventoryPropertyCoverageSchema, propertyInventorySchema, javaScriptExportShapeComparisonResultSchema;
function init_javascriptExportShapeComparisonSchemas() {
	return (init_javascriptExportShapeComparisonSchemas = __esmMin((() => {
		init_javascriptSourceCoordinates();
		init_evidence();
		init_digests();
		evidenceIdSchema$1 = prefixedDigestSchema("ev");
		graphIdSchema = prefixedDigestSchema("jag");
		nodeIdSchema = prefixedDigestSchema("jag_node");
		textSchema = z.string().min(1);
		exportNameSchema = z.string();
		semanticPrimitiveSchema = z.union([
			z.string(),
			z.number().finite(),
			z.boolean(),
			z.null()
		]);
		jsonPointerSchema = z.string().refine(isJsonPointer, "Expected an RFC 6901 JSON Pointer");
		validateJavaScriptExportShapeIdentities = (input, context) => {
			if (input.left.evidence_id === input.right.evidence_id) context.addIssue({
				code: "custom",
				path: ["right"],
				message: "JavaScript export shape Evidence must be distinct"
			});
		};
		evidenceIdentitySchema = z.object({ evidence_id: evidenceIdSchema$1 });
		javaScriptExportShapeIdentitiesSchema = z.object({
			left: evidenceIdentitySchema,
			right: evidenceIdentitySchema
		}).superRefine(validateJavaScriptExportShapeIdentities);
		compareJavaScriptExportShapesInputSchema = z.strictObject({
			left: evidenceSchema,
			right: evidenceSchema,
			left_module_path: textSchema,
			left_export_name: exportNameSchema,
			right_module_path: textSchema,
			right_export_name: exportNameSchema
		}).superRefine(validateJavaScriptExportShapeIdentities);
		projectedReturnFieldShape = {
			path: jsonPointerSchema,
			presence: z.enum([
				"present",
				"absent",
				"unknown-coverage"
			])
		};
		projectedReturnFieldSchema = z.discriminatedUnion("state", [
			z.strictObject({
				...projectedReturnFieldShape,
				state: z.literal("literal"),
				value: semanticPrimitiveSchema,
				reason: z.null()
			}),
			z.strictObject({
				...projectedReturnFieldShape,
				state: z.literal("union"),
				value: z.array(semanticPrimitiveSchema).min(1),
				reason: z.null()
			}),
			z.strictObject({
				...projectedReturnFieldShape,
				state: z.literal("unknown"),
				value: z.null(),
				reason: textSchema
			})
		]);
		projectedPropertyCoverageSchema = z.discriminatedUnion("status", [z.strictObject({
			path: jsonPointerSchema,
			status: z.literal("complete"),
			omitted: z.literal(0)
		}), z.strictObject({
			path: jsonPointerSchema,
			status: z.literal("partial"),
			omitted: z.union([z.int().positive(), z.null()])
		})]);
		projectedReturnShapeSchema = z.strictObject({
			source_range: javascriptSourceRangeSchema,
			value_status: z.enum([
				"literal",
				"union",
				"object",
				"array",
				"unknown",
				"ambiguous",
				"cycle"
			]),
			fields: z.array(projectedReturnFieldSchema),
			property_coverage: z.array(projectedPropertyCoverageSchema)
		}).superRefine((shape, context) => {
			const fieldPaths = shape.fields.map(({ path }) => path);
			if (new Set(fieldPaths).size !== fieldPaths.length) context.addIssue({
				code: "custom",
				path: ["fields"],
				message: "Projected return field paths must be unique"
			});
			const coveragePaths = shape.property_coverage.map(({ path }) => path);
			if (new Set(coveragePaths).size !== coveragePaths.length) context.addIssue({
				code: "custom",
				path: ["property_coverage"],
				message: "Projected property coverage paths must be unique"
			});
		});
		projectedExportReturnShapesSchema = z.strictObject({
			semantic_role: z.literal("export-return-shapes"),
			module_path: textSchema,
			exported_name: exportNameSchema,
			callable_id: textSchema,
			callable_kind: z.enum([
				"function",
				"class",
				"method"
			]),
			static_return_shapes: z.array(projectedReturnShapeSchema),
			return_shape_coverage: z.strictObject({
				status: z.enum([
					"complete",
					"partial",
					"truncated"
				]),
				retained_return_sites: z.int().min(0),
				omitted_return_sites: z.int().min(0).nullable(),
				omitted_fields: z.int().min(0),
				omitted_property_coverage: z.int().min(0),
				projection_complete: z.boolean()
			})
		}).superRefine((projection, context) => {
			if (projection.return_shape_coverage.retained_return_sites !== projection.static_return_shapes.length) context.addIssue({
				code: "custom",
				path: ["return_shape_coverage", "retained_return_sites"],
				message: "Retained return-site count must match projected shapes"
			});
		});
		exportCandidateSchema = z.strictObject({
			node_id: nodeIdSchema,
			module_path: textSchema,
			export_name: exportNameSchema,
			matches_requested_module: z.boolean(),
			matches_requested_export: z.boolean()
		});
		selectorResultShape = {
			evidence_id: evidenceIdSchema$1,
			graph_id: graphIdSchema,
			requested_module_path: textSchema,
			requested_export_name: exportNameSchema,
			candidates: z.array(exportCandidateSchema),
			omitted_candidates: z.int().min(0)
		};
		selectorResultSchema = z.union([
			z.strictObject({
				...selectorResultShape,
				status: z.literal("selected"),
				selected_node_id: nodeIdSchema
			}),
			z.strictObject({
				...selectorResultShape,
				status: z.enum(["missing", "ambiguous"]),
				selected_node_id: z.null()
			}),
			z.strictObject({
				...selectorResultShape,
				status: z.literal("unavailable"),
				selected_node_id: nodeIdSchema.nullable()
			})
		]);
		valueAvailabilitySchema = z.discriminatedUnion("availability", [
			z.strictObject({ availability: z.literal("absent") }),
			z.strictObject({
				availability: z.literal("literal"),
				value: semanticPrimitiveSchema
			}),
			z.strictObject({
				availability: z.literal("union"),
				values: z.array(semanticPrimitiveSchema).min(1)
			}),
			z.strictObject({
				availability: z.literal("unknown"),
				reason: textSchema
			})
		]);
		discriminantSchema = z.strictObject({
			path: jsonPointerSchema,
			value: semanticPrimitiveSchema
		});
		propertyPresenceSchema = z.enum([
			"present",
			"absent",
			"unknown-coverage"
		]);
		javaScriptExportShapeComparisonChangeSchema = z.strictObject({
			change_id: prefixedDigestSchema("jesc_change"),
			status: z.enum([
				"added",
				"removed",
				"changed",
				"unknown"
			]),
			path: jsonPointerSchema,
			discriminant: discriminantSchema.nullable(),
			presence: z.strictObject({
				left: propertyPresenceSchema,
				right: propertyPresenceSchema
			}),
			left: valueAvailabilitySchema,
			right: valueAvailabilitySchema,
			left_source_range: javascriptSourceRangeSchema.nullable(),
			right_source_range: javascriptSourceRangeSchema.nullable(),
			evidence_links: z.array(evidenceIdSchema$1).length(2),
			limitations: z.array(textSchema)
		});
		inventoryPropertyCoverageSchema = z.strictObject({
			path: jsonPointerSchema,
			status: z.enum(["complete", "partial"])
		});
		propertyInventorySchema = z.strictObject({
			side: z.enum(["left", "right"]),
			variant_index: z.int().nonnegative(),
			discriminant: discriminantSchema.nullable(),
			paired: z.boolean(),
			source_range: javascriptSourceRangeSchema,
			properties: z.array(jsonPointerSchema),
			property_coverage: z.array(inventoryPropertyCoverageSchema)
		});
		javaScriptExportShapeComparisonResultSchema = z.strictObject({
			comparison_id: prefixedDigestSchema("jesc"),
			left: selectorResultSchema,
			right: selectorResultSchema,
			property_inventories: z.array(propertyInventorySchema),
			summary: z.strictObject({
				added: z.int().min(0),
				removed: z.int().min(0),
				changed: z.int().min(0),
				unknown: z.int().min(0)
			}),
			changes: z.array(javaScriptExportShapeComparisonChangeSchema),
			coverage: z.strictObject({
				status: z.enum([
					"complete-within-inputs",
					"partial",
					"truncated"
				]),
				left_graph_status: z.enum([
					"complete",
					"partial",
					"unknown",
					"unavailable"
				]),
				right_graph_status: z.enum([
					"complete",
					"partial",
					"unknown",
					"unavailable"
				]),
				paired_variants: z.int().min(0),
				unpaired_left_variants: z.int().min(0),
				unpaired_right_variants: z.int().min(0),
				omitted_left_variants: z.int().min(0),
				omitted_right_variants: z.int().min(0),
				left_source_omitted_variants: z.int().min(0).nullable(),
				right_source_omitted_variants: z.int().min(0).nullable(),
				left_omitted_fields: z.int().min(0),
				right_omitted_fields: z.int().min(0),
				left_omitted_property_coverage: z.int().min(0),
				right_omitted_property_coverage: z.int().min(0),
				omitted_candidates: z.int().min(0),
				omitted_changes: z.int().min(0)
			}),
			evidence_links: z.array(evidenceIdSchema$1).length(2),
			limitations: z.array(textSchema)
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticQuerySchemas.js
var semanticNodeIdSchema, literalValueSchema, literalSeedSchema, javaScriptSemanticQuerySeedSchema, javaScriptSemanticQueryInputSchema, javaScriptSemanticQueryResultSchema;
function init_javascriptSemanticQuerySchemas() {
	return (init_javascriptSemanticQuerySchemas = __esmMin((() => {
		init_javascriptSemanticGraphSchemas();
		init_digests();
		semanticNodeIdSchema = prefixedDigestSchema("jsrg_node");
		literalValueSchema = z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.null()
		]);
		literalSeedSchema = z.strictObject({
			kind: z.literal("literal"),
			value: literalValueSchema
		});
		javaScriptSemanticQuerySeedSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("semantic-node"),
				node_id: semanticNodeIdSchema
			}),
			z.strictObject({
				kind: z.literal("application-node"),
				node_id: prefixedDigestSchema("jag_node")
			}),
			literalSeedSchema,
			z.strictObject({
				kind: z.literal("function"),
				fingerprint_sha256: digestSchema
			}),
			z.strictObject({
				kind: z.literal("property"),
				name: z.string()
			}),
			z.strictObject({
				kind: z.literal("endpoint"),
				value: z.string()
			}),
			z.strictObject({
				kind: z.literal("event"),
				name: z.string()
			}),
			z.strictObject({
				kind: z.literal("boundary-field"),
				field: z.string().min(1)
			})
		]);
		javaScriptSemanticQueryInputSchema = z.strictObject({
			seed: javaScriptSemanticQuerySeedSchema,
			direction: z.enum([
				"backward-provenance",
				"forward-influence",
				"callers",
				"ownership"
			]),
			allowed_relations: z.array(z.enum(JAVASCRIPT_SEMANTIC_RELATIONS)).min(1).optional(),
			include_ambiguous_dynamic_edges: z.boolean().default(false),
			expected: z.strictObject({
				role: z.enum(["source", "sink"]),
				classes: z.array(z.enum(JAVASCRIPT_SEMANTIC_NODE_KINDS)).min(1)
			}).nullable().default(null)
		});
		javaScriptSemanticQueryResultSchema = z.strictObject({
			query_id: prefixedDigestSchema("jsrq"),
			source_graph_id: prefixedDigestSchema("jsrg"),
			seed: javaScriptSemanticQuerySeedSchema,
			direction: javaScriptSemanticQueryInputSchema.shape.direction,
			status: z.enum([
				"found",
				"no-match",
				"ambiguous",
				"partial",
				"unsupported"
			]),
			seed_node_ids: z.array(semanticNodeIdSchema),
			evidence_contexts: z.array(javaScriptSemanticEvidenceContextSchema),
			nodes: z.array(javaScriptSemanticNodeSchema),
			relations: z.array(javaScriptSemanticRelationSchema),
			unknowns: z.array(javaScriptSemanticUnknownSchema),
			expected_match_node_ids: z.array(semanticNodeIdSchema),
			summary: z.strictObject({
				total_seed_matches: z.int().min(0),
				traversed_nodes: z.int().min(0),
				traversed_relations: z.int().min(0),
				traversed_functions: z.int().min(0),
				traversed_modules: z.int().min(0),
				relevant_unknowns: z.int().min(0)
			}),
			coverage: z.strictObject({ status: z.enum([
				"complete",
				"partial",
				"unavailable"
			]) }),
			limitations: z.array(z.string().min(1))
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticTraceSchemas.js
var evidenceIdSchema, traceJavaScriptSemanticsInputSchema, javaScriptSemanticTraceResultSchema;
function init_javascriptSemanticTraceSchemas() {
	return (init_javascriptSemanticTraceSchemas = __esmMin((() => {
		init_evidence();
		init_javascriptSemanticQuerySchemas();
		init_digests();
		evidenceIdSchema = prefixedDigestSchema("ev");
		traceJavaScriptSemanticsInputSchema = z.strictObject({
			application: evidenceSchema,
			query: javaScriptSemanticQueryInputSchema
		});
		javaScriptSemanticTraceResultSchema = javaScriptSemanticQueryResultSchema.extend({
			source_evidence_id: evidenceIdSchema,
			evidence_links: z.array(evidenceIdSchema).length(1)
		});
	})))();
}

//#endregion
//#region dist/contracts/javascript/applicationWorkflowInputContracts.js
var traceApplicationFeatureFacts, traceApplicationFeatureRequestSchema, traceApplicationFeatureToolRequestSchema, traceJavaScriptSemanticsRequestSchema, compareApplicationVersionsFacts, compareApplicationVersionsRequestSchema, referenceFile, sourceToBundleSelection, compareSourceToBundleCliInputSchema, compareSourceToBundleRequestSchema, compareJavaScriptExportShapesFacts, compareJavaScriptExportShapesRequestSchema, reconcileJavaScriptRuntimeRequestSchema;
function init_applicationWorkflowInputContracts() {
	return (init_applicationWorkflowInputContracts = __esmMin((() => {
		init_localPath();
		init_sourceToBundleView();
		init_featureTraceView();
		init_evidenceReference();
		init_javascriptExportShapeComparisonSchemas();
		init_javascriptFeatureTraceSchemas();
		init_javascriptSemanticTraceSchemas();
		init_sourceToBundleComparisonSchemas();
		init_javascriptRuntimeReconciliationSchemas();
		traceApplicationFeatureFacts = {
			native_observations: z.array(evidenceInputSchema).default([]),
			seed: traceApplicationFeatureInputSchema.shape.seed,
			semantic_page: traceApplicationFeatureInputSchema.shape.semantic_page,
			direction: traceApplicationFeatureInputSchema.shape.direction
		};
		traceApplicationFeatureRequestSchema = z.strictObject({
			...traceApplicationFeatureFacts,
			application: evidenceInputSchema
		});
		traceApplicationFeatureToolRequestSchema = traceApplicationFeatureRequestSchema.extend({ view: z.union([z.strictObject({ kind: z.literal("summary") }), featureTraceViewRequestSchema]).optional().describe("Omitted returns the complete trace. summary or a feature-trace page retains the complete trace in this session first; query it again with inspect_analysis_view and the returned parent_evidence_id.") });
		traceJavaScriptSemanticsRequestSchema = traceJavaScriptSemanticsInputSchema.extend({ application: evidenceInputSchema });
		compareApplicationVersionsFacts = {
			left_native_observations: z.array(evidenceInputSchema).default([]),
			right_native_observations: z.array(evidenceInputSchema).default([])
		};
		compareApplicationVersionsRequestSchema = z.strictObject({
			...compareApplicationVersionsFacts,
			left: evidenceInputSchema,
			right: evidenceInputSchema
		});
		referenceFile = z.strictObject({
			kind: z.literal("file"),
			path: localPathStringSchema
		});
		sourceToBundleSelection = { view: z.union([z.strictObject({ kind: z.literal("summary") }), sourceToBundleViewRequestSchema]).optional() };
		compareSourceToBundleCliInputSchema = z.strictObject({
			reference: z.union([compareSourceToBundleInputSchema.shape.reference, referenceFile]),
			application: evidenceInputSchema
		});
		compareSourceToBundleRequestSchema = z.strictObject({
			reference: z.union([compareSourceToBundleInputSchema.shape.reference, referenceFile.extend({ path: absoluteLocalPathStringSchema })]),
			application: evidenceInputSchema,
			...sourceToBundleSelection
		});
		compareJavaScriptExportShapesFacts = {
			left_module_path: compareJavaScriptExportShapesInputSchema.shape.left_module_path,
			left_export_name: compareJavaScriptExportShapesInputSchema.shape.left_export_name,
			right_module_path: compareJavaScriptExportShapesInputSchema.shape.right_module_path,
			right_export_name: compareJavaScriptExportShapesInputSchema.shape.right_export_name
		};
		compareJavaScriptExportShapesRequestSchema = z.strictObject({
			...compareJavaScriptExportShapesFacts,
			left: evidenceInputSchema,
			right: evidenceInputSchema
		});
		reconcileJavaScriptRuntimeRequestSchema = z.strictObject({
			static_layers: z.array(reconcileJavaScriptRuntimeInputSchema.shape.static_layers.element.extend({ analysis: evidenceInputSchema })).min(1),
			runtime_observations: z.array(evidenceInputSchema).min(1)
		});
	})))();
}

//#endregion
export { compareApplicationVersionsRequestSchema, compareJavaScriptExportShapesRequestSchema, compareSourceToBundleCliInputSchema, compareSourceToBundleRequestSchema, init_applicationWorkflowInputContracts, init_javascriptExportShapeComparisonSchemas, init_javascriptSemanticQuerySchemas, init_javascriptSemanticTraceSchemas, javaScriptExportShapeComparisonResultSchema, javaScriptExportShapeIdentitiesSchema, javaScriptSemanticQueryResultSchema, javaScriptSemanticTraceResultSchema, projectedExportReturnShapesSchema, reconcileJavaScriptRuntimeRequestSchema, traceApplicationFeatureRequestSchema, traceApplicationFeatureToolRequestSchema, traceJavaScriptSemanticsRequestSchema };