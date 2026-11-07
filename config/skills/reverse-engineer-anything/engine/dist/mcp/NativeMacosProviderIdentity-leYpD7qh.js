import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";

//#region dist/native/AppleMachoNames.js
var decodeMachoName, decodeMachoFixedName;
function init_AppleMachoNames() {
	return (init_AppleMachoNames = __esmMin((() => {
		decodeMachoName = (bytes) => {
			try {
				return new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(bytes);
			} catch {
				return { bytes_base64: bytes.toString("base64") };
			}
		};
		decodeMachoFixedName = (bytes) => {
			const nul = bytes.indexOf(0);
			return bytes.subarray(0, nul < 0 ? bytes.length : nul).toString("latin1");
		};
	})))();
}

//#endregion
//#region dist/native/NativeMacosProviderIdentity.js
var NATIVE_MACOS_PROVIDER_IDENTITY;
function init_NativeMacosProviderIdentity() {
	return (init_NativeMacosProviderIdentity = __esmMin((() => {
		NATIVE_MACOS_PROVIDER_IDENTITY = Object.freeze({
			id: "native-macos",
			name: "macOS native inspection utilities",
			version: null
		});
	})))();
}

//#endregion
export { init_AppleMachoNames as a, decodeMachoName as i, init_NativeMacosProviderIdentity as n, decodeMachoFixedName as r, NATIVE_MACOS_PROVIDER_IDENTITY as t };