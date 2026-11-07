import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { BrowserObservationError, ProviderAdapterError, err, init_browserObservationError, init_providerAdapterError, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisCancelledError, AnalysisError, init_analysisErrorBase, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { compareUnicodeCodePoints, compositeKey, digestCanonicalValue, electronPageInspectionSchema, electronTargetListSchema, init_browserDeadline, init_canonicalDigest, init_electronObservation as init_electronObservation$1, init_jsonValueByteLength, init_unicodeCodePointOrder, jsonValueByteLength, selectedCdpCommandTimeoutMs } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-_0sxoDuW.js";
import { ProviderCleanupError, init_providerCleanupError } from "./providerCleanupError-7gv3MO0l.js";
import { init_runtimeAnalysisSettings, runtimeAsarHeaderAdmission } from "./runtimeAnalysisSettings-DDmP_Pn7.js";
import { DEFAULT_ASAR_HEADER_ADMISSION, init_asarHeaderAdmission } from "./asarHeaderAdmission-CX-emtPE.js";
import { CdpTargetSessionOwner, bindCdpTransportCleanup, cdpStringValue, closeCdpTargetSession, delayWithCancellation, discoverCdpEndpoint, hasCdpTargetWebSocket, init_CdpCaptureValues, init_CdpDiscoveryTargets, init_CdpEndpoint, init_CdpScriptContextFacts, init_CdpTargetSession, init_CdpTargetSessionOwner, openCdpTargetSession, readCdpExecutionContextCreated, readCdpExecutionContextDestroyed, readCdpScriptParsed, recordValue, recordsValue, requiredRecord, resourceContentSize, selectCdpDiscoveryTarget, selectCdpScriptFrame } from "./CdpScriptContextFacts-CaXhFtFa.js";
import { CDP_CAPTURE_SCRIPT_METADATA_LIMITS, CdpCaptureCompleteness, CdpScriptSourceBudget, authorizedElectronFile, capturePassiveCdpScriptSource, cdpFrameEventFacts, cdpFrameRecordFacts, cdpFrameUrl, cdpSnapshotString, frameTreeResources, init_CdpCaptureCompleteness, init_CdpCaptureDocuments, init_CdpCaptureEventTypes, init_CdpFrameIdentity, init_CdpOptionalCommand, init_CdpScriptSourceBudget, init_CdpScriptSourceCapture, init_CdpSnapshotNodes, init_CdpSnapshotStrings, init_CdpWorkerTarget, init_ElectronFileScope, mapElectronFileAuthorizationFailure, optionalCdpCommand, parseCdpWorkerTarget, retryElectronFileCleanup, snapshotDocumentNodes, snapshotDocuments, snapshotNodeAt, walkFrameTrees, workerTargetOwnership } from "./ElectronFileScope-aSSkZhZ3.js";
import { CDP_ELECTRON_PROVIDER_IDENTITY, init_providerIdentities } from "./providerIdentities-Ao1XTvwx.js";

//#region dist/browser/CdpElectronScriptEvents.js
var ingestElectronScriptEvent, retainExecutionContext;
function init_CdpElectronScriptEvents() {
	return (init_CdpElectronScriptEvents = __esmMin((() => {
		init_CdpScriptContextFacts();
		init_jsonValueByteLength();
		init_CdpCaptureEventTypes();
		init_CdpCaptureCompleteness();
		ingestElectronScriptEvent = (input) => {
			if (input.event.method === "Runtime.executionContextsCleared") {
				input.executionContextFrames.clear();
				return;
			}
			if (input.event.method === "Runtime.executionContextDestroyed") {
				const key = readCdpExecutionContextDestroyed(input.event.params).contextKey;
				if (key !== null) input.executionContextFrames.delete(key);
				return;
			}
			if (input.event.method === "Runtime.executionContextCreated") {
				retainExecutionContext(input.event, input.executionContextFrames);
				return;
			}
			if (input.event.method !== "Debugger.scriptParsed") return;
			const facts = readCdpScriptParsed(input.event.params);
			const scriptId = facts.scriptId;
			const rawUrl = facts.url;
			if (scriptId === undefined || scriptId === "") {
				input.completeness.exclude("scripts", "invalid_protocol_value");
				return;
			}
			if (rawUrl === undefined || rawUrl === "") {
				input.completeness.exclude("scripts", "unattributed_origin");
				return;
			}
			const contextFrame = facts.contextKey === null ? undefined : input.executionContextFrames.get(facts.contextKey);
			const attribution = selectCdpScriptFrame(facts.frameClaim, contextFrame);
			if (attribution.invalid || attribution.conflicting || facts.invalidHasSourceUrl) input.completeness.exclude("scripts", "invalid_protocol_value");
			const reportedFrame = facts.frameClaim.frameId;
			const script = {
				scriptId,
				rawUrl,
				...facts.metadata,
				frameId: attribution.frameId,
				frameClaims: {
					...reportedFrame === undefined ? {} : { script_event_frame_id: reportedFrame },
					...contextFrame?.frameId === undefined ? {} : { execution_context_frame_id: contextFrame.frameId }
				},
				hasSourceUrl: facts.hasSourceUrl
			};
			const remaining = CDP_CAPTURE_SCRIPT_METADATA_LIMITS.retainedBytes - input.retention.bytes;
			const bytes = jsonValueByteLength({ ...script }, remaining) + (input.scripts.length > 0 ? 1 : 0);
			if (bytes > remaining) {
				input.completeness.exclude("scripts", "resource_budget_exhausted");
				return;
			}
			input.retention.bytes += bytes;
			input.scripts.push(script);
		};
		retainExecutionContext = (event, frames) => {
			const facts = readCdpExecutionContextCreated(event.params);
			if (facts.contextKey === null) return;
			frames.set(facts.contextKey, facts.frameClaim);
		};
	})))();
}

//#endregion
//#region dist/browser/CdpElectronScripts.js
var captureElectronScripts, throwIfCallerCancelled;
function init_CdpElectronScripts() {
	return (init_CdpElectronScripts = __esmMin((() => {
		init_canonicalDigest();
		init_CdpCaptureCompleteness();
		init_CdpScriptSourceCapture();
		init_jsonValueByteLength();
		init_CdpCaptureEventTypes();
		init_ElectronFileScope();
		init_unicodeCodePointOrder();
		init_analysisErrorCore();
		init_browserDeadline();
		init_CdpScriptSourceBudget();
		captureElectronScripts = async (input) => {
			let total = 0;
			const items = [];
			const seen = new Set();
			let metadataBytes = 2;
			const commandTimeoutMs = selectedCdpCommandTimeoutMs(input.request.command_timeout_ms);
			const sourceBudget = input.request.include_script_sources && input.scripts.length > 0 ? new CdpScriptSourceBudget(input.signal, commandTimeoutMs) : undefined;
			try {
				for (const script of input.scripts) {
					throwIfCallerCancelled(input.signal);
					const frame = input.frameScopeForScript(script);
					if (frame.state === "excluded") {
						input.completeness.exclude("scripts", "out_of_target_scope");
						continue;
					}
					const path = await authorizedElectronFile(script.rawUrl, input.signal, "inspect_electron_page", input.asarHeaderAdmission);
					if (path === undefined) {
						input.completeness.exclude("scripts", "out_of_target_scope");
						continue;
					}
					if (frame.state === "unknown") input.completeness.attachLimited("scripts");
					const identity = {
						frame_id: frame.frameId,
						frame_scope: frame.state,
						frame_claims: script.frameClaims,
						file_path: path,
						reported_url: script.rawUrl,
						has_source_url: script.hasSourceUrl,
						cdp_hash: script.hash,
						length: script.length,
						is_module: script.isModule,
						language: script.language
					};
					const remaining = CDP_CAPTURE_SCRIPT_METADATA_LIMITS.retainedBytes - metadataBytes;
					const retainedBytes = jsonValueByteLength({
						script_key: `electron_script_${"0".repeat(64)}`,
						...identity
					}, remaining) + (items.length > 0 ? 1 : 0);
					if (retainedBytes > remaining) {
						input.completeness.exclude("scripts", "resource_budget_exhausted");
						continue;
					}
					const scriptKey = `electron_script_${digestCanonicalValue(identity, "CDP capture")}`;
					if (seen.has(scriptKey)) continue;
					seen.add(scriptKey);
					metadataBytes += retainedBytes;
					total += 1;
					const source = sourceBudget === undefined ? {
						included: false,
						reason: "source capture was not selected"
					} : await capturePassiveCdpScriptSource({
						connection: input.connection,
						sessionId: input.sessionId,
						signal: input.signal,
						operation: "inspect_electron_page",
						scriptId: script.scriptId,
						sourceBudget,
						completeness: input.completeness
					});
					items.push({
						script_key: scriptKey,
						...identity,
						source
					});
				}
			} finally {
				sourceBudget?.dispose();
			}
			if (!input.request.include_script_sources) input.completeness.exclude("script_sources", "not_approved", total);
			return {
				total,
				items: items.sort((left, right) => compareUnicodeCodePoints(left.script_key, right.script_key))
			};
		};
		throwIfCallerCancelled = (signal) => {
			if (signal?.aborted === true) throw new AnalysisCancelledError("inspect_electron_page", { cause: signal.reason });
		};
	})))();
}

//#endregion
//#region dist/browser/CdpElectronWorkers.js
var captureElectronWorkers, throwIfElectronWorkerCaptureCancelled;
function init_CdpElectronWorkers() {
	return (init_CdpElectronWorkers = __esmMin((() => {
		init_CdpCaptureCompleteness();
		init_CdpCaptureValues();
		init_CdpOptionalCommand();
		init_ElectronFileScope();
		init_unicodeCodePointOrder();
		init_analysisErrorCore();
		init_CdpWorkerTarget();
		captureElectronWorkers = async (input) => {
			const result = await optionalCdpCommand({
				connection: input.connection,
				sessionId: undefined,
				...input.signal === undefined ? {} : { signal: input.signal }
			}, "Target.getTargets", {}, input.limitations);
			if (result === undefined) {
				input.completeness.unavailable("workers");
				return [];
			}
			const workers = [];
			const targetInfos = recordValue(result)?.targetInfos;
			if (!Array.isArray(targetInfos)) {
				input.completeness.exclude("workers", "invalid_protocol_value", null);
				return [];
			}
			for (const entry of targetInfos) {
				throwIfElectronWorkerCaptureCancelled(input.signal);
				const parsed = parseCdpWorkerTarget(entry);
				if (!parsed.ok) {
					input.completeness.exclude("workers", "invalid_protocol_value");
					continue;
				}
				const target = parsed.value;
				if (target.kind === "non_worker") continue;
				const ownership = workerTargetOwnership(target, input.target.id, input.frameIds);
				if (ownership !== "selected") {
					input.completeness.exclude("workers", ownership === "unknown" ? "unattributed_target" : "out_of_target_scope");
					continue;
				}
				const path = await authorizedElectronFile(target.url, input.signal, "inspect_electron_page", input.asarHeaderAdmission);
				if (path === undefined) {
					input.completeness.exclude("workers", "out_of_target_scope");
					continue;
				}
				workers.push({
					target_id: target.targetId,
					type: target.type,
					file_path: path,
					attached: target.attached,
					opener_target_id: target.openerTargetId,
					parent_frame_id: target.parentFrameId
				});
			}
			return workers.sort((left, right) => compareUnicodeCodePoints(left.target_id, right.target_id));
		};
		throwIfElectronWorkerCaptureCancelled = (signal) => {
			if (signal?.aborted === true) throw new AnalysisCancelledError("inspect_electron_page", { cause: signal.reason });
		};
	})))();
}

//#endregion
//#region dist/browser/CdpElectronInspection.js
var inspectCdpElectronPage, runElectronInspection, frameInventoryIdentity, authorizeFrameGenerations, unprovenFrameIds, advanceFrameGeneration, sameFrameDocument, retainFrameDocument, invalidateFrameGenerations, frameDocument, seedFrameDocuments, authorizeInitialFrames, readCurrentFrames, markUnstableFrameRead, enableElectronCapture, captureElectronContent, assertStableMainFrame, captureFrames, captureResources, captureDom, mainFilePath, throwIfElectronInspectionCancelled, report;
function init_CdpElectronInspection() {
	return (init_CdpElectronInspection = __esmMin((() => {
		init_canonicalDigest();
		init_browserObservationError();
		init_analysisErrorCore();
		init_CdpCaptureCompleteness();
		init_CdpCaptureValues();
		init_CdpCaptureDocuments();
		init_CdpFrameIdentity();
		init_CdpSnapshotNodes();
		init_CdpSnapshotStrings();
		init_CdpElectronScriptEvents();
		init_CdpElectronScripts();
		init_CdpElectronWorkers();
		init_ElectronFileScope();
		init_unicodeCodePointOrder();
		inspectCdpElectronPage = async (context) => {
			const state = {
				completeness: new CdpCaptureCompleteness(),
				scripts: [],
				scriptMetadataRetention: { bytes: 2 },
				executionContextFrames: new Map(),
				frameGenerations: new Map(),
				frameParents: new Map(),
				frameDocuments: new Map(),
				authorizedFrameGenerations: new Set(),
				excludedFrameGenerations: new Set(),
				scriptGenerations: new WeakMap(),
				limitations: [
					...context.discovery.limitations ?? [],
					"Local file paths exposed by the selected CDP target are retained in the observation.",
					"REA does not evaluate renderer JavaScript, invoke Electron APIs, navigate, click, or close the page.",
					"Select include_script_sources to retain script contents.",
					"Script file_path is the admitted local-file URL or sourceURL label, not a verification that disk bytes supplied the runtime code. has_source_url retains CDP's sourceURL declaration flag; null or an omitted historical field is unknown.",
					"Known script frame identity is retained independently from frame_scope authorization. Unknown frame scope is attach-limited; scripts from known excluded document generations are omitted before source reads.",
					...context.target.attached === null ? ["CDP discovery could not establish the target's debugger attachment state."] : []
				],
				mainFrameId: undefined,
				navigationDuringCapture: false
			};
			const removeListener = context.connection.onEvent((event) => {
				if (event.sessionId !== context.sessionId) return;
				advanceFrameGeneration(event, state);
				const priorScripts = state.scripts.length;
				ingestElectronScriptEvent({
					event,
					scripts: state.scripts,
					executionContextFrames: state.executionContextFrames,
					completeness: state.completeness,
					retention: state.scriptMetadataRetention
				});
				const script = state.scripts[priorScripts];
				if (script?.frameId != null) state.scriptGenerations.set(script, state.frameGenerations.get(script.frameId) ?? 0);
			});
			try {
				return await runElectronInspection(context, state, new Date().toISOString());
			} finally {
				removeListener();
			}
		};
		runElectronInspection = async (context, state, startedAt) => {
			const initialRead = await authorizeInitialFrames(context, state);
			const initialFrames = initialRead.frames;
			const main = initialFrames.at(0);
			if (main === undefined) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			if (unprovenFrameIds(initialRead, state).has(main.frame_id)) throw new BrowserObservationError("inspect_web_page", "target_changed");
			state.mainFrameId = main.frame_id;
			authorizeFrameGenerations(initialRead, state);
			await enableElectronCapture(context);
			await delayWithCancellation(context.input.observation_ms, "inspect_electron_page", context.signal);
			const currentRead = await readCurrentFrames(context, state, state.completeness);
			const frames = currentRead.frames;
			authorizeFrameGenerations(currentRead, state);
			if (frameInventoryIdentity(initialFrames) !== frameInventoryIdentity(frames)) {
				state.limitations.push("The frame inventory changed during observation. Returned frames describe the current inventory; retained script frame IDs can identify earlier authorized frames.");
			}
			const captured = await captureElectronContent(context, state, frames);
			const finalFrames = await assertStableMainFrame(context, state, main.file_path);
			if (frameInventoryIdentity(frames) !== frameInventoryIdentity(finalFrames)) {
				for (const section of [
					"frames",
					"scripts",
					"workers"
				]) state.completeness.attachLimited(section);
				state.limitations.push("The frame inventory changed during content capture; frame membership and dependent attribution are incomplete.");
			}
			await report(context.progress, 3, "Electron inspection complete");
			if (state.navigationDuringCapture) throw new BrowserObservationError("inspect_web_page", "target_changed");
			return {
				browser: context.discovery.version,
				target: {
					target_id: context.target.id,
					type: context.target.type,
					title: context.target.title,
					file_path: main.file_path,
					attached: context.target.attached
				},
				capture_window: {
					started_at: startedAt,
					ended_at: new Date().toISOString(),
					observation_ms: context.input.observation_ms
				},
				completeness: state.completeness.snapshot(),
				frames,
				...captured,
				limitations: state.limitations
			};
		};
		frameInventoryIdentity = (frames) => digestCanonicalValue(frames.map((frame) => compositeKey([
			frame.frame_id,
			frame.parent_frame_id,
			frame.file_path
		])).sort(compareUnicodeCodePoints));
		authorizeFrameGenerations = (read, state) => {
			const unproven = markUnstableFrameRead(read, state);
			for (const [id, parent] of read.parents) if (!unproven.has(id)) state.frameParents.set(id, parent);
			for (const frame of read.frames) {
				const generation = read.generations.get(frame.frame_id) ?? 0;
				if (unproven.has(frame.frame_id)) continue;
				state.authorizedFrameGenerations.add(compositeKey([frame.frame_id, generation]));
			}
			for (const id of read.excludedFrameIds) if (!unproven.has(id)) state.excludedFrameGenerations.add(compositeKey([id, read.generations.get(id) ?? 0]));
		};
		unprovenFrameIds = (read, state) => {
			const children = new Map();
			const unproven = new Set();
			for (const [id, parent] of read.parents) {
				if ((read.generations.get(id) ?? 0) !== (state.frameGenerations.get(id) ?? 0)) unproven.add(id);
				if (parent === null) continue;
				if (!read.parents.has(parent)) unproven.add(id);
				const siblings = children.get(parent) ?? [];
				siblings.push(id);
				children.set(parent, siblings);
			}
			const pending = [...unproven];
			while (pending.length > 0) {
				const parent = pending.pop();
				if (parent === undefined) continue;
				for (const child of children.get(parent) ?? []) {
					if (unproven.has(child)) continue;
					unproven.add(child);
					pending.push(child);
				}
			}
			return unproven;
		};
		advanceFrameGeneration = (event, state) => {
			const facts = cdpFrameEventFacts(event);
			if (event.method === "Page.navigatedWithinDocument") {
				const id = facts.frameId;
				if (id === null) return;
				if (id === state.mainFrameId) state.navigationDuringCapture = true;
				const previous = state.frameDocuments.get(id);
				if (previous === undefined) return;
				const url = cdpFrameUrl(facts.source);
				if (url === undefined || url === "") state.frameDocuments.delete(id);
				else state.frameDocuments.set(id, {
					...previous,
					url
				});
				return;
			}
			if (![
				"Page.frameNavigated",
				"Page.frameDetached",
				"Page.frameAttached"
			].includes(event.method)) return;
			const id = facts.frameId;
			if (id === null) return;
			const document = facts.kind === "navigated" ? frameDocument(facts) : undefined;
			const previous = state.frameDocuments.get(id);
			if (document !== undefined && previous !== undefined && sameFrameDocument(document, previous) && document.url === previous.url) return;
			invalidateFrameGenerations(id, state);
			const parent = facts.parentId;
			if (facts.parentRelation === "child" && parent !== null) state.frameParents.set(id, parent);
			else state.frameParents.delete(id);
			if (document !== undefined) retainFrameDocument(id, document, state);
		};
		sameFrameDocument = (left, right) => left.loaderId === right.loaderId && left.parentId === right.parentId;
		retainFrameDocument = (id, document, state) => {
			const previous = state.frameDocuments.get(id);
			if (previous !== undefined && sameFrameDocument(previous, document) && previous.url === document.url) return;
			if (id === state.mainFrameId && previous !== undefined && previous.url !== document.url) state.navigationDuringCapture = true;
			state.frameDocuments.set(id, document);
		};
		invalidateFrameGenerations = (id, state) => {
			const pending = [id];
			const changed = new Set();
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined || changed.has(current)) continue;
				changed.add(current);
				if (current === state.mainFrameId) state.navigationDuringCapture = true;
				state.frameGenerations.set(current, (state.frameGenerations.get(current) ?? 0) + 1);
				state.frameDocuments.delete(current);
				for (const [child, parent] of state.frameParents) if (parent === current) pending.push(child);
			}
		};
		frameDocument = (facts) => {
			const url = cdpFrameUrl(facts.source);
			if (url === undefined || url === "" || facts.loaderId === undefined || facts.loaderId === "" || facts.loaderIssue !== null || facts.parentRelation !== "root" && facts.parentRelation !== "child") return undefined;
			return {
				url,
				loaderId: facts.loaderId,
				parentId: facts.parentId
			};
		};
		seedFrameDocuments = (result, generations, documents, state) => {
			const tree = recordValue(recordValue(result)?.frameTree);
			if (tree === undefined) return;
			for (const entry of walkFrameTrees(tree)) {
				const facts = cdpFrameRecordFacts(recordValue(entry.frame));
				const id = facts.frameId;
				const document = frameDocument(facts);
				if (id !== null && document !== undefined && state.frameDocuments.get(id) === documents.get(id) && (generations.get(id) ?? 0) === (state.frameGenerations.get(id) ?? 0)) {
					const previous = documents.get(id);
					if (previous !== undefined && !sameFrameDocument(previous, document)) invalidateFrameGenerations(id, state);
					retainFrameDocument(id, document, state);
				}
			}
		};
		authorizeInitialFrames = async (context, state) => {
			await report(context.progress, 1, "Authorizing Electron file frames");
			await context.connection.send("Page.enable", {}, context.sessionId, context.signal);
			return await readCurrentFrames(context, state, new CdpCaptureCompleteness());
		};
		readCurrentFrames = async (context, state, completeness) => {
			const generations = new Map(state.frameGenerations);
			const documents = new Map(state.frameDocuments);
			const result = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			seedFrameDocuments(result, generations, documents, state);
			const inventory = await captureFrames(result, completeness, context.asarHeaderAdmission, context.signal);
			const main = inventory.frames[0];
			if (main === undefined || inventory.parents.get(main.frame_id) !== null) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			return {
				...inventory,
				generations
			};
		};
		markUnstableFrameRead = (read, state) => {
			const unproven = unprovenFrameIds(read, state);
			if (unproven.size === 0) return unproven;
			for (const section of [
				"frames",
				"scripts",
				"workers"
			]) state.completeness.attachLimited(section);
			state.limitations.push("A frame or its ancestry could not be verified across the tree read and local file checks; this read cannot authorize an unchecked document.");
			return unproven;
		};
		enableElectronCapture = async (context) => {
			await context.connection.send("Runtime.enable", {}, context.sessionId, context.signal);
			await context.connection.send("Debugger.enable", {}, context.sessionId, context.signal);
		};
		captureElectronContent = async (context, state, frames) => {
			await report(context.progress, 2, "Capturing Electron structure");
			const frameIds = new Set(frames.map((frame) => frame.frame_id));
			const resources = await captureResources(context, state.completeness);
			const dom = await captureDom(context, state.completeness);
			const scripts = await captureElectronScripts({
				connection: context.connection,
				sessionId: context.sessionId,
				...context.signal === undefined ? {} : { signal: context.signal },
				request: context.input,
				scripts: state.scripts,
				frameScopeForScript: (script) => {
					const generation = state.scriptGenerations.get(script);
					if (script.frameId !== null && generation !== undefined) {
						const key = compositeKey([script.frameId, generation]);
						if (state.excludedFrameGenerations.has(key)) return { state: "excluded" };
						if (state.authorizedFrameGenerations.has(key)) return {
							state: "authorized",
							frameId: script.frameId
						};
					}
					return {
						state: "unknown",
						frameId: script.frameId
					};
				},
				completeness: state.completeness,
				asarHeaderAdmission: context.asarHeaderAdmission
			});
			const workers = await captureElectronWorkers({
				connection: context.connection,
				...context.signal === undefined ? {} : { signal: context.signal },
				target: context.target,
				request: context.input,
				frameIds,
				completeness: state.completeness,
				limitations: state.limitations,
				asarHeaderAdmission: context.asarHeaderAdmission
			});
			return {
				dom,
				scripts,
				resources,
				workers
			};
		};
		assertStableMainFrame = async (context, state, expectedPath) => {
			const generations = new Map(state.frameGenerations);
			const documents = new Map(state.frameDocuments);
			const result = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			seedFrameDocuments(result, generations, documents, state);
			const afterPath = await mainFilePath(result, context.asarHeaderAdmission, context.signal);
			if (afterPath === undefined) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			if (state.navigationDuringCapture || afterPath !== expectedPath) throw new BrowserObservationError("inspect_web_page", "target_changed");
			const completeness = new CdpCaptureCompleteness();
			const inventory = await captureFrames(result, completeness, context.asarHeaderAdmission, context.signal);
			const { frames } = inventory;
			if (state.navigationDuringCapture || state.mainFrameId !== undefined && (generations.get(state.mainFrameId) ?? 0) !== (state.frameGenerations.get(state.mainFrameId) ?? 0)) throw new BrowserObservationError("inspect_web_page", "target_changed");
			markUnstableFrameRead({
				...inventory,
				generations
			}, state);
			if (completeness.snapshot().conditions.some((condition) => condition !== "complete_within_window")) {
				for (const section of [
					"frames",
					"scripts",
					"workers"
				]) state.completeness.attachLimited(section);
				state.limitations.push("The final frame inventory was incomplete; frame stability could not be fully verified.");
			}
			return frames;
		};
		captureFrames = async (result, completeness, asarHeaderAdmission, signal) => {
			const frameTree = recordValue(requiredRecord(result).frameTree);
			if (frameTree === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			const frames = [];
			const enclosingParents = new Map();
			const parents = new Map();
			const excludedFrameIds = new Set();
			for (const tree of walkFrameTrees(frameTree, (count) => completeness.exclude("frames", "invalid_protocol_value", count))) {
				throwIfElectronInspectionCancelled(signal);
				const frame = recordValue(tree.frame);
				const facts = cdpFrameRecordFacts(frame);
				const frameId = facts.frameId;
				const parentId = facts.parentId;
				const ancestryKnown = tree === frameTree ? facts.parentRelation === "root" : facts.parentRelation === "child" && parentId !== null && parentId === enclosingParents.get(tree);
				if (frame === undefined || frameId === null || !ancestryKnown) {
					completeness.exclude("frames", "invalid_protocol_value");
					continue;
				}
				parents.set(frameId, parentId ?? null);
				for (const child of recordsValue(tree.childFrames)) enclosingParents.set(child, frameId);
				const path = await authorizedElectronFile(cdpStringValue(frame.url) ?? "", signal, "inspect_electron_page", asarHeaderAdmission);
				if (path === undefined) {
					completeness.exclude("frames", "out_of_target_scope");
					excludedFrameIds.add(frameId);
					continue;
				}
				frames.push({
					frame_id: frameId,
					parent_frame_id: parentId ?? null,
					file_path: path
				});
			}
			return {
				frames,
				parents,
				excludedFrameIds
			};
		};
		captureResources = async (context, completeness) => {
			const result = await context.connection.send("Page.getResourceTree", {}, context.sessionId, context.signal);
			const root = recordValue(requiredRecord(result).frameTree);
			if (root === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			const resources = [];
			const seen = new Set();
			for (const resource of frameTreeResources(root, (count) => completeness.exclude("resources", "invalid_protocol_value", count))) {
				throwIfElectronInspectionCancelled(context.signal);
				const path = await authorizedElectronFile(cdpStringValue(resource.url) ?? "", context.signal, "inspect_electron_page", context.asarHeaderAdmission);
				if (path === undefined) {
					completeness.exclude("resources", "out_of_target_scope");
					continue;
				}
				const contentSize = resourceContentSize(resource.contentSize);
				if (!contentSize.ok) completeness.exclude("resources", "invalid_protocol_value");
				const item = {
					file_path: path,
					type: cdpStringValue(resource.type) ?? "Other",
					mime_type: cdpStringValue(resource.mimeType) ?? "",
					content_size: contentSize.ok ? contentSize.value : null
				};
				const resourceKey = `electron_resource_${digestCanonicalValue(item, "CDP capture")}`;
				if (seen.has(resourceKey)) continue;
				seen.add(resourceKey);
				resources.push({
					resource_key: resourceKey,
					...item
				});
			}
			return resources.sort((left, right) => compareUnicodeCodePoints(left.resource_key, right.resource_key));
		};
		captureDom = async (context, completeness) => {
			const nodeValueLengthUnit = "utf8-bytes";
			const result = requiredRecord(await context.connection.send("DOMSnapshot.captureSnapshot", {
				computedStyles: [],
				includePaintOrder: false,
				includeDOMRects: false
			}, context.sessionId, context.signal));
			const invalid = (count) => completeness.exclude("dom", "invalid_protocol_value", count);
			if (!Array.isArray(result.strings)) {
				invalid(null);
				return {
					total_nodes: 0,
					node_value_length_unit: nodeValueLengthUnit,
					nodes: []
				};
			}
			const strings = result.strings.map(cdpStringValue);
			const nodes = [];
			let total = 0;
			for (const document of snapshotDocuments(result.documents, invalid)) {
				throwIfElectronInspectionCancelled(context.signal);
				const documentUrl = cdpSnapshotString(strings, document.documentURL);
				if (documentUrl === undefined) {
					invalid(1);
					continue;
				}
				if (await authorizedElectronFile(documentUrl, context.signal, "inspect_electron_page", context.asarHeaderAdmission) === undefined) {
					completeness.exclude("dom", "out_of_target_scope");
					continue;
				}
				const documentNodes = snapshotDocumentNodes(document.nodes, strings);
				if (documentNodes === undefined) {
					invalid(1);
					continue;
				}
				if (documentNodes.excessAttributes > 0) invalid(documentNodes.excessAttributes);
				const baseIndex = total;
				total += documentNodes.nodeTypes.length;
				for (let index = 0; index < documentNodes.nodeTypes.length; index += 1) {
					const admitted = snapshotNodeAt(documentNodes, index);
					if (!admitted.ok) {
						invalid(1);
						continue;
					}
					const { nodeType, nodeName, nodeValue, parent, attributes } = admitted.value;
					nodes.push({
						index: baseIndex + index,
						parent_index: parent < 0 ? -1 : baseIndex + parent,
						node_type: nodeType,
						node_name: nodeName,
						node_value_length: Buffer.byteLength(nodeValue),
						attribute_names: attributes.map(([name]) => name)
					});
				}
			}
			return {
				total_nodes: total,
				node_value_length_unit: nodeValueLengthUnit,
				nodes
			};
		};
		mainFilePath = async (result, asarHeaderAdmission, signal) => {
			const frameTree = recordValue(requiredRecord(result).frameTree);
			const frame = recordValue(frameTree?.frame);
			return await authorizedElectronFile(cdpStringValue(frame?.url) ?? "", signal, "inspect_electron_page", asarHeaderAdmission);
		};
		throwIfElectronInspectionCancelled = (signal) => {
			if (signal?.aborted === true) throw new AnalysisCancelledError("inspect_electron_page", { cause: signal.reason });
		};
		report = async (progress, completed, message) => await progress?.report({
			phase: "browser_observation",
			completed,
			total: 3,
			message,
			...completed === 3 ? { terminal: true } : {}
		});
	})))();
}

//#endregion
//#region dist/browser/CdpElectronProvider.js
var CdpElectronProvider, authorizeTarget, throwIfElectronOperationCancelled, providerError;
function init_CdpElectronProvider() {
	return (init_CdpElectronProvider = __esmMin((() => {
		init_CdpDiscoveryTargets();
		init_asarHeaderAdmission();
		init_electronObservation$1();
		init_browserDeadline();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_browserObservationError();
		init_providerAdapterError();
		init_result();
		init_CdpEndpoint();
		init_CdpTargetSession();
		init_CdpElectronInspection();
		init_ElectronFileScope();
		init_providerIdentities();
		init_unicodeCodePointOrder();
		init_analysisErrorCleanup();
		init_providerCleanupError();
		init_CdpTargetSessionOwner();
		CdpElectronProvider = class {
			#owner = new CdpTargetSessionOwner();
			#asarHeaderAdmission;
			/** The admission comes from the composition root's environment; default otherwise. */
			constructor(asarHeaderAdmission = DEFAULT_ASAR_HEADER_ADMISSION) {
				this.#asarHeaderAdmission = asarHeaderAdmission;
			}
			#activeOperations = 0;
			#closing = false;
			#closePromise;
			#idleWaiters = new Set();
			async close() {
				if (this.#closePromise === undefined) {
					this.#closing = true;
					const attempt = this.#closeAfterOperations();
					let tracked;
					tracked = attempt.catch((cause) => {
						if (this.#closePromise === tracked) this.#closePromise = undefined;
						throw cause;
					});
					this.#closePromise = tracked;
				}
				await this.#closePromise;
			}
			async #closeAfterOperations() {
				while (this.#activeOperations > 0) await new Promise((resolve) => this.#idleWaiters.add(resolve));
				const outcomes = await Promise.allSettled([this.#owner.close(), retryElectronFileCleanup()]);
				const failures = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
				const mapped = failures.map((failure) => mapElectronFileAuthorizationFailure(failure, CDP_ELECTRON_PROVIDER_IDENTITY.id, "inspect_electron_page") ?? failure);
				if (mapped.length === 1) throw mapped[0];
				if (mapped.length > 1) {
					const typed = mapped.filter((failure) => failure instanceof AnalysisError);
					throw new ProviderCleanupError(CDP_ELECTRON_PROVIDER_IDENTITY.id, typed.flatMap((failure) => failure.cleanupResources), { reason: "Electron transport and file cleanup remain incomplete" }, {
						operation: "inspect_electron_page",
						cause: new AggregateError(mapped)
					}).bindCleanupDependencies(typed);
				}
			}
			identity() {
				return CDP_ELECTRON_PROVIDER_IDENTITY;
			}
			async listTargets(input, options = {}) {
				return await this.#withAdmission("list_electron_targets", async () => await this.#listTargets(input, options));
			}
			async #listTargets(input, options) {
				const allowed = [];
				let discovery;
				let unsupportedUrl = 0;
				let nonPage = 0;
				let unconnectable = 0;
				let examined = 0;
				try {
					discovery = await discoverCdpEndpoint(input.cdp_endpoint, "list_electron_targets", options.signal);
					throwIfElectronOperationCancelled(options.signal, "list_electron_targets");
					for (const target of discovery.targets) {
						throwIfElectronOperationCancelled(options.signal, "list_electron_targets");
						if (target.type !== "page") {
							examined += 1;
							nonPage += 1;
							continue;
						}
						const path = await authorizedElectronFile(target.url, options.signal, "list_electron_targets", this.#asarHeaderAdmission);
						if (path === undefined) {
							examined += 1;
							unsupportedUrl += 1;
							continue;
						}
						if (!hasCdpTargetWebSocket(discovery, target)) {
							examined += 1;
							unconnectable += 1;
							continue;
						}
						examined += 1;
						allowed.push({
							target_id: target.id,
							type: target.type,
							title: target.title,
							file_path: path,
							attached: target.attached
						});
					}
					allowed.sort((left, right) => compareUnicodeCodePoints(left.target_id, right.target_id));
					throwIfElectronOperationCancelled(options.signal, "list_electron_targets");
					return ok(electronTargetListSchema.parse({
						browser: discovery.version,
						targets: allowed,
						excluded: {
							unsupported_url: unsupportedUrl,
							non_page: nonPage
						},
						limitations: [
							...discovery.limitations ?? [],
							"Every local file page exposed by the selected loopback CDP endpoint is eligible for listing.",
							...unconnectable === 0 ? [] : [`${String(unconnectable)} otherwise allowed page target(s) lacked a validated direct CDP WebSocket and were excluded.`],
							...allowed.some((target) => target.attached === null) ? ["CDP discovery could not establish debugger attachment state for one or more targets."] : []
						]
					}));
				} catch (cause) {
					const fileFailure = mapElectronFileAuthorizationFailure(cause, CDP_ELECTRON_PROVIDER_IDENTITY.id, "list_electron_targets", { completed_prefix: {
						browser_version: discovery?.version ?? null,
						examined_targets: examined,
						discovered_targets: discovery?.targets.length ?? null,
						allowed_targets: allowed,
						excluded: {
							unsupported_url: unsupportedUrl,
							non_page: nonPage
						},
						unconnectable_targets: unconnectable,
						coverage: "partial: target authorization stopped; remaining targets are unknown"
					} });
					if (fileFailure !== undefined) return err(fileFailure);
					return err(options.signal?.aborted === true ? new AnalysisCancelledError("list_electron_targets", {
						cause: options.signal.reason,
						diagnostics: { completed_prefix: {
							browser_version: discovery?.version ?? null,
							examined_targets: examined,
							discovered_targets: discovery?.targets.length ?? null,
							allowed_targets: allowed,
							excluded: {
								unsupported_url: unsupportedUrl,
								non_page: nonPage
							},
							unconnectable_targets: unconnectable,
							coverage: "partial: target authorization stopped; remaining targets are unknown"
						} }
					}) : providerError(cause, "list_electron_targets"));
				}
			}
			async inspectPage(input, options = {}) {
				return await this.#withAdmission("inspect_electron_page", async () => await this.#inspectPage(input, options));
			}
			async #inspectPage(input, options) {
				let targetSession;
				let cleanupFailure;
				let result;
				try {
					const discovery = await discoverCdpEndpoint(input.cdp_endpoint, "inspect_electron_page", options.signal);
					const target = await authorizeTarget(discovery, input.target_id, this.#asarHeaderAdmission, options.signal);
					targetSession = await openCdpTargetSession(discovery, target, "inspect_electron_page", options.signal, { commandTimeoutMs: selectedCdpCommandTimeoutMs(input.command_timeout_ms) }, this.#owner);
					result = ok(electronPageInspectionSchema.parse(await inspectCdpElectronPage({
						connection: targetSession.connection,
						sessionId: targetSession.sessionId,
						discovery,
						target,
						input,
						asarHeaderAdmission: this.#asarHeaderAdmission,
						...options.signal === undefined ? {} : { signal: options.signal },
						...options.progress === undefined ? {} : { progress: options.progress }
					})));
				} catch (cause) {
					result = err(providerError(cause, "inspect_electron_page"));
				} finally {
					if (targetSession !== undefined) try {
						await closeCdpTargetSession(targetSession, [
							"Debugger",
							"Runtime",
							"Page"
						], options.signal, this.#owner);
					} catch (cause) {
						cleanupFailure = cause instanceof AnalysisError ? cause : new ProviderCleanupError(CDP_ELECTRON_PROVIDER_IDENTITY.id, [input.target_id], { reason: cause instanceof Error ? cause.message : String(cause) }, {
							operation: "inspect_electron_page",
							cause
						});
					}
				}
				const finalCancellation = result.ok && options.signal?.aborted === true ? new AnalysisCancelledError("inspect_electron_page", {
					cause: options.signal.reason,
					partialObservation: {
						kind: "electron-page-observation",
						inspection: result.value,
						cleanup: cleanupFailure === undefined ? "transport-closed" : "incomplete"
					}
				}) : undefined;
				if (cleanupFailure !== undefined) {
					if (finalCancellation !== undefined) return err(bindCdpTransportCleanup(cleanupFailure, analysisErrorWithCleanupFailure(finalCancellation, cleanupFailure, "inspect_electron_page")));
					if (!result.ok) return err(bindCdpTransportCleanup(cleanupFailure, analysisErrorWithCleanupFailure(result.error, cleanupFailure, "inspect_electron_page")));
					return err(bindCdpTransportCleanup(cleanupFailure, new ProviderCleanupError(CDP_ELECTRON_PROVIDER_IDENTITY.id, cleanupFailure.cleanupResources, { cleanup_error: cleanupFailure.message }, {
						operation: "inspect_electron_page",
						cause: cleanupFailure,
						partialObservation: {
							kind: "electron-page-observation",
							inspection: result.value,
							cleanup: "incomplete"
						}
					})));
				}
				if (!result.ok) return result;
				if (finalCancellation !== undefined) return err(finalCancellation);
				return result;
			}
			async #withAdmission(operation, work) {
				if (this.#closing) return err(new ProviderAdapterError(CDP_ELECTRON_PROVIDER_IDENTITY.id, operation, {
					diagnostics: { reason: "provider_closed" },
					userMessage: "Electron provider is closed to new observations."
				}));
				this.#activeOperations += 1;
				try {
					return await work();
				} catch (cause) {
					return err(providerError(cause, operation));
				} finally {
					this.#activeOperations -= 1;
					if (this.#activeOperations === 0) {
						for (const resolve of this.#idleWaiters) resolve();
						this.#idleWaiters.clear();
					}
				}
			}
		};
		authorizeTarget = async (discovery, targetId, asarHeaderAdmission, signal) => {
			throwIfElectronOperationCancelled(signal, "inspect_electron_page");
			const target = selectCdpDiscoveryTarget(discovery.targets, targetId, "inspect_electron_page", discovery.ambiguousTargetIds);
			if (target === undefined) throw new BrowserObservationError("inspect_web_page", "target_not_found");
			if (target.type !== "page") throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			const path = await authorizedElectronFile(target.url, signal, "inspect_electron_page", asarHeaderAdmission);
			throwIfElectronOperationCancelled(signal, "inspect_electron_page");
			if (path === undefined) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			return target;
		};
		throwIfElectronOperationCancelled = (signal, operation) => {
			if (signal?.aborted === true) throw new AnalysisCancelledError(operation, { cause: signal.reason });
		};
		providerError = (cause, operation) => {
			const fileFailure = mapElectronFileAuthorizationFailure(cause, CDP_ELECTRON_PROVIDER_IDENTITY.id, operation);
			if (fileFailure !== undefined) return fileFailure;
			return cause instanceof BrowserObservationError ? cause.forOperation(operation) : cause instanceof AnalysisError ? cause : new ProviderAdapterError(CDP_ELECTRON_PROVIDER_IDENTITY.id, operation, { cause });
		};
	})))();
}

//#endregion
//#region dist/composition/electronObservation.js
var createElectronObservationProvider;
function init_electronObservation() {
	return (init_electronObservation = __esmMin((() => {
		init_runtimeAnalysisSettings();
		init_CdpElectronProvider();
		createElectronObservationProvider = (environment, settings) => new CdpElectronProvider(runtimeAsarHeaderAdmission(environment, settings));
	})))();
}

//#endregion
init_electronObservation();
export { createElectronObservationProvider };