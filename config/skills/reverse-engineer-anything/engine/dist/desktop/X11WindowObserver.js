import { X11_WINDOW_PROPERTY_NAMES, parseX11ClientList, parseX11WindowProperties, } from "../domain/desktop/x11Windows.js";
import { execFileOutput, execFileOutputFailure, } from "../process/ExecFileOutput.js";
const XPROP_TIMEOUT_MS = 5_000;
const XPROP_MAX_BUFFER = 1024 * 1024;
/** Reads of a window whose class or owner pid was missing, for one set late. */
const INCOMPLETE_READS = 4;
/** `xprop` could not be started at all. */
export class XpropUnavailableError extends Error {
    command;
    constructor(command) {
        super(`${command} could not be started`);
        this.command = command;
        this.name = "XpropUnavailableError";
    }
}
/**
 * Lists the window manager's client windows with `xprop`. A window's class,
 * pid and type are read once, or a few times while either is still missing;
 * titles are re-read only for windows the caller marks as interesting, since
 * every read starts a process. Entries for closed windows are dropped.
 */
export class X11WindowObserver {
    #command;
    #environment;
    #known = new Map();
    constructor(command, environment) {
        this.#command = command;
        this.#environment = environment;
    }
    async #xprop(arguments_, signal) {
        try {
            const { stdout } = await execFileOutput(this.#command, arguments_, {
                env: this.#environment,
                timeout: XPROP_TIMEOUT_MS,
                maxBuffer: XPROP_MAX_BUFFER,
                ...(signal === undefined ? {} : { signal }),
            });
            return stdout;
        }
        catch (cause) {
            signal?.throwIfAborted();
            if (execFileOutputFailure(cause)?.code === "ENOENT")
                throw new XpropUnavailableError(this.#command);
            // A window can close between listing and reading it.
            return undefined;
        }
    }
    /** The current client list, or why it cannot be read. */
    async sample(refresh, signal) {
        const root = await this.#xprop(["-root", "-notype", "_NET_CLIENT_LIST", "_NET_SUPPORTED"], signal);
        if (root === undefined)
            return { state: "display_unreadable" };
        const ids = parseX11ClientList(root);
        if (ids === undefined)
            return { state: "no_client_list" };
        const windows = [];
        for (const id of this.#known.keys())
            if (!ids.includes(id))
                this.#known.delete(id);
        for (const id of ids) {
            const cached = this.#known.get(id);
            const incomplete = cached !== undefined &&
                (cached.properties.class === null || cached.properties.pid === null) &&
                cached.reads < INCOMPLETE_READS;
            if (cached !== undefined &&
                !incomplete &&
                !refresh({ id, ...cached.properties })) {
                windows.push({ id, ...cached.properties });
                continue;
            }
            const output = await this.#xprop(["-id", id, "-notype", ...X11_WINDOW_PROPERTY_NAMES], signal);
            if (output === undefined)
                continue;
            const properties = parseX11WindowProperties(output);
            this.#known.set(id, { properties, reads: (cached?.reads ?? 0) + 1 });
            windows.push({ id, ...properties });
        }
        return { state: "listed", windows };
    }
}
