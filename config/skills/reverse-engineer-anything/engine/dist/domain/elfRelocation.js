import { err, ok } from "./result.js";
/** Decode standard REL/RELA fields; architecture-specific application remains with consumers. */
export function readElfRelocationEntry(bytes, bits, littleEndian, encoding) {
    const wordBytes = bits === 64 ? 8 : 4;
    if (bytes.byteLength < wordBytes * (encoding === "rela" ? 3 : 2))
        return err({
            kind: "malformed",
            message: "ELF relocation entry is truncated",
        });
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const offset = bits === 64
        ? view.getBigUint64(0, littleEndian)
        : BigInt(view.getUint32(0, littleEndian));
    const info = bits === 64
        ? view.getBigUint64(wordBytes, littleEndian)
        : BigInt(view.getUint32(wordBytes, littleEndian));
    const entry = {
        offset,
        type: Number(info & (bits === 64 ? 0xffffffffn : 0xffn)),
        symbolIndex: Number(info >> (bits === 64 ? 32n : 8n)),
    };
    if (encoding === "rel")
        return ok(entry);
    const addend = bits === 64
        ? view.getBigInt64(wordBytes * 2, littleEndian)
        : BigInt(view.getInt32(wordBytes * 2, littleEndian));
    return ok({ ...entry, addend });
}
