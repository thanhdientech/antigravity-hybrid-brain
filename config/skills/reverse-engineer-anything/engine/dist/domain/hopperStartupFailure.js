import { MAX_NODE_TIMER_DELAY_MS } from "./analysisResourceLimits.js";
/** Environment setting that widens the Linux demo-dialog watch. */
export const HOPPER_DEMO_DIALOG_TIMEOUT_SETTING = "REA_HOPPER_DEMO_DIALOG_TIMEOUT_MS";
/** Watch used when the setting is unset. */
export const DEFAULT_HOPPER_DEMO_DIALOG_TIMEOUT_MS = 10_000;
/** Smallest accepted dialog watch. Zero is not a deadline. */
export const MINIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS = 1;
/**
 * Largest accepted dialog watch. Delays above this signed 32-bit bound are
 * the same ceiling REA uses for its other millisecond settings.
 */
export const MAXIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS = MAX_NODE_TIMER_DELAY_MS;
/** Public recovery for a rejected REA_HOPPER_DEMO_DIALOG_TIMEOUT_MS value. */
export const invalidDialogTimeoutMessage = (setting) => {
    const current = setting === undefined
        ? "was rejected"
        : `is ${JSON.stringify(setting.value)} ms`;
    const floor = String(MINIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS);
    const maximum = String(MAXIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS);
    const source = setting?.source ?? "setting";
    return [
        `The effective ${HOPPER_DEMO_DIALOG_TIMEOUT_SETTING} value ${current} (source ${source}; default ${String(DEFAULT_HOPPER_DEMO_DIALOG_TIMEOUT_MS)} ms, floor ${floor} ms, maximum ${maximum} ms).`,
        `Set ${HOPPER_DEMO_DIALOG_TIMEOUT_SETTING} in the environment that starts REA to a positive decimal integer from ${floor} to ${maximum}, then restart REA.`,
    ].join(" ");
};
const failures = [
    [
        70,
        "private_display_unavailable",
        "REA could not start its private Linux display. Install Xvfb, then rerun rea doctor.",
    ],
    [
        71,
        "x11_authorization_failed",
        "REA could not authorize its private Linux display. Install xauth, then rerun rea doctor.",
    ],
    [
        72,
        "unsupported_hopper_build",
        "This Hopper build is not supported for unattended Linux analysis. Unset HOPPER_LAUNCHER_PATH and rerun rea setup --yes --install-hopper, or update REA.",
    ],
    [
        73,
        "invalid_launch_command",
        "REA refused an unexpected Hopper launch command. Check HOPPER_LAUNCHER_PATH and rerun rea doctor.",
    ],
    [
        74,
        "process_ownership_mismatch",
        "REA could not verify ownership of the launched Hopper process and stopped safely. Close other Hopper sessions and retry.",
    ],
    [
        75,
        "hopper_exited_during_startup",
        "Hopper exited before the REA bridge was ready. In CI, run rea doctor --provider hopper --json; if Hopper showed a UI or license prompt, complete it in the runner user session, otherwise close stale Hopper sessions and retry.",
    ],
    [
        76,
        "unsupported_demo_dialog",
        "This Hopper demo dialog is not supported for unattended Linux analysis. Update REA or use a supported Hopper build.",
    ],
    [
        77,
        "unexpected_display_geometry",
        "REA's private Linux display did not match the validated layout. Close custom display overrides and retry.",
    ],
    [
        78,
        "x11_input_failed",
        "REA could not activate Hopper's validated demo control. Install the XTEST runtime, then rerun rea doctor.",
    ],
    [
        79,
        "runtime_dependency_unavailable",
        "A Linux demo-session dependency is unavailable. Rerun rea setup --yes --install-hopper, then rea doctor.",
    ],
    [
        80,
        "x11_socket_directory_unusable",
        "REA cannot use the host X11 socket directory for a private display. Run rea doctor --provider hopper for exact mount and namespace diagnostics.",
    ],
    [
        81,
        "demo_dialog_absent",
        "Hopper passed launcher authentication but did not present a registration dialog within the wait window. If this host is slow, raise REA_HOPPER_DEMO_DIALOG_TIMEOUT_MS and retry; otherwise complete Hopper setup or close stale sessions and retry.",
    ],
    [82, "invalid_dialog_timeout", invalidDialogTimeoutMessage()],
];
const HOPPER_STARTUP_FAILURES = new Map(failures.map(([exitCode, code, message]) => [exitCode, { code, message }]));
/** Return the stable public failure associated with a Linux demo adapter exit. */
export const hopperStartupFailure = (exitCode) => exitCode === null ? undefined : HOPPER_STARTUP_FAILURES.get(exitCode);
/** Return the adapter exit associated with one stable startup failure code. */
export const hopperStartupExitCode = (code) => failures.find(([, candidate]) => candidate === code)?.[0];
const isDialogTimeoutRejection = (value) => {
    if (typeof value !== "object" || value === null)
        return false;
    const setting = Reflect.get(value, "setting");
    const shown = Reflect.get(value, "value");
    const source = Reflect.get(value, "source");
    return (setting === HOPPER_DEMO_DIALOG_TIMEOUT_SETTING &&
        typeof shown === "string" &&
        shown.length <= 128 &&
        source === "setting" &&
        Reflect.get(value, "minimum_ms") ===
            MINIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS &&
        Reflect.get(value, "maximum_ms") ===
            MAXIMUM_HOPPER_DEMO_DIALOG_TIMEOUT_MS &&
        Reflect.get(value, "default_ms") === DEFAULT_HOPPER_DEMO_DIALOG_TIMEOUT_MS);
};
/**
 * Read a validated dialog-timeout rejection carried beside the diagnostic.
 * The field stays off the static diagnostic type so an absent rejection is
 * not an undefined JSON value.
 */
export const dialogTimeoutFromDiagnostic = (diagnostic) => {
    if (diagnostic?.status !== "error")
        return undefined;
    const value = Reflect.get(diagnostic, "dialog_timeout");
    return isDialogTimeoutRejection(value) ? value : undefined;
};
/** Narrow an untrusted diagnostic field to the public startup code union. */
export const isHopperStartupFailureCode = (value) => failures.some(([, candidate]) => candidate === value);
