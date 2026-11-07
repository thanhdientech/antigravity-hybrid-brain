import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_analysisErrorBase, t as AnalysisError } from "./analysisErrorBase-DIqf4-vY.js";
import { z } from "zod";

//#region dist/domain/residualUnknownGraphError.js
var describeResidualUnknownGraphConstraint, InvalidResidualUnknownGraphError;
function init_residualUnknownGraphError() {
	return (init_residualUnknownGraphError = __esmMin((() => {
		describeResidualUnknownGraphConstraint = (constraint) => {
			switch (constraint.kind) {
				case "history_gap": return `Residual unknown ${constraint.unknown_id} revision history has a gap`;
				case "revision_chain": return `Residual unknown ${constraint.unknown_id} revision chain is broken`;
				case "missing_evidence": return `Residual unknown references missing evidence ${constraint.evidence_id}`;
				case "missing_unknown": return `Residual unknown references missing unknown ${constraint.related_unknown_id}`;
				case "contradicting_evidence": return `Residual unknown ${constraint.unknown_id} retains contradicting evidence`;
				case "resolution_unproven": return `Residual unknown ${constraint.unknown_id} has no qualifying resolution evidence`;
				case "dependency_cycle": return "Residual unknown dependency graph contains a cycle";
			}
		};
		InvalidResidualUnknownGraphError = class extends TypeError {
			constraint;
			constructor(constraint) {
				super(describeResidualUnknownGraphConstraint(constraint));
				this.constraint = constraint;
				this.name = "InvalidResidualUnknownGraphError";
			}
		};
	})))();
}

//#endregion
//#region dist/domain/evidenceErrors.js
var EvidenceIntegrityError, AnalysisSnapshotMismatchError, ResourceSnapshotMismatchError, EvidenceReferenceError, EvidenceFileError;
function init_evidenceErrors() {
	return (init_evidenceErrors = __esmMin((() => {
		init_analysisErrorBase();
		EvidenceIntegrityError = class extends AnalysisError {
			_tag = "EvidenceIntegrityError";
			userMessage;
			constructor(message, options) {
				super(message, options);
				this.userMessage = options?.userMessage;
			}
		};
		AnalysisSnapshotMismatchError = class extends EvidenceIntegrityError {
			bindingMismatch;
			constructor(message, bindingMismatch) {
				super(message);
				this.bindingMismatch = bindingMismatch;
			}
		};
		ResourceSnapshotMismatchError = class extends AnalysisSnapshotMismatchError {
			operation;
			constructor(operation) {
				super("Analysis snapshots do not apply to a resource-only app session because it has no executable identity or replay binding.");
				this.operation = operation;
			}
		};
		EvidenceReferenceError = class extends EvidenceIntegrityError {
			evidenceId;
			reason;
			expected;
			actual;
			/** Set when the consuming workflow requires retained closure. */
			referenceScope;
			constructor(evidenceId, reason, options) {
				super(`Evidence reference ${reason}: ${evidenceId}`, options);
				this.evidenceId = evidenceId;
				this.reason = reason;
				this.expected = options.expected;
				this.actual = options.actual;
				this.referenceScope = options.referenceScope;
			}
		};
		EvidenceFileError = class extends AnalysisError {
			operation;
			reason;
			_tag = "EvidenceFileError";
			userMessage;
			/** Caller-selected path that failed, resolved against the working directory. */
			path;
			/** Present only when a write committed before cleanup failed. */
			published;
			/** Schema issues relative to the selected file's JSON root, never the request envelope. */
			contentIssues;
			systemCode;
			constructor(operation, reason, options) {
				super(`Evidence bundle ${operation} failed: ${reason}`, options);
				this.operation = operation;
				this.reason = reason;
				this.path = options?.path;
				this.published = options?.published;
				this.userMessage = options?.userMessage;
				this.contentIssues = options?.contentIssues;
				this.systemCode = options?.systemCode;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/unknownRegistryError.js
var UnknownRegistryError;
function init_unknownRegistryError() {
	return (init_unknownRegistryError = __esmMin((() => {
		init_analysisErrorBase();
		UnknownRegistryError = class extends AnalysisError {
			_tag = "UnknownRegistryError";
			constraint;
			reason;
			constructor(failure, options) {
				const reason = typeof failure === "string" ? failure : failure.kind === "history_gap" || failure.kind === "revision_chain" ? "integrity" : "constraint";
				super(`Residual unknown registry mutation failed: ${reason}`, options);
				this.reason = reason;
				this.constraint = typeof failure === "string" ? undefined : failure;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/digests.js
var SHA256_PATTERN, digestSchema, prefixedDigestSchema, isDigest;
function init_digests() {
	return (init_digests = __esmMin((() => {
		SHA256_PATTERN = /^[a-f0-9]{64}$/u;
		digestSchema = z.string().regex(SHA256_PATTERN);
		prefixedDigestSchema = (prefix) => z.string().regex(new RegExp(`^${prefix}_[a-f0-9]{64}$`, "u"), `Expected a ${prefix}_ prefixed lowercase sha256 digest`);
		isDigest = (value) => typeof value === "string" && SHA256_PATTERN.test(value);
	})))();
}

//#endregion
export { UnknownRegistryError as a, EvidenceFileError as c, ResourceSnapshotMismatchError as d, init_evidenceErrors as f, init_residualUnknownGraphError as h, prefixedDigestSchema as i, EvidenceIntegrityError as l, describeResidualUnknownGraphConstraint as m, init_digests as n, init_unknownRegistryError as o, InvalidResidualUnknownGraphError as p, isDigest as r, AnalysisSnapshotMismatchError as s, digestSchema as t, EvidenceReferenceError as u };