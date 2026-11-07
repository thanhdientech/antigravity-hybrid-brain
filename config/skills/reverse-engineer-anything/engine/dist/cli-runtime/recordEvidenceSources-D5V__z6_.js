import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisCapabilityUnavailableError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";

//#region dist/application/investigation/recordEvidenceSources.js
var withEvidenceSources, retainAnalysisResultSources, recordEvidenceSources;
function init_recordEvidenceSources() {
	return (init_recordEvidenceSources = __esmMin((() => {
		init_result();
		init_analysisErrorCore();
		withEvidenceSources = (result, sources) => sources.length === 0 ? result : {
			...result,
			sourceEvidence: sources
		};
		retainAnalysisResultSources = (operation, recordEvidence, result, options = {}) => {
			const sources = result.sourceEvidence ?? [];
			const retained = sources.length > 0 && recordEvidence === undefined && options.sourceOwner !== "caller" ? err(new AnalysisCapabilityUnavailableError("rea", operation, "Provider source Evidence requires an explicit retention owner.", { userMessage: "Use an analysis session that retains provider source Evidence, or supply an Evidence recorder when registering this adapter." })) : recordEvidenceSources(recordEvidence, sources);
			if (retained.ok) return result;
			if (result.ok) return retained;
			result.error.retainSecondaryFailure(retained.error);
			return result;
		};
		recordEvidenceSources = (recordEvidence, sources) => {
			for (const source of sources) {
				const recorded = recordEvidence?.(source);
				if (recorded !== undefined && !recorded.ok) return recorded;
			}
			return ok(null);
		};
	})))();
}

//#endregion
export { init_recordEvidenceSources, recordEvidenceSources, retainAnalysisResultSources, withEvidenceSources };