import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { cn as MAX_NODE_TIMER_DELAY_MS, ln as init_analysisResourceLimits, sn as MAX_GHIDRA_DECOMPILE_TIMEOUT_SECONDS } from "./analysisErrorProjection-B_6dTGtM.js";
import { z } from "zod";
import { execFile, spawn } from "node:child_process";

//#region dist/process/snapshotEnvironment.js
var mergeEnvironmentOverrides, snapshotEnvironment;
function init_snapshotEnvironment() {
	return (init_snapshotEnvironment = __esmMin((() => {
		mergeEnvironmentOverrides = (existing, overrides, platform = process.platform) => {
			const selected = new Map();
			for (const layer of [existing, overrides]) for (const [key, value] of Object.entries(layer)) selected.set(platform === "win32" ? key.toUpperCase() : key, [key, value]);
			return Object.freeze(Object.fromEntries(selected.values()));
		};
		snapshotEnvironment = (environment, platform = process.platform) => {
			const selected = mergeEnvironmentOverrides({}, environment, platform);
			if (platform !== "win32") return selected;
			return Object.freeze(Object.fromEntries(Object.entries(selected).map(([key, value]) => [key.toUpperCase(), value]).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)));
		};
	})))();
}

//#endregion
//#region dist/config/providerStartupTimeout.js
var DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS, ghidraDecompileTimeoutSchema, providerStartupTimeoutSchema;
function init_providerStartupTimeout() {
	return (init_providerStartupTimeout = __esmMin((() => {
		init_analysisResourceLimits();
		DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS = 12e4;
		ghidraDecompileTimeoutSchema = z.string().regex(/^[1-9]\d*$/u, "must be a positive decimal integer").transform(Number).pipe(z.number().int().min(1).max(MAX_GHIDRA_DECOMPILE_TIMEOUT_SECONDS));
		providerStartupTimeoutSchema = z.string().regex(/^[1-9]\d*$/u, "must be a positive decimal integer").transform(Number).pipe(z.int().min(1).max(MAX_NODE_TIMER_DELAY_MS));
	})))();
}

//#endregion
//#region dist/process/ExecFileOutput.js
var STOP_GRACE_MS, ExecFileOutputCancelledError, timeoutError, invalidTimeout, execFileOutputFailure, HOST_SPAWN_CAPACITY_CODES, spawnCapacityExhausted, execFileFailureCapturedOutput, admitSpawnFailure, execFileBytes, startStoppableCommand, execFileOutput;
function init_ExecFileOutput() {
	return (init_ExecFileOutput = __esmMin((() => {
		STOP_GRACE_MS = 5e3;
		ExecFileOutputCancelledError = class extends Error {
			_tag = "ExecFileOutputCancelledError";
			code = "ABORT_ERR";
			constructor(reason) {
				super("The operation was aborted", { cause: reason });
				this.name = "AbortError";
			}
		};
		timeoutError = (command, timeout, exit) => {
			const error = new Error(`Command timed out after ${String(timeout)} ms: ${command}`, exit === null ? undefined : { cause: exit });
			Reflect.set(error, "code", "ETIMEDOUT");
			Reflect.set(error, "killed", true);
			Reflect.set(error, "signal", exit === null ? null : Reflect.get(exit, "signal") ?? null);
			return error;
		};
		invalidTimeout = (timeout) => {
			if (Number.isSafeInteger(timeout) && timeout >= 0) return undefined;
			const error = new RangeError(`The value of "timeout" is out of range. It must be an unsigned integer. Received ${String(timeout)}`);
			Reflect.set(error, "code", "ERR_OUT_OF_RANGE");
			return error;
		};
		execFileOutputFailure = (cause) => {
			if (!(cause instanceof Error)) return undefined;
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
			if (typeof stdout !== "string" || typeof stderr !== "string") return undefined;
			return {
				stdout,
				stderr,
				...typeof stdoutBytes === "number" && Number.isSafeInteger(stdoutBytes) && stdoutBytes >= 0 ? { stdoutBytes } : {},
				...typeof stderrBytes === "number" && Number.isSafeInteger(stderrBytes) && stderrBytes >= 0 ? { stderrBytes } : {},
				code: typeof code === "string" || typeof code === "number" ? code : null,
				signal: typeof signal === "string" ? signal : null,
				killed: killed === true,
				outputTruncated: outputTruncated === true || code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER",
				...collectionFailure === true ? { collectionFailure: true } : {},
				...spawnFailed === true ? { spawnFailed: true } : {}
			};
		};
		HOST_SPAWN_CAPACITY_CODES = new Set([
			"EAGAIN",
			"EMFILE",
			"ENFILE",
			"ENOMEM"
		]);
		spawnCapacityExhausted = (failure) => failure?.spawnFailed === true && typeof failure.code === "string" && HOST_SPAWN_CAPACITY_CODES.has(failure.code);
		execFileFailureCapturedOutput = (failure) => ({
			stdout: failure.stdout,
			stderr: failure.stderr,
			...failure.stdoutBytes === undefined ? {} : { stdout_bytes: failure.stdoutBytes },
			...failure.stderrBytes === undefined ? {} : { stderr_bytes: failure.stderrBytes },
			exit_code: typeof failure.code === "number" ? failure.code : null,
			signal: failure.signal,
			truncated: failure.outputTruncated
		});
		admitSpawnFailure = (error) => {
			const syscall = Reflect.get(error, "syscall");
			if (typeof Reflect.get(error, "errno") !== "number" || typeof syscall !== "string" || !(syscall === "spawn" || syscall.startsWith("spawn "))) return false;
			Reflect.set(error, "spawnFailed", true);
			return true;
		};
		execFileBytes = (command, arguments_, options = {}) => new Promise((resolve, reject) => {
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
				resolve({
					stdout,
					stderr
				});
			};
			try {
				if (stopSignal === undefined) {
					const child = execFile(command, [...arguments_], {
						...execOptions,
						...signal === undefined ? {} : { signal },
						...timeout === undefined ? {} : { timeout },
						encoding: "buffer",
						maxBuffer: options.maxBuffer ?? Number.POSITIVE_INFINITY
					}, (error, stdout, stderr) => complete(error?.name === "AbortError" && error.code === "ABORT_ERR" ? new ExecFileOutputCancelledError(error.cause) : error, stdout, stderr));
					child.stdin?.end();
					return;
				}
				startStoppableCommand(command, arguments_, {
					...options,
					stopSignal
				}, complete);
			} catch (error) {
				if (error instanceof Error && admitSpawnFailure(error)) complete(error, Buffer.alloc(0), Buffer.alloc(0));
				else reject(error);
			}
		});
		startStoppableCommand = (command, arguments_, options, complete) => {
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
			const child = spawn(command, [...arguments_], {
				...execOptions,
				stdio: lifetimePipe === true ? [
					"ignore",
					"pipe",
					"pipe",
					"pipe"
				] : [
					"ignore",
					"pipe",
					"pipe"
				],
				killSignal: stopSignal
			});
			child.on("error", (error) => {
				processError ??= error;
			});
			const stdio = child.stdio;
			if (lifetimePipe === true) {
				const pipe = stdio?.[3];
				if (pipe != null && "resume" in pipe) pipe.resume();
			}
			const stop = (reason) => {
				if (stopped !== undefined || rootFailed || processError !== null) return;
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
				if (processError !== null) Reflect.set(processError, "cmd", invocation);
				if (outputError !== undefined) Reflect.set(outputError, "cmd", invocation);
				const failure = stopped === "abort" && signal !== undefined ? new ExecFileOutputCancelledError(signal.reason) : stopped === "timeout" && timeout !== undefined ? timeoutError(command, timeout, processError) : rootFailed && stopped === undefined ? processError : outputError ?? processError;
				if (failure !== null && outputError !== undefined) Reflect.set(failure, "outputTruncated", true);
				complete(failure, out, diagnostic);
			});
			signal?.addEventListener("abort", onAbort, { once: true });
			if (timeout !== undefined && timeout > 0) deadline = setTimeout(() => {
				stop("timeout");
			}, timeout);
		};
		execFileOutput = (command, arguments_, options = {}) => execFileBytes(command, arguments_, options).then(({ stdout, stderr }) => ({
			stdout: stdout.toString("utf8"),
			stderr: stderr.toString("utf8"),
			stdoutBytes: stdout.byteLength,
			stderrBytes: stderr.byteLength
		}));
	})))();
}

//#endregion
export { execFileOutputFailure as a, DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS as c, providerStartupTimeoutSchema as d, init_snapshotEnvironment as f, execFileOutput as i, ghidraDecompileTimeoutSchema as l, snapshotEnvironment as m, execFileBytes as n, init_ExecFileOutput as o, mergeEnvironmentOverrides as p, execFileFailureCapturedOutput as r, spawnCapacityExhausted as s, ExecFileOutputCancelledError as t, init_providerStartupTimeout as u };