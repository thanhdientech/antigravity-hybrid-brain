import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_functionDossier, parseFunctionDossier } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_AnalysisInput, parseAnalysisInput } from "./AnalysisInput-6AZYEmRT.js";
import { createAnalysisExecutionEvidence, init_analysisObservation } from "./analysisObservation-DdFFqA4e.js";
import { completeProviderEvidence, init_ProviderOperationExecution } from "./ProviderOperationExecution-CkDZ2DVQ.js";
import { init_recordEvidenceSources, recordEvidenceSources, withEvidenceSources } from "./recordEvidenceSources-D5V__z6_.js";
import { init_nativeProcedureInput, nativeProcedureInputSchema } from "./nativeProcedureInput-CePpTxN6.js";
import { EvidenceLedger, init_EvidenceLedger } from "./BundleResourceSession-BfQUWW9_.js";

//#region dist/application/FunctionAnalysisEvidence.js
var executeFunctionAnalysisEvidence;
function init_FunctionAnalysisEvidence() {
	return (init_FunctionAnalysisEvidence = __esmMin((() => {
		init_AnalysisInput();
		init_nativeProcedureInput();
		init_analysisObservation();
		init_functionDossier();
		init_ProviderOperationExecution();
		init_EvidenceLedger();
		init_recordEvidenceSources();
		executeFunctionAnalysisEvidence = async (analysis, parameters, target, options) => {
			const input = parseAnalysisInput("analyze_function", parameters, nativeProcedureInputSchema, options?.signal);
			if (!input.ok) return input;
			const arguments_ = input.value;
			const execution = await analysis.execute("analyze_function", arguments_, options);
			if (!execution.ok) return execution;
			const sourceLedger = new EvidenceLedger();
			const recorded = recordEvidenceSources((source) => sourceLedger.record(source), execution.value.sourceEvidence ?? []);
			const sources = sourceLedger.recordsForAnalysis();
			if (!recorded.ok) return withEvidenceSources(recorded, sources);
			const observation = {
				...execution.value,
				sourceEvidence: sources,
				...execution.value.subject === undefined && target !== undefined ? { subject: target } : {}
			};
			const dossier = parseFunctionDossier(execution.value.result);
			if (!dossier.ok) {
				dossier.error.retainPartialObservation(createAnalysisExecutionEvidence("analyze_function", arguments_, observation, "observed"));
				return withEvidenceSources(dossier, sources);
			}
			return withEvidenceSources(completeProviderEvidence(createAnalysisExecutionEvidence("analyze_function", arguments_, {
				...observation,
				result: dossier.value
			}, "observed"), options?.signal), sources);
		};
	})))();
}

//#endregion
init_FunctionAnalysisEvidence();
export { executeFunctionAnalysisEvidence };