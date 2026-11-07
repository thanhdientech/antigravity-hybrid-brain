import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { satisfies } from "semver";

//#region dist/domain/runtimeVersion.js
var SUPPORTED_NODE_VERSION_RANGE, SUPPORTED_NODE_VERSION_PROSE, supportsNodeVersion, javaScriptRuntime, supportsJavaScriptRuntime;
function init_runtimeVersion() {
	return (init_runtimeVersion = __esmMin((() => {
		SUPPORTED_NODE_VERSION_RANGE = "^22.23.4 || ^24.22.1 || >=26.12.1";
		SUPPORTED_NODE_VERSION_PROSE = "Node.js 22.x (>=22.23.4), 24.x (>=24.22.1), or 26.12.1+";
		supportsNodeVersion = (version) => satisfies(version, SUPPORTED_NODE_VERSION_RANGE);
		javaScriptRuntime = (versions) => versions.bun === undefined ? {
			id: "node",
			version: versions.node
		} : {
			id: "bun",
			version: versions.bun,
			nodeCompatibilityVersion: versions.node
		};
		supportsJavaScriptRuntime = (runtime) => supportsNodeVersion(runtime.id === "node" ? runtime.version : runtime.nodeCompatibilityVersion);
	})))();
}

//#endregion
export { javaScriptRuntime as n, init_runtimeVersion as t };