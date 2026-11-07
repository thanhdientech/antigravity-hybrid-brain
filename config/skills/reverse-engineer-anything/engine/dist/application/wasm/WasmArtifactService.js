import { createAnalysisExecutionEvidence } from "../../domain/analysisObservation.js";
import { AnalysisOutputError } from "../../domain/analysisErrorCore.js";
import { inspectWasmArtifactInputSchema, wasmArtifactSchema, wasmArtifactMatchesSubject, DEFAULT_WASM_COMMAND_TIMEOUT_MS, } from "../../domain/wasm/wasmArtifact.js";
import { err } from "../../domain/result.js";
import { completeProviderEvidence } from "../ProviderOperationExecution.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
const OPERATION = "inspect_wasm_artifact";
/** Shared artifact validation and typed inline Evidence for CLI/MCP. */
export class WasmArtifactService {
    provider;
    settings;
    constructor(provider, settings) {
        this.provider = provider;
        this.settings = settings;
    }
    /** Join provider cleanup during shutdown or an explicit retry. */
    close() {
        return this.provider.close();
    }
    /** Preserve exact selected artifact identity and validated upstream observations. */
    async inspect(rawInput, options) {
        const input = parseAnalysisInput(OPERATION, rawInput, inspectWasmArtifactInputSchema, options?.signal);
        if (!input.ok)
            return input;
        const timeout = input.value.command_timeout_ms ??
            this.settings?.().overrides["wasm.command_timeout_ms"] ??
            DEFAULT_WASM_COMMAND_TIMEOUT_MS;
        const inspected = await this.provider.inspect(input.value, {
            ...options,
            commandTimeoutMs: timeout,
        });
        if (!inspected.ok)
            return inspected;
        const execution = inspected.value;
        const report = wasmArtifactSchema.safeParse(execution.result);
        if (!report.success ||
            report.data.artifact.path !== input.value.path ||
            execution.subject.path !== input.value.path ||
            report.data.tool_profile.timeout_ms !== timeout ||
            !wasmArtifactMatchesSubject(report.data.artifact, execution.subject) ||
            JSON.stringify(report.data.glue.map((item) => item.artifact.path)) !==
                JSON.stringify(input.value.glue_paths) ||
            JSON.stringify(report.data.candidates.map((item) => item.path)) !==
                JSON.stringify([
                    ...new Set([input.value.path, ...input.value.candidate_paths]),
                ]))
            return err(new AnalysisOutputError(OPERATION, "WABT adapter returned malformed data or changed the selected artifact identity."));
        return completeProviderEvidence(createAnalysisExecutionEvidence(OPERATION, input.value, { ...execution, result: report.data }, "observed"), options?.signal);
    }
}
