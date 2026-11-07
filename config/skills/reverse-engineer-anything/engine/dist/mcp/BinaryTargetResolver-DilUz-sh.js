import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { r as init_callerPath, t as absoluteCallerPath } from "./callerPath-BOjlR2T6.js";
import { i as init_configurationErrors, t as BinaryTargetError } from "./configurationErrors-Dc_G1uM0.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { at as isUnopenedAppleBundleExtension, it as init_appleBundleTypes, n as init_analysisErrorProjection, ot as openableAppleBundleExtension, rt as OPENABLE_APPLE_BUNDLE_TYPES_TEXT, t as childFailureDiagnostics } from "./analysisErrorProjection-B_6dTGtM.js";
import { f as init_analysisErrorCore, i as AnalysisCancelledError } from "./analysisErrorCore-BCqhUcUc.js";
import { _ as init_localPath, i as jsonValueSchema, n as init_jsonValue, v as isPathWithinRoot } from "./jsonValue-CbQQraup.js";
import { C as ArtifactReaderFailure, D as init_ArtifactReader, a as regularFileCancellation, i as init_OwnedRegularFile, m as init_RegularFile, n as RegularFileCancelled, p as assertStableRegularFileIdentity, r as RegularFileCleanupFailure, s as withOwnedRegularFile, t as OwnedRegularFileOperationFailure, u as RegularFileChangedError } from "./OwnedRegularFile-CufsBAJJ.js";
import { h as withMzWindowsHeaderSignature, l as init_dosMz, o as init_peCoffHeader, p as parseMzHeaderEvidence, s as readPeCoffHeader, u as mzWindowsHeaderLayoutLimitation } from "./peOptionalHeader-DlFfyymM.js";
import { i as init_RegularFileRead, n as RetainedRegularFileCleanupFailure, o as retryRegularFileCleanup, r as bindRegularFileCleanup } from "./RegularFileRead-DVEaayX5.js";
import { Dc as parseInesLayout, Ec as nesContainerFormat, Fc as init_rawBinary, Ic as parseRawBinaryEntryPoint, Nc as admitRawBinary, Rc as rawBinarySelectionError, Sn as zipRootPackageFormat, Tc as init_inesContainer, _n as hasZipSignature, bn as locateTrailingZipArchive, vn as init_zipPackageFormat, yn as isZipPackageFormat } from "./toolOutputSchemaGroups-3HUmDmX5.js";
import { n as espFlashSelectionError, o as init_dosCom, r as init_espFlashSelection, s as validateDosComLength } from "./espFlashSelection-tjkr0NM1.js";
import { $ as hasFitImagesNode, A as init_binaryTarget, Bt as init_artifactNameSelection, Dt as hasGodotPckHeader, F as peCodeViewDataRanges, Ft as init_elfProgramHeader, H as init_espFlashLocation, I as peDebugDirectoryEntry, It as readElfProgramHeader, K as init_espImage, L as peRvaToFileOffset, Lt as init_elfSectionHeader, M as parseExecutableHeader, Mt as init_diskImageFormat, N as parseMzExecutableMetadata, Nt as init_elfRawTableDeclarations, Ot as init_godotPckFormat, P as parsePeRecordFacts, Pt as readElfRawTableDeclarations, Rt as readElfSectionHeader, St as hasUImageMagic, U as locateEspFlashLayout, Vt as namedArtifactFormat, W as ESP8266_REFUSAL, _t as init_unityfsFormat, ct as hasWxapkgEncryptedMagic, et as init_fitImage, gt as hasUnityFsHeader, j as parseCodeViewData, jt as hasDiskImageSignature, k as claimsExecutableHeader, lt as hasWxapkgHeader, nt as hasUf2Block, ot as detectHexRecordEncoding, q as recognizeEspImage, rt as init_uf2, st as init_hexRecords, ut as init_wxapkgFormat, wt as init_uimageFormat, zt as artifactNameForClassification } from "./investigationProviders-Bqtkg8nj.js";
import { n as readFileHandleRange, t as init_readFileHandleRange } from "./readFileHandleRange-C2lk-iLP.js";
import { o as init_elfFixedHeader, s as readElfFixedHeader } from "./peMachine-BRjBYMN7.js";
import { D as init_propertyListXmlText, E as decodeXmlPlistText, a as init_propertyListKeys, b as createXmlPlistSignatureProbe, d as init_BinaryPlistMaterializer, h as preflightPropertyListDecode, i as isDfuSeFile, m as init_PropertyListDecodeBudget, n as hasDfuSePrefix, o as parseXmlPropertyList, r as init_dfuse, u as decodeBinaryPlistValue, w as init_appleArchiveFormat, x as hasBinaryPlistSignature, y as MAX_XML_PLIST_PROBE_BYTES } from "./dfuse-FtvOrGbN.js";
import { C as isJvmClassFile, S as init_jvmClassFile, _ as readMachoHeaderPrefixFacts, b as JVM_CLASS_IDENTITY_LIMIT_REASON, c as classifyFatContainerIdentity, d as init_machoContainer, f as readFatContainerHeader, n as init_machoLoadCommands, o as readMachoLoadCommandTableHeader, t as MachoLoadCommandCursor, x as MAX_JVM_CLASS_IDENTITY_BYTES } from "./machoLoadCommands-Cifbqd4t.js";
import { extname, join, sep } from "node:path";
import { constants } from "node:fs";
import { z } from "zod";
import { access, lstat, opendir, readFile, realpath, stat } from "node:fs/promises";
import { createHash } from "node:crypto";

//#region dist/domain/elfRelocation.js
/** Decode standard REL/RELA fields; architecture-specific application remains with consumers. */
function readElfRelocationEntry(bytes, bits, littleEndian, encoding) {
	const wordBytes = bits === 64 ? 8 : 4;
	if (bytes.byteLength < wordBytes * (encoding === "rela" ? 3 : 2)) return err({
		kind: "malformed",
		message: "ELF relocation entry is truncated"
	});
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const offset = bits === 64 ? view.getBigUint64(0, littleEndian) : BigInt(view.getUint32(0, littleEndian));
	const info = bits === 64 ? view.getBigUint64(wordBytes, littleEndian) : BigInt(view.getUint32(wordBytes, littleEndian));
	const entry = {
		offset,
		type: Number(info & (bits === 64 ? 4294967295n : 255n)),
		symbolIndex: Number(info >> (bits === 64 ? 32n : 8n))
	};
	if (encoding === "rel") return ok(entry);
	const addend = bits === 64 ? view.getBigInt64(wordBytes * 2, littleEndian) : BigInt(view.getInt32(wordBytes * 2, littleEndian));
	return ok({
		...entry,
		addend
	});
}
function init_elfRelocation() {
	return (init_elfRelocation = __esmMin((() => {
		init_result();
	})))();
}

//#endregion
//#region dist/domain/elfDynamicEntry.js
var readElfDynamicEntry;
function init_elfDynamicEntry() {
	return (init_elfDynamicEntry = __esmMin((() => {
		init_result();
		readElfDynamicEntry = (bytes, bits, littleEndian) => {
			const wide = bits === 64;
			if (bytes.byteLength < (wide ? 16 : 8)) return err({
				kind: "malformed",
				message: "ELF dynamic entry is truncated"
			});
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			return ok({
				tag: wide ? view.getBigInt64(0, littleEndian) : BigInt(view.getInt32(0, littleEndian)),
				value: wide ? view.getBigUint64(8, littleEndian) : BigInt(view.getUint32(4, littleEndian))
			});
		};
	})))();
}

//#endregion
//#region dist/application/MipsElfSharedLoad.js
var readMipsElfSharedLoad;
function init_MipsElfSharedLoad() {
	return (init_MipsElfSharedLoad = __esmMin((() => {
		init_elfRelocation();
		init_elfDynamicEntry();
		init_result();
		readMipsElfSharedLoad = async (programHeaders, little, fileSize, read, checkCancelled, sections) => {
			const loads = [];
			let dynamic;
			for (const program of programHeaders) {
				checkCancelled();
				const { type } = program;
				const offset = Number(program.offset);
				const size = Number(program.fileSize);
				if (type === 1) {
					const address = Number(program.virtualAddress);
					const memorySize = Number(program.memorySize);
					if (offset > fileSize - size || size > memorySize || address + memorySize > 4294967296) return err("invalid or incomplete MIPS PT_LOAD range");
					loads.push({
						offset,
						address,
						size,
						memorySize
					});
				}
				if (type === 2) {
					if (dynamic !== undefined) return err("duplicate MIPS PT_DYNAMIC tables");
					dynamic = {
						offset,
						address: Number(program.virtualAddress),
						size
					};
				}
			}
			if (dynamic === undefined) return err("MIPS shared image has no PT_DYNAMIC table");
			if (dynamic.size === 0 || dynamic.size % 8 !== 0) return err("invalid MIPS ELF32 dynamic table size");
			if (dynamic.offset > fileSize - dynamic.size) return err("MIPS PT_DYNAMIC range extends beyond the file");
			const ranges = loads.filter((load) => load.memorySize > 0).sort((left, right) => left.address - right.address);
			for (let i = 1; i < ranges.length; i += 1) {
				checkCancelled();
				const previous = ranges[i - 1];
				if (ranges[i].address < previous.address + previous.memorySize) return err("overlapping MIPS PT_LOAD memory ranges require separate mapping verification");
			}
			const mapped = (address, length, fileBacked) => {
				let low = 0;
				let high = ranges.length;
				while (low < high) {
					const middle = Math.floor((low + high) / 2);
					if (ranges[middle].address <= address) low = middle + 1;
					else high = middle;
				}
				const range = ranges[low - 1];
				return range !== undefined && address - range.address <= (fileBacked ? range.size : range.memorySize) - length ? range : undefined;
			};
			const dynamicMapping = mapped(dynamic.address, dynamic.size, true);
			if (dynamicMapping === undefined || dynamicMapping.offset + dynamic.address - dynamicMapping.address !== dynamic.offset) return err("MIPS PT_DYNAMIC has no unique matching file-backed PT_LOAD range");
			const chunkBytes = 64 * 1024;
			const relevant = new Set([
				2,
				7,
				8,
				9,
				17,
				18,
				19,
				20,
				23,
				35,
				36,
				37
			]);
			const tags = new Map();
			let terminated = false;
			for (let offset = 0; offset < dynamic.size && !terminated; offset += chunkBytes) {
				const chunk = await read(dynamic.offset + offset, Math.min(chunkBytes, dynamic.size - offset), "dynamic table");
				if (!chunk.ok) return chunk;
				for (let position = 0; position < chunk.value.length; position += 8) {
					checkCancelled();
					const parsedEntry = readElfDynamicEntry(chunk.value.subarray(position, position + 8), 32, little);
					if (!parsedEntry.ok) return err(parsedEntry.error.message);
					const tag = Number(BigInt.asUintN(32, parsedEntry.value.tag));
					if (tag === 0) {
						terminated = true;
						break;
					}
					if (!relevant.has(tag)) continue;
					if (tags.has(tag)) return err(`duplicate MIPS dynamic tag ${tag}`);
					tags.set(tag, Number(parsedEntry.value.value));
				}
			}
			if (!terminated) return err("MIPS dynamic table has no DT_NULL terminator");
			if ([
				35,
				36,
				37
			].some((tag) => tags.has(tag))) return err("MIPS shared RELR relocation declarations require separate verification");
			if ([
				2,
				7,
				8,
				9,
				23
			].some((tag) => (tags.get(tag) ?? 0) !== 0)) return err("MIPS shared RELA or PLT relocation declarations require separate verification");
			const address = tags.get(17);
			const size = tags.get(18);
			const stride = tags.get(19);
			const checkSections = (offset, length) => {
				let observed = 0;
				for (const section of sections) {
					checkCancelled();
					if (section.size === 0) continue;
					if (section.type !== 9 || section.entrySize !== 8 || section.offset !== offset || section.size !== length) return "MIPS section relocation declarations outside the dynamic REL table require separate verification";
					observed += 1;
				}
				return observed > 1 ? "duplicate MIPS section relocation declarations require separate verification" : undefined;
			};
			const emptyRelocations = () => {
				const reason = checkSections(0, 0);
				return reason === undefined ? ok({
					status: "complete",
					relocationCount: 0,
					relocationTypes: [],
					symbolRelativeCount: 0
				}) : err(reason);
			};
			if (address === undefined && size === undefined && stride === undefined) return emptyRelocations();
			if (address === undefined || size === undefined || stride !== 8 || size % 8 !== 0) return err("incomplete or invalid MIPS DT_REL/DT_RELSZ/DT_RELENT declaration");
			if (size === 0) return emptyRelocations();
			const mapping = mapped(address, size, true);
			if (mapping === undefined) return err("MIPS DT_REL range has no unique complete file-backed PT_LOAD mapping");
			const fileOffset = mapping.offset + address - mapping.address;
			const sectionReason = checkSections(fileOffset, size);
			if (sectionReason !== undefined) return err(sectionReason);
			let symbolRelativeCount = 0;
			const types = new Set();
			for (let offset = 0; offset < size; offset += chunkBytes) {
				const chunk = await read(fileOffset + offset, Math.min(chunkBytes, size - offset), "dynamic REL records");
				if (!chunk.ok) return chunk;
				for (let position = 0; position < chunk.value.length; position += 8) {
					checkCancelled();
					const parsedEntry = readElfRelocationEntry(chunk.value.subarray(position, position + 8), 32, little, "rel");
					if (!parsedEntry.ok) return err(parsedEntry.error.message);
					const { type, symbolIndex, offset: rawAddress } = parsedEntry.value;
					const relocationAddress = Number(rawAddress);
					if (type === 3 && mapped(relocationAddress, 4, false) === undefined) return err("MIPS REL32 destination has no unique complete PT_LOAD memory range");
					types.add(type);
					if (type === 3 && symbolIndex !== 0) symbolRelativeCount += 1;
				}
			}
			return ok({
				status: "complete",
				relocationCount: size / 8,
				relocationTypes: [...types].sort((left, right) => left - right),
				symbolRelativeCount
			});
		};
	})))();
}

//#endregion
//#region dist/application/MipsGnuAttributes.js
var MIPS_GNU_ATTRIBUTES_MAX_BYTES, FORMAT_VERSION$1, TAG_FILE$1, TAG_GNU_MIPS_ABI_FP, TAG_GNU_MIPS_ABI_MSA, parseMipsGnuAttributes;
function init_MipsGnuAttributes() {
	return (init_MipsGnuAttributes = __esmMin((() => {
		init_result();
		MIPS_GNU_ATTRIBUTES_MAX_BYTES = 4096;
		FORMAT_VERSION$1 = 65;
		TAG_FILE$1 = 1;
		TAG_GNU_MIPS_ABI_FP = 4;
		TAG_GNU_MIPS_ABI_MSA = 8;
		parseMipsGnuAttributes = (bytes, littleEndian) => {
			if (bytes.length === 0 || bytes[0] !== FORMAT_VERSION$1) return err("unsupported MIPS GNU attribute section format version");
			const readU32 = (offset) => littleEndian ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
			const readUleb = (offset, end) => {
				let value = 0;
				for (let index = 0; index < 5 && offset + index < end; index += 1) {
					const byte = bytes[offset + index];
					value += (byte & 127) * 2 ** (7 * index);
					if ((byte & 128) === 0) return value <= 4294967295 ? {
						value,
						next: offset + index + 1
					} : undefined;
				}
				return undefined;
			};
			let fpAbi = null;
			let msa = null;
			let vendorSeen = false;
			let position = 1;
			while (position < bytes.length) {
				if (bytes.length - position < 4) return err("truncated MIPS GNU attribute subsection length");
				const length = readU32(position);
				if (length < 4 || length > bytes.length - position) return err("MIPS GNU attribute subsection length does not fit the section");
				const end = position + length;
				const vendorEnd = bytes.indexOf(0, position + 4);
				if (vendorEnd < 0 || vendorEnd >= end) return err("unterminated MIPS GNU attribute vendor name");
				if (bytes.toString("latin1", position + 4, vendorEnd) !== "gnu") return err("MIPS ELF declares non-GNU vendor attributes that REA does not inspect");
				if (vendorSeen) return err("duplicate MIPS GNU attribute vendor subsections");
				vendorSeen = true;
				let cursor = vendorEnd + 1;
				while (cursor < end) {
					const scopeStart = cursor;
					const scope = readUleb(cursor, end);
					if (scope === undefined) return err("malformed MIPS GNU attribute scope tag");
					if (scope.value !== TAG_FILE$1) return err("MIPS GNU attributes scoped to sections or symbols are not inspected by REA");
					if (end - scope.next < 4) return err("truncated MIPS GNU attribute scope length");
					const scopeLength = readU32(scope.next);
					if (scopeLength < scope.next + 4 - scopeStart || scopeLength > end - scopeStart) return err("MIPS GNU attribute scope length does not fit its subsection");
					const scopeEnd = scopeStart + scopeLength;
					cursor = scope.next + 4;
					while (cursor < scopeEnd) {
						const tag = readUleb(cursor, scopeEnd);
						if (tag === undefined) return err("malformed MIPS GNU attribute tag");
						if (tag.value !== TAG_GNU_MIPS_ABI_FP && tag.value !== TAG_GNU_MIPS_ABI_MSA) return err(`MIPS ELF declares GNU attribute tag ${tag.value}, which REA does not inspect`);
						const value = readUleb(tag.next, scopeEnd);
						if (value === undefined) return err("malformed MIPS GNU attribute value");
						if (tag.value === TAG_GNU_MIPS_ABI_FP) {
							if (fpAbi !== null) return err("duplicate MIPS GNU floating-point ABI attributes");
							fpAbi = value.value;
						} else {
							if (msa !== null) return err("duplicate MIPS GNU MSA ABI attributes");
							msa = value.value;
						}
						cursor = value.next;
					}
					cursor = scopeEnd;
				}
				position = end;
			}
			return ok({
				fpAbi,
				msa
			});
		};
	})))();
}

//#endregion
//#region dist/application/MipsElfMetadata.js
var SHT_GNU_ATTRIBUTES, readMipsElfMetadata;
function init_MipsElfMetadata() {
	return (init_MipsElfMetadata = __esmMin((() => {
		init_elfSectionHeader();
		init_elfProgramHeader();
		init_elfRawTableDeclarations();
		init_elfFixedHeader();
		init_result();
		init_MipsElfSharedLoad();
		init_MipsGnuAttributes();
		SHT_GNU_ATTRIBUTES = 1879048181;
		readMipsElfMetadata = async (handle, metadata, checkCancelled) => {
			checkCancelled();
			if (metadata.elfClass !== 32) return err("MIPS ABI record inspection currently supports ELF32 only");
			const fileSize = (await handle.stat()).size;
			checkCancelled();
			const read = async (offset, length, label) => {
				checkCancelled();
				if (!Number.isSafeInteger(fileSize) || offset < 0 || length < 0 || offset > fileSize - length) return err(`MIPS ${label} lies outside the file`);
				const bytes = Buffer.alloc(length);
				let total = 0;
				while (total < length) {
					checkCancelled();
					const observed = await handle.read(bytes, total, length - total, offset + total);
					checkCancelled();
					if (observed.bytesRead === 0) return err(`truncated MIPS ${label}`);
					total += observed.bytesRead;
				}
				return ok(bytes);
			};
			const header = await read(0, 52, "ELF32 header");
			if (!header.ok) return header;
			const bytes = header.value;
			const fixedHeader = readElfFixedHeader(bytes, fileSize);
			if (!fixedHeader.ok) return fixedHeader;
			const little = metadata.byteOrder === "little";
			const u16 = (data, offset) => little ? data.readUInt16LE(offset) : data.readUInt16BE(offset);
			const u32 = (data, offset) => little ? data.readUInt32LE(offset) : data.readUInt32BE(offset);
			if (fixedHeader.value.elfClass !== 32 || fixedHeader.value.byteOrder !== metadata.byteOrder || fixedHeader.value.machine !== 8 || fixedHeader.value.type !== metadata.type || fixedHeader.value.flags !== metadata.flags) return err("MIPS ELF header no longer matches the resolved identity");
			if (fixedHeader.value.headerSize !== 52) return err("invalid MIPS ELF32 version or header size");
			const raw = readElfRawTableDeclarations(bytes, fixedHeader.value);
			if (!raw.ok) return err(raw.error.message);
			const { programs, sections } = raw.value;
			const tables = [{
				label: "program header table",
				offset: Number(programs.offset),
				count: programs.count,
				stride: programs.width,
				entrySize: 32,
				recordType: 1879048195,
				optional: false
			}, {
				label: "section header table",
				offset: Number(sections.offset),
				count: sections.count,
				stride: sections.width,
				entrySize: 40,
				recordType: 1879048234,
				optional: true
			}];
			if (programs.count === 65535 || sections.count >= 65280) return err("extended or reserved MIPS ELF table numbering is unsupported");
			let record;
			let sharedLoad;
			let programHeaders;
			const relocationSections = [];
			const limitations = [];
			let gnuAttributes = null;
			for (const table of tables) {
				if (table.count === 0) {
					if (table.offset !== 0) return err(`unsupported extended or inconsistent MIPS ${table.label}`);
					continue;
				}
				if (table.offset < 52 || table.stride !== table.entrySize) return err(`invalid MIPS ${table.label} offset or entry size`);
				const count = table.optional ? Math.min(table.count, Math.max(0, Math.floor((fileSize - table.offset) / table.entrySize))) : table.count;
				if (count < table.count) limitations.push(`MIPS ${table.label} at file offset ${table.offset} extends beyond the captured file: examined ${count} of ${table.count} complete headers. ABI declarations in unavailable headers remain unknown.`);
				if (count === 0) continue;
				const contents = await read(table.offset, count * table.entrySize, table.label);
				if (!contents.ok) return contents;
				if (!table.optional && metadata.type === 3) programHeaders = [];
				let found = false;
				for (let i = 0; i < count; i += 1) {
					checkCancelled();
					const position = i * table.entrySize;
					const parsedRecord = table.optional ? readElfSectionHeader(contents.value.subarray(position, position + table.entrySize), 32, little) : readElfProgramHeader(contents.value.subarray(position, position + table.entrySize), 32, little);
					if (!parsedRecord.ok) return err(parsedRecord.error.message);
					const declaration = parsedRecord.value;
					if ("fileSize" in declaration) programHeaders?.push(declaration);
					const { type } = declaration;
					const declaredOffset = Number(declaration.offset);
					const declaredSize = Number("fileSize" in declaration ? declaration.fileSize : declaration.size);
					if (table.optional && type === SHT_GNU_ATTRIBUTES) {
						if (gnuAttributes !== null) return err("duplicate MIPS GNU attribute sections");
						const size = declaredSize;
						if (size === 0 || size > 4096) return err(`MIPS GNU attribute section size ${size} is outside REA's inspected bound of ${MIPS_GNU_ATTRIBUTES_MAX_BYTES} bytes`);
						const section = await read(declaredOffset, size, "GNU attribute section");
						if (!section.ok) return section;
						const parsed = parseMipsGnuAttributes(section.value, little);
						if (!parsed.ok) return parsed;
						gnuAttributes = parsed.value;
						continue;
					}
					if (metadata.type === 3 && "entrySize" in declaration && (type === 4 || type === 9 || type === 19)) relocationSections.push({
						type,
						offset: declaredOffset,
						size: declaredSize,
						entrySize: Number(declaration.entrySize)
					});
					if (type !== table.recordType) continue;
					if (found) return err(`duplicate MIPS ABI records in ${table.label}`);
					found = true;
					const offset = declaredOffset;
					const size = declaredSize;
					if (size !== 24) return err("unsupported MIPS ABI record size; expected 24 bytes");
					const candidate = await read(offset, 24, "ABI record");
					if (!candidate.ok) return candidate;
					if (record !== undefined && !record.equals(candidate.value)) return err("conflicting MIPS program/section ABI declarations");
					record = candidate.value;
				}
			}
			if (metadata.type === 3 && programHeaders !== undefined) {
				if (limitations.length > 0) sharedLoad = {
					status: "unavailable",
					reason: `MIPS shared-image relocation declaration sources are incomplete. ${limitations.join(" ")}`
				};
				else {
					const shared = await readMipsElfSharedLoad(programHeaders, little, fileSize, read, checkCancelled, relocationSections);
					sharedLoad = shared.ok ? shared.value : {
						status: "unavailable",
						reason: shared.error
					};
				}
			}
			const shared = metadata.type === 3 ? { sharedLoad: sharedLoad ?? {
				status: "unavailable",
				reason: "MIPS shared image has no inspected program header table"
			} } : {};
			if (record === undefined) return ok({
				abiFlags: null,
				gnuAttributes,
				limitations,
				...shared
			});
			const abiFlags = {
				version: u16(record, 0),
				isaLevel: record.readUInt8(2),
				isaRevision: record.readUInt8(3),
				gprSize: record.readUInt8(4),
				cpr1Size: record.readUInt8(5),
				cpr2Size: record.readUInt8(6),
				fpAbi: record.readUInt8(7),
				isaExtension: u32(record, 8),
				ases: u32(record, 12),
				flags1: u32(record, 16),
				flags2: u32(record, 20)
			};
			if (gnuAttributes !== null && gnuAttributes.fpAbi !== null && gnuAttributes.fpAbi !== 0 && gnuAttributes.fpAbi !== abiFlags.fpAbi) return err("conflicting MIPS ABI flags and GNU floating-point ABI declarations");
			return ok({
				abiFlags,
				gnuAttributes,
				limitations,
				...shared
			});
		};
	})))();
}

//#endregion
//#region dist/domain/elfDeclaredRanges.js
/** Canonical table declarations, including extended counts in inactive section zero. */
function* readElfTableDeclarations(bytes, fileSize) {
	const fixed = readElfFixedHeader(bytes, fileSize);
	if (!fixed.ok) return fixed;
	const header = fixed.value;
	const raw = readElfRawTableDeclarations(bytes, header);
	if (!raw.ok) return err(raw.error.message);
	const { programs, sections } = raw.value;
	const programOffset = programs.offset;
	const sectionOffset = sections.offset;
	const programWidth = programs.width;
	const sectionWidth = sections.width;
	let programCount = BigInt(programs.count);
	let sectionCount = BigInt(sections.count);
	let namesIndex = sections.namesIndex;
	const presence = validateElfSectionTablePresence(raw.value);
	if (!presence.ok) return presence;
	if (sectionOffset !== 0n && (sectionCount === 0n || namesIndex === 65535 || programCount === 65535n)) {
		const failure = tableFailure("section", {
			offset: sectionOffset,
			count: 1n,
			width: sectionWidth
		}, header, fileSize);
		if (failure !== undefined) return err(failure);
		const first = yield {
			offset: Number(sectionOffset),
			size: header.elfClass === 64 ? 64 : 40
		};
		const counts = extendedCounts(first, header, {
			programCount,
			sectionCount,
			namesIndex
		});
		if (!counts.ok) return counts;
		({programCount, sectionCount, namesIndex} = counts.value);
	}
	for (const [kind, offset, count, width] of [[
		"program",
		programOffset,
		programCount,
		programWidth
	], [
		"section",
		sectionOffset,
		sectionCount,
		sectionWidth
	]]) {
		const failure = tableFailure(kind, {
			offset,
			count,
			width
		}, header, fileSize);
		if (failure !== undefined) return err(failure);
	}
	if (sectionCount !== 0n && BigInt(namesIndex) >= sectionCount) return err("ELF section-name index lies outside the declared section table");
	return ok({
		header,
		programs: {
			offset: programOffset,
			count: Number(programCount),
			width: programWidth
		},
		sections: {
			offset: sectionOffset,
			count: Number(sectionCount),
			width: sectionWidth,
			namesIndex
		}
	});
}
/** Examine only header records; referenced payloads are range-checked, never copied. */
function* inspectTableRanges(kind, table, header, fileSize) {
	const perRead = Math.max(1, Math.floor(64 * 1024 / table.width));
	for (let index = 0; index < table.count; index += perRead) {
		const count = Math.min(perRead, table.count - index);
		const size = count * table.width;
		const bytes = yield {
			offset: Number(table.offset) + index * table.width,
			size
		};
		if (bytes.length !== size) return err(`truncated ELF ${kind} header table`);
		for (let item = 0; item < count; item++) {
			const at = item * table.width;
			const parsed = kind === "program" ? readElfProgramHeader(bytes.subarray(at, at + table.width), header.elfClass, header.byteOrder === "little") : readElfSectionHeader(bytes.subarray(at, at + table.width), header.elfClass, header.byteOrder === "little");
			if (!parsed.ok) return err(parsed.error.message);
			const facts = parsed.value;
			if (facts.type === 0 || kind === "section" && facts.type === 8) continue;
			const offset = facts.offset;
			const length = "fileSize" in facts ? facts.fileSize : facts.size;
			const failure = rangeFailure(`${kind} ${String(index + item)}`, offset, length, fileSize);
			if (failure !== undefined) return err(failure);
		}
	}
	return ok(null);
}
/** Physical extent admission, independent of section names, CPU lanes and decoder budgets. */
function* validateElfDeclaredRanges(prefix, fileSize) {
	const declarations = yield* readElfTableDeclarations(prefix, fileSize);
	if (!declarations.ok) return declarations;
	const { header, programs, sections } = declarations.value;
	for (const [kind, table] of [["program", programs], ["section", sections]]) {
		if (table.count === 0) continue;
		const inspected = yield* inspectTableRanges(kind, table, header, fileSize);
		if (!inspected.ok) return inspected;
	}
	return ok(null);
}
var rangeFailure, tableFailure, extendedCounts, validateElfSectionTablePresence;
function init_elfDeclaredRanges() {
	return (init_elfDeclaredRanges = __esmMin((() => {
		init_elfSectionHeader();
		init_elfProgramHeader();
		init_elfRawTableDeclarations();
		init_elfFixedHeader();
		init_result();
		rangeFailure = (label, offset, size, fileSize) => size !== 0n && (offset > BigInt(fileSize) || size > BigInt(fileSize) - offset) ? `truncated ELF ${label}: declared file range ${String(offset)}..${String(offset + size)} exceeds the ${String(fileSize)}-byte file` : undefined;
		tableFailure = (kind, table, header, fileSize) => {
			if (table.count === 0n) return undefined;
			const wide = header.elfClass === 64;
			const minimumWidth = kind === "program" ? wide ? 56 : 32 : wide ? 64 : 40;
			const label = `${kind} header table`;
			if (table.width < minimumWidth) return `invalid ELF ${label} entry width`;
			if (table.offset < BigInt(wide ? 64 : 52)) return `ELF ${label} overlaps the fixed header`;
			return rangeFailure(label, table.offset, table.count * BigInt(table.width), fileSize);
		};
		extendedCounts = (first, header, initial) => {
			const wide = header.elfClass === 64;
			if (first.length !== (wide ? 64 : 40)) return err("truncated ELF extended section-zero header");
			const parsed = readElfSectionHeader(first, header.elfClass, header.byteOrder === "little");
			if (!parsed.ok) return err(parsed.error.message);
			const zero = parsed.value;
			if (zero.type !== 0) return err("ELF extended numbering requires an inactive SHT_NULL section zero");
			const counts = { ...initial };
			if (counts.sectionCount === 0n) {
				counts.sectionCount = zero.size;
				if (counts.sectionCount < 65280n) return err("invalid ELF extended section count");
			}
			if (counts.namesIndex === 65535) {
				counts.namesIndex = zero.link;
				if (counts.namesIndex < 65280) return err("invalid ELF extended section-name index");
			}
			if (counts.programCount === 65535n) {
				counts.programCount = BigInt(zero.info);
				if (counts.programCount < 65535n) return err("invalid ELF extended program count");
			}
			return ok(counts);
		};
		validateElfSectionTablePresence = (tables) => tables.sections.offset === 0n && (tables.sections.count !== 0 || tables.sections.namesIndex !== 0 || tables.programs.count === 65535) ? err("ELF section table is missing") : ok(null);
	})))();
}

//#endregion
//#region dist/domain/riscvIsaDeclaration.js
/**
* Find and interpret the image's `SHT_RISCV_ATTRIBUTES` section. Every section
* header is examined, so an absent declaration is observed, not assumed; two
* attribute sections leave the declaration unavailable. The caller satisfies
* each read from its own descriptor.
*/
function* readRiscvIsaDeclaration(prefix, fileSize) {
	const unavailable = (reason) => ({
		status: "unavailable",
		reason
	});
	const declarations = yield* readElfTableDeclarations(prefix, fileSize);
	if (!declarations.ok) return unavailable(declarations.error);
	const { header, sections } = declarations.value;
	const little = header.byteOrder === "little";
	let attributes;
	const perRead = Math.max(1, Math.floor(64 * 1024 / sections.width));
	for (let index = 0; index < sections.count; index += perRead) {
		const count = Math.min(perRead, sections.count - index);
		const size = count * sections.width;
		const bytes = yield {
			offset: Number(sections.offset) + index * sections.width,
			size
		};
		if (bytes.length !== size) return unavailable("truncated ELF section header table");
		for (let item = 0; item < count; item += 1) {
			const at = item * sections.width;
			const parsed = readElfSectionHeader(bytes.subarray(at, at + sections.width), header.elfClass, little);
			if (!parsed.ok) return unavailable(parsed.error.message);
			if (parsed.value.type !== 1879048195) continue;
			if (attributes !== undefined) return unavailable("the image has more than one RISC-V attribute section");
			attributes = {
				offset: parsed.value.offset,
				size: parsed.value.size
			};
		}
	}
	if (attributes === undefined) return { status: "absent" };
	if (attributes.size === 0n || attributes.size > BigInt(4096)) return unavailable(`RISC-V attribute section size ${String(attributes.size)} is outside REA's inspected bound of ${RISCV_ATTRIBUTES_MAX_BYTES} bytes`);
	if (attributes.offset > BigInt(fileSize) - attributes.size) return unavailable("RISC-V attribute section lies outside the file");
	const size = Number(attributes.size);
	const bytes = yield {
		offset: Number(attributes.offset),
		size
	};
	if (bytes.length !== size) return unavailable("truncated RISC-V attribute section");
	const arch = parseRiscvAttributes(bytes, little);
	if (!arch.ok) return unavailable(arch.error);
	return arch.value === null ? { status: "absent" } : riscvIsaDeclaration(arch.value);
}
var RISCV_FLOAT_ABIS, EF_RISCV_FLOAT_ABI, riscvFloatAbi, riscvAbiName, SHT_RISCV_ATTRIBUTES, RISCV_ATTRIBUTES_MAX_BYTES, FORMAT_VERSION, TAG_FILE, TAG_RISCV_ARCH, parseRiscvAttributes, ISA_BASE, ISA_EXTENSION, riscvIsaDeclaration;
function init_riscvIsaDeclaration() {
	return (init_riscvIsaDeclaration = __esmMin((() => {
		init_elfDeclaredRanges();
		init_elfSectionHeader();
		init_result();
		RISCV_FLOAT_ABIS = [
			"soft",
			"single",
			"double",
			"quad"
		];
		EF_RISCV_FLOAT_ABI = 6;
		riscvFloatAbi = (flags) => RISCV_FLOAT_ABIS[(flags & EF_RISCV_FLOAT_ABI) >>> 1];
		riscvAbiName = (elfClass, floatAbi) => elfClass === 32 && floatAbi === "quad" ? null : `${elfClass === 32 ? "ilp32" : "lp64"}${{
			soft: "",
			single: "f",
			double: "d",
			quad: "q"
		}[floatAbi]}`;
		SHT_RISCV_ATTRIBUTES = 1879048195;
		RISCV_ATTRIBUTES_MAX_BYTES = 4096;
		FORMAT_VERSION = 65;
		TAG_FILE = 1;
		TAG_RISCV_ARCH = 5;
		parseRiscvAttributes = (bytes, littleEndian) => {
			if (bytes.length === 0 || bytes[0] !== FORMAT_VERSION) return err("unsupported RISC-V attribute section format version");
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const readU32 = (offset) => view.getUint32(offset, littleEndian);
			const readUleb = (offset, end) => {
				let value = 0;
				for (let index = 0; index < 5 && offset + index < end; index += 1) {
					const byte = bytes[offset + index];
					value += (byte & 127) * 2 ** (7 * index);
					if ((byte & 128) === 0) return value <= 4294967295 ? {
						value,
						next: offset + index + 1
					} : undefined;
				}
				return undefined;
			};
			const readString = (offset, end) => {
				const stop = bytes.indexOf(0, offset);
				return stop < 0 || stop >= end ? undefined : {
					value: Buffer.from(bytes.subarray(offset, stop)).toString("latin1"),
					next: stop + 1
				};
			};
			let arch = null;
			let vendorSeen = false;
			let position = 1;
			while (position < bytes.length) {
				if (bytes.length - position < 4) return err("truncated RISC-V attribute subsection length");
				const length = readU32(position);
				if (length < 4 || length > bytes.length - position) return err("RISC-V attribute subsection length does not fit the section");
				const end = position + length;
				const vendor = readString(position + 4, end);
				if (vendor === undefined) return err("unterminated RISC-V attribute vendor name");
				if (vendor.value !== "riscv") return err("RISC-V ELF declares non-riscv vendor attributes that REA does not inspect");
				if (vendorSeen) return err("duplicate riscv vendor attribute subsections");
				vendorSeen = true;
				let cursor = vendor.next;
				while (cursor < end) {
					const scopeStart = cursor;
					const scope = readUleb(cursor, end);
					if (scope === undefined) return err("malformed RISC-V attribute scope tag");
					if (scope.value !== TAG_FILE) return err("RISC-V attributes scoped to sections or symbols are not inspected by REA");
					if (end - scope.next < 4) return err("truncated RISC-V attribute scope length");
					const scopeLength = readU32(scope.next);
					if (scopeLength < scope.next + 4 - scopeStart || scopeLength > end - scopeStart) return err("RISC-V attribute scope length does not fit its subsection");
					const scopeEnd = scopeStart + scopeLength;
					cursor = scope.next + 4;
					while (cursor < scopeEnd) {
						const tag = readUleb(cursor, scopeEnd);
						if (tag === undefined) return err("malformed RISC-V attribute tag");
						if (tag.value % 2 === 1) {
							const value = readString(tag.next, scopeEnd);
							if (value === undefined) return err(`unterminated string value for RISC-V attribute tag ${tag.value}`);
							if (tag.value === TAG_RISCV_ARCH) {
								if (arch !== null) return err("duplicate RISC-V Tag_RISCV_arch attributes");
								arch = value.value;
							}
							cursor = value.next;
						} else {
							const value = readUleb(tag.next, scopeEnd);
							if (value === undefined) return err(`malformed integer value for RISC-V attribute tag ${tag.value}`);
							cursor = value.next;
						}
					}
				}
				position = end;
			}
			return ok(arch);
		};
		ISA_BASE = /^rv(32|64)([ie])(?:\d+p\d+)?$/u;
		ISA_EXTENSION = /^([a-z][a-z0-9]*?)(?:\d+p\d+)?$/u;
		riscvIsaDeclaration = (arch) => {
			const unavailable = (reason) => ({
				status: "unavailable",
				reason,
				arch
			});
			const [first = "", ...rest] = arch.split("_");
			const base = ISA_BASE.exec(first);
			if (base === null) return unavailable("Tag_RISCV_arch does not begin with a canonical rv32/rv64 I or E base");
			const extensions = [];
			for (const token of rest) {
				const name = ISA_EXTENSION.exec(token)?.[1];
				if (name === undefined) return unavailable(`Tag_RISCV_arch contains a non-canonical extension token "${token}"`);
				if (extensions.includes(name)) return unavailable(`Tag_RISCV_arch declares extension ${name} twice`);
				extensions.push(name);
			}
			return {
				status: "declared",
				arch,
				xlen: base[1] === "32" ? 32 : 64,
				base: base[2] === "e" ? "e" : "i",
				extensions
			};
		};
	})))();
}

//#endregion
//#region dist/application/AppBundleExecutable.js
var BINARY_PLIST_DECODE_BYTES, BUNDLE_LAYOUTS, VERSIONED_FRAMEWORK_LAYOUTS, FLATTENED_FRAMEWORK_LAYOUTS, defaultFileSystem, resolveAppBundleExecutable, resolveAppleBundleExecutable, bundleLayouts, declaredBundleLayout, findAppBundleResourceRoot, resolveAppBundleResourceRoot, presentLayout, layoutPlistPresent, entryPresent, isAbsence, errorCode, codeDescription, isSystemErrorCode, isPermissionDenied, errorReason, wrappedBundle, resolveLayoutExecutable, decodeInfoPlistValue, UndeclaredBundleExecutable, executableName, executableEntrySchema, isSafeExecutableName;
function init_AppBundleExecutable() {
	return (init_AppBundleExecutable = __esmMin((() => {
		init_PropertyListDecodeBudget();
		init_BinaryPlistMaterializer();
		init_configurationErrors();
		init_localPath();
		init_propertyListKeys();
		init_propertyListXmlText();
		init_appleArchiveFormat();
		init_appleBundleTypes();
		init_result();
		init_callerPath();
		BINARY_PLIST_DECODE_BYTES = 16 * 1024 * 1024;
		BUNDLE_LAYOUTS = [{
			name: "contents",
			plist: ["Contents", "Info.plist"],
			programs: ["Contents", "MacOS"],
			programsLabel: "Contents/MacOS"
		}, {
			name: "root",
			plist: ["Info.plist"],
			programs: [],
			programsLabel: "the bundle root"
		}];
		VERSIONED_FRAMEWORK_LAYOUTS = [...BUNDLE_LAYOUTS, {
			name: "versioned-framework",
			plist: [
				"Versions",
				"Current",
				"Resources",
				"Info.plist"
			],
			programs: ["Versions", "Current"],
			programsLabel: "Versions/Current"
		}];
		FLATTENED_FRAMEWORK_LAYOUTS = [...BUNDLE_LAYOUTS, {
			name: "flattened-framework",
			plist: ["Resources", "Info.plist"],
			programs: [],
			programsLabel: "the bundle root"
		}];
		defaultFileSystem = {
			readFile,
			realpath
		};
		resolveAppBundleExecutable = async (path, fileSystem = defaultFileSystem) => {
			try {
				const layout = await presentLayout(path);
				if (layout !== undefined) return await resolveLayoutExecutable(path, layout, fileSystem);
				const wrapped = await wrappedBundle(path);
				if (wrapped !== undefined) {
					const wrappedLayout = await presentLayout(wrapped);
					if (wrappedLayout !== undefined) return await resolveLayoutExecutable(wrapped, wrappedLayout, fileSystem);
				}
			} catch (cause) {
				if (cause instanceof BinaryTargetError) return err(cause);
				return err(new BinaryTargetError(path, errorReason(cause, path), { cause }));
			}
			return err(new BinaryTargetError(path, `app Info.plist is missing or no supported bundle layout was found: ${path}`, { cause: new Error("No Contents/Info.plist, root Info.plist, or single Wrapper/*.app bundle was found") }));
		};
		resolveAppleBundleExecutable = async (path, fileSystem = defaultFileSystem) => {
			if (extname(path).toLowerCase() === ".app") return resolveAppBundleExecutable(path, fileSystem);
			try {
				const layout = await declaredBundleLayout(path, fileSystem);
				if (!layout.ok) return layout;
				if (layout.value === undefined) return err(new BinaryTargetError(path, `bundle Info.plist was not found in any supported layout: ${path}`, {
					constraint: "bundle_info_plist_missing",
					probedPaths: (await bundleLayouts(path)).map((candidate) => join(path, ...candidate.plist))
				}));
				return await resolveLayoutExecutable(path, layout.value, fileSystem);
			} catch (cause) {
				if (cause instanceof BinaryTargetError) return err(cause);
				return err(new BinaryTargetError(path, errorReason(cause, path), { cause }));
			}
		};
		bundleLayouts = async (bundle) => {
			if (extname(bundle).toLowerCase() !== ".framework") return BUNDLE_LAYOUTS;
			return await entryPresent(join(bundle, "Versions")) ? VERSIONED_FRAMEWORK_LAYOUTS : FLATTENED_FRAMEWORK_LAYOUTS;
		};
		declaredBundleLayout = async (path, fileSystem) => {
			const layouts = await bundleLayouts(path);
			if (layouts === VERSIONED_FRAMEWORK_LAYOUTS) {
				const current = join(path, "Versions", "Current");
				if (!await entryPresent(current)) return err(new BinaryTargetError(path, `framework has Versions but no Versions/Current: ${current}`, {
					constraint: "bundle_current_version_missing",
					probedPaths: [current]
				}));
			}
			const present = [];
			for (const layout of layouts) if (await layoutPlistPresent(join(path, ...layout.plist))) present.push(layout);
			const [layout, ...others] = present;
			if (layout === undefined) return ok(undefined);
			if (others.length > 0) return err(new BinaryTargetError(path, `bundle declares Info.plist in more than one layout: ${path}`, {
				constraint: "bundle_layout_ambiguous",
				probedPaths: present.map((candidate) => join(path, ...candidate.plist))
			}));
			const plistPath = join(path, ...layout.plist);
			if (!isPathWithinRoot(await fileSystem.realpath(path), await fileSystem.realpath(plistPath))) return err(new BinaryTargetError(path, "bundle Info.plist leaves the bundle", {
				constraint: "bundle_path_escapes",
				probedPaths: [plistPath]
			}));
			return ok(layout);
		};
		findAppBundleResourceRoot = async (path, options = {}) => {
			const callerPath = absoluteCallerPath(path, options.cwd === undefined ? {} : { cwd: options.cwd });
			try {
				await stat(callerPath);
				const canonicalInput = await realpath(callerPath);
				const extension = extname(canonicalInput).toLowerCase();
				if (extension !== ".app" && openableAppleBundleExtension(extension) !== undefined) {
					const declared = await declaredBundleLayout(canonicalInput, defaultFileSystem);
					if (!declared.ok) return declared;
					if (declared.value === undefined) return err(new BinaryTargetError(callerPath, `bundle Info.plist was not found in any supported layout: ${callerPath}`, {
						constraint: "bundle_info_plist_missing",
						probedPaths: (await bundleLayouts(canonicalInput)).map((layout) => join(canonicalInput, ...layout.plist))
					}));
					return ok({
						callerPath,
						canonicalPath: canonicalInput,
						infoPlistPath: join(canonicalInput, ...declared.value.plist),
						layout: declared.value.name,
						executableSha256: null
					});
				}
				const directLayout = await presentLayout(canonicalInput);
				const wrapped = directLayout === undefined ? await wrappedBundle(canonicalInput) : undefined;
				const root = wrapped ?? canonicalInput;
				const layout = directLayout ?? await presentLayout(root);
				if (layout === undefined) return ok(undefined);
				const canonicalPath = await realpath(root);
				return ok({
					callerPath,
					canonicalPath,
					infoPlistPath: join(canonicalPath, ...layout.plist),
					layout: layout.name,
					executableSha256: null
				});
			} catch (cause) {
				if (cause instanceof BinaryTargetError) return err(cause);
				return err(new BinaryTargetError(callerPath, errorReason(cause, callerPath), { cause }));
			}
		};
		resolveAppBundleResourceRoot = async (path, options = {}) => {
			const found = await findAppBundleResourceRoot(path, options);
			if (!found.ok) return found;
			if (found.value !== undefined) return ok(found.value);
			const callerPath = absoluteCallerPath(path, options);
			return err(new BinaryTargetError(callerPath, `app resource root has no supported Info.plist layout: ${callerPath}`));
		};
		presentLayout = async (bundle) => {
			for (const layout of BUNDLE_LAYOUTS) if (await layoutPlistPresent(join(bundle, ...layout.plist))) return layout;
			return undefined;
		};
		layoutPlistPresent = async (path) => {
			try {
				return (await stat(path)).isFile();
			} catch (cause) {
				if (isAbsence(cause)) return false;
				if (isPermissionDenied(cause)) throw new BinaryTargetError(path, `permission denied inspecting app Info.plist ${path}`, { cause });
				throw cause;
			}
		};
		entryPresent = async (path) => {
			try {
				await lstat(path);
				return true;
			} catch (cause) {
				if (isAbsence(cause)) return false;
				throw cause;
			}
		};
		isAbsence = (cause) => {
			const code = errorCode(cause);
			return code === "ENOENT" || code === "ENOTDIR";
		};
		errorCode = (cause) => cause instanceof Error ? Reflect.get(cause, "code") : undefined;
		codeDescription = (cause) => {
			const code = errorCode(cause);
			return typeof code === "string" || typeof code === "number" ? ` (${String(code)})` : "";
		};
		isSystemErrorCode = (cause) => {
			const code = errorCode(cause);
			return typeof code === "string" && /^[A-Z][A-Z0-9_]+$/u.test(code) && !code.startsWith("ERR_");
		};
		isPermissionDenied = (cause) => errorCode(cause) === "EACCES" || errorCode(cause) === "EPERM";
		errorReason = (cause, path) => isPermissionDenied(cause) ? `permission denied accessing app bundle path ${path}` : isAbsence(cause) ? `app bundle path is missing: ${path}` : `could not inspect app bundle path ${path}`;
		wrappedBundle = async (bundle) => {
			const wrapper = join(bundle, "Wrapper");
			try {
				if (!(await lstat(wrapper)).isDirectory()) return undefined;
			} catch (cause) {
				if (isAbsence(cause)) return undefined;
				throw cause;
			}
			let app;
			for await (const entry of await opendir(wrapper)) {
				if (!entry.isDirectory() || !entry.name.toLowerCase().endsWith(".app")) continue;
				if (app !== undefined) return undefined;
				app = join(wrapper, entry.name);
			}
			return app;
		};
		resolveLayoutExecutable = async (bundle, layout, fileSystem) => {
			const plistPath = join(bundle, ...layout.plist);
			const noun = extname(bundle).toLowerCase() === ".app" ? "app" : "bundle";
			let plist;
			try {
				plist = await fileSystem.readFile(plistPath);
			} catch (cause) {
				return err(new BinaryTargetError(plistPath, isPermissionDenied(cause) ? `permission denied reading ${noun} Info.plist ${plistPath}` : isAbsence(cause) ? `${noun} Info.plist is missing: ${plistPath}` : `could not read ${noun} Info.plist ${plistPath}${codeDescription(cause)}`, { cause }));
			}
			let name;
			try {
				name = hasBinaryPlistSignature(plist) && fileSystem.decodeBinaryPlist !== undefined ? await fileSystem.decodeBinaryPlist(plistPath) : executableName(decodeInfoPlistValue(plist));
			} catch (cause) {
				return err(new BinaryTargetError(plistPath, isPermissionDenied(cause) ? `permission denied decoding ${noun} Info.plist ${plistPath}${codeDescription(cause)}` : isSystemErrorCode(cause) ? `could not decode ${noun} Info.plist ${plistPath}${codeDescription(cause)}` : `${noun} Info.plist is malformed, unsupported, or lacks CFBundleExecutable: ${plistPath}${cause instanceof Error ? ` (${cause.message})` : ""}`, {
					cause,
					...cause instanceof UndeclaredBundleExecutable ? {
						constraint: "bundle_executable_undeclared",
						infoPlist: plistPath
					} : {}
				}));
			}
			if (!isSafeExecutableName(name)) return err(new BinaryTargetError(bundle, `${noun} has an unsafe CFBundleExecutable`));
			const programs = join(bundle, ...layout.programs);
			const executable = join(programs, name);
			let canonicalBundle;
			try {
				canonicalBundle = await fileSystem.realpath(bundle);
			} catch (cause) {
				return err(new BinaryTargetError(bundle, errorReason(cause, bundle), { cause }));
			}
			try {
				const canonicalPrograms = await fileSystem.realpath(programs);
				if (!isPathWithinRoot(canonicalBundle, canonicalPrograms)) return err(new BinaryTargetError(bundle, `${noun} program directory leaves ${layout.programsLabel}`, {
					constraint: "bundle_path_escapes",
					probedPaths: [programs]
				}));
				const canonicalExecutable = await fileSystem.realpath(executable);
				if (!isPathWithinRoot(canonicalPrograms, canonicalExecutable)) return err(new BinaryTargetError(bundle, `${noun} program file leaves ${layout.programsLabel}`, {
					constraint: "bundle_path_escapes",
					probedPaths: [executable]
				}));
				return ok({
					executable: canonicalExecutable,
					infoPlist: plistPath
				});
			} catch (cause) {
				return err(new BinaryTargetError(executable, isPermissionDenied(cause) ? `permission denied resolving ${noun} program file ${executable}` : isAbsence(cause) ? `${noun} program file is missing: ${executable}` : `could not resolve ${noun} program file ${executable}`, {
					cause,
					...isAbsence(cause) ? {
						constraint: "bundle_program_missing",
						infoPlist: plistPath,
						probedPaths: [executable]
					} : {}
				}));
			}
		};
		decodeInfoPlistValue = (plist) => hasBinaryPlistSignature(plist) ? decodeBinaryPlistValue(plist, preflightPropertyListDecode(plist, BINARY_PLIST_DECODE_BYTES)) : parseXmlPropertyList(decodeXmlPlistText(plist)).value;
		UndeclaredBundleExecutable = class extends Error {};
		executableName = (value) => {
			const executable = executableEntrySchema.safeParse(value);
			if (!executable.success) throw new UndeclaredBundleExecutable("CFBundleExecutable is missing");
			return executable.data.CFBundleExecutable;
		};
		executableEntrySchema = z.looseObject({ CFBundleExecutable: z.string() });
		isSafeExecutableName = (name) => name.length > 0 && name !== "." && name !== ".." && !name.includes("\0") && !name.includes("/") && (sep !== "\\" || !name.includes("\\"));
	})))();
}

//#endregion
//#region dist/domain/gamecubeDol.js
var DOL_HEADER_SIZE, DOL_TEXT_SECTION_COUNT, DOL_DATA_SECTION_COUNT, DOL_MEMORY_START, DOL_RAM_END, TEXT_FILE_OFFSET_TABLE, DATA_FILE_OFFSET_TABLE, TEXT_ADDRESS_TABLE, DATA_ADDRESS_TABLE, TEXT_SIZE_TABLE, DATA_SIZE_TABLE, BSS_ADDRESS_FIELD, BSS_SIZE_FIELD, ENTRY_POINT_FIELD, hex, readSlots, rangesOverlap, parseDolHeader;
function init_gamecubeDol() {
	return (init_gamecubeDol = __esmMin((() => {
		init_result();
		DOL_HEADER_SIZE = 256;
		DOL_TEXT_SECTION_COUNT = 7;
		DOL_DATA_SECTION_COUNT = 11;
		DOL_MEMORY_START = 2147483648;
		DOL_RAM_END = 2172649472;
		TEXT_FILE_OFFSET_TABLE = 0;
		DATA_FILE_OFFSET_TABLE = 28;
		TEXT_ADDRESS_TABLE = 72;
		DATA_ADDRESS_TABLE = 100;
		TEXT_SIZE_TABLE = 144;
		DATA_SIZE_TABLE = 172;
		BSS_ADDRESS_FIELD = 216;
		BSS_SIZE_FIELD = 220;
		ENTRY_POINT_FIELD = 224;
		hex = (value) => `0x${value.toString(16)}`;
		readSlots = (view, kind, count, tables) => Array.from({ length: count }, (_, index) => ({
			kind,
			index,
			fileOffset: view.getUint32(tables.fileOffset + index * 4, false),
			address: view.getUint32(tables.address + index * 4, false),
			size: view.getUint32(tables.size + index * 4, false)
		}));
		rangesOverlap = (startA, sizeA, startB, sizeB) => startA < startB + sizeB && startB < startA + sizeA;
		parseDolHeader = (bytes, fileSize = bytes.length) => {
			if (fileSize < 256) return err(`DOL header is truncated: needs ${256} bytes; the file has ${fileSize}`);
			if (bytes.length < 256) return err(`DOL header bytes are incomplete: needs ${256} bytes; ${bytes.length} were supplied`);
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const slots = [...readSlots(view, "text", 7, {
				fileOffset: TEXT_FILE_OFFSET_TABLE,
				address: TEXT_ADDRESS_TABLE,
				size: TEXT_SIZE_TABLE
			}), ...readSlots(view, "data", 11, {
				fileOffset: DATA_FILE_OFFSET_TABLE,
				address: DATA_ADDRESS_TABLE,
				size: DATA_SIZE_TABLE
			})];
			const used = slots.filter((slot) => slot.size > 0);
			const label = (slot) => `${slot.kind} ${slot.index}`;
			for (const slot of used) {
				const name = label(slot);
				const fileEnd = slot.fileOffset + slot.size;
				const addressEnd = slot.address + slot.size;
				if (slot.fileOffset < 256) return err(`${name}: file offset ${hex(slot.fileOffset)} overlaps the ${256}-byte DOL header`);
				if (fileEnd > fileSize) return err(`${name}: file range ${hex(slot.fileOffset)}..${hex(fileEnd)} exceeds the ${fileSize}-byte file`);
				if (slot.address < 2147483648) return err(`${name}: load address ${hex(slot.address)} is below ${hex(DOL_MEMORY_START)}`);
				if (addressEnd > 2172649472) return err(`${name}: load range ${hex(slot.address)}..${hex(addressEnd)} exceeds ${hex(DOL_RAM_END)}`);
			}
			for (const slot of used) {
				if (slot.kind !== "text") continue;
				for (const [field, value] of [
					["file offset", slot.fileOffset],
					["load address", slot.address],
					["size", slot.size]
				]) if (value % 4 !== 0) return err(`${label(slot)}: ${field} ${hex(value)} must be 4-byte aligned`);
			}
			const text = used.filter((slot) => slot.kind === "text");
			if (text.length === 0) return err("DOL has no used text section");
			for (const [i, a] of used.entries()) {
				for (const b of used.slice(i + 1)) {
					if (rangesOverlap(a.address, a.size, b.address, b.size)) return err(`${label(a)} and ${label(b)} overlap in load address range`);
					if (rangesOverlap(a.fileOffset, a.size, b.fileOffset, b.size)) return err(`${label(a)} and ${label(b)} overlap in file range`);
				}
			}
			const entryPoint = view.getUint32(ENTRY_POINT_FIELD, false);
			if (entryPoint % 4 !== 0) return err(`entry point ${hex(entryPoint)} must be 4-byte aligned`);
			const inText = text.some((slot) => entryPoint >= slot.address && entryPoint < slot.address + slot.size);
			if (!inText) return err(`entry point ${hex(entryPoint)} is outside every used text section`);
			const bssAddress = view.getUint32(BSS_ADDRESS_FIELD, false);
			const bssSize = view.getUint32(BSS_SIZE_FIELD, false);
			const bssOverlaps = [];
			const bssData = [];
			if (bssSize > 0) {
				if (bssAddress < 2147483648) return err(`bss: load address ${hex(bssAddress)} is below ${hex(DOL_MEMORY_START)}`);
				if (bssAddress + bssSize > 2172649472) return err(`bss: load range ${hex(bssAddress)}..${hex(bssAddress + bssSize)} exceeds ${hex(DOL_RAM_END)}`);
				for (const slot of used) {
					if (!rangesOverlap(bssAddress, bssSize, slot.address, slot.size)) continue;
					if (slot.kind === "text") return err(`bss and ${label(slot)} overlap in load address range`);
					bssOverlaps.push(slot.index);
					bssData.push(slot);
				}
			}
			const bssGaps = [];
			const bssEnd = bssAddress + bssSize;
			let cursor = bssAddress;
			for (const slot of bssData.sort((left, right) => left.address - right.address)) {
				if (cursor < slot.address) bssGaps.push({
					address: cursor,
					size: slot.address - cursor
				});
				cursor = Math.min(bssEnd, slot.address + slot.size);
			}
			if (cursor < bssEnd) bssGaps.push({
				address: cursor,
				size: bssEnd - cursor
			});
			return ok({
				sections: used.map(({ kind, index, fileOffset, address, size }) => ({
					kind,
					index,
					fileOffset,
					address,
					size
				})),
				bss: {
					address: bssAddress,
					size: bssSize
				},
				bssGaps,
				bssOverlaps,
				entryPoint
			});
		};
	})))();
}

//#endregion
//#region dist/domain/gamecubeDolAdmission.js
var GAMECUBE_DOL_ARCHITECTURE, admitGamecubeDol;
function init_gamecubeDolAdmission() {
	return (init_gamecubeDolAdmission = __esmMin((() => {
		init_gamecubeDol();
		init_rawBinary();
		init_result();
		GAMECUBE_DOL_ARCHITECTURE = "powerpc";
		admitGamecubeDol = (input) => {
			const parsed = parseDolHeader(input.bytes, input.fileSize ?? input.bytes.length);
			if (!parsed.ok) return err({
				reason: `gamecube-dol header rejected: ${parsed.error}`,
				constraint: "file_format_rejected"
			});
			const header = parsed.value;
			const entryPoint = `0x${header.entryPoint.toString(16)}`;
			if (input.entryPoint !== undefined) {
				if (typeof input.entryPoint !== "string") return err({
					reason: "gamecube-dol entry_point must be a hexadecimal address of the form 0x…",
					constraint: "load_selection_rejected"
				});
				const requested = parseRawBinaryEntryPoint(input.entryPoint);
				if (!requested.ok) return err({
					reason: requested.error,
					constraint: "load_selection_rejected"
				});
				if (requested.value.value !== BigInt(header.entryPoint)) return err({
					reason: `gamecube-dol entry_point ${requested.value.canonical} conflicts with the DOL header entry ${entryPoint}`,
					constraint: "load_selection_rejected"
				});
			}
			return ok({
				architecture: GAMECUBE_DOL_ARCHITECTURE,
				entryPoint,
				entryPointSource: "dol-header",
				header
			});
		};
	})))();
}

//#endregion
//#region dist/application/BinaryTargetResolver.js
var XML_PLIST_PROBE_CHUNK_BYTES, parseBinaryTarget, readOpenedBinaryTarget, finalizedTargetResolution, targetFileCleanupError, targetResolutionFailure, classifyBinaryTargetFilesystemFailure, classifyTargetFilesystemFailure, filesystemErrorCode, targetFailureReason, throwIfTargetResolutionCancelled, detectArtifactFormat, isArchiveFormat, claimsLeadingExecutableHeader, readHandleRange, readLeadingBytes, sha256Handle, resolveAppBundle, readExecutableMetadata, readElfMetadata, readElfDeclarations, unresolvedMzHeaderFailure, readThinMachoMetadata, readMachoCommandFrames, readMachoSliceCommandFrames, readFatSliceHeaderEvidence, readPeMetadata, readPeCodeView;
function init_BinaryTargetResolver() {
	return (init_BinaryTargetResolver = __esmMin((() => {
		init_artifactNameSelection();
		init_readFileHandleRange();
		init_peCoffHeader();
		init_inesContainer();
		init_OwnedRegularFile();
		init_RegularFileRead();
		init_ArtifactReader();
		init_jsonValue();
		init_analysisErrorProjection();
		init_configurationErrors();
		init_RegularFile();
		init_analysisErrorCore();
		init_result();
		init_MipsElfMetadata();
		init_elfDeclaredRanges();
		init_riscvIsaDeclaration();
		init_AppBundleExecutable();
		init_appleBundleTypes();
		init_dosCom();
		init_rawBinary();
		init_gamecubeDolAdmission();
		init_gamecubeDol();
		init_dosMz();
		init_appleArchiveFormat();
		init_diskImageFormat();
		init_godotPckFormat();
		init_uimageFormat();
		init_unityfsFormat();
		init_wxapkgFormat();
		init_hexRecords();
		init_uf2();
		init_dfuse();
		init_fitImage();
		init_espFlashLocation();
		init_espFlashSelection();
		init_espImage();
		init_zipPackageFormat();
		init_binaryTarget();
		init_machoContainer();
		init_jvmClassFile();
		init_machoLoadCommands();
		init_callerPath();
		XML_PLIST_PROBE_CHUNK_BYTES = 64 * 1024;
		parseBinaryTarget = async (input, options = {}) => {
			const cwd = options.cwd ?? process.cwd();
			const { signal } = options;
			const candidate = absoluteCallerPath(input, { cwd });
			let stage = "resolve";
			const resolve = async () => {
				throwIfTargetResolutionCancelled(signal);
				await access(candidate, constants.R_OK);
				throwIfTargetResolutionCancelled(signal);
				const canonical = await realpath(candidate);
				stage = "read";
				const sourcePath = process.platform === "win32" ? candidate : canonical;
				throwIfTargetResolutionCancelled(signal);
				const resolved = await resolveAppBundle(canonical);
				throwIfTargetResolutionCancelled(signal);
				if (!resolved.ok) return err(resolved.error);
				const { executable: path, infoPlist } = resolved.value;
				const bundle = infoPlist === undefined ? {} : { bundleInfoPlist: infoPlist };
				const classifiedAs = infoPlist === undefined ? candidate : path;
				return withOwnedRegularFile(path, {
					symlinks: "reject",
					...signal === undefined ? {} : { signal }
				}, async (source) => {
					try {
						return await readOpenedBinaryTarget(source, {
							path,
							sourcePath,
							selectedPath: candidate,
							classifiedAs,
							...bundle
						}, options);
					} catch (cause) {
						throw new OwnedRegularFileOperationFailure(cause);
					}
				});
			};
			try {
				const resolved = await (options.resources === undefined ? resolve() : options.resources.run(resolve));
				return finalizedTargetResolution(resolved, signal);
			} catch (cause) {
				if (signal?.aborted === true && cause === signal.reason) return err(new AnalysisCancelledError("resolve_binary_target", { cause }));
				if (cause instanceof RegularFileCleanupFailure) {
					const fileFailure = cause;
					if (options.resources === undefined) return err(targetFileCleanupError(new RetainedRegularFileCleanupFailure(fileFailure), candidate, stage));
					const retried = await retryRegularFileCleanup(fileFailure, options.resources, signal);
					if (retried.failure !== undefined) return err(targetFileCleanupError(retried.failure, candidate, stage));
					if (retried.outcome.kind === "failed") return targetResolutionFailure(fileFailure.operationFailure ?? retried.outcome.cause, candidate, stage, signal);
					return finalizedTargetResolution(retried.outcome.value, signal);
				}
				if (cause instanceof RegularFileCancelled) return finalizedTargetResolution(cause.outcome.value, signal);
				if (cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined) {
					const error = new BinaryTargetError(candidate, "A previous target file could not be closed", {
						cause,
						cleanup: cause.cleanup,
						partialObservation: cause.partialObservation
					});
					bindRegularFileCleanup(cause, error);
					return err(error);
				}
				return targetResolutionFailure(cause, candidate, stage, signal);
			}
		};
		readOpenedBinaryTarget = async (source, selected, options) => {
			const { handle, initial: metadata } = source;
			const { path, sourcePath, selectedPath, classifiedAs, bundleInfoPlist } = selected;
			const bundle = bundleInfoPlist === undefined ? {} : { bundleInfoPlist };
			const identity = async () => ({
				path,
				sourcePath,
				...bundle,
				sha256: await sha256Handle(handle, path, metadata, signal)
			});
			const hostArchitecture = options.hostArchitecture ?? process.arch;
			const { targetKind, formatHint, signal, architecture, entryPoint } = options;
			throwIfTargetResolutionCancelled(signal);
			const flashPairing = espFlashSelectionError({
				format: formatHint,
				flashOffset: options.espFlash?.flashOffset,
				partitionTableOffset: options.espFlash?.partitionTableOffset
			});
			if (flashPairing !== undefined) return err(new BinaryTargetError(path, flashPairing, { constraint: "load_selection_rejected" }));
			if (formatHint === "raw-binary") {
				if (targetKind !== undefined && targetKind !== "executable") return err(new BinaryTargetError(path, "raw-binary format requires an executable target kind", { constraint: "load_selection_rejected" }));
				const admitted = admitRawBinary({
					architecture,
					entryPoint,
					fileBytes: metadata.size
				});
				if (!admitted.ok) return err(new BinaryTargetError(path, admitted.error.reason, { constraint: admitted.error.constraint }));
				return ok({
					...await identity(),
					kind: "executable",
					format: "raw-binary",
					architecture: admitted.value.architecture,
					availableArchitectures: [admitted.value.architecture],
					entryPoint: admitted.value.entryPoint,
					entryPointSource: admitted.value.entryPointSource
				});
			}
			const pairing = rawBinarySelectionError({
				...formatHint === undefined ? {} : { format: formatHint },
				architecture,
				entryPoint
			});
			if (pairing !== undefined) return err(new BinaryTargetError(path, pairing, { constraint: "load_selection_rejected" }));
			if (formatHint === "gamecube-dol") {
				if (targetKind !== undefined && targetKind !== "executable") return err(new BinaryTargetError(path, "gamecube-dol format requires an executable target kind", { constraint: "load_selection_rejected" }));
				const headerBytes = await readLeadingBytes(handle, Math.min(metadata.size, 256), path, signal);
				const admitted = admitGamecubeDol({
					bytes: headerBytes,
					fileSize: metadata.size,
					entryPoint
				});
				if (!admitted.ok) return err(new BinaryTargetError(path, admitted.error.reason, { constraint: admitted.error.constraint }));
				return ok({
					...await identity(),
					kind: "executable",
					format: "gamecube-dol",
					architecture: admitted.value.architecture,
					availableArchitectures: [admitted.value.architecture],
					byteOrder: "big",
					bits: 32,
					entryPoint: admitted.value.entryPoint,
					entryPointSource: admitted.value.entryPointSource,
					dol: admitted.value.header
				});
			}
			if (formatHint === "esp-flash-image") {
				if (targetKind !== undefined && targetKind !== "archive") return err(new BinaryTargetError(path, "ESP flash image format requires an archive target kind", { constraint: "load_selection_rejected" }));
				const selection = options.espFlash ?? {};
				const located = await locateEspFlashLayout(metadata.size, (position, length) => readHandleRange(handle, position, length, signal), selection, {
					explicit: true,
					...signal === undefined ? {} : { signal }
				});
				if (!located.ok) return err(new BinaryTargetError(path, `ESP flash image layout is not recognized: ${located.error}`, { constraint: "file_format_rejected" }));
				return ok({
					...await identity(),
					artifactSelectedPath: selectedPath,
					kind: "archive",
					format: "esp-flash-image",
					espFlash: {
						selected: true,
						flashOffset: selection.flashOffset ?? null,
						partitionTableOffset: selection.partitionTableOffset ?? null
					}
				});
			}
			if (formatHint === "dos-com") {
				if (targetKind !== undefined && targetKind !== "executable") return err(new BinaryTargetError(path, "DOS COM format requires an executable target kind", { constraint: "load_selection_rejected" }));
				const length = validateDosComLength(metadata.size);
				if (!length.ok) return err(new BinaryTargetError(path, length.error, { constraint: "file_format_rejected" }));
				return ok({
					...await identity(),
					kind: "executable",
					format: "dos-com",
					architecture: "x86",
					availableArchitectures: ["x86"]
				});
			}
			const classificationPath = artifactNameForClassification(classifiedAs, path);
			const artifactFormat = targetKind === "database" ? undefined : await detectArtifactFormat(classificationPath, source, signal, path);
			const artifactIdentity = async () => ({
				...await identity(),
				artifactSelectedPath: selectedPath
			});
			if (targetKind === "database" || targetKind === undefined && artifactFormat !== "ines" && artifactFormat !== "plist" && path.toLowerCase().endsWith(".hop")) return ok({
				...await identity(),
				kind: "database",
				format: "analysis-database"
			});
			if (artifactFormat !== undefined) {
				const identity = await artifactIdentity();
				if (artifactFormat === "esp-flash-image") return ok({
					...identity,
					kind: "archive",
					format: artifactFormat,
					espFlash: {
						selected: false,
						flashOffset: null,
						partitionTableOffset: null
					}
				});
				return isArchiveFormat(artifactFormat) ? ok({
					...identity,
					kind: "archive",
					format: artifactFormat
				}) : ok({
					...identity,
					kind: "artifact",
					format: artifactFormat
				});
			}
			const detected = await readExecutableMetadata(source, hostArchitecture, signal);
			if (!detected.ok) {
				if (!await claimsLeadingExecutableHeader(handle, metadata.size, signal) && await locateTrailingZipArchive(metadata.size, (position, length) => readHandleRange(handle, position, length, signal)) !== undefined) return ok({
					...await artifactIdentity(),
					kind: "archive",
					format: zipRootPackageFormat(classificationPath)
				});
				const reason = typeof detected.error === "string" ? detected.error : detected.error.reason;
				const diagnostics = typeof detected.error === "string" ? undefined : detected.error.diagnostics;
				return err(new BinaryTargetError(path, reason, {
					constraint: "file_format_rejected",
					...diagnostics === undefined ? {} : { diagnostics }
				}));
			}
			return ok({
				...await identity(),
				kind: "executable",
				...detected.value
			});
		};
		finalizedTargetResolution = (result, signal) => {
			if (!result.ok || signal?.aborted !== true) return result;
			return err(new AnalysisCancelledError("resolve_binary_target", {
				cause: signal.reason,
				diagnostics: { completed_target: jsonValueSchema.parse(result.value) }
			}));
		};
		targetFileCleanupError = (failure, candidate, stage) => {
			const cancellation = regularFileCancellation(failure);
			const completed = failure.outcome.kind === "completed" ? failure.outcome.value : undefined;
			const completedTarget = completed?.ok === true ? jsonValueSchema.parse(completed.value) : undefined;
			let primary;
			if (failure.outcome.kind === "failed") {
				const physical = failure.outcome.cause;
				primary = physical instanceof BinaryTargetError || physical instanceof AnalysisCancelledError ? physical : cancellation !== undefined ? new AnalysisCancelledError("resolve_binary_target", { cause: cancellation.reason }) : classifyTargetFilesystemFailure(candidate, physical, stage) ?? new BinaryTargetError(failure.path, "Target read failed before file cleanup", { cause: physical });
			} else if (completed?.ok === false) primary = completed.error;
			else if (cancellation !== undefined) primary = new AnalysisCancelledError("resolve_binary_target", {
				cause: cancellation.reason,
				...completedTarget === undefined ? {} : { diagnostics: { completed_target: completedTarget } }
			});
			const error = new BinaryTargetError(failure.path, "The target file handle could not be closed", {
				cause: failure,
				cleanupPrimary: primary,
				cleanup: {
					reason: failure.cleanupCause instanceof Error ? failure.cleanupCause.message : String(failure.cleanupCause),
					resources: [failure.path]
				},
				...childFailureDiagnostics(primary === undefined ? {} : { primary_error: { error: primary } }, completedTarget === undefined ? {} : { completed_target: completedTarget })
			});
			bindRegularFileCleanup(failure, error);
			return error;
		};
		targetResolutionFailure = (cause, candidate, stage, signal) => {
			const physical = cause instanceof OwnedRegularFileOperationFailure ? cause.operationCause : cause;
			if (physical instanceof AnalysisCancelledError || physical instanceof BinaryTargetError) return err(physical);
			if (!(cause instanceof OwnedRegularFileOperationFailure)) {
				const cancellation = regularFileCancellation(cause);
				if (cancellation !== undefined) return err(new AnalysisCancelledError("resolve_binary_target", { cause: cancellation.reason }));
			}
			if (signal?.aborted === true && physical === signal.reason) return err(new AnalysisCancelledError("resolve_binary_target", { cause: physical }));
			const failure = classifyTargetFilesystemFailure(candidate, physical, stage);
			if (failure === undefined) throw physical;
			return err(failure);
		};
		classifyBinaryTargetFilesystemFailure = (path, cause) => classifyTargetFilesystemFailure(path, cause, "read");
		classifyTargetFilesystemFailure = (path, cause, stage) => {
			if (!(cause instanceof Error)) return undefined;
			const code = filesystemErrorCode(cause);
			return code === undefined ? undefined : new BinaryTargetError(path, targetFailureReason(code, cause.message, stage), { cause });
		};
		filesystemErrorCode = (cause) => {
			const code = Reflect.get(cause, "code");
			return typeof code === "string" ? code : undefined;
		};
		targetFailureReason = (code, detail, stage) => {
			switch (code) {
				case "ENOENT":
				case "ENOTDIR": return `target does not exist or a path component is not a directory: ${detail}`;
				case "EACCES":
				case "EPERM": return `permission denied while reading target: ${detail}`;
				case "EISDIR": return `target is a directory, not a readable file: ${detail}`;
				case "ENOTFILE": return "target is not a regular file";
				case "ELOOP": return stage === "resolve" ? `target path could not be resolved: too many symbolic links or a symbolic link loop: ${detail}` : `target changed while being opened: ${detail}`;
				default: return `target could not be read (${code}): ${detail}`;
			}
		};
		throwIfTargetResolutionCancelled = (signal) => {
			if (signal?.aborted === true) throw new AnalysisCancelledError("resolve_binary_target", { cause: signal.reason });
		};
		detectArtifactFormat = async (path, source, signal, sourcePath = path) => {
			const { handle, initial } = source;
			throwIfTargetResolutionCancelled(signal);
			const lower = path.toLowerCase();
			const magic = Buffer.from(await readHandleRange(handle, 0, 4096, signal));
			try {
				await assertStableRegularFileIdentity(handle, sourcePath, initial, {
					symlinks: "reject",
					...signal === undefined ? {} : { signal }
				});
			} catch (cause) {
				throwIfTargetResolutionCancelled(signal);
				throw cause;
			}
			throwIfTargetResolutionCancelled(signal);
			if (magic.length >= 8 && magic.subarray(0, 8).equals(Buffer.from([
				0,
				97,
				115,
				109,
				1,
				0,
				0,
				0
			]))) throw new BinaryTargetError(path, "WebAssembly v1 artifacts are not supported by the native opening route", { constraint: "wasm_requires_static_inspection" });
			if (nesContainerFormat(magic) !== undefined) {
				const parsed = parseInesLayout(magic, initial.size);
				throwIfTargetResolutionCancelled(signal);
				if (!parsed.ok) throw new BinaryTargetError(path, parsed.error, { constraint: "file_format_rejected" });
				return "ines";
			}
			if (hasZipSignature(magic)) return zipRootPackageFormat(lower);
			if (hasGodotPckHeader(magic)) return "godot-pck";
			if (hasUnityFsHeader(magic)) return "unityfs";
			if (hasWxapkgEncryptedMagic(magic) || hasWxapkgHeader(magic)) return "wxapkg";
			if (hasUImageMagic(magic)) return "uimage";
			const hexRecords = detectHexRecordEncoding(magic);
			if (hexRecords !== undefined) return hexRecords;
			if (hasUf2Block(magic)) return "uf2";
			if (hasDfuSePrefix(magic) && initial.size >= 16 && isDfuSeFile(magic, await readHandleRange(handle, initial.size - 16, 16, signal), initial.size)) return "dfuse";
			const flash = await locateEspFlashLayout(initial.size, (position, length) => readHandleRange(handle, position, length, signal), {}, {
				explicit: false,
				...signal === undefined ? {} : { signal }
			});
			if (flash.ok) return "esp-flash-image";
			const esp = recognizeEspImage(magic, initial.size);
			if (esp === "esp8266") throw new BinaryTargetError(path, ESP8266_REFUSAL, { constraint: "file_format_rejected" });
			if (esp === "esp-image") return "esp-image";
			if (hasFitImagesNode(magic)) return "fit";
			if (hasBinaryPlistSignature(magic)) return "plist";
			const named = namedArtifactFormat(lower);
			if (named !== undefined && !claimsExecutableHeader(magic, initial.size)) return named;
			if (lower.endsWith(".pkg") && magic.length >= 4 && magic.subarray(0, 4).equals(Buffer.from("xar!"))) return "pkg";
			if (lower.endsWith(".dmg") && await hasDiskImageSignature(initial.size, (position, length) => readHandleRange(handle, position, length, signal))) return "dmg";
			const xmlProbe = createXmlPlistSignatureProbe();
			let xmlState = xmlProbe.write(magic);
			if (xmlState === "matched") return "plist";
			const chunk = Buffer.alloc(XML_PLIST_PROBE_CHUNK_BYTES);
			let bytesRead = magic.length;
			while (xmlState === "pending" && bytesRead < 1048576) {
				throwIfTargetResolutionCancelled(signal);
				const read = await handle.read(chunk, 0, Math.min(chunk.length, MAX_XML_PLIST_PROBE_BYTES - bytesRead), bytesRead);
				throwIfTargetResolutionCancelled(signal);
				if (read.bytesRead === 0) break;
				bytesRead += read.bytesRead;
				xmlState = xmlProbe.write(chunk.subarray(0, read.bytesRead));
				if (xmlState === "matched") return "plist";
			}
			if (bytesRead === 1048576) {
				const { size } = initial;
				throwIfTargetResolutionCancelled(signal);
				if (size > bytesRead) throw new BinaryTargetError(path, "XML plist prolog was not found within the 1 MiB format probe limit", { constraint: "file_format_rejected" });
			}
			return undefined;
		};
		isArchiveFormat = (format) => isZipPackageFormat(format) || [
			"asar",
			"ines",
			"godot-pck",
			"unityfs",
			"wxapkg",
			"uimage",
			"dmg",
			"pkg",
			"intel-hex",
			"srec",
			"esp-image",
			"uf2",
			"dfuse",
			"esp-flash-image",
			"fit"
		].includes(format);
		claimsLeadingExecutableHeader = async (handle, size, signal) => claimsExecutableHeader(Buffer.from(await readHandleRange(handle, 0, Math.min(size, 4096), signal)), size);
		readHandleRange = async (handle, position, length, signal) => {
			const bytes = await readFileHandleRange(handle, position, length, () => throwIfTargetResolutionCancelled(signal));
			throwIfTargetResolutionCancelled(signal);
			return bytes;
		};
		readLeadingBytes = async (handle, size, path, signal) => {
			const bytes = Buffer.allocUnsafe(size);
			let position = 0;
			while (position < size) {
				throwIfTargetResolutionCancelled(signal);
				const observed = await handle.read(bytes, position, size - position, position);
				if (observed.bytesRead === 0) throw new BinaryTargetError(path, "target changed while being read");
				position += observed.bytesRead;
			}
			return bytes;
		};
		sha256Handle = async (handle, path, initial, signal) => {
			const hash = createHash("sha256");
			const chunk = Buffer.allocUnsafe(64 * 1024);
			let position = 0;
			while (true) {
				throwIfTargetResolutionCancelled(signal);
				const observed = await handle.read(chunk, 0, Math.min(chunk.length, initial.size - position + 1), position);
				throwIfTargetResolutionCancelled(signal);
				if (observed.bytesRead === 0) break;
				hash.update(chunk.subarray(0, observed.bytesRead));
				position += observed.bytesRead;
				if (position > initial.size) throw new BinaryTargetError(path, "target grew while being read");
			}
			throwIfTargetResolutionCancelled(signal);
			try {
				await assertStableRegularFileIdentity(handle, path, initial, {
					symlinks: "reject",
					...signal === undefined ? {} : { signal }
				});
			} catch (cause) {
				throwIfTargetResolutionCancelled(signal);
				if (cause instanceof RegularFileChangedError) throw new BinaryTargetError(path, "target changed while being read", { cause });
				throw cause;
			}
			throwIfTargetResolutionCancelled(signal);
			if (position !== initial.size) throw new BinaryTargetError(path, "target changed while being read");
			return hash.digest("hex");
		};
		resolveAppBundle = async (path) => {
			const metadata = await stat(path);
			if (!metadata.isDirectory()) return ok({ executable: path });
			if (openableAppleBundleExtension(extname(path)) !== undefined) return resolveAppleBundleExecutable(path);
			if (isUnopenedAppleBundleExtension(extname(path))) return err(new BinaryTargetError(path, `${extname(path)} bundle directories are not opened by this route; it opens ${OPENABLE_APPLE_BUNDLE_TYPES_TEXT} bundle directories`, { constraint: "bundle_type_unsupported" }));
			return err(new BinaryTargetError(path, "this opening route requires a file or a supported Apple bundle directory", { constraint: "directory_requires_file" }));
		};
		readExecutableMetadata = async (source, hostArchitecture, signal) => {
			const { handle, initial } = source;
			throwIfTargetResolutionCancelled(signal);
			const bytes = await readHandleRange(handle, 0, 4096, signal);
			const fileSize = initial.size;
			if (bytes.length >= 2 && bytes[0] === 77 && bytes[1] === 90) {
				let evidence = parseMzHeaderEvidence(bytes, fileSize);
				let signatureEvidence;
				if (evidence.windowsHeader.state === "signature-needed") {
					const { offset } = evidence.windowsHeader;
					signatureEvidence = {
						offset,
						bytes: await readHandleRange(handle, offset, Math.min(4, fileSize - offset), signal)
					};
					evidence = withMzWindowsHeaderSignature(bytes, fileSize, evidence, signatureEvidence);
				}
				const { windowsHeader } = evidence;
				if (windowsHeader.state === "declared") {
					const limitation = mzWindowsHeaderLayoutLimitation(windowsHeader);
					if (limitation !== undefined) return err({
						reason: limitation,
						diagnostics: {
							unsupported_layout: true,
							mz_windows_header: { ...windowsHeader }
						}
					});
					return readPeMetadata(handle, windowsHeader.offset, {
						mzPrefix: bytes,
						fileSize,
						mzEvidence: evidence,
						signal
					});
				}
				const { relocationTableRead } = evidence;
				if (relocationTableRead !== undefined) {
					const observedBytes = await readHandleRange(handle, relocationTableRead.offset, relocationTableRead.byteLength, signal);
					evidence = parseMzHeaderEvidence(observedBytes, fileSize, signatureEvidence);
					if (evidence.windowsHeader.state === "candidate") return err(unresolvedMzHeaderFailure(evidence.windowsHeader, evidence.dos));
					return parseMzExecutableMetadata(observedBytes, evidence);
				}
				if (windowsHeader.state === "candidate") return err(unresolvedMzHeaderFailure(windowsHeader, evidence.dos));
				return parseMzExecutableMetadata(bytes, evidence);
			}
			if (bytes.length >= 4 && bytes.toString("hex", 0, 4) === "7f454c46") return readElfMetadata(handle, bytes, {
				fileSize,
				hostArchitecture,
				signal
			});
			const thin = await readThinMachoMetadata(handle, bytes, {
				fileSize,
				hostArchitecture,
				signal
			});
			if (thin !== null) return thin;
			const hasJvmMagic = bytes.length >= 4 && bytes.readUInt32BE(0) === 3405691582;
			if (hasJvmMagic && fileSize > bytes.length && fileSize <= 16777216) {
				const complete = await readHandleRange(handle, 0, fileSize, signal);
				if (complete.byteLength === fileSize && isJvmClassFile(complete)) return err("unsupported binary format");
			}
			const fatEvidence = await readFatSliceHeaderEvidence(handle, bytes, fileSize, signal);
			if (hasJvmMagic && fileSize > 16777216 && fatEvidence !== undefined && classifyFatContainerIdentity(fatEvidence.header, (offset) => fatEvidence.sliceHeadersByOffset.get(offset)?.magic).state === "malformed") return err(JVM_CLASS_IDENTITY_LIMIT_REASON);
			const parsed = parseExecutableHeader(bytes, hostArchitecture, fileSize, undefined, fatEvidence);
			if (parsed.ok && parsed.value.format === "mach-o-universal" && fatEvidence !== undefined) {
				for (const slice of fatEvidence.header.slices) {
					const framed = await readMachoSliceCommandFrames(handle, slice, signal);
					if (!framed.ok) return framed;
				}
			}
			return parsed;
		};
		readElfMetadata = async (handle, bytes, options) => {
			const { fileSize, hostArchitecture, signal } = options;
			const parsed = parseExecutableHeader(bytes, hostArchitecture, fileSize);
			if (!parsed.ok || parsed.value.format !== "elf") return parsed;
			const ranges = await readElfDeclarations(handle, bytes, validateElfDeclaredRanges(bytes, fileSize), signal);
			if (!ranges.ok) return ranges;
			if (parsed.value.architecture === "riscv") return ok({
				...parsed.value,
				riscv: {
					...parsed.value.riscv,
					isa: await readElfDeclarations(handle, bytes, readRiscvIsaDeclaration(bytes, fileSize), signal)
				}
			});
			if (parsed.value.architecture !== "mips" || parsed.value.mips.elfClass !== 32) return parsed;
			const declarations = await readMipsElfMetadata(handle, parsed.value.mips, () => throwIfTargetResolutionCancelled(signal));
			if (!declarations.ok) return declarations;
			return ok({
				...parsed.value,
				mips: {
					...parsed.value.mips,
					abiFlags: declarations.value.abiFlags,
					gnuAttributes: declarations.value.gnuAttributes,
					...declarations.value.sharedLoad === undefined ? {} : { sharedLoad: declarations.value.sharedLoad },
					...declarations.value.limitations.length === 0 ? {} : { limitations: declarations.value.limitations }
				}
			});
		};
		readElfDeclarations = async (handle, prefix, steps, signal) => {
			let next = steps.next();
			let window;
			while (!next.done) {
				throwIfTargetResolutionCancelled(signal);
				const { offset, size } = next.value;
				let bytes;
				if (offset + size <= prefix.length) bytes = prefix.subarray(offset, offset + size);
				else {
					window ??= Buffer.allocUnsafe(64 * 1024);
					bytes = window.subarray(0, size);
					let length = 0;
					while (length < size) {
						const read = await handle.read(bytes, length, size - length, offset + length);
						throwIfTargetResolutionCancelled(signal);
						if (read.bytesRead === 0) break;
						length += read.bytesRead;
					}
					bytes = bytes.subarray(0, length);
				}
				next = steps.next(bytes);
			}
			return next.value;
		};
		unresolvedMzHeaderFailure = (windowsHeader, dos) => {
			return {
				reason: "MZ Windows new-header candidate is unresolved",
				diagnostics: {
					mz_windows_header: {
						state: windowsHeader.state,
						offset: windowsHeader.offset,
						signature: windowsHeader.signature
					},
					mz_dos: dos.ok ? {
						state: "valid",
						header_bytes: dos.value.headerBytes,
						image_bytes: dos.value.imageBytes,
						module_bytes: dos.value.moduleBytes,
						overlay_bytes: dos.value.overlayBytes,
						relocation_count: dos.value.relocationCount,
						relocation_table_offset: dos.value.relocationTableOffset,
						entry_segment: dos.value.entrySegment,
						entry_offset: dos.value.entryOffset
					} : {
						state: "invalid",
						reason: dos.error
					}
				}
			};
		};
		readThinMachoMetadata = async (handle, prefix, input) => {
			const table = readMachoLoadCommandTableHeader(prefix, input.fileSize);
			if (!table.ok) return table;
			if (table.value === null) return null;
			const parsed = parseExecutableHeader(prefix.subarray(0, table.value.headerSize), input.hostArchitecture, input.fileSize);
			if (!parsed.ok) return parsed;
			const framed = await readMachoCommandFrames(handle, table.value, {
				prefix,
				fileSize: input.fileSize,
				signal: input.signal
			});
			return framed.ok ? parsed : framed;
		};
		readMachoCommandFrames = async (handle, table, input) => {
			const commands = new MachoLoadCommandCursor(table);
			let window = input.prefix;
			let windowOffset = 0;
			while (commands.nextOffset !== null) {
				const offset = table.headerSize + commands.nextOffset;
				if (offset + 8 <= input.fileSize && (offset < windowOffset || offset + 8 > windowOffset + window.length)) {
					windowOffset = offset;
					window = await readHandleRange(handle, (input.fileOffset ?? 0) + offset, Math.min(4096, input.fileSize - offset), input.signal);
				}
				const relative = offset - windowOffset;
				const frame = commands.read(relative >= 0 ? window.subarray(relative, relative + 8) : Buffer.alloc(0));
				if (!frame.ok) return frame;
			}
			return commands.finish();
		};
		readMachoSliceCommandFrames = async (handle, slice, signal) => {
			const bytes = await readHandleRange(handle, slice.offset, Math.min(4096, slice.size), signal);
			const table = readMachoLoadCommandTableHeader(bytes, slice.size);
			if (!table.ok) return table;
			if (table.value === null) return err("FAT slice does not identify a thin Mach-O image");
			return readMachoCommandFrames(handle, table.value, {
				prefix: bytes,
				fileSize: slice.size,
				fileOffset: slice.offset,
				signal
			});
		};
		readFatSliceHeaderEvidence = async (handle, prefix, fileSize, signal) => {
			let header = readFatContainerHeader(prefix, fileSize);
			if (header.state === "needs-data") {
				const table = await readHandleRange(handle, 0, header.requiredBytes, signal);
				header = readFatContainerHeader(table, fileSize);
			}
			if (header.state !== "parsed") return undefined;
			const sliceHeadersByOffset = new Map();
			for (let index = 0; index < header.slices.length; index += 1) {
				const slice = header.slices[index];
				if (slice === undefined) continue;
				if (header.rangeIssues[index] !== null) {
					sliceHeadersByOffset.set(slice.offset, readMachoHeaderPrefixFacts(Buffer.alloc(0)));
					continue;
				}
				const observedLength = Math.min(12, slice.size);
				const thinHeader = await readHandleRange(handle, slice.offset, observedLength, signal);
				sliceHeadersByOffset.set(slice.offset, readMachoHeaderPrefixFacts(thinHeader));
			}
			return {
				header,
				sliceHeadersByOffset
			};
		};
		readPeMetadata = async (handle, offset, { mzPrefix, fileSize, mzEvidence, signal }) => {
			throwIfTargetResolutionCancelled(signal);
			const fileHeader = await readHandleRange(handle, offset, 24, signal);
			if (fileHeader.length !== 24) return err("invalid or truncated PE header");
			const { windowsHeader } = withMzWindowsHeaderSignature(mzPrefix, fileSize, mzEvidence, {
				offset,
				bytes: fileHeader.subarray(0, 4)
			});
			if (windowsHeader.state !== "declared") return err("invalid Windows new-header signature in MZ image");
			if ([
				"NE",
				"LE",
				"LX"
			].includes(windowsHeader.signature)) return err(`unsupported ${windowsHeader.signature} executable in MZ image`);
			const coff = readPeCoffHeader(fileHeader.subarray(4));
			if (!coff.ok) return err("invalid or truncated PE header");
			const optionalHeaderSize = coff.value.optionalHeaderSize;
			if (optionalHeaderSize > 4096) return err("invalid PE optional header size");
			const numberOfSections = coff.value.sectionCount;
			const record = await readHandleRange(handle, offset, 24 + optionalHeaderSize, signal);
			if (record.length !== 24 + optionalHeaderSize) return err("invalid or truncated PE header");
			const codeView = await readPeCodeView(handle, offset, numberOfSections, record.subarray(24), optionalHeaderSize, signal);
			const parsed = parsePeRecordFacts(record, codeView);
			return parsed.ok ? ok(parsed.value.metadata) : parsed;
		};
		readPeCodeView = async (handle, peOffset, numberOfSections, optionalHeader, optionalHeaderSize, signal) => {
			throwIfTargetResolutionCancelled(signal);
			const debugDir = peDebugDirectoryEntry(optionalHeader);
			if (debugDir === undefined || numberOfSections > 96) return undefined;
			const sectionTableOffset = peOffset + 24 + optionalHeaderSize;
			const sectionTableSize = numberOfSections * 40;
			const sectionTable = await readHandleRange(handle, sectionTableOffset, sectionTableSize, signal);
			if (sectionTable.length !== sectionTableSize) return undefined;
			const debugFileOffset = peRvaToFileOffset(debugDir.debugRva, sectionTable, numberOfSections, debugDir.sizeOfHeaders, Math.min(debugDir.debugSize, 4096));
			if (debugFileOffset === undefined) return undefined;
			const maxDebugSize = Math.min(debugDir.debugSize, 4096);
			const debugDirectoryBuffer = await readHandleRange(handle, debugFileOffset, maxDebugSize, signal);
			for (const { fileOffset: pointerToRawData, declaredSize: sizeOfData } of peCodeViewDataRanges(debugDirectoryBuffer, sectionTable, numberOfSections, debugDir.sizeOfHeaders)) {
				const maxCodeViewRead = Math.min(sizeOfData, 4096);
				const codeViewBuffer = await readHandleRange(handle, pointerToRawData, maxCodeViewRead, signal);
				const parsed = parseCodeViewData(codeViewBuffer, sizeOfData);
				if (parsed !== undefined) return parsed;
			}
			return undefined;
		};
	})))();
}

//#endregion
export { resolveAppBundleResourceRoot as a, riscvFloatAbi as c, validateElfSectionTablePresence as d, init_elfDynamicEntry as f, readElfRelocationEntry as h, init_AppBundleExecutable as i, init_elfDeclaredRanges as l, init_elfRelocation as m, init_BinaryTargetResolver as n, init_riscvIsaDeclaration as o, readElfDynamicEntry as p, parseBinaryTarget as r, riscvAbiName as s, classifyBinaryTargetFilesystemFailure as t, readElfTableDeclarations as u };