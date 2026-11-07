import { n as __exportAll, t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as javaScriptRuntime, t as init_runtimeVersion } from "./runtimeVersion-szp03aif.js";
import { n as init_analysisErrorBase, t as AnalysisError } from "./analysisErrorBase-DIqf4-vY.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { D as JAVASCRIPT_STATIC_FACT_BYTES, Ut as safeParseUtf8Json, Vt as init_safeJson, k as init_javascriptAnalysisResourceControls } from "./analysisErrorProjection-B_6dTGtM.js";
import { a as AnalysisCapabilityUnavailableError, f as init_analysisErrorCore, i as AnalysisCancelledError, l as AnalysisResourceConstraintError, s as AnalysisOutputError, u as AnalysisTimeoutError } from "./analysisErrorCore-BCqhUcUc.js";
import { a as init_browserObservation, i as browserOriginSchema } from "./browserObservation-DGb-Qd7N.js";
import { n as AnalysisCleanupLeaseGroup, r as init_AnalysisCleanupLease, t as AnalysisCleanupLease } from "./AnalysisCleanupLease-Cqxpxr67.js";
import { n as ArtifactResourceScope, r as init_ArtifactResourceScope } from "./ArtifactResourceScope-CStgM9Qm.js";
import { c as init_RuntimeControlUnavailableError, l as runtimeControlCapabilityError, s as RuntimeControlUnavailableError } from "./WindowsNativeLoader-DzmLgZxm.js";
import { n as init_ProviderDeadline, t as ProviderStartupDeadline } from "./ProviderDeadline-BHJfBmfF.js";
import { d as withArtifactFileHandle, i as artifactFileCompletion, l as init_ArtifactFileOperation, n as ArtifactFileCleanupFailure } from "./ArtifactFileOperation-cr4zEunz.js";
import { n as init_digests, t as digestSchema } from "./digests-Ct-nksBF.js";
import { i as init_jsonSerialization, o as jsonParts, t as bufferedJsonParts } from "./jsonSerialization-CtVI6orp.js";
import { $r as WorkerFrameSignal, Hi as init_readStableArtifact, Jr as javaScriptWorkerMemoryLimitBytes, Qr as processWorkerCleanup, Ui as readStableArtifact, Vi as completedStableArtifact, Xr as WorkerCleanupRegistry, Yr as OwnedWorkerRuntime, Zr as init_OwnedWorkerRuntime, ba as init_javascriptSemanticTraversal, ei as init_WorkerFrameSignal, ma as init_javascriptSemanticCoverage, ni as init_analysisErrorCancellation, pa as RETURNED_REFERENCE_WIDENING_LIMITATION, qr as init_JavaScriptWorkerMemoryLimit, ti as analysisErrorWithCancellation, ya as completeSemanticSteps } from "./createServer-CMxQrH3I.js";
import { i as webPageInspectionSchema, r as init_browserObservationSchemas } from "./browserObservationSchemas-BmFQ_kVQ.js";
import { E as init_javascriptRouteFacts, O as javaScriptRouteSourceFactsSchema, a as MAX_WEB_BUNDLE_HEAP_MB, d as webBundleHeapExhaustedReason, f as webBundleHeapExhaustedRemediation, g as webBundleTotalTimeoutRecovery, h as webBundleScriptTimeoutRecovery, i as DEFAULT_WEB_BUNDLE_TOTAL_TIMEOUT_MS, l as webBundleAnalysisSchema, m as webBundleResultAdmissionFailure, n as DEFAULT_WEB_BUNDLE_HEAP_MB, p as webBundleMemoryExhaustion, r as DEFAULT_WEB_BUNDLE_SCRIPT_TIMEOUT_MS, s as init_webBundleAnalysis, u as webBundleFixedByteBudget, v as buildJavaScriptRouteInventorySteps, y as init_javascriptRouteInventory } from "./webBundleAnalysis-CMBlS1D9.js";
import { l as webTextArtifactSchema, s as init_webContentArtifact } from "./cdpObservationSchemas-Bu-3wMbg.js";
import { n as init_analysisErrorCleanup, t as analysisErrorWithCleanupFailure } from "./analysisErrorCleanup-CLocSgSR.js";
import { n as init_providerCleanupError, t as ProviderCleanupError } from "./providerCleanupError-CbzQ5mbk.js";
import { n as init_webRuntime, t as WEB_RUNTIME_LIMITS } from "./webRuntime-D-rId2Bd.js";
import { l as init_ProcessOwnershipObservation, m as prepareProcessOwnershipInspection } from "./ProcessOwnership-DPTLd85r.js";
import { n as init_ProviderProcess, r as spawnOwnedProviderProcess } from "./ProviderProcess-Btnq1dLp.js";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { open, rm } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { getHeapStatistics } from "node:v8";
import { StringDecoder } from "node:string_decoder";

//#region dist/domain/webBundleAnalyzerState.js
var createWebBundleAnalysisAccumulator, isIncludedScript;
function init_webBundleAnalyzerState() {
	return (init_webBundleAnalyzerState = __esmMin((() => {
		createWebBundleAnalysisAccumulator = () => ({
			edges: [],
			routes: [],
			endpoints: [],
			webMcp: [],
			inferences: [],
			seen: new Set(),
			visitedNodes: 0,
			parsedScripts: 0,
			failedScripts: [],
			recoveredScripts: [],
			widenedScripts: []
		});
		isIncludedScript = (script) => script.source.included;
	})))();
}

//#endregion
//#region dist/domain/webBundleScriptAnalysis.js
var observationsSchema, webBundleScriptAnalysisSchema;
function init_webBundleScriptAnalysis() {
	return (init_webBundleScriptAnalysis = __esmMin((() => {
		init_webBundleAnalysis();
		init_javascriptRouteFacts();
		observationsSchema = z.strictObject({
			edges: webBundleAnalysisSchema.shape.observations.shape.chunks.shape.edges,
			routes: webBundleAnalysisSchema.shape.observations.shape.routes,
			endpoints: webBundleAnalysisSchema.shape.observations.shape.endpoints,
			webmcp_declarations: webBundleAnalysisSchema.shape.observations.shape.webmcp_declarations
		});
		webBundleScriptAnalysisSchema = z.discriminatedUnion("status", [z.strictObject({
			status: z.literal("analyzed"),
			script_key: z.string(),
			parse_status: z.enum([
				"parsed",
				"recovered",
				"failed"
			]),
			visited_ast_nodes: z.number().int().min(0),
			widened_return_references: z.boolean(),
			route_facts: javaScriptRouteSourceFactsSchema.nullable().optional(),
			observations: observationsSchema,
			inferences: webBundleAnalysisSchema.shape.inferences
		}), z.strictObject({
			status: z.literal("unavailable"),
			script_key: z.string(),
			reason: z.enum([
				"worker_failure",
				"deadline",
				"resource_constraint",
				"cancelled",
				"not_started"
			]),
			detail: z.string().optional()
		})]).superRefine((result, context) => {
			if (result.status !== "analyzed") return;
			const checkScriptKey = (scriptKey, path) => {
				if (scriptKey !== result.script_key) context.addIssue({
					code: "custom",
					path,
					message: "Per-script analysis evidence must name its owning script"
				});
			};
			result.observations.edges.forEach((edge, index) => {
				checkScriptKey(edge.from_script_key, [
					"observations",
					"edges",
					index,
					"from_script_key"
				]);
				checkScriptKey(edge.location.script_key, [
					"observations",
					"edges",
					index,
					"location",
					"script_key"
				]);
			});
			for (const collection of ["routes", "endpoints"]) result.observations[collection].forEach((finding, index) => checkScriptKey(finding.location.script_key, [
				"observations",
				collection,
				index,
				"location",
				"script_key"
			]));
			result.observations.webmcp_declarations.forEach((declaration, index) => checkScriptKey(declaration.location.script_key, [
				"observations",
				"webmcp_declarations",
				index,
				"location",
				"script_key"
			]));
			result.inferences.forEach((inference, inferenceIndex) => inference.basis.forEach((basis, basisIndex) => checkScriptKey(basis.script_key, [
				"inferences",
				inferenceIndex,
				"basis",
				basisIndex,
				"script_key"
			])));
			if (result.parse_status === "failed") {
				const hasFindings = result.observations.edges.length > 0 || result.observations.routes.length > 0 || result.observations.endpoints.length > 0 || result.observations.webmcp_declarations.length > 0 || result.inferences.length > 0;
				if (result.visited_ast_nodes !== 0 || result.widened_return_references || hasFindings) context.addIssue({
					code: "custom",
					path: ["parse_status"],
					message: "A failed script parse cannot carry visited nodes or derived findings"
				});
			}
		});
	})))();
}

//#endregion
//#region dist/domain/webBundleAnalyzerResult.js
var buildCapturedWebBundleAnalysis, mergeScriptResults, buildCaptureObservation, sourceArtifact, chunkNode, buildUnknowns, captureBudgetOmission, groupUnavailableAnalyses, analysisUnavailableReason, captureBudgetReason, buildCompleteness, bundleLimitations;
function init_webBundleAnalyzerResult() {
	return (init_webBundleAnalyzerResult = __esmMin((() => {
		init_javascriptRouteInventory();
		init_javascriptSemanticTraversal();
		init_javascriptSemanticCoverage();
		init_browserObservation();
		init_webBundleAnalysis();
		init_webBundleAnalyzerState();
		init_webBundleScriptAnalysis();
		buildCapturedWebBundleAnalysis = (inspection, sourceMaps, rawResults) => {
			const results = rawResults.map((result) => webBundleScriptAnalysisSchema.parse(result));
			const byKey = new Map();
			for (const result of results) {
				if (byKey.has(result.script_key)) throw new TypeError(`Duplicate script analysis result: ${result.script_key}`);
				byKey.set(result.script_key, result);
			}
			const sourceScripts = inspection.scripts.items.filter(isIncludedScript);
			const expectedKeys = new Set(sourceScripts.map(({ script_key }) => script_key));
			for (const key of byKey.keys()) if (!expectedKeys.has(key)) throw new TypeError(`Unexpected script analysis result: ${key}`);
			const orderedResults = sourceScripts.map((script) => byKey.get(script.script_key) ?? {
				status: "unavailable",
				script_key: script.script_key,
				reason: "worker_failure",
				detail: "No analysis result was returned for this captured script."
			});
			const unavailableAnalyses = orderedResults.filter((result) => result.status === "unavailable");
			const accumulator = mergeScriptResults(orderedResults.filter((result) => result.status === "analyzed"));
			const attemptedScripts = orderedResults.filter((result) => !(result.status === "unavailable" && result.reason === "not_started")).length;
			const unavailable = inspection.scripts.items.filter((script) => !script.source.included).map(({ script_key }) => script_key);
			const unavailableSourceReasons = [...new Set(inspection.scripts.items.flatMap((script) => script.source.included ? [] : [script.source.reason]))].sort();
			const omittedScripts = captureBudgetOmission(inspection, "scripts");
			const omittedSourceScripts = captureBudgetOmission(inspection, "script_sources");
			const omittedSourceMaps = sourceMaps.status === "not_requested" || sourceMaps.excluded !== undefined ? undefined : captureBudgetOmission(inspection, "source_maps");
			const sourceMapIncomplete = sourceMaps.status === "partial" || sourceMaps.status === "unavailable";
			const partial = accumulator.failedScripts.length > 0 || accumulator.recoveredScripts.length > 0 || accumulator.widenedScripts.length > 0 || unavailable.length > 0 || unavailableAnalyses.length > 0 || sourceMapIncomplete || omittedScripts !== undefined || omittedSourceScripts !== undefined || omittedSourceMaps !== undefined;
			return webBundleAnalysisSchema.parse({
				route_inventory: completeSemanticSteps(buildJavaScriptRouteInventorySteps(inspection.scripts.items.map((script) => {
					const result = byKey.get(script.script_key);
					const analyzed = result?.status === "analyzed" ? result : undefined;
					return {
						key: script.script_key,
						path: null,
						url: script.url,
						container_sha256: null,
						sha256: script.source.included ? script.source.artifact.sha256 : null,
						status: analyzed === undefined || analyzed.parse_status === "failed" ? "unavailable" : analyzed.parse_status === "recovered" ? "partial" : "complete",
						reason: !script.source.included ? script.source.reason : result?.status === "unavailable" ? result.reason : analyzed === undefined ? "No route syntax result was returned" : analyzed.parse_status === "failed" ? "Script parsing failed" : analyzed.parse_status === "recovered" ? "Script parsing recovered from errors" : null,
						facts: analyzed?.route_facts ?? null
					};
				}), undefined, [...omittedScripts === undefined ? [] : [{
					unit: "script-records",
					count: omittedScripts,
					reason: captureBudgetReason("script records", omittedScripts)
				}], ...omittedSourceScripts === undefined ? [] : [{
					unit: "script-sources",
					count: omittedSourceScripts,
					reason: captureBudgetReason("script source artifacts", omittedSourceScripts)
				}]])),
				capture: buildCaptureObservation(inspection, sourceScripts, attemptedScripts),
				observations: {
					chunks: {
						nodes: sourceScripts.map(chunkNode),
						edges: accumulator.edges
					},
					routes: accumulator.routes,
					endpoints: accumulator.endpoints,
					webmcp_declarations: accumulator.webMcp,
					source_maps: sourceMaps
				},
				inferences: accumulator.inferences,
				unknowns: buildUnknowns({
					unavailable,
					unavailableSourceReasons,
					failedScripts: accumulator.failedScripts,
					recoveredScripts: accumulator.recoveredScripts,
					widenedScripts: accumulator.widenedScripts,
					unavailableAnalyses,
					sourceMaps,
					omittedScripts,
					omittedSourceScripts,
					omittedSourceMaps
				}),
				completeness: buildCompleteness({
					partial,
					parsedScripts: accumulator.parsedScripts,
					parseFailures: accumulator.failedScripts.length,
					visitedNodes: accumulator.visitedNodes
				}),
				limitations: bundleLimitations()
			});
		};
		mergeScriptResults = (results) => {
			const accumulator = createWebBundleAnalysisAccumulator();
			for (const result of results) {
				accumulator.visitedNodes += result.visited_ast_nodes;
				if (result.parse_status === "failed") {
					accumulator.failedScripts.push(result.script_key);
					continue;
				}
				accumulator.parsedScripts += 1;
				if (result.parse_status === "recovered") accumulator.recoveredScripts.push(result.script_key);
				if (result.widened_return_references) accumulator.widenedScripts.push(result.script_key);
				accumulator.edges.push(...result.observations.edges);
				accumulator.routes.push(...result.observations.routes);
				accumulator.endpoints.push(...result.observations.endpoints);
				accumulator.webMcp.push(...result.observations.webmcp_declarations);
				accumulator.inferences.push(...result.inferences);
			}
			return accumulator;
		};
		buildCaptureObservation = (inspection, sourceScripts, attemptedScripts) => {
			const targetOrigin = browserOriginSchema.safeParse(inspection.target.origin);
			return {
				target_url: inspection.target.url,
				target_origin: targetOrigin.success ? targetOrigin.data : null,
				scripts_observed: inspection.scripts.total,
				scripts_analyzed: attemptedScripts,
				source_artifacts: sourceScripts.map(sourceArtifact)
			};
		};
		sourceArtifact = (script) => {
			if (!script.source.included) throw new TypeError("Filtered source changed");
			const { text: _text, ...artifact } = script.source.artifact;
			return {
				...artifact,
				text_available: true
			};
		};
		chunkNode = (script) => {
			if (!script.source.included) throw new TypeError("Filtered source changed");
			return {
				script_key: script.script_key,
				url: script.url,
				artifact_sha256: script.source.artifact.sha256,
				bytes: script.source.artifact.bytes
			};
		};
		buildUnknowns = (input) => [
			...input.omittedScripts === undefined ? [] : [{
				dimension: "script_inventory",
				reason: captureBudgetReason("script records", input.omittedScripts),
				affected_script_keys: []
			}],
			...input.omittedSourceScripts === undefined ? [] : [{
				dimension: "script_source",
				reason: captureBudgetReason("script source artifacts", input.omittedSourceScripts),
				affected_script_keys: []
			}],
			...input.unavailable.length === 0 ? [] : [{
				dimension: "script_source",
				reason: input.unavailableSourceReasons.length === 0 ? "Source artifact was not captured" : `Source artifacts were not captured: ${input.unavailableSourceReasons.join("; ")}`,
				affected_script_keys: input.unavailable
			}],
			...input.failedScripts.length === 0 ? [] : [{
				dimension: "javascript_ast",
				reason: "One or more source artifacts could not be parsed",
				affected_script_keys: [...input.failedScripts]
			}],
			...input.unavailableAnalyses.length === 0 ? [] : groupUnavailableAnalyses(input.unavailableAnalyses).map(({ reason, detail, affectedScriptKeys }) => ({
				dimension: "javascript_analysis",
				reason: analysisUnavailableReason(reason, detail),
				affected_script_keys: affectedScriptKeys
			})),
			...input.widenedScripts.length === 0 ? [] : [{
				dimension: "javascript_ast",
				reason: RETURNED_REFERENCE_WIDENING_LIMITATION,
				affected_script_keys: [...input.widenedScripts]
			}],
			...input.recoveredScripts.length === 0 ? [] : [{
				dimension: "javascript_ast",
				reason: "The parser recovered from errors in one or more source artifacts; findings may be incomplete",
				affected_script_keys: [...input.recoveredScripts]
			}],
			...input.omittedSourceMaps === undefined ? [] : [{
				dimension: "source_maps",
				reason: captureBudgetReason("source-map declarations", input.omittedSourceMaps),
				affected_script_keys: []
			}],
			...input.sourceMaps.status === "not_requested" || input.sourceMaps.status === "included" ? [] : [{
				dimension: "source_maps",
				reason: input.sourceMaps.limitation ?? "One or more requested source maps were unavailable or incomplete",
				affected_script_keys: input.sourceMaps.items.filter(({ status }) => status !== "included").map(({ script_key }) => script_key).sort()
			}]
		];
		captureBudgetOmission = (inspection, section) => {
			const exclusions = inspection.completeness.excluded.filter((exclusion) => exclusion.section === section && exclusion.reason === "resource_budget_exhausted");
			if (exclusions.length === 0) return undefined;
			if (exclusions.some(({ count }) => count === null)) return null;
			return exclusions.reduce((sum, { count }) => sum + (count ?? 0), 0);
		};
		groupUnavailableAnalyses = (unavailable) => {
			const groups = new Map();
			for (const { reason, detail, script_key } of unavailable) {
				let byDetail = groups.get(reason);
				if (byDetail === undefined) {
					byDetail = new Map();
					groups.set(reason, byDetail);
				}
				const keys = byDetail.get(detail) ?? [];
				keys.push(script_key);
				byDetail.set(detail, keys);
			}
			return [...groups].flatMap(([reason, byDetail]) => [...byDetail].map(([detail, affectedScriptKeys]) => ({
				reason,
				detail,
				affectedScriptKeys
			})));
		};
		analysisUnavailableReason = (reason, detail) => `Analysis was unavailable for captured scripts (${reason}); findings from those scripts are unknown.${detail === undefined ? "" : ` Worker detail: ${JSON.stringify(detail)}`}`;
		captureBudgetReason = (label, count) => count === null ? `Capture omitted an unknown number of ${label} because its resource budget was exhausted.` : `Capture omitted ${String(count)} ${label} because its resource budget was exhausted.`;
		buildCompleteness = (input) => ({
			status: input.partial ? "partial" : "complete",
			parsed_scripts: input.parsedScripts,
			parse_failures: input.parseFailures,
			visited_ast_nodes: input.visitedNodes
		});
		bundleLimitations = () => [
			"Static bundle findings are observations or bounded inferences; REA does not execute captured JavaScript.",
			"Bare string arguments of unbound HTTP-method-named calls are low-confidence endpoint candidates; form, translation, storage and other APIs can use the same syntax. URL-shaped findings still do not prove network execution.",
			"Endpoint candidates are deduplicated by script, value and detector; basis retains only the first matching source coordinate. They are not a complete call-site inventory or a runtime occurrence count. completeness.status=\"complete\" describes examination of captured source, not a call-site census.",
			"String-built routes and endpoints, encrypted configuration, and server-side behavior may remain unknown.",
			"Page-declared WebMCP metadata is untrusted and is never registered or invoked as an REA tool."
		];
	})))();
}

//#endregion
//#region dist/browser/WebBundleAnalysisWorkerProtocol.js
var WEB_BUNDLE_WORKER_LIMITS, includedSourceSchema, browserScriptSchema, includedWebScriptSchema, webBundleWorkerRequestSchema, identity, webBundleWorkerMessageSchema;
function init_WebBundleAnalysisWorkerProtocol() {
	return (init_WebBundleAnalysisWorkerProtocol = __esmMin((() => {
		init_javascriptAnalysisResourceControls();
		init_digests();
		init_webRuntime();
		init_browserObservationSchemas();
		init_webContentArtifact();
		init_webBundleAnalysis();
		WEB_BUNDLE_WORKER_LIMITS = {
			heapMb: DEFAULT_WEB_BUNDLE_HEAP_MB,
			scriptTimeoutMs: DEFAULT_WEB_BUNDLE_SCRIPT_TIMEOUT_MS,
			totalTimeoutMs: DEFAULT_WEB_BUNDLE_TOTAL_TIMEOUT_MS,
			protocolBytes: 64 * 1024,
			sourceBytes: 8 * WEB_RUNTIME_LIMITS.sourceBytes,
			resultBytes: JAVASCRIPT_STATIC_FACT_BYTES
		};
		includedSourceSchema = z.strictObject({
			included: z.literal(true),
			artifact: webTextArtifactSchema.strict()
		});
		browserScriptSchema = webPageInspectionSchema.shape.scripts.shape.items.element;
		includedWebScriptSchema = browserScriptSchema.extend({ source: includedSourceSchema }).strict();
		webBundleWorkerRequestSchema = z.strictObject({
			kind: z.literal("analyze"),
			id: z.uuid(),
			source: z.strictObject({
				bytes: z.number().int().min(0).max(WEB_BUNDLE_WORKER_LIMITS.sourceBytes),
				sha256: digestSchema
			}),
			result_budget_bytes: z.number().int().min(0).max(WEB_BUNDLE_WORKER_LIMITS.resultBytes)
		});
		identity = { id: z.uuid() };
		webBundleWorkerMessageSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("ready"),
				heap_limit_bytes: z.number().int().positive().nullable()
			}),
			z.strictObject({
				kind: z.literal("phase"),
				...identity,
				phase: z.literal("analyze")
			}),
			z.strictObject({
				kind: z.literal("complete"),
				...identity,
				result: z.strictObject({
					bytes: z.number().int().nonnegative(),
					sha256: digestSchema
				})
			}),
			z.strictObject({
				kind: z.literal("failure"),
				...identity,
				reason: z.enum([
					"input",
					"resource",
					"output",
					"io"
				]),
				message: z.string()
			})
		]);
	})))();
}

//#endregion
//#region dist/browser/WebBundleAnalysisWorker.js
var OPERATION, PROVIDER, scriptTimeout, MIB, RESULT_EXPANSION, WebBundleAnalysisWorker, WebBundleWorkerCleanup, processWebBundleCleanup;
function init_WebBundleAnalysisWorker() {
	return (init_WebBundleAnalysisWorker = __esmMin((() => {
		init_analysisErrorCancellation();
		init_WorkerFrameSignal();
		init_ArtifactResourceScope();
		init_AnalysisCleanupLease();
		init_ArtifactFileOperation();
		init_readStableArtifact();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_analysisErrorCleanup();
		init_providerCleanupError();
		init_jsonSerialization();
		init_safeJson();
		init_runtimeVersion();
		init_result();
		init_webBundleScriptAnalysis();
		init_OwnedWorkerRuntime();
		init_RuntimeControlUnavailableError();
		init_ProviderProcess();
		init_ProviderDeadline();
		init_ProcessOwnershipObservation();
		init_JavaScriptWorkerMemoryLimit();
		init_webBundleAnalysis();
		init_WebBundleAnalysisWorkerProtocol();
		OPERATION = "analyze_web_bundle";
		PROVIDER = "web-bundle-static-analysis";
		scriptTimeout = (timeoutMs, cause) => new AnalysisTimeoutError(OPERATION, timeoutMs, {
			...cause === undefined ? {} : { cause },
			...webBundleScriptTimeoutRecovery(timeoutMs)
		});
		MIB = 1024 * 1024;
		RESULT_EXPANSION = 16;
		WebBundleAnalysisWorker = class {
			heapMb;
			#workerCleanup;
			#runtime;
			#files = new ArtifactResourceScope();
			#cleanup;
			#decoder = new StringDecoder("utf8");
			#pending = "";
			#frames = [];
			#protocolFailure;
			#observedFailure;
			#activeDeadline;
			#activeJob;
			#activeTerminalResponseObserved = false;
			#frameSignal = new WorkerFrameSignal();
			#retainedResultBytes = 0;
			#ready = false;
			#stdout = (chunk) => {
				if (this.#activeDeadline?.interruption !== undefined) return;
				if (this.#protocolFailure !== undefined) return;
				try {
					if (Buffer.byteLength(chunk) + Buffer.byteLength(this.#pending) > WEB_BUNDLE_WORKER_LIMITS.protocolBytes) throw new RangeError(webBundleFixedByteBudget(WEB_BUNDLE_WORKER_LIMITS.protocolBytes, "control-frame budget"));
					this.#pending += typeof chunk === "string" ? chunk : this.#decoder.write(chunk);
					for (;;) {
						const end = this.#pending.indexOf("\n");
						if (end < 0) break;
						if (this.#frames.length >= 16) throw new RangeError("Web analyzer exceeded its control-frame queue");
						this.#frames.push(webBundleWorkerMessageSchema.parse(JSON.parse(this.#pending.slice(0, end))));
						this.#observeFrame(this.#frames.at(-1));
						this.#pending = this.#pending.slice(end + 1);
					}
					this.#frameSignal.wake("frame");
				} catch (cause) {
					this.#pending = "";
					this.#protocolFailure = cause;
					this.#latchFailure({
						kind: "protocol",
						cause
					});
					this.#frameSignal.wake("failure");
				}
			};
			constructor(heapMb = DEFAULT_WEB_BUNDLE_HEAP_MB, launcher = spawnOwnedProviderProcess, workerCleanup = processWebBundleCleanup) {
				this.heapMb = heapMb;
				this.#workerCleanup = workerCleanup;
				if (!Number.isSafeInteger(heapMb) || heapMb < 128 || heapMb > 16384) throw new RangeError(`Web analyzer heap must be an integer from ${String(128)} through ${String(MAX_WEB_BUNDLE_HEAP_MB)} MiB (max_heap_mb)`);
				this.#runtime = new OwnedWorkerRuntime({
					rootPrefix: "rea-web-bundle-analysis-",
					launcher,
					cleanupRegistry: workerCleanup.runtimes,
					retryCleanup: () => this.close(),
					onInputFailure: (cause) => {
						if (this.#activeDeadline?.interruption !== undefined) return;
						this.#latchFailure({
							kind: "input",
							cause
						});
						this.#frameSignal.wake("failure");
					},
					supervisorOptions: {
						captureStdout: false,
						maxDiagnosticBytes: 256 * 1024,
						onDiagnostic: (event) => {
							if (this.#activeDeadline?.interruption !== undefined) return;
							if (event.type === "exit" && (event.code !== 0 || event.signal !== null)) {
								const stderr = event.snapshot.stderr.text;
								const memoryLimitReached = event.snapshot.memoryLimitReached === true;
								this.#latchFailure({
									kind: "exit",
									code: event.code,
									signal: event.signal,
									memoryLimitReached,
									heapExhaustion: memoryLimitReached || /heap out of memory|heap limit|allocation failed/iu.test(stderr)
								});
							} else if (event.type === "output-close") {
								if (this.#activeDeadline !== undefined && (this.#activeJob === undefined || !this.#activeTerminalResponseObserved)) this.#latchFailure({ kind: "incomplete-output" });
								this.#frameSignal.wake("failure");
							} else if (event.type === "output") {
								const failure = this.#observedFailure;
								if (failure?.kind !== "exit") return;
								const memoryLimitReached = this.#runtime.supervisor?.snapshot().memoryLimitReached === true;
								const heapMarker = event.stream === "stderr" && /heap out of memory|heap limit|allocation failed/iu.test(this.#runtime.supervisor?.snapshot().stderr.text ?? "");
								if (!memoryLimitReached && !heapMarker) return;
								this.#observedFailure = {
									...failure,
									heapExhaustion: true,
									memoryLimitReached: failure.memoryLimitReached || memoryLimitReached
								};
							}
						}
					}
				});
				const owner = this;
				this.#cleanup = new AnalysisCleanupLease(() => this.#release(), { get cleanupResources() {
					return [...owner.#files.cleanupResources, ...owner.#runtime.cleanupResources ?? []];
				} });
			}
			static async retryPending() {
				await processWebBundleCleanup.retry();
			}
			async analyze(script, timeoutMs, signal) {
				let deadline;
				const id = randomUUID();
				this.#observedFailure = undefined;
				this.#activeJob = undefined;
				this.#activeTerminalResponseObserved = false;
				let result;
				let completed = null;
				let continuation;
				let resultDescriptor;
				const failed = (error) => err({
					error: signal?.aborted ? analysisErrorWithCancellation(error, new AnalysisCancelledError(OPERATION, { cause: signal.reason })) : error,
					completed,
					...continuation === undefined ? {} : { continuation }
				});
				try {
					if (signal?.aborted) throw new AnalysisCancelledError(OPERATION, { cause: signal.reason });
					const admitted = this.#admittedResultBudget();
					if (!admitted.ok) {
						continuation = "result_capacity_exhausted";
						throw admitted.error;
					}
					const resultBudget = admitted.bytes;
					await prepareProcessOwnershipInspection(signal);
					deadline = new ProviderStartupDeadline(timeoutMs, signal);
					this.#activeDeadline = deadline;
					await this.#start(deadline);
					if (this.#frames.length > 0 || this.#pending !== "") throw new AnalysisOutputError(OPERATION, "Web analyzer emitted unsolicited control data");
					const root = this.#runtime.rootPath;
					const supervisor = this.#runtime.supervisor;
					if (root === undefined || supervisor === undefined) throw new TypeError("Web analyzer resources were not acquired");
					supervisor.resetOutput();
					const source = await this.#files.run(() => this.#writeSource(join(root, `${id}.source`), script, deadline.signal));
					const request = webBundleWorkerRequestSchema.parse({
						kind: "analyze",
						id,
						source,
						result_budget_bytes: resultBudget
					});
					const frame = `${JSON.stringify(request)}\n`;
					const stdin = supervisor.launch.process.stdin;
					if (stdin === null || stdin === undefined) throw new TypeError("Web analyzer request stream is unavailable");
					this.#activeJob = {
						id,
						resultBudgetBytes: resultBudget
					};
					this.#activeTerminalResponseObserved = false;
					await new Promise((resolve, reject) => stdin.write(frame, (error) => error == null ? resolve() : reject(error)));
					let response;
					do {
						response = await this.#next(deadline);
						if (response.kind === "ready" || response.id !== id) throw new AnalysisOutputError(OPERATION, "Web analyzer response names another request");
					} while (response.kind === "phase");
					if (response.kind === "failure") {
						if (response.reason === "resource") throw new AnalysisResourceConstraintError(OPERATION, "memory", response.message, { result_budget_bytes: resultBudget });
						throw new AnalysisOutputError(OPERATION, `Web script analysis failed (${response.reason}): ${response.message}`);
					}
					if (response.kind !== "complete") throw new AnalysisOutputError(OPERATION, "Web analyzer did not complete a result");
					const descriptor = response.result;
					resultDescriptor = descriptor;
					if (descriptor.bytes > resultBudget || descriptor.bytes * RESULT_EXPANSION + 64 * MIB > getHeapStatistics().heap_size_limit - process.memoryUsage().heapUsed) throw new AnalysisResourceConstraintError(OPERATION, "memory", "Completed script facts exceed the host's remaining reserved result capacity", { result_budget_bytes: resultBudget });
					const stored = await this.#files.run(() => readStableArtifact(join(root, `${id}.result`), descriptor.bytes, deadline.signal, undefined, this.#files));
					const facts = this.#validateCompletedResult(stored, descriptor, script);
					this.#retainedResultBytes += descriptor.bytes;
					completed = facts;
					result = ok(facts);
				} catch (cause) {
					const completion = artifactFileCompletion(cause);
					const snapshot = completedStableArtifact(cause);
					if (snapshot !== undefined && resultDescriptor !== undefined) {
						try {
							completed = this.#validateCompletedResult(snapshot, resultDescriptor, script);
							this.#retainedResultBytes += resultDescriptor.bytes;
						} catch {}
					}
					const cancellationCause = completion?.cancellation;
					const interrupted = deadline?.interruption === "timeout" ? scriptTimeout(timeoutMs, cause) : cancellationCause !== undefined ? new AnalysisCancelledError(OPERATION, { cause: cancellationCause.reason }) : deadline?.interruption === "cancelled" || signal?.aborted ? new AnalysisCancelledError(OPERATION, { cause: signal?.aborted ? signal.reason : deadline?.signal.reason }) : undefined;
					const observedFailure = this.#observedFailure === undefined ? undefined : this.#projectObservedFailure();
					if (observedFailure !== undefined && interrupted !== undefined) observedFailure.retainSecondaryFailure(interrupted);
					const failure = cause instanceof ArtifactFileCleanupFailure && completion !== undefined ? this.#cleanupFailure(cause, interrupted) : interrupted !== undefined && observedFailure !== undefined ? observedFailure : interrupted ?? (cause instanceof RuntimeControlUnavailableError ? runtimeControlCapabilityError(PROVIDER, OPERATION, cause) : cause instanceof AnalysisError ? cause : new AnalysisOutputError(OPERATION, "Owned web-script analysis failed", { cause }));
					result = err(failure);
					try {
						const stopped = await this.#runtime.stop();
						if (stopped.status === "incomplete") throw new Error(stopped.reason);
						this.#reset();
					} catch (cleanupCause) {
						result = err(this.#cleanupFailure(cleanupCause, failure));
					}
				} finally {
					this.#activeDeadline = undefined;
					deadline?.dispose();
					this.#activeJob = undefined;
					this.#activeTerminalResponseObserved = false;
				}
				if (!result.ok && result.error.cleanupIncomplete) return failed(result.error);
				if (this.#files.hasPending) return failed(this.#cleanupFailure(new Error("Web analyzer artifact cleanup is incomplete"), result.ok ? undefined : result.error));
				try {
					const root = this.#runtime.rootPath;
					if (root !== undefined) {
						await rm(join(root, `${id}.source`), { force: true });
						await rm(join(root, `${id}.result`), { force: true });
					}
				} catch (cause) {
					const previous = result.ok ? undefined : result.error;
					const primary = signal?.aborted ? analysisErrorWithCancellation(previous, new AnalysisCancelledError(OPERATION, { cause: signal.reason })) : previous;
					return failed(this.#cleanupFailure(cause, primary));
				}
				if (signal?.aborted) return failed(result.ok ? new AnalysisCancelledError(OPERATION, { cause: signal.reason }) : result.error);
				return result.ok ? result : failed(result.error);
			}
			#admittedResultBudget() {
				const fixedRemaining = WEB_BUNDLE_WORKER_LIMITS.resultBytes - this.#retainedResultBytes;
				const hostCapacity = Math.max(0, Math.floor((getHeapStatistics().heap_size_limit - process.memoryUsage().heapUsed - 64 * MIB) / RESULT_EXPANSION));
				const bytes = Math.min(fixedRemaining, hostCapacity);
				if (bytes > 0) return {
					ok: true,
					bytes
				};
				const failure = webBundleResultAdmissionFailure({
					fixedBudgetBytes: WEB_BUNDLE_WORKER_LIMITS.resultBytes,
					fixedRemainingBytes: fixedRemaining,
					hostCapacityBytes: hostCapacity
				});
				return {
					ok: false,
					error: new AnalysisResourceConstraintError(OPERATION, "memory", failure.reason, failure.reportedLimits, failure.kind === "host-capacity" ? { remediationAction: failure.remediationAction } : undefined)
				};
			}
			async #writeSource(path, script, signal) {
				const digest = createHash("sha256");
				let bytes = 0;
				const file = await open(path, "wx", 384);
				await withArtifactFileHandle(path, file, this.#files, signal, async (handle) => {
					for (const part of bufferedJsonParts(jsonParts(script))) {
						signal.throwIfAborted();
						const chunk = Buffer.from(part, "utf8");
						if (chunk.length > WEB_BUNDLE_WORKER_LIMITS.sourceBytes - bytes) throw new AnalysisResourceConstraintError(OPERATION, "transport", webBundleFixedByteBudget(WEB_BUNDLE_WORKER_LIMITS.sourceBytes, "worker transfer budget"), { source_bytes: WEB_BUNDLE_WORKER_LIMITS.sourceBytes });
						await handle.writeFile(chunk);
						bytes += chunk.length;
						digest.update(chunk);
					}
				});
				return {
					bytes,
					sha256: digest.digest("hex")
				};
			}
			async #start(deadline) {
				if (this.#ready && this.#runtime.supervisor !== undefined) return;
				const environment = {
					...process.env,
					UV_THREADPOOL_SIZE: "1"
				};
				delete environment.NODE_OPTIONS;
				const memoryLimitBytes = javaScriptWorkerMemoryLimitBytes(this.heapMb);
				await this.#runtime.start({
					command: process.execPath,
					arguments: [
						`--max-old-space-size=${String(this.heapMb)}`,
						"--max-semi-space-size=8",
						"--v8-pool-size=1",
						"--expose-gc",
						"--stack_size=2048",
						fileURLToPath(import.meta.resolve("#web-bundle-analysis-worker"))
					],
					runId: `rea-web-bundle-analysis-${randomUUID()}`,
					hostEnvironment: environment,
					stdin: "pipe",
					signal: deadline.signal,
					...memoryLimitBytes === null ? {} : { memoryLimitBytes }
				}, async () => {
					this.#runtime.onStdout(this.#stdout);
					const ready = await this.#next(deadline);
					if (ready.kind !== "ready" || ready.heap_limit_bytes === null === (javaScriptRuntime(process.versions).id === "node")) throw new AnalysisOutputError(OPERATION, "Web analyzer ready frame has an incompatible runtime heap limit");
					this.#ready = true;
				});
			}
			async #next(deadline) {
				for (;;) {
					if (deadline.interruption === "timeout") throw scriptTimeout(deadline.timeoutMs);
					if (deadline.interruption === "cancelled") throw new AnalysisCancelledError(OPERATION, { cause: deadline.signal.reason });
					deadline.signal.throwIfAborted();
					const frame = this.#frames.shift();
					if (frame !== undefined) return frame;
					if (this.#runtime.inputFailure !== undefined) this.#latchFailure({
						kind: "input",
						cause: this.#runtime.inputFailure
					});
					if (this.#protocolFailure !== undefined) this.#latchFailure({
						kind: "protocol",
						cause: this.#protocolFailure
					});
					if (this.#observedFailure !== undefined && this.#observedFailure.kind !== "exit") throw this.#projectObservedFailure();
					const supervisor = this.#runtime.supervisor;
					const snapshot = supervisor?.snapshot();
					if (snapshot !== undefined && (snapshot.exitCode !== undefined || snapshot.signal !== undefined)) {
						if (supervisor === undefined) continue;
						const outcome = await this.#waitForFrameOrOutputClose(supervisor, deadline);
						if (outcome === "interrupted") {
							const completedFrame = this.#frames.shift();
							if (completedFrame !== undefined) return completedFrame;
							throw deadline.interruption === "timeout" ? scriptTimeout(deadline.timeoutMs) : new AnalysisCancelledError(OPERATION, { cause: deadline.signal.reason });
						}
						const completedFrame = this.#frames.shift();
						if (completedFrame !== undefined) return completedFrame;
						if (outcome === "failure") throw this.#projectObservedFailure();
						if (outcome === "frame") continue;
						if (this.#observedFailure !== undefined) throw this.#projectObservedFailure();
						throw new AnalysisOutputError(OPERATION, "Owned web analyzer exited before completing this script", { capturedOutput: this.#capturedOutput() });
					}
					await deadline.wait(10);
				}
			}
			#latchFailure(failure) {
				if (this.#observedFailure === undefined && this.#activeDeadline?.interruption === undefined) this.#observedFailure = failure;
			}
			#observeFrame(frame) {
				if (this.#activeDeadline?.interruption !== undefined || this.#activeJob === undefined || frame.kind === "ready" || frame.id !== this.#activeJob.id) return;
				if (frame.kind === "complete" || frame.kind === "failure") this.#activeTerminalResponseObserved = true;
				if (frame.kind !== "failure") return;
				this.#latchFailure({
					kind: "frame",
					frame,
					resultBudgetBytes: this.#activeJob.resultBudgetBytes
				});
			}
			#projectObservedFailure() {
				const failure = this.#observedFailure;
				if (failure === undefined) return new AnalysisOutputError(OPERATION, "Owned web analyzer exited before completing this script", { capturedOutput: this.#capturedOutput() });
				const capturedOutput = this.#capturedOutput();
				switch (failure.kind) {
					case "input": return new AnalysisOutputError(OPERATION, "Web analyzer request stream failed", {
						cause: failure.cause,
						capturedOutput
					});
					case "protocol": return new AnalysisOutputError(OPERATION, "Invalid web analyzer control frame", {
						cause: failure.cause,
						capturedOutput
					});
					case "incomplete-output": return new AnalysisOutputError(OPERATION, "Owned web analyzer output closed before completing this script", { capturedOutput });
					case "frame": return failure.frame.reason === "resource" ? new AnalysisResourceConstraintError(OPERATION, "memory", failure.frame.message, { result_budget_bytes: failure.resultBudgetBytes }, { capturedOutput }) : new AnalysisOutputError(OPERATION, `Web script analysis failed (${failure.frame.reason}): ${failure.frame.message}`, { capturedOutput });
					case "exit":
						if (failure.heapExhaustion) {
							const exhaustion = webBundleMemoryExhaustion({
								runtime: javaScriptRuntime(process.versions).id,
								heapMb: this.heapMb,
								memoryLimitReached: failure.memoryLimitReached,
								processMemoryLimitBytes: javaScriptWorkerMemoryLimitBytes(this.heapMb)
							});
							return new AnalysisResourceConstraintError(OPERATION, "memory", webBundleHeapExhaustedReason(exhaustion), {
								worker_heap_limit_mb: this.heapMb,
								max_heap_mb: this.heapMb,
								worker_process_memory_limit_bytes: javaScriptWorkerMemoryLimitBytes(this.heapMb)
							}, {
								capturedOutput,
								remediationAction: webBundleHeapExhaustedRemediation(exhaustion)
							});
						}
						return new AnalysisOutputError(OPERATION, "Owned web analyzer exited before completing this script", { capturedOutput });
				}
			}
			#capturedOutput() {
				const supervisor = this.#runtime.supervisor;
				const snapshot = supervisor?.snapshot();
				return {
					stdout: "",
					stderr: snapshot?.stderr.text ?? "",
					truncated: snapshot?.diagnosticTruncated === true || snapshot?.outputIncomplete === true || supervisor !== undefined && !supervisor.observedOutputClose(),
					exit_code: snapshot?.exitCode ?? null,
					signal: snapshot?.signal ?? null
				};
			}
			async #waitForFrameOrOutputClose(supervisor, deadline) {
				if (this.#frames.length > 0) return "frame";
				return this.#frameSignal.waitForOutputClose(supervisor, deadline.signal);
			}
			#validateCompletedResult(stored, descriptor, script) {
				if (stored.bytes.length !== descriptor.bytes || stored.sha256 !== descriptor.sha256) throw new AnalysisOutputError(OPERATION, "Web analyzer result differs from its descriptor");
				const parsed = safeParseUtf8Json(stored.bytes);
				if (!parsed.ok) throw parsed.cause;
				const facts = webBundleScriptAnalysisSchema.parse(parsed.value);
				if (facts.status !== "analyzed" || facts.script_key !== script.script_key) throw new AnalysisOutputError(OPERATION, "Web analyzer facts name another script");
				return facts;
			}
			#reset() {
				this.#ready = false;
				this.#frames = [];
				this.#pending = "";
				this.#decoder = new StringDecoder("utf8");
				this.#protocolFailure = undefined;
				this.#observedFailure = undefined;
				this.#activeDeadline = undefined;
				this.#activeJob = undefined;
				this.#activeTerminalResponseObserved = false;
				this.#frameSignal.wake("failure");
			}
			#cleanupFailure(cause, primary) {
				this.#workerCleanup.retain(this);
				this.#runtime.retainForCleanup();
				const cleanup = new ProviderCleanupError(PROVIDER, this.#cleanup.cleanupResources ?? [], { reason: "Owned web analyzer cleanup remains incomplete" }, {
					operation: OPERATION,
					cause
				});
				new AnalysisCleanupLeaseGroup(cleanup, [this.#cleanup]);
				return primary === undefined ? cleanup : analysisErrorWithCleanupFailure(primary, cleanup, OPERATION).bindCleanupDependencies([primary, cleanup]);
			}
			async close() {
				try {
					await this.#cleanup.release();
				} catch (cause) {
					throw this.#cleanupFailure(cause);
				}
			}
			async #release() {
				try {
					const stopped = await this.#runtime.stop();
					if (stopped.status === "incomplete") throw new Error(stopped.reason);
					await this.#files.close();
					await this.#runtime.close();
					this.#reset();
					this.#workerCleanup.release(this);
				} catch (cause) {
					this.#workerCleanup.retain(this);
					this.#runtime.retainForCleanup();
					throw cause;
				}
			}
		};
		WebBundleWorkerCleanup = class {
			#workers = new Set();
			runtimes;
			constructor(runtimes) {
				this.runtimes = runtimes ?? new WorkerCleanupRegistry();
			}
			retain(worker) {
				this.#workers.add(worker);
			}
			release(worker) {
				this.#workers.delete(worker);
			}
			async retry() {
				for (const worker of [...this.#workers]) await worker.close();
				await this.runtimes.retry();
			}
		};
		processWebBundleCleanup = new WebBundleWorkerCleanup(processWorkerCleanup);
	})))();
}

//#endregion
//#region dist/browser/IsolatedWebBundleAnalyzer.js
var IsolatedWebBundleAnalyzer_exports = /* @__PURE__ */ __exportAll({ WebBundleAnalysisAdmission: () => WebBundleAnalysisAdmission });
var WebBundleAnalysisAdmission, IsolatedWebBundleAnalyzer;
function init_IsolatedWebBundleAnalyzer() {
	return (init_IsolatedWebBundleAnalyzer = __esmMin((() => {
		init_webBundleAnalysis();
		init_webBundleAnalyzerResult();
		init_webBundleAnalyzerState();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_analysisErrorCleanup();
		init_providerCleanupError();
		init_result();
		init_ProviderDeadline();
		init_WebBundleAnalysisWorker();
		WebBundleAnalysisAdmission = class {
			workers = new WebBundleWorkerCleanup();
			#active;
			#pendingCleanup = new Set();
			active() {
				return this.#active;
			}
			hold(analyzer) {
				this.#active = analyzer;
			}
			release(analyzer) {
				if (this.#active === analyzer) this.#active = undefined;
			}
			pending() {
				return [...this.#pendingCleanup];
			}
			retain(analyzer) {
				this.#pendingCleanup.add(analyzer);
			}
			forget(analyzer) {
				this.#pendingCleanup.delete(analyzer);
			}
		};
		IsolatedWebBundleAnalyzer = class {
			#admission;
			#closed = false;
			#running;
			#controller;
			#worker;
			createWorker;
			constructor(createWorker, admission = new WebBundleAnalysisAdmission()) {
				this.#admission = admission;
				this.createWorker = createWorker ?? ((heapMb) => new WebBundleAnalysisWorker(heapMb, undefined, admission.workers));
			}
			/** Reserve capacity before capture, so concurrent captures cannot retain source inventories. */
			async reserve() {
				if (this.#closed) return err(new AnalysisCancelledError("analyze_web_bundle"));
				if (this.#admission.active() !== undefined) return err(new AnalysisResourceConstraintError("analyze_web_bundle", "capacity", "Another web-bundle capture or analysis owns this admission's source and result reservation", { concurrent_web_bundle_analyses: 1 }));
				this.#admission.hold(this);
				try {
					for (const owner of this.#admission.pending()) await owner.#releaseWorker();
					await this.#admission.workers.retry();
					await this.#releaseWorker();
				} catch (cause) {
					this.#admission.release(this);
					return err(cause instanceof AnalysisError ? cause : new ProviderCleanupError("web-bundle-static-analysis", [], { reason: "Earlier web analyzer cleanup remains incomplete" }, {
						operation: "analyze_web_bundle",
						cause
					}));
				}
				if (this.#closed) {
					this.#admission.release(this);
					return err(new AnalysisCancelledError("analyze_web_bundle"));
				}
				return ok(undefined);
			}
			releaseReservation() {
				this.#admission.release(this);
			}
			analyze(inspection, sourceMaps, input, signal) {
				if (this.#closed) return Promise.resolve(err(new AnalysisCancelledError("analyze_web_bundle", { partialObservation: inspection })));
				if (this.#running !== undefined) return Promise.resolve(err(new AnalysisResourceConstraintError("analyze_web_bundle", "capacity", "This web analyzer already owns an active analysis", { concurrent_web_bundle_analyses: 1 })));
				this.#controller = new AbortController();
				const running = this.#analyze(inspection, sourceMaps, input, signal).finally(() => {
					this.#running = undefined;
					this.#controller = undefined;
				});
				this.#running = running;
				return running;
			}
			async #analyze(inspection, sourceMaps, input, signal) {
				const scripts = inspection.scripts.items.filter(isIncludedScript);
				const results = [];
				const signals = [this.#controller.signal, ...signal === undefined ? [] : [signal]];
				const caller = AbortSignal.any(signals);
				const deadline = new ProviderStartupDeadline(input.total_analysis_timeout_ms ?? 3e5, caller);
				let failure;
				let resultCapacityExhausted = false;
				const appendUnstarted = () => {
					for (const script of scripts.slice(results.length)) results.push({
						status: "unavailable",
						script_key: script.script_key,
						reason: "not_started",
						detail: caller.aborted ? "The operation was cancelled before this script was started." : deadline.interruption === "timeout" ? `The total_analysis_timeout_ms deadline of ${String(input.total_analysis_timeout_ms ?? 3e5)} ms expired before this script was started (deadlineExpired). This is not the per-script analysis_timeout_ms. A per-script timeout above the total is rejected.` : resultCapacityExhausted ? "The host could not reserve more web-analysis result capacity; this script was not started." : "An earlier analyzer failure prevented this script from starting."
					});
				};
				try {
					await WebBundleAnalysisWorker.retryPending();
					this.#worker = this.createWorker(input.max_heap_mb ?? 1024);
					for (const script of scripts) {
						if (deadline.signal.aborted) break;
						const analyzed = await this.#worker.analyze(script, input.analysis_timeout_ms ?? 3e4, deadline.signal);
						if (analyzed.ok) results.push(analyzed.value);
						else {
							const error = analyzed.error.error;
							results.push(analyzed.error.completed ?? {
								status: "unavailable",
								script_key: script.script_key,
								reason: caller.aborted ? "cancelled" : deadline.interruption === "timeout" || error instanceof AnalysisTimeoutError ? "deadline" : error instanceof AnalysisResourceConstraintError ? "resource_constraint" : "worker_failure",
								detail: error instanceof AnalysisResourceConstraintError && error.reportedLimits !== null ? `${error.userMessage ?? error.reason} Reported limits: ${JSON.stringify(error.reportedLimits)}` : error.userMessage ?? error.message
							});
							if (error.cleanupIncomplete) {
								failure = error;
								break;
							}
							if (analyzed.error.continuation === "result_capacity_exhausted") {
								resultCapacityExhausted = true;
								failure = error;
								break;
							}
							if (error instanceof AnalysisCapabilityUnavailableError) {
								failure = error;
								break;
							}
							if (caller.aborted || deadline.signal.aborted) break;
						}
					}
				} catch (cause) {
					failure = cause instanceof AnalysisError ? cause : new AnalysisOutputError("analyze_web_bundle", "Web analyzer could not complete its owned work", { cause });
				}
				appendUnstarted();
				let partial;
				try {
					partial = buildCapturedWebBundleAnalysis(inspection, sourceMaps, results);
				} catch (cause) {
					failure = new AnalysisOutputError("analyze_web_bundle", "Completed web script facts could not be assembled", { cause });
				}
				const hasPrimaryFailure = failure !== undefined && (!failure.cleanupIncomplete || failure.cleanupPrimary !== undefined);
				try {
					await this.#releaseWorker();
				} catch (cause) {
					const cleanup = cause instanceof AnalysisError ? cause : new ProviderCleanupError("web-bundle-static-analysis", [], { reason: "Web analyzer final cleanup remains incomplete" }, {
						operation: "analyze_web_bundle",
						cause
					});
					failure = failure === undefined ? cleanup : analysisErrorWithCleanupFailure(failure, cleanup, "analyze_web_bundle").bindCleanupDependencies([failure, cleanup]);
				} finally {
					deadline.dispose();
				}
				if (!hasPrimaryFailure && caller.aborted && deadline.interruption !== "timeout") {
					const cancelled = new AnalysisCancelledError("analyze_web_bundle", {
						cause: caller.reason,
						partialObservation: partial ?? inspection
					});
					failure = failure?.cleanupIncomplete === true ? analysisErrorWithCleanupFailure(cancelled, failure, "analyze_web_bundle").bindCleanupDependencies([cancelled, failure]) : cancelled;
				} else if (!hasPrimaryFailure && deadline.interruption === "timeout") {
					const totalTimeoutMs = input.total_analysis_timeout_ms ?? 3e5;
					const timeout = new AnalysisTimeoutError("analyze_web_bundle", totalTimeoutMs, {
						cause: deadline.signal.reason,
						partialObservation: partial ?? inspection,
						...webBundleTotalTimeoutRecovery(totalTimeoutMs)
					});
					failure = failure?.cleanupIncomplete === true ? analysisErrorWithCleanupFailure(timeout, failure, "analyze_web_bundle").bindCleanupDependencies([timeout, failure]) : timeout;
				}
				if (failure !== undefined) {
					failure.retainPartialObservation(partial ?? inspection);
					return err(failure);
				}
				if (partial === undefined) return err(new AnalysisOutputError("analyze_web_bundle", "Web analysis produced no result"));
				return ok(partial);
			}
			async close() {
				this.#closed = true;
				this.#controller?.abort(new Error("Browser provider closed during bundle analysis"));
				await this.#running;
				await this.#releaseWorker();
			}
			async #releaseWorker() {
				try {
					await this.#worker?.close();
					this.#worker = undefined;
					this.#admission.forget(this);
				} catch (cause) {
					this.#admission.retain(this);
					throw cause;
				}
			}
		};
	})))();
}

//#endregion
export { IsolatedWebBundleAnalyzer_exports as n, init_IsolatedWebBundleAnalyzer as r, IsolatedWebBundleAnalyzer as t };