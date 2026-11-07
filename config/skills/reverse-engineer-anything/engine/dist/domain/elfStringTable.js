/** Observe one ELF string-table entry without treating a bounded missing NUL as absence. */
export const observeElfStringTableEntry = (table, offset, maximumBytes) => {
    if (offset < 0 || offset >= table.length)
        return { state: "outside", bytes: null, examinedBytes: 0, contentBytes: 0 };
    const window = table.subarray(offset, offset + maximumBytes);
    const end = window.indexOf(0);
    if (end < 0)
        return {
            state: "truncated",
            bytes: null,
            examinedBytes: window.length,
            contentBytes: window.length,
        };
    return {
        state: "terminated",
        bytes: window.subarray(0, end),
        examinedBytes: end + 1,
        contentBytes: end,
    };
};
/** Project admitted source bytes without inferring an original text encoding. */
export const elfStringTableText = (observed) => observed.bytes?.toString("latin1") ?? null;
