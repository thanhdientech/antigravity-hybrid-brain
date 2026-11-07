const ARMOR_BEGIN = "-----BEGIN PGP PUBLIC KEY BLOCK-----";
const ARMOR_END = "-----END PGP PUBLIC KEY BLOCK-----";
const listValues = (value) => (value ?? "").split(/[\s,]+/u).filter((part) => part.length > 0);
const withoutTrailingSlashes = (uri) => uri.replace(/\/+$/u, "");
/** A URI's user name and password: up to the last `@` before its path, as apt reads them. */
const USER_INFO = /^(?<scheme>[a-z][a-z0-9+.-]*:\/\/)[^/]*@/iu;
/** A URI without the user name and password it may hold before its host. */
export const withoutCredentials = (uri) => uri.replace(USER_INFO, "$<scheme>");
/** A line of apt's output with every URI in it stripped of a user name and password, whether or not apt printed them. */
export const withoutCredentialsIn = (text) => text.replace(/(?<scheme>[a-z][a-z0-9+.-]*:\/\/)[^\s/]*@/giu, "$<scheme>");
/** Whether a suite as an entry writes it is a target's release, which apt leaves empty for the flat suite `/`. */
const isRelease = (suite, release) => suite === release || (suite === "/" && release === "");
const stanza = (at, fields) => {
    const signedBy = fields.options.get("signed-by") ?? "";
    const inlineKey = signedBy.includes(ARMOR_BEGIN);
    const uris = fields.uris.map(withoutCredentials);
    return {
        ...at,
        uris: uris.map(withoutTrailingSlashes),
        credentialed: uris
            .filter((uri, index) => uri !== fields.uris[index])
            .map(withoutTrailingSlashes),
        suites: fields.suites,
        components: fields.components,
        architectures: listValues(fields.options.get("arch")),
        signedBy: inlineKey ? [] : listValues(signedBy),
        inlineKey,
    };
};
const ONE_LINE = /^deb(?:\s+\[(?<options>[^\]]*)\])?\s+(?<uri>\S+)\s+(?<suite>\S+)(?<components>(?:\s+\S+)*)\s*$/u;
/** The `deb` lines of a one-line `sources.list` file; `deb-src` lines and comments are skipped. */
export const parseOneLineSources = (text, file) => text.split("\n").flatMap((line, index) => {
    const groups = ONE_LINE.exec(line.replace(/#.*$/u, "").trim())?.groups;
    if (groups?.uri === undefined || groups.suite === undefined)
        return [];
    const options = new Map((groups.options ?? "").split(/\s+/u).flatMap((option) => {
        const equals = option.indexOf("=");
        return equals > 0
            ? [[option.slice(0, equals), option.slice(equals + 1)]]
            : [];
    }));
    return [
        stanza({ file, position: index + 1 }, {
            uris: [groups.uri],
            suites: [groups.suite],
            components: listValues(groups.components),
            options,
        }),
    ];
});
/** Fields of each deb822 paragraph by lowercase name; continuation lines keep their line breaks. */
export const deb822Paragraphs = (text) => {
    const found = [];
    let current = new Map();
    let last;
    for (const line of [...text.split("\n"), ""]) {
        if (line.trim().length === 0) {
            if (current.size > 0)
                found.push(current);
            current = new Map();
            last = undefined;
        }
        else if (line.startsWith("#"))
            continue;
        else if (/^[ \t]/u.test(line) && last !== undefined)
            current.set(last, `${current.get(last) ?? ""}\n${line.trim()}`);
        else {
            const colon = line.indexOf(":");
            if (colon <= 0)
                continue;
            last = line.slice(0, colon).trim().toLowerCase();
            current.set(last, line.slice(colon + 1).trim());
        }
    }
    return found;
};
/** The `deb` stanzas of a deb822 `.sources` file; disabled paragraphs are skipped but still counted. */
export const parseDeb822Sources = (text, file) => deb822Paragraphs(text).flatMap((fields, index) => {
    if (!listValues(fields.get("types")).includes("deb") ||
        fields.get("enabled")?.toLowerCase() === "no")
        return [];
    return [
        stanza({ file, position: index + 1 }, {
            uris: listValues(fields.get("uris")),
            suites: listValues(fields.get("suites")),
            components: listValues(fields.get("components")),
            options: new Map([
                ["signed-by", fields.get("signed-by") ?? ""],
                ["arch", fields.get("architectures") ?? ""],
            ]),
        }),
    ];
});
const SOURCES_ENTRY = /^(?<file>\/.*):(?<position>[1-9]\d*)$/u;
/** The index targets of `apt-get indextargets` output; a paragraph missing a field REA needs is skipped. */
export const parseAptIndexTargets = (output) => deb822Paragraphs(output).flatMap((fields) => {
    const at = SOURCES_ENTRY.exec(fields.get("sourcesentry") ?? "")?.groups;
    const description = fields.get("description");
    const repoUri = fields.get("repo-uri");
    const baseUri = fields.get("base-uri");
    const filename = fields.get("filename");
    if (at?.file === undefined ||
        at.position === undefined ||
        description === undefined ||
        repoUri === undefined ||
        baseUri === undefined ||
        filename?.startsWith("/") !== true)
        return [];
    const optional = (name) => fields.get(name) || null;
    return [
        {
            description: withoutCredentialsIn(description),
            sourcesFile: at.file,
            position: Number(at.position),
            repoUri: withoutCredentials(repoUri),
            release: fields.get("release") ?? "",
            component: optional("component"),
            baseUri: withoutCredentials(baseUri),
            filename,
            origin: optional("origin"),
            suite: optional("suite"),
            codename: optional("codename"),
        },
    ];
});
/**
 * The sources entry an index target comes from: the stanza at its file and
 * position, with its URI and suite when the stanza lists several.
 */
export const entryForTarget = (target, stanzas) => {
    const at = stanzas.find((candidate) => candidate.file === target.sourcesFile &&
        candidate.position === target.position);
    if (at === undefined)
        return undefined;
    const { uris, credentialed, suites, ...entry } = at;
    const single = uris.length === 1 && suites.length === 1;
    const repoUri = withoutTrailingSlashes(target.repoUri);
    const uri = single ? uris[0] : uris.find((listed) => listed === repoUri);
    const suite = single
        ? suites[0]
        : suites.find((listed) => isRelease(listed, target.release));
    if (uri === undefined || suite === undefined)
        return undefined;
    return {
        ...entry,
        uri,
        credentials: credentialed.includes(uri),
        suite,
        components: suite.endsWith("/") ? [] : entry.components,
    };
};
/**
 * The package files, as `apt-cache policy` prints them, that apt reads once
 * these repositories are declared: every index of the same URI and suite in
 * one of their components. A declared repository brings each component of
 * its entry, not only the one listing the installed version.
 */
export const declaredPackageFiles = (repositories, targets) => {
    const declares = (repository, target) => repository.uri === withoutTrailingSlashes(target.repoUri) &&
        repository.suite !== null &&
        isRelease(repository.suite, target.release) &&
        (target.component === null
            ? repository.components.length === 0
            : repository.components.includes(target.component));
    return new Set(targets
        .filter((target) => repositories.some((repository) => declares(repository, target)))
        .map((target) => target.description));
};
const QUOTED = new Set('\\|{}[]<>"^~_=!@#$%^&*');
/** apt's file name for a URI in its lists directory: no scheme or credentials, special characters quoted, `/` as `_`. */
export const aptListFileName = (uri) => {
    const path = uri
        .replace(/^[a-z][a-z0-9+.-]*:\/\//iu, "")
        .replace(/^[^/@]*@/u, "");
    let quoted = "";
    for (const character of path) {
        const code = character.codePointAt(0) ?? 0;
        quoted +=
            QUOTED.has(character) || code <= 0x20 || code >= 0x7f
                ? [...Buffer.from(character, "utf8")]
                    .map((byte) => `%${byte.toString(16).padStart(2, "0")}`)
                    .join("")
                : character;
    }
    return quoted.replaceAll("/", "_");
};
/** Ubuntu Pro's ESM repositories, which apt reaches only with the host's Ubuntu Pro credentials. */
export const isUbuntuProRepository = (origin, uri) => (origin ?? "").startsWith("UbuntuESM") ||
    /^https?:\/\/esm\.ubuntu\.com(?:[/:]|$)/iu.test(uri ?? "");
const UNTRUSTED_SIGNATURE = /^\[GNUPG:\] (?:BADSIG|EXPSIG|EXPKEYSIG|REVKEYSIG|ERRSIG) (?<key>[0-9A-Fa-f]+)(?: |$)/u;
/**
 * The first VALIDSIG in `gpgv --status-fd` output whose key no bad, expired,
 * revoked or unverifiable signature names. gpgv's exit status is not used: a
 * release also signed by a key the keyring lacks makes gpgv fail.
 */
export const validSignature = (status) => {
    const lines = status.split("\n").map((line) => line.trim());
    const untrusted = lines.flatMap((line) => {
        const key = UNTRUSTED_SIGNATURE.exec(line)?.groups?.key;
        return key === undefined ? [] : [key.toUpperCase()];
    });
    const names = (fingerprint, key) => fingerprint.startsWith(key) || fingerprint.endsWith(key);
    for (const line of lines) {
        const fields = /^\[GNUPG:\] VALIDSIG (?<fields>.+)$/u
            .exec(line)
            ?.groups?.fields?.split(" ");
        const signing = fields?.[0]?.toUpperCase();
        if (signing === undefined)
            continue;
        const primary = (fields?.[9] ?? signing).toUpperCase();
        if (!untrusted.some((key) => names(signing, key) || names(primary, key)))
            return { signing, primary };
    }
    return undefined;
};
/** Whether a key file holds an ASCII-armored key, by content as agentenv decides it. */
export const isArmoredKey = (bytes) => Buffer.from(bytes).toString("latin1").trimStart().startsWith(ARMOR_BEGIN);
/** The binary keyring an ASCII-armored key file decodes to, or undefined when it holds no key block. */
export const dearmorPublicKeys = (bytes) => {
    const blocks = [];
    let state = "outside";
    let body = "";
    for (const raw of Buffer.from(bytes).toString("latin1").split("\n")) {
        const line = raw.trim();
        if (state === "outside") {
            if (line === ARMOR_BEGIN)
                [state, body] = ["headers", ""];
        }
        else if (line === ARMOR_END) {
            blocks.push(Buffer.from(body, "base64"));
            state = "outside";
        }
        else if (state === "headers") {
            if (line.length === 0 || !line.includes(":"))
                state = "body";
            if (!line.includes(":"))
                body += line;
        }
        else if (!/^=[A-Za-z0-9+/]{4}$/u.test(line))
            body += line;
    }
    const keyring = Buffer.concat(blocks);
    return keyring.length === 0 ? undefined : keyring;
};
