import { toolContract } from "../contracts/toolContracts.js";
import { createRetainedSummaryToolHandler } from "./contractToolHandler.js";
import { applicationToolRegistrationOptions } from "./toolRegistrationOptions.js";
/** Bind the named contract and refuse unretained summary delivery before I/O. */
export const registerDesktopApplicationTool = (server, service, logger, recordEvidence, withAdmittedAnalysis, evidenceById) => {
    const contract = toolContract("inspect_desktop_application");
    const handler = createRetainedSummaryToolHandler(server, contract, (input, options) => service.inspect(input, options), logger, { recordEvidence, evidenceById }, withAdmittedAnalysis);
    server.registerTool(contract.name, applicationToolRegistrationOptions(contract), handler);
};
