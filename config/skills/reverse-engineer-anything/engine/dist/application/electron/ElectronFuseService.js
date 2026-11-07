import { AnalysisOutputError } from "../../domain/analysisErrorCore.js";
import { electronFuseReportSchema, inspectElectronFusesInputSchema, } from "../../domain/electron/electronFuses.js";
import { createElectronFuseEvidence } from "../../domain/electron/electronFuseEvidence.js";
import { err, ok } from "../../domain/result.js";
import { completeProviderEvidence } from "../ProviderOperationExecution.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
const OPERATION = "inspect_electron_fuses";
/** Shared exact input validation and artifact-bound Evidence for CLI and MCP. */
export class ElectronFuseService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    /** Await and retry the reader's exact retained descriptor owners. */
    async close() {
        await this.provider.close();
    }
    /** Read fuse wires for one explicitly selected path without launching it. */
    async inspect(rawInput, options) {
        const input = parseAnalysisInput(OPERATION, rawInput, inspectElectronFusesInputSchema, options?.signal);
        if (!input.ok)
            return input;
        const inspected = await this.provider.inspect(input.value, options);
        if (!inspected.ok)
            return inspected;
        const report = electronFuseReportSchema.safeParse(inspected.value);
        if (!report.success ||
            report.data.artifact.selected_path !== input.value.path)
            return err(new AnalysisOutputError(OPERATION, "Electron fuse reader returned a malformed report or changed the selected artifact identity."));
        return completeProviderEvidence(createElectronFuseEvidence(input.value, report.data, this.provider.identity), options?.signal);
    }
}
