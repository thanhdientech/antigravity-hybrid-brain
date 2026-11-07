/** Whether bytes start with a standalone Godot PCK header. */
export const hasGodotPckHeader = (bytes) => bytes.length >= 4 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x44 &&
    bytes[2] === 0x50 &&
    bytes[3] === 0x43;
/** Decode declared fields after the caller admits a complete 20-byte header. */
export const readGodotPckHeaderFacts = (bytes) => {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return {
        formatVersion: view.getUint32(4, true),
        engineMajor: view.getUint32(8, true),
        engineMinor: view.getUint32(12, true),
        enginePatch: view.getUint32(16, true),
    };
};
/** Decode an admitted complete 12-byte trailer and its host-sized source extent. */
export const readGodotPckTrailerFacts = (trailer, fileSize) => {
    if (!hasGodotPckHeader(trailer.subarray(8, 12)))
        return { state: "absent" };
    const view = new DataView(trailer.buffer, trailer.byteOffset, trailer.byteLength);
    const packBytes = view.getBigUint64(0, true);
    const end = fileSize - 12;
    return {
        state: "declared",
        packBytes,
        start: packBytes > BigInt(end) ? null : end - Number(packBytes),
        end,
    };
};
