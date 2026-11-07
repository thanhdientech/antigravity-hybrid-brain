import { assertAdmittedRootDigest } from "../inventory/classify.js";
import { assertArtifactFileSelectedSource } from "../ArtifactFileSource.js";
import { assertArtifactSelectedSource, resolveArtifactSourcePath, } from "../ArtifactSelectedSource.js";
import { InesArtifactReader } from "../InesArtifactReader.js";
import { openRootArtifact, hashStableRootArtifactHandle, } from "../inventory/hashStableRootArtifact.js";
import { absoluteCallerPath } from "../../filesystem/callerPath.js";
import { artifactFormatDescriptor } from "../artifactFormats.js";
import { createArtifactReader } from "../createArtifactReader.js";
import { resolveAsarHeaderAdmission } from "../AsarHeader.js";
import { ArtifactEmbeddedFormatProbes, } from "../ArtifactEmbeddedFormatProbes.js";
import { withArtifactRegularFile } from "../ArtifactFileOperation.js";
import { lstat, realpath } from "node:fs/promises";
import { dirname } from "node:path";
import { isPathWithinRoot } from "../../domain/localPath.js";
import { SafeOutputTreeDestinationRefusal } from "../SafeOutputTreeAdmission.js";
import { compareUnicodeCodePoints } from "../../domain/unicodeCodePointOrder.js";
import { digestCanonicalValue } from "../../domain/canonicalDigest.js";
import { ArtifactPathRegistry, normalizeArtifactPath, } from "../ArtifactPaths.js";
import { ArtifactReaderFailure, } from "../ArtifactReader.js";
import { ArtifactTraversalObservation } from "../ArtifactTraversalObservation.js";
import { abortIfNeeded } from "../ArtifactHash.js";
import { SafeOutputTree } from "../SafeOutputTree.js";
import { SafeOutputTreeCreationFailure } from "../SafeOutputTreeCreationFailure.js";
import { artifactExtractionResultSchema, } from "../../domain/artifactGraph.js";
import { AnalysisUnsupportedTargetError } from "../../domain/analysisErrorCore.js";
import { scanArtifactInventoryForExtractionInScope } from "../inventory/ArtifactInventory.js";
/** Extract every regular inventory occurrence into an exclusively owned absent root. */
export const extractArtifact = async (input, signal) => input.resourceScope.run(() => extractArtifactInScope(input, signal));
const extractArtifactInScope = async (input, signal) => {
    // Cancellation wins over every later refusal, including unsupported formats.
    abortIfNeeded(signal);
    const sourcePath = await resolveArtifactSourcePath(input.inputPath);
    if (input.expectedRootSha256 !== undefined)
        await assertArtifactSelectedSource(sourcePath, input.selectedPath);
    const probeFacts = await requireExtractableFormat(sourcePath, input, signal);
    const { snapshot, transferredSource } = await scanArtifactInventoryForExtractionInScope(input.inputPath, {
        resourceScope: input.resourceScope,
        selectedPath: input.selectedPath,
        expectedRootSha256: input.expectedRootSha256,
        signal,
        environment: input.environment,
        asarHeaderAdmission: input.asarHeaderAdmission ??
            resolveAsarHeaderAdmission(input.environment),
        espFlashSelection: input.espFlashSelection,
        integrity: input.integrityPolicy,
    }, probeFacts);
    const activeSource = transferredSource === undefined
        ? undefined
        : { ...transferredSource, releaseAttempted: false };
    try {
        return await materializeArtifactInventoryInScope(input, sourcePath, snapshot, signal, activeSource);
    }
    catch (cause) {
        if (activeSource !== undefined && cause instanceof ArtifactReaderFailure)
            cause.retainPartialObservation({
                kind: "artifact-inventory",
                inventory: snapshot,
            });
        const attempt = await releaseTransferredArtifactSource(input.resourceScope, activeSource);
        if (attempt?.kind === "failed")
            throw input.resourceScope.cleanupFailure({ kind: "failed", cause }, [attempt], { kind: "artifact-inventory", inventory: snapshot });
        throw cause;
    }
};
const releaseTransferredArtifactSource = async (resourceScope, transferredSource) => {
    if (transferredSource === undefined || transferredSource.releaseAttempted)
        return undefined;
    transferredSource.releaseAttempted = true;
    return resourceScope.release(transferredSource.owner);
};
/** Materialize a scanned inventory, borrowing its admitted source when supplied. */
export const materializeArtifactInventoryInScope = async (input, sourcePath, snapshot, signal, transferredSource) => {
    abortIfNeeded(signal);
    // A directory source must never acquire its own output as a new member on
    // the verification traversal. Resolve the selected parent before any write.
    if (transferredSource === undefined) {
        let canonicalSource;
        try {
            canonicalSource = await realpath(sourcePath);
        }
        catch (cause) {
            abortIfNeeded(signal);
            if (inventorySourceChanged(cause))
                throw new ArtifactReaderFailure("integrity", `Inventoried source changed: ${sourcePath}`, { cause });
            throw cause;
        }
        if ((await lstat(canonicalSource)).isDirectory()) {
            const { canonicalOutput } = await SafeOutputTree.resolveDestination(input.outputRoot);
            const parent = dirname(canonicalOutput);
            if (isPathWithinRoot(canonicalSource, parent))
                throw new SafeOutputTreeDestinationRefusal(`Extraction output parent ${parent} is inside source directory ${canonicalSource}. Choose a temporary directory outside the source.`);
        }
    }
    abortIfNeeded(signal);
    const containerMetadata = snapshot.occurrences.find((row) => row.logical_path === ".")?.format_metadata;
    if (containerMetadata?.kind === "godot-pck" &&
        containerMetadata.directory_status !== "available")
        throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `Godot PCK directory is ${containerMetadata.directory_status}; its complete contents cannot be extracted`);
    if (containerMetadata?.kind === "unityfs" &&
        containerMetadata.directory_status !== "available")
        throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `UnityFS directory is ${containerMetadata.directory_status}; its complete contents cannot be extracted`);
    if (containerMetadata?.kind === "wxapkg" &&
        containerMetadata.directory_status !== "available")
        throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `wxapkg directory is ${containerMetadata.directory_status}; its complete contents cannot be extracted`);
    const selectedOccurrences = snapshot.occurrences.filter((occurrence) => (occurrence.entry_kind === "file" || occurrence.entry_kind === "slice") &&
        occurrence.logical_path !== ".");
    const regularPaths = new Set(selectedOccurrences.map(({ logical_path: path }) => path));
    const directoryPaths = new Set(snapshot.occurrences
        .filter(({ entry_kind }) => entry_kind === "directory")
        .map(({ logical_path }) => logical_path));
    const activeOccurrences = selectedOccurrences.filter(({ logical_path }) => {
        // Nested members remain represented by their containing regular file;
        // only entries exposed by the active reader are materialized.
        let path = logical_path;
        for (let slash = path.lastIndexOf("/"); slash >= 0; slash = path.lastIndexOf("/")) {
            path = path.slice(0, slash);
            if (regularPaths.has(path) && !directoryPaths.has(path))
                return false;
        }
        return true;
    });
    const neededNodes = new Set(activeOccurrences.map(({ artifact_id: id }) => id));
    const nodes = new Map();
    for (const node of snapshot.nodes)
        if (neededNodes.has(node.artifact_id))
            nodes.set(node.artifact_id, node);
    const selected = activeOccurrences.map((occurrence) => {
        // REA never decrypts archive entries, so an encrypted entry makes the
        // complete extraction unsupported rather than the archive invalid.
        if (occurrence.encrypted)
            throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `Archive entry ${occurrence.logical_path} is encrypted; REA does not decrypt archive entries, so the archive cannot be extracted completely`);
        // Inventory retains unavailable source occurrences, but extraction cannot
        // materialize bytes it never observed.
        if (occurrence.entry_kind === "file" &&
            occurrence.artifact_id === null &&
            occurrence.hash_status === "unavailable")
            throw new ArtifactReaderFailure("unavailable", `Inventoried source bytes are unavailable for ${occurrence.logical_path}`, undefined, occurrence.unpacked === true
                ? {
                    logicalPath: occurrence.logical_path,
                    declaredSha256: null,
                    calculatedSha256: null,
                    unpacked: true,
                }
                : undefined);
        if ((occurrence.entry_kind !== "file" && occurrence.entry_kind !== "slice") ||
            occurrence.artifact_id === null ||
            occurrence.logical_path === ".")
            throw new ArtifactReaderFailure("format", `Selected occurrence is not an extractable regular child file: ${occurrence.logical_path} (${occurrence.occurrence_id})`);
        const node = nodes.get(occurrence.artifact_id);
        if (node === undefined)
            throw new ArtifactReaderFailure("integrity", `Selected occurrence has no inventory node: ${occurrence.occurrence_id}`);
        return { occurrence, node };
    });
    return materializeSelection({
        input,
        sourcePath,
        inventory: snapshot,
        selected,
        signal,
        transferredSource,
    });
};
const materializeSelection = async ({ input, sourcePath, inventory, selected, signal, transferredSource, }) => {
    const byPath = new Map();
    for (const item of selected) {
        const path = item.occurrence.logical_path;
        if (byPath.has(path))
            throw new ArtifactReaderFailure("path", `Artifact extraction path collision: ${JSON.stringify(path)}. Multiple selected occurrences share this normalized logical path; they cannot be materialized at the same destination path, even when the archive is valid. Inventory retains each occurrence.`);
        byPath.set(path, item);
    }
    if (transferredSource !== undefined && "kind" in transferredSource.admission)
        await assertArtifactFileSelectedSource(sourcePath, transferredSource.admission.source, "Artifact extraction");
    const reader = await createReader(sourcePath, input, inventory.manifest, transferredSource, signal);
    const readerOwner = {
        kind: "reader",
        reader,
        resource: `artifact reader for ${sourcePath}`,
    };
    let localReaderOwner = readerOwner;
    let output;
    let completed;
    const extracted = [];
    try {
        await reader.prepareContainer?.(inventory.manifest.root_sha256, signal);
        try {
            output = await SafeOutputTree.create(input.outputRoot);
        }
        catch (cause) {
            if (cause instanceof SafeOutputTreeCreationFailure)
                output = cause.tree;
            throw cause;
        }
        const traversal = new ArtifactTraversalObservation();
        traversal.onCoverage({
            status: inventory.coverage.status,
            limitations: inventory.limitations,
        });
        await writeSelectedEntries({
            reader,
            output,
            byPath,
            extracted,
            traversal,
            signal,
        });
        localReaderOwner = undefined;
        const closeAttempt = await input.resourceScope.release(readerOwner);
        if (closeAttempt.kind === "failed")
            throw input.resourceScope.cleanupFailure({ kind: "completed" }, [closeAttempt], { kind: "artifact-inventory", inventory });
        const sourceClose = await releaseTransferredArtifactSource(input.resourceScope, transferredSource);
        if (sourceClose?.kind === "failed")
            throw input.resourceScope.cleanupFailure({ kind: "completed" }, [sourceClose], { kind: "artifact-inventory", inventory });
        if (transferredSource !== undefined)
            abortIfNeeded(signal);
        extracted.sort((left, right) => compareUnicodeCodePoints(left.relative_path, right.relative_path));
        completed = createExtractionResult(input, inventory, selected, extracted, traversal.snapshot(), reader.provenance());
        if (input.expectedRootSha256 !== undefined)
            await assertArtifactSelectedSource(sourcePath, input.selectedPath);
        await output.commit(signal);
        return completed;
    }
    catch (cause) {
        const cleanupFailures = await releaseExtractionOwners(input.resourceScope, localReaderOwner, output, input.outputRoot);
        const [firstCleanup, ...remainingCleanup] = cleanupFailures;
        if (firstCleanup !== undefined) {
            throw input.resourceScope.cleanupFailure({ kind: "failed", cause }, [firstCleanup, ...remainingCleanup], output?.published === true && completed !== undefined
                ? { kind: "artifact-extraction", extraction: completed }
                : undefined);
        }
        if (output?.published === true && completed !== undefined)
            return completed;
        throw cause;
    }
};
const writeSelectedEntries = async ({ reader, output, byPath, extracted, traversal, signal, }) => {
    const registry = new ArtifactPathRegistry();
    for await (const entry of reader.entries(signal, traversal)) {
        const path = normalizeArtifactPath(entry.path);
        registry.add(path, entry.kind);
        // Logical declarations may share a query path with a real file. They do
        // not consume that file's selection or participate in materialization.
        if (entry.kind !== "file" && entry.kind !== "slice")
            continue;
        const selectedItem = byPath.get(path);
        if (selectedItem === undefined) {
            throw new ArtifactReaderFailure("integrity", `Regular artifact entry is missing from inventory: ${path}`);
        }
        preflight(entry);
        const stream = await reader.open(entry, signal);
        const written = await output.write(path, stream, {
            sha256: selectedItem.node.sha256,
            bytes: selectedItem.node.size,
        }, signal);
        extracted.push({
            artifact_id: selectedItem.node.artifact_id,
            relative_path: written.relativePath,
            sha256: written.sha256,
            bytes_written: written.bytesWritten,
            created: true,
        });
        byPath.delete(path);
    }
    if (byPath.size > 0)
        throw new ArtifactReaderFailure("integrity", `Inventoried regular artifact entries were not materialized: ${[...byPath.keys()].sort(compareUnicodeCodePoints).join(", ")}`);
};
const releaseExtractionOwners = async (resourceScope, readerOwner, output, outputRoot) => {
    const failures = [];
    if (readerOwner !== undefined) {
        const attempt = await resourceScope.release(readerOwner);
        if (attempt.kind === "failed")
            failures.push(attempt);
    }
    if (output !== undefined) {
        const owner = {
            kind: "output-tree",
            tree: output,
            resource: outputRoot,
        };
        const attempt = await resourceScope.release(owner);
        if (attempt.kind === "failed")
            failures.push(attempt);
    }
    return failures;
};
const createExtractionResult = (input, inventory, selected, extracted, traversal, materializationProvenance) => {
    const selectedIds = new Set(selected.map(({ occurrence }) => occurrence.occurrence_id));
    // A root contradiction covers the container bytes every extracted file came from.
    const rootId = inventory.occurrences.find((row) => row.logical_path === ".")?.occurrence_id;
    const rootContradicted = inventory.integrity_contradictions.some(({ occurrence_id: id }) => id === rootId);
    const integrityContradictions = inventory.integrity_contradictions.filter(({ occurrence_id: id }) => selectedIds.has(id) || id === rootId);
    const extractedContradictions = integrityContradictions.length - (rootContradicted ? 1 : 0);
    const extractionSemantic = {
        source_manifest_id: inventory.manifest.manifest_id,
        selected_occurrence_ids: selected
            .map(({ occurrence }) => occurrence.occurrence_id)
            .sort(compareUnicodeCodePoints),
        files_sha256: digestCanonicalValue(extracted, "Artifact"),
        output_root_alias: "$OUTPUT_ROOT",
    };
    return artifactExtractionResultSchema.parse({
        manifest: inventory.manifest,
        extraction_manifest: {
            ...extractionSemantic,
            extraction_id: `aex_${digestCanonicalValue(extractionSemantic, "Artifact")}`,
        },
        output_root: input.outputRoot,
        artifacts: extracted,
        containment_verified: true,
        cleanup: { attempted: false, verified: true, residual_paths: [] },
        provenance: [...inventory.provenance, ...materializationProvenance],
        coverage: {
            ...inventory.coverage,
            status: traversal.status,
        },
        integrity_contradictions: integrityContradictions,
        limitations: [
            ...traversal.limitations,
            ...selected.flatMap(({ occurrence }) => occurrence.limitations.map((limitation) => `${occurrence.logical_path}: ${limitation}`)),
            traversal.status === "complete"
                ? "All regular files exposed by the active artifact reader were materialized."
                : "All inventoried regular files exposed by the active reader were materialized; source traversal coverage is unknown, so the output is not established as a complete source copy.",
            "Publication verifies the selected inventoried regular files; it does not establish complete content decoding.",
            ...(extractedContradictions === 0
                ? []
                : [
                    `${String(extractedContradictions)} extracted file(s) contradict declared integrity metadata; their bytes are observed-untrusted.`,
                ]),
            ...(rootContradicted
                ? [
                    "The container contradicts its declared integrity metadata; every extracted file is observed-untrusted.",
                ]
                : []),
        ],
    });
};
/**
 * Refuse a format without an extraction reader before inventory work starts.
 * The target kind, not the host, is unsupported by extraction. The error keeps
 * the caller's spelling of the path; I/O uses the canonical path.
 */
const requireExtractableFormat = async (path, input, signal) => {
    const format = input.inputFormat;
    const directory = (await lstat(path)).isDirectory();
    // A thin Mach-O has no child entries of its own: inventory lists only its
    // root unless it carries an embedded pack, so it takes the same pack probe
    // as ELF and PE while only the universal container has a slice reader.
    if (!directory && artifactFormatDescriptor(format)?.extractable !== true) {
        const detected = await withArtifactRegularFile(path, input.resourceScope, signal, async (source) => {
            const probes = new ArtifactEmbeddedFormatProbes(path, source, signal);
            const pack = (await probes.godotPck()) !== undefined ||
                ((format === "elf" || format === "pe" || format === "mach-o") &&
                    ((await probes.nodeSea()) !== undefined ||
                        (await probes.pyInstaller()) !== undefined ||
                        (await probes.bunStandalone()).status === "present" ||
                        (await probes.dotnetBundle()) !== undefined));
            if (pack && input.expectedRootSha256 !== undefined) {
                const digest = await hashStableRootArtifactHandle(path, source.handle, source.initial, signal);
                assertAdmittedRootDigest(path, input.expectedRootSha256, digest.sha256);
            }
            return { pack, probeFacts: probes.completedFacts() };
        });
        if (!detected.pack)
            throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `Artifact format has no extraction reader: ${format}`);
        return detected.probeFacts;
    }
    return undefined;
};
/** Reader selection belongs to inventory classification, not the adapter hint. */
const createReader = async (path, input, manifest, transferredSource, signal) => {
    const containerFormat = manifest.root_format;
    if (containerFormat === "ines" && transferredSource === undefined) {
        let source;
        try {
            source = await openRootArtifact(path, input.resourceScope, signal);
        }
        catch (cause) {
            abortIfNeeded(signal);
            if (inventorySourceChanged(cause) ||
                (cause instanceof ArtifactReaderFailure && cause.reason === "format"))
                throw new ArtifactReaderFailure("integrity", `Inventoried source changed: ${path}`, { cause });
            throw cause;
        }
        try {
            const digest = await hashStableRootArtifactHandle(path, source.handle, source.initial, signal);
            assertAdmittedRootDigest(path, manifest.root_sha256, digest.sha256);
            return new InesArtifactReader(path, source, source.owner);
        }
        catch (cause) {
            const attempt = await input.resourceScope.release({
                kind: "file-handle",
                handle: source.owner,
                resource: `iNES source ${path}`,
            });
            if (attempt.kind === "failed")
                throw input.resourceScope.cleanupFailure({ kind: "failed", cause }, [
                    attempt,
                ]);
            throw cause;
        }
    }
    // DMG inventory may mount read-only, but extraction has no DMG authority.
    const reader = containerFormat === "dmg"
        ? undefined
        : createArtifactReader(path, containerFormat, {
            environment: input.environment,
            // Inventory already records inaccessible descendants as omissions.
            // Keep that traversal policy here; the selected-path check below
            // still refuses any inventoried file that cannot be materialized.
            unreadableDirectories: "omit",
            selectedPath: absoluteCallerPath(input.selectedPath ?? input.inputPath),
            admission: transferredSource?.admission,
            espFlashSelection: input.espFlashSelection,
            asarHeaderAdmission: containerFormat === "asar"
                ? (input.asarHeaderAdmission ??
                    resolveAsarHeaderAdmission(input.environment))
                : undefined,
        });
    if (reader === undefined)
        throw new AnalysisUnsupportedTargetError("extract_artifact", input.selectedPath ?? input.inputPath, `Artifact format has no extraction reader: ${containerFormat}`);
    return reader;
};
const preflight = (entry) => {
    if ((entry.kind !== "file" && entry.kind !== "slice") || entry.encrypted)
        throw new ArtifactReaderFailure("format", `Selected artifact entry cannot be read: ${entry.path}`);
};
const inventorySourceChanged = (cause) => cause instanceof Error &&
    "code" in cause &&
    ["ENOENT", "ENOTDIR", "EISDIR", "ENOTFILE", "ESTALE", "ELOOP"].includes(String(cause.code));
