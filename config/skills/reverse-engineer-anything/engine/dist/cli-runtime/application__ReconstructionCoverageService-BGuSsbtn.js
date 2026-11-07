import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_AnalysisInput, parseAnalysisInput } from "./AnalysisInput-6AZYEmRT.js";
import { evaluateParsedReconstructionClosure, init_reconstructionCoverage, init_reconstructionCoverageInput, readReconstructionCoverageData, reconstructionCoverageEvaluationInputSchema } from "./reconstructionCoverageInput-BH0IYVTi.js";
import { z } from "zod";

//#region dist/application/ReconstructionCoverageService.js
var OPERATION, requestEnvelopeSchema, evaluateReconstructionCoverage;
function init_ReconstructionCoverageService() {
	return (init_ReconstructionCoverageService = __esmMin((() => {
		init_AnalysisInput();
		init_reconstructionCoverageInput();
		init_reconstructionCoverage();
		OPERATION = "evaluate_reconstruction_coverage";
		requestEnvelopeSchema = reconstructionCoverageEvaluationInputSchema.extend({ coverage: z.unknown() });
		evaluateReconstructionCoverage = (rawInput, nowEpochMs = Date.now()) => {
			const parsed = parseAnalysisInput(OPERATION, rawInput, requestEnvelopeSchema);
			if (!parsed.ok) return parsed;
			const coverage = readReconstructionCoverageData(parsed.value.coverage, ["coverage"]);
			if (!coverage.ok) return coverage;
			return evaluateParsedReconstructionClosure(coverage.value, parsed.value.boundary_id, nowEpochMs);
		};
	})))();
}

//#endregion
init_ReconstructionCoverageService();
export { evaluateReconstructionCoverage };