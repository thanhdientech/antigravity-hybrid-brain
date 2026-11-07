import { getEvidenceInputContract, } from "../domain/evidenceInputContract.js";
import { toolInputSchemaWithMetadata, toolOutputSchemaWithMetadata, } from "../contracts/toolSchemaMetadata.js";
import { canReferenceInlineEvidence, markEvidenceInput, } from "./evidenceInputRegistration.js";
/** Project the canonical Zod contracts directly into SDK registration. */
export const toolRegistrationOptions = (contract) => {
    const advertised = toolInputSchemaWithMetadata(contract);
    const evidenceInputs = getEvidenceInputContract(contract.inputSchema);
    // The application owns source admission. Preserve the exact advertised
    // declaration while the SDK validates only the borrowing request envelope.
    const inputSchema = {
        "~standard": {
            version: advertised["~standard"].version,
            vendor: advertised["~standard"].vendor,
            jsonSchema: advertised["~standard"].jsonSchema,
            validate: evidenceInputs.frameSchema["~standard"].validate,
        },
    };
    return {
        title: contract.title,
        description: contract.description,
        inputSchema: evidenceInputs.hasEvidenceReferenceAlternative
            ? markEvidenceInput(inputSchema)
            : inputSchema,
        outputSchema: toolOutputSchemaWithMetadata(contract),
        annotations: contract.annotations,
    };
};
/** Register a workflow that validates raw input before effects and projects its own errors. */
export const applicationToolRegistrationOptions = (contract) => {
    const registration = toolRegistrationOptions(contract);
    const inputSchema = {
        "~standard": {
            ...registration.inputSchema["~standard"],
            vendor: "rea-application",
            validate: (value) => ({ value }),
        },
    };
    return {
        ...registration,
        inputSchema: canReferenceInlineEvidence(registration.inputSchema)
            ? markEvidenceInput(inputSchema)
            : inputSchema,
    };
};
