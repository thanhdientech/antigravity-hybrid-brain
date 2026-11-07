import { ESP8266_REFUSAL, createEspImageDecoder, recognizeEspImage, } from "../domain/firmware/espImage.js";
import { firstUnerased } from "../domain/firmware/espImageStructures.js";
import { readFileHandleChunks } from "../filesystem/readFileHandleChunks.js";
import { ArtifactReaderFailure } from "./ArtifactReader.js";
const LABEL = "ESP flash image";
const HEADER_BYTES = 24;
const PROBE_BYTES = 32;
const chunks = ({ handle, signal }, start, length) => readFileHandleChunks(handle, {
    start,
    end: start + length - 1,
    signal,
    cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", `${LABEL} read cancelled`, {
        cause: reason,
    }),
});
/** Up to `length` bytes at a file offset; fewer at the end of the file. */
export const readEspFlashRange = async (context, position, length) => {
    const available = Math.min(length, context.fileSize - position);
    if (position < 0 || available <= 0)
        return Buffer.alloc(0);
    const parts = [];
    for await (const chunk of chunks(context, position, available))
        parts.push(chunk);
    return Buffer.concat(parts);
};
/** The file offset of the first byte in a range that is not erased flash. */
export const firstUnerasedInRange = async (context, range, assertOpen) => {
    if (range.length <= 0)
        return undefined;
    let position = range.start;
    for await (const chunk of chunks(context, range.start, range.length)) {
        assertOpen();
        const found = firstUnerased(chunk, position);
        if (found !== undefined)
            return found;
        position += chunk.length;
    }
    return undefined;
};
/** The segments region boundaries cut, kept where some region covers them. */
const coveredSegments = (ranges) => {
    const cuts = [
        ...new Set(ranges.flatMap(({ start, length }) => [start, start + length])),
    ].sort((left, right) => left - right);
    return cuts.slice(1).flatMap((end, index) => {
        const start = cuts[index];
        const covered = ranges.some((range) => range.start <= start && end <= range.start + range.length);
        return covered ? [{ start, end, first: -1, last: -1, bytes: 0 }] : [];
    });
};
const tally = (segment, bytes, position) => {
    for (let index = 0; index < bytes.length; index += 1)
        if (bytes[index] !== 0xff) {
            segment.bytes += 1;
            segment.last = position + index;
            if (segment.first < 0)
                segment.first = segment.last;
        }
};
/** Read adjacent segments as one range, tallying each byte in its segment. */
const readSegments = async (context, segments, assertOpen) => {
    const start = segments[0].start;
    let position = start;
    let current = 0;
    for await (const chunk of chunks(context, start, segments.at(-1).end - start)) {
        assertOpen();
        let offset = 0;
        while (offset < chunk.length) {
            const segment = segments[current];
            const taken = Math.min(chunk.length - offset, segment.end - position);
            tally(segment, chunk.subarray(offset, offset + taken), position);
            offset += taken;
            position += taken;
            if (position === segment.end)
                current += 1;
        }
    }
};
/** One region's extent from the segments inside it, relative to its start. */
const regionExtent = ({ start, length }, segments) => {
    let first = -1;
    let last = -1;
    let bytes = 0;
    for (const segment of segments) {
        if (segment.start < start || segment.end > start + length)
            continue;
        bytes += segment.bytes;
        if (first < 0)
            first = segment.first;
        last = Math.max(last, segment.last);
    }
    return first < 0
        ? { offset: null, end: null, bytes: 0 }
        : { offset: first - start, end: last + 1 - start, bytes };
};
/**
 * Where each region is not erased, reading the bytes the regions cover once.
 * Region boundaries cut those bytes into segments, so overlapping regions
 * share their reads however many the table declares.
 */
export const writtenExtents = async (context, regions, assertOpen) => {
    const segments = coveredSegments(regions.filter(({ length }) => length > 0));
    let run = 0;
    for (let index = 1; index <= segments.length; index += 1)
        if (index === segments.length ||
            segments[index].start !== segments[index - 1].end) {
            await readSegments(context, segments.slice(run, index), assertOpen);
            run = index;
        }
    return regions.map((region) => regionExtent(region, segments));
};
const noImage = (status, limitations) => ({
    status,
    image: null,
    segments: [],
    signature_blocks: [],
    coverage: null,
    limitations: [...limitations],
});
/**
 * Decode an ESP image at the start of a region, as the bootloader reads a
 * partition: one streaming pass with the ESP image decoder. Offsets in the
 * facts are relative to the region; `erased` means the header bytes are
 * erased flash.
 */
export const decodeEspFlashImage = async (context, region, assertOpen) => {
    // The region's end bounds the read, so a short region stays short.
    const prefix = await readEspFlashRange({ ...context, fileSize: region.start + region.length }, region.start, PROBE_BYTES);
    // A region shorter than a header is erased when all of its bytes are.
    if (prefix.length > 0 &&
        prefix.subarray(0, HEADER_BYTES).every((byte) => byte === 0xff))
        return noImage("erased", []);
    const recognized = recognizeEspImage(prefix, region.length);
    if (recognized === "esp8266")
        return noImage("unrecognized", [ESP8266_REFUSAL]);
    if (recognized !== "esp-image")
        return noImage("unrecognized", [
            "The region does not begin with a recognized ESP image header; it may be encrypted or hold other data.",
        ]);
    const decoder = createEspImageDecoder(region.length);
    for await (const chunk of chunks(context, region.start, region.length)) {
        assertOpen();
        decoder.write(chunk);
        if (decoder.satisfied)
            break;
    }
    const image = decoder.finish();
    if (!image.ok)
        return noImage("unrecognized", [image.error.message]);
    return {
        status: "esp-image",
        image: image.value.metadata,
        segments: image.value.segments.map(({ metadata }) => ({ ...metadata })),
        signature_blocks: image.value.signatureBlocks.map(({ metadata }) => ({
            ...metadata,
        })),
        coverage: image.value.coverage,
        limitations: [...image.value.limitations],
    };
};
