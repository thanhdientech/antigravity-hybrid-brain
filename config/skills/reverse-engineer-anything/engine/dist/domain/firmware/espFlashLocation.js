import { err, ok } from "../result.js";
import { ESP_BOOTLOADER_PROBE_BYTES, espBootloaderProbeOffsets, espImageSegmentsEnd, locateEspBootloader, } from "./espFlashBootloader.js";
import { ESP8266_REFUSAL } from "./espImage.js";
import { offsetText } from "./espImageStructures.js";
import { ESP_PARTITION_TABLE_DEFAULT_OFFSET, ESP_PARTITION_TABLE_MAX_BYTES, ESP_PARTITION_TABLE_SECTOR_BYTES, decodeEspPartitionTable, } from "./espPartitionTable.js";
const SCAN_CHUNK_BYTES = 0x1_0000;
const MAGIC_LOW = 0xaa;
const MAGIC_HIGH = 0x50;
const tableAt = async (read, fileOffset) => decodeEspPartitionTable(await read(fileOffset, ESP_PARTITION_TABLE_MAX_BYTES));
/**
 * An image of a chip whose ROM loads the bootloader from flash `R`, at file
 * offset `F`, is the bootloader of a dump read from flash `R - F` when a
 * partition table sits where that origin puts the default table, at file
 * offset `0x8000 - (R - F)`, at or after the image's `end`. An ESP32 dump
 * read from `0x1000`, as `read-flash 0x1000 …` or
 * `merge-bin --target-offset 0x1000` writes it, has its bootloader at file
 * offset 0 and its table at `0x7000`.
 */
export const espFlashDumpOrigin = async (read, fileSize, image) => {
    const flashOffset = image.chip.romBootloaderOffset - image.fileOffset;
    const tableFileOffset = ESP_PARTITION_TABLE_DEFAULT_OFFSET - flashOffset;
    if (flashOffset <= 0 ||
        tableFileOffset < image.end ||
        tableFileOffset >= fileSize)
        return undefined;
    // As at the default offset, the MD5 need not verify: the layout reports a
    // mismatch, and the bootloader's rejection, as facts of the table.
    return (await tableAt(read, tableFileOffset)).ok
        ? { flashOffset, tableFileOffset }
        : undefined;
};
/**
 * The first table whose MD5 verifies at a flash sector boundary from the
 * file offset `start`; requiring the MD5 keeps arbitrary bytes that begin
 * with the magic from passing. Chunks start at sector boundaries, so each
 * holds whole sector heads.
 */
const scanForTable = async (read, { fileSize, origin, start, }, signal) => {
    const sector = ESP_PARTITION_TABLE_SECTOR_BYTES;
    // The file offset of the first sector boundary at or after `start`.
    const boundary = (sector - (origin % sector)) % sector;
    let position = start <= boundary
        ? boundary
        : boundary + Math.ceil((start - boundary) / sector) * sector;
    let chunkStart = position;
    let bytes = new Uint8Array(0);
    for (; position < fileSize; position += sector) {
        if (position - chunkStart + 2 > bytes.length) {
            signal?.throwIfAborted();
            chunkStart = position;
            bytes = await read(position, SCAN_CHUNK_BYTES);
        }
        const at = position - chunkStart;
        if (bytes[at] !== MAGIC_LOW || bytes[at + 1] !== MAGIC_HIGH)
            continue;
        const decoded = await tableAt(read, position);
        if (decoded.ok && decoded.value.md5.status === "valid")
            return { address: origin + position, table: decoded.value };
    }
    return undefined;
};
/**
 * Locate the bootloader and partition table: the caller's table offset
 * when given, else the default `0x8000`, else a scan of 0x1000-aligned
 * flash sectors for an MD5-verified table (a derived location). A table
 * never lies inside the located bootloader image. The scan runs only when a
 * bootloader sits at its chip's ROM offset or the caller selected this
 * format. Without a caller table offset, an ESP8266 image at a ROM offset
 * refuses the dump, and a known chip's image at another chip's ROM offset
 * refuses it as read from the wrong flash offset, given or default.
 */
export const locateEspFlashLayout = async (fileSize, read, selection, { explicit, signal, }) => {
    const origin = selection.flashOffset === undefined
        ? { value: 0, source: "default" }
        : { value: selection.flashOffset, source: "caller" };
    const probes = await Promise.all(espBootloaderProbeOffsets(origin.value, fileSize).map(async ({ flashAddress, fileOffset }) => ({
        flashAddress,
        fileOffset,
        prefix: await read(fileOffset, ESP_BOOTLOADER_PROBE_BYTES),
        available: fileSize - fileOffset,
    })));
    const bootloader = locateEspBootloader(probes);
    // Without a bootloader, nothing in the dump confirms a default origin.
    const unconfirmed = bootloader.location === undefined &&
        bootloader.misplacedImage === undefined &&
        origin.source === "default"
        ? [
            `No bootloader at a ROM offset confirms that the dump starts at flash ${offsetText(origin.value)}; each partition's file offset assumes it. Pass flash_offset if the dump starts elsewhere.`,
        ]
        : [];
    const located = (tableAddress, tableMethod, table) => ok({
        origin,
        bootloader: bootloader.location,
        tableAddress,
        tableMethod,
        table,
        limitations: [...bootloader.limitations, ...unconfirmed],
    });
    const fileOffsetOf = (address) => address - origin.value;
    if (selection.partitionTableOffset !== undefined) {
        const address = selection.partitionTableOffset;
        if (fileOffsetOf(address) < 0 || fileOffsetOf(address) >= fileSize)
            return err(`the partition table offset ${offsetText(address)} is outside the dump, which holds flash ${offsetText(origin.value)}-${offsetText(origin.value + fileSize)}`);
        const decoded = await tableAt(read, fileOffsetOf(address));
        return decoded.ok
            ? located(address, "caller", decoded.value)
            : err(`no partition table at the given offset ${offsetText(address)}: ${decoded.error}`);
    }
    if (bootloader.location === undefined && bootloader.esp8266)
        return err(ESP8266_REFUSAL);
    // A table found at an origin the bootloader contradicts would place every
    // partition at the wrong file offset.
    const misplaced = bootloader.misplacedImage;
    if (bootloader.location === undefined && misplaced !== undefined) {
        const implied = await espFlashDumpOrigin(read, fileSize, {
            ...misplaced,
            end: await espImageSegmentsEnd(read, misplaced.fileOffset, fileSize),
        });
        return err(`${bootloader.limitations.join(" ")} ${implied === undefined
            ? "Pass the flash_offset where the dump starts, or partition_table_offset"
            : `A partition table at file offset ${offsetText(implied.tableFileOffset)} shows the dump was read from flash ${offsetText(implied.flashOffset)}; pass flash_offset ${offsetText(implied.flashOffset)}`}`);
    }
    const imageEnd = bootloader.location === undefined
        ? 0
        : await espImageSegmentsEnd(read, bootloader.location.fileOffset, fileSize);
    const defaultOffset = fileOffsetOf(ESP_PARTITION_TABLE_DEFAULT_OFFSET);
    if (defaultOffset >= imageEnd && defaultOffset < fileSize) {
        const decoded = await tableAt(read, defaultOffset);
        if (decoded.ok)
            return located(ESP_PARTITION_TABLE_DEFAULT_OFFSET, "default", decoded.value);
    }
    if (bootloader.location === undefined && !explicit)
        return err([
            `no partition table at ${offsetText(ESP_PARTITION_TABLE_DEFAULT_OFFSET)} and no bootloader at a ROM offset`,
            ...bootloader.limitations,
        ].join("; "));
    const scanned = await scanForTable(read, { fileSize, origin: origin.value, start: imageEnd }, signal);
    return scanned === undefined
        ? err(`no partition table at ${offsetText(ESP_PARTITION_TABLE_DEFAULT_OFFSET)} or in any 0x1000-aligned flash sector${bootloader.location === undefined ? "" : " after the bootloader image"} with a verified MD5; flash encryption is one cause`)
        : located(scanned.address, "scan", scanned.table);
};
