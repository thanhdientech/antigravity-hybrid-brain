import { AnalysisCapabilityUnavailableError } from "./analysisErrorCore.js";
/** Project a provider-owned configuration failure and its repair instruction. */
export const providerConfigurationRefusal = (providerId, operation, failure) => {
    const reason = `${failure.message}. ${failure.remediation}`;
    return new AnalysisCapabilityUnavailableError(providerId, operation, reason, {
        cause: failure,
        userMessage: reason,
        diagnostics: failure.diagnostics,
    });
};
