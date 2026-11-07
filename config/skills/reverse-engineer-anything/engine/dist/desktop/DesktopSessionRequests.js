const QUEUE_PAUSE = 16;
const QUEUE_RESUME = 4;
/**
 * `stop` ends the session. An empty line, `checkpoint` or `checkpoint <name>`
 * requests a checkpoint; any other line names one.
 */
export const parseSessionRequest = (line) => {
    const text = line.trim();
    if (text === "stop")
        return { kind: "stop" };
    const name = text.replace(/^checkpoint(?:\s+|$)/u, "");
    return { kind: "checkpoint", name: name.length === 0 ? undefined : name };
};
/**
 * Requests read line by line. The end of input counts as `stop`, so a driver
 * must keep its input open between checkpoints. Reading pauses while many
 * requests are queued, so a fast driver cannot grow the queue without bound.
 */
export class SessionRequestQueue {
    lines;
    #requests = [];
    #paused = false;
    constructor(lines) {
        this.lines = lines;
        lines.on("line", (line) => {
            this.#requests.push(parseSessionRequest(line));
            if (!this.#paused && this.#requests.length >= QUEUE_PAUSE) {
                this.#paused = true;
                lines.pause();
            }
        });
        lines.once("close", () => {
            this.#requests.push({ kind: "stop" });
        });
    }
    next() {
        const request = this.#requests.shift();
        if (this.#paused && this.#requests.length <= QUEUE_RESUME) {
            this.#paused = false;
            this.lines.resume();
        }
        return request;
    }
    close() {
        this.lines.close();
    }
}
