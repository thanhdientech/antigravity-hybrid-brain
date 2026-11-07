import { absoluteCallerPath } from "../../filesystem/callerPath.js";
import { resolveArtifactSourcePath } from "../ArtifactSelectedSource.js";
import { artifactInventoryResultSchema, } from "../../domain/artifactGraph.js";
import { abortIfNeeded } from "../ArtifactHash.js";
import { scanCanonicalArtifactInventoryInScope, scanCanonicalArtifactInventoryForExtractionInScope, } from "./scanCanonical.js";
/** Inventory one local artifact and return every graph collection inline. */
export const inventoryArtifact = async (inputPath, options) => {
    const snapshot = await options.resourceScope.run(() => scanArtifactInventoryInScope(inputPath, options));
    return artifactInventoryResultSchema.parse(snapshot);
};
export const scanArtifactInventoryInScope = async (inputPath, options) => {
    abortIfNeeded(options.signal);
    const path = await resolveArtifactSourcePath(inputPath);
    return scanCanonicalArtifactInventoryInScope(path, options, undefined, absoluteCallerPath(options.selectedPath ?? inputPath));
};
export const scanArtifactInventoryForExtractionInScope = async (inputPath, options, probeFacts) => {
    abortIfNeeded(options.signal);
    const path = await resolveArtifactSourcePath(inputPath);
    return scanCanonicalArtifactInventoryForExtractionInScope(path, options, probeFacts, absoluteCallerPath(options.selectedPath ?? inputPath));
};
