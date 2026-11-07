import { AnalysisInputError, } from "../analysisErrorCore.js";
export const INSPECT_ANALYSIS_VIEW_OPERATION = "inspect_analysis_view";
/** Recovery belongs to the view projection, not to the MCP transport. */
export const ANALYSIS_VIEW_PAGE_BUDGET_RECOVERY = {
    retryable: false,
    remediationAction: "The 1,048,576-byte analysis-view page allowance is fixed and has no runtime override. For a pageable collection, select fewer fields or a smaller selection; one oversized field may not fit even in a one-row page. If the error includes details.partial_observation, use that complete parent Evidence. Otherwise, read the parent directly from the caller-supplied bundle, or retrieve/export the retained parent in the same MCP session. Reading the parent does not increase the page allowance.",
};
/** Construct a typed input failure for one selected-view constraint. */
export const analysisViewInputError = (issues) => new AnalysisInputError(INSPECT_ANALYSIS_VIEW_OPERATION, undefined, issues);
