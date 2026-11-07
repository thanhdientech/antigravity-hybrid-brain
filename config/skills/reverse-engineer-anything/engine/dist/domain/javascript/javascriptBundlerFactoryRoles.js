import * as t from "@babel/types";
import { runtimeFunctionParameters, semanticStaticPropertyKey, } from "./javascriptAstValues.js";
/** Positional factory roles of a recognized bundler runtime. */
const roleOrder = (runtime) => runtime === "esbuild-commonjs"
    ? ["exports", "module"]
    : runtime.startsWith("esbuild-")
        ? []
        : ["module", "exports", "loader"];
/** Bind a factory's role parameters by position, never by spelling. */
export const javascriptBundlerFactoryRoles = (factory, runtime) => {
    const parameters = runtimeFunctionParameters(factory);
    const roles = { module: undefined, exports: [], loader: undefined };
    const unusedDefaults = new Set();
    let exact = true;
    const bindingIdentifier = (node) => {
        if (t.isIdentifier(node))
            return node;
        if (t.isAssignmentPattern(node) && t.isIdentifier(node.left)) {
            unusedDefaults.add(node.right);
            return node.left;
        }
        return undefined;
    };
    for (const [index, role] of roleOrder(runtime).entries()) {
        const parameter = parameters[index];
        if (parameter === undefined)
            break;
        // A rest element collects this and every later argument into an array.
        if (t.isRestElement(parameter)) {
            exact = false;
            break;
        }
        // The convention always supplies every role argument, so a role
        // parameter's default is dead code whatever its binding pattern.
        const pattern = t.isAssignmentPattern(parameter)
            ? parameter.left
            : parameter;
        if (t.isAssignmentPattern(parameter))
            unusedDefaults.add(parameter.right);
        // Loader consumers resolve its calls through the binding's own value
        // facts, which cannot yet discount a default the convention never runs.
        if (t.isIdentifier(pattern) &&
            (role !== "loader" || pattern === parameter)) {
            // A repeated simple parameter name binds its last argument.
            if (boundLater(parameters, index, pattern.name))
                continue;
            if (role === "exports")
                roles.exports.push(pattern);
            else
                roles[role] = pattern;
            continue;
        }
        if (role === "module" && t.isObjectPattern(pattern)) {
            if (!moduleExportsAliases(pattern, bindingIdentifier, roles.exports))
                exact = false;
            continue;
        }
        exact = false;
    }
    return { ...roles, unusedDefaults, exact };
};
/** `{exports: alias}` binds `module.exports`; other static keys cannot reach it. */
const moduleExportsAliases = (pattern, bindingIdentifier, output) => {
    for (const property of pattern.properties) {
        // A shallow rest copy keeps the `exports` property's object.
        if (t.isRestElement(property))
            return false;
        const key = semanticStaticPropertyKey(property.key, property.computed);
        if (key === null)
            return false;
        if (key !== "exports")
            continue;
        const alias = bindingIdentifier(property.value);
        if (alias === undefined)
            return false;
        output.push(alias);
    }
    return true;
};
const boundLater = (parameters, index, name) => parameters
    .slice(index + 1)
    .some((parameter) => Object.hasOwn(t.getBindingIdentifiers(parameter), name));
/**
 * A role parameter's binding facts at entry. A default the convention never
 * runs is not a possible value, so write ordering must not see it either.
 */
export const withoutUnusedFactoryDefaults = (binding, roles) => {
    const unused = ({ node, assignment, }) => assignment !== true && roles.unusedDefaults.has(node);
    return binding.referenceInitializers.some(unused)
        ? {
            ...binding,
            referenceInitializers: binding.referenceInitializers.filter((initializer) => !unused(initializer)),
        }
        : binding;
};
