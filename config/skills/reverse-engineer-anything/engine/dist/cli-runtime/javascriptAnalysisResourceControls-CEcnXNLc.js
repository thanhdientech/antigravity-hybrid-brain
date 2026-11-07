import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { z } from "zod";

//#region dist/domain/artifactIntegrity.js
var sha256, md5, crc32, artifactIntegrityClaimSchema, artifactSha256PairSchema, artifactMd5PairSchema, artifactDfuCrc32PairSchema, artifactIntegrityPair, artifactIntegrityPairOf, artifactIntegrityDetails, artifactContainerIntegrityDetails, projectedDigests, projectArtifactIntegrityDetails;
function init_artifactIntegrity() {
	return (init_artifactIntegrity = __esmMin((() => {
		sha256 = z.string().regex(/^[a-f0-9]{64}$/u);
		md5 = z.string().regex(/^[a-f0-9]{32}$/u);
		crc32 = z.string().regex(/^[a-f0-9]{8}$/u);
		artifactIntegrityClaimSchema = z.discriminatedUnion("algorithm", [z.strictObject({
			algorithm: z.literal("sha256"),
			digest: sha256
		}), z.strictObject({
			algorithm: z.literal("md5"),
			digest: md5
		})]);
		artifactSha256PairSchema = z.object({
			declared_sha256: sha256,
			observed_sha256: sha256
		});
		artifactMd5PairSchema = z.object({
			algorithm: z.literal("md5"),
			declared_md5: md5,
			observed_md5: md5
		});
		artifactDfuCrc32PairSchema = z.object({
			algorithm: z.literal("dfu-crc32"),
			declared_crc32: crc32,
			observed_crc32: crc32
		});
		artifactIntegrityPair = (claim, observed) => claim.algorithm === "sha256" ? {
			declared_sha256: claim.digest,
			observed_sha256: observed
		} : {
			algorithm: "md5",
			declared_md5: claim.digest,
			observed_md5: observed
		};
		artifactIntegrityPairOf = (pair) => {
			if ("declared_sha256" in pair) return {
				declared_sha256: pair.declared_sha256,
				observed_sha256: pair.observed_sha256
			};
			return pair.algorithm === "md5" ? {
				algorithm: pair.algorithm,
				declared_md5: pair.declared_md5,
				observed_md5: pair.observed_md5
			} : {
				algorithm: pair.algorithm,
				declared_crc32: pair.declared_crc32,
				observed_crc32: pair.observed_crc32
			};
		};
		artifactIntegrityDetails = (logicalPath, claim, observed, unpacked) => ({
			logicalPath,
			unpacked,
			...claim?.algorithm === "md5" ? {
				algorithm: "md5",
				declaredMd5: claim.digest,
				calculatedMd5: observed
			} : {
				declaredSha256: claim?.digest ?? null,
				calculatedSha256: observed
			}
		});
		artifactContainerIntegrityDetails = (logicalPath, pair) => ({
			logicalPath,
			unpacked: false,
			algorithm: pair.algorithm,
			declaredCrc32: pair.declared_crc32,
			calculatedCrc32: pair.observed_crc32
		});
		projectedDigests = (details) => {
			if ("declaredSha256" in details) return {
				declared_sha256: details.declaredSha256,
				calculated_sha256: details.calculatedSha256
			};
			return details.algorithm === "md5" ? {
				algorithm: details.algorithm,
				declared_md5: details.declaredMd5,
				calculated_md5: details.calculatedMd5
			} : {
				algorithm: details.algorithm,
				declared_crc32: details.declaredCrc32,
				calculated_crc32: details.calculatedCrc32
			};
		};
		projectArtifactIntegrityDetails = (details) => ({
			logical_path: details.logicalPath,
			...projectedDigests(details),
			unpacked: details.unpacked
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptAnalysisResourceControls.js
var JAVASCRIPT_STATIC_FACT_BYTES, JAVASCRIPT_ANALYSIS_TRANSFER_RECORD_BYTES, JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS, JAVASCRIPT_WORKER_HEAP_MIB_MINIMUM, JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM, JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM, HEAP_DOES_NOT_RAISE, javaScriptWorkerHeapRemediation, JAVASCRIPT_PARENT_HEAP_NODE_OPTIONS, JAVASCRIPT_PARENT_RESULT_BUDGET_REMEDIATION, JAVASCRIPT_PARENT_CHECKPOINT_HEAP_REMEDIATION, javaScriptWorkerHeapExhaustionRecovery, semanticControl, semanticAdjustment, javaScriptSemanticCeilingCoverage, javaScriptAnalysisCoverageLimits, javaScriptAnalysisResourceControlsSchema;
function init_javascriptAnalysisResourceControls() {
	return (init_javascriptAnalysisResourceControls = __esmMin((() => {
		JAVASCRIPT_STATIC_FACT_BYTES = 8 * 1024 * 1024;
		JAVASCRIPT_ANALYSIS_TRANSFER_RECORD_BYTES = 8 * 1024 * 1024;
		JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS = {
			heapMb: 1024,
			timeoutMs: 3e5,
			semanticNodes: 1e5,
			semanticNodesPerFile: 2e4,
			semanticUnknowns: 1e5,
			semanticUnknownsPerFile: 2e4
		};
		JAVASCRIPT_WORKER_HEAP_MIB_MINIMUM = 128;
		JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM = 16384;
		JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM = 1e6;
		HEAP_DOES_NOT_RAISE = "Raising max_heap_mb does not raise the parent result budget, transfer record or transfer file byte ceilings, the CLI/MCP process heap, or fixed parser limits.";
		javaScriptWorkerHeapRemediation = (heapMb) => {
			const bounds = `an integer from ${String(128)} to ${String(JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM)} (default ${String(JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.heapMb)} MiB)`;
			const adjustment = heapMb >= 16384 ? `max_heap_mb is already ${String(heapMb)} MiB, the maximum ${String(JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM)}. Do not increase it further.` : `Increase max_heap_mb (CLI: rea analyze-javascript-application <input_path> --max-heap-mb <mebibytes>), ${bounds}.`;
			return `${adjustment} The effective worker heap for this analysis is ${String(heapMb)} MiB. A changed max_heap_mb applies on the next analysis, which starts a new worker. It does not change a worker that is already running, and it does not require restarting the REA server. ${HEAP_DOES_NOT_RAISE} On Bun, V8 heap flags are ignored: Windows limits the analyzer's committed memory to max_heap_mb plus a 512 MiB reserve, and other Bun hosts enforce no analyzer heap limit.`;
		};
		JAVASCRIPT_PARENT_HEAP_NODE_OPTIONS = "On Node, set NODE_OPTIONS (for example --max-old-space-size=<MiB>) in the environment that starts the CLI or MCP server, then restart that process,";
		JAVASCRIPT_PARENT_RESULT_BUDGET_REMEDIATION = `This limit belongs to the parent result budget. That budget follows the parent V8 heap limit. Increasing max_heap_mb does not raise it. ${JAVASCRIPT_PARENT_HEAP_NODE_OPTIONS} to raise the parent heap and this budget. Use the retained static facts or analyze fewer source files.`;
		JAVASCRIPT_PARENT_CHECKPOINT_HEAP_REMEDIATION = `This limit belongs to the parent process heap. Increasing max_heap_mb does not raise it. max_heap_mb changes only the isolated analyzer, on the next analysis, by starting a new worker. ${JAVASCRIPT_PARENT_HEAP_NODE_OPTIONS} to raise the parent heap and admit this checkpoint.`;
		javaScriptWorkerHeapExhaustionRecovery = (input) => {
			if (input.heapFlagsEnforced) return {
				reason: `Owned JavaScript worker exhausted its ${String(input.heapMb)} MiB V8 old-space heap (max_heap_mb) while analyzing ${input.path} during ${input.phase}`,
				remediationAction: javaScriptWorkerHeapRemediation(input.heapMb)
			};
			return {
				reason: `Owned JavaScript worker ran out of memory while analyzing ${input.path} during ${input.phase}. Bun ignores the V8 old-space flag, so this exit is not the configured max_heap_mb limit of ${String(input.heapMb)} MiB.`,
				remediationAction: "Bun ignores V8 heap flags, so raising max_heap_mb does not change this exit. Windows limits the analyzer's committed memory to max_heap_mb plus a 512 MiB reserve and reports that separately as a process memory limit. Other Bun hosts enforce no analyzer heap limit. Reduce the analysis instead of increasing max_heap_mb."
			};
		};
		semanticControl = {
			nodes: {
				total: "max_semantic_nodes",
				perFile: "max_semantic_nodes_per_file",
				ceiling: "semantic_graph_node_ceiling",
				fileCeiling: "semantic_graph_file_node_ceiling",
				totalDefault: JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.semanticNodes,
				perFileDefault: JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.semanticNodesPerFile,
				cliTotal: "--max-semantic-nodes",
				cliPerFile: "--max-semantic-nodes-per-file",
				doesNotRaise: "max_semantic_unknowns, max_heap_mb, transfer ceilings, or the parent result budget"
			},
			unknowns: {
				total: "max_semantic_unknowns",
				perFile: "max_semantic_unknowns_per_file",
				ceiling: "semantic_graph_unknown_ceiling",
				fileCeiling: "semantic_graph_file_unknown_ceiling",
				totalDefault: JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.semanticUnknowns,
				perFileDefault: JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.semanticUnknownsPerFile,
				cliTotal: "--max-semantic-unknowns",
				cliPerFile: "--max-semantic-unknowns-per-file",
				doesNotRaise: "max_semantic_nodes, max_heap_mb, transfer ceilings, or the parent result budget"
			}
		};
		semanticAdjustment = (name, value, fallback) => value >= 1e6 ? `${name} is already ${String(value)}, the maximum ${String(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM)}. Do not increase it further.` : `${name} is ${String(value)} (default ${String(fallback)}; an integer from 1 to ${String(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM)})`;
		javaScriptSemanticCeilingCoverage = (kind, total, perFile, reached) => {
			const control = semanticControl[kind];
			const limits = [
				{
					name: control.ceiling,
					value: total,
					unit: "items"
				},
				{
					name: control.fileCeiling,
					value: perFile,
					unit: "items"
				},
				{
					name: control.total,
					value: total,
					unit: "items"
				},
				{
					name: control.perFile,
					value: perFile,
					unit: "items"
				}
			];
			const reachedControls = [...reached.total ? [{
				name: control.total,
				value: total,
				fallback: control.totalDefault,
				cli: control.cliTotal
			}] : [], ...reached.perFile ? [{
				name: control.perFile,
				value: perFile,
				fallback: control.perFileDefault,
				cli: control.cliPerFile
			}] : []];
			if (reachedControls.length === 0) throw new RangeError("Semantic ceiling coverage requires a ceiling that stopped retention");
			const reachedText = reachedControls.map((item) => semanticAdjustment(item.name, item.value, item.fallback)).join(" and ");
			const names = reachedControls.map((item) => item.name).join(" and ");
			const cli = reachedControls.map((item) => item.cli).join(" and ");
			const raising = reachedControls.length === 1 ? "Raising it" : "Raising them";
			const limitation = `Semantic ${kind === "nodes" ? "node" : "unknown"} retention reached ${reachedText}. Set ${names} on the next analyze_javascript_application call (CLI: ${cli}). The change applies to that next analysis and does not restart the worker or the REA server. ${raising} does not raise ${control.doesNotRaise}. Coverage reports the same effective values as ${control.ceiling} and ${control.fileCeiling}.`;
			return {
				limits,
				limitation
			};
		};
		javaScriptAnalysisCoverageLimits = (limits) => {
			const result = [];
			for (const key of [
				"worker_heap_limit_bytes",
				"worker_process_memory_limit_bytes",
				"worker_timeout_ms",
				"parent_result_budget_bytes",
				"parent_available_result_budget_bytes",
				"semantic_result_budget_bytes",
				"transfer_record_bytes",
				"transfer_file_bytes"
			]) {
				const value = limits?.[key];
				if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) continue;
				result.push({
					name: `javascript_analysis_${key}`,
					value,
					unit: key.endsWith("_ms") ? "milliseconds" : "bytes"
				});
			}
			return result;
		};
		javaScriptAnalysisResourceControlsSchema = z.strictObject({
			max_semantic_nodes: z.number().int().min(1).max(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM).optional().describe("Maximum retained semantic nodes across the application; defaults to 100000. Worker heap and parent result admission remain enforced."),
			max_semantic_nodes_per_file: z.number().int().min(1).max(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM).optional().describe("Maximum retained semantic nodes per source file; defaults to 20000, additionally bounded by max_semantic_nodes and memory/transfer limits."),
			max_semantic_unknowns: z.number().int().min(1).max(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM).optional().describe("Maximum retained semantic unknown records across the application; defaults to 100000. Omitted emission occurrences are counted by family and reason."),
			max_semantic_unknowns_per_file: z.number().int().min(1).max(JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM).optional().describe("Maximum retained semantic unknown records per source file; defaults to 20000, additionally bounded by max_semantic_unknowns and memory/transfer limits."),
			max_heap_mb: z.number().int().min(128).max(JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM).optional().describe("Maximum V8 old-space heap in MiB for the isolated JavaScript source analyzer; defaults to 1024. This does not change the CLI/MCP process heap. When REA runs on Bun, which ignores V8 heap flags, Windows instead limits the analyzer's committed memory to this budget plus a 512 MiB runtime reserve; other Bun hosts enforce no limit."),
			analysis_timeout_ms: z.number().int().min(1).max(2147483647).optional().describe("Maximum startup, analysis and transfer time per JavaScript source, in milliseconds; defaults to 300000. On timeout, return collected partial Evidence and stop the analysis.")
		});
	})))();
}

//#endregion
export { JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS, JAVASCRIPT_ANALYSIS_TRANSFER_RECORD_BYTES, JAVASCRIPT_PARENT_CHECKPOINT_HEAP_REMEDIATION, JAVASCRIPT_PARENT_HEAP_NODE_OPTIONS, JAVASCRIPT_PARENT_RESULT_BUDGET_REMEDIATION, JAVASCRIPT_SEMANTIC_ITEM_MAXIMUM, JAVASCRIPT_STATIC_FACT_BYTES, JAVASCRIPT_WORKER_HEAP_MIB_MAXIMUM, artifactContainerIntegrityDetails, artifactDfuCrc32PairSchema, artifactIntegrityClaimSchema, artifactIntegrityDetails, artifactIntegrityPair, artifactIntegrityPairOf, artifactMd5PairSchema, artifactSha256PairSchema, init_artifactIntegrity, init_javascriptAnalysisResourceControls, javaScriptAnalysisCoverageLimits, javaScriptAnalysisResourceControlsSchema, javaScriptSemanticCeilingCoverage, javaScriptWorkerHeapExhaustionRecovery, javaScriptWorkerHeapRemediation, projectArtifactIntegrityDetails };