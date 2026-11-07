import { __esmMin, __exportAll } from "./rolldown-runtime-DXoylpqc.js";
import { BinaryTargetError, analysisErrorRemediationAction, init_analysisErrorPresentation, init_analysisErrorProjection, init_configurationErrors, projectAnalysisError } from "./jsonLines-CKG28FwL.js";
import { ArtifactReaderFailure, init_ArtifactReader } from "./ArtifactReader-DJ9rniiL.js";
import { AnalysisCleanupLease, init_AnalysisCleanupLease } from "./AnalysisCleanupLease-DZIxbgES.js";
import { AnalysisCancelledError, AnalysisError, init_analysisErrorBase, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { init_SetupSkill, init_SupportedClients, manualRegistrationRemediation, readInstalledSkillIdentity } from "./SetupSkill-CYR5hbcc.js";
import { PRODUCT_IDENTITY, SDK_IDENTITY, compareUnicodeCodePoints, init_canonicalOrdering, init_identity, init_unicodeCodePointOrder, uniqueSorted } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_jsonValue, jsonValueSchema } from "./jsonValue-DGGrC1lE.js";
import { appendCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";
import { bindArtifactFileCleanup, init_ArtifactFileOperation } from "./ArtifactFileOperation-YawaP_UN.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-C6Clg7Wy.js";
import { init_BinaryTargetResolver, parseBinaryTarget } from "./BinaryTargetResolver-B2kcj1rP.js";
import { ProviderCleanupError, init_providerCleanupError } from "./providerCleanupError-7gv3MO0l.js";
import { SUPPORTED_NODE_VERSION_PROSE, blocksProcessStart, init_processStart, init_runtimeVersion, javaScriptRuntime, supportsJavaScriptRuntime } from "./cliOutput-BK02eMs-.js";
import { ExecFileOutputCancelledError, execFileFailureCapturedOutput, execFileOutput, execFileOutputFailure, init_ExecFileOutput } from "./ExecFileOutput-CjfCq1cQ.js";
import { init_snapshotEnvironment, snapshotEnvironment } from "./snapshotEnvironment-C6Y7aHfj.js";
import { homeDirectoryFromEnvironment, init_homeDirectory } from "./homeDirectory-DLIK7QRT.js";
import { LINUX_HOPPER_SETUP_HOSTS, STARTUP_OWNER_CLOSED, init_LinuxHopper, init_SharedStartupAttempt, inspectLinuxHopperLauncher, linuxSharedLibrariesAvailable, readLinuxDistribution, supportsReaHost } from "./SharedStartupAttempt-CCaCvBPm.js";
import { hopperLauncherDiscovery, init_HopperLauncherDiscovery, init_MacHopperPaths, init_parseConfig, inspectNativeAnalysisConfiguration, readMacHopperRenamedLauncherCandidates } from "./parseConfig-jskOL3MP.js";
import { DEFAULT_CATALOG_IDENTITY, init_catalogIdentity } from "./catalogIdentity-Dc35C2PY.js";
import { init_ClientRegistrationStatus, readClientRegistrationStatuses } from "./ClientRegistrationStatus-Carh0GJa.js";
import { constants } from "node:fs";
import { join } from "node:path";
import { access, readFile, stat } from "node:fs/promises";
import { z } from "zod";

//#region dist/application/homebrew.js
var HOMEBREW_COMMANDS, probeHomebrew, caskDirectoriesSchema, caskConfigSchema, installedCaskAppdir;
function init_homebrew() {
	return (init_homebrew = __esmMin((() => {
		init_callerPath();
		HOMEBREW_COMMANDS = [
			"brew",
			"/opt/homebrew/bin/brew",
			"/usr/local/bin/brew"
		];
		probeHomebrew = async (probe) => {
			for (const command of HOMEBREW_COMMANDS) {
				const result = await probe(command);
				if (result !== undefined) return result;
			}
			return undefined;
		};
		caskDirectoriesSchema = z.object({ appdir: z.string().min(1).optional() }).loose();
		caskConfigSchema = z.object({
			default: caskDirectoriesSchema.optional(),
			env: caskDirectoriesSchema.optional(),
			explicit: caskDirectoriesSchema.optional()
		}).loose();
		installedCaskAppdir = async (caskroom, token, home) => {
			let text;
			try {
				text = await readFile(join(caskroom, token, ".metadata", "config.json"), "utf8");
			} catch (cause) {
				void cause;
				return undefined;
			}
			let parsed;
			try {
				parsed = JSON.parse(text);
			} catch (cause) {
				void cause;
				return undefined;
			}
			const config = caskConfigSchema.safeParse(parsed);
			if (!config.success) return undefined;
			const appdir = config.data.explicit?.appdir ?? config.data.env?.appdir ?? config.data.default?.appdir;
			if (appdir === undefined) return undefined;
			return appdir.startsWith("~/") ? appendCallerPath(home, appdir.slice(2)) : appdir;
		};
	})))();
}

//#endregion
//#region dist/application/SetupRegistrationEnvironment.js
var SELECTED_REGISTRATION_SETTINGS, explicitSetupRegistrationEnvironment, providerRegistrationEnvironment, registrationSpelledSettings;
function init_SetupRegistrationEnvironment() {
	return (init_SetupRegistrationEnvironment = __esmMin((() => {
		init_unicodeCodePointOrder();
		SELECTED_REGISTRATION_SETTINGS = [
			"GHIDRA_INSTALL_DIR",
			"GHIDRA_HEADLESS_MAXMEM",
			"GHIDRA_MAXMEM",
			"JAVA_HOME",
			"HOPPER_LAUNCHER_PATH",
			"HOPPER_LOADER_ARGS_JSON",
			"REA_ILSPY_CMD_PATH",
			"REA_ADB_PATH",
			"REA_APKTOOL_COMMAND",
			"REA_TSHARK_COMMAND",
			"REA_CAPINFOS_COMMAND",
			"REA_TSHARK_PRLIMIT_COMMAND",
			"REA_OBJDUMP_COMMAND",
			"REA_GDB_COMMAND",
			"REA_RIZIN_COMMAND",
			"REA_CUTTER_BRIDGE_DIR",
			"REA_WABT_BIN_DIRECTORY",
			"REA_WAKARU_COMMAND",
			"REA_JAVASCRIPT_PRLIMIT_COMMAND",
			"REA_BINWALK_COMMAND",
			"REA_UNBLOB_COMMAND",
			"REA_FIRMWARE_PRLIMIT_COMMAND",
			"REA_EVM_PRLIMIT_COMMAND",
			"REA_SIGROK_COMMAND",
			"REA_SIGROK_PRLIMIT_COMMAND",
			"REA_MITMDUMP_COMMAND",
			"REA_BROWSER_EXECUTABLE",
			"REA_BROWSER_NO_SANDBOX",
			"REA_PWNTOOLS_PYTHON",
			"REA_PWNTOOLS_MAX_INPUT_BYTES",
			"REA_PWNDBG_GDB",
			"REA_PWNDBG_GDBINIT",
			"REA_PWNDBG_VENV_PATH",
			"REA_DARWIN_SWIFTC_PATH",
			"REA_DARWIN_MODULE_CACHE_PATH",
			"SDKROOT",
			"REA_SWIFTC_COMPILE_TIMEOUT_MS",
			"REA_LOG_LEVEL",
			"REA_REFERENCE_SECRET_PATTERNS_JSON",
			"REA_IDA_MCP_CONFIG",
			"REA_JADX_MCP_JAR",
			"REA_JADX_HEAP_MIB",
			"REA_JADX_ACTIVE_PROCESSOR_COUNT",
			"REA_JADX_OPERATION_TIMEOUT_MS",
			"REA_KUNA_COMMAND",
			"REA_KUNA_CACHE_DIR",
			"REA_KUNA_CACHE_MAX_BYTES",
			"REA_KUNA_PROJECT_TIMEOUT_MS",
			"REA_KUNA_TIMEOUT_MS",
			"REA_KUNA_JOBS",
			"REA_ANALYSIS_PROVIDER",
			"REA_ASAR_MAX_HEADER_BYTES",
			"REA_BRIDGE_MAX_REQUEST_BYTES",
			"REA_CAPTURE_DECODER_OLD_GENERATION_MIB",
			"REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS",
			"REA_GHIDRA_STARTUP_TIMEOUT_MS",
			"REA_GHIDRA_LANGUAGE_ID",
			"REA_GHIDRA_COMPILER_SPEC_ID",
			"REA_GHIDRA_DISABLED_ANALYZERS",
			"REA_GHIDRA_SEED_FILE",
			"REA_GHIDRA_PROJECT_PATH",
			"REA_GHIDRA_PROGRAM_NAME",
			"REA_GHIDRA_NATIVEAOT_JAR",
			"REA_HOPPER_CALLER_SCAN_BUDGET_MS",
			"REA_HOPPER_STARTUP_TIMEOUT_MS",
			"REA_JEB_MCP_URL",
			"REA_JEB_MCP_TIMEOUT_MS",
			"REA_MCP_INPUT_SCHEMA_PROFILE",
			"REA_MCP_TOOL_FAMILIES",
			"REA_MCP_OUTPUT_SCHEMA_PROFILE",
			"REA_MCP_MAX_RESPONSE_BYTES",
			"REA_MCP_MAX_INPUT_ELEMENTS",
			"REA_NATIVE_MATCHING_REPRESENTATION_BYTES",
			"REA_REGEX_MATCHING_DEADLINE_MS",
			"REA_REGEX_WORKER_HEAP_REQUEST_MIB",
			"REA_MCP_INITIALIZE_BUDGET_MS",
			"REA_MCP_TOOLS_LIST_BUDGET_MS",
			"REA_MCP_FIRST_CATALOG_BUDGET_MS",
			"REA_MCP_DOCTOR_DEADLINE_MS"
		];
		explicitSetupRegistrationEnvironment = (environment) => Object.fromEntries(SELECTED_REGISTRATION_SETTINGS.flatMap((key) => {
			const value = environment[key];
			return value === undefined ? [] : [[key, value]];
		}));
		providerRegistrationEnvironment = (inspections) => Object.fromEntries(inspections.flatMap(({ registrationEnvironment }) => Object.entries(registrationEnvironment)).sort(([left], [right]) => compareUnicodeCodePoints(left, right)));
		registrationSpelledSettings = (settings, environment) => {
			const explicit = explicitSetupRegistrationEnvironment(environment);
			return Object.fromEntries(Object.entries(settings).map(([key, value]) => [key, explicit[key] ?? value]));
		};
	})))();
}

//#endregion
//#region dist/domain/macosVersion.js
var macosVersionComponents, macosMajorVersion, macosVersionMeetsMinimum;
function init_macosVersion() {
	return (init_macosVersion = __esmMin((() => {
		macosVersionComponents = (version) => {
			if (version === undefined || !/^\d+(?:\.\d+)*$/u.test(version)) return undefined;
			const components = version.split(".").map(Number);
			return components.every((component) => Number.isSafeInteger(component)) ? components : undefined;
		};
		macosMajorVersion = (version) => macosVersionComponents(version)?.[0];
		macosVersionMeetsMinimum = (hostVersion, minimumVersion) => {
			const host = macosVersionComponents(hostVersion);
			const minimum = macosVersionComponents(minimumVersion);
			if (host === undefined || minimum === undefined) return undefined;
			for (let index = 0; index < Math.max(host.length, minimum.length); index++) {
				const difference = (host[index] ?? 0) - (minimum[index] ?? 0);
				if (difference !== 0) return difference > 0;
			}
			return true;
		};
	})))();
}

//#endregion
//#region dist/application/DoctorDiagnostics.js
var collectDoctorDiagnostics, doctorHealthy, nodeCheck, hostCheck, findHopper, firstExecutable, hopperCheck, optionalHopperStartupTimeoutCheck, runtimeConfigurationChecks, optionalHopperVersionCheck, optionalHopperDemoCheck, optionalIlspyCheck, optionalTargetCheck, check, providerDoctorChecks, unsupportedHopperRemediation, providerCheckName;
function init_DoctorDiagnostics() {
	return (init_DoctorDiagnostics = __esmMin((() => {
		init_runtimeVersion();
		init_HopperLauncherDiscovery();
		init_macosVersion();
		init_LinuxHopper();
		collectDoctorDiagnostics = async (target, host) => {
			const checks = [nodeCheck(host)];
			checks.push(await hostCheck(host));
			const hopperPath = await findHopper(host);
			checks.push(hopperCheck(host, hopperPath));
			const hopperTimeoutCheck = optionalHopperStartupTimeoutCheck(host);
			if (hopperTimeoutCheck !== undefined) checks.push(hopperTimeoutCheck);
			checks.push(...runtimeConfigurationChecks(host));
			const hopperVersionCheck = await optionalHopperVersionCheck(host, hopperPath);
			if (hopperVersionCheck !== undefined) checks.push(hopperVersionCheck);
			const providerInspections = await host.providerInspections?.();
			if (providerInspections !== undefined) checks.push(...providerInspections.flatMap(providerDoctorChecks));
			const ilspyCheck = await optionalIlspyCheck(host);
			if (ilspyCheck !== undefined) checks.push(ilspyCheck);
			const hopperDemoCheck = await optionalHopperDemoCheck(host, hopperPath);
			if (hopperDemoCheck !== undefined) checks.push(hopperDemoCheck);
			const targetCheck = await optionalTargetCheck(target, host);
			if (targetCheck !== undefined) checks.push(targetCheck);
			return {
				checks,
				...hopperPath === undefined ? {} : { hopperPath },
				...providerInspections === undefined ? {} : { providerInspections }
			};
		};
		doctorHealthy = (checks, providers) => {
			if (providers.providerInspections === undefined) return checks.every(({ ok }) => ok);
			const providerChecks = checks.filter(({ name }) => name.startsWith("hopper") || providers.providerInspections?.some((inspection) => providerCheckName(inspection.id, name)) === true);
			const coreHealthy = checks.filter((candidate) => !providerChecks.includes(candidate)).every(({ ok }) => ok);
			const configuredProvidersHealthy = providerChecks.filter(({ name }) => {
				if (name === "hopper-startup-timeout") return true;
				if (name.startsWith("hopper")) return providers.hopperConfigured;
				return providers.providerInspections?.some((inspection) => inspection.configured && providerCheckName(inspection.id, name));
			}).every(({ ok }) => ok);
			return coreHealthy && configuredProvidersHealthy && (providers.hopperAvailable || providers.providerInspections.some(({ available }) => available));
		};
		nodeCheck = ({ runtime }) => {
			const failure = {
				remediation: `Install ${SUPPORTED_NODE_VERSION_PROSE}.`,
				classification: "missing_dependency"
			};
			if (runtime.id === "node") return {
				...check("node", supportsJavaScriptRuntime(runtime), runtime.version, failure),
				details: {
					runtime: "node",
					version: runtime.version
				}
			};
			return {
				...check("node", supportsJavaScriptRuntime(runtime), `Bun ${runtime.version} (Node.js ${runtime.nodeCompatibilityVersion} compatibility)`, failure),
				details: {
					runtime: "bun",
					version: runtime.version,
					node_compatibility_version: runtime.nodeCompatibilityVersion
				}
			};
		};
		hostCheck = async (host) => {
			const macosVersion = host.platform === "darwin" ? await host.macosVersion() : undefined;
			const linuxDistribution = host.platform === "linux" ? await host.linuxDistribution() : undefined;
			const macosMajor = macosMajorVersion(macosVersion);
			if (host.platform === "darwin" && macosMajor === undefined) return {
				name: "host",
				ok: false,
				classification: "unknown",
				detail: macosVersion === undefined ? "The macOS version could not be determined." : `The macOS version probe returned an unrecognized value: ${JSON.stringify(macosVersion)}.`,
				remediation: "Check /usr/bin/sw_vers -productVersion and rerun doctor."
			};
			const supported = host.platform === "darwin" && macosMajor !== undefined && macosMajor >= 12 || host.platform === "linux" && supportsReaHost(linuxDistribution) || host.platform === "win32" && host.architecture === "x64";
			const detail = macosVersion ?? (linuxDistribution === undefined ? `${host.platform} ${host.architecture}` : `${linuxDistribution.id} ${linuxDistribution.versionId ?? "unknown"}`);
			return check("host", supported, detail, {
				remediation: `REA supports macOS 12+, Linux distributions with a recognized apt, dnf, or pacman package family, and the experimental Windows x64 Ghidra P0 boundary; automated Hopper setup on Linux additionally requires ${LINUX_HOPPER_SETUP_HOSTS}.`,
				classification: "unsupported_host"
			});
		};
		findHopper = async (host) => {
			if (host.configuredHopperPath !== undefined) return firstExecutable(host, [host.configuredHopperPath]);
			const discovery = hopperLauncherDiscovery(host.platform, host.homeDirectory);
			const fixed = await firstExecutable(host, discovery.candidates);
			if (fixed !== undefined || !discovery.probesMacApplicationBundles) return fixed;
			const renamed = await firstExecutable(host, await host.manualHopperPaths());
			if (renamed !== undefined) return renamed;
			const brewCandidate = await host.brewHopperPath();
			return firstExecutable(host, brewCandidate === undefined ? [] : [brewCandidate]);
		};
		firstExecutable = async (host, candidates) => {
			for (const candidate of new Set(candidates)) if (await host.executable(candidate)) return candidate;
			return undefined;
		};
		hopperCheck = (host, hopperPath) => check("hopper", hopperPath !== undefined, hopperPath ?? host.configuredHopperPath, {
			remediation: host.configuredHopperPath === undefined ? "Run rea setup to install Hopper, or set HOPPER_LAUNCHER_PATH." : "Unset or update HOPPER_LAUNCHER_PATH to an executable Hopper launcher.",
			classification: host.configuredHopperPath === undefined ? "missing_analysis_engine" : "config_drift"
		});
		optionalHopperStartupTimeoutCheck = (host) => {
			const parsed = host.nativeConfiguration?.configuredHopperStartupTimeout;
			if (parsed === undefined) return undefined;
			return check("hopper-startup-timeout", parsed.ok, parsed.ok ? `REA_HOPPER_STARTUP_TIMEOUT_MS=${String(parsed.value)}` : `REA_HOPPER_STARTUP_TIMEOUT_MS: ${parsed.error.settings.map(({ constraint }) => constraint).join("; ")}`, {
				classification: "config_drift",
				remediation: "Unset REA_HOPPER_STARTUP_TIMEOUT_MS to use the default, or set it to a positive decimal integer from 1 to 2147483647 milliseconds."
			});
		};
		runtimeConfigurationChecks = (host) => {
			const issues = host.nativeConfiguration?.issues;
			if (issues === undefined || issues.length === 0) return [];
			const grouped = [];
			for (const issue of issues) {
				if (issue.setting === "REA_HOPPER_STARTUP_TIMEOUT_MS") continue;
				const existing = grouped.find((item) => item.setting === issue.setting);
				if (existing === undefined) grouped.push({
					setting: issue.setting,
					constraints: [issue.constraint]
				});
				else existing.constraints.push(issue.constraint);
			}
			return grouped.map(({ setting, constraints }) => ({
				...check(`runtime-configuration:${setting}`, false, constraints.map((constraint) => constraint.includes(setting) ? constraint.replace(/\.$/u, "") : `${setting}: ${constraint}`).join("; "), {
					classification: "config_drift",
					remediation: `Correct ${setting} in the environment that starts REA (your shell or the MCP client's registration), then rerun.`
				}),
				details: { setting }
			}));
		};
		optionalHopperVersionCheck = async (host, hopperPath) => {
			if (host.platform !== "linux" || hopperPath === undefined) return undefined;
			const inspected = await host.inspectLinuxHopper(hopperPath);
			const buildCheck = check("hopper-version", inspected.ok, hopperPath, {
				remediation: unsupportedHopperRemediation(host.configuredHopperPath === hopperPath),
				classification: !inspected.ok && [
					"release_metadata",
					"download",
					"verification_unavailable",
					"cancelled",
					"cleanup_failed"
				].includes(inspected.error.reason) ? "unknown" : "config_drift"
			});
			return {
				...buildCheck,
				details: inspected.ok ? {
					reported_release_version: inspected.value.version,
					launcher_sha256: inspected.value.sha256,
					primary_fingerprint: inspected.value.primaryFingerprint,
					source: inspected.value.source
				} : {
					reason: inspected.error.reason,
					message: inspected.error.message
				}
			};
		};
		optionalHopperDemoCheck = async (host, hopperPath) => host.platform !== "linux" || hopperPath === undefined ? undefined : host.linuxDemoRuntimeCheck();
		optionalIlspyCheck = async (host) => {
			if (host.configuredIlspyCmdPath === undefined) return undefined;
			const version = await host.ilspyCmdVersion?.(host.configuredIlspyCmdPath);
			return check("ilspycmd", version !== undefined, version === undefined ? host.configuredIlspyCmdPath : `${host.configuredIlspyCmdPath} (${version})`, {
				remediation: "Unset REA_ILSPY_CMD_PATH or point it at a runnable ilspycmd executable.",
				classification: "config_drift"
			});
		};
		optionalTargetCheck = async (target, host) => target === undefined ? undefined : host.inspectTarget !== undefined ? host.inspectTarget(target) : check("target", await host.validTarget(target), target, {
			remediation: "Supply a readable local app or program path.",
			classification: "config_drift"
		});
		check = (name, ok, detail, failure) => ({
			name,
			ok,
			classification: ok ? "healthy" : failure.classification,
			...detail === undefined ? {} : { detail },
			...ok ? {} : { remediation: failure.remediation }
		});
		providerDoctorChecks = (inspection) => inspection.checks.map((candidate) => ({
			name: candidate.name === "configuration" ? inspection.id : `${inspection.id}-${candidate.name}`,
			ok: candidate.ok,
			classification: candidate.ok ? "healthy" : candidate.classification,
			detail: candidate.detail,
			...candidate.remediation === null ? {} : { remediation: candidate.remediation },
			...candidate.details === undefined ? {} : { details: candidate.details }
		}));
		unsupportedHopperRemediation = (configured) => configured ? "Check HOPPER_LAUNCHER_PATH and its publisher verification evidence. Run rea setup to install and retain an authenticated official Hopper package for offline use." : "Run rea setup to install and retain an authenticated official Hopper package for offline use.";
		providerCheckName = (providerId, name) => name === providerId || name.startsWith(`${providerId}-`);
	})))();
}

//#endregion
//#region dist/application/DoctorScope.js
var normalizeDoctorScope, scopeDoctorChecks, registrationEnvironmentInScope, isProviderCheck, selectedProviderChecksFor, selectedRegistrationCheck, registrationCheck$1, selectedSkillCheck, doctorProviderCheckName;
function init_DoctorScope() {
	return (init_DoctorScope = __esmMin((() => {
		init_canonicalOrdering();
		init_processStart();
		init_SupportedClients();
		normalizeDoctorScope = (requested, target) => ({
			mode: requested === undefined ? "audit-wide" : "explicit",
			clients: uniqueSorted(requested?.clients ?? []),
			...requested?.skillClients === undefined ? {} : { skill_clients: uniqueSorted(requested.skillClients) },
			providers: uniqueSorted(requested?.providers ?? []),
			skill: requested?.skill === true,
			target: target ?? null
		});
		scopeDoctorChecks = (input) => {
			const providerChecks = input.checks.filter((candidate) => isProviderCheck(candidate.name, input.providers.providerInspections));
			const coreChecks = input.checks.filter(({ name }) => name === "node" || input.scope.target !== null && name === "target");
			const clientChecks = input.scope.clients.map((client) => selectedRegistrationCheck(client, input.registrations.find((candidate) => candidate.client === client)));
			const environmentChecks = input.checks.filter((check) => registrationEnvironmentInScope(check, input.scope));
			const skillChecks = input.scope.skill ? [selectedSkillCheck(input.skillState, input.checks)] : [];
			const selectedProviderChecks = input.scope.providers.flatMap((providerId) => selectedProviderChecksFor(providerId, providerChecks, input.providers));
			const hopperHostChecks = input.scope.providers.includes("hopper") ? input.checks.filter(({ name }) => name === "host") : [];
			const blocksMcpStartup = (check) => check.name.startsWith("runtime-configuration:") || check.name === "hopper-startup-timeout";
			const blocksProcess = (check) => {
				const setting = check.details?.setting;
				return check.name.startsWith("runtime-configuration:") && typeof setting === "string" && blocksProcessStart(setting);
			};
			const exercisesMcpStartup = input.scope.clients.length > 0 || input.scope.providers.length > 0;
			const startupChecks = (exercisesMcpStartup ? input.checks.filter(blocksMcpStartup) : input.checks.filter(blocksProcess)).filter((check) => check.name !== "hopper-startup-timeout" || !input.scope.providers.includes("hopper"));
			const scopeChecks = [
				...coreChecks,
				...startupChecks,
				...hopperHostChecks,
				...selectedProviderChecks,
				...clientChecks,
				...environmentChecks,
				...skillChecks
			];
			const selectedNames = new Set(scopeChecks.map(({ name }) => name));
			return {
				healthy: coreChecks.every(({ ok }) => ok) && startupChecks.every(({ ok }) => ok) && hopperHostChecks.every(({ ok }) => ok) && clientChecks.every(({ ok }) => ok) && skillChecks.every(({ ok }) => ok) && selectedProviderChecks.every(({ ok }) => ok),
				scopeChecks,
				informationalChecks: input.checks.filter(({ name }) => !selectedNames.has(name))
			};
		};
		registrationEnvironmentInScope = ({ name, details }, scope) => {
			const [family, client] = name.split(":");
			if (family !== "registration_environment" || client === undefined) return false;
			const providers = details?.providers;
			return scope.clients.includes(client) || Array.isArray(providers) && scope.providers.some((provider) => providers.includes(provider));
		};
		isProviderCheck = (name, inspections) => name.startsWith("hopper") || inspections?.some(({ id }) => doctorProviderCheckName(id, name)) === true;
		selectedProviderChecksFor = (providerId, checks, providers) => {
			const selected = checks.filter(({ name }) => providerId === "hopper" ? name.startsWith("hopper") : doctorProviderCheckName(providerId, name));
			const available = providerId === "hopper" ? providers.hopperAvailable : providers.providerInspections?.find(({ id }) => id === providerId)?.available === true;
			if (available && selected.every(({ ok }) => ok)) return selected;
			if (selected.some(({ ok }) => !ok)) return selected;
			return [...selected, {
				name: `provider:${providerId}`,
				ok: false,
				classification: "missing_analysis_engine",
				detail: `Requested provider ${providerId} is unavailable.`,
				remediation: `Configure the ${providerId} provider, then rerun rea doctor.`
			}];
		};
		selectedRegistrationCheck = (client, status) => {
			const manual = manualRegistrationRemediation(client);
			if (status === undefined && manual !== undefined) return {
				name: `registration:${client}`,
				ok: false,
				classification: "config_drift",
				detail: `${client} is not registered through a local configuration file.`,
				remediation: manual
			};
			return status === undefined ? {
				name: `registration:${client}`,
				ok: false,
				classification: "config_drift",
				detail: `Requested client ${client} was not detected.`,
				remediation: `Install or select ${client}, then run rea setup --client ${client}.`
			} : status.state === "aligned" ? {
				name: `registration:${client}`,
				ok: true,
				classification: "healthy",
				detail: status.config_path
			} : registrationCheck$1(status);
		};
		registrationCheck$1 = (status) => ({
			name: `registration:${status.client}`,
			ok: false,
			classification: status.state === "unknown" ? "unknown" : "config_drift",
			detail: status.config_path,
			remediation: status.remediation
		});
		selectedSkillCheck = (state, checks) => checks.find(({ name }) => name === "skill:identity") ?? {
			name: "skill:identity",
			ok: state === "aligned",
			classification: state === "aligned" ? "healthy" : state === "unknown" ? "unknown" : "config_drift",
			...state === "aligned" ? { detail: "Installed REA skill identity is aligned." } : { remediation: state === "unmanaged" ? "Use regular skill directories, or run rea setup with --skill=false to configure the client without installing the skill." : state === "unknown" ? "Verify access to the reported skill files before retrying." : "Run rea setup to update the installed REA skill." }
		};
		doctorProviderCheckName = (providerId, name) => name === providerId || name.startsWith(`${providerId}-`);
	})))();
}

//#endregion
//#region dist/application/Doctor.js
var Doctor_exports = /* @__PURE__ */ __exportAll({
	runDoctor: () => runDoctor,
	runDoctorOwned: () => runDoctorOwned,
	systemDoctorHost: () => systemDoctorHost
});
var runDoctor, runDoctorOwned, inspectDoctor, registrationAdvisoryChecks, providerSettingSelections, registrationEnvironmentChecks, closeDoctorHost, doctorReportWithCleanup, collectDoctorIdentity, skillIdentityAligned, skillIdentityState, skillIdentityRemediation, skillIdentityCheck, registrationCheck, installationState, systemDoctorHost, readMacosVersion, executableAvailable, uncomposedLinuxDemoRuntimeCheck, uniqueLines, firstIlspyVersionLine;
function init_Doctor() {
	return (init_Doctor = __esmMin((() => {
		init_analysisErrorProjection();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_providerCleanupError();
		init_analysisErrorCleanup();
		init_ArtifactFileOperation();
		init_ArtifactReader();
		init_AnalysisCleanupLease();
		init_SharedStartupAttempt();
		init_ArtifactResourceScope();
		init_parseConfig();
		init_homeDirectory();
		init_snapshotEnvironment();
		init_callerPath();
		init_analysisErrorPresentation();
		init_configurationErrors();
		init_BinaryTargetResolver();
		init_ExecFileOutput();
		init_jsonValue();
		init_runtimeVersion();
		init_homebrew();
		init_MacHopperPaths();
		init_LinuxHopper();
		init_SetupSkill();
		init_catalogIdentity();
		init_identity();
		init_ClientRegistrationStatus();
		init_SetupRegistrationEnvironment();
		init_DoctorDiagnostics();
		init_DoctorScope();
		runDoctor = async (target, selectedHost, requestedScope) => selectedHost === undefined ? runDoctorOwned(target, systemDoctorHost(), requestedScope) : inspectDoctor(target, selectedHost, requestedScope);
		runDoctorOwned = async (target, host, requestedScope) => {
			let report;
			try {
				report = await inspectDoctor(target, host, requestedScope);
			} catch (cause) {
				const cleanup = await closeDoctorHost(host);
				if (cleanup !== undefined && cause instanceof AnalysisError) {
					const cleanupError = typeof cleanup === "string" ? new ProviderCleanupError("rea", [], { reason: cleanup }, { operation: "doctor" }) : cleanup;
					throw analysisErrorWithCleanupFailure(cause, cleanupError, "doctor").bindCleanupDependencies([cause, cleanupError]);
				}
				if (cleanup !== undefined) throw new AggregateError([cause, typeof cleanup === "string" ? new Error(cleanup) : cleanup], "Doctor failed and its resource cleanup remains incomplete.", { cause });
				throw cause;
			}
			const cleanup = await closeDoctorHost(host);
			if (cleanup === undefined && report.healthy && host.signal?.aborted) throw new AnalysisCancelledError("doctor", {
				cause: host.signal.reason,
				diagnostics: { doctor_report: jsonValueSchema.parse(report) }
			});
			return cleanup === undefined ? report : doctorReportWithCleanup(report, cleanup);
		};
		inspectDoctor = async (target, host, requestedScope) => {
			if (host.signal?.aborted) throw new AnalysisCancelledError("doctor", { cause: host.signal.reason });
			const scope = normalizeDoctorScope(requestedScope, target);
			const { checks: diagnosticChecks, hopperPath, providerInspections } = await collectDoctorDiagnostics(target, host);
			const hopperAvailable = hopperPath !== undefined && diagnosticChecks.filter(({ name }) => name.startsWith("hopper")).every(({ ok }) => ok);
			const selections = providerSettingSelections(providerInspections, hopperAvailable && hopperPath === host.configuredHopperPath ? hopperPath : undefined);
			const identity = await collectDoctorIdentity(host, scope, selections);
			const checks = [
				...diagnosticChecks,
				...identity.checks,
				...registrationAdvisoryChecks(identity.value.registrations),
				...registrationEnvironmentChecks(identity.value.registrations, selections)
			];
			const providers = {
				hopperAvailable,
				hopperConfigured: host.configuredHopperPath !== undefined,
				providerInspections
			};
			const environmentHealthy = doctorHealthy(checks, providers);
			const scoped = scopeDoctorChecks({
				checks,
				registrations: identity.value.registrations,
				skillState: identity.value.skill.state,
				providers,
				scope
			});
			return {
				healthy: scope.mode === "audit-wide" ? environmentHealthy : scoped.healthy,
				environment_healthy: environmentHealthy,
				scope,
				scope_checks: scope.mode === "audit-wide" ? checks : scoped.scopeChecks,
				informational_checks: scope.mode === "audit-wide" ? [] : scoped.informationalChecks,
				...hopperPath === undefined ? {} : { hopperPath },
				...providerInspections === undefined ? {} : { providerInspections },
				checks,
				identity: identity.value
			};
		};
		registrationAdvisoryChecks = (registrations) => registrations.flatMap(({ client, advisory }) => advisory === undefined ? [] : [{
			name: `registration_timeout:${client}`,
			ok: true,
			classification: "healthy",
			detail: advisory
		}]);
		providerSettingSelections = (inspections, configuredHopperPath) => [...(inspections ?? []).filter(({ available }) => available).map(({ id, registrationEnvironment }) => ({
			provider: id,
			settings: registrationEnvironment
		})), ...configuredHopperPath === undefined ? [] : [{
			provider: "hopper",
			settings: { HOPPER_LAUNCHER_PATH: configuredHopperPath }
		}]];
		registrationEnvironmentChecks = (registrations, selections) => registrations.flatMap(({ client, provider_settings: settings }) => {
			if (settings === undefined) return [];
			const { unrecorded, differing, unresolved } = settings;
			const names = [
				...unrecorded,
				...differing,
				...unresolved
			];
			return [{
				name: `registration_environment:${client}`,
				ok: true,
				classification: "unknown",
				detail: [
					`Provider checks used this terminal's environment; what the server ${client} starts receives is unknown.`,
					...unrecorded.length === 0 ? [] : [`Its registration does not record ${unrecorded.join(", ")}.`],
					...differing.length === 0 ? [] : [`It records other values for ${differing.join(", ")}.`],
					...unresolved.length === 0 ? [] : [`REA could not resolve its ${unresolved.join(", ")}.`]
				].join(" "),
				details: {
					effective_environment: "unknown",
					providers: selections.filter(({ settings: selected }) => names.some((name) => selected[name] !== undefined)).map(({ provider }) => provider)
				},
				remediation: `Preview rea setup --client ${client} --skill=false --dry-run from this terminal, apply it to record these settings and restart the client, or read binary_session result.tool_availability in the client.`
			}];
		});
		closeDoctorHost = async (host) => {
			try {
				return await host.close?.();
			} catch (cause) {
				if (cause instanceof AnalysisError) return cause;
				return `Doctor host cleanup failed: ${cause instanceof Error ? cause.message : String(cause)}`;
			}
		};
		doctorReportWithCleanup = (report, cleanup) => {
			const check = {
				name: "doctor-resource-cleanup",
				ok: false,
				classification: "config_drift",
				detail: typeof cleanup === "string" ? cleanup : `${cleanup.message} ${cleanup.cleanupResources.join(", ")}`,
				...typeof cleanup === "string" ? {} : { details: { cleanup_failure: projectAnalysisError(cleanup) } },
				remediation: "Resolve the reported cleanup failure, then rerun rea doctor."
			};
			return {
				...report,
				healthy: false,
				environment_healthy: false,
				checks: [...report.checks, check],
				scope_checks: [...report.scope_checks, check]
			};
		};
		collectDoctorIdentity = async (host, scope, selections) => {
			const installationPaths = await host.installationPaths?.() ?? [];
			const registrations = await host.clientRegistrations?.(scope.clients, Object.fromEntries(selections.flatMap(({ settings }) => Object.entries(settings)))) ?? [];
			const skillClientIds = scope.skill_clients ?? (scope.clients.length > 0 ? scope.clients : undefined);
			const installedSkillIdentity = await host.installedSkillIdentity?.(skillClientIds);
			const skillAligned = skillIdentityAligned(installedSkillIdentity);
			return {
				checks: [...skillAligned ? [] : [skillIdentityCheck(installedSkillIdentity)], ...registrations.filter((registration) => registration.state !== "aligned" && registration.state !== "manual").map(registrationCheck)],
				value: {
					cli_package_version: PRODUCT_IDENTITY.packageVersion,
					expected_skill_version: PRODUCT_IDENTITY.skillVersion,
					sdk: SDK_IDENTITY,
					catalog: {
						counts: DEFAULT_CATALOG_IDENTITY.counts,
						digests: DEFAULT_CATALOG_IDENTITY.digests
					},
					live_server: {
						state: "unknown",
						remediation: "Call binary_session in the active client to inspect the running server identity; a registration whose saved scope omits the session family cannot report it, so include session through rea setup --tool-families and restart first."
					},
					installations: {
						paths: installationPaths,
						state: installationState(installationPaths)
					},
					skill: {
						installed_version: installedSkillIdentity?.version ?? null,
						installed_tool_count: installedSkillIdentity?.toolCount ?? null,
						state: skillIdentityState(installedSkillIdentity),
						...installedSkillIdentity?.issues === undefined ? {} : { issues: installedSkillIdentity.issues },
						remediation: skillAligned ? null : skillIdentityRemediation(installedSkillIdentity)
					},
					registrations
				}
			};
		};
		skillIdentityAligned = (identity) => identity?.version === PRODUCT_IDENTITY.skillVersion && identity.toolCount === DEFAULT_CATALOG_IDENTITY.counts.mcp_tools && identity.canonical;
		skillIdentityState = (identity) => {
			if (identity?.issues?.some(({ kind }) => kind === "unreadable" || kind === "unresolved")) return "unknown";
			if (identity?.issues?.some(({ kind }) => kind === "symbolic_link" || kind === "not_directory")) return "unmanaged";
			if (identity?.issues?.some(({ kind }) => kind === "stale")) return "stale";
			if (identity?.issues?.some(({ kind }) => kind === "missing")) return "missing";
			return identity === undefined ? "missing" : skillIdentityAligned(identity) ? "aligned" : "stale";
		};
		skillIdentityRemediation = (identity) => {
			const issues = identity?.issues;
			if (issues !== undefined && issues.length > 0) return issues.map(({ path, detail, kind, client }) => {
				const repair = kind === "stale" || kind === "missing" ? `Run rea setup --skill-client ${client ?? "shared"} --skill to repair this copy.` : "Repair the selected path/profile before rerunning setup, or use --skill=false to configure clients without installing the skill.";
				return `${detail} (${path}). ${repair}`;
			}).join(" ");
			return "Run rea setup to update the installed REA skill.";
		};
		skillIdentityCheck = (identity) => {
			const issues = identity?.issues;
			return {
				name: "skill:identity",
				ok: false,
				classification: skillIdentityState(identity) === "unknown" ? "unknown" : "config_drift",
				detail: issues !== undefined && issues.length > 0 ? `Selected skill identity is ${skillIdentityState(identity)}: ${issues.map(({ path }) => path).join(", ")}.` : identity === undefined ? "Installed REA skill identity is missing." : "Installed REA skill identity is stale.",
				remediation: skillIdentityRemediation(identity)
			};
		};
		registrationCheck = (registration) => ({
			name: `registration:${registration.client}`,
			ok: false,
			classification: registration.state === "unknown" ? "unknown" : "config_drift",
			detail: registration.config_path,
			remediation: registration.remediation
		});
		installationState = (paths) => paths.length === 0 ? "unknown" : paths.length === 1 ? "single" : "multiple";
		systemDoctorHost = (options = {}) => {
			const resources = new ArtifactResourceScope();
			const controller = new AbortController();
			const inspectionSignal = options.signal === undefined ? controller.signal : AbortSignal.any([options.signal, controller.signal]);
			const platform = options.platform ?? process.platform;
			const architecture = options.architecture ?? process.arch;
			const environment = options.environment ?? process.env;
			const nativeConfiguration = inspectNativeAnalysisConfiguration(snapshotEnvironment(environment, platform));
			const execute = options.execFileOutput ?? execFileOutput;
			const hostExecFileOutput = (command, args, input) => resources.run(async () => {
				try {
					const output = await execute(command, args, {
						...input,
						timeout: 1e4,
						maxBuffer: 64 * 1024,
						stopSignal: "SIGTERM",
						signal: inspectionSignal
					});
					if (inspectionSignal.aborted) throw new AnalysisCancelledError("doctor", {
						cause: inspectionSignal.reason,
						capturedOutput: {
							stdout: output.stdout,
							stderr: output.stderr,
							stdout_bytes: output.stdoutBytes,
							stderr_bytes: output.stderrBytes,
							exit_code: 0,
							signal: null,
							truncated: false
						}
					});
					return output;
				} catch (cause) {
					if (cause instanceof ExecFileOutputCancelledError) {
						const output = execFileOutputFailure(cause);
						throw new AnalysisCancelledError("doctor", {
							cause: cause.cause,
							...output === undefined ? {} : { capturedOutput: execFileFailureCapturedOutput(output) }
						});
					}
					throw cause;
				}
			});
			const homeDirectory = homeDirectoryFromEnvironment(environment, platform);
			const commandEnvironment = { env: environment };
			const resourceScope = {
				retain: (owner, resource) => resources.retain({
					kind: "lease",
					resource,
					lease: AnalysisCleanupLease.forCloseOwner(owner, resource)
				}),
				run: (operation) => resources.run(operation)
			};
			const resolveProviderRequestBudget = options.resolveProviderRequestBudget === undefined ? undefined : (provider, environment) => options.resolveProviderRequestBudget(provider, environment, resourceScope, inspectionSignal);
			return {
				...options.signal === undefined ? {} : { signal: options.signal },
				platform,
				architecture,
				runtime: javaScriptRuntime(process.versions),
				homeDirectory,
				...environment.HOPPER_LAUNCHER_PATH === undefined ? {} : { configuredHopperPath: environment.HOPPER_LAUNCHER_PATH },
				nativeConfiguration,
				...environment.REA_ILSPY_CMD_PATH === undefined ? {} : { configuredIlspyCmdPath: environment.REA_ILSPY_CMD_PATH },
				macosVersion: () => readMacosVersion(hostExecFileOutput, commandEnvironment),
				linuxDistribution: () => readLinuxDistribution(architecture),
				async validTarget(path) {
					return (await parseBinaryTarget(path, {
						cwd: process.cwd(),
						hostArchitecture: architecture
					})).ok;
				},
				async inspectTarget(path) {
					const result = await parseBinaryTarget(path, {
						cwd: process.cwd(),
						hostArchitecture: architecture
					});
					if (result.ok) return {
						name: "target",
						ok: true,
						classification: "healthy",
						detail: path
					};
					const error = result.error;
					const targetError = error instanceof BinaryTargetError ? error : undefined;
					return {
						name: "target",
						ok: false,
						classification: targetError?.constraint !== undefined ? "unsupported_target" : "config_drift",
						detail: path,
						details: {
							reason: targetError?.reason ?? error.message,
							...targetError?.constraint === undefined ? {} : { constraint: targetError.constraint }
						},
						remediation: analysisErrorRemediationAction(error)
					};
				},
				executable: (path) => executableAvailable(path, platform, hostExecFileOutput, commandEnvironment),
				linuxDemoRuntimeCheck: () => options.linuxDemoRuntimeCheck === undefined ? uncomposedLinuxDemoRuntimeCheck() : options.linuxDemoRuntimeCheck(resourceScope, inspectionSignal),
				inspectLinuxHopper: (path) => inspectLinuxHopperLauncher(path, environment),
				async brewHopperPath() {
					return probeHomebrew(async (command) => {
						let caskroom;
						try {
							caskroom = (await hostExecFileOutput(command, ["--caskroom"], commandEnvironment)).stdout.trim();
						} catch (cause) {
							if (cause instanceof AnalysisCancelledError) throw cause;
							void cause;
							return undefined;
						}
						const appdir = await installedCaskAppdir(caskroom, "hopper-disassembler", homeDirectory);
						return appdir === undefined ? undefined : appendCallerPath(appdir, "Hopper Disassembler.app/Contents/MacOS/hopper");
					});
				},
				manualHopperPaths: () => readMacHopperRenamedLauncherCandidates(homeDirectory),
				...options.providerInspections === undefined ? {} : { providerInspections: () => resources.run(() => options.providerInspections(resourceScope, inspectionSignal)) },
				...resolveProviderRequestBudget === undefined ? {} : { resolveProviderRequestBudget },
				async ilspyCmdVersion(path) {
					try {
						await access(path, constants.X_OK);
						return firstIlspyVersionLine((await hostExecFileOutput(path, ["--version"], commandEnvironment)).stdout);
					} catch (cause) {
						if (cause instanceof AnalysisCancelledError) throw cause;
						void cause;
						return undefined;
					}
				},
				async installationPaths() {
					try {
						const command = platform === "win32" ? "where" : "which";
						const arguments_ = platform === "win32" ? ["rea"] : ["-a", "rea"];
						return uniqueLines((await hostExecFileOutput(command, arguments_, commandEnvironment)).stdout);
					} catch (cause) {
						if (cause instanceof AnalysisCancelledError) throw cause;
						void cause;
						return [];
					}
				},
				installedSkillIdentity: (clientIds) => readInstalledSkillIdentity(homeDirectory, clientIds, environment, platform, resources),
				close: async () => {
					controller.abort(STARTUP_OWNER_CLOSED);
					try {
						await resources.close();
						return undefined;
					} catch (cause) {
						const observation = ArtifactReaderFailure.cleanupObservation(cause, "doctor resources");
						const failure = new ProviderCleanupError("rea", observation.resources, { reason: observation.reason }, {
							cause,
							operation: "doctor"
						});
						bindArtifactFileCleanup(cause, failure);
						throw failure;
					}
				},
				clientRegistrations: (selectedClientIds, providerSettings) => readClientRegistrationStatuses(homeDirectory, undefined, {
					platform,
					environment,
					resources,
					...selectedClientIds === undefined ? {} : { selectedClientIds },
					...providerSettings === undefined ? {} : { providerSettings: registrationSpelledSettings(providerSettings, environment) },
					...resolveProviderRequestBudget === undefined ? {} : { resolveProviderRequestBudget }
				})
			};
		};
		readMacosVersion = async (run, options) => {
			try {
				return (await run("/usr/bin/sw_vers", ["-productVersion"], options)).stdout.trim();
			} catch (cause) {
				if (cause instanceof AnalysisCancelledError) throw cause;
				void cause;
				return undefined;
			}
		};
		executableAvailable = async (path, platform, run, options) => {
			try {
				await access(path, constants.X_OK);
				if (!(await stat(path)).isFile()) return false;
				if (platform !== "linux") return true;
				const linked = await run("ldd", [path], options);
				return linuxSharedLibrariesAvailable(`${linked.stdout}\n${linked.stderr}`);
			} catch (cause) {
				if (cause instanceof AnalysisCancelledError) throw cause;
				void cause;
				return false;
			}
		};
		uncomposedLinuxDemoRuntimeCheck = () => Promise.resolve({
			name: "hopper-demo-runtime",
			ok: false,
			classification: "config_drift",
			detail: "Linux Hopper private-display diagnostics were not composed",
			remediation: "Run rea doctor through the production CLI adapter."
		});
		uniqueLines = (value) => [...new Set(value.split(/\r?\n/u).map((line) => line.trim()).filter((line) => line.length > 0))];
		firstIlspyVersionLine = (value) => uniqueLines(value).find((line) => line.startsWith("ilspycmd:"));
	})))();
}

//#endregion
export { Doctor_exports, explicitSetupRegistrationEnvironment, init_Doctor, init_SetupRegistrationEnvironment, init_macosVersion, macosMajorVersion, macosVersionMeetsMinimum, providerRegistrationEnvironment, runDoctor, systemDoctorHost };