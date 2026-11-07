import { stat } from "node:fs/promises";
import { join } from "node:path";
import { assertRegularFileActive, RegularFileChangedError, sameRegularFileState, } from "../filesystem/RegularFile.js";
export const assertKunaFileState = async (path, expected, signal) => {
    assertRegularFileActive(signal);
    if (!sameRegularFileState(expected, await stat(path)))
        throw new RegularFileChangedError(path);
    assertRegularFileActive(signal);
};
export const assertKunaProjectState = async (directory, files, states, signal) => {
    for (const role of Object.keys(files))
        await assertKunaFileState(join(directory, files[role].path), states[role], signal);
};
