import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { EvidenceIntegrityError, err, init_evidenceErrors, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisInputError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { analysisInputErrorFromIssues, digestCanonicalValue, digestSchema, evidenceInputSchema, getEvidenceInputContract, init_canonicalDigest, init_digests, init_evidenceInputContract, init_evidenceReference, init_evidenceValidation, init_inputIssueProjection, init_managedArtifact, managedArtifactInspectionSchema, managedMemberInspectionSchema, managedNativeBoundaryInspectionSchema, prefixedDigestSchema, readEvidence, readEvidencePayload } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { createJavaScriptApplicationEdge, createJavaScriptApplicationGraph, createJavaScriptApplicationNode, init_javascriptApplicationGraph, javascriptApplicationGraphSchema } from "./javascriptApplicationAnalysis-BPf1N9PJ.js";
import { basename } from "node:path";
import { z } from "zod";

//#region dist/domain/managed/managedInspectionEvidence.js
var managedTokenScopesMatch, readManagedInspectionEvidence, integrityFailure;
function init_managedInspectionEvidence() {
	return (init_managedInspectionEvidence = __esmMin((() => {
		init_analysisErrorCore();
		init_evidenceErrors();
		init_evidenceValidation();
		init_result();
		managedTokenScopesMatch = (leftMvid, rightMvid) => leftMvid !== null && rightMvid !== null && leftMvid.toLowerCase() === rightMvid.toLowerCase();
		readManagedInspectionEvidence = (rawEvidence, operation, schema, selection) => {
			const record = readEvidence(rawEvidence);
			if (!record.ok) return record;
			const evidence = record.value;
			if (evidence.operation !== operation || evidence.predicate_type !== "rea.analysis") {
				const message = `Expected rea.analysis ${operation} Evidence, received ${evidence.predicate_type} ${evidence.operation}`;
				return err(new AnalysisInputError(selection.operation, { userMessage: message }, [{
					path: selection.path,
					reason: "invalid_value",
					message
				}]));
			}
			const payload = readEvidencePayload(schema, evidence.normalized_result);
			if (!payload.ok) return payload;
			const result = payload.value;
			const artifactSha256 = result.artifact.sha256;
			const subjectSha256 = evidence.subject?.digest.sha256;
			if (subjectSha256 !== undefined && artifactSha256 !== subjectSha256) return err(integrityFailure(`Managed Evidence ${operation} (${evidence.evidence_id}) subject SHA-256 ${subjectSha256} does not match normalized artifact SHA-256 ${artifactSha256}`));
			const scope = result.identity_scope;
			if (scope !== undefined && scope.requires_artifact_sha256 !== artifactSha256) return err(integrityFailure(`Managed Evidence ${operation} (${evidence.evidence_id}) token scope SHA-256 ${scope.requires_artifact_sha256} does not match normalized artifact SHA-256 ${artifactSha256}`));
			const moduleMvid = result.module?.mvid ?? null;
			const scopedMvid = scope?.requires_mvid;
			if (scopedMvid !== undefined && scopedMvid?.toLowerCase() !== moduleMvid?.toLowerCase()) return err(integrityFailure(`Managed Evidence ${operation} (${evidence.evidence_id}) token scope MVID ${String(scopedMvid)} does not match module MVID ${String(moduleMvid)}`));
			return ok({
				evidence,
				result
			});
		};
		integrityFailure = (message) => new EvidenceIntegrityError(message, { userMessage: message });
	})))();
}

//#endregion
//#region dist/domain/managed/managedApplicationGraphCoverage.js
var omittedRelationSites, omitsUncounted, omitsAny, completeCoverage, managedSourceCoverage, assessManagedGraphOmissions, managedGraphEvidenceCoverage, managedGraphResultCoverage;
function init_managedApplicationGraphCoverage() {
	return (init_managedApplicationGraphCoverage = __esmMin((() => {
		init_managedInspectionEvidence();
		omittedRelationSites = (omissions) => omissions === null ? 0 : [...Object.values(omissions.callSites), ...Object.values(omissions.fieldAccessSites)].reduce((total, count) => total + count, 0);
		omitsUncounted = (omissions) => omissions.partialInput || omissions.unscopedTokenRelationships || omissions.selectedTypes !== null || omissions.methodRows !== undefined;
		omitsAny = (omissions) => omitsUncounted(omissions) || omittedRelationSites(omissions.relations) > 0;
		completeCoverage = () => ({
			status: "complete",
			truncated: false,
			omitted_count: 0,
			limits: []
		});
		managedSourceCoverage = (state) => state === "complete" ? completeCoverage() : {
			status: state,
			truncated: false,
			omitted_count: null,
			limits: []
		};
		assessManagedGraphOmissions = (sources, relations) => ({
			relations,
			unscopedTokenRelationships: sources.members !== null && sources.boundaries !== null && (sources.boundaries.pinvoke_imports.some(({ member_token }) => member_token !== null) || sources.boundaries.native_implementations.length > 0) && !managedTokenScopesMatch(sources.members.identity_scope.requires_mvid, sources.boundaries.identity_scope.requires_mvid),
			partialInput: [
				sources.members?.coverage.state,
				sources.boundaries?.coverage.state,
				sources.artifact?.coverage.state
			].some((state) => state !== undefined && state !== "complete"),
			selectedTypes: sources.members?.selection?.type_names ?? null,
			methodRows: sources.members === null || sources.members.method_rows !== null && sources.members.method_rows.offset === 0 && sources.members.method_rows.count === sources.members.method_rows.total ? undefined : sources.members.method_rows
		});
		managedGraphEvidenceCoverage = (omissions) => omitsAny(omissions) ? {
			status: "partial",
			truncated: false,
			omitted_count: omitsUncounted(omissions) ? null : omittedRelationSites(omissions.relations),
			limits: []
		} : completeCoverage();
		managedGraphResultCoverage = (omissions) => ({ status: omitsAny(omissions) ? "partial" : "complete-within-inputs" });
	})))();
}

//#endregion
//#region dist/domain/managed/managedApplicationGraphNodes.js
var metadataLabel, addArtifactNode, addArtifactIdentityNodes, selectModuleSource, addMemberNodes, typeNode, methodNode, fieldNode, addBoundaryNodes, pinvokeNode, nativeImplementationNode, addContainsEdge, artifactLocalIdentity, sourceManagedEvidence, projectedManagedEvidence, pinvokeAssociationEvidence, createManagedEvidence, graphArtifactPath;
function init_managedApplicationGraphNodes() {
	return (init_managedApplicationGraphNodes = __esmMin((() => {
		init_javascriptApplicationGraph();
		init_managedApplicationGraphCoverage();
		init_managedInspectionEvidence();
		metadataLabel = (name) => name === "" ? null : name;
		addArtifactNode = (state) => {
			const node = createJavaScriptApplicationNode({
				kind: "artifact",
				identity: {
					strategy: "content-digest",
					stability: "global-exact",
					sha256: state.artifactSha256
				},
				observations: [{
					label: basename(state.artifactPath),
					properties: {
						format: "pe",
						source: "managed-application-graph"
					},
					evidence: projectedManagedEvidence(state, "project-managed-artifact")
				}]
			});
			state.nodes.push(node);
			return node;
		};
		addArtifactIdentityNodes = (state, artifactNode, parsed) => {
			const artifactInput = parsed.artifact;
			if (artifactInput !== null && artifactInput.result.assembly !== null) {
				const assemblyFacts = artifactInput.result.assembly;
				const artifactEvidence = sourceManagedEvidence(state, artifactInput.evidence, artifactInput.result.coverage.state);
				const assembly = createJavaScriptApplicationNode({
					kind: "managed-assembly",
					identity: artifactLocalIdentity(state.artifactSha256, "managed-assembly", assemblyFacts.token),
					observations: [{
						label: metadataLabel(assemblyFacts.name),
						properties: {
							name: assemblyFacts.name,
							version: assemblyFacts.version,
							culture: assemblyFacts.culture,
							public_key_kind: assemblyFacts.public_key.kind
						},
						evidence: artifactEvidence
					}]
				});
				state.nodes.push(assembly);
				addContainsEdge(state, artifactNode, assembly, {
					kind: "declares-managed-assembly",
					coverage: artifactEvidence.coverage
				});
			}
			const moduleSource = selectModuleSource(parsed);
			if (moduleSource !== null) {
				const { module } = moduleSource;
				const moduleEvidence = sourceManagedEvidence(state, moduleSource.evidence, moduleSource.coverageState);
				const moduleNode = createJavaScriptApplicationNode({
					kind: "managed-module",
					identity: artifactLocalIdentity(state.artifactSha256, "managed-module", module.mvid?.toLowerCase() ?? module.token),
					observations: [{
						label: metadataLabel(module.name),
						properties: {
							name: module.name,
							mvid: module.mvid,
							generation: module.generation,
							token: module.token
						},
						evidence: moduleEvidence
					}]
				});
				state.nodes.push(moduleNode);
				addContainsEdge(state, artifactNode, moduleNode, {
					kind: "declares-managed-module",
					coverage: moduleEvidence.coverage
				});
			}
		};
		selectModuleSource = (parsed) => {
			const sources = [
				parsed.artifact?.result.module == null ? null : {
					module: parsed.artifact.result.module,
					evidence: parsed.artifact.evidence,
					coverageState: parsed.artifact.result.coverage.state
				},
				parsed.members?.result.module == null ? null : {
					module: parsed.members.result.module,
					evidence: parsed.members.evidence,
					coverageState: parsed.members.result.coverage.state
				},
				parsed.boundaries?.result.module == null ? null : {
					module: parsed.boundaries.result.module,
					evidence: parsed.boundaries.evidence,
					coverageState: parsed.boundaries.result.coverage.state
				}
			].filter((source) => source !== null);
			return sources.find(({ module }) => module.mvid !== null) ?? sources[0] ?? null;
		};
		addMemberNodes = (state, artifactNode, parsed) => {
			const memberInput = parsed.members;
			if (memberInput === null) return;
			const members = memberInput.result;
			const { types, methods, fields } = members;
			const typeCoverage = managedSourceCoverage(members.coverage.state);
			const methodCoverage = managedSourceCoverage(members.coverage.state);
			const fieldCoverage = managedSourceCoverage(members.coverage.state);
			const sourceEvidence = sourceManagedEvidence(state, memberInput.evidence, members.coverage.state);
			for (const type of types) {
				const node = typeNode(state, type, sourceEvidence);
				state.nodes.push(node);
				state.typeNodes.set(type.token, node);
				addContainsEdge(state, artifactNode, node, {
					kind: "declares-managed-type",
					coverage: typeCoverage
				});
			}
			for (const method of methods) {
				const node = methodNode(state, method, sourceEvidence);
				state.nodes.push(node);
				state.methodNodes.set(method.token, node);
				const owner = method.declaring_type_token === null ? artifactNode : state.typeNodes.get(method.declaring_type_token) ?? artifactNode;
				addContainsEdge(state, owner, node, {
					kind: "declares-managed-method",
					coverage: methodCoverage
				});
			}
			for (const field of fields) {
				const node = fieldNode(state, field, sourceEvidence);
				state.nodes.push(node);
				state.fieldNodes.set(field.token, node);
				const owner = field.declaring_type_token === null ? artifactNode : state.typeNodes.get(field.declaring_type_token) ?? artifactNode;
				addContainsEdge(state, owner, node, {
					kind: "declares-managed-field",
					coverage: fieldCoverage
				});
			}
		};
		typeNode = (state, type, evidence) => createJavaScriptApplicationNode({
			kind: "managed-type",
			identity: artifactLocalIdentity(state.artifactSha256, "managed-type-token", type.token),
			observations: [{
				label: metadataLabel(type.full_name),
				properties: {
					token: type.token,
					namespace: type.namespace,
					name: type.name,
					full_name: type.full_name,
					flags: type.flags,
					extends_token: type.extends_token
				},
				evidence
			}]
		});
		methodNode = (state, method, evidence) => createJavaScriptApplicationNode({
			kind: "managed-method",
			identity: artifactLocalIdentity(state.artifactSha256, "managed-method-token", method.token),
			observations: [{
				label: metadataLabel(method.declaring_type === null ? method.name : `${method.declaring_type}.${method.name}`),
				properties: {
					token: method.token,
					declaring_type_token: method.declaring_type_token,
					declaring_type: method.declaring_type,
					name: method.name,
					rva: method.rva,
					signature_sha256: method.signature.raw_sha256,
					signature_status: method.signature.parse_status,
					body_status: method.body.status,
					normalized_il_sha256: method.body.normalized_il_sha256,
					il_size: method.body.il_size
				},
				evidence
			}]
		});
		fieldNode = (state, field, evidence) => createJavaScriptApplicationNode({
			kind: "managed-field",
			identity: artifactLocalIdentity(state.artifactSha256, "managed-field-token", field.token),
			observations: [{
				label: metadataLabel(field.declaring_type === null ? field.name : `${field.declaring_type}.${field.name}`),
				properties: {
					token: field.token,
					declaring_type_token: field.declaring_type_token,
					declaring_type: field.declaring_type,
					name: field.name,
					flags: field.flags,
					signature_sha256: field.signature.raw_sha256,
					signature_status: field.signature.parse_status
				},
				evidence
			}]
		});
		addBoundaryNodes = (state, artifactNode, parsed) => {
			const boundaryInput = parsed.boundaries;
			if (boundaryInput === null) return;
			const boundaries = boundaryInput.result;
			const { pinvoke_imports: pinvokes, native_implementations: implementations } = boundaries;
			const pinvokeCoverage = managedSourceCoverage(boundaries.coverage.state);
			const implementationCoverage = managedSourceCoverage(boundaries.coverage.state);
			const sourceEvidence = sourceManagedEvidence(state, boundaryInput.evidence, boundaries.coverage.state);
			const canJoinMemberTokens = parsed.members !== null && managedTokenScopesMatch(parsed.members.result.identity_scope.requires_mvid, boundaries.identity_scope.requires_mvid);
			for (const pinvoke of pinvokes) {
				const node = pinvokeNode(state, pinvoke, sourceEvidence);
				state.nodes.push(node);
				const method = pinvoke.member_token === null || !canJoinMemberTokens ? undefined : state.methodNodes.get(pinvoke.member_token);
				const memberEvidence = method === undefined || parsed.members === null ? undefined : parsed.members.evidence;
				const owner = method ?? artifactNode;
				state.edges.push(createJavaScriptApplicationEdge({
					source_node_id: owner.node_id,
					target_node_id: node.node_id,
					relation: "imports",
					properties: {
						kind: "managed-pinvoke",
						import_name: pinvoke.import_name,
						import_scope_name: pinvoke.import_scope_name
					},
					evidence: pinvokeAssociationEvidence(state, boundaryInput.evidence, pinvokeCoverage, memberEvidence)
				}));
			}
			for (const implementation of implementations) {
				const node = nativeImplementationNode(state, implementation, sourceEvidence);
				state.nodes.push(node);
				const owner = (canJoinMemberTokens ? state.methodNodes.get(implementation.token) : undefined) ?? artifactNode;
				addContainsEdge(state, owner, node, {
					kind: "declares-managed-native-implementation",
					coverage: implementationCoverage
				});
			}
		};
		pinvokeNode = (state, pinvoke, evidence) => createJavaScriptApplicationNode({
			kind: "managed-pinvoke-import",
			identity: artifactLocalIdentity(state.artifactSha256, "managed-pinvoke-token", pinvoke.token),
			observations: [{
				label: metadataLabel(pinvoke.import_name),
				properties: {
					token: pinvoke.token,
					member_token: pinvoke.member_token,
					member_name: pinvoke.member_name,
					import_name: pinvoke.import_name,
					import_scope_name: pinvoke.import_scope_name,
					char_set: pinvoke.char_set,
					call_convention: pinvoke.call_convention,
					verification: pinvoke.verification
				},
				evidence
			}]
		});
		nativeImplementationNode = (state, implementation, evidence) => createJavaScriptApplicationNode({
			kind: "managed-native-implementation",
			identity: artifactLocalIdentity(state.artifactSha256, "managed-native-implementation-token", implementation.token),
			observations: [{
				label: metadataLabel(implementation.name),
				properties: {
					token: implementation.token,
					name: implementation.name,
					rva: implementation.rva,
					code_type: implementation.code_type,
					managed_kind: implementation.managed_kind,
					pinvoke_declared: implementation.pinvoke_declared,
					boundary_kind: implementation.boundary_kind,
					body_interpretation: implementation.body_interpretation
				},
				evidence
			}]
		});
		addContainsEdge = (state, source, target, options) => {
			state.edges.push(createJavaScriptApplicationEdge({
				source_node_id: source.node_id,
				target_node_id: target.node_id,
				relation: "contains",
				properties: { kind: options.kind },
				evidence: projectedManagedEvidence(state, "project-managed-contains", options.coverage)
			}));
		};
		artifactLocalIdentity = (artifactSha256, namespace, key) => ({
			strategy: "artifact-local-key",
			stability: "artifact-version",
			artifact_sha256: artifactSha256,
			namespace,
			key
		});
		sourceManagedEvidence = (state, source, coverageState) => createManagedEvidence(state, source.operation, managedSourceCoverage(coverageState), [source.evidence_id]);
		projectedManagedEvidence = (state, operation, coverage = managedSourceCoverage("complete")) => createManagedEvidence(state, operation, coverage, state.evidenceLinks);
		pinvokeAssociationEvidence = (state, boundaryEvidence, coverage, memberEvidence) => createManagedEvidence(state, boundaryEvidence.operation, coverage, [boundaryEvidence.evidence_id, ...memberEvidence === undefined ? [] : [memberEvidence.evidence_id]]);
		createManagedEvidence = (state, operation, coverage, evidenceIds) => ({
			authority: "managed-static-analysis",
			state: "observed",
			confidence: "exact",
			artifact: {
				available: true,
				artifact_id: `art_${state.artifactSha256}`,
				sha256: state.artifactSha256
			},
			location: {
				available: true,
				value: {
					kind: "artifact-path",
					path: graphArtifactPath(state.artifactPath)
				}
			},
			extractor: {
				name: "rea-dotnet-static",
				version: "1",
				operation,
				executable_sha256: null
			},
			coverage,
			limitations: coverage.status === "complete" ? [] : ["The source managed Evidence slice is incomplete; unreturned or unavailable items remain unobserved."],
			evidence_ids: [...evidenceIds]
		});
		graphArtifactPath = (path) => {
			const name = basename(path).replaceAll(/[^A-Za-z0-9._-]/gu, "_");
			return `managed/${name.length === 0 ? "artifact.pe" : name}`;
		};
	})))();
}

//#endregion
//#region dist/domain/managed/managedApplicationGraphRelations.js
var CALL_OPCODES, FIELD_ACCESS_KINDS, isMemberReference, aggregate, siteProperties, addMemberRelations, REASON_LABELS, describeOmissions, relationOmissionLimitations;
function init_managedApplicationGraphRelations() {
	return (init_managedApplicationGraphRelations = __esmMin((() => {
		init_javascriptApplicationGraph();
		init_managedApplicationGraphNodes();
		CALL_OPCODES = new Set([
			"call",
			"callvirt",
			"newobj",
			"jmp"
		]);
		FIELD_ACCESS_KINDS = {
			ldfld: "read",
			ldsfld: "read",
			stfld: "write",
			stsfld: "write",
			ldflda: "address",
			ldsflda: "address"
		};
		isMemberReference = (token) => token.toLowerCase().startsWith("0x0a");
		aggregate = (relations, source, target, opcode) => {
			const key = `${source.node_id}\u0000${target.node_id}`;
			let relation = relations.get(key);
			if (relation === undefined) {
				relation = {
					source,
					target,
					opcodes: new Map()
				};
				relations.set(key, relation);
			}
			relation.opcodes.set(opcode, (relation.opcodes.get(opcode) ?? 0) + 1);
		};
		siteProperties = (opcodes) => {
			const sorted = [...opcodes].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
			return {
				site_count: sorted.reduce((total, [, count]) => total + count, 0),
				opcodes: Object.fromEntries(sorted)
			};
		};
		addMemberRelations = (state, parsed) => {
			const memberInput = parsed.members;
			if (memberInput === null) return null;
			const members = memberInput.result;
			const callSites = {
				"member-ref": 0,
				"method-spec": 0,
				"unknown-target": 0,
				"method-reference": 0,
				"absent-node": 0,
				"self-call": 0
			};
			const fieldAccessSites = {
				"member-ref": 0,
				"absent-node": 0
			};
			const calls = new Map();
			for (const edge of members.call_edges) {
				if (edge.target_kind !== "method-def") {
					callSites[edge.target_kind === "unknown" ? "unknown-target" : edge.target_kind]++;
					continue;
				}
				if (!CALL_OPCODES.has(edge.opcode)) {
					callSites["method-reference"]++;
					continue;
				}
				const caller = state.methodNodes.get(edge.caller_token);
				const target = state.methodNodes.get(edge.target_token);
				if (caller === undefined || target === undefined) {
					callSites["absent-node"]++;
					continue;
				}
				if (caller === target) {
					callSites["self-call"]++;
					continue;
				}
				aggregate(calls, caller, target, edge.opcode);
			}
			const accesses = new Map();
			for (const access of members.field_accesses) {
				const method = state.methodNodes.get(access.method_token);
				const field = state.fieldNodes.get(access.field_token);
				if (method === undefined || field === undefined) {
					fieldAccessSites[isMemberReference(access.field_token) ? "member-ref" : "absent-node"]++;
					continue;
				}
				aggregate(accesses, method, field, access.opcode);
			}
			const evidence = sourceManagedEvidence(state, memberInput.evidence, members.coverage.state);
			for (const { source, target, opcodes } of calls.values()) state.edges.push(createJavaScriptApplicationEdge({
				source_node_id: source.node_id,
				target_node_id: target.node_id,
				relation: "calls",
				properties: {
					kind: "managed-call",
					...siteProperties(opcodes)
				},
				evidence
			}));
			for (const { source, target, opcodes } of accesses.values()) state.edges.push(createJavaScriptApplicationEdge({
				source_node_id: source.node_id,
				target_node_id: target.node_id,
				relation: "accesses",
				properties: {
					kind: "managed-field-access",
					access: [...new Set([...opcodes.keys()].map((opcode) => FIELD_ACCESS_KINDS[opcode] ?? "unknown"))].sort(),
					...siteProperties(opcodes)
				},
				evidence
			}));
			return {
				callSites,
				fieldAccessSites
			};
		};
		REASON_LABELS = {
			"member-ref": "member-reference",
			"method-spec": "generic method-instantiation",
			"unknown-target": "unknown-target",
			"method-reference": "function-pointer (ldftn/ldvirtftn)",
			"absent-node": "missing-node",
			"self-call": "recursive self-call"
		};
		describeOmissions = (counts) => Object.entries(counts).filter(([, count]) => count > 0).map(([reason, count]) => `${String(count)} ${REASON_LABELS[reason]}`).join(", ");
		relationOmissionLimitations = (omissions) => {
			if (omissions === null) return [];
			const calls = describeOmissions(omissions.callSites);
			const fields = describeOmissions(omissions.fieldAccessSites);
			return [...calls === "" ? [] : [`Calls edges link only method nodes in the inspected module; these call sites are omitted: ${calls}.`], ...fields === "" ? [] : [`Accesses edges link only method and field nodes in the inspected module; these field-access sites are omitted: ${fields}.`]];
		};
	})))();
}

//#endregion
//#region dist/domain/managed/managedApplicationGraph.js
var evidenceIdSchema, textSchema, managedApplicationGraphReferenceShape, managedApplicationGraphReferenceInputSchema, managedGraphRequestSchema, managedApplicationGraphResultSchema, projectManagedGraph, countNodes, countEdges, readManagedGraphProjection, OPERATION, ManagedGraphSourceError, chooseArtifact, artifactMismatch, moduleIdentityMismatch, projectionLimitations;
function init_managedApplicationGraph() {
	return (init_managedApplicationGraph = __esmMin((() => {
		init_evidenceReference();
		init_evidenceInputContract();
		init_javascriptApplicationGraph();
		init_managedArtifact();
		init_canonicalDigest();
		init_managedApplicationGraphCoverage();
		init_managedApplicationGraphNodes();
		init_managedApplicationGraphRelations();
		init_digests();
		init_managedInspectionEvidence();
		init_analysisErrorCore();
		init_inputIssueProjection();
		init_result();
		evidenceIdSchema = prefixedDigestSchema("ev");
		textSchema = z.string().min(1);
		managedApplicationGraphReferenceShape = z.strictObject({
			managed_artifact: evidenceInputSchema.optional(),
			managed_members: evidenceInputSchema.optional(),
			managed_native_boundaries: evidenceInputSchema.optional()
		});
		managedApplicationGraphReferenceInputSchema = z.union([
			managedApplicationGraphReferenceShape.extend({ managed_artifact: evidenceInputSchema }),
			managedApplicationGraphReferenceShape.extend({ managed_members: evidenceInputSchema }),
			managedApplicationGraphReferenceShape.extend({ managed_native_boundaries: evidenceInputSchema })
		]).superRefine((input, context) => {
			const sources = [
				input.managed_artifact,
				input.managed_members,
				input.managed_native_boundaries
			].filter((source) => source !== undefined);
			if (sources.length === 0) context.addIssue({
				code: "custom",
				message: "Provide at least one managed Evidence source"
			});
			if (sources.some((source) => typeof source?.evidence_id !== "string")) return;
			const ids = sources.map((source) => source.evidence_id);
			if (new Set(ids).size !== ids.length) context.addIssue({
				code: "custom",
				message: "Managed application graph Evidence IDs must be unique"
			});
		});
		managedGraphRequestSchema = getEvidenceInputContract(managedApplicationGraphReferenceInputSchema).frameSchema;
		managedApplicationGraphResultSchema = z.strictObject({
			projection_id: prefixedDigestSchema("magp"),
			root_artifact_sha256: digestSchema,
			source_evidence: z.strictObject({
				managed_artifact_evidence_id: evidenceIdSchema.nullable(),
				managed_members_evidence_id: evidenceIdSchema.nullable(),
				managed_native_boundaries_evidence_id: evidenceIdSchema.nullable()
			}),
			summary: z.strictObject({
				graph_nodes: z.int().min(0),
				graph_edges: z.int().min(0),
				assemblies: z.int().min(0),
				modules: z.int().min(0),
				types: z.int().min(0),
				methods: z.int().min(0),
				fields: z.int().min(0),
				pinvoke_imports: z.int().min(0),
				native_implementations: z.int().min(0),
				calls: z.int().min(0).nullable().default(null).describe("calls edges; null for graphs projected before calls edges"),
				field_accesses: z.int().min(0).nullable().default(null).describe("accesses edges; null for graphs projected before accesses edges")
			}),
			graph: javascriptApplicationGraphSchema,
			coverage: z.strictObject({ status: z.enum(["complete-within-inputs", "partial"]) }),
			evidence_links: z.array(evidenceIdSchema).min(1).max(3),
			limitations: z.array(textSchema)
		});
		projectManagedGraph = (request) => {
			const { sources: parsed, artifact: artifactIdentity } = request;
			const evidenceLinks = [
				parsed.artifact?.evidence.evidence_id,
				parsed.members?.evidence.evidence_id,
				parsed.boundaries?.evidence.evidence_id
			].filter((id) => id !== undefined);
			const state = {
				nodes: [],
				edges: [],
				artifactSha256: artifactIdentity.sha256,
				artifactPath: artifactIdentity.path,
				evidenceLinks,
				typeNodes: new Map(),
				methodNodes: new Map(),
				fieldNodes: new Map()
			};
			const artifactNode = addArtifactNode(state);
			addArtifactIdentityNodes(state, artifactNode, parsed);
			addMemberNodes(state, artifactNode, parsed);
			addBoundaryNodes(state, artifactNode, parsed);
			const relations = addMemberRelations(state, parsed);
			const omissions = assessManagedGraphOmissions({
				artifact: parsed.artifact?.result ?? null,
				members: parsed.members?.result ?? null,
				boundaries: parsed.boundaries?.result ?? null
			}, relations);
			const limitations = projectionLimitations(parsed, omissions);
			const graph = createJavaScriptApplicationGraph({
				schema: "JavaScriptApplicationGraph",
				root_node_ids: [artifactNode.node_id],
				nodes: state.nodes,
				edges: state.edges,
				coverage: managedGraphEvidenceCoverage(omissions),
				limitations
			});
			const withoutId = {
				root_artifact_sha256: state.artifactSha256,
				source_evidence: {
					managed_artifact_evidence_id: parsed.artifact?.evidence.evidence_id ?? null,
					managed_members_evidence_id: parsed.members?.evidence.evidence_id ?? null,
					managed_native_boundaries_evidence_id: parsed.boundaries?.evidence.evidence_id ?? null
				},
				summary: {
					graph_nodes: graph.nodes.length,
					graph_edges: graph.edges.length,
					assemblies: countNodes(graph.nodes, "managed-assembly"),
					modules: countNodes(graph.nodes, "managed-module"),
					types: countNodes(graph.nodes, "managed-type"),
					methods: countNodes(graph.nodes, "managed-method"),
					fields: countNodes(graph.nodes, "managed-field"),
					pinvoke_imports: countNodes(graph.nodes, "managed-pinvoke-import"),
					native_implementations: countNodes(graph.nodes, "managed-native-implementation"),
					calls: countEdges(graph.edges, "calls"),
					field_accesses: countEdges(graph.edges, "accesses")
				},
				graph,
				coverage: managedGraphResultCoverage(omissions),
				evidence_links: evidenceLinks,
				limitations
			};
			return managedApplicationGraphResultSchema.parse({
				...withoutId,
				projection_id: `magp_${digestCanonicalValue(withoutId, "Managed application graph")}`
			});
		};
		countNodes = (nodes, kind) => nodes.filter((node) => node.kind === kind).length;
		countEdges = (edges, relation) => edges.filter((edge) => edge.relation === relation).length;
		readManagedGraphProjection = (input) => {
			const frame = managedGraphRequestSchema.safeParse(input);
			if (!frame.success) return err(analysisInputErrorFromIssues(OPERATION, frame.error.issues, input, { cause: frame.error }));
			const { managed_artifact, managed_members, managed_native_boundaries } = frame.data;
			const artifact = managed_artifact === undefined ? ok(null) : readManagedInspectionEvidence(managed_artifact, "inspect_managed_artifact", managedArtifactInspectionSchema, {
				operation: OPERATION,
				path: ["managed_artifact"]
			});
			if (!artifact.ok) return artifact;
			const members = managed_members === undefined ? ok(null) : readManagedInspectionEvidence(managed_members, "inspect_managed_members", managedMemberInspectionSchema, {
				operation: OPERATION,
				path: ["managed_members"]
			});
			if (!members.ok) return members;
			const boundaries = managed_native_boundaries === undefined ? ok(null) : readManagedInspectionEvidence(managed_native_boundaries, "inspect_managed_native_boundaries", managedNativeBoundaryInspectionSchema, {
				operation: OPERATION,
				path: ["managed_native_boundaries"]
			});
			if (!boundaries.ok) return boundaries;
			const sources = {
				artifact: artifact.value,
				members: members.value,
				boundaries: boundaries.value
			};
			const identity = chooseArtifact(sources);
			const mismatch = artifactMismatch(sources, identity.sha256) ?? moduleIdentityMismatch(sources);
			if (mismatch !== null) return err(new AnalysisInputError(OPERATION, { userMessage: mismatch }, [{
				path: [],
				reason: "invalid_value",
				message: mismatch
			}]));
			return ok({
				sources,
				artifact: identity
			});
		};
		OPERATION = "project_managed_application_graph";
		ManagedGraphSourceError = class extends Error {
			_tag = "ManagedGraphSourceError";
			code = "missing_source";
			constructor() {
				super("missing_source");
				this.name = "ManagedGraphSourceError";
			}
		};
		chooseArtifact = (parsed) => {
			const result = parsed.artifact?.result ?? parsed.members?.result ?? parsed.boundaries?.result;
			if (result === undefined) throw new ManagedGraphSourceError();
			return {
				sha256: result.artifact.sha256,
				path: result.artifact.path
			};
		};
		artifactMismatch = (parsed, sha256Value) => {
			for (const result of [
				parsed.artifact?.result,
				parsed.members?.result,
				parsed.boundaries?.result
			]) if (result !== undefined && result.artifact.sha256 !== sha256Value) return "Managed graph projection inputs must describe the same artifact SHA-256";
			return null;
		};
		moduleIdentityMismatch = (parsed) => {
			const mvidClaims = [
				parsed.artifact?.result.module?.mvid,
				parsed.members?.result.module?.mvid,
				parsed.members?.result.identity_scope.requires_mvid,
				parsed.boundaries?.result.module?.mvid,
				parsed.boundaries?.result.identity_scope.requires_mvid
			].filter((mvid) => mvid !== undefined && mvid !== null).map((mvid) => mvid.toLowerCase());
			if (new Set(mvidClaims).size > 1) return "Managed graph inputs report conflicting known module MVIDs or token scopes";
			const modules = [
				parsed.artifact?.result.module,
				parsed.members?.result.module,
				parsed.boundaries?.result.module
			].filter((module) => module !== undefined && module !== null);
			for (const field of [
				"name",
				"generation",
				"token",
				"row_offset"
			]) {
				const values = new Set(modules.map((module) => module[field]));
				if (values.size > 1) return `Managed graph inputs report conflicting module ${field} values`;
			}
			for (const field of ["enc_id", "enc_base_id"]) {
				const values = new Set(modules.map((module) => module[field]?.toLowerCase()).filter((value) => value !== undefined));
				if (values.size > 1) return `Managed graph inputs report conflicting module ${field} values`;
			}
			return null;
		};
		projectionLimitations = (parsed, omissions) => [
			"Managed graph projection preserves static metadata observations only; it does not execute managed code, load assemblies, or map managed tokens to native addresses.",
			...parsed.members === null ? ["Managed member Evidence was not supplied; type, method, and field nodes are absent."] : [],
			...parsed.artifact === null ? ["Managed artifact Evidence was not supplied; assembly identity observations are absent."] : [],
			...parsed.boundaries === null ? ["Managed native-boundary Evidence was not supplied; P/Invoke and native-implementation nodes are absent."] : [],
			...omissions.partialInput ? ["At least one supplied managed Evidence record has partial coverage."] : [],
			...omissions.selectedTypes === null ? [] : [`Managed member Evidence selected only these declaring types: ${omissions.selectedTypes.join(", ")}; type, method, and field nodes of other types are omitted, not absent.`],
			...omissions.methodRows === undefined ? [] : omissions.methodRows === null ? ["Managed member Evidence did not record its MethodDef row scope; coverage of methods and their relations outside the supplied observations is unknown."] : [`Managed member Evidence examined MethodDef rows at offset ${omissions.methodRows.offset} with count ${omissions.methodRows.count} of ${omissions.methodRows.total} total rows; methods outside that interval and their relations are omitted, not absent.`],
			...omissions.unscopedTokenRelationships ? ["Managed boundary tokens were not linked to member nodes because matching module MVID scope was not established."] : [],
			...relationOmissionLimitations(omissions.relations)
		];
	})))();
}

//#endregion
export { init_managedApplicationGraph, init_managedInspectionEvidence, managedApplicationGraphReferenceInputSchema, managedApplicationGraphResultSchema, projectManagedGraph, readManagedGraphProjection, readManagedInspectionEvidence };