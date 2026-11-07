import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { ESP_FLASH_SECTOR_BYTES, ESP_PARTITION_TABLE_DEFAULT_OFFSET, ESP_PARTITION_TABLE_MAX_BYTES, ESP_PARTITION_TABLE_SECTOR_BYTES, ESP_SIGNATURE_BLOCK_BYTES, decodeEspDescriptor, decodeEspPartitionTable, decodeEspSignatureBlock, espSignatureSlot, firstUnerased, hex as hex$1, init_espImageStructures, init_espPartitionTable, init_zipPackageFormat, offsetText, u16, u32, zipPackageFormatForPath } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_dosMz, init_peCoffHeader, init_peOptionalHeader, mzWindowsHeaderLayoutLimitation, parseMzHeaderEvidence, readPeCoffHeader, readPeOptionalHeaderDirectory, readPeOptionalHeaderFixedFields } from "./peOptionalHeader-DFX4E6Yt.js";
import { decodePeMachine, init_elfFixedHeader, init_peMachine, readElfFixedHeader, readPeOptionalHeader } from "./peMachine-ZLBsjOQY.js";
import { MachoLoadCommandCursor, classifyFatContainerEvidence, init_machoContainer, init_machoLoadCommands, readFatContainerHeader, readMachoHeaderPrefixFacts, readMachoLoadCommandTableHeader, validateFatSliceIdentity } from "./machoLoadCommands-B9RyDzRE.js";
import { createHash } from "node:crypto";
import { crc32 } from "node:zlib";

//#region dist/domain/elfSectionHeader.js
var readElfSectionHeader;
function init_elfSectionHeader() {
	return (init_elfSectionHeader = __esmMin((() => {
		init_result();
		readElfSectionHeader = (bytes, bits, littleEndian) => {
			const wide = bits === 64;
			if (bytes.byteLength < (wide ? 64 : 40)) return err({
				kind: "malformed",
				message: "ELF section header is truncated"
			});
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const word = (at) => wide ? view.getBigUint64(at, littleEndian) : BigInt(view.getUint32(at, littleEndian));
			return ok({
				nameOffset: view.getUint32(0, littleEndian),
				type: view.getUint32(4, littleEndian),
				flags: word(8),
				address: word(wide ? 16 : 12),
				offset: word(wide ? 24 : 16),
				size: word(wide ? 32 : 20),
				link: view.getUint32(wide ? 40 : 24, littleEndian),
				info: view.getUint32(wide ? 44 : 28, littleEndian),
				alignment: word(wide ? 48 : 32),
				entrySize: word(wide ? 56 : 36)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/elfProgramHeader.js
var readElfProgramHeader;
function init_elfProgramHeader() {
	return (init_elfProgramHeader = __esmMin((() => {
		init_result();
		readElfProgramHeader = (bytes, bits, littleEndian) => {
			const wide = bits === 64;
			if (bytes.byteLength < (wide ? 56 : 32)) return err({
				kind: "malformed",
				message: "ELF program header is truncated"
			});
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const word = (at) => wide ? view.getBigUint64(at, littleEndian) : BigInt(view.getUint32(at, littleEndian));
			return ok({
				type: view.getUint32(0, littleEndian),
				flags: view.getUint32(wide ? 4 : 24, littleEndian),
				offset: word(wide ? 8 : 4),
				virtualAddress: word(wide ? 16 : 8),
				physicalAddress: word(wide ? 24 : 12),
				fileSize: word(wide ? 32 : 16),
				memorySize: word(wide ? 40 : 20),
				alignment: word(wide ? 48 : 28)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/peSectionHeader.js
var readPeSectionHeader;
function init_peSectionHeader() {
	return (init_peSectionHeader = __esmMin((() => {
		init_result();
		readPeSectionHeader = (bytes) => {
			if (bytes.length < 40) return err({
				kind: "malformed",
				message: "PE section header is truncated"
			});
			const name = bytes.subarray(0, 8);
			const nul = name.indexOf(0);
			const virtual_size = bytes.readUInt32LE(8);
			const raw_size = bytes.readUInt32LE(16);
			return ok({
				name: name.toString("latin1", 0, nul < 0 ? name.length : nul),
				virtual_size,
				virtual_address: bytes.readUInt32LE(12),
				raw_size,
				offset: bytes.readUInt32LE(20),
				characteristics: bytes.readUInt32LE(36),
				size: virtual_size === 0 ? raw_size : Math.min(virtual_size, raw_size)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/elfRawTableDeclarations.js
var readElfRawTableDeclarations;
function init_elfRawTableDeclarations() {
	return (init_elfRawTableDeclarations = __esmMin((() => {
		init_result();
		readElfRawTableDeclarations = (bytes, format) => {
			const wide = format.elfClass === 64;
			if (bytes.byteLength < (wide ? 64 : 52)) return err({
				kind: "malformed",
				message: "ELF table declarations are truncated"
			});
			const little = format.byteOrder === "little";
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const word = (offset) => wide ? view.getBigUint64(offset, little) : BigInt(view.getUint32(offset, little));
			return ok({
				programs: {
					offset: word(wide ? 32 : 28),
					width: view.getUint16(wide ? 54 : 42, little),
					count: view.getUint16(wide ? 56 : 44, little)
				},
				sections: {
					offset: word(wide ? 40 : 32),
					width: view.getUint16(wide ? 58 : 46, little),
					count: view.getUint16(wide ? 60 : 48, little),
					namesIndex: view.getUint16(wide ? 62 : 50, little)
				}
			});
		};
	})))();
}

//#endregion
//#region dist/domain/godotPckFormat.js
var hasGodotPckHeader, readGodotPckHeaderFacts, readGodotPckTrailerFacts;
function init_godotPckFormat() {
	return (init_godotPckFormat = __esmMin((() => {
		hasGodotPckHeader = (bytes) => bytes.length >= 4 && bytes[0] === 71 && bytes[1] === 68 && bytes[2] === 80 && bytes[3] === 67;
		readGodotPckHeaderFacts = (bytes) => {
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			return {
				formatVersion: view.getUint32(4, true),
				engineMajor: view.getUint32(8, true),
				engineMinor: view.getUint32(12, true),
				enginePatch: view.getUint32(16, true)
			};
		};
		readGodotPckTrailerFacts = (trailer, fileSize) => {
			if (!hasGodotPckHeader(trailer.subarray(8, 12))) return { state: "absent" };
			const view = new DataView(trailer.buffer, trailer.byteOffset, trailer.byteLength);
			const packBytes = view.getBigUint64(0, true);
			const end = fileSize - 12;
			return {
				state: "declared",
				packBytes,
				start: packBytes > BigInt(end) ? null : end - Number(packBytes),
				end
			};
		};
	})))();
}

//#endregion
//#region dist/domain/binaryTarget.js
/** Interpret complete debug entries once; callers own directory and payload read bounds. */
function* peCodeViewDataRanges(directory, sectionTable, numberOfSections, sizeOfHeaders) {
	for (let offset = 0; offset + 28 <= directory.length; offset += 28) {
		if (directory.readUInt32LE(offset + 12) !== 2) continue;
		const declaredSize = directory.readUInt32LE(offset + 16);
		if (declaredSize < 16) continue;
		const rawPointer = directory.readUInt32LE(offset + 24);
		const fileOffset = rawPointer !== 0 ? rawPointer : peRvaToFileOffset(directory.readUInt32LE(offset + 20), sectionTable, numberOfSections, sizeOfHeaders, Math.min(declaredSize, PE_CODEVIEW_MAPPING_BYTES));
		if (fileOffset !== undefined) yield {
			fileOffset,
			declaredSize
		};
	}
}
var claimsExecutableHeader, parseExecutableHeader, CPU_TYPE_ARM64_32, parseThinMachO, validatedFatDeclarations, declaredFamilies, readFatArchitectureFamilies, parseFatMachO, fatSliceIdentityError, fatHostArchitecture, fatIdentityError, parseElf, parseMzExecutableMetadata, parsePeRecordFacts, parseCodeViewData, peDebugDirectoryEntry, peRvaToFileOffset, PE_CODEVIEW_MAPPING_BYTES, parsePeCodeViewFromBuffer, machArchitecture;
function init_binaryTarget() {
	return (init_binaryTarget = __esmMin((() => {
		init_result();
		init_peOptionalHeader();
		init_peCoffHeader();
		init_peSectionHeader();
		init_elfFixedHeader();
		init_dosMz();
		init_peMachine();
		init_machoContainer();
		init_machoLoadCommands();
		claimsExecutableHeader = (bytes, fileSize = bytes.length) => bytes.length >= 4 && (bytes.subarray(0, 4).equals(Buffer.from([
			127,
			69,
			76,
			70
		])) || readMachoHeaderPrefixFacts(bytes).format !== null) || bytes.length >= 2 && bytes[0] === 77 && bytes[1] === 90 || readFatContainerHeader(bytes, fileSize).state !== "not-fat";
		parseExecutableHeader = (bytes, hostArchitecture, fileSize = bytes.length, mzWindowsHeaderSignature, fatEvidence) => {
			if (bytes.length >= 4 && bytes.subarray(0, 4).equals(Buffer.from([
				127,
				69,
				76,
				70
			]))) return parseElf(bytes, fileSize);
			if (bytes.length >= 2 && bytes[0] === 77 && bytes[1] === 90) return parseMzExecutableMetadata(bytes, parseMzHeaderEvidence(bytes, fileSize, mzWindowsHeaderSignature));
			if (bytes.length < 8) return err("truncated or unsupported binary header");
			if (readMachoHeaderPrefixFacts(bytes).format !== null) return parseThinMachO(bytes, fileSize);
			const fatHeader = fatEvidence?.header ?? readFatContainerHeader(bytes, fileSize);
			if (fatHeader.state !== "not-fat") return parseFatMachO(bytes, hostArchitecture, fatHeader, fatEvidence);
			return err("unsupported binary format");
		};
		CPU_TYPE_ARM64_32 = 33554444;
		parseThinMachO = (bytes, fileSize) => {
			const table = readMachoLoadCommandTableHeader(bytes, fileSize);
			if (!table.ok) return table;
			if (table.value === null) return err("unsupported binary format");
			const { identity } = table.value;
			const architecture = identity.cpuType === CPU_TYPE_ARM64_32 ? "arm64_32" : machArchitecture(identity.cpuType);
			if (architecture === undefined) return err("unsupported Mach-O architecture");
			const commands = new MachoLoadCommandCursor(table.value);
			while (commands.nextOffset !== null) {
				const offset = table.value.headerSize + commands.nextOffset;
				if (offset + 8 > bytes.length && commands.nextOffset + 8 <= table.value.commandBytes) break;
				const frame = commands.read(bytes.subarray(offset, offset + 8));
				if (!frame.ok) return frame;
			}
			if (commands.nextOffset === null) {
				const complete = commands.finish();
				if (!complete.ok) return complete;
			}
			if (architecture === "arm64_32") return ok({
				format: "mach-o",
				architecture,
				availableArchitectures: [architecture]
			});
			return ok({
				format: "mach-o",
				architecture,
				availableArchitectures: [architecture]
			});
		};
		validatedFatDeclarations = (bytes, header, fatEvidence) => {
			if (header.state === "needs-data") return err("truncated or invalid FAT architecture table");
			if (header.state === "malformed") return err(header.reason);
			const identityError = fatIdentityError(bytes, header, fatEvidence?.sliceHeadersByOffset);
			if (identityError !== null) return err(identityError);
			const sliceIdentityError = fatSliceIdentityError(bytes, header, fatEvidence?.sliceHeadersByOffset);
			if (sliceIdentityError !== null) return err(sliceIdentityError);
			return ok(header.slices.flatMap((declaration) => {
				const architecture = machArchitecture(declaration.cpuType);
				return architecture === undefined ? [] : [{
					architecture,
					offset: declaration.offset,
					size: declaration.size
				}];
			}));
		};
		declaredFamilies = (declarations) => [...new Set(declarations.map(({ architecture }) => architecture))];
		readFatArchitectureFamilies = (bytes, fileSize = bytes.length) => {
			const header = readFatContainerHeader(bytes, fileSize);
			if (header.state === "not-fat") return null;
			const declarations = validatedFatDeclarations(bytes, header);
			return declarations.ok ? ok(declaredFamilies(declarations.value)) : declarations;
		};
		parseFatMachO = (bytes, host, header, fatEvidence) => {
			const validated = validatedFatDeclarations(bytes, header, fatEvidence);
			if (!validated.ok) return validated;
			const declarations = validated.value;
			const preferred = fatHostArchitecture(host);
			const hostSlice = declarations.find(({ architecture }) => architecture === preferred);
			const unambiguous = declarations.filter(({ architecture }) => declarations.filter((other) => other.architecture === architecture).length === 1);
			const candidates = hostSlice === undefined ? unambiguous : [hostSlice];
			const selected = candidates.find(({ architecture, size }) => size >= (architecture === "arm64" || architecture === "x86_64" ? 32 : 28));
			if (selected === undefined) {
				const first = candidates[0];
				if (first !== undefined) return err(`FAT slice for ${first.architecture} is shorter than its Mach-O header`);
				return err(declarations.length === 0 ? "FAT binary declares no supported Mach-O architecture" : `FAT binary has no ${host} slice and no foreign architecture declared exactly once`);
			}
			return ok({
				format: "mach-o-universal",
				architecture: selected.architecture,
				availableArchitectures: declaredFamilies(declarations),
				universalSlice: {
					offset: selected.offset,
					size: selected.size
				},
				universalSlices: header.state === "parsed" ? header.slices.map(({ offset, size, cpuType, cpuSubtype }) => ({
					offset,
					size,
					cpuType,
					cpuSubtype
				})) : []
			});
		};
		fatSliceIdentityError = (bytes, header, sliceHeadersByOffset) => {
			for (let index = 0; index < header.slices.length; index += 1) {
				const declaration = header.slices[index];
				if (declaration === undefined || header.rangeIssues[index] !== null) continue;
				let facts;
				if (sliceHeadersByOffset?.has(declaration.offset)) {
					facts = sliceHeadersByOffset.get(declaration.offset);
				} else if (declaration.size >= 12 && declaration.offset <= bytes.length - 12) {
					facts = readMachoHeaderPrefixFacts(bytes.subarray(declaration.offset, declaration.offset + 12));
				}
				const identity = facts?.identity;
				if (identity === null || identity === undefined) return `FAT architecture ${declaration.index} thin Mach-O CPU identity is outside the bounded header`;
				const identityError = validateFatSliceIdentity(declaration, identity);
				if (identityError !== null) return identityError;
			}
			return null;
		};
		fatHostArchitecture = (host) => {
			switch (host) {
				case "arm64": return "arm64";
				case "x64": return "x86_64";
				case "ia32": return "x86";
				case "arm": return "arm";
				default: return undefined;
			}
		};
		fatIdentityError = (bytes, header, sliceHeadersByOffset) => {
			const identity = classifyFatContainerEvidence(header, bytes, sliceHeadersByOffset);
			if (identity.state === "needs-slice-header") return "FAT slice identity is outside the bounded prefix";
			if (identity.state === "not-mach-o") return "unsupported binary format";
			if (identity.state === "malformed") return identity.reason;
			return null;
		};
		parseElf = (bytes, fileSize) => {
			const fixedHeader = readElfFixedHeader(bytes, fileSize);
			if (!fixedHeader.ok) return fixedHeader;
			const { elfClass, byteOrder, architecture, machine, type, flags } = fixedHeader.value;
			if (architecture === null) return err(`unsupported ELF architecture: e_machine ${String(machine)}`);
			if (architecture === "mips" || architecture === "riscv" || architecture === "powerpc") {
				const metadata = {
					elfClass,
					byteOrder,
					type,
					flags
				};
				if (architecture === "powerpc") return ok({
					format: "elf",
					architecture,
					availableArchitectures: [architecture],
					powerpc: metadata
				});
				return architecture === "mips" ? ok({
					format: "elf",
					architecture,
					availableArchitectures: [architecture],
					mips: metadata
				}) : ok({
					format: "elf",
					architecture,
					availableArchitectures: [architecture],
					riscv: metadata
				});
			}
			if (architecture === "hexagon") return ok({
				format: "elf",
				architecture,
				availableArchitectures: [architecture]
			});
			return ok({
				format: "elf",
				architecture,
				availableArchitectures: [architecture]
			});
		};
		parseMzExecutableMetadata = (bytes, evidence) => {
			const { windowsHeader } = evidence;
			if (windowsHeader.state === "header-needed" || windowsHeader.state === "signature-needed") return err("Windows new-header pointer or signature is outside the bounded prefix");
			if (windowsHeader.state === "candidate") return err("MZ Windows new-header candidate is unresolved");
			if (windowsHeader.state === "declared") {
				const { offset } = windowsHeader;
				const limitation = mzWindowsHeaderLayoutLimitation(windowsHeader);
				if (limitation !== undefined) return err(limitation);
				if (offset > bytes.length - 24) return err("invalid or truncated Windows executable header in MZ image");
				if ([
					"NE",
					"LE",
					"LX"
				].includes(windowsHeader.signature)) return err(`unsupported ${windowsHeader.signature} executable in MZ image`);
				if (windowsHeader.signature !== "PE") return err("invalid or truncated Windows executable header in MZ image");
				const codeView = parsePeCodeViewFromBuffer(bytes, offset);
				const parsed = parsePeRecordFacts(bytes.subarray(offset), codeView);
				return parsed.ok ? ok(parsed.value.metadata) : parsed;
			}
			const parsed = evidence.dos;
			return parsed.ok ? ok({
				format: "dos-mz",
				architecture: "x86",
				availableArchitectures: ["x86"]
			}) : parsed;
		};
		parsePeRecordFacts = (record, codeView) => {
			if (record.length < 24 || record.toString("binary", 0, 4) !== "PE\0\0") return err("invalid or truncated PE header");
			const coff = readPeCoffHeader(record.subarray(4, 24));
			if (!coff.ok) return err("invalid or truncated PE header");
			const { machine: machineType, optionalHeaderSize, characteristics } = coff.value;
			const machine = decodePeMachine(machineType);
			if (machine === undefined) return err(`unsupported PE architecture (COFF machine 0x${machineType.toString(16).padStart(4, "0")})`);
			if (optionalHeaderSize > 4096 || record.length < 24 + optionalHeaderSize) return err("invalid or truncated PE optional header");
			const optionalHeader = record.subarray(24, 24 + optionalHeaderSize);
			const facts = readPeOptionalHeader(optionalHeader, machineType);
			if (!facts.ok) return err(facts.error.message);
			if (facts.value.machine === null) return err("unsupported PE architecture");
			const { architecture } = facts.value.machine;
			return ok({
				optionalHeader: facts.value,
				metadata: {
					format: "pe",
					peMachine: machineType,
					architecture,
					availableArchitectures: [architecture],
					executableRole: (characteristics & 2) === 0 ? "non-executable" : (characteristics & 8192) === 0 ? "application" : "shared-library",
					managed: facts.value.managed,
					...codeView !== undefined ? { codeView } : {}
				}
			});
		};
		parseCodeViewData = (buffer, sizeOfData) => {
			if (sizeOfData < 16 || buffer.length < 16) return undefined;
			const magic = buffer.subarray(0, 4).toString("binary");
			const pathOffset = magic === "RSDS" ? 24 : magic === "NB10" ? 16 : undefined;
			if (pathOffset === undefined || sizeOfData <= pathOffset || buffer.length <= pathOffset) return undefined;
			const end = buffer.indexOf(0, pathOffset);
			if (end <= pathOffset || end >= sizeOfData) return undefined;
			const pdbPath = buffer.toString("utf8", pathOffset, end);
			const pdbFileName = pdbPath.split(/[/\\]/u).pop() ?? pdbPath;
			if (magic === "RSDS" && sizeOfData >= 24 && buffer.length >= 24) {
				const part1 = buffer.readUInt32LE(4).toString(16).padStart(8, "0");
				const part2 = buffer.readUInt16LE(8).toString(16).padStart(4, "0");
				const part3 = buffer.readUInt16LE(10).toString(16).padStart(4, "0");
				const part4 = buffer.subarray(12, 14).toString("hex");
				const part5 = buffer.subarray(14, 20).toString("hex");
				const guid = `${part1}-${part2}-${part3}-${part4}-${part5}`;
				const age = buffer.readUInt32LE(20);
				return {
					pdbPath,
					pdbFileName,
					guid,
					age
				};
			}
			if (magic === "NB10") {
				const age = buffer.readUInt32LE(12);
				return {
					pdbPath,
					pdbFileName,
					guid: null,
					age
				};
			}
			return undefined;
		};
		peDebugDirectoryEntry = (optionalHeader) => {
			const fixed = readPeOptionalHeaderFixedFields(optionalHeader);
			if (!fixed.ok) return undefined;
			const observed = readPeOptionalHeaderDirectory(optionalHeader, fixed.value, 6);
			if (observed.state !== "present") return undefined;
			const { address: debugRva, size: debugSize } = observed.directory;
			if (debugRva === 0 || debugSize < 28) return undefined;
			return {
				debugRva,
				debugSize,
				sizeOfHeaders: fixed.value.sizeOfHeaders
			};
		};
		peRvaToFileOffset = (rva, sectionTable, numberOfSections, sizeOfHeaders, size = 1) => {
			if (rva < sizeOfHeaders && size <= sizeOfHeaders - rva) return rva;
			for (let i = 0; i < numberOfSections; i++) {
				const offset = i * 40;
				const parsed = readPeSectionHeader(sectionTable.subarray(offset, offset + 40));
				if (!parsed.ok) break;
				const { virtual_address: virtualAddress, raw_size: sizeOfRawData, offset: pointerToRawData } = parsed.value;
				if (pointerToRawData > 0 && rva >= virtualAddress && rva - virtualAddress < sizeOfRawData && size <= sizeOfRawData - (rva - virtualAddress)) {
					return pointerToRawData + (rva - virtualAddress);
				}
			}
			return undefined;
		};
		PE_CODEVIEW_MAPPING_BYTES = 4096;
		parsePeCodeViewFromBuffer = (fileBytes, peOffset) => {
			if (fileBytes.length < peOffset + 24) return undefined;
			const coff = readPeCoffHeader(fileBytes.subarray(peOffset + 4, peOffset + 24));
			if (!coff.ok) return undefined;
			const { sectionCount: numberOfSections, optionalHeaderSize } = coff.value;
			if (optionalHeaderSize > 4096 || fileBytes.length < peOffset + 24 + optionalHeaderSize) return undefined;
			const optionalHeader = fileBytes.subarray(peOffset + 24, peOffset + 24 + optionalHeaderSize);
			const debugDir = peDebugDirectoryEntry(optionalHeader);
			if (debugDir === undefined) return undefined;
			const sectionTableOffset = peOffset + 24 + optionalHeaderSize;
			const sectionTableSize = numberOfSections * 40;
			if (fileBytes.length < sectionTableOffset + sectionTableSize) return undefined;
			const sectionTable = fileBytes.subarray(sectionTableOffset, sectionTableOffset + sectionTableSize);
			const debugFileOffset = peRvaToFileOffset(debugDir.debugRva, sectionTable, numberOfSections, debugDir.sizeOfHeaders, Math.min(debugDir.debugSize, 4096));
			if (debugFileOffset === undefined || fileBytes.length < debugFileOffset + 28) return undefined;
			const maxDebugBytes = Math.min(debugDir.debugSize, fileBytes.length - debugFileOffset);
			for (const { fileOffset: pointerToRawData, declaredSize: sizeOfData } of peCodeViewDataRanges(fileBytes.subarray(debugFileOffset, debugFileOffset + maxDebugBytes), sectionTable, numberOfSections, debugDir.sizeOfHeaders)) {
				if (fileBytes.length < pointerToRawData + Math.min(sizeOfData, 24)) continue;
				const codeViewData = fileBytes.subarray(pointerToRawData, Math.min(fileBytes.length, pointerToRawData + sizeOfData));
				const parsed = parseCodeViewData(codeViewData, sizeOfData);
				if (parsed !== undefined) return parsed;
			}
			return undefined;
		};
		machArchitecture = (cpu) => {
			switch (cpu) {
				case 7: return "x86";
				case 16777223: return "x86_64";
				case 12: return "arm";
				case 16777228: return "arm64";
			}
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/unityfsFormat.js
var UNITYFS_SIGNATURE, hasUnityFsHeader, UNITYFS_FLAG_COMPRESSION_MASK, UNITYFS_FLAG_BLOCKS_INFO_AT_END, UNITYFS_FLAG_PADDING_OR_LEGACY_ENCRYPTION, UNITYFS_FLAG_USES_BUNDLE_ENCRYPTION, UNITYFS_COMPRESSION_NONE, UNITYFS_COMPRESSION_LZ4, UNITYFS_COMPRESSION_LZ4HC, UNITYFS_FORMAT_VERSION_MIN, UNITYFS_FORMAT_VERSION_MAX, unityfsHeaderAligned, parseUnityFsRevision, hasModernUnityFsFlags, unityFsLayoutFlags, UNITYFS_HEADER_STRING_MAX, utf8, readUnityFsHeaderFacts;
function init_unityfsFormat() {
	return (init_unityfsFormat = __esmMin((() => {
		UNITYFS_SIGNATURE = Buffer.from("UnityFS\0", "latin1");
		hasUnityFsHeader = (bytes) => bytes.length >= UNITYFS_SIGNATURE.length && Buffer.from(bytes.buffer, bytes.byteOffset, UNITYFS_SIGNATURE.length).equals(UNITYFS_SIGNATURE);
		UNITYFS_FLAG_COMPRESSION_MASK = 63;
		UNITYFS_FLAG_BLOCKS_INFO_AT_END = 128;
		UNITYFS_FLAG_PADDING_OR_LEGACY_ENCRYPTION = 512;
		UNITYFS_FLAG_USES_BUNDLE_ENCRYPTION = 5120;
		UNITYFS_COMPRESSION_NONE = 0;
		UNITYFS_COMPRESSION_LZ4 = 2;
		UNITYFS_COMPRESSION_LZ4HC = 3;
		UNITYFS_FORMAT_VERSION_MIN = 6;
		UNITYFS_FORMAT_VERSION_MAX = 8;
		unityfsHeaderAligned = (formatVersion, engineMajor, engineMinor, enginePatch) => formatVersion >= 7 || engineMajor === 2019 && engineMinor === 4 && enginePatch !== undefined && enginePatch >= 15;
		parseUnityFsRevision = (value) => {
			const match = /^([1-9]\d*)\.(\d+)\.(\d+)(?:[abfp]\d+(?:c\d+)?)?$/u.exec(value);
			if (match === null) return undefined;
			const major = Number(match[1]), minor = Number(match[2]), patch = Number(match[3]);
			return [
				major,
				minor,
				patch
			].every(Number.isSafeInteger) ? [
				major,
				minor,
				patch
			] : undefined;
		};
		hasModernUnityFsFlags = ([major, minor, patch]) => {
			if (major < 2020) return false;
			if (major > 2022) return true;
			const minorThreshold = major === 2022 ? 1 : 3;
			const patchThreshold = major === 2020 ? 34 : major === 2021 ? 2 : 1;
			return minor > minorThreshold || minor === minorThreshold && patch >= patchThreshold;
		};
		unityFsLayoutFlags = (formatVersion, engineVersion, flags) => {
			const revision = parseUnityFsRevision(engineVersion);
			const reusedBit = (flags & UNITYFS_FLAG_PADDING_OR_LEGACY_ENCRYPTION) !== 0;
			const modernBits = (flags & UNITYFS_FLAG_USES_BUNDLE_ENCRYPTION) !== 0;
			if (revision === undefined) return {
				headerAligned: formatVersion >= 7 ? true : undefined,
				dataPadding: reusedBit ? undefined : false,
				encrypted: reusedBit || modernBits ? undefined : false
			};
			const modern = hasModernUnityFsFlags(revision);
			return {
				headerAligned: unityfsHeaderAligned(formatVersion, ...revision),
				dataPadding: modern && reusedBit,
				encrypted: modern ? modernBits : modernBits ? undefined : reusedBit
			};
		};
		UNITYFS_HEADER_STRING_MAX = 1024;
		utf8 = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
		readUnityFsHeaderFacts = (bytes) => {
			if (!hasUnityFsHeader(bytes)) return undefined;
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			let cursor = 12;
			const readString = () => {
				const start = cursor;
				while (cursor < bytes.length && cursor - start < 1024) {
					if (bytes[cursor] === 0) {
						const value = bytes.subarray(start, cursor);
						cursor += 1;
						try {
							return utf8.decode(value);
						} catch {
							return undefined;
						}
					}
					cursor += 1;
				}
				return undefined;
			};
			const playerVersion = readString();
			const engineVersion = readString();
			if (playerVersion === undefined || engineVersion === undefined || cursor + 20 > bytes.length) return undefined;
			const fixed = cursor;
			return {
				formatVersion: view.getUint32(8),
				playerVersion,
				engineVersion,
				declaredSize: view.getBigUint64(fixed),
				compressedBlocksInfoSize: view.getUint32(fixed + 8),
				uncompressedBlocksInfoSize: view.getUint32(fixed + 12),
				flags: view.getUint32(fixed + 16),
				afterFixed: fixed + 20
			};
		};
	})))();
}

//#endregion
//#region dist/domain/artifactNameSelection.js
var namedArtifactFormat, artifactNameForClassification;
function init_artifactNameSelection() {
	return (init_artifactNameSelection = __esmMin((() => {
		init_zipPackageFormat();
		namedArtifactFormat = (path) => {
			const lower = path.toLowerCase();
			if (lower.endsWith(".asar")) return "asar";
			if (lower.endsWith(".plist")) return "plist";
			if (lower.endsWith(".map")) return "source-map";
			return /\.(?:m?js|cjs)$/u.test(lower) ? "javascript" : undefined;
		};
		artifactNameForClassification = (selectedPath, canonicalPath) => namedArtifactFormat(selectedPath) !== undefined || zipPackageFormatForPath(selectedPath) !== undefined || /\.(?:app|pkg|dmg)$/iu.test(selectedPath) ? selectedPath : canonicalPath;
	})))();
}

//#endregion
//#region dist/domain/apple/diskImageFormat.js
var UDIF_TRAILER_BYTES, UDIF_TRAILER_SIGNATURE, GPT_HEADER_SIGNATURE, GPT_REVISION_1_0, HFS_PLUS_HEADER_END, RAW_SIGNATURE_PREFIX_BYTES, hasDiskImageSignature, hasRawDiskImageSignature, hasGptHeader, hasApplePartitionMap, hasMbrPartitionTable, hasHfsPlusVolumeHeader;
function init_diskImageFormat() {
	return (init_diskImageFormat = __esmMin((() => {
		UDIF_TRAILER_BYTES = 512;
		UDIF_TRAILER_SIGNATURE = Buffer.from("koly");
		GPT_HEADER_SIGNATURE = Buffer.from("EFI PART");
		GPT_REVISION_1_0 = 65536;
		HFS_PLUS_HEADER_END = 1028;
		RAW_SIGNATURE_PREFIX_BYTES = HFS_PLUS_HEADER_END;
		hasDiskImageSignature = async (size, read) => {
			if (!Number.isSafeInteger(size) || size <= 0) return false;
			if (size >= UDIF_TRAILER_BYTES) {
				const trailer = await read(size - UDIF_TRAILER_BYTES, UDIF_TRAILER_SIGNATURE.length);
				if (Buffer.from(trailer).equals(UDIF_TRAILER_SIGNATURE)) return true;
			}
			return hasRawDiskImageSignature(Buffer.from(await read(0, Math.min(size, RAW_SIGNATURE_PREFIX_BYTES))));
		};
		hasRawDiskImageSignature = (prefix) => hasGptHeader(prefix) || hasApplePartitionMap(prefix) || hasMbrPartitionTable(prefix) || hasHfsPlusVolumeHeader(prefix);
		hasGptHeader = (prefix) => {
			if (prefix.length < 528) return false;
			if (!prefix.subarray(512, 520).equals(GPT_HEADER_SIGNATURE)) return false;
			const headerSize = prefix.readUInt32LE(524);
			return prefix.readUInt32LE(520) === GPT_REVISION_1_0 && headerSize >= 92 && headerSize <= 512;
		};
		hasApplePartitionMap = (prefix) => prefix.length >= 514 && prefix[0] === 69 && prefix[1] === 82 && prefix[512] === 80 && prefix[513] === 77;
		hasMbrPartitionTable = (prefix) => {
			if (prefix.length < 512 || prefix[510] !== 85 || prefix[511] !== 170) return false;
			let used = false;
			for (let entry = 446; entry < 510; entry += 16) {
				const status = prefix[entry];
				if (status !== 0 && status !== 128) return false;
				used ||= prefix[entry + 4] !== 0 && prefix.readUInt32LE(entry + 12) !== 0;
			}
			return used;
		};
		hasHfsPlusVolumeHeader = (prefix) => {
			if (prefix.length < HFS_PLUS_HEADER_END || prefix[1024] !== 72) return false;
			const version = prefix.readUInt16BE(1026);
			return prefix[1025] === 43 && version === 4 || prefix[1025] === 88 && version === 5;
		};
	})))();
}

//#endregion
//#region dist/domain/uimageFormat.js
var UIMAGE_MAGIC, UIMAGE_HEADER_SIZE, UIMAGE_NAME_LENGTH, UIMAGE_MAX_SUB_IMAGES, UIMAGE_MULTI_TABLE_WINDOW, hasUImageSizeTable, ARCH_NAMES, OS_NAMES, TYPE_NAMES, COMPRESSION_NAMES, named$1, malformed, UTF8, hasUImageMagic, parseUImageHeaderFields, parseMultiImageTable;
function init_uimageFormat() {
	return (init_uimageFormat = __esmMin((() => {
		init_result();
		UIMAGE_MAGIC = 654645590;
		UIMAGE_HEADER_SIZE = 64;
		UIMAGE_NAME_LENGTH = 32;
		UIMAGE_MAX_SUB_IMAGES = 4096;
		UIMAGE_MULTI_TABLE_WINDOW = (UIMAGE_MAX_SUB_IMAGES + 1) * 4;
		hasUImageSizeTable = (type) => type === 4 || type === 6;
		ARCH_NAMES = {
			0: "invalid",
			1: "alpha",
			2: "arm",
			3: "x86",
			4: "ia64",
			5: "mips",
			6: "mips64",
			7: "ppc",
			8: "s390",
			9: "sh",
			10: "sparc",
			11: "sparc64",
			12: "m68k",
			13: "nios",
			14: "microblaze",
			15: "nios2",
			16: "blackfin",
			17: "avr32",
			18: "st200",
			19: "sandbox",
			20: "nds32",
			21: "openrisc",
			22: "arm64",
			23: "arc",
			24: "x86_64",
			25: "xtensa",
			26: "riscv"
		};
		OS_NAMES = {
			0: "invalid",
			1: "openbsd",
			2: "netbsd",
			3: "freebsd",
			4: "4_4bsd",
			5: "linux",
			6: "svr4",
			7: "esix",
			8: "solaris",
			9: "irix",
			10: "sco",
			11: "dell",
			12: "ncr",
			13: "lynxos",
			14: "vxworks",
			15: "psos",
			16: "qnx",
			17: "u-boot",
			18: "rtems",
			19: "artos",
			20: "unity",
			21: "integrity",
			22: "ose",
			23: "plan9",
			24: "openrtos",
			25: "arm-trusted-firmware",
			26: "tee",
			27: "opensbi",
			28: "efi",
			29: "elf"
		};
		TYPE_NAMES = {
			0: "invalid",
			1: "standalone",
			2: "kernel",
			3: "ramdisk",
			4: "multi",
			5: "firmware",
			6: "script",
			7: "filesystem",
			8: "flat_dt",
			9: "kwbimage",
			10: "imximage",
			11: "ublimage",
			12: "omapimage",
			13: "aisimage",
			14: "kernel_noload",
			15: "pblimage",
			16: "mxsimage",
			17: "gpimage",
			18: "atmelimage",
			19: "socfpgaimage",
			20: "x86_setup",
			21: "lpc32xximage",
			22: "loadable",
			23: "rkimage",
			24: "rksd",
			25: "rkspi",
			26: "zynqimage",
			27: "zynqmpimage",
			28: "zynqmpbif",
			29: "fpga",
			30: "vybridimage",
			31: "tee",
			32: "firmware_ivt",
			33: "pmmc",
			34: "stm32image",
			35: "socfpgaimage_v1",
			36: "mtk_image",
			37: "imx8mimage",
			38: "imx8image",
			39: "copro",
			40: "sunxi_egon",
			41: "sunxi_toc0",
			42: "fdt_legacy",
			43: "spkgimage",
			44: "sfspl",
			45: "tfa-bl31",
			46: "stm32imagev2",
			47: "amlimage"
		};
		COMPRESSION_NAMES = {
			0: "none",
			1: "gzip",
			2: "bzip2",
			3: "lzma",
			4: "lzo",
			5: "lz4",
			6: "zstd"
		};
		named$1 = (table, value) => table[value] ?? "unknown";
		malformed = (message) => ({
			_tag: "UImageFormatFailure",
			message
		});
		UTF8 = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
		hasUImageMagic = (prefix) => prefix.length >= 4 && prefix.readUInt32BE(0) === 654645590;
		parseUImageHeaderFields = (header) => {
			if (header.length < 64) return err(malformed(`uImage header is truncated: ${header.length} bytes, expected ${64}`));
			if (header.readUInt32BE(0) !== 654645590) return err(malformed(`uImage magic mismatch: expected 0x${UIMAGE_MAGIC.toString(16)}, found 0x${header.readUInt32BE(0).toString(16)}`));
			const declaredHeaderCrc = header.readUInt32BE(4);
			const zeroed = Buffer.from(header.subarray(0, 64));
			zeroed.writeUInt32BE(0, 4);
			const computedHeaderCrc = crc32(zeroed);
			if (computedHeaderCrc !== declaredHeaderCrc) return err(malformed(`uImage header CRC32 mismatch: declared 0x${declaredHeaderCrc.toString(16)}, computed 0x${computedHeaderCrc.toString(16)}`));
			const timestamp = header.readUInt32BE(8);
			const nameBytes = header.subarray(32, 32 + 32);
			const nul = nameBytes.indexOf(0);
			let name;
			try {
				name = UTF8.decode(nameBytes.subarray(0, nul === -1 ? 32 : nul));
			} catch {
				name = null;
			}
			const os = header[28] ?? 0;
			const arch = header[29] ?? 0;
			const type = header[30] ?? 0;
			const compression = header[31] ?? 0;
			return ok({
				magic: UIMAGE_MAGIC,
				timestamp,
				timestampIso: new Date(timestamp * 1e3).toISOString(),
				payloadSize: header.readUInt32BE(12),
				loadAddress: header.readUInt32BE(16),
				entryPoint: header.readUInt32BE(20),
				headerCrc32: declaredHeaderCrc,
				dataCrc32: header.readUInt32BE(24),
				os,
				osName: named$1(OS_NAMES, os),
				arch,
				archName: named$1(ARCH_NAMES, arch),
				type,
				typeName: named$1(TYPE_NAMES, type),
				compression,
				compressionName: named$1(COMPRESSION_NAMES, compression),
				name,
				nameBytesHex: nameBytes.toString("hex")
			});
		};
		parseMultiImageTable = (prefix, payloadSize) => {
			if (!Number.isSafeInteger(payloadSize) || payloadSize < 0) return err(malformed("uImage payload size is not an exact nonnegative extent"));
			const sizes = [];
			let cursor = 0;
			for (;;) {
				if (cursor + 4 > prefix.length || cursor + 4 > payloadSize) return err(malformed("uImage multi-image size table has no zero terminator inside the payload"));
				const size = prefix.readUInt32BE(cursor);
				cursor += 4;
				if (size === 0) break;
				sizes.push(size);
				if (sizes.length > 4096) return err({
					_tag: "UImageCapacityFailure",
					message: `uImage multi-image table declares more than ${UIMAGE_MAX_SUB_IMAGES} sub-images`
				});
			}
			const subImages = [];
			let offset = 64 + cursor;
			for (const [index, size] of sizes.entries()) {
				if (offset + size > 64 + payloadSize) return err(malformed(`uImage multi-image sub-image ${index} of ${size} bytes overruns the ${payloadSize}-byte payload`));
				subImages.push({
					index,
					byteOffset: offset,
					declaredSize: size
				});
				offset += index + 1 < sizes.length ? Math.ceil(size / 4) * 4 : size;
			}
			return ok(subImages);
		};
	})))();
}

//#endregion
//#region dist/domain/wxapkgFormat.js
var WXAPKG_FIRST_MARK, WXAPKG_LAST_MARK, WXAPKG_HEADER_BYTES, WXAPKG_MIN_ROW_BYTES, WXAPKG_MEMBER_COUNT_BYTES, WXAPKG_ENCRYPTED_MAGIC, hasWxapkgEncryptedMagic, readWxapkgHeaderFacts, hasWxapkgHeader, spanEnd, indexLayout, resolveWxapkgIndexLayouts, memberFitsIndex, selectWxapkgIndexLayout;
function init_wxapkgFormat() {
	return (init_wxapkgFormat = __esmMin((() => {
		init_result();
		WXAPKG_FIRST_MARK = 190;
		WXAPKG_LAST_MARK = 237;
		WXAPKG_HEADER_BYTES = 18;
		WXAPKG_MIN_ROW_BYTES = 12;
		WXAPKG_MEMBER_COUNT_BYTES = 4;
		WXAPKG_ENCRYPTED_MAGIC = Buffer.from("V1MMWX", "latin1");
		hasWxapkgEncryptedMagic = (bytes) => bytes.length >= WXAPKG_ENCRYPTED_MAGIC.length && Buffer.from(bytes.buffer, bytes.byteOffset, WXAPKG_ENCRYPTED_MAGIC.length).equals(WXAPKG_ENCRYPTED_MAGIC);
		readWxapkgHeaderFacts = (bytes) => {
			if (bytes.length < 18 || bytes[0] !== 190 || bytes[13] !== 237) return undefined;
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const info = view.getUint32(1);
			const indexLength = view.getUint32(5);
			const dataLength = view.getUint32(9);
			const fileCount = view.getUint32(14);
			if (fileCount === 0 || indexLength < fileCount * 12) return undefined;
			return {
				info,
				indexLength,
				dataLength,
				fileCount
			};
		};
		hasWxapkgHeader = (bytes) => bytes.length >= 18 && bytes[0] === 190 && bytes[13] === 237;
		spanEnd = (start, length) => {
			if (!Number.isSafeInteger(start) || !Number.isSafeInteger(length) || length < 0) return undefined;
			const end = start + length;
			return Number.isSafeInteger(end) ? end : undefined;
		};
		indexLayout = (facts, fileSize, includedCountBytes) => {
			if (!Number.isSafeInteger(facts.indexLength) || !Number.isSafeInteger(facts.fileCount) || facts.fileCount < 0 || facts.indexLength < includedCountBytes) return "too-small";
			const tableBytes = facts.indexLength - includedCountBytes;
			if (tableBytes < facts.fileCount * 12) return "too-small";
			const dataStart = spanEnd(18, tableBytes);
			if (dataStart === undefined || dataStart > fileSize) return "index-outside";
			const dataEnd = spanEnd(dataStart, facts.dataLength);
			if (dataEnd === undefined || dataEnd > fileSize) return "data-outside";
			return {
				tableStart: 18,
				tableBytes,
				dataStart,
				dataEnd
			};
		};
		resolveWxapkgIndexLayouts = (facts, fileSize) => {
			if (!Number.isSafeInteger(fileSize) || fileSize < 0) return err({ _tag: "IndexExceedsFile" });
			const described = [WXAPKG_MEMBER_COUNT_BYTES, 0].map((included) => indexLayout(facts, fileSize, included));
			const admissible = described.filter((layout) => typeof layout !== "string");
			if (admissible.length === 0) return err({ _tag: described.some((layout) => layout === "data-outside") ? "DataRegionExceedsFile" : "IndexExceedsFile" });
			return ok(admissible);
		};
		memberFitsIndex = (layout, member) => {
			const extentEnd = member.offset + member.size;
			return member.offset >= layout.dataStart && extentEnd <= layout.dataEnd && extentEnd >= member.offset;
		};
		selectWxapkgIndexLayout = (layouts, consumedRowBytes, members) => {
			const fitting = layouts.filter((layout) => layout.tableBytes >= consumedRowBytes && members.every((member) => memberFitsIndex(layout, member)));
			const exactRows = fitting.filter((layout) => layout.tableBytes === consumedRowBytes);
			const pool = exactRows.length > 0 ? exactRows : fitting;
			let selected;
			for (const layout of pool) {
				if (selected === undefined || layout.tableBytes < selected.tableBytes) selected = layout;
			}
			return selected;
		};
	})))();
}

//#endregion
//#region dist/domain/firmware/addressRuns.js
var runEnd, mergeArenaRuns, mergeRange;
function init_addressRuns() {
	return (init_addressRuns = __esmMin((() => {
		init_result();
		runEnd = (run) => run === undefined ? 0 : run.address + run.length;
		mergeArenaRuns = (runs, arena, space = () => 0) => {
			const ordered = [...runs].sort((left, right) => space(left) - space(right) || left.address - right.address);
			const ranges = [];
			let duplicateBytes = 0;
			let first = 0;
			while (first < ordered.length) {
				const head = ordered[first];
				if (head === undefined) break;
				let next = first + 1;
				let end = runEnd(head);
				while (next < ordered.length) {
					const candidate = ordered[next];
					if (candidate === undefined || space(candidate) !== space(head) || candidate.address > end) break;
					end = Math.max(end, runEnd(candidate));
					next += 1;
				}
				const range = mergeRange(ordered.slice(first, next), end, arena);
				if (!range.ok) return range;
				ranges.push(range.value.range);
				duplicateBytes += range.value.duplicateBytes;
				first = next;
			}
			return ok({
				ranges,
				duplicateBytes
			});
		};
		mergeRange = (group, end, arena) => {
			const start = group[0]?.address ?? 0;
			const bytes = new Uint8Array(end - start);
			let written = start;
			let duplicateBytes = 0;
			for (const run of group) {
				const overlapEnd = Math.min(written, runEnd(run));
				for (let address = run.address; address < overlapEnd; address += 1) {
					const existing = bytes[address - start] ?? 0;
					const incoming = arena[run.offset + address - run.address] ?? 0;
					if (existing !== incoming) return err({
						address,
						writer: group.find((candidate) => candidate !== run && candidate.address <= address && address < runEnd(candidate)) ?? run,
						run,
						existing,
						incoming
					});
				}
				duplicateBytes += Math.max(overlapEnd - run.address, 0);
				if (runEnd(run) > written) {
					bytes.set(arena.subarray(run.offset + written - run.address, run.offset + run.length), written - start);
					written = runEnd(run);
				}
			}
			return ok({
				range: {
					start,
					bytes,
					runs: group
				},
				duplicateBytes
			});
		};
	})))();
}

//#endregion
//#region dist/domain/firmware/hexRecordSyntax.js
var INTEL_HEX_MAX_LINE_CHARS, SREC_MAX_LINE_CHARS, LF, CR, COLON, LETTER_S, INTEL_FIXED_DATA_BYTES, SREC_ADDRESS_BYTES, SREC_DATA_LIMITS, SREC_WIDTH_OF, HEX_VALUES, hex, readBigEndian, maxLineChars, trimTrailingBlanks, decodeHexDigits, byteSum, startCharacterFailure, parseIntelRecord, parseSrecRecord, parseRecord;
function init_hexRecordSyntax() {
	return (init_hexRecordSyntax = __esmMin((() => {
		init_result();
		INTEL_HEX_MAX_LINE_CHARS = 521;
		SREC_MAX_LINE_CHARS = 514;
		LF = 10;
		CR = 13;
		COLON = 58;
		LETTER_S = 83;
		INTEL_FIXED_DATA_BYTES = [
			undefined,
			0,
			2,
			4,
			2,
			4
		];
		SREC_ADDRESS_BYTES = [
			2,
			2,
			3,
			4,
			undefined,
			2,
			3,
			4,
			3,
			2
		];
		SREC_DATA_LIMITS = {
			S1: 65535,
			S2: 16777215,
			S3: 4294967295
		};
		SREC_WIDTH_OF = {
			S1: "S19",
			S2: "S28",
			S3: "S37",
			S9: "S19",
			S8: "S28",
			S7: "S37"
		};
		HEX_VALUES = (() => {
			const table = new Int8Array(256).fill(-1);
			for (const [value, digit] of [..."0123456789abcdef"].entries()) {
				table[digit.charCodeAt(0)] = value;
				table[digit.toUpperCase().charCodeAt(0)] = value;
			}
			return table;
		})();
		hex = (value, digits) => value.toString(16).padStart(digits, "0");
		readBigEndian = (bytes) => bytes.reduce((value, byte) => value * 256 + byte, 0);
		maxLineChars = (encoding) => encoding === "intel-hex" ? 521 : 514;
		trimTrailingBlanks = (line, length) => {
			let end = length;
			while (end > 0 && (line[end - 1] === 32 || line[end - 1] === 9)) end -= 1;
			return end;
		};
		decodeHexDigits = (line, from) => {
			for (let column = from; column < line.length; column += 1) if (HEX_VALUES[line[column] ?? 0] === -1) return err(`invalid character 0x${hex(line[column] ?? 0, 2)} at column ${String(column + 1)}`);
			if ((line.length - from) % 2 !== 0) return err(`odd number of hex digits (${String(line.length - from)})`);
			const bytes = new Uint8Array((line.length - from) / 2);
			for (let index = 0; index < bytes.length; index += 1) bytes[index] = (HEX_VALUES[line[from + index * 2] ?? 0] ?? 0) * 16 + (HEX_VALUES[line[from + index * 2 + 1] ?? 0] ?? 0);
			return ok(bytes);
		};
		byteSum = (bytes) => bytes.reduce((sum, byte) => sum + byte, 0);
		startCharacterFailure = (line, expected) => `invalid character 0x${hex(line[0] ?? 0, 2)} at column 1; a record starts with '${expected}'`;
		parseIntelRecord = (line) => {
			if (line[0] !== 58) return err(startCharacterFailure(line, ":"));
			const decoded = decodeHexDigits(line, 1);
			if (!decoded.ok) return decoded;
			const bytes = decoded.value;
			if (bytes.length < 5) return err(`record holds ${String(bytes.length)} bytes; count, address, type and checksum need 5`);
			const count = bytes[0] ?? 0;
			const typeCode = bytes[3] ?? 0;
			const type = hex(typeCode, 2);
			if (bytes.length !== count + 5) return err(`record type ${type} byte count 0x${hex(count, 2)} declares ${String(count)} data bytes, but the line holds ${String(bytes.length - 5)}`);
			const declared = bytes[bytes.length - 1] ?? 0;
			const computed = -byteSum(bytes.subarray(0, -1)) & 255;
			if (declared !== computed) return err(`record type ${type} checksum 0x${hex(declared, 2)} does not match computed 0x${hex(computed, 2)}`);
			if (typeCode > 5) return err(`unknown record type ${type}`);
			const fixed = INTEL_FIXED_DATA_BYTES[typeCode];
			if (fixed !== undefined && count !== fixed) return err(`record type ${type} requires ${String(fixed)} data bytes, found ${String(count)}`);
			const address = readBigEndian(bytes.subarray(1, 3));
			if (typeCode >= 2 && address !== 0) return err(`record type ${type} requires address 0x0000, found 0x${hex(address, 4)}`);
			return ok({
				type,
				address,
				data: bytes.subarray(4, 4 + count)
			});
		};
		parseSrecRecord = (line) => {
			if (line[0] !== 83) return err(startCharacterFailure(line, "S"));
			if (line.length < 2) return err("record has no type character");
			const digit = (line[1] ?? 0) - 48;
			if (digit < 0 || digit > 9) return err(`invalid record type character 0x${hex(line[1] ?? 0, 2)} at column 2`);
			const type = `S${String(digit)}`;
			const decoded = decodeHexDigits(line, 2);
			if (!decoded.ok) return decoded;
			const bytes = decoded.value;
			const count = bytes[0] ?? 0;
			if (bytes.length === 0 || bytes.length !== count + 1) return err(`record type ${type} byte count 0x${hex(count, 2)} declares ${String(count)} bytes after the count, but the line holds ${String(Math.max(bytes.length - 1, 0))}`);
			const declared = bytes[bytes.length - 1] ?? 0;
			const computed = ~byteSum(bytes.subarray(0, -1)) & 255;
			if (declared !== computed) return err(`record type ${type} checksum 0x${hex(declared, 2)} does not match computed 0x${hex(computed, 2)}`);
			const addressBytes = SREC_ADDRESS_BYTES[digit];
			if (addressBytes === undefined) return err(`reserved record type ${type}`);
			if (count < addressBytes + 1 || digit >= 5 && count !== addressBytes + 1) return err(`record type ${type} byte count 0x${hex(count, 2)} does not fit its ${String(addressBytes)}-byte address and checksum`);
			return ok({
				type,
				address: readBigEndian(bytes.subarray(1, 1 + addressBytes)),
				data: bytes.subarray(1 + addressBytes, -1)
			});
		};
		parseRecord = (encoding, line) => encoding === "intel-hex" ? parseIntelRecord(line) : parseSrecRecord(line);
	})))();
}

//#endregion
//#region dist/domain/firmware/hexRecords.js
var HEX_RECORD_MAX_FILE_BYTES, HEX_RECORD_MAX_RUNS, HEX_RECORD_ENCODING_LABELS, detectHexRecordEncoding, createHexRecordDecoder, formatFailure, StreamingHexRecordDecoder, startRecord, lineSpan, mergeRuns$1, conflict$1;
function init_hexRecords() {
	return (init_hexRecords = __esmMin((() => {
		init_result();
		init_addressRuns();
		init_hexRecordSyntax();
		HEX_RECORD_MAX_FILE_BYTES = 128 * 1024 * 1024;
		HEX_RECORD_MAX_RUNS = 65536;
		HEX_RECORD_ENCODING_LABELS = {
			"intel-hex": "Intel HEX",
			srec: "S-record"
		};
		detectHexRecordEncoding = (prefix) => {
			const encoding = prefix[0] === 58 ? "intel-hex" : prefix[0] === 83 ? "srec" : null;
			if (encoding === null) return undefined;
			const max = maxLineChars(encoding);
			const window = prefix.subarray(0, max + 2);
			const lf = window.indexOf(10);
			let length = lf < 0 ? window.length : lf;
			if (lf >= 0 && window[length - 1] === 13) length -= 1;
			if (length > max) return undefined;
			const line = window.subarray(0, trimTrailingBlanks(window, length));
			return parseRecord(encoding, line).ok ? encoding : undefined;
		};
		createHexRecordDecoder = (encoding, fileBytes) => Number.isSafeInteger(fileBytes) && fileBytes >= 0 && fileBytes <= 134217728 ? ok(new StreamingHexRecordDecoder(encoding, fileBytes)) : err({
			kind: "limit",
			boundary: "file-size",
			message: `file is ${String(fileBytes)} bytes, exceeding the fixed ${String(HEX_RECORD_MAX_FILE_BYTES)}-byte (128 MiB) ceiling`
		});
		formatFailure = (line, detail) => ({
			kind: "format",
			message: `line ${String(line)}: ${detail}`
		});
		StreamingHexRecordDecoder = class {
			#encoding;
			#line;
			#runs = [];
			#arena;
			#arenaUsed = 0;
			#lineLength = 0;
			#lineNumber = 0;
			#recordCount = 0;
			#dataRecordCount = 0;
			#termination;
			#base = 0;
			#baseFromSegment = false;
			#segmentRecords = false;
			#linearRecords = false;
			#start;
			#startSegment;
			#header;
			#declaredCount = null;
			#dataTypes = new Set();
			constructor(encoding, fileBytes) {
				this.#encoding = encoding;
				this.#line = new Uint8Array(maxLineChars(encoding) + 1);
				this.#arena = new Uint8Array(Math.floor(fileBytes / 2));
			}
			write(chunk) {
				let from = 0;
				while (from < chunk.length) {
					const lf = chunk.indexOf(10, from);
					const piece = chunk.subarray(from, lf < 0 ? chunk.length : lf);
					if (this.#lineLength + piece.length > this.#line.length) return err(this.#overlong(this.#lineNumber + 1));
					this.#line.set(piece, this.#lineLength);
					this.#lineLength += piece.length;
					if (lf < 0) break;
					const ended = this.#endLine(true);
					if (!ended.ok) return ended;
					from = lf + 1;
				}
				return ok(undefined);
			}
			finish() {
				if (this.#lineLength > 0) {
					const ended = this.#endLine(false);
					if (!ended.ok) return ended;
				}
				const merged = mergeRuns$1(this.#runs, this.#arena);
				this.#arena = new Uint8Array(0);
				if (!merged.ok) return merged;
				const { regions, duplicateBytes } = merged.value;
				return ok({
					metadata: this.#metadata(regions, duplicateBytes),
					regions,
					terminated: this.#termination !== undefined,
					limitations: this.#limitations()
				});
			}
			#overlong(line) {
				return formatFailure(line, `line exceeds the ${String(maxLineChars(this.#encoding))}-character ${HEX_RECORD_ENCODING_LABELS[this.#encoding]} maximum`);
			}
			#endLine(lfTerminated) {
				this.#lineNumber += 1;
				let length = this.#lineLength;
				this.#lineLength = 0;
				if (lfTerminated && this.#line[length - 1] === 13) length -= 1;
				if (length > maxLineChars(this.#encoding)) return err(this.#overlong(this.#lineNumber));
				length = trimTrailingBlanks(this.#line, length);
				if (length === 0) return ok(undefined);
				const parsed = parseRecord(this.#encoding, this.#line.subarray(0, length));
				if (!parsed.ok) return err(this.#failure(parsed.error));
				if (this.#termination !== undefined) return err(this.#failure(`record follows the termination record at line ${String(this.#termination.line)}`));
				this.#recordCount += 1;
				return this.#encoding === "intel-hex" ? this.#applyIntel(parsed.value) : this.#applySrec(parsed.value);
			}
			#failure(detail) {
				return formatFailure(this.#lineNumber, detail);
			}
			#applyIntel(record) {
				const value = readBigEndian(record.data);
				switch (record.type) {
					case "00": return this.#intelData(record);
					case "01":
						this.#termination = {
							value: record.type,
							line: this.#lineNumber
						};
						return ok(undefined);
					case "02":
					case "04":
						this.#segmentRecords ||= record.type === "02";
						this.#linearRecords ||= record.type === "04";
						this.#baseFromSegment = record.type === "02";
						this.#base = record.type === "02" ? value * 16 : value * 65536;
						return ok(undefined);
					case "03": return this.#declareStartSegment([value >>> 16, value & 65535]);
					default:
						this.#linearRecords = true;
						return this.#declareStart(value, record.type);
				}
			}
			#intelData({ address, data }) {
				this.#dataRecordCount += 1;
				if (address + data.length > 65536) return err(this.#failure(`data at offset 0x${hex(address, 4)} with ${String(data.length)} bytes wraps past 0xffff; producers disagree on the wrapped address`));
				const start = this.#base + address;
				if (this.#baseFromSegment && start + data.length - 1 > 1048575) return err(this.#failure(`I16HEX data at 0x${hex(start, 8)} with ${String(data.length)} bytes exceeds the 20-bit address 0xfffff`));
				return this.#addData(start, data);
			}
			#applySrec(record) {
				switch (record.type) {
					case "S0":
						if (this.#header !== undefined) return err(this.#failure(`second S0 header record; the first is at line ${String(this.#header.line)}`));
						this.#header = {
							value: record.data.slice(),
							line: this.#lineNumber
						};
						return ok(undefined);
					case "S1":
					case "S2":
					case "S3": return this.#srecData(record);
					case "S5":
					case "S6":
						if (record.address !== this.#dataRecordCount) return err(this.#failure(`record type ${record.type} declares ${String(record.address)} data records, but ${String(this.#dataRecordCount)} precede it`));
						this.#declaredCount = record.address;
						return ok(undefined);
					default:
						this.#termination = {
							value: record.type,
							line: this.#lineNumber
						};
						return this.#declareStart(record.address, record.type);
				}
			}
			#srecData({ type, address, data }) {
				this.#dataRecordCount += 1;
				this.#dataTypes.add(type);
				const limit = SREC_DATA_LIMITS[type] ?? 0;
				if (address + data.length - 1 > limit) return err(this.#failure(`record type ${type} data at 0x${hex(address, 8)} with ${String(data.length)} bytes crosses 0x${hex(limit, 2)}`));
				return this.#addData(address, data);
			}
			#declareStart(value, record) {
				const existing = this.#start;
				if (existing !== undefined && existing.value !== value) return err(this.#failure(`start address 0x${hex(value, 8)} conflicts with 0x${hex(existing.value, 8)} declared at line ${String(existing.line)}`));
				this.#start ??= {
					value,
					line: this.#lineNumber,
					record
				};
				return ok(undefined);
			}
			#declareStartSegment(value) {
				this.#segmentRecords = true;
				const existing = this.#startSegment;
				if (existing !== undefined && (existing.value[0] !== value[0] || existing.value[1] !== value[1])) return err(this.#failure(`start segment 0x${hex(value[0], 4)}:0x${hex(value[1], 4)} conflicts with 0x${hex(existing.value[0], 4)}:0x${hex(existing.value[1], 4)} declared at line ${String(existing.line)}`));
				this.#startSegment ??= {
					value,
					line: this.#lineNumber
				};
				return ok(undefined);
			}
			#addData(address, data) {
				if (data.length === 0) return ok(undefined);
				if (this.#arenaUsed + data.length > this.#arena.length) return err({
					kind: "limit",
					boundary: "file-size",
					message: `line ${String(this.#lineNumber)}: decoded bytes exceed half of the admitted file size`
				});
				const run = this.#runs.at(-1);
				if (run !== undefined && run.address + run.length === address) {
					run.length += data.length;
					run.recordCount += 1;
					run.lastLine = this.#lineNumber;
				} else {
					if (this.#runs.length >= 65536) return err({
						kind: "limit",
						boundary: "capacity",
						message: `line ${String(this.#lineNumber)}: data starts more than ${String(HEX_RECORD_MAX_RUNS)} address-discontiguous record runs`
					});
					this.#runs.push({
						address,
						offset: this.#arenaUsed,
						length: data.length,
						recordCount: 1,
						firstLine: this.#lineNumber,
						lastLine: this.#lineNumber
					});
				}
				this.#arena.set(data, this.#arenaUsed);
				this.#arenaUsed += data.length;
				return ok(undefined);
			}
			#variant() {
				if (this.#encoding === "intel-hex") {
					if (this.#segmentRecords && this.#linearRecords) return "mixed";
					if (this.#linearRecords) return "I32HEX";
					return this.#segmentRecords ? "I16HEX" : "I8HEX";
				}
				const widths = new Set([...this.#dataTypes].map((type) => SREC_WIDTH_OF[type]));
				if (widths.size > 1) return "mixed";
				const width = [...widths][0] ?? (this.#termination === undefined ? undefined : SREC_WIDTH_OF[this.#termination.value]);
				return width === "S19" || width === "S28" || width === "S37" ? width : null;
			}
			#limitations() {
				const label = HEX_RECORD_ENCODING_LABELS[this.#encoding];
				if (this.#termination === undefined) return [`${label} has no termination record; the file may be truncated.`];
				const termination = this.#termination.value;
				const mismatched = [...this.#dataTypes].filter((type) => SREC_WIDTH_OF[type] !== SREC_WIDTH_OF[termination]);
				return this.#encoding === "srec" && mismatched.length > 0 ? [`S-record termination ${termination} does not match the address width of ${mismatched.sort().join(", ")} data records.`] : [];
			}
			#metadata(regions, duplicateBytes) {
				const header = this.#header?.value;
				const declaredStart = this.#start;
				return {
					kind: "hex-records",
					encoding: this.#encoding,
					variant: this.#variant(),
					line_count: this.#lineNumber,
					record_count: this.#recordCount,
					data_record_count: this.#dataRecordCount,
					data_bytes: regions.reduce((sum, region) => sum + region.bytes.length, 0),
					duplicate_bytes: duplicateBytes,
					region_count: regions.length,
					lowest_address: regions[0]?.start ?? null,
					highest_address: regions.at(-1)?.end ?? null,
					termination: this.#termination === undefined ? "absent" : "present",
					start_address: declaredStart?.value ?? null,
					start_address_record: startRecord(declaredStart?.record),
					start_segment_cs: this.#startSegment?.value[0] ?? null,
					start_segment_ip: this.#startSegment?.value[1] ?? null,
					header_hex: header === undefined ? null : [...header].map((byte) => hex(byte, 2)).join(""),
					header_text: header?.every((byte) => byte >= 32 && byte <= 126) === true ? String.fromCharCode(...header) : null,
					declared_data_record_count: this.#declaredCount
				};
			}
		};
		startRecord = (record) => record === "05" || record === "S7" || record === "S8" || record === "S9" ? record : null;
		lineSpan = (run) => run.firstLine === run.lastLine ? `line ${String(run.firstLine)}` : `lines ${String(run.firstLine)}-${String(run.lastLine)}`;
		mergeRuns$1 = (runs, arena) => {
			const merged = mergeArenaRuns(runs, arena);
			if (!merged.ok) return err(conflict$1(merged.error));
			return ok({
				regions: merged.value.ranges.map(({ start, bytes, runs: group }) => ({
					start,
					end: start + bytes.length - 1,
					bytes,
					recordCount: group.reduce((sum, run) => sum + run.recordCount, 0),
					firstLine: group.reduce((line, run) => Math.min(line, run.firstLine), Number.MAX_SAFE_INTEGER),
					lastLine: group.reduce((line, run) => Math.max(line, run.lastLine), 0)
				})),
				duplicateBytes: merged.value.duplicateBytes
			});
		};
		conflict$1 = ({ address, writer, run, existing, incoming }) => ({
			kind: "format",
			message: `address 0x${hex(address, 8)} written with different values at ${lineSpan(writer)} (0x${hex(existing, 2)}) and ${lineSpan(run)} (0x${hex(incoming, 2)})`
		});
	})))();
}

//#endregion
//#region dist/domain/firmware/uf2Families.js
var UF2_FAMILY_REGISTRY, UF2_FAMILY_NAMES, uf2FamilyName;
function init_uf2Families() {
	return (init_uf2Families = __esmMin((() => {
		UF2_FAMILY_REGISTRY = "microsoft/uf2 cf3bd7f9 utils/uf2families.json";
		UF2_FAMILY_NAMES = new Map([
			[475996592, "ESP32"],
			[3218951918, "ESP32S2"],
			[3296614247, "ESP32S3"],
			[822212545, "ESP32S31"],
			[730387100, "ESP32C2"],
			[3559628908, "ESP32C3"],
			[4145808195, "ESP32C5"],
			[1410195298, "ESP32C6"],
			[2010665156, "ESP32C61"],
			[858203894, "ESP32H2"],
			[3067936943, "ESP32H21"],
			[2651564682, "ESP32H4"],
			[1026592404, "ESP32P4"],
			[2125160941, "ESP8266"],
			[3834380118, "RP2040"],
			[3834380119, "RP2XXX_ABSOLUTE"],
			[3834380120, "RP2XXX_DATA"],
			[3834380121, "RP2350_ARM_S"],
			[3834380122, "RP2350_RISCV"],
			[3834380123, "RP2350_ARM_NS"],
			[1467308631, "STM32F4"],
			[2913282112, "NRF52840"],
			[1760373640, "SAMD21"],
			[1427194976, "SAMD51"],
			[2684343619, "RTL8710A"],
			[585160444, "RTL8710B"],
			[3767498084, "RTL8720C"],
			[863621090, "RTL8720D"],
			[1733968048, "BK7231U"],
			[2067722800, "BK7231N"],
			[1786956866, "BK7251"],
			[3725750455, "BL602"]
		]);
		uf2FamilyName = (familyId) => UF2_FAMILY_NAMES.get(familyId) ?? null;
	})))();
}

//#endregion
//#region dist/domain/firmware/uf2.js
var UF2_BLOCK_BYTES, UF2_DATA_OFFSET, UF2_DATA_BYTES, UF2_MAGIC_START0, UF2_MAGIC_START1, UF2_MAGIC_END, UF2_FLAG_NOT_MAIN_FLASH, UF2_FLAG_FILE_CONTAINER, UF2_FLAG_FAMILY_ID, UF2_FLAG_MD5, UF2_FLAG_EXTENSION_TAGS, ADDRESS_SPACE, NAMED_GROUPS, UF2_MAX_FILE_BYTES, UF2_MAX_REGIONS, readUint32, hex32, familyText, named, hasUf2Block, createUf2Decoder, numberingFacts, StreamingUf2Decoder, blockSpan, mergeRuns, conflict;
function init_uf2() {
	return (init_uf2 = __esmMin((() => {
		init_result();
		init_addressRuns();
		init_uf2Families();
		UF2_BLOCK_BYTES = 512;
		UF2_DATA_OFFSET = 32;
		UF2_DATA_BYTES = 476;
		UF2_MAGIC_START0 = 171066965;
		UF2_MAGIC_START1 = 2656915799;
		UF2_MAGIC_END = 179400496;
		UF2_FLAG_NOT_MAIN_FLASH = 1;
		UF2_FLAG_FILE_CONTAINER = 4096;
		UF2_FLAG_FAMILY_ID = 8192;
		UF2_FLAG_MD5 = 16384;
		UF2_FLAG_EXTENSION_TAGS = 32768;
		ADDRESS_SPACE = 4294967296;
		NAMED_GROUPS = 4;
		UF2_MAX_FILE_BYTES = 128 * 1024 * 1024;
		UF2_MAX_REGIONS = 65536;
		readUint32 = (bytes, offset) => ((bytes[offset] ?? 0) | (bytes[offset + 1] ?? 0) << 8 | (bytes[offset + 2] ?? 0) << 16 | (bytes[offset + 3] ?? 0) << 24) >>> 0;
		hex32 = (value) => `0x${value.toString(16).padStart(8, "0")}`;
		familyText = (familyId) => {
			if (familyId === null) return "no familyID";
			const name = uf2FamilyName(familyId);
			return name === null ? `family ${hex32(familyId)}` : `family ${hex32(familyId)} (${name})`;
		};
		named = (items) => `${items.slice(0, NAMED_GROUPS).join("; ")}${items.length > NAMED_GROUPS ? `; and ${String(items.length - NAMED_GROUPS)} more` : ""}`;
		hasUf2Block = (prefix) => prefix.length >= 512 && readUint32(prefix, 0) === UF2_MAGIC_START0 && readUint32(prefix, 4) === UF2_MAGIC_START1 && readUint32(prefix, 512 - 4) === UF2_MAGIC_END;
		createUf2Decoder = (fileBytes) => Number.isSafeInteger(fileBytes) && fileBytes >= 0 && fileBytes <= 134217728 ? ok(new StreamingUf2Decoder(fileBytes)) : err({
			kind: "limit",
			boundary: "file-size",
			message: `file is ${String(fileBytes)} bytes, exceeding the fixed ${String(UF2_MAX_FILE_BYTES)}-byte (128 MiB) ceiling`
		});
		numberingFacts = (groups) => {
			let missing = 0;
			const absent = [];
			const ambiguous = [];
			for (const group of groups) {
				const seen = group.first.size;
				const name = `${familyText(group.familyId)} with ${String(group.declared)} numbered blocks`;
				if (seen < group.declared) {
					missing += group.declared - seen;
					absent.push(`${name} has ${String(seen)} of them`);
				}
				let most = 1;
				let fewest = group.further.size < seen ? 1 : Number.MAX_SAFE_INTEGER;
				for (const further of group.further.values()) {
					most = Math.max(most, further.size + 1);
					fewest = Math.min(fewest, further.size + 1);
				}
				if (most !== fewest) ambiguous.push(`${name} has some numbers at ${String(fewest)} address(es) and others at ${String(most)}`);
			}
			return {
				missing,
				absent,
				ambiguous
			};
		};
		StreamingUf2Decoder = class {
			#block = new Uint8Array(512);
			#runs = [];
			#groups = new Map();
			#families = new Set();
			#arena;
			#arenaUsed = 0;
			#blockLength = 0;
			#blockCount = 0;
			#invalid = 0;
			#firstInvalid;
			#flash = 0;
			#notMainFlash = 0;
			#notMainFlashBytes = 0;
			#fileContainer = 0;
			#md5 = 0;
			#extensionTags = 0;
			#repeated = 0;
			#outOfOrder = 0;
			#outOfRange = 0;
			constructor(fileBytes) {
				this.#arena = new Uint8Array(Math.floor(fileBytes / 512) * UF2_DATA_BYTES);
			}
			write(chunk) {
				let from = 0;
				while (from < chunk.length) {
					const count = Math.min(512 - this.#blockLength, chunk.length - from);
					this.#block.set(chunk.subarray(from, from + count), this.#blockLength);
					this.#blockLength += count;
					from += count;
					if (this.#blockLength < 512) break;
					this.#blockLength = 0;
					const decoded = this.#decodeBlock(this.#block);
					if (!decoded.ok) return decoded;
				}
				return ok(undefined);
			}
			finish() {
				const merged = mergeRuns(this.#runs, this.#arena);
				this.#arena = new Uint8Array(0);
				if (!merged.ok) return merged;
				const { regions, duplicateBytes } = merged.value;
				if (regions.length > 65536) return err({
					kind: "limit",
					boundary: "capacity",
					message: `payloads form ${String(regions.length)} address-discontiguous regions, more than the ${String(UF2_MAX_REGIONS)} retained as entries`
				});
				const numbering = numberingFacts(this.#groups.values());
				const limitations = this.#limitations(numbering);
				return ok({
					metadata: this.#metadata(regions, duplicateBytes, numbering),
					regions,
					complete: limitations.unknown.length === 0,
					limitations: [...limitations.unknown, ...limitations.known]
				});
			}
			#decodeBlock(block) {
				const index = this.#blockCount;
				this.#blockCount += 1;
				const flags = readUint32(block, 8);
				const address = readUint32(block, 12);
				const size = readUint32(block, 16);
				const fault = readUint32(block, 0) !== UF2_MAGIC_START0 || readUint32(block, 4) !== UF2_MAGIC_START1 ? "start magic numbers do not match" : readUint32(block, 512 - 4) !== UF2_MAGIC_END ? "end magic number does not match" : size > UF2_DATA_BYTES ? `payload size ${String(size)} exceeds the ${String(UF2_DATA_BYTES)}-byte data area` : address + size > ADDRESS_SPACE ? `payload at ${hex32(address)} with ${String(size)} bytes wraps past 0xffffffff` : undefined;
				if (fault !== undefined) {
					this.#invalid += 1;
					this.#firstInvalid ??= {
						block: index,
						reason: fault
					};
					return ok(undefined);
				}
				const familyId = (flags & UF2_FLAG_FAMILY_ID) !== 0 ? readUint32(block, 28) : null;
				if ((flags & UF2_FLAG_MD5) !== 0) this.#md5 += 1;
				if ((flags & UF2_FLAG_EXTENSION_TAGS) !== 0) this.#extensionTags += 1;
				this.#number(familyId, readUint32(block, 24), readUint32(block, 20), address);
				if ((flags & UF2_FLAG_FILE_CONTAINER) !== 0) {
					this.#fileContainer += 1;
					return ok(undefined);
				}
				if ((flags & UF2_FLAG_NOT_MAIN_FLASH) !== 0) {
					this.#notMainFlash += 1;
					this.#notMainFlashBytes += size;
					return ok(undefined);
				}
				this.#flash += 1;
				if (familyId !== null) this.#families.add(familyId);
				return this.#addData(index, familyId, address, block.subarray(UF2_DATA_OFFSET, UF2_DATA_OFFSET + size));
			}
			/** Numbering is per familyID and block count, as bootloaders ignore other families. */
			#number(familyId, declared, blockNo, address) {
				if (declared === 0 || blockNo >= declared) {
					this.#outOfRange += 1;
					return;
				}
				const key = `${familyId === null ? "none" : String(familyId)}:${String(declared)}`;
				let group = this.#groups.get(key);
				if (group === undefined) {
					group = {
						familyId,
						declared,
						first: new Map(),
						further: new Map(),
						previous: -1
					};
					this.#groups.set(key, group);
				}
				const first = group.first.get(blockNo);
				if (first === undefined) group.first.set(blockNo, address);
				else {
					this.#repeated += 1;
					if (first !== address) {
						let further = group.further.get(blockNo);
						if (further === undefined) {
							further = new Set();
							group.further.set(blockNo, further);
						}
						further.add(address);
					}
				}
				if (blockNo <= group.previous) this.#outOfOrder += 1;
				group.previous = blockNo;
			}
			#addData(block, familyId, address, data) {
				if (data.length === 0) return ok(undefined);
				if (this.#arenaUsed + data.length > this.#arena.length) return err({
					kind: "limit",
					boundary: "file-size",
					message: `block ${String(block)}: payload bytes exceed ${String(UF2_DATA_BYTES)} per complete block of the admitted file size`
				});
				const run = this.#runs.at(-1);
				if (run !== undefined && run.familyId === familyId && run.address + run.length === address) {
					run.length += data.length;
					run.blockCount += 1;
					run.lastFileBlock = block;
				} else this.#runs.push({
					familyId,
					address,
					offset: this.#arenaUsed,
					length: data.length,
					blockCount: 1,
					firstFileBlock: block,
					lastFileBlock: block
				});
				this.#arena.set(data, this.#arenaUsed);
				this.#arenaUsed += data.length;
				return ok(undefined);
			}
			/** Limitations that leave coverage unknown, then facts that do not. */
			#limitations(numbering) {
				const unknown = [];
				const known = [];
				if (this.#blockLength > 0) unknown.push(`UF2 file ends with ${String(this.#blockLength)} bytes after its last complete 512-byte block; the file may be truncated.`);
				if (this.#firstInvalid !== undefined) unknown.push(`${String(this.#invalid)} UF2 block(s) are invalid and were excluded; the first is block ${String(this.#firstInvalid.block)} at byte offset ${String(this.#firstInvalid.block * 512)}: ${this.#firstInvalid.reason}.`);
				if (numbering.missing > 0) unknown.push(`UF2 numbering declares ${String(numbering.missing)} block(s) that are absent: ${named(numbering.absent)}.`);
				if (numbering.ambiguous.length > 0) unknown.push(`UF2 numbering cannot show that every copy of a block sequence is complete: ${named(numbering.ambiguous)}.`);
				if (this.#outOfRange > 0) unknown.push(`${String(this.#outOfRange)} UF2 block(s) have a block number at or above their block count, so their numbering cannot establish completeness.`);
				if (this.#fileContainer > 0) unknown.push(`${String(this.#fileContainer)} UF2 block(s) belong to file containers (flag 0x1000); their files were not reconstructed.`);
				if (this.#notMainFlash > 0) known.push(`${String(this.#notMainFlash)} UF2 block(s) are flagged not main flash (flag 0x1); their ${String(this.#notMainFlashBytes)} payload bytes are in no region.`);
				if (this.#md5 > 0 || this.#extensionTags > 0) known.push(`${String(this.#md5)} UF2 block(s) declare an MD5 flash region (flag 0x4000) and ${String(this.#extensionTags)} declare extension tags (flag 0x8000); both are counted, not decoded or verified.`);
				return {
					unknown,
					known
				};
			}
			#metadata(regions, duplicateBytes, numbering) {
				return {
					kind: "uf2",
					block_count: this.#blockCount,
					trailing_bytes: this.#blockLength,
					invalid_block_count: this.#invalid,
					flash_block_count: this.#flash,
					not_main_flash_block_count: this.#notMainFlash,
					file_container_block_count: this.#fileContainer,
					md5_block_count: this.#md5,
					extension_tag_block_count: this.#extensionTags,
					family_count: this.#families.size,
					family_name_registry: UF2_FAMILY_REGISTRY,
					numbering_group_count: this.#groups.size,
					missing_block_count: numbering.missing,
					ambiguous_numbering_group_count: numbering.ambiguous.length,
					repeated_block_count: this.#repeated,
					out_of_order_block_count: this.#outOfOrder,
					block_number_out_of_range_count: this.#outOfRange,
					region_count: regions.length,
					data_bytes: regions.reduce((sum, region) => sum + region.bytes.length, 0),
					duplicate_bytes: duplicateBytes
				};
			}
		};
		blockSpan = (run) => run.firstFileBlock === run.lastFileBlock ? `block ${String(run.firstFileBlock)}` : `blocks ${String(run.firstFileBlock)}-${String(run.lastFileBlock)}`;
		mergeRuns = (runs, arena) => {
			const merged = mergeArenaRuns(runs, arena, (run) => run.familyId ?? -1);
			if (!merged.ok) return err(conflict(merged.error));
			return ok({
				regions: merged.value.ranges.map(({ start, bytes, runs: group }) => {
					const familyId = group[0]?.familyId ?? null;
					return {
						familyId,
						familyName: familyId === null ? null : uf2FamilyName(familyId),
						start,
						end: start + bytes.length - 1,
						bytes,
						blockCount: group.reduce((sum, run) => sum + run.blockCount, 0),
						firstFileBlock: group.reduce((block, run) => Math.min(block, run.firstFileBlock), Number.MAX_SAFE_INTEGER),
						lastFileBlock: group.reduce((block, run) => Math.max(block, run.lastFileBlock), 0)
					};
				}),
				duplicateBytes: merged.value.duplicateBytes
			});
		};
		conflict = ({ address, writer, run, existing, incoming }) => ({
			kind: "format",
			message: `${familyText(run.familyId)} address ${hex32(address)} is written with different values by ${blockSpan(writer)} (0x${existing.toString(16).padStart(2, "0")}) and ${blockSpan(run)} (0x${incoming.toString(16).padStart(2, "0")})`
		});
	})))();
}

//#endregion
//#region dist/domain/firmware/fitImage.js
var hasFitImagesNode;
function init_fitImage() {
	return (init_fitImage = __esmMin((() => {
		hasFitImagesNode = (prefix) => {
			const bytes = prefix.subarray(0, 4096);
			if (bytes.length < 40) return false;
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const u32 = (offset) => view.getUint32(offset);
			const version = u32(20);
			if (u32(0) !== 3490578157 || version !== 16 && version !== 17) return false;
			const end = Math.min(bytes.length, u32(4));
			let cursor = u32(8);
			let depth = 0;
			while (cursor <= end - 4) {
				const token = u32(cursor);
				if (token === 1) {
					const nul = bytes.indexOf(0, cursor + 4);
					if (nul < 0 || nul >= end) return false;
					const name = String.fromCharCode(...bytes.subarray(cursor + 4, nul));
					if (depth === 0 && name !== "") return false;
					if (depth === 1 && name === "images") return true;
					depth += 1;
					cursor = Math.ceil((nul + 1) / 4) * 4;
				} else if (token === 2) {
					depth -= 1;
					if (depth <= 0) return false;
					cursor += 4;
				} else if (token === 3) {
					if (cursor > end - 8) return false;
					cursor += Math.ceil((12 + u32(cursor + 4)) / 4) * 4;
				} else if (token === 4) cursor += 4;
				else return false;
			}
			return false;
		};
	})))();
}

//#endregion
//#region dist/domain/firmware/espChips.js
var ESP_CHIP_TABLE_SOURCE, range, C6_H2_PAGE_SIZES, CHIPS, BY_ID, espChipForId, ESP_ROM_BOOTLOADER_OFFSETS, SIXTEEN_MIB, espSegmentLengthLimit, RESERVED_ADDRESS_LIMIT, classifyEspSegment, espPageSizedMappingAmbiguity, isMapped, pageSizedHigh;
function init_espChips() {
	return (init_espChips = __esmMin((() => {
		ESP_CHIP_TABLE_SOURCE = "ESP-IDF v6.1";
		range = (low, high) => ({
			low,
			high
		});
		C6_H2_PAGE_SIZES = [
			8192,
			16384,
			32768,
			65536
		];
		CHIPS = [
			{
				chipId: 0,
				target: "esp32",
				isa: "xtensa",
				romBootloaderOffset: 4096,
				cache32BitAddressMap: false,
				mapped: [range(1074593792, 1077936128), range(1061158912, 1065353216)]
			},
			{
				chipId: 2,
				target: "esp32s2",
				isa: "xtensa",
				romBootloaderOffset: 4096,
				cache32BitAddressMap: false,
				mapped: [range(1074266112, 1082130432), range(1056964608, 1073217536)]
			},
			{
				chipId: 5,
				target: "esp32c3",
				isa: "riscv",
				romBootloaderOffset: 0,
				cache32BitAddressMap: false,
				mapped: [range(1107296256, 1115684864), range(1006632960, 1015021568)]
			},
			{
				chipId: 9,
				target: "esp32s3",
				isa: "xtensa",
				romBootloaderOffset: 0,
				cache32BitAddressMap: true,
				mapped: [range(1107296256, 1140850688), range(1006632960, 1040187392)]
			},
			{
				chipId: 12,
				target: "esp32c2",
				isa: "riscv",
				romBootloaderOffset: 0,
				cache32BitAddressMap: false,
				mapped: [range(1107296256, 1111490560), range(1006632960, 1010827264)]
			},
			{
				chipId: 13,
				target: "esp32c6",
				isa: "riscv",
				romBootloaderOffset: 0,
				cache32BitAddressMap: false,
				mapped: [],
				pageSizedMapping: {
					low: 1107296256,
					pageSizes: C6_H2_PAGE_SIZES
				}
			},
			{
				chipId: 16,
				target: "esp32h2",
				isa: "riscv",
				romBootloaderOffset: 0,
				cache32BitAddressMap: false,
				mapped: [],
				pageSizedMapping: {
					low: 1107296256,
					pageSizes: C6_H2_PAGE_SIZES
				}
			},
			{
				chipId: 18,
				target: "esp32p4",
				isa: "riscv",
				romBootloaderOffset: 8192,
				cache32BitAddressMap: true,
				mapped: [range(1073741824, 1140850688), range(1207959552, 1275068416)]
			},
			{
				chipId: 20,
				target: "esp32c61",
				isa: "riscv",
				romBootloaderOffset: 0,
				cache32BitAddressMap: true,
				mapped: [range(1107296256, 1140850688)]
			},
			{
				chipId: 23,
				target: "esp32c5",
				isa: "riscv",
				romBootloaderOffset: 8192,
				cache32BitAddressMap: true,
				mapped: [range(1107296256, 1140850688)]
			},
			{
				chipId: 25,
				target: "esp32h21",
				isa: "riscv",
				romBootloaderOffset: 0,
				cache32BitAddressMap: false,
				mapped: [range(1107296256, 1124073472)]
			},
			{
				chipId: 28,
				target: "esp32h4",
				isa: "riscv",
				romBootloaderOffset: 8192,
				cache32BitAddressMap: true,
				mapped: [range(1107296256, 1140850688)]
			},
			{
				chipId: 32,
				target: "esp32s31",
				isa: "riscv",
				romBootloaderOffset: 8192,
				cache32BitAddressMap: true,
				mapped: [range(1073741824, 1140850688), range(1342177280, 1409286144)]
			}
		];
		BY_ID = new Map(CHIPS.map((chip) => [chip.chipId, chip]));
		espChipForId = (chipId) => BY_ID.get(chipId);
		ESP_ROM_BOOTLOADER_OFFSETS = [...new Set(CHIPS.map(({ romBootloaderOffset }) => romBootloaderOffset))].sort((left, right) => left - right);
		SIXTEEN_MIB = 16777216;
		espSegmentLengthLimit = (chip) => chip.cache32BitAddressMap ? undefined : SIXTEEN_MIB;
		RESERVED_ADDRESS_LIMIT = 268435456;
		classifyEspSegment = (chip, address) => {
			if (chip === undefined) return "unknown";
			const mapped = isMapped(chip, address);
			if (mapped === undefined) return "unknown";
			if (mapped) return "mapped";
			return address < RESERVED_ADDRESS_LIMIT ? "not-loaded" : "loaded";
		};
		espPageSizedMappingAmbiguity = (chip) => {
			const paged = chip.pageSizedMapping;
			return paged === undefined ? undefined : range(pageSizedHigh(paged.low, Math.min(...paged.pageSizes)), pageSizedHigh(paged.low, Math.max(...paged.pageSizes)));
		};
		isMapped = (chip, address) => {
			if (chip.mapped.some(({ low, high }) => address >= low && address < high)) return true;
			const paged = chip.pageSizedMapping;
			if (paged === undefined || address < paged.low) return false;
			if (address < pageSizedHigh(paged.low, Math.min(...paged.pageSizes))) return true;
			return address < pageSizedHigh(paged.low, Math.max(...paged.pageSizes)) ? undefined : false;
		};
		pageSizedHigh = (low, pageSize) => low + pageSize * 256;
	})))();
}

//#endregion
//#region dist/domain/firmware/espImageFacts.js
var SIGNATURE_SLOTS, hexByte, ESP_IMAGE_LIMITATIONS, deriveEspImage, imageComplete, headerFacts, segmentFacts, segmentLimitations, truncation, checksumFacts, digestFacts, trailingFacts;
function init_espImageFacts() {
	return (init_espImageFacts = __esmMin((() => {
		init_espChips();
		init_espImageStructures();
		SIGNATURE_SLOTS = 3;
		hexByte = (value) => `0x${value.toString(16).padStart(2, "0")}`;
		ESP_IMAGE_LIMITATIONS = {
			/** What an ESP image inventory reads, and what it leaves unverified. */
			inventoryScope: "ESP image inventory reads the header-declared segments, checksum, appended SHA-256, descriptor and Secure Boot v2 signature blocks. Segment classification follows ESP-IDF v6.1 should_map and should_load for a cold boot and does not check RAM ranges; signatures are not cryptographically verified, and code is not disassembled.",
			undescribedTrailing: (bytes, ranges, firstOffset) => `${String(bytes)} bytes after the ESP image, in ${String(ranges)} range(s) from offset ${offsetText(firstOffset)}, are not described by its header, erased flash or a signature sector. They may be other flash contents, a Secure Boot v1 signature, or flash segments that esptool --ram-only-header leaves out of the segment count.`,
			unknownChip: (chipId) => `ESP image chip_id 0x${chipId.toString(16).padStart(4, "0")} is not in the ${ESP_CHIP_TABLE_SOURCE} chip table; chip, ISA and segment classification are unknown.`,
			unclassifiedPages: (target, low, high) => `${target} maps flash through 256 MMU pages of the bootloader's configured size, which the image does not record; segments from ${offsetText(low)} to ${offsetText(high)} are unclassified.`,
			segmentLengthUnaligned: (index, length) => `ESP image segment ${String(index)} length ${offsetText(length)} is not a multiple of 4; ESP-IDF rejects such an image.`,
			segmentLengthTooLarge: (index, length, limit, target) => `ESP image segment ${String(index)} length ${offsetText(length)} is ${String(limit / 1048576)} MiB or more; ESP-IDF rejects such an image for ${target}.`,
			truncatedSegment: (index, declared, offset, available) => `ESP image is truncated: segment ${String(index)} declares ${String(declared)} bytes at offset ${offsetText(offset)}, but the file holds ${String(available)}.`,
			truncatedSegmentHeaders: (declared, present) => `ESP image is truncated: the header declares ${String(declared)} segments, but the file ends before the header of segment ${String(present)}.`,
			truncatedBeforeChecksum: (offset) => `ESP image is truncated before its checksum at offset ${offsetText(offset)}.`,
			checksumMismatch: (stored, offset, computed) => `ESP image checksum ${hexByte(stored)} at offset ${offsetText(offset)} does not match the computed ${hexByte(computed)}.`,
			truncatedBeforeDigest: (offset) => `ESP image is truncated before its appended SHA-256 at offset ${offsetText(offset)}.`,
			digestMismatch: (offset) => `ESP image appended SHA-256 at offset ${offsetText(offset)} does not match the SHA-256 of the bytes before it.`,
			segmentEntryTruncated: (index, declared, available) => `ESP image segment ${String(index)} is truncated: its header declares ${String(declared)} bytes; the file holds ${String(available)}.`,
			signatureDigestMismatch: (slot, offset) => `Secure Boot v2 signature block in slot ${String(slot)} at offset ${offsetText(offset)} records an image digest that does not match the bytes before its sector.`,
			invalidSignatureSlot: (slot, offset) => `Secure Boot v2 slot ${String(slot)} at offset ${offsetText(offset)} has the 0xE7 magic but not a matching CRC32 or a complete block; it is not a valid signature block.`,
			signatureSlotsCut: (fileSize, sector) => `The file ends at ${offsetText(fileSize)} in erased flash, before the Secure Boot v2 signature slots at ${offsetText(sector)} are complete; signature blocks may be missing.`,
			signatureSectorTruncated: (sector, fileSize, sectorEnd) => `Secure Boot v2 signature sector at offset ${offsetText(sector)} is truncated: the file ends at ${offsetText(fileSize)}, before ${offsetText(sectorEnd)}.`
		};
		deriveEspImage = (observed) => {
			const limitations = [];
			const chipId = u16(observed.header, 12);
			const chip = espChipForId(chipId);
			const first = observed.segments[0];
			const descriptor = first === undefined ? null : decodeEspDescriptor(observed.descriptorBytes, first.headerOffset + 8, limitations);
			const segments = observed.segments.map((segment) => segmentFacts(observed, segment, chip));
			limitations.push(...segmentLimitations(chipId, chip, segments));
			const truncated = truncation(observed, segments, limitations);
			const checksum = checksumFacts(observed, truncated, limitations);
			const appendedSha256 = digestFacts(observed, limitations);
			const trailing = trailingFacts(observed, limitations);
			const undescribedBytes = trailing.undescribed.reduce((total, { length }) => total + length, 0);
			const firstUndescribed = trailing.undescribed[0];
			if (firstUndescribed !== undefined) limitations.push(ESP_IMAGE_LIMITATIONS.undescribedTrailing(undescribedBytes, trailing.undescribed.length, firstUndescribed.offset));
			return {
				metadata: {
					kind: "esp-image",
					header: headerFacts(observed.header),
					chip: chip === undefined ? null : {
						target: chip.target,
						isa: chip.isa,
						source: ESP_CHIP_TABLE_SOURCE
					},
					checksum,
					appended_sha256: appendedSha256,
					image_end: observed.imageEnd ?? null,
					signature_sector_offset: trailing.blocks.length > 0 ? observed.sectorOffset ?? null : null,
					undescribed_trailing: trailing.undescribed,
					descriptor,
					flash_dump: null
				},
				segments,
				signatureBlocks: trailing.blocks,
				coverage: truncated || !imageComplete(observed) || trailing.undescribed.length > 0 || trailing.truncated ? "unknown" : "complete",
				limitations
			};
		};
		imageComplete = (observed) => observed.imageEnd !== undefined;
		headerFacts = (header) => ({
			segment_count: header[1] ?? 0,
			spi_mode: header[2] ?? 0,
			spi_speed: (header[3] ?? 0) & 15,
			spi_size: (header[3] ?? 0) >> 4,
			entry_addr: u32(header, 4),
			wp_pin: header[8] ?? 0,
			spi_pin_drv: hex$1(header.subarray(9, 12)),
			chip_id: u16(header, 12),
			min_chip_rev: header[14] ?? 0,
			min_chip_rev_full: u16(header, 15),
			max_chip_rev_full: u16(header, 17),
			reserved: hex$1(header.subarray(19, 23)),
			hash_appended: header[23] === 1
		});
		segmentFacts = (observed, segment, chip) => {
			const dataOffset = segment.headerOffset + 8;
			return {
				dataOffset,
				availableLength: Math.max(0, Math.min(segment.length, observed.observedEnd - dataOffset)),
				metadata: {
					kind: "esp-image-segment",
					index: segment.index,
					load_addr: segment.loadAddress,
					data_len: segment.length,
					header_offset: segment.headerOffset,
					classification: classifyEspSegment(chip, segment.loadAddress)
				}
			};
		};
		segmentLimitations = (chipId, chip, segments) => {
			const limitations = [];
			const ambiguity = chip === undefined ? undefined : espPageSizedMappingAmbiguity(chip);
			if (chip === undefined) limitations.push(ESP_IMAGE_LIMITATIONS.unknownChip(chipId));
			else if (ambiguity !== undefined && segments.some(({ metadata }) => metadata.classification === "unknown")) limitations.push(ESP_IMAGE_LIMITATIONS.unclassifiedPages(chip.target, ambiguity.low, ambiguity.high));
			const lengthLimit = chip === undefined ? undefined : espSegmentLengthLimit(chip);
			for (const { metadata } of segments) {
				if (metadata.data_len % 4 !== 0) limitations.push(ESP_IMAGE_LIMITATIONS.segmentLengthUnaligned(metadata.index, metadata.data_len));
				if (chip !== undefined && lengthLimit !== undefined && metadata.data_len >= lengthLimit) limitations.push(ESP_IMAGE_LIMITATIONS.segmentLengthTooLarge(metadata.index, metadata.data_len, lengthLimit, chip.target));
			}
			return limitations;
		};
		truncation = (observed, segments, limitations) => {
			const declared = observed.header[1] ?? 0;
			const short = segments.find(({ availableLength, metadata }) => availableLength < metadata.data_len);
			if (short !== undefined) {
				limitations.push(ESP_IMAGE_LIMITATIONS.truncatedSegment(short.metadata.index, short.metadata.data_len, short.dataOffset, short.availableLength));
				return true;
			}
			if (segments.length < declared) {
				limitations.push(ESP_IMAGE_LIMITATIONS.truncatedSegmentHeaders(declared, segments.length));
				return true;
			}
			return false;
		};
		checksumFacts = (observed, truncated, limitations) => {
			const offset = observed.checksumOffset ?? null;
			const computed = truncated ? null : observed.checksum;
			const stored = observed.storedChecksum ?? null;
			if (offset === null || computed === null || stored === null) {
				if (!truncated && offset !== null) limitations.push(ESP_IMAGE_LIMITATIONS.truncatedBeforeChecksum(offset));
				return {
					offset,
					stored,
					computed,
					status: "unavailable"
				};
			}
			if (stored !== computed) limitations.push(ESP_IMAGE_LIMITATIONS.checksumMismatch(stored, offset, computed));
			return {
				offset,
				stored,
				computed,
				status: stored === computed ? "valid" : "invalid"
			};
		};
		digestFacts = (observed, limitations) => {
			if (observed.header[23] !== 1) return {
				offset: null,
				stored: null,
				computed: null,
				status: "not-appended"
			};
			const offset = observed.checksumOffset === undefined ? null : observed.checksumOffset + 1;
			const computed = observed.imageSha256 ?? null;
			if (offset === null || computed === null || observed.observedEnd < offset + 32) {
				if (computed !== null && offset !== null) limitations.push(ESP_IMAGE_LIMITATIONS.truncatedBeforeDigest(offset));
				return {
					offset,
					stored: null,
					computed,
					status: "unavailable"
				};
			}
			const stored = hex$1(observed.storedDigest);
			if (stored !== computed) limitations.push(ESP_IMAGE_LIMITATIONS.digestMismatch(offset));
			return {
				offset,
				stored,
				computed,
				status: stored === computed ? "valid" : "invalid"
			};
		};
		trailingFacts = (observed, limitations) => {
			const { imageEnd: end, sectorOffset: sector, fileSize } = observed;
			const blocks = [];
			const undescribed = [];
			if (end === undefined || sector === undefined || fileSize <= end) return {
				blocks,
				undescribed,
				truncated: false
			};
			const add = (from, to) => {
				if (from === undefined || to <= from) return;
				const last = undescribed.at(-1);
				if (last !== undefined && last.offset + last.length === from) undescribed[undescribed.length - 1] = {
					offset: last.offset,
					length: to - last.offset
				};
				else undescribed.push({
					offset: from,
					length: to - from
				});
			};
			add(observed.gapFirstUnerased, Math.min(sector, fileSize));
			const held = observed.sector.subarray(0, Math.max(0, Math.min(ESP_FLASH_SECTOR_BYTES, fileSize - sector)));
			const slots = Array.from({ length: SIGNATURE_SLOTS }, (_, index) => {
				const from = index * ESP_SIGNATURE_BLOCK_BYTES;
				const bytes = held.subarray(from, from + ESP_SIGNATURE_BLOCK_BYTES);
				return {
					index,
					offset: sector + from,
					bytes,
					kind: bytes.length === 0 ? undefined : espSignatureSlot(bytes)
				};
			});
			for (const { index, offset, bytes, kind } of slots) {
				if (kind === "block") {
					const metadata = decodeEspSignatureBlock(bytes, index, observed.signedContent);
					blocks.push({
						offset,
						metadata
					});
					if (metadata.image_digest_matches === false) limitations.push(ESP_IMAGE_LIMITATIONS.signatureDigestMismatch(index, offset));
				} else if (kind === "other" && bytes[0] === 231) limitations.push(ESP_IMAGE_LIMITATIONS.invalidSignatureSlot(index, offset));
			}
			const sectorEnd = sector + ESP_FLASH_SECTOR_BYTES;
			const slotsEnd = sector + SIGNATURE_SLOTS * ESP_SIGNATURE_BLOCK_BYTES;
			if (blocks.length === 0) {
				add(firstUnerased(held, sector), sector + held.length);
				add(observed.restFirstUnerased, fileSize);
				if (undescribed.length > 0 || fileSize >= slotsEnd) return {
					blocks,
					undescribed,
					truncated: false
				};
				limitations.push(ESP_IMAGE_LIMITATIONS.signatureSlotsCut(fileSize, sector));
				return {
					blocks,
					undescribed,
					truncated: true
				};
			}
			for (const { offset, bytes, kind } of slots) if (kind === "other") add(offset, offset + bytes.length);
			const slack = held.subarray(SIGNATURE_SLOTS * ESP_SIGNATURE_BLOCK_BYTES);
			add(firstUnerased(slack, slotsEnd), sector + held.length);
			add(observed.restFirstUnerased, fileSize);
			if (fileSize < sectorEnd) {
				limitations.push(ESP_IMAGE_LIMITATIONS.signatureSectorTruncated(sector, fileSize, sectorEnd));
				return {
					blocks,
					undescribed,
					truncated: true
				};
			}
			return {
				blocks,
				undescribed,
				truncated: false
			};
		};
	})))();
}

//#endregion
//#region dist/domain/firmware/espImage.js
var ESP_IMAGE_MAGIC, ESP_IMAGE_HEADER_BYTES, ESP_IMAGE_MAX_SEGMENTS, CHECKSUM_SEED, SPI_SPEEDS, LAST_SPI_MODE, ESP8266_LOAD_REGIONS, ESP8266_REFUSAL, alignUp, recognizeHeader, recognizeEspImage, createEspImageDecoder, StreamingEspImageDecoder;
function init_espImage() {
	return (init_espImage = __esmMin((() => {
		init_result();
		init_espImageFacts();
		init_espImageStructures();
		ESP_IMAGE_MAGIC = 233;
		ESP_IMAGE_HEADER_BYTES = 24;
		ESP_IMAGE_MAX_SEGMENTS = 16;
		CHECKSUM_SEED = 239;
		SPI_SPEEDS = new Set([
			0,
			1,
			2,
			15
		]);
		LAST_SPI_MODE = 5;
		ESP8266_LOAD_REGIONS = [
			[1073643520, 1073741824],
			[1074790400, 1074855936],
			[1075838976, 1076887552]
		];
		ESP8266_REFUSAL = "ESP8266 firmware images are not supported: they share the 0xE9 magic but have an 8-byte header without the ESP32 extended header";
		alignUp = (value, alignment) => Math.ceil(value / alignment) * alignment;
		recognizeHeader = (prefix, fileSize) => {
			if (!Number.isSafeInteger(fileSize) || prefix[0] !== 233) return undefined;
			const count = prefix[1] ?? 0;
			if (count > 16) return undefined;
			if (count > 0 && prefix.length >= 16 && fileSize >= 16) {
				const firstLoad = u32(prefix, 8);
				if (ESP8266_LOAD_REGIONS.some(([low, high]) => firstLoad >= low && firstLoad < high) && u32(prefix, 12) % 4 === 0) return "esp8266";
			}
			if (fileSize < 24 || prefix.length < 24) return undefined;
			return (prefix[2] ?? 0) > LAST_SPI_MODE || !SPI_SPEEDS.has((prefix[3] ?? 0) & 15) || (prefix[23] ?? 0) > 1 ? undefined : "esp-image";
		};
		recognizeEspImage = (prefix, fileSize) => {
			const recognized = recognizeHeader(prefix, fileSize);
			const firstHeaderEnd = 24 + 8;
			if (recognized !== "esp-image") return recognized;
			if (prefix[1] === 0) return undefined;
			if (fileSize < firstHeaderEnd) return recognized;
			if (prefix.length < firstHeaderEnd) return undefined;
			return u32(prefix, 28) % 4 === 0 ? "esp-image" : undefined;
		};
		createEspImageDecoder = (fileSize) => new StreamingEspImageDecoder(fileSize);
		StreamingEspImageDecoder = class {
			#fileSize;
			#header = new Uint8Array(24);
			#segmentHeader = new Uint8Array(8);
			#segments = [];
			#descriptor = new Uint8Array(256);
			#digest = new Uint8Array(32);
			#sector = new Uint8Array(ESP_FLASH_SECTOR_BYTES);
			/** Hash every byte before the sector; signatures cover all of them. */
			#sha256 = createHash("sha256");
			#sha384 = createHash("sha384");
			#stage = "header";
			#position = 0;
			#regionStart = 0;
			#regionEnd = 24;
			#segmentCount = 0;
			#checksum = CHECKSUM_SEED;
			#descriptorBytes = 0;
			#checksumOffset;
			#storedChecksum;
			#imageSha256;
			#imageEnd;
			#sectorOffset;
			#gapFirstUnerased;
			#restFirstUnerased;
			#contentSha256;
			#contentSha384;
			#failure;
			constructor(fileSize) {
				this.#fileSize = fileSize;
			}
			/** Reading stops at the first byte after the sector that is not erased. */
			get satisfied() {
				return this.#failure !== undefined || this.#stage === "rest" && this.#restFirstUnerased !== undefined;
			}
			write(chunk) {
				let index = 0;
				for (;;) {
					while (!this.satisfied && this.#position >= this.#regionEnd) this.#advance();
					if (this.satisfied || index >= chunk.length) return;
					const length = Math.min(chunk.length - index, this.#regionEnd - this.#position);
					this.#consume(chunk.subarray(index, index + length));
					index += length;
				}
			}
			finish() {
				if (this.#failure !== undefined) return err(this.#failure);
				if (!this.satisfied && this.#position !== this.#fileSize) return err({
					kind: "format",
					message: `ESP image input ended at offset ${offsetText(this.#position)}, before the admitted size ${offsetText(this.#fileSize)}`
				});
				if (this.#stage === "header") return err({
					kind: "format",
					message: `ESP image header needs ${String(24)} bytes; the file holds ${String(this.#position)}`
				});
				return ok(deriveEspImage({
					fileSize: this.#fileSize,
					observedEnd: this.#position,
					header: this.#header,
					segments: this.#segments,
					descriptorBytes: this.#descriptor.subarray(0, this.#descriptorBytes),
					checksum: this.#checksum,
					checksumOffset: this.#checksumOffset,
					storedChecksum: this.#storedChecksum,
					imageSha256: this.#imageSha256,
					storedDigest: this.#digest,
					imageEnd: this.#imageEnd,
					sectorOffset: this.#sectorOffset,
					gapFirstUnerased: this.#gapFirstUnerased,
					sector: this.#sector,
					restFirstUnerased: this.#restFirstUnerased,
					signedContent: {
						sha256: this.#contentSha256,
						sha384: this.#contentSha384
					}
				}));
			}
			#consume(bytes) {
				const within = this.#position - this.#regionStart;
				switch (this.#stage) {
					case "header":
						this.#header.set(bytes, this.#position);
						break;
					case "segment-header":
						this.#segmentHeader.set(bytes, within);
						break;
					case "segment-data": {
						let checksum = this.#checksum;
						for (let index = 0; index < bytes.length; index += 1) checksum ^= bytes[index] ?? 0;
						this.#checksum = checksum;
						if (this.#segments.length === 1 && this.#descriptorBytes < 256) {
							const captured = bytes.subarray(0, 256 - this.#descriptorBytes);
							this.#descriptor.set(captured, this.#descriptorBytes);
							this.#descriptorBytes += captured.length;
						}
						break;
					}
					case "checksum":
						this.#storedChecksum = bytes[0];
						break;
					case "digest":
						this.#digest.set(bytes, within);
						break;
					case "gap":
						this.#gapFirstUnerased ??= firstUnerased(bytes, this.#position);
						break;
					case "sector":
						this.#sector.set(bytes, within);
						break;
					case "rest":
						this.#restFirstUnerased ??= firstUnerased(bytes, this.#position);
						break;
					case "padding": break;
				}
				if (this.#sectorOffset === undefined || this.#position < this.#sectorOffset) {
					this.#sha256.update(bytes);
					this.#sha384.update(bytes);
				}
				this.#position += bytes.length;
			}
			/** Enter the next region once the current one is complete. */
			#advance() {
				switch (this.#stage) {
					case "header": {
						const recognized = recognizeHeader(this.#header, this.#fileSize);
						if (recognized !== "esp-image") {
							this.#failure = recognized === "esp8266" ? {
								kind: "unsupported",
								message: ESP8266_REFUSAL
							} : {
								kind: "format",
								message: "ESP image header is not recognized: it needs magic 0xe9, at most 16 segments, ESP-IDF flash mode and speed codes, and a hash_appended byte of 0 or 1"
							};
							return;
						}
						this.#segmentCount = this.#header[1] ?? 0;
						this.#nextSegment();
						return;
					}
					case "segment-header": {
						const length = u32(this.#segmentHeader, 4);
						this.#segments.push({
							index: this.#segments.length,
							headerOffset: this.#regionStart,
							loadAddress: u32(this.#segmentHeader, 0),
							length
						});
						this.#enter("segment-data", length);
						return;
					}
					case "segment-data":
						this.#nextSegment();
						return;
					case "padding":
						this.#enter("checksum", 1);
						return;
					case "checksum":
						this.#imageSha256 = this.#sha256.copy().digest("hex");
						if (this.#header[23] === 1) this.#enter("digest", 32);
						else this.#endImage();
						return;
					case "digest":
						this.#endImage();
						return;
					case "gap":
						this.#contentSha256 = this.#sha256.digest("hex");
						this.#contentSha384 = this.#sha384.digest("hex");
						this.#enter("sector", ESP_FLASH_SECTOR_BYTES);
						return;
					case "sector":
						this.#enter("rest", Number.POSITIVE_INFINITY);
						return;
					case "rest": return;
				}
			}
			#enter(stage, length) {
				this.#stage = stage;
				this.#regionStart = this.#position;
				this.#regionEnd = this.#position + length;
			}
			/** Read the next declared segment, or the checksum after the last one. */
			#nextSegment() {
				if (this.#segments.length < this.#segmentCount) {
					this.#enter("segment-header", 8);
					return;
				}
				this.#checksumOffset = alignUp(this.#position + 1, 16) - 1;
				this.#enter("padding", this.#checksumOffset - this.#position);
			}
			#endImage() {
				this.#imageEnd = this.#position;
				this.#sectorOffset = alignUp(this.#position, ESP_FLASH_SECTOR_BYTES);
				this.#enter("gap", this.#sectorOffset - this.#position);
			}
		};
	})))();
}

//#endregion
//#region dist/domain/firmware/espFlashBootloader.js
var ESP_BOOTLOADER_PROBE_BYTES, locateEspBootloader, espImageSegmentsEnd, espBootloaderProbeOffsets;
function init_espFlashBootloader() {
	return (init_espFlashBootloader = __esmMin((() => {
		init_espChips();
		init_espImage();
		init_espImageStructures();
		ESP_BOOTLOADER_PROBE_BYTES = 32;
		locateEspBootloader = (probes) => {
			const limitations = [];
			let misplacedImage;
			let esp8266 = false;
			for (const probe of probes) {
				const recognized = recognizeEspImage(probe.prefix, probe.available);
				if (recognized === "esp8266") esp8266 = true;
				if (recognized !== "esp-image") continue;
				const chipId = u16(probe.prefix, 12);
				const chip = espChipForId(chipId);
				if (chip?.romBootloaderOffset === probe.flashAddress) return {
					location: {
						flashAddress: probe.flashAddress,
						fileOffset: probe.fileOffset,
						chip
					},
					limitations: [],
					misplacedImage: undefined,
					esp8266: false
				};
				if (chip !== undefined) misplacedImage ??= {
					chip,
					fileOffset: probe.fileOffset
				};
				limitations.push(chip === undefined ? `An ESP image at flash ${offsetText(probe.flashAddress)} has chip_id 0x${chipId.toString(16).padStart(4, "0")}, which is not in the chip table; it is not read as the bootloader.` : `An ${chip.target} image is at flash ${offsetText(probe.flashAddress)}, but its ROM loads the bootloader from ${offsetText(chip.romBootloaderOffset)}; the dump may not start at flash ${offsetText(probe.flashAddress - probe.fileOffset)}.`);
			}
			return {
				location: undefined,
				limitations,
				misplacedImage,
				esp8266
			};
		};
		espImageSegmentsEnd = async (read, fileOffset, fileSize) => {
			const header = await read(fileOffset, 24);
			if (header.length < 24) return fileSize;
			let cursor = fileOffset + 24;
			for (let index = 0; index < (header[1] ?? 0); index += 1) {
				const segment = await read(cursor, 8);
				if (segment.length < 8) return fileSize;
				cursor += 8 + u32(segment, 4);
				if (cursor >= fileSize) return fileSize;
			}
			return cursor;
		};
		espBootloaderProbeOffsets = (flashOffset, fileSize) => ESP_ROM_BOOTLOADER_OFFSETS.map((flashAddress) => ({
			flashAddress,
			fileOffset: flashAddress - flashOffset
		})).filter(({ fileOffset }) => fileOffset >= 0 && fileOffset < fileSize);
	})))();
}

//#endregion
//#region dist/domain/firmware/espFlashLocation.js
var SCAN_CHUNK_BYTES, MAGIC_LOW, MAGIC_HIGH, tableAt, espFlashDumpOrigin, scanForTable, locateEspFlashLayout;
function init_espFlashLocation() {
	return (init_espFlashLocation = __esmMin((() => {
		init_result();
		init_espFlashBootloader();
		init_espImage();
		init_espImageStructures();
		init_espPartitionTable();
		SCAN_CHUNK_BYTES = 65536;
		MAGIC_LOW = 170;
		MAGIC_HIGH = 80;
		tableAt = async (read, fileOffset) => decodeEspPartitionTable(await read(fileOffset, ESP_PARTITION_TABLE_MAX_BYTES));
		espFlashDumpOrigin = async (read, fileSize, image) => {
			const flashOffset = image.chip.romBootloaderOffset - image.fileOffset;
			const tableFileOffset = ESP_PARTITION_TABLE_DEFAULT_OFFSET - flashOffset;
			if (flashOffset <= 0 || tableFileOffset < image.end || tableFileOffset >= fileSize) return undefined;
			return (await tableAt(read, tableFileOffset)).ok ? {
				flashOffset,
				tableFileOffset
			} : undefined;
		};
		scanForTable = async (read, { fileSize, origin, start }, signal) => {
			const sector = ESP_PARTITION_TABLE_SECTOR_BYTES;
			const boundary = (sector - origin % sector) % sector;
			let position = start <= boundary ? boundary : boundary + Math.ceil((start - boundary) / sector) * sector;
			let chunkStart = position;
			let bytes = new Uint8Array(0);
			for (; position < fileSize; position += sector) {
				if (position - chunkStart + 2 > bytes.length) {
					signal?.throwIfAborted();
					chunkStart = position;
					bytes = await read(position, SCAN_CHUNK_BYTES);
				}
				const at = position - chunkStart;
				if (bytes[at] !== MAGIC_LOW || bytes[at + 1] !== MAGIC_HIGH) continue;
				const decoded = await tableAt(read, position);
				if (decoded.ok && decoded.value.md5.status === "valid") return {
					address: origin + position,
					table: decoded.value
				};
			}
			return undefined;
		};
		locateEspFlashLayout = async (fileSize, read, selection, { explicit, signal }) => {
			const origin = selection.flashOffset === undefined ? {
				value: 0,
				source: "default"
			} : {
				value: selection.flashOffset,
				source: "caller"
			};
			const probes = await Promise.all(espBootloaderProbeOffsets(origin.value, fileSize).map(async ({ flashAddress, fileOffset }) => ({
				flashAddress,
				fileOffset,
				prefix: await read(fileOffset, 32),
				available: fileSize - fileOffset
			})));
			const bootloader = locateEspBootloader(probes);
			const unconfirmed = bootloader.location === undefined && bootloader.misplacedImage === undefined && origin.source === "default" ? [`No bootloader at a ROM offset confirms that the dump starts at flash ${offsetText(origin.value)}; each partition's file offset assumes it. Pass flash_offset if the dump starts elsewhere.`] : [];
			const located = (tableAddress, tableMethod, table) => ok({
				origin,
				bootloader: bootloader.location,
				tableAddress,
				tableMethod,
				table,
				limitations: [...bootloader.limitations, ...unconfirmed]
			});
			const fileOffsetOf = (address) => address - origin.value;
			if (selection.partitionTableOffset !== undefined) {
				const address = selection.partitionTableOffset;
				if (fileOffsetOf(address) < 0 || fileOffsetOf(address) >= fileSize) return err(`the partition table offset ${offsetText(address)} is outside the dump, which holds flash ${offsetText(origin.value)}-${offsetText(origin.value + fileSize)}`);
				const decoded = await tableAt(read, fileOffsetOf(address));
				return decoded.ok ? located(address, "caller", decoded.value) : err(`no partition table at the given offset ${offsetText(address)}: ${decoded.error}`);
			}
			if (bootloader.location === undefined && bootloader.esp8266) return err(ESP8266_REFUSAL);
			const misplaced = bootloader.misplacedImage;
			if (bootloader.location === undefined && misplaced !== undefined) {
				const implied = await espFlashDumpOrigin(read, fileSize, {
					...misplaced,
					end: await espImageSegmentsEnd(read, misplaced.fileOffset, fileSize)
				});
				return err(`${bootloader.limitations.join(" ")} ${implied === undefined ? "Pass the flash_offset where the dump starts, or partition_table_offset" : `A partition table at file offset ${offsetText(implied.tableFileOffset)} shows the dump was read from flash ${offsetText(implied.flashOffset)}; pass flash_offset ${offsetText(implied.flashOffset)}`}`);
			}
			const imageEnd = bootloader.location === undefined ? 0 : await espImageSegmentsEnd(read, bootloader.location.fileOffset, fileSize);
			const defaultOffset = fileOffsetOf(ESP_PARTITION_TABLE_DEFAULT_OFFSET);
			if (defaultOffset >= imageEnd && defaultOffset < fileSize) {
				const decoded = await tableAt(read, defaultOffset);
				if (decoded.ok) return located(ESP_PARTITION_TABLE_DEFAULT_OFFSET, "default", decoded.value);
			}
			if (bootloader.location === undefined && !explicit) return err([`no partition table at ${offsetText(ESP_PARTITION_TABLE_DEFAULT_OFFSET)} and no bootloader at a ROM offset`, ...bootloader.limitations].join("; "));
			const scanned = await scanForTable(read, {
				fileSize,
				origin: origin.value,
				start: imageEnd
			}, signal);
			return scanned === undefined ? err(`no partition table at ${offsetText(ESP_PARTITION_TABLE_DEFAULT_OFFSET)} or in any 0x1000-aligned flash sector${bootloader.location === undefined ? "" : " after the bootloader image"} with a verified MD5; flash encryption is one cause`) : located(scanned.address, "scan", scanned.table);
		};
	})))();
}

//#endregion
export { ESP8266_REFUSAL, ESP_CHIP_TABLE_SOURCE, ESP_IMAGE_LIMITATIONS, HEX_RECORD_ENCODING_LABELS, UIMAGE_MAGIC, UIMAGE_MULTI_TABLE_WINDOW, UNITYFS_HEADER_STRING_MAX, UNITYFS_SIGNATURE, artifactNameForClassification, claimsExecutableHeader, createEspImageDecoder, createHexRecordDecoder, createUf2Decoder, detectHexRecordEncoding, espChipForId, espFlashDumpOrigin, hasDiskImageSignature, hasFitImagesNode, hasGodotPckHeader, hasUImageMagic, hasUImageSizeTable, hasUf2Block, hasUnityFsHeader, hasWxapkgEncryptedMagic, hasWxapkgHeader, init_artifactNameSelection, init_binaryTarget, init_diskImageFormat, init_elfProgramHeader, init_elfRawTableDeclarations, init_elfSectionHeader, init_espChips, init_espFlashLocation, init_espImage, init_espImageFacts, init_fitImage, init_godotPckFormat, init_hexRecords, init_peSectionHeader, init_uf2, init_uimageFormat, init_unityfsFormat, init_wxapkgFormat, locateEspFlashLayout, namedArtifactFormat, parseCodeViewData, parseExecutableHeader, parseMultiImageTable, parseMzExecutableMetadata, parsePeRecordFacts, parseUImageHeaderFields, peCodeViewDataRanges, peDebugDirectoryEntry, peRvaToFileOffset, readElfProgramHeader, readElfRawTableDeclarations, readElfSectionHeader, readFatArchitectureFamilies, readGodotPckHeaderFacts, readGodotPckTrailerFacts, readPeSectionHeader, readUnityFsHeaderFacts, readWxapkgHeaderFacts, recognizeEspImage, resolveWxapkgIndexLayouts, selectWxapkgIndexLayout, unityFsLayoutFlags };