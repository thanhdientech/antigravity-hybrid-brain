import { requireAnalysisViewRetention, summarizeRetainedAnalysis, } from "../analysisView/AnalysisViewService.js";
import { androidSymbolInspectionInputSchemas } from "../../domain/android/androidAnalysis.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
/** Keep raw provider calls accessible without repeating class inventories inline. */
export const inspectAndroidSymbol = async (service, operation, rawInput, retention, options) => {
    const parsed = parseAnalysisInput(operation, rawInput, androidSymbolInspectionInputSchemas[operation], options?.signal);
    if (!parsed.ok)
        return parsed;
    const { detail, ...input } = parsed.value;
    if (detail === "summary") {
        const ready = requireAnalysisViewRetention(operation, retention);
        if (!ready.ok)
            return ready;
    }
    const executed = await service.execute(operation, input, options);
    return !executed.ok || detail !== "summary"
        ? executed
        : summarizeRetainedAnalysis(executed.value, retention);
};
