import { err, ok } from "../result.js";
/** Fixed section/section_64 facts; mapping, zero-fill and display policies belong to callers. */
export const readMachoSectionHeader = (bytes, wide, littleEndian) => {
    if (bytes.byteLength < (wide ? 80 : 68))
        return err({
            kind: "malformed",
            message: "Mach-O section header is truncated",
        });
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return ok({
        nameBytes: Buffer.from(bytes.subarray(0, 16)),
        segmentNameBytes: Buffer.from(bytes.subarray(16, 32)),
        address: wide
            ? view.getBigUint64(32, littleEndian)
            : BigInt(view.getUint32(32, littleEndian)),
        size: wide
            ? view.getBigUint64(40, littleEndian)
            : BigInt(view.getUint32(36, littleEndian)),
        offset: view.getUint32(wide ? 48 : 40, littleEndian),
        flags: view.getUint32(wide ? 64 : 56, littleEndian),
    });
};
