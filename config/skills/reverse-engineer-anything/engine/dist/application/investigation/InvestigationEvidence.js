import { resolveEvidenceInput } from "../EvidenceInputResolver.js";
import { uniqueSorted } from "../../domain/canonicalOrdering.js";
import { ok } from "../../domain/result.js";
/** Follow exact session references without exporting unrelated records or Unknowns. */
export const resolveInvestigationEvidenceClosure = (reader, seedIds, sources = []) => {
    // Supplied authenticated records are part of this investigation too. A
    // portable inline source need not already have been inserted in the ledger.
    const supplied = new Map(sources.map((source) => [source.evidence_id, source]));
    const lookup = (id) => supplied.get(id) ?? reader.evidenceForAnalysis(id);
    const visited = new Set();
    const pending = [...seedIds];
    while (pending.length > 0) {
        const evidenceId = pending.pop();
        if (evidenceId === undefined || visited.has(evidenceId))
            continue;
        const evidence = resolveEvidenceInput({ kind: "retained-evidence", evidence_id: evidenceId }, lookup, "retained-closure");
        if (!evidence.ok)
            return evidence;
        visited.add(evidenceId);
        for (const link of evidence.value.evidence_links)
            pending.push(link);
    }
    return ok(uniqueSorted([...visited]));
};
