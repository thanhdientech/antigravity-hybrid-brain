export const describeResidualUnknownGraphConstraint = (constraint) => {
    switch (constraint.kind) {
        case "history_gap":
            return `Residual unknown ${constraint.unknown_id} revision history has a gap`;
        case "revision_chain":
            return `Residual unknown ${constraint.unknown_id} revision chain is broken`;
        case "missing_evidence":
            return `Residual unknown references missing evidence ${constraint.evidence_id}`;
        case "missing_unknown":
            return `Residual unknown references missing unknown ${constraint.related_unknown_id}`;
        case "contradicting_evidence":
            return `Residual unknown ${constraint.unknown_id} retains contradicting evidence`;
        case "resolution_unproven":
            return `Residual unknown ${constraint.unknown_id} has no qualifying resolution evidence`;
        case "dependency_cycle":
            return "Residual unknown dependency graph contains a cycle";
    }
};
/** Caller input violates a residual-unknown reference or history constraint. */
export class InvalidResidualUnknownGraphError extends TypeError {
    constraint;
    constructor(constraint) {
        super(describeResidualUnknownGraphConstraint(constraint));
        this.constraint = constraint;
        this.name = "InvalidResidualUnknownGraphError";
    }
}
