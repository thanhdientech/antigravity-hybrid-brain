import { AnalysisError, } from "./analysisErrorBase.js";
/** No configured provider can satisfy a requested operation or target binding. */
export class ProviderSelectionError extends AnalysisError {
    _tag = "ProviderSelectionError";
    operation;
    reason;
    requestedProviderId;
    candidateIds;
    rejections;
    remediationAction;
    userMessage;
    constructor(options) {
        const operation = options.operation ?? "open_binary";
        super(providerSelectionDiagnostic(options), {
            capturedOutput: options.capturedOutput,
            diagnostics: options.diagnostics,
            partialObservation: options.partialObservation,
            ...(options.cause === undefined ? {} : { cause: options.cause }),
        });
        this.operation = operation;
        this.reason = options.reason;
        this.requestedProviderId = options.requestedProviderId;
        this.candidateIds = [...options.candidateIds];
        this.rejections = [...(options.rejections ?? [])].map((rejection) => ({
            ...rejection,
            diagnostics: structuredClone(rejection.diagnostics),
        }));
        this.remediationAction =
            options.remediationAction ?? requestedProviderRepair(options);
        this.userMessage =
            options.userMessage ?? providerSelectionUserMessage(options);
    }
}
const providerSelectionDiagnostic = (options) => {
    const candidates = options.candidateIds.length === 0
        ? "none"
        : options.candidateIds.join(", ");
    return `Analysis provider selection failed (${options.reason}) for ${options.requestedProviderId}; candidates: ${candidates}`;
};
/**
 * A concrete selection refused by its provider's readiness is repaired by
 * that provider's own instruction, not by generic selection advice.
 */
const requestedProviderRepair = (options) => options.reason === "provider_unavailable"
    ? options.rejections?.find(({ providerId, origin }) => providerId === options.requestedProviderId &&
        origin === "availability")?.remediation
    : undefined;
/** True when every recorded rejection describes availability, not target support. */
const providerAvailabilityOnly = (rejections) => rejections !== undefined &&
    rejections.length > 0 &&
    rejections.every(({ origin }) => origin === "availability");
const providerSelectionUserMessage = (options) => {
    switch (options.reason) {
        case "ambiguous":
            return "Multiple analysis providers support this target. Choose one with provider_id, --provider, or REA_ANALYSIS_PROVIDER.";
        case "unknown_provider":
            return `The requested analysis provider is unknown. Choose one of: ${options.candidateIds.join(", ") || "no configured providers"}.`;
        case "provider_unavailable":
            return providerAvailabilityOnly(options.rejections)
                ? "Provider selection failed local readiness checks. No target-support refusal was reported. Review the local provider diagnostics or run `rea doctor`, then retry."
                : "The selected analysis provider is unavailable. Review the reported local diagnostics or run `rea doctor`, then retry.";
        case "target_unsupported":
            return "The selected analysis provider does not support this target. Choose another provider or open a supported extracted binary.";
        case "invalid_options":
            return "The analysis provider selection or open options are invalid. Correct them and try again.";
    }
};
