import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_analysisErrorBase, t as AnalysisError } from "./analysisErrorBase-DIqf4-vY.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { $ as BrowserObservationError, Ht as safeParseJson, Vt as init_safeJson, tt as init_browserObservationError } from "./analysisErrorProjection-B_6dTGtM.js";
import { f as init_analysisErrorCore, i as AnalysisCancelledError } from "./analysisErrorCore-BCqhUcUc.js";
import { S as urlDeclaresQueryOrFragment, a as init_browserObservation, p as sanitizeBrowserUrl, x as init_urlComponents } from "./browserObservation-DGb-Qd7N.js";
import { c as cdpCommandDeadlineRecovery, d as init_browserDeadline, f as noRuntimeOverrideSentence, l as cdpCommandTimeoutIsSelectable, n as CDP_DISCOVERY_RESPONSE_TIMEOUT_MS, r as DEFAULT_CDP_COMMAND_TIMEOUT_MS, s as cdpCleanupGraceExpired, u as cdpCommandTimeoutUnrelatedControl } from "./browserDeadline-YXJtM4nx.js";
import { n as AnalysisCleanupLeaseGroup, r as init_AnalysisCleanupLease, t as AnalysisCleanupLease } from "./AnalysisCleanupLease-Cqxpxr67.js";
import { a as init_cdpObservationSchemas, n as cdpResourceColumnSchema, o as createWebTextArtifact, s as init_webContentArtifact } from "./cdpObservationSchemas-Bu-3wMbg.js";
import { n as init_analysisErrorCleanup, t as analysisErrorWithCleanupFailure } from "./analysisErrorCleanup-CLocSgSR.js";
import { n as init_providerCleanupError, t as ProviderCleanupError } from "./providerCleanupError-CbzQ5mbk.js";
import { n as init_webRuntime, t as WEB_RUNTIME_LIMITS } from "./webRuntime-D-rId2Bd.js";
import { z } from "zod";
import { isUtf8 } from "node:buffer";
import { request } from "node:http";
import WebSocket from "ws";

//#region dist/browser/CdpCaptureValues.js
var isRecord$1, recordValue, admitRecords, recordsValue, cdpStringValue, numberValue, resourceContentSize, requiredRecord, requiredScriptSource, isHttpUrl, allowedSanitizedUrl, sourceResult, sourceExcluded, delayWithCancellation;
function init_CdpCaptureValues() {
	return (init_CdpCaptureValues = __esmMin((() => {
		init_analysisErrorCore();
		init_browserObservationError();
		init_browserObservation();
		init_webContentArtifact();
		init_result();
		isRecord$1 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		recordValue = (value) => isRecord$1(value) ? value : undefined;
		admitRecords = (value) => Array.isArray(value) ? value : undefined;
		recordsValue = (value) => Array.isArray(value) ? value.flatMap((item) => {
			const record = recordValue(item);
			return record === undefined ? [] : [record];
		}) : [];
		cdpStringValue = (value) => typeof value === "string" ? value : undefined;
		numberValue = (value) => typeof value === "number" && Number.isFinite(value) ? value : undefined;
		resourceContentSize = (value) => {
			if (value === undefined) return ok(null);
			const size = numberValue(value);
			return size !== undefined && size >= 0 ? ok(size) : err({ _tag: "InvalidCdpResourceSize" });
		};
		requiredRecord = (value) => {
			const record = recordValue(value);
			if (record === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			return record;
		};
		requiredScriptSource = (value, operation) => {
			const source = cdpStringValue(recordValue(value)?.scriptSource);
			if (source === undefined) throw new BrowserObservationError(operation, "protocol_error", { detail: "Debugger.getScriptSource returned malformed source text: scriptSource must be a string." });
			return source;
		};
		isHttpUrl = (value) => {
			if (value === undefined) return false;
			try {
				const protocol = new URL(value).protocol;
				return protocol === "http:" || protocol === "https:";
			} catch (cause) {
				void cause;
				return false;
			}
		};
		allowedSanitizedUrl = (value, allowedOrigins) => {
			const text = cdpStringValue(value);
			if (text === undefined) return undefined;
			const sanitized = sanitizeBrowserUrl(text);
			return sanitized.origin !== null && allowedOrigins.has(sanitized.origin) ? sanitized : undefined;
		};
		sourceResult = (source) => ({
			included: true,
			artifact: createWebTextArtifact(source, "text/javascript")
		});
		sourceExcluded = (reason) => ({
			included: false,
			reason
		});
		delayWithCancellation = async (durationMs, operation, signal) => {
			const maximumTimerDelay = 2147483647;
			let remaining = durationMs;
			while (remaining > 0) {
				if (signal?.aborted === true) throw new AnalysisCancelledError(operation, { cause: signal.reason });
				const delay = Math.min(remaining, maximumTimerDelay);
				await new Promise((resolve, reject) => {
					const timer = setTimeout(() => {
						signal?.removeEventListener("abort", onAbort);
						resolve();
					}, delay);
					const onAbort = () => {
						clearTimeout(timer);
						signal?.removeEventListener("abort", onAbort);
						reject(new AnalysisCancelledError(operation, { cause: signal?.reason }));
					};
					signal?.addEventListener("abort", onAbort, { once: true });
					if (signal?.aborted === true) onAbort();
				});
				remaining -= delay;
			}
		};
	})))();
}

//#endregion
//#region dist/browser/CdpDiscoveryTargets.js
var identitySchema, browserSocketIdentitySchema, parseCdpDiscoveryTargets, selectCdpDiscoveryTarget;
function init_CdpDiscoveryTargets() {
	return (init_CdpDiscoveryTargets = __esmMin((() => {
		init_browserObservationError();
		identitySchema = z.object({
			id: z.string().min(1),
			type: z.string().min(1),
			url: z.string(),
			title: z.unknown().optional(),
			attached: z.unknown().optional(),
			webSocketDebuggerUrl: z.unknown().optional()
		});
		browserSocketIdentitySchema = identitySchema.omit({ id: true }).extend({ targetId: identitySchema.shape.id });
		parseCdpDiscoveryTargets = (input, operation, source = "http") => {
			const label = source === "http" ? "CDP /json/list" : "CDP Target.getTargets";
			if (!Array.isArray(input)) throw new BrowserObservationError(operation, "invalid_endpoint_response", { detail: `${label} must return an array of target rows.` });
			const schema = source === "browser-socket" ? browserSocketIdentitySchema : identitySchema;
			const targets = [];
			const limitations = [];
			const idCounts = new Map();
			for (const row of input) {
				if (typeof row !== "object" || row === null || Array.isArray(row)) continue;
				const id = Reflect.get(row, source === "http" ? "id" : "targetId");
				if (typeof id === "string" && id !== "") idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
			}
			const ambiguousTargetIds = [];
			for (const [id, count] of idCounts) {
				if (count > 1) {
					ambiguousTargetIds.push(id);
					limitations.push(`${label} reported target ID ${id} in ${String(count)} rows; its identity is ambiguous and cannot be selected.`);
				}
			}
			for (const [index, row] of input.entries()) {
				const parsed = schema.safeParse(row);
				if (!parsed.success) {
					limitations.push(`${label} row ${String(index)} was excluded because its target identity is malformed: ${JSON.stringify(parsed.error.issues)}.`);
					continue;
				}
				const target = parsed.data;
				const id = "targetId" in target ? target.targetId : target.id;
				if (target.attached !== undefined && target.attached !== null && typeof target.attached !== "boolean") limitations.push(`${label} row ${String(index)} target ${id} reported malformed attached metadata ${JSON.stringify(target.attached)}; attachment state is unknown.`);
				if (target.title !== undefined && typeof target.title !== "string") limitations.push(`${label} row ${String(index)} target ${id} reported malformed title metadata ${JSON.stringify(target.title)}; title is unavailable.`);
				targets.push({
					id,
					type: target.type,
					url: target.url,
					title: typeof target.title === "string" ? target.title : "",
					attached: typeof target.attached === "boolean" ? target.attached : null,
					webSocketDebuggerUrl: target.webSocketDebuggerUrl
				});
			}
			return {
				targets,
				limitations,
				ambiguousTargetIds
			};
		};
		selectCdpDiscoveryTarget = (targets, targetId, operation, ambiguousTargetIds = []) => {
			const matches = targets.filter((target) => target.id === targetId);
			if (matches.length > 1 || ambiguousTargetIds.includes(targetId)) throw new BrowserObservationError(operation, "invalid_endpoint_response", {
				detail: `Target ID ${targetId} is ambiguous in endpoint discovery; REA cannot select its identity or location.`,
				diagnostics: { target_id: targetId },
				remediationAction: "Refresh discovery after the endpoint reports a unique row for this target ID, or select a different target."
			});
			return matches[0];
		};
	})))();
}

//#endregion
//#region dist/browser/CdpEndpoint.js
var endpointVersionSchema, CDP_DISCOVERY_RESPONSE_LIMITS, discoveryBudget, discoveryTimeout, browserSocketVersionSchema, discoverCdpEndpoint, withCdpDiscoveryDeadline, discoverCdpBrowserSocket, sanitizeTargetTitle, sanitizeTargetUrlAlias, sanitizeSameOriginTitleUrl, escapeRegExp, cdpTargetWebSocket, hasCdpTargetWebSocket, availableCdpTargetWebSocket, parseCdpEndpointValue, safeCdpWebSocketEndpoint, cdpWebSocketPath, pathIdentifier, targetWebSocket, readCdpJson, endpointFailure;
function init_CdpEndpoint() {
	return (init_CdpEndpoint = __esmMin((() => {
		init_browserDeadline();
		init_analysisErrorCore();
		init_analysisErrorBase();
		init_browserObservationError();
		init_browserObservation();
		init_urlComponents();
		init_safeJson();
		init_webRuntime();
		init_CdpCaptureValues();
		init_CdpDiscoveryTargets();
		endpointVersionSchema = z.object({
			Browser: z.string().min(1),
			"Protocol-Version": z.string().min(1),
			"User-Agent": z.string(),
			"V8-Version": z.string(),
			"WebKit-Version": z.string(),
			webSocketDebuggerUrl: z.string().min(1)
		});
		CDP_DISCOVERY_RESPONSE_LIMITS = {
			bytes: 8 * 1024 * 1024,
			timeoutMs: CDP_DISCOVERY_RESPONSE_TIMEOUT_MS
		};
		discoveryBudget = (phase) => phase === "response" ? `The ${String(CDP_DISCOVERY_RESPONSE_LIMITS.bytes)}-byte discovery document budget` : `The ${String(WEB_RUNTIME_LIMITS.protocolBytes)}-byte browser-socket message budget`;
		discoveryTimeout = (operation, timeoutMs, phase) => {
			const subject = phase === "response" ? `CDP discovery response exceeded its ${String(timeoutMs)} ms deadline.` : `CDP browser-socket discovery exceeded its ${String(timeoutMs)} ms deadline.`;
			const fixed = noRuntimeOverrideSentence(`${discoveryBudget(phase)} and the ${String(timeoutMs)} ms discovery deadline stay fixed.`, cdpCommandTimeoutUnrelatedControl(operation));
			return new BrowserObservationError(operation, "timeout", {
				detail: `${subject} ${fixed}`,
				remediationAction: fixed
			});
		};
		browserSocketVersionSchema = z.object({
			protocolVersion: z.string().min(1),
			product: z.string().min(1),
			revision: z.string(),
			userAgent: z.string(),
			jsVersion: z.string()
		});
		discoverCdpEndpoint = async (endpoint, operation, signal) => {
			const versionInput = await readCdpJson(new URL("/json/version", endpoint), operation, signal);
			const targetsInput = await readCdpJson(new URL("/json/list", endpoint), operation, signal);
			const version = parseCdpEndpointValue(endpointVersionSchema, versionInput, operation);
			const { targets, limitations, ambiguousTargetIds } = parseCdpDiscoveryTargets(targetsInput, operation);
			return {
				limitations,
				ambiguousTargetIds,
				webSocket: safeCdpWebSocketEndpoint(endpoint, version.webSocketDebuggerUrl, operation),
				version: {
					product: version.Browser,
					protocol_version: version["Protocol-Version"],
					revision: version["WebKit-Version"],
					user_agent: version["User-Agent"],
					js_version: version["V8-Version"]
				},
				targets: targets.map((target) => ({
					id: target.id,
					type: target.type,
					title: sanitizeTargetTitle(target.title, target.url),
					url: target.url,
					attached: target.attached,
					...targetWebSocket(endpoint, target, operation)
				}))
			};
		};
		withCdpDiscoveryDeadline = async (operation, signal, work, timeoutMs = CDP_DISCOVERY_RESPONSE_LIMITS.timeoutMs) => {
			const deadline = new AbortController();
			let abortSource;
			let abortReason;
			const abort = (source, reason) => {
				if (abortSource !== undefined) return;
				abortSource = source;
				abortReason = reason;
				deadline.abort(reason);
			};
			const onCallerAbort = () => {
				if (signal?.aborted === true) abort("caller", signal.reason);
			};
			const timer = setTimeout(() => abort("deadline", new Error("CDP discovery deadline exceeded")), timeoutMs);
			signal?.addEventListener("abort", onCallerAbort, { once: true });
			onCallerAbort();
			try {
				return await work(deadline.signal);
			} catch (cause) {
				if (cause === abortReason) {
					if (abortSource === "caller") throw new AnalysisCancelledError(operation, { cause: abortReason });
					if (abortSource === "deadline") throw discoveryTimeout(operation, timeoutMs, "browser-socket");
				}
				if (cause instanceof AnalysisError) {
					if (abortSource === "deadline" && cause instanceof AnalysisCancelledError && cause.cause === abortReason) throw discoveryTimeout(operation, timeoutMs, "browser-socket");
					throw cause;
				}
				throw cause;
			} finally {
				clearTimeout(timer);
				signal?.removeEventListener("abort", onCallerAbort);
			}
		};
		discoverCdpBrowserSocket = async (connection, url, operation, signal) => {
			const versionInput = await connection.send("Browser.getVersion", {}, undefined, signal);
			const targetsInput = await connection.send("Target.getTargets", {}, undefined, signal);
			const version = parseCdpEndpointValue(browserSocketVersionSchema, versionInput, operation);
			const { targets, limitations, ambiguousTargetIds } = parseCdpDiscoveryTargets(recordValue(targetsInput)?.targetInfos, operation, "browser-socket");
			return {
				limitations,
				ambiguousTargetIds,
				webSocket: {
					scope: "browser",
					url
				},
				version: {
					product: version.product,
					protocol_version: version.protocolVersion,
					revision: version.revision,
					user_agent: version.userAgent,
					js_version: version.jsVersion
				},
				targets: targets.map((target) => ({
					id: target.id,
					type: target.type,
					title: sanitizeTargetTitle(target.title, target.url),
					url: target.url,
					attached: target.attached
				}))
			};
		};
		sanitizeTargetTitle = (value, targetUrl) => {
			let url;
			try {
				url = new URL(value);
			} catch (cause) {
				void cause;
				return sanitizeTargetUrlAlias(value, targetUrl);
			}
			return url.protocol === "http:" || url.protocol === "https:" ? sanitizeBrowserUrl(value).url : sanitizeTargetUrlAlias(value, targetUrl);
		};
		sanitizeTargetUrlAlias = (value, targetUrl) => {
			let parsed;
			try {
				parsed = new URL(targetUrl);
			} catch (cause) {
				void cause;
				return value;
			}
			const markers = [
				parsed.origin,
				`//${parsed.host}`,
				parsed.host
			];
			if (parsed.pathname !== "/") markers.push(parsed.pathname);
			const candidatePattern = new RegExp(`(?:${markers.map(escapeRegExp).join("|")})[^\\s<>"']*`, "gu");
			return value.replace(candidatePattern, (candidate) => sanitizeSameOriginTitleUrl(candidate, parsed));
		};
		sanitizeSameOriginTitleUrl = (candidate, target) => {
			let parsed;
			try {
				parsed = candidate.startsWith("//") ? new URL(`${target.protocol}${candidate}`) : candidate.startsWith(target.host) ? new URL(`${target.protocol}//${candidate}`) : new URL(candidate, target.origin);
			} catch (cause) {
				void cause;
				return candidate;
			}
			return parsed.origin === target.origin && (parsed.username !== "" || parsed.password !== "") ? sanitizeBrowserUrl(candidate).url : candidate;
		};
		escapeRegExp = (value) => value.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		cdpTargetWebSocket = (discovery, target, operation) => {
			const webSocket = availableCdpTargetWebSocket(discovery, target);
			if (webSocket !== undefined) return webSocket;
			throw new BrowserObservationError(operation, "invalid_endpoint_response");
		};
		hasCdpTargetWebSocket = (discovery, target) => availableCdpTargetWebSocket(discovery, target) !== undefined;
		availableCdpTargetWebSocket = (discovery, target) => {
			if (discovery.webSocket.scope === "browser") return discovery.webSocket;
			if (target.webSocket !== undefined) return target.webSocket;
			return discovery.webSocket.targetId === target.id ? discovery.webSocket : undefined;
		};
		parseCdpEndpointValue = (schema, input, operation) => {
			const parsed = schema.safeParse(input);
			if (!parsed.success) throw new BrowserObservationError(operation, "invalid_endpoint_response", { cause: parsed.error });
			return parsed.data;
		};
		safeCdpWebSocketEndpoint = (endpoint, reported, operation) => {
			let parsed;
			try {
				parsed = new URL(reported);
			} catch (cause) {
				throw new BrowserObservationError(operation, "invalid_endpoint_response", { cause });
			}
			const trustedEndpoint = new URL(endpoint);
			const path = cdpWebSocketPath(parsed.pathname);
			if (parsed.protocol !== "ws:" || parsed.port !== trustedEndpoint.port || parsed.username !== "" || parsed.password !== "" || urlDeclaresQueryOrFragment(parsed) || path === undefined) throw new BrowserObservationError(operation, "invalid_endpoint_response");
			parsed.hostname = trustedEndpoint.hostname;
			return path.scope === "browser" ? {
				scope: "browser",
				url: parsed.href
			} : {
				scope: "page",
				targetId: path.targetId,
				url: parsed.href
			};
		};
		cdpWebSocketPath = (pathname) => {
			const browserId = pathIdentifier(pathname, "/devtools/browser/");
			if (browserId !== undefined) return { scope: "browser" };
			const targetId = pathIdentifier(pathname, "/devtools/page/");
			return targetId === undefined ? undefined : {
				scope: "page",
				targetId
			};
		};
		pathIdentifier = (pathname, prefix) => {
			if (!pathname.startsWith(prefix)) return undefined;
			const identifier = pathname.slice(prefix.length);
			return identifier.length > 0 && !identifier.includes("/") ? identifier : undefined;
		};
		targetWebSocket = (endpoint, target, operation) => {
			if (typeof target.webSocketDebuggerUrl !== "string" || target.webSocketDebuggerUrl.length === 0) return {};
			try {
				const webSocket = safeCdpWebSocketEndpoint(endpoint, target.webSocketDebuggerUrl, operation);
				return webSocket.scope === "page" && webSocket.targetId === target.id ? { webSocket } : {};
			} catch (cause) {
				void cause;
				return {};
			}
		};
		readCdpJson = async (url, operation, signal, limits = CDP_DISCOVERY_RESPONSE_LIMITS) => await new Promise((resolve, reject) => {
			if (signal?.aborted === true) {
				reject(new AnalysisCancelledError(operation, { cause: signal.reason }));
				return;
			}
			let response;
			let request_;
			let timer;
			let settled = false;
			const removeAbort = () => signal?.removeEventListener("abort", onAbort);
			const finish = (error, value) => {
				if (settled) return;
				settled = true;
				if (timer !== undefined) clearTimeout(timer);
				removeAbort();
				if (error !== undefined) {
					reject(error);
					response?.destroy();
					request_?.destroy();
				} else resolve(value);
			};
			const onAbort = () => {
				if (signal?.aborted === true) finish(new AnalysisCancelledError(operation, { cause: signal.reason }));
			};
			request_ = request(url, {
				method: "GET",
				headers: { Accept: "application/json" }
			}, (received) => {
				response = received;
				if (settled) {
					received.destroy();
					return;
				}
				if (received.statusCode !== 200) {
					finish(new BrowserObservationError(operation, "invalid_endpoint_response"));
					return;
				}
				const chunks = [];
				let bytes = 0;
				received.on("data", (chunk) => {
					if (settled) return;
					bytes += chunk.byteLength;
					if (bytes > limits.bytes) {
						finish(new BrowserObservationError(operation, "payload_limit", { detail: noRuntimeOverrideSentence(`CDP discovery response exceeds its ${String(limits.bytes)}-byte limit.`, cdpCommandTimeoutUnrelatedControl(operation)) }));
						return;
					}
					chunks.push(chunk);
				});
				received.on("end", () => {
					if (settled) return;
					const body = Buffer.concat(chunks, bytes);
					if (!isUtf8(body)) {
						finish(new BrowserObservationError(operation, "invalid_endpoint_response"));
						return;
					}
					const parsed = safeParseJson(body.toString("utf8"));
					if (!parsed.ok) {
						finish(new BrowserObservationError(operation, "invalid_endpoint_response", { cause: parsed.cause }));
						return;
					}
					finish(undefined, parsed.value);
				});
				received.on("aborted", () => finish(new BrowserObservationError(operation, "invalid_endpoint_response")));
				received.on("close", () => {
					if (!settled && !received.complete) finish(new BrowserObservationError(operation, "invalid_endpoint_response"));
				});
				received.on("error", (cause) => finish(endpointFailure(cause, operation, signal)));
			});
			request_.on("error", (cause) => finish(endpointFailure(cause, operation, signal)));
			signal?.addEventListener("abort", onAbort, { once: true });
			onAbort();
			if (settled) return;
			timer = setTimeout(() => finish(discoveryTimeout(operation, limits.timeoutMs, "response")), limits.timeoutMs);
			request_.end();
		});
		endpointFailure = (cause, operation, signal) => {
			if (cause instanceof AnalysisError) return cause;
			if (signal?.aborted === true) return new AnalysisCancelledError(operation, { cause: signal.reason });
			return new BrowserObservationError(operation, "endpoint_unreachable", { cause });
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCommandRejection.js
var CdpCommandRejection;
function init_CdpCommandRejection() {
	return (init_CdpCommandRejection = __esmMin((() => {
		init_browserObservationError();
		CdpCommandRejection = class extends BrowserObservationError {
			command;
			code;
			reportedMessage;
			constructor(operation, command, code, reportedMessage) {
				super(operation, "protocol_error", { detail: reportedMessage === null ? "CDP returned a malformed command error." : `CDP ${command} failed (${code === null ? "unknown code" : String(code)}): ${reportedMessage}` });
				this.command = command;
				this.code = code;
				this.reportedMessage = reportedMessage;
			}
		};
	})))();
}

//#endregion
//#region dist/browser/CdpConnection.js
var MAX_WEBSOCKET_PAYLOAD_BYTES, CdpConnection, socketIsClosed, rawText, rawByteLength, isRecord, waitForOpen, terminateSocket;
function init_CdpConnection() {
	return (init_CdpConnection = __esmMin((() => {
		init_analysisErrorCore();
		init_analysisErrorBase();
		init_browserObservationError();
		init_CdpCommandRejection();
		init_browserDeadline();
		init_safeJson();
		init_webRuntime();
		MAX_WEBSOCKET_PAYLOAD_BYTES = 2147483647;
		CdpConnection = class CdpConnection {
			socket;
			operation;
			maxPayloadBytes;
			#pending = new Map();
			#listeners = new Set();
			#disconnectListeners = new Set();
			#protocolFailureListeners = new Set();
			#nextId = 1;
			#closed = false;
			#closePromise;
			#protocolFailed = false;
			#transportFailure = "disconnected";
			#commandTimeoutMs;
			#deadlineKind = "command";
			constructor(socket, operation, maxPayloadBytes, commandTimeoutMs) {
				this.socket = socket;
				this.operation = operation;
				this.maxPayloadBytes = maxPayloadBytes;
				this.#commandTimeoutMs = commandTimeoutMs;
				socket.on("message", (data) => this.#receive(data));
				socket.on("close", () => this.#disconnect());
				socket.on("error", (cause) => this.#disconnect(isRecord(cause) && cause.code === "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH" ? "payload_limit" : "disconnected"));
			}
			/** Connect to one already-validated loopback CDP WebSocket. */
			static async connect(url, operation, signal, limits, onConnected) {
				if (signal?.aborted === true) throw new AnalysisCancelledError(operation, { cause: signal.reason });
				const maxPayloadBytes = limits?.maxPayloadBytes ?? WEB_RUNTIME_LIMITS.protocolBytes;
				const commandTimeoutMs = limits?.commandTimeoutMs ?? 2e4;
				const handshakeTimeoutMs = limits?.handshakeTimeoutMs ?? commandTimeoutMs;
				if (!Number.isSafeInteger(maxPayloadBytes) || maxPayloadBytes <= 0 || maxPayloadBytes > MAX_WEBSOCKET_PAYLOAD_BYTES) throw new RangeError(`CDP maxPayloadBytes must be a positive safe integer no greater than ${String(MAX_WEBSOCKET_PAYLOAD_BYTES)}.`);
				const socket = new WebSocket(url, {
					handshakeTimeout: 0,
					maxPayload: maxPayloadBytes,
					perMessageDeflate: false
				});
				const connection = new CdpConnection(socket, operation, maxPayloadBytes, commandTimeoutMs);
				try {
					onConnected?.(connection);
				} catch (cause) {
					await connection.close();
					throw cause;
				}
				try {
					await waitForOpen(socket, operation, signal, handshakeTimeoutMs);
				} catch (cause) {
					if (onConnected === undefined) {
						try {
							await connection.close();
						} catch (cleanupCause) {
							throw new AggregateError([cause, cleanupCause], "CDP WebSocket handshake failed and its transport cleanup is incomplete.", { cause });
						}
					}
					throw cause;
				}
				return connection;
			}
			/** Subscribe to validated CDP event envelopes. */
			onEvent(listener) {
				this.#listeners.add(listener);
				return () => this.#listeners.delete(listener);
			}
			/** Subscribe to an unexpected transport loss while an operation is active. */
			onDisconnect(listener) {
				if (this.#closed) {
					listener(this.#transportError(this.#transportFailure));
					return () => undefined;
				}
				this.#disconnectListeners.add(listener);
				return () => this.#disconnectListeners.delete(listener);
			}
			/** Notify fatal wire parsing failure even when no command is outstanding. */
			onProtocolFailure(listener) {
				if (this.#protocolFailed) {
					listener(this.#transportError("protocol_error"));
					return () => undefined;
				}
				this.#protocolFailureListeners.add(listener);
				return () => this.#protocolFailureListeners.delete(listener);
			}
			/** Apply the post-discovery command deadline to commands that have not started. */
			selectCommandTimeout(timeoutMs) {
				if (this.#deadlineKind === "cleanup") return;
				this.#commandTimeoutMs = timeoutMs;
			}
			/**
			* Restoration uses the fixed cleanup grace. Commands already waiting are
			* rescheduled from now so a raised command deadline cannot extend them.
			*/
			beginCleanupGrace(timeoutMs) {
				this.#deadlineKind = "cleanup";
				this.#commandTimeoutMs = timeoutMs;
				for (const pending of this.#pending.values()) pending.reschedule(timeoutMs);
			}
			/** Bound each response separately from the caller-selected observation window. */
			async send(method, params = {}, sessionId, signal) {
				if (this.#protocolFailed) throw new BrowserObservationError(this.operation, "protocol_error");
				if (this.#closed || this.socket.readyState !== WebSocket.OPEN) throw this.#transportError(this.#transportFailure);
				if (signal?.aborted === true) throw new AnalysisCancelledError(this.operation, { cause: signal.reason });
				const id = this.#nextId;
				this.#nextId += 1;
				const message = JSON.stringify({
					id,
					method,
					params,
					...sessionId === undefined ? {} : { sessionId }
				});
				return await new Promise((resolve, reject) => {
					const onAbort = () => {
						const pending = this.#pending.get(id);
						if (pending === undefined) return;
						this.#complete(id, pending);
						reject(new AnalysisCancelledError(this.operation, { cause: signal?.reason }));
					};
					const failTimeout = () => {
						const pending = this.#pending.get(id);
						if (pending === undefined) return;
						this.#complete(id, pending);
						if (this.#deadlineKind === "cleanup") {
							const detail = cdpCleanupGraceExpired();
							reject(new BrowserObservationError(this.operation, "timeout", {
								detail,
								remediationAction: detail
							}));
							return;
						}
						const recovery = cdpCommandDeadlineRecovery(this.#commandTimeoutMs, "command", method, cdpCommandTimeoutIsSelectable(this.operation));
						reject(new BrowserObservationError(this.operation, "timeout", {
							detail: recovery.userMessage,
							remediationAction: recovery.remediationAction
						}));
					};
					let timer = setTimeout(failTimeout, this.#commandTimeoutMs);
					signal?.addEventListener("abort", onAbort, { once: true });
					this.#pending.set(id, {
						method,
						...sessionId === undefined ? {} : { sessionId },
						resolve,
						reject,
						reschedule: (timeoutMs) => {
							clearTimeout(timer);
							timer = setTimeout(failTimeout, timeoutMs);
						},
						dispose: () => {
							clearTimeout(timer);
							signal?.removeEventListener("abort", onAbort);
						}
					});
					this.socket.send(message, (error) => {
						if (error === undefined || error === null) return;
						const pending = this.#pending.get(id);
						if (pending === undefined) return;
						this.#complete(id, pending);
						reject(new BrowserObservationError(this.operation, "disconnected", { cause: error }));
					});
				});
			}
			/** Close only REA's socket; never close the browser or selected page. */
			close() {
				this.#closePromise ??= this.#closeTransport().catch((cause) => {
					this.#closePromise = undefined;
					throw cause;
				});
				return this.#closePromise;
			}
			async #closeTransport() {
				this.#closed = true;
				this.#failPending("disconnected");
				if (socketIsClosed(this.socket)) return;
				await new Promise((resolve, reject) => {
					let settled = false;
					let fallbackStarted = false;
					let fallbackTimer;
					const finish = (cause) => {
						if (settled) return;
						settled = true;
						clearTimeout(timer);
						if (fallbackTimer !== undefined) clearTimeout(fallbackTimer);
						this.socket.off("close", onClose);
						if (cause === undefined) resolve();
						else reject(cause);
					};
					const onClose = () => finish();
					const forceClose = (gracefulFailure) => {
						if (settled || fallbackStarted) return;
						fallbackStarted = true;
						clearTimeout(timer);
						if (socketIsClosed(this.socket)) {
							finish();
							return;
						}
						try {
							this.socket.terminate();
						} catch (cause) {
							gracefulFailure = gracefulFailure === undefined ? cause : new AggregateError([gracefulFailure, cause], "Graceful and forced CDP WebSocket close both failed.", { cause: gracefulFailure });
						}
						if (socketIsClosed(this.socket)) finish();
						else {
							fallbackTimer = setTimeout(() => {
								if (socketIsClosed(this.socket)) {
									finish();
									return;
								}
								finish(gracefulFailure ?? new BrowserObservationError(this.operation, "cleanup_failed", { detail: "REA could not confirm release of its CDP WebSocket." }));
							}, 1e3);
						}
					};
					const timer = setTimeout(() => forceClose(), 1e3);
					this.socket.once("close", onClose);
					try {
						this.socket.close();
					} catch (closeCause) {
						forceClose(closeCause);
					}
				});
			}
			#receive(data) {
				if (this.#closed || this.#protocolFailed) return;
				const parsed = safeParseJson(rawText(data));
				if (!parsed.ok) {
					this.#failPending("protocol_error");
					return;
				}
				const message = parsed.value;
				if (!isRecord(message)) {
					this.#failPending("protocol_error");
					return;
				}
				if ("id" in message) {
					if (typeof message.id !== "number" || !Number.isSafeInteger(message.id) || message.id < 1) {
						this.#failPending("protocol_error");
						return;
					}
					this.#receiveResponse(message, message.id);
					return;
				}
				if (typeof message.method !== "string" || message.method.length === 0 || "params" in message && !isRecord(message.params) || "sessionId" in message && typeof message.sessionId !== "string") {
					this.#failPending("protocol_error");
					return;
				}
				const wireBytes = rawByteLength(data);
				const event = {
					method: message.method,
					params: "params" in message ? message.params : {},
					wireBytes,
					...typeof message.sessionId === "string" ? { sessionId: message.sessionId } : {}
				};
				for (const listener of this.#listeners) listener(event);
			}
			#receiveResponse(message, id) {
				const pending = this.#pending.get(id);
				if (pending === undefined) return;
				const hasResult = "result" in message;
				const hasError = "error" in message;
				const detachedSessionError = pending.sessionId !== undefined && !("sessionId" in message) && hasError && isRecord(message.error) && message.error.code === -32001 && message.error.message === "Session with given id not found.";
				if ((pending.sessionId === undefined ? "sessionId" in message : message.sessionId !== pending.sessionId && !detachedSessionError) || hasResult === hasError) {
					this.#failPending("protocol_error");
					return;
				}
				if (hasResult) {
					if (!isRecord(message.result)) {
						this.#failPending("protocol_error");
						return;
					}
					this.#complete(id, pending);
					pending.resolve(message.result);
					return;
				}
				const reported = message.error;
				if (!isRecord(reported) || typeof reported.code !== "number" || !Number.isSafeInteger(reported.code) || typeof reported.message !== "string") {
					this.#failPending("protocol_error");
					return;
				}
				this.#complete(id, pending);
				pending.reject(new CdpCommandRejection(this.operation, pending.method, reported.code, reported.message));
			}
			#complete(id, pending) {
				pending.dispose();
				this.#pending.delete(id);
			}
			#failPending(reason) {
				const wasProtocolFailed = this.#protocolFailed;
				if (reason !== "protocol_error") this.#closed = true;
				else this.#protocolFailed = true;
				for (const [id, pending] of this.#pending) {
					this.#complete(id, pending);
					pending.reject(this.#transportError(reason));
				}
				if (reason === "protocol_error" && !wasProtocolFailed) {
					const error = this.#transportError(reason);
					for (const listener of this.#protocolFailureListeners) listener(error);
					this.#protocolFailureListeners.clear();
				}
			}
			#disconnect(reason = "disconnected") {
				const wasClosed = this.#closed;
				if (!wasClosed) this.#transportFailure = reason;
				this.#failPending(reason);
				if (wasClosed) return;
				const error = this.#transportError(reason);
				for (const listener of this.#disconnectListeners) listener(error);
				this.#disconnectListeners.clear();
			}
			#transportError(reason) {
				return new BrowserObservationError(this.operation, reason, reason === "payload_limit" ? { detail: noRuntimeOverrideSentence(`CDP message exceeded the ${String(this.maxPayloadBytes)} byte protocol budget.`, cdpCommandTimeoutUnrelatedControl(this.operation)) } : undefined);
			}
		};
		socketIsClosed = (socket) => socket.readyState === WebSocket.CLOSED;
		rawText = (data) => Array.isArray(data) ? Buffer.concat(data).toString("utf8") : Buffer.isBuffer(data) ? data.toString("utf8") : Buffer.from(data).toString("utf8");
		rawByteLength = (data) => Array.isArray(data) ? data.reduce((bytes, chunk) => bytes + chunk.byteLength, 0) : data.byteLength;
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		waitForOpen = async (socket, operation, signal, commandTimeoutMs = DEFAULT_CDP_COMMAND_TIMEOUT_MS) => await new Promise((resolve, reject) => {
			const onOpen = () => {
				cleanup();
				resolve();
			};
			const onFailure = (cause) => {
				cleanup();
				reject(new BrowserObservationError(operation, "endpoint_unreachable", { cause }));
			};
			const onClose = (code, reason) => {
				onFailure(new Error(`CDP WebSocket closed before opening (${code}: ${reason.toString("utf8")})`));
			};
			const onAbort = () => {
				cleanup();
				terminateSocket(socket);
				reject(new AnalysisCancelledError(operation, { cause: signal?.reason }));
			};
			const cleanup = () => {
				clearTimeout(timer);
				socket.off("open", onOpen);
				socket.off("error", onFailure);
				socket.off("close", onClose);
				signal?.removeEventListener("abort", onAbort);
			};
			const timer = setTimeout(() => {
				terminateSocket(socket);
				cleanup();
				const recovery = cdpCommandDeadlineRecovery(commandTimeoutMs, "handshake", undefined, cdpCommandTimeoutIsSelectable(operation));
				reject(new BrowserObservationError(operation, "timeout", {
					detail: recovery.userMessage,
					remediationAction: recovery.remediationAction
				}));
			}, commandTimeoutMs);
			socket.once("open", onOpen);
			socket.once("error", onFailure);
			socket.once("close", onClose);
			signal?.addEventListener("abort", onAbort, { once: true });
			if (signal?.aborted === true) onAbort();
		});
		terminateSocket = (socket) => {
			try {
				socket.terminate();
			} catch {}
		};
	})))();
}

//#endregion
//#region dist/browser/CdpTargetSessionOwner.js
var CdpTransportCleanupFailure, bindCdpTransportCleanup, CdpTargetSessionOwner, cleanupError, aggregateCleanupFailures;
function init_CdpTargetSessionOwner() {
	return (init_CdpTargetSessionOwner = __esmMin((() => {
		init_AnalysisCleanupLease();
		init_analysisErrorBase();
		init_providerCleanupError();
		init_analysisErrorCore();
		init_analysisErrorCleanup();
		init_CdpConnection();
		CdpTransportCleanupFailure = class extends ProviderCleanupError {
			cleanupLeases;
			constructor(cleanupLeases, failure) {
				super("rea-cdp-browser", failure.resources, failure.diagnostics, {
					operation: failure.operation,
					cause: failure.cause
				});
				this.cleanupLeases = cleanupLeases;
				new AnalysisCleanupLeaseGroup(this, cleanupLeases);
			}
		};
		bindCdpTransportCleanup = (cause, failure) => {
			if (cause instanceof CdpTransportCleanupFailure) new AnalysisCleanupLeaseGroup(failure, cause.cleanupLeases);
			return failure;
		};
		CdpTargetSessionOwner = class {
			#connections = new Map();
			#closing = false;
			#admissions = 0;
			#closePromise;
			#admissionWaiters = new Set();
			/** Admit and own one WebSocket from handshake completion onward. */
			async connect(url, operation, options, resource, limits) {
				if (this.#closing) throw new ProviderCleanupError("rea-cdp-browser", [resource], { reason: "CDP provider is closing and cannot admit another session." }, { operation });
				await this.retryPending();
				if (this.#closing) throw new ProviderCleanupError("rea-cdp-browser", [resource], { reason: "CDP provider is closing and cannot admit another session." }, { operation });
				if (options.signal?.aborted === true) throw new AnalysisCancelledError(operation, { cause: options.signal.reason });
				this.#admissions += 1;
				let connection;
				try {
					return await CdpConnection.connect(url, operation, options.signal, limits, (opened) => {
						connection = opened;
						this.register(opened, operation, resource);
					});
				} catch (cause) {
					if (connection === undefined) throw cause;
					try {
						await this.finish(connection);
					} catch (cleanupCause) {
						if (cause instanceof AnalysisError && cleanupCause instanceof AnalysisError) throw bindCdpTransportCleanup(cleanupCause, analysisErrorWithCleanupFailure(cause, cleanupCause, operation));
						throw new AggregateError([cause, cleanupCause], `CDP operation ${operation} failed during handshake and cleanup remains incomplete.`, { cause });
					}
					throw cause;
				} finally {
					this.#admissions -= 1;
					if (this.#admissions === 0) {
						for (const resolve of this.#admissionWaiters) resolve();
						this.#admissionWaiters.clear();
					}
				}
			}
			/** Register synchronously before awaiting the WebSocket handshake. */
			register(connection, operation, resource) {
				let settle = () => undefined;
				const settled = new Promise((resolve) => {
					settle = resolve;
				});
				this.#connections.set(connection, {
					connection,
					operation,
					resource,
					cleanupLease: new AnalysisCleanupLease(() => connection.close(), [resource]),
					active: true,
					settled,
					settle,
					cleanup: undefined,
					cleanupAttempted: false,
					failure: undefined
				});
			}
			/** Finish one admitted operation, retaining a failed transport for retry. */
			async finish(connection, cleanup) {
				const record = this.#connections.get(connection);
				if (record === undefined) return;
				if (record.failure !== undefined) throw record.failure;
				record.cleanup ??= cleanup;
				try {
					if (!record.cleanupAttempted && record.cleanup !== undefined) {
						record.cleanupAttempted = true;
						await record.cleanup();
					}
					await record.cleanupLease.release();
					this.#connections.delete(connection);
				} catch (cause) {
					const failure = cleanupError(record, cause);
					record.failure = failure;
					throw failure;
				} finally {
					record.active = false;
					record.settle();
				}
			}
			/** Retry only retained failed transports; active peers finish their own cleanup. */
			async close() {
				this.#closing = true;
				this.#closePromise ??= this.#closeAll().catch((cause) => {
					this.#closePromise = undefined;
					throw cause;
				});
				return await this.#closePromise;
			}
			/** Retry retained failures without touching concurrently active sessions. */
			async retryPending() {
				const failures = [];
				for (const record of this.#connections.values()) {
					if (record.active || record.failure === undefined) continue;
					try {
						await record.cleanupLease.release();
						this.#connections.delete(record.connection);
					} catch (cause) {
						const failure = cleanupError(record, cause);
						record.failure = failure;
						failures.push(failure);
					}
				}
				if (failures.length === 1) throw failures[0];
				if (failures.length > 1) throw aggregateCleanupFailures(failures);
			}
			async #closeAll() {
				while (this.#admissions > 0) await new Promise((resolve) => this.#admissionWaiters.add(resolve));
				while (true) {
					const active = [...this.#connections.values()].filter(({ active }) => active);
					if (active.length === 0) break;
					await Promise.all(active.map(({ settled }) => settled));
				}
				const failures = [];
				for (const record of this.#connections.values()) {
					try {
						await record.cleanupLease.release();
						this.#connections.delete(record.connection);
					} catch (cause) {
						const failure = cleanupError(record, cause);
						record.failure = failure;
						failures.push(failure);
					}
				}
				if (failures.length === 1) throw failures[0];
				if (failures.length > 1) throw aggregateCleanupFailures(failures);
			}
		};
		cleanupError = (record, cause) => new CdpTransportCleanupFailure([record.cleanupLease], {
			resources: [record.resource],
			operation: record.operation,
			cause,
			diagnostics: { reason: cause instanceof AnalysisError ? cause.userMessage ?? cause.message : cause instanceof Error ? cause.message : String(cause) }
		});
		aggregateCleanupFailures = (failures) => new CdpTransportCleanupFailure(failures.flatMap((failure) => failure.cleanupLeases), {
			resources: failures.flatMap(({ cleanupResources }) => cleanupResources),
			operation: "close_cdp_transports",
			cause: new AggregateError(failures, "One or more REA-owned CDP transports remain open."),
			diagnostics: { failures: failures.map(({ message, diagnostics }) => ({
				message,
				diagnostics: diagnostics ?? {}
			})) }
		});
	})))();
}

//#endregion
//#region dist/browser/CdpScriptContextFacts.js
var integer, contextAuxDataSchema, scriptDeclaration, contextDeclaration, runtimeScriptParsedSchema, runtimeContextSchema, storageScriptParsedSchema, storageContextSchema, storageContextDestroyedSchema, cdpContextFrameClaim, contextIdentity, readCdpExecutionContextCreated, readCdpExecutionContextDestroyed, readCdpScriptParsed, selectCdpScriptFrame;
function init_CdpScriptContextFacts() {
	return (init_CdpScriptContextFacts = __esmMin((() => {
		init_CdpCaptureValues();
		init_cdpObservationSchemas();
		integer = z.int().min(0);
		contextAuxDataSchema = z.object({
			frameId: z.string().optional(),
			isDefault: z.boolean().optional(),
			type: z.string().optional()
		}).passthrough();
		scriptDeclaration = z.object({
			scriptId: z.string(),
			url: z.string(),
			executionContextId: z.number()
		});
		contextDeclaration = z.object({
			id: z.number(),
			origin: z.string().optional(),
			name: z.string().optional(),
			uniqueId: z.string().optional(),
			auxData: contextAuxDataSchema.optional()
		});
		runtimeScriptParsedSchema = scriptDeclaration.extend({
			scriptId: z.string().min(1),
			executionContextId: integer,
			startLine: integer,
			startColumn: cdpResourceColumnSchema,
			endLine: integer,
			endColumn: cdpResourceColumnSchema,
			hash: z.string().optional(),
			sourceMapURL: z.string().optional(),
			hasSourceURL: z.boolean().optional(),
			scriptLanguage: z.string().optional(),
			executionContextAuxData: contextAuxDataSchema.optional()
		});
		runtimeContextSchema = z.object({ context: contextDeclaration.extend({ id: integer }).passthrough() });
		storageScriptParsedSchema = scriptDeclaration;
		storageContextSchema = z.object({ context: contextDeclaration.pick({
			id: true,
			origin: true,
			name: true,
			auxData: true
		}).required({
			origin: true,
			name: true
		}).extend({ auxData: contextAuxDataSchema.pick({ frameId: true }).strip().optional() }) });
		storageContextDestroyedSchema = z.object({ executionContextId: z.number() });
		cdpContextFrameClaim = (auxiliary) => {
			if (auxiliary === undefined) return {
				state: "missing",
				frameId: undefined
			};
			const value = recordValue(auxiliary);
			if (value === undefined) return {
				state: "invalid",
				frameId: undefined
			};
			if (value.frameId === undefined) return {
				state: "missing",
				frameId: undefined
			};
			const frameId = cdpStringValue(value.frameId);
			return {
				state: frameId === undefined || frameId === "" ? "invalid" : "observed",
				frameId
			};
		};
		contextIdentity = (reported) => {
			const id = numberValue(reported);
			return {
				id,
				contextKey: id !== undefined && Number.isSafeInteger(id) ? String(id) : null
			};
		};
		readCdpExecutionContextCreated = (params) => {
			const context = recordValue(recordValue(params)?.context);
			return {
				...contextIdentity(context?.id),
				name: cdpStringValue(context?.name),
				origin: cdpStringValue(context?.origin),
				frameClaim: cdpContextFrameClaim(context?.auxData)
			};
		};
		readCdpExecutionContextDestroyed = (params) => contextIdentity(recordValue(params)?.executionContextId);
		readCdpScriptParsed = (params) => {
			const value = recordValue(params);
			const identity = contextIdentity(value?.executionContextId);
			const length = numberValue(value?.length);
			return {
				scriptId: cdpStringValue(value?.scriptId),
				url: cdpStringValue(value?.url),
				contextId: identity.id,
				contextKey: identity.contextKey,
				metadata: {
					hash: cdpStringValue(value?.hash) ?? null,
					length: length !== undefined && Number.isSafeInteger(length) && length >= 0 ? length : null,
					isModule: typeof value?.isModule === "boolean" ? value.isModule : null,
					language: cdpStringValue(value?.scriptLanguage) ?? null
				},
				frameClaim: cdpContextFrameClaim(value?.executionContextAuxData),
				hasSourceUrl: typeof value?.hasSourceURL === "boolean" ? value.hasSourceURL : null,
				invalidHasSourceUrl: value?.hasSourceURL !== undefined && typeof value.hasSourceURL !== "boolean",
				sourceMapUrl: value?.sourceMapURL
			};
		};
		selectCdpScriptFrame = (script, context) => {
			const invalid = script.state === "invalid" || context?.state === "invalid";
			const conflicting = script.state === "observed" && context?.state === "observed" && script.frameId !== context.frameId;
			return {
				frameId: invalid || conflicting ? null : script.frameId ?? context?.frameId ?? null,
				invalid,
				conflicting
			};
		};
	})))();
}

//#endregion
export { admitRecords as A, requiredScriptSource as B, init_CdpEndpoint as C, init_CdpDiscoveryTargets as D, withCdpDiscoveryDeadline as E, isHttpUrl as F, sourceExcluded as H, numberValue as I, recordValue as L, cdpStringValue as M, delayWithCancellation as N, parseCdpDiscoveryTargets as O, init_CdpCaptureValues as P, recordsValue as R, hasCdpTargetWebSocket as S, readCdpJson as T, sourceResult as U, resourceContentSize as V, CdpCommandRejection as _, readCdpScriptParsed as a, discoverCdpBrowserSocket as b, selectCdpScriptFrame as c, storageScriptParsedSchema as d, CdpTargetSessionOwner as f, init_CdpConnection as g, CdpConnection as h, readCdpExecutionContextDestroyed as i, allowedSanitizedUrl as j, selectCdpDiscoveryTarget as k, storageContextDestroyedSchema as l, init_CdpTargetSessionOwner as m, init_CdpScriptContextFacts as n, runtimeContextSchema as o, bindCdpTransportCleanup as p, readCdpExecutionContextCreated as r, runtimeScriptParsedSchema as s, cdpContextFrameClaim as t, storageContextSchema as u, init_CdpCommandRejection as v, parseCdpEndpointValue as w, discoverCdpEndpoint as x, cdpTargetWebSocket as y, requiredRecord as z };