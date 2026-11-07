import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { EvidenceIntegrityError, err, init_analysisErrorProjection, init_evidenceErrors, init_result, ok, projectAnalysisErrorWithoutCapturedOutput } from "./jsonLines-CKG28FwL.js";
import { AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisInputError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { INSPECT_ANALYSIS_VIEW_OPERATION, analysisInputErrorFromIssues, createEvidence, init_analysisViewErrors, init_evidence, init_evidenceValidation, init_inputIssueProjection, rebindEvidenceToTargetPath, safeParseEvidence } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { immutableJsonSnapshotMember, init_immutableJson, isImmutableJsonSnapshot } from "./jsonValue-DGGrC1lE.js";
import { init_analysisView, init_analysisViewRequest, inspectAnalysisViewInputSchema, prepareAnalysisViewProjection } from "./analysisView-meycAY7x.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";
import { init_AnalysisInput, parseAnalysisInput } from "./AnalysisInput-6AZYEmRT.js";
import { init_nativeObservation, isNativeObservationOperation } from "./interfaceBuilderGraph-DT1im95M.js";
import { init_EvidenceBundleFiles, readImmutableEvidenceBundle } from "./EvidenceBundleFiles-kxea_C2c.js";
import { ANALYSIS_VIEW_PROVIDER, init_investigationProviders } from "./investigationProviders-Bs5C0Q8b.js";
import { init_EvidenceInputResolver, init_evidenceFileSource, readEvidenceFileSource, resolveEvidenceInput } from "./EvidenceInputResolver-Bnks2n7c.js";
import { setImmediate } from "node:timers/promises";

//#region dist/process/queuedInterrupts.js
var dispatchQueuedInterrupts;
function init_queuedInterrupts() {
	return (init_queuedInterrupts = __esmMin((() => {
		dispatchQueuedInterrupts = async () => {
			await setImmediate();
			await setImmediate();
		};
	})))();
}

//#endregion
//#region dist/application/analysisView/AnalysisViewService.js
var inspectAnalysisView, inspectFileView, inspectBundleView, cancelledFileViewResult, inspectAnalysisViewValidated, projectResolvedAnalysisView, requireAnalysisViewRetention, summarizeRetainedAnalysis, projectRetainedAnalysis, resolveAnalysisViewSource, authenticateEvidence, createAnalysisViewEvidence;
function init_AnalysisViewService() {
	return (init_AnalysisViewService = __esmMin((() => {
		init_analysisErrorProjection();
		init_analysisErrorCleanup();
		init_AnalysisInput();
		init_nativeObservation();
		init_queuedInterrupts();
		init_EvidenceBundleFiles();
		init_analysisViewErrors();
		init_investigationProviders();
		init_EvidenceInputResolver();
		init_analysisErrorCore();
		init_inputIssueProjection();
		init_evidenceErrors();
		init_evidenceValidation();
		init_evidence();
		init_analysisView();
		init_immutableJson();
		init_result();
		init_evidenceFileSource();
		inspectAnalysisView = async (rawInput, lookup, options = {}) => {
			const parsed = parseAnalysisInput(INSPECT_ANALYSIS_VIEW_OPERATION, rawInput, inspectAnalysisViewInputSchema, options.signal);
			if (!parsed.ok) return parsed;
			if (options.evidenceBundlePath !== undefined) return inspectBundleView(parsed.value, options.evidenceBundlePath, options);
			const source = parsed.value.source;
			if (source.kind === "evidence-file") return inspectFileView({
				...parsed.value,
				source
			}, lookup, options);
			return inspectAnalysisViewValidated({
				...parsed.value,
				source
			}, lookup);
		};
		inspectFileView = async (input, lookup, options = {}) => {
			const loaded = await readEvidenceFileSource(input.source.path, options, input.source.evidence_id);
			await dispatchQueuedInterrupts();
			const admitted = cancelledFileViewResult(loaded, options.signal, loaded.ok ? loaded.value : undefined);
			if (!admitted.ok) return admitted;
			const id = admitted.value.evidence_id;
			const projected = inspectAnalysisViewValidated({
				...input,
				source: {
					kind: "retained-evidence",
					evidence_id: id
				}
			}, (evidenceId) => evidenceId === id ? admitted.value : lookup?.(evidenceId));
			await dispatchQueuedInterrupts();
			if (!projected.ok) return projected;
			return cancelledFileViewResult(projected, options.signal, projected.value);
		};
		inspectBundleView = async (input, bundlePath, { resources, signal }) => {
			if (input.source.kind !== "retained-evidence") return err(new AnalysisInputError("inspect_analysis_view", undefined, [{
				path: ["source", "kind"],
				reason: "invalid_value",
				message: "--evidence-bundle requires a retained-evidence source with the exact parent evidence_id; inline Evidence already supplies its source"
			}]));
			const loaded = await readImmutableEvidenceBundle(bundlePath, signal, resources, "inspect_analysis_view");
			await dispatchQueuedInterrupts();
			if (!loaded.ok) return loaded;
			const parentId = input.source.evidence_id;
			const admitted = cancelledFileViewResult(loaded, signal, signal?.aborted ? loaded.value.records.find((record) => record.evidence_id === parentId) : undefined);
			if (!admitted.ok) return admitted;
			const projected = inspectAnalysisViewValidated({
				source: input.source,
				view: input.view
			}, (id) => admitted.value.records.find((record) => record.evidence_id === id));
			await dispatchQueuedInterrupts();
			if (!projected.ok) return projected;
			return cancelledFileViewResult(projected, signal, projected.value);
		};
		cancelledFileViewResult = (result, signal, completedEvidence) => {
			if (!signal?.aborted) return result;
			const cancellation = new AnalysisCancelledError(INSPECT_ANALYSIS_VIEW_OPERATION, {
				cause: signal.reason,
				...completedEvidence !== undefined ? { partialObservation: completedEvidence } : {}
			});
			if (!result.ok) cancellation.retainSecondaryFailure(result.error, { source_error: projectAnalysisErrorWithoutCapturedOutput(result.error) });
			return err(!result.ok && result.error.cleanupIncomplete ? analysisErrorWithCleanupFailure(cancellation, result.error, INSPECT_ANALYSIS_VIEW_OPERATION).bindCleanupDependencies([result.error]) : cancellation);
		};
		inspectAnalysisViewValidated = (input, lookup) => {
			const projection = prepareAnalysisViewProjection(input.view);
			if (input.source.kind === "inline") {
				const admitted = projection.admitInlineEvidence(input.source.evidence);
				if (!admitted.ok) return admitted;
			}
			const resolved = resolveAnalysisViewSource(input.source, lookup);
			if (!resolved.ok) return resolved;
			return projectResolvedAnalysisView(input, projection, resolved.value);
		};
		projectResolvedAnalysisView = (input, projection, parent, selectedTarget) => {
			const presentation = selectedTarget === undefined ? parent : rebindEvidenceToTargetPath(parent, selectedTarget);
			const projected = projection.project({
				evidenceId: parent.evidence_id,
				operation: parent.operation,
				predicateType: parent.predicate_type,
				provider: parent.provider,
				analysisProfile: parent.analysis_profile,
				authority: parent.authority,
				environment: parent.environment,
				normalizedResult: immutableJsonSnapshotMember(parent, "normalized_result") ?? parent.normalized_result,
				sealedResult: isImmutableJsonSnapshot(parent),
				subject: presentation.subject,
				limitations: parent.limitations,
				parameters: parent.parameters,
				artifact: presentation.subject === null ? null : {
					path: presentation.subject.local_path,
					sha256: presentation.subject.digest.sha256
				}
			});
			if (!projected.ok) return projected;
			if (parent.subject !== null && parent.subject.digest.sha256 !== projected.value.artifact?.sha256) return err(new EvidenceIntegrityError(`Parent subject SHA-256 ${parent.subject.digest.sha256} differs from analysis artifact SHA-256 ${projected.value.artifact?.sha256 ?? "unknown"}.`));
			return ok(createAnalysisViewEvidence(input, presentation, projected.value));
		};
		requireAnalysisViewRetention = (operation, retention) => {
			if (retention.recordEvidence === undefined || retention.evidenceById === undefined) return err(new AnalysisCapabilityUnavailableError(ANALYSIS_VIEW_PROVIDER.id, operation, "summary detail requires a server session that retains Evidence for later views", { userMessage: "This server does not retain Evidence. Select detail complete to receive the complete analysis inline." }));
			return ok({
				evidenceById: retention.evidenceById,
				recordEvidence: retention.recordEvidence
			});
		};
		summarizeRetainedAnalysis = (evidence, retention) => projectRetainedAnalysis(evidence, retention, { kind: "summary" });
		projectRetainedAnalysis = (evidence, retention, view) => {
			const ready = requireAnalysisViewRetention(evidence.operation, retention);
			if (!ready.ok) return ready;
			const recorded = ready.value.recordEvidence(evidence);
			if (!recorded.ok) return recorded;
			const source = {
				kind: "retained-evidence",
				evidence_id: evidence.evidence_id
			};
			const retained = resolveEvidenceInput(source, ready.value.evidenceById);
			if (!retained.ok) return retained;
			const subject = evidence.subject;
			return projectResolvedAnalysisView({
				source,
				view
			}, prepareAnalysisViewProjection(view), retained.value, subject === null ? undefined : {
				path: subject.local_path,
				sha256: subject.digest.sha256,
				format: subject.format,
				...subject.architecture === null ? {} : { architecture: subject.architecture }
			});
		};
		resolveAnalysisViewSource = (source, lookup) => {
			if (source.kind === "retained-evidence") return resolveEvidenceInput(source, lookup);
			return authenticateEvidence(source.evidence, ["source", "evidence"], { source });
		};
		authenticateEvidence = (value, path, input) => {
			const parsed = safeParseEvidence(value);
			if (parsed.ok) return parsed;
			const cause = parsed.error;
			return err(analysisInputErrorFromIssues(INSPECT_ANALYSIS_VIEW_OPERATION, cause.issues.map((issue) => ({
				...issue,
				path: [...path, ...issue.path]
			})), input, { cause }));
		};
		createAnalysisViewEvidence = (input, parent, result) => {
			const target = parent.subject === null ? undefined : {
				path: parent.subject.local_path,
				sha256: parent.subject.digest.sha256,
				format: parent.subject.format,
				...parent.subject.architecture === null ? {} : { architecture: parent.subject.architecture }
			};
			const nativeFunctionView = result.kind === "native" || result.kind === "summary" && result.parent_operation === "analyze_function" ? result : undefined;
			const nativeObservationView = result.kind === "native-observation" || result.kind === "native-context" || result.kind === "native-instruction-references" || result.kind === "summary" && isNativeObservationOperation(result.parent_operation);
			return createEvidence(target, ANALYSIS_VIEW_PROVIDER, {
				predicateType: "rea.analysis-view",
				operation: INSPECT_ANALYSIS_VIEW_OPERATION,
				parameters: {
					parent_evidence_id: parent.evidence_id,
					view: input.view
				},
				result,
				rawResult: null,
				confidence: parent.confidence === "inferred" || result.kind === "environment-state" || result.kind === "environment-coverage" || (result.kind === "api-surface" || result.kind === "environment-manifest") && result.templated_groups > 0 ? "inferred" : "derived",
				authority: parent.authority,
				environment: parent.environment,
				limitations: result.limitations,
				...(nativeFunctionView !== undefined || nativeObservationView) && parent.relationship_coverage !== null ? { relationshipCoverage: parent.relationship_coverage } : {},
				locations: [...result.artifact != null && result.artifact.path.length > 0 ? [{
					kind: "artifact-path",
					path: result.artifact.path
				}] : [], ...nativeFunctionView !== undefined && nativeFunctionView.procedure_address !== null && nativeFunctionView.procedure_address.length > 0 ? [{
					kind: "address",
					address: nativeFunctionView.procedure_address
				}] : []],
				evidenceLinks: [parent.evidence_id]
			}, { immutable: true });
		};
	})))();
}

//#endregion
export { dispatchQueuedInterrupts, init_AnalysisViewService, init_queuedInterrupts, inspectAnalysisView, inspectAnalysisViewValidated, projectRetainedAnalysis, requireAnalysisViewRetention, summarizeRetainedAnalysis };