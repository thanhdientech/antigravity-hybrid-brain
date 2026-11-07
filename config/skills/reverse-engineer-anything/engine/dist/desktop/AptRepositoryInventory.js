import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { aptListFileName, entryForTarget, isUbuntuProRepository, parseAptIndexTargets, parseDeb822Sources, parseOneLineSources, } from "../domain/desktop/aptRepositories.js";
import { withGpgvKeyCheck } from "./GpgvKeyCheck.js";
import { isHostFile, readHostFile } from "./HostFileRead.js";
import { succeeded } from "./HostQuery.js";
export const APT_LOCATIONS = {
    trustedParts: "/etc/apt/trusted.gpg.d",
    trusted: "/etc/apt/trusted.gpg",
    lists: "/var/lib/apt/lists",
};
const FILE_MAX_BYTES = 1024 * 1024;
const MAX_CANDIDATE_KEYS = 64;
const UBUNTU_PRO = "not checked: it is an Ubuntu Pro (ESM) repository, which apt reaches only with the host's Ubuntu Pro credentials, and the computer has none";
/** apt's Packages indexes by the text `apt-cache policy` prints for each; undefined when apt-get could not list them. */
const indexTargets = async (runQuery, signal) => {
    const output = succeeded(await runQuery("apt-get", ["indextargets", "Created-By: Packages"], signal));
    if (output === undefined)
        return undefined;
    const targets = new Map();
    for (const target of parseAptIndexTargets(output))
        if (!targets.has(target.description))
            targets.set(target.description, target);
    return targets;
};
/** The stanzas of each sources file apt names, read once; files that could not be read are kept for the limitations. */
const sourcesFiles = (signal) => {
    const parsed = new Map();
    const unreadable = [];
    const read = async (file) => {
        const cached = parsed.get(file);
        if (cached !== undefined)
            return cached;
        const bytes = await readHostFile(file, FILE_MAX_BYTES, signal);
        if (bytes === "unreadable")
            unreadable.push(file);
        const stanzas = typeof bytes === "string"
            ? []
            : (file.endsWith(".sources")
                ? parseDeb822Sources
                : parseOneLineSources)(bytes.toString("utf8"), file);
        parsed.set(file, stanzas);
        return stanzas;
    };
    return { read, unreadable };
};
const fileNames = async (directory) => (await readdir(directory).catch(() => [])).sort();
/** The entry's Signed-By keyrings, or every key apt trusts for all repositories. */
const candidateKeys = async (entry, apt) => {
    const signedBy = entry.signedBy.filter((value) => value.startsWith("/"));
    if (signedBy.length > 0)
        return signedBy;
    return [
        ...(await fileNames(apt.trustedParts))
            .filter((name) => name.endsWith(".gpg") || name.endsWith(".asc"))
            .map((name) => join(apt.trustedParts, name)),
        apt.trusted,
    ];
};
/** The index's signed release beside it in apt's lists folder: InRelease, or Release.gpg with the Release it signs. */
const signedRelease = async (target) => {
    const prefix = join(dirname(target.filename), aptListFileName(target.baseUri));
    if (await isHostFile(`${prefix}InRelease`))
        return [`${prefix}InRelease`];
    return (await isHostFile(`${prefix}Release.gpg`)) &&
        (await isHostFile(`${prefix}Release`))
        ? [`${prefix}Release.gpg`, `${prefix}Release`]
        : undefined;
};
/** Why a source's key could not be checked, or the release and candidate keys gpgv checks. */
const keyCheck = async (target, entry, context) => {
    if (target === undefined)
        return {
            reason: context.targets === undefined
                ? "apt-get indextargets did not list apt's indexes"
                : "apt-get indextargets lists no index with this source",
        };
    if (entry === undefined)
        return {
            reason: `no sources entry at ${target.sourcesFile}:${String(target.position)} configures it`,
        };
    if (entry.inlineKey)
        return {
            reason: "its Signed-By field holds the key itself, which REA does not read",
        };
    const release = await signedRelease(target);
    if (release === undefined)
        return {
            reason: `apt holds no signed release file for it in ${dirname(target.filename)}`,
        };
    const candidates = await candidateKeys(entry, context.apt);
    return candidates.length > MAX_CANDIDATE_KEYS
        ? { reason: `more than ${String(MAX_CANDIDATE_KEYS)} candidate keys` }
        : { release, candidates };
};
/** A repository's facts from apt's index target and the sources entry it names, before its key is checked. */
const repositoryBase = (source, target, entry) => entry === undefined
    ? {
        source,
        sources_file: null,
        uri: null,
        uri_credentials_removed: false,
        suite: null,
        components: [],
        architectures: [],
        release: target?.suite ?? target?.codename ?? null,
    }
    : {
        source,
        sources_file: entry.file,
        uri: entry.uri,
        uri_credentials_removed: entry.credentials,
        suite: entry.suite,
        components: [...entry.components],
        architectures: [...entry.architectures],
        release: target?.suite ?? target?.codename ?? null,
    };
/** One vendor source with the entry apt read it from and the key gpgv verified its release with. */
const repositoryFacts = async (vendor, context) => {
    const target = context.targets?.get(vendor.source);
    const entry = target === undefined
        ? undefined
        : entryForTarget(target, await context.sources(target.sourcesFile));
    const base = repositoryBase(vendor.source, target, entry);
    const unverified = (reason) => ({
        repository: { ...base, signing_key: null, signing_key_reason: reason },
        key: undefined,
    });
    const origin = vendor.origin ?? target?.origin ?? null;
    if (isUbuntuProRepository(origin, base.uri ?? target?.repoUri ?? null))
        return unverified(UBUNTU_PRO);
    const check = await keyCheck(target, entry, context);
    if ("reason" in check)
        return unverified(check.reason);
    const verified = await context.verify(check.candidates, check.release);
    if ("reason" in verified)
        return unverified(verified.reason);
    const { path, sha256, format, fingerprint } = verified;
    return {
        repository: { ...base, signing_key: { path, sha256, format, fingerprint } },
        key: verified,
    };
};
/**
 * The apt repositories other than Ubuntu's that list the installed version.
 * `apt-get indextargets` names each source's sources entry, release and
 * signed release file; the key is the one whose signature over that release
 * gpgv verified: the entry's Signed-By keyrings, or every key apt trusts.
 */
export const inspectAptRepositories = async (installed, host, signal) => {
    const vendor = installed.sources.flatMap((source, index) => {
        const origin = installed.origins?.[index] ?? null;
        return origin === "Ubuntu" ? [] : [{ source, origin }];
    });
    if (vendor.length === 0)
        return {
            repositories: [],
            keys: new Map(),
            indexTargets: [],
            limitations: [],
        };
    const targets = await indexTargets(host.runQuery, signal);
    const files = sourcesFiles(signal);
    return withGpgvKeyCheck(host.runQuery, signal, async (check) => {
        const context = {
            apt: host.apt,
            targets,
            sources: files.read,
            verify: (candidates, release) => check.firstVerifying(candidates, release),
        };
        const keys = new Map();
        const repositories = [];
        for (const source of vendor) {
            const facts = await repositoryFacts(source, context);
            repositories.push(facts.repository);
            if (facts.key !== undefined)
                keys.set(facts.key.sha256, facts.key.bytes);
        }
        return {
            repositories,
            keys,
            indexTargets: [...(targets?.values() ?? [])],
            limitations: files.unreadable.map((file) => `The apt sources file ${file} could not be read, so repositories it lists are not matched.`),
        };
    });
};
