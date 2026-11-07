import { optionalProviderUnavailable, } from "../application/OptionalObservationProviders.js";
import { mcpProgressReporter } from "./mcpProgress.js";
import { projectRetainedAnalysis, requireAnalysisViewRetention, } from "../application/analysisView/AnalysisViewService.js";
import { err } from "../domain/result.js";
import { analysisInputErrorFromIssues } from "../domain/inputIssueProjection.js";
import { logToolExecution } from "./toolLogging.js";
import { runAdmittedToolOperation } from "./admittedToolOperation.js";
/** Record and deliver one Evidence result using the tool's exact contract. */
export const deliverEvidenceResult = (server, result, contract, recordEvidence, viewSource) => {
    if (!result.ok)
        return server.delivery.toPartialErrorToolResult(result.error, contract.returnsTargetContent, recordEvidence);
    const recorded = recordEvidence?.(result.value);
    return server.delivery.toEvidenceToolResult(result.value, contract, recorded, viewSource);
};
/**
 * Bind one service-backed handler to its exact named contract through the
 * shared log/execute/record/deliver workflow.
 */
export const createContractToolHandler = (server, service, logger, recordEvidence, withAdmittedAnalysis) => (contract) => createEvidenceToolHandler(server, (input, options) => service.execute(contract.name, input, options), logger, recordEvidence, withAdmittedAnalysis)(contract);
/** Validate delivery selection before inspection and retain its complete source for summaries. */
export const createRetainedSummaryToolHandler = (server, contract, inspect, logger, retention, withAdmittedAnalysis) => {
    return createEvidenceToolHandler(server, async (rawInput, options) => {
        const parsed = contract.inputSchema.safeParse(rawInput);
        if (!parsed.success)
            return err(analysisInputErrorFromIssues(contract.name, parsed.error.issues, rawInput, { cause: parsed.error }));
        const { detail, view, ...input } = parsed.data;
        if (detail === "summary") {
            const ready = requireAnalysisViewRetention(contract.name, retention);
            if (!ready.ok)
                return ready;
        }
        const inspected = await inspect(input, options);
        return detail === "summary" && inspected.ok
            ? projectRetainedAnalysis(inspected.value, retention, view ?? { kind: "summary" })
            : inspected;
    }, logger, retention.recordEvidence, withAdmittedAnalysis)(contract);
};
/** Bind a named Evidence-producing operation to shared logging and delivery. */
export const createEvidenceToolHandler = (server, operation, logger, recordEvidence, withAdmittedAnalysis) => (contract) => (input, context) => runEvidenceToolOperation({ server, logger, recordEvidence, withAdmittedAnalysis }, contract, undefined, { input, context }, (selected, { signal }) => operation(selected, { signal }));
/** One owner for optional-provider admission, execution, recording and delivery. */
export const runEvidenceToolOperation = async (options, contract, loadFailure, request, execute) => {
    const { input, context } = request;
    if (loadFailure !== undefined)
        return options.server.delivery.toCallToolResult(err(optionalProviderUnavailable(loadFailure, contract.name)), contract);
    return runAdmittedToolOperation(options.server, options.withAdmittedAnalysis, contract.name, context.mcpReq.signal, async () => {
        const result = await logToolExecution(options.logger, contract.name, () => execute(input, {
            signal: context.mcpReq.signal,
            progress: mcpProgressReporter(context),
        }));
        return deliverEvidenceResult(options.server, result, contract, options.recordEvidence, options.viewSource?.(input));
    });
};
