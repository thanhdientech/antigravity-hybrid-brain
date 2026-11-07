import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { RegularFileCleanupFailure, init_OwnedRegularFile } from "./ArtifactReader-DJ9rniiL.js";
import { existingSkillDestinations, init_ClientRegistrationIdentity, init_SetupSkill, withoutPackageRunnerIdentity } from "./SetupSkill-CYR5hbcc.js";
import { PRODUCT_IDENTITY, init_identity, init_safeJson, safeParseJson } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { absoluteCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-C6Clg7Wy.js";
import { init_snapshotEnvironment, snapshotEnvironment } from "./snapshotEnvironment-C6Y7aHfj.js";
import { ProviderProcessSupervisor, init_ProviderProcess } from "./ProviderProcess-DmtX0y7I.js";
import { ProviderStartupDeadline, init_ProviderDeadline } from "./ProviderDeadline-8m2pFRDc.js";
import { homeDirectoryFromEnvironment, init_homeDirectory } from "./homeDirectory-DLIK7QRT.js";
import { init_WindowsBatchCommand, isWindowsBatchFile, windowsBatchCommand } from "./WindowsBatchCommand-vBuMcUbM.js";
import { findWindowsExecutable, init_WindowsExecutable } from "./WindowsExecutable-BiqeAPHd.js";
import { init_ClientRegistrationStatus, readClientRegistrationInspections } from "./ClientRegistrationStatus-Carh0GJa.js";
import { init_Update, updateInstallCommand } from "./Update-Co5znKnD.js";
import { basename, dirname, join, resolve, win32 } from "node:path";
import { realpath, stat } from "node:fs/promises";
import { z } from "zod";
import { finished } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { Writable } from "node:stream";
import { lt, valid } from "semver";
import spawn$1 from "cross-spawn";

//#region dist/application/UpdateMaintenance.js
var setupPlanSchema, existingMaintenanceScope, planIntegrationMaintenance;
function init_UpdateMaintenance() {
	return (init_UpdateMaintenance = __esmMin((() => {
		init_OwnedRegularFile();
		init_ClientRegistrationStatus();
		init_SetupSkill();
		setupPlanSchema = z.object({
			status: z.literal("planned"),
			plannedActions: z.array(z.object({
				id: z.string(),
				kind: z.enum(["configure_client", "install_skill"]),
				label: z.string(),
				target: z.string(),
				detail: z.string(),
				external: z.literal(false),
				operation: z.enum([
					"create",
					"update",
					"install"
				]),
				backupPath: z.string().optional(),
				commands: z.array(z.string()).optional()
			}))
		});
		existingMaintenanceScope = async (home, entryPoint, environment, resources) => {
			const registrations = await readClientRegistrationInspections(home, entryPoint, {
				environment,
				evidence: "ownership",
				...resources === undefined ? {} : { resources }
			});
			const clients = [];
			const unresolved = [];
			for (const { status: registration, activation, commandIdentity } of registrations) {
				if (registration.state === "unknown" || registration.state === "invalid") {
					unresolved.push(registration);
					continue;
				}
				if (activation !== "enabled" || registration.state !== "aligned" && registration.state !== "stale" || commandIdentity !== "owned") continue;
				clients.push(registration.client);
			}
			const skills = await existingSkillDestinations(home, environment, process.platform, resources);
			return {
				clients,
				skill: skills.destinations.length > 0,
				skillDestinations: skills.destinations,
				...skills.issues.length === 0 ? {} : { skillIssues: skills.issues },
				...unresolved.length === 0 ? {} : { unresolved }
			};
		};
		planIntegrationMaintenance = async (home, entryPoint, environment, execute, resources) => {
			try {
				const scope = await existingMaintenanceScope(home, entryPoint, environment, resources);
				if ((scope.unresolved?.length ?? 0) > 0 || (scope.skillIssues?.length ?? 0) > 0) return {
					status: "unavailable",
					scope,
					remediation: `Integration maintenance is unresolved: ${[...(scope.unresolved ?? []).map(({ client, config_path, remediation }) => `${client} (${config_path}): ${remediation ?? "Registration identity is unresolved"}`), ...(scope.skillIssues ?? []).map(({ client, path, detail }) => `${client ?? "skill"} (${path}): ${detail}`)].join(" ")}`
				};
				const skillDestinations = scope.skillDestinations ?? [];
				if (scope.clients.length === 0 && !scope.skill) return {
					status: "current",
					plannedActions: []
				};
				const command = [
					process.execPath,
					entryPoint,
					"setup",
					...scope.clients.flatMap((client) => ["--client", client]),
					...skillDestinations.flatMap(({ client }) => ["--skill-client", client]),
					`--skill=${String(scope.skill)}`
				];
				const execution = await execute([
					...command,
					"--dry-run",
					"--json"
				]);
				if (!execution.ok) return {
					status: "unavailable",
					remediation: execution.error
				};
				const plan = setupPlanSchema.safeParse(JSON.parse(execution.value));
				if (!plan.success) return {
					status: "unavailable",
					remediation: `The updated setup executable returned an invalid maintenance plan: ${plan.error.message}`
				};
				if (plan.data.plannedActions.length === 0) return {
					status: "current",
					plannedActions: []
				};
				const allowedIds = new Set(scope.clients.map((client) => `configure_client:${client}`));
				const skillTargets = new Set(skillDestinations.map(({ path }) => path));
				if (plan.data.plannedActions.some((action) => action.kind === "install_skill" ? !skillTargets.has(action.target) : !allowedIds.has(action.id))) return {
					status: "unavailable",
					remediation: "The updated setup plan included an integration outside the existing REA maintenance scope."
				};
				return {
					status: "planned",
					scope,
					command,
					plannedActions: plan.data.plannedActions.map(({ backupPath, commands, ...action }) => ({
						...action,
						...backupPath === undefined ? {} : { backupPath },
						...commands === undefined ? {} : { commands }
					}))
				};
			} catch (cause) {
				if (resources === undefined && cause instanceof RegularFileCleanupFailure) throw cause;
				return {
					status: "unavailable",
					remediation: cause instanceof Error ? cause.message : String(cause)
				};
			}
		};
	})))();
}

//#endregion
//#region dist/application/UpdateCommandProgress.js
var UpdateCommandProgress;
function init_UpdateCommandProgress() {
	return (init_UpdateCommandProgress = __esmMin((() => {
		UpdateCommandProgress = class {
			destination;
			#streams = [];
			#sink;
			#finished;
			#closing;
			#failed = false;
			#pendingWrites = 0;
			#closed = false;
			#onDestinationError = (cause) => {
				this.#sink.destroy(cause);
			};
			constructor(destination) {
				this.destination = destination;
				this.#sink = new Writable({ write: (chunk, encoding, callback) => {
					this.#pendingWrites++;
					destination.write(chunk, encoding, (cause) => {
						this.#pendingWrites--;
						callback(cause);
						setImmediate(() => this.#releaseDestination());
					});
				} });
				this.#finished = finished(this.#sink, { cleanup: true }).then(() => undefined, (cause) => {
					this.#failed = true;
					for (const stream of this.#streams) {
						stream.unpipe(this.#sink);
						stream.resume();
					}
					return cause instanceof Error ? cause : new Error(String(cause));
				});
				destination.on("error", this.#onDestinationError);
			}
			pipe(stream) {
				this.#streams.push(stream);
				if (this.#failed) stream.resume();
				else stream.pipe(this.#sink, { end: false });
			}
			close() {
				this.#closing ??= this.#close();
				return this.#closing;
			}
			async #close() {
				for (const stream of this.#streams) stream.unpipe(this.#sink);
				this.#sink.end();
				try {
					return await this.#finished;
				} finally {
					this.#closed = true;
					setImmediate(() => this.#releaseDestination());
				}
			}
			#releaseDestination() {
				if (this.#closed && this.#pendingWrites === 0) this.destination.off("error", this.#onDestinationError);
			}
		};
	})))();
}

//#endregion
//#region dist/application/UpdateCommandRunner.js
var UPDATE_COMMAND_OUTPUT_BYTES, UPDATE_PROBE_TIMEOUT_MS, commandFailure, UpdateCommandRunner, runUpdateProcess, probeFailureDetail;
function init_UpdateCommandRunner() {
	return (init_UpdateCommandRunner = __esmMin((() => {
		init_snapshotEnvironment();
		init_WindowsExecutable();
		init_WindowsBatchCommand();
		init_ArtifactResourceScope();
		init_ProviderProcess();
		init_ProviderDeadline();
		init_result();
		init_UpdateCommandProgress();
		init_ClientRegistrationIdentity();
		UPDATE_COMMAND_OUTPUT_BYTES = 4 * 1024 * 1024;
		UPDATE_PROBE_TIMEOUT_MS = 1e4;
		commandFailure = (detail, kind = "execution") => err({
			kind,
			detail
		});
		UpdateCommandRunner = class {
			probeTimeoutMs;
			#resources = new ArtifactResourceScope();
			#controller = new AbortController();
			constructor(probeTimeoutMs = UPDATE_PROBE_TIMEOUT_MS) {
				this.probeTimeoutMs = probeTimeoutMs;
			}
			async runProbe(command, environment, output = "structured", workingDirectory) {
				if (this.#controller.signal.aborted) return commandFailure("Update command runner is closed.");
				const deadline = new ProviderStartupDeadline(this.probeTimeoutMs, this.#controller.signal);
				try {
					return await this.#resources.run(() => runUpdateProcess(command, environment, output, workingDirectory, "complete", this.#resources, deadline.signal, deadline));
				} catch (cause) {
					return commandFailure(cause instanceof Error ? cause.message : String(cause));
				} finally {
					deadline.dispose();
				}
			}
			async runInstall(command, environment, output, workingDirectory) {
				if (this.#controller.signal.aborted) return err("Update command runner is closed.");
				return this.#resources.run(() => runUpdateProcess(command, environment, output, workingDirectory, "diagnostics", this.#resources, this.#controller.signal)).then((result) => result.ok ? result : err(result.error.detail)).catch((cause) => err(cause instanceof Error ? cause.message : String(cause)));
			}
			close() {
				this.#controller.abort(new Error("Update command runner closed."));
				return this.#resources.close();
			}
		};
		runUpdateProcess = async (command, selectedEnvironment, output, workingDirectory, retention, resources, lookupSignal, probe) => {
			if (probe?.signal.aborted) return commandFailure("Update metadata probe cancelled before launch.");
			const [executable, ...args] = command;
			if (executable === undefined) return commandFailure("No executable supplied.", "launch");
			const environment = snapshotEnvironment(withoutPackageRunnerIdentity(selectedEnvironment));
			let selectedExecutable = executable;
			let selectedArguments = args;
			let windowsVerbatimArguments = false;
			if (process.platform === "win32") {
				if (!win32.isAbsolute(executable) && !/[\\/]/u.test(executable) && win32.parse(executable).root === "") {
					const found = await findWindowsExecutable(executable, environment, {
						signal: lookupSignal,
						allowBatch: true,
						...workingDirectory === undefined ? {} : { cwd: workingDirectory }
					});
					if (!found.ok) {
						const failure = found.error;
						return commandFailure(failure.kind === "interrupted" ? "Update command PATH lookup interrupted before launch." : failure.kind === "inspection" ? `Update command PATH candidate could not be inspected: ${failure.path} (${failure.code ?? "unknown"}).` : failure.kind === "invalid_extension" ? `Invalid Windows PATHEXT extension: ${failure.extension}` : `Update executable was not found on the selected Windows PATH/PATHEXT: ${executable}`, failure.kind === "interrupted" ? "execution" : "launch");
					}
					selectedExecutable = found.value;
				} else {
					selectedExecutable = win32.resolve(workingDirectory ?? process.cwd(), executable);
				}
				if (isWindowsBatchFile(selectedExecutable)) {
					const invocation = windowsBatchCommand({
						environment,
						batchPath: selectedExecutable,
						arguments: args
					});
					selectedExecutable = invocation.command;
					selectedArguments = [...invocation.arguments];
					windowsVerbatimArguments = true;
				}
			}
			if (lookupSignal.aborted) return commandFailure("Update command cancelled before launch.");
			let child;
			try {
				child = (process.platform === "win32" ? spawn : spawn$1)(selectedExecutable, selectedArguments, {
					stdio: [
						"ignore",
						"pipe",
						"pipe"
					],
					env: environment,
					windowsHide: true,
					windowsVerbatimArguments,
					...workingDirectory === undefined ? {} : { cwd: workingDirectory }
				});
			} catch (cause) {
				return commandFailure(cause instanceof Error ? cause.message : String(cause), "launch");
			}
			let spawned = false;
			child.once("spawn", () => {
				spawned = true;
			});
			let processFailure;
			const supervisor = new ProviderProcessSupervisor({
				process: child,
				ownsProcessLifetime: true
			}, {
				maxDiagnosticBytes: UPDATE_COMMAND_OUTPUT_BYTES,
				onDiagnostic: (event) => {
					if (event.type === "error") processFailure ??= event.message;
				}
			});
			const progress = output === "human" ? new UpdateCommandProgress(process.stderr) : undefined;
			if (progress !== undefined) {
				for (const stream of [child.stdout, child.stderr]) if (stream !== null) progress.pipe(stream);
			}
			let retained = false;
			try {
				const completed = await supervisor.waitForOutputClose(undefined, probe?.signal);
				let interrupted;
				if (!completed) {
					interrupted = probe?.interruption === "timeout" ? `Update metadata probe timed out after ${String(probe.timeoutMs)} ms.` : "Update metadata probe cancelled.";
					const stopped = await supervisor.stop();
					if (stopped.status === "incomplete") {
						retained = true;
						resources.retain({
							kind: "lease",
							resource: executable,
							lease: { release: async () => {
								const retried = await supervisor.stop();
								if (retried.status === "incomplete") throw new Error(retried.reason);
							} }
						});
						interrupted += ` Cleanup incomplete: ${stopped.reason}`;
					}
				}
				const progressFailure = await progress?.close();
				const snapshot = supervisor.snapshot();
				if (processFailure !== undefined) return commandFailure(probeFailureDetail(interrupted === undefined ? processFailure : `${processFailure} ${interrupted}`, snapshot), spawned ? "execution" : "launch");
				if (interrupted !== undefined) return commandFailure(probeFailureDetail(interrupted, snapshot));
				if (snapshot.outputIncomplete === true) return commandFailure("Update command output did not close completely.");
				if (retention === "complete" && snapshot.diagnosticTruncated === true) return commandFailure(`Update command output exceeded the ${UPDATE_COMMAND_OUTPUT_BYTES}-byte complete-output retention budget; reply was not accepted.`);
				if (snapshot.exitCode !== 0 || snapshot.signal !== null) {
					const detail = snapshot.stderr.text.trim() || snapshot.stdout.text.trim() || (typeof snapshot.signal === "string" ? `Process terminated by ${snapshot.signal}.` : typeof snapshot.exitCode === "number" ? `Process exited with code ${snapshot.exitCode}.` : "Update command failed without a recorded exit status.");
					return commandFailure(snapshot.diagnosticTruncated ? `${detail}\n[Update diagnostics truncated at ${UPDATE_COMMAND_OUTPUT_BYTES} bytes; later output omitted.]` : detail);
				}
				if (retention === "complete" && (snapshot.stdout.invalidUtf8 || snapshot.stderr.invalidUtf8)) return commandFailure("Update command returned invalid UTF-8; complete output is unavailable.");
				if (progressFailure !== undefined) return commandFailure(`Update progress output failed: ${progressFailure.message}`);
				if (probe?.interruption !== undefined) return commandFailure(probeFailureDetail(probe.interruption === "timeout" ? `Update metadata probe timed out after ${String(probe.timeoutMs)} ms.` : "Update metadata probe cancelled.", snapshot));
				return ok(retention === "diagnostics" ? "" : snapshot.stdout.text.trim());
			} finally {
				if (!retained) supervisor.dispose();
				await progress?.close();
			}
		};
		probeFailureDetail = (reason, snapshot) => [
			reason,
			snapshot.stdout.text === "" ? "" : `stdout: ${snapshot.stdout.text}`,
			snapshot.stderr.text === "" ? "" : `stderr: ${snapshot.stderr.text}`,
			snapshot.diagnosticTruncated ? "[Update diagnostics truncated.]" : "",
			snapshot.outputIncomplete ? "[Update output did not close completely.]" : ""
		].filter((part) => part !== "").join("\n");
	})))();
}

//#endregion
//#region dist/application/UpdateRuntime.js
var detectNpmInstallation, nonemptyEnvironment, bunGlobalDirectory, detectBunInstallation, INVALID_NPM_RELEASE_METADATA, BUN_LATEST_VERSION_COMMAND, npmLatestVersionCommand, parseNpmLatestVersion, readNpmLatestVersion, nonemptyVersion, npmReleaseLookup, isFile, packageManagerContext, systemUpdateHost;
function init_UpdateRuntime() {
	return (init_UpdateRuntime = __esmMin((() => {
		init_homeDirectory();
		init_callerPath();
		init_identity();
		init_ArtifactResourceScope();
		init_result();
		init_safeJson();
		init_Update();
		init_UpdateMaintenance();
		init_UpdateCommandRunner();
		detectNpmInstallation = async (packageRoot, host) => {
			let canonicalPackageRoot;
			try {
				canonicalPackageRoot = await host.canonicalPath(packageRoot);
			} catch (cause) {
				void cause;
				return undefined;
			}
			try {
				const npmRoot = await host.globalRoot();
				const globalPackageRoot = await host.canonicalPath(resolve(npmRoot, PRODUCT_IDENTITY.packageName));
				if (canonicalPackageRoot === globalPackageRoot) {
					const prefix = await host.globalPrefix();
					return prefix.length === 0 ? undefined : {
						manager: "npm",
						prefix,
						packageRoot: canonicalPackageRoot
					};
				}
			} catch (cause) {
				void cause;
			}
			const nodeModules = dirname(canonicalPackageRoot);
			const library = dirname(nodeModules);
			if (basename(canonicalPackageRoot) !== PRODUCT_IDENTITY.packageName || basename(nodeModules) !== "node_modules" || basename(library) !== "lib") return undefined;
			return {
				manager: "npm",
				prefix: dirname(library),
				packageRoot: canonicalPackageRoot
			};
		};
		nonemptyEnvironment = (value) => value === undefined || value.length === 0 ? undefined : value;
		bunGlobalDirectory = (environment, platform) => {
			const explicit = nonemptyEnvironment(environment.BUN_INSTALL_GLOBAL_DIR);
			if (explicit !== undefined) return absoluteCallerPath(explicit);
			const installRoot = nonemptyEnvironment(environment.BUN_INSTALL);
			if (installRoot !== undefined) return resolve(installRoot, "install", "global");
			const cacheRoot = nonemptyEnvironment(environment.XDG_CACHE_HOME) ?? homeDirectoryFromEnvironment(environment, platform);
			return resolve(cacheRoot, ".bun", "install", "global");
		};
		detectBunInstallation = async (packageRoot, globalDirectory, host) => {
			try {
				const canonicalPackageRoot = await host.canonicalPath(packageRoot);
				const canonicalGlobalDirectory = await host.canonicalPath(globalDirectory);
				const globalPackageRoot = await host.canonicalPath(join(canonicalGlobalDirectory, "node_modules", PRODUCT_IDENTITY.packageName));
				if (canonicalPackageRoot !== globalPackageRoot || !await host.isFile(join(canonicalGlobalDirectory, "package.json"))) return undefined;
				return {
					manager: "bun",
					globalDirectory: canonicalGlobalDirectory,
					packageRoot: canonicalPackageRoot
				};
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		INVALID_NPM_RELEASE_METADATA = "Invalid npm release metadata: expected a version string or a single-element version array.";
		BUN_LATEST_VERSION_COMMAND = [
			"bun",
			"info",
			PRODUCT_IDENTITY.packageName,
			"dist-tags.latest",
			"--json"
		];
		npmLatestVersionCommand = (installation) => [
			"npm",
			"view",
			"--global",
			...installation === undefined ? [] : ["--prefix", installation.prefix],
			PRODUCT_IDENTITY.packageName,
			"dist-tags.latest",
			"--json",
			"--fetch-retries=0",
			"--fetch-timeout=10000"
		];
		parseNpmLatestVersion = (metadata) => {
			const decoded = safeParseJson(metadata);
			if (!decoded.ok) return err(decoded.error);
			const version = readNpmLatestVersion(decoded.value);
			return version === undefined ? err(INVALID_NPM_RELEASE_METADATA) : ok(version);
		};
		readNpmLatestVersion = (value) => {
			if (typeof value === "string") return nonemptyVersion(value);
			if (!Array.isArray(value) || value.length !== 1) return undefined;
			const only = value[0];
			return typeof only === "string" ? nonemptyVersion(only) : undefined;
		};
		nonemptyVersion = (value) => value.length === 0 ? undefined : value;
		npmReleaseLookup = (response) => {
			if (!response.ok) return err({
				kind: "unavailable",
				detail: response.error
			});
			const parsed = parseNpmLatestVersion(response.value);
			return parsed.ok ? ok(parsed.value) : err({
				kind: "invalid-metadata",
				detail: parsed.error
			});
		};
		isFile = async (path) => {
			try {
				return (await stat(path)).isFile();
			} catch (cause) {
				void cause;
				return false;
			}
		};
		packageManagerContext = (installation, environment) => installation?.manager === "bun" ? {
			environment: {
				...environment,
				BUN_INSTALL_GLOBAL_DIR: installation.globalDirectory
			},
			workingDirectory: installation.globalDirectory
		} : {
			environment,
			workingDirectory: undefined
		};
		systemUpdateHost = (packageRoot = fileURLToPath(new URL("../..", new URL("../application/UpdateRuntime.js", import.meta.url).href)), home = undefined, environment = process.env) => {
			const resources = new ArtifactResourceScope();
			const commands = new UpdateCommandRunner();
			const requireOutput = async (command) => {
				const result = await commands.runProbe(command, environment);
				if (!result.ok) throw new Error(result.error.detail);
				return result.value;
			};
			return {
				installation: async () => await detectBunInstallation(packageRoot, bunGlobalDirectory(environment, process.platform), {
					canonicalPath: realpath,
					isFile
				}) ?? detectNpmInstallation(packageRoot, {
					canonicalPath: realpath,
					globalRoot: () => requireOutput([
						"npm",
						"root",
						"--global"
					]),
					globalPrefix: () => requireOutput([
						"npm",
						"prefix",
						"--global"
					])
				}),
				latestVersion: async (installation) => {
					const context = packageManagerContext(installation, environment);
					if (installation?.manager === "bun") {
						const version = await commands.runProbe(["bun", "--version"], context.environment, "structured", context.workingDirectory);
						if (!version.ok) return err({
							kind: "package-manager-unavailable",
							manager: "bun",
							detail: version.error.detail
						});
						const bunVersion = valid(version.value);
						if (bunVersion === null || lt(bunVersion, "1.2.17")) return err({
							kind: "unsupported-package-manager",
							detail: `REA updates for Bun global installations require Bun 1.2.17 or later; bun --version returned ${JSON.stringify(version.value)}. Upgrade Bun manually, then rerun rea update.`
						});
					}
					const result = await commands.runProbe(installation?.manager === "bun" ? BUN_LATEST_VERSION_COMMAND : npmLatestVersionCommand(installation), context.environment, "structured", context.workingDirectory);
					if (!result.ok && result.error.kind === "launch") return err({
						kind: "package-manager-unavailable",
						manager: installation?.manager ?? "npm",
						detail: result.error.detail
					});
					return npmReleaseLookup(result.ok ? result : err(result.error.detail));
				},
				installVersion: async (installation, version, output) => {
					const context = packageManagerContext(installation, environment);
					const result = await commands.runInstall(updateInstallCommand(installation, version), context.environment, output, context.workingDirectory);
					return result.ok ? ok(undefined) : result;
				},
				installedVersion: async (installation) => {
					const result = await commands.runProbe([
						process.execPath,
						join(installation.packageRoot, "scripts", "rea.mjs"),
						"--version"
					], environment);
					return result.ok ? result : err(result.error.detail);
				},
				planMaintenance: (installation) => planIntegrationMaintenance(home ?? homeDirectoryFromEnvironment(environment, process.platform), join(installation.packageRoot, "scripts", "rea.mjs"), environment, async (command) => {
					const result = await commands.runProbe(command, environment);
					return result.ok ? result : err(result.error.detail);
				}, resources),
				close: async () => {
					const results = await Promise.allSettled([commands.close(), resources.close()]);
					const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason instanceof Error ? result.reason.message : String(result.reason)] : []);
					return failures.length === 0 ? undefined : `Update resource cleanup failed: ${failures.join("; ")}`;
				}
			};
		};
	})))();
}

//#endregion
init_UpdateRuntime();
export { BUN_LATEST_VERSION_COMMAND, bunGlobalDirectory, detectBunInstallation, detectNpmInstallation, npmLatestVersionCommand, npmReleaseLookup, parseNpmLatestVersion, systemUpdateHost };