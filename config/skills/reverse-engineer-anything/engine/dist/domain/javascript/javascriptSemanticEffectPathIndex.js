import { semanticAliasSelectionChoices, } from "./javascriptSemanticAliasSelections.js";
import { semanticPropertyPathKeyMatches, } from "./javascriptSemanticPropertyPaths.js";
/** Whether an effect recorded at one member path can reach a projected read. */
export const semanticEffectPathMatches = (effectPath, path) => path.length > 0 &&
    effectPath.length <= path.length &&
    effectPath.every((key, index) => {
        const selected = path[index];
        return (selected !== undefined &&
            semanticAliasSelectionChoices(selected).some((choice) => choice === null ||
                typeof choice === "object" ||
                semanticPropertyPathKeyMatches(key, String(choice))));
    });
// Binding member effects are append-only, so each index extends itself with
// records appended since its previous query and lives as long as its records.
const effectPathIndexes = new WeakMap();
const currentEffectPathIndex = (effects) => {
    let index = effectPathIndexes.get(effects);
    if (index === undefined) {
        index = { root: {}, indexed: 0 };
        effectPathIndexes.set(effects, index);
    }
    for (; index.indexed < effects.length; index.indexed++) {
        let node = index.root;
        for (const key of effects[index.indexed].path) {
            if (key === null || typeof key === "object")
                node = node.open ??= {};
            else {
                const exact = (node.exact ??= new Map());
                const name = String(key);
                let child = exact.get(name);
                if (child === undefined) {
                    child = {};
                    exact.set(name, child);
                }
                node = child;
            }
        }
        (node.ends ??= []).push(index.indexed);
    }
    return index;
};
// Visit record positions whose recorded path may match a projected read, in
// index order. Only records longer than the read, or with an exact key that no
// selected choice names, are skipped; wildcard and copied-slot keys remain.
// Returns true as soon as `visit` does.
const visitEffectPathCandidates = (effects, path, visit) => {
    const pending = [{ node: currentEffectPathIndex(effects).root, depth: 0 }];
    while (pending.length > 0) {
        const { node, depth } = pending.pop();
        for (const position of node.ends ?? [])
            if (visit(position))
                return true;
        if (depth >= path.length)
            continue;
        if (node.open !== undefined)
            pending.push({ node: node.open, depth: depth + 1 });
        const exact = node.exact;
        if (exact === undefined)
            continue;
        const choices = semanticAliasSelectionChoices(path[depth]);
        if (choices.some((choice) => choice === null || typeof choice === "object"))
            for (const child of exact.values())
                pending.push({ node: child, depth: depth + 1 });
        else
            for (const name of new Set(choices.map((choice) => String(choice)))) {
                const child = exact.get(name);
                if (child !== undefined)
                    pending.push({ node: child, depth: depth + 1 });
            }
    }
    return false;
};
/**
 * Effects whose recorded path may match a projected read, in record order.
 * Candidates are a superset, so callers still apply `semanticEffectPathMatches`.
 */
export const semanticEffectPathCandidates = (effects, path) => {
    const positions = [];
    visitEffectPathCandidates(effects, path, (position) => {
        positions.push(position);
        return false;
    });
    return positions
        .sort((left, right) => left - right)
        .map((position) => effects[position]);
};
/** Whether any candidate effect for a projected read satisfies `predicate`. */
export const semanticSomeEffectPathCandidate = (effects, path, predicate) => visitEffectPathCandidates(effects, path, (position) => predicate(effects[position]));
