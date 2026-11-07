import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_analysisErrorBase, t as AnalysisError } from "./analysisErrorBase-DIqf4-vY.js";

//#region dist/domain/configurationErrors.js
var ConfigurationError, NoBinaryOpenError, BinaryTargetError, readPermissionCode;
function init_configurationErrors() {
	return (init_configurationErrors = __esmMin((() => {
		init_analysisErrorBase();
		ConfigurationError = class extends AnalysisError {
			_tag = "ConfigurationError";
			settings;
			remediationAction;
			constructor(message, options) {
				super(message, options);
				this.remediationAction = options?.remediationAction;
				this.settings = (options?.settings ?? []).map(({ setting, constraint }) => ({
					setting,
					constraint
				}));
			}
		};
		NoBinaryOpenError = class extends AnalysisError {
			_tag = "NoBinaryOpenError";
			constructor() {
				super("No app is open. Ask the user which app to investigate, then call open_binary with its local path.");
			}
		};
		BinaryTargetError = class extends AnalysisError {
			path;
			reason;
			_tag = "BinaryTargetError";
			constraint;
			infoPlist;
			probedPaths;
			/** The OS read-permission code of the cause, when the host denied access. */
			systemCode;
			constructor(path, reason, options) {
				super(`Cannot open artifact: ${reason}`, options);
				this.path = path;
				this.reason = reason;
				this.constraint = options?.constraint;
				this.infoPlist = options?.infoPlist;
				this.probedPaths = options?.probedPaths;
				this.systemCode = readPermissionCode(options?.cause);
			}
		};
		readPermissionCode = (cause) => {
			const code = cause instanceof Error ? Reflect.get(cause, "code") : undefined;
			return code === "EACCES" || code === "EPERM" ? code : undefined;
		};
	})))();
}

//#endregion
export { init_configurationErrors as i, ConfigurationError as n, NoBinaryOpenError as r, BinaryTargetError as t };