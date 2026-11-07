import { isWithinAny } from "./desktopStateDiff.js";
/** Home-relative locations that desktop services and toolkits share. */
const SHARED_DESKTOP_PATHS = [
    ".cache",
    ".config/dconf",
    ".config/xfce4",
    ".config/gtk-3.0",
    ".config/gtk-4.0",
    ".config/pulse",
    ".local/share/recently-used.xbel",
    ".local/share/gvfs-metadata",
    ".local/share/Trash",
    ".Xauthority",
    ".ICEauthority",
];
/**
 * Lowercase names that identify the application in dconf keys. The desktop
 * entry's display name is left out: generic names such as "Settings" would
 * claim other applications' groups.
 */
export const applicationNames = (capture) => {
    const { application, session } = capture;
    const entryId = application.desktop_entry?.id ?? null;
    return new Set([
        application.package.name?.split(":")[0],
        application.executable.path.split("/").at(-1),
        entryId?.split(".").at(-1),
        application.desktop_entry?.startup_wm_class,
        session.window_match?.class,
        session.window_match?.instance,
    ]
        .filter((name) => typeof name === "string" && name.length > 0)
        .map((name) => name.toLowerCase()));
};
/** Whether a dconf group such as `org/xfce/mousepad/state` names the application. */
export const isApplicationDconfGroup = (group, names) => group
    .toLowerCase()
    .split("/")
    .some((segment) => names.has(segment));
const homePath = (path, home) => path.startsWith(`${home}/`) ? path.slice(home.length + 1) : null;
/**
 * A state directory relative to whatever home spells it: from its first
 * hidden segment, such as `.config/app`. The capture keeps content roots in
 * their physical spelling but state directories as the environment spelled
 * them, so this compares them when a link sits in between.
 */
const hiddenTail = (path) => {
    const index = path.indexOf("/.");
    return index < 0 ? null : path.slice(index + 1);
};
/** Compute the shared role facts once per capture. */
export const roleFacts = (capture) => {
    const { application, session, state, host } = capture;
    const named = application.state_directories.map((entry) => entry.path);
    // A symlinked state directory is walked, and its files recorded, under its physical spelling.
    const stateDirectories = [
        ...new Set([...named, ...(state.state_directories ?? [])]),
    ];
    const stateTails = named
        .map(hiddenTail)
        .filter((tail) => tail !== null);
    return {
        home: host.home,
        stateDirectories,
        stateTails,
        selectedRoots: state.content_roots.filter((root) => {
            const relative = homePath(root, host.home);
            return (!stateDirectories.includes(root) &&
                (relative === null || !stateTails.includes(relative)));
        }),
        titles: session.windows
            .filter((window) => window.application)
            .flatMap((window) => window.titles),
        openedFiles: new Set(session.opened_files.map((file) => file.path)),
    };
};
const FILENAME_CHARACTER = /[\p{L}\p{M}\p{N}._~-]/u;
/** Whether a title holds a spelling not joined to other file name characters. */
const spelledIn = (title, spelling) => {
    for (let at = title.indexOf(spelling); at >= 0; at = title.indexOf(spelling, at + 1)) {
        const before = title[at - 1];
        const after = title[at + spelling.length];
        if ((before === undefined || !FILENAME_CHARACTER.test(before)) &&
            (after === undefined || !FILENAME_CHARACTER.test(after)))
            return true;
    }
    return false;
};
/** Whether an application window title spells the file's name or home path. */
const namedInTitle = (path, facts) => {
    const name = path.split("/").at(-1) ?? "";
    const relative = homePath(path, facts.home);
    const spellings = [
        ...(name.length >= 3 ? [name] : []),
        ...(relative === null ? [] : [`~/${relative}`]),
    ];
    return facts.titles.some((title) => spellings.some((spelling) => spelledIn(title, spelling)));
};
/** Evidence the capture holds about one path, given its own changes. */
export const stateReasons = (facts, path, changes, dconfApplicationKeys) => {
    const relative = homePath(path, facts.home);
    const reasons = [];
    if (changes.some((change) => change.in_state_directory) ||
        isWithinAny(path, facts.stateDirectories) ||
        (relative !== null && isWithinAny(relative, facts.stateTails)))
        reasons.push("state_directory");
    if (changes.some((change) => change.opened_by_application) ||
        facts.openedFiles.has(path))
        reasons.push("opened_by_application");
    if (namedInTitle(path, facts))
        reasons.push("named_in_window_title");
    if (isWithinAny(path, facts.selectedRoots))
        reasons.push("selected_path");
    if (dconfApplicationKeys)
        reasons.push("dconf_application_keys");
    if (relative !== null && isWithinAny(relative, SHARED_DESKTOP_PATHS))
        reasons.push("desktop_service");
    return reasons;
};
/**
 * The role that follows from a path's reasons, strongest first. A file the
 * application holds open is a document when a title or the caller names it.
 */
export const stateRole = (reasons) => {
    const shared = reasons.includes("desktop_service");
    if (reasons.includes("dconf_application_keys") ||
        (reasons.includes("state_directory") && !shared))
        return "application_state";
    if (reasons.includes("named_in_window_title") ||
        reasons.includes("selected_path"))
        return "document";
    if (reasons.includes("opened_by_application") && !shared)
        return "application_state";
    if (shared)
        return "shared_desktop";
    return "unrelated";
};
