import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisInputError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { analysisInputErrorFromIssues, init_inputIssueProjection, projectInputIssues } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { guidedWorkflowsInputSchema, init_guidedWorkflowSchemas } from "./guidedWorkflowSchemas-vLmfHf7h.js";
import { PROMPT_CONTRACTS, guidedPromptArgumentsSchema, guidedPromptInventory, init_promptContracts, renderGuidedPrompt } from "./promptContracts-B6NUf7d5.js";

//#region dist/application/GuidedWorkflowAccess.js
var GUIDED_WORKFLOWS_OPERATION, accessGuidedWorkflows, invalidInput;
function init_GuidedWorkflowAccess() {
	return (init_GuidedWorkflowAccess = __esmMin((() => {
		init_promptContracts();
		init_analysisErrorCore();
		init_inputIssueProjection();
		init_result();
		init_guidedWorkflowSchemas();
		GUIDED_WORKFLOWS_OPERATION = "guided_workflows";
		accessGuidedWorkflows = (input, contracts = PROMPT_CONTRACTS) => {
			const parsed = guidedWorkflowsInputSchema.safeParse(input);
			if (!parsed.success) return err(analysisInputErrorFromIssues(GUIDED_WORKFLOWS_OPERATION, parsed.error.issues, input));
			if (parsed.data.action === "list") return ok({
				action: "list",
				workflows: guidedPromptInventory(contracts)
			});
			const id = parsed.data.workflow_id;
			const contract = contracts.find(({ name }) => name === id);
			if (contract === undefined) return invalidInput(PROMPT_CONTRACTS.some(({ name }) => name === id) ? `Workflow '${id}' is not available in the selected tool-family scope. Use action=list to see the available identifiers.` : `Unknown workflow_id '${id}'. Use action=list to see the available identifiers.`, [{
				path: ["workflow_id"],
				reason: "invalid_value"
			}]);
			const arguments_ = parsed.data.arguments ?? {};
			const validated = guidedPromptArgumentsSchema(contract).safeParse(arguments_);
			if (!validated.success) {
				const issues = projectInputIssues(validated.error.issues.map((issue) => ({
					...issue,
					path: ["arguments", ...issue.path]
				})), input);
				const missing = issues.filter(({ reason }) => reason === "missing_argument").map(({ path }) => String(path.at(-1)));
				return invalidInput(missing.length === 0 ? "Correct the named guided workflow arguments and retry." : `Missing required arguments for ${id}: ${missing.join(", ")}.`, issues);
			}
			return ok({
				action: "render",
				workflow_id: id,
				rendered_prompt: renderGuidedPrompt(contract, Object.fromEntries(Object.entries(validated.data).filter((entry) => typeof entry[1] === "string")))
			});
		};
		invalidInput = (userMessage, additionalIssues) => err(new AnalysisInputError(GUIDED_WORKFLOWS_OPERATION, { userMessage }, additionalIssues));
	})))();
}

//#endregion
init_GuidedWorkflowAccess();
export { accessGuidedWorkflows };