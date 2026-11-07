import { AnalysisOutputError } from "../../domain/analysisErrorCore.js";
import { createEvidence } from "../../domain/evidence.js";
import { inspectPeImportsInputSchema, peImportsSchema, } from "../../domain/native/peImports.js";
import { peSubjectArchitecture } from "../../domain/peMachine.js";
import { err } from "../../domain/result.js";
import { completeProviderEvidence } from "../ProviderOperationExecution.js";
import { parseAnalysisInput } from "../AnalysisInput.js";
const OPERATION = "inspect_pe_imports";
/** Shared caller validation, output parsing and Evidence provenance for CLI/MCP. */
export class PeImportsService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    close() {
        return this.provider.close?.() ?? Promise.resolve();
    }
    async inspect(rawInput, options) {
        const input = parseAnalysisInput(OPERATION, rawInput, inspectPeImportsInputSchema, options?.signal);
        if (!input.ok)
            return input;
        const result = await this.provider.inspect(input.value, options);
        if (!result.ok)
            return result;
        const report = peImportsSchema.safeParse(result.value);
        if (!report.success ||
            report.data.artifact.path !== input.value.path ||
            !validReport(report.data, input.value))
            return err(new AnalysisOutputError(OPERATION, "PE import provider returned malformed output or changed artifact identity."));
        const value = report.data;
        const architecture = peSubjectArchitecture(value.machine, value.format);
        const locations = [
            { kind: "artifact-path", path: value.artifact.path },
            ...fileRange(value.import_directory),
            ...fileRange(value.delay_import_directory),
        ];
        return completeProviderEvidence(createEvidence({
            path: value.artifact.path,
            format: "pe",
            sha256: value.artifact.sha256,
            ...(architecture === undefined ? {} : { architecture }),
        }, this.provider.identity, {
            operation: OPERATION,
            parameters: input.value,
            result: value,
            confidence: "observed",
            limitations: value.limitations,
            locations,
        }), options?.signal);
    }
}
const fileRange = (directory) => directory === null
    ? []
    : directory.locations.map(({ offset, bytes }) => ({
        kind: "file-offset-range",
        start: offset,
        end: offset + bytes,
    }));
const validReport = (report, input) => {
    const inside = ({ offset, bytes }) => offset <= report.artifact.bytes - bytes;
    const dllCount = report.imports.length + report.delay_imports.length;
    if (report.artifact.bytes > input.max_file_bytes ||
        report.coverage.examined_dlls > input.max_dlls ||
        dllCount > report.coverage.examined_dlls ||
        (report.coverage.status === "complete" &&
            (dllCount !== report.coverage.examined_dlls || report.issues.length > 0)))
        return false;
    const importCount = report.imports.reduce((count, dll) => count + dll.functions.length, 0);
    const delayImportCount = report.delay_imports.reduce((count, dll) => count + dll.functions.length, 0);
    if (importCount !== report.coverage.imports ||
        delayImportCount !== report.coverage.delay_imports ||
        importCount + delayImportCount > input.max_functions)
        return false;
    for (const directory of [
        report.import_directory,
        report.delay_import_directory,
    ]) {
        if (directory !== null &&
            (!directory.locations.every(inside) ||
                (directory.locations.length === 0 &&
                    report.coverage.status === "complete")))
            return false;
    }
    const descriptorsFit = (rows) => rows.every((row) => inside(row.location));
    return descriptorsFit(report.imports) && descriptorsFit(report.delay_imports);
};
