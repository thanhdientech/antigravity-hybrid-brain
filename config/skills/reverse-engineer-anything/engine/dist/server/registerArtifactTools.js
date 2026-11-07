import { ARTIFACT_TOOL_CONTRACTS } from "../contracts/artifactToolContracts.js";
import { createArtifactExtractionDestination } from "../application/artifacts/ArtifactExtractionDestination.js";
import { registerEvidenceTools } from "./registerEvidenceTools.js";
/** Register deterministic artifact inventory and safe extraction operations. */
export const registerArtifactTools = (server, options) => {
    registerEvidenceTools(server, ARTIFACT_TOOL_CONTRACTS, {
        ...options,
        parametersForExecution: (operation, parameters) => operation === "extract_artifact"
            ? { ...parameters, output_root: createArtifactExtractionDestination() }
            : parameters,
    });
};
