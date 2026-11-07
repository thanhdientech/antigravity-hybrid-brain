import { err } from "../domain/result.js";
import { GHIDRA_STARTUP_DEADLINE_ELAPSED, } from "./GhidraSessionError.js";
import { GhidraAdmissionError } from "./GhidraAdmissionError.js";
/** Ping and validate the bridge after its socket is attached. */
export async function completeGhidraStartupHandshake(options) {
    const ping = await options.request("ping", {}, {
        signal: options.deadline.signal,
        timeoutMs: options.deadline.remainingMs(),
    });
    if (!ping.ok) {
        const failure = ping.error.kind === "cancelled" &&
            options.deadline.interruption !== undefined
            ? interruptionFailure(options)
            : ping.error;
        if (failure.kind === "remote" &&
            (failure.remoteCode === "import_identity_unavailable" ||
                failure.remoteCode === "import_identity_mismatch")) {
            const admitted = options.failure("admission", failure.message, new GhidraAdmissionError(failure.remoteCode, undefined, {
                cause: failure,
            }), { remoteCode: failure.remoteCode });
            return err(failure.cleanupFailure === undefined
                ? admitted
                : admitted.withCleanupFailure(failure.cleanupFailure));
        }
        return err(failure);
    }
    const parsed = options.parseSessionInfo(ping.value);
    if (!parsed.ok || parsed.value.analysis_timed_out) {
        const failure = parsed.ok
            ? options.failure("analysis_timeout", "Ghidra auto-analysis reached its per-file deadline")
            : parsed.error;
        return err(failure);
    }
    return parsed;
}
const interruptionFailure = (options) => options.deadline.interruption === "cancelled"
    ? options.failure("cancelled", "Ghidra startup was cancelled", options.deadline.signal.reason, { cancellation: { reason: options.deadline.signal.reason } })
    : options.failure("timeout", GHIDRA_STARTUP_DEADLINE_ELAPSED, undefined, {
        timeoutMs: options.startupTimeoutMs,
    });
