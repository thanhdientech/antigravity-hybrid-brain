import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ArtifactResourceScope } from "../artifacts/ArtifactResourceScope.js";
import { dearmorPublicKeys, isArmoredKey, validSignature, } from "../domain/desktop/aptRepositories.js";
import { verifyingKey } from "../domain/desktop/openPgpKeys.js";
import { PrivateRuntimeRoot } from "../process/PrivateRuntimeRoot.js";
import { readHostFile } from "./HostFileRead.js";
const FILE_MAX_BYTES = 1024 * 1024;
/** Runs gpgv on one candidate keyring at a time, written into a private folder it owns. */
class GpgvKeyCheck {
    runQuery;
    signal;
    #root;
    #keyrings = 0;
    #reads = new Map();
    constructor(runQuery, signal) {
        this.runQuery = runQuery;
        this.signal = signal;
    }
    /** The private folder, once a keyring was written into it. */
    get root() {
        return this.#root;
    }
    async #read(path) {
        const read = this.#reads.get(path) ??
            (await readHostFile(path, FILE_MAX_BYTES, this.signal));
        this.#reads.set(path, read);
        return read;
    }
    /** The first candidate key that verifies the release, or why none did. */
    async firstVerifying(candidates, release) {
        const released = release[0] ?? "its release file";
        const unreadable = [];
        for (const path of candidates) {
            const bytes = await this.#read(path);
            if (bytes === "unreadable")
                unreadable.push(path);
            if (typeof bytes === "string")
                continue;
            const signature = await this.#verify(bytes, release);
            if (signature === "missing")
                return {
                    reason: "gpgv is not installed, so no key could be checked against the repository's signature",
                };
            if (signature === undefined)
                continue;
            const kept = verifyingKey(bytes, signature.primary);
            if (!kept.ok)
                return { reason: `${path} verifies ${released}, but ${kept.error}` };
            return {
                path,
                ...kept.value,
                sha256: createHash("sha256").update(kept.value.bytes).digest("hex"),
                fingerprint: signature.primary,
            };
        }
        return {
            reason: `no candidate key (${candidates.join(", ")}) verifies ${released}${unreadable.length === 0 ? "" : `; unreadable: ${unreadable.join(", ")}`}`,
        };
    }
    /** The good signature gpgv reports with the key, whatever its exit status; `missing` without gpgv. */
    async #verify(key, release) {
        const keyring = isArmoredKey(key) ? dearmorPublicKeys(key) : key;
        if (keyring === undefined)
            return undefined;
        this.#root ??= await PrivateRuntimeRoot.create({ prefix: "rea-apt-keys-" });
        const path = join(this.#root.path, `keyring-${String(this.#keyrings)}.gpg`);
        this.#keyrings += 1;
        await writeFile(path, keyring, { mode: 0o600, flag: "wx" });
        const outcome = await this.runQuery("gpgv", [
            "--homedir",
            this.#root.path,
            "--status-fd",
            "1",
            "--keyring",
            path,
            ...release,
        ], this.signal);
        if (outcome === "missing")
            return "missing";
        return typeof outcome === "object"
            ? validSignature(outcome.stdout)
            : undefined;
    }
}
/** Use a gpgv key check, then remove its private folder; a failed removal keeps the folder's owner in the thrown cleanup failure. */
export const withGpgvKeyCheck = async (runQuery, signal, use) => {
    const check = new GpgvKeyCheck(runQuery, signal);
    let outcome;
    try {
        outcome = { kind: "completed", value: await use(check) };
    }
    catch (cause) {
        outcome = { kind: "failed", cause };
    }
    const root = check.root;
    if (root !== undefined) {
        const resources = new ArtifactResourceScope();
        const removed = await resources.release({
            kind: "private-runtime-root",
            resource: root.path,
            root,
        });
        if (removed.kind === "failed")
            throw resources.cleanupFailure(outcome, [removed]);
    }
    if (outcome.kind === "failed")
        throw outcome.cause;
    return outcome.value;
};
