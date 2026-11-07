import { compareUnicodeCodePoints } from "../../domain/unicodeCodePointOrder.js";
import { AsarArtifactReader } from "../AsarArtifactReader.js";
import { InesArtifactReader, } from "../InesArtifactReader.js";
import { lstat } from "node:fs/promises";
import { isZipPackageFormat } from "../../domain/zipPackageFormat.js";
import { ArtifactReaderFailure, } from "../ArtifactReader.js";
import { artifactInventoryResultSchema, } from "../../domain/artifactGraph.js";
import { createArtifactEdges, createRootNode, materializeDirectoryNodes, rekeyOccurrences, rootOccurrenceFor, } from "./ArtifactGraphConstruction.js";
import { artifactContradictionId, artifactGraphDigest, artifactManifestId, } from "../../domain/artifactIdentity.js";
import { classifyAndHashRootForInventory } from "./classify.js";
import { hostExecutableMarking } from "../hostExecutableMarking.js";
import { hashStableRootArtifact, hashStableRootArtifactHandle, } from "./hashStableRootArtifact.js";
import { createReader, inventoryCoverage } from "./reader.js";
import { scanReader, } from "./scanReader.js";
export const scanCanonicalArtifactInventoryInScope = async (path, options, readerFactory = createReader, selectedPath = path) => (await scanCanonical(path, options, readerFactory, "release", undefined, selectedPath)).snapshot;
/** Keep the admitted source and parsed format facts alive for extraction of this inventory. */
export const scanCanonicalArtifactInventoryForExtractionInScope = async (path, options, probeFacts, selectedPath = path) => scanCanonical(path, options, createReader, "transfer-source", probeFacts, selectedPath);
const scanCanonical = async (path, options, readerFactory, rootDisposition, probeFacts, selectedPath = path) => {
    const metadata = await lstat(path);
    const { format: rootFormat, digest: rootDigest, rootSource, readerAdmission, } = await classifyAndHashRootForInventory(path, metadata.isDirectory(), metadata, { ...options, selectedPath }, probeFacts);
    let reader;
    let readerCreationFailure;
    try {
        reader = readerFactory(path, rootFormat, options.environment ?? {}, readerAdmission, options.asarHeaderAdmission, selectedPath);
    }
    catch (cause) {
        readerCreationFailure = { cause };
    }
    const ownedReaders = reader === undefined ? [] : [reader];
    let outcome;
    try {
        if (readerCreationFailure !== undefined)
            throw readerCreationFailure.cause;
        if (reader instanceof AsarArtifactReader)
            await reader.prepareContainer(rootDigest?.sha256, options.signal);
        const { nodes, occurrences, pendingContradictions, caseCollisionLimitation, inesRegionScan, unknownParentOccurrences, traversal, rootContradiction, } = await scanReader(reader, ownedReaders, options.signal, options.integrity, options.asarHeaderAdmission);
        outcome = {
            kind: "completed",
            snapshot: await buildInventorySnapshot({
                path,
                metadata,
                rootFormat,
                rootDigest,
                rootSource,
                resourceScope: options.resourceScope,
                reader,
                signal: options.signal,
                nodes,
                occurrences,
                pendingContradictions,
                caseCollisionLimitation,
                inesRegionScan,
                unknownParentOccurrences,
                traversal,
                rootContradiction,
            }),
        };
    }
    catch (cause) {
        outcome = { kind: "failed", cause };
        // A mount refusal does not erase the independently classified, hashed
        // carrier. Retain only that root, with explicitly unexamined children.
        if (rootFormat === "dmg" &&
            cause instanceof ArtifactReaderFailure &&
            cause.reason === "unavailable" &&
            cause.partialObservation === undefined &&
            options.signal?.aborted !== true) {
            let retained;
            let rootFailure;
            try {
                retained = await buildInventorySnapshot({
                    path,
                    metadata,
                    rootFormat,
                    rootDigest,
                    rootSource,
                    resourceScope: options.resourceScope,
                    reader,
                    signal: options.signal,
                    nodes: new Map(),
                    occurrences: [],
                    pendingContradictions: [],
                    caseCollisionLimitation: undefined,
                    inesRegionScan: undefined,
                    unknownParentOccurrences: new Set(),
                    rootContradiction: undefined,
                    traversal: {
                        status: "unknown",
                        limitations: [
                            `DMG child traversal was unavailable: ${cause.message}`,
                        ],
                    },
                });
            }
            catch (failure) {
                rootFailure = failure;
            }
            outcome = {
                kind: "failed",
                cause: new ArtifactReaderFailure(cause.reason, rootFailure === undefined
                    ? cause.message
                    : `${cause.message}; root observations could not be revalidated: ${rootFailure instanceof Error ? rootFailure.message : String(rootFailure)}`, {
                    cause: rootFailure === undefined
                        ? cause
                        : new AggregateError([cause, rootFailure], "DMG traversal and root revalidation failed", { cause }),
                    cleanup: cause.cleanup,
                    cleanupLeases: cause.cleanupLeases,
                    userMessage: cause.userMessage,
                    ...(retained === undefined
                        ? {}
                        : {
                            partialObservation: {
                                kind: "artifact-inventory",
                                inventory: retained,
                            },
                        }),
                }, cause.details),
            };
        }
    }
    const cleanup = await cleanupInventoryOwners({
        path,
        options,
        rootSource,
        ownedReaders,
        readerAdmission,
        outcome,
        rootDisposition: rootDisposition === "transfer-source" &&
            outcome.kind === "completed" &&
            rootSource !== undefined &&
            (isZipPackageFormat(rootFormat) ||
                rootFormat === "ines" ||
                (readerAdmission !== undefined && "kind" in readerAdmission))
            ? "transfer"
            : "release",
    });
    if (cleanup.failure !== undefined)
        throw cleanup.failure;
    if (cleanup.outcome.kind === "failed")
        throw cleanup.outcome.cause;
    return {
        snapshot: cleanup.outcome.snapshot,
        transferredSource: cleanup.transferred,
    };
};
const cleanupInventoryOwners = async ({ path, options, rootSource, ownedReaders, readerAdmission, outcome, rootDisposition, }) => {
    let finalOutcome = outcome;
    let cleanupFailure;
    // Finalization still belongs to this operation. Preserve completed facts when
    // cancellation arrives while an owner is being released, but keep an earlier
    // operation or cleanup failure primary.
    const observeCancellation = () => {
        if (finalOutcome.kind === "completed" &&
            cleanupFailure === undefined &&
            options.signal?.aborted === true)
            finalOutcome = {
                kind: "failed",
                cause: new ArtifactReaderFailure("cancelled", "Artifact inventory cancelled during finalization", {
                    cause: options.signal.reason,
                    partialObservation: {
                        kind: "artifact-inventory",
                        inventory: finalOutcome.snapshot,
                    },
                }),
            };
    };
    observeCancellation();
    const readerOwners = [...ownedReaders]
        .reverse()
        .map((reader) => ({
        kind: "reader",
        reader,
        resource: `artifact reader for ${path}`,
    }));
    const rootOwner = rootSource === undefined
        ? undefined
        : {
            kind: "file-handle",
            handle: rootSource.owner,
            resource: `root artifact descriptor for ${path}`,
        };
    for (const owner of readerOwners) {
        const attempt = await options.resourceScope.release(owner);
        observeCancellation();
        if (attempt.kind === "released")
            continue;
        cleanupFailure = options.resourceScope.cleanupFailure(cleanupFailure === undefined
            ? finalOutcome
            : { kind: "failed", cause: cleanupFailure }, [attempt], outcome.kind === "completed"
            ? { kind: "artifact-inventory", inventory: outcome.snapshot }
            : undefined);
    }
    if (rootDisposition === "transfer" &&
        finalOutcome.kind === "completed" &&
        cleanupFailure === undefined &&
        rootSource !== undefined &&
        rootOwner !== undefined &&
        readerAdmission !== undefined)
        return {
            failure: undefined,
            transferred: { owner: rootOwner, admission: readerAdmission },
            outcome: finalOutcome,
        };
    if (rootOwner !== undefined) {
        const attempt = await options.resourceScope.release(rootOwner);
        observeCancellation();
        if (attempt.kind === "failed")
            cleanupFailure = options.resourceScope.cleanupFailure(cleanupFailure === undefined
                ? finalOutcome
                : { kind: "failed", cause: cleanupFailure }, [attempt], outcome.kind === "completed"
                ? { kind: "artifact-inventory", inventory: outcome.snapshot }
                : undefined);
    }
    return {
        failure: cleanupFailure,
        transferred: undefined,
        outcome: finalOutcome,
    };
};
const buildInventorySnapshot = async (input) => {
    const { path, metadata, rootFormat, rootDigest, rootSource, reader, signal } = input;
    materializeDirectoryNodes(input.occurrences, input.nodes);
    const rootNode = createRootNode({
        digest: rootDigest,
        occurrences: input.occurrences,
    });
    input.nodes.set(rootNode.artifact_id, rootNode);
    rekeyOccurrences(rootNode.artifact_id, input.occurrences);
    const rootOccurrence = rootOccurrenceFor(rootNode, {
        size: metadata.size,
        executable: hostExecutableMarking(path, metadata),
        format: rootFormat,
        path,
        formatMetadata: reader?.formatMetadata?.(),
    });
    for (const occurrence of input.occurrences)
        if (occurrence.parent_occurrence_id === null &&
            !input.unknownParentOccurrences.has(occurrence))
            occurrence.parent_occurrence_id = rootOccurrence.occurrence_id;
    input.occurrences.unshift(rootOccurrence);
    if (input.rootContradiction !== undefined) {
        rootOccurrence.hash_status = "mismatched";
        rootOccurrence.limitations.push("Declared integrity metadata contradicts observed bytes.");
        input.pendingContradictions.push({
            occurrence: rootOccurrence,
            integrity: input.rootContradiction,
            entryKind: "file",
            unpacked: false,
        });
    }
    const occurrenceById = new Map(input.occurrences.map((occurrence) => [
        occurrence.occurrence_id,
        occurrence,
    ]));
    const integrityContradictions = buildIntegrityContradictions(input.pendingContradictions, occurrenceById, rootNode);
    const edgeResult = createArtifactEdges(rootNode.artifact_id, input.occurrences, reader?.provenance()[0]);
    const { edges } = edgeResult;
    const orderedNodes = sortNodes([...input.nodes.values()]);
    const orderedOccurrences = sortOccurrences(input.occurrences);
    const orderedEdges = sortEdges(edges).map((edge, ordinal) => ({
        ...edge,
        ordinal,
    }));
    await verifyRootDigest(path, rootDigest, rootSource, input.resourceScope, signal);
    const graphSha256 = artifactGraphDigest({
        nodes: orderedNodes,
        occurrences: orderedOccurrences,
        edges: orderedEdges,
        contradictions: integrityContradictions,
    });
    const manifest = buildManifest({
        rootNode,
        rootFormat,
        graphSha256,
        orderedNodes,
        orderedOccurrences,
        orderedEdges,
    });
    let ines;
    if (reader instanceof InesArtifactReader) {
        if (rootDigest === null || input.inesRegionScan === undefined)
            throw new ArtifactReaderFailure("integrity", "Missing iNES reconstruction scan");
        ines = await reader.verifyReconstruction(rootDigest.sha256, input.inesRegionScan, signal);
    }
    const traversal = inventoryCoverage(rootFormat, reader, input.traversal);
    const coverage = edgeResult.limitations.length === 0
        ? traversal.coverage
        : { ...traversal.coverage, status: "unknown" };
    return {
        manifest,
        ...(ines === undefined ? {} : { ines }),
        nodes: orderedNodes,
        occurrences: orderedOccurrences,
        edges: orderedEdges,
        provenance: reader?.provenance() ?? [],
        integrity_contradictions: integrityContradictions,
        coverage,
        limitations: buildLimitations([...traversal.limitations, ...edgeResult.limitations], integrityContradictions, input.caseCollisionLimitation),
    };
};
const buildIntegrityContradictions = (pending, occurrenceById, rootNode) => pending.map((contradiction) => {
    const occurrence = contradiction.occurrence;
    const parent = occurrence.parent_occurrence_id === null
        ? undefined
        : occurrenceById.get(occurrence.parent_occurrence_id);
    const parentArtifactId = parent?.artifact_id ?? rootNode.artifact_id;
    return {
        contradiction_id: artifactContradictionId({
            rootArtifactId: rootNode.artifact_id,
            logicalPath: occurrence.logical_path,
            integrity: contradiction.integrity,
        }),
        occurrence_id: occurrence.occurrence_id,
        parent_artifact_id: parentArtifactId,
        logical_path: occurrence.logical_path,
        ...contradiction.integrity,
        entry_kind: contradiction.entryKind,
        unpacked: contradiction.unpacked,
        trust: "observed-untrusted",
        provenance: "container-integrity-metadata-versus-observed-bytes",
        limitations: [
            "Observed bytes contradict declared integrity metadata and cannot support equivalence.",
        ],
    };
});
const verifyRootDigest = async (path, rootDigest, rootSource, resourceScope, signal) => {
    if (rootDigest === null)
        return;
    const verified = rootSource === undefined
        ? await hashStableRootArtifact(path, resourceScope, signal)
        : await hashStableRootArtifactHandle(path, rootSource.handle, rootSource.initial, signal);
    if (verified.sha256 !== rootDigest.sha256 ||
        verified.bytes !== rootDigest.bytes)
        throw new ArtifactReaderFailure("integrity", "Root artifact changed during inventory");
};
const sortNodes = (nodes) => nodes.sort((left, right) => compareUnicodeCodePoints(left.artifact_id, right.artifact_id));
const sortOccurrences = (occurrences) => occurrences.sort((left, right) => compareUnicodeCodePoints(left.logical_path, right.logical_path));
const sortEdges = (edges) => edges.sort((left, right) => compareUnicodeCodePoints(left.edge_id, right.edge_id));
const buildManifest = ({ rootNode, rootFormat, graphSha256, orderedNodes, orderedOccurrences, orderedEdges, }) => artifactInventoryResultSchema.shape.manifest.parse({
    manifest_id: artifactManifestId(rootNode.artifact_id, graphSha256),
    root_artifact_id: rootNode.artifact_id,
    root_sha256: rootNode.sha256,
    root_format: rootFormat,
    graph_sha256: graphSha256,
    node_count: orderedNodes.length,
    occurrence_count: orderedOccurrences.length,
    edge_count: orderedEdges.length,
});
const buildLimitations = (scopeLimitations, integrityContradictions, caseCollisionLimitation) => [
    ...scopeLimitations,
    ...(caseCollisionLimitation === undefined ? [] : [caseCollisionLimitation]),
    ...(integrityContradictions.length === 0
        ? []
        : [
            `${String(integrityContradictions.length)} integrity contradiction(s) were recorded; mismatched content is observed-untrusted.`,
        ]),
];
