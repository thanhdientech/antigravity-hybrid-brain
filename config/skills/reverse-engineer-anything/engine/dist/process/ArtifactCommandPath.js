import { ProviderAdapterError } from "../domain/providerAdapterError.js";
import { realpath } from "node:fs/promises";
import { artifactSelectedPathErrno, assertArtifactReadActive, } from "../artifacts/ArtifactFileOperation.js";
import { AnalysisAccessDeniedError, AnalysisArtifactChangedError, } from "../domain/analysisErrorCore.js";
/** Resolve identity without changing the caller's absolute executable selection. */
export const selectArtifactCommandPath = async (invocationPath, signal) => {
    assertArtifactReadActive(signal);
    const resolvedPath = await realpath(invocationPath);
    assertArtifactReadActive(signal);
    return Object.freeze({ invocationPath, resolvedPath });
};
/** An invocation must still select the admitted physical executable. */
export const assertArtifactCommandPath = async (selected, operation, options = {}) => {
    assertArtifactReadActive(options.signal);
    const changed = (cause) => new AnalysisArtifactChangedError(operation, selected.invocationPath, "Selected command no longer resolves to its admitted executable.", {
        cause,
        ...(options.capturedOutput === undefined
            ? {}
            : { capturedOutput: options.capturedOutput }),
    });
    let current;
    try {
        current = await realpath(selected.invocationPath);
    }
    catch (cause) {
        if (artifactSelectedPathErrno(cause) !== undefined)
            throw changed(cause);
        const systemCode = cause instanceof Error && "code" in cause
            ? String(cause.code)
            : undefined;
        const failureOptions = { cause, capturedOutput: options.capturedOutput };
        if (systemCode === "EACCES" || systemCode === "EPERM")
            throw new AnalysisAccessDeniedError(operation, selected.invocationPath, systemCode, failureOptions);
        throw new ProviderAdapterError("rea", operation, {
            ...failureOptions,
            diagnostics: {
                path: selected.invocationPath,
                reason: cause instanceof Error ? cause.message : String(cause),
                system_code: systemCode ?? null,
            },
        });
    }
    if (current !== selected.resolvedPath)
        throw changed();
    assertArtifactReadActive(options.signal);
};
