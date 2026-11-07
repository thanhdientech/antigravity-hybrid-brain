const object = (value) => typeof value === "object" && value !== null && !Array.isArray(value)
    ? value
    : undefined;
/** Read HAR request body declarations once without turning omission or null into absence. */
export const readRecordedRequestBody = (reported) => {
    const request = object(object(reported)?.request);
    if (request === undefined)
        return { kind: "request-unavailable" };
    const size = request.bodySize;
    const bodySize = size === undefined
        ? { kind: "missing" }
        : typeof size === "number" && Number.isFinite(size)
            ? { kind: "number", value: size }
            : { kind: "invalid" };
    const source = request.postData;
    const postData = object(source);
    return {
        kind: "request",
        bodySize,
        postData: postData === undefined
            ? {
                kind: source === undefined
                    ? "missing"
                    : source === null
                        ? "null"
                        : "malformed",
            }
            : {
                kind: "object",
                text: typeof postData.text === "string" ? postData.text : undefined,
                mimeType: typeof postData.mimeType === "string"
                    ? postData.mimeType
                    : undefined,
                params: postData.params === undefined
                    ? { kind: "missing" }
                    : Array.isArray(postData.params)
                        ? { kind: "array", count: postData.params.length }
                        : { kind: "invalid" },
            },
    };
};
