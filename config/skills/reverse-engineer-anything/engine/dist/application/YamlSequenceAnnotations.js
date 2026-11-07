import { isNode } from "yaml";
/** Move unique argument annotations with their value; keep ambiguous comments on the list. */
export const retainYamlSequenceAnnotations = (previous, next, valueOf, retain, ownsComments) => {
    const sourceCounts = new Map();
    const targetCounts = new Map();
    const targets = new Map();
    for (const item of previous.items) {
        const value = valueOf(item);
        if (typeof value === "string")
            sourceCounts.set(value, (sourceCounts.get(value) ?? 0) + 1);
    }
    next.items.forEach((item, index) => {
        const value = valueOf(item);
        if (typeof value !== "string" || !isNode(item))
            return;
        targetCounts.set(value, (targetCounts.get(value) ?? 0) + 1);
        targets.set(value, index);
    });
    const orphaned = [];
    for (const source of previous.items) {
        if (!isNode(source))
            continue;
        const value = valueOf(source);
        const index = typeof value === "string" &&
            sourceCounts.get(value) === 1 &&
            targetCounts.get(value) === 1
            ? targets.get(value)
            : undefined;
        const target = index === undefined ? undefined : next.items[index];
        if (index !== undefined && isNode(target))
            next.items[index] = retain(source, target);
        else if (ownsComments(source)) {
            for (const comment of [source.commentBefore, source.comment])
                if (typeof comment === "string")
                    orphaned.push(comment);
        }
    }
    if (orphaned.length > 0)
        next.commentBefore = [next.commentBefore, ...orphaned]
            .filter((comment) => typeof comment === "string")
            .join("\n");
};
