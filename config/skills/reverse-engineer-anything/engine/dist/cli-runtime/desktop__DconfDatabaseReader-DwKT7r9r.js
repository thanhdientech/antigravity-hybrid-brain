import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { execFileOutput, execFileOutputFailure, init_ExecFileOutput } from "./ExecFileOutput-CjfCq1cQ.js";
import { dirname, join } from "node:path";
import { writeFile } from "node:fs/promises";

//#region dist/desktop/DconfDatabaseReader.js
var DCONF_TIMEOUT_MS, DCONF_MAX_BUFFER, dumpDconfDatabase;
function init_DconfDatabaseReader() {
	return (init_DconfDatabaseReader = __esmMin((() => {
		init_ExecFileOutput();
		DCONF_TIMEOUT_MS = 3e4;
		DCONF_MAX_BUFFER = 16 * 1024 * 1024;
		dumpDconfDatabase = async (database, environment, signal) => {
			try {
				const profile = join(dirname(database), "profile");
				await writeFile(profile, `file-db:${database}\n`, {
					mode: 384,
					flag: "wx"
				});
				const command = environment.REA_DCONF_COMMAND ?? "dconf";
				const { stdout } = await execFileOutput(command, ["dump", "/"], {
					env: {
						PATH: environment.PATH ?? "",
						DCONF_PROFILE: profile
					},
					timeout: DCONF_TIMEOUT_MS,
					maxBuffer: DCONF_MAX_BUFFER,
					...signal === undefined ? {} : { signal }
				});
				return {
					ok: true,
					text: stdout
				};
			} catch (cause) {
				signal?.throwIfAborted();
				const failure = execFileOutputFailure(cause);
				if (failure?.code === "ENOENT") return {
					ok: false,
					error: "dconf is not installed (dconf-cli); set REA_DCONF_COMMAND"
				};
				return {
					ok: false,
					error: failure === undefined ? String(cause) : failure.stderr.trim()
				};
			}
		};
	})))();
}

//#endregion
init_DconfDatabaseReader();
export { dumpDconfDatabase };