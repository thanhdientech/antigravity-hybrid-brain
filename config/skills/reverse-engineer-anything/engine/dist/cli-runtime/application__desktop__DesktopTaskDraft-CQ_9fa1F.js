import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisError, init_analysisErrorBase } from "./analysisErrorCore-Dm6oHouq.js";
import { createEvidence, init_evidence } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { DESKTOP_PROVIDER, desktopOperationFailure, init_DesktopCaptureRefusals, init_desktopStateDiff, isWithinAny } from "./DesktopCaptureRefusals-CSnCLzhc.js";
import { DRAFT_PROMPT, desktopApplicationStateSchema, exportEnvironmentName, exportedStateFiles, init_DesktopExportInstall, init_appExport, init_appTask, init_appTaskChecks, init_desktopState, isTimestamp, namesXmlNamespace, resolvePointer } from "./appTaskChecks-BHeBiaHa.js";
import { diffStateViews, init_DesktopApplicationState, init_stateChanges, inspectDesktopApplicationState, readDesktopCapture } from "./DesktopApplicationState-DHzEqed7.js";

//#region dist/domain/desktop/appTaskDraft.js
var MAX_SUGGESTIONS, MAX_ITEMS, MAX_CHARS, isRecord, bounded, draftVersion, linesOf, counts, lineCounts, textSuggestions, escapeToken, keyPointers, innermost, valueSuggestions, tableViews, rowWhere, rowSuggestions, suggestedChecks, netChange, draftTaskFiles;
function init_appTaskDraft() {
	return (init_appTaskDraft = __esmMin((() => {
		init_appTask();
		init_appTaskChecks();
		init_stateChanges();
		MAX_SUGGESTIONS = 10;
		MAX_ITEMS = 200;
		MAX_CHARS = 2e3;
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		bounded = (value) => {
			let cut = false;
			const visit = (node) => {
				if (typeof node === "string" && node.length > MAX_CHARS) {
					cut = true;
					return `${node.slice(0, MAX_CHARS)}…`;
				}
				if (Array.isArray(node)) {
					cut ||= node.length > MAX_ITEMS;
					return node.slice(0, MAX_ITEMS).map(visit);
				}
				if (!isRecord(node)) return node;
				const entries = Object.entries(node);
				cut ||= entries.length > MAX_ITEMS;
				return Object.fromEntries(entries.slice(0, MAX_ITEMS).map(([key, item]) => [key, visit(item)]));
			};
			return {
				value: value === null ? null : visit(value),
				cut
			};
		};
		draftVersion = (version, withView) => {
			const { value, cut } = bounded(withView ? version.view : null);
			return {
				checkpoint: version.checkpoint,
				present: version.present,
				format: version.format,
				...withView ? {
					view: value,
					view_cut: cut
				} : {},
				view_error: version.view_error
			};
		};
		linesOf = (version) => isRecord(version.view) && Array.isArray(version.view.lines) ? version.view.lines.filter((line) => typeof line === "string") : [];
		counts = (lines) => {
			const result = new Map();
			for (const line of lines) result.set(line, (result.get(line) ?? 0) + 1);
			return result;
		};
		lineCounts = (baseline, final) => {
			const before = counts(linesOf(baseline));
			return [...counts(linesOf(final))].filter(([line, n]) => (before.get(line) ?? n) !== n).map(([line, n]) => ({
				line,
				baseline: before.get(line) ?? 0,
				final: n
			}));
		};
		textSuggestions = (file, baseline, final) => {
			const before = new Set(baseline.present ? linesOf(baseline) : []);
			const after = new Set(linesOf(final));
			const added = [...after].filter((line) => !before.has(line));
			const gone = [...before].filter((line) => !after.has(line));
			const suggestions = [];
			if (added.length > 0 && added.length <= MAX_SUGGESTIONS) suggestions.push({
				kind: "lines_present",
				file,
				lines: added
			});
			const truncated = [baseline, final].some((version) => isRecord(version.view) && version.view.truncated === true);
			if (truncated) return suggestions;
			if (gone.length > 0 && gone.length <= MAX_SUGGESTIONS) suggestions.push({
				kind: "lines_absent",
				file,
				lines: gone
			});
			for (const { line, final: n } of lineCounts(baseline, final).filter(({ line }) => /\p{L}/u.test(line))) suggestions.push({
				kind: "line_count",
				file,
				exact: line,
				equals: n
			});
			return suggestions;
		};
		escapeToken = (token) => token.replaceAll("~", "~0").replaceAll("/", "~1");
		keyPointers = (views) => new Map(views.flatMap((view) => Object.entries(isRecord(view) && isRecord(view.groups) ? view.groups : {}).flatMap(([group, keys]) => Object.keys(isRecord(keys) ? keys : {}).map((key) => [`${group}/${escapeToken(key)}`, `/groups/${escapeToken(group)}/${escapeToken(key)}`]))));
		innermost = (pointers) => pointers.filter((pointer) => !pointers.some((other) => other.startsWith(`${pointer}/`)));
		valueSuggestions = (file, baseline, final) => {
			const format = final.format;
			if (format !== "json" && format !== "xml" && format !== "keyfile") return [];
			if (format === "xml" && [baseline.view, final.view].some(namesXmlNamespace)) return [];
			const change = diffStateViews(format, baseline.view, final.view);
			const pointers = keyPointers([baseline.view, final.view]);
			const pointer = (entry) => format === "keyfile" ? pointers.get(entry) : entry;
			const leaves = (entries) => format === "keyfile" ? entries : innermost(entries);
			const suggestions = [];
			for (const entry of leaves([...change.added, ...change.changed])) {
				const at = pointer(entry);
				const value = at === undefined ? undefined : resolvePointer(final.view, at);
				if (at !== undefined && at !== "" && value !== undefined && !isTimestamp(value)) suggestions.push({
					kind: "value_equals",
					file,
					pointer: at,
					value
				});
			}
			for (const entry of leaves(change.removed)) {
				const at = pointer(entry);
				if (at !== undefined && at !== "") suggestions.push({
					kind: "value_absent",
					file,
					pointer: at
				});
			}
			return suggestions;
		};
		tableViews = (version) => {
			const tables = new Map();
			const view = version.present ? version.view : null;
			if (!isRecord(view) || !isRecord(view.tables)) return tables;
			for (const [name, table] of Object.entries(view.tables)) {
				if (!isRecord(table) || table.truncated !== false) continue;
				const strings = (value) => Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
				tables.set(name, {
					columns: strings(table.columns),
					key: strings(table.primary_key),
					rows: Array.isArray(table.rows) ? table.rows.filter(Array.isArray) : []
				});
			}
			return tables;
		};
		rowWhere = (table, row, keep) => Object.fromEntries(table.columns.flatMap((column, index) => {
			const value = row[index] ?? null;
			return keep(column) && !isTimestamp(value) ? [[column, value]] : [];
		}));
		rowSuggestions = (file, baseline, final) => {
			const before = tableViews(baseline);
			const suggestions = [];
			const push = (kind, table, where) => {
				if (Object.keys(where).length > 0) suggestions.push({
					kind,
					file,
					table,
					where
				});
			};
			for (const [name, table] of tableViews(final)) {
				const old = before.get(name) ?? {
					...table,
					rows: []
				};
				const identity = (view, row) => JSON.stringify(view.key.length === 0 ? row : view.key.map((column) => row[view.columns.indexOf(column)] ?? null));
				const oldRows = new Map(old.rows.map((row) => [identity(old, row), row]));
				const newRows = new Map(table.rows.map((row) => [identity(table, row), row]));
				const keyed = (column) => table.key.includes(column);
				for (const [id, row] of newRows) {
					const previous = oldRows.get(id);
					if (previous === undefined) push("row_present", name, rowWhere(table, row, (column) => table.key.length === 0 || !keyed(column)));
					else if (JSON.stringify(previous) !== JSON.stringify(row)) push("row_present", name, rowWhere(table, row, (column) => keyed(column) || JSON.stringify(row[table.columns.indexOf(column)]) !== JSON.stringify(previous[old.columns.indexOf(column)])));
				}
				for (const [id, row] of oldRows) if (!newRows.has(id)) push("row_absent", name, rowWhere(old, row, (column) => old.key.length === 0 || old.key.includes(column)));
				if (old.rows.length !== table.rows.length) suggestions.push({
					kind: "row_count",
					file,
					table: name,
					equals: table.rows.length
				});
			}
			return suggestions;
		};
		suggestedChecks = (file, baseline, final) => {
			if (!final.present) return [{
				kind: "file_absent",
				file
			}];
			const created = baseline.present ? [] : [{
				kind: "file_present",
				file
			}];
			const content = final.format === "text" ? textSuggestions(file, baseline, final) : !baseline.present ? [] : final.format === "sqlite" ? rowSuggestions(file, baseline, final) : valueSuggestions(file, baseline, final);
			return [...created, ...content].slice(0, MAX_SUGGESTIONS);
		};
		netChange = (baseline, final) => {
			if (baseline.checkpoint_index === final.checkpoint_index) return undefined;
			if (!baseline.present && !final.present) return undefined;
			if (baseline.present && final.present && final.format !== "sqlite" && baseline.sha256 !== null && baseline.sha256 === final.sha256) return undefined;
			if (!baseline.present) return { kind: "created" };
			if (!final.present) return { kind: "deleted" };
			if (baseline.view_error !== null || final.view_error !== null || baseline.format === null || final.format === null) return { kind: "unreadable" };
			if (baseline.format !== final.format) return { kind: "format" };
			if (final.format === "binary") return { kind: "content" };
			const difference = diffStateViews(final.format, baseline.view, final.view);
			if (difference.added_count + difference.removed_count + difference.changed_count === 0) return difference.complete ? undefined : { kind: "content" };
			if (final.format !== "text") return difference;
			return {
				...difference,
				added: [...new Set(difference.added)],
				removed: [...new Set(difference.removed)],
				line_counts: lineCounts(baseline, final).slice(0, 100)
			};
		};
		draftTaskFiles = (files, served) => {
			const changed = [...files].filter(([home]) => served(home)).flatMap(([home, path]) => {
				const baseline = path.versions[0];
				const final = path.versions.at(-1);
				const change = baseline === undefined || final === undefined ? undefined : netChange(baseline, final);
				return change === undefined || baseline === undefined || final === undefined ? [] : [{
					home,
					path,
					baseline,
					final,
					change
				}];
			}).sort((left, right) => left.home < right.home ? -1 : 1);
			const role = changed.some(({ path }) => path.role === "document") ? "document" : "application_state";
			return changed.map(({ home, path, baseline, final, change }) => ({
				file: home,
				role: path.role,
				baseline: draftVersion(baseline, path.role === role),
				final: draftVersion(final, path.role === role),
				change,
				suggested: path.role === role ? suggestedChecks(home, baseline, final) : []
			}));
		};
	})))();
}

//#endregion
//#region dist/application/desktop/DesktopTaskDraft.js
var OPERATION, DRAFT_LIMITATIONS, draft, draftDesktopApplicationTask;
function init_DesktopTaskDraft() {
	return (init_DesktopTaskDraft = __esmMin((() => {
		init_analysisErrorBase();
		init_appExport();
		init_appTask();
		init_appTaskDraft();
		init_desktopState();
		init_desktopStateDiff();
		init_evidence();
		init_DesktopApplicationState();
		init_DesktopCaptureRefusals();
		init_DesktopExportInstall();
		OPERATION = "describe_desktop_application_task";
		DRAFT_LIMITATIONS = [
			"Files are those under the paths the export owns, whose state differs between the capture's first and last version; data/get serves nothing else.",
			"Suggested checks and views cover documents, or the app's own state when no document changed; each check is derived from the net change and is a starting point, not a task.",
			"Views longer than 200 items or strings longer than 2,000 characters are cut here (view_cut); inspect-desktop-application-state shows every view whole."
		];
		draft = async (folder, readers, signal) => {
			const { evidence, capture } = await readDesktopCapture(folder, signal);
			const stateEvidence = await inspectDesktopApplicationState(folder, readers, signal);
			if (stateEvidence instanceof AnalysisError) throw stateEvidence;
			const state = desktopApplicationStateSchema.parse(stateEvidence.normalized_result);
			const { files, paths } = exportedStateFiles(capture, state);
			const drafted = draftTaskFiles(files, (home) => isWithinAny(home, paths));
			const environment = exportEnvironmentName(capture, undefined);
			const checkpoints = state.capture.checkpoints;
			const result = {
				application: {
					environment,
					title: capture.application.desktop_entry?.name ?? environment,
					window_class: capture.session.window_match?.class ?? null
				},
				owned_paths: [...paths],
				checkpoints: {
					baseline: checkpoints[0],
					final: checkpoints.at(-1)
				},
				files: drafted.map(({ file, role, baseline, final, change }) => ({
					file,
					role,
					baseline,
					final,
					change
				})),
				task: {
					name: "change",
					prompt: DRAFT_PROMPT,
					checks: drafted.flatMap((file) => file.suggested).map((check, index) => ({
						id: `check-${String(index + 1)}`,
						...check
					}))
				}
			};
			signal?.throwIfAborted();
			return createEvidence(undefined, DESKTOP_PROVIDER, {
				predicateType: "rea.desktop-application-task-draft",
				operation: OPERATION,
				parameters: { capture_evidence_id: evidence.evidence_id },
				result,
				confidence: "inferred",
				authority: "analyst-inference",
				limitations: [...DRAFT_LIMITATIONS, ...capture.limitations]
			});
		};
		draftDesktopApplicationTask = async (folder, readers, signal) => {
			try {
				return await draft(folder, readers, signal);
			} catch (cause) {
				return desktopOperationFailure(cause, signal, OPERATION, "Desktop task draft");
			}
		};
	})))();
}

//#endregion
init_DesktopTaskDraft();
export { draftDesktopApplicationTask };