import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { EvidenceFileError, EvidenceReferenceError, err, init_evidenceErrors, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { AnalysisCancelledError, AnalysisInputError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { INSPECT_ANALYSIS_VIEW_OPERATION, analysisInputErrorFromIssues, getEvidenceInputContract, init_analysisViewErrors, init_evidenceInputContract, init_evidenceReference, init_evidenceValidation, init_inputIssueProjection, projectInputIssues, retainedEvidenceReferenceSchema, safeParseImmutableEvidence } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_AnalysisInput, parseAnalysisInput } from "./AnalysisInput-6AZYEmRT.js";
import { init_JsonAuthenticationHeadroom, requireAuthenticationHeadroom } from "./JsonAuthenticationHeadroom-wkKxTsR2.js";
import { authenticateEvidenceBundleValue, init_EvidenceBundleFiles } from "./EvidenceBundleFiles-kxea_C2c.js";
import { init_JsonFiles, readJsonFile } from "./JsonFiles-DTY4ojTz.js";

//#region dist/application/analysisView/evidenceFileSource.js
var ANALYSIS_VIEW_SOURCE, selectionError, RECORD_REFERENCE_PREVIEW_BYTES, selectBundleRecord, listRecordIds, readEvidenceFileSource;
function init_evidenceFileSource() {
	return (init_evidenceFileSource = __esmMin((() => {
		init_JsonAuthenticationHeadroom();
		init_EvidenceBundleFiles();
		init_analysisErrorCore();
		init_analysisViewErrors();
		init_result();
		init_evidenceValidation();
		init_evidenceErrors();
		init_inputIssueProjection();
		init_JsonFiles();
		ANALYSIS_VIEW_SOURCE = {
			operation: INSPECT_ANALYSIS_VIEW_OPERATION,
			path: ["source"]
		};
		selectionError = (site, message) => new AnalysisInputError(site.operation, { userMessage: message }, [{
			path: [...site.path, "evidence_id"],
			reason: "invalid_value",
			message
		}]);
		RECORD_REFERENCE_PREVIEW_BYTES = 2048;
		selectBundleRecord = (records, path, evidenceId, site) => {
			if (evidenceId !== undefined) {
				const selected = records.find((record) => record.evidence_id === evidenceId);
				return selected === undefined ? err(selectionError(site, `Evidence bundle ${path} holds no record ${evidenceId}. It holds ${listRecordIds(records)}.`)) : ok(selected);
			}
			const only = records[0];
			if (only === undefined) return err(selectionError(site, `Evidence bundle ${path} holds no records.`));
			if (records.length > 1) return err(selectionError(site, `Evidence bundle ${path} holds ${String(records.length)} records; select one with ${[...site.path, "evidence_id"].join(".")}. It holds ${listRecordIds(records)}.`));
			return ok(only);
		};
		listRecordIds = (records) => {
			const labels = [];
			let bytes = 0;
			for (const record of records) {
				const separator = labels.length === 0 ? "" : ", ";
				const remaining = RECORD_REFERENCE_PREVIEW_BYTES - bytes;
				let label = `${record.evidence_id} (operation omitted)`;
				if (record.operation.length <= remaining) {
					const complete = `${record.evidence_id} (${record.operation})`;
					if (Buffer.byteLength(JSON.stringify(separator + complete), "utf8") <= remaining) label = complete;
				}
				const encodedBytes = Buffer.byteLength(JSON.stringify(separator + label), "utf8");
				if (encodedBytes > remaining) break;
				labels.push(label);
				bytes += encodedBytes;
			}
			const omitted = records.length - labels.length;
			const listed = labels.join(", ");
			return omitted > 0 ? `${listed} and ${String(omitted)} more` : listed;
		};
		readEvidenceFileSource = async (path, options = {}, evidenceId, site = ANALYSIS_VIEW_SOURCE) => {
			const { signal, resources } = options;
			const { operation } = site;
			const resolveSelected = site.resolveSelected ?? ((selected) => ok(selected));
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			const loaded = await readJsonFile(path, signal, resources, operation);
			if (!loaded.ok) return loaded;
			if (signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: signal.reason }));
			const value = loaded.value;
			if (typeof value === "object" && value !== null && !Array.isArray(value) && Object.hasOwn(value, "records")) {
				const bundle = authenticateEvidenceBundleValue(value, path, {
					operation,
					immutable: true
				});
				if (!bundle.ok) return bundle;
				const selected = selectBundleRecord(bundle.value.records, path, evidenceId, site);
				return selected.ok ? resolveSelected(selected.value, (id) => bundle.value.records.find((record) => record.evidence_id === id)) : selected;
			}
			const headroom = requireAuthenticationHeadroom(value, {
				operation,
				path,
				description: "Insufficient heap headroom to authenticate the Evidence file"
			});
			if (!headroom.ok) return headroom;
			const parsed = safeParseImmutableEvidence(value);
			if (!parsed.ok) return err(new EvidenceFileError("read", "wrong-kind", {
				path,
				cause: parsed.error,
				contentIssues: projectInputIssues(parsed.error.issues, value),
				userMessage: "The selected file does not contain valid Evidence. Repair or recreate the file and try again."
			}));
			if (evidenceId !== undefined && parsed.value.evidence_id !== evidenceId) return err(selectionError(site, `Evidence file ${path} holds ${parsed.value.evidence_id}, not selected record ${evidenceId}.`));
			return resolveSelected(parsed.value, (id) => parsed.value.evidence_id === id ? parsed.value : undefined);
		};
	})))();
}

//#endregion
//#region dist/application/EvidenceInputResolver.js
/** Resolve only schema-declared Evidence fields, sharing one lookup per exact ID. */
function resolveEvidenceRequest(operation, rawInput, schema, lookup, options = {}) {
	const contract = getEvidenceInputContract(schema);
	const parsed = parseAnalysisInput(operation, rawInput, contract.frameSchema, options.signal);
	if (!parsed.ok) return parsed;
	const records = new Map();
	const read = (id) => {
		if (!records.has(id)) records.set(id, lookup?.(id));
		return records.get(id);
	};
	const sources = new Set();
	const result = contract.resolve(parsed.value, (input, path) => {
		if (options.signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: options.signal.reason }));
		let selected = input;
		if (typeof input === "object" && input !== null && "kind" in input) {
			const reference = retainedEvidenceReferenceSchema.safeParse(input);
			if (!reference.success) return err(analysisInputErrorFromIssues(operation, reference.error.issues.map((issue) => ({
				...issue,
				path: [...path, ...issue.path]
			})), rawInput, { cause: reference.error }));
			const found = resolveEvidenceInput(reference.data, read, options.referenceScope);
			if (!found.ok) return err(new EvidenceReferenceError(found.error.evidenceId, found.error.reason, {
				cause: found.error,
				expected: found.error.expected,
				actual: found.error.actual,
				referenceScope: found.error.referenceScope,
				diagnostics: { input_path: [...path] }
			}));
			selected = found.value;
		}
		if (options.readEvidence !== undefined) {
			const admitted = options.readEvidence(selected, path);
			if (!admitted.ok) {
				if (admitted.error.diagnostics?.input_path === undefined) admitted.error.retainDiagnostics({ input_path: [...path] });
				return admitted;
			}
			selected = admitted.value;
		}
		sources.add(selected);
		return ok(selected);
	});
	if (result.ok && options.signal?.aborted) return err(new AnalysisCancelledError(operation, { cause: options.signal.reason }));
	return result.ok ? ok({
		input: result.value,
		sources: [...sources]
	}) : result;
}
var resolveEvidenceInput, resolvePairedEvidenceSources, resolveEvidenceSource;
function init_EvidenceInputResolver() {
	return (init_EvidenceInputResolver = __esmMin((() => {
		init_evidenceInputContract();
		init_evidenceReference();
		init_analysisErrorCore();
		init_evidenceErrors();
		init_result();
		init_inputIssueProjection();
		init_AnalysisInput();
		init_evidenceFileSource();
		resolveEvidenceInput = (input, lookup, referenceScope) => {
			if (!("kind" in input)) return ok(input);
			const record = lookup?.(input.evidence_id);
			if (record === undefined) return err(new EvidenceReferenceError(input.evidence_id, "missing", {
				expected: "Evidence available to the selected source",
				actual: null,
				referenceScope
			}));
			if (record.evidence_id !== input.evidence_id) return err(new EvidenceReferenceError(input.evidence_id, "identity_mismatch", {
				expected: input.evidence_id,
				actual: record.evidence_id
			}));
			return ok(record);
		};
		resolvePairedEvidenceSources = async (input, lookup, options) => {
			const left = await resolveEvidenceSource(input.left, "left", lookup, options);
			if (!left.ok) return left;
			const right = await resolveEvidenceSource(input.right, "right", lookup, options);
			if (!right.ok) return right;
			return ok({
				...input,
				left: left.value,
				right: right.value
			});
		};
		resolveEvidenceSource = async (input, side, lookup, options) => {
			if ("kind" in input && input.kind === "evidence-file") return readEvidenceFileSource(input.path, options, input.evidence_id, {
				operation: options.operation,
				path: [side],
				resolveSelected: (selected, fileLookup) => options.resolveEvidence?.(selected, (id) => fileLookup(id) ?? lookup?.(id), side) ?? ok(selected)
			});
			const selected = resolveEvidenceInput(input, lookup);
			return selected.ok ? options.resolveEvidence?.(selected.value, lookup, side) ?? selected : selected;
		};
	})))();
}

//#endregion
export { init_EvidenceInputResolver, init_evidenceFileSource, readEvidenceFileSource, resolveEvidenceInput, resolveEvidenceRequest, resolvePairedEvidenceSources };