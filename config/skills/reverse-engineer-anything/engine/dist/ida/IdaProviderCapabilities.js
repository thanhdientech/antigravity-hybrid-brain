import { IDA_PROVIDER_IDENTITY, IDA_OPERATIONS, } from "./IdaProviderMetadata.js";
import { REGEX_MATCHING_LIMITATION } from "../process/RegexMatcher.js";
/** Operations only the modern headless profile implements. */
const HEADLESS_ONLY_OPERATIONS = new Set([
    "resolve_containing_procedure",
]);
/** Whether the configured profile admits an operation. */
const idaProfileAdmits = (operation, profile) => profile.mode === "headless" || !HEADLESS_ONLY_OPERATIONS.has(operation);
/** One admission policy shared by catalog projection and live execution. */
export const idaOperationUnavailableReason = (operation, profile) => {
    if (!idaProfileAdmits(operation, profile))
        return "This operation is available for the modern headless profile only.";
    if (operation === "procedure_callers" && profile.protocol !== "legacy")
        return profile.protocol === "native"
            ? "The native upstream profile reports code references without proving direct call edges."
            : "The modern upstream profile reports code references without proving direct call edges.";
    return undefined;
};
/** Shared limitations of observations from an externally mutable analysis database. */
export const IDA_LIMITATIONS = Object.freeze([
    "Provider version identifies the REA IDA adapter. IDA engine and upstream distribution versions are unknown unless separately observed; MCP serverInfo is reported independently.",
    "Results describe the current IDA analysis database. Input identity does not prove an unmodified database; patches, annotations, analysis completeness, and database revision remain unknown.",
    "Live results are never replayed from analysis snapshots. Target checks before and after a request do not provide an atomic lock against external GUI changes.",
    "Caller cancellation drains the in-flight MCP request before cleanup; it does not prove that IDA engine work was interrupted.",
    "Headless workers are released through the upstream database lifecycle. Abrupt termination of REA, its proxy, or the supervisor cannot prove worker cleanup; inspect upstream inventory after an interrupted process.",
    "Complete function body ranges, typed references, unresolved indirect calls, referenced data, and basic blocks are unavailable in this adapter. Empty unsupported dossier facets are unknown, not observed absence.",
]);
export const IDA_NATIVE_STRING_LIMITATION = "Native string observations use upstream C-string rendering; other string representations remain unknown.";
/**
 * The legacy attached profile uses `disassemble_function`, which
 * jumps to the function and whose `decompile_function` opens or reuses a
 * pseudocode view whenever an IDA window is active.
 */
const ATTACHED_GUI_NAVIGATION_OPERATIONS = new Set([
    "procedure_pseudo_code",
    "procedure_assembly",
    "read_function_instructions",
    "analyze_function",
]);
/** Advertise live observations and configured lifecycle effects truthfully. */
export const idaCapabilities = (profile, stdio, regexLimitation = REGEX_MATCHING_LIMITATION) => IDA_OPERATIONS.filter((operation) => idaProfileAdmits(operation, profile)).map((operation) => {
    const reason = idaOperationUnavailableReason(operation, profile);
    return {
        provider: IDA_PROVIDER_IDENTITY,
        operation,
        ...(reason === undefined
            ? { available: true, reason: null }
            : { available: false, reason }),
        cachePolicy: "live",
        effects: {
            mutatesArtifact: false,
            launchesProcess: stdio || profile.mode === "headless",
            mayShowUi: profile.mode === "attached" &&
                (profile.protocol === "native"
                    ? operation === "procedure_pseudo_code" ||
                        operation === "analyze_function"
                    : ATTACHED_GUI_NAVIGATION_OPERATIONS.has(operation)),
            mayAccessNetwork: true,
            mayWriteFilesystem: stdio || profile.mode === "headless",
            changesPermissions: false,
            requiresRoot: false,
        },
        limitations: [
            ...IDA_LIMITATIONS,
            ...(profile.protocol === "native" &&
                (operation === "list_strings" || operation === "search_strings")
                ? [IDA_NATIVE_STRING_LIMITATION]
                : []),
            ...(operation === "search_procedures" || operation === "search_strings"
                ? [regexLimitation]
                : []),
        ],
    };
});
