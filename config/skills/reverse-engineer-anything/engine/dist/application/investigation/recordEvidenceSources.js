import { err, ok } from "../../domain/result.js";
import { AnalysisCapabilityUnavailableError } from "../../domain/analysisErrorCore.js";
export const withEvidenceSources = (result, sources) => sources.length === 0 ? result : { ...result, sourceEvidence: sources };
/** Retain producer sources; caller-owned records remain available without a writer. */
export const retainAnalysisResultSources = (operation, recordEvidence, result, options = {}) => {
    const sources = result.sourceEvidence ?? [];
    const retained = sources.length > 0 &&
        recordEvidence === undefined &&
        options.sourceOwner !== "caller"
        ? err(new AnalysisCapabilityUnavailableError("rea", operation, "Provider source Evidence requires an explicit retention owner.", {
            userMessage: "Use an analysis session that retains provider source Evidence, or supply an Evidence recorder when registering this adapter.",
        }))
        : recordEvidenceSources(recordEvidence, sources);
    if (retained.ok)
        return result;
    if (result.ok)
        return retained;
    result.error.retainSecondaryFailure(retained.error);
    return result;
};
/** Record source evidence in order, stopping at the first session rejection. */
export const recordEvidenceSources = (recordEvidence, sources) => {
    for (const source of sources) {
        const recorded = recordEvidence?.(source);
        if (recorded !== undefined && !recorded.ok)
            return recorded;
    }
    return ok(null);
};
