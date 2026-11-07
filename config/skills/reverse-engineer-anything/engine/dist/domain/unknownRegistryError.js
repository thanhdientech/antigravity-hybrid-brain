import { AnalysisError } from "./analysisErrorBase.js";
/** Residual-unknown mutation failed a lifecycle, reference, or CAS invariant. */
export class UnknownRegistryError extends AnalysisError {
    _tag = "UnknownRegistryError";
    constraint;
    reason;
    constructor(failure, options) {
        const reason = typeof failure === "string"
            ? failure
            : failure.kind === "history_gap" || failure.kind === "revision_chain"
                ? "integrity"
                : "constraint";
        super(`Residual unknown registry mutation failed: ${reason}`, options);
        this.reason = reason;
        this.constraint = typeof failure === "string" ? undefined : failure;
    }
}
