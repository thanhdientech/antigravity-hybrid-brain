import { z } from "zod";
import { ok } from "../result.js";
import { AnalysisOutputError } from "../analysisErrorCore.js";
import { invalidNativeOutput } from "./nativeProviderOutput.js";
/** Parse the provider document-name array. */
export const parseDocuments = (value, operation = "list_documents") => {
    const parsed = z.array(z.string()).safeParse(value);
    return parsed.success
        ? ok(parsed.data)
        : invalidNativeOutput(operation, "document list", parsed.error);
};
