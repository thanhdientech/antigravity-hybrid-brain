import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { a as execFileOutputFailure, c as DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS, d as providerStartupTimeoutSchema, f as init_snapshotEnvironment, i as execFileOutput, m as snapshotEnvironment, o as init_ExecFileOutput, r as execFileFailureCapturedOutput, u as init_providerStartupTimeout } from "./ExecFileOutput-CmNC2ZNQ.js";
import { n as appendCallerPath, r as init_callerPath } from "./callerPath-BOjlR2T6.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { Ht as safeParseJson, Vt as init_safeJson, cn as MAX_NODE_TIMER_DELAY_MS, ln as init_analysisResourceLimits } from "./analysisErrorProjection-B_6dTGtM.js";
import { a as AnalysisCapabilityUnavailableError, f as init_analysisErrorCore } from "./analysisErrorCore-BCqhUcUc.js";
import { f as assertRegularFileActive, i as init_OwnedRegularFile, m as init_RegularFile, p as assertStableRegularFileIdentity, s as withOwnedRegularFile, u as RegularFileChangedError } from "./OwnedRegularFile-CufsBAJJ.js";
import { r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { n as init_analysisErrorCleanup, t as analysisErrorWithCleanupFailure } from "./analysisErrorCleanup-CLocSgSR.js";
import { n as init_providerCleanupError, t as ProviderCleanupError } from "./providerCleanupError-CbzQ5mbk.js";
import { basename, dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import { constants, rmSync } from "node:fs";
import { z } from "zod";
import { release, tmpdir } from "node:os";
import { promisify } from "node:util";
import { chmod, copyFile, lstat, mkdir, mkdtemp, readFile, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { setTimeout } from "node:timers/promises";
import { performance } from "node:perf_hooks";

//#region dist/process/ProcessAdmissionError.js
var PROCESS_ADMISSION_CODES, ProcessAdmissionError;
function init_ProcessAdmissionError() {
	return (init_ProcessAdmissionError = __esmMin((() => {
		PROCESS_ADMISSION_CODES = [
			"runtime_closing",
			"stdout_missing",
			"request_stream_failed",
			"finalization_unobserved",
			"prefix_identity_lost",
			"prefix_unavailable",
			"identity_snapshot_unavailable",
			"current_process_unreported",
			"baseline_unavailable",
			"memory_limit_unsupported",
			"launcher_pid_missing",
			"duplicate_key",
			"reader_closed",
			"token_json_invalid",
			"token_response_invalid",
			"token_pid_set",
			"token_pid_incomplete",
			"identity_json_invalid",
			"identity_response_invalid",
			"identity_pid_set",
			"identity_pid_incomplete",
			"limit_unreadable",
			"limit_invalid",
			"report_exceeds_budget"
		];
		ProcessAdmissionError = class extends Error {
			code;
			detail;
			_tag = "ProcessAdmissionError";
			constructor(code, detail, options) {
				super(code, options);
				this.code = code;
				this.detail = detail;
				this.name = "ProcessAdmissionError";
			}
		};
	})))();
}

//#endregion
//#region dist/process/boundedUtf8Text.js
var boundedUtf8Text;
function init_boundedUtf8Text() {
	return (init_boundedUtf8Text = __esmMin((() => {
		boundedUtf8Text = (value, maximumBytes) => {
			let bytes = 0;
			let end = 0;
			for (const codePoint of value) {
				const codePointBytes = Buffer.byteLength(codePoint, "utf8");
				if (bytes + codePointBytes > maximumBytes) return {
					text: value.slice(0, end),
					truncated: true
				};
				bytes += codePointBytes;
				end += codePoint.length;
			}
			return {
				text: value,
				truncated: false
			};
		};
	})))();
}

//#endregion
//#region dist/filesystem/readStableFileBytes.js
var RegularFileCapacityError, readStableFileBytes, readStableFilePrefix, readExtent;
function init_readStableFileBytes() {
	return (init_readStableFileBytes = __esmMin((() => {
		init_RegularFile();
		RegularFileCapacityError = class extends Error {
			path;
			maximumBytes;
			observedBytes;
			_tag = "RegularFileCapacityError";
			constructor(path, maximumBytes, observedBytes) {
				super(`Selected file must be at most ${maximumBytes} bytes: ${path}`);
				this.path = path;
				this.maximumBytes = maximumBytes;
				this.observedBytes = observedBytes;
				this.name = this._tag;
			}
		};
		readStableFileBytes = async (file, path, maximumBytes, options) => {
			if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 0) throw new RangeError("Maximum file bytes must be a nonnegative safe integer");
			assertRegularFileActive(options.signal);
			const before = await file.stat({ bigint: true });
			if (before.size > BigInt(maximumBytes)) throw new RegularFileCapacityError(path, maximumBytes, before.size);
			const bytes = await readExtent(file, path, Number(before.size), options.signal);
			assertRegularFileActive(options.signal);
			const extra = Buffer.alloc(1);
			if ((await file.read(extra, 0, 1, bytes.length)).bytesRead !== 0) throw new RegularFileChangedError(path);
			await assertStableRegularFileIdentity(file, path, before, options);
			return bytes;
		};
		readStableFilePrefix = async (file, path, maximumBytes, options) => {
			if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 0) throw new RangeError("Maximum prefix bytes must be a nonnegative safe integer");
			assertRegularFileActive(options.signal);
			const before = await file.stat({ bigint: true });
			const length = Number(before.size < BigInt(maximumBytes) ? before.size : BigInt(maximumBytes));
			const bytes = await readExtent(file, path, length, options.signal);
			await assertStableRegularFileIdentity(file, path, before, options);
			return {
				bytes,
				size: before.size
			};
		};
		readExtent = async (file, path, length, signal) => {
			assertRegularFileActive(signal);
			const bytes = Buffer.alloc(length);
			let offset = 0;
			while (offset < bytes.length) {
				assertRegularFileActive(signal);
				const read = await file.read({
					buffer: bytes,
					offset,
					length: bytes.length - offset,
					position: offset
				});
				if (read.bytesRead === 0) throw new RegularFileChangedError(path);
				offset += read.bytesRead;
			}
			assertRegularFileActive(signal);
			return bytes;
		};
	})))();
}

//#endregion
//#region dist/process/DarwinHelperCache.js
var CACHE_FORMAT, HELPER_NAME, MANIFEST_NAME, MAX_MANIFEST_BYTES, MAX_HELPER_BYTES, TOOLCHAIN_LOOKUP_TIMEOUT_MS, manifestSchema, STICKY, sha256, defaultDarwinHelperCacheDirectory, darwinHelperCacheDirectory, privatelyOwned, ancestorsTrusted, realAncestors, ACL_WRITE_RIGHTS, aclListingGrantsWrite, isMissing, fileIdentity, createDarwinHelperCache;
function init_DarwinHelperCache() {
	return (init_DarwinHelperCache = __esmMin((() => {
		init_providerCleanupError();
		init_safeJson();
		init_callerPath();
		init_OwnedRegularFile();
		init_readStableFileBytes();
		init_ExecFileOutput();
		CACHE_FORMAT = 2;
		HELPER_NAME = "reader";
		MANIFEST_NAME = "manifest.json";
		MAX_MANIFEST_BYTES = 4096;
		MAX_HELPER_BYTES = 16 * 1024 * 1024;
		TOOLCHAIN_LOOKUP_TIMEOUT_MS = 15e3;
		manifestSchema = z.strictObject({
			format: z.literal(CACHE_FORMAT),
			key: z.string().regex(/^[a-f0-9]{64}$/u),
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			size: z.int().positive()
		});
		STICKY = 512;
		sha256 = (value) => createHash("sha256").update(value).digest("hex");
		defaultDarwinHelperCacheDirectory = (home) => appendCallerPath(home, "Library/Caches/rea/process-helper", "darwin");
		darwinHelperCacheDirectory = (selection) => selection.compilerSelected || (selection.moduleCachePath ?? "") !== "" || selection.home === undefined || !isAbsolute(selection.home) ? undefined : defaultDarwinHelperCacheDirectory(selection.home);
		privatelyOwned = (stats, uid) => stats.uid === uid && (stats.mode & 18) === 0;
		ancestorsTrusted = async (path, uid) => {
			for (let current = path;; current = dirname(current)) {
				const stats = await lstat(current);
				if (!stats.isDirectory() || stats.uid !== uid && stats.uid !== 0) return false;
				if ((stats.mode & 18) !== 0 && !(stats.uid === 0 && (stats.mode & STICKY) !== 0)) return false;
				if (dirname(current) === current) return true;
			}
		};
		realAncestors = (path) => {
			const paths = [path];
			for (let current = path; dirname(current) !== current;) {
				current = dirname(current);
				paths.push(current);
			}
			return paths;
		};
		ACL_WRITE_RIGHTS = new Set([
			"write",
			"append",
			"writeattr",
			"writeextattr",
			"writesecurity",
			"chown",
			"delete",
			"add_file",
			"add_subdirectory",
			"delete_child"
		]);
		aclListingGrantsWrite = (listing) => listing.split("\n").some((line) => {
			const entry = /^\s*\d+:\s+\S+\s+(?:inherited\s+)?(allow|deny)\s+(\S+)/u.exec(line);
			return entry?.[1] === "allow" && (entry[2] ?? "").split(",").some((right) => ACL_WRITE_RIGHTS.has(right));
		});
		isMissing = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
		fileIdentity = async (path) => {
			const real = await realpath(path);
			const facts = await stat(real);
			return {
				path: real,
				size: facts.size,
				mtime_ms: facts.mtimeMs
			};
		};
		createDarwinHelperCache = (options) => {
			const uid = process.getuid?.();
			const retained = new Map();
			let cleanupAnchor;
			let key;
			const xcrun = async (arguments_, signal) => {
				const { stdout } = await execFileOutput(options.xcrun, arguments_, {
					env: options.environment,
					timeout: TOOLCHAIN_LOOKUP_TIMEOUT_MS,
					maxBuffer: 64 * 1024,
					stopSignal: "SIGTERM",
					...signal === undefined ? {} : { signal }
				});
				const path = stdout.trim();
				if (!isAbsolute(path)) throw new Error(`xcrun ${arguments_.join(" ")} returned no path`);
				return path;
			};
			/** Wait for every started read before reporting the first failure. */
			const settleAll = async (pending) => {
				await Promise.allSettled(pending);
				return Promise.all(pending);
			};
			/** xcrun owns toolchain selection; key on what it resolves. */
			const computeKey = async (signal) => {
				const [sources, compilerPath, sdkPath] = await settleAll([
					Promise.all(options.sources.map(async (source) => sha256(await readFile(source)))),
					xcrun(["--find", "swiftc"], signal),
					xcrun(["--show-sdk-path"], signal)
				]);
				const [compiler, sdk] = await settleAll([fileIdentity(compilerPath), fileIdentity(join(sdkPath, "SDKSettings.json"))]);
				return sha256(JSON.stringify({
					format: CACHE_FORMAT,
					sources,
					compiler,
					sdk,
					architecture: process.arch,
					os_release: release()
				}));
			};
			/** A cancelled or failed key computation is retried by the next lookup. */
			const cacheKey = (signal) => {
				if (key !== undefined) return key;
				const pending = computeKey(signal);
				key = pending;
				pending.catch(() => {
					if (key === pending) key = undefined;
				});
				return pending;
			};
			/** On macOS, no ACL may grant a write that the mode bits withhold. */
			const withoutAclWriteGrants = async (paths, signal) => {
				if (process.platform !== "darwin") return true;
				const { stdout } = await execFileOutput("/bin/ls", [
					"-lde",
					"--",
					...paths
				], {
					env: options.environment,
					timeout: TOOLCHAIN_LOOKUP_TIMEOUT_MS,
					maxBuffer: 1024 * 1024,
					stopSignal: "SIGTERM",
					...signal === undefined ? {} : { signal }
				});
				return !aclListingGrantsWrite(stdout);
			};
			/** The real cache root, created privately, with only trusted ancestors. */
			const trustedRoot = async (owner) => {
				await mkdir(options.directory, {
					recursive: true,
					mode: 448
				});
				const named = await lstat(options.directory);
				if (!named.isDirectory() || !privatelyOwned(named, owner)) return undefined;
				const root = await realpath(options.directory);
				return await ancestorsTrusted(root, owner) ? root : undefined;
			};
			const retainClose = (owner) => {
				retained.set(`file handle ${String(owner.handle.fd)}`, () => owner.close());
			};
			/** Hash the opened descriptor itself; FIFOs and links never block or pass. */
			const readEntryFile = (path, owner, maximumBytes, executable) => withOwnedRegularFile(path, {
				symlinks: "reject",
				retainFailedClose: retainClose
			}, async ({ handle, initial }) => !privatelyOwned(initial, owner) || executable && (initial.mode & 64) === 0 || initial.size === 0 || initial.size > maximumBytes ? undefined : readStableFileBytes(handle, path, maximumBytes, { symlinks: "reject" })).catch(() => undefined);
			const verifiedHelper = async (entry, entryKey, owner) => {
				const manifestBytes = await readEntryFile(join(entry, MANIFEST_NAME), owner, MAX_MANIFEST_BYTES, false);
				const decoded = manifestBytes === undefined ? undefined : safeParseJson(manifestBytes.toString("utf8"));
				const manifest = decoded?.ok === true ? manifestSchema.safeParse(decoded.value) : undefined;
				if (manifest?.success !== true || manifest.data.key !== entryKey) return undefined;
				const executable = join(entry, HELPER_NAME);
				const helper = await readEntryFile(executable, owner, MAX_HELPER_BYTES, true);
				return helper !== undefined && helper.byteLength === manifest.data.size && sha256(helper) === manifest.data.sha256 ? executable : undefined;
			};
			const lookup = async (signal) => {
				if (uid === undefined) return { kind: "unavailable" };
				try {
					const root = await trustedRoot(uid);
					if (root === undefined) return { kind: "unavailable" };
					const entryKey = await cacheKey(signal);
					const entry = join(root, entryKey);
					let entryStats;
					try {
						entryStats = await lstat(entry);
					} catch (cause) {
						if (isMissing(cause)) return {
							kind: "miss",
							key: entryKey
						};
						throw cause;
					}
					if (!entryStats.isDirectory() || !privatelyOwned(entryStats, uid)) return { kind: "unavailable" };
					const executable = await verifiedHelper(entry, entryKey, uid);
					if (executable === undefined || !await withoutAclWriteGrants([
						...realAncestors(root),
						entry,
						executable,
						join(entry, MANIFEST_NAME)
					], signal)) return { kind: "unavailable" };
					return {
						kind: "hit",
						executable
					};
				} catch {
					return { kind: "unavailable" };
				}
			};
			const removeStaging = async (path) => {
				const remove = () => rm(path, {
					recursive: true,
					force: true
				});
				await remove().catch(() => {
					retained.set(path, remove);
				});
			};
			/**
			* Atomically publish a verified copy and return the shared helper to run.
			* macOS assesses each new executable file on its first launch (about 0.3 s),
			* so running the shared copy pays that once for every later process.
			*/
			const publish = async (entryKey, compiled, signal) => {
				if (uid === undefined) return undefined;
				let staging;
				try {
					const root = await trustedRoot(uid);
					if (root === undefined || !await withoutAclWriteGrants(realAncestors(root), signal)) return undefined;
					staging = await mkdtemp(join(root, ".publish-"));
					const copied = join(staging, HELPER_NAME);
					await copyFile(compiled, copied, constants.COPYFILE_EXCL);
					await chmod(copied, 448);
					const helper = await readEntryFile(copied, uid, MAX_HELPER_BYTES, true);
					if (helper === undefined) return undefined;
					await writeFile(join(staging, MANIFEST_NAME), JSON.stringify({
						format: CACHE_FORMAT,
						key: entryKey,
						sha256: sha256(helper),
						size: helper.byteLength
					}), {
						mode: 384,
						flag: "wx"
					});
					const entry = join(root, entryKey);
					try {
						await rename(staging, entry);
						staging = undefined;
						return join(entry, HELPER_NAME);
					} catch {
						const winner = await lookup(signal);
						return winner.kind === "hit" ? winner.executable : undefined;
					}
				} catch {
					return undefined;
				} finally {
					if (staging !== undefined) await removeStaging(staging);
				}
			};
			/** Retry every retained close or removal; unresolved ones stay owned. */
			const close = async () => {
				const failed = [];
				for (const [resource, cleanup] of retained) {
					try {
						await cleanup();
						retained.delete(resource);
					} catch {
						failed.push(resource);
					}
				}
				if (failed.length > 0) {
					const failure = new ProviderCleanupError("process-ownership", failed, { reason: "Darwin ownership-helper cache resources remain owned until cleanup succeeds." }, { operation: "prepare_owned_process" });
					if (cleanupAnchor === undefined) cleanupAnchor = failure;
					else failure.bindCleanupDependencies([cleanupAnchor]);
					throw failure;
				}
				cleanupAnchor?.resolveCleanup();
				cleanupAnchor = undefined;
			};
			return {
				lookup,
				publish,
				close
			};
		};
	})))();
}

//#endregion
//#region dist/process/DarwinProcessRunTokenReader.js
var responseSchema, identityResponseSchema, sourceFiles, SWIFTC_INTERRUPT, resolveSwiftcCompileTimeoutMs, swiftcCompileTimeoutRecovery, STDERR_EXCERPT_LIMIT, DarwinProcessOwnershipInspectionError, MAX_COMPILER_OUTPUT_BYTES, compilerFailureFacts, compilerOutcomeDescription, compilerInspectionError, abortReason, isExpectedAbort$1, waitForCompilation, helperLaunchFailed, createDarwinProcessRunTokenReader;
function init_DarwinProcessRunTokenReader() {
	return (init_DarwinProcessRunTokenReader = __esmMin((() => {
		init_ProcessAdmissionError();
		init_providerStartupTimeout();
		init_analysisResourceLimits();
		init_result();
		init_providerCleanupError();
		init_analysisErrorCleanup();
		init_safeJson();
		init_boundedUtf8Text();
		init_DarwinHelperCache();
		init_snapshotEnvironment();
		init_ExecFileOutput();
		responseSchema = z.strictObject({ results: z.array(z.discriminatedUnion("state", [z.strictObject({
			pid: z.int().positive(),
			state: z.literal("readable"),
			run_id: z.string().optional(),
			reason: z.null().optional()
		}), z.strictObject({
			pid: z.int().positive(),
			state: z.literal("unavailable"),
			run_id: z.union([z.string(), z.null()]).optional(),
			reason: z.string().min(1)
		})])) });
		identityResponseSchema = z.strictObject({ results: z.array(z.discriminatedUnion("state", [
			z.strictObject({
				pid: z.int().positive(),
				state: z.literal("absent"),
				identity: z.null().optional(),
				reason: z.literal("not-in-snapshot")
			}),
			z.strictObject({
				pid: z.int().positive(),
				state: z.literal("readable"),
				identity: z.string().min(1),
				effective_uid: z.int().nonnegative().optional(),
				lifecycle: z.enum(["non-zombie", "zombie"]).optional(),
				relation: z.strictObject({
					state: z.literal("observed"),
					parent_pid: z.int().nonnegative(),
					process_group_id: z.int().nonnegative()
				}).optional(),
				name: z.string().optional(),
				reason: z.null().optional()
			}),
			z.strictObject({
				pid: z.int().positive(),
				state: z.literal("unavailable"),
				identity: z.null().optional(),
				reason: z.string().min(1)
			})
		])) });
		sourceFiles = [fileURLToPath(new URL("../../bridge/process/ProcessRunTokenReader.swift", new URL("../process/DarwinProcessRunTokenReader.js", import.meta.url).href)), fileURLToPath(new URL("../../bridge/process/ProcessRunTokenReaderMain.swift", new URL("../process/DarwinProcessRunTokenReader.js", import.meta.url).href))];
		SWIFTC_INTERRUPT = "SIGINT";
		resolveSwiftcCompileTimeoutMs = (options = {}) => {
			if (options.compileTimeoutMs !== undefined) return options.compileTimeoutMs;
			const raw = (options.environment ?? process.env).REA_SWIFTC_COMPILE_TIMEOUT_MS;
			if (raw === undefined) return DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS;
			const parsed = providerStartupTimeoutSchema.safeParse(raw);
			return parsed.success ? parsed.data : DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS;
		};
		swiftcCompileTimeoutRecovery = (timeoutMs) => `The effective REA_SWIFTC_COMPILE_TIMEOUT_MS value is ${String(timeoutMs)} ms (integer range 1..${String(MAX_NODE_TIMER_DELAY_MS)}; omitted default ${String(DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS)} ms). Set it in the environment that starts REA and restart REA; the next ownership-helper compile uses the new value.`;
		STDERR_EXCERPT_LIMIT = 512;
		DarwinProcessOwnershipInspectionError = class DarwinProcessOwnershipInspectionError extends Error {
			#cleanupOwner;
			get cleanupOwner() {
				return this.#cleanupOwner;
			}
			constructor(message, options) {
				const { compilerOutcome, capturedOutput, cleanupFailure, cleanupOwner, cancellation, ...errorOptions } = options ?? {};
				super(message, errorOptions);
				this.name = "DarwinProcessOwnershipInspectionError";
				this.compilerOutcome = compilerOutcome;
				this.capturedOutput = capturedOutput;
				this.#cleanupOwner = cleanupOwner;
				this.cleanupFailure = cleanupFailure;
				this.cancellation = cancellation;
			}
			compilerOutcome;
			capturedOutput;
			cleanupFailure;
			cancellation;
			/** Preserve the physical preparation failure while following the exact cleanup owner. */
			withCleanupFailure(cleanup, owner) {
				const combined = this.cleanupFailure === undefined || this.cleanupFailure === cleanup ? cleanup : analysisErrorWithCleanupFailure(this.cleanupFailure, cleanup).bindCleanupDependencies([this.cleanupFailure, cleanup]);
				return new DarwinProcessOwnershipInspectionError(this.message, {
					...Object.hasOwn(this, "cause") ? { cause: this.cause } : {},
					...this.compilerOutcome === undefined ? {} : { compilerOutcome: this.compilerOutcome },
					...this.capturedOutput === undefined ? {} : { capturedOutput: this.capturedOutput },
					cleanupFailure: combined,
					cleanupOwner: owner ?? this.cleanupOwner,
					...this.cancellation === undefined ? {} : { cancellation: this.cancellation }
				});
			}
		};
		MAX_COMPILER_OUTPUT_BYTES = 8 * 1024;
		compilerFailureFacts = (cause, timeoutMs) => {
			const failure = execFileOutputFailure(cause);
			if (failure === undefined) return undefined;
			const stderr = boundedUtf8Text(failure.stderr, MAX_COMPILER_OUTPUT_BYTES);
			const stdout = boundedUtf8Text(failure.stdout, MAX_COMPILER_OUTPUT_BYTES);
			const outcome = failure.code === "ETIMEDOUT" ? "timed_out" : typeof failure.code === "number" ? "exited" : failure.signal !== null ? "signaled" : failure.code === "ENOENT" ? "spawn_failed" : "failed";
			return {
				outcome: {
					outcome,
					code: failure.code,
					signal: failure.signal,
					stderr: stderr.text,
					...failure.stderrBytes === undefined ? {} : { stderrBytes: failure.stderrBytes },
					stderrTruncated: stderr.truncated,
					outputTruncated: failure.outputTruncated,
					killed: failure.killed,
					...outcome === "timed_out" ? { timeoutMs } : {}
				},
				capturedOutput: {
					...execFileFailureCapturedOutput(failure),
					stdout: stdout.text,
					stderr: stderr.text,
					truncated: stdout.truncated || stderr.truncated || failure.outputTruncated
				}
			};
		};
		compilerOutcomeDescription = (outcome, fallbackCode) => {
			if (outcome === undefined) return `compiler result: ${String(fallbackCode)}`;
			if (outcome.outcome === "exited") return `compiler result: exit code ${String(outcome.code)}`;
			if (outcome.outcome === "timed_out") {
				if (outcome.timeoutMs === undefined) return "compiler result: timed out. The effective REA_SWIFTC_COMPILE_TIMEOUT_MS value was not reported.";
				return `compiler result: timed out after ${String(outcome.timeoutMs)} ms. ${swiftcCompileTimeoutRecovery(outcome.timeoutMs)}`;
			}
			if (outcome.outcome === "signaled") return `compiler result: stopped by signal ${outcome.signal ?? "an unknown signal"}`;
			return `compiler result: ${String(outcome.code)}`;
		};
		compilerInspectionError = (cause, timeoutMs, compiler) => {
			const facts = compilerFailureFacts(cause, timeoutMs);
			const outcome = facts?.outcome;
			const code = outcome?.code ?? "unknown";
			const description = compilerOutcomeDescription(outcome, code);
			const launcher = compiler.kind === "xcrun" ? "xcrun" : "the selected Swift compiler (REA_DARWIN_SWIFTC_PATH)";
			const prefix = code === "ENOENT" ? `macOS process ownership inspection requires the Apple Swift compiler via ${launcher}` : `macOS process ownership helper compilation failed via ${launcher}`;
			const stderr = boundedUtf8Text(outcome?.stderr ?? "", STDERR_EXCERPT_LIMIT);
			const diagnostics = stderr.text.trim();
			const truncated = stderr.truncated || outcome?.stderrTruncated === true || outcome?.outputTruncated === true;
			const truncationNote = !truncated ? "" : stderr.truncated ? `… [diagnostics truncated at ${String(STDERR_EXCERPT_LIMIT)} bytes; this release has no runtime override]` : "… [diagnostics truncated; this release has no runtime override]";
			const suffix = diagnostics ? `: ${diagnostics}${truncationNote}` : outcome === undefined ? `: ${cause instanceof Error ? cause.message : String(cause)}` : ": no compiler diagnostics were captured";
			return new DarwinProcessOwnershipInspectionError(`${prefix} (${description})${suffix}`, {
				cause,
				...facts === undefined ? {} : {
					compilerOutcome: facts.outcome,
					capturedOutput: facts.capturedOutput
				}
			});
		};
		abortReason = (signal) => {
			if (signal.reason !== undefined) return signal.reason;
			const error = new Error("The operation was aborted");
			error.name = "AbortError";
			return error;
		};
		isExpectedAbort$1 = (cause, signal) => signal.aborted && (cause === signal.reason || cause instanceof Error && cause.name === "AbortError");
		waitForCompilation = async (operation, signal) => {
			if (signal === undefined) return {
				kind: "completed",
				result: await operation.promise
			};
			return new Promise((resolve) => {
				let completed = false;
				const finish = (outcome) => {
					if (completed) return;
					completed = true;
					signal.removeEventListener("abort", onAbort);
					resolve(outcome);
				};
				const onAbort = () => {
					if (operation.primaryFailure !== undefined) return;
					finish({
						kind: "cancelled",
						reason: signal.reason
					});
				};
				signal.addEventListener("abort", onAbort, { once: true });
				void operation.promise.then((result) => finish({
					kind: "completed",
					result
				}));
				if (signal.aborted) onAbort();
			});
		};
		helperLaunchFailed = (cause) => {
			const failure = execFileOutputFailure(cause);
			const code = failure?.code ?? (cause instanceof Error && "code" in cause ? cause.code : undefined);
			return [
				"EACCES",
				"EPERM",
				"ENOEXEC",
				"ENOENT"
			].includes(String(code)) || failure?.signal === "SIGKILL" && !failure.killed;
		};
		createDarwinProcessRunTokenReader = (options = {}) => {
			const compiler = options.compiler ?? {
				kind: "xcrun",
				executable: "/usr/bin/xcrun"
			};
			const environment = snapshotEnvironment(options.environment ?? process.env);
			const compilerTimeoutMs = resolveSwiftcCompileTimeoutMs({
				...options,
				environment
			});
			const moduleCachePath = options.moduleCachePath ?? "";
			const helperCache = options.helperCacheDirectory === undefined || compiler.kind !== "xcrun" ? undefined : createDarwinHelperCache({
				directory: options.helperCacheDirectory,
				sources: sourceFiles,
				xcrun: compiler.executable,
				environment
			});
			let root;
			let executable;
			let sharedExecutable;
			let perRunExecutable;
			let bypassCache = false;
			let compilation;
			let closePromise;
			let closed = false;
			let exitCleanupInstalled = false;
			const activeCommands = new Set();
			const cleanupAtExit = () => {
				if (root !== undefined) rmSync(root.path, {
					recursive: true,
					force: true
				});
			};
			const cleanupRoot = (target = root) => {
				if (target === undefined) return Promise.resolve();
				target.cleanupPromise ??= Promise.resolve().then(async () => {
					try {
						await rm(target.path, {
							recursive: true,
							force: true
						});
					} catch (cause) {
						const failure = new ProviderCleanupError("process-ownership", [target.path], { reason: "The Darwin ownership helper root remains owned until removal succeeds." }, {
							cause,
							operation: "prepare_owned_process"
						});
						if (target.cleanupAnchor === undefined) target.cleanupAnchor = failure;
						else failure.bindCleanupDependencies([target.cleanupAnchor]);
						throw failure;
					}
					target.cleanupAnchor?.resolveCleanup();
					target.cleanupAnchor = undefined;
					if (root !== target) return;
					root = undefined;
					executable = undefined;
					if (exitCleanupInstalled) process.removeListener("exit", cleanupAtExit);
					exitCleanupInstalled = false;
				}).catch((cause) => {
					target.cleanupPromise = undefined;
					throw cause;
				});
				return target.cleanupPromise;
			};
			const runCompilation = async (operation) => {
				const signal = operation.controller.signal;
				let operationRoot;
				try {
					if (compiler.kind === "swiftc" && (!isAbsolute(compiler.executable) || !isAbsolute(compiler.sdkRoot))) {
						throw new DarwinProcessOwnershipInspectionError("Direct Darwin helper compilation requires absolute REA_DARWIN_SWIFTC_PATH and SDKROOT paths selecting a compatible installed Swift compiler and macOS SDK.");
					}
					const cached = bypassCache ? undefined : await helperCache?.lookup(signal);
					if (signal.aborted || closed) throw abortReason(signal);
					if (cached?.kind === "hit") {
						sharedExecutable = cached.executable;
						executable = cached.executable;
						return cached.executable;
					}
					operationRoot = { path: await mkdtemp(join(tmpdir(), "rea-process-token-")) };
					root = operationRoot;
					process.once("exit", cleanupAtExit);
					exitCleanupInstalled = true;
					if (signal.aborted || closed) throw abortReason(signal);
					const output = join(operationRoot.path, "reader");
					const compilerTemporary = join(operationRoot.path, "tmp");
					await mkdir(compilerTemporary);
					const compilerEnvironment = {
						...environment,
						TMPDIR: compilerTemporary
					};
					const compilerArguments = compiler.kind === "xcrun" ? ["swiftc"] : ["-sdk", compiler.sdkRoot];
					if (compiler.kind === "swiftc") compilerEnvironment.SDKROOT = compiler.sdkRoot;
					if (moduleCachePath === "") {
						delete compilerEnvironment.CLANG_MODULE_CACHE_PATH;
					} else {
						await mkdir(moduleCachePath, { recursive: true });
						compilerArguments.push("-module-cache-path", moduleCachePath);
						compilerEnvironment.CLANG_MODULE_CACHE_PATH = moduleCachePath;
					}
					compilerArguments.push(...sourceFiles, "-o", output);
					try {
						await execFileOutput(compiler.executable, compilerArguments, {
							timeout: compilerTimeoutMs,
							maxBuffer: 1024 * 1024,
							signal,
							stopSignal: SWIFTC_INTERRUPT,
							lifetimePipe: true,
							env: compilerEnvironment
						});
					} catch (cause) {
						if (isExpectedAbort$1(cause, signal)) throw cause;
						throw compilerInspectionError(cause, compilerTimeoutMs, compiler);
					}
					if (signal.aborted || closed) throw abortReason(signal);
					const shared = cached?.kind === "miss" ? await helperCache?.publish(cached.key, output, signal) : undefined;
					if (signal.aborted || closed) throw abortReason(signal);
					perRunExecutable = output;
					sharedExecutable = shared;
					executable = shared ?? output;
					return executable;
				} catch (cause) {
					operation.primaryFailure = { cause };
					if (operationRoot !== undefined) {
						try {
							await cleanupRoot(operationRoot);
						} catch (cleanup) {
							if (!(cleanup instanceof ProviderCleanupError)) throw cleanup;
							const primary = cause instanceof DarwinProcessOwnershipInspectionError ? cause : new DarwinProcessOwnershipInspectionError("Darwin process ownership helper preparation failed", { cause });
							throw primary.withCleanupFailure(cleanup, { close: () => cleanupRoot(operationRoot) });
						}
					}
					throw cause;
				}
			};
			const beginCompilation = () => {
				const controller = new AbortController();
				const operation = {
					controller,
					promise: Promise.resolve().then(() => runCompilation(operation)).then(ok, err).finally(() => {
						operation.settled = true;
						if (compilation === operation) compilation = undefined;
					}),
					waiters: 0,
					aborting: false,
					settled: false
				};
				compilation = operation;
				return operation;
			};
			const compile = async (signal) => {
				if (closed) throw new ProcessAdmissionError("reader_closed");
				signal?.throwIfAborted();
				while (true) {
					if (closed) throw new ProcessAdmissionError("reader_closed");
					signal?.throwIfAborted();
					if (executable !== undefined) return executable;
					if (compilation === undefined && root !== undefined) {
						await cleanupRoot();
						continue;
					}
					let operation = compilation;
					if (operation?.aborting === true) {
						const waited = await waitForCompilation(operation, signal);
						if (waited.kind === "cancelled") throw waited.reason;
						if (!waited.result.ok && waited.result.error instanceof DarwinProcessOwnershipInspectionError && waited.result.error.cleanupFailure !== undefined) throw waited.result.error;
						continue;
					}
					operation ??= beginCompilation();
					operation.waiters += 1;
					const waited = await waitForCompilation(operation, signal);
					operation.waiters -= 1;
					if (operation.waiters === 0 && !operation.settled && !operation.aborting) {
						operation.aborting = true;
						operation.controller.abort();
						const finalized = await operation.promise;
						if (waited.kind === "cancelled" && !finalized.ok && finalized.error instanceof DarwinProcessOwnershipInspectionError && finalized.error.cleanupFailure !== undefined) {
							throw new DarwinProcessOwnershipInspectionError("Darwin process ownership helper preparation was cancelled", {
								cause: waited.reason,
								cancellation: { reason: waited.reason },
								cleanupFailure: finalized.error.cleanupFailure,
								cleanupOwner: finalized.error.cleanupOwner
							});
						}
					}
					if (waited.kind === "cancelled") throw waited.reason;
					if (!waited.result.ok) throw waited.result.error;
					return waited.result.value;
				}
			};
			const runHelper = (arguments_, signal) => {
				if (closed) return Promise.reject(new ProcessAdmissionError("reader_closed"));
				const execute = async (binary) => {
					const { stdout } = await execFileOutput(binary, arguments_, {
						env: environment,
						timeout: 15e3,
						stopSignal: "SIGTERM",
						...signal === undefined ? {} : { signal }
					});
					signal?.throwIfAborted();
					return stdout;
				};
				const pending = (async () => {
					const binary = await compile(signal);
					const usedShared = binary === sharedExecutable;
					try {
						return await execute(binary);
					} catch (cause) {
						if (!usedShared || !helperLaunchFailed(cause)) throw cause;
						bypassCache = true;
						sharedExecutable = undefined;
						if (executable === binary) executable = perRunExecutable;
						return execute(await compile(signal));
					}
				})();
				activeCommands.add(pending);
				return pending.finally(() => {
					activeCommands.delete(pending);
				});
			};
			const read = async (processes, signal) => {
				signal?.throwIfAborted();
				if (processes.length === 0) return new Map();
				const pids = processes.map(({ pid }) => String(pid));
				const stdout = await runHelper(pids, signal);
				const decoded = safeParseJson(stdout);
				if (!decoded.ok) throw new ProcessAdmissionError("token_json_invalid", { parser: decoded.error }, { cause: decoded.cause });
				const parsed = responseSchema.safeParse(decoded.value);
				if (!parsed.success) throw new ProcessAdmissionError("token_response_invalid", undefined, { cause: parsed.error });
				const requested = new Set(processes.map(({ pid }) => pid));
				const observations = new Map();
				for (const result of parsed.data.results) {
					if (!requested.has(result.pid) || observations.has(result.pid)) throw new ProcessAdmissionError("token_pid_set");
					observations.set(result.pid, result.state === "readable" ? {
						state: "readable",
						runId: result.run_id
					} : {
						state: "unavailable",
						reason: result.reason ?? "process token observation is unavailable"
					});
				}
				if (observations.size !== requested.size) throw new ProcessAdmissionError("token_pid_incomplete");
				return observations;
			};
			const identities = async (processes, signal) => {
				if (processes.length === 0) return new Map();
				const pids = processes.map(({ pid }) => String(pid));
				const stdout = await runHelper(["--identities", ...pids], signal);
				const decoded = safeParseJson(stdout);
				if (!decoded.ok) throw new ProcessAdmissionError("identity_json_invalid", { parser: decoded.error }, { cause: decoded.cause });
				const parsed = identityResponseSchema.safeParse(decoded.value);
				if (!parsed.success) throw new ProcessAdmissionError("identity_response_invalid", undefined, { cause: parsed.error });
				const requested = new Set(processes.map(({ pid }) => pid));
				const observations = new Map();
				for (const result of parsed.data.results) {
					if (!requested.has(result.pid) || observations.has(result.pid)) throw new ProcessAdmissionError("identity_pid_set");
					observations.set(result.pid, result.state === "readable" ? {
						state: "readable",
						identity: result.identity,
						...result.effective_uid === undefined ? {} : { effectiveUid: result.effective_uid },
						...result.lifecycle === undefined ? {} : { lifecycle: {
							state: "observed",
							lifecycle: result.lifecycle
						} },
						...result.relation === undefined ? {} : { relation: {
							state: "observed",
							parentPid: result.relation.parent_pid,
							processGroupId: result.relation.process_group_id
						} },
						...result.name === undefined || result.name === "" ? {} : { name: result.name }
					} : result.state === "absent" ? {
						state: "absent",
						reason: result.reason
					} : {
						state: "unavailable",
						reason: result.reason
					});
				}
				if (observations.size !== requested.size) throw new ProcessAdmissionError("identity_pid_incomplete");
				return observations;
			};
			const close = () => {
				if (closePromise !== undefined) return closePromise;
				closed = true;
				const pendingClose = (async () => {
					const operation = compilation;
					if (operation !== undefined && !operation.settled) {
						operation.aborting = true;
						operation.controller.abort();
						await operation.promise;
					}
					await Promise.allSettled(activeCommands);
					const [rootCleanup, cacheCleanup] = await Promise.allSettled([cleanupRoot(), helperCache?.close()]);
					if (rootCleanup.status === "rejected" && cacheCleanup.status === "rejected" && rootCleanup.reason instanceof ProviderCleanupError && cacheCleanup.reason instanceof ProviderCleanupError) throw analysisErrorWithCleanupFailure(rootCleanup.reason, cacheCleanup.reason).bindCleanupDependencies([rootCleanup.reason, cacheCleanup.reason]);
					if (rootCleanup.status === "rejected") throw rootCleanup.reason;
					if (cacheCleanup.status === "rejected") throw cacheCleanup.reason;
				})().catch((cause) => {
					if (closePromise === pendingClose) closePromise = undefined;
					throw cause;
				});
				closePromise = pendingClose;
				return closePromise;
			};
			return {
				read,
				identities,
				prepare: compile,
				close
			};
		};
	})))();
}

//#endregion
//#region dist/process/ProcessLifecycle.js
var PROCESS_CLEANUP_VERIFICATION_GRACE_MS, PROCESS_CLEANUP_VERIFICATION_INTERVAL_MS, processIdentityHasExited, processIdentityIsExiting;
function init_ProcessLifecycle() {
	return (init_ProcessLifecycle = __esmMin((() => {
		PROCESS_CLEANUP_VERIFICATION_GRACE_MS = 1e3;
		PROCESS_CLEANUP_VERIFICATION_INTERVAL_MS = 25;
		processIdentityHasExited = (identity) => identity?.state === "absent" || identity?.state === "readable" && identity.lifecycle?.state === "observed" && (identity.lifecycle.lifecycle === "zombie" || identity.lifecycle.lifecycle === "dead");
		processIdentityIsExiting = (identity) => identity?.state === "readable" && identity.lifecycle?.state === "observed" && identity.lifecycle.lifecycle === "exiting";
	})))();
}

//#endregion
//#region dist/process/LinuxProcessStat.js
var parseLinuxProcessStat;
function init_LinuxProcessStat() {
	return (init_LinuxProcessStat = __esmMin((() => {
		parseLinuxProcessStat = (value) => {
			const commandStart = value.indexOf("(");
			const commandEnd = value.lastIndexOf(")");
			if (commandStart <= 0 || commandEnd <= commandStart) return undefined;
			const pidText = value.slice(0, commandStart).trim();
			if (!/^\d+$/u.test(pidText)) return undefined;
			const pid = Number(pidText);
			if (!Number.isSafeInteger(pid) || pid <= 0) return undefined;
			const fields = value.slice(commandEnd + 1).trim().split(/\s+/u);
			const state = fields[0];
			const parentPidText = fields[1];
			const processGroupIdText = fields[2];
			const sessionIdText = fields[3];
			const startTime = fields[19];
			if (state === undefined || !/^[A-Za-z]$/u.test(state) || parentPidText === undefined || !/^\d+$/u.test(parentPidText) || processGroupIdText === undefined || !/^(?:-1|\d+)$/u.test(processGroupIdText) || sessionIdText === undefined || !/^(?:-1|\d+)$/u.test(sessionIdText) || startTime === undefined || !/^\d+$/u.test(startTime)) return undefined;
			const parentPid = Number(parentPidText);
			const processGroupId = Number(processGroupIdText);
			const sessionId = Number(sessionIdText);
			if (!Number.isSafeInteger(parentPid) || !Number.isSafeInteger(processGroupId) || !Number.isSafeInteger(sessionId)) return undefined;
			const flagsText = fields[6];
			const flags = flagsText !== undefined && /^\d+$/u.test(flagsText) ? Number(flagsText) : Number.NaN;
			const lifecycle = state === "Z" ? "zombie" : state === "X" || state === "x" ? "dead" : !Number.isSafeInteger(flags) ? undefined : (flags & 4) !== 0 ? "exiting" : "non-zombie";
			return {
				pid,
				name: value.slice(commandStart + 1, commandEnd),
				startTime,
				lifecycle,
				parentPid,
				processGroupId,
				sessionId
			};
		};
	})))();
}

//#endregion
//#region dist/process/LinuxProcessStatus.js
var parseLinuxProcessIds, linuxEnvironmentRestriction;
function init_LinuxProcessStatus() {
	return (init_LinuxProcessStatus = __esmMin((() => {
		parseLinuxProcessIds = (value, row) => {
			let ids;
			for (const line of value.split("\n")) {
				if (!line.startsWith(`${row}:`)) continue;
				if (ids !== undefined) return undefined;
				const match = /^[UG]id:\s+([0-9]+)\s+([0-9]+)\s+([0-9]+)\s+([0-9]+)\s*$/u.exec(line);
				if (match === null) return undefined;
				const [real, effective, saved, filesystem] = match.slice(1).map(Number);
				if (real === undefined || effective === undefined || saved === undefined || filesystem === undefined || [
					real,
					effective,
					saved,
					filesystem
				].some((id) => !Number.isSafeInteger(id) || id < 0)) return undefined;
				ids = [
					real,
					effective,
					saved,
					filesystem
				];
			}
			return ids;
		};
		linuxEnvironmentRestriction = (facts) => {
			const { uids, gids, procfsOwnerUid, callerUid, callerGid } = facts;
			if (callerUid !== undefined && uids.slice(0, 3).some((uid) => uid !== callerUid) || callerGid !== undefined && gids !== undefined && gids.slice(0, 3).some((gid) => gid !== callerGid)) return "credentials";
			return procfsOwnerUid !== undefined && procfsOwnerUid !== uids[1] ? "non-dumpable" : undefined;
		};
	})))();
}

//#endregion
//#region dist/process/ProcessCommandIdentity.js
var matchesOwnedProcessCommand;
function init_ProcessCommandIdentity() {
	return (init_ProcessCommandIdentity = __esmMin((() => {
		matchesOwnedProcessCommand = (actual, expected, platform = process.platform) => {
			const actualCommand = actual.trim();
			const expectedCommand = expected.trim();
			if (actualCommand === expectedCommand || actualCommand.startsWith(`${expectedCommand} `)) return true;
			if (platform !== "darwin") return false;
			const actualExecutable = actualCommand.split(/\s+/u, 1)[0];
			const expectedExecutable = expectedCommand.split(/\s+/u, 1)[0];
			const normalizedActualExecutable = actualExecutable?.startsWith("(") === true && actualExecutable.endsWith(")") ? actualExecutable.slice(1, -1) : actualExecutable;
			return normalizedActualExecutable !== undefined && expectedExecutable !== undefined && basename(normalizedActualExecutable) === basename(expectedExecutable);
		};
	})))();
}

//#endregion
//#region dist/process/ProcessOwnershipIdentity.js
var launcherIdentityFailure;
function init_ProcessOwnershipIdentity() {
	return (init_ProcessOwnershipIdentity = __esmMin((() => {
		init_ProcessCommandIdentity();
		launcherIdentityFailure = (launcher, ownership) => {
			if (launcher.processGroupId !== ownership.processGroupId) return "owned launcher process-group identity did not match";
			if (ownership.expectedParentPid !== undefined && launcher.parentPid !== ownership.expectedParentPid) return "owned launcher parent identity did not match";
			if (ownership.expectedCommand !== undefined && !matchesOwnedProcessCommand(launcher.command, ownership.expectedCommand)) return `owned launcher command identity did not match (observed=${launcher.command}; expected=${ownership.expectedCommand})`;
			return null;
		};
	})))();
}

//#endregion
//#region dist/process/ProcessOwnershipProcessTree.js
var liveProcesses, descendantsOf, selectCapturedProcessGroupIds;
function init_ProcessOwnershipProcessTree() {
	return (init_ProcessOwnershipProcessTree = __esmMin((() => {
		liveProcesses = (members) => members.filter(({ state }) => !state.startsWith("Z"));
		descendantsOf = (rootPids, processes) => {
			const childrenByParent = new Map();
			for (const process of processes) {
				const siblings = childrenByParent.get(process.parentPid) ?? [];
				siblings.push(process);
				childrenByParent.set(process.parentPid, siblings);
			}
			const descendants = [];
			const pending = rootPids.flatMap((pid) => childrenByParent.get(pid) ?? []);
			const visited = new Set(rootPids);
			for (const process of pending) {
				if (visited.has(process.pid)) continue;
				visited.add(process.pid);
				descendants.push(process);
				pending.push(...childrenByParent.get(process.pid) ?? []);
			}
			return descendants;
		};
		selectCapturedProcessGroupIds = (rootPid, samples) => {
			const processGroupIds = new Set([rootPid]);
			for (const sample of samples) {
				if (sample.pid === sample.process_group_id) processGroupIds.add(sample.pid);
			}
			return [...processGroupIds];
		};
	})))();
}

//#endregion
//#region dist/process/ProcessRunTokenObservations.js
/** Read only ownership tokens, using per-process fallback for missing batch rows. */
async function* readProcessRunTokens(host, processes, signal) {
	signal?.throwIfAborted();
	if (processes.length === 0) return;
	let batch;
	let batchFailure;
	if (host.runTokens !== undefined) {
		try {
			batch = signal === undefined ? await host.runTokens(processes) : await host.runTokens(processes, signal);
		} catch (cause) {
			signal?.throwIfAborted();
			batchFailure = errorMessage$1(cause);
		}
	}
	for (const process of processes) {
		signal?.throwIfAborted();
		let observation = batch?.get(process.pid);
		if (observation === undefined) {
			try {
				const environment = signal === undefined ? await host.environment(process.pid) : await host.environment(process.pid, signal);
				observation = {
					state: "readable",
					runId: processRunIdFromEnvironment(environment)
				};
			} catch (cause) {
				signal?.throwIfAborted();
				const reason = errorMessage$1(cause);
				const code = cause instanceof Error && "code" in cause && typeof cause.code === "string" ? cause.code : undefined;
				observation = {
					state: "unavailable",
					...code === undefined ? {} : { code },
					reason: batchFailure === undefined ? reason : `${reason}; run-token batch failed: ${batchFailure}`
				};
			}
		}
		signal?.throwIfAborted();
		yield {
			process,
			observation
		};
	}
}
var ProcessRunTokenReadError, errorMessage$1, processRunIdFromEnvironment, readRunTokenCarriers;
function init_ProcessRunTokenObservations() {
	return (init_ProcessRunTokenObservations = __esmMin((() => {
		init_ProcessOwnershipProcessTree();
		ProcessRunTokenReadError = class extends Error {
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
		};
		errorMessage$1 = (cause) => cause instanceof Error ? cause.message : String(cause);
		processRunIdFromEnvironment = (environment) => Object.hasOwn(environment, "REA_PROCESS_RUN_ID") ? environment.REA_PROCESS_RUN_ID : undefined;
		readRunTokenCarriers = async (host, runId, signal) => {
			const carriers = [];
			const processes = liveProcesses(signal === undefined ? await host.listProcesses() : await host.listProcesses(signal));
			for await (const { process, observation } of readProcessRunTokens(host, processes, signal)) if (observation.state === "readable" && observation.runId === runId) carriers.push(process);
			return carriers;
		};
	})))();
}

//#endregion
//#region dist/process/ProcessOwnershipObservation.js
var observeOwnedProcessGroups, observeOwnedProcessLineage, observeNativeOwnedProcessLineage, classifyIdentitylessLineageRefresh, processWithNativeRelation, lineageTokenMismatchReason, unavailableLineage, parseProcessEnvironment, identityFact, readIdentityFacts, readNativeProcessIdentityMap, settleExitingProcessIdentities, settleVanishedTokenFacts, readProcessOwnershipFacts, TOKEN_READ_RETRY_ATTEMPTS, TOKEN_READ_RETRY_DELAY_MS, reobserveUnavailableTokenFacts, isExpectedAbort, createSystemProcessOwnershipHost, systemProcessOwnershipHost, observeProcessStartIdentity, observeProcessStartIdentityExit, signalProcessWithStartIdentity, LinuxOwnedProcessPrerequisiteError, prepareProcessOwnershipInspection, processIsGone, errorMessage;
function init_ProcessOwnershipObservation() {
	return (init_ProcessOwnershipObservation = __esmMin((() => {
		init_ProcessAdmissionError();
		init_ProcessLifecycle();
		init_LinuxProcessStat();
		init_LinuxProcessStatus();
		init_analysisErrorCore();
		init_ProcessOwnershipIdentity();
		init_ProcessOwnershipProcessTree();
		init_ExecFileOutput();
		init_DarwinProcessRunTokenReader();
		init_DarwinHelperCache();
		init_ProcessRunTokenObservations();
		observeOwnedProcessGroups = async (runId, processGroupIds, host = systemProcessOwnershipHost, signal, evidenceOwner) => {
			signal?.throwIfAborted();
			const groupIds = [...new Set(processGroupIds)];
			if (groupIds.length === 0) return new Map();
			let processes;
			try {
				processes = liveProcesses(await host.listProcesses(signal));
			} catch (cause) {
				signal?.throwIfAborted();
				const failure = {
					state: "unverifiable",
					reason: `process group could not be inspected: ${errorMessage(cause)}`
				};
				return new Map(groupIds.map((groupId) => [groupId, failure]));
			}
			signal?.throwIfAborted();
			if (host.processIdentities !== undefined) {
				const observationRows = evidenceOwner?.rowsForObservation(processes) ?? processes;
				const retainedPids = new Set(evidenceOwner?.candidates.map(({ pid }) => pid) ?? []);
				const firstIdentities = await readNativeProcessIdentityMap(observationRows, host, signal);
				const uncertainGroups = new Set();
				const candidateProcesses = observationRows.filter((process) => {
					if (retainedPids.has(process.pid)) return true;
					const identity = firstIdentities.get(process.pid);
					if (identity?.state === "readable") {
						if (processIdentityHasExited(identity)) return false;
						if (identity.relation?.state === "observed" && groupIds.includes(identity.relation.processGroupId)) return true;
						if (groupIds.includes(process.processGroupId) && identity.relation?.state !== "observed") uncertainGroups.add(process.processGroupId);
						return groupIds.includes(process.processGroupId);
					}
					if (groupIds.includes(process.processGroupId)) uncertainGroups.add(process.processGroupId);
					return groupIds.includes(process.processGroupId);
				});
				const facts = await readProcessOwnershipFacts(candidateProcesses, host, signal, { identityBefore: firstIdentities });
				evidenceOwner?.reconcile(facts, {
					runId,
					listedRows: processes.length,
					listedPids: new Set(processes.map(({ pid }) => pid)),
					leaderPid: -1,
					processGroupIds: new Set(groupIds),
					scopeFacts: facts
				});
				const observations = new Map(groupIds.map((groupId) => [groupId, uncertainGroups.has(groupId) ? {
					state: "unverifiable",
					reason: "native process-group membership could not be verified"
				} : { state: "empty" }]));
				for (const fact of facts) {
					if (fact.identityAfter.state === "absent") continue;
					const nativeGroupId = fact.identityAfter.state === "readable" && fact.identityAfter.relation?.state === "observed" ? fact.identityAfter.relation.processGroupId : undefined;
					if (processIdentityHasExited(fact.identityAfter)) continue;
					const candidateGroups = groupIds.filter((groupId) => nativeGroupId === groupId || nativeGroupId === undefined && fact.process.processGroupId === groupId);
					for (const groupId of candidateGroups) {
						if (observations.get(groupId)?.state === "unverifiable") continue;
						if (fact.state !== "same-generation" || fact.identityAfter.state !== "readable" || nativeGroupId !== groupId) {
							observations.set(groupId, {
								state: "unverifiable",
								reason: `native process-group membership could not be revalidated for PID ${String(fact.process.pid)}`
							});
							continue;
						}
						if (fact.token.state !== "readable" || fact.token.runId !== runId) {
							observations.set(groupId, {
								state: "unverifiable",
								reason: fact.token.state === "unavailable" ? `process ownership could not be revalidated for PID ${String(fact.process.pid)}: ${fact.token.reason}` : "process ownership did not match"
							});
							continue;
						}
						observations.set(groupId, { state: "alive" });
					}
				}
				signal?.throwIfAborted();
				return observations;
			}
			const membersByGroup = new Map(groupIds.map((groupId) => [groupId, []]));
			for (const process of processes) membersByGroup.get(process.processGroupId)?.push(process);
			const observations = new Map(groupIds.map((groupId) => [groupId, (membersByGroup.get(groupId)?.length ?? 0) > 0 ? { state: "alive" } : { state: "empty" }]));
			const liveMembers = groupIds.flatMap((groupId) => membersByGroup.get(groupId) ?? []);
			const pendingGroups = new Set(groupIds.filter((groupId) => (membersByGroup.get(groupId)?.length ?? 0) > 0));
			for await (const { process: member, observation } of readProcessRunTokens(host, liveMembers, signal)) {
				if (!pendingGroups.has(member.processGroupId)) continue;
				if (observation.state === "readable") {
					if (observation.runId !== runId) {
						observations.set(member.processGroupId, {
							state: "unverifiable",
							reason: "process ownership did not match"
						});
						pendingGroups.delete(member.processGroupId);
					}
				} else {
					const gone = await processIsGone(host, member.pid, signal);
					signal?.throwIfAborted();
					if (!gone) {
						observations.set(member.processGroupId, {
							state: "unverifiable",
							reason: `process ownership could not be revalidated for PID ${member.pid}: ${observation.reason}`
						});
						pendingGroups.delete(member.processGroupId);
					}
				}
				if (pendingGroups.size === 0) break;
			}
			signal?.throwIfAborted();
			return observations;
		};
		observeOwnedProcessLineage = async (ownership, host = systemProcessOwnershipHost) => {
			let processes;
			try {
				processes = liveProcesses(await host.listProcesses());
			} catch (cause) {
				return unavailableLineage(ownership, `process table could not be inspected: ${errorMessage(cause)}`);
			}
			if (host.processIdentities !== undefined) return observeNativeOwnedProcessLineage(ownership, processes, host);
			const launcher = processes.find(({ pid }) => pid === ownership.leaderPid);
			if (launcher === undefined) return unavailableLineage(ownership, "owned launcher is not live");
			const identityFailure = launcherIdentityFailure(launcher, ownership);
			if (identityFailure !== null) return unavailableLineage(ownership, identityFailure);
			const descendants = descendantsOf([launcher.pid], processes);
			const verifiedDescendants = [];
			const initialTree = new Set(descendants.map(({ pid }) => pid));
			const initialRelations = new Map();
			const examinedRefresh = new Map();
			for (const process of processes) {
				if (process.pid === launcher.pid) continue;
				const relation = {
					parentPid: process.parentPid,
					processGroupId: process.processGroupId,
					inTree: initialTree.has(process.pid),
					tokenChecked: false,
					descendant: undefined
				};
				initialRelations.set(process.pid, relation);
				examinedRefresh.set(process.pid, relation);
			}
			let refreshDescendants = [];
			let suppressedRefreshPids = new Set();
			let latestRefreshPids;
			for await (const { process: member, observation } of readProcessRunTokens(host, [launcher, ...descendants])) {
				if (observation.state === "readable") {
					if (observation.runId !== ownership.runId) return unavailableLineage(ownership, lineageTokenMismatchReason(member.pid, observation.runId));
					if (member.pid !== launcher.pid) verifiedDescendants.push(member);
					const seeded = examinedRefresh.get(member.pid);
					if (seeded !== undefined) examinedRefresh.set(member.pid, {
						...seeded,
						tokenChecked: true
					});
				} else {
					let refreshed;
					try {
						refreshed = liveProcesses(await host.listProcesses());
					} catch (cause) {
						void cause;
						return unavailableLineage(ownership, `process ownership could not be revalidated for PID ${member.pid}: ${observation.reason}`);
					}
					if (refreshed.some((process) => process.pid === member.pid)) return unavailableLineage(ownership, `process ownership could not be revalidated for PID ${member.pid}: ${observation.reason}`);
					if (member.pid === launcher.pid) return unavailableLineage(ownership, "owned launcher exited during lineage validation");
					const classified = await classifyIdentitylessLineageRefresh(ownership, launcher.pid, refreshed, host, examinedRefresh, initialRelations);
					if (classified.status === "unavailable") return unavailableLineage(ownership, classified.reason);
					refreshDescendants = classified.descendants;
					suppressedRefreshPids = new Set(classified.suppressedPids);
					latestRefreshPids = new Set(refreshed.map(({ pid }) => pid));
				}
			}
			return {
				status: "verified",
				observedAt: new Date().toISOString(),
				lineage: {
					runId: ownership.runId,
					launcherPid: launcher.pid,
					launcherParentPid: launcher.parentPid,
					processGroupId: launcher.processGroupId,
					descendants: [...verifiedDescendants.filter(({ pid }) => (latestRefreshPids === undefined || latestRefreshPids.has(pid)) && !suppressedRefreshPids.has(pid) && !refreshDescendants.some((descendant) => descendant.pid === pid)), ...refreshDescendants].sort((left, right) => left.pid - right.pid).map(({ pid, parentPid, processGroupId }) => ({
						pid,
						parentPid,
						processGroupId
					}))
				}
			};
		};
		observeNativeOwnedProcessLineage = async (ownership, processes, host) => {
			const initialIdentities = await readNativeProcessIdentityMap(processes, host);
			const launcher = processes.find(({ pid }) => pid === ownership.leaderPid);
			const launcherIdentity = launcher === undefined ? undefined : initialIdentities.get(launcher.pid);
			const nativeLauncher = launcher !== undefined && launcherIdentity?.state === "readable" && !processIdentityHasExited(launcherIdentity) ? processWithNativeRelation(launcher, launcherIdentity) : undefined;
			const identityFailure = nativeLauncher === undefined ? null : launcherIdentityFailure(nativeLauncher, ownership);
			const candidateProcesses = processes.map((process) => {
				const identity = initialIdentities.get(process.pid);
				const nativeProcess = identity?.state === "readable" ? processWithNativeRelation(process, identity) : undefined;
				return nativeProcess ?? process;
			});
			const descendants = descendantsOf([ownership.leaderPid], candidateProcesses);
			const lineageRows = [...launcher === undefined ? [] : [launcher], ...descendants];
			const nativeExitedPids = new Set(processes.filter(({ pid }) => processIdentityHasExited(initialIdentities.get(pid))).map(({ pid }) => pid));
			const candidates = lineageRows.filter(({ pid }) => !nativeExitedPids.has(pid));
			const facts = await readProcessOwnershipFacts(candidates, host, undefined, { identityBefore: initialIdentities });
			ownership.evidenceOwner?.reconcile(facts, {
				runId: ownership.runId,
				listedRows: processes.length,
				listedPids: new Set(processes.map(({ pid }) => pid)),
				leaderPid: ownership.leaderPid,
				processGroupIds: new Set([ownership.processGroupId, ...ownership.sampledProcessGroupIds ?? []]),
				allowCapturedScope: identityFailure === null,
				nativeExitedPids,
				unverifiedLineageRelations: new Map(lineageRows.map(({ pid, parentPid, processGroupId }) => [pid, {
					parentPid,
					processGroupId
				}]))
			});
			if (launcher === undefined) return unavailableLineage(ownership, "owned launcher is not live");
			if (launcherIdentity?.state === "absent") return unavailableLineage(ownership, "owned launcher is not live");
			if (launcherIdentity?.state !== "readable") return unavailableLineage(ownership, `owned launcher identity could not be read: ${launcherIdentity?.reason ?? "identity observation was omitted"}`);
			if (processIdentityHasExited(launcherIdentity)) return unavailableLineage(ownership, "owned launcher is not live");
			if (nativeLauncher === undefined) return unavailableLineage(ownership, "owned launcher native parent/group relation was unavailable");
			if (identityFailure !== null) return unavailableLineage(ownership, identityFailure);
			const factsByPid = new Map(facts.map((fact) => [fact.process.pid, fact]));
			const verifiedDescendants = [];
			let currentLauncher = nativeLauncher;
			for (const member of candidates) {
				const fact = factsByPid.get(member.pid);
				if (fact === undefined) return unavailableLineage(ownership, `native process facts were unavailable for PID ${String(member.pid)}`);
				if (fact.state === "absent") {
					if (member.pid === ownership.leaderPid) return unavailableLineage(ownership, "owned launcher exited during lineage validation");
					continue;
				}
				if (fact.state !== "same-generation") return unavailableLineage(ownership, `process identity changed or became unavailable during lineage validation for PID ${String(member.pid)}`);
				if (processIdentityHasExited(fact.identityAfter)) {
					if (member.pid === ownership.leaderPid) return unavailableLineage(ownership, "owned launcher exited during lineage validation");
					continue;
				}
				if (fact.token.state !== "readable") return unavailableLineage(ownership, `process ownership could not be revalidated for PID ${String(member.pid)}: ${fact.token.reason}`);
				if (fact.token.runId !== ownership.runId) return unavailableLineage(ownership, lineageTokenMismatchReason(member.pid, fact.token.runId));
				const nativeMember = processWithNativeRelation(fact.process, fact.identityAfter);
				if (nativeMember === undefined) return unavailableLineage(ownership, `native process relation was unavailable for PID ${String(member.pid)}`);
				if (member.pid === ownership.leaderPid) {
					const failure = launcherIdentityFailure(nativeMember, ownership);
					if (failure !== null) return unavailableLineage(ownership, failure);
					currentLauncher = nativeMember;
					continue;
				}
				verifiedDescendants.push(nativeMember);
			}
			const currentDescendantPids = new Set(descendantsOf([ownership.leaderPid], [currentLauncher, ...verifiedDescendants]).map(({ pid }) => pid));
			const moved = verifiedDescendants.find(({ pid }) => !currentDescendantPids.has(pid));
			if (moved !== undefined) return unavailableLineage(ownership, `process lineage relation changed during validation for PID ${String(moved.pid)}`);
			return {
				status: "verified",
				observedAt: new Date().toISOString(),
				lineage: {
					runId: ownership.runId,
					launcherPid: ownership.leaderPid,
					launcherParentPid: currentLauncher.parentPid,
					processGroupId: currentLauncher.processGroupId,
					descendants: verifiedDescendants.sort((left, right) => left.pid - right.pid).map(({ pid, parentPid, processGroupId }) => ({
						pid,
						parentPid,
						processGroupId
					}))
				}
			};
		};
		classifyIdentitylessLineageRefresh = async (ownership, launcherPid, refreshed, host, examined, initialRelations) => {
			const refreshedLauncher = refreshed.find((process) => process.pid === launcherPid);
			if (refreshedLauncher === undefined) return {
				status: "unavailable",
				reason: "owned launcher exited during lineage validation"
			};
			for await (const { observation } of readProcessRunTokens(host, [refreshedLauncher])) {
				if (observation.state !== "readable") return {
					status: "unavailable",
					reason: `process ownership could not be revalidated for PID ${String(launcherPid)}: ${observation.reason}`
				};
				if (observation.runId !== ownership.runId) return {
					status: "unavailable",
					reason: lineageTokenMismatchReason(launcherPid, observation.runId)
				};
			}
			const identityFailure = launcherIdentityFailure(refreshedLauncher, ownership);
			if (identityFailure !== null) return {
				status: "unavailable",
				reason: identityFailure
			};
			const inTree = new Set(descendantsOf([launcherPid], refreshed).map(({ pid }) => pid));
			const due = refreshed.filter((process) => {
				if (process.pid === launcherPid) return false;
				const previous = examined.get(process.pid);
				return previous === undefined || previous.tokenChecked || previous.parentPid !== process.parentPid || previous.processGroupId !== process.processGroupId || previous.inTree !== inTree.has(process.pid);
			});
			if (due.length > 0) {
				const included = new Map();
				const ownedOutside = [];
				for await (const { process, observation } of readProcessRunTokens(host, due)) {
					if (observation.state !== "readable") return {
						status: "unavailable",
						reason: `process ownership could not be revalidated for PID ${String(process.pid)}: ${observation.reason}`
					};
					if (observation.runId !== ownership.runId) {
						if (inTree.has(process.pid)) return {
							status: "unavailable",
							reason: lineageTokenMismatchReason(process.pid, observation.runId)
						};
						continue;
					}
					if (inTree.has(process.pid)) included.set(process.pid, process);
					else ownedOutside.push(process.pid);
				}
				if (ownedOutside.length > 0) return {
					status: "unavailable",
					reason: `process lineage refresh contained owned PID(s) outside the observed descendants: ${ownedOutside.sort((left, right) => left - right).join(", ")}`
				};
				for (const process of due) examined.set(process.pid, {
					parentPid: process.parentPid,
					processGroupId: process.processGroupId,
					inTree: inTree.has(process.pid),
					tokenChecked: true,
					descendant: included.get(process.pid)
				});
			}
			const livePids = new Set(refreshed.map(({ pid }) => pid));
			for (const pid of examined.keys()) if (!livePids.has(pid)) examined.delete(pid);
			const suppressedPids = [...examined.keys()].filter((pid) => {
				const seed = initialRelations.get(pid);
				const entry = examined.get(pid);
				return seed !== undefined && entry !== undefined && (seed.parentPid !== entry.parentPid || seed.processGroupId !== entry.processGroupId || seed.inTree !== entry.inTree);
			});
			return {
				status: "classified",
				descendants: [...examined.values()].flatMap((entry) => entry.descendant === undefined ? [] : [entry.descendant]),
				suppressedPids
			};
		};
		processWithNativeRelation = (process, identity) => identity.state === "readable" && identity.relation?.state === "observed" ? {
			...process,
			parentPid: identity.relation.parentPid,
			processGroupId: identity.relation.processGroupId
		} : undefined;
		lineageTokenMismatchReason = (pid, observedRunId) => observedRunId === undefined ? `REA_PROCESS_RUN_ID was absent from the readable environment for PID ${String(pid)}; process lineage ownership remains unverified` : "process lineage contains an unowned or PID-reused process";
		unavailableLineage = (ownership, reason) => ({
			status: "unavailable",
			observedAt: new Date().toISOString(),
			runId: ownership.runId,
			launcherPid: ownership.leaderPid,
			processGroupId: ownership.processGroupId,
			reason
		});
		parseProcessEnvironment = (value) => {
			const environment = Object.create(null);
			for (const entry of value.split("\0")) {
				const separator = entry.indexOf("=");
				if (separator > 0) environment[entry.slice(0, separator)] = entry.slice(separator + 1);
			}
			return environment;
		};
		identityFact = (observations, pid, phase, failure) => observations?.get(pid) ?? {
			state: "unavailable",
			reason: failure ?? `process identity was not returned during ${phase} observation`
		};
		readIdentityFacts = async (processes, host, phase, signal, credentialPids) => {
			signal?.throwIfAborted();
			if (host.processIdentities === undefined) return new Map(processes.map(({ pid }) => [pid, {
				state: "unavailable",
				reason: "process identity inspection is unsupported"
			}]));
			try {
				const observations = await host.processIdentities(processes, signal, credentialPids);
				signal?.throwIfAborted();
				return new Map(processes.map(({ pid }) => [pid, identityFact(observations, pid, phase)]));
			} catch (cause) {
				signal?.throwIfAborted();
				const reason = errorMessage(cause);
				return new Map(processes.map(({ pid }) => [pid, identityFact(undefined, pid, phase, reason)]));
			}
		};
		readNativeProcessIdentityMap = async (processes, host, signal) => readIdentityFacts(processes, host, "before", signal);
		settleExitingProcessIdentities = async (processes, host, initial, signal, budget = { deadline: undefined }, credentialPids) => {
			signal?.throwIfAborted();
			let pending = processes.filter(({ pid }) => processIdentityIsExiting(initial.get(pid)));
			if (pending.length === 0) return initial;
			const identities = new Map(initial);
			const deadline = budget.deadline ??= performance.now() + PROCESS_CLEANUP_VERIFICATION_GRACE_MS;
			while (pending.length > 0) {
				const remaining = deadline - performance.now();
				if (remaining <= 0) break;
				try {
					await setTimeout(Math.min(25, remaining), undefined, signal === undefined ? undefined : { signal });
				} catch (cause) {
					signal?.throwIfAborted();
					throw cause;
				}
				const refreshed = await readIdentityFacts(pending, host, "before", signal, credentialPids);
				for (const { pid } of pending) identities.set(pid, identityFact(refreshed, pid, "after"));
				pending = pending.filter(({ pid }) => {
					const first = initial.get(pid);
					const current = identities.get(pid);
					return first?.state === "readable" && current?.state === "readable" && processIdentityIsExiting(current) && current.identity === first.identity;
				});
			}
			signal?.throwIfAborted();
			return identities;
		};
		settleVanishedTokenFacts = async (facts, host, budget, signal) => {
			if ((host.platform ?? process.platform) !== "linux") return facts;
			let pending = facts.filter(({ token, identityAfter }) => token.state === "unavailable" && (token.code === "ENOENT" || token.code === "ESRCH") && !processIdentityHasExited(identityAfter)).map(({ process }) => process);
			if (pending.length === 0) return facts;
			let current = facts;
			const deadline = budget.deadline ??= performance.now() + PROCESS_CLEANUP_VERIFICATION_GRACE_MS;
			for (let attempt = 0; attempt < 4 && pending.length > 0; attempt += 1) {
				signal?.throwIfAborted();
				if (attempt > 0) {
					const remaining = deadline - performance.now();
					if (remaining <= 0) break;
					await setTimeout(Math.min(40, remaining), undefined, signal === undefined ? undefined : { signal });
				}
				const confirmed = await readNativeProcessIdentityMap(pending, host, signal);
				const pendingPids = new Set(pending.map(({ pid }) => pid));
				const nextPending = new Set();
				current = current.map((fact) => {
					if (!pendingPids.has(fact.process.pid)) return fact;
					const after = confirmed.get(fact.process.pid);
					if (after?.state === "absent") return {
						...fact,
						state: "absent",
						identityAfter: after,
						beforeExitSettlement: fact.beforeExitSettlement ?? fact
					};
					const previous = fact.identityAfter;
					if (previous.state !== "readable" || after?.state !== "readable") return fact;
					if (previous.identity !== after.identity) return {
						...fact,
						state: "unavailable",
						identityAfter: {
							state: "unavailable",
							reason: "process_identity_changed_during_final_token_exit_check"
						}
					};
					if (processIdentityHasExited(after)) return {
						...fact,
						identityAfter: after,
						beforeExitSettlement: fact.beforeExitSettlement ?? fact
					};
					nextPending.add(fact.process.pid);
					return fact;
				});
				pending = pending.filter(({ pid }) => nextPending.has(pid));
			}
			signal?.throwIfAborted();
			return current;
		};
		readProcessOwnershipFacts = async (processes, host, signal, options = {}) => {
			signal?.throwIfAborted();
			if (processes.length === 0) return [];
			const identityBefore = options.identityBefore === undefined ? await readIdentityFacts(processes, host, "before", signal) : new Map(processes.map(({ pid }) => [pid, identityFact(options.identityBefore, pid, "before")]));
			signal?.throwIfAborted();
			const tokens = new Map();
			try {
				for await (const { process, observation } of readProcessRunTokens(host, processes, signal)) {
					signal?.throwIfAborted();
					tokens.set(process.pid, observation);
				}
			} catch (cause) {
				signal?.throwIfAborted();
				const reason = errorMessage(cause);
				for (const { pid } of processes) if (!tokens.has(pid)) tokens.set(pid, {
					state: "unavailable",
					reason
				});
			}
			signal?.throwIfAborted();
			const credentialPids = new Set(processes.filter(({ pid }) => tokens.get(pid)?.state !== "readable").map(({ pid }) => pid));
			const observedAfter = await readIdentityFacts(processes, host, "after", signal, credentialPids);
			let finalObservedAfter = observedAfter;
			if ((host.platform ?? process.platform) === "linux") {
				const disappearing = processes.filter(({ pid }) => {
					const token = tokens.get(pid);
					return token?.state === "unavailable" && (token.code === "ENOENT" || token.code === "ESRCH") && observedAfter.get(pid)?.state === "readable";
				});
				if (disappearing.length > 0) {
					const refreshed = await readIdentityFacts(disappearing, host, "after", signal, credentialPids);
					const confirmed = new Map(observedAfter);
					for (const { pid } of disappearing) {
						const before = observedAfter.get(pid);
						const after = refreshed.get(pid);
						if (after?.state === "absent") {
							confirmed.set(pid, after);
						} else if (before?.state === "readable" && after?.state === "readable") {
							if (before.identity !== after.identity) confirmed.set(pid, {
								state: "unavailable",
								reason: "process_identity_changed_during_environment_exit_check"
							});
							else if (processIdentityHasExited(after)) confirmed.set(pid, after);
						}
					}
					finalObservedAfter = confirmed;
				}
			}
			const identityAfter = await settleExitingProcessIdentities(processes, host, finalObservedAfter, signal, options.exitSettlement, credentialPids);
			signal?.throwIfAborted();
			const deriveFact = (process, observation) => {
				const before = identityBefore.get(process.pid) ?? {
					state: "unavailable",
					reason: "process identity was not returned during before observation"
				};
				const after = observation ?? {
					state: "unavailable",
					reason: "process identity was not returned during after observation"
				};
				const token = tokens.get(process.pid) ?? {
					state: "unavailable",
					reason: "process token was not returned"
				};
				const state = after.state === "absent" ? "absent" : before.state === "readable" && after.state === "readable" ? before.identity === after.identity ? "same-generation" : "replaced" : before.state === "absent" && after.state === "readable" ? "replaced" : "unavailable";
				return {
					process,
					state,
					identityBefore: before,
					token,
					identityAfter: after
				};
			};
			const facts = processes.map((process) => {
				const after = identityAfter.get(process.pid);
				const original = observedAfter.get(process.pid);
				const fact = deriveFact(process, after);
				return after === original ? fact : {
					...fact,
					beforeExitSettlement: deriveFact(process, original)
				};
			});
			signal?.throwIfAborted();
			return facts;
		};
		TOKEN_READ_RETRY_ATTEMPTS = 3;
		TOKEN_READ_RETRY_DELAY_MS = 40;
		reobserveUnavailableTokenFacts = async (facts, host, exitSettlement, scope) => {
			const settled = ({ identityAfter }) => processIdentityHasExited(identityAfter) || processIdentityIsExiting(identityAfter);
			const transient = (fact) => fact.token.state === "unavailable" && !settled(fact) && (scope.generation === "current" || fact.state === "same-generation");
			const reread = (fact) => transient(fact) || scope.generation === "first-observed" && fact.state === "same-generation" && !settled(fact) && fact.token.state === "readable" && fact.token.runId === scope.runId;
			const bind = (fact, next) => {
				if (next === undefined || scope.generation === "current") return next ?? fact;
				if (fact.identityAfter.state !== "readable") return fact;
				const first = fact.identityAfter.identity;
				if (next.identityAfter.state === "absent") return next;
				if ([next.identityBefore, next.identityAfter].some((identity) => identity.state === "readable" && identity.identity !== first)) return {
					...fact,
					state: "unavailable",
					identityAfter: {
						state: "unavailable",
						reason: "process_identity_changed_during_token_reread"
					}
				};
				return next.state === "same-generation" || fact.token.state === "readable" ? next : fact;
			};
			let current = facts;
			for (let attempt = 0; attempt < 3; attempt += 1) {
				if (!current.some(transient)) break;
				await setTimeout(40);
				const next = new Map((await readProcessOwnershipFacts(current.filter(reread).map(({ process }) => process), host, undefined, { exitSettlement })).map((fact) => [fact.process.pid, fact]));
				current = current.map((fact) => bind(fact, next.get(fact.process.pid)));
			}
			return current;
		};
		isExpectedAbort = (cause, signal) => signal?.aborted === true && (cause === signal.reason || cause instanceof Error && cause.name === "AbortError");
		createSystemProcessOwnershipHost = (platform = process.platform, hostEnvironment = process.env, options = {}) => {
			const darwinModuleCachePath = options.darwinModuleCachePath ?? hostEnvironment.REA_DARWIN_MODULE_CACHE_PATH;
			const swiftcPath = hostEnvironment.REA_DARWIN_SWIFTC_PATH;
			const darwinCompiler = options.darwinCompiler ?? (swiftcPath === undefined || swiftcPath === "" ? undefined : {
				kind: "swiftc",
				executable: swiftcPath,
				sdkRoot: hostEnvironment.SDKROOT ?? ""
			});
			const helperCacheDirectory = darwinHelperCacheDirectory({
				home: hostEnvironment.HOME,
				compilerSelected: darwinCompiler !== undefined,
				moduleCachePath: darwinModuleCachePath
			});
			const darwinTokens = platform === "darwin" ? createDarwinProcessRunTokenReader({
				environment: hostEnvironment,
				...darwinCompiler === undefined ? {} : { compiler: darwinCompiler },
				...darwinModuleCachePath === undefined ? {} : { moduleCachePath: darwinModuleCachePath },
				...helperCacheDirectory === undefined ? {} : { helperCacheDirectory },
				...options.compileTimeoutMs === undefined ? {} : { compileTimeoutMs: options.compileTimeoutMs }
			}) : undefined;
			const listProcesses = async (signal) => {
				if (platform === "win32") return [];
				const { stdout } = await execFileOutput("ps", ["-axo", "pid=,ppid=,pgid=,uid=,stat=,command="], {
					env: hostEnvironment,
					stopSignal: "SIGTERM",
					...signal === undefined ? {} : { signal }
				});
				return stdout.split("\n").map((line) => /\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(.*)/u.exec(line)).filter((match) => match !== null).map((match) => ({
					pid: Number(match[1]),
					parentPid: Number(match[2]),
					processGroupId: Number(match[3]),
					uid: Number(match[4]),
					state: match[5] ?? "",
					command: match[6] ?? ""
				}));
			};
			const processIdentities = async (processes, signal, credentialPids) => {
				if (processes.length === 0) return new Map();
				if (platform === "linux") return new Map(await Promise.all(processes.map(async ({ pid }) => {
					if (!Number.isSafeInteger(pid) || pid <= 0) return [pid, {
						state: "unavailable",
						reason: "invalid_process_id"
					}];
					try {
						const stat$1 = await readFile(`/proc/${String(pid)}/stat`, {
							encoding: "utf8",
							...signal === undefined ? {} : { signal }
						});
						const parsed = parseLinuxProcessStat(stat$1);
						if (parsed === undefined || parsed.pid !== pid) return [pid, {
							state: "unavailable",
							reason: "malformed_proc_stat"
						}];
						const readableIdentity = (facts, effectiveUid, environmentRestriction) => ({
							state: "readable",
							identity: `linux-starttime:${facts.startTime}`,
							...facts.name === "" ? {} : { name: facts.name },
							...effectiveUid === undefined ? {} : { effectiveUid },
							...environmentRestriction === undefined ? {} : { environmentRestriction },
							lifecycle: facts.lifecycle === undefined ? {
								state: "unavailable",
								reason: "malformed_proc_flags"
							} : {
								state: "observed",
								lifecycle: facts.lifecycle
							},
							relation: facts.processGroupId < 0 ? {
								state: "unavailable",
								reason: "proc_stat_relation_unavailable"
							} : {
								state: "observed",
								parentPid: facts.parentPid,
								processGroupId: facts.processGroupId
							}
						});
						if (!credentialPids?.has(pid)) return [pid, readableIdentity(parsed)];
						let status;
						try {
							status = await readFile(`/proc/${String(pid)}/status`, {
								encoding: "utf8",
								...signal === undefined ? {} : { signal }
							});
						} catch (cause) {
							if (isExpectedAbort(cause, signal)) throw cause;
							return [pid, readableIdentity(parsed)];
						}
						signal?.throwIfAborted();
						const uids = parseLinuxProcessIds(status, "Uid");
						if (uids === undefined) return [pid, readableIdentity(parsed)];
						let procfsOwnerUid;
						try {
							procfsOwnerUid = (await stat(`/proc/${String(pid)}/environ`)).uid;
						} catch (cause) {
							void cause;
						}
						signal?.throwIfAborted();
						const environmentRestriction = linuxEnvironmentRestriction({
							uids,
							gids: parseLinuxProcessIds(status, "Gid"),
							procfsOwnerUid,
							callerUid: process.geteuid?.(),
							callerGid: process.getegid?.()
						});
						let afterStatus;
						try {
							afterStatus = await readFile(`/proc/${String(pid)}/stat`, {
								encoding: "utf8",
								...signal === undefined ? {} : { signal }
							});
						} catch (cause) {
							if (isExpectedAbort(cause, signal)) throw cause;
							return [pid, readableIdentity(parsed)];
						}
						signal?.throwIfAborted();
						const verified = parseLinuxProcessStat(afterStatus);
						if (verified !== undefined && verified.pid === pid && verified.startTime !== parsed.startTime) return [pid, {
							state: "unavailable",
							reason: "process_identity_changed_during_uid_observation"
						}];
						if (verified === undefined || verified.pid !== pid) return [pid, readableIdentity(parsed)];
						return [pid, readableIdentity(verified, uids[1], environmentRestriction)];
					} catch (cause) {
						if (isExpectedAbort(cause, signal)) throw cause;
						if (cause instanceof Error && "code" in cause && (cause.code === "ENOENT" || cause.code === "ESRCH")) {
							signal?.throwIfAborted();
							let presenceProbeFailure;
							let presenceProbeSucceeded = false;
							try {
								presenceProbeSucceeded = process.kill(pid, 0);
							} catch (probeCause) {
								presenceProbeFailure = probeCause;
							}
							signal?.throwIfAborted();
							if (presenceProbeFailure instanceof Error && "code" in presenceProbeFailure && presenceProbeFailure.code === "ESRCH") return [pid, {
								state: "absent",
								reason: "not-found-in-caller-pid-namespace"
							}];
							return [pid, {
								state: "unavailable",
								reason: presenceProbeFailure === undefined && presenceProbeSucceeded ? "proc_stat_missing_but_process_signal_probe_succeeded" : presenceProbeFailure === undefined ? "proc_stat_missing_and_process_signal_probe_returned_false" : `proc_stat_missing_and_process_signal_probe_failed: ${errorMessage(presenceProbeFailure)}`
							}];
						}
						return [pid, {
							state: "unavailable",
							reason: errorMessage(cause)
						}];
					}
				})));
				if (darwinTokens === undefined) return new Map();
				try {
					return await darwinTokens.identities(processes, signal);
				} catch (cause) {
					if (isExpectedAbort(cause, signal)) throw cause;
					const reason = errorMessage(cause);
					return new Map(processes.map(({ pid }) => [pid, {
						state: "unavailable",
						reason
					}]));
				}
			};
			const captureBaseline = async (signal) => {
				if (platform !== "linux" && darwinTokens === undefined) return [];
				const processes = liveProcesses(await listProcesses(signal));
				let identities = await processIdentities(processes, signal);
				const unreadable = processes.filter(({ pid }) => identities.get(pid)?.state !== "readable");
				if (unreadable.length > 0) {
					const stillLive = liveProcesses(await listProcesses(signal)).filter(({ pid }) => unreadable.some((entry) => entry.pid === pid));
					const retried = await processIdentities(stillLive, signal);
					identities = new Map([...identities, ...retried]);
					const unresolved = stillLive.filter(({ pid }) => identities.get(pid)?.state !== "readable");
					const liveAfterRetry = liveProcesses(await listProcesses(signal));
					const stillUnresolved = unresolved.filter(({ pid }) => liveAfterRetry.some((entry) => entry.pid === pid));
					if (stillUnresolved.length > 0) throw new ProcessAdmissionError("identity_snapshot_unavailable", { live_processes: stillUnresolved.length });
				}
				return processes.map(({ pid }) => {
					const observation = identities.get(pid);
					return {
						pid,
						identity: observation?.state === "readable" ? observation.identity : null
					};
				});
			};
			return {
				platform,
				prepare: async (signal) => {
					await darwinTokens?.prepare(signal);
					if (platform === "linux") {
						try {
							const processes = await listProcesses(signal);
							if (!processes.some(({ pid }) => pid === process.pid)) throw new ProcessAdmissionError("current_process_unreported");
						} catch (cause) {
							if (isExpectedAbort(cause, signal)) throw cause;
							throw new LinuxOwnedProcessPrerequisiteError(cause);
						}
					}
				},
				listProcesses,
				async environment(pid, signal) {
					signal?.throwIfAborted();
					if (platform === "linux") return parseProcessEnvironment(await readFile(`/proc/${pid}/environ`, {
						encoding: "utf8",
						signal
					}));
					if (platform === "darwin") {
						const process = (await listProcesses(signal)).find((entry) => entry.pid === pid);
						if (process === undefined) throw new ProcessRunTokenReadError(pid, "absent", "process_not_in_snapshot");
						const observation = (await darwinTokens?.read([process], signal))?.get(pid);
						if (observation === undefined || observation.state === "unavailable") throw new ProcessRunTokenReadError(pid, observation?.reason === "process_not_in_snapshot" ? "absent" : "unavailable", observation?.reason ?? "process run token could not be read");
						const environment = Object.create(null);
						if (observation.runId !== undefined) environment.REA_PROCESS_RUN_ID = observation.runId;
						return environment;
					}
					const { stdout } = await execFileOutput("ps", [
						"eww",
						"-p",
						String(pid)
					], {
						env: hostEnvironment,
						stopSignal: "SIGTERM",
						...signal === undefined ? {} : { signal }
					});
					const observedEnvironment = Object.create(null);
					for (const match of stdout.matchAll(/(?:^|\s)([A-Za-z_][A-Za-z0-9_]*)=([^\s]*)/gu)) {
						const name = match[1];
						if (name !== undefined) observedEnvironment[name] = match[2] ?? "";
					}
					return observedEnvironment;
				},
				async runTokens(processes, signal) {
					signal?.throwIfAborted();
					if (platform !== "darwin" || processes.length === 0) return new Map();
					try {
						return await darwinTokens?.read(processes, signal) ?? new Map();
					} catch (cause) {
						if (isExpectedAbort(cause, signal)) throw cause;
						void cause;
						return new Map(processes.map(({ pid }) => [pid, {
							state: "unavailable",
							reason: "reader_failure"
						}]));
					}
				},
				...platform !== "linux" && darwinTokens === undefined ? {} : {
					processIdentities,
					captureBaseline,
					...darwinTokens === undefined ? {} : { close: darwinTokens.close }
				},
				signalGroup(processGroupId, signal) {
					process.kill(-processGroupId, signal);
				}
			};
		};
		systemProcessOwnershipHost = createSystemProcessOwnershipHost();
		observeProcessStartIdentity = async (pid, host = systemProcessOwnershipHost, expectedRunId) => {
			const process = (await host.listProcesses()).find((entry) => entry.pid === pid);
			if (process === undefined || liveProcesses([process]).length === 0) return undefined;
			if (host.processIdentities === undefined) return {
				state: "unavailable",
				reason: "process identity is unsupported"
			};
			const identity = (await host.processIdentities([process])).get(pid) ?? {
				state: "unavailable",
				reason: "process identity was not returned"
			};
			if (expectedRunId === undefined || identity.state !== "readable") return identity;
			let owned = false;
			for await (const { observation } of readProcessRunTokens(host, [process])) {
				if (observation.state === "unavailable") return {
					state: "unavailable",
					reason: `process ownership token could not be read for PID ${String(pid)}: ${observation.reason}`
				};
				if (observation.runId !== expectedRunId) return {
					state: "unavailable",
					reason: `process ownership token did not match the captured run for PID ${String(pid)}`
				};
				owned = true;
			}
			if (!owned) return {
				state: "unavailable",
				reason: `process ownership token was not returned for PID ${String(pid)}`
			};
			const confirmed = await observeProcessStartIdentity(pid, host);
			if (confirmed === undefined || confirmed.state !== "readable") return confirmed;
			return confirmed.identity === identity.identity ? identity : {
				state: "unavailable",
				reason: `process identity changed while validating the captured run token for PID ${String(pid)}`
			};
		};
		observeProcessStartIdentityExit = async (pid, expectedIdentity, host = systemProcessOwnershipHost) => {
			try {
				const observed = await observeProcessStartIdentity(pid, host);
				if (observed === undefined) return "exited";
				if (observed.state !== "readable") return "unverified";
				return observed.identity === expectedIdentity ? "present" : "exited";
			} catch {
				return "unverified";
			}
		};
		signalProcessWithStartIdentity = async (pid, expectedIdentity, signal, options = {}) => {
			const host = options.host ?? systemProcessOwnershipHost;
			try {
				const observed = await observeProcessStartIdentity(pid, host);
				if (observed === undefined) return "gone";
				if (observed.state !== "readable") return "unverified";
				if (observed.identity !== expectedIdentity) return "identity-changed";
				(options.sendSignal ?? process.kill)(pid, signal);
				return "signaled";
			} catch {
				return "unverified";
			}
		};
		LinuxOwnedProcessPrerequisiteError = class extends AnalysisCapabilityUnavailableError {
			constructor(cause) {
				const reason = `Linux process ownership inspection requires a procps-compatible ps on REA's PATH before launching a child: ${errorMessage(cause)}`;
				super("process-ownership", "prepare_owned_process", reason, {
					cause,
					userMessage: reason
				});
			}
		};
		prepareProcessOwnershipInspection = async (signal) => {
			await systemProcessOwnershipHost.prepare?.(signal);
		};
		processIsGone = async (host, pid, signal) => {
			try {
				const processes = signal === undefined ? await host.listProcesses() : await host.listProcesses(signal);
				return !liveProcesses(processes).some((process) => process.pid === pid);
			} catch (cause) {
				signal?.throwIfAborted();
				void cause;
				return false;
			}
		};
		errorMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
	})))();
}

//#endregion
//#region dist/process/ProcessOwnershipEvidence.js
var ProcessOwnershipEvidenceOwner;
function init_ProcessOwnershipEvidence() {
	return (init_ProcessOwnershipEvidence = __esmMin((() => {
		init_ProcessLifecycle();
		ProcessOwnershipEvidenceOwner = class {
			#candidates = new Map();
			#snapshotCount = 0;
			#coverage = {
				snapshotCount: 0,
				listedRows: 0,
				examinedPids: 0,
				retainedOnlyPids: 0,
				retainedOwned: 0,
				retainedUnresolved: 0,
				uncertainPids: [],
				processTableCoverage: "unreported-by-host"
			};
			get candidates() {
				return [...this.#candidates.values()];
			}
			get coverage() {
				return this.#coverage;
			}
			/**
			* Reconcile facts from one explicit snapshot. Unrelated transient rows are
			* never retained; unknown related candidates remain evidence, not authority.
			*/
			reconcile(facts, options) {
				this.#snapshotCount += 1;
				const factsByPid = new Map(facts.map((fact) => [fact.process.pid, fact]));
				const sameGeneration = new Map();
				const sameGenerationBefore = new Map();
				const tokenMatchedPids = new Set();
				const uncertainPids = new Set();
				const retiredPids = new Set();
				for (const fact of facts) {
					if (fact.state !== "same-generation") continue;
					if (fact.identityAfter.state !== "readable") continue;
					sameGeneration.set(fact.process.pid, fact.identityAfter);
					if (fact.identityBefore.state === "readable" && fact.identityBefore.identity === fact.identityAfter.identity) sameGenerationBefore.set(fact.process.pid, fact.identityBefore);
					if (fact.token.state === "readable" && fact.token.runId === options.runId) tokenMatchedPids.add(fact.process.pid);
				}
				const findScopeEvidence = (pid, generations, tokenOwners) => {
					let unverifiedRelation = false;
					const relationFor = (candidatePid) => {
						const identity = generations.get(candidatePid);
						if (identity?.relation?.state === "observed") return identity.relation;
						const fallback = options.unverifiedLineageRelations?.get(candidatePid);
						if (fallback === undefined) return undefined;
						const current = sameGeneration.get(candidatePid);
						if (current?.relation?.state === "observed") {
							if (identity === undefined) unverifiedRelation = true;
							return current.relation;
						}
						unverifiedRelation = true;
						return fallback;
					};
					const scoped = (evidence) => unverifiedRelation ? "unverified-table-relation" : evidence;
					const relation = relationFor(pid);
					if (relation === undefined) return undefined;
					if (options.allowCapturedScope !== false && options.processGroupIds.has(relation.processGroupId)) return scoped("captured-process-group-id");
					const visited = new Set([pid]);
					let parentPid = relation.parentPid;
					while (!visited.has(parentPid)) {
						const parent = generations.get(parentPid);
						const previousParent = this.#candidates.get(parentPid);
						if (parent !== undefined && (tokenOwners.has(parentPid) || previousParent?.applicability === "token-verified" && parent.identity === previousParent.identity)) return scoped("current-token-owned-parent");
						if (options.allowCapturedScope !== false && parentPid === options.leaderPid) return scoped("capture-leader-pid");
						visited.add(parentPid);
						const parentRelation = relationFor(parentPid);
						if (parentRelation === undefined) return undefined;
						parentPid = parentRelation.parentPid;
					}
					return undefined;
				};
				const scopeGenerations = new Map();
				const scopeBeforeGenerations = new Map();
				const scopeOwnedPids = new Set();
				for (const observed of options.scopeFacts ?? facts) {
					const fact = observed.beforeExitSettlement ?? observed;
					if (fact.state !== "same-generation" || fact.identityAfter.state !== "readable") continue;
					scopeGenerations.set(fact.process.pid, fact.identityAfter);
					if (fact.identityBefore.state === "readable" && fact.identityAfter.identity === fact.identityBefore.identity) scopeBeforeGenerations.set(fact.process.pid, fact.identityBefore);
					const previous = this.#candidates.get(fact.process.pid);
					if (fact.token.state === "readable" && fact.token.runId === options.runId || previous?.applicability === "token-verified" && previous.identity === fact.identityAfter.identity) scopeOwnedPids.add(fact.process.pid);
				}
				const related = (pid) => {
					const current = findScopeEvidence(pid, sameGeneration, tokenMatchedPids) ?? findScopeEvidence(pid, sameGenerationBefore, tokenMatchedPids);
					if (current !== undefined) return current;
					const original = scopeGenerations.get(pid);
					if (original === undefined || sameGeneration.get(pid)?.identity !== original.identity) return undefined;
					const initial = findScopeEvidence(pid, scopeGenerations, scopeOwnedPids) ?? findScopeEvidence(pid, scopeBeforeGenerations, scopeOwnedPids);
					return initial === undefined ? undefined : "previously-related-generation";
				};
				for (const [pid, previous] of this.#candidates) {
					if (options.nativeExitedPids?.has(pid)) {
						this.#candidates.delete(pid);
						retiredPids.add(pid);
						continue;
					}
					const fact = factsByPid.get(pid);
					if (fact === undefined) continue;
					if (fact.state === "absent" || fact.state === "replaced" || previous.identity !== undefined && fact.identityAfter.state === "readable" && fact.identityAfter.identity !== previous.identity || processIdentityHasExited(fact.identityAfter)) {
						this.#candidates.delete(pid);
						retiredPids.add(pid);
						continue;
					}
					if (fact.state !== "same-generation") {
						uncertainPids.add(pid);
						continue;
					}
					const identity = fact.identityAfter;
					if (identity.state !== "readable") {
						uncertainPids.add(pid);
						continue;
					}
					const matched = fact.token.state === "readable" && fact.token.runId === options.runId;
					if (previous.identity === undefined && !matched) {
						uncertainPids.add(pid);
						this.#candidates.set(pid, {
							...previous,
							process: fact.process,
							token: fact.token,
							...fact.token.state === "unavailable" ? { diagnostic: fact.token.reason } : {}
						});
						continue;
					}
					const relation = identity.relation?.state === "observed" ? {
						state: "observed",
						parentPid: identity.relation.parentPid,
						processGroupId: identity.relation.processGroupId
					} : undefined;
					this.#candidates.set(pid, {
						pid,
						identity: identity.identity,
						process: fact.process,
						applicability: matched || previous.applicability === "token-verified" ? "token-verified" : "related-ownership-unresolved",
						scopeEvidence: matched || previous.applicability === "token-verified" ? "run-token" : related(pid) ?? "previously-related-generation",
						token: fact.token,
						relation,
						...fact.token.state === "unavailable" ? { diagnostic: fact.token.reason } : {}
					});
				}
				for (const fact of facts) {
					const pid = fact.process.pid;
					const matched = fact.token.state === "readable" && fact.token.runId === options.runId;
					const unresolvedReplacement = fact.state === "replaced" && matched;
					if (this.#candidates.has(pid) || retiredPids.has(pid) && fact.state !== "same-generation" && !unresolvedReplacement || fact.state === "absent" || fact.state === "replaced" && !matched || processIdentityHasExited(fact.identityAfter)) continue;
					const identity = fact.identityAfter;
					if (fact.state !== "same-generation" || identity.state !== "readable") {
						if (options.allowCapturedScope === false && !matched && related(pid) === undefined) continue;
						this.#candidates.set(pid, {
							pid,
							identity: undefined,
							process: fact.process,
							applicability: "identity-unresolved",
							scopeEvidence: "native-identity-unresolved",
							token: fact.token,
							relation: undefined,
							...fact.token.state === "unavailable" ? { diagnostic: fact.token.reason } : {}
						});
						uncertainPids.add(pid);
						continue;
					}
					const unresolvedScope = matched ? undefined : related(pid);
					if (!matched && unresolvedScope === undefined) continue;
					const relation = identity.relation?.state === "observed" ? {
						state: "observed",
						parentPid: identity.relation.parentPid,
						processGroupId: identity.relation.processGroupId
					} : undefined;
					this.#candidates.set(pid, {
						pid,
						identity: identity.identity,
						process: fact.process,
						applicability: matched ? "token-verified" : "related-ownership-unresolved",
						scopeEvidence: matched ? "run-token" : unresolvedScope ?? "previously-related-generation",
						token: fact.token,
						relation,
						...fact.token.state === "unavailable" ? { diagnostic: fact.token.reason } : {}
					});
				}
				const retainedOnlyPids = [...this.#candidates.keys()].filter((pid) => !options.listedPids.has(pid));
				this.#coverage = {
					snapshotCount: this.#snapshotCount,
					listedRows: options.listedRows,
					examinedPids: facts.length,
					retainedOnlyPids: retainedOnlyPids.length,
					retainedOwned: [...this.#candidates.values()].filter(({ applicability }) => applicability === "token-verified").length,
					retainedUnresolved: [...this.#candidates.values()].filter(({ applicability }) => applicability !== "token-verified").length,
					uncertainPids: [...uncertainPids].sort((left, right) => left - right),
					processTableCoverage: "unreported-by-host"
				};
				return this.candidates;
			}
			/** Merge current discovery rows with retained candidates without PID-only proof. */
			rowsForObservation(processes) {
				const byPid = new Map(processes.map((process) => [process.pid, process]));
				for (const candidate of this.#candidates.values()) if (!byPid.has(candidate.pid)) byPid.set(candidate.pid, candidate.process);
				return [...byPid.values()];
			}
		};
	})))();
}

//#endregion
//#region dist/process/ProcessOwnership.js
var execFileAsync, cleanupWindowsProcessTree, systemWindowsProcessTreeHost, readProcessRunId, mergeUnverifiedObservations, OWNED_GROUP_REVALIDATION_LIMIT, implicitEvidenceOwners, cleanupOwnedProcessGroup, verifyNoTokenOwnedProcesses, readLiveProcessTable, readProcessRelationSnapshot, settledProcessTable, EXIT_REFRESH_CONFIRMATION_LIMIT, isExitRefreshCandidate, classifyUnlinkedExitRows, settleLauncherExit, createOwnedCleanupPlan, mergeProcessOwnershipFailure, ownershipFailurePriority, revalidateOwnedProcessGroup, cleanupValidationFailure, unreadableTokenFailure, unreadableCandidateFacts, sanitizedTokenReadFailure, processOwnershipFailures, processRunTokenFailures, recheckOwnershipFailures, PLATFORM_BINARY_ENVIRONMENT_WITHHELD, RESTRICTED_PROCESS_ENVIRONMENT_WITHHELD, currentProcessUid, environmentWithheldFromInspection, scanTokenOwnedProcesses, scanWithOwnershipEvidence, settleUnreadableTokenCandidates;
function init_ProcessOwnership() {
	return (init_ProcessOwnership = __esmMin((() => {
		init_ProcessOwnershipObservation();
		init_ProcessOwnershipIdentity();
		init_ProcessOwnershipProcessTree();
		init_ProcessRunTokenObservations();
		init_unicodeCodePointOrder();
		init_ProcessOwnershipEvidence();
		init_ProcessLifecycle();
		execFileAsync = promisify(execFile);
		cleanupWindowsProcessTree = async (rootPid, host = systemWindowsProcessTreeHost) => {
			if (!Number.isSafeInteger(rootPid) || rootPid <= 0) return {
				cleaned: false,
				reason: "Windows process-tree PID is invalid"
			};
			try {
				const result = await host.terminateTree(rootPid);
				return {
					cleaned: true,
					signaled: result === "terminated"
				};
			} catch (cause) {
				return {
					cleaned: false,
					reason: `Windows process-tree termination failed for PID ${String(rootPid)}: ${errorMessage(cause)}`
				};
			}
		};
		systemWindowsProcessTreeHost = { async terminateTree(rootPid) {
			try {
				await execFileAsync("taskkill.exe", [
					"/pid",
					String(rootPid),
					"/t",
					"/f"
				], {
					windowsHide: true,
					timeout: 5e3
				});
				return "terminated";
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && (cause.code === 128 || cause.code === "ESRCH")) return "missing";
				throw cause;
			}
		} };
		readProcessRunId = async (pid, host = systemProcessOwnershipHost, signal) => processRunIdFromEnvironment(await host.environment(pid, signal));
		mergeUnverifiedObservations = (result, unverified) => {
			if (unverified.length === 0) return result;
			const merged = [...new Map([...result.unverified ?? [], ...unverified].map((item) => [JSON.stringify([item.pid, item.diagnostic]), item])).values()];
			return {
				...result,
				unverified: merged
			};
		};
		OWNED_GROUP_REVALIDATION_LIMIT = 2;
		implicitEvidenceOwners = new WeakMap();
		cleanupOwnedProcessGroup = async (ownership, host = systemProcessOwnershipHost) => {
			if (ownership.evidenceOwner === undefined) {
				let evidenceOwner = implicitEvidenceOwners.get(ownership);
				if (evidenceOwner === undefined) {
					evidenceOwner = new ProcessOwnershipEvidenceOwner();
					implicitEvidenceOwners.set(ownership, evidenceOwner);
				}
				ownership = {
					...ownership,
					evidenceOwner
				};
			}
			const exitSettlement = { deadline: undefined };
			const processTable = await readLiveProcessTable(host);
			if (!processTable.available) return {
				cleaned: false,
				reason: `process table could not be inspected: ${processTable.reason}`
			};
			const plan = await createOwnedCleanupPlan(ownership, processTable.processes, host, exitSettlement);
			if ("cleaned" in plan) return plan;
			let signaled = false;
			const pendingGroups = [...plan.signalOrder];
			const pending = new Set(pendingGroups);
			const passes = new Map();
			while (pendingGroups.length > 0) {
				const processGroupId = pendingGroups.shift();
				if (processGroupId === undefined) break;
				pending.delete(processGroupId);
				const seen = passes.get(processGroupId) ?? 0;
				if (seen >= OWNED_GROUP_REVALIDATION_LIMIT) return mergeUnverifiedObservations({
					cleaned: false,
					reason: `owned process group ${String(processGroupId)} reappeared after ${String(OWNED_GROUP_REVALIDATION_LIMIT)} revalidation passes. This release has no runtime override.`
				}, plan.unverified);
				passes.set(processGroupId, seen + 1);
				const revalidation = await revalidateOwnedProcessGroup(processGroupId, ownership, host, plan.tokenOwnedIdentities, exitSettlement);
				if ("cleaned" in revalidation) return mergeUnverifiedObservations(revalidation, plan.unverified);
				for (const groupId of revalidation.escapedProcessGroupIds) {
					if (groupId === processGroupId || pending.has(groupId)) continue;
					if ((passes.get(groupId) ?? 0) >= OWNED_GROUP_REVALIDATION_LIMIT) return mergeUnverifiedObservations({
						cleaned: false,
						reason: `owned process group ${String(groupId)} reappeared after ${String(OWNED_GROUP_REVALIDATION_LIMIT)} revalidation passes. This release has no runtime override.`
					}, plan.unverified);
					pending.add(groupId);
					pendingGroups.push(groupId);
				}
				if (revalidation.empty) continue;
				try {
					host.signalGroup(processGroupId, "SIGKILL");
					signaled = true;
				} catch (cause) {
					const code = cause instanceof Error && "code" in cause ? cause.code : undefined;
					if (code !== "ESRCH") return mergeUnverifiedObservations({
						cleaned: false,
						reason: `owned process group signal failed: ${errorMessage(cause)}`
					}, plan.unverified);
				}
			}
			if (plan.unresolved.length > 0) return cleanupValidationFailure(plan.unresolved, plan.unverified);
			if (ownership.sweepTokenOwnedProcesses === true) {
				let verification;
				try {
					const relation = {
						leaderPid: ownership.leaderPid,
						processGroupId: ownership.processGroupId,
						evidenceOwner: ownership.evidenceOwner,
						...ownership.sampledProcessGroupIds === undefined ? {} : { sampledProcessGroupIds: ownership.sampledProcessGroupIds }
					};
					const deadline = performance.now() + PROCESS_CLEANUP_VERIFICATION_GRACE_MS;
					verification = await verifyNoTokenOwnedProcesses(ownership.runId, host, ownership.captureBaseline, relation, exitSettlement);
					while (!verification.cleaned) {
						const remaining = deadline - performance.now();
						if (remaining <= 0) break;
						await setTimeout(Math.min(25, remaining));
						verification = await verifyNoTokenOwnedProcesses(ownership.runId, host, ownership.captureBaseline, relation, exitSettlement);
					}
				} catch (cause) {
					return mergeUnverifiedObservations({
						cleaned: false,
						reason: `final process ownership verification failed: ${errorMessage(cause)}`
					}, plan.unverified);
				}
				if (!verification.cleaned) return mergeUnverifiedObservations(verification, plan.unverified);
				return mergeUnverifiedObservations({
					cleaned: true,
					signaled
				}, [...plan.unverified, ...verification.unverified ?? []]);
			}
			return {
				cleaned: true,
				signaled,
				...plan.unverified.length === 0 ? {} : { unverified: plan.unverified }
			};
		};
		verifyNoTokenOwnedProcesses = async (runId, host = systemProcessOwnershipHost, captureBaseline, relation, exitSettlement = { deadline: undefined }) => {
			const processTable = await readLiveProcessTable(host);
			if (!processTable.available) return {
				cleaned: false,
				reason: `process table could not be inspected: ${processTable.reason}`
			};
			const scan = await scanTokenOwnedProcesses(processTable.processes, runId, host, captureBaseline, relation, exitSettlement);
			if (scan.failures.length > 0) return cleanupValidationFailure(scan.failures, scan.unverified);
			if (scan.owned.length > 0) return {
				cleaned: false,
				reason: "token-owned process remained after cleanup",
				...scan.unverified.length === 0 ? {} : { unverified: scan.unverified }
			};
			return {
				cleaned: true,
				signaled: false,
				...scan.unverified.length === 0 ? {} : { unverified: scan.unverified }
			};
		};
		readLiveProcessTable = async (host) => {
			try {
				return {
					available: true,
					processes: liveProcesses(await host.listProcesses())
				};
			} catch (cause) {
				return {
					available: false,
					reason: errorMessage(cause)
				};
			}
		};
		readProcessRelationSnapshot = async (ownership, processes, host) => {
			if (host.processIdentities === undefined) return {
				currentRelations: processes,
				identities: new Map(),
				failures: []
			};
			const identities = await readNativeProcessIdentityMap(processes, host);
			const possibleDescendants = new Set(descendantsOf([ownership.leaderPid], processes).map(({ pid }) => pid));
			const relevantPids = new Set([
				ownership.leaderPid,
				...possibleDescendants,
				...processes.filter(({ processGroupId }) => processGroupId === ownership.processGroupId || ownership.sampledProcessGroupIds?.includes(processGroupId)).map(({ pid }) => pid)
			]);
			const currentRelations = [];
			const failures = [];
			for (const process of processes) {
				const identity = identities.get(process.pid);
				if (processIdentityHasExited(identity)) continue;
				if (identity?.state === "readable" && identity.relation?.state === "observed") {
					currentRelations.push({
						...process,
						parentPid: identity.relation.parentPid,
						processGroupId: identity.relation.processGroupId
					});
					continue;
				}
				if (relevantPids.has(process.pid) && identity?.state !== "absent") failures.push({
					pid: process.pid,
					reason: "process-identity-unavailable",
					diagnostic: `native process membership could not be read${identity?.state === "unavailable" ? `: ${identity.reason}` : ""}`
				});
			}
			return {
				currentRelations,
				identities,
				failures
			};
		};
		settledProcessTable = (processes) => ({
			processes,
			escapedProcessGroupIds: []
		});
		EXIT_REFRESH_CONFIRMATION_LIMIT = 8;
		isExitRefreshCandidate = (process, ownership, initialRelations) => {
			if (process.processGroupId === ownership.processGroupId) return false;
			const initial = initialRelations.get(process.pid);
			return initial === undefined || initial.parentPid !== process.parentPid || initial.processGroupId !== process.processGroupId;
		};
		classifyUnlinkedExitRows = async (ownership, refreshed, unlinked, host, initialRelations) => {
			let current = refreshed;
			let pending = unlinked;
			let confirmations = 0;
			const matched = [];
			const inspected = new Set();
			const tokenRead = new Set();
			while (pending.length > 0) {
				const due = pending.filter((process) => !inspected.has(process.pid));
				if (due.length === 0) break;
				for (const process of due) inspected.add(process.pid);
				const unreadable = [];
				for await (const { process, observation } of readProcessRunTokens(host, due)) {
					if (observation.state === "readable") {
						tokenRead.add(process.pid);
						if (observation.runId === ownership.runId) matched.push(process);
						continue;
					}
					unreadable.push({
						pid: process.pid,
						reason: observation.reason
					});
				}
				if (unreadable.length === 0) break;
				let liveRows;
				try {
					liveRows = liveProcesses(await host.listProcesses());
				} catch (cause) {
					void cause;
					liveRows = undefined;
				}
				const live = liveRows === undefined ? undefined : new Set(liveRows.map(({ pid }) => pid));
				const stillLive = unreadable.filter((candidate) => live === undefined || live.has(candidate.pid));
				if (stillLive.length > 0) {
					const only = stillLive.length === 1 ? stillLive[0] : undefined;
					const pids = stillLive.map(({ pid }) => pid).sort((left, right) => left - right);
					return {
						kind: "uncertain",
						reason: only === undefined ? `process ownership could not be revalidated for PID(s): ${pids.join(", ")}` : `process ownership could not be revalidated for PID ${String(only.pid)}: ${only.reason}`
					};
				}
				if (liveRows === undefined) break;
				confirmations += 1;
				if (confirmations > EXIT_REFRESH_CONFIRMATION_LIMIT) return {
					kind: "uncertain",
					reason: `process ownership could not be revalidated: the exit refresh confirmation limit of ${String(EXIT_REFRESH_CONFIRMATION_LIMIT)} reads was exceeded. This release has no runtime override.`
				};
				current = liveRows;
				inspected.clear();
				matched.length = 0;
				pending = current.filter((process) => tokenRead.has(process.pid) || isExitRefreshCandidate(process, ownership, initialRelations));
			}
			const livePids = new Set(current.map(({ pid }) => pid));
			const stillMatched = matched.filter((process) => livePids.has(process.pid));
			if (stillMatched.length === 0) return {
				kind: "clear",
				processes: current
			};
			const matchedPids = new Set(stillMatched.map(({ pid }) => pid));
			const groupIds = new Set();
			for (const process of stillMatched) {
				const leader = current.find((candidate) => candidate.pid === process.processGroupId && candidate.processGroupId === process.processGroupId);
				if (leader === undefined || !matchedPids.has(leader.pid)) return {
					kind: "uncertain",
					reason: "descendant process-group leader identity could not be verified"
				};
				groupIds.add(process.processGroupId);
			}
			return {
				kind: "escaped",
				processes: current,
				groupIds: [...groupIds].sort((left, right) => left - right)
			};
		};
		settleLauncherExit = async (ownership, processes, host, exitSettlement) => {
			const launcher = processes.find(({ pid }) => pid === ownership.leaderPid);
			if (launcher === undefined) return settledProcessTable(processes);
			let identityCheckedLauncher = launcher;
			if (host.processIdentities !== undefined) {
				const initialIdentities = await readNativeProcessIdentityMap([launcher], host);
				const identities = await settleExitingProcessIdentities([launcher], host, initialIdentities, undefined, exitSettlement);
				const identity = identities.get(launcher.pid);
				const initialIdentity = initialIdentities.get(launcher.pid);
				if (initialIdentity?.state === "readable" && identity?.state === "readable" && initialIdentity.identity !== identity.identity) return {
					cleaned: false,
					reason: "owned launcher identity changed while verifying exit"
				};
				if (processIdentityIsExiting(identity)) return {
					cleaned: false,
					reason: "owned launcher exit could not be confirmed"
				};
				if (processIdentityHasExited(identity)) return settledProcessTable(processes.filter(({ pid }) => pid !== launcher.pid));
				if (identity?.state !== "readable" || identity.relation?.state !== "observed") return {
					cleaned: false,
					reason: `owned launcher native identity could not be verified${identity?.state === "unavailable" ? `: ${identity.reason}` : ""}`
				};
				identityCheckedLauncher = {
					...launcher,
					parentPid: identity.relation.parentPid,
					processGroupId: identity.relation.processGroupId
				};
			}
			const reason = launcherIdentityFailure(identityCheckedLauncher, ownership);
			if (reason === null) return settledProcessTable(processes);
			if (host.processIdentities !== undefined) return {
				cleaned: false,
				reason
			};
			const refreshed = await readLiveProcessTable(host);
			if (refreshed.available && !refreshed.processes.some(({ pid }) => pid === launcher.pid)) {
				const descendants = descendantsOf([launcher.pid], processes);
				const descendantPids = new Set(descendants.map(({ pid }) => pid));
				const descendantGroupIds = new Set(descendants.map(({ processGroupId }) => processGroupId));
				const refreshedDescendantPids = new Set(descendantsOf(descendants.map(({ pid }) => pid), refreshed.processes).map(({ pid }) => pid));
				if (refreshed.processes.some((process) => process.processGroupId !== ownership.processGroupId && (refreshedDescendantPids.has(process.pid) || descendantPids.has(process.pid) || descendantGroupIds.has(process.processGroupId)))) return {
					cleaned: false,
					reason
				};
				const initialRelations = new Map(processes.map((process) => [process.pid, {
					parentPid: process.parentPid,
					processGroupId: process.processGroupId
				}]));
				const unlinked = refreshed.processes.filter((process) => isExitRefreshCandidate(process, ownership, initialRelations) && !descendantPids.has(process.pid) && !descendantGroupIds.has(process.processGroupId) && !refreshedDescendantPids.has(process.pid));
				const classified = await classifyUnlinkedExitRows(ownership, refreshed.processes, unlinked, host, initialRelations);
				if (classified.kind === "uncertain") return {
					cleaned: false,
					reason: classified.reason
				};
				return {
					processes: classified.processes,
					escapedProcessGroupIds: classified.kind === "escaped" ? classified.groupIds : []
				};
			}
			return {
				cleaned: false,
				reason
			};
		};
		createOwnedCleanupPlan = async (ownership, initialProcesses, host, exitSettlement) => {
			const settled = await settleLauncherExit(ownership, initialProcesses, host, exitSettlement);
			if ("cleaned" in settled) return settled;
			const processes = settled.processes;
			const escapedProcessGroupIds = new Set(settled.escapedProcessGroupIds);
			const relationSnapshot = await readProcessRelationSnapshot(ownership, processes, host);
			const sampledProcessGroupIds = new Set((ownership.sampledProcessGroupIds ?? []).filter((processGroupId) => Number.isSafeInteger(processGroupId) && processGroupId > 0));
			const retainedPids = new Set(ownership.evidenceOwner?.candidates.map(({ pid }) => pid) ?? []);
			const tokenOwned = ownership.sweepTokenOwnedProcesses === true || retainedPids.size > 0 ? await scanTokenOwnedProcesses(ownership.sweepTokenOwnedProcesses === true ? processes : processes.filter(({ pid }) => retainedPids.has(pid)), ownership.runId, host, ownership.captureBaseline, {
				leaderPid: ownership.leaderPid,
				processGroupId: ownership.processGroupId,
				evidenceOwner: ownership.evidenceOwner,
				...sampledProcessGroupIds.size === 0 ? {} : { sampledProcessGroupIds: [...sampledProcessGroupIds] }
			}, exitSettlement) : {
				owned: [],
				failures: [],
				unverified: [],
				identities: new Map()
			};
			const tokenOwnedGroupIds = new Set(tokenOwned.owned.map(({ processGroupId }) => processGroupId));
			const launcher = relationSnapshot.currentRelations.find(({ pid }) => pid === ownership.leaderPid);
			const rootMembers = relationSnapshot.currentRelations.filter(({ processGroupId }) => processGroupId === ownership.processGroupId);
			if (launcher === undefined && rootMembers.length === 0 && tokenOwned.owned.length === 0 && escapedProcessGroupIds.size === 0 && !relationSnapshot.currentRelations.some(({ processGroupId }) => sampledProcessGroupIds.has(processGroupId))) return tokenOwned.failures.length > 0 || relationSnapshot.failures.length > 0 ? {
				signalOrder: [],
				tokenOwnedIdentities: tokenOwned.identities,
				unresolved: [...tokenOwned.failures, ...relationSnapshot.failures],
				unverified: tokenOwned.unverified
			} : {
				cleaned: true,
				signaled: false,
				...tokenOwned.unverified.length === 0 ? {} : { unverified: tokenOwned.unverified }
			};
			let descendants = [];
			if (launcher !== undefined) {
				descendants = descendantsOf([launcher.pid], relationSnapshot.currentRelations);
			}
			const descendantPids = new Set(descendants.map(({ pid }) => pid));
			const processGroupIds = new Set([ownership.processGroupId]);
			for (const descendant of descendants) processGroupIds.add(descendant.processGroupId);
			for (const process of tokenOwned.owned) processGroupIds.add(process.processGroupId);
			for (const processGroupId of sampledProcessGroupIds) processGroupIds.add(processGroupId);
			for (const processGroupId of escapedProcessGroupIds) processGroupIds.add(processGroupId);
			const signalableGroups = new Set();
			const unresolved = [...tokenOwned.failures, ...relationSnapshot.failures];
			const unverifiableSampledGroups = new Set();
			for (const processGroupId of processGroupIds) {
				if (processGroupId === ownership.processGroupId) continue;
				const groupLeader = relationSnapshot.currentRelations.find(({ pid, processGroupId: observedGroupId }) => pid === processGroupId && observedGroupId === processGroupId);
				const provenGroup = tokenOwnedGroupIds.has(processGroupId) || escapedProcessGroupIds.has(processGroupId);
				if ((groupLeader === undefined || !descendantPids.has(groupLeader.pid)) && !provenGroup && !sampledProcessGroupIds.has(processGroupId)) return {
					cleaned: false,
					reason: "descendant process-group leader identity could not be verified"
				};
				if ((groupLeader === undefined || !descendantPids.has(groupLeader.pid)) && !provenGroup) unverifiableSampledGroups.add(processGroupId);
			}
			const liveMembers = relationSnapshot.currentRelations.filter(({ processGroupId }) => processGroupIds.has(processGroupId));
			for (const processGroupId of processGroupIds) {
				const members = liveMembers.filter(({ processGroupId: observedGroupId }) => observedGroupId === processGroupId);
				if (members.length === 0) continue;
				const { failures, validatedMembers } = await processOwnershipFailures(members, ownership, host, tokenOwned.identities, exitSettlement);
				if (failures.length === 0 && unverifiableSampledGroups.has(processGroupId)) unresolved.push(...validatedMembers.map(({ pid }) => ({
					pid,
					reason: "process-identity-unavailable",
					diagnostic: "sampled process-group leader identity could not be verified"
				})));
				const scanFailures = tokenOwned.failures.filter(({ pid }) => members.some((member) => member.pid === pid));
				for (const failure of failures) mergeProcessOwnershipFailure(unresolved, failure);
				if (failures.length === 0 && scanFailures.length === 0 && !unverifiableSampledGroups.has(processGroupId)) signalableGroups.add(processGroupId);
			}
			if (ownership.sweepTokenOwnedProcesses !== true && unresolved.length > 0) return cleanupValidationFailure(unresolved, tokenOwned.unverified);
			return {
				signalOrder: [...signalableGroups].filter((groupId) => processGroupIds.has(groupId)).sort((left, right) => left === ownership.processGroupId ? -1 : right === ownership.processGroupId ? 1 : left - right),
				tokenOwnedIdentities: tokenOwned.identities,
				unresolved,
				unverified: tokenOwned.unverified
			};
		};
		mergeProcessOwnershipFailure = (failures, next) => {
			const index = failures.findIndex(({ pid }) => pid === next.pid);
			if (index < 0) {
				failures.push(next);
				return;
			}
			const previous = failures[index];
			if (previous !== undefined && ownershipFailurePriority(next.reason) >= ownershipFailurePriority(previous.reason)) failures[index] = next;
		};
		ownershipFailurePriority = (reason) => reason === "run-token-mismatch" ? 3 : reason === "process-identity-unavailable" ? 2 : reason === "environment-unreadable" ? 1 : 0;
		revalidateOwnedProcessGroup = async (processGroupId, ownership, host, expectedIdentities, exitSettlement) => {
			const escapedProcessGroupIds = new Set();
			for (let refresh = 0;; refresh += 1) {
				let members;
				try {
					const settled = await settleLauncherExit(ownership, liveProcesses(await host.listProcesses()), host, exitSettlement);
					if ("cleaned" in settled) return settled;
					for (const groupId of settled.escapedProcessGroupIds) escapedProcessGroupIds.add(groupId);
					const relationSnapshot = await readProcessRelationSnapshot(ownership, settled.processes, host);
					if (relationSnapshot.failures.length > 0) return cleanupValidationFailure(relationSnapshot.failures);
					members = relationSnapshot.currentRelations.filter(({ processGroupId: observedGroupId }) => observedGroupId === processGroupId);
				} catch (cause) {
					return {
						cleaned: false,
						reason: `process ownership could not be revalidated: ${errorMessage(cause)}`
					};
				}
				const { failures, validatedMembers } = await processOwnershipFailures(members, ownership, host, expectedIdentities, exitSettlement);
				if (failures.length > 0) return cleanupValidationFailure(failures);
				if (processGroupId !== ownership.processGroupId && validatedMembers.length > 0 && !validatedMembers.some(({ pid }) => pid === processGroupId) && ownership.sweepTokenOwnedProcesses !== true) return {
					cleaned: false,
					reason: "descendant process-group leader identity could not be revalidated"
				};
				if (validatedMembers.length > 0 || members.length === 0) return {
					empty: validatedMembers.length === 0,
					escapedProcessGroupIds: [...escapedProcessGroupIds]
				};
				if (refresh >= OWNED_GROUP_REVALIDATION_LIMIT) return {
					cleaned: false,
					reason: `owned process group ${String(processGroupId)} members exited during revalidation after ${String(OWNED_GROUP_REVALIDATION_LIMIT)} table refreshes. This release has no runtime override.`
				};
			}
		};
		cleanupValidationFailure = (failures, unverified = []) => {
			const unverifiedEntry = unverified.length === 0 ? {} : { unverified };
			const unreadable = failures.filter(({ reason }) => reason === "environment-unreadable");
			if (failures.some(({ reason }) => reason === "run-token-mismatch")) return {
				cleaned: false,
				reason: `process ownership token mismatch for PID(s): ${[...new Set(failures.filter(({ reason }) => reason === "run-token-mismatch").map(({ pid }) => pid))].sort((left, right) => left - right).join(", ")}`,
				failures,
				...unverifiedEntry
			};
			if (failures.some(({ reason }) => reason === "process-identity-unavailable")) return {
				cleaned: false,
				reason: "process identity could not be revalidated",
				failures,
				...unverifiedEntry
			};
			if (unreadable.length > 0) {
				const counts = new Map();
				for (const { diagnostic } of unreadable) {
					const category = sanitizedTokenReadFailure(diagnostic);
					counts.set(category, (counts.get(category) ?? 0) + 1);
				}
				const breakdown = [...counts].sort(([left], [right]) => compareUnicodeCodePoints(left, right)).map(([category, count]) => `${category}=${String(count)}`).join(", ");
				const candidates = unreadable.map(({ pid, diagnostic, identityAfter }) => `${String(pid)}=${sanitizedTokenReadFailure(diagnostic)}${unreadableCandidateFacts(identityAfter)}`).sort((left, right) => compareUnicodeCodePoints(left, right));
				return {
					cleaned: false,
					reason: `process ownership token could not be read for ${String(unreadable.length)} live process(es): ${breakdown}; live candidates ${candidates.join(", ")}`,
					failures,
					...unverifiedEntry
				};
			}
			return {
				cleaned: false,
				reason: "process ownership could not be revalidated",
				failures,
				...unverifiedEntry
			};
		};
		unreadableTokenFailure = (fact, diagnostic) => ({
			pid: fact.process.pid,
			reason: "environment-unreadable",
			diagnostic,
			...fact.identityAfter.state === "readable" ? { identityAfter: fact.identityAfter } : {}
		});
		unreadableCandidateFacts = (identity) => {
			if (identity === undefined) return "";
			const facts = [
				...identity.name === undefined ? [] : [`name ${JSON.stringify(identity.name)}`],
				...identity.relation?.state === "observed" ? [`ppid ${String(identity.relation.parentPid)}`, `pgid ${String(identity.relation.processGroupId)}`] : [],
				`identity ${identity.identity}`
			];
			return ` (${facts.join(", ")})`;
		};
		sanitizedTokenReadFailure = (diagnostic) => {
			if (diagnostic === "environment_unavailable") return diagnostic;
			if (diagnostic === "platform_binary_environment_withheld") return diagnostic;
			if (diagnostic === "restricted_process_environment_withheld") return diagnostic;
			const environmentErrno = /^(EACCES|EPERM|ENOENT|ESRCH):/u.exec(diagnostic ?? "");
			if (environmentErrno?.[1] !== undefined) return `environment_errno_${environmentErrno[1]}`;
			if (diagnostic === "apple_vector_unavailable") return diagnostic;
			if (diagnostic === "ambiguous_environment_boundary") return diagnostic;
			if (diagnostic === "malformed_procargs") return diagnostic;
			if (diagnostic === "malformed_procargs_header" || diagnostic === "malformed_procargs_argument_count" || diagnostic === "malformed_procargs_executable_path" || diagnostic === "malformed_procargs_pointer_size" || diagnostic === "malformed_procargs_path_padding" || diagnostic === "malformed_procargs_arguments" || diagnostic === "malformed_procargs_terminator" || diagnostic === "malformed_procargs_trailing_entries") return diagnostic;
			if (diagnostic === "process_identity_changed_during_token_read") return diagnostic;
			if (diagnostic === "process_not_in_snapshot") return diagnostic;
			const processTableFailure = /^process_table_failed_(\d+)$/u.exec(diagnostic ?? "");
			if (processTableFailure?.[1] !== undefined) return `process_table_errno_${processTableFailure[1]}`;
			const sysctlFailure = /^sysctl_failed_(\d+)$/u.exec(diagnostic ?? "");
			if (sysctlFailure?.[1] !== undefined) return `sysctl_errno_${sysctlFailure[1]}`;
			if (diagnostic === "reader_failure") return diagnostic;
			if (diagnostic === "duplicate_run_token") return diagnostic;
			if (diagnostic === "invalid_run_token_encoding") return diagnostic;
			return "other_unavailable";
		};
		processOwnershipFailures = async (members, ownership, host, expectedIdentities = new Map(), exitSettlement = { deadline: undefined }) => {
			const runId = ownership.runId;
			if (host.processIdentities !== undefined) {
				const facts = await settleVanishedTokenFacts(await reobserveUnavailableTokenFacts(await readProcessOwnershipFacts(members, host, undefined, { exitSettlement }), host, exitSettlement, {
					generation: "first-observed",
					runId
				}), host, exitSettlement);
				const failures = [];
				const validatedMembers = [];
				for (const fact of facts) {
					if (processIdentityHasExited(fact.identityAfter)) continue;
					if (processIdentityIsExiting(fact.identityAfter)) {
						failures.push({
							pid: fact.process.pid,
							reason: "process-identity-unavailable",
							diagnostic: "native process exit could not be confirmed before signal"
						});
						continue;
					}
					const relation = fact.identityAfter.state === "readable" && fact.identityAfter.relation?.state === "observed" ? fact.identityAfter.relation : undefined;
					if (relation !== undefined && relation.processGroupId !== fact.process.processGroupId) {
						ownership.evidenceOwner?.reconcile([fact], {
							runId,
							listedRows: 1,
							listedPids: new Set([fact.process.pid]),
							leaderPid: ownership.leaderPid,
							processGroupIds: new Set([fact.process.processGroupId]),
							scopeFacts: [fact]
						});
						failures.push({
							pid: fact.process.pid,
							reason: "process-identity-unavailable",
							diagnostic: "process group changed during ownership validation"
						});
						continue;
					}
					if (fact.state !== "same-generation") {
						failures.push({
							pid: fact.process.pid,
							reason: "process-identity-unavailable",
							diagnostic: "process identity changed or became unavailable before signal"
						});
						continue;
					}
					const expected = expectedIdentities.get(fact.process.pid);
					if (expected !== undefined && expected !== null && fact.identityAfter.state === "readable" && fact.identityAfter.identity !== expected || expected === null || relation === undefined) {
						failures.push({
							pid: fact.process.pid,
							reason: "process-identity-unavailable",
							diagnostic: "process identity or group membership could not be revalidated before signal"
						});
						continue;
					}
					if (fact.token.state === "unavailable") {
						failures.push(unreadableTokenFailure(fact, fact.token.reason));
					} else if (fact.token.runId !== runId) {
						failures.push({
							pid: fact.process.pid,
							reason: "run-token-mismatch"
						});
					} else {
						validatedMembers.push(fact.process);
					}
				}
				return {
					failures,
					validatedMembers
				};
			}
			return {
				failures: await processRunTokenFailures(members, runId, host),
				validatedMembers: members
			};
		};
		processRunTokenFailures = async (members, runId, host) => {
			const failures = [];
			for await (const { process: member, observation } of readProcessRunTokens(host, members)) {
				if (observation.state === "readable") {
					if (observation.runId !== runId) failures.push({
						pid: member.pid,
						reason: "run-token-mismatch"
					});
					continue;
				}
				failures.push({
					pid: member.pid,
					reason: "environment-unreadable",
					diagnostic: observation.reason
				});
			}
			return recheckOwnershipFailures(failures, host);
		};
		recheckOwnershipFailures = async (failures, host) => {
			if (!failures.some(({ reason }) => reason !== "run-token-mismatch")) return failures;
			try {
				let processes = await host.listProcesses();
				const isDarwin = (host.platform ?? process.platform) === "darwin";
				for (let attempt = 0; isDarwin && attempt < 3 && processes.some(({ pid, state }) => failures.some((failure) => failure.pid === pid && failure.reason !== "run-token-mismatch") && state.slice(1).includes("E")); attempt += 1) {
					await setTimeout(40);
					processes = await host.listProcesses();
				}
				const live = new Set(liveProcesses(processes).map(({ pid }) => pid));
				return failures.filter(({ pid, reason }) => reason === "run-token-mismatch" || live.has(pid));
			} catch (cause) {
				return failures.map((failure) => failure.reason === "run-token-mismatch" ? failure : {
					...failure,
					diagnostic: `${failure.diagnostic}; process liveness recheck failed: ${errorMessage(cause)}`
				});
			}
		};
		PLATFORM_BINARY_ENVIRONMENT_WITHHELD = "platform_binary_environment_withheld";
		RESTRICTED_PROCESS_ENVIRONMENT_WITHHELD = "restricted_process_environment_withheld";
		currentProcessUid = () => typeof process.getuid === "function" ? process.getuid() : undefined;
		environmentWithheldFromInspection = (diagnostic, observedUid, restriction) => {
			if (restriction !== undefined) return true;
			const uid = currentProcessUid();
			if (uid !== undefined && observedUid !== undefined && observedUid !== uid) return true;
			return diagnostic === PLATFORM_BINARY_ENVIRONMENT_WITHHELD || diagnostic === RESTRICTED_PROCESS_ENVIRONMENT_WITHHELD;
		};
		scanTokenOwnedProcesses = async (processes, runId, host, captureBaseline, relation, exitSettlement = { deadline: undefined }) => {
			if (host.processIdentities !== undefined) return scanWithOwnershipEvidence(processes, runId, host, captureBaseline, relation, exitSettlement);
			const candidates = processes;
			const failures = [];
			const owned = [];
			const ownedIdentities = new Map();
			const recordOwned = (process) => {
				owned.push(process);
				ownedIdentities.set(process.pid, null);
			};
			const unreadable = [];
			for await (const { process, observation } of readProcessRunTokens(host, candidates)) {
				if (observation.state === "readable") {
					if (observation.runId === runId) recordOwned(process);
				} else unreadable.push({
					process,
					diagnostic: observation.reason
				});
			}
			const remaining = await settleUnreadableTokenCandidates(unreadable, runId, host, recordOwned);
			const relatedPids = new Set();
			const relatedGroupIds = new Set();
			if (relation !== undefined) {
				relatedPids.add(relation.leaderPid);
				for (const descendant of descendantsOf([relation.leaderPid], processes)) relatedPids.add(descendant.pid);
				relatedGroupIds.add(relation.processGroupId);
				for (const processGroupId of relation.sampledProcessGroupIds ?? []) if (Number.isSafeInteger(processGroupId) && processGroupId > 0) relatedGroupIds.add(processGroupId);
				for (const process of owned) relatedGroupIds.add(process.processGroupId);
			}
			const unverified = [];
			const strict = [];
			const withheld = [];
			for (const candidate of remaining) {
				const isRelated = relation === undefined || relatedPids.has(candidate.process.pid) || relatedGroupIds.has(candidate.process.processGroupId);
				if (!isRelated && environmentWithheldFromInspection(candidate.diagnostic, candidate.process.uid)) {
					withheld.push(candidate);
					continue;
				}
				strict.push(candidate);
			}
			let finalLive;
			try {
				finalLive = new Set(liveProcesses(await host.listProcesses()).map(({ pid }) => pid));
			} catch (cause) {
				void cause;
				finalLive = undefined;
			}
			for (const candidate of strict) {
				if (finalLive !== undefined && !finalLive.has(candidate.process.pid)) continue;
				failures.push({
					pid: candidate.process.pid,
					reason: "environment-unreadable",
					diagnostic: candidate.diagnostic
				});
			}
			for (const candidate of withheld) {
				if (finalLive !== undefined && !finalLive.has(candidate.process.pid)) continue;
				unverified.push({
					pid: candidate.process.pid,
					diagnostic: candidate.diagnostic
				});
			}
			return {
				owned,
				failures,
				unverified,
				identities: ownedIdentities
			};
		};
		scanWithOwnershipEvidence = async (listedProcesses, runId, host, captureBaseline, relation, exitSettlement) => {
			const evidenceOwner = relation === undefined ? new ProcessOwnershipEvidenceOwner() : relation.evidenceOwner;
			if (evidenceOwner === undefined) return {
				owned: [],
				failures: [{
					pid: relation?.leaderPid ?? -1,
					reason: "process-identity-unavailable",
					diagnostic: "persistent process ownership evidence owner is required for scoped token scan"
				}],
				unverified: [],
				identities: new Map()
			};
			const observationRows = evidenceOwner.rowsForObservation(listedProcesses);
			const listedPids = new Set(listedProcesses.map(({ pid }) => pid));
			const baseline = new Map((captureBaseline ?? []).map(({ pid, identity }) => [pid, identity]));
			const retainedPids = new Set(evidenceOwner.candidates.map(({ pid }) => pid));
			const firstIdentities = await readNativeProcessIdentityMap(observationRows, host);
			const candidates = observationRows.filter((process) => {
				if (retainedPids.has(process.pid)) return true;
				if (!baseline.has(process.pid)) return true;
				const before = baseline.get(process.pid);
				const now = firstIdentities.get(process.pid);
				if (before === null || now?.state !== "readable") {
					return true;
				}
				return now.identity !== before;
			});
			const initialFacts = await readProcessOwnershipFacts(candidates, host, undefined, {
				identityBefore: firstIdentities,
				exitSettlement
			});
			const facts = await settleVanishedTokenFacts(await reobserveUnavailableTokenFacts(initialFacts, host, exitSettlement, { generation: "current" }), host, exitSettlement);
			const processGroupIds = new Set([...relation === undefined ? [] : [relation.processGroupId], ...relation?.sampledProcessGroupIds ?? []]);
			const retained = evidenceOwner.reconcile(facts, {
				runId,
				listedRows: listedProcesses.length,
				listedPids,
				leaderPid: relation?.leaderPid ?? -1,
				processGroupIds,
				scopeFacts: initialFacts
			});
			const factsByPid = new Map(facts.map((fact) => [fact.process.pid, fact]));
			const retainedByPid = new Map(retained.map((candidate) => [candidate.pid, candidate]));
			const failures = [];
			const unverified = [];
			const owned = [];
			const identities = new Map();
			for (const fact of facts) {
				if (processIdentityHasExited(fact.identityAfter)) continue;
				if (fact.state === "replaced") failures.push({
					pid: fact.process.pid,
					reason: "process-identity-unavailable",
					diagnostic: "process identity changed during token validation"
				});
				else if (fact.state === "unavailable") failures.push({
					pid: fact.process.pid,
					reason: "process-identity-unavailable",
					diagnostic: "process identity was unavailable during token validation"
				});
				const retainedCandidate = retainedByPid.get(fact.process.pid);
				if (fact.state === "same-generation" && fact.token.state === "readable" && fact.token.runId !== runId && retainedCandidate !== undefined) failures.push({
					pid: fact.process.pid,
					reason: retainedCandidate.applicability === "identity-unresolved" ? "process-identity-unavailable" : "run-token-mismatch"
				});
				if (fact.token.state !== "unavailable") continue;
				const relationBefore = fact.identityBefore.state === "readable" ? fact.identityBefore.relation : undefined;
				const relationAfter = fact.identityAfter.state === "readable" ? fact.identityAfter.relation : undefined;
				const knownUnrelated = relation !== undefined && retainedCandidate === undefined && fact.state === "same-generation" && relationBefore?.state === "observed" && relationAfter?.state === "observed" && relationBefore.parentPid === relationAfter.parentPid && relationBefore.processGroupId === relationAfter.processGroupId;
				const observed = fact.state === "same-generation" && fact.identityAfter.state === "readable" ? fact.identityAfter : undefined;
				if (knownUnrelated && environmentWithheldFromInspection(fact.token.reason, observed?.effectiveUid, observed?.environmentRestriction)) {
					unverified.push({
						pid: fact.process.pid,
						diagnostic: fact.token.reason
					});
					continue;
				}
				if (fact.state === "same-generation" || retainedCandidate?.applicability === "related-ownership-unresolved" && fact.identityAfter.state === "readable" && fact.identityAfter.identity === retainedCandidate.identity) failures.push(unreadableTokenFailure(fact, fact.token.reason));
			}
			for (const candidate of retained) {
				const fact = factsByPid.get(candidate.pid);
				if (fact?.state !== "same-generation") {
					if (fact?.identityAfter.state !== "absent" && !failures.some(({ pid }) => pid === candidate.pid)) mergeProcessOwnershipFailure(failures, {
						pid: candidate.pid,
						reason: "process-identity-unavailable",
						diagnostic: "retained candidate identity is not currently verified"
					});
					continue;
				}
				const identity = fact.identityAfter;
				if (identity.state !== "readable" || candidate.identity === undefined || identity.identity !== candidate.identity) continue;
				if (candidate.applicability !== "token-verified" || fact.token.state !== "readable" || fact.token.runId !== runId) continue;
				if (identity.relation?.state !== "observed") {
					failures.push({
						pid: candidate.pid,
						reason: "process-identity-unavailable",
						diagnostic: "native process membership was unavailable"
					});
					continue;
				}
				owned.push({
					...fact.process,
					parentPid: identity.relation.parentPid,
					processGroupId: identity.relation.processGroupId
				});
				identities.set(candidate.pid, candidate.identity);
			}
			const mergedFailures = [];
			for (const failure of failures) mergeProcessOwnershipFailure(mergedFailures, failure);
			return {
				owned,
				failures: mergedFailures,
				unverified,
				identities
			};
		};
		settleUnreadableTokenCandidates = async (pending, runId, host, recordOwned) => {
			let remaining = pending;
			for (let attempt = 0; attempt < 3 && remaining.length > 0; attempt += 1) {
				await setTimeout(40);
				let live;
				try {
					live = new Set(liveProcesses(await host.listProcesses()).map(({ pid }) => pid));
				} catch (cause) {
					void cause;
					live = undefined;
				}
				const stillUnreadable = [];
				const candidates = remaining.map(({ process }) => process).filter(({ pid }) => live === undefined || live.has(pid));
				for await (const { process, observation } of readProcessRunTokens(host, candidates)) {
					if (observation.state === "readable") {
						if (observation.runId === runId) recordOwned(process);
						continue;
					}
					stillUnreadable.push({
						process,
						diagnostic: observation.reason
					});
				}
				remaining = stillUnreadable;
			}
			return remaining;
		};
	})))();
}

//#endregion
export { boundedUtf8Text as A, DarwinProcessOwnershipInspectionError as C, init_readStableFileBytes as D, RegularFileCapacityError as E, ProcessAdmissionError as M, init_ProcessAdmissionError as N, readStableFileBytes as O, parseLinuxProcessStat as S, init_DarwinProcessRunTokenReader as T, ProcessRunTokenReadError as _, verifyNoTokenOwnedProcesses as a, selectCapturedProcessGroupIds as b, LinuxOwnedProcessPrerequisiteError as c, observeOwnedProcessLineage as d, observeProcessStartIdentity as f, systemProcessOwnershipHost as g, signalProcessWithStartIdentity as h, readProcessRunId as i, init_boundedUtf8Text as j, readStableFilePrefix as k, init_ProcessOwnershipObservation as l, prepareProcessOwnershipInspection as m, cleanupWindowsProcessTree as n, ProcessOwnershipEvidenceOwner as o, observeProcessStartIdentityExit as p, init_ProcessOwnership as r, init_ProcessOwnershipEvidence as s, cleanupOwnedProcessGroup as t, observeOwnedProcessGroups as u, init_ProcessRunTokenObservations as v, SWIFTC_INTERRUPT as w, init_LinuxProcessStat as x, init_ProcessOwnershipProcessTree as y };