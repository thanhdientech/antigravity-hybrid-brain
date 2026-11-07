import { ProviderCleanupError } from "../domain/providerCleanupError.js";
import { err } from "../domain/result.js";
import { AnalysisError } from "../domain/analysisErrorBase.js";
/** Close one provider client and normalize unexpected adapter rejection. */
export const closeAnalysisClient = async (client, providerId, options = {}) => {
    // Nested/composite clients report failures before their final result settles.
    // Own notification identity for this close attempt, including the fallback
    // for clients that only return or reject with their cleanup failure.
    const reported = new Set();
    const report = (failure) => {
        if (reported.has(failure))
            return;
        reported.add(failure);
        options.onCleanupFailure?.(failure);
    };
    let result;
    try {
        result = await client.close({
            ...options,
            ...(options.onCleanupFailure === undefined
                ? {}
                : { onCleanupFailure: report }),
        });
    }
    catch (cause) {
        // A typed cleanup failure already names its leftover resources.
        const failure = cause instanceof AnalysisError && cause.cleanupIncomplete
            ? cause
            : new ProviderCleanupError(providerId, ["provider-client"], { reason: "provider client close rejected unexpectedly" }, { cause });
        result = err(failure);
    }
    if (!result.ok)
        report(result.error);
    return result;
};
