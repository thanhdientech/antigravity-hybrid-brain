import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { X as init_providerAdapterError, Y as ProviderAdapterError } from "./analysisErrorProjection-B_6dTGtM.js";
import { f as init_analysisErrorCore, n as AnalysisAccessDeniedError, r as AnalysisArtifactChangedError } from "./analysisErrorCore-BCqhUcUc.js";
import { C as ArtifactReaderFailure, D as init_ArtifactReader } from "./OwnedRegularFile-CufsBAJJ.js";
import { n as init_ProviderDeadline, r as waitForAbortableDelay, t as ProviderStartupDeadline } from "./ProviderDeadline-BHJfBmfF.js";
import { l as init_ArtifactFileOperation, o as artifactSelectedPathErrno, s as assertArtifactReadActive } from "./ArtifactFileOperation-cr4zEunz.js";
import { C as DarwinProcessOwnershipInspectionError, T as init_DarwinProcessRunTokenReader, g as systemProcessOwnershipHost, l as init_ProcessOwnershipObservation, m as prepareProcessOwnershipInspection, r as init_ProcessOwnership, t as cleanupOwnedProcessGroup } from "./ProcessOwnership-DPTLd85r.js";
import { n as init_ProviderProcess, r as spawnOwnedProviderProcess, t as ProviderProcessSupervisor } from "./ProviderProcess-Btnq1dLp.js";
import { realpath } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable, finished as finished$1 } from "node:stream";

//#region dist/filesystem/readFileHandleChunks.js
var FileReadCancelled, readFileHandleChunks, fileOffset;
function init_readFileHandleChunks() {
	return (init_readFileHandleChunks = __esmMin((() => {
		FileReadCancelled = class extends Error {
			reason;
			constructor(reason) {
				super("File read cancelled", { cause: reason });
				this.reason = reason;
				this.name = "FileReadCancelled";
			}
		};
		readFileHandleChunks = (handle, options = {}) => {
			const start = fileOffset(options.start ?? 0);
			const unlimited = options.end === undefined || options.end === Infinity;
			const end = unlimited ? undefined : fileOffset(options.end);
			if (start === undefined || !unlimited && end === undefined || end !== undefined && end < start) throw new RangeError("Invalid file read range");
			let readPending = false;
			let totalBytes = 0n;
			let coverage;
			const cancellationFailure = () => options.cancellationFailure?.(options.signal?.reason) ?? new FileReadCancelled(options.signal?.reason);
			const assertActive = () => {
				if (options.signal?.aborted) throw cancellationFailure();
			};
			const source = Readable.from((async function* () {
				let position = start;
				while (end === undefined || position <= end) {
					assertActive();
					const remaining = end === undefined ? undefined : end - position + 1n;
					const chunk = Buffer.allocUnsafe(remaining === undefined || remaining > 64n * 1024n ? 64 * 1024 : Number(remaining));
					readPending = true;
					let bytesRead;
					try {
						({bytesRead} = await handle.read(chunk, 0, chunk.length, position));
					} finally {
						readPending = false;
					}
					totalBytes += BigInt(bytesRead);
					if (bytesRead === 0) coverage = Object.freeze({
						kind: "complete",
						bytes: totalBytes,
						boundary: "eof"
					});
					else if (end !== undefined && position + BigInt(bytesRead) > end) coverage = Object.freeze({
						kind: "complete",
						bytes: totalBytes,
						boundary: "range"
					});
					assertActive();
					if (bytesRead === 0) return;
					position += BigInt(bytesRead);
					yield chunk.subarray(0, bytesRead);
				}
			})(), { objectMode: false });
			const onAbort = () => {
				if (!readPending && !source.destroyed) source.destroy(cancellationFailure());
			};
			options.signal?.addEventListener("abort", onAbort, { once: true });
			source.once("close", () => options.signal?.removeEventListener("abort", onAbort));
			if (options.signal?.aborted) onAbort();
			return Object.assign(source, { readCoverage: () => coverage ?? Object.freeze({
				kind: "incomplete",
				bytes: totalBytes
			}) });
		};
		fileOffset = (value) => {
			if (typeof value === "bigint") return value >= 0n ? value : undefined;
			return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : undefined;
		};
	})))();
}

//#endregion
//#region dist/artifacts/readArtifactFileChunks.js
var readArtifactFileChunks;
function init_readArtifactFileChunks() {
	return (init_readArtifactFileChunks = __esmMin((() => {
		init_readFileHandleChunks();
		init_ArtifactReader();
		readArtifactFileChunks = (handle, options = {}) => readFileHandleChunks(handle, {
			...options,
			cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", "Artifact file read cancelled", { cause: reason })
		});
	})))();
}

//#endregion
//#region dist/process/AbortablePromise.js
var ABORTED, waitForAbortable;
function init_AbortablePromise() {
	return (init_AbortablePromise = __esmMin((() => {
		ABORTED = Symbol("aborted");
		waitForAbortable = async (pending, signal) => {
			if (signal === undefined) return pending;
			let onAbort;
			const cancelled = new Promise((resolve) => {
				if (signal.aborted) {
					resolve(ABORTED);
					return;
				}
				onAbort = () => resolve(ABORTED);
				signal.addEventListener("abort", onAbort, { once: true });
			});
			try {
				return await Promise.race([cancelled, pending]);
			} finally {
				if (onAbort !== undefined) signal.removeEventListener("abort", onAbort);
			}
		};
	})))();
}

//#endregion
//#region dist/process/OwnedCommand.js
/** Both preparation stages preserve physical failures, opaque cancellation and exact owners. */
function throwCommandPreparationFailure(cause, signal, interruption) {
	const preparationFailure = cause instanceof DarwinProcessOwnershipInspectionError && !(signal?.aborted === true && cause === signal.reason) ? cause : undefined;
	if (preparationFailure !== undefined && preparationFailure.cancellation === undefined) throw preparationFailure;
	if (interruption !== undefined) throw new OwnedCommandFailure(interruption, interruption === "cancelled" ? "Command cancelled during ownership preparation." : "Command deadline elapsed during ownership preparation.", null, null, {
		cause,
		...interruption === "cancelled" ? { cancellation: { reason: signal?.reason } } : {},
		...preparationFailure === undefined ? {} : { preparationFailure }
	});
	throw cause;
}
var OwnedCommandFailure, ownedCommandResources, prepareOwnedCommand, runOwnedCommand, collectOwnedCommand, finishCommandInput, consumeStdout;
function init_OwnedCommand() {
	return (init_OwnedCommand = __esmMin((() => {
		init_ProcessOwnershipObservation();
		init_DarwinProcessRunTokenReader();
		init_ProviderProcess();
		init_ProcessOwnership();
		init_AbortablePromise();
		init_ProviderDeadline();
		OwnedCommandFailure = class extends Error {
			reason;
			snapshot;
			cleanupFailure;
			resources;
			cleanupOwner;
			#cancellation;
			/** Opaque caller reason observed by the owner, distinct from physical causes. */
			get cancellation() {
				return this.#cancellation;
			}
			processError;
			cleanupResult;
			collectionFailure;
			preparationFailure;
			constructor(reason, message, snapshot = null, cleanupFailure = null, options, resources = [], cleanupOwner) {
				super(message, options);
				this.reason = reason;
				this.snapshot = snapshot;
				this.cleanupFailure = cleanupFailure;
				this.resources = resources;
				this.cleanupOwner = cleanupOwner;
				this.#cancellation = options?.cancellation === undefined ? undefined : { reason: options.cancellation.reason };
				this.processError = options?.processError;
				this.cleanupResult = options?.cleanupResult;
				this.collectionFailure = options?.collectionFailure ?? false;
				this.preparationFailure = options?.preparationFailure;
			}
		};
		ownedCommandResources = (ownership, directory) => [
			ownership.runId,
			...directory === undefined ? [] : [directory],
			`pid:${ownership.leaderPid}`,
			`process-group:${ownership.processGroupId}`
		];
		prepareOwnedCommand = async (signal) => {
			if (systemProcessOwnershipHost.platform !== "darwin") return;
			try {
				signal?.throwIfAborted();
				await prepareProcessOwnershipInspection(signal);
			} catch (cause) {
				throwCommandPreparationFailure(cause, signal, signal?.aborted === true ? "cancelled" : undefined);
			}
		};
		runOwnedCommand = async (spawn, limits, options = {}) => {
			const callerSignal = options.signal ?? spawn.signal;
			if (callerSignal?.aborted) throw new OwnedCommandFailure("cancelled", "Command cancelled before launch.", null, null, { cancellation: { reason: callerSignal.reason } });
			const deadline = limits.timeoutMs === null ? undefined : new ProviderStartupDeadline(limits.timeoutMs, callerSignal);
			const control = deadline ?? {
				signal: callerSignal ?? new AbortController().signal,
				get interruption() {
					return callerSignal?.aborted === true ? "cancelled" : undefined;
				}
			};
			try {
				return await collectOwnedCommand(spawn, limits, options.launcher ?? spawnOwnedProviderProcess, control, callerSignal, options.retainCleanup);
			} finally {
				deadline?.dispose();
			}
		};
		collectOwnedCommand = async (spawn, limits, launcher, deadline, callerSignal, retainCleanup) => {
			const signal = deadline.signal;
			let launched;
			try {
				launched = await launcher({
					...spawn,
					...limits.stdin === undefined ? {} : { stdin: "pipe" },
					signal
				});
			} catch (cause) {
				throwCommandPreparationFailure(cause, signal, deadline.interruption);
			}
			let exceeded = false;
			let outputLimitObservedBeforeInterruption = false;
			let processFailure;
			let processError;
			let processFailureCause;
			let processFailureBeforeInterruption;
			const supervisor = new ProviderProcessSupervisor({
				...launched,
				ownsProcessLifetime: true,
				cleanup: launched.cleanup ?? (() => cleanupOwnedProcessGroup(launched.ownership))
			}, {
				captureStdout: limits.stdout === undefined,
				maxDiagnosticBytes: limits.diagnosticBytes,
				onDiagnostic: (event) => {
					if (event.type === "output" && event.truncated === true) {
						exceeded = true;
						if (deadline.interruption === undefined) outputLimitObservedBeforeInterruption = true;
					}
					if (event.type === "error") {
						processFailure ??= event.message;
						processError ??= event.cause;
						if (deadline.interruption === undefined) processFailureBeforeInterruption ??= {
							message: processFailure,
							processError,
							collectionFailure: true
						};
					}
					if (event.type === "exit" && deadline.interruption === undefined) {
						const acceptedNonzeroExit = limits.acceptNonZeroExit === true && event.code !== null && event.code !== 0 && event.signal === null;
						if (event.signal !== null || event.code !== null && event.code !== 0 && !acceptedNonzeroExit) processFailureBeforeInterruption ??= {
							message: "Command failed; inspect its exit status and diagnostics.",
							processError: undefined,
							collectionFailure: false
						};
					}
				}
			});
			const abandoned = new AbortController();
			const collectionSignal = AbortSignal.any([signal, abandoned.signal]);
			const consumed = consumeStdout(launched.process.stdout, limits.stdout, collectionSignal);
			void consumed.then((failed) => {
				processFailure ??= failed;
				if (failed !== undefined && deadline.interruption === undefined) processFailureBeforeInterruption ??= {
					message: processFailure ?? failed,
					processError,
					collectionFailure: true
				};
			});
			let inputFailure;
			const inputCompleted = limits.stdin === "closed-pipe" ? finishCommandInput(launched.process.stdin, (cause) => {
				inputFailure ??= {
					cause,
					message: `stdin stream failed: ${cause instanceof Error ? cause.message : String(cause)}`,
					processError: cause instanceof Error ? cause : undefined
				};
				if (processFailure === undefined) {
					processFailure = inputFailure.message;
					processError = inputFailure.processError;
					processFailureCause = { cause: inputFailure.cause };
				}
				if (deadline.interruption === undefined) processFailureBeforeInterruption ??= {
					message: processFailure,
					...processFailureCause,
					processError,
					collectionFailure: true
				};
				abandoned.abort();
			}) : Promise.resolve();
			let failure;
			const interruptionOrObservedFailure = (interruption, snapshot = null) => {
				if (interruption === undefined) return;
				if (outputLimitObservedBeforeInterruption) return new OwnedCommandFailure("output-limit", "Command diagnostic output exceeded its complete-output budget.", snapshot);
				if (processFailureBeforeInterruption !== undefined) return new OwnedCommandFailure("process", processFailureBeforeInterruption.message, snapshot, null, {
					..."cause" in processFailureBeforeInterruption ? { cause: processFailureBeforeInterruption.cause } : {},
					processError: processFailureBeforeInterruption.processError,
					collectionFailure: processFailureBeforeInterruption.collectionFailure
				});
				return new OwnedCommandFailure(interruption, interruption === "cancelled" ? "Command cancelled." : "Command deadline elapsed.", snapshot, null, interruption === "cancelled" ? { cancellation: { reason: signal.reason } } : undefined);
			};
			try {
				while (!await supervisor.waitForOutputClose(10)) {
					const interrupted = interruptionOrObservedFailure(deadline.interruption);
					if (interrupted !== undefined) throw interrupted;
					if (exceeded) throw new OwnedCommandFailure("output-limit", "Command diagnostic output exceeded its complete-output budget.");
					if (processFailure !== undefined) throw new OwnedCommandFailure("process", processFailure, null, null, {
						...processFailureCause,
						processError,
						collectionFailure: true
					});
					await waitForAbortableDelay(25, signal);
				}
				const sinkFailure = await waitForAbortable(consumed, collectionSignal);
				if (sinkFailure !== ABORTED) processFailure ??= sinkFailure;
				await waitForAbortable(inputCompleted, collectionSignal);
				const snapshot = supervisor.snapshot();
				const interrupted = interruptionOrObservedFailure(deadline.interruption, snapshot);
				if (interrupted !== undefined) throw interrupted;
				if (exceeded) throw new OwnedCommandFailure("output-limit", "Command diagnostic output exceeded its complete-output budget.", snapshot);
				const acceptedNonzeroExit = limits.acceptNonZeroExit === true && snapshot.exitCode !== null && snapshot.exitCode !== undefined && snapshot.exitCode !== 0 && snapshot.signal === null;
				if (processFailure !== undefined || (snapshot.exitCode !== 0 || snapshot.signal !== null) && !acceptedNonzeroExit) throw new OwnedCommandFailure("process", processFailure ?? "Command failed; inspect its exit status and diagnostics.", snapshot, null, {
					...processFailureCause,
					processError,
					collectionFailure: processFailure !== undefined
				});
				limits.observeCompleted?.(snapshot);
			} catch (cause) {
				failure = cause instanceof OwnedCommandFailure ? cause : new OwnedCommandFailure("process", "Command collection failed.", null, null, { cause });
			}
			abandoned.abort();
			const stopped = await supervisor.stop();
			const snapshot = supervisor.snapshot();
			if (failure === undefined && inputFailure !== undefined) failure = interruptionOrObservedFailure(deadline.interruption, snapshot) ?? new OwnedCommandFailure("process", inputFailure.message, snapshot, null, {
				cause: inputFailure.cause,
				processError: inputFailure.processError,
				collectionFailure: true
			});
			const cancellation = failure?.cancellation ?? (callerSignal?.aborted ? { reason: callerSignal.reason } : undefined);
			if (stopped.status === "incomplete" && retainCleanup !== undefined) retainCleanup(supervisor, stopped);
			else if (stopped.status === "incomplete") throw new OwnedCommandFailure(failure?.reason ?? "process", failure?.message ?? "Command cleanup failed.", snapshot, stopped.reason, {
				cancellation,
				...failure === undefined ? {} : {
					cause: failure,
					processError: failure.processError
				},
				...stopped.cleanupResult === undefined ? {} : { cleanupResult: stopped.cleanupResult },
				...failure?.collectionFailure === true ? { collectionFailure: true } : {}
			}, ownedCommandResources(launched.ownership, spawn.cwd), supervisor);
			if (failure !== undefined) throw new OwnedCommandFailure(failure.reason, failure.message, snapshot, failure.cleanupFailure, {
				cause: failure,
				cancellation,
				processError: failure.processError,
				...failure.cleanupResult === undefined ? {} : { cleanupResult: failure.cleanupResult },
				...failure.collectionFailure ? { collectionFailure: true } : {}
			}, failure.resources);
			if (callerSignal?.aborted) throw new OwnedCommandFailure("cancelled", "Command cancelled.", snapshot, null, { cancellation: { reason: callerSignal.reason } });
			if (deadline.interruption === "timeout") throw new OwnedCommandFailure("timeout", "Command deadline elapsed during final cleanup.", snapshot);
			return snapshot;
		};
		finishCommandInput = (input, failed) => {
			if (input === null || input === undefined) {
				failed(new Error("stdin stream is unavailable"));
				return Promise.resolve();
			}
			return new Promise((resolve) => {
				const failure = (cause) => {
					failed(cause);
					resolve();
				};
				input.on("error", failure);
				finished$1(input, { readable: false }, (cause) => {
					if (cause !== undefined && cause !== null) failure(cause);
					else if (!input.writableFinished) failure(new Error("closed before writable finalization completed"));
					else resolve();
				});
				try {
					input.end();
				} catch (cause) {
					failure(cause);
				}
			});
		};
		consumeStdout = (stdout, sink, signal) => {
			if (sink === undefined) return Promise.resolve(undefined);
			if (stdout === null) {
				sink.destroy();
				return Promise.resolve("stdout stream is unavailable");
			}
			return pipeline(stdout, sink, { signal }).then(() => undefined, (cause) => `stdout stream failed: ${cause instanceof Error ? cause.message : String(cause)}`);
		};
	})))();
}

//#endregion
//#region dist/process/ArtifactCommandPath.js
var selectArtifactCommandPath, assertArtifactCommandPath;
function init_ArtifactCommandPath() {
	return (init_ArtifactCommandPath = __esmMin((() => {
		init_providerAdapterError();
		init_ArtifactFileOperation();
		init_analysisErrorCore();
		selectArtifactCommandPath = async (invocationPath, signal) => {
			assertArtifactReadActive(signal);
			const resolvedPath = await realpath(invocationPath);
			assertArtifactReadActive(signal);
			return Object.freeze({
				invocationPath,
				resolvedPath
			});
		};
		assertArtifactCommandPath = async (selected, operation, options = {}) => {
			assertArtifactReadActive(options.signal);
			const changed = (cause) => new AnalysisArtifactChangedError(operation, selected.invocationPath, "Selected command no longer resolves to its admitted executable.", {
				cause,
				...options.capturedOutput === undefined ? {} : { capturedOutput: options.capturedOutput }
			});
			let current;
			try {
				current = await realpath(selected.invocationPath);
			} catch (cause) {
				if (artifactSelectedPathErrno(cause) !== undefined) throw changed(cause);
				const systemCode = cause instanceof Error && "code" in cause ? String(cause.code) : undefined;
				const failureOptions = {
					cause,
					capturedOutput: options.capturedOutput
				};
				if (systemCode === "EACCES" || systemCode === "EPERM") throw new AnalysisAccessDeniedError(operation, selected.invocationPath, systemCode, failureOptions);
				throw new ProviderAdapterError("rea", operation, {
					...failureOptions,
					diagnostics: {
						path: selected.invocationPath,
						reason: cause instanceof Error ? cause.message : String(cause),
						system_code: systemCode ?? null
					}
				});
			}
			if (current !== selected.resolvedPath) throw changed();
			assertArtifactReadActive(options.signal);
		};
	})))();
}

//#endregion
//#region dist/domain/apple/machoSectionHeader.js
var readMachoSectionHeader;
function init_machoSectionHeader() {
	return (init_machoSectionHeader = __esmMin((() => {
		init_result();
		readMachoSectionHeader = (bytes, wide, littleEndian) => {
			if (bytes.byteLength < (wide ? 80 : 68)) return err({
				kind: "malformed",
				message: "Mach-O section header is truncated"
			});
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			return ok({
				nameBytes: Buffer.from(bytes.subarray(0, 16)),
				segmentNameBytes: Buffer.from(bytes.subarray(16, 32)),
				address: wide ? view.getBigUint64(32, littleEndian) : BigInt(view.getUint32(32, littleEndian)),
				size: wide ? view.getBigUint64(40, littleEndian) : BigInt(view.getUint32(36, littleEndian)),
				offset: view.getUint32(wide ? 48 : 40, littleEndian),
				flags: view.getUint32(wide ? 64 : 56, littleEndian)
			});
		};
	})))();
}

//#endregion
export { readFileHandleChunks as _, selectArtifactCommandPath as a, ownedCommandResources as c, ABORTED as d, init_AbortablePromise as f, init_readFileHandleChunks as g, readArtifactFileChunks as h, init_ArtifactCommandPath as i, prepareOwnedCommand as l, init_readArtifactFileChunks as m, readMachoSectionHeader as n, OwnedCommandFailure as o, waitForAbortable as p, assertArtifactCommandPath as r, init_OwnedCommand as s, init_machoSectionHeader as t, runOwnedCommand as u };