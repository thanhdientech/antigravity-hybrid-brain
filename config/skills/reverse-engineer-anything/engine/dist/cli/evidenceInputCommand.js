import { localPathStringSchema } from "../domain/localPath.js";
import { ArtifactResourceScope } from "../artifacts/ArtifactResourceScope.js";
import { absoluteCallerPath } from "../filesystem/callerPath.js";
import { finishAnalysisCommand } from "./finishAnalysisCommand.js";
/** Explicit portable lookup context for CLI workflows accepting retained IDs. */
export const evidenceBundleOption = localPathStringSchema
    .optional()
    .describe("Resolve exact retained Evidence IDs from this local Evidence bundle without reopening an analysis target");
/** Own one selected bundle read through workflow execution and final cleanup. */
export const runEvidenceInputCommand = (operation, bundlePath, signal, execute) => {
    const resources = new ArtifactResourceScope();
    return finishAnalysisCommand(async () => {
        let lookup;
        if (bundlePath !== undefined) {
            const { readImmutableEvidenceBundle } = await import("../application/EvidenceBundleFiles.js");
            const bundle = await readImmutableEvidenceBundle(absoluteCallerPath(bundlePath), signal, resources, operation);
            if (!bundle.ok)
                return bundle;
            const records = new Map(bundle.value.records.map((record) => [record.evidence_id, record]));
            lookup = (id) => records.get(id);
        }
        return execute(lookup, resources);
    }, resources, "rea", operation, signal);
};
