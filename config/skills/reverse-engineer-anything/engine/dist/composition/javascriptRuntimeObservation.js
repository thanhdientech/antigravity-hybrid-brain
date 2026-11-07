import { runtimeAsarHeaderAdmission } from "../config/runtimeAnalysisSettings.js";
import { V8InspectorAdmission, V8InspectorProvider, } from "../inspector/V8InspectorProvider.js";
export { V8InspectorAdmission };
/** Construct a fresh provider without opening a target or acquiring an engine. */
export const createJavaScriptRuntimeObservationProvider = (environment, settings, admission) => new V8InspectorProvider(runtimeAsarHeaderAdmission(environment, settings), admission);
