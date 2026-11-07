import { completable } from "@modelcontextprotocol/server";
import { z } from "zod";
import { guidedPromptArgumentSchema } from "../contracts/promptContracts.js";
export const promptArgumentsSchema = (contract, completion) => {
    const shape = {};
    for (const [name, argument] of Object.entries(contract.arguments))
        shape[name] = argumentSchema(argument, completion);
    return z.strictObject(shape);
};
const argumentSchema = (argument, completion) => {
    const value = guidedPromptArgumentSchema({
        ...argument,
        required: true,
    }).nonoptional();
    const kind = argument.completion;
    const completed = kind === undefined
        ? value
        : completable(value, async (partial, context) => [
            ...(await completion.complete(kind, partial, context)),
        ]);
    return argument.required ? completed : completed.optional();
};
