import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { init_browserObservation, init_safeJson, init_urlComponents, safeParseUtf8Json, sanitizeBrowserUrl, urlDeclaresQueryOrFragment } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_jsonValue, jsonObjectSchema } from "./jsonValue-DGGrC1lE.js";
import { appendCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { homeDirectoryFromEnvironment, init_homeDirectory } from "./homeDirectory-DLIK7QRT.js";
import { isAbsolute } from "node:path";
import { createHash } from "node:crypto";
import { z } from "zod";

//#region dist/application/HopperDownload.js
var HOPPER_DOWNLOAD_BYTES, HOPPER_DOWNLOAD_STALL_MS, HOPPER_DOWNLOAD_TIMEOUT_MS, HOPPER_METADATA_TIMEOUT_MS, downloadHopperPackage, readHopperResponse, releaseBody, networkDetail, FETCH_REDIRECT_LIMIT, REDIRECT_STATUSES, fetchHopperResponse, requestSubjects, refusals, describeHopperRequestFailure, hopperRequestRecovery;
function init_HopperDownload() {
	return (init_HopperDownload = __esmMin((() => {
		init_browserObservation();
		init_result();
		HOPPER_DOWNLOAD_BYTES = 1e8;
		HOPPER_DOWNLOAD_STALL_MS = 3e4;
		HOPPER_DOWNLOAD_TIMEOUT_MS = 15 * 6e4;
		HOPPER_METADATA_TIMEOUT_MS = 1e4;
		downloadHopperPackage = async (url, options = {}) => {
			const timeoutMs = options.timeoutMs ?? 9e5;
			if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 9e5) throw new RangeError("Invalid Hopper response time budget");
			const maxBytes = options.maxBytes ?? 1e8;
			if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > 1e8) throw new RangeError("Invalid Hopper response byte budget");
			const reported = sanitizeBrowserUrl(url).url;
			let receivedBytes = 0;
			let expired;
			const deadline = new AbortController();
			const expire = (limit, limitMs) => {
				expired ??= {
					limit,
					timeoutMs: limitMs,
					receivedBytes
				};
				deadline.abort();
			};
			const overall = setTimeout(() => {
				expire("deadline", timeoutMs);
			}, timeoutMs);
			let stall;
			const progressed = (bytes) => {
				receivedBytes = bytes;
				if (3e4 >= timeoutMs) return;
				clearTimeout(stall);
				stall = setTimeout(() => {
					expire("stalled", HOPPER_DOWNLOAD_STALL_MS);
				}, HOPPER_DOWNLOAD_STALL_MS);
			};
			try {
				progressed(0);
				return await readHopperResponse(url, reported, {
					signal: options.signal === undefined ? deadline.signal : AbortSignal.any([options.signal, deadline.signal]),
					maxBytes,
					progressed
				});
			} catch (cause) {
				if (options.signal?.aborted === true) throw cause;
				if (expired !== undefined) return err({
					url: reported,
					kind: "timeout",
					...expired
				});
				if (cause instanceof TypeError) return err({
					url: reported,
					kind: "network",
					detail: networkDetail(cause)
				});
				throw cause;
			} finally {
				clearTimeout(overall);
				clearTimeout(stall);
			}
		};
		readHopperResponse = async (requested, url, { signal, maxBytes, progressed }) => {
			const fetched = await fetchHopperResponse(requested, signal);
			if (!fetched.ok) return err({
				url,
				kind: "url_refused",
				refusal: fetched.error
			});
			const response = fetched.value;
			if (!response.ok) {
				await releaseBody(response.body);
				return err(Number.isInteger(response.status) && response.status >= 300 && response.status <= 599 ? {
					url,
					kind: "http_status",
					httpStatus: response.status
				} : {
					url,
					kind: "http_status"
				});
			}
			const tooLarge = {
				url,
				kind: "response_too_large",
				maxBytes
			};
			if (Number(response.headers.get("content-length")) > maxBytes) {
				await releaseBody(response.body);
				return err(tooLarge);
			}
			if (response.body === null) return ok(new Uint8Array());
			progressed(0);
			const reader = response.body.getReader();
			const chunks = [];
			let bytes = 0;
			try {
				while (true) {
					const chunk = await reader.read();
					if (chunk.done) return ok(Buffer.concat(chunks, bytes));
					if (chunk.value.byteLength > maxBytes - bytes) {
						await releaseBody(reader);
						return err(tooLarge);
					}
					chunks.push(chunk.value);
					bytes += chunk.value.byteLength;
					if (chunk.value.byteLength > 0) progressed(bytes);
				}
			} finally {
				reader.releaseLock();
			}
		};
		releaseBody = async (body) => {
			try {
				await body?.cancel();
			} catch (cause) {
				void cause;
			}
		};
		networkDetail = (cause) => {
			const underlying = cause.cause instanceof Error ? cause.cause.message : "";
			return underlying === "" || underlying === cause.message ? cause.message : `${cause.message}: ${underlying}`;
		};
		FETCH_REDIRECT_LIMIT = 20;
		REDIRECT_STATUSES = new Set([
			301,
			302,
			303,
			307,
			308
		]);
		fetchHopperResponse = async (url, signal) => {
			let selected;
			try {
				selected = new URL(url);
			} catch {
				return err("invalid_url");
			}
			let requested = url;
			for (let redirects = 0;; redirects++) {
				if (selected.protocol !== "https:") return err("non_https");
				if (selected.username !== "" || selected.password !== "") return err("credentials");
				const response = await fetch(requested, {
					redirect: "manual",
					headers: {
						accept: "application/json",
						"user-agent": "rea-installer"
					},
					signal
				});
				if (!REDIRECT_STATUSES.has(response.status)) return ok(response);
				const location = response.headers.get("location");
				await releaseBody(response.body);
				if (location === null) return err("redirect_without_location");
				if (redirects === FETCH_REDIRECT_LIMIT) return err("redirect_limit");
				let next;
				try {
					next = new URL(location, selected);
				} catch {
					return err("invalid_url");
				}
				if (!location.includes("#")) next.hash = selected.hash;
				selected = next;
				requested = next.href;
			}
		};
		requestSubjects = {
			release_feed: "Hopper release feed",
			package: "Hopper package",
			public_key: "Hopper public key"
		};
		refusals = {
			invalid_url: "a request or redirect URL was not a valid absolute URL",
			non_https: "a request or redirect URL did not use HTTPS",
			credentials: "a request or redirect URL contained credentials",
			redirect_without_location: "a redirect response omitted its Location",
			redirect_limit: `the response redirected more than ${FETCH_REDIRECT_LIMIT} times`
		};
		describeHopperRequestFailure = (failure) => {
			const subject = `The official ${requestSubjects[failure.request]} request to ${failure.url}`;
			switch (failure.kind) {
				case "http_status": return failure.httpStatus === undefined ? `${subject} received an unsuccessful HTTP response without a valid status.` : `${subject} returned HTTP ${failure.httpStatus}.`;
				case "timeout": return failure.limit === "stalled" ? `${subject} stalled: no bytes arrived for ${failure.timeoutMs / 1e3} seconds after ${failure.receivedBytes} bytes were received.` : `${subject} did not complete within ${failure.timeoutMs / 1e3} seconds; ${failure.receivedBytes} bytes were received.`;
				case "network": return `${subject} failed with a network error (${failure.detail}).`;
				case "response_too_large": return `${subject} exceeded REA's ${failure.maxBytes}-byte response limit.`;
				case "url_refused": return `${subject} was refused because ${refusals[failure.refusal]}.`;
			}
		};
		hopperRequestRecovery = (failure) => {
			switch (failure.kind) {
				case "http_status": {
					const status = failure.httpStatus;
					if (status === 404 || status === 410) return "The vendor reports this file as missing, so an immediate retry is unlikely to help; check for a newer REA release, then retry.";
					if (status === 408 || status === 429 || status !== undefined && status >= 500) return "The vendor service reported a temporary failure; wait, then retry.";
					return "Check proxy, firewall or network policy for this request, then retry.";
				}
				case "timeout":
				case "network": return "Check network, DNS, proxy and TLS access to this URL, then retry.";
				case "response_too_large":
				case "url_refused": return "The vendor response did not meet REA's download limits; check for a newer REA release, then retry.";
			}
		};
	})))();
}

//#endregion
//#region dist/application/HopperReleaseFeed.js
var HOPPER_RELEASES_URL, HOPPER_PUBLIC_KEY_URL, HOPPER_DOWNLOAD_PREFIX, parseHopperReleaseJson, hopperArchiveIntegrityMatches, archiveReleaseSchema, selectedPlatformsSchema, isPublicHopperDownload, parseMacHopperReleases, macHopperReleaseMinimumSystemVersion, HOPPER_LINUX_PRIMARY_FINGERPRINT, platforms, suffixes, HopperReleaseError, sha256, releaseSchema, parseLinuxHopperRelease, parseLinuxHopperReleases;
function init_HopperReleaseFeed() {
	return (init_HopperReleaseFeed = __esmMin((() => {
		init_jsonValue();
		init_safeJson();
		init_result();
		init_HopperDownload();
		init_urlComponents();
		HOPPER_RELEASES_URL = "https://www.hopperapp.com/include/files-api.php?request=releases&public=true";
		HOPPER_PUBLIC_KEY_URL = "https://www.hopperapp.com/hopper-public-key.asc";
		HOPPER_DOWNLOAD_PREFIX = "https://www.hopperapp.com:443/downloader/public/";
		parseHopperReleaseJson = (bytes) => safeParseUtf8Json(bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191 ? bytes.subarray(3) : bytes);
		hopperArchiveIntegrityMatches = (bytes, release) => bytes.byteLength === Number(release.file_length) && bytes.byteLength <= 1e8 && createHash("sha1").update(bytes).digest("hex") === release.file_hash;
		archiveReleaseSchema = z.object({
			filename: z.string().url(),
			file_length: z.string().regex(/^\d+$/u),
			file_hash: z.string().regex(/^[a-f0-9]{40}$/u)
		});
		selectedPlatformsSchema = z.object({
			"OS X": z.unknown().optional(),
			"Ubuntu / Mint": z.unknown().optional(),
			Fedora: z.unknown().optional(),
			Arch: z.unknown().optional()
		});
		isPublicHopperDownload = (url) => url.origin === "https://www.hopperapp.com" && url.username === "" && url.password === "" && !urlDeclaresQueryOrFragment(url) && url.pathname.startsWith("/downloader/public/");
		parseMacHopperReleases = (raw) => {
			const root = selectedPlatformsSchema.safeParse(raw);
			const release = jsonObjectSchema.safeParse(root.success ? root.data["OS X"] : undefined);
			if (!release.success || !archiveReleaseSchema.safeParse(release.data).success) return err(new HopperReleaseError("release_metadata", "The Hopper macOS release metadata is malformed."));
			const retained = release.data;
			if (!isPublicHopperDownload(new URL(retained.filename))) return err(new HopperReleaseError("release_metadata", "The Hopper macOS release is outside the official download channel."));
			return ok(retained);
		};
		macHopperReleaseMinimumSystemVersion = (release) => typeof release.deployment_target === "string" ? release.deployment_target : undefined;
		HOPPER_LINUX_PRIMARY_FINGERPRINT = "7C2D73BAFAF5B9A710A69DA1A26DF815099B1BCD";
		platforms = {
			deb: "Ubuntu / Mint",
			rpm: "Fedora",
			arch: "Arch"
		};
		suffixes = {
			deb: ".deb",
			rpm: ".rpm",
			arch: ".pkg.tar.xz"
		};
		HopperReleaseError = class HopperReleaseError extends Error {
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
		};
		sha256 = z.string().regex(/^[a-f0-9]{64}$/u);
		releaseSchema = archiveReleaseSchema.extend({
			version: z.string().min(1),
			file_length: z.string().regex(/^[1-9]\d*$/u).refine((text) => {
				const count = Number(text);
				return Number.isSafeInteger(count) && count <= 1e8;
			}),
			main_exe_hash: sha256,
			signature: z.string().min(1).refine((text) => Buffer.from(text, "base64").toString("base64") === text),
			public: z.literal("1"),
			beta: z.literal("0")
		});
		parseLinuxHopperRelease = (raw, family) => {
			const retained = jsonObjectSchema.safeParse(raw);
			const parsed = releaseSchema.safeParse(retained.success ? retained.data : undefined);
			if (!retained.success || !parsed.success) return err(new HopperReleaseError("release_metadata", "The Hopper release omitted valid package identity or signature metadata."));
			const url = new URL(parsed.data.filename);
			if (!isPublicHopperDownload(url) || !url.pathname.startsWith("/downloader/public/Hopper-") || !url.pathname.endsWith(`-Linux-demo${suffixes[family]}`)) return err(new HopperReleaseError("release_metadata", "The Hopper release is outside the official public Linux demo channel."));
			return ok(retained.data);
		};
		parseLinuxHopperReleases = (raw) => {
			const feed = selectedPlatformsSchema.safeParse(raw);
			if (!feed.success) return err(new HopperReleaseError("release_metadata", "The Hopper releases response is not an object."));
			return ok({
				deb: parseLinuxHopperRelease(feed.data[platforms.deb], "deb"),
				rpm: parseLinuxHopperRelease(feed.data[platforms.rpm], "rpm"),
				arch: parseLinuxHopperRelease(feed.data[platforms.arch], "arch")
			});
		};
	})))();
}

//#endregion
//#region dist/application/LinuxHopperCacheDirectory.js
var linuxHopperReleaseCacheDirectory;
function init_LinuxHopperCacheDirectory() {
	return (init_LinuxHopperCacheDirectory = __esmMin((() => {
		init_callerPath();
		init_homeDirectory();
		init_result();
		init_HopperReleaseFeed();
		linuxHopperReleaseCacheDirectory = (environment, selectedHome) => {
			try {
				const supplied = environment.XDG_CACHE_HOME || undefined;
				if (supplied !== undefined && !isAbsolute(supplied)) return err(new HopperReleaseError("verification_unavailable", "XDG_CACHE_HOME must be an absolute filesystem path."));
				return ok(appendCallerPath(supplied ?? appendCallerPath(selectedHome ?? homeDirectoryFromEnvironment(environment, "linux"), ".cache"), "rea/hopper-releases"));
			} catch (cause) {
				return err(new HopperReleaseError("verification_unavailable", "The Hopper release cache location could not be resolved.", { cause }));
			}
		};
	})))();
}

//#endregion
export { HOPPER_DOWNLOAD_BYTES, HOPPER_DOWNLOAD_PREFIX, HOPPER_LINUX_PRIMARY_FINGERPRINT, HOPPER_METADATA_TIMEOUT_MS, HOPPER_PUBLIC_KEY_URL, HOPPER_RELEASES_URL, HopperReleaseError, describeHopperRequestFailure, downloadHopperPackage, hopperArchiveIntegrityMatches, hopperRequestRecovery, init_HopperDownload, init_HopperReleaseFeed, init_LinuxHopperCacheDirectory, linuxHopperReleaseCacheDirectory, macHopperReleaseMinimumSystemVersion, parseHopperReleaseJson, parseLinuxHopperRelease, parseLinuxHopperReleases, parseMacHopperReleases };