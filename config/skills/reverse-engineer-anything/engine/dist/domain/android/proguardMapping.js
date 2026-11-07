import { err, ok } from "../result.js";
import { dexDescriptorSchema, dexTypeSchema } from "./dexTypes.js";
import { jsonStringByteLength } from "../jsonStringByteLength.js";
/** Retained representation and per-residual-class claim budgets, not file-size limits. */
export const PROGUARD_MAPPING_LIMITS = Object.freeze({
    indexBytes: 128 * 1024 * 1024,
    projectionBytes: 8 * 1024 * 1024,
    malformedSamples: 16,
    candidates: 8,
});
const HEADER = /^#\s*(compiler|compiler_version|min_api|pg_map_id|pg_map_hash):\s*(.*)$/u;
const CLASS_LINE = /^([^\s:()]+) -> ([^\s:()]+):$/u;
const FIELD_LINE = /^\s+([^\s:()]+) ([^\s:()]+) -> ([^\s:()]+)$/u;
const METHOD_LINE = /^\s+(?:(\d+):(?:(\d+):)?)?([^\s:()]+) ([^\s:()]+)\(([^()]*)\)(?::(\d+)(?::(\d+))?)? -> ([^\s:()]+)$/u;
const TYPE_TOKEN = /^[^\s(),;<>:[\]]+(?:\[\])*$/u;
const DEX_PRIMITIVES = new Map([
    ["boolean", "Z"],
    ["byte", "B"],
    ["char", "C"],
    ["short", "S"],
    ["int", "I"],
    ["long", "J"],
    ["float", "F"],
    ["double", "D"],
    ["void", "V"],
]);
/** The type without its trailing `[]` dimensions. */
const arrayElement = (type) => {
    let end = type.length;
    while (type.endsWith("[]", end))
        end -= 2;
    return type.slice(0, end);
};
/** `void` is valid only as a return type and never as an array element. */
const validType = (type, isReturn) => {
    const element = arrayElement(type);
    return (TYPE_TOKEN.test(type) &&
        (element !== "void" || (isReturn && element === type)));
};
/** Split `com.x.Y.name` into its mapped class and member name. */
const memberOwner = (qualified, section) => {
    const dot = qualified.lastIndexOf(".");
    return dot <= 0
        ? { class: section, name: qualified }
        : { class: qualified.slice(0, dot), name: qualified.slice(dot + 1) };
};
// Conservative accounting reserves UTF-16 strings plus container/entry/record
// overhead. These are representation allowances, not claimed V8 heap measurements.
const stringBytes = (value) => 32 + value.length * 2;
/** Own admitted UTF-16 code units; slices/regex captures can retain the whole file. */
const ownString = (value) => Buffer.from(value, "utf16le").toString("utf16le");
/** Share the already owned section name; qualified foreign owners need storage. */
const ownMemberOwner = (mapped, section) => ({
    class: mapped.class === section ? section : ownString(mapped.class),
    name: ownString(mapped.name),
});
const capacity = (state, resource, line = state.line) => {
    state.failure ??= {
        kind: "capacity",
        resource,
        line,
        limit_bytes: resource === "index"
            ? state.limits.indexBytes
            : state.limits.projectionBytes,
    };
    return false;
};
const chargeIndex = (state, delta, line = state.line) => {
    if (state.indexBytes + delta > state.limits.indexBytes)
        return capacity(state, "index", line);
    state.indexBytes += delta;
    return true;
};
const chargeProjection = (state, record, delta, line = state.line) => {
    const bytes = (state.projectionBytes.get(record.residualName) ?? 0) + delta;
    if (state.headerBytes + bytes > state.limits.projectionBytes)
        return capacity(state, "projection", line);
    state.projectionBytes.set(record.residualName, bytes);
    return true;
};
const fieldProjectionBytes = (mapped) => 128 +
    jsonStringByteLength(mapped.class) +
    jsonStringByteLength(mapped.name) +
    jsonStringByteLength(mapped.type);
const methodProjectionBytes = (mapped) => {
    let bytes = 160 +
        jsonStringByteLength(mapped.class) +
        jsonStringByteLength(mapped.name) +
        jsonStringByteLength(mapped.return_type);
    for (const type of mapped.parameter_types)
        bytes += jsonStringByteLength(type) + 1;
    return bytes;
};
/** Expanded claims only; observations are retained separately by their owner. */
export const proguardResolutionBytes = (resolution) => {
    const mappedBytes = (mapped) => "parameter_types" in mapped
        ? methodProjectionBytes(mapped)
        : "type" in mapped
            ? fieldProjectionBytes(mapped)
            : 128 + jsonStringByteLength(mapped.name);
    if (resolution.status === "unmapped")
        return 64;
    if (resolution.status === "mapped")
        return 64 + mappedBytes(resolution.mapped);
    let bytes = 128;
    for (const mapped of resolution.candidates)
        bytes += mappedBytes(mapped);
    return bytes;
};
const malformed = (state, line, reason) => {
    state.records.malformed++;
    if (state.malformed.length < state.sampleLimit && chargeIndex(state, 96))
        state.malformed.push({ line, reason });
};
const append = (map, key, value) => {
    const list = map.get(key);
    if (list === undefined)
        map.set(key, [value]);
    else
        list.push(value);
};
// Validated names and types hold no whitespace, so spaces separate safely.
const methodKey = (obfuscated, method, section) => `${obfuscated} ${method.class === section ? "" : method.class} ${method.name} ${method.return_type} ${method.parameter_types.join(",")}`;
const memberIndexBytes = (mapped, section) => {
    let bytes = 256 +
        stringBytes(mapped.name) +
        (mapped.class === section ? 0 : stringBytes(mapped.class));
    if ("type" in mapped)
        return bytes + stringBytes(mapped.type);
    bytes +=
        stringBytes(mapped.return_type) + 32 + mapped.parameter_types.length * 16;
    for (const type of mapped.parameter_types)
        bytes += stringBytes(type);
    return bytes;
};
/** Commit a frame stack's outermost original, merging line-range splits. */
const closeGroup = (state) => {
    const group = state.group;
    state.group = undefined;
    if (group === undefined)
        return;
    const key = methodKey(group.obfuscated, group.outermost, group.record.name);
    const indexed = group.record.methodIndex.get(key);
    const same = indexed === undefined
        ? undefined
        : group.residual === undefined || indexed.first.residual === undefined
            ? indexed.first
            : indexed.byResidual.get(group.residual);
    if (same !== undefined) {
        if (same.residual === undefined && group.residual !== undefined) {
            if (!chargeIndex(state, stringBytes(group.residual), group.line))
                return;
            same.residual = ownString(group.residual);
            indexed?.byResidual.set(same.residual, same);
        }
        same.residualConflict ||= group.residualConflict;
        return;
    }
    const bytes = memberIndexBytes(group.outermost, group.record.name) +
        stringBytes(key) +
        stringBytes(group.obfuscated) +
        384 +
        (group.residual === undefined ? 0 : stringBytes(group.residual));
    if (!chargeIndex(state, bytes, group.line) ||
        !chargeProjection(state, group.record, methodProjectionBytes(group.outermost), group.line))
        return;
    const record = {
        // Only the admitted outermost frame owns strings. Inline replacements and
        // duplicate line ranges never copy their discarded names or parameters.
        mapped: {
            ...ownMemberOwner(group.outermost, group.record.name),
            return_type: ownString(group.outermost.return_type),
            parameter_types: group.outermost.parameter_types.map(ownString),
        },
        residual: group.residual === undefined ? undefined : ownString(group.residual),
        residualConflict: group.residualConflict,
    };
    append(group.record.methods, ownString(group.obfuscated), record);
    const identity = indexed ?? { first: record, byResidual: new Map() };
    if (record.residual !== undefined)
        identity.byResidual.set(record.residual, record);
    if (indexed === undefined)
        group.record.methodIndex.set(ownString(key), identity);
};
const parseClassLine = (state, line, number) => {
    closeGroup(state);
    if (state.failure !== undefined)
        return;
    state.last = undefined;
    const match = CLASS_LINE.exec(line);
    if (match === null) {
        state.current = null;
        malformed(state, number, "class-line");
        return;
    }
    const [, original = "", residual = ""] = match;
    if (!chargeIndex(state, 896 + 2 * stringBytes(original) + 2 * stringBytes(residual)))
        return;
    const record = {
        name: ownString(original),
        residualName: ownString(residual),
        fields: new Map(),
        methods: new Map(),
        methodIndex: new Map(),
    };
    if (!chargeProjection(state, record, 128 + jsonStringByteLength(original)))
        return;
    state.current = record;
    state.records.classes++;
    append(state.classes, record.residualName, record);
    const alias = state.residualAliases.get(record.name);
    if (alias === undefined)
        state.residualAliases.set(record.name, record.residualName);
    else if (alias !== record.residualName)
        state.residualAliases.set(record.name, null);
};
const parseField = (state, record, line) => {
    const match = FIELD_LINE.exec(line);
    if (match === null)
        return false;
    const [, type = "", name = "", obfuscated = ""] = match;
    if (!validType(type, false))
        return false;
    closeGroup(state);
    if (state.failure !== undefined)
        return true;
    const mapped = { ...memberOwner(name, record.name), type };
    if (!chargeIndex(state, memberIndexBytes(mapped, record.name) + stringBytes(obfuscated) + 96) ||
        !chargeProjection(state, record, fieldProjectionBytes(mapped)))
        return true;
    const field = {
        mapped: { ...ownMemberOwner(mapped, record.name), type: ownString(type) },
        residual: undefined,
        residualConflict: false,
    };
    append(record.fields, ownString(obfuscated), field);
    state.records.fields++;
    state.last = field;
    return true;
};
const methodRange = (start, end) => {
    if (start === undefined)
        return null;
    const last = end ?? start;
    return Number(start) > Number(last) ? false : `${start}:${last}`;
};
const parseMethod = (state, record, line) => {
    const match = METHOD_LINE.exec(line);
    if (match === null)
        return false;
    const [, start, end, returnType = "", name = "", args = "", originalStart, originalEnd, obfuscated = "",] = match;
    // Count before split: a small source string can otherwise allocate millions
    // of parameter slots before the retained-representation admission runs.
    let parameterCount = args === "" ? 0 : 1;
    for (let index = 0; index < args.length; index++)
        if (args.charCodeAt(index) === 44)
            parameterCount++;
    if (args.length * 4 + parameterCount * 64 + 512 > state.limits.indexBytes)
        return capacity(state, "index");
    const owner = memberOwner(name, record.name);
    if (state.headerBytes +
        160 +
        jsonStringByteLength(owner.class) +
        jsonStringByteLength(owner.name) +
        jsonStringByteLength(returnType) +
        jsonStringByteLength(args) +
        2 * parameterCount >
        state.limits.projectionBytes)
        return capacity(state, "projection");
    const parameters = args === "" ? [] : args.split(",");
    const range = methodRange(start, end);
    if (range === false ||
        !validType(returnType, true) ||
        !parameters.every((type) => validType(type, false)))
        return false;
    const mapped = {
        ...owner,
        return_type: returnType,
        parameter_types: parameters,
    };
    state.records.methods++;
    const group = state.group;
    // A caller frame records its single call-site line (`:7`); a line with an
    // original range is a separate method that happens to share the range.
    if (group !== undefined &&
        range !== null &&
        group.obfuscated === obfuscated &&
        group.range === range &&
        originalStart !== undefined &&
        originalEnd === undefined) {
        group.outermost = mapped;
        group.line = state.line;
        return true;
    }
    closeGroup(state);
    if (state.failure !== undefined)
        return true;
    state.group = {
        record,
        obfuscated,
        range,
        outermost: mapped,
        residual: undefined,
        residualConflict: false,
        line: state.line,
    };
    state.last = state.group;
    return true;
};
const parseMember = (state, line, number) => {
    const record = state.current;
    if (record === undefined || record === null) {
        closeGroup(state);
        state.last = undefined;
        malformed(state, number, "member-without-class");
        return;
    }
    if (parseField(state, record, line) || parseMethod(state, record, line))
        return;
    if (state.failure !== undefined)
        return;
    closeGroup(state);
    state.last = undefined;
    malformed(state, number, "member-line");
};
const metadataObject = (body) => {
    if (!body.startsWith("{"))
        return undefined;
    let value;
    try {
        value = JSON.parse(body);
    }
    catch {
        return undefined;
    }
    return value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        "id" in value &&
        typeof value.id === "string"
        ? value
        : undefined;
};
const setReported = (state, key, value) => {
    const before = state.reported[key];
    if (before === value)
        return;
    const delta = (value === null ? 4 : jsonStringByteLength(value)) -
        (before === null ? 4 : jsonStringByteLength(before));
    if (state.headerBytes + delta > state.limits.projectionBytes) {
        capacity(state, "projection");
        return;
    }
    if (!chargeIndex(state, (value === null ? 0 : stringBytes(value)) -
        (before === null ? 0 : stringBytes(before))))
        return;
    state.headerBytes += delta;
    state.reported[key] = value === null ? null : ownString(value);
};
/** Attach R8 metadata the v1 resolver uses; other ids are ignored. */
const parseMetadata = (state, metadata, number) => {
    if (metadata.id === "com.android.tools.r8.mapping") {
        if (state.current !== undefined)
            return;
        if (typeof metadata.version === "string")
            setReported(state, "map_version", metadata.version);
        else
            malformed(state, number, "metadata");
        return;
    }
    if (metadata.id !== "com.android.tools.r8.residualsignature")
        return;
    const target = state.last;
    if (target === undefined)
        return;
    const schema = "outermost" in target ? dexDescriptorSchema : dexTypeSchema;
    const signature = schema.safeParse(metadata.signature);
    if (!signature.success) {
        malformed(state, number, "metadata");
        return;
    }
    if (target.residual !== undefined) {
        if (target.residual !== signature.data)
            target.residualConflict = true;
        return;
    }
    if ("outermost" in target) {
        if (stringBytes(signature.data) > state.limits.indexBytes) {
            capacity(state, "index");
            return;
        }
        // A pending method frame may still be discarded or deduplicated. Commit
        // its signature together with its selected method in closeGroup.
        target.residual = signature.data;
    }
    else if (chargeIndex(state, stringBytes(signature.data))) {
        target.residual = ownString(signature.data);
    }
};
const parseComment = (state, line, number) => {
    const body = line.trimStart().slice(1).trim();
    if (body.startsWith("{")) {
        if (Buffer.byteLength(body) > state.limits.projectionBytes) {
            capacity(state, "projection");
            return;
        }
        // JSON.parse can materialize arrays/objects before metadata selection.
        if (state.indexBytes + body.length * 32 > state.limits.indexBytes) {
            capacity(state, "index");
            return;
        }
    }
    const metadata = metadataObject(body);
    if (metadata !== undefined) {
        parseMetadata(state, metadata, number);
        return;
    }
    const header = state.current === undefined ? HEADER.exec(line) : null;
    if (header === null)
        return;
    const [, key = "", value = ""] = header;
    setReported(state, key, value === "" ? null : value);
};
const parseLine = (state, raw, number) => {
    const line = raw.trimEnd();
    if (line === "")
        return;
    if (/^\s*#/u.test(line))
        parseComment(state, line, number);
    else if (/^\s/u.test(line))
        parseMember(state, line, number);
    else
        parseClassLine(state, line, number);
};
/**
 * Parse an R8/ProGuard mapping. Malformed records are counted and sampled
 * while parsing continues; a file without any class record fails closed.
 */
export const parseProguardMapping = (text, limits = {}) => {
    const state = {
        sampleLimit: limits.malformedSamples ?? PROGUARD_MAPPING_LIMITS.malformedSamples,
        limits: { ...PROGUARD_MAPPING_LIMITS, ...limits },
        indexBytes: 512,
        headerBytes: 256,
        projectionBytes: new Map(),
        failure: undefined,
        line: 1,
        reported: {
            compiler: null,
            compiler_version: null,
            min_api: null,
            map_version: null,
            pg_map_id: null,
            pg_map_hash: null,
        },
        classes: new Map(),
        residualAliases: new Map(),
        records: { classes: 0, fields: 0, methods: 0, malformed: 0 },
        malformed: [],
        current: undefined,
        group: undefined,
        last: undefined,
    };
    if (state.indexBytes > state.limits.indexBytes)
        capacity(state, "index");
    if (state.headerBytes > state.limits.projectionBytes)
        capacity(state, "projection");
    let start = 0;
    while (start <= text.length && state.failure === undefined) {
        const newline = text.indexOf("\n", start);
        const end = newline < 0 ? text.length : newline;
        parseLine(state, text.slice(start, end), state.line);
        if (newline < 0)
            break;
        start = newline + 1;
        state.line++;
    }
    if (state.failure !== undefined)
        return err(state.failure);
    closeGroup(state);
    if (state.failure !== undefined)
        return err(state.failure);
    if (state.records.classes === 0)
        return err({ kind: "no-class-records" });
    return ok({
        reported: state.reported,
        classes: state.classes,
        residualAliases: state.residualAliases,
        records: state.records,
        malformed: state.malformed,
    });
};
/** Resolve aliases once; consumers choose materialization or bounded comparison. */
const residualType = (mapping, type) => {
    const element = arrayElement(type);
    const dimensions = (type.length - element.length) / 2;
    const primitive = DEX_PRIMITIVES.get(element);
    if (primitive !== undefined)
        return { dimensions, element: primitive, className: false };
    const alias = mapping.residualAliases.get(element);
    if (alias === null)
        return undefined;
    return { dimensions, element: alias ?? element, className: true };
};
/** Match directly within the caller's descriptor without expanding alias strings. */
const matchResidualType = (mapping, type, observed, offset) => {
    const resolved = residualType(mapping, type);
    if (resolved === undefined)
        return undefined;
    const length = resolved.dimensions +
        resolved.element.length +
        (resolved.className ? 2 : 0);
    if (length > observed.length - offset)
        return undefined;
    let cursor = offset;
    for (let index = 0; index < resolved.dimensions; index++)
        if (observed.charCodeAt(cursor++) !== 91)
            return undefined;
    if (resolved.className && observed.charCodeAt(cursor++) !== 76)
        return undefined;
    for (let index = 0; index < resolved.element.length; index++) {
        const code = resolved.element.charCodeAt(index);
        if (observed.charCodeAt(cursor++) !== (code === 46 ? 47 : code))
            return undefined;
    }
    if (resolved.className && observed.charCodeAt(cursor++) !== 59)
        return undefined;
    return cursor;
};
/** Each successful comparison consumes observed bytes, bounding prototype work. */
const matchesResidualDescriptor = (mapping, record, observed) => {
    if (record.residual !== undefined)
        return record.residual === observed;
    if (!observed.startsWith("("))
        return false;
    let cursor = 1;
    for (const type of record.mapped.parameter_types) {
        const end = matchResidualType(mapping, type, observed, cursor);
        if (end === undefined)
            return false;
        cursor = end;
    }
    return (observed[cursor] === ")" &&
        matchResidualType(mapping, record.mapped.return_type, observed, cursor + 1) === observed.length);
};
/** Resolve an observed raw class name; several records are ambiguous. */
export const resolveProguardClass = (mapping, rawName, limits = {}) => {
    const records = mapping.classes.get(rawName) ?? [];
    const [only] = records;
    if (only === undefined)
        return { status: "unmapped" };
    if (records.length === 1)
        return {
            status: "mapped",
            mapped: { name: only.name },
            verified_by: "class",
        };
    return {
        status: "ambiguous",
        reason: "multiple-records",
        candidate_count: records.length,
        candidates: records
            .slice(0, limits.candidates ?? PROGUARD_MAPPING_LIMITS.candidates)
            .map(({ name }) => ({ name })),
    };
};
/** Shared fail-closed member rule: only one identity-verified candidate maps. */
const resolveMember = (query, verifier, sampleLimit) => {
    const candidates = [];
    const verified = [];
    let count = 0;
    let verifiedCount = 0;
    let conflict = false;
    let only;
    for (const owner of query.records) {
        for (const record of query.candidates(owner)) {
            count++;
            if (candidates.length < sampleLimit)
                candidates.push(record.mapped);
            conflict ||= record.residualConflict;
            if (query.records.length > 1 ||
                record.residualConflict ||
                !query.matches(record))
                continue;
            verifiedCount++;
            only = record.mapped;
            if (verified.length < sampleLimit)
                verified.push(record.mapped);
        }
    }
    if (count === 0)
        return { status: "unmapped" };
    if (query.records.length > 1)
        return {
            status: "ambiguous",
            reason: "ambiguous-class",
            candidate_count: count,
            candidates,
        };
    if (conflict)
        return {
            status: "ambiguous",
            reason: "residual-signature-conflict",
            candidate_count: count,
            candidates,
        };
    if (only !== undefined && verifiedCount === 1)
        return { status: "mapped", mapped: only, verified_by: verifier };
    return verifiedCount > 1
        ? {
            status: "ambiguous",
            reason: "multiple-records",
            candidate_count: verifiedCount,
            candidates: verified,
        }
        : {
            status: "ambiguous",
            reason: query.mismatch,
            candidate_count: count,
            candidates,
        };
};
/** Resolve an observed raw method by its DEX prototype; names alone never map. */
export const resolveProguardMethod = (mapping, observed, limits = {}) => resolveMember({
    records: mapping.classes.get(observed.className) ?? [],
    candidates: (record) => record.methods.get(observed.name) ?? [],
    matches: (record) => matchesResidualDescriptor(mapping, record, observed.descriptor),
    mismatch: "descriptor-mismatch",
}, "descriptor", limits.candidates ?? PROGUARD_MAPPING_LIMITS.candidates);
/** Resolve an observed raw field by its DEX type; names alone never map. */
export const resolveProguardField = (mapping, observed, limits = {}) => resolveMember({
    records: mapping.classes.get(observed.className) ?? [],
    candidates: (record) => record.fields.get(observed.name) ?? [],
    matches: (record) => record.residual !== undefined
        ? record.residual === observed.type
        : matchResidualType(mapping, record.mapped.type, observed.type, 0) ===
            observed.type.length,
    mismatch: "type-mismatch",
}, "type", limits.candidates ?? PROGUARD_MAPPING_LIMITS.candidates);
