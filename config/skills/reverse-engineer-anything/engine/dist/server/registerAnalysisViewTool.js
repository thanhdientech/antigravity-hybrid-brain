import { z } from "zod";
import { analysisViewSourceSchema } from "../domain/analysisView/analysisViewRequest.js";
import { jsonValueSchema } from "../domain/jsonValue.js";
import { inspectAnalysisView } from "../application/analysisView/AnalysisViewService.js";
import { toolContract } from "../contracts/toolContracts.js";
import { runEvidenceToolOperation } from "./contractToolHandler.js";
import { applicationToolRegistrationOptions } from "./toolRegistrationOptions.js";
const viewInputSourceSchema = z.looseObject({
    source: analysisViewSourceSchema,
});
/**
 * The source overflow recovery may name again. An inline record cannot be
 * repeated within the response it just overflowed, so it has none.
 */
const viewSource = (input) => {
    const parsed = viewInputSourceSchema.safeParse(input);
    return parsed.success && parsed.data.source.kind !== "inline"
        ? jsonValueSchema.parse(parsed.data.source)
        : undefined;
};
/** Bind selected-view projection to its named contract and session Evidence owner. */
export const registerAnalysisViewTool = (server, logger, evidenceById, recordEvidence, withAdmittedAnalysis, artifactResources) => {
    const contract = toolContract("inspect_analysis_view");
    const registration = applicationToolRegistrationOptions(contract);
    server.registerTool(contract.name, registration, (input, context) => runEvidenceToolOperation({ server, logger, recordEvidence, withAdmittedAnalysis, viewSource }, contract, undefined, { input, context }, (selected, { signal }) => inspectAnalysisView(selected, evidenceById, {
        signal,
        ...(artifactResources === undefined
            ? {}
            : { resources: artifactResources }),
    })));
};
