import { KunaDocumentError } from "./KunaDocumentError.js";
/** Read a numeric u64 address from its exact JSON token, before rounding. */
export const kunaAddressFromJsonNumber = (source, key) => {
    if (source === undefined ||
        source.length > 20 ||
        !/^(?:0|[1-9][0-9]*)$/u.test(source))
        throw new KunaDocumentError("invalid_address", { field: key });
    const exact = BigInt(source);
    if (exact > 0xffffffffffffffffn)
        throw new KunaDocumentError("address_exceeds_u64", { field: key });
    return `0x${exact.toString(16)}`;
};
/** Parse numeric u64 addresses from their exact JSON tokens, before rounding. */
export const parseKunaJson = (text, limit, addressKeys) => {
    if (Buffer.byteLength(text) > limit)
        throw new KunaDocumentError("buffered_capacity");
    return JSON.parse(text, (key, value, context) => {
        if (!addressKeys.has(key) || value === null)
            return value;
        if (typeof value !== "number")
            throw new KunaDocumentError("invalid_address", { field: key });
        return kunaAddressFromJsonNumber(context?.source, key);
    });
};
