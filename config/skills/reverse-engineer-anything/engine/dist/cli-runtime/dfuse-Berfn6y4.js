import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { crc32 } from "node:zlib";

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
export { MAX_XML_PLIST_PROBE_BYTES, createDfuSeDecoder, createXmlPlistSignatureProbe, hasBinaryPlistSignature, hasDfuSePrefix, hasNibArchiveSignature, hasXmlPlistSignature, init_appleArchiveFormat, init_dfuse, isDfuSeFile };