/** Token semantics shared by bundle producers and worker admission. */
export const JAVASCRIPT_AST_FINGERPRINT_ALGORITHM = "babel-ast-v3";
/**
 * Marks a Vite preload dependency written relative to the build output
 * directory (Vite's absolute-base form, such as `assets/chunk.js`). The
 * runtime helper prefixes the configured base, so the path is not a module
 * specifier and not relative to the importing chunk.
 */
export const VITE_OUTPUT_DEPENDENCY_PREFIX = "vite-output:";
/** Hard bounds applied to one AST-only JavaScript analysis. */
