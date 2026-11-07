import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisCancelledError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { analysisInputErrorFromIssues, init_inputIssueProjection } from "./mcpDoctorOptions-DnJ1wqKj.js";

//#region dist/application/AnalysisInput.js
var parseAnalysisInput;
function init_AnalysisInput() {
	return (init_AnalysisInput = __esmMin((() => {
		init_analysisErrorCore();
		init_inputIssueProjection();
		init_result();
		parseAnalysisInput = (operation, rawInput, schema, signal) => {
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			const input = schema.safeParse(rawInput);
			if (!input.success) return err(analysisInputErrorFromIssues(operation, input.error.issues, rawInput, { cause: input.error }));
			return ok(input.data);
		};
	})))();
}

//#endregion
export { init_AnalysisInput, parseAnalysisInput };