import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/artifacts/StreamBytes.js
var streamChunkToBuffer;
function init_StreamBytes() {
	return (init_StreamBytes = __esmMin((() => {
		streamChunkToBuffer = (value) => {
			if (Buffer.isBuffer(value)) return value;
			if (value instanceof Uint8Array) return Buffer.from(value);
			if (typeof value === "string") return Buffer.from(value);
			throw new TypeError("Readable stream emitted a non-byte chunk");
		};
	})))();
}

//#endregion
export { init_StreamBytes, streamChunkToBuffer };