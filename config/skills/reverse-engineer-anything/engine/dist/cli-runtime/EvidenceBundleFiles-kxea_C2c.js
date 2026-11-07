import { __esmMin, __exportAll } from "./rolldown-runtime-DXoylpqc.js";
import { EvidenceFileError, EvidenceIntegrityError, bufferedJsonParts, canonicalJsonParts, err, init_evidenceErrors, init_jsonSerialization, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisCancelledError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { BINARY_ARCHITECTURES, RAW_ONLY_ARCHITECTURES, analysisProfileSchema, analysisProfilesEqual, binaryArchitectureSchema, canonicalJsonDigestSteps, committedProviderSchema, committedProvidersEqual, compareUnicodeCodePoints, compositeKey, describeValidationFailure, digestSchema, evidenceBundleForTarget, evidenceBundleSchema, evidenceLocationSchema, init_analysisProfile, init_binaryTargetTypes, init_canonicalJsonDigestSteps, init_digests, init_evidence, init_evidenceBundle, init_evidenceSubject, init_processCaptureParsing, init_rawBinary, init_relationshipCoverage, init_unicodeCodePointOrder, init_validationFailure, isImmutableEvidenceBundle, parseEvidenceBundle, parseImmutableEvidenceBundle, prefixedDigestSchema, rawBinaryEntryPointSchema, rebindEvidenceToTargetPath, relationshipCoverageSchema, safeParseEvidenceBundle, safeParseImmutableEvidenceBundle, safeParseProcessCapture, withEvidenceSubjectDeclaration } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { freezeJsonSnapshot, init_immutableJson, init_jsonValue, init_localPath, jsonObjectSchema, jsonValueSchema, jsonValueValidationIssue, localPathStringSchema } from "./jsonValue-DGGrC1lE.js";
import { absoluteCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";
import { init_JsonAuthenticationHeadroom, requireAuthenticationHeadroom } from "./JsonAuthenticationHeadroom-wkKxTsR2.js";
import { init_JsonFiles, readJsonFile, writeTextParts } from "./JsonFiles-DTY4ojTz.js";
import { createHash } from "node:crypto";
import { z } from "zod";
import canonicalize from "canonicalize";

//#region dist/domain/analysisSnapshot.js
var architectureSchema, formatSchema, kindSchema, subjectBaseSchema, subjectSchema, targetIdentitySchema, targetSchema, bindingSchema, entrySchema, workflowEntrySchema, analysisSnapshotSchema, resemblesAnalysisSnapshot, preparedEntryBrand, preparedEntries, prepareSnapshotEntry, snapshotFileHeaderSchema, parsePreparedAnalysisSnapshot, contentDigest, snapshotContentDigest, evidenceContentDigest, snapshotExecutionProjection, canonicalJson, snapshotTarget, snapshotBinding, snapshotMatchesTarget, snapshotMatchesProfile, snapshotBindingMismatch, snapshotEvidenceForQuery, createAnalysisSnapshotWorkflowEntry, evidenceMatchesEntry, analysisQueryId, createAnalysisSnapshotEntry, validatedSnapshots, parseAnalysisSnapshot, authenticateSnapshot, immutableAnalysisSnapshot, sealSnapshot, restoreSnapshot, hasCanonicalQueryOrder, isCorrespondingEvidence, evidenceQueryKey, entryQueryKey, entryEvidenceKey, workflowEntryQueryKey, workflowEntryEvidenceKey, isWorkflowEvidence, evidenceMatchesWorkflowEntry, evidenceContentMetadata, serializeAnalysisSnapshot;
function init_analysisSnapshot() {
	return (init_analysisSnapshot = __esmMin((() => {
		init_evidenceSubject();
		init_unicodeCodePointOrder();
		init_localPath();
		init_analysisProfile();
		init_binaryTargetTypes();
		init_evidenceBundle();
		init_evidence();
		init_jsonValue();
		init_digests();
		init_canonicalJsonDigestSteps();
		init_immutableJson();
		init_rawBinary();
		init_relationshipCoverage();
		architectureSchema = z.enum(BINARY_ARCHITECTURES);
		formatSchema = z.enum([
			"analysis-database",
			"mach-o",
			"mach-o-universal",
			"elf",
			"pe",
			"dos-mz",
			"dos-com",
			"raw-binary",
			"gamecube-dol",
			"zip",
			"ipa",
			"apk",
			"msix",
			"appx",
			"hap",
			"hsp",
			"app-pack",
			"asar",
			"ines",
			"godot-pck",
			"unityfs",
			"wxapkg",
			"dmg",
			"pkg",
			"intel-hex",
			"srec",
			"esp-image",
			"uf2",
			"dfuse",
			"esp-flash-image",
			"fit",
			"plist",
			"javascript",
			"source-map",
			"uimage"
		]);
		kindSchema = z.enum([
			"executable",
			"database",
			"archive",
			"artifact"
		]);
		subjectBaseSchema = z.object({
			path: localPathStringSchema,
			sha256: digestSchema
		});
		subjectSchema = withEvidenceSubjectDeclaration(subjectBaseSchema);
		targetIdentitySchema = z.object({
			sha256: digestSchema,
			kind: kindSchema,
			architecture: architectureSchema.nullable()
		});
		targetSchema = z.discriminatedUnion("format", [
			targetIdentitySchema.extend({
				format: z.enum(formatSchema.options.filter((format) => format !== "raw-binary" && format !== "gamecube-dol" && format !== "esp-flash-image")),
				architecture: architectureSchema.exclude([...RAW_ONLY_ARCHITECTURES]).nullable()
			}),
			targetIdentitySchema.extend({
				format: z.literal("raw-binary"),
				kind: z.literal("executable"),
				architecture: binaryArchitectureSchema,
				entry_point: rawBinaryEntryPointSchema
			}),
			targetIdentitySchema.extend({
				format: z.literal("gamecube-dol"),
				kind: z.literal("executable"),
				architecture: z.literal("powerpc"),
				entry_point: rawBinaryEntryPointSchema
			}),
			targetIdentitySchema.extend({
				format: z.literal("esp-flash-image"),
				kind: z.literal("archive"),
				architecture: z.null(),
				flash_offset: z.number().int().min(0).max(4294967295).nullable(),
				partition_table_offset: z.number().int().min(0).max(4294967295).nullable()
			})
		]);
		bindingSchema = z.object({
			provider: committedProviderSchema,
			analysis_profile: analysisProfileSchema
		}).superRefine((binding, context) => {
			if (!committedProvidersEqual(binding.provider, binding.analysis_profile.provider)) context.addIssue({
				code: "custom",
				path: ["provider"],
				message: "Snapshot binding provider does not match analysis profile"
			});
		});
		entrySchema = z.object({
			query_id: prefixedDigestSchema("query"),
			operation: z.string().min(1),
			parameters: jsonObjectSchema,
			execution: z.object({
				result: jsonValueSchema,
				raw_result: jsonValueSchema.nullable(),
				provider: committedProviderSchema,
				limitations: z.array(z.string()),
				relationship_coverage: relationshipCoverageSchema.nullable(),
				locations: z.array(evidenceLocationSchema),
				subject: subjectSchema.nullable()
			})
		});
		workflowEntrySchema = entrySchema.extend({ execution: entrySchema.shape.execution.extend({ analysis_profile: analysisProfileSchema }) });
		analysisSnapshotSchema = z.object({
			target: targetSchema,
			binding: bindingSchema,
			entries: z.array(entrySchema),
			workflow_entries: z.array(workflowEntrySchema),
			evidence_bundle: evidenceBundleSchema
		});
		resemblesAnalysisSnapshot = (value) => {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
			const record = value;
			const objectMember = (key) => Object.hasOwn(record, key) && typeof record[key] === "object" && record[key] !== null && !Array.isArray(record[key]);
			return objectMember("target") && objectMember("binding") && objectMember("evidence_bundle") && Object.hasOwn(record, "entries") && Array.isArray(record.entries) && Object.hasOwn(record, "workflow_entries") && Array.isArray(record.workflow_entries);
		};
		preparedEntryBrand = Symbol("prepared-snapshot-entry");
		preparedEntries = new WeakMap();
		prepareSnapshotEntry = (input, kind) => {
			const handle = Object.freeze({ [preparedEntryBrand]: true });
			if (kind === "provider") {
				const entry = entrySchema.parse(input);
				const { result, raw_result, ...execution } = entry.execution;
				preparedEntries.set(handle, {
					kind,
					entry: {
						...entry,
						execution
					},
					digest: snapshotContentDigest(result, raw_result, execution)
				});
			} else {
				const entry = workflowEntrySchema.parse(input);
				const { result, raw_result, ...execution } = entry.execution;
				preparedEntries.set(handle, {
					kind,
					entry: {
						...entry,
						execution
					},
					digest: snapshotContentDigest(result, raw_result, execution)
				});
			}
			return handle;
		};
		snapshotFileHeaderSchema = z.object({
			target: targetSchema,
			binding: bindingSchema,
			evidence_bundle: z.unknown()
		});
		parsePreparedAnalysisSnapshot = (input, entries, workflowEntries) => {
			const header = snapshotFileHeaderSchema.parse(input);
			const bundle = parseImmutableEvidenceBundle(header.evidence_bundle);
			const providerRows = entries.map((handle) => {
				const row = preparedEntries.get(handle);
				if (row?.kind !== "provider") throw new TypeError("Analysis snapshot entry was not parsed in this realm");
				return row;
			});
			const workflowRows = workflowEntries.map((handle) => {
				const row = preparedEntries.get(handle);
				if (row?.kind !== "workflow") throw new TypeError("Analysis snapshot workflow entry was not parsed in this realm");
				return row;
			});
			const restored = sealSnapshot(restoreSnapshot(header, bundle, providerRows, workflowRows));
			for (const handle of [...entries, ...workflowEntries]) preparedEntries.delete(handle);
			return restored;
		};
		contentDigest = (value) => {
			const steps = canonicalJsonDigestSteps(value);
			let step = steps.next();
			while (!step.done) step = steps.next();
			return step.value;
		};
		snapshotContentDigest = (result, rawResult, execution) => {
			const metadata = jsonObjectSchema.parse({
				limitations: execution.limitations,
				locations: execution.locations,
				subject: execution.subject === null ? null : {
					local_path: execution.subject.path,
					sha256: execution.subject.sha256,
					format: execution.subject.format,
					architecture: execution.subject.architecture
				},
				relationship_coverage: execution.relationship_coverage
			});
			return contentDigest({
				...metadata,
				normalized_result: result,
				raw_result: rawResult
			});
		};
		evidenceContentDigest = (evidence) => {
			return contentDigest({
				...jsonObjectSchema.parse(evidenceContentMetadata(evidence)),
				normalized_result: evidence.normalized_result,
				raw_result: evidence.raw_result
			});
		};
		snapshotExecutionProjection = (execution, provider) => entrySchema.shape.execution.parse({
			result: execution.result,
			raw_result: execution.rawResult,
			provider,
			limitations: execution.limitations,
			relationship_coverage: execution.relationshipCoverage ?? null,
			locations: execution.locations,
			subject: execution.subject === null ? null : {
				...execution.subject,
				architecture: execution.subject.architecture ?? null
			}
		});
		canonicalJson = (value) => {
			const json = jsonValueSchema.parse(value);
			const encoded = canonicalize(json);
			if (encoded === undefined) throw new TypeError("RFC 8785 canonicalization rejected snapshot data");
			return encoded;
		};
		snapshotTarget = (target) => target.format === "raw-binary" ? {
			sha256: target.sha256,
			kind: target.kind,
			architecture: target.architecture,
			format: target.format,
			entry_point: target.entryPoint
		} : target.format === "gamecube-dol" ? {
			sha256: target.sha256,
			kind: target.kind,
			architecture: target.architecture,
			format: target.format,
			entry_point: target.entryPoint
		} : target.format === "esp-flash-image" ? {
			sha256: target.sha256,
			kind: target.kind,
			architecture: null,
			format: target.format,
			flash_offset: target.espFlash.flashOffset,
			partition_table_offset: target.espFlash.partitionTableOffset
		} : {
			sha256: target.sha256,
			kind: target.kind,
			architecture: target.architecture ?? null,
			format: target.format
		};
		snapshotBinding = (profile) => bindingSchema.parse({
			provider: profile.provider,
			analysis_profile: profile
		});
		snapshotMatchesTarget = (snapshot, target) => snapshot.sha256 === target.sha256 && snapshot.kind === target.kind && snapshot.format === target.format && snapshot.architecture === (target.architecture ?? null) && (snapshot.format !== "raw-binary" || target.format === "raw-binary" && snapshot.entry_point === target.entryPoint) && (snapshot.format !== "gamecube-dol" || target.format === "gamecube-dol" && snapshot.entry_point === target.entryPoint) && (snapshot.format !== "esp-flash-image" || target.format === "esp-flash-image" && snapshot.flash_offset === target.espFlash.flashOffset && snapshot.partition_table_offset === target.espFlash.partitionTableOffset);
		snapshotMatchesProfile = (binding, profile) => committedProvidersEqual(binding.provider, profile.provider) && analysisProfilesEqual(binding.analysis_profile, profile);
		snapshotBindingMismatch = (snapshot, target, profile) => {
			const targetMatches = snapshotMatchesTarget(snapshot.target, target);
			const profileMatches = profile !== undefined && snapshotMatchesProfile(snapshot.binding, profile);
			if (targetMatches && profileMatches) return undefined;
			return {
				...targetMatches ? {} : { target: {
					snapshot: { ...snapshot.target },
					selected: snapshotTarget(target)
				} },
				...profile === undefined ? { profile_comparison: "not_compared" } : {
					...committedProvidersEqual(snapshot.binding.provider, profile.provider) ? {} : { provider: {
						snapshot: { ...snapshot.binding.provider },
						selected: { ...profile.provider }
					} },
					...profileMatches ? {} : { profile_digest: {
						snapshot: snapshot.binding.analysis_profile.digest,
						selected: profile.digest
					} }
				}
			};
		};
		snapshotEvidenceForQuery = (snapshot, query) => {
			const { target, bindingProfile, operation, parameters, provider, evidenceProfile } = query;
			if (snapshotBindingMismatch(snapshot, target, bindingProfile) !== undefined) return undefined;
			const encodedParameters = canonicalJson(parameters);
			const queryId = analysisQueryId(snapshot.target, snapshot.binding, operation, parameters);
			const entry = snapshot.entries.find((candidate) => candidate.query_id === queryId);
			const workflowEntry = snapshot.workflow_entries.find((candidate) => candidate.query_id === queryId);
			if (entry === undefined && workflowEntry === undefined) return undefined;
			let evidence;
			for (const record of snapshot.evidence_bundle.records) {
				if (!(record.subject?.digest.sha256 === target.sha256 && record.operation === operation && committedProvidersEqual(record.provider, provider) && record.analysis_profile !== null && analysisProfilesEqual(record.analysis_profile, evidenceProfile) && canonicalJson(record.parameters) === encodedParameters && (entry !== undefined && evidenceMatchesEntry(record, entry, snapshot) || workflowEntry !== undefined && evidenceMatchesWorkflowEntry(record, workflowEntry, snapshot)))) continue;
				if (evidence !== undefined && evidence.evidence_id !== record.evidence_id) return undefined;
				evidence = record;
			}
			return evidence === undefined ? undefined : rebindEvidenceToTargetPath(evidence, target);
		};
		createAnalysisSnapshotWorkflowEntry = (input) => {
			const { target, binding, operation, parameters, execution } = input;
			if (!committedProvidersEqual(execution.provider, execution.analysisProfile.provider)) throw new TypeError("Workflow snapshot execution provider does not match its profile");
			return {
				query_id: analysisQueryId(target, binding, operation, parameters),
				operation,
				parameters: jsonObjectSchema.parse(parameters),
				execution: {
					...snapshotExecutionProjection(execution, execution.analysisProfile.provider),
					analysis_profile: analysisProfileSchema.parse(execution.analysisProfile)
				}
			};
		};
		evidenceMatchesEntry = (evidence, entry, snapshot) => isCorrespondingEvidence(evidence, snapshot) && compositeKey([evidenceQueryKey(evidence), evidenceContentDigest(evidence)]) === entryEvidenceKey(entry, snapshot.binding);
		analysisQueryId = (target, binding, operation, parameters) => `query_${createHash("sha256").update(canonicalJson({
			target,
			binding,
			operation,
			parameters
		})).digest("hex")}`;
		createAnalysisSnapshotEntry = (input) => {
			const { target, binding, operation, parameters, execution } = input;
			if (execution.analysisProfile === undefined || !snapshotMatchesProfile(binding, execution.analysisProfile) || !committedProvidersEqual(execution.provider, binding.provider)) throw new TypeError("Snapshot execution does not match its provider/profile binding");
			return {
				query_id: analysisQueryId(target, binding, operation, parameters),
				operation,
				parameters: jsonObjectSchema.parse(parameters),
				execution: snapshotExecutionProjection(execution, binding.provider)
			};
		};
		validatedSnapshots = new WeakMap();
		parseAnalysisSnapshot = (input) => authenticateSnapshot(input).parsed;
		authenticateSnapshot = (input) => {
			if (typeof input === "object" && input !== null) {
				const owned = validatedSnapshots.get(input);
				if (owned !== undefined) return {
					parsed: owned,
					restored: owned
				};
			}
			const parsed = analysisSnapshotSchema.parse(input);
			const restored = restoreSnapshot(parsed, parseEvidenceBundle(parsed.evidence_bundle), parsed.entries.map((entry) => ({
				kind: "provider",
				entry,
				digest: snapshotContentDigest(entry.execution.result, entry.execution.raw_result, entry.execution)
			})), parsed.workflow_entries.map((entry) => ({
				kind: "workflow",
				entry,
				digest: snapshotContentDigest(entry.execution.result, entry.execution.raw_result, entry.execution)
			})));
			return {
				parsed,
				restored
			};
		};
		immutableAnalysisSnapshot = (input) => sealSnapshot(authenticateSnapshot(input).restored);
		sealSnapshot = (snapshot) => {
			for (const entry of [...snapshot.entries, ...snapshot.workflow_entries]) {
				freezeJsonSnapshot(entry.execution.result);
				freezeJsonSnapshot(entry.execution.raw_result);
			}
			freezeJsonSnapshot(snapshot);
			validatedSnapshots.set(snapshot, snapshot);
			return snapshot;
		};
		restoreSnapshot = (header, bundle, providerRows, workflowRows) => {
			const scopedEvidence = evidenceBundleForTarget(bundle, header.target.sha256);
			if (scopedEvidence.records.length !== bundle.records.length || scopedEvidence.unknowns.length !== bundle.unknowns.length) throw new TypeError("Analysis snapshot evidence contains records unrelated to the selected target and its linked sources");
			if (!hasCanonicalQueryOrder(providerRows.map(({ entry }) => entry))) throw new TypeError("Analysis snapshot entries are not canonical");
			if (!hasCanonicalQueryOrder(workflowRows.map(({ entry }) => entry))) throw new TypeError("Analysis snapshot workflow entries are not canonical");
			const ids = new Set();
			const corresponding = new Set();
			const matching = new Map();
			for (const evidence of bundle.records) {
				if (evidence.predicate_type !== "rea.analysis" || evidence.authority !== "shipped-artifact" || evidence.subject?.digest.sha256 !== header.target.sha256 || evidence.analysis_profile === null || evidence.confidence !== "observed" && evidence.confidence !== "derived") continue;
				if (evidence.confidence === "observed" && !isCorrespondingEvidence(evidence, header)) continue;
				const query = compositeKey([evidence.confidence, evidenceQueryKey(evidence)]);
				corresponding.add(query);
				matching.set(compositeKey([query, evidenceContentDigest(evidence)]), evidence);
			}
			const find = (query, digest, label, operation) => {
				const evidence = matching.get(compositeKey([query, digest]));
				if (evidence !== undefined) return evidence;
				throw new TypeError(corresponding.has(query) ? `Analysis snapshot ${label} ${operation} differs from its Evidence record` : `Analysis snapshot ${label} ${operation} has no profile-bound Evidence record`);
			};
			const checkId = (entry, workflow) => {
				const expected = analysisQueryId(header.target, header.binding, entry.operation, entry.parameters);
				if (entry.query_id !== expected) throw new TypeError(workflow ? "Analysis snapshot workflow query identifier does not match" : "Analysis snapshot query identifier does not match");
				if (ids.has(entry.query_id)) throw new TypeError("Analysis snapshot contains duplicate queries");
				ids.add(entry.query_id);
			};
			const entries = providerRows.map(({ entry, digest }) => {
				if (!committedProvidersEqual(entry.execution.provider, header.binding.provider)) throw new TypeError("Analysis snapshot entry provider does not match");
				checkId(entry, false);
				const evidence = find(compositeKey(["observed", entryQueryKey(entry, header.binding)]), digest, "entry", entry.operation);
				return {
					...entry,
					execution: {
						...entry.execution,
						result: evidence.normalized_result,
						raw_result: evidence.raw_result
					}
				};
			});
			const workflow_entries = workflowRows.map(({ entry, digest }) => {
				const provider = entry.execution.analysis_profile.provider;
				if (!committedProvidersEqual(entry.execution.provider, provider)) throw new TypeError("Analysis snapshot workflow entry provider does not match its profile");
				checkId(entry, true);
				const evidence = find(compositeKey(["derived", workflowEntryQueryKey(entry)]), digest, "workflow entry", entry.operation);
				return {
					...entry,
					execution: {
						...entry.execution,
						result: evidence.normalized_result,
						raw_result: evidence.raw_result
					}
				};
			});
			return {
				target: header.target,
				binding: header.binding,
				entries,
				workflow_entries,
				evidence_bundle: bundle
			};
		};
		hasCanonicalQueryOrder = (entries) => {
			let previous;
			for (const { query_id: queryId } of entries) {
				if (previous !== undefined && compareUnicodeCodePoints(previous, queryId) > 0) return false;
				previous = queryId;
			}
			return true;
		};
		isCorrespondingEvidence = (evidence, snapshot) => evidence.predicate_type === "rea.analysis" && evidence.confidence === "observed" && evidence.authority === "shipped-artifact" && evidence.subject?.digest.sha256 === snapshot.target.sha256 && evidence.analysis_profile !== null && analysisProfilesEqual(evidence.analysis_profile, snapshot.binding.analysis_profile);
		evidenceQueryKey = (evidence) => contentDigest({
			operation: evidence.operation,
			parameters: evidence.parameters,
			provider: evidence.provider,
			analysis_profile: evidence.analysis_profile
		});
		entryQueryKey = (entry, binding) => contentDigest({
			operation: entry.operation,
			parameters: entry.parameters,
			provider: entry.execution.provider,
			analysis_profile: binding.analysis_profile
		});
		entryEvidenceKey = (entry, binding) => compositeKey([entryQueryKey(entry, binding), snapshotContentDigest(entry.execution.result, entry.execution.raw_result, entry.execution)]);
		workflowEntryQueryKey = (entry) => contentDigest({
			operation: entry.operation,
			parameters: entry.parameters,
			provider: entry.execution.provider,
			analysis_profile: entry.execution.analysis_profile
		});
		workflowEntryEvidenceKey = (entry) => compositeKey([workflowEntryQueryKey(entry), snapshotContentDigest(entry.execution.result, entry.execution.raw_result, entry.execution)]);
		isWorkflowEvidence = (evidence, snapshot, entry) => evidence.predicate_type === "rea.analysis" && evidence.confidence === "derived" && evidence.authority === "shipped-artifact" && evidence.subject?.digest.sha256 === snapshot.target.sha256 && evidence.analysis_profile !== null && analysisProfilesEqual(evidence.analysis_profile, entry.execution.analysis_profile) && committedProvidersEqual(evidence.provider, entry.execution.provider);
		evidenceMatchesWorkflowEntry = (evidence, entry, snapshot) => isWorkflowEvidence(evidence, snapshot, entry) && compositeKey([evidenceQueryKey(evidence), evidenceContentDigest(evidence)]) === workflowEntryEvidenceKey(entry);
		evidenceContentMetadata = (evidence) => {
			return {
				limitations: evidence.limitations,
				relationship_coverage: evidence.relationship_coverage,
				locations: evidence.locations,
				subject: evidence.subject === null ? null : {
					local_path: evidence.subject.local_path,
					sha256: evidence.subject.digest.sha256,
					format: evidence.subject.format,
					architecture: evidence.subject.architecture
				}
			};
		};
		serializeAnalysisSnapshot = (snapshot) => `${canonicalJson(parseAnalysisSnapshot(snapshot))}\n`;
	})))();
}

//#endregion
//#region dist/application/EvidenceBundleFiles.js
var EvidenceBundleFiles_exports = /* @__PURE__ */ __exportAll({ readImmutableEvidenceBundle: () => readImmutableEvidenceBundle });
var evidenceBundleExportReceipt, readEvidenceBundle, readImmutableEvidenceBundle, readComparisonEvidenceBundles, readBundle, authenticateEvidenceBundleValue, validateBundlePayloads, writeEvidenceBundle;
function init_EvidenceBundleFiles() {
	return (init_EvidenceBundleFiles = __esmMin((() => {
		init_jsonValue();
		init_analysisErrorCleanup();
		init_JsonAuthenticationHeadroom();
		init_callerPath();
		init_analysisSnapshot();
		init_validationFailure();
		init_evidenceBundle();
		init_evidenceErrors();
		init_result();
		init_analysisErrorCore();
		init_processCaptureParsing();
		init_jsonSerialization();
		init_JsonFiles();
		evidenceBundleExportReceipt = (bundle, published) => ({
			path: published.path,
			bytes: published.bytes,
			records: bundle.records.length,
			unknowns: bundle.unknowns.length
		});
		readEvidenceBundle = (path, signal, resources, operation = "import_evidence_bundle") => readBundle(path, false, signal, resources, operation);
		readImmutableEvidenceBundle = (path, signal, resources, operation = "import_evidence_bundle") => readBundle(path, true, signal, resources, operation);
		readComparisonEvidenceBundles = async (leftPath, rightPath, signal, resources, operation = "compare_bundles") => {
			const [left, right] = await Promise.all([readImmutableEvidenceBundle(leftPath, signal, resources, operation), readImmutableEvidenceBundle(rightPath, signal, resources, operation)]);
			if (!left.ok) {
				if (!right.ok && right.error.cleanupIncomplete) return err(analysisErrorWithCleanupFailure(left.error, right.error, operation).bindCleanupDependencies([left.error, right.error]));
				return left;
			}
			if (!right.ok) return right;
			return ok({
				left: left.value,
				right: right.value
			});
		};
		readBundle = async (path, immutable, signal, resources, operation = "import_evidence_bundle") => {
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			const loaded = await readJsonFile(path, signal, resources, operation);
			if (!loaded.ok) return loaded;
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			return authenticateEvidenceBundleValue(loaded.value, path, {
				operation,
				immutable
			});
		};
		authenticateEvidenceBundleValue = (value, path, options) => {
			const { operation } = options;
			const headroom = requireAuthenticationHeadroom(value, {
				operation,
				path: absoluteCallerPath(path),
				description: "Insufficient heap headroom to authenticate the Evidence bundle"
			});
			if (!headroom.ok) return headroom;
			const parsed = options.immutable === true ? safeParseImmutableEvidenceBundle(value) : safeParseEvidenceBundle(value);
			if (!parsed.ok) {
				const failure = parsed.error;
				if (failure.kind === "single-record") return err(new EvidenceFileError("read", "wrong-kind", {
					path: absoluteCallerPath(path),
					cause: failure.cause,
					userMessage: failure.message
				}));
				if (operation === "import_evidence_bundle" && typeof value === "object" && value !== null && !Object.hasOwn(value, "records") && resemblesAnalysisSnapshot(value)) return err(new EvidenceFileError("read", "wrong-kind", {
					path: absoluteCallerPath(path),
					cause: failure.cause,
					userMessage: "This JSON appears to be an analysis snapshot rather than an Evidence bundle. Its snapshot content has not been validated. To restore it, use a matching target, provider and analysis profile: call open_binary with snapshot_path set to this file, or pass --snapshot to a compatible CLI analysis command (which loads and updates the snapshot). Alternatively, supply a bundle from export_evidence_bundle."
				}));
				return err(new EvidenceIntegrityError("Evidence bundle validation failed", {
					cause: failure.cause,
					userMessage: failure.message
				}));
			}
			return validateBundlePayloads(parsed.value, path, operation);
		};
		validateBundlePayloads = (bundle, path, operation) => {
			for (const record of bundle.records) {
				if (record.predicate_type !== "rea.process-capture") continue;
				const headroom = requireAuthenticationHeadroom(record.normalized_result, {
					operation,
					path: absoluteCallerPath(path),
					description: `Insufficient heap headroom to validate process capture ${record.evidence_id} in the Evidence bundle`
				});
				if (!headroom.ok) return headroom;
				const parsedCapture = safeParseProcessCapture(record.normalized_result);
				if (!parsedCapture.success) {
					return err(new EvidenceIntegrityError("Evidence bundle validation failed", {
						cause: parsedCapture.error,
						userMessage: `Process capture record ${record.evidence_id} has an invalid normalized_result (${describeValidationFailure(parsedCapture.error)}). Recreate or re-export the bundle, then try again.`
					}));
				}
			}
			return ok(bundle);
		};
		writeEvidenceBundle = async (bundle, path, overwrite, resources, signal, operation = "export_evidence_bundle") => {
			if (signal?.aborted === true) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			if (!isImmutableEvidenceBundle(bundle)) {
				const issue = jsonValueValidationIssue(bundle);
				if (issue !== undefined) return err(new EvidenceIntegrityError("Evidence checkpoint is not ordinary JSON", { userMessage: issue }));
				const headroom = requireAuthenticationHeadroom(bundle, {
					operation,
					path: absoluteCallerPath(path),
					description: "Insufficient heap headroom to authenticate the Evidence checkpoint"
				});
				if (!headroom.ok) return headroom;
			}
			const checked = safeParseEvidenceBundle(bundle);
			if (!checked.ok) {
				return err(new EvidenceIntegrityError("Evidence bundle validation failed", { cause: checked.error.cause }));
			}
			const validated = validateBundlePayloads(checked.value, path, operation);
			if (!validated.ok) return validated;
			return writeTextParts(bufferedJsonParts(canonicalJsonParts(validated.value)), path, overwrite, resources, signal === undefined ? undefined : {
				signal,
				operation
			});
		};
	})))();
}

//#endregion
export { EvidenceBundleFiles_exports, analysisQueryId, authenticateEvidenceBundleValue, createAnalysisSnapshotEntry, createAnalysisSnapshotWorkflowEntry, evidenceBundleExportReceipt, evidenceMatchesEntry, evidenceMatchesWorkflowEntry, immutableAnalysisSnapshot, init_EvidenceBundleFiles, init_analysisSnapshot, parseAnalysisSnapshot, parsePreparedAnalysisSnapshot, prepareSnapshotEntry, readComparisonEvidenceBundles, readEvidenceBundle, readImmutableEvidenceBundle, serializeAnalysisSnapshot, snapshotBinding, snapshotBindingMismatch, snapshotEvidenceForQuery, snapshotMatchesProfile, snapshotMatchesTarget, snapshotTarget, writeEvidenceBundle };