/** Internal registration facts derived from canonical Evidence input contracts. */
const evidenceInputs = new WeakSet();
export const markEvidenceInput = (schema) => {
    evidenceInputs.add(schema);
    return schema;
};
export const canReferenceInlineEvidence = (schema) => typeof schema === "object" && schema !== null && evidenceInputs.has(schema);
