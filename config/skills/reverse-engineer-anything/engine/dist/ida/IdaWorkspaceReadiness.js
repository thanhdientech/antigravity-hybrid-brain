import { constants } from "node:fs";
import { access, stat } from "node:fs/promises";
import { privateRuntimeRootCapability } from "../process/PrivateRuntimeRoot.js";
import { resolveIdaWorkspaceParent } from "./IdaWorkspace.js";
/** Inspect local prerequisites without creating a workspace or launching IDA. */
export const inspectIdaWorkspaceReadiness = async (root) => {
    const privacy = privateRuntimeRootCapability();
    let unusable;
    try {
        const parent = await resolveIdaWorkspaceParent(root);
        if (!(await stat(parent)).isDirectory())
            unusable = `IDA workspaceRoot ${root ?? "the system temporary directory"} is not a directory.`;
        else
            await access(parent, constants.W_OK | constants.X_OK);
    }
    catch (cause) {
        unusable = `IDA workspaceRoot ${root ?? "the system temporary directory"} is not a usable directory: ${cause instanceof Error ? cause.message : String(cause)}`;
    }
    return { privacy, unusable };
};
