import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ProviderAdapterError, analysisErrorUserMessage, childFailureDiagnostics, composedCallerGuidance, err, init_analysisErrorPresentation, init_analysisErrorProjection, init_providerAdapterError, init_result, projectAnalysisError } from "./jsonLines-CKG28FwL.js";
import { init_evidence, tryParseEvidence, withEvidenceCallerInputPath } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_jsonValue, jsonValueSchema } from "./jsonValue-DGGrC1lE.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";

//#region dist/application/DirectAnalysisCleanup.js
var projectInvocationFailure, projectDirectAnalysisFailure, withSessionCleanup, directAnalysisCleanupFailure, managedAnalysisCleanupFailure;
function init_DirectAnalysisCleanup() {
	return (init_DirectAnalysisCleanup = __esmMin((() => {
		init_analysisErrorProjection();
		init_analysisErrorPresentation();
		init_jsonValue();
		init_providerAdapterError();
		init_result();
		init_analysisErrorCleanup();
		init_evidence();
		projectInvocationFailure = (error) => projectAnalysisError(error, "invocation");
		projectDirectAnalysisFailure = (error, callerInputPath) => {
			const projection = projectInvocationFailure(error);
			const observation = tryParseEvidence(projection.details?.partial_observation);
			return observation === undefined ? projection : {
				...projection,
				details: {
					...projection.details,
					partial_observation: withEvidenceCallerInputPath(observation, callerInputPath)
				}
			};
		};
		withSessionCleanup = async (session, operation, onCleanupFailure) => {
			let value;
			try {
				value = await operation();
			} catch (cause) {
				const closed = await session.close();
				if (!closed.ok) throw new AggregateError([cause, closed.error], "Analysis and provider cleanup both failed", { cause });
				throw cause;
			}
			const closed = await session.close();
			return closed.ok ? value : onCleanupFailure(value, closed.error);
		};
		directAnalysisCleanupFailure = (result, error, callerInputPath) => {
			const project = (failure) => callerInputPath === undefined ? projectInvocationFailure(failure) : projectDirectAnalysisFailure(failure, callerInputPath);
			const cleanup = project(error);
			if (!result.ok) {
				const primary = project(result.error);
				const combined = analysisErrorWithCleanupFailure(result.error, error);
				return {
					error: "Analysis failed",
					...primary,
					code: "cleanup_incomplete",
					retryable: false,
					remediation: cleanup.remediation,
					details: {
						...primary.details,
						resources: [...combined.cleanupResources],
						cleanup: "incomplete",
						execution_failure: primary.details?.execution_failure ?? primary.code,
						cleanup_error: cleanup
					}
				};
			}
			return {
				error: "Analysis failed",
				...cleanup,
				code: "cleanup_incomplete",
				retryable: false,
				details: {
					...cleanup.details,
					cleanup: "incomplete",
					partial_observation: result.value
				}
			};
		};
		managedAnalysisCleanupFailure = (result, error) => {
			if (!result.ok) {
				const failure = analysisErrorWithCleanupFailure(result.error, error);
				return err(error.cleanupIncomplete ? failure.bindCleanupDependencies([result.error, error]) : failure);
			}
			const failure = new ProviderAdapterError(error instanceof ProviderAdapterError ? error.providerId : "rea", "close_binary", {
				cause: error,
				...composedCallerGuidance({ remediation: error }),
				cleanup: {
					reason: analysisErrorUserMessage(error, "invocation"),
					resources: error.cleanupResources
				},
				...childFailureDiagnostics({ cleanup_error: { error } }, { partial_observation: jsonValueSchema.parse(result.value) })
			});
			return err(error.cleanupIncomplete ? failure.bindCleanupDependencies([error]) : failure);
		};
	})))();
}

//#endregion
export { directAnalysisCleanupFailure, init_DirectAnalysisCleanup, managedAnalysisCleanupFailure, projectDirectAnalysisFailure, projectInvocationFailure, withSessionCleanup };