import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { init_peOptionalHeader, readPeOptionalHeaderStructure } from "./peOptionalHeader-DFX4E6Yt.js";

//#region dist/domain/elfFixedHeader.js
var readElfHeaderFacts, readElfFixedHeader, elfArchitecture;
function init_elfFixedHeader() {
	return (init_elfFixedHeader = __esmMin((() => {
		init_result();
		readElfHeaderFacts = (bytes, totalBytes = bytes.length) => {
			if (bytes.length >= 4 && bytes.toString("hex", 0, 4) !== "7f454c46") return err("not an ELF image");
			if (bytes.length < 16) return err("ELF identification is truncated");
			const classByte = bytes[4];
			if (classByte !== 1 && classByte !== 2) return err("unsupported ELF class");
			const dataByte = bytes[5];
			if (dataByte !== 1 && dataByte !== 2) return err("unsupported ELF endianness");
			if (bytes[6] !== 1) return err("unsupported ELF identification version");
			const elfClass = classByte === 1 ? 32 : 64;
			const minimumSize = elfClass === 32 ? 52 : 64;
			if (!Number.isSafeInteger(totalBytes) || totalBytes < bytes.length || totalBytes < minimumSize || bytes.length < minimumSize) return err(`truncated ELF header: an ELF${elfClass} header needs ${minimumSize} bytes; the file has ${totalBytes}`);
			const littleEndian = dataByte === 1;
			const readU16 = (offset) => littleEndian ? bytes.readUInt16LE(offset) : bytes.readUInt16BE(offset);
			const readU32 = (offset) => littleEndian ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
			const machine = readU16(18);
			const headerSize = readU16(elfClass === 32 ? 40 : 52);
			return ok({
				elfClass,
				byteOrder: littleEndian ? "little" : "big",
				headerSize,
				machine,
				type: readU16(16),
				flags: readU32(elfClass === 32 ? 36 : 48),
				osAbi: bytes[7],
				version: readU32(20),
				abiVersion: bytes[8]
			});
		};
		readElfFixedHeader = (bytes, totalBytes = bytes.length) => {
			const parsed = readElfHeaderFacts(bytes, totalBytes);
			if (!parsed.ok) return parsed;
			const facts = parsed.value;
			if (facts.version !== 1 && !(facts.machine === 190 && facts.osAbi === 51)) return err("unsupported ELF header version");
			const minimumSize = facts.elfClass === 32 ? 52 : 64;
			if (facts.headerSize < minimumSize || facts.headerSize > totalBytes) return err("invalid ELF header size");
			return ok({
				elfClass: facts.elfClass,
				byteOrder: facts.byteOrder,
				headerSize: facts.headerSize,
				machine: facts.machine,
				type: facts.type,
				flags: facts.flags,
				osAbi: facts.osAbi,
				architecture: elfArchitecture(facts.machine) ?? null
			});
		};
		elfArchitecture = (machine) => {
			switch (machine) {
				case 3: return "x86";
				case 62: return "x86_64";
				case 8: return "mips";
				case 20: return "powerpc";
				case 40: return "arm";
				case 164: return "hexagon";
				case 183: return "arm64";
				case 243: return "riscv";
			}
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/peMachine.js
var architectureForMachine, peOptionalHeaderMagic, NATIVE_OS_OVERRIDES, decodePeMachine, peSubjectArchitecture, readPeOptionalHeader;
function init_peMachine() {
	return (init_peMachine = __esmMin((() => {
		init_peOptionalHeader();
		init_result();
		architectureForMachine = (machine) => {
			switch (machine) {
				case 332: return "x86";
				case 34404: return "x86_64";
				case 448:
				case 450:
				case 452: return "arm";
				case 43620: return "arm64";
			}
			return undefined;
		};
		peOptionalHeaderMagic = (architecture) => architecture === "x86_64" || architecture === "arm64" ? 523 : 267;
		NATIVE_OS_OVERRIDES = [
			17988,
			44484,
			44485,
			31609,
			6547,
			6546
		];
		decodePeMachine = (machine) => {
			const direct = architectureForMachine(machine);
			if (direct !== undefined) return {
				architecture: direct,
				nativeOsOverride: false
			};
			for (const override of NATIVE_OS_OVERRIDES) {
				const architecture = architectureForMachine(machine ^ override);
				if (architecture !== undefined) return {
					architecture,
					nativeOsOverride: true
				};
			}
			return undefined;
		};
		peSubjectArchitecture = (machineType, format) => {
			const machine = decodePeMachine(machineType);
			if (machine === undefined || machine.nativeOsOverride) return undefined;
			const magic = format === "pe32-plus" ? 523 : 267;
			return magic === peOptionalHeaderMagic(machine.architecture) ? machine.architecture : undefined;
		};
		readPeOptionalHeader = (optionalHeader, machineType) => {
			const parsed = readPeOptionalHeaderStructure(optionalHeader);
			if (!parsed.ok) return err({
				kind: parsed.error.kind,
				message: parsed.error.message
			});
			const facts = parsed.value;
			const cli = facts.dataDirectories[14];
			const managed = cli !== undefined && (cli.address !== 0 || cli.size !== 0);
			const decoded = decodePeMachine(machineType);
			const machine = decoded?.nativeOsOverride && !managed ? null : decoded ?? null;
			if (machine !== null && facts.magic !== peOptionalHeaderMagic(machine.architecture)) return err({
				kind: "malformed",
				message: "PE optional-header magic does not match its architecture"
			});
			return ok({
				...facts,
				machine,
				managed
			});
		};
	})))();
}

//#endregion
export { decodePeMachine, elfArchitecture, init_elfFixedHeader, init_peMachine, peSubjectArchitecture, readElfFixedHeader, readElfHeaderFacts, readPeOptionalHeader };