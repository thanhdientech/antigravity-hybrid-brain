import { createHash } from "node:crypto";
import { z } from "zod";
import { jsonObjectSchema } from "../domain/jsonValue.js";
import { safeParseUtf8Json, } from "../domain/safeJson.js";
import { err, ok } from "../domain/result.js";
import { describeHopperRequestFailure, HOPPER_DOWNLOAD_BYTES, } from "./HopperDownload.js";
import { urlDeclaresQueryOrFragment } from "../domain/urlComponents.js";
/** Vendor endpoints, shared by installation and existing-build inspection. */
export const HOPPER_RELEASES_URL = "https://www.hopperapp.com/include/files-api.php?request=releases&public=true";
export const HOPPER_PUBLIC_KEY_URL = "https://www.hopperapp.com/hopper-public-key.asc";
export const HOPPER_DOWNLOAD_PREFIX = "https://www.hopperapp.com:443/downloader/public/";
/** Decode vendor/cache JSON while retaining their established initial UTF-8 BOM tolerance. */
export const parseHopperReleaseJson = (bytes) => safeParseUtf8Json(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf
    ? bytes.subarray(3)
    : bytes);
/** Package identity is shared by the platform-specific publisher verification workflows. */
export const hopperArchiveIntegrityMatches = (bytes, release) => bytes.byteLength === Number(release.file_length) &&
    bytes.byteLength <= HOPPER_DOWNLOAD_BYTES &&
    createHash("sha1").update(bytes).digest("hex") === release.file_hash;
const archiveReleaseSchema = z.object({
    filename: z.string().url(),
    file_length: z.string().regex(/^\d+$/u),
    file_hash: z.string().regex(/^[a-f0-9]{40}$/u),
});
const selectedPlatformsSchema = z.object({
    "OS X": z.unknown().optional(),
    "Ubuntu / Mint": z.unknown().optional(),
    Fedora: z.unknown().optional(),
    Arch: z.unknown().optional(),
});
/** Interpret channel identity once using the same URL semantics as the downloader. */
const isPublicHopperDownload = (url) => url.origin === "https://www.hopperapp.com" &&
    url.username === "" &&
    url.password === "" &&
    !urlDeclaresQueryOrFragment(url) &&
    url.pathname.startsWith("/downloader/public/");
/** Admit the selected macOS row without projecting away vendor release metadata. */
export const parseMacHopperReleases = (raw) => {
    const root = selectedPlatformsSchema.safeParse(raw);
    const release = jsonObjectSchema.safeParse(root.success ? root.data["OS X"] : undefined);
    if (!release.success || !archiveReleaseSchema.safeParse(release.data).success)
        return err(new HopperReleaseError("release_metadata", "The Hopper macOS release metadata is malformed."));
    const retained = release.data;
    if (!isPublicHopperDownload(new URL(retained.filename)))
        return err(new HopperReleaseError("release_metadata", "The Hopper macOS release is outside the official download channel."));
    return ok(retained);
};
/**
 * The minimum macOS version the selected release declares (`deployment_target`).
 * Undefined when the row declares none as text; the signed application's own
 * requirement is still checked before it is copied.
 */
export const macHopperReleaseMinimumSystemVersion = (release) => typeof release.deployment_target === "string"
    ? release.deployment_target
    : undefined;
/** Stable publisher identity; signing subkeys are admitted through this primary. */
export const HOPPER_LINUX_PRIMARY_FINGERPRINT = "7C2D73BAFAF5B9A710A69DA1A26DF815099B1BCD";
const platforms = {
    deb: "Ubuntu / Mint",
    rpm: "Fedora",
    arch: "Arch",
};
const suffixes = { deb: ".deb", rpm: ".rpm", arch: ".pkg.tar.xz" };
export class HopperReleaseError extends Error {
    reason;
    _tag = "HopperReleaseError";
    /** The vendor request whose transport failure produced this error. */
    download;
    constructor(reason, message, options) {
        super(message, options);
        this.reason = reason;
        this.name = this._tag;
        this.download = options?.download;
    }
    /** Describe a failed vendor request once, from the transport's observed facts. */
    static fromDownload(reason, download) {
        return new HopperReleaseError(reason, describeHopperRequestFailure(download), { download });
    }
}
const sha256 = z.string().regex(/^[a-f0-9]{64}$/u);
const releaseSchema = archiveReleaseSchema.extend({
    version: z.string().min(1),
    file_length: z
        .string()
        .regex(/^[1-9]\d*$/u)
        .refine((text) => {
        const count = Number(text);
        return Number.isSafeInteger(count) && count <= HOPPER_DOWNLOAD_BYTES;
    }),
    main_exe_hash: sha256,
    signature: z
        .string()
        .min(1)
        .refine((text) => Buffer.from(text, "base64").toString("base64") === text),
    public: z.literal("1"),
    beta: z.literal("0"),
});
export const parseLinuxHopperRelease = (raw, family) => {
    const retained = jsonObjectSchema.safeParse(raw);
    const parsed = releaseSchema.safeParse(retained.success ? retained.data : undefined);
    if (!retained.success || !parsed.success)
        return err(new HopperReleaseError("release_metadata", "The Hopper release omitted valid package identity or signature metadata."));
    const url = new URL(parsed.data.filename);
    if (!isPublicHopperDownload(url) ||
        !url.pathname.startsWith("/downloader/public/Hopper-") ||
        !url.pathname.endsWith(`-Linux-demo${suffixes[family]}`))
        return err(new HopperReleaseError("release_metadata", "The Hopper release is outside the official public Linux demo channel."));
    return ok(retained.data);
};
export const parseLinuxHopperReleases = (raw) => {
    const feed = selectedPlatformsSchema.safeParse(raw);
    if (!feed.success)
        return err(new HopperReleaseError("release_metadata", "The Hopper releases response is not an object."));
    return ok({
        deb: parseLinuxHopperRelease(feed.data[platforms.deb], "deb"),
        rpm: parseLinuxHopperRelease(feed.data[platforms.rpm], "rpm"),
        arch: parseLinuxHopperRelease(feed.data[platforms.arch], "arch"),
    });
};
