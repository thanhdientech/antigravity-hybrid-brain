import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/domain/analysisErrorBase.js
var ANALYSIS_ERROR_TAGS, AnalysisError, resolvedAnalysisError, primaryAnalysisError;
function init_analysisErrorBase() {
	return (init_analysisErrorBase = __esmMin((() => {
		ANALYSIS_ERROR_TAGS = [
			"AnalysisProtocolError",
			"AnalysisInputError",
			"AnalysisAccessDeniedError",
			"AnalysisArtifactChangedError",
			"AnalysisOutputError",
			"AnalysisCapabilityUnavailableError",
			"AnalysisUnsupportedTargetError",
			"AnalysisCancelledError",
			"AnalysisTimeoutError",
			"AnalysisResourceConstraintError",
			"ProviderSelectionError",
			"ProviderAdapterError",
			"BrowserObservationError",
			"ArtifactOperationError",
			"ProcessCaptureError",
			"EvidenceIntegrityError",
			"EvidenceFileError",
			"UnknownRegistryError",
			"HopperTimeoutError",
			"HopperCancelledError",
			"HopperProtocolError",
			"HopperRemoteError",
			"HopperProcessError",
			"HopperStartError",
			"ConfigurationError",
			"NoBinaryOpenError",
			"BinaryTargetError"
		];
		AnalysisError = class extends Error {
			limit;
			/** Bind the accepted setting at its producing boundary. */
			bindLimit(limit) {
				this.limit = Object.freeze({ ...limit });
				return this;
			}
			#cleanupPrimary;
			#cleanupDependencies;
			#cleanupResourceProjection;
			#cleanupDependents = [];
			diagnostics;
			continuingCallerGuidance;
			invocationDiagnostics;
			capturedOutput;
			cleanup;
			cleanupIncomplete;
			#ownedCleanupResources;
			#cleanupResourceOwner;
			#cleanupCompletionOwner;
			#cleanupRetry;
			#secondaryFailures = [];
			constructor(message, options) {
				super(message, options);
				this.#cleanupPrimary = options?.cleanupPrimary;
				if (options?.limit !== undefined) this.bindLimit(options.limit);
				this.diagnostics = options?.diagnostics === undefined ? undefined : structuredClone(options.diagnostics);
				this.continuingCallerGuidance = options?.continuingCallerGuidance === undefined ? undefined : Object.freeze({ ...options.continuingCallerGuidance });
				this.invocationDiagnostics = options?.invocationDiagnostics === undefined ? undefined : structuredClone(options.invocationDiagnostics);
				this.capturedOutput = options?.capturedOutput === undefined ? undefined : { ...options.capturedOutput };
				this.cleanup = options?.cleanup;
				this.cleanupIncomplete = options?.cleanup !== undefined;
				this.#ownedCleanupResources = [...options?.cleanup?.resources ?? []];
				this.partialObservation = options?.partialObservation;
			}
			userMessage = undefined;
			userCategory = undefined;
			executionFailure = undefined;
			partialObservation;
			workflowUnknownPublication;
			get cleanupPrimary() {
				return this.#cleanupPrimary;
			}
			/** Later typed failures retained without changing the primary error cause. */
			get secondaryFailures() {
				return [...this.#secondaryFailures];
			}
			cleanupReport = undefined;
			/** Live dependencies own current resource attribution; cleanup keeps history. */
			get cleanupResources() {
				if (this.#cleanupDependencies === undefined) return this.#cleanupResourceOwner?.cleanupResources ?? this.#ownedCleanupResources;
				const pending = [...this.#cleanupDependencies].filter((dependency) => dependency.cleanupIncomplete);
				if (pending.length === 0) return [];
				if (this.#cleanupResourceProjection !== undefined) return this.#cleanupResourceProjection.cleanupResources;
				return [...new Set(pending.flatMap((dependency) => dependency.cleanupResources))];
			}
			/** Whether cleanup follows an explicit owner or dependent errors. */
			get hasCleanupOwner() {
				return this.#cleanupResourceOwner !== undefined || this.#cleanupCompletionOwner !== undefined || this.#cleanupDependencies !== undefined;
			}
			/** Bind attribution only to the producer that owns the complete cleanup set. */
			bindCleanupResourceOwner(owner) {
				this.#cleanupResourceOwner = owner;
				return this;
			}
			/** Observe exact completion without replacing the producer's resource facts. */
			bindCleanupCompletionOwner(owner) {
				this.#cleanupCompletionOwner = owner;
				return this;
			}
			/** Caller retry for the live cleanup; undefined once cleanup completes. */
			get cleanupRetry() {
				return this.cleanupIncomplete ? this.#cleanupRetry : undefined;
			}
			/** Bind only from the owner retaining every reported resource for this retry. */
			bindCleanupRetry(retry) {
				this.#cleanupRetry = Object.freeze({ ...retry });
				return this;
			}
			/** Initialize resource facts supplied by a more specific error producer. */
			setCleanupResources(resources) {
				this.#ownedCleanupResources = [...resources];
			}
			/** Retain diagnostic facts without replacing the original typed error. */
			retainDiagnostics(diagnostics) {
				Object.assign(this, {
					diagnostics: structuredClone({
						...this.diagnostics,
						...diagnostics
					}),
					...this.invocationDiagnostics === undefined ? {} : { invocationDiagnostics: structuredClone({
						...this.invocationDiagnostics,
						...diagnostics
					}) }
				});
				return this;
			}
			/** Diagnostics recorded for a caller with this lifetime. */
			diagnosticsFor(callerLifetime) {
				return callerLifetime === "invocation" ? this.invocationDiagnostics ?? this.diagnostics : this.diagnostics;
			}
			retainSecondaryFailure(failure, diagnostics) {
				if (diagnostics !== undefined) this.retainDiagnostics(diagnostics);
				this.#secondaryFailures.push(failure);
				return this;
			}
			/** Keep a composed error incomplete until all explicitly owned source errors resolve. */
			bindCleanupDependencies(dependencies, resourceProjection) {
				const pending = this.#cleanupDependencies ??= new Set();
				if (resourceProjection !== undefined) this.#cleanupResourceProjection = resourceProjection;
				for (const dependency of dependencies) {
					if (!dependency.cleanupIncomplete || pending.has(dependency)) continue;
					pending.add(dependency);
					dependency.#cleanupDependents = [...dependency.#cleanupDependents.filter((reference) => reference.deref() !== undefined), new WeakRef(this)];
				}
				if (pending.size === 0) this.resolveCleanup();
				return this;
			}
			/** Clear live cleanup status only after its owning resource confirms retry success. */
			resolveCleanup() {
				if ([...this.#cleanupDependencies ?? []].some((dependency) => dependency.cleanupIncomplete)) return this;
				this.#cleanupDependencies?.clear();
				this.cleanupIncomplete = false;
				for (const reference of this.#cleanupDependents) reference.deref()?.resolveCleanup();
				this.#cleanupDependents = [];
				return this;
			}
			/** Retain a completed observation when a later step fails. */
			retainPartialObservation(observation) {
				this.partialObservation ??= observation;
				return this;
			}
			/** Preserve the exact committed prefix when automatic question publication stops. */
			retainWorkflowUnknownPublication(publication) {
				this.workflowUnknownPublication ??= Object.freeze({ ...publication });
				return this;
			}
		};
		resolvedAnalysisError = (error) => {
			while (!error.cleanupIncomplete && error.cleanupPrimary !== undefined) error = error.cleanupPrimary;
			return error;
		};
		primaryAnalysisError = (error) => {
			while (error.cleanupPrimary !== undefined) error = error.cleanupPrimary;
			return error;
		};
	})))();
}

//#endregion
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
export { ANALYSIS_RESOURCE_KINDS, AnalysisAccessDeniedError, AnalysisArtifactChangedError, AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisError, AnalysisInputError, AnalysisOutputError, AnalysisProtocolError, AnalysisResourceConstraintError, AnalysisTimeoutError, AnalysisUnsupportedTargetError, init_analysisErrorBase, init_analysisErrorCore, primaryAnalysisError, resolvedAnalysisError, resourceConstraintRecovery };