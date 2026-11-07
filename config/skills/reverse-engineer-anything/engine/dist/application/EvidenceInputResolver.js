import { getEvidenceInputContract, } from "../domain/evidenceInputContract.js";
import { retainedEvidenceReferenceSchema } from "../domain/evidenceReference.js";
import { AnalysisCancelledError } from "../domain/analysisErrorCore.js";
import { EvidenceReferenceError } from "../domain/evidenceErrors.js";
import { err, ok } from "../domain/result.js";
import { analysisInputErrorFromIssues } from "../domain/inputIssueProjection.js";
import { parseAnalysisInput } from "./AnalysisInput.js";
import { readEvidenceFileSource, } from "./analysisView/evidenceFileSource.js";
/** Resolve only schema-declared Evidence fields, sharing one lookup per exact ID. */
export function resolveEvidenceRequest(operation, rawInput, schema, lookup, options = {}) {
    const contract = getEvidenceInputContract(schema);
    const parsed = parseAnalysisInput(operation, rawInput, contract.frameSchema, options.signal);
    if (!parsed.ok)
        return parsed;
    const records = new Map();
    const read = (id) => {
        if (!records.has(id))
            records.set(id, lookup?.(id));
        return records.get(id);
    };
    const sources = new Set();
    const result = contract.resolve(parsed.value, (input, path) => {
        if (options.signal?.aborted)
            return err(new AnalysisCancelledError(operation, {
                cause: options.signal.reason,
            }));
        let selected = input;
        if (typeof input === "object" && input !== null && "kind" in input) {
            const reference = retainedEvidenceReferenceSchema.safeParse(input);
            if (!reference.success)
                return err(analysisInputErrorFromIssues(operation, reference.error.issues.map((issue) => ({
                    ...issue,
                    path: [...path, ...issue.path],
                })), rawInput, { cause: reference.error }));
            const found = resolveEvidenceInput(reference.data, read, options.referenceScope);
            if (!found.ok)
                return err(new EvidenceReferenceError(found.error.evidenceId, found.error.reason, {
                    cause: found.error,
                    expected: found.error.expected,
                    actual: found.error.actual,
                    referenceScope: found.error.referenceScope,
                    diagnostics: { input_path: [...path] },
                }));
            selected = found.value;
        }
        if (options.readEvidence !== undefined) {
            const admitted = options.readEvidence(selected, path);
            if (!admitted.ok) {
                if (admitted.error.diagnostics?.input_path === undefined)
                    admitted.error.retainDiagnostics({ input_path: [...path] });
                return admitted;
            }
            selected = admitted.value;
        }
        sources.add(selected);
        return ok(selected);
    });
    if (result.ok && options.signal?.aborted)
        return err(new AnalysisCancelledError(operation, { cause: options.signal.reason }));
    return result.ok
        ? ok({
            input: result.value,
            sources: [...sources],
        })
        : result;
}
/** Resolve an exact reference; callers declare when recovery requires retained closure. */
export const resolveEvidenceInput = (input, lookup, referenceScope) => {
    if (!("kind" in input))
        return ok(input);
    const record = lookup?.(input.evidence_id);
    if (record === undefined)
        return err(new EvidenceReferenceError(input.evidence_id, "missing", {
            expected: "Evidence available to the selected source",
            actual: null,
            referenceScope,
        }));
    if (record.evidence_id !== input.evidence_id)
        return err(new EvidenceReferenceError(input.evidence_id, "identity_mismatch", {
            expected: input.evidence_id,
            actual: record.evidence_id,
        }));
    return ok(record);
};
/** Resolve explicit paired sources; Evidence files use the shared file reader. */
export const resolvePairedEvidenceSources = async (input, lookup, options) => {
    const left = await resolveEvidenceSource(input.left, "left", lookup, options);
    if (!left.ok)
        return left;
    const right = await resolveEvidenceSource(input.right, "right", lookup, options);
    if (!right.ok)
        return right;
    return ok({ ...input, left: left.value, right: right.value });
};
const resolveEvidenceSource = async (input, side, lookup, options) => {
    if ("kind" in input && input.kind === "evidence-file")
        return readEvidenceFileSource(input.path, options, input.evidence_id, {
            operation: options.operation,
            path: [side],
            resolveSelected: (selected, fileLookup) => options.resolveEvidence?.(selected, (id) => fileLookup(id) ?? lookup?.(id), side) ?? ok(selected),
        });
    const selected = resolveEvidenceInput(input, lookup);
    return selected.ok
        ? (options.resolveEvidence?.(selected.value, lookup, side) ?? selected)
        : selected;
};
