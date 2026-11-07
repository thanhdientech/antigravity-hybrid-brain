import { espChipForId } from "../domain/firmware/espChips.js";
import { espFlashDumpOrigin, } from "../domain/firmware/espFlashLocation.js";
import { createEspImageDecoder, } from "../domain/firmware/espImage.js";
import { ESP_IMAGE_LIMITATIONS, } from "../domain/firmware/espImageFacts.js";
import { ESP_SIGNATURE_BLOCK_BYTES, offsetText, } from "../domain/firmware/espImageStructures.js";
import { ArtifactReaderFailure } from "./ArtifactReader.js";
import { readEspFlashRange } from "./EspFlashRegionReads.js";
import { PositionalArtifactReader, } from "./PositionalArtifactReader.js";
import { readFileHandleChunks } from "../filesystem/readFileHandleChunks.js";
const LABEL = "ESP image";
/**
 * Inventory one ESP32-family image as its header-declared segments and
 * Secure Boot v2 signature blocks. Decoding reads the file once; each entry
 * is a positional read of the carrier, rechecked against its identity.
 */
export class EspImageArtifactReader extends PositionalArtifactReader {
    format = "esp-image";
    #metadata;
    constructor(path, admitted) {
        super(path, LABEL, admitted);
    }
    formatMetadata() {
        return this.#metadata === undefined
            ? undefined
            : structuredClone(this.#metadata);
    }
    async prepareEntries(signal) {
        const image = await this.#decode(signal);
        const entries = [];
        for (const segment of image.segments) {
            const { index, data_len } = segment.metadata;
            const entry = {
                path: `segment-${String(index).padStart(2, "0")}.bin`,
                kind: "file",
                declaredSize: segment.availableLength,
                compressedSize: null,
                executable: false,
                encrypted: false,
                byteOffset: segment.dataOffset,
                declaredIntegrity: null,
                unpacked: false,
                limitations: segment.availableLength < data_len
                    ? [
                        ESP_IMAGE_LIMITATIONS.segmentEntryTruncated(index, data_len, segment.availableLength),
                    ]
                    : [],
                adapterKey: `esp-image:segment:${String(index)}`,
                formatMetadata: { ...segment.metadata },
            };
            entries.push(entry);
        }
        for (const block of image.signatureBlocks) {
            const entry = {
                path: `signature-block-${String(block.metadata.index)}.bin`,
                kind: "file",
                declaredSize: ESP_SIGNATURE_BLOCK_BYTES,
                compressedSize: null,
                executable: false,
                encrypted: false,
                byteOffset: block.offset,
                declaredIntegrity: null,
                unpacked: false,
                limitations: [],
                adapterKey: `esp-image:signature-block:${String(block.metadata.index)}`,
                formatMetadata: { ...block.metadata },
            };
            entries.push(entry);
        }
        const dump = await this.#flashDump(image, signal);
        this.#metadata = {
            ...image.metadata,
            flash_dump: dump === undefined
                ? null
                : {
                    flash_offset: dump.flashOffset,
                    table_file_offset: dump.tableFileOffset,
                },
        };
        const limitations = [
            ...image.limitations,
            ...(dump === undefined ? [] : [flashDumpLimitation(image, dump)]),
        ];
        return {
            entries,
            coverage: image.coverage === "unknown" || limitations.length > 0
                ? { status: image.coverage, limitations }
                : undefined,
        };
    }
    /**
     * Whether this image is the bootloader at the start of a flash dump read
     * from a later flash address. An app carries `esp_app_desc_t` and is not.
     */
    async #flashDump(image, signal) {
        const chip = espChipForId(image.metadata.header.chip_id);
        if (chip === undefined ||
            chip.romBootloaderOffset === 0 ||
            image.metadata.descriptor?.kind === "app")
            return undefined;
        this.assertOpen(signal);
        const { handle, initial } = await this.verifyCarrier(signal);
        const context = { handle, fileSize: initial.size, signal };
        return espFlashDumpOrigin((position, length) => readEspFlashRange(context, position, length), initial.size, 
        // A truncated image has no end, so no table can follow it.
        { chip, fileOffset: 0, end: image.metadata.image_end ?? initial.size });
    }
    /** Stream the carrier once, stopping when later bytes cannot matter. */
    async #decode(signal) {
        const { handle, initial } = await this.verifyCarrier(signal);
        const decoder = createEspImageDecoder(initial.size);
        if (initial.size > 0)
            for await (const chunk of readFileHandleChunks(handle, {
                end: initial.size - 1,
                signal,
                cancellationFailure: (reason) => new ArtifactReaderFailure("cancelled", `${LABEL} read cancelled`, {
                    cause: reason,
                }),
            })) {
                this.assertOpen(signal);
                decoder.write(chunk);
                if (decoder.satisfied)
                    break;
            }
        // A changed carrier is an identity failure, not a malformed image.
        await this.verifyCarrier(signal);
        const image = decoder.finish();
        if (!image.ok)
            throw decodeFailure(image.error);
        return image.value;
    }
}
const flashDumpLimitation = (image, dump) => `This file looks like a flash dump read from flash ${offsetText(dump.flashOffset)}, not one ESP image: its ${image.metadata.chip?.target ?? "ESP"} image at file offset 0 is where the ROM loads the bootloader from ${offsetText(dump.flashOffset)}, and a partition table sits at file offset ${offsetText(dump.tableFileOffset)}, which is flash 0x8000 from that origin. Reopen it with format esp-flash-image and flash_offset ${offsetText(dump.flashOffset)}.`;
const decodeFailure = (failure) => failure.kind === "unsupported"
    ? new ArtifactReaderFailure("unavailable", failure.message)
    : new ArtifactReaderFailure("format", `${LABEL} is malformed: ${failure.message}`);
