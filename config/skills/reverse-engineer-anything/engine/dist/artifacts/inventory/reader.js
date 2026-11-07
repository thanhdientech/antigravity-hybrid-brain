import { artifactFormatDescriptor } from "../artifactFormats.js";
import { createArtifactReader } from "../createArtifactReader.js";
import { isZipPackageFormat, ZIP_NON_ENTRY_LIMITATION, } from "../../domain/zipPackageFormat.js";
export const createReader = (path, format, environment, readerAdmission, asarHeaderAdmission, selectedPath) => {
    if (artifactFormatDescriptor(format)?.requiresDarwin === true &&
        process.platform !== "darwin")
        return undefined;
    return createArtifactReader(path, format, {
        environment,
        unreadableDirectories: "omit",
        admission: readerAdmission,
        asarHeaderAdmission,
        selectedPath,
    });
};
/** Decide traversal scope and availability once, independently of diagnostic wording. */
export const inventoryCoverage = (format, reader, traversal) => {
    if (reader !== undefined)
        return {
            coverage: { scope: "container-entries", status: traversal.status },
            limitations: [
                ...(isZipPackageFormat(reader.format)
                    ? [ZIP_NON_ENTRY_LIMITATION]
                    : []),
                ...(artifactFormatDescriptor(reader.format)?.readerLimitation ===
                    undefined
                    ? []
                    : [artifactFormatDescriptor(reader.format).readerLimitation]),
                ...traversal.limitations,
            ],
        };
    const absent = artifactFormatDescriptor(format)?.absentInventory ?? "root";
    // dmg and pkg reach here only after classifyRootFormat matched their bytes.
    if (absent === "platform")
        return {
            coverage: { scope: "container-entries", status: "unknown" },
            limitations: [
                `${format.toUpperCase()} root hash is observed; child inventory requires a native macOS adapter.`,
            ],
        };
    if (absent === "universal")
        return {
            coverage: { scope: "container-entries", status: "unknown" },
            limitations: [
                "Universal Mach-O slices require the native macOS lipo adapter.",
            ],
        };
    if (absent === "unavailable")
        return {
            coverage: { scope: "container-entries", status: "unknown" },
            limitations: [`${format} child inventory reader is unavailable.`],
        };
    return {
        coverage: { scope: "root", status: "complete" },
        limitations: [
            "Inventory covers root bytes only; child container entries were not examined.",
        ],
    };
};
