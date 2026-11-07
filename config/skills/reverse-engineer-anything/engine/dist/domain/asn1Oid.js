import { err, ok } from "./result.js";
/** Decode OBJECT IDENTIFIER content without narrowing arbitrary-size base-128 arcs. */
export const decodeAsn1Oid = (content, limits) => {
    if (content.length === 0)
        return err({ kind: "empty" });
    if (content.length > limits.bytes)
        return err({ kind: "byte-limit", limit: limits.bytes });
    const arcs = [];
    let value = 0n;
    let arcBytes = 0;
    for (const byte of content) {
        arcBytes += 1;
        if (arcBytes > limits.arcBytes)
            return err({ kind: "arc-limit", limit: limits.arcBytes });
        // X.690 8.19.2 requires minimal base-128 subidentifiers even in BER.
        if (arcBytes === 1 && byte === 0x80)
            return err({ kind: "non-minimal" });
        value = (value << 7n) | BigInt(byte & 0x7f);
        if ((byte & 0x80) !== 0)
            continue;
        if (arcs.length === 0) {
            const first = value < 80n ? value / 40n : 2n;
            arcs.push(first, value - first * 40n);
        }
        else
            arcs.push(value);
        value = 0n;
        arcBytes = 0;
    }
    return arcBytes === 0 ? ok(arcs.join(".")) : err({ kind: "truncated" });
};
