import { OFFICIAL_TOOL_CONTRACTS } from "../contracts/officialToolContracts.js";
import { registerEvidenceTools } from "./registerEvidenceTools.js";
/** Direct tools share Evidence recording/projection with the other provider-backed tools. */
export const registerOfficialTools = (server, options) => {
    registerEvidenceTools(server, OFFICIAL_TOOL_CONTRACTS, options);
};
