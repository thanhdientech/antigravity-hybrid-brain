/** Decode complete UTF-8 JSON without replacing malformed bytes or stripping a BOM. */
export const safeParseUtf8Json = (bytes) => {
    let text;
    try {
        text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
    }
    catch (cause) {
        return {
            ok: false,
            error: cause instanceof Error ? cause.message : String(cause),
            cause,
        };
    }
    return safeParseJson(text);
};
/** Parse JSON text, returning the failure reason instead of throwing. */
export const safeParseJson = (value, reviver) => {
    try {
        return { ok: true, value: JSON.parse(value, reviver) };
    }
    catch (cause) {
        return {
            ok: false,
            error: cause instanceof Error ? cause.message : String(cause),
            cause,
        };
    }
};
