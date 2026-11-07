import { EnhancedTools } from "../application/EnhancedTools.js";
import { composedLimitationBudget, executeComposedWorkflow, createWorkflowEvidence, retainPartialWorkflowEvidence, workflowSnapshotRecord, recordWorkflowUnknowns, } from "../application/WorkflowEvidence.js";
import { toolContract } from "../contracts/toolContracts.js";
import { ok } from "../domain/result.js";
import { mcpProgressReporter } from "./mcpProgress.js";
import { logToolExecution } from "./toolLogging.js";
import { toolRegistrationOptions } from "./toolRegistrationOptions.js";
import { executeFunctionAnalysisEvidence } from "../application/FunctionAnalysisEvidence.js";
import { retainAnalysisResultSources } from "../application/investigation/recordEvidenceSources.js";
import { requireAnalysisViewRetention, summarizeRetainedAnalysis, } from "../application/analysisView/AnalysisViewService.js";
import { reportOperationStart, reportOperationEnd, } from "./operationProgress.js";
/** Register composed workflows against the same port as direct bridge tools. */
// oxlint-disable-next-line max-lines-per-function -- direct SDK calls retain each schema-handler type correlation.
export const registerEnhancedTools = (server, options) => {
    const registration = { ...options, delivery: server.delivery };
    const nativeDispatchMetadata = toolContract("inspect_native_dispatch_metadata");
    const objcClasses = toolContract("get_objc_classes");
    const objcProtocols = toolContract("get_objc_protocols");
    const batchDecompile = toolContract("batch_decompile");
    const decompileAll = toolContract("decompile_all");
    const callGraph = toolContract("get_call_graph");
    const swiftTypes = toolContract("analyze_swift_types");
    const xrefsToName = toolContract("find_xrefs_to_name");
    const binaryOverview = toolContract("binary_overview");
    const analyzeFunction = toolContract("analyze_function");
    const inspectNativeApi = toolContract("inspect_native_api");
    const traceFeature = toolContract("trace_feature");
    const traceCallPath = toolContract("trace_call_path");
    const traceNativeUiAction = toolContract("trace_native_ui_action");
    const traceNativeValues = toolContract("trace_native_values");
    server.registerTool(traceNativeValues.name, toolRegistrationOptions(traceNativeValues), (input, context) => executeEnhancedTool(registration, traceNativeValues, {
        validatedCall: { name: "trace_native_values", input },
        context,
    }));
    server.registerTool(nativeDispatchMetadata.name, toolRegistrationOptions(nativeDispatchMetadata), (input, context) => executeEnhancedTool(registration, nativeDispatchMetadata, {
        validatedCall: { name: "inspect_native_dispatch_metadata", input },
        context,
    }));
    server.registerTool(objcClasses.name, toolRegistrationOptions(objcClasses), (input, context) => executeEnhancedTool(registration, objcClasses, {
        validatedCall: { name: "get_objc_classes", input },
        context,
    }));
    server.registerTool(objcProtocols.name, toolRegistrationOptions(objcProtocols), (input, context) => executeEnhancedTool(registration, objcProtocols, {
        validatedCall: { name: "get_objc_protocols", input },
        context,
    }));
    server.registerTool(batchDecompile.name, toolRegistrationOptions(batchDecompile), ({ detail, ...input }, context) => executeEnhancedTool(registration, batchDecompile, {
        validatedCall: { name: "batch_decompile", input },
        context,
        detail,
    }));
    server.registerTool(decompileAll.name, toolRegistrationOptions(decompileAll), (input, context) => executeEnhancedTool(registration, decompileAll, {
        validatedCall: { name: "decompile_all", input },
        context,
    }));
    server.registerTool(callGraph.name, toolRegistrationOptions(callGraph), ({ detail, ...input }, context) => executeEnhancedTool(registration, callGraph, {
        validatedCall: { name: "get_call_graph", input },
        context,
        detail,
    }));
    server.registerTool(swiftTypes.name, toolRegistrationOptions(swiftTypes), (input, context) => executeEnhancedTool(registration, swiftTypes, {
        validatedCall: { name: "analyze_swift_types", input },
        context,
    }));
    server.registerTool(xrefsToName.name, toolRegistrationOptions(xrefsToName), (input, context) => executeEnhancedTool(registration, xrefsToName, {
        validatedCall: { name: "find_xrefs_to_name", input },
        context,
    }));
    server.registerTool(binaryOverview.name, toolRegistrationOptions(binaryOverview), (input, context) => executeEnhancedTool(registration, binaryOverview, {
        validatedCall: { name: "binary_overview", input },
        context,
    }));
    server.registerTool(analyzeFunction.name, toolRegistrationOptions(analyzeFunction), ({ detail, ...providerInput }, context) => executeFunctionTool(registration, analyzeFunction, {
        detail,
        parameters: jsonParameters(providerInput),
        context,
    }));
    server.registerTool(inspectNativeApi.name, toolRegistrationOptions(inspectNativeApi), (input, context) => executeEnhancedTool(registration, inspectNativeApi, {
        validatedCall: { name: "inspect_native_api", input },
        context,
    }));
    server.registerTool(traceFeature.name, toolRegistrationOptions(traceFeature), ({ detail, ...input }, context) => executeEnhancedTool(registration, traceFeature, {
        detail,
        validatedCall: { name: "trace_feature", input },
        context,
    }));
    server.registerTool(traceCallPath.name, toolRegistrationOptions(traceCallPath), (input, context) => executeEnhancedTool(registration, traceCallPath, {
        validatedCall: { name: "trace_call_path", input },
        context,
    }));
    server.registerTool(traceNativeUiAction.name, toolRegistrationOptions(traceNativeUiAction), (input, context) => executeEnhancedTool(registration, traceNativeUiAction, {
        validatedCall: { name: "trace_native_ui_action", input },
        context,
    }));
};
const executeEnhancedTool = async (registration, contract, request) => {
    if (request.detail === "summary") {
        const ready = requireAnalysisViewRetention(request.validatedCall.name, {
            recordEvidence: registration.recordEvidence,
            evidenceById: registration.evidenceById,
        });
        if (!ready.ok)
            return registration.delivery.toCallToolResult(ready, contract);
    }
    const admitted = await registration.withAdmittedAnalysis(request.validatedCall.name, request.context.mcpReq.signal, async (admittedAnalysis) => {
        const { validatedCall, context } = request;
        const name = validatedCall.name;
        const progress = mcpProgressReporter(context);
        await reportOperationStart(progress, name);
        const parsedInput = validatedCall.input;
        const parameters = jsonParameters(parsedInput);
        const analysis = {
            resourceScope: admittedAnalysis.resourceScope,
            execute: (operation, operationParameters, executionOptions) => admittedAnalysis.execute(operation, operationParameters, {
                ...executionOptions,
                progress,
            }),
        };
        let result = await logToolExecution(registration.logger, name, () => executeComposedWorkflow(analysis, (observed) => new EnhancedTools(observed).executeValidated(validatedCall, context.mcpReq.signal), composedLimitationBudget(name)));
        retainPartialWorkflowEvidence(result, {
            target: registration.activeTarget?.(),
            operation: name,
            parameters,
            upstreamProfile: registration.analysisProfile?.(name),
        });
        result = retainAnalysisResultSources(name, registration.recordEvidence, result);
        const finish = async (response) => {
            await reportOperationEnd(progress, name, response.isError !== true);
            return response;
        };
        if (result.ok) {
            const evidence = createWorkflowEvidence({
                target: registration.activeTarget?.(),
                operation: name,
                parameters,
                result: result.value.result,
                upstreamProfile: registration.analysisProfile?.(name),
                upstreamLimitations: result.value.limitations,
                ...(result.value.evidenceLinks === undefined
                    ? {}
                    : { upstreamEvidenceLinks: result.value.evidenceLinks }),
            });
            const recorded = registration.recordEvidence?.(evidence);
            if (recorded !== undefined && !recorded.ok)
                return finish(registration.delivery.toCallToolResult(recorded, contract));
            if (name !== "trace_native_ui_action" &&
                registration.allowsSnapshotReplay?.(name) === true) {
                const workflowRecord = workflowSnapshotRecord(evidence, name, registration.analysisProfile?.(name), result.value.cachePolicy);
                if (workflowRecord !== undefined) {
                    const snapshot = registration.recordWorkflowSnapshot?.(workflowRecord);
                    if (snapshot !== undefined && !snapshot.ok)
                        return finish(registration.delivery.toCallToolResult(snapshot, contract));
                }
            }
            const unknowns = recordWorkflowUnknowns({
                name,
                result: result.value.result,
                evidenceId: evidence.evidence_id,
                recordUnknown: registration.recordUnknown,
                evidenceRetained: recorded?.ok === true,
            });
            if (!unknowns.ok)
                return finish(registration.delivery.toCallToolResult(unknowns, contract));
            const delivered = request.detail === "summary"
                ? summarizeRetainedAnalysis(evidence, {
                    recordEvidence: registration.recordEvidence,
                    evidenceById: registration.evidenceById,
                })
                : ok(evidence);
            if (!delivered.ok)
                return finish(registration.delivery.toCallToolResult(delivered, contract));
            return finish(registration.delivery.toEvidenceToolResult(delivered.value, contract, request.detail === "summary"
                ? registration.recordEvidence?.(delivered.value)
                : recorded));
        }
        return finish(deliverEnhancedFailure(registration, contract, result.error));
    });
    return admitted.ok
        ? admitted.value
        : registration.delivery.toCallToolResult(admitted, contract);
};
/**
 * analyze_function owns its MCP delivery: detail selects the response shape
 * and never reaches the provider, so parameters hold the provider input only.
 */
const executeFunctionTool = async (registration, contract, request) => {
    const { detail, context } = request;
    // Fail before analysis when a retained summary cannot keep its complete source.
    if (detail === "summary") {
        const ready = requireAnalysisViewRetention("analyze_function", {
            recordEvidence: registration.recordEvidence,
            evidenceById: registration.evidenceById,
        });
        if (!ready.ok)
            return registration.delivery.toCallToolResult(ready, contract);
    }
    const admitted = await registration.withAdmittedAnalysis("analyze_function", context.mcpReq.signal, async (analysis) => {
        const progress = mcpProgressReporter(context);
        await reportOperationStart(progress, "analyze_function");
        return deliverFunctionAnalysis(analysis, registration, contract, {
            ...request,
            progress,
        });
    });
    return admitted.ok
        ? admitted.value
        : registration.delivery.toCallToolResult(admitted, contract);
};
const deliverFunctionAnalysis = async (analysis, registration, contract, request) => {
    const { detail, parameters, context, progress } = request;
    let result = await logToolExecution(registration.logger, "analyze_function", () => executeFunctionAnalysisEvidence(analysis, parameters, registration.activeTarget?.(), {
        signal: context.mcpReq.signal,
        progress,
    }));
    result = retainAnalysisResultSources("analyze_function", registration.recordEvidence, result);
    await reportOperationEnd(progress, "analyze_function", result.ok);
    if (!result.ok)
        return deliverEnhancedFailure(registration, contract, result.error);
    if (detail === "summary") {
        const summary = summarizeRetainedAnalysis(result.value, {
            recordEvidence: registration.recordEvidence,
            evidenceById: registration.evidenceById,
        });
        if (!summary.ok)
            return registration.delivery.toCallToolResult(summary, contract);
        return registration.delivery.toEvidenceToolResult(summary.value, contract, registration.recordEvidence?.(summary.value));
    }
    return registration.delivery.toEvidenceToolResult(result.value, contract, registration.recordEvidence?.(result.value));
};
/**
 * Deliver an analysis failure with any partial Evidence it carries, whether a
 * stopped workflow or its failing read produced that partial.
 */
const deliverEnhancedFailure = (registration, contract, error) => registration.delivery.toPartialErrorToolResult(error, contract.returnsTargetContent, registration.recordEvidence);
const jsonParameters = (input) => Object.fromEntries(Object.entries(input).filter((entry) => entry[1] !== undefined));
