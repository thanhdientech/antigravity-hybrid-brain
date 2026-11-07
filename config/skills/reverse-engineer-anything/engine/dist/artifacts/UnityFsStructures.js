import { ArtifactReaderFailure } from "./ArtifactReader.js";
import { readArtifactFileBytes } from "./ArtifactFileRange.js";
import { decodeLz4Block } from "../gpu/Lz4Block.js";
import { BinaryFormatFailure, BinaryResourceFailure, } from "../native/metadata/BinaryContainer.js";
import { assertArtifactReadActive } from "./ArtifactFileOperation.js";
import { setImmediate } from "node:timers/promises";
import { readUnityFsHeaderFacts, UNITYFS_COMPRESSION_LZ4, UNITYFS_COMPRESSION_LZ4HC, UNITYFS_COMPRESSION_NONE, UNITYFS_FLAG_BLOCKS_INFO_AT_END, UNITYFS_FLAG_COMPRESSION_MASK, UNITYFS_FORMAT_VERSION_MAX, UNITYFS_FORMAT_VERSION_MIN, UNITYFS_HEADER_STRING_MAX, UNITYFS_SIGNATURE, unityFsLayoutFlags, } from "../domain/unityfsFormat.js";
/** Per-decode resource limits, not format limits. Plain blocks are streamed. */
const MAX_BLOCK_UNCOMPRESSED_BYTES = 64 * 1024 * 1024;
const MAX_BLOCK_ENCODED_BYTES = MAX_BLOCK_UNCOMPRESSED_BYTES +
    Math.floor(MAX_BLOCK_UNCOMPRESSED_BYTES / 255) +
    16;
const MAX_TABLE_BYTES = 16 * 1024 * 1024;
const DIRECTORY_BUDGET_BYTES = 64 * 1024 * 1024;
const directoryLimit = () => new ArtifactReaderFailure("limit", "UnityFS directory exceeds its 16 MiB buffer or 64 MiB representation budget", { boundary: "memory" });
/** Reserve buffers, JS rows and escaped path projections before constructing them. */
class UnityFsDirectoryBudget {
    #remaining = DIRECTORY_BUDGET_BYTES;
    reserve(bytes) {
        if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.#remaining)
            throw directoryLimit();
        this.#remaining -= bytes;
    }
}
/** Signature, version, two bounded strings and the fixed tail; reads are bounded. */
const HEADER_PREFIX_MAX = 8 + 4 + UNITYFS_HEADER_STRING_MAX * 2 + 20;
const UTF8 = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
export const unityFsFormatFailure = (detail) => new ArtifactReaderFailure("format", `UnityFS is malformed: ${detail}`);
const align16 = (value) => (value + 15) & ~15;
/** Decode header fields once; unsupported content does not erase observed headers. */
export const readUnityFsHeader = async (handle, size, signal) => {
    const prefix = await readArtifactFileBytes(handle, 0, Math.min(size, HEADER_PREFIX_MAX), size, signal);
    if (prefix.length < 20 || !prefix.subarray(0, 8).equals(UNITYFS_SIGNATURE))
        return undefined;
    const facts = readUnityFsHeaderFacts(prefix);
    if (facts === undefined)
        throw unityFsFormatFailure("header is truncated or exceeds its bounds");
    if (facts.formatVersion < UNITYFS_FORMAT_VERSION_MIN ||
        facts.formatVersion > UNITYFS_FORMAT_VERSION_MAX)
        throw new ArtifactReaderFailure("unavailable", `UnityFS format ${String(facts.formatVersion)} is unsupported; ${String(UNITYFS_FORMAT_VERSION_MIN)}-${String(UNITYFS_FORMAT_VERSION_MAX)} are supported`);
    if (facts.declaredSize > BigInt(size))
        throw unityFsFormatFailure("declared size exceeds the file");
    const blocksInfoAtEnd = (facts.flags & UNITYFS_FLAG_BLOCKS_INFO_AT_END) !== 0;
    if (blocksInfoAtEnd && facts.compressedBlocksInfoSize > size)
        throw unityFsFormatFailure("declared blocks-info exceeds the file");
    const compression = facts.flags & UNITYFS_FLAG_COMPRESSION_MASK;
    const common = {
        formatVersion: facts.formatVersion,
        playerVersion: facts.playerVersion,
        engineVersion: facts.engineVersion,
        declaredSize: Number(facts.declaredSize),
        flags: facts.flags,
        compressedBlocksInfoSize: facts.compressedBlocksInfoSize,
        uncompressedBlocksInfoSize: facts.uncompressedBlocksInfoSize,
        blocksInfoAtEnd,
        compression,
    };
    const layout = unityFsLayoutFlags(facts.formatVersion, facts.engineVersion, facts.flags);
    if (layout.encrypted === true)
        return { ...common, layout: { status: "encrypted" } };
    if (layout.encrypted === undefined ||
        layout.headerAligned === undefined ||
        layout.dataPadding === undefined)
        return { ...common, layout: { status: "unsupported-layout" } };
    if (compression !== UNITYFS_COMPRESSION_NONE &&
        compression !== UNITYFS_COMPRESSION_LZ4 &&
        compression !== UNITYFS_COMPRESSION_LZ4HC)
        return { ...common, layout: { status: "unsupported-compression" } };
    const position = layout.headerAligned
        ? align16(facts.afterFixed)
        : facts.afterFixed;
    return {
        ...common,
        layout: {
            status: "available",
            afterHeader: position,
            blocksInfoOffset: blocksInfoAtEnd
                ? size - facts.compressedBlocksInfoSize
                : position,
            dataPadding: layout.dataPadding,
        },
    };
};
const decodeBlocksInfoTable = async (header, compressed, signal) => {
    const compression = header.compression;
    if (compression === UNITYFS_COMPRESSION_NONE) {
        if (compressed.length !== header.uncompressedBlocksInfoSize)
            throw unityFsFormatFailure("plain directory size disagrees with its declaration");
        return compressed;
    }
    if (compression === UNITYFS_COMPRESSION_LZ4 ||
        compression === UNITYFS_COMPRESSION_LZ4HC)
        return decodeUnityFsLz4(compressed, header.uncompressedBlocksInfoSize, signal);
    throw new ArtifactReaderFailure("unavailable", `UnityFS blocks-info compression ${String(compression)} is unsupported`);
};
/** Translate decoder failures once, without erasing cancellation or resource reasons. */
export const decodeUnityFsLz4 = async (encoded, expected, signal) => {
    try {
        return await decodeLz4Block(encoded, expected, signal);
    }
    catch (cause) {
        if (cause instanceof ArtifactReaderFailure)
            throw cause;
        if (cause instanceof BinaryResourceFailure)
            throw new ArtifactReaderFailure("limit", "UnityFS LZ4 exceeds the decoder memory budget", { cause, boundary: "memory" });
        if (cause instanceof BinaryFormatFailure)
            throw new ArtifactReaderFailure("format", "UnityFS is malformed: LZ4 block does not decode to its declared size", { cause });
        throw cause;
    }
};
const parseBlocks = async (table, budget, signal) => {
    if (table.length < 24)
        throw unityFsFormatFailure("blocks-info table is truncated");
    const blockCount = table.readUInt32BE(16);
    if (20 + blockCount * 10 + 4 > table.length)
        throw unityFsFormatFailure("declared block count exceeds the table");
    // Includes array slots, numeric fields and the retained lookup representation.
    budget.reserve(blockCount * 256);
    const blocks = [];
    let cursor = 20;
    let compressedStart = 0;
    let streamStart = 0;
    let unavailableCount = 0;
    for (let index = 0; index < blockCount; index++) {
        if (index % 256 === 0)
            await setImmediate();
        assertArtifactReadActive(signal);
        const uncompressedSize = table.readUInt32BE(cursor);
        const compressedSize = table.readUInt32BE(cursor + 4);
        const flags = table.readUInt16BE(cursor + 8);
        const compression = flags & UNITYFS_FLAG_COMPRESSION_MASK;
        cursor += 10;
        const lz4 = compression === UNITYFS_COMPRESSION_LZ4 ||
            compression === UNITYFS_COMPRESSION_LZ4HC;
        if (lz4 &&
            (uncompressedSize > MAX_BLOCK_UNCOMPRESSED_BYTES ||
                compressedSize > MAX_BLOCK_ENCODED_BYTES))
            throw new ArtifactReaderFailure("limit", "UnityFS LZ4 block exceeds its 64 MiB decoded or bounded encoded buffer budget", { boundary: "memory" });
        if (compression === UNITYFS_COMPRESSION_NONE &&
            compressedSize !== uncompressedSize)
            throw unityFsFormatFailure("plain block size disagrees with its declaration");
        if (uncompressedSize > 0 &&
            compression !== UNITYFS_COMPRESSION_NONE &&
            !lz4)
            unavailableCount++;
        if (compression !== UNITYFS_COMPRESSION_NONE && compressedSize === 0)
            throw unityFsFormatFailure("compressed block declares no bytes");
        blocks.push({
            uncompressedSize,
            compressedSize,
            flags,
            compression,
            unavailableCount,
            compressedStart,
            streamStart,
        });
        compressedStart += compressedSize;
        streamStart += uncompressedSize;
    }
    return blocks;
};
const parseNodes = async (table, blocks, budget, signal) => {
    let cursor = 20 + blocks.length * 10;
    if (cursor + 4 > table.length)
        throw unityFsFormatFailure("node count is missing from the table");
    const nodeCount = table.readUInt32BE(cursor);
    cursor += 4;
    if (cursor + nodeCount * 21 > table.length)
        throw unityFsFormatFailure("declared node count exceeds the table");
    // Covers parsed rows plus the reader's owned entries/map; paths are charged separately.
    budget.reserve(nodeCount * 512);
    const streamSize = blocks.length === 0
        ? 0
        : (blocks[blocks.length - 1]?.streamStart ?? 0) +
            (blocks[blocks.length - 1]?.uncompressedSize ?? 0);
    const nodes = [];
    for (let index = 0; index < nodeCount; index++) {
        if (index % 256 === 0)
            await setImmediate();
        assertArtifactReadActive(signal);
        if (cursor + 20 > table.length)
            throw unityFsFormatFailure("node fixed fields are truncated");
        const offsetBig = table.readBigUInt64BE(cursor);
        const sizeBig = table.readBigUInt64BE(cursor + 8);
        const flags = table.readUInt32BE(cursor + 16);
        cursor += 20;
        const nameEnd = table.indexOf(0, cursor);
        if (nameEnd === -1)
            throw unityFsFormatFailure("node path is unterminated");
        // UTF-16 plus repeated JSON-escaped source/canonical path projections.
        budget.reserve((nameEnd - cursor) * 24);
        let path;
        try {
            path = UTF8.decode(table.subarray(cursor, nameEnd));
        }
        catch (cause) {
            throw new ArtifactReaderFailure("format", "UnityFS node path is not valid UTF-8", { cause });
        }
        cursor = nameEnd + 1;
        // Preserve the source spelling; ArtifactPaths owns destination validation.
        if (path.length === 0)
            throw unityFsFormatFailure("empty member path");
        if (offsetBig > BigInt(streamSize) ||
            sizeBig > BigInt(streamSize) - offsetBig)
            throw unityFsFormatFailure(`member exceeds the stream: ${path}`);
        nodes.push({
            offset: Number(offsetBig),
            size: Number(sizeBig),
            flags,
            path,
        });
    }
    return nodes;
};
const resolveDataStart = (header, blocks, size) => {
    const layout = header.layout;
    if (layout.status !== "available")
        throw new ArtifactReaderFailure("unavailable", "UnityFS directory layout is unavailable");
    let dataStart = header.blocksInfoAtEnd
        ? layout.afterHeader
        : layout.blocksInfoOffset + header.compressedBlocksInfoSize;
    if (layout.dataPadding)
        dataStart = align16(dataStart);
    const compressedTotal = blocks.reduce((total, block) => total + block.compressedSize, 0);
    const dataEnd = header.blocksInfoAtEnd ? layout.blocksInfoOffset : size;
    if (dataStart < 0 || dataStart + compressedTotal > dataEnd)
        throw unityFsFormatFailure("declared data area exceeds the file");
    return dataStart;
};
export const readUnityFsBlocksInfo = async (handle, header, size, signal) => {
    const layout = header.layout;
    if (layout.status !== "available")
        throw new ArtifactReaderFailure("unavailable", "UnityFS directory layout is unavailable");
    if (header.compressedBlocksInfoSize > MAX_TABLE_BYTES ||
        header.uncompressedBlocksInfoSize > MAX_TABLE_BYTES)
        throw directoryLimit();
    const budget = new UnityFsDirectoryBudget();
    budget.reserve(header.compressedBlocksInfoSize);
    if (header.compression !== UNITYFS_COMPRESSION_NONE)
        budget.reserve(header.uncompressedBlocksInfoSize);
    const compressed = await readArtifactFileBytes(handle, layout.blocksInfoOffset, header.compressedBlocksInfoSize, size, signal);
    const table = await decodeBlocksInfoTable(header, compressed, signal);
    if (table.length < 20)
        throw unityFsFormatFailure("blocks-info table is truncated");
    const blocks = await parseBlocks(table, budget, signal);
    const nodes = await parseNodes(table, blocks, budget, signal);
    return {
        dataHash: table.subarray(0, 16).toString("hex"),
        blocks,
        nodes,
        dataStart: resolveDataStart(header, blocks, size),
    };
};
