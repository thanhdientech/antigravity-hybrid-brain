import { observeMzWindowsHeader } from "./dosMz.js";
import { createHash } from "node:crypto";
import { readPeCoffHeader } from "./peCoffHeader.js";
import { readPeOptionalHeaderIdentity } from "./peOptionalHeader.js";
import { err, ok } from "./result.js";
/** Fixed compatibility contract shared by the artifact producer and readers. */
export const WINDOWS_NATIVE_ARTIFACT = {
    platform: "win32",
    architecture: "x64",
    abiVersion: 1,
    nodeApiVersion: 8,
    artifact: "rea-windows-x64.node",
};
export class WindowsNativeArtifactError extends Error {
    _tag = "WindowsNativeArtifactError";
}
/** Parse the exact package manifest before acquiring or loading its artifact. */
export const parseWindowsNativeManifest = (value, packageVersion) => {
    if (value === null || typeof value !== "object" || Array.isArray(value))
        return err(new WindowsNativeArtifactError("Windows native artifact manifest must be an object"));
    const manifest = value;
    const keys = [
        "packageVersion",
        ...Object.keys(WINDOWS_NATIVE_ARTIFACT),
        "artifactSha256",
    ];
    if (Object.keys(manifest).length !== keys.length ||
        keys.some((key) => !Object.hasOwn(manifest, key)))
        return err(new WindowsNativeArtifactError("Windows native artifact manifest has missing or unknown fields"));
    for (const [key, expected] of Object.entries(WINDOWS_NATIVE_ARTIFACT))
        if (manifest[key] !== expected)
            return err(new WindowsNativeArtifactError(`Windows native artifact manifest has an invalid ${key}`));
    if (typeof manifest.packageVersion !== "string")
        return err(new WindowsNativeArtifactError("Windows native artifact manifest has an invalid packageVersion"));
    if (typeof manifest.artifactSha256 !== "string" ||
        !/^[a-f0-9]{64}$/u.test(manifest.artifactSha256))
        return err(new WindowsNativeArtifactError("Windows native artifact manifest has an invalid artifactSha256"));
    if (manifest.packageVersion !== packageVersion)
        return err(new WindowsNativeArtifactError("Windows native artifact belongs to another REA version"));
    return ok({
        ...WINDOWS_NATIVE_ARTIFACT,
        packageVersion: manifest.packageVersion,
        artifactSha256: manifest.artifactSha256,
    });
};
const validateWindowsX64Artifact = (bytes) => {
    if (bytes.length < 64 || bytes.toString("latin1", 0, 2) !== "MZ")
        return err(new WindowsNativeArtifactError("Windows native artifact is not a PE image"));
    const observed = observeMzWindowsHeader(bytes);
    if (observed.state !== "declared" || observed.signature !== "PE")
        return err(new WindowsNativeArtifactError("Windows native artifact is not a Windows x64 PE32+ image"));
    const offset = observed.offset;
    const coff = readPeCoffHeader(bytes.subarray(offset + 4, offset + 24));
    if (!coff.ok ||
        coff.value.machine !== 0x8664 ||
        coff.value.optionalHeaderSize > bytes.length - offset - 24)
        return err(new WindowsNativeArtifactError("Windows native artifact is not a Windows x64 PE32+ image"));
    const optional = readPeOptionalHeaderIdentity(bytes.subarray(offset + 24, offset + 24 + coff.value.optionalHeaderSize));
    if (!optional.ok || optional.value.bits !== 64)
        return err(new WindowsNativeArtifactError("Windows native artifact is not a Windows x64 PE32+ image"));
    return ok(undefined);
};
/** Bind the parsed manifest to its exact bytes before native code can load. */
export const validateWindowsNativeArtifact = (manifest, bytes) => {
    if (createHash("sha256").update(bytes).digest("hex") !== manifest.artifactSha256)
        return err(new WindowsNativeArtifactError("Windows native artifact SHA-256 does not match package metadata"));
    return validateWindowsX64Artifact(bytes);
};
/** Produce metadata only for a Windows x64 PE32+ artifact. */
export const createWindowsNativeManifest = (packageVersion, bytes) => {
    const valid = validateWindowsX64Artifact(bytes);
    if (!valid.ok)
        return valid;
    return parseWindowsNativeManifest({
        ...WINDOWS_NATIVE_ARTIFACT,
        packageVersion,
        artifactSha256: createHash("sha256").update(bytes).digest("hex"),
    }, packageVersion);
};
