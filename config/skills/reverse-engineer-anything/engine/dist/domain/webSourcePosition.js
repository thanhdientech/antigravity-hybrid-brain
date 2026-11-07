/** Resolve a selected position against actual text without splitting the whole source. */
export const resolveWebSourcePosition = (text, position) => {
    if (!Number.isSafeInteger(position.line) ||
        position.line < 1 ||
        !Number.isSafeInteger(position.column) ||
        position.column < 0)
        return undefined;
    let line = 1;
    let start = 0;
    for (const boundary of text.matchAll(/\r\n?|\n|\u2028|\u2029/gu)) {
        if (line === position.line)
            return column(start, boundary.index, position);
        line += 1;
        start = boundary.index + boundary[0].length;
    }
    return line === position.line
        ? column(start, text.length, position)
        : { field: "line", maximum: line };
};
const column = (start, end, position) => position.column <= end - start
    ? { offset: start + position.column }
    : { field: "column", maximum: end - start };
/** Verify a selected position against actual text without splitting the whole source. */
export const webSourceOffset = (text, position) => {
    const resolved = resolveWebSourcePosition(text, position);
    return resolved !== undefined && "offset" in resolved
        ? resolved.offset
        : undefined;
};
