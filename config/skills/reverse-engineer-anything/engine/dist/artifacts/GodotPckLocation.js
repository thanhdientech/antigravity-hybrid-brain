import { hasGodotPckHeader, readGodotPckTrailerFacts, } from "../domain/godotPckFormat.js";
import { readArtifactFileBytes } from "./ArtifactFileRange.js";
import { assertArtifactReadActive } from "./ArtifactFileOperation.js";
/**
 * Observe an admitted source of at least 12 bytes. Caller-owned exact reads retain
 * admission, cancellation, budgets and range evidence; read failures propagate.
 */
export const observeEmbeddedGodotPck = async (size, headerBytes, read) => {
    const trailer = await read(size - 12, 12, size);
    const declaration = readGodotPckTrailerFacts(trailer, size);
    if (declaration.state === "absent")
        return declaration;
    const { start, end, packBytes } = declaration;
    if (start === null || packBytes < BigInt(headerBytes))
        return { state: "invalid-extent", declaration };
    const header = await read(start, headerBytes, end);
    if (!hasGodotPckHeader(header))
        return { state: "header-mismatch", declaration };
    return { state: "located", declaration, start, header };
};
/** Recognize a standalone header or the exact engine trailer; never scan payloads. */
export const locateGodotPck = async (handle, size, signal, prefix) => {
    assertArtifactReadActive(signal);
    if (!Number.isSafeInteger(size) || size < 4)
        return undefined;
    const magic = prefix !== undefined && prefix.length >= 4
        ? Buffer.from(prefix.buffer, prefix.byteOffset, 4)
        : await readArtifactFileBytes(handle, 0, 4, size, signal);
    if (hasGodotPckHeader(magic))
        return { start: 0, end: size, embedded: false };
    if (size < 12)
        return undefined;
    const observation = await observeEmbeddedGodotPck(size, 4, (offset, bytes, end) => readArtifactFileBytes(handle, offset, bytes, end, signal));
    if (observation.state !== "located")
        return undefined;
    return {
        start: observation.start,
        end: observation.declaration.end,
        embedded: true,
    };
};
