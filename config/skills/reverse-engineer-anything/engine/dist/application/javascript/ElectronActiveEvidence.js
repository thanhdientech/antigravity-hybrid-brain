import { digestCanonicalValue } from "../../domain/canonicalDigest.js";
import { createEvidence } from "../../domain/evidence.js";
import { jsonObjectSchema } from "../../domain/jsonValue.js";
/** Commit the selected Electron experiment and its observed result. */
export const createElectronActiveEvidence = (input, result, provider, resolvedInput) => createEvidence(undefined, provider, {
    predicateType: "rea.electron-active-scenario",
    operation: "capture_electron_scenario",
    parameters: parameters(input, resolvedInput),
    result,
    confidence: "observed",
    authority: "controlled-replay",
    environment: {
        id: `${result.application.electron_version}@unknown`,
        platform: "unknown",
        architecture: "unknown",
        isolation: "none",
    },
    limitations: [
        ...result.limitations,
        "Application host platform and architecture were not observed.",
    ],
});
const parameters = (input, resolvedInput) => {
    const scenario = jsonObjectSchema.parse(input);
    return {
        ...scenario,
        scenario_sha256: digestCanonicalValue(scenario, "Electron scenario"),
        ...(resolvedInput === undefined
            ? {}
            : {
                resolved_paths: {
                    executable_path: resolvedInput.executable_path,
                    application_path: resolvedInput.application_path,
                    application_root: resolvedInput.application_root,
                },
            }),
    };
};
