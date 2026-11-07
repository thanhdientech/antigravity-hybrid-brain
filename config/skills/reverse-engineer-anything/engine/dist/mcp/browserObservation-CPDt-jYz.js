import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_analysisErrorBase, t as AnalysisError } from "./analysisErrorBase-DIqf4-vY.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { $ as BrowserObservationError, Ht as safeParseJson, Vt as init_safeJson, X as init_providerAdapterError, Y as ProviderAdapterError, tt as init_browserObservationError } from "./analysisErrorProjection-B_6dTGtM.js";
import { d as AnalysisUnsupportedTargetError, f as init_analysisErrorCore, i as AnalysisCancelledError, l as AnalysisResourceConstraintError, o as AnalysisInputError } from "./analysisErrorCore-BCqhUcUc.js";
import { i as jsonValueSchema, n as init_jsonValue } from "./jsonValue-CbQQraup.js";
import { a as init_browserObservation$1, p as sanitizeBrowserUrl } from "./browserObservation-DGb-Qd7N.js";
import { d as init_browserDeadline, f as noRuntimeOverrideSentence, h as selectedCdpCommandTimeoutMs, m as selectedBrowserDeadlineMs } from "./browserDeadline-YXJtM4nx.js";
import { n as digestCanonicalValue, r as init_canonicalDigest } from "./canonicalDigest-D42kAGaz.js";
import { a as jsonByteLength, i as init_jsonSerialization } from "./jsonSerialization-CtVI6orp.js";
import { $ as authorizedMainFrame, At as init_CdpCaptureEventHelpers, Ba as browserCaptureComparisonSchema, Bt as scopeCdpResponse, Ca as semanticImportEqualsSpecifier, Ct as cdpFrameEventFacts, Da as readExactJavaScriptLiteral, Dt as cdpSourceCoordinates, Ea as isNullishJavaScriptSyntax, Et as selectCdpFrameIdentity, Ft as init_CdpNetworkEventFacts, G as init_CdpAuthorizedTarget, Ga as stableWebResources, Gt as openCdpEndpoint, H as cdpTargetEventMatches, Ha as init_browserCaptureComparison, Ht as closeCdpTargetSession, It as readCdpLoadingFailed, J as classifySourceMapSection, Ja as webMcpDiscoverySchema, K as hasScheme, Ka as stableWebScriptKey, Kt as openCdpTargetSession, L as CDP_BROWSER_PROVIDER_IDENTITY, Lt as readCdpLoadingFinished, Mt as isJsonContentType, Nt as isJsonMediaType, Oa as staticObjectProperty, Ot as consolePrimitive, Pt as topCallFrame, Q as sourceMapMappingsSchema, Rt as readCdpRequestWillBeSent, Sa as init_javascriptModuleDeclaration, St as init_CdpOriginScopeError, Ta as init_javascriptAstValues, Tt as init_CdpFrameIdentity, U as init_CdpTargetEvents, Ua as createCapturedWebScriptReconciler, V as init_providerIdentities, Va as compareBrowserCaptures, Vt as attachCdpTargetSession, W as authorizeCdpTarget, Wa as init_webInventory, Wt as init_CdpTargetSession, X as init_sourceMapEnvelope, Xa as webObservationSessionSchema, Y as classifySourceMapSections, Ya as init_browserSession, Z as sourceMapJsonText, _a as init_javascriptSourceParser, ba as init_javascriptSemanticTraversal, ct as init_CdpCaptureDocuments, da as analyzeParsedJavaScriptReferences, dt as observeMainFrameUrl, et as init_CdpAuthorizedMainFrame, fa as init_javascriptSemanticAnalysis, ga as stringValue, ha as init_javascriptStaticAnalysisHelpers, ht as init_CdpCaptureDomNamespaces, it as captureResources, jt as initiatorLocation, kt as exclusionReasonForUrl, la as WEB_SOURCE_MAP_LIMITS, lt as mainFrameUrl, mt as capturedSvgNodeKind, nt as captureDom, ot as classifyCdpFrameUrl, pt as walkFrameTrees, q as init_artifactPathSyntax, qa as init_webMcpDiscovery, rt as captureFrames, tt as captureAccessibility, ua as init_webSourceLocation, ut as observeCdpFrameUrl, va as parseJavaScriptSource, wa as semanticStaticModuleSource, wt as cdpFrameRecordFacts, xa as traverseJavaScriptAst, xt as cdpOriginScopeRefusal, zt as readCdpResponseReceived } from "./createServer-CMxQrH3I.js";
import { a as inferJsonShape, i as webPageInspectionSchema, o as init_jsonShape, r as init_browserObservationSchemas, t as browserTargetListSchema } from "./browserObservationSchemas-BmFQ_kVQ.js";
import { n as compositeKey, r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { n as jsonValueByteLength, t as init_jsonValueByteLength } from "./jsonValueByteLength-D_Ap3bp9.js";
import { O as init_stringPatterns, _ as webScreenshotDiffSchema, g as init_webScreenshot, h as decodeCanonicalBase64, k as isPaddedBase64, m as createWebScreenshotArtifact, v as webScreenshotSchema } from "./browserScenarioCapture-CDvdl0k0.js";
import { _ as webSourceMapsSchema, s as init_webBundleAnalysis, t as DEFAULT_SOURCE_MAP_FETCH_TIMEOUT_MS } from "./webBundleAnalysis-CMBlS1D9.js";
import { o as createWebTextArtifact, s as init_webContentArtifact } from "./cdpObservationSchemas-Bu-3wMbg.js";
import { f as init_javascriptSourceMapPaths, h as resolveJavaScriptSourceMapUrl, i as readPngIhdrFacts, n as init_pngHeader, r as readPngHeaderDimensions, t as hasPngSignature } from "./pngHeader-B4bhYQHi.js";
import { n as init_analysisErrorCleanup, t as analysisErrorWithCleanupFailure } from "./analysisErrorCleanup-CLocSgSR.js";
import { n as init_providerCleanupError, t as ProviderCleanupError } from "./providerCleanupError-CbzQ5mbk.js";
import { n as init_webRuntime, t as WEB_RUNTIME_LIMITS } from "./webRuntime-D-rId2Bd.js";
import { r as init_IsolatedWebBundleAnalyzer, t as IsolatedWebBundleAnalyzer } from "./IsolatedWebBundleAnalyzer-dKQJ1kIK.js";
import { A as admitRecords, C as init_CdpEndpoint, F as isHttpUrl, H as sourceExcluded, I as numberValue, L as recordValue, M as cdpStringValue, N as delayWithCancellation, P as init_CdpCaptureValues, R as recordsValue, S as hasCdpTargetWebSocket, _ as CdpCommandRejection, a as readCdpScriptParsed, c as selectCdpScriptFrame, f as CdpTargetSessionOwner, g as init_CdpConnection, i as readCdpExecutionContextDestroyed, j as allowedSanitizedUrl, m as init_CdpTargetSessionOwner, n as init_CdpScriptContextFacts, p as bindCdpTransportCleanup, r as readCdpExecutionContextCreated, v as init_CdpCommandRejection } from "./CdpScriptContextFacts-CX5wj9M3.js";
import { a as init_CdpScriptSourceCapture, c as init_CdpOptionalCommand, d as init_CdpCaptureEventTypes, f as CdpCaptureCompleteness, i as capturePassiveCdpScriptSource, l as optionalCdpCommand, n as parseCdpWorkerTarget, o as CdpScriptSourceBudget, p as init_CdpCaptureCompleteness, r as workerTargetOwnership, s as init_CdpScriptSourceBudget, t as init_CdpWorkerTarget, u as CDP_CAPTURE_SCRIPT_METADATA_LIMITS } from "./CdpWorkerTarget-DzRup2lG.js";
import { z } from "zod";
import { createHash } from "node:crypto";
import canonicalize from "canonicalize";
import { constants, crc32, inflateSync } from "node:zlib";
import * as t from "@babel/types";
import { TraceMap, decodedMappings } from "@jridgewell/trace-mapping";

//#region dist/domain/webSourceMapCoverage.js
var sourceMapsWithCaptureExclusions;
function init_webSourceMapCoverage() {
	return (init_webSourceMapCoverage = __esmMin((() => {
		init_webBundleAnalysis();
		sourceMapsWithCaptureExclusions = (sourceMaps, exclusions) => {
			const excluded = exclusions.flatMap((exclusion) => exclusion.section === "source_maps" && exclusion.count !== 0 ? [{
				...exclusion,
				section: "source_maps"
			}] : []);
			if (excluded.length === 0) return sourceMaps;
			const summary = excluded.map(({ reason, count }) => `${count === null ? "An unknown number of" : String(count)} source-map declaration(s) excluded during capture: ${reason}.`).join(" ");
			return webSourceMapsSchema.parse({
				...sourceMaps,
				status: sourceMaps.items.some(({ status }) => status === "included" || status === "partial") ? "partial" : "unavailable",
				excluded,
				limitation: [sourceMaps.limitation, summary].filter((value) => value !== undefined).join(" ")
			});
		};
	})))();
}

//#endregion
//#region dist/domain/paddedBase64.js
var paddedBase64ByteLength, decodePaddedBase64;
function init_paddedBase64() {
	return (init_paddedBase64 = __esmMin((() => {
		init_stringPatterns();
		paddedBase64ByteLength = (value) => {
			if (!isPaddedBase64(value)) return undefined;
			return Buffer.byteLength(value, "base64");
		};
		decodePaddedBase64 = (value) => paddedBase64ByteLength(value) === undefined ? undefined : Buffer.from(value, "base64");
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureEventBodyShapes.js
var ingestResponseBodyShape, requestBodyShape, updateResponseBodyShape, releaseBodyShapes, invalidResponseBodyShape;
function init_CdpCaptureEventBodyShapes() {
	return (init_CdpCaptureEventBodyShapes = __esmMin((() => {
		init_jsonShape();
		init_webRuntime();
		init_paddedBase64();
		init_CdpCaptureValues();
		init_CdpCaptureEventHelpers();
		ingestResponseBodyShape = (state, requestId, value) => {
			if (!state.network.has(requestId)) return;
			const result = recordValue(value);
			const body = cdpStringValue(result?.body);
			const base64Encoded = result?.base64Encoded;
			if (body === undefined || typeof base64Encoded !== "boolean") {
				invalidResponseBodyShape(state, requestId);
				return;
			}
			const decoded = base64Encoded ? decodePaddedBase64(body) : body;
			if (decoded === undefined) {
				invalidResponseBodyShape(state, requestId);
				return;
			}
			const previousBytes = state.bodyShapeBytesByRequestId.get(requestId)?.response ?? 0;
			const parsed = inferJsonShape(decoded, WEB_RUNTIME_LIMITS.retainedEventBytes - state.retainedEventBytes + previousBytes);
			if (!parsed.ok) {
				if (parsed.error.kind === "capacity") state.completeness.exclude("json_body_shapes", "resource_budget_exhausted");
				else state.completeness.unavailable("json_body_shapes");
			}
			updateResponseBodyShape(state, requestId, parsed.ok ? parsed.value : null);
		};
		requestBodyShape = (state, requestId, request) => {
			releaseBodyShapes(state, requestId);
			if (!state.input.include_json_body_shapes) return {
				status: "not_approved",
				request: null,
				response: null
			};
			const headers = recordValue(request.headers);
			const json = isJsonContentType(headers);
			const body = cdpStringValue(request.postData);
			const parsed = json && body !== undefined ? inferJsonShape(body, WEB_RUNTIME_LIMITS.retainedEventBytes - state.retainedEventBytes) : undefined;
			const shape = parsed?.ok ? parsed.value.shape : null;
			const expected = json && (body !== undefined || request.hasPostData === true);
			if (expected && shape === null) {
				state.missingRequestBodyShapeIds.add(requestId);
				if (parsed !== undefined && !parsed.ok && parsed.error.kind === "capacity") state.completeness.exclude("json_body_shapes", "resource_budget_exhausted");
				else state.completeness.unavailable("json_body_shapes");
			}
			if (parsed?.ok) {
				state.bodyShapeBytesByRequestId.set(requestId, {
					request: parsed.value.serializedBytes,
					response: 0
				});
				state.retainedEventBytes += parsed.value.serializedBytes;
			}
			return {
				status: shape === null ? "unavailable" : "included",
				request: shape,
				response: null
			};
		};
		updateResponseBodyShape = (state, requestId, response) => {
			const current = state.network.get(requestId);
			if (current === undefined) return;
			const previous = state.bodyShapeBytesByRequestId.get(requestId);
			const responseBytes = response?.serializedBytes ?? 0;
			const requestBytes = previous?.request ?? 0;
			state.retainedEventBytes += responseBytes - (previous?.response ?? 0);
			if (requestBytes + responseBytes === 0) state.bodyShapeBytesByRequestId.delete(requestId);
			else state.bodyShapeBytesByRequestId.set(requestId, {
				request: requestBytes,
				response: responseBytes
			});
			const request = current.body_shapes.request;
			const status = response !== null ? state.missingRequestBodyShapeIds.has(requestId) ? "partial" : "included" : request !== null ? "partial" : "unavailable";
			state.network.set(requestId, {
				...current,
				body_shapes: {
					status,
					request,
					response: response?.shape ?? null
				}
			});
		};
		releaseBodyShapes = (state, requestId) => {
			state.missingRequestBodyShapeIds.delete(requestId);
			const previous = state.bodyShapeBytesByRequestId.get(requestId);
			if (previous === undefined) return;
			state.retainedEventBytes -= previous.request + previous.response;
			state.bodyShapeBytesByRequestId.delete(requestId);
		};
		invalidResponseBodyShape = (state, requestId) => {
			updateResponseBodyShape(state, requestId, null);
			state.completeness.exclude("json_body_shapes", "invalid_protocol_value");
		};
	})))();
}

//#endregion
//#region dist/browser/StructuredFieldToken.js
var token, key, bareItem, structuredFieldToken;
function init_StructuredFieldToken() {
	return (init_StructuredFieldToken = __esmMin((() => {
		token = /[A-Za-z*][A-Za-z0-9!#$%&'*+.^_`|~:/\x2d]*/uy;
		key = /[a-z*][a-z0-9_.*\x2d]*/uy;
		bareItem = /(?:[A-Za-z*][A-Za-z0-9!#$%&'*+.^_`|~:/\x2d]*|"(?:[\x20-\x21\x23-\x5b\x5d-\x7e]|\\["\\])*"|-?[0-9]{1,12}\.[0-9]{1,3}|-?[0-9]{1,15}|\?[01]|@-?[0-9]{1,15}|:(?<bytes>[A-Za-z0-9+/]*={0,2}):|%"(?<display>(?:[\x20-\x21\x23-\x24\x26-\x7e]|%[0-9a-f]{2})*)")/uy;
		structuredFieldToken = (value) => {
			if (value === undefined) return null;
			let cursor = 0;
			while (value[cursor] === " ") cursor += 1;
			token.lastIndex = cursor;
			const declared = token.exec(value)?.[0];
			if (declared === undefined) return null;
			cursor = token.lastIndex;
			while (value[cursor] === ";") {
				cursor += 1;
				while (value[cursor] === " ") cursor += 1;
				key.lastIndex = cursor;
				if (key.exec(value) === null) return null;
				cursor = key.lastIndex;
				if (value[cursor] !== "=") continue;
				bareItem.lastIndex = cursor + 1;
				const parameter = bareItem.exec(value);
				if (parameter === null) return null;
				cursor = bareItem.lastIndex;
				const bytes = parameter.groups?.bytes;
				if (bytes !== undefined) {
					const padded = bytes.endsWith("=");
					if (padded ? bytes.length % 4 !== 0 : bytes.length % 4 === 1) return null;
				}
				const display = parameter.groups?.display;
				if (display !== undefined) {
					try {
						decodeURIComponent(display);
					} catch {
						return null;
					}
				}
			}
			while (value[cursor] === " ") cursor += 1;
			return cursor === value.length ? declared : null;
		};
	})))();
}

//#endregion
//#region dist/browser/CdpSafeMetadata.js
var safeResponseMetadata, normalizedHeaders, parseCsp, cspSource, cspHostSourceOrigin, schemeOf, parseLinks, splitLinkHeader, trimHttpWhitespace, linkParameters, firstLinkParameter, lastLinkParameter, safeDestination, permissionFeatures, wellKnownHint, agentHint, isAgentRel, referrerPolicies, referrerPolicy, policyToken, contentLength, boundedHeader, mediaTypeDeclaration, decodeLinkParameter, agentHeaderNames, wellKnownAgentPaths;
function init_CdpSafeMetadata() {
	return (init_CdpSafeMetadata = __esmMin((() => {
		init_browserObservation$1();
		init_StructuredFieldToken();
		safeResponseMetadata = (requestId, url, response, allowedOrigins) => {
			const headers = normalizedHeaders(response.headers);
			const field = (name) => headers.get(name)?.join(", ");
			const responseUrl = response.url?.source ?? url;
			const parsedLinks = parseLinks(headers.get("link"), responseUrl, allowedOrigins);
			const links = parsedLinks.map(({ metadata }) => metadata);
			const csp = parseCsp(headers.get("content-security-policy"), url, allowedOrigins);
			const agentHints = [
				...parsedLinks.flatMap(({ metadata, contextMatchesResponse }) => contextMatchesResponse && metadata.rel.some(isAgentRel) ? [agentHint("link_rel", metadata.rel.join(" "), metadata.href)] : []),
				...agentHeaderNames.flatMap((name) => headers.has(name) ? [agentHint("response_header", name, null)] : []),
				...wellKnownHint(url)
			];
			return {
				response: {
					request_id: requestId,
					url,
					mime_type: mediaTypeDeclaration(response.mimeType),
					content_length: contentLength(field("content-length")),
					content_encoding: boundedHeader(field("content-encoding")),
					csp,
					links,
					policies: {
						coop: structuredFieldToken(field("cross-origin-opener-policy")),
						coep: structuredFieldToken(field("cross-origin-embedder-policy")),
						corp: policyToken(field("cross-origin-resource-policy")),
						referrer_policy: referrerPolicy(field("referrer-policy")),
						x_content_type_options: policyToken(field("x-content-type-options")),
						permissions_policy_features: permissionFeatures(field("permissions-policy"))
					}
				},
				agentHints
			};
		};
		normalizedHeaders = (value) => {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return new Map();
			const headers = new Map();
			for (const [name, raw] of Object.entries(value)) {
				const normalized = name.toLowerCase();
				const header = typeof raw === "string" ? raw : typeof raw === "number" && Number.isFinite(raw) ? String(raw) : undefined;
				if (header !== undefined) headers.set(normalized, [...headers.get(normalized) ?? [], ...header.split(/\r?\n/u)]);
			}
			return headers;
		};
		parseCsp = (lines, baseUrl, allowedOrigins) => {
			const directives = [];
			let nonceCount = 0;
			let hashCount = 0;
			const policies = (lines ?? []).flatMap((line) => line.split(","));
			for (const policy of policies) {
				const names = new Set();
				for (const rawDirective of policy.split(";")) {
					if (/[^\x00-\x7f]/u.test(rawDirective)) continue;
					const [rawName, ...tokens] = rawDirective.replace(/^[\t\n\f\r ]+|[\t\n\f\r ]+$/gu, "").split(/[\t\n\f\r ]+/u);
					const name = (rawName ?? "").toLowerCase();
					if (!/^[a-z][a-z0-9\x2d]*$/u.test(name) || names.has(name)) continue;
					names.add(name);
					const sources = [];
					for (const token of tokens) {
						const lower = token.toLowerCase();
						if (lower.startsWith("'nonce-")) {
							nonceCount += 1;
							continue;
						}
						if (lower.startsWith("'sha256-") || lower.startsWith("'sha384-") || lower.startsWith("'sha512-")) {
							hashCount += 1;
							continue;
						}
						sources.push(cspSource(token, baseUrl, allowedOrigins));
					}
					directives.push({
						name,
						sources
					});
				}
			}
			return {
				directives,
				nonce_count: nonceCount,
				hash_count: hashCount
			};
		};
		cspSource = (token, baseUrl, allowedOrigins) => {
			const lower = token.toLowerCase();
			if (/^'[a-z0-9\x2d]+'$/u.test(lower)) return {
				kind: "keyword",
				value: lower
			};
			if (/^[a-z][a-z0-9+.\x2d]*:$/u.test(lower)) return {
				kind: "scheme",
				value: lower
			};
			const hostOrigin = cspHostSourceOrigin(token, baseUrl);
			if (hostOrigin === undefined) return {
				kind: "other",
				value: null
			};
			return hostOrigin !== null && allowedOrigins.has(hostOrigin) ? {
				kind: "approved_origin",
				value: hostOrigin
			} : {
				kind: "external_origin",
				value: null
			};
		};
		cspHostSourceOrigin = (token, baseUrl) => {
			const match = /^(?:([a-z][a-z0-9+.\x2d]*):\/\/)?([^\x2f?#]+)(?:\/[^?#]*)?$/iu.exec(token);
			const authority = match?.[2];
			if (authority === undefined || authority.length === 0) return undefined;
			const scheme = (match?.[1] ?? schemeOf(baseUrl))?.toLowerCase();
			if (scheme === undefined || !/^[a-z][a-z0-9+.\x2d]*$/u.test(scheme)) return undefined;
			if (!/^(?:\*|(?:\*\.)?[a-z0-9\x2d]+(?:\.[a-z0-9\x2d]+)*\.?)(?::(?:\*|\d+))?$/iu.test(authority)) return undefined;
			if (authority.includes("*")) return null;
			try {
				const parsed = new URL(`${scheme}://${authority}`);
				return parsed.username === "" && parsed.password === "" && parsed.pathname === "/" && parsed.origin !== "null" ? parsed.origin : undefined;
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		schemeOf = (baseUrl) => {
			try {
				return new URL(baseUrl).protocol.replace(/:$/u, "");
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		parseLinks = (lines, responseUrl, allowedOrigins) => {
			const links = [];
			const response = safeDestination(responseUrl, responseUrl, allowedOrigins);
			for (const line of lines ?? []) {
				for (const entry of splitLinkHeader(line)) {
					const match = /^[\t ]*<([^>]*)>(.*)$/u.exec(entry);
					if (match === null) continue;
					const parameters = linkParameters(match[2] ?? "");
					const anchor = firstLinkParameter(parameters, "anchor");
					const destination = safeDestination(match[1] ?? "", responseUrl, allowedOrigins);
					const context = anchor === undefined ? response : safeDestination(anchor.value, responseUrl, allowedOrigins);
					const rel = firstLinkParameter(parameters, "rel")?.value ?? "";
					links.push({
						metadata: {
							href: destination.url,
							destination_scope: destination.scope,
							context_url: context.url,
							context_scope: context.scope,
							rel: rel.toLowerCase().split(/[\t ]+/u).filter(Boolean),
							as: boundedHeader(lastLinkParameter(parameters, "as")?.value),
							type: mediaTypeDeclaration(firstLinkParameter(parameters, "type")?.value),
							crossorigin: boundedHeader(lastLinkParameter(parameters, "crossorigin")?.value)
						},
						contextMatchesResponse: response.identity !== undefined && context.identity === response.identity
					});
				}
			}
			return links;
		};
		splitLinkHeader = (value, delimiter = ",") => {
			const entries = [];
			let start = 0;
			let quoted = false;
			let escaped = false;
			let target = false;
			for (let index = 0; index < value.length; index += 1) {
				const character = value[index];
				if (quoted) {
					if (escaped) escaped = false;
					else if (character === "\\") escaped = true;
					else if (character === "\"") quoted = false;
					continue;
				}
				if (character === "\"" && !target) quoted = true;
				else if (delimiter === "," && character === "<") target = true;
				else if (delimiter === "," && character === ">") target = false;
				else if (character === delimiter && !target) {
					entries.push(value.slice(start, index));
					start = index + 1;
				}
			}
			entries.push(value.slice(start));
			return entries;
		};
		trimHttpWhitespace = (value) => value.replace(/^[\t ]+|[\t ]+$/gu, "");
		linkParameters = (value) => {
			const parameters = [];
			for (const raw of splitLinkHeader(value, ";").slice(1)) {
				const separator = raw.indexOf("=");
				const name = trimHttpWhitespace(separator < 0 ? raw : raw.slice(0, separator)).toLowerCase();
				if (!/^[a-z][a-z0-9\x2d]*$/u.test(name)) continue;
				const parameter = separator < 0 ? "" : trimHttpWhitespace(raw.slice(separator + 1));
				parameters.push({
					name,
					value: decodeLinkParameter(parameter)
				});
			}
			return parameters;
		};
		firstLinkParameter = (parameters, name) => parameters.find((parameter) => parameter.name === name);
		lastLinkParameter = (parameters, name) => {
			for (let index = parameters.length - 1; index >= 0; index -= 1) {
				const parameter = parameters[index];
				if (parameter?.name === name) return parameter;
			}
			return undefined;
		};
		safeDestination = (value, baseUrl, allowedOrigins) => {
			try {
				const parsed = new URL(value, baseUrl);
				const identity = parsed.href;
				const sanitized = sanitizeBrowserUrl(identity).url;
				if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return {
					identity,
					url: sanitized,
					scope: "unsupported"
				};
				if (!allowedOrigins.has(parsed.origin)) return {
					identity,
					url: sanitized,
					scope: "outside_policy"
				};
				return {
					identity,
					url: sanitized,
					scope: "approved"
				};
			} catch (cause) {
				void cause;
				return {
					identity: undefined,
					url: value,
					scope: "unsupported"
				};
			}
		};
		permissionFeatures = (value) => [...new Set((value ?? "").split(",").map((entry) => trimHttpWhitespace(entry.split("=", 1)[0] ?? "").toLowerCase()).filter((feature) => /^[a-z][a-z0-9\x2d]*$/u.test(feature)))].sort();
		wellKnownHint = (url) => {
			try {
				const path = new URL(url).pathname;
				return wellKnownAgentPaths.has(path) ? [agentHint("well_known_resource", path, sanitizeBrowserUrl(url).url)] : [];
			} catch (cause) {
				void cause;
				return [];
			}
		};
		agentHint = (mechanism, declaration, url) => ({
			mechanism,
			declaration,
			url,
			trust: "page-declared-untrusted"
		});
		isAgentRel = (value) => [
			"mcp",
			"model-context",
			"ai-plugin",
			"service-desc"
		].includes(value);
		referrerPolicies = new Set([
			"no-referrer",
			"no-referrer-when-downgrade",
			"same-origin",
			"origin",
			"strict-origin",
			"origin-when-cross-origin",
			"strict-origin-when-cross-origin",
			"unsafe-url"
		]);
		referrerPolicy = (value) => {
			let policy = null;
			for (const raw of (value ?? "").split(",")) {
				const token = trimHttpWhitespace(raw);
				if (token === "") continue;
				if (!/^[A-Za-z\x2d]+$/u.test(token)) return null;
				if (referrerPolicies.has(token)) policy = token;
			}
			return policy;
		};
		policyToken = (value) => {
			const token = trimHttpWhitespace(value ?? "").toLowerCase();
			return /^[a-z][a-z0-9_.\x2d]*$/u.test(token) ? token : null;
		};
		contentLength = (value) => {
			const token = trimHttpWhitespace(value ?? "");
			if (!/^[0-9]+$/u.test(token)) return null;
			const length = Number(token);
			return Number.isSafeInteger(length) ? length : null;
		};
		boundedHeader = (value) => value === undefined ? null : trimHttpWhitespace(value).toLowerCase();
		mediaTypeDeclaration = (value) => {
			if (value === undefined) return null;
			const declaration = trimHttpWhitespace(value);
			const separator = declaration.indexOf(";");
			return separator < 0 ? declaration.toLowerCase() : declaration.slice(0, separator).toLowerCase() + declaration.slice(separator);
		};
		decodeLinkParameter = (value) => {
			if (!value.startsWith("\"")) return value;
			let decoded = "";
			for (let index = 1; index < value.length; index += 1) {
				const character = value[index];
				if (character === "\\") {
					index += 1;
					if (index >= value.length) return decoded;
					decoded += value[index];
				} else if (character === "\"") {
					return decoded;
				} else {
					decoded += character;
				}
			}
			return decoded;
		};
		agentHeaderNames = [
			"x-model-context",
			"x-webmcp",
			"mcp-server"
		];
		wellKnownAgentPaths = new Set([
			"/.well-known/ai-plugin.json",
			"/.well-known/mcp",
			"/.well-known/model-context"
		]);
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureEventHandlers.js
var handleExecutionContextCreated, handleExecutionContextDestroyed, handleScriptParsed, scriptMetadataStringBytes, stringByteLength, RETAINED_EVENT_ENTRY_OVERHEAD_BYTES, RETAINED_EVENT_TEXT_VALUE_BYTES, sourceMapForScript, handleRequestWillBeSent, preserveMalformedRedirectEvidence, handleResponseReceived, handleLoadingFinished, handleConsoleAPICalled, captureConsoleText, handleWebSocketFrame, jsonShapeEnvelopeBytes, captureWebSocketShape, handleWebSocketCreated, handleFrameNavigated;
function init_CdpCaptureEventHandlers() {
	return (init_CdpCaptureEventHandlers = __esmMin((() => {
		init_CdpNetworkEventFacts();
		init_CdpScriptContextFacts();
		init_CdpFrameIdentity();
		init_browserObservation$1();
		init_jsonShape();
		init_jsonValueByteLength();
		init_result();
		init_paddedBase64();
		init_webRuntime();
		init_CdpSafeMetadata();
		init_CdpCaptureValues();
		init_CdpCaptureEventBodyShapes();
		init_CdpCaptureEventHelpers();
		init_CdpCaptureEventTypes();
		handleExecutionContextCreated = (state, params) => {
			const facts = readCdpExecutionContextCreated(params);
			if (facts.contextKey === null) return;
			state.executionContextFrames.set(facts.contextKey, facts.frameClaim);
		};
		handleExecutionContextDestroyed = (state, params) => {
			const key = readCdpExecutionContextDestroyed(params).contextKey;
			if (key !== null) state.executionContextFrames.delete(key);
		};
		handleScriptParsed = (state, params) => {
			const facts = readCdpScriptParsed(params);
			const scriptId = facts.scriptId;
			const rawUrl = facts.url ?? "";
			const sanitized = allowedSanitizedUrl(rawUrl, state.allowedOrigins);
			if (scriptId === undefined || scriptId === "") {
				state.completeness.exclude("scripts", "invalid_protocol_value");
				return;
			}
			const replacedBytes = state.scriptMetadataBytesById.get(scriptId) ?? 0;
			state.scriptMetadataBudgetOmissionsById.delete(scriptId);
			if (replacedBytes > 0) {
				state.scripts.delete(scriptId);
				state.scriptMetadataBytesById.delete(scriptId);
				state.retainedScriptMetadataBytes -= replacedBytes;
			}
			if (sanitized === undefined) {
				state.completeness.exclude("scripts", exclusionReasonForUrl(rawUrl));
				return;
			}
			const executionContext = facts.contextKey;
			const attribution = selectCdpScriptFrame(facts.frameClaim, executionContext === null ? undefined : state.executionContextFrames.get(executionContext));
			if (attribution.invalid || attribution.conflicting) state.completeness.exclude("scripts", "invalid_protocol_value");
			const baseScript = {
				scriptId,
				rawUrl,
				url: sanitized.url,
				origin: sanitized.origin,
				...facts.metadata,
				executionContextKey: executionContext,
				frameId: attribution.frameId
			};
			const baseBytes = scriptMetadataStringBytes(baseScript);
			const sourceMapDeclared = typeof facts.sourceMapUrl === "string" && facts.sourceMapUrl.length > 0;
			if (state.scripts.size >= CDP_CAPTURE_SCRIPT_METADATA_LIMITS.scripts || baseBytes > CDP_CAPTURE_SCRIPT_METADATA_LIMITS.retainedBytes - state.retainedScriptMetadataBytes) {
				state.rejectedScriptMetadataBudgetCount += 1;
				if (sourceMapDeclared) state.rejectedSourceMapMetadataBudgetCount += 1;
				return;
			}
			const sourceMap = sourceMapForScript(facts.sourceMapUrl, rawUrl, state, CDP_CAPTURE_SCRIPT_METADATA_LIMITS.retainedBytes - state.retainedScriptMetadataBytes - baseBytes);
			const { budgetExhausted, ...sourceMapFields } = sourceMap;
			const script = {
				...baseScript,
				...sourceMapFields
			};
			if (budgetExhausted) state.scriptMetadataBudgetOmissionsById.set(scriptId, true);
			const retainedBytes = baseBytes + stringByteLength(sourceMap.sourceMapUrl) + stringByteLength(sourceMap.sourceMapRawUrl);
			state.retainedScriptMetadataBytes += retainedBytes;
			state.scriptMetadataBytesById.set(scriptId, retainedBytes);
			state.scripts.set(scriptId, script);
		};
		scriptMetadataStringBytes = (script) => stringByteLength(script.scriptId) + stringByteLength(script.rawUrl) + stringByteLength(script.url) + stringByteLength(script.origin) + stringByteLength(script.hash) + stringByteLength(script.language) + stringByteLength(script.executionContextKey) + stringByteLength(script.frameId);
		stringByteLength = (value) => value === null ? 0 : Buffer.byteLength(value, "utf8");
		RETAINED_EVENT_ENTRY_OVERHEAD_BYTES = 64;
		RETAINED_EVENT_TEXT_VALUE_BYTES = 32;
		sourceMapForScript = (value, scriptUrl, state, remainingBytes) => {
			const declaredUrl = cdpStringValue(value);
			if (value !== undefined && declaredUrl === undefined) state.completeness.exclude("source_maps", "invalid_protocol_value");
			if (declaredUrl === undefined || declaredUrl === "") return {
				sourceMapUrl: null,
				sourceMapRawUrl: null,
				budgetExhausted: false
			};
			let rawUrl;
			try {
				rawUrl = new URL(declaredUrl, scriptUrl).href;
			} catch (cause) {
				void cause;
				state.completeness.exclude("source_maps", "unsupported_url");
				return {
					sourceMapUrl: null,
					sourceMapRawUrl: null,
					budgetExhausted: false
				};
			}
			const sanitized = allowedSanitizedUrl(rawUrl, state.allowedOrigins);
			if (sanitized !== undefined) {
				if (stringByteLength(rawUrl) + stringByteLength(sanitized.url) > remainingBytes) {
					return {
						sourceMapUrl: null,
						sourceMapRawUrl: null,
						budgetExhausted: true
					};
				}
				return {
					sourceMapUrl: sanitized.url,
					sourceMapRawUrl: rawUrl,
					budgetExhausted: false
				};
			}
			state.completeness.exclude("source_maps", exclusionReasonForUrl(rawUrl));
			return {
				sourceMapUrl: null,
				sourceMapRawUrl: null,
				budgetExhausted: false
			};
		};
		handleRequestWillBeSent = (state, facts) => {
			const requestId = facts.requestId;
			const request = facts.request;
			if (requestId === null) {
				state.completeness.exclude("network_requests", "invalid_protocol_value");
				return;
			}
			if (state.malformedRedirectRequestIds.has(requestId)) return;
			const previous = state.network.get(requestId);
			if (facts.redirect.kind === "missing" && previous !== undefined && preserveMalformedRedirectEvidence(state, requestId, previous)) return;
			const method = request?.method;
			const initiator = facts.initiator;
			const initiatorType = initiator?.type;
			if (request === undefined || method === undefined || method.length === 0 || initiatorType === undefined || initiatorType.length === 0) {
				preserveMalformedRedirectEvidence(state, requestId, previous);
				return;
			}
			const sanitized = allowedSanitizedUrl(request.url, state.allowedOrigins);
			if (sanitized === undefined) {
				state.completeness.exclude("network_requests", exclusionReasonForUrl(request.url));
				releaseBodyShapes(state, requestId);
				state.network.delete(requestId);
				state.networkRequestTimestamps.delete(requestId);
				return;
			}
			const redirectResponse = facts.redirect.kind === "response" ? facts.redirect.response : undefined;
			if (facts.redirect.kind === "malformed" && preserveMalformedRedirectEvidence(state, requestId, previous)) return;
			const redirects = [...previous?.redirects ?? []];
			if (redirectResponse !== undefined) {
				const responseUrl = scopeCdpResponse(redirectResponse, state.allowedOrigins);
				if (responseUrl.scope === "approved" && !redirectResponse.status.ok) state.completeness.exclude("network_requests", "invalid_protocol_value");
				if (previous === undefined) {
					if (responseUrl.scope !== "approved") state.completeness.exclude("network_requests", responseUrl.reason);
					else state.completeness.attachLimited("network_requests");
				} else if (responseUrl.scope !== "approved") {
					state.completeness.exclude("network_requests", responseUrl.reason);
					releaseBodyShapes(state, requestId);
					state.network.delete(requestId);
					state.networkRequestTimestamps.delete(requestId);
					return;
				} else {
					const encodedDataLength = redirectResponse.encodedDataLength;
					if (encodedDataLength === undefined || encodedDataLength < 0) state.completeness.exclude("network_requests", "invalid_protocol_value");
					redirects.push({
						url: previous.url,
						response_url: responseUrl.url.url,
						method: previous.method,
						resource_type: previous.resource_type,
						status: redirectResponse.status.ok ? redirectResponse.status.value : null,
						mime_type: redirectResponse.mimeType ?? null,
						encoded_data_length: encodedDataLength === undefined || encodedDataLength < 0 ? null : encodedDataLength,
						request_timestamp: state.networkRequestTimestamps.get(requestId) ?? null,
						redirect_event_timestamp: facts.timestamp ?? null
					});
				}
			}
			const location = initiatorLocation(initiator?.source);
			if (!location.ok) state.completeness.exclude("network_initiators", "invalid_protocol_value");
			const initiatorFrame = location.ok ? location.value : undefined;
			const coordinates = cdpSourceCoordinates(initiatorFrame);
			if (coordinates.invalid) state.completeness.exclude("network_initiators", "invalid_protocol_value");
			const rawInitiatorUrl = cdpStringValue(initiatorFrame?.url);
			const initiatorUrl = allowedSanitizedUrl(rawInitiatorUrl, state.allowedOrigins);
			if (rawInitiatorUrl !== undefined && initiatorUrl === undefined) state.completeness.exclude("network_initiators", exclusionReasonForUrl(rawInitiatorUrl));
			state.network.set(requestId, {
				request_id: requestId,
				url: sanitized.url,
				origin: sanitized.origin ?? "",
				method,
				resource_type: facts.resourceType ?? null,
				status: null,
				mime_type: null,
				encoded_data_length: null,
				redirects,
				initiator: {
					type: initiatorType,
					url: initiatorUrl?.url ?? null,
					line: coordinates.line,
					column: coordinates.column
				},
				body_shapes: requestBodyShape(state, requestId, request.source)
			});
			const timestamp = facts.timestamp;
			if (timestamp === undefined) state.networkRequestTimestamps.delete(requestId);
			else state.networkRequestTimestamps.set(requestId, timestamp);
		};
		preserveMalformedRedirectEvidence = (state, requestId, previous) => {
			state.completeness.exclude("network_requests", "invalid_protocol_value");
			if (previous === undefined) return false;
			state.malformedRedirectRequestIds.add(requestId);
			if (state.input.include_json_body_shapes && isJsonMediaType(previous.mime_type) && previous.body_shapes.response === null) {
				updateResponseBodyShape(state, requestId, null);
				state.completeness.exclude("json_body_shapes", "invalid_protocol_value");
			}
			return true;
		};
		handleResponseReceived = (state, params) => {
			const facts = readCdpResponseReceived(params);
			const requestId = facts.requestId;
			if (requestId === null) {
				state.completeness.exclude("network_requests", "invalid_protocol_value");
				return;
			}
			if (state.malformedRedirectRequestIds.has(requestId)) return;
			const current = state.network.get(requestId);
			if (current === undefined) return;
			const scoped = scopeCdpResponse(facts.response, state.allowedOrigins, "unattributed_origin");
			if (scoped.scope !== "approved") {
				state.completeness.exclude("network_requests", scoped.reason);
				releaseBodyShapes(state, requestId);
				state.network.delete(requestId);
				state.networkRequestTimestamps.delete(requestId);
				return;
			}
			const { url: sanitized, response } = scoped;
			if (!response.status.ok) state.completeness.exclude("network_requests", "invalid_protocol_value");
			state.network.set(requestId, {
				...current,
				status: response.status.ok ? response.status.value : null,
				mime_type: response.mimeType ?? null
			});
			const metadata = safeResponseMetadata(requestId, sanitized.url, response, state.allowedOrigins);
			state.responseMetadata.push(metadata.response);
			state.agentHints.push(...metadata.agentHints);
		};
		handleLoadingFinished = (state, params) => {
			const facts = readCdpLoadingFinished(params);
			const requestId = facts.requestId;
			if (requestId === null) return;
			if (state.malformedRedirectRequestIds.has(requestId)) return;
			const current = state.network.get(requestId);
			if (current === undefined) return;
			const encodedDataLength = facts.encodedDataLength;
			if (encodedDataLength === undefined || encodedDataLength < 0) {
				state.completeness.exclude("network_requests", "invalid_protocol_value");
				return;
			}
			state.network.set(requestId, {
				...current,
				encoded_data_length: encodedDataLength
			});
		};
		handleConsoleAPICalled = (state, params) => {
			const topFrame = topCallFrame(params.stackTrace);
			if (!topFrame.ok) {
				state.completeness.exclude("console_events", "invalid_protocol_value");
				return;
			}
			const frame = topFrame.value;
			if (frame === undefined) {
				state.completeness.exclude("console_events", "unattributed_origin");
				return;
			}
			const coordinates = cdpSourceCoordinates(frame);
			if (coordinates.invalid) state.completeness.exclude("console_events", "invalid_protocol_value");
			const source = allowedSanitizedUrl(frame.url, state.allowedOrigins);
			if (source === undefined) {
				state.completeness.exclude("console_events", exclusionReasonForUrl(cdpStringValue(frame.url)));
				return;
			}
			const arguments_ = admitRecords(params.args)?.map((argument) => recordValue(argument));
			const argumentTypes = arguments_?.map((argument) => cdpStringValue(argument?.type));
			const timestamp = numberValue(params.timestamp);
			if (timestamp === undefined || argumentTypes === undefined || argumentTypes.includes(undefined)) state.completeness.exclude("console_events", "invalid_protocol_value");
			const type = cdpStringValue(params.type) ?? "unknown";
			const textCapture = captureConsoleText(state, arguments_);
			const entryBytes = RETAINED_EVENT_ENTRY_OVERHEAD_BYTES + stringByteLength(type) + stringByteLength(source.url) + (argumentTypes ?? []).reduce((sum, argumentType) => sum + stringByteLength(argumentType ?? "unknown"), 0) + textCapture.retained_bytes + textCapture.values.length * RETAINED_EVENT_TEXT_VALUE_BYTES;
			if (entryBytes > WEB_RUNTIME_LIMITS.retainedEventBytes - state.retainedEventBytes) {
				state.completeness.drop("console_events");
				return;
			}
			state.retainedEventBytes += entryBytes;
			state.console.push({
				type,
				timestamp: timestamp ?? null,
				argument_types: argumentTypes?.map((argumentType) => argumentType ?? "unknown") ?? null,
				url: source.url,
				line: coordinates.line,
				column: coordinates.column,
				text_capture: textCapture
			});
		};
		captureConsoleText = (state, arguments_) => {
			if (!state.input.include_console_text) return {
				status: "not_approved",
				values: [],
				retained_bytes: 0
			};
			if (arguments_ === undefined) return {
				status: "unavailable",
				values: [],
				retained_bytes: 0
			};
			const values = [];
			let retainedBytes = 0;
			for (const [argumentIndex, argument] of arguments_.entries()) {
				if (argument === undefined) continue;
				const primitive = consolePrimitive(argument);
				if (primitive === undefined) continue;
				const text = primitive.text;
				values.push({
					argument_index: argumentIndex,
					type: primitive.type,
					text
				});
				retainedBytes += Buffer.byteLength(text);
			}
			return {
				status: "included",
				values,
				retained_bytes: retainedBytes
			};
		};
		handleWebSocketFrame = (state, params, direction) => {
			const requestId = cdpStringValue(params.requestId);
			if (requestId === undefined) return;
			const connection = state.webSocketConnectionsById.get(requestId);
			if (connection === undefined) return;
			const response = recordValue(params.response);
			const opcodeValue = numberValue(response?.opcode);
			const opcode = opcodeValue !== undefined && Number.isInteger(opcodeValue) && opcodeValue >= 0 && opcodeValue <= 15 ? opcodeValue : null;
			const payload = cdpStringValue(response?.payloadData);
			const payloadBytes = opcode === null || payload === undefined ? null : opcode === 1 ? Buffer.byteLength(payload) : paddedBase64ByteLength(payload) ?? null;
			if (opcode === null || payloadBytes === null) state.completeness.exclude("websocket_frames", "invalid_protocol_value");
			const availableBytes = WEB_RUNTIME_LIMITS.retainedEventBytes - state.retainedEventBytes;
			const baseBytes = RETAINED_EVENT_ENTRY_OVERHEAD_BYTES + stringByteLength(direction);
			if (baseBytes > availableBytes) {
				state.completeness.drop("websocket_frames");
				return;
			}
			const captured = captureWebSocketShape(state, payload, opcode, availableBytes - baseBytes);
			if (!captured.ok) {
				state.completeness.drop("websocket_frames");
				state.completeness.exclude("websocket_shapes", "resource_budget_exhausted");
				return;
			}
			const entryBytes = baseBytes + captured.value.serializedBytes;
			if (entryBytes > availableBytes) {
				state.completeness.drop("websocket_frames");
				return;
			}
			state.retainedEventBytes += entryBytes;
			connection.events.push({
				direction,
				opcode,
				payload_bytes: payloadBytes,
				payload_shape: captured.value.payloadShape
			});
		};
		jsonShapeEnvelopeBytes = jsonValueByteLength({
			format: "json",
			json_shape: null
		}) - jsonValueByteLength(null);
		captureWebSocketShape = (state, payload, opcode, maximumBytes) => {
			if (!state.input.include_websocket_shapes || opcode === null) return ok({
				payloadShape: null,
				serializedBytes: 0
			});
			if (opcode !== 1) {
				const payloadShape = {
					format: "binary",
					json_shape: null
				};
				return ok({
					payloadShape,
					serializedBytes: jsonValueByteLength(payloadShape)
				});
			}
			if (payload === undefined) return ok({
				payloadShape: null,
				serializedBytes: 0
			});
			const parsed = inferJsonShape(payload, Math.max(0, maximumBytes - jsonShapeEnvelopeBytes));
			if (!parsed.ok) {
				if (parsed.error.kind === "capacity") return err(parsed.error);
				const payloadShape = {
					format: "text",
					json_shape: null
				};
				return ok({
					payloadShape,
					serializedBytes: jsonValueByteLength(payloadShape)
				});
			}
			const payloadShape = {
				format: "json",
				json_shape: parsed.value.shape
			};
			return ok({
				payloadShape,
				serializedBytes: jsonShapeEnvelopeBytes + parsed.value.serializedBytes
			});
		};
		handleWebSocketCreated = (state, params) => {
			const requestId = cdpStringValue(params.requestId);
			const rawUrl = cdpStringValue(params.url);
			if (requestId === undefined) {
				state.completeness.exclude("websocket_connections", "invalid_protocol_value");
				return;
			}
			if (rawUrl === undefined) {
				state.completeness.exclude("websocket_connections", "invalid_protocol_value");
				return;
			}
			const sourceUrl = sanitizeBrowserUrl(rawUrl).url;
			let parsed;
			try {
				parsed = new URL(sourceUrl);
			} catch (cause) {
				void cause;
				state.completeness.exclude("websocket_connections", "unsupported_url");
				return;
			}
			if (parsed.protocol === "ws:") parsed.protocol = "http:";
			else if (parsed.protocol === "wss:") parsed.protocol = "https:";
			else {
				state.completeness.exclude("websocket_connections", "unsupported_url");
				return;
			}
			if (!state.allowedOrigins.has(parsed.origin)) {
				state.completeness.exclude("websocket_connections", "disallowed_origin");
				return;
			}
			if (state.webSocketConnectionsById.has(requestId)) {
				state.completeness.exclude("websocket_connections", "invalid_protocol_value");
				return;
			}
			state.webSocketConnectionsById.set(requestId, {
				request_id: requestId,
				url: sourceUrl,
				events: []
			});
		};
		handleFrameNavigated = (state, params) => {
			if (state.mainFrameId === undefined) return;
			const frameFacts = cdpFrameEventFacts({
				method: "Page.frameNavigated",
				params
			});
			const identity = selectCdpFrameIdentity(frameFacts, state.mainFrameId);
			if (identity.identityIssue !== null || identity.parentIssue !== null) {
				state.completeness.exclude("frames", "invalid_protocol_value");
				if (identity.selection === "unknown" && identity.parentRelation === "child" && identity.identityIssue !== null) return;
				state.unknownRootIdentity = true;
				return;
			}
			if (identity.selection === "other" && identity.parentRelation === "child") return;
			if (identity.selection === "unknown") {
				state.completeness.exclude("frames", "invalid_protocol_value");
				state.unknownRootIdentity = true;
				return;
			}
			if (identity.selection === "other" && !identity.isRootReplacement) {
				state.completeness.exclude("frames", "invalid_protocol_value");
				state.unknownRootIdentity = true;
				return;
			}
			const rawUrl = cdpStringValue(frameFacts.source?.url);
			const loaderId = frameFacts.loaderId;
			const document = `${String(identity.frameId ?? "")}\0${String(loaderId ?? "")}\0${String(rawUrl ?? "")}`;
			if (state.committedDocument === document) return;
			state.committedDocument = document;
			if (identity.isRootReplacement) state.mainFrameId = identity.frameId ?? undefined;
			state.navigationDuringCapture = true;
			if (isHttpUrl(rawUrl) && allowedSanitizedUrl(rawUrl, state.allowedOrigins) === undefined) state.originViolation = true;
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureEvents.js
var CdpCaptureEvents;
function init_CdpCaptureEvents() {
	return (init_CdpCaptureEvents = __esmMin((() => {
		init_CdpNetworkEventFacts();
		init_CdpCaptureCompleteness();
		init_CdpCaptureEventBodyShapes();
		init_CdpCaptureEventHandlers();
		init_CdpCaptureEventHelpers();
		init_CdpCaptureValues();
		CdpCaptureEvents = class {
			#coverageStarts = new Map();
			#scriptMetadataBudgetExclusionsRecorded = false;
			#networkRequestOccurrences = new Map();
			#responseBodyExaminedOccurrences = new Map();
			scripts = new Map();
			scriptMetadataBudgetOmissionsById = new Map();
			rejectedScriptMetadataBudgetCount = 0;
			rejectedSourceMapMetadataBudgetCount = 0;
			scriptMetadataBytesById = new Map();
			retainedScriptMetadataBytes = 0;
			retainedEventBytes = 0;
			bodyShapeBytesByRequestId = new Map();
			executionContextFrames = new Map();
			network = new Map();
			networkRequestTimestamps = new Map();
			malformedRedirectRequestIds = new Set();
			missingRequestBodyShapeIds = new Set();
			webSocketConnectionsById = new Map();
			console = [];
			responseMetadata = [];
			agentHints = [];
			completeness = new CdpCaptureCompleteness([
				"network_requests",
				"console_events",
				"websocket_connections",
				"websocket_frames",
				"metadata"
			]);
			originViolation = false;
			navigationDuringCapture = false;
			unknownRootIdentity = false;
			mainFrameId = undefined;
			committedDocument = undefined;
			input;
			allowedOrigins;
			constructor(input, allowedOrigins) {
				this.input = input;
				this.allowedOrigins = allowedOrigins;
			}
			beginAuthorizedFrame(frameId) {
				this.mainFrameId = frameId;
				this.#coverageStarts.clear();
				this.originViolation = false;
				this.navigationDuringCapture = false;
				this.unknownRootIdentity = false;
				this.committedDocument = undefined;
				this.scripts.clear();
				this.scriptMetadataBudgetOmissionsById.clear();
				this.rejectedScriptMetadataBudgetCount = 0;
				this.rejectedSourceMapMetadataBudgetCount = 0;
				this.scriptMetadataBytesById.clear();
				this.retainedScriptMetadataBytes = 0;
				this.retainedEventBytes = 0;
				this.bodyShapeBytesByRequestId.clear();
				this.#scriptMetadataBudgetExclusionsRecorded = false;
				this.executionContextFrames.clear();
				this.network.clear();
				this.networkRequestTimestamps.clear();
				this.#networkRequestOccurrences.clear();
				this.#responseBodyExaminedOccurrences.clear();
				this.malformedRedirectRequestIds.clear();
				this.missingRequestBodyShapeIds.clear();
				this.webSocketConnectionsById.clear();
				this.console.length = 0;
				this.responseMetadata.length = 0;
				this.agentHints.length = 0;
				this.completeness.reset();
				if (!this.input.include_console_text) this.completeness.exclude("console_text", "not_approved", null);
				if (!this.input.include_json_body_shapes) this.completeness.exclude("json_body_shapes", "not_approved", null);
				if (!this.input.include_websocket_shapes) this.completeness.exclude("websocket_shapes", "not_approved", null);
			}
			/** The first observed domain event or successful enable reply proves activity. */
			markDomainEnabled(domain) {
				if (!this.#coverageStarts.has(domain)) this.#coverageStarts.set(domain, new Date().toISOString());
			}
			coverageStartedAt(domain) {
				const started = this.#coverageStarts.get(domain);
				if (started === undefined) throw new Error(`${domain} observation has not been enabled`);
				return started;
			}
			beginFinalCapture(frameId) {
				this.mainFrameId = frameId;
				this.committedDocument = undefined;
			}
			/** Record final script metadata omissions after all scriptParsed replacements. */
			recordScriptMetadataBudgetExclusions() {
				if (this.#scriptMetadataBudgetExclusionsRecorded) return;
				this.#scriptMetadataBudgetExclusionsRecorded = true;
				const omittedScripts = this.rejectedScriptMetadataBudgetCount;
				const omittedSourceMaps = this.rejectedSourceMapMetadataBudgetCount + this.scriptMetadataBudgetOmissionsById.size;
				if (omittedScripts > 0) this.completeness.exclude("scripts", "resource_budget_exhausted", omittedScripts);
				if (omittedSourceMaps > 0) this.completeness.exclude("source_maps", "resource_budget_exhausted", omittedSourceMaps);
			}
			ingest(event) {
				if (this.mainFrameId !== undefined) {
					if (event.method.startsWith("Network.")) this.markDomainEnabled("Network");
					if (event.method.startsWith("Runtime.")) this.markDomainEnabled("Runtime");
				}
				if (event.method === "Page.frameNavigated") {
					handleFrameNavigated(this, event.params);
					return;
				}
				const params = recordValue(event.params);
				if (params === undefined) return;
				switch (event.method) {
					case "Runtime.executionContextCreated":
						handleExecutionContextCreated(this, params);
						break;
					case "Runtime.executionContextDestroyed":
						handleExecutionContextDestroyed(this, params);
						break;
					case "Runtime.executionContextsCleared":
						this.executionContextFrames.clear();
						break;
					case "Debugger.scriptParsed":
						handleScriptParsed(this, params);
						break;
					case "Network.requestWillBeSent": {
						const facts = readCdpRequestWillBeSent(params);
						const requestId = facts.requestId;
						const previous = requestId === null ? undefined : this.network.get(requestId);
						handleRequestWillBeSent(this, facts);
						if (requestId !== null && this.network.get(requestId) !== previous) this.#networkRequestOccurrences.set(requestId, (this.#networkRequestOccurrences.get(requestId) ?? 0) + 1);
						break;
					}
					case "Network.responseReceived":
						handleResponseReceived(this, params);
						break;
					case "Network.loadingFinished":
						handleLoadingFinished(this, params);
						break;
					case "Runtime.consoleAPICalled":
						handleConsoleAPICalled(this, params);
						break;
					case "Network.webSocketCreated":
						handleWebSocketCreated(this, params);
						break;
					case "Network.webSocketFrameSent":
						handleWebSocketFrame(this, params, "sent");
						break;
					case "Network.webSocketFrameReceived":
						handleWebSocketFrame(this, params, "received");
						break;
				}
			}
			/** Resolve a transient execution context to one already authorized frame. */
			frameForScript(script, allowedFrameIds) {
				return script.frameId !== null && allowedFrameIds.has(script.frameId) ? script.frameId : null;
			}
			responseBodyRequests() {
				if (!this.input.include_json_body_shapes) return [];
				return [...this.network.values()].filter((request) => !this.malformedRedirectRequestIds.has(request.request_id)).filter((request) => isJsonMediaType(request.mime_type)).flatMap((request) => {
					const occurrence = this.#networkRequestOccurrences.get(request.request_id);
					return occurrence === undefined ? [] : [{
						requestId: request.request_id,
						occurrence
					}];
				});
			}
			currentResponseBodyRequest(candidate) {
				if (candidate.occurrence !== this.#networkRequestOccurrences.get(candidate.requestId)) return undefined;
				return this.network.get(candidate.requestId);
			}
			responseBodyUnavailable(candidate) {
				if (this.currentResponseBodyRequest(candidate) === undefined) return;
				this.#responseBodyExaminedOccurrences.set(candidate.requestId, candidate.occurrence);
				if (this.malformedRedirectRequestIds.has(candidate.requestId)) return;
				updateResponseBodyShape(this, candidate.requestId, null);
				this.completeness.unavailable("json_body_shapes");
			}
			/**
			* Mark eligible response bodies that arrived after the fetch pass was
			* enumerated.
			*/
			settleUnexaminedResponseBodies() {
				for (const candidate of this.responseBodyRequests()) {
					const request = this.currentResponseBodyRequest(candidate);
					if (request?.body_shapes.response === null && this.#responseBodyExaminedOccurrences.get(candidate.requestId) !== candidate.occurrence) this.responseBodyUnavailable(candidate);
				}
			}
			ingestResponseBody(candidate, value) {
				if (this.currentResponseBodyRequest(candidate) === undefined) return;
				this.#responseBodyExaminedOccurrences.set(candidate.requestId, candidate.occurrence);
				if (this.malformedRedirectRequestIds.has(candidate.requestId)) return;
				ingestResponseBodyShape(this, candidate.requestId, value);
			}
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureStorageFingerprints.js
var captureStorageFingerprints, addStorageItems, addCookies, addIndexedDb, indexedDbStoreSchema, indexedDbSchemaComplete, indexedDbKeyPathComplete, addIndexedDbRecords, addCaches, addCacheEntry, addFingerprint, STORAGE_ENTRY_PAGE_SIZE, digest, encodedValue, stableValue, stableValueComplete, decodeRemoteObject;
function init_CdpCaptureStorageFingerprints() {
	return (init_CdpCaptureStorageFingerprints = __esmMin((() => {
		init_paddedBase64();
		init_unicodeCodePointOrder();
		init_CdpConnection();
		init_CdpOptionalCommand();
		init_CdpCaptureValues();
		captureStorageFingerprints = async ({ context, origin, cookieUrl, local, session, indexedDbNames, caches, limitations }) => {
			const state = {
				items: [],
				complete: local.complete && session.complete
			};
			const run = {
				context,
				limitations,
				state
			};
			addStorageItems(state, "local_storage", local.items);
			addStorageItems(state, "session_storage", session.items);
			await addCookies(run, cookieUrl);
			await addIndexedDb(run, origin, indexedDbNames);
			await addCaches(run, caches);
			state.items.sort((left, right) => compareUnicodeCodePoints(`${left.scope}:${left.identity_sha256}`, `${right.scope}:${right.identity_sha256}`));
			const complete = state.complete && state.items.every(({ complete }) => complete);
			return {
				items: state.items,
				complete
			};
		};
		addStorageItems = (state, scope, items) => {
			for (const item of items) addFingerprint(state, {
				scope,
				identity: item.key,
				value: item.value,
				complete: true
			});
		};
		addCookies = async (run, pageUrl) => {
			run.limitations.push("Cookie fingerprints cover cookies applicable to the current main-frame URL, not every path on its origin.");
			const raw = await optionalCdpCommand(run.context, "Network.getCookies", { urls: [pageUrl] }, run.limitations);
			if (raw === undefined) {
				run.state.complete = false;
				return;
			}
			const cookieValues = recordValue(raw)?.cookies;
			if (!Array.isArray(cookieValues)) {
				run.state.complete = false;
				return;
			}
			const cookies = recordsValue(cookieValues);
			if (cookies.length !== cookieValues.length) run.state.complete = false;
			for (const cookie of cookies) {
				const name = cdpStringValue(cookie.name);
				const value = cdpStringValue(cookie.value);
				const domain = cdpStringValue(cookie.domain);
				const path = cdpStringValue(cookie.path);
				if (name === undefined || value === undefined || domain === undefined || path === undefined) {
					run.state.complete = false;
					continue;
				}
				const partitionOpaque = cookie.partitionKeyOpaque === true;
				addFingerprint(run.state, {
					scope: "cookie",
					identity: {
						domain,
						path,
						name,
						partition_key: cookie.partitionKey ?? null,
						...partitionOpaque ? { partition_opaque: true } : {}
					},
					value,
					complete: !partitionOpaque
				});
			}
		};
		addIndexedDb = async (run, origin, names) => {
			for (const databaseName of names) {
				const raw = await optionalCdpCommand(run.context, "IndexedDB.requestDatabase", {
					securityOrigin: origin,
					databaseName
				}, run.limitations);
				const database = recordValue(recordValue(raw)?.databaseWithObjectStores);
				if (raw === undefined || database === undefined) {
					run.state.complete = false;
					continue;
				}
				if (cdpStringValue(database.name) !== databaseName) {
					run.state.complete = false;
					continue;
				}
				if (!Array.isArray(database.objectStores)) {
					run.state.complete = false;
					continue;
				}
				const stores = recordsValue(database.objectStores);
				if (stores.length !== database.objectStores.length) run.state.complete = false;
				const version = typeof database.version === "number" && Number.isSafeInteger(database.version) && database.version >= 0 ? database.version : undefined;
				if (version === undefined) {
					const limitation = "An IndexedDB schema fingerprint is incomplete because its database version is unavailable, invalid, or outside exact integer precision.";
					if (!run.limitations.includes(limitation)) run.limitations.push(limitation);
				}
				addFingerprint(run.state, {
					scope: "indexed_db_schema",
					identity: databaseName,
					value: {
						version: version ?? null,
						object_stores: stores.map(indexedDbStoreSchema)
					},
					projectionVersion: 2,
					complete: version !== undefined && stores.length === database.objectStores.length && indexedDbSchemaComplete(stores)
				});
				for (const store of stores) {
					const objectStoreName = cdpStringValue(store.name);
					if (objectStoreName === undefined) {
						run.state.complete = false;
						continue;
					}
					await addIndexedDbRecords(run, {
						origin,
						databaseName,
						objectStoreName
					});
				}
			}
		};
		indexedDbStoreSchema = (store) => ({
			name: cdpStringValue(store.name) ?? null,
			key_path: stableValue(store.keyPath),
			auto_increment: store.autoIncrement === true,
			indexes: recordsValue(store.indexes).map((index) => ({
				name: cdpStringValue(index.name) ?? null,
				key_path: stableValue(index.keyPath),
				unique: index.unique === true,
				multi_entry: index.multiEntry === true
			}))
		});
		indexedDbSchemaComplete = (stores) => stores.every((store) => cdpStringValue(store.name) !== undefined && indexedDbKeyPathComplete(store.keyPath) && typeof store.autoIncrement === "boolean" && Array.isArray(store.indexes) && recordsValue(store.indexes).length === store.indexes.length && recordsValue(store.indexes).every((index) => cdpStringValue(index.name) !== undefined && indexedDbKeyPathComplete(index.keyPath) && typeof index.unique === "boolean" && typeof index.multiEntry === "boolean"));
		indexedDbKeyPathComplete = (value) => {
			const keyPath = recordValue(value);
			if (keyPath === undefined) return false;
			switch (keyPath.type) {
				case "null": return true;
				case "string": return typeof keyPath.string === "string";
				case "array": return Array.isArray(keyPath.array) && keyPath.array.every((key) => typeof key === "string");
				default: return false;
			}
		};
		addIndexedDbRecords = async (run, input) => {
			let skipCount = 0;
			while (true) {
				const raw = await optionalCdpCommand(run.context, "IndexedDB.requestData", {
					securityOrigin: input.origin,
					databaseName: input.databaseName,
					objectStoreName: input.objectStoreName,
					skipCount,
					pageSize: STORAGE_ENTRY_PAGE_SIZE
				}, run.limitations);
				const result = recordValue(raw);
				if (raw === undefined || result === undefined) {
					run.state.complete = false;
					return;
				}
				if (!Array.isArray(result.objectStoreDataEntries) || typeof result.hasMore !== "boolean") {
					run.state.complete = false;
					return;
				}
				const examinedCount = result.objectStoreDataEntries.length;
				const entries = recordsValue(result.objectStoreDataEntries);
				if (entries.length !== result.objectStoreDataEntries.length) run.state.complete = false;
				for (const entry of entries) {
					const key = decodeRemoteObject(entry.key);
					const primaryKey = decodeRemoteObject(entry.primaryKey);
					const value = decodeRemoteObject(entry.value);
					addFingerprint(run.state, {
						scope: "indexed_db_record",
						identity: {
							database: input.databaseName,
							store: input.objectStoreName,
							key,
							primaryKey
						},
						value,
						complete: key !== undefined && primaryKey !== undefined && value !== undefined
					});
				}
				if (result.hasMore !== true) return;
				if (examinedCount === 0 || skipCount > Number.MAX_SAFE_INTEGER - examinedCount) {
					run.state.complete = false;
					return;
				}
				skipCount += examinedCount;
			}
		};
		addCaches = async (run, caches) => {
			for (const cache of caches) {
				let skipCount = 0;
				let returnCount;
				while (returnCount === undefined || skipCount < returnCount) {
					const raw = await optionalCdpCommand(run.context, "CacheStorage.requestEntries", {
						cacheId: cache.id,
						skipCount,
						pageSize: STORAGE_ENTRY_PAGE_SIZE
					}, run.limitations);
					const result = recordValue(raw);
					if (raw === undefined || result === undefined) {
						run.state.complete = false;
						break;
					}
					if (!Array.isArray(result.cacheDataEntries) || typeof result.returnCount !== "number" || !Number.isSafeInteger(result.returnCount) || result.returnCount < 0) {
						run.state.complete = false;
						break;
					}
					const examinedCount = result.cacheDataEntries.length;
					const entries = recordsValue(result.cacheDataEntries);
					if (entries.length !== result.cacheDataEntries.length) run.state.complete = false;
					for (const entry of entries) await addCacheEntry(run, cache, entry);
					returnCount = result.returnCount;
					if (skipCount + examinedCount >= returnCount) break;
					if (examinedCount === 0 || skipCount > Number.MAX_SAFE_INTEGER - examinedCount) {
						run.state.complete = false;
						break;
					}
					skipCount += examinedCount;
				}
			}
		};
		addCacheEntry = async (run, cache, entry) => {
			const requestURL = cdpStringValue(entry.requestURL);
			const requestMethod = cdpStringValue(entry.requestMethod);
			if (requestURL === undefined || requestMethod === undefined) {
				run.state.complete = false;
				return;
			}
			if (!Array.isArray(entry.requestHeaders)) {
				run.state.complete = false;
				return;
			}
			const headerRecords = recordsValue(entry.requestHeaders);
			const requestHeaders = headerRecords.flatMap((header) => {
				const name = cdpStringValue(header.name);
				const value = cdpStringValue(header.value);
				return name === undefined || value === undefined ? [] : [{
					name,
					value
				}];
			});
			if (headerRecords.length !== entry.requestHeaders.length || requestHeaders.length !== headerRecords.length) {
				run.state.complete = false;
				return;
			}
			const raw = await optionalCdpCommand(run.context, "CacheStorage.requestCachedResponse", {
				cacheId: cache.id,
				requestURL,
				requestHeaders
			}, run.limitations);
			const body = cdpStringValue(recordValue(recordValue(raw)?.response)?.body);
			const decoded = body === undefined ? undefined : decodePaddedBase64(body);
			const complete = decoded !== undefined;
			if (!complete) run.state.complete = false;
			addFingerprint(run.state, {
				scope: "cache_entry",
				identity: {
					cache: cache.name,
					requestURL,
					requestMethod,
					requestHeaders
				},
				value: decoded,
				complete
			});
		};
		addFingerprint = (state, input) => {
			state.items.push({
				scope: input.scope,
				identity_sha256: digest(input.identity),
				value_sha256: input.value === undefined ? null : digest(input.value),
				...input.projectionVersion === undefined ? {} : { projection_version: input.projectionVersion },
				complete: input.complete && stableValueComplete(input.identity) && stableValueComplete(input.value)
			});
		};
		STORAGE_ENTRY_PAGE_SIZE = 1e3;
		digest = (value) => createHash("sha256").update(encodedValue(value)).digest("hex");
		encodedValue = (value) => {
			if (value instanceof Uint8Array) return value;
			const encoded = canonicalize(stableValue(value));
			if (encoded === undefined) throw new TypeError("Expected canonical JSON");
			return encoded;
		};
		stableValue = (value) => {
			if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
			if (Array.isArray(value)) return value.map((item) => stableValue(item));
			const record = recordValue(value);
			if (record === undefined) return String(value);
			return Object.fromEntries(Object.entries(record).sort(([left], [right]) => compareUnicodeCodePoints(left, right)).map(([key, item]) => [key, stableValue(item)]));
		};
		stableValueComplete = (value) => {
			if (value instanceof Uint8Array) return true;
			if (value === null || value === undefined || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return true;
			if (Array.isArray(value)) return value.every((item) => stableValueComplete(item));
			const record = recordValue(value);
			if (record === undefined) return false;
			const entries = Object.entries(record);
			return entries.every(([, item]) => stableValueComplete(item));
		};
		decodeRemoteObject = (value) => {
			const record = recordValue(value);
			if (record === undefined) return undefined;
			const { type, unserializableValue } = record;
			const serialized = record.value;
			const primitive = (valid) => valid ? {
				type,
				value: serialized
			} : undefined;
			switch (type) {
				case "undefined": return serialized === undefined && unserializableValue === undefined ? { type } : undefined;
				case "string":
				case "boolean": return primitive(typeof serialized === type && unserializableValue === undefined);
				case "number":
					if (unserializableValue === undefined) return primitive(typeof serialized === "number" && Number.isFinite(serialized));
					return serialized === undefined && typeof unserializableValue === "string" && [
						"-0",
						"NaN",
						"Infinity",
						"-Infinity"
					].includes(unserializableValue) ? {
						type,
						unserializableValue
					} : undefined;
				case "bigint": return serialized === undefined && typeof unserializableValue === "string" && /^-?\d+n$/u.test(unserializableValue) ? {
					type,
					unserializableValue
				} : undefined;
				case "object": return primitive(unserializableValue === undefined && (record.subtype === "null" ? serialized === null : serialized !== null && typeof serialized === "object" && stableValueComplete(serialized)));
				default: return undefined;
			}
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureStorage.js
var captureStorage, emptyStorageItems, capturedCaches, storageItems, stringArray;
function init_CdpCaptureStorage() {
	return (init_CdpCaptureStorage = __esmMin((() => {
		init_CdpConnection();
		init_CdpOptionalCommand();
		init_CdpCaptureStorageFingerprints();
		init_CdpCaptureValues();
		captureStorage = async (context, pageUrl, limitations) => {
			const origin = new URL(pageUrl).origin;
			const quota = recordValue(await optionalCdpCommand(context, "Storage.getUsageAndQuota", { origin }, limitations));
			const local = context.input.include_storage_keys ? await storageItems(context, origin, true, limitations) : emptyStorageItems;
			const session = context.input.include_storage_keys ? await storageItems(context, origin, false, limitations) : emptyStorageItems;
			const indexedRaw = context.input.include_storage_keys ? await optionalCdpCommand(context, "IndexedDB.requestDatabaseNames", { securityOrigin: origin }, limitations) : undefined;
			const indexedValues = recordValue(indexedRaw)?.databaseNames;
			const indexed = stringArray(indexedValues);
			const cacheRaw = context.input.include_storage_keys ? await optionalCdpCommand(context, "CacheStorage.requestCacheNames", { securityOrigin: origin }, limitations) : undefined;
			const cacheField = recordValue(cacheRaw)?.caches;
			const caches = capturedCaches(recordsValue(cacheField));
			const fingerprints = context.input.include_storage_fingerprints ? await captureStorageFingerprints({
				context,
				origin,
				cookieUrl: pageUrl,
				local,
				session,
				indexedDbNames: indexed,
				caches,
				limitations
			}) : {
				items: [],
				complete: false
			};
			const structuredStorageComplete = indexedRaw !== undefined && Array.isArray(indexedValues) && indexed.length === indexedValues.length && Array.isArray(cacheField) && caches.length === cacheField.length;
			const keysExclusion = !context.input.include_storage_keys ? undefined : local.exclusion === "provider_unavailable" || session.exclusion === "provider_unavailable" || indexedRaw === undefined || cacheRaw === undefined ? "provider_unavailable" : !local.complete || !session.complete || !structuredStorageComplete ? "invalid_protocol_value" : undefined;
			return {
				keysExclusion,
				value: {
					origin,
					usage_bytes: numberValue(quota?.usage) ?? null,
					quota_bytes: numberValue(quota?.quota) ?? null,
					local_storage_keys: local.items.map(({ key }) => key),
					session_storage_keys: session.items.map(({ key }) => key),
					indexed_db_names: [...indexed],
					cache_names: caches.map(({ name }) => name),
					content_fingerprints: [...fingerprints.items],
					fingerprint_algorithm: "sha256",
					fingerprints_complete: fingerprints.complete && structuredStorageComplete,
					values_redacted: true
				}
			};
		};
		emptyStorageItems = {
			items: [],
			complete: false
		};
		capturedCaches = (values) => values.flatMap((cache) => {
			const name = cdpStringValue(cache.cacheName);
			const id = cdpStringValue(cache.cacheId);
			return name === undefined || id === undefined ? [] : [{
				name,
				id
			}];
		});
		storageItems = async (context, origin, isLocalStorage, limitations) => {
			const raw = await optionalCdpCommand(context, "DOMStorage.getDOMStorageItems", { storageId: {
				securityOrigin: origin,
				isLocalStorage
			} }, limitations);
			const entries = recordValue(raw)?.entries;
			if (raw === undefined || !Array.isArray(entries)) return {
				items: [],
				complete: false,
				exclusion: raw === undefined ? "provider_unavailable" : "invalid_protocol_value"
			};
			const items = entries.flatMap((entry) => {
				if (!Array.isArray(entry)) return [];
				const key = cdpStringValue(entry[0]);
				const value = cdpStringValue(entry[1]);
				return key === undefined || value === undefined ? [] : [{
					key,
					value
				}];
			});
			return {
				items,
				complete: items.length === entries.length
			};
		};
		stringArray = (value) => Array.isArray(value) ? value.flatMap((item) => {
			const text = cdpStringValue(item);
			return text === undefined ? [] : [text];
		}) : [];
	})))();
}

//#endregion
//#region dist/browser/CdpPageCaptureScripts.js
var captureScripts, finalizeScriptInventory, buildScriptDraft, keyAndBuildInventory, sourceDigest;
function init_CdpPageCaptureScripts() {
	return (init_CdpPageCaptureScripts = __esmMin((() => {
		init_webInventory();
		init_CdpCaptureValues();
		init_CdpScriptSourceCapture();
		init_unicodeCodePointOrder();
		init_browserDeadline();
		init_CdpScriptSourceBudget();
		captureScripts = async (options) => {
			const { context, events, rawResources, resources, frameIds } = options;
			let state;
			const drafts = [];
			const scripts = new Map(events.scripts);
			const commandTimeoutMs = selectedCdpCommandTimeoutMs(context.input.command_timeout_ms);
			const sourceBudget = context.input.include_script_sources && scripts.size > 0 ? new CdpScriptSourceBudget(context.signal, commandTimeoutMs) : undefined;
			try {
				for (const script of scripts.values()) {
					state ??= {
						context,
						events,
						frameIds,
						reconcileResource: createCapturedWebScriptReconciler(rawResources, resources)
					};
					const source = sourceBudget === undefined ? sourceExcluded("source capture was not selected") : await capturePassiveCdpScriptSource({
						connection: context.connection,
						sessionId: context.sessionId,
						signal: context.signal,
						operation: context.operation,
						scriptId: script.scriptId,
						sourceBudget,
						completeness: events.completeness
					});
					drafts.push(buildScriptDraft(script, state, source));
				}
			} finally {
				sourceBudget?.dispose();
			}
			if (!context.input.include_script_sources) events.completeness.exclude("script_sources", "not_approved", scripts.size);
			return {
				...keyAndBuildInventory(drafts, scripts.size),
				scriptIds: new Set(scripts.keys())
			};
		};
		finalizeScriptInventory = (snapshot, events) => {
			let lateCount = 0;
			for (const scriptId of events.scripts.keys()) if (!snapshot.scriptIds.has(scriptId)) lateCount += 1;
			if (lateCount > 0) events.completeness.drop("scripts", lateCount);
			return {
				...snapshot.inventory,
				total: snapshot.inventory.total + lateCount
			};
		};
		buildScriptDraft = (script, state, source) => {
			const inventoryScript = {
				frame_id: state.events.frameForScript(script, state.frameIds),
				url: script.url,
				cdp_hash: script.hash,
				length: script.length,
				is_module: script.isModule,
				language: script.language,
				source_map_url: script.sourceMapUrl
			};
			return {
				item: {
					...inventoryScript,
					origin: script.origin,
					resource_reconciliation: state.reconcileResource({
						...inventoryScript,
						rawUrl: script.rawUrl
					}),
					source
				},
				sourceMapRawUrl: script.sourceMapRawUrl
			};
		};
		keyAndBuildInventory = (drafts, scriptCount) => {
			const keyed = drafts.map((draft) => ({
				...draft,
				base: stableWebScriptKey(draft.item)
			}));
			keyed.sort((left, right) => compareUnicodeCodePoints(left.base, right.base) || compareUnicodeCodePoints(sourceDigest(left.item.source), sourceDigest(right.item.source)) || compareUnicodeCodePoints(left.item.frame_id ?? "", right.item.frame_id ?? ""));
			const totals = new Map();
			for (const { base } of keyed) totals.set(base, (totals.get(base) ?? 0) + 1);
			const seen = new Map();
			const sourceMapRequests = [];
			const items = keyed.map(({ base, item, sourceMapRawUrl }) => {
				const occurrence = (seen.get(base) ?? 0) + 1;
				seen.set(base, occurrence);
				const scriptKey = totals.get(base) === 1 ? base : `${base}_${String(occurrence)}`;
				if (item.source_map_url !== null && sourceMapRawUrl !== null) sourceMapRequests.push({
					scriptKey,
					declaredUrl: item.source_map_url,
					fetchUrl: sourceMapRawUrl
				});
				return {
					script_key: scriptKey,
					...item
				};
			});
			return {
				inventory: {
					total: scriptCount,
					items
				},
				sourceMapRequests
			};
		};
		sourceDigest = (source) => source.included ? source.artifact.sha256 : source.reason;
	})))();
}

//#endregion
//#region dist/browser/CdpPageCaptureWorkers.js
var captureWorkers;
function init_CdpPageCaptureWorkers() {
	return (init_CdpPageCaptureWorkers = __esmMin((() => {
		init_CdpCaptureValues();
		init_CdpOptionalCommand();
		init_CdpWorkerTarget();
		init_CdpCaptureEventHelpers();
		captureWorkers = async (input, frameIds) => {
			const { context, allowedOrigins, limitations, events } = input;
			const completeness = events.completeness;
			completeness.attachLimited("workers");
			const result = await optionalCdpCommand({
				...context,
				sessionId: undefined
			}, "Target.getTargets", {}, limitations);
			const items = [];
			if (result === undefined) completeness.unavailable("workers");
			const targets = admitRecords(recordValue(result)?.targetInfos);
			if (result !== undefined && targets === undefined) {
				completeness.exclude("workers", "invalid_protocol_value", null);
				return items;
			}
			let malformedEntries = 0;
			for (const entry of targets ?? []) {
				const parsed = parseCdpWorkerTarget(entry);
				if (!parsed.ok) {
					malformedEntries += 1;
					continue;
				}
				const target = parsed.value;
				if (target.kind === "non_worker") continue;
				const ownership = workerTargetOwnership(target, context.target.id, frameIds);
				if (ownership !== "selected") {
					completeness.exclude("workers", ownership === "unknown" ? "unattributed_target" : "out_of_target_scope");
					continue;
				}
				const url = allowedSanitizedUrl(target.url, allowedOrigins);
				if (url === undefined) {
					completeness.exclude("workers", exclusionReasonForUrl(target.url));
					continue;
				}
				items.push({
					target_id: target.targetId,
					type: target.type,
					url: url.url,
					origin: url.origin,
					attached: target.attached,
					opener_target_id: target.openerTargetId,
					parent_frame_id: target.parentFrameId
				});
			}
			if (malformedEntries > 0) completeness.exclude("workers", "invalid_protocol_value", malformedEntries);
			return items;
		};
	})))();
}

//#endregion
//#region dist/browser/CdpPageCapture.js
var capturePage, assertObservedCaptureValid, captureAuthorizedPage, captureJsonResponseBodies, authorizeObservationWindow, capturePageDom, normalizedInspection, enableObservationDomains, accessibilityForFrames, publicResource, deduplicatedAgentHints, normalizedTarget, report;
function init_CdpPageCapture() {
	return (init_CdpPageCapture = __esmMin((() => {
		init_browserObservationError();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_webInventory();
		init_CdpConnection();
		init_CdpCaptureEvents();
		init_CdpAuthorizedMainFrame();
		init_CdpOriginScopeError();
		init_CdpCaptureStorage();
		init_CdpOptionalCommand();
		init_CdpCommandRejection();
		init_CdpCaptureDocuments();
		init_CdpCaptureDomNamespaces();
		init_CdpCaptureValues();
		init_CdpPageCaptureScripts();
		init_CdpPageCaptureWorkers();
		capturePage = async (context) => {
			const allowedOrigins = new Set(context.input.allowed_origins);
			const events = new CdpCaptureEvents(context.input, allowedOrigins);
			const removeListener = context.connection.onEvent((event) => {
				if (event.sessionId !== context.sessionId) return;
				events.ingest(event);
			});
			const state = {
				context,
				events,
				allowedOrigins,
				limitations: [
					...context.discovery.limitations ?? [],
					"Observation starts when REA attaches; prior network and console activity is unavailable.",
					"Worker targets are a final inventory snapshot, not worker-session observation. Their attached flag describes any debugging client; this page-session collector does not observe worker network, console, or script events, and short-lived workers may be absent from the snapshot.",
					"Raw network headers, bodies, cookies, storage values, console objects, and WebSocket payloads are never retained; explicitly requested primitive console text is retained verbatim, while payload captures retain value-free shapes.",
					"Source maps are reported only as declarative URLs and are not fetched.",
					"URL-less scripts and console events without an allowed source URL are excluded because their origin cannot be proven.",
					...context.target.attached === null ? ["CDP discovery could not establish the target's debugger attachment state."] : []
				],
				startedAt: new Date().toISOString()
			};
			try {
				return await captureAuthorizedPage(state);
			} catch (cause) {
				if (context.signal?.aborted !== true && !(cause instanceof AnalysisCancelledError) && !(cause instanceof AnalysisError && cause.userCategory === "cancelled")) assertObservedCaptureValid(state, cause);
				throw cause;
			} finally {
				removeListener();
			}
		};
		assertObservedCaptureValid = (state, cause) => {
			const reason = state.events.unknownRootIdentity ? "protocol_error" : state.events.originViolation ? "target_not_allowed" : state.events.navigationDuringCapture ? "target_changed" : undefined;
			if (reason === "target_not_allowed") throw cdpOriginScopeRefusal(state.context.operation, { cause });
			if (reason !== undefined) {
				if (cause instanceof BrowserObservationError && cause.reason === reason) throw cause;
				throw new BrowserObservationError(state.context.operation, reason, { cause });
			}
		};
		captureAuthorizedPage = async (state) => {
			const { context, allowedOrigins, limitations } = state;
			const { connection, sessionId, input, signal } = context;
			await authorizeObservationWindow(state);
			await captureJsonResponseBodies(state);
			const frameResult = await authorizedMainFrame({
				connection: context.connection,
				sessionId: context.sessionId,
				signal: context.signal,
				allowedOrigins,
				operation: context.operation
			});
			const attachedUrl = mainFrameUrl(frameResult) ?? "";
			const frameCapture = captureFrames(frameResult, allowedOrigins, undefined, state.events.completeness);
			const frames = frameCapture.items;
			const captureFrame = frameCapture.root;
			if (captureFrame === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			state.events.beginFinalCapture(captureFrame.frame_id);
			const resourceCapture = captureResources(await connection.send("Page.getResourceTree", {}, sessionId, signal), allowedOrigins, state.events.completeness);
			const resources = stableWebResources(resourceCapture.items.map(publicResource));
			const dom = await capturePageDom(state);
			const accessibility = await accessibilityForFrames(state, frames);
			const scripts = await captureScripts({
				context,
				events: state.events,
				rawResources: resourceCapture.items,
				resources,
				frameIds: new Set(frames.map((frame) => frame.frame_id))
			});
			const workers = await captureWorkers({
				context,
				allowedOrigins,
				limitations,
				events: state.events
			}, new Set(frames.map((frame) => frame.frame_id)));
			const storageCapture = await captureStorage(context, attachedUrl, limitations);
			if (!input.include_storage_keys) state.events.completeness.exclude("storage_keys", "not_approved", null);
			else if (storageCapture.keysExclusion !== undefined) state.events.completeness.exclude("storage_keys", storageCapture.keysExclusion, null);
			await report(context.progress, 3, "Normalizing browser evidence");
			const completedFrameResult = await authorizedMainFrame({
				connection: context.connection,
				sessionId: context.sessionId,
				signal: context.signal,
				allowedOrigins,
				operation: context.operation
			});
			const completedUrl = mainFrameUrl(completedFrameResult) ?? "";
			assertObservedCaptureValid(state);
			if (completedUrl !== attachedUrl) throw new BrowserObservationError("inspect_web_page", "target_changed");
			state.events.settleUnexaminedResponseBodies();
			const scriptInventory = finalizeScriptInventory(scripts, state.events);
			state.events.recordScriptMetadataBudgetExclusions();
			return {
				inspection: normalizedInspection(state, {
					attachedUrl,
					frames,
					dom,
					accessibility,
					scripts: scriptInventory,
					resources,
					workers,
					storage: storageCapture.value
				}),
				sourceMapRequests: scripts.sourceMapRequests
			};
		};
		captureJsonResponseBodies = async (state) => {
			const requests = state.events.responseBodyRequests();
			for (let index = 0; index < requests.length; index += 1) {
				const candidate = requests[index];
				if (candidate === undefined) continue;
				const current = state.events.currentResponseBodyRequest(candidate);
				if (current === undefined) continue;
				if (current.encoded_data_length === null) {
					state.events.responseBodyUnavailable(candidate);
					continue;
				}
				let result;
				try {
					result = await optionalCdpCommand(state.context, "Network.getResponseBody", { requestId: candidate.requestId }, state.limitations);
				} catch (cause) {
					if (!(cause instanceof CdpCommandRejection) || cause.command !== "Network.getResponseBody" || cause.code !== -32e3 || cause.reportedMessage === null) throw cause;
					state.events.responseBodyUnavailable(candidate);
					state.limitations.push(`Response body unavailable for request ${candidate.requestId}: ${cause.userMessage}`);
					continue;
				}
				if (result !== undefined) {
					state.events.ingestResponseBody(candidate, result);
					continue;
				}
				for (const remaining of requests.slice(index)) state.events.responseBodyUnavailable(remaining);
				return;
			}
		};
		authorizeObservationWindow = async (state) => {
			const { context, allowedOrigins, events } = state;
			const { connection, sessionId, signal } = context;
			await report(context.progress, 1, "Enabling passive CDP domains");
			await connection.send("Page.enable", {}, sessionId, signal);
			const initialFrameResult = await authorizedMainFrame({
				connection: context.connection,
				sessionId: context.sessionId,
				signal: context.signal,
				allowedOrigins,
				operation: context.operation
			});
			const mainFrame = captureFrames(initialFrameResult, allowedOrigins).root;
			if (mainFrame === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			events.beginAuthorizedFrame(mainFrame.frame_id);
			await enableObservationDomains(state);
			await report(context.progress, 2, "Observing page events");
			await delayWithCancellation(context.input.observation_ms, context.operation, signal);
			if (events.unknownRootIdentity) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			if (events.originViolation) throw cdpOriginScopeRefusal(context.operation);
		};
		capturePageDom = async (state) => {
			const { context, allowedOrigins } = state;
			const result = await context.connection.send("DOMSnapshot.captureSnapshot", {
				computedStyles: [],
				includePaintOrder: false,
				includeDOMRects: false
			}, context.sessionId, context.signal);
			const capture = captureDom(result, allowedOrigins, context.input, state.events.completeness);
			let step = capture.next();
			let descriptionUnavailable = false;
			const pendingController = new AbortController();
			const signal = context.signal === undefined ? pendingController.signal : AbortSignal.any([context.signal, pendingController.signal]);
			while (!step.done) {
				const pending = step.value.map(async (query) => {
					if (descriptionUnavailable) return undefined;
					try {
						return capturedSvgNodeKind(query, await context.connection.send("DOM.describeNode", {
							backendNodeId: query.backendNodeId,
							depth: 0
						}, context.sessionId, signal));
					} catch (cause) {
						if (!(cause instanceof CdpCommandRejection)) throw cause;
						if (cause.code === -32601) descriptionUnavailable = true;
						else if (cause.code !== -32e3) throw cause;
						return undefined;
					}
				});
				try {
					step = capture.next(await Promise.all(pending));
				} catch (cause) {
					pendingController.abort();
					await Promise.allSettled(pending);
					throw cause;
				}
			}
			if (step.value.unresolvedSvgNodes > 0) state.limitations.push(`SVG identity was unavailable for ${String(step.value.unresolvedSvgNodes)} snapshotted XLink candidate nodes; their URL destinations remain unknown.`);
			return step.value;
		};
		normalizedInspection = (state, captured) => ({
			browser: state.context.discovery.version,
			target: normalizedTarget(state.context.target, captured.attachedUrl, state.allowedOrigins),
			capture_window: {
				started_at: state.startedAt,
				ended_at: new Date().toISOString(),
				observation_ms: state.context.input.observation_ms
			},
			completeness: state.events.completeness.snapshot(),
			frames: [...captured.frames],
			dom: {
				total_nodes: captured.dom.total,
				node_value_length_unit: captured.dom.nodeValueLengthUnit,
				nodes: [...captured.dom.nodes]
			},
			accessibility: {
				total_nodes: captured.accessibility.total,
				text_capture: captured.accessibility.textCapture,
				nodes: [...captured.accessibility.nodes]
			},
			scripts: captured.scripts,
			resources: [...captured.resources],
			network: {
				requests: [...state.events.network.values()],
				websocket_connections: [...state.events.webSocketConnectionsById.values()],
				coverage_started_at: state.events.coverageStartedAt("Network"),
				prior_activity_available: false
			},
			console: {
				events: [...state.events.console],
				coverage_started_at: state.events.coverageStartedAt("Runtime"),
				prior_activity_available: false
			},
			workers: [...captured.workers],
			metadata: {
				responses: [...state.events.responseMetadata],
				dom_urls: [...captured.dom.urls],
				agent_hints: deduplicatedAgentHints([...state.events.agentHints, ...captured.dom.agentHints]),
				excluded_dom_urls: captured.dom.excludedUrls,
				headers_allowlisted: true
			},
			storage: captured.storage,
			limitations: state.limitations
		});
		enableObservationDomains = async (state) => {
			const { connection, sessionId, signal } = state.context;
			await connection.send("Runtime.enable", {}, sessionId, signal);
			state.events.markDomainEnabled("Runtime");
			await connection.send("Debugger.enable", {}, sessionId, signal);
			await connection.send("Network.enable", {}, sessionId, signal);
			state.events.markDomainEnabled("Network");
		};
		accessibilityForFrames = async (state, frames) => {
			const { context, limitations, events } = state;
			const results = [];
			let unavailable = false;
			for (const frame of frames) {
				const result = await optionalCdpCommand(context, "Accessibility.getFullAXTree", { frameId: frame.frame_id }, limitations);
				if (result === undefined) unavailable = true;
				else results.push(result);
			}
			if (unavailable) events.completeness.unavailable("accessibility");
			const capture = captureAccessibility(results, {
				includeText: context.input.include_accessibility_text,
				...results.length === 0 && unavailable ? { unavailable: true } : {},
				completeness: events.completeness
			});
			if (!context.input.include_accessibility_text) events.completeness.exclude("accessibility", "not_approved", capture.textCapture.excluded_fields);
			if (capture.hasUnobservedChildren) events.completeness.truncate("accessibility");
			return capture;
		};
		publicResource = ({ rawUrl: _rawUrl, ...resource }) => resource;
		deduplicatedAgentHints = (hints) => {
			const seen = new Set();
			return hints.filter((hint) => {
				const key = `${hint.mechanism}\0${hint.declaration}\0${hint.url ?? ""}`;
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			});
		};
		normalizedTarget = (target, currentUrl, allowedOrigins) => {
			const url = allowedSanitizedUrl(currentUrl, allowedOrigins);
			return {
				target_id: target.id,
				type: target.type,
				title: target.title,
				url: url?.url ?? "[unsupported-url]",
				origin: url?.origin ?? "",
				attached: target.attached
			};
		};
		report = async (progress, completed, message) => await progress?.report({
			phase: "browser_observation",
			completed,
			total: 3,
			message,
			...completed === 3 ? { terminal: true } : {}
		});
	})))();
}

//#endregion
//#region dist/javascript/sourceMaps/SourceMapFormat.js
var leafSchema, mapHeaderSchema, sectionSchema, SourceMapFormatFailure, codecLeaf, compare, addOffset, consumeRecords, addSections, inspectMappingLayout, inspectLeaf, inspectSourceMap, inspectSourceMapValue;
function init_SourceMapFormat() {
	return (init_SourceMapFormat = __esmMin((() => {
		init_webSourceLocation();
		init_sourceMapEnvelope();
		leafSchema = z.object({
			version: z.literal(3),
			file: z.string().nullable().optional(),
			sourceRoot: z.string().nullable().optional(),
			sources: z.array(z.string().nullable()),
			sourcesContent: z.array(z.string().nullable()).nullable().optional(),
			names: z.array(z.string()).default([]),
			mappings: sourceMapMappingsSchema.regex(/^[A-Za-z0-9+/,;]*$/u),
			ignoreList: z.array(z.int().min(0)).optional(),
			x_google_ignoreList: z.array(z.int().min(0)).optional()
		});
		mapHeaderSchema = z.object({
			version: z.literal(3),
			file: z.string().nullable().optional(),
			sections: z.unknown().optional()
		});
		sectionSchema = z.object({
			offset: z.object({
				line: z.int().min(0).max(Number.MAX_SAFE_INTEGER),
				column: z.int().min(0).max(Number.MAX_SAFE_INTEGER)
			}),
			map: z.unknown().optional(),
			url: z.unknown().optional()
		});
		SourceMapFormatFailure = class extends Error {
			reason;
			constructor(reason, message) {
				super(message);
				this.reason = reason;
			}
		};
		codecLeaf = (map) => ({
			version: 3,
			...map.file === undefined ? {} : { file: map.file },
			...typeof map.sourceRoot === "string" ? { sourceRoot: map.sourceRoot } : {},
			sources: map.sources,
			...map.sourcesContent == null ? {} : { sourcesContent: map.sourcesContent },
			names: map.names,
			mappings: map.mappings,
			...map.ignoreList === undefined ? {} : { ignoreList: map.ignoreList },
			...map.x_google_ignoreList === undefined ? {} : { x_google_ignoreList: map.x_google_ignoreList }
		});
		compare = (a, b) => a.line - b.line || a.column - b.column;
		addOffset = (base, offset) => {
			const result = {
				line: base.line + offset.line,
				column: offset.column + (offset.line === 0 ? base.column : 0)
			};
			if (!Number.isSafeInteger(result.line) || !Number.isSafeInteger(result.column) || result.line >= WEB_SOURCE_MAP_LIMITS.decodedRows) throw new SourceMapFormatFailure("limit", "Indexed offset exceeds the 262144 generated-row decoder budget.");
			return result;
		};
		consumeRecords = (budget, count) => {
			if (count > WEB_SOURCE_MAP_LIMITS.decodedRecords - budget.records) throw new SourceMapFormatFailure("limit", `Source-map structure exceeds the ${WEB_SOURCE_MAP_LIMITS.decodedRecords}-record decoder budget.`);
			budget.records += count;
		};
		addSections = ({ node, pending, rawSections, budget, options }) => {
			options.check?.();
			consumeRecords(budget, rawSections.length);
			const sections = z.array(sectionSchema).parse(rawSections);
			const embeddedMaps = [];
			for (const [index, section] of sections.entries()) {
				if ((index & 255) === 0) options.check?.();
				const previous = sections[index - 1];
				if (previous !== undefined && compare(section.offset, previous.offset) < 0) throw new SourceMapFormatFailure("format", "Indexed section offsets must be in nondecreasing order.");
				const classification = classifySourceMapSection(section);
				if (classification.kind === "external") throw new SourceMapFormatFailure("unsupported", `External source-map section URL is not fetched: ${classification.url}`);
				if (classification.kind === "invalid") throw new SourceMapFormatFailure("format", `${classification.reason} Section path: ${JSON.stringify([...node.path, index])}.`);
				embeddedMaps.push(classification.map);
			}
			for (let index = sections.length - 1; index >= 0; index -= 1) {
				const section = sections[index];
				if (section === undefined) continue;
				const map = embeddedMaps[index];
				if (map === undefined) throw new SourceMapFormatFailure("format", "Validated indexed section map is unavailable.");
				const next = sections[index + 1];
				const nextOffset = next === undefined ? null : addOffset(node.offset, next.offset);
				const stop = nextOffset === null ? node.stop : node.stop === null || compare(nextOffset, node.stop) < 0 ? nextOffset : node.stop;
				const offset = addOffset(node.offset, section.offset);
				pending.push({
					value: map,
					path: [...node.path, index],
					offset,
					stop
				});
			}
		};
		inspectMappingLayout = (mappings, check) => {
			let lines = 1;
			let segments = 0;
			let components = 0;
			let inSegment = false;
			let continued = false;
			let digits = 0;
			const finish = () => {
				if (continued) throw new SourceMapFormatFailure("format", "Source-map VLQ ends with an unfinished continuation.");
				if (inSegment && ![
					1,
					4,
					5
				].includes(components)) throw new SourceMapFormatFailure("format", "Source-map segment requires one, four or five VLQ components.");
			};
			let index = 0;
			for (const character of mappings) {
				if ((index++ & 16383) === 0) check?.();
				if (character === "," || character === ";") {
					finish();
					inSegment = false;
					components = 0;
					if (character === ";") lines += 1;
				} else {
					digits += 1;
					if (digits === 7 && !/[A-Dg-j]/u.test(character) || digits > 7 && character !== "A" && character !== "g") throw new SourceMapFormatFailure("format", "Source-map VLQ exceeds the format's 32-bit quantity representation.");
					if (!inSegment) segments += 1;
					inSegment = true;
					continued = /[g-z0-9+/]/u.test(character);
					if (!continued) {
						components += 1;
						digits = 0;
					}
				}
				if (segments > WEB_SOURCE_MAP_LIMITS.decodedSegments || lines > WEB_SOURCE_MAP_LIMITS.decodedRows) throw new SourceMapFormatFailure("limit", "Source-map layout exceeds the 262144 segment/generated-row decoder budget.");
			}
			finish();
			return {
				lines,
				segments
			};
		};
		inspectLeaf = (node, budget, options) => {
			options.check?.();
			consumeRecords(budget, 1);
			if (typeof node.value !== "object" || node.value === null || Array.isArray(node.value)) return leafSchema.parse(node.value);
			const rawMap = node.value;
			const rawSources = rawMap.sources;
			const rawNames = rawMap.names;
			const rawContents = rawMap.sourcesContent;
			consumeRecords(budget, Array.isArray(rawSources) ? rawSources.length : 0);
			consumeRecords(budget, Array.isArray(rawNames) ? rawNames.length : 0);
			consumeRecords(budget, Array.isArray(rawContents) ? rawContents.length : 0);
			options.check?.();
			const leaf = leafSchema.parse(node.value);
			const layout = inspectMappingLayout(leaf.mappings, options.check);
			consumeRecords(budget, layout.segments + layout.lines);
			if (layout.segments > WEB_SOURCE_MAP_LIMITS.decodedSegments || node.offset.line + layout.lines > WEB_SOURCE_MAP_LIMITS.decodedRows) throw new SourceMapFormatFailure("limit", "Source-map layout exceeds the 262144 segment/generated-row decoder budget.");
			return leaf;
		};
		inspectSourceMap = (text) => {
			const jsonText = sourceMapJsonText(text);
			const value = JSON.parse(jsonText);
			return inspectSourceMapValue(value);
		};
		inspectSourceMapValue = (value, options = {}) => {
			options.check?.();
			const root = mapHeaderSchema.parse(value);
			const declarations = [];
			const leaves = [];
			const pending = [{
				value,
				path: [],
				offset: {
					line: 0,
					column: 0
				},
				stop: null
			}];
			const budget = options.budget ?? { records: 0 };
			while (pending.length > 0) {
				options.check?.();
				const node = pending.pop();
				if (node === undefined) break;
				if (node.path.length > WEB_SOURCE_MAP_LIMITS.sectionDepth) throw new SourceMapFormatFailure("limit", "Indexed source-map nesting exceeds the 64-level decoder stack budget.");
				const sections = classifySourceMapSections(node.value);
				if (sections.kind === "invalid") throw new SourceMapFormatFailure("format", sections.reason);
				if (sections.kind === "indexed") {
					addSections({
						node,
						pending,
						rawSections: sections.sections,
						budget,
						options
					});
					continue;
				}
				const leaf = inspectLeaf(node, budget, options);
				leaves.push({
					map: leaf,
					codecMap: codecLeaf(leaf),
					offset: node.offset,
					stop: node.stop
				});
				if (options.profile !== "browser-collection") {
					const ignoredSources = new Set(leaf.ignoreList ?? leaf.x_google_ignoreList ?? []);
					for (const [sourceIndex, source] of leaf.sources.entries()) declarations.push({
						sectionPath: node.path,
						sourceIndex,
						source,
						root: leaf.sourceRoot ?? null,
						content: leaf.sourcesContent?.[sourceIndex] ?? null,
						ignored: ignoredSources.has(sourceIndex)
					});
				}
			}
			return {
				format: root.sections === undefined ? "regular" : "indexed",
				reportedFile: root.file ?? null,
				declarations,
				leaves
			};
		};
	})))();
}

//#endregion
//#region dist/javascript/sourceMaps/DecodedSourceMap.js
var isBeforeSourceMapLeafStop, decodeValidatedSourceMapLeaves;
function init_DecodedSourceMap() {
	return (init_DecodedSourceMap = __esmMin((() => {
		init_SourceMapFormat();
		isBeforeSourceMapLeafStop = (leaf, line, column) => {
			if (leaf.stop === null) return true;
			const generatedLine = leaf.offset.line + line;
			const generatedColumn = column + (line === 0 ? leaf.offset.column : 0);
			return generatedLine < leaf.stop.line || generatedLine === leaf.stop.line && generatedColumn < leaf.stop.column;
		};
		decodeValidatedSourceMapLeaves = (leaves, mapUrl, check) => leaves.map((leaf) => {
			check?.();
			const map = new TraceMap(leaf.codecMap, mapUrl);
			const rows = decodedMappings(map);
			for (const [line, row] of rows.entries()) {
				if ((line & 255) === 0) check?.();
				for (const segment of row) {
					const generatedLine = leaf.offset.line + line;
					const generatedColumn = segment[0] + (line === 0 ? leaf.offset.column : 0);
					if (!isBeforeSourceMapLeafStop(leaf, line, segment[0])) throw new SourceMapFormatFailure("section-overlap", "Embedded source-map mappings overlap the following section boundary.");
					if (!Number.isSafeInteger(generatedLine) || !Number.isSafeInteger(generatedColumn) || ![
						1,
						4,
						5
					].includes(segment.length) || segment.some((value) => !Number.isSafeInteger(value) || value < 0) || segment.length !== 1 && segment[1] >= leaf.map.sources.length || segment.length === 5 && segment[4] >= leaf.map.names.length) throw new SourceMapFormatFailure("format", "Decoded local or absolute position, source index or name index is invalid.");
				}
			}
			return {
				leaf,
				map,
				rows
			};
		});
	})))();
}

//#endregion
//#region dist/domain/webBundleAnalyzerAst.js
var objectValue, objectString, isUrlLikeModuleSpecifier, resolveSpecifier, location, locationFields;
function init_webBundleAnalyzerAst() {
	return (init_webBundleAnalyzerAst = __esmMin((() => {
		init_browserObservation$1();
		init_artifactPathSyntax();
		init_javascriptAstValues();
		objectValue = (object, name) => {
			const result = staticObjectProperty(object, name, isNullishJavaScriptSyntax);
			return result.status === "explicit" ? result.value : undefined;
		};
		objectString = (object, name) => {
			const value = objectValue(object, name);
			if (value === undefined) return undefined;
			const literal = readExactJavaScriptLiteral(value);
			return literal.found && typeof literal.value === "string" ? literal.value : undefined;
		};
		isUrlLikeModuleSpecifier = (specifier) => specifier.startsWith("/") || specifier.startsWith("./") || specifier.startsWith("../") || hasScheme(specifier);
		resolveSpecifier = (specifier, base) => {
			try {
				const resolved = new URL(specifier, base);
				if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return null;
				return sanitizeBrowserUrl(resolved.href).url;
			} catch (cause) {
				void cause;
				return null;
			}
		};
		location = (scriptKey, node) => ({
			script_key: scriptKey,
			...locationFields(node)
		});
		locationFields = (node) => ({
			line: node.loc?.start.line ?? null,
			column: node.loc?.start.column ?? null
		});
	})))();
}

//#endregion
//#region dist/browser/WebSourceMapFetcher.js
var SOURCE_MAP_FETCH_TIMEOUT_MS, sourceMapFetchDeadlineLimitation, SOURCE_MAP_RESPONSE_BYTES, SOURCE_MAP_OUTPUT_BYTES, SOURCE_MAP_FAILURE_LIMITATION_RESERVE, SOURCE_MAP_COLLECTION_ENVELOPE_RESERVE, fetchWebSourceMaps, sourceMapOutputLimitation, sourceMapsStatus, SourceMapDeadlineError, SourceMapSizeLimitError, SourceMapEncodingError, SourceMapRedirectLocationError, fetchOne, isFetchRedirectStatus, fetchFollowingApprovedRedirects, readBoundedText, readWithAbort, signalIsAborted, promiseWithAbort, normalizeSourceMap, originalModuleEdges, originalSourcePath, checkOperation, approvedUrl, sourceMapContext, emptySourceMapItem, sourceMapTextArtifact, sanitizeSource, prepareResolvedSources, consumeExpandedBytes, expandedOutputFailure, sourceMapOutputError, resolvedSourceLimitFailure, artifactMetadataBytes, EMPTY_SOURCE_MAP_FAILURE, SOURCE_MAP_FAILURE_ENVELOPE_BYTES, SOURCE_MAP_SUCCESS_ENVELOPE_BYTES, sourceMapFailureReservation, sourceEntryOverheadBytes, cachedJsonBytes, cachedSanitized, mappingRowBytes, resolveOriginalSource, sourceMediaType, originalDependency;
function init_WebSourceMapFetcher() {
	return (init_WebSourceMapFetcher = __esmMin((() => {
		init_DecodedSourceMap();
		init_browserObservation$1();
		init_analysisErrorCore();
		init_analysisErrorBase();
		init_result();
		init_webBundleAnalyzerAst();
		init_javascriptSemanticAnalysis();
		init_javascriptSemanticTraversal();
		init_javascriptSourceParser();
		init_javascriptModuleDeclaration();
		init_javascriptStaticAnalysisHelpers();
		init_webBundleAnalysis();
		init_webContentArtifact();
		init_safeJson();
		init_sourceMapEnvelope();
		init_javascriptSourceMapPaths();
		init_jsonSerialization();
		init_SourceMapFormat();
		init_browserDeadline();
		init_webSourceLocation();
		SOURCE_MAP_FETCH_TIMEOUT_MS = DEFAULT_SOURCE_MAP_FETCH_TIMEOUT_MS;
		sourceMapFetchDeadlineLimitation = (timeoutMs) => `Source-map fetch exceeded its ${String(timeoutMs)} ms source_map_fetch_timeout_ms deadline (fetch_failed). This is an item limitation, not a thrown analysis timeout, and not the source-map decode deadline. ${noRuntimeOverrideSentence(`The ${String(SOURCE_MAP_RESPONSE_BYTES)}-byte response budget stays fixed.`, "source_map_fetch_timeout_ms")}`;
		SOURCE_MAP_RESPONSE_BYTES = 64 * 1024 * 1024;
		SOURCE_MAP_OUTPUT_BYTES = WEB_SOURCE_MAP_LIMITS.outputBytes;
		SOURCE_MAP_FAILURE_LIMITATION_RESERVE = 512;
		SOURCE_MAP_COLLECTION_ENVELOPE_RESERVE = 1024;
		fetchWebSourceMaps = async (requests, input, signal, host = { fetch: globalThis.fetch }) => {
			if (signalIsAborted(signal)) return err(new AnalysisCancelledError("analyze_web_bundle", { cause: signal?.reason }));
			if (requests.length === 0) return ok(webSourceMapsSchema.parse({
				status: "not_requested",
				requested: 0,
				processed: 0,
				items: []
			}));
			const items = [];
			const operationController = new AbortController();
			const fetchTimeoutMs = host.timeoutMs ?? selectedBrowserDeadlineMs(input.source_map_fetch_timeout_ms, SOURCE_MAP_FETCH_TIMEOUT_MS);
			const fetchDeadlineLimitation = sourceMapFetchDeadlineLimitation(fetchTimeoutMs);
			const timeout = setTimeout(() => operationController.abort(new SourceMapDeadlineError(fetchDeadlineLimitation)), fetchTimeoutMs);
			const abortFromCaller = () => operationController.abort(signal?.reason);
			signal?.addEventListener("abort", abortFromCaller, { once: true });
			const operationSignal = operationController.signal;
			const deadlineAt = performance.now() + fetchTimeoutMs;
			const budget = {
				retainedBytes: 0,
				deadlineAt,
				deadlineLimitation: fetchDeadlineLimitation,
				decodedRecords: {
					records: 0,
					expandedBytes: SOURCE_MAP_COLLECTION_ENVELOPE_RESERVE,
					resolvedSourceBytes: 0
				}
			};
			let limitation;
			const completedMaps = () => {
				const unprocessed = requests.length - items.length;
				const stoppedLimitation = unprocessed === 0 ? undefined : `Source-map acquisition stopped with ${String(unprocessed)} requested map${unprocessed === 1 ? "" : "s"} unprocessed; their results are unknown.`;
				const retainedLimitation = [limitation, stoppedLimitation].filter((value) => value !== undefined).join(" ");
				return webSourceMapsSchema.parse({
					status: sourceMapsStatus(items, unprocessed > 0 || limitation !== undefined),
					requested: requests.length,
					processed: items.length,
					items,
					...retainedLimitation.length === 0 ? {} : { limitation: retainedLimitation }
				});
			};
			const retainCompleted = (error) => error.retainPartialObservation({
				kind: "web-source-map-fetch",
				source_maps: completedMaps()
			});
			try {
				for (const request of requests) {
					if (signal?.aborted === true) throw signal.reason;
					const reservation = sourceMapFailureReservation(request) + 1;
					if (reservation > SOURCE_MAP_OUTPUT_BYTES - budget.decodedRecords.expandedBytes) {
						limitation = sourceMapOutputLimitation(requests.length - items.length);
						break;
					}
					const expandedBytesBeforeItem = budget.decodedRecords.expandedBytes;
					budget.decodedRecords.expandedBytes += reservation;
					if (operationSignal.aborted || performance.now() >= deadlineAt) {
						items.push(emptySourceMapItem(request, "fetch_failed", fetchDeadlineLimitation));
						continue;
					}
					const item = await fetchOne(request, input, operationSignal, host, budget);
					if (item.status !== "included" && item.status !== "partial") {
						const failureBytes = jsonByteLength(item) + 1;
						if (failureBytes > SOURCE_MAP_OUTPUT_BYTES - expandedBytesBeforeItem) {
							limitation = sourceMapOutputLimitation(requests.length - items.length);
							break;
						}
						budget.decodedRecords.expandedBytes = expandedBytesBeforeItem + failureBytes;
					}
					items.push(item);
				}
			} catch (cause) {
				if (signal?.aborted === true && cause === signal.reason) return err(retainCompleted(new AnalysisCancelledError("analyze_web_bundle", { cause: signal.reason })));
				if (cause instanceof AnalysisError) return err(retainCompleted(cause));
				if (signal?.aborted === true) return err(retainCompleted(new AnalysisCancelledError("analyze_web_bundle", { cause: signal.reason })));
				if (cause instanceof SourceMapFormatFailure && cause.reason === "limit") limitation = sourceMapOutputLimitation(requests.length - items.length);
				else throw cause;
			} finally {
				clearTimeout(timeout);
				signal?.removeEventListener("abort", abortFromCaller);
			}
			if (signal?.aborted === true) return err(retainCompleted(new AnalysisCancelledError("analyze_web_bundle", { cause: signal.reason })));
			return ok(webSourceMapsSchema.parse({
				status: sourceMapsStatus(items, limitation !== undefined),
				requested: requests.length,
				processed: items.length,
				items,
				...limitation === undefined ? {} : { limitation }
			}));
		};
		sourceMapOutputLimitation = (unprocessed) => `source-map output budget could not retain results for ${String(unprocessed)} requested map${unprocessed === 1 ? "" : "s"}. their results are unknown.`;
		sourceMapsStatus = (items, omitted) => {
			const retained = items.filter(({ status }) => status === "included" || status === "partial").length;
			if (items.length === 0 || retained === 0) return "unavailable";
			if (omitted) return "partial";
			return retained === items.length && !items.some(({ status }) => status === "partial") ? "included" : "partial";
		};
		SourceMapDeadlineError = class extends Error {
			constructor(message) {
				super(message);
				this.name = "SourceMapDeadlineError";
			}
		};
		SourceMapSizeLimitError = class extends Error {
			constructor() {
				super(`Source-map response exceeded the ${String(SOURCE_MAP_RESPONSE_BYTES)}-byte retained budget. ${noRuntimeOverrideSentence("That response budget stays fixed.", "source_map_fetch_timeout_ms")}`);
				this.name = "SourceMapSizeLimitError";
			}
		};
		SourceMapEncodingError = class extends Error {
			responseIdentity;
			constructor(responseIdentity) {
				super("Source-map response is not valid UTF-8.");
				this.responseIdentity = responseIdentity;
				this.name = "SourceMapEncodingError";
			}
		};
		SourceMapRedirectLocationError = class extends Error {
			constructor(url, location) {
				super(`Source-map redirect from ${JSON.stringify(url)} supplied an invalid Location URL: ${JSON.stringify(location)}.`);
				this.name = "SourceMapRedirectLocationError";
			}
		};
		fetchOne = async (request, input, signal, host, budget) => {
			if (!approvedUrl(request.fetchUrl, input.allowed_origins)) return emptySourceMapItem(request, "policy_filtered", "Declared source-map URL must be a credential-free HTTP(S) URL on an approved exact origin.");
			let effectiveUrl = null;
			let completedResponseIdentity;
			try {
				const fetched = await fetchFollowingApprovedRedirects(request.fetchUrl, input.allowed_origins, signal, host, (url) => {
					effectiveUrl = url;
				});
				if (fetched === undefined) return emptySourceMapItem(request, "policy_filtered", "Each source-map redirect must be a credential-free HTTP(S) URL on an approved exact origin.", effectiveUrl);
				const { response, fetchedUrl } = fetched;
				try {
					consumeExpandedBytes(budget.decodedRecords, jsonByteLength(fetchedUrl) - 4);
				} catch (cause) {
					try {
						await response.body?.cancel();
					} catch (cleanupCause) {
						if (cause instanceof SourceMapFormatFailure && cause.reason === "limit") throw sourceMapOutputError(cause, {
							cause: new AggregateError([cause, cleanupCause], "Source-map response cleanup failed after its output exceeded capacity."),
							cleanup: {
								reason: "Source-map response cancellation failed after its output exceeded capacity.",
								resources: ["source-map-response"]
							}
						});
						throw cause;
					}
					throw cause;
				}
				if (!response.ok) {
					await response.body?.cancel();
					return emptySourceMapItem(request, "fetch_failed", `Source-map server returned HTTP ${String(response.status)}.`, fetchedUrl);
				}
				checkOperation(undefined, signal, budget.deadlineAt, budget.deadlineLimitation);
				const body = await readBoundedText(response, budget, host.maxResponseBytes ?? SOURCE_MAP_RESPONSE_BYTES, signal);
				completedResponseIdentity = body.responseIdentity;
				return normalizeSourceMap(request, body.text, body.responseIdentity, fetchedUrl, {
					signal,
					deadlineAt: budget.deadlineAt,
					deadlineLimitation: budget.deadlineLimitation,
					budget: budget.decodedRecords
				});
			} catch (cause) {
				if (cause instanceof AnalysisResourceConstraintError) throw cause;
				if (cause instanceof SourceMapFormatFailure && cause.reason === "limit") throw cause;
				if (signal?.aborted === true && !(signal.reason instanceof SourceMapDeadlineError)) throw cause;
				if (cause instanceof SourceMapEncodingError) return emptySourceMapItem(request, "invalid", cause.message, effectiveUrl, cause.responseIdentity);
				return emptySourceMapItem(request, "fetch_failed", cause instanceof SourceMapRedirectLocationError || cause instanceof SourceMapSizeLimitError || cause instanceof SourceMapDeadlineError ? cause.message : "Source-map fetch or validation failed.", effectiveUrl, completedResponseIdentity);
			}
		};
		isFetchRedirectStatus = (status) => status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
		fetchFollowingApprovedRedirects = async (initialUrl, allowedOrigins, signal, host, observeResponse) => {
			let current = initialUrl;
			const visited = new Set();
			for (;;) {
				if (signal?.aborted === true) throw signal.reason;
				if (!approvedUrl(current, allowedOrigins)) return undefined;
				if (visited.has(current)) throw new Error("source_map_redirect_loop");
				visited.add(current);
				const response = await promiseWithAbort(host.fetch(current, {
					method: "GET",
					headers: { Accept: "application/json, application/source-map+json;q=0.9" },
					redirect: "manual",
					credentials: "omit",
					referrerPolicy: "no-referrer",
					...signal === undefined ? {} : { signal }
				}), signal);
				observeResponse(current);
				if (signal !== undefined && signalIsAborted(signal)) {
					await response.body?.cancel(signal.reason).catch(() => undefined);
					throw signal.reason;
				}
				if (!isFetchRedirectStatus(response.status)) return {
					response,
					fetchedUrl: current
				};
				const location = response.headers.get("location");
				if (location === null) return {
					response,
					fetchedUrl: current
				};
				await response.body?.cancel();
				try {
					current = new URL(location, current).href;
				} catch {
					throw new SourceMapRedirectLocationError(current, location);
				}
			}
		};
		readBoundedText = async (response, budget, maxBytes, signal) => {
			if (response.body === null) return {
				text: "",
				responseIdentity: {
					sha256: createHash("sha256").digest("hex"),
					bytes: 0,
					representation: "fetch-response-body-bytes"
				}
			};
			const reader = response.body.getReader();
			const chunks = [];
			let bytes = 0;
			try {
				for (;;) {
					if (signal?.aborted === true) throw signal.reason;
					const { done, value } = await readWithAbort(reader, signal);
					if (done) break;
					const nextBytes = value?.byteLength ?? 0;
					if (budget.retainedBytes + bytes + nextBytes > maxBytes) {
						await reader.cancel(new SourceMapSizeLimitError());
						throw new SourceMapSizeLimitError();
					}
					if (value !== undefined) chunks.push(value);
					bytes += nextBytes;
				}
			} finally {
				if (signal?.aborted !== true) reader.releaseLock();
			}
			budget.retainedBytes += bytes;
			const joined = new Uint8Array(bytes);
			let offset = 0;
			for (const chunk of chunks) {
				joined.set(chunk, offset);
				offset += chunk.byteLength;
			}
			const responseIdentity = {
				sha256: createHash("sha256").update(joined).digest("hex"),
				bytes,
				representation: "fetch-response-body-bytes"
			};
			try {
				return {
					text: new TextDecoder("utf-8", {
						fatal: true,
						ignoreBOM: true
					}).decode(joined),
					responseIdentity
				};
			} catch {
				throw new SourceMapEncodingError(responseIdentity);
			}
		};
		readWithAbort = (reader, signal) => {
			if (signal === undefined) return reader.read();
			if (signal.aborted) return Promise.reject(signal.reason);
			return new Promise((resolve, reject) => {
				let settled = false;
				const cleanup = () => signal.removeEventListener("abort", abort);
				const abort = () => {
					if (settled) return;
					settled = true;
					cleanup();
					void reader.cancel(signal.reason).catch(() => undefined);
					reject(signal.reason);
				};
				signal.addEventListener("abort", abort, { once: true });
				void reader.read().then((value) => {
					if (settled) return;
					settled = true;
					cleanup();
					resolve(value);
				}, (cause) => {
					if (settled) return;
					settled = true;
					cleanup();
					void reader.cancel(cause).catch(() => undefined);
					reject(cause);
				});
			});
		};
		signalIsAborted = (signal) => signal?.aborted === true;
		promiseWithAbort = (promise, signal) => {
			if (signal === undefined) return promise;
			return new Promise((resolve, reject) => {
				let settled = false;
				const cleanup = () => signal.removeEventListener("abort", abort);
				const abort = () => {
					if (settled) return;
					settled = true;
					cleanup();
					reject(signal.reason);
				};
				signal.addEventListener("abort", abort, { once: true });
				void promise.then((response) => {
					if (settled || signal.aborted) {
						void response.body?.cancel(signal.reason).catch(() => undefined);
						if (!settled) {
							settled = true;
							cleanup();
							reject(signal.reason);
						}
						return;
					}
					settled = true;
					cleanup();
					resolve(response);
				}, (cause) => {
					if (settled) return;
					settled = true;
					cleanup();
					reject(cause);
				});
				if (signal.aborted) abort();
			});
		};
		normalizeSourceMap = (request, text, responseIdentity, fetchedUrl, context) => {
			const retainedBytesBeforeMap = context.budget.expandedBytes;
			const textBytes = jsonByteLength(text) + artifactMetadataBytes("application/source-map+json", text) - 4;
			const successBytes = retainedBytesBeforeMap - SOURCE_MAP_FAILURE_ENVELOPE_BYTES + SOURCE_MAP_SUCCESS_ENVELOPE_BYTES + textBytes;
			if (successBytes > SOURCE_MAP_OUTPUT_BYTES) return emptySourceMapItem(request, "fetch_failed", "Source-map response text exceeds the 32 MiB source-map output budget; JSON parsing and source-map decoding were not attempted.", fetchedUrl, responseIdentity);
			const parsedJson = safeParseJson(sourceMapJsonText(text));
			if (!parsedJson.ok) return emptySourceMapItem(request, "invalid", "Source-map JSON is not a version 3 map.", fetchedUrl, responseIdentity);
			context.budget.expandedBytes = successBytes;
			try {
				const check = () => checkOperation(undefined, context.signal, context.deadlineAt, context.deadlineLimitation);
				const inspected = inspectSourceMapValue(parsedJson.value, {
					profile: "browser-collection",
					budget: context.budget,
					check
				});
				const sourcesByRaw = new Map();
				const resolvedByRoot = prepareResolvedSources(inspected.leaves, fetchedUrl, context.budget, sourcesByRaw, check);
				check();
				const decoded = decodeValidatedSourceMapLeaves(inspected.leaves, fetchedUrl, check);
				const sourceJsonBytes = new Map();
				const nameJsonBytes = new Map();
				const originalSources = [];
				let declarationIndex = 0;
				for (const { leaf } of decoded) {
					const resolvedSources = resolvedByRoot.get(leaf.map.sourceRoot ?? null);
					for (const [index, rawSource] of leaf.map.sources.entries()) {
						if ((index & 255) === 0) check();
						const resolved = rawSource === null ? null : resolvedSources?.get(rawSource) ?? null;
						const sanitized = resolved === null ? null : cachedSanitized(sourcesByRaw, resolved);
						const content = leaf.map.sourcesContent?.[index] ?? null;
						const mediaType = sourceMediaType(resolved ?? rawSource);
						consumeExpandedBytes(context.budget, (sanitized === null ? 4 : cachedJsonBytes(sourceJsonBytes, sanitized)) + sourceEntryOverheadBytes(index, declarationIndex) + (originalSources.length === 0 ? 0 : 1) + (content === null ? 0 : jsonByteLength(content) + artifactMetadataBytes(mediaType, content) - 4));
						originalSources.push({
							source_index: index,
							declaration_index: declarationIndex++,
							source: sanitized,
							artifact: content === null ? null : createWebTextArtifact(content, mediaType)
						});
					}
				}
				const mappings = [];
				declarationIndex = 0;
				for (const { leaf, rows } of decoded) {
					const resolvedSources = resolvedByRoot.get(leaf.map.sourceRoot ?? null);
					const declarationBase = declarationIndex;
					declarationIndex += leaf.map.sources.length;
					for (const [line, row] of rows.entries()) {
						if ((line & 255) === 0) check();
						for (const segment of row) {
							if (segment.length === 1) continue;
							const rawSource = leaf.map.sources[segment[1]];
							if (rawSource === undefined) continue;
							const resolved = rawSource === null ? null : resolvedSources?.get(rawSource) ?? null;
							const source = resolved === null ? null : cachedSanitized(sourcesByRaw, resolved);
							const name = segment.length === 5 ? leaf.map.names[segment[4]] ?? null : null;
							const generatedLine = leaf.offset.line + line + 1;
							const generatedColumn = segment[0] + (line === 0 ? leaf.offset.column : 0);
							consumeExpandedBytes(context.budget, (source === null ? 4 : cachedJsonBytes(sourceJsonBytes, source)) + (name === null ? 4 : cachedJsonBytes(nameJsonBytes, name)) + mappingRowBytes(segment[1], declarationBase + segment[1], generatedLine, generatedColumn, segment[2] + 1, segment[3]) + (mappings.length === 0 ? 0 : 1));
							mappings.push({
								source_index: segment[1],
								declaration_index: declarationBase + segment[1],
								generated_line: generatedLine,
								generated_column: generatedColumn,
								source,
								original_line: segment[2] + 1,
								original_column: segment[3],
								name
							});
						}
					}
				}
				const modules = originalModuleEdges(originalSources, check, (edge) => consumeExpandedBytes(context.budget, Buffer.byteLength(JSON.stringify(edge)) + 1));
				check();
				if (modules.incomplete.length > 0) consumeExpandedBytes(context.budget, jsonByteLength(`Module edges are incomplete: ${modules.incomplete.length} of ${originalSources.filter(({ artifact }) => artifact !== null).length} original sources could not be parsed in full (${modules.incomplete.join(", ")}).`) - 4);
				const parsed = {
					...sourceMapContext(request, fetchedUrl),
					artifact: sourceMapTextArtifact(text, responseIdentity),
					original_sources: originalSources,
					original_module_edges: modules.edges,
					mappings
				};
				check();
				return modules.incomplete.length === 0 ? {
					...parsed,
					status: "included",
					limitation: null
				} : {
					...parsed,
					status: "partial",
					limitation: `Module edges are incomplete: ${modules.incomplete.length} of ${originalSources.filter(({ artifact }) => artifact !== null).length} original sources could not be parsed in full (${modules.incomplete.join(", ")}).`
				};
			} catch (cause) {
				context.budget.expandedBytes = retainedBytesBeforeMap;
				if (cause instanceof SourceMapFormatFailure && cause.reason === "limit") {
					return emptySourceMapItem(request, "fetch_failed", cause.message, fetchedUrl, responseIdentity);
				}
				if (context.signal?.aborted === true || cause instanceof SourceMapDeadlineError) throw cause;
				return emptySourceMapItem(request, "invalid", cause instanceof SourceMapFormatFailure && cause.reason === "section-overlap" ? cause.message : "Source-map JSON mappings could not be decoded safely.", fetchedUrl, responseIdentity);
			}
		};
		originalModuleEdges = (sources, check, beforeEdge) => {
			const edges = [];
			const incomplete = [];
			for (const source of sources) {
				check();
				if (source.artifact === null) continue;
				const sourceName = source.source;
				if (sourceName === null) {
					incomplete.push(`unnamed source at declaration ${String(source.declaration_index)}`);
					continue;
				}
				const parsed = parseJavaScriptSource(source.artifact.text, originalSourcePath(sourceName));
				check();
				if (parsed === null) {
					incomplete.push(sourceName);
					continue;
				}
				if (parsed.errors.length > 0) incomplete.push(sourceName);
				const seen = new Set();
				let unboundRequires;
				traverseJavaScriptAst(parsed, { enter: (node) => {
					check();
					const dependency = originalDependency(node);
					if (dependency === null) return;
					const { kind, specifier, requireCallee } = dependency;
					if (requireCallee !== undefined) {
						unboundRequires ??= new Set(analyzeParsedJavaScriptReferences(parsed, "require").filter(({ role, resolution }) => role === "read" && resolution === "unbound").map(({ location }) => `${String(location.start.line)}:${String(location.start.column)}`));
						const location = requireCallee.loc?.start;
						if (location === undefined || !unboundRequires.has(`${String(location.line)}:${String(location.column)}`)) return;
					}
					const key = `${kind}\0${specifier}`;
					if (seen.has(key)) return;
					seen.add(key);
					const edge = {
						declaration_index: source.declaration_index,
						from_source: sourceName,
						kind,
						specifier,
						resolved_source: resolveOriginalSource(specifier, sourceName)
					};
					beforeEdge(edge);
					edges.push(edge);
				} });
			}
			return {
				edges,
				incomplete
			};
		};
		originalSourcePath = (source) => {
			const path = URL.parse(source)?.pathname ?? source;
			try {
				return decodeURIComponent(path);
			} catch (cause) {
				if (!(cause instanceof URIError)) throw cause;
				return path;
			}
		};
		checkOperation = (callerSignal, operationSignal, deadlineAt, deadlineLimitation) => {
			if (callerSignal?.aborted === true) throw callerSignal.reason;
			if (operationSignal?.aborted === true) throw operationSignal.reason;
			if (performance.now() >= deadlineAt) throw new SourceMapDeadlineError(deadlineLimitation);
		};
		approvedUrl = (value, allowedOrigins) => {
			try {
				const parsed = new URL(value);
				return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.username === "" && parsed.password === "" && allowedOrigins.includes(parsed.origin);
			} catch (cause) {
				void cause;
				return false;
			}
		};
		sourceMapContext = (request, effectiveUrl = null) => ({
			script_key: request.scriptKey,
			declared_url: request.declaredUrl,
			effective_url: effectiveUrl
		});
		emptySourceMapItem = (request, status, limitation, effectiveUrl = null, responseIdentity) => {
			const base = {
				...sourceMapContext(request, effectiveUrl),
				artifact: null,
				original_sources: [],
				original_module_edges: [],
				mappings: [],
				limitation: responseIdentity === undefined ? limitation : `${limitation} Response text was not retained; completed response body identity is available.`
			};
			return status === "policy_filtered" ? {
				...base,
				status
			} : {
				...base,
				status,
				...responseIdentity === undefined ? {} : { response_identity: responseIdentity }
			};
		};
		sourceMapTextArtifact = (text, responseIdentity) => ({
			sha256: responseIdentity.sha256,
			bytes: responseIdentity.bytes,
			media_type: "application/source-map+json",
			charset: "utf-8",
			text
		});
		sanitizeSource = (value) => {
			try {
				return sanitizeBrowserUrl(new URL(value).href).url;
			} catch (cause) {
				void cause;
				return value;
			}
		};
		prepareResolvedSources = (leaves, mapUrl, budget, sanitizedByResolved, check) => {
			const resolvedByRoot = new Map();
			let estimate = budget.expandedBytes;
			let resolvedBytes = budget.resolvedSourceBytes;
			for (const { map } of leaves) {
				let sourcesForRoot = resolvedByRoot.get(map.sourceRoot ?? null);
				if (sourcesForRoot === undefined) {
					sourcesForRoot = new Map();
					resolvedByRoot.set(map.sourceRoot ?? null, sourcesForRoot);
				}
				for (const source of map.sources) {
					check();
					if (source === null) continue;
					const sourceKey = source;
					let resolved = sourcesForRoot.get(sourceKey);
					if (resolved === undefined) {
						const candidate = resolveJavaScriptSourceMapUrl(source, map.sourceRoot, mapUrl);
						if (candidate === null) continue;
						resolved = candidate;
					}
					const bytes = Buffer.byteLength(resolved, "utf8");
					if (bytes > SOURCE_MAP_RESPONSE_BYTES - resolvedBytes) throw resolvedSourceLimitFailure();
					resolvedBytes += bytes;
					sourcesForRoot.set(sourceKey, resolved);
					const sanitized = cachedSanitized(sanitizedByResolved, resolved);
					estimate += jsonByteLength(sanitized);
					if (estimate > WEB_SOURCE_MAP_LIMITS.outputBytes) throw expandedOutputFailure();
				}
			}
			budget.resolvedSourceBytes = resolvedBytes;
			return resolvedByRoot;
		};
		consumeExpandedBytes = (budget, bytes) => {
			if (bytes > WEB_SOURCE_MAP_LIMITS.outputBytes - budget.expandedBytes) throw expandedOutputFailure();
			budget.expandedBytes += bytes;
		};
		expandedOutputFailure = () => new SourceMapFormatFailure("limit", `Expanded source-map evidence exceeds the ${String(WEB_SOURCE_MAP_LIMITS.outputBytes)}-byte public representation budget. ${noRuntimeOverrideSentence("That representation budget stays fixed.", "source_map_fetch_timeout_ms")}`);
		sourceMapOutputError = (cause, options) => new AnalysisResourceConstraintError("analyze_web_bundle", "transport", cause.message, { maximum_source_map_output_bytes: SOURCE_MAP_OUTPUT_BYTES }, {
			cause,
			...options
		});
		resolvedSourceLimitFailure = () => new SourceMapFormatFailure("limit", `Resolved source-map identities exceed the ${String(SOURCE_MAP_RESPONSE_BYTES / (1024 * 1024))} MiB decoder representation budget. ${noRuntimeOverrideSentence("That representation budget stays fixed.", "source_map_fetch_timeout_ms")}`);
		artifactMetadataBytes = (mediaType, text) => Buffer.byteLength(JSON.stringify({
			sha256: "0".repeat(64),
			bytes: Buffer.byteLength(text),
			media_type: mediaType,
			charset: "utf-8",
			text: ""
		})) - 2;
		EMPTY_SOURCE_MAP_FAILURE = emptySourceMapItem({
			scriptKey: "",
			declaredUrl: "",
			fetchUrl: ""
		}, "fetch_failed", "x".repeat(SOURCE_MAP_FAILURE_LIMITATION_RESERVE));
		SOURCE_MAP_FAILURE_ENVELOPE_BYTES = Buffer.byteLength(JSON.stringify(EMPTY_SOURCE_MAP_FAILURE)) - 4;
		SOURCE_MAP_SUCCESS_ENVELOPE_BYTES = Buffer.byteLength(JSON.stringify({
			...EMPTY_SOURCE_MAP_FAILURE,
			status: "included",
			limitation: null
		})) - 4;
		sourceMapFailureReservation = (request, effectiveUrl = null, limitation, status = "fetch_failed") => SOURCE_MAP_FAILURE_ENVELOPE_BYTES + jsonByteLength(request.declaredUrl) + jsonByteLength(request.scriptKey) + (effectiveUrl === null ? 0 : jsonByteLength(effectiveUrl) - 4) + Math.max(0, (limitation === undefined ? 0 : jsonByteLength(limitation)) - SOURCE_MAP_FAILURE_LIMITATION_RESERVE - 2) + jsonByteLength(status) - jsonByteLength("fetch_failed");
		sourceEntryOverheadBytes = (sourceIndex, declarationIndex) => Buffer.byteLength(`{"source_index":${String(sourceIndex)},"declaration_index":${String(declarationIndex)},"source":,"artifact":null}`);
		cachedJsonBytes = (cache, value) => {
			const cached = cache.get(value);
			if (cached !== undefined) return cached;
			const bytes = jsonByteLength(value);
			cache.set(value, bytes);
			return bytes;
		};
		cachedSanitized = (cache, value) => {
			const cached = cache.get(value);
			if (cached !== undefined) return cached;
			const sanitized = sanitizeSource(value);
			cache.set(value, sanitized);
			return sanitized;
		};
		mappingRowBytes = (sourceIndex, declarationIndex, generatedLine, generatedColumn, originalLine, originalColumn) => Buffer.byteLength(`{"source_index":${String(sourceIndex)},"declaration_index":${String(declarationIndex)},"generated_line":${String(generatedLine)},"generated_column":${String(generatedColumn)},"source":,"original_line":${String(originalLine)},"original_column":${String(originalColumn)},"name":}`);
		resolveOriginalSource = (specifier, base) => {
			if (!isUrlLikeModuleSpecifier(specifier)) return null;
			try {
				return sanitizeSource(new URL(specifier, base).href);
			} catch (cause) {
				void cause;
				return null;
			}
		};
		sourceMediaType = (source) => {
			const path = source === null ? null : originalSourcePath(source);
			return path?.endsWith(".ts") || path?.endsWith(".tsx") || path?.endsWith(".mts") || path?.endsWith(".cts") ? "text/typescript" : "text/javascript";
		};
		originalDependency = (node) => {
			const moduleSource = semanticStaticModuleSource(node);
			if (moduleSource !== null) return {
				kind: "static_import",
				specifier: moduleSource.value
			};
			if (t.isImportExpression(node)) {
				const specifier = stringValue(node.source);
				return specifier === undefined ? null : {
					kind: "dynamic_import",
					specifier
				};
			}
			if ((t.isCallExpression(node) || t.isOptionalCallExpression(node)) && t.isIdentifier(node.callee, { name: "require" })) {
				const specifier = stringValue(node.arguments[0]);
				return specifier === undefined ? null : {
					kind: "require",
					specifier,
					requireCallee: node.callee
				};
			}
			if (t.isTSImportEqualsDeclaration(node)) {
				const specifier = semanticImportEqualsSpecifier(node);
				return specifier === null ? null : {
					kind: "require",
					specifier
				};
			}
			return null;
		};
	})))();
}

//#endregion
//#region dist/browser/CdpObservationSession.js
var observeCdpSession, TimelineCapture, performanceTimestamp, waitForWindow, captureFinalUrl, frameId, hasNoComparableProducerTimestamp, isTimelineEvent, scopedUrl, boundedId, safeDetail, safeNetworkError;
function init_CdpObservationSession() {
	return (init_CdpObservationSession = __esmMin((() => {
		init_analysisErrorCore();
		init_browserObservationError();
		init_webRuntime();
		init_CdpConnection();
		init_CdpCaptureCompleteness();
		init_CdpAuthorizedMainFrame();
		init_CdpCaptureValues();
		init_CdpCaptureDocuments();
		init_CdpFrameIdentity();
		init_CdpTargetEvents();
		init_CdpNetworkEventFacts();
		observeCdpSession = async (context) => {
			const allowedOrigins = new Set(context.input.allowed_origins);
			const initial = await authorizedMainFrame({
				connection: context.connection,
				sessionId: context.sessionId,
				signal: context.signal,
				allowedOrigins,
				operation: "observe_web_session"
			});
			const initialUrl = mainFrameUrl(initial) ?? "";
			const mainFrameId = frameId(initial);
			if (mainFrameId === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			const capture = new TimelineCapture(allowedOrigins, mainFrameId, initialUrl);
			let removeListener = () => {};
			const removeDisconnectListener = context.connection.onDisconnect(() => capture.transportDisconnected());
			try {
				await context.connection.send("Page.enable", {}, context.sessionId, context.signal);
				await context.connection.send("Network.enable", {}, context.sessionId, context.signal);
				await context.connection.send("Performance.enable", { timeDomain: "timeTicks" }, context.sessionId, context.signal);
				removeListener = context.connection.onEvent((event) => {
					if (cdpTargetEventMatches(event, context.sessionId)) capture.ingest(event);
				});
				const armedAt = new Date().toISOString();
				const armTimestamp = performanceTimestamp(await context.connection.send("Performance.getMetrics", {}, context.sessionId, context.signal));
				capture.assertPreArmBufferWithinLimit();
				capture.arm(armTimestamp);
				capture.assertRequestOwnershipWithinLimit();
				await context.connection.send("Page.setLifecycleEventsEnabled", { enabled: true }, context.sessionId, context.signal);
				await context.progress?.report({
					phase: "browser_observation",
					completed: 1,
					total: 2,
					message: "Browser observation armed; perform the requested user action now"
				});
				let endReason = await waitForWindow(context.input.observation_ms, capture, context.connection, context.signal);
				capture.assertRequestOwnershipWithinLimit();
				if (endReason === "window_elapsed") endReason = await captureFinalUrl(context, capture, allowedOrigins);
				capture.assertRequestOwnershipWithinLimit();
				await context.progress?.report({
					phase: "browser_observation",
					completed: 2,
					total: 2,
					message: "Browser observation window ended",
					terminal: true
				});
				capture.assertRequestOwnershipWithinLimit();
				if (capture.scopeExcluded) endReason = "target_left_scope";
				return {
					browser: context.discovery.version,
					target: {
						target_id: context.target.id,
						initial_url: allowedSanitizedUrl(initialUrl, allowedOrigins)?.url ?? "",
						final_url: capture.finalUrl
					},
					window: {
						armed_at: armedAt,
						ended_at: new Date().toISOString(),
						requested_ms: context.input.observation_ms,
						end_reason: endReason
					},
					timeline: capture.timeline,
					completeness: capture.completeness.snapshot(),
					limitations: [
						...context.discovery.limitations ?? [],
						"The timeline begins after REA attaches; earlier navigation and network activity is unavailable.",
						"Only navigation metadata is retained; headers, bodies, cookies, console values, and payloads are not captured by this tool.",
						"An out-of-policy destination ends collection immediately and is recorded without its URL.",
						...capture.hasUnknownEventTime ? ["Timeline rows without a comparable producer timestamp have a null timestamp. Buffered events with unknown timing are retained as context only; they do not establish activity inside the selected observation window."] : []
					]
				};
			} finally {
				removeListener();
				removeDisconnectListener();
			}
		};
		TimelineCapture = class {
			allowedOrigins;
			mainFrameId;
			timeline = [];
			completeness = new CdpCaptureCompleteness(["timeline"]);
			finalUrl;
			#sequence = 0;
			#pendingReload = false;
			#scopeExcluded = false;
			#endReason;
			#armTimestamp;
			#eventsBeforeArm = [];
			#eventsBeforeArmBytes = 0;
			#preArmBufferExceeded = false;
			#hasUnknownEventTime = false;
			#documentRequests = new Map();
			#documentRequestBytes = 0;
			#requestOwnershipFailure;
			#listeners = new Set();
			constructor(allowedOrigins, mainFrameId, initialUrl) {
				this.allowedOrigins = allowedOrigins;
				this.mainFrameId = mainFrameId;
				this.finalUrl = allowedSanitizedUrl(initialUrl, allowedOrigins)?.url ?? null;
			}
			ingest(event) {
				if (this.#endReason !== undefined || this.#scopeExcluded) return;
				if (!isTimelineEvent(event.method)) return;
				if (this.#armTimestamp === undefined) {
					this.#bufferBeforeArm(event);
					return;
				}
				this.#ingestArmed(event);
			}
			#ingestArmed(event, bufferedBeforeArm = false) {
				if (this.#endReason !== undefined || this.#scopeExcluded) return;
				const params = recordValue(event.params);
				if (params === undefined) {
					if (event.method === "Page.frameRequestedNavigation" || event.method === "Page.frameNavigated" || event.method === "Page.navigatedWithinDocument") this.completeness.exclude("timeline", "invalid_protocol_value");
					return;
				}
				const contextOnly = bufferedBeforeArm && hasNoComparableProducerTimestamp(event.method);
				if (contextOnly) this.#hasUnknownEventTime = true;
				switch (event.method) {
					case "Page.frameRequestedNavigation":
						this.#navigationRequested(event, params, contextOnly);
						break;
					case "Page.frameNavigated":
						this.#navigationCommitted(event, params, contextOnly);
						break;
					case "Page.navigatedWithinDocument":
						this.#sameDocument(event, params, contextOnly);
						break;
					case "Network.requestWillBeSent": {
						const facts = readCdpRequestWillBeSent(params);
						this.#requestStarted(facts);
						this.#redirect(facts, bufferedBeforeArm);
						break;
					}
					case "Network.loadingFailed":
						this.#loadingFailed(readCdpLoadingFailed(params), bufferedBeforeArm);
						break;
					case "Network.loadingFinished":
						this.#forgetRequest(readCdpLoadingFinished(params).requestId);
						break;
					case "Page.lifecycleEvent":
						this.#lifecycle(params);
						break;
					case "Inspector.targetCrashed":
						this.targetTerminated(params);
						break;
					case "Target.detachedFromTarget":
						this.sessionDetached(params);
						break;
				}
			}
			arm(timestamp) {
				this.#armTimestamp = timestamp;
				const pending = this.#eventsBeforeArm;
				this.#eventsBeforeArm = [];
				this.#eventsBeforeArmBytes = 0;
				for (const event of pending) this.#ingestArmed(event, true);
			}
			assertPreArmBufferWithinLimit() {
				if (!this.#preArmBufferExceeded) return;
				this.#eventsBeforeArm = [];
				this.#eventsBeforeArmBytes = 0;
				throw new BrowserObservationError("observe_web_session", "payload_limit", { detail: `The retained CDP event buffer exceeded its ${String(WEB_RUNTIME_LIMITS.retainedEventBytes)} byte limit before the observation clock was sampled.` });
			}
			#bufferBeforeArm(event) {
				if (this.#preArmBufferExceeded) return;
				const bytes = event.wireBytes;
				if (bytes > WEB_RUNTIME_LIMITS.retainedEventBytes - this.#eventsBeforeArmBytes) {
					this.#preArmBufferExceeded = true;
					this.#eventsBeforeArm = [];
					this.#eventsBeforeArmBytes = 0;
					return;
				}
				this.#eventsBeforeArm.push(event);
				this.#eventsBeforeArmBytes += bytes;
			}
			onEnd(listener) {
				if (this.#endReason !== undefined) listener(this.#endReason);
				else this.#listeners.add(listener);
				return () => this.#listeners.delete(listener);
			}
			end(reason) {
				if (this.#endReason !== undefined) return;
				this.#endReason = reason;
				for (const listener of this.#listeners) listener(reason);
				this.#listeners.clear();
			}
			targetTerminated(params = {}) {
				if (this.#endReason !== undefined) return;
				this.#add({
					type: "target_terminated",
					params,
					timestamp: null,
					rawUrl: null,
					requestId: null,
					detail: "target_terminated"
				});
				this.end("target_terminated");
			}
			sessionDetached(params = {}) {
				if (this.#endReason !== undefined) return;
				this.#add({
					type: "session_detached",
					params,
					timestamp: null,
					rawUrl: null,
					requestId: null,
					detail: "session_detached"
				});
				this.end("session_detached");
			}
			transportDisconnected() {
				if (this.#endReason !== undefined) return;
				this.#add({
					type: "transport_disconnected",
					params: {},
					timestamp: null,
					rawUrl: null,
					requestId: null,
					detail: "transport_disconnected"
				});
				this.end("transport_disconnected");
			}
			setFinalUrl(rawUrl) {
				if (this.#scopeExcluded) return;
				const destination = scopedUrl(rawUrl, this.allowedOrigins);
				this.finalUrl = destination.scope === "approved" ? destination.url : null;
			}
			get scopeExcluded() {
				return this.#scopeExcluded;
			}
			get hasUnknownEventTime() {
				return this.#hasUnknownEventTime;
			}
			excludeTargetScope(reason) {
				if (this.#scopeExcluded) return;
				this.#scopeExcluded = true;
				this.finalUrl = null;
				this.completeness.exclude("timeline", reason);
			}
			#navigationRequested(event, params, contextOnly) {
				const identity = selectCdpFrameIdentity(cdpFrameEventFacts(event), this.mainFrameId);
				if (identity.identityIssue !== null || identity.parentIssue !== null) this.completeness.exclude("timeline", "invalid_protocol_value");
				if (identity.selection !== "main") return;
				const reason = safeDetail(params.reason);
				const rawUrl = cdpStringValue(params.url);
				const destination = rawUrl === undefined ? undefined : scopedUrl(rawUrl, this.allowedOrigins);
				if (!contextOnly) this.#pendingReload = reason === "reload";
				this.#add({
					type: "navigation_requested",
					params,
					timestamp: null,
					rawUrl: rawUrl ?? null,
					requestId: null,
					detail: reason
				});
				if (destination !== undefined) this.#stopIfOutOfScope(destination);
			}
			#navigationCommitted(event, params, contextOnly) {
				const frame = recordValue(params.frame);
				const identity = selectCdpFrameIdentity(cdpFrameEventFacts(event), this.mainFrameId);
				if (identity.identityIssue !== null || identity.parentIssue !== null) this.completeness.exclude("timeline", "invalid_protocol_value");
				if (identity.selection !== "main" && !identity.isRootReplacement) return;
				const observation = observeCdpFrameUrl(frame);
				const rawUrl = observation.kind === "observed" ? observation.url : undefined;
				const destination = classifyCdpFrameUrl(observation, this.allowedOrigins);
				if (identity.isRootReplacement) {
					this.mainFrameId = identity.frameId ?? this.mainFrameId;
					this.#pendingReload = false;
					if (contextOnly) {
						if (observation.kind !== "observed") this.invalidateFinalUrl();
						this.#stopIfOutOfScope(destination);
						return;
					}
				}
				this.#add({
					type: !identity.isRootReplacement && !contextOnly && this.#pendingReload ? "same_origin_reload" : "navigation_committed",
					params: {
						...params,
						frameId: frame?.id,
						loaderId: frame?.loaderId
					},
					timestamp: null,
					rawUrl: rawUrl ?? null,
					destinationScope: destination.scope === "unknown" ? null : destination.scope,
					requestId: null,
					detail: safeDetail(frame?.transitionType)
				});
				if (observation.kind !== "observed") this.invalidateFinalUrl();
				if (this.#stopIfOutOfScope(destination)) return;
				if (contextOnly) return;
				this.#pendingReload = false;
				this.finalUrl = destination.url ?? null;
			}
			#sameDocument(event, params, contextOnly) {
				const identity = selectCdpFrameIdentity(cdpFrameEventFacts(event), this.mainFrameId);
				if (identity.identityIssue !== null || identity.parentIssue !== null) this.completeness.exclude("timeline", "invalid_protocol_value");
				if (identity.selection !== "main") return;
				const rawUrl = cdpStringValue(params.url);
				const destination = scopedUrl(rawUrl, this.allowedOrigins);
				this.#add({
					type: "same_document_navigation",
					params,
					timestamp: null,
					rawUrl: rawUrl ?? null,
					requestId: null,
					detail: null
				});
				if (!this.#hasObservedUrl(rawUrl)) return;
				if (this.#stopIfOutOfScope(destination)) return;
				if (contextOnly) return;
				this.finalUrl = destination.url;
			}
			#redirect(facts, bufferedBeforeArm) {
				const resourceType = facts.resourceType;
				if (resourceType !== undefined && resourceType !== "Document") return;
				if (facts.frameId !== this.mainFrameId || facts.redirect.kind !== "response") return;
				const eventTime = this.#networkEventTime(facts.timestamp, bufferedBeforeArm);
				if (!eventTime.keep) return;
				const rawUrl = facts.request?.url;
				const destination = scopedUrl(rawUrl, this.allowedOrigins);
				const response = facts.redirect.response;
				const prior = scopeCdpResponse(response, this.allowedOrigins);
				if (prior.scope !== "approved") this.completeness.exclude("timeline", prior.reason);
				else if (!response.status.ok) this.completeness.exclude("timeline", "invalid_protocol_value");
				this.#add({
					type: "redirect",
					params: facts.source ?? {},
					frameId: facts.frameId ?? null,
					loaderId: facts.loaderId ?? null,
					timestamp: eventTime.timestamp,
					rawUrl: rawUrl ?? null,
					requestId: facts.requestId,
					detail: null,
					redirectResponse: {
						url: prior.scope === "approved" ? prior.url.url : null,
						status: prior.scope === "approved" && response.status.ok ? response.status.value : null,
						scope: prior.scope
					}
				});
				if (!this.#hasObservedUrl(rawUrl)) return;
				this.#stopIfOutOfScope(destination);
			}
			invalidateFinalUrl() {
				this.completeness.exclude("timeline", "invalid_protocol_value");
				this.finalUrl = null;
			}
			/** Missing protocol identity cannot establish that the target left policy. */
			#hasObservedUrl(rawUrl) {
				if (rawUrl !== undefined) return true;
				this.invalidateFinalUrl();
				return false;
			}
			#stopIfOutOfScope(destination) {
				if (destination.scope === "approved" || destination.scope === "unknown") return false;
				this.excludeTargetScope("out_of_target_scope");
				this.end("target_left_scope");
				return true;
			}
			/** Request ingress owns frame/type attribution; loadingFailed has no frameId. */
			#requestStarted(facts) {
				const id = facts.requestId;
				const frameId = facts.frameId;
				if (id === null) {
					if (frameId === this.mainFrameId && facts.resourceType === "Document") this.completeness.exclude("timeline", "invalid_protocol_value");
					return;
				}
				this.#forgetRequest(id);
				if (frameId !== this.mainFrameId || facts.resourceType !== "Document") return;
				const loaderId = facts.loaderId;
				const bytes = Buffer.byteLength(id) + Buffer.byteLength(frameId) + Buffer.byteLength(loaderId ?? "");
				if (bytes > WEB_RUNTIME_LIMITS.retainedEventBytes - this.#documentRequestBytes) {
					this.#requestOwnershipFailure = new BrowserObservationError("observe_web_session", "payload_limit", { detail: `Active document request identities exceeded the ${WEB_RUNTIME_LIMITS.retainedEventBytes}-byte retained event allowance.` });
					this.end("window_elapsed");
					return;
				}
				this.#documentRequests.set(id, {
					frameId,
					loaderId
				});
				this.#documentRequestBytes += bytes;
			}
			#forgetRequest(id) {
				if (id === null) return undefined;
				const request = this.#documentRequests.get(id);
				if (request !== undefined) {
					this.#documentRequests.delete(id);
					this.#documentRequestBytes -= Buffer.byteLength(id) + Buffer.byteLength(request.frameId) + Buffer.byteLength(request.loaderId ?? "");
				}
				return request;
			}
			assertRequestOwnershipWithinLimit() {
				if (this.#requestOwnershipFailure !== undefined) throw this.#requestOwnershipFailure;
			}
			#loadingFailed(facts, bufferedBeforeArm) {
				const requestId = facts.requestId;
				const request = this.#forgetRequest(requestId);
				if (request === undefined) return;
				const eventTime = this.#networkEventTime(facts.timestamp, bufferedBeforeArm);
				if (!eventTime.keep) return;
				this.#add({
					type: "load_failed",
					params: facts.source ?? {},
					frameId: request.frameId,
					loaderId: request.loaderId ?? null,
					timestamp: eventTime.timestamp,
					rawUrl: null,
					requestId: requestId ?? null,
					detail: safeNetworkError(facts.errorText)
				});
			}
			#networkEventTime(timestamp, bufferedBeforeArm) {
				if (!bufferedBeforeArm) return {
					keep: true,
					timestamp: timestamp ?? null
				};
				if (timestamp === undefined || timestamp < 0) {
					this.completeness.exclude("timeline", "invalid_protocol_value");
					this.#hasUnknownEventTime = true;
					return {
						keep: true,
						timestamp: null
					};
				}
				if (this.#armTimestamp === undefined || timestamp <= this.#armTimestamp) return {
					keep: false,
					timestamp
				};
				return {
					keep: true,
					timestamp
				};
			}
			#lifecycle(params) {
				if (cdpStringValue(params.frameId) !== this.mainFrameId) return;
				const timestamp = numberValue(params.timestamp);
				if (timestamp === undefined || timestamp < 0 || this.#armTimestamp === undefined) {
					this.completeness.exclude("timeline", "invalid_protocol_value");
					return;
				}
				if (timestamp <= this.#armTimestamp) return;
				this.#add({
					type: "lifecycle",
					params,
					rawUrl: null,
					requestId: null,
					detail: safeDetail(params.name)
				});
			}
			#add(options) {
				const { type, params, rawUrl = null, requestId = null, detail = null } = options;
				const destination = rawUrl == null ? null : scopedUrl(rawUrl, this.allowedOrigins);
				const timestamp = options.timestamp === undefined ? numberValue(params.timestamp) : options.timestamp;
				if (timestamp === undefined || timestamp === null || timestamp !== null && timestamp < 0) {
					this.#hasUnknownEventTime = true;
				}
				if (timestamp !== null && timestamp !== undefined && timestamp < 0) {
					this.completeness.exclude("timeline", "invalid_protocol_value");
				}
				this.#sequence += 1;
				this.timeline.push({
					sequence: this.#sequence,
					type,
					timestamp: timestamp === undefined || timestamp !== null && timestamp < 0 ? null : timestamp,
					frame_id: options.frameId === undefined ? boundedId(params.frameId) : options.frameId,
					loader_id: options.loaderId === undefined ? boundedId(params.loaderId) : options.loaderId,
					request_id: requestId ?? null,
					url: destination?.scope === "approved" ? destination.url : null,
					destination_scope: options.destinationScope ?? destination?.scope ?? null,
					detail,
					...options.redirectResponse === undefined ? {} : { redirect_response: options.redirectResponse }
				});
			}
		};
		performanceTimestamp = (value) => {
			const metrics = recordsValue(recordValue(value)?.metrics).filter(({ name }) => name === "Timestamp");
			const timestamp = numberValue(metrics[0]?.value);
			if (metrics.length !== 1 || timestamp === undefined || timestamp < 0) throw new BrowserObservationError("observe_web_session", "protocol_error", { detail: "Performance.getMetrics returned no valid monotonic Timestamp metric." });
			return timestamp;
		};
		waitForWindow = async (durationMs, capture, connection, signal) => await new Promise((resolve, reject) => {
			const timerController = new AbortController();
			let settled = false;
			let removeEnd = () => {};
			let removeProtocolFailure = () => {};
			const settle = (complete) => {
				if (settled) return;
				settled = true;
				timerController.abort();
				signal?.removeEventListener("abort", onAbort);
				removeEnd();
				removeProtocolFailure();
				complete();
			};
			const finish = (reason) => settle(() => resolve(reason));
			const onAbort = () => settle(() => {
				reject(new AnalysisCancelledError("observe_web_session", { cause: signal?.reason }));
			});
			signal?.addEventListener("abort", onAbort, { once: true });
			if (signal?.aborted === true) onAbort();
			if (!settled) removeEnd = capture.onEnd(finish);
			if (!settled) removeProtocolFailure = connection.onProtocolFailure((error) => settle(() => reject(error)));
			if (settled) return;
			void delayWithCancellation(durationMs, "observe_web_session", timerController.signal).then(() => finish("window_elapsed"), (cause) => settle(() => reject(cause)));
		});
		captureFinalUrl = async (context, capture, allowedOrigins) => {
			if (capture.scopeExcluded) return "target_left_scope";
			const result = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			if (capture.scopeExcluded) return "target_left_scope";
			const observation = observeMainFrameUrl(result);
			const facts = classifyCdpFrameUrl(observation, allowedOrigins);
			if (observation.kind !== "observed") capture.invalidateFinalUrl();
			if (facts.scope === "outside_policy" || facts.scope === "unsupported") {
				capture.excludeTargetScope("out_of_target_scope");
				return "target_left_scope";
			}
			if (facts.url !== undefined) capture.setFinalUrl(facts.url);
			return "window_elapsed";
		};
		frameId = (result) => cdpFrameRecordFacts(recordValue(recordValue(recordValue(result)?.frameTree)?.frame)).frameId ?? undefined;
		hasNoComparableProducerTimestamp = (method) => method === "Page.frameRequestedNavigation" || method === "Page.frameNavigated" || method === "Page.navigatedWithinDocument" || method === "Inspector.targetCrashed" || method === "Target.detachedFromTarget";
		isTimelineEvent = (method) => hasNoComparableProducerTimestamp(method) || method === "Network.requestWillBeSent" || method === "Network.loadingFailed" || method === "Network.loadingFinished" || method === "Page.lifecycleEvent";
		scopedUrl = (value, allowedOrigins) => {
			const allowed = allowedSanitizedUrl(value, allowedOrigins);
			if (allowed !== undefined) return {
				url: allowed.url,
				scope: "approved"
			};
			return isHttpUrl(value) ? {
				url: null,
				scope: "outside_policy"
			} : {
				url: null,
				scope: "unsupported"
			};
		};
		boundedId = (value) => cdpStringValue(value) ?? null;
		safeDetail = (value) => {
			const detail = cdpStringValue(value)?.toLowerCase();
			return detail !== undefined && /^[a-z0-9_.:-]{1,100}$/u.test(detail) ? detail : null;
		};
		safeNetworkError = (value) => {
			const error = cdpStringValue(value);
			return error !== undefined && /^net::ERR_[A-Z0-9_]{1,100}$/u.test(error) ? error : null;
		};
	})))();
}

//#endregion
//#region dist/browser/CdpWebMcpDiscovery.js
var discoverWebMcp, ingestInitialFrameTree, ingestFrameScopeEvent, invalidateFrameFacts, handleFrameUpdate, updateFrameScope, hasNewDocument, removeFrameTools, isTransientFrameUrl, removeFrame, assertStableAuthorizedFrame, requiredDiscoveryFrameUrl, ingestWebMcpEvent, webMcpEventTools, normalizeTool, registrationSource, buildWebMcpResult, toolKey;
function init_CdpWebMcpDiscovery() {
	return (init_CdpWebMcpDiscovery = __esmMin((() => {
		init_CdpFrameIdentity();
		init_jsonValue();
		init_canonicalDigest();
		init_unicodeCodePointOrder();
		init_CdpCaptureCompleteness();
		init_browserObservationError();
		init_CdpOriginScopeError();
		init_CdpCaptureValues();
		init_CdpCaptureDocuments();
		init_CdpOptionalCommand();
		init_CdpCaptureEventHelpers();
		discoverWebMcp = async (context) => {
			const origins = new Set(context.input.allowed_origins);
			const limitations = ["Page-declared tool metadata is untrusted and is never registered or invoked by REA.", "Discovery uses only WebMCP.enable and toolsAdded/toolsRemoved; WebMCP.invokeTool is never called."];
			const completeness = new CdpCaptureCompleteness();
			await context.connection.send("Page.enable", {}, context.sessionId, context.signal);
			const frameTree = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			const initialUrl = requiredDiscoveryFrameUrl(frameTree, origins);
			const frameUrls = new Map();
			const tools = new Map();
			const frameScope = {
				origins,
				frames: frameUrls,
				tools,
				completeness,
				transientFrames: new Set(),
				resolvedTransientFrames: new Set()
			};
			ingestInitialFrameTree(frameTree, frameScope);
			if ([...frameUrls.values()].some((frame) => frame.parentFrameId !== null && frame.origin !== null)) {
				completeness.attachLimited("webmcp_tools");
				limitations.push("WebMCP.enable replay does not establish coverage of pre-existing subframe registrations. Later live registrations are retained, but cannot recover descriptors omitted before attachment.");
			}
			const removeListener = context.connection.onEvent((event) => {
				if (event.sessionId !== context.sessionId) return;
				if (ingestFrameScopeEvent(event, frameScope)) return;
				ingestWebMcpEvent({
					event,
					input: context.input,
					frames: frameUrls,
					tools,
					completeness,
					transientFrames: frameScope.transientFrames,
					resolvedTransientFrames: frameScope.resolvedTransientFrames
				});
			});
			await context.progress?.report({
				phase: "browser_observation",
				completed: 1,
				total: 2,
				message: "Enabling passive WebMCP discovery"
			});
			try {
				const enabled = await optionalCdpCommand(context, "WebMCP.enable", {}, limitations);
				const available = enabled !== undefined;
				if (!available) {
					completeness.unavailable("webmcp_tools");
				} else await delayWithCancellation(context.input.observation_ms, "discover_webmcp_tools", context.signal);
				await assertStableAuthorizedFrame(context, initialUrl, origins);
				if (frameScope.transientFrames.size > 0) completeness.attachLimited("webmcp_tools");
				return buildWebMcpResult({
					context,
					frameTree,
					tools,
					completeness,
					limitations,
					available
				});
			} finally {
				removeListener();
				await context.progress?.report({
					phase: "browser_observation",
					completed: 2,
					total: 2,
					message: "WebMCP discovery complete",
					terminal: true
				});
			}
		};
		ingestInitialFrameTree = (frameTree, state) => {
			const root = recordValue(recordValue(frameTree)?.frameTree);
			if (root === undefined) {
				state.completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return;
			}
			for (const tree of walkFrameTrees(root, (omittedCount) => state.completeness.exclude("webmcp_tools", "invalid_protocol_value", omittedCount))) {
				const facts = cdpFrameRecordFacts(recordValue(tree.frame));
				if (tree !== root && facts.parentRelation === "root") {
					invalidateFrameFacts(facts, state);
					continue;
				}
				handleFrameUpdate(facts, state, true);
			}
		};
		ingestFrameScopeEvent = (event, state) => {
			const facts = cdpFrameEventFacts(event);
			switch (facts.kind) {
				case "detached":
					if (facts.identityIssue !== null || facts.frameId === null) {
						invalidateFrameFacts(facts, state);
						return true;
					}
					removeFrame(facts.frameId, state.frames, state.tools);
					state.transientFrames.delete(facts.frameId);
					state.resolvedTransientFrames.delete(facts.frameId);
					return true;
				case "navigated": return handleFrameUpdate(facts, state, true);
				case "within_document": return handleFrameUpdate(facts, state, false);
				default: return false;
			}
		};
		invalidateFrameFacts = (facts, state) => {
			state.completeness.exclude("webmcp_tools", "invalid_protocol_value");
			if (facts.frameId === null) return;
			removeFrame(facts.frameId, state.frames, state.tools);
			state.transientFrames.delete(facts.frameId);
			state.resolvedTransientFrames.delete(facts.frameId);
		};
		handleFrameUpdate = (sourceFacts, state, documentCommitted) => {
			const frameId = sourceFacts.frameId;
			if (sourceFacts.identityIssue !== null || sourceFacts.parentIssue !== null || sourceFacts.loaderIssue !== null || frameId === null) {
				invalidateFrameFacts(sourceFacts, state);
				return true;
			}
			const observation = observeCdpFrameUrl(sourceFacts.source);
			const facts = classifyCdpFrameUrl(observation, state.origins);
			if (observation.kind !== "observed") {
				removeFrameTools(frameId, state.tools);
				state.frames.delete(frameId);
				state.resolvedTransientFrames.delete(frameId);
				state.completeness.exclude("webmcp_tools", "invalid_protocol_value");
				if (facts.scope === "outside_policy") {
					state.transientFrames.delete(frameId);
					state.completeness.exclude("webmcp_tools", "out_of_target_scope");
				} else state.transientFrames.add(frameId);
				return true;
			}
			if (isTransientFrameUrl(observation.scopeUrl)) {
				if (documentCommitted) {
					removeFrameTools(frameId, state.tools);
					state.transientFrames.add(frameId);
					state.resolvedTransientFrames.delete(frameId);
				}
				return true;
			}
			updateFrameScope(sourceFacts, frameId, facts, state, documentCommitted);
			return true;
		};
		updateFrameScope = (sourceFacts, frameId, facts, state, documentCommitted) => {
			if (facts.url === undefined || facts.origin === null) {
				removeFrameTools(frameId, state.tools);
				state.frames.delete(frameId);
				state.transientFrames.delete(frameId);
				state.resolvedTransientFrames.delete(frameId);
				state.completeness.exclude("webmcp_tools", "out_of_target_scope");
				return;
			}
			const previous = state.frames.get(frameId);
			const loaderId = documentCommitted ? sourceFacts.loaderId : previous?.loaderId;
			if (hasNewDocument(documentCommitted, previous, facts.url, loaderId)) removeFrameTools(frameId, state.tools);
			if (documentCommitted && state.transientFrames.has(frameId)) state.resolvedTransientFrames.add(frameId);
			state.frames.set(frameId, {
				url: facts.url,
				origin: facts.origin,
				...loaderId === undefined ? {} : { loaderId },
				parentFrameId: sourceFacts.parentRelation === "not_applicable" ? previous?.parentFrameId ?? null : sourceFacts.parentId
			});
		};
		hasNewDocument = (documentCommitted, previous, url, loaderId) => documentCommitted && previous !== undefined && (previous.url !== url || loaderId !== undefined && previous.loaderId !== undefined && previous.loaderId !== loaderId);
		removeFrameTools = (frameId, tools) => {
			for (const [key, tool] of tools) if (tool.frame_id === frameId) tools.delete(key);
		};
		isTransientFrameUrl = (url) => {
			if (url === "") return true;
			try {
				const base = new URL(url);
				return base.protocol === "about:" && base.search === "" && (base.pathname === "blank" || base.pathname === "srcdoc");
			} catch (cause) {
				void cause;
				return false;
			}
		};
		removeFrame = (frameId, frames, tools) => {
			const pending = [frameId];
			const removed = new Set();
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined || removed.has(current)) continue;
				removed.add(current);
				for (const [candidate, frame] of frames) if (frame.parentFrameId === current) pending.push(candidate);
				frames.delete(current);
			}
			for (const [key, tool] of tools) if (removed.has(tool.frame_id)) tools.delete(key);
		};
		assertStableAuthorizedFrame = async (context, initialUrl, origins) => {
			const finalTree = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			const finalUrl = requiredDiscoveryFrameUrl(finalTree, origins);
			if (finalUrl !== initialUrl) throw new BrowserObservationError("inspect_web_page", "target_changed");
		};
		requiredDiscoveryFrameUrl = (result, origins) => {
			const observed = observeMainFrameUrl(result);
			const facts = classifyCdpFrameUrl(observed, origins);
			if (facts.scope === "outside_policy" || facts.scope === "unsupported") throw cdpOriginScopeRefusal("discover_webmcp_tools");
			if (observed.kind !== "observed") throw new BrowserObservationError("inspect_web_page", "protocol_error");
			if (facts.url === undefined) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			return observed.url;
		};
		ingestWebMcpEvent = (options) => {
			const { event, input, frames, tools, completeness, transientFrames, resolvedTransientFrames } = options;
			if (event.method !== "WebMCP.toolsAdded" && event.method !== "WebMCP.toolsRemoved") return;
			const params = recordValue(event.params);
			if (params === undefined) {
				completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return;
			}
			if (event.method === "WebMCP.toolsRemoved") {
				for (const removed of webMcpEventTools(params.tools, completeness)) {
					const name = cdpStringValue(removed.name);
					const frameId = cdpStringValue(removed.frameId);
					if (name === undefined || frameId === undefined) {
						completeness.exclude("webmcp_tools", "invalid_protocol_value");
						continue;
					}
					for (const [key, tool] of tools) if (tool.name === name && tool.frame_id === frameId) tools.delete(key);
				}
				return;
			}
			for (const declared of webMcpEventTools(params.tools, completeness)) {
				const frameId = cdpStringValue(declared.frameId);
				if (frameId !== undefined && transientFrames.has(frameId)) {
					if (!resolvedTransientFrames.has(frameId)) continue;
					transientFrames.delete(frameId);
					resolvedTransientFrames.delete(frameId);
				}
				const normalized = normalizeTool(declared, input, frames, completeness);
				if (normalized === undefined) continue;
				tools.set(normalized.tool_key, normalized);
			}
		};
		webMcpEventTools = (value, completeness) => {
			if (!Array.isArray(value)) {
				completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return [];
			}
			const records = [];
			for (const item of value) {
				const record = recordValue(item);
				if (record === undefined) {
					completeness.exclude("webmcp_tools", "invalid_protocol_value");
					continue;
				}
				records.push(record);
			}
			return records;
		};
		normalizeTool = (value, input, frames, completeness) => {
			const frameId = cdpStringValue(value.frameId);
			const name = cdpStringValue(value.name);
			const frame = frameId === undefined ? undefined : frames.get(frameId);
			if (frameId === undefined || name === undefined) {
				completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return undefined;
			}
			if (frame?.origin === null || frame === undefined) {
				completeness.exclude("webmcp_tools", "out_of_target_scope");
				return undefined;
			}
			const description = cdpStringValue(value.description) ?? "";
			const annotations = recordValue(value.annotations);
			const malformedAnnotations = Object.hasOwn(value, "annotations") && annotations === undefined;
			if (malformedAnnotations) completeness.exclude("webmcp_tools", "invalid_protocol_value");
			const annotation = (key) => {
				if (annotations === undefined || !Object.hasOwn(annotations, key)) return null;
				const hint = annotations[key];
				if (typeof hint === "boolean") return hint;
				completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return null;
			};
			const consequential = annotation("consequential");
			const unknownConsequential = malformedAnnotations || annotations !== undefined && Object.hasOwn(annotations, "consequential") && typeof annotations.consequential !== "boolean";
			const declaration = Object.hasOwn(value, "inputSchema") ? jsonValueSchema.safeParse(value.inputSchema) : undefined;
			if (declaration?.success === false) completeness.exclude("webmcp_tools", "invalid_protocol_value");
			const schema = declaration?.success === true ? declaration.data : null;
			const registrationFrame = topCallFrame(value.stackTrace);
			const coordinates = cdpSourceCoordinates(registrationFrame.ok ? registrationFrame.value : undefined);
			if (!registrationFrame.ok || coordinates.invalid) completeness.exclude("webmcp_tools", "invalid_protocol_value");
			return {
				tool_key: toolKey(frame.url, frameId, name),
				name,
				description,
				frame_id: frameId,
				frame_url: frame.url,
				owner_origin: frame.origin,
				declaration_kind: numberValue(value.backendNodeId) === undefined ? "imperative" : "declarative",
				input_schema: schema,
				input_schema_sha256: declaration?.success === true ? digestCanonicalValue(schema) : null,
				annotations: {
					read_only: annotation("readOnly"),
					untrusted_content: annotation("untrustedContent"),
					...unknownConsequential ? {} : { consequential },
					autosubmit: annotation("autosubmit")
				},
				registration_source: registrationSource(registrationFrame.ok && !coordinates.invalid ? registrationFrame.value : undefined, new Set(input.allowed_origins)),
				trust: "page-declared-untrusted"
			};
		};
		registrationSource = (frame, allowedOrigins) => {
			const url = allowedSanitizedUrl(frame?.url, allowedOrigins);
			const coordinates = cdpSourceCoordinates(frame);
			return frame === undefined || url === undefined ? null : {
				url: url.url,
				line: coordinates.line,
				column: coordinates.column
			};
		};
		buildWebMcpResult = (options) => {
			const { context, frameTree, tools, completeness, limitations, available } = options;
			const targetUrl = mainFrameUrl(frameTree) ?? context.target.url;
			const sanitized = allowedSanitizedUrl(targetUrl, new Set(context.input.allowed_origins));
			return {
				browser: context.discovery.version,
				target: {
					target_id: context.target.id,
					url: sanitized?.url ?? "[unsupported-url]",
					origin: sanitized?.origin ?? ""
				},
				status: available ? "available" : "unavailable",
				tools: {
					total: tools.size + completeness.droppedTotal,
					items: [...tools.values()].sort((left, right) => compareUnicodeCodePoints(left.tool_key, right.tool_key))
				},
				completeness: completeness.snapshot(),
				limitations
			};
		};
		toolKey = (frameUrl, frameId, name) => `webmcp_${createHash("sha256").update(compositeKey([
			frameUrl,
			frameId,
			name
		])).digest("hex")}`;
	})))();
}

//#endregion
//#region dist/browser/CdpScreenshot.js
var captureCdpScreenshot, readScreenshotViewport, coversViewport, assertSameViewport, captureScreenshotImage, decodeScreenshot, observeScreenshotNavigation;
function init_CdpScreenshot() {
	return (init_CdpScreenshot = __esmMin((() => {
		init_webScreenshot();
		init_browserObservationError();
		init_CdpOriginScopeError();
		init_CdpFrameIdentity();
		init_CdpCaptureValues();
		init_CdpCaptureDocuments();
		init_CdpCaptureCompleteness();
		init_pngHeader();
		captureCdpScreenshot = async (context) => {
			const origins = new Set(context.input.allowed_origins);
			await context.progress?.report({
				phase: "browser_observation",
				completed: 1,
				total: 2,
				message: "Authorizing current screenshot frame"
			});
			await context.connection.send("Page.enable", {}, context.sessionId, context.signal);
			const before = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			const initialFrame = recordValue(recordValue(recordValue(before)?.frameTree)?.frame);
			const beforeObservation = observeCdpFrameUrl(initialFrame);
			const beforeFacts = classifyCdpFrameUrl(beforeObservation, origins);
			if (beforeFacts.scope === "outside_policy" || beforeFacts.scope === "unsupported") throw cdpOriginScopeRefusal("capture_web_screenshot");
			if (beforeObservation.kind !== "observed") throw new BrowserObservationError("inspect_web_page", "protocol_error");
			const beforeUrl = beforeFacts.url;
			const mainFrame = cdpFrameRecordFacts(initialFrame);
			if (beforeUrl === undefined || beforeFacts.origin === null || mainFrame.frameId === null || mainFrame.identityIssue !== null || mainFrame.parentRelation !== "root") throw new BrowserObservationError("capture_web_screenshot", "protocol_error");
			const navigation = {
				changed: false,
				leftScope: false,
				invalidIdentity: false,
				frameId: mainFrame.frameId,
				url: beforeUrl,
				loaderId: mainFrame.loaderId,
				completeness: new CdpCaptureCompleteness()
			};
			const removeListener = context.connection.onEvent((event) => {
				if (event.sessionId !== context.sessionId) return;
				observeScreenshotNavigation(event, origins, navigation);
			});
			const assertCurrentDocument = () => {
				if (navigation.leftScope) throw cdpOriginScopeRefusal("capture_web_screenshot");
				if (navigation.invalidIdentity) throw new BrowserObservationError("inspect_web_page", "protocol_error");
				if (navigation.changed) throw new BrowserObservationError("inspect_web_page", "target_changed");
			};
			let screenshot;
			let after;
			try {
				const viewport = await readScreenshotViewport(context);
				assertCurrentDocument();
				screenshot = await captureScreenshotImage(context);
				assertCurrentDocument();
				const currentViewport = await readScreenshotViewport(context);
				assertCurrentDocument();
				assertSameViewport(viewport, currentViewport);
				if (!coversViewport(screenshot, currentViewport)) {
					screenshot = await captureScreenshotImage(context, currentViewport.clip);
					assertCurrentDocument();
					const recoveredViewport = await readScreenshotViewport(context);
					assertCurrentDocument();
					assertSameViewport(currentViewport, recoveredViewport);
					if (!coversViewport(screenshot, recoveredViewport)) throw new BrowserObservationError("inspect_web_page", "protocol_error", { detail: "The screenshot does not cover the reported visual viewport." });
				}
				after = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			} finally {
				removeListener();
			}
			assertCurrentDocument();
			if (navigation.leftScope) throw cdpOriginScopeRefusal("capture_web_screenshot");
			const afterObservation = observeMainFrameUrl(after);
			const afterFacts = classifyCdpFrameUrl(afterObservation, origins);
			if (afterFacts.scope === "outside_policy" || afterFacts.scope === "unsupported") throw cdpOriginScopeRefusal("capture_web_screenshot");
			if (navigation.invalidIdentity || afterObservation.kind !== "observed") throw new BrowserObservationError("inspect_web_page", "protocol_error");
			const afterUrl = afterFacts.url;
			if (navigation.changed || afterUrl !== beforeUrl || afterUrl === undefined) throw new BrowserObservationError("inspect_web_page", "target_changed");
			await context.progress?.report({
				phase: "browser_observation",
				completed: 2,
				total: 2,
				message: "Screenshot capture complete",
				terminal: true
			});
			return {
				browser: context.discovery.version,
				target: {
					target_id: context.target.id,
					url: beforeUrl,
					origin: beforeFacts.origin
				},
				captured_at: new Date().toISOString(),
				viewport: screenshot.dimensions,
				artifact: createWebScreenshotArtifact(screenshot.bytes),
				completeness: navigation.completeness.snapshot(),
				limitations: ["The screenshot contains the visible viewport, including on-screen content.", "REA does not scroll, evaluate JavaScript, or capture beyond the current viewport."]
			};
		};
		readScreenshotViewport = async (context) => {
			const metrics = recordValue(await context.connection.send("Page.getLayoutMetrics", {}, context.sessionId, context.signal));
			const visualViewport = recordValue(metrics?.visualViewport);
			const cssViewport = recordValue(metrics?.cssVisualViewport);
			const pageX = numberValue(cssViewport?.pageX);
			const pageY = numberValue(cssViewport?.pageY);
			const width = numberValue(cssViewport?.clientWidth);
			const height = numberValue(cssViewport?.clientHeight);
			const scale = numberValue(cssViewport?.scale);
			const pixelWidth = numberValue(visualViewport?.clientWidth);
			const pixelHeight = numberValue(visualViewport?.clientHeight);
			const pixelScale = numberValue(visualViewport?.scale);
			if (pageX === undefined || pageY === undefined || width === undefined || height === undefined || scale === undefined || pixelWidth === undefined || pixelHeight === undefined || pixelScale !== scale || width <= 0 || height <= 0 || scale <= 0 || pixelWidth <= 0 || pixelHeight <= 0) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			const minimumWidth = Math.max(1, Math.floor(pixelWidth * scale));
			const minimumHeight = Math.max(1, Math.floor(pixelHeight * scale));
			if (!Number.isSafeInteger(minimumWidth) || !Number.isSafeInteger(minimumHeight)) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			return {
				clip: {
					x: pageX,
					y: pageY,
					width,
					height,
					scale
				},
				pixelWidth,
				pixelHeight,
				minimumWidth,
				minimumHeight
			};
		};
		coversViewport = (image, viewport) => image.dimensions.width >= viewport.minimumWidth && image.dimensions.height >= viewport.minimumHeight;
		assertSameViewport = (before, after) => {
			if (before.clip.x !== after.clip.x || before.clip.y !== after.clip.y || before.clip.width !== after.clip.width || before.clip.height !== after.clip.height || before.clip.scale !== after.clip.scale || before.pixelWidth !== after.pixelWidth || before.pixelHeight !== after.pixelHeight) throw new BrowserObservationError("inspect_web_page", "target_changed", { detail: "The visual viewport changed during screenshot capture." });
		};
		captureScreenshotImage = async (context, clip) => {
			const result = recordValue(await context.connection.send("Page.captureScreenshot", {
				format: "png",
				fromSurface: true,
				captureBeyondViewport: clip !== undefined,
				...clip === undefined ? {} : { clip }
			}, context.sessionId, context.signal));
			const screenshot = decodeScreenshot(result);
			if (screenshot === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			return screenshot;
		};
		decodeScreenshot = (result) => {
			const encoded = cdpStringValue(result?.data);
			const bytes = encoded === undefined ? undefined : decodeCanonicalBase64(encoded);
			if (bytes === undefined) return undefined;
			const dimensions = readPngHeaderDimensions(bytes);
			return dimensions === undefined ? undefined : {
				bytes,
				dimensions
			};
		};
		observeScreenshotNavigation = (event, origins, state) => {
			const frameFacts = cdpFrameEventFacts(event);
			const identity = selectCdpFrameIdentity(frameFacts, state.frameId);
			if (identity.applicability === "not_applicable") return;
			if (identity.identityIssue !== null || identity.parentIssue !== null) {
				state.completeness.exclude("screenshot", "invalid_protocol_value");
				if (identity.selection === "unknown" && identity.parentRelation === "child" && identity.identityIssue !== null) return;
				state.invalidIdentity = true;
				return;
			}
			if (identity.selection === "unknown") {
				if (identity.parentRelation === "child") return;
				state.completeness.exclude("screenshot", "invalid_protocol_value");
				state.invalidIdentity = true;
				return;
			}
			if (identity.selection === "other" && !identity.isRootReplacement) return;
			if (event.method === "Page.frameRequestedNavigation") return;
			const observed = observeCdpFrameUrl(frameFacts.source);
			const facts = classifyCdpFrameUrl(observed, origins);
			const frameUrl = facts.url;
			if (event.method === "Page.navigatedWithinDocument" && state.loaderId !== undefined && state.loaderId !== "" && frameUrl === state.url) return;
			if (event.method === "Page.frameNavigated" && !identity.isRootReplacement && state.loaderId !== undefined && state.loaderId !== "" && frameFacts.loaderId === state.loaderId && frameUrl === state.url) return;
			state.changed = true;
			if (facts.scope === "outside_policy" || facts.scope === "unsupported") state.leftScope = true;
			if (observed.kind !== "observed") state.invalidIdentity = true;
			if (event.method === "Page.frameNavigated") {
				if (identity.isRootReplacement) state.frameId = identity.frameId ?? state.frameId;
				state.url = frameUrl ?? state.url;
				state.loaderId = frameFacts.loaderId;
			} else if (event.method === "Page.navigatedWithinDocument") {
				state.url = frameUrl ?? state.url;
			}
		};
	})))();
}

//#endregion
//#region dist/browser/PngVisualDiff.js
var PNG_COMPARISON_WORKING_MEMORY_BYTES, PNG_INFLATE_CHUNK_BYTES, comparePngScreenshots, parsePng, decodePng, admitEncodedInputPair, admitPngPair, inflateBufferAllowance, pngWorkingMemoryError, inflatePng, parseHeader, unfilter, expandRgba, applyFilter, paeth, dimensions, limitations;
function init_PngVisualDiff() {
	return (init_PngVisualDiff = __esmMin((() => {
		init_analysisErrorCore();
		init_webScreenshot();
		init_pngHeader();
		PNG_COMPARISON_WORKING_MEMORY_BYTES = 256 * 1024 * 1024;
		PNG_INFLATE_CHUNK_BYTES = constants.Z_DEFAULT_CHUNK;
		comparePngScreenshots = (input) => {
			admitEncodedInputPair(input.before, input.after);
			const beforePlan = parsePng(input.before, "before");
			const afterPlan = parsePng(input.after, "after");
			admitPngPair(beforePlan, afterPlan);
			const before = decodePng(beforePlan);
			const after = decodePng(afterPlan);
			if (before.width !== after.width || before.height !== after.height) return {
				status: "dimension_mismatch",
				before: dimensions(before),
				after: dimensions(after),
				channel_threshold: input.channel_threshold,
				compared_pixels: 0,
				changed_pixels: null,
				changed_ratio: null,
				maximum_channel_delta: null,
				mean_absolute_channel_delta: null,
				limitations: limitations()
			};
			let changedPixels = 0;
			let maximumDelta = 0;
			let totalDelta = 0;
			for (let offset = 0; offset < before.rgba.length; offset += 4) {
				let changed = false;
				for (let channel = 0; channel < 4; channel += 1) {
					const delta = Math.abs((before.rgba[offset + channel] ?? 0) - (after.rgba[offset + channel] ?? 0));
					totalDelta += delta;
					maximumDelta = Math.max(maximumDelta, delta);
					if (delta > input.channel_threshold) changed = true;
				}
				if (changed) changedPixels += 1;
			}
			const pixels = before.width * before.height;
			const context = {
				before: dimensions(before),
				after: dimensions(after),
				channel_threshold: input.channel_threshold,
				compared_pixels: pixels,
				maximum_channel_delta: maximumDelta,
				mean_absolute_channel_delta: totalDelta / (pixels * 4),
				limitations: limitations()
			};
			if (changedPixels === 0) return {
				...context,
				status: "identical",
				changed_pixels: 0,
				changed_ratio: 0
			};
			return {
				...context,
				status: "different",
				changed_pixels: changedPixels,
				changed_ratio: changedPixels / pixels
			};
		};
		parsePng = (artifact, field) => {
			const bytes = decodeCanonicalBase64(artifact.data_base64);
			if (bytes === undefined || !hasPngSignature(bytes)) throw new TypeError("Invalid PNG signature");
			let offset = 8;
			let header;
			const compressed = [];
			let sawEnd = false;
			let sawPalette = false;
			let imageDataEnded = false;
			let paletteEntries = 0;
			let transparentColor;
			let sawTransparency = false;
			let unsupportedReason;
			while (offset < bytes.length) {
				if (offset + 12 > bytes.length) throw new TypeError("Truncated PNG chunk");
				const length = bytes.readUInt32BE(offset);
				if (length > 2147483647) throw new TypeError("Invalid PNG chunk length");
				const type = bytes.subarray(offset + 4, offset + 8).toString("latin1");
				const dataStart = offset + 8;
				const dataEnd = dataStart + length;
				if (dataEnd + 4 > bytes.length) throw new TypeError("Truncated PNG data");
				const data = bytes.subarray(dataStart, dataEnd);
				if (crc32(bytes.subarray(offset + 4, dataEnd)) !== bytes.readUInt32BE(dataEnd)) throw new TypeError("Invalid PNG chunk checksum");
				if (!/^[A-Za-z]{4}$/u.test(type) || type[2] !== type[2]?.toUpperCase()) throw new TypeError("Invalid PNG chunk type");
				if (type !== "IDAT" && compressed.length > 0) imageDataEnded = true;
				if (type === "IHDR") {
					if (offset !== 8 || header !== undefined) throw new TypeError("Invalid PNG header order");
					header = parseHeader(data);
				} else if (header === undefined) throw new TypeError("Invalid PNG header order");
				else if (type === "tRNS") {
					if (sawTransparency || compressed.length > 0) throw new TypeError("Invalid PNG transparency order");
					sawTransparency = true;
					if (header.colorType === 2 && data.length === 6) {
						transparentColor = [
							data.readUInt16BE(0),
							data.readUInt16BE(2),
							data.readUInt16BE(4)
						];
					} else if (header.colorType === 0 && data.length === 2 || header.colorType === 3 && sawPalette && data.length > 0 && data.length <= paletteEntries) {
						unsupportedReason ??= "PNG transparency for this color type is not supported.";
					} else {
						throw new TypeError("Unsupported PNG transparency");
					}
				} else if (type === "PLTE") {
					if (sawPalette || sawTransparency || compressed.length > 0 || length === 0 || length > 768 || length % 3 !== 0 || header.colorType === 3 && length / 3 > 2 ** header.bitDepth || header.colorType !== 2 && header.colorType !== 3 && header.colorType !== 6) throw new TypeError("Invalid PNG palette");
					sawPalette = true;
					paletteEntries = length / 3;
				} else if (type === "IDAT") {
					if (imageDataEnded) throw new TypeError("Nonconsecutive PNG image data");
					compressed.push(data);
				} else if (type === "IEND") {
					if (length !== 0 || dataEnd + 4 !== bytes.length) throw new TypeError("Invalid PNG end chunk");
					sawEnd = true;
					break;
				} else if (/^[A-Z]/u.test(type)) {
					unsupportedReason ??= `Unsupported critical PNG chunk ${type}.`;
				}
				offset = dataEnd + 4;
			}
			if (header === undefined || !sawEnd || compressed.length === 0) throw new TypeError("Incomplete PNG");
			if (header.colorType === 3 && !sawPalette) throw new TypeError("Missing PNG palette");
			if (unsupportedReason !== undefined) throw new AnalysisUnsupportedTargetError("compare_web_screenshots", field, unsupportedReason);
			if (!header.supported) throw new AnalysisUnsupportedTargetError("compare_web_screenshots", field, "PNG encoding is not supported for pixel comparison.");
			const pixels = BigInt(header.width) * BigInt(header.height);
			const expectedRawBytes = (BigInt(header.width) * BigInt(header.channels) + 1n) * BigInt(header.height);
			return {
				bytes,
				width: header.width,
				height: header.height,
				channels: header.channels,
				compressed,
				transparentColor,
				expectedRawBytes,
				unfilteredBytes: pixels * BigInt(header.channels),
				rgbaBytes: pixels * 4n
			};
		};
		decodePng = (plan) => {
			const expected = Number(plan.expectedRawBytes);
			const raw = inflatePng(Buffer.concat(plan.compressed), expected + 1);
			if (raw.byteLength !== expected) throw new TypeError("Unexpected PNG size");
			return {
				width: plan.width,
				height: plan.height,
				rgba: expandRgba(unfilter(raw, plan.width, plan.height, plan.channels), plan.channels, plan.transparentColor)
			};
		};
		admitEncodedInputPair = (before, after) => {
			const sourceBytes = BigInt(before.bytes) + BigInt(after.bytes);
			if (sourceBytes > BigInt(PNG_COMPARISON_WORKING_MEMORY_BYTES)) throw pngWorkingMemoryError(sourceBytes, null, null);
		};
		admitPngPair = (before, after) => {
			const inputBytes = BigInt(before.bytes.byteLength + after.bytes.byteLength);
			const estimate = (current, retained) => {
				const compressedBytes = current.compressed.reduce((total, chunk) => total + BigInt(chunk.byteLength), 0n);
				const rgbaExpansion = current.channels === 3 ? current.rgbaBytes : 0n;
				return inputBytes + (retained?.rgbaBytes ?? 0n) + compressedBytes + inflateBufferAllowance(current.expectedRawBytes) + current.unfilteredBytes + rgbaExpansion;
			};
			const estimateBytes = [estimate(before, undefined), estimate(after, before)].reduce((maximum, value) => value > maximum ? value : maximum, 0n);
			if (estimateBytes > BigInt(PNG_COMPARISON_WORKING_MEMORY_BYTES)) throw pngWorkingMemoryError(estimateBytes, before, after);
		};
		inflateBufferAllowance = (expectedRawBytes) => {
			const chunkBytes = BigInt(PNG_INFLATE_CHUNK_BYTES);
			const maximumOutputBytes = expectedRawBytes + 1n;
			const roundUpToChunk = (bytes) => (bytes + chunkBytes - 1n) / chunkBytes * chunkBytes;
			const rejectedOutputChunks = roundUpToChunk(maximumOutputBytes + chunkBytes - 1n);
			const returnedOutputChunks = roundUpToChunk(maximumOutputBytes);
			const scratchChunk = expectedRawBytes % chunkBytes === 0n || maximumOutputBytes % chunkBytes === 0n ? chunkBytes : 0n;
			const concatenatedOutput = maximumOutputBytes > chunkBytes ? maximumOutputBytes : 0n;
			const returnedOutput = returnedOutputChunks + scratchChunk + concatenatedOutput;
			return rejectedOutputChunks > returnedOutput ? rejectedOutputChunks : returnedOutput;
		};
		pngWorkingMemoryError = (estimateBytes, before, after) => new AnalysisResourceConstraintError("compare_web_screenshots", "memory", "Screenshot comparison exceeds REA's 256 MiB estimated working-memory budget.", {
			boundary: "png-screenshot-comparison",
			estimated_working_memory_bytes: estimateBytes.toString(),
			maximum_working_memory_bytes: PNG_COMPARISON_WORKING_MEMORY_BYTES,
			before_dimensions: before === null ? null : {
				width: before.width,
				height: before.height
			},
			after_dimensions: after === null ? null : {
				width: after.width,
				height: after.height
			}
		}, { remediationAction: "Compare smaller screenshots or reduce their viewport dimensions before capture." });
		inflatePng = (compressed, maxOutputLength) => {
			try {
				return inflateSync(compressed, {
					maxOutputLength,
					chunkSize: PNG_INFLATE_CHUNK_BYTES
				});
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && (cause.code === "Z_DATA_ERROR" || cause.code === "Z_BUF_ERROR" || cause.code === "ERR_BUFFER_TOO_LARGE")) throw new TypeError("Invalid PNG image data", { cause });
				throw cause;
			}
		};
		parseHeader = (data) => {
			const parsed = readPngIhdrFacts(data);
			if (!parsed.ok) throw new TypeError(parsed.error);
			const { width, height, bitDepth, colorType, compressionMethod, filterMethod, interlaceMethod } = parsed.value;
			const validDepth = colorType === 0 && [
				1,
				2,
				4,
				8,
				16
			].includes(bitDepth) || colorType === 2 && [8, 16].includes(bitDepth) || colorType === 3 && [
				1,
				2,
				4,
				8
			].includes(bitDepth) || colorType === 4 && [8, 16].includes(bitDepth) || colorType === 6 && [8, 16].includes(bitDepth);
			if (!validDepth || compressionMethod !== 0 || filterMethod !== 0 || interlaceMethod !== 0 && interlaceMethod !== 1) throw new TypeError("Invalid PNG header");
			return {
				width,
				height,
				colorType,
				bitDepth,
				interlace: interlaceMethod,
				channels: colorType === 6 ? 4 : 3,
				supported: bitDepth === 8 && (colorType === 2 || colorType === 6) && interlaceMethod === 0
			};
		};
		unfilter = (raw, width, height, channels) => {
			const rowBytes = width * channels;
			const decoded = Buffer.alloc(rowBytes * height);
			for (let row = 0; row < height; row += 1) {
				const rawOffset = row * (rowBytes + 1);
				const outputOffset = row * rowBytes;
				const filter = raw[rawOffset];
				if (filter === undefined || filter > 4) throw new TypeError("Unsupported PNG filter");
				for (let column = 0; column < rowBytes; column += 1) {
					const source = raw[rawOffset + 1 + column] ?? 0;
					const left = column >= channels ? decoded[outputOffset + column - channels] ?? 0 : 0;
					const above = row > 0 ? decoded[outputOffset + column - rowBytes] ?? 0 : 0;
					const upperLeft = row > 0 && column >= channels ? decoded[outputOffset + column - rowBytes - channels] ?? 0 : 0;
					decoded[outputOffset + column] = applyFilter({
						filter,
						source,
						left,
						above,
						upperLeft
					});
				}
			}
			return decoded;
		};
		expandRgba = (decoded, channels, transparentColor) => {
			if (channels === 4) return decoded;
			const rgba = Buffer.alloc(decoded.length / channels * 4);
			for (let source = 0, target = 0; source < decoded.length; source += 3, target += 4) {
				rgba[target] = decoded[source] ?? 0;
				rgba[target + 1] = decoded[source + 1] ?? 0;
				rgba[target + 2] = decoded[source + 2] ?? 0;
				rgba[target + 3] = transparentColor !== undefined && transparentColor.every((value, channel) => decoded[source + channel] === value) ? 0 : 255;
			}
			return rgba;
		};
		applyFilter = (options) => {
			const { filter, source, left, above, upperLeft } = options;
			switch (filter) {
				case 0: return source;
				case 1: return source + left & 255;
				case 2: return source + above & 255;
				case 3: return source + Math.floor((left + above) / 2) & 255;
				case 4: return source + paeth(left, above, upperLeft) & 255;
				default: throw new TypeError("Unsupported PNG filter");
			}
		};
		paeth = (left, above, upperLeft) => {
			const prediction = left + above - upperLeft;
			const leftDistance = Math.abs(prediction - left);
			const aboveDistance = Math.abs(prediction - above);
			const upperLeftDistance = Math.abs(prediction - upperLeft);
			return leftDistance <= aboveDistance && leftDistance <= upperLeftDistance ? left : aboveDistance <= upperLeftDistance ? above : upperLeft;
		};
		dimensions = ({ width, height }) => ({
			width,
			height
		});
		limitations = () => [
			"Pixel comparison does not perform OCR, semantic layout analysis, or perceptual color correction.",
			"Only non-interlaced 8-bit RGB and RGBA PNG screenshots are accepted.",
			"PNG tRNS transparency is accepted only as a six-byte RGB color key; tRNS on RGBA or with another length is rejected."
		];
	})))();
}

//#endregion
//#region dist/browser/CdpBrowserProvider.js
var CLEANUP_DOMAINS, CdpBrowserProvider, withTargetSession, selectTargets, providerError;
function init_CdpBrowserProvider() {
	return (init_CdpBrowserProvider = __esmMin((() => {
		init_browserObservation$1();
		init_browserObservationSchemas();
		init_IsolatedWebBundleAnalyzer();
		init_webSourceMapCoverage();
		init_browserSession();
		init_webMcpDiscovery();
		init_browserCaptureComparison();
		init_webScreenshot();
		init_analysisErrorBase();
		init_analysisErrorCleanup();
		init_analysisErrorCore();
		init_browserObservationError();
		init_providerAdapterError();
		init_providerCleanupError();
		init_result();
		init_CdpEndpoint();
		init_CdpTargetSession();
		init_CdpPageCapture();
		init_browserDeadline();
		init_WebSourceMapFetcher();
		init_CdpAuthorizedTarget();
		init_CdpObservationSession();
		init_CdpWebMcpDiscovery();
		init_CdpScreenshot();
		init_PngVisualDiff();
		init_providerIdentities();
		init_unicodeCodePointOrder();
		init_CdpTargetSessionOwner();
		CLEANUP_DOMAINS = [
			"Network",
			"Debugger",
			"Runtime",
			"Page",
			"WebMCP"
		];
		CdpBrowserProvider = class {
			#owner = new CdpTargetSessionOwner();
			#bundleAnalyzer;
			constructor(admission) {
				this.#bundleAnalyzer = new IsolatedWebBundleAnalyzer(undefined, admission);
			}
			async close() {
				const outcomes = await Promise.allSettled([this.#owner.close(), this.#bundleAnalyzer.close()]);
				const failures = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
				if (failures.length === 1) throw failures[0];
				if (failures.length > 1) {
					const typed = failures.filter((failure) => failure instanceof AnalysisError);
					throw new ProviderCleanupError(CDP_BROWSER_PROVIDER_IDENTITY.id, typed.flatMap((failure) => failure.cleanupResources), { reason: "Browser transport and analyzer cleanup remain incomplete" }, {
						operation: "analyze_web_bundle",
						cause: new AggregateError(failures)
					}).bindCleanupDependencies(typed);
				}
			}
			identity() {
				return CDP_BROWSER_PROVIDER_IDENTITY;
			}
			async listTargets(input, options = {}) {
				try {
					const endpoint = await openCdpEndpoint(input.cdp_endpoint, "list_browser_targets", options.signal, undefined, this.#owner);
					if (endpoint.connection !== undefined) await this.#owner.finish(endpoint.connection);
					const { discovery } = endpoint;
					const selected = selectTargets(discovery, input.allowed_origins.length === 0 ? undefined : new Set(input.allowed_origins));
					return ok(browserTargetListSchema.parse({
						browser: discovery.version,
						targets: selected.allowed,
						excluded: selected.excluded,
						limitations: [
							...discovery.limitations ?? [],
							input.allowed_origins.length === 0 ? "All page targets with supported HTTP(S) URLs are listed." : "Only page targets whose current URL matches an explicitly requested exact origin are listed.",
							...selected.unconnectable === 0 ? [] : [`${String(selected.unconnectable)} otherwise allowed page target(s) lacked a validated direct CDP WebSocket and were excluded.`],
							...selected.allowed.some((target) => target.attached === null) ? ["CDP discovery could not establish debugger attachment state for one or more targets."] : []
						]
					}));
				} catch (cause) {
					return err(providerError(cause, "list_browser_targets", options.signal));
				}
			}
			async inspectPage(input, options = {}) {
				try {
					const captured = await this.#capture(input, options, "inspect_web_page");
					return ok(webPageInspectionSchema.parse(captured.inspection));
				} catch (cause) {
					return err(providerError(cause, "inspect_web_page", options.signal));
				}
			}
			async analyzeBundle(input, options = {}) {
				const admission = await this.#bundleAnalyzer.reserve();
				if (!admission.ok) return admission;
				let captured;
				try {
					captured = await this.#capture(input, options, "analyze_web_bundle");
					let sourceMaps;
					if (input.fetch_source_maps) {
						const fetched = await fetchWebSourceMaps(captured.sourceMapRequests, {
							...input,
							allowed_origins: input.allowed_origins.length > 0 ? input.allowed_origins : [captured.inspection.target.origin]
						}, options.signal);
						if (!fetched.ok) {
							const partial = fetched.error.partialObservation;
							if (partial !== undefined && "kind" in partial && partial.kind === "web-source-map-fetch") fetched.error.partialObservation = {
								kind: "web-bundle-acquisition",
								inspection: captured.inspection,
								source_maps: sourceMapsWithCaptureExclusions(partial.source_maps, captured.inspection.completeness.excluded),
								analysis_status: "not_performed"
							};
							else fetched.error.retainPartialObservation(captured.inspection);
							return err(fetched.error);
						}
						sourceMaps = sourceMapsWithCaptureExclusions(fetched.value, captured.inspection.completeness.excluded);
					}
					return await this.#bundleAnalyzer.analyze(captured.inspection, sourceMaps ?? {
						status: "not_requested",
						requested: 0,
						processed: 0,
						items: []
					}, input, options.signal);
				} catch (cause) {
					if (options.signal?.aborted === true && cause === options.signal.reason) {
						return err(new AnalysisCancelledError("analyze_web_bundle", {
							cause,
							...captured === undefined ? {} : { partialObservation: captured.inspection }
						}));
					}
					return err(providerError(cause, "analyze_web_bundle", options.signal));
				} finally {
					this.#bundleAnalyzer.releaseReservation();
				}
			}
			async observeSession(input, options = {}) {
				try {
					return ok(webObservationSessionSchema.parse(await withTargetSession(input, "observe_web_session", options, observeCdpSession, this.#owner)));
				} catch (cause) {
					return err(providerError(cause, "observe_web_session", options.signal));
				}
			}
			async discoverWebMcpTools(input, options = {}) {
				try {
					return ok(webMcpDiscoverySchema.parse(await withTargetSession(input, "discover_webmcp_tools", options, discoverWebMcp, this.#owner)));
				} catch (cause) {
					return err(providerError(cause, "discover_webmcp_tools", options.signal));
				}
			}
			async compareCaptures(input) {
				try {
					return ok(browserCaptureComparisonSchema.parse(compareBrowserCaptures(input)));
				} catch (cause) {
					return err(providerError(cause, "compare_web_captures"));
				}
			}
			async captureScreenshot(input, options = {}) {
				try {
					return ok(webScreenshotSchema.parse(await withTargetSession(input, "capture_web_screenshot", options, captureCdpScreenshot, this.#owner)));
				} catch (cause) {
					return err(providerError(cause, "capture_web_screenshot", options.signal));
				}
			}
			async compareScreenshots(input) {
				try {
					return ok(webScreenshotDiffSchema.parse(comparePngScreenshots(input)));
				} catch (cause) {
					if (cause instanceof TypeError) return err(new AnalysisInputError("compare_web_screenshots", { cause }, [{
						path: [],
						reason: "invalid_format",
						message: cause.message
					}]));
					return err(providerError(cause, "compare_web_screenshots"));
				}
			}
			async #capture(input, options, operation) {
				return await withTargetSession(input, operation, options, async (session) => await capturePage({
					...session,
					operation
				}), this.#owner, (captured) => captured.inspection);
			}
		};
		withTargetSession = async (input, operation, options, work, owner, partialObservation) => {
			const commandTimeoutMs = selectedCdpCommandTimeoutMs(input.command_timeout_ms);
			const endpoint = await openCdpEndpoint(input.cdp_endpoint, operation, options.signal, undefined, owner, commandTimeoutMs);
			let targetSession;
			let outcome;
			let cleanupFailure;
			try {
				const { target, allowedOrigins } = authorizeCdpTarget(endpoint.discovery, input, operation);
				const scopedInput = input.allowed_origins.length > 0 ? input : {
					...input,
					allowed_origins: [...allowedOrigins]
				};
				targetSession = endpoint.connection === undefined ? await openCdpTargetSession(endpoint.discovery, target, operation, options.signal, { commandTimeoutMs }, owner) : await attachCdpTargetSession(endpoint.connection, target, operation, options.signal, owner);
				outcome = ok(await work({
					connection: targetSession.connection,
					sessionId: targetSession.sessionId,
					discovery: endpoint.discovery,
					target,
					input: scopedInput,
					...options.signal === undefined ? {} : { signal: options.signal },
					...options.progress === undefined ? {} : { progress: options.progress }
				}));
			} catch (cause) {
				outcome = err(cause);
			}
			try {
				if (targetSession !== undefined) await closeCdpTargetSession(targetSession, CLEANUP_DOMAINS, options.signal, owner);
				if (endpoint.connection !== undefined && endpoint.connection !== targetSession?.connection) await owner.finish(endpoint.connection);
			} catch (cause) {
				cleanupFailure = cause instanceof AnalysisError ? cause : new ProviderCleanupError("rea-cdp-browser", [input.target_id], { reason: cause instanceof Error ? cause.message : String(cause) }, {
					operation,
					cause
				});
			}
			if (outcome.ok && options.signal?.aborted === true) outcome = err(partialObservation === undefined ? new AnalysisCancelledError(operation, { cause: options.signal.reason }) : new AnalysisCancelledError(operation, {
				cause: options.signal.reason,
				partialObservation: partialObservation(outcome.value)
			}));
			if (cleanupFailure !== undefined) {
				if (!outcome.ok && outcome.error instanceof AnalysisError) throw bindCdpTransportCleanup(cleanupFailure, analysisErrorWithCleanupFailure(outcome.error, cleanupFailure, operation));
				if (!outcome.ok) throw new AggregateError([outcome.error, cleanupFailure], `CDP operation ${operation} failed and cleanup remains incomplete.`, { cause: outcome.error });
				throw bindCdpTransportCleanup(cleanupFailure, new ProviderCleanupError("rea-cdp-browser", cleanupFailure.cleanupResources, { cleanup_error: cleanupFailure.message }, {
					operation,
					cause: cleanupFailure,
					...partialObservation === undefined ? {} : { partialObservation: partialObservation(outcome.value) }
				}));
			}
			if (!outcome.ok) throw outcome.error;
			return outcome.value;
		};
		selectTargets = (discovery, allowedOrigins) => {
			const allowed = [];
			let disallowedOrigin = 0;
			let unsupportedUrl = 0;
			let nonPage = 0;
			let unconnectable = 0;
			for (const target of discovery.targets) {
				if (target.type !== "page") {
					nonPage += 1;
					continue;
				}
				const url = sanitizeBrowserUrl(target.url);
				if (url.origin === null) {
					unsupportedUrl += 1;
					continue;
				}
				if (allowedOrigins !== undefined && !allowedOrigins.has(url.origin)) {
					disallowedOrigin += 1;
					continue;
				}
				if (!hasCdpTargetWebSocket(discovery, target)) {
					unconnectable += 1;
					continue;
				}
				allowed.push({
					target_id: target.id,
					type: target.type,
					title: target.title,
					url: url.url,
					origin: url.origin,
					attached: target.attached
				});
			}
			allowed.sort((left, right) => compareUnicodeCodePoints(left.target_id, right.target_id));
			return {
				allowed,
				excluded: {
					disallowed_origin: disallowedOrigin,
					unsupported_url: unsupportedUrl,
					non_page: nonPage
				},
				unconnectable
			};
		};
		providerError = (cause, operation, signal) => cause instanceof BrowserObservationError ? cause.forOperation(operation) : cause instanceof AnalysisError ? cause : signal?.aborted === true ? new AnalysisCancelledError(operation, { cause }) : new ProviderAdapterError(CDP_BROWSER_PROVIDER_IDENTITY.id, operation, { cause });
	})))();
}

//#endregion
//#region dist/composition/browserObservation.js
var createBrowserObservationProvider;
function init_browserObservation() {
	return (init_browserObservation = __esmMin((() => {
		init_CdpBrowserProvider();
		createBrowserObservationProvider = (admission) => new CdpBrowserProvider(admission);
	})))();
}

//#endregion
init_browserObservation();
export { createBrowserObservationProvider };