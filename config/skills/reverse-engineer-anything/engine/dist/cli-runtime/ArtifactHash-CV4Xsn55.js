import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ArtifactReaderFailure, init_ArtifactReader } from "./ArtifactReader-DJ9rniiL.js";
import { init_dosMz, observeMzWindowsHeader } from "./peOptionalHeader-DFX4E6Yt.js";
import { init_StreamBytes, streamChunkToBuffer } from "./StreamBytes-5y_bghjt.js";
import { createAsarHeaderSignatureProbe, init_AsarHeader } from "./AsarHeader-CcLQy135.js";
import { MAX_XML_PLIST_PROBE_BYTES, createXmlPlistSignatureProbe, init_appleArchiveFormat, init_dfuse } from "./dfuse-Berfn6y4.js";
import { init_machoContainer, readFatContainerHeader, readFatContainerTable, readMachoHeaderPrefixFacts } from "./machoLoadCommands-B9RyDzRE.js";
import { createHash } from "node:crypto";

//#region dist/artifacts/ArtifactClassificationProbe.js
var ARTIFACT_CLASSIFICATION_PREFIX_BYTES, ARTIFACT_CLASSIFICATION_SUFFIX_BYTES, observeFatSliceHeaders, finishClassificationEvidence, createArtifactClassificationProbe;
function init_ArtifactClassificationProbe() {
	return (init_ArtifactClassificationProbe = __esmMin((() => {
		init_AsarHeader();
		init_appleArchiveFormat();
		init_machoContainer();
		init_dosMz();
		init_dfuse();
		ARTIFACT_CLASSIFICATION_PREFIX_BYTES = 8192;
		ARTIFACT_CLASSIFICATION_SUFFIX_BYTES = 16;
		observeFatSliceHeaders = (input) => {
			const { table, observedHeaders, partialHeaders, streamOffset, bytes } = input;
			if (table?.state !== "parsed") return;
			for (const slice of table.slices) {
				if (observedHeaders.has(slice.offset) && !partialHeaders.has(slice.offset)) continue;
				const headerLength = Math.min(12, slice.size);
				const headerEnd = slice.offset + headerLength;
				if (!Number.isSafeInteger(headerEnd)) continue;
				const start = Math.max(slice.offset, streamOffset);
				const end = Math.min(headerEnd, streamOffset + bytes.length);
				if (start >= end) continue;
				let pending = partialHeaders.get(slice.offset);
				if (pending === undefined) {
					pending = {
						bytes: Buffer.alloc(12),
						count: 0
					};
					partialHeaders.set(slice.offset, pending);
				}
				Buffer.from(bytes.subarray(start - streamOffset, end - streamOffset)).copy(pending.bytes, start - slice.offset);
				pending.count += end - start;
				observedHeaders.set(slice.offset, readMachoHeaderPrefixFacts(pending.bytes.subarray(0, Math.min(pending.count, headerLength))));
				if (pending.count === headerLength) {
					partialHeaders.delete(slice.offset);
				}
			}
		};
		finishClassificationEvidence = (prefix, suffix, archiveBytes, finishAsar, sliceHeadersByOffset, mzWindowsHeaderSignature) => {
			const finalHeader = readFatContainerHeader(prefix, archiveBytes);
			if (finalHeader.state === "parsed") {
				for (let index = 0; index < finalHeader.slices.length; index += 1) {
					const slice = finalHeader.slices[index];
					if (slice === undefined || sliceHeadersByOffset.has(slice.offset)) continue;
					const available = Math.max(0, Math.min(slice.size, prefix.length - slice.offset));
					if (available === 0) continue;
					sliceHeadersByOffset.set(slice.offset, readMachoHeaderPrefixFacts(prefix.subarray(slice.offset, slice.offset + available)));
				}
			}
			const fatSliceHeaders = finalHeader.state === "parsed" ? {
				header: finalHeader,
				sliceHeadersByOffset
			} : undefined;
			return {
				prefix,
				...suffix === undefined ? {} : { suffix },
				asarHeader: finishAsar(archiveBytes),
				...fatSliceHeaders === undefined ? {} : { fatSliceHeaders },
				...mzWindowsHeaderSignature === undefined ? {} : { mzWindowsHeaderSignature }
			};
		};
		createArtifactClassificationProbe = (asarHeaderAdmission) => {
			const xml = createXmlPlistSignatureProbe();
			const asar = createAsarHeaderSignatureProbe(asarHeaderAdmission);
			const blocks = [];
			let retainedBytes = 0;
			let observedBytes = 0;
			let fatTable;
			const fatSliceHeadersByOffset = new Map();
			const partialFatHeaders = new Map();
			let mzWindowsHeaderSignature;
			let mzWindowsHeaderOffset;
			let mzHeaderChecked = false;
			let suffix = Buffer.alloc(0);
			const observeSuffix = (bytes) => {
				const joined = bytes.length >= ARTIFACT_CLASSIFICATION_SUFFIX_BYTES ? bytes : Buffer.concat([suffix, bytes]);
				suffix = Buffer.from(joined.subarray(Math.max(0, joined.length - ARTIFACT_CLASSIFICATION_SUFFIX_BYTES)));
			};
			const observeSignatureWindow = (offset, sourceOffset, sourceBytes) => {
				if (!Number.isSafeInteger(offset) || offset < 0) return;
				const start = Math.max(offset, sourceOffset);
				const end = Math.min(offset + 4, sourceOffset + sourceBytes.length);
				if (start >= end) return;
				const window = Buffer.alloc(4);
				const previous = mzWindowsHeaderSignature?.offset === offset ? mzWindowsHeaderSignature.bytes : undefined;
				previous?.copy(window);
				let observedLength = previous?.length ?? 0;
				if (start < end && start <= offset + observedLength) {
					Buffer.from(sourceBytes.subarray(start - sourceOffset, end - sourceOffset)).copy(window, start - offset);
					observedLength = Math.max(observedLength, end - offset);
				}
				if (observedLength === 0) return;
				mzWindowsHeaderSignature = {
					offset,
					bytes: window.subarray(0, observedLength)
				};
			};
			const retain = (bytes) => {
				let offset = 0;
				while (offset < bytes.length) {
					const blockOffset = retainedBytes % ARTIFACT_CLASSIFICATION_PREFIX_BYTES;
					if (blockOffset === 0) blocks.push(Buffer.allocUnsafe(ARTIFACT_CLASSIFICATION_PREFIX_BYTES));
					const count = Math.min(ARTIFACT_CLASSIFICATION_PREFIX_BYTES - blockOffset, bytes.length - offset);
					blocks[blocks.length - 1].set(bytes.subarray(offset, offset + count), blockOffset);
					retainedBytes += count;
					offset += count;
				}
			};
			const retainedPrefix = () => {
				const prefix = Buffer.allocUnsafe(retainedBytes);
				let copied = 0;
				for (const block of blocks) {
					const count = Math.min(block.length, retainedBytes - copied);
					prefix.set(block.subarray(0, count), copied);
					copied += count;
				}
				return prefix;
			};
			return {
				get length() {
					return observedBytes;
				},
				get limit() {
					if (observedBytes < 8192) return ARTIFACT_CLASSIFICATION_PREFIX_BYTES;
					return Math.max(ARTIFACT_CLASSIFICATION_PREFIX_BYTES, xml.state === "pending" ? MAX_XML_PLIST_PROBE_BYTES : 0, asar.observation.state === "pending" ? asar.limit : 0);
				},
				write(bytes) {
					const streamOffset = observedBytes;
					asar.write(bytes);
					let offset = 0;
					while (offset < bytes.length) {
						const limit = retainedBytes < 8192 ? ARTIFACT_CLASSIFICATION_PREFIX_BYTES : xml.state === "pending" ? MAX_XML_PLIST_PROBE_BYTES : retainedBytes;
						if (retainedBytes >= limit) break;
						const selected = bytes.subarray(offset, offset + Math.min(limit - retainedBytes, bytes.length - offset));
						retain(selected);
						xml.write(selected);
						offset += selected.length;
					}
					if ((fatTable === undefined || fatTable.state === "needs-data") && retainedBytes >= 8) fatTable = readFatContainerTable(retainedPrefix());
					observeFatSliceHeaders({
						table: fatTable,
						observedHeaders: fatSliceHeadersByOffset,
						partialHeaders: partialFatHeaders,
						streamOffset,
						bytes
					});
					if (!mzHeaderChecked && retainedBytes >= 64) {
						mzHeaderChecked = true;
						const prefix = retainedPrefix();
						if (prefix[0] === 77 && prefix[1] === 90) {
							const windowsHeader = observeMzWindowsHeader(prefix, Number.MAX_SAFE_INTEGER);
							if (windowsHeader.state === "signature-needed") {
								mzWindowsHeaderOffset = windowsHeader.offset;
								if (windowsHeader.offset < prefix.length) {
									const inline = prefix.subarray(windowsHeader.offset, Math.min(windowsHeader.offset + 4, prefix.length));
									mzWindowsHeaderSignature = {
										offset: windowsHeader.offset,
										bytes: inline
									};
								}
							}
						}
					}
					if (mzWindowsHeaderOffset !== undefined) observeSignatureWindow(mzWindowsHeaderOffset, streamOffset, bytes);
					observeSuffix(bytes);
					observedBytes += bytes.length;
				},
				finish(archiveBytes) {
					return finishClassificationEvidence(retainedPrefix(), observedBytes === archiveBytes ? suffix : undefined, archiveBytes, (bytes) => asar.finish(bytes), fatSliceHeadersByOffset, mzWindowsHeaderSignature);
				}
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactHash.js
var abortIfNeeded, hashReadable, hashReadableToCompletion;
function init_ArtifactHash() {
	return (init_ArtifactHash = __esmMin((() => {
		init_ArtifactReader();
		init_StreamBytes();
		init_ArtifactClassificationProbe();
		abortIfNeeded = (signal) => {
			if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Artifact inventory cancelled", { cause: signal.reason });
		};
		hashReadable = async (stream, signal, integrityAlgorithm, asarHeaderAdmission, observeChunk) => {
			const completed = await hashReadableToCompletion(stream, signal, integrityAlgorithm, asarHeaderAdmission, observeChunk);
			abortIfNeeded(signal);
			return completed;
		};
		hashReadableToCompletion = async (stream, signal, integrityAlgorithm, asarHeaderAdmission, observeChunk) => {
			const hash = createHash("sha256");
			const md5 = integrityAlgorithm === "md5" ? createHash("md5") : undefined;
			const probe = createArtifactClassificationProbe(asarHeaderAdmission);
			let bytes = 0;
			for await (const raw of stream) {
				abortIfNeeded(signal);
				const chunk = streamChunkToBuffer(raw);
				bytes += chunk.length;
				hash.update(chunk);
				observeChunk?.(chunk);
				md5?.update(chunk);
				probe.write(chunk);
			}
			return {
				sha256: hash.digest("hex"),
				...md5 === undefined ? {} : { md5: md5.digest("hex") },
				bytes,
				...probe.finish(bytes)
			};
		};
	})))();
}

//#endregion
export { ARTIFACT_CLASSIFICATION_PREFIX_BYTES, abortIfNeeded, createArtifactClassificationProbe, hashReadable, hashReadableToCompletion, init_ArtifactClassificationProbe, init_ArtifactHash };