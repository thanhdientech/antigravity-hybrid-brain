import { AsyncLocalStorage } from "node:async_hooks";
import { DEFAULT_MCP_MAX_INPUT_ELEMENTS } from "../config/mcpInputBudget.js";
import { specTypeSchemas, isCallToolResult, isJSONRPCErrorResponse, isJSONRPCRequest, isJSONRPCNotification, isJSONRPCResultResponse, } from "@modelcontextprotocol/server";
import { analysisErrorProjectionSchema } from "../contracts/errorSchemas.js";
import { presentAdvertisedInputSchema, } from "../contracts/compactInputSchema.js";
import { presentAdvertisedOutputSchema } from "../contracts/compactOutputSchema.js";
import { compactPresentationForMcpOutputSchemaProfile, } from "../config/mcpOutputSchemaProfile.js";
import { transformAdvertisedInputJsonSchema } from "../contracts/toolSchemaMetadata.js";
import { AnalysisInputError, AnalysisResourceConstraintError, } from "../domain/analysisErrorCore.js";
import { projectAnalysisError } from "../domain/analysisErrorProjection.js";
import { projectInputIssueGroupsWithinBudget } from "../domain/inputIssueProjection.js";
import { createEvidence } from "../domain/evidence.js";
import { jsonObjectSchema } from "../domain/jsonValue.js";
import { mcpResponseOverflowProjection, } from "./ToolResultDelivery.js";
import { toolReturnsTargetContent } from "../contracts/toolEffects.js";
import { carriesTargetContentMarker, encodeToolResult, measureMcpResultWithinBudget, TARGET_CONTENT_RESULT_META, } from "./toolResultEncoding.js";
import { RequestTrackingMcpServer } from "./RequestTrackingMcpServer.js";
import { canReferenceInlineEvidence } from "./evidenceInputRegistration.js";
import { currentMcpToolRequest, McpToolRequest, runMcpToolRequest, } from "./McpToolRequest.js";
const currentRequestSignal = new AsyncLocalStorage();
/** Capture structured issues from the canonical validation the SDK already performs. */
const captureInputValidation = (tool, schema) => {
    const standard = schema["~standard"];
    if (standard.vendor !== "zod")
        return schema;
    return {
        ...schema,
        "~standard": {
            ...standard,
            validate: (value) => {
                const context = currentMcpToolRequest();
                const capture = (result) => {
                    if (context?.tool === tool && result.issues !== undefined)
                        context.validation = {
                            issues: result.issues,
                            input: value,
                        };
                    return result;
                };
                const result = standard.validate(value);
                return result instanceof Promise
                    ? result.then(capture)
                    : capture(result);
            },
        },
    };
};
/** Signal for the completion request currently being dispatched by the SDK. */
export const currentMcpRequestSignal = () => currentRequestSignal.getStore();
/** A Zod schema whose standard interface exposes a JSON Schema projection. */
const hasAdvertisedInputJsonSchema = (value) => {
    if (typeof value !== "object" || value === null)
        return false;
    const standard = Reflect.get(value, "~standard");
    if (typeof standard !== "object" || standard === null)
        return false;
    const jsonSchema = Reflect.get(standard, "jsonSchema");
    return (typeof jsonSchema === "object" &&
        jsonSchema !== null &&
        Reflect.get(jsonSchema, "input") !== undefined);
};
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
/** Recognize the SDK's argument diagnostic after its wire size is checked. */
const sdkInputValidationDiagnostic = (text, tool) => {
    if (text === undefined || tool === undefined)
        return undefined;
    const prefix = `Input validation error: Invalid arguments for tool ${tool}`;
    if (!text.startsWith(prefix) || text[prefix.length] !== ":")
        return undefined;
    const diagnostic = text.slice(prefix.length + 1).trimStart();
    return diagnostic.length === 0 ? undefined : diagnostic;
};
/** Place an SDK diagnostic at a field only when that same issue produced it. */
const partitionSdkDiagnostic = (validation, groups, diagnostic) => {
    if (validation === undefined ||
        groups === undefined ||
        validation.issues.length !== groups.length)
        return undefined;
    let offset = 0;
    const consume = (text) => {
        if (!diagnostic.startsWith(text, offset))
            return false;
        offset += text.length;
        return true;
    };
    const mapped = [];
    const remaining = [];
    for (let index = 0; index < validation.issues.length; index += 1) {
        const raw = validation.issues[index];
        const group = groups[index];
        if (raw === undefined || group === undefined)
            return undefined;
        if (index > 0 && !consume(", "))
            return undefined;
        const start = offset;
        for (let part = 0; part < raw.path.length; part += 1) {
            if (part > 0 && !consume("."))
                return undefined;
            if (!consume(String(raw.path[part])))
                return undefined;
        }
        if (raw.path.length > 0 && !consume(": "))
            return undefined;
        if (!consume(raw.message))
            return undefined;
        const issue = group.length === 1 ? group[0] : undefined;
        const sameField = issue !== undefined &&
            raw.path.length === issue.path.length &&
            raw.path.every((part, i) => part === issue.path[i]);
        const sameMessage = issue?.message !== undefined && issue.message === raw.message;
        const direct = raw.code !== "invalid_union" &&
            raw.code !== "invalid_key" &&
            raw.code !== "unrecognized_keys";
        if (sameField &&
            issue !== undefined &&
            (sameMessage || (direct && issue.message === undefined))) {
            mapped.push(issue.message === undefined
                ? { ...issue, message: raw.message }
                : issue);
        }
        else {
            for (const issue of group)
                mapped.push(issue);
            remaining.push(diagnostic.slice(start, offset));
        }
    }
    if (offset !== diagnostic.length)
        return undefined;
    return {
        issues: mapped,
        remaining: remaining.length === 0 ? undefined : remaining.join(", "),
    };
};
/** Replace the tool payload after the SDK codec while retaining its envelope. */
const replaceToolResultPayload = (original, replacement) => {
    const { content: _content, structuredContent: _structuredContent, isError: _isError, _meta, ...envelope } = original;
    return {
        ...envelope,
        ...replacement,
        ...(_meta === undefined && replacement._meta === undefined
            ? {}
            : { _meta: { ..._meta, ...replacement._meta } }),
    };
};
/**
 * Rewrite only client-facing output schemas; SDK registrations stay canonical.
 * `compact` bounds each advertised schema, while `off` omits it entirely.
 * The SDK memoises each tool's converted schema, so the caller passes a cache
 * keyed by that object; repeated listings reuse the same projection.
 */
const presentOutputSchemasForToolsList = (message, requestId, profile, compactedSchemas) => {
    if (profile === "full" ||
        !isJSONRPCResultResponse(message) ||
        message.id !== requestId ||
        !isRecord(message.result) ||
        !Array.isArray(message.result.tools))
        return message;
    const compactPresentation = compactPresentationForMcpOutputSchemaProfile(profile);
    return {
        ...message,
        result: {
            ...message.result,
            tools: message.result.tools.map((tool) => {
                if (!isRecord(tool))
                    return tool;
                if (compactPresentation === undefined) {
                    const { outputSchema: _outputSchema, ...advertisedTool } = tool;
                    return advertisedTool;
                }
                if (!isRecord(tool.outputSchema))
                    return tool;
                let outputSchema = compactedSchemas.get(tool.outputSchema);
                if (outputSchema === undefined) {
                    outputSchema = presentAdvertisedOutputSchema(tool.outputSchema, compactPresentation);
                    compactedSchemas.set(tool.outputSchema, outputSchema);
                }
                return { ...tool, outputSchema };
            }),
        },
    };
};
/** Release every transport-owned reference for a cancelled/completed request. */
export const forgetPendingMcpRequest = (pendingTools, pendingToolLists, pendingCompletions, id) => {
    pendingTools.delete(id);
    pendingToolLists.delete(id);
    pendingCompletions.get(id)?.abort();
    pendingCompletions.delete(id);
};
/** Bind oversized MCP error recovery to this server's Evidence ledger. */
export class EvidenceMcpServerCore extends RequestTrackingMcpServer {
    recordEvidence;
    delivery;
    outputSchemaProfile;
    advertisedToolFamilies;
    analysisSettings;
    /** Transport-owned Evidence uses the same lifetime as application writes. */
    withAdmittedAnalysis;
    identity;
    /** Composition supplies identity without importing the canonical schema graph. */
    get catalogIdentity() {
        if (this.identity === undefined)
            throw new Error("MCP catalog identity has not been configured");
        return this.identity;
    }
    /** Attach the process-owned session only after lazy runtime construction. */
    attachRuntime(recordEvidence, delivery, identity) {
        if (this.identity !== undefined &&
            this.identity.digests.combined_sha256 !== identity.digests.combined_sha256)
            throw new Error("MCP catalog identity does not match runtime");
        this.recordEvidence = recordEvidence;
        this.delivery = delivery;
        this.identity = identity;
    }
    promptCompletion;
    bindPromptCompletion(completion) {
        this.promptCompletion = completion;
        return completion;
    }
    registerCanonicalPrompt(name, config, callback) {
        return super.registerPrompt(name, config, callback);
    }
    compactPresentation;
    maximumInputElements;
    evidenceReferenceAlternatives = new Set();
    registerEvidenceReferenceAlternative(name) {
        this.evidenceReferenceAlternatives.add(name);
    }
    constructor(info, options, recordEvidence, delivery, compactPresentation = undefined, outputSchemaProfile = "full", identity, advertisedToolFamilies = undefined) {
        const maximumInputElements = options.maxToolInputElements ?? DEFAULT_MCP_MAX_INPUT_ELEMENTS;
        super(info, { ...options, maxToolInputElements: maximumInputElements });
        this.recordEvidence = recordEvidence;
        this.delivery = delivery;
        this.outputSchemaProfile = outputSchemaProfile;
        this.advertisedToolFamilies = advertisedToolFamilies;
        this.maximumInputElements = maximumInputElements;
        this.compactPresentation =
            compactPresentation === undefined
                ? undefined
                : { budgetBytes: compactPresentation.budgetBytes };
        this.identity = identity;
    }
    /**
     * Compact advertised input schemas and bound or omit output-schema
     * advertisements. Canonical parsers and contracts remain registered; both
     * output profiles validate successful structured results locally.
     * The signatures mirror the SDK's registrations so call sites keep their
     * inferred handler argument types.
     */
    registerTool(name, config, callback) {
        if (canReferenceInlineEvidence(config.inputSchema))
            this.registerEvidenceReferenceAlternative(name);
        const budget = this.compactPresentation?.budgetBytes;
        const inputSchema = budget !== undefined &&
            config !== undefined &&
            hasAdvertisedInputJsonSchema(config.inputSchema)
            ? transformAdvertisedInputJsonSchema(config.inputSchema, (projected) => presentAdvertisedInputSchema(projected, { budgetBytes: budget }))
            : undefined;
        const presentedSchema = inputSchema ?? config.inputSchema;
        const registeredConfig = presentedSchema === undefined
            ? config
            : {
                ...config,
                inputSchema: captureInputValidation(name, presentedSchema),
            };
        const scoped = async (input, context) => {
            const request = currentMcpToolRequest();
            request?.beginHandler();
            try {
                return await (this.analysisSettings === undefined
                    ? callback(input, context)
                    : this.analysisSettings.run(() => callback(input, context)));
            }
            finally {
                request?.finishHandler();
            }
        };
        const registered = this.bindTool(name, registeredConfig, scoped);
        if (!this.advertisesTool(name))
            registered.disable();
        return registered;
    }
    /** Whether this process advertises one named operation. */
    advertisesTool(_name) {
        return true;
    }
    /** Provider probes consult the registration scope before doing work. */
    advertisesFamily(family) {
        return (this.advertisedToolFamilies === undefined ||
            this.advertisedToolFamilies.has(family));
    }
    bindTool(name, config, callback) {
        return super.registerTool(name, config, callback);
    }
    /** Preserve the SDK transport lifecycle while retaining oversized errors. */
    connect(transport) {
        return super.connect(new ErrorEvidenceTransport(transport, () => this.recordEvidence, () => this.delivery, () => this.withAdmittedAnalysis, this.outputSchemaProfile, this.maximumInputElements, this.evidenceReferenceAlternatives));
    }
}
class ErrorEvidenceTransport {
    transport;
    currentEvidenceWriter;
    currentDelivery;
    currentAdmission;
    outputSchemaProfile;
    maximumInputElements;
    evidenceReferenceAlternatives;
    onclose;
    onerror;
    onmessage;
    hasPerRequestStream;
    pendingTools = new Map();
    pendingValidation = new Map();
    pendingToolLists = new Set();
    pendingCompletions = new Map();
    get recordEvidence() {
        return this.currentEvidenceWriter();
    }
    get delivery() {
        return this.currentDelivery();
    }
    /** Bounded projections already computed for this server's budget. */
    compactedOutputSchemas = new WeakMap();
    constructor(transport, currentEvidenceWriter, currentDelivery, currentAdmission, outputSchemaProfile, maximumInputElements, evidenceReferenceAlternatives) {
        this.transport = transport;
        this.currentEvidenceWriter = currentEvidenceWriter;
        this.currentDelivery = currentDelivery;
        this.currentAdmission = currentAdmission;
        this.outputSchemaProfile = outputSchemaProfile;
        this.maximumInputElements = maximumInputElements;
        this.evidenceReferenceAlternatives = evidenceReferenceAlternatives;
        if (transport.hasPerRequestStream !== undefined)
            this.hasPerRequestStream = transport.hasPerRequestStream;
        transport.onmessage = (message, extra) => {
            // The pinned SDK classifies generic method schema failures as internal
            // errors. Validate these wire requests with its canonical schemas before
            // dispatch, leaving callback failures and negotiated-era checks to it.
            if (isJSONRPCRequest(message)) {
                const schema = discoveryRequestSchema(message.method);
                const result = schema?.["~standard"].validate(message);
                if (result?.issues !== undefined) {
                    void this.send({
                        jsonrpc: "2.0",
                        id: message.id,
                        error: {
                            code: -32602,
                            message: `Invalid ${message.method} request: ${JSON.stringify(result.issues)}`,
                        },
                    }).catch((cause) => this.onerror?.(cause instanceof Error ? cause : new Error(String(cause))));
                    return;
                }
            }
            let validation;
            if (isJSONRPCRequest(message) &&
                message.method === "tools/call" &&
                typeof message.params?.["name"] === "string") {
                this.pendingTools.set(message.id, message.params["name"]);
                validation = new McpToolRequest(message.id, message.params["name"]);
                this.pendingValidation.set(message.id, validation);
            }
            if (isJSONRPCRequest(message) && message.method === "tools/list")
                this.pendingToolLists.add(message.id);
            if (isJSONRPCRequest(message) && message.method === "completion/complete")
                this.pendingCompletions.set(message.id, new AbortController());
            // The SDK suppresses replies after cancellation, so send() cannot release
            // this bookkeeping. Keep transport authentication outside retained data.
            if (isJSONRPCNotification(message) &&
                message.method === "notifications/cancelled") {
                const id = message.params?.["requestId"];
                if (typeof id === "string" || typeof id === "number") {
                    this.pendingValidation.get(id)?.cancel(message.params?.["reason"]);
                    this.pendingValidation.delete(id);
                    forgetPendingMcpRequest(this.pendingTools, this.pendingToolLists, this.pendingCompletions, id);
                }
            }
            const completion = isJSONRPCRequest(message) && message.method === "completion/complete"
                ? this.pendingCompletions.get(message.id)
                : undefined;
            if (validation !== undefined)
                runMcpToolRequest(validation, () => this.onmessage?.(message, extra));
            else if (completion === undefined)
                this.onmessage?.(message, extra);
            else
                currentRequestSignal.run(completion.signal, () => this.onmessage?.(message, extra));
        };
        transport.onerror = (error) => this.onerror?.(error);
        transport.onclose = () => {
            this.pendingTools.clear();
            for (const validation of this.pendingValidation.values())
                validation.cancel();
            this.pendingValidation.clear();
            this.pendingToolLists.clear();
            for (const completion of this.pendingCompletions.values())
                completion.abort();
            this.pendingCompletions.clear();
            this.onclose?.();
        };
    }
    get sessionId() {
        return this.transport.sessionId;
    }
    set sessionId(value) {
        this.transport.sessionId = value;
    }
    start() {
        return this.transport.start();
    }
    async close() {
        try {
            await this.transport.close();
        }
        finally {
            this.pendingTools.clear();
            for (const validation of this.pendingValidation.values())
                validation.cancel();
            this.pendingValidation.clear();
            this.pendingToolLists.clear();
            for (const completion of this.pendingCompletions.values())
                completion.abort();
            this.pendingCompletions.clear();
        }
    }
    setProtocolVersion(version) {
        this.transport.setProtocolVersion?.(version);
    }
    setSupportedProtocolVersions(versions) {
        this.transport.setSupportedProtocolVersions?.(versions);
    }
    async send(message, options) {
        const id = "id" in message &&
            (typeof message.id === "string" || typeof message.id === "number")
            ? message.id
            : undefined;
        const tool = id === undefined ? undefined : this.pendingTools.get(id);
        const scopedRequest = currentMcpToolRequest();
        const request = id === undefined ||
            (!isJSONRPCResultResponse(message) && !isJSONRPCErrorResponse(message))
            ? undefined
            : (this.pendingValidation.get(id) ??
                (scopedRequest?.id === id ? scopedRequest : undefined));
        const rewritesOutputSchemas = this.outputSchemaProfile !== "full" &&
            id !== undefined &&
            this.pendingToolLists.has(id);
        try {
            const publish = async () => {
                const recovered = this.recoverProtocolError(message, tool);
                const advertised = rewritesOutputSchemas
                    ? presentOutputSchemasForToolsList(recovered, id, this.outputSchemaProfile, this.compactedOutputSchemas)
                    : recovered;
                await this.publish(advertised, tool, options, request);
            };
            const admission = this.currentAdmission();
            if (admission !== undefined &&
                request?.holdsAdmission !== true &&
                isJSONRPCResultResponse(message) &&
                isCallToolResult(message.result) &&
                message.result.isError === true) {
                // SDK failures bypass application handlers. Admit both retention and
                // publication so reset cannot clear a newly offered reference between
                // those two steps, and shutdown/cancellation cannot create a late write.
                const admitted = await admission(tool ?? "mcp_tool_error", request?.cancellation.signal, publish);
                if (!admitted.ok)
                    await this.publish({
                        ...message,
                        result: replaceToolResultPayload(message.result, this.delivery.toErrorToolResult(admitted.error, tool !== undefined && toolReturnsTargetContent(tool))),
                    }, tool, options, request);
            }
            else
                await publish();
        }
        finally {
            request?.finishPublication();
            if (!isJSONRPCRequest(message) && id !== undefined) {
                this.pendingValidation.delete(id);
                forgetPendingMcpRequest(this.pendingTools, this.pendingToolLists, this.pendingCompletions, id);
            }
        }
    }
    /** Keep the SDK wire envelope while removing private diagnostic carriers. */
    async publish(message, tool, options, request) {
        request?.beginPublication();
        if (!isJSONRPCResultResponse(message) ||
            !isCallToolResult(message.result) ||
            message.result.isError !== true) {
            await this.transport.send(message, options);
            return;
        }
        // Oversized recovery has already consumed this private structured carrier.
        const { structuredContent: _diagnostic, ...result } = message.result;
        // SDK-built errors bypass ToolResultDelivery's target-content marker.
        const marked = tool !== undefined &&
            toolReturnsTargetContent(tool) &&
            !carriesTargetContentMarker(result)
            ? {
                ...result,
                _meta: { ...result._meta, ...TARGET_CONTENT_RESULT_META },
            }
            : result;
        await this.transport.send({ ...message, result: marked }, options);
    }
    recoverError(message, tool) {
        if (!isJSONRPCResultResponse(message) ||
            !isCallToolResult(message.result) ||
            message.result.isError !== true)
            return message;
        const budget = this.delivery.resultBudgetBytes;
        // Count the provenance marker exactly as the projected error did, and keep
        // it on the replacement: the retained original may hold target content.
        const targetContent = carriesTargetContentMarker(message.result) ||
            (tool !== undefined && toolReturnsTargetContent(tool));
        // SDK validation failures have no structured carrier. Size their existing
        // text-only result without serializing the complete JSON-RPC message.
        const isStructured = message.result.structuredContent !== undefined;
        const structured = isStructured
            ? jsonObjectSchema.parse(message.result.structuredContent)
            : undefined;
        const sdkResultWithMarker = !isStructured &&
            targetContent &&
            !carriesTargetContentMarker(message.result)
            ? {
                ...message.result,
                _meta: {
                    ...message.result._meta,
                    ...TARGET_CONTENT_RESULT_META,
                },
            }
            : message.result;
        const sdkDiagnostic = !isStructured
            ? message.result.content.find((item) => item.type === "text")?.text
            : undefined;
        let encoded = structured !== undefined
            ? encodeToolResult(structured, budget, "error-text", targetContent)
            : measureMcpResultWithinBudget(sdkResultWithMarker, budget);
        const normalized = encoded.ok
            ? this.normalizeSdkInputError(message, tool, targetContent, sdkDiagnostic, this.pendingValidation.get(message.id)?.validation)
            : undefined;
        if (normalized !== undefined &&
            isJSONRPCResultResponse(normalized) &&
            isCallToolResult(normalized.result)) {
            // The structured diagnostic is a private carrier removed before sending.
            // Measure the actual wire result, including its preserved SDK metadata.
            const { structuredContent, ...wireResult } = normalized.result;
            encoded =
                normalized.result.content.length === 0
                    ? encodeToolResult(jsonObjectSchema.parse(structuredContent), budget, "error-text", targetContent)
                    : measureMcpResultWithinBudget(wireResult, budget);
            if (encoded.ok)
                return normalized;
            // JSON escaping and recovery fields can exceed the budget even when
            // the original SDK result fits. Retain that original before replacing it.
        }
        if (encoded.ok)
            return message;
        const operation = tool ?? "mcp_tool_error";
        const originalResult = jsonObjectSchema.parse(message.result);
        const retainedResult = structured ?? originalResult;
        const originalError = isStructured
            ? analysisErrorProjectionSchema.safeParse(structured?.["error"])
            : undefined;
        // Retain the complete original response, including SDK validation text.
        // The SDK error contains its rendered issue, not a separate argument bag;
        // transport authentication and caller arguments are never added here.
        const evidence = createEvidence(undefined, { id: "rea-mcp", name: "REA MCP delivery", version: "1" }, {
            operation: "mcp_tool_error",
            parameters: { tool_name: operation },
            result: sdkDiagnostic === undefined
                ? retainedResult
                : {
                    boundary: "sdk-input-validation",
                    diagnostic_preview: sdkDiagnostic.slice(0, 256),
                    diagnostic_truncated: sdkDiagnostic.length > 256,
                },
            rawResult: originalResult,
        });
        const recorded = this.recordEvidence?.(evidence);
        const retained = recorded !== undefined && recorded.ok;
        const projected = mcpResponseOverflowProjection({
            completed: false,
            constraint: encoded.constraint,
            effectiveResponseBytes: this.delivery.maximumResponseBytes,
            nextStep: retained
                ? "Export the retained original error through export_evidence_bundle to a caller-selected path. The connection remains usable."
                : encoded.constraint === "string-length"
                    ? "The original error could not be retained by this server. Use complete CLI JSON output when the analysis completed. Repeating the unchanged MCP call fails the same way."
                    : "The original error could not be retained by this server. Restart REA with a larger REA_MCP_MAX_RESPONSE_BYTES and a matching client receive buffer, then retry.",
        });
        const replacement = this.transportConstraintResult(operation, projected.reason, projected.remediationAction, {
            boundary: "mcp-response",
            ...(originalError?.success
                ? { original_error_code: originalError.data.code }
                : {}),
            result_budget_bytes: budget,
            response_bytes_at_least: encoded.bytesAtLeast,
            constraint: encoded.constraint,
            ...(sdkDiagnostic === undefined
                ? {}
                : {
                    diagnostic_preview: sdkDiagnostic.slice(0, 256),
                    diagnostic_truncated: sdkDiagnostic.length > 256,
                }),
            ...(retained
                ? {
                    evidence_reference: {
                        kind: "retained-evidence",
                        evidence_id: evidence.evidence_id,
                    },
                }
                : { retention: recorded === undefined ? "unavailable" : "failed" }),
            ...(recorded !== undefined && !recorded.ok
                ? { retention_error: projectAnalysisError(recorded.error) }
                : {}),
        }, targetContent);
        return {
            ...message,
            result: replaceToolResultPayload(message.result, replacement),
        };
    }
    /**
     * Encode a transport-constraint error inside the MCP text budget.
     * The complete SDK diagnostic stays in retained Evidence. Its character
     * preview can still expand past the budget when quotes and backslashes are
     * escaped into that text, so shorten only the preview and keep the reference.
     */
    transportConstraintResult(operation, reason, remediationAction, limits, targetContent) {
        const deliver = (reportedLimits) => this.delivery.toErrorToolResult(new AnalysisResourceConstraintError(operation, "transport", reason, reportedLimits, { remediationAction }), targetContent);
        const delivered = deliver(limits);
        const preview = limits.diagnostic_preview;
        if (delivered.content.length > 0 || typeof preview !== "string")
            return delivered;
        let low = 0;
        let high = preview.length - 1;
        let fitted;
        let fittedLength = -1;
        while (low <= high) {
            const length = Math.floor((low + high) / 2);
            const candidate = deliver({
                ...limits,
                diagnostic_preview: preview.slice(0, length),
                diagnostic_truncated: true,
            });
            if (candidate.content.length > 0) {
                fitted = candidate;
                fittedLength = length;
                low = length + 1;
            }
            else
                high = length - 1;
        }
        if (fitted !== undefined && fittedLength > 0)
            return fitted;
        const { diagnostic_preview: _preview, ...withoutPreview } = limits;
        const omitted = deliver({
            ...withoutPreview,
            diagnostic_truncated: preview.length > 0,
        });
        return omitted.content.length > 0 || fitted === undefined
            ? omitted
            : fitted;
    }
    normalizeSdkInputError(message, tool, targetContent, text, validation) {
        if (tool === undefined ||
            text === undefined ||
            !isJSONRPCResultResponse(message) ||
            !isCallToolResult(message.result))
            return undefined;
        // The SDK owns counting and refusal before Standard Schema validation.
        // Recognize its exact wire refusal using our configured fact, without
        // reparsing the arguments or manufacturing a complete element count.
        if (text ===
            `Invalid arguments for tool ${tool}: arguments contain more than the maximum of ${String(this.maximumInputElements)} elements`) {
            const error = new AnalysisResourceConstraintError(tool, "transport", "The MCP tool arguments exceed the configured input element allowance; schema validation and tool execution did not start.", { max_input_elements: this.maximumInputElements }, {
                remediationAction: this.evidenceReferenceAlternatives.has(tool)
                    ? 'If the source Evidence is retained, use {"kind":"retained-evidence","evidence_id":"ev_..."} for declared Evidence fields; use a summary\'s parent_evidence_id for its complete source. Otherwise import the originating Evidence bundle when available. Reduce the arguments, or restart REA with a larger REA_MCP_MAX_INPUT_ELEMENTS allowance.'
                    : "Reduce the combined array elements and object members in the arguments, or restart REA with a larger REA_MCP_MAX_INPUT_ELEMENTS allowance for this workload.",
            });
            const result = this.delivery.toErrorToolResult(error, targetContent);
            return {
                ...message,
                result: replaceToolResultPayload(message.result, result),
            };
        }
        const diagnostic = sdkInputValidationDiagnostic(text, tool);
        if (diagnostic === undefined)
            return undefined;
        const groups = validation === undefined
            ? undefined
            : projectInputIssueGroupsWithinBudget(validation.issues, validation.input, this.delivery.resultBudgetBytes);
        const projectionLimited = validation !== undefined && groups === undefined;
        const summary = `The arguments for MCP tool ${tool} do not match its advertised input schema.`;
        const partitioned = partitionSdkDiagnostic(validation, groups, diagnostic);
        const issues = partitioned?.issues ?? groups?.flat();
        const error = new AnalysisInputError(tool, {
            userMessage: issues === undefined
                ? projectionLimited
                    ? `${summary} Field-level issue projection exceeded its response-derived allowance.`
                    : summary
                : partitioned !== undefined
                    ? partitioned.remaining === undefined
                        ? summary
                        : `${summary} ${partitioned.remaining}`
                    : `${summary} ${diagnostic}`,
        }, issues ?? [
            {
                path: [],
                reason: "invalid_value",
                message: diagnostic,
                ...(projectionLimited
                    ? { observed: { field_details: "omitted" } }
                    : {}),
            },
        ]);
        const result = this.delivery.toErrorToolResult(error, targetContent);
        return {
            ...message,
            result: replaceToolResultPayload(message.result, result),
        };
    }
    recoverProtocolError(message, tool) {
        const recovered = this.recoverError(message, tool);
        if (!isJSONRPCErrorResponse(recovered) ||
            tool === undefined ||
            recovered.error.code !== -32602 ||
            recovered.error.message !== `Tool ${tool} not found`)
            return recovered;
        return {
            ...recovered,
            error: {
                ...recovered.error,
                message: "The requested MCP tool is not advertised by this REA server. Call tools/list, select an advertised tool, and retry; do not repeat the unknown tool name.",
            },
        };
    }
}
const discoveryRequestSchema = (method) => {
    switch (method) {
        case "prompts/get":
            return specTypeSchemas.GetPromptRequest;
        case "prompts/list":
            return specTypeSchemas.ListPromptsRequest;
        case "completion/complete":
            return specTypeSchemas.CompleteRequest;
        case "tools/list":
            return specTypeSchemas.ListToolsRequest;
        default:
            return undefined;
    }
};
