import { err, ok } from "./result.js";
/** Decode format identity without requiring mapping fields or directories. */
export const readPeOptionalHeaderIdentity = (bytes) => {
    if (bytes.byteLength < 2)
        return err({
            kind: "malformed",
            reason: "truncated-magic",
            message: "truncated PE optional header",
        });
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const magic = view.getUint16(0, true);
    if (magic !== 0x10b && magic !== 0x20b)
        return err({
            kind: "unsupported",
            reason: "unsupported-magic",
            message: "Only PE32 and PE32+ image optional headers are supported",
        });
    const bits = magic === 0x20b ? 64 : 32;
    return ok({ magic, bits, format: bits === 64 ? "pe32-plus" : "pe32" });
};
/** Decode mapping fields without requiring a directory count or table. */
export const readPeOptionalHeaderFixedFields = (bytes) => {
    const identity = readPeOptionalHeaderIdentity(bytes);
    if (!identity.ok)
        return identity;
    const { bits } = identity.value;
    const directoryOffset = bits === 64 ? 112 : 96;
    if (bytes.byteLength < 64)
        return err({
            kind: "malformed",
            reason: "truncated-fixed-fields",
            message: "truncated PE optional header",
        });
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return ok({
        ...identity.value,
        imageBase: bits === 64
            ? view.getBigUint64(24, true)
            : BigInt(view.getUint32(28, true)),
        sectionAlignment: view.getUint32(32, true),
        fileAlignment: view.getUint32(36, true),
        sizeOfImage: view.getUint32(56, true),
        sizeOfHeaders: view.getUint32(60, true),
        directoryOffset,
        directoryCountOffset: directoryOffset - 4,
    });
};
const readDirectory = (view, offset) => ({
    address: view.getUint32(offset, true),
    size: view.getUint32(offset + 4, true),
    offset,
});
/** Observe one declared entry independently of the availability of later entries. */
export const readPeOptionalHeaderDirectory = (bytes, fixed, index) => {
    if (bytes.byteLength < fixed.directoryOffset)
        return { state: "count-unavailable" };
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const count = view.getUint32(fixed.directoryCountOffset, true);
    if (index >= count)
        return { state: "absent", count };
    const offset = fixed.directoryOffset + index * 8;
    if (offset > bytes.byteLength - 8)
        return { state: "truncated", count };
    return {
        state: "present",
        count,
        directory: readDirectory(view, offset),
    };
};
/** Decode the complete declared table without admitting a machine or directory address. */
export const readPeOptionalHeaderStructure = (bytes) => {
    const parsed = readPeOptionalHeaderFixedFields(bytes);
    if (!parsed.ok)
        return parsed;
    const fixed = parsed.value;
    if (bytes.byteLength < fixed.directoryOffset)
        return err({
            kind: "malformed",
            reason: "truncated-fixed-fields",
            message: "truncated PE optional header",
        });
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const directoryCount = view.getUint32(fixed.directoryCountOffset, true);
    if (directoryCount > Math.floor((bytes.byteLength - fixed.directoryOffset) / 8))
        return err({
            kind: "malformed",
            reason: "truncated-directory-table",
            message: "truncated PE data-directory table",
        });
    const dataDirectories = Array.from({ length: directoryCount }, (_, index) => readDirectory(view, fixed.directoryOffset + index * 8));
    return ok({ ...fixed, directoryCount, dataDirectories });
};
