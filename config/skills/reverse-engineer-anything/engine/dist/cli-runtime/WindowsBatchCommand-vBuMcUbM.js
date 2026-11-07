import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_snapshotEnvironment, snapshotEnvironment } from "./snapshotEnvironment-C6Y7aHfj.js";
import { win32 } from "node:path";

//#region dist/process/WindowsBatchCommand.js
var WindowsBatchCommandError, isWindowsBatchFile, quoteWindowsBatchToken, windowsBatchCommand;
function init_WindowsBatchCommand() {
	return (init_WindowsBatchCommand = __esmMin((() => {
		init_snapshotEnvironment();
		WindowsBatchCommandError = class extends Error {
			reason;
			constructor(reason, message) {
				super(message);
				this.reason = reason;
				this.name = "WindowsBatchCommandError";
			}
		};
		isWindowsBatchFile = (command) => /\.(?:bat|cmd)$/iu.test(command);
		quoteWindowsBatchToken = (value) => {
			if (value.length === 0 || value.includes("\0") || value.includes("\r") || value.includes("\n") || /["%^!&|<>]/u.test(value)) throw new WindowsBatchCommandError("metacharacter", "Windows batch arguments cannot contain command-interpreter metacharacters");
			return `"${value}"`;
		};
		windowsBatchCommand = (options) => {
			const environment = snapshotEnvironment(options.environment, "win32");
			const systemRoot = environment.SYSTEMROOT;
			const comSpec = options.comSpec ?? environment.COMSPEC ?? (systemRoot === undefined ? "C:\\Windows\\System32\\cmd.exe" : win32.join(systemRoot, "System32", "cmd.exe"));
			if (!win32.isAbsolute(comSpec) || win32.basename(comSpec).toLowerCase() !== "cmd.exe") throw new WindowsBatchCommandError("invalid_comspec", "Windows ComSpec must be an absolute cmd.exe path");
			const tokens = [options.batchPath, ...options.arguments].map(quoteWindowsBatchToken);
			return {
				command: comSpec,
				arguments: [
					"/d",
					"/e:on",
					"/v:off",
					"/s",
					"/c",
					`"${tokens.join(" ")}"`
				]
			};
		};
	})))();
}

//#endregion
export { WindowsBatchCommandError, init_WindowsBatchCommand, isWindowsBatchFile, quoteWindowsBatchToken, windowsBatchCommand };