/** Evaluate provider-owned requirements against the admitted target. */
export const targetApplicabilityRefusal = (applicability, target) => !applicability.kinds.includes(target.kind)
    ? { code: "target_kind_unsupported", reason: applicability.reason }
    : !applicability.formats.includes(target.format)
        ? { code: "target_format_unsupported", reason: applicability.reason }
        : undefined;
