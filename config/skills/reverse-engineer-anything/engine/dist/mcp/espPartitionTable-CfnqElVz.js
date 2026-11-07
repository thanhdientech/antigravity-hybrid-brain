import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { _s as u16, cs as cString, gs as offsetText, hs as init_espImageStructures, ls as cStringBytes, ms as hex, vs as u32 } from "./toolOutputSchemaGroups-3HUmDmX5.js";
import { createHash } from "node:crypto";

//#region dist/domain/firmware/espPartitionTable.js
var ESP_PARTITION_TABLE_DEFAULT_OFFSET, ESP_PARTITION_TABLE_SECTOR_BYTES, ESP_PARTITION_TABLE_MAX_BYTES, ENTRY_BYTES, MAX_ENTRIES, PARTITION_MAGIC, MD5_MAGIC, END_MAGIC, END_TYPE, MD5_DIGEST_OFFSET, KNOWN_FLAGS, partition, decodeEspPartitionTable, TYPE_NAMES, SUBTYPE_NAMES, espPartitionTypeName, espPartitionSubtypeName, APP_TYPE, OTA_DATA_SUBTYPE, DATA_TYPE, BOOTLOADER_TYPE, PARTITION_TABLE_TYPE, PRIMARY_SUBTYPE, OTA_APP_SUBTYPE_FLAG, OTA_APP_SUBTYPE_MASK, espOtaAppSlot, isEspFactoryApp, isEspOtaData, isEspAppPartition, espPrimaryLayoutRole, espBootPartitions;
function init_espPartitionTable() {
	return (init_espPartitionTable = __esmMin((() => {
		init_result();
		init_espImageStructures();
		ESP_PARTITION_TABLE_DEFAULT_OFFSET = 32768;
		ESP_PARTITION_TABLE_SECTOR_BYTES = 4096;
		ESP_PARTITION_TABLE_MAX_BYTES = 3072;
		ENTRY_BYTES = 32;
		MAX_ENTRIES = ESP_PARTITION_TABLE_MAX_BYTES / ENTRY_BYTES;
		PARTITION_MAGIC = 20650;
		MD5_MAGIC = 60395;
		END_MAGIC = 65535;
		END_TYPE = 255;
		MD5_DIGEST_OFFSET = 16;
		KNOWN_FLAGS = 3;
		partition = (entry, index, entryOffset) => {
			const flags = u32(entry, 28);
			const labelBytes = entry.subarray(12, 28);
			const label = cString(labelBytes);
			return {
				index,
				entryOffset,
				type: entry[2] ?? 0,
				subtype: entry[3] ?? 0,
				offset: u32(entry, 4),
				size: u32(entry, 8),
				label,
				labelHex: label === null ? hex(cStringBytes(labelBytes)) : null,
				encrypted: (flags & 1) !== 0,
				readonly: (flags & 2) !== 0,
				unknownFlags: (flags & ~KNOWN_FLAGS) >>> 0
			};
		};
		decodeEspPartitionTable = (bytes) => {
			const partitions = [];
			const limitations = [];
			let md5 = {
				status: "absent",
				entryOffset: null,
				stored: null,
				computed: null
			};
			for (let slot = 0; slot < MAX_ENTRIES; slot += 1) {
				const at = slot * ENTRY_BYTES;
				const entry = bytes.subarray(at, at + ENTRY_BYTES);
				if (entry.length < ENTRY_BYTES) return err(`the bytes end at ${offsetText(at + entry.length)}, inside entry ${String(slot)}`);
				const magic = u16(entry, 0);
				if (magic === PARTITION_MAGIC) {
					partitions.push(partition(entry, partitions.length, at));
					continue;
				}
				if (magic === MD5_MAGIC) {
					const computed = createHash("md5").update(bytes.subarray(0, at)).digest("hex");
					const stored = hex(entry.subarray(MD5_DIGEST_OFFSET, ENTRY_BYTES));
					if (md5.status !== "absent") {
						limitations.push(`The partition table has a second MD5 entry at ${offsetText(at)}; ESP-IDF allows one and rejects the table.`);
						md5 = {
							...md5,
							status: "invalid"
						};
						continue;
					}
					md5 = {
						status: stored === computed ? "valid" : "invalid",
						entryOffset: at,
						stored,
						computed
					};
					if (stored !== computed) limitations.push(`The partition table MD5 at ${offsetText(at)} does not match the entries before it; ESP-IDF's bootloader rejects the table.`);
					continue;
				}
				const terminator = magic === END_MAGIC && entry[2] === END_TYPE && entry[3] === END_TYPE;
				if (terminator && partitions.length > 0) return ok({
					partitions,
					md5,
					length: at + ENTRY_BYTES,
					limitations
				});
				return err(slot === 0 && magic === END_MAGIC ? "the first entry is empty" : terminator ? `entry ${String(slot)} at ${offsetText(at)} ends the table before any partition entry` : `entry ${String(slot)} at ${offsetText(at)} has magic ${offsetText(magic)}, not a partition, MD5 or terminating entry`);
			}
			return err(`no terminating entry within ${String(MAX_ENTRIES)} entries (${offsetText(ESP_PARTITION_TABLE_MAX_BYTES)} bytes)`);
		};
		TYPE_NAMES = {
			0: "app",
			1: "data",
			2: "bootloader",
			3: "partition_table"
		};
		SUBTYPE_NAMES = {
			0: {
				0: "factory",
				32: "test",
				...Object.fromEntries(Array.from({ length: 16 }, (_, slot) => [16 + slot, `ota_${String(slot)}`])),
				48: "tee_0",
				49: "tee_1"
			},
			1: {
				0: "ota",
				1: "phy",
				2: "nvs",
				3: "coredump",
				4: "nvs_keys",
				5: "efuse",
				6: "undefined",
				128: "esphttpd",
				129: "fat",
				130: "spiffs",
				131: "littlefs",
				144: "tee_ota"
			},
			2: {
				0: "primary",
				1: "ota",
				2: "recovery"
			},
			3: {
				0: "primary",
				1: "ota"
			}
		};
		espPartitionTypeName = (type) => TYPE_NAMES[type] ?? null;
		espPartitionSubtypeName = (type, subtype) => SUBTYPE_NAMES[type]?.[subtype] ?? null;
		APP_TYPE = 0;
		OTA_DATA_SUBTYPE = 0;
		DATA_TYPE = 1;
		BOOTLOADER_TYPE = 2;
		PARTITION_TABLE_TYPE = 3;
		PRIMARY_SUBTYPE = 0;
		OTA_APP_SUBTYPE_FLAG = 16;
		OTA_APP_SUBTYPE_MASK = 15;
		espOtaAppSlot = (part) => part.type === APP_TYPE && (part.subtype & ~OTA_APP_SUBTYPE_MASK) === OTA_APP_SUBTYPE_FLAG ? part.subtype & OTA_APP_SUBTYPE_MASK : null;
		isEspFactoryApp = (part) => part.type === APP_TYPE && part.subtype === 0;
		isEspOtaData = (part) => part.type === DATA_TYPE && part.subtype === OTA_DATA_SUBTYPE;
		isEspAppPartition = (part) => part.type === APP_TYPE;
		espPrimaryLayoutRole = (part) => {
			if (part.subtype !== PRIMARY_SUBTYPE) return undefined;
			if (part.type === BOOTLOADER_TYPE) return "bootloader";
			return part.type === PARTITION_TABLE_TYPE ? "partition-table" : undefined;
		};
		espBootPartitions = (partitions) => {
			let factory;
			let otadata;
			let otaAppCount = 0;
			const otaSlots = new Map();
			const roles = new Map();
			for (const part of partitions) {
				const slot = espOtaAppSlot(part);
				const role = isEspFactoryApp(part) ? "factory" : isEspOtaData(part) ? "otadata" : slot === null ? undefined : `ota_${String(slot)}`;
				if (role === undefined) continue;
				roles.set(role, [...roles.get(role) ?? [], part]);
				if (role === "factory") factory = part;
				else if (role === "otadata") otadata = part;
				else if (slot !== null) {
					otaSlots.set(slot, part);
					otaAppCount += 1;
				}
			}
			const limitations = [...roles].flatMap(([role, parts]) => parts.length < 2 ? [] : [`The table declares ${role} ${String(parts.length)} times (partitions ${parts.map(({ index }) => `#${String(index)}`).join(", ")}); ESP-IDF's bootloader uses the last.`]);
			return {
				factory,
				otadata,
				otaSlots,
				otaAppCount,
				limitations
			};
		};
	})))();
}

//#endregion
export { espBootPartitions as a, espPrimaryLayoutRole as c, decodeEspPartitionTable as i, init_espPartitionTable as l, ESP_PARTITION_TABLE_MAX_BYTES as n, espPartitionSubtypeName as o, ESP_PARTITION_TABLE_SECTOR_BYTES as r, espPartitionTypeName as s, ESP_PARTITION_TABLE_DEFAULT_OFFSET as t, isEspAppPartition as u };