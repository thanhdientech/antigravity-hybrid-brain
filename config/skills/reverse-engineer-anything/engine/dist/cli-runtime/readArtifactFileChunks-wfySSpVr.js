import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ArtifactReaderFailure, init_ArtifactReader } from "./ArtifactReader-DJ9rniiL.js";
import { init_readFileHandleChunks, readFileHandleChunks } from "./readFileHandleChunks-Cuq9fZuV.js";

//#region dist/artifacts/readArtifactFileChunks.js
var readArtifactFileChunks;
function init_readArtifactFileChunks() {
	return (init_readArtifactFileChunks = __esmMin((() => {
		init_readFileHandleChunks();
		init_ArtifactReader();
		readArtifactFileChunks = (handle, options = {}) => readFileHandleChunks(handle, {
			...options,
			cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", "Artifact file read cancelled", { cause: reason })
		});
	})))();
}

//#endregion
export { init_readArtifactFileChunks, readArtifactFileChunks };