import { inspectPacketFieldsInputSchema, packetFieldsCatalogSchema, } from "../../domain/captures/packetFields.js";
import { createAnalysisExecutionEvidence } from "../../domain/analysisObservation.js";
import { AnalysisOutputError } from "../../domain/analysisErrorCore.js";
import { inspectPacketCaptureInputSchema, packetCaptureSchema, } from "../../domain/captures/packetCapture.js";
import { err } from "../../domain/result.js";
import { completeProviderEvidence } from "../ProviderOperationExecution.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
/** One shared validation and Evidence owner for CLI and MCP. */
export class PacketCaptureService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    close() {
        return this.provider.close();
    }
    async inspect(raw, options) {
        const operation = "inspect_packet_capture";
        const input = parseAnalysisInput(operation, raw, inspectPacketCaptureInputSchema, options?.signal);
        if (!input.ok)
            return input;
        const decoded = await this.provider.inspect(input.value, options);
        if (!decoded.ok)
            return decoded;
        const execution = decoded.value;
        const report = packetCaptureSchema.safeParse(execution.result);
        if (!report.success ||
            report.data.artifact.path !== input.value.path ||
            execution.subject?.path !== input.value.path ||
            execution.subject.sha256 !== report.data.artifact.sha256 ||
            JSON.stringify(report.data.selection) !== JSON.stringify(input.value))
            return err(new AnalysisOutputError(operation, "Capture analyzer returned malformed data or changed the selected artifact identity/options."));
        return completeProviderEvidence(createAnalysisExecutionEvidence(operation, input.value, execution, "observed"), options?.signal);
    }
    async inspectFields(raw, options) {
        const operation = "inspect_packet_fields";
        const input = parseAnalysisInput(operation, raw, inspectPacketFieldsInputSchema, options?.signal);
        if (!input.ok)
            return input;
        const decoded = await this.provider.inspectFields(input.value, options);
        if (!decoded.ok)
            return decoded;
        const execution = decoded.value;
        const report = packetFieldsCatalogSchema.safeParse(execution.result);
        if (!report.success ||
            JSON.stringify(report.data.selection) !== JSON.stringify(input.value) ||
            execution.subject?.path !== report.data.tool.path ||
            execution.subject.sha256 !== report.data.tool.sha256)
            return err(new AnalysisOutputError(operation, "Field discovery returned malformed data or changed the selected installation/options."));
        return completeProviderEvidence(createAnalysisExecutionEvidence(operation, input.value, execution, "observed"), options?.signal);
    }
}
