import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/browser/ChromiumSandbox.js
var CHROMIUM_NO_SANDBOX_VARIABLE, chromiumSandboxEnabled, LAUNCH_REMEDIATION, chromiumLaunchRemediation;
function init_ChromiumSandbox() {
	return (init_ChromiumSandbox = __esmMin((() => {
		CHROMIUM_NO_SANDBOX_VARIABLE = "REA_BROWSER_NO_SANDBOX";
		chromiumSandboxEnabled = (environment, platform = process.platform) => platform !== "android" && environment["REA_BROWSER_NO_SANDBOX"] !== "true";
		LAUNCH_REMEDIATION = "Review the selected executable and startup diagnostics, then correct the launch configuration before retrying.";
		chromiumLaunchRemediation = (sandbox) => sandbox ? `${LAUNCH_REMEDIATION} If the startup diagnostics show that Chromium could not start its sandbox on this host, enable the host's sandbox support or set ${CHROMIUM_NO_SANDBOX_VARIABLE}=true to launch it without the sandbox.` : LAUNCH_REMEDIATION;
	})))();
}

//#endregion
export { chromiumLaunchRemediation, chromiumSandboxEnabled, init_ChromiumSandbox };