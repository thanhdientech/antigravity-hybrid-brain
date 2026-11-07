import { liveProcesses } from "./ProcessOwnershipProcessTree.js";
/** Structured native token availability, distinct from failed reads and caller cancellation. */
export class ProcessRunTokenReadError extends Error {
    pid;
    availability;
    reason;
    _tag = "ProcessRunTokenReadError";
    constructor(pid, availability, reason) {
        super(`Run token for PID ${String(pid)}: ${reason}`);
        this.pid = pid;
        this.availability = availability;
        this.reason = reason;
        this.name = "ProcessRunTokenReadError";
    }
}
const errorMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
/** Only a variable observed on this process supplies its run token. */
export const processRunIdFromEnvironment = (environment) => Object.hasOwn(environment, "REA_PROCESS_RUN_ID")
    ? environment.REA_PROCESS_RUN_ID
    : undefined;
/** Read only ownership tokens, using per-process fallback for missing batch rows. */
export async function* readProcessRunTokens(host, processes, signal) {
    signal?.throwIfAborted();
    if (processes.length === 0)
        return;
    let batch;
    let batchFailure;
    if (host.runTokens !== undefined) {
        try {
            batch =
                signal === undefined
                    ? await host.runTokens(processes)
                    : await host.runTokens(processes, signal);
        }
        catch (cause) {
            signal?.throwIfAborted();
            batchFailure = errorMessage(cause);
        }
    }
    for (const process of processes) {
        signal?.throwIfAborted();
        let observation = batch?.get(process.pid);
        if (observation === undefined) {
            try {
                const environment = signal === undefined
                    ? await host.environment(process.pid)
                    : await host.environment(process.pid, signal);
                observation = {
                    state: "readable",
                    runId: processRunIdFromEnvironment(environment),
                };
            }
            catch (cause) {
                signal?.throwIfAborted();
                const reason = errorMessage(cause);
                const code = cause instanceof Error &&
                    "code" in cause &&
                    typeof cause.code === "string"
                    ? cause.code
                    : undefined;
                observation = {
                    state: "unavailable",
                    ...(code === undefined ? {} : { code }),
                    reason: batchFailure === undefined
                        ? reason
                        : `${reason}; run-token batch failed: ${batchFailure}`,
                };
            }
        }
        signal?.throwIfAborted();
        yield { process, observation };
    }
}
/**
 * Live processes in the current process table that expose this run token.
 * A process whose token cannot be read is left out, so the list proves
 * presence only; it does not prove that no other carrier exists.
 */
export const readRunTokenCarriers = async (host, runId, signal) => {
    const carriers = [];
    const processes = liveProcesses(signal === undefined
        ? await host.listProcesses()
        : await host.listProcesses(signal));
    for await (const { process, observation } of readProcessRunTokens(host, processes, signal))
        if (observation.state === "readable" && observation.runId === runId)
            carriers.push(process);
    return carriers;
};
