import { analysisErrorWithCleanupFailure } from "../domain/analysisErrorCleanup.js";
import { ProviderCleanupError } from "../domain/providerCleanupError.js";
import { ArtifactReaderFailure } from "./ArtifactReader.js";
import { bindArtifactFileCleanup } from "./ArtifactFileOperation.js";
import { completedStableArtifactObservation } from "./StableArtifactObservation.js";
/** Offer the verified regular-file target after a selected symlink is rejected. */
export const stableArtifactInputRecovery = (cause) => cause.reason === "path" && cause.resolvedPath !== undefined
    ? {
        remediationAction: `Retry with the resolved regular file path ${cause.resolvedPath}. The selected symlink is not admitted; the retry will validate the target again.`,
        conformsToInputContract: true,
    }
    : {};
const artifactCleanupFailure = (cause, providerId, operation) => {
    if (!(cause instanceof ArtifactReaderFailure) || cause.cleanup === undefined)
        return undefined;
    return new ProviderCleanupError(providerId, cause.cleanup.resources, { reason: cause.cleanup.reason }, { cause, operation });
};
/** Project descriptor cleanup while keeping its exact leases bound to the error. */
export const projectArtifactCloseFailure = (cause, providerId, operation) => {
    const error = artifactCleanupFailure(cause, providerId, operation);
    if (error === undefined)
        return cause;
    bindArtifactFileCleanup(cause, error);
    return error;
};
/** Preserve completed physical identity and exact cleanup ownership around a provider's primary failure. */
export const projectStableArtifactFailure = (cause, primary, path, providerId, operation) => {
    const observation = completedStableArtifactObservation(cause, path);
    if (observation !== undefined)
        primary.retainPartialObservation(observation);
    const cleanup = artifactCleanupFailure(cause, providerId, operation);
    if (cleanup === undefined)
        return primary;
    const error = analysisErrorWithCleanupFailure(primary, cleanup, operation);
    bindArtifactFileCleanup(cause, error);
    return error;
};
