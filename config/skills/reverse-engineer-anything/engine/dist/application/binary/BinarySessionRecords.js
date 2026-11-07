import { analysisProfilesEqual } from "../../domain/analysisProfile.js";
import { evidenceBundleForTarget } from "../../domain/evidenceBundle.js";
import { EvidenceIntegrityError, AnalysisSnapshotMismatchError, } from "../../domain/evidenceErrors.js";
import { AnalysisCancelledError, AnalysisCapabilityUnavailableError, } from "../../domain/analysisErrorCore.js";
import { err, ok } from "../../domain/result.js";
import { AnalysisSnapshotCache } from "./AnalysisSnapshotCache.js";
import { InvestigationRecords } from "../investigation/InvestigationRecords.js";
import { ArtifactResourceScope } from "../../artifacts/ArtifactResourceScope.js";
import { ArtifactReaderFailure } from "../../artifacts/ArtifactReader.js";
import { bindRegularFileCleanup } from "../RegularFileRead.js";
import { writeAnalysisSnapshot as writeSnapshotFile, readAnalysisSnapshot as readSnapshotFile, } from "./AnalysisSnapshotFiles.js";
import { ProviderCleanupError } from "../../domain/providerCleanupError.js";
import { workflowAnalysisProfile } from "../WorkflowAnalysisProfile.js";
import { hasOnlyProfilelessNativeDispatchEntries, profilelessSnapshotMismatch, } from "./ProfilelessNativeWorkflowSnapshot.js";
const SNAPSHOT_MUTATION_RECOVERY = "Export session observations through export_evidence_bundle if needed. Close the active target without saving a snapshot, then reopen it before importing or saving a snapshot.";
/** A missing replay prerequisite is not an Evidence integrity failure. */
const snapshotUnavailable = (reason) => new AnalysisCapabilityUnavailableError("rea", "export_analysis_snapshot", reason, {
    userMessage: `Analysis snapshot unavailable: ${reason}`,
    remediationAction: "Export session observations with export_evidence_bundle if needed, or call close_binary without snapshot_path to close the session.",
});
/** Own binary snapshots and coordinate the composed investigation records. */
export class BinarySessionRecords {
    #records;
    fileResources = new ArtifactResourceScope();
    resourceScope = {
        retain: (owner, resource) => this.fileResources.retain({
            kind: "lease",
            resource,
            lease: { release: () => owner.close() },
        }),
        run: (operation) => this.fileResources.run(operation),
    };
    get hasPendingFileResources() {
        return this.fileResources.hasPending;
    }
    #snapshot = new AnalysisSnapshotCache();
    #snapshotInvalidated = false;
    #investigationDisposed = false;
    #snapshotListeners = new Set();
    constructor(records = new InvestigationRecords()) {
        this.#records = records;
    }
    /** Observe changes to the mutable current analysis snapshot resource. */
    onAnalysisSnapshotChanged(listener) {
        this.#snapshotListeners.add(listener);
        return () => this.#snapshotListeners.delete(listener);
    }
    recordEvidence(evidence) {
        if (this.#investigationDisposed)
            return err(new AnalysisCancelledError("record_evidence"));
        const recorded = this.#records.recordEvidence(evidence);
        if (recorded.ok && recorded.value === "added")
            this.#emitSnapshotChanged();
        return recorded;
    }
    hasEvidence(evidenceId) {
        return this.#records.hasEvidence(evidenceId);
    }
    evidenceById(evidenceId) {
        return this.#records.evidenceById(evidenceId);
    }
    /** Borrow immutable investigation Evidence without copying a complete graph. */
    evidenceForAnalysis(evidenceId) {
        return this.#records.evidenceForAnalysis(evidenceId);
    }
    exportEvidenceBundle() {
        return this.#records.exportEvidenceBundle();
    }
    /** Borrow the record owner's immutable bundle for read-only workflows. */
    immutableEvidenceBundle() {
        return this.#records.immutableEvidenceBundle();
    }
    /** Read one snapshot while retaining failed descriptors under this session. */
    readAnalysisSnapshot(path, signal) {
        return readSnapshotFile(path, signal, this.fileResources);
    }
    /** Persist one provider-neutral snapshot under this session's resource owner. */
    writeAnalysisSnapshot(snapshot, path, overwrite) {
        return writeSnapshotFile(snapshot, path, overwrite, this.fileResources);
    }
    /** Retry retained target reads and snapshot files at the owning session shutdown. */
    async closeFileResources() {
        try {
            await this.fileResources.retryCleanup();
            return ok(null);
        }
        catch (cause) {
            const observation = ArtifactReaderFailure.cleanupObservation(cause, "analysis session files");
            const error = new ProviderCleanupError("rea", observation.resources, { reason: observation.reason }, { cause, operation: "close_binary" });
            bindRegularFileCleanup(cause, error);
            return err(error);
        }
    }
    importEvidenceBundle(bundle) {
        if (this.#investigationDisposed)
            return err(new AnalysisCancelledError("import_evidence_bundle"));
        const imported = this.#records.mergeEvidenceBundle(bundle);
        if (!imported.ok)
            return imported;
        this.#snapshot.refreshEvidenceMetadata(imported.value.replacements);
        if (imported.value.changed)
            this.#emitSnapshotChanged();
        return ok({
            recordsAdded: imported.value.recordsAdded,
            unknownsAdded: imported.value.unknownsAdded,
            totalRecords: this.#records.statistics().evidenceRecords,
        });
    }
    exportAnalysisSnapshot() {
        const active = this.activeAnalysisBinding();
        if (this.#snapshotInvalidated)
            return err(new EvidenceIntegrityError("Analysis snapshots are unavailable because analysis metadata may have changed", {
                userMessage: `Analysis snapshots are unavailable because analysis metadata may have changed. ${SNAPSHOT_MUTATION_RECOVERY}`,
            }));
        const target = active?.target;
        const profile = active?.profile ?? active?.profilelessWorkflowProfile ?? undefined;
        if (target !== undefined && profile === undefined)
            return err(snapshotUnavailable("The active target has no provider analysis profile for a snapshot."));
        if (active?.profile === null &&
            (target === undefined ||
                profile === undefined ||
                !this.#snapshot.matches(target, profile) ||
                this.#snapshot.entries().length !== 0 ||
                !hasOnlyProfilelessNativeDispatchEntries(this.#snapshot.workflowEntries(), profile)))
            return err(snapshotUnavailable("The active session does not have a supported snapshot binding with replayable workflow observations for this target."));
        return this.#snapshot.export(target, profile, target === undefined
            ? this.#records.exportEvidenceBundle()
            : evidenceBundleForTarget(this.#records.exportEvidenceBundle(), target.sha256));
    }
    importAnalysisSnapshot(snapshot) {
        if (this.#investigationDisposed)
            return err(new AnalysisCancelledError("import_analysis_snapshot"));
        const active = this.activeAnalysisBinding();
        if (active !== undefined && this.#snapshotInvalidated)
            return err(new EvidenceIntegrityError("Analysis snapshots cannot be imported because analysis metadata may have changed", {
                userMessage: `Analysis snapshots cannot be imported because analysis metadata may have changed. ${SNAPSHOT_MUTATION_RECOVERY}`,
            }));
        const profile = active?.profile ?? active?.profilelessWorkflowProfile;
        if (active?.profile === null) {
            const mismatch = profilelessSnapshotMismatch(snapshot, active.target, profile);
            if (mismatch !== undefined)
                return err(new AnalysisSnapshotMismatchError("Analysis snapshot is not bound to the active native dispatch reader", mismatch));
        }
        const imported = this.#snapshot.import(snapshot, active === undefined
            ? undefined
            : profile === undefined
                ? undefined
                : { target: active.target, profile }, (bundle) => {
            const imported = this.#records.mergeEvidenceBundle(bundle);
            if (!imported.ok)
                return imported;
            this.#snapshot.refreshEvidenceMetadata(imported.value.replacements);
            return ok(imported.value.recordsAdded);
        });
        if (imported.ok)
            this.#emitSnapshotChanged();
        return imported;
    }
    snapshotMismatch(target, profile) {
        return this.#snapshot.mismatch(target, profile ?? undefined);
    }
    selectSnapshot(target, profile) {
        this.#snapshot.select(target, profile);
        this.#emitSnapshotChanged();
    }
    lookupSnapshot(target, profile, operation, parameters) {
        if (this.#snapshotInvalidated)
            return undefined;
        return this.#snapshot.lookup(target, profile, operation, parameters);
    }
    recordSnapshot(input) {
        if (this.#snapshotInvalidated)
            return;
        this.#snapshot.record(input);
        this.#emitSnapshotChanged();
    }
    /** Retain one derived workflow result alongside its provider cache entries. */
    recordWorkflowSnapshot(input) {
        const active = this.activeAnalysisBinding();
        if (active === undefined)
            return err(new EvidenceIntegrityError("Workflow snapshot entries require an active concrete provider profile"));
        if (this.#snapshotInvalidated)
            return ok(null);
        const profile = active.profile ?? active.profilelessWorkflowProfile;
        if (profile === undefined ||
            !analysisProfilesEqual(profile, input.bindingProfile) ||
            !analysisProfilesEqual(input.execution.analysisProfile, workflowAnalysisProfile(profile, input.operation)) ||
            (active.profile === null &&
                input.operation !== "inspect_native_dispatch_metadata"))
            return err(new EvidenceIntegrityError("Workflow snapshot entry does not match the active reader profile"));
        try {
            this.#snapshot.recordWorkflow({
                target: active.target,
                profile,
                ...input,
            });
            this.#emitSnapshotChanged();
            return ok(null);
        }
        catch (cause) {
            return err(new EvidenceIntegrityError(cause instanceof Error
                ? cause.message
                : "Workflow snapshot entry validation failed", { cause }));
        }
    }
    invalidateSnapshot() {
        this.#snapshot.clear();
        this.#snapshotInvalidated = true;
        this.#emitSnapshotChanged();
    }
    resetSnapshotInvalidation() {
        if (!this.#snapshotInvalidated)
            return;
        this.#snapshot.clear();
        this.#snapshotInvalidated = false;
        this.#emitSnapshotChanged();
    }
    clearSnapshot() {
        this.#snapshot.clear();
        this.#emitSnapshotChanged();
    }
    /** Clear replay and engine invalidation state when the engine is retired. */
    clearEngineRecords() {
        this.#snapshot.clear();
        this.#snapshotInvalidated = false;
        this.#emitSnapshotChanged();
    }
    /** End investigation history without making mutated engine state replayable again. */
    clearInvestigationRecords() {
        this.#records.clear();
        this.clearSnapshot();
    }
    /** Terminal runtime disposal also seals direct record-port writes. */
    disposeInvestigationRecords() {
        this.#investigationDisposed = true;
        this.clearInvestigationRecords();
    }
    investigationStatistics() {
        const statistics = this.#records.statistics();
        return {
            evidence_records: statistics.evidenceRecords,
            unknown_revisions: statistics.unknownRevisions,
            unknown_heads: statistics.unknownHeads,
            retained_representation_bytes: statistics.retainedRepresentationBytes,
            maximum_representation_bytes: statistics.maximumRepresentationBytes,
            persistence: "memory",
        };
    }
    #emitSnapshotChanged() {
        for (const listener of this.#snapshotListeners) {
            try {
                const notification = listener();
                if (notification !== undefined)
                    void notification.catch((cause) => {
                        // best-effort cleanup: async observer notifications must not reject unhandled.
                        void cause;
                    });
            }
            catch (cause) {
                // External resource observers are best-effort; one callback must not
                // make a committed evidence mutation appear to fail.
                void cause;
            }
        }
    }
    recordUnknown(input) {
        if (this.#investigationDisposed)
            return err(new AnalysisCancelledError("record_unknown"));
        const target = this.activeAnalysisBinding()?.target;
        const recorded = this.#records.recordUnknown(input, target);
        if (recorded.ok)
            this.#emitSnapshotChanged();
        return recorded;
    }
    recordEvidenceWithUnknown(evidence, input) {
        if (this.#investigationDisposed)
            return err(new AnalysisCancelledError("record_evidence_with_unknown"));
        const recorded = this.#records.recordEvidenceWithUnknown(evidence, input);
        if (recorded.ok)
            this.#emitSnapshotChanged();
        return recorded;
    }
    updateUnknown(input) {
        if (this.#investigationDisposed)
            return err(new AnalysisCancelledError("update_unknown"));
        const target = this.activeAnalysisBinding()?.target;
        const updated = this.#records.updateUnknown(input, target);
        if (updated.ok)
            this.#emitSnapshotChanged();
        return updated;
    }
    listUnknowns(filters = {}) {
        return this.#records.listUnknowns(filters);
    }
    listUnknownsPage(query = {}) {
        return this.#records.listUnknownsPage(query);
    }
    verifyUnknownResolution(unknownId) {
        return this.#records.verifyUnknownResolution(unknownId);
    }
}
