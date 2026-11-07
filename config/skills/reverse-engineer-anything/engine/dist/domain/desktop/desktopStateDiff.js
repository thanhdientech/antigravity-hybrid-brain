import { compareUnicodeCodePoints } from "../unicodeCodePointOrder.js";
/** Directories only appear or disappear; their own size and time track their entries. */
const sameContentIdentity = (before, after) => before.type === "directory" ||
    (before.size === after.size &&
        before.mtime_ns === after.mtime_ns &&
        before.inode === after.inode &&
        before.mode === after.mode);
const parentOf = (path) => path.slice(0, Math.max(1, path.lastIndexOf("/")));
/**
 * Whether the walk established this path's presence or absence: it is a
 * checked root, or its nearest ancestor present in the walk was either fully
 * listed or not a directory, which nothing can be inside.
 */
const covers = (walk, path) => {
    if (walk.roots.has(path))
        return true;
    for (let directory = parentOf(path);; directory = parentOf(directory)) {
        const ancestor = walk.entries.get(directory);
        if (ancestor !== undefined)
            return ancestor.type !== "directory" || walk.listed.has(directory);
        if (walk.roots.has(directory))
            return true;
        if (directory === "/")
            return false;
    }
};
/**
 * Compare two walks of the same roots, in code-point order of path. A path
 * counts as created or deleted only where both walks checked its parent; the
 * rest are counted as unconfirmed rather than reported.
 */
export const diffDesktopStates = (before, after) => {
    const differences = [];
    let unconfirmed = 0;
    for (const [path, previous] of before.entries) {
        const next = after.entries.get(path);
        if (next === undefined) {
            if (covers(after, path))
                differences.push({
                    path,
                    kind: "deleted",
                    before: previous,
                    after: null,
                });
            else
                unconfirmed += 1;
        }
        else if (next.type !== previous.type)
            differences.push({
                path,
                kind: "type_changed",
                before: previous,
                after: next,
            });
        else if (!sameContentIdentity(previous, next))
            differences.push({
                path,
                kind: "modified",
                before: previous,
                after: next,
            });
    }
    for (const [path, next] of after.entries)
        if (!before.entries.has(path)) {
            if (covers(before, path))
                differences.push({ path, kind: "created", before: null, after: next });
            else
                unconfirmed += 1;
        }
    return {
        differences: differences.sort((left, right) => compareUnicodeCodePoints(left.path, right.path)),
        unconfirmed,
    };
};
/** Whether a path is one of the roots or lies beneath one. */
export const isWithinAny = (path, roots) => roots.some((root) => path === root || path.startsWith(root.endsWith("/") ? root : `${root}/`));
