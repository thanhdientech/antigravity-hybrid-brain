import { parseAnalysisInput } from "./AnalysisInput.js";
import { z } from "zod";
import { reconstructionCoverageEvaluationInputSchema } from "../domain/reconstructionCoverageInput.js";
import { evaluateParsedReconstructionClosure, readReconstructionCoverageData, } from "../domain/reconstructionCoverage.js";
const OPERATION = "evaluate_reconstruction_coverage";
const requestEnvelopeSchema = reconstructionCoverageEvaluationInputSchema.extend({
    coverage: z.unknown(),
});
/** Evaluate inline reconstruction coverage against a named boundary. */
export const evaluateReconstructionCoverage = (rawInput, nowEpochMs = Date.now()) => {
    const parsed = parseAnalysisInput(OPERATION, rawInput, requestEnvelopeSchema);
    if (!parsed.ok)
        return parsed;
    const coverage = readReconstructionCoverageData(parsed.value.coverage, [
        "coverage",
    ]);
    if (!coverage.ok)
        return coverage;
    return evaluateParsedReconstructionClosure(coverage.value, parsed.value.boundary_id, nowEpochMs);
};
