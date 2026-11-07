import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { i as prefixedDigestSchema, n as init_digests, t as digestSchema } from "./digests-Ct-nksBF.js";
import { n as digestCanonicalValue, r as init_canonicalDigest } from "./canonicalDigest-D42kAGaz.js";
import { r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { n as canonicalJson, r as init_comparisonSemantics } from "./comparisonSemantics-BNAC03mB.js";
import { posix } from "node:path";
import { z } from "zod";

//#region dist/domain/referenceSourcePathIdentity.js
var createReferenceSourcePathLookup, isPortableAbsoluteReferenceTarget, decodeReferenceSourceModuleUrlPath;
function init_referenceSourcePathIdentity() {
	return (init_referenceSourcePathIdentity = __esmMin((() => {
		init_result();
		createReferenceSourcePathLookup = (paths) => {
			const exact = new Set(paths);
			const canonical = new Map();
			for (const path of exact) {
				const key = path.normalize("NFC");
				canonical.set(key, canonical.has(key) ? null : path);
			}
			const equivalent = (path) => canonical.get(path.normalize("NFC")) ?? undefined;
			const has = (path) => exact.has(path) || canonical.has(path.normalize("NFC"));
			const resolve = (path) => exact.has(path) ? path : equivalent(path);
			return {
				has,
				resolve,
				resolveCandidates: (candidates) => candidates.find((path) => exact.has(path)) ?? candidates.map(equivalent).find((path) => path !== undefined),
				resolveAncestor: (path) => {
					for (let candidate = path; candidate !== "." && candidate !== "/"; candidate = posix.dirname(candidate)) {
						const found = resolve(candidate);
						if (found !== undefined) return found;
					}
					return undefined;
				}
			};
		};
		isPortableAbsoluteReferenceTarget = (target) => target.startsWith("/") || /^[A-Za-z]:[\\/]/u.test(target) || /^\\\\[^\\/]+[\\/][^\\/]+/u.test(target);
		decodeReferenceSourceModuleUrlPath = (value) => {
			if (/%2f/iu.test(value)) return err("Historical module URL paths cannot contain percent-encoded slash bytes.");
			try {
				const decoded = decodeURIComponent(value);
				return decoded.includes("\0") ? err("The decoded historical module URL path contains NUL.") : ok(decoded);
			} catch (cause) {
				if (!(cause instanceof URIError)) throw cause;
				return err("The historical module URL path contains malformed percent encoding.");
			}
		};
	})))();
}

//#endregion
//#region dist/domain/referenceSourceGraph.js
function checkGraphInvariants(graph, context) {
	checkSortedUnique(graph.entries.map(({ path }) => path), "entries", context);
	for (const [index, entry] of graph.entries.entries()) checkSortedUnique(entry.classifications, `entries.${index}.classifications`, context);
	checkSortedUnique(graph.languages, "languages", context);
	checkSortedUnique(graph.manifests, "manifests", context);
	checkSortedUnique(graph.relationships.map(historicalSourceRelationshipKey), "relationships", context);
	checkSortedUnique(graph.parse_failures.map(historicalSourceParseFailureKey), "parse_failures", context);
	checkSortedUnique(graph.exclusions.map((exclusion) => `${exclusion.path}\u0000${exclusion.reason}\u0000${"pattern" in exclusion ? exclusion.pattern : ""}`), "exclusions", context);
	if (canonicalJson(graph.languages, "Reference source graph") !== canonicalJson(historicalSourceLanguages(graph.entries), "Reference source graph")) context.addIssue({
		code: "custom",
		message: "languages must be derived from file entries",
		path: ["languages"]
	});
	if (canonicalJson(graph.manifests, "Reference source graph") !== canonicalJson(historicalSourceManifests(graph.entries), "Reference source graph")) context.addIssue({
		code: "custom",
		message: "manifests must be derived from classified file entries",
		path: ["manifests"]
	});
	const paths = new Set(graph.entries.map(({ path }) => path));
	checkRelationships(graph, paths, context);
	checkSymlinks(graph, paths, context);
	checkCompleteInventory(graph, context);
}
var boundedTextSchema, relativePathSchema, classificationSchema, entryBaseShape, sourceFileBaseShape, sourceFileSchema, sourceDirectorySchema, symlinkTargetSchema, sourceSymlinkSchema, sourceEntrySchema, sourceRelationshipSchema, parseFailureSchema, exclusionSchema, vcsSchema, graphShape, historicalSourceGraphStructureSchema, historicalSourceGraphSchema, historicalSourceGraphInputSchema, historicalSourceManifestBaseSchema, historicalSourceInventoryHasPartialFacts, historicalSourceParseFailureKey, historicalSourceRelationshipKey, checkSortedUnique, historicalSourceLanguages, historicalSourceManifests, checkRelationships, checkSymlinks, checkCompleteInventory, rootCommitment, computeRootSha256, createHistoricalSourceGraph, parseHistoricalSourceGraph, computeHistoricalSourceGraphSha256, createHistoricalSourceManifest;
function init_referenceSourceGraph() {
	return (init_referenceSourceGraph = __esmMin((() => {
		init_comparisonSemantics();
		init_canonicalDigest();
		init_referenceSourcePathIdentity();
		init_unicodeCodePointOrder();
		init_digests();
		boundedTextSchema = z.string().min(1);
		relativePathSchema = z.string().min(1).refine((path) => !path.startsWith("/") && !path.includes("\0") && path.split("/").every((part) => part !== "" && part !== "." && part !== ".."), "Expected a normalized relative POSIX path without traversal");
		classificationSchema = z.enum([
			"source",
			"test",
			"config",
			"manifest",
			"generated",
			"vendor",
			"documentation",
			"unknown"
		]);
		entryBaseShape = {
			path: relativePathSchema,
			classifications: z.array(classificationSchema).min(1),
			limitations: z.array(boundedTextSchema),
			local_diagnostics: z.array(boundedTextSchema).exactOptional()
		};
		sourceFileBaseShape = {
			...entryBaseShape,
			kind: z.literal("file"),
			language: z.string().min(1).nullable()
		};
		sourceFileSchema = z.union([z.strictObject({
			...sourceFileBaseShape,
			sha256: digestSchema,
			size: z.int().min(0).max(Number.MAX_SAFE_INTEGER),
			content_state: z.literal("hashed")
		}), z.strictObject({
			...sourceFileBaseShape,
			sha256: z.null(),
			size: z.int().min(0).max(Number.MAX_SAFE_INTEGER).nullable(),
			content_state: z.enum([
				"redacted-secret",
				"excluded",
				"unreadable",
				"unknown"
			])
		})]);
		sourceDirectorySchema = z.strictObject({
			...entryBaseShape,
			kind: z.literal("directory"),
			tree_state: z.enum([
				"enumerated",
				"partial",
				"excluded",
				"unreadable",
				"unknown"
			])
		});
		symlinkTargetSchema = z.string().min(1).refine((target) => !target.includes("\0") && (isPortableAbsoluteReferenceTarget(target) || !target.startsWith("/") && posix.normalize(target) === target), "Expected a normalized POSIX symlink target");
		sourceSymlinkSchema = z.union([z.strictObject({
			...entryBaseShape,
			kind: z.literal("symlink"),
			target: symlinkTargetSchema,
			target_state: z.enum([
				"internal",
				"external",
				"missing"
			])
		}), z.strictObject({
			...entryBaseShape,
			kind: z.literal("symlink"),
			target: z.null(),
			target_state: z.enum(["unreadable", "unknown"])
		})]);
		sourceEntrySchema = z.union([
			sourceFileSchema,
			sourceDirectorySchema,
			sourceSymlinkSchema,
			z.strictObject({
				...entryBaseShape,
				kind: z.literal("unknown")
			})
		]);
		sourceRelationshipSchema = z.strictObject({
			from_path: relativePathSchema,
			to: z.string().min(1),
			source_specifier: z.string().min(1).exactOptional(),
			kind: z.enum([
				"imports",
				"requires",
				"references",
				"declares-module"
			]),
			resolution: z.enum([
				"internal",
				"external",
				"unresolved",
				"unknown"
			]),
			parse_state: z.enum([
				"parsed",
				"partial",
				"unknown"
			])
		});
		parseFailureSchema = z.strictObject({
			path: relativePathSchema,
			parser: z.string().min(1),
			reason: boundedTextSchema
		});
		exclusionSchema = z.discriminatedUnion("reason", [z.strictObject({
			path: relativePathSchema,
			entry_kind: z.enum([
				"file",
				"directory",
				"symlink",
				"other",
				"unknown"
			]).exactOptional(),
			reason: z.enum([
				"configured-secret",
				"project-ignored",
				"default-ignored",
				"caller-excluded"
			]),
			pattern: boundedTextSchema
		}), z.strictObject({
			path: relativePathSchema,
			entry_kind: z.enum([
				"file",
				"directory",
				"symlink",
				"other",
				"unknown"
			]).exactOptional(),
			reason: z.enum(["symlink-escape", "unreadable"])
		})]);
		vcsSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("git"),
				head: z.string().regex(/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u),
				dirty: z.boolean().nullable()
			}),
			z.strictObject({
				kind: z.literal("none"),
				head: z.null(),
				dirty: z.null()
			}),
			z.strictObject({
				kind: z.literal("unknown"),
				head: z.null(),
				dirty: z.null()
			})
		]).nullable();
		graphShape = {
			schema: z.literal("HistoricalSourceGraph"),
			authority: z.literal("historical-reference"),
			root_alias: z.literal("$REFERENCE_ROOT"),
			root_sha256: digestSchema,
			inventory_state: z.enum([
				"complete",
				"partial",
				"unknown"
			]),
			entries: z.array(sourceEntrySchema),
			relationships: z.array(sourceRelationshipSchema),
			parse_failures: z.array(parseFailureSchema),
			exclusions: z.array(exclusionSchema),
			languages: z.array(z.string().min(1)),
			manifests: z.array(relativePathSchema),
			vcs: vcsSchema,
			provenance: z.strictObject({
				importer: z.string().min(1),
				importer_version: z.string().min(1).nullable(),
				caller: z.string().min(1).regex(/^[\w .:@\x2f+\x2d]+$/u)
			}),
			limitations: z.array(boundedTextSchema)
		};
		historicalSourceGraphStructureSchema = z.strictObject(graphShape).superRefine(checkGraphInvariants);
		historicalSourceGraphSchema = historicalSourceGraphStructureSchema.superRefine((graph, context) => {
			if (computeRootSha256(graph.entries, graph.exclusions) !== graph.root_sha256) context.addIssue({
				code: "custom",
				message: "Historical source root commitment does not match entries",
				path: ["root_sha256"]
			});
		});
		historicalSourceGraphInputSchema = z.strictObject({
			...graphShape,
			root_sha256: z.never().optional()
		});
		historicalSourceManifestBaseSchema = z.strictObject({
			schema: z.literal("HistoricalSourceManifest"),
			authority: z.literal("historical-reference"),
			manifest_id: prefixedDigestSchema("hsm"),
			graph_sha256: digestSchema,
			root_sha256: digestSchema,
			inventory_state: z.enum([
				"complete",
				"partial",
				"unknown"
			]),
			entry_count: z.int().min(0).max(Number.MAX_SAFE_INTEGER),
			relationship_count: z.int().min(0).max(Number.MAX_SAFE_INTEGER)
		});
		historicalSourceInventoryHasPartialFacts = (input) => input.limitations.length > 0 || input.exclusions.length > 0 || input.parse_failures.length > 0 || input.entries.some((entry) => entry.limitations.length > 0 || entry.kind === "file" && entry.content_state !== "hashed" || entry.kind === "directory" && entry.tree_state !== "enumerated" || entry.kind === "symlink" && entry.target_state !== "internal" || entry.kind === "unknown") || input.relationships.some(({ parse_state, resolution }) => parse_state !== "parsed" || resolution === "unresolved" || resolution === "unknown");
		historicalSourceParseFailureKey = (failure) => `${failure.path}\u0000${failure.parser}\u0000${failure.reason}`;
		historicalSourceRelationshipKey = (relationship) => `${relationship.from_path}\u0000${relationship.to}\u0000${relationship.kind}\u0000${relationship.resolution}\u0000${relationship.parse_state}${relationship.source_specifier === undefined ? "" : `\u0000${relationship.source_specifier}`}`;
		checkSortedUnique = (values, field, context) => {
			for (let index = 1; index < values.length; index += 1) if (compareUnicodeCodePoints(values[index - 1] ?? "", values[index] ?? "") >= 0) {
				context.addIssue({
					code: "custom",
					message: `${field} must be sorted and unique by Unicode code point`,
					path: [field, index]
				});
				return;
			}
		};
		historicalSourceLanguages = (entries) => [...new Set(entries.flatMap((entry) => entry.kind === "file" && entry.language !== null ? [entry.language] : []))].sort(compareUnicodeCodePoints);
		historicalSourceManifests = (entries) => entries.flatMap((entry) => entry.kind === "file" && entry.classifications.includes("manifest") ? [entry.path] : []).sort(compareUnicodeCodePoints);
		checkRelationships = (graph, paths, context) => {
			const files = new Set(graph.entries.flatMap((entry) => entry.kind === "file" ? [entry.path] : []));
			for (const [index, relationship] of graph.relationships.entries()) {
				if (!files.has(relationship.from_path)) context.addIssue({
					code: "custom",
					message: "Relationship source must name an inventoried file",
					path: [
						"relationships",
						index,
						"from_path"
					]
				});
				if (relationship.resolution !== "internal") continue;
				const parsed = relativePathSchema.safeParse(relationship.to);
				if (!parsed.success || !paths.has(parsed.data)) context.addIssue({
					code: "custom",
					message: "Internal relationship target must be normalized and inventoried",
					path: [
						"relationships",
						index,
						"to"
					]
				});
			}
		};
		checkSymlinks = (graph, paths, context) => {
			const lookupPath = createReferenceSourcePathLookup(paths);
			const excludedPaths = createReferenceSourcePathLookup(graph.exclusions.map(({ path }) => path));
			const excludedKinds = new Map();
			for (const { path, entry_kind } of graph.exclusions) {
				const kinds = excludedKinds.get(path) ?? new Set();
				kinds.add(entry_kind);
				excludedKinds.set(path, kinds);
			}
			for (const [index, entry] of graph.entries.entries()) {
				if (entry.kind !== "symlink") continue;
				if (entry.target === null) continue;
				const resolved = posix.normalize(posix.join(posix.dirname(entry.path), entry.target));
				const escapesRoot = resolved.startsWith("../") || resolved === "..";
				const inventoried = resolved === "." || lookupPath.resolve(resolved) !== undefined;
				const exactExcluded = excludedPaths.resolve(resolved);
				let excluded = exactExcluded !== undefined;
				for (let candidate = posix.dirname(resolved); candidate !== "." && candidate !== "/"; candidate = posix.dirname(candidate)) {
					const excludedAncestor = excludedPaths.resolve(candidate);
					if (excludedAncestor === undefined) continue;
					const kinds = excludedKinds.get(excludedAncestor);
					if (kinds?.size !== 1 || !kinds.has("directory")) {
						excluded = false;
						break;
					}
					excluded = true;
				}
				const ownedRelativeTarget = !entry.target.startsWith("/") && !escapesRoot && inventoried;
				const absolute = isPortableAbsoluteReferenceTarget(entry.target) && !(entry.target_state === "internal" && ownedRelativeTarget);
				if (entry.target_state === "external" && !absolute || entry.target_state === "internal" && absolute) context.addIssue({
					code: "custom",
					message: "Symlink target path does not match its target state",
					path: [
						"entries",
						index,
						"target"
					]
				});
				if (entry.target_state !== "internal") continue;
				if (escapesRoot || !inventoried && !excluded) context.addIssue({
					code: "custom",
					message: "Internal symlink target must resolve to an inventoried entry or a recorded exclusion",
					path: [
						"entries",
						index,
						"target"
					]
				});
			}
		};
		checkCompleteInventory = (graph, context) => {
			if (graph.inventory_state !== "complete" || !historicalSourceInventoryHasPartialFacts(graph)) return;
			context.addIssue({
				code: "custom",
				message: "Complete inventory cannot contain partial states, exclusions, failures, or limitations",
				path: ["inventory_state"]
			});
		};
		rootCommitment = (entries, exclusions) => ({
			entries: entries.map((entry) => {
				switch (entry.kind) {
					case "file": return {
						kind: entry.kind,
						path: entry.path,
						sha256: entry.sha256,
						size: entry.size,
						content_state: entry.content_state
					};
					case "directory": return {
						kind: entry.kind,
						path: entry.path,
						tree_state: entry.tree_state
					};
					case "symlink": return {
						kind: entry.kind,
						path: entry.path,
						target: entry.target,
						target_state: entry.target_state
					};
					case "unknown": return {
						kind: entry.kind,
						path: entry.path
					};
				}
			}),
			exclusions
		});
		computeRootSha256 = (entries, exclusions) => digestCanonicalValue(rootCommitment(entries, exclusions), "Reference source graph");
		createHistoricalSourceGraph = (input) => {
			const parsed = historicalSourceGraphInputSchema.parse(input);
			return historicalSourceGraphSchema.parse({
				...parsed,
				root_sha256: computeRootSha256(parsed.entries, parsed.exclusions)
			});
		};
		parseHistoricalSourceGraph = (input) => historicalSourceGraphSchema.parse(input);
		computeHistoricalSourceGraphSha256 = (graph) => digestCanonicalValue({
			...graph,
			entries: graph.entries.map(({ local_diagnostics: _local, ...entry }) => entry)
		}, "Reference source graph");
		createHistoricalSourceManifest = (input) => {
			const graph = parseHistoricalSourceGraph(input);
			const semantic = {
				schema: "HistoricalSourceManifest",
				authority: "historical-reference",
				graph_sha256: computeHistoricalSourceGraphSha256(graph),
				root_sha256: graph.root_sha256,
				inventory_state: graph.inventory_state,
				entry_count: graph.entries.length,
				relationship_count: graph.relationships.length
			};
			return historicalSourceManifestBaseSchema.parse({
				...semantic,
				manifest_id: `hsm_${digestCanonicalValue(semantic, "Reference source graph")}`
			});
		};
	})))();
}

//#endregion
export { historicalSourceGraphSchema as n, init_referenceSourceGraph as r, createHistoricalSourceGraph as t };