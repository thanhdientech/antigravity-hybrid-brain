import { z } from "zod";
import { jsonValueSchema } from "../domain/jsonValue.js";
/** Borrow the dictionary shape; selected payloads receive JSON validation in the adapter. */
const structuredContentSchema = z.custom((value) => {
    if (typeof value !== "object" || value === null || Array.isArray(value))
        return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
});
/** IDA/JEB's object-structured envelope; each adapter owns selection and error policy. */
export const mcpToolResultSchema = z.object({
    isError: z.boolean().optional(),
    structuredContent: structuredContentSchema.optional(),
    content: z.array(z.object({ type: z.string(), text: z.string().optional() }).passthrough()),
});
export const mcpTextBlocks = (content) => content.flatMap((block) => block.type === "text" && block.text !== undefined ? [block.text] : []);
/** Preserve ordinary text when the selected upstream payload is not valid JSON. */
export const parseMcpJsonOrText = (text) => {
    let value;
    try {
        value = JSON.parse(text);
    }
    catch {
        return text;
    }
    // A parsed JSON value must satisfy the same admission rules as structured
    // evidence. Validation failures cannot change its meaning into ordinary text.
    return jsonValueSchema.parse(value);
};
