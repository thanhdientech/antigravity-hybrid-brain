import { countComparison } from "./appTask.js";
const pass = (description) => ({ passed: true, description });
const fail = (description) => ({
    passed: false,
    description,
});
const shown = (value) => {
    const text = JSON.stringify(value);
    return text.length > 200 ? `${text.slice(0, 200)}…` : text;
};
const undecided = (file) => fail(`the view of ${file} is truncated, so what it leaves out is unknown`);
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
/** JSON equality: numbers by value, objects by their keys, arrays in order. */
export const sameJson = (actual, expected) => {
    if (Array.isArray(expected))
        return (Array.isArray(actual) &&
            actual.length === expected.length &&
            expected.every((item, index) => sameJson(actual[index], item)));
    if (isRecord(expected))
        return (isRecord(actual) &&
            Object.keys(actual).length === Object.keys(expected).length &&
            Object.entries(expected).every(([key, item]) => Object.hasOwn(actual, key) && sameJson(actual[key], item)));
    return actual === expected;
};
/** The value a JSON pointer names, or undefined when it names none. */
export const resolvePointer = (view, pointer) => {
    let current = view;
    for (const raw of pointer.slice(1).split("/")) {
        const token = raw.replaceAll("~1", "/").replaceAll("~0", "~");
        if (Array.isArray(current)) {
            if (!/^(?:0|[1-9][0-9]*)$/u.test(token))
                return undefined;
            const index = Number(token);
            if (index >= current.length)
                return undefined;
            current = current[index] ?? null;
        }
        else if (isRecord(current) && Object.hasOwn(current, token))
            current = current[token] ?? null;
        else
            return undefined;
    }
    return current ?? null;
};
/** A file's version as the app's data/get serves it, or undefined when it is absent. */
export const versionView = (version) => !version.present
    ? undefined
    : version.view_error === null
        ? { format: version.format, view: version.view }
        : { format: version.format, view: null, error: version.view_error };
/** Whether an XML view names a namespace, whose names the verifier's reader spells differently. */
export const namesXmlNamespace = (node) => {
    if (Array.isArray(node))
        return node.some(namesXmlNamespace);
    if (!isRecord(node))
        return false;
    const named = (name) => typeof name === "string" && (name.includes(":") || name === "xmlns");
    return (named(node.name) ||
        (isRecord(node.attributes) && Object.keys(node.attributes).some(named)) ||
        Object.values(node).some(namesXmlNamespace));
};
/** Whether a view says it holds only part of its file, as REA's own readers flag it. */
const truncatedView = (format, view) => {
    if (!isRecord(view))
        return false;
    if (format === "text" || format === "xml")
        return view.truncated === true;
    if (format !== "sqlite")
        return false;
    const tables = isRecord(view.tables) ? Object.values(view.tables) : [];
    return (view.tables_truncated === true ||
        tables.some((table) => isRecord(table) &&
            (table.truncated === true || typeof table.error === "string")));
};
/** A file's view of one format, or why the check cannot read it; an absent file reads as empty. */
const viewOf = (check, entry, format) => {
    if (entry === undefined)
        return { view: null, truncated: false };
    if (typeof entry.error === "string")
        return fail(`${check.file} has no view: ${entry.error}`);
    if (entry.format === null || entry.format === "binary")
        return fail(`${check.file} is binary and has no view`);
    if (format !== undefined && entry.format !== format)
        return fail(`${check.file} is read as ${entry.format}, not ${format}`);
    return {
        view: entry.view,
        truncated: truncatedView(entry.format, entry.view),
    };
};
const compared = (check, n, what) => {
    const { operator, n: expected } = countComparison(check) ?? {
        operator: "equals",
        n: Number.NaN,
    };
    const met = operator === "equals"
        ? n === expected
        : operator === "at_least"
            ? n >= expected
            : n <= expected;
    const description = `${String(n)} ${what}, expected ${operator.replace("_", " ")} ${String(expected)}`;
    return met ? pass(description) : fail(description);
};
const lineVerdict = (check, entry) => {
    const read = viewOf(check, entry, "text");
    if ("passed" in read)
        return read;
    const lines = isRecord(read.view) && Array.isArray(read.view.lines)
        ? read.view.lines.filter((line) => typeof line === "string")
        : [];
    const file = check.file;
    if (check.kind === "lines_present") {
        const missing = check.lines.find((line) => !lines.includes(line));
        return missing === undefined
            ? pass(`${file} has the line(s) ${shown(check.lines)}`)
            : fail(`${file} has no line ${shown(missing)}`);
    }
    if (read.truncated)
        return undecided(file);
    if (check.kind === "lines_absent") {
        const found = check.lines.find((line) => lines.includes(line));
        return found === undefined
            ? pass(`${file} has none of the lines ${shown(check.lines)}`)
            : fail(`${file} still has the line ${shown(found)}`);
    }
    const { exact, contains } = check;
    const n = lines.filter((line) => contains === undefined ? line === exact : line.includes(contains)).length;
    return compared(check, n, contains === undefined
        ? `line(s) of ${file} match ${shown(exact ?? "")}`
        : `line(s) of ${file} contain ${shown(contains)}`);
};
const valueVerdict = (check, entry) => {
    const read = viewOf(check, entry, undefined);
    if ("passed" in read)
        return read;
    const found = entry === undefined ? undefined : resolvePointer(read.view, check.pointer);
    const at = `${check.file} at ${check.pointer}`;
    // A whole object or array equals the expected one only if nothing of it was left out.
    const whole = check.kind === "value_equals" &&
        typeof check.value === "object" &&
        check.value !== null;
    if (whole && read.truncated)
        return undecided(check.file);
    if (check.kind === "value_equals")
        return found !== undefined && sameJson(found, check.value)
            ? pass(`${at} is ${shown(check.value)}`)
            : fail(found === undefined
                ? `${at} has no value`
                : `${at} is ${shown(found)}, not ${shown(check.value)}`);
    if (read.truncated)
        return undecided(check.file);
    return found === undefined
        ? pass(`${at} has no value`)
        : fail(`${at} is ${shown(found)}`);
};
/** A table's columns and rows; a table the view lacks has none, unless the view left tables out. */
const tableOf = (check, view) => {
    const sqlite = isRecord(view) ? view : {};
    const tables = isRecord(sqlite.tables) ? sqlite.tables : {};
    const table = Object.hasOwn(tables, check.table)
        ? tables[check.table]
        : undefined;
    if (table === undefined && sqlite.tables_truncated === true)
        return undecided(check.file);
    const read = isRecord(table) ? table : {};
    if (typeof read.error === "string")
        return fail(`${check.file} table ${check.table} could not be read: ${read.error}`);
    return {
        columns: Array.isArray(read.columns) ? read.columns : [],
        rows: Array.isArray(read.rows) ? read.rows : [],
        truncated: read.truncated === true,
    };
};
const rowVerdict = (check, entry) => {
    const read = viewOf(check, entry, "sqlite");
    if ("passed" in read)
        return read;
    const table = tableOf(check, read.view);
    if ("passed" in table)
        return table;
    const { columns, rows } = table;
    const name = `${check.file} table ${check.table}`;
    const matches = (row) => Array.isArray(row) &&
        Object.entries(check.where ?? {}).every(([column, value]) => {
            const index = columns.indexOf(column);
            return index >= 0 && sameJson(row[index], value);
        });
    const n = rows.filter(matches).length;
    if (check.kind === "row_present")
        return n > 0
            ? pass(`${name} has a row with ${shown(check.where)}`)
            : fail(`${name} has no row with ${shown(check.where)}`);
    if (table.truncated)
        return undecided(check.file);
    if (check.kind === "row_absent")
        return n === 0
            ? pass(`${name} has no row with ${shown(check.where)}`)
            : fail(`${name} has ${String(n)} row(s) with ${shown(check.where)}`);
    return compared(check, n, `row(s) of ${name}${check.where === undefined ? "" : ` with ${shown(check.where)}`}`);
};
const verdict = (check, entry) => {
    switch (check.kind) {
        case "file_present":
            return entry === undefined
                ? fail(`${check.file} does not exist`)
                : pass(`${check.file} exists`);
        case "file_absent":
            return entry === undefined
                ? pass(`${check.file} does not exist`)
                : fail(`${check.file} exists`);
        case "lines_present":
        case "lines_absent":
        case "line_count":
            return lineVerdict(check, entry);
        case "value_equals":
        case "value_absent":
            return valueVerdict(check, entry);
        case "row_present":
        case "row_absent":
        case "row_count":
            return rowVerdict(check, entry);
    }
};
/** Evaluate each check against views by home path, as the exported verifier does. */
export const evaluateTaskChecks = (checks, views) => checks.map((check) => ({
    id: check.id,
    ...verdict(check, views.get(check.file)),
}));
