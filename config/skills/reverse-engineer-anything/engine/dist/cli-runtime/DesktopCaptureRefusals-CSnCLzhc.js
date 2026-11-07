import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ProviderAdapterError, init_providerAdapterError } from "./jsonLines-CKG28FwL.js";
import { ArtifactReaderFailure, init_ArtifactReader } from "./ArtifactReader-DJ9rniiL.js";
import { AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisError, AnalysisInputError, init_analysisErrorBase, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { compareUnicodeCodePoints, describeValidationFailure, init_unicodeCodePointOrder, init_validationFailure } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { bindArtifactFileCleanup, init_ArtifactFileOperation } from "./ArtifactFileOperation-YawaP_UN.js";
import { constants } from "node:fs";
import { delimiter, isAbsolute } from "node:path";
import { access, lstat, readdir } from "node:fs/promises";
import { z } from "zod";

//#region dist/domain/desktop/desktopStateDiff.js
var sameContentIdentity, parentOf, covers, diffDesktopStates, isWithinAny;
function init_desktopStateDiff() {
	return (init_desktopStateDiff = __esmMin((() => {
		init_unicodeCodePointOrder();
		sameContentIdentity = (before, after) => before.type === "directory" || before.size === after.size && before.mtime_ns === after.mtime_ns && before.inode === after.inode && before.mode === after.mode;
		parentOf = (path) => path.slice(0, Math.max(1, path.lastIndexOf("/")));
		covers = (walk, path) => {
			if (walk.roots.has(path)) return true;
			for (let directory = parentOf(path);; directory = parentOf(directory)) {
				const ancestor = walk.entries.get(directory);
				if (ancestor !== undefined) return ancestor.type !== "directory" || walk.listed.has(directory);
				if (walk.roots.has(directory)) return true;
				if (directory === "/") return false;
			}
		};
		diffDesktopStates = (before, after) => {
			const differences = [];
			let unconfirmed = 0;
			for (const [path, previous] of before.entries) {
				const next = after.entries.get(path);
				if (next === undefined) {
					if (covers(after, path)) differences.push({
						path,
						kind: "deleted",
						before: previous,
						after: null
					});
					else unconfirmed += 1;
				} else if (next.type !== previous.type) differences.push({
					path,
					kind: "type_changed",
					before: previous,
					after: next
				});
				else if (!sameContentIdentity(previous, next)) differences.push({
					path,
					kind: "modified",
					before: previous,
					after: next
				});
			}
			for (const [path, next] of after.entries) if (!before.entries.has(path)) {
				if (covers(before, path)) differences.push({
					path,
					kind: "created",
					before: null,
					after: next
				});
				else unconfirmed += 1;
			}
			return {
				differences: differences.sort((left, right) => compareUnicodeCodePoints(left.path, right.path)),
				unconfirmed
			};
		};
		isWithinAny = (path, roots) => roots.some((root) => path === root || path.startsWith(root.endsWith("/") ? root : `${root}/`));
	})))();
}

//#endregion
//#region dist/domain/desktop/desktopCapture.js
var sha256, milliseconds, desktopFileFactsSchema, desktopStateChangeSchema, desktopRetainedFileSchema, desktopCheckpointSchema, desktopEntrySchema, aptSigningKeySchema, aptRepositorySchema, packageFileSchema, packageSchema, desktopApplicationInventorySchema, windowSchema, processSchema, desktopSessionSchema, desktopApplicationCaptureSchema, RESERVED_CHECKPOINT_NAMES, checkpointNameRefusal, DESKTOP_CAPTURE_DEFAULTS;
function init_desktopCapture() {
	return (init_desktopCapture = __esmMin((() => {
		sha256 = z.string().regex(/^[0-9a-f]{64}$/u);
		milliseconds = z.int().min(0);
		desktopFileFactsSchema = z.strictObject({
			type: z.enum([
				"file",
				"directory",
				"symlink",
				"other"
			]),
			size: z.int().min(0),
			mode: z.int().min(0),
			mtime_ns: z.string().regex(/^\d+$/u),
			sha256: sha256.nullable()
		});
		desktopStateChangeSchema = z.strictObject({
			path: z.string().min(1),
			kind: z.enum([
				"created",
				"modified",
				"deleted",
				"type_changed"
			]),
			before: desktopFileFactsSchema.nullable(),
			after: desktopFileFactsSchema.nullable(),
			in_state_directory: z.boolean(),
			opened_by_application: z.boolean()
		});
		desktopRetainedFileSchema = z.strictObject({
			path: z.string().min(1),
			sha256,
			size: z.int().min(0)
		});
		desktopCheckpointSchema = z.strictObject({
			name: z.string().min(1),
			trigger: z.enum([
				"baseline",
				"request",
				"stop",
				"exit"
			]),
			at_ms: milliseconds,
			entries: z.int().min(0),
			truncated: z.boolean(),
			unreadable_directories: z.int().min(0),
			/** Paths whose state could not be read, and directories on another device not entered; absent from captures written before it was recorded. */
			unchecked_paths: z.int().min(0).optional(),
			/** Differences left out because a walk did not list the parent directory. */
			unconfirmed_changes: z.int().min(0),
			changes: z.array(desktopStateChangeSchema),
			retained: z.array(desktopRetainedFileSchema)
		});
		desktopEntrySchema = z.strictObject({
			id: z.string().nullable(),
			path: z.string().min(1),
			name: z.string().nullable(),
			exec: z.string().nullable(),
			icon: z.string().nullable(),
			startup_wm_class: z.string().nullable(),
			categories: z.array(z.string()),
			mime_types: z.array(z.string()),
			terminal: z.boolean()
		});
		aptSigningKeySchema = z.strictObject({
			path: z.string().min(1),
			sha256,
			format: z.enum(["binary", "armored"]),
			/** Primary key fingerprint from gpgv's VALIDSIG status. */
			fingerprint: z.string().min(1)
		});
		aptRepositorySchema = z.strictObject({
			/** The source as `apt-cache policy` lists it. */
			source: z.string().min(1),
			/** Null when no sources file entry matches the source. */
			sources_file: z.string().nullable(),
			/** Without the user name and password the entry may hold. */
			uri: z.string().nullable(),
			/** Whether the entry's URI held a user name or password, which REA does not record; absent from captures written before it was recorded. */
			uri_credentials_removed: z.boolean().optional(),
			suite: z.string().nullable(),
			/** Empty for a flat repository. */
			components: z.array(z.string()),
			/** The entry's architecture restriction; empty when it names none, absent from captures written before it was recorded. */
			architectures: z.array(z.string()).optional(),
			/** The release's Suite (apt's `a=`), or else its Codename, which `<package>/<release>` selects; null when unknown, absent from captures written before it was recorded. */
			release: z.string().nullable().optional(),
			/** The verified key; the key file itself, or the one key of it that verified. */
			signing_key: aptSigningKeySchema.nullable(),
			/** Why no signing key was verified, or why the repository was not checked. */
			signing_key_reason: z.string().optional()
		});
		packageFileSchema = z.strictObject({
			/** The file's name, without its folder. */
			name: z.string().regex(/^(?!\.\.?$)[^/\0]+$/u),
			sha256,
			size: z.int().min(0),
			package: z.string().min(1),
			version: z.string().min(1),
			architecture: z.string().min(1),
			/** Each Depends entry as the file declares it, alternatives and version constraints included. */
			depends: z.array(z.string()),
			pre_depends: z.array(z.string())
		});
		packageSchema = z.strictObject({
			kind: z.enum([
				"deb",
				"snap",
				"flatpak",
				"appimage",
				"unknown"
			]),
			name: z.string().nullable(),
			version: z.string().nullable(),
			architecture: z.string().nullable(),
			/** Package sources listing the installed version; empty for local installs. */
			sources: z.array(z.string()),
			/** The `o=` origin apt reports for each entry of `sources`, by index; null when it reports none. */
			source_origins: z.array(z.string().nullable()).optional(),
			package_lists_present: z.boolean().nullable(),
			/** Sources whose origin is not Ubuntu; absent from captures written before they were recorded. */
			apt_repositories: z.array(aptRepositorySchema).optional(),
			/** Packages owning the shared libraries the executable loads, without the application's own package. */
			library_packages: z.array(z.string()).optional(),
			/** Library packages neither the Ubuntu 24.04 archive nor a declarable vendor repository offers, left out of `library_packages`. */
			uninstallable_library_packages: z.array(z.string()).optional(),
			/** Sonames the executable needs that the host's dynamic linker cache does not list. */
			missing_libraries: z.array(z.string()).optional(),
			/** Libraries found on the host that no package owns. */
			unpackaged_libraries: z.array(z.string()).optional(),
			/** Why the library lists are incomplete; absent when they are complete. */
			library_packages_reason: z.string().optional(),
			/** The `--package-file` the capture named, when it holds the installed name, version and architecture. */
			package_file: packageFileSchema.optional(),
			/** Why the `--package-file` the capture named was not recorded. */
			package_file_reason: z.string().optional()
		});
		desktopApplicationInventorySchema = z.strictObject({
			desktop_entry: desktopEntrySchema.nullable(),
			argv: z.array(z.string()).min(1),
			working_directory: z.string().min(1),
			executable: z.strictObject({
				path: z.string().min(1),
				resolved_path: z.string().nullable(),
				electron_markers: z.array(z.enum(["fuse-sentinel", "app-asar"]))
			}),
			package: packageSchema,
			state_directories: z.array(z.strictObject({
				path: z.string().min(1),
				exists_at_start: z.boolean()
			}))
		});
		windowSchema = z.strictObject({
			id: z.string().regex(/^0x[0-9a-f]+$/u),
			instance: z.string().nullable(),
			class: z.string().nullable(),
			titles: z.array(z.string()),
			pid: z.int().positive().nullable(),
			window_type: z.string().nullable(),
			application: z.boolean(),
			first_seen_ms: milliseconds,
			last_seen_ms: milliseconds
		});
		processSchema = z.strictObject({
			pid: z.int().positive(),
			parent_pid: z.int().min(0),
			command: z.string(),
			/** False for a process found only as the owner of a matching window. */
			started_by_capture: z.boolean(),
			first_seen_ms: milliseconds,
			last_seen_ms: milliseconds
		});
		desktopSessionSchema = z.strictObject({
			started_at: z.iso.datetime(),
			duration_ms: milliseconds,
			end_reason: z.enum([
				"application_exited",
				"stop_requested",
				"time_limit",
				"cancelled"
			]),
			launch_pid: z.int().positive(),
			exit: z.strictObject({
				code: z.int().nullable(),
				signal: z.string().nullable()
			}).nullable(),
			first_window_ms: milliseconds.nullable(),
			window_match: z.strictObject({
				class: z.string(),
				instance: z.string()
			}).nullable(),
			processes: z.array(processSchema),
			windows: z.array(windowSchema),
			opened_files: z.array(z.strictObject({
				path: z.string().min(1),
				first_seen_ms: milliseconds
			})),
			/** The first bytes the launched process wrote to stderr. */
			stderr: z.string(),
			stderr_truncated: z.boolean(),
			/** Whether the run-token sweep confirmed every launched process is gone. */
			cleanup: z.strictObject({
				verified: z.boolean(),
				reason: z.string().nullable()
			})
		});
		desktopApplicationCaptureSchema = z.strictObject({
			host: z.strictObject({
				platform: z.literal("linux"),
				architecture: z.string().min(1),
				display: z.string().min(1),
				home: z.string().min(1)
			}),
			application: desktopApplicationInventorySchema,
			session: desktopSessionSchema,
			state: z.strictObject({
				roots: z.array(z.string().min(1)).min(1),
				content_roots: z.array(z.string().min(1)),
				/**
				* The application's state directories as walked, in their physical
				* spelling; absent from captures written before it was recorded.
				*/
				state_directories: z.array(z.string().min(1)).optional(),
				/** Paths every walk left out; absent from captures written before it was recorded. */
				excluded: z.array(z.string().min(1)).optional(),
				/** At least the baseline; a cancelled capture can stop there. */
				checkpoints: z.array(desktopCheckpointSchema).min(1),
				content_files: z.int().min(0),
				content_bytes: z.int().min(0),
				omitted_content: z.array(z.strictObject({
					path: z.string().min(1),
					reason: z.enum([
						"too_large",
						"budget_exhausted",
						"changed_since_walk",
						"changed_during_read",
						"unreadable"
					])
				})),
				/** Directories the application held files open in whose start state was not retained. */
				unretained_opened_directories: z.array(z.string().min(1))
			}),
			limitations: z.array(z.string())
		});
		RESERVED_CHECKPOINT_NAMES = new Set([
			"baseline",
			"stop",
			"time-limit",
			"exit"
		]);
		checkpointNameRefusal = (name, taken) => {
			if (name === undefined) return undefined;
			if (name.length === 0) return "A checkpoint name cannot be empty.";
			if (RESERVED_CHECKPOINT_NAMES.has(name)) return `The checkpoint name ${name} is reserved for the capture's own checkpoints.`;
			if (taken.has(name)) return `A checkpoint named ${name} was already recorded.`;
			return undefined;
		};
		DESKTOP_CAPTURE_DEFAULTS = {
			maxDurationSeconds: 3600,
			maxEntries: 25e4,
			maxFileBytes: 64 * 1024 * 1024,
			maxContentBytes: 1024 * 1024 * 1024
		};
	})))();
}

//#endregion
//#region dist/desktop/ProgramLookup.js
var isExecutable, tidy, resolveProgram;
function init_ProgramLookup() {
	return (init_ProgramLookup = __esmMin((() => {
		isExecutable = async (path) => {
			try {
				await access(path, constants.X_OK);
				return (await lstat(path)).isDirectory() === false;
			} catch {
				return false;
			}
		};
		tidy = (path) => path.replace(/\/(?:\.?\/)+/gu, "/").replace(/(?<=.)\/\.?$/u, "");
		resolveProgram = async (program, environment, startedIn) => {
			const from = (path) => tidy(isAbsolute(path) ? path : `${startedIn}/${path}`);
			if (program.includes("/")) {
				const path = from(program);
				return await isExecutable(path) ? {
					path,
					fromRelativeEntry: false
				} : undefined;
			}
			for (const directory of environment.PATH?.split(delimiter) ?? []) {
				const path = from(directory === "" ? program : `${directory}/${program}`);
				if (await isExecutable(path)) return {
					path,
					fromRelativeEntry: !isAbsolute(directory)
				};
			}
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/application/desktop/DesktopCaptureRefusals.js
var DESKTOP_OPERATION, DESKTOP_PROVIDER, inputError, unavailable, applicationRefusal, alreadyOpen, windowsUnreadable, clientListMissing, outputRefusal, checkDesktopCaptureHost, desktopOperationFailure;
function init_DesktopCaptureRefusals() {
	return (init_DesktopCaptureRefusals = __esmMin((() => {
		init_ArtifactReader();
		init_ArtifactFileOperation();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_providerAdapterError();
		init_validationFailure();
		init_ProgramLookup();
		DESKTOP_OPERATION = "capture_desktop_application";
		DESKTOP_PROVIDER = {
			id: "rea-desktop",
			name: "REA desktop application capture",
			version: "1"
		};
		inputError = (userMessage, path, remediationAction) => new AnalysisInputError(DESKTOP_OPERATION, {
			userMessage,
			remediationAction,
			conformsToInputContract: true
		}, [{
			path,
			reason: "invalid_value",
			message: userMessage
		}]);
		unavailable = (reason, userMessage, remediationAction) => new AnalysisCapabilityUnavailableError(DESKTOP_PROVIDER.id, DESKTOP_OPERATION, reason, {
			userMessage,
			remediationAction
		});
		applicationRefusal = (refusal) => {
			switch (refusal.reason) {
				case "desktop_entry_not_found": return inputError(`No desktop entry with that id was found in ${refusal.searched.join(", ")}.`, ["desktop_entry"], "Pass an installed entry's id (for example org.xfce.mousepad) or its absolute path, or name the program with --executable.");
				case "desktop_entry_invalid": return inputError(`The desktop entry cannot be launched: ${refusal.detail}.`, ["desktop_entry"], "Choose an Application entry with an Exec key, or name the program with --executable.");
				case "executable_not_found": return inputError(`${refusal.program} is not an executable file or a program on PATH.`, ["executable"], "Install the application, or pass the executable's path.");
				case "executable_on_relative_path": return inputError(`${refusal.program} was found through a relative or empty PATH entry, which the exported computer would not have, so its launch could run another program.`, ["executable"], "Pass the executable's absolute path, or capture with a PATH of absolute directories.");
			}
		};
		alreadyOpen = (launchedBy, running) => {
			const windows = running.map((window) => `"${window.title ?? window.id}"${window.pid === null ? "" : ` (pid ${String(window.pid)})`}`);
			return inputError(`The application is already open: ${windows.join(", ")}.`, [launchedBy], "Close the application, then run the capture again so it launches the application and records its starting state.");
		};
		windowsUnreadable = () => unavailable("display_unreadable", "The X11 client list could not be read with xprop, so REA cannot tell whether the application is already open.", "Check that DISPLAY names the running X11 session and that this user may connect to it (XAUTHORITY), then retry.");
		clientListMissing = () => unavailable("window_manager_unsupported", "The window manager does not publish _NET_CLIENT_LIST, so REA cannot list the application's windows. Desktop capture requires an EWMH-compliant window manager.", "Run the capture in a desktop session whose window manager supports EWMH, such as xfwm4, Mutter, KWin or Openbox.");
		outputRefusal = (output, refusal) => {
			const reasons = {
				not_a_directory: `${output} is not a directory.`,
				foreign_owner: `${output} belongs to another user, so the capture could not be kept private.`,
				not_empty: `The output directory ${output} is not empty.`
			};
			return inputError(reasons[refusal], ["output"], "Pass a new directory, or an empty one you own, with --output.");
		};
		checkDesktopCaptureHost = async (request, host) => {
			if (host.platform !== "linux") throw unavailable("unsupported_host", "Desktop application capture runs on Linux only.", "Run the command on the Linux desktop where the application is installed.");
			const display = host.environment.DISPLAY;
			if (display === undefined || display.length === 0) throw unavailable("display_unavailable", "DISPLAY is not set, so there is no X11 display to launch the application on.", "Run the command from a terminal in the X11 desktop session, or set DISPLAY.");
			const xprop = host.environment.REA_XPROP_COMMAND ?? "xprop";
			if (await resolveProgram(xprop, host.environment, process.cwd()) === undefined) throw unavailable("executable_missing", `${xprop} was not found, so windows cannot be observed.`, "Install x11-utils (it provides xprop), or set REA_XPROP_COMMAND to an xprop executable.");
			const home = host.environment.HOME;
			if (home === undefined || !isAbsolute(home)) throw inputError("HOME must be an absolute path.", ["environment", "HOME"], "Run the command as the desktop user, with HOME set to their home directory.");
			if (request.desktopEntry === undefined === (request.executable === undefined)) throw inputError("Name the application with exactly one of --desktop-entry or --executable.", ["desktop_entry"], "Pass either --desktop-entry or --executable, not both and not neither.");
			const existing = await readdir(request.output).catch((cause) => {
				if (cause.code === "ENOENT") return [];
				throw cause;
			});
			if (existing.length > 0) throw outputRefusal(request.output, "not_empty");
			return {
				display,
				xprop,
				home
			};
		};
		desktopOperationFailure = (cause, signal, operation, label) => {
			if (cause instanceof AnalysisError) return cause;
			if (cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined) {
				const error = new ProviderAdapterError(DESKTOP_PROVIDER.id, operation, {
					cause,
					cleanup: cause.cleanup,
					diagnostics: { phase: operation },
					userMessage: `${label} could not release a resource it used: ${describeValidationFailure(cause)}`
				});
				bindArtifactFileCleanup(cause, error);
				return error;
			}
			if (signal?.aborted === true) return new AnalysisCancelledError(operation, { cause: signal.reason });
			return new ProviderAdapterError(DESKTOP_PROVIDER.id, operation, {
				cause,
				diagnostics: { phase: operation },
				userMessage: `${label} could not complete: ${describeValidationFailure(cause)}`
			});
		};
	})))();
}

//#endregion
export { DESKTOP_CAPTURE_DEFAULTS, DESKTOP_OPERATION, DESKTOP_PROVIDER, alreadyOpen, applicationRefusal, checkDesktopCaptureHost, checkpointNameRefusal, clientListMissing, desktopApplicationCaptureSchema, desktopOperationFailure, diffDesktopStates, init_DesktopCaptureRefusals, init_ProgramLookup, init_desktopCapture, init_desktopStateDiff, isWithinAny, outputRefusal, resolveProgram, unavailable, windowsUnreadable };