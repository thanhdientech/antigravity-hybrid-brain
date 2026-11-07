import { inspectApkSignatureInputSchema } from "../../domain/apkSignature/apkSignatureQuery.js";
import { requireAnalysisViewRetention, projectRetainedAnalysis, } from "../analysisView/AnalysisViewService.js";
import { isAbsolute } from "node:path";
import { AnalysisInputError, AnalysisOutputError, } from "../../domain/analysisErrorCore.js";
import { apkSignatureMatchesSubject, apkSignatureResultSchema, } from "../../domain/apkSignature/apkSignatureReport.js";
import { createEvidence } from "../../domain/evidence.js";
import { err } from "../../domain/result.js";
import { completeProviderEvidence } from "../ProviderOperationExecution.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
const OPERATION = "inspect_apk_signature";
/** Shared artifact validation and typed inline Evidence for CLI/MCP. */
export class ApkSignatureService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    close() {
        return this.provider.close();
    }
    /** Preserve exact selected artifact identity and the decoded signing facts. */
    async inspect(rawInput, options, retention = {
        evidenceById: undefined,
        recordEvidence: undefined,
    }) {
        const input = parseAnalysisInput(OPERATION, rawInput, inspectApkSignatureInputSchema, options?.signal);
        if (!input.ok)
            return input;
        if (!isAbsolute(input.value.path))
            return err(new AnalysisInputError(OPERATION, undefined, [
                {
                    path: ["path"],
                    reason: "invalid_format",
                    message: "Expected an absolute filesystem path on this host.",
                },
            ]));
        const { detail, view, ...parameters } = input.value;
        if (detail === "summary") {
            const ready = requireAnalysisViewRetention(OPERATION, retention);
            if (!ready.ok)
                return ready;
        }
        const inspected = await this.provider.inspect(parameters, options);
        if (!inspected.ok)
            return inspected;
        const execution = inspected.value;
        const report = apkSignatureResultSchema.safeParse(execution.result);
        if (!report.success ||
            report.data.artifact.path !== input.value.path ||
            execution.subject.path !== input.value.path ||
            !apkSignatureMatchesSubject(report.data.artifact, execution.subject))
            return err(new AnalysisOutputError(OPERATION, "APK signature reader returned malformed data or changed the selected artifact identity."));
        const completed = completeProviderEvidence(createEvidence(execution.subject, execution.provider, {
            operation: OPERATION,
            parameters: { path: input.value.path },
            result: report.data,
            ...(execution.rawResult === null
                ? {}
                : { rawResult: execution.rawResult }),
            confidence: "observed",
            locations: execution.locations,
            limitations: execution.limitations,
        }), options?.signal);
        if (!completed.ok)
            return completed;
        return detail === "summary"
            ? projectRetainedAnalysis(completed.value, retention, view === undefined
                ? { kind: "summary" }
                : { kind: "apk-signature", ...view })
            : completed;
    }
}
