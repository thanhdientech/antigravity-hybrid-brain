import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

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
export { decodeMachoFixedName, decodeMachoName, init_AppleMachoNames };