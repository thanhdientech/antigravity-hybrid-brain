import { fileSnapshotPartialObservationSchema, } from "../domain/fileSnapshotObservation.js";
import { completedStableArtifact } from "./readStableArtifact.js";
/** Completed file identity survives finalization; it does not establish decoded content. */
export const completedStableArtifactObservation = (cause, path) => {
    const snapshot = completedStableArtifact(cause);
    return snapshot === undefined
        ? undefined
        : fileSnapshotPartialObservationSchema.parse({
            kind: "file-snapshot-hash",
            path,
            sha256: snapshot.sha256,
            bytes: snapshot.bytes.length,
        });
};
