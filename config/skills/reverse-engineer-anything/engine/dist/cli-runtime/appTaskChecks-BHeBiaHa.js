import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisInputError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { describeValidationFailure, init_validationFailure } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_jsonValue, jsonValueSchema } from "./jsonValue-DGGrC1lE.js";
import { desktopApplicationCaptureSchema, init_desktopCapture, init_desktopStateDiff, isWithinAny } from "./DesktopCaptureRefusals-CSnCLzhc.js";
import { INSTALL_SCRIPT, exportInstall, init_appExportInstall } from "./appExportInstall-cnEW6Uja.js";
import { init_environmentBundle, isPortableBundleName } from "./environmentBundle-C8C1qE7A.js";
import { z } from "zod";

//#region dist/domain/desktop/appExportPython.js
var PYTHON_READY_CHECK, PYTHON_IMPORTS, PYTHON_HELPERS, PYTHON_CONSTANTS, boundNames, PYTHON_MODULE_NAMES, PYTHON_DATA_HOOKS;
function init_appExportPython() {
	return (init_appExportPython = __esmMin((() => {
		PYTHON_READY_CHECK = `
    @ready_check
    def main_window_shown(self) -> bool:
        """A window of the app's class that the taskbar lists is shown, not only a splash screen or a dialog."""
        return _taskbar_window(WINDOW_CLASS)
`;
		PYTHON_IMPORTS = `from __future__ import annotations

import contextlib
import json
import math
import os
import re
import sqlite3
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ElementTree
from pathlib import Path

from agentenv_protocol import add_data, get_data, reset_data
from agentenv_protocol.computer import AptSource, ComputerAppEnvironment, Download, Launch, Packages, Ready, RunScript, computer_app, linux, ready_check
from agentenv_protocol.computer.app_data import INITIAL, add, get, in_thread, keep_initial, reset
from agentenv_protocol.types import DataPart
`;
		PYTHON_HELPERS = String.raw`
XML_SUFFIXES = (".xml", ".xbel", ".plist", ".svg", ".ui")
GROUP_HEADER = re.compile(r"^\[([^\]]+)\]$")
LINE_BREAK = re.compile(r"\r?\n")
SQLITE_HEADER = b"SQLite format 3\x00"
XML_SPACE = "{http://www.w3.org/XML/1998/namespace}space"
MAX_VIEW_BYTES = 64 * 1024 * 1024
MAX_SAFE_INTEGER = 2**53 - 1
MAX_TABLES = 64
MAX_ROWS = 500
MAX_LINES = 5000
MAX_XML_NODES = 5000
MAX_XML_DEPTH = 64
SQLITE_BUSY_S = 0.25


def _respelled(text: str, home: Path) -> str:
    """The captured home path respelled to this computer's home, only where a whole path segment ends after it."""
    return re.sub(re.escape(CAPTURED_HOME) + r"(?![\w.@+~-])", lambda _: str(home), text)


def _respelled_utf16(data: bytes, home: Path) -> bytes:
    """A UTF-16 text file with a byte-order mark respelled like a text seed, its mark kept; any other bytes as given."""
    for mark, codec in ((b"\xff\xfe", "utf-16-le"), (b"\xfe\xff", "utf-16-be")):
        if data.startswith(mark):
            try:
                text = data[len(mark):].decode(codec)
            except UnicodeDecodeError:
                return data
            return mark + _respelled(text, home).encode(codec) if CAPTURED_HOME in text else data
    return data


#: What marks a window as not yet the app's own: skipping the taskbar, as splash screens and dialogs do, or a splash type.
SPLASH_MARKS = ("_NET_WM_STATE_SKIP_TASKBAR", "_NET_WM_WINDOW_TYPE_SPLASH")


def _taskbar_window(window_class: str) -> bool:
    """Whether a top-level window of the given class that the taskbar lists is shown; a splash screen or a dialog
    skips the taskbar."""
    def xprop(*args: str) -> str:
        done = subprocess.run(["xprop", *args], capture_output=True, text=True)
        return done.stdout if done.returncode == 0 else ""

    for window in re.findall(r"0x[0-9a-f]+", xprop("-root", "_NET_CLIENT_LIST").partition("#")[2]):
        props = xprop("-id", window, "WM_CLASS", "_NET_WM_STATE", "_NET_WM_WINDOW_TYPE")
        classes = re.findall(r'"((?:[^"\\]|\\.)*)"', props.partition("WM_CLASS")[2].split("\n", 1)[0])
        if window_class in classes and not any(mark in props for mark in SPLASH_MARKS):
            return True
    return False


def _seed_home(home: Path) -> None:
    """Copy the captured files into this computer's home; text files, UTF-16 ones too, have the captured home path
    respelled."""
    seed = HERE / "seed"
    for source in sorted(seed.rglob("*")) if seed.is_dir() else []:
        if not source.is_file():
            continue
        relative = source.relative_to(seed).as_posix()
        target = home / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        data = source.read_bytes()
        if relative in TEXT_SEEDS:
            data = _respelled(data.decode("utf-8"), home).encode("utf-8")
        else:
            data = _respelled_utf16(data, home)
        target.write_bytes(data)


def _dconf(arguments: list, environment: dict) -> str:
    return subprocess.run(["dconf", *arguments], env={**os.environ, **environment}, capture_output=True, text=True,
                          check=True).stdout


def _load_dconf(home: Path) -> None:
    """Compile the captured dconf keys into the user database without D-Bus, which is not up yet. Keys already there
    stay unless captured: dconf compile reads the key files in name order and a later file wins. A failure is
    reported and the app starts without them."""
    if not DCONF:
        return
    database = home / ".config" / "dconf" / "user"
    try:
        database.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(dir=database.parent) as scratch:
            keyfiles = Path(scratch, "keyfiles")
            keyfiles.mkdir()
            if database.is_file():
                profile = Path(scratch, "profile")
                profile.write_text(f"file-db:{database}\n")
                existing = _dconf(["dump", "/"], {"DCONF_PROFILE": str(profile)})
                (keyfiles / "00-existing").write_text(existing)
            (keyfiles / "01-captured").write_text(_respelled(DCONF, home))
            _dconf(["compile", str(Path(scratch, "user")), str(keyfiles)], {})
            os.replace(Path(scratch, "user"), database)
    except (OSError, subprocess.CalledProcessError) as error:
        detail = (getattr(error, "stderr", None) or "").strip().splitlines()
        print(f"warning: the captured dconf settings were not loaded: {detail[-1] if detail else error}",
              file=sys.stderr)


def _sqlite_text(data: bytes):
    text = data.decode("utf-8", "replace")
    return {"text": text, "bytes_hex": data.hex()} if "�" in text else text


def _cell(value):
    if isinstance(value, bytes):
        return {"blob_hex": value.hex()}
    if isinstance(value, int) and abs(value) > MAX_SAFE_INTEGER:
        return {"integer": str(value)}
    # JSON has no infinities or negative zero; REA's SQLite reader spells them as strings.
    if isinstance(value, float) and (math.isinf(value) or (value == 0 and math.copysign(1, value) < 0)):
        return "Infinity" if value == math.inf else "-Infinity" if value == -math.inf else "-0"
    return value


def _table(db, name: str, primary_key: list) -> dict:
    quoted = '"' + name.replace('"', '""') + '"'
    cursor = db.execute(f"select * from main.{quoted} not indexed limit {MAX_ROWS + 1}")
    rows = [[_cell(value) for value in row] for row in cursor]
    return {"columns": [column[0] for column in cursor.description], "primary_key": primary_key,
            "rows": rows[:MAX_ROWS], "truncated": len(rows) > MAX_ROWS}


def _sqlite(path: Path) -> dict:
    """The database's ordinary tables, in schema order, up to REA's table and row limits."""
    with contextlib.closing(sqlite3.connect(path.resolve().as_uri() + "?mode=ro", uri=True, timeout=SQLITE_BUSY_S)) as db:
        kinds = dict(db.execute("select name, type from pragma_table_list where schema = 'main'"))
        names = [name for (name,) in db.execute("select name from sqlite_schema where type = 'table'")
                 if kinds.get(name) == "table"]
        keys = {name: [key for (key,) in db.execute(
            "select name from pragma_table_info(?, 'main') where pk > 0 order by pk", (name,))]
            for name in names[:MAX_TABLES]}
        db.text_factory = _sqlite_text
        tables = {name: _table(db, name, keys[name]) for name in names[:MAX_TABLES]}
    cut = len(names) > MAX_TABLES
    return {"format": "sqlite", "view": {"tables": tables, "tables_truncated": cut},
            "truncated": cut or any(table["truncated"] for table in tables.values())}


def _text(text: str) -> dict:
    lines = LINE_BREAK.split(text)
    if lines[-1] == "":
        lines.pop()
    view = {"lines": lines[:MAX_LINES], "line_count": len(lines), "truncated": len(lines) > MAX_LINES}
    return {"format": "text", "view": view, "truncated": view["truncated"]}


def _keyfile_line(raw: str) -> tuple:
    """A key file line as REA reads it: skip (blank or comment), group, entry or other."""
    line = raw.strip()
    if not line or line[0] in "#;":
        return ("skip",)
    header = GROUP_HEADER.match(line)
    if header:
        return ("group", header.group(1))
    key, equals, value = line.partition("=")
    return ("entry", key.strip(), value.strip()) if equals and key else ("other",)


def _is_keyfile(text: str) -> bool:
    """REA's rule: at least one group, and nothing a key file view would drop."""
    kinds = {_keyfile_line(line)[0] for line in LINE_BREAK.split(text)}
    return "group" in kinds and "other" not in kinds


def _keyfile(text: str) -> dict:
    groups, group = {}, ""
    for line in map(_keyfile_line, LINE_BREAK.split(text)):
        if line[0] == "group":
            group = line[1]
            groups.setdefault(group, {})
        elif line[0] == "entry":
            groups.setdefault(group, {})[line[1]] = line[2]
    return groups


class _XmlTree(ElementTree.TreeBuilder):
    """Keeps comments and processing instructions, which REA's node limit counts, and refuses DOCTYPEs as REA does."""

    def __init__(self) -> None:
        super().__init__(insert_comments=True, insert_pis=True)

    def doctype(self, name, pubid, system) -> None:
        raise ValueError("the document declares a DOCTYPE")


def _xml_children(element) -> list:
    nodes = [element.text] if element.text else []
    for child in element:
        nodes.append(child)
        if child.tail:
            nodes.append(child.tail)
    return nodes


def _xml(node, depth: int, budget: dict, scope: tuple):
    """A node as REA's XML view keeps it: an element with its attributes and children, or its text; None when it is
    formatting whitespace, a comment, or past REA's node and depth limits."""
    if budget["remaining"] <= 0 or depth > MAX_XML_DEPTH:
        budget["truncated"] = True
        return None
    budget["remaining"] -= 1
    preserve, element_content = scope
    if isinstance(node, str):
        return None if not node.strip() and element_content and not preserve else node
    if not isinstance(node.tag, str):
        return None
    space = node.get(XML_SPACE)
    nodes = _xml_children(node)
    inner = (space == "preserve" if space else preserve,
             any(not isinstance(child, str) and isinstance(child.tag, str) for child in nodes))
    children = [_xml(child, depth + 1, budget, inner) for child in nodes]
    return {"name": node.tag, "attributes": dict(node.attrib), "children": [c for c in children if c is not None]}


def _xml_view(text: str):
    parser = ElementTree.XMLParser(target=_XmlTree())
    try:
        parser.feed(text)
        root = parser.close()
    except (ElementTree.ParseError, ValueError):
        return None
    budget = {"remaining": MAX_XML_NODES, "truncated": False}
    tree = _xml(root, 0, budget, (False, False))
    return None if tree is None else {"root": tree, "truncated": budget["truncated"]}


def _not_json(constant: str):
    raise ValueError(f"{constant} is not JSON")


class _Inexact(Exception):
    """A JSON number that REA's state view refuses, since reading it would change it."""


def _digits(text: str) -> str:
    return re.split(r"[eE]", text.lstrip("-"))[0].replace(".", "").strip("0") or "0"


def _js_string(value: float) -> str:
    """How JavaScript's String() writes a finite double: an integer below 1e21 in full, any other in shortest form."""
    return str(int(value)) if value.is_integer() and abs(value) < 1e21 else repr(value)


def _safe_number(text: str) -> bool:
    """lossless-json's isSafeNumber: an integer spelling within 2^53, or a float spelling that keeps its digits."""
    if re.fullmatch(r"-?[0-9]+", text):
        return len(text.lstrip("-")) <= 16 and abs(int(text)) <= MAX_SAFE_INTEGER
    value = float(text)
    if not math.isfinite(value):
        return False
    written = _js_string(value)
    return written == text or _digits(written) == _digits(text)


def _exact_number(text: str):
    """A JSON number read only when reading it changes nothing, as REA's state view rules: its spelling and its
    written-back form both safe, and not -0."""
    value = float(text)
    if (not _safe_number(text) or not math.isfinite(value) or not _safe_number(_js_string(value))
            or (value == 0 and math.copysign(1, value) < 0)):
        raise _Inexact(text)
    return int(text) if re.fullmatch(r"-?[0-9]+", text) else value


_INEXACT = object()
_INEXACT_END = object()


def _number_or_mark(spelling: str):
    """A JSON number read exactly, or a mark for one REA's state view refuses."""
    try:
        return _exact_number(spelling)
    except _Inexact:
        return _INEXACT


def _holds_inexact(value) -> bool:
    """Whether a parsed JSON value still holds a marked number once duplicate keys kept their last value; one
    iterator per nesting level, so no child list is copied."""
    levels = [iter((value,))]
    while levels:
        item = next(levels[-1], _INEXACT_END)
        if item is _INEXACT_END:
            levels.pop()
        elif item is _INEXACT:
            return True
        elif isinstance(item, dict):
            levels.append(iter(item.values()))
        elif isinstance(item, list):
            levels.append(iter(item))
    return False


def _text_view(name: str, text: str) -> dict:
    """The format REA's state view detects for decoded text, and its view."""
    trimmed = re.sub(r"^[\s﻿]+", "", text)
    if name.endswith(".json") or trimmed[:1] in ("[", "{"):
        # The whole text must parse, and duplicate keys settle, before an inexact number makes it JSON with an error.
        try:
            view = json.loads(text, parse_constant=_not_json, parse_float=_number_or_mark, parse_int=_number_or_mark)
        except ValueError:
            pass
        else:
            if _holds_inexact(view):
                return {"format": "json", "view": None,
                        "error": "a number in it cannot be read exactly, such as an integer above 2^53"}
            return {"format": "json", "view": view, "truncated": False}
    lowered = name.lower()
    if lowered.endswith(XML_SUFFIXES) or trimmed.startswith("<?xml"):
        view = _xml_view(text)
        return _text(text) if view is None else {"format": "xml", "view": view, "truncated": view["truncated"]}
    if _is_keyfile(text):
        return {"format": "keyfile", "view": {"groups": _keyfile(text)}, "truncated": False}
    return _text(text)


def _view(path: Path) -> dict:
    """A typed JSON view of one file in the shapes of REA's state view; truncated says the view is partial."""
    too_large = {"format": None, "view": None, "error": "larger than 64 MiB, the most the view reads"}
    if path.stat().st_size > MAX_VIEW_BYTES:
        return too_large
    with path.open("rb") as file:
        data = file.read(8192)
        whole = not data.startswith(SQLITE_HEADER) and b"\x00" not in data
        data += file.read(MAX_VIEW_BYTES + 1 - len(data)) if whole else b""
    if data.startswith(SQLITE_HEADER):
        return _sqlite(path)
    if len(data) > MAX_VIEW_BYTES:
        return too_large
    try:
        text = data.decode("utf-8-sig") if whole else None
    except UnicodeDecodeError:
        text = None
    return {"format": "binary", "view": None, "truncated": False} if text is None else _text_view(path.name, text)


def _views(home: Path, paths: list) -> dict:
    """A view of every file under the app's paths, keyed by its home-relative path."""
    files = {}
    for owned in paths:
        root = home / owned
        candidates = [root] if root.is_file() else sorted(root.rglob("*")) if root.is_dir() else []
        for path in candidates:
            if path.is_file() and not path.is_symlink():
                key = path.relative_to(home).as_posix()
                try:
                    files[key] = _view(path)
                except (OSError, ValueError, sqlite3.Error, RecursionError) as error:
                    files[key] = {"format": None, "view": None, "error": str(error)}
    return files
`;
		PYTHON_CONSTANTS = [
			"HERE",
			"CAPTURED_HOME",
			"PATHS",
			"DCONF",
			"TEXT_SEEDS",
			"WINDOW_CLASS"
		];
		boundNames = (source) => [...[...source.matchAll(/^(?:from \S+ )?import (?<names>.+)$/gmu)].flatMap((match) => (match.groups?.names ?? "").split(",").map((name) => name.trim().split(/\s+as\s+/u).at(-1) ?? "").map((name) => name.split(".")[0] ?? "")), ...[...source.matchAll(/^(?:def |class )?(?<name>[A-Za-z_]\w*)(?: =|\()/gmu)].map((match) => match.groups?.name ?? "")];
		PYTHON_MODULE_NAMES = new Set([
			...boundNames(PYTHON_IMPORTS),
			...boundNames(PYTHON_HELPERS),
			...PYTHON_CONSTANTS
		]);
		PYTHON_DATA_HOOKS = `
    @add_data
    async def add_files(self, parts: list) -> None:
        await add(parts, self.paths)

    @get_data
    async def get_files(self, write_namespace=None) -> list:
        files = await get(self.paths, write_namespace)
        views = await in_thread(_views, Path.home(), self.paths)
        return [*files, DataPart(data={"state": views})]

    @reset_data
    async def reset_files(self) -> None:
        await reset(self.paths)
`;
	})))();
}

//#endregion
//#region dist/domain/desktop/appExport.js
var DESKTOP_EXPORT_FRAMEWORK_VERSION, environmentName, TAKEN_NAMES, className, appModuleFile, SHARED_FOLDERS, ownedPaths, capturedHomePath, stateFilesByHomePath, exportedStateFiles, docText, shellQuote, launchCommand, py, pyList, renderEnvToml, classBody, installName, aptPackages, aptSources, packageFileInstall, renderInstallScript, renderAppClass, renderSkill, installedFrom, installs, packageFileNotes, installNotes, renderReadme, renderSmokeTask;
function init_appExport() {
	return (init_appExport = __esmMin((() => {
		init_appExportInstall();
		init_appExportPython();
		init_desktopStateDiff();
		DESKTOP_EXPORT_FRAMEWORK_VERSION = "0.9.1431";
		environmentName = (source, accepted) => {
			const name = source.split(".").at(-1)?.toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+/u, "").slice(0, 48).replace(/-+$/u, "") || "app";
			return accepted(name) ? name : `app-${name}`;
		};
		TAKEN_NAMES = new Set([
			"None",
			"True",
			"False",
			...PYTHON_MODULE_NAMES
		]);
		className = (name) => {
			const candidate = name.split("-").map((part) => part.length === 0 ? "" : `${part[0]?.toUpperCase()}${part.slice(1)}`).join("").replace(/^(?=\d)/u, "App") || "App";
			return TAKEN_NAMES.has(candidate) ? `${candidate}App` : candidate;
		};
		appModuleFile = (name) => `${name.replaceAll("-", "_")}_app.py`;
		SHARED_FOLDERS = new Set([
			"",
			".config",
			".local",
			".local/share",
			".local/state",
			".cache"
		]);
		ownedPaths = (stateFiles, documents, stateDirectories) => {
			const folders = new Set();
			const owner = (file, folder) => SHARED_FOLDERS.has(folder) ? file : folder;
			const folderOf = (file) => file.split("/").slice(0, -1).join("/");
			for (const file of stateFiles) {
				const directory = stateDirectories.find((candidate) => isWithinAny(file, [candidate]));
				folders.add(owner(file, directory ?? folderOf(file)));
			}
			for (const file of documents) folders.add(owner(file, folderOf(file)));
			const sorted = [...folders].filter((folder) => folder.length > 0).sort();
			return sorted.filter((folder) => !sorted.some((other) => other !== folder && isWithinAny(folder, [other])));
		};
		capturedHomePath = (capture) => {
			const { home } = capture.host;
			const relative = (path) => path.startsWith(`${home}/`) ? path.slice(home.length + 1) : null;
			const logical = capture.application.state_directories;
			const walked = capture.state.state_directories ?? [];
			const renamed = (walked.length === logical.length ? walked : []).flatMap((physical, index) => {
				const path = logical[index]?.path;
				return path === undefined || path === physical ? [] : [{
					physical,
					logical: path
				}];
			}).sort((left, right) => right.physical.length - left.physical.length);
			return (path) => {
				const directory = renamed.find(({ physical }) => isWithinAny(path, [physical]));
				const respelled = directory === undefined ? null : relative(`${directory.logical}${path.slice(directory.physical.length)}`);
				return respelled ?? relative(path);
			};
		};
		stateFilesByHomePath = (paths, homePath) => {
			const absent = (path) => path.versions[0]?.present === true ? 0 : 1;
			const files = new Map();
			const collisions = [];
			for (const path of [...paths].sort((left, right) => absent(left) - absent(right))) {
				const home = homePath(path.path);
				if (home === null || path.format === "dconf") continue;
				const kept = files.get(home);
				if (kept === undefined) files.set(home, path);
				else collisions.push({
					home,
					kept: kept.path,
					dropped: path.path
				});
			}
			return {
				files,
				collisions
			};
		};
		exportedStateFiles = (capture, state) => {
			const homePath = capturedHomePath(capture);
			const { files, collisions } = stateFilesByHomePath(state.paths, homePath);
			const withRole = (role) => [...files].filter(([, path]) => path.role === role).map(([home]) => home);
			const paths = ownedPaths(withRole("application_state"), withRole("document"), [...capture.application.state_directories.map((entry) => entry.path), ...capture.state.state_directories ?? []].map(homePath).filter((path) => path !== null));
			return {
				homePath,
				files,
				collisions,
				paths
			};
		};
		docText = (value) => value.replace(/["\\]/gu, "'");
		shellQuote = (value) => `'${value.replaceAll("'", `'"'"'`)}'`;
		launchCommand = (argv, capturedHome, workingDirectory) => {
			const underHome = (path) => path === capturedHome ? `"$HOME"` : path.startsWith(`${capturedHome}/`) ? `"$HOME"/${shellQuote(path.slice(capturedHome.length + 1))}` : undefined;
			const respell = (argument) => {
				const equals = argument.indexOf("=");
				const value = equals > 0 ? underHome(argument.slice(equals + 1)) : undefined;
				return underHome(argument) ?? (value === undefined ? undefined : `${shellQuote(argument.slice(0, equals + 1))}${value}`);
			};
			const relative = argv.some((argument, index) => argument.length > 0 && !argument.startsWith("/") && !argument.startsWith("-") && (index > 0 || argument.includes("/")));
			const respelled = argv.map(respell);
			if (!relative && respelled.every((argument) => argument === undefined)) return argv;
			const command = `exec ${argv.map((argument, index) => respelled[index] ?? shellQuote(argument)).join(" ")}`;
			const directory = underHome(workingDirectory) ?? shellQuote(workingDirectory);
			return [
				"sh",
				"-c",
				relative ? `cd ${directory} 2>/dev/null; ${command}` : command
			];
		};
		py = (value) => JSON.stringify(value);
		pyList = (values) => `[${values.map(py).join(", ")}]`;
		renderEnvToml = (plan) => [
			`type = "computer_app"`,
			`module = ${py(`${appModuleFile(plan.name)}:${plan.className}`)}`,
			`computer = "ubuntu-24.04"`,
			`driver = "reference"`,
			""
		].join("\n");
		classBody = (plan) => {
			const title = docText(plan.title);
			if (plan.paths.length > 0) return `    """${title}, launched at boot with the captured state in its home.

    Declaring data hooks switches off agentenv's default data plane, so these call its helpers: the seed is kept as
    the initial state, reset restores it, add writes files under PATHS, and get returns those files plus a typed JSON
    view of each.
    """

    def __init__(self) -> None:
        super().__init__()
        if not INITIAL.exists():
            _seed_home(Path.home())
            _load_dconf(Path.home())
        keep_initial(self.paths)
${PYTHON_DATA_HOOKS}${PYTHON_READY_CHECK}`;
			if (plan.dconf.length > 0) return `    """${title}, launched at boot with its captured settings. It owns no files, so it serves no data operations."""

    def __init__(self) -> None:
        super().__init__()
        _load_dconf(Path.home())
${PYTHON_READY_CHECK}`;
			return `    """${title}, launched at boot. No state was observed, so it serves no data operations."""\n${PYTHON_READY_CHECK}`;
		};
		installName = (plan) => plan.aptRelease === null ? plan.aptPackage : `${plan.aptPackage}/${plan.aptRelease}`;
		aptPackages = (plan) => [...new Set([
			...plan.packageFile?.dependencies ?? [installName(plan)],
			...plan.libraryPackages,
			...plan.dconf.length === 0 ? [] : ["dconf-cli"]
		])];
		aptSources = (plan) => plan.aptSources.length === 0 ? "" : `\n    sources=[${plan.aptSources.map((source) => `AptSource(apt=${py(source.uri)}, suite=${py(source.suite)}, components=${pyList(source.components)}, key=${py(source.keyFile)})`).join(", ")}],`;
		packageFileInstall = ({ packageFile: file }) => file === null ? "" : `\n    downloads=[Download(url=${py(file.url)}, sha256=${py(file.sha256)}, to=${py(file.path)}, arch=${py(file.architecture)})],\n    run=[RunScript(script=${py(INSTALL_SCRIPT)})],`;
		renderInstallScript = (file) => [
			"#!/bin/sh",
			"set -eu",
			`dpkg -i ${shellQuote(file.path)}`,
			`rm -f ${shellQuote(file.path)}`,
			""
		].join("\n");
		renderAppClass = (plan) => {
			const hooks = classBody(plan);
			return `"""${docText(plan.title)} as an agentenv computer app, exported by REA from a desktop application capture.

Package: ${plan.aptPackage}${plan.packageVersion === null ? "" : ` (captured at ${plan.packageVersion})`}. Capture Evidence: ${plan.captureEvidenceId}.
The seed is the user's state before the capture: keep this bundle local.
"""

${PYTHON_IMPORTS}
HERE = Path(__file__).resolve().parent
CAPTURED_HOME = ${py(plan.capturedHome)}
PATHS = ${pyList(plan.paths)}
DCONF = ${py(plan.dconf)}
TEXT_SEEDS = frozenset(${pyList(plan.textSeeds)})
WINDOW_CLASS = ${py(plan.windowClass)}
${PYTHON_HELPERS}

@computer_app(supports=[{"os": {"type": "linux", "display": ["x11"]}, "arch": ${pyList(plan.architectures)}}])
@linux(
    packages=Packages(apt=${pyList(aptPackages(plan))}),${aptSources(plan)}${packageFileInstall(plan)}
    launch=Launch(at="boot", command=${pyList(plan.command)}, window={"class": ${py(plan.windowClass)}}, ready=Ready(window=True)),
    paths=PATHS,
    skill="SKILL.md",
)
class ${plan.className}(ComputerAppEnvironment):
${hooks}`;
		};
		renderSkill = (plan) => `---
description: Use ${plan.title} on this Linux desktop; its window has class ${plan.windowClass}.
---

# ${plan.title}

${plan.title} is open on the desktop at boot. Its window's class is \`${plan.windowClass}\`.
${plan.paths.length === 0 ? "" : `
Its files live under ${plan.paths.map((path) => `\`~/${path}\``).join(", ")}. Work through the application's own
window and dialogs; the result is read from those files.
`}`;
		installedFrom = (plan) => plan.aptSources.length === 0 ? "the distribution archive" : plan.aptSources.map((source) => `the apt repository \`${source.uri}\` (suite \`${source.suite}\`${source.components.length === 0 ? "" : `, components \`${source.components.join(" ")}\``}), trusting \`${source.keyFile}\`, the key that verified its release on the capture host`).join(" and ");
		installs = (plan) => plan.packageFile === null ? `\`${installName(plan)}\` from ${installedFrom(plan)}` : `\`${plan.aptPackage}\`${plan.packageVersion === null ? "" : ` ${plan.packageVersion}`} from its package file, downloaded from
  \`${plan.packageFile.url}\` when the bundle is put and refused unless its SHA-256 is \`${plan.packageFile.sha256}\``;
		packageFileNotes = ({ packageFile: file }) => file === null ? [] : [`- The bundle does not contain the package: \`${INSTALL_SCRIPT}\` installs \`${file.path}\` with dpkg once the apt packages
  it depends on are in${file.dependencies.length === 0 ? "" : ` (${file.dependencies.map((name) => `\`${name}\``).join(", ")})`}, so the computer runs exactly the captured version, on \`${file.architecture}\` only.`, "- Vendor sites may refuse automated downloads, so the URL must point at a copy of the file the operator may use.\n  The package's licence, such as a trial's terms, is the operator's to check."];
		installNotes = (plan) => [
			...packageFileNotes(plan),
			...plan.libraryPackages.length === 0 ? [] : [`- Library packages, which own the shared libraries the executable loaded on the capture host, are installed with it:
  ${plan.libraryPackages.map((name) => `\`${name}\``).join(", ")}.`],
			...plan.electron ? ["- Chromium's sandbox is off (`--no-sandbox`): it needs user namespaces the computer's container does not grant,\n  and Electron exits without them."] : []
		].map((line) => `\n${line}`).join("");
		renderReadme = (plan, taskSection = "") => `# ${plan.title} computer app

Exported by REA's \`export-desktop-application\` from a capture of the \`${plan.aptPackage}\` package
(capture Evidence \`${plan.captureEvidenceId}\`). It was checked against agentenv-framework
${DESKTOP_EXPORT_FRAMEWORK_VERSION}.

- \`envs/${plan.name}/\` is a computer app on the \`ubuntu-24.04\` base with the \`reference\` driver, for
  ${plan.architectures.map((architecture) => `\`${architecture}\``).join(" and ")}. It installs ${installs(plan)}, launches \`${plan.command.join(" ")}\` at boot and is ready
  when a window of class \`${plan.windowClass}\` appears.${installNotes(plan)}
- Owned paths: ${plan.paths.length === 0 ? "none" : plan.paths.map((path) => `\`~/${path}\``).join(", ")}.
  \`data/get\` returns their files and a typed JSON view of each; \`data/reset\` restores the seed.
- Seed: ${plan.seedFiles.length} file(s) from the user's home before the capture, with the captured home path
  respelled in text files${plan.dconf.length === 0 ? "" : ", and the application's dconf keys"}.${plan.unseededFiles.length === 0 ? "" : `
- Not seeded, because the capture did not retain their starting bytes: ${plan.unseededFiles.map((path) => `\`~/${path}\``).join(", ")}.
  Capture again with \`--state-path\` naming them, or a larger \`--max-file-bytes\`, to include them.`}
- \`tasks/smoke.json\` deploys the app.

${taskSection.length === 0 ? "Run it with `agent-env run <this folder>`." : "Run the task with `agent-env run <this folder>`, or only the deploy with `--task smoke`."}

The seed is the user's real data. Keep this bundle local; do not publish it.
${plan.dconf.length === 0 ? "" : "dconf keys are compiled into the user's dconf database, with `dconf-cli`, once when the app first starts; `data/reset` does not restore them.\n"}${taskSection}`;
		renderSmokeTask = (plan) => `${JSON.stringify([{
			id: "env",
			type: "deploy_env",
			env_id: plan.name
		}], null, 2)}\n`;
	})))();
}

//#endregion
//#region dist/domain/desktop/desktopState.js
var sha256, format, index, versionSchema, changeSchema, desktopStatePathSchema, desktopApplicationStateSchema;
function init_desktopState() {
	return (init_desktopState = __esmMin((() => {
		init_jsonValue();
		init_desktopCapture();
		sha256 = z.string().regex(/^[0-9a-f]{64}$/u);
		format = z.enum([
			"text",
			"json",
			"keyfile",
			"xml",
			"sqlite",
			"dconf",
			"binary"
		]);
		index = z.int().min(0);
		versionSchema = z.strictObject({
			/** Position of the checkpoint in the capture; names can repeat. */
			checkpoint_index: index,
			checkpoint: z.string().min(1),
			present: z.boolean(),
			/** Null when the file is absent or its bytes were not retained. */
			sha256: sha256.nullable(),
			/** Detected for each version, since a file can change format. */
			format: format.nullable(),
			/** The read value; JSON `null` is a valid view, so check `view_error`. */
			view: jsonValueSchema.nullable(),
			/** Why no view was read, or null when the view (possibly `null`) was read. */
			view_error: z.string().nullable()
		});
		changeSchema = z.strictObject({
			from_index: index,
			to_index: index,
			from: z.string().min(1),
			to: z.string().min(1),
			kind: z.enum([
				"created",
				"deleted",
				"lines",
				"values",
				"keys",
				"rows",
				"content",
				"format",
				"unreadable"
			]),
			added: z.array(z.string()),
			removed: z.array(z.string()),
			changed: z.array(z.string()),
			added_count: z.int().min(0),
			removed_count: z.int().min(0),
			changed_count: z.int().min(0),
			/** False when a view was truncated, so absences may lie outside the sample. */
			complete: z.boolean()
		});
		desktopStatePathSchema = z.strictObject({
			path: z.string().min(1),
			/** The path relative to the home directory, or null outside it. */
			home_path: z.string().nullable(),
			role: z.enum([
				"application_state",
				"document",
				"shared_desktop",
				"unrelated"
			]),
			reasons: z.array(z.enum([
				"state_directory",
				"opened_by_application",
				"named_in_window_title",
				"selected_path",
				"dconf_application_keys",
				"desktop_service"
			])),
			/** The latest readable version's format. */
			format: format.nullable(),
			versions: z.array(versionSchema).min(1),
			changes: z.array(changeSchema)
		});
		desktopApplicationStateSchema = z.strictObject({
			capture: z.strictObject({
				evidence_id: z.string().min(1),
				home: z.string().min(1),
				checkpoints: z.array(z.string().min(1)).min(1),
				/** The capture's own limitations and omitted content, carried forward. */
				limitations: z.array(z.string()),
				omitted_content: desktopApplicationCaptureSchema.shape.state.shape.omitted_content
			}),
			application_names: z.array(z.string()),
			paths: z.array(desktopStatePathSchema),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/application/desktop/DesktopExportInstall.js
var OPERATION, refuse, exportEnvironmentName, admitApplication;
function init_DesktopExportInstall() {
	return (init_DesktopExportInstall = __esmMin((() => {
		init_analysisErrorCore();
		init_appExport();
		init_appExportInstall();
		init_environmentBundle();
		OPERATION = "export_desktop_application";
		refuse = (userMessage, field, remediationAction) => new AnalysisInputError(OPERATION, {
			userMessage,
			remediationAction,
			conformsToInputContract: true
		}, [{
			path: [field],
			reason: "invalid_value",
			message: userMessage
		}]);
		exportEnvironmentName = (capture, name) => {
			const { application } = capture;
			const source = name ?? environmentName(application.desktop_entry?.id ?? application.executable.path.split("/").at(-1) ?? "app", isPortableBundleName);
			if (!isPortableBundleName(source)) throw refuse(`${source} is not a portable environment name.`, "name", "Pass --name with lowercase letters, digits and hyphens.");
			return source;
		};
		admitApplication = (capture, environment, packageUrl) => {
			const install = exportInstall(capture.application.package, environment, capture.host.architecture, packageUrl);
			if (!install.ok) throw refuse(install.error.reason, install.error.field, install.error.remediation);
			const window = capture.session.window_match;
			if (window === null) throw refuse("The capture saw no application window, so the export cannot match the app's window to tell when it is ready.", "capture", "Capture again and wait for the application window to open.");
			return {
				install: install.value,
				windowClass: window.class
			};
		};
	})))();
}

//#endregion
//#region dist/domain/desktop/appTask.js
var DRAFT_PROMPT, line, lines, count, where, comparison, table, kind, checkSchema, desktopTaskSchema, countComparison, isHomePath, isTimestamp, expectedValues, checkProblem, parseDesktopTask;
function init_appTask() {
	return (init_appTask = __esmMin((() => {
		init_jsonValue();
		init_result();
		init_validationFailure();
		DRAFT_PROMPT = "REPLACE: what the user asks to have done in the app, in their own words.";
		line = z.string().refine((value) => !value.includes("\n"), "a line cannot hold a line break");
		lines = z.array(line).min(1).max(100);
		count = z.int().min(0);
		where = z.record(z.string().min(1), jsonValueSchema).refine((columns) => Object.keys(columns).length > 0, "name at least one column");
		comparison = {
			equals: count.optional(),
			at_least: count.optional(),
			at_most: count.optional()
		};
		table = z.string().min(1);
		kind = (name, shape) => z.strictObject({
			id: z.string().min(1).max(64).optional(),
			kind: z.literal(name),
			file: z.string().min(1),
			...shape
		});
		checkSchema = z.discriminatedUnion("kind", [
			kind("file_present", {}),
			kind("file_absent", {}),
			kind("lines_present", { lines }),
			kind("lines_absent", { lines }),
			kind("line_count", {
				exact: line.optional(),
				contains: line.optional(),
				...comparison
			}),
			kind("value_equals", {
				pointer: z.string(),
				value: jsonValueSchema
			}),
			kind("value_absent", { pointer: z.string() }),
			kind("row_present", {
				table,
				where
			}),
			kind("row_absent", {
				table,
				where
			}),
			kind("row_count", {
				table,
				where: where.optional(),
				...comparison
			})
		]);
		desktopTaskSchema = z.strictObject({
			name: z.string().min(1),
			prompt: z.string().trim().min(1),
			checks: z.array(checkSchema).min(1).max(32)
		});
		countComparison = (check) => {
			const given = [
				"equals",
				"at_least",
				"at_most"
			].flatMap((operator) => check[operator] === undefined ? [] : [{
				operator,
				n: check[operator]
			}]);
			return given.length === 1 ? given[0] : undefined;
		};
		isHomePath = (path) => path.split("/").every((segment) => segment !== "" && segment !== "." && segment !== "..");
		isTimestamp = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:[.,]\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/u.test(value.trim());
		expectedValues = (check) => {
			switch (check.kind) {
				case "value_equals": return [check.value];
				case "row_present":
				case "row_absent":
				case "row_count": return Object.values(check.where ?? {});
				default: return [];
			}
		};
		checkProblem = (check) => {
			if (!isHomePath(check.file)) return `file ${JSON.stringify(check.file)} must be a path under the home, such as Documents/todo.txt, without a leading slash, . or .. segments`;
			if (check.kind === "line_count" && check.exact === undefined === (check.contains === undefined)) return "line_count takes exactly one of exact and contains";
			if ((check.kind === "line_count" || check.kind === "row_count") && countComparison(check) === undefined) return `${check.kind} takes exactly one of equals, at_least and at_most`;
			if ((check.kind === "value_equals" || check.kind === "value_absent") && check.pointer === "") return "the empty pointer names the whole file; point at the value that changed";
			if ((check.kind === "value_equals" || check.kind === "value_absent") && !check.pointer.startsWith("/")) return `pointer ${JSON.stringify(check.pointer)} must start with /`;
			if ((check.kind === "lines_present" || check.kind === "lines_absent") && new Set(check.lines).size !== check.lines.length) return "it lists a line twice";
			const stamped = expectedValues(check).find(isTimestamp);
			return stamped === undefined ? undefined : `${JSON.stringify(stamped)} looks like a time the app stamps; leave volatile values out of checks`;
		};
		parseDesktopTask = (value, isPortableName) => {
			const parsed = desktopTaskSchema.safeParse(value);
			if (!parsed.success) return err(describeValidationFailure(parsed.error));
			const { name, prompt, checks } = parsed.data;
			if (!isPortableName(name) || name === "smoke") return err(`name ${JSON.stringify(name)} must be a portable bundle name other than smoke: lowercase letters, digits and hyphens.`);
			if (prompt.trim() === "REPLACE: what the user asks to have done in the app, in their own words.") return err("prompt is still the draft's placeholder; write the user's request.");
			const settled = checks.map((check, index) => ({
				...check,
				id: check.id ?? `check-${String(index + 1)}`
			}));
			const ids = settled.map((check) => check.id);
			const repeated = ids.find((id, index) => ids.indexOf(id) !== index);
			if (repeated !== undefined) return err(`two checks have the id ${JSON.stringify(repeated)}.`);
			for (const check of settled) {
				const problem = checkProblem(check);
				if (problem !== undefined) return err(`check ${JSON.stringify(check.id)}: ${problem}.`);
			}
			return ok({
				name,
				prompt: prompt.trim(),
				checks: settled
			});
		};
	})))();
}

//#endregion
//#region dist/domain/desktop/appTaskChecks.js
var pass, fail, shown, undecided, isRecord, sameJson, resolvePointer, versionView, namesXmlNamespace, truncatedView, viewOf, compared, lineVerdict, valueVerdict, tableOf, rowVerdict, verdict, evaluateTaskChecks;
function init_appTaskChecks() {
	return (init_appTaskChecks = __esmMin((() => {
		init_appTask();
		pass = (description) => ({
			passed: true,
			description
		});
		fail = (description) => ({
			passed: false,
			description
		});
		shown = (value) => {
			const text = JSON.stringify(value);
			return text.length > 200 ? `${text.slice(0, 200)}…` : text;
		};
		undecided = (file) => fail(`the view of ${file} is truncated, so what it leaves out is unknown`);
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		sameJson = (actual, expected) => {
			if (Array.isArray(expected)) return Array.isArray(actual) && actual.length === expected.length && expected.every((item, index) => sameJson(actual[index], item));
			if (isRecord(expected)) return isRecord(actual) && Object.keys(actual).length === Object.keys(expected).length && Object.entries(expected).every(([key, item]) => Object.hasOwn(actual, key) && sameJson(actual[key], item));
			return actual === expected;
		};
		resolvePointer = (view, pointer) => {
			let current = view;
			for (const raw of pointer.slice(1).split("/")) {
				const token = raw.replaceAll("~1", "/").replaceAll("~0", "~");
				if (Array.isArray(current)) {
					if (!/^(?:0|[1-9][0-9]*)$/u.test(token)) return undefined;
					const index = Number(token);
					if (index >= current.length) return undefined;
					current = current[index] ?? null;
				} else if (isRecord(current) && Object.hasOwn(current, token)) current = current[token] ?? null;
				else return undefined;
			}
			return current ?? null;
		};
		versionView = (version) => !version.present ? undefined : version.view_error === null ? {
			format: version.format,
			view: version.view
		} : {
			format: version.format,
			view: null,
			error: version.view_error
		};
		namesXmlNamespace = (node) => {
			if (Array.isArray(node)) return node.some(namesXmlNamespace);
			if (!isRecord(node)) return false;
			const named = (name) => typeof name === "string" && (name.includes(":") || name === "xmlns");
			return named(node.name) || isRecord(node.attributes) && Object.keys(node.attributes).some(named) || Object.values(node).some(namesXmlNamespace);
		};
		truncatedView = (format, view) => {
			if (!isRecord(view)) return false;
			if (format === "text" || format === "xml") return view.truncated === true;
			if (format !== "sqlite") return false;
			const tables = isRecord(view.tables) ? Object.values(view.tables) : [];
			return view.tables_truncated === true || tables.some((table) => isRecord(table) && (table.truncated === true || typeof table.error === "string"));
		};
		viewOf = (check, entry, format) => {
			if (entry === undefined) return {
				view: null,
				truncated: false
			};
			if (typeof entry.error === "string") return fail(`${check.file} has no view: ${entry.error}`);
			if (entry.format === null || entry.format === "binary") return fail(`${check.file} is binary and has no view`);
			if (format !== undefined && entry.format !== format) return fail(`${check.file} is read as ${entry.format}, not ${format}`);
			return {
				view: entry.view,
				truncated: truncatedView(entry.format, entry.view)
			};
		};
		compared = (check, n, what) => {
			const { operator, n: expected } = countComparison(check) ?? {
				operator: "equals",
				n: Number.NaN
			};
			const met = operator === "equals" ? n === expected : operator === "at_least" ? n >= expected : n <= expected;
			const description = `${String(n)} ${what}, expected ${operator.replace("_", " ")} ${String(expected)}`;
			return met ? pass(description) : fail(description);
		};
		lineVerdict = (check, entry) => {
			const read = viewOf(check, entry, "text");
			if ("passed" in read) return read;
			const lines = isRecord(read.view) && Array.isArray(read.view.lines) ? read.view.lines.filter((line) => typeof line === "string") : [];
			const file = check.file;
			if (check.kind === "lines_present") {
				const missing = check.lines.find((line) => !lines.includes(line));
				return missing === undefined ? pass(`${file} has the line(s) ${shown(check.lines)}`) : fail(`${file} has no line ${shown(missing)}`);
			}
			if (read.truncated) return undecided(file);
			if (check.kind === "lines_absent") {
				const found = check.lines.find((line) => lines.includes(line));
				return found === undefined ? pass(`${file} has none of the lines ${shown(check.lines)}`) : fail(`${file} still has the line ${shown(found)}`);
			}
			const { exact, contains } = check;
			const n = lines.filter((line) => contains === undefined ? line === exact : line.includes(contains)).length;
			return compared(check, n, contains === undefined ? `line(s) of ${file} match ${shown(exact ?? "")}` : `line(s) of ${file} contain ${shown(contains)}`);
		};
		valueVerdict = (check, entry) => {
			const read = viewOf(check, entry, undefined);
			if ("passed" in read) return read;
			const found = entry === undefined ? undefined : resolvePointer(read.view, check.pointer);
			const at = `${check.file} at ${check.pointer}`;
			const whole = check.kind === "value_equals" && typeof check.value === "object" && check.value !== null;
			if (whole && read.truncated) return undecided(check.file);
			if (check.kind === "value_equals") return found !== undefined && sameJson(found, check.value) ? pass(`${at} is ${shown(check.value)}`) : fail(found === undefined ? `${at} has no value` : `${at} is ${shown(found)}, not ${shown(check.value)}`);
			if (read.truncated) return undecided(check.file);
			return found === undefined ? pass(`${at} has no value`) : fail(`${at} is ${shown(found)}`);
		};
		tableOf = (check, view) => {
			const sqlite = isRecord(view) ? view : {};
			const tables = isRecord(sqlite.tables) ? sqlite.tables : {};
			const table = Object.hasOwn(tables, check.table) ? tables[check.table] : undefined;
			if (table === undefined && sqlite.tables_truncated === true) return undecided(check.file);
			const read = isRecord(table) ? table : {};
			if (typeof read.error === "string") return fail(`${check.file} table ${check.table} could not be read: ${read.error}`);
			return {
				columns: Array.isArray(read.columns) ? read.columns : [],
				rows: Array.isArray(read.rows) ? read.rows : [],
				truncated: read.truncated === true
			};
		};
		rowVerdict = (check, entry) => {
			const read = viewOf(check, entry, "sqlite");
			if ("passed" in read) return read;
			const table = tableOf(check, read.view);
			if ("passed" in table) return table;
			const { columns, rows } = table;
			const name = `${check.file} table ${check.table}`;
			const matches = (row) => Array.isArray(row) && Object.entries(check.where ?? {}).every(([column, value]) => {
				const index = columns.indexOf(column);
				return index >= 0 && sameJson(row[index], value);
			});
			const n = rows.filter(matches).length;
			if (check.kind === "row_present") return n > 0 ? pass(`${name} has a row with ${shown(check.where)}`) : fail(`${name} has no row with ${shown(check.where)}`);
			if (table.truncated) return undecided(check.file);
			if (check.kind === "row_absent") return n === 0 ? pass(`${name} has no row with ${shown(check.where)}`) : fail(`${name} has ${String(n)} row(s) with ${shown(check.where)}`);
			return compared(check, n, `row(s) of ${name}${check.where === undefined ? "" : ` with ${shown(check.where)}`}`);
		};
		verdict = (check, entry) => {
			switch (check.kind) {
				case "file_present": return entry === undefined ? fail(`${check.file} does not exist`) : pass(`${check.file} exists`);
				case "file_absent": return entry === undefined ? pass(`${check.file} does not exist`) : fail(`${check.file} exists`);
				case "lines_present":
				case "lines_absent":
				case "line_count": return lineVerdict(check, entry);
				case "value_equals":
				case "value_absent": return valueVerdict(check, entry);
				case "row_present":
				case "row_absent":
				case "row_count": return rowVerdict(check, entry);
			}
		};
		evaluateTaskChecks = (checks, views) => checks.map((check) => ({
			id: check.id,
			...verdict(check, views.get(check.file))
		}));
	})))();
}

//#endregion
export { DESKTOP_EXPORT_FRAMEWORK_VERSION, DRAFT_PROMPT, admitApplication, appModuleFile, className, desktopApplicationStateSchema, evaluateTaskChecks, exportEnvironmentName, exportedStateFiles, init_DesktopExportInstall, init_appExport, init_appTask, init_appTaskChecks, init_desktopState, isTimestamp, launchCommand, namesXmlNamespace, parseDesktopTask, refuse, renderAppClass, renderEnvToml, renderInstallScript, renderReadme, renderSkill, renderSmokeTask, resolvePointer, versionView };