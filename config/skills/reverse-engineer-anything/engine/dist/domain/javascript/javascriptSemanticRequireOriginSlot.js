/**
 * Require-origin queries are owned by javascriptSemanticRequireOrigin.ts, which
 * also depends on evaluation. Lower layers read them through this slot so the
 * import edge stays one way. The owner assigns both readers when it loads.
 */
export const semanticRequireOriginReaders = { origin: undefined, loader: undefined };
export const readSemanticRequireOrigin = (node, state) => semanticRequireOriginReaders.origin?.(node, state);
export const readSemanticRequireLoader = (node, state, factoryBindingIds) => semanticRequireOriginReaders.loader?.(node, state, factoryBindingIds) ??
    "unknown";
