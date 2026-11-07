import { readFile } from "node:fs/promises";
import { AnalysisResourceConstraintError } from "../domain/analysisErrorCore.js";
import { parseLinuxProcessStat } from "./LinuxProcessStat.js";
import { OwnedDebuggerCleanupError } from "./ownedDebuggerCleanupError.js";
/** Structured facts a limit error exposes. The sentence is display text. */
export const debuggerAdmissionDiagnostics = (admission) => ({
    setting: admission.setting,
    effective_value: admission.value,
    source: admission.source,
    default_value: admission.defaultValue,
    minimum: admission.minimum,
    maximum: admission.maximum,
    unit: admission.unit,
    restart_required: true,
});
/** Name the setting, the effective value, its source, the range, and a restart. */
export const debuggerAdmissionRecovery = (admission) => `The effective ${admission.setting} value is ${String(admission.value)} ${admission.unit} (source ${admission.source}; default ${String(admission.defaultValue)} ${admission.unit}, floor ${String(admission.minimum)} ${admission.unit}, maximum ${String(admission.maximum)} ${admission.unit}). Set ${admission.setting} in the environment that starts REA to a positive decimal integer from ${String(admission.minimum)} to ${String(admission.maximum)}, then restart REA.`;
/** Fixed startup deadline. Distinct from the shared command deadline setting. */
export const fixedDeadlineGuidance = (what, timeoutMs) => ({
    userMessage: `${what} reached its ${String(timeoutMs)} ms deadline (deadlineExpired). This release has no runtime override.`,
    remediationAction: `This ${String(timeoutMs)} ms deadline has no runtime override. Allow execution, cleanup and delivery headroom in the outer MCP client deadline. Confirm outstanding work and cleanup before retrying.`,
});
/** Shared command deadline. The setting, not a per-provider constant, owns the cap. */
export const configurableDeadlineGuidance = (what, admission) => {
    const recovery = debuggerAdmissionRecovery(admission);
    return {
        userMessage: `${what} reached its ${String(admission.value)} ms deadline (deadlineExpired). ${recovery}`,
        remediationAction: recovery,
        diagnostics: debuggerAdmissionDiagnostics(admission),
    };
};
/** Capacity refusal whose projection carries the setting, value, source, and range. */
export const debuggerResourceConstraintError = (operation, resource, summary, remediation, admission, reported) => {
    const facts = debuggerAdmissionDiagnostics(admission);
    const recovery = debuggerAdmissionRecovery(admission);
    return new AnalysisResourceConstraintError(operation, resource, `${summary} ${recovery}`, { ...facts, ...reported }, {
        remediationAction: `${remediation} ${recovery}`,
        diagnostics: facts,
    });
};
const DETACH_TIMEOUT_MS = 1_000;
const MAX_LATE_DEBUGGER_OUTPUT_BYTES = 64 * 1024;
/** Read one Linux identity; absence is distinct from unreadable or malformed data. */
export const readLinuxProcessStartTime = async (pid) => {
    if (process.platform !== "linux")
        throw new Error("Inferior process identity verification requires Linux /proc.");
    let stat;
    try {
        stat = await readFile(`/proc/${pid}/stat`, "utf8");
    }
    catch (cause) {
        if (typeof cause === "object" &&
            cause !== null &&
            "code" in cause &&
            cause.code === "ENOENT")
            return null;
        throw cause;
    }
    const parsed = parseLinuxProcessStat(stat);
    if (parsed === undefined || parsed.pid !== Number(pid))
        throw new Error(`Inferior PID ${pid} has an unreadable process identity.`);
    return parsed.startTime;
};
/** Confirm only that every previously identified inferior process has ended. */
export const verifyOwnedInferiorsEnded = async (identities, readStartTime = readLinuxProcessStartTime) => {
    let foundIdentity = false;
    for (const identity of identities) {
        foundIdentity = true;
        const observed = await readStartTime(identity.pid);
        if (observed === identity.startTime)
            return false;
    }
    return foundIdentity;
};
const detachAttempts = new WeakMap();
const detachOutcomes = new WeakMap();
const isVerifiedDetachResult = (result) => typeof result === "object" &&
    result !== null &&
    (("status" in result && result.status === "no-inferior") ||
        ("status" in result &&
            result.status === "detached" &&
            "outputSink" in result &&
            result.outputSink === "durable"));
const waitForInferiorDetach = async (session, detach) => {
    let attempt = detachAttempts.get(session);
    if (attempt === undefined) {
        // Providers may use `this` to access their command transport.
        const pending = Promise.resolve().then(() => detach.call(session));
        const tracked = pending.then((result) => {
            detachAttempts.delete(session);
            detachOutcomes.set(session, isVerifiedDetachResult(result) ? "confirmed" : "unconfirmed");
            return result;
        }, (cause) => {
            detachAttempts.delete(session);
            detachOutcomes.set(session, "unconfirmed");
            throw cause;
        });
        attempt = tracked;
        detachAttempts.set(session, tracked);
    }
    let timer;
    try {
        return await Promise.race([
            attempt,
            new Promise((resolve) => {
                timer = setTimeout(() => resolve(undefined), DETACH_TIMEOUT_MS);
            }),
        ]);
    }
    finally {
        clearTimeout(timer);
    }
};
const finishExitedDebuggerSession = async (session, debuggerName, platform, status) => {
    try {
        session.supervisor.limitAdditionalOutputBytes(MAX_LATE_DEBUGGER_OUTPUT_BYTES);
        if (!(await session.supervisor.waitForOutputClose(1_000))) {
            return {
                status: "incomplete",
                reason: platform === "win32"
                    ? `Owned ${debuggerName} process leader exited, but its Windows Job Object still has active descendants or has not reported settlement.`
                    : `Owned ${debuggerName} process leader exited, but inherited output streams are still open or have not reported settlement.`,
            };
        }
    }
    catch (cause) {
        return {
            status: "incomplete",
            reason: platform === "win32"
                ? `Owned ${debuggerName} Windows Job Object settlement could not be verified: ${cause instanceof Error ? cause.message : String(cause)}`
                : `Owned ${debuggerName} inherited output stream settlement could not be verified: ${cause instanceof Error ? cause.message : String(cause)}`,
        };
    }
    if (platform !== "win32")
        session.supervisor.unrefOutputStreams();
    session.supervisor.dispose();
    return { status };
};
/**
 * Stop only the directly owned debugger process, never its process group or target.
 * The caller must permanently close command admission before the first attempt;
 * retries retain completed detach facts while process termination is pending.
 */
export const stopOwnedDebuggerProcess = async (session, debuggerName, options = {}) => {
    const platform = options.platform ?? process.platform;
    if (session.exited) {
        if (detachAttempts.has(session))
            return {
                status: "incomplete",
                reason: `Owned ${debuggerName} inferior detach is still pending after the process exited.`,
            };
        const detachOutcome = detachOutcomes.get(session);
        if (detachOutcome === "unconfirmed" ||
            (detachOutcome === undefined && session.inferiorStateUnknown?.() === true)) {
            try {
                if ((await session.verifyInferiorsEndedAfterExit?.()) !== true)
                    return {
                        status: "incomplete",
                        reason: `Owned ${debuggerName} inferior disposition was not verified before the debugger exited, and no owner proof confirms the identified inferior processes have ended.`,
                    };
                detachOutcomes.set(session, "inferior-ended");
            }
            catch (cause) {
                return {
                    status: "incomplete",
                    reason: `Owned ${debuggerName} inferior process identity could not be verified after debugger exit: ${cause instanceof Error ? cause.message : String(cause)}`,
                };
            }
        }
        return finishExitedDebuggerSession(session, debuggerName, platform, "already_exited");
    }
    if (platform === "win32")
        return {
            status: "incomplete",
            reason: `Owned ${debuggerName} process cannot be stopped safely on Windows because job termination can also terminate its inferior processes.`,
        };
    // Admission remains closed once cleanup starts. A verified detach is an
    // owned completion fact, even when terminating the debugger later fails.
    // Retrying the command transport can no longer improve that fact and may
    // block termination if shutdown already made the transport unavailable.
    if (detachOutcomes.get(session) !== "confirmed") {
        try {
            if (session.detachInferior === undefined) {
                detachOutcomes.set(session, "unconfirmed");
                return {
                    status: "incomplete",
                    reason: `Owned ${debuggerName} inferior detach cannot be verified because the provider has no detach capability.`,
                };
            }
            const detached = await waitForInferiorDetach(session, session.detachInferior);
            if (detached === undefined)
                return {
                    status: "incomplete",
                    reason: `Owned ${debuggerName} inferior detach was not verified within ${String(DETACH_TIMEOUT_MS)} ms. This release has no runtime override.`,
                };
            if (!isVerifiedDetachResult(detached)) {
                detachOutcomes.set(session, "unconfirmed");
                return {
                    status: "incomplete",
                    reason: `Owned ${debuggerName} provider did not confirm no inferior or detachment with a durable output sink.`,
                };
            }
            detachOutcomes.set(session, "confirmed");
        }
        catch (cause) {
            return {
                status: "incomplete",
                reason: `Owned ${debuggerName} inferior detach could not be verified: ${cause instanceof Error ? cause.message : String(cause)}`,
            };
        }
    }
    session.launched.process.kill("SIGTERM");
    if (!(await session.supervisor.waitForExit(300))) {
        session.launched.process.kill("SIGKILL");
        const exitedAfterKill = await session.supervisor.waitForExit(1_000);
        if (exitedAfterKill)
            return finishExitedDebuggerSession(session, debuggerName, platform, "stopped");
        return {
            status: "incomplete",
            reason: `Owned ${debuggerName} process did not exit after direct termination.`,
        };
    }
    return finishExitedDebuggerSession(session, debuggerName, platform, "stopped");
};
/**
 * Stop every owned session and retain failed sessions for possible recovery.
 * Callers must block replacement admission and drain in-flight starts until
 * this settles; incomplete cleanup leaves the old owner in the map for retry.
 *
 * Closing all sessions means their owner is finishing, so a retained session
 * stops holding the host's event loop, as a supervised provider does after
 * incomplete cleanup. Ownership in this process is unchanged, and a retry
 * restores the references.
 */
export const closeOwnedDebuggerSessions = async (sessions, stop, debuggerName) => {
    const entries = [...sessions.entries()];
    for (const [, session] of entries)
        session.supervisor.ref();
    const results = await Promise.allSettled(entries.map(async ([, session]) => stop(session)));
    const failures = [];
    const retained = [];
    for (const [index, settled] of results.entries()) {
        const [key, session] = entries[index];
        if (settled.status === "rejected") {
            failures.push(settled.reason instanceof Error
                ? settled.reason
                : new Error(String(settled.reason)));
            retained.push(session);
        }
        else if (settled.value.status === "incomplete") {
            failures.push(new Error(settled.value.reason));
            retained.push(session);
        }
        else if (sessions.get(key) === session)
            sessions.delete(key);
    }
    if (failures.length === 0)
        return;
    for (const session of retained)
        session.supervisor.unref();
    throw new OwnedDebuggerCleanupError(failures, `One or more owned ${debuggerName} processes did not stop cleanly`, retained.flatMap(({ launched }) => launched.process.pid ?? []));
};
