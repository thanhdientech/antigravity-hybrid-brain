import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisCancelledError, init_analysisErrorBase, init_analysisErrorCore, primaryAnalysisError } from "./analysisErrorCore-Dm6oHouq.js";

//#region dist/domain/analysisErrorCancellation.js
var analysisErrorWithCancellation;
function init_analysisErrorCancellation() {
	return (init_analysisErrorCancellation = __esmMin((() => {
		init_analysisErrorBase();
		init_analysisErrorCore();
		analysisErrorWithCancellation = (failure, cancellation) => {
			if (failure === undefined) return cancellation;
			const primary = primaryAnalysisError(failure);
			if (!(primary instanceof AnalysisCancelledError) && !primary.secondaryFailures.some((secondary) => secondary instanceof AnalysisCancelledError && secondary.cause === cancellation.cause)) primary.retainSecondaryFailure(cancellation);
			return failure;
		};
	})))();
}

//#endregion
export { analysisErrorWithCancellation, init_analysisErrorCancellation };