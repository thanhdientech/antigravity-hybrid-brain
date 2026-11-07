import { err, ok } from "../result.js";
const runEnd = (run) => run === undefined ? 0 : run.address + run.length;
/**
 * Merge runs into address-contiguous ranges, never filling gaps. Runs in
 * different address spaces never merge; `space` orders them before address.
 * Overlapping runs must repeat the same bytes, which count as duplicates.
 */
export const mergeArenaRuns = (runs, arena, space = () => 0) => {
    const ordered = [...runs].sort((left, right) => space(left) - space(right) || left.address - right.address);
    const ranges = [];
    let duplicateBytes = 0;
    let first = 0;
    while (first < ordered.length) {
        const head = ordered[first];
        if (head === undefined)
            break;
        let next = first + 1;
        let end = runEnd(head);
        while (next < ordered.length) {
            const candidate = ordered[next];
            if (candidate === undefined ||
                space(candidate) !== space(head) ||
                candidate.address > end)
                break;
            end = Math.max(end, runEnd(candidate));
            next += 1;
        }
        const range = mergeRange(ordered.slice(first, next), end, arena);
        if (!range.ok)
            return range;
        ranges.push(range.value.range);
        duplicateBytes += range.value.duplicateBytes;
        first = next;
    }
    return ok({ ranges, duplicateBytes });
};
/** Copy one contiguous group; written addresses always form [start, written). */
const mergeRange = (group, end, arena) => {
    const start = group[0]?.address ?? 0;
    const bytes = new Uint8Array(end - start);
    let written = start;
    let duplicateBytes = 0;
    for (const run of group) {
        const overlapEnd = Math.min(written, runEnd(run));
        for (let address = run.address; address < overlapEnd; address += 1) {
            const existing = bytes[address - start] ?? 0;
            const incoming = arena[run.offset + address - run.address] ?? 0;
            if (existing !== incoming)
                return err({
                    address,
                    writer: group.find((candidate) => candidate !== run &&
                        candidate.address <= address &&
                        address < runEnd(candidate)) ?? run,
                    run,
                    existing,
                    incoming,
                });
        }
        duplicateBytes += Math.max(overlapEnd - run.address, 0);
        if (runEnd(run) > written) {
            bytes.set(arena.subarray(run.offset + written - run.address, run.offset + run.length), written - start);
            written = runEnd(run);
        }
    }
    return ok({ range: { start, bytes, runs: group }, duplicateBytes });
};
