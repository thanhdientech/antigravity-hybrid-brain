import { readCdpExecutionContextCreated, readCdpExecutionContextDestroyed, readCdpScriptParsed, selectCdpScriptFrame, } from "./CdpScriptContextFacts.js";
import { jsonValueByteLength } from "../domain/jsonValueByteLength.js";
import { CDP_CAPTURE_SCRIPT_METADATA_LIMITS } from "./CdpCaptureEventTypes.js";
import { CdpCaptureCompleteness } from "./CdpCaptureCompleteness.js";
/** Retain script/frame metadata from passive Electron events. */
export const ingestElectronScriptEvent = (input) => {
    if (input.event.method === "Runtime.executionContextsCleared") {
        input.executionContextFrames.clear();
        return;
    }
    if (input.event.method === "Runtime.executionContextDestroyed") {
        const key = readCdpExecutionContextDestroyed(input.event.params).contextKey;
        if (key !== null)
            input.executionContextFrames.delete(key);
        return;
    }
    if (input.event.method === "Runtime.executionContextCreated") {
        retainExecutionContext(input.event, input.executionContextFrames);
        return;
    }
    if (input.event.method !== "Debugger.scriptParsed")
        return;
    const facts = readCdpScriptParsed(input.event.params);
    const scriptId = facts.scriptId;
    const rawUrl = facts.url;
    if (scriptId === undefined || scriptId === "") {
        input.completeness.exclude("scripts", "invalid_protocol_value");
        return;
    }
    if (rawUrl === undefined || rawUrl === "") {
        input.completeness.exclude("scripts", "unattributed_origin");
        return;
    }
    const contextFrame = facts.contextKey === null
        ? undefined
        : input.executionContextFrames.get(facts.contextKey);
    const attribution = selectCdpScriptFrame(facts.frameClaim, contextFrame);
    if (attribution.invalid ||
        attribution.conflicting ||
        facts.invalidHasSourceUrl)
        input.completeness.exclude("scripts", "invalid_protocol_value");
    const reportedFrame = facts.frameClaim.frameId;
    const script = {
        scriptId,
        rawUrl,
        ...facts.metadata,
        frameId: attribution.frameId,
        frameClaims: {
            ...(reportedFrame === undefined
                ? {}
                : { script_event_frame_id: reportedFrame }),
            ...(contextFrame?.frameId === undefined
                ? {}
                : { execution_context_frame_id: contextFrame.frameId }),
        },
        hasSourceUrl: facts.hasSourceUrl,
    };
    const remaining = CDP_CAPTURE_SCRIPT_METADATA_LIMITS.retainedBytes - input.retention.bytes;
    const bytes = jsonValueByteLength({ ...script }, remaining) +
        (input.scripts.length > 0 ? 1 : 0);
    if (bytes > remaining) {
        input.completeness.exclude("scripts", "resource_budget_exhausted");
        return;
    }
    input.retention.bytes += bytes;
    input.scripts.push(script);
};
const retainExecutionContext = (event, frames) => {
    const facts = readCdpExecutionContextCreated(event.params);
    if (facts.contextKey === null)
        return;
    frames.set(facts.contextKey, facts.frameClaim);
};
