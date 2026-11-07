import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { HARMONY_APPLICATION_PROVIDER, init_investigationProviders } from "./investigationProviders-Bs5C0Q8b.js";
import { init_harmonyApplication, projectHarmonyInventory } from "./harmonyApplication-B56rmxY-.js";
import { init_InventoryProjectionEvidence, projectInventoryEvidence } from "./InventoryProjectionEvidence-B8fpfmD6.js";

//#region dist/application/harmony/HarmonyApplicationService.js
var OPERATION, projectHarmonyApplicationEvidence;
function init_HarmonyApplicationService() {
	return (init_HarmonyApplicationService = __esmMin((() => {
		init_harmonyApplication();
		init_investigationProviders();
		init_InventoryProjectionEvidence();
		OPERATION = "project_harmony_application_graph";
		projectHarmonyApplicationEvidence = (rawInput, lookup, execution) => {
			return projectInventoryEvidence({
				rawInput,
				...lookup === undefined ? {} : { lookup },
				...execution === undefined ? {} : { execution },
				project: projectHarmonyInventory,
				operation: OPERATION,
				predicateType: "rea.harmony-application-graph",
				provider: HARMONY_APPLICATION_PROVIDER,
				subjectFormat: (first) => first.subject?.format ?? "unknown"
			});
		};
	})))();
}

//#endregion
init_HarmonyApplicationService();
export { projectHarmonyApplicationEvidence };