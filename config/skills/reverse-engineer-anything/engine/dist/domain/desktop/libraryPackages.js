import { posix } from "node:path";
import { fromUbuntuNobleArchive } from "./appExportInstall.js";
import { isWithinAny } from "./desktopStateDiff.js";
const CACHE_LINE = /^\s+(?<soname>\S+) \((?<flags>[^)]*)\) => (?<path>\/.+)$/u;
/** The entries of `ldconfig -p` output. */
export const parseLinkerCache = (output) => output.split("\n").flatMap((line) => {
    const groups = CACHE_LINE.exec(line)?.groups;
    return groups?.soname === undefined || groups.path === undefined
        ? []
        : [
            {
                soname: groups.soname,
                flags: (groups.flags ?? "").split(",").map((flag) => flag.trim()),
                path: posix.normalize(groups.path),
            },
        ];
});
/** The flag `ldconfig -p` marks a library for a 64-bit ELF machine with. */
const CACHE_FLAGS = new Map([
    [62, "x86-64"],
    [183, "AArch64"],
]);
const MACHINE_FLAGS = new Set(CACHE_FLAGS.values());
const cachedPath = (cache, soname, machine) => {
    const matching = cache.filter((entry) => entry.soname === soname);
    const flag = CACHE_FLAGS.get(machine);
    return (flag === undefined
        ? (matching.find((entry) => !entry.flags.some((name) => MACHINE_FLAGS.has(name))) ?? matching[0])
        : matching.find((entry) => entry.flags.includes(flag)))?.path;
};
/** Absolute directories with `$ORIGIN` expanded to the owner's folder; relative and other dynamic-token paths are left out. */
const expanded = (owner, directories) => directories
    .map((path) => path.replace(/\$(?:ORIGIN|\{ORIGIN\})/gu, posix.dirname(owner)))
    .filter((path) => path.startsWith("/") && !path.includes("$"))
    .map((path) => posix.normalize(path));
/**
 * Where ld.so looks for an object's needed libraries before its cache: an
 * object without RUNPATH uses the RPATH of itself and of each object up its
 * loader chain to the executable, and then its RUNPATH.
 */
const searchDirectories = (object) => {
    const rpaths = [];
    if (object.dependencies.runpath === undefined)
        for (let at = object; at; at = at.loader)
            rpaths.push(...expanded(at.path, at.dependencies.rpath));
    return [
        ...new Set([
            ...rpaths,
            ...expanded(object.path, object.dependencies.runpath ?? []),
        ]),
    ];
};
/**
 * Walk DT_NEEDED breadth first from the executable: each soname is looked up
 * in the RPATH and RUNPATH directories ld.so searches for the needing object,
 * then the linker cache. Paths are normalized before any containment check.
 * Libraries in the executable's own folder are the application's and are
 * walked but not listed. At most `limit` sonames are resolved.
 */
export const libraryClosure = async (executable, cache, host, limit) => {
    const root = { ...executable, path: posix.normalize(executable.path) };
    const ownFolder = posix.dirname(root.path);
    const queue = [{ ...root, loader: undefined }];
    const seen = new Set();
    const closure = {
        libraries: [],
        missing: [],
        unreadable: [],
        truncated: false,
    };
    for (const object of queue) {
        const directories = searchDirectories(object);
        for (const soname of object.dependencies.needed) {
            if (seen.has(soname))
                continue;
            if (seen.size >= limit)
                return { ...closure, truncated: true };
            seen.add(soname);
            let path = soname.startsWith("/") ? posix.normalize(soname) : undefined;
            for (const directory of soname.includes("/") ? [] : directories) {
                const candidate = posix.join(directory, soname);
                if (path === undefined && (await host.isFile(candidate)))
                    path = candidate;
            }
            path ??= cachedPath(cache, soname, object.dependencies.machine);
            if (path === undefined) {
                closure.missing.push(soname);
                continue;
            }
            if (!isWithinAny(path, [ownFolder]))
                closure.libraries.push({ soname, path });
            const dependencies = await host.dependencies(path);
            if (dependencies.ok)
                queue.push({ path, dependencies: dependencies.value, loader: object });
            else
                closure.unreadable.push({ path, reason: dependencies.error });
        }
    }
    return closure;
};
/** Package names from `dpkg-query -S` owners: architecture qualifiers dropped and the application's own package left out. */
export const libraryPackageNames = (owners, ownPackage) => [
    ...new Set(owners
        .map((owner) => owner.split(":")[0] ?? owner)
        .filter((name) => name !== ownPackage.split(":")[0])),
].sort();
/**
 * Library packages the computer can install, and the rest: a package is
 * installable when some version of it comes from the Ubuntu 24.04 archive
 * or from one of the vendor sources the export declares.
 */
export const installableLibraryPackages = (names, available) => {
    const installable = [];
    const uninstallable = [];
    for (const name of names) {
        const sources = available.sources.get(name) ?? [];
        const offered = sources.some((source) => available.declared.has(source)) ||
            fromUbuntuNobleArchive(sources, available.origins === undefined
                ? undefined
                : sources.map((source) => available.origins?.get(source) ?? null));
        if (offered)
            installable.push(name);
        else
            uninstallable.push(name);
    }
    return { installable, uninstallable };
};
