import { metadataRowCursor } from "./ManagedMetadataHeaps.js";
import { memberListIndexSize } from "./ManagedMemberPointers.js";
export const readTypeDefinitionRowFacts = (bytes, layout, row) => {
    const cursor = metadataRowCursor(bytes, layout, 2, row);
    const flags = cursor.readUInt32();
    const nameIndex = cursor.readIndex(layout.stringIndexSize);
    const namespaceIndex = cursor.readIndex(layout.stringIndexSize);
    const extendsOffset = cursor.offset;
    const extendsRaw = cursor.readIndex(layout.codedIndexSize("TypeDefOrRef"));
    const fieldListOffset = cursor.offset;
    const fieldListRaw = cursor.readIndex(memberListIndexSize(layout, 4));
    const methodListOffset = cursor.offset;
    const methodListRaw = cursor.readIndex(memberListIndexSize(layout, 6));
    return {
        rowOffset: cursor.start,
        flags,
        nameIndex,
        namespaceIndex,
        extendsRaw,
        extendsOffset,
        fieldListRaw,
        fieldListOffset,
        methodListRaw,
        methodListOffset,
    };
};
