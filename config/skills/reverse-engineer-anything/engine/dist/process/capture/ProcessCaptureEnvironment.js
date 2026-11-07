import { mergeEnvironmentOverrides, snapshotEnvironment, } from "../snapshotEnvironment.js";
/** Build the child environment from the host plus caller-selected overrides. */
export const makeProcessCaptureEnvironment = (options) => {
    const platform = options.platform ?? process.platform;
    const environment = snapshotEnvironment(mergeEnvironmentOverrides(options.hostEnvironment, options.scenario.environment, platform), platform);
    return {
        ...Object.fromEntries(Object.entries(environment).filter((entry) => entry[1] !== undefined)),
        TERM: environment.TERM ?? "xterm-256color",
        REA_PROCESS_RUN_ID: options.runId,
    };
};
