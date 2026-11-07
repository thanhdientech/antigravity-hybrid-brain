import { requireAnalysisViewRetention, projectRetainedAnalysis, } from "../analysisView/AnalysisViewService.js";
import { androidPackageInspectionInputSchema } from "../../domain/android/androidAnalysis.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
/** Preserve the complete provider request; select retained delivery explicitly. */
export const inspectAndroidPackage = async (service, rawInput, retention, options) => {
    const operation = "inspect_android_package";
    const parsed = parseAnalysisInput(operation, rawInput, androidPackageInspectionInputSchema, options?.signal);
    if (!parsed.ok)
        return parsed;
    if (parsed.value.detail === "summary") {
        const ready = requireAnalysisViewRetention(operation, retention);
        if (!ready.ok)
            return ready;
    }
    const executed = await service.execute(operation, { path: parsed.value.path }, options);
    if (!executed.ok || parsed.value.detail !== "summary")
        return executed;
    return projectRetainedAnalysis(executed.value, retention, parsed.value.view ?? { kind: "summary" });
};
