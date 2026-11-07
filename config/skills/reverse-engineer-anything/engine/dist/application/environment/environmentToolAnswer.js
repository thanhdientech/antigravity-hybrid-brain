import { usesWriteClock } from "../../domain/analysisView/environmentStateWriteRules.js";
import { err } from "../../domain/result.js";
import { replayEnvironmentTool, } from "./environmentReplay.js";
import { answerFromState, refused } from "./environmentStateAnswer.js";
import { answerBulk } from "./environmentStateBulkAnswer.js";
import { answerWrite } from "./environmentStateWriteAnswer.js";
import { pinnedRequest } from "./environmentStateWriteQuery.js";
import { withQueryText } from "./environmentTools.js";
/** The answer a served environment gives: replay without a state store; with one, a served write applies to the live state and a read answers from it. */
export const environmentToolAnswer = (source, store) => store === undefined
    ? (tool, args, observedQuery) => replayEnvironmentTool(source, tool, withQueryText(tool, args), observedQuery)
    : (tool, given, observedQuery) => {
        const args = withQueryText(tool, given);
        const plan = store.state.writes.get(tool.name);
        if (plan?.served !== true)
            return answerFromState({ source, store }, tool, args, observedQuery);
        if (store.state.writeClock === null && usesWriteClock(plan))
            return err(refused(tool, `Tool ${tool.name} requires a known write clock; this state's capture completion timing is unknown. Capture complete timing and derive the state again before calling this tool.`));
        const request = pinnedRequest({ source, store }, {
            tool,
            plan,
            args,
            ...(observedQuery === undefined ? {} : { observedQuery }),
        });
        if (!request.ok)
            return request;
        const bulk = plan.address !== undefined && plan.address.by !== "action";
        return (bulk ? answerBulk : answerWrite)({ source, store }, request.value);
    };
