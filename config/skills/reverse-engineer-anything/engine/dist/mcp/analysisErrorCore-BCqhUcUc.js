import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_analysisErrorBase, t as AnalysisError } from "./analysisErrorBase-DIqf4-vY.js";

//#region dist/domain/analysisErrorCore.js
var AnalysisUnsupportedTargetError, ANALYSIS_RESOURCE_KINDS, AnalysisResourceConstraintError, resourceConstraintRecoveryFrom, resourceConstraintRecovery, AnalysisProtocolError, AnalysisInputError, AnalysisOutputError, AnalysisCapabilityUnavailableError, AnalysisCancelledError, AnalysisTimeoutError, AnalysisAccessDeniedError, AnalysisArtifactChangedError;
function init_analysisErrorCore() {
	return (init_analysisErrorCore = __esmMin((() => {
		init_analysisErrorBase();
		AnalysisUnsupportedTargetError = class extends AnalysisError {
			operation;
			path;
			reason;
			_tag = "AnalysisUnsupportedTargetError";
			/** Refusal-specific recovery, when the producer knows an available workflow. */
			remediationAction;
			constructor(operation, path, reason, options) {
				super(`Unsupported target for ${operation} at ${path}: ${reason}`, options);
				this.operation = operation;
				this.path = path;
				this.reason = reason;
				this.remediationAction = options?.remediationAction;
			}
		};
		ANALYSIS_RESOURCE_KINDS = [
			"memory",
			"cpu",
			"file-size",
			"transport",
			"capacity"
		];
		AnalysisResourceConstraintError = class extends AnalysisError {
			operation;
			resource;
			reason;
			reportedLimits;
			_tag = "AnalysisResourceConstraintError";
			/**
			* The one recovery this refusal carries. A fixed allowance and a separate
			* remediation sentence do not co-occur; retryability belongs to that same
			* object.
			*/
			recovery;
			constructor(operation, resource, reason, reportedLimits, options) {
				super(`Resource constraint during ${operation}: ${reason}`, options);
				this.operation = operation;
				this.resource = resource;
				this.reason = reason;
				this.reportedLimits = reportedLimits;
				this.recovery = resourceConstraintRecoveryFrom(options);
			}
			/** Projection of `recovery`. Absent when recovery names a fixed allowance. */
			get remediationAction() {
				return this.recovery.remediationAction;
			}
			/**
			* Projection of `recovery`. The fixed format, decoder, or capture allowance
			* that refused the request. Worker limits and host resources do not raise
			* it, so recovery derives from this allowance rather than from `resource`.
			*/
			get fixedAllowance() {
				return this.recovery.fixedAllowance;
			}
			/**
			* Projection of `recovery`. Whether retrying the same request can succeed.
			* A caller-selected bound is deterministic for the same input, so it is not
			* retryable even when its resource kind would otherwise be treated as
			* admission capacity.
			*/
			get retryable() {
				return this.recovery.retryable;
			}
		};
		resourceConstraintRecoveryFrom = (options) => {
			if (options?.fixedAllowance !== undefined) return {
				fixedAllowance: options.fixedAllowance,
				...options.retryable === undefined ? {} : { retryable: options.retryable }
			};
			return {
				...options?.remediationAction === undefined ? {} : { remediationAction: options.remediationAction },
				...options?.retryable === undefined ? {} : { retryable: options.retryable }
			};
		};
		resourceConstraintRecovery = (error, text = (value) => value) => {
			const recovery = error.recovery;
			return recovery.fixedAllowance !== undefined ? {
				fixedAllowance: {
					name: text(recovery.fixedAllowance.name),
					kind: recovery.fixedAllowance.kind
				},
				...recovery.retryable === undefined ? {} : { retryable: recovery.retryable }
			} : {
				...recovery.remediationAction === undefined ? {} : { remediationAction: text(recovery.remediationAction) },
				...recovery.retryable === undefined ? {} : { retryable: recovery.retryable }
			};
		};
		AnalysisProtocolError = class extends AnalysisError {
			_tag = "AnalysisProtocolError";
		};
		AnalysisInputError = class extends AnalysisError {
			operation;
			issues;
			_tag = "AnalysisInputError";
			userMessage;
			/** Refusal-specific correction, when the generic input-contract advice cannot fix it. */
			remediationAction;
			/**
			* The refused values satisfy the advertised input contract; the selected
			* target lacks the requested fact for them. Re-reading the schema cannot
			* correct such a refusal, so it carries no input-contract recovery.
			*/
			conformsToInputContract;
			constructor(operation, options, issues = []) {
				super(`Invalid analysis input for ${operation}`, options);
				this.operation = operation;
				this.issues = issues;
				this.userMessage = options?.userMessage;
				this.remediationAction = options?.remediationAction;
				this.conformsToInputContract = options?.conformsToInputContract ?? false;
			}
		};
		AnalysisOutputError = class extends AnalysisError {
			operation;
			reason;
			_tag = "AnalysisOutputError";
			userMessage;
			remediationAction;
			cleanupOnly;
			constructor(operation, reason, options) {
				super(`Invalid analysis output for ${operation}: ${reason}`, options);
				this.operation = operation;
				this.reason = reason;
				this.userMessage = options?.userMessage;
				this.remediationAction = options?.remediationAction;
				this.cleanupOnly = options?.cleanupOnly ?? false;
			}
		};
		AnalysisCapabilityUnavailableError = class extends AnalysisError {
			providerId;
			operation;
			reason;
			_tag = "AnalysisCapabilityUnavailableError";
			userMessage;
			remediationAction;
			/** Incomplete cleanup must settle before the operation can be retried. */
			retryable;
			constructor(providerId, operation, reason, options) {
				super(`Provider ${providerId} cannot execute ${operation}: ${reason}`, options);
				this.providerId = providerId;
				this.operation = operation;
				this.reason = reason;
				this.userMessage = options?.userMessage;
				this.remediationAction = options?.remediationAction;
				this.retryable = options?.retryable === true && !this.cleanupIncomplete;
			}
		};
		AnalysisCancelledError = class extends AnalysisError {
			operation;
			_tag = "AnalysisCancelledError";
			constructor(operation, options) {
				super(`Analysis operation was cancelled: ${operation}`, options);
				this.operation = operation;
			}
		};
		AnalysisTimeoutError = class extends AnalysisError {
			operation;
			timeoutMs;
			_tag = "AnalysisTimeoutError";
			userMessage;
			remediationAction;
			constructor(operation, timeoutMs, options) {
				super(`Analysis operation timed out after ${String(timeoutMs)}ms: ${operation}`, options);
				this.operation = operation;
				this.timeoutMs = timeoutMs;
				this.userMessage = options?.userMessage;
				this.remediationAction = options?.remediationAction;
			}
		};
		AnalysisAccessDeniedError = class extends AnalysisError {
			operation;
			path;
			systemCode;
			_tag = "AnalysisAccessDeniedError";
			constructor(operation, path, systemCode, options) {
				super(`Host filesystem read access denied (${systemCode}) for ${path} during ${operation}`, options);
				this.operation = operation;
				this.path = path;
				this.systemCode = systemCode;
			}
		};
		AnalysisArtifactChangedError = class extends AnalysisError {
			operation;
			path;
			reason;
			_tag = "AnalysisArtifactChangedError";
			constructor(operation, path, reason, options) {
				super(`Selected artifact changed during acquisition: ${reason}`, options);
				this.operation = operation;
				this.path = path;
				this.reason = reason;
			}
		};
	})))();
}

//#endregion
export { AnalysisCapabilityUnavailableError as a, AnalysisProtocolError as c, AnalysisUnsupportedTargetError as d, init_analysisErrorCore as f, AnalysisCancelledError as i, AnalysisResourceConstraintError as l, AnalysisAccessDeniedError as n, AnalysisInputError as o, resourceConstraintRecovery as p, AnalysisArtifactChangedError as r, AnalysisOutputError as s, ANALYSIS_RESOURCE_KINDS as t, AnalysisTimeoutError as u };