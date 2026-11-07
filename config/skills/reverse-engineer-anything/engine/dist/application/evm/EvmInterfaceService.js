import { z } from "zod";
import { AnalysisOutputError } from "../../domain/analysisErrorCore.js";
import { evmInterfaceEvidence } from "../../domain/evm/evmInterfaceEvidence.js";
import { inspectEvmInterfaceInputSchema, evmInterfaceSchema, } from "../../domain/evm/evmInterface.js";
import { err } from "../../domain/result.js";
import { completeProviderEvidence } from "../ProviderOperationExecution.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
const OPERATION = "inspect_evm_interface";
const diagnosticsSchema = z.object({
    diagnostics: evmInterfaceSchema.shape.diagnostics,
});
/** Shared carrier validation and typed inline Evidence for CLI/MCP. */
export class EvmInterfaceService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    close() {
        return this.provider.close?.() ?? Promise.resolve();
    }
    /** Preserve selected byte identity while clearly labeling recovered ABI candidates as inferences. */
    async inspect(rawInput, options) {
        const input = parseAnalysisInput(OPERATION, rawInput, inspectEvmInterfaceInputSchema, options?.signal);
        if (!input.ok)
            return input;
        const inspected = await this.provider.inspect(input.value, options);
        if (!inspected.ok)
            return inspected;
        const diagnostics = diagnosticsSchema.safeParse(inspected.value.result);
        const outputOptions = diagnostics.success
            ? { capturedOutput: diagnostics.data.diagnostics }
            : undefined;
        const execution = inspected.value;
        const report = evmInterfaceSchema.safeParse(execution.result);
        if (!report.success ||
            report.data.artifact.path !== input.value.path ||
            report.data.artifact.encoding !== input.value.encoding ||
            execution.subject?.format !== "file" ||
            execution.subject?.path !== input.value.path ||
            execution.subject.sha256 !== report.data.artifact.sha256)
            return err(new AnalysisOutputError(OPERATION, "Interface adapter returned malformed data or changed the selected carrier identity/encoding.", outputOptions));
        return completeProviderEvidence(evmInterfaceEvidence(input.value, execution), options?.signal, outputOptions?.capturedOutput);
    }
}
