import { AsarArtifactReader } from "../AsarArtifactReader.js";
import { DirectoryArtifactReader } from "../DirectoryArtifactReader.js";
/** Create the reader for an admitted JavaScript artifact format. */
export const createJavaScriptArtifactReader = (path, format, asarHeaderAdmission, selectedPath) => format === "asar"
    ? new AsarArtifactReader(path, {
        ...(asarHeaderAdmission === undefined
            ? {}
            : { headerAdmission: asarHeaderAdmission }),
        ...(selectedPath === undefined ? {} : { selectedPath }),
    })
    : new DirectoryArtifactReader(path, "omit");
