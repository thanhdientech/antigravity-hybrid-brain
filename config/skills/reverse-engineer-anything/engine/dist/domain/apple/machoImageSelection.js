import { err, ok } from "../result.js";
import { classifyFatContainerEvidence, readFatContainerHeader, readMachoHeaderPrefixFacts, validateFatSlice, } from "./machoContainer.js";
/** Admit a complete in-memory universal image; FAT-shaped JVM data remains unselected. */
export const readUniversalMachoImage = (bytes) => {
    const fat = readFatContainerHeader(bytes, bytes.byteLength);
    if (fat.state === "not-fat")
        return ok(null);
    if (fat.state !== "parsed")
        return err({
            kind: "malformed",
            message: fat.state === "malformed"
                ? fat.reason
                : "Universal Mach-O header is truncated",
        });
    const identity = classifyFatContainerEvidence(fat, bytes);
    if (identity.state === "malformed")
        return err({ kind: "malformed", message: identity.reason });
    return ok(identity.state === "mach-o" ? fat : null);
};
/** Validate the selected declaration against the complete embedded CPU identity. */
export const readUniversalMachoSlice = (bytes, header, slice) => {
    const image = bytes.subarray(slice.offset, slice.offset + slice.size);
    const identity = readMachoHeaderPrefixFacts(image).identity;
    const message = identity === null
        ? `FAT architecture ${slice.index} has a truncated Mach-O identity`
        : validateFatSlice(slice, bytes.length, header.tableEnd, identity);
    return message === null ? ok(image) : err({ kind: "malformed", message });
};
