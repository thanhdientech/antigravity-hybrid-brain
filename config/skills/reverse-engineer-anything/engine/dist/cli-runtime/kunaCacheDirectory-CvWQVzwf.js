import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { absoluteCallerPath, appendCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { isAbsolute, posix, win32 } from "node:path";

//#region dist/config/kunaCacheDirectory.js
var defaultKunaCacheDirectory, sameLexicalDirectory, withinLexicalDirectory, hasParentTraversal, lexicalDirectory;
function init_kunaCacheDirectory() {
	return (init_kunaCacheDirectory = __esmMin((() => {
		init_callerPath();
		defaultKunaCacheDirectory = (home, environment, platform) => {
			if (platform === "darwin") return appendCallerPath(home, "Library/Caches/rea/kuna", platform);
			const xdg = environment.XDG_CACHE_HOME;
			const root = xdg !== undefined && isAbsolute(xdg) ? xdg : appendCallerPath(home, ".cache", platform);
			return appendCallerPath(root, "rea/kuna", platform);
		};
		sameLexicalDirectory = (left, right, platform) => lexicalDirectory(left, platform) === lexicalDirectory(right, platform);
		withinLexicalDirectory = (child, parent, platform) => {
			const base = lexicalDirectory(parent, platform);
			const inner = lexicalDirectory(child, platform);
			const separator = (platform === "win32" ? win32 : posix).sep;
			return inner === base || inner.startsWith(base.endsWith(separator) ? base : base + separator);
		};
		hasParentTraversal = (value) => value.split("/").includes("..");
		lexicalDirectory = (value, platform) => {
			const pathApi = platform === "win32" ? win32 : posix;
			const normalized = absoluteCallerPath(value, { platform });
			const root = pathApi.parse(normalized).root;
			let end = normalized.length;
			while (end > root.length && normalized.charCodeAt(end - 1) === pathApi.sep.charCodeAt(0)) end -= 1;
			return normalized.slice(0, end);
		};
	})))();
}

//#endregion
export { defaultKunaCacheDirectory, hasParentTraversal, init_kunaCacheDirectory, sameLexicalDirectory, withinLexicalDirectory };