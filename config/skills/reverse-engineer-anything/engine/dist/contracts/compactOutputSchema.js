import { COMPACT_SCHEMA_MAX_DEPTH, inlineWithinBudget, isSchemaObject, jsonValueSchema, reduceToShallowProperties, schemaDepth, serializedBytes, stripAnnotations, } from "./compactJsonSchema.js";
const OUTPUT_REDUCED_ANNOTATION = "Advertised in reduced form by the compact output schema profile; the server still validates complete canonical results.";
/**
 * Drop the canonical contract's content-bound `$id` and anchors. The compact
 * bytes differ from the canonical schema the identity was derived from, so
 * retaining that identity would misstate what the advertised document is.
 * References are already inlined, so no identity is needed to resolve them.
 */
const withoutContentBoundIdentity = (schema) => {
    const { $id: _id, $anchor: _anchor, ...advertised } = schema;
    return advertised;
};
/**
 * Render an advertised output schema within a per-schema byte budget. The
 * complete validation structure is kept when it fits; otherwise the root
 * property shape and first-level types remain and nested detail is elided.
 * The registered canonical schema still validates every delivered result.
 */
export const compactAdvertisedOutputSchema = (schema, budgetBytes) => {
    const inline = inlineWithinBudget(stripAnnotations(schema), budgetBytes);
    if (inline !== undefined && schemaDepth(inline) <= COMPACT_SCHEMA_MAX_DEPTH)
        return {
            schema: withoutContentBoundIdentity(inline),
            presentation: "inline",
        };
    // Every REA output contract is an object at the root. A non-object root still
    // advertises an accepting shape rather than a projection that could reject
    // valid canonical output.
    const reduced = schema.type === "object" || isSchemaObject(schema.properties)
        ? reduceToShallowProperties(schema, OUTPUT_REDUCED_ANNOTATION)
        : jsonValueSchema();
    if (serializedBytes(reduced) <= budgetBytes)
        return {
            schema: withoutContentBoundIdentity(reduced),
            presentation: "reduced",
        };
    // A root description can itself be large; keep the advertisement inside the
    // budget instead of carrying it into a shape with no nested detail left.
    const minimal = reduceToShallowProperties({ type: "object" }, OUTPUT_REDUCED_ANNOTATION);
    return {
        schema: serializedBytes(minimal) <= budgetBytes ? minimal : jsonValueSchema(),
        presentation: "reduced",
    };
};
/** Return the JSON schema clients receive for the selected output presentation. */
export const presentAdvertisedOutputSchema = (schema, compactPresentation) => compactPresentation === undefined
    ? schema
    : compactAdvertisedOutputSchema(schema, compactPresentation.budgetBytes)
        .schema;
