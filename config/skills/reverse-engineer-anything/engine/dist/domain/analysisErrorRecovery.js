import { z } from "zod";
/** The retained owner's same-connection retry, also exposed in session status. */
export const analysisCleanupRetrySchema = z
    .object({ operation: z.literal("close_binary") })
    .strict();
export const cleanupRetryRecovery = (retry) => ({
    kind: "retry_cleanup",
    operation: retry.operation,
});
/** Retry advice is conditional; it never promises release or process exit. */
export const cleanupRetryRemediation = (retry) => `This connection retains that cleanup. Keep it open; after the reported condition settles or is resolved, call ${retry.operation} without snapshot_path and check its result. That call retries the retained cleanup without rerunning the failed analysis, preserves investigation Evidence and Unknown history, and can report cleanup_incomplete again.`;
export const analysisErrorRecoverySchema = z.discriminatedUnion("kind", [
    z
        .object({
        kind: z.literal("inspect_input_contract"),
        operation: z.string().min(1),
    })
        .strict(),
    z
        .object({
        kind: z.literal("inspect_timeout_state"),
        operation: z.string().min(1),
        timeout_ms: z.number().int().positive(),
    })
        .strict(),
    z
        .object({
        kind: z.literal("retry_cleanup"),
        operation: z.string().min(1),
    })
        .strict(),
]);
