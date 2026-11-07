import { AnalysisOutputError } from "../domain/analysisErrorCore.js";
import { withoutEchoedPathHeader } from "./parsers/echoedPath.js";
/** Path the command received. Diagnostics echo this operand, not the selected subject. */
export const nativeCommandOperand = (capture) => capture.arguments.at(-1);
/** Recognize vtool's sole settled container-format refusal without hiding other failures. */
export const isVtoolContainerRefusal = (capture) => {
    const operandPath = nativeCommandOperand(capture);
    if (operandPath === undefined ||
        capture.tool !== "vtool" ||
        capture.exitCode !== 1 ||
        capture.signal !== null ||
        capture.stdout.trim() !== "")
        return false;
    const diagnostic = capture.stderr.trimEnd();
    const suffix = ` error: ${operandPath} file is not mach-o`;
    if (!diagnostic.endsWith(suffix))
        return false;
    const executable = diagnostic.slice(0, -suffix.length);
    return (!/[\r\n]/u.test(executable) &&
        (executable === "vtool" || executable.endsWith("/vtool")));
};
const MISSING_UUID_DIAGNOSTIC = "missing LC_UUID load command";
const dyldFailureDiagnostics = (capture, outputs) => capture.tool !== "dyld_info" ||
    capture.exitCode === null ||
    capture.exitCode === 0 ||
    capture.signal !== null
    ? []
    : outputs.flatMap((output) => withoutEchoedPathHeader(output, capture.arguments.at(-1))
        .split(/\r?\n/u)
        .map((line) => line.trim().replace(/^(?:dyld_info:\s*)/u, ""))
        .filter(Boolean));
/** Admit the observed refusal only when it is the sole settled diagnostic. */
const dyldFailureDiagnostic = (capture) => {
    const diagnostics = dyldFailureDiagnostics(capture, [
        capture.stdout,
        capture.stderr,
    ]);
    return diagnostics.length === 1 ? (diagnostics[0] ?? null) : null;
};
/** Keep missing-UUID admission limited to its observed stdout-only refusal. */
export const isMissingUuidDyldFailure = (capture) => capture.stderr.trim().length === 0 &&
    dyldFailureDiagnostic(capture) === MISSING_UUID_DIAGNOSTIC;
/** Admit the observed dSYM refusal only when no other diagnostic is present. */
export const isUnbackedTextDyldFailure = (capture) => dyldFailureDiagnostic(capture) ===
    "section '__TEXT/__text' has offset=0 but is not a zero-fill section type";
/** Reported CORE/FVMLIB refusals still require an independently matching header. */
export const parseDyldFileTypeRefusal = (capture) => {
    for (const line of dyldFailureDiagnostics(capture, [
        capture.stdout,
        capture.stderr,
    ])) {
        const fileType = /^unknown (?:mh\.)?filetype ([34])$/u.exec(line)?.[1];
        if (fileType === "3" || fileType === "4")
            return { fileType, diagnostic: line };
    }
    return null;
};
/** Complete captures come from the settled native command owner. */
export const nativeMachoCapturedOutput = (capture) => ({
    stdout: capture.stdout,
    stderr: capture.stderr,
    truncated: false,
    stdout_bytes: capture.stdoutBytes,
    stderr_bytes: capture.stderrBytes,
    exit_code: capture.exitCode,
    signal: capture.signal,
});
/** Keep the exact target diagnostic beside the incomplete collection. */
export const missingUuidLimitation = (mode) => mode === "imports"
    ? "dyld_info -imports reported 'missing LC_UUID load command'; import observations are unavailable."
    : "dyld_info -exports reported 'missing LC_UUID load command'; exports include nm symbol-table observations only.";
/** Preserve unrecognized nonzero command output as an inspection failure. */
export const unusableNativeCommandOutput = (capture) => new AnalysisOutputError("inspect_macho", `${capture.tool} did not produce a usable inspection result`, {
    capturedOutput: nativeMachoCapturedOutput(capture),
});
/** Refuse a recognized error when the independently parsed load table contradicts it. */
export const conflictingUuidCommandEvidence = (command) => new AnalysisOutputError("inspect_macho", "dyld_info reported a missing LC_UUID despite an observed LC_UUID load command", {
    capturedOutput: nativeMachoCapturedOutput(command),
});
