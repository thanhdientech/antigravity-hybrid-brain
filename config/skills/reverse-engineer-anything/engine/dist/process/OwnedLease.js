import { createHash } from "node:crypto";
import { chmod, mkdir, open, rm, rmdir } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { createConnection, createServer, } from "node:net";
import { join } from "node:path";
import { ArtifactFileCleanupFailure, withArtifactFileHandle, } from "../artifacts/ArtifactFileOperation.js";
import { ArtifactResourceScope } from "../artifacts/ArtifactResourceScope.js";
import { ArtifactReaderFailure } from "../artifacts/ArtifactReader.js";
import { safeParseJson } from "../domain/safeJson.js";
/** Recovery finalization retains its operation outcome and every failed owner. */
export class OwnedLeaseCleanupFailure extends ArtifactReaderFailure {
    primary;
    cleanupLeases;
    constructor(primary, failure) {
        super(failure.reason, failure.message, {
            cause: primary,
            cleanup: failure.cleanup,
        });
        this.primary = primary;
        this.cleanupLeases = failure.cleanupLeases;
    }
}
/**
 * Hold one named lease for as long as this process keeps it.
 *
 * The lease is a listening local socket, so the operating system ends it when
 * the owning process exits. A crashed owner leaves a socket that refuses
 * connections; recovery replaces only that stale socket. A live owner answers
 * with its own identity, which is reported instead of a PID guess.
 */
export const acquireOwnedLease = async (input) => {
    const produced = new WeakSet();
    const cleanupCauses = new WeakMap();
    const fail = (failure, cause) => {
        const error = input.failure(failure, cause);
        produced.add(error);
        if (cause instanceof ArtifactReaderFailure)
            cleanupCauses.set(error, cause);
        return error;
    };
    const key = createHash("sha256")
        .update(JSON.stringify(input.identity))
        .digest("hex")
        .slice(0, 32);
    const resources = input.resources ?? new ArtifactResourceScope();
    const owner = { runId: input.runId, processId: process.pid };
    if (process.platform === "win32") {
        // A named pipe disappears with its last handle, so no stale pipe needs
        // recovery. A pipe that vanished between bind and owner lookup is retried.
        const pipePath = `\\\\.\\pipe\\rea-lease-${key}`;
        for (let attempt = 0; attempt < 2; attempt += 1) {
            const acquisition = await tryAcquireLease(pipePath, owner, fail, false, resources);
            if (typeof acquisition !== "string")
                return acquisition;
        }
        throw fail({ kind: "unrecoverable" });
    }
    await ensureLeaseDirectory(input.directory, fail, produced, input.resources);
    const socketPath = join(input.directory, `${key}.sock`);
    const acquisition = await tryAcquireLease(socketPath, owner, fail, true, resources);
    if (typeof acquisition !== "string")
        return acquisition;
    // Serialize stale cleanup through the replacement bind: otherwise two
    // recoverers can unlink the socket that one of them has just acquired.
    const recoveryPath = `${socketPath}.recovery`;
    await reserveRecovery(recoveryPath, fail);
    const recoveryOwner = {
        kind: "lease",
        resource: recoveryPath,
        lease: { release: () => rmdir(recoveryPath) },
    };
    let recovered;
    let primary;
    let failed = false;
    try {
        recovered = await tryAcquireLease(socketPath, owner, fail, true, resources);
        if (recovered === "stale")
            await rm(socketPath, { force: true });
        if (typeof recovered === "string")
            recovered = await tryAcquireLease(socketPath, owner, fail, true, resources);
        if (typeof recovered === "string")
            throw fail({ kind: "unrecoverable" });
    }
    catch (cause) {
        failed = true;
        primary = cause;
    }
    const directoryCleanup = await resources.release(recoveryOwner);
    if (directoryCleanup.kind === "failed") {
        const failures = [directoryCleanup];
        if (typeof recovered !== "string" && recovered?.acquired) {
            const socketCleanup = await resources.release({
                kind: "lease",
                resource: recovered.lease.socketPath ?? socketPath,
                lease: recovered.lease,
            });
            if (socketCleanup.kind === "failed")
                failures.push(socketCleanup);
        }
        const outcome = failed
            ? primary
            : fail({ kind: "recovery_remove", path: recoveryPath }, directoryCleanup.cause);
        throw fail({ kind: "recovery_remove", path: recoveryPath }, new OwnedLeaseCleanupFailure(outcome, resources.cleanupFailure({
            kind: "failed",
            cause: outcome instanceof Error
                ? (cleanupCauses.get(outcome) ?? outcome)
                : outcome,
        }, [failures[0], ...failures.slice(1)])));
    }
    if (failed)
        throw primary;
    if (typeof recovered !== "string" && recovered !== undefined)
        return recovered;
    throw fail({ kind: "unrecoverable" });
};
const reserveRecovery = async (recoveryPath, fail) => {
    try {
        await mkdir(recoveryPath, { mode: 0o700 });
    }
    catch (cause) {
        const busy = typeof cause === "object" &&
            cause !== null &&
            Reflect.get(cause, "code") === "EEXIST";
        throw fail(busy
            ? { kind: "recovery_busy", path: recoveryPath }
            : { kind: "recovery_create", path: recoveryPath }, cause);
    }
};
const tryAcquireLease = async (socketPath, owner, fail, securePath, resources) => {
    const connections = new Set();
    const server = createServer((socket) => {
        connections.add(socket);
        socket.once("close", () => connections.delete(socket));
        // A failed owner reply ends only this connection, not the lease owner.
        socket.on("error", () => socket.destroy());
        sendOwner(socket, owner);
    });
    // The lease lives exactly as long as its owning process. A lease retained
    // after unconfirmed cleanup must not keep a completed one-shot command
    // alive; process exit leaves a stale socket that later acquirers recover.
    server.unref();
    if (!(await bind(server, socketPath))) {
        const existingOwner = await readOwner(socketPath, fail);
        return typeof existingOwner === "string"
            ? existingOwner
            : { acquired: false, owner: existingOwner };
    }
    let released = false;
    const lease = {
        socketPath,
        release: async () => {
            if (released)
                return;
            // Owner replies do not require peers to close their writable half. End
            // every accepted connection before awaiting the listening server.
            for (const socket of connections)
                socket.destroy();
            // Node removes the bound socket; never unlink a later owner's socket.
            await closeServer(server);
            released = true;
        },
    };
    if (securePath)
        try {
            await chmod(socketPath, 0o600);
        }
        catch (cause) {
            const primary = fail({ kind: "socket_permissions" }, cause);
            const cleanup = await resources.release({
                kind: "lease",
                resource: socketPath,
                lease,
            });
            if (cleanup.kind === "failed")
                throw fail({ kind: "socket_permissions" }, new OwnedLeaseCleanupFailure(primary, resources.cleanupFailure({ kind: "failed", cause: primary }, [
                    cleanup,
                ])));
            throw primary;
        }
    return { acquired: true, lease };
};
const ensureLeaseDirectory = async (directory, fail, produced, resources) => {
    try {
        await mkdir(directory, { recursive: true, mode: 0o700 });
    }
    catch (cause) {
        throw fail({ kind: "directory_create" }, cause);
    }
    const inspectionFailure = (cause) => {
        if (cause instanceof Error && produced.has(cause))
            return cause;
        const accessDenied = process.getuid !== undefined &&
            cause instanceof Error &&
            "code" in cause &&
            cause.code === "EACCES";
        return fail(accessDenied
            ? { kind: "directory_access_denied", directory }
            : { kind: "directory_inspect" }, cause);
    };
    // Use O_DIRECTORY|O_NOFOLLOW to open the directory without following symlinks,
    // then inspect and secure that descriptor. Later socket operations still use
    // the path and are not made atomic by this directory validation.
    try {
        const handle = await open(directory, fsConstants.O_RDONLY |
            (fsConstants.O_DIRECTORY ?? 0) |
            (fsConstants.O_NOFOLLOW ?? 0));
        await withArtifactFileHandle(directory, handle, resources, undefined, async (handle) => {
            try {
                const directoryStat = await handle.stat();
                if (directoryStat.isSymbolicLink() ||
                    directoryStat.isDirectory() === false ||
                    (process.getuid !== undefined &&
                        directoryStat.uid !== process.getuid()))
                    throw fail({ kind: "directory_not_private" });
                // POSIX permission hardening: chmod on the already-opened descriptor avoids
                // a second TOCTOU window where the directory could be swapped between check
                // and permission fix.
                const posixPermissionsApply = process.getuid !== undefined;
                if (posixPermissionsApply && (directoryStat.mode & 0o077) !== 0) {
                    await handle.chmod(0o700);
                    // Re-verify permissions on the same opened directory.
                    const afterChmod = await handle.stat();
                    if (afterChmod.isSymbolicLink() ||
                        afterChmod.isDirectory() === false ||
                        (afterChmod.mode & 0o077) !== 0)
                        throw fail({ kind: "directory_permissions" });
                }
            }
            catch (cause) {
                throw inspectionFailure(cause);
            }
        });
    }
    catch (cause) {
        if (cause instanceof ArtifactFileCleanupFailure)
            throw fail({ kind: "directory_close" }, cause);
        throw inspectionFailure(cause);
    }
};
const bind = (server, socketPath) => new Promise((resolveBind, reject) => {
    const onError = (error) => {
        server.removeListener("listening", onListening);
        if (error.code === "EADDRINUSE")
            resolveBind(false);
        else
            reject(error);
    };
    const onListening = () => {
        server.removeListener("error", onError);
        resolveBind(true);
    };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(socketPath);
});
const sendOwner = (socket, owner) => {
    socket.end(`${JSON.stringify(owner)}\n`);
};
const readOwner = (socketPath, fail) => new Promise((resolveOwner, rejectOwner) => {
    const socket = createConnection(socketPath);
    socket.setEncoding("utf8");
    let response = "";
    let settled = false;
    const reject = (reason, cause) => {
        if (settled)
            return;
        settled = true;
        clearTimeout(timer);
        socket.destroy();
        rejectOwner(fail({ kind: "owner_unverified", reason }, cause));
    };
    const timer = setTimeout(() => reject("owner response timed out"), 250);
    const finish = (owner) => {
        if (settled)
            return;
        settled = true;
        clearTimeout(timer);
        socket.destroy();
        resolveOwner(owner);
    };
    socket.on("data", (chunk) => {
        response += chunk;
        const newline = response.indexOf("\n");
        if (newline < 0)
            return;
        const parsed = safeParseJson(response.slice(0, newline));
        if (!parsed.ok) {
            reject("malformed owner response");
            return;
        }
        const value = parsed.value;
        const runId = typeof value === "object" && value !== null
            ? Reflect.get(value, "runId")
            : undefined;
        const processId = typeof value === "object" && value !== null
            ? Reflect.get(value, "processId")
            : undefined;
        if (typeof runId === "string" &&
            runId.length > 0 &&
            typeof processId === "number" &&
            Number.isSafeInteger(processId) &&
            processId > 0)
            finish({ runId, processId });
        else
            reject("invalid owner identity");
    });
    socket.on("error", (cause) => {
        if (cause.code === "ENOENT")
            finish("missing");
        else if (cause.code === "ECONNREFUSED")
            finish("stale");
        else
            reject(cause.code ?? "owner connection failed", cause);
    });
    socket.on("end", () => reject("owner closed without a complete response"));
});
const closeServer = (server) => new Promise((resolveClose, reject) => {
    if (!server.listening) {
        resolveClose();
        return;
    }
    server.close((error) => (error ? reject(error) : resolveClose()));
});
