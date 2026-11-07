import { requireAuthenticationHeadroom } from "../JsonAuthenticationHeadroom.js";
import { authenticateEvidenceBundleValue } from "../EvidenceBundleFiles.js";
import { AnalysisCancelledError, AnalysisInputError, } from "../../domain/analysisErrorCore.js";
import { INSPECT_ANALYSIS_VIEW_OPERATION } from "../../domain/analysisView/analysisViewErrors.js";
import { err, ok } from "../../domain/result.js";
import { safeParseImmutableEvidence } from "../../domain/evidenceValidation.js";
import { EvidenceFileError } from "../../domain/evidenceErrors.js";
import { projectInputIssues } from "../../domain/inputIssueProjection.js";
import { readJsonFile } from "../JsonFiles.js";
const ANALYSIS_VIEW_SOURCE = {
    operation: INSPECT_ANALYSIS_VIEW_OPERATION,
    path: ["source"],
};
const selectionError = (site, message) => new AnalysisInputError(site.operation, { userMessage: message }, [
    {
        path: [...site.path, "evidence_id"],
        reason: "invalid_value",
        message,
    },
]);
/** Listed identities stay bounded so a large bundle cannot grow the error itself. */
const RECORD_REFERENCE_PREVIEW_BYTES = 2048;
/** Select the one record a source names from an authenticated bundle. */
const selectBundleRecord = (records, path, evidenceId, site) => {
    if (evidenceId !== undefined) {
        const selected = records.find((record) => record.evidence_id === evidenceId);
        return selected === undefined
            ? err(selectionError(site, `Evidence bundle ${path} holds no record ${evidenceId}. It holds ${listRecordIds(records)}.`))
            : ok(selected);
    }
    const only = records[0];
    if (only === undefined)
        return err(selectionError(site, `Evidence bundle ${path} holds no records.`));
    if (records.length > 1)
        return err(selectionError(site, `Evidence bundle ${path} holds ${String(records.length)} records; select one with ${[...site.path, "evidence_id"].join(".")}. It holds ${listRecordIds(records)}.`));
    return ok(only);
};
const listRecordIds = (records) => {
    const labels = [];
    let bytes = 0;
    for (const record of records) {
        const separator = labels.length === 0 ? "" : ", ";
        const remaining = RECORD_REFERENCE_PREVIEW_BYTES - bytes;
        let label = `${record.evidence_id} (operation omitted)`;
        // UTF-8/JSON cannot use fewer bytes than the source UTF-16 code units.
        // Reject a label before copying it when even that lower bound cannot fit.
        if (record.operation.length <= remaining) {
            const complete = `${record.evidence_id} (${record.operation})`;
            if (Buffer.byteLength(JSON.stringify(separator + complete), "utf8") <=
                remaining)
                label = complete;
        }
        const encodedBytes = Buffer.byteLength(JSON.stringify(separator + label), "utf8");
        if (encodedBytes > remaining)
            break;
        labels.push(label);
        bytes += encodedBytes;
    }
    const omitted = records.length - labels.length;
    const listed = labels.join(", ");
    return omitted > 0 ? `${listed} and ${String(omitted)} more` : listed;
};
/** Read one Evidence record or select from an authenticated bundle without rereading the file. */
export const readEvidenceFileSource = async (path, options = {}, evidenceId, site = ANALYSIS_VIEW_SOURCE) => {
    const { signal, resources } = options;
    const { operation } = site;
    const resolveSelected = site.resolveSelected ?? ((selected) => ok(selected));
    if (signal?.aborted)
        return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
    const loaded = await readJsonFile(path, signal, resources, operation);
    if (!loaded.ok)
        return loaded;
    if (signal?.aborted)
        return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
    const value = loaded.value;
    if (typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.hasOwn(value, "records")) {
        const bundle = authenticateEvidenceBundleValue(value, path, {
            operation,
            immutable: true,
        });
        if (!bundle.ok)
            return bundle;
        const selected = selectBundleRecord(bundle.value.records, path, evidenceId, site);
        return selected.ok
            ? resolveSelected(selected.value, (id) => bundle.value.records.find((record) => record.evidence_id === id))
            : selected;
    }
    const headroom = requireAuthenticationHeadroom(value, {
        operation,
        path,
        description: "Insufficient heap headroom to authenticate the Evidence file",
    });
    if (!headroom.ok)
        return headroom;
    const parsed = safeParseImmutableEvidence(value);
    if (!parsed.ok)
        return err(new EvidenceFileError("read", "wrong-kind", {
            path,
            cause: parsed.error,
            contentIssues: projectInputIssues(parsed.error.issues, value),
            userMessage: "The selected file does not contain valid Evidence. Repair or recreate the file and try again.",
        }));
    if (evidenceId !== undefined && parsed.value.evidence_id !== evidenceId)
        return err(selectionError(site, `Evidence file ${path} holds ${parsed.value.evidence_id}, not selected record ${evidenceId}.`));
    return resolveSelected(parsed.value, (id) => parsed.value.evidence_id === id ? parsed.value : undefined);
};
