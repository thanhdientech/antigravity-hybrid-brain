import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ProviderAdapterError, analysisErrorUserMessage, childFailureDiagnostics, composedCallerGuidance, init_analysisErrorPresentation, init_analysisErrorProjection, init_providerAdapterError } from "./jsonLines-CKG28FwL.js";

//#region dist/domain/analysisErrorCleanup.js
var analysisErrorWithCleanupFailure;
function init_analysisErrorCleanup() {
	return (init_analysisErrorCleanup = __esmMin((() => {
		init_providerAdapterError();
		init_analysisErrorProjection();
		init_analysisErrorPresentation();
		analysisErrorWithCleanupFailure = (primary, cleanup, operation = "close_binary") => new ProviderAdapterError(cleanup instanceof ProviderAdapterError ? cleanup.providerId : "rea", operation, {
			cleanupPrimary: primary,
			cause: new AggregateError([primary, cleanup], "Analysis failed and cleanup remains incomplete.", { cause: primary }),
			...composedCallerGuidance({
				message: primary,
				remediation: cleanup
			}),
			...primary.capturedOutput === undefined ? {} : { capturedOutput: primary.capturedOutput },
			...primary.partialObservation === undefined ? {} : { partialObservation: primary.partialObservation },
			cleanup: {
				reason: cleanup.cleanup?.reason ?? analysisErrorUserMessage(cleanup, "invocation"),
				resources: [...new Set([...primary.cleanupIncomplete ? primary.cleanupResources : [], ...cleanup.cleanupResources])]
			},
			...childFailureDiagnostics({
				primary_error: {
					error: primary,
					...primary.capturedOutput === undefined ? {} : { capturedOutput: "omit" }
				},
				cleanup_error: { error: cleanup }
			})
		});
	})))();
}

//#endregion
export { analysisErrorWithCleanupFailure, init_analysisErrorCleanup };