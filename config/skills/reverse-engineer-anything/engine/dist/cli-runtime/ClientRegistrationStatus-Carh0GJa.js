import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { RegularFileCleanupFailure, init_OwnedRegularFile } from "./ArtifactReader-DJ9rniiL.js";
import { clientEvidencePaths, clientOwnershipEvidencePaths, compactInputSchemaByDefault, currentClientRegistrationCommand, init_ClientRegistrationIdentity, init_SupportedClients, inspectClientRegistrationCommand, manualRegistrationRemediation, supportedClients } from "./SetupSkill-CYR5hbcc.js";
import { PRODUCT_IDENTITY, compareUnicodeCodePoints, init_identity, init_unicodeCodePointOrder } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_snapshotEnvironment, snapshotEnvironment } from "./snapshotEnvironment-C6Y7aHfj.js";
import { CURRENT_ENTRYPOINT_PATH, init_CurrentEntrypointPath } from "./CurrentEntrypointPath-Chqij9jD.js";
import { MCP_STARTUP_POLICY, init_mcpStartupPolicy, mcpProviderDeadlineAllowanceMs, recommendedMcpToolTimeoutMs, recommendedMcpToolTimeoutSeconds } from "./mcpStartupPolicy-CLUdEzPj.js";
import { clientConfigurationValuesEqual, clientRegistrationEntry, clientRegistrationEnvironmentDetailsWithBudget, clientRegistrationOwnershipRemediation, clientServerForcedEnabled, clientServerListedDisabled, dshDocument, effectiveClientServer, geminiServerPolicyBlock, init_ClientConfigurationDocument, init_ClientConfigurationFiles, init_ClientRegistration, init_ClientRegistrationEnvironment, init_DshCordisPatch, parseClientRegistration, parseGeminiMcpPolicy, readConfigurationFile, readConfigurationText, readEffectiveClientRegistrationConfiguration, recordedProviderSettings, setupPreservesDisabledActivation } from "./ClientRegistration-BfxyJ86r.js";
import { dirname, resolve } from "node:path";
import { lstat, realpath, stat } from "node:fs/promises";
import { z } from "zod";
import { stripComments } from "jsonc-parser";

//#region dist/application/GeminiClientSettings.js
var folderTrustSchema, trustRulesSchema, sourceFailure, normalizedPath, workspaceTrusted, readClientPolicyBlock;
function init_GeminiClientSettings() {
	return (init_GeminiClientSettings = __esmMin((() => {
		init_result();
		init_identity();
		init_ClientRegistrationIdentity();
		init_ClientConfigurationDocument();
		init_ClientConfigurationFiles();
		folderTrustSchema = z.object({ security: z.object({ folderTrust: z.object({ enabled: z.boolean().optional() }).passthrough().optional() }).passthrough().optional() }).passthrough();
		trustRulesSchema = z.record(z.string(), z.enum([
			"TRUST_FOLDER",
			"TRUST_PARENT",
			"DO_NOT_TRUST"
		]));
		sourceFailure = (path, cause) => ({
			kind: "malformed",
			path,
			detail: `Gemini settings in ${path} are malformed: ${cause instanceof Error ? cause.message : String(cause)}`
		});
		normalizedPath = async (path, platform) => {
			const physical = await realpath(path).catch(() => path);
			const absolute = resolve(physical).replaceAll("\\", "/");
			return platform === "win32" || platform === "darwin" ? absolute.toLowerCase() : absolute;
		};
		workspaceTrusted = async (settings, sources, resources) => {
			let enabled = true;
			for (const { path, document } of sources) {
				const parsed = folderTrustSchema.safeParse(document.document);
				if (!parsed.success) return err(sourceFailure(path, parsed.error));
				enabled = parsed.data.security?.folderTrust?.enabled ?? enabled;
			}
			if (settings.trustOverride !== undefined) return ok(settings.trustOverride);
			if (!enabled) return ok(true);
			const text = await readConfigurationText(settings.trustedFoldersPath, resources);
			if (!text.ok) return text;
			if (text.value === undefined) return ok(false);
			let rules;
			try {
				rules = trustRulesSchema.parse(JSON.parse(stripComments(text.value)));
			} catch (cause) {
				return err(sourceFailure(settings.trustedFoldersPath, cause));
			}
			const workspace = await normalizedPath(settings.workspaceDirectory, settings.platform);
			let longest = -1;
			let trusted = false;
			for (const [path, level] of Object.entries(rules)) {
				const effective = await normalizedPath(level === "TRUST_PARENT" ? dirname(path) : path, settings.platform);
				if ((workspace === effective || workspace.startsWith(effective.endsWith("/") ? effective : `${effective}/`)) && path.length > longest) {
					longest = path.length;
					trusted = level !== "DO_NOT_TRUST";
				}
			}
			return ok(trusted);
		};
		readClientPolicyBlock = async (client, userDocument, desiredRegistration, resources) => {
			if (client.name !== "gemini_cli" || client.geminiSettings === undefined) return ok(undefined);
			const settings = client.geminiSettings;
			const sources = [];
			const higher = [];
			for (const path of [
				settings.defaultsPath,
				client.configPath,
				settings.systemPath
			]) {
				const parsed = path === client.configPath ? ok(userDocument) : await readConfigurationFile(path, "json", resources);
				if (!parsed.ok) return parsed;
				if (parsed.value !== undefined) sources.push({
					path,
					document: parsed.value
				});
			}
			const workspace = await normalizedPath(settings.workspaceDirectory, settings.platform);
			const home = await normalizedPath(dirname(dirname(client.configPath)), settings.platform);
			if (workspace !== home) {
				const path = resolve(settings.workspaceDirectory, ".gemini", "settings.json");
				const present = await stat(path).then(() => ok(true), (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT" ? ok(false) : err({
					kind: "unreadable",
					path,
					detail: `Configuration ${path} could not be read: ${cause instanceof Error ? cause.message : String(cause)}`
				}));
				if (!present.ok) return present;
				const includeWorkspace = present.value ? await workspaceTrusted(settings, sources, resources) : ok(false);
				if (!includeWorkspace.ok) return includeWorkspace;
				if (includeWorkspace.value) {
					const document = await readConfigurationFile(path, "json", resources);
					if (!document.ok) return document;
					if (document.value !== undefined) {
						const source = {
							path,
							document: document.value
						};
						const systemIndex = sources.findIndex((item) => item.path === settings.systemPath);
						sources.splice(systemIndex < 0 ? sources.length : systemIndex, 0, source);
						higher.push(source);
					}
				}
			}
			const system = sources.find(({ path }) => path === settings.systemPath);
			if (system !== undefined) higher.push(system);
			const policies = [];
			for (const { path, document } of sources) {
				try {
					policies.push(parseGeminiMcpPolicy(document));
				} catch (cause) {
					return err(sourceFailure(path, cause));
				}
			}
			const policy = geminiServerPolicyBlock(policies, PRODUCT_IDENTITY.mcpServerKey);
			if (policy !== undefined) return ok(`${policy} Settings sources: ${sources.map(({ path }) => path).join(", ")}.`);
			const override = higher.findLast(({ document }) => Object.hasOwn(document.servers, PRODUCT_IDENTITY.mcpServerKey));
			const desired = desiredRegistration ?? userDocument?.servers[PRODUCT_IDENTITY.mcpServerKey] ?? clientRegistrationEntry("json", currentClientRegistrationCommand(), {});
			if (override !== undefined && !clientConfigurationValuesEqual(override.document.servers[PRODUCT_IDENTITY.mcpServerKey], desired)) return ok(`Gemini mcpServers.${PRODUCT_IDENTITY.mcpServerKey} in ${override.path} overrides the user registration. Review that settings file before rerunning setup; REA does not modify system or workspace settings.`);
			return ok(undefined);
		};
	})))();
}

//#endregion
//#region dist/application/ClientRegistrationStatus.js
var readClientRegistrationStatuses, readClientRegistrationInspections, sharedEnableFlagBinds, sharedDisabledActivationRemediation, ignoresDisabledKey, ignoresEnabledKey, registrationActivation, registrationAligned, remediation, unknownEntryPointRemediation, configuredStatus, timeoutAdvisory, packageVersionRemediation, unavailableStatus, clientEvidencePresent, isMissing;
function init_ClientRegistrationStatus() {
	return (init_ClientRegistrationStatus = __esmMin((() => {
		init_OwnedRegularFile();
		init_GeminiClientSettings();
		init_ClientConfigurationFiles();
		init_ClientConfigurationDocument();
		init_result();
		init_identity();
		init_snapshotEnvironment();
		init_CurrentEntrypointPath();
		init_mcpStartupPolicy();
		init_ClientRegistrationIdentity();
		init_SupportedClients();
		init_unicodeCodePointOrder();
		init_DshCordisPatch();
		init_ClientRegistrationEnvironment();
		init_ClientRegistration();
		readClientRegistrationStatuses = async (home, currentCommandPath = CURRENT_ENTRYPOINT_PATH, options = {}) => (await readClientRegistrationInspections(home, currentCommandPath, options)).map(({ status }) => status);
		readClientRegistrationInspections = async (home, currentCommandPath = CURRENT_ENTRYPOINT_PATH, options = {}) => {
			const inspections = [];
			const record = (status, activation = "unknown", commandIdentity = "unknown") => {
				inspections.push({
					status,
					activation,
					commandIdentity
				});
			};
			for (const client of supportedClients(home, options.platform, options.environment)) {
				const selected = options.selectedClientIds?.includes(client.name) === true;
				if (client.configPathError !== undefined) {
					record({
						client: client.name,
						config_path: client.configPath,
						command: [],
						state: "invalid",
						remediation: client.configPathError
					});
					continue;
				}
				const presence = await clientEvidencePresent(client, {
					selected,
					ownership: options.evidence === "ownership"
				});
				if (!presence.ok) {
					record({
						client: client.name,
						config_path: presence.error.path,
						command: [],
						state: "invalid",
						remediation: presence.error.detail
					});
					continue;
				}
				if (!presence.value) continue;
				const manualRemediation = manualRegistrationRemediation(client.name);
				if (client.format === "unsupported") {
					if (manualRemediation !== undefined) record({
						client: client.name,
						config_path: client.markerPath ?? client.configPath,
						command: [],
						state: "manual",
						remediation: manualRemediation
					});
					continue;
				}
				let selectedConfigPath = client.configPath;
				try {
					const configuration = await readEffectiveClientRegistrationConfiguration(client, options.resources, options.platform);
					if (!configuration.ok) {
						if (options.resources === undefined && configuration.error.cleanupFailure !== undefined) throw configuration.error.cleanupFailure;
						record({
							client: client.name,
							config_path: configuration.error.path,
							command: [],
							state: "invalid",
							remediation: configuration.error.detail
						});
						continue;
					}
					const { document: parsed, configPath } = configuration.value;
					selectedConfigPath = configPath;
					if (parsed === undefined) {
						record(unavailableStatus(client, "missing", configPath));
						continue;
					}
					const policy = await readClientPolicyBlock(client, parsed, undefined, options.resources);
					if (!policy.ok) {
						if (options.resources === undefined && policy.error.cleanupFailure !== undefined) throw policy.error.cleanupFailure;
						record({
							client: client.name,
							config_path: configPath,
							command: [],
							state: "invalid",
							remediation: policy.error.detail
						});
						continue;
					}
					const policyBlock = policy.value;
					const raw = effectiveClientServer(parsed, PRODUCT_IDENTITY.mcpServerKey);
					if (raw === undefined) {
						const editabilityError = parsed.dialect === "dsh" ? dshDocument(parsed.document).editabilityError : undefined;
						if (editabilityError !== undefined) {
							record({
								client: client.name,
								config_path: configPath,
								command: [],
								state: "invalid",
								remediation: editabilityError.message
							});
							continue;
						}
						record(unavailableStatus(client, "missing", configPath));
						continue;
					}
					const effectiveClient = parsed.dialect === "zcode_fallback" ? {
						...client,
						configPath,
						configPaths: [configPath],
						format: "zcode_fallback"
					} : client;
					const parsedRegistration = parseClientRegistration(raw, effectiveClient);
					if (!parsedRegistration.ok) {
						record({
							client: client.name,
							config_path: configPath,
							command: [],
							state: "invalid",
							remediation: `${parsedRegistration.error.message}: ${parsedRegistration.error.settings.map(({ setting, constraint }) => `${setting}: ${constraint}`).join("; ")}`
						});
						continue;
					}
					const registration = parsedRegistration.value;
					const registrationEnvironment = compactInputSchemaByDefault(client) || client.name === "codex" ? await clientRegistrationEnvironmentDetailsWithBudget(parsed, {}, "effective", client.name === "kimi" || client.name === "codex" ? options.resolveProviderRequestBudget : undefined, options.platform) : undefined;
					if (registrationEnvironment !== undefined && !registrationEnvironment.ok) {
						record({
							client: client.name,
							config_path: configPath,
							command: [],
							state: "invalid",
							remediation: registrationEnvironment.error.message
						});
						continue;
					}
					const command = [registration.command, ...registration.args];
					const commandFacts = inspectClientRegistrationCommand(command, currentCommandPath);
					const packageReference = commandFacts.package?.reference;
					const activation = registrationActivation(registration, client, parsed);
					const packageVersion = commandFacts.package?.exactVersion;
					const packageVersionDrift = packageVersion !== undefined && packageVersion !== PRODUCT_IDENTITY.packageVersion;
					const alignment = registrationAligned({
						registration,
						client: effectiveClient,
						command,
						commandFacts,
						platform: options.platform ?? process.platform,
						inputSchemaProfileSelected: registrationEnvironment?.ok === true && snapshotEnvironment(registrationEnvironment.value.values, options.platform).REA_MCP_INPUT_SCHEMA_PROFILE !== undefined
					});
					record(configuredStatus(effectiveClient, command, alignment === "unknown" ? "unknown" : activation === "enabled" && !packageVersionDrift && alignment === "aligned" && (parsed.dialect !== "dsh" || dshDocument(parsed.document).ready) && policyBlock === undefined ? "aligned" : "stale", (parsed.dialect !== "dsh" && commandFacts.identity !== "owned" ? clientRegistrationOwnershipRemediation(commandFacts.identity, [configPath]) : undefined) ?? policyBlock ?? (packageVersionDrift ? packageVersionRemediation(packageReference ?? "", client) : alignment === "unknown" ? unknownEntryPointRemediation() : undefined) ?? (activation === "disabled" && registration.enable === false && setupPreservesDisabledActivation(effectiveClient, effectiveClient.format) ? sharedDisabledActivationRemediation() : undefined), packageReference, registrationEnvironment?.ok === true ? timeoutAdvisory(client, registration, registrationEnvironment.value.timeoutInputs) : undefined, options.providerSettings === undefined ? undefined : recordedProviderSettings(parsed, options.providerSettings, options.platform)), activation, commandFacts.identity);
				} catch (cause) {
					if (options.resources === undefined && cause instanceof RegularFileCleanupFailure) throw cause;
					record(unavailableStatus(client, isMissing(cause) ? "missing" : "invalid", selectedConfigPath));
				}
			}
			return inspections.sort((left, right) => compareUnicodeCodePoints(left.status.client, right.status.client));
		};
		sharedEnableFlagBinds = (registration, client, parsed) => (parsed.dialect === "zcode" || parsed.dialect === "zcode_fallback" || client.sharedRegistration === true) && registration.enable === false;
		sharedDisabledActivationRemediation = () => "This shared registration row carries enable: false, which binds every reader of the shared storage, including ZCode's fallback view. REA preserves that flag, so rea setup will not change this row. Re-enable it with the product that disabled it, or remove enable: false manually, then rerun rea doctor.";
		ignoresDisabledKey = new Set(["codex", "kimi"]);
		ignoresEnabledKey = new Set(["devin"]);
		registrationActivation = (registration, client, parsed) => client.format !== "grok" && !ignoresDisabledKey.has(client.name) && registration.disabled === true || registration.enabled === false && !ignoresEnabledKey.has(client.name) && !clientServerForcedEnabled(parsed, PRODUCT_IDENTITY.mcpServerKey) || sharedEnableFlagBinds(registration, client, parsed) || clientServerListedDisabled(parsed, PRODUCT_IDENTITY.mcpServerKey) ? "disabled" : "enabled";
		registrationAligned = ({ registration, client, command, commandFacts, platform, inputSchemaProfileSelected }) => {
			const { identity } = commandFacts;
			if (identity === "unknown") return "unknown";
			if (identity === "foreign") return "stale";
			if (client.name === "grok_build" && registration.startup_timeout_sec === undefined) return "stale";
			if (client.name === "codex" && (registration.startup_timeout_sec === undefined || registration.tool_timeout_sec === undefined)) return "stale";
			if (client.name === "kimi" && (registration.startupTimeoutMs === undefined || registration.toolTimeoutMs === undefined)) return "stale";
			if (compactInputSchemaByDefault(client) && !inputSchemaProfileSelected) return "stale";
			if (client.format === "dsh" && (registration.serverName !== "rea" || registration.transport !== "stdio")) return "stale";
			if (commandFacts.package !== undefined) return "stale";
			return commandFacts.launch === "runtime_script" ? "aligned" : "stale";
		};
		remediation = (client) => {
			if (client.quitBeforeSetup !== true) return "Run rea setup to refresh this registration, then restart the client.";
			const name = client.displayName ?? client.name;
			return `Quit ${name} fully, run rea setup to refresh this registration, then start ${name} again. A running ${name} can rewrite its configuration from memory and drop the registration.`;
		};
		unknownEntryPointRemediation = () => "The existing registration was retained because its executable identity cannot be verified. Check the registered launcher path, symlink targets and access permissions. Run the installed REA CLI or a supported package runner, then rerun rea doctor; no registration was changed.";
		configuredStatus = (client, command, state, policyRemediation, packageReference, advisory, providerSettings) => state === "aligned" ? {
			client: client.name,
			config_path: client.configPath,
			command,
			...packageReference === undefined ? {} : { package_reference: packageReference },
			state,
			remediation: null,
			...advisory === undefined ? {} : { advisory },
			...providerSettings === undefined ? {} : { provider_settings: providerSettings }
		} : {
			client: client.name,
			config_path: client.configPath,
			command,
			...packageReference === undefined ? {} : { package_reference: packageReference },
			state,
			remediation: policyRemediation ?? remediation(client),
			...providerSettings === undefined ? {} : { provider_settings: providerSettings }
		};
		timeoutAdvisory = (client, registration, timeoutInputs) => {
			const toolTimeout = client.name === "kimi" ? registration.toolTimeoutMs : client.name === "codex" ? registration.tool_timeout_sec : undefined;
			if (toolTimeout === undefined) return undefined;
			const providerAllowance = mcpProviderDeadlineAllowanceMs(timeoutInputs);
			const isKimi = client.name === "kimi";
			const toolTimeoutMs = Number(toolTimeout) * (isKimi ? 1 : 1e3);
			const batchScope = timeoutInputs.ghidraDecompileTimeoutMs !== undefined && (timeoutInputs.analysisProvider === "ghidra" || timeoutInputs.analysisProvider === "auto") ? "The derived Ghidra deadline is a single-decompile estimate. For multi-function workflows such as batch_decompile, decompile_all or trace_native_values, allow startup plus every attempted function's limit and other work; split calls, reduce trace_native_values max_functions, or select a larger client deadline when needed. Explicit caller deadlines remain unchanged." : undefined;
			if (toolTimeoutMs >= providerAllowance) return batchScope;
			const setting = isKimi ? "toolTimeoutMs" : "tool_timeout_sec";
			const currentValue = isKimi ? `${String(toolTimeout)} ms` : `${String(toolTimeout)} seconds`;
			const recommendedValue = isKimi ? `${String(recommendedMcpToolTimeoutMs(timeoutInputs))} ms` : `${String(recommendedMcpToolTimeoutSeconds(timeoutInputs))} seconds`;
			const headroom = isKimi ? `${String(MCP_STARTUP_POLICY.toolOperationHeadroomMs)} ms` : `${String(MCP_STARTUP_POLICY.toolOperationHeadroomMs / 1e3)} seconds`;
			const recommendation = `The configured ${setting} (${currentValue}) is shorter than REA's known provider allowance (${String(providerAllowance)} ms), so provider startup or an upstream request may exceed this client deadline. REA recommends ${setting} = ${recommendedValue} to cover that allowance plus ${headroom} of operation headroom; this additional headroom is a recommendation, not a guarantee for every analysis.`;
			return batchScope === undefined ? recommendation : `${recommendation} ${batchScope}`;
		};
		packageVersionRemediation = (packageReference, client) => `This registration requests ${packageReference}, while the current REA CLI package is ${PRODUCT_IDENTITY.packageVersion}. REA does not resolve package-runner requests during doctor; update the registration with rea setup --client ${client.name}, then restart the client.`;
		unavailableStatus = (client, state, configPath = client.configPath) => ({
			client: client.name,
			config_path: configPath,
			command: [],
			state,
			remediation: remediation(client)
		});
		clientEvidencePresent = async (client, evidence) => {
			if (evidence.selected) return ok(true);
			const discoveryPaths = new Set(client.discoveryPaths ?? []);
			const paths = [...clientEvidencePaths(client), ...evidence.ownership ? clientOwnershipEvidencePaths(client) : []];
			let unavailable;
			for (const path of paths) {
				try {
					await (discoveryPaths.has(path) ? stat(path) : lstat(path));
					return ok(true);
				} catch (cause) {
					if (!isMissing(cause)) unavailable ??= {
						path,
						detail: `Client configuration evidence at ${path} could not be inspected: ${cause instanceof Error ? cause.message : String(cause)}. Check file permissions and rerun rea doctor.`
					};
				}
			}
			return unavailable === undefined ? ok(false) : err(unavailable);
		};
		isMissing = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
	})))();
}

//#endregion
export { init_ClientRegistrationStatus, init_GeminiClientSettings, readClientPolicyBlock, readClientRegistrationInspections, readClientRegistrationStatuses };