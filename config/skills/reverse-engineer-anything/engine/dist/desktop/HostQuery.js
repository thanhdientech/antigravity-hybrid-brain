import { execFileOutput, execFileOutputFailure, } from "../process/ExecFileOutput.js";
const COMMAND_TIMEOUT_MS = 30_000;
const COMMAND_MAX_BUFFER = 4 * 1024 * 1024;
/** Run a query command with a bounded time and output. */
export const runHostQuery = async (command, arguments_, signal) => {
    try {
        const { stdout } = await execFileOutput(command, arguments_, {
            timeout: COMMAND_TIMEOUT_MS,
            maxBuffer: COMMAND_MAX_BUFFER,
            ...(signal === undefined ? {} : { signal }),
        });
        return { stdout, exitCode: 0 };
    }
    catch (cause) {
        signal?.throwIfAborted();
        const failure = execFileOutputFailure(cause);
        if (failure?.code === "ENOENT")
            return "missing";
        return typeof failure?.code === "number" &&
            !failure.killed &&
            !failure.outputTruncated
            ? { stdout: failure.stdout, exitCode: failure.code }
            : "failed";
    }
};
/** The output of a query that exited 0. */
export const succeeded = (outcome) => typeof outcome === "object" && outcome.exitCode === 0
    ? outcome.stdout
    : undefined;
