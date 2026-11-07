import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ArtifactOperationError, err, init_artifactOperationError, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { ArtifactReaderFailure, NonRegularFileReadError, init_ArtifactReader, init_RegularFile, isSelectedRegularFileError, sameArtifactSourceIdentity, sameRegularFileState } from "./ArtifactReader-DJ9rniiL.js";
import { fixedAllowanceOptions, init_fixedAllowanceRemediation } from "./fixedAllowanceRemediation-Gm2892s1.js";
import { AnalysisAccessDeniedError, AnalysisArtifactChangedError, AnalysisCapabilityUnavailableError, AnalysisError, AnalysisInputError, AnalysisOutputError, AnalysisResourceConstraintError, AnalysisTimeoutError, AnalysisUnsupportedTargetError, init_analysisErrorBase, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { analysisInputErrorFromIssues, artifactExtractionResultSchema, artifactInspectionSources, artifactInventoryResultSchema, artifactTargetSelectedPath, compareUnicodeCodePoints, createArtifactInspection, createEvidence, digestCanonicalValue, dylibResolutionInputSchema, dylibResolutionResultSchema, init_artifactGraph, init_artifactInspection, init_binaryTargetTypes, init_canonicalDigest, init_dyldPaths, init_dylibResolution, init_evidence, init_inputIssueProjection, init_symlinkTarget, init_unicodeCodePointOrder, machoImageSlices, observedSymlinkTarget, resolveTreePath, traceDylibLoading } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { freezeJsonSnapshot, init_immutableJson, init_jsonValue, init_localPath, isPathWithinRoot, jsonValueSchema } from "./jsonValue-DGGrC1lE.js";
import { absoluteCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";
import { buildInterfaceBuilderAnalysis, createPlistNumberProjection, init_interfaceBuilderGraph, init_interfaceBuilderKeyedArchive, init_plistNumbers, interfaceBuilderConnectionFieldNames, interfaceBuilderLimitsSchema, interfaceBuilderRuntimeClassName, isInterfaceBuilderConnectionClass, isSourceLessAppKitAnnotationConnector, isUIKitRuntimeConnectionClass, requireInterfaceBuilderArchive } from "./interfaceBuilderGraph-DT1im95M.js";
import { artifactFilePrimaryFacts, artifactSelectedPathErrno, assertArtifactReadActive, bindArtifactFileCleanup, init_ArtifactFileOperation, mapArtifactFileFailure, withArtifactRegularFile } from "./ArtifactFileOperation-YawaP_UN.js";
import { ARTIFACT_GRAPH_PROVIDER, init_investigationProviders } from "./investigationProviders-Bs5C0Q8b.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-C6Clg7Wy.js";
import { DirectoryArtifactEntryAccessDenied, DirectoryArtifactReader, assertArtifactSelectedSource, init_ArtifactOperationFailure, init_ArtifactSelectedSource, init_DirectoryArtifactReader, resolveArtifactSourcePath, translateArtifactFailure } from "./DevicetreeParser-Bhfj4kUz.js";
import { ProviderCleanupError, init_providerCleanupError } from "./providerCleanupError-7gv3MO0l.js";
import { KeyedArchiveKindError, appleAssetCatalogInputSchema, appleResourceKeyFields, binaryDatePrecisionOverlapLimitation, init_appleAssetCatalog, init_keyedArchive, init_plistValue, keyedArchiveInputSchema, keyedArchiveResultSchema, negativeZeroRealLimitation, nonFiniteRealLimitation, parseAppleAssetCatalogRecords, projectAppleAssetCatalogPage, projectKeyedArchive, projectPlistValue, unknownDateLimitation, unknownScalarLimitation } from "./toolOutputSchemaGroups-B9a_Xj3Z.js";
import { init_runtimeAnalysisSettings, runtimeAsarHeaderAdmission } from "./runtimeAnalysisSettings-DDmP_Pn7.js";
import { init_readFileHandleRange, readFileHandleRange } from "./readFileHandleRange-BmDM59_X.js";
import { createAnalysisExecution, init_AnalysisProvider } from "./AnalysisProvider-DisYDS_H.js";
import { init_StableArtifactFailure, init_readStableArtifact, projectStableArtifactFailure, readStableArtifact } from "./StableArtifactFailure-CjYMFXhY.js";
import { ExecFileOutputCancelledError, execFileFailureCapturedOutput, execFileOutput, execFileOutputFailure, init_ExecFileOutput } from "./ExecFileOutput-CjfCq1cQ.js";
import { init_snapshotEnvironment, snapshotEnvironment } from "./snapshotEnvironment-C6Y7aHfj.js";
import { init_readArtifactFileChunks, readArtifactFileChunks } from "./readArtifactFileChunks-wfySSpVr.js";
import { init_StreamBytes, streamChunkToBuffer } from "./StreamBytes-5y_bghjt.js";
import { init_AsarHeader, resolveAsarHeaderAdmission } from "./AsarHeader-CcLQy135.js";
import { hasBinaryPlistSignature, hasNibArchiveSignature, init_appleArchiveFormat } from "./dfuse-Berfn6y4.js";
import { hasMachoMagic, init_machoContainer } from "./machoLoadCommands-B9RyDzRE.js";
import { abortIfNeeded, init_ArtifactHash } from "./ArtifactHash-CV4Xsn55.js";
import { init_MachoLoadCommandReader, readMachoImage } from "./MachoLoadCommandReader-i7E7LXUs.js";
import { UnsupportedBinaryPlistUidError, decodeBinaryPlistValue, decodeXmlPlistText, estimateBinaryPlistExpansion, init_BinaryPlistMaterializer, init_PlistScalars, init_PropertyListDecodeBudget, init_propertyListKeys, init_propertyListXmlText, parseXmlPropertyList, preflightPropertyListDecode, scanBinaryPlistScalars } from "./propertyListKeys-Ur-byZwL.js";
import { ArtifactPathRegistry, init_ArtifactPaths, normalizeArtifactPath } from "./ArtifactPaths-pHh1q13p.js";
import { SafeOutputTree, SafeOutputTreeCreationFailure, SafeOutputTreeDestinationRefusal, init_SafeOutputTree, init_SafeOutputTreeAdmission, init_SafeOutputTreeCreationFailure } from "./SafeOutputTree-C4FfDjZW.js";
import { assertArtifactFileSelectedSource, init_ArtifactFileSource } from "./ZipArtifactReader-BSSIfAtk.js";
import { ARTIFACT_ANALYSIS_OPERATIONS, artifactExtractionExecutionSchema, artifactInventoryInputSchema, init_artifactToolContracts } from "./enhancedToolContracts-CSXJH_He.js";
import { BUNDLE_ARTIFACT_RESOURCE_OPERATIONS, init_BundleResourceSession } from "./BundleResourceSession-BfQUWW9_.js";
import { artifactTargetRefusal, init_artifactTargetApplicability } from "./BinarySessionStatus-CicWy05C.js";
import { ArtifactEmbeddedFormatProbes, ArtifactTraversalObservation, InesArtifactReader, artifactFormatDescriptor, assertAdmittedRootDigest, createArtifactReader, init_ArtifactEmbeddedFormatProbes, init_ArtifactTraversalObservation, init_InesArtifactReader, init_artifactFormats, init_classify, init_createArtifactReader, init_scanCanonical, scanCanonicalArtifactInventoryForExtractionInScope, scanCanonicalArtifactInventoryInScope } from "./scanCanonical-C3gVOiIa.js";
import { hashStableRootArtifactHandle, init_hashStableRootArtifact, openRootArtifact } from "./hashStableRootArtifact-c9zqp67k.js";
import { init_withArtifactTargetIdentity, withArtifactTargetIdentity } from "./withArtifactTargetIdentity-Dm_wv2AN.js";
import { artifactCapabilities, init_ArtifactProviderMetadata } from "./binary-DXe1XUB4.js";
import { basename, dirname, isAbsolute, join, relative, sep } from "node:path";
import { lstat, readlink, realpath } from "node:fs/promises";
import { createHash } from "node:crypto";
import { z } from "zod";
import { TextDecoder } from "node:util";

//#region dist/artifacts/apple/KeyedArchiveReader.js
var MAX_BYTES, MAX_DECODE_BYTES, parseKeyedArchiveInput, decodeKeyedArchiveBytes, keyedArchiveKindRemediation, inspectBundleKeyedArchive, inspectStandaloneKeyedArchive, assertStandaloneArchiveSelection, readSelectedKeyedArchive, decodeSelectedArchive, archivePathError, selectedArchiveReadFailure;
function init_KeyedArchiveReader() {
	return (init_KeyedArchiveReader = __esmMin((() => {
		init_readStableArtifact();
		init_StableArtifactFailure();
		init_investigationProviders();
		init_BinaryPlistMaterializer();
		init_analysisErrorCore();
		init_plistValue();
		init_plistNumbers();
		init_PlistScalars();
		init_propertyListKeys();
		init_keyedArchive();
		init_DirectoryArtifactReader();
		init_ArtifactReader();
		init_ArtifactFileOperation();
		init_ArtifactResourceScope();
		init_analysisErrorBase();
		init_ArtifactOperationFailure();
		init_analysisErrorCleanup();
		init_inputIssueProjection();
		init_propertyListXmlText();
		init_appleArchiveFormat();
		init_PropertyListDecodeBudget();
		MAX_BYTES = 64 * 1024 * 1024;
		MAX_DECODE_BYTES = 8 * MAX_BYTES;
		parseKeyedArchiveInput = (parameters) => {
			const parsed = keyedArchiveInputSchema.safeParse(parameters);
			if (!parsed.success) throw analysisInputErrorFromIssues("inspect_keyed_archive", parsed.error.issues, parameters, { cause: parsed.error });
			return parsed.data;
		};
		decodeKeyedArchiveBytes = (bytes, selection) => {
			if (bytes.length > MAX_BYTES) throw new RangeError("Keyed archive exceeds 64 MiB");
			if (hasNibArchiveSignature(bytes)) throw new KeyedArchiveKindError("Selected file is a compiled NIBArchive, not a Foundation plist archive; decode it with decode_interface_builder", "nib-archive");
			const binary = hasBinaryPlistSignature(bytes);
			const xmlText = binary ? undefined : decodeXmlPlistText(bytes);
			const binaryExpansion = binary ? estimateBinaryPlistExpansion(bytes, MAX_DECODE_BYTES, {
				budget: "the keyed archive decode budget",
				fail: (kind, message) => kind === "cycle" ? new TypeError("binary plist object references form a cycle, which a property list cannot represent") : new RangeError(message),
				bounds: "decoder",
				numberProjection: true,
				uidProjection: true
			}) : undefined;
			const binaryScalarMetadata = binary ? scanBinaryPlistScalars(bytes, binaryExpansion) : undefined;
			const parsed = binaryExpansion !== undefined ? {
				value: decodeBinaryPlistValue(bytes, binaryExpansion, binaryScalarMetadata),
				numberLiterals: binaryScalarMetadata.literals
			} : parseXmlPropertyList(xmlText ?? "");
			const { nonFiniteRealCount, negativeZeroRealCount, unknownDateCount, unknownScalarCount, ...graph } = projectKeyedArchive(parsed.value, selection);
			const numbers = createPlistNumberProjection(parsed.numberLiterals);
			const roots = Object.fromEntries(Object.entries(graph.roots).map(([name, value]) => [name, numbers.project(value)]));
			const objects = graph.objects.map((object) => ({
				...object,
				value: numbers.project(object.value)
			}));
			return {
				archive_format: binary ? "binary-plist" : "xml-plist",
				...graph,
				roots,
				objects,
				limitations: [
					...graph.limitations,
					...numbers.limitations(),
					...nonFiniteRealCount === 0 ? [] : [nonFiniteRealLimitation(nonFiniteRealCount)],
					...negativeZeroRealCount === 0 ? [] : [negativeZeroRealLimitation(negativeZeroRealCount)],
					...unknownDateCount === 0 ? [] : [unknownDateLimitation(unknownDateCount)],
					...binaryExpansion === undefined || binaryExpansion.datePrecisionOverlapCount === 0 ? [] : [binaryDatePrecisionOverlapLimitation(binaryExpansion.datePrecisionOverlapCount)],
					...unknownScalarCount === 0 ? [] : [unknownScalarLimitation(unknownScalarCount)]
				]
			};
		};
		keyedArchiveKindRemediation = (kind, platform) => {
			if (kind === "nib-archive") return "Decode compiled NIBArchive files with decode_interface_builder on the app bundle.";
			return platform === "darwin" ? "Inspect an ordinary property list with inspect_plist; inspect_keyed_archive decodes NSKeyedArchiver archives only." : "Select an NSKeyedArchiver archive; inspect_keyed_archive decodes only those. inspect_plist, which reads ordinary property lists, requires a macOS host.";
		};
		inspectBundleKeyedArchive = (input) => {
			const resources = input.resources ?? new ArtifactResourceScope();
			return resources.run(async () => {
				const reader = new DirectoryArtifactReader(input.bundlePath);
				let outcome;
				try {
					outcome = {
						kind: "completed",
						value: await readSelectedKeyedArchive(input, reader)
					};
				} catch (cause) {
					outcome = {
						kind: "failed",
						cause
					};
				}
				const released = await resources.release({
					kind: "reader",
					reader,
					resource: input.bundlePath
				});
				if (released.kind === "failed") {
					if (outcome.kind === "failed" && outcome.cause instanceof AnalysisError) {
						const cleanup = translateArtifactFailure("inspect_keyed_archive", resources.cleanupFailure({ kind: "completed" }, [released]));
						throw analysisErrorWithCleanupFailure(outcome.cause, cleanup, "inspect_keyed_archive").bindCleanupDependencies([outcome.cause, cleanup]);
					}
					throw resources.cleanupFailure(outcome, [released]);
				}
				if (outcome.kind === "failed") throw outcome.cause;
				return outcome.value;
			});
		};
		inspectStandaloneKeyedArchive = (input) => input.resources.run(async () => {
			const selected = parseKeyedArchiveInput(input.parameters);
			const selectedBasename = basename(input.selectedPath);
			const physicalBasename = basename(input.path);
			const basenames = [...new Set([selectedBasename, physicalBasename])];
			if (selected.path !== "." && !basenames.includes(selected.path)) throw new AnalysisInputError("inspect_keyed_archive", undefined, [{
				path: ["path"],
				reason: "invalid_value",
				message: "For an active plist, path must select that archive (omit path or use its basename).",
				expected: basenames.length === 1 ? selectedBasename : basenames
			}]);
			await assertStandaloneArchiveSelection(input.path, input.selectedPath, input.signal);
			const snapshot = await readStableArtifact(input.path, MAX_BYTES, input.signal, undefined, input.resources).catch((cause) => {
				const failure = artifactFilePrimaryFacts(cause).cause;
				if (failure instanceof Error && "code" in failure && (failure.code === "EACCES" || failure.code === "EPERM")) throw projectStableArtifactFailure(cause, new AnalysisAccessDeniedError("inspect_keyed_archive", input.selectedPath, failure.code, { cause: failure }), input.selectedPath, ARTIFACT_GRAPH_PROVIDER.id, "inspect_keyed_archive");
				throw cause;
			});
			await assertStandaloneArchiveSelection(input.path, input.selectedPath, input.signal);
			if (snapshot.sha256 !== input.targetSha256) throw new ArtifactReaderFailure("integrity", `Active archive digest changed: expected ${input.targetSha256}, observed ${snapshot.sha256}`);
			return decodeSelectedArchive(snapshot.bytes, {
				targetSha256: input.targetSha256,
				archiveSha256: snapshot.sha256,
				parameters: selected,
				platform: input.platform,
				archivePath: selected.path === "." ? selectedBasename : selected.path,
				artifactPath: input.selectedPath
			});
		});
		assertStandaloneArchiveSelection = async (path, selectedPath, signal) => {
			assertArtifactReadActive(signal);
			const changed = (cause) => new AnalysisArtifactChangedError("inspect_keyed_archive", selectedPath, "Selected archive no longer resolves to the admitted file.", { cause });
			let current;
			try {
				current = await realpath(selectedPath);
			} catch (cause) {
				if (artifactSelectedPathErrno(cause) !== undefined) throw changed(cause);
				if (cause instanceof Error && "code" in cause && (cause.code === "EACCES" || cause.code === "EPERM")) throw new AnalysisAccessDeniedError("inspect_keyed_archive", selectedPath, cause.code, { cause });
				throw cause;
			}
			assertArtifactReadActive(signal);
			if (current !== path) throw changed();
		};
		readSelectedKeyedArchive = async (input, reader) => {
			const selected = parseKeyedArchiveInput(input.parameters);
			if (selected.path.startsWith("/") || selected.path.split("/").some((part) => part === ".." || part === "." || part.length === 0)) throw archivePathError("invalid_format", selected.path === "." ? "Select a keyed archive path relative to the active app bundle." : `Archive path must be a canonical relative bundle path without empty, '.', or '..' segments: ${selected.path}`);
			const wanted = selected.path.normalize("NFC");
			let entry;
			for await (const candidate of reader.entries(input.signal, (directory) => wanted.startsWith(`${directory.normalize("NFC")}/`))) {
				if (candidate.path.normalize("NFC") !== wanted) continue;
				if (candidate.kind !== "file") throw archivePathError("invalid_value", `Archive path selects a ${candidate.kind}, not a regular file: ${selected.path}`);
				if ((candidate.declaredSize ?? 0) > MAX_BYTES) throw new ArtifactReaderFailure("limit", "Keyed archive exceeds 64 MiB");
				if (entry !== undefined) throw archivePathError("invalid_value", `Archive path matches multiple Unicode-equivalent bundle entries; selection is ambiguous: ${selected.path}`);
				entry = candidate;
			}
			if (entry === undefined) throw archivePathError("invalid_value", `No regular file exists at ${selected.path} in the active app bundle.`);
			const stream = await reader.open(entry, input.signal).catch((cause) => {
				throw selectedArchiveReadFailure(input.bundlePath, entry, cause);
			});
			const chunks = [];
			let size = 0;
			for await (const chunk of stream) {
				if (input.signal?.aborted) {
					stream.destroy();
					throw new ArtifactReaderFailure("cancelled", "Archive inspection cancelled", { cause: input.signal.reason });
				}
				const bytes = z.instanceof(Buffer).parse(chunk);
				size += bytes.length;
				if (size > MAX_BYTES) {
					stream.destroy();
					throw new ArtifactReaderFailure("limit", "Keyed archive exceeds 64 MiB");
				}
				chunks.push(bytes);
			}
			const bytes = Buffer.concat(chunks, size);
			return decodeSelectedArchive(bytes, {
				targetSha256: input.targetSha256,
				archiveSha256: createHash("sha256").update(bytes).digest("hex"),
				resourceRoot: input.resourceRoot,
				parameters: selected,
				platform: input.platform,
				archivePath: entry.path,
				artifactPath: join(input.bundlePath, entry.path)
			});
		};
		decodeSelectedArchive = (bytes, input) => {
			try {
				return keyedArchiveResultSchema.parse({
					target_sha256: input.targetSha256,
					...input.resourceRoot === undefined ? {} : { resource_root: input.resourceRoot },
					archive_path: input.archivePath,
					archive_sha256: input.archiveSha256,
					...decodeKeyedArchiveBytes(bytes, input.parameters)
				});
			} catch (cause) {
				if (cause instanceof AnalysisInputError) throw cause;
				if (cause instanceof UnsupportedBinaryPlistUidError) throw new AnalysisUnsupportedTargetError("inspect_keyed_archive", input.artifactPath, cause.message, { cause });
				if (cause instanceof KeyedArchiveKindError) throw new AnalysisUnsupportedTargetError("inspect_keyed_archive", input.artifactPath, cause.message, {
					cause,
					remediationAction: keyedArchiveKindRemediation(cause.kind, input.platform ?? process.platform)
				});
				throw new ArtifactReaderFailure(cause instanceof RangeError ? "limit" : "format", `Cannot decode selected Foundation keyed archive: ${cause instanceof Error ? cause.message : String(cause)}`, { cause });
			}
		};
		archivePathError = (reason, message) => new AnalysisInputError("inspect_keyed_archive", undefined, [{
			path: ["path"],
			reason,
			message
		}]);
		selectedArchiveReadFailure = (bundlePath, entry, cause) => {
			if (!(cause instanceof DirectoryArtifactEntryAccessDenied)) return cause;
			const error = new AnalysisAccessDeniedError("inspect_keyed_archive", join(bundlePath, entry.path), cause.systemCode, {
				cause,
				...cause.cleanup === undefined ? {} : { cleanup: cause.cleanup },
				...cause.partialObservation === undefined ? {} : { partialObservation: cause.partialObservation }
			});
			bindArtifactFileCleanup(cause, error);
			return error;
		};
	})))();
}

//#endregion
//#region dist/artifacts/OrderedReads.js
var consumeWithOrderedReads;
function init_OrderedReads() {
	return (init_OrderedReads = __esmMin((() => {
		consumeWithOrderedReads = async (items, width, read, consume) => {
			const pending = [];
			const consumeNext = async () => {
				const next = pending.shift();
				if (next === undefined) return;
				const result = await next.result;
				if (!result.ok) throw result.error;
				await consume(next.item, result.value);
			};
			const iterator = items[Symbol.asyncIterator]();
			let iterating = true;
			try {
				while (iterating) {
					let step;
					try {
						step = await iterator.next();
					} catch (cause) {
						iterating = false;
						while (pending.length > 0) await consumeNext();
						throw cause;
					}
					if (step.done === true) {
						iterating = false;
						break;
					}
					const started = read(step.value);
					if (started === undefined) continue;
					pending.push({
						item: step.value,
						result: started.then((value) => ({
							ok: true,
							value
						}), (error) => ({
							ok: false,
							error
						}))
					});
					if (pending.length >= width) await consumeNext();
				}
				while (pending.length > 0) await consumeNext();
			} finally {
				if (iterating) await iterator.return?.().catch(() => undefined);
				await Promise.all(pending.map(({ result }) => result));
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/DylibFileAccess.js
var DylibFileAccess, classifyDylibReadFailure, deniedDisplayPath, changed;
function init_DylibFileAccess() {
	return (init_DylibFileAccess = __esmMin((() => {
		init_RegularFile();
		init_ArtifactReader();
		init_ArtifactFileOperation();
		init_readArtifactFileChunks();
		init_machoContainer();
		init_MachoLoadCommandReader();
		init_readFileHandleRange();
		DylibFileAccess = class {
			resources;
			root;
			signal;
			constructor(resources, root, signal) {
				this.resources = resources;
				this.root = root;
				this.signal = signal;
			}
			startsWithMachoMagic(entry) {
				return this.#read(entry.adapterKey, async (file, initial) => {
					if (!sameArtifactSourceIdentity(entry.sourceIdentity, initial)) throw changed(entry.adapterKey);
					const bytes = await readFileHandleRange(file, 0, 4, () => assertArtifactReadActive(this.signal));
					assertArtifactReadActive(this.signal);
					return hasMachoMagic(bytes);
				});
			}
			image(path) {
				return this.#read(path, async (file, identity) => {
					const size = Number(identity.size);
					if (!Number.isSafeInteger(size)) throw new ArtifactReaderFailure("limit", `Mach-O file extent is not safely addressable: ${path}`);
					const facts = await readMachoImage(async (offset, length) => {
						const bytes = await readFileHandleRange(file, offset, Math.max(0, Math.min(length, size - offset)), () => assertArtifactReadActive(this.signal));
						assertArtifactReadActive(this.signal);
						return bytes;
					}, size);
					return {
						facts,
						identity
					};
				});
			}
			sha256(path, expected) {
				return this.#read(path, async (file, initial) => {
					if (expected !== undefined && !sameRegularFileState(expected, initial)) throw changed(path);
					const hash = createHash("sha256");
					const source = readArtifactFileChunks(file, {
						end: initial.size,
						signal: this.signal
					});
					for await (const chunk of source) hash.update(chunk);
					const coverage = source.readCoverage();
					if (coverage.kind !== "complete" || coverage.bytes !== initial.size) throw changed(path);
					return hash.digest("hex");
				});
			}
			async #read(path, operation) {
				try {
					return await withArtifactRegularFile(path, this.resources, this.signal, async ({ handle: file }) => {
						const initial = await file.stat({ bigint: true });
						assertArtifactReadActive(this.signal);
						const result = await operation(file, initial);
						const opened = await file.stat({ bigint: true });
						let named;
						try {
							named = await lstat(path, { bigint: true });
						} catch (cause) {
							if (!isSelectedRegularFileError(cause)) throw cause;
							throw changed(path, cause);
						}
						if (!sameRegularFileState(initial, opened) || !sameRegularFileState(initial, named)) throw changed(path);
						assertArtifactReadActive(this.signal);
						return result;
					});
				} catch (cause) {
					throw classifyDylibReadFailure(this.root, cause);
				}
			}
		};
		classifyDylibReadFailure = (root, cause) => mapArtifactFileFailure(cause, (primary) => {
			if (primary instanceof NonRegularFileReadError) return new ArtifactReaderFailure("format", `Dyld input is not a regular file: ${primary.path}`, { cause: primary });
			if (primary instanceof Error && "code" in primary && (primary.code === "EACCES" || primary.code === "EPERM")) {
				const path = "path" in primary && typeof primary.path === "string" ? primary.path : undefined;
				const display = path === undefined ? "a file in the analyzed root" : deniedDisplayPath(root, path);
				return new ArtifactReaderFailure("unavailable", `Permission denied (${primary.code}) reading ${display}`, { cause: primary });
			}
			return primary;
		});
		deniedDisplayPath = (root, path) => {
			const inside = relative(root, path);
			const outside = isAbsolute(inside) || inside === ".." || inside.startsWith(`..${sep}`);
			return inside === "" || outside ? path : inside;
		};
		changed = (path, cause) => new ArtifactReaderFailure("integrity", `${path} changed while its dyld load commands were traced`, cause === undefined ? undefined : { cause });
	})))();
}

//#endregion
//#region dist/artifacts/apple/DylibResolutionReader.js
var OPERATION, WINDOWS, MAGIC_READ_CONCURRENCY, FilesystemTreeView, traceDylibResolution, executableRoots, compare, requireMachoRoots, missing;
function init_DylibResolutionReader() {
	return (init_DylibResolutionReader = __esmMin((() => {
		init_analysisErrorCore();
		init_dyldPaths();
		init_symlinkTarget();
		init_dylibResolution();
		init_inputIssueProjection();
		init_ArtifactReader();
		init_ArtifactTraversalObservation();
		init_DirectoryArtifactReader();
		init_OrderedReads();
		init_DylibFileAccess();
		init_ArtifactResourceScope();
		init_ArtifactFileOperation();
		OPERATION = "trace_dylib_resolution";
		WINDOWS = process.platform === "win32";
		MAGIC_READ_CONCURRENCY = 8;
		FilesystemTreeView = class {
			root;
			sourceRoot;
			files;
			signal;
			#entries = new Map();
			#images = new Map();
			#identities = new Map();
			constructor(root, sourceRoot, files, signal) {
				this.root = root;
				this.sourceRoot = sourceRoot;
				this.files = files;
				this.signal = signal;
			}
			rootRelativePath(absolutePath) {
				const roots = isAbsolute(this.sourceRoot) ? [this.root, this.sourceRoot] : [this.root];
				for (let root of roots) {
					while (root.length > 1 && root.endsWith(sep)) root = root.slice(0, -1);
					if (absolutePath === root) return "";
					const prefix = root === sep ? sep : `${root}${sep}`;
					if (absolutePath.startsWith(prefix)) return absolutePath.slice(prefix.length).split(sep).join("/");
				}
				return undefined;
			}
			entry(path) {
				const cached = this.#entries.get(path);
				if (cached !== undefined) return cached;
				const pending = this.#readEntry(path);
				this.#entries.set(path, pending);
				return pending;
			}
			image(path) {
				const cached = this.#images.get(path);
				if (cached !== undefined) return cached;
				const pending = this.#readImage(path);
				this.#images.set(path, pending);
				return pending;
			}
			/** Identity of the file whose header bytes `image()` parsed. */
			identity(path) {
				return this.#identities.get(path);
			}
			/**
			* Host path of a root-relative dyld path. The resolver passes only plain
			* components, so a path that lands outside the root is a reader defect and
			* is refused before any file is opened.
			*/
			hostPath(path) {
				const absolute = join(this.root, path);
				const inside = relative(this.root, absolute);
				if (inside === ".." || inside.startsWith(`..${sep}`) || isAbsolute(inside)) throw new ArtifactReaderFailure("path", `${path} maps outside the analyzed root`);
				return absolute;
			}
			async #readImage(path) {
				const { facts, identity } = await this.files.image(this.hostPath(path));
				this.#identities.set(path, identity);
				return facts;
			}
			async #readEntry(path) {
				assertArtifactReadActive(this.signal);
				if (WINDOWS && /[\\:]/u.test(path)) return undefined;
				const absolute = this.hostPath(path);
				try {
					const metadata = await lstat(absolute);
					if (metadata.isSymbolicLink()) {
						const observed = observedSymlinkTarget(await readlink(absolute, { encoding: "buffer" }));
						if (observed.text === null) return {
							kind: "symlink",
							target: null,
							targetHex: observed.hex
						};
						const target = observed.text;
						return {
							kind: "symlink",
							target: WINDOWS ? target.replaceAll("\\", "/") : target
						};
					}
					if (metadata.isDirectory()) return { kind: "directory" };
					return metadata.isFile() ? { kind: "file" } : undefined;
				} catch (cause) {
					if (missing(cause)) return undefined;
					throw cause;
				}
			}
		};
		traceDylibResolution = async (options) => {
			const parsed = dylibResolutionInputSchema.safeParse(options.parameters);
			if (!parsed.success) throw analysisInputErrorFromIssues(OPERATION, parsed.error.issues, options.parameters, { cause: parsed.error });
			const resources = options.resourceScope ?? new ArtifactResourceScope();
			return await resources.run(async () => {
				let root = options.rootPath;
				try {
					assertArtifactReadActive(options.signal);
					root = await realpath(options.rootPath);
					assertArtifactReadActive(options.signal);
					const files = new DylibFileAccess(resources, root, options.signal);
					const target = relative(root, await realpath(options.targetPath)).split(sep).join("/");
					assertArtifactReadActive(options.signal);
					const view = new FilesystemTreeView(root, options.rootPath, files, options.signal);
					const { roots: requested, unclassified, traversal } = parsed.data.roots !== undefined ? {
						roots: parsed.data.roots,
						unclassified: [],
						traversal: undefined
					} : options.enumerateRoots ? await executableRoots(root, view, files, resources, options.signal) : {
						roots: [target],
						unclassified: [],
						traversal: undefined
					};
					const roots = await requireMachoRoots(view, requested, parsed.data.roots !== undefined);
					const trace = await traceDylibLoading(view, {
						roots,
						unclassified,
						...traversal === undefined ? {} : { rootEnumeration: traversal },
						...parsed.data.architecture === undefined ? {} : { architecture: parsed.data.architecture },
						...options.signal === undefined ? {} : { signal: options.signal }
					});
					const digests = new Map();
					for (const { path } of trace.images) digests.set(path, await files.sha256(view.hostPath(path), view.identity(path)));
					const targetDigest = digests.get(target) ?? await files.sha256(join(root, target), undefined);
					if (targetDigest !== options.targetSha256) throw new ArtifactReaderFailure("integrity", `Active target digest changed: expected ${options.targetSha256}, observed ${targetDigest}`);
					assertArtifactReadActive(options.signal);
					return dylibResolutionResultSchema.parse({
						...trace,
						root_path: options.rootPath,
						target_sha256: options.targetSha256,
						images: trace.images.map((image) => ({
							...image,
							sha256: digests.get(image.path)
						}))
					});
				} catch (cause) {
					throw classifyDylibReadFailure(root, cause);
				}
			});
		};
		executableRoots = async (root, view, files, resources, signal) => {
			const roots = [];
			const unclassified = [];
			const traversal = new ArtifactTraversalObservation();
			let symlinks = 0;
			let firstSymlink;
			const reader = new DirectoryArtifactReader(root);
			let outcome = { kind: "completed" };
			try {
				await consumeWithOrderedReads(reader.entries(signal, traversal), MAGIC_READ_CONCURRENCY, (entry) => {
					if (entry.kind === "symlink") {
						symlinks += 1;
						firstSymlink ??= entry.path;
					}
					return entry.kind === "file" ? files.startsWithMachoMagic(entry) : undefined;
				}, async (entry, macho) => {
					if (!macho) return;
					const facts = await view.image(entry.path);
					if (facts.status === "malformed" || facts.status === "unsupported") unclassified.push(entry.path);
					else if (facts.status === "parsed" && machoImageSlices(facts).some(({ file_type: type }) => type === "execute")) roots.push(entry.path);
				});
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			const released = await resources.release({
				kind: "reader",
				reader,
				resource: `executable-root reader for ${root}`
			});
			if (released.kind === "failed") throw resources.cleanupFailure(outcome, [released]);
			if (outcome.kind === "failed") throw outcome.cause;
			assertArtifactReadActive(signal);
			if (symlinks > 0) traversal.onCoverage({
				status: "unknown",
				limitations: [`Executable-root discovery did not follow ${symlinks} symlink(s); their root roles and possible descendants are unknown. First path: ${JSON.stringify(firstSymlink)}.`]
			});
			return {
				roots: roots.sort(compare),
				unclassified: unclassified.sort(compare),
				traversal: traversal.snapshot()
			};
		};
		compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
		requireMachoRoots = async (view, roots, callerSelected) => {
			const resolved = [];
			for (const [index, path] of roots.entries()) {
				const reject = (reason, message) => callerSelected ? new AnalysisInputError(OPERATION, undefined, [{
					path: ["roots", index],
					reason: "invalid_value",
					message
				}]) : new ArtifactReaderFailure(reason, message);
				const lookup = await resolveTreePath(view, path);
				if (lookup.kind === "escapes") throw reject("path", `Root ${path} resolves outside the analyzed root`);
				if (lookup.kind === "undetermined") throw reject("path", `Root ${path} crosses symlink ${lookup.path} with non-UTF-8 target bytes ${lookup.targetHex}`);
				if (lookup.kind !== "file") throw reject("path", `Root ${path} is not a regular file in the analyzed root`);
				if ((await view.image(lookup.path)).status === "not-mach-o") throw reject("format", `Root ${path} is not a Mach-O image`);
				if (!resolved.includes(lookup.path)) resolved.push(lookup.path);
			}
			return resolved;
		};
		missing = (cause) => cause instanceof Error && "code" in cause && (cause.code === "ENOENT" || cause.code === "ENOTDIR");
	})))();
}

//#endregion
//#region dist/artifacts/inventory/ArtifactInventory.js
var inventoryArtifact, scanArtifactInventoryInScope, scanArtifactInventoryForExtractionInScope;
function init_ArtifactInventory() {
	return (init_ArtifactInventory = __esmMin((() => {
		init_callerPath();
		init_ArtifactSelectedSource();
		init_artifactGraph();
		init_ArtifactHash();
		init_scanCanonical();
		inventoryArtifact = async (inputPath, options) => {
			const snapshot = await options.resourceScope.run(() => scanArtifactInventoryInScope(inputPath, options));
			return artifactInventoryResultSchema.parse(snapshot);
		};
		scanArtifactInventoryInScope = async (inputPath, options) => {
			abortIfNeeded(options.signal);
			const path = await resolveArtifactSourcePath(inputPath);
			return scanCanonicalArtifactInventoryInScope(path, options, undefined, absoluteCallerPath(options.selectedPath ?? inputPath));
		};
		scanArtifactInventoryForExtractionInScope = async (inputPath, options, probeFacts) => {
			abortIfNeeded(options.signal);
			const path = await resolveArtifactSourcePath(inputPath);
			return scanCanonicalArtifactInventoryForExtractionInScope(path, options, probeFacts, absoluteCallerPath(options.selectedPath ?? inputPath));
		};
	})))();
}

//#endregion
//#region dist/artifacts/extraction/ArtifactExtraction.js
var extractArtifact, extractArtifactInScope, releaseTransferredArtifactSource, materializeArtifactInventoryInScope, materializeSelection, writeSelectedEntries, releaseExtractionOwners, createExtractionResult, requireExtractableFormat, createReader, preflight, inventorySourceChanged;
function init_ArtifactExtraction() {
	return (init_ArtifactExtraction = __esmMin((() => {
		init_classify();
		init_ArtifactFileSource();
		init_ArtifactSelectedSource();
		init_InesArtifactReader();
		init_hashStableRootArtifact();
		init_callerPath();
		init_artifactFormats();
		init_createArtifactReader();
		init_AsarHeader();
		init_ArtifactEmbeddedFormatProbes();
		init_ArtifactFileOperation();
		init_localPath();
		init_SafeOutputTreeAdmission();
		init_unicodeCodePointOrder();
		init_canonicalDigest();
		init_ArtifactPaths();
		init_ArtifactReader();
		init_ArtifactTraversalObservation();
		init_ArtifactHash();
		init_SafeOutputTree();
		init_SafeOutputTreeCreationFailure();
		init_artifactGraph();
		init_analysisErrorCore();
		init_ArtifactInventory();
		extractArtifact = async (input, signal) => input.resourceScope.run(() => extractArtifactInScope(input, signal));
		extractArtifactInScope = async (input, signal) => {
			abortIfNeeded(signal);
			const sourcePath = await resolveArtifactSourcePath(input.inputPath);
			if (input.expectedRootSha256 !== undefined) await assertArtifactSelectedSource(sourcePath, input.selectedPath);
			const probeFacts = await requireExtractableFormat(sourcePath, input, signal);
			const { snapshot, transferredSource } = await scanArtifactInventoryForExtractionInScope(input.inputPath, {
				resourceScope: input.resourceScope,
				selectedPath: input.selectedPath,
				expectedRootSha256: input.expectedRootSha256,
				signal,
				environment: input.environment,
				asarHeaderAdmission: input.asarHeaderAdmission ?? resolveAsarHeaderAdmission(input.environment),
				espFlashSelection: input.espFlashSelection,
				integrity: input.integrityPolicy
			}, probeFacts);
			const activeSource = transferredSource === undefined ? undefined : {
				...transferredSource,
				releaseAttempted: false
			};
			try {
				return await materializeArtifactInventoryInScope(input, sourcePath, snapshot, signal, activeSource);
			} catch (cause) {
				if (activeSource !== undefined && cause instanceof ArtifactReaderFailure) cause.retainPartialObservation({
					kind: "artifact-inventory",
					inventory: snapshot
				});
				const attempt = await releaseTransferredArtifactSource(input.resourceScope, activeSource);
				if (attempt?.kind === "failed") throw input.resourceScope.cleanupFailure({
					kind: "failed",
					cause
				}, [attempt], {
					kind: "artifact-inventory",
					inventory: snapshot
				});
				throw cause;
			}
		};
		releaseTransferredArtifactSource = async (resourceScope, transferredSource) => {
			if (transferredSource === undefined || transferredSource.releaseAttempted) return undefined;
			transferredSource.releaseAttempted = true;
			return resourceScope.release(transferredSource.owner);
		};
		materializeArtifactInventoryInScope = async (input, sourcePath, snapshot, signal, transferredSource) => {
			abortIfNeeded(signal);
			if (transferredSource === undefined) {
				let canonicalSource;
				try {
					canonicalSource = await realpath(sourcePath);
				} catch (cause) {
					abortIfNeeded(signal);
					if (inventorySourceChanged(cause)) throw new ArtifactReaderFailure("integrity", `Inventoried source changed: ${sourcePath}`, { cause });
					throw cause;
				}
				if ((await lstat(canonicalSource)).isDirectory()) {
					const { canonicalOutput } = await SafeOutputTree.resolveDestination(input.outputRoot);
					const parent = dirname(canonicalOutput);
					if (isPathWithinRoot(canonicalSource, parent)) throw new SafeOutputTreeDestinationRefusal(`Extraction output parent ${parent} is inside source directory ${canonicalSource}. Choose a temporary directory outside the source.`);
				}
			}
			abortIfNeeded(signal);
			const containerMetadata = snapshot.occurrences.find((row) => row.logical_path === ".")?.format_metadata;
			if (containerMetadata?.kind === "godot-pck" && containerMetadata.directory_status !== "available") throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `Godot PCK directory is ${containerMetadata.directory_status}; its complete contents cannot be extracted`);
			if (containerMetadata?.kind === "unityfs" && containerMetadata.directory_status !== "available") throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `UnityFS directory is ${containerMetadata.directory_status}; its complete contents cannot be extracted`);
			if (containerMetadata?.kind === "wxapkg" && containerMetadata.directory_status !== "available") throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `wxapkg directory is ${containerMetadata.directory_status}; its complete contents cannot be extracted`);
			const selectedOccurrences = snapshot.occurrences.filter((occurrence) => (occurrence.entry_kind === "file" || occurrence.entry_kind === "slice") && occurrence.logical_path !== ".");
			const regularPaths = new Set(selectedOccurrences.map(({ logical_path: path }) => path));
			const directoryPaths = new Set(snapshot.occurrences.filter(({ entry_kind }) => entry_kind === "directory").map(({ logical_path }) => logical_path));
			const activeOccurrences = selectedOccurrences.filter(({ logical_path }) => {
				let path = logical_path;
				for (let slash = path.lastIndexOf("/"); slash >= 0; slash = path.lastIndexOf("/")) {
					path = path.slice(0, slash);
					if (regularPaths.has(path) && !directoryPaths.has(path)) return false;
				}
				return true;
			});
			const neededNodes = new Set(activeOccurrences.map(({ artifact_id: id }) => id));
			const nodes = new Map();
			for (const node of snapshot.nodes) if (neededNodes.has(node.artifact_id)) nodes.set(node.artifact_id, node);
			const selected = activeOccurrences.map((occurrence) => {
				if (occurrence.encrypted) throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `Archive entry ${occurrence.logical_path} is encrypted; REA does not decrypt archive entries, so the archive cannot be extracted completely`);
				if (occurrence.entry_kind === "file" && occurrence.artifact_id === null && occurrence.hash_status === "unavailable") throw new ArtifactReaderFailure("unavailable", `Inventoried source bytes are unavailable for ${occurrence.logical_path}`, undefined, occurrence.unpacked === true ? {
					logicalPath: occurrence.logical_path,
					declaredSha256: null,
					calculatedSha256: null,
					unpacked: true
				} : undefined);
				if (occurrence.entry_kind !== "file" && occurrence.entry_kind !== "slice" || occurrence.artifact_id === null || occurrence.logical_path === ".") throw new ArtifactReaderFailure("format", `Selected occurrence is not an extractable regular child file: ${occurrence.logical_path} (${occurrence.occurrence_id})`);
				const node = nodes.get(occurrence.artifact_id);
				if (node === undefined) throw new ArtifactReaderFailure("integrity", `Selected occurrence has no inventory node: ${occurrence.occurrence_id}`);
				return {
					occurrence,
					node
				};
			});
			return materializeSelection({
				input,
				sourcePath,
				inventory: snapshot,
				selected,
				signal,
				transferredSource
			});
		};
		materializeSelection = async ({ input, sourcePath, inventory, selected, signal, transferredSource }) => {
			const byPath = new Map();
			for (const item of selected) {
				const path = item.occurrence.logical_path;
				if (byPath.has(path)) throw new ArtifactReaderFailure("path", `Artifact extraction path collision: ${JSON.stringify(path)}. Multiple selected occurrences share this normalized logical path; they cannot be materialized at the same destination path, even when the archive is valid. Inventory retains each occurrence.`);
				byPath.set(path, item);
			}
			if (transferredSource !== undefined && "kind" in transferredSource.admission) await assertArtifactFileSelectedSource(sourcePath, transferredSource.admission.source, "Artifact extraction");
			const reader = await createReader(sourcePath, input, inventory.manifest, transferredSource, signal);
			const readerOwner = {
				kind: "reader",
				reader,
				resource: `artifact reader for ${sourcePath}`
			};
			let localReaderOwner = readerOwner;
			let output;
			let completed;
			const extracted = [];
			try {
				await reader.prepareContainer?.(inventory.manifest.root_sha256, signal);
				try {
					output = await SafeOutputTree.create(input.outputRoot);
				} catch (cause) {
					if (cause instanceof SafeOutputTreeCreationFailure) output = cause.tree;
					throw cause;
				}
				const traversal = new ArtifactTraversalObservation();
				traversal.onCoverage({
					status: inventory.coverage.status,
					limitations: inventory.limitations
				});
				await writeSelectedEntries({
					reader,
					output,
					byPath,
					extracted,
					traversal,
					signal
				});
				localReaderOwner = undefined;
				const closeAttempt = await input.resourceScope.release(readerOwner);
				if (closeAttempt.kind === "failed") throw input.resourceScope.cleanupFailure({ kind: "completed" }, [closeAttempt], {
					kind: "artifact-inventory",
					inventory
				});
				const sourceClose = await releaseTransferredArtifactSource(input.resourceScope, transferredSource);
				if (sourceClose?.kind === "failed") throw input.resourceScope.cleanupFailure({ kind: "completed" }, [sourceClose], {
					kind: "artifact-inventory",
					inventory
				});
				if (transferredSource !== undefined) abortIfNeeded(signal);
				extracted.sort((left, right) => compareUnicodeCodePoints(left.relative_path, right.relative_path));
				completed = createExtractionResult(input, inventory, selected, extracted, traversal.snapshot(), reader.provenance());
				if (input.expectedRootSha256 !== undefined) await assertArtifactSelectedSource(sourcePath, input.selectedPath);
				await output.commit(signal);
				return completed;
			} catch (cause) {
				const cleanupFailures = await releaseExtractionOwners(input.resourceScope, localReaderOwner, output, input.outputRoot);
				const [firstCleanup, ...remainingCleanup] = cleanupFailures;
				if (firstCleanup !== undefined) {
					throw input.resourceScope.cleanupFailure({
						kind: "failed",
						cause
					}, [firstCleanup, ...remainingCleanup], output?.published === true && completed !== undefined ? {
						kind: "artifact-extraction",
						extraction: completed
					} : undefined);
				}
				if (output?.published === true && completed !== undefined) return completed;
				throw cause;
			}
		};
		writeSelectedEntries = async ({ reader, output, byPath, extracted, traversal, signal }) => {
			const registry = new ArtifactPathRegistry();
			for await (const entry of reader.entries(signal, traversal)) {
				const path = normalizeArtifactPath(entry.path);
				registry.add(path, entry.kind);
				if (entry.kind !== "file" && entry.kind !== "slice") continue;
				const selectedItem = byPath.get(path);
				if (selectedItem === undefined) {
					throw new ArtifactReaderFailure("integrity", `Regular artifact entry is missing from inventory: ${path}`);
				}
				preflight(entry);
				const stream = await reader.open(entry, signal);
				const written = await output.write(path, stream, {
					sha256: selectedItem.node.sha256,
					bytes: selectedItem.node.size
				}, signal);
				extracted.push({
					artifact_id: selectedItem.node.artifact_id,
					relative_path: written.relativePath,
					sha256: written.sha256,
					bytes_written: written.bytesWritten,
					created: true
				});
				byPath.delete(path);
			}
			if (byPath.size > 0) throw new ArtifactReaderFailure("integrity", `Inventoried regular artifact entries were not materialized: ${[...byPath.keys()].sort(compareUnicodeCodePoints).join(", ")}`);
		};
		releaseExtractionOwners = async (resourceScope, readerOwner, output, outputRoot) => {
			const failures = [];
			if (readerOwner !== undefined) {
				const attempt = await resourceScope.release(readerOwner);
				if (attempt.kind === "failed") failures.push(attempt);
			}
			if (output !== undefined) {
				const owner = {
					kind: "output-tree",
					tree: output,
					resource: outputRoot
				};
				const attempt = await resourceScope.release(owner);
				if (attempt.kind === "failed") failures.push(attempt);
			}
			return failures;
		};
		createExtractionResult = (input, inventory, selected, extracted, traversal, materializationProvenance) => {
			const selectedIds = new Set(selected.map(({ occurrence }) => occurrence.occurrence_id));
			const rootId = inventory.occurrences.find((row) => row.logical_path === ".")?.occurrence_id;
			const rootContradicted = inventory.integrity_contradictions.some(({ occurrence_id: id }) => id === rootId);
			const integrityContradictions = inventory.integrity_contradictions.filter(({ occurrence_id: id }) => selectedIds.has(id) || id === rootId);
			const extractedContradictions = integrityContradictions.length - (rootContradicted ? 1 : 0);
			const extractionSemantic = {
				source_manifest_id: inventory.manifest.manifest_id,
				selected_occurrence_ids: selected.map(({ occurrence }) => occurrence.occurrence_id).sort(compareUnicodeCodePoints),
				files_sha256: digestCanonicalValue(extracted, "Artifact"),
				output_root_alias: "$OUTPUT_ROOT"
			};
			return artifactExtractionResultSchema.parse({
				manifest: inventory.manifest,
				extraction_manifest: {
					...extractionSemantic,
					extraction_id: `aex_${digestCanonicalValue(extractionSemantic, "Artifact")}`
				},
				output_root: input.outputRoot,
				artifacts: extracted,
				containment_verified: true,
				cleanup: {
					attempted: false,
					verified: true,
					residual_paths: []
				},
				provenance: [...inventory.provenance, ...materializationProvenance],
				coverage: {
					...inventory.coverage,
					status: traversal.status
				},
				integrity_contradictions: integrityContradictions,
				limitations: [
					...traversal.limitations,
					...selected.flatMap(({ occurrence }) => occurrence.limitations.map((limitation) => `${occurrence.logical_path}: ${limitation}`)),
					traversal.status === "complete" ? "All regular files exposed by the active artifact reader were materialized." : "All inventoried regular files exposed by the active reader were materialized; source traversal coverage is unknown, so the output is not established as a complete source copy.",
					"Publication verifies the selected inventoried regular files; it does not establish complete content decoding.",
					...extractedContradictions === 0 ? [] : [`${String(extractedContradictions)} extracted file(s) contradict declared integrity metadata; their bytes are observed-untrusted.`],
					...rootContradicted ? ["The container contradicts its declared integrity metadata; every extracted file is observed-untrusted."] : []
				]
			});
		};
		requireExtractableFormat = async (path, input, signal) => {
			const format = input.inputFormat;
			const directory = (await lstat(path)).isDirectory();
			if (!directory && artifactFormatDescriptor(format)?.extractable !== true) {
				const detected = await withArtifactRegularFile(path, input.resourceScope, signal, async (source) => {
					const probes = new ArtifactEmbeddedFormatProbes(path, source, signal);
					const pack = await probes.godotPck() !== undefined || (format === "elf" || format === "pe" || format === "mach-o") && (await probes.nodeSea() !== undefined || await probes.pyInstaller() !== undefined || (await probes.bunStandalone()).status === "present" || await probes.dotnetBundle() !== undefined);
					if (pack && input.expectedRootSha256 !== undefined) {
						const digest = await hashStableRootArtifactHandle(path, source.handle, source.initial, signal);
						assertAdmittedRootDigest(path, input.expectedRootSha256, digest.sha256);
					}
					return {
						pack,
						probeFacts: probes.completedFacts()
					};
				});
				if (!detected.pack) throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `Artifact format has no extraction reader: ${format}`);
				return detected.probeFacts;
			}
			return undefined;
		};
		createReader = async (path, input, manifest, transferredSource, signal) => {
			const containerFormat = manifest.root_format;
			if (containerFormat === "ines" && transferredSource === undefined) {
				let source;
				try {
					source = await openRootArtifact(path, input.resourceScope, signal);
				} catch (cause) {
					abortIfNeeded(signal);
					if (inventorySourceChanged(cause) || cause instanceof ArtifactReaderFailure && cause.reason === "format") throw new ArtifactReaderFailure("integrity", `Inventoried source changed: ${path}`, { cause });
					throw cause;
				}
				try {
					const digest = await hashStableRootArtifactHandle(path, source.handle, source.initial, signal);
					assertAdmittedRootDigest(path, manifest.root_sha256, digest.sha256);
					return new InesArtifactReader(path, source, source.owner);
				} catch (cause) {
					const attempt = await input.resourceScope.release({
						kind: "file-handle",
						handle: source.owner,
						resource: `iNES source ${path}`
					});
					if (attempt.kind === "failed") throw input.resourceScope.cleanupFailure({
						kind: "failed",
						cause
					}, [attempt]);
					throw cause;
				}
			}
			const reader = containerFormat === "dmg" ? undefined : createArtifactReader(path, containerFormat, {
				environment: input.environment,
				unreadableDirectories: "omit",
				selectedPath: absoluteCallerPath(input.selectedPath ?? input.inputPath),
				admission: transferredSource?.admission,
				espFlashSelection: input.espFlashSelection,
				asarHeaderAdmission: containerFormat === "asar" ? input.asarHeaderAdmission ?? resolveAsarHeaderAdmission(input.environment) : undefined
			});
			if (reader === undefined) throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `Artifact format has no extraction reader: ${containerFormat}`);
			return reader;
		};
		preflight = (entry) => {
			if (entry.kind !== "file" && entry.kind !== "slice" || entry.encrypted) throw new ArtifactReaderFailure("format", `Selected artifact entry cannot be read: ${entry.path}`);
		};
		inventorySourceChanged = (cause) => cause instanceof Error && "code" in cause && [
			"ENOENT",
			"ENOTDIR",
			"EISDIR",
			"ENOTFILE",
			"ESTALE",
			"ELOOP"
		].includes(String(cause.code));
	})))();
}

//#endregion
//#region dist/artifacts/apple/InterfaceBuilderDecodeBudget.js
var InterfaceBuilderDecodeBudgetExceeded, interfaceBuilderDecodeBudgetFailure, InterfaceBuilderDecodeBudget;
function init_InterfaceBuilderDecodeBudget() {
	return (init_InterfaceBuilderDecodeBudget = __esmMin((() => {
		InterfaceBuilderDecodeBudgetExceeded = class extends Error {
			reason;
			constructor(reason, message) {
				super(message);
				this.reason = reason;
				this.name = "InterfaceBuilderDecodeBudgetExceeded";
			}
		};
		interfaceBuilderDecodeBudgetFailure = (_kind, message) => new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", message);
		InterfaceBuilderDecodeBudget = class {
			#initialBytes;
			#remainingBytes;
			constructor(maxBytes) {
				this.#initialBytes = maxBytes;
				this.#remainingBytes = maxBytes;
			}
			/** Representation bytes still available for the current inspection. */
			get remainingBytes() {
				return this.#remainingBytes;
			}
			/** Representation bytes reserved so far. */
			get usedBytes() {
				return this.#initialBytes - this.#remainingBytes;
			}
			/** Reserve representation bytes before allocation, or report exhaustion. */
			reserve(bytes, message) {
				if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.#remainingBytes) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", message);
				this.#remainingBytes -= bytes;
			}
			/** Return a reservation whose representation was rejected and not retained. */
			release(bytes) {
				this.#remainingBytes = Math.min(this.#initialBytes, this.#remainingBytes + bytes);
			}
			/** Reserve an upper bound for one JSON-serialized string occurrence. */
			reserveJsonStringOccurrence(value) {
				this.reserve(value.length * 6 + 2, "projected JSON strings exceed the aggregate Interface Builder decode budget");
			}
			/** Reserve the exact JSON string length for a base64 value from Buffer. */
			reserveBase64JsonStringOccurrence(value) {
				this.reserve(value.length + 2, "projected NIB base64 values exceed the aggregate Interface Builder decode budget");
			}
			/** Reserve an upper bound for one JSON object property name occurrence. */
			reserveJsonPropertyNameOccurrence(value) {
				this.reserve(value.length * 6 + 3, "projected JSON property names exceed the aggregate Interface Builder decode budget");
			}
			/** Reserve bytes for an optional projection without throwing on exhaustion. */
			tryReserve(bytes) {
				if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.#remainingBytes) return false;
				this.#remainingBytes -= bytes;
				return true;
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/NibArchive.js
var DEFAULT_DECODE_BUDGET_BYTES, nibCollectionMembers, decodeNibArchive, parseObjects, preflightProjectedFieldCount, parseStrings, parseClasses, parseValues, NibValueType, readValue, skipValue, valueIndexes, readCount, readOffset, readU32, decodeUtf8, readVarint, checkedEnd, ensureRange, assertOrderedOffsets;
function init_NibArchive() {
	return (init_NibArchive = __esmMin((() => {
		init_appleArchiveFormat();
		init_interfaceBuilderKeyedArchive();
		init_InterfaceBuilderDecodeBudget();
		DEFAULT_DECODE_BUDGET_BYTES = 128 * 1024 * 1024;
		nibCollectionMembers = (object) => {
			if (object === undefined || !/^(?:NS|NSMutable)(?:Array|Set)$/u.test(object.class_name.replace(/\0+$/u, ""))) return undefined;
			const keys = ["UINibEncoderEmptyKey", "NS.objects"];
			const populated = keys.filter((key) => Object.hasOwn(object.values, key) || Object.hasOwn(object.repeated_values ?? {}, key));
			if (populated.length > 1) return undefined;
			const key = populated[0];
			if (key === undefined) return [];
			return object.repeated_values?.[key] ?? [object.values[key]];
		};
		decodeNibArchive = (bytes, budget = new InterfaceBuilderDecodeBudget(DEFAULT_DECODE_BUDGET_BYTES)) => {
			if (bytes.length < 50 || !hasNibArchiveSignature(bytes)) throw new TypeError("NIBArchive magic or header is invalid");
			const formatVersion = readU32(bytes, 10);
			const coderVersion = readU32(bytes, 14);
			if (formatVersion !== 1) throw new TypeError(`Unsupported NIBArchive format version ${formatVersion}`);
			const objectCount = readCount(bytes, 18, "object");
			const objectsOffset = readOffset(bytes, 22, bytes.length, "object");
			const keyCount = readCount(bytes, 26, "key");
			const keysOffset = readOffset(bytes, 30, bytes.length, "key");
			const valueCount = readCount(bytes, 34, "value");
			const valuesOffset = readOffset(bytes, 38, bytes.length, "value");
			const classCount = readCount(bytes, 42, "class");
			const classesOffset = readOffset(bytes, 46, bytes.length, "class");
			assertOrderedOffsets(bytes.length, [
				objectsOffset,
				keysOffset,
				valuesOffset,
				classesOffset
			]);
			const projectedFieldCount = preflightProjectedFieldCount(bytes, objectsOffset, keysOffset, objectCount, valueCount, classCount, budget.remainingBytes);
			budget.reserve(objectCount * 96 + projectedFieldCount * 96, "NIBArchive object and projected field counts exceed the aggregate Interface Builder decode budget");
			const objectRecords = parseObjects(bytes, objectsOffset, keysOffset, objectCount, valueCount, classCount);
			const keys = parseStrings(bytes, keysOffset, valuesOffset, keyCount, "key", budget);
			const classes = parseClasses(bytes, classesOffset, bytes.length, classCount, budget);
			const neededValues = valueIndexes(objectRecords, valueCount);
			const values = parseValues(bytes, valuesOffset, classesOffset, valueCount, keyCount, neededValues, budget);
			for (const { value } of values.values()) {
				if (typeof value === "object" && value !== null && !Array.isArray(value) && typeof value.$nib_object_ref === "number" && value.$nib_object_ref >= objectCount) throw new TypeError("NIBArchive object reference is outside the object table");
			}
			const objects = objectRecords.flatMap((object, id) => {
				const className = classes[object.class_index];
				if (className === undefined) return [];
				const fields = {};
				const repeated = {};
				for (let index = object.value_start; index < object.value_start + object.value_count; index += 1) {
					const value = values.get(index);
					if (value === undefined) continue;
					const key = keys[value.key_index];
					if (key === undefined) continue;
					if (Object.hasOwn(repeated, key)) {
						budget.reserve(16, "NIBArchive repeated fields exceed the decode budget");
						repeated[key].push(value.value);
					} else if (Object.hasOwn(fields, key)) {
						budget.reserve(96, "NIBArchive repeated fields exceed the decode budget");
						Object.defineProperty(repeated, key, {
							value: [fields[key], value.value],
							enumerable: true,
							configurable: true,
							writable: true
						});
						delete fields[key];
					} else Object.defineProperty(fields, key, {
						value: value.value,
						enumerable: true,
						configurable: true,
						writable: true
					});
				}
				return [{
					id,
					class_name: className,
					values: fields,
					...Object.keys(repeated).length === 0 ? {} : { repeated_values: repeated }
				}];
			});
			let connectionObjectCount = 0;
			for (const object of objects) if (isInterfaceBuilderConnectionClass(object.class_name)) connectionObjectCount += 1;
			return {
				format_version: formatVersion,
				coder_version: coderVersion,
				object_count: objectCount,
				connection_object_count: connectionObjectCount,
				objects,
				classes,
				limitations: ["NIBArchive class extensions and unsupported value encodings are retained as unavailable fields.", "NIBArchive object relationships are decoded from serialized references; runtime object creation and execution are not performed."]
			};
		};
		parseObjects = (bytes, start, end, count, valueCount, classCount) => {
			const cursor = { offset: start };
			const output = [];
			for (let index = 0; index < count; index += 1) {
				const classIndex = readVarint(bytes, cursor, end);
				const valueStart = readVarint(bytes, cursor, end);
				const countForObject = readVarint(bytes, cursor, end);
				if (classIndex >= classCount || valueStart > valueCount || countForObject > valueCount - valueStart) throw new TypeError(`NIBArchive object ${index} references an invalid table range`);
				output.push({
					class_index: classIndex,
					value_start: valueStart,
					value_count: countForObject
				});
			}
			if (cursor.offset > end) throw new TypeError("NIBArchive object table overlaps the next table");
			return output;
		};
		preflightProjectedFieldCount = (bytes, start, end, objectCount, valueCount, classCount, maxBytes) => {
			if (objectCount * 96 > maxBytes) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "NIBArchive object count exceeds the aggregate Interface Builder decode budget");
			const cursor = { offset: start };
			let projectedFields = 0;
			for (let index = 0; index < objectCount; index += 1) {
				const classIndex = readVarint(bytes, cursor, end);
				const valueStart = readVarint(bytes, cursor, end);
				const fieldCount = readVarint(bytes, cursor, end);
				if (classIndex >= classCount || valueStart > valueCount || fieldCount > valueCount - valueStart) throw new TypeError(`NIBArchive object ${index} references an invalid table range`);
				projectedFields += fieldCount;
				if (!Number.isSafeInteger(projectedFields) || projectedFields * 96 > maxBytes - objectCount * 96) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "NIBArchive projected field ranges exceed the aggregate Interface Builder decode budget");
			}
			return projectedFields;
		};
		parseStrings = (bytes, start, end, count, label, budget) => {
			const cursor = { offset: start };
			const output = [];
			for (let index = 0; index < count; index += 1) {
				const length = readVarint(bytes, cursor, end);
				const next = checkedEnd(cursor.offset, length, end, `${label} ${index}`);
				budget.reserve(32 + length * 2, `NIBArchive ${label} strings exceed the aggregate Interface Builder decode budget`);
				const value = decodeUtf8(bytes, cursor.offset, next, `${label} ${index}`);
				cursor.offset = next;
				output.push(value);
			}
			return output;
		};
		parseClasses = (bytes, start, end, count, budget) => {
			const cursor = { offset: start };
			const output = [];
			for (let index = 0; index < count; index += 1) {
				const length = readVarint(bytes, cursor, end);
				const extraCount = readVarint(bytes, cursor, end);
				if (extraCount > 16) throw new TypeError(`NIBArchive class ${index} has too many extension values`);
				ensureRange(cursor.offset, extraCount * 4, end, `class ${index} extensions`);
				cursor.offset += extraCount * 4;
				const next = checkedEnd(cursor.offset, length, end, `class ${index}`);
				budget.reserve(32 + length * 2, "NIBArchive class names exceed the aggregate Interface Builder decode budget");
				const name = decodeUtf8(bytes, cursor.offset, next, `class ${index}`).replace(/\0+$/u, "");
				cursor.offset = next;
				output.push(name);
			}
			return output;
		};
		parseValues = (bytes, start, end, count, keyCount, needed, budget) => {
			const cursor = { offset: start };
			const output = new Map();
			for (let index = 0; index < count; index += 1) {
				const keyIndex = readVarint(bytes, cursor, end);
				if (keyIndex >= keyCount) throw new TypeError(`NIBArchive value ${index} references an invalid key`);
				ensureRange(cursor.offset, 1, end, `value ${index} type`);
				const type = bytes[cursor.offset++] ?? -1;
				if (!needed.has(index)) {
					skipValue(bytes, cursor, end, type, index);
					continue;
				}
				budget.reserve(64, "NIBArchive decoded values exceed the aggregate Interface Builder decode budget");
				const value = readValue(bytes, cursor, end, type, index, budget);
				output.set(index, {
					key_index: keyIndex,
					value
				});
			}
			if (cursor.offset > end) throw new TypeError("NIBArchive value table overlaps the next table");
			return output;
		};
		NibValueType = {
			int8: 0,
			int16: 1,
			int32: 2,
			int64: 3,
			booleanFalse: 4,
			booleanTrue: 5,
			float32: 6,
			float64: 7,
			data: 8,
			nil: 9,
			objectReference: 10
		};
		readValue = (bytes, cursor, end, type, index, budget) => {
			switch (type) {
				case NibValueType.int8:
					ensureRange(cursor.offset, 1, end, `value ${index}`);
					return bytes.readInt8(cursor.offset++);
				case NibValueType.int16:
					ensureRange(cursor.offset, 2, end, `value ${index}`);
					{
						const value = bytes.readInt16LE(cursor.offset);
						cursor.offset += 2;
						return value;
					}
				case NibValueType.int32:
					ensureRange(cursor.offset, 4, end, `value ${index}`);
					{
						const value = bytes.readInt32LE(cursor.offset);
						cursor.offset += 4;
						return value;
					}
				case NibValueType.int64:
					ensureRange(cursor.offset, 8, end, `value ${index}`);
					{
						const value = bytes.readBigInt64LE(cursor.offset);
						cursor.offset += 8;
						return value <= BigInt(Number.MAX_SAFE_INTEGER) && value >= BigInt(Number.MIN_SAFE_INTEGER) ? Number(value) : value.toString();
					}
				case NibValueType.booleanFalse: return false;
				case NibValueType.booleanTrue: return true;
				case NibValueType.float32:
					ensureRange(cursor.offset, 4, end, `value ${index}`);
					{
						const value = bytes.readFloatLE(cursor.offset);
						cursor.offset += 4;
						return value;
					}
				case NibValueType.float64:
					ensureRange(cursor.offset, 8, end, `value ${index}`);
					{
						const value = bytes.readDoubleLE(cursor.offset);
						cursor.offset += 8;
						return value;
					}
				case NibValueType.data: {
					const length = readVarint(bytes, cursor, end);
					const next = checkedEnd(cursor.offset, length, end, `value ${index} data`);
					budget.reserve(32 + 4 * Math.ceil(length / 3), `NIBArchive data value ${index} exceeds the aggregate Interface Builder decode budget`);
					const encoded = bytes.subarray(cursor.offset, next).toString("base64");
					cursor.offset = next;
					return { $nib_data_base64: encoded };
				}
				case NibValueType.nil: return null;
				case NibValueType.objectReference:
					ensureRange(cursor.offset, 4, end, `value ${index} reference`);
					{
						const objectIndex = bytes.readUInt32LE(cursor.offset);
						cursor.offset += 4;
						return { $nib_object_ref: objectIndex };
					}
				default: throw new TypeError(`NIBArchive value ${index} has unsupported type ${type}`);
			}
		};
		skipValue = (bytes, cursor, end, type, index) => {
			switch (type) {
				case NibValueType.int8:
					ensureRange(cursor.offset, 1, end, `value ${index}`);
					cursor.offset += 1;
					return;
				case NibValueType.int16:
					ensureRange(cursor.offset, 2, end, `value ${index}`);
					cursor.offset += 2;
					return;
				case NibValueType.int32:
				case NibValueType.objectReference:
					ensureRange(cursor.offset, 4, end, `value ${index}`);
					cursor.offset += 4;
					return;
				case NibValueType.int64:
				case NibValueType.float64:
					ensureRange(cursor.offset, 8, end, `value ${index}`);
					cursor.offset += 8;
					return;
				case NibValueType.float32:
					ensureRange(cursor.offset, 4, end, `value ${index}`);
					cursor.offset += 4;
					return;
				case NibValueType.booleanFalse:
				case NibValueType.booleanTrue:
				case NibValueType.nil: return;
				case NibValueType.data: {
					const length = readVarint(bytes, cursor, end);
					cursor.offset = checkedEnd(cursor.offset, length, end, `value ${index} data`);
					return;
				}
				default: throw new TypeError(`NIBArchive value ${index} has unsupported type ${type}`);
			}
		};
		valueIndexes = (objects, total) => {
			const indexes = new Set();
			for (const object of objects) for (let index = object.value_start; index < object.value_start + object.value_count; index += 1) indexes.add(index);
			if (indexes.size > total) throw new TypeError("NIBArchive object value ranges exceed the value table");
			return indexes;
		};
		readCount = (bytes, offset, label) => {
			const count = readU32(bytes, offset);
			if (count > bytes.length) throw new TypeError(`NIBArchive ${label} count exceeds the archive length`);
			return count;
		};
		readOffset = (bytes, offset, fileLength, label) => {
			const value = readU32(bytes, offset);
			if (value < 50 || value > fileLength) throw new TypeError(`NIBArchive ${label} table offset is invalid`);
			return value;
		};
		readU32 = (bytes, offset) => {
			ensureRange(offset, 4, bytes.length, "header");
			return bytes.readUInt32LE(offset);
		};
		decodeUtf8 = (bytes, start, end, label) => {
			try {
				return new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(bytes.subarray(start, end));
			} catch (cause) {
				throw new TypeError(`NIBArchive ${label} is not valid UTF-8`, { cause });
			}
		};
		readVarint = (bytes, cursor, end) => {
			let value = 0;
			let shift = 0;
			for (let index = 0; index < 5; index += 1) {
				ensureRange(cursor.offset, 1, end, "variable integer");
				const byte = bytes[cursor.offset++] ?? 0;
				value += (byte & 127) * 2 ** shift;
				if ((byte & 128) !== 0) {
					if (value > 2147483647) throw new TypeError("NIBArchive variable integer is out of range");
					return value;
				}
				shift += 7;
			}
			throw new TypeError("NIBArchive variable integer is too long");
		};
		checkedEnd = (start, length, limit, label) => {
			if (!Number.isSafeInteger(length) || length < 0 || start + length > limit) throw new TypeError(`NIBArchive ${label} exceeds its table`);
			return start + length;
		};
		ensureRange = (start, length, limit, label) => {
			checkedEnd(start, length, limit, label);
		};
		assertOrderedOffsets = (length, offsets) => {
			let previous = 50;
			for (const offset of offsets) {
				if (offset < previous || offset > length) throw new TypeError("NIBArchive table offsets are out of order");
				previous = offset;
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/NibViewHierarchy.js
var childCollections, childReferences, nonViewCellClasses, isNonViewCell, projectNibViewHierarchy, reference;
function init_NibViewHierarchy() {
	return (init_NibViewHierarchy = __esmMin((() => {
		init_NibArchive();
		childCollections = new Set([
			"subviews",
			"NSSubviews",
			"UISubviews",
			"childViewControllers",
			"NSChildViewControllers",
			"UIChildViewControllers"
		]);
		childReferences = new Set([
			"view",
			"NSView",
			"UIView",
			"contentView",
			"NSContentView",
			"UIContentView"
		]);
		nonViewCellClasses = new Set([
			"NSCell",
			"NSActionCell",
			"NSButtonCell",
			"NSComboBoxCell",
			"NSDatePickerCell",
			"NSFormCell",
			"NSLevelIndicatorCell",
			"NSMenuItemCell",
			"NSPathCell",
			"NSPathComponentCell",
			"NSPopUpButtonCell",
			"NSSearchFieldCell",
			"NSSecureTextFieldCell",
			"NSSegmentedCell",
			"NSSliderCell",
			"NSStepperCell",
			"NSTableHeaderCell",
			"NSTextFieldCell",
			"NSTokenFieldCell"
		]);
		isNonViewCell = (object) => object !== undefined && nonViewCellClasses.has(object.class_name.replace(/\0+$/u, ""));
		projectNibViewHierarchy = (objects, retainedIds, reserveNode = () => true, maxNodes = 2e4, reportUnknownRegistry = () => {}) => {
			const byId = new Map(objects.map((object) => [object.id, object]));
			const parents = new Map();
			const involved = new Set();
			const registryUnknown = new Set();
			let invalid = 0;
			let ownerWithoutRegistry = false;
			const addParent = (child, parent) => {
				if (retainedIds.has(parent)) involved.add(parent);
				if (!retainedIds.has(child)) {
					invalid += 1;
					return;
				}
				involved.add(child);
				const previous = parents.get(child);
				parents.set(child, previous === undefined || previous === parent ? parent : null);
			};
			const fieldValues = (object, key) => object.repeated_values?.[key] ?? (Object.hasOwn(object.values, key) ? [object.values[key]] : []);
			const addReference = (value, parent) => {
				if (value === null) return;
				const child = reference(value);
				if (child === null) invalid += 1;
				else addParent(child, parent);
			};
			for (const object of objects) {
				if (!retainedIds.has(object.id)) continue;
				for (const value of fieldValues(object, "NSSuperview")) {
					if (value === null) continue;
					const parent = reference(value);
					if (parent === null) invalid += 1;
					else addParent(object.id, parent);
				}
				const keys = new Set([...Object.keys(object.values), ...Object.keys(object.repeated_values ?? {})]);
				for (const key of keys) {
					if (childCollections.has(key)) {
						for (const value of fieldValues(object, key)) {
							if (value === null) continue;
							const collection = reference(value);
							const members = nibCollectionMembers(collection === null ? undefined : byId.get(collection));
							if (members === undefined) invalid += 1;
							else {
								involved.add(object.id);
								for (const member of members) addReference(member, object.id);
							}
						}
					} else if (childReferences.has(key) || key === "NSWindowView" && object.class_name.replace(/\0+$/u, "") === "NSWindowTemplate") {
						for (const value of fieldValues(object, key)) addReference(value, object.id);
					} else if (![
						"NSSuperview",
						"NSNextKeyView",
						"NSPreviousKeyView"
					].includes(key) && !(key === "NSControlView" && isNonViewCell(object)) && /(?:subviews|contentview|childviewcontrollers|view)$/iu.test(key)) {
						invalid += 1;
					}
				}
			}
			for (const object of objects) {
				if (object.class_name.replace(/\0+$/u, "") !== "NSIBObjectData") continue;
				const registryFields = [
					"NSRoot",
					"NSObjectsKeys",
					"NSObjectsValues"
				];
				const ambiguous = registryFields.filter((key) => fieldValues(object, key).length > 1);
				if (ambiguous.length > 0) {
					invalid += 1;
					reportUnknownRegistry(`NSIBObjectData object ${object.id} has repeated ${ambiguous.join(", ")} declarations; registry hierarchy interpretation remains unknown.`);
					continue;
				}
				const rootValue = fieldValues(object, "NSRoot")[0];
				const keysValue = fieldValues(object, "NSObjectsKeys")[0];
				const valuesValue = fieldValues(object, "NSObjectsValues")[0];
				const ownerReference = reference(rootValue);
				const owner = ownerReference !== null && byId.has(ownerReference) ? ownerReference : null;
				if (rootValue !== undefined && rootValue !== null && owner === null) invalid += 1;
				const keysRef = reference(keysValue);
				const valuesRef = reference(valuesValue);
				if (keysValue === undefined && valuesValue === undefined) {
					if (rootValue !== undefined) ownerWithoutRegistry = true;
					continue;
				}
				const keys = nibCollectionMembers(keysRef === null ? undefined : byId.get(keysRef));
				const values = nibCollectionMembers(valuesRef === null ? undefined : byId.get(valuesRef));
				if (keys === undefined || values === undefined || keys.length !== values.length) {
					invalid += 1;
					continue;
				}
				for (let index = 0; index < keys.length; index += 1) {
					const child = reference(keys[index]);
					const parent = reference(values[index]);
					if (child === null || parent === null) {
						invalid += 1;
						continue;
					}
					if (!retainedIds.has(child) || isNonViewCell(byId.get(child))) continue;
					involved.add(child);
					if (owner !== null && parent === owner) {
						if (parents.has(child)) parents.set(child, null);
					} else {
						registryUnknown.add(child);
						if (!parents.has(child)) reportUnknownRegistry(`NSIBObjectData object ${object.id}: NSObjectsKeys/NSObjectsValues pair child ${child} with registry value ${parent}; NSRoot is ${ownerReference === null ? "unresolved" : owner === null ? `${ownerReference} (unresolved)` : owner}. This decoded registry association does not establish visual parentage.`);
					}
				}
			}
			if (ownerWithoutRegistry) invalid += 1;
			for (const child of registryUnknown) if (!parents.has(child)) parents.set(child, null);
			const children = new Map();
			for (const [child, parent] of parents) {
				if (parent === null || !retainedIds.has(parent)) continue;
				const siblings = children.get(parent) ?? [];
				siblings.push(child);
				children.set(parent, siblings);
			}
			if (involved.size === 0) return {
				hierarchy: null,
				omitted: invalid
			};
			const roots = [];
			const pending = [];
			for (const id of involved) if (!parents.has(id)) pending.push({
				id,
				depth: 0,
				output: roots
			});
			const visited = new Set();
			while (pending.length > 0) {
				const item = pending.pop();
				if (item === undefined) break;
				if (visited.has(item.id) || item.depth > 128 || visited.size >= maxNodes || !reserveNode()) continue;
				visited.add(item.id);
				const node = {
					objectID: String(item.id),
					children: []
				};
				item.output.push(node);
				for (const child of [...children.get(item.id) ?? []].reverse()) pending.push({
					id: child,
					depth: item.depth + 1,
					output: node.children
				});
			}
			return {
				hierarchy: roots,
				omitted: involved.size - visited.size + invalid
			};
		};
		reference = (value) => {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
			return typeof value.$nib_object_ref === "number" ? value.$nib_object_ref : null;
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/InterfaceBuilderAnalysis.js
var MAX_AGGREGATE_INPUT_BYTES, MAX_AGGREGATE_DECODE_BYTES, MAX_REPORTED_OMITTED_ARCHIVES, MAX_REPORTED_INVALID_ARCHIVES, analyzeInterfaceBuilderBundle, decodeInterfaceBuilderBundle, selectInterfaceBuilderCandidates, retainCandidate, finalizeHierarchyCoverage, projectNibArchive, isInterfaceBuilderArchive, readEntry, parseXmlWithinDecodeBudget, decodePlist;
function init_InterfaceBuilderAnalysis() {
	return (init_InterfaceBuilderAnalysis = __esmMin((() => {
		init_BinaryPlistMaterializer();
		init_appleAssetCatalog();
		init_interfaceBuilderKeyedArchive();
		init_StreamBytes();
		init_DirectoryArtifactReader();
		init_ArtifactResourceScope();
		init_ArtifactTraversalObservation();
		init_plistValue();
		init_propertyListKeys();
		init_NibArchive();
		init_PropertyListDecodeBudget();
		init_InterfaceBuilderDecodeBudget();
		init_ArtifactReader();
		init_interfaceBuilderGraph();
		init_NibViewHierarchy();
		init_jsonValue();
		init_unicodeCodePointOrder();
		init_propertyListXmlText();
		init_PlistScalars();
		init_appleArchiveFormat();
		MAX_AGGREGATE_INPUT_BYTES = 32 * 1024 * 1024;
		MAX_AGGREGATE_DECODE_BYTES = 256 * 1024 * 1024;
		MAX_REPORTED_OMITTED_ARCHIVES = 64;
		MAX_REPORTED_INVALID_ARCHIVES = 16;
		analyzeInterfaceBuilderBundle = (input) => {
			const resources = input.resources ?? new ArtifactResourceScope();
			return resources.run(() => decodeInterfaceBuilderBundle(input, resources));
		};
		decodeInterfaceBuilderBundle = async (input, resources) => {
			const limits = interfaceBuilderLimitsSchema.parse(input.limits ?? {});
			const reader = new DirectoryArtifactReader(input.bundlePath);
			const documents = [];
			const invalid = [];
			let unreportedInvalidArchives = 0;
			const omittedArchives = [];
			const omissionCounts = new Map();
			const recordOmission = (reason, count = 1) => {
				if (count > 0) omissionCounts.set(reason, (omissionCounts.get(reason) ?? 0) + count);
			};
			let unreportedOmittedArchives = 0;
			const incompleteHierarchies = new Map();
			const unexaminedSources = new Map();
			const unresolvedConnections = new Map();
			const unknownDates = new Map();
			const datePrecisionOverlaps = new Map();
			const unknownScalars = new Map();
			const nonFiniteReals = new Map();
			const negativeZeroReals = new Map();
			let omitted = 0;
			let attempted = 0;
			let aggregateInputBytes = 0;
			const traversal = new ArtifactTraversalObservation();
			const decodeBudget = new InterfaceBuilderDecodeBudget(MAX_AGGREGATE_DECODE_BYTES);
			let outcome = { kind: "completed" };
			const retainOmittedArchive = (path, reason, limitations = []) => {
				if (omittedArchives.length < MAX_REPORTED_OMITTED_ARCHIVES) omittedArchives.push({
					path,
					reason,
					limitations
				});
				else unreportedOmittedArchives += 1;
			};
			const recordOmittedArchive = (path, reason) => {
				omitted += 1;
				recordOmission(reason);
				retainOmittedArchive(path, reason);
			};
			try {
				const selection = await selectInterfaceBuilderCandidates(reader, input.signal, limits.max_documents, traversal);
				omitted = selection.omitted;
				recordOmission("max_documents", selection.documentLimitOmissions);
				recordOmission("symlink_not_followed", selection.symlinkOmissions);
				for (const entry of selection.omittedSamples) retainOmittedArchive(entry.path, "max_documents");
				for (const entry of selection.symlinkSamples) retainOmittedArchive(entry.path, "symlink_not_followed", entry.limitations);
				unreportedOmittedArchives += selection.unreportedOmitted;
				for (const entry of selection.selected) {
					let plistReservation = 0;
					try {
						const remainingInputBytes = MAX_AGGREGATE_INPUT_BYTES - aggregateInputBytes;
						if (entry.declaredSize !== null && entry.declaredSize > remainingInputBytes) {
							recordOmittedArchive(entry.path, "aggregate_decode_budget_exhausted");
							continue;
						}
						attempted += 1;
						const bytes = await readEntry(reader, entry, input.signal, remainingInputBytes);
						aggregateInputBytes += bytes.length;
						const isNibArchive = hasNibArchiveSignature(bytes);
						let nib = null;
						let xmlText;
						let scalarPlan;
						let datePrecisionOverlapCount = 0;
						if (isNibArchive) {
							const documentBudget = new InterfaceBuilderDecodeBudget(decodeBudget.remainingBytes);
							nib = projectNibArchive(decodeNibArchive(bytes, documentBudget), documentBudget, limits.max_objects);
							decodeBudget.reserve(documentBudget.usedBytes, "NIBArchive representation exceeds the aggregate Interface Builder decode budget");
						} else {
							if (!hasBinaryPlistSignature(bytes)) xmlText = decodeXmlPlistText(bytes);
							const decodedReservation = preflightPropertyListDecode(bytes, decodeBudget.remainingBytes, xmlText, {
								numberProjection: true,
								uidProjection: true,
								budget: "the aggregate Interface Builder decode budget",
								fail: interfaceBuilderDecodeBudgetFailure
							});
							decodeBudget.reserve(decodedReservation.estimatedBytes, "plist representation exceeds the aggregate Interface Builder decode budget");
							plistReservation = decodedReservation.estimatedBytes;
							scalarPlan = decodedReservation;
							datePrecisionOverlapCount = decodedReservation.datePrecisionOverlapCount;
						}
						const { value: raw, unknownDateCount, unknownScalarCount, numberLiterals } = nib === null ? decodePlist(bytes, xmlText, scalarPlan) : {
							value: nib.raw,
							unknownDateCount: 0,
							unknownScalarCount: 0,
							numberLiterals: undefined
						};
						requireInterfaceBuilderArchive(raw);
						if (nib !== null && nib.unexaminedSources.length > 0) unexaminedSources.set(entry.path, nib.unexaminedSources);
						if (nib !== null && nib.omitted > 0) incompleteHierarchies.set(entry.path, nib.omitted);
						if (nib !== null && nib.unresolvedConnections > 0) unresolvedConnections.set(entry.path, nib.unresolvedConnections);
						if (nib !== null && nib.nonFiniteRealCount > 0) nonFiniteReals.set(entry.path, nib.nonFiniteRealCount);
						if (nib !== null && nib.negativeZeroRealCount > 0) negativeZeroReals.set(entry.path, nib.negativeZeroRealCount);
						if (unknownDateCount !== 0) unknownDates.set(entry.path, unknownDateCount);
						if (datePrecisionOverlapCount > 0) datePrecisionOverlaps.set(entry.path, datePrecisionOverlapCount);
						if (unknownScalarCount !== 0) unknownScalars.set(entry.path, unknownScalarCount);
						const documentHash = createHash("sha256").update(bytes).digest("hex");
						documents.push({
							relativePath: entry.path,
							archiveSha256: documentHash,
							documentKind: entry.path.includes(".storyboardc/") ? "storyboard_scene" : "nib",
							raw,
							...numberLiterals === undefined ? {} : { numberLiterals },
							...nib === null || nib.omitted === 0 ? {} : { omittedSerializedHierarchyReferences: nib.omitted }
						});
					} catch (cause) {
						decodeBudget.release(plistReservation);
						if (input.signal?.aborted === true) throw cause;
						if (cause instanceof ArtifactReaderFailure) throw cause;
						if (cause instanceof InterfaceBuilderDecodeBudgetExceeded) {
							recordOmittedArchive(entry.path, cause.reason);
							continue;
						}
						if (cause instanceof UnsupportedBinaryPlistUidError) {
							recordOmittedArchive(entry.path, "unsupported_uid_exact_range");
							continue;
						}
						if (invalid.length < MAX_REPORTED_INVALID_ARCHIVES) invalid.push(`${entry.path}: ${cause instanceof Error ? cause.message : "archive decode failed"}`);
						else unreportedInvalidArchives += 1;
					}
				}
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			const released = await resources.release({
				kind: "reader",
				reader,
				resource: input.bundlePath
			});
			if (released.kind === "failed") throw resources.cleanupFailure(outcome, [released]);
			if (outcome.kind === "failed") throw outcome.cause;
			const result = buildInterfaceBuilderAnalysis({
				targetSha256: input.targetSha256,
				...input.resourceRoot === undefined ? {} : { resourceRoot: input.resourceRoot },
				toolVersion: "rea-interface-builder/1",
				documents,
				limits
			});
			return finalizeHierarchyCoverage(result, {
				unexaminedSources,
				incompleteHierarchies,
				unresolvedConnections,
				unknownDates,
				datePrecisionOverlaps,
				unknownScalars,
				nonFiniteReals,
				negativeZeroReals,
				invalid,
				unreportedInvalidArchives,
				omittedArchives,
				unreportedOmittedArchives,
				omissionCounts,
				attempted,
				omitted,
				traversal: traversal.snapshot()
			});
		};
		selectInterfaceBuilderCandidates = async (reader, signal, maximumDocuments, traversal) => {
			const capacity = maximumDocuments + MAX_REPORTED_OMITTED_ARCHIVES;
			const candidates = [];
			const symlinkSamples = [];
			let symlinks = 0;
			let unclassifiedSymlinks = 0;
			let firstUnclassifiedSymlink;
			let total = 0;
			for await (const entry of reader.entries(signal, traversal)) {
				if (entry.kind === "symlink") {
					if (isInterfaceBuilderArchive(entry.path) || entry.path.toLowerCase().endsWith(".storyboardc")) {
						symlinks += 1;
						retainCandidate(symlinkSamples, entry, MAX_REPORTED_OMITTED_ARCHIVES);
					} else {
						unclassifiedSymlinks += 1;
						firstUnclassifiedSymlink ??= entry.path;
					}
					continue;
				}
				if (entry.kind !== "file" || !isInterfaceBuilderArchive(entry.path)) continue;
				total += 1;
				retainCandidate(candidates, entry, capacity);
			}
			if (unclassifiedSymlinks > 0) traversal.onCoverage({
				status: "unknown",
				limitations: [`Interface Builder discovery did not follow ${unclassifiedSymlinks} symlink(s); whether they contain archives is unknown. First path: ${JSON.stringify(firstUnclassifiedSymlink)}.`]
			});
			const omittedSamples = candidates.slice(maximumDocuments, capacity);
			return {
				selected: candidates.slice(0, maximumDocuments),
				omittedSamples,
				symlinkSamples,
				omitted: Math.max(0, total - maximumDocuments) + symlinks,
				documentLimitOmissions: Math.max(0, total - maximumDocuments),
				symlinkOmissions: symlinks,
				unreportedOmitted: Math.max(0, total - maximumDocuments - omittedSamples.length) + symlinks - symlinkSamples.length
			};
		};
		retainCandidate = (candidates, entry, maximum) => {
			let low = 0;
			let high = candidates.length;
			while (low < high) {
				const middle = Math.floor((low + high) / 2);
				const existing = candidates[middle];
				if (existing !== undefined && compareUnicodeCodePoints(existing.path, entry.path) < 0) low = middle + 1;
				else high = middle;
			}
			candidates.splice(low, 0, entry);
			if (candidates.length > maximum) candidates.pop();
		};
		finalizeHierarchyCoverage = (result, counts) => {
			const { unexaminedSources, incompleteHierarchies, unresolvedConnections, unknownDates, datePrecisionOverlaps, unknownScalars, nonFiniteReals, negativeZeroReals, invalid, unreportedInvalidArchives, omittedArchives, unreportedOmittedArchives } = counts;
			const sourceReasons = new Set([...counts.omissionCounts.keys()].map((reason) => reason === "max_documents" ? "document_limit_reached" : reason === "symlink_not_followed" ? "archive_symlink_not_followed" : reason));
			if (invalid.length > 0) sourceReasons.add("one_or_more_archives_invalid");
			if (counts.traversal.status === "unknown") sourceReasons.add("source_traversal_unknown");
			const sourceDecodeReason = sourceReasons.size > 1 ? "multiple_archive_decode_causes" : sourceReasons.values().next().value ?? null;
			const archiveDecodeReason = sourceDecodeReason ?? (unexaminedSources.size > 0 ? "serialized_archive_content_unexamined" : null);
			const archiveObjectDecodeReason = sourceDecodeReason ?? ([...unexaminedSources.values()].some((sources) => sources.some((source) => source.facets.includes("objects"))) ? "serialized_archive_content_unexamined" : null);
			const archiveDecodePartial = archiveDecodeReason !== null;
			return {
				...result,
				documents: result.documents.map((document) => ({
					...document,
					hierarchy_complete: document.hierarchy_complete && !(unexaminedSources.get(document.relative_path) ?? []).some((source) => source.facets.includes("hierarchy")),
					connection_count: document.connection_count + (unresolvedConnections.get(document.relative_path) ?? 0)
				})),
				graph: {
					...result.graph,
					coverage: [
						...result.graph.coverage.map((facet) => {
							const omittedConnection = unresolvedConnections.get(facet.facet.replace(/^connections:/u, ""));
							const [kind, ...pathParts] = facet.facet.split(":");
							const source = (unexaminedSources.get(pathParts.join(":")) ?? []).find((source) => source.facets.some((affected) => affected === kind));
							if (source !== undefined) return {
								...facet,
								status: "partial",
								reason: facet.reason ?? source.reason
							};
							return facet.facet.startsWith("connections:") && omittedConnection !== undefined ? {
								...facet,
								status: "partial",
								reason: facet.reason ?? "connection_unresolved",
								omitted: facet.omitted + omittedConnection
							} : facet;
						}),
						{
							facet: "archive_decode",
							status: archiveDecodeReason === null ? "complete" : "partial",
							reason: archiveDecodeReason,
							examined: counts.attempted,
							omitted: counts.omitted
						},
						{
							facet: "archive_object_decode",
							status: archiveObjectDecodeReason === null ? "complete" : "partial",
							reason: archiveObjectDecodeReason,
							examined: counts.attempted,
							omitted: counts.omitted
						}
					],
					truncated: result.graph.truncated || counts.omitted > 0 || archiveDecodePartial || unresolvedConnections.size > 0
				},
				limitations: [
					...result.limitations,
					...counts.traversal.limitations,
					...[...unexaminedSources].flatMap(([path, sources]) => sources.map((source) => `${path}: ${source.description}`)),
					"Compiled Interface Builder archives are private serialized object graphs. The decoder reports only recognized keyed-archive objects and connections; unrecognized object classes and fields remain unknown.",
					...incompleteHierarchies.size === 0 ? [] : ["Some serialized hierarchy links could not be projected within the bounded hierarchy; their parentage remains unknown."],
					...unresolvedConnections.size === 0 ? [] : ["Some recognized NIBArchive connectors declare no resolvable owner; they carry no connection evidence and are reported as omissions."],
					...invalid.length === 0 ? [] : [`Some Interface Builder archives could not be decoded: ${invalid.join("; ")}`],
					...unreportedInvalidArchives === 0 ? [] : [`${unreportedInvalidArchives} additional archive decode failure diagnostic(s) were not retained; reporting is bounded to ${MAX_REPORTED_INVALID_ARCHIVES} paths.`],
					...[...unknownDates].map(([path, count]) => `${path}: ${unknownDateLimitation(count)}`),
					...[...datePrecisionOverlaps].map(([path, count]) => {
						return `${path}: ${binaryDatePrecisionOverlapLimitation(count)}`;
					}),
					...[...unknownScalars].map(([path, count]) => `${path}: ${unknownScalarLimitation(count)}`),
					...[...nonFiniteReals].map(([path, count]) => `${path}: ${nonFiniteRealLimitation(count)}`),
					...[...negativeZeroReals].map(([path, count]) => `${path}: ${negativeZeroRealLimitation(count)}`),
					...[...counts.omissionCounts].sort(([left], [right]) => left.localeCompare(right)).map(([reason, count]) => `${count} Interface Builder archive(s) omitted because ${reason.replaceAll("_", " ")}.`),
					...omittedArchives.flatMap(({ path, reason, limitations }) => [`${path}: omitted because ${reason.replaceAll("_", " ")}.`, ...limitations.map((limitation) => `${path}: ${limitation}`)]),
					...unreportedOmittedArchives === 0 ? [] : [`${unreportedOmittedArchives} additional omitted archive path(s) and their reasons were not retained; reporting is bounded to ${MAX_REPORTED_OMITTED_ARCHIVES} paths.`]
				]
			};
		};
		projectNibArchive = (archive, budget, maxHierarchyNodes) => {
			const unexaminedSources = [];
			for (const object of archive.objects) {
				const name = object.class_name.replace(/\0+$/u, "");
				if (name === "UINib" && ["UINib.archiveData", "archiveData"].some((key) => Object.hasOwn(object.values, key))) unexaminedSources.push({
					reason: "embedded_nib_archive_not_decoded",
					facets: [
						"objects",
						"connections",
						"hierarchy",
						"classes"
					],
					description: `UINib object ${object.id} retains embedded archive data whose objects, connections, classes and hierarchy are not decoded.`
				});
				if (name === "UIStoryboardShowSegueTemplate") unexaminedSources.push({
					reason: "storyboard_segue_template_not_decoded",
					facets: ["connections"],
					description: `Storyboard segue template object ${object.id} is retained as source data; its connection is not decoded.`
				});
			}
			const byId = new Map(archive.objects.map((object) => [object.id, object]));
			const normalizedClassNames = new Map();
			const normalizeClassName = (value) => {
				const known = normalizedClassNames.get(value);
				if (known !== undefined) return known;
				const normalized = value.replace(/\0+$/u, "");
				normalizedClassNames.set(value, normalized);
				return normalized;
			};
			const decodedStrings = new Map();
			const unavailableStringIds = new Set();
			const decodedString = (objectId, object) => {
				if (decodedStrings.has(objectId)) return decodedStrings.get(objectId) ?? null;
				const data = object.values["NS.bytes"];
				if (typeof data !== "object" || data === null || Array.isArray(data)) {
					decodedStrings.set(objectId, null);
					return null;
				}
				const encoded = data.$nib_data_base64;
				if (typeof encoded !== "string") {
					decodedStrings.set(objectId, null);
					return null;
				}
				budget.reserve(64 + encoded.length * 2, "NIBArchive string projection exceeds the aggregate Interface Builder decode budget");
				let value;
				try {
					value = new TextDecoder("utf-8", {
						fatal: true,
						ignoreBOM: true
					}).decode(Buffer.from(encoded, "base64"));
				} catch {
					unavailableStringIds.add(objectId);
					decodedStrings.set(objectId, null);
					return null;
				}
				decodedStrings.set(objectId, value);
				return value;
			};
			let projectedFields = 0;
			for (const object of archive.objects) projectedFields += Object.keys(object.values).length + Object.values(object.repeated_values ?? {}).reduce((count, values) => count + values.length, 0);
			budget.reserve(archive.objects.length * 128 + projectedFields * 128, "NIBArchive graph projection exceeds the aggregate Interface Builder decode budget");
			budget.reserve(archive.classes.length * 96, "NIBArchive class projection exceeds the aggregate Interface Builder decode budget");
			let nonFiniteRealCount = 0;
			let negativeZeroRealCount = 0;
			const projectedValues = new Map();
			const projectedRepeatedValues = new Map();
			for (const object of archive.objects) {
				const projected = projectPlistValue(object.values);
				nonFiniteRealCount += projected.nonFiniteRealCount;
				negativeZeroRealCount += projected.negativeZeroRealCount;
				projectedValues.set(object.id, projected.value);
				if (object.repeated_values !== undefined) {
					const repeated = projectPlistValue(object.repeated_values);
					nonFiniteRealCount += repeated.nonFiniteRealCount;
					negativeZeroRealCount += repeated.negativeZeroRealCount;
					projectedRepeatedValues.set(object.id, repeated.value);
				}
			}
			const dereference = (value) => {
				if (typeof value !== "object" || value === null || Array.isArray(value)) return value;
				const encodedData = value.$nib_data_base64;
				if (typeof encodedData === "string") {
					budget.reserveBase64JsonStringOccurrence(encodedData);
					return value;
				}
				const ref = value.$nib_object_ref;
				if (typeof ref !== "number") return value;
				const target = byId.get(ref);
				if (target === undefined) return undefined;
				if (normalizeClassName(target.class_name) === "NSString") {
					const string = decodedString(ref, target);
					if (string !== null) {
						budget.reserveJsonStringOccurrence(string);
						return string;
					}
				}
				return { objectID: String(ref) };
			};
			const referencedString = (value) => {
				if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
				const ref = value.$nib_object_ref;
				if (typeof ref !== "number") return null;
				const target = byId.get(ref);
				if (target === undefined || normalizeClassName(target.class_name) !== "NSString") return null;
				const string = decodedString(ref, target);
				if (string === null) return null;
				budget.reserveJsonStringOccurrence(string);
				return string;
			};
			const runtimeClasses = new Map();
			const runtimeClass = (objectId) => {
				if (runtimeClasses.has(objectId)) return runtimeClasses.get(objectId) ?? null;
				const object = byId.get(objectId);
				if (object === undefined) return null;
				const storedClass = normalizeClassName(object.class_name);
				const resolvedClass = interfaceBuilderRuntimeClassName(storedClass, (field) => {
					const value = object.values[field];
					return typeof value === "string" ? value : referencedString(value);
				});
				runtimeClasses.set(objectId, resolvedClass);
				return resolvedClass;
			};
			const projectObject = (object) => {
				const className = runtimeClass(object.id) ?? normalizeClassName(object.class_name);
				budget.reserveJsonStringOccurrence(className);
				let name = className;
				for (const [key, value] of Object.entries(object.values)) {
					if (!/(?:title|label|identifier|accessibility|name|contents)/iu.test(key)) continue;
					const resolved = dereference(value);
					if (typeof resolved !== "string") continue;
					name = resolved;
					break;
				}
				budget.reserveJsonStringOccurrence(name);
				const nibValues = Object.fromEntries(Object.entries(projectedValues.get(object.id) ?? {}).map(([key, value]) => {
					budget.reserveJsonPropertyNameOccurrence(key);
					return [key, dereference(value) ?? null];
				}));
				const resourceFields = appleResourceKeyFields(nibValues);
				for (const [field, value] of resourceFields) {
					budget.reserveJsonPropertyNameOccurrence(field);
					budget.reserveJsonStringOccurrence(value);
				}
				return [String(object.id), {
					customClass: className,
					label: name,
					objectID: String(object.id),
					nibValues,
					...projectedRepeatedValues.has(object.id) ? { nibRepeatedValues: projectedRepeatedValues.get(object.id) } : {},
					...className === normalizeClassName(object.class_name) ? {} : { interface_builder_archived_class_name: normalizeClassName(object.class_name) },
					...Object.fromEntries(resourceFields)
				}];
			};
			const objects = Object.fromEntries(archive.objects.filter((object) => {
				const name = normalizeClassName(object.class_name);
				return !/^(?:NSObject|NSIBObjectData|NSString|NSMutableString|NSNumber|NSArray|NSMutableArray|NSSet|NSMutableSet|NSDictionary|NSMutableDictionary|NSApplication|NSNib.*Connector)$/u.test(name) && !isUIKitRuntimeConnectionClass(name);
			}).map(projectObject));
			const connections = {};
			let unresolvedConnections = 0;
			const reference = (value) => {
				if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
				return typeof value.$nib_object_ref === "number" ? value.$nib_object_ref : null;
			};
			for (const object of archive.objects) {
				const className = normalizeClassName(object.class_name);
				if (!isInterfaceBuilderConnectionClass(className)) continue;
				const values = object.values;
				const connectionFields = interfaceBuilderConnectionFieldNames(className);
				if (isSourceLessAppKitAnnotationConnector(className, values)) continue;
				const source = reference(values[connectionFields.source]);
				if (source === null) {
					unresolvedConnections += 1;
					continue;
				}
				const destination = reference(values[connectionFields.destination]);
				const label = referencedString(values[connectionFields.label]);
				const type = className.includes("Outlet") ? "outlet" : className.includes("Control") || className.includes("Event") ? "action" : className;
				budget.reserveJsonStringOccurrence(type);
				const eventMask = values.UIEventMask;
				const members = className === "UIRuntimeOutletCollectionConnection" ? nibCollectionMembers(destination === null ? undefined : byId.get(destination)) : undefined;
				if (className === "UIRuntimeOutletCollectionConnection" && members === undefined) {
					unresolvedConnections += 1;
					continue;
				}
				if (members !== undefined && members.length === 0) {
					unexaminedSources.push({
						reason: "empty_outlet_collection_not_projected",
						facets: ["connections"],
						description: `Outlet collection object ${object.id} has no serialized members; its raw collection endpoint is not projected as a relationship.`
					});
					continue;
				}
				const destinations = members === undefined ? [destination] : members.map(reference);
				for (const [memberIndex, member] of destinations.entries()) {
					if (members !== undefined && member === null) {
						unresolvedConnections += 1;
						continue;
					}
					(connections[String(source)] ??= []).push({
						type,
						"destination-id": member === null ? null : String(member),
						label,
						source_id: String(source),
						archive_object_id: String(object.id),
						...members === undefined ? {} : {
							archive_collection_id: destination,
							archive_collection_member_index: memberIndex
						},
						...typeof eventMask === "number" ? { ui_event_mask: eventMask } : {}
					});
				}
			}
			for (const id of unavailableStringIds) {
				const object = byId.get(id);
				if (object !== undefined) {
					const [key, value] = projectObject(object);
					objects[key] = value;
				}
			}
			if (unavailableStringIds.size > 0) unexaminedSources.push({
				reason: "nib_string_utf8_unavailable",
				facets: [
					"objects",
					"connections",
					"classes"
				],
				description: `NSString NS.bytes is not valid UTF-8 for ${unavailableStringIds.size} source objects; their bytes and object IDs are retained, while dependent class names, titles and selectors remain unknown.`
			});
			const viewHierarchy = projectNibViewHierarchy(archive.objects, new Set(Object.keys(objects).map(Number)), () => budget.tryReserve(128), maxHierarchyNodes, (description) => {
				budget.reserve(256, "NIB registry hierarchy diagnostics exceed the aggregate Interface Builder decode budget");
				budget.reserveJsonStringOccurrence(description);
				unexaminedSources.push({
					reason: "nib_registry_parentage_unexamined",
					facets: ["hierarchy"],
					description
				});
			});
			return {
				omitted: viewHierarchy.omitted,
				unexaminedSources,
				unresolvedConnections,
				nonFiniteRealCount,
				negativeZeroRealCount,
				raw: jsonValueSchema.parse({
					"com.apple.ibtool.document.objects": objects,
					"com.apple.ibtool.document.connections": connections,
					"com.apple.ibtool.document.hierarchy": viewHierarchy.hierarchy ?? [],
					"com.apple.ibtool.document.classes": Object.fromEntries(archive.classes.map((name) => {
						const className = normalizeClassName(name);
						budget.reserveJsonPropertyNameOccurrence(className);
						return [className, {}];
					}))
				})
			};
		};
		isInterfaceBuilderArchive = (path) => {
			const lower = path.toLowerCase();
			return lower.endsWith(".nib") || lower.endsWith("/objects.nib");
		};
		readEntry = async (reader, entry, signal, maxInputBytes = MAX_AGGREGATE_INPUT_BYTES) => {
			if (entry.declaredSize !== null && entry.declaredSize > maxInputBytes) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "archive exceeds the aggregate Interface Builder decode budget");
			const stream = await reader.open(entry, signal);
			const chunks = [];
			let length = 0;
			for await (const chunk of stream) {
				const bytes = streamChunkToBuffer(chunk);
				length += bytes.length;
				if (length > maxInputBytes) {
					stream.destroy();
					throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "archive exceeded the aggregate Interface Builder decode budget");
				}
				chunks.push(bytes);
			}
			return Buffer.concat(chunks, length);
		};
		parseXmlWithinDecodeBudget = (text) => {
			try {
				return parseXmlPropertyList(text);
			} catch (cause) {
				if (cause instanceof RangeError) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", cause.message);
				throw cause;
			}
		};
		decodePlist = (bytes, xmlText, scalarPlan) => {
			const binary = hasBinaryPlistSignature(bytes);
			const binaryScalarMetadata = binary ? scanBinaryPlistScalars(bytes, scalarPlan) : undefined;
			const { value, numberLiterals } = binary ? {
				value: decodeBinaryPlistValue(bytes, scalarPlan, binaryScalarMetadata),
				numberLiterals: binaryScalarMetadata.literals
			} : parseXmlWithinDecodeBudget(xmlText ?? decodeXmlPlistText(bytes));
			const projected = projectPlistValue(value);
			return {
				value: projected.value,
				unknownDateCount: projected.unknownDateCount,
				unknownScalarCount: projected.unknownScalarCount,
				numberLiterals
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/AppleAssetCatalogAnalysis.js
var ASSETUTIL, MAX_CATALOG_BYTES, MAX_TOTAL_METADATA_BYTES, analyzeAppleAssetCatalogs, collectAssetCatalogs, inspectAssetCatalogEntry, collectInterfaceBuilderResourceKeys, runAssetUtil, assetUtilFailure, digestBounded;
function init_AppleAssetCatalogAnalysis() {
	return (init_AppleAssetCatalogAnalysis = __esmMin((() => {
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_fixedAllowanceRemediation();
		init_StreamBytes();
		init_DirectoryArtifactReader();
		init_ArtifactResourceScope();
		init_ArtifactOperationFailure();
		init_analysisErrorCleanup();
		init_ArtifactTraversalObservation();
		init_ArtifactReader();
		init_artifactOperationError();
		init_InterfaceBuilderAnalysis();
		init_appleAssetCatalog();
		init_ExecFileOutput();
		ASSETUTIL = "/usr/bin/assetutil";
		MAX_CATALOG_BYTES = 64 * 1024 * 1024;
		MAX_TOTAL_METADATA_BYTES = 64 * 1024 * 1024;
		analyzeAppleAssetCatalogs = async (input) => {
			if (process.platform !== "darwin" && input.runAssetUtil === undefined) throw new ArtifactReaderFailure("unavailable", "Apple asset catalog inspection requires macOS assetutil");
			const page = appleAssetCatalogInputSchema.parse(input.page ?? {});
			const resources = input.resources ?? new ArtifactResourceScope();
			const interfaceBuilderCancel = new AbortController();
			const interfaceBuilderAnalysis = (input.analyzeInterfaceBuilder ?? analyzeInterfaceBuilderBundle)({
				bundlePath: input.bundlePath,
				targetSha256: input.targetSha256,
				resources,
				...input.resourceRoot === undefined ? {} : { resourceRoot: input.resourceRoot },
				signal: input.signal === undefined ? interfaceBuilderCancel.signal : AbortSignal.any([input.signal, interfaceBuilderCancel.signal])
			}).then((value) => ({
				ok: true,
				value
			}), (error) => ({
				ok: false,
				error
			}));
			let catalogs;
			let uninspected;
			let traversal;
			let catalogCoverage;
			try {
				({catalogs, uninspected, traversal, coverage: catalogCoverage} = await resources.run(() => collectAssetCatalogs({
					...input,
					resources
				})));
			} catch (cause) {
				interfaceBuilderCancel.abort();
				const joined = await interfaceBuilderAnalysis;
				if (!joined.ok && (joined.error instanceof ArtifactReaderFailure && joined.error.cleanup !== undefined || joined.error instanceof AnalysisError && joined.error.cleanupIncomplete)) {
					const primary = translateArtifactFailure("inspect_asset_catalog", cause);
					const cleanup = translateArtifactFailure("inspect_asset_catalog", joined.error);
					throw analysisErrorWithCleanupFailure(primary, cleanup, "inspect_asset_catalog").bindCleanupDependencies([primary, cleanup]);
				}
				throw cause;
			}
			const analyzed = await interfaceBuilderAnalysis;
			if (!analyzed.ok) throw analyzed.error;
			const interfaceBuilder = analyzed.value;
			const resourceReferences = collectInterfaceBuilderResourceKeys(interfaceBuilder.graph.nodes);
			const resourceObjectsIncomplete = interfaceBuilder.graph.coverage.some(({ facet, status }) => (facet === "archive_object_decode" || facet === "documents" || facet.startsWith("objects:")) && status !== "complete");
			const result = projectAppleAssetCatalogPage({
				targetSha256: input.targetSha256,
				...input.resourceRoot === undefined ? {} : { resourceRoot: input.resourceRoot },
				catalogs,
				inventoryCoverage: {
					scope: "container-entries",
					status: traversal.status
				},
				catalogCoverage,
				resourceKeyCoverage: catalogCoverage.status !== "complete" ? catalogCoverage : resourceObjectsIncomplete ? {
					status: "partial",
					reason: "interface_builder_graph_incomplete"
				} : {
					status: "complete",
					reason: null
				},
				offset: page.offset,
				limit: page.limit,
				resourceReferences
			});
			return {
				...result,
				limitations: [
					...result.limitations,
					...traversal.limitations,
					...catalogs.length === 0 ? ["No compiled Assets.car catalog was found among the app bundle's regular files (symlinks are not followed); any resource keys are reported as unmatched."] : [],
					...uninspected.length === 0 ? [] : [`Asset catalog entries that are not regular files were not inspected, so resource keys reported as unmatched may resolve there: ${uninspected.join(", ")}`],
					"Exact resource-key joins use only recognized image or asset key fields on decoded Interface Builder resource objects; other archive resource references are not inferred.",
					...resourceObjectsIncomplete ? ["Interface Builder resource-key joins may be incomplete because the decoded object inventory is incomplete."] : []
				]
			};
		};
		collectAssetCatalogs = async (input) => {
			const reader = new DirectoryArtifactReader(input.bundlePath);
			const catalogs = [];
			const uninspected = [];
			const traversal = new ArtifactTraversalObservation();
			let symlinks = 0;
			let firstSymlink;
			let totalMetadataBytes = 0;
			let outcome = { kind: "completed" };
			try {
				for await (const entry of reader.entries(input.signal, {
					onCoverage: traversal.onCoverage,
					onOmission: (omission) => {
						traversal.onOmission(omission);
						const { path, kind } = omission;
						if (path.split("/").at(-1) === "Assets.car") uninspected.push(`${path} (${kind})`);
					}
				})) {
					if (entry.kind === "symlink" && entry.path.split("/").at(-1) !== "Assets.car") {
						symlinks += 1;
						firstSymlink ??= entry.path;
					}
					if (entry.path.split("/").at(-1) !== "Assets.car") continue;
					if (entry.kind !== "file") {
						uninspected.push(`${entry.path} (${entry.kind})`);
						continue;
					}
					const inspected = await inspectAssetCatalogEntry({
						reader,
						entry,
						runAssetUtil: input.runAssetUtil ?? ((path, signal) => runAssetUtil(path, input.environment, signal)),
						...input.signal === undefined ? {} : { signal: input.signal }
					});
					totalMetadataBytes += inspected.metadataBytes;
					if (totalMetadataBytes > MAX_TOTAL_METADATA_BYTES) throw new ArtifactReaderFailure("limit", `Combined asset catalog metadata exceeds ${MAX_TOTAL_METADATA_BYTES} bytes`);
					catalogs.push(inspected.catalog);
				}
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			const released = await input.resources.release({
				kind: "reader",
				reader,
				resource: input.bundlePath
			});
			if (released.kind === "failed") {
				if (outcome.kind === "failed" && outcome.cause instanceof AnalysisError) {
					const cleanup = translateArtifactFailure("inspect_asset_catalog", input.resources.cleanupFailure({ kind: "completed" }, [released]));
					throw analysisErrorWithCleanupFailure(outcome.cause, cleanup, "inspect_asset_catalog").bindCleanupDependencies([outcome.cause, cleanup]);
				}
				throw input.resources.cleanupFailure(outcome, [released]);
			}
			if (outcome.kind === "failed") throw outcome.cause;
			if (symlinks > 0) traversal.onCoverage({
				status: "complete",
				limitations: [`Asset catalog discovery did not follow ${symlinks} symlink(s); catalogs beneath them may remain uninspected. First path: ${JSON.stringify(firstSymlink)}.`]
			});
			if (catalogs.length === 0 && uninspected.length > 0) throw new ArtifactReaderFailure("path", `Asset catalog entries are not regular files and were not inspected: ${uninspected.join(", ")}`);
			const coverage = traversal.snapshot().status === "unknown" || symlinks > 0 ? {
				status: "unknown",
				reason: "source_names_or_symlink_targets_unexamined"
			} : uninspected.length > 0 ? {
				status: "partial",
				reason: "catalog_entries_uninspected"
			} : {
				status: "complete",
				reason: null
			};
			return {
				catalogs,
				uninspected,
				traversal: traversal.snapshot(),
				coverage
			};
		};
		inspectAssetCatalogEntry = async (input) => {
			const { entry, reader, signal } = input;
			const sha256 = await digestBounded(reader, entry, signal);
			const before = await lstat(entry.adapterKey, { bigint: true });
			if (!before.isFile() || !sameArtifactSourceIdentity(entry.sourceIdentity, before)) throw new ArtifactReaderFailure("integrity", `Asset catalog changed before inspection: ${entry.path}`);
			let output;
			try {
				output = await input.runAssetUtil(entry.adapterKey, signal);
			} catch (cause) {
				throw assetUtilFailure(cause, entry);
			}
			const after = await lstat(entry.adapterKey, { bigint: true });
			if (!after.isFile() || !sameArtifactSourceIdentity(entry.sourceIdentity, after) || await digestBounded(reader, entry, signal) !== sha256) throw new ArtifactReaderFailure("integrity", `Asset catalog changed during inspection: ${entry.path}`);
			const capturedOutput = {
				stdout: output,
				stderr: "",
				truncated: false,
				stdout_bytes: Buffer.byteLength(output),
				exit_code: 0,
				signal: null
			};
			const diagnostics = { catalog_path: entry.path };
			let parsed;
			try {
				parsed = JSON.parse(output);
			} catch (cause) {
				throw new AnalysisOutputError("inspect_asset_catalog", `assetutil returned invalid JSON for ${entry.path}`, {
					cause,
					capturedOutput,
					diagnostics
				});
			}
			try {
				return {
					catalog: {
						path: entry.path,
						sha256,
						records: parseAppleAssetCatalogRecords(parsed)
					},
					metadataBytes: Buffer.byteLength(output, "utf8")
				};
			} catch (cause) {
				if (!(cause instanceof AnalysisOutputError)) throw cause;
				throw new AnalysisOutputError("inspect_asset_catalog", `${cause.reason} for ${entry.path}`, {
					cause,
					capturedOutput,
					diagnostics
				});
			}
		};
		collectInterfaceBuilderResourceKeys = (nodes) => nodes.flatMap((node) => {
			if (node.kind !== "resource") return [];
			const source = node.evidence.find((item) => item.artifact_path !== null && item.artifact_sha256 !== null);
			const sourcePath = source?.artifact_path;
			const sourceArchiveSha256 = source?.artifact_sha256;
			if (sourcePath == null || sourceArchiveSha256 == null) return [];
			return appleResourceKeyFields(node.attributes).flatMap(([field, value]) => [{
				sourceNodeId: node.id,
				sourcePath,
				sourceArchiveSha256,
				field,
				key: value
			}]);
		});
		runAssetUtil = async (path, environment, signal) => (await execFileOutput(ASSETUTIL, ["--info", path], {
			env: environment,
			timeout: 6e4,
			maxBuffer: MAX_CATALOG_BYTES,
			stopSignal: "SIGTERM",
			...signal === undefined ? {} : { signal }
		})).stdout;
		assetUtilFailure = (cause, entry) => {
			if (cause instanceof AnalysisError) return cause;
			if (cause instanceof ExecFileOutputCancelledError) return new ArtifactReaderFailure("cancelled", "Asset catalog inspection cancelled", { cause: cause.cause });
			const output = execFileOutputFailure(cause);
			const code = cause instanceof Error && "code" in cause ? cause.code : undefined;
			const capturedOutput = output === undefined ? undefined : execFileFailureCapturedOutput(output);
			const options = {
				cause,
				capturedOutput,
				diagnostics: { catalog_path: entry.path }
			};
			if (code === "ETIMEDOUT") return new AnalysisTimeoutError("inspect_asset_catalog", 6e4, options);
			if (code === "ENOENT") return new AnalysisCapabilityUnavailableError("artifact", "inspect_asset_catalog", "macOS assetutil is unavailable", options);
			if (code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER") return new AnalysisResourceConstraintError("inspect_asset_catalog", "transport", "assetutil output exceeds the 64 MiB capture allowance", { maximum_output_bytes: MAX_CATALOG_BYTES }, {
				...options,
				...fixedAllowanceOptions("the fixed 64 MiB assetutil capture allowance", "capture")
			});
			if (output !== undefined) {
				const rejectsCatalog = [
					`carutil: error:\n    ${entry.adapterKey} is not a valid AssetCatalog`,
					`carutil: error:\n\t${entry.adapterKey} is not a valid AssetCatalog`,
					`assetutil: file error error exiting: 'can't read from: '${entry.adapterKey}' Undefined error: 0' invalid file`
				].some((rejection) => {
					const offset = output.stderr.indexOf(rejection);
					const end = offset + rejection.length;
					return offset >= 0 && (offset === 0 || output.stderr[offset - 1] === "\n") && (end === output.stderr.length || output.stderr[end] === "\n");
				});
				if (output.code === 1 && output.signal === null && !output.killed && !output.outputTruncated && output.collectionFailure !== true && rejectsCatalog) return new ArtifactOperationError("inspect_asset_catalog", "format", undefined, `assetutil rejected ${entry.path} as an invalid asset catalog`, options);
				return new AnalysisOutputError("inspect_asset_catalog", `assetutil did not produce usable catalog metadata for ${entry.path}`, options);
			}
			return cause;
		};
		digestBounded = async (reader, entry, signal) => {
			if (entry.declaredSize === null || entry.declaredSize > MAX_CATALOG_BYTES) throw new ArtifactReaderFailure("limit", `Asset catalog exceeds ${MAX_CATALOG_BYTES} bytes: ${entry.path}`);
			const stream = await reader.open(entry, signal);
			const hash = createHash("sha256");
			let length = 0;
			for await (const chunk of stream) {
				if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Asset catalog inspection cancelled", { cause: signal.reason });
				const bytes = streamChunkToBuffer(chunk);
				length += bytes.length;
				if (length > MAX_CATALOG_BYTES) throw new ArtifactReaderFailure("limit", `Asset catalog exceeds byte limit: ${entry.path}`);
				hash.update(bytes);
			}
			return hash.digest("hex");
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactProvider.js
var ArtifactProvider, serializedResourceRoot, BundleResourceArtifactClient, ArtifactClient, espFlashSelection, isArtifactOperation, subjectFor;
function init_ArtifactProvider() {
	return (init_ArtifactProvider = __esmMin((() => {
		init_runtimeAnalysisSettings();
		init_artifactTargetApplicability();
		init_ArtifactFileOperation();
		init_ArtifactOperationFailure();
		init_snapshotEnvironment();
		init_AnalysisProvider();
		init_KeyedArchiveReader();
		init_DylibResolutionReader();
		init_withArtifactTargetIdentity();
		init_ArtifactInventory();
		init_ArtifactExtraction();
		init_InterfaceBuilderAnalysis();
		init_AppleAssetCatalogAnalysis();
		init_artifactToolContracts();
		init_binaryTargetTypes();
		init_analysisErrorCore();
		init_interfaceBuilderGraph();
		init_result();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_ArtifactProviderMetadata();
		init_investigationProviders();
		init_evidence();
		init_immutableJson();
		init_artifactInspection();
		init_providerCleanupError();
		init_BundleResourceSession();
		ArtifactProvider = class {
			settings;
			#capabilities;
			#platform;
			environment;
			constructor(environment, platform = process.platform, settings) {
				this.settings = settings;
				this.environment = snapshotEnvironment(environment, platform);
				this.#capabilities = artifactCapabilities(platform);
				this.#platform = platform;
			}
			identity() {
				return ARTIFACT_GRAPH_PROVIDER;
			}
			capabilities() {
				return this.#capabilities;
			}
			createClient(target) {
				return new ArtifactClient(target, this.environment, this.#platform, this.settings);
			}
			createBundleResourceClient(root) {
				return new BundleResourceArtifactClient(root, this.environment, this.#platform);
			}
		};
		serializedResourceRoot = (root) => ({
			caller_path: root.callerPath,
			canonical_path: root.canonicalPath,
			info_plist_path: root.infoPlistPath,
			layout: root.layout,
			executable_sha256: root.executableSha256
		});
		BundleResourceArtifactClient = class {
			root;
			environment;
			platform;
			#resourceScope = new ArtifactResourceScope();
			constructor(root, environment, platform) {
				this.root = root;
				this.environment = environment;
				this.platform = platform;
			}
			async execute(operation, parameters, options) {
				if (operation === "health") return ok(createAnalysisExecution(null, ARTIFACT_GRAPH_PROVIDER));
				if (!BUNDLE_ARTIFACT_RESOURCE_OPERATIONS.has(operation)) return err(new AnalysisCapabilityUnavailableError(ARTIFACT_GRAPH_PROVIDER.id, operation, "The app resource reader supports only plist, Interface Builder, asset catalog, and keyed archive inspection."));
				try {
					const resourceRoot = serializedResourceRoot(this.root);
					const result = operation === "decode_interface_builder" ? await analyzeInterfaceBuilderBundle({
						bundlePath: this.root.canonicalPath,
						targetSha256: null,
						resourceRoot,
						resources: this.#resourceScope,
						limits: interfaceBuilderLimitsSchema.parse(parameters),
						...options?.signal === undefined ? {} : { signal: options.signal }
					}) : operation === "inspect_keyed_archive" ? await inspectBundleKeyedArchive({
						bundlePath: this.root.canonicalPath,
						targetSha256: null,
						resourceRoot,
						parameters,
						platform: this.platform,
						resources: this.#resourceScope,
						...options?.signal === undefined ? {} : { signal: options.signal }
					}) : operation === "inspect_asset_catalog" ? await analyzeAppleAssetCatalogs({
						bundlePath: this.root.canonicalPath,
						targetSha256: null,
						resourceRoot,
						environment: this.environment,
						resources: this.#resourceScope,
						page: parameters,
						...options?.signal === undefined ? {} : { signal: options.signal }
					}) : (() => {
						throw new AnalysisCapabilityUnavailableError(ARTIFACT_GRAPH_PROVIDER.id, operation, "Property list inspection requires a platform-native reader.");
					})();
					return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, { limitations: "limitations" in result ? result.limitations : [] }));
				} catch (cause) {
					return err(translateArtifactFailure(operation, cause));
				}
			}
			close() {
				return this.#resourceScope.close().then(() => ok(null), (cause) => err(new ProviderCleanupError(ARTIFACT_GRAPH_PROVIDER.id, ["app bundle resource reader"], { reason: cause instanceof Error ? cause.message : String(cause) }, {
					cause,
					operation: "close_binary"
				})));
			}
		};
		ArtifactClient = class {
			target;
			environment;
			platform;
			settings;
			#resourceScope = new ArtifactResourceScope();
			constructor(target, environment, platform, settings) {
				this.target = target;
				this.environment = environment;
				this.platform = platform;
				this.settings = settings;
			}
			async execute(operation, parameters, options) {
				if (operation === "health") return ok(createAnalysisExecution(null, ARTIFACT_GRAPH_PROVIDER));
				if (!isArtifactOperation(operation)) return err(new AnalysisCapabilityUnavailableError(ARTIFACT_GRAPH_PROVIDER.id, operation, "Operation is not implemented by artifact graph provider."));
				try {
					const targetRefusal = artifactTargetRefusal(operation, this.target);
					if (targetRefusal !== undefined) throw this.unsupportedTarget(operation, targetRefusal.reason);
					if (operation === "inspect_artifact") {
						const inspected = await this.inspectArtifact(parameters, options);
						return inspected;
					}
					if (operation === "decode_interface_builder") {
						const limits = interfaceBuilderLimitsSchema.parse(parameters);
						const result = await withArtifactTargetIdentity(this.target, this.#resourceScope, () => analyzeInterfaceBuilderBundle({
							bundlePath: this.target.sourcePath ?? this.target.path,
							targetSha256: this.target.sha256,
							limits,
							resources: this.#resourceScope,
							...options?.signal === undefined ? {} : { signal: options.signal }
						}), options?.signal);
						return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
							limitations: result.limitations,
							locations: result.documents.map(({ relative_path: path }) => ({
								kind: "artifact-path",
								path
							}))
						}));
					}
					if (operation === "inspect_keyed_archive") {
						const standalone = this.target.bundleInfoPlist === undefined && this.target.kind === "artifact" && this.target.format === "plist";
						const selectedPath = artifactTargetSelectedPath(this.target);
						const result = standalone ? await inspectStandaloneKeyedArchive({
							path: this.target.path,
							selectedPath,
							targetSha256: this.target.sha256,
							parameters,
							platform: this.platform,
							resources: this.#resourceScope,
							...options?.signal === undefined ? {} : { signal: options.signal }
						}) : await withArtifactTargetIdentity(this.target, this.#resourceScope, () => inspectBundleKeyedArchive({
							bundlePath: this.target.sourcePath ?? this.target.path,
							targetSha256: this.target.sha256,
							parameters,
							platform: this.platform,
							resources: this.#resourceScope,
							...options?.signal === undefined ? {} : { signal: options.signal }
						}), options?.signal);
						return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
							limitations: result.limitations,
							locations: [{
								kind: "artifact-path",
								path: result.archive_path
							}],
							...standalone ? { subject: {
								path: selectedPath,
								sha256: result.archive_sha256,
								format: "plist"
							} } : {}
						}));
					}
					if (operation === "inspect_asset_catalog") {
						return await this.inspectAssetCatalog(parameters, options);
					}
					if (operation === "trace_dylib_resolution") return await this.traceDylibResolution(parameters, options);
					if (operation === "extract_artifact") {
						const parsed = artifactExtractionExecutionSchema.parse(parameters);
						const result = await extractArtifact({
							inputPath: this.target.sourcePath ?? this.target.path,
							expectedRootSha256: this.target.bundleInfoPlist === undefined ? this.target.sha256 : undefined,
							selectedPath: this.target.artifactSelectedPath,
							inputFormat: this.target.format,
							espFlashSelection: espFlashSelection(this.target),
							outputRoot: parsed.output_root,
							environment: this.environment,
							asarHeaderAdmission: runtimeAsarHeaderAdmission(this.environment, this.settings),
							integrityPolicy: parsed.integrity_policy,
							resourceScope: this.#resourceScope
						}, options?.signal);
						return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
							rawResult: null,
							limitations: result.limitations,
							subject: subjectFor(artifactTargetSelectedPath(this.target), result.manifest),
							locations: []
						}));
					}
					const parsed = artifactInventoryInputSchema.parse(parameters);
					const result = await this.inventory(parsed, options);
					return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
						rawResult: null,
						limitations: result.limitations,
						subject: subjectFor(artifactTargetSelectedPath(this.target), result.manifest),
						locations: []
					}));
				} catch (cause) {
					return err(translateArtifactFailure(operation, cause));
				}
			}
			close() {
				return this.#resourceScope.close().then(() => ok(null), (cause) => {
					const failure = cause instanceof ArtifactReaderFailure ? cause : undefined;
					const error = new ProviderCleanupError(ARTIFACT_GRAPH_PROVIDER.id, failure?.cleanup?.resources ?? ["artifact resources"], { reason: failure?.cleanup?.reason ?? (cause instanceof Error ? cause.message : String(cause)) }, {
						cause,
						operation: "close_binary"
					});
					bindArtifactFileCleanup(cause, error);
					return err(error);
				});
			}
			/** The active target's kind is outside this operation's supported targets. */
			unsupportedTarget(operation, reason) {
				return new AnalysisUnsupportedTargetError(operation, this.target.sourcePath ?? this.target.path, reason);
			}
			async inspectAssetCatalog(parameters, options) {
				const bundlePath = this.target.sourcePath ?? this.target.path;
				const result = await withArtifactTargetIdentity(this.target, this.#resourceScope, () => analyzeAppleAssetCatalogs({
					environment: this.environment,
					bundlePath,
					resources: this.#resourceScope,
					targetSha256: this.target.sha256,
					page: parameters,
					...options?.signal === undefined ? {} : { signal: options.signal }
				}), options?.signal);
				return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
					limitations: result.limitations,
					locations: result.catalogs.map(({ path }) => ({
						kind: "artifact-path",
						path
					}))
				}));
			}
			async traceDylibResolution(parameters, options) {
				const bundle = this.target.bundleInfoPlist === undefined ? undefined : this.target.sourcePath;
				const result = await traceDylibResolution({
					rootPath: bundle ?? dirname(this.target.path),
					targetPath: this.target.path,
					targetSha256: this.target.sha256,
					enumerateRoots: bundle !== undefined,
					parameters,
					resourceScope: this.#resourceScope,
					...options?.signal === undefined ? {} : { signal: options.signal }
				});
				return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
					limitations: result.limitations,
					locations: result.images.map(({ path }) => ({
						kind: "artifact-path",
						path
					}))
				}));
			}
			async inspectArtifact(parameters, options) {
				const parsed = artifactInventoryInputSchema.parse(parameters);
				const inventoryParameters = { integrity_policy: parsed.integrity_policy };
				await options?.progress?.report({
					phase: "inspect_artifact.inventory",
					completed: 0,
					total: 1,
					message: "inventory substep started"
				});
				const inventory = freezeJsonSnapshot(await this.inventory(inventoryParameters, options));
				const subject = subjectFor(artifactTargetSelectedPath(this.target), inventory.manifest);
				const inventoryEvidence = createEvidence(subject, ARTIFACT_GRAPH_PROVIDER, {
					operation: "inventory_artifact",
					parameters: inventoryParameters,
					result: inventory,
					rawResult: null,
					limitations: inventory.limitations,
					locations: []
				});
				const result = freezeJsonSnapshot(createArtifactInspection(inventoryEvidence));
				await options?.progress?.report({
					phase: "inspect_artifact.inventory",
					completed: 1,
					total: 1,
					message: "inventory substep completed"
				});
				return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
					rawResult: null,
					limitations: result.limitations,
					sourceEvidence: artifactInspectionSources(result),
					subject,
					locations: []
				}));
			}
			inventory(parsed, options) {
				return inventoryArtifact(this.target.sourcePath ?? this.target.path, {
					expectedRootSha256: this.target.bundleInfoPlist === undefined ? this.target.sha256 : undefined,
					selectedPath: this.target.artifactSelectedPath,
					resourceScope: this.#resourceScope,
					environment: this.environment,
					asarHeaderAdmission: runtimeAsarHeaderAdmission(this.environment, this.settings),
					espFlashSelection: espFlashSelection(this.target),
					...options?.signal === undefined ? {} : { signal: options.signal },
					integrity: parsed.integrity_policy
				});
			}
		};
		espFlashSelection = (target) => target.format === "esp-flash-image" && target.espFlash.selected ? {
			flashOffset: target.espFlash.flashOffset ?? undefined,
			partitionTableOffset: target.espFlash.partitionTableOffset ?? undefined
		} : undefined;
		isArtifactOperation = (operation) => ARTIFACT_ANALYSIS_OPERATIONS.includes(operation);
		subjectFor = (path, manifest) => ({
			path,
			sha256: manifest.root_sha256,
			format: manifest.root_format
		});
	})))();
}

//#endregion
init_ArtifactProvider();
export { ArtifactProvider };