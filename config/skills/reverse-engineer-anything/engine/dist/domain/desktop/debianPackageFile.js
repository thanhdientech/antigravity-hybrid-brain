import { deb822Paragraphs } from "./aptRepositories.js";
/** The control fields REA asks `dpkg-deb --field` for, in its order. */
export const PACKAGE_FILE_FIELDS = [
    "Package",
    "Version",
    "Architecture",
    "Depends",
    "Pre-Depends",
];
/** Debian policy's package names: lowercase letters, digits, `+`, `-` and `.`, at least two long. */
const PACKAGE_NAME = /^[a-z0-9][a-z0-9+.-]+$/u;
/** The comma-separated entries of a relationship field, each on one line with its spacing collapsed. */
const relationEntries = (value) => (value ?? "")
    .split(",")
    .map((entry) => entry.replace(/\s+/gu, " ").trim())
    .filter((entry) => entry.length > 0);
/**
 * The fields `dpkg-deb --field FILE Package Version Architecture Depends
 * Pre-Depends` prints as `Name: value` lines, a field the file lacks left
 * out; undefined without Package, Version and Architecture.
 */
export const parseDpkgDebFields = (output) => {
    const fields = deb822Paragraphs(output)[0];
    const name = fields?.get("package") ?? "";
    const version = fields?.get("version") ?? "";
    const architecture = fields?.get("architecture") ?? "";
    if (name.length === 0 || version.length === 0 || architecture.length === 0)
        return undefined;
    return {
        package: name,
        version,
        architecture,
        depends: relationEntries(fields?.get("depends")),
        pre_depends: relationEntries(fields?.get("pre-depends")),
    };
};
/** Why a package file is not the installed version, or undefined when its name, version and architecture are dpkg's. */
export const packageFileMismatch = (fields, installed) => {
    const name = installed.name?.split(":")[0] ?? null;
    if (fields.package === name &&
        fields.version === installed.version &&
        fields.architecture === installed.architecture)
        return undefined;
    return `holds ${fields.package} ${fields.version} (${fields.architecture}), not the installed ${name ?? "package"} ${installed.version ?? "of unknown version"} (${installed.architecture ?? "unknown architecture"})`;
};
/**
 * The packages apt installs before a package file: the first alternative of
 * each Depends and Pre-Depends entry, without its architecture qualifier
 * (`:any`) or version constraint, once each. An entry whose first alternative
 * names no package is returned apart.
 */
export const dependencyPackages = (file) => {
    const names = new Set();
    const unread = [];
    for (const entry of [...file.depends, ...file.pre_depends]) {
        const [name = ""] = (entry.split("|")[0] ?? "").trim().split(/[\s(:[<]/u);
        if (PACKAGE_NAME.test(name))
            names.add(name);
        else
            unread.push(entry);
    }
    return { names: [...names], unread };
};
