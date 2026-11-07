import { sanitizeBrowserUrl } from "../domain/browserObservation.js";
import { err, ok } from "../domain/result.js";
/** Maximum admitted vendor response bytes, shared by Hopper setup adapters. */
export const HOPPER_DOWNLOAD_BYTES = 100_000_000;
/** Longest wait for the response or its next bytes before a download stalls. */
export const HOPPER_DOWNLOAD_STALL_MS = 30_000;
/**
 * Overall bound for one download. A slow connection that keeps delivering
 * bytes is bounded here rather than by a deadline sized for fast networks.
 */
export const HOPPER_DOWNLOAD_TIMEOUT_MS = 15 * 60_000;
/** Small release feed and key requests must not use the package bounds. */
export const HOPPER_METADATA_TIMEOUT_MS = 10_000;
/**
 * Bound observed response bytes before retaining them, including chunked bodies.
 * Expected transport outcomes are returned; caller cancellation still rejects
 * with the caller's abort reason so cancellation stays distinct from failure.
 */
export const downloadHopperPackage = async (url, options = {}) => {
    const timeoutMs = options.timeoutMs ?? HOPPER_DOWNLOAD_TIMEOUT_MS;
    if (!Number.isSafeInteger(timeoutMs) ||
        timeoutMs < 1 ||
        timeoutMs > HOPPER_DOWNLOAD_TIMEOUT_MS)
        throw new RangeError("Invalid Hopper response time budget");
    const maxBytes = options.maxBytes ?? HOPPER_DOWNLOAD_BYTES;
    if (!Number.isSafeInteger(maxBytes) ||
        maxBytes < 1 ||
        maxBytes > HOPPER_DOWNLOAD_BYTES)
        throw new RangeError("Invalid Hopper response byte budget");
    // Remove transport credentials once, where every failure is created.
    const reported = sanitizeBrowserUrl(url).url;
    let receivedBytes = 0;
    let expired;
    const deadline = new AbortController();
    const expire = (limit, limitMs) => {
        expired ??= { limit, timeoutMs: limitMs, receivedBytes };
        deadline.abort();
    };
    const overall = setTimeout(() => {
        expire("deadline", timeoutMs);
    }, timeoutMs);
    let stall;
    const progressed = (bytes) => {
        receivedBytes = bytes;
        if (HOPPER_DOWNLOAD_STALL_MS >= timeoutMs)
            return;
        clearTimeout(stall);
        stall = setTimeout(() => {
            expire("stalled", HOPPER_DOWNLOAD_STALL_MS);
        }, HOPPER_DOWNLOAD_STALL_MS);
    };
    try {
        progressed(0);
        return await readHopperResponse(url, reported, {
            signal: options.signal === undefined
                ? deadline.signal
                : AbortSignal.any([options.signal, deadline.signal]),
            maxBytes,
            progressed,
        });
    }
    catch (cause) {
        if (options.signal?.aborted === true)
            throw cause;
        if (expired !== undefined)
            return err({ url: reported, kind: "timeout", ...expired });
        // Fetch reports network errors (DNS, TLS, reset, truncated body) as TypeError.
        if (cause instanceof TypeError)
            return err({
                url: reported,
                kind: "network",
                detail: networkDetail(cause),
            });
        throw cause;
    }
    finally {
        clearTimeout(overall);
        clearTimeout(stall);
    }
};
const readHopperResponse = async (requested, url, { signal, maxBytes, progressed, }) => {
    const fetched = await fetchHopperResponse(requested, signal);
    if (!fetched.ok)
        return err({ url, kind: "url_refused", refusal: fetched.error });
    const response = fetched.value;
    if (!response.ok) {
        await releaseBody(response.body);
        return err(Number.isInteger(response.status) &&
            response.status >= 300 &&
            response.status <= 599
            ? { url, kind: "http_status", httpStatus: response.status }
            : { url, kind: "http_status" });
    }
    const tooLarge = { url, kind: "response_too_large", maxBytes };
    if (Number(response.headers.get("content-length")) > maxBytes) {
        await releaseBody(response.body);
        return err(tooLarge);
    }
    if (response.body === null)
        return ok(new Uint8Array());
    progressed(0);
    const reader = response.body.getReader();
    const chunks = [];
    let bytes = 0;
    try {
        while (true) {
            const chunk = await reader.read();
            if (chunk.done)
                return ok(Buffer.concat(chunks, bytes));
            if (chunk.value.byteLength > maxBytes - bytes) {
                await releaseBody(reader);
                return err(tooLarge);
            }
            chunks.push(chunk.value);
            bytes += chunk.value.byteLength;
            if (chunk.value.byteLength > 0)
                progressed(bytes);
        }
    }
    finally {
        reader.releaseLock();
    }
};
/**
 * Release a body REA will not admit. A stream that already failed (for example
 * a truncated error body) has nothing left to release, and its error must not
 * replace the response outcome that was already observed.
 */
const releaseBody = async (body) => {
    try {
        await body?.cancel();
    }
    catch (cause) {
        // best-effort cleanup: an errored stream is already released.
        void cause;
    }
};
const networkDetail = (cause) => {
    const underlying = cause.cause instanceof Error ? cause.cause.message : "";
    return underlying === "" || underlying === cause.message
        ? cause.message
        : `${cause.message}: ${underlying}`;
};
// HTTP-redirect fetch admits at most 20 redirects; retain that existing Fetch
// bound while checking each destination before the next request.
const FETCH_REDIRECT_LIMIT = 20;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const fetchHopperResponse = async (url, signal) => {
    let selected;
    try {
        selected = new URL(url);
    }
    catch {
        return err("invalid_url");
    }
    let requested = url;
    for (let redirects = 0;; redirects++) {
        if (selected.protocol !== "https:")
            return err("non_https");
        // Fetch cannot request userinfo and would echo it in its TypeError message.
        if (selected.username !== "" || selected.password !== "")
            return err("credentials");
        const response = await fetch(requested, {
            redirect: "manual",
            headers: { accept: "application/json", "user-agent": "rea-installer" },
            signal,
        });
        if (!REDIRECT_STATUSES.has(response.status))
            return ok(response);
        const location = response.headers.get("location");
        await releaseBody(response.body);
        if (location === null)
            return err("redirect_without_location");
        if (redirects === FETCH_REDIRECT_LIMIT)
            return err("redirect_limit");
        let next;
        try {
            next = new URL(location, selected);
        }
        catch {
            return err("invalid_url");
        }
        // Fetch inherits the previous fragment when Location has none.
        if (!location.includes("#"))
            next.hash = selected.hash;
        selected = next;
        requested = next.href;
    }
};
const requestSubjects = {
    release_feed: "Hopper release feed",
    package: "Hopper package",
    public_key: "Hopper public key",
};
const refusals = {
    invalid_url: "a request or redirect URL was not a valid absolute URL",
    non_https: "a request or redirect URL did not use HTTPS",
    credentials: "a request or redirect URL contained credentials",
    redirect_without_location: "a redirect response omitted its Location",
    redirect_limit: `the response redirected more than ${FETCH_REDIRECT_LIMIT} times`,
};
/** One sentence naming the failed request, its URL and the observed outcome. */
export const describeHopperRequestFailure = (failure) => {
    const subject = `The official ${requestSubjects[failure.request]} request to ${failure.url}`;
    switch (failure.kind) {
        case "http_status":
            return failure.httpStatus === undefined
                ? `${subject} received an unsuccessful HTTP response without a valid status.`
                : `${subject} returned HTTP ${failure.httpStatus}.`;
        case "timeout":
            return failure.limit === "stalled"
                ? `${subject} stalled: no bytes arrived for ${failure.timeoutMs / 1000} seconds after ${failure.receivedBytes} bytes were received.`
                : `${subject} did not complete within ${failure.timeoutMs / 1000} seconds; ${failure.receivedBytes} bytes were received.`;
        case "network":
            return `${subject} failed with a network error (${failure.detail}).`;
        case "response_too_large":
            return `${subject} exceeded REA's ${failure.maxBytes}-byte response limit.`;
        case "url_refused":
            return `${subject} was refused because ${refusals[failure.refusal]}.`;
    }
};
/** Next step for a failed request, owned with the transport facts that select it. */
export const hopperRequestRecovery = (failure) => {
    switch (failure.kind) {
        case "http_status": {
            const status = failure.httpStatus;
            if (status === 404 || status === 410)
                return "The vendor reports this file as missing, so an immediate retry is unlikely to help; check for a newer REA release, then retry.";
            if (status === 408 ||
                status === 429 ||
                (status !== undefined && status >= 500))
                return "The vendor service reported a temporary failure; wait, then retry.";
            return "Check proxy, firewall or network policy for this request, then retry.";
        }
        case "timeout":
        case "network":
            return "Check network, DNS, proxy and TLS access to this URL, then retry.";
        case "response_too_large":
        case "url_refused":
            return "The vendor response did not meet REA's download limits; check for a newer REA release, then retry.";
    }
};
