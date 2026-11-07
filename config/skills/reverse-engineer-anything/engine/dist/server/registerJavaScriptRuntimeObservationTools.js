import { listJavaScriptRuntimeTargets, observeJavaScriptRuntime, } from "../application/javascript/JavaScriptRuntimeObservationService.js";
import { toolContract } from "../contracts/toolContracts.js";
import { toolRegistrationOptions } from "./toolRegistrationOptions.js";
import { runEvidenceToolOperation } from "./contractToolHandler.js";
/** Register passive Inspector tools even when policy keeps them unavailable. */
export const registerJavaScriptRuntimeObservationTools = (server, options) => {
    const registration = { ...options, server };
    const listContract = toolContract("list_javascript_runtime_targets");
    const observeContract = toolContract("observe_javascript_runtime");
    server.registerTool(listContract.name, toolRegistrationOptions(listContract), (input, context) => runEvidenceToolOperation(registration, listContract, options.loadFailure, { input, context }, (parsed, { signal }) => listJavaScriptRuntimeTargets(options.runtime, parsed, { signal })));
    server.registerTool(observeContract.name, toolRegistrationOptions(observeContract), (input, context) => runEvidenceToolOperation(registration, observeContract, options.loadFailure, { input, context }, (parsed, { signal }) => observeJavaScriptRuntime(options.runtime, parsed, { signal })));
};
