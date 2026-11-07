import { artifactTargetSelectedPath } from "../../domain/binaryTargetTypes.js";
import { snapshotBindingMismatch, snapshotMatchesTarget, snapshotTarget, } from "../../domain/analysisSnapshot.js";
import { parseBinaryTarget } from "../BinaryTargetResolver.js";
import { EvidenceIntegrityError, AnalysisSnapshotMismatchError, } from "../../domain/evidenceErrors.js";
import { err } from "../../domain/result.js";
import { profilelessSnapshotMismatch, profilelessNativeDispatchProfile, } from "./ProfilelessNativeWorkflowSnapshot.js";
import { SessionProviderRouter } from "./SessionProviderRouter.js";
/** Parse a target, resolve its provider route, and validate snapshot binding. */
export const resolveSessionOpen = async (input) => {
    const { path, options } = input;
    const parsed = await parseBinaryTarget(path, {
        resources: input.resources,
        ...(options.targetKind === undefined
            ? {}
            : { targetKind: options.targetKind }),
        ...(options.formatHint === undefined
            ? {}
            : { formatHint: options.formatHint }),
        ...(options.architecture === undefined
            ? {}
            : { architecture: options.architecture }),
        ...(options.entryPoint === undefined
            ? {}
            : { entryPoint: options.entryPoint }),
        ...(options.espFlash === undefined ? {} : { espFlash: options.espFlash }),
        ...(options.signal === undefined ? {} : { signal: options.signal }),
    });
    if (!parsed.ok)
        return parsed;
    return resolveSessionTarget({ ...input, target: parsed.value });
};
/** Resolve a known target's provider route and validate snapshot binding. */
export const resolveSessionTarget = async (input) => {
    const { router, current, target, options } = input;
    const sameTarget = sameSessionTarget(current?.target, target);
    const resolvedRoute = sameTarget && options.providerId === undefined && current !== undefined
        ? { ok: true, value: current.route }
        : await router.resolve(target, options.providerId, options.signal);
    if (!resolvedRoute.ok)
        return resolvedRoute;
    return validateResolvedSessionTarget({
        ...input,
        route: resolvedRoute.value,
    });
};
/** Revalidate a previewed route against the current session and snapshot binding. */
export const validateResolvedSessionTarget = (input) => {
    const { current, target, route, options, stagedSnapshotMismatch } = input;
    const sameTarget = sameSessionTarget(current?.target, target);
    const snapshotError = validateSnapshot({
        snapshot: options.snapshot,
        target,
        profile: route.profile,
        profilelessWorkflowProfile: profilelessNativeDispatchProfile(route),
        current,
        stagedSnapshotMismatch,
    });
    if (snapshotError !== undefined)
        return err(snapshotError);
    return { ok: true, value: { target, route, sameTarget } };
};
const sameSessionTarget = (current, target) => current !== undefined &&
    current.path === target.path &&
    // Native admission is bound to the requested path, not just its realpath.
    (current.sourcePath ?? current.path) === (target.sourcePath ?? target.path) &&
    // Artifact name hints and companions depend on the selected spelling.
    artifactTargetSelectedPath(current) === artifactTargetSelectedPath(target) &&
    snapshotMatchesTarget(snapshotTarget(current), target);
const validateSnapshot = ({ snapshot, target, profile, profilelessWorkflowProfile, current, stagedSnapshotMismatch, }) => {
    if (snapshot !== undefined) {
        const mismatch = profile === null
            ? profilelessSnapshotMismatch(snapshot, target, profilelessWorkflowProfile)
            : snapshotBindingMismatch(snapshot, target, profile);
        if (mismatch !== undefined)
            return new AnalysisSnapshotMismatchError("Analysis snapshot target, provider, or analysis profile does not match the requested binary", mismatch);
    }
    const stagedMismatch = current === undefined
        ? stagedSnapshotMismatch(target, profile ?? profilelessWorkflowProfile ?? null)
        : undefined;
    if (stagedMismatch !== undefined)
        return new AnalysisSnapshotMismatchError("Analysis snapshot does not match the staged target, provider, or analysis profile", stagedMismatch);
    return undefined;
};
