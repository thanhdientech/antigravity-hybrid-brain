import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { init_machoCpuIdentity, machoArchitectureName } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { JVM_CLASS_IDENTITY_LIMIT_REASON, MAX_JVM_CLASS_IDENTITY_BYTES, MachoLoadCommandCursor, classifyFatContainerIdentity, findOverlappingFatSlices, hasMachoMagic, init_jvmClassFile, init_machoContainer, init_machoLoadCommands, readFatContainerHeader, readFatHeaderPrefix, readFatSliceDeclarations, readMachoCommandStringBytes, readMachoHeaderDeclarations, readMachoHeaderPrefixFacts, validateFatSlice, validateFatSliceIdentity } from "./machoLoadCommands-B9RyDzRE.js";

//#region dist/domain/apple/machoSegmentHeader.js
var readMachoSegmentHeader, admitMachoSegmentMapping;
function init_machoSegmentHeader() {
	return (init_machoSegmentHeader = __esmMin((() => {
		init_result();
		readMachoSegmentHeader = (bytes, wide, littleEndian) => {
			const headerSize = wide ? 72 : 56;
			if (bytes.byteLength < headerSize) return err({
				kind: "malformed",
				message: "Mach-O segment header is truncated"
			});
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const word = (offset) => wide ? view.getBigUint64(offset, littleEndian) : BigInt(view.getUint32(offset, littleEndian));
			return ok({
				headerSize,
				nameBytes: Buffer.from(bytes.subarray(8, 24)),
				address: word(24),
				memorySize: word(wide ? 32 : 28),
				fileOffset: word(wide ? 40 : 32),
				fileSize: word(wide ? 48 : 36),
				maxProtection: view.getUint32(wide ? 56 : 40, littleEndian),
				protection: view.getUint32(wide ? 60 : 44, littleEndian),
				sectionCount: view.getUint32(wide ? 64 : 48, littleEndian)
			});
		};
		admitMachoSegmentMapping = (segment, bits) => {
			const unmapped = segment.memorySize === 0n && segment.protection === 0;
			return !unmapped && segment.fileSize > segment.memorySize || segment.address + segment.memorySize > 1n << BigInt(bits) ? err({
				kind: "malformed",
				message: "Mach-O segment addresses or sizes are invalid"
			}) : ok({ unmapped });
		};
	})))();
}

//#endregion
//#region dist/domain/apple/machoDylibCommand.js
var DEPENDENCY_COMMANDS, machoDependencyCommand, readMachoDylibCommandFacts;
function init_machoDylibCommand() {
	return (init_machoDylibCommand = __esmMin((() => {
		init_result();
		init_machoLoadCommands();
		DEPENDENCY_COMMANDS = new Map([
			[12, "LC_LOAD_DYLIB"],
			[2147483672, "LC_LOAD_WEAK_DYLIB"],
			[2147483679, "LC_REEXPORT_DYLIB"],
			[32, "LC_LAZY_LOAD_DYLIB"],
			[2147483683, "LC_LOAD_UPWARD_DYLIB"]
		]);
		machoDependencyCommand = (code) => DEPENDENCY_COMMANDS.get(code) ?? null;
		readMachoDylibCommandFacts = (body, littleEndian) => {
			if (body.byteLength < 24) return err({
				_tag: "InvalidMachoDylibCommand",
				reason: "truncated-header"
			});
			const name = readMachoCommandStringBytes(body, 24, littleEndian);
			if (!name.ok) return name;
			const view = new DataView(body.buffer, body.byteOffset, body.byteLength);
			const timestampOrMarker = view.getUint32(12, littleEndian);
			const usesFlags = name.value.offset === 28 && body.byteLength >= 28 && timestampOrMarker === 443815936;
			return ok({
				encoding: usesFlags ? "dylib_use_command" : "dylib_command",
				flags: usesFlags ? view.getUint32(24, littleEndian) : null,
				currentVersion: view.getUint32(16, littleEndian),
				compatibilityVersion: view.getUint32(20, littleEndian),
				timestampOrMarker,
				nameOffset: name.value.offset,
				nameBytes: name.value.bytes
			});
		};
	})))();
}

//#endregion
//#region dist/domain/apple/machoPlatform.js
var legacyMachoPlatform;
function init_machoPlatform() {
	return (init_machoPlatform = __esmMin((() => {
		legacyMachoPlatform = (platform, cpuType) => {
			if (platform === 3) return cpuType === 16777223 ? 8 : 3;
			if (cpuType === 7 || cpuType === 16777223) {
				if (platform === 2) return 7;
				if (platform === 4) return 9;
			}
			return platform;
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/MachoLoadCommandReader.js
var MAX_LOAD_COMMAND_BYTES, MAX_LAZY_INFO_DEPENDENCIES, MAX_LAZY_INFO_SYMBOL_REFERENCES, LC_SEGMENT, LC_SEGMENT_64, LC_ID_DYLIB, LC_LAZY_LOAD_DYLIB_INFO, LC_RPATH, LC_DYLD_ENVIRONMENT, LC_CODE_SIGNATURE, LC_BUILD_VERSION, CPU_TYPE_ARM64, VERSION_MIN_PLATFORMS, LAZY_INFO_HEADER_BYTES, LAZY_INFO_MAY_BE_MISSING, LAZY_INFO_MIN_VM_OFFSET, DYLIB_USE_WEAK_LINK, DYLIB_USE_REEXPORT, DYLIB_USE_UPWARD, DYLIB_USE_DELAYED_INIT, MachoFormatIssue, readMachoContainer, readSliceMagic, observesMachoSlice, readMachoImage, rangeValidSlices, overlapReason, readAppleHiddenArm64Row, readHiddenSlice, readFatSlices, readSliceCommandTable, failed, frameLoadCommands, readSlice, maximumVmOffset, readSegmentSpan, containedPayload, appendDependencies, decodeCommand, decodeLazyLoadDylibInfoCommand, readLazyPayloadBytes, readLazyLoadDylibInfo, decodeLazyLoadDylibInfoPayload, chargeLazyString, payloadString, decodeDependency, commandString, throwCommandStringIssue, decodeCommandString, readExact, fileTypeName, version, viewOf;
function init_MachoLoadCommandReader() {
	return (init_MachoLoadCommandReader = __esmMin((() => {
		init_machoDylibCommand();
		init_machoSegmentHeader();
		init_machoLoadCommands();
		init_jvmClassFile();
		init_machoCpuIdentity();
		init_machoPlatform();
		init_machoContainer();
		MAX_LOAD_COMMAND_BYTES = 16 * 1024 * 1024;
		MAX_LAZY_INFO_DEPENDENCIES = 1024;
		MAX_LAZY_INFO_SYMBOL_REFERENCES = 64 * 1024;
		LC_SEGMENT = 1;
		LC_SEGMENT_64 = 25;
		LC_ID_DYLIB = 13;
		LC_LAZY_LOAD_DYLIB_INFO = 58;
		LC_RPATH = 2147483676;
		LC_DYLD_ENVIRONMENT = 39;
		LC_CODE_SIGNATURE = 29;
		LC_BUILD_VERSION = 50;
		CPU_TYPE_ARM64 = 16777228;
		VERSION_MIN_PLATFORMS = new Map([
			[36, 1],
			[37, 2],
			[47, 3],
			[48, 4]
		]);
		LAZY_INFO_HEADER_BYTES = 24;
		LAZY_INFO_MAY_BE_MISSING = 1;
		LAZY_INFO_MIN_VM_OFFSET = 16384n;
		DYLIB_USE_WEAK_LINK = 1;
		DYLIB_USE_REEXPORT = 2;
		DYLIB_USE_UPWARD = 4;
		DYLIB_USE_DELAYED_INIT = 8;
		MachoFormatIssue = class extends Error {
			status;
			constructor(status, message) {
				super(message);
				this.status = status;
			}
		};
		readMachoContainer = async (readAt, size) => {
			const head = await readAt(0, Math.min(size, 8));
			if (head.byteLength < 8) return hasMachoMagic(head) ? {
				kind: "issue",
				status: "malformed",
				reason: "Mach-O header is truncated"
			} : { kind: "not-mach-o" };
			const fatPrefix = readFatHeaderPrefix(head);
			const mayBeJvmClass = fatPrefix.state === "parsed" && !fatPrefix.wide && !fatPrefix.littleEndian;
			let header;
			if (mayBeJvmClass && size <= 16777216) {
				const complete = await readAt(0, size);
				header = complete.byteLength === size ? readFatContainerHeader(complete, size) : readFatContainerHeader(head, size);
			} else header = readFatContainerHeader(head, size);
			if (header.state !== "not-fat") {
				if (header.state === "needs-data") {
					header = readFatContainerHeader(await readAt(0, header.requiredBytes), size);
				}
				if (header.state === "not-fat") return { kind: "not-mach-o" };
				if (header.state === "needs-data") return {
					kind: "issue",
					status: "malformed",
					reason: "FAT table is truncated"
				};
				if (header.state === "malformed") return {
					kind: "issue",
					status: "malformed",
					reason: header.reason
				};
				let identity = classifyFatContainerIdentity(header, () => undefined);
				if (identity.state === "needs-slice-header") {
					const sliceHeaders = new Map();
					for (const offset of identity.offsets) sliceHeaders.set(offset, await readSliceMagic(readAt, offset));
					identity = classifyFatContainerIdentity(header, (offset) => sliceHeaders.get(offset));
				}
				if (identity.state === "not-mach-o" || identity.state === "needs-slice-header") return { kind: "not-mach-o" };
				if (identity.state === "malformed" && mayBeJvmClass && size > 16777216 && !await observesMachoSlice(readAt, header)) return {
					kind: "issue",
					status: "unsupported",
					reason: JVM_CLASS_IDENTITY_LIMIT_REASON
				};
				const overlap = findOverlappingFatSlices(rangeValidSlices(header));
				if (overlap !== null) return {
					kind: "issue",
					status: "malformed",
					reason: overlapReason(overlap)
				};
				return {
					kind: "fat",
					header,
					hidden: await readAppleHiddenArm64Row(readAt, size, header)
				};
			}
			const thin = readMachoHeaderPrefixFacts(head).format;
			if (thin?.littleEndian === true) return {
				kind: "thin",
				size
			};
			if (thin !== null) return {
				kind: "issue",
				status: "unsupported",
				reason: "big-endian Mach-O images are not supported"
			};
			return { kind: "not-mach-o" };
		};
		readSliceMagic = async (readAt, offset) => {
			const bytes = await readAt(offset, 4);
			return bytes.byteLength < 4 ? null : viewOf(bytes).getUint32(0, false);
		};
		observesMachoSlice = async (readAt, header) => {
			for (const [index, slice] of header.slices.entries()) if (header.rangeIssues[index] === null && readMachoHeaderPrefixFacts(await readAt(slice.offset, 4)).format !== null) return true;
			return false;
		};
		readMachoImage = async (readAt, size) => {
			try {
				const container = await readMachoContainer(readAt, size);
				if (container.kind === "not-mach-o") return { status: "not-mach-o" };
				if (container.kind === "issue") return {
					status: container.status,
					reason: container.reason
				};
				if (container.kind === "thin") return {
					status: "parsed",
					slices: [await readSlice(readAt, 0, size)]
				};
				const { header } = container;
				const rangeIssue = header.rangeIssues.find((issue) => issue !== null);
				if (rangeIssue !== undefined) return {
					status: rangeIssue.category,
					reason: rangeIssue.reason
				};
				const hiddenSlice = await readHiddenSlice(readAt, container.hidden);
				return {
					status: "parsed",
					slices: await readFatSlices(readAt, header.slices),
					...hiddenSlice === null ? {} : { hiddenSlices: [hiddenSlice] }
				};
			} catch (cause) {
				if (cause instanceof MachoFormatIssue) return {
					status: cause.status,
					reason: cause.message
				};
				throw cause;
			}
		};
		rangeValidSlices = (header) => header.slices.filter((_, index) => header.rangeIssues[index] === null);
		overlapReason = (overlap) => `Mach-O slices ${overlap[0].index} and ${overlap[1].index} overlap.`;
		readAppleHiddenArm64Row = async (readAt, fileSize, header) => {
			if (header.wide) return null;
			const firstOffset = Math.min(...header.slices.map(({ offset }) => offset));
			const end = header.tableEnd + 20;
			if (end > fileSize || end > firstOffset) return null;
			const bytes = await readAt(header.tableEnd, 20);
			if (bytes.byteLength < 20) return {
				status: "malformed",
				reason: "Hidden ARM64 FAT row is truncated"
			};
			const row = readFatSliceDeclarations(bytes, {
				count: 1,
				wide: false,
				littleEndian: header.littleEndian
			});
			if (row.status !== "parsed") return {
				status: "malformed",
				reason: row.reason
			};
			const declaration = {
				...row.slices[0],
				index: header.count
			};
			if (declaration.cpuType !== CPU_TYPE_ARM64) return null;
			const overlap = findOverlappingFatSlices([...rangeValidSlices(header), declaration]);
			return {
				status: "declared",
				declaration,
				rangeIssue: overlap === null ? validateFatSlice(declaration, fileSize, end) : overlapReason(overlap)
			};
		};
		readHiddenSlice = async (readAt, row) => {
			if (row === null) return null;
			if (row.status !== "declared") throw new MachoFormatIssue(row.status, row.reason);
			const { declaration, rangeIssue } = row;
			if (rangeIssue !== null) throw new MachoFormatIssue("malformed", rangeIssue);
			const slice = await readSlice(readAt, declaration.offset, declaration.size, {
				fatCpuType: declaration.cpuType,
				fatCpuSubtype: declaration.cpuSubtype,
				alignmentExponent: declaration.alignmentExponent
			});
			const identityIssue = validateFatSliceIdentity(declaration, {
				cpuType: slice.cpu_type,
				cpuSubtype: slice.cpu_subtype
			});
			if (identityIssue !== null) throw new MachoFormatIssue("malformed", identityIssue);
			return {
				...slice,
				hidden: true
			};
		};
		readFatSlices = async (readAt, declarations) => {
			const slices = [];
			let unsupported;
			for (const declaration of declarations) {
				const { offset, size: length, cpuType, cpuSubtype } = declaration;
				let slice;
				try {
					slice = await readSlice(readAt, offset, length, {
						fatCpuType: cpuType,
						fatCpuSubtype: cpuSubtype,
						alignmentExponent: declaration.alignmentExponent
					});
				} catch (cause) {
					if (!(cause instanceof MachoFormatIssue) || cause.status !== "unsupported") throw cause;
					unsupported ??= cause;
					continue;
				}
				const identityIssue = validateFatSliceIdentity(declaration, {
					cpuType: slice.cpu_type,
					cpuSubtype: slice.cpu_subtype
				});
				if (identityIssue !== null) throw new MachoFormatIssue("malformed", identityIssue);
				slices.push(slice);
			}
			if (unsupported !== undefined) throw unsupported;
			return slices;
		};
		readSliceCommandTable = async (readAt, base, length) => {
			const headerBytes = await readAt(base, 28);
			const parsed = readMachoHeaderDeclarations(headerBytes, length);
			if (!parsed.ok) return failed("malformed", "Mach-O header is truncated", null);
			if (parsed.value === null) return failed("malformed", `slice at offset ${base} has no Mach-O header`, null);
			if (!parsed.value.littleEndian) return failed("unsupported", "big-endian Mach-O slices are not supported", null);
			const { wide, headerSize, commandCount, commandBytes, fileType, identity } = parsed.value;
			const header = {
				wide,
				headerSize,
				cpuType: identity.cpuType,
				cpuSubtype: identity.cpuSubtype,
				fileType,
				commandCount,
				commandBytes
			};
			if (header.commandBytes > 16777216) return failed("unsupported", `load commands occupy ${header.commandBytes} bytes, above the ${MAX_LOAD_COMMAND_BYTES}-byte limit`, header);
			if (header.headerSize + header.commandBytes > length) return failed("malformed", "load commands extend beyond the Mach-O slice", header);
			const bytes = await readAt(base + header.headerSize, header.commandBytes);
			if (bytes.byteLength < header.commandBytes) return failed("malformed", "load commands is truncated", header);
			return {
				status: "read",
				header,
				bytes
			};
		};
		failed = (status, reason, header) => ({
			status,
			reason,
			header
		});
		frameLoadCommands = ({ header, bytes }, visit) => {
			const cursor = new MachoLoadCommandCursor({
				wide: header.wide,
				littleEndian: true,
				commandCount: header.commandCount,
				commandBytes: bytes.byteLength
			});
			while (cursor.nextOffset !== null) {
				const frame = cursor.read(bytes.subarray(cursor.nextOffset, cursor.nextOffset + 8));
				if (!frame.ok) return {
					status: "malformed",
					reason: frame.error
				};
				const { index, command, offset, size } = frame.value;
				visit({
					index,
					command,
					offset,
					body: bytes.subarray(offset, offset + size)
				});
			}
			const complete = cursor.finish();
			if (!complete.ok) return {
				status: "malformed",
				reason: complete.error
			};
			return { status: "framed" };
		};
		readSlice = async (readAt, base, length, fat = null) => {
			const table = await readSliceCommandTable(readAt, base, length);
			if (table.status !== "read") throw new MachoFormatIssue(table.status, table.reason);
			const { header } = table;
			const slice = {
				architecture: machoArchitectureName(header.cpuType, header.cpuSubtype),
				slice_offset: base,
				slice_size: length,
				cpu_type: header.cpuType,
				cpu_subtype: header.cpuSubtype,
				fat_cpu_type: fat?.fatCpuType ?? null,
				fat_cpu_subtype: fat?.fatCpuSubtype ?? null,
				fat_alignment_exponent: fat?.alignmentExponent ?? null,
				file_type: fileTypeName(header.fileType),
				file_type_code: header.fileType,
				platform: null,
				platforms: [],
				install_name: null,
				dependencies: [],
				rpaths: [],
				dyld_environment: [],
				code_signature_present: false
			};
			const dependencies = [];
			const segments = [];
			let unreadableSegment;
			let lazyInfoCount = 0;
			const framed = frameLoadCommands(table, ({ command, body, index }) => {
				if (command === LC_SEGMENT || command === LC_SEGMENT_64) {
					const span = readSegmentSpan(body, command === LC_SEGMENT_64);
					if (span === undefined) unreadableSegment ??= index;
					else segments.push(span);
				}
				if (command === LC_LAZY_LOAD_DYLIB_INFO) {
					lazyInfoCount += 1;
					if (lazyInfoCount > 1024) throw new MachoFormatIssue("unsupported", `LC_LAZY_LOAD_DYLIB_INFO commands exceed the ${MAX_LAZY_INFO_DEPENDENCIES}-dependency limit`);
				}
				const decoded = decodeCommand(command, body, index, slice);
				if (decoded !== undefined) dependencies.push(decoded);
			});
			if (framed.status !== "framed") throw new MachoFormatIssue(framed.status, framed.reason);
			if (lazyInfoCount > 0 && unreadableSegment !== undefined) throw new MachoFormatIssue("malformed", `load command ${unreadableSegment} is too short to establish the slice VM range for LC_LAZY_LOAD_DYLIB_INFO`);
			await appendDependencies(slice, dependencies, readAt, base, length, maximumVmOffset(segments));
			const distinctPlatforms = [...new Set(slice.platforms)];
			slice.platform = distinctPlatforms.length === 1 ? distinctPlatforms[0] ?? null : null;
			return slice;
		};
		maximumVmOffset = (segments) => {
			let textVmAddr = 0n;
			for (const segment of segments) {
				if (segment.name === "__TEXT") {
					textVmAddr = segment.vmaddr;
					break;
				}
			}
			let max = LAZY_INFO_MIN_VM_OFFSET;
			for (const segment of segments) {
				if (segment.name === "__LINKEDIT") continue;
				const end = segment.vmaddr - textVmAddr + segment.vmsize;
				if (end > max) max = end;
			}
			return max;
		};
		readSegmentSpan = (body, wide) => {
			const parsed = readMachoSegmentHeader(body, wide, true);
			if (!parsed.ok) return undefined;
			const { nameBytes, address: vmaddr, memorySize: vmsize } = parsed.value;
			const end = nameBytes.indexOf(0);
			return {
				name: new TextDecoder("utf-8", {
					fatal: false,
					ignoreBOM: true
				}).decode(end < 0 ? nameBytes : nameBytes.subarray(0, end)),
				vmaddr,
				vmsize
			};
		};
		containedPayload = (reads, fileOffset, size, work) => {
			for (const read of reads) {
				work.rangeChecks += 1;
				if (work.rangeChecks > 16777216) throw new MachoFormatIssue("unsupported", `LC_LAZY_LOAD_DYLIB_INFO payload range lookup exceeds the ${MAX_LOAD_COMMAND_BYTES}-check limit`);
				const start = fileOffset - read.fileOffset;
				if (start >= 0 && Number.isSafeInteger(start) && start + size <= read.bytes.byteLength) return read.bytes.subarray(start, start + size);
			}
			return undefined;
		};
		appendDependencies = async (slice, dependencies, readAt, base, length, maxVmOffset) => {
			const work = {
				dependencies: new Map(),
				reads: [],
				strings: new Map(),
				payloadBytes: 0,
				stringBytes: 0,
				symbolReferences: 0,
				rangeChecks: 0
			};
			for (const dependency of dependencies) {
				if (dependency.kind === "parsed") {
					slice.dependencies.push(dependency.value);
					continue;
				}
				const key = `${dependency.dataOffset}:${dependency.dataSize}`;
				const cached = work.dependencies.get(key);
				if (cached !== undefined) {
					slice.dependencies.push(cached);
					continue;
				}
				const value = await readLazyLoadDylibInfo(readAt, base, length, dependency, maxVmOffset, work);
				work.dependencies.set(key, value);
				slice.dependencies.push(value);
			}
		};
		decodeCommand = (command, body, index, slice) => {
			if (command === LC_ID_DYLIB) {
				slice.install_name = commandString(body, 24, index);
				return;
			}
			if (command === LC_RPATH) {
				slice.rpaths.push(commandString(body, 12, index));
				return;
			}
			if (command === LC_DYLD_ENVIRONMENT) {
				slice.dyld_environment.push(commandString(body, 12, index));
				return;
			}
			if (command === LC_CODE_SIGNATURE) {
				if (body.byteLength < 16) throw new MachoFormatIssue("malformed", `load command ${index} is too short for LC_CODE_SIGNATURE`);
				slice.code_signature_present = true;
				return;
			}
			if (command === LC_BUILD_VERSION) {
				if (body.byteLength < 24) throw new MachoFormatIssue("malformed", `load command ${index} is too short for LC_BUILD_VERSION`);
				const view = viewOf(body);
				const toolCount = view.getUint32(20, true);
				if (toolCount > Math.floor((body.byteLength - 24) / 8)) throw new MachoFormatIssue("malformed", `load command ${index} LC_BUILD_VERSION tool records exceed cmdsize`);
				const platform = view.getUint32(8, true);
				slice.platforms.push(platform);
				return;
			}
			const legacyPlatform = VERSION_MIN_PLATFORMS.get(command);
			if (legacyPlatform !== undefined) {
				if (body.byteLength < 16) throw new MachoFormatIssue("malformed", `load command ${index} is too short for a version-min command`);
				slice.platforms.push(legacyMachoPlatform(legacyPlatform, slice.cpu_type));
				return;
			}
			if (command === LC_LAZY_LOAD_DYLIB_INFO) return decodeLazyLoadDylibInfoCommand(body, index);
			const name = machoDependencyCommand(command);
			if (name !== null) return {
				kind: "parsed",
				value: decodeDependency(name, body, index)
			};
			return undefined;
		};
		decodeLazyLoadDylibInfoCommand = (body, index) => {
			if (body.byteLength < 16) throw new MachoFormatIssue("malformed", `load command ${index} is too short for LC_LAZY_LOAD_DYLIB_INFO`);
			const view = viewOf(body);
			const dataOffset = view.getUint32(8, true);
			const dataSize = view.getUint32(12, true);
			if (dataSize < LAZY_INFO_HEADER_BYTES) throw new MachoFormatIssue("malformed", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO payload is shorter than its 24-byte header`);
			if (dataSize > 16777216) throw new MachoFormatIssue("unsupported", `LC_LAZY_LOAD_DYLIB_INFO payload occupies ${dataSize} bytes, above the ${MAX_LOAD_COMMAND_BYTES}-byte limit`);
			return {
				kind: "lazy-info",
				index,
				dataOffset,
				dataSize
			};
		};
		readLazyPayloadBytes = async (readAt, fileOffset, size, index, work) => {
			const covered = containedPayload(work.reads, fileOffset, size, work);
			if (covered !== undefined) return covered;
			work.payloadBytes += size;
			if (work.payloadBytes > 16777216) throw new MachoFormatIssue("unsupported", `LC_LAZY_LOAD_DYLIB_INFO payloads occupy ${work.payloadBytes} bytes, above the ${MAX_LOAD_COMMAND_BYTES}-byte aggregate limit`);
			const payload = await readExact(readAt, fileOffset, size, `load command ${index} LC_LAZY_LOAD_DYLIB_INFO payload`);
			work.reads.push({
				fileOffset,
				bytes: payload
			});
			return payload;
		};
		readLazyLoadDylibInfo = async (readAt, base, length, command, maxVmOffset, work) => {
			if (command.dataOffset > length || command.dataSize > length - command.dataOffset) throw new MachoFormatIssue("malformed", `load command ${command.index} LC_LAZY_LOAD_DYLIB_INFO payload extends beyond the Mach-O slice`);
			const fileOffset = base + command.dataOffset;
			if (!Number.isSafeInteger(fileOffset)) throw new MachoFormatIssue("malformed", `load command ${command.index} LC_LAZY_LOAD_DYLIB_INFO payload offset is not a safe integer`);
			const payload = await readLazyPayloadBytes(readAt, fileOffset, command.dataSize, command.index, work);
			return decodeLazyLoadDylibInfoPayload(payload, command.index, fileOffset, maxVmOffset, work);
		};
		decodeLazyLoadDylibInfoPayload = (payload, index, fileOffset, maxVmOffset, work) => {
			const view = viewOf(payload);
			const pathOffset = view.getUint32(0, true);
			const flagImageOffset = view.getUint32(4, true);
			const flags = view.getUint16(8, true);
			const chainStartImageOffset = view.getUint32(12, true);
			const symbolCount = view.getUint32(16, true);
			const symbolArrayOffset = view.getUint32(20, true);
			if (BigInt(flagImageOffset) > maxVmOffset) throw new MachoFormatIssue("malformed", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO flag image offset 0x${flagImageOffset.toString(16)} is beyond the slice VM range 0x${maxVmOffset.toString(16)}`);
			if (BigInt(chainStartImageOffset) > maxVmOffset) throw new MachoFormatIssue("malformed", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO chain start image offset 0x${chainStartImageOffset.toString(16)} is beyond the slice VM range 0x${maxVmOffset.toString(16)}`);
			if ((flags & ~LAZY_INFO_MAY_BE_MISSING) !== 0) throw new MachoFormatIssue("unsupported", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO flags 0x${flags.toString(16)} include unrecognized bits`);
			if (symbolArrayOffset > payload.byteLength || symbolCount > (payload.byteLength - symbolArrayOffset) / 4) throw new MachoFormatIssue("malformed", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO symbol table extends beyond the payload`);
			const installName = payloadString(payload, pathOffset, fileOffset, index, "load path", work, true);
			const symbolReferences = work.symbolReferences + symbolCount;
			if (symbolReferences > 65536) throw new MachoFormatIssue("unsupported", `LC_LAZY_LOAD_DYLIB_INFO symbol validation exceeds the ${MAX_LAZY_INFO_SYMBOL_REFERENCES}-reference limit`);
			work.symbolReferences = symbolReferences;
			for (let symbol = 0; symbol < symbolCount; symbol += 1) {
				const offset = view.getUint32(symbolArrayOffset + symbol * 4, true);
				payloadString(payload, offset, fileOffset, index, `symbol ${symbol}`, work, false);
			}
			return {
				command: "LC_LAZY_LOAD_DYLIB_INFO",
				encoding: "lazy_load_dylib_info",
				install_name: installName,
				weak: (flags & LAZY_INFO_MAY_BE_MISSING) !== 0,
				upward: false,
				reexport: false,
				delayed_init: false,
				current_version: null,
				compatibility_version: null
			};
		};
		chargeLazyString = (work, examined) => {
			const occupied = work.stringBytes + examined;
			if (occupied > 16777216) throw new MachoFormatIssue("unsupported", `LC_LAZY_LOAD_DYLIB_INFO string validation occupies ${occupied} bytes, above the ${MAX_LOAD_COMMAND_BYTES}-byte limit`);
			work.stringBytes = occupied;
		};
		payloadString = (payload, offset, fileOffset, index, label, work, excludeFinalByte) => {
			if (offset < LAZY_INFO_HEADER_BYTES) throw new MachoFormatIssue("malformed", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO ${label} offset ${offset} is inside the payload header`);
			if (offset >= payload.byteLength) throw new MachoFormatIssue("malformed", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO ${label} offset ${offset} is outside the payload`);
			const absolute = Number.isSafeInteger(fileOffset + offset) ? fileOffset + offset : undefined;
			const cached = absolute === undefined ? undefined : work.strings.get(absolute);
			const terminatorLimit = excludeFinalByte ? payload.byteLength - 1 : payload.byteLength;
			if (cached !== undefined && absolute !== undefined) {
				const end = cached.end - fileOffset;
				if (end < offset || end >= terminatorLimit) throw new MachoFormatIssue("malformed", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO ${label} is unterminated`);
				chargeLazyString(work, cached.end - absolute + 1);
				return cached.text;
			}
			if (offset >= terminatorLimit) throw new MachoFormatIssue("malformed", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO ${label} is unterminated`);
			const remaining = MAX_LOAD_COMMAND_BYTES - work.stringBytes;
			const windowEnd = Math.min(terminatorLimit, offset + remaining);
			const end = payload.subarray(0, windowEnd).indexOf(0, offset);
			if (end < 0) {
				if (windowEnd < terminatorLimit) throw new MachoFormatIssue("unsupported", `LC_LAZY_LOAD_DYLIB_INFO string validation occupies ${work.stringBytes + (windowEnd - offset) + 1} bytes, above the ${MAX_LOAD_COMMAND_BYTES}-byte limit`);
				throw new MachoFormatIssue("malformed", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO ${label} is unterminated`);
			}
			chargeLazyString(work, end - offset + 1);
			let text;
			try {
				text = new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(payload.subarray(offset, end));
			} catch {
				throw new MachoFormatIssue("malformed", `load command ${index} LC_LAZY_LOAD_DYLIB_INFO ${label} is not UTF-8`);
			}
			if (absolute !== undefined && Number.isSafeInteger(fileOffset + end)) work.strings.set(absolute, {
				text,
				end: fileOffset + end
			});
			return text;
		};
		decodeDependency = (command, body, index) => {
			const parsed = readMachoDylibCommandFacts(body, true);
			if (!parsed.ok) {
				if (parsed.error._tag === "InvalidMachoDylibCommand") throw new MachoFormatIssue("malformed", `load command ${index} is too short for a dylib command`);
				return throwCommandStringIssue(parsed.error, index);
			}
			const facts = parsed.value;
			const flags = facts.flags ?? 0;
			return {
				command,
				encoding: facts.encoding,
				install_name: decodeCommandString(facts.nameBytes, index),
				weak: command === "LC_LOAD_WEAK_DYLIB" || (flags & DYLIB_USE_WEAK_LINK) !== 0,
				upward: command === "LC_LOAD_UPWARD_DYLIB" || (flags & DYLIB_USE_UPWARD) !== 0,
				reexport: command === "LC_REEXPORT_DYLIB" || (flags & DYLIB_USE_REEXPORT) !== 0,
				delayed_init: (flags & DYLIB_USE_DELAYED_INIT) !== 0,
				current_version: version(facts.currentVersion),
				compatibility_version: version(facts.compatibilityVersion)
			};
		};
		commandString = (body, minimumOffset, index) => {
			const parsed = readMachoCommandStringBytes(body, minimumOffset, true);
			if (!parsed.ok) return throwCommandStringIssue(parsed.error, index);
			return decodeCommandString(parsed.value.bytes, index);
		};
		throwCommandStringIssue = (failure, index) => {
			const reason = failure.reason === "truncated-offset" ? `load command ${index} is too short to hold a string offset` : failure.reason === "invalid-offset" ? `load command ${index} has string offset ${failure.offset} outside the command` : `load command ${index} has an unterminated string`;
			throw new MachoFormatIssue("malformed", reason);
		};
		decodeCommandString = (bytes, index) => {
			try {
				return new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(bytes);
			} catch {
				throw new MachoFormatIssue("malformed", `load command ${index} has a string that is not UTF-8`);
			}
		};
		readExact = async (readAt, offset, length, label) => {
			const bytes = await readAt(offset, length);
			if (bytes.byteLength < length) throw new MachoFormatIssue("malformed", `${label} is truncated`);
			return bytes;
		};
		fileTypeName = (fileType) => fileType === 2 ? "execute" : fileType === 6 ? "dylib" : fileType === 8 ? "bundle" : "other";
		version = (value) => `${value >>> 16}.${value >>> 8 & 255}.${value & 255}`;
		viewOf = (bytes) => new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	})))();
}

//#endregion
export { MAX_LOAD_COMMAND_BYTES, admitMachoSegmentMapping, frameLoadCommands, init_MachoLoadCommandReader, init_machoDylibCommand, init_machoPlatform, init_machoSegmentHeader, legacyMachoPlatform, machoDependencyCommand, readMachoContainer, readMachoDylibCommandFacts, readMachoImage, readMachoSegmentHeader, readSliceCommandTable };