import { analysisInputErrorFromIssues } from "../domain/inputIssueProjection.js";
import { err } from "../domain/result.js";
import { enhancedInputSchemas, } from "../contracts/enhancedInputs.js";
/** Keep the stopping failure primary while retaining the admitted result. */
export const failedWithPartialResult = (error, partialResult) => ({ ok: false, error, partialResult });
export const invalidEnhancedInput = (name, cause, input) => Promise.resolve(err(analysisInputErrorFromIssues(name, cause.issues, input, { cause })));
