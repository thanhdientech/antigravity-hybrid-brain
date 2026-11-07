import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { z } from "zod";

//#region dist/contracts/guidedWorkflowSchemas.js
var guidedWorkflowsInputSchema, guidedWorkflowItemSchema, guidedWorkflowsOutputSchema;
function init_guidedWorkflowSchemas() {
	return (init_guidedWorkflowSchemas = __esmMin((() => {
		guidedWorkflowsInputSchema = z.discriminatedUnion("action", [z.strictObject({ action: z.literal("list") }), z.strictObject({
			action: z.literal("render"),
			workflow_id: z.string().min(1).refine((value) => value.trim().length > 0).describe("Exact guided workflow identifier from the list result"),
			arguments: z.record(z.string(), z.string()).optional().describe("Caller-supplied string values for the selected workflow")
		})]);
		guidedWorkflowItemSchema = z.strictObject({
			workflow_id: z.string(),
			description: z.string(),
			arguments: z.array(z.strictObject({
				name: z.string(),
				description: z.string(),
				required: z.boolean()
			}))
		});
		guidedWorkflowsOutputSchema = z.discriminatedUnion("action", [z.strictObject({
			action: z.literal("list"),
			workflows: z.array(guidedWorkflowItemSchema)
		}), z.strictObject({
			action: z.literal("render"),
			workflow_id: z.string(),
			rendered_prompt: z.string()
		})]).meta({ type: "object" });
	})))();
}

//#endregion
export { guidedWorkflowsInputSchema, guidedWorkflowsOutputSchema, init_guidedWorkflowSchemas };