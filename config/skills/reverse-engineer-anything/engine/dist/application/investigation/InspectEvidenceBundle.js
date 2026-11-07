import { AnalysisInputError } from "../../domain/analysisErrorCore.js";
import { err, ok } from "../../domain/result.js";
import { inspectEvidenceLinks, selectEvidenceRecords, summarizeEvidenceBundle, } from "../../domain/evidenceRecordSummary.js";
/** Fields owned by particular deliveries, refused elsewhere rather than ignored. */
const DELIVERY_FIELDS = [
    ["offset", ["records", "links"]],
    ["limit", ["records", "links"]],
    ["traversal", ["links"]],
    ["link_status", ["links"]],
];
/** Select complete delivery, discovery metadata, complete records, or link membership. */
export const inspectEvidenceBundle = (bundle, options) => {
    if (options.detail === "complete" && options.filters !== undefined)
        return err(new AnalysisInputError("get_evidence_bundle", undefined, [
            {
                path: ["filters"],
                reason: "invalid_value",
                message: "Record filters require detail: summary, records or links; complete returns the canonical bundle.",
                expected: "detail: summary, records or links",
            },
        ]));
    const misplaced = DELIVERY_FIELDS.filter(([field, details]) => options[field] !== undefined &&
        !details.includes(options.detail));
    if (misplaced.length > 0)
        return err(new AnalysisInputError("get_evidence_bundle", undefined, misplaced.map(([field, details]) => {
            const expected = details
                .map((detail) => `detail: ${detail}`)
                .join(" or ");
            return {
                path: [field],
                reason: "invalid_value",
                message: `${field} requires ${expected}.`,
                expected,
            };
        })));
    if (options.detail === "records")
        return ok(selectEvidenceRecords(bundle, options.filters, {
            offset: options.offset,
            limit: options.limit,
        }));
    if (options.detail === "links")
        return ok(inspectEvidenceLinks(bundle, options.filters, {
            traversal: options.traversal,
            linkStatus: options.link_status,
            offset: options.offset,
            limit: options.limit,
        }));
    return ok(options.detail === "summary"
        ? summarizeEvidenceBundle(bundle, options.filters)
        : bundle);
};
