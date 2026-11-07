import { requireAnalysisViewRetention, summarizeRetainedAnalysis, } from "../analysisView/AnalysisViewService.js";
import { dartAotInspectionInputSchema } from "../../domain/flutter/flutterBuildAnalysis.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
/** Keep the caller's ABI choice and complete analysis; select only its delivery. */
export const inspectDartAot = async (service, rawInput, retention, options) => {
    const operation = "inspect_dart_aot";
    const parsed = parseAnalysisInput(operation, rawInput, dartAotInspectionInputSchema, options?.signal);
    if (!parsed.ok)
        return parsed;
    if (parsed.value.detail === "summary") {
        const ready = requireAnalysisViewRetention(operation, retention);
        if (!ready.ok)
            return ready;
    }
    const { detail, ...providerInput } = parsed.value;
    const executed = await service.execute(operation, providerInput, options);
    if (!executed.ok || detail !== "summary")
        return executed;
    return summarizeRetainedAnalysis(executed.value, retention);
};
