import { toolContract } from "../contracts/toolContracts.js";
import { createRetainedSummaryToolHandler } from "./contractToolHandler.js";
import { applicationToolRegistrationOptions } from "./toolRegistrationOptions.js";
/** Register the explicit-file CPython pyc workflow and retain its complete Evidence. */
export const registerPythonPycTool = (server, service, logger, recordEvidence, withAdmittedAnalysis, evidenceById) => {
    const contract = toolContract("inspect_python_pyc");
    const handler = createRetainedSummaryToolHandler(server, contract, (input, options) => service.inspect(input, options), logger, { recordEvidence, evidenceById }, withAdmittedAnalysis);
    server.registerTool(contract.name, applicationToolRegistrationOptions(contract), handler);
};
