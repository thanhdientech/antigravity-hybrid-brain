import { toolContract } from "../contracts/toolContracts.js";
import { createRetainedSummaryToolHandler } from "./contractToolHandler.js";
import { toolRegistrationOptions } from "./toolRegistrationOptions.js";
/** Reject an unretained byte-entropy summary before reading the selected file. */
export const registerByteEntropyTool = (server, entropyService, logger, recordEvidence, evidenceById, withAdmittedAnalysis) => {
    const contract = toolContract("inspect_byte_entropy");
    server.registerTool(contract.name, toolRegistrationOptions(contract), createRetainedSummaryToolHandler(server, contract, (input, options) => entropyService.inspect(input, options), logger, { recordEvidence, evidenceById }, withAdmittedAnalysis));
};
