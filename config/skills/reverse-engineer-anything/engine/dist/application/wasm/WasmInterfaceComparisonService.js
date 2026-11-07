import { WASM_INTERFACE_REPRESENTATION_BYTES, wasmInterfaceEntryRepresentationBytes, } from "../../domain/wasm/wasmInterface.js";
import { setImmediate } from "node:timers/promises";
import { ARTIFACT_COMPARISON_PROVIDER } from "../../domain/comparisonEvidenceIdentity.js";
import { compareWasmInterfacesInputSchema, wasmInterfaceComparisonSchema, } from "../../contracts/wasm/wasmComparisonContracts.js";
import { createEvidence } from "../../domain/evidence.js";
import { wasmArtifactSchema, wasmArtifactMatchesSubject, } from "../../domain/wasm/wasmArtifact.js";
import { AnalysisCancelledError, AnalysisInputError, AnalysisResourceConstraintError, } from "../../domain/analysisErrorCore.js";
import { fixedAllowanceOptions } from "../../domain/fixedAllowanceRemediation.js";
import { AnalysisError } from "../../domain/analysisErrorBase.js";
import { err, ok } from "../../domain/result.js";
import { resolveEvidenceRequest, } from "../EvidenceInputResolver.js";
import { safeParseEvidence } from "../../domain/evidenceValidation.js";
import { completeProviderEvidence } from "../ProviderOperationExecution.js";
import { withEvidenceSources, } from "../investigation/recordEvidenceSources.js";
const OPERATION = "compare_wasm_interfaces";
const parseInspection = (raw, side) => {
    const authenticated = safeParseEvidence(raw);
    if (!authenticated.ok)
        return inspectionInputFailure(authenticated.error, side);
    const evidence = authenticated.value;
    if (evidence.operation !== "inspect_wasm_artifact")
        return inspectionInputFailure(new TypeError("Expected complete inspect_wasm_artifact Evidence"), side);
    const parsed = wasmArtifactSchema.safeParse(evidence.normalized_result);
    if (!parsed.success)
        return inspectionInputFailure(parsed.error, side);
    const result = parsed.data;
    if (!wasmArtifactMatchesSubject(result.artifact, evidence.subject === null
        ? null
        : {
            sha256: evidence.subject.digest.sha256,
            format: evidence.subject.format,
        }) ||
        evidence.parameters.path !== result.artifact.path)
        return inspectionInputFailure(new TypeError("WASM Evidence subject/selection does not match normalized artifact identity"), side);
    return ok({ evidence, result });
};
/** Attribute a rejected side to the input argument that supplied it. */
const inspectionInputFailure = (cause, side) => err(new AnalysisInputError(OPERATION, { cause }, [
    { path: [side], reason: "invalid_value", message: cause.message },
]));
/** Compare only producer-owned typed facts; no raw WAT or original file is reread. */
export const compareWasmInterfaces = async (rawInput, options, lookup) => {
    if (options?.signal?.aborted)
        return err(new AnalysisCancelledError(OPERATION, { cause: options.signal.reason }));
    const resolved = resolveEvidenceRequest(OPERATION, rawInput, compareWasmInterfacesInputSchema, lookup, options);
    if (!resolved.ok)
        return resolved;
    const assertActive = () => {
        if (options?.signal?.aborted)
            throw new AnalysisCancelledError(OPERATION, {
                cause: options.signal.reason,
            });
    };
    try {
        await setImmediate();
        assertActive();
        const parsedLeft = parseInspection(resolved.value.input.left, "left");
        if (!parsedLeft.ok)
            return parsedLeft;
        const parsedRight = parseInspection(resolved.value.input.right, "right");
        if (!parsedRight.ok)
            return parsedRight;
        const left = parsedLeft.value;
        const right = parsedRight.value;
        const scope = resolved.value.input.scope;
        const selected = (entry) => scope === "both" ||
            entry.direction === (scope === "imports" ? "import" : "export");
        const groups = new Map();
        let work = 0;
        for (const [side, inspection] of [
            ["left", left],
            ["right", right],
        ]) {
            for (const entry of inspection.result.interface?.entries ?? []) {
                if (++work % 256 === 0) {
                    await setImmediate();
                    assertActive();
                }
                if (!selected(entry))
                    continue;
                const key = JSON.stringify([entry.direction, entry.module, entry.name]);
                let group = groups.get(key);
                if (group === undefined) {
                    group = { left: [], right: [], entry };
                    groups.set(key, group);
                }
                group[side].push(entry);
            }
        }
        const knownInventory = (inspection) => inspection.result.interface?.state === "complete";
        const changes = [];
        const summary = {
            added: 0,
            removed: 0,
            changed: 0,
            unchanged: 0,
            unknown: 0,
        };
        let remaining = WASM_INTERFACE_REPRESENTATION_BYTES;
        for (const group of groups.values()) {
            remaining -=
                512 +
                    group.left.reduce((sum, entry) => sum + wasmInterfaceEntryRepresentationBytes(entry), 0) +
                    group.right.reduce((sum, entry) => sum + wasmInterfaceEntryRepresentationBytes(entry), 0);
            if (remaining < 0)
                throw new AnalysisResourceConstraintError(OPERATION, "capacity", "WASM comparison exceeds typed interface representation capacity", { maximum_bytes: WASM_INTERFACE_REPRESENTATION_BYTES }, fixedAllowanceOptions("The WASM interface comparison inventory", "bytes"));
            if (++work % 256 === 0) {
                await setImmediate();
                assertActive();
            }
            let state;
            let reason = null;
            const l = group.left[0];
            const r = group.right[0];
            if (group.left.length > 1 || group.right.length > 1) {
                state = "unknown";
                reason =
                    "Duplicate interface names are ambiguous; all occurrences retained";
            }
            else if (!knownInventory(left) || !knownInventory(right)) {
                state = "unknown";
                reason =
                    "Incomplete interface inventories cannot establish per-key uniqueness or absence";
            }
            else if ([l, r].some((entry) => entry !== undefined &&
                (entry.signature === null ||
                    entry.issue !== null ||
                    entry.kind === "unknown"))) {
                state = "unknown";
                reason =
                    "Signature/type semantics were not admitted for every present entry";
            }
            else if (l === undefined)
                state = "added";
            else if (r === undefined)
                state = "removed";
            else if (l.kind !== r.kind)
                state = "changed";
            else
                state =
                    JSON.stringify(l.signature) === JSON.stringify(r.signature)
                        ? "unchanged"
                        : "changed";
            summary[state]++;
            changes.push({
                direction: group.entry.direction,
                module: group.entry.module,
                name: group.entry.name,
                state,
                left: group.left,
                right: group.right,
                reason,
            });
        }
        const compareText = (a, b) => a < b ? -1 : a > b ? 1 : 0;
        changes.sort((a, b) => compareText(a.direction, b.direction) ||
            compareText(a.module ?? "", b.module ?? "") ||
            compareText(a.name, b.name));
        const coverage = left.result.interface === undefined &&
            right.result.interface === undefined
            ? "unknown"
            : !knownInventory(left) || !knownInventory(right) || summary.unknown > 0
                ? "partial"
                : "complete-within-inputs";
        const limitations = [
            "Exact declared interface equality is not runtime/ABI compatibility, successful linking or original-source identity.",
            "Typed facts come from the selected validated WABT decoding; unsupported signature semantics and duplicate names remain unknown.",
        ];
        const report = wasmInterfaceComparisonSchema.parse({
            left: {
                evidence_id: left.evidence.evidence_id,
                artifact: left.result.artifact,
            },
            right: {
                evidence_id: right.evidence.evidence_id,
                artifact: right.result.artifact,
            },
            scope,
            coverage,
            changes,
            summary,
            limitations,
        });
        const evidence = createEvidence(undefined, ARTIFACT_COMPARISON_PROVIDER, {
            operation: OPERATION,
            predicateType: "rea.wasm-interface-comparison",
            parameters: {
                left_evidence_id: left.evidence.evidence_id,
                right_evidence_id: right.evidence.evidence_id,
                scope,
            },
            result: report,
            confidence: "derived",
            authority: "analyst-inference",
            limitations,
            evidenceLinks: [left.evidence.evidence_id, right.evidence.evidence_id],
        });
        await setImmediate();
        const completed = completeProviderEvidence(evidence, options?.signal);
        const sources = [left.evidence, right.evidence];
        return withEvidenceSources(completed.ok ? ok({ evidence: completed.value, sources }) : completed, sources);
    }
    catch (cause) {
        if (cause instanceof AnalysisError)
            return err(cause);
        throw cause;
    }
};
