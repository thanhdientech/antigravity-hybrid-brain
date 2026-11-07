import { AnalysisOutputError } from "../../domain/analysisErrorCore.js";
import { createEvidence } from "../../domain/evidence.js";
import { inspectNativeExportsInputSchema, nativeExportsSchema, } from "../../domain/native/nativeExports.js";
import { err } from "../../domain/result.js";
import { completeProviderEvidence } from "../ProviderOperationExecution.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
const OPERATION = "inspect_native_exports";
/** Shared caller validation, output parsing and Evidence provenance for CLI/MCP. */
export class NativeExportsService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    close() {
        return this.provider.close?.() ?? Promise.resolve();
    }
    /** Read one explicitly selected PE or ELF image's export table. */
    async inspect(rawInput, options) {
        const input = parseAnalysisInput(OPERATION, rawInput, inspectNativeExportsInputSchema, options?.signal);
        if (!input.ok)
            return input;
        const result = await this.provider.inspect(input.value, options);
        if (!result.ok)
            return result;
        const report = nativeExportsSchema.safeParse(result.value);
        if (!report.success ||
            report.data.artifact.path !== input.value.path ||
            report.data.artifact.bytes > input.value.max_file_bytes)
            return err(new AnalysisOutputError(OPERATION, "Native export reader returned malformed output or changed artifact identity."));
        const value = report.data;
        return completeProviderEvidence(createEvidence({
            path: value.artifact.path,
            format: value.format,
            sha256: value.artifact.sha256,
        }, this.provider.identity, {
            operation: OPERATION,
            parameters: input.value,
            result: value,
            confidence: "observed",
            limitations: value.limitations,
            locations: [{ kind: "artifact-path", path: value.artifact.path }],
        }), options?.signal);
    }
}
