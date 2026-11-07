import { projectAnalysisError } from "../domain/analysisErrorProjection.js";
import { AnalysisError } from "../domain/analysisErrorBase.js";
import { AnalysisCancelledError } from "../domain/analysisErrorCore.js";
import { ProviderCleanupError } from "../domain/providerCleanupError.js";
import { analysisErrorWithCleanupFailure } from "../domain/analysisErrorCleanup.js";
import { bindArtifactFileCleanup } from "../artifacts/ArtifactFileOperation.js";
import { ArtifactReaderFailure } from "../artifacts/ArtifactReader.js";
import { AnalysisCleanupLease } from "../artifacts/AnalysisCleanupLease.js";
import { STARTUP_OWNER_CLOSED } from "../process/SharedStartupAttempt.js";
import { constants } from "node:fs";
import { access, stat } from "node:fs/promises";
import { ArtifactResourceScope } from "../artifacts/ArtifactResourceScope.js";
import { inspectNativeAnalysisConfiguration, } from "../config/parseConfig.js";
import { homeDirectoryFromEnvironment } from "../config/homeDirectory.js";
import { snapshotEnvironment } from "../process/snapshotEnvironment.js";
import { appendCallerPath } from "../filesystem/callerPath.js";
import { analysisErrorRemediationAction } from "../domain/analysisErrorPresentation.js";
import { BinaryTargetError } from "../domain/configurationErrors.js";
import { parseBinaryTarget } from "./BinaryTargetResolver.js";
import { execFileOutput, ExecFileOutputCancelledError, execFileOutputFailure, execFileFailureCapturedOutput, } from "../process/ExecFileOutput.js";
import { jsonValueSchema } from "../domain/jsonValue.js";
import { javaScriptRuntime, } from "../domain/runtimeVersion.js";
import { installedCaskAppdir, probeHomebrew } from "./homebrew.js";
import { readMacHopperRenamedLauncherCandidates } from "./MacHopperPaths.js";
import { inspectLinuxHopperLauncher, linuxSharedLibrariesAvailable, readLinuxDistribution, } from "./LinuxHopper.js";
import { readInstalledSkillIdentity, } from "./SetupSkill.js";
import { DEFAULT_CATALOG_IDENTITY } from "../catalogIdentity.js";
import { PRODUCT_IDENTITY, SDK_IDENTITY } from "../identity.js";
import { readClientRegistrationStatuses, } from "./ClientRegistrationStatus.js";
import { registrationSpelledSettings } from "./SetupRegistrationEnvironment.js";
import { collectDoctorDiagnostics, doctorHealthy, } from "./DoctorDiagnostics.js";
import { normalizeDoctorScope, scopeDoctorChecks, } from "./DoctorScope.js";
/**
 * Check requirements and an optional target without mutating the host.
 * Every failed check includes remediation suitable for either the one-shot CLI
 * or an agent consuming the structured result.
 */
export const runDoctor = async (target, selectedHost, requestedScope) => selectedHost === undefined
    ? runDoctorOwned(target, systemDoctorHost(), requestedScope)
    : inspectDoctor(target, selectedHost, requestedScope);
/** Inspect with a host whose lifetime belongs to this operation. */
export const runDoctorOwned = async (target, host, requestedScope) => {
    let report;
    try {
        report = await inspectDoctor(target, host, requestedScope);
    }
    catch (cause) {
        const cleanup = await closeDoctorHost(host);
        if (cleanup !== undefined && cause instanceof AnalysisError) {
            const cleanupError = typeof cleanup === "string"
                ? new ProviderCleanupError("rea", [], { reason: cleanup }, { operation: "doctor" })
                : cleanup;
            throw analysisErrorWithCleanupFailure(cause, cleanupError, "doctor").bindCleanupDependencies([cause, cleanupError]);
        }
        if (cleanup !== undefined)
            throw new AggregateError([cause, typeof cleanup === "string" ? new Error(cleanup) : cleanup], "Doctor failed and its resource cleanup remains incomplete.", { cause });
        throw cause;
    }
    const cleanup = await closeDoctorHost(host);
    if (cleanup === undefined && report.healthy && host.signal?.aborted)
        throw new AnalysisCancelledError("doctor", {
            cause: host.signal.reason,
            diagnostics: { doctor_report: jsonValueSchema.parse(report) },
        });
    return cleanup === undefined
        ? report
        : doctorReportWithCleanup(report, cleanup);
};
const inspectDoctor = async (target, host, requestedScope) => {
    if (host.signal?.aborted)
        throw new AnalysisCancelledError("doctor", { cause: host.signal.reason });
    const scope = normalizeDoctorScope(requestedScope, target);
    const { checks: diagnosticChecks, hopperPath, providerInspections, } = await collectDoctorDiagnostics(target, host);
    const hopperAvailable = hopperPath !== undefined &&
        diagnosticChecks
            .filter(({ name }) => name.startsWith("hopper"))
            .every(({ ok }) => ok);
    const selections = providerSettingSelections(providerInspections, hopperAvailable && hopperPath === host.configuredHopperPath
        ? hopperPath
        : undefined);
    const identity = await collectDoctorIdentity(host, scope, selections);
    const checks = [
        ...diagnosticChecks,
        ...identity.checks,
        ...registrationAdvisoryChecks(identity.value.registrations),
        ...registrationEnvironmentChecks(identity.value.registrations, selections),
    ];
    const providers = {
        hopperAvailable,
        hopperConfigured: host.configuredHopperPath !== undefined,
        providerInspections,
    };
    const environmentHealthy = doctorHealthy(checks, providers);
    const scoped = scopeDoctorChecks({
        checks,
        registrations: identity.value.registrations,
        skillState: identity.value.skill.state,
        providers,
        scope,
    });
    return {
        healthy: scope.mode === "audit-wide" ? environmentHealthy : scoped.healthy,
        environment_healthy: environmentHealthy,
        scope,
        scope_checks: scope.mode === "audit-wide" ? checks : scoped.scopeChecks,
        informational_checks: scope.mode === "audit-wide" ? [] : scoped.informationalChecks,
        ...(hopperPath === undefined ? {} : { hopperPath }),
        ...(providerInspections === undefined ? {} : { providerInspections }),
        checks,
        identity: identity.value,
    };
};
const registrationAdvisoryChecks = (registrations) => registrations.flatMap(({ client, advisory }) => advisory === undefined
    ? []
    : [
        {
            name: `registration_timeout:${client}`,
            ok: true,
            classification: "healthy",
            detail: advisory,
        },
    ]);
const providerSettingSelections = (inspections, configuredHopperPath) => [
    ...(inspections ?? [])
        .filter(({ available }) => available)
        .map(({ id, registrationEnvironment }) => ({
        provider: id,
        settings: registrationEnvironment,
    })),
    // Startup probes the fixed and renamed locations on its own, so only an
    // explicit path is something this terminal selected for the server.
    ...(configuredHopperPath === undefined
        ? []
        : [
            {
                provider: "hopper",
                settings: { HOPPER_LAUNCHER_PATH: configuredHopperPath },
            },
        ]),
];
/**
 * A healthy provider check describes this terminal, not the server a client
 * starts. Report what the registration's file leaves out without gating health:
 * the client may still pass the setting on, which doctor cannot observe.
 */
const registrationEnvironmentChecks = (registrations, selections) => registrations.flatMap(({ client, provider_settings: settings }) => {
    if (settings === undefined)
        return [];
    const { unrecorded, differing, unresolved } = settings;
    const names = [...unrecorded, ...differing, ...unresolved];
    return [
        {
            name: `registration_environment:${client}`,
            ok: true,
            classification: "unknown",
            detail: [
                `Provider checks used this terminal's environment; what the server ${client} starts receives is unknown.`,
                ...(unrecorded.length === 0
                    ? []
                    : [`Its registration does not record ${unrecorded.join(", ")}.`]),
                ...(differing.length === 0
                    ? []
                    : [`It records other values for ${differing.join(", ")}.`]),
                ...(unresolved.length === 0
                    ? []
                    : [`REA could not resolve its ${unresolved.join(", ")}.`]),
            ].join(" "),
            details: {
                effective_environment: "unknown",
                providers: selections
                    .filter(({ settings: selected }) => names.some((name) => selected[name] !== undefined))
                    .map(({ provider }) => provider),
            },
            remediation: `Preview rea setup --client ${client} --skill=false --dry-run from this terminal, apply it to record these settings and restart the client, or read binary_session result.tool_availability in the client.`,
        },
    ];
});
const closeDoctorHost = async (host) => {
    try {
        return await host.close?.();
    }
    catch (cause) {
        if (cause instanceof AnalysisError)
            return cause;
        return `Doctor host cleanup failed: ${cause instanceof Error ? cause.message : String(cause)}`;
    }
};
const doctorReportWithCleanup = (report, cleanup) => {
    const check = {
        name: "doctor-resource-cleanup",
        ok: false,
        classification: "config_drift",
        detail: typeof cleanup === "string"
            ? cleanup
            : `${cleanup.message} ${cleanup.cleanupResources.join(", ")}`,
        ...(typeof cleanup === "string"
            ? {}
            : { details: { cleanup_failure: projectAnalysisError(cleanup) } }),
        remediation: "Resolve the reported cleanup failure, then rerun rea doctor.",
    };
    return {
        ...report,
        healthy: false,
        environment_healthy: false,
        checks: [...report.checks, check],
        scope_checks: [...report.scope_checks, check],
    };
};
const collectDoctorIdentity = async (host, scope, selections) => {
    const installationPaths = (await host.installationPaths?.()) ?? [];
    const registrations = (await host.clientRegistrations?.(scope.clients, Object.fromEntries(selections.flatMap(({ settings }) => Object.entries(settings))))) ?? [];
    const skillClientIds = scope.skill_clients ??
        (scope.clients.length > 0 ? scope.clients : undefined);
    const installedSkillIdentity = await host.installedSkillIdentity?.(skillClientIds);
    const skillAligned = skillIdentityAligned(installedSkillIdentity);
    return {
        checks: [
            ...(skillAligned ? [] : [skillIdentityCheck(installedSkillIdentity)]),
            ...registrations
                .filter((registration) => registration.state !== "aligned" && registration.state !== "manual")
                .map(registrationCheck),
        ],
        value: {
            cli_package_version: PRODUCT_IDENTITY.packageVersion,
            expected_skill_version: PRODUCT_IDENTITY.skillVersion,
            sdk: SDK_IDENTITY,
            catalog: {
                counts: DEFAULT_CATALOG_IDENTITY.counts,
                digests: DEFAULT_CATALOG_IDENTITY.digests,
            },
            live_server: {
                state: "unknown",
                // `binary_session` is advertised only when the saved scope includes
                // `session`, so the remediation also names the scope requirement: doctor
                // cannot see the saved selection here, and one sentence has to fit both
                // a complete registration and a scope that omits the session family.
                remediation: "Call binary_session in the active client to inspect the running server identity; a registration whose saved scope omits the session family cannot report it, so include session through rea setup --tool-families and restart first.",
            },
            installations: {
                paths: installationPaths,
                state: installationState(installationPaths),
            },
            skill: {
                installed_version: installedSkillIdentity?.version ?? null,
                installed_tool_count: installedSkillIdentity?.toolCount ?? null,
                state: skillIdentityState(installedSkillIdentity),
                ...(installedSkillIdentity?.issues === undefined
                    ? {}
                    : { issues: installedSkillIdentity.issues }),
                remediation: skillAligned
                    ? null
                    : skillIdentityRemediation(installedSkillIdentity),
            },
            registrations,
        },
    };
};
const skillIdentityAligned = (identity) => identity?.version === PRODUCT_IDENTITY.skillVersion &&
    identity.toolCount === DEFAULT_CATALOG_IDENTITY.counts.mcp_tools &&
    identity.canonical;
const skillIdentityState = (identity) => {
    if (identity?.issues?.some(({ kind }) => kind === "unreadable" || kind === "unresolved"))
        return "unknown";
    if (identity?.issues?.some(({ kind }) => kind === "symbolic_link" || kind === "not_directory"))
        return "unmanaged";
    if (identity?.issues?.some(({ kind }) => kind === "stale"))
        return "stale";
    if (identity?.issues?.some(({ kind }) => kind === "missing"))
        return "missing";
    return identity === undefined
        ? "missing"
        : skillIdentityAligned(identity)
            ? "aligned"
            : "stale";
};
const skillIdentityRemediation = (identity) => {
    const issues = identity?.issues;
    if (issues !== undefined && issues.length > 0)
        return issues
            .map(({ path, detail, kind, client }) => {
            const repair = kind === "stale" || kind === "missing"
                ? `Run rea setup --skill-client ${client ?? "shared"} --skill to repair this copy.`
                : "Repair the selected path/profile before rerunning setup, or use --skill=false to configure clients without installing the skill.";
            return `${detail} (${path}). ${repair}`;
        })
            .join(" ");
    return "Run rea setup to update the installed REA skill.";
};
const skillIdentityCheck = (identity) => {
    const issues = identity?.issues;
    return {
        name: "skill:identity",
        ok: false,
        // An unreadable or unresolved copy is unknown, not proven drift.
        classification: skillIdentityState(identity) === "unknown" ? "unknown" : "config_drift",
        detail: issues !== undefined && issues.length > 0
            ? `Selected skill identity is ${skillIdentityState(identity)}: ${issues.map(({ path }) => path).join(", ")}.`
            : identity === undefined
                ? "Installed REA skill identity is missing."
                : "Installed REA skill identity is stale.",
        remediation: skillIdentityRemediation(identity),
    };
};
const registrationCheck = (registration) => ({
    name: `registration:${registration.client}`,
    ok: false,
    classification: registration.state === "unknown" ? "unknown" : "config_drift",
    detail: registration.config_path,
    remediation: registration.remediation,
});
const installationState = (paths) => paths.length === 0 ? "unknown" : paths.length === 1 ? "single" : "multiple";
/** Create diagnostics backed by the current process and host commands. */
export const systemDoctorHost = (options = {}) => {
    const resources = new ArtifactResourceScope();
    const controller = new AbortController();
    const inspectionSignal = options.signal === undefined
        ? controller.signal
        : AbortSignal.any([options.signal, controller.signal]);
    const platform = options.platform ?? process.platform;
    const architecture = options.architecture ?? process.arch;
    const environment = options.environment ?? process.env;
    const nativeConfiguration = inspectNativeAnalysisConfiguration(snapshotEnvironment(environment, platform));
    const execute = options.execFileOutput ?? execFileOutput;
    // These commands report short host facts, not analysis output. Reuse the
    // ILSpy probe's ten-second allowance and bound each captured stream to 64 KiB.
    // Baseline diagnostics must work without provider ownership prerequisites.
    const hostExecFileOutput = (command, args, input) => resources.run(async () => {
        try {
            const output = await execute(command, args, {
                ...input,
                timeout: 10_000,
                maxBuffer: 64 * 1024,
                stopSignal: "SIGTERM",
                signal: inspectionSignal,
            });
            if (inspectionSignal.aborted)
                throw new AnalysisCancelledError("doctor", {
                    cause: inspectionSignal.reason,
                    capturedOutput: {
                        stdout: output.stdout,
                        stderr: output.stderr,
                        stdout_bytes: output.stdoutBytes,
                        stderr_bytes: output.stderrBytes,
                        exit_code: 0,
                        signal: null,
                        truncated: false,
                    },
                });
            return output;
        }
        catch (cause) {
            if (cause instanceof ExecFileOutputCancelledError) {
                const output = execFileOutputFailure(cause);
                throw new AnalysisCancelledError("doctor", {
                    cause: cause.cause,
                    ...(output === undefined
                        ? {}
                        : { capturedOutput: execFileFailureCapturedOutput(output) }),
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
            lease: AnalysisCleanupLease.forCloseOwner(owner, resource),
        }),
        run: (operation) => resources.run(operation),
    };
    const resolveProviderRequestBudget = options.resolveProviderRequestBudget === undefined
        ? undefined
        : (provider, environment) => options.resolveProviderRequestBudget(provider, environment, resourceScope, inspectionSignal);
    return {
        ...(options.signal === undefined ? {} : { signal: options.signal }),
        platform,
        architecture,
        runtime: javaScriptRuntime(process.versions),
        homeDirectory,
        ...(environment.HOPPER_LAUNCHER_PATH === undefined
            ? {}
            : { configuredHopperPath: environment.HOPPER_LAUNCHER_PATH }),
        nativeConfiguration,
        ...(environment.REA_ILSPY_CMD_PATH === undefined
            ? {}
            : { configuredIlspyCmdPath: environment.REA_ILSPY_CMD_PATH }),
        macosVersion: () => readMacosVersion(hostExecFileOutput, commandEnvironment),
        linuxDistribution: () => readLinuxDistribution(architecture),
        async validTarget(path) {
            return (await parseBinaryTarget(path, {
                cwd: process.cwd(),
                hostArchitecture: architecture,
            })).ok;
        },
        async inspectTarget(path) {
            const result = await parseBinaryTarget(path, {
                cwd: process.cwd(),
                hostArchitecture: architecture,
            });
            if (result.ok)
                return {
                    name: "target",
                    ok: true,
                    classification: "healthy",
                    detail: path,
                };
            const error = result.error;
            const targetError = error instanceof BinaryTargetError ? error : undefined;
            return {
                name: "target",
                ok: false,
                classification: targetError?.constraint !== undefined
                    ? "unsupported_target"
                    : "config_drift",
                detail: path,
                details: {
                    reason: targetError?.reason ?? error.message,
                    ...(targetError?.constraint === undefined
                        ? {}
                        : { constraint: targetError.constraint }),
                },
                remediation: analysisErrorRemediationAction(error),
            };
        },
        executable: (path) => executableAvailable(path, platform, hostExecFileOutput, commandEnvironment),
        linuxDemoRuntimeCheck: () => options.linuxDemoRuntimeCheck === undefined
            ? uncomposedLinuxDemoRuntimeCheck()
            : options.linuxDemoRuntimeCheck(resourceScope, inspectionSignal),
        inspectLinuxHopper: (path) => inspectLinuxHopperLauncher(path, environment),
        async brewHopperPath() {
            return probeHomebrew(async (command) => {
                let caskroom;
                try {
                    // Without a cask argument, `--caskroom` does not load Homebrew's
                    // cask API, so doctor writes no Homebrew cache files.
                    caskroom = (await hostExecFileOutput(command, ["--caskroom"], commandEnvironment)).stdout.trim();
                }
                catch (cause) {
                    if (cause instanceof AnalysisCancelledError)
                        throw cause;
                    // best-effort cleanup: optional Homebrew probing; absence means uninstalled.
                    void cause;
                    return undefined;
                }
                const appdir = await installedCaskAppdir(caskroom, "hopper-disassembler", homeDirectory);
                return appdir === undefined
                    ? undefined
                    : appendCallerPath(appdir, "Hopper Disassembler.app/Contents/MacOS/hopper");
            });
        },
        manualHopperPaths: () => readMacHopperRenamedLauncherCandidates(homeDirectory),
        ...(options.providerInspections === undefined
            ? {}
            : {
                providerInspections: () => resources.run(() => options.providerInspections(resourceScope, inspectionSignal)),
            }),
        ...(resolveProviderRequestBudget === undefined
            ? {}
            : { resolveProviderRequestBudget }),
        async ilspyCmdVersion(path) {
            try {
                await access(path, constants.X_OK);
                return firstIlspyVersionLine((await hostExecFileOutput(path, ["--version"], commandEnvironment))
                    .stdout);
            }
            catch (cause) {
                if (cause instanceof AnalysisCancelledError)
                    throw cause;
                // best-effort cleanup: optional version probing; failure means unavailable.
                void cause;
                return undefined;
            }
        },
        async installationPaths() {
            try {
                const command = platform === "win32" ? "where" : "which";
                const arguments_ = platform === "win32" ? ["rea"] : ["-a", "rea"];
                return uniqueLines((await hostExecFileOutput(command, arguments_, commandEnvironment))
                    .stdout);
            }
            catch (cause) {
                if (cause instanceof AnalysisCancelledError)
                    throw cause;
                // best-effort cleanup: optional path probing; failure means none found.
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
            }
            catch (cause) {
                const observation = ArtifactReaderFailure.cleanupObservation(cause, "doctor resources");
                const failure = new ProviderCleanupError("rea", observation.resources, { reason: observation.reason }, { cause, operation: "doctor" });
                bindArtifactFileCleanup(cause, failure);
                throw failure;
            }
        },
        clientRegistrations: (selectedClientIds, providerSettings) => readClientRegistrationStatuses(homeDirectory, undefined, {
            platform,
            environment,
            resources,
            ...(selectedClientIds === undefined ? {} : { selectedClientIds }),
            ...(providerSettings === undefined
                ? {}
                : {
                    providerSettings: registrationSpelledSettings(providerSettings, environment),
                }),
            ...(resolveProviderRequestBudget === undefined
                ? {}
                : {
                    resolveProviderRequestBudget,
                }),
        }),
    };
};
const readMacosVersion = async (run, options) => {
    try {
        return (await run("/usr/bin/sw_vers", ["-productVersion"], options)).stdout.trim();
    }
    catch (cause) {
        if (cause instanceof AnalysisCancelledError)
            throw cause;
        // best-effort cleanup: optional OS version probing; failure means unknown.
        void cause;
        return undefined;
    }
};
const executableAvailable = async (path, platform, run, options) => {
    try {
        await access(path, constants.X_OK);
        if (!(await stat(path)).isFile())
            return false;
        if (platform !== "linux")
            return true;
        const linked = await run("ldd", [path], options);
        return linuxSharedLibrariesAvailable(`${linked.stdout}\n${linked.stderr}`);
    }
    catch (cause) {
        if (cause instanceof AnalysisCancelledError)
            throw cause;
        // best-effort cleanup: optional executable probing; failure means unavailable.
        void cause;
        return false;
    }
};
const uncomposedLinuxDemoRuntimeCheck = () => Promise.resolve({
    name: "hopper-demo-runtime",
    ok: false,
    classification: "config_drift",
    detail: "Linux Hopper private-display diagnostics were not composed",
    remediation: "Run rea doctor through the production CLI adapter.",
});
const uniqueLines = (value) => [
    ...new Set(value
        .split(/\r?\n/u)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)),
];
const firstIlspyVersionLine = (value) => uniqueLines(value).find((line) => line.startsWith("ilspycmd:"));
