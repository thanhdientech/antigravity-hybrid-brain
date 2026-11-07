import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisSnapshotMismatchError, EvidenceIntegrityError, NoBinaryOpenError, UnknownRegistryError, err, init_configurationErrors, init_evidenceErrors, init_result, init_unknownRegistryError, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisCapabilityUnavailableError, AnalysisError, AnalysisInputError, AnalysisResourceConstraintError, init_analysisErrorBase, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { analysisInputErrorFromIssues, analysisProfilesEqual, compareUnicodeCodePoints, createAnalysisProfile, createEvidenceBundle, createImmutableEvidenceBundle, createResidualUnknown, init_analysisProfile, init_evidence, init_evidenceBundle, init_evidenceValidation, init_inputIssueProjection, init_residualUnknown, init_unicodeCodePointOrder, isImmutableEvidence, isImmutableEvidenceBundle, rebindEvidenceSubjectTargetPath, safeParseImmutableEvidence, safeParseImmutableEvidenceBundle, updateResidualUnknown, validateResidualUnknownAddition } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_jsonValue, jsonValueValidationIssue } from "./jsonValue-DGGrC1lE.js";
import { InvalidResidualUnknownGraphError, init_residualUnknownGraphError } from "./residualUnknownGraphError-Dik3wsXE.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";
import { estimateJsonStorage, init_JsonAuthenticationHeadroom, requireAuthenticationHeadroom } from "./JsonAuthenticationHeadroom-wkKxTsR2.js";
import { analysisQueryId, createAnalysisSnapshotEntry, createAnalysisSnapshotWorkflowEntry, evidenceMatchesEntry, evidenceMatchesWorkflowEntry, immutableAnalysisSnapshot, init_analysisSnapshot, parseAnalysisSnapshot, snapshotBinding, snapshotBindingMismatch, snapshotMatchesProfile, snapshotTarget } from "./EvidenceBundleFiles-kxea_C2c.js";
import { REA_WORKFLOW_PROVIDER, init_investigationProviders } from "./investigationProviders-Bs5C0Q8b.js";
import { ProviderCleanupError, init_providerCleanupError } from "./providerCleanupError-7gv3MO0l.js";
import { ENHANCED_TOOL_CONTRACTS, OFFICIAL_TOOL_CONTRACTS, init_enhancedToolContracts, init_officialToolContracts } from "./enhancedToolContracts-CSXJH_He.js";
import { z } from "zod";
import { getHeapStatistics } from "node:v8";

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
//#region dist/application/WorkflowAnalysisProfile.js
var workflowAnalysisProfile;
function init_WorkflowAnalysisProfile() {
	return (init_WorkflowAnalysisProfile = __esmMin((() => {
		init_analysisProfile();
		init_investigationProviders();
		workflowAnalysisProfile = (upstream, operation) => createAnalysisProfile(REA_WORKFLOW_PROVIDER, {
			upstream_analysis_profile: upstream,
			source_limitations: "provider-operation-caveats-v1",
			...operation === "trace_native_values" ? { value_flow_absence: "recorded-versus-unavailable-v1" } : {},
			...operation === "binary_overview" ? { workflow_revision: 5 } : operation === "batch_decompile" ? { workflow_revision: 4 } : operation === "trace_feature" ? { workflow_revision: 4 } : operation === "get_call_graph" ? { workflow_revision: 3 } : operation === "trace_native_values" ? { workflow_revision: 2 } : { workflow_revision: 1 }
		});
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
//#region dist/application/investigation/InvestigationRetention.js
var investigationMaximumRepresentationBytes, admitInvestigationAuthentication, investigationValueBytes, admitInvestigationRetention;
function init_InvestigationRetention() {
	return (init_InvestigationRetention = __esmMin((() => {
		init_analysisErrorCore();
		init_evidenceErrors();
		init_jsonValue();
		init_result();
		init_JsonAuthenticationHeadroom();
		investigationMaximumRepresentationBytes = (policy) => {
			const maximum = policy.maximumRepresentationBytes ?? Math.floor(getHeapStatistics().total_available_size / 4);
			if (!Number.isSafeInteger(maximum) || maximum < 0) throw new RangeError("Investigation representation allowance must be a nonnegative safe integer");
			return maximum;
		};
		admitInvestigationAuthentication = (input, operation, policy) => {
			const issue = jsonValueValidationIssue(input);
			if (issue !== undefined) return err(new EvidenceIntegrityError("Investigation input is not ordinary JSON", { userMessage: issue }));
			return requireAuthenticationHeadroom(input, {
				operation,
				path: "investigation",
				description: "Insufficient live heap headroom to authenticate investigation records",
				...policy.availableAuthenticationBytes === undefined ? {} : { availableBytes: policy.availableAuthenticationBytes() }
			});
		};
		investigationValueBytes = (input, remainingBytes) => estimateJsonStorage(input, {
			maximumValueBytes: Math.max(0, remainingBytes),
			includeSerialized: false
		}).valueBytes;
		admitInvestigationRetention = (operation, retainedBytes, deltaBytes, maximumBytes) => retainedBytes + deltaBytes <= maximumBytes ? ok(undefined) : err(new AnalysisResourceConstraintError(operation, "capacity", "The investigation's retained representation allowance is exhausted.", {
			retained_representation_bytes: retainedBytes,
			requested_delta_bytes: deltaBytes,
			maximum_representation_bytes: maximumBytes
		}, { remediationAction: "Export the retained investigation and start a new investigation, or increase the parent Node process heap before starting it. Retention never evicts existing Evidence or Unknown history." }));
	})))();
}

//#endregion
//#region dist/application/investigation/EvidenceLedger.js
var EvidenceLedger, LEDGER_ENTRY_BYTES, mutationOperation, readLedgerEvidence, unknownRevisionKey, displayMetadataAgree;
function init_EvidenceLedger() {
	return (init_EvidenceLedger = __esmMin((() => {
		init_residualUnknownGraphError();
		init_evidenceBundle();
		init_analysisErrorCore();
		init_evidenceErrors();
		init_unknownRegistryError();
		init_evidence();
		init_evidenceValidation();
		init_residualUnknown();
		init_result();
		init_unicodeCodePointOrder();
		init_inputIssueProjection();
		init_InvestigationRetention();
		EvidenceLedger = class {
			retentionPolicy;
			#records = new Map();
			#unknownRevisions = new Map();
			#unknownHeads = new Map();
			#retainedBytes = 0;
			#recordBytes = new Map();
			#maximumBytes;
			constructor(retentionPolicy = {}) {
				this.retentionPolicy = retentionPolicy;
				this.#maximumBytes = investigationMaximumRepresentationBytes(retentionPolicy);
			}
			/** Read committed counts without constructing or hashing a bundle. */
			statistics() {
				return {
					evidenceRecords: this.#records.size,
					unknownRevisions: this.#unknownRevisions.size,
					unknownHeads: this.#unknownHeads.size,
					retainedRepresentationBytes: this.#retainedBytes,
					maximumRepresentationBytes: this.#maximumBytes
				};
			}
			/** Record evidence idempotently; conflicting content is rejected. */
			record(input) {
				const authenticated = this.#readEvidence(input, "Evidence record validation failed");
				if (!authenticated.ok) return authenticated;
				const evidence = authenticated.value;
				const existing = this.#records.get(evidence.evidence_id);
				if (existing !== undefined) {
					return ok("duplicate");
				}
				const admitted = this.#admitChanges("record_evidence", new Map([[evidence.evidence_id, evidence]]));
				if (!admitted.ok) return admitted;
				this.#records.set(evidence.evidence_id, evidence);
				this.#commitAccounting(admitted.value);
				return ok("added");
			}
			/** Validate an entire bundle before atomically merging its records. */
			import(input) {
				if (!isImmutableEvidenceBundle(input)) {
					const headroom = admitInvestigationAuthentication(input, "import_evidence_bundle", this.retentionPolicy);
					if (!headroom.ok) return headroom;
				}
				const parsed = safeParseImmutableEvidenceBundle(input);
				if (!parsed.ok) {
					const { kind, message, cause } = parsed.error;
					if (kind === "single-record") return err(new AnalysisInputError("import_evidence_bundle", {
						cause,
						userMessage: message
					}));
					return err(new EvidenceIntegrityError("Evidence bundle validation failed", {
						cause,
						userMessage: message
					}));
				}
				const bundle = parsed.value;
				const recordChanges = new Map();
				let recordsAdded = 0;
				const replacements = [];
				for (const evidence of bundle.records) {
					const existing = this.#records.get(evidence.evidence_id);
					if (existing === undefined) {
						recordChanges.set(evidence.evidence_id, evidence);
						recordsAdded += 1;
						continue;
					}
					if (existing === evidence) continue;
					if (!displayMetadataAgree(existing, evidence)) {
						recordChanges.set(evidence.evidence_id, evidence);
						replacements.push({
							kind: "metadata",
							previous: existing,
							current: evidence
						});
					}
				}
				if (bundle.unknowns.length === 0) {
					const admitted = this.#admitChanges("import_evidence_bundle", recordChanges);
					if (!admitted.ok) return admitted;
					for (const evidence of recordChanges.values()) this.#records.set(evidence.evidence_id, evidence);
					this.#commitAccounting(admitted.value);
					return ok({
						recordsAdded,
						unknownsAdded: 0,
						changed: recordChanges.size > 0,
						replacements
					});
				}
				const unknownChanges = new Map();
				let unknownsAdded = 0;
				for (const unknown of bundle.unknowns) {
					const key = unknownRevisionKey(unknown);
					const existing = this.#unknownRevisions.get(key);
					if (existing !== undefined && existing.revision_digest !== unknown.revision_digest) return err(new EvidenceIntegrityError("Conflicting unknown revision", {
						userMessage: "The incoming residual-unknown history conflicts with a revision retained in this session. Inspect each history in a separate session; importing the unchanged bundle into this session cannot reconcile them.",
						diagnostics: {
							unknown_id: unknown.unknown_id,
							revision: unknown.revision
						}
					}));
					if (existing === undefined) {
						unknownChanges.set(key, unknown);
						unknownsAdded += 1;
					}
				}
				if (recordChanges.size === 0 && unknownChanges.size === 0) return ok({
					recordsAdded: 0,
					unknownsAdded: 0,
					changed: false,
					replacements: []
				});
				const admitted = this.#admitChanges("import_evidence_bundle", recordChanges, [...unknownChanges.values()]);
				if (!admitted.ok) return admitted;
				const pending = new Map(this.#records);
				for (const evidence of recordChanges.values()) pending.set(evidence.evidence_id, evidence);
				const pendingUnknowns = new Map(this.#unknownRevisions);
				for (const [key, unknown] of unknownChanges) pendingUnknowns.set(key, unknown);
				const checked = this.#validateCandidate(pending, pendingUnknowns);
				if (!checked.ok) {
					if (!(checked.error instanceof UnknownRegistryError)) return checked;
					return err(new EvidenceIntegrityError("Evidence bundle unknown registry failed", { cause: checked.error }));
				}
				this.#commit(checked.value);
				this.#commitAccounting(admitted.value);
				return ok({
					recordsAdded,
					unknownsAdded,
					changed: recordChanges.size > 0 || unknownsAdded > 0,
					replacements
				});
			}
			/** Export records in deterministic, semantically irrelevant ID order. */
			export() {
				return structuredClone(createEvidenceBundle([...this.#records.values()], [...this.#unknownRevisions.values()]));
			}
			/** Borrow an authenticated immutable bundle without copying its records. */
			immutableBundle() {
				return createImmutableEvidenceBundle([...this.#records.values()], [...this.#unknownRevisions.values()]);
			}
			/** Borrow immutable source records without constructing or hashing a bundle. */
			recordsForAnalysis() {
				return [...this.#records.values()];
			}
			/** Check whether one immutable Evidence ID is present in this ledger. */
			has(evidenceId) {
				return this.#records.has(evidenceId);
			}
			/** Return a detached immutable Evidence value by semantic ID. */
			get(evidenceId) {
				const evidence = this.#records.get(evidenceId);
				return evidence === undefined ? undefined : structuredClone(evidence);
			}
			/** Borrow authenticated immutable Evidence for read-only analysis without a full clone. */
			forAnalysis(evidenceId) {
				return this.#records.get(evidenceId);
			}
			/** Create one approved unknown and atomically append its mutation evidence. */
			recordUnknown(input, mutationEvidence) {
				const headroom = admitInvestigationAuthentication(input, "record_unknown", this.retentionPolicy);
				if (!headroom.ok) return headroom;
				const authenticated = this.#readEvidence(mutationEvidence, "Unknown mutation evidence is invalid", "record_unknown");
				if (!authenticated.ok) return authenticated;
				const parsedMutation = authenticated.value;
				let unknown;
				try {
					unknown = createResidualUnknown(input, parsedMutation.evidence_id, parsedMutation.subject?.digest.sha256 ?? null);
				} catch (cause) {
					if (!(cause instanceof z.ZodError)) throw cause;
					return err(analysisInputErrorFromIssues("record_unknown", cause.issues, input, { cause }));
				}
				if (this.#unknownHeads.has(unknown.unknown_id)) return err(new UnknownRegistryError("already-exists"));
				return this.#appendUnknown(unknown, parsedMutation);
			}
			/** Atomically record derived Evidence and a linked residual unknown. */
			recordWithUnknown(evidenceInput, input, mutationInput) {
				const headroom = admitInvestigationAuthentication(input, "record_unknown", this.retentionPolicy);
				if (!headroom.ok) return headroom;
				const authenticatedEvidence = this.#readEvidence(evidenceInput, "Atomic Evidence validation failed");
				if (!authenticatedEvidence.ok) return authenticatedEvidence;
				const authenticatedMutation = this.#readEvidence(mutationInput, "Atomic Evidence validation failed", "record_unknown");
				if (!authenticatedMutation.ok) return authenticatedMutation;
				const evidence = authenticatedEvidence.value;
				const mutation = authenticatedMutation.value;
				let unknown;
				try {
					unknown = createResidualUnknown(input, mutation.evidence_id, mutation.subject?.digest.sha256 ?? null);
				} catch (cause) {
					if (!(cause instanceof z.ZodError)) throw cause;
					return err(new UnknownRegistryError("invalid-transition", { cause }));
				}
				const creationUnknown = this.#unknownRevisions.get(unknownRevisionKey(unknown));
				if (creationUnknown !== undefined) {
					if (creationUnknown.revision_digest !== unknown.revision_digest) return err(new UnknownRegistryError("already-exists"));
					const checked = this.#appendIncremental([evidence]);
					if (!checked.ok) return checked;
					return ok(null);
				}
				const checked = this.#appendIncremental([evidence, mutation], unknown);
				if (!checked.ok) return checked;
				return ok(structuredClone(unknown));
			}
			/** Apply one approved full-state update using optimistic revision matching. */
			updateUnknown(input, mutationEvidence) {
				const current = this.#unknownHeads.get(input.unknown_id);
				if (current === undefined) return err(new UnknownRegistryError("not-found"));
				if (current.revision !== input.expected_revision) return err(new UnknownRegistryError("revision-conflict"));
				const headroom = admitInvestigationAuthentication(input, "update_unknown", this.retentionPolicy);
				if (!headroom.ok) return headroom;
				let unknown;
				try {
					unknown = updateResidualUnknown(current, input, mutationEvidence.evidence_id);
				} catch (cause) {
					if (!(cause instanceof z.ZodError)) throw cause;
					return err(analysisInputErrorFromIssues("update_unknown", cause.issues, input, { cause }));
				}
				const authenticated = this.#readEvidence(mutationEvidence, "Unknown mutation evidence is invalid", "update_unknown");
				if (!authenticated.ok) return authenticated;
				return this.#appendUnknown(unknown, authenticated.value);
			}
			/** Query current heads in stable ID order. */
			listUnknowns(filters = {}) {
				return this.listUnknownsPage(filters).items;
			}
			/** Select a stable page of current heads before detaching record payloads. */
			listUnknownsPage(query = {}) {
				const offset = query.offset ?? 0;
				const matching = [...this.#unknownHeads.values()].filter((unknown) => (query.status === undefined || unknown.status === query.status) && (query.severity === undefined || unknown.severity === query.severity) && (query.domain === undefined || unknown.domain === query.domain)).sort((left, right) => compareUnicodeCodePoints(left.unknown_id, right.unknown_id));
				const start = Math.min(offset, matching.length);
				const end = query.limit === undefined ? undefined : start + Math.min(query.limit, matching.length - start);
				const page = matching.slice(start, end);
				const nextOffset = offset <= matching.length && start + page.length < matching.length ? start + page.length : null;
				return {
					items: page.map((unknown) => structuredClone(unknown)),
					total: matching.length,
					offset,
					next_offset: nextOffset
				};
			}
			/** Return current resolution validity; imported invalid states are rejected. */
			verifyUnknownResolution(unknownId) {
				const unknown = this.#unknownHeads.get(unknownId);
				if (unknown === undefined) return err(new UnknownRegistryError("not-found"));
				return ok({
					valid: unknown.status === "resolved",
					truthVerified: unknown.resolution?.disposition === "verified",
					unknown: structuredClone(unknown)
				});
			}
			/** Explicit reset/disposal releases records and accounting; the ceiling stays stable. */
			clear() {
				this.#records.clear();
				this.#unknownRevisions.clear();
				this.#unknownHeads.clear();
				this.#retainedBytes = 0;
				this.#recordBytes.clear();
			}
			#appendUnknown(unknown, mutationEvidence) {
				const checked = this.#appendIncremental([mutationEvidence], unknown);
				if (!checked.ok) return checked;
				return ok(structuredClone(unknown));
			}
			/** Incoming records were authenticated and sealed at the ingestion boundary. */
			#appendIncremental(records, unknown) {
				const additions = new Map();
				for (const evidence of records) {
					const existing = additions.get(evidence.evidence_id) ?? this.#records.get(evidence.evidence_id);
					if (existing !== undefined) {
						continue;
					}
					additions.set(evidence.evidence_id, evidence);
				}
				const unknownKey = unknown === undefined ? undefined : unknownRevisionKey(unknown);
				if (unknownKey !== undefined && this.#unknownRevisions.has(unknownKey)) return err(new UnknownRegistryError("integrity"));
				if (unknown !== undefined) try {
					validateResidualUnknownAddition(unknown, {
						get: (id) => additions.get(id) ?? this.#records.get(id),
						has: (id) => additions.has(id) || this.#records.has(id)
					}, this.#unknownHeads);
				} catch (cause) {
					if (!(cause instanceof InvalidResidualUnknownGraphError)) throw cause;
					return err(new UnknownRegistryError(cause.constraint, { cause }));
				}
				const admitted = this.#admitChanges(unknown === undefined ? "record_evidence" : mutationOperation(unknown), additions, unknown === undefined ? [] : [unknown]);
				if (!admitted.ok) return admitted;
				for (const [id, evidence] of additions) this.#records.set(id, evidence);
				if (unknown !== undefined && unknownKey !== undefined) {
					this.#unknownRevisions.set(unknownKey, unknown);
					this.#unknownHeads.set(unknown.unknown_id, unknown);
				}
				this.#commitAccounting(admitted.value);
				return ok(undefined);
			}
			/** Return the sealed candidate facts that the commit will adopt. */
			#validateCandidate(records, unknowns) {
				const revisions = [...unknowns.values()];
				const headroom = admitInvestigationAuthentication(revisions, "import_evidence_bundle", this.retentionPolicy);
				if (!headroom.ok) return headroom;
				try {
					return ok(createImmutableEvidenceBundle([...records.values()], revisions));
				} catch (cause) {
					if (!(cause instanceof z.ZodError) && !(cause instanceof InvalidResidualUnknownGraphError)) throw cause;
					return err(new UnknownRegistryError(cause instanceof InvalidResidualUnknownGraphError ? cause.constraint : "integrity", { cause }));
				}
			}
			#commit(bundle) {
				const records = new Map(bundle.records.map((evidence) => [evidence.evidence_id, evidence]));
				const unknownRevisions = new Map(bundle.unknowns.map((unknown) => [unknownRevisionKey(unknown), unknown]));
				const unknownHeads = new Map();
				for (const unknown of bundle.unknowns) {
					const head = unknownHeads.get(unknown.unknown_id);
					if (head === undefined || head.revision < unknown.revision) unknownHeads.set(unknown.unknown_id, unknown);
				}
				this.#records = records;
				this.#unknownRevisions = unknownRevisions;
				this.#unknownHeads = unknownHeads;
			}
			#readEvidence(input, message, operation = "record_evidence") {
				if (!isImmutableEvidence(input)) {
					const headroom = admitInvestigationAuthentication(input, operation, this.retentionPolicy);
					if (!headroom.ok) return headroom;
				}
				return readLedgerEvidence(input, message);
			}
			/** Stage all byte-index changes; refused inputs never grow owner metadata. */
			#admitChanges(operation, records, unknowns = []) {
				let delta = 0;
				const recordBytes = new Map();
				for (const id of records.keys()) {
					const previousBytes = this.#recordBytes.get(id);
					if (previousBytes !== undefined) delta -= LEDGER_ENTRY_BYTES + previousBytes;
				}
				for (const record of records.values()) {
					const remaining = this.#maximumBytes - this.#retainedBytes - delta;
					const bytes = investigationValueBytes(record, remaining - LEDGER_ENTRY_BYTES);
					delta += LEDGER_ENTRY_BYTES + bytes;
					const admitted = admitInvestigationRetention(operation, this.#retainedBytes, delta, this.#maximumBytes);
					if (!admitted.ok) return admitted;
					recordBytes.set(record.evidence_id, bytes);
				}
				const newHeads = new Set();
				for (const unknown of unknowns) {
					const key = unknownRevisionKey(unknown);
					const indexBytes = LEDGER_ENTRY_BYTES + 64 + key.length * 2;
					const headBytes = this.#unknownHeads.has(unknown.unknown_id) || newHeads.has(unknown.unknown_id) ? 0 : LEDGER_ENTRY_BYTES;
					newHeads.add(unknown.unknown_id);
					const remaining = this.#maximumBytes - this.#retainedBytes - delta;
					delta += indexBytes + headBytes + investigationValueBytes(unknown, remaining - indexBytes - headBytes);
					const admitted = admitInvestigationRetention(operation, this.#retainedBytes, delta, this.#maximumBytes);
					if (!admitted.ok) return admitted;
				}
				return ok({
					deltaBytes: delta,
					recordBytes
				});
			}
			#commitAccounting(changes) {
				for (const [id, bytes] of changes.recordBytes) this.#recordBytes.set(id, bytes);
				this.#retainedBytes += changes.deltaBytes;
			}
		};
		LEDGER_ENTRY_BYTES = 256;
		mutationOperation = (unknown) => unknown.revision === 1 ? "record_unknown" : "update_unknown";
		readLedgerEvidence = (input, message) => {
			const checked = safeParseImmutableEvidence(input);
			return checked.ok ? checked : err(new EvidenceIntegrityError(message, { cause: checked.error }));
		};
		unknownRevisionKey = (unknown) => `${unknown.unknown_id}:${String(unknown.revision)}`;
		displayMetadataAgree = (left, right) => left.subject?.name === right.subject?.name && left.subject?.local_path === right.subject?.local_path && left.caller_input_path === right.caller_input_path;
	})))();
}

//#endregion
//#region dist/application/AnalysisClientCleanup.js
var closeAnalysisClient;
function init_AnalysisClientCleanup() {
	return (init_AnalysisClientCleanup = __esmMin((() => {
		init_providerCleanupError();
		init_result();
		init_analysisErrorBase();
		closeAnalysisClient = async (client, providerId, options = {}) => {
			const reported = new Set();
			const report = (failure) => {
				if (reported.has(failure)) return;
				reported.add(failure);
				options.onCleanupFailure?.(failure);
			};
			let result;
			try {
				result = await client.close({
					...options,
					...options.onCleanupFailure === undefined ? {} : { onCleanupFailure: report }
				});
			} catch (cause) {
				const failure = cause instanceof AnalysisError && cause.cleanupIncomplete ? cause : new ProviderCleanupError(providerId, ["provider-client"], { reason: "provider client close rejected unexpectedly" }, { cause });
				result = err(failure);
			}
			if (!result.ok) report(result.error);
			return result;
		};
	})))();
}

//#endregion
//#region dist/application/binary/BundleResourceSession.js
var BUNDLE_NATIVE_RESOURCE_OPERATIONS, BUNDLE_ARTIFACT_RESOURCE_OPERATIONS, BUNDLE_RESOURCE_OPERATIONS, isBundleResourceOperation, combineBundleResourceClients;
function init_BundleResourceSession() {
	return (init_BundleResourceSession = __esmMin((() => {
		init_analysisErrorCore();
		init_analysisErrorCleanup();
		init_result();
		init_AnalysisClientCleanup();
		BUNDLE_NATIVE_RESOURCE_OPERATIONS = new Set(["inspect_plist"]);
		BUNDLE_ARTIFACT_RESOURCE_OPERATIONS = new Set([
			"decode_interface_builder",
			"inspect_asset_catalog",
			"inspect_keyed_archive"
		]);
		BUNDLE_RESOURCE_OPERATIONS = new Set([...BUNDLE_NATIVE_RESOURCE_OPERATIONS, ...BUNDLE_ARTIFACT_RESOURCE_OPERATIONS]);
		isBundleResourceOperation = (name) => {
			for (const operation of BUNDLE_RESOURCE_OPERATIONS) if (operation === name) return true;
			return false;
		};
		combineBundleResourceClients = (artifactClient, nativeClient) => ({
			execute: (operation, parameters, options) => {
				if (operation === "health") return artifactClient.execute(operation, parameters, options);
				if (!BUNDLE_RESOURCE_OPERATIONS.has(operation)) return Promise.resolve(err(new AnalysisCapabilityUnavailableError("bundle-resources", operation, "This session provides read-only app resource inspection only.")));
				return BUNDLE_NATIVE_RESOURCE_OPERATIONS.has(operation) ? nativeClient.execute(operation, parameters, options) : artifactClient.execute(operation, parameters, options);
			},
			close: async (options) => {
				const [artifact, native] = await Promise.all([closeAnalysisClient(artifactClient, "bundle-resources", options), closeAnalysisClient(nativeClient, "bundle-resources", options)]);
				if (!artifact.ok && !native.ok) {
					const failure = analysisErrorWithCleanupFailure(artifact.error, native.error, "close_binary");
					if (artifact.error.cleanupIncomplete && native.error.cleanupIncomplete) failure.bindCleanupDependencies([artifact.error, native.error]);
					return err(failure);
				}
				if (!artifact.ok) return artifact;
				if (!native.ok) return native;
				return ok(null);
			}
		});
	})))();
}

//#endregion
export { AnalysisSnapshotCache, BUNDLE_ARTIFACT_RESOURCE_OPERATIONS, BUNDLE_NATIVE_RESOURCE_OPERATIONS, BUNDLE_RESOURCE_OPERATIONS, EvidenceLedger, admitInvestigationAuthentication, closeAnalysisClient, combineBundleResourceClients, hasOnlyProfilelessNativeDispatchEntries, init_AnalysisClientCleanup, init_AnalysisSnapshotCache, init_BundleResourceSession, init_EvidenceLedger, init_InvestigationRetention, init_ProfilelessNativeWorkflowSnapshot, init_SessionProviderPolicy, init_WorkflowAnalysisProfile, isSnapshotCacheable, isSourceEvidenceRetainable, profilelessNativeDispatchProfile, profilelessSnapshotMismatch, requiresNativeSourceAdmissionBeforeReplay, routeAllowsSnapshotReplay, routeProviderIdentity, workflowAnalysisProfile };