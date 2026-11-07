import { COMPACT_SCHEMA_MAX_DEPTH, hasGatewayIncompatibleShape, inlineWithinBudget, isSchemaObject, reduceToShallowProperties, schemaDepth, serializedBytes, stripAnnotations, typeArrayItemUnions, } from "./compactJsonSchema.js";
const INPUT_REDUCED_ANNOTATION = "Advertised in reduced form by the compact input schema profile; the server still validates complete canonical inputs.";
// `detail` selects between complete Evidence and a bounded summary. Without
// its guidance, callers default to complete replies that can exceed context.
const retainedRootPropertyDescriptions = ["detail"];
/** Restore the description of root properties whose choice bounds the reply. */
const retainRootPropertyGuidance = (schema, stripped) => {
    if (!isSchemaObject(schema.properties) ||
        !isSchemaObject(stripped.properties))
        return stripped;
    const properties = { ...stripped.properties };
    for (const name of retainedRootPropertyDescriptions) {
        const source = schema.properties[name];
        const kept = properties[name];
        if (isSchemaObject(source) &&
            isSchemaObject(kept) &&
            typeof source.description === "string")
            properties[name] = { ...kept, description: source.description };
    }
    return { ...stripped, properties };
};
/**
 * Render an advertised input schema within a per-schema byte budget for
 * providers that validate the literal serialized schema size. Validation
 * keywords and the canonical contract are preserved; only
 * annotation prose and, for structurally oversized schemas, nested
 * validation detail leave the advertised form.
 */
export const compactAdvertisedInputSchema = (schema, budgetBytes) => {
    const expanded = inlineWithinBudget(stripAnnotations(schema), budgetBytes);
    const inline = expanded === undefined
        ? undefined
        : typeArrayItemUnions(retainRootPropertyGuidance(schema, expanded));
    if (inline !== undefined &&
        serializedBytes(inline) <= budgetBytes &&
        schemaDepth(inline) <= COMPACT_SCHEMA_MAX_DEPTH &&
        !hasGatewayIncompatibleShape(inline))
        return { schema: inline, presentation: "inline" };
    const reduced = reduceToShallowProperties(schema, INPUT_REDUCED_ANNOTATION);
    if (serializedBytes(reduced) <= budgetBytes)
        return { schema: reduced, presentation: "reduced" };
    // A future contract with an extreme root-property count still advertises
    // an honest, budget-fitting shape instead of an oversized one.
    return {
        schema: reduceToShallowProperties({
            type: "object",
            description: (typeof schema.description === "string"
                ? `${schema.description} `
                : "") + INPUT_REDUCED_ANNOTATION,
        }, INPUT_REDUCED_ANNOTATION),
        presentation: "reduced",
    };
};
/** Return the JSON schema clients receive for the selected input presentation. */
export const presentAdvertisedInputSchema = (schema, compactPresentation) => compactPresentation === undefined
    ? schema
    : compactAdvertisedInputSchema(schema, compactPresentation.budgetBytes)
        .schema;
