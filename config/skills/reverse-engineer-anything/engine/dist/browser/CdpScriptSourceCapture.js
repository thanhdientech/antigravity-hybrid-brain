import { AnalysisCancelledError } from "../domain/analysisErrorCore.js";
import { requiredScriptSource, sourceExcluded, sourceResult, } from "./CdpCaptureValues.js";
import { CDP_SCRIPT_SOURCE_BYTES_OMISSION_REASON, cdpScriptSourceDeadlineOmissionReason, } from "./CdpScriptSourceBudget.js";
/** One owner for passive page/Electron source admission and artifact creation. */
export const capturePassiveCdpScriptSource = async (input) => {
    const omitForBudget = () => {
        input.completeness.exclude("script_sources", "resource_budget_exhausted");
        return sourceExcluded(input.sourceBudget.timedOut
            ? cdpScriptSourceDeadlineOmissionReason(input.sourceBudget.commandTimeoutMs)
            : CDP_SCRIPT_SOURCE_BYTES_OMISSION_REASON);
    };
    const throwIfCancelled = () => {
        if (input.signal?.aborted === true)
            throw new AnalysisCancelledError(input.operation, {
                cause: input.signal.reason,
            });
    };
    throwIfCancelled();
    if (input.sourceBudget.timedOut)
        return omitForBudget();
    try {
        const response = await input.connection.send("Debugger.getScriptSource", { scriptId: input.scriptId }, input.sessionId, input.sourceBudget.signal);
        throwIfCancelled();
        const text = requiredScriptSource(response, input.operation);
        if (input.sourceBudget.timedOut || !input.sourceBudget.admit(text))
            return omitForBudget();
        return sourceResult(text);
    }
    catch (cause) {
        throwIfCancelled();
        if (input.sourceBudget.timedOut)
            return omitForBudget();
        throw cause;
    }
};
