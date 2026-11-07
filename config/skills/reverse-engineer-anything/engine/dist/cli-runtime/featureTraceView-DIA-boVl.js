import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { analysisInputErrorFromIssues, analysisViewInputError, digestSchema, evidenceSchema, historicalSourceGraphSchema, init_analysisViewErrors, init_canonicalOrdering, init_digests, init_evidence, init_inputIssueProjection, init_javascriptArtifactFiles, init_referenceSourceGraph, javaScriptFileOccurrenceSchema, prefixedDigestSchema, providerSchema, uniqueSorted } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { canBorrowParsedJsonSnapshot, freezeOwnedJsonTreeSnapshot, init_immutableJson, init_jsonValue, isImmutableJsonSnapshot, ownedJsonValueSchema } from "./jsonValue-DGGrC1lE.js";
import { JAVASCRIPT_APPLICATION_NODE_KINDS, applicationCoverageSchema, applicationEdgeSchema, applicationGraphEvidenceSchema, applicationNodeIdentitySchema, applicationNodeSchema, init_javascriptApplicationEvidenceSchemas, init_javascriptApplicationGraph, init_javascriptApplicationGraphSchemas, javascriptApplicationGraphSchema } from "./javascriptApplicationAnalysis-BPf1N9PJ.js";
import { z } from "zod";

//#region dist/domain/analysisView/analysisViewShape.js
/** Narrow an admitted view after the projector has rejected other kinds. */
function assertOwnedView(view, ...kinds) {
	if (!kinds.includes(view.kind)) {
		throw new Error(`Analysis view kind ${JSON.stringify(view.kind)} is not owned by this projector.`);
	}
}
var summaryViewSchema, facetViewSchema, indexSelectorSchema, nameSelectorSchema, pathSelectorSchema, nodeIdSelectorSchema, moduleItemViewSchema, sectionOrSymbolItemViewSchema, itemViewSchema, pageViewSchema, nativeViewSchema, ownedView;
function init_analysisViewShape() {
	return (init_analysisViewShape = __esmMin((() => {
		init_digests();
		summaryViewSchema = z.strictObject({ kind: z.literal("summary") });
		facetViewSchema = z.strictObject({
			kind: z.literal("facet"),
			facet: z.enum(["mitigations", "linkage"])
		});
		indexSelectorSchema = z.strictObject({ index: z.int().nonnegative() });
		nameSelectorSchema = z.strictObject({ name: z.string().describe("Exact UTF-8 section or symbol name, matched against retained source bytes. Use index for non-UTF-8 names or unresolved name bytes.") });
		pathSelectorSchema = z.strictObject({ path: z.string().describe("Exact observed module path or original source-map reference from a module page; an empty reference is valid.") });
		nodeIdSelectorSchema = z.strictObject({ node_id: prefixedDigestSchema("jag_node") });
		moduleItemViewSchema = z.strictObject({
			kind: z.literal("item"),
			collection: z.literal("modules"),
			selector: z.union([pathSelectorSchema, nodeIdSelectorSchema])
		});
		sectionOrSymbolItemViewSchema = z.strictObject({
			kind: z.literal("item"),
			collection: z.enum(["sections", "symbols"]),
			selector: z.union([indexSelectorSchema, nameSelectorSchema])
		});
		itemViewSchema = z.discriminatedUnion("collection", [moduleItemViewSchema, sectionOrSymbolItemViewSchema]);
		pageViewSchema = z.strictObject({
			kind: z.literal("page"),
			collection: z.enum([
				"sections",
				"symbols",
				"modules"
			]),
			offset: z.int().nonnegative(),
			limit: z.int().positive()
		});
		nativeViewSchema = z.strictObject({
			kind: z.literal("native"),
			facet: z.enum([
				"procedure",
				"pseudocode",
				"assembly",
				"basic_blocks",
				"comments",
				"callers",
				"callees",
				"incoming_references",
				"outgoing_references",
				"unresolved_calls",
				"referenced_strings",
				"referenced_names",
				"swift_string_literals",
				"swift_string_literal_omissions",
				"native_api",
				"value_flow_summary",
				"value_flow_operations",
				"value_flow_def_use",
				"value_flow_effects",
				"value_flow_parameters",
				"value_flow_parameter_uses"
			]),
			offset: z.int().nonnegative().default(0),
			limit: z.int().positive().default(64)
		});
		ownedView = (view, ...kinds) => kinds.includes(view.kind) ? view : undefined;
	})))();
}

//#endregion
//#region dist/domain/analysisView/analysisViewParent.js
var createAnalysisViewResultReader, parseAnalysisViewResult, analysisViewResultInputError;
function init_analysisViewParent() {
	return (init_analysisViewParent = __esmMin((() => {
		init_inputIssueProjection();
		init_result();
		init_jsonValue();
		init_immutableJson();
		createAnalysisViewResultReader = (parser) => {
			const checked = new WeakMap();
			return (parent) => {
				const source = parent.normalizedResult;
				const reusable = parent.sealedResult === true && typeof source === "object" && source !== null && isImmutableJsonSnapshot(source);
				const known = reusable ? checked.get(source) : undefined;
				if (known !== undefined) return ok(known);
				const parsed = parseAnalysisViewResult(parser, parent);
				if (!parsed.ok || !reusable) return parsed;
				if (canBorrowParsedJsonSnapshot(source, parsed.value)) {
					checked.set(source, source);
					return ok(source);
				}
				const normalized = ownedJsonValueSchema.safeParse(parsed.value);
				if (!normalized.success) return parsed;
				freezeOwnedJsonTreeSnapshot(normalized.data);
				checked.set(source, parsed.value);
				return parsed;
			};
		};
		parseAnalysisViewResult = (parser, parent) => {
			const parsed = parser.safeParse(parent.normalizedResult);
			if (parsed.success) return ok(parsed.data);
			return err(analysisViewResultInputError(parent.normalizedResult, parsed.error));
		};
		analysisViewResultInputError = (input, cause) => analysisInputErrorFromIssues("inspect_analysis_view", cause.issues.map((issue) => ({
			...issue,
			path: [
				"source",
				"normalized_result",
				...issue.path
			]
		})), { source: { normalized_result: input } }, { cause });
	})))();
}

//#endregion
//#region dist/domain/analysisView/analysisViewCoverage.js
var analysisViewCoverageSchema, unavailableViewCoverageSchema, nullableCollectionViewCoverageSchema, unavailableViewCoverage, completeWithinViewCoverage, pageViewCoverage, ANALYSIS_VIEW_MESSAGE_BYTE_LIMIT, messageWireBytes, boundedViewMessages;
function init_analysisViewCoverage() {
	return (init_analysisViewCoverage = __esmMin((() => {
		init_canonicalOrdering();
		analysisViewCoverageSchema = z.strictObject({
			status: z.enum([
				"complete-within-view",
				"page",
				"empty"
			]),
			examined: z.int().nonnegative(),
			total: z.int().nonnegative(),
			next_offset: z.int().nonnegative().nullable(),
			exhausted: z.boolean()
		});
		unavailableViewCoverageSchema = z.strictObject({
			status: z.literal("unavailable"),
			examined: z.literal(0),
			total: z.null(),
			next_offset: z.null(),
			exhausted: z.literal(false)
		});
		nullableCollectionViewCoverageSchema = z.union([analysisViewCoverageSchema, unavailableViewCoverageSchema]);
		unavailableViewCoverage = () => ({
			status: "unavailable",
			examined: 0,
			total: null,
			next_offset: null,
			exhausted: false
		});
		completeWithinViewCoverage = (examined, total) => ({
			status: "complete-within-view",
			examined,
			total,
			next_offset: null,
			exhausted: true
		});
		pageViewCoverage = (offset, examined, total) => {
			const exhausted = offset >= total || offset + examined >= total;
			return {
				status: examined === 0 ? "empty" : "page",
				examined,
				total,
				next_offset: exhausted ? null : offset + examined,
				exhausted
			};
		};
		ANALYSIS_VIEW_MESSAGE_BYTE_LIMIT = 256 * 1024;
		messageWireBytes = (value) => (value.length * 18 + 6) * 3;
		boundedViewMessages = (values, parentEvidenceId, field, required = []) => {
			const priority = uniqueSorted(required);
			const unique = uniqueSorted([...priority, ...values]);
			const notice = (omitted) => `${String(omitted)} additional ${field} omitted from this view; consult source parent Evidence ${parentEvidenceId} for the complete list (the caller-supplied record, or its retaining session).`;
			const totalBytes = unique.reduce((total, value) => total + messageWireBytes(value), 0);
			if (totalBytes <= 262144) return unique;
			let remaining = ANALYSIS_VIEW_MESSAGE_BYTE_LIMIT - messageWireBytes(notice(unique.length));
			const retained = new Set();
			for (const value of [...priority, ...unique]) {
				if (retained.has(value)) continue;
				const bytes = messageWireBytes(value);
				if (bytes > remaining) continue;
				retained.add(value);
				remaining -= bytes;
			}
			const omitted = unique.length - retained.size;
			return omitted === 0 ? unique : [...uniqueSorted([...retained]), notice(omitted)];
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/selectViewRows.js
var selectViewRows;
function init_selectViewRows() {
	return (init_selectViewRows = __esmMin((() => {
		selectViewRows = (rows, view, matches, project) => {
			const selected = [];
			let total = 0;
			for (const [index, row] of rows.entries()) {
				if (!matches(row, index)) continue;
				if (total >= view.offset && selected.length < view.limit) selected.push(project(row, index));
				total++;
			}
			return {
				rows: selected,
				total
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/sourceToBundleComparisonSchemas.js
var evidenceIdSchema$1, nodeIdSchema$1, textSchema, SOURCE_TO_BUNDLE_SIGNAL_WEIGHTS, sourceToBundleSignalKindSchema, compareSourceToBundleInputSchema, sourceToBundleSignalSchema, sourceToBundleCandidateSchema, sourceToBundleItemSchema, sourceToBundleComparisonResultSchema;
function init_sourceToBundleComparisonSchemas() {
	return (init_sourceToBundleComparisonSchemas = __esmMin((() => {
		init_javascriptArtifactFiles();
		init_evidence();
		init_javascriptApplicationGraphSchemas();
		init_referenceSourceGraph();
		init_digests();
		evidenceIdSchema$1 = prefixedDigestSchema("ev");
		nodeIdSchema$1 = prefixedDigestSchema("jag_node");
		textSchema = z.string().min(1);
		SOURCE_TO_BUNDLE_SIGNAL_WEIGHTS = [
			["exact-source-digest", 100],
			["source-map-original-path", 70],
			["current-path-exact", 60],
			["current-path-suffix", 40],
			["unicode-equivalent-path", 20],
			["basename-match", 20],
			["language-extension", 5]
		];
		sourceToBundleSignalKindSchema = z.enum([
			"exact-source-digest",
			"source-map-original-path",
			"current-path-exact",
			"current-path-suffix",
			"unicode-equivalent-path",
			"basename-match",
			"language-extension"
		]);
		compareSourceToBundleInputSchema = z.strictObject({
			reference: historicalSourceGraphSchema,
			application: evidenceSchema
		});
		sourceToBundleSignalSchema = z.strictObject({
			kind: sourceToBundleSignalKindSchema,
			weight: z.int().min(1).max(100),
			source_value: textSchema,
			current_values: z.array(textSchema).min(1)
		});
		sourceToBundleCandidateSchema = z.strictObject({
			current_file_occurrence: javaScriptFileOccurrenceSchema.exactOptional(),
			representation_node_ids: z.array(nodeIdSchema$1).min(1).exactOptional(),
			current_node_id: nodeIdSchema$1,
			current_node_kind: z.enum(JAVASCRIPT_APPLICATION_NODE_KINDS),
			score: z.int().min(1),
			confidence: z.enum([
				"exact",
				"high",
				"medium",
				"low"
			]),
			signals: z.array(sourceToBundleSignalSchema).min(1)
		});
		sourceToBundleItemSchema = z.strictObject({
			mapping_id: prefixedDigestSchema("stbc_item"),
			source_path: textSchema,
			source_sha256: digestSchema.nullable(),
			source_language: textSchema.nullable(),
			status: z.enum([
				"unchanged",
				"modified",
				"removed",
				"split",
				"merged",
				"duplicated",
				"unknown"
			]),
			confidence: z.enum([
				"exact",
				"high",
				"medium",
				"unknown"
			]),
			current_node_ids: z.array(nodeIdSchema$1),
			candidates: z.array(sourceToBundleCandidateSchema),
			limitations: z.array(textSchema)
		});
		sourceToBundleComparisonResultSchema = z.strictObject({
			comparison_id: prefixedDigestSchema("stbc"),
			reference: z.strictObject({
				root_sha256: digestSchema,
				inventory_state: z.enum([
					"complete",
					"partial",
					"unknown"
				])
			}),
			application: z.strictObject({
				evidence_id: evidenceIdSchema$1,
				graph_id: prefixedDigestSchema("jag"),
				root_artifact_sha256: digestSchema
			}),
			scoring: z.strictObject({
				algorithm: z.literal("rea-source-to-bundle-signals"),
				minimum_candidate_score: z.literal(20),
				weights: z.array(z.strictObject({
					signal: sourceToBundleSignalKindSchema,
					weight: z.int().min(1).max(100)
				}))
			}),
			summary: z.strictObject({
				unchanged: z.int().min(0),
				modified: z.int().min(0),
				removed: z.int().min(0),
				split: z.int().min(0),
				merged: z.int().min(0),
				duplicated: z.int().min(0),
				unknown: z.int().min(0)
			}),
			items: z.array(sourceToBundleItemSchema),
			unmapped_current_node_ids: z.array(nodeIdSchema$1),
			coverage: z.strictObject({
				status: z.enum(["complete-within-inputs", "partial"]),
				reference_inventory_state: z.enum([
					"complete",
					"partial",
					"unknown"
				]),
				application_graph_status: z.enum([
					"complete",
					"partial",
					"unknown",
					"unavailable"
				]),
				retained_source_files: z.int().min(0),
				retained_application_nodes: z.int().min(0),
				candidate_evaluations: z.int().min(0)
			}),
			evidence_links: z.array(evidenceIdSchema$1).length(1),
			limitations: z.array(textSchema)
		});
	})))();
}

//#endregion
//#region dist/domain/analysisView/sourceToBundleView.js
var mapping, candidate, identity, mappingRow, candidateRow, page$1, sourceToBundleViewRequestSchema, sourceToBundleViewItemsSchema, sourceToBundleViewContextSchema, checkedReport, selected$1, columns, projectSourceToBundleView;
function init_sourceToBundleView() {
	return (init_sourceToBundleView = __esmMin((() => {
		init_sourceToBundleComparisonSchemas();
		init_result();
		init_analysisViewShape();
		init_analysisViewErrors();
		init_analysisViewParent();
		init_analysisViewCoverage();
		init_selectViewRows();
		mapping = sourceToBundleComparisonResultSchema.shape.items.element;
		candidate = mapping.shape.candidates.element;
		identity = mapping.pick({
			mapping_id: true,
			source_path: true
		}).extend({ source_index: z.number().int().nonnegative() });
		mappingRow = mapping.omit({
			candidates: true,
			current_node_ids: true
		}).extend({
			source_index: identity.shape.source_index,
			candidate_count: z.number().int().nonnegative(),
			mapped_node_count: z.number().int().nonnegative()
		});
		candidateRow = candidate.extend({
			...identity.shape,
			candidate_index: z.number().int().nonnegative(),
			mapped: z.boolean()
		});
		page$1 = {
			kind: z.literal("source-to-bundle"),
			source_paths: z.array(z.string()).optional(),
			mapping_ids: z.array(mapping.shape.mapping_id).optional(),
			statuses: z.array(mapping.shape.status).optional(),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		};
		sourceToBundleViewRequestSchema = z.discriminatedUnion("collection", [z.strictObject({
			...page$1,
			collection: z.literal("mappings"),
			fields: z.array(mappingRow.keyof()).optional()
		}), z.strictObject({
			...page$1,
			collection: z.literal("candidates"),
			fields: z.array(candidateRow.keyof()).optional()
		})]);
		sourceToBundleViewItemsSchema = z.union([z.array(mappingRow.partial().required({
			mapping_id: true,
			source_path: true,
			source_index: true
		})), z.array(candidateRow.partial().required({
			mapping_id: true,
			source_path: true,
			source_index: true,
			candidate_index: true,
			current_node_id: true,
			mapped: true
		}))]);
		sourceToBundleViewContextSchema = sourceToBundleComparisonResultSchema.pick({
			comparison_id: true,
			reference: true,
			application: true,
			scoring: true,
			summary: true,
			evidence_links: true
		}).extend({
			source_coverage: sourceToBundleComparisonResultSchema.shape.coverage,
			unmapped_current_node_count: z.number().int().nonnegative()
		});
		checkedReport = createAnalysisViewResultReader(sourceToBundleComparisonResultSchema);
		selected$1 = (values) => values === undefined ? undefined : new Set(values);
		columns = (row, fields) => {
			const source = row;
			return Object.fromEntries(fields.map((field) => [field, source[field]]));
		};
		projectSourceToBundleView = (parent, admitted) => {
			const view = ownedView(admitted, "summary", "source-to-bundle");
			if (view === undefined) return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "Source-to-bundle comparisons support summary and source-to-bundle pages"
			}]));
			const parsed = checkedReport(parent);
			if (!parsed.ok) return parsed;
			const report = parsed.value;
			const { items: _items, unmapped_current_node_ids, coverage: source_coverage, limitations: _limitations, ...facts } = report;
			const context = {
				...facts,
				source_coverage,
				unmapped_current_node_count: unmapped_current_node_ids.length
			};
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "compare_source_to_bundle",
				parent_digest: parent.evidenceId.slice(3),
				artifact: null,
				limitations: boundedViewMessages([...parent.limitations, ...report.limitations], parent.evidenceId, "limitations"),
				unknowns: ["Candidate correspondence is not behavioral equivalence. Exhausting a selected page does not establish absence outside the examined inputs."]
			};
			if (view.kind === "summary") return ok({
				kind: "summary",
				view,
				...shared,
				summary: context,
				coverage: completeWithinViewCoverage(1, 1)
			});
			const paths = selected$1(view.source_paths), ids = selected$1(view.mapping_ids), statuses = selected$1(view.statuses);
			const matches = (row) => (paths === undefined || paths.has(row.source_path)) && (ids === undefined || ids.has(row.mapping_id)) && (statuses === undefined || statuses.has(row.status));
			const fields = view.fields ?? (view.collection === "mappings" ? [
				"status",
				"confidence",
				"source_sha256",
				"source_language",
				"candidate_count",
				"mapped_node_count"
			] : [
				"current_node_kind",
				"score",
				"confidence"
			]);
			let items, total;
			if (view.collection === "mappings") {
				const page = selectViewRows(report.items, view, matches, (row, source_index) => ({
					...columns({
						...row,
						source_index,
						candidate_count: row.candidates.length,
						mapped_node_count: row.current_node_ids.length
					}, fields),
					mapping_id: row.mapping_id,
					source_path: row.source_path,
					source_index
				}));
				items = page.rows;
				total = page.total;
			} else {
				items = [];
				total = 0;
				for (const [source_index, row] of report.items.entries()) {
					if (!matches(row)) continue;
					const start = Math.max(0, view.offset - total);
					const end = Math.min(row.candidates.length, start + view.limit - items.length);
					if (start < end) {
						const mapped = new Set(row.current_node_ids);
						for (let candidate_index = start; candidate_index < end; candidate_index++) {
							const candidate = row.candidates[candidate_index];
							items.push({
								...columns(candidate, fields),
								mapping_id: row.mapping_id,
								source_path: row.source_path,
								source_index,
								candidate_index,
								current_node_id: candidate.current_node_id,
								mapped: mapped.has(candidate.current_node_id)
							});
						}
					}
					total += row.candidates.length;
				}
			}
			return ok({
				kind: "source-to-bundle",
				view,
				...shared,
				...context,
				items,
				coverage: pageViewCoverage(view.offset, items.length, total)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptFeatureTraceSchemas.js
var evidenceIdSchema, nodeIdSchema, edgeIdSchema, boundedTextSchema, featureSeedMatchMode, apiSeedSchema, apiPathSeedSchema, applicationFeatureSeedSchema, validateApplicationTraceIdentities, applicationTraceIdentitiesSchema, traceApplicationFeatureInputSchema, seedMatchSchema, tracePathSchema, nativeHandoffSchema, applicationFeatureTraceResultSchema;
function init_javascriptFeatureTraceSchemas() {
	return (init_javascriptFeatureTraceSchemas = __esmMin((() => {
		init_evidence();
		init_javascriptApplicationGraph();
		init_digests();
		evidenceIdSchema = prefixedDigestSchema("ev");
		nodeIdSchema = prefixedDigestSchema("jag_node");
		edgeIdSchema = prefixedDigestSchema("jag_edge");
		boundedTextSchema = z.string().min(1);
		featureSeedMatchMode = (seed) => seed.match ?? (seed.kind === "string" ? "contains" : "exact");
		apiSeedSchema = z.union([z.strictObject({
			kind: z.literal("api"),
			value: boundedTextSchema,
			match: z.enum(["exact", "contains"]).nullable().default(null),
			case_sensitive: z.boolean().default(false)
		}), z.strictObject({
			kind: z.literal("api"),
			value: z.literal(""),
			match: z.literal("exact"),
			case_sensitive: z.boolean().default(false)
		})]);
		apiPathSeedSchema = z.union([z.strictObject({
			kind: z.literal("api"),
			value: boundedTextSchema,
			match: z.enum(["exact", "contains"]).nullable().default(null),
			case_sensitive: z.boolean().default(false),
			entry_path: z.array(z.string()).min(1)
		}), z.strictObject({
			kind: z.literal("api"),
			value: z.literal(""),
			match: z.literal("exact"),
			case_sensitive: z.boolean().default(false),
			entry_path: z.array(z.string()).min(1)
		})]);
		applicationFeatureSeedSchema = z.union([
			z.strictObject({
				kind: z.enum([
					"node-id",
					"route",
					"string",
					"channel",
					"module",
					"native-export"
				]),
				value: boundedTextSchema,
				match: z.enum(["exact", "contains"]).nullable().default(null),
				case_sensitive: z.boolean().default(false)
			}),
			z.strictObject({
				kind: z.enum([
					"route",
					"string",
					"channel",
					"module",
					"native-export"
				]),
				value: z.literal(""),
				match: z.literal("exact"),
				case_sensitive: z.boolean().default(false)
			}),
			apiSeedSchema,
			apiPathSeedSchema
		]);
		validateApplicationTraceIdentities = (input, context) => {
			const ids = input.native_observations.map(({ evidence_id: id }) => id);
			if (new Set(ids).size !== ids.length) context.addIssue({
				code: "custom",
				path: ["native_observations"],
				message: "Native observations must be unique"
			});
		};
		applicationTraceIdentitiesSchema = z.object({ native_observations: z.array(z.object({ evidence_id: evidenceIdSchema })) }).superRefine(validateApplicationTraceIdentities);
		traceApplicationFeatureInputSchema = z.strictObject({
			application: evidenceSchema,
			native_observations: z.array(evidenceSchema).default([]),
			seed: applicationFeatureSeedSchema,
			semantic_page: z.strictObject({
				offset: z.int().nonnegative().default(0),
				limit: z.int().positive().default(64)
			}).optional().describe("Page retained semantic label matches when a string seed has no application match. Defaults to offset 0 and limit 64."),
			direction: z.enum([
				"outgoing",
				"incoming",
				"both"
			]).default("both")
		}).superRefine(validateApplicationTraceIdentities);
		seedMatchSchema = z.strictObject({
			node_id: nodeIdSchema,
			kind: z.string().min(1),
			basis: z.enum([
				"node-id",
				"label",
				"identity",
				"property"
			]),
			field: z.string().min(1)
		});
		tracePathSchema = z.strictObject({
			path_id: prefixedDigestSchema("jatp"),
			start_node_id: nodeIdSchema,
			end_node_id: nodeIdSchema,
			end_kind: z.string().min(1),
			node_ids: z.array(nodeIdSchema).min(1),
			edge_ids: z.array(edgeIdSchema),
			authorities: z.array(z.string().min(1)),
			contains_inference: z.boolean()
		});
		nativeHandoffSchema = z.strictObject({
			native_node_id: nodeIdSchema,
			artifact_sha256: digestSchema,
			artifact_path: z.string().min(1).nullable(),
			export_node_ids: z.array(nodeIdSchema),
			requested_exports: z.array(boundedTextSchema),
			status: z.enum(["evidence-linked", "requires-provider-analysis"]),
			providers: z.array(providerSchema),
			evidence_ids: z.array(evidenceIdSchema),
			recommended_tools: z.array(z.enum([
				"open_binary",
				"binary_overview",
				"search_procedures",
				"analyze_function",
				"xrefs"
			]))
		});
		applicationFeatureTraceResultSchema = z.strictObject({
			trace_id: prefixedDigestSchema("jatr"),
			source_evidence_id: evidenceIdSchema,
			source_graph_id: prefixedDigestSchema("jag"),
			seed: applicationFeatureSeedSchema,
			direction: z.enum([
				"outgoing",
				"incoming",
				"both"
			]),
			seed_matches: z.array(seedMatchSchema),
			semantic_discovery: z.strictObject({
				source_graph_id: prefixedDigestSchema("jsrg"),
				source_coverage: z.enum([
					"complete",
					"partial",
					"unknown",
					"unavailable"
				]),
				total: z.int().nonnegative(),
				offset: z.int().nonnegative(),
				limit: z.int().positive(),
				next_offset: z.int().nonnegative().nullable(),
				matches: z.array(z.strictObject({
					node_id: prefixedDigestSchema("jsrg_node"),
					kind: z.string().min(1),
					trace_seed: z.strictObject({
						kind: z.literal("semantic-node"),
						node_id: prefixedDigestSchema("jsrg_node")
					})
				}))
			}).optional().describe("On an unmatched string seed, retained semantic labels and direct string call arguments use the requested match mode and case sensitivity. Use a trace_seed with trace_javascript_semantics; source coverage limits absence claims."),
			graph: javascriptApplicationGraphSchema.nullable(),
			paths: z.array(tracePathSchema),
			native_handoffs: z.array(nativeHandoffSchema),
			summary: z.strictObject({
				matched_seeds: z.int().min(0),
				traced_nodes: z.int().min(0),
				traced_edges: z.int().min(0),
				terminal_paths: z.int().min(0),
				native_handoffs: z.int().min(0),
				observed_facts: z.int().min(0),
				inferred_facts: z.int().min(0),
				unknown_facts: z.int().min(0),
				unavailable_facts: z.int().min(0)
			}),
			coverage: z.strictObject({
				status: z.enum([
					"complete-within-source",
					"partial",
					"no-match"
				]),
				source_graph_status: z.enum([
					"complete",
					"partial",
					"unknown",
					"unavailable"
				]),
				total_seed_matches: z.int().min(0)
			}),
			evidence_links: z.array(evidenceIdSchema).min(1),
			limitations: z.array(boundedTextSchema)
		});
	})))();
}

//#endregion
//#region dist/domain/analysisView/javascriptModuleReferences.js
var moduleKindSchema, javascriptModuleReferencesRequestSchema, javascriptFactBasisSchema, javascriptFactBasis, javascriptModuleReferenceSchema;
function init_javascriptModuleReferences() {
	return (init_javascriptModuleReferences = __esmMin((() => {
		init_digests();
		init_javascriptApplicationEvidenceSchemas();
		moduleKindSchema = z.enum([
			"javascript-asset",
			"javascript-module",
			"source-module"
		]);
		javascriptModuleReferencesRequestSchema = z.strictObject({
			kind: z.literal("javascript"),
			collection: z.literal("modules"),
			projection: z.literal("references"),
			where: z.strictObject({
				path: z.string().nullable().optional(),
				kind: moduleKindSchema.optional()
			}).default({}),
			offset: z.int().nonnegative().default(0),
			limit: z.int().positive().default(64)
		});
		javascriptFactBasisSchema = z.strictObject({
			authority: applicationGraphEvidenceSchema.shape.authority,
			state: applicationGraphEvidenceSchema.shape.state,
			confidence: applicationGraphEvidenceSchema.shape.confidence
		});
		javascriptFactBasis = (evidence) => {
			const support = new Map();
			for (const { authority, state, confidence } of evidence) support.set(`${authority}:${state}:${confidence}`, {
				authority,
				state,
				confidence
			});
			return [...support.values()];
		};
		javascriptModuleReferenceSchema = z.strictObject({
			node_id: prefixedDigestSchema("jag_node"),
			kind: moduleKindSchema,
			path: z.string().nullable(),
			identity: applicationNodeIdentitySchema,
			retained_source_range_count: z.int().nonnegative(),
			basis: z.array(javascriptFactBasisSchema).min(1)
		});
	})))();
}

//#endregion
//#region dist/domain/analysisView/featureTraceView.js
var OPERATION, trace, nodeIdsFilter, page, pathsRequestSchema, nodesRequestSchema, edgesRequestSchema, seedMatchesRequestSchema, handoffsRequestSchema, featureTraceViewRequestSchema, featureTraceNodeRowSchema, featureTraceViewCollections, featureTraceViewContextSchema, featureTraceSummarySchema, checkedTrace, selected, traceContext, traceUnknowns, nodeRow, tracePage, projectFeatureTraceView;
function init_featureTraceView() {
	return (init_featureTraceView = __esmMin((() => {
		init_digests();
		init_javascriptApplicationEvidenceSchemas();
		init_javascriptApplicationGraphSchemas();
		init_javascriptFeatureTraceSchemas();
		init_result();
		init_analysisViewCoverage();
		init_analysisViewErrors();
		init_analysisViewParent();
		init_analysisViewShape();
		init_javascriptModuleReferences();
		init_selectViewRows();
		OPERATION = "trace_application_feature";
		trace = applicationFeatureTraceResultSchema.shape;
		nodeIdsFilter = z.array(prefixedDigestSchema("jag_node")).optional().describe("Exact trace node identities. Omitted selects all; [] selects none.");
		page = {
			kind: z.literal("feature-trace"),
			offset: z.int().nonnegative().default(0),
			limit: z.int().positive().default(64)
		};
		pathsRequestSchema = z.strictObject({
			...page,
			collection: z.literal("paths"),
			where: z.strictObject({
				node_ids: nodeIdsFilter.describe("Select terminal paths that visit any of these exact node identities. Omitted selects all; [] selects none."),
				end_kinds: z.array(applicationNodeSchema.shape.kind).optional()
			}).default({})
		});
		nodesRequestSchema = z.strictObject({
			...page,
			collection: z.literal("nodes"),
			where: z.strictObject({
				node_ids: nodeIdsFilter,
				kinds: z.array(applicationNodeSchema.shape.kind).optional()
			}).default({}),
			include_observations: z.boolean().default(false).describe("Opt into each selected node's complete retained observations, including properties and provenance.")
		});
		edgesRequestSchema = z.strictObject({
			...page,
			collection: z.literal("edges"),
			where: z.strictObject({
				node_ids: nodeIdsFilter.describe("Select edges whose source or target is one of these exact node identities. Omitted selects all; [] selects none."),
				relations: z.array(applicationEdgeSchema.shape.relation).optional()
			}).default({})
		});
		seedMatchesRequestSchema = z.strictObject({
			...page,
			collection: z.literal("seed_matches")
		});
		handoffsRequestSchema = z.strictObject({
			...page,
			collection: z.literal("native_handoffs")
		});
		featureTraceViewRequestSchema = z.discriminatedUnion("collection", [
			pathsRequestSchema,
			nodesRequestSchema,
			edgesRequestSchema,
			seedMatchesRequestSchema,
			handoffsRequestSchema
		]);
		featureTraceNodeRowSchema = applicationNodeSchema.pick({
			node_id: true,
			kind: true,
			identity: true
		}).extend({
			seed: z.boolean().describe("Whether this node matched the trace seed (a trace root)."),
			observation_count: z.int().positive(),
			basis: z.array(javascriptFactBasisSchema).min(1),
			observations: applicationNodeSchema.shape.observations.exactOptional()
		});
		featureTraceViewCollections = {
			paths: {
				request: pathsRequestSchema,
				rows: z.array(trace.paths.element)
			},
			nodes: {
				request: nodesRequestSchema,
				rows: z.array(featureTraceNodeRowSchema)
			},
			edges: {
				request: edgesRequestSchema,
				rows: z.array(applicationEdgeSchema)
			},
			seed_matches: {
				request: seedMatchesRequestSchema,
				rows: z.array(trace.seed_matches.element)
			},
			native_handoffs: {
				request: handoffsRequestSchema,
				rows: z.array(trace.native_handoffs.element)
			}
		};
		featureTraceViewContextSchema = z.strictObject({
			trace_id: trace.trace_id,
			source_evidence_id: trace.source_evidence_id,
			source_graph_id: trace.source_graph_id,
			seed: trace.seed,
			direction: trace.direction,
			summary: trace.summary,
			trace_coverage: trace.coverage,
			graph_coverage: applicationCoverageSchema.nullable().describe("The traced subgraph's coverage, or null when no seed matched."),
			evidence_links: trace.evidence_links
		});
		featureTraceSummarySchema = featureTraceViewContextSchema.extend({
			semantic_discovery: trace.semantic_discovery,
			limitation_count: z.int().nonnegative()
		});
		checkedTrace = createAnalysisViewResultReader(applicationFeatureTraceResultSchema);
		selected = (values) => values === undefined ? undefined : new Set(values);
		traceContext = (result) => ({
			trace_id: result.trace_id,
			source_evidence_id: result.source_evidence_id,
			source_graph_id: result.source_graph_id,
			seed: result.seed,
			direction: result.direction,
			summary: result.summary,
			trace_coverage: result.coverage,
			graph_coverage: result.graph?.coverage ?? null,
			evidence_links: result.evidence_links
		});
		traceUnknowns = (result) => [...result.coverage.status === "partial" ? [`trace_coverage.status is partial because the source application graph is ${result.coverage.source_graph_status}; unmatched seeds and frontiers remain unknown.`] : [], "Trace connectivity does not prove runtime execution or reachability. Exhausting a page establishes nothing outside this trace."];
		nodeRow = (node, seeds, includeObservations) => ({
			node_id: node.node_id,
			kind: node.kind,
			identity: node.identity,
			seed: seeds.has(node.node_id),
			observation_count: node.observations.length,
			basis: javascriptFactBasis(node.observations.map(({ evidence }) => evidence)),
			...includeObservations ? { observations: node.observations } : {}
		});
		tracePage = (result, view, shared) => {
			const pageOf = (selection, { rows, total }) => ({
				kind: "feature-trace",
				view: selection,
				...shared,
				items: rows,
				coverage: pageViewCoverage(selection.offset, rows.length, total)
			});
			const all = () => true;
			if (view.collection === "seed_matches") return pageOf(view, selectViewRows(result.seed_matches, view, all, (row) => row));
			if (view.collection === "native_handoffs") return pageOf(view, selectViewRows(result.native_handoffs, view, all, (row) => row));
			if (view.collection === "paths") {
				const nodes = selected(view.where.node_ids);
				const ends = selected(view.where.end_kinds);
				return pageOf(view, selectViewRows(result.paths, view, (path) => (ends === undefined || ends.has(path.end_kind)) && (nodes === undefined || path.node_ids.some((id) => nodes.has(id))), (path) => path));
			}
			const graph = result.graph;
			if (view.collection === "edges") {
				const nodes = selected(view.where.node_ids);
				const relations = selected(view.where.relations);
				return pageOf(view, selectViewRows(graph?.edges ?? [], view, (edge) => (relations === undefined || relations.has(edge.relation)) && (nodes === undefined || nodes.has(edge.source_node_id) || nodes.has(edge.target_node_id)), (edge) => edge));
			}
			const ids = selected(view.where.node_ids);
			const kinds = selected(view.where.kinds);
			const seeds = new Set(result.seed_matches.map(({ node_id: id }) => id));
			return pageOf(view, selectViewRows(graph?.nodes ?? [], view, (node) => (ids === undefined || ids.has(node.node_id)) && (kinds === undefined || kinds.has(node.kind)), (node) => nodeRow(node, seeds, view.include_observations)));
		};
		projectFeatureTraceView = (parent, admitted) => {
			const view = ownedView(admitted, "summary", "feature-trace");
			if (view === undefined) return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "Application feature traces support summary and feature-trace pages of paths, nodes, edges, seed_matches or native_handoffs."
			}]));
			const parsed = checkedTrace(parent);
			if (!parsed.ok) return parsed;
			const result = parsed.value;
			const limitations = [
				...parent.limitations,
				...result.limitations,
				...result.graph?.limitations ?? []
			];
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: OPERATION,
				parent_digest: parent.evidenceId.slice(3),
				artifact: null,
				limitations: boundedViewMessages(limitations, parent.evidenceId, "limitations"),
				unknowns: boundedViewMessages([], parent.evidenceId, "unknowns", traceUnknowns(result))
			};
			const context = traceContext(result);
			if (view.kind === "summary") return ok({
				kind: "summary",
				view,
				...shared,
				summary: {
					...context,
					...result.semantic_discovery === undefined ? {} : { semantic_discovery: result.semantic_discovery },
					limitation_count: new Set(limitations).size
				},
				coverage: completeWithinViewCoverage(1, 1)
			});
			return ok(tracePage(result, view, {
				...shared,
				...context
			}));
		};
	})))();
}

//#endregion
export { SOURCE_TO_BUNDLE_SIGNAL_WEIGHTS, analysisViewCoverageSchema, analysisViewResultInputError, applicationFeatureTraceResultSchema, applicationTraceIdentitiesSchema, assertOwnedView, boundedViewMessages, compareSourceToBundleInputSchema, completeWithinViewCoverage, createAnalysisViewResultReader, facetViewSchema, featureSeedMatchMode, featureTraceSummarySchema, featureTraceViewCollections, featureTraceViewContextSchema, featureTraceViewRequestSchema, init_analysisViewCoverage, init_analysisViewParent, init_analysisViewShape, init_featureTraceView, init_javascriptFeatureTraceSchemas, init_javascriptModuleReferences, init_selectViewRows, init_sourceToBundleComparisonSchemas, init_sourceToBundleView, itemViewSchema, javascriptFactBasis, javascriptModuleReferenceSchema, javascriptModuleReferencesRequestSchema, nativeViewSchema, nullableCollectionViewCoverageSchema, ownedView, pageViewCoverage, pageViewSchema, parseAnalysisViewResult, projectFeatureTraceView, projectSourceToBundleView, selectViewRows, sourceToBundleComparisonResultSchema, sourceToBundleViewContextSchema, sourceToBundleViewItemsSchema, sourceToBundleViewRequestSchema, summaryViewSchema, traceApplicationFeatureInputSchema, unavailableViewCoverage };