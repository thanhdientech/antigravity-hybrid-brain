import { AnalysisInputError, } from "./analysisErrorCore.js";
/** Build the standard application input error while retaining schema causes and extra semantic issues. */
export const analysisInputErrorFromIssues = (operation, issues, input, options = {}) => new AnalysisInputError(operation, {
    ...(options.cause === undefined ? {} : { cause: options.cause }),
    ...(options.userMessage === undefined
        ? {}
        : { userMessage: options.userMessage }),
}, [...projectInputIssues(issues, input), ...(options.additionalIssues ?? [])]);
/** Remove only the internal operation/input envelope from caller correction paths. */
export const analysisOperationInputErrorFromIssues = (operation, issues, input, cause) => new AnalysisInputError(operation, { cause }, projectInputIssues(issues, { operation, input }).map((issue) => issue.path[0] === "input"
    ? { ...issue, path: issue.path.slice(1) }
    : issue));
/** Project Zod failures to secret-safe caller correction metadata. */
export const projectInputIssues = (issues, input) => issues.flatMap((issue) => projectIssue(issue, input));
const projectionBudgetExceeded = Symbol("input issue projection budget exceeded");
/** Bound representation expansion before constructing projected diagnostics. */
export const projectInputIssuesWithinBudget = (issues, input, budgetBytes) => {
    return projectInputIssueGroupsWithinBudget(issues, input, budgetBytes)?.flat();
};
/** Retain each projected issue's source through bounded SDK normalization. */
export const projectInputIssueGroupsWithinBudget = (issues, input, budgetBytes) => {
    const budget = { remaining: budgetBytes };
    try {
        const groups = [];
        for (const issue of issues)
            groups.push(projectIssue(issue, input, budget));
        return groups;
    }
    catch (error) {
        if (error === projectionBudgetExceeded)
            return undefined;
        throw error;
    }
};
const chargeProjection = (issue, budget) => {
    // Six bytes per UTF-16 code unit covers JSON escaping. The fixed allowance
    // covers the projected object, property names, scalar values and delimiters.
    const charge = (amount) => {
        budget.remaining -= amount;
        if (budget.remaining < 0)
            throw projectionBudgetExceeded;
    };
    charge(256);
    let pathCost = 0;
    for (const part of issue.path) {
        const cost = typeof part === "string" ? 6 * part.length + 16 : 32;
        pathCost += cost;
        charge(cost);
    }
    charge(6 * issue.message.length);
    if (issue.code === "invalid_union") {
        for (const branch of issue.errors)
            charge(32 + 32 * branch.length);
        if ("options" in issue && Array.isArray(issue.options))
            for (const value of issue.options)
                charge(typeof value === "string" ? 6 * value.length + 32 : 32);
    }
    if (issue.code === "invalid_key")
        charge(32 * issue.issues.length);
    if (issue.code === "unrecognized_keys")
        for (const key of issue.keys)
            charge(256 + pathCost + 6 * key.length);
    if (issue.code === "invalid_value")
        for (const value of issue.values)
            charge(typeof value === "string" ? 6 * value.length + 32 : 32);
};
const nestedIssue = (parent, child, budget) => {
    if (budget !== undefined) {
        // The combined path is allocated before the child is projected. Charge
        // its references first so a long nested path cannot bypass the allowance.
        budget.remaining -= 32 + 8 * (parent.path.length + child.path.length);
        if (budget.remaining < 0)
            throw projectionBudgetExceeded;
    }
    return { ...child, path: [...parent.path, ...child.path] };
};
const projectIssue = (issue, input, budget) => {
    if (budget !== undefined)
        chargeProjection(issue, budget);
    const path = issue.path.flatMap((part) => typeof part === "string" || typeof part === "number" ? [part] : []);
    // Branch issue paths are relative to the union; branches often agree.
    if (issue.code === "invalid_union") {
        // Unmatched discriminators and ambiguous unions have no branch issues.
        // Keep their outer failure instead of flattening it into an empty list.
        if (issue.errors.length === 0) {
            const expected = "options" in issue ? issue.options?.filter(isSafeExpected) : undefined;
            return [
                {
                    path,
                    reason: valueAtPath(input, path) === undefined
                        ? "missing_argument"
                        : "invalid_value",
                    ...(expected === undefined ? {} : { expected }),
                },
            ];
        }
        return uniqueIssues(issue.errors.flatMap((branch) => branch.flatMap((branchIssue) => projectIssue(nestedIssue(issue, branchIssue, budget), input, budget))));
    }
    if (issue.code === "invalid_key")
        return issue.issues.flatMap((keyIssue) => projectIssue(nestedIssue(issue, keyIssue, budget), input, budget));
    if (issue.code === "unrecognized_keys")
        return issue.keys.map((key) => ({
            path: [...path, key],
            reason: "unknown_argument",
        }));
    if (issue.code === "invalid_type")
        return [
            {
                path,
                reason: valueAtPath(input, path) === undefined
                    ? "missing_argument"
                    : "invalid_type",
                expected: safeExpected(issue.expected),
            },
        ];
    if (issue.code === "too_small")
        return [boundedIssue(path, "minimum", numericBound(issue.minimum))];
    if (issue.code === "too_big")
        return [boundedIssue(path, "maximum", numericBound(issue.maximum))];
    if (issue.code === "invalid_format")
        return [
            {
                path,
                reason: "invalid_format",
                expected: issue.format,
                ...(issue.format === "regex" && issue.message.length > 0
                    ? { message: issue.message }
                    : {}),
            },
        ];
    if (issue.code === "invalid_value")
        return [
            {
                path,
                reason: "invalid_value",
                expected: issue.values.filter(isSafeExpected),
            },
        ];
    return [
        {
            path,
            reason: "invalid_value",
            ...(issue.message.length > 0 ? { message: issue.message } : {}),
        },
    ];
};
const uniqueIssues = (issues) => [
    ...new Map(issues.map((issue) => [JSON.stringify(issue), issue])).values(),
];
const valueAtPath = (input, path) => {
    let current = input;
    for (const part of path) {
        if (typeof current !== "object" || current === null)
            return undefined;
        const next = Reflect.get(current, part);
        current = next;
    }
    return current;
};
const numericBound = (value) => typeof value === "number" && Number.isFinite(value) ? value : undefined;
const isSafeExpected = (value) => value === null || ["string", "number", "boolean"].includes(typeof value);
const safeExpected = (value) => isSafeExpected(value) ? value : "schema-defined value";
const boundedIssue = (path, key, value) => ({
    path,
    reason: "out_of_range",
    ...(value === undefined ? {} : { [key]: value }),
});
