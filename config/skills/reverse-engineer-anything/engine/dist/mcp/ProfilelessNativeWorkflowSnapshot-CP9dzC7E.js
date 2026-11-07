import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { i as init_configurationErrors, r as NoBinaryOpenError } from "./configurationErrors-Dc_G1uM0.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { b as analysisProfilesEqual, m as rebindEvidenceSubjectTargetPath, u as init_evidence, w as init_analysisProfile } from "./evidence-Cy8VjugF.js";
import { f as init_evidenceErrors, l as EvidenceIntegrityError, s as AnalysisSnapshotMismatchError } from "./digests-Ct-nksBF.js";
import { Ao as init_WorkflowAnalysisProfile, Go as createAnalysisSnapshotEntry, Jo as evidenceMatchesWorkflowEntry, Ko as createAnalysisSnapshotWorkflowEntry, Wo as analysisQueryId, Xo as init_analysisSnapshot, Yo as immutableAnalysisSnapshot, Zo as parseAnalysisSnapshot, is as snapshotMatchesProfile, jo as workflowAnalysisProfile, ns as snapshotBindingMismatch, os as snapshotTarget, qo as evidenceMatchesEntry, ts as snapshotBinding } from "./createServer-CMxQrH3I.js";
import { r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { i as init_enhancedToolContracts, n as init_officialToolContracts, r as ENHANCED_TOOL_CONTRACTS, t as OFFICIAL_TOOL_CONTRACTS } from "./officialToolContracts-DA50uM2C.js";

//#region dist/application/binary/SessionProviderPolicy.js
var OFFICIAL_OPERATIONS, ENHANCED_OPERATIONS, routeProviderIdentity, routeAllowsSnapshotReplay;
function init_SessionProviderPolicy() {
	return (init_SessionProviderPolicy = __esmMin((() => {
		init_enhancedToolContracts();
		init_officialToolContracts();
		OFFICIAL_OPERATIONS = new Set(OFFICIAL_TOOL_CONTRACTS.map(({ name }) => name));
		ENHANCED_OPERATIONS = new Set(ENHANCED_TOOL_CONTRACTS.map(({ name }) => name));
		routeProviderIdentity = (route, operation) => {
			let selected = route.binding?.identity ?? route.identity;
			if (operation !== undefined) {
				const exact = route.capabilities.get(operation)?.provider;
				if (exact !== undefined) selected = exact;
				else if (ENHANCED_OPERATIONS.has(operation)) {
					const providers = new Map();
					for (const descriptor of route.capabilities.values()) if (descriptor.available && OFFICIAL_OPERATIONS.has(descriptor.operation)) providers.set(descriptor.provider.id, descriptor.provider);
					if (providers.size === 1) {
						const provider = providers.values().next().value;
						if (provider !== undefined) selected = provider;
					}
				}
			}
			return structuredClone(selected);
		};
		routeAllowsSnapshotReplay = (route, operation) => {
			const descriptor = route?.capabilities.get(operation);
			if (descriptor !== undefined) return descriptor.cachePolicy !== "live";
			return ![...route?.capabilities.values() ?? []].some(({ cachePolicy }) => cachePolicy === "live");
		};
	})))();
}

//#endregion
//#region dist/application/binary/AnalysisSnapshotReplayBinding.js
var snapshotReplayBinding;
function init_AnalysisSnapshotReplayBinding() {
	return (init_AnalysisSnapshotReplayBinding = __esmMin((() => {
		snapshotReplayBinding = (evidence, records) => {
			const sources = [];
			for (const id of evidence.evidence_links) {
				const source = records.get(id);
				if (source === undefined) return null;
				sources.push(source);
			}
			sources.push(evidence);
			return {
				evidenceId: evidence.evidence_id,
				sourceEvidence: Object.freeze(sources)
			};
		};
	})))();
}

//#endregion
//#region dist/application/binary/AnalysisSnapshotCache.js
var RELATIONSHIP_OPERATIONS, RESOURCE_SCOPED_OPERATIONS, STATEFUL_OPERATIONS, CURSOR_DEFAULT_OPERATIONS, DOCUMENT_SCOPED_OPERATIONS, SNAPSHOT_CACHE_ENTRY_CEILING, replayDocumentSelected, isOneShotPseudocode, DOCUMENTLESS_SOURCE_EVIDENCE_OPERATIONS, isSourceEvidenceRetainable, isSnapshotCacheable, requiresNativeSourceAdmissionBeforeReplay, SNAPSHOT_REPLAY_LIMITATION, AnalysisSnapshotCache;
function init_AnalysisSnapshotCache() {
	return (init_AnalysisSnapshotCache = __esmMin((() => {
		init_evidenceErrors();
		init_configurationErrors();
		init_evidence();
		init_result();
		init_analysisSnapshot();
		init_officialToolContracts();
		init_unicodeCodePointOrder();
		init_AnalysisSnapshotReplayBinding();
		RELATIONSHIP_OPERATIONS = new Set(["procedure_callers", "procedure_callees"]);
		RESOURCE_SCOPED_OPERATIONS = new Set([
			"decode_interface_builder",
			"inspect_asset_catalog",
			"inspect_keyed_archive",
			"trace_dylib_resolution"
		]);
		STATEFUL_OPERATIONS = new Set([
			"health",
			"current_address",
			"current_procedure",
			"current_document",
			"goto_address",
			"list_documents"
		]);
		CURSOR_DEFAULT_OPERATIONS = new Set([
			"address_name",
			"comment",
			"inline_comment",
			"next_address",
			"prev_address",
			"xrefs"
		]);
		DOCUMENT_SCOPED_OPERATIONS = new Set(OFFICIAL_TOOL_CONTRACTS.map(({ name }) => name).filter((name) => name !== "current_document" && name !== "list_documents"));
		SNAPSHOT_CACHE_ENTRY_CEILING = 1e4;
		replayDocumentSelected = (operation, parameters) => !DOCUMENT_SCOPED_OPERATIONS.has(operation) || typeof parameters.document === "string";
		isOneShotPseudocode = (operation, descriptor, context) => context === "one-shot-target" && operation === "procedure_pseudo_code" && descriptor?.provider.id === "ghidra";
		DOCUMENTLESS_SOURCE_EVIDENCE_OPERATIONS = new Set(["procedure_callers", "procedure_callees"]);
		isSourceEvidenceRetainable = (operation, descriptor, parameters, context) => !STATEFUL_OPERATIONS.has(operation) && !RESOURCE_SCOPED_OPERATIONS.has(operation) && (!DOCUMENT_SCOPED_OPERATIONS.has(operation) || typeof parameters.document === "string" || DOCUMENTLESS_SOURCE_EVIDENCE_OPERATIONS.has(operation) || isOneShotPseudocode(operation, descriptor, context)) && (!CURSOR_DEFAULT_OPERATIONS.has(operation) || typeof parameters.address === "string") && descriptor?.effects.mutatesArtifact === false && (descriptor.cachePolicy === "snapshot" || descriptor.effects.mayWriteFilesystem === false) && descriptor.effects.changesPermissions === false;
		isSnapshotCacheable = (operation, descriptor, parameters, context) => isSourceEvidenceRetainable(operation, descriptor, parameters, context) && (replayDocumentSelected(operation, parameters) || isOneShotPseudocode(operation, descriptor, context)) && descriptor.cachePolicy !== "live";
		requiresNativeSourceAdmissionBeforeReplay = (providerId) => process.platform === "win32" && providerId === "ghidra";
		SNAPSHOT_REPLAY_LIMITATION = "Loaded from a local REA analysis snapshot; this call did not re-run the provider.";
		AnalysisSnapshotCache = class {
			#entries = new Map();
			#replayBindings = new Map();
			#workflowEntries = new Map();
			#target;
			#binding;
			/** Whether staged entries belong to the supplied target and profile. */
			matches(target, profile) {
				return this.mismatch(target, profile) === undefined;
			}
			/** Explain staged mismatch without treating missing binding facts as absent. */
			mismatch(target, profile) {
				if (this.#target === undefined && this.#binding === undefined) return undefined;
				if (this.#target === undefined || this.#binding === undefined) return { staged_binding: "incomplete" };
				return snapshotBindingMismatch({
					target: this.#target,
					binding: this.#binding
				}, target, profile);
			}
			/** Replace cache state when the target or selected profile changes. */
			select(target, profile) {
				if (!this.matches(target, profile)) this.#clearEntries();
				this.#target = snapshotTarget(target);
				this.#binding = snapshotBinding(profile);
			}
			/** Merge already-validated entries and return the new-entry count. */
			stage(snapshot) {
				snapshot = immutableAnalysisSnapshot(snapshot);
				if (this.#target !== undefined && JSON.stringify(this.#target) !== JSON.stringify(snapshot.target) || this.#binding !== undefined && !snapshotMatchesProfile(this.#binding, snapshot.binding.analysis_profile)) this.#clearEntries();
				this.#target = structuredClone(snapshot.target);
				this.#binding = structuredClone(snapshot.binding);
				let imported = 0;
				const stagedQueryIds = new Set();
				for (const entry of snapshot.entries) {
					if (!this.#entries.has(entry.query_id) && !this.#hasCapacity()) continue;
					if (!this.#entries.has(entry.query_id)) imported += 1;
					this.#entries.set(entry.query_id, entry);
					stagedQueryIds.add(entry.query_id);
					this.#replayBindings.delete(entry.query_id);
				}
				const evidenceByQuery = new Map();
				const records = new Map(snapshot.evidence_bundle.records.map((record) => [record.evidence_id, record]));
				const ambiguous = new Set();
				for (const evidence of snapshot.evidence_bundle.records) {
					const queryId = analysisQueryId(snapshot.target, snapshot.binding, evidence.operation, evidence.parameters);
					if (!stagedQueryIds.has(queryId)) continue;
					const entry = this.#entries.get(queryId);
					if (entry === undefined || !evidenceMatchesEntry(evidence, entry, snapshot)) continue;
					const previous = evidenceByQuery.get(queryId);
					if (previous !== undefined && previous.evidence_id !== evidence.evidence_id) ambiguous.add(queryId);
					else evidenceByQuery.set(queryId, evidence);
				}
				for (const [queryId, evidence] of evidenceByQuery) {
					this.#replayBindings.set(queryId, ambiguous.has(queryId) ? null : snapshotReplayBinding(evidence, records));
				}
				for (const entry of snapshot.workflow_entries) {
					if (!this.#workflowEntries.has(entry.query_id) && !this.#hasCapacity()) continue;
					if (!this.#workflowEntries.has(entry.query_id)) imported += 1;
					this.#workflowEntries.set(entry.query_id, entry);
				}
				return imported;
			}
			/** Refresh subject bindings backed by replaced authenticated metadata. */
			refreshEvidenceMetadata(replacements) {
				if (replacements.length === 0 || this.#target === undefined || this.#binding === undefined) return;
				const currentRecords = new Map(replacements.map(({ current }) => [current.evidence_id, current]));
				for (const [queryId, binding] of this.#replayBindings) {
					if (binding === null || binding.sourceEvidence === undefined) continue;
					const sources = binding.sourceEvidence;
					if (!sources.some((source) => currentRecords.has(source.evidence_id))) continue;
					this.#replayBindings.set(queryId, {
						evidenceId: binding.evidenceId,
						sourceEvidence: Object.freeze(sources.map((source) => currentRecords.get(source.evidence_id) ?? source))
					});
				}
				const header = {
					target: this.#target,
					binding: this.#binding
				};
				for (const { previous, current } of replacements) {
					if (current.subject === null || previous.subject?.local_path === current.subject.local_path) continue;
					const queryId = analysisQueryId(header.target, header.binding, previous.operation, previous.parameters);
					const entry = this.#entries.get(queryId);
					if (entry !== undefined && entry.execution.subject !== null && evidenceMatchesEntry(previous, entry, header)) this.#entries.set(queryId, {
						...entry,
						execution: {
							...entry.execution,
							subject: {
								...entry.execution.subject,
								path: current.subject.local_path
							}
						}
					});
					const workflow = this.#workflowEntries.get(queryId);
					if (workflow !== undefined && workflow.execution.subject !== null && evidenceMatchesWorkflowEntry(previous, workflow, header)) this.#workflowEntries.set(queryId, {
						...workflow,
						execution: {
							...workflow.execution,
							subject: {
								...workflow.execution.subject,
								path: current.subject.local_path
							}
						}
					});
				}
			}
			/** Build a complete snapshot for an active target. */
			export(target, profile, evidenceBundle) {
				if (target === undefined || profile === undefined) return err(new NoBinaryOpenError());
				try {
					const snapshotTargetIdentity = snapshotTarget(target);
					const binding = snapshotBinding(profile);
					const entries = [...this.#entries.values()].filter((entry) => entry.execution.subject?.sha256 === target.sha256).sort((left, right) => compareUnicodeCodePoints(left.query_id, right.query_id));
					const workflows = [...this.#workflowEntries.values()].filter((entry) => entry.execution.subject?.sha256 === target.sha256).sort((left, right) => compareUnicodeCodePoints(left.query_id, right.query_id));
					return ok(parseAnalysisSnapshot({
						target: snapshotTargetIdentity,
						binding,
						entries,
						workflow_entries: workflows,
						evidence_bundle: evidenceBundle
					}));
				} catch (cause) {
					return err(new EvidenceIntegrityError("Analysis snapshot validation failed", { cause }));
				}
			}
			/** Validate target identity, merge evidence atomically, then stage entries. */
			import(snapshot, active, mergeEvidence) {
				let validated;
				try {
					validated = immutableAnalysisSnapshot(snapshot);
				} catch (cause) {
					return err(new EvidenceIntegrityError("Analysis snapshot validation failed", { cause }));
				}
				if (active !== undefined) {
					const mismatch = snapshotBindingMismatch(validated, active.target, active.profile);
					if (mismatch !== undefined) return err(new AnalysisSnapshotMismatchError("Analysis snapshot target, provider, or analysis profile does not match the active binary", mismatch));
				}
				const importedEvidence = mergeEvidence(validated.evidence_bundle);
				return importedEvidence.ok ? ok(this.stage(validated)) : importedEvidence;
			}
			/** Return canonical entries for persistence. */
			entries() {
				return [...this.#entries.values()].sort((left, right) => compareUnicodeCodePoints(left.query_id, right.query_id)).map((entry) => structuredClone(entry));
			}
			/** Return canonical composed-workflow entries for persistence. */
			workflowEntries() {
				return [...this.#workflowEntries.values()].sort((left, right) => compareUnicodeCodePoints(left.query_id, right.query_id)).map((entry) => structuredClone(entry));
			}
			/** Record one exact derived workflow result unless the shared cache is full. */
			recordWorkflow(input) {
				this.select(input.target, input.profile);
				const queryId = analysisQueryId(snapshotTarget(input.target), snapshotBinding(input.profile), input.operation, input.parameters);
				if (!this.#workflowEntries.has(queryId) && !this.#hasCapacity()) return;
				const entry = createAnalysisSnapshotWorkflowEntry({
					target: snapshotTarget(input.target),
					binding: snapshotBinding(input.profile),
					operation: input.operation,
					parameters: input.parameters,
					execution: input.execution
				});
				this.#workflowEntries.set(entry.query_id, entry);
			}
			/** Replay an exact provider-specific query, marking its cached provenance. */
			lookup(target, profile, operation, parameters) {
				const queryId = analysisQueryId(snapshotTarget(target), snapshotBinding(profile), operation, parameters);
				const cached = this.#entries.get(queryId);
				if (cached === undefined) return undefined;
				const binding = this.#replayBindings.get(queryId);
				if (binding === null) return undefined;
				const cachedSubject = cached.execution.subject;
				const subject = cachedSubject == null ? null : rebindEvidenceSubjectTargetPath({
					path: cachedSubject.path,
					sha256: cachedSubject.sha256,
					format: cachedSubject.format,
					...cachedSubject.architecture === null ? {} : { architecture: cachedSubject.architecture }
				}, target);
				const execution = structuredClone({
					...binding === undefined ? {} : { evidenceId: binding.evidenceId },
					result: cached.execution.result,
					rawResult: cached.execution.raw_result,
					provider: cached.execution.provider,
					analysisProfile: structuredClone(profile),
					limitations: [...cached.execution.limitations, SNAPSHOT_REPLAY_LIMITATION],
					...cached.execution.relationship_coverage === null && RELATIONSHIP_OPERATIONS.has(operation) ? { relationshipCoverage: {
						status: "unknown",
						reason: "Snapshot entry does not report relationship coverage."
					} } : cached.execution.relationship_coverage === null ? {} : { relationshipCoverage: cached.execution.relationship_coverage },
					locations: cached.execution.locations,
					subject: subject ?? null
				});
				return binding?.sourceEvidence === undefined ? execution : {
					...execution,
					sourceEvidence: binding.sourceEvidence
				};
			}
			/** Record one successful immutable call unless the cache is full. */
			record(input) {
				const { target, profile, operation, parameters, execution } = input;
				this.select(target, profile);
				if (execution.referencesTruncated === true) return;
				if ((execution.sourceEvidence?.length ?? 0) > 0) return;
				const queryId = analysisQueryId(snapshotTarget(target), snapshotBinding(profile), operation, parameters);
				if (!this.#entries.has(queryId) && !this.#hasCapacity()) return;
				const entry = createAnalysisSnapshotEntry({
					target: snapshotTarget(target),
					binding: snapshotBinding(profile),
					operation,
					parameters,
					execution: {
						...execution,
						subject: execution.subject === undefined ? {
							path: target.path,
							sha256: target.sha256,
							format: target.format,
							...target.architecture === undefined ? {} : { architecture: target.architecture }
						} : execution.subject
					}
				});
				this.#entries.set(entry.query_id, entry);
				if (execution.evidenceId === undefined) this.#replayBindings.delete(entry.query_id);
				else this.#replayBindings.set(entry.query_id, {
					evidenceId: execution.evidenceId,
					...input.evidence === undefined ? {} : { sourceEvidence: Object.freeze([input.evidence]) }
				});
			}
			/** Forget all target-bound entries. */
			clear() {
				this.#clearEntries();
				this.#target = undefined;
				this.#binding = undefined;
			}
			#clearEntries() {
				this.#entries.clear();
				this.#replayBindings.clear();
				this.#workflowEntries.clear();
			}
			#hasCapacity() {
				return this.#entries.size + this.#workflowEntries.size < SNAPSHOT_CACHE_ENTRY_CEILING;
			}
		};
	})))();
}

//#endregion
//#region dist/application/binary/ProfilelessNativeWorkflowSnapshot.js
var profilelessNativeDispatchProfile, profilelessSnapshotMismatch, hasOnlyProfilelessNativeDispatchEntries;
function init_ProfilelessNativeWorkflowSnapshot() {
	return (init_ProfilelessNativeWorkflowSnapshot = __esmMin((() => {
		init_analysisProfile();
		init_analysisSnapshot();
		init_WorkflowAnalysisProfile();
		profilelessNativeDispatchProfile = (route) => {
			const descriptor = route.capabilities.get("inspect_native_dispatch_metadata");
			const profile = descriptor?.analysisProfile;
			if (descriptor === undefined || descriptor.operation !== "inspect_native_dispatch_metadata" || !descriptor.available || descriptor.provider.id !== "native-macos" || profile === undefined || profile.provider.id !== descriptor.provider.id || profile.provider.name !== descriptor.provider.name || profile.provider.version.length === 0) return undefined;
			return structuredClone(profile);
		};
		profilelessSnapshotMismatch = (snapshot, target, profile) => {
			const mismatch = snapshotBindingMismatch(snapshot, target, profile);
			if (mismatch !== undefined) return mismatch;
			if (profile === undefined || snapshot.entries.length !== 0 || !hasOnlyProfilelessNativeDispatchEntries(snapshot.workflow_entries, profile)) return { workflow_scope: "incompatible" };
			return undefined;
		};
		hasOnlyProfilelessNativeDispatchEntries = (entries, profile) => entries.length > 0 && entries.every((entry) => entry.operation === "inspect_native_dispatch_metadata" && analysisProfilesEqual(entry.execution.analysis_profile, workflowAnalysisProfile(profile, entry.operation)));
	})))();
}

//#endregion
export { AnalysisSnapshotCache as a, isSourceEvidenceRetainable as c, routeAllowsSnapshotReplay as d, routeProviderIdentity as f, profilelessSnapshotMismatch as i, requiresNativeSourceAdmissionBeforeReplay as l, init_ProfilelessNativeWorkflowSnapshot as n, init_AnalysisSnapshotCache as o, profilelessNativeDispatchProfile as r, isSnapshotCacheable as s, hasOnlyProfilelessNativeDispatchEntries as t, init_SessionProviderPolicy as u };