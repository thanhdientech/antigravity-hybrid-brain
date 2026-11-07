import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { r as init_callerPath, t as absoluteCallerPath } from "./callerPath-BOjlR2T6.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { f as init_analysisErrorCore, i as AnalysisCancelledError, o as AnalysisInputError } from "./analysisErrorCore-BCqhUcUc.js";
import { i as jsonValueSchema, n as init_jsonValue } from "./jsonValue-CbQQraup.js";
import { g as tryParseEvidence, u as init_evidence, v as withEvidenceCallerInputPath } from "./evidence-Cy8VjugF.js";
import { n as ArtifactResourceScope, r as init_ArtifactResourceScope } from "./ArtifactResourceScope-CStgM9Qm.js";
import { c as EvidenceFileError, f as init_evidenceErrors, s as AnalysisSnapshotMismatchError } from "./digests-Ct-nksBF.js";
import { n as init_logger, r as silentLogger } from "./logger-Brcs2SlV.js";
import { Ao as init_WorkflowAnalysisProfile, Co as composedLimitationBudget, Do as recordWorkflowUnknowns, Eo as init_WorkflowEvidence, Fo as init_EvidenceBundleFiles, Io as readComparisonEvidenceBundles, Lo as readEvidenceBundle, Mo as init_InvestigationEvidence, No as resolveInvestigationEvidenceClosure, Oo as retainPartialWorkflowEvidence, Po as evidenceBundleExportReceipt, Ro as readImmutableEvidenceBundle, So as inspectEvidenceBundle, To as executeComposedWorkflow, Xo as init_analysisSnapshot, bo as inspectAnalysisViewValidated, cs as init_queuedInterrupts, go as init_BundleResourceSession, jo as workflowAnalysisProfile, ko as workflowSnapshotRecord, mo as BUNDLE_RESOURCE_OPERATIONS, ns as snapshotBindingMismatch, rs as snapshotEvidenceForQuery, ss as dispatchQueuedInterrupts, wo as createWorkflowEvidence, xo as init_InspectEvidenceBundle, yo as init_AnalysisViewService, zo as writeEvidenceBundle } from "./createServer-CMxQrH3I.js";
import { J as compareBundles, Y as init_bundleComparison, as as readArtifactInspectionSources, is as init_artifactInspection } from "./toolOutputSchemaGroups-3HUmDmX5.js";
import { a as init_evidenceBundle, n as createImmutableEvidenceBundle } from "./evidenceBundle-CwDqQKst.js";
import { n as jsonValueByteLength, t as init_jsonValueByteLength } from "./jsonValueByteLength-D_Ap3bp9.js";
import { d as routeAllowsSnapshotReplay, f as routeProviderIdentity, l as requiresNativeSourceAdmissionBeforeReplay, n as init_ProfilelessNativeWorkflowSnapshot, o as init_AnalysisSnapshotCache, r as profilelessNativeDispatchProfile, u as init_SessionProviderPolicy } from "./ProfilelessNativeWorkflowSnapshot-CP9dzC7E.js";
import { a as init_recordEvidenceSources, s as retainAnalysisResultSources } from "./EvidenceLedger-CmEA5kKK.js";
import { r as init_ProviderOperationExecution, t as completeProviderEvidence } from "./ProviderOperationExecution-D4icax0l.js";
import { n as init_JsonAuthenticationHeadroom, r as requireAuthenticationHeadroom } from "./JsonAuthenticationHeadroom-CXha_Mvo.js";
import { a as init_artifactToolContracts, t as ARTIFACT_ANALYSIS_OPERATIONS } from "./artifactToolContracts-CrOyjgaD.js";
import { l as init_managedToolContracts, u as isManagedToolName } from "./espFlashSelection-tjkr0NM1.js";
import { O as init_investigationProviders, w as REA_WORKFLOW_PROVIDER } from "./investigationProviders-Bqtkg8nj.js";
import { n as init_BinaryTargetResolver, t as classifyBinaryTargetFilesystemFailure } from "./BinaryTargetResolver-DilUz-sh.js";
import { n as init_analysisObservation, t as createAnalysisExecutionEvidence } from "./analysisObservation-CbCdIPJC.js";
import { n as resolveXrefsAddress, t as init_XrefsAddressResolution } from "./XrefsAddressResolution-Bg_Fo1xL.js";
import { a as projectInvocationFailure, i as projectDirectAnalysisFailure, n as init_DirectAnalysisCleanup, o as withSessionCleanup, r as managedAnalysisCleanupFailure, t as directAnalysisCleanupFailure } from "./DirectAnalysisCleanup-BJIsnH9_.js";
import { access, stat } from "node:fs/promises";

//#region dist/application/AnalysisEvidenceSources.js
var analysisEvidenceSources, SOURCE_CLOSURE_INLINE_BYTES, SOURCE_CLOSURE_LISTED_OMISSIONS, SOURCE_CLOSURE_RECOVERY, collectSourceClosure, undeliveredSourceClosure;
function init_AnalysisEvidenceSources() {
	return (init_AnalysisEvidenceSources = __esmMin((() => {
		init_artifactInspection();
		init_evidence();
		init_jsonValueByteLength();
		init_result();
		analysisEvidenceSources = (complete) => {
			const embedded = complete.operation === "inspect_artifact" ? readArtifactInspectionSources(complete.normalized_result) : ok([]);
			if (!embedded.ok) return err(embedded.error.retainPartialObservation(complete));
			return ok([...embedded.value, complete]);
		};
		SOURCE_CLOSURE_INLINE_BYTES = 64 * 1024;
		SOURCE_CLOSURE_LISTED_OMISSIONS = 64;
		SOURCE_CLOSURE_RECOVERY = "No bundle was written and this invocation retains nothing after exit. Keep any records shown here, or run the operation again after following remediation; that is a new observation and may differ.";
		collectSourceClosure = (observation, captured, options) => {
			const inspection = analysisEvidenceSources(observation);
			const embedded = new Map((inspection.ok ? inspection.value : []).map((record) => [record.evidence_id, record]));
			const held = new Map(captured.map((record) => [record.evidence_id, record]));
			const closure = new Set([observation.evidence_id]);
			for (const evidenceId of observation.evidence_links) closure.add(evidenceId);
			for (const evidenceId of held.keys()) closure.add(evidenceId);
			const records = [];
			const omitted = [];
			let omittedCount = 0;
			let inlineBytes = options.inlineRecords ? SOURCE_CLOSURE_INLINE_BYTES : 0;
			const omit = (evidenceId, reason) => {
				omittedCount += 1;
				if (omitted.length < SOURCE_CLOSURE_LISTED_OMISSIONS) omitted.push({
					evidence_id: evidenceId,
					reason
				});
			};
			for (const evidenceId of closure) {
				if (evidenceId === observation.evidence_id) continue;
				const inObservation = embedded.get(evidenceId);
				const record = inObservation ?? held.get(evidenceId);
				if (record === undefined) {
					omit(evidenceId, "not_captured");
					continue;
				}
				for (const link of record.evidence_links) closure.add(link);
				if (inObservation !== undefined) continue;
				const bytes = jsonValueByteLength(record, inlineBytes);
				if (bytes > inlineBytes) {
					omit(evidenceId, "not_inlined");
					continue;
				}
				records.push(record);
				inlineBytes -= bytes;
			}
			if (closure.size === 1) return undefined;
			return {
				publication: "not_published",
				complete: omittedCount === 0,
				records,
				omitted_count: omittedCount,
				omitted,
				recovery: SOURCE_CLOSURE_RECOVERY
			};
		};
		undeliveredSourceClosure = (partialObservation, captured, options) => {
			try {
				const observation = tryParseEvidence(partialObservation);
				return observation === undefined ? undefined : collectSourceClosure(observation, captured, options);
			} catch (cause) {
				return {
					publication: "not_published",
					complete: false,
					collection_failure: cause instanceof Error ? cause.name : "unknown",
					recovery: SOURCE_CLOSURE_RECOVERY
				};
			}
		};
	})))();
}

//#endregion
//#region dist/application/EvidenceBundleCommands.js
var importEvidenceBundleCommand, exportEvidenceBundleCommand, deliverAnalysisEvidence, publishEvidenceDelivery, evidenceDeliveryCommitted, persistEvidenceBundleCommand, compareEvidenceBundlesCommand, projectWrite, inspectEvidenceBundleCommand, withBundleReadResources;
function init_EvidenceBundleCommands() {
	return (init_EvidenceBundleCommands = __esmMin((() => {
		init_AnalysisEvidenceSources();
		init_queuedInterrupts();
		init_callerPath();
		init_JsonAuthenticationHeadroom();
		init_evidenceErrors();
		init_analysisErrorCore();
		init_evidence();
		init_evidenceBundle();
		init_jsonValue();
		init_result();
		init_bundleComparison();
		init_ArtifactResourceScope();
		init_EvidenceBundleFiles();
		init_InspectEvidenceBundle();
		init_AnalysisViewService();
		importEvidenceBundleCommand = async (path, signal) => {
			return withBundleReadResources(async (resources) => {
				const loaded = await readEvidenceBundle(path, signal, resources, "import_evidence_bundle");
				if (!loaded.ok) return loaded;
				return ok({
					imported: loaded.value.records.length,
					unknowns_added: loaded.value.unknowns.length,
					total: loaded.value.records.length
				});
			}, "import_evidence_bundle", signal);
		};
		exportEvidenceBundleCommand = async (sourcePath, outputPath, overwrite, signal) => {
			const loaded = await withBundleReadResources((resources) => readImmutableEvidenceBundle(sourcePath, signal, resources, "export_evidence_bundle"), "export_evidence_bundle", signal);
			if (!loaded.ok) return loaded;
			const written = await persistEvidenceBundleCommand(loaded.value, outputPath, overwrite, signal, "export_evidence_bundle");
			await dispatchQueuedInterrupts();
			if (written.ok && signal?.aborted) return err(new AnalysisCancelledError("export_evidence_bundle", {
				cause: signal.reason,
				diagnostics: { evidence_bundle: { ...written.value } }
			}));
			return projectWrite(loaded.value, written);
		};
		deliverAnalysisEvidence = async (evidence, outputPath, detail = "complete", signal) => {
			const headroom = requireAuthenticationHeadroom(evidence, {
				operation: evidence.operation,
				path: absoluteCallerPath(outputPath),
				description: "Insufficient heap headroom to authenticate the complete parent Evidence"
			});
			if (!headroom.ok) return err(headroom.error.retainPartialObservation(evidence));
			const sourceEvidence = analysisEvidenceSources(evidence);
			if (!sourceEvidence.ok) return sourceEvidence;
			const bundle = createImmutableEvidenceBundle(sourceEvidence.value);
			const delivered = detail === "summary" ? inspectAnalysisViewValidated({
				source: {
					kind: "retained-evidence",
					evidence_id: evidence.evidence_id
				},
				view: { kind: "summary" }
			}, (id) => bundle.records.find((record) => record.evidence_id === id)) : ok(evidence);
			if (!delivered.ok) return delivered;
			const selected = detail === "summary" && evidence.caller_input_path !== undefined ? withEvidenceCallerInputPath(delivered.value, evidence.caller_input_path) : delivered.value;
			const published = await publishEvidenceDelivery({
				bundle,
				complete: evidence,
				delivered: selected,
				outputPath,
				operation: evidence.operation,
				signal
			});
			return published.ok ? ok(published.value.delivered) : published;
		};
		publishEvidenceDelivery = async (input) => {
			const { signal, operation } = input;
			const written = await persistEvidenceBundleCommand(input.bundle, input.outputPath, false, signal, operation);
			await dispatchQueuedInterrupts();
			if (!written.ok) {
				const original = written.error;
				const failure = original instanceof EvidenceFileError && original.reason === "exists" ? new EvidenceFileError(original.operation, original.reason, {
					cause: original,
					...original.path === undefined ? {} : { path: original.path },
					userMessage: "Evidence file already exists. Choose another output path.",
					cleanup: original.cleanup,
					diagnostics: original.diagnostics
				}).bindCleanupDependencies([original]) : original;
				return err(failure.retainPartialObservation(input.complete));
			}
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, {
				cause: signal.reason,
				partialObservation: input.delivered,
				diagnostics: { evidence_bundle: { ...written.value } }
			}));
			return ok({
				delivered: input.delivered,
				evidenceBundle: written.value
			});
		};
		evidenceDeliveryCommitted = (error) => error.diagnostics?.evidence_bundle !== undefined || error instanceof EvidenceFileError && error.published !== undefined;
		persistEvidenceBundleCommand = async (bundle, outputPath, overwrite, signal, operation) => {
			const resources = new ArtifactResourceScope();
			const written = await writeEvidenceBundle(bundle, outputPath, overwrite, resources, signal, operation);
			if (written.ok) return written;
			await resources.close().catch(() => undefined);
			if (!written.error.cleanupIncomplete && written.error instanceof EvidenceFileError && written.error.published?.path !== undefined) {
				return ok({
					path: written.error.published.path,
					bytes: written.error.published.bytes
				});
			}
			return written;
		};
		compareEvidenceBundlesCommand = async (input) => {
			return withBundleReadResources(async (resources) => {
				const loaded = await readComparisonEvidenceBundles(input.leftPath, input.rightPath, input.signal, resources);
				if (!loaded.ok) return loaded;
				const { left, right } = loaded.value;
				try {
					return ok(jsonValueSchema.parse(compareBundles(left, right, input.recordPairs)));
				} catch (cause) {
					if (cause instanceof AnalysisInputError) return err(cause);
					throw cause;
				}
			}, "compare_bundles", input.signal);
		};
		projectWrite = (bundle, written) => written.ok ? ok(evidenceBundleExportReceipt(bundle, written.value)) : err(written.error);
		inspectEvidenceBundleCommand = async (input, signal) => {
			return withBundleReadResources(async (resources) => {
				const loaded = await readEvidenceBundle(input.path, signal, resources, "get_evidence_bundle");
				return loaded.ok ? inspectEvidenceBundle(loaded.value, input) : loaded;
			}, "get_evidence_bundle", signal);
		};
		withBundleReadResources = async (read, operation, signal) => {
			const resources = new ArtifactResourceScope();
			let result;
			try {
				result = await read(resources);
			} finally {
				await resources.close().catch(() => undefined);
				await dispatchQueuedInterrupts();
			}
			return result.ok && signal?.aborted ? err(new AnalysisCancelledError(operation, {
				cause: signal.reason,
				diagnostics: { completed_result: result.value }
			})) : result;
		};
	})))();
}

//#endregion
//#region dist/application/DirectAnalysis.js
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
				const { executeFunctionAnalysisEvidence } = await import("./createServer-CMxQrH3I.js").then((n) => (n.Qi(), n.Zi));
				let result = await executeFunctionAnalysisEvidence(session, input.arguments, input.openedTarget, { signal });
				result = retainAnalysisResultSources(tool, (source) => session.recordEvidence(source), result);
				return result.ok ? ok({ evidence: result.value }) : result;
			}
			if (isWorkflowEvidenceTool(tool)) {
				const { EnhancedTools } = await import("./createServer-CMxQrH3I.js").then((n) => (n.ea(), n.$i));
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
init_DirectAnalysis();
export { runDirectAnalysis, runManagedProviderExecution, runProviderAnalysis };