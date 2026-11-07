import { projectAndroidInventory } from "../../domain/android/androidApplication.js";
import { ANDROID_APPLICATION_PROVIDER } from "../../domain/investigationProviders.js";
import { projectInventoryEvidence, } from "../InventoryProjectionEvidence.js";
const OPERATION = "project_android_application_graph";
/** Project authenticated APK inventory Evidence into Android application Evidence. */
export const projectAndroidApplicationEvidence = (rawInput, lookup, execution) => {
    return projectInventoryEvidence({
        rawInput,
        ...(lookup === undefined ? {} : { lookup }),
        ...(execution === undefined ? {} : { execution }),
        project: projectAndroidInventory,
        operation: OPERATION,
        predicateType: "rea.android-application-graph",
        provider: ANDROID_APPLICATION_PROVIDER,
        subjectFormat: () => "apk",
    });
};
