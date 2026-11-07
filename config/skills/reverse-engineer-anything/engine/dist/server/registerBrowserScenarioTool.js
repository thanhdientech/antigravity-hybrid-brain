import { optionalProviderUnavailable, } from "../application/OptionalObservationProviders.js";
import { err } from "../domain/result.js";
import { browserScenarioSchema } from "../domain/browserScenario.js";
import { analysisInputErrorFromIssues } from "../domain/inputIssueProjection.js";
import { captureBrowserScenario } from "../application/BrowserScenarioCaptureService.js";
import { toolContract } from "../contracts/toolContracts.js";
import { toolRegistrationOptions } from "./toolRegistrationOptions.js";
import { createRetainedSummaryToolHandler } from "./contractToolHandler.js";
/** Validate one scenario, then share complete/retained delivery with other analyses. */
export const registerBrowserScenarioTool = (server, options) => {
    const contract = toolContract("capture_browser_scenario");
    const handler = createRetainedSummaryToolHandler(server, contract, async (input, execution) => {
        // The SDK admits the advertised structure. The canonical semantic parser
        // owns field-path diagnostics, shared with the CLI rather than flattened
        // into the SDK's pre-handler validation message.
        const scenario = browserScenarioSchema.safeParse(input);
        if (!scenario.success)
            return err(analysisInputErrorFromIssues(contract.name, scenario.error.issues, input, { cause: scenario.error }));
        return options.loadFailure === undefined
            ? captureBrowserScenario(options.provider, scenario.data, execution)
            : err(optionalProviderUnavailable(options.loadFailure, contract.name));
    }, options.logger, {
        recordEvidence: options.recordEvidence,
        evidenceById: options.evidenceById,
    }, options.withAdmittedAnalysis);
    server.registerTool(contract.name, toolRegistrationOptions(contract), handler);
};
