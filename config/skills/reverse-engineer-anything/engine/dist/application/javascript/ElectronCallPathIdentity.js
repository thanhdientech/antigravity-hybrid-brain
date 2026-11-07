import { sha256Text } from "../../domain/javascript/javascriptStaticAnalysisHelpers.js";
/** Keep wrapper-path identity source-scoped across both graph projections. */
export const electronCallPathId = (filePath, path) => sha256Text(JSON.stringify([filePath, path]));
