// The shipped bundle has tens of headings. These ceilings bound object count
// and UTF-16 text retained by a complete index before allocating section text.
// Own text needs no ceiling of its own: each code unit has exactly one owner.
const MAX_SECTIONS = 4096;
// ATX has at most six enclosing levels over the admitted 4 MiB bundle.
const MAX_EXPANDED_CHARACTERS = 6 * 4_194_304;
const blank = (value) => value === " " || value === "\t";
/** ATX closing hashes and ASCII whitespace, scanned once from each end. */
const headingTitle = (raw) => {
    let start = 0;
    let end = raw.length;
    while (start < end && blank(raw[start]))
        start += 1;
    while (end > start && blank(raw[end - 1]))
        end -= 1;
    let hashes = end;
    while (hashes > start && raw[hashes - 1] === "#")
        hashes -= 1;
    if (hashes < end && (hashes === start || blank(raw[hashes - 1]))) {
        end = hashes;
        while (end > start && blank(raw[end - 1]))
            end -= 1;
    }
    return raw.slice(start, end);
};
const atxHeading = (line) => {
    const match = /^ {0,3}(#{1,6})(?:[ \t]+(.*)|$)/u.exec(line);
    if (match?.[1] === undefined)
        return undefined;
    const raw = match[2] ?? "";
    // Closing hashes need whitespace; literal C# and escaped hashes survive.
    const title = headingTitle(raw);
    return { level: match[1].length, title };
};
const readHeadings = (content, remaining) => {
    const headings = [];
    const enclosing = [];
    let fence;
    let start = 0;
    while (start < content.length) {
        const newline = content.indexOf("\n", start);
        const end = newline < 0 ? content.length : newline;
        const line = content.slice(start, end);
        const fenceMatch = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line);
        const marker = fenceMatch?.[1];
        if (fence !== undefined) {
            if (marker?.[0] === fence.marker &&
                marker.length >= fence.length &&
                /^[ \t]*$/u.test(fenceMatch?.[2] ?? ""))
                fence = undefined;
        }
        else if (marker !== undefined &&
            !(marker[0] === "`" && fenceMatch?.[2]?.includes("`"))) {
            fence = { marker: marker[0] ?? "", length: marker.length };
        }
        else {
            const parsed = atxHeading(line);
            if (parsed !== undefined) {
                if (headings.length >= remaining)
                    return undefined;
                while ((enclosing.at(-1)?.level ?? 0) >= parsed.level) {
                    const parent = enclosing.pop();
                    if (parent !== undefined)
                        parent.end = start;
                }
                const heading = {
                    ...parsed,
                    start,
                    end: content.length,
                    ordinal: headings.length,
                    parent: enclosing.at(-1)?.ordinal,
                };
                headings.push(heading);
                enclosing.push(heading);
            }
        }
        start = newline < 0 ? content.length : newline + 1;
    }
    return headings;
};
/**
 * Bound the whole bundle before materializing an expanded section index.
 * Sections are returned in document order, so subsections follow their parent.
 */
export const parseGuidanceSections = (files) => {
    const documents = [];
    let count = 0;
    let expanded = 0;
    for (const [guide, content] of files) {
        const headings = readHeadings(content, MAX_SECTIONS - count);
        if (headings === undefined)
            return undefined;
        count += headings.length;
        for (const heading of headings) {
            expanded += heading.end - heading.start;
            if (expanded > MAX_EXPANDED_CHARACTERS)
                return undefined;
        }
        documents.push({ guide, content, headings });
    }
    const sections = [];
    for (const { guide, content, headings } of documents) {
        const guideSections = [];
        for (const [ordinal, heading] of headings.entries()) {
            // The next heading of any level ends this section's own text: it is
            // either the first subsection or the end of the whole section.
            const ownEnd = headings[ordinal + 1]?.start ?? heading.end;
            const section = {
                guide,
                ordinal,
                heading: heading.title,
                content: content.slice(heading.start, heading.end).trim(),
                ownContent: content.slice(heading.start, ownEnd).trim(),
                parent: heading.parent === undefined
                    ? undefined
                    : guideSections[heading.parent],
            };
            guideSections.push(section);
            sections.push(section);
        }
    }
    return sections;
};
