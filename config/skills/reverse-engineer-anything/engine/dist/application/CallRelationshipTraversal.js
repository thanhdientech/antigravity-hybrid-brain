import { parseRelatedAddresses } from "../domain/native/nativeObservation.js";
/** The provider read and response relation for each supported traversal direction. */
export const CALL_RELATIONSHIP_TRAVERSALS = {
    forward: { operation: "procedure_callees", relation: "callees" },
    backward: { operation: "procedure_callers", relation: "callers" },
};
/**
 * Whether a failed child read must end a traversal rather than become one of
 * its unknowns. A cancelled read ends it; so does a read whose provider cannot
 * confirm release of resources it owns, because that read has not finished and
 * dispatching more reads would build on that state.
 */
export const stopsTraversal = (error) => error._tag === "AnalysisCancelledError" || error.cleanupIncomplete;
/** Read and parse one procedure's direct relationships for a traversal. */
export const readCallRelationships = async (observe, direction, procedure, signal) => {
    const { operation, relation } = CALL_RELATIONSHIP_TRAVERSALS[direction];
    const execution = await observe(operation, { procedure }, signal, "provider");
    if (!execution.ok)
        return {
            status: stopsTraversal(execution.error) ? "stopped" : "unavailable",
            error: execution.error,
        };
    const related = parseRelatedAddresses(execution.value.result, relation, operation);
    return related.ok
        ? { status: "observed", execution: execution.value, related: related.value }
        : { status: "unreadable", error: related.error };
};
/** The admitted traversal's caveat when unconfirmed cleanup stopped it. */
export const cleanupStoppedTraversal = (procedure, unexpanded) => `Traversal stopped at ${procedure} because the provider did not confirm cleanup of resources it owns; ${unexpanded === 1 ? "1 discovered procedure was" : `${unexpanded} discovered procedures were`} not expanded.`;
