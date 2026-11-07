import { toolContract } from "../contracts/toolContracts.js";
import { createRetainedSummaryToolHandler } from "./contractToolHandler.js";
import { applicationToolRegistrationOptions } from "./toolRegistrationOptions.js";
/** Register the explicit-file BEAM workflow and retain its complete Evidence. */
export const registerErlangTools = (server, service, logger, recordEvidence, withAdmittedAnalysis, evidenceById) => {
    const contract = toolContract("inspect_erlang_beam");
    const handler = createRetainedSummaryToolHandler(server, contract, (input, options) => service.inspect(input, options), logger, { recordEvidence, evidenceById }, withAdmittedAnalysis);
    server.registerTool(contract.name, applicationToolRegistrationOptions(contract), handler);
};
