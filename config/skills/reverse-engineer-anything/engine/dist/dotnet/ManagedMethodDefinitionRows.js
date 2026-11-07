import { metadataRowCursor, metadataToken } from "./ManagedMetadataHeaps.js";
const METHOD_CODE_TYPES = ["il", "native", "optil", "runtime"];
/** Scalar MethodDef facts; consumers own heap admission and method selection. */
export const readMethodDefinitionRow = (bytes, layout, row) => {
    // Layout admission bounds the whole fixed-width row before a cursor is created.
    const cursor = metadataRowCursor(bytes, layout, 6, row);
    const rva = cursor.readUInt32();
    const implFlags = cursor.readUInt16();
    const flags = cursor.readUInt16();
    return {
        token: metadataToken(6, row),
        rowOffset: cursor.start,
        rva,
        implFlags,
        flags,
        nameIndex: cursor.readIndex(layout.stringIndexSize),
        signatureIndex: cursor.readIndex(layout.blobIndexSize),
        implementation: {
            codeType: METHOD_CODE_TYPES[(implFlags & 0x0003)],
            managedKind: (implFlags & 0x0004) === 0 ? "managed" : "unmanaged",
            pinvokeFlag: (flags & 0x2000) !== 0,
        },
    };
};
