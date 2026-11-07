import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { emptyArraySchema, init_digests, init_emptyArraySchema, prefixedDigestSchema } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { JAVASCRIPT_APPLICATION_NODE_KINDS, init_javascriptApplicationGraph, init_javascriptApplicationGraphSchemas, isValidatedImmutableJavaScriptApplicationGraph, javascriptApplicationGraphSchema } from "./javascriptApplicationAnalysis-BPf1N9PJ.js";
import { z } from "zod";

//#region dist/domain/javascript/javascriptApplicationVersionComparisonSchemas.js
var evidenceIdSchema, nodeIdSchema, textSchema, validateApplicationVersionIdentities, evidenceIdentitySchema, applicationVersionIdentitiesSchema, candidateNodesSchema, exactMatchSchema, sourceMapMatchSchema, inferredMatchSchema, matchedItemMatchSchema, unmatchedItemMatchSchema, leftAmbiguousMatchSchema, rightAmbiguousMatchSchema, comparisonItemContextShape, comparisonItemSchema, comparisonCoverageSchema, applicationVersionComparisonResultSchema, ownedApplicationVersionComparisonResultSchema;
function init_javascriptApplicationVersionComparisonSchemas() {
	return (init_javascriptApplicationVersionComparisonSchemas = __esmMin((() => {
		init_emptyArraySchema();
		init_javascriptApplicationGraph();
		init_javascriptApplicationGraphSchemas();
		init_digests();
		evidenceIdSchema = prefixedDigestSchema("ev");
		nodeIdSchema = prefixedDigestSchema("jag_node");
		textSchema = z.string().min(1);
		validateApplicationVersionIdentities = (input, context) => {
			if (input.left.evidence_id === input.right.evidence_id) context.addIssue({
				code: "custom",
				path: ["right"],
				message: "Application version Evidence must be distinct"
			});
			for (const side of ["left_native_observations", "right_native_observations"]) {
				const ids = input[side].map(({ evidence_id: id }) => id);
				if (new Set(ids).size !== ids.length) context.addIssue({
					code: "custom",
					path: [side],
					message: "Native observations must be unique on each side"
				});
			}
		};
		evidenceIdentitySchema = z.object({ evidence_id: evidenceIdSchema });
		applicationVersionIdentitiesSchema = z.object({
			left: evidenceIdentitySchema,
			right: evidenceIdentitySchema,
			left_native_observations: z.array(evidenceIdentitySchema),
			right_native_observations: z.array(evidenceIdentitySchema)
		}).superRefine(validateApplicationVersionIdentities);
		candidateNodesSchema = z.tuple([nodeIdSchema], nodeIdSchema).check(z.minLength(1));
		exactMatchSchema = z.strictObject({
			status: z.literal("matched"),
			basis: z.enum([
				"exact-node-identity",
				"exact-content-digest",
				"exact-module-source-digest"
			]),
			confidence: z.literal("exact"),
			candidate_left_node_ids: emptyArraySchema,
			candidate_right_node_ids: emptyArraySchema
		});
		sourceMapMatchSchema = z.strictObject({
			status: z.literal("matched"),
			basis: z.literal("source-map-identity"),
			confidence: z.literal("high"),
			candidate_left_node_ids: emptyArraySchema,
			candidate_right_node_ids: emptyArraySchema
		});
		inferredMatchSchema = z.strictObject({
			status: z.literal("matched"),
			basis: z.enum(["structural-fingerprint", "semantic-key"]),
			confidence: z.literal("medium"),
			candidate_left_node_ids: emptyArraySchema,
			candidate_right_node_ids: emptyArraySchema
		});
		matchedItemMatchSchema = z.union([
			exactMatchSchema,
			sourceMapMatchSchema,
			inferredMatchSchema
		]);
		unmatchedItemMatchSchema = z.strictObject({
			status: z.literal("unmatched"),
			basis: z.literal("none"),
			confidence: z.literal("unknown"),
			candidate_left_node_ids: emptyArraySchema,
			candidate_right_node_ids: emptyArraySchema
		});
		leftAmbiguousMatchSchema = z.strictObject({
			status: z.literal("ambiguous"),
			basis: z.literal("none"),
			confidence: z.literal("unknown"),
			candidate_left_node_ids: emptyArraySchema,
			candidate_right_node_ids: candidateNodesSchema
		});
		rightAmbiguousMatchSchema = z.strictObject({
			status: z.literal("ambiguous"),
			basis: z.literal("none"),
			confidence: z.literal("unknown"),
			candidate_left_node_ids: candidateNodesSchema,
			candidate_right_node_ids: emptyArraySchema
		});
		comparisonItemContextShape = {
			item_id: prefixedDigestSchema("javc_item"),
			node_kind: z.enum(JAVASCRIPT_APPLICATION_NODE_KINDS),
			dimensions: z.array(z.enum([
				"content",
				"location",
				"properties",
				"relationships",
				"availability",
				"coverage"
			])),
			evidence_links: z.array(evidenceIdSchema).min(2),
			limitations: z.array(textSchema)
		};
		comparisonItemSchema = z.union([
			z.strictObject({
				...comparisonItemContextShape,
				status: z.enum([
					"unchanged",
					"changed",
					"unknown"
				]),
				left_node_id: nodeIdSchema,
				right_node_id: nodeIdSchema,
				match: matchedItemMatchSchema
			}),
			z.strictObject({
				...comparisonItemContextShape,
				status: z.enum(["removed", "unknown"]),
				left_node_id: nodeIdSchema,
				right_node_id: z.null(),
				match: unmatchedItemMatchSchema
			}),
			z.strictObject({
				...comparisonItemContextShape,
				status: z.enum(["added", "unknown"]),
				left_node_id: z.null(),
				right_node_id: nodeIdSchema,
				match: unmatchedItemMatchSchema
			}),
			z.strictObject({
				...comparisonItemContextShape,
				status: z.literal("unknown"),
				left_node_id: nodeIdSchema,
				right_node_id: z.null(),
				match: leftAmbiguousMatchSchema
			}),
			z.strictObject({
				...comparisonItemContextShape,
				status: z.literal("unknown"),
				left_node_id: z.null(),
				right_node_id: nodeIdSchema,
				match: rightAmbiguousMatchSchema
			})
		]);
		comparisonCoverageSchema = z.strictObject({
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
			left_graph_omitted_count: z.int().min(0).nullable(),
			right_graph_omitted_count: z.int().min(0).nullable(),
			status: z.enum([
				"complete-within-inputs",
				"partial",
				"truncated"
			])
		});
		applicationVersionComparisonResultSchema = z.strictObject({
			comparison_id: prefixedDigestSchema("javc"),
			left: z.strictObject({
				evidence_id: evidenceIdSchema,
				graph_id: prefixedDigestSchema("jag"),
				root_artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u)
			}),
			right: z.strictObject({
				evidence_id: evidenceIdSchema,
				graph_id: prefixedDigestSchema("jag"),
				root_artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u)
			}),
			summary: z.strictObject({
				unchanged: z.int().min(0),
				added: z.int().min(0),
				removed: z.int().min(0),
				changed: z.int().min(0),
				unknown: z.int().min(0)
			}),
			matching: z.strictObject({
				exact_node_identity: z.int().min(0),
				exact_content_digest: z.int().min(0),
				exact_module_source_digest: z.int().min(0),
				source_map_identity: z.int().min(0),
				structural_fingerprint: z.int().min(0),
				semantic_key: z.int().min(0),
				ambiguous: z.int().min(0),
				unmatched: z.int().min(0)
			}),
			items: z.array(comparisonItemSchema),
			graph: javascriptApplicationGraphSchema,
			coverage: comparisonCoverageSchema,
			evidence_links: z.array(evidenceIdSchema).min(2),
			limitations: z.array(textSchema)
		}).superRefine((result, context) => {
			const sourceGraphsComplete = result.coverage.left_graph_status === "complete" && result.coverage.right_graph_status === "complete";
			if (result.coverage.status === "complete-within-inputs" !== sourceGraphsComplete) context.addIssue({
				code: "custom",
				path: ["coverage", "status"],
				message: "Comparison coverage must match source graph completeness"
			});
		});
		ownedApplicationVersionComparisonResultSchema = applicationVersionComparisonResultSchema.safeExtend({ graph: z.custom(isValidatedImmutableJavaScriptApplicationGraph) });
	})))();
}

//#endregion
export { applicationVersionComparisonResultSchema, applicationVersionIdentitiesSchema, init_javascriptApplicationVersionComparisonSchemas, ownedApplicationVersionComparisonResultSchema };