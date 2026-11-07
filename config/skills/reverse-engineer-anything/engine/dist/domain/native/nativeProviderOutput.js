import { z } from "zod";
import { err } from "../result.js";
import { AnalysisOutputError } from "../analysisErrorCore.js";
export const invalidNativeOutput = (operation, expected, cause) => err(new AnalysisOutputError(operation, `Provider returned an invalid ${expected}`, {
    cause,
}));
