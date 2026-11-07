import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";

//#region dist/domain/dosMz.js
var fixedDosMzDeclarations, readDosMzDeclarations, dosMzDeclaredImageByteLength, mzWindowsHeaderLayoutLimitation, observeMzWindowsHeader, observeWindowsHeader, windowsHeaderSignature, parseDosMzHeader, parseDeclaredDosMzHeader, parseMzHeaderEvidence, parseDeclaredMzHeaderEvidence, withMzWindowsHeaderSignature, readRelocations;
function init_dosMz() {
	return (init_dosMz = __esmMin((() => {
		init_result();
		fixedDosMzDeclarations = (bytes) => {
			const relocationCount = bytes.readUInt16LE(6);
			const relocationTableOffset = bytes.readUInt16LE(24);
			return {
				lastPageBytes: bytes.readUInt16LE(2),
				pages: bytes.readUInt16LE(4),
				headerBytes: bytes.readUInt16LE(8) * 16,
				relocationCount,
				relocationTableOffset,
				relocationTableEnd: relocationTableOffset + relocationCount * 4,
				entrySegment: bytes.readUInt16LE(22),
				entryOffset: bytes.readUInt16LE(20)
			};
		};
		readDosMzDeclarations = (bytes) => bytes.length < 28 || bytes.toString("latin1", 0, 2) !== "MZ" ? err("invalid or truncated DOS MZ header") : ok(fixedDosMzDeclarations(bytes));
		dosMzDeclaredImageByteLength = ({ pages, lastPageBytes }) => {
			if (pages === 0 || lastPageBytes > 511) return err("invalid DOS MZ page count or final-page size");
			return ok((pages - 1) * 512 + (lastPageBytes === 0 ? 512 : lastPageBytes));
		};
		mzWindowsHeaderLayoutLimitation = (header) => header.offset < 64 ? `Unsupported overlapping ${header.signature} header at file offset ${String(header.offset)}; this reader requires the Windows header outside the 64-byte DOS header` : undefined;
		observeMzWindowsHeader = (bytes, fileSize = bytes.length, signatureEvidence) => observeWindowsHeader(bytes, fileSize, signatureEvidence);
		observeWindowsHeader = (bytes, fileSize, signatureEvidence, declarations) => {
			if (bytes.length < 64) return fileSize >= 64 ? { state: "header-needed" } : { state: "absent" };
			const { headerBytes, relocationCount, relocationTableOffset: tableStart, relocationTableEnd: tableEnd } = declarations ?? fixedDosMzDeclarations(bytes);
			if (headerBytes !== 0 && relocationCount > 0 && tableStart < 64 && tableEnd > 60) return { state: "absent" };
			const offset = bytes.readUInt32LE(60);
			if (offset === 0) return { state: "absent" };
			const inlineSignature = offset < bytes.length ? bytes.subarray(offset, Math.min(offset + 4, bytes.length)) : undefined;
			const available = signatureEvidence?.offset === offset ? signatureEvidence.bytes : inlineSignature;
			const signature = windowsHeaderSignature(available);
			if (signature !== "other" && signature !== "unobserved") return {
				state: "declared",
				offset,
				signature
			};
			if (headerBytes >= 64 && relocationCount > 0 && tableEnd <= 60 && (signature === "other" || fileSize - offset < 2)) return { state: "absent" };
			if (headerBytes === 0 || headerBytes >= 64) {
				const remaining = fileSize - offset;
				const needsMore = available === undefined && remaining >= 2 || available !== undefined && available.length < 2 && remaining >= 2 || available !== undefined && available.length >= 2 && available.toString("latin1", 0, 2) === "PE" && available.length < 4 && remaining >= 4;
				if (needsMore && signatureEvidence?.offset !== offset) return {
					state: "signature-needed",
					offset
				};
				return {
					state: "candidate",
					offset,
					signature
				};
			}
			if (signature === "other") return { state: "absent" };
			const observedPePrefix = available !== undefined && available.length >= 2 && available.toString("latin1", 0, 2) === "PE";
			if (fileSize - offset < (observedPePrefix ? 4 : 2)) return { state: "absent" };
			return {
				state: "signature-needed",
				offset
			};
		};
		windowsHeaderSignature = (bytes) => {
			if (bytes === undefined || bytes.length < 2) return "unobserved";
			const first = bytes[0];
			const second = bytes[1];
			if (first === 78 && second === 69) return "NE";
			if (first === 76 && second === 69) return "LE";
			if (first === 76 && second === 88) return "LX";
			if (first !== 80 || second !== 69) return "other";
			if (bytes.length < 4) return "unobserved";
			return bytes[2] === 0 && bytes[3] === 0 ? "PE" : "other";
		};
		parseDosMzHeader = (bytes, fileSize = bytes.length) => parseDeclaredDosMzHeader(bytes, fileSize, readDosMzDeclarations(bytes));
		parseDeclaredDosMzHeader = (bytes, fileSize, declarations) => {
			if (!declarations.ok) return declarations;
			if (!Number.isSafeInteger(fileSize) || fileSize < bytes.length) return err("invalid DOS MZ file length");
			const extent = dosMzDeclaredImageByteLength(declarations.value);
			if (!extent.ok) return extent;
			const imageBytes = extent.value;
			const { headerBytes, relocationCount, relocationTableOffset, relocationTableEnd: tableEnd, entryOffset, entrySegment } = declarations.value;
			if (headerBytes < 28 || headerBytes >= imageBytes) return err("invalid DOS MZ header size or empty load module");
			if (imageBytes > fileSize) return err("truncated DOS MZ load module");
			if (relocationCount > 0 && (relocationTableOffset < 28 || tableEnd > headerBytes)) return err("DOS MZ relocation table lies outside its header");
			if (relocationCount > 0 && tableEnd > bytes.length) return err("truncated DOS MZ relocation table");
			const moduleBytes = imageBytes - headerBytes;
			const relocations = readRelocations(bytes, relocationTableOffset, relocationCount, headerBytes, moduleBytes);
			if (!relocations.ok) return relocations;
			if (entrySegment * 16 + entryOffset >= moduleBytes) return err("DOS MZ entry point lies outside its initialized load module");
			return ok({
				headerBytes,
				imageBytes,
				moduleBytes,
				overlayBytes: fileSize - imageBytes,
				relocationCount,
				relocationTableOffset,
				relocations: relocations.value,
				entrySegment,
				entryOffset
			});
		};
		parseMzHeaderEvidence = (bytes, fileSize = bytes.length, signatureEvidence) => parseDeclaredMzHeaderEvidence(bytes, fileSize, readDosMzDeclarations(bytes), signatureEvidence);
		parseDeclaredMzHeaderEvidence = (bytes, fileSize, declarations, signatureEvidence) => {
			const fields = declarations.ok ? declarations.value : undefined;
			const needed = fields !== undefined && Number.isSafeInteger(fileSize) && fileSize >= bytes.length && fields.relocationCount > 0 && fields.relocationTableEnd > bytes.length && fields.relocationTableEnd <= fields.headerBytes && fields.relocationTableEnd <= fileSize;
			return {
				declarations,
				...needed ? { relocationTableRead: {
					offset: 0,
					byteLength: fields.relocationTableEnd
				} } : {},
				dos: parseDeclaredDosMzHeader(bytes, fileSize, declarations),
				windowsHeader: observeWindowsHeader(bytes, fileSize, signatureEvidence, fields)
			};
		};
		withMzWindowsHeaderSignature = (bytes, fileSize, evidence, signature) => ({
			...evidence,
			windowsHeader: observeWindowsHeader(bytes, fileSize, signature, evidence.declarations.ok ? evidence.declarations.value : undefined)
		});
		readRelocations = (bytes, relocationTableOffset, relocationCount, headerBytes, moduleBytes) => {
			const relocations = [];
			for (let index = 0; index < relocationCount; index += 1) {
				const record = relocationTableOffset + index * 4;
				const offset = bytes.readUInt16LE(record);
				const segment = bytes.readUInt16LE(record + 2);
				const moduleOffset = segment * 16 + offset;
				if (moduleOffset + 2 > moduleBytes) return err(`DOS MZ relocation ${index} points outside its load module`);
				relocations.push({
					segment,
					offset,
					moduleOffset,
					fileOffset: headerBytes + moduleOffset
				});
			}
			return ok(relocations);
		};
	})))();
}

//#endregion
//#region dist/domain/peCoffHeader.js
var readPeCoffHeader;
function init_peCoffHeader() {
	return (init_peCoffHeader = __esmMin((() => {
		init_result();
		readPeCoffHeader = (bytes) => {
			if (bytes.length < 20) return err({
				kind: "malformed",
				message: "PE COFF header is truncated"
			});
			return ok({
				machine: bytes.readUInt16LE(0),
				sectionCount: bytes.readUInt16LE(2),
				optionalHeaderSize: bytes.readUInt16LE(16),
				characteristics: bytes.readUInt16LE(18)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/peOptionalHeader.js
var readPeOptionalHeaderIdentity, readPeOptionalHeaderFixedFields, readDirectory, readPeOptionalHeaderDirectory, readPeOptionalHeaderStructure;
function init_peOptionalHeader() {
	return (init_peOptionalHeader = __esmMin((() => {
		init_result();
		readPeOptionalHeaderIdentity = (bytes) => {
			if (bytes.byteLength < 2) return err({
				kind: "malformed",
				reason: "truncated-magic",
				message: "truncated PE optional header"
			});
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const magic = view.getUint16(0, true);
			if (magic !== 267 && magic !== 523) return err({
				kind: "unsupported",
				reason: "unsupported-magic",
				message: "Only PE32 and PE32+ image optional headers are supported"
			});
			const bits = magic === 523 ? 64 : 32;
			return ok({
				magic,
				bits,
				format: bits === 64 ? "pe32-plus" : "pe32"
			});
		};
		readPeOptionalHeaderFixedFields = (bytes) => {
			const identity = readPeOptionalHeaderIdentity(bytes);
			if (!identity.ok) return identity;
			const { bits } = identity.value;
			const directoryOffset = bits === 64 ? 112 : 96;
			if (bytes.byteLength < 64) return err({
				kind: "malformed",
				reason: "truncated-fixed-fields",
				message: "truncated PE optional header"
			});
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			return ok({
				...identity.value,
				imageBase: bits === 64 ? view.getBigUint64(24, true) : BigInt(view.getUint32(28, true)),
				sectionAlignment: view.getUint32(32, true),
				fileAlignment: view.getUint32(36, true),
				sizeOfImage: view.getUint32(56, true),
				sizeOfHeaders: view.getUint32(60, true),
				directoryOffset,
				directoryCountOffset: directoryOffset - 4
			});
		};
		readDirectory = (view, offset) => ({
			address: view.getUint32(offset, true),
			size: view.getUint32(offset + 4, true),
			offset
		});
		readPeOptionalHeaderDirectory = (bytes, fixed, index) => {
			if (bytes.byteLength < fixed.directoryOffset) return { state: "count-unavailable" };
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const count = view.getUint32(fixed.directoryCountOffset, true);
			if (index >= count) return {
				state: "absent",
				count
			};
			const offset = fixed.directoryOffset + index * 8;
			if (offset > bytes.byteLength - 8) return {
				state: "truncated",
				count
			};
			return {
				state: "present",
				count,
				directory: readDirectory(view, offset)
			};
		};
		readPeOptionalHeaderStructure = (bytes) => {
			const parsed = readPeOptionalHeaderFixedFields(bytes);
			if (!parsed.ok) return parsed;
			const fixed = parsed.value;
			if (bytes.byteLength < fixed.directoryOffset) return err({
				kind: "malformed",
				reason: "truncated-fixed-fields",
				message: "truncated PE optional header"
			});
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const directoryCount = view.getUint32(fixed.directoryCountOffset, true);
			if (directoryCount > Math.floor((bytes.byteLength - fixed.directoryOffset) / 8)) return err({
				kind: "malformed",
				reason: "truncated-directory-table",
				message: "truncated PE data-directory table"
			});
			const dataDirectories = Array.from({ length: directoryCount }, (_, index) => readDirectory(view, fixed.directoryOffset + index * 8));
			return ok({
				...fixed,
				directoryCount,
				dataDirectories
			});
		};
	})))();
}

//#endregion
export { readPeOptionalHeaderStructure as a, dosMzDeclaredImageByteLength as c, observeMzWindowsHeader as d, parseDeclaredMzHeaderEvidence as f, withMzWindowsHeaderSignature as h, readPeOptionalHeaderIdentity as i, init_dosMz as l, readDosMzDeclarations as m, readPeOptionalHeaderDirectory as n, init_peCoffHeader as o, parseMzHeaderEvidence as p, readPeOptionalHeaderFixedFields as r, readPeCoffHeader as s, init_peOptionalHeader as t, mzWindowsHeaderLayoutLimitation as u };