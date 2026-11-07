import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, t as err } from "./result-Dbqc_peo.js";
import { B as analysisErrorUserMessage, H as init_analysisErrorPresentation, V as composedCallerGuidance, X as init_providerAdapterError, Y as ProviderAdapterError, n as init_analysisErrorProjection, r as projectAnalysisError, t as childFailureDiagnostics } from "./analysisErrorProjection-B_6dTGtM.js";
import { i as jsonValueSchema, n as init_jsonValue } from "./jsonValue-CbQQraup.js";
import { g as tryParseEvidence, u as init_evidence, v as withEvidenceCallerInputPath } from "./evidence-Cy8VjugF.js";
import { n as init_analysisErrorCleanup, t as analysisErrorWithCleanupFailure } from "./analysisErrorCleanup-CLocSgSR.js";

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
export { projectInvocationFailure as a, projectDirectAnalysisFailure as i, init_DirectAnalysisCleanup as n, withSessionCleanup as o, managedAnalysisCleanupFailure as r, directAnalysisCleanupFailure as t };