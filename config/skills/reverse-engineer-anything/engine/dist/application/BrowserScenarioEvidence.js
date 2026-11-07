import { digestCanonicalValue } from "../domain/canonicalDigest.js";
import { createEvidence, } from "../domain/evidence.js";
import { jsonObjectSchema } from "../domain/jsonValue.js";
/** A step as Evidence records it: a request step leaves out an empty `save`, so a scenario that saves nothing records and hashes as it did before saved values existed. */
const recordedAction = (action) => {
    if (action.action !== "request" || action.save.length > 0)
        return action;
    const { save, ...rest } = action;
    return rest;
};
const browserScenarioParameters = (scenario) => {
    const recorded = {
        ...scenario,
        actions: scenario.actions.map(recordedAction),
    };
    return {
        ...jsonObjectSchema.parse(recorded),
        scenario_sha256: digestCanonicalValue(recorded, "Browser scenario"),
    };
};
/** Create Evidence without retaining resolved scenario secret values. */
export const createBrowserScenarioEvidence = (scenario, capture, provider) => createEvidence(undefined, provider, {
    predicateType: "rea.browser-scenario-capture",
    operation: "capture_browser_scenario",
    parameters: browserScenarioParameters(scenario),
    result: capture,
    confidence: "observed",
    authority: "controlled-replay",
    environment: {
        id: `${capture.browser.product}@${capture.browser.version}`,
        platform: "unknown",
        architecture: "unknown",
        isolation: capture.browser.process_ownership === "provider-owned"
            ? "process"
            : "none",
    },
    limitations: [
        ...capture.limitations,
        "Browser host platform and architecture were not observed.",
    ],
});
