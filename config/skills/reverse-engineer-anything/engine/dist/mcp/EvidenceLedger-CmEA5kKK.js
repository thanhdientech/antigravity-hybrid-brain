import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { a as AnalysisCapabilityUnavailableError, f as init_analysisErrorCore, l as AnalysisResourceConstraintError, o as AnalysisInputError } from "./analysisErrorCore-BCqhUcUc.js";
import { a as jsonValueValidationIssue, n as init_jsonValue } from "./jsonValue-CbQQraup.js";
import { d as isImmutableEvidence, u as init_evidence } from "./evidence-Cy8VjugF.js";
import { a as UnknownRegistryError, f as init_evidenceErrors, h as init_residualUnknownGraphError, l as EvidenceIntegrityError, o as init_unknownRegistryError, p as InvalidResidualUnknownGraphError } from "./digests-Ct-nksBF.js";
import { o as safeParseImmutableEvidence, t as init_evidenceValidation } from "./evidenceValidation-B-DyYxpa.js";
import { r as init_inputIssueProjection, t as analysisInputErrorFromIssues } from "./inputIssueProjection-rtSG7-RA.js";
import { r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { a as init_evidenceBundle, d as safeParseImmutableEvidenceBundle, h as init_residualUnknown, m as createResidualUnknown, n as createImmutableEvidenceBundle, o as isImmutableEvidenceBundle, p as validateResidualUnknownAddition, t as createEvidenceBundle, v as updateResidualUnknown } from "./evidenceBundle-CwDqQKst.js";
import { n as init_JsonAuthenticationHeadroom, r as requireAuthenticationHeadroom, t as estimateJsonStorage } from "./JsonAuthenticationHeadroom-CXha_Mvo.js";
import { z } from "zod";
import { getHeapStatistics } from "node:v8";

//#region dist/application/investigation/recordEvidenceSources.js
var withEvidenceSources, retainAnalysisResultSources, recordEvidenceSources;
function init_recordEvidenceSources() {
	return (init_recordEvidenceSources = __esmMin((() => {
		init_result();
		init_analysisErrorCore();
		withEvidenceSources = (result, sources) => sources.length === 0 ? result : {
			...result,
			sourceEvidence: sources
		};
		retainAnalysisResultSources = (operation, recordEvidence, result, options = {}) => {
			const sources = result.sourceEvidence ?? [];
			const retained = sources.length > 0 && recordEvidence === undefined && options.sourceOwner !== "caller" ? err(new AnalysisCapabilityUnavailableError("rea", operation, "Provider source Evidence requires an explicit retention owner.", { userMessage: "Use an analysis session that retains provider source Evidence, or supply an Evidence recorder when registering this adapter." })) : recordEvidenceSources(recordEvidence, sources);
			if (retained.ok) return result;
			if (result.ok) return retained;
			result.error.retainSecondaryFailure(retained.error);
			return result;
		};
		recordEvidenceSources = (recordEvidence, sources) => {
			for (const source of sources) {
				const recorded = recordEvidence?.(source);
				if (recorded !== undefined && !recorded.ok) return recorded;
			}
			return ok(null);
		};
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
export { init_recordEvidenceSources as a, withEvidenceSources as c, init_InvestigationRetention as i, init_EvidenceLedger as n, recordEvidenceSources as o, admitInvestigationAuthentication as r, retainAnalysisResultSources as s, EvidenceLedger as t };