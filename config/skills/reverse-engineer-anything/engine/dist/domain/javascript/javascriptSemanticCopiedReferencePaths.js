import { semanticArrayIndex, } from "./javascriptSemanticPropertyPaths.js";
import { compareUnicodeCodePoints } from "../unicodeCodePointOrder.js";
/** Map copied child selections once; the fresh copy itself keeps its own identity. */
export const semanticCopiedReferencePath = (initializer, path, effect) => {
    const offset = initializer.copyProjectionOffset;
    if (offset === undefined)
        return [...initializer.projection, ...path];
    const copiedPath = [...initializer.projection.slice(offset + 1), ...path];
    if (effect === "identity" && copiedPath.length === 0)
        return null;
    if (effect === "write" && copiedPath.length < 2)
        return null;
    let [key, ...remaining] = copiedPath;
    if (initializer.copyKind === "array-rest") {
        const startIndex = initializer.copyStartIndex ?? 0;
        if (key === undefined || key === null)
            key = { excludedKeys: [], startIndex };
        else if (typeof key === "object")
            key = {
                excludedKeys: key.excludedKeys.flatMap((name) => {
                    const index = semanticArrayIndex(name);
                    return index === null ? [] : [String(index + startIndex)];
                }),
                startIndex: (key.startIndex ?? 0) + startIndex,
            };
        else {
            const index = semanticArrayIndex(key);
            if (index === null)
                return null;
            key = index + startIndex;
        }
    }
    else {
        const excludedKeys = initializer.copyExcludedKeys ?? [];
        if (key === undefined || key === null)
            key = { excludedKeys };
        else if (typeof key === "object")
            key = {
                ...key,
                excludedKeys: [...new Set([...key.excludedKeys, ...excludedKeys])].sort(compareUnicodeCodePoints),
            };
        else if (excludedKeys.includes(String(key)))
            return null;
    }
    return [...initializer.projection.slice(0, offset), key, ...remaining];
};
