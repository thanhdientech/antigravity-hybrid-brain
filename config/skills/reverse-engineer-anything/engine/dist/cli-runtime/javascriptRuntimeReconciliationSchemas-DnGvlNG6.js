import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { browserEndpointSchema, compareUnicodeCodePoints, digestSchema, evidenceSchema, init_artifactIdentity, init_browserObservation, init_digests, init_evidence, init_unicodeCodePointOrder, init_urlComponents, logicalPathEscapesRoot, prefixedDigestSchema, urlDeclaresQueryOrFragment } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_javascriptApplicationGraph, javascriptApplicationGraphSchema } from "./javascriptApplicationAnalysis-BPf1N9PJ.js";
import { z } from "zod";

//#region dist/domain/javascript/javascriptRuntimeObservation.js
var observationTextSchema, runtimeEndpoint, listJavaScriptRuntimeTargetsInputSchema, javascriptRuntimeKindSchema, observedJavaScriptRuntimeKindSchema, observeJavaScriptRuntimeInputSchema, javascriptRuntimeVersionSchema, javascriptRuntimeLocationSchema, javascriptRuntimeUnresolvedLocationSchema, javascriptRuntimeTargetLocationSchema, javascriptRuntimeTargetSchema, javascriptRuntimeTargetListSchema, javascriptRuntimeScriptSchema, javascriptRuntimeContextSchema, javascriptRuntimeObservationSchema;
function init_javascriptRuntimeObservation() {
	return (init_javascriptRuntimeObservation = __esmMin((() => {
		init_browserObservation();
		init_digests();
		observationTextSchema = z.string().min(1);
		runtimeEndpoint = { inspector_endpoint: browserEndpointSchema };
		listJavaScriptRuntimeTargetsInputSchema = z.strictObject({ ...runtimeEndpoint });
		javascriptRuntimeKindSchema = z.enum([
			"node",
			"electron-main",
			"electron-preload",
			"electron-renderer"
		]);
		observedJavaScriptRuntimeKindSchema = javascriptRuntimeKindSchema.or(z.literal("unknown"));
		observeJavaScriptRuntimeInputSchema = z.strictObject({
			...runtimeEndpoint,
			target_id: z.string().min(1),
			runtime_kind: javascriptRuntimeKindSchema.optional(),
			observation_ms: z.int().min(0).default(100)
		});
		javascriptRuntimeVersionSchema = z.strictObject({
			product: z.string().min(1),
			protocol_version: z.string().min(1),
			v8_version: z.string().nullable()
		});
		javascriptRuntimeLocationSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("file"),
				file_path: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("url"),
				origin: z.string().min(1),
				sanitized_url: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("builtin"),
				specifier: z.string().min(1)
			})
		]);
		javascriptRuntimeUnresolvedLocationSchema = z.strictObject({
			kind: z.literal("unresolved"),
			reported_url: z.string().describe("Raw Inspector URL, which may be empty for anonymous or evaluated code."),
			reason: z.enum(["unverifiable-file-location", "location-authorization-not-attempted"])
		});
		javascriptRuntimeTargetLocationSchema = z.union([javascriptRuntimeLocationSchema, javascriptRuntimeUnresolvedLocationSchema]);
		javascriptRuntimeTargetSchema = z.strictObject({
			target_id: z.string().min(1),
			protocol_type: z.string().min(1),
			attached: z.boolean().nullable().describe("Discovery-reported debugger attachment state; null means unknown"),
			location: javascriptRuntimeTargetLocationSchema
		});
		javascriptRuntimeTargetListSchema = z.strictObject({
			runtime: javascriptRuntimeVersionSchema,
			targets: z.array(javascriptRuntimeTargetSchema),
			excluded: z.strictObject({
				unsupported_location: z.int().min(0),
				unconnectable: z.int().min(0)
			}),
			limitations: z.array(observationTextSchema)
		});
		javascriptRuntimeScriptSchema = z.strictObject({
			script_key: prefixedDigestSchema("v8_script"),
			location: javascriptRuntimeTargetLocationSchema,
			reported_url: z.string().optional().describe("Exact Inspector URL for an authorized file script, retained separately from its verified filesystem path."),
			execution_context_key: z.string().nullable(),
			cdp_hash: z.string().nullable(),
			length: z.int().min(0).nullable().describe("Producer-reported script length; null when unavailable."),
			is_module: z.boolean().nullable().describe("Producer-reported module classification; null when unavailable."),
			status: z.literal("observed-loaded")
		});
		javascriptRuntimeContextSchema = z.strictObject({
			context_key: z.string().min(1),
			state: z.enum([
				"created",
				"destroyed",
				"cleared"
			]),
			name: z.string().nullable(),
			origin: z.string().nullable()
		});
		javascriptRuntimeObservationSchema = z.strictObject({
			runtime: javascriptRuntimeVersionSchema,
			target: javascriptRuntimeTargetSchema.extend({
				runtime_kind: observedJavaScriptRuntimeKindSchema,
				runtime_kind_authority: z.enum(["caller-declared-unverified", "not-declared"])
			}),
			capture: z.strictObject({
				observation_ms: z.int().min(0),
				events_observed: z.int().min(0),
				events_retained: z.int().min(0),
				events_dropped: z.int().min(0),
				metadata_bytes_retained: z.int().min(0),
				truncated: z.boolean(),
				truncation_reasons: z.array(observationTextSchema)
			}),
			scripts: z.strictObject({
				items: z.array(javascriptRuntimeScriptSchema),
				observed_total: z.int().min(0),
				parse_failed_total: z.int().min(0).optional().describe("Valid scriptFailedToParse events observed; absent in legacy snapshots."),
				excluded: z.strictObject({
					unsupported_location: z.int().min(0),
					invalid_protocol_value: z.int().min(0)
				})
			}),
			execution_contexts: z.array(javascriptRuntimeContextSchema),
			directly_observed: z.array(observationTextSchema),
			unavailable_without_instrumentation: z.array(observationTextSchema),
			unknowns: z.array(observationTextSchema),
			limitations: z.array(observationTextSchema)
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptRuntimeReconciliationSchemas.js
function normalizeRuntimeMappings(mappings) {
	return [...new Map(mappings.map((mapping) => [runtimeMappingKey(mapping), mapping])).values()].sort((left, right) => compareUnicodeCodePoints(runtimeMappingKey(left), runtimeMappingKey(right)));
}
function runtimeMappingKey(mapping) {
	return mapping.kind === "file-root" ? `file-root\0${mapping.root}\0${mapping.artifact_prefix}` : `url-prefix\0${mapping.prefix}\0${mapping.artifact_prefix}`;
}
var evidenceIdSchema, nodeIdSchema, boundedTextSchema, safePrefixSchema, runtimeFileMappingSchema, runtimeUrlMappingSchema, normalizeRuntimeUrlPrefix, runtimeLocationMappingSchema, staticLayerSchema, validateReconciliationIdentities, runtimeReconciliationIdentitiesSchema, reconcileJavaScriptRuntimeInputSchema, layerSummarySchema, captureSummarySchema, reconciliationReasonSchema, reconciliationItemShape, reconciliationItemSchema, staticLoadStateSchema, javascriptRuntimeReconciliationResultSchema;
function init_javascriptRuntimeReconciliationSchemas() {
	return (init_javascriptRuntimeReconciliationSchemas = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_artifactIdentity();
		init_evidence();
		init_javascriptRuntimeObservation();
		init_javascriptApplicationGraph();
		init_digests();
		init_urlComponents();
		evidenceIdSchema = prefixedDigestSchema("ev");
		nodeIdSchema = prefixedDigestSchema("jag_node");
		boundedTextSchema = z.string().min(1);
		safePrefixSchema = z.string().refine((value) => value === "" || !logicalPathEscapesRoot(value) && value.split("/").every((part) => ![
			"",
			".",
			".."
		].includes(part)), "Artifact prefix must be empty or a safe relative POSIX path");
		runtimeFileMappingSchema = z.strictObject({
			kind: z.literal("file-root"),
			root: z.string().min(1),
			artifact_prefix: safePrefixSchema.default("")
		});
		runtimeUrlMappingSchema = z.strictObject({
			kind: z.literal("url-prefix"),
			prefix: z.string().min(1).refine((value) => normalizeRuntimeUrlPrefix(value) !== null, "Runtime URL prefix must be HTTP(S) without credentials, query, or fragment").overwrite((value) => normalizeRuntimeUrlPrefix(value) ?? value),
			artifact_prefix: safePrefixSchema.default("")
		});
		normalizeRuntimeUrlPrefix = (value) => {
			let url;
			try {
				url = new URL(value);
			} catch (cause) {
				void cause;
				return null;
			}
			if (!["http:", "https:"].includes(url.protocol) || url.username !== "" || url.password !== "" || urlDeclaresQueryOrFragment(url)) return null;
			if (!url.pathname.endsWith("/")) url.pathname += "/";
			return url.href;
		};
		runtimeLocationMappingSchema = z.discriminatedUnion("kind", [runtimeFileMappingSchema, runtimeUrlMappingSchema]);
		staticLayerSchema = z.strictObject({
			role: z.enum([
				"application",
				"cache",
				"assets"
			]).default("application"),
			analysis: evidenceSchema,
			runtime_mappings: z.array(runtimeLocationMappingSchema).overwrite(normalizeRuntimeMappings).default([])
		});
		validateReconciliationIdentities = (input, context) => {
			if (input.static_layers.filter(({ role }) => role === "application").length !== 1) context.addIssue({
				code: "custom",
				path: ["static_layers"],
				message: "Exactly one application static layer is required"
			});
			const staticIds = input.static_layers.map(({ analysis }) => analysis.evidence_id);
			if (new Set(staticIds).size !== staticIds.length) context.addIssue({
				code: "custom",
				path: ["static_layers"],
				message: "Static layer Evidence must be unique"
			});
			const runtimeIds = input.runtime_observations.map(({ evidence_id: id }) => id);
			if (new Set(runtimeIds).size !== runtimeIds.length) context.addIssue({
				code: "custom",
				path: ["runtime_observations"],
				message: "Runtime observation Evidence must be unique"
			});
		};
		runtimeReconciliationIdentitiesSchema = z.object({
			static_layers: z.array(z.object({
				role: z.enum([
					"application",
					"cache",
					"assets"
				]),
				analysis: z.object({ evidence_id: evidenceIdSchema })
			})),
			runtime_observations: z.array(z.object({ evidence_id: evidenceIdSchema }))
		}).superRefine(validateReconciliationIdentities);
		reconcileJavaScriptRuntimeInputSchema = z.strictObject({
			static_layers: z.array(staticLayerSchema).min(1),
			runtime_observations: z.array(evidenceSchema).min(1)
		}).superRefine(validateReconciliationIdentities);
		layerSummarySchema = z.strictObject({
			layer_id: prefixedDigestSchema("jrl"),
			role: z.enum([
				"application",
				"cache",
				"assets"
			]),
			evidence_id: evidenceIdSchema,
			graph_id: prefixedDigestSchema("jag"),
			root_artifact_sha256: digestSchema,
			input_path: z.string().min(1),
			format: z.enum(["asar", "directory"]),
			runtime_mappings: z.array(runtimeLocationMappingSchema)
		});
		captureSummarySchema = z.strictObject({
			evidence_id: evidenceIdSchema,
			capture_sha256: digestSchema,
			kind: z.enum([
				"browser",
				"electron",
				"v8-inspector",
				"electron-active"
			]),
			target_node_id: nodeIdSchema,
			target_key: boundedTextSchema,
			target_location: z.string().min(1).or(javascriptRuntimeUnresolvedLocationSchema),
			frames: z.int().min(0),
			scripts: z.int().min(0),
			workers: z.int().min(0),
			scripts_complete_within_scope: z.boolean()
		});
		reconciliationReasonSchema = z.enum([
			"content-and-location-match",
			"unique-content-match",
			"unique-location-match",
			"ambiguous-static-candidates",
			"captured-content-disagrees-with-static-location",
			"no-static-content-match",
			"no-authorized-location-mapping",
			"runtime-location-unresolved",
			"runtime-frame-unattributed",
			"static-or-runtime-coverage-incomplete",
			"reconciliation-limit-reached"
		]);
		reconciliationItemShape = {
			reconciliation_id: prefixedDigestSchema("jrr_item"),
			entity_kind: z.enum([
				"target",
				"frame",
				"script",
				"worker"
			]),
			runtime_evidence_id: evidenceIdSchema,
			runtime_node_id: nodeIdSchema,
			basis: z.enum([
				"content-and-location",
				"content-sha256",
				"module-source-sha256",
				"artifact-path",
				"operator-file-mapping",
				"operator-url-mapping",
				"none"
			]),
			confidence: z.enum([
				"exact",
				"high",
				"medium",
				"low",
				"unknown"
			]),
			reason: reconciliationReasonSchema,
			candidate_static_count: z.int().min(0),
			candidate_static_nodes: z.array(z.strictObject({
				static_layer_id: prefixedDigestSchema("jrl"),
				static_node_id: nodeIdSchema
			}))
		};
		reconciliationItemSchema = z.union([z.strictObject({
			...reconciliationItemShape,
			static_layer_id: prefixedDigestSchema("jrl"),
			static_node_id: nodeIdSchema,
			status: z.literal("matched")
		}), z.strictObject({
			...reconciliationItemShape,
			static_layer_id: z.null(),
			static_node_id: z.null(),
			status: z.enum([
				"ambiguous",
				"unmatched",
				"unknown"
			])
		})]);
		staticLoadStateSchema = z.strictObject({
			static_layer_id: prefixedDigestSchema("jrl"),
			static_node_id: nodeIdSchema,
			kind: z.enum([
				"javascript-asset",
				"javascript-chunk",
				"javascript-module"
			]),
			status: z.enum([
				"loaded",
				"resident-in-loaded-asset",
				"not-observed-in-capture",
				"unknown"
			]),
			runtime_node_ids: z.array(nodeIdSchema),
			reason: z.enum([
				"runtime-script-correspondence",
				"containing-asset-was-loaded",
				"not-observed-in-bounded-capture",
				"layer-outside-runtime-scope",
				"static-or-runtime-coverage-incomplete",
				"ambiguous-runtime-candidate"
			])
		});
		javascriptRuntimeReconciliationResultSchema = z.strictObject({
			reconciliation_id: prefixedDigestSchema("jrr"),
			static_layers: z.array(layerSummarySchema).min(1),
			runtime_captures: z.array(captureSummarySchema).min(1),
			graph: javascriptApplicationGraphSchema,
			summary: z.strictObject({
				runtime_targets: z.int().min(0),
				runtime_frames: z.int().min(0),
				runtime_scripts: z.int().min(0),
				runtime_workers: z.int().min(0),
				matched: z.int().min(0),
				ambiguous: z.int().min(0),
				unmatched: z.int().min(0),
				unknown: z.int().min(0),
				static_loaded: z.int().min(0),
				static_resident: z.int().min(0),
				static_not_observed: z.int().min(0),
				static_unknown: z.int().min(0)
			}),
			reconciliations: z.array(reconciliationItemSchema),
			static_load_states: z.array(staticLoadStateSchema),
			source_map_authority: z.strictObject({
				used_for_primary_matching: z.literal(false),
				static_layer_count: z.int().min(0),
				runtime_script_declarations: z.int().min(0),
				limitation: boundedTextSchema
			}),
			coverage: z.strictObject({
				status: z.enum([
					"complete-within-inputs",
					"partial",
					"truncated"
				]),
				truncated: z.boolean(),
				omitted_runtime_entities: z.int().min(0),
				omitted_reconciliation_items: z.int().min(0),
				omitted_static_load_states: z.int().min(0),
				omitted_graph_items: z.int().min(0)
			}),
			evidence_links: z.array(evidenceIdSchema).min(2),
			limitations: z.array(boundedTextSchema)
		});
	})))();
}

//#endregion
export { init_javascriptRuntimeObservation, init_javascriptRuntimeReconciliationSchemas, javascriptRuntimeKindSchema, javascriptRuntimeObservationSchema, javascriptRuntimeReconciliationResultSchema, javascriptRuntimeTargetListSchema, listJavaScriptRuntimeTargetsInputSchema, observeJavaScriptRuntimeInputSchema, reconcileJavaScriptRuntimeInputSchema, runtimeReconciliationIdentitiesSchema };