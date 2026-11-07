/** Close admission for one owned file handle. `code` is the stable identity. */
export class OwnedFileHandleError extends Error {
    code;
    _tag = "OwnedFileHandleError";
    constructor(code) {
        super(code);
        this.code = code;
        this.name = "OwnedFileHandleError";
    }
}
/** One file handle whose close result must remain truthful across retries. */
export class OwnedFileHandle {
    handle;
    #state = { kind: "open" };
    constructor(handle) {
        this.handle = handle;
    }
    /** Close the owned handle, retaining an unconfirmed close as a sticky failure. */
    close() {
        if (this.#state.kind === "closed")
            return Promise.resolve();
        if (this.#state.kind === "closing")
            return this.#state.attempt;
        if (this.#state.kind === "failed")
            return Promise.reject(this.#state.cause);
        if (this.handle.fd < 0) {
            const cause = new OwnedFileHandleError("handle_invalidated");
            this.#state = { kind: "failed", cause };
            return Promise.reject(cause);
        }
        const attempt = Promise.resolve().then(() => this.#attemptClose());
        this.#state = { kind: "closing", attempt };
        return attempt;
    }
    async #attemptClose() {
        try {
            await this.handle.close();
            this.#state = { kind: "closed" };
        }
        catch (cause) {
            this.#state =
                this.handle.fd < 0 ? { kind: "failed", cause } : { kind: "open" };
            throw cause;
        }
    }
}
