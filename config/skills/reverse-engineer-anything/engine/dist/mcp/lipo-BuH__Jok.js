import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { f as init_snapshotEnvironment, m as snapshotEnvironment } from "./ExecFileOutput-CmNC2ZNQ.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { f as init_analysisErrorCore, l as AnalysisResourceConstraintError, s as AnalysisOutputError } from "./analysisErrorCore-BCqhUcUc.js";
import { C as ArtifactReaderFailure, D as init_ArtifactReader, _ as openRegularFile, a as regularFileCancellation, b as OwnedFileHandle, c as NonRegularFileReadError, i as init_OwnedRegularFile, l as RegularFileAdmissionFailure, m as init_RegularFile, p as assertStableRegularFileIdentity, u as RegularFileChangedError, x as init_OwnedFileHandle } from "./OwnedRegularFile-CufsBAJJ.js";
import { d as observeMzWindowsHeader, l as init_dosMz } from "./peOptionalHeader-DlFfyymM.js";
import { pc as init_nativeDeadlines, sc as DEFAULT_NATIVE_COMMAND_TIMEOUT_MS } from "./toolOutputSchemaGroups-3HUmDmX5.js";
import { h as init_machoCpuIdentity, v as machoCpuSubtypeBase } from "./electronFuses-Df6i7gr9.js";
import { b as createXmlPlistSignatureProbe, r as init_dfuse, w as init_appleArchiveFormat, y as MAX_XML_PLIST_PROBE_BYTES } from "./dfuse-FtvOrGbN.js";
import { _ as readMachoHeaderPrefixFacts, d as init_machoContainer, f as readFatContainerHeader, p as readFatContainerTable } from "./machoLoadCommands-Cifbqd4t.js";
import { n as init_providerCleanupError, t as ProviderCleanupError } from "./providerCleanupError-CbzQ5mbk.js";
import { n as init_fileSnapshotObservation, t as fileSnapshotPartialObservationSchema } from "./fileSnapshotObservation-C_bGwOYn.js";
import { a as selectArtifactCommandPath, h as readArtifactFileChunks, i as init_ArtifactCommandPath, m as init_readArtifactFileChunks, o as OwnedCommandFailure, s as init_OwnedCommand, u as runOwnedCommand } from "./machoSectionHeader-B-cyFCGi.js";
import { i as init_AsarHeader, r as createAsarHeaderSignatureProbe } from "./AsarHeader-Cc-q_e3d.js";
import { A as boundedUtf8Text, C as DarwinProcessOwnershipInspectionError, T as init_DarwinProcessRunTokenReader, j as init_boundedUtf8Text } from "./ProcessOwnership-DPTLd85r.js";
import { createReadStream } from "node:fs";
import { z } from "zod";
import { createHash, randomUUID } from "node:crypto";

//#region dist/artifacts/StreamBytes.js
var streamChunkToBuffer;
function init_StreamBytes() {
	return (init_StreamBytes = __esmMin((() => {
		streamChunkToBuffer = (value) => {
			if (Buffer.isBuffer(value)) return value;
			if (value instanceof Uint8Array) return Buffer.from(value);
			if (typeof value === "string") return Buffer.from(value);
			throw new TypeError("Readable stream emitted a non-byte chunk");
		};
	})))();
}

//#endregion
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
//#region dist/artifacts/inventory/hashStableRootArtifact.js
var releaseRootArtifact, openRootArtifact, hashStableRootArtifact, hashStableRootArtifactHandle;
function init_hashStableRootArtifact() {
	return (init_hashStableRootArtifact = __esmMin((() => {
		init_OwnedRegularFile();
		init_readArtifactFileChunks();
		init_OwnedFileHandle();
		init_ArtifactReader();
		init_RegularFile();
		init_ArtifactHash();
		init_fileSnapshotObservation();
		releaseRootArtifact = async (path, owner, resourceScope, outcome, signal) => {
			const cleanup = await resourceScope.release({
				kind: "file-handle",
				resource: `root artifact descriptor for ${path}`,
				handle: owner
			});
			const observation = outcome.kind === "completed" && outcome.digest !== null ? fileSnapshotPartialObservationSchema.parse({
				kind: "file-snapshot-hash",
				path,
				sha256: outcome.digest.sha256,
				bytes: outcome.digest.bytes
			}) : undefined;
			const finalOutcome = outcome.kind === "completed" && signal?.aborted ? {
				kind: "failed",
				cause: new ArtifactReaderFailure("cancelled", "Root artifact inventory cancelled during descriptor finalization", {
					cause: signal.reason,
					partialObservation: observation
				})
			} : outcome;
			if (cleanup.kind === "failed") throw resourceScope.cleanupFailure(finalOutcome, [cleanup], observation);
			if (finalOutcome.kind === "failed") throw finalOutcome.cause;
		};
		openRootArtifact = async (path, resourceScope, signal) => {
			try {
				const source = await openRegularFile(path, {
					symlinks: "reject",
					signal
				});
				return {
					...source,
					owner: new OwnedFileHandle(source.handle)
				};
			} catch (cause) {
				const primary = cause instanceof RegularFileAdmissionFailure ? cause.cause : cause;
				const cancellation = regularFileCancellation(primary);
				const failure = cancellation !== undefined ? new ArtifactReaderFailure("cancelled", "Artifact admission cancelled", { cause: cancellation.reason }) : primary instanceof NonRegularFileReadError ? new ArtifactReaderFailure("format", `Artifact root is not a regular file: ${path}`, { cause: primary }) : primary;
				if (cause instanceof RegularFileAdmissionFailure) {
					const resource = `root artifact descriptor for ${path}`;
					const cleanup = await resourceScope.release({
						kind: "file-handle",
						resource,
						handle: cause.owner
					});
					if (cleanup.kind === "failed") throw resourceScope.cleanupFailure({
						kind: "failed",
						cause: failure
					}, [cleanup]);
				}
				throw failure;
			}
		};
		hashStableRootArtifact = async (path, resourceScope, signal) => {
			const { handle, initial, owner } = await openRootArtifact(path, resourceScope, signal);
			let outcome;
			try {
				outcome = {
					kind: "completed",
					value: await hashStableRootArtifactHandle(path, handle, initial, signal)
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			await releaseRootArtifact(path, owner, resourceScope, outcome.kind === "completed" ? {
				kind: "completed",
				digest: outcome.value
			} : outcome, signal);
			if (outcome.kind === "failed") throw outcome.cause;
			return outcome.value;
		};
		hashStableRootArtifactHandle = async (path, handle, initial, signal) => {
			const digest = await hashReadable(readArtifactFileChunks(handle, {
				start: 0,
				end: initial.size,
				signal
			}), signal);
			abortIfNeeded(signal);
			try {
				await assertStableRegularFileIdentity(handle, path, initial, {
					symlinks: "reject",
					...signal === undefined ? {} : { signal }
				});
			} catch (cause) {
				abortIfNeeded(signal);
				if (cause instanceof RegularFileChangedError) throw new ArtifactReaderFailure("integrity", `Root artifact changed during inventory: ${path}`, { cause: cause.cause ?? cause });
				throw cause;
			}
			if (digest.bytes !== initial.size) throw new ArtifactReaderFailure("integrity", `Root artifact changed during inventory: ${path}`);
			abortIfNeeded(signal);
			return digest;
		};
	})))();
}

//#endregion
//#region dist/native/metadata/BinaryContainer.js
var BinaryFormatFailure, BinaryMappingFailure, BinaryResourceFailure, BinaryStringReadLimitFailure, imageFileMappings, BinaryReader, declaredFileRange, mappedFileOffset, lastAtOrBelow, prefixReach, createFileMappingIndex, readMappedCString, readMappedString, isZeroFilledSpan, spansOverlap;
function init_BinaryContainer() {
	return (init_BinaryContainer = __esmMin((() => {
		BinaryFormatFailure = class extends Error {
			kind;
			constructor(kind, message) {
				super(message);
				this.kind = kind;
				this.name = "BinaryFormatFailure";
			}
		};
		BinaryMappingFailure = class extends BinaryFormatFailure {
			reason;
			constructor(reason, message) {
				super("malformed", message);
				this.reason = reason;
			}
		};
		BinaryResourceFailure = class extends Error {
			boundary;
			maximum_bytes;
			constructor(boundary, maximum_bytes, message) {
				super(message);
				this.boundary = boundary;
				this.maximum_bytes = maximum_bytes;
				this.name = "BinaryResourceFailure";
			}
		};
		BinaryStringReadLimitFailure = class extends BinaryFormatFailure {
			maximumBytes;
			constructor(maximumBytes) {
				super("malformed", `String termination was not established within its ${String(maximumBytes)}-byte read allowance`);
				this.maximumBytes = maximumBytes;
			}
		};
		imageFileMappings = (container) => container.pe_header_mapping === undefined ? container.mappings : [container.pe_header_mapping, ...container.mappings];
		BinaryReader = class {
			bytes;
			little;
			constructor(bytes, little) {
				this.bytes = bytes;
				this.little = little;
			}
			range(offset, size, label) {
				if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 || offset > this.bytes.length || size > this.bytes.length - offset) throw new BinaryFormatFailure("malformed", `${label} range is truncated or outside the file`);
				return this.bytes.subarray(offset, offset + size);
			}
			u16(offset) {
				const value = this.range(offset, 2, "16-bit field");
				return this.little ? value.readUInt16LE() : value.readUInt16BE();
			}
			u32(offset) {
				const value = this.range(offset, 4, "32-bit field");
				return this.little ? value.readUInt32LE() : value.readUInt32BE();
			}
			word(offset, bits) {
				if (bits === 32) return BigInt(this.u32(offset));
				const value = this.range(offset, 8, "64-bit field");
				return this.little ? value.readBigUInt64LE() : value.readBigUInt64BE();
			}
			fileRange(offset, size, label) {
				if (offset > BigInt(this.bytes.length) || size > BigInt(this.bytes.length) - offset) throw new BinaryFormatFailure("malformed", `${label} range is outside the file`);
				const result = {
					address: 0n,
					offset: Number(offset),
					size: Number(size)
				};
				this.range(result.offset, result.size, label);
				return result;
			}
			table(offset, count, width, label) {
				const size = BigInt(count) * BigInt(width);
				if (size > 16n * 1024n * 1024n) throw new BinaryResourceFailure("structure", 16 * 1024 * 1024, `${label} exceeds the 16 MiB structural decoding budget`);
				return this.fileRange(offset, size, label).offset;
			}
		};
		declaredFileRange = (fileBytes, offset, size) => {
			if (offset < 0n || size < 0n || offset > BigInt(Number.MAX_SAFE_INTEGER) || size > BigInt(Number.MAX_SAFE_INTEGER) || offset > BigInt(fileBytes) || size > BigInt(fileBytes) - offset) return {
				offset: 0,
				size: 0,
				file_backed: false
			};
			return {
				offset: Number(offset),
				size: Number(size),
				file_backed: size > 0n
			};
		};
		mappedFileOffset = (mappings, address, size, zeroFills = []) => {
			if (!Number.isSafeInteger(size) || size < 0) throw new BinaryFormatFailure("malformed", "Virtual span size is invalid");
			const end = address + BigInt(size);
			let found;
			const covered = [];
			let whollyCovered = size === 0;
			for (const mapping of mappings) {
				const mappingEnd = mapping.address + BigInt(mapping.size);
				const start = address > mapping.address ? address : mapping.address;
				const overlapEnd = end < mappingEnd ? end : mappingEnd;
				if (size === 0 ? address < mapping.address || address > mappingEnd : start >= overlapEnd) continue;
				const origin = mapping.offset + Number(address - mapping.address);
				if (found !== undefined && found !== origin) throw new BinaryMappingFailure("ambiguous", "Virtual span has ambiguous or noncontiguous file mappings");
				found = origin;
				if (start === address && overlapEnd === end) whollyCovered = true;
				else if (!whollyCovered) covered.push({
					start,
					end: overlapEnd
				});
			}
			if (found === undefined) throw new BinaryMappingFailure("unmapped", "Virtual address or string range is not file mapped");
			if (!whollyCovered) {
				covered.sort((left, right) => left.start < right.start ? -1 : left.start > right.start ? 1 : 0);
				let cursor = address;
				for (const span of covered) {
					if (span.start > cursor) throw new BinaryMappingFailure("unmapped", "Virtual address or string range is not file mapped");
					if (span.end > cursor) cursor = span.end;
				}
				if (cursor < end) throw new BinaryMappingFailure("unmapped", "Virtual address or string range is not file mapped");
			}
			for (const zeroFill of zeroFills) {
				if (spansOverlap(address, BigInt(size), zeroFill.address, zeroFill.size)) throw new BinaryMappingFailure("ambiguous", "Virtual address has ambiguous file and zero-fill mappings");
			}
			return found;
		};
		lastAtOrBelow = (sorted, value) => {
			let low = 0;
			let high = sorted.length;
			while (low < high) {
				const middle = low + high >>> 1;
				if (sorted[middle] <= value) low = middle + 1;
				else high = middle;
			}
			return low - 1;
		};
		prefixReach = (spans) => {
			const sorted = [...spans].sort((left, right) => left.start < right.start ? -1 : left.start > right.start ? 1 : 0);
			const starts = [];
			const reach = [];
			let furthest = -1n;
			for (const span of sorted) {
				if (span.end > furthest) furthest = span.end;
				starts.push(span.start);
				reach.push(furthest);
			}
			return {
				starts,
				reach
			};
		};
		createFileMappingIndex = (mappings, zeroFills = []) => {
			const backed = mappings.filter((mapping) => mapping.size > 0).map((mapping) => ({
				start: mapping.address,
				end: mapping.address + BigInt(mapping.size),
				translation: BigInt(mapping.offset) - mapping.address
			}));
			const zeroFilled = prefixReach(zeroFills.filter((zeroFill) => zeroFill.size > 0n).map((zeroFill) => ({
				start: zeroFill.address,
				end: zeroFill.address + zeroFill.size
			})));
			const events = new Map();
			const event = (at) => {
				let entry = events.get(at);
				if (entry === undefined) {
					entry = {
						add: [],
						remove: []
					};
					events.set(at, entry);
				}
				return entry;
			};
			for (const span of backed) {
				event(span.start).add.push(span.translation);
				event(span.end).remove.push(span.translation);
			}
			const boundaries = [...events.keys()].sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
			const active = new Map();
			const translations = [];
			for (const boundary of boundaries) {
				const entry = events.get(boundary);
				for (const translation of entry?.remove ?? []) {
					const count = (active.get(translation) ?? 0) - 1;
					if (count === 0) active.delete(translation);
					else active.set(translation, count);
				}
				for (const translation of entry?.add ?? []) active.set(translation, (active.get(translation) ?? 0) + 1);
				translations.push(active.size === 0 ? undefined : active.size === 1 ? active.keys().next().value : null);
			}
			const runEnd = boundaries.map(() => 0n);
			for (let index = boundaries.length - 1; index >= 0; index--) {
				const next = boundaries[index + 1];
				const translation = translations[index];
				runEnd[index] = next === undefined ? boundaries[index] : translation !== null && translation !== undefined && translations[index + 1] === translation ? runEnd[index + 1] : next;
			}
			const ambiguousPrefix = [0];
			const previousMapped = [];
			const nextMapped = [];
			const translationRuns = [];
			let previous = -1;
			let run = 0;
			let previousTranslation;
			for (const [index, translation] of translations.entries()) {
				ambiguousPrefix.push((ambiguousPrefix[index] ?? 0) + (translation === null ? 1 : 0));
				if (typeof translation === "bigint") {
					if (translation !== previousTranslation) run += 1;
					previousTranslation = translation;
					previous = index;
				}
				previousMapped.push(previous);
				translationRuns.push(run);
			}
			let next = translations.length;
			for (let index = translations.length - 1; index >= 0; index--) {
				if (typeof translations[index] === "bigint") next = index;
				nextMapped[index] = next;
			}
			const offset = (address, size) => {
				if (!Number.isSafeInteger(size) || size <= 0) return mappedFileOffset(mappings, address, size, zeroFills);
				const end = address + BigInt(size);
				const interval = lastAtOrBelow(boundaries, address);
				const lower = Math.max(0, interval);
				const upper = lastAtOrBelow(boundaries, end - 1n);
				const first = nextMapped[lower] ?? translations.length;
				const last = previousMapped[upper] ?? -1;
				if ((ambiguousPrefix[upper + 1] ?? 0) - (ambiguousPrefix[lower] ?? 0) > 0 || first <= upper && last >= lower && translationRuns[first] !== translationRuns[last]) throw new BinaryMappingFailure("ambiguous", "Virtual span has ambiguous or noncontiguous file mappings");
				const translation = translations[interval];
				if (typeof translation !== "bigint" || runEnd[interval] < end) throw new BinaryMappingFailure("unmapped", "Virtual address or string range is not file mapped");
				const zeroFill = lastAtOrBelow(zeroFilled.starts, end - 1n);
				if (zeroFill >= 0 && zeroFilled.reach[zeroFill] > address) throw new BinaryMappingFailure("ambiguous", "Virtual address has ambiguous file and zero-fill mappings");
				return Number(address + translation);
			};
			const access = {
				offset,
				mappingAt: (address) => {
					const start = offset(address, 1);
					const interval = lastAtOrBelow(boundaries, address);
					return {
						address,
						offset: start,
						size: Number(runEnd[interval] - address)
					};
				}
			};
			return {
				offset,
				readCString: (bytes, address, maximumBytes) => readMappedString(bytes, access, address, maximumBytes)
			};
		};
		readMappedCString = (bytes, image, address, maximumBytes) => {
			const mappings = imageFileMappings(image);
			return readMappedString(bytes, {
				mappingAt: (cursor) => mappings.find((range) => range.address <= cursor && cursor < range.address + BigInt(range.size)),
				offset: (cursor, size) => mappedFileOffset(mappings, cursor, size, image.zero_fills)
			}, address, maximumBytes);
		};
		readMappedString = (bytes, access, address, maximumBytes) => {
			const chunks = [];
			let length = 0;
			while (length <= maximumBytes) {
				const cursor = address + BigInt(length);
				const mapping = access.mappingAt(cursor);
				if (mapping === undefined) {
					access.offset(cursor, 1);
					throw new BinaryMappingFailure("unmapped", "String range is not file mapped");
				}
				const size = Math.min(maximumBytes + 1 - length, Number(mapping.address + BigInt(mapping.size) - cursor));
				const offset = mapping.offset + Number(cursor - mapping.address);
				const chunk = bytes.subarray(offset, offset + size);
				const terminator = chunk.indexOf(0);
				const consumed = terminator < 0 ? size : terminator + 1;
				access.offset(cursor, consumed);
				if (terminator >= 0) {
					const tail = chunk.subarray(0, terminator);
					if (chunks.length === 0) return tail;
					chunks.push(tail);
					return Buffer.concat(chunks, length + terminator);
				}
				chunks.push(chunk);
				length += size;
			}
			throw new BinaryStringReadLimitFailure(maximumBytes);
		};
		isZeroFilledSpan = (mappings, zeroFills, address, size) => {
			const bytes = BigInt(size);
			if (!zeroFills.some((mapping) => address >= mapping.address && address + bytes <= mapping.address + mapping.size)) return false;
			for (const mapping of mappings) {
				if (spansOverlap(address, bytes, mapping.address, BigInt(mapping.size))) throw new BinaryMappingFailure("ambiguous", "Virtual address has ambiguous file and zero-fill mappings");
			}
			return true;
		};
		spansOverlap = (address, size, otherAddress, otherSize) => size > 0n && otherSize > 0n && address < otherAddress + otherSize && otherAddress < address + size;
	})))();
}

//#endregion
//#region dist/native/CommandRunner.js
var NATIVE_COMMAND_OUTPUT_BUDGET_BYTES, NATIVE_FAILURE_DIAGNOSTIC_BYTES, NativeCommandFailure, XcrunCommandRunner, commandProcessResources, commandCleanupFailure, ALLOWED_TOOLS, resolveXcrunTool, failureCapture, captureProcess, processFailureReason, processCaptureFromSnapshot, hashFile;
function init_CommandRunner() {
	return (init_CommandRunner = __esmMin((() => {
		init_snapshotEnvironment();
		init_result();
		init_providerCleanupError();
		init_DarwinProcessRunTokenReader();
		init_OwnedCommand();
		init_boundedUtf8Text();
		init_nativeDeadlines();
		init_ArtifactCommandPath();
		init_ArtifactReader();
		NATIVE_COMMAND_OUTPUT_BUDGET_BYTES = 64 * 1024 * 1024;
		NATIVE_FAILURE_DIAGNOSTIC_BYTES = 64 * 1024;
		NativeCommandFailure = class NativeCommandFailure extends Error {
			tool;
			reason;
			exitCode;
			capture;
			cleanupFailure;
			cleanupResources;
			/** Caller-owned cancellation fact retained separately from the physical cause. */
			cancellation;
			cleanupOwner;
			cleanupFailures;
			cleanupMarker;
			detail;
			preparationFailure;
			constructor(tool, reason, exitCode = null, options, capture = null, cleanupFailure = null, cleanupResources = []) {
				super(`Native command ${tool} failed: ${reason}`, options);
				this.tool = tool;
				this.reason = reason;
				this.exitCode = exitCode;
				this.capture = capture;
				this.cleanupFailure = cleanupFailure;
				this.cleanupResources = cleanupResources;
				this.cancellation = options?.cancellation === undefined ? undefined : { reason: options.cancellation.reason };
				this.cleanupOwner = options?.cleanupOwner;
				this.cleanupFailures = options?.cleanupFailures ?? [];
				this.cleanupMarker = options?.cleanupMarker;
				this.preparationFailure = options?.cause instanceof DarwinProcessOwnershipInspectionError ? options.cause : options?.cause instanceof NativeCommandFailure || options?.cause instanceof OwnedCommandFailure ? options.cause.preparationFailure : undefined;
				this.detail = options?.detail ?? this.preparationFailure?.message ?? null;
			}
		};
		XcrunCommandRunner = class {
			resolveTool;
			launcher;
			environment;
			#cleanupMarkers = new Map();
			#cleanupAttempt;
			constructor(environment, resolveTool = (tool, signal, launcher, timeoutMs) => resolveXcrunTool(tool, this.environment, signal, launcher, timeoutMs), launcher) {
				this.resolveTool = resolveTool;
				this.launcher = launcher;
				this.environment = snapshotEnvironment(environment);
			}
			run(tool, arguments_, options) {
				if (!ALLOWED_TOOLS.has(tool)) return Promise.resolve(err(new NativeCommandFailure(tool, "unavailable")));
				return this.#runAfterCleanup(tool, arguments_, options);
			}
			/** Retry every retained owner; a failed retry prevents another command launch. */
			retryCleanup() {
				if (this.#cleanupMarkers.size === 0) return Promise.resolve([]);
				if (this.#cleanupAttempt !== undefined) return this.#cleanupAttempt;
				this.#cleanupAttempt = this.#retryCleanup().finally(() => {
					this.#cleanupAttempt = undefined;
				});
				return this.#cleanupAttempt;
			}
			async #runAfterCleanup(tool, arguments_, options) {
				const pendingFailures = await this.retryCleanup();
				if (pendingFailures.length > 0) return err(commandCleanupFailure(tool, pendingFailures));
				const resolved = await this.resolveTool(tool, options.signal, this.launcher, options.timeoutMs);
				if (!resolved.ok) {
					return err(this.#retainCleanupOwner(resolved.error));
				}
				const captured = await captureProcess(resolved.value.invocationPath, arguments_, tool, options, this.environment, this.launcher);
				if (!captured.ok) return err(this.#retainCleanupOwner(captured.error));
				return ok({
					...captured.value,
					tool,
					executable: resolved.value.invocationPath,
					executableSha256: resolved.value.sha256,
					toolVersion: null,
					versionReason: "Tool exposes no uniform stable version flag; executable SHA-256 is a prelaunch file sample and does not prove atomic OS image binding.",
					arguments: [...arguments_]
				});
			}
			async #retryCleanup() {
				const failures = [];
				for (const [owner, marker] of this.#cleanupMarkers) {
					let reason;
					try {
						const stopped = await owner.stop();
						if (stopped.status === "not-owned") {
							reason = "native command ownership remains unresolved";
						} else if (stopped.status !== "incomplete") {
							marker.resolveCleanup();
							this.#cleanupMarkers.delete(owner);
							continue;
						} else reason = stopped.reason || "native command cleanup remains unverified";
					} catch (cause) {
						reason = cause instanceof Error ? cause.message || cause.name : String(cause) || "native command cleanup failed unexpectedly";
					}
					failures.push({
						owner,
						reason: reason ?? "native command cleanup remains unverified",
						resources: commandProcessResources(owner),
						marker
					});
				}
				return failures;
			}
			#retainCleanupOwner(failure) {
				const owner = failure.cleanupOwner;
				if (owner === undefined) return failure;
				let marker = failure.cleanupMarker ?? this.#cleanupMarkers.get(owner);
				if (marker === undefined) {
					marker = new ProviderCleanupError("native-macos", commandProcessResources(owner), { reason: failure.cleanupFailure ?? "native command cleanup remains incomplete" }, {
						operation: "native_command",
						cause: failure
					});
				}
				this.#cleanupMarkers.set(owner, marker);
				if (failure.cleanupMarker === marker) return failure;
				return new NativeCommandFailure(failure.tool, failure.reason, failure.exitCode, {
					cause: failure,
					...failure.cancellation === undefined ? {} : { cancellation: failure.cancellation },
					cleanupOwner: owner,
					cleanupFailures: failure.cleanupFailures,
					cleanupMarker: marker,
					...failure.detail === null ? {} : { detail: failure.detail }
				}, failure.capture, failure.cleanupFailure, failure.cleanupResources);
			}
		};
		commandProcessResources = (owner) => {
			const ownership = owner.launch.ownership;
			return ownership === undefined ? ["native-command-process"] : [
				ownership.runId,
				`pid:${String(ownership.leaderPid)}`,
				`process-group:${String(ownership.processGroupId)}`
			];
		};
		commandCleanupFailure = (tool, failures) => new NativeCommandFailure(tool, "io", null, {
			cleanupFailures: failures,
			cause: new AggregateError(failures.map(({ reason, resources }) => new Error(`${reason} (${resources.join(", ")})`)), "Previously owned native command cleanup remains incomplete")
		}, null, failures.map(({ reason, resources }) => `${resources.join(", ")}: ${reason}`).join("; "), [...new Set(failures.flatMap(({ resources }) => resources))]);
		ALLOWED_TOOLS = new Set([
			"codesign",
			"dyld_info",
			"dwarfdump",
			"file",
			"lipo",
			"nm",
			"plutil",
			"strings",
			"swift-demangle",
			"vtool"
		]);
		resolveXcrunTool = async (tool, environment, signal, launcher, timeoutMs) => {
			const found = await captureProcess("/usr/bin/xcrun", ["--find", tool], "xcrun", {
				...signal === undefined ? {} : { signal },
				...timeoutMs === undefined ? {} : { timeoutMs }
			}, environment, launcher);
			if (!found.ok) {
				return err(new NativeCommandFailure(tool, found.error.reason === "nonzero-exit" || found.error.reason === "unavailable" ? "unavailable" : found.error.reason, found.error.exitCode, {
					cause: found.error,
					...found.error.cleanupOwner === undefined ? {} : { cleanupOwner: found.error.cleanupOwner },
					...found.error.cleanupFailures.length === 0 ? {} : { cleanupFailures: found.error.cleanupFailures },
					...found.error.cleanupMarker === undefined ? {} : { cleanupMarker: found.error.cleanupMarker },
					...found.error.cancellation === undefined ? {} : { cancellation: found.error.cancellation },
					...found.error.detail === null ? {} : { detail: found.error.detail }
				}, found.error.capture, found.error.cleanupFailure, found.error.cleanupResources));
			}
			if (found.value.exitCode !== 0) return err(new NativeCommandFailure(tool, "unavailable", found.value.exitCode, undefined, failureCapture(found.value, false)));
			const candidate = found.value.stdout.trim();
			if (!candidate.startsWith("/")) return err(new NativeCommandFailure(tool, "unavailable", found.value.exitCode, undefined, failureCapture(found.value, false)));
			try {
				const selected = await selectArtifactCommandPath(candidate, signal);
				return ok({
					...selected,
					sha256: await hashFile(selected.resolvedPath, signal)
				});
			} catch (cause) {
				const capture = failureCapture(found.value, false);
				const cancellation = signal?.aborted === true ? { reason: signal.reason } : undefined;
				const observedCancellation = signal?.aborted === true && cause instanceof Error && cause.cause === signal.reason && (cause instanceof ArtifactReaderFailure && cause.reason === "cancelled" || "code" in cause && cause.code === "ABORT_ERR");
				return err(new NativeCommandFailure(tool, observedCancellation ? "cancelled" : "io", capture.exitCode, {
					cause,
					...cancellation === undefined ? {} : { cancellation }
				}, capture));
			}
		};
		failureCapture = (capture, truncated) => {
			const stdout = boundedUtf8Text(capture.stdout, NATIVE_FAILURE_DIAGNOSTIC_BYTES);
			const stderr = boundedUtf8Text(capture.stderr, NATIVE_FAILURE_DIAGNOSTIC_BYTES);
			return {
				stdout: stdout.text,
				stderr: stderr.text,
				stdoutBytes: capture.stdoutBytes,
				stderrBytes: capture.stderrBytes,
				exitCode: capture.exitCode,
				signal: capture.signal,
				truncated: truncated || stdout.truncated || stderr.truncated
			};
		};
		captureProcess = async (executable, arguments_, tool, options, environment, launcher) => {
			const runId = `rea-native-command-${randomUUID()}`;
			try {
				const snapshot = await runOwnedCommand({
					command: executable,
					arguments: [...arguments_],
					runId,
					env: {
						LC_ALL: "C",
						LANG: "C"
					},
					hostEnvironment: environment,
					...options.signal === undefined ? {} : { signal: options.signal }
				}, {
					timeoutMs: options.timeoutMs ?? 6e4,
					diagnosticBytes: NATIVE_COMMAND_OUTPUT_BUDGET_BYTES,
					acceptNonZeroExit: options.acceptNonZero === true
				}, launcher === undefined ? {} : { launcher });
				return ok(processCaptureFromSnapshot(snapshot));
			} catch (cause) {
				if (cause instanceof OwnedCommandFailure) {
					const capture = cause.snapshot === null ? null : failureCapture(processCaptureFromSnapshot(cause.snapshot), cause.snapshot.diagnosticTruncated === true);
					return err(new NativeCommandFailure(tool, cause.reason === "process" ? processFailureReason(capture) : cause.reason, capture?.exitCode ?? null, {
						cause,
						...cause.cancellation === undefined ? {} : { cancellation: cause.cancellation },
						...cause.cleanupOwner === undefined ? {} : { cleanupOwner: cause.cleanupOwner }
					}, capture, cause.cleanupFailure, cause.resources));
				}
				return err(new NativeCommandFailure(tool, cause instanceof DarwinProcessOwnershipInspectionError && cause.cancellation !== undefined ? "cancelled" : "io", null, { cause }));
			}
		};
		processFailureReason = (capture) => capture !== null && (capture.signal !== null || capture.exitCode !== null && capture.exitCode !== 0) ? "nonzero-exit" : "io";
		processCaptureFromSnapshot = (snapshot) => ({
			stdout: snapshot.stdout.text,
			stderr: snapshot.stderr.text,
			stdoutBytes: snapshot.stdout.bytes,
			stderrBytes: snapshot.stderr.bytes,
			exitCode: snapshot.exitCode ?? null,
			signal: snapshot.signal ?? null
		});
		hashFile = (path, signal) => new Promise((resolve, reject) => {
			const hash = createHash("sha256");
			const stream = createReadStream(path, signal === undefined ? undefined : { signal });
			stream.on("data", (chunk) => hash.update(chunk));
			stream.once("error", reject);
			stream.once("end", () => resolve(hash.digest("hex")));
		});
	})))();
}

//#endregion
//#region dist/native/parsers/lipo.js
var architectureSchema, LipoFieldRetentionError, parseLipoOutput, parseLipoOutputResult, parseLipoCapture, integer, CPU_TYPES, CPU_SUBTYPES, cpuTypeCode, cpuSubtypeCode, cpuSubtypeBase, capabilityBits, unsigned32, alignment;
function init_lipo() {
	return (init_lipo = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		init_CommandRunner();
		init_machoCpuIdentity();
		architectureSchema = z.object({
			name: z.string().min(1),
			hidden: z.boolean(),
			cpu_type: z.string().nullable(),
			cpu_subtype: z.string().nullable(),
			cpu_type_code: z.int().nonnegative().nullable(),
			cpu_subtype_code: z.int().nonnegative().nullable(),
			cpu_subtype_base: z.int().nonnegative().nullable(),
			capabilities: z.string().nullable(),
			file_offset: z.int().min(0).nullable(),
			size: z.int().min(0).nullable(),
			alignment: z.int().min(0).nullable()
		});
		LipoFieldRetentionError = class extends Error {
			requiredBytes;
			_tag = "LipoFieldRetentionError";
			constructor(requiredBytes) {
				super("lipo numeric field observations exceed the retained native output budget");
				this.requiredBytes = requiredBytes;
				this.name = this._tag;
			}
		};
		parseLipoOutput = (output, operandPath) => {
			if (operandPath !== undefined) {
				const header = `Fat header in: ${operandPath}`;
				if (output.startsWith(header)) {
					if (output.startsWith("\r\n", header.length)) output = output.slice(header.length + 2);
					else if (output.startsWith("\n", header.length)) output = output.slice(header.length + 1);
				}
			}
			const thinArchitecture = /(?:^|\r?\n)Non-fat file:[\s\S]* is architecture: ([^\s]+)\s*$/u.exec(output)?.[1];
			if (thinArchitecture !== undefined) return {
				format: "thin",
				declaredArchitectureCount: null,
				hiddenArchitectureCount: null,
				architectures: [{
					...architectureSchema.parse({
						name: thinArchitecture,
						hidden: false,
						cpu_type: null,
						cpu_subtype: null,
						cpu_type_code: null,
						cpu_subtype_code: null,
						cpu_subtype_base: null,
						capabilities: null,
						file_offset: null,
						size: null,
						alignment: null
					}),
					fields: {
						offset: { kind: "absent" },
						size: { kind: "absent" },
						align: { kind: "absent" }
					},
					limitations: []
				}]
			};
			const architectures = [];
			let declaredArchitectureCount = null;
			let hiddenArchitectureCount = null;
			let current;
			let observations = {};
			let retainedFieldBytes = 0;
			const admitFieldBytes = (bytes) => {
				retainedFieldBytes += bytes;
				if (retainedFieldBytes > 67108864) throw new LipoFieldRetentionError(retainedFieldBytes);
			};
			const flush = () => {
				if (current === undefined) return;
				const name = current.architecture ?? current["Non-fat file"];
				if (name !== undefined) {
					const observe = (key) => {
						const observed = observations[key];
						if (observed === undefined) return { kind: "absent" };
						const sourceLines = observed.map(({ sourceLine }) => sourceLine);
						const value = observed[0]?.value;
						return value === null || value === undefined || observed.some((candidate) => candidate.value !== value) ? {
							kind: "uninterpretable",
							sourceLines
						} : {
							kind: "parsed",
							sourceLines,
							value
						};
					};
					const fields = {
						offset: observe("offset"),
						size: observe("size"),
						align: observe("align")
					};
					const value = (field) => field.kind === "parsed" ? field.value : null;
					const limitations = Object.entries(fields).flatMap(([field, observation]) => {
						if (observation.kind !== "uninterpretable") return [];
						admitFieldBytes(name.length * 14 + 256);
						return [`lipo ${field} for ${name} could not be interpreted; ${observation.sourceLines.length === 1 ? "source line: " : "source lines:\n"}${observation.sourceLines.join("\n")}`];
					});
					architectures.push({
						...architectureSchema.parse({
							name: name.includes(" is architecture: ") ? name.split(" is architecture: ").at(-1) ?? name : name.replace(/ \(hidden\)$/u, ""),
							hidden: name.endsWith(" (hidden)"),
							cpu_type: current.cputype ?? null,
							cpu_subtype: current.cpusubtype ?? null,
							cpu_type_code: cpuTypeCode(current.cputype),
							cpu_subtype_code: cpuSubtypeCode(current.cpusubtype, current.capabilities),
							cpu_subtype_base: cpuSubtypeBase(current.cpusubtype),
							capabilities: current.capabilities ?? null,
							file_offset: value(fields.offset),
							size: value(fields.size),
							alignment: value(fields.align)
						}),
						fields,
						limitations
					});
				}
				current = undefined;
				observations = {};
			};
			for (const rawLine of output.split(/\r?\n/u)) {
				const line = rawLine.trim();
				const count = /^nfat_arch\s+(\d+)(?:\s+\(\+(\d+) hidden\))?$/u.exec(line);
				if (count?.[1] !== undefined) {
					declaredArchitectureCount = integer(count[1]);
					hiddenArchitectureCount = integer(count[2] ?? "0");
					continue;
				}
				if (line.startsWith("Non-fat file:")) {
					flush();
					current = { "Non-fat file": line };
					continue;
				}
				if (line.startsWith("architecture ")) {
					flush();
					current = { architecture: line.slice("architecture ".length).trim() };
					continue;
				}
				const numericField = /^\s*(offset|size|align)(?:\s+(.*))?$/u.exec(rawLine);
				if (numericField?.[1] === "offset" || numericField?.[1] === "size" || numericField?.[1] === "align") {
					current ??= {};
					const field = numericField[1];
					admitFieldBytes(rawLine.length * 18 + 128);
					const sourceValue = (numericField[2] ?? "").trim();
					const observed = {
						sourceLine: rawLine,
						value: field === "align" ? alignment(sourceValue) : integer(sourceValue)
					};
					(observations[field] ??= []).push(observed);
					continue;
				}
				const match = /^(cputype|cpusubtype|capabilities)\s+(.+)$/u.exec(line);
				if (match?.[1] !== undefined && match[2] !== undefined) {
					current ??= {};
					current[match[1]] = match[2].trim();
				}
			}
			flush();
			if (architectures.length === 0) throw new TypeError("lipo output contained no architectures");
			return {
				format: "fat",
				declaredArchitectureCount,
				hiddenArchitectureCount,
				architectures
			};
		};
		parseLipoOutputResult = (output, operandPath) => {
			try {
				return ok(parseLipoOutput(output, operandPath));
			} catch (cause) {
				if (!(cause instanceof TypeError) && !(cause instanceof z.ZodError) && !(cause instanceof LipoFieldRetentionError)) throw cause;
				return err(cause);
			}
		};
		parseLipoCapture = (capture, operation, operandPath) => {
			const parsed = parseLipoOutputResult(capture.stdout, operandPath);
			if (parsed.ok) return parsed;
			const capturedOutput = {
				stdout: capture.stdout,
				stderr: capture.stderr,
				truncated: false,
				stdout_bytes: capture.stdoutBytes,
				stderr_bytes: capture.stderrBytes,
				exit_code: capture.exitCode,
				signal: capture.signal
			};
			if (parsed.error instanceof LipoFieldRetentionError) return err(new AnalysisResourceConstraintError(operation, "memory", parsed.error.message, {
				maximum_retained_bytes: NATIVE_COMMAND_OUTPUT_BUDGET_BYTES,
				required_retained_bytes: parsed.error.requiredBytes
			}, {
				cause: parsed.error,
				retryable: false,
				capturedOutput
			}));
			return err(new AnalysisOutputError(operation, "lipo did not produce readable architecture records", {
				cause: parsed.error,
				capturedOutput
			}));
		};
		integer = (value) => {
			if (value === undefined || !/^\d+$/u.test(value)) return null;
			const parsed = Number.parseInt(value, 10);
			return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
		};
		CPU_TYPES = {
			CPU_TYPE_X86: 7,
			CPU_TYPE_X86_64: 16777223,
			CPU_TYPE_ARM: 12,
			CPU_TYPE_ARM64: 16777228,
			CPU_TYPE_ARM64_32: 33554444,
			CPU_TYPE_POWERPC: 18,
			CPU_TYPE_POWERPC64: 16777234
		};
		CPU_SUBTYPES = {
			CPU_SUBTYPE_X86_ALL: 3,
			CPU_SUBTYPE_X86_64_ALL: 3,
			CPU_SUBTYPE_X86_64_H: 8,
			CPU_SUBTYPE_ARM64_ALL: 0,
			CPU_SUBTYPE_ARM64_V8: 1,
			CPU_SUBTYPE_ARM64E: 2,
			CPU_SUBTYPE_ARM64_32_ALL: 0,
			CPU_SUBTYPE_ARM64_32_V8: 1,
			CPU_SUBTYPE_ARM_V7: 9,
			CPU_SUBTYPE_ARM_V7S: 11,
			CPU_SUBTYPE_ARM_V7K: 12,
			CPU_SUBTYPE_POWERPC_ALL: 0,
			CPU_SUBTYPE_POWERPC_970: 100
		};
		cpuTypeCode = (value) => {
			if (value === undefined) return null;
			const numeric = unsigned32(value);
			return numeric ?? CPU_TYPES[value] ?? null;
		};
		cpuSubtypeCode = (value, capabilities) => {
			if (value === undefined) return null;
			const numeric = unsigned32(value);
			if (numeric !== null) return numeric;
			const subtype = CPU_SUBTYPES[value];
			if (subtype === undefined) return null;
			if (value !== "CPU_SUBTYPE_ARM64E") {
				const bits = capabilityBits(capabilities);
				return bits === null ? null : (bits << 24 | subtype) >>> 0;
			}
			const version = /PTR_AUTH_VERSION\s+USERSPACE\s+(\d+)/u.exec(capabilities ?? "")?.[1];
			if (version === undefined) return null;
			const parsedVersion = Number(version);
			if (!Number.isInteger(parsedVersion) || parsedVersion < 0 || parsedVersion > 15) return null;
			return (2147483648 | parsedVersion << 24 | subtype) >>> 0;
		};
		cpuSubtypeBase = (value) => {
			if (value === undefined) return null;
			const subtype = unsigned32(value) ?? CPU_SUBTYPES[value];
			return subtype === undefined ? null : machoCpuSubtypeBase(subtype);
		};
		capabilityBits = (capabilities) => {
			if (capabilities === "CPU_SUBTYPE_LIB64") return 128;
			const bits = /^0x([\da-f]{1,2})$/iu.exec(capabilities ?? "")?.[1];
			return bits === undefined ? null : Number.parseInt(bits, 16);
		};
		unsigned32 = (value) => {
			if (!/^(?:\d+|0x[\da-f]+)$/iu.test(value)) return null;
			const parsed = Number(value);
			return Number.isInteger(parsed) && parsed >= 0 && parsed <= 4294967295 ? parsed >>> 0 : null;
		};
		alignment = (value) => {
			if (value === undefined) return null;
			const exponent = /^2\^(\d+)(?: \((\d+)\))?$/u.exec(value);
			const powerText = exponent?.[1];
			if (powerText !== undefined) {
				const power = Number.parseInt(powerText, 10);
				if (power > 52) return null;
				const alignment = 2 ** power;
				const reported = exponent?.[2];
				return reported === undefined || integer(reported) === alignment ? alignment : null;
			}
			return integer(value);
		};
	})))();
}

//#endregion
export { hashReadable as A, readMappedCString as C, openRootArtifact as D, init_hashStableRootArtifact as E, init_ArtifactClassificationProbe as F, init_StreamBytes as I, streamChunkToBuffer as L, init_ArtifactHash as M, ARTIFACT_CLASSIFICATION_PREFIX_BYTES as N, releaseRootArtifact as O, createArtifactClassificationProbe as P, mappedFileOffset as S, hashStableRootArtifactHandle as T, createFileMappingIndex as _, NATIVE_COMMAND_OUTPUT_BUDGET_BYTES as a, init_BinaryContainer as b, XcrunCommandRunner as c, resolveXcrunTool as d, BinaryFormatFailure as f, BinaryStringReadLimitFailure as g, BinaryResourceFailure as h, parseLipoOutputResult as i, hashReadableToCompletion as j, abortIfNeeded as k, failureCapture as l, BinaryReader as m, init_lipo as n, NATIVE_FAILURE_DIAGNOSTIC_BYTES as o, BinaryMappingFailure as p, parseLipoCapture as r, NativeCommandFailure as s, LipoFieldRetentionError as t, init_CommandRunner as u, declaredFileRange as v, hashStableRootArtifact as w, isZeroFilledSpan as x, imageFileMappings as y };