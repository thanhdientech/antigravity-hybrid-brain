import { observeBrowserUrl, } from "../domain/browserObservation.js";
import { z } from "zod";
import { err, ok } from "../domain/result.js";
import { cdpStringValue, numberValue, recordValue, } from "./CdpCaptureValues.js";
import { cdpResourceColumnSchema } from "../domain/cdpObservationSchemas.js";
const integer = z.int().min(0);
/** Active runtime admission remains stricter than passive request observations. */
export const runtimeRequestSchema = z.object({
    requestId: z.string().min(1),
    frameId: z.string().optional(),
    timestamp: z.number().min(0),
    request: z.object({ url: z.string(), method: z.string() }),
    initiator: z
        .object({
        type: z.string(),
        stack: z.unknown().optional(),
        url: z.string().optional(),
        lineNumber: integer.optional(),
        columnNumber: cdpResourceColumnSchema.optional(),
    })
        .passthrough(),
});
export const readCdpResponseFacts = (reported) => {
    const source = recordValue(reported);
    if (source === undefined)
        return undefined;
    const url = cdpStringValue(source.url);
    return {
        source,
        url: url === undefined ? undefined : observeBrowserUrl(url),
        status: readResponseStatus(source.status),
        mimeType: cdpStringValue(source.mimeType),
        encodedDataLength: numberValue(source.encodedDataLength),
        headers: source.headers,
    };
};
/** Omission is unknown; a supplied non-number is a protocol failure. */
const readResponseStatus = (value) => {
    if (value === undefined)
        return ok(null);
    const status = numberValue(value);
    return status === undefined
        ? err({ _tag: "InvalidCdpResponseStatus" })
        : ok(status);
};
/** Apply caller origin policy to producer-owned URL syntax, without reparsing it. */
export const scopeCdpResponse = (response, allowedOrigins, missingUrlReason = "invalid_protocol_value") => {
    if (response === undefined)
        return { scope: null, reason: "invalid_protocol_value" };
    const url = response.url;
    if (url === undefined || url.source === "")
        return { scope: null, reason: missingUrlReason };
    if (url.kind === "malformed")
        return { scope: null, reason: "invalid_protocol_value" };
    if (url.protocol !== "http:" && url.protocol !== "https:")
        return { scope: "unsupported", reason: "unsupported_url" };
    if (url.sanitized.origin === null ||
        !allowedOrigins.has(url.sanitized.origin))
        return { scope: "outside_policy", reason: "disallowed_origin" };
    return { scope: "approved", url: url.sanitized, response };
};
const requestIdentity = (source) => {
    const id = cdpStringValue(source?.requestId);
    return id === undefined || id === "" ? null : id;
};
/** Borrow raw declarations while parsing each shared field once, before consumer policy. */
export const readCdpRequestWillBeSent = (reported) => {
    const source = recordValue(reported);
    const request = recordValue(source?.request);
    const initiator = recordValue(source?.initiator);
    const response = readCdpResponseFacts(source?.redirectResponse);
    return {
        source,
        requestId: requestIdentity(source),
        frameId: cdpStringValue(source?.frameId),
        loaderId: cdpStringValue(source?.loaderId),
        resourceType: cdpStringValue(source?.type),
        timestamp: numberValue(source?.timestamp),
        request: request === undefined
            ? undefined
            : {
                source: request,
                url: cdpStringValue(request.url),
                method: cdpStringValue(request.method),
            },
        initiator: initiator === undefined
            ? undefined
            : { source: initiator, type: cdpStringValue(initiator.type) },
        redirect: source === undefined || !Object.hasOwn(source, "redirectResponse")
            ? { kind: "missing" }
            : response === undefined
                ? { kind: "malformed" }
                : { kind: "response", response },
    };
};
export const readCdpResponseReceived = (reported) => {
    const source = recordValue(reported);
    return {
        source,
        requestId: requestIdentity(source),
        response: readCdpResponseFacts(source?.response),
    };
};
export const readCdpLoadingFinished = (reported) => {
    const source = recordValue(reported);
    return {
        source,
        requestId: requestIdentity(source),
        timestamp: numberValue(source?.timestamp),
        encodedDataLength: numberValue(source?.encodedDataLength),
    };
};
export const readCdpLoadingFailed = (reported) => {
    const source = recordValue(reported);
    return {
        source,
        requestId: requestIdentity(source),
        timestamp: numberValue(source?.timestamp),
        errorText: source?.errorText,
    };
};
