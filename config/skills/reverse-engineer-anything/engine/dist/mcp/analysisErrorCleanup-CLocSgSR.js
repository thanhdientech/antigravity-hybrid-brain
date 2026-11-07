import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { B as analysisErrorUserMessage, H as init_analysisErrorPresentation, V as composedCallerGuidance, X as init_providerAdapterError, Y as ProviderAdapterError, n as init_analysisErrorProjection, t as childFailureDiagnostics } from "./analysisErrorProjection-B_6dTGtM.js";

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
export { init_analysisErrorCleanup as n, analysisErrorWithCleanupFailure as t };