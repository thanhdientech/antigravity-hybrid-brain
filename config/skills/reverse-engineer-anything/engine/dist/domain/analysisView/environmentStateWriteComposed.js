import { ownMember, same, scalarText, } from "./environmentStateRules.js";
import { COPY_MIN_LENGTH } from "./environmentStateWriteCopies.js";
import { GENERATED } from "./environmentStateWriteGenerated.js";
import { joinsAfter, joinsBefore, readClock, slugOf, slugSpellings, zoneMinutesForFormat, } from "./environmentStateWriteValues.js";
import { CLOCK_PATTERNS, clockDigits, } from "./environmentStateWriteClockFormats.js";
/** Rules whose field holds a value the call or serving decides, which a created composed string may show. */
const SOURCES = new Set([
    ...GENERATED,
    "echo",
    "copy",
    "path",
    "slug",
    "clock",
]);
/** The text a part spells from written fields; undefined when its field holds nothing it can spell. */
export const composedPartText = (part, fields) => {
    if ("text" in part)
        return part.text;
    const value = ownMember(fields, part.from);
    if (part.as === "clock")
        return clockDigits(value, part.pattern);
    if (part.as === "value")
        return scalarText(value);
    return typeof value === "string" ? slugOf(value, part.ampersand) : undefined;
};
/** A composed string spelled from written fields, or undefined when a part has nothing to spell. */
export const composedValue = (parts, fields) => {
    let text = "";
    for (const part of parts) {
        const spelled = composedPartText(part, fields);
        if (spelled === undefined)
            return undefined;
        text += spelled;
    }
    return text;
};
/** The texts a field's value offers: itself and its slug when long enough to show it, and a clock's calendar digits. */
const candidatesOf = (field, value, shortest) => {
    const candidates = [];
    const text = scalarText(value);
    if (text !== undefined && text.length >= shortest)
        candidates.push({ token: text, part: { from: field, as: "value" } });
    if (typeof value === "string")
        for (const { slug, ampersand } of slugSpellings(value))
            if (slug !== value && slug.length >= COPY_MIN_LENGTH)
                candidates.push({
                    token: slug,
                    part: {
                        from: field,
                        as: "slug",
                        ...(ampersand === undefined ? {} : { ampersand }),
                    },
                });
    if (readClock(value) !== undefined)
        for (const pattern of CLOCK_PATTERNS) {
            const digits = clockDigits(value, pattern);
            if (digits !== undefined)
                candidates.push({
                    token: digits,
                    part: { from: field, as: "clock", pattern },
                });
        }
    return candidates;
};
const indexed = (candidates) => {
    const byToken = new Map();
    for (const candidate of candidates) {
        const same = byToken.get(candidate.token);
        if (same === undefined)
            byToken.set(candidate.token, [candidate]);
        else
            same.push(candidate);
    }
    const lengths = [...new Set(candidates.map(({ token }) => token.length))];
    return { byToken, lengths: lengths.sort((left, right) => right - left) };
};
/** The longest candidates whose text starts at a position and ends at a delimiter. */
const matchesAt = (text, at, index) => {
    if (joinsBefore(text, at))
        return [];
    for (const length of index.lengths) {
        if (at + length > text.length || joinsAfter(text, at + length))
            continue;
        const matches = index.byToken.get(text.slice(at, at + length));
        if (matches !== undefined)
            return matches;
    }
    return [];
};
/** Parts with each slug of a source holding no `&` spelling it as the word, or undefined when no such slug part exists. */
const ampersandWord = (parts, entity) => {
    let changed = false;
    const spelled = parts.map((part) => {
        if (!("as" in part) || part.as !== "slug" || part.ampersand !== undefined)
            return part;
        const source = ownMember(entity, part.from);
        if (typeof source === "string" && source.includes("&"))
            return part;
        changed = true;
        return { ...part, ampersand: "and" };
    });
    return changed ? spelled : undefined;
};
/** More ways to read one string than this leave it unexplained. */
const MAX_SEGMENTATIONS = 8;
/**
 * Literal text around the longest delimited candidate at each position, left to right: one reading per choice where
 * sources serving could tell apart spell the same text, which other entities then tell apart. Empty when no candidate
 * shows, or the choices exceed `MAX_SEGMENTATIONS`. `alike` names parts serving fills with one value.
 */
const segmentations = (text, index, alike) => {
    let readings = [[]];
    let literal = "";
    let shown = false;
    for (let at = 0; at < text.length;) {
        const matches = matchesAt(text, at, index);
        if (matches.length === 0) {
            literal += text[at];
            at += 1;
            continue;
        }
        // Stop at the cap before comparing or allocating more, however many sources spell the text.
        const choices = [];
        for (const { part } of matches)
            if (!choices.some((choice) => alike(choice, part))) {
                choices.push(part);
                if (readings.length * choices.length > MAX_SEGMENTATIONS)
                    return [];
            }
        const lead = literal === "" ? [] : [{ text: literal }];
        readings = readings.flatMap((parts) => choices.map((choice) => [...parts, ...lead, choice]));
        literal = "";
        shown = true;
        at += matches[0].token.length;
    }
    if (!shown)
        return [];
    return literal === ""
        ? readings
        : readings.map((parts) => [...parts, { text: literal }]);
};
const samePart = (left, right) => left.from === right.from &&
    left.as === right.as &&
    (left.as !== "clock" ||
        right.as !== "clock" ||
        left.pattern === right.pattern) &&
    (left.as !== "slug" ||
        right.as !== "slug" ||
        left.ampersand === right.ampersand);
/** How many entities holding the field and what its parts read spell it as the parts do, or undefined when one holds it otherwise, a non-string value included. */
const heldSpellings = (parts, field, held) => {
    let agreeing = 0;
    for (const entity of held) {
        if (!Object.hasOwn(entity, field))
            continue;
        const spelled = composedValue(parts, entity);
        if (spelled === undefined)
            continue;
        if (spelled !== entity[field])
            return undefined;
        agreeing += 1;
    }
    return agreeing;
};
/**
 * For a created entity, each string field rebuilt from literal text and the fields other rules write, when it shows
 * at least one and the type's other entities spell it the same way, at least one of them: one call alone cannot show
 * which text is literal.
 */
export const createdComposer = (entity, rules, held) => {
    // Serving stamps every clock a create writes with the one write clock, so their digits in one zone are one source.
    const zones = new Map(rules.flatMap((rule) => rule.rule === "clock"
        ? [
            [
                rule.field,
                rule.format.kind === "iso"
                    ? zoneMinutesForFormat(rule.format.zone)
                    : 0,
            ],
        ]
        : []));
    const alike = (left, right) => samePart(left, right) ||
        (left.as === "clock" &&
            right.as === "clock" &&
            left.pattern === right.pattern &&
            zones.has(left.from) &&
            zones.get(left.from) === zones.get(right.from));
    let index;
    return (field) => {
        const text = ownMember(entity, field);
        if (typeof text !== "string")
            return undefined;
        index ??= indexed(rules.flatMap((rule) => SOURCES.has(rule.rule)
            ? candidatesOf(rule.field, ownMember(entity, rule.field), 
            // A generated value is short and still the call's own, as a template's is.
            GENERATED.has(rule.rule) ? 1 : COPY_MIN_LENGTH)
            : []));
        const fits = segmentations(text, index, alike).flatMap((parts) => {
            if (parts.some((part) => "from" in part && part.from === field))
                return [];
            // A slug whose source here holds no `&` spells it as the held entities do.
            const spelled = [parts, ampersandWord(parts, entity)].find((candidate) => candidate !== undefined &&
                (heldSpellings(candidate, field, held) ?? 0) > 0);
            return spelled === undefined ? [] : [spelled];
        });
        return fits.length === 1
            ? { field, rule: "composed", parts: fits[0] }
            : undefined;
    };
};
/**
 * An unsent string field an update rebuilt from literal text and fields serving knows, members stored as sent and those
 * the call left as they were: the same parts spell it before the call and on the type's other entities.
 */
export const composedChange = (field, entity) => {
    const { before, after, sent, idField } = entity;
    const text = ownMember(after, field);
    if (typeof text !== "string" || typeof ownMember(before, field) !== "string")
        return undefined;
    const known = Object.keys(after).filter((other) => other !== field &&
        (Object.hasOwn(sent, other)
            ? same(sent[other], after[other])
            : Object.hasOwn(before, other) && same(before[other], after[other])));
    const index = indexed(known.flatMap((other) => candidatesOf(other, ownMember(after, other), other === idField ? 1 : COPY_MIN_LENGTH)));
    const fits = segmentations(text, index, samePart).filter((parts) => composedValue(parts, before) === ownMember(before, field) &&
        heldSpellings(parts, field, entity.others) !== undefined);
    return fits.length === 1
        ? { field, rule: "composed", parts: fits[0] }
        : undefined;
};
