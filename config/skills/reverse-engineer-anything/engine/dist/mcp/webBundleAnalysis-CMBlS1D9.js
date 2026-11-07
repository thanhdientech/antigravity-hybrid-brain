import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { D as JAVASCRIPT_STATIC_FACT_BYTES, k as init_javascriptAnalysisResourceControls } from "./analysisErrorProjection-B_6dTGtM.js";
import { a as init_browserObservation, f as recordedBrowserOriginSchema, s as inspectWebPageWithSourceInputSchema } from "./browserObservation-DGb-Qd7N.js";
import { a as browserDeadlineIncrease, d as init_browserDeadline, f as noRuntimeOverrideSentence, i as MAX_BROWSER_DEADLINE_MS, o as browserDeadlineRetry, p as optionalBrowserDeadlineMs } from "./browserDeadline-YXJtM4nx.js";
import { n as init_digests, t as digestSchema } from "./digests-Ct-nksBF.js";
import { n as digestCanonicalValue, r as init_canonicalDigest } from "./canonicalDigest-D42kAGaz.js";
import { f as init_browserCompleteness, i as webPageInspectionSchema, r as init_browserObservationSchemas, u as browserExclusionSchema } from "./browserObservationSchemas-BmFQ_kVQ.js";
import { n as jsonValueByteLength, t as init_jsonValueByteLength } from "./jsonValueByteLength-D_Ap3bp9.js";
import { c as webTextArtifactMetadataSchema, l as webTextArtifactSchema, s as init_webContentArtifact } from "./cdpObservationSchemas-Bu-3wMbg.js";
import { n as init_emptyArraySchema, t as emptyArraySchema } from "./emptyArraySchema-DMz6PAEg.js";
import { z } from "zod";

//#region dist/domain/javascript/javascriptSourceCoordinates.js
var compareJavaScriptSourcePoints, javascriptSourceRangeContains, javascriptSourceRangeKey, sourcePointSchema, javascriptSourceRangeSchema;
function init_javascriptSourceCoordinates() {
	return (init_javascriptSourceCoordinates = __esmMin((() => {
		compareJavaScriptSourcePoints = (left, right) => left.line - right.line || left.column - right.column;
		javascriptSourceRangeContains = (outer, inner) => compareJavaScriptSourcePoints(outer.start, inner.start) <= 0 && compareJavaScriptSourcePoints(outer.end, inner.end) >= 0;
		javascriptSourceRangeKey = (range) => `${range.start.line}:${range.start.column}-${range.end.line}:${range.end.column}`;
		sourcePointSchema = z.strictObject({
			line: z.number().int().min(1),
			column: z.number().int().min(0)
		});
		javascriptSourceRangeSchema = z.strictObject({
			start: sourcePointSchema,
			end: sourcePointSchema
		}).superRefine((range, context) => {
			if (compareJavaScriptSourcePoints(range.end, range.start) < 0) context.addIssue({
				code: "custom",
				path: ["end"],
				message: "Source range end must not precede its start"
			});
		}).describe("One-based lines, zero-based UTF-16 columns; start inclusive, end exclusive.");
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptRouteFacts.js
var javaScriptRouteMechanismSchema, javaScriptRouteSegmentSchema, javaScriptRouteCandidateSchema, javaScriptRouteWorkCapacitySchema, javaScriptRouteSourceFactsSchema;
function init_javascriptRouteFacts() {
	return (init_javascriptRouteFacts = __esmMin((() => {
		init_javascriptSourceCoordinates();
		javaScriptRouteMechanismSchema = z.enum([
			"router-call",
			"nested-route-object",
			"typed-route-tree",
			"next-app-chunk",
			"navigation-target",
			"route-string-constant"
		]);
		javaScriptRouteSegmentSchema = z.strictObject({
			value: z.string(),
			location: javascriptSourceRangeSchema,
			origin: z.enum([
				"literal",
				"property-name",
				"next-app-path"
			])
		});
		javaScriptRouteCandidateSchema = z.strictObject({
			path: z.string().regex(/^\//u),
			mechanism: javaScriptRouteMechanismSchema,
			confidence: z.enum([
				"low",
				"medium",
				"high"
			]),
			derivation: z.enum([
				"literal",
				"joined",
				"inferred"
			]),
			location: javascriptSourceRangeSchema,
			segments: z.array(javaScriptRouteSegmentSchema)
		});
		javaScriptRouteWorkCapacitySchema = z.strictObject({
			kind: z.literal("route-work-or-facts"),
			limit_bytes: z.int().nonnegative(),
			accounted_fact_bytes: z.int().nonnegative(),
			accounted_work_bytes: z.int().nonnegative()
		});
		javaScriptRouteSourceFactsSchema = z.strictObject({
			candidates: z.array(javaScriptRouteCandidateSchema),
			unresolved: z.array(z.strictObject({
				mechanism: javaScriptRouteMechanismSchema,
				location: javascriptSourceRangeSchema,
				reason: z.string()
			})),
			capacity: z.discriminatedUnion("kind", [javaScriptRouteWorkCapacitySchema, z.strictObject({
				kind: z.literal("result-bytes"),
				limit_bytes: z.int().nonnegative(),
				preceding_work_capacity: javaScriptRouteWorkCapacitySchema.nullable()
			})]).nullable()
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptRoutePaths.js
var packageIdentitySchema, nextAppSourceContextSchema, routePath, isPageShapedPath, classifyNextAppRoutePath, nextScriptBasePath;
function init_javascriptRoutePaths() {
	return (init_javascriptRoutePaths = __esmMin((() => {
		init_digests();
		packageIdentitySchema = z.strictObject({
			path: z.string().min(1),
			sha256: digestSchema,
			container_sha256: digestSchema
		});
		nextAppSourceContextSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("app-directory"),
				directory: z.string().min(1),
				package: packageIdentitySchema
			}),
			z.strictObject({
				kind: z.literal("compiled-directory"),
				directory: z.string().min(1),
				package: packageIdentitySchema
			}),
			z.strictObject({
				kind: z.literal("outside-app-directory"),
				package: packageIdentitySchema
			}),
			z.strictObject({
				kind: z.literal("unknown"),
				reason: z.string(),
				package: packageIdentitySchema.nullable()
			})
		]);
		routePath = (value, options = {}) => {
			const end = options.navigation ? value.search(/[?#]/u) : -1;
			const path = end < 0 ? value : value.slice(0, end);
			if (!path || /[\u0000-\u0020\u007f\\]/u.test(path) || path.startsWith("//")) return;
			if (!path.startsWith("/") && !options.relative) return;
			if (/^[a-z][a-z0-9+.-]*:/iu.test(path)) return;
			return path.startsWith("/") ? path : `/${path}`;
		};
		isPageShapedPath = (value) => {
			const app = /(?:^|\/)app\//u.exec(value);
			if (app === null) return false;
			const tail = value.slice(app.index + app[0].length);
			const lastLineStart = Math.max(tail.lastIndexOf("\n"), tail.lastIndexOf("\r"), tail.lastIndexOf("\u2028"), tail.lastIndexOf("\u2029")) + 1;
			for (const page of tail.matchAll(/(?:^|\/)page(?:\.[cm]?[jt]sx?|-[^/?#]+\.js|)(?=[?#]|$)/gu)) if (page.index + page[0].length >= lastLineStart) return true;
			return false;
		};
		classifyNextAppRoutePath = (raw, context) => {
			if (raw.includes("\\") || context.kind === "source-reference") return;
			let value = raw;
			const urlPath = context.kind === "script-url" || context.kind === "source-literal" && raw.includes("://");
			if (urlPath) {
				try {
					value = new URL(raw).pathname;
				} catch {
					return;
				}
			}
			let relative;
			let chunk = false;
			if (context.kind === "source-path") {
				if (context.source.kind === "outside-app-directory") return;
				if (context.source.kind === "app-directory" || context.source.kind === "compiled-directory") {
					const prefix = `${context.source.directory}/`;
					if (!value.startsWith(prefix)) return;
					relative = value.slice(prefix.length);
					chunk = context.source.kind === "compiled-directory";
				}
			} else if (context.kind === "script-url" || context.runtime === "next") {
				const boundary = "/_next/static/chunks/app/";
				const assetRoot = value.indexOf(boundary);
				const localChunk = ["static/chunks/app/", ".next/static/chunks/app/"].find((prefix) => value.startsWith(prefix));
				if (assetRoot >= 0) {
					relative = value.slice(assetRoot + boundary.length);
					chunk = true;
				} else if (context.kind === "source-literal" && localChunk !== undefined) {
					relative = value.slice(localChunk.length);
					chunk = true;
				} else if (context.kind === "source-literal") {
					const prefix = value.startsWith("src/app/") ? "src/app/" : "app/";
					if (value.startsWith(prefix)) relative = value.slice(prefix.length);
				}
			}
			if (relative === undefined) {
				if (isPageShapedPath(value)) return {
					kind: "unknown",
					reason: context.kind === "source-path" && context.source.kind === "unknown" ? context.source.reason : "The page-shaped path has no established Next App Router root or runtime context."
				};
				return;
			}
			if (urlPath) {
				if (/%(?:2f|5c)/iu.test(relative)) return {
					kind: "unknown",
					reason: "A Next script URL contains an encoded path separator."
				};
				try {
					relative = decodeURIComponent(relative);
				} catch (cause) {
					if (!(cause instanceof URIError)) throw cause;
					return {
						kind: "unknown",
						reason: "A Next script URL contains malformed percent encoding."
					};
				}
			}
			const match = /^(?:([\s\S]*?)\/)?page(?:-([^/?#]+)\.js|\.(?:[cm]?jsx?|tsx?)|)([?#].*)?$/u.exec(relative);
			if (match === null || match[2] !== undefined && !chunk || match[3] !== undefined && (urlPath || context.kind === "source-path")) return;
			if (/[\u0000-\u001f\u007f]/u.test(relative)) return {
				kind: "unknown",
				reason: "A Next page filename contains a control character."
			};
			const sourceSegments = (match[1] ?? "").split("/");
			if (sourceSegments.some((segment) => segment.startsWith("_"))) return;
			const segments = [];
			for (const sourceSegment of sourceSegments) {
				const segment = sourceSegment.replace(/%5F/gu, "_");
				if (/^\([^)]*\)$/u.test(segment) || segment.startsWith("@")) continue;
				if (segment.startsWith("(")) return {
					kind: "unknown",
					reason: "An intercepted Next page route requires parent routing context unavailable from its filename."
				};
				if (segment.includes("/") || segment === "." || segment === "..") return;
				const optional = /^\[\[\.\.\.([^\]]+)\]\]$/u.exec(segment);
				const catchAll = /^\[\.\.\.([^\]]+)\]$/u.exec(segment);
				const parameter = /^\[([^\]]+)\]$/u.exec(segment);
				segments.push(optional ? `:${optional[1]}*` : catchAll ? `:${catchAll[1]}+` : parameter ? `:${parameter[1]}` : segment);
			}
			return {
				kind: "known",
				path: `/${segments.filter(Boolean).join("/")}`
			};
		};
		nextScriptBasePath = (source) => {
			let path = source;
			if (/^https?:\/\//iu.test(source)) {
				try {
					path = new URL(source).pathname;
				} catch {
					return;
				}
			} else if (!source.startsWith("/")) return;
			const at = path.indexOf("/_next/");
			return at < 0 ? undefined : path.slice(0, at);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptRouteInventory.js
/** Join only owned syntax facts and source metadata; never fetch or reinterpret source text. */
function* buildJavaScriptRouteInventorySteps(inputs, byteBudget = JAVASCRIPT_STATIC_FACT_BYTES, captureOmissions = []) {
	const sources = [], occurrences = [], unknowns = [];
	const routes = new Map(), sourceIdsByRoute = new Map(), seenOccurrences = new Set(), seenGaps = new Set();
	const contexts = [];
	const headerBytes = jsonValueByteLength({
		inventory_id: `jsri:${"f".repeat(64)}`,
		source_manifest_sha256: "f".repeat(64),
		sources: [],
		routes: [],
		occurrences: [],
		unknowns: [],
		capacity: {
			limit_bytes: Number.MAX_SAFE_INTEGER,
			accounted_bytes: Number.MAX_SAFE_INTEGER
		},
		coverage: {
			scope: "provided-code-sources",
			source_parsing: "complete",
			candidate_enumeration: "complete",
			application_routes: "unknown"
		},
		statistics: Object.fromEntries([
			"sources_seen",
			"sources_retained",
			"route_patterns",
			"occurrences",
			"unanchored_literals_excluded"
		].map((key) => [key, Number.MAX_SAFE_INTEGER])),
		limitations: [...INVENTORY_LIMITATIONS]
	});
	if (!Number.isSafeInteger(byteBudget) || byteBudget < headerBytes) throw new RangeError(`Route inventory budget must fit its ${headerBytes}-byte envelope.`);
	let accounted = headerBytes, capacity = null, partial = false, unanchored = 0;
	const reserve = (value) => {
		if (capacity !== null) return false;
		const bytes = jsonValueByteLength(value, byteBudget - accounted) + 1;
		if (bytes > byteBudget - accounted) {
			capacity = {
				limit_bytes: byteBudget,
				accounted_bytes: accounted
			};
			partial = true;
			return false;
		}
		accounted += bytes;
		return true;
	};
	const retainGap = (body) => {
		const value = {
			id: routeGapId(body),
			...body
		};
		if (!seenGaps.has(value.id) && reserve(value)) {
			unknowns.push(value);
			seenGaps.add(value.id);
		}
	};
	const gap = (source, kind, reason, source_range = null) => retainGap({
		source_id: source.id,
		kind,
		source_range,
		reason
	});
	for (const { unit, count, reason } of captureOmissions) {
		yield;
		partial = true;
		retainGap({
			source_id: null,
			kind: "capture-omission",
			source_range: null,
			reason,
			capture_omission: {
				unit,
				count
			}
		});
	}
	const manifestIds = [];
	for (const input of inputs) {
		yield;
		const metadata = classifyNextAppRoutePath(input.url ?? input.path ?? "", input.url !== null ? { kind: "script-url" } : {
			kind: "source-path",
			source: input.next_app_context ?? {
				kind: "unknown",
				package: null,
				reason: "Next App Router source applicability was not measured."
			}
		});
		const nextContext = metadata === undefined ? undefined : input.next_app_context;
		const id = lookupId("jss", [
			input.key,
			input.path,
			input.url,
			input.sha256,
			input.container_sha256,
			...nextContext === undefined ? [] : [nextContext]
		]);
		manifestIds.push(id);
		const prefix = input.url === null ? undefined : nextScriptBasePath(input.url);
		const source = {
			id,
			key: input.key,
			path: input.path,
			url: input.url,
			sha256: input.sha256,
			container_sha256: input.container_sha256,
			status: input.status,
			...nextContext === undefined ? {} : { next_app_context: nextContext },
			reported_route_capacity: input.facts?.capacity ?? null,
			reason: input.reason,
			base_path: prefix ? {
				value: prefix,
				basis: "next-script-url",
				status: "inferred"
			} : null
		};
		if (!reserve(source)) continue;
		sources.push(source);
		const metadataPath = metadata?.kind === "known" ? metadata.path : undefined;
		contexts.push({
			input,
			source,
			metadataPath
		});
		if (metadata?.kind === "unknown") {
			partial = true;
			gap(source, "interpretation", metadata.reason);
		}
		if (input.status !== "complete" || input.facts === null) {
			partial = true;
			gap(source, "source-unavailable", input.reason ?? "Route syntax was not fully measured for this source.");
		}
		if (source.base_path !== null) gap(source, "inferred-base", "A Next script URL prefix is an inferred routing base; assetPrefix may differ from the deployed route base.");
		if (input.facts?.capacity !== null && input.facts?.capacity !== undefined) {
			partial = true;
			gap(source, "capacity", input.facts.capacity.kind === "result-bytes" ? `Route facts exceeded the ${input.facts.capacity.limit_bytes}-byte remaining serialized-result budget; additional candidates remain unknown.` : `Source route work/facts reached ${input.facts.capacity.limit_bytes} accounted bytes; additional candidates remain unknown.`);
		}
		for (const unknown of input.facts?.unresolved ?? []) {
			partial = true;
			gap(source, "interpretation", unknown.reason, unknown.location);
		}
	}
	const prefixPath = (path, source, applicationRelative) => {
		const base = source.base_path?.value;
		return base === undefined || !applicationRelative && (path === base || path.startsWith(`${base}/`)) ? path : path === "/" ? base : `${base}${path}`;
	};
	const applicationRoot = (path, source, applicationRelative) => {
		const base = source.base_path?.value;
		const start = !applicationRelative && base !== undefined && (path === base || path.startsWith(`${base}/`)) ? base.length + 1 : 1;
		const end = path.indexOf("/", start);
		return path.slice(start, end < 0 ? undefined : end);
	};
	const roots = new Set();
	for (const { input, source, metadataPath } of contexts) {
		yield;
		if (metadataPath !== undefined) {
			const root = applicationRoot(metadataPath, source, true);
			if (root) roots.add(root);
		}
		for (const candidate of input.facts?.candidates ?? []) if (candidate.mechanism !== "route-string-constant") {
			const root = applicationRoot(candidate.path, source, candidate.mechanism === "next-app-chunk");
			if (root) roots.add(root);
		}
	}
	const append = (source, candidate, origin) => {
		if (capacity !== null) return;
		const applicationRelative = candidate.mechanism === "next-app-chunk";
		const path = prefixPath(candidate.path, source, applicationRelative);
		if (candidate.mechanism === "route-string-constant" && !roots.has(applicationRoot(candidate.path, source, applicationRelative))) {
			unanchored++;
			return;
		}
		const route_id = routeId(path), inferredBase = path === candidate.path ? null : source.base_path.value;
		const identity = [
			source.id,
			path,
			candidate.mechanism,
			origin,
			candidate.location,
			candidate.segments
		];
		const id = lookupId("jso", identity);
		if (seenOccurrences.has(id)) return;
		const occurrence = {
			id,
			route_id,
			source_id: source.id,
			mechanism: candidate.mechanism,
			confidence: inferredBase === null ? candidate.confidence : "low",
			derivation: inferredBase === null ? candidate.derivation : "inferred",
			source_range: origin === "source-syntax" ? candidate.location : null,
			origin,
			unprefixed_path: candidate.path,
			inferred_base_path: inferredBase,
			segments: origin === "source-syntax" ? candidate.segments : []
		};
		let route = routes.get(path);
		if (route === undefined) {
			route = {
				id: route_id,
				path,
				...classify(path, [candidate.mechanism]),
				confidence: occurrence.confidence,
				mechanisms: [],
				occurrence_count: 0,
				source_count: 0,
				primary_occurrence_id: id
			};
			if (!reserve({
				...route,
				classification_basis: "router-configuration",
				confidence: "medium",
				mechanisms: javaScriptRouteMechanismSchema.options,
				occurrence_count: Number.MAX_SAFE_INTEGER,
				source_count: Number.MAX_SAFE_INTEGER
			})) return;
		}
		if (!reserve(occurrence)) return;
		if (!routes.has(path)) {
			routes.set(path, route);
			sourceIdsByRoute.set(route_id, new Set());
		}
		occurrences.push(occurrence);
		seenOccurrences.add(id);
		route.occurrence_count++;
		const routeSources = sourceIdsByRoute.get(route_id);
		routeSources.add(source.id);
		route.source_count = routeSources.size;
		if (!route.mechanisms.includes(candidate.mechanism)) {
			route.mechanisms.push(candidate.mechanism);
			Object.assign(route, classify(path, route.mechanisms));
		}
		if (ranks[occurrence.confidence] > ranks[route.confidence] || ranks[occurrence.confidence] === ranks[route.confidence] && id < route.primary_occurrence_id) {
			route.confidence = occurrence.confidence;
			route.primary_occurrence_id = id;
		}
	};
	for (const { input, source, metadataPath } of contexts) {
		yield;
		if (metadataPath !== undefined) append(source, {
			path: metadataPath,
			mechanism: "next-app-chunk",
			confidence: "medium",
			derivation: "joined",
			location: null,
			segments: []
		}, source.url === null ? "source-path" : "source-url");
		for (const candidate of input.facts?.candidates ?? []) {
			yield;
			append(source, candidate, "source-syntax");
			if (capacity !== null) break;
		}
	}
	sources.sort((a, b) => order(a.key, b.key) || order(a.id, b.id));
	occurrences.sort((a, b) => order(a.id, b.id));
	const items = [...routes.values()].sort((a, b) => order(a.path, b.path));
	for (const route of items) route.mechanisms.sort(order);
	unknowns.sort((a, b) => order(a.source_id ?? "", b.source_id ?? "") || order(a.kind, b.kind) || (a.source_range?.start.line ?? 0) - (b.source_range?.start.line ?? 0) || (a.source_range?.start.column ?? 0) - (b.source_range?.start.column ?? 0) || (a.source_range?.end.line ?? 0) - (b.source_range?.end.line ?? 0) || (a.source_range?.end.column ?? 0) - (b.source_range?.end.column ?? 0) || order(a.reason, b.reason));
	const source_manifest_sha256 = hash(manifestIds.sort(order));
	const result = {
		source_manifest_sha256,
		sources,
		routes: items,
		occurrences,
		unknowns,
		capacity,
		coverage: {
			scope: "provided-code-sources",
			source_parsing: sources.length === 0 ? "unknown" : sources.some((source) => source.status !== "complete") || capacity !== null ? "partial" : "complete",
			candidate_enumeration: partial ? "partial" : "complete",
			application_routes: "unknown"
		},
		statistics: {
			sources_seen: inputs.length,
			sources_retained: sources.length,
			route_patterns: items.length,
			occurrences: occurrences.length,
			unanchored_literals_excluded: unanchored
		},
		limitations: [...INVENTORY_LIMITATIONS]
	};
	return {
		inventory_id: `jsri:${hash(["javascript-routes-v1", result])}`,
		...result
	};
}
var sourceStatus, confidence, sourceShape, javaScriptRouteInventorySourceSchema, javaScriptRouteOccurrenceSchema, javaScriptInventoryRouteSchema, javaScriptRouteCaptureOmissionSchema, javaScriptRouteGapSchema, capacitySchema, inventoryShape, javaScriptRouteInventorySchema, hash, lookupId, routeGapId, routeId, order, ranks, classify, INVENTORY_LIMITATIONS;
function init_javascriptRouteInventory() {
	return (init_javascriptRouteInventory = __esmMin((() => {
		init_javascriptSourceCoordinates();
		init_canonicalDigest();
		init_jsonValueByteLength();
		init_digests();
		init_javascriptAnalysisResourceControls();
		init_javascriptRouteFacts();
		init_javascriptRoutePaths();
		sourceStatus = z.enum([
			"complete",
			"partial",
			"unavailable",
			"unknown"
		]);
		confidence = javaScriptRouteCandidateSchema.shape.confidence;
		sourceShape = {
			id: z.string().regex(/^jss:[a-f0-9]{32}$/u),
			key: z.string(),
			path: z.string().nullable(),
			url: z.string().nullable(),
			sha256: digestSchema.nullable(),
			container_sha256: digestSchema.nullable(),
			status: sourceStatus,
			reported_route_capacity: javaScriptRouteSourceFactsSchema.shape.capacity,
			reason: z.string().nullable(),
			next_app_context: nextAppSourceContextSchema.exactOptional(),
			base_path: z.strictObject({
				value: z.string(),
				basis: z.literal("next-script-url"),
				status: z.literal("inferred")
			}).nullable()
		};
		javaScriptRouteInventorySourceSchema = z.strictObject(sourceShape);
		javaScriptRouteOccurrenceSchema = z.strictObject({
			id: z.string().regex(/^jso:[a-f0-9]{32}$/u),
			route_id: z.string().regex(/^jsr:[a-f0-9]{32}$/u),
			source_id: sourceShape.id,
			mechanism: javaScriptRouteMechanismSchema,
			confidence,
			derivation: javaScriptRouteCandidateSchema.shape.derivation,
			source_range: javascriptSourceRangeSchema.nullable(),
			origin: z.enum([
				"source-syntax",
				"source-path",
				"source-url"
			]),
			unprefixed_path: z.string(),
			inferred_base_path: z.string().nullable(),
			segments: z.array(javaScriptRouteSegmentSchema)
		});
		javaScriptInventoryRouteSchema = z.strictObject({
			id: z.string().regex(/^jsr:[a-f0-9]{32}$/u),
			path: z.string().regex(/^\//u),
			classification: z.enum([
				"page",
				"system",
				"unknown"
			]),
			classification_basis: z.enum([
				"next-app-page",
				"router-configuration",
				"path-name-heuristic",
				"unknown"
			]),
			confidence,
			mechanisms: z.array(javaScriptRouteMechanismSchema),
			occurrence_count: z.int().nonnegative(),
			source_count: z.int().nonnegative(),
			primary_occurrence_id: javaScriptRouteOccurrenceSchema.shape.id
		});
		javaScriptRouteCaptureOmissionSchema = z.strictObject({
			unit: z.enum(["script-records", "script-sources"]),
			count: z.int().nonnegative().nullable()
		});
		javaScriptRouteGapSchema = z.strictObject({
			id: z.string().regex(/^jsg:[a-f0-9]{32}$/u),
			source_id: sourceShape.id.nullable(),
			kind: z.enum([
				"source-unavailable",
				"interpretation",
				"inferred-base",
				"capacity",
				"capture-omission"
			]),
			source_range: javascriptSourceRangeSchema.nullable(),
			reason: z.string(),
			capture_omission: javaScriptRouteCaptureOmissionSchema.exactOptional()
		});
		capacitySchema = z.strictObject({
			limit_bytes: z.int().nonnegative(),
			accounted_bytes: z.int().nonnegative()
		});
		inventoryShape = z.strictObject({
			inventory_id: z.string().regex(/^jsri:[a-f0-9]{64}$/u),
			source_manifest_sha256: digestSchema,
			sources: z.array(javaScriptRouteInventorySourceSchema),
			routes: z.array(javaScriptInventoryRouteSchema),
			occurrences: z.array(javaScriptRouteOccurrenceSchema),
			unknowns: z.array(javaScriptRouteGapSchema),
			coverage: z.strictObject({
				scope: z.literal("provided-code-sources"),
				source_parsing: z.enum([
					"complete",
					"partial",
					"unknown"
				]),
				candidate_enumeration: z.enum(["complete", "partial"]),
				application_routes: z.literal("unknown")
			}),
			statistics: z.strictObject({
				sources_seen: z.int().nonnegative(),
				sources_retained: z.int().nonnegative(),
				route_patterns: z.int().nonnegative(),
				occurrences: z.int().nonnegative(),
				unanchored_literals_excluded: z.int().nonnegative()
			}),
			capacity: capacitySchema.nullable(),
			limitations: z.array(z.string())
		});
		javaScriptRouteInventorySchema = inventoryShape.superRefine((value, context) => {
			const sources = new Set(), routes = new Map(), occurrences = new Map();
			for (const source of value.sources) {
				if (sources.has(source.id) || source.id !== lookupId("jss", [
					source.key,
					source.path,
					source.url,
					source.sha256,
					source.container_sha256,
					...source.next_app_context === undefined ? [] : [source.next_app_context]
				])) context.addIssue({
					code: "custom",
					path: ["sources"],
					message: "Route source identity must be unique and bind source/content/applicability fields"
				});
				sources.add(source.id);
			}
			for (const route of value.routes) {
				if (routes.has(route.id) || route.id !== routeId(route.path)) context.addIssue({
					code: "custom",
					path: ["routes"],
					message: "Route identity must uniquely bind its exact pattern"
				});
				routes.set(route.id, route);
			}
			const byRoute = new Map();
			for (const occurrence of value.occurrences) {
				if (occurrences.has(occurrence.id) || !sources.has(occurrence.source_id) || !routes.has(occurrence.route_id) || occurrence.id !== lookupId("jso", [
					occurrence.source_id,
					routes.get(occurrence.route_id)?.path ?? null,
					occurrence.mechanism,
					occurrence.origin,
					occurrence.source_range,
					occurrence.segments
				])) context.addIssue({
					code: "custom",
					path: ["occurrences"],
					message: "Route occurrences require unique identities and retained source/route owners"
				});
				occurrences.set(occurrence.id, occurrence);
				let rows = byRoute.get(occurrence.route_id);
				if (rows === undefined) {
					rows = [];
					byRoute.set(occurrence.route_id, rows);
				}
				rows.push(occurrence);
			}
			for (const route of value.routes) {
				const rows = byRoute.get(route.id) ?? [], primary = occurrences.get(route.primary_occurrence_id);
				if (rows.length !== route.occurrence_count || new Set(rows.map((row) => row.source_id)).size !== route.source_count || primary?.route_id !== route.id || rows.some((row) => !route.mechanisms.includes(row.mechanism)) || new Set(rows.map((row) => row.mechanism)).size !== new Set(route.mechanisms).size || new Set(route.mechanisms).size !== route.mechanisms.length || route.confidence !== primary?.confidence || rows.some((row) => ranks[row.confidence] > ranks[route.confidence]) || route.classification !== classify(route.path, route.mechanisms).classification || route.classification_basis !== classify(route.path, route.mechanisms).classification_basis) context.addIssue({
					code: "custom",
					path: ["routes"],
					message: "Route aggregates and primary provenance must match their occurrences"
				});
			}
			if (value.statistics.sources_retained !== value.sources.length || value.statistics.route_patterns !== value.routes.length || value.statistics.occurrences !== value.occurrences.length) context.addIssue({
				code: "custom",
				path: ["statistics"],
				message: "Route statistics must count retained facts"
			});
			const gaps = new Set();
			for (const gap of value.unknowns) {
				if (gaps.has(gap.id) || gap.id !== routeGapId(gap) || gap.source_id !== null && !sources.has(gap.source_id)) context.addIssue({
					code: "custom",
					path: ["unknowns"],
					message: "An attributed route gap requires a unique content-bound identity and retained source"
				});
				if (gap.kind === "capture-omission" !== (gap.capture_omission !== undefined) || gap.kind === "capture-omission" && (gap.source_id !== null || gap.source_range !== null)) context.addIssue({
					code: "custom",
					path: ["unknowns"],
					message: "Capture omissions keep capture-level counts and have no invented source or range."
				});
				gaps.add(gap.id);
			}
			const { inventory_id, ...body } = value;
			if (inventory_id !== `jsri:${hash(["javascript-routes-v1", body])}`) context.addIssue({
				code: "custom",
				path: ["inventory_id"],
				message: "Inventory identity must bind all retained facts and coverage."
			});
		});
		hash = (value) => digestCanonicalValue(value, "JavaScript route fact");
		lookupId = (prefix, value) => `${prefix}:${hash(value).slice(0, 32)}`;
		routeGapId = (gap) => lookupId("jsg", [
			gap.source_id,
			gap.kind,
			gap.source_range,
			gap.reason,
			...gap.capture_omission === undefined ? [] : [gap.capture_omission]
		]);
		routeId = (path) => lookupId("jsr", path);
		order = (a, b) => a < b ? -1 : a > b ? 1 : 0;
		ranks = {
			low: 0,
			medium: 1,
			high: 2
		};
		classify = (path, mechanisms) => {
			if (/(?:^|\/)(?:auth|login|logout|signin|signup|billing|callback|callbacks|oauth|sso)(?:\/|$)/iu.test(path)) return {
				classification: "system",
				classification_basis: "path-name-heuristic"
			};
			if (mechanisms.includes("next-app-chunk")) return {
				classification: "page",
				classification_basis: "next-app-page"
			};
			if (mechanisms.includes("nested-route-object") || mechanisms.includes("typed-route-tree")) return {
				classification: "page",
				classification_basis: "router-configuration"
			};
			return {
				classification: "unknown",
				classification_basis: "unknown"
			};
		};
		INVENTORY_LIMITATIONS = [
			"Routes are static candidates from the provided code sources. Reachability, permissions, server-only routes and the complete application route set are unverified.",
			"Pattern IDs are exact path identities within this inventory. Occurrence and source IDs retain source/content identity and precise syntax ranges; metadata-only discoveries have no AST range.",
			"System classification is a path-name heuristic. Asset URL prefixes can differ from routing bases; inferred prefixes retain the original unprefixed path.",
			"Unbound path strings require a top-level segment supported by structural routes or navigation candidates. Unknown or missing source facts do not establish route absence."
		];
	})))();
}

//#endregion
//#region dist/domain/webBundleAnalysis.js
var DEFAULT_WEB_BUNDLE_HEAP_MB, MIN_WEB_BUNDLE_HEAP_MB, MAX_WEB_BUNDLE_HEAP_MB, DEFAULT_WEB_BUNDLE_SCRIPT_TIMEOUT_MS, DEFAULT_WEB_BUNDLE_TOTAL_TIMEOUT_MS, DEFAULT_SOURCE_MAP_FETCH_TIMEOUT_MS, webBundleHeapDescription, webBundleScriptTimeoutDescription, webBundleTotalTimeoutDescription, analyzeWebBundleInputSchema, webBundleScriptTimeoutRecovery, webBundleTotalTimeoutRecovery, webBundleMemoryExhaustion, webBundleHeapRange, webBundleHeapIncrease, webBundleHeapDoesNotRaise, webBundleHeapExhaustedReason, webBundleHeapExhaustedRemediation, webBundleFixedByteBudget, webBundleResultAdmissionFailure, sourceLocationSchema, basisSchema, findingSchema, originalSourceSchema, originalModuleEdgeSchema, sourceMapMappingSchema, sourceMapContextShape, parsedSourceMapShape, responseIdentitySchema, sourceMapSchema, webTextArtifactSummarySchema, webSourceMapsSchema, webSourceMapFetchPartialObservationSchema, webBundleAcquisitionPartialObservationSchema, webBundleAnalysisSchema;
function init_webBundleAnalysis() {
	return (init_webBundleAnalysis = __esmMin((() => {
		init_browserCompleteness();
		init_browserObservationSchemas();
		init_javascriptRouteInventory();
		init_browserDeadline();
		init_emptyArraySchema();
		init_browserObservation();
		init_webContentArtifact();
		DEFAULT_WEB_BUNDLE_HEAP_MB = 1024;
		MIN_WEB_BUNDLE_HEAP_MB = 128;
		MAX_WEB_BUNDLE_HEAP_MB = 16384;
		DEFAULT_WEB_BUNDLE_SCRIPT_TIMEOUT_MS = 3e4;
		DEFAULT_WEB_BUNDLE_TOTAL_TIMEOUT_MS = 3e5;
		DEFAULT_SOURCE_MAP_FETCH_TIMEOUT_MS = 3e4;
		webBundleHeapDescription = `Heap phase: maximum V8 old-space for the isolated inert-script analyzer, in MiB (default ${String(DEFAULT_WEB_BUNDLE_HEAP_MB)}, range ${String(128)}..${String(MAX_WEB_BUNDLE_HEAP_MB)}). Omitted means ${String(DEFAULT_WEB_BUNDLE_HEAP_MB)} and applies on the next call. This is not a total process RSS limit, not analysis_timeout_ms, and not total_analysis_timeout_ms. Bun ignores V8 flags; Windows Bun uses an owned process commit limit plus a 512 MiB runtime reserve, while other Bun hosts have no enforced memory limit. Raising max_heap_mb does not raise the fixed worker protocol or result byte budgets.`;
		webBundleScriptTimeoutDescription = `Per-script deadline phase: maximum startup, analysis and result transfer time for one captured script, in milliseconds (default ${String(DEFAULT_WEB_BUNDLE_SCRIPT_TIMEOUT_MS)}, range 1..${String(MAX_BROWSER_DEADLINE_MS)}). Omitted means ${String(DEFAULT_WEB_BUNDLE_SCRIPT_TIMEOUT_MS)}. deadlineExpired for one script is not total_analysis_timeout_ms. A per-script value above the effective total is rejected. Timed-out scripts are explicit unknowns and other scripts may still be analyzed. Applies on the next call.`;
		webBundleTotalTimeoutDescription = `Total analysis deadline phase: maximum time for all captured-script analysis, in milliseconds (default ${String(DEFAULT_WEB_BUNDLE_TOTAL_TIMEOUT_MS)}, range 1..${String(MAX_BROWSER_DEADLINE_MS)}). Omitted means ${String(DEFAULT_WEB_BUNDLE_TOTAL_TIMEOUT_MS)}. This is not the per-script analysis_timeout_ms, not capture, and not source-map fetch. A per-script timeout above this total is rejected. Unstarted scripts remain explicit unknowns. Applies on the next call.`;
		analyzeWebBundleInputSchema = inspectWebPageWithSourceInputSchema.safeExtend({
			fetch_source_maps: z.boolean().default(false),
			max_heap_mb: z.number().int().min(128).max(MAX_WEB_BUNDLE_HEAP_MB).optional().describe(webBundleHeapDescription),
			analysis_timeout_ms: optionalBrowserDeadlineMs(webBundleScriptTimeoutDescription),
			total_analysis_timeout_ms: optionalBrowserDeadlineMs(webBundleTotalTimeoutDescription),
			source_map_fetch_timeout_ms: optionalBrowserDeadlineMs(`Source-map fetch deadline in milliseconds (default ${String(DEFAULT_SOURCE_MAP_FETCH_TIMEOUT_MS)}). Omitted means ${String(DEFAULT_SOURCE_MAP_FETCH_TIMEOUT_MS)} and applies on the next fetch. A fetch overrun is an item limitation (fetch_failed), not a thrown analysis timeout. Does not raise the fixed 64 MiB response budget or the source-map decode deadline. The response budget has no runtime override.`)
		}).superRefine((input, context) => {
			const perScript = input.analysis_timeout_ms ?? 3e4;
			const total = input.total_analysis_timeout_ms ?? 3e5;
			if (perScript <= total) return;
			context.addIssue({
				code: "custom",
				path: input.analysis_timeout_ms === undefined ? ["total_analysis_timeout_ms"] : ["analysis_timeout_ms"],
				message: `analysis_timeout_ms ${String(perScript)} ms is the per-script deadline and must be less than or equal to total_analysis_timeout_ms ${String(total)} ms. A per-script timeout above the total is rejected. Omitted analysis_timeout_ms means ${String(DEFAULT_WEB_BUNDLE_SCRIPT_TIMEOUT_MS)}; omitted total_analysis_timeout_ms means ${String(DEFAULT_WEB_BUNDLE_TOTAL_TIMEOUT_MS)}.`
			});
		});
		webBundleScriptTimeoutRecovery = (timeoutMs) => ({
			userMessage: `analyze_web_bundle reached its ${String(timeoutMs)} ms per-script deadline (deadlineExpired) for analysis_timeout_ms. This is not total_analysis_timeout_ms and not the MCP client deadline.`,
			remediationAction: `${browserDeadlineIncrease("analysis_timeout_ms", timeoutMs, DEFAULT_WEB_BUNDLE_SCRIPT_TIMEOUT_MS, "--analysis-timeout-ms")} Keep it less than or equal to total_analysis_timeout_ms (omitted means ${String(DEFAULT_WEB_BUNDLE_TOTAL_TIMEOUT_MS)}); a per-script timeout above the total is rejected. ${browserDeadlineRetry} analysis_timeout_ms does not raise max_heap_mb, total_analysis_timeout_ms, or the fixed worker protocol and result byte budgets.`
		});
		webBundleTotalTimeoutRecovery = (timeoutMs) => ({
			userMessage: `analyze_web_bundle reached its ${String(timeoutMs)} ms total captured-script analysis deadline (deadlineExpired) for total_analysis_timeout_ms. This is not the per-script analysis_timeout_ms, not capture, and not source-map fetch.`,
			remediationAction: `${browserDeadlineIncrease("total_analysis_timeout_ms", timeoutMs, DEFAULT_WEB_BUNDLE_TOTAL_TIMEOUT_MS, "--total-analysis-timeout-ms")} A per-script analysis_timeout_ms above the total is rejected. ${browserDeadlineRetry} total_analysis_timeout_ms does not raise analysis_timeout_ms, max_heap_mb, source_map_fetch_timeout_ms, or the fixed worker byte budgets.`
		});
		webBundleMemoryExhaustion = (input) => {
			if (input.runtime === "node") return {
				kind: "v8-heap",
				heapMb: input.heapMb
			};
			if (input.memoryLimitReached && input.processMemoryLimitBytes !== null) return {
				kind: "process-commit",
				heapMb: input.heapMb,
				limitBytes: input.processMemoryLimitBytes
			};
			return {
				kind: "bun-allocation",
				heapMb: input.heapMb,
				processMemoryLimitBytes: input.processMemoryLimitBytes
			};
		};
		webBundleHeapRange = () => `range ${String(128)}..${String(MAX_WEB_BUNDLE_HEAP_MB)}; omitted means ${String(DEFAULT_WEB_BUNDLE_HEAP_MB)}`;
		webBundleHeapIncrease = (heapMb) => heapMb < 16384 ? `Increase max_heap_mb above ${String(heapMb)} (integer MiB from ${String(128)} to ${String(MAX_WEB_BUNDLE_HEAP_MB)}; omitted means ${String(DEFAULT_WEB_BUNDLE_HEAP_MB)}), or use --max-heap-mb on the CLI.` : `max_heap_mb is already at the maximum ${String(MAX_WEB_BUNDLE_HEAP_MB)} MiB; do not increase it further.`;
		webBundleHeapDoesNotRaise = "Applies on the next call. Raising max_heap_mb does not raise analysis_timeout_ms, total_analysis_timeout_ms, or the fixed worker protocol and result byte budgets. Those byte budgets have no runtime override.";
		webBundleHeapExhaustedReason = (exhaustion) => {
			const range = webBundleHeapRange();
			switch (exhaustion.kind) {
				case "v8-heap": return `Owned web analyzer exhausted its max_heap_mb V8 old-space heap of ${String(exhaustion.heapMb)} MiB (${range}). This is the isolated analyzer heap, not a process RSS limit.`;
				case "process-commit": return `Owned web analyzer reached its ${String(exhaustion.limitBytes)}-byte process commit limit. That limit is max_heap_mb ${String(exhaustion.heapMb)} MiB plus a 512 MiB Bun runtime reserve (${range}). Bun ignores the V8 old-space flag, so this is not V8 old-space exhaustion.`;
				case "bun-allocation": return exhaustion.processMemoryLimitBytes === null ? `Owned web analyzer ran out of memory. Bun ignores the V8 old-space flag, so this exit is not the configured max_heap_mb of ${String(exhaustion.heapMb)} MiB (${range}). This host enforces no analyzer process commit limit.` : `Owned web analyzer ran out of memory before its ${String(exhaustion.processMemoryLimitBytes)}-byte process commit limit was reported as reached. That configured limit is max_heap_mb ${String(exhaustion.heapMb)} MiB plus a 512 MiB Bun runtime reserve (${range}). Bun ignores the V8 old-space flag, so this exit is not V8 old-space exhaustion.`;
			}
		};
		webBundleHeapExhaustedRemediation = (exhaustion) => {
			switch (exhaustion.kind) {
				case "v8-heap": return `${webBundleHeapIncrease(exhaustion.heapMb)} ${webBundleHeapDoesNotRaise}`;
				case "process-commit": return `${webBundleHeapIncrease(exhaustion.heapMb)} That raises the Windows process commit limit (max_heap_mb plus the fixed 512 MiB Bun runtime reserve), not a V8 old-space heap. ${webBundleHeapDoesNotRaise}`;
				case "bun-allocation": return exhaustion.processMemoryLimitBytes === null ? `Bun ignores V8 heap flags, so raising max_heap_mb does not change this exit. A reached Windows process commit limit is reported separately. Other Bun hosts enforce no analyzer heap limit. Reduce the analysis instead of increasing max_heap_mb. ${webBundleHeapDoesNotRaise}` : `The configured ${String(exhaustion.processMemoryLimitBytes)}-byte process commit limit was not reported as reached, so raising max_heap_mb does not change this exit. A reached Windows process commit limit is reported separately. Reduce the analysis instead of increasing max_heap_mb. ${webBundleHeapDoesNotRaise}`;
			}
		};
		webBundleFixedByteBudget = (budgetBytes, label) => noRuntimeOverrideSentence(`The ${String(budgetBytes)}-byte web-bundle ${label} has no further room.`, "max_heap_mb");
		webBundleResultAdmissionFailure = (input) => {
			if (input.fixedRemainingBytes <= 0) return {
				kind: "fixed-budget",
				reason: webBundleFixedByteBudget(input.fixedBudgetBytes, "result budget"),
				reportedLimits: { result_bytes: input.fixedBudgetBytes }
			};
			return {
				kind: "host-capacity",
				reason: `The CLI/MCP host heap has no remaining reserved capacity for another web-bundle result (host result capacity ${String(input.hostCapacityBytes)} bytes). The fixed ${String(input.fixedBudgetBytes)}-byte result budget still has ${String(input.fixedRemainingBytes)} bytes available. This is host memory pressure, not exhaustion of that fixed allowance.`,
				remediationAction: "Retry when the CLI/MCP process has more heap headroom. On Node, set NODE_OPTIONS (for example --max-old-space-size=<MiB>) in the environment that starts the CLI or MCP server, then restart that process, to raise this host heap. Raising max_heap_mb changes the isolated analyzer, not this host admission. The fixed result budget is separate and was not exhausted.",
				reportedLimits: {
					result_bytes: input.fixedBudgetBytes,
					result_budget_remaining_bytes: input.fixedRemainingBytes,
					host_result_capacity_bytes: input.hostCapacityBytes
				}
			};
		};
		sourceLocationSchema = z.object({
			script_key: z.string(),
			line: z.int().min(1).nullable(),
			column: z.int().min(0).nullable()
		});
		basisSchema = z.object({
			script_key: z.string(),
			artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			line: z.int().min(1).nullable(),
			column: z.int().min(0).nullable(),
			detector: z.string()
		});
		findingSchema = z.object({
			value: z.string(),
			mechanism: z.string(),
			location: sourceLocationSchema
		});
		originalSourceSchema = z.object({
			source_index: z.int().min(0).optional(),
			declaration_index: z.int().min(0).optional(),
			source: z.string().nullable(),
			artifact: webTextArtifactSchema.nullable()
		});
		originalModuleEdgeSchema = z.object({
			declaration_index: z.int().min(0).optional(),
			from_source: z.string(),
			kind: z.enum([
				"static_import",
				"dynamic_import",
				"require"
			]),
			specifier: z.string(),
			resolved_source: z.string().nullable()
		});
		sourceMapMappingSchema = z.object({
			source_index: z.int().min(0).optional(),
			declaration_index: z.int().min(0).optional(),
			generated_line: z.int().min(1),
			generated_column: z.int().min(0),
			source: z.string().nullable(),
			original_line: z.int().min(1),
			original_column: z.int().min(0),
			name: z.string().nullable()
		});
		sourceMapContextShape = {
			script_key: z.string(),
			declared_url: z.string(),
			effective_url: z.string().nullable().optional()
		};
		parsedSourceMapShape = {
			artifact: webTextArtifactSchema,
			original_sources: z.array(originalSourceSchema),
			original_module_edges: z.array(originalModuleEdgeSchema),
			mappings: z.array(sourceMapMappingSchema)
		};
		responseIdentitySchema = z.object({
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			bytes: z.int().min(0),
			representation: z.literal("fetch-response-body-bytes")
		});
		sourceMapSchema = z.union([
			z.object({
				...sourceMapContextShape,
				...parsedSourceMapShape,
				status: z.literal("included"),
				limitation: z.null()
			}),
			z.object({
				...sourceMapContextShape,
				...parsedSourceMapShape,
				status: z.literal("partial"),
				limitation: z.string()
			}),
			z.object({
				...sourceMapContextShape,
				...parsedSourceMapShape,
				status: z.enum(["fetch_failed", "invalid"]),
				artifact: z.null(),
				/** Older observations omit this; completed bytes need it only when text is absent. */
				response_identity: responseIdentitySchema.exactOptional(),
				original_sources: emptyArraySchema,
				original_module_edges: emptyArraySchema,
				mappings: emptyArraySchema,
				limitation: z.string()
			}),
			z.object({
				...sourceMapContextShape,
				status: z.literal("policy_filtered"),
				artifact: z.null(),
				original_sources: emptyArraySchema,
				original_module_edges: emptyArraySchema,
				mappings: emptyArraySchema,
				limitation: z.string()
			})
		]);
		webTextArtifactSummarySchema = webTextArtifactMetadataSchema.extend({ text_available: z.literal(true) });
		webSourceMapsSchema = z.object({
			status: z.enum([
				"not_requested",
				"included",
				"partial",
				"unavailable"
			]),
			requested: z.int().min(0),
			processed: z.int().min(0),
			items: z.array(sourceMapSchema),
			/** Capture exclusions retain counts/reasons without disallowed URL details. */
			excluded: z.array(browserExclusionSchema.extend({ section: z.literal("source_maps") })).optional(),
			limitation: z.string().min(1).optional()
		}).superRefine((sourceMaps, context) => {
			if (sourceMaps.processed > sourceMaps.requested || sourceMaps.processed !== sourceMaps.items.length) context.addIssue({
				code: "custom",
				message: "Source-map coverage counts are inconsistent"
			});
			if (sourceMaps.processed < sourceMaps.requested && sourceMaps.limitation === undefined) context.addIssue({
				code: "custom",
				message: "Unprocessed source maps require an explicit coverage limitation",
				path: ["limitation"]
			});
			const statuses = sourceMaps.items.map(({ status }) => status);
			const retained = statuses.filter((status) => status === "included" || status === "partial").length;
			const allowedStatuses = sourceMaps.processed < sourceMaps.requested || sourceMaps.excluded?.some(({ count }) => count === null || count > 0) === true ? retained === 0 ? ["unavailable"] : ["partial"] : sourceMaps.items.length === 0 ? ["not_requested", "unavailable"] : retained === 0 ? ["unavailable"] : retained === sourceMaps.items.length && !statuses.includes("partial") ? ["included"] : ["partial"];
			if (!allowedStatuses.includes(sourceMaps.status)) context.addIssue({
				code: "custom",
				message: "Source-map status contradicts retained coverage",
				path: ["status"]
			});
		});
		webSourceMapFetchPartialObservationSchema = z.object({
			kind: z.literal("web-source-map-fetch"),
			source_maps: webSourceMapsSchema
		});
		webBundleAcquisitionPartialObservationSchema = z.object({
			kind: z.literal("web-bundle-acquisition"),
			inspection: webPageInspectionSchema,
			source_maps: webSourceMapsSchema,
			analysis_status: z.literal("not_performed")
		});
		webBundleAnalysisSchema = z.object({
			route_inventory: javaScriptRouteInventorySchema.exactOptional(),
			capture: z.object({
				target_url: z.string(),
				target_origin: recordedBrowserOriginSchema.nullable().optional(),
				scripts_observed: z.int().min(0),
				scripts_analyzed: z.int().min(0),
				source_artifacts: z.array(webTextArtifactSummarySchema)
			}),
			observations: z.object({
				chunks: z.object({
					nodes: z.array(z.object({
						script_key: z.string(),
						url: z.string(),
						artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
						bytes: z.int().min(0)
					})),
					edges: z.array(z.object({
						from_script_key: z.string(),
						kind: z.enum([
							"static_import",
							"dynamic_import",
							"require",
							"worker_import"
						]),
						specifier: z.string(),
						resolved_url: z.string().nullable(),
						location: sourceLocationSchema
					}))
				}),
				routes: z.array(findingSchema),
				endpoints: z.array(findingSchema),
				webmcp_declarations: z.array(z.object({
					name: z.string().nullable(),
					description: z.string().nullable(),
					schema_property_names: z.array(z.string()).describe("Statically known own property names from the declared schema projection; a partial list may omit unresolved members."),
					schema_property_names_coverage: z.enum([
						"complete",
						"partial",
						"unknown",
						"not_present"
					]).optional().describe("Coverage of the schema property-name projection. Missing means unknown for historical observations. Not a schema-validity result."),
					trust: z.literal("page-declared-untrusted"),
					location: sourceLocationSchema
				})),
				source_maps: webSourceMapsSchema
			}),
			inferences: z.array(z.object({
				kind: z.enum([
					"vendor_fingerprint",
					"route_framework",
					"bundle_runtime",
					"endpoint_candidate"
				]),
				value: z.string(),
				confidence: z.enum([
					"low",
					"medium",
					"high"
				]),
				basis: z.array(basisSchema).min(1)
			})),
			unknowns: z.array(z.object({
				dimension: z.string(),
				reason: z.string(),
				affected_script_keys: z.array(z.string())
			})),
			completeness: z.object({
				status: z.enum(["complete", "partial"]),
				parsed_scripts: z.int().min(0),
				parse_failures: z.int().min(0),
				visited_ast_nodes: z.int().min(0)
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
export { init_javascriptSourceCoordinates as A, javaScriptRouteInventorySchema as C, javaScriptRouteMechanismSchema as D, init_javascriptRouteFacts as E, javascriptSourceRangeKey as M, javascriptSourceRangeSchema as N, javaScriptRouteSourceFactsSchema as O, javaScriptRouteGapSchema as S, javaScriptRouteOccurrenceSchema as T, webSourceMapsSchema as _, MAX_WEB_BUNDLE_HEAP_MB as a, javaScriptInventoryRouteSchema as b, webBundleAcquisitionPartialObservationSchema as c, webBundleHeapExhaustedReason as d, webBundleHeapExhaustedRemediation as f, webBundleTotalTimeoutRecovery as g, webBundleScriptTimeoutRecovery as h, DEFAULT_WEB_BUNDLE_TOTAL_TIMEOUT_MS as i, javascriptSourceRangeContains as j, compareJavaScriptSourcePoints as k, webBundleAnalysisSchema as l, webBundleResultAdmissionFailure as m, DEFAULT_WEB_BUNDLE_HEAP_MB as n, analyzeWebBundleInputSchema as o, webBundleMemoryExhaustion as p, DEFAULT_WEB_BUNDLE_SCRIPT_TIMEOUT_MS as r, init_webBundleAnalysis as s, DEFAULT_SOURCE_MAP_FETCH_TIMEOUT_MS as t, webBundleFixedByteBudget as u, buildJavaScriptRouteInventorySteps as v, javaScriptRouteInventorySourceSchema as w, javaScriptRouteCaptureOmissionSchema as x, init_javascriptRouteInventory as y };