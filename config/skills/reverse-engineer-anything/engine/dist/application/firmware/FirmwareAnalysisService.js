import { createAnalysisExecutionEvidence } from "../../domain/analysisObservation.js";
import { firmwareRequestSchema, firmwareExecutionBudgetSchema, DEFAULT_FIRMWARE_ANALYSIS_TIMEOUT_MS, } from "../../domain/firmware/firmwareAnalysis.js";
import { AnalysisCancelledError, AnalysisOutputError, } from "../../domain/analysisErrorCore.js";
import { analysisOperationInputErrorFromIssues } from "../../domain/inputIssueProjection.js";
import { err } from "../../domain/result.js";
import { completeProviderEvidence } from "../ProviderOperationExecution.js";
/** Shared CLI/MCP validation and Evidence composition for arbitrary firmware files. */
export class FirmwareAnalysisService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    close() {
        return this.provider.close?.() ?? Promise.resolve();
    }
    /** Execute an explicit inspection or extraction and preserve its producing identity. */
    async execute(operation, input, options) {
        if (options?.signal?.aborted === true)
            return err(new AnalysisCancelledError(operation, { cause: options.signal.reason }));
        const parsed = firmwareRequestSchema.safeParse({ operation, input });
        if (!parsed.success)
            return err(analysisOperationInputErrorFromIssues(operation, parsed.error.issues, input, parsed.error));
        const executed = await this.provider.execute(parsed.data, options);
        if (!executed.ok)
            return executed;
        const execution = executed.value;
        if (execution.subject == null)
            return err(new AnalysisOutputError(operation, "Firmware execution did not bind its source artifact"));
        // Providers own normalized facts. Check only fresh execution metadata here,
        // without reparsing/copying potentially large extraction inventories.
        const budget = firmwareExecutionBudgetSchema.safeParse(execution.result);
        if (!budget.success ||
            budget.data.analysis_timeout_ms !==
                (parsed.data.input.analysis_timeout_ms ??
                    DEFAULT_FIRMWARE_ANALYSIS_TIMEOUT_MS))
            return err(new AnalysisOutputError(operation, "Firmware execution did not retain its selected analysis budget"));
        return completeProviderEvidence(createAnalysisExecutionEvidence(operation, parsed.data.input, execution, "observed"), options?.signal);
    }
}
