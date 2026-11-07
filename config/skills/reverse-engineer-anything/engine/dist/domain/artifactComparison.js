import { compareUnicodeCodePoints } from "./unicodeCodePointOrder.js";
import { z } from "zod";
import { AnalysisInputError } from "./analysisErrorCore.js";
import { ArtifactInventoryCarrierError, hasCompleteInventoryCoverage, parseArtifactInventoryEvidence, } from "./artifactInventoryEvidence.js";
import { formatMetadataDeclaration, } from "./artifactFormatMetadata.js";
import { prefixedDigestSchema } from "./../domain/digests.js";
import { canonicalJson } from "./comparisonSemantics.js";
const evidenceIdSchema = prefixedDigestSchema("ev");
const comparisonStatusSchema = z.enum([
    "unchanged",
    "added",
    "removed",
    "changed",
    "truncated",
    "unknown",
    "contradiction",
]);
const changeKindSchema = z.enum([
    "added",
    "removed",
    "changed",
    "unknown",
    "contradiction",
]);
const comparisonDimensionSchema = z.enum([
    "content",
    "kind",
    "format",
    "size",
    "executable",
    "relations",
    "metadata",
    "availability",
    "integrity",
]);
/** One path-classified artifact change with citations to both observations. */
const artifactChangeSchema = z.object({
    classification: changeKindSchema,
    logical_path: z.string().min(1),
    dimensions: z.array(comparisonDimensionSchema).min(1),
    left_occurrence_id: z
        .string()
        .regex(/^occ_[a-f0-9]{64}$/u)
        .nullable(),
    right_occurrence_id: z
        .string()
        .regex(/^occ_[a-f0-9]{64}$/u)
        .nullable(),
    left_artifact_id: z
        .string()
        .regex(/^art_[a-f0-9]{64}$/u)
        .nullable(),
    right_artifact_id: z
        .string()
        .regex(/^art_[a-f0-9]{64}$/u)
        .nullable(),
    evidence_links: z.array(evidenceIdSchema).min(2),
});
/** Deterministic artifact comparison with every change returned inline. */
export const artifactComparisonResultSchema = z.object({
    status: comparisonStatusSchema,
    left_manifest_id: prefixedDigestSchema("agm"),
    right_manifest_id: prefixedDigestSchema("agm"),
    summary: z.object({
        unchanged: z.int().min(0),
        added: z.int().min(0),
        removed: z.int().min(0),
        changed: z.int().min(0),
        unknown: z.int().min(0),
        contradiction: z.int().min(0).default(0),
    }),
    changes: z.array(artifactChangeSchema),
    // Absent on legacy records; absence does not identify a contradicting side.
    integrity_mismatch_evidence_ids: z.array(evidenceIdSchema).optional(),
    limitations: z.array(z.string()),
});
/** Comparison limitation when a path's format declarations cannot be compared. */
export const FORMAT_DECLARATION_UNKNOWN_LIMITATION = "Format metadata declarations are missing on one side or differ in kind for matching paths; omitted metadata may be a legacy or non-container observation and leaves the complete declaration unavailable.";
const comparisonInventory = (input, side) => {
    try {
        return parseArtifactInventoryEvidence(input);
    }
    catch (cause) {
        if (!(cause instanceof ArtifactInventoryCarrierError))
            throw cause;
        throw new AnalysisInputError("compare_artifacts", { cause, userMessage: cause.message }, [{ path: [side], reason: "invalid_value", message: cause.message }]);
    }
};
/** Compare complete inventory evidence without treating missing evidence as equality. */
export const compareArtifacts = (leftEvidence, rightEvidence) => {
    const left = comparisonInventory(leftEvidence, "left");
    const right = comparisonInventory(rightEvidence, "right");
    const leftComplete = left.inventory.complete;
    const rightComplete = right.inventory.complete;
    const sameScope = left.inventory.coverage.scope === right.inventory.coverage.scope;
    const rootCoverageComplete = sameScope &&
        left.inventory.complete &&
        right.inventory.complete &&
        left.inventory.coverage.status === "complete" &&
        right.inventory.coverage.status === "complete";
    const entryCoverageComplete = rootCoverageComplete &&
        left.inventory.coverage.scope === "container-entries";
    const leftCovered = sameScope &&
        hasCompleteInventoryCoverage(left.inventory, left.inventory.coverage.scope);
    const rightCovered = sameScope &&
        hasCompleteInventoryCoverage(right.inventory, right.inventory.coverage.scope);
    const fullyCovered = leftCovered &&
        rightCovered &&
        (entryCoverageComplete ||
            (rootCoverageComplete &&
                left.inventory.manifest.occurrence_count === 1 &&
                right.inventory.manifest.occurrence_count === 1));
    const leftOccurrencesByPath = occurrencesByPath(left.inventory.occurrences);
    const rightOccurrencesByPath = occurrencesByPath(right.inventory.occurrences);
    const comparison = compareOccurrences(left.inventory, right.inventory, leftOccurrencesByPath, rightOccurrencesByPath, [
        ...left.evidence.map(({ evidence_id: id }) => id),
        ...right.evidence.map(({ evidence_id: id }) => id),
    ], { root: rootCoverageComplete, entries: entryCoverageComplete });
    const changes = comparison.changes;
    const limitations = [
        ...left.inventory.limitations.map((item) => `Left: ${item}`),
        ...right.inventory.limitations.map((item) => `Right: ${item}`),
        ...(leftComplete ? [] : ["Left artifact inventory is incomplete."]),
        ...(rightComplete ? [] : ["Right artifact inventory is incomplete."]),
        ...(sameScope ? [] : ["Artifact inventory scopes differ."]),
        ...(sameScope &&
            left.inventory.coverage.scope === "root" &&
            (left.inventory.manifest.occurrence_count > 1 ||
                right.inventory.manifest.occurrence_count > 1)
            ? ["Container entry coverage is unavailable for child paths."]
            : []),
        ...(left.inventory.coverage.status === "complete"
            ? []
            : ["Left artifact inventory traversal coverage is unknown."]),
        ...(right.inventory.coverage.status === "complete"
            ? []
            : ["Right artifact inventory traversal coverage is unknown."]),
        ...(comparison.hasUnknownAsarPacking
            ? [
                "ASAR packing metadata is recorded on only one side for matching paths; omitted metadata may be a legacy observation and does not establish packed or unpacked storage.",
            ]
            : []),
        ...(comparison.hasUnknownFormatDeclaration
            ? [FORMAT_DECLARATION_UNKNOWN_LIMITATION]
            : []),
        ...(comparison.hasAmbiguousDuplicatePaths
            ? [
                "Duplicate logical paths cannot be paired across inventories; comparisons for those paths are unknown.",
            ]
            : []),
    ];
    applyRootHashChange(left.inventory, right.inventory, changes, [
        ...left.evidence.map(({ evidence_id: id }) => id),
        ...right.evidence.map(({ evidence_id: id }) => id),
    ]);
    const summary = summarize(left.inventory, right.inventory, changes, fullyCovered);
    return artifactComparisonResultSchema.parse({
        status: !leftComplete || !rightComplete
            ? "truncated"
            : changes.some(({ classification }) => classification === "contradiction")
                ? "contradiction"
                : !fullyCovered
                    ? "unknown"
                    : changes.some(({ classification }) => classification === "unknown")
                        ? "unknown"
                        : changes.length === 0
                            ? "unchanged"
                            : "changed",
        left_manifest_id: left.inventory.manifest.manifest_id,
        right_manifest_id: right.inventory.manifest.manifest_id,
        summary,
        changes,
        integrity_mismatch_evidence_ids: [
            ...new Set([left, right].flatMap((source) => source.inventory.occurrences.some((occurrence) => occurrence.hash_status === "mismatched")
                ? source.evidence.map((record) => record.evidence_id)
                : [])),
        ].sort(compareUnicodeCodePoints),
        limitations: [...new Set(limitations)].sort(compareUnicodeCodePoints),
    });
};
const compareOccurrences = (left, right, leftByPath, rightByPath, evidenceLinks, coverage) => {
    const leftNodes = new Map(left.nodes.map((item) => [item.artifact_id, item]));
    const rightNodes = new Map(right.nodes.map((item) => [item.artifact_id, item]));
    const leftRelations = relationsByPath(left);
    const rightRelations = relationsByPath(right);
    const paths = [
        ...new Set([...leftByPath.keys(), ...rightByPath.keys()]),
    ].sort(compareUnicodeCodePoints);
    const output = [];
    let hasAmbiguousDuplicatePaths = false;
    let hasUnknownAsarPacking = false;
    let hasUnknownFormatDeclaration = false;
    for (const path of paths) {
        const leftMatches = leftByPath.get(path) ?? [];
        const rightMatches = rightByPath.get(path) ?? [];
        if (leftMatches.length > 1 || rightMatches.length > 1) {
            hasAmbiguousDuplicatePaths = true;
            output.push({
                logical_path: path,
                classification: "unknown",
                dimensions: ["availability"],
                left_occurrence_id: null,
                right_occurrence_id: null,
                left_artifact_id: null,
                right_artifact_id: null,
                evidence_links: [...evidenceLinks],
            });
            continue;
        }
        const leftOccurrence = leftMatches[0];
        const rightOccurrence = rightMatches[0];
        const metadata = occurrenceMetadata({ leftOccurrence, rightOccurrence });
        if (leftOccurrence !== undefined && rightOccurrence !== undefined) {
            if (metadata.asarPacking === "unknown")
                hasUnknownAsarPacking = true;
            if (metadata.formatDeclaration === "unknown")
                hasUnknownFormatDeclaration = true;
        }
        const change = classifyPath({
            metadata,
            path,
            leftOccurrence,
            rightOccurrence,
            leftNode: nodeFor(leftOccurrence, leftNodes),
            rightNode: nodeFor(rightOccurrence, rightNodes),
            leftRelations: leftRelations.get(path) ?? [],
            rightRelations: rightRelations.get(path) ?? [],
            rootCovered: coverage.root,
            entriesCovered: coverage.entries,
            evidenceLinks,
        });
        if (change !== null)
            output.push(change);
    }
    return {
        changes: output,
        hasAmbiguousDuplicatePaths,
        hasUnknownAsarPacking,
        hasUnknownFormatDeclaration,
    };
};
const occurrencesByPath = (occurrences) => {
    const output = new Map();
    for (const occurrence of occurrences) {
        const matches = output.get(occurrence.logical_path);
        if (matches === undefined)
            output.set(occurrence.logical_path, [occurrence]);
        else
            matches.push(occurrence);
    }
    return output;
};
const buildArtifactChangeBase = (input) => ({
    logical_path: input.path,
    left_occurrence_id: input.leftOccurrence?.occurrence_id ?? null,
    right_occurrence_id: input.rightOccurrence?.occurrence_id ?? null,
    left_artifact_id: input.leftOccurrence?.artifact_id ?? null,
    right_artifact_id: input.rightOccurrence?.artifact_id ?? null,
    evidence_links: [...input.evidenceLinks],
});
const classifyPresence = (input, base) => {
    const covered = input.path === "." ? input.rootCovered : input.entriesCovered;
    if (input.leftOccurrence === undefined)
        return {
            ...base,
            classification: covered ? "added" : "unknown",
            dimensions: [covered ? "content" : "availability"],
        };
    if (input.rightOccurrence === undefined)
        return {
            ...base,
            classification: covered ? "removed" : "unknown",
            dimensions: [covered ? "content" : "availability"],
        };
    return null;
};
const classifyIntegrity = (input, base) => {
    if (input.leftOccurrence?.hash_status === "mismatched" ||
        input.rightOccurrence?.hash_status === "mismatched")
        return {
            ...base,
            classification: "contradiction",
            dimensions: ["integrity"],
        };
    return null;
};
const classifyAvailability = (input, base) => {
    if (input.leftOccurrence?.hash_status !== "verified" ||
        input.rightOccurrence?.hash_status !== "verified" ||
        input.leftNode === undefined ||
        input.rightNode === undefined)
        return { ...base, classification: "unknown", dimensions: ["availability"] };
    return null;
};
const classifyPath = (input) => {
    const base = buildArtifactChangeBase(input);
    // A declared/observed mismatch is known even without an opposite occurrence.
    const integrity = classifyIntegrity(input, base);
    if (integrity !== null)
        return integrity;
    const presence = classifyPresence(input, base);
    if (presence !== null)
        return presence;
    const declaration = classifyDeclarationRecord(input, base);
    if (declaration.handled)
        return declaration.change;
    const availability = classifyAvailability(input, base);
    if (availability !== null) {
        const known = occurrenceDifferences(input);
        const dimensions = [];
        if (known.kind)
            dimensions.push("kind");
        if (known.format)
            dimensions.push("format");
        if (known.executable)
            dimensions.push("executable");
        if (known.relations)
            dimensions.push("relations");
        if (known.metadata || declaredDigestsDiffer(input))
            dimensions.push("metadata");
        dimensions.push("availability");
        return {
            ...base,
            classification: declarationChanged(input.metadata)
                ? "changed"
                : "unknown",
            dimensions,
        };
    }
    const dimensions = changedDimensions(input);
    const occurrence = occurrenceDifferences(input);
    if (declarationUnknown(input.metadata) ||
        occurrence.kindUnknown ||
        occurrence.formatUnknown ||
        differsWithUnknown(input.leftNode?.format, input.rightNode?.format) ||
        differsWithMissing(input.leftNode?.media_type, input.rightNode?.media_type) ||
        differsWithMissing(input.leftNode?.architecture, input.rightNode?.architecture)) {
        if (dimensions.length === 0)
            return {
                ...base,
                classification: "unknown",
                dimensions: ["availability"],
            };
        dimensions.push("availability");
    }
    return dimensions.length === 0
        ? null
        : { ...base, classification: "changed", dimensions };
};
/** A declaration that differs even when content is unavailable. */
const declarationChanged = (metadata) => metadata.asarPacking === "changed" ||
    metadata.formatDeclaration === "changed";
/** A declared fact that differs: a declaration or the encryption. */
const declaredFactChanged = (metadata) => Object.values(metadata).includes("changed");
/** A declared fact that one side omits, records as another kind or cannot read. */
const declarationUnknown = (metadata) => Object.values(metadata).includes("unknown");
/** Unknown classifications and absent node metadata cannot establish a difference. */
const differsWithUnknown = (left, right) => left !== right &&
    (left == null || right == null || left === "unknown" || right === "unknown");
const differsWithMissing = (left, right) => left !== right && (left == null || right == null);
/** Occurrence facts remain independently comparable when content is unavailable. */
const occurrenceDifferences = (input) => ({
    kind: input.leftOccurrence?.artifact_kind !==
        input.rightOccurrence?.artifact_kind &&
        !differsWithUnknown(input.leftOccurrence?.artifact_kind, input.rightOccurrence?.artifact_kind),
    kindUnknown: differsWithUnknown(input.leftOccurrence?.artifact_kind, input.rightOccurrence?.artifact_kind),
    format: input.leftOccurrence?.artifact_format !==
        input.rightOccurrence?.artifact_format &&
        !differsWithUnknown(input.leftOccurrence?.artifact_format, input.rightOccurrence?.artifact_format),
    formatUnknown: differsWithUnknown(input.leftOccurrence?.artifact_format, input.rightOccurrence?.artifact_format),
    executable: input.leftOccurrence?.executable !== input.rightOccurrence?.executable,
    // A missing content identity prevents inventory from emitting its edges.
    // An empty projection in that case is unknown, not evidence of no relation.
    relations: input.leftOccurrence?.artifact_id != null &&
        input.rightOccurrence?.artifact_id != null &&
        JSON.stringify(input.leftRelations) !==
            JSON.stringify(input.rightRelations),
    metadata: declaredFactChanged(input.metadata) ||
        input.leftOccurrence?.entry_kind !== input.rightOccurrence?.entry_kind ||
        JSON.stringify(input.leftOccurrence?.limitations) !==
            JSON.stringify(input.rightOccurrence?.limitations),
});
const compareAsarPacking = (left, right) => left === right
    ? "unchanged"
    : left === undefined || right === undefined
        ? "unknown"
        : "changed";
/**
 * Declarations compare within one kind. A declaration that only one side
 * records, including one whose other side records another kind, is unknown.
 * A field that either side could not read is unknown, and the other fields
 * still compare.
 */
const compareFormatDeclarations = (left, right) => {
    if (left === undefined && right === undefined)
        return {
            formatDeclaration: "absent",
            formatDeclarationAvailability: "unchanged",
        };
    if (left === undefined || right === undefined || left.kind !== right.kind)
        return {
            formatDeclaration: "unknown",
            formatDeclarationAvailability: "unchanged",
        };
    const unreadable = new Set([...left.unreadable, ...right.unreadable]);
    const readable = (facts) => Object.fromEntries(Object.entries(facts).filter(([field]) => !unreadable.has(field)));
    return {
        formatDeclaration: canonicalJson(readable(left.facts)) ===
            canonicalJson(readable(right.facts))
            ? "unchanged"
            : "changed",
        formatDeclarationAvailability: Object.keys(left.facts).some((field) => unreadable.has(field))
            ? "unknown"
            : "unchanged",
    };
};
/** Interpret each pair's declarations once, preserving historical omission. */
const occurrenceMetadata = (input) => {
    const left = input.leftOccurrence;
    const right = input.rightOccurrence;
    return {
        asarPacking: compareAsarPacking(left?.unpacked, right?.unpacked),
        encryption: left?.encrypted === right?.encrypted ? "unchanged" : "changed",
        ...compareFormatDeclarations(formatMetadataDeclaration(left?.format_metadata), formatMetadataDeclaration(right?.format_metadata)),
    };
};
/**
 * A node-less metadata record has no content node, so its declared facts are
 * all that comparison checks; an unread payload is not compared. Neither are
 * its limitations, which readers derive from those facts.
 */
const classifyDeclarationRecord = (input, base) => {
    // Metadata is not inherently a declaration. Only apply this comparison
    // when a producer explicitly recorded a compared one. A record that names
    // content keeps the content comparison.
    if (input.leftOccurrence?.entry_kind !== "metadata" ||
        input.rightOccurrence?.entry_kind !== "metadata" ||
        input.leftOccurrence.artifact_id !== null ||
        input.rightOccurrence.artifact_id !== null ||
        input.metadata.formatDeclaration === "absent")
        return { handled: false, change: null };
    const dimensions = [];
    if (input.leftOccurrence.executable !== input.rightOccurrence.executable)
        dimensions.push("executable");
    if (declaredFactChanged(input.metadata))
        dimensions.push("metadata");
    const unknown = declarationUnknown(input.metadata);
    if (dimensions.length === 0)
        return {
            handled: true,
            change: unknown
                ? { ...base, classification: "unknown", dimensions: ["availability"] }
                : null,
        };
    if (unknown)
        dimensions.push("availability");
    return {
        handled: true,
        change: { ...base, classification: "changed", dimensions },
    };
};
/**
 * Without observed content on both sides, the containers' declared digests
 * are the remaining content evidence. Claims of one algorithm that differ
 * are a metadata difference, but they are unverified, so they do not make
 * the path changed; equal claims add nothing. Observed bytes replace both.
 */
const declaredDigestsDiffer = (input) => {
    const left = input.leftOccurrence?.declared_integrity;
    const right = input.rightOccurrence?.declared_integrity;
    return (left !== undefined &&
        right !== undefined &&
        left.algorithm === right.algorithm &&
        left.digest !== right.digest);
};
const changedDimensions = (input) => {
    const left = input.leftNode;
    const right = input.rightNode;
    if (left === undefined || right === undefined)
        return ["availability"];
    const occurrence = occurrenceDifferences(input);
    const checks = [
        ["content", left.sha256 !== right.sha256],
        ["kind", occurrence.kind],
        [
            "format",
            (left.format !== right.format &&
                !differsWithUnknown(left.format, right.format)) ||
                occurrence.format,
        ],
        ["size", left.size !== right.size],
        ["executable", occurrence.executable],
        ["relations", occurrence.relations],
        ["metadata", occurrence.metadata || metadataChanged(left, right)],
    ];
    return checks
        .filter(([, changed]) => changed)
        .map(([dimension]) => dimension);
};
const metadataChanged = (left, right) => (left.media_type !== right.media_type &&
    !differsWithMissing(left.media_type, right.media_type)) ||
    (left.architecture !== right.architecture &&
        !differsWithMissing(left.architecture, right.architecture)) ||
    left.content_state !== right.content_state ||
    JSON.stringify(left.limitations) !== JSON.stringify(right.limitations);
const nodeFor = (occurrence, nodes) => occurrence?.artifact_id === null || occurrence?.artifact_id === undefined
    ? undefined
    : nodes.get(occurrence.artifact_id);
const relationsByPath = (inventory) => {
    const output = new Map();
    const occurrences = new Map(inventory.occurrences.map((item) => [item.occurrence_id, item]));
    for (const edge of inventory.edges) {
        const occurrence = occurrences.get(edge.occurrence_id);
        // An incomplete inventory can omit the occurrence that names the child.
        if (occurrence?.artifact_id === null || occurrence === undefined)
            continue;
        const path = occurrence.logical_path;
        const values = output.get(path);
        const projection = {
            parent_logical_path: occurrence.parent_occurrence_id === null
                ? null
                : (occurrences.get(occurrence.parent_occurrence_id)?.logical_path ??
                    null),
            // Containment roots are path-normalized to avoid graph-wide deltas, but
            // a source map's target is a semantic content identity, not its parent
            // directory. Preserve that identity in the relation comparison.
            mapped_artifact_id: edge.relation === "maps-source" ? edge.parent_artifact_id : null,
            child_artifact_id: occurrence.artifact_id,
            relation: edge.relation,
            logical_path: occurrence.logical_path,
            producer: edge.producer,
        };
        if (values === undefined)
            output.set(path, [projection]);
        else
            values.push(projection);
    }
    for (const values of output.values())
        values.sort((left, right) => compareUnicodeCodePoints(canonicalJson(left), canonicalJson(right)));
    return output;
};
const summarize = (left, right, changes, covered) => {
    const counts = {
        added: 0,
        removed: 0,
        changed: 0,
        unknown: 0,
        contradiction: 0,
    };
    for (const change of changes)
        counts[change.classification] += 1;
    // Change rows are keyed by logical path, and one unknown row for a duplicate
    // path stands for every left occurrence on it. Only occurrences on paths
    // without a left-side change are affirmatively unchanged.
    const changedPaths = new Set(changes
        .filter(({ classification }) => classification !== "added")
        .map(({ logical_path: path }) => path));
    return {
        unchanged: covered
            ? left.occurrences.filter(({ logical_path: path }) => !changedPaths.has(path)).length
            : 0,
        ...counts,
        unknown: covered
            ? counts.unknown
            : Math.max(counts.unknown, Math.max(left.manifest.occurrence_count, right.manifest.occurrence_count) -
                counts.added -
                counts.removed -
                counts.changed -
                counts.contradiction),
    };
};
// Differing manifest root digests prove a root content change even when node
// details are unavailable. Fold that fact into an existing root row so one
// logical path keeps one classification.
const applyRootHashChange = (left, right, changes, evidenceLinks) => {
    if (left.manifest.root_sha256 === right.manifest.root_sha256)
        return;
    const index = changes.findIndex((change) => change.logical_path === ".");
    const existing = changes[index];
    if (existing !== undefined) {
        if (existing.dimensions.includes("content") ||
            (existing.classification !== "unknown" &&
                existing.classification !== "changed"))
            return;
        changes[index] = {
            ...existing,
            classification: "changed",
            dimensions: comparisonDimensionSchema.options.filter((dimension) => dimension === "content" || existing.dimensions.includes(dimension)),
            evidence_links: [
                ...new Set([...existing.evidence_links, ...evidenceLinks]),
            ],
        };
        return;
    }
    const leftRoot = left.occurrences.find((occurrence) => occurrence.logical_path === ".");
    const rightRoot = right.occurrences.find((occurrence) => occurrence.logical_path === ".");
    changes.push({
        classification: "changed",
        logical_path: ".",
        dimensions: ["content"],
        left_occurrence_id: leftRoot?.occurrence_id ?? null,
        right_occurrence_id: rightRoot?.occurrence_id ?? null,
        left_artifact_id: leftRoot?.artifact_id ?? null,
        right_artifact_id: rightRoot?.artifact_id ?? null,
        evidence_links: [...evidenceLinks],
    });
};
