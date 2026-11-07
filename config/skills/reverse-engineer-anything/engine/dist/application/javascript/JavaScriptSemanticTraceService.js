import { resolveEvidenceRequest, } from "../EvidenceInputResolver.js";
import { traceJavaScriptSemanticsRequestSchema } from "../../contracts/javascript/applicationWorkflowInputContracts.js";
import { AnalysisInputError } from "../../domain/analysisErrorCore.js";
import { applicationGraphEvidenceInputError, parseApplicationGraphEvidence, } from "./JavaScriptApplicationEvidenceGraph.js";
import { queryJavaScriptSemanticGraph } from "../../domain/javascript/javascriptSemanticQuery.js";
import { err, ok } from "../../domain/result.js";
import { createJavaScriptSemanticTraceEvidence } from "./JavaScriptApplicationWorkflowEvidence.js";
const OPERATION = "trace_javascript_semantics";
/** Resolve and authenticate one application source before tracing semantic relations. */
export const traceJavaScriptSemanticsEvidence = (rawInput, lookup, options = {}) => {
    const request = resolveEvidenceRequest(OPERATION, rawInput, traceJavaScriptSemanticsRequestSchema, lookup, options);
    if (!request.ok)
        return request;
    const input = request.value.input;
    const sourceResult = parseApplicationGraphEvidence(input.application, [
        "application",
    ]);
    if (!sourceResult.ok)
        return err(applicationGraphEvidenceInputError(OPERATION, sourceResult.error));
    const source = sourceResult.value;
    if (source.semanticGraph === null)
        return err(new AnalysisInputError(OPERATION, undefined, [
            {
                path: ["application"],
                reason: "invalid_value",
                expected: "Evidence from analyze_javascript_application with a semantic graph",
            },
        ]));
    const query = queryJavaScriptSemanticGraph(source.semanticGraph, input.query);
    const result = {
        ...query,
        source_evidence_id: source.evidence.evidence_id,
        evidence_links: [source.evidence.evidence_id],
    };
    const { allowed_relations, ...queryParameters } = input.query;
    const evidence = createJavaScriptSemanticTraceEvidence({
        application_evidence_id: source.evidence.evidence_id,
        query: allowed_relations === undefined
            ? queryParameters
            : { ...queryParameters, allowed_relations },
    }, result);
    return ok({ evidence, result, sources: [source.evidence] });
};
