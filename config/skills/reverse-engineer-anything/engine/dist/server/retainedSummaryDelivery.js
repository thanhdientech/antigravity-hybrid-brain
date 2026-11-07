import { requireAnalysisViewRetention, summarizeRetainedAnalysis, } from "../application/analysisView/AnalysisViewService.js";
import { ok } from "../domain/result.js";
/**
 * Summary delivery for one named operation: refuse it before analysis when
 * this server retains no Evidence, then return the retained summary view.
 */
export const retainedSummaryDelivery = (operation, options) => {
    const retention = {
        recordEvidence: options.recordEvidence,
        evidenceById: options.evidenceById,
    };
    const selected = (parameters) => parameters.detail === "summary";
    return {
        preflight: (parameters) => selected(parameters)
            ? requireAnalysisViewRetention(operation, retention)
            : ok(null),
        projectEvidence: (parameters, evidence) => selected(parameters)
            ? summarizeRetainedAnalysis(evidence, retention)
            : ok(evidence),
    };
};
/** Delivery detail selects a response shape; it never reaches analysis. */
export const withoutDeliveryDetail = (parameters) => {
    const { detail: _detail, ...selected } = parameters;
    return selected;
};
