import { crc32 } from "node:zlib";
import { err, ok } from "./result.js";
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const IHDR_TYPE = Buffer.from("IHDR");
/** PNG signature recognition does not establish image validity. */
export const hasPngSignature = (bytes) => bytes.subarray(0, 8).equals(PNG_SIGNATURE);
/** Decode IHDR declarations and admit dimensions; encoding support belongs to consumers. */
export const readPngIhdrFacts = (data) => {
    if (data.length !== 13)
        return err("Invalid PNG header");
    const width = data.readUInt32BE(0);
    const height = data.readUInt32BE(4);
    if (width === 0 ||
        height === 0 ||
        width > 0x7fff_ffff ||
        height > 0x7fff_ffff)
        return err("Invalid PNG header");
    return ok({
        width,
        height,
        bitDepth: data[8],
        colorType: data[9],
        compressionMethod: data[10],
        filterMethod: data[11],
        interlaceMethod: data[12],
    });
};
/** Read screenshot dimensions from a byte-faithful PNG header, not a full image decode. */
export const readPngHeaderDimensions = (bytes) => {
    if (bytes.byteLength < 33 ||
        !hasPngSignature(bytes) ||
        bytes.readUInt32BE(8) !== 13 ||
        !bytes.subarray(12, 16).equals(IHDR_TYPE) ||
        crc32(bytes.subarray(12, 29)) !== bytes.readUInt32BE(29))
        return undefined;
    const facts = readPngIhdrFacts(bytes.subarray(16, 29));
    return facts.ok
        ? { width: facts.value.width, height: facts.value.height }
        : undefined;
};
