import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { posix, win32 } from "node:path";

//#region dist/filesystem/callerPath.js
var appendCallerPath, absoluteCallerPath;
function init_callerPath() {
	return (init_callerPath = __esmMin((() => {
		appendCallerPath = (parent, child, platform = process.platform) => platform === "win32" ? win32.join(parent, child) : parent === "" ? child : `${parent.endsWith("/") ? parent : `${parent}/`}${child}`;
		absoluteCallerPath = (path, { cwd, platform = process.platform } = {}) => {
			if (platform === "win32") return win32.resolve(cwd ?? process.cwd(), path);
			if (!posix.isAbsolute(path)) {
				const selectedCwd = cwd ?? process.cwd();
				const base = posix.isAbsolute(selectedCwd) ? selectedCwd : absoluteCallerPath(selectedCwd, { platform });
				return absoluteCallerPath(`${base}/${path}`, { platform });
			}
			const segments = path.split("/").filter((segment) => segment !== "" && segment !== ".");
			const directory = /\/\.?$/u.test(path) && segments.length > 0;
			return `/${segments.join("/")}${directory ? "/" : ""}`;
		};
	})))();
}

//#endregion
export { absoluteCallerPath, appendCallerPath, init_callerPath };