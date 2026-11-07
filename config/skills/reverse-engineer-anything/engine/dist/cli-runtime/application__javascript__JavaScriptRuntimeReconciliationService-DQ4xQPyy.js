import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { analysisInputErrorFromIssues, createEvidence, init_evidence, init_inputIssueProjection } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER, init_investigationProviders } from "./investigationProviders-Bs5C0Q8b.js";
import { init_EvidenceInputResolver, resolveEvidenceRequest } from "./EvidenceInputResolver-Bnks2n7c.js";
import { init_javascriptRuntimeReconciliationSchemas, runtimeReconciliationIdentitiesSchema } from "./javascriptRuntimeReconciliationSchemas-DnGvlNG6.js";
import { init_applicationWorkflowInputContracts, reconcileJavaScriptRuntimeRequestSchema } from "./applicationWorkflowInputContracts-ySl3Jisz.js";
import { init_javascriptRuntimeReconciliation, readRuntimeReconciliationInput, reconcileJavaScriptRuntime } from "./javascriptRuntimeReconciliation-CiHMUOUA.js";
import { resolve } from "node:path";

//#region dist/application/javascript/JavaScriptRuntimeReconciliationEvidence.js
var createJavaScriptRuntimeReconciliationEvidence, parameters;
function init_JavaScriptRuntimeReconciliationEvidence() {
	return (init_JavaScriptRuntimeReconciliationEvidence = __esmMin((() => {
		init_evidence();
		init_investigationProviders();
		createJavaScriptRuntimeReconciliationEvidence = (input, result) => createEvidence(undefined, JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER, {
			predicateType: "rea.javascript-runtime-reconciliation",
			operation: "reconcile_javascript_runtime",
			parameters: parameters(input),
			result,
			rawResult: null,
			confidence: "inferred",
			authority: "analyst-inference",
			environment: null,
			limitations: result.limitations,
			evidenceLinks: result.evidence_links
		});
		parameters = (input) => ({
			static_layers: input.static_layers.map((layer) => ({
				role: layer.role,
				evidence_id: layer.analysis.evidence_id,
				runtime_mappings: layer.runtime_mappings
			})),
			runtime_evidence_ids: input.runtime_observations.map(({ evidence_id: id }) => id)
		});
	})))();
}

//#endregion
//#region dist/application/javascript/JavaScriptRuntimeReconciliationService.js
var OPERATION, reconcileJavaScriptRuntimeEvidence, normalizeRuntimeMappingRoots, isPortableAbsolutePath;
function init_JavaScriptRuntimeReconciliationService() {
	return (init_JavaScriptRuntimeReconciliationService = __esmMin((() => {
		init_EvidenceInputResolver();
		init_applicationWorkflowInputContracts();
		init_inputIssueProjection();
		init_javascriptRuntimeReconciliation();
		init_javascriptRuntimeReconciliationSchemas();
		init_result();
		init_JavaScriptRuntimeReconciliationEvidence();
		OPERATION = "reconcile_javascript_runtime";
		reconcileJavaScriptRuntimeEvidence = (rawInput, lookup, options = {}) => {
			const selected = resolveEvidenceRequest(OPERATION, rawInput, reconcileJavaScriptRuntimeRequestSchema, lookup, options);
			if (!selected.ok) return selected;
			const parsed = readRuntimeReconciliationInput(normalizeRuntimeMappingRoots(selected.value.input));
			if (!parsed.ok) return parsed;
			const identities = runtimeReconciliationIdentitiesSchema.safeParse({
				static_layers: parsed.value.layers.map(({ role, evidence }) => ({
					role,
					analysis: evidence
				})),
				runtime_observations: parsed.value.captures.map(({ evidence }) => evidence)
			});
			if (!identities.success) return err(analysisInputErrorFromIssues(OPERATION, identities.error.issues, rawInput));
			const result = reconcileJavaScriptRuntime(parsed.value);
			return ok({
				evidence: createJavaScriptRuntimeReconciliationEvidence(parsed.value.input, result),
				sources: [...parsed.value.layers.map(({ evidence }) => evidence), ...parsed.value.captures.map(({ evidence }) => evidence)]
			});
		};
		normalizeRuntimeMappingRoots = (input) => ({
			...input,
			static_layers: input.static_layers.map((layer) => ({
				...layer,
				runtime_mappings: layer.runtime_mappings.map((mapping) => mapping.kind === "file-root" ? {
					...mapping,
					root: isPortableAbsolutePath(mapping.root) ? mapping.root : resolve(mapping.root)
				} : mapping)
			}))
		});
		isPortableAbsolutePath = (path) => path.startsWith("/") || /^[a-z]:[\\/]/iu.test(path) || /^(?:\\\\|\/\/)[^\\/]+[\\/][^\\/]+(?:[\\/]|$)/u.test(path);
	})))();
}

//#endregion
init_JavaScriptRuntimeReconciliationService();
export { reconcileJavaScriptRuntimeEvidence };