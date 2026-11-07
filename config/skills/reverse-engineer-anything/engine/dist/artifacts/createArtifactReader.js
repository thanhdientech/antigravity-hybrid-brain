import { ARTIFACT_FORMATS, } from "./artifactFormats.js";
/** Construct a reader without acquiring or transferring its source ownership. */
export function createArtifactReader(path, format, options) {
    const descriptor = ARTIFACT_FORMATS[format];
    return "createReader" in descriptor
        ? descriptor.createReader(path, options)
        : undefined;
}
