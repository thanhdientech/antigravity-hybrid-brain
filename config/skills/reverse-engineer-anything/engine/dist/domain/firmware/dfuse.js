import { crc32 } from "node:zlib";
import { err, ok } from "../result.js";
/** "DfuSe", bVersion, DFUImageSize and bTargets (ST UM0391). */
const PREFIX_BYTES = 11;
/** "Target", bAlternateSetting, bTargetNamed, szTargetName, dwTargetSize, dwNbElements. */
const TARGET_PREFIX_BYTES = 274;
const TARGET_NAME_OFFSET = 11;
const TARGET_NAME_BYTES = 255;
/** dwElementAddress and dwElementSize. */
const ELEMENT_HEADER_BYTES = 8;
/** bcdDevice, idProduct, idVendor, bcdDFU, "UFD", bLength and dwCRC (DFU 1.1). */
export const DFUSE_SUFFIX_BYTES = 16;
const DFUSE_VERSION = 1;
const DFU_SUFFIX_VERSION = 0x011a;
const ADDRESS_SPACE = 0x1_0000_0000;
/** Elements named in one limitation before the rest are counted. */
const NAMED_ELEMENTS = 4;
const SIGNATURE = [0x44, 0x66, 0x75, 0x53, 0x65];
const TARGET_SIGNATURE = [0x54, 0x61, 0x72, 0x67, 0x65, 0x74];
const SUFFIX_SIGNATURE = [0x55, 0x46, 0x44];
/**
 * Fixed whole-file ceiling, as for Intel HEX; configurable ceilings are
 * tracked in #6176. The decoder holds the file once and slices elements from it.
 */
export const DFUSE_MAX_FILE_BYTES = 128 * 1024 * 1024;
/** Non-empty elements retained as inventory entries, as for UF2 regions. */
export const DFUSE_MAX_ELEMENTS = 65_536;
const readUint16 = (bytes, offset) => (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8);
const readUint32 = (bytes, offset) => (readUint16(bytes, offset) | (readUint16(bytes, offset + 2) << 16)) >>> 0;
const startsWith = (bytes, offset, signature) => signature.every((byte, index) => bytes[offset + index] === byte);
const hex32 = (value) => `0x${value.toString(16).padStart(8, "0")}`;
/** Whether the leading bytes begin a DfuSe version 1 image. */
export const hasDfuSePrefix = (prefix) => startsWith(prefix, 0, SIGNATURE) && prefix[5] === DFUSE_VERSION;
/** Whether the final 16 bytes are a DFU 1.1a suffix, as DfuSe requires. */
const hasDfuSeSuffix = (suffix) => suffix.length === DFUSE_SUFFIX_BYTES &&
    readUint16(suffix, 6) === DFU_SUFFIX_VERSION &&
    startsWith(suffix, 8, SUFFIX_SIGNATURE) &&
    suffix[11] === DFUSE_SUFFIX_BYTES;
/**
 * Recognize a file only by the DfuSe prefix and the DFU suffix together. The
 * suffix CRC is not part of recognition: a mismatch is an integrity fact.
 */
export const isDfuSeFile = (prefix, suffix, fileBytes) => fileBytes >= PREFIX_BYTES + DFUSE_SUFFIX_BYTES &&
    hasDfuSePrefix(prefix) &&
    hasDfuSeSuffix(suffix);
/** Start a decoder that holds at most the admitted file size. */
export const createDfuSeDecoder = (fileBytes) => Number.isSafeInteger(fileBytes) &&
    fileBytes >= 0 &&
    fileBytes <= DFUSE_MAX_FILE_BYTES
    ? ok(new RetainingDfuSeDecoder(fileBytes))
    : err({
        kind: "limit",
        boundary: "file-size",
        message: `file is ${String(fileBytes)} bytes, exceeding the fixed ${String(DFUSE_MAX_FILE_BYTES)}-byte (128 MiB) ceiling`,
    });
/** The DFU suffix CRC: CRC-32 without the final inversion, over every byte before dwCRC. */
const dfuCrc = (bytes) => ~crc32(bytes) >>> 0;
const formatFailure = (offset, detail) => ({
    kind: "format",
    message: `byte offset ${String(offset)}: ${detail}`,
});
/** At most NAMED_ELEMENTS descriptions, then a count of the rest of `total`. */
const named = (items, total = items.length) => `${items.slice(0, NAMED_ELEMENTS).join("; ")}${total > NAMED_ELEMENTS ? `; and ${String(total - NAMED_ELEMENTS)} more` : ""}`;
class RetainingDfuSeDecoder {
    #bytes;
    #length = 0;
    constructor(fileBytes) {
        this.#bytes = new Uint8Array(fileBytes);
    }
    write(chunk) {
        if (this.#length + chunk.length > this.#bytes.length)
            return err({
                kind: "limit",
                boundary: "file-size",
                message: "file grew beyond its admitted size while being read",
            });
        this.#bytes.set(chunk, this.#length);
        this.#length += chunk.length;
        return ok(undefined);
    }
    finish() {
        return parseDfuSe(this.#bytes.subarray(0, this.#length));
    }
}
const parseDfuSe = (bytes) => {
    const suffixStart = bytes.length - DFUSE_SUFFIX_BYTES;
    if (bytes.length < PREFIX_BYTES + DFUSE_SUFFIX_BYTES ||
        !hasDfuSePrefix(bytes) ||
        !hasDfuSeSuffix(bytes.subarray(suffixStart)))
        return err(formatFailure(0, "the file does not begin with a DfuSe prefix and end with a DFU 1.1a suffix"));
    // UM0391 calls DFUImageSize the file length, which dfu-util's dfuse-pack.py
    // writes since ee6b393d (2020-10-08). Earlier dfuse-pack.py and MicroPython's
    // tools/dfu.py write the length before the suffix.
    const imageSize = readUint32(bytes, 6);
    const suffixCrc = readUint32(bytes, suffixStart + 12);
    const computedCrc = dfuCrc(bytes.subarray(0, bytes.length - 4));
    if (imageSize !== suffixStart && imageSize !== bytes.length)
        return err(formatFailure(6, `DFUImageSize declares ${String(imageSize)} bytes, but the DFU suffix begins at byte ${String(suffixStart)} and the file holds ${String(bytes.length)} bytes; the suffix CRC ${suffixCrc === computedCrc ? "matches" : "does not match"} the file`));
    const targetCount = bytes[10] ?? 0;
    const walk = new TargetWalk(bytes, suffixStart);
    let offset = PREFIX_BYTES;
    for (let targetIndex = 0; targetIndex < targetCount; targetIndex += 1) {
        const next = walk.target(targetIndex, offset);
        if (!next.ok)
            return next;
        offset = next.value;
    }
    if (offset !== suffixStart)
        return err(formatFailure(offset, `${String(targetCount)} target(s) end at byte ${String(offset)}, but the DFU suffix begins at byte ${String(suffixStart)}`));
    const { elements } = walk;
    const overlaps = overlappingElements(elements);
    return ok({
        metadata: {
            kind: "dfuse",
            image_size: imageSize,
            target_count: targetCount,
            element_count: walk.elementCount,
            empty_element_count: walk.emptyElements,
            overlapping_element_count: overlaps.length,
            data_bytes: elements.reduce((sum, element) => sum + element.bytes.length, 0),
            device_version: readUint16(bytes, suffixStart),
            product_id: readUint16(bytes, suffixStart + 2),
            vendor_id: readUint16(bytes, suffixStart + 4),
            suffix_crc: suffixCrc,
            computed_crc: computedCrc,
        },
        elements,
        limitations: [
            ...(overlaps.length === 0
                ? []
                : [
                    `${String(overlaps.length)} DfuSe element(s) overlap an earlier element of the same alternate setting; each stays a separate entry and no bytes were merged: ${named(overlaps)}.`,
                ]),
            ...(walk.unlistedCount === 0
                ? []
                : [
                    `DfuSe declarations without bytes have no entry: ${named(walk.unlisted, walk.unlistedCount)}.`,
                ]),
        ],
    });
};
/** Targets and elements in file order; every size is checked against its container. */
class TargetWalk {
    bytes;
    suffixStart;
    elements = [];
    /**
     * The first NAMED_ELEMENTS empty elements and element-less targets, which no
     * entry can show. A file can hold millions of empty elements, so the rest
     * are only counted in `unlistedCount`.
     */
    unlisted = [];
    unlistedCount = 0;
    elementCount = 0;
    emptyElements = 0;
    constructor(bytes, suffixStart) {
        this.bytes = bytes;
        this.suffixStart = suffixStart;
    }
    /** Parse one target at `offset`; the result is the offset after its elements. */
    target(targetIndex, offset) {
        const { bytes } = this;
        if (offset + TARGET_PREFIX_BYTES > this.suffixStart)
            return err(formatFailure(offset, `target ${String(targetIndex)} prefix needs ${String(TARGET_PREFIX_BYTES)} bytes, but the image ends at byte ${String(this.suffixStart)}`));
        if (!startsWith(bytes, offset, TARGET_SIGNATURE))
            return err(formatFailure(offset, `target ${String(targetIndex)} does not begin with the "Target" signature`));
        const targetSize = readUint32(bytes, offset + 266);
        const declaredElements = readUint32(bytes, offset + 270);
        const bodyStart = offset + TARGET_PREFIX_BYTES;
        const bodyEnd = bodyStart + targetSize;
        if (bodyEnd > this.suffixStart)
            return err(formatFailure(offset + 266, `target ${String(targetIndex)} declares ${String(targetSize)} bytes, but the image ends at byte ${String(this.suffixStart)}`));
        const target = {
            targetIndex,
            alternateSetting: bytes[offset + 6] ?? 0,
            targetName: readUint32(bytes, offset + 7) === 0
                ? null
                : latin1UntilNul(bytes.subarray(offset + TARGET_NAME_OFFSET, offset + TARGET_NAME_OFFSET + TARGET_NAME_BYTES)),
        };
        if (declaredElements === 0)
            this.#unlisted(() => `target ${String(targetIndex)} (alternate setting ${String(target.alternateSetting)}) declares no elements`);
        let position = bodyStart;
        for (let index = 0; index < declaredElements; index += 1) {
            const next = this.#element(target, index, position, bodyEnd);
            if (!next.ok)
                return next;
            position = next.value;
        }
        return position === bodyEnd
            ? ok(bodyEnd)
            : err(formatFailure(position, `target ${String(targetIndex)} declares ${String(targetSize)} bytes, but its ${String(declaredElements)} element(s) end ${String(bodyEnd - position)} bytes earlier`));
    }
    #element(target, elementIndex, position, bodyEnd) {
        const name = `target ${String(target.targetIndex)} element ${String(elementIndex)}`;
        if (position + ELEMENT_HEADER_BYTES > bodyEnd)
            return err(formatFailure(position, `${name} header lies beyond the target's end at byte ${String(bodyEnd)}`));
        const address = readUint32(this.bytes, position);
        const size = readUint32(this.bytes, position + 4);
        const dataOffset = position + ELEMENT_HEADER_BYTES;
        if (dataOffset + size > bodyEnd)
            return err(formatFailure(position + 4, `${name} declares ${String(size)} bytes, but its target ends at byte ${String(bodyEnd)}`));
        if (address + size > ADDRESS_SPACE)
            return err(formatFailure(position, `${name} at ${hex32(address)} with ${String(size)} bytes wraps past 0xffffffff`));
        if (size > 0 && this.elements.length >= DFUSE_MAX_ELEMENTS)
            return err({
                kind: "limit",
                boundary: "capacity",
                message: `byte offset ${String(position)}: the file holds more than ${String(DFUSE_MAX_ELEMENTS)} elements with bytes, the most retained as entries`,
            });
        this.elementCount += 1;
        if (size === 0) {
            this.emptyElements += 1;
            this.#unlisted(() => `${name} at ${hex32(address)} (alternate setting ${String(target.alternateSetting)}) holds no bytes`);
        }
        else
            this.elements.push({
                ...target,
                elementIndex,
                address,
                dataOffset,
                bytes: this.bytes.subarray(dataOffset, dataOffset + size),
            });
        return ok(dataOffset + size);
    }
    /** Count a declaration without bytes; describe only the first few. */
    #unlisted(describe) {
        this.unlistedCount += 1;
        if (this.unlisted.length < NAMED_ELEMENTS)
            this.unlisted.push(describe());
    }
}
/** szTargetName is a fixed field; bytes after the first NUL are padding. */
const latin1UntilNul = (field) => {
    const end = field.indexOf(0);
    return String.fromCharCode(...field.subarray(0, end < 0 ? field.length : end));
};
const elementText = (element) => `target ${String(element.targetIndex)} element ${String(element.elementIndex)} (${hex32(element.address)}-${hex32(element.address + element.bytes.length - 1)})`;
/** Elements that overlap an earlier one in address order within one alternate setting. */
const overlappingElements = (elements) => {
    const ordered = [...elements].sort((left, right) => left.alternateSetting - right.alternateSetting ||
        left.address - right.address);
    const overlaps = [];
    let reach;
    for (const element of ordered) {
        if (reach !== undefined &&
            reach.alternateSetting === element.alternateSetting &&
            element.address < reach.address + reach.bytes.length)
            overlaps.push(`${elementText(element)} overlaps ${elementText(reach)} in alternate setting ${String(element.alternateSetting)}`);
        if (reach === undefined ||
            reach.alternateSetting !== element.alternateSetting ||
            element.address + element.bytes.length >
                reach.address + reach.bytes.length)
            reach = element;
    }
    return overlaps;
};
