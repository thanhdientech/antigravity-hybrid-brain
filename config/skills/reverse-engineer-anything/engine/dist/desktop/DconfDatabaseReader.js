import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { execFileOutput, execFileOutputFailure, } from "../process/ExecFileOutput.js";
const DCONF_TIMEOUT_MS = 30_000;
const DCONF_MAX_BUFFER = 16 * 1024 * 1024;
/**
 * Dump a staged dconf user database with `dconf dump /`. A profile written
 * beside it, in the caller's private directory, names it as a file database,
 * so neither the user's live database nor the dconf service is involved.
 */
export const dumpDconfDatabase = async (database, environment, signal) => {
    try {
        const profile = join(dirname(database), "profile");
        await writeFile(profile, `file-db:${database}\n`, {
            mode: 0o600,
            flag: "wx",
        });
        const command = environment.REA_DCONF_COMMAND ?? "dconf";
        const { stdout } = await execFileOutput(command, ["dump", "/"], {
            env: { PATH: environment.PATH ?? "", DCONF_PROFILE: profile },
            timeout: DCONF_TIMEOUT_MS,
            maxBuffer: DCONF_MAX_BUFFER,
            ...(signal === undefined ? {} : { signal }),
        });
        return { ok: true, text: stdout };
    }
    catch (cause) {
        signal?.throwIfAborted();
        const failure = execFileOutputFailure(cause);
        if (failure?.code === "ENOENT")
            return {
                ok: false,
                error: "dconf is not installed (dconf-cli); set REA_DCONF_COMMAND",
            };
        return {
            ok: false,
            error: failure === undefined ? String(cause) : failure.stderr.trim(),
        };
    }
};
