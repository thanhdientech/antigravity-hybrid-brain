import { readFileHandleRange } from "../filesystem/readFileHandleRange.js";
import { withArtifactRegularFile, assertArtifactReadActive, artifactSelectedPathErrno, } from "../artifacts/ArtifactFileOperation.js";
import { ArtifactReaderFailure } from "../artifacts/ArtifactReader.js";
import { hashStableRootArtifactHandle } from "../artifacts/inventory/hashStableRootArtifact.js";
/** Preserve the producer outcome when later identity validation fails. */
export class NativeMachoSourceVerificationFailure extends ArtifactReaderFailure {
    outcome;
    verificationCause;
    constructor(outcome, verificationCause) {
        super(verificationCause instanceof ArtifactReaderFailure
            ? verificationCause.reason
            : "io", verificationCause instanceof Error
            ? verificationCause.message
            : String(verificationCause), {
            cause: verificationCause,
            ...(verificationCause instanceof ArtifactReaderFailure &&
                verificationCause.cancellation !== undefined
                ? { cancellation: verificationCause.cancellation }
                : {}),
        }, verificationCause instanceof ArtifactReaderFailure
            ? verificationCause.details
            : undefined);
        this.outcome = outcome;
        this.verificationCause = verificationCause;
    }
    /** Compatibility accessor for a completed callback; failures remain in outcome. */
    get completed() {
        return this.outcome.kind === "completed" ? this.outcome.value : undefined;
    }
}
/**
 * Bind native command output and bounded slice reads to one selected target.
 * Every callback outcome is checked against the same descriptor and selected
 * path before it can escape, including returned and thrown failures.
 * The supplied scope retains the exact descriptor owner if cleanup fails.
 */
export const withNativeMachoSource = (target, resources, signal, run) => withArtifactRegularFile(target.path, resources, signal, async ({ handle, initial }) => {
    const verify = async () => {
        const digest = await hashStableRootArtifactHandle(target.path, handle, initial, signal).catch((cause) => {
            if (artifactSelectedPathErrno(cause) !== undefined)
                throw new ArtifactReaderFailure("integrity", `Active Mach-O target changed: ${target.path}`, { cause });
            throw cause;
        });
        if (digest.sha256 !== target.sha256)
            throw new ArtifactReaderFailure("integrity", `Active Mach-O target digest changed: expected ${target.sha256}, observed ${digest.sha256}`);
    };
    await verify();
    const source = {
        bytes: initial.size,
        async readSlice(sliceOffset, sliceSize, offset, length) {
            if (!Number.isSafeInteger(sliceOffset) ||
                !Number.isSafeInteger(sliceSize) ||
                !Number.isSafeInteger(offset) ||
                !Number.isSafeInteger(length) ||
                sliceOffset < 0 ||
                sliceSize < 0 ||
                offset < 0 ||
                length < 0 ||
                sliceOffset > initial.size - sliceSize ||
                offset > sliceSize - length)
                throw new ArtifactReaderFailure("format", "Mach-O read exceeds the selected slice.");
            const bytes = await readFileHandleRange(handle, sliceOffset + offset, length, () => assertArtifactReadActive(signal));
            if (bytes.byteLength !== length)
                throw new ArtifactReaderFailure("integrity", "Mach-O source changed during slice read.");
            return bytes;
        },
    };
    let outcome;
    try {
        outcome = { kind: "completed", value: await run(source) };
    }
    catch (cause) {
        outcome = { kind: "failed", cause };
    }
    try {
        await verify();
    }
    catch (cause) {
        throw new NativeMachoSourceVerificationFailure(outcome, cause);
    }
    if (outcome.kind === "failed")
        throw outcome.cause;
    return outcome.value;
});
