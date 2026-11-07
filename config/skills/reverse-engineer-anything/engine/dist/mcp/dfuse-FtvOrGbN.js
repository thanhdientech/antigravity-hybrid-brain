import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { Rt as UnknownPlistScalar, jt as init_plistValue, kt as PlistNestingLimitError, zt as init_unknownPlistScalar } from "./toolOutputSchemaGroups-3HUmDmX5.js";
import { b as markPlistDictionary, g as init_plistNumbers, p as createPlistNumberCollector, y as init_plistUid } from "./interfaceBuilderGraph-D6-wBpmX.js";
import { crc32 } from "node:zlib";
import { parseBinary, parseOpenStep } from "plist";
import { DOMParser, onErrorStopParsing } from "@xmldom/xmldom";
import { SaxesParser } from "saxes";

//#region dist/artifacts/apple/BinaryPlistLayout.js
var readBinaryPlistUnsigned64, readBinaryPlistLayout;
function init_BinaryPlistLayout() {
	return (init_BinaryPlistLayout = __esmMin((() => {
		init_result();
		readBinaryPlistUnsigned64 = (bytes, offset, width) => {
			let value = 0n;
			for (let index = 0; index < width; index += 1) value = BigInt.asUintN(64, value << 8n | BigInt(bytes[offset + index] ?? 0));
			return value;
		};
		readBinaryPlistLayout = (bytes) => {
			if (bytes.byteLength < 32) return err({
				_tag: "InvalidBinaryPlistLayout",
				reason: "truncated"
			});
			const trailerOffset = bytes.byteLength - 32;
			const offsetWidth = bytes[trailerOffset + 6];
			const referenceWidth = bytes[trailerOffset + 7];
			const objectCount = readBinaryPlistUnsigned64(bytes, trailerOffset + 8, 8);
			const offsetTable = readBinaryPlistUnsigned64(bytes, trailerOffset + 24, 8);
			const objectOffset = (object) => readBinaryPlistUnsigned64(bytes, Number(offsetTable) + object * offsetWidth, offsetWidth);
			return ok({
				trailerOffset,
				offsetWidth,
				referenceWidth,
				objectCount,
				topObject: readBinaryPlistUnsigned64(bytes, trailerOffset + 16, 8),
				offsetTable,
				objectOffset,
				*objectOffsets() {
					for (let object = 0; object < Number(objectCount); object += 1) yield objectOffset(object);
				}
			});
		};
	})))();
}

//#endregion
//#region dist/domain/propertyListXmlText.js
var XmlPlistTextDecodeError, decodeXmlPlistText, declaredEncoding, asciiXmlDeclaration, verifyEncodingDeclaration;
function init_propertyListXmlText() {
	return (init_propertyListXmlText = __esmMin((() => {
		XmlPlistTextDecodeError = class extends TypeError {
			reason;
			declaredEncoding;
			constructor(reason, message, declaredEncoding, options) {
				super(message, options);
				this.reason = reason;
				this.declaredEncoding = declaredEncoding;
				this.name = "XmlPlistTextDecodeError";
			}
		};
		decodeXmlPlistText = (bytes) => {
			if (bytes[0] === 255 && bytes[1] === 254 && bytes[2] === 0 && bytes[3] === 0 || bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 254 && bytes[3] === 255) throw new XmlPlistTextDecodeError("unsupported-encoding", "Unsupported XML encoding: UTF-32. Supported encodings are UTF-8 and BOM-marked UTF-16 in either byte order.", "UTF-32");
			const encoding = bytes[0] === 255 && bytes[1] === 254 ? "utf-16le" : bytes[0] === 254 && bytes[1] === 255 ? "utf-16be" : "utf-8";
			const prolog = encoding === "utf-8" ? asciiXmlDeclaration(bytes) : undefined;
			const declaration = prolog === undefined ? undefined : declaredEncoding(prolog);
			if (prolog !== undefined) verifyEncodingDeclaration(declaration, encoding);
			let text;
			try {
				text = new TextDecoder(encoding, { fatal: true }).decode(bytes);
			} catch (cause) {
				throw new XmlPlistTextDecodeError("invalid-bytes", "XML text bytes are invalid for the detected encoding", undefined, { cause });
			}
			if (prolog === undefined) verifyEncodingDeclaration(declaredEncoding(text), encoding);
			return text;
		};
		declaredEncoding = (text) => /^<\?xml\s[^?]*\bencoding\s*=\s*["']([^"']+)["']/u.exec(text)?.[1];
		asciiXmlDeclaration = (bytes) => {
			const start = bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191 ? 3 : 0;
			if (bytes[start] !== 60 || bytes[start + 1] !== 63 || bytes[start + 2] !== 120 || bytes[start + 3] !== 109 || bytes[start + 4] !== 108) return undefined;
			for (let index = start + 5; index < bytes.length; index += 1) {
				if (bytes[index] > 127) return undefined;
				if (bytes[index] === 63 && bytes[index + 1] === 62) return new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(start, index + 2));
			}
			return undefined;
		};
		verifyEncodingDeclaration = (declaration, encoding) => {
			const declared = declaration?.toLowerCase();
			if (declared !== undefined && ![
				"utf-8",
				"utf-16",
				"utf-16le",
				"utf-16be"
			].includes(declared)) throw new XmlPlistTextDecodeError("unsupported-encoding", `Unsupported XML encoding declaration: ${declaration}. Supported encodings are UTF-8 and BOM-marked UTF-16 in either byte order.`, declaration);
			if (declared !== undefined && declared !== encoding && !(encoding !== "utf-8" && declared === "utf-16")) throw new XmlPlistTextDecodeError("encoding-mismatch", "XML encoding declaration disagrees with its bytes", declaration);
		};
	})))();
}

//#endregion
//#region dist/domain/apple/appleArchiveFormat.js
var BINARY_PLIST_MAGIC, NIB_ARCHIVE_MAGIC, MAX_XML_PLIST_PROBE_BYTES, hasBinaryPlistSignature, createXmlPlistSignatureProbe, hasXmlPlistSignature, createXmlPlistPrologScanner, tokenAt, isXmlWhitespace, hasNibArchiveSignature;
function init_appleArchiveFormat() {
	return (init_appleArchiveFormat = __esmMin((() => {
		BINARY_PLIST_MAGIC = [
			98,
			112,
			108,
			105,
			115,
			116,
			48,
			48
		];
		NIB_ARCHIVE_MAGIC = [
			78,
			73,
			66,
			65,
			114,
			99,
			104,
			105,
			118,
			101
		];
		MAX_XML_PLIST_PROBE_BYTES = 1024 * 1024;
		hasBinaryPlistSignature = (bytes) => BINARY_PLIST_MAGIC.every((byte, index) => bytes[index] === byte);
		createXmlPlistSignatureProbe = () => {
			let state = "pending";
			let preview;
			let validator;
			let utf16 = false;
			let bomBytes = 0;
			let fedBytes = 0;
			let decodedBytes = 0;
			let preamble = new Uint8Array();
			const scanner = createXmlPlistPrologScanner();
			const encodedLength = (text) => utf16 ? text.length * 2 : new TextEncoder().encode(text).length;
			return {
				get state() {
					return state;
				},
				write(bytes) {
					if (state !== "pending" || bytes.length === 0) return state;
					let selected = bytes.subarray(0, MAX_XML_PLIST_PROBE_BYTES - fedBytes - preamble.length);
					if (preview === undefined) {
						if (preamble.length !== 0 || selected.length < 4) {
							const joined = new Uint8Array(preamble.length + selected.length);
							joined.set(preamble);
							joined.set(selected, preamble.length);
							selected = joined;
							if (selected.length < 4) {
								preamble = selected;
								return state;
							}
							preamble = new Uint8Array();
						}
						const little = selected[0] === 255 && selected[1] === 254;
						const big = selected[0] === 254 && selected[1] === 255;
						utf16 = little || big;
						bomBytes = utf16 ? 2 : selected[0] === 239 && selected[1] === 187 && selected[2] === 191 ? 3 : 0;
						const encoding = little ? "utf-16le" : big ? "utf-16be" : "utf-8";
						preview = new TextDecoder(encoding);
						validator = new TextDecoder(encoding, { fatal: true });
					}
					const text = preview.decode(selected, { stream: true });
					const result = scanner(text);
					const through = result.state === "matched" ? bomBytes + decodedBytes + encodedLength(text.slice(0, result.consumed)) - fedBytes : selected.length;
					try {
						validator.decode(selected.subarray(0, through), { stream: true });
						state = result.state;
					} catch {
						state = "rejected";
					}
					decodedBytes += encodedLength(text);
					fedBytes += selected.length;
					if (fedBytes === 1048576 && state === "pending") state = "rejected";
					return state;
				}
			};
		};
		hasXmlPlistSignature = (bytes) => createXmlPlistSignatureProbe().write(bytes) === "matched";
		createXmlPlistPrologScanner = () => {
			let text = "";
			let totalCharacters = 0;
			let pending;
			let doctypeName = false;
			return (chunk) => {
				const before = totalCharacters;
				totalCharacters += chunk.length;
				text += chunk;
				let cursor = 0;
				const result = (state, through = cursor) => ({
					state,
					consumed: totalCharacters - text.length + through - before
				});
				while (true) {
					if (pending !== undefined) {
						const end = text.indexOf(pending, cursor);
						if (end < 0) {
							text = text.slice(Math.max(cursor, text.length - pending.length + 1));
							return result("pending");
						}
						cursor = end + pending.length;
						pending = undefined;
					}
					while (cursor < text.length && isXmlWhitespace(text[cursor])) cursor++;
					if (cursor === text.length) {
						text = "";
						return result("pending");
					}
					if (doctypeName) {
						const token = tokenAt(text, cursor, "plist");
						if (token === "partial" || token === "match" && cursor + 5 === text.length) {
							text = text.slice(cursor);
							return result("pending");
						}
						const delimiter = text[cursor + 5];
						return result(token === "match" && (delimiter === ">" || delimiter === "[" || delimiter !== undefined && isXmlWhitespace(delimiter)) ? "matched" : "rejected", cursor + 6);
					}
					for (const [token, terminator] of [["<!--", "-->"], ["<?", "?>"]]) {
						const match = tokenAt(text, cursor, token);
						if (match === "partial") {
							text = text.slice(cursor);
							return result("pending");
						}
						if (match === "match") {
							pending = terminator;
							cursor += token.length;
							break;
						}
					}
					if (pending !== undefined) continue;
					const doctype = tokenAt(text, cursor, "<!DOCTYPE");
					if (doctype === "partial" || doctype === "match" && cursor + 9 === text.length) {
						text = text.slice(cursor);
						return result("pending");
					}
					if (doctype === "match") {
						if (!isXmlWhitespace(text[cursor + 9])) return result("rejected");
						cursor += 10;
						doctypeName = true;
						continue;
					}
					const root = tokenAt(text, cursor, "<plist");
					if (root === "partial" || root === "match" && cursor + 6 === text.length) {
						text = text.slice(cursor);
						return result("pending");
					}
					const delimiter = text[cursor + 6];
					return result(root === "match" && (delimiter === "/" || delimiter === ">" || delimiter !== undefined && isXmlWhitespace(delimiter)) ? "matched" : "rejected", cursor + 7);
				}
			};
		};
		tokenAt = (text, offset, token) => {
			const available = text.slice(offset, offset + token.length);
			return available === token ? "match" : token.startsWith(available) ? "partial" : "none";
		};
		isXmlWhitespace = (character) => character === " " || character === "	" || character === "\r" || character === "\n";
		hasNibArchiveSignature = (bytes) => NIB_ARCHIVE_MAGIC.every((byte, index) => bytes[index] === byte);
	})))();
}

//#endregion
//#region dist/artifacts/apple/PlistScalars.js
var containsSortedOffset, UnsupportedBinaryPlistUidError, readBinaryPlistUidValue, normalizedUidWidth, binaryPlistUidNormalizationWidth, binaryPlistUidRecord, binaryPlistContainerRecord, binaryPlistCloneOffsetWidth, APPLE_EPOCH_MILLISECONDS, binaryDateRequiresExactSeconds, binaryPlistObjectEnd, scanBinaryPlistScalars, decodeBinaryPlistScalars, cloneBinaryPlistObjects;
function init_PlistScalars() {
	return (init_PlistScalars = __esmMin((() => {
		init_BinaryPlistLayout();
		init_plistNumbers();
		init_appleArchiveFormat();
		containsSortedOffset = (offsets, target) => {
			let low = 0;
			let high = offsets.length;
			while (low < high) {
				const middle = low + Math.floor((high - low) / 2);
				const value = offsets[middle];
				if (value === target) return true;
				if (value === undefined || value < target) low = middle + 1;
				else high = middle;
			}
			return false;
		};
		UnsupportedBinaryPlistUidError = class extends TypeError {
			decimalValue;
			sourceWidth;
			_tag = "UnsupportedBinaryPlistUidError";
			constructor(decimalValue, sourceWidth) {
				super(`binary plist UID value ${decimalValue} in ${sourceWidth}-byte encoding exceeds the exact supported range`);
				this.decimalValue = decimalValue;
				this.sourceWidth = sourceWidth;
				this.name = "UnsupportedBinaryPlistUidError";
			}
		};
		readBinaryPlistUidValue = (bytes, offset, width) => {
			let value = 0n;
			for (let index = 0; index < width; index += 1) value = value << 8n | BigInt(bytes[offset + 1 + index] ?? 0);
			if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new UnsupportedBinaryPlistUidError(value.toString(), width);
			return value;
		};
		normalizedUidWidth = (value) => value <= 255n ? 1 : value <= 65535n ? 2 : value <= 4294967295n ? 4 : 8;
		binaryPlistUidNormalizationWidth = (bytes, offset) => {
			const marker = bytes[offset];
			if (marker === undefined || marker >> 4 !== 8) return undefined;
			const sourceWidth = (marker & 15) + 1;
			const value = readBinaryPlistUidValue(bytes, offset, sourceWidth);
			if ([
				1,
				2,
				4,
				8
			].includes(sourceWidth)) return undefined;
			const targetWidth = normalizedUidWidth(value);
			return targetWidth === sourceWidth ? undefined : targetWidth;
		};
		binaryPlistUidRecord = (bytes, offset, targetWidth) => {
			const sourceWidth = (bytes[offset] & 15) + 1;
			let value = readBinaryPlistUidValue(bytes, offset, sourceWidth);
			const width = targetWidth ?? normalizedUidWidth(value);
			const record = Buffer.alloc(width + 1);
			record[0] = 128 | width - 1;
			for (let byte = width - 1; byte >= 0; byte -= 1) {
				record[byte + 1] = Number(value & 255n);
				value >>= 8n;
			}
			return record;
		};
		binaryPlistContainerRecord = (bytes, container, targetWidth) => {
			const record = Buffer.alloc(container.headerLength + container.references.length * targetWidth);
			bytes.copy(record, 0, container.offset, container.offset + container.headerLength);
			for (let index = 0; index < container.references.length; index += 1) {
				let value = BigInt(container.references[index] ?? 0);
				for (let byte = targetWidth - 1; byte >= 0; byte -= 1) {
					record[container.headerLength + index * targetWidth + byte] = Number(value & 255n);
					value >>= 8n;
				}
			}
			return record;
		};
		binaryPlistCloneOffsetWidth = (currentWidth, firstCloneOffset, cloneRecordLengths) => {
			const tableOffset = firstCloneOffset + cloneRecordLengths.reduce((sum, length) => sum + length, 0);
			const widths = [
				1,
				2,
				4,
				8
			];
			if (widths.includes(currentWidth) && (currentWidth === 8 || tableOffset < 2 ** (currentWidth * 8))) return currentWidth;
			return widths.find((width) => width === 8 ? tableOffset <= Number.MAX_SAFE_INTEGER : tableOffset < 2 ** (width * 8));
		};
		APPLE_EPOCH_MILLISECONDS = 9783072e5;
		binaryDateRequiresExactSeconds = (secondsSince2001) => {
			if (!Number.isFinite(secondsSince2001)) return false;
			const date = new Date(secondsSince2001 * 1e3 + APPLE_EPOCH_MILLISECONDS);
			return Number.isFinite(date.getTime()) && (date.getTime() - APPLE_EPOCH_MILLISECONDS) / 1e3 !== secondsSince2001;
		};
		binaryPlistObjectEnd = (bytes, offset, objectEnd, referenceWidth) => {
			const marker = bytes[offset];
			if (marker === undefined) return undefined;
			const type = marker >> 4;
			let length = marker & 15;
			let cursor = offset + 1;
			if (length === 15 && type !== 0 && type !== 8) {
				const extendedMarker = bytes[cursor];
				if (extendedMarker === undefined || extendedMarker >> 4 !== 1) return undefined;
				const width = 1 << (extendedMarker & 15);
				if (width > 8 || cursor + 1 + width > objectEnd) return undefined;
				cursor += 1;
				const extendedLength = readBinaryPlistUnsigned64(bytes, cursor, width);
				if (extendedLength > BigInt(Number.MAX_SAFE_INTEGER)) return undefined;
				length = Number(extendedLength);
				cursor += width;
			}
			let payloadLength;
			if (type === 0) payloadLength = 0;
			else if (type === 1 || type === 2) {
				if ((marker & 15) > 4) return undefined;
				payloadLength = 1 << (marker & 15);
			} else if (type === 3) {
				if (marker !== 51) return undefined;
				payloadLength = 8;
			} else if (type === 4 || type === 5 || type === 7) {
				payloadLength = length;
			} else if (type === 6) {
				payloadLength = length * 2;
			} else if (type === 8) {
				payloadLength = (marker & 15) + 1;
			} else if (type === 10 || type === 11 || type === 12) {
				payloadLength = length * referenceWidth;
			} else if (type === 13) {
				payloadLength = length * 2 * referenceWidth;
			} else return undefined;
			const end = cursor + payloadLength;
			return Number.isSafeInteger(end) && end <= objectEnd ? end : undefined;
		};
		scanBinaryPlistScalars = (bytes, scalarPlan) => {
			const output = createPlistNumberCollector();
			const wideIntegers = [];
			const dates = [];
			const result = (incomplete) => ({
				literals: output.result(incomplete),
				wideIntegers,
				dates
			});
			if (bytes.length < 40 || !hasBinaryPlistSignature(bytes)) return result(true);
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const sourceLayoutResult = readBinaryPlistLayout(bytes);
			if (!sourceLayoutResult.ok) return result(true);
			const sourceLayout = sourceLayoutResult.value;
			const { trailerOffset: trailer, offsetWidth, referenceWidth, objectCount: countRaw, offsetTable: tableRaw } = sourceLayout;
			if (offsetWidth < 1) return result(true);
			const safeMaximum = BigInt(Number.MAX_SAFE_INTEGER);
			if (countRaw === 0n || countRaw > safeMaximum || tableRaw > safeMaximum) return result(true);
			if (tableRaw < 8n || tableRaw >= BigInt(trailer)) return result(true);
			const offsetTable = Number(tableRaw);
			const capacity = Math.floor((trailer - offsetTable) / offsetWidth);
			if (countRaw > BigInt(capacity)) return result(true);
			const count = Number(countRaw);
			const tableEnd = offsetTable + count * offsetWidth;
			if (referenceWidth < 1) return result(true);
			const objectOffsets = [];
			let incomplete = false;
			for (let index = 0; index < count; index += 1) {
				const rawOffset = sourceLayout.objectOffset(index);
				const offset = rawOffset > safeMaximum ? undefined : Number(rawOffset);
				if (offset === undefined || offset < 8 || offset >= offsetTable && offset < tableEnd || offset >= trailer) {
					incomplete = true;
					continue;
				}
				objectOffsets.push(offset);
			}
			const sortedOffsets = [...new Set(objectOffsets)].sort((a, b) => a - b);
			const validOffsets = new Set();
			for (const offset of sortedOffsets) {
				const encodedEnd = binaryPlistObjectEnd(bytes, offset, trailer, referenceWidth);
				if (encodedEnd === undefined) {
					incomplete = true;
					continue;
				}
				validOffsets.add(offset);
			}
			const visitedOffsets = new Set();
			for (const offset of objectOffsets) {
				if (!visitedOffsets.has(offset)) {
					const marker = bytes[offset] ?? 0;
					if (marker === 51 && offset + 9 <= offsetTable && (scalarPlan === undefined || containsSortedOffset(scalarPlan.reachableDateOffsets, offset))) {
						const payloadOffset = offset + 1;
						dates.push({
							offset,
							payloadOffset,
							secondsSince2001: view.getFloat64(payloadOffset)
						});
					}
				}
				if (!validOffsets.has(offset)) {
					incomplete = true;
					continue;
				}
				if (visitedOffsets.has(offset)) continue;
				visitedOffsets.add(offset);
				const marker = bytes[offset] ?? 0;
				const type = marker >> 4;
				if (type === 3 && marker === 51) {
					if (offset + 9 > offsetTable) incomplete = true;
					continue;
				}
				if (type !== 1 && type !== 2) continue;
				const width = 2 ** (marker & 15);
				if (offset + 1 + width > offsetTable) incomplete = true;
				if (offset + 1 + width > offsetTable) continue;
				const isReachable = scalarPlan === undefined || containsSortedOffset(scalarPlan.reachableNumericOffsets, offset);
				if (type === 1 && width === 8) {
					const value = view.getBigInt64(offset + 1);
					if (isReachable) output.integer(value);
				} else if (type === 1 && width === 16) {
					const value = BigInt.asIntN(128, view.getBigUint64(offset + 1) << 64n | view.getBigUint64(offset + 9));
					if (isReachable) {
						output.integer(value);
						if (scalarPlan === undefined || containsSortedOffset(scalarPlan.reachableWideIntegerOffsets, offset)) wideIntegers.push({
							offset,
							value
						});
					}
				} else if (type === 1 && width > 4) {
					incomplete = true;
				} else if (type === 2 && width === 4) {
					const value = view.getFloat32(offset + 1);
					if (isReachable) output.real(value);
				} else if (type === 2 && width === 8) {
					const value = view.getFloat64(offset + 1);
					if (isReachable) output.real(value);
				} else if (type === 2) {
					incomplete = true;
				}
			}
			return result(incomplete);
		};
		decodeBinaryPlistScalars = (bytes, metadata, scalarPlan) => {
			const reachableDateOffsets = new Set(scalarPlan.reachableDateOffsets);
			const overlappingDateOffsets = new Set(scalarPlan.overlappingDateOffsets);
			const reachableWideIntegerOffsets = new Set(scalarPlan.reachableWideIntegerOffsets);
			const overlappingWideIntegerOffsets = new Set(scalarPlan.overlappingWideIntegerOffsets);
			const unrepresentableDates = metadata.dates.filter(({ offset, secondsSince2001 }) => reachableDateOffsets.has(offset) && binaryDateRequiresExactSeconds(secondsSince2001));
			const reachableWideIntegers = metadata.wideIntegers.filter(({ offset }) => reachableWideIntegerOffsets.has(offset));
			const replacements = new Map();
			for (const { offset, width } of scalarPlan.uidOffsetsToNormalize) replacements.set(offset, binaryPlistUidRecord(bytes, offset, width));
			for (const { offset } of unrepresentableDates) if (overlappingDateOffsets.has(offset)) {
				const replacement = Buffer.from(bytes.subarray(offset, offset + 9));
				replacement.writeDoubleBE(Number.NaN, 1);
				replacements.set(offset, replacement);
			}
			for (const { offset, value } of reachableWideIntegers) if (overlappingWideIntegerOffsets.has(offset)) {
				const replacement = Buffer.alloc(9);
				replacement[0] = 35;
				replacement.writeDoubleBE(Number(value), 1);
				replacements.set(offset, replacement);
			}
			const sourceLayoutResult = readBinaryPlistLayout(bytes);
			if (!sourceLayoutResult.ok) throw new RangeError("binary plist trailer is truncated");
			const sourceLayout = sourceLayoutResult.value;
			const sourceReferenceSize = sourceLayout.referenceWidth;
			const normalizedReferenceSize = scalarPlan.normalizedReferenceSize ?? sourceReferenceSize;
			for (const container of scalarPlan.containersToNormalize ?? []) replacements.set(container.offset, binaryPlistContainerRecord(bytes, container, normalizedReferenceSize));
			const needsTableNormalization = (scalarPlan.normalizedOffsetSize ?? sourceLayout.offsetWidth) !== sourceLayout.offsetWidth || normalizedReferenceSize !== sourceReferenceSize;
			if (reachableWideIntegers.length === 0 && unrepresentableDates.length === 0 && replacements.size === 0 && !needsTableNormalization) return bytes;
			const compatible = replacements.size === 0 && !needsTableNormalization ? Buffer.from(bytes) : cloneBinaryPlistObjects(bytes, sourceLayout, replacements, scalarPlan.normalizedOffsetSize ?? sourceLayout.offsetWidth, normalizedReferenceSize);
			for (const { offset, value } of reachableWideIntegers) {
				if (overlappingWideIntegerOffsets.has(offset)) continue;
				compatible[offset] = 35;
				compatible.writeDoubleBE(Number(value), offset + 1);
			}
			for (const { offset, payloadOffset } of unrepresentableDates) {
				if (!overlappingDateOffsets.has(offset)) compatible.writeDoubleBE(Number.NaN, payloadOffset);
			}
			return compatible;
		};
		cloneBinaryPlistObjects = (bytes, sourceLayout, replacements, normalizedOffsetSize, normalizedReferenceSize) => {
			const trailerOffset = sourceLayout.trailerOffset;
			const offsetSize = sourceLayout.offsetWidth;
			const objectCount = Number(sourceLayout.objectCount);
			const offsets = [...sourceLayout.objectOffsets()];
			const cloneEntries = [...replacements.entries()];
			const replacementLengths = cloneEntries.map(([, record]) => record.length);
			const newOffsetSize = normalizedOffsetSize ?? binaryPlistCloneOffsetWidth(offsetSize, trailerOffset, replacementLengths);
			if (newOffsetSize === undefined) throw new RangeError("binary plist cloned scalar offset exceeds supported width");
			const cloneStart = trailerOffset;
			const cloneBytes = replacementLengths.reduce((sum, length) => sum + length, 0);
			const newTableOffset = cloneStart + cloneBytes;
			const newLength = bytes.length + cloneBytes + objectCount * newOffsetSize;
			if (!Number.isSafeInteger(newLength)) throw new RangeError("binary plist cloned scalar representation is too large");
			const compatible = Buffer.alloc(newLength);
			bytes.copy(compatible, 0, 0, trailerOffset);
			const cloneOffsetBySource = new Map();
			let cloneCursor = cloneStart;
			cloneEntries.forEach(([sourceOffset, replacement]) => {
				const cloneOffset = cloneCursor;
				cloneOffsetBySource.set(sourceOffset, BigInt(cloneOffset));
				replacement.copy(compatible, cloneOffset);
				cloneCursor += replacement.length;
			});
			const tableStart = newTableOffset;
			const tableEnd = tableStart + objectCount * newOffsetSize;
			offsets.forEach((sourceOffset, index) => {
				const sourceNumber = sourceOffset <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(sourceOffset) : undefined;
				let value = sourceNumber === undefined ? sourceOffset : cloneOffsetBySource.get(sourceNumber) ?? sourceOffset;
				for (let byte = newOffsetSize - 1; byte >= 0; byte -= 1) {
					compatible[tableStart + index * newOffsetSize + byte] = Number(value & 255n);
					value >>= 8n;
				}
			});
			const trailer = Buffer.from(bytes.subarray(trailerOffset));
			trailer[6] = newOffsetSize;
			if (normalizedReferenceSize !== undefined) trailer[7] = normalizedReferenceSize;
			trailer.writeBigUInt64BE(BigInt(newTableOffset), 24);
			trailer.copy(compatible, tableEnd);
			return compatible;
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/PropertyListDecodeBudget.js
/**
* Consume each XML span once; malformed tokens cannot restart suffix scans.
* Each token reports the DOM node it creates (none for an end tag), whether
* character data, which becomes a text node, precedes it, and the references
* the parser expands in that text and in the tag's attribute values. Opaque
* comment, CDATA, PI and declaration content holds no references.
*/
function* xmlPreflightTokens(xml) {
	const textReferences = (from, to) => {
		let count = 0;
		for (let index = from; index < to; index += 1) if (xml.charCodeAt(index) === 38) count += 1;
		return count;
	};
	let cursor = 0;
	while (cursor < xml.length) {
		const start = xml.indexOf("<", cursor);
		if (start < 0) {
			yield {
				kind: "none",
				text: true,
				attributes: 0,
				references: textReferences(cursor, xml.length),
				internalSubset: false
			};
			return;
		}
		const text = start > cursor;
		const references = textReferences(cursor, start);
		const opaqueEnd = xml.startsWith("<!--", start) ? "-->" : xml.startsWith("<![CDATA[", start) ? "]]>" : xml.startsWith("<?", start) ? "?>" : undefined;
		if (opaqueEnd !== undefined) {
			const end = xml.indexOf(opaqueEnd, start + 2);
			if (end < 0) return;
			cursor = end + opaqueEnd.length;
			yield {
				kind: "node",
				text,
				attributes: 0,
				references,
				internalSubset: false
			};
			continue;
		}
		const doctype = /^<!DOCTYPE\b/iu.test(xml.slice(start, start + 10));
		const declaration = xml[start + 1] === "!";
		const endTag = xml[start + 1] === "/";
		const element = !declaration && !endTag;
		let quote;
		let internalSubset = false;
		let attributes = 0;
		let attributeReferences = 0;
		let end = start + 1;
		for (; end < xml.length; end += 1) {
			const character = xml[end];
			if (quote !== undefined) {
				if (character === quote) quote = undefined;
				else if (element && character === "&") attributeReferences += 1;
			} else if (character === "\"" || character === "'") quote = character;
			else if (character === ">") break;
			else if (character === "=") attributes += 1;
			else if (doctype && character === "[") internalSubset = true;
		}
		if (end === xml.length) return;
		cursor = end + 1;
		yield {
			kind: element ? "element" : declaration ? "node" : "none",
			text,
			attributes,
			references: references + attributeReferences,
			internalSubset
		};
	}
}
var preflightPropertyListDecode, XML_ELEMENT_BYTES, XML_NUMBER_PROJECTION_ELEMENT_BYTES, XML_NODE_BYTES, XML_REFERENCE_BYTES, estimateXmlPlistExpansion, MAX_BINARY_PLIST_NESTING_DEPTH, PropertyListDecodeBudgetFailure, propertyListDecodeBudgetFailure, findOverlappingScalarOffsets, estimateBinaryPlistExpansion;
function init_PropertyListDecodeBudget() {
	return (init_PropertyListDecodeBudget = __esmMin((() => {
		init_BinaryPlistLayout();
		init_propertyListXmlText();
		init_appleArchiveFormat();
		init_PlistScalars();
		preflightPropertyListDecode = (bytes, maxBytes, xmlText, options = {}) => {
			const { numberProjection = false, uidProjection = false, budget = "the property list decode budget", fail = propertyListDecodeBudgetFailure } = options;
			const expansion = hasBinaryPlistSignature(bytes) ? estimateBinaryPlistExpansion(bytes, maxBytes, {
				numberProjection,
				uidProjection,
				budget,
				fail
			}) : {
				estimatedBytes: estimateXmlPlistExpansion(bytes, maxBytes, xmlText, numberProjection, budget, fail),
				datePrecisionOverlapCount: 0,
				reachableDateOffsets: [],
				overlappingDateOffsets: [],
				reachableWideIntegerOffsets: [],
				overlappingWideIntegerOffsets: [],
				reachableNumericOffsets: [],
				uidOffsetsToNormalize: [],
				containersToNormalize: [],
				normalizedOffsetSize: 1,
				normalizedReferenceSize: 1
			};
			if (expansion.estimatedBytes > maxBytes) throw fail("expansion", `plist representation exceeds ${budget}`);
			return expansion;
		};
		XML_ELEMENT_BYTES = 1280;
		XML_NUMBER_PROJECTION_ELEMENT_BYTES = 256;
		XML_NODE_BYTES = 384;
		XML_REFERENCE_BYTES = 64;
		estimateXmlPlistExpansion = (bytes, maxBytes, xmlText, numberProjection = false, budget = "the property list decode budget", fail = propertyListDecodeBudgetFailure) => {
			const xml = xmlText ?? decodeXmlPlistText(bytes);
			let estimate = xml.length * 4;
			const elementBytes = XML_ELEMENT_BYTES + (numberProjection ? XML_NUMBER_PROJECTION_ELEMENT_BYTES : 0);
			for (const token of xmlPreflightTokens(xml)) {
				if (token.internalSubset) throw fail("expansion", `XML plist internal entity expansion exceeds ${budget}`);
				if (token.text) estimate += XML_NODE_BYTES;
				estimate += token.references * XML_REFERENCE_BYTES;
				if (token.kind === "element") estimate += elementBytes + token.attributes * XML_NODE_BYTES;
				else if (token.kind === "node") estimate += XML_NODE_BYTES;
				if (estimate > maxBytes) return maxBytes + 1;
			}
			return estimate;
		};
		MAX_BINARY_PLIST_NESTING_DEPTH = 128;
		PropertyListDecodeBudgetFailure = class extends Error {
			kind;
			constructor(kind, message) {
				super(message);
				this.kind = kind;
				this.name = "PropertyListDecodeBudgetFailure";
			}
		};
		propertyListDecodeBudgetFailure = (kind, message) => new PropertyListDecodeBudgetFailure(kind, message);
		findOverlappingScalarOffsets = (spans, scalarOffsets) => {
			let maxPriorEnd = -1;
			const overlappingOffsets = new Set();
			const activeScalars = new Map();
			for (const span of spans) {
				for (const [offset, end] of activeScalars) if (end <= span.offset) activeScalars.delete(offset);
				if (scalarOffsets.has(span.offset)) {
					if (maxPriorEnd > span.offset) {
						overlappingOffsets.add(span.offset);
						for (const activeOffset of activeScalars.keys()) overlappingOffsets.add(activeOffset);
						activeScalars.clear();
					} else activeScalars.set(span.offset, span.end);
				} else {
					for (const activeOffset of activeScalars.keys()) overlappingOffsets.add(activeOffset);
					activeScalars.clear();
				}
				maxPriorEnd = Math.max(maxPriorEnd, span.end);
			}
			return overlappingOffsets;
		};
		estimateBinaryPlistExpansion = (bytes, maxBytes, { budget = "the property list decode budget", fail = propertyListDecodeBudgetFailure, bounds = "strict", numberProjection = false, uidProjection = false, maximumDepth = 128 } = {}) => {
			if (bytes.length < 40) throw new TypeError("binary plist trailer is truncated");
			const sourceLayoutResult = readBinaryPlistLayout(bytes);
			if (!sourceLayoutResult.ok) throw new TypeError("binary plist trailer is truncated");
			const sourceLayout = sourceLayoutResult.value;
			const { trailerOffset: trailer, offsetWidth: offsetSize, referenceWidth: referenceSize } = sourceLayout;
			if (offsetSize < 1 || referenceSize < 1) throw new TypeError("binary plist trailer integer sizes are invalid");
			const safeDeclaration = (value) => value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : -1;
			const readInteger = (offset, size) => {
				if (offset < 0 || size < 1 || offset + size > bytes.length) return -1;
				return safeDeclaration(readBinaryPlistUnsigned64(bytes, offset, size));
			};
			const objectCount = safeDeclaration(sourceLayout.objectCount);
			const topObject = safeDeclaration(sourceLayout.topObject);
			const offsetTable = safeDeclaration(sourceLayout.offsetTable);
			const tableEnd = bounds === "strict" ? trailer : bytes.length;
			const objectsEnd = bounds === "strict" ? offsetTable : bytes.length;
			if (objectCount < 1 || topObject < 0 || topObject >= objectCount || offsetTable < 8 || !Number.isSafeInteger(objectCount * offsetSize) || !Number.isSafeInteger(offsetTable + objectCount * offsetSize) || offsetTable + objectCount * offsetSize > tableEnd) throw new TypeError("binary plist trailer or object table is invalid");
			if (offsetSize < 8 && offsetTable >= 2 ** (offsetSize * 8) || referenceSize < 8 && objectCount >= 2 ** (referenceSize * 8)) throw new TypeError("binary plist table width cannot address its contents");
			const normalizedReferenceSize = [
				1,
				2,
				4,
				8
			].includes(referenceSize) && (referenceSize === 8 || objectCount < 2 ** (referenceSize * 8)) ? referenceSize : [
				1,
				2,
				4,
				8
			].find((width) => width === 8 || objectCount < 2 ** (width * 8));
			if (normalizedReferenceSize === undefined) throw new TypeError("binary plist object reference count is invalid");
			const objectBytes = numberProjection || uidProjection ? 512 : 256;
			const expandedNodeBytes = numberProjection || uidProjection ? 224 : 96;
			let estimate = bytes.length * (numberProjection ? 4 : 3) + objectCount * objectBytes;
			if (estimate > maxBytes) throw fail("expansion", `binary plist object table exceeds ${budget}`);
			const active = new Set();
			const pending = [{
				object: topObject,
				depth: 0,
				exit: false,
				dictionaryKey: false
			}];
			const scalarObjects = new Map();
			const sourceContainers = new Map();
			const dictionaryKeys = new Map();
			const readDictionaryKey = (object) => {
				const prior = dictionaryKeys.get(object);
				if (prior !== undefined) return prior;
				const offset = safeDeclaration(sourceLayout.objectOffset(object));
				if (offset < 8 || offset >= objectsEnd) throw new TypeError("binary plist object offset is invalid");
				const marker = bytes[offset] ?? 0;
				const type = marker >> 4;
				if (type !== 5 && type !== 6) throw new TypeError("binary plist dictionary key is not a string");
				let size = marker & 15;
				let cursor = offset + 1;
				if (size === 15) {
					const extended = bytes[cursor] ?? 0;
					if (extended >> 4 !== 1 || (extended & 15) > 3) throw new TypeError("binary plist extended object size is invalid");
					const width = 1 << (extended & 15);
					size = readInteger(cursor + 1, width);
					cursor += 1 + width;
				}
				if (size < 0 || cursor + size * (type === 6 ? 2 : 1) > objectsEnd) throw new TypeError("binary plist scalar object is truncated");
				let key = "";
				for (let index = 0; index < size; index += 1) key += String.fromCharCode(type === 5 ? bytes[cursor + index] : bytes.readUInt16BE(cursor + index * 2));
				dictionaryKeys.set(object, key);
				return key;
			};
			let pendingObjectCount = 1;
			const reachableObjectOffsets = new Set();
			const reachableDateOffsets = new Set();
			const reachableWideIntegerOffsets = new Set();
			const reachableNumericOffsets = new Set();
			const uidWidthsToNormalize = new Map();
			const containersToNormalize = new Map();
			const reachableDateOccurrences = [];
			while (pending.length > 0) {
				const entry = pending.pop();
				if (entry === undefined) break;
				if (entry.exit) {
					active.delete(entry.object);
					continue;
				}
				pendingObjectCount -= 1;
				if (entry.depth > maximumDepth) throw fail("depth", `binary plist nesting exceeds ${budget}`);
				if (active.has(entry.object)) throw fail("cycle", `binary plist reference cycle exceeds ${budget}`);
				estimate += expandedNodeBytes;
				if (estimate > maxBytes) throw fail("expansion", `binary plist reference expansion exceeds ${budget}`);
				const offset = safeDeclaration(sourceLayout.objectOffset(entry.object));
				if (offset < 8 || offset >= objectsEnd) throw new TypeError("binary plist object offset is invalid");
				if (numberProjection) reachableObjectOffsets.add(offset);
				const marker = bytes[offset] ?? 0;
				const type = marker >> 4;
				if (type !== 10 && type !== 13) scalarObjects.set(entry.object, {
					object: entry.object,
					uid: type === 8
				});
				if (entry.dictionaryKey && type !== 5 && type !== 6) throw new TypeError("binary plist dictionary key is not a string");
				if (type === 3) {
					if (marker !== 51) throw new TypeError(`binary plist date marker 0x${marker.toString(16)} is invalid`);
					if (offset + 9 > offsetTable) throw new TypeError("binary plist date object is truncated");
					if (numberProjection) {
						reachableDateOffsets.add(offset);
						reachableDateOccurrences.push(offset);
					}
					continue;
				}
				if (type === 8) {
					const uidWidth = (marker & 15) + 1;
					if (offset + 1 + uidWidth > objectsEnd) throw new TypeError("binary plist UID object is truncated");
					const normalizedWidth = binaryPlistUidNormalizationWidth(bytes, offset);
					if (normalizedWidth !== undefined) uidWidthsToNormalize.set(offset, normalizedWidth);
					continue;
				}
				if (type === 1 || type === 2) {
					const info = marker & 15;
					if (type === 1 && info > 4) throw new TypeError("binary plist integer width is invalid");
					if (type === 2 && info !== 2 && info !== 3) throw new TypeError("binary plist real width is invalid");
					const width = 1 << info;
					if (offset + 1 + width > offsetTable) throw new TypeError("binary plist numeric scalar is truncated");
					if (numberProjection) {
						reachableNumericOffsets.add(offset);
						if (type === 1 && width === 16) reachableWideIntegerOffsets.add(offset);
					}
					continue;
				}
				let size = marker & 15;
				let cursor = offset + 1;
				if (size === 15 && type !== 0 && type !== 8) {
					const extMarker = bytes[cursor] ?? 0;
					if (extMarker >> 4 !== 1 || (extMarker & 15) > 3) throw new TypeError("binary plist extended object size is invalid");
					cursor += 1;
					const integerSize = 1 << (extMarker & 15);
					size = readInteger(cursor, integerSize);
					cursor += integerSize;
					if (size < 0 || cursor > objectsEnd) throw new TypeError("binary plist extended object size is invalid");
				}
				if (type === 4 || type === 5 || type === 6) {
					const byteLength = type === 6 ? size * 2 : size;
					if (cursor + byteLength > objectsEnd) throw new TypeError("binary plist scalar object is truncated");
					estimate += type === 4 ? size + 4 * Math.ceil(size / 3) : byteLength * 2;
					if (estimate > maxBytes) throw fail("expansion", `binary plist scalar expansion exceeds ${budget}`);
					continue;
				}
				if (type !== 10 && type !== 13) continue;
				const childCount = type === 13 ? size * 2 : size;
				const refsEnd = cursor + childCount * referenceSize;
				if (!Number.isSafeInteger(refsEnd) || refsEnd > objectsEnd) throw new TypeError("binary plist reference table is truncated");
				const availableNodes = Math.floor((maxBytes - estimate) / expandedNodeBytes);
				if (childCount > availableNodes - pendingObjectCount) throw fail("expansion", `binary plist reference expansion exceeds ${budget}`);
				const references = Array.from({ length: childCount }, (_, index) => {
					const reference = readInteger(cursor + index * referenceSize, referenceSize);
					if (reference < 0 || reference >= objectCount) throw new TypeError("binary plist reference is invalid");
					return reference;
				});
				if (!sourceContainers.has(entry.object)) sourceContainers.set(entry.object, {
					object: entry.object,
					kind: type === 13 ? "dictionary" : "array",
					references: type === 13 ? references.slice(size) : references,
					...type === 13 ? { keys: references.slice(0, size).map(readDictionaryKey) } : {}
				});
				active.add(entry.object);
				pending.push({
					object: entry.object,
					depth: entry.depth,
					exit: true,
					dictionaryKey: false
				});
				for (let index = childCount - 1; index >= 0; index -= 1) {
					const reference = references[index];
					pending.push({
						object: reference,
						depth: entry.depth + 1,
						exit: false,
						dictionaryKey: type === 13 && index < size
					});
				}
				if (referenceSize !== normalizedReferenceSize && !containersToNormalize.has(offset)) containersToNormalize.set(offset, {
					offset,
					headerLength: cursor - offset,
					references
				});
				pendingObjectCount += childCount;
			}
			const uidOffsetsToNormalize = [...uidWidthsToNormalize].map(([offset, width]) => ({
				offset,
				width
			})).sort((left, right) => left.offset - right.offset);
			const normalizedContainers = [...containersToNormalize.values()].sort((left, right) => left.offset - right.offset);
			const containerCloneLengths = normalizedContainers.map(({ headerLength, references }) => {
				const cloneLength = headerLength + references.length * normalizedReferenceSize;
				if (!Number.isSafeInteger(cloneLength)) throw new TypeError("binary plist reference table is too large");
				return cloneLength;
			});
			const normalizeOffsetWidth = (cloneLengths) => {
				if (cloneLengths.length === 0 && [
					1,
					2,
					4,
					8
				].includes(offsetSize)) return offsetSize;
				const width = binaryPlistCloneOffsetWidth(offsetSize, trailer, cloneLengths);
				if (width === undefined) throw new TypeError("binary plist object offset exceeds supported width");
				return width;
			};
			if (!numberProjection) {
				const cloneLengths = [...uidOffsetsToNormalize.map(({ width }) => width + 1), ...containerCloneLengths];
				const normalizedOffsetSize = normalizeOffsetWidth(cloneLengths);
				if (cloneLengths.length > 0 || normalizedOffsetSize !== offsetSize || normalizedReferenceSize !== referenceSize) {
					const cloneBytes = cloneLengths.reduce((sum, length) => sum + length, 0);
					estimate += 2 * (cloneBytes + objectCount * normalizedOffsetSize);
					if (estimate > maxBytes) throw fail("expansion", `binary plist UID-copy expansion exceeds ${budget}`);
				}
				return {
					estimatedBytes: estimate,
					binaryValuePlan: {
						topObject,
						scalars: [...scalarObjects.values()],
						containers: [...sourceContainers.values()],
						uidIdentity: uidProjection
					},
					datePrecisionOverlapCount: 0,
					reachableDateOffsets: [],
					overlappingDateOffsets: [],
					reachableWideIntegerOffsets: [],
					overlappingWideIntegerOffsets: [],
					reachableNumericOffsets: [],
					uidOffsetsToNormalize,
					containersToNormalize: normalizedContainers,
					normalizedOffsetSize,
					normalizedReferenceSize
				};
			}
			const reachableSpans = [...reachableObjectOffsets].map((offset) => ({
				offset,
				end: binaryPlistObjectEnd(bytes, offset, objectsEnd, referenceSize)
			})).filter((span) => span.end !== undefined).sort((left, right) => left.offset - right.offset);
			const overlappingDateOffsets = findOverlappingScalarOffsets(reachableSpans, reachableDateOffsets);
			const overlappingWideIntegerOffsets = findOverlappingScalarOffsets(reachableSpans, reachableWideIntegerOffsets);
			const precisionUnknownDateOffsets = [...overlappingDateOffsets].filter((offset) => {
				const seconds = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getFloat64(offset + 1);
				return binaryDateRequiresExactSeconds(seconds);
			}).sort((left, right) => left - right);
			const cloneOffsets = new Set([...precisionUnknownDateOffsets, ...overlappingWideIntegerOffsets]);
			const cloneLengths = [
				...uidOffsetsToNormalize.map(({ width }) => width + 1),
				...containerCloneLengths,
				...Array.from(cloneOffsets, () => 9)
			];
			const normalizedOffsetSize = normalizeOffsetWidth(cloneLengths);
			if (cloneLengths.length > 0 || normalizedOffsetSize !== offsetSize || normalizedReferenceSize !== referenceSize) {
				const cloneBytes = cloneLengths.reduce((sum, length) => sum + length, 0);
				estimate += 2 * (cloneBytes + objectCount * normalizedOffsetSize);
				if (estimate > maxBytes) throw fail("expansion", `binary plist scalar-copy expansion exceeds ${budget}`);
			}
			const precisionUnknownOffsets = new Set(precisionUnknownDateOffsets);
			const datePrecisionOverlapCount = reachableDateOccurrences.filter((offset) => precisionUnknownOffsets.has(offset)).length;
			return {
				estimatedBytes: estimate,
				binaryValuePlan: {
					topObject,
					scalars: [...scalarObjects.values()],
					containers: [...sourceContainers.values()],
					uidIdentity: uidProjection
				},
				datePrecisionOverlapCount,
				reachableDateOffsets: [...reachableDateOffsets].sort((left, right) => left - right),
				overlappingDateOffsets: precisionUnknownDateOffsets,
				reachableWideIntegerOffsets: [...reachableWideIntegerOffsets].sort((left, right) => left - right),
				overlappingWideIntegerOffsets: [...overlappingWideIntegerOffsets].sort((left, right) => left - right),
				reachableNumericOffsets: [...reachableNumericOffsets].sort((left, right) => left - right),
				uidOffsetsToNormalize,
				containersToNormalize: normalizedContainers,
				normalizedOffsetSize,
				normalizedReferenceSize
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/BinaryPlistMaterializer.js
var scalarArrayInput, scalarOccurrence, decodeBinaryPlistValue;
function init_BinaryPlistMaterializer() {
	return (init_BinaryPlistMaterializer = __esmMin((() => {
		init_BinaryPlistLayout();
		init_plistUid();
		init_PlistScalars();
		scalarArrayInput = (bytes, objects) => {
			const compatibleLayoutResult = readBinaryPlistLayout(bytes);
			if (!compatibleLayoutResult.ok) throw new RangeError("binary plist trailer is truncated");
			const compatibleLayout = compatibleLayoutResult.value;
			const referenceWidth = compatibleLayout.referenceWidth;
			const objectCount = Number(compatibleLayout.objectCount);
			const rootOffset = bytes.length;
			const rootLength = 10 + objects.length * referenceWidth;
			const tableOffset = rootOffset + rootLength;
			const output = Buffer.alloc(tableOffset + (objectCount + 1) * 8 + 32);
			bytes.copy(output);
			output[rootOffset] = 175;
			output[rootOffset + 1] = 19;
			output.writeBigUInt64BE(BigInt(objects.length), rootOffset + 2);
			for (const [index, object] of objects.entries()) {
				let reference = BigInt(object);
				const offset = rootOffset + 10 + index * referenceWidth;
				for (let byte = referenceWidth - 1; byte >= 0; byte -= 1) {
					output[offset + byte] = Number(reference & 255n);
					reference >>= 8n;
				}
			}
			let object = 0;
			for (const offset of compatibleLayout.objectOffsets()) {
				output.writeBigUInt64BE(offset, tableOffset + object * 8);
				object += 1;
			}
			output.writeBigUInt64BE(BigInt(rootOffset), tableOffset + objectCount * 8);
			const nextTrailer = output.length - 32;
			output[nextTrailer + 6] = 8;
			output[nextTrailer + 7] = referenceWidth;
			output.writeBigUInt64BE(BigInt(objectCount + 1), nextTrailer + 8);
			output.writeBigUInt64BE(BigInt(objectCount), nextTrailer + 16);
			output.writeBigUInt64BE(BigInt(tableOffset), nextTrailer + 24);
			return output;
		};
		scalarOccurrence = (value, uid, identity) => {
			if (value instanceof Date) return new Date(value.getTime());
			if (value instanceof Uint8Array) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
			if (uid && value !== null && typeof value === "object") {
				const copy = { ...value };
				if (identity) markPlistDictionary(copy, value.UID);
				return copy;
			}
			return value;
		};
		decodeBinaryPlistValue = (bytes, plan, metadata = scanBinaryPlistScalars(bytes, plan)) => {
			const source = plan.binaryValuePlan;
			if (source === undefined) throw new TypeError("Binary plist source plan is missing");
			const compatible = decodeBinaryPlistScalars(bytes, metadata, plan);
			const scalars = parseBinary(scalarArrayInput(compatible, source.scalars.map(({ object }) => object)));
			const scalarIndex = new Map(source.scalars.map((scalar, index) => [scalar.object, index]));
			const containers = new Map(source.containers.map((container) => [container.object, container]));
			const root = {};
			const pending = [{
				object: source.topObject,
				parent: root,
				key: "value"
			}];
			while (pending.length > 0) {
				const entry = pending.pop();
				const container = containers.get(entry.object);
				let value;
				if (container === undefined) {
					const index = scalarIndex.get(entry.object);
					if (index === undefined) throw new TypeError("Binary plist scalar source is missing");
					value = scalarOccurrence(scalars[index], source.scalars[index].uid, source.uidIdentity);
				} else {
					value = container.kind === "array" ? [] : {};
					if (container.kind === "dictionary" && source.uidIdentity) markPlistDictionary(value);
					for (let index = container.references.length - 1; index >= 0; index -= 1) pending.push({
						object: container.references[index],
						parent: value,
						key: container.keys?.[index] ?? index
					});
				}
				Object.defineProperty(entry.parent, entry.key, {
					value,
					enumerable: true,
					configurable: true,
					writable: true
				});
			}
			return root.value;
		};
	})))();
}

//#endregion
//#region dist/domain/xmlDocument.js
var XML_LINE_ENDING, XmlDocumentParseError, parseXmlDocument;
function init_xmlDocument() {
	return (init_xmlDocument = __esmMin((() => {
		init_result();
		XML_LINE_ENDING = /\r\n?|\n/gu;
		XmlDocumentParseError = class extends Error {
			reason;
			_tag = "XmlDocumentParseError";
			constructor(reason, cause) {
				super(reason === "doctype" ? "XML document types are unsupported" : `XML is not well-formed${cause instanceof Error ? `: ${cause.message}` : ""}`, { cause });
				this.reason = reason;
			}
		};
		parseXmlDocument = (source, policy) => {
			try {
				const syntax = new SaxesParser({
					xmlns: true,
					defaultXMLVersion: "1.0",
					forceXMLVersion: true
				});
				syntax.on("doctype", () => {
					if (policy.doctype === "reject") throw new XmlDocumentParseError("doctype");
				});
				syntax.write(source).close();
				return ok(new DOMParser({
					normalizeLineEndings: policy.lineEndings === "preserve" ? (text) => text : (text) => text.replace(XML_LINE_ENDING, "\n"),
					onError: onErrorStopParsing
				}).parseFromString(source, "application/xml"));
			} catch (cause) {
				return err(cause instanceof XmlDocumentParseError ? cause : new XmlDocumentParseError("malformed", cause));
			}
		};
	})))();
}

//#endregion
//#region dist/domain/propertyListXmlData.js
var XmlPlistDataError, BASE64_DIGITS, C_WHITESPACE, visitDataQuartets, decodeXmlPlistData;
function init_propertyListXmlData() {
	return (init_propertyListXmlData = __esmMin((() => {
		init_result();
		XmlPlistDataError = class extends TypeError {
			reason;
			characterOffset;
			_tag = "XmlPlistDataError";
			constructor(reason, characterOffset = null) {
				super(`Cannot decode XML plist <data>: ${reason}`);
				this.reason = reason;
				this.characterOffset = characterOffset;
				this.name = "XmlPlistDataError";
			}
		};
		BASE64_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		C_WHITESPACE = new Set([
			" ",
			"	",
			"\n",
			"\v",
			"\f",
			"\r"
		]);
		visitDataQuartets = (text, visit) => {
			let quartet = 0;
			let digits = 0;
			let padding = 0;
			for (let index = 0; index < text.length; index += 1) {
				if (text.charCodeAt(index) >= 128) return err(new XmlPlistDataError("non-ascii", index));
				const character = text[index];
				if (character === "=") padding += 1;
				else if (!C_WHITESPACE.has(character)) padding = 0;
				const digit = character === "=" ? 0 : BASE64_DIGITS.indexOf(character);
				if (digit < 0) continue;
				quartet = (quartet << 6 | digit) & 16777215;
				digits += 1;
				if (digits % 4 === 0) visit(quartet, padding >= 2 ? 1 : padding === 1 ? 2 : 3);
			}
			return ok(undefined);
		};
		decodeXmlPlistData = (text) => {
			let length = 0;
			const counted = visitDataQuartets(text, (_value, byteCount) => {
				length += byteCount;
			});
			if (!counted.ok) return counted;
			const bytes = new Uint8Array(length);
			let offset = 0;
			const decoded = visitDataQuartets(text, (value, byteCount) => {
				bytes[offset++] = value >> 16;
				if (byteCount >= 2) bytes[offset++] = value >> 8;
				if (byteCount === 3) bytes[offset++] = value;
			});
			return decoded.ok ? ok(bytes) : decoded;
		};
	})))();
}

//#endregion
//#region dist/domain/propertyListXmlSource.js
var XmlPlistSourceError, readXmlPlistSource, openingTagEnd, closingTagStart, PLIST_LEXICAL_SCALARS, PLIST_CONTAINER_ELEMENTS, collectXmlPlistScalarSpans;
function init_propertyListXmlSource() {
	return (init_propertyListXmlSource = __esmMin((() => {
		init_plistValue();
		init_result();
		init_xmlDocument();
		init_propertyListXmlData();
		XmlPlistSourceError = class extends TypeError {
			_tag = "XmlPlistSourceError";
			constructor() {
				super("Cannot locate XML plist scalar in its original source");
			}
		};
		readXmlPlistSource = (text, maximumDepth = 128) => {
			const normalized = text.replace(XML_LINE_ENDING, "\n");
			const parsed = parseXmlDocument(normalized, {
				doctype: "allow",
				lineEndings: "preserve"
			});
			if (!parsed.ok) throw parsed.error;
			const document = parsed.value;
			const lineEndings = new RegExp(XML_LINE_ENDING);
			let line = 1;
			let lineStart = 0;
			const readSpan = (node) => {
				if (node.lineNumber === undefined || node.columnNumber === undefined) return err("source-location");
				while (line < node.lineNumber) {
					const ending = lineEndings.exec(text);
					if (ending === null) return err("source-location");
					lineStart = ending.index + ending[0].length;
					line += 1;
				}
				if (line !== node.lineNumber) return err("source-location");
				const start = lineStart + node.columnNumber - 1;
				const openingEnd = openingTagEnd(text, start);
				if (openingEnd < 0 || text[start] !== "<") return err("source-location");
				const selfClosing = text[openingEnd - 1] === "/";
				const end = selfClosing ? openingEnd + 1 : closingTagStart(text, openingEnd + 1);
				return end < 0 ? err("source-location") : ok({
					start: openingEnd + 1,
					end,
					selfClosing
				});
			};
			const spans = collectXmlPlistScalarSpans(document, readSpan, maximumDepth);
			return {
				document,
				scalarLiteral(node) {
					const span = spans.get(node);
					return span?.ok === true ? ok(text.slice(span.value.start, span.value.end)) : err(new XmlPlistSourceError());
				},
				dataValue(node) {
					const span = spans.get(node);
					if (node.nodeName !== "data" || span === undefined) return err(new XmlPlistDataError("source-location"));
					if (!span.ok) return err(new XmlPlistDataError(span.error));
					for (let child = node.firstChild; child !== null; child = child.nextSibling) if (child.nodeType !== child.TEXT_NODE) return err(new XmlPlistDataError("markup"));
					if (span.value.selfClosing) return err(new XmlPlistDataError("empty-element"));
					return decodeXmlPlistData(text.slice(span.value.start, span.value.end));
				}
			};
		};
		openingTagEnd = (source, start) => {
			let quote;
			for (let cursor = start; cursor < source.length; cursor += 1) {
				const character = source[cursor];
				if (quote !== undefined) {
					if (character === quote) quote = undefined;
				} else if (character === "\"" || character === "'") quote = character;
				else if (character === ">") return cursor;
			}
			return -1;
		};
		closingTagStart = (source, contentStart) => {
			let depth = 1;
			let cursor = contentStart;
			while (cursor < source.length) {
				const start = source.indexOf("<", cursor);
				if (start < 0) return -1;
				const delimiter = source.startsWith("<!--", start) ? "-->" : source.startsWith("<![CDATA[", start) ? "]]>" : source.startsWith("<?", start) ? "?>" : undefined;
				if (delimiter !== undefined) {
					const end = source.indexOf(delimiter, start + 2);
					if (end < 0) return -1;
					cursor = end + delimiter.length;
					continue;
				}
				const end = openingTagEnd(source, start);
				if (end < 0) return -1;
				if (source[start + 1] === "/") {
					depth -= 1;
					if (depth === 0) return start;
				} else if (source[end - 1] !== "/") depth += 1;
				cursor = end + 1;
			}
			return -1;
		};
		PLIST_LEXICAL_SCALARS = new Set([
			"data",
			"integer",
			"real",
			"date",
			"true",
			"false"
		]);
		PLIST_CONTAINER_ELEMENTS = new Set([
			"plist",
			"dict",
			"array"
		]);
		collectXmlPlistScalarSpans = (document, readSpan, maximumDepth) => {
			const spans = new WeakMap();
			const root = document.documentElement;
			if (root === null) return spans;
			const pending = [{
				node: root,
				depth: -1
			}];
			while (pending.length > 0) {
				const entry = pending.pop();
				if (entry === undefined) break;
				const { node, depth } = entry;
				if (node.nextSibling !== null) pending.push({
					node: node.nextSibling,
					depth
				});
				if (node.nodeType !== node.ELEMENT_NODE) continue;
				if (node.nodeName !== "key" && depth > maximumDepth) throw new PlistNestingLimitError(maximumDepth);
				if (PLIST_LEXICAL_SCALARS.has(node.nodeName)) spans.set(node, readSpan(node));
				if (PLIST_CONTAINER_ELEMENTS.has(node.nodeName) && node.firstChild !== null) pending.push({
					node: node.firstChild,
					depth: depth + 1
				});
			}
			return spans;
		};
	})))();
}

//#endregion
//#region dist/domain/propertyListXmlScalar.js
var INTEGER_WHITESPACE, REAL_WHITESPACE, INTEGER_LITERAL, REAL_LEADING_WHITESPACE, parseXmlPlistIntegerLiteral, decodeXmlPlistDateLiteral, parseXmlPlistRealLiteral;
function init_propertyListXmlScalar() {
	return (init_propertyListXmlScalar = __esmMin((() => {
		init_result();
		INTEGER_WHITESPACE = "[\\u0000-\\u0020\\u007f\\u2000-\\u200b\\u205f\\u3000]*";
		REAL_WHITESPACE = "[\\u0000-\\u0020\\u007f-\\u00a0\\u2000-\\u200b\\u3000\\ufeff]*";
		INTEGER_LITERAL = new RegExp(`^${INTEGER_WHITESPACE}(?:([+-])${INTEGER_WHITESPACE})?(?:0[xX]([\\da-fA-F]+)|(\\d+))$`, "u");
		REAL_LEADING_WHITESPACE = new RegExp(`^${REAL_WHITESPACE}`, "u");
		parseXmlPlistIntegerLiteral = (raw) => {
			const match = INTEGER_LITERAL.exec(raw);
			if (match === null) return undefined;
			const magnitude = BigInt(match[2] === undefined ? match[3] : `0x${match[2]}`);
			return match[1] === "-" ? -magnitude : magnitude;
		};
		decodeXmlPlistDateLiteral = (raw) => {
			const match = /^(-?)(\d+)-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/u.exec(raw);
			if (match === null) return err("invalid-literal");
			const yearMagnitude = Number(match[2]);
			const year = match[1] === "-" ? -yearMagnitude : yearMagnitude;
			const month = Number(match[3]);
			const day = Number(match[4]);
			const hour = Number(match[5]);
			const minute = Number(match[6]);
			const second = Number(match[7]);
			if (!Number.isSafeInteger(year) || month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) return err("unrepresentable");
			const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
			const daysInMonth = [
				31,
				leapYear ? 29 : 28,
				31,
				30,
				31,
				30,
				31,
				31,
				30,
				31,
				30,
				31
			][month - 1];
			if (day < 1 || day > daysInMonth) return err("unrepresentable");
			const date = new Date(0);
			date.setUTCFullYear(year, month - 1, day);
			date.setUTCHours(hour, minute, second, 0);
			return Number.isNaN(date.getTime()) ? err("unrepresentable") : ok(date);
		};
		parseXmlPlistRealLiteral = (raw) => {
			const text = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>|&#(?:x([\da-fA-F]+)|(\d+));|&(amp|lt|gt|apos|quot);/gu, (_token, cdata, hex, decimal, name) => {
				if (cdata !== undefined) return cdata;
				if (hex !== undefined) return String.fromCodePoint(Number.parseInt(hex, 16));
				if (decimal !== undefined) return String.fromCodePoint(Number.parseInt(decimal, 10));
				return name === "amp" ? "&" : name === "lt" ? "<" : name === "gt" ? ">" : name === "apos" ? "'" : "\"";
			});
			if (text.length <= 9) {
				switch (text.toLowerCase()) {
					case "nan": return ok(Number.NaN);
					case "+infinity":
					case "infinity":
					case "+inf":
					case "inf": return ok(Number.POSITIVE_INFINITY);
					case "-infinity":
					case "-inf": return ok(Number.NEGATIVE_INFINITY);
				}
			}
			const numericText = text.replace(REAL_LEADING_WHITESPACE, "");
			if (!/^[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?$/u.test(numericText)) return err("invalid-literal");
			const value = Number(numericText);
			return Number.isFinite(value) ? ok(value) : err("unrepresentable");
		};
	})))();
}

//#endregion
//#region dist/domain/propertyListXml.js
var decodeXmlPropertyList;
function init_propertyListXml() {
	return (init_propertyListXml = __esmMin((() => {
		init_plistUid();
		init_propertyListXmlSource();
		init_plistNumbers();
		init_unknownPlistScalar();
		init_plistValue();
		init_propertyListXmlScalar();
		decodeXmlPropertyList = (text, maximumDepth = 128) => {
			const source = readXmlPlistSource(text, maximumDepth);
			const document = source.document;
			const root = document.documentElement;
			if (root?.nodeName !== "plist") throw new TypeError("malformed document. First element should be <plist>");
			const numbers = createPlistNumberCollector();
			const textNode = (node) => node.nodeType === node.TEXT_NODE;
			const characterNode = (node) => textNode(node) || node.nodeType === node.CDATA_SECTION_NODE;
			const content = (node, accepts) => {
				let text = "";
				for (let child = node.firstChild; child !== null; child = child.nextSibling) {
					if (accepts(child)) text += child.nodeValue ?? "";
				}
				return text;
			};
			const hasUnsupportedMarkup = (node, accepts) => {
				for (let child = node.firstChild; child !== null; child = child.nextSibling) if (!accepts(child)) return true;
				return false;
			};
			const dictionaryKey = (node) => {
				for (let child = node.firstChild; child !== null; child = child.nextSibling) if (child.nodeType === child.ELEMENT_NODE) return String(node.firstChild?.nodeValue ?? null);
				return content(node, characterNode);
			};
			const members = function* (node) {
				for (let child = node.firstChild; child !== null; child = child.nextSibling) if (child.nodeType !== child.TEXT_NODE && child.nodeType !== child.CDATA_SECTION_NODE && child.nodeType !== child.COMMENT_NODE && child.nodeType !== child.PROCESSING_INSTRUCTION_NODE) yield child;
			};
			const decode = (node) => {
				switch (node.nodeName) {
					case "plist": return Array.from(members(node), decode);
					case "array": {
						const values = [];
						for (const member of members(node)) {
							const value = decode(member);
							if (value !== null) values.push(value);
						}
						return values;
					}
					case "dict": {
						const entries = [];
						let key;
						for (const child of members(node)) {
							if (key === undefined) {
								if (child.nodeName !== "key") throw new TypeError("Missing key while parsing <dict/>");
								key = dictionaryKey(child);
							} else {
								if (child.nodeName === "key") throw new TypeError("Unexpected <key> while parsing <dict/>. Keys and values must alternate.");
								entries.push([key, decode(child)]);
								key = undefined;
							}
						}
						if (key !== undefined) throw new TypeError("Missing value for key while parsing <dict/>");
						const value = Object.fromEntries(entries);
						const keys = Object.keys(value);
						markPlistDictionary(value, keys.length === 1 && keys[0] === "CF$UID" && typeof value["CF$UID"] === "number" ? value["CF$UID"] : undefined);
						return value;
					}
					case "key": {
						const value = node.firstChild === null ? "" : node.firstChild.nodeValue;
						return value;
					}
					case "string": return content(node, characterNode);
					case "integer": {
						const raw = source.scalarLiteral(node);
						if (!raw.ok) throw raw.error;
						const unsupportedMarkup = hasUnsupportedMarkup(node, textNode);
						const exact = !unsupportedMarkup ? parseXmlPlistIntegerLiteral(raw.value) : undefined;
						if (exact === undefined) return new UnknownPlistScalar("integer", raw.value, unsupportedMarkup ? "unsupported-markup" : "invalid-literal");
						numbers.integer(exact);
						const decoded = Number(exact);
						return Number.isFinite(decoded) ? decoded : exact;
					}
					case "real": {
						const raw = source.scalarLiteral(node);
						if (!raw.ok) throw raw.error;
						if (hasUnsupportedMarkup(node, characterNode)) return new UnknownPlistScalar("real", raw.value, "unsupported-markup");
						const value = parseXmlPlistRealLiteral(raw.value);
						if (!value.ok) return new UnknownPlistScalar("real", raw.value, value.error);
						numbers.real(value.value);
						return value.value;
					}
					case "data": {
						const value = source.dataValue(node);
						if (!value.ok) throw value.error;
						return value.value;
					}
					case "date": {
						const raw = source.scalarLiteral(node);
						if (!raw.ok) throw raw.error;
						if (hasUnsupportedMarkup(node, textNode)) return new UnknownPlistScalar("date", raw.value, "unsupported-markup");
						const date = decodeXmlPlistDateLiteral(raw.value);
						return date.ok ? date.value : new UnknownPlistScalar("date", raw.value, date.error);
					}
					case "null": return null;
					case "true":
					case "false": {
						const raw = source.scalarLiteral(node);
						if (!raw.ok) throw raw.error;
						return raw.value === "" ? node.nodeName === "true" : new UnknownPlistScalar(node.nodeName, raw.value, hasUnsupportedMarkup(node, textNode) ? "unsupported-markup" : "invalid-literal");
					}
					default: throw new TypeError(`Invalid PLIST tag ${node.nodeName}`);
				}
			};
			const values = Array.from(members(root), decode);
			return {
				value: values.length === 1 ? values[0] : values,
				numberLiterals: numbers.result()
			};
		};
	})))();
}

//#endregion
//#region dist/domain/propertyListOpenStep.js
var OPEN_STEP_SYNTAX_CODES, NEXT_STEP_LATIN_TABLE, decodeOpenStepQuotedString, OpenStepPropertyListError, startsOpenStepPropertyList, skipTrivia, decodeOpenStepPropertyList;
function init_propertyListOpenStep() {
	return (init_propertyListOpenStep = __esmMin((() => {
		init_plistValue();
		init_plistUid();
		OPEN_STEP_SYNTAX_CODES = [
			"unterminated_block_comment",
			"unexpected_end",
			"unterminated_dictionary",
			"expected_equals",
			"unterminated_array",
			"expected_separator",
			"unexpected_character"
		];
		NEXT_STEP_LATIN_TABLE = [
			160,
			192,
			193,
			194,
			195,
			196,
			197,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			210,
			211,
			212,
			213,
			214,
			217,
			218,
			219,
			220,
			221,
			222,
			181,
			215,
			247,
			169,
			161,
			162,
			163,
			8260,
			165,
			402,
			167,
			164,
			8217,
			8220,
			171,
			8249,
			8250,
			64257,
			64258,
			174,
			8211,
			8224,
			8225,
			183,
			166,
			182,
			8226,
			8218,
			8222,
			8221,
			187,
			8230,
			8240,
			172,
			191,
			185,
			715,
			180,
			710,
			732,
			175,
			728,
			729,
			168,
			178,
			730,
			184,
			179,
			733,
			731,
			711,
			8212,
			177,
			188,
			189,
			190,
			224,
			225,
			226,
			227,
			228,
			229,
			231,
			232,
			233,
			234,
			235,
			236,
			198,
			237,
			170,
			238,
			239,
			240,
			241,
			321,
			216,
			338,
			186,
			242,
			243,
			244,
			245,
			246,
			230,
			249,
			250,
			251,
			305,
			252,
			253,
			322,
			248,
			339,
			223,
			254,
			255,
			65533,
			65533
		];
		decodeOpenStepQuotedString = (token) => {
			parseOpenStep(token);
			const content = token.slice(1, -1);
			let result = "";
			let i = 0;
			while (i < content.length) {
				const ch = content[i];
				if (ch !== "\\") {
					result += ch;
					i += 1;
					continue;
				}
				i += 1;
				if (i >= content.length) break;
				const esc = content[i];
				i += 1;
				switch (esc) {
					case "a":
						result += "\x07";
						break;
					case "b":
						result += "\b";
						break;
					case "f":
						result += "\f";
						break;
					case "n":
						result += "\n";
						break;
					case "r":
						result += "\r";
						break;
					case "t":
						result += "	";
						break;
					case "v":
						result += "\v";
						break;
					case "\"":
						result += "\"";
						break;
					case "\\":
						result += "\\";
						break;
					case "\n":
						result += "\n";
						break;
					case "U": {
						let num = 0;
						let digits = 0;
						while (digits < 4 && i < content.length) {
							const hexChar = content[i];
							if (/^[0-9a-fA-F]$/.test(hexChar)) {
								num = num << 4 | parseInt(hexChar, 16);
								i += 1;
								digits += 1;
							} else {
								break;
							}
						}
						if (num >= 55296 && num <= 56319) {
							if (content[i] === "\\" && content[i + 1] === "U") {
								let lowNum = 0;
								let lowDigits = 0;
								let j = i + 2;
								while (lowDigits < 4 && j < content.length) {
									const hexChar = content[j];
									if (/^[0-9a-fA-F]$/.test(hexChar)) {
										lowNum = lowNum << 4 | parseInt(hexChar, 16);
										j += 1;
										lowDigits += 1;
									} else {
										break;
									}
								}
								if (lowDigits === 4 && lowNum >= 56320 && lowNum <= 57343) {
									i = j;
									result += String.fromCharCode(num, lowNum);
									break;
								}
							}
							result += "�";
						} else if (num >= 56320 && num <= 57343) {
							result += "�";
						} else {
							result += String.fromCharCode(num);
						}
						break;
					}
					case "0":
					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7": {
						let num = esc.charCodeAt(0) - 48;
						for (let j = 0; j < 2; j += 1) {
							if (i < content.length) {
								const octChar = content[i];
								if (octChar >= "0" && octChar <= "7") {
									num = (num << 3) + (octChar.charCodeAt(0) - 48) & 255;
									i += 1;
								} else {
									break;
								}
							}
						}
						if (num < 128) {
							result += String.fromCharCode(num);
						} else {
							const codePoint = NEXT_STEP_LATIN_TABLE[num - 128];
							result += codePoint !== undefined ? String.fromCharCode(codePoint) : "�";
						}
						break;
					}
					default:
						result += esc;
						break;
				}
			}
			return result;
		};
		OpenStepPropertyListError = class extends Error {
			code;
			position;
			_tag = "OpenStepPropertyListError";
			constructor(code, position) {
				super(code);
				this.code = code;
				this.position = position;
				this.name = "OpenStepPropertyListError";
			}
		};
		startsOpenStepPropertyList = (text) => {
			const cursor = skipTrivia(text, 0, false);
			return text[cursor] === "{" || text[cursor] === "(";
		};
		skipTrivia = (text, start, strict = true) => {
			let cursor = start;
			while (cursor < text.length) {
				if (/\s/u.test(text[cursor])) cursor += 1;
				else if (text.startsWith("//", cursor)) {
					cursor += 2;
					while (cursor < text.length && !"\n\r\u2028\u2029".includes(text[cursor])) cursor += 1;
				} else if (text.startsWith("/*", cursor)) {
					const end = text.indexOf("*/", cursor + 2);
					if (end < 0) {
						if (strict) throw new OpenStepPropertyListError("unterminated_block_comment", cursor);
						return text.length;
					}
					cursor = end + 2;
				} else break;
			}
			return cursor;
		};
		decodeOpenStepPropertyList = (text, maximumDepth = 128) => {
			let cursor = 0;
			const trivia = () => {
				cursor = skipTrivia(text, cursor);
			};
			const assertDepth = (depth) => {
				if (depth > maximumDepth) throw new PlistNestingLimitError(maximumDepth);
			};
			const value = (depth, dictionaryKey = false) => {
				trivia();
				if (cursor >= text.length) throw new OpenStepPropertyListError("unexpected_end", cursor);
				const character = text[cursor];
				if (character === "{") {
					assertDepth(depth);
					cursor += 1;
					const dictionary = {};
					markPlistDictionary(dictionary);
					while (true) {
						trivia();
						if (cursor >= text.length) throw new OpenStepPropertyListError("unterminated_dictionary", cursor);
						if (text[cursor] === "}") {
							cursor += 1;
							return dictionary;
						}
						const key = value(depth + 1, true);
						trivia();
						if (text[cursor] !== "=") throw new OpenStepPropertyListError("expected_equals", cursor);
						cursor += 1;
						const entry = value(depth + 1);
						Object.defineProperty(dictionary, String(key), {
							value: entry,
							enumerable: true,
							configurable: true,
							writable: true
						});
						trivia();
						if (text[cursor] === ";") cursor += 1;
					}
				}
				if (character === "(") {
					assertDepth(depth);
					cursor += 1;
					const array = [];
					trivia();
					if (text[cursor] === ")") {
						cursor += 1;
						return array;
					}
					while (true) {
						array.push(value(depth + 1));
						trivia();
						if (cursor >= text.length) throw new OpenStepPropertyListError("unterminated_array", cursor);
						if (text[cursor] === ")") {
							cursor += 1;
							return array;
						}
						if (text[cursor] !== ",") throw new OpenStepPropertyListError("expected_separator", cursor);
						cursor += 1;
						trivia();
						if (text[cursor] === ")") {
							cursor += 1;
							return array;
						}
					}
				}
				const start = cursor;
				if (character === "\"") {
					cursor += 1;
					while (cursor < text.length) {
						const next = text[cursor];
						cursor += next === "\\" ? 2 : 1;
						if (next === "\"") break;
					}
				} else if (character === "<") {
					const end = text.indexOf(">", cursor + 1);
					cursor = end < 0 ? text.length : end + 1;
				} else {
					while (cursor < text.length && /[a-zA-Z0-9._/$:-]/u.test(text[cursor])) cursor += 1;
					if (cursor === start) throw new OpenStepPropertyListError("unexpected_character", cursor);
				}
				if (!dictionaryKey) assertDepth(depth);
				const token = text.slice(start, cursor);
				if (character === "\"") {
					return decodeOpenStepQuotedString(token);
				}
				return character === "<" ? parseOpenStep(token) : token;
			};
			return value(0);
		};
	})))();
}

//#endregion
//#region dist/domain/propertyListKeys.js
var parseXmlPropertyList;
function init_propertyListKeys() {
	return (init_propertyListKeys = __esmMin((() => {
		init_propertyListXml();
		init_propertyListOpenStep();
		init_plistNumbers();
		init_plistValue();
		parseXmlPropertyList = (text, maximumDepth = 128) => startsOpenStepPropertyList(text) ? {
			value: decodeOpenStepPropertyList(text, maximumDepth),
			numberLiterals: createPlistNumberCollector().result(true)
		} : decodeXmlPropertyList(text, maximumDepth);
	})))();
}

//#endregion
//#region dist/domain/firmware/dfuse.js
var PREFIX_BYTES, TARGET_PREFIX_BYTES, TARGET_NAME_OFFSET, TARGET_NAME_BYTES, ELEMENT_HEADER_BYTES, DFUSE_SUFFIX_BYTES, DFUSE_VERSION, DFU_SUFFIX_VERSION, ADDRESS_SPACE, NAMED_ELEMENTS, SIGNATURE, TARGET_SIGNATURE, SUFFIX_SIGNATURE, DFUSE_MAX_FILE_BYTES, DFUSE_MAX_ELEMENTS, readUint16, readUint32, startsWith, hex32, hasDfuSePrefix, hasDfuSeSuffix, isDfuSeFile, createDfuSeDecoder, dfuCrc, formatFailure, named, RetainingDfuSeDecoder, parseDfuSe, TargetWalk, latin1UntilNul, elementText, overlappingElements;
function init_dfuse() {
	return (init_dfuse = __esmMin((() => {
		init_result();
		PREFIX_BYTES = 11;
		TARGET_PREFIX_BYTES = 274;
		TARGET_NAME_OFFSET = 11;
		TARGET_NAME_BYTES = 255;
		ELEMENT_HEADER_BYTES = 8;
		DFUSE_SUFFIX_BYTES = 16;
		DFUSE_VERSION = 1;
		DFU_SUFFIX_VERSION = 282;
		ADDRESS_SPACE = 4294967296;
		NAMED_ELEMENTS = 4;
		SIGNATURE = [
			68,
			102,
			117,
			83,
			101
		];
		TARGET_SIGNATURE = [
			84,
			97,
			114,
			103,
			101,
			116
		];
		SUFFIX_SIGNATURE = [
			85,
			70,
			68
		];
		DFUSE_MAX_FILE_BYTES = 128 * 1024 * 1024;
		DFUSE_MAX_ELEMENTS = 65536;
		readUint16 = (bytes, offset) => (bytes[offset] ?? 0) | (bytes[offset + 1] ?? 0) << 8;
		readUint32 = (bytes, offset) => (readUint16(bytes, offset) | readUint16(bytes, offset + 2) << 16) >>> 0;
		startsWith = (bytes, offset, signature) => signature.every((byte, index) => bytes[offset + index] === byte);
		hex32 = (value) => `0x${value.toString(16).padStart(8, "0")}`;
		hasDfuSePrefix = (prefix) => startsWith(prefix, 0, SIGNATURE) && prefix[5] === DFUSE_VERSION;
		hasDfuSeSuffix = (suffix) => suffix.length === 16 && readUint16(suffix, 6) === DFU_SUFFIX_VERSION && startsWith(suffix, 8, SUFFIX_SIGNATURE) && suffix[11] === 16;
		isDfuSeFile = (prefix, suffix, fileBytes) => fileBytes >= PREFIX_BYTES + 16 && hasDfuSePrefix(prefix) && hasDfuSeSuffix(suffix);
		createDfuSeDecoder = (fileBytes) => Number.isSafeInteger(fileBytes) && fileBytes >= 0 && fileBytes <= 134217728 ? ok(new RetainingDfuSeDecoder(fileBytes)) : err({
			kind: "limit",
			boundary: "file-size",
			message: `file is ${String(fileBytes)} bytes, exceeding the fixed ${String(DFUSE_MAX_FILE_BYTES)}-byte (128 MiB) ceiling`
		});
		dfuCrc = (bytes) => ~crc32(bytes) >>> 0;
		formatFailure = (offset, detail) => ({
			kind: "format",
			message: `byte offset ${String(offset)}: ${detail}`
		});
		named = (items, total = items.length) => `${items.slice(0, NAMED_ELEMENTS).join("; ")}${total > NAMED_ELEMENTS ? `; and ${String(total - NAMED_ELEMENTS)} more` : ""}`;
		RetainingDfuSeDecoder = class {
			#bytes;
			#length = 0;
			constructor(fileBytes) {
				this.#bytes = new Uint8Array(fileBytes);
			}
			write(chunk) {
				if (this.#length + chunk.length > this.#bytes.length) return err({
					kind: "limit",
					boundary: "file-size",
					message: "file grew beyond its admitted size while being read"
				});
				this.#bytes.set(chunk, this.#length);
				this.#length += chunk.length;
				return ok(undefined);
			}
			finish() {
				return parseDfuSe(this.#bytes.subarray(0, this.#length));
			}
		};
		parseDfuSe = (bytes) => {
			const suffixStart = bytes.length - 16;
			if (bytes.length < PREFIX_BYTES + 16 || !hasDfuSePrefix(bytes) || !hasDfuSeSuffix(bytes.subarray(suffixStart))) return err(formatFailure(0, "the file does not begin with a DfuSe prefix and end with a DFU 1.1a suffix"));
			const imageSize = readUint32(bytes, 6);
			const suffixCrc = readUint32(bytes, suffixStart + 12);
			const computedCrc = dfuCrc(bytes.subarray(0, bytes.length - 4));
			if (imageSize !== suffixStart && imageSize !== bytes.length) return err(formatFailure(6, `DFUImageSize declares ${String(imageSize)} bytes, but the DFU suffix begins at byte ${String(suffixStart)} and the file holds ${String(bytes.length)} bytes; the suffix CRC ${suffixCrc === computedCrc ? "matches" : "does not match"} the file`));
			const targetCount = bytes[10] ?? 0;
			const walk = new TargetWalk(bytes, suffixStart);
			let offset = PREFIX_BYTES;
			for (let targetIndex = 0; targetIndex < targetCount; targetIndex += 1) {
				const next = walk.target(targetIndex, offset);
				if (!next.ok) return next;
				offset = next.value;
			}
			if (offset !== suffixStart) return err(formatFailure(offset, `${String(targetCount)} target(s) end at byte ${String(offset)}, but the DFU suffix begins at byte ${String(suffixStart)}`));
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
					computed_crc: computedCrc
				},
				elements,
				limitations: [...overlaps.length === 0 ? [] : [`${String(overlaps.length)} DfuSe element(s) overlap an earlier element of the same alternate setting; each stays a separate entry and no bytes were merged: ${named(overlaps)}.`], ...walk.unlistedCount === 0 ? [] : [`DfuSe declarations without bytes have no entry: ${named(walk.unlisted, walk.unlistedCount)}.`]]
			});
		};
		TargetWalk = class {
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
				if (offset + TARGET_PREFIX_BYTES > this.suffixStart) return err(formatFailure(offset, `target ${String(targetIndex)} prefix needs ${String(TARGET_PREFIX_BYTES)} bytes, but the image ends at byte ${String(this.suffixStart)}`));
				if (!startsWith(bytes, offset, TARGET_SIGNATURE)) return err(formatFailure(offset, `target ${String(targetIndex)} does not begin with the "Target" signature`));
				const targetSize = readUint32(bytes, offset + 266);
				const declaredElements = readUint32(bytes, offset + 270);
				const bodyStart = offset + TARGET_PREFIX_BYTES;
				const bodyEnd = bodyStart + targetSize;
				if (bodyEnd > this.suffixStart) return err(formatFailure(offset + 266, `target ${String(targetIndex)} declares ${String(targetSize)} bytes, but the image ends at byte ${String(this.suffixStart)}`));
				const target = {
					targetIndex,
					alternateSetting: bytes[offset + 6] ?? 0,
					targetName: readUint32(bytes, offset + 7) === 0 ? null : latin1UntilNul(bytes.subarray(offset + TARGET_NAME_OFFSET, offset + TARGET_NAME_OFFSET + TARGET_NAME_BYTES))
				};
				if (declaredElements === 0) this.#unlisted(() => `target ${String(targetIndex)} (alternate setting ${String(target.alternateSetting)}) declares no elements`);
				let position = bodyStart;
				for (let index = 0; index < declaredElements; index += 1) {
					const next = this.#element(target, index, position, bodyEnd);
					if (!next.ok) return next;
					position = next.value;
				}
				return position === bodyEnd ? ok(bodyEnd) : err(formatFailure(position, `target ${String(targetIndex)} declares ${String(targetSize)} bytes, but its ${String(declaredElements)} element(s) end ${String(bodyEnd - position)} bytes earlier`));
			}
			#element(target, elementIndex, position, bodyEnd) {
				const name = `target ${String(target.targetIndex)} element ${String(elementIndex)}`;
				if (position + ELEMENT_HEADER_BYTES > bodyEnd) return err(formatFailure(position, `${name} header lies beyond the target's end at byte ${String(bodyEnd)}`));
				const address = readUint32(this.bytes, position);
				const size = readUint32(this.bytes, position + 4);
				const dataOffset = position + ELEMENT_HEADER_BYTES;
				if (dataOffset + size > bodyEnd) return err(formatFailure(position + 4, `${name} declares ${String(size)} bytes, but its target ends at byte ${String(bodyEnd)}`));
				if (address + size > ADDRESS_SPACE) return err(formatFailure(position, `${name} at ${hex32(address)} with ${String(size)} bytes wraps past 0xffffffff`));
				if (size > 0 && this.elements.length >= 65536) return err({
					kind: "limit",
					boundary: "capacity",
					message: `byte offset ${String(position)}: the file holds more than ${String(DFUSE_MAX_ELEMENTS)} elements with bytes, the most retained as entries`
				});
				this.elementCount += 1;
				if (size === 0) {
					this.emptyElements += 1;
					this.#unlisted(() => `${name} at ${hex32(address)} (alternate setting ${String(target.alternateSetting)}) holds no bytes`);
				} else this.elements.push({
					...target,
					elementIndex,
					address,
					dataOffset,
					bytes: this.bytes.subarray(dataOffset, dataOffset + size)
				});
				return ok(dataOffset + size);
			}
			/** Count a declaration without bytes; describe only the first few. */
			#unlisted(describe) {
				this.unlistedCount += 1;
				if (this.unlisted.length < NAMED_ELEMENTS) this.unlisted.push(describe());
			}
		};
		latin1UntilNul = (field) => {
			const end = field.indexOf(0);
			return String.fromCharCode(...field.subarray(0, end < 0 ? field.length : end));
		};
		elementText = (element) => `target ${String(element.targetIndex)} element ${String(element.elementIndex)} (${hex32(element.address)}-${hex32(element.address + element.bytes.length - 1)})`;
		overlappingElements = (elements) => {
			const ordered = [...elements].sort((left, right) => left.alternateSetting - right.alternateSetting || left.address - right.address);
			const overlaps = [];
			let reach;
			for (const element of ordered) {
				if (reach !== undefined && reach.alternateSetting === element.alternateSetting && element.address < reach.address + reach.bytes.length) overlaps.push(`${elementText(element)} overlaps ${elementText(reach)} in alternate setting ${String(element.alternateSetting)}`);
				if (reach === undefined || reach.alternateSetting !== element.alternateSetting || element.address + element.bytes.length > reach.address + reach.bytes.length) reach = element;
			}
			return overlaps;
		};
	})))();
}

//#endregion
export { hasXmlPlistSignature as C, init_propertyListXmlText as D, decodeXmlPlistText as E, hasNibArchiveSignature as S, XmlPlistTextDecodeError as T, init_PlistScalars as _, init_propertyListKeys as a, createXmlPlistSignatureProbe as b, init_xmlDocument as c, init_BinaryPlistMaterializer as d, PropertyListDecodeBudgetFailure as f, UnsupportedBinaryPlistUidError as g, preflightPropertyListDecode as h, isDfuSeFile as i, parseXmlDocument as l, init_PropertyListDecodeBudget as m, hasDfuSePrefix as n, parseXmlPropertyList as o, estimateBinaryPlistExpansion as p, init_dfuse as r, XML_LINE_ENDING as s, createDfuSeDecoder as t, decodeBinaryPlistValue as u, scanBinaryPlistScalars as v, init_appleArchiveFormat as w, hasBinaryPlistSignature as x, MAX_XML_PLIST_PROBE_BYTES as y };