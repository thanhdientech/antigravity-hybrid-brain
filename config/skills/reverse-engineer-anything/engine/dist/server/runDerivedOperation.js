import { setImmediate } from "node:timers/promises";
import { AnalysisError } from "../domain/analysisErrorBase.js";
import { AnalysisCancelledError } from "../domain/analysisErrorCore.js";
import { err, ok } from "../domain/result.js";
import { mcpProgressReporter } from "./mcpProgress.js";
import { withEvidenceSources, } from "../application/investigation/recordEvidenceSources.js";
/** Run synchronous derived work with transport yields and a publication guard. */
export const runDerivedOperation = async (context, operation, compute, retainCompleted) => {
    const progress = mcpProgressReporter(context);
    await progress.report({
        phase: "prepare",
        completed: 0,
        total: 2,
        message: `Preparing ${operation}`,
    });
    await setImmediate();
    if (context.mcpReq.signal.aborted)
        return err(new AnalysisCancelledError(operation, {
            cause: context.mcpReq.signal.reason,
        }));
    let value;
    try {
        value = compute();
    }
    catch (cause) {
        // Typed causes already name the failed constraint; keep their issues.
        if (cause instanceof AnalysisError)
            return err(cause);
        throw cause;
    }
    const cancelledCompletion = () => {
        const completed = retainCompleted?.(value);
        return withEvidenceSources(err(new AnalysisCancelledError(operation, {
            cause: context.mcpReq.signal.reason,
            ...(completed === undefined
                ? {}
                : { partialObservation: completed.evidence }),
        })), completed?.sources ?? []);
    };
    await progress.report({
        phase: "compute",
        completed: 1,
        total: 2,
        message: `Computed ${operation}`,
    });
    await setImmediate();
    if (context.mcpReq.signal.aborted)
        return cancelledCompletion();
    await progress.report({
        phase: "complete",
        completed: 2,
        total: 2,
        message: `Completed ${operation}`,
        terminal: true,
    });
    if (context.mcpReq.signal.aborted)
        return cancelledCompletion();
    return ok(value);
};
