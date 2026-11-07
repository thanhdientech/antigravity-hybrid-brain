import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/filesystem/readFileHandleRange.js
var readFileHandleRange;
function init_readFileHandleRange() {
	return (init_readFileHandleRange = __esmMin((() => {
		readFileHandleRange = async (handle, position, length, assertActive = () => {}) => {
			if (!Number.isSafeInteger(position) || position < 0 || !Number.isSafeInteger(length) || length < 0 || !Number.isSafeInteger(position + length)) throw new RangeError("Invalid file read range");
			assertActive(0);
			const bytes = Buffer.alloc(length);
			let filled = 0;
			while (filled < length) {
				assertActive(filled);
				const { bytesRead } = await handle.read(bytes, filled, length - filled, position + filled);
				if (bytesRead === 0) break;
				filled += bytesRead;
				assertActive(filled);
			}
			return bytes.subarray(0, filled);
		};
	})))();
}

//#endregion
export { init_readFileHandleRange, readFileHandleRange };