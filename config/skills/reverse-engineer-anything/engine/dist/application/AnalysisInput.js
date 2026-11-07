import { AnalysisCancelledError } from "../domain/analysisErrorCore.js";
import { analysisInputErrorFromIssues } from "../domain/inputIssueProjection.js";
import { err, ok } from "../domain/result.js";
/** Validate an application request, honoring cancellation before admission when supplied. */
export const parseAnalysisInput = (operation, rawInput, schema, signal) => {
    if (signal?.aborted)
        return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
    const input = schema.safeParse(rawInput);
    if (!input.success)
        return err(analysisInputErrorFromIssues(operation, input.error.issues, rawInput, {
            cause: input.error,
        }));
    return ok(input.data);
};
