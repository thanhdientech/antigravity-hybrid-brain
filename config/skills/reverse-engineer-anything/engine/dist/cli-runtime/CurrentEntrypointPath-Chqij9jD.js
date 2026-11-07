import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { absoluteCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { init_runtimeVersion, javaScriptRuntime } from "./cliOutput-BK02eMs-.js";
import { resolve } from "node:path";

//#region dist/process/CurrentEntrypointPath.js
var normalizeEntrypointPath, CURRENT_ENTRYPOINT_PATH;
function init_CurrentEntrypointPath() {
	return (init_CurrentEntrypointPath = __esmMin((() => {
		init_runtimeVersion();
		init_callerPath();
		normalizeEntrypointPath = (entrypoint, runtime = javaScriptRuntime(process.versions).id) => entrypoint === undefined || entrypoint.length === 0 ? undefined : runtime === "bun" ? absoluteCallerPath(entrypoint) : resolve(entrypoint);
		CURRENT_ENTRYPOINT_PATH = normalizeEntrypointPath(process.argv[1]);
	})))();
}

//#endregion
export { CURRENT_ENTRYPOINT_PATH, init_CurrentEntrypointPath, normalizeEntrypointPath };