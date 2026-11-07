import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";

//#region dist/domain/apple/machoSectionHeader.js
var readMachoSectionHeader;
function init_machoSectionHeader() {
	return (init_machoSectionHeader = __esmMin((() => {
		init_result();
		readMachoSectionHeader = (bytes, wide, littleEndian) => {
			if (bytes.byteLength < (wide ? 80 : 68)) return err({
				kind: "malformed",
				message: "Mach-O section header is truncated"
			});
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			return ok({
				nameBytes: Buffer.from(bytes.subarray(0, 16)),
				segmentNameBytes: Buffer.from(bytes.subarray(16, 32)),
				address: wide ? view.getBigUint64(32, littleEndian) : BigInt(view.getUint32(32, littleEndian)),
				size: wide ? view.getBigUint64(40, littleEndian) : BigInt(view.getUint32(36, littleEndian)),
				offset: view.getUint32(wide ? 48 : 40, littleEndian),
				flags: view.getUint32(wide ? 64 : 56, littleEndian)
			});
		};
	})))();
}

//#endregion
export { init_machoSectionHeader, readMachoSectionHeader };