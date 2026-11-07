import { createHash } from "node:crypto";
import { ArtifactReaderFailure } from "./ArtifactReader.js";
import { streamChunkToBuffer } from "./StreamBytes.js";
import { createArtifactClassificationProbe, } from "./ArtifactClassificationProbe.js";
/** Preserve the inventory cancellation reason at a stream boundary. */
export const abortIfNeeded = (signal) => {
    if (signal?.aborted === true)
        throw new ArtifactReaderFailure("cancelled", "Artifact inventory cancelled", { cause: signal.reason });
};
/** Hash every stream byte, optionally feeding the same bytes to a scan aggregate. */
export const hashReadable = async (stream, signal, integrityAlgorithm, asarHeaderAdmission, observeChunk) => {
    const completed = await hashReadableToCompletion(stream, signal, integrityAlgorithm, asarHeaderAdmission, observeChunk);
    abortIfNeeded(signal);
    return completed;
};
/** Keep a fully delivered digest so its owner can validate before late cancellation.
 * Source stability remains the stream or caller's responsibility.
 */
export const hashReadableToCompletion = async (stream, signal, integrityAlgorithm, asarHeaderAdmission, observeChunk) => {
    const hash = createHash("sha256");
    const md5 = integrityAlgorithm === "md5" ? createHash("md5") : undefined;
    const probe = createArtifactClassificationProbe(asarHeaderAdmission);
    let bytes = 0;
    for await (const raw of stream) {
        abortIfNeeded(signal);
        const chunk = streamChunkToBuffer(raw);
        bytes += chunk.length;
        hash.update(chunk);
        observeChunk?.(chunk);
        md5?.update(chunk);
        probe.write(chunk);
    }
    return {
        sha256: hash.digest("hex"),
        ...(md5 === undefined ? {} : { md5: md5.digest("hex") }),
        bytes,
        ...probe.finish(bytes),
    };
};
