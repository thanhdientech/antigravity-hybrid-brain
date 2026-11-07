import { createHash } from "node:crypto";
import { readUniversalMachoImage, readUniversalMachoSlice, } from "../../domain/apple/machoImageSelection.js";
import { MACHO_CPU_TYPES, } from "../../domain/apple/machoTargetSelection.js";
import { AnalysisInputError } from "../../domain/analysisErrorCore.js";
import { err, ok } from "../../domain/result.js";
const cpuName = (cpuType, cpuSubtype) => {
    const name = Object.entries(MACHO_CPU_TYPES).find(([, type]) => type === cpuType)?.[0];
    const subtype = `0x${cpuSubtype.toString(16)}`;
    return name === undefined
        ? `cpu type 0x${cpuType.toString(16)} subtype ${subtype}`
        : `${name} (subtype ${subtype})`;
};
/**
 * Select the thin image to inspect without lipo. A universal Mach-O needs the
 * caller's architecture and yields exactly one validated slice; any other file
 * is returned whole and rejects an architecture rather than ignoring it.
 */
export const selectNativeImage = (bytes, architecture) => {
    const container = readUniversalMachoImage(bytes);
    if (!container.ok)
        return container;
    const fat = container.value;
    if (fat === null)
        return architecture === undefined
            ? ok({ bytes, fileOffset: 0, selection: null })
            : err({
                kind: "architecture",
                message: `architecture ${architecture} was selected, but the file is not a universal Mach-O; omit architecture.`,
            });
    const available = fat.slices
        .map(({ cpuType, cpuSubtype }) => cpuName(cpuType, cpuSubtype))
        .join(", ");
    if (architecture === undefined)
        return err({
            kind: "architecture",
            message: `Universal Mach-O holds ${available}; select one architecture.`,
        });
    const matches = fat.slices.filter(({ cpuType }) => cpuType === MACHO_CPU_TYPES[architecture]);
    const [slice] = matches;
    if (slice === undefined || matches.length > 1)
        return err({
            kind: "architecture",
            message: slice === undefined
                ? `Universal Mach-O holds ${available}, not ${architecture}.`
                : `Universal Mach-O holds several ${architecture} slices (${available}); no slice was selected.`,
        });
    const selected = readUniversalMachoSlice(bytes, fat, slice);
    if (!selected.ok)
        return selected;
    return ok({
        bytes: selected.value,
        fileOffset: slice.offset,
        selection: {
            kind: "macho-selected-image-v1",
            container: "fat",
            offset: slice.offset,
            byte_length: slice.size,
            cpu_type: slice.cpuType,
            cpu_subtype: slice.cpuSubtype,
            container_table_sha256: createHash("sha256")
                .update(bytes.subarray(0, fat.tableEnd))
                .digest("hex"),
        },
    });
};
/**
 * Select the image for one inspection, or fail with the input to correct:
 * `architecture` for a missing or mismatched selection, `path` for a malformed
 * universal container.
 */
export const requireSelectedNativeImage = (operation, path, bytes, architecture) => {
    const selected = selectNativeImage(bytes, architecture);
    if (selected.ok)
        return selected.value;
    const { kind, message } = selected.error;
    throw new AnalysisInputError(operation, undefined, [
        kind === "architecture"
            ? { path: ["architecture"], reason: "invalid_value", message }
            : {
                path: ["path"],
                reason: "invalid_format",
                message: `Selected artifact ${path}: ${message}`,
            },
    ]);
};
