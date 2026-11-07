import { err, ok } from "../result.js";
const GROUP = /^\[(?<name>[^\]]+)\]$/u;
const ENTRY = /^(?<key>[A-Za-z0-9-]+)\s*=\s*(?<value>.*)$/u;
const VALUE_ESCAPES = {
    s: " ",
    n: "\n",
    t: "\t",
    r: "\r",
    "\\": "\\",
    ";": "\\;",
};
/** Undo the escapes the desktop entry format allows in string values. */
const unescapeValue = (value) => value.replace(/\\(.)/gu, (match, next) => VALUE_ESCAPES[next] ?? match);
const listValue = (value) => value === undefined
    ? []
    : value
        .split(/(?<!\\);/u)
        .map((part) => part.replaceAll("\\;", ";"))
        .filter((part) => part.length > 0);
/** Read the main group of a freedesktop desktop entry, ignoring localized keys. */
export const parseDesktopEntry = (text) => {
    const values = new Map();
    let group;
    let found = false;
    for (const raw of text.split(/\r?\n/u)) {
        const line = raw.trim();
        if (line.length === 0 || line.startsWith("#"))
            continue;
        const header = GROUP.exec(line);
        if (header?.groups !== undefined) {
            group = header.groups.name;
            found ||= group === "Desktop Entry";
            continue;
        }
        const entry = ENTRY.exec(line);
        if (group !== "Desktop Entry" || entry?.groups === undefined)
            continue;
        const { key, value } = entry.groups;
        if (key !== undefined && value !== undefined && !values.has(key))
            values.set(key, unescapeValue(value));
    }
    if (!found)
        return err("missing_desktop_entry_group");
    const field = (key) => values.get(key) ?? null;
    return ok({
        type: field("Type"),
        name: field("Name"),
        exec: field("Exec"),
        try_exec: field("TryExec"),
        path: field("Path"),
        icon: field("Icon"),
        startup_wm_class: field("StartupWMClass"),
        categories: listValue(values.get("Categories")),
        mime_types: listValue(values.get("MimeType")),
        terminal: values.get("Terminal") === "true",
    });
};
const QUOTED_ESCAPES = new Set(['"', "`", "$", "\\"]);
/** Split an `Exec` value into arguments with the specification's quoting rules. */
export const tokenizeDesktopExec = (exec) => {
    const tokens = [];
    let current;
    let quoted = false;
    for (let index = 0; index < exec.length; index += 1) {
        const character = exec.charAt(index);
        if (quoted) {
            const next = exec.charAt(index + 1);
            if (character === "\\" && QUOTED_ESCAPES.has(next)) {
                current = `${current ?? ""}${next}`;
                index += 1;
            }
            else if (character === '"')
                quoted = false;
            else
                current = `${current ?? ""}${character}`;
        }
        else if (character === '"') {
            quoted = true;
            current ??= "";
        }
        else if (character === " " || character === "\t") {
            if (current !== undefined)
                tokens.push(current);
            current = undefined;
        }
        else
            current = `${current ?? ""}${character}`;
    }
    if (quoted)
        return err("unterminated_quote");
    if (current !== undefined)
        tokens.push(current);
    return tokens.length === 0 ? err("empty_command") : ok(tokens);
};
const FILE_FIELD_CODES = new Set(["%f", "%F", "%u", "%U"]);
/**
 * Expand field codes for a launch with no files, then append caller arguments.
 * File and URL codes are dropped, so the caller's arguments take their place.
 */
export const expandDesktopExec = (tokens, context, arguments_) => {
    const expanded = [];
    for (const token of tokens) {
        if (FILE_FIELD_CODES.has(token))
            continue;
        if (token === "%i") {
            if (context.icon !== null)
                expanded.push("--icon", context.icon);
            continue;
        }
        expanded.push(token.replace(/%(.)/gu, (match, code) => {
            if (code === "%")
                return "%";
            if (code === "c")
                return context.name ?? "";
            if (code === "k")
                return context.location ?? "";
            return /[fFuUidDnNvm]/u.test(code) ? "" : match;
        }));
    }
    return [...expanded, ...arguments_];
};
/**
 * `flatpak run` options that take a value. GOption also accepts the value as
 * the next argument (`--branch stable`), so it must be skipped with its option.
 */
const FLATPAK_RUN_VALUE_OPTIONS = new Set([
    "--arch",
    "--command",
    "--cwd",
    "--branch",
    "--runtime",
    "--runtime-version",
    "--commit",
    "--runtime-commit",
    "--parent-pid",
    "--instance-id-fd",
    "--app-path",
    "--usr-path",
    "--installation",
    // Sandbox permissions, shared with `flatpak override`.
    "--share",
    "--unshare",
    "--socket",
    "--nosocket",
    "--device",
    "--nodevice",
    "--allow",
    "--disallow",
    "--filesystem",
    "--nofilesystem",
    "--env",
    "--env-fd",
    "--unset-env",
    "--own-name",
    "--talk-name",
    "--no-talk-name",
    "--system-own-name",
    "--system-talk-name",
    "--system-no-talk-name",
    "--add-policy",
    "--remove-policy",
    "--persist",
    "--usb",
    "--nousb",
    "--usb-list",
    "--usb-list-file",
]);
/**
 * The application id a `flatpak run` argument list names: its first operand,
 * after options and their values, without a `/arch/branch` ref suffix.
 */
const flatpakApplicationId = (arguments_) => {
    for (let index = 0; index < arguments_.length; index += 1) {
        const token = arguments_[index] ?? "";
        if (token === "--")
            return arguments_[index + 1]?.split("/")[0] || null;
        if (!token.startsWith("-"))
            return token.split("/")[0] || null;
        if (FLATPAK_RUN_VALUE_OPTIONS.has(token))
            index += 1;
    }
    return null;
};
/** Apply `env NAME=value` prefixes and recognise `flatpak run` launchers. */
export const unwrapDesktopCommand = (argv) => {
    let index = 0;
    // No prototype, so an assignment such as `__proto__=x` stays a variable.
    const environment = Object.create(null);
    if (argv[0]?.split("/").at(-1) === "env") {
        index = 1;
        while (/^[A-Za-z_][A-Za-z0-9_]*=/u.test(argv[index] ?? "")) {
            const assignment = argv[index] ?? "";
            const split = assignment.indexOf("=");
            environment[assignment.slice(0, split)] = assignment.slice(split + 1);
            index += 1;
        }
    }
    const program = argv[index] ?? "";
    if (program.split("/").at(-1) === "flatpak" && argv[index + 1] === "run")
        return {
            kind: "flatpak",
            program,
            environment,
            application_id: flatpakApplicationId(argv.slice(index + 2)),
        };
    return { kind: "direct", program, environment, index };
};
