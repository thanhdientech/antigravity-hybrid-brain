import { observeMzWindowsHeader } from "../dosMz.js";
import { createHash } from "node:crypto";
import { readPeOptionalHeaderFixedFields } from "../peOptionalHeader.js";
import { readPeCoffHeader } from "../peCoffHeader.js";
import { readPeSectionHeader } from "../peSectionHeader.js";
import { AnalysisInputError, AnalysisResourceConstraintError, } from "../analysisErrorCore.js";
import { NativeAotAdmissionError, nativeAotHydrationFacts, nativeAotHydrationReason, WINDOWS_IMAGE_LOADER_SECTION_LIMIT, } from "./nativeAotReason.js";
const RTR_SIGNATURE = 0x00525452;
const RTR_ROW_SIZE = 24;
const RTR_ROW_TYPE = 1;
const DEHYDRATED_DATA = 207;
const FROZEN_OBJECT_REGION = 206;
export const NATIVE_AOT_MAX_SOURCE_BYTES = 128 * 1024 * 1024;
/** Bound one parser-produced JSON report independently of any transport. */
export const NATIVE_AOT_MAX_REPORT_BYTES = 4 * 1024 * 1024;
export const NATIVE_AOT_MAX_WORK_UNITS = 64 * 1024 * 1024;
export const NATIVE_AOT_MAX_WORKING_MEMORY_BYTES = 64 * 1024 * 1024;
/** Version of the built-in read-only PE metadata interpretation in profiles. */
export const NATIVE_AOT_PROFILE_CONTRACT_REVISION = "rtr-9.1-x64-pe-read-only-v8";
export const DEFAULT_NATIVE_AOT_PARSER_LIMITS = {
    sourceBytes: NATIVE_AOT_MAX_SOURCE_BYTES,
    workUnits: NATIVE_AOT_MAX_WORK_UNITS,
    workingMemoryBytes: NATIVE_AOT_MAX_WORKING_MEMORY_BYTES,
};
class NativeAotParserBudget {
    limits;
    workUnits = 0;
    workingMemoryBytes = 0;
    workingMemoryBytesPeak = 0;
    truncationReason;
    constructor(limits) {
        this.limits = limits;
    }
    consumeWork(bytes) {
        if (!Number.isSafeInteger(bytes) ||
            bytes < 0 ||
            bytes > this.limits.workUnits - this.workUnits) {
            this.truncationReason ??= "work-unit-budget";
            return false;
        }
        this.workUnits += bytes;
        return true;
    }
    reserveWorkingMemory(bytes) {
        if (!Number.isSafeInteger(bytes) ||
            bytes < 0 ||
            bytes > this.limits.workingMemoryBytes - this.workingMemoryBytes) {
            this.truncationReason ??= "working-memory-budget";
            return false;
        }
        this.workingMemoryBytes += bytes;
        this.workingMemoryBytesPeak = Math.max(this.workingMemoryBytesPeak, this.workingMemoryBytes);
        return true;
    }
    releaseWorkingMemory(bytes) {
        this.workingMemoryBytes = Math.max(0, this.workingMemoryBytes - bytes);
    }
}
/** Source-byte identity mismatch retained for adapter-specific recovery. */
export class NativeAotSnapshotIdentityError extends Error {
    expectedSha256;
    observedSha256;
    constructor(expectedSha256, observedSha256) {
        super(`NativeAOT snapshot digest does not match the admitted artifact identity: expected ${expectedSha256}, observed ${observedSha256}`);
        this.expectedSha256 = expectedSha256;
        this.observedSha256 = observedSha256;
        this.name = "NativeAotSnapshotIdentityError";
    }
}
/** Hydration stops by throwing; other scans record truncation and continue. */
class NativeAotParserBudgetError extends Error {
    budget;
    code = "parser_budget";
    constructor(budget) {
        super(budget);
        this.budget = budget;
        this.name = "NativeAotParserBudgetError";
    }
}
const parserBudgetExhausted = (budget) => {
    throw new NativeAotParserBudgetError(budget);
};
const nativeAotHydrationFailure = (cause) => {
    if (cause instanceof NativeAotParserBudgetError)
        return nativeAotHydrationFacts(cause.budget === "work" ? "work_budget" : "working_memory_budget");
    if (cause instanceof NativeAotAdmissionError &&
        cause.reason.code === "hydration_failed")
        return nativeAotHydrationFacts(cause.reason.detail, cause.reason.command);
    throw cause;
};
const reportBudgetRefusal = (code, maximumSummaryBytes) => new AnalysisResourceConstraintError("parse_native_aot_pe", "capacity", code, { maximum_summary_bytes: maximumSummaryBytes }, {
    diagnostics: { code },
    retryable: false,
});
// Compatible PE loaders use raw size when VirtualSize is zero. Otherwise,
// RVA containment follows the declared VirtualSize, independent of file size.
const virtualExtent = (section) => section.virtualSize === 0 ? section.rawSize : section.virtualSize;
const fileBackedVirtualExtent = (section) => Math.min(virtualExtent(section), section.rawSize);
const METHOD_TABLE_RECORD_BYTES = 32;
class MethodTableIndex {
    budget;
    #records = Buffer.alloc(0);
    #count = 0;
    #includedCount = 0;
    constructor(budget) {
        this.budget = budget;
    }
    get count() {
        return this.#count;
    }
    get includedCount() {
        return this.#includedCount;
    }
    append(table) {
        if (!this.#ensureCapacity(this.#count + 1))
            return false;
        const offset = this.#count * METHOD_TABLE_RECORD_BYTES;
        this.#records.writeBigUInt64LE(table.address, offset);
        this.#records.writeUInt32LE(table.flags, offset + 8);
        this.#records.writeUInt32LE(table.baseSize, offset + 12);
        this.#records.writeBigUInt64LE(table.related, offset + 16);
        this.#records.writeUInt16LE(table.slotsCount, offset + 24);
        this.#records.writeUInt16LE(table.interfacesCount, offset + 26);
        this.#records.writeUInt8(0, offset + 28);
        this.#records.writeUInt8(0, offset + 29);
        this.#records.writeUInt16LE(0, offset + 30);
        this.#count++;
        return true;
    }
    at(index) {
        if (!Number.isSafeInteger(index) || index < 0 || index >= this.#count)
            return undefined;
        const offset = index * METHOD_TABLE_RECORD_BYTES;
        return {
            address: this.#records.readBigUInt64LE(offset),
            flags: this.#records.readUInt32LE(offset + 8),
            baseSize: this.#records.readUInt32LE(offset + 12),
            related: this.#records.readBigUInt64LE(offset + 16),
            slotsCount: this.#records.readUInt16LE(offset + 24),
            interfacesCount: this.#records.readUInt16LE(offset + 26),
        };
    }
    isIncluded(index) {
        return (index >= 0 &&
            index < this.#count &&
            this.#records.readUInt8(index * METHOD_TABLE_RECORD_BYTES + 28) !== 0);
    }
    include(index) {
        if (!this.isIncluded(index)) {
            this.#records.writeUInt8(1, index * METHOD_TABLE_RECORD_BYTES + 28);
            this.#includedCount++;
        }
    }
    /** Index validated related pointers once, then visit every reachable table once. */
    includeReachable(root, image) {
        const storageBytes = this.#count * 3 * Int32Array.BYTES_PER_ELEMENT;
        if (!this.budget.reserveWorkingMemory(storageBytes))
            return false;
        try {
            if (!this.budget.consumeWork(this.#count * 8))
                return false;
            const storage = new Int32Array(this.#count * 3);
            const children = storage.subarray(0, this.#count).fill(-1);
            const next = storage.subarray(this.#count, this.#count * 2).fill(-1);
            const queue = storage.subarray(this.#count * 2);
            for (let index = 0; index < this.#count; index += 1) {
                const related = this.#records.readBigUInt64LE(index * METHOD_TABLE_RECORD_BYTES + 16);
                if (related === 0n)
                    continue;
                const parent = this.find(related, this.budget);
                if (this.budget.truncationReason !== undefined)
                    return false;
                if (parent >= 0) {
                    next[index] = children[parent] ?? -1;
                    children[parent] = index;
                }
            }
            let read = 0;
            let write = 0;
            const include = (index) => {
                if (this.isIncluded(index))
                    return;
                this.include(index);
                queue[write++] = index;
            };
            include(root);
            while (read < write) {
                const baseIndex = queue[read++] ?? -1;
                const base = this.at(baseIndex);
                if (base === undefined)
                    continue;
                for (let child = children[baseIndex] ?? -1; child >= 0; child = next[child] ?? -1) {
                    if (!this.budget.consumeWork(8))
                        return false;
                    include(child);
                }
                for (let index = 0; index < base.interfacesCount; index += 1) {
                    if (!this.budget.consumeWork(8))
                        return false;
                    const address = readU64(image.read(base.address + 24n + BigInt((base.slotsCount + index) * 8), 8));
                    if (address === null)
                        continue;
                    const interfaceIndex = this.find(address, this.budget);
                    if (this.budget.truncationReason !== undefined)
                        return false;
                    if (interfaceIndex >= 0)
                        include(interfaceIndex);
                }
            }
            return true;
        }
        finally {
            this.budget.releaseWorkingMemory(storageBytes);
        }
    }
    find(address, budget) {
        let low = 0;
        let high = this.#count;
        while (low < high) {
            if (!budget.consumeWork(8))
                return -1;
            const middle = low + ((high - low) >>> 1);
            const record = middle * METHOD_TABLE_RECORD_BYTES;
            const candidate = this.#records.readBigUInt64LE(record);
            if (candidate < address)
                low = middle + 1;
            else
                high = middle;
        }
        return low < this.#count &&
            this.#records.readBigUInt64LE(low * METHOD_TABLE_RECORD_BYTES) === address
            ? low
            : -1;
    }
    forEach(callback) {
        for (let index = 0; index < this.#count; index++) {
            const table = this.at(index);
            if (table !== undefined)
                callback(table, index);
        }
    }
    forEachIncluded(callback) {
        for (let index = 0; index < this.#count; index++) {
            if (!this.isIncluded(index))
                continue;
            const table = this.at(index);
            if (table !== undefined)
                callback(table, index);
        }
    }
    #ensureCapacity(requiredRecords) {
        const requiredBytes = requiredRecords * METHOD_TABLE_RECORD_BYTES;
        if (requiredBytes <= this.#records.byteLength)
            return true;
        const capacityBytes = Math.min(this.budget.limits.workingMemoryBytes, Math.max(requiredBytes, this.#records.byteLength * 2 || 4096));
        if (capacityBytes < requiredBytes ||
            !this.budget.reserveWorkingMemory(capacityBytes))
            return false;
        const expanded = Buffer.allocUnsafe(capacityBytes);
        this.#records.copy(expanded, 0, 0, this.#count * METHOD_TABLE_RECORD_BYTES);
        this.budget.releaseWorkingMemory(this.#records.byteLength);
        this.#records = expanded;
        return true;
    }
}
export const nativeAotSnapshotOverCapacity = (sha256, sourceBytesAtLeast, maximumSummaryBytes, limits = DEFAULT_NATIVE_AOT_PARSER_LIMITS) => assertNativeAotReportFits({
    format: "dotnet-nativeaot",
    status: "partial",
    reason: {
        code: "source_byte_budget",
        limit_bytes: limits.sourceBytes,
        observed_bytes: sourceBytesAtLeast,
        runtime_override: false,
    },
    analysis_artifact_sha256: sha256,
    analysis_mode: "read-only-derived-overlay",
    header_address: null,
    discovery: null,
    format_major: null,
    format_minor: null,
    method_tables: 0,
    types: [],
    frozen_strings: [],
    truncated: true,
    types_omitted: 0,
    frozen_strings_omitted: 0,
    output_budget_bytes: maximumSummaryBytes,
    derived_overlay: null,
    derived_memory: null,
    coverage: {
        pointer_candidates_examined: 0,
        scan_bytes_examined: 0,
        scan_bytes_omitted: 0,
        method_table_validation_items_examined: 0,
        work_units_examined: 0,
        method_tables_recovered: 0,
        frozen_string_candidates: 0,
        frozen_scan_bytes_examined: 0,
        frozen_scan_bytes_omitted: 0,
        frozen_string_data_bytes_examined: 0,
        source_bytes_examined: 0,
        work_budget_units: limits.workUnits,
        source_byte_budget_bytes: limits.sourceBytes,
        working_memory_budget_bytes: limits.workingMemoryBytes,
        working_memory_bytes_peak: 0,
        truncation_reason: "source-byte-budget",
        basis: "unsupported-layout",
    },
    diagnostics: ["source_byte_budget"],
    limitations: [
        "NativeAOT metadata was not inspected because the captured snapshot exceeded the local source-byte budget.",
        "The artifact digest identifies the selected target; no metadata facts are inferred from the omitted snapshot.",
        "No Ghidra database types, labels, functions, or bytes are created or changed.",
    ],
}, maximumSummaryBytes);
const assertNativeAotReportFits = (report, maximumBytes) => {
    if (!Number.isSafeInteger(maximumBytes) ||
        maximumBytes < 0 ||
        Buffer.byteLength(JSON.stringify(report)) > maximumBytes)
        throw reportBudgetRefusal("report_budget_too_small", maximumBytes);
    return report;
};
const parsedSummary = (summary, maximumBytes) => ({
    summary: assertNativeAotReportFits(summary, maximumBytes),
    readTypeDetail: () => undefined,
});
class PeImage {
    imageBase;
    sizeOfImage;
    sections;
    #bytes;
    #sizeOfHeaders;
    #machine;
    #overlays = [];
    #budget;
    constructor(bytes) {
        this.#bytes = bytes;
        if (bytes.length < 0x40 || bytes.toString("latin1", 0, 2) !== "MZ")
            throw new NativeAotAdmissionError({ code: "not_pe_image" });
        const observed = observeMzWindowsHeader(bytes);
        if (observed.state !== "declared" || observed.signature !== "PE")
            throw new NativeAotAdmissionError({ code: "mz_header_not_pe" });
        const peOffset = observed.offset;
        if (peOffset < 0x40)
            throw new NativeAotAdmissionError({ code: "pe_header_overlaps_dos" });
        this.#range(peOffset, 24);
        const coff = readPeCoffHeader(bytes.subarray(peOffset + 4, peOffset + 24));
        if (!coff.ok)
            throw new NativeAotAdmissionError({ code: "coff_header_truncated" });
        this.#machine = coff.value.machine;
        const { sectionCount: count, optionalHeaderSize: optionalSize } = coff.value;
        // Microsoft documents a 96-section Windows image-loader limit. This
        // parser accepts executable PE images, not arbitrary COFF object files.
        if (count > WINDOWS_IMAGE_LOADER_SECTION_LIMIT)
            throw new NativeAotAdmissionError({
                code: "section_limit",
                limit: WINDOWS_IMAGE_LOADER_SECTION_LIMIT,
                observed: count,
            });
        const optional = peOffset + 24;
        this.#range(optional, optionalSize);
        // Mapping fields through SizeOfHeaders must belong to this header,
        // independently of whether the following file bytes are available.
        if (optionalSize < 64)
            throw new NativeAotAdmissionError({ code: "optional_header_too_short" });
        const fixed = readPeOptionalHeaderFixedFields(bytes.subarray(optional, optional + optionalSize));
        if (!fixed.ok)
            throw new NativeAotAdmissionError(fixed.error.reason === "unsupported-magic"
                ? { code: "unsupported_pe32_plus" }
                : { code: "optional_header_truncated" });
        if (fixed.value.magic !== 0x20b || this.#machine !== 0x8664)
            throw new NativeAotAdmissionError({ code: "unsupported_pe32_plus" });
        this.imageBase = fixed.value.imageBase;
        this.sizeOfImage = fixed.value.sizeOfImage;
        this.#sizeOfHeaders = fixed.value.sizeOfHeaders;
        if (count < 1 || this.sizeOfImage === 0)
            throw new NativeAotAdmissionError({ code: "unsupported_image_extent" });
        if (this.imageBase + BigInt(this.sizeOfImage) > 1n << 64n)
            throw new NativeAotAdmissionError({ code: "address_domain" });
        const sectionOffset = optional + optionalSize;
        this.#range(sectionOffset, count * 40);
        if (this.#sizeOfHeaders < sectionOffset + count * 40 ||
            this.#sizeOfHeaders > this.#bytes.length ||
            this.#sizeOfHeaders > this.sizeOfImage)
            throw new NativeAotAdmissionError({ code: "headers_do_not_fit" });
        this.sections = Array.from({ length: count }, (_, index) => {
            const p = sectionOffset + index * 40;
            const parsed = readPeSectionHeader(bytes.subarray(p, p + 40));
            if (!parsed.ok)
                throw new NativeAotAdmissionError({ code: "section_header_truncated" });
            const section = parsed.value;
            return {
                virtualSize: section.virtual_size,
                rva: section.virtual_address,
                rawSize: section.raw_size,
                rawOffset: section.offset,
                characteristics: section.characteristics,
            };
        });
        for (const section of this.sections) {
            this.#range(section.rawOffset, section.rawSize);
            if (section.rva + virtualExtent(section) > this.sizeOfImage)
                throw new NativeAotAdmissionError({ code: "section_exceeds_image" });
        }
        // Establish one virtual owner before any scan, read, permission query or
        // hydration. Empty sections own no bytes; adjacent intervals remain valid.
        const mapped = this.sections
            .filter((section) => virtualExtent(section) > 0)
            .sort((left, right) => left.rva - right.rva);
        let mappedEnd = this.#sizeOfHeaders;
        for (const section of mapped) {
            if (section.rva < mappedEnd)
                throw new NativeAotAdmissionError({ code: "virtual_section_overlap" });
            mappedEnd = section.rva + virtualExtent(section);
        }
    }
    addressForRva(rva) {
        return this.imageBase + BigInt(rva);
    }
    setBudget(budget) {
        this.#budget = budget;
    }
    hasImageRange(start, end) {
        return (end >= start &&
            start >= this.imageBase &&
            end - this.imageBase <= BigInt(this.sizeOfImage));
    }
    read(address, size) {
        if (address < this.imageBase || !Number.isSafeInteger(size) || size < 0)
            return null;
        for (const overlay of this.#overlays) {
            const offset = address - overlay.base;
            if (offset >= 0n && offset <= BigInt(overlay.sizeBytes - size)) {
                const start = Number(offset);
                return overlay.bytes.subarray(start, start + size);
            }
        }
        const rva = address - this.imageBase;
        if (rva > BigInt(Number.MAX_SAFE_INTEGER))
            return null;
        const relative = Number(rva);
        if (relative < this.#sizeOfHeaders) {
            if (size > this.#sizeOfHeaders - relative ||
                relative > this.#bytes.length - size)
                return null;
            return this.#bytes.subarray(relative, relative + size);
        }
        for (const section of this.sections) {
            if (this.#budget !== undefined && !this.#budget.consumeWork(1))
                return null;
            const extent = virtualExtent(section);
            if (relative < section.rva || relative - section.rva > extent - size)
                continue;
            const delta = relative - section.rva;
            if (delta > section.rawSize - size)
                return null;
            const offset = section.rawOffset + delta;
            return this.#bytes.subarray(offset, offset + size);
        }
        return null;
    }
    // This checks executable section membership, not file-backed instruction bytes.
    isExecutable(address) {
        if (address < this.imageBase)
            return false;
        const rva = address - this.imageBase;
        for (const section of this.sections) {
            if (this.#budget !== undefined && !this.#budget.consumeWork(1))
                return false;
            if ((section.characteristics & 0x20000000) !== 0 &&
                rva >= BigInt(section.rva) &&
                rva < BigInt(section.rva + virtualExtent(section)))
                return true;
        }
        return false;
    }
    addOverlay(overlay) {
        this.#overlays.push(overlay);
    }
    virtualBytesRemaining(address) {
        if (address < this.imageBase)
            return 0;
        const rva = address - this.imageBase;
        let section;
        for (const candidate of this.sections) {
            if (this.#budget !== undefined && !this.#budget.consumeWork(1))
                return 0;
            if (rva >= BigInt(candidate.rva) &&
                rva < BigInt(candidate.rva + virtualExtent(candidate))) {
                section = candidate;
                break;
            }
        }
        return section === undefined
            ? 0
            : section.rva + virtualExtent(section) - Number(rva);
    }
    #range(offset, size) {
        if (!Number.isSafeInteger(offset) ||
            !Number.isSafeInteger(size) ||
            offset < 0 ||
            size < 0 ||
            offset > this.#bytes.length - size)
            throw new NativeAotAdmissionError({ code: "field_outside_file" });
    }
}
const hex = (value) => `0x${value.toString(16)}`;
const readU64 = (bytes, offset = 0) => bytes === null || offset > bytes.length - 8
    ? null
    : bytes.readBigUInt64LE(offset);
const readU32 = (bytes, offset = 0) => bytes === null || offset > bytes.length - 4
    ? null
    : bytes.readUInt32LE(offset);
const notApplicable = (sha, reason, basis) => ({
    format: "dotnet-nativeaot",
    status: "not_applicable",
    reason,
    analysis_artifact_sha256: sha,
    analysis_mode: "read-only-derived-overlay",
    header_address: null,
    discovery: null,
    format_major: null,
    format_minor: null,
    method_tables: 0,
    types: [],
    frozen_strings: [],
    derived_overlay: null,
    derived_memory: null,
    coverage: {
        pointer_candidates_examined: 0,
        method_tables_recovered: 0,
        frozen_string_candidates: 0,
        basis,
    },
    diagnostics: [],
    limitations: [
        "This report is derived from the admitted file snapshot; it does not define or annotate Ghidra database types.",
    ],
});
const findDirectory = (image, bytes, budget) => {
    let found = null;
    let matches = 0;
    let scanBytesExamined = 0;
    const ranges = image.sections.flatMap((section) => {
        if ((section.characteristics & 0x40000000) === 0 ||
            (section.characteristics & 0x20000000) !== 0)
            return [];
        const begin = section.rawOffset;
        const end = begin + fileBackedVirtualExtent(section);
        const first = (begin + 7) & ~7;
        const candidateBytes = first <= end - 16 ? (Math.floor((end - 16 - first) / 8) + 1) * 8 : 0;
        return [{ section, begin, end, first, candidateBytes }];
    });
    const totalScanBytes = ranges.reduce((total, range) => total + range.candidateBytes, 0);
    let truncated = false;
    scan: for (const { section, begin, end, first } of ranges) {
        for (let offset = first; offset <= end - 16; offset += 8) {
            if (!budget.consumeWork(8)) {
                truncated = true;
                break scan;
            }
            scanBytesExamined += 8;
            if (bytes.readUInt32LE(offset) !== RTR_SIGNATURE)
                continue;
            if (!budget.consumeWork(16)) {
                truncated = true;
                break scan;
            }
            const count = bytes.readUInt16LE(offset + 12);
            if (bytes.readUInt8(offset + 14) !== RTR_ROW_SIZE ||
                bytes.readUInt8(offset + 15) !== RTR_ROW_TYPE ||
                count < 1 ||
                offset > end - (16 + count * RTR_ROW_SIZE))
                continue;
            const rows = [];
            let valid = true;
            for (let row = 0; row < count; row++) {
                if (!budget.consumeWork(RTR_ROW_SIZE)) {
                    truncated = true;
                    break scan;
                }
                const p = offset + 16 + row * RTR_ROW_SIZE;
                const type = bytes.readUInt32LE(p);
                const start = bytes.readBigUInt64LE(p + 8);
                const finish = bytes.readBigUInt64LE(p + 16);
                const isConsumedRange = type === FROZEN_OBJECT_REGION || type === DEHYDRATED_DATA;
                const isTypeManagerIndirection = type === 204;
                if (isConsumedRange &&
                    finish !== start &&
                    !image.hasImageRange(start, finish)) {
                    valid = false;
                    break;
                }
                if (isTypeManagerIndirection &&
                    start !== 0n &&
                    image.read(start, 8) === null) {
                    valid = false;
                    break;
                }
                if (isConsumedRange || isTypeManagerIndirection) {
                    if (rows.some((existing) => existing.type === type)) {
                        valid = false;
                        break;
                    }
                    rows.push({
                        type,
                        flags: bytes.readUInt32LE(p + 4),
                        start,
                        end: finish,
                    });
                }
            }
            if (valid) {
                matches++;
                if (found === null)
                    found = {
                        address: image.addressForRva(section.rva + offset - begin),
                        major: bytes.readUInt16LE(offset + 4),
                        minor: bytes.readUInt16LE(offset + 6),
                        sections: rows,
                    };
            }
        }
    }
    return {
        directory: found,
        matches,
        scanBytesExamined,
        scanBytesOmitted: Math.max(0, totalScanBytes - scanBytesExamined),
        truncated,
    };
};
/** One discovery owner counts only entries the validator actually examines. */
const parseMethodTable = (image, address, budget, validation) => {
    const header = image.read(address, 24);
    if (header === null)
        return null;
    const flags = header.readUInt32LE(0), baseSize = header.readUInt32LE(4), related = header.readBigUInt64LE(8);
    const elementType = (flags & 0x7c000000) >>> 26;
    if ((elementType !== 0x14 && elementType !== 0x15) ||
        baseSize < 16 ||
        baseSize > 0x10000000 ||
        (related !== 0n && image.read(related, 24) === null))
        return null;
    const slotsCount = header.readUInt16LE(16), interfacesCount = header.readUInt16LE(18);
    const tableBytes = 24 + (slotsCount + interfacesCount) * 8;
    const table = image.read(address, tableBytes);
    if (table === null)
        return null;
    for (let slot = 0; slot < slotsCount; slot++) {
        if (!budget.consumeWork(8))
            return null;
        validation.itemsExamined++;
        const target = table.readBigUInt64LE(24 + slot * 8);
        if (target !== 0n && !image.isExecutable(target))
            return null;
    }
    for (let index = 0; index < interfacesCount; index++) {
        if (!budget.consumeWork(8))
            return null;
        validation.itemsExamined++;
        const iface = table.readBigUInt64LE(24 + (slotsCount + index) * 8);
        if (iface !== 0n && image.read(iface, 20) === null)
            return null;
    }
    return { address, flags, baseSize, related, slotsCount, interfacesCount };
};
const readRelativePointer = (image, address) => {
    const raw = image.read(address, 4);
    return raw === null ? null : address + BigInt(raw.readInt32LE(0));
};
/** Exact UTF-8 length of JSON.stringify for a UTF-16 string without allocating it. */
const jsonUtf16StringBytes = (bytes, codeUnits) => {
    let total = 2;
    for (let index = 0; index < codeUnits; index++) {
        const value = bytes.readUInt16LE(index * 2);
        if (value === 0x22 || value === 0x5c)
            total += 2;
        else if (value < 0x20)
            total +=
                value === 8 ||
                    value === 9 ||
                    value === 10 ||
                    value === 12 ||
                    value === 13
                    ? 2
                    : 6;
        else if (value >= 0xd800 && value <= 0xdbff) {
            const next = index + 1 < codeUnits ? bytes.readUInt16LE((index + 1) * 2) : 0;
            if (next >= 0xdc00 && next <= 0xdfff) {
                total += 4;
                index++;
            }
            else
                total += 6;
        }
        else if (value >= 0xdc00 && value <= 0xdfff)
            total += 6;
        else if (value <= 0x7f)
            total++;
        else if (value <= 0x7ff)
            total += 2;
        else
            total += 3;
    }
    return total;
};
/** Versioned .NET 8 RTR9.1 hydration, adapted from Washi's MIT-licensed
 * `ghidra-nativeaot` at effeb734fc570c32650f88b159608979dc7b423e. The
 * MethodTable layout is cross-checked against the .NET Foundation MIT-licensed
 * MethodTable.h at runtime commit a3b2d40328be0be3f8dd43f0e5cc925b8827b044.
 * See licenses/nativeaot-parser-MIT.txt. Output is an isolated parser overlay;
 * input snapshot bytes stay immutable. */
const hydrate = (image, dehydrated, budget) => {
    const length = dehydrated.end - dehydrated.start;
    if (length < 5n ||
        length > BigInt(image.virtualBytesRemaining(dehydrated.start)))
        throw new NativeAotAdmissionError({
            code: "hydration_failed",
            detail: "length_outside_section",
        });
    const first = image.read(dehydrated.start, Number(length));
    if (first === null)
        throw new NativeAotAdmissionError({
            code: "hydration_failed",
            detail: "leaves_captured_sections",
        });
    const base = readRelativePointer(image, dehydrated.start);
    if (base === null)
        throw new NativeAotAdmissionError({
            code: "hydration_failed",
            detail: "missing_base_pointer",
        });
    const outputLimit = Math.min(image.virtualBytesRemaining(base), budget.limits.workUnits - budget.workUnits, budget.limits.workingMemoryBytes - budget.workingMemoryBytes);
    if (outputLimit === 0)
        throw new NativeAotAdmissionError({
            code: "hydration_failed",
            detail: "base_outside_mapped_sections",
        });
    let output = Buffer.alloc(Math.min(outputLimit, 64 * 1024));
    if (!budget.reserveWorkingMemory(output.byteLength))
        parserBudgetExhausted("working-memory");
    let outputLength = 0;
    let cursor = 4;
    /** Reserve the next output bytes and return a view of the retained buffer.
     * Writers must use only this view: growth replaces `output`, so a reference
     * taken before reserving would write into the superseded buffer. Every byte
     * of the view must be written because growth leaves new capacity
     * uninitialized. */
    const reserveOutput = (length) => {
        if (!Number.isSafeInteger(length) ||
            length < 0 ||
            length > outputLimit - outputLength) {
            if (length > budget.limits.workUnits - budget.workUnits)
                parserBudgetExhausted("work");
            throw new NativeAotAdmissionError({
                code: "hydration_failed",
                detail: "exceeds_mapped_section",
            });
        }
        const start = outputLength;
        const required = start + length;
        if (required > output.length) {
            const capacity = Math.min(outputLimit, Math.max(required, Math.min(outputLimit, output.length * 2 || 64 * 1024)));
            if (!budget.reserveWorkingMemory(capacity))
                parserBudgetExhausted("working-memory");
            const expanded = Buffer.allocUnsafe(capacity);
            output.copy(expanded, 0, 0, outputLength);
            budget.releaseWorkingMemory(output.byteLength);
            output = expanded;
        }
        outputLength = required;
        return output.subarray(start, required);
    };
    const append = (chunk) => {
        if (!budget.consumeWork(chunk.length))
            parserBudgetExhausted("work");
        chunk.copy(reserveOutput(chunk.length));
    };
    const appendZero = (length) => {
        if (!budget.consumeWork(length))
            parserBudgetExhausted("work");
        reserveOutput(length).fill(0);
    };
    const appendRel = (target) => {
        if (!budget.consumeWork(4))
            parserBudgetExhausted("work");
        const delta = target - (base + BigInt(outputLength));
        if (delta < -0x80000000n || delta > 0x7fffffffn)
            throw new NativeAotAdmissionError({
                code: "hydration_failed",
                detail: "relative_pointer_overflow",
            });
        reserveOutput(4).writeInt32LE(Number(delta), 0);
    };
    const appendPtr = (target) => {
        if (!budget.consumeWork(8))
            parserBudgetExhausted("work");
        // writeBigUInt64LE throws RangeError outside the unsigned 64-bit domain.
        // That is a malformed fixup, not an unexpected parser failure.
        if (target < 0n || target > 0xffffffffffffffffn)
            throw new NativeAotAdmissionError({
                code: "hydration_failed",
                detail: "pointer_outside_address_domain",
            });
        reserveOutput(8).writeBigUInt64LE(target, 0);
    };
    const readFixup = (index) => {
        const fixupLocation = dehydrated.end + BigInt(index * 4);
        const target = readRelativePointer(image, fixupLocation);
        if (target === null)
            throw new NativeAotAdmissionError({
                code: "hydration_failed",
                detail: "fixup_leaves_sections",
            });
        return target;
    };
    try {
        while (cursor < first.length) {
            if (!budget.consumeWork(1))
                parserBudgetExhausted("work");
            const encoded = first[cursor];
            if (encoded === undefined)
                break;
            cursor++;
            const command = encoded & 7;
            let payload = encoded >>> 3;
            const extraBytes = payload - 28;
            if (extraBytes > 0) {
                if (extraBytes > 3 || cursor > first.length - extraBytes)
                    throw new NativeAotAdmissionError({
                        code: "hydration_failed",
                        detail: "invalid_payload_encoding",
                    });
                payload = 0;
                for (let i = 0; i < extraBytes; i++)
                    payload += (first[cursor++] ?? 0) * 2 ** (8 * i);
                payload += 28;
            }
            switch (command) {
                case 0: {
                    if (cursor > first.length - payload)
                        throw new NativeAotAdmissionError({
                            code: "hydration_failed",
                            detail: "copy_leaves_section",
                        });
                    append(first.subarray(cursor, cursor + payload));
                    cursor += payload;
                    break;
                }
                case 1:
                    appendZero(payload);
                    break;
                case 2:
                    appendRel(readFixup(payload));
                    break;
                case 3:
                    appendPtr(readFixup(payload));
                    break;
                case 4:
                    if (!budget.consumeWork(payload * 4))
                        parserBudgetExhausted("work");
                    if (payload > Math.floor((first.length - cursor) / 4) ||
                        payload > Math.floor((outputLimit - outputLength) / 4))
                        throw new NativeAotAdmissionError({
                            code: "hydration_failed",
                            detail: "inline_relative_fixups_leave",
                        });
                    for (let i = 0; i < payload; i++) {
                        const target = readRelativePointer(image, dehydrated.start + BigInt(cursor));
                        if (target === null)
                            throw new NativeAotAdmissionError({
                                code: "hydration_failed",
                                detail: "invalid_inline_relative_pointer",
                            });
                        cursor += 4;
                        appendRel(target);
                    }
                    break;
                case 5:
                    if (!budget.consumeWork(payload * 4))
                        parserBudgetExhausted("work");
                    if (payload > Math.floor((first.length - cursor) / 4) ||
                        payload > Math.floor((outputLimit - outputLength) / 8))
                        throw new NativeAotAdmissionError({
                            code: "hydration_failed",
                            detail: "inline_pointer_fixups_leave",
                        });
                    for (let i = 0; i < payload; i++) {
                        const target = readRelativePointer(image, dehydrated.start + BigInt(cursor));
                        if (target === null)
                            throw new NativeAotAdmissionError({
                                code: "hydration_failed",
                                detail: "invalid_inline_pointer",
                            });
                        cursor += 4;
                        appendPtr(target);
                    }
                    break;
                default:
                    throw new NativeAotAdmissionError({
                        code: "hydration_failed",
                        detail: "unsupported_command",
                        command,
                    });
            }
        }
    }
    catch (cause) {
        budget.releaseWorkingMemory(output.byteLength);
        throw cause;
    }
    const hydrated = output.subarray(0, outputLength);
    const sha256 = createHash("sha256").update(hydrated).digest("hex");
    image.addOverlay({ base, sizeBytes: outputLength, sha256, bytes: hydrated });
    return { base, sizeBytes: outputLength, sha256 };
};
const discoverTables = (image, hydrated, budget) => {
    const ranges = [];
    for (const section of image.sections) {
        if ((section.characteristics & 0x40000000) === 0 ||
            (section.characteristics & 0x20000000) !== 0)
            continue;
        const extent = fileBackedVirtualExtent(section);
        if (extent > 0) {
            ranges.push({
                start: image.addressForRva(section.rva),
                end: image.addressForRva(section.rva + extent),
            });
        }
    }
    if (hydrated !== null) {
        const section = image.sections.find((candidate) => (candidate.characteristics & 0x40000000) !== 0 &&
            (candidate.characteristics & 0x20000000) === 0 &&
            hydrated.base >= image.addressForRva(candidate.rva) &&
            hydrated.base + BigInt(hydrated.sizeBytes) <=
                image.addressForRva(candidate.rva + virtualExtent(candidate)));
        if (section !== undefined)
            ranges.push({
                start: hydrated.base,
                end: hydrated.base + BigInt(hydrated.sizeBytes),
            });
    }
    ranges.sort((left, right) => (left.start < right.start ? -1 : 1));
    const merged = [];
    for (const range of ranges) {
        const previous = merged.at(-1);
        if (previous !== undefined && range.start <= previous.end) {
            if (range.end > previous.end)
                previous.end = range.end;
        }
        else {
            merged.push({ ...range });
        }
    }
    const totalScanBytes = merged.reduce((total, range) => total + Number(range.end - range.start), 0);
    let pointerCount = 0, pointerSlotsExamined = 0, scanBytesExamined = 0, truncated = false;
    const validation = { itemsExamined: 0 };
    const candidates = new MethodTableIndex(budget);
    scan: for (const range of merged) {
        let address = (range.start + 7n) & ~7n;
        while (address + 8n <= range.end) {
            if (!budget.consumeWork(8)) {
                truncated = true;
                break scan;
            }
            const value = readU64(image.read(address, 8));
            if (budget.truncationReason !== undefined) {
                truncated = true;
                break scan;
            }
            pointerSlotsExamined++;
            scanBytesExamined += 8;
            if (value !== null && value !== 0n)
                pointerCount++;
            const candidateAddress = address - 8n;
            const candidate = parseMethodTable(image, candidateAddress, budget, validation);
            if (budget.truncationReason !== undefined) {
                truncated = true;
                break scan;
            }
            if (candidate !== null && !candidates.append(candidate)) {
                truncated = true;
                break scan;
            }
            address += 8n;
        }
    }
    let objectRoot = -1;
    let objectCount = 0;
    candidates.forEach((candidate, index) => {
        if (candidate.flags !== 0x50000000 ||
            candidate.baseSize !== 0x18 ||
            candidate.related !== 0n ||
            candidate.slotsCount !== 3 ||
            candidate.interfacesCount !== 0)
            return;
        if (!budget.consumeWork(32)) {
            truncated = true;
            return;
        }
        const vtable = image.read(candidate.address + 24n, 32);
        if (vtable !== null &&
            image.isExecutable(vtable.readBigUInt64LE(0)) &&
            image.isExecutable(vtable.readBigUInt64LE(8)) &&
            image.isExecutable(vtable.readBigUInt64LE(16)) &&
            !image.isExecutable(vtable.readBigUInt64LE(24))) {
            objectRoot = index;
            objectCount++;
        }
    });
    truncated ||= budget.truncationReason !== undefined;
    if (objectCount !== 1 || objectRoot < 0 || truncated)
        return {
            tables: candidates,
            pointerCount,
            pointerSlotsExamined,
            scanBytesExamined,
            scanBytesOmitted: Math.max(0, totalScanBytes - scanBytesExamined),
            methodTableValidationItemsExamined: validation.itemsExamined,
            truncated,
        };
    truncated = !candidates.includeReachable(objectRoot, image);
    return {
        tables: candidates,
        pointerCount,
        pointerSlotsExamined,
        scanBytesExamined,
        scanBytesOmitted: Math.max(0, totalScanBytes - scanBytesExamined),
        methodTableValidationItemsExamined: validation.itemsExamined,
        truncated,
    };
};
/** Parse only the captured x64 PE snapshot. No file reads or Ghidra database writes occur here. */
export const parseNativeAotPe = (bytes, expectedSha256, maximumSummaryBytes, loadedImageBase, limits = DEFAULT_NATIVE_AOT_PARSER_LIMITS) => {
    if (!Number.isSafeInteger(maximumSummaryBytes) || maximumSummaryBytes < 0)
        throw new AnalysisInputError("parse_native_aot_pe", undefined, [
            {
                path: ["maximumSummaryBytes"],
                reason: "out_of_range",
                minimum: 0,
                ...(Number.isFinite(maximumSummaryBytes)
                    ? { observed: maximumSummaryBytes }
                    : {}),
            },
        ]);
    const invalidLimit = Object.entries(limits).find(([, limit]) => !Number.isSafeInteger(limit) || limit < 0);
    if (invalidLimit !== undefined)
        throw new AnalysisInputError("parse_native_aot_pe", undefined, [
            {
                path: ["limits", invalidLimit[0]],
                reason: "out_of_range",
                minimum: 0,
                ...(Number.isFinite(invalidLimit[1])
                    ? { observed: invalidLimit[1] }
                    : {}),
            },
        ]);
    if (bytes.byteLength > limits.sourceBytes)
        return parsedSummary(nativeAotSnapshotOverCapacity(expectedSha256, bytes.byteLength, maximumSummaryBytes, limits), maximumSummaryBytes);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    if (sha256 !== expectedSha256)
        throw new NativeAotSnapshotIdentityError(expectedSha256, sha256);
    let image;
    try {
        image = new PeImage(bytes);
    }
    catch (cause) {
        if (!(cause instanceof NativeAotAdmissionError))
            throw cause;
        return parsedSummary(notApplicable(sha256, cause.reason, "unsupported-layout"), maximumSummaryBytes);
    }
    if (loadedImageBase !== undefined &&
        BigInt(loadedImageBase) !== image.imageBase)
        return parsedSummary(notApplicable(sha256, { code: "rebased_image" }, "unsupported-layout"), maximumSummaryBytes);
    const budget = new NativeAotParserBudget(limits);
    image.setBudget(budget);
    const directorySearch = findDirectory(image, bytes, budget);
    if (directorySearch.truncated)
        return parsedSummary({
            ...notApplicable(sha256, { code: "rtr_scan_budget", runtime_override: false }, "no-rtr-header"),
            status: "partial",
            truncated: true,
            types_omitted: 0,
            frozen_strings_omitted: 0,
            output_budget_bytes: maximumSummaryBytes,
            coverage: {
                pointer_candidates_examined: 0,
                pointer_slots_examined: 0,
                scan_bytes_examined: directorySearch.scanBytesExamined,
                scan_bytes_omitted: directorySearch.scanBytesOmitted,
                rtr_signature_scan_bytes_examined: directorySearch.scanBytesExamined,
                rtr_signature_scan_bytes_omitted: directorySearch.scanBytesOmitted,
                method_tables_recovered: 0,
                frozen_string_candidates: 0,
                work_units_examined: budget.workUnits,
                work_budget_units: budget.limits.workUnits,
                source_byte_budget_bytes: budget.limits.sourceBytes,
                working_memory_budget_bytes: budget.limits.workingMemoryBytes,
                working_memory_bytes_peak: budget.workingMemoryBytesPeak,
                ...(budget.truncationReason === undefined
                    ? {}
                    : { truncation_reason: budget.truncationReason }),
                basis: "no-rtr-header",
            },
            diagnostics: ["rtr_scan_incomplete"],
        }, maximumSummaryBytes);
    if (directorySearch.directory === null && directorySearch.matches === 0)
        return parsedSummary(notApplicable(sha256, { code: "no_rtr_directory" }, "no-rtr-header"), maximumSummaryBytes);
    if (directorySearch.matches !== 1 || directorySearch.directory === null)
        return parsedSummary(notApplicable(sha256, { code: "ambiguous_rtr_directory" }, "unsupported-layout"), maximumSummaryBytes);
    const directory = directorySearch.directory;
    if (directory.major !== 9 || directory.minor !== 1)
        return parsedSummary({
            ...notApplicable(sha256, {
                code: "unsupported_rtr_version",
                format_major: directory.major,
                format_minor: directory.minor,
            }, "unsupported-layout"),
            status: "partial",
            header_address: hex(directory.address),
            discovery: "signature-heuristic",
            format_major: directory.major,
            format_minor: directory.minor,
        }, maximumSummaryBytes);
    const dehydrated = directory.sections.filter((section) => section.type === DEHYDRATED_DATA);
    if (dehydrated.length !== 1)
        return parsedSummary({
            ...notApplicable(sha256, { code: "dehydrated_section_count" }, "unsupported-layout"),
            status: "partial",
            header_address: hex(directory.address),
            discovery: "signature-heuristic",
            format_major: directory.major,
            format_minor: directory.minor,
        }, maximumSummaryBytes);
    let overlay = null;
    let hydration = null;
    try {
        overlay = hydrate(image, dehydrated[0], budget);
    }
    catch (cause) {
        hydration = nativeAotHydrationFailure(cause);
    }
    const discovered = discoverTables(image, overlay, budget);
    const frozen = directory.sections.find((section) => section.type === FROZEN_OBJECT_REGION);
    const isRecoveredStringTable = (address) => {
        const index = discovered.tables.find(address, budget);
        if (budget.truncationReason !== undefined ||
            index < 0 ||
            !discovered.tables.isIncluded(index))
            return false;
        const table = discovered.tables.at(index);
        if (table === undefined ||
            (table.flags & 0x7c000000) >>> 26 !== 0x14 ||
            table.baseSize !== 0x16 ||
            table.related === 0n)
            return false;
        const related = discovered.tables.find(table.related, budget);
        if (budget.truncationReason !== undefined)
            return false;
        return related >= 0 && discovered.tables.isIncluded(related);
    };
    const types = [];
    const frozenStrings = [];
    let frozenCandidates = 0;
    let frozenStringsOmitted = 0;
    let frozenScanBytesExamined = 0;
    let frozenStringDataBytesExamined = 0;
    let frozenScanTruncated = false;
    const frozenFirstCandidate = frozen === undefined ? 0n : (frozen.start + 7n) & ~7n;
    const frozenCandidateBound = frozen === undefined || frozen.end < frozenFirstCandidate + 14n
        ? 0
        : Number((frozen.end - 14n - frozenFirstCandidate) / 8n + 1n);
    const hydrationAttachment = hydration === null ? {} : { hydration };
    const discoveryReason = discovered.truncated && discovered.tables.includedCount === 0
        ? {
            code: "system_object_root_unproven",
            runtime_override: false,
            ...hydrationAttachment,
        }
        : discovered.tables.includedCount === 0
            ? { code: "no_system_object_root", ...hydrationAttachment }
            : hydration === null
                ? null
                : nativeAotHydrationReason(hydration);
    const reportLimitations = [
        "Only x64 PE32+ with RTR 9.1 is supported.",
        "No Ghidra database types, labels, functions, or bytes are created or changed.",
        "Names are address identities; original managed type names are unavailable.",
        "Metadata rows omitted to fit the NativeAOT report-byte budget are counted explicitly.",
        "Parser work, parser-owned typed buffers, NativeAOT report JSON, and MCP delivery have separate byte budgets; incomplete scans report examined and unexamined coverage.",
        ...(frozen === undefined
            ? ["The RTR directory has no FROZEN_OBJECT_REGION section."]
            : []),
    ];
    const reportFacts = {
        format: "dotnet-nativeaot",
        reason: discoveryReason,
        analysis_artifact_sha256: sha256,
        analysis_mode: "read-only-derived-overlay",
        header_address: hex(directory.address),
        discovery: "signature-heuristic",
        format_major: directory.major,
        format_minor: directory.minor,
        method_tables: discovered.tables.includedCount,
        output_budget_bytes: maximumSummaryBytes,
        derived_overlay: overlay === null
            ? null
            : {
                address: hex(overlay.base),
                size_bytes: overlay.sizeBytes,
                sha256: overlay.sha256,
            },
        derived_memory: null,
        diagnostics: hydration === null ? [] : [hydration.detail],
        limitations: reportLimitations,
    };
    const coverageFacts = {
        pointer_candidates_examined: discovered.pointerCount,
        pointer_slots_examined: discovered.pointerSlotsExamined,
        scan_bytes_examined: discovered.scanBytesExamined,
        scan_bytes_omitted: discovered.scanBytesOmitted,
        rtr_signature_scan_bytes_examined: directorySearch.scanBytesExamined,
        rtr_signature_scan_bytes_omitted: directorySearch.scanBytesOmitted,
        method_table_validation_items_examined: discovered.methodTableValidationItemsExamined,
        work_budget_units: budget.limits.workUnits,
        source_byte_budget_bytes: budget.limits.sourceBytes,
        working_memory_budget_bytes: budget.limits.workingMemoryBytes,
        method_tables_recovered: discovered.tables.includedCount,
        basis: overlay === null
            ? "raw-image-pointer-scan"
            : "raw-image-and-rehydrated-pointer-scan",
    };
    const budgetSkeleton = {
        ...reportFacts,
        // A later truncated report replaces a null discovery reason. Reserve the
        // longest truncation code so that replacement still fits the same budget.
        reason: discoveryReason ??
            {
                code: "truncated",
                truncation_reason: "working-memory-budget",
            },
        status: "complete",
        types: [],
        frozen_strings: [],
        truncated: true,
        types_omitted: discovered.tables.includedCount,
        frozen_strings_omitted: frozenCandidateBound,
        coverage: {
            ...coverageFacts,
            // Reserve the largest numeric encodings used by the eventual coverage
            // fields so the summary budget remains valid after frozen-region work.
            work_units_examined: budget.limits.workUnits,
            working_memory_bytes_peak: budget.limits.workingMemoryBytes,
            truncation_reason: "working-memory-budget",
            frozen_string_candidates: 0,
            frozen_scan_bytes_examined: frozenCandidateBound * 8,
            frozen_string_data_bytes_examined: frozen === undefined ? 0 : Number(frozen.end - frozen.start),
            frozen_scan_bytes_omitted: frozenCandidateBound * 8,
        },
    };
    let remainingSummaryBytes = maximumSummaryBytes - Buffer.byteLength(JSON.stringify(budgetSkeleton));
    if (remainingSummaryBytes < 0)
        throw reportBudgetRefusal("summary_exceeds_budget", maximumSummaryBytes);
    let typesOmitted = 0;
    discovered.tables.forEachIncluded((table) => {
        const row = { address: hex(table.address), type: null };
        const rowBytes = Buffer.byteLength(JSON.stringify(row)) + (types.length > 0 ? 1 : 0);
        if (rowBytes > remainingSummaryBytes) {
            typesOmitted++;
            return;
        }
        types.push(row);
        remainingSummaryBytes -= rowBytes;
    });
    if (frozen !== undefined) {
        let address = frozenFirstCandidate;
        while (address + 14n <= frozen.end) {
            if (!budget.consumeWork(8)) {
                frozenScanTruncated = true;
                break;
            }
            frozenScanBytesExamined += 8;
            const table = readU64(image.read(address, 8));
            if (table === null || !isRecoveredStringTable(table)) {
                address += 8n;
                continue;
            }
            frozenCandidates++;
            const length = readU32(image.read(address + 8n, 4));
            if (length === null || address + 14n + BigInt(length) * 2n > frozen.end) {
                address += 8n;
                continue;
            }
            const stringBytes = length * 2 + 2;
            if (!budget.consumeWork(stringBytes)) {
                frozenScanTruncated = true;
                break;
            }
            frozenStringDataBytesExamined += stringBytes;
            // NativeAOT's System.String layout is the object header, 32-bit length,
            // UTF-16 payload, then the terminating code unit. The payload starts at
            // +12, not +16 (the latter silently shifts every decoded string by two
            // characters and includes adjacent object padding).
            const raw = image.read(address + 12n, stringBytes);
            if (raw === null || raw.readUInt16LE(length * 2) !== 0) {
                address += 8n;
                continue;
            }
            if (!budget.consumeWork(stringBytes)) {
                frozenScanTruncated = true;
                break;
            }
            const rowPrefixBytes = Buffer.byteLength(JSON.stringify({ address: hex(address), value: "" }));
            const rowBytes = rowPrefixBytes -
                2 +
                jsonUtf16StringBytes(raw, length) +
                (frozenStrings.length > 0 ? 1 : 0);
            if (rowBytes > remainingSummaryBytes) {
                frozenStringsOmitted++;
                address += 8n;
                continue;
            }
            const row = {
                address: hex(address),
                value: raw.toString("utf16le", 0, length * 2),
            };
            frozenStrings.push(row);
            remainingSummaryBytes -= rowBytes;
            address += 8n;
        }
    }
    const truncated = discovered.truncated ||
        frozenScanTruncated ||
        typesOmitted > 0 ||
        frozenStringsOmitted > 0;
    const truncationReason = budget.truncationReason ??
        (typesOmitted > 0 || frozenStringsOmitted > 0
            ? "response-budget"
            : undefined);
    const partial = truncated || hydration !== null || discovered.tables.includedCount === 0;
    const publishedReason = discoveryReason ?? {
        code: "truncated",
        truncation_reason: truncationReason ?? "response-budget",
    };
    const examinedCoverage = {
        ...coverageFacts,
        work_units_examined: budget.workUnits,
        working_memory_bytes_peak: budget.workingMemoryBytesPeak,
        frozen_string_candidates: frozenCandidates,
        frozen_scan_bytes_examined: frozenScanBytesExamined,
        frozen_string_data_bytes_examined: frozenStringDataBytesExamined,
        frozen_scan_bytes_omitted: Math.max(0, frozenCandidateBound * 8 - frozenScanBytesExamined),
        ...(truncationReason === undefined
            ? {}
            : { truncation_reason: truncationReason }),
    };
    const summary = partial
        ? truncated
            ? {
                ...reportFacts,
                status: "partial",
                reason: publishedReason,
                types,
                frozen_strings: frozenStrings,
                truncated: true,
                types_omitted: typesOmitted,
                frozen_strings_omitted: frozenStringsOmitted,
                coverage: examinedCoverage,
            }
            : {
                ...reportFacts,
                status: "partial",
                reason: publishedReason,
                types,
                frozen_strings: frozenStrings,
                truncated: false,
                types_omitted: 0,
                frozen_strings_omitted: 0,
                coverage: examinedCoverage,
            }
        : {
            ...reportFacts,
            status: "complete",
            reason: null,
            types,
            frozen_strings: frozenStrings,
            truncated: false,
            types_omitted: 0,
            frozen_strings_omitted: 0,
            coverage: examinedCoverage,
        };
    if (Buffer.byteLength(JSON.stringify(summary)) > maximumSummaryBytes)
        throw reportBudgetRefusal("summary_exceeded_after_serialization", maximumSummaryBytes);
    const readTypeDetail = (address, maximumBytes) => {
        if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 0)
            return undefined;
        if (!/^0x[0-9a-f]+$/iu.test(address))
            return undefined;
        let tableAddress;
        try {
            tableAddress = BigInt(address);
        }
        catch {
            return undefined;
        }
        const detailBudget = new NativeAotParserBudget(limits);
        const tableIndex = discovered.tables.find(tableAddress, detailBudget);
        if (tableIndex < 0 || !discovered.tables.isIncluded(tableIndex))
            return undefined;
        const table = discovered.tables.at(tableIndex);
        if (table === undefined)
            return undefined;
        const metadata = {
            source: "read-only-derived-overlay",
            format: "dotnet-nativeaot",
            status: "complete",
            header_address: hex(directory.address),
            format_major: directory.major,
            format_minor: directory.minor,
            method_table_address: hex(table.address),
            name_origin: "generated",
            original_name: null,
            base_size_bytes: table.baseSize,
            related_type: table.related === 0n
                ? null
                : { address: hex(table.related), type: null },
            interfaces: [],
            virtual_slots: [],
            derived_memory: null,
            truncated: true,
            virtual_slots_omitted: table.slotsCount,
            interfaces_omitted: table.interfacesCount,
            output_budget_bytes: maximumBytes,
            diagnostics: [],
            limitations: [
                "Address-derived MethodTable identity; no original managed type name is available.",
                "This result is parser-derived and does not claim that Ghidra defined a database DataType.",
                "Slot and interface details are generated only for the requested address and bounded by the NativeAOT report-byte budget.",
            ],
        };
        let remaining = maximumBytes - Buffer.byteLength(JSON.stringify(metadata));
        if (remaining < 0) {
            metadata.diagnostics.push("detail_budget_too_small");
            metadata.truncated = true;
            metadata.status = "partial";
            return Buffer.byteLength(JSON.stringify(metadata)) <= maximumBytes
                ? metadata
                : undefined;
        }
        const maxInterfaceRowBytes = Buffer.byteLength(JSON.stringify({ address: `0x${"f".repeat(16)}`, type: null }));
        let interfacesOmitted = 0;
        for (let index = 0; index < table.interfacesCount; index++) {
            if (remaining < maxInterfaceRowBytes) {
                interfacesOmitted += table.interfacesCount - index;
                break;
            }
            if (!detailBudget.consumeWork(8)) {
                interfacesOmitted += table.interfacesCount - index;
                break;
            }
            const row = {
                address: hex(table.address),
                type: null,
            };
            const value = readU64(image.read(table.address + 24n + BigInt((table.slotsCount + index) * 8), 8));
            if (value === null) {
                interfacesOmitted += table.interfacesCount - index;
                break;
            }
            row.address = hex(value);
            const rowBytes = Buffer.byteLength(JSON.stringify(row)) +
                (metadata.interfaces.length > 0 ? 1 : 0);
            if (rowBytes > remaining) {
                interfacesOmitted++;
                continue;
            }
            metadata.interfaces.push(row);
            remaining -= rowBytes;
        }
        const maxVirtualSlotRowBytes = Buffer.byteLength(JSON.stringify({
            slot: 65535,
            slot_address: `0x${"f".repeat(16)}`,
            target_address: `0x${"f".repeat(16)}`,
            procedure_name: null,
            basis: "method-table-pointer",
        }));
        let slotsOmitted = 0;
        for (let slot = 0; slot < table.slotsCount; slot++) {
            if (remaining < maxVirtualSlotRowBytes) {
                slotsOmitted += table.slotsCount - slot;
                break;
            }
            if (!detailBudget.consumeWork(8)) {
                slotsOmitted += table.slotsCount - slot;
                break;
            }
            const value = readU64(image.read(table.address + 24n + BigInt(slot * 8), 8));
            if (value === null) {
                slotsOmitted += table.slotsCount - slot;
                break;
            }
            const row = {
                slot,
                slot_address: hex(table.address + 24n + BigInt(slot * 8)),
                target_address: value === 0n ? null : hex(value),
                procedure_name: null,
                basis: "method-table-pointer",
            };
            const rowBytes = Buffer.byteLength(JSON.stringify(row)) +
                (metadata.virtual_slots.length > 0 ? 1 : 0);
            if (rowBytes > remaining) {
                slotsOmitted++;
                continue;
            }
            metadata.virtual_slots.push(row);
            remaining -= rowBytes;
        }
        const tableBytes = 24 + (table.slotsCount + table.interfacesCount) * 8;
        // The descriptor size is independent of the source table size. Admit the
        // output representation first, then bound source hashing by parser work.
        const descriptor = {
            address: hex(table.address),
            size_bytes: tableBytes,
            sha256: "0".repeat(64),
            file_offset: null,
        };
        const withDescriptor = { ...metadata, derived_memory: descriptor };
        const descriptorBytes = Buffer.byteLength(JSON.stringify(withDescriptor)) -
            Buffer.byteLength(JSON.stringify(metadata));
        if (descriptorBytes <= remaining && detailBudget.consumeWork(tableBytes)) {
            const raw = image.read(table.address, tableBytes);
            if (raw !== null) {
                metadata.derived_memory = {
                    ...descriptor,
                    sha256: createHash("sha256").update(raw).digest("hex"),
                };
                remaining -= descriptorBytes;
            }
        }
        if (detailBudget.truncationReason !== undefined)
            metadata.diagnostics.push("method_table_hash_work_budget");
        metadata.interfaces_omitted = interfacesOmitted;
        metadata.virtual_slots_omitted = slotsOmitted;
        metadata.truncated =
            discovered.truncated ||
                hydration !== null ||
                detailBudget.truncationReason !== undefined ||
                interfacesOmitted > 0 ||
                slotsOmitted > 0 ||
                metadata.derived_memory === null;
        if (metadata.truncated)
            metadata.status = "partial";
        if (Buffer.byteLength(JSON.stringify(metadata)) > maximumBytes) {
            metadata.derived_memory = null;
            metadata.interfaces_omitted += metadata.interfaces.length;
            metadata.interfaces.length = 0;
            metadata.virtual_slots_omitted += metadata.virtual_slots.length;
            metadata.virtual_slots.length = 0;
            metadata.diagnostics.push("detail_rows_omitted");
            metadata.truncated = true;
            metadata.status = "partial";
            if (Buffer.byteLength(JSON.stringify(metadata)) > maximumBytes)
                return undefined;
        }
        return metadata;
    };
    return { summary, readTypeDetail };
};
