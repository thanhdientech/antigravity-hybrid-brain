import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { EvidenceFileError, err, init_evidenceErrors, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisCancelledError, AnalysisInputError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { createImmutableEvidenceBundle, init_artifactInspection, init_canonicalOrdering, init_evidence, init_evidenceBundle, init_jsonValueByteLength, jsonValueByteLength, readArtifactInspectionSources, tryParseEvidence, uniqueSorted, withEvidenceCallerInputPath } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_jsonValue, jsonValueSchema } from "./jsonValue-DGGrC1lE.js";
import { absoluteCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { dispatchQueuedInterrupts, init_AnalysisViewService, init_queuedInterrupts, inspectAnalysisViewValidated } from "./AnalysisViewService-BU_6ZODN.js";
import { init_JsonAuthenticationHeadroom, requireAuthenticationHeadroom } from "./JsonAuthenticationHeadroom-wkKxTsR2.js";
import { evidenceBundleExportReceipt, init_EvidenceBundleFiles, readComparisonEvidenceBundles, readEvidenceBundle, readImmutableEvidenceBundle, writeEvidenceBundle } from "./EvidenceBundleFiles-kxea_C2c.js";
import { init_EvidenceInputResolver, resolveEvidenceInput } from "./EvidenceInputResolver-Bnks2n7c.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-C6Clg7Wy.js";
import { compareBundles, init_bundleComparison, init_evidenceRecordSummary, inspectEvidenceLinks, selectEvidenceRecords, summarizeEvidenceBundle } from "./toolOutputSchemaGroups-B9a_Xj3Z.js";

//#region dist/application/AnalysisEvidenceSources.js
var analysisEvidenceSources, SOURCE_CLOSURE_INLINE_BYTES, SOURCE_CLOSURE_LISTED_OMISSIONS, SOURCE_CLOSURE_RECOVERY, collectSourceClosure, undeliveredSourceClosure;
function init_AnalysisEvidenceSources() {
	return (init_AnalysisEvidenceSources = __esmMin((() => {
		init_artifactInspection();
		init_evidence();
		init_jsonValueByteLength();
		init_result();
		analysisEvidenceSources = (complete) => {
			const embedded = complete.operation === "inspect_artifact" ? readArtifactInspectionSources(complete.normalized_result) : ok([]);
			if (!embedded.ok) return err(embedded.error.retainPartialObservation(complete));
			return ok([...embedded.value, complete]);
		};
		SOURCE_CLOSURE_INLINE_BYTES = 64 * 1024;
		SOURCE_CLOSURE_LISTED_OMISSIONS = 64;
		SOURCE_CLOSURE_RECOVERY = "No bundle was written and this invocation retains nothing after exit. Keep any records shown here, or run the operation again after following remediation; that is a new observation and may differ.";
		collectSourceClosure = (observation, captured, options) => {
			const inspection = analysisEvidenceSources(observation);
			const embedded = new Map((inspection.ok ? inspection.value : []).map((record) => [record.evidence_id, record]));
			const held = new Map(captured.map((record) => [record.evidence_id, record]));
			const closure = new Set([observation.evidence_id]);
			for (const evidenceId of observation.evidence_links) closure.add(evidenceId);
			for (const evidenceId of held.keys()) closure.add(evidenceId);
			const records = [];
			const omitted = [];
			let omittedCount = 0;
			let inlineBytes = options.inlineRecords ? SOURCE_CLOSURE_INLINE_BYTES : 0;
			const omit = (evidenceId, reason) => {
				omittedCount += 1;
				if (omitted.length < SOURCE_CLOSURE_LISTED_OMISSIONS) omitted.push({
					evidence_id: evidenceId,
					reason
				});
			};
			for (const evidenceId of closure) {
				if (evidenceId === observation.evidence_id) continue;
				const inObservation = embedded.get(evidenceId);
				const record = inObservation ?? held.get(evidenceId);
				if (record === undefined) {
					omit(evidenceId, "not_captured");
					continue;
				}
				for (const link of record.evidence_links) closure.add(link);
				if (inObservation !== undefined) continue;
				const bytes = jsonValueByteLength(record, inlineBytes);
				if (bytes > inlineBytes) {
					omit(evidenceId, "not_inlined");
					continue;
				}
				records.push(record);
				inlineBytes -= bytes;
			}
			if (closure.size === 1) return undefined;
			return {
				publication: "not_published",
				complete: omittedCount === 0,
				records,
				omitted_count: omittedCount,
				omitted,
				recovery: SOURCE_CLOSURE_RECOVERY
			};
		};
		undeliveredSourceClosure = (partialObservation, captured, options) => {
			try {
				const observation = tryParseEvidence(partialObservation);
				return observation === undefined ? undefined : collectSourceClosure(observation, captured, options);
			} catch (cause) {
				return {
					publication: "not_published",
					complete: false,
					collection_failure: cause instanceof Error ? cause.name : "unknown",
					recovery: SOURCE_CLOSURE_RECOVERY
				};
			}
		};
	})))();
}

//#endregion
//#region dist/application/investigation/InspectEvidenceBundle.js
var DELIVERY_FIELDS, inspectEvidenceBundle;
function init_InspectEvidenceBundle() {
	return (init_InspectEvidenceBundle = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		init_evidenceRecordSummary();
		DELIVERY_FIELDS = [
			["offset", ["records", "links"]],
			["limit", ["records", "links"]],
			["traversal", ["links"]],
			["link_status", ["links"]]
		];
		inspectEvidenceBundle = (bundle, options) => {
			if (options.detail === "complete" && options.filters !== undefined) return err(new AnalysisInputError("get_evidence_bundle", undefined, [{
				path: ["filters"],
				reason: "invalid_value",
				message: "Record filters require detail: summary, records or links; complete returns the canonical bundle.",
				expected: "detail: summary, records or links"
			}]));
			const misplaced = DELIVERY_FIELDS.filter(([field, details]) => options[field] !== undefined && !details.includes(options.detail));
			if (misplaced.length > 0) return err(new AnalysisInputError("get_evidence_bundle", undefined, misplaced.map(([field, details]) => {
				const expected = details.map((detail) => `detail: ${detail}`).join(" or ");
				return {
					path: [field],
					reason: "invalid_value",
					message: `${field} requires ${expected}.`,
					expected
				};
			})));
			if (options.detail === "records") return ok(selectEvidenceRecords(bundle, options.filters, {
				offset: options.offset,
				limit: options.limit
			}));
			if (options.detail === "links") return ok(inspectEvidenceLinks(bundle, options.filters, {
				traversal: options.traversal,
				linkStatus: options.link_status,
				offset: options.offset,
				limit: options.limit
			}));
			return ok(options.detail === "summary" ? summarizeEvidenceBundle(bundle, options.filters) : bundle);
		};
	})))();
}

//#endregion
//#region dist/application/EvidenceBundleCommands.js
var importEvidenceBundleCommand, exportEvidenceBundleCommand, deliverAnalysisEvidence, publishEvidenceDelivery, evidenceDeliveryCommitted, persistEvidenceBundleCommand, compareEvidenceBundlesCommand, projectWrite, inspectEvidenceBundleCommand, withBundleReadResources;
function init_EvidenceBundleCommands() {
	return (init_EvidenceBundleCommands = __esmMin((() => {
		init_AnalysisEvidenceSources();
		init_queuedInterrupts();
		init_callerPath();
		init_JsonAuthenticationHeadroom();
		init_evidenceErrors();
		init_analysisErrorCore();
		init_evidence();
		init_evidenceBundle();
		init_jsonValue();
		init_result();
		init_bundleComparison();
		init_ArtifactResourceScope();
		init_EvidenceBundleFiles();
		init_InspectEvidenceBundle();
		init_AnalysisViewService();
		importEvidenceBundleCommand = async (path, signal) => {
			return withBundleReadResources(async (resources) => {
				const loaded = await readEvidenceBundle(path, signal, resources, "import_evidence_bundle");
				if (!loaded.ok) return loaded;
				return ok({
					imported: loaded.value.records.length,
					unknowns_added: loaded.value.unknowns.length,
					total: loaded.value.records.length
				});
			}, "import_evidence_bundle", signal);
		};
		exportEvidenceBundleCommand = async (sourcePath, outputPath, overwrite, signal) => {
			const loaded = await withBundleReadResources((resources) => readImmutableEvidenceBundle(sourcePath, signal, resources, "export_evidence_bundle"), "export_evidence_bundle", signal);
			if (!loaded.ok) return loaded;
			const written = await persistEvidenceBundleCommand(loaded.value, outputPath, overwrite, signal, "export_evidence_bundle");
			await dispatchQueuedInterrupts();
			if (written.ok && signal?.aborted) return err(new AnalysisCancelledError("export_evidence_bundle", {
				cause: signal.reason,
				diagnostics: { evidence_bundle: { ...written.value } }
			}));
			return projectWrite(loaded.value, written);
		};
		deliverAnalysisEvidence = async (evidence, outputPath, detail = "complete", signal) => {
			const headroom = requireAuthenticationHeadroom(evidence, {
				operation: evidence.operation,
				path: absoluteCallerPath(outputPath),
				description: "Insufficient heap headroom to authenticate the complete parent Evidence"
			});
			if (!headroom.ok) return err(headroom.error.retainPartialObservation(evidence));
			const sourceEvidence = analysisEvidenceSources(evidence);
			if (!sourceEvidence.ok) return sourceEvidence;
			const bundle = createImmutableEvidenceBundle(sourceEvidence.value);
			const delivered = detail === "summary" ? inspectAnalysisViewValidated({
				source: {
					kind: "retained-evidence",
					evidence_id: evidence.evidence_id
				},
				view: { kind: "summary" }
			}, (id) => bundle.records.find((record) => record.evidence_id === id)) : ok(evidence);
			if (!delivered.ok) return delivered;
			const selected = detail === "summary" && evidence.caller_input_path !== undefined ? withEvidenceCallerInputPath(delivered.value, evidence.caller_input_path) : delivered.value;
			const published = await publishEvidenceDelivery({
				bundle,
				complete: evidence,
				delivered: selected,
				outputPath,
				operation: evidence.operation,
				signal
			});
			return published.ok ? ok(published.value.delivered) : published;
		};
		publishEvidenceDelivery = async (input) => {
			const { signal, operation } = input;
			const written = await persistEvidenceBundleCommand(input.bundle, input.outputPath, false, signal, operation);
			await dispatchQueuedInterrupts();
			if (!written.ok) {
				const original = written.error;
				const failure = original instanceof EvidenceFileError && original.reason === "exists" ? new EvidenceFileError(original.operation, original.reason, {
					cause: original,
					...original.path === undefined ? {} : { path: original.path },
					userMessage: "Evidence file already exists. Choose another output path.",
					cleanup: original.cleanup,
					diagnostics: original.diagnostics
				}).bindCleanupDependencies([original]) : original;
				return err(failure.retainPartialObservation(input.complete));
			}
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, {
				cause: signal.reason,
				partialObservation: input.delivered,
				diagnostics: { evidence_bundle: { ...written.value } }
			}));
			return ok({
				delivered: input.delivered,
				evidenceBundle: written.value
			});
		};
		evidenceDeliveryCommitted = (error) => error.diagnostics?.evidence_bundle !== undefined || error instanceof EvidenceFileError && error.published !== undefined;
		persistEvidenceBundleCommand = async (bundle, outputPath, overwrite, signal, operation) => {
			const resources = new ArtifactResourceScope();
			const written = await writeEvidenceBundle(bundle, outputPath, overwrite, resources, signal, operation);
			if (written.ok) return written;
			await resources.close().catch(() => undefined);
			if (!written.error.cleanupIncomplete && written.error instanceof EvidenceFileError && written.error.published?.path !== undefined) {
				return ok({
					path: written.error.published.path,
					bytes: written.error.published.bytes
				});
			}
			return written;
		};
		compareEvidenceBundlesCommand = async (input) => {
			return withBundleReadResources(async (resources) => {
				const loaded = await readComparisonEvidenceBundles(input.leftPath, input.rightPath, input.signal, resources);
				if (!loaded.ok) return loaded;
				const { left, right } = loaded.value;
				try {
					return ok(jsonValueSchema.parse(compareBundles(left, right, input.recordPairs)));
				} catch (cause) {
					if (cause instanceof AnalysisInputError) return err(cause);
					throw cause;
				}
			}, "compare_bundles", input.signal);
		};
		projectWrite = (bundle, written) => written.ok ? ok(evidenceBundleExportReceipt(bundle, written.value)) : err(written.error);
		inspectEvidenceBundleCommand = async (input, signal) => {
			return withBundleReadResources(async (resources) => {
				const loaded = await readEvidenceBundle(input.path, signal, resources, "get_evidence_bundle");
				return loaded.ok ? inspectEvidenceBundle(loaded.value, input) : loaded;
			}, "get_evidence_bundle", signal);
		};
		withBundleReadResources = async (read, operation, signal) => {
			const resources = new ArtifactResourceScope();
			let result;
			try {
				result = await read(resources);
			} finally {
				await resources.close().catch(() => undefined);
				await dispatchQueuedInterrupts();
			}
			return result.ok && signal?.aborted ? err(new AnalysisCancelledError(operation, {
				cause: signal.reason,
				diagnostics: { completed_result: result.value }
			})) : result;
		};
	})))();
}

//#endregion
//#region dist/application/investigation/InvestigationEvidence.js
var resolveInvestigationEvidenceClosure;
function init_InvestigationEvidence() {
	return (init_InvestigationEvidence = __esmMin((() => {
		init_EvidenceInputResolver();
		init_canonicalOrdering();
		init_result();
		resolveInvestigationEvidenceClosure = (reader, seedIds, sources = []) => {
			const supplied = new Map(sources.map((source) => [source.evidence_id, source]));
			const lookup = (id) => supplied.get(id) ?? reader.evidenceForAnalysis(id);
			const visited = new Set();
			const pending = [...seedIds];
			while (pending.length > 0) {
				const evidenceId = pending.pop();
				if (evidenceId === undefined || visited.has(evidenceId)) continue;
				const evidence = resolveEvidenceInput({
					kind: "retained-evidence",
					evidence_id: evidenceId
				}, lookup, "retained-closure");
				if (!evidence.ok) return evidence;
				visited.add(evidenceId);
				for (const link of evidence.value.evidence_links) pending.push(link);
			}
			return ok(uniqueSorted([...visited]));
		};
	})))();
}

//#endregion
export { analysisEvidenceSources, compareEvidenceBundlesCommand, deliverAnalysisEvidence, evidenceDeliveryCommitted, exportEvidenceBundleCommand, importEvidenceBundleCommand, init_AnalysisEvidenceSources, init_EvidenceBundleCommands, init_InvestigationEvidence, inspectEvidenceBundleCommand, publishEvidenceDelivery, resolveInvestigationEvidenceClosure, undeliveredSourceClosure };