import { Client, } from "@modelcontextprotocol/client";
const isSchema = (value) => typeof value === "object" && value !== null && "~standard" in value;
/** Preserve observed structured dictionaries across the SDK's era-specific result validation. */
export class StructuredContentMcpClient extends Client {
    #toolResult = {
        "~standard": {
            version: 1,
            vendor: "rea-mcp-structured-content",
            validate: (input) => {
                const parsed = this._wireCodec().validateResult("tools/call", input);
                if (!parsed.ok)
                    return {
                        issues: [
                            {
                                message: parsed.reason === "invalid"
                                    ? parsed.message
                                    : "not-in-era: tools/call",
                            },
                        ],
                    };
                // Retain the SDK's envelope normalization, replacing only the dictionary
                // its legacy record parser may clone without own __proto__ members.
                if (typeof input === "object" &&
                    input !== null &&
                    Object.hasOwn(input, "structuredContent"))
                    return {
                        value: {
                            ...parsed.value,
                            structuredContent: input
                                .structuredContent,
                        },
                    };
                return { value: parsed.value };
            },
        },
    };
    request(request, schemaOrOptions, options) {
        if (isSchema(schemaOrOptions))
            return super.request(request, schemaOrOptions, options);
        if (request.method === "tools/call")
            return super.request(request, this.#toolResult, schemaOrOptions);
        return super.request(request, schemaOrOptions);
    }
}
