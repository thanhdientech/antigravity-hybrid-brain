import { diffDesktopStates, isWithinAny, } from "../../domain/desktop/desktopStateDiff.js";
import { walkHomeState } from "../../desktop/HomeStateWalker.js";
const EMPTY_WALK = {
    entries: new Map(),
    listed: new Set(),
    roots: new Set(),
};
const fileFacts = (state, sha256) => ({
    type: state.type,
    size: state.size,
    mode: state.mode,
    mtime_ns: state.mtime_ns,
    sha256,
});
const sameVersion = (left, right) => left.size === right.size &&
    left.mtime_ns === right.mtime_ns &&
    left.inode === right.inode;
/** Walks, diffs and retains state for each checkpoint in turn. */
export class CheckpointRecorder {
    scope;
    store;
    checkpoints = [];
    /** Mount points any walk recorded without entering. */
    mountPoints = new Set();
    #previous = EMPTY_WALK;
    /** Digests keyed by path, valid only for the file version they were read from. */
    #hashes = new Map();
    openedFiles = new Set();
    constructor(scope, store) {
        this.scope = scope;
        this.store = store;
    }
    async #retain(path, state, retained, signal) {
        const outcome = await this.store.retain(path, state, signal);
        if (outcome.kind === "omitted")
            return null;
        retained.push({ path, sha256: outcome.sha256, size: outcome.size });
        this.#hashes.set(path, { sha256: outcome.sha256, state });
        return outcome.sha256;
    }
    async #changes(walk, retained, signal) {
        const { differences, unconfirmed } = diffDesktopStates(this.#previous, walk);
        const changes = [];
        for (const { path, kind, before, after } of differences) {
            const known = this.#hashes.get(path);
            const beforeHash = known !== undefined &&
                before !== null &&
                sameVersion(known.state, before)
                ? known.sha256
                : null;
            this.#hashes.delete(path);
            const afterHash = after?.type === "file"
                ? await this.#retain(path, after, retained, signal)
                : null;
            changes.push({
                path,
                kind,
                before: before === null ? null : fileFacts(before, beforeHash),
                after: after === null ? null : fileFacts(after, afterHash),
                in_state_directory: isWithinAny(path, this.scope.stateDirectories),
                opened_by_application: this.openedFiles.has(path),
            });
        }
        return { changes, unconfirmed };
    }
    /** Walk the roots and record one checkpoint; the first one is the baseline. */
    async record(name, trigger, atMs, signal) {
        const { roots, excluded, maxEntries, contentRoots } = this.scope;
        const walk = await walkHomeState(roots, excluded, maxEntries, signal);
        for (const mountPoint of walk.mountPoints)
            this.mountPoints.add(mountPoint);
        const retained = [];
        let changes = [];
        let unconfirmed = 0;
        if (trigger === "baseline") {
            for (const [path, state] of walk.entries)
                if (state.type === "file" && isWithinAny(path, contentRoots))
                    await this.#retain(path, state, retained, signal);
        }
        else
            ({ changes, unconfirmed } = await this.#changes(walk, retained, signal));
        this.#previous = walk;
        this.checkpoints.push({
            name,
            trigger,
            at_ms: atMs,
            entries: walk.entries.size,
            truncated: walk.truncated,
            unreadable_directories: walk.unreadableDirectories,
            unchecked_paths: walk.uncheckedPaths,
            unconfirmed_changes: unconfirmed,
            changes,
            retained,
        });
    }
}
