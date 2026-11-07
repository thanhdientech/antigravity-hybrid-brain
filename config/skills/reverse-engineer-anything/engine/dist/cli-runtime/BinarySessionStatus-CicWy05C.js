import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { compareUnicodeCodePoints, init_binaryTargetTypes, init_unicodeCodePointOrder, isMachOFormat } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_jsonValue, jsonObjectSchema } from "./jsonValue-DGGrC1lE.js";
import { init_targetApplicability, targetApplicabilityRefusal } from "./interfaceBuilderGraph-DT1im95M.js";
import { PROVIDER_EFFECT_NAMES, analysisProviderCandidate, analysisProviderCandidateSummary, init_liveBinaryTargetSummary, init_toolOutputSchemaPrimitives, liveBinaryTargetSummarySchema, providerCapabilitySet } from "./toolOutputSchemaGroups-B9a_Xj3Z.js";
import { z } from "zod";

//#region dist/domain/apple/artifactTargetApplicability.js
var artifactTargetRefusal;
function init_artifactTargetApplicability() {
	return (init_artifactTargetApplicability = __esmMin((() => {
		init_binaryTargetTypes();
		artifactTargetRefusal = (operation, target) => {
			const bundle = target.bundleInfoPlist !== undefined;
			const refuse = (reason) => ({
				code: "target_kind_unsupported",
				reason
			});
			switch (operation) {
				case "decode_interface_builder":
				case "inspect_asset_catalog": return bundle ? undefined : refuse(`${operation} requires an active .app bundle target`);
				case "inspect_keyed_archive": return bundle || target.kind === "artifact" && target.format === "plist" ? undefined : refuse("inspect_keyed_archive requires an active plist or .app bundle");
				case "trace_dylib_resolution":
					if (target.kind !== "executable") return refuse("trace_dylib_resolution requires an active Mach-O or .app bundle target");
					return isMachOFormat(target.format) ? undefined : {
						code: "target_format_unsupported",
						reason: "trace_dylib_resolution requires an active Mach-O or .app bundle target"
					};
				default: return undefined;
			}
		};
	})))();
}

//#endregion
//#region dist/application/binary/BinaryTargetSummary.js
var binaryTargetSummary;
function init_BinaryTargetSummary() {
	return (init_BinaryTargetSummary = __esmMin((() => {
		init_liveBinaryTargetSummary();
		binaryTargetSummary = (target) => liveBinaryTargetSummarySchema.parse({
			path: target.path,
			format: target.format,
			kind: target.kind,
			sha256: target.sha256,
			architecture: target.architecture ?? null,
			...target.format === "raw-binary" || target.format === "gamecube-dol" ? { entry_point: target.entryPoint } : {},
			...target.format === "esp-flash-image" ? {
				flash_offset: target.espFlash.flashOffset,
				partition_table_offset: target.espFlash.partitionTableOffset
			} : {}
		});
	})))();
}

//#endregion
//#region dist/application/binary/BinarySessionStatus.js
var binarySessionStatus, runtimeUnavailable, advertisedCapabilitySurfaces, restrictAdvertisedCapabilities, restrictCapabilitySets, requestActivityStatus, providerStateSummary, providerSummary, processLineageStatus, providerCapabilitySets, commonLimitationsPrefix, enabledCapabilityEffects, providerOperationHealthStatus;
function init_BinarySessionStatus() {
	return (init_BinarySessionStatus = __esmMin((() => {
		init_artifactTargetApplicability();
		init_targetApplicability();
		init_BinaryTargetSummary();
		init_jsonValue();
		init_toolOutputSchemaPrimitives();
		init_unicodeCodePointOrder();
		binarySessionStatus = async ({ investigation, target, bundleResourceRoot, resourceCapabilities = [], route, router, runtimeUnavailability, runId, runtimeLineageSnapshots, requestActivitySnapshots, providerOperationHealth, cleanupPending = false, cleanupRetry, detail = "complete", signal }) => {
			const routeCapabilities = (bundleResourceRoot === undefined ? [...route.capabilities.values()] : [...resourceCapabilities]).filter(({ operation }) => operation !== "inventory_artifact").sort((left, right) => compareUnicodeCodePoints(left.operation, right.operation)).map((descriptor) => {
				const targetRefusal = target === undefined ? undefined : descriptor.targetApplicability === undefined ? artifactTargetRefusal(descriptor.operation, target) : targetApplicabilityRefusal(descriptor.targetApplicability, target);
				if (targetRefusal !== undefined && descriptor.available) return {
					...descriptor,
					available: false,
					availabilityCode: targetRefusal.code,
					reason: targetRefusal.reason
				};
				const unavailable = runtimeUnavailability.get(descriptor.operation);
				return unavailable === undefined ? descriptor : runtimeUnavailable(descriptor, unavailable.reason);
			});
			const capabilities = providerCapabilitySets(routeCapabilities);
			const analysisProviderBinding = bundleResourceRoot !== undefined ? null : route.binding === null ? null : {
				provider: providerSummary(route.binding.identity),
				selection_source: route.binding.selectionSource,
				analysis_profile: structuredClone(route.binding.profile)
			};
			const analysisProviderCandidates = bundleResourceRoot !== undefined ? [] : (await router.candidateStatuses(route, signal)).map((candidate) => detail === "summary" ? {
				provider: providerSummary(candidate.provider),
				availability: providerStateSummary(candidate.availability),
				target_support: providerStateSummary(candidate.targetSupport),
				selected: candidate.selected
			} : {
				provider: providerSummary(candidate.provider),
				availability: structuredClone(candidate.availability),
				target_support: structuredClone(candidate.targetSupport),
				selected: candidate.selected,
				capabilities: providerCapabilitySets(candidate.capabilities.slice().filter(({ operation }) => operation !== "inventory_artifact").sort((left, right) => compareUnicodeCodePoints(left.operation, right.operation)))
			});
			const common = {
				investigation,
				cleanup_pending: cleanupPending,
				...cleanupRetry === undefined ? {} : { cleanup_retry: { ...cleanupRetry } },
				capabilities,
				analysis_provider_binding: analysisProviderBinding,
				analysis_provider_candidates: analysisProviderCandidates,
				analysis_run: runId === undefined ? null : {
					run_id: runId,
					process_lineage: processLineageStatus(runtimeLineageSnapshots)
				},
				analysis_activity: requestActivityStatus(requestActivitySnapshots),
				provider_operation_health: providerOperationHealthStatus(providerOperationHealth)
			};
			return target === undefined ? bundleResourceRoot === undefined ? {
				open: false,
				...common
			} : {
				open: true,
				...common,
				session_kind: "bundle_resources",
				resource_root: {
					caller_path: bundleResourceRoot.callerPath,
					canonical_path: bundleResourceRoot.canonicalPath,
					info_plist_path: bundleResourceRoot.infoPlistPath,
					layout: bundleResourceRoot.layout,
					executable_sha256: bundleResourceRoot.executableSha256
				}
			} : {
				open: true,
				...common,
				...binaryTargetSummary(target)
			};
		};
		runtimeUnavailable = (descriptor, reason) => {
			if (descriptor.available) {
				const { availabilityCode: _available, ...declared } = descriptor;
				return {
					...declared,
					available: false,
					reason
				};
			}
			const { remediation: _superseded, ...declared } = descriptor;
			return {
				...declared,
				reason
			};
		};
		advertisedCapabilitySurfaces = z.object({
			capabilities: z.array(providerCapabilitySet),
			analysis_provider_candidates: z.array(z.union([analysisProviderCandidate, analysisProviderCandidateSummary]))
		});
		restrictAdvertisedCapabilities = (status, isOperationAdvertised) => {
			const object = jsonObjectSchema.parse(status);
			const { capabilities, analysis_provider_candidates } = advertisedCapabilitySurfaces.parse(object);
			return jsonObjectSchema.parse({
				...object,
				capabilities: restrictCapabilitySets(capabilities, isOperationAdvertised),
				analysis_provider_candidates: analysis_provider_candidates.map((candidate) => ({
					...candidate,
					..."capabilities" in candidate ? { capabilities: restrictCapabilitySets(candidate.capabilities, isOperationAdvertised) } : {}
				}))
			});
		};
		restrictCapabilitySets = (sets, isOperationAdvertised) => sets.flatMap((set) => {
			const groups = set.groups.flatMap((group) => {
				const operations = group.operations.filter(isOperationAdvertised);
				return operations.length === 0 ? [] : [{
					...group,
					operations
				}];
			});
			return groups.length === 0 ? [] : [{
				...set,
				groups
			}];
		});
		requestActivityStatus = (snapshots) => {
			const providers = snapshots.slice().sort((left, right) => compareUnicodeCodePoints(left.provider.id, right.provider.id)).map(({ provider, active, queuedRequests }) => ({
				provider: providerSummary(provider),
				active: active === null ? null : {
					request_id: active.requestId,
					operation: active.operation,
					elapsed_ms: active.elapsedMs,
					caller_state: active.callerState
				},
				queued_requests: queuedRequests
			}));
			const active = snapshots.flatMap((snapshot) => snapshot.active === null ? [] : [snapshot.active]);
			return {
				status: snapshots.length === 0 ? "not_observed" : active.length > 0 ? "busy" : "idle",
				providers
			};
		};
		providerStateSummary = ({ status, code, reason }) => ({
			status,
			code,
			reason
		});
		providerSummary = ({ id, name, version }) => ({
			id,
			name,
			version
		});
		processLineageStatus = (snapshots) => snapshots.length === 0 ? { status: "not_observed" } : {
			status: "snapshots",
			snapshots: snapshots.slice().sort((left, right) => compareUnicodeCodePoints(left.provider.id, right.provider.id)).map(({ provider, observation }) => ({
				provider: providerSummary(provider),
				observation: observation.status === "unavailable" ? {
					status: observation.status,
					observed_at: observation.observedAt,
					launcher_pid: observation.launcherPid,
					process_group_id: observation.processGroupId,
					reason: observation.reason
				} : {
					status: observation.status,
					observed_at: observation.observedAt,
					launcher_pid: observation.lineage.launcherPid,
					launcher_parent_pid: observation.lineage.launcherParentPid,
					process_group_id: observation.lineage.processGroupId,
					descendants: observation.lineage.descendants.map(({ pid, parentPid, processGroupId }) => ({
						pid,
						parent_pid: parentPid,
						process_group_id: processGroupId
					}))
				}
			}))
		};
		providerCapabilitySets = (descriptors) => {
			const providers = new Map();
			for (const descriptor of descriptors) {
				const key = JSON.stringify([
					descriptor.provider.id,
					descriptor.provider.name,
					descriptor.provider.version
				]);
				const provider = providers.get(key);
				if (provider === undefined) providers.set(key, {
					identity: descriptor.provider,
					descriptors: [descriptor]
				});
				else provider.descriptors.push(descriptor);
			}
			return [...providers.values()].map(({ identity, descriptors: owned }) => {
				const sharedLimitations = commonLimitationsPrefix(owned);
				const groups = new Map();
				for (const descriptor of owned) {
					const effects = enabledCapabilityEffects(descriptor);
					const limitations = descriptor.limitations.slice(sharedLimitations.length);
					const availabilityCode = descriptor.availabilityCode ?? null;
					const status = descriptor.available ? {
						available: true,
						reason: null,
						availability_code: null
					} : {
						available: false,
						reason: descriptor.reason,
						availability_code: availabilityCode,
						...descriptor.remediation === undefined ? {} : { remediation: descriptor.remediation }
					};
					const key = JSON.stringify([
						effects,
						limitations,
						status.available,
						status.reason,
						status.availability_code,
						status.available ? null : status.remediation ?? null
					]);
					const group = groups.get(key);
					if (group === undefined) groups.set(key, {
						operations: [descriptor.operation],
						effects,
						limitations,
						...status
					});
					else group.operations.push(descriptor.operation);
				}
				return {
					provider: providerSummary(identity),
					shared_limitations: sharedLimitations,
					groups: [...groups.values()]
				};
			});
		};
		commonLimitationsPrefix = (descriptors) => {
			const first = descriptors[0]?.limitations;
			if (first === undefined) return [];
			let length = first.length;
			for (const descriptor of descriptors.slice(1)) {
				length = Math.min(length, descriptor.limitations.length);
				let index = 0;
				while (index < length && first[index] === descriptor.limitations[index]) index++;
				length = index;
			}
			return first.slice(0, length);
		};
		enabledCapabilityEffects = (descriptor) => {
			const effectValues = {
				mutates_artifact: descriptor.effects.mutatesArtifact,
				launches_process: descriptor.effects.launchesProcess,
				may_show_ui: descriptor.effects.mayShowUi,
				may_access_network: descriptor.effects.mayAccessNetwork,
				may_write_filesystem: descriptor.effects.mayWriteFilesystem,
				changes_permissions: descriptor.effects.changesPermissions,
				requires_root: descriptor.effects.requiresRoot
			};
			return PROVIDER_EFFECT_NAMES.filter((name) => effectValues[name]);
		};
		providerOperationHealthStatus = (health) => {
			if (health === undefined || health === null) return null;
			return {
				state: health.state,
				stage: health.stage,
				retry_action: health.retryAction,
				exit_code: health.exitCode,
				requests: health.requests.map((request) => ({
					request_id: request.requestId,
					operation: request.operation,
					stage: request.stage
				}))
			};
		};
	})))();
}

//#endregion
export { artifactTargetRefusal, binarySessionStatus, binaryTargetSummary, init_BinarySessionStatus, init_BinaryTargetSummary, init_artifactTargetApplicability, providerCapabilitySets };