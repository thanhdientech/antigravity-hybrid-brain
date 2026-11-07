import * as t from "@babel/types";
import { childNodes } from "./javascriptSemanticTraversal.js";
// Syntax is immutable across the static and semantic passes. These are source
// expressions, independent of changing binding, mutation or invocation facts.
// Weak keys keep retained results within the lifetime of their parsed AST.
const resultExpressions = new WeakMap();
/** Collect direct result syntax without executing or evaluating a callable. */
export const semanticCallableResultExpressions = (callable) => {
    const cached = resultExpressions.get(callable);
    if (cached !== undefined)
        return cached;
    if (t.isArrowFunctionExpression(callable) &&
        !t.isBlockStatement(callable.body)) {
        const result = [
            {
                node: callable.body,
                site: callable.body,
                kind: "return",
                delegated: false,
            },
        ];
        resultExpressions.set(callable, result);
        return result;
    }
    if (!t.isFunction(callable))
        return [];
    const output = [];
    const pending = childNodes(callable.body).reverse();
    while (pending.length > 0) {
        const node = pending.pop();
        if (node === undefined || t.isFunction(node) || t.isClass(node))
            continue;
        if (t.isReturnStatement(node)) {
            output.push({
                node: node.argument ?? null,
                site: node,
                kind: "return",
                delegated: false,
            });
        }
        if (t.isYieldExpression(node))
            output.push({
                node: node.argument ?? null,
                site: node,
                kind: "yield",
                delegated: node.delegate,
            });
        for (const child of childNodes(node).reverse())
            pending.push(child);
    }
    resultExpressions.set(callable, output);
    return output;
};
/** A callable's direct invocation result differs from its body result syntax. */
export const semanticCallableResultKind = (callable) => {
    if (!t.isFunction(callable))
        return "value";
    if (callable.generator)
        return callable.async ? "async-iterator" : "iterator";
    return callable.async ? "promise" : "value";
};
