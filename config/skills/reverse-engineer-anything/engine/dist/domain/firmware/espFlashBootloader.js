import { ESP_ROM_BOOTLOADER_OFFSETS, espChipForId, } from "./espChips.js";
import { ESP_IMAGE_HEADER_BYTES, recognizeEspImage } from "./espImage.js";
import { ESP_IMAGE_SEGMENT_HEADER_BYTES, offsetText, u16, u32, } from "./espImageStructures.js";
/** Bytes that recognition needs at a candidate bootloader offset. */
export const ESP_BOOTLOADER_PROBE_BYTES = 32;
/**
 * The bootloader is the ESP image at the flash address its chip's ROM loads
 * from (`ESP_ROM_BOOTLOADER_OFFSET_FLASH`). Without one, an image of a known
 * chip at another chip's ROM offset says the dump may not start where its
 * flash offset says, and an ESP8266 image says it is an ESP8266 dump.
 */
export const locateEspBootloader = (probes) => {
    const limitations = [];
    let misplacedImage;
    let esp8266 = false;
    for (const probe of probes) {
        const recognized = recognizeEspImage(probe.prefix, probe.available);
        if (recognized === "esp8266")
            esp8266 = true;
        if (recognized !== "esp-image")
            continue;
        const chipId = u16(probe.prefix, 12);
        const chip = espChipForId(chipId);
        if (chip?.romBootloaderOffset === probe.flashAddress)
            return {
                location: {
                    flashAddress: probe.flashAddress,
                    fileOffset: probe.fileOffset,
                    chip,
                },
                limitations: [],
                misplacedImage: undefined,
                esp8266: false,
            };
        if (chip !== undefined)
            misplacedImage ??= { chip, fileOffset: probe.fileOffset };
        limitations.push(chip === undefined
            ? `An ESP image at flash ${offsetText(probe.flashAddress)} has chip_id 0x${chipId.toString(16).padStart(4, "0")}, which is not in the chip table; it is not read as the bootloader.`
            : `An ${chip.target} image is at flash ${offsetText(probe.flashAddress)}, but its ROM loads the bootloader from ${offsetText(chip.romBootloaderOffset)}; the dump may not start at flash ${offsetText(probe.flashAddress - probe.fileOffset)}.`);
    }
    return {
        location: undefined,
        limitations,
        misplacedImage,
        esp8266,
    };
};
/**
 * The file offset just past the last segment of the image at `fileOffset`,
 * found by following its segment headers, or the file size when they run
 * past the end. No partition table lies before it.
 */
export const espImageSegmentsEnd = async (read, fileOffset, fileSize) => {
    const header = await read(fileOffset, ESP_IMAGE_HEADER_BYTES);
    if (header.length < ESP_IMAGE_HEADER_BYTES)
        return fileSize;
    let cursor = fileOffset + ESP_IMAGE_HEADER_BYTES;
    for (let index = 0; index < (header[1] ?? 0); index += 1) {
        const segment = await read(cursor, ESP_IMAGE_SEGMENT_HEADER_BYTES);
        if (segment.length < ESP_IMAGE_SEGMENT_HEADER_BYTES)
            return fileSize;
        cursor += ESP_IMAGE_SEGMENT_HEADER_BYTES + u32(segment, 4);
        if (cursor >= fileSize)
            return fileSize;
    }
    return cursor;
};
/** The file offsets that hold each ROM bootloader offset, given the dump's origin. */
export const espBootloaderProbeOffsets = (flashOffset, fileSize) => ESP_ROM_BOOTLOADER_OFFSETS.map((flashAddress) => ({
    flashAddress,
    fileOffset: flashAddress - flashOffset,
})).filter(({ fileOffset }) => fileOffset >= 0 && fileOffset < fileSize);
