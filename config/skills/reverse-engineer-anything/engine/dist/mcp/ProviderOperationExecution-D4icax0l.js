import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { f as init_analysisErrorCore, i as AnalysisCancelledError, s as AnalysisOutputError } from "./analysisErrorCore-BCqhUcUc.js";
import { h as isImmutableJsonSnapshot, i as jsonValueSchema, m as init_immutableJson, n as init_jsonValue, u as freezeJsonSnapshot } from "./jsonValue-CbQQraup.js";
import { n as analysisOperationInputErrorFromIssues, r as init_inputIssueProjection, t as analysisInputErrorFromIssues } from "./inputIssueProjection-rtSG7-RA.js";
import { n as init_analysisObservation, t as createAnalysisExecutionEvidence } from "./analysisObservation-CbCdIPJC.js";
import { z } from "zod";

//#region dist/application/AnalysisInput.js
var parseAnalysisInput;
function init_AnalysisInput() {
	return (init_AnalysisInput = __esmMin((() => {
		init_analysisErrorCore();
		init_inputIssueProjection();
		init_result();
		parseAnalysisInput = (operation, rawInput, schema, signal) => {
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			const input = schema.safeParse(rawInput);
			if (!input.success) return err(analysisInputErrorFromIssues(operation, input.error.issues, rawInput, { cause: input.error }));
			return ok(input.data);
		};
	})))();
}

//#endregion
//#region dist/application/ProviderOperationExecution.js
var executeProviderOperation, completeProviderEvidence, keepIncompleteObservation;
function init_ProviderOperationExecution() {
	return (init_ProviderOperationExecution = __esmMin((() => {
		init_analysisErrorCore();
		init_immutableJson();
		init_jsonValue();
		init_inputIssueProjection();
		init_result();
		init_analysisObservation();
		executeProviderOperation = async (operation, input, options, schema, provider, confidence) => {
			if (options?.signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: options.signal.reason }));
			const request = schema.safeParse({
				operation,
				input
			});
			if (!request.success) return err(analysisOperationInputErrorFromIssues(operation, request.error.issues, input, request.error));
			const executed = await provider.execute(request.data, options);
			if (!executed.ok) return executed;
			const evidence = createAnalysisExecutionEvidence(operation, request.data.input, executed.value, confidence);
			return completeProviderEvidence(evidence, options?.signal);
		};
		completeProviderEvidence = (evidence, signal, capturedOutput) => {
			if (signal?.aborted) return err(new AnalysisCancelledError(evidence.operation, {
				cause: signal.reason,
				partialObservation: evidence,
				...capturedOutput === undefined ? {} : { capturedOutput }
			}));
			return ok(evidence);
		};
		keepIncompleteObservation = (error, operation, reason) => {
			const seen = new Set();
			const judged = new Map();
			let current = error;
			while (current !== undefined && !seen.has(current)) {
				seen.add(current);
				const partial = current.partialObservation;
				if (partial !== undefined && !isImmutableJsonSnapshot(partial) && typeof partial === "object") {
					let snapshot = judged.get(partial);
					if (!judged.has(partial)) {
						const parsed = jsonValueSchema.safeParse(partial);
						snapshot = parsed.success ? freezeJsonSnapshot(parsed.data) : undefined;
						judged.set(partial, snapshot);
					}
					if (snapshot === undefined) {
						current.partialObservation = undefined;
						current.retainSecondaryFailure(new AnalysisOutputError(operation, reason));
					} else current.partialObservation = snapshot;
				}
				current = current.cleanupPrimary;
			}
			return error;
		};
	})))();
}

//#endregion
export { init_AnalysisInput as a, keepIncompleteObservation as i, executeProviderOperation as n, parseAnalysisInput as o, init_ProviderOperationExecution as r, completeProviderEvidence as t };