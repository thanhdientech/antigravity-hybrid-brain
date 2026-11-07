import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_OwnedRegularFile, withOwnedRegularFile } from "./ArtifactReader-DJ9rniiL.js";
import { init_safeJson, safeParseJson } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { appendCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { ProviderCleanupError, init_providerCleanupError } from "./providerCleanupError-7gv3MO0l.js";
import { execFileOutput, init_ExecFileOutput } from "./ExecFileOutput-CjfCq1cQ.js";
import { init_readStableFileBytes, readStableFileBytes } from "./readStableFileBytes-ygI763vO.js";
import { constants } from "node:fs";
import { release } from "node:os";
import { dirname, isAbsolute, join } from "node:path";
import { chmod, copyFile, lstat, mkdir, mkdtemp, readFile, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { z } from "zod";

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
export { createDarwinHelperCache, darwinHelperCacheDirectory, defaultDarwinHelperCacheDirectory, init_DarwinHelperCache };