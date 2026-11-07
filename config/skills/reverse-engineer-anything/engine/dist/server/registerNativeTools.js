import { NATIVE_TOOL_CONTRACTS } from "../contracts/native/nativeToolContracts.js";
import { registerEvidenceTools } from "./registerEvidenceTools.js";
/** Register macOS native contracts; Mach-O inspection can deliver a retained summary. */
export const registerNativeTools = (server, options) => {
    registerEvidenceTools(server, NATIVE_TOOL_CONTRACTS, options);
};
