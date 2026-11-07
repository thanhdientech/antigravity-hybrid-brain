import { err, ok } from "../domain/result.js";
import { cdpStringValue, recordValue } from "./CdpCaptureValues.js";
/** Admit protocol facts before either consumer applies target or URL policy. */
export const parseCdpWorkerTarget = (input) => {
    const target = recordValue(input);
    const type = cdpStringValue(target?.type);
    if (target === undefined || type === undefined || type === "")
        return err({ _tag: "InvalidWorkerTarget" });
    if (!type.includes("worker"))
        return ok({ kind: "non_worker" });
    const targetId = cdpStringValue(target.targetId);
    const url = cdpStringValue(target.url);
    const openerTargetId = cdpStringValue(target.openerId);
    const parentFrameId = cdpStringValue(target.parentFrameId);
    if (targetId === undefined ||
        targetId === "" ||
        url === undefined ||
        typeof target.attached !== "boolean" ||
        (target.openerId !== undefined &&
            (openerTargetId === undefined || openerTargetId === "")) ||
        (target.parentFrameId !== undefined &&
            (parentFrameId === undefined || parentFrameId === "")))
        return err({ _tag: "InvalidWorkerTarget" });
    return ok({
        kind: "worker",
        targetId,
        type,
        url,
        attached: target.attached,
        openerTargetId: openerTargetId ?? null,
        parentFrameId: parentFrameId ?? null,
    });
};
/** Optional CDP relationships establish ownership only when supplied. */
export const workerTargetOwnership = (relationships, selectedTargetId, frameIds) => {
    const { openerTargetId, parentFrameId } = relationships;
    if (openerTargetId === selectedTargetId ||
        (parentFrameId !== null && frameIds.has(parentFrameId)))
        return "selected";
    return openerTargetId === null && parentFrameId === null
        ? "unknown"
        : "foreign";
};
