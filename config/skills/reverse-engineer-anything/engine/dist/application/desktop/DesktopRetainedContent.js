import { createHash } from "node:crypto";
import { join } from "node:path";
import { ArtifactResourceScope, } from "../../artifacts/ArtifactResourceScope.js";
import { err, ok } from "../../domain/result.js";
import { RegularFileCleanupFailure, withOwnedRegularFile, } from "../../filesystem/OwnedRegularFile.js";
import { RegularFileCapacityError, readStableFileBytes, } from "../../filesystem/readStableFileBytes.js";
const MIB = 1024 * 1024;
/** Largest retained file the state view reads. */
const DEFAULT_MAX_BYTES = 64 * MIB;
/**
 * Reads retained content without following links and checks each digest.
 * A handle whose close failed is kept, with its path, for `release`.
 */
export class RetainedContent {
    folder;
    maxBytes;
    #unclosed = [];
    constructor(folder, maxBytes = DEFAULT_MAX_BYTES) {
        this.folder = folder;
        this.maxBytes = maxBytes;
    }
    /**
     * The bytes stored under a digest, or why they cannot be used, worded to
     * follow the name of what was read.
     */
    async read(sha256, signal) {
        const path = join(this.folder, "content", sha256);
        const options = {
            symlinks: "reject",
            retainFailedClose: (owner) => {
                this.#unclosed.push({ path, owner });
            },
            ...(signal === undefined ? {} : { signal }),
        };
        let bytes;
        try {
            bytes = await withOwnedRegularFile(path, options, ({ handle }) => readStableFileBytes(handle, path, this.maxBytes, options));
        }
        catch (cause) {
            signal?.throwIfAborted();
            const outcome = cause instanceof RegularFileCleanupFailure ? cause.outcome : undefined;
            // A read that finished keeps its bytes; its failed close is retried by `release`.
            if (outcome?.kind === "completed" && Buffer.isBuffer(outcome.value))
                bytes = outcome.value;
            else if ((outcome?.kind === "failed" ? outcome.cause : cause) instanceof
                RegularFileCapacityError)
                return err(`is larger than the ${String(this.maxBytes / MIB)} MiB read limit`);
            else if (cause instanceof Error)
                return err("is missing or unreadable");
            else
                throw cause;
        }
        return createHash("sha256").update(bytes).digest("hex") === sha256
            ? ok(bytes)
            : err("does not match its digest");
    }
    /** Close every kept handle; each close that fails again keeps its owner. */
    async release(resources) {
        const failures = [];
        for (const { path, owner } of this.#unclosed.splice(0)) {
            const attempt = await resources.release({
                kind: "file-handle",
                resource: path,
                handle: owner,
            });
            if (attempt.kind === "failed")
                failures.push(attempt);
        }
        return failures;
    }
}
/**
 * Run with a retained content reader whose handles are released on every
 * exit. A release that fails is reported with the run's own outcome and the
 * exact handle owners.
 */
export const withRetainedContent = async (folder, run, maxBytes) => {
    const content = new RetainedContent(folder, maxBytes);
    let outcome;
    try {
        outcome = { kind: "completed", value: await run(content) };
    }
    catch (cause) {
        outcome = { kind: "failed", cause };
    }
    const resources = new ArtifactResourceScope();
    const [first, ...rest] = await content.release(resources);
    if (first !== undefined)
        throw resources.cleanupFailure(outcome, [first, ...rest]);
    if (outcome.kind === "failed")
        throw outcome.cause;
    return outcome.value;
};
