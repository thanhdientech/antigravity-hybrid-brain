import { z } from "zod";
/** A complete canonical investigation checkpoint, distinct from engine replay. */
export const evidenceBundleExportReceiptSchema = z.object({
    path: z.string(),
    bytes: z.int().min(0),
    records: z.int().min(0),
    unknowns: z.int().min(0),
});
/** Counts describe committed state; byte counts estimate retained representation, not RSS. */
export const investigationStatisticsSchema = z.object({
    evidence_records: z.int().min(0),
    unknown_revisions: z.int().min(0),
    unknown_heads: z.int().min(0),
    retained_representation_bytes: z.int().min(0),
    maximum_representation_bytes: z.int().min(0),
    persistence: z.literal("memory"),
});
/** Explicitly ending an investigation does not require retiring its active engine. */
export const resetInvestigationReceiptSchema = z.object({
    cleared_evidence_records: z.int().min(0),
    cleared_unknown_revisions: z.int().min(0),
    cleared_unknown_heads: z.int().min(0),
    retained_target: z.boolean(),
    saved_bundle: evidenceBundleExportReceiptSchema.optional(),
});
