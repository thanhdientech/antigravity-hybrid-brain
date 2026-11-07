const identities = (values, pythonVersion, headerBytes = 16) => values.map((magic) => [magic, { pythonVersion, headerBytes }]);
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
/** Pinned identities include archive reconstruction and standalone decoder inputs. */
const PYTHON_BYTECODE_IDENTITIES = new Map([
    ...identities([3390, 3391], "3.7", 12),
    ...identities([3392, 3393, 3394], "3.7"),
    ...identities([3400, 3401, 3410, 3411, 3412, 3413], "3.8"),
    ...identities(range(3420, 3425), "3.9"),
    ...identities(range(3430, 3439), "3.10"),
    ...identities([3494, 3495], "3.11"),
    ...identities(range(3500, 3531), "3.12"),
    ...identities(range(3550, 3571), "3.13"),
    ...identities([3627], "3.14"),
]);
export const pythonBytecodeIdentity = (magic) => PYTHON_BYTECODE_IDENTITIES.get(magic) ?? null;
/** Borrow the source prefix; a CR LF trailer establishes framing even for unknown magic. */
export const observePythonBytecodePrefix = (bytes) => {
    const prefix = bytes.subarray(0, 4);
    const magic = prefix.byteLength < 2
        ? null
        : new DataView(prefix.buffer, prefix.byteOffset, prefix.byteLength).getUint16(0, true);
    if (prefix.byteLength < 4 || magic === null)
        return { state: "incomplete", prefix, magic, identity: null };
    if (prefix[2] !== 0x0d || prefix[3] !== 0x0a)
        return { state: "invalid-crlf", prefix, magic, identity: null };
    return {
        state: "framed",
        prefix,
        magic,
        identity: pythonBytecodeIdentity(magic),
    };
};
