import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { posix } from "node:path";
import { domainToASCII, fileURLToPath, pathToFileURL } from "node:url";
import { z } from "zod";
import { crc32 } from "node:zlib";

//#region dist/domain/javascript/javascriptSourceMapPaths.js
var javascriptSourceMapReferenceSchema, resolveJavaScriptSourceMapReferences, resolveJavaScriptSourceMapUrl, sourceMapReference, resolveJavaScriptSourceMapPath, unusableHost, carriesUsableHost, windowsFileUrl, decodedUrlPath;
function init_javascriptSourceMapPaths() {
	return (init_javascriptSourceMapPaths = __esmMin((() => {
		javascriptSourceMapReferenceSchema = z.strictObject({
			source_name: z.string(),
			source_root: z.string().nullable(),
			map_path: z.string().min(1),
			resolution: z.discriminatedUnion("kind", [z.strictObject({
				kind: z.enum(["artifact-relative", "suffix"]),
				path: z.string().min(1)
			}), z.strictObject({
				kind: z.literal("unresolved"),
				reason: z.string().min(1)
			})])
		});
		resolveJavaScriptSourceMapReferences = (sourceNames, sourceRoot, mapPath) => {
			return sourceNames.map((sourceName) => {
				if (sourceName === null) return null;
				return {
					source_name: sourceName,
					source_root: sourceRoot,
					map_path: mapPath,
					resolution: resolveJavaScriptSourceMapPath(sourceMapReference(sourceName, sourceRoot), mapPath)
				};
			});
		};
		resolveJavaScriptSourceMapUrl = (source, sourceRoot, mapUrl) => {
			if (source === null) return null;
			return URL.parse(sourceMapReference(source, sourceRoot), mapUrl)?.href ?? null;
		};
		sourceMapReference = (source, sourceRoot) => {
			if (sourceRoot == null || sourceRoot === "") return source;
			return `${sourceRoot}${sourceRoot.endsWith("/") ? "" : "/"}${source}`;
		};
		resolveJavaScriptSourceMapPath = (source, mapPath) => {
			const portable = source.replaceAll("\\", "/");
			const windowsPath = /^[a-z]:\//iu.test(portable) || source.startsWith("\\\\");
			const anchor = `/${"source/".repeat(portable.split("/").length + 1)}`;
			const directory = posix.join(anchor, posix.dirname(mapPath));
			const base = pathToFileURL(`${directory}/`, { windows: false });
			const absolute = windowsPath ? windowsFileUrl(source) : URL.parse(source);
			const resolved = windowsPath ? absolute : URL.parse(source, base);
			if (resolved === null) return {
				kind: "unresolved",
				reason: "Source reference is not a valid URL or filesystem path."
			};
			if (!resolved.pathname.startsWith("/")) return {
				kind: "unresolved",
				reason: "Source reference uses a non-hierarchical URL without a file pathname."
			};
			if (resolved.pathname.endsWith("/")) return {
				kind: "unresolved",
				reason: "Source reference names a directory rather than a file."
			};
			const declaredPath = windowsPath ? absolute?.pathname ?? "" : URL.parse(source, "file:///")?.pathname ?? "";
			if (/%(?:2f|5c)/iu.test(declaredPath)) return {
				kind: "unresolved",
				reason: "Source reference contains an encoded path separator."
			};
			const relative = absolute === null ? !portable.startsWith("/") : absolute.href !== resolved.href;
			const path = decodedUrlPath(resolved);
			if (path === null) return {
				kind: "unresolved",
				reason: "Source reference has malformed URL encoding or an invalid file URL."
			};
			const value = relative ? posix.relative(anchor, path) : path.replace(/^\/+/, "");
			if (value === "" || value === ".." || value.startsWith("../")) return {
				kind: "unresolved",
				reason: "Source reference resolves outside the inventoried artifact."
			};
			return {
				path: value,
				kind: relative ? "artifact-relative" : "suffix"
			};
		};
		unusableHost = /[\0\t\n\r #/:<>?@[\\\]^|%]/u;
		carriesUsableHost = (host) => !unusableHost.test(host) && domainToASCII(host) !== "";
		windowsFileUrl = (path) => {
			if (path.startsWith("\\\\") && !carriesUsableHost(path.slice(2).split("\\")[0] ?? "")) return null;
			try {
				return pathToFileURL(path, { windows: true });
			} catch (cause) {
				if (cause instanceof TypeError) return null;
				throw cause;
			}
		};
		decodedUrlPath = (url) => {
			try {
				if (url.protocol === "file:") {
					const windows = url.hostname !== "" && url.hostname !== "localhost";
					const path = fileURLToPath(url, { windows });
					return windows ? path.replaceAll("\\", "/") : path;
				}
				return `${url.host}${decodeURIComponent(url.pathname)}`;
			} catch (cause) {
				if (cause instanceof URIError || cause instanceof TypeError) return null;
				throw cause;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticValueTypes.js
var javaScriptSemanticResourceLimitSchema;
function init_javascriptSemanticValueTypes() {
	return (init_javascriptSemanticValueTypes = __esmMin((() => {
		javaScriptSemanticResourceLimitSchema = z.enum([
			"primitive-candidates",
			"primitive-bytes",
			"expression-depth",
			"getter-expansion",
			"alias-selections"
		]);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptStaticCoverage.js
var javaScriptStaticCoverageSchema, javaScriptStaticParseStatus, unexaminedJavaScriptStaticCoverage;
function init_javascriptStaticCoverage() {
	return (init_javascriptStaticCoverage = __esmMin((() => {
		init_javascriptSemanticValueTypes();
		javaScriptStaticCoverageSchema = z.strictObject({
			syntax: z.discriminatedUnion("status", [
				z.strictObject({
					status: z.literal("complete"),
					error_count: z.literal(0)
				}),
				z.strictObject({
					status: z.literal("recovered"),
					error_count: z.int().positive()
				}),
				z.strictObject({
					status: z.literal("failed"),
					error_count: z.null()
				}),
				z.strictObject({
					status: z.literal("not-examined"),
					error_count: z.null()
				})
			]),
			semantics: z.strictObject({
				unknown_findings: z.int().nonnegative().nullable(),
				uncertainty: z.array(z.enum([
					"dynamic-findings",
					"returned-reference-widening",
					"type-only-module-side-effect"
				]))
			}),
			examination: z.strictObject({
				status: z.enum([
					"complete",
					"limited",
					"not-examined"
				]),
				semantic_resource_limits: z.array(javaScriptSemanticResourceLimitSchema),
				electron_call_paths_limited: z.boolean()
			}),
			applicability: z.strictObject({ electron: z.enum(["observed", "unknown"]) }),
			unexamined_reason: z.string().min(1).exactOptional()
		});
		javaScriptStaticParseStatus = (coverage) => coverage.syntax.status === "failed" || coverage.syntax.status === "not-examined" ? "failed" : coverage.syntax.status === "recovered" || (coverage.semantics.unknown_findings ?? 0) > 0 || coverage.examination.semantic_resource_limits.includes("alias-selections") ? "partial" : "complete";
		unexaminedJavaScriptStaticCoverage = (reason) => ({
			syntax: {
				status: "not-examined",
				error_count: null
			},
			semantics: {
				unknown_findings: null,
				uncertainty: []
			},
			examination: {
				status: "not-examined",
				semantic_resource_limits: [],
				electron_call_paths_limited: false
			},
			applicability: { electron: "unknown" },
			unexamined_reason: reason
		});
	})))();
}

//#endregion
//#region dist/domain/browserScenarioTransactions.js
var indexBrowserScenarioTransactions, append;
function init_browserScenarioTransactions() {
	return (init_browserScenarioTransactions = __esmMin((() => {
		indexBrowserScenarioTransactions = (events) => {
			const requestCounts = new Map();
			const responses = new Map();
			const contents = new Map();
			for (const event of events) {
				if (event.kind === "request") requestCounts.set(event.transaction_id, (requestCounts.get(event.transaction_id) ?? 0) + 1);
				else if (event.kind === "response") append(responses, event.transaction_id, event);
				else if (event.kind === "network-content") append(contents, event.source_event_sequence, event);
			}
			return {
				requestCounts,
				responses,
				contents
			};
		};
		append = (map, key, value) => {
			const existing = map.get(key);
			if (existing === undefined) map.set(key, [value]);
			else existing.push(value);
		};
	})))();
}

//#endregion
//#region dist/domain/pngHeader.js
var PNG_SIGNATURE, IHDR_TYPE, hasPngSignature, readPngIhdrFacts, readPngHeaderDimensions;
function init_pngHeader() {
	return (init_pngHeader = __esmMin((() => {
		init_result();
		PNG_SIGNATURE = Buffer.from([
			137,
			80,
			78,
			71,
			13,
			10,
			26,
			10
		]);
		IHDR_TYPE = Buffer.from("IHDR");
		hasPngSignature = (bytes) => bytes.subarray(0, 8).equals(PNG_SIGNATURE);
		readPngIhdrFacts = (data) => {
			if (data.length !== 13) return err("Invalid PNG header");
			const width = data.readUInt32BE(0);
			const height = data.readUInt32BE(4);
			if (width === 0 || height === 0 || width > 2147483647 || height > 2147483647) return err("Invalid PNG header");
			return ok({
				width,
				height,
				bitDepth: data[8],
				colorType: data[9],
				compressionMethod: data[10],
				filterMethod: data[11],
				interlaceMethod: data[12]
			});
		};
		readPngHeaderDimensions = (bytes) => {
			if (bytes.byteLength < 33 || !hasPngSignature(bytes) || bytes.readUInt32BE(8) !== 13 || !bytes.subarray(12, 16).equals(IHDR_TYPE) || crc32(bytes.subarray(12, 29)) !== bytes.readUInt32BE(29)) return undefined;
			const facts = readPngIhdrFacts(bytes.subarray(16, 29));
			return facts.ok ? {
				width: facts.value.width,
				height: facts.value.height
			} : undefined;
		};
	})))();
}

//#endregion
export { indexBrowserScenarioTransactions as a, javaScriptStaticCoverageSchema as c, javaScriptSemanticResourceLimitSchema as d, init_javascriptSourceMapPaths as f, resolveJavaScriptSourceMapUrl as h, readPngIhdrFacts as i, unexaminedJavaScriptStaticCoverage as l, resolveJavaScriptSourceMapReferences as m, init_pngHeader as n, init_browserScenarioTransactions as o, javascriptSourceMapReferenceSchema as p, readPngHeaderDimensions as r, init_javascriptStaticCoverage as s, hasPngSignature as t, init_javascriptSemanticValueTypes as u };