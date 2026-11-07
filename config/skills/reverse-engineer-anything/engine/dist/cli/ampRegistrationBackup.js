import { chmodSync, lstatSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { preserveCurrentRecoveryBackup, } from "../application/SetupRecoveryBackup.js";
import { err, ok } from "../domain/result.js";
const errorDetail = (cause) => cause instanceof Error ? cause.message : String(cause);
const isMissing = (cause) => typeof cause === "object" &&
    cause !== null &&
    "code" in cause &&
    cause.code === "ENOENT";
const restrictExistingBackup = (backupPath) => {
    let existing;
    try {
        existing = lstatSync(backupPath);
    }
    catch (cause) {
        if (isMissing(cause))
            return ok(undefined);
        return err({
            kind: "unreadable",
            path: backupPath,
            detail: `The existing Amp settings backup could not be checked: ${errorDetail(cause)}`,
        });
    }
    if (!existing.isFile())
        return err({
            kind: "occupied",
            path: backupPath,
            detail: "The existing Amp settings backup is not a regular file.",
        });
    try {
        chmodSync(backupPath, 0o600);
    }
    catch (cause) {
        return err({
            kind: "unreadable",
            path: backupPath,
            detail: `The existing Amp settings backup permissions could not be secured: ${errorDetail(cause)}`,
        });
    }
    return ok(undefined);
};
const copyPrivateBackup = async (sourcePath, backupPath) => {
    await writeFile(backupPath, await readFile(sourcePath), {
        flag: "wx",
        mode: 0o600,
    });
};
export const writeAmpRegistrationBackup = async (settingsPath, settingsText) => {
    const firstBackupPath = `${settingsPath}.rea.backup`;
    const firstRestricted = restrictExistingBackup(firstBackupPath);
    if (!firstRestricted.ok)
        return firstRestricted;
    const preserved = await preserveCurrentRecoveryBackup(firstBackupPath, settingsPath, settingsText, { copy: copyPrivateBackup });
    if (!preserved.ok)
        return preserved;
    const selectedRestricted = restrictExistingBackup(preserved.value);
    if (!selectedRestricted.ok)
        return selectedRestricted;
    return ok(preserved.value);
};
