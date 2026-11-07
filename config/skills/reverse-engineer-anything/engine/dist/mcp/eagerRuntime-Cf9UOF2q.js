import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { f as init_snapshotEnvironment, m as snapshotEnvironment } from "./ExecFileOutput-CmNC2ZNQ.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { b as init_parseConfig, x as parseConfig } from "./ownedDebuggerCleanupError-BYvpQZAY.js";
import { n as init_analysisErrorProjection, r as projectAnalysisError } from "./analysisErrorProjection-B_6dTGtM.js";
import { f as init_analysisErrorCore, i as AnalysisCancelledError, l as AnalysisResourceConstraintError, s as AnalysisOutputError } from "./analysisErrorCore-BCqhUcUc.js";
import { a as createShutdown, c as MCP_CONNECTION_START_FAILED, d as init_messages, i as reportMcpTransportError, l as MCP_HTTP_LISTEN_FAILED, n as init_OwnedMcpServers, o as init_shutdown, r as init_reportMcpTransportError, s as reportMcpShutdownFailure, t as OwnedMcpServers } from "./OwnedMcpServers-B4pn3aiF.js";
import { n as init_logger, t as createLogger } from "./logger-Brcs2SlV.js";
import { n as StreamableHttpListenError, r as init_streamableHttpListenError } from "./streamableHttpListenError-mWuvHR30.js";
import { B as PLAYWRIGHT_ELECTRON_ACTIVE_PROVIDER_IDENTITY, C as init_AnalysisSettings, L as CDP_BROWSER_PROVIDER_IDENTITY, R as CDP_ELECTRON_PROVIDER_IDENTITY, S as AnalysisSettings, T as init_providerIdentity, V as init_providerIdentities, b as createAndroidAnalysisProvider, o as createToolResultDelivery, r as init_createServer, s as init_toolResult, t as createServer, w as V8_INSPECTOR_PROVIDER_IDENTITY, x as init_android, z as PLAYWRIGHT_BROWSER_SCENARIO_PROVIDER_IDENTITY } from "./createServer-CMxQrH3I.js";
import { n as createBinarySession, r as init_binary } from "./binary-Cu50nGom.js";
import { STDIO_DEFAULT_MAX_BUFFER_SIZE } from "@modelcontextprotocol/server";

//#region dist/main/startup.js
var openInitialTarget;
function init_startup() {
	return (init_startup = __esmMin((() => {
		init_analysisErrorCore();
		init_analysisErrorProjection();
		openInitialTarget = async (session, config, serverLogger, writeStderr, signal) => {
			if (signal?.aborted) return {
				ok: false,
				exitCode: 0
			};
			if (config.hopperTargetPath === undefined) return { ok: true };
			const opened = await session.open(config.hopperTargetPath, {
				targetKind: config.hopperTargetKind,
				...signal === undefined ? {} : { signal }
			});
			if (opened.ok) return { ok: true };
			if (opened.error instanceof AnalysisCancelledError && signal?.aborted) return {
				ok: false,
				exitCode: 0
			};
			serverLogger.error({ error: projectAnalysisError(opened.error) }, "Initial target failed to open");
			writeStderr(`${projectAnalysisError(opened.error).message}\n`);
			return {
				ok: false,
				exitCode: 1
			};
		};
	})))();
}

//#endregion
//#region dist/main/transport.js
var startMcpTransport;
function init_transport() {
	return (init_transport = __esmMin((() => {
		init_android();
		init_createServer();
		init_streamableHttpListenError();
		init_OwnedMcpServers();
		init_messages();
		init_reportMcpTransportError();
		startMcpTransport = async (dependencies, session, serverContext) => {
			const { serverLogger } = serverContext;
			let optionalProviders = {};
			try {
				optionalProviders = await serverContext.loadOptionalProviders();
			} catch (cause) {
				serverLogger.warn({ error: cause instanceof Error ? cause.message : String(cause) }, "Optional MCP providers could not load; affected tools remain unavailable");
			}
			const { optionalProviderLoadFailures, ...observationProviders } = optionalProviders;
			for (const failure of Object.values(optionalProviderLoadFailures ?? {})) {
				serverLogger.warn({
					providerId: failure.providerId,
					error: failure.reason
				}, "Optional MCP adapter could not load; its peers remain available");
			}
			const androidProviders = new Set();
			const servers = new OwnedMcpServers();
			const closeServers = async () => {
				const results = await servers.closeAll();
				const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (failures.length > 0) throw new AggregateError(failures, "REA server cleanup failed");
			};
			const closeAndroid = async () => {
				const results = await Promise.allSettled([...androidProviders].map(async (provider) => {
					await provider.close();
					androidProviders.delete(provider);
				}));
				const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (failures.length === 1) throw failures[0];
				if (failures.length > 1) throw new AggregateError(failures, "Android provider cleanup failed");
			};
			const optionalProvidersToClose = new Set(Object.values(observationProviders).filter((provider) => provider !== undefined));
			let optionalProviderClose;
			const closeOptionalProviders = async () => {
				optionalProviderClose ??= (async () => {
					const results = await Promise.allSettled([...optionalProvidersToClose].map(async (provider) => {
						await provider.close?.();
						optionalProvidersToClose.delete(provider);
					}));
					const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
					if (failures.length > 0) throw new AggregateError(failures, "Optional provider cleanup failed");
				})().catch((cause) => {
					optionalProviderClose = undefined;
					throw cause;
				});
				await optionalProviderClose;
			};
			let handle;
			try {
				if (serverContext.signal?.aborted) throw serverContext.signal.reason;
				handle = await dependencies.serve(() => servers.create(() => {
					const android = createAndroidAnalysisProvider(serverContext.environment, undefined, serverContext.analysisSettings?.read);
					androidProviders.add(android);
					const closeAndroidProvider = android.close.bind(android);
					android.close = async () => {
						await closeAndroidProvider();
						androidProviders.delete(android);
					};
					const server = (dependencies.createServer ?? createServer)({
						kind: "session",
						session
					}, {
						...serverContext.analysisSettings === undefined ? {} : { analysisSettings: serverContext.analysisSettings },
						logger: serverContext.logger,
						environment: serverContext.environment,
						delivery: serverContext.delivery,
						...optionalProviders,
						optionalObservationProviderOwner: "caller",
						androidAnalysis: android
					});
					return server;
				}), {
					onerror: (error) => reportMcpTransportError(error, serverLogger, dependencies.writeStderr),
					logger: serverLogger,
					...serverContext.signal === undefined ? {} : { signal: serverContext.signal }
				});
			} catch (cause) {
				const cancelled = serverContext.signal?.aborted === true && cause === serverContext.signal.reason;
				const [androidCleanup, serverCleanup, optionalProviderCleanup] = await Promise.allSettled([
					closeAndroid(),
					closeServers(),
					closeOptionalProviders()
				]);
				if (!cancelled) {
					const startFailure = cause instanceof StreamableHttpListenError ? cause.classification.ok && cause.classification.value.kind === "host_allowlist" ? cause.remediationAction : MCP_HTTP_LISTEN_FAILED : MCP_CONNECTION_START_FAILED;
					serverLogger.error({ error: cause instanceof Error ? cause.message : String(cause) }, startFailure);
					dependencies.writeStderr(`${startFailure}\n`);
				}
				for (const cleanup of [
					androidCleanup,
					serverCleanup,
					optionalProviderCleanup
				]) {
					if (cleanup.status === "rejected") {
						const reason = cleanup.reason instanceof Error ? cleanup.reason.message : String(cleanup.reason);
						serverLogger.error({ cleanup_error: reason }, "Provider cleanup rejected after MCP startup");
						dependencies.writeStderr(`Provider cleanup failed: ${reason}\n`);
					}
				}
				return {
					ok: false,
					cancelled,
					handle: { close: closeServers },
					closeAndroid,
					closeOptionalProviders
				};
			}
			return {
				ok: true,
				handle: {
					...handle.prepareShutdown === undefined ? {} : { prepareShutdown: handle.prepareShutdown },
					close: async () => {
						await handle.prepareShutdown?.();
						const results = await Promise.allSettled([handle.close(), closeServers()]);
						const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
						if (failures.length === 1) throw failures[0];
						if (failures.length > 1) throw new AggregateError(failures, "REA transport cleanup failed");
					}
				},
				closeAndroid,
				closeOptionalProviders
			};
		};
	})))();
}

//#endregion
//#region dist/composition/optionalObservationProviders.js
var createOptionalObservationFactories, loadPort, loadOptionalObservationProviders;
function init_optionalObservationProviders() {
	return (init_optionalObservationProviders = __esmMin((() => {
		init_snapshotEnvironment();
		init_providerIdentities();
		init_providerIdentity();
		init_result();
		createOptionalObservationFactories = (selectedEnvironment, settings) => {
			const environment = snapshotEnvironment(selectedEnvironment);
			let runtimeAdmission;
			let webBundleAdmission;
			return {
				browserObservation: async () => {
					const browser = await import("./browserObservation-CPDt-jYz.js");
					const { WebBundleAnalysisAdmission: Admission } = await import("./IsolatedWebBundleAnalyzer-dKQJ1kIK.js").then((n) => (n.r(), n.n));
					webBundleAdmission ??= new Admission();
					return browser.createBrowserObservationProvider(webBundleAdmission);
				},
				browserScenarioCapture: async () => (await import("./browserScenario-BVg24Gwr.js")).createBrowserScenarioProvider(environment),
				electronObservation: async () => (await import("./electronObservation-By3J_Cu5.js")).createElectronObservationProvider(environment, settings),
				electronActiveObservation: async () => (await import("./electronScenario-DOCyvgTB.js")).createElectronScenarioProvider(environment),
				javascriptRuntimeObservation: async () => {
					const runtime = await import("./javascriptRuntimeObservation-DB9pEssH.js");
					runtimeAdmission ??= new runtime.V8InspectorAdmission();
					return runtime.createJavaScriptRuntimeObservationProvider(environment, settings, runtimeAdmission);
				}
			};
		};
		loadPort = async (factory, providerId) => {
			try {
				return ok(await factory());
			} catch (cause) {
				return err({
					providerId,
					reason: cause instanceof Error ? cause.message : String(cause)
				});
			}
		};
		loadOptionalObservationProviders = async (factories) => {
			const [browser, scenario, electron, electronActive, runtime] = await Promise.all([
				loadPort(factories.browserObservation, CDP_BROWSER_PROVIDER_IDENTITY.id),
				loadPort(factories.browserScenarioCapture, PLAYWRIGHT_BROWSER_SCENARIO_PROVIDER_IDENTITY.id),
				loadPort(factories.electronObservation, CDP_ELECTRON_PROVIDER_IDENTITY.id),
				loadPort(factories.electronActiveObservation, PLAYWRIGHT_ELECTRON_ACTIVE_PROVIDER_IDENTITY.id),
				loadPort(factories.javascriptRuntimeObservation, V8_INSPECTOR_PROVIDER_IDENTITY.id)
			]);
			return {
				...browser.ok ? { browserObservation: browser.value } : {},
				...scenario.ok ? { browserScenarioCapture: scenario.value } : {},
				...electron.ok ? { electronObservation: electron.value } : {},
				...electronActive.ok ? { electronActiveObservation: electronActive.value } : {},
				...runtime.ok ? { javascriptRuntimeObservation: runtime.value } : {},
				optionalProviderLoadFailures: {
					...browser.ok ? {} : { browserObservation: browser.error },
					...scenario.ok ? {} : { browserScenarioCapture: scenario.error },
					...electron.ok ? {} : { electronObservation: electron.error },
					...electronActive.ok ? {} : { electronActiveObservation: electronActive.error },
					...runtime.ok ? {} : { javascriptRuntimeObservation: runtime.error }
				}
			};
		};
	})))();
}

//#endregion
//#region dist/main/StdioStartupInput.js
var ownStdioStartupInput;
function init_StdioStartupInput() {
	return (init_StdioStartupInput = __esmMin((() => {
		init_analysisErrorCore();
		ownStdioStartupInput = (input, stop) => {
			const chunks = [];
			let retainedBytes = 0;
			let tail;
			let tailBytes = 0;
			let handedOff = false;
			let closed = false;
			const detach = () => {
				input.off("data", onData);
				input.off("end", onEnd);
				input.off("close", onEnd);
				input.off("error", onError);
			};
			const onEnd = () => stop();
			const onError = (cause) => stop(new AnalysisOutputError("mcp_startup", "MCP stdin could not be read during startup.", {
				cause,
				userMessage: "MCP stdin could not be read during startup."
			}));
			const onData = (chunk) => {
				const incomingBytes = Buffer.isBuffer(chunk) ? chunk.byteLength : Buffer.byteLength(chunk);
				if (retainedBytes + incomingBytes > STDIO_DEFAULT_MAX_BUFFER_SIZE) {
					input.pause();
					detach();
					stop(new AnalysisResourceConstraintError("mcp_startup", "transport", "MCP input exceeded the stdio buffer capacity before startup completed.", {
						max_buffer_bytes: STDIO_DEFAULT_MAX_BUFFER_SIZE,
						retained_bytes: retainedBytes,
						incoming_bytes: incomingBytes
					}, { remediationAction: "Wait for the MCP server to finish startup before sending more requests. The stdio buffer capacity has no runtime override." }));
					return;
				}
				const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				let offset = 0;
				while (offset < bytes.byteLength) {
					tail ??= Buffer.allocUnsafe(Math.min(64 * 1024, STDIO_DEFAULT_MAX_BUFFER_SIZE - retainedBytes));
					const copied = Math.min(tail.byteLength - tailBytes, bytes.byteLength - offset);
					bytes.copy(tail, tailBytes, offset, offset + copied);
					offset += copied;
					retainedBytes += copied;
					tailBytes += copied;
					if (tailBytes === tail.byteLength) {
						chunks.push(tail);
						tail = undefined;
						tailBytes = 0;
					}
				}
			};
			input.on("data", onData);
			input.on("end", onEnd);
			input.on("close", onEnd);
			input.on("error", onError);
			if (input.readableEnded || input.destroyed) queueMicrotask(onEnd);
			return {
				handoff: () => {
					if (closed || handedOff) return;
					input.pause();
					detach();
					if (tail !== undefined && tailBytes > 0) chunks.push(tail.subarray(0, tailBytes));
					tail = undefined;
					tailBytes = 0;
					for (let index = chunks.length - 1; index >= 0; index -= 1) input.unshift(chunks[index]);
					chunks.length = 0;
					retainedBytes = 0;
					handedOff = true;
				},
				resume: () => {
					if (handedOff && !closed) input.resume();
				},
				close: () => {
					if (closed) return;
					closed = true;
					detach();
					chunks.length = 0;
					tail = undefined;
					tailBytes = 0;
					retainedBytes = 0;
					if (!handedOff) input.pause();
				}
			};
		};
	})))();
}

//#endregion
//#region dist/main/eagerRuntime.js
var runEager;
function init_eagerRuntime() {
	return (init_eagerRuntime = __esmMin((() => {
		init_AnalysisSettings();
		init_snapshotEnvironment();
		init_result();
		init_parseConfig();
		init_binary();
		init_logger();
		init_analysisErrorProjection();
		init_startup();
		init_transport();
		init_optionalObservationProviders();
		init_toolResult();
		init_shutdown();
		init_StdioStartupInput();
		runEager = async (dependencies, selectedConfig) => {
			const environment = snapshotEnvironment(dependencies.env);
			const config = selectedConfig === undefined ? parseConfig(environment) : ok(selectedConfig);
			if (!config.ok) {
				dependencies.writeStderr(`${projectAnalysisError(config.error).message}\n`);
				return 1;
			}
			const logger = createLogger("mcp", config.value.logLevel);
			const serverLogger = logger.child({ layer: "server" });
			const analysisSettings = new AnalysisSettings(environment);
			const session = createBinarySession(config.value, logger, environment, analysisSettings.read);
			const startup = new AbortController();
			let transport;
			let settleStartup;
			const startupSettled = new Promise((resolve) => {
				settleStartup = resolve;
			});
			let inputFailure;
			const shutdown = createShutdown({
				handle: {
					prepareShutdown: async () => {
						await startupSettled;
						await transport?.handle.prepareShutdown?.();
					},
					close: async () => {
						await transport?.handle.close();
					}
				},
				closeAndroid: async () => {
					await transport?.closeAndroid();
				},
				closeOptionalProviders: async () => {
					await transport?.closeOptionalProviders();
				},
				session,
				dependencies: {
					...dependencies,
					registerShutdown: (handler) => dependencies.registerShutdown(() => {
						startup.abort();
						handler();
					})
				},
				serverLogger
			});
			const startupInput = dependencies.transport !== "http" && dependencies.stdin !== undefined && !startup.signal.aborted ? ownStdioStartupInput(dependencies.stdin, (failure) => {
				inputFailure ??= failure;
				startup.abort(failure);
				shutdown.request();
			}) : undefined;
			dependencies.captureShutdown?.(async () => {
				startup.abort();
				await shutdown.shutdown();
			});
			let ready = false;
			let startupRejected = false;
			let startupCause;
			let exitCode = 0;
			try {
				const opened = await openInitialTarget(session, config.value, serverLogger, dependencies.writeStderr, startup.signal);
				if (!opened.ok) exitCode = opened.exitCode;
				else if (!startup.signal.aborted) {
					const started = await startMcpTransport({
						...dependencies,
						serve: async (factory, options) => {
							if (startup.signal.aborted) throw startup.signal.reason;
							startupInput?.handoff();
							const handle = await dependencies.serve(factory, options);
							if (!startup.signal.aborted) startupInput?.resume();
							return handle;
						}
					}, session, {
						logger,
						serverLogger,
						analysisSettings,
						environment,
						signal: startup.signal,
						delivery: createToolResultDelivery(config.value.mcpMaxResponseBytes),
						loadOptionalProviders: dependencies.loadOptionalProviders ?? (() => loadOptionalObservationProviders(createOptionalObservationFactories(environment, analysisSettings.read)))
					});
					transport = started;
					if (started.ok) ready = true;
					else exitCode = started.cancelled ? 0 : 1;
				}
			} catch (cause) {
				startupRejected = true;
				startupCause = cause;
			} finally {
				settleStartup();
				startupInput?.close();
			}
			if (startupRejected || !ready || startup.signal.aborted) {
				if (inputFailure !== undefined) dependencies.writeStderr(`${projectAnalysisError(inputFailure).message}\n`);
				try {
					await shutdown.shutdown();
				} catch (cause) {
					reportMcpShutdownFailure(cause, dependencies, serverLogger);
					return 1;
				}
				if (inputFailure !== undefined) return 1;
				if (startupRejected) throw startupCause;
			}
			return exitCode;
		};
	})))();
}

//#endregion
init_eagerRuntime();
export { runEager };