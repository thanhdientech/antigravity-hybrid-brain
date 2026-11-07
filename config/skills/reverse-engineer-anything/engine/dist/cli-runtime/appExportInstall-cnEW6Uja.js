import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";

//#region dist/domain/desktop/desktopEntry.js
var GROUP, ENTRY, VALUE_ESCAPES, unescapeValue, listValue, parseDesktopEntry, QUOTED_ESCAPES, tokenizeDesktopExec, FILE_FIELD_CODES, expandDesktopExec, FLATPAK_RUN_VALUE_OPTIONS, flatpakApplicationId, unwrapDesktopCommand;
function init_desktopEntry() {
	return (init_desktopEntry = __esmMin((() => {
		init_result();
		GROUP = /^\[(?<name>[^\]]+)\]$/u;
		ENTRY = /^(?<key>[A-Za-z0-9-]+)\s*=\s*(?<value>.*)$/u;
		VALUE_ESCAPES = {
			s: " ",
			n: "\n",
			t: "	",
			r: "\r",
			"\\": "\\",
			";": "\\;"
		};
		unescapeValue = (value) => value.replace(/\\(.)/gu, (match, next) => VALUE_ESCAPES[next] ?? match);
		listValue = (value) => value === undefined ? [] : value.split(/(?<!\\);/u).map((part) => part.replaceAll("\\;", ";")).filter((part) => part.length > 0);
		parseDesktopEntry = (text) => {
			const values = new Map();
			let group;
			let found = false;
			for (const raw of text.split(/\r?\n/u)) {
				const line = raw.trim();
				if (line.length === 0 || line.startsWith("#")) continue;
				const header = GROUP.exec(line);
				if (header?.groups !== undefined) {
					group = header.groups.name;
					found ||= group === "Desktop Entry";
					continue;
				}
				const entry = ENTRY.exec(line);
				if (group !== "Desktop Entry" || entry?.groups === undefined) continue;
				const { key, value } = entry.groups;
				if (key !== undefined && value !== undefined && !values.has(key)) values.set(key, unescapeValue(value));
			}
			if (!found) return err("missing_desktop_entry_group");
			const field = (key) => values.get(key) ?? null;
			return ok({
				type: field("Type"),
				name: field("Name"),
				exec: field("Exec"),
				try_exec: field("TryExec"),
				path: field("Path"),
				icon: field("Icon"),
				startup_wm_class: field("StartupWMClass"),
				categories: listValue(values.get("Categories")),
				mime_types: listValue(values.get("MimeType")),
				terminal: values.get("Terminal") === "true"
			});
		};
		QUOTED_ESCAPES = new Set([
			"\"",
			"`",
			"$",
			"\\"
		]);
		tokenizeDesktopExec = (exec) => {
			const tokens = [];
			let current;
			let quoted = false;
			for (let index = 0; index < exec.length; index += 1) {
				const character = exec.charAt(index);
				if (quoted) {
					const next = exec.charAt(index + 1);
					if (character === "\\" && QUOTED_ESCAPES.has(next)) {
						current = `${current ?? ""}${next}`;
						index += 1;
					} else if (character === "\"") quoted = false;
					else current = `${current ?? ""}${character}`;
				} else if (character === "\"") {
					quoted = true;
					current ??= "";
				} else if (character === " " || character === "	") {
					if (current !== undefined) tokens.push(current);
					current = undefined;
				} else current = `${current ?? ""}${character}`;
			}
			if (quoted) return err("unterminated_quote");
			if (current !== undefined) tokens.push(current);
			return tokens.length === 0 ? err("empty_command") : ok(tokens);
		};
		FILE_FIELD_CODES = new Set([
			"%f",
			"%F",
			"%u",
			"%U"
		]);
		expandDesktopExec = (tokens, context, arguments_) => {
			const expanded = [];
			for (const token of tokens) {
				if (FILE_FIELD_CODES.has(token)) continue;
				if (token === "%i") {
					if (context.icon !== null) expanded.push("--icon", context.icon);
					continue;
				}
				expanded.push(token.replace(/%(.)/gu, (match, code) => {
					if (code === "%") return "%";
					if (code === "c") return context.name ?? "";
					if (code === "k") return context.location ?? "";
					return /[fFuUidDnNvm]/u.test(code) ? "" : match;
				}));
			}
			return [...expanded, ...arguments_];
		};
		FLATPAK_RUN_VALUE_OPTIONS = new Set([
			"--arch",
			"--command",
			"--cwd",
			"--branch",
			"--runtime",
			"--runtime-version",
			"--commit",
			"--runtime-commit",
			"--parent-pid",
			"--instance-id-fd",
			"--app-path",
			"--usr-path",
			"--installation",
			"--share",
			"--unshare",
			"--socket",
			"--nosocket",
			"--device",
			"--nodevice",
			"--allow",
			"--disallow",
			"--filesystem",
			"--nofilesystem",
			"--env",
			"--env-fd",
			"--unset-env",
			"--own-name",
			"--talk-name",
			"--no-talk-name",
			"--system-own-name",
			"--system-talk-name",
			"--system-no-talk-name",
			"--add-policy",
			"--remove-policy",
			"--persist",
			"--usb",
			"--nousb",
			"--usb-list",
			"--usb-list-file"
		]);
		flatpakApplicationId = (arguments_) => {
			for (let index = 0; index < arguments_.length; index += 1) {
				const token = arguments_[index] ?? "";
				if (token === "--") return arguments_[index + 1]?.split("/")[0] || null;
				if (!token.startsWith("-")) return token.split("/")[0] || null;
				if (FLATPAK_RUN_VALUE_OPTIONS.has(token)) index += 1;
			}
			return null;
		};
		unwrapDesktopCommand = (argv) => {
			let index = 0;
			const environment = Object.create(null);
			if (argv[0]?.split("/").at(-1) === "env") {
				index = 1;
				while (/^[A-Za-z_][A-Za-z0-9_]*=/u.test(argv[index] ?? "")) {
					const assignment = argv[index] ?? "";
					const split = assignment.indexOf("=");
					environment[assignment.slice(0, split)] = assignment.slice(split + 1);
					index += 1;
				}
			}
			const program = argv[index] ?? "";
			if (program.split("/").at(-1) === "flatpak" && argv[index + 1] === "run") return {
				kind: "flatpak",
				program,
				environment,
				application_id: flatpakApplicationId(argv.slice(index + 2))
			};
			return {
				kind: "direct",
				program,
				environment,
				index
			};
		};
	})))();
}

//#endregion
//#region dist/domain/desktop/aptRepositories.js
var ARMOR_BEGIN, ARMOR_END, listValues, withoutTrailingSlashes, USER_INFO, withoutCredentials, withoutCredentialsIn, isRelease, stanza, ONE_LINE, parseOneLineSources, deb822Paragraphs, parseDeb822Sources, SOURCES_ENTRY, parseAptIndexTargets, entryForTarget, declaredPackageFiles, QUOTED, aptListFileName, isUbuntuProRepository, UNTRUSTED_SIGNATURE, validSignature, isArmoredKey, dearmorPublicKeys;
function init_aptRepositories() {
	return (init_aptRepositories = __esmMin((() => {
		ARMOR_BEGIN = "-----BEGIN PGP PUBLIC KEY BLOCK-----";
		ARMOR_END = "-----END PGP PUBLIC KEY BLOCK-----";
		listValues = (value) => (value ?? "").split(/[\s,]+/u).filter((part) => part.length > 0);
		withoutTrailingSlashes = (uri) => uri.replace(/\/+$/u, "");
		USER_INFO = /^(?<scheme>[a-z][a-z0-9+.-]*:\/\/)[^/]*@/iu;
		withoutCredentials = (uri) => uri.replace(USER_INFO, "$<scheme>");
		withoutCredentialsIn = (text) => text.replace(/(?<scheme>[a-z][a-z0-9+.-]*:\/\/)[^\s/]*@/giu, "$<scheme>");
		isRelease = (suite, release) => suite === release || suite === "/" && release === "";
		stanza = (at, fields) => {
			const signedBy = fields.options.get("signed-by") ?? "";
			const inlineKey = signedBy.includes(ARMOR_BEGIN);
			const uris = fields.uris.map(withoutCredentials);
			return {
				...at,
				uris: uris.map(withoutTrailingSlashes),
				credentialed: uris.filter((uri, index) => uri !== fields.uris[index]).map(withoutTrailingSlashes),
				suites: fields.suites,
				components: fields.components,
				architectures: listValues(fields.options.get("arch")),
				signedBy: inlineKey ? [] : listValues(signedBy),
				inlineKey
			};
		};
		ONE_LINE = /^deb(?:\s+\[(?<options>[^\]]*)\])?\s+(?<uri>\S+)\s+(?<suite>\S+)(?<components>(?:\s+\S+)*)\s*$/u;
		parseOneLineSources = (text, file) => text.split("\n").flatMap((line, index) => {
			const groups = ONE_LINE.exec(line.replace(/#.*$/u, "").trim())?.groups;
			if (groups?.uri === undefined || groups.suite === undefined) return [];
			const options = new Map((groups.options ?? "").split(/\s+/u).flatMap((option) => {
				const equals = option.indexOf("=");
				return equals > 0 ? [[option.slice(0, equals), option.slice(equals + 1)]] : [];
			}));
			return [stanza({
				file,
				position: index + 1
			}, {
				uris: [groups.uri],
				suites: [groups.suite],
				components: listValues(groups.components),
				options
			})];
		});
		deb822Paragraphs = (text) => {
			const found = [];
			let current = new Map();
			let last;
			for (const line of [...text.split("\n"), ""]) {
				if (line.trim().length === 0) {
					if (current.size > 0) found.push(current);
					current = new Map();
					last = undefined;
				} else if (line.startsWith("#")) continue;
				else if (/^[ \t]/u.test(line) && last !== undefined) current.set(last, `${current.get(last) ?? ""}\n${line.trim()}`);
				else {
					const colon = line.indexOf(":");
					if (colon <= 0) continue;
					last = line.slice(0, colon).trim().toLowerCase();
					current.set(last, line.slice(colon + 1).trim());
				}
			}
			return found;
		};
		parseDeb822Sources = (text, file) => deb822Paragraphs(text).flatMap((fields, index) => {
			if (!listValues(fields.get("types")).includes("deb") || fields.get("enabled")?.toLowerCase() === "no") return [];
			return [stanza({
				file,
				position: index + 1
			}, {
				uris: listValues(fields.get("uris")),
				suites: listValues(fields.get("suites")),
				components: listValues(fields.get("components")),
				options: new Map([["signed-by", fields.get("signed-by") ?? ""], ["arch", fields.get("architectures") ?? ""]])
			})];
		});
		SOURCES_ENTRY = /^(?<file>\/.*):(?<position>[1-9]\d*)$/u;
		parseAptIndexTargets = (output) => deb822Paragraphs(output).flatMap((fields) => {
			const at = SOURCES_ENTRY.exec(fields.get("sourcesentry") ?? "")?.groups;
			const description = fields.get("description");
			const repoUri = fields.get("repo-uri");
			const baseUri = fields.get("base-uri");
			const filename = fields.get("filename");
			if (at?.file === undefined || at.position === undefined || description === undefined || repoUri === undefined || baseUri === undefined || filename?.startsWith("/") !== true) return [];
			const optional = (name) => fields.get(name) || null;
			return [{
				description: withoutCredentialsIn(description),
				sourcesFile: at.file,
				position: Number(at.position),
				repoUri: withoutCredentials(repoUri),
				release: fields.get("release") ?? "",
				component: optional("component"),
				baseUri: withoutCredentials(baseUri),
				filename,
				origin: optional("origin"),
				suite: optional("suite"),
				codename: optional("codename")
			}];
		});
		entryForTarget = (target, stanzas) => {
			const at = stanzas.find((candidate) => candidate.file === target.sourcesFile && candidate.position === target.position);
			if (at === undefined) return undefined;
			const { uris, credentialed, suites, ...entry } = at;
			const single = uris.length === 1 && suites.length === 1;
			const repoUri = withoutTrailingSlashes(target.repoUri);
			const uri = single ? uris[0] : uris.find((listed) => listed === repoUri);
			const suite = single ? suites[0] : suites.find((listed) => isRelease(listed, target.release));
			if (uri === undefined || suite === undefined) return undefined;
			return {
				...entry,
				uri,
				credentials: credentialed.includes(uri),
				suite,
				components: suite.endsWith("/") ? [] : entry.components
			};
		};
		declaredPackageFiles = (repositories, targets) => {
			const declares = (repository, target) => repository.uri === withoutTrailingSlashes(target.repoUri) && repository.suite !== null && isRelease(repository.suite, target.release) && (target.component === null ? repository.components.length === 0 : repository.components.includes(target.component));
			return new Set(targets.filter((target) => repositories.some((repository) => declares(repository, target))).map((target) => target.description));
		};
		QUOTED = new Set("\\|{}[]<>\"^~_=!@#$%^&*");
		aptListFileName = (uri) => {
			const path = uri.replace(/^[a-z][a-z0-9+.-]*:\/\//iu, "").replace(/^[^/@]*@/u, "");
			let quoted = "";
			for (const character of path) {
				const code = character.codePointAt(0) ?? 0;
				quoted += QUOTED.has(character) || code <= 32 || code >= 127 ? [...Buffer.from(character, "utf8")].map((byte) => `%${byte.toString(16).padStart(2, "0")}`).join("") : character;
			}
			return quoted.replaceAll("/", "_");
		};
		isUbuntuProRepository = (origin, uri) => (origin ?? "").startsWith("UbuntuESM") || /^https?:\/\/esm\.ubuntu\.com(?:[/:]|$)/iu.test(uri ?? "");
		UNTRUSTED_SIGNATURE = /^\[GNUPG:\] (?:BADSIG|EXPSIG|EXPKEYSIG|REVKEYSIG|ERRSIG) (?<key>[0-9A-Fa-f]+)(?: |$)/u;
		validSignature = (status) => {
			const lines = status.split("\n").map((line) => line.trim());
			const untrusted = lines.flatMap((line) => {
				const key = UNTRUSTED_SIGNATURE.exec(line)?.groups?.key;
				return key === undefined ? [] : [key.toUpperCase()];
			});
			const names = (fingerprint, key) => fingerprint.startsWith(key) || fingerprint.endsWith(key);
			for (const line of lines) {
				const fields = /^\[GNUPG:\] VALIDSIG (?<fields>.+)$/u.exec(line)?.groups?.fields?.split(" ");
				const signing = fields?.[0]?.toUpperCase();
				if (signing === undefined) continue;
				const primary = (fields?.[9] ?? signing).toUpperCase();
				if (!untrusted.some((key) => names(signing, key) || names(primary, key))) return {
					signing,
					primary
				};
			}
			return undefined;
		};
		isArmoredKey = (bytes) => Buffer.from(bytes).toString("latin1").trimStart().startsWith(ARMOR_BEGIN);
		dearmorPublicKeys = (bytes) => {
			const blocks = [];
			let state = "outside";
			let body = "";
			for (const raw of Buffer.from(bytes).toString("latin1").split("\n")) {
				const line = raw.trim();
				if (state === "outside") {
					if (line === ARMOR_BEGIN) [state, body] = ["headers", ""];
				} else if (line === ARMOR_END) {
					blocks.push(Buffer.from(body, "base64"));
					state = "outside";
				} else if (state === "headers") {
					if (line.length === 0 || !line.includes(":")) state = "body";
					if (!line.includes(":")) body += line;
				} else if (!/^=[A-Za-z0-9+/]{4}$/u.test(line)) body += line;
			}
			const keyring = Buffer.concat(blocks);
			return keyring.length === 0 ? undefined : keyring;
		};
	})))();
}

//#endregion
//#region dist/domain/desktop/debianPackageFile.js
var PACKAGE_FILE_FIELDS, PACKAGE_NAME, relationEntries, parseDpkgDebFields, packageFileMismatch, dependencyPackages;
function init_debianPackageFile() {
	return (init_debianPackageFile = __esmMin((() => {
		init_aptRepositories();
		PACKAGE_FILE_FIELDS = [
			"Package",
			"Version",
			"Architecture",
			"Depends",
			"Pre-Depends"
		];
		PACKAGE_NAME = /^[a-z0-9][a-z0-9+.-]+$/u;
		relationEntries = (value) => (value ?? "").split(",").map((entry) => entry.replace(/\s+/gu, " ").trim()).filter((entry) => entry.length > 0);
		parseDpkgDebFields = (output) => {
			const fields = deb822Paragraphs(output)[0];
			const name = fields?.get("package") ?? "";
			const version = fields?.get("version") ?? "";
			const architecture = fields?.get("architecture") ?? "";
			if (name.length === 0 || version.length === 0 || architecture.length === 0) return undefined;
			return {
				package: name,
				version,
				architecture,
				depends: relationEntries(fields?.get("depends")),
				pre_depends: relationEntries(fields?.get("pre-depends"))
			};
		};
		packageFileMismatch = (fields, installed) => {
			const name = installed.name?.split(":")[0] ?? null;
			if (fields.package === name && fields.version === installed.version && fields.architecture === installed.architecture) return undefined;
			return `holds ${fields.package} ${fields.version} (${fields.architecture}), not the installed ${name ?? "package"} ${installed.version ?? "of unknown version"} (${installed.architecture ?? "unknown architecture"})`;
		};
		dependencyPackages = (file) => {
			const names = new Set();
			const unread = [];
			for (const entry of [...file.depends, ...file.pre_depends]) {
				const [name = ""] = (entry.split("|")[0] ?? "").trim().split(/[\s(:[<]/u);
				if (PACKAGE_NAME.test(name)) names.add(name);
				else unread.push(entry);
			}
			return {
				names: [...names],
				unread
			};
		};
	})))();
}

//#endregion
//#region dist/domain/desktop/appExportInstall.js
var NOBLE_SUITE, CANONICAL_ARCHIVE, COMPUTER_ARCHITECTURES, fromUbuntuNobleArchive, INSTALL_SCRIPT, CAPTURE_REMEDIATION, refusal, describe, heldCredentials, repositoryRefusal, architectureRefusal, declaredSources, describePackage, localInstallRefusal, vendorInstall, packageUrlRefusal, packageFileInstall, exportInstall, electronLaunchArguments, unmappedLibraries, packageFileLimitations, installLimitations;
function init_appExportInstall() {
	return (init_appExportInstall = __esmMin((() => {
		init_result();
		init_aptRepositories();
		init_debianPackageFile();
		init_desktopEntry();
		NOBLE_SUITE = / noble(?:-updates|-security|-backports)?\/(?:main|restricted|universe|multiverse) /u;
		CANONICAL_ARCHIVE = /^https?:\/\/(?:[a-z]{2}\.)?(?:archive|ports|security)\.ubuntu\.com\//u;
		COMPUTER_ARCHITECTURES = new Map([["x64", "amd64"], ["arm64", "arm64"]]);
		fromUbuntuNobleArchive = (sources, origins) => sources.some((source, index) => NOBLE_SUITE.test(source) && (origins === undefined ? CANONICAL_ARCHIVE.test(source) : origins[index] === "Ubuntu"));
		INSTALL_SCRIPT = "install-package.sh";
		CAPTURE_REMEDIATION = "Capture an application installed with apt from the Ubuntu 24.04 archive, or from a vendor repository reached over http or https on an amd64 or arm64 host where apt trusts its key and gpgv is installed. For one installed from a downloaded .deb file, capture it with --package-file and export it with --package-url.";
		refusal = (reason, field = "capture", remediation = CAPTURE_REMEDIATION) => ({
			field,
			reason,
			remediation
		});
		describe = (repository) => repository.uri === null ? withoutCredentialsIn(repository.source) : `${withoutCredentials(repository.uri)} ${[repository.suite, ...repository.components].join(" ")}`;
		heldCredentials = (repository) => repository.uri !== null && withoutCredentials(repository.uri) !== repository.uri;
		repositoryRefusal = (repository) => {
			if (repository.uri_credentials_removed === true || heldCredentials(repository)) return "its sources entry's URI held a user name or password, which REA neither records nor exports";
			if (repository.signing_key === null) return repository.signing_key_reason ?? "its signing key was not verified";
			if (repository.uri === null || repository.suite === null) return "no apt sources entry configures it";
			return /^https?:\/\//u.test(repository.uri) ? undefined : "agentenv installs apt repositories over http or https only";
		};
		architectureRefusal = (repository, architecture) => {
			const served = repository.architectures ?? [];
			return served.length === 0 || served.includes(architecture) ? undefined : `it serves only ${served.join(", ")}, not the capture host's ${architecture}`;
		};
		declaredSources = (repositories, environment, architecture) => {
			const declared = new Map();
			const keyFiles = new Map();
			const refused = [];
			let first;
			for (const repository of repositories) {
				const { uri, suite, components, signing_key: key } = repository;
				const reason = repositoryRefusal(repository) ?? architectureRefusal(repository, architecture);
				if (reason !== undefined || key === null || uri === null || suite === null) {
					refused.push(`${describe(repository)}: ${reason ?? "it is unusable"}`);
					continue;
				}
				const id = `${uri}\n${suite}`;
				const existing = declared.get(id);
				if (existing !== undefined && existing.keySha256 !== key.sha256) {
					refused.push(`${describe(repository)}: apt takes one key per URI and suite, and ${existing.keyFile} is declared for them`);
					continue;
				}
				const keyFile = keyFiles.get(key.sha256) ?? `apt-keys/${environment}${keyFiles.size === 0 ? "" : `-${String(keyFiles.size + 1)}`}.${key.format === "armored" ? "asc" : "gpg"}`;
				keyFiles.set(key.sha256, keyFile);
				declared.set(id, {
					uri,
					suite,
					components: [...new Set([...existing?.components ?? [], ...components])],
					keyFile,
					keySha256: key.sha256
				});
				first ??= repository;
			}
			return {
				sources: [...declared.values()],
				refused,
				release: first?.release ?? null
			};
		};
		describePackage = (installed) => `${installed.kind}${installed.name === null ? "" : ` ${installed.name}`}; sources: ${installed.sources.map(withoutCredentialsIn).join(", ") || "none"}; apt origins: ${installed.source_origins === undefined ? "not recorded" : installed.source_origins.map((origin) => origin ?? "none").join(", ") || "none"}`;
		localInstallRefusal = (installed) => {
			const file = installed.package_file;
			if (file !== undefined) return refusal(`The application was installed from ${file.name}, which no apt repository the capture recorded lists (${describePackage(installed)}), so the computer can install it only from a copy of that file.`, "package_url", `Pass --package-url with an http or https URL the computer may download ${file.name} from, byte for byte the captured file.`);
			const reason = installed.package_file_reason;
			return refusal(`The application is not installed from the Ubuntu 24.04 package archive or a vendor apt repository the capture recorded (${describePackage(installed)}), so the computer cannot install it by name. An application installed from a downloaded .deb file is exported with --package-url once it was captured with --package-file${reason === undefined ? "" : `, which this capture could not record: ${reason}`}.`, "capture", "Capture again with --package-file naming the .deb file the application was installed from, then export with --package-url naming where the computer may download that file.");
		};
		vendorInstall = (installed, aptPackage, environment, hostArchitecture) => {
			const repositories = installed.apt_repositories ?? [];
			if (repositories.length === 0) return err({
				refusal: localInstallRefusal(installed),
				skipped: []
			});
			if (repositories.some(heldCredentials)) return err({
				refusal: refusal("The capture recorded a user name or password in an apt repository's URI, from before REA removed them, so it cannot tell which library packages only that repository offers.", "capture", "Capture the application again."),
				skipped: []
			});
			const architecture = COMPUTER_ARCHITECTURES.get(hostArchitecture);
			if (architecture === undefined) return err({
				refusal: refusal(`The capture host's architecture ${hostArchitecture} is not one an agentenv computer runs (${[...COMPUTER_ARCHITECTURES.keys()].join(", ")}), so its vendor packages may not suit the computer.`),
				skipped: []
			});
			const { sources, refused, release } = declaredSources(repositories, environment, architecture);
			if (sources.length === 0) return err({
				refusal: refusal(`The application comes from apt repositories the computer cannot use (${refused.join("; ")}).`),
				skipped: refused
			});
			return ok({
				aptPackage,
				release,
				libraryPackages: installed.library_packages ?? [],
				sources,
				skipped: refused,
				architectures: [architecture],
				packageFile: null
			});
		};
		packageUrlRefusal = (url) => {
			let parsed;
			try {
				parsed = new URL(url);
			} catch {
				return "--package-url is not a URL";
			}
			if (parsed.username !== "" || parsed.password !== "") return "--package-url holds a user name or password, which the bundle would keep in plain text";
			return /^https?:\/\//u.test(url) && (parsed.protocol === "http:" || parsed.protocol === "https:") ? undefined : "--package-url does not start with http:// or https:// in lowercase, the only URLs the computer downloads";
		};
		packageFileInstall = (installed, named, packageUrl, hostArchitecture) => {
			const file = installed.package_file;
			const recordFile = "Capture again with --package-file naming the .deb file the installed version came from.";
			if (file === undefined) return err(refusal(installed.package_file_reason === undefined ? `--package-url was given, but the capture recorded no package file for ${named.aptPackage}.` : `--package-url was given, but the capture did not record its package file: ${installed.package_file_reason}.`, "capture", recordFile));
			const url = packageUrlRefusal(packageUrl);
			if (url !== undefined) return err(refusal(url, "package_url", "Pass --package-url with an http:// or https:// URL that holds no user name or password."));
			const architecture = file.architecture === "all" ? COMPUTER_ARCHITECTURES.get(hostArchitecture) : [...COMPUTER_ARCHITECTURES.values()].find((name) => name === file.architecture);
			if (architecture === undefined) return err(refusal(`${file.name} is built for ${file.architecture === "all" ? `all architectures, and the capture host's is ${hostArchitecture}` : file.architecture}, which an agentenv computer does not run (amd64, arm64).`));
			const { names, unread } = dependencyPackages(file);
			return ok({
				...named,
				release: null,
				libraryPackages: installed.library_packages ?? [],
				sources: [],
				architectures: [architecture],
				packageFile: {
					url: packageUrl,
					sha256: file.sha256,
					path: `vendor/${file.name}`,
					architecture,
					dependencies: names,
					unreadDependencies: unread
				}
			});
		};
		exportInstall = (installed, environment, hostArchitecture, packageUrl) => {
			if (installed.kind !== "deb" || installed.name === null) return err(refusal(`The application is not an apt package (${describePackage(installed)}), so the computer cannot install it.`));
			const aptPackage = installed.name.split(":")[0] ?? installed.name;
			const named = fromUbuntuNobleArchive(installed.sources, installed.source_origins) ? ok({
				aptPackage,
				release: null,
				libraryPackages: [],
				sources: [],
				skipped: [],
				architectures: [...COMPUTER_ARCHITECTURES.values()],
				packageFile: null
			}) : vendorInstall(installed, aptPackage, environment, hostArchitecture);
			if (named.ok) return packageUrl === undefined ? named : err(refusal(`--package-url is not needed: the computer installs ${aptPackage} from ${named.value.sources.length === 0 ? "the Ubuntu 24.04 archive by name" : `the vendor apt repository ${named.value.sources.map((source) => source.uri).join(", ")}`}.`, "package_url", "Export without --package-url."));
			if (packageUrl === undefined) return err(named.error.refusal);
			return packageFileInstall(installed, {
				aptPackage,
				skipped: named.error.skipped
			}, packageUrl, hostArchitecture);
		};
		electronLaunchArguments = (argv, electron) => {
			if (!electron || argv.includes("--no-sandbox")) return argv;
			const wrapper = unwrapDesktopCommand(argv);
			const at = wrapper.kind === "direct" ? wrapper.index + 1 : 1;
			return [
				...argv.slice(0, at),
				"--no-sandbox",
				...argv.slice(at)
			];
		};
		unmappedLibraries = (installed) => [
			...installed.library_packages_reason === undefined ? [] : [installed.library_packages_reason],
			...installed.missing_libraries?.length ? [`not found on the capture host: ${installed.missing_libraries.join(", ")}`] : [],
			...installed.unpackaged_libraries?.length ? [`owned by no package: ${installed.unpackaged_libraries.join(", ")}`] : [],
			...installed.uninstallable_library_packages?.length ? [`in packages neither the Ubuntu 24.04 archive nor a declared repository offers: ${installed.uninstallable_library_packages.join(", ")}`] : []
		];
		packageFileLimitations = (file, installed) => [
			`The computer downloads the package from ${file.url} once, when the bundle is put, and refuses the download unless its SHA-256 is ${file.sha256}, the captured file's; the bundle does not contain the package. It installs exactly that file's version, ${installed.version ?? "unknown"}, with dpkg after the apt packages it depends on, and the bundle supports only its architecture, ${file.architecture}.`,
			"Vendor sites may refuse automated downloads, so the URL must point at a copy of the file the operator may use, and the package's licence, such as a trial's terms, is the operator's to check.",
			...file.unreadDependencies.length === 0 ? [] : [`REA could not read a package name from these dependencies, so the computer does not install them: ${file.unreadDependencies.join(", ")}.`]
		];
		installLimitations = (install, installed, electron) => {
			const unmapped = unmappedLibraries(installed);
			const vendor = install.sources.length > 0 || install.packageFile !== null;
			return [
				...install.packageFile !== null ? packageFileLimitations(install.packageFile, installed) : [install.sources.length > 0 ? `The application is installed as ${install.aptPackage}${install.release === null ? "" : `/${install.release}`} from ${install.sources.map((source) => source.uri).join(", ")}, trusting the key that verified it on the capture host, so the computer installs the version that repository offers then, which may differ from the one captured; the bundle supports only the capture host's architecture, ${install.architectures.join(", ")}.` : "The application is installed from the distribution archive by name, so the computer may install a different version than the one captured."],
				...install.skipped.map((repository) => `The apt repository ${repository} was left out.`),
				...vendor && installed.library_packages === undefined ? ["The capture did not record the executable's library packages, so the computer installs only what the package depends on."] : [],
				...!vendor || unmapped.length === 0 ? [] : [`Not every library the executable loads is installed with it (${unmapped.join("; ")}), so the computer may lack some.`],
				...electron ? ["Chromium's sandbox is off inside the computer (--no-sandbox): it needs user namespaces the computer's container does not grant, and Electron exits without them."] : []
			];
		};
	})))();
}

//#endregion
export { INSTALL_SCRIPT, PACKAGE_FILE_FIELDS, aptListFileName, dearmorPublicKeys, declaredPackageFiles, electronLaunchArguments, entryForTarget, expandDesktopExec, exportInstall, fromUbuntuNobleArchive, init_appExportInstall, init_aptRepositories, init_debianPackageFile, init_desktopEntry, installLimitations, isArmoredKey, isUbuntuProRepository, packageFileMismatch, parseAptIndexTargets, parseDeb822Sources, parseDesktopEntry, parseDpkgDebFields, parseOneLineSources, repositoryRefusal, tokenizeDesktopExec, unwrapDesktopCommand, validSignature, withoutCredentialsIn };