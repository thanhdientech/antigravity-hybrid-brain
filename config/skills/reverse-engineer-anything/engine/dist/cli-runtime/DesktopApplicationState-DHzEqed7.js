import { __esmMin, __exportAll } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { RegularFileCleanupFailure, init_OwnedRegularFile, withOwnedRegularFile } from "./ArtifactReader-DJ9rniiL.js";
import { AnalysisError, AnalysisInputError, init_analysisErrorBase, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { createEvidence, describeValidationFailure, init_evidence, init_evidenceValidation, init_validationFailure, safeParseEvidence } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_JsonFiles, readJsonFile } from "./JsonFiles-DTY4ojTz.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-C6Clg7Wy.js";
import { RegularFileCapacityError, init_readStableFileBytes, readStableFileBytes } from "./readStableFileBytes-ygI763vO.js";
import { PrivateRuntimeRoot, init_PrivateRuntimeRoot } from "./PrivateRuntimeRoot-61nv3RS8.js";
import { DESKTOP_OPERATION, DESKTOP_PROVIDER, desktopApplicationCaptureSchema, desktopOperationFailure, init_DesktopCaptureRefusals, init_desktopCapture, init_desktopStateDiff, isWithinAny } from "./DesktopCaptureRefusals-CSnCLzhc.js";
import { SQLITE_SIDECARS, decodeStateText, detectStateFormat, init_stateFormats, jsonView, keyfileView, plainRecord, textView, xmlView } from "./stateFormats-D613h6TX.js";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

//#region dist/domain/desktop/stateChanges.js
var MAX_LISTED, isRecord, escapePointer, MAX_LISTED_POINTER, found, note, ownEntry, memberOf, walk, compareTrees, compareMaps, lineDifference, keyEntries, tablesOf, unreadTables, rowEntries, truncatedView, diffStateViews, compareViews;
function init_stateChanges() {
	return (init_stateChanges = __esmMin((() => {
		MAX_LISTED = 100;
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		escapePointer = (segment) => segment.replaceAll("~", "~0").replaceAll("/", "~1");
		MAX_LISTED_POINTER = 4096;
		found = () => ({
			listed: [],
			count: 0
		});
		note = (into, path) => {
			into.count += 1;
			if (into.listed.length < MAX_LISTED && path.length <= MAX_LISTED_POINTER) into.listed.push(path.segments.map((segment) => `/${segment}`).join(""));
		};
		ownEntry = (value) => {
			if (Array.isArray(value)) return "[]";
			return isRecord(value) ? "{}" : JSON.stringify(value);
		};
		memberOf = (value, key) => {
			if (Array.isArray(value)) return String(Number(key)) === key ? value[Number(key)] : undefined;
			return isRecord(value) && Object.hasOwn(value, key) ? value[key] : undefined;
		};
		walk = (from, other, path, into) => {
			if (other === undefined) note(into.missing, path);
			else if (into.changed !== undefined && ownEntry(from) !== ownEntry(other)) note(into.changed, path);
			const visit = (key, item) => {
				const segment = escapePointer(key);
				path.segments.push(segment);
				path.length += segment.length + 1;
				walk(item, other === undefined ? undefined : memberOf(other, key), path, into);
				path.segments.pop();
				path.length -= segment.length + 1;
			};
			if (Array.isArray(from)) from.forEach((item, index) => visit(String(index), item));
			else if (isRecord(from)) for (const [key, item] of Object.entries(from)) visit(key, item);
		};
		compareTrees = (before, after) => {
			const [added, removed, changed] = [
				found(),
				found(),
				found()
			];
			walk(after, before, {
				segments: [],
				length: 0
			}, {
				missing: added,
				changed
			});
			walk(before, after, {
				segments: [],
				length: 0
			}, { missing: removed });
			return {
				kind: "values",
				added: added.listed,
				removed: removed.listed,
				changed: changed.listed,
				added_count: added.count,
				removed_count: removed.count,
				changed_count: changed.count,
				complete: true
			};
		};
		compareMaps = (kind, before, after) => {
			const added = [];
			const removed = [];
			const changed = [];
			for (const [key, value] of after) {
				const previous = before.get(key);
				if (previous === undefined) added.push(key);
				else if (previous !== value) changed.push(key);
			}
			for (const key of before.keys()) if (!after.has(key)) removed.push(key);
			return {
				kind,
				added: added.slice(0, MAX_LISTED),
				removed: removed.slice(0, MAX_LISTED),
				changed: changed.slice(0, MAX_LISTED),
				added_count: added.length,
				removed_count: removed.length,
				changed_count: changed.length,
				complete: true
			};
		};
		lineDifference = (before, after) => {
			const lines = (view) => isRecord(view) && Array.isArray(view.lines) ? view.lines.filter((line) => typeof line === "string") : [];
			const counts = new Map();
			for (const line of lines(before)) counts.set(line, (counts.get(line) ?? 0) - 1);
			for (const line of lines(after)) counts.set(line, (counts.get(line) ?? 0) + 1);
			const added = [];
			const removed = [];
			for (const [line, count] of counts) {
				for (let index = 0; index < count; index += 1) added.push(line);
				for (let index = 0; index > count; index -= 1) removed.push(line);
			}
			return {
				kind: "lines",
				added: added.slice(0, MAX_LISTED),
				removed: removed.slice(0, MAX_LISTED),
				changed: [],
				added_count: added.length,
				removed_count: removed.length,
				changed_count: 0,
				complete: true
			};
		};
		keyEntries = (view) => {
			const entries = new Map();
			const groups = isRecord(view) && isRecord(view.groups) ? view.groups : {};
			for (const [group, keys] of Object.entries(groups)) if (isRecord(keys)) for (const [key, value] of Object.entries(keys)) entries.set(`${group}/${escapePointer(key)}`, JSON.stringify(value));
			return entries;
		};
		tablesOf = (view) => isRecord(view) && isRecord(view.tables) ? view.tables : {};
		unreadTables = (view) => Object.entries(tablesOf(view)).filter(([, table]) => isRecord(table) && typeof table.error === "string").map(([name]) => name);
		rowEntries = (view, skipped) => {
			const entries = new Map();
			for (const [name, table] of Object.entries(tablesOf(view))) {
				if (skipped.has(name) || !isRecord(table) || !Array.isArray(table.rows)) continue;
				const columns = Array.isArray(table.columns) ? table.columns : [];
				const keyColumns = (Array.isArray(table.primary_key) ? table.primary_key : []).map((column) => columns.indexOf(column)).filter((index) => index >= 0);
				const seen = new Map();
				for (const row of table.rows) {
					if (!Array.isArray(row)) continue;
					const identity = keyColumns.length > 0 ? JSON.stringify(keyColumns.map((index) => row[index] ?? null)) : JSON.stringify(row);
					const occurrence = seen.get(identity) ?? 0;
					seen.set(identity, occurrence + 1);
					entries.set(`${name}:${identity}${occurrence === 0 ? "" : `#${String(occurrence)}`}`, JSON.stringify(row));
				}
			}
			return entries;
		};
		truncatedView = (view) => {
			if (!isRecord(view)) return false;
			if (view.truncated === true || view.tables_truncated === true) return true;
			return unreadTables(view).length > 0 || Object.values(tablesOf(view)).some((table) => isRecord(table) && table.truncated === true);
		};
		diffStateViews = (format, before, after) => {
			const difference = compareViews(format, before, after);
			const flagged = format === "text" || format === "xml" || format === "sqlite";
			return flagged && (truncatedView(before) || truncatedView(after)) ? {
				...difference,
				complete: false
			} : difference;
		};
		compareViews = (format, before, after) => {
			switch (format) {
				case "text": return lineDifference(before, after);
				case "json":
				case "xml": return compareTrees(before, after);
				case "keyfile":
				case "dconf": return compareMaps("keys", keyEntries(before), keyEntries(after));
				case "sqlite": {
					const unread = new Set([...unreadTables(before), ...unreadTables(after)]);
					return compareMaps("rows", rowEntries(before, unread), rowEntries(after, unread));
				}
				case "binary": return compareMaps("content", new Map(), new Map());
			}
		};
	})))();
}

//#endregion
//#region dist/domain/desktop/stateRoles.js
var SHARED_DESKTOP_PATHS, applicationNames, isApplicationDconfGroup, homePath, hiddenTail, roleFacts, FILENAME_CHARACTER, spelledIn, namedInTitle, stateReasons, stateRole;
function init_stateRoles() {
	return (init_stateRoles = __esmMin((() => {
		init_desktopStateDiff();
		SHARED_DESKTOP_PATHS = [
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
			".ICEauthority"
		];
		applicationNames = (capture) => {
			const { application, session } = capture;
			const entryId = application.desktop_entry?.id ?? null;
			return new Set([
				application.package.name?.split(":")[0],
				application.executable.path.split("/").at(-1),
				entryId?.split(".").at(-1),
				application.desktop_entry?.startup_wm_class,
				session.window_match?.class,
				session.window_match?.instance
			].filter((name) => typeof name === "string" && name.length > 0).map((name) => name.toLowerCase()));
		};
		isApplicationDconfGroup = (group, names) => group.toLowerCase().split("/").some((segment) => names.has(segment));
		homePath = (path, home) => path.startsWith(`${home}/`) ? path.slice(home.length + 1) : null;
		hiddenTail = (path) => {
			const index = path.indexOf("/.");
			return index < 0 ? null : path.slice(index + 1);
		};
		roleFacts = (capture) => {
			const { application, session, state, host } = capture;
			const named = application.state_directories.map((entry) => entry.path);
			const stateDirectories = [...new Set([...named, ...state.state_directories ?? []])];
			const stateTails = named.map(hiddenTail).filter((tail) => tail !== null);
			return {
				home: host.home,
				stateDirectories,
				stateTails,
				selectedRoots: state.content_roots.filter((root) => {
					const relative = homePath(root, host.home);
					return !stateDirectories.includes(root) && (relative === null || !stateTails.includes(relative));
				}),
				titles: session.windows.filter((window) => window.application).flatMap((window) => window.titles),
				openedFiles: new Set(session.opened_files.map((file) => file.path))
			};
		};
		FILENAME_CHARACTER = /[\p{L}\p{M}\p{N}._~-]/u;
		spelledIn = (title, spelling) => {
			for (let at = title.indexOf(spelling); at >= 0; at = title.indexOf(spelling, at + 1)) {
				const before = title[at - 1];
				const after = title[at + spelling.length];
				if ((before === undefined || !FILENAME_CHARACTER.test(before)) && (after === undefined || !FILENAME_CHARACTER.test(after))) return true;
			}
			return false;
		};
		namedInTitle = (path, facts) => {
			const name = path.split("/").at(-1) ?? "";
			const relative = homePath(path, facts.home);
			const spellings = [...name.length >= 3 ? [name] : [], ...relative === null ? [] : [`~/${relative}`]];
			return facts.titles.some((title) => spellings.some((spelling) => spelledIn(title, spelling)));
		};
		stateReasons = (facts, path, changes, dconfApplicationKeys) => {
			const relative = homePath(path, facts.home);
			const reasons = [];
			if (changes.some((change) => change.in_state_directory) || isWithinAny(path, facts.stateDirectories) || relative !== null && isWithinAny(relative, facts.stateTails)) reasons.push("state_directory");
			if (changes.some((change) => change.opened_by_application) || facts.openedFiles.has(path)) reasons.push("opened_by_application");
			if (namedInTitle(path, facts)) reasons.push("named_in_window_title");
			if (isWithinAny(path, facts.selectedRoots)) reasons.push("selected_path");
			if (dconfApplicationKeys) reasons.push("dconf_application_keys");
			if (relative !== null && isWithinAny(relative, SHARED_DESKTOP_PATHS)) reasons.push("desktop_service");
			return reasons;
		};
		stateRole = (reasons) => {
			const shared = reasons.includes("desktop_service");
			if (reasons.includes("dconf_application_keys") || reasons.includes("state_directory") && !shared) return "application_state";
			if (reasons.includes("named_in_window_title") || reasons.includes("selected_path")) return "document";
			if (reasons.includes("opened_by_application") && !shared) return "application_state";
			if (shared) return "shared_desktop";
			return "unrelated";
		};
	})))();
}

//#endregion
//#region dist/application/desktop/DesktopRetainedContent.js
var MIB$1, DEFAULT_MAX_BYTES, RetainedContent, withRetainedContent;
function init_DesktopRetainedContent() {
	return (init_DesktopRetainedContent = __esmMin((() => {
		init_ArtifactResourceScope();
		init_result();
		init_OwnedRegularFile();
		init_readStableFileBytes();
		MIB$1 = 1024 * 1024;
		DEFAULT_MAX_BYTES = 64 * MIB$1;
		RetainedContent = class {
			folder;
			maxBytes;
			#unclosed = [];
			constructor(folder, maxBytes = DEFAULT_MAX_BYTES) {
				this.folder = folder;
				this.maxBytes = maxBytes;
			}
			/**
			* The bytes stored under a digest, or why they cannot be used, worded to
			* follow the name of what was read.
			*/
			async read(sha256, signal) {
				const path = join(this.folder, "content", sha256);
				const options = {
					symlinks: "reject",
					retainFailedClose: (owner) => {
						this.#unclosed.push({
							path,
							owner
						});
					},
					...signal === undefined ? {} : { signal }
				};
				let bytes;
				try {
					bytes = await withOwnedRegularFile(path, options, ({ handle }) => readStableFileBytes(handle, path, this.maxBytes, options));
				} catch (cause) {
					signal?.throwIfAborted();
					const outcome = cause instanceof RegularFileCleanupFailure ? cause.outcome : undefined;
					if (outcome?.kind === "completed" && Buffer.isBuffer(outcome.value)) bytes = outcome.value;
					else if ((outcome?.kind === "failed" ? outcome.cause : cause) instanceof RegularFileCapacityError) return err(`is larger than the ${String(this.maxBytes / MIB$1)} MiB read limit`);
					else if (cause instanceof Error) return err("is missing or unreadable");
					else throw cause;
				}
				return createHash("sha256").update(bytes).digest("hex") === sha256 ? ok(bytes) : err("does not match its digest");
			}
			/** Close every kept handle; each close that fails again keeps its owner. */
			async release(resources) {
				const failures = [];
				for (const { path, owner } of this.#unclosed.splice(0)) {
					const attempt = await resources.release({
						kind: "file-handle",
						resource: path,
						handle: owner
					});
					if (attempt.kind === "failed") failures.push(attempt);
				}
				return failures;
			}
		};
		withRetainedContent = async (folder, run, maxBytes) => {
			const content = new RetainedContent(folder, maxBytes);
			let outcome;
			try {
				outcome = {
					kind: "completed",
					value: await run(content)
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			const resources = new ArtifactResourceScope();
			const [first, ...rest] = await content.release(resources);
			if (first !== undefined) throw resources.cleanupFailure(outcome, [first, ...rest]);
			if (outcome.kind === "failed") throw outcome.cause;
			return outcome.value;
		};
	})))();
}

//#endregion
//#region dist/application/desktop/DesktopStateVersions.js
var indexState, digestsAt, baselinePresence, presenceAt, pathVersions, statePaths;
function init_DesktopStateVersions() {
	return (init_DesktopStateVersions = __esmMin((() => {
		init_desktopStateDiff();
		init_stateFormats();
		indexState = (capture) => {
			const changes = new Map();
			capture.state.checkpoints.forEach((checkpoint, position) => {
				for (const change of checkpoint.changes) {
					const entries = changes.get(change.path) ?? [];
					entries.push({
						index: position,
						change
					});
					changes.set(change.path, entries);
				}
			});
			const first = capture.state.checkpoints[0];
			const complete = first !== undefined && !first.truncated && first.unreadable_directories === 0 && first.unchecked_paths === 0 && capture.state.excluded !== undefined;
			return {
				changes,
				baseline: new Map((first?.retained ?? []).map((file) => [file.path, file.sha256])),
				omitted: new Set(capture.state.omitted_content.map((entry) => entry.path)),
				contentRoots: complete ? capture.state.content_roots : [],
				excluded: capture.state.excluded ?? [],
				checkpoints: capture.state.checkpoints.length
			};
		};
		digestsAt = (path, index) => {
			const digests = [index.baseline.get(path) ?? null];
			const byIndex = new Map((index.changes.get(path) ?? []).map((entry) => [entry.index, entry.change]));
			for (let position = 1; position < index.checkpoints; position += 1) {
				const change = byIndex.get(position);
				digests.push(change === undefined ? digests[position - 1] ?? null : change.after?.type === "file" ? change.after.sha256 ?? null : null);
			}
			return digests;
		};
		baselinePresence = (path, first, index) => {
			if (index.baseline.has(path)) return true;
			if (first !== undefined) return first.before?.type === "file";
			if (index.omitted.has(path)) return true;
			return isWithinAny(path, index.contentRoots) && !isWithinAny(path, index.excluded) ? false : null;
		};
		presenceAt = (path, index) => {
			const own = index.changes.get(path) ?? [];
			const byIndex = new Map(own.map((entry) => [entry.index, entry.change]));
			const presence = [baselinePresence(path, own[0]?.change, index)];
			for (let position = 1; position < index.checkpoints; position += 1) {
				const change = byIndex.get(position);
				presence.push(change === undefined ? presence[position - 1] ?? null : change.after?.type === "file");
			}
			return presence;
		};
		pathVersions = (capture, path, index) => {
			const checkpoints = capture.state.checkpoints;
			const presence = presenceAt(path, index);
			const digests = digestsAt(path, index);
			const positions = [...new Set([path, ...SQLITE_SIDECARS.map(({ suffix }) => `${path}${suffix}`)].flatMap((name) => (index.changes.get(name) ?? []).map((entry) => entry.index)))].filter((position) => position > 0).sort((left, right) => left - right);
			const versions = [];
			for (const position of [0, ...positions]) {
				const present = presence[position] === true;
				if (!present && versions.at(-1)?.present === false) continue;
				versions.push({
					checkpoint_index: position,
					checkpoint: checkpoints[position]?.name ?? (position === 0 ? "baseline" : String(position)),
					present,
					sha256: present ? digests[position] ?? null : null,
					format: null,
					view: null,
					view_error: null
				});
			}
			return versions;
		};
		statePaths = (index) => {
			const paths = new Set(index.baseline.keys());
			for (const [path, entries] of index.changes) if (entries.some(({ change }) => change.before?.type === "file" || change.after?.type === "file")) paths.add(path);
			return [...paths].sort();
		};
	})))();
}

//#endregion
//#region dist/application/desktop/DesktopApplicationState.js
var DesktopApplicationState_exports = /* @__PURE__ */ __exportAll({ inspectDesktopApplicationState: () => inspectDesktopApplicationState });
var OPERATION, inputError, readDesktopCapture, dconfGroups, withStaged, failed, sidecarAt, sidecarBytes, sqliteView, dconfView, MIB, MAX_PARSED_VIEW_BYTES, viewOf, EMPTY_CHANGE, changeBetween, readVersion, hasDconfGroups, describePath, STATE_LIMITATIONS, inspectState, inspectDesktopApplicationState;
function init_DesktopApplicationState() {
	return (init_DesktopApplicationState = __esmMin((() => {
		init_ArtifactResourceScope();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_desktopCapture();
		init_stateChanges();
		init_stateFormats();
		init_stateRoles();
		init_evidence();
		init_evidenceValidation();
		init_result();
		init_validationFailure();
		init_PrivateRuntimeRoot();
		init_JsonFiles();
		init_DesktopRetainedContent();
		init_DesktopStateVersions();
		init_DesktopCaptureRefusals();
		OPERATION = "inspect_desktop_application_state";
		inputError = (userMessage, remediationAction) => new AnalysisInputError(OPERATION, {
			userMessage,
			remediationAction
		}, [{
			path: ["capture"],
			reason: "invalid_value",
			message: userMessage
		}]);
		readDesktopCapture = async (folder, signal) => {
			const resources = new ArtifactResourceScope();
			try {
				const loaded = await readJsonFile(join(folder, "capture.json"), signal, resources, OPERATION);
				if (!loaded.ok) {
					if (loaded.error instanceof AnalysisError) throw loaded.error;
					throw inputError(`${join(folder, "capture.json")} could not be read as JSON.`, "Pass a folder written by capture-desktop-application.");
				}
				const evidence = safeParseEvidence(loaded.value);
				if (!evidence.ok || evidence.value.operation !== "capture_desktop_application" || evidence.value.predicate_type !== "rea.desktop-application-capture" || evidence.value.provider.id !== DESKTOP_PROVIDER.id || evidence.value.provider.version !== DESKTOP_PROVIDER.version) throw inputError("capture.json is not desktop application capture Evidence.", "Pass a folder written by capture-desktop-application.");
				const capture = desktopApplicationCaptureSchema.safeParse(evidence.value.normalized_result);
				if (!capture.success) throw inputError(`The capture result is malformed (${describeValidationFailure(capture.error)}).`, "Capture the application again.");
				return {
					evidence: evidence.value,
					capture: capture.data
				};
			} finally {
				await resources.close();
			}
		};
		dconfGroups = (text, names) => {
			const groups = keyfileView(text);
			const application = plainRecord();
			const others = [];
			for (const [group, keys] of Object.entries(groups)) if (isApplicationDconfGroup(group, names)) application[group] = keys;
			else others.push(group);
			return {
				groups: application,
				other_groups: others
			};
		};
		withStaged = async (files, read) => {
			const root = await PrivateRuntimeRoot.create({ prefix: "rea-desktop-state-" });
			let outcome;
			try {
				const paths = [];
				for (const file of files) {
					const path = join(root.path, file.name);
					await writeFile(path, file.bytes, {
						mode: 384,
						flag: "wx"
					});
					paths.push(path);
				}
				outcome = {
					kind: "completed",
					value: await read(paths)
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			const resources = new ArtifactResourceScope();
			const removed = await resources.release({
				kind: "private-runtime-root",
				resource: root.path,
				root
			});
			if (removed.kind === "failed") throw resources.cleanupFailure(outcome, [removed]);
			if (outcome.kind === "failed") throw outcome.cause;
			return outcome.value;
		};
		failed = (error) => ({
			view: null,
			error
		});
		sidecarAt = (path, version, index) => ({
			present: presenceAt(path, index)[version.checkpoint_index] ?? null,
			sha256: digestsAt(path, index)[version.checkpoint_index] ?? null
		});
		sidecarBytes = async ({ path, version }, sidecar, context) => {
			const { present, sha256 } = sidecarAt(`${path}${sidecar.suffix}`, version, context.index);
			if (present === null) return err(`the capture did not record whether the database's ${sidecar.label} existed`);
			if (present && sha256 === null) return err(`the database's ${sidecar.label} was not retained`);
			if (sha256 === null) return ok(undefined);
			const bytes = await context.content.read(sha256, context.signal);
			return bytes.ok ? ok(bytes.value) : err(`the database's ${sidecar.label} ${bytes.error}`);
		};
		sqliteView = async (input, context) => {
			const staged = [{
				name: "state.db",
				bytes: input.bytes
			}];
			for (const sidecar of SQLITE_SIDECARS) {
				const bytes = await sidecarBytes(input, sidecar, context);
				if (!bytes.ok) return failed(bytes.error);
				if (bytes.value !== undefined) staged.push({
					name: `state.db${sidecar.suffix}`,
					bytes: bytes.value
				});
			}
			return withStaged(staged, async ([database]) => {
				const read = await context.readers.sqlite(database ?? "", context.signal);
				return read.ok ? {
					view: read.view,
					error: null
				} : failed(read.error);
			});
		};
		dconfView = async ({ bytes }, context) => withStaged([{
			name: "user",
			bytes
		}], async ([database]) => {
			const dump = await context.readers.dconf(database ?? "", context.signal);
			return dump.ok ? {
				view: dconfGroups(dump.text, context.names),
				error: null
			} : failed(dump.error);
		});
		MIB = 1024 * 1024;
		MAX_PARSED_VIEW_BYTES = 4 * MIB;
		viewOf = async (input, context) => {
			const format = input.version.format ?? "binary";
			if ((format === "json" || format === "keyfile") && input.bytes.length > MAX_PARSED_VIEW_BYTES) return failed(`larger than the ${String(MAX_PARSED_VIEW_BYTES / MIB)} MiB limit for JSON and key file views`);
			const text = decodeStateText(input.bytes) ?? "";
			switch (format) {
				case "text": return {
					view: textView(text),
					error: null
				};
				case "json": {
					const parsed = jsonView(text);
					return parsed.ok ? {
						view: parsed.value,
						error: null
					} : failed(parsed.error);
				}
				case "keyfile": return {
					view: { groups: keyfileView(text) },
					error: null
				};
				case "xml": {
					const tree = xmlView(text);
					return tree === undefined ? failed("not well-formed XML, or it declares a DOCTYPE") : {
						view: tree,
						error: null
					};
				}
				case "dconf": return dconfView(input, context);
				case "sqlite": return sqliteView(input, context);
				case "binary": return {
					view: null,
					error: null
				};
			}
		};
		EMPTY_CHANGE = {
			added: [],
			removed: [],
			changed: [],
			added_count: 0,
			removed_count: 0,
			changed_count: 0,
			complete: true
		};
		changeBetween = (before, after) => {
			const ends = {
				from_index: before.checkpoint_index,
				to_index: after.checkpoint_index,
				from: before.checkpoint,
				to: after.checkpoint
			};
			if (!before.present) return {
				...ends,
				kind: "created",
				...EMPTY_CHANGE
			};
			if (!after.present) return {
				...ends,
				kind: "deleted",
				...EMPTY_CHANGE
			};
			if (before.view_error !== null || after.view_error !== null || before.format === null || after.format === null) return {
				...ends,
				kind: "unreadable",
				...EMPTY_CHANGE
			};
			if (before.format !== after.format) return {
				...ends,
				kind: "format",
				...EMPTY_CHANGE
			};
			if (before.format === "binary") return {
				...ends,
				kind: "content",
				...EMPTY_CHANGE
			};
			const difference = diffStateViews(before.format, before.view, after.view);
			return {
				...ends,
				...difference,
				added: [...difference.added],
				removed: [...difference.removed],
				changed: [...difference.changed]
			};
		};
		readVersion = async (version, path, context) => {
			context.signal?.throwIfAborted();
			if (!version.present) return;
			if (version.sha256 === null) {
				version.view_error = "content not retained";
				return;
			}
			const bytes = await context.content.read(version.sha256, context.signal);
			if (!bytes.ok) {
				version.view_error = `retained content ${bytes.error}`;
				return;
			}
			version.format = detectStateFormat(path, bytes.value);
			const outcome = await viewOf({
				path,
				bytes: bytes.value,
				version
			}, context);
			version.view = outcome.view;
			version.view_error = outcome.error;
		};
		hasDconfGroups = (version) => {
			const view = version.view;
			return version.format === "dconf" && typeof view === "object" && view !== null && !Array.isArray(view) && typeof view.groups === "object" && view.groups !== null && Object.keys(view.groups).length > 0;
		};
		describePath = async (capture, path, facts, context) => {
			const versions = pathVersions(capture, path, context.index);
			for (const version of versions) await readVersion(version, path, context);
			const reasons = [...stateReasons(facts, path, (context.index.changes.get(path) ?? []).map((entry) => entry.change), versions.some(hasDconfGroups))];
			const home = capture.host.home;
			return {
				path,
				home_path: path.startsWith(`${home}/`) ? path.slice(home.length + 1) : null,
				role: stateRole(reasons),
				reasons,
				format: versions.findLast((version) => version.format !== null)?.format ?? null,
				versions,
				changes: versions.slice(1).map((version, index) => changeBetween(versions[index] ?? version, version))
			};
		};
		STATE_LIMITATIONS = [
			"Roles are inferred from state directories, open files, window titles, selected paths and dconf key names; a path can be misattributed.",
			"Views cover retained content only; a file that existed before the capture but outside the content roots has no starting view.",
			"SQLite views list at most 500 rows of at most 64 ordinary tables, text views at most 5,000 lines and XML views at most 5,000 nodes; changes between truncated views, or views with an unread table, are marked incomplete.",
			"JSON and key file views read files of at most 4 MiB, JSON nested at most 500 levels and only numbers JavaScript holds exactly; other files of those formats have a view_error.",
			"dconf views keep only groups whose path names the application."
		];
		inspectState = async (folder, readers, signal) => {
			const { evidence, capture } = await readDesktopCapture(folder, signal);
			const names = applicationNames(capture);
			const facts = roleFacts(capture);
			const index = indexState(capture);
			const paths = await withRetainedContent(folder, async (content) => {
				const context = {
					content,
					readers,
					names,
					signal,
					index
				};
				const described = [];
				for (const path of statePaths(index)) described.push(await describePath(capture, path, facts, context));
				return described;
			});
			const limitations = [...STATE_LIMITATIONS, ...capture.state.state_directories === undefined ? ["The capture does not record its state directories as walked, so files in a symlinked state directory may be classed as documents."] : []];
			const result = {
				capture: {
					evidence_id: evidence.evidence_id,
					home: capture.host.home,
					checkpoints: capture.state.checkpoints.map((checkpoint) => checkpoint.name),
					limitations: capture.limitations,
					omitted_content: capture.state.omitted_content
				},
				application_names: [...names],
				paths,
				limitations
			};
			signal?.throwIfAborted();
			return createEvidence(undefined, DESKTOP_PROVIDER, {
				predicateType: "rea.desktop-application-state",
				operation: OPERATION,
				parameters: { capture_evidence_id: evidence.evidence_id },
				result,
				confidence: "inferred",
				authority: "analyst-inference",
				limitations: [...limitations, ...capture.limitations]
			});
		};
		inspectDesktopApplicationState = async (folder, readers, signal) => {
			try {
				return await inspectState(folder, readers, signal);
			} catch (cause) {
				return desktopOperationFailure(cause, signal, OPERATION, "Desktop state view");
			}
		};
	})))();
}

//#endregion
export { DesktopApplicationState_exports, diffStateViews, init_DesktopApplicationState, init_DesktopRetainedContent, init_stateChanges, inspectDesktopApplicationState, readDesktopCapture, withRetainedContent };