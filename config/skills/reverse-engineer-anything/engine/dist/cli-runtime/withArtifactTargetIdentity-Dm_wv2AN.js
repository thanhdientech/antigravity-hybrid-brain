import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ArtifactReaderFailure, init_ArtifactReader } from "./ArtifactReader-DJ9rniiL.js";
import { hashStableRootArtifact, init_hashStableRootArtifact } from "./hashStableRootArtifact-c9zqp67k.js";

//#region dist/artifacts/withArtifactTargetIdentity.js
var withArtifactTargetIdentity;
function init_withArtifactTargetIdentity() {
	return (init_withArtifactTargetIdentity = __esmMin((() => {
		init_ArtifactReader();
		init_hashStableRootArtifact();
		withArtifactTargetIdentity = async (target, resources, read, signal) => {
			const verify = async () => {
				const digest = await hashStableRootArtifact(target.path, resources, signal);
				if (digest.sha256 !== target.sha256) throw new ArtifactReaderFailure("integrity", `Active target digest changed: expected ${target.sha256}, observed ${digest.sha256}`);
			};
			await verify();
			const result = await read();
			await verify();
			return result;
		};
	})))();
}

//#endregion
export { init_withArtifactTargetIdentity, withArtifactTargetIdentity };