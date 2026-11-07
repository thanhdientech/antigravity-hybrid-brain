import { ProviderAdapterError } from "./providerAdapterError.js";
/** Provider resources could not be proven closed after bounded cleanup. */
export class ProviderCleanupError extends ProviderAdapterError {
    cleanupIncomplete = true;
    userMessage = "Provider cleanup could not be fully confirmed. Review the reported local resources before opening another target.";
    /** Producer-attested completed output; ordinary partial observations cannot recover success. */
    completedObservation;
    constructor(providerId, resources, diagnostics, 
    /** Identify the operation owning these resources; binary callers retain their default. */
    options) {
        const { operation = "close_binary", completedObservation, ...errorOptions } = options ?? {};
        super(providerId, operation, {
            ...errorOptions,
            diagnostics,
        });
        this.completedObservation = completedObservation;
        this.setCleanupResources(resources);
    }
}
