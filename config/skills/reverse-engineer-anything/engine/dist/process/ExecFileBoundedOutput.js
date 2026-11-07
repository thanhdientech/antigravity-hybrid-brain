import { spawn } from "node:child_process";
import { BoundedOutputExcerpt } from "./BoundedOutputExcerpt.js";
/** Drain both streams while retaining bounded head and tail evidence. */
export const execFileBoundedOutput = (executable, args, options) => new Promise((resolve) => {
    const child = spawn(executable, [...args], {
        env: options.env,
        stdio: ["ignore", "pipe", "pipe"],
    });
    const stdout = new BoundedOutputExcerpt(options.limit);
    const stderr = new BoundedOutputExcerpt(options.limit);
    child.stdout.on("data", (chunk) => stdout.append(chunk));
    child.stderr.on("data", (chunk) => stderr.append(chunk));
    let spawnError;
    child.on("error", (error) => {
        spawnError = error;
    });
    child.on("close", (code, signal) => {
        resolve({
            exitCode: spawnError?.code ?? code ?? signal,
            stdout: stdout.text,
            stderr: stderr.text,
            outputTruncated: stdout.truncated || stderr.truncated,
        });
    });
});
