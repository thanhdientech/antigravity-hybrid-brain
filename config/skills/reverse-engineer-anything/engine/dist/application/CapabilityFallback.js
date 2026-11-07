import { AnalysisCapabilityUnavailableError } from "../domain/analysisErrorCore.js";
/** Unsupported operations permit alternatives only after owned cleanup completes. */
export const permitsCapabilityFallback = (error) => error instanceof AnalysisCapabilityUnavailableError &&
    !error.cleanupIncomplete;
