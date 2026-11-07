import { digestCanonicalValue } from "../canonicalDigest.js";
import { javascriptApplicationAnalysisResultSchema, } from "./javascriptApplicationAnalysis.js";
import { assertEvidenceIdentity, authenticateRuntimeEvidence, invalidInput, parseInputAtPath, } from "./javascriptRuntimeReconciliationInputValidation.js";
/** Authenticate and semantically bind one admitted static analysis layer. */
export const parseStaticLayer = (layer, evidencePath) => {
    const evidence = authenticateRuntimeEvidence(layer.analysis, evidencePath);
    const result = parseInputAtPath(javascriptApplicationAnalysisResultSchema, evidence.normalized_result, [...evidencePath, "normalized_result"]);
    assertEvidenceIdentity(evidence, {
        operation: "analyze_javascript_application",
        predicate: "rea.javascript-application-analysis",
        providerId: "rea-javascript-application",
        providerName: "REA JavaScript application analyzer",
        providerVersion: "1",
        authority: "shipped-artifact",
        confidence: "derived",
    }, evidencePath);
    if (evidence.subject === null ||
        evidence.subject.digest.sha256 !== result.root_artifact_sha256 ||
        evidence.subject.format !== result.format ||
        evidence.subject.local_path !== result.input_path)
        throw invalidInput([...evidencePath, "subject"], "JavaScript application Evidence subject disagrees with its result");
    return {
        layerId: `jrl_${digestCanonicalValue({
            role: layer.role,
            evidence_id: evidence.evidence_id,
            runtime_mappings: layer.runtime_mappings,
        }, "Runtime reconciliation")}`,
        role: layer.role,
        evidence,
        result,
        graph: result.graph,
        runtimeMappings: layer.runtime_mappings,
    };
};
