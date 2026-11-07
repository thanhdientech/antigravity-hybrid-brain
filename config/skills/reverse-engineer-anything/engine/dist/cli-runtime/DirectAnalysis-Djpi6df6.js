import { __esmMin, __exportAll } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisSnapshotMismatchError, EvidenceFileError, UnknownRegistryError, err, init_evidenceErrors, init_result, init_unknownRegistryError, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisInputError, AnalysisOutputError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { analysisProfileSchema, committedProviderSchema, compareUnicodeCodePoints, createEvidence, createImmutableEvidenceBundle, init_analysisProfile, init_evidence, init_evidenceBundle, init_jsonStringByteLength, init_residualUnknown, init_unicodeCodePointOrder, jsonStringByteLength, recordUnknownInputSchema, withEvidenceCallerInputPath } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { absoluteCallerPath, init_callerPath } from "./callerPath-DHbDi-k2.js";
import { addressedValueSchema, init_nativeInventory } from "./interfaceBuilderGraph-DT1im95M.js";
import { dispatchQueuedInterrupts, init_queuedInterrupts } from "./AnalysisViewService-BU_6ZODN.js";
import { init_analysisSnapshot, snapshotBindingMismatch, snapshotEvidenceForQuery } from "./EvidenceBundleFiles-kxea_C2c.js";
import { REA_WORKFLOW_PROVIDER, init_investigationProviders } from "./investigationProviders-Bs5C0Q8b.js";
import { classifyBinaryTargetFilesystemFailure, init_BinaryTargetResolver } from "./BinaryTargetResolver-B2kcj1rP.js";
import { deliverAnalysisEvidence, init_EvidenceBundleCommands, init_InvestigationEvidence, resolveInvestigationEvidenceClosure } from "./InvestigationEvidence-UP2uW0Tg.js";
import { createAnalysisExecutionEvidence, init_analysisObservation } from "./analysisObservation-DdFFqA4e.js";
import { completeProviderEvidence, init_ProviderOperationExecution } from "./ProviderOperationExecution-CkDZ2DVQ.js";
import { init_recordEvidenceSources, recordEvidenceSources, retainAnalysisResultSources, withEvidenceSources } from "./recordEvidenceSources-D5V__z6_.js";
import { init_logger, silentLogger } from "./logger-CYsWF45U.js";
import { init_managedToolContracts, isManagedToolName } from "./managedToolContracts-Bpt4HKfM.js";
import { ARTIFACT_ANALYSIS_OPERATIONS, init_artifactToolContracts } from "./enhancedToolContracts-CSXJH_He.js";
import { BUNDLE_RESOURCE_OPERATIONS, EvidenceLedger, init_AnalysisSnapshotCache, init_BundleResourceSession, init_EvidenceLedger, init_ProfilelessNativeWorkflowSnapshot, init_SessionProviderPolicy, init_WorkflowAnalysisProfile, profilelessNativeDispatchProfile, requiresNativeSourceAdmissionBeforeReplay, routeAllowsSnapshotReplay, routeProviderIdentity, workflowAnalysisProfile } from "./BundleResourceSession-BfQUWW9_.js";
import { directAnalysisCleanupFailure, init_DirectAnalysisCleanup, managedAnalysisCleanupFailure, projectDirectAnalysisFailure, projectInvocationFailure, withSessionCleanup } from "./DirectAnalysisCleanup-C-lXEIvY.js";
import { access, stat } from "node:fs/promises";

//#region dist/application/AnalysisWorkScope.js
var AnalysisWorkScope;
function init_AnalysisWorkScope() {
	return (init_AnalysisWorkScope = __esmMin((() => {
		AnalysisWorkScope = class {
			#entries = new Map();
			#closed = false;
			get(owner) {
				return this.#entries.get(owner);
			}
			set(owner, value) {
				if (!this.#closed) this.#entries.set(owner, value);
			}
			clear() {
				this.#closed = true;
				this.#entries.clear();
			}
		};
	})))();
}

//#endregion
//#region dist/application/investigation/WorkflowUnknown.js
var workflowUnknownInput;
function init_WorkflowUnknown() {
	return (init_WorkflowUnknown = __esmMin((() => {
		init_residualUnknown();
		init_result();
		init_unknownRegistryError();
		workflowUnknownInput = (evidenceId, input) => {
			const question = recordUnknownInputSchema.shape.question.safeParse(input.question);
			if (!question.success) return err(new UnknownRegistryError("invalid-transition", { cause: question.error }));
			return ok({
				...input,
				question: `${question.data} (Evidence ${evidenceId})`,
				supporting_evidence_ids: [evidenceId],
				contradicting_evidence_ids: []
			});
		};
	})))();
}

//#endregion
//#region dist/application/SourceLimitations.js
var sourceLimitationKey, sourceLimitationGroupKey, renderSourceLimitations;
function init_SourceLimitations() {
	return (init_SourceLimitations = __esmMin((() => {
		init_unicodeCodePointOrder();
		sourceLimitationKey = ({ provider, operation, limitation }) => JSON.stringify([
			provider.id,
			provider.name,
			provider.version,
			operation,
			limitation
		]);
		sourceLimitationGroupKey = ({ provider, limitation }) => JSON.stringify([
			provider.id,
			provider.name,
			provider.version,
			limitation
		]);
		renderSourceLimitations = (limitations) => {
			const groups = new Map();
			for (const { provider, operation, limitation } of limitations) {
				const key = sourceLimitationGroupKey({
					provider,
					limitation
				});
				const group = groups.get(key) ?? {
					provider,
					limitation,
					operations: new Set()
				};
				group.operations.add(operation);
				groups.set(key, group);
			}
			return [...groups.values()].map(({ provider, limitation, operations }) => {
				const version = provider.version === null ? "" : ` ${provider.version}`;
				const operationList = [...operations].sort(compareUnicodeCodePoints);
				return `${provider.name} (${provider.id}${version}) ${operationList.join(", ")}: ${limitation}`;
			}).sort(compareUnicodeCodePoints);
		};
	})))();
}

//#endregion
//#region dist/application/WorkflowEvidence.js
var DECOMPILE_ALL_LIMITATIONS, composedLimitationBudget, executeComposedWorkflow, createWorkflowEvidence, retainPartialWorkflowEvidence, batchProcedureLocations, workflowSnapshotRecord, recordWorkflowUnknowns;
function init_WorkflowEvidence() {
	return (init_WorkflowEvidence = __esmMin((() => {
		init_AnalysisWorkScope();
		init_unicodeCodePointOrder();
		init_jsonStringByteLength();
		init_analysisObservation();
		init_investigationProviders();
		init_WorkflowAnalysisProfile();
		init_result();
		init_analysisProfile();
		init_evidence();
		init_unknownRegistryError();
		init_EvidenceLedger();
		init_recordEvidenceSources();
		init_WorkflowUnknown();
		init_SourceLimitations();
		DECOMPILE_ALL_LIMITATIONS = {
			perItemOperations: new Set(["procedure_info", "procedure_pseudo_code"]),
			maxDistinct: 8,
			retainedIn: "each function's record in decompile-index.json keeps the caveats of the observations it used"
		};
		composedLimitationBudget = (operation) => operation === "decompile_all" ? DECOMPILE_ALL_LIMITATIONS : undefined;
		executeComposedWorkflow = async (analysis, execute, budget) => {
			const limitations = new Map();
			const evidenceLinks = new Set();
			const sourceLedger = new EvidenceLedger();
			const perItemGroups = new Set();
			let perItemBytes = 0;
			let omittedObservations = 0;
			let cachePolicy;
			const workScope = new AnalysisWorkScope();
			const observed = {
				resourceScope: analysis.resourceScope,
				execute: async (operation, parameters, options) => {
					let execution = await analysis.execute(operation, parameters, {
						...options,
						workScope
					});
					if (execution.ok && execution.value.sourceEvidence !== undefined) {
						const recorded = recordEvidenceSources((source) => sourceLedger.record(source), execution.value.sourceEvidence);
						if (!recorded.ok) return recorded;
					}
					if (execution.ok && options?.retainEvidence === true && execution.value.evidenceId === undefined) {
						const source = createAnalysisExecutionEvidence(operation, parameters, execution.value, "observed");
						const recorded = recordEvidenceSources((evidence) => sourceLedger.record(evidence), [source]);
						if (!recorded.ok) return recorded;
						execution = ok({
							...execution.value,
							evidenceId: source.evidence_id
						});
					}
					if (execution.ok && execution.value.evidenceId !== undefined) evidenceLinks.add(execution.value.evidenceId);
					if (execution.ok && execution.value.cachePolicy === "live") cachePolicy = "live";
					if (execution.ok) for (const limitation of execution.value.limitations) {
						const fact = {
							provider: execution.value.provider,
							operation,
							limitation
						};
						if (budget?.perItemOperations.has(operation) === true) {
							const maxBytes = budget.maxBytes ?? 8e3;
							const bytes = jsonStringByteLength(limitation, maxBytes);
							if (bytes > maxBytes) {
								omittedObservations += 1;
								continue;
							}
							const group = sourceLimitationGroupKey(fact);
							if (!perItemGroups.has(group)) {
								if (perItemGroups.size >= budget.maxDistinct || perItemBytes + bytes > maxBytes) {
									omittedObservations += 1;
									continue;
								}
								perItemGroups.add(group);
								perItemBytes += bytes;
							}
						}
						limitations.set(sourceLimitationKey(fact), fact);
					}
					return execution;
				}
			};
			const result = await Promise.resolve().then(() => execute(observed)).finally(() => workScope.clear());
			const sources = sourceLedger.recordsForAnalysis();
			if (!result.ok && !("partialResult" in result)) return withEvidenceSources(result, sources);
			for (const source of sources) evidenceLinks.add(source.evidence_id);
			const observation = (value) => ({
				result: value,
				limitations: [...renderSourceLimitations([...limitations.values()]), ...omittedObservations === 0 ? [] : [`${omittedObservations} per-item provider limitation observation${omittedObservations === 1 ? " was" : "s were"} omitted from this answer; ${budget?.retainedIn}.`]],
				...cachePolicy === undefined ? {} : { cachePolicy },
				...evidenceLinks.size === 0 ? {} : { evidenceLinks: [...evidenceLinks].sort(compareUnicodeCodePoints) }
			});
			return withEvidenceSources(result.ok ? ok(observation(result.value)) : {
				ok: false,
				error: result.error,
				partial: observation(result.partialResult)
			}, sources);
		};
		createWorkflowEvidence = (input) => createEvidence(input.target, REA_WORKFLOW_PROVIDER, {
			operation: input.operation,
			parameters: input.parameters,
			result: input.result,
			...input.upstreamProfile === undefined ? {} : { analysisProfile: workflowAnalysisProfile(input.upstreamProfile, input.operation) },
			confidence: "derived",
			...input.upstreamEvidenceLinks === undefined ? {} : { evidenceLinks: input.upstreamEvidenceLinks },
			limitations: ["Derived by an REA composed workflow.", ...input.upstreamLimitations],
			...input.operation === "batch_decompile" ? { locations: batchProcedureLocations(input.result) } : {}
		});
		retainPartialWorkflowEvidence = (outcome, context) => {
			if (outcome.ok || outcome.partial === undefined) return;
			const evidence = createWorkflowEvidence({
				...context,
				result: outcome.partial.result,
				upstreamLimitations: outcome.partial.limitations,
				...outcome.partial.evidenceLinks === undefined ? {} : { upstreamEvidenceLinks: outcome.partial.evidenceLinks }
			});
			outcome.error.retainPartialObservation(evidence);
		};
		batchProcedureLocations = (result) => {
			if (result === null || typeof result !== "object" || Array.isArray(result) || !Array.isArray(result.items)) return [];
			const addresses = new Set();
			for (const item of result.items) {
				if (item === null || typeof item !== "object" || Array.isArray(item)) continue;
				const procedure = item.procedure;
				if (procedure !== null && typeof procedure === "object" && !Array.isArray(procedure) && procedure.status === "resolved" && typeof procedure.address === "string") addresses.add(procedure.address);
			}
			return [...addresses].map((address) => ({
				kind: "address",
				address
			}));
		};
		workflowSnapshotRecord = (evidence, operation, bindingProfile, cachePolicy) => {
			if (evidence.analysis_profile === null || bindingProfile === undefined || cachePolicy === "live") return undefined;
			return {
				operation,
				bindingProfile,
				parameters: evidence.parameters,
				execution: {
					result: evidence.normalized_result,
					rawResult: evidence.raw_result,
					provider: committedProviderSchema.parse(evidence.provider),
					analysisProfile: analysisProfileSchema.parse(evidence.analysis_profile),
					limitations: evidence.limitations,
					locations: evidence.locations,
					subject: evidence.subject === null ? null : {
						path: evidence.subject.local_path,
						sha256: evidence.subject.digest.sha256,
						format: evidence.subject.format,
						...evidence.subject.architecture === null ? {} : { architecture: evidence.subject.architecture }
					}
				}
			};
		};
		recordWorkflowUnknowns = ({ name, result, evidenceId, recordUnknown, evidenceRetained }) => {
			if (![
				"trace_feature",
				"trace_call_path",
				"inspect_native_api"
			].includes(name) || recordUnknown === undefined || typeof result !== "object" || result === null || Array.isArray(result) || !Array.isArray(result.residual_unknowns)) return {
				ok: true,
				value: null
			};
			const questions = result.residual_unknowns;
			const total = questions.reduce((count, value) => count + (typeof value === "string" ? 1 : 0), 0);
			let created = 0;
			let existing = 0;
			const stopped = (error, index) => err(error.retainWorkflowUnknownPublication({
				evidence_id: evidenceId,
				evidence_retention: evidenceRetained === true ? "retained" : "unverified",
				total_questions: total,
				created_questions: created,
				existing_questions: existing,
				next_question_index: index
			}));
			for (let index = 0; index < questions.length; index += 1) {
				const question = questions[index];
				if (typeof question !== "string") continue;
				const input = workflowUnknownInput(evidenceId, {
					question,
					severity: "medium",
					domain: name === "inspect_native_api" ? "native-api" : "control-flow",
					required_authority: "shipped-artifact",
					required_confidence: "observed",
					required_environment: null,
					recommended_probes: [{
						operation: name,
						rationale: name === "inspect_native_api" ? "Confirm the unsupported boundary with a capable provider or ABI probe." : "Continue with a focused query or another available provider."
					}],
					relationships: []
				});
				if (!input.ok) return stopped(input.error, index);
				const recorded = recordUnknown(input.value);
				if (recorded.ok) created += 1;
				else if (recorded.error instanceof UnknownRegistryError && recorded.error.reason === "already-exists") existing += 1;
				else return stopped(recorded.error, index);
			}
			return {
				ok: true,
				value: null
			};
		};
	})))();
}

//#endregion
//#region dist/application/CapabilityFallback.js
var permitsCapabilityFallback;
function init_CapabilityFallback() {
	return (init_CapabilityFallback = __esmMin((() => {
		init_analysisErrorCore();
		permitsCapabilityFallback = (error) => error instanceof AnalysisCapabilityUnavailableError && !error.cleanupIncomplete;
	})))();
}

//#endregion
//#region dist/application/ProcedureAddressResolution.js
var resolveProcedureAddress, parseProcedureAddress;
function init_ProcedureAddressResolution() {
	return (init_ProcedureAddressResolution = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		resolveProcedureAddress = async (call, procedure, signal) => {
			const result = await call("procedure_address", { procedure }, signal);
			if (!result.ok) return result;
			return parseProcedureAddress(result.value);
		};
		parseProcedureAddress = (value) => typeof value === "string" && value.length > 0 ? ok(value) : err(new AnalysisOutputError("procedure_address", "provider returned no canonical procedure address"));
	})))();
}

//#endregion
//#region dist/application/XrefsAddressResolution.js
var resolveXrefsAddress, resolveXrefsName;
function init_XrefsAddressResolution() {
	return (init_XrefsAddressResolution = __esmMin((() => {
		init_CapabilityFallback();
		init_nativeInventory();
		init_analysisErrorCore();
		init_result();
		init_ProcedureAddressResolution();
		resolveXrefsAddress = async (analysis, selector, signal) => {
			const named = await resolveXrefsName(analysis, selector, signal);
			if (!named.ok) return named;
			return named.value !== null ? ok(named.value) : err(new AnalysisInputError("xrefs", {
				conformsToInputContract: true,
				remediationAction: "For a function, use rea search --kind procedures to find an analyzed address. For exports, inspect-macho (Mach-O) or inspect-native-exports (PE/ELF) may help; exports can omit local symbols and use different address coordinates. Verify the address in the selected provider, then retry xrefs."
			}, [{
				path: ["address"],
				reason: "invalid_value",
				message: `Unknown analyzed symbol name ${JSON.stringify(selector)}. Use an exact analyzed name or a hexadecimal address.`
			}]));
		};
		resolveXrefsName = async (analysis, selector, signal, operation = "xrefs") => {
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			const inventory = await analysis.execute("list_names", {}, signal === undefined ? {} : { signal });
			if (!inventory.ok) {
				if (operation === "xrefs" && permitsCapabilityFallback(inventory.error) && inventory.error.operation === "list_names") return resolveProcedureAddress(async (operation, parameters, signal) => {
					const result = await analysis.execute(operation, parameters, signal === undefined ? {} : { signal });
					return result.ok ? ok(result.value.result) : result;
				}, selector, signal);
				return inventory;
			}
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			if (!Array.isArray(inventory.value.result)) return err(new AnalysisOutputError("list_names", "Expected a symbol inventory array"));
			const addresses = new Set();
			for (const [index, item] of inventory.value.result.entries()) {
				const parsed = addressedValueSchema.safeParse(item);
				if (!parsed.success || parsed.data.address.length === 0) return err(new AnalysisOutputError("list_names", `Invalid symbol inventory entry at index ${index}`));
				if (parsed.data.value === selector) addresses.add(parsed.data.address);
			}
			const [address] = addresses;
			if (addresses.size <= 1) return ok(address ?? null);
			return err(new AnalysisInputError(operation, {
				conformsToInputContract: true,
				remediationAction: "Select an exact address from the candidates and call xrefs with that address."
			}, [{
				path: [operation === "xrefs" ? "address" : "name"],
				reason: "invalid_value",
				message: `Analyzed symbol name ${JSON.stringify(selector)} is ambiguous at ${[...addresses].sort().join(", ")}. Select an exact address.`
			}]));
		};
	})))();
}

//#endregion
//#region dist/application/DirectAnalysis.js
var DirectAnalysis_exports = /* @__PURE__ */ __exportAll({
	runDirectAnalysis: () => runDirectAnalysis,
	runManagedProviderExecution: () => runManagedProviderExecution,
	runProviderAnalysis: () => runProviderAnalysis
});
var NATIVE_INSPECTION_OPERATIONS, ARTIFACT_ANALYSIS_OPERATION_SET, runDirectAnalysis, targetSelection, runProviderAnalysis, runManagedProviderExecution, runManagedProviderAnalysis, runAnalysis, executeAnalysisTool, withProcessCancellation, prepareSnapshot, inspectBundleResourceInput, analysisProfileForRoute, nativeDispatchBindingProfile, analysisProfileForEvidence, isWorkflowEvidenceTool, fileExists, cliError;
function init_DirectAnalysis() {
	return (init_DirectAnalysis = __esmMin((() => {
		init_queuedInterrupts();
		init_SessionProviderPolicy();
		init_logger();
		init_evidence();
		init_evidenceBundle();
		init_recordEvidenceSources();
		init_InvestigationEvidence();
		init_artifactToolContracts();
		init_managedToolContracts();
		init_evidenceErrors();
		init_callerPath();
		init_AnalysisSnapshotCache();
		init_BinaryTargetResolver();
		init_analysisSnapshot();
		init_ProfilelessNativeWorkflowSnapshot();
		init_result();
		init_analysisObservation();
		init_investigationProviders();
		init_WorkflowAnalysisProfile();
		init_WorkflowEvidence();
		init_XrefsAddressResolution();
		init_analysisErrorCore();
		init_EvidenceBundleCommands();
		init_DirectAnalysisCleanup();
		init_ProviderOperationExecution();
		init_BundleResourceSession();
		NATIVE_INSPECTION_OPERATIONS = new Set([
			"inspect_macho",
			"inspect_signature",
			"list_architectures",
			"inspect_plist",
			"demangle_swift"
		]);
		ARTIFACT_ANALYSIS_OPERATION_SET = new Set(ARTIFACT_ANALYSIS_OPERATIONS);
		runDirectAnalysis = async (dependencies, path, tool, arguments_, options = {}) => withProcessCancellation(options.signal, (signal) => runAnalysis(dependencies, path, tool, arguments_, {
			logger: options.logger ?? silentLogger,
			snapshotPath: options.snapshotPath,
			signal,
			...options.includeEvidenceSources === true ? { includeEvidenceSources: true } : {},
			...options.onEvidenceBundle === undefined ? {} : { onEvidenceBundle: options.onEvidenceBundle },
			...targetSelection(options),
			...options.providerId === undefined ? {} : { providerId: options.providerId }
		}));
		targetSelection = (options) => ({
			...options.formatHint === undefined ? {} : { formatHint: options.formatHint },
			...options.architecture === undefined ? {} : { architecture: options.architecture },
			...options.entryPoint === undefined ? {} : { entryPoint: options.entryPoint },
			...options.espFlash === undefined ? {} : { espFlash: options.espFlash }
		});
		runProviderAnalysis = async (dependencies, ...[path, tool, arguments_, logger = silentLogger, signal, delivery, selection]) => {
			if (delivery !== undefined && tool !== "inspect_managed_members") return err(cliError(new AnalysisInputError(tool, undefined, [{
				path: ["delivery"],
				reason: "invalid_value",
				message: "Evidence delivery options are only supported by inspect_managed_members"
			}])));
			if (delivery?.detail === "summary" && delivery.evidenceBundlePath === undefined) return err(cliError(new AnalysisInputError(tool, undefined, [{
				path: ["evidence_bundle"],
				reason: "missing_argument",
				message: "summary detail requires --evidence-bundle so complete Evidence remains available to later CLI commands"
			}])));
			return withProcessCancellation(signal, async (operationSignal) => {
				const evidenceParameters = {
					...arguments_,
					input_path: path
				};
				if (isManagedToolName(tool)) {
					const original = await runManagedProviderAnalysis(dependencies, path, tool, arguments_, evidenceParameters, operationSignal);
					await dispatchQueuedInterrupts();
					if (!original.ok) return err(cliError(original.error, path));
					const evidence = withEvidenceCallerInputPath(original.value, path);
					if (operationSignal.aborted) return err(cliError(new AnalysisCancelledError(tool, {
						cause: operationSignal.reason,
						partialObservation: evidence
					})));
					const result = delivery?.evidenceBundlePath === undefined ? ok(evidence) : await deliverAnalysisEvidence(evidence, delivery.evidenceBundlePath, delivery.detail, operationSignal);
					return result.ok ? ok(result.value) : err(cliError(result.error, path));
				}
				return runAnalysis(dependencies, path, tool, arguments_, {
					logger,
					snapshotPath: undefined,
					signal: operationSignal,
					evidenceParameters,
					...targetSelection(selection ?? {}),
					...ARTIFACT_ANALYSIS_OPERATION_SET.has(tool) ? { createSession: dependencies.createArtifactBinarySession } : NATIVE_INSPECTION_OPERATIONS.has(tool) ? { createSession: dependencies.createNativeBinarySession } : {}
				});
			});
		};
		runManagedProviderExecution = async (dependencies, path, tool, signal, parameters = {}) => withProcessCancellation(signal, async (operationSignal) => {
			const session = await dependencies.createManagedBinarySession();
			return withSessionCleanup(session, async () => {
				const opened = await session.open(path, { signal: operationSignal });
				if (!opened.ok) return opened;
				return await session.execute(tool, parameters, { signal: operationSignal });
			}, managedAnalysisCleanupFailure);
		});
		runManagedProviderAnalysis = async (dependencies, path, tool, arguments_, evidenceParameters, signal) => {
			const execution = await runManagedProviderExecution(dependencies, path, tool, signal, arguments_);
			if (!execution.ok) return execution;
			const value = execution.value;
			return ok(createAnalysisExecutionEvidence(tool, evidenceParameters, value, "observed", { immutable: true }));
		};
		runAnalysis = async (dependencies, path, tool, arguments_, options) => {
			const { logger, signal, snapshotPath } = options;
			const evidenceParameters = options.evidenceParameters ?? arguments_;
			let session;
			if (options.createSession !== undefined) {
				session = await options.createSession();
			} else {
				const config = dependencies.readConfiguration();
				if (!config.ok) return err(cliError(config.error));
				session = await (tool === "inspect_native_dispatch_metadata" && snapshotPath === undefined ? dependencies.createNativeDispatchBinarySession : dependencies.createBinarySession)(config.value, logger);
			}
			let publishedSnapshot;
			let sourceEvidence;
			const captureSources = (evidence, supplied = []) => {
				if (options.includeEvidenceSources !== true) return ok(null);
				const known = new Map(supplied.map((record) => [record.evidence_id, record]));
				const closure = resolveInvestigationEvidenceClosure({ evidenceForAnalysis: (id) => {
					const record = known.get(id) ?? session.evidenceForAnalysis(id);
					if (record !== undefined) known.set(id, record);
					return record;
				} }, evidence.evidence_links);
				if (!closure.ok) return closure;
				sourceEvidence = closure.value.map((id) => known.get(id));
				return ok(null);
			};
			const execute = async () => {
				let isDirectory = false;
				if (BUNDLE_RESOURCE_OPERATIONS.has(tool)) {
					const inspected = await inspectBundleResourceInput(path);
					if (!inspected.ok) return err(inspected.error);
					isDirectory = inspected.value;
				}
				if (BUNDLE_RESOURCE_OPERATIONS.has(tool) && isDirectory) {
					const opened = await session.openBundleResources(path, { signal });
					if (!opened.ok) return err(opened.error);
					const execution = await session.execute(tool, arguments_, { signal });
					if (!execution.ok) return err(execution.error);
					return ok(withEvidenceCallerInputPath(createAnalysisExecutionEvidence(tool, evidenceParameters, execution.value, "observed"), path));
				}
				const prepared = await prepareSnapshot({
					session,
					path,
					snapshotPath,
					signal,
					...targetSelection(options)
				});
				if (!prepared.ok) return err(prepared.error);
				const { snapshot } = prepared.value;
				let resolvedTarget;
				if (snapshot !== undefined && prepared.value.target !== undefined) {
					const preview = await session.previewTarget(prepared.value.target, {
						signal,
						snapshot,
						...targetSelection(options),
						...options.providerId === undefined ? {} : { providerId: options.providerId }
					});
					if (!preview.ok) return err(preview.error);
					resolvedTarget = preview.value;
					const route = preview.value.route;
					const bindingProfile = route.profile ?? nativeDispatchBindingProfile(route, tool);
					const evidenceProfile = analysisProfileForRoute(route, tool);
					if (bindingProfile !== undefined && evidenceProfile !== undefined && !requiresNativeSourceAdmissionBeforeReplay(route.binding?.identity.id) && tool !== "trace_native_ui_action" && tool !== "decompile_all" && routeAllowsSnapshotReplay(route, tool)) {
						const cached = snapshotEvidenceForQuery(snapshot, {
							target: preview.value.target,
							bindingProfile,
							operation: tool,
							parameters: arguments_,
							provider: isWorkflowEvidenceTool(tool) ? REA_WORKFLOW_PROVIDER : routeProviderIdentity(route, tool),
							evidenceProfile
						});
						if (cached !== undefined) {
							const evidence = withEvidenceCallerInputPath(cached, path);
							const sources = captureSources(evidence, snapshot.evidence_bundle.records);
							if (!sources.ok) return err(sources.error.retainPartialObservation(evidence));
							options.onEvidenceBundle?.(snapshot.evidence_bundle);
							return ok(evidence);
						}
					}
				}
				const openOptions = {
					signal,
					...targetSelection(options),
					...snapshot === undefined ? {} : { snapshot },
					...options.providerId === undefined ? {} : { providerId: options.providerId }
				};
				const opened = resolvedTarget === undefined ? await session.open(path, openOptions) : await session.openResolvedTarget(resolvedTarget, openOptions);
				if (!opened.ok) return err(opened.error);
				const evidenceProfile = analysisProfileForEvidence(session, tool);
				const executed = await executeAnalysisTool({
					session,
					openedTarget: opened.value,
					tool,
					arguments: arguments_,
					evidenceParameters,
					signal,
					evidenceProfile,
					saveSnapshot: snapshotPath !== undefined
				});
				if (!executed.ok) return executed;
				const { cachePolicy } = executed.value;
				const evidence = withEvidenceCallerInputPath(executed.value.evidence, path);
				const recorded = session.importEvidenceBundle(createImmutableEvidenceBundle([evidence]));
				if (!recorded.ok) return err(recorded.error.retainPartialObservation(evidence));
				const sources = captureSources(evidence);
				if (!sources.ok) return err(sources.error.retainPartialObservation(evidence));
				if (isWorkflowEvidenceTool(tool)) {
					const unknowns = recordWorkflowUnknowns({
						name: tool,
						result: evidence.normalized_result,
						evidenceId: evidence.evidence_id,
						recordUnknown: (unknown) => session.recordUnknown(unknown),
						evidenceRetained: true
					});
					if (!unknowns.ok) return err(unknowns.error.retainPartialObservation(evidence));
				}
				if (isWorkflowEvidenceTool(tool) && tool !== "trace_native_ui_action" && snapshotPath !== undefined && session.allowsSnapshotReplay(tool)) {
					const workflowRecord = workflowSnapshotRecord(evidence, tool, evidenceProfile, cachePolicy);
					if (workflowRecord !== undefined) {
						const recorded = session.recordWorkflowSnapshot(workflowRecord);
						if (!recorded.ok) return err(recorded.error.retainPartialObservation(evidence));
					}
				}
				if (tool !== "trace_native_ui_action" && tool !== "decompile_all" && snapshotPath !== undefined) {
					const snapshot = session.exportAnalysisSnapshot();
					if (!snapshot.ok) return err(snapshot.error.retainPartialObservation(evidence));
					const written = await session.writeAnalysisSnapshot(snapshot.value, snapshotPath, true);
					if (written.ok) publishedSnapshot = written.value;
					else {
						const published = written.error instanceof EvidenceFileError ? written.error.published : undefined;
						if (published?.path !== undefined) publishedSnapshot = {
							path: published.path,
							bytes: published.bytes
						};
						const released = published !== undefined && (await session.closeFileResources()).ok;
						if (!released || published?.path === undefined) return err(written.error.retainPartialObservation(evidence));
					}
				}
				options.onEvidenceBundle?.(session.exportEvidenceBundle());
				return ok(evidence);
			};
			const outcome = await withSessionCleanup(session, async () => ({ result: await execute() }), (value, cleanupError) => ({
				...value,
				cleanupError
			}));
			await dispatchQueuedInterrupts();
			const result = outcome.result.ok ? completeProviderEvidence(outcome.result.value, signal) : outcome.result;
			if (!result.ok && publishedSnapshot !== undefined) result.error.retainDiagnostics({ analysis_snapshot: { ...publishedSnapshot } });
			if (outcome.cleanupError !== undefined) {
				if (result.ok && publishedSnapshot !== undefined) outcome.cleanupError.retainDiagnostics({ analysis_snapshot: { ...publishedSnapshot } });
				return err(directAnalysisCleanupFailure(result, outcome.cleanupError, path));
			}
			return result.ok ? {
				...ok(result.value),
				...sourceEvidence === undefined ? {} : { sourceEvidence }
			} : err(cliError(result.error, path));
		};
		executeAnalysisTool = async (input) => {
			const { session, tool, signal, evidenceProfile } = input;
			if (tool === "analyze_function") {
				const { executeFunctionAnalysisEvidence } = await import("./application__FunctionAnalysisEvidence-D62ERA9-.js");
				let result = await executeFunctionAnalysisEvidence(session, input.arguments, input.openedTarget, { signal });
				result = retainAnalysisResultSources(tool, (source) => session.recordEvidence(source), result);
				return result.ok ? ok({ evidence: result.value }) : result;
			}
			if (isWorkflowEvidenceTool(tool)) {
				const { EnhancedTools } = await import("./application__EnhancedTools-DrKtyfVj.js");
				let result = await executeComposedWorkflow(session, (observed) => new EnhancedTools(observed).execute(tool, input.arguments, signal), composedLimitationBudget(tool));
				retainPartialWorkflowEvidence(result, {
					target: input.openedTarget,
					operation: tool,
					parameters: input.evidenceParameters,
					upstreamProfile: evidenceProfile
				});
				result = retainAnalysisResultSources(tool, (source) => session.recordEvidence(source), result);
				if (!result.ok) return result;
				const evidence = createWorkflowEvidence({
					target: input.openedTarget,
					operation: tool,
					parameters: input.evidenceParameters,
					result: result.value.result,
					upstreamProfile: evidenceProfile,
					upstreamLimitations: result.value.limitations,
					...result.value.evidenceLinks === undefined ? {} : { upstreamEvidenceLinks: result.value.evidenceLinks }
				});
				return ok({
					evidence,
					...result.value.cachePolicy === undefined ? {} : { cachePolicy: result.value.cachePolicy }
				});
			}
			let result = await session.execute(tool, input.arguments, {
				signal,
				...input.saveSnapshot && tool === "procedure_pseudo_code" ? { snapshotContext: "one-shot-target" } : {}
			});
			if (tool === "xrefs" && typeof input.arguments.address === "string" && !result.ok && result.error instanceof AnalysisInputError && !result.error.cleanupIncomplete && result.error.issues.length > 0 && result.error.issues.every(({ path, reason }) => path.length === 1 && path[0] === "address" && reason === "invalid_format")) {
				const address = await resolveXrefsAddress(session, input.arguments.address, signal);
				if (!address.ok) return address;
				if (address.value !== input.arguments.address) result = await session.execute(tool, {
					...input.arguments,
					address: address.value
				}, { signal });
			}
			if (!result.ok) return result;
			const evidence = createAnalysisExecutionEvidence(tool, input.evidenceParameters, {
				...result.value,
				subject: result.value.subject === undefined ? input.openedTarget : result.value.subject
			}, "observed");
			return ok({ evidence });
		};
		withProcessCancellation = async (suppliedSignal, operation) => {
			if (suppliedSignal !== undefined) return operation(suppliedSignal);
			const controller = new AbortController();
			const cancel = () => controller.abort();
			process.on("SIGINT", cancel);
			process.on("SIGTERM", cancel);
			try {
				return await operation(controller.signal);
			} finally {
				process.off("SIGINT", cancel);
				process.off("SIGTERM", cancel);
			}
		};
		prepareSnapshot = async (options) => {
			const { path, snapshotPath, session } = options;
			if (snapshotPath === undefined || !await fileExists(snapshotPath)) return ok({});
			const loaded = await session.readAnalysisSnapshot(snapshotPath, options.signal);
			if (!loaded.ok) return loaded;
			const target = await session.resolveTarget(path, {
				signal: options.signal,
				...targetSelection(options)
			});
			if (!target.ok) return target;
			const mismatch = snapshotBindingMismatch(loaded.value, target.value, undefined);
			if (mismatch?.target !== undefined) return err(new AnalysisSnapshotMismatchError("Analysis snapshot target does not match the requested binary", mismatch));
			return ok({
				snapshot: loaded.value,
				target: target.value
			});
		};
		inspectBundleResourceInput = async (path) => {
			const callerPath = absoluteCallerPath(path);
			try {
				return ok((await stat(callerPath)).isDirectory());
			} catch (cause) {
				const failure = classifyBinaryTargetFilesystemFailure(callerPath, cause);
				if (failure !== undefined) return err(failure);
				throw cause;
			}
		};
		analysisProfileForRoute = (route, tool) => {
			const profile = route.profile;
			const nativeDispatchProfile = profile === null || profile === undefined ? nativeDispatchBindingProfile(route, tool) : undefined;
			if (profile === null || profile === undefined) {
				if (nativeDispatchProfile === undefined) return undefined;
				return isWorkflowEvidenceTool(tool) ? workflowAnalysisProfile(nativeDispatchProfile, tool) : nativeDispatchProfile;
			}
			if (isWorkflowEvidenceTool(tool)) return workflowAnalysisProfile(profile, tool);
			const provider = routeProviderIdentity(route, tool);
			return provider.id === profile.provider.id ? profile : undefined;
		};
		nativeDispatchBindingProfile = (route, operation) => {
			if (operation !== "inspect_native_dispatch_metadata") return undefined;
			return profilelessNativeDispatchProfile(route);
		};
		analysisProfileForEvidence = (session, tool) => {
			if (!isWorkflowEvidenceTool(tool)) return session.analysisProfile(tool);
			return session.analysisProfile() ?? session.analysisProfile(tool);
		};
		isWorkflowEvidenceTool = (tool) => tool === "binary_overview" || tool === "inspect_native_api" || tool === "inspect_native_dispatch_metadata" || tool === "trace_feature" || tool === "trace_native_values" || tool === "trace_native_ui_action" || tool === "decompile_all";
		fileExists = async (path) => {
			try {
				await access(path);
				return true;
			} catch (cause) {
				if (typeof cause === "object" && cause !== null && "code" in cause && cause.code === "ENOENT") return false;
				throw cause;
			}
		};
		cliError = (error, callerInputPath) => ({
			error: "Analysis failed",
			...callerInputPath === undefined ? projectInvocationFailure(error) : projectDirectAnalysisFailure(error, callerInputPath)
		});
	})))();
}

//#endregion
export { DirectAnalysis_exports, init_CapabilityFallback, init_DirectAnalysis, init_ProcedureAddressResolution, init_SourceLimitations, init_XrefsAddressResolution, parseProcedureAddress, permitsCapabilityFallback, renderSourceLimitations, resolveProcedureAddress, resolveXrefsName };