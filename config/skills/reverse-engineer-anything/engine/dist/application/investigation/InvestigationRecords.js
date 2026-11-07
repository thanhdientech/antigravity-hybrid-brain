import { EvidenceLedger } from "./EvidenceLedger.js";
import { unknownMutationEvidence } from "./UnknownEvidence.js";
import { admitInvestigationAuthentication, } from "./InvestigationRetention.js";
/** One investigation's validated record owner, independent of binary execution. */
export class InvestigationRecords {
    retentionPolicy;
    #evidence;
    /** Snapshot a heap-derived representation allowance for this investigation. */
    constructor(retentionPolicy = {}) {
        this.retentionPolicy = retentionPolicy;
        this.#evidence = new EvidenceLedger(retentionPolicy);
    }
    /** O(1) committed state; no bundle construction, cloning or hashing. */
    statistics() {
        return this.#evidence.statistics();
    }
    /** Record immutable Evidence idempotently; reject conflicting content. */
    recordEvidence(evidence) {
        return this.#evidence.record(evidence);
    }
    /** Check one semantic Evidence ID without exposing stored values. */
    hasEvidence(evidenceId) {
        return this.#evidence.has(evidenceId);
    }
    /** Return a detached Evidence value for one semantic ID. */
    evidenceById(evidenceId) {
        return this.#evidence.get(evidenceId);
    }
    /** Borrow an immutable authenticated record for a read-only application workflow. */
    evidenceForAnalysis(evidenceId) {
        return this.#evidence.forAnalysis(evidenceId);
    }
    /** Export a detached deterministic bundle of Evidence and Unknown revisions. */
    exportEvidenceBundle() {
        return this.#evidence.export();
    }
    /** Borrow an authenticated immutable bundle snapshot without copying its records. */
    immutableEvidenceBundle() {
        return this.#evidence.immutableBundle();
    }
    /** Atomically merge a bundle and report changes for the owner's post-commit observers. */
    mergeEvidenceBundle(bundle) {
        return this.#evidence.import(bundle);
    }
    /** Explicit reset/disposal releases the investigation's durable records. */
    clear() {
        this.#evidence.clear();
    }
    /** Record an Unknown with an explicitly supplied Evidence subject, if any. */
    recordUnknown(input, target) {
        const admitted = admitInvestigationAuthentication(input, "record_unknown", this.retentionPolicy);
        if (!admitted.ok)
            return admitted;
        return this.#evidence.recordUnknown(input, unknownMutationEvidence(target, { operation: "record_unknown", input }));
    }
    /** Commit derived Evidence and its Unknown atomically without an implicit subject. */
    recordEvidenceWithUnknown(evidence, input) {
        const admitted = admitInvestigationAuthentication(input, "record_unknown", this.retentionPolicy);
        if (!admitted.ok)
            return admitted;
        return this.#evidence.recordWithUnknown(evidence, input, unknownMutationEvidence(undefined, {
            operation: "record_unknown",
            input,
        }));
    }
    /** Update an optimistic revision with an explicitly supplied Evidence subject. */
    updateUnknown(input, target) {
        const admitted = admitInvestigationAuthentication(input, "update_unknown", this.retentionPolicy);
        if (!admitted.ok)
            return admitted;
        const evidence = unknownMutationEvidence(target, {
            operation: "update_unknown",
            input,
        });
        return this.#evidence.updateUnknown(input, evidence);
    }
    /** Return detached current Unknown revisions matching the selected filters. */
    listUnknowns(filters = {}) {
        return this.#evidence.listUnknowns(filters);
    }
    listUnknownsPage(query = {}) {
        return this.#evidence.listUnknownsPage(query);
    }
    /** Verify registry consistency without asserting the answer is true. */
    verifyUnknownResolution(unknownId) {
        return this.#evidence.verifyUnknownResolution(unknownId);
    }
}
