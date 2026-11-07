import { execFile, spawn, } from "node:child_process";
/** How long a stopped process may take to exit before it is killed. */
const STOP_GRACE_MS = 5_000;
/** Cancellation observed by the command owner, with the caller's exact reason. */
export class ExecFileOutputCancelledError extends Error {
    _tag = "ExecFileOutputCancelledError";
    code = "ABORT_ERR";
    constructor(reason) {
        super("The operation was aborted", { cause: reason });
        this.name = "AbortError";
    }
}
/**
 * A command stopped at its timeout can still exit cleanly, so the timeout is
 * the failure. Like Node's execFile timeout, it reports `killed: true`.
 */
const timeoutError = (command, timeout, exit) => {
    const error = new Error(`Command timed out after ${String(timeout)} ms: ${command}`, exit === null ? undefined : { cause: exit });
    Reflect.set(error, "code", "ETIMEDOUT");
    Reflect.set(error, "killed", true);
    Reflect.set(error, "signal", exit === null ? null : (Reflect.get(exit, "signal") ?? null));
    return error;
};
/**
 * The `timeout` contract for both modes, checked before spawning. A stoppable
 * command keeps its own deadline, so execFile never validates it. Node 26's
 * execFile also caps it at Number.MAX_SAFE_INTEGER; Node 22 and 24 accept
 * larger integers, which their timers then clamp to 1 ms.
 */
const invalidTimeout = (timeout) => {
    if (Number.isSafeInteger(timeout) && timeout >= 0)
        return undefined;
    const error = new RangeError(`The value of "timeout" is out of range. It must be an unsigned integer. Received ${String(timeout)}`);
    Reflect.set(error, "code", "ERR_OUT_OF_RANGE");
    return error;
};
/** Read captured output metadata from a failed execFileOutput invocation. */
export const execFileOutputFailure = (cause) => {
    if (!(cause instanceof Error))
        return undefined;
    const stdout = Reflect.get(cause, "stdout");
    const stderr = Reflect.get(cause, "stderr");
    const code = Reflect.get(cause, "code");
    const signal = Reflect.get(cause, "signal");
    const killed = Reflect.get(cause, "killed");
    const outputTruncated = Reflect.get(cause, "outputTruncated");
    const stdoutBytes = Reflect.get(cause, "stdoutBytes");
    const stderrBytes = Reflect.get(cause, "stderrBytes");
    const collectionFailure = Reflect.get(cause, "collectionFailure");
    const spawnFailed = Reflect.get(cause, "spawnFailed");
    if (typeof stdout !== "string" || typeof stderr !== "string")
        return undefined;
    return {
        stdout,
        stderr,
        ...(typeof stdoutBytes === "number" &&
            Number.isSafeInteger(stdoutBytes) &&
            stdoutBytes >= 0
            ? { stdoutBytes }
            : {}),
        ...(typeof stderrBytes === "number" &&
            Number.isSafeInteger(stderrBytes) &&
            stderrBytes >= 0
            ? { stderrBytes }
            : {}),
        code: typeof code === "string" || typeof code === "number" ? code : null,
        signal: typeof signal === "string" ? signal : null,
        killed: killed === true,
        outputTruncated: outputTruncated === true || code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER",
        ...(collectionFailure === true ? { collectionFailure: true } : {}),
        ...(spawnFailed === true ? { spawnFailed: true } : {}),
    };
};
/** Spawn errnos reporting exhausted host capacity rather than an unusable command. */
const HOST_SPAWN_CAPACITY_CODES = new Set([
    "EAGAIN",
    "EMFILE",
    "ENFILE",
    "ENOMEM",
]);
/**
 * Whether the command never started because the host lacked process, memory
 * or file-descriptor capacity. The command itself may be usable; a retry after
 * capacity is freed can succeed.
 */
export const spawnCapacityExhausted = (failure) => failure?.spawnFailed === true &&
    typeof failure.code === "string" &&
    HOST_SPAWN_CAPACITY_CODES.has(failure.code);
/** Project admitted command failure facts without reinterpreting failure policy. */
export const execFileFailureCapturedOutput = (failure) => ({
    stdout: failure.stdout,
    stderr: failure.stderr,
    ...(failure.stdoutBytes === undefined
        ? {}
        : { stdout_bytes: failure.stdoutBytes }),
    ...(failure.stderrBytes === undefined
        ? {}
        : { stderr_bytes: failure.stderrBytes }),
    exit_code: typeof failure.code === "number" ? failure.code : null,
    signal: failure.signal,
    truncated: failure.outputTruncated,
});
/**
 * Mark an errno failure from starting the process, which Node reports as
 * `syscall: "spawn"` when thrown synchronously and `spawn <path>` when
 * emitted. Argument validation errors carry no errno.
 */
const admitSpawnFailure = (error) => {
    const syscall = Reflect.get(error, "syscall");
    if (typeof Reflect.get(error, "errno") !== "number" ||
        typeof syscall !== "string" ||
        !(syscall === "spawn" || syscall.startsWith("spawn ")))
        return false;
    Reflect.set(error, "spawnFailed", true);
    return true;
};
/** Run a shell-free command with no input while capturing its complete output bytes. */
export const execFileBytes = (command, arguments_, options = {}) => new Promise((resolve, reject) => {
    const { stopSignal, signal, timeout, lifetimePipe, ...execOptions } = options;
    if (lifetimePipe === true && stopSignal === undefined) {
        reject(new TypeError("lifetimePipe requires stopSignal"));
        return;
    }
    const invalid = timeout === undefined ? undefined : invalidTimeout(timeout);
    if (invalid !== undefined) {
        reject(invalid);
        return;
    }
    if (stopSignal !== undefined && signal?.aborted === true) {
        reject(new ExecFileOutputCancelledError(signal.reason));
        return;
    }
    const complete = (error, stdout, stderr) => {
        if (error !== null) {
            admitSpawnFailure(error);
            Reflect.set(error, "stdout", stdout.toString("utf8"));
            Reflect.set(error, "stderr", stderr.toString("utf8"));
            Reflect.set(error, "stdoutBytes", stdout.byteLength);
            Reflect.set(error, "stderrBytes", stderr.byteLength);
            reject(error);
            return;
        }
        resolve({ stdout, stderr });
    };
    try {
        if (stopSignal === undefined) {
            const child = execFile(command, [...arguments_], {
                ...execOptions,
                ...(signal === undefined ? {} : { signal }),
                ...(timeout === undefined ? {} : { timeout }),
                encoding: "buffer",
                maxBuffer: options.maxBuffer ?? Number.POSITIVE_INFINITY,
            }, (error, stdout, stderr) => complete(error?.name === "AbortError" && error.code === "ABORT_ERR"
                ? new ExecFileOutputCancelledError(error.cause)
                : error, stdout, stderr));
            // This promise API exposes no input writer; EOF belongs to the owner.
            child.stdin?.end();
            return;
        }
        startStoppableCommand(command, arguments_, { ...options, stopSignal }, complete);
    }
    catch (error) {
        // Node throws spawn errors other than EACCES, EAGAIN, EMFILE, ENFILE and
        // ENOENT (for example ENOTDIR, EPERM or ENOMEM) synchronously. No
        // process started, so a spawn errno completes with the same empty
        // capture an asynchronous spawn failure carries; argument validation
        // errors stay unadmitted.
        if (error instanceof Error && admitSpawnFailure(error))
            complete(error, Buffer.alloc(0), Buffer.alloc(0));
        else
            reject(error);
    }
});
/** Own stop requests and bounded capture until the root and inherited pipes close. */
const startStoppableCommand = (command, arguments_, options, complete) => {
    const { stopSignal, signal, timeout, lifetimePipe, ...execOptions } = options;
    const maxBuffer = options.maxBuffer ?? Number.POSITIVE_INFINITY;
    if (typeof maxBuffer !== "number" || !(maxBuffer >= 0)) {
        const error = new RangeError("maxBuffer must be a nonnegative number");
        Reflect.set(error, "code", "ERR_OUT_OF_RANGE");
        throw error;
    }
    let stopped;
    let processError = null;
    let rootFailed = false;
    let outputError;
    let deadline;
    let grace;
    // Node's execFile destroys both pipes when maxBuffer is exceeded. Own
    // bounded capture here so overflow stops the root without discarding the
    // pipe lifetime of descendants still using caller-owned temporary files.
    const child = spawn(command, [...arguments_], {
        ...execOptions,
        stdio: lifetimePipe === true
            ? ["ignore", "pipe", "pipe", "pipe"]
            : ["ignore", "pipe", "pipe"],
        killSignal: stopSignal,
    });
    child.on("error", (error) => {
        processError ??= error;
    });
    // After an EMFILE or ENFILE spawn failure Node creates no stdio and reports
    // the failure only through the error and close events.
    const stdio = child.stdio;
    if (lifetimePipe === true) {
        const pipe = stdio?.[3];
        if (pipe != null && "resume" in pipe)
            pipe.resume();
    }
    // The first stop request names the failure; a later one is not resent.
    const stop = (reason) => {
        if (stopped !== undefined || rootFailed || processError !== null)
            return;
        stopped = reason;
        child.kill(stopSignal);
        grace = setTimeout(() => child.kill("SIGKILL"), STOP_GRACE_MS);
    };
    const onAbort = () => {
        stop("abort");
    };
    const capture = (stream, name) => {
        const chunks = [];
        let retained = 0;
        stream?.on("data", (chunk) => {
            const remaining = Math.max(0, Math.floor(maxBuffer - retained));
            if (chunk.byteLength <= remaining) {
                chunks.push(chunk);
                retained += chunk.byteLength;
                return;
            }
            if (remaining > 0) {
                chunks.push(Buffer.from(chunk.subarray(0, remaining)));
                retained += remaining;
            }
            if (outputError === undefined) {
                outputError = new RangeError(`${name} maxBuffer length exceeded`);
                Reflect.set(outputError, "code", "ERR_CHILD_PROCESS_STDIO_MAXBUFFER");
                stop("output-limit");
            }
        });
        return () => Buffer.concat(chunks, retained);
    };
    const stdout = capture(stdio?.[1], "stdout");
    const stderr = capture(stdio?.[2], "stderr");
    child.on("exit", (code, exitSignal) => {
        // A failed root has completed its outcome even while descendants retain
        // its pipes. Finalization cancellation cannot replace that failure.
        rootFailed = code !== 0 || exitSignal !== null;
    });
    child.on("close", (code, exitSignal) => {
        signal?.removeEventListener("abort", onAbort);
        clearTimeout(deadline);
        clearTimeout(grace);
        const out = stdout();
        const diagnostic = stderr();
        const invocation = [command, ...arguments_].join(" ");
        if (processError === null && (code !== 0 || exitSignal !== null)) {
            processError = new Error(`Command failed: ${invocation}\n${diagnostic.toString("utf8")}`);
            Reflect.set(processError, "code", code);
            Reflect.set(processError, "signal", exitSignal);
            Reflect.set(processError, "killed", child.killed);
        }
        if (processError !== null)
            Reflect.set(processError, "cmd", invocation);
        if (outputError !== undefined)
            Reflect.set(outputError, "cmd", invocation);
        const failure = stopped === "abort" && signal !== undefined
            ? new ExecFileOutputCancelledError(signal.reason)
            : stopped === "timeout" && timeout !== undefined
                ? timeoutError(command, timeout, processError)
                : rootFailed && stopped === undefined
                    ? processError
                    : (outputError ?? processError);
        if (failure !== null && outputError !== undefined)
            Reflect.set(failure, "outputTruncated", true);
        complete(failure, out, diagnostic);
    });
    signal?.addEventListener("abort", onAbort, { once: true });
    if (timeout !== undefined && timeout > 0)
        deadline = setTimeout(() => {
            stop("timeout");
        }, timeout);
};
/** Run a shell-free command while capturing its complete UTF-8 output. */
export const execFileOutput = (command, arguments_, options = {}) => execFileBytes(command, arguments_, options).then(({ stdout, stderr }) => ({
    stdout: stdout.toString("utf8"),
    stderr: stderr.toString("utf8"),
    stdoutBytes: stdout.byteLength,
    stderrBytes: stderr.byteLength,
}));
