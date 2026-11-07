import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { C as ArtifactReaderFailure, D as init_ArtifactReader } from "./OwnedRegularFile-CufsBAJJ.js";
import { E as init_hashStableRootArtifact, w as hashStableRootArtifact } from "./lipo-BuH__Jok.js";

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
export { withArtifactTargetIdentity as n, init_withArtifactTargetIdentity as t };