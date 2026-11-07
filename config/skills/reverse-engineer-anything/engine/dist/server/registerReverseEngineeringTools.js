import { projectAnalysisError } from "../domain/analysisErrorProjection.js";
import { resolveRizinCommandRequest, } from "../application/reverse/ReverseEngineeringService.js";
import { toolContract } from "../contracts/toolContracts.js";
import { logToolExecution } from "./toolLogging.js";
import { toolRegistrationOptions } from "./toolRegistrationOptions.js";
import { runAdmittedToolOperation } from "./admittedToolOperation.js";
import { AnalysisCancelledError, AnalysisOutputError, } from "../domain/analysisErrorCore.js";
import { retainExternalMutationCancellation } from "./externalMutationAdmission.js";
/** Register objdump and Rizin operations against their exact named contracts. */
export const registerReverseEngineeringTools = (server, service, logger, delivery, recordEvidence, withAdmittedAnalysis, invalidateSnapshotForExternalMutation, withAdmittedExternalMutation, evidenceById) => {
    const objdump = toolContract("inspect_with_objdump");
    const rizin = toolContract("execute_rizin_command");
    server.registerTool(objdump.name, toolRegistrationOptions(objdump), (input, context) => runAdmittedToolOperation({ delivery }, withAdmittedAnalysis, objdump.name, context.mcpReq.signal, async () => {
        const result = await logToolExecution(logger, objdump.name, () => service.inspectWithObjdump(input, {
            signal: context.mcpReq.signal,
        }, { recordEvidence, evidenceById }));
        if (!result.ok)
            return delivery.toPartialErrorToolResult(result.error, objdump.returnsTargetContent, recordEvidence);
        return delivery.toEvidenceToolResult(result.value, objdump, recordEvidence?.(result.value));
    }));
    server.registerTool(rizin.name, toolRegistrationOptions(rizin), async (input, context) => {
        const parsed = resolveRizinCommandRequest(input);
        if (parsed.ok && withAdmittedExternalMutation !== undefined) {
            const cleanup = await service.retryCleanup(rizin.name);
            if (!cleanup.ok)
                return delivery.toPartialErrorToolResult(cleanup.error, rizin.returnsTargetContent, recordEvidence);
            const admitted = await withAdmittedExternalMutation(parsed.value.path, context.mcpReq.signal, async () => {
                invalidateSnapshotForExternalMutation?.();
                return logToolExecution(logger, rizin.name, () => service.executeRizinCommandValidated(parsed.value, {
                    signal: context.mcpReq.signal,
                }));
            }, (value, cause) => {
                if (cause instanceof AnalysisCancelledError) {
                    return retainExternalMutationCancellation(value, cause, (evidence) => evidence);
                }
                if (!value.ok)
                    return value.error.retainSecondaryFailure(cause, {
                        retirement_error: projectAnalysisError(cause),
                    });
                const observation = value.value;
                return new AnalysisOutputError(rizin.name, "Rizin may have changed the bound artifact, but the active analysis session could not be retired.", {
                    cause,
                    ...(cause.capturedOutput === undefined
                        ? {}
                        : { capturedOutput: cause.capturedOutput }),
                    ...(observation === undefined
                        ? {}
                        : { partialObservation: observation }),
                });
            });
            if (!admitted.ok)
                return delivery.toPartialErrorToolResult(admitted.error, rizin.returnsTargetContent, recordEvidence);
            const result = admitted.value;
            if (!result.ok)
                return delivery.toPartialErrorToolResult(result.error, rizin.returnsTargetContent, recordEvidence);
            return delivery.toEvidenceToolResult(result.value, rizin, recordEvidence?.(result.value));
        }
        return runAdmittedToolOperation({ delivery }, withAdmittedAnalysis, rizin.name, context.mcpReq.signal, async () => {
            if (invalidateSnapshotForExternalMutation !== undefined && parsed.ok)
                invalidateSnapshotForExternalMutation();
            const result = await logToolExecution(logger, rizin.name, () => parsed.ok
                ? service.executeRizinCommandValidated(parsed.value, {
                    signal: context.mcpReq.signal,
                })
                : Promise.resolve(parsed));
            if (!result.ok)
                return delivery.toPartialErrorToolResult(result.error, rizin.returnsTargetContent, recordEvidence);
            return delivery.toEvidenceToolResult(result.value, rizin, recordEvidence?.(result.value));
        });
    });
};
