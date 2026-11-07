import { AnalysisOutputError } from "../../domain/analysisErrorCore.js";
import { createEvidence } from "../../domain/evidence.js";
import { inspectBinaryLayoutInputSchema, binaryLayoutSchema, } from "../../domain/native/binaryLayout.js";
import { err } from "../../domain/result.js";
import { completeProviderEvidence } from "../ProviderOperationExecution.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
const OPERATION = "inspect_binary_layout";
const EVIDENCE_ARCHITECTURES = {
    EM_X86_64: "x86_64",
    EM_AARCH64: "arm64",
    EM_386: "x86",
    EM_ARM: "arm",
    EM_MIPS: "mips",
};
/** Shared CLI/MCP validation and Evidence composition for offline layout inspection. */
export class BinaryLayoutService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    close() {
        return this.provider.close?.() ?? Promise.resolve();
    }
    /** Bind complete observations to the caller-selected artifact before creating Evidence. */
    async inspect(rawInput, options) {
        return this.#inspect(rawInput, options, (input) => this.provider.inspect(input, options));
    }
    /** Complete the owned one-shot lifecycle before validating and publishing Evidence. */
    inspectAndClose(rawInput, options) {
        return this.#inspect(rawInput, options, (input) => this.provider.inspectAndClose(input, options));
    }
    async #inspect(rawInput, options, inspect) {
        const input = parseAnalysisInput(OPERATION, rawInput, inspectBinaryLayoutInputSchema, options?.signal);
        if (!input.ok)
            return input;
        const inspected = await inspect(input.value);
        if (!inspected.ok)
            return inspected;
        const diagnostics = binaryLayoutSchema.shape.diagnostics.safeParse(inspected.value.diagnostics);
        const outputOptions = diagnostics.success
            ? { capturedOutput: diagnostics.data }
            : undefined;
        const report = binaryLayoutSchema.safeParse(inspected.value);
        if (!report.success || report.data.artifact.path !== input.value.path)
            return err(new AnalysisOutputError(OPERATION, "Binary layout provider returned malformed evidence or changed the selected artifact identity.", outputOptions));
        const value = report.data;
        return completeProviderEvidence(createEvidence({
            path: value.artifact.path,
            format: "elf",
            architecture: EVIDENCE_ARCHITECTURES[value.architecture.machine],
            sha256: value.artifact.sha256,
        }, this.provider.identity, {
            operation: OPERATION,
            parameters: {
                path: input.value.path,
                ...(input.value.pwntools_timeout_ms === undefined
                    ? {}
                    : { pwntools_timeout_ms: input.value.pwntools_timeout_ms }),
            },
            result: value,
            // The decoded report is the only representation; do not repeat it.
            rawResult: null,
            confidence: "observed",
            limitations: value.limitations,
            locations: [{ kind: "artifact-path", path: value.artifact.path }],
        }), options?.signal, outputOptions?.capturedOutput);
    }
}
