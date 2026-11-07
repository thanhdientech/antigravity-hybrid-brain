import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { EvidenceFileError, ProviderAdapterError, err, init_evidenceErrors, init_providerAdapterError, init_result } from "./jsonLines-CKG28FwL.js";
import { AnalysisError, AnalysisInputError, init_analysisErrorBase, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { createEvidence, describeValidationFailure, init_evidence, init_validationFailure } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";
import { init_JsonFiles, readJsonFile } from "./JsonFiles-DTY4ojTz.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-C6Clg7Wy.js";
import { SafeOutputTree, SafeOutputTreeCreationFailure, init_SafeOutputTree, init_SafeOutputTreeAdmission, init_SafeOutputTreeCreationFailure, outputDirectoryAdmissionRefusal } from "./SafeOutputTree-C4FfDjZW.js";
import { DESKTOP_PROVIDER, desktopOperationFailure, init_DesktopCaptureRefusals, init_desktopStateDiff, isWithinAny } from "./DesktopCaptureRefusals-CSnCLzhc.js";
import { INSTALL_SCRIPT, electronLaunchArguments, init_appExportInstall, installLimitations } from "./appExportInstall-cnEW6Uja.js";
import { DESKTOP_EXPORT_FRAMEWORK_VERSION, admitApplication, appModuleFile, className, desktopApplicationStateSchema, evaluateTaskChecks, exportEnvironmentName, exportedStateFiles, init_DesktopExportInstall, init_appExport, init_appTask, init_appTaskChecks, init_desktopState, launchCommand, namesXmlNamespace, parseDesktopTask, refuse, renderAppClass, renderEnvToml, renderInstallScript, renderReadme, renderSkill, renderSmokeTask, versionView } from "./appTaskChecks-BHeBiaHa.js";
import { init_DesktopApplicationState, init_DesktopRetainedContent, inspectDesktopApplicationState, readDesktopCapture, withRetainedContent } from "./DesktopApplicationState-DHzEqed7.js";
import { init_environmentBundle, isPortableBundleName } from "./environmentBundle-C8C1qE7A.js";
import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Readable } from "node:stream";

//#region dist/domain/desktop/appTaskPython.js
var PYTHON_TASK_EVALUATOR, pythonLiteral, renderTaskVerifier, taskVerifierArtifact, renderTaskSteps, renderTaskEval;
function init_appTaskPython() {
	return (init_appTaskPython = __esmMin((() => {
		PYTHON_TASK_EVALUATOR = String.raw`
MISSING = object()


def _shown(value) -> str:
    text = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return text if len(text) <= 200 else text[:200] + "…"


def _same(actual, expected) -> bool:
    """JSON equality: numbers by value but never a boolean for a number, objects by their keys, arrays in order."""
    if isinstance(expected, list):
        return (isinstance(actual, list) and len(actual) == len(expected)
                and all(_same(item, wanted) for item, wanted in zip(actual, expected)))
    if isinstance(expected, dict):
        return (isinstance(actual, dict) and len(actual) == len(expected)
                and all(key in actual and _same(actual[key], value) for key, value in expected.items()))
    if isinstance(expected, bool) or isinstance(actual, bool):
        return isinstance(expected, bool) and isinstance(actual, bool) and actual == expected
    if isinstance(expected, (int, float)):
        return isinstance(actual, (int, float)) and actual == expected
    return type(actual) is type(expected) and actual == expected


def _resolve(view, pointer: str):
    current = view
    for raw in pointer[1:].split("/"):
        token = raw.replace("~1", "/").replace("~0", "~")
        if isinstance(current, list):
            if not re.fullmatch(r"0|[1-9][0-9]*", token) or int(token) >= len(current):
                return MISSING
            current = current[int(token)]
        elif isinstance(current, dict) and token in current:
            current = current[token]
        else:
            return MISSING
    return current


def _truncated(form, view) -> bool:
    if not isinstance(view, dict):
        return False
    if form in ("text", "xml"):
        return view.get("truncated") is True
    if form != "sqlite":
        return False
    tables = view.get("tables")
    return view.get("tables_truncated") is True or any(
        isinstance(table, dict) and (table.get("truncated") is True or isinstance(table.get("error"), str))
        for table in (tables.values() if isinstance(tables, dict) else []))


def _view_of(check, entry, form):
    """The view, whether it is truncated, and why the check cannot read it; an absent file reads as empty."""
    if entry is None:
        return None, False, None
    if isinstance(entry.get("error"), str):
        return None, False, f"{check['file']} has no view: {entry['error']}"
    if entry.get("format") in (None, "binary"):
        return None, False, f"{check['file']} is binary and has no view"
    if form is not None and entry.get("format") != form:
        return None, False, f"{check['file']} is read as {entry.get('format')}, not {form}"
    return entry.get("view"), _truncated(entry.get("format"), entry.get("view")), None


def _undecided(check):
    return False, f"the view of {check['file']} is truncated, so what it leaves out is unknown"


def _compared(check, n: int, what: str):
    operator = next(key for key in ("equals", "at_least", "at_most") if check.get(key) is not None)
    expected = check[operator]
    met = n == expected if operator == "equals" else n >= expected if operator == "at_least" else n <= expected
    return met, f"{n} {what}, expected {operator.replace('_', ' ')} {expected}"


def _lines(check, entry):
    view, truncated, problem = _view_of(check, entry, "text")
    if problem is not None:
        return False, problem
    lines = view.get("lines") if isinstance(view, dict) and isinstance(view.get("lines"), list) else []
    lines = [line for line in lines if isinstance(line, str)]
    file = check["file"]
    if check["kind"] == "lines_present":
        missing = next((line for line in check["lines"] if line not in lines), None)
        return (True, f"{file} has the line(s) {_shown(check['lines'])}") if missing is None else (
            False, f"{file} has no line {_shown(missing)}")
    if truncated:
        return _undecided(check)
    if check["kind"] == "lines_absent":
        found = next((line for line in check["lines"] if line in lines), None)
        return (True, f"{file} has none of the lines {_shown(check['lines'])}") if found is None else (
            False, f"{file} still has the line {_shown(found)}")
    if check.get("contains") is not None:
        n = sum(1 for line in lines if check["contains"] in line)
        return _compared(check, n, f"line(s) of {file} contain {_shown(check['contains'])}")
    n = sum(1 for line in lines if line == check["exact"])
    return _compared(check, n, f"line(s) of {file} match {_shown(check['exact'])}")


def _value(check, entry):
    view, truncated, problem = _view_of(check, entry, None)
    if problem is not None:
        return False, problem
    found = MISSING if entry is None else _resolve(view, check["pointer"])
    at = f"{check['file']} at {check['pointer']}"
    if check["kind"] == "value_equals" and isinstance(check["value"], (dict, list)) and truncated:
        return _undecided(check)
    if check["kind"] == "value_equals":
        if found is not MISSING and _same(found, check["value"]):
            return True, f"{at} is {_shown(check['value'])}"
        return False, f"{at} has no value" if found is MISSING else f"{at} is {_shown(found)}, not {_shown(check['value'])}"
    if truncated:
        return _undecided(check)
    return (True, f"{at} has no value") if found is MISSING else (False, f"{at} is {_shown(found)}")


def _rows(check, entry):
    view, _, problem = _view_of(check, entry, "sqlite")
    if problem is not None:
        return False, problem
    view = view if isinstance(view, dict) else {}
    tables = view.get("tables") if isinstance(view.get("tables"), dict) else {}
    table = tables[check["table"]] if check["table"] in tables else MISSING
    name = f"{check['file']} table {check['table']}"
    if table is MISSING and view.get("tables_truncated") is True:
        return _undecided(check)
    table = table if isinstance(table, dict) else {}
    if isinstance(table.get("error"), str):
        return False, f"{name} could not be read: {table['error']}"
    columns = table.get("columns") if isinstance(table.get("columns"), list) else []
    rows = table.get("rows") if isinstance(table.get("rows"), list) else []
    where = check.get("where") or {}

    def matches(row) -> bool:
        return isinstance(row, list) and all(
            column in columns and columns.index(column) < len(row) and _same(row[columns.index(column)], value)
            for column, value in where.items())

    n = sum(1 for row in rows if matches(row))
    if check["kind"] == "row_present":
        return (n > 0, f"{name} has a row with {_shown(where)}" if n > 0 else f"{name} has no row with {_shown(where)}")
    if table.get("truncated") is True:
        return _undecided(check)
    if check["kind"] == "row_absent":
        return (True, f"{name} has no row with {_shown(where)}") if n == 0 else (
            False, f"{name} has {n} row(s) with {_shown(where)}")
    return _compared(check, n, f"row(s) of {name}" + (f" with {_shown(where)}" if "where" in check else ""))


def _verdict(check, entry):
    kind = check["kind"]
    if kind == "file_present":
        return (entry is not None, f"{check['file']} exists" if entry is not None else f"{check['file']} does not exist")
    if kind == "file_absent":
        return (entry is None, f"{check['file']} does not exist" if entry is None else f"{check['file']} exists")
    if kind in ("lines_present", "lines_absent", "line_count"):
        return _lines(check, entry)
    if kind in ("value_equals", "value_absent"):
        return _value(check, entry)
    return _rows(check, entry)


def evaluate(checks: list, views: dict) -> list:
    """One result per check against the views data/get returned, by home path."""
    results = []
    for check in checks:
        passed, description = _verdict(check, views.get(check["file"]))
        results.append({"id": check["id"], "result": passed, "description": description})
    return results
`;
		pythonLiteral = (value) => {
			if (value === null) return "None";
			if (typeof value === "boolean") return value ? "True" : "False";
			if (typeof value !== "object") return JSON.stringify(value);
			if (Array.isArray(value)) return `[${value.map(pythonLiteral).join(", ")}]`;
			return `{${Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => `${JSON.stringify(key)}: ${pythonLiteral(item)}`).join(", ")}}`;
		};
		renderTaskVerifier = (task, app) => `"""Checks of the task ${task.name} against the ${app} app's state, exported by REA from a desktop application capture.

It reads the app's data/get through the computer, takes the typed views of its files and evaluates each check: no
model, no code from the task. A failure to reach the app raises, so the run fails rather than scoring the agent.
"""
import json
import re

from agentenv_protocol import client as protocol
from agentenv_protocol.types import RPC_PATH

APP = ${JSON.stringify(app)}
CHECKS = [
${task.checks.map((check) => `    ${pythonLiteral(check)},`).join("\n")}
]
${PYTHON_TASK_EVALUATOR}

async def verify(mcp_url, env_url):
    card = await protocol.get_card(env_url)
    child = protocol.find_child(card, APP)
    if child is None:
        raise RuntimeError(f"the computer at {env_url} lists no app named {APP}")
    answer = await protocol.get_data(env_url + (child.get("url") or RPC_PATH).removesuffix(RPC_PATH), timeout=120)
    states = [part.data["state"] for part in answer.parts
              if part.kind == "data" and isinstance(part.data.get("state"), dict)]
    if not states:
        raise RuntimeError(f"the {APP} app's data/get returned no state views")
    return evaluate(CHECKS, states[0])
`;
		taskVerifierArtifact = (task) => `${task.name}-check`;
		renderTaskSteps = (task, app) => {
			const steps = [
				{
					id: "env",
					type: "deploy_env",
					env_id: app
				},
				{
					id: "agent",
					type: "deploy_agent",
					env_ids: [app]
				},
				{
					id: "skills",
					type: "add_skills",
					env_ids: [app]
				},
				{
					id: "record",
					type: "start_computer_recording",
					env_id: app,
					name: "agent",
					depends_on: ["env"]
				},
				{
					id: "task",
					type: "prompt_agent",
					depends_on: ["skills", "record"],
					prompt: task.prompt
				},
				{
					id: "check",
					type: "env_outcome_verifier",
					env_id: app,
					file_artifact_id: taskVerifierArtifact(task),
					verifier_id: task.name,
					depends_on: ["task"]
				},
				{
					id: "end",
					type: "end_computer_recording",
					name: "agent",
					depends_on: ["task"]
				}
			];
			return `[\n${steps.map((step) => `  ${JSON.stringify(step)}`).join(",\n")}\n]\n`;
		};
		renderTaskEval = (tasks) => `tasks = [${tasks.map((task) => JSON.stringify(task.name)).join(", ")}]\n`;
	})))();
}

//#endregion
//#region dist/application/desktop/DesktopTaskExport.js
var OPERATION$1, REWRITE, taskFileFailure, readTaskFile, targetProblem, viewsAt, taskReadme, admitDesktopTask;
function init_DesktopTaskExport() {
	return (init_DesktopTaskExport = __esmMin((() => {
		init_ArtifactResourceScope();
		init_appTask();
		init_appTaskChecks();
		init_appTaskPython();
		init_analysisErrorCore();
		init_analysisErrorCleanup();
		init_evidenceErrors();
		init_result();
		init_validationFailure();
		init_desktopStateDiff();
		init_environmentBundle();
		init_JsonFiles();
		init_DesktopCaptureRefusals();
		init_DesktopExportInstall();
		OPERATION$1 = "export_desktop_application";
		REWRITE = "Fix the task file and export again.";
		taskFileFailure = (path, error) => {
			if (!(error instanceof EvidenceFileError) || error.reason === "io") return error;
			const detail = describeValidationFailure(error.cause);
			const json = error.reason === "invalid-json";
			const userMessage = json ? `The task file ${path} is not valid UTF-8 JSON (${detail}).` : `The task file ${path} could not be read (${detail}).`;
			return new AnalysisInputError(OPERATION$1, {
				userMessage,
				remediationAction: json ? "Repair the task file, then export again." : "Pass a regular JSON file, such as the task describe-desktop-application-task drafts.",
				conformsToInputContract: true,
				cause: error
			}, [{
				path: ["task"],
				reason: "invalid_value",
				message: userMessage
			}]);
		};
		readTaskFile = async (path, signal) => {
			const resources = new ArtifactResourceScope();
			const loaded = await readJsonFile(path, signal, resources, OPERATION$1).catch((cause) => err(cause));
			const typed = (cause) => desktopOperationFailure(cause, signal, OPERATION$1, "Reading the task file");
			const closed = await resources.close().then(() => undefined, typed);
			const primary = loaded.ok ? undefined : taskFileFailure(path, typed(loaded.error));
			if (closed !== undefined) throw primary === undefined ? closed : analysisErrorWithCleanupFailure(primary, closed, OPERATION$1);
			if (loaded.ok) return loaded.value;
			throw primary ?? typed(loaded.error);
		};
		targetProblem = (check, target) => {
			if (!isWithinAny(check.file, target.paths)) return `names ${check.file}, which is not under the app's owned paths (${target.paths.join(", ") || "none"}); data/get serves only those`;
			if (JSON.stringify(check).includes(target.capturedHome)) return `names the captured home ${target.capturedHome}, which the computer's home replaces`;
			if (check.kind !== "value_equals" && check.kind !== "value_absent") return undefined;
			const versions = target.files.get(check.file)?.versions ?? [];
			if (versions.some((version) => version.format === "text")) return `points into ${check.file}, which is text; use lines_present, lines_absent or line_count`;
			return versions.some((version) => version.format === "xml" && namesXmlNamespace(version.view)) ? `points into ${check.file}, whose XML uses namespaces the verifier names differently` : undefined;
		};
		viewsAt = (files, end) => {
			const views = new Map();
			for (const [home, path] of files) {
				const version = end === "baseline" ? path.versions[0] : path.versions.at(-1);
				if (end === "baseline" && version?.present === true && version.sha256 === null) continue;
				const view = version === undefined ? undefined : versionView(version);
				if (view !== undefined) views.set(home, view);
			}
			return views;
		};
		taskReadme = (task, app, failingOnSeed) => `
## Task \`${task.name}\`

\`tasks/${task.name}.json\` deploys the app, has the agent work through the computer from the prompt below, and grades
the outcome with \`artifacts/${taskVerifierArtifact(task)}/verify.py\`, which reads the app's \`data/get\` views and needs
no model. \`evals/${app}.toml\` names it, so a run of the bundle runs it.

${task.prompt.split("\n").map((line) => `> ${line}`).join("\n")}

Checks, each of which must pass:

${task.checks.map(({ id, ...check }) => `- \`${id}\`: \`${JSON.stringify(check)}\``).join("\n")}

REA kept the task because its checks fail on the seed (${failingOnSeed.map((id) => `\`${id}\``).join(", ")}) and all
pass on the captured end state.

To measure a solve rate, run the task k times (3 by default) with the agent and model to measure, and count the runs
whose summary line says \`passed\`; a run that says \`failed\` did not finish and is run again rather than counted:

    agent-env run <this folder> --task ${task.name} --agent claude-code --model MODEL
`;
		admitDesktopTask = async (paths, target, signal) => {
			if (paths.length > 1) throw refuse(`${String(paths.length)} task files were given; a capture yields one task.`, "task", "Pass --task once, with the task written for this capture.");
			const [path] = paths;
			if (path === undefined) return undefined;
			const parsed = parseDesktopTask(await readTaskFile(path, signal), isPortableBundleName);
			if (!parsed.ok) throw refuse(`The task file ${path} is refused: ${parsed.error}`, "task", REWRITE);
			const task = parsed.value;
			for (const check of task.checks) {
				const problem = targetProblem(check, target);
				if (problem !== undefined) throw refuse(`Check ${JSON.stringify(check.id)} ${problem}.`, "task", REWRITE);
			}
			const end = evaluateTaskChecks(task.checks, viewsAt(target.files, "final"));
			const failing = end.find((outcome) => !outcome.passed);
			if (failing !== undefined) throw refuse(`Check ${JSON.stringify(failing.id)} fails on the captured end state: ${failing.description}.`, "task", "Write checks that the captured end state passes; describe-desktop-application-task shows its views.");
			const failingOnSeed = evaluateTaskChecks(task.checks, viewsAt(target.files, "baseline")).filter((outcome) => !outcome.passed).map((outcome) => outcome.id);
			if (failingOnSeed.length === 0) throw refuse("Every check already passes on the seed, so the task would be done before the agent starts.", "task", "Add a check that the change the user made is needed for.");
			return {
				summary: {
					name: task.name,
					checks: task.checks.length,
					failing_on_seed: failingOnSeed
				},
				readme: taskReadme(task, target.name, failingOnSeed),
				files: [
					{
						path: `tasks/${task.name}.json`,
						content: renderTaskSteps(task, target.name)
					},
					{
						path: `artifacts/${taskVerifierArtifact(task)}/verify.py`,
						content: renderTaskVerifier(task, target.name)
					},
					{
						path: `evals/${target.name}.toml`,
						content: renderTaskEval([task])
					}
				]
			};
		};
	})))();
}

//#endregion
//#region dist/application/desktop/DesktopApplicationExport.js
var OPERATION, SEED_MAX_BYTES, TEXT_FORMATS, isRecord, baselineDconf, unseededFiles, planExport, EXPORT_LIMITATIONS, writeBundle, seedPath, retainedCopies, writeFiles, runExport, writtenWithOpenHandles, exportDesktopApplication;
function init_DesktopApplicationExport() {
	return (init_DesktopApplicationExport = __esmMin((() => {
		init_SafeOutputTree();
		init_ArtifactResourceScope();
		init_SafeOutputTreeAdmission();
		init_SafeOutputTreeCreationFailure();
		init_analysisErrorBase();
		init_appExport();
		init_appExportInstall();
		init_desktopState();
		init_desktopStateDiff();
		init_evidence();
		init_providerAdapterError();
		init_DesktopApplicationState();
		init_DesktopCaptureRefusals();
		init_DesktopExportInstall();
		init_DesktopRetainedContent();
		init_DesktopTaskExport();
		OPERATION = "export_desktop_application";
		SEED_MAX_BYTES = 1024 * 1024 * 1024;
		TEXT_FORMATS = new Set([
			"text",
			"json",
			"keyfile",
			"xml"
		]);
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		baselineDconf = (state) => {
			const database = state.paths.find((path) => path.format === "dconf" && path.role === "application_state");
			const view = database?.versions.find((version) => version.present)?.view;
			if (database?.versions[0]?.present !== true || !isRecord(view) || !isRecord(view.groups)) return {
				text: "",
				groups: 0
			};
			const lines = [];
			for (const [group, keys] of Object.entries(view.groups)) {
				if (!isRecord(keys)) continue;
				lines.push(`[${group}]`);
				for (const [key, value] of Object.entries(keys)) if (typeof value === "string") lines.push(`${key}=${value}`);
				lines.push("");
			}
			return {
				text: lines.join("\n"),
				groups: Object.keys(view.groups).length
			};
		};
		unseededFiles = (capture, homePath, files, paths) => {
			const listed = [...files].filter(([home, path]) => isWithinAny(home, paths) && path.versions[0]?.present === true && path.versions[0].sha256 === null).map(([home]) => home);
			const omitted = capture.state.omitted_content.map(({ path }) => homePath(path)).filter((home) => home !== null && isWithinAny(home, paths) && !files.has(home));
			return [...new Set([...listed, ...omitted])].sort();
		};
		planExport = (request, capture, state, evidenceId) => {
			const { application, host } = capture;
			const source = exportEnvironmentName(capture, request.name);
			const { install, windowClass } = admitApplication(capture, source, request.packageUrl);
			const electron = application.executable.electron_markers.length > 0;
			const { homePath, files, collisions, paths } = exportedStateFiles(capture, state);
			const seeds = new Map();
			const textSeeds = [];
			for (const [home, path] of files) {
				const baseline = path.versions[0];
				if (!isWithinAny(home, paths) || baseline?.present !== true) continue;
				if (baseline.sha256 === null) continue;
				seeds.set(home, baseline.sha256);
				if (TEXT_FORMATS.has(baseline.format ?? "")) textSeeds.push(home);
			}
			const plan = {
				name: source,
				className: className(source),
				title: application.desktop_entry?.name ?? source,
				aptPackage: install.aptPackage,
				aptRelease: install.release,
				packageVersion: application.package.version,
				libraryPackages: install.libraryPackages,
				aptSources: install.sources,
				architectures: install.architectures,
				packageFile: install.packageFile,
				electron,
				command: launchCommand(electronLaunchArguments(application.argv, electron), host.home, application.working_directory),
				windowClass,
				paths,
				capturedHome: host.home,
				seedFiles: [...seeds.keys()].sort(),
				textSeeds: textSeeds.sort(),
				unseededFiles: unseededFiles(capture, homePath, files, paths),
				dconf: baselineDconf(state).text,
				captureEvidenceId: evidenceId
			};
			const limitations = installLimitations(install, application.package, electron);
			return {
				plan,
				seeds,
				limitations,
				collisions,
				files
			};
		};
		EXPORT_LIMITATIONS = ["The seed is the user's real state before the capture; keep the bundle local.", "Binary state files are seeded as captured; only text files, UTF-8 or UTF-16 with a byte-order mark, have the captured home path respelled."];
		writeBundle = async (directory, write, signal) => {
			await mkdir(dirname(directory), {
				recursive: true,
				mode: 448
			});
			const resources = new ArtifactResourceScope();
			let tree;
			let outcome;
			try {
				try {
					tree = await SafeOutputTree.create(directory, process.platform, { acceptExistingEmpty: true });
				} catch (cause) {
					if (cause instanceof SafeOutputTreeCreationFailure) tree = cause.tree;
					throw cause;
				}
				await write(tree);
				await tree.commit(signal);
				outcome = { kind: "completed" };
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			if (tree !== undefined) {
				const released = await resources.release({
					kind: "output-tree",
					resource: directory,
					tree
				});
				if (released.kind === "failed") {
					if (tree.published) return released;
					throw resources.cleanupFailure(outcome, [released]);
				}
				if (tree.published) return undefined;
			}
			if (outcome.kind === "failed") throw outputDirectoryAdmissionRefusal(OPERATION, "directory", outcome.cause);
			return undefined;
		};
		seedPath = (plan, seed) => `envs/${plan.name}/seed/${seed}`;
		retainedCopies = (plan, seeds) => [...[...seeds].map(([seed, digest]) => ({
			path: seedPath(plan, seed),
			digest,
			name: `~/${seed}`
		})), ...[...new Map(plan.aptSources.map((source) => [source.keyFile, source.keySha256]))].map(([keyFile, digest]) => ({
			path: `envs/${plan.name}/${keyFile}`,
			digest,
			name: `the apt key ${keyFile}`
		}))];
		writeFiles = async (tree, content, bundle, signal) => {
			for (const file of bundle.generated) {
				const sha256 = createHash("sha256").update(file.bytes).digest("hex");
				await tree.write(file.path, Readable.from([file.bytes]), {
					bytes: file.bytes.length,
					sha256
				}, signal);
			}
			for (const copy of bundle.copies) {
				signal?.throwIfAborted();
				const bytes = await content.read(copy.digest, signal);
				if (!bytes.ok) throw refuse(`The retained content of ${copy.name} ${bytes.error}.`, "capture", "Capture the application again, leaving a seed file out of its state paths if it cannot be retained.");
				await tree.write(copy.path, Readable.from([bytes.value]), {
					bytes: bytes.value.length,
					sha256: copy.digest
				}, signal);
			}
		};
		runExport = async (request, readers, signal) => {
			const { evidence, capture } = await readDesktopCapture(request.capture, signal);
			const stateEvidence = await inspectDesktopApplicationState(request.capture, readers, signal);
			if (stateEvidence instanceof AnalysisError) throw stateEvidence;
			const state = desktopApplicationStateSchema.parse(stateEvidence.normalized_result);
			const { plan, seeds, collisions, files, ...install } = planExport(request, capture, state, evidence.evidence_id);
			const admitted = await admitDesktopTask(request.tasks, {
				...plan,
				files
			}, signal);
			const copies = retainedCopies(plan, seeds);
			const environment = `envs/${plan.name}`;
			const text = (path, content) => ({
				path,
				bytes: Buffer.from(content)
			});
			const generated = [
				text("README.md", renderReadme(plan, admitted?.readme)),
				text(`${environment}/env.toml`, renderEnvToml(plan)),
				text(`${environment}/${appModuleFile(plan.name)}`, renderAppClass(plan)),
				text(`${environment}/SKILL.md`, renderSkill(plan)),
				...plan.packageFile === null ? [] : [text(`${environment}/${INSTALL_SCRIPT}`, renderInstallScript(plan.packageFile))],
				text("tasks/smoke.json", renderSmokeTask(plan)),
				...(admitted?.files ?? []).map((file) => text(file.path, file.content))
			];
			const unclosed = await withRetainedContent(request.capture, (content) => writeBundle(request.directory, (tree) => writeFiles(tree, content, {
				generated,
				copies
			}, signal), signal), SEED_MAX_BYTES);
			const opened = capture.state.unretained_opened_directories;
			const limitations = [
				...EXPORT_LIMITATIONS,
				...install.limitations,
				...plan.unseededFiles.length === 0 ? [] : [`${String(plan.unseededFiles.length)} file(s) under the owned paths existed before the capture but were not retained, so they are not seeded.`],
				...opened.length === 0 ? [] : [`The application held files open in ${opened.join(", ")}, whose starting content the capture did not retain, so nothing there is seeded.`],
				...collisions.map(({ home, kept, dropped }) => `${dropped} and ${kept} both map to ~/${home}; the export uses ${kept} and leaves out ${dropped}.`)
			];
			const result = {
				directory: request.directory,
				environment: plan.name,
				framework_version: DESKTOP_EXPORT_FRAMEWORK_VERSION,
				paths: plan.paths,
				seed_files: plan.seedFiles,
				unseeded_files: plan.unseededFiles,
				dconf_groups: baselineDconf(state).groups,
				files: [...generated.map((file) => file.path), ...copies.map((copy) => copy.path)],
				limitations,
				task: admitted?.summary ?? null
			};
			return {
				result,
				captureEvidenceId: evidence.evidence_id,
				unclosed
			};
		};
		writtenWithOpenHandles = (directory, evidence, release) => {
			const reason = release.cause instanceof Error ? release.cause.message : String(release.cause);
			const error = new ProviderAdapterError(DESKTOP_PROVIDER.id, OPERATION, {
				userMessage: `The bundle was written to ${directory} and is complete, but its output handles could not be closed: ${reason}.`,
				remediationAction: "Use the written bundle; the handles are released when this process exits.",
				cleanup: {
					reason,
					resources: [directory]
				},
				partialObservation: evidence,
				diagnostics: { output_directory: directory }
			});
			release.lease.bindCleanupError(error);
			return error;
		};
		exportDesktopApplication = async (request, readers, signal) => {
			try {
				const { result, captureEvidenceId, unclosed } = await runExport(request, readers, signal);
				const evidence = createEvidence(undefined, DESKTOP_PROVIDER, {
					predicateType: "rea.desktop-application-export",
					operation: OPERATION,
					parameters: {
						capture_evidence_id: captureEvidenceId,
						named: request.name !== undefined,
						tasks: request.tasks.length,
						package_url: request.packageUrl !== undefined
					},
					result: {
						...result,
						paths: [...result.paths],
						seed_files: [...result.seed_files],
						unseeded_files: [...result.unseeded_files],
						files: [...result.files],
						limitations: [...result.limitations]
					},
					confidence: "derived",
					authority: "analyst-inference",
					limitations: [...result.limitations]
				});
				return unclosed === undefined ? evidence : writtenWithOpenHandles(request.directory, evidence, unclosed);
			} catch (cause) {
				return desktopOperationFailure(cause, signal, OPERATION, "Desktop export");
			}
		};
	})))();
}

//#endregion
init_DesktopApplicationExport();
export { exportDesktopApplication };