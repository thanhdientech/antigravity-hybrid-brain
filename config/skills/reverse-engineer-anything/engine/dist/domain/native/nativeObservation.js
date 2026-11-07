import { invalidNativeOutput } from "./nativeProviderOutput.js";
import { z } from "zod";
import { procedureIdentitySchema } from "./procedureInfo.js";
import { AnalysisOutputError } from "../analysisErrorCore.js";
import { err, ok } from "../result.js";
import { nativeCallGraphSchema } from "./nativeCallGraph.js";
/** Exact containing-procedure outcome; valid absence is distinct from unreadable output. */
export const containingProcedureResolutionSchema = z.discriminatedUnion("found", [
    z.object({
        query_address: z.string(),
        found: z.literal(true),
        procedure: procedureIdentitySchema,
    }),
    z.object({
        query_address: z.string(),
        found: z.literal(false),
        procedure: z.null(),
        reason: z.enum(["outside_segments", "not_in_procedure"]),
    }),
]);
/** A trace can retain a reference when its provider cannot resolve ownership. */
export const traceContainingProcedureSchema = z.union([
    containingProcedureResolutionSchema,
    z.strictObject({
        query_address: z.string(),
        status: z.literal("unavailable"),
        provider_id: z.string(),
        reason: z.string(),
    }),
]);
/** Validate provider procedure facts before a workflow interprets absence. */
export const parseContainingProcedureResolution = (value) => {
    const parsed = containingProcedureResolutionSchema.safeParse(value);
    return parsed.success
        ? ok(parsed.data)
        : err(new AnalysisOutputError("resolve_containing_procedure", "expected a containing-procedure resolution", { cause: parsed.error }));
};
export const NATIVE_PRIMITIVE_OBSERVATION_OPERATIONS = [
    "procedure_address",
    "procedure_callees",
    "procedure_callers",
    "resolve_containing_procedure",
];
export const NATIVE_OBSERVATION_OPERATIONS = [
    ...NATIVE_PRIMITIVE_OBSERVATION_OPERATIONS,
    "get_call_graph",
    "xrefs",
];
export const nativeAddressListSchema = z.array(z.string());
export const nativeObservationSourceSchemas = {
    procedure_address: z.string(),
    procedure_callees: nativeAddressListSchema,
    procedure_callers: nativeAddressListSchema,
    xrefs: nativeAddressListSchema,
    resolve_containing_procedure: containingProcedureResolutionSchema,
    get_call_graph: nativeCallGraphSchema,
};
/** One operation family shared by view projection and response-budget recovery. */
export const isNativeObservationOperation = (operation) => NATIVE_OBSERVATION_OPERATIONS.some((supported) => supported === operation);
/** Parse the provider callee/caller address array. */
export const parseRelatedAddresses = (value, relation, operation = relation === "callees"
    ? "procedure_callees"
    : "procedure_callers") => {
    const parsed = z.array(z.string()).safeParse(value);
    return parsed.success
        ? ok(parsed.data)
        : invalidNativeOutput(operation, `${relation} list`, parsed.error);
};
