/** In-memory, provider-owned intermediate facts confined to one composed task. */
export class AnalysisWorkScope {
    #entries = new Map();
    #closed = false;
    get(owner) {
        return this.#entries.get(owner);
    }
    set(owner, value) {
        if (!this.#closed)
            this.#entries.set(owner, value);
    }
    clear() {
        this.#closed = true;
        this.#entries.clear();
    }
}
