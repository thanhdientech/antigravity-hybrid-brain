import { z } from "zod";
import { ok } from "./result.js";
// Zod registries carry owner metadata through describe/meta clones. This is a
// schema declaration registry, never a store of caller Evidence or references.
const declarations = z.registry();
const referenceAlternatives = z.registry();
const borrowedDeclarations = new WeakMap();
/** Inspect authored declarations, including described clones, for catalog checks. */
export const isDeclaredEvidenceInput = (schema) => declarations.get(schema) !== undefined;
/** Mark the canonical logical Evidence input, independently of its JSON shape. */
export const declareEvidenceInput = (schema) => {
    declarations.add(schema, { kind: "evidence" });
    return schema;
};
/** Mark a source union that accepts both inline Evidence and a retained reference. */
export const declareEvidenceReferenceAlternative = (schema) => {
    referenceAlternatives.add(schema, { retained: true });
    return schema;
};
/** Keep an SDK-borrowed selection associated with its owning declaration. */
export const declareBorrowedEvidenceInput = (schema, declaration) => {
    const owner = {};
    borrowedDeclarations.set(owner, declaration);
    declarations.add(schema, { kind: "borrowed", owner });
    return schema;
};
const contracts = new WeakMap();
const identity = (schema, hasEvidenceReferenceAlternative = false) => ({
    frameSchema: schema,
    hasEvidence: false,
    hasEvidenceReferenceAlternative,
    resolve: (input) => ok(input),
});
/**
 * Compile author-owned object/array/union/wrapper declarations once. Inline
 * Evidence is borrowed, not parsed or authenticated here. Unsupported ordinary
 * value schemas stay with their owner; no arbitrary JSON is searched for IDs.
 */
export const getEvidenceInputContract = (schema) => {
    const existing = contracts.get(schema);
    if (existing !== undefined)
        return existing;
    const result = compile(schema);
    contracts.set(schema, result);
    return result;
};
const compile = (schema) => {
    if (referenceAlternatives.get(schema) !== undefined)
        return identity(schema, true);
    const declared = declarations.get(schema);
    if (declared?.kind === "evidence")
        return {
            frameSchema: z.unknown().nonoptional(),
            hasEvidence: true,
            hasEvidenceReferenceAlternative: true,
            resolve: (input, visit, path = []) => visit(input, path),
        };
    if (declared?.kind === "borrowed") {
        const declaration = borrowedDeclarations.get(declared.owner);
        if (declaration === undefined)
            throw new TypeError("Borrowed Evidence schema has no owning declaration");
        const source = getEvidenceInputContract(declaration);
        return { ...source, frameSchema: schema };
    }
    if (schema instanceof z.ZodObject)
        return objectContract(schema);
    if (schema instanceof z.ZodArray)
        return arrayContract(schema);
    if (schema instanceof z.ZodUnion)
        return unionContract(schema);
    if (schema instanceof z.ZodOptional ||
        schema instanceof z.ZodExactOptional ||
        schema instanceof z.ZodNullable ||
        schema instanceof z.ZodDefault ||
        schema instanceof z.ZodPrefault ||
        schema instanceof z.ZodNonOptional ||
        schema instanceof z.ZodReadonly) {
        const child = getEvidenceInputContract(schema.unwrap());
        if (!child.hasEvidence)
            return identity(schema, child.hasEvidenceReferenceAlternative);
        return {
            hasEvidence: true,
            hasEvidenceReferenceAlternative: child.hasEvidenceReferenceAlternative,
            frameSchema: replaceWrappedSchema(schema, child.frameSchema),
            resolve: (input, visit, path = []) => input === undefined ||
                (input === null && schema instanceof z.ZodNullable)
                ? ok(input)
                : child.resolve(input, visit, path),
        };
    }
    return identity(schema);
};
/** Zod's public clone retains the concrete wrapper and its existing checks. */
const replaceWrappedSchema = (schema, innerType) => {
    const definition = { ...schema.def, innerType };
    return z.clone(schema, definition, { parent: true });
};
const objectContract = (schema) => {
    const children = Object.entries(schema.shape).map(([key, child]) => [key, getEvidenceInputContract(child)]);
    const selected = children.filter(([, child]) => child.hasEvidence);
    const hasEvidenceReferenceAlternative = children.some(([, child]) => child.hasEvidenceReferenceAlternative);
    if (selected.length === 0)
        return identity(schema, hasEvidenceReferenceAlternative);
    return {
        hasEvidence: true,
        hasEvidenceReferenceAlternative,
        frameSchema: schema.clone({
            ...schema.def,
            shape: Object.fromEntries(children.map(([key, child]) => [key, child.frameSchema])),
        }, { parent: true }),
        resolve: (input, visit, path = []) => {
            if (typeof input !== "object" || input === null || Array.isArray(input))
                return ok(input);
            let result = input;
            for (const [key, child] of selected) {
                if (!Object.hasOwn(result, key))
                    continue;
                const value = child.resolve(result[key], visit, [...path, key]);
                if (!value.ok)
                    return value;
                if (value.value !== result[key])
                    result = { ...result, [key]: value.value };
            }
            return ok(result);
        },
    };
};
const arrayContract = (schema) => {
    const child = getEvidenceInputContract(schema.element);
    if (!child.hasEvidence)
        return identity(schema, child.hasEvidenceReferenceAlternative);
    return {
        hasEvidence: true,
        hasEvidenceReferenceAlternative: child.hasEvidenceReferenceAlternative,
        frameSchema: schema.clone({ ...schema.def, element: child.frameSchema }, { parent: true }),
        resolve: (input, visit, path = []) => {
            if (!Array.isArray(input))
                return ok(input);
            let result = input;
            for (const [index, item] of input.entries()) {
                const value = child.resolve(item, visit, [...path, index]);
                if (!value.ok)
                    return value;
                if (value.value !== item) {
                    if (result === input)
                        result = input.slice();
                    result[index] = value.value;
                }
            }
            return ok(result);
        },
    };
};
const unionContract = (schema) => {
    const options = schema.options.map((option) => getEvidenceInputContract(option));
    const hasEvidenceReferenceAlternative = options.some((option) => option.hasEvidenceReferenceAlternative);
    if (!options.some((option) => option.hasEvidence))
        return identity(schema, hasEvidenceReferenceAlternative);
    // Capture the successful branch while parsing; choosing it again later would
    // repeat defaults, overwrites and refinements. Keys are only parser results.
    const branches = new WeakMap();
    const frame = z.union(options.map((option) => option.frameSchema.transform((value) => {
        if (typeof value === "object" && value !== null)
            branches.set(value, option);
        return value;
    })));
    return {
        hasEvidence: true,
        hasEvidenceReferenceAlternative,
        frameSchema: frame.clone({
            ...frame.def,
            ...(schema.def.error === undefined ? {} : { error: schema.def.error }),
            ...(schema.def.checks === undefined ? {} : { checks: schema.def.checks }),
        }),
        resolve: (input, visit, path = []) => {
            const selected = typeof input === "object" && input !== null
                ? branches.get(input)
                : undefined;
            return selected?.resolve(input, visit, path) ?? ok(input);
        },
    };
};
