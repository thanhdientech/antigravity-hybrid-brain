import { execFile } from "node:child_process";
import { access, mkdir, mkdtemp, readdir, readFile, rename, rm, writeFile, } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, posix } from "node:path";
import { promisify } from "node:util";
import { z } from "zod";
import { appendCallerPath } from "../filesystem/callerPath.js";
import { HOPPER_PUBLISHER } from "../domain/hopperPublisher.js";
import { macDeveloperIdRequirement } from "../process/MacCodeSignature.js";
import { macHopperUserApplicationPath } from "./MacHopperPaths.js";
import { downloadHopperPackage, HOPPER_METADATA_TIMEOUT_MS, } from "./HopperDownload.js";
import { HOPPER_RELEASES_URL, HOPPER_DOWNLOAD_PREFIX, parseHopperReleaseJson, parseMacHopperReleases, hopperArchiveIntegrityMatches, macHopperReleaseMinimumSystemVersion, } from "./HopperReleaseFeed.js";
import { decodeInfoPlistValue } from "./AppBundleExecutable.js";
import { macosMajorVersion, macosVersionMeetsMinimum, } from "../domain/macosVersion.js";
const execFileAsync = promisify(execFile);
const HOPPER_PUBLISHER_REQUIREMENT = macDeveloperIdRequirement(HOPPER_PUBLISHER.bundleIdentifier, HOPPER_PUBLISHER.teamIdentifier);
/** Stable effects and checks disclosed before macOS Hopper setup. */
export const macHopperInstallDisclosure = {
    detail: "Download the official Hopper package, verify it, and install it. Before the download, and again from the signed app before copying, setup compares the release's minimum macOS version with this Mac's and stops if this Mac is older. Hopper may show its demo or license prompt when first opened.",
    networkOrigins: [HOPPER_RELEASES_URL, HOPPER_DOWNLOAD_PREFIX],
    commands: [
        "hdiutil attach -readonly -nobrowse -mountpoint <private-mount> <verified-hopper.dmg>",
        "codesign --verify --deep --strict <mounted-hopper.app>",
        `codesign --verify --strict '-R${HOPPER_PUBLISHER_REQUIREMENT}' <mounted-hopper.app>`,
        "ditto <mounted-hopper.app> <user-Applications-stage>",
        "open <installed-hopper.app>",
    ],
};
/**
 * Download, verify, and install Hopper into the current user's Applications
 * directory. The selected release's own macOS minimum gates installation: the
 * feed's `deployment_target` before the package is downloaded, and the signed
 * app's `LSMinimumSystemVersion` before it is copied.
 */
export const installMacHopper = async (options, host) => {
    const hostVersion = await host.macosVersion();
    // Without a comparable host version no declared minimum can be checked.
    if (hostVersion === undefined || macosMajorVersion(hostVersion) === undefined)
        return { status: "failed", reason: "unsupported_host" };
    let temporary;
    let mounted = false;
    let bundleCleanupFailure;
    let installStage = "release_metadata";
    let result;
    try {
        result = await (async () => {
            const metadata = await host.download(HOPPER_RELEASES_URL, {
                timeoutMs: HOPPER_METADATA_TIMEOUT_MS,
            });
            if (!metadata.ok)
                return {
                    status: "failed",
                    reason: "release_metadata",
                    download: { request: "release_feed", ...metadata.error },
                };
            const decoded = parseHopperReleaseJson(metadata.value);
            if (!decoded.ok)
                throw decoded.cause;
            const parsed = parseMacHopperReleases(decoded.value);
            if (!parsed.ok)
                return { status: "failed", reason: "release_metadata" };
            const release = parsed.value;
            const releaseMinimum = macHopperReleaseMinimumSystemVersion(release);
            // An unrecognized feed value defers to the signed app checked below.
            if (releaseMinimum !== undefined &&
                macosVersionMeetsMinimum(hostVersion, releaseMinimum) === false)
                return {
                    status: "failed",
                    reason: "incompatible_host_version",
                    diagnostic: macHopperHostVersionDetail({
                        source: "release_feed",
                        packageUrl: release.filename,
                        minimumVersion: releaseMinimum,
                        hostVersion,
                    }),
                };
            installStage = "download";
            const archive = await host.download(release.filename);
            if (!archive.ok)
                return {
                    status: "failed",
                    reason: "download",
                    download: { request: "package", ...archive.error },
                };
            installStage = "integrity";
            if (!hopperArchiveIntegrityMatches(archive.value, release))
                return { status: "failed", reason: "integrity" };
            installStage = "destination_inspection";
            const destination = host.destination();
            const destinationExists = await host.destinationExists(destination);
            if (destinationExists && options.replaceExisting !== true)
                return { status: "failed", reason: "destination_exists" };
            installStage = "mount";
            temporary = await host.createTemporaryDirectory();
            const packagePath = posix.join(temporary, "hopper.dmg");
            const mountPath = posix.join(temporary, "mounted");
            await host.createMountDirectory(mountPath);
            await host.writePackage(packagePath, archive.value);
            if (!(await host.mount(packagePath, mountPath)))
                return { status: "failed", reason: "mount" };
            mounted = true;
            installStage = "bundle";
            const source = await host.appBundle(mountPath);
            if (source === undefined)
                return { status: "failed", reason: "bundle" };
            const verification = await host.validBundle(source);
            if (verification === "invalid_signature")
                return { status: "failed", reason: "bundle" };
            if (verification === "unverified_publisher")
                return { status: "failed", reason: "publisher_verification_failed" };
            // An app that declares no minimum is accepted, as macOS does.
            const appMinimum = await host.minimumSystemVersion(source);
            if (appMinimum !== undefined) {
                const compatible = macosVersionMeetsMinimum(hostVersion, appMinimum);
                if (compatible === false)
                    return {
                        status: "failed",
                        reason: "incompatible_host_version",
                        diagnostic: macHopperHostVersionDetail({
                            source: "signed_app",
                            minimumVersion: appMinimum,
                            hostVersion,
                        }),
                    };
                if (compatible === undefined)
                    return {
                        status: "failed",
                        reason: "bundle",
                        diagnostic: macHopperIncomparableMinimumDetail(appMinimum, hostVersion),
                    };
            }
            installStage = "copy";
            const installation = await host.installBundle(source, destination, destinationExists);
            if (installation.status === "failed")
                return {
                    status: "failed",
                    reason: installation.reason,
                    diagnostic: installation.diagnostic,
                    ...(installation.cleanupFailure === undefined
                        ? {}
                        : { cleanupFailure: installation.cleanupFailure }),
                };
            bundleCleanupFailure = installation.cleanupFailure;
            const launcherPath = appendCallerPath(destination, "Contents/MacOS/hopper", "darwin");
            let openFailure;
            try {
                await host.openApplication(destination);
            }
            catch (cause) {
                openFailure = failureMessage(cause);
            }
            return {
                status: "installed",
                launcherPath,
                ...(openFailure === undefined ? {} : { openFailure }),
            };
        })();
    }
    catch (cause) {
        result = {
            status: "failed",
            reason: installStage,
            diagnostic: failureMessage(cause),
        };
    }
    let cleanupFailure;
    if (temporary !== undefined) {
        const temporaryPath = temporary;
        const mountPath = posix.join(temporary, "mounted");
        const cleanup = async () => {
            if (mounted) {
                await host.unmount(mountPath);
                mounted = false;
            }
            await host.cleanup(temporaryPath);
        };
        try {
            await cleanup();
        }
        catch (cause) {
            cleanupFailure = `Hopper DMG cleanup failed: ${failureMessage(cause)}`;
            host.retainCleanup?.(cleanup, [temporaryPath]);
        }
    }
    const retainedCleanupFailure = [
        bundleCleanupFailure,
        cleanupFailure,
        result.cleanupFailure,
    ]
        .filter((failure) => failure !== undefined)
        .join(" ");
    return retainedCleanupFailure === ""
        ? result
        : { ...result, cleanupFailure: retainedCleanupFailure };
};
/** Replace a bundle through a fresh same-volume root owned by this transaction. */
export const installMacHopperBundle = async (source, destination, replaceExisting, operations, retainCleanup) => {
    const stagingRoot = await operations.createStagingRoot(posix.dirname(destination));
    const stagedBundle = appendCallerPath(stagingRoot, "new.app", "darwin");
    const previousBundle = appendCallerPath(stagingRoot, "previous.app", "darwin");
    let originalBackedUp = false;
    let newCommitted = false;
    let failureReason = "copy";
    try {
        await operations.copyBundle(source, stagedBundle);
        failureReason = "launcher_missing";
        await operations.requireLauncher(appendCallerPath(stagedBundle, "Contents/MacOS/hopper", "darwin"));
        failureReason = "copy";
        if (replaceExisting) {
            await operations.rename(destination, previousBundle);
            originalBackedUp = true;
        }
        await operations.rename(stagedBundle, destination);
        newCommitted = true;
    }
    catch (cause) {
        const diagnostics = [failureMessage(cause)];
        if (originalBackedUp && !newCommitted) {
            try {
                if (await operations.pathExists(destination))
                    throw new Error("destination now contains another installation; preserving the previous bundle in its owned staging root");
                await operations.rename(previousBundle, destination);
                originalBackedUp = false;
            }
            catch (rollbackCause) {
                diagnostics.push(`rollback failed: ${failureMessage(rollbackCause)}`);
                const cleanupFailure = `The previous Hopper bundle remains owned at ${previousBundle}; cleanup will retry restoration only if the destination is empty.`;
                retainCleanup(async () => {
                    if (originalBackedUp) {
                        if (await operations.pathExists(destination))
                            throw new Error(`Hopper destination is occupied; preserving owned backup ${previousBundle}`);
                        await operations.rename(previousBundle, destination);
                        originalBackedUp = false;
                    }
                    await operations.removeStagingRoot(stagingRoot);
                }, [stagingRoot]);
                return {
                    status: "failed",
                    reason: failureReason,
                    diagnostic: diagnostics.join("; "),
                    cleanupFailure,
                };
            }
        }
        try {
            await operations.removeStagingRoot(stagingRoot);
        }
        catch (cleanupCause) {
            const cleanupFailure = `Hopper staging root cleanup failed: ${failureMessage(cleanupCause)}`;
            retainCleanup(() => operations.removeStagingRoot(stagingRoot), [stagingRoot]);
            diagnostics.push(cleanupFailure);
            return {
                status: "failed",
                reason: failureReason,
                diagnostic: diagnostics.join("; "),
                cleanupFailure,
            };
        }
        return {
            status: "failed",
            reason: failureReason,
            diagnostic: diagnostics.join("; "),
        };
    }
    try {
        await operations.removeStagingRoot(stagingRoot);
        return { status: "installed" };
    }
    catch (cause) {
        const cleanupFailure = `Hopper staging root cleanup failed after installation committed: ${failureMessage(cause)}`;
        retainCleanup(() => operations.removeStagingRoot(stagingRoot), [stagingRoot]);
        return { status: "installed", cleanupFailure };
    }
};
/** Compose installer paths and subprocesses from one selected caller context. */
export const systemMacHopperInstallHost = (homeDirectory, environment, macosVersion) => {
    const pendingCleanup = new Map();
    return {
        download: downloadHopperPackage,
        createTemporaryDirectory: () => mkdtemp(join(tmpdir(), "rea-hopper-mac-")),
        createMountDirectory: (path) => mkdir(path),
        writePackage: (path, bytes) => writeFile(path, bytes, { mode: 0o600 }),
        async mount(packagePath, mountPath) {
            await execFileAsync("hdiutil", [
                "attach",
                "-readonly",
                "-nobrowse",
                "-mountpoint",
                mountPath,
                packagePath,
            ], { env: environment });
            return true;
        },
        async unmount(mountPath) {
            await execFileAsync("hdiutil", ["detach", mountPath, "-force"], {
                env: environment,
            });
        },
        async appBundle(mountPath) {
            const entries = await readdir(mountPath, { withFileTypes: true });
            const app = entries.find((entry) => entry.isDirectory() && /^Hopper.*\.app$/iu.test(entry.name));
            return app === undefined ? undefined : posix.join(mountPath, app.name);
        },
        async validBundle(appPath) {
            if (!(await commandSucceeds("codesign", ["--verify", "--deep", "--strict", appPath], environment)))
                return "invalid_signature";
            if (!(await commandSucceeds("codesign", [
                "--verify",
                "--strict",
                `-R${HOPPER_PUBLISHER_REQUIREMENT}`,
                appPath,
            ], environment)))
                return "unverified_publisher";
            return "verified";
        },
        macosVersion,
        async minimumSystemVersion(appPath) {
            const plist = posix.join(appPath, "Contents", "Info.plist");
            const declared = minimumSystemVersionSchema.safeParse(decodeInfoPlistValue(await readFile(plist)));
            if (!declared.success)
                throw new TypeError(`${plist} does not declare LSMinimumSystemVersion as text`);
            return declared.data.LSMinimumSystemVersion;
        },
        async destinationExists(path) {
            try {
                await access(path);
                return true;
            }
            catch (cause) {
                if (isMissingPath(cause))
                    return false;
                throw cause;
            }
        },
        installBundle: (source, destination, replaceExisting) => installMacHopperBundle(source, destination, replaceExisting, {
            async createStagingRoot(parent) {
                await mkdir(parent, { recursive: true });
                return mkdtemp(appendCallerPath(parent, ".rea-hopper-stage-", "darwin"));
            },
            copyBundle: async (bundle, staged) => {
                await execFileAsync("ditto", [bundle, staged], {
                    env: environment,
                });
            },
            requireLauncher: (path) => access(path).then(() => undefined),
            pathExists,
            rename,
            removeStagingRoot: (path) => rm(path, { recursive: true }),
        }, (cleanup, resources) => pendingCleanup.set(cleanup, resources)),
        async openApplication(path) {
            await execFileAsync("open", [path], { env: environment });
        },
        cleanup: (path) => rm(path, { recursive: true, force: true }),
        retainCleanup: (cleanup, resources) => pendingCleanup.set(cleanup, resources),
        async close() {
            const failures = [];
            for (const cleanup of pendingCleanup.keys()) {
                try {
                    await cleanup();
                    pendingCleanup.delete(cleanup);
                }
                catch (cause) {
                    failures.push(failureMessage(cause));
                }
            }
            return failures.length === 0
                ? undefined
                : {
                    reason: `Hopper installer cleanup remains incomplete: ${failures.join("; ")}`,
                    resources: [...new Set([...pendingCleanup.values()].flat())],
                };
        },
        destination: () => macHopperUserApplicationPath(homeDirectory),
    };
};
/** Installer detail naming the declared minimum this Mac's version does not meet. */
export const macHopperHostVersionDetail = (refusal) => refusal.source === "release_feed"
    ? `The current Hopper release (${refusal.packageUrl}) declares deployment_target ${refusal.minimumVersion}; this Mac runs macOS ${refusal.hostVersion}. The package was not downloaded.`
    : `The signed Hopper application declares LSMinimumSystemVersion ${refusal.minimumVersion}; this Mac runs macOS ${refusal.hostVersion}. Nothing was copied.`;
/** Installer detail for a signed-app minimum REA cannot compare with this Mac's version. */
export const macHopperIncomparableMinimumDetail = (declared, hostVersion) => `The signed Hopper application declares LSMinimumSystemVersion ${JSON.stringify(declared)}, which REA cannot compare with macOS ${hostVersion}. Nothing was copied.`;
const minimumSystemVersionSchema = z.looseObject({
    LSMinimumSystemVersion: z.string().optional(),
});
const commandSucceeds = async (command, args, environment) => {
    try {
        await execFileAsync(command, args, { env: environment });
        return true;
    }
    catch (cause) {
        if (typeof cause === "object" &&
            cause !== null &&
            "code" in cause &&
            typeof cause.code === "number")
            return false;
        throw cause;
    }
};
const failureMessage = (cause) => cause instanceof Error
    ? [
        cause.message,
        "stderr" in cause && typeof cause.stderr === "string"
            ? cause.stderr.trim()
            : "",
    ]
        .filter((value) => value !== "")
        .join(": ")
    : String(cause);
const isMissingPath = (cause) => typeof cause === "object" &&
    cause !== null &&
    "code" in cause &&
    cause.code === "ENOENT";
const pathExists = async (path) => {
    try {
        await access(path);
        return true;
    }
    catch (cause) {
        if (isMissingPath(cause))
            return false;
        throw cause;
    }
};
