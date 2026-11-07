import { withoutCredentialsIn } from "./aptRepositories.js";
/** Format string passed to `dpkg-query -W -f`. */
export const DPKG_STATUS_FORMAT = "${Package}\\t${Version}\\t${Architecture}\\t${db:Status-Status}\\n";
/** Package names that own a path, from `dpkg-query -S` output. */
export const parseDpkgOwners = (output, path) => {
    const owners = new Set();
    for (const line of output.split("\n")) {
        if (line.startsWith("diversion ") || !line.endsWith(`: ${path}`))
            continue;
        for (const name of line.slice(0, -(path.length + 2)).split(","))
            if (name.trim().length > 0)
                owners.add(name.trim());
    }
    return [...owners];
};
/** `/bin/x` and `/usr/bin/x` name the same file on merged-/usr systems, and dpkg may know either. */
export const ownershipCandidates = (paths) => [
    ...new Set(paths.flatMap((path) => path.startsWith("/usr/") ? [path, path.slice(4)] : [path, `/usr${path}`])),
];
/** Parse one `dpkg-query -W -f DPKG_STATUS_FORMAT` line. */
export const parseDpkgStatus = (output) => {
    const [name, version, architecture, status] = (output.split("\n")[0] ?? "").split("\t");
    if (name === undefined ||
        version === undefined ||
        architecture === undefined ||
        status === undefined ||
        name.length === 0)
        return undefined;
    return { name, version, architecture, status };
};
const POLICY_VERSION = /^ (?:\*\*\*| {3}) (?<version>\S+) -?\d+$/u;
const POLICY_SOURCE = /^ {8}-?\d+ (?<source>.+)$/u;
const DPKG_STATUS_SOURCE = "/var/lib/dpkg/status";
/** The source a policy line names, without any user name or password in its URI. */
const policySource = (pattern, line) => {
    const source = pattern.exec(line)?.groups?.source?.trim();
    return source === undefined ? undefined : withoutCredentialsIn(source);
};
/**
 * The package sources `apt-cache policy` lists for the installed version,
 * excluding the dpkg status database every installed version carries.
 */
export const parseAptPolicySources = (output) => {
    const sources = [];
    let installed = false;
    for (const line of output.split("\n")) {
        const version = POLICY_VERSION.exec(line);
        if (version !== null) {
            installed = line.startsWith(" ***");
            continue;
        }
        const source = policySource(POLICY_SOURCE, line);
        if (installed && source !== undefined && source !== DPKG_STATUS_SOURCE)
            sources.push(source);
    }
    return sources;
};
const POLICY_PACKAGE = /^(?<name>\S+):$/u;
/**
 * The sources of every version of each package `apt-cache policy <names…>`
 * lists, by the name it heads the package with; a name apt does not know is
 * left out, as apt prints nothing for it.
 */
export const parseAptPolicyPackageSources = (output) => {
    const packages = new Map();
    let current;
    for (const line of output.split("\n")) {
        const name = POLICY_PACKAGE.exec(line)?.groups?.name;
        if (name !== undefined) {
            current = [];
            packages.set(name, current);
            continue;
        }
        const source = policySource(POLICY_SOURCE, line);
        if (current !== undefined &&
            source !== undefined &&
            source !== DPKG_STATUS_SOURCE &&
            !current.includes(source))
            current.push(source);
    }
    return packages;
};
const GLOBAL_POLICY_SOURCE = /^ -?\d+ (?<source>.+)$/u;
const GLOBAL_POLICY_RELEASE = /^ +release (?<fields>.*)$/u;
/**
 * The `o=` origin of each package file `apt-cache policy` (with no package)
 * lists, keyed by the source text `parseAptPolicySources` returns; null when
 * the file's release line names no origin.
 */
export const parseAptPolicyOrigins = (output) => {
    const origins = new Map();
    let source;
    for (const line of output.split("\n")) {
        if (line.startsWith("Pinned packages:"))
            break;
        const listed = policySource(GLOBAL_POLICY_SOURCE, line);
        if (listed !== undefined) {
            source = listed;
            if (!origins.has(source))
                origins.set(source, null);
            continue;
        }
        const fields = GLOBAL_POLICY_RELEASE.exec(line)?.groups?.fields;
        if (fields === undefined || source === undefined)
            continue;
        const origin = fields
            .split(",")
            .find((field) => field.startsWith("o="))
            ?.slice(2);
        if (origin !== undefined &&
            origin.length > 0 &&
            origins.get(source) === null)
            origins.set(source, origin);
    }
    return origins;
};
/** Recognise snap, flatpak and AppImage installs from a resolved path. */
export const packageFromPath = (path) => {
    const snap = /^\/snap\/(?<name>[^/]+)\/(?<revision>[^/]+)\//u.exec(path);
    if (snap?.groups?.name !== undefined && snap.groups.name !== "bin")
        return {
            kind: "snap",
            name: snap.groups.name,
            revision: snap.groups.revision ?? null,
        };
    const snapBin = /^\/snap\/bin\/(?<name>[^/.]+)/u.exec(path);
    if (snapBin?.groups?.name !== undefined)
        return { kind: "snap", name: snapBin.groups.name, revision: null };
    const flatpak = /\/flatpak\/(?:app\/(?<app>[^/]+)\/|exports\/bin\/(?<bin>[^/]+)$)/u.exec(path);
    const flatpakName = flatpak?.groups?.app ?? flatpak?.groups?.bin;
    if (flatpakName !== undefined)
        return { kind: "flatpak", name: flatpakName };
    if (/\.appimage$/iu.test(path))
        return { kind: "appimage" };
    return undefined;
};
/** ELF images that carry the AppImage type 1 or type 2 magic at byte 8. */
export const isAppImageHeader = (header) => header.length >= 11 &&
    header[0] === 0x7f &&
    header[1] === 0x45 &&
    header[2] === 0x4c &&
    header[3] === 0x46 &&
    header[8] === 0x41 &&
    header[9] === 0x49 &&
    (header[10] === 0x01 || header[10] === 0x02);
