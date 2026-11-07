import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_stringPatterns, isPaddedBase64 } from "./mcpDoctorOptions-DnJ1wqKj.js";

//#region dist/domain/paddedBase64.js
var paddedBase64ByteLength, decodePaddedBase64;
function init_paddedBase64() {
	return (init_paddedBase64 = __esmMin((() => {
		init_stringPatterns();
		paddedBase64ByteLength = (value) => {
			if (!isPaddedBase64(value)) return undefined;
			return Buffer.byteLength(value, "base64");
		};
		decodePaddedBase64 = (value) => paddedBase64ByteLength(value) === undefined ? undefined : Buffer.from(value, "base64");
	})))();
}

//#endregion
export { decodePaddedBase64, init_paddedBase64, paddedBase64ByteLength };