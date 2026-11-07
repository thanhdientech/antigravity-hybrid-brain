import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ConfigurationError, EvidenceIntegrityError, equalJsonText, err, init_configurationErrors, init_evidenceErrors, init_jsonSerialization, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { fixedAllowanceRemediation, init_fixedAllowanceRemediation } from "./fixedAllowanceRemediation-Gm2892s1.js";
import { AnalysisCancelledError, AnalysisInputError, AnalysisOutputError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { absoluteLocalPathStringSchema, canBorrowParsedJsonSnapshot, freezeJsonSnapshot, freezeOwnedJsonTreeSnapshot, immutableJsonSnapshotMember, init_immutableJson, init_jsonValue, init_localPath, isImmutableJsonSnapshot, jsonObjectSchema, jsonValueSchema, jsonValueValidationIssue, jsonValueValidationSteps, localPathStringSchema, nulFreeStringSchema } from "./jsonValue-DGGrC1lE.js";
import { artifactDfuCrc32PairSchema, artifactIntegrityClaimSchema, artifactIntegrityPairOf, artifactMd5PairSchema, artifactSha256PairSchema, init_artifactIntegrity } from "./javascriptAnalysisResourceControls-CEcnXNLc.js";
import { InvalidResidualUnknownGraphError, init_residualUnknownGraphError } from "./residualUnknownGraphError-Dik3wsXE.js";
import { CLI_DOCUMENT_OUTPUT_FORMATS, init_cliOutput } from "./cliOutput-BK02eMs-.js";
import { basename, posix } from "node:path";
import { createHash } from "node:crypto";
import { z } from "zod";
import { z as z$1 } from "incur";
import canonicalize from "canonicalize";
import { fileURLToPath } from "node:url";
import { crc32 } from "node:zlib";
import { isSafeNumber } from "lossless-json";
import { PACKAGE_METADATA } from "../generatedPackageMetadata.js";
import * as t from "@babel/types";
import { parse, parseExpression } from "@babel/parser";

//#region dist/contracts/toolFamilyIds.js
var TOOL_FAMILY_IDS, isToolFamilyId, registerToolFamilies;
function init_toolFamilyIds() {
	return (init_toolFamilyIds = __esmMin((() => {
		TOOL_FAMILY_IDS = [
			"direct",
			"enhanced",
			"native",
			"artifact",
			"managed",
			"firmware",
			"android",
			"pcap",
			"flutter",
			"frida",
			"apktool",
			"jeb",
			"adb",
			"browser",
			"electron",
			"javascript-runtime",
			"application",
			"session"
		];
		isToolFamilyId = (value) => TOOL_FAMILY_IDS.includes(value);
		registerToolFamilies = (registrars) => {
			for (const id of TOOL_FAMILY_IDS) registrars[id]();
		};
	})))();
}

//#endregion
//#region dist/domain/digests.js
var SHA256_PATTERN, digestSchema, prefixedDigestSchema, isDigest;
function init_digests() {
	return (init_digests = __esmMin((() => {
		SHA256_PATTERN = /^[a-f0-9]{64}$/u;
		digestSchema = z.string().regex(SHA256_PATTERN);
		prefixedDigestSchema = (prefix) => z.string().regex(new RegExp(`^${prefix}_[a-f0-9]{64}$`, "u"), `Expected a ${prefix}_ prefixed lowercase sha256 digest`);
		isDigest = (value) => typeof value === "string" && SHA256_PATTERN.test(value);
	})))();
}

//#endregion
//#region dist/domain/inputIssueProjection.js
var analysisInputErrorFromIssues, analysisOperationInputErrorFromIssues, projectInputIssues, projectionBudgetExceeded, projectInputIssuesWithinBudget, projectInputIssueGroupsWithinBudget, chargeProjection, nestedIssue, projectIssue, uniqueIssues, valueAtPath, numericBound, isSafeExpected, safeExpected, boundedIssue;
function init_inputIssueProjection() {
	return (init_inputIssueProjection = __esmMin((() => {
		init_analysisErrorCore();
		analysisInputErrorFromIssues = (operation, issues, input, options = {}) => new AnalysisInputError(operation, {
			...options.cause === undefined ? {} : { cause: options.cause },
			...options.userMessage === undefined ? {} : { userMessage: options.userMessage }
		}, [...projectInputIssues(issues, input), ...options.additionalIssues ?? []]);
		analysisOperationInputErrorFromIssues = (operation, issues, input, cause) => new AnalysisInputError(operation, { cause }, projectInputIssues(issues, {
			operation,
			input
		}).map((issue) => issue.path[0] === "input" ? {
			...issue,
			path: issue.path.slice(1)
		} : issue));
		projectInputIssues = (issues, input) => issues.flatMap((issue) => projectIssue(issue, input));
		projectionBudgetExceeded = Symbol("input issue projection budget exceeded");
		projectInputIssuesWithinBudget = (issues, input, budgetBytes) => {
			return projectInputIssueGroupsWithinBudget(issues, input, budgetBytes)?.flat();
		};
		projectInputIssueGroupsWithinBudget = (issues, input, budgetBytes) => {
			const budget = { remaining: budgetBytes };
			try {
				const groups = [];
				for (const issue of issues) groups.push(projectIssue(issue, input, budget));
				return groups;
			} catch (error) {
				if (error === projectionBudgetExceeded) return undefined;
				throw error;
			}
		};
		chargeProjection = (issue, budget) => {
			const charge = (amount) => {
				budget.remaining -= amount;
				if (budget.remaining < 0) throw projectionBudgetExceeded;
			};
			charge(256);
			let pathCost = 0;
			for (const part of issue.path) {
				const cost = typeof part === "string" ? 6 * part.length + 16 : 32;
				pathCost += cost;
				charge(cost);
			}
			charge(6 * issue.message.length);
			if (issue.code === "invalid_union") {
				for (const branch of issue.errors) charge(32 + 32 * branch.length);
				if ("options" in issue && Array.isArray(issue.options)) for (const value of issue.options) charge(typeof value === "string" ? 6 * value.length + 32 : 32);
			}
			if (issue.code === "invalid_key") charge(32 * issue.issues.length);
			if (issue.code === "unrecognized_keys") for (const key of issue.keys) charge(256 + pathCost + 6 * key.length);
			if (issue.code === "invalid_value") for (const value of issue.values) charge(typeof value === "string" ? 6 * value.length + 32 : 32);
		};
		nestedIssue = (parent, child, budget) => {
			if (budget !== undefined) {
				budget.remaining -= 32 + 8 * (parent.path.length + child.path.length);
				if (budget.remaining < 0) throw projectionBudgetExceeded;
			}
			return {
				...child,
				path: [...parent.path, ...child.path]
			};
		};
		projectIssue = (issue, input, budget) => {
			if (budget !== undefined) chargeProjection(issue, budget);
			const path = issue.path.flatMap((part) => typeof part === "string" || typeof part === "number" ? [part] : []);
			if (issue.code === "invalid_union") {
				if (issue.errors.length === 0) {
					const expected = "options" in issue ? issue.options?.filter(isSafeExpected) : undefined;
					return [{
						path,
						reason: valueAtPath(input, path) === undefined ? "missing_argument" : "invalid_value",
						...expected === undefined ? {} : { expected }
					}];
				}
				return uniqueIssues(issue.errors.flatMap((branch) => branch.flatMap((branchIssue) => projectIssue(nestedIssue(issue, branchIssue, budget), input, budget))));
			}
			if (issue.code === "invalid_key") return issue.issues.flatMap((keyIssue) => projectIssue(nestedIssue(issue, keyIssue, budget), input, budget));
			if (issue.code === "unrecognized_keys") return issue.keys.map((key) => ({
				path: [...path, key],
				reason: "unknown_argument"
			}));
			if (issue.code === "invalid_type") return [{
				path,
				reason: valueAtPath(input, path) === undefined ? "missing_argument" : "invalid_type",
				expected: safeExpected(issue.expected)
			}];
			if (issue.code === "too_small") return [boundedIssue(path, "minimum", numericBound(issue.minimum))];
			if (issue.code === "too_big") return [boundedIssue(path, "maximum", numericBound(issue.maximum))];
			if (issue.code === "invalid_format") return [{
				path,
				reason: "invalid_format",
				expected: issue.format,
				...issue.format === "regex" && issue.message.length > 0 ? { message: issue.message } : {}
			}];
			if (issue.code === "invalid_value") return [{
				path,
				reason: "invalid_value",
				expected: issue.values.filter(isSafeExpected)
			}];
			return [{
				path,
				reason: "invalid_value",
				...issue.message.length > 0 ? { message: issue.message } : {}
			}];
		};
		uniqueIssues = (issues) => [...new Map(issues.map((issue) => [JSON.stringify(issue), issue])).values()];
		valueAtPath = (input, path) => {
			let current = input;
			for (const part of path) {
				if (typeof current !== "object" || current === null) return undefined;
				const next = Reflect.get(current, part);
				current = next;
			}
			return current;
		};
		numericBound = (value) => typeof value === "number" && Number.isFinite(value) ? value : undefined;
		isSafeExpected = (value) => value === null || [
			"string",
			"number",
			"boolean"
		].includes(typeof value);
		safeExpected = (value) => isSafeExpected(value) ? value : "schema-defined value";
		boundedIssue = (path, key, value) => ({
			path,
			reason: "out_of_range",
			...value === undefined ? {} : { [key]: value }
		});
	})))();
}

//#endregion
//#region dist/domain/safeJson.js
var safeParseUtf8Json, safeParseJson;
function init_safeJson() {
	return (init_safeJson = __esmMin((() => {
		safeParseUtf8Json = (bytes) => {
			let text;
			try {
				text = new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(bytes);
			} catch (cause) {
				return {
					ok: false,
					error: cause instanceof Error ? cause.message : String(cause),
					cause
				};
			}
			return safeParseJson(text);
		};
		safeParseJson = (value, reviver) => {
			try {
				return {
					ok: true,
					value: JSON.parse(value, reviver)
				};
			} catch (cause) {
				return {
					ok: false,
					error: cause instanceof Error ? cause.message : String(cause),
					cause
				};
			}
		};
	})))();
}

//#endregion
//#region dist/domain/binaryTargetTypes.js
var BINARY_ARCHITECTURES$1, RAW_ONLY_ARCHITECTURES, ELF_METADATA_ARCHITECTURES, isElfMetadataArchitecture, isMachOFormat, artifactTargetSelectedPath;
function init_binaryTargetTypes() {
	return (init_binaryTargetTypes = __esmMin((() => {
		BINARY_ARCHITECTURES$1 = [
			"x86",
			"x86_64",
			"arm",
			"arm64",
			"arm64_32",
			"mips",
			"6502",
			"riscv",
			"powerpc",
			"m68k",
			"hexagon"
		];
		RAW_ONLY_ARCHITECTURES = ["6502", "m68k"];
		ELF_METADATA_ARCHITECTURES = [
			"mips",
			"riscv",
			"powerpc"
		];
		isElfMetadataArchitecture = (architecture) => ELF_METADATA_ARCHITECTURES.includes(architecture);
		isMachOFormat = (format) => format === "mach-o" || format === "mach-o-universal";
		artifactTargetSelectedPath = (target) => target.kind === "archive" || target.kind === "artifact" ? target.artifactSelectedPath ?? target.sourcePath ?? target.path : target.sourcePath ?? target.path;
	})))();
}

//#endregion
//#region dist/domain/evidenceSubject.js
var evidenceSubjectFormatSchema, detectedEvidenceSubjectDeclaration, rawEvidenceSubjectDeclaration, gamecubeEvidenceSubjectDeclaration, withEvidenceSubjectDeclaration;
function init_evidenceSubject() {
	return (init_evidenceSubject = __esmMin((() => {
		init_binaryTargetTypes();
		evidenceSubjectFormatSchema = z.enum([
			"hopper",
			"analysis-database",
			"mach-o",
			"elf",
			"pe",
			"dos-mz",
			"dos-com",
			"raw-binary",
			"gamecube-dol",
			"zip",
			"ipa",
			"apk",
			"msix",
			"appx",
			"hap",
			"hsp",
			"app-pack",
			"asar",
			"ines",
			"godot-pck",
			"unityfs",
			"wxapkg",
			"uimage",
			"dmg",
			"pkg",
			"plist",
			"javascript",
			"source-map",
			"directory",
			"file",
			"unknown",
			"mach-o-universal",
			"javascript-bundle",
			"entitlements",
			"pyinstaller",
			"node-sea",
			"dotnet-bundle",
			"bun-standalone",
			"intel-hex",
			"srec",
			"esp-image",
			"uf2",
			"dfuse",
			"esp-flash-image",
			"fit"
		]);
		detectedEvidenceSubjectDeclaration = {
			format: evidenceSubjectFormatSchema.exclude(["raw-binary", "gamecube-dol"]),
			architecture: z.enum(BINARY_ARCHITECTURES$1).exclude([...RAW_ONLY_ARCHITECTURES]).nullable()
		};
		rawEvidenceSubjectDeclaration = {
			format: z.literal("raw-binary"),
			architecture: z.enum(BINARY_ARCHITECTURES$1).nullable()
		};
		gamecubeEvidenceSubjectDeclaration = {
			format: z.literal("gamecube-dol"),
			architecture: z.literal("powerpc")
		};
		withEvidenceSubjectDeclaration = (base) => z.discriminatedUnion("format", [
			base.extend(detectedEvidenceSubjectDeclaration),
			base.extend(rawEvidenceSubjectDeclaration),
			base.extend(gamecubeEvidenceSubjectDeclaration)
		]);
	})))();
}

//#endregion
//#region dist/domain/canonicalDigest.js
var digestCanonicalValue, CanonicalDigestError, emitCanonical;
function init_canonicalDigest() {
	return (init_canonicalDigest = __esmMin((() => {
		digestCanonicalValue = (value, context = "Comparison") => {
			const hash = createHash("sha256");
			let buffered = "";
			const flush = () => {
				if (buffered.length === 0) return;
				hash.update(buffered);
				buffered = "";
			};
			const emit = (part) => {
				if (part.length >= 8192) {
					flush();
					hash.update(part);
					return;
				}
				buffered += part;
				if (buffered.length >= 8192) flush();
			};
			const encoded = emitCanonical(value, emit, new Set());
			if (!encoded) throw new TypeError(`${context} could not canonicalize data`);
			flush();
			return hash.digest("hex");
		};
		CanonicalDigestError = class extends Error {
			code;
			_tag = "CanonicalDigestError";
			constructor(code) {
				super(code);
				this.code = code;
				this.name = "CanonicalDigestError";
			}
		};
		emitCanonical = (value, emit, ancestors) => {
			if (typeof value === "number" && !Number.isFinite(value)) throw new CanonicalDigestError(Number.isNaN(value) ? "nan" : "infinity");
			if (value === null || typeof value !== "object") {
				const encoded = JSON.stringify(value);
				if (encoded === undefined) return false;
				emit(encoded);
				return true;
			}
			if (ancestors.has(value)) throw new CanonicalDigestError("circular");
			ancestors.add(value);
			try {
				if ("toJSON" in value && typeof value.toJSON === "function") {
					const normalized = value.toJSON();
					return emitCanonical(normalized, emit, ancestors);
				}
				if (Array.isArray(value)) {
					emit("[");
					const length = value.length;
					for (let index = 0; index < length; index += 1) {
						if (index > 0) emit(",");
						if (!(index in value)) continue;
						const item = value[index];
						emitCanonical(item === undefined || typeof item === "symbol" ? null : item, emit, ancestors);
					}
					emit("]");
				} else {
					emit("{");
					let first = true;
					for (const key of Object.keys(value).sort()) {
						if (Reflect.get(value, key) === undefined || typeof Reflect.get(value, key) === "symbol") continue;
						const item = Reflect.get(value, key);
						if (!first) emit(",");
						first = false;
						emit(JSON.stringify(key));
						emit(":");
						if (!emitCanonical(item, emit, ancestors)) emit("undefined");
					}
					emit("}");
				}
				return true;
			} finally {
				ancestors.delete(value);
			}
		};
	})))();
}

//#endregion
//#region dist/domain/canonicalJsonDigestSteps.js
/** Hash owned, validated JSON in bounded steps without a document-sized string. */
function* canonicalJsonDigestSteps(value) {
	const hash = createHash("sha256");
	const ancestors = new Set();
	const stack = [{
		kind: "value",
		value
	}];
	const encodedKeys = new Map();
	let remainingKeyCodeUnits = 8192;
	let buffered = "";
	let flushed = false;
	const emit = (part) => {
		buffered += part;
		if (buffered.length >= 8192) {
			hash.update(buffered);
			buffered = "";
			flushed = true;
		}
	};
	try {
		while (stack.length > 0) {
			if (flushed) {
				flushed = false;
				yield;
			}
			const frame = stack.pop();
			if (frame === undefined) break;
			if (frame.kind === "separator") {
				emit(":");
				continue;
			}
			if (frame.kind === "string") {
				if (frame.index === frame.value.length) {
					emit("\"");
					continue;
				}
				let end = Math.min(frame.index + 8192, frame.value.length);
				const last = frame.value.charCodeAt(end - 1);
				const next = frame.value.charCodeAt(end);
				if (end < frame.value.length && last >= 55296 && last <= 56319 && next >= 56320 && next <= 57343) end -= 1;
				emit(JSON.stringify(frame.value.slice(frame.index, end)).slice(1, -1));
				frame.index = end;
				stack.push(frame);
				continue;
			}
			let item;
			if (frame.kind === "array") {
				if (frame.index === frame.length) {
					emit("]");
					ancestors.delete(frame.value);
					continue;
				}
				const element = frame.value[frame.index];
				if (element === undefined) throw new TypeError("Canonical JSON digest requires dense JSON arrays");
				if (frame.index++ > 0) emit(",");
				stack.push(frame);
				item = element;
			} else if (frame.kind === "object") {
				if (frame.index === frame.keys.length) {
					emit("}");
					ancestors.delete(frame.value);
					continue;
				}
				const key = frame.keys[frame.index++];
				if (key === undefined) throw new TypeError("Canonical JSON object changed during hashing");
				const property = frame.value[key];
				if (property === undefined) {
					stack.push(frame);
					continue;
				}
				if (frame.written++ > 0) emit(",");
				if (key.length > 8192) {
					emit("\"");
					stack.push(frame, {
						kind: "value",
						value: property
					}, { kind: "separator" }, {
						kind: "string",
						value: key,
						index: 0
					});
					continue;
				}
				let encodedKey = encodedKeys.get(key);
				if (encodedKey === undefined) {
					encodedKey = JSON.stringify(key);
					if (encodedKey.length <= remainingKeyCodeUnits) {
						encodedKeys.set(key, encodedKey);
						remainingKeyCodeUnits -= encodedKey.length;
					}
				}
				emit(encodedKey);
				emit(":");
				stack.push(frame);
				item = property;
			} else {
				item = frame.value;
			}
			if (flushed) {
				flushed = false;
				yield;
			}
			if (typeof item === "string" && item.length > 8192) {
				emit("\"");
				stack.push({
					kind: "string",
					value: item,
					index: 0
				});
			} else if (item === null || typeof item !== "object") {
				if (typeof item === "number" && !Number.isFinite(item)) throw new CanonicalDigestError(Number.isNaN(item) ? "nan" : "infinity");
				emit(JSON.stringify(item));
			} else {
				if (ancestors.has(item)) throw new CanonicalDigestError("circular");
				ancestors.add(item);
				if (Array.isArray(item)) {
					emit("[");
					stack.push({
						kind: "array",
						value: item,
						length: item.length,
						index: 0
					});
				} else {
					emit("{");
					stack.push({
						kind: "object",
						value: item,
						keys: Object.keys(item).sort(),
						index: 0,
						written: 0
					});
				}
			}
		}
		if (buffered !== "") hash.update(buffered);
		return hash.digest("hex");
	} finally {
		stack.length = 0;
		ancestors.clear();
		encodedKeys.clear();
		buffered = "";
	}
}
function init_canonicalJsonDigestSteps() {
	return (init_canonicalJsonDigestSteps = __esmMin((() => {
		init_canonicalDigest();
	})))();
}

//#endregion
//#region dist/domain/analysisProfile.js
var committedProviderSchema, unsignedAnalysisProfileSchema, analysisProfileSchema, createAnalysisProfile, committedProvidersEqual, analysisProfilesEqual, profileDigest;
function init_analysisProfile() {
	return (init_analysisProfile = __esmMin((() => {
		init_canonicalDigest();
		init_jsonValue();
		init_digests();
		committedProviderSchema = z.strictObject({
			id: z.string().min(1),
			name: z.string().min(1),
			version: z.string().min(1)
		});
		unsignedAnalysisProfileSchema = z.strictObject({
			provider: committedProviderSchema,
			parameters: jsonObjectSchema
		});
		analysisProfileSchema = unsignedAnalysisProfileSchema.extend({ digest: digestSchema }).superRefine((profile, context) => {
			const { digest: _digest, ...unsigned } = profile;
			if (profileDigest(unsigned) !== profile.digest) context.addIssue({
				code: "custom",
				path: ["digest"],
				message: "Analysis profile digest does not match its parameters"
			});
		});
		createAnalysisProfile = (provider, parameters) => {
			const unsigned = unsignedAnalysisProfileSchema.parse({
				provider: {
					id: provider.id,
					name: provider.name,
					version: provider.version
				},
				parameters
			});
			return analysisProfileSchema.parse({
				...unsigned,
				digest: profileDigest(unsigned)
			});
		};
		committedProvidersEqual = (left, right) => left.id === right.id && left.name === right.name && left.version === right.version;
		analysisProfilesEqual = (left, right) => left.digest === right.digest && committedProvidersEqual(left.provider, right.provider);
		profileDigest = (profile) => digestCanonicalValue(profile, "Analysis profile");
	})))();
}

//#endregion
//#region dist/domain/fixedTupleSchema.js
var fixedTupleSchema;
function init_fixedTupleSchema() {
	return (init_fixedTupleSchema = __esmMin((() => {
		fixedTupleSchema = (items) => z.tuple(items, z.union(items)).check(z.minLength(items.length), z.maxLength(items.length));
	})))();
}

//#endregion
//#region dist/domain/relationshipCoverage.js
var diagnostics, completeRelationshipCoverageSchema, limitedDirections, partialRelationshipCoverageSchema, unknownRelationshipCoverageSchema, relationshipCoverageSchema, relationshipCoverageLimitations;
function init_relationshipCoverage() {
	return (init_relationshipCoverage = __esmMin((() => {
		init_fixedTupleSchema();
		diagnostics = z.array(z.string().min(1)).min(1).exactOptional();
		completeRelationshipCoverageSchema = z.strictObject({
			status: z.literal("complete"),
			diagnostics
		});
		limitedDirections = z.union([
			fixedTupleSchema([z.literal("callers")]),
			fixedTupleSchema([z.literal("callees")]),
			fixedTupleSchema([z.literal("callers"), z.literal("callees")])
		]);
		partialRelationshipCoverageSchema = z.strictObject({
			status: z.literal("partial"),
			limitations: z.array(z.string().min(1)).min(1),
			limited_directions: limitedDirections.exactOptional(),
			diagnostics
		});
		unknownRelationshipCoverageSchema = z.strictObject({
			status: z.literal("unknown"),
			reason: z.string().min(1),
			limited_directions: limitedDirections.exactOptional(),
			diagnostics
		});
		relationshipCoverageSchema = z.discriminatedUnion("status", [
			completeRelationshipCoverageSchema,
			partialRelationshipCoverageSchema,
			unknownRelationshipCoverageSchema
		]);
		relationshipCoverageLimitations = (coverage) => {
			switch (coverage?.status) {
				case undefined: return ["Provider did not report relationship coverage."];
				case "complete": return [];
				case "partial": return coverage.limitations;
				case "unknown": return [coverage.reason];
			}
		};
	})))();
}

//#endregion
//#region dist/domain/evidence.js
/** Create Evidence from owned immutable JSON while exposing cooperative computation steps. */
function* createImmutableEvidenceSteps(target, provider, observation) {
	if (!isImmutableJsonSnapshot(observation.result)) throw new TypeError("Cooperative Evidence requires an authenticated immutable result");
	yield* jsonValueValidationSteps(observation.result);
	const { normalized } = normalizeEvidenceObservation(target, provider, observation);
	const digest = yield* canonicalJsonDigestSteps(evidenceSemanticContent(normalized));
	return rememberImmutableEvidence({
		...normalized,
		evidence_id: `ev_${digest}`
	});
}
var ANALYSIS_EVIDENCE_PREDICATE, providerSchema, subjectBaseSchema, subjectSchema, evidenceLocationSchema, evidenceAuthoritySchema, executionEnvironmentSchema, evidenceBaseSchema, validateAnalysisProfileProvider, evidenceSchema, authenticatedEvidenceSchema, immutableEvidenceSnapshots, immutableResultSchema, rebindEvidenceSubjectTargetPath, evidenceSubjectIdentity, evidenceSemanticContent, computeEvidenceId, usesPre66NullCoverageIdentity, parseEvidence, tryParseEvidence, immutableEvidence, rebindEvidenceToTargetPath, withEvidenceCallerInputPath, rememberReboundEvidence, isImmutableEvidence, rememberImmutableEvidence, createEvidence, normalizeEvidenceObservation;
function init_evidence() {
	return (init_evidence = __esmMin((() => {
		init_evidenceSubject();
		init_canonicalDigest();
		init_canonicalJsonDigestSteps();
		init_localPath();
		init_analysisProfile();
		init_jsonValue();
		init_immutableJson();
		init_digests();
		init_relationshipCoverage();
		ANALYSIS_EVIDENCE_PREDICATE = "rea.analysis";
		providerSchema = z.strictObject({
			id: z.string().min(1),
			name: z.string().min(1),
			version: z.string().nullable()
		});
		subjectBaseSchema = z.strictObject({
			name: z.string().min(1),
			digest: z.strictObject({ sha256: digestSchema }),
			local_path: nulFreeStringSchema
		});
		subjectSchema = withEvidenceSubjectDeclaration(subjectBaseSchema);
		evidenceLocationSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("address"),
				address: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("address-range"),
				start: z.string().min(1),
				end: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("artifact-path"),
				path: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("file-offset"),
				offset: z.int().min(0)
			}),
			z.strictObject({
				kind: z.literal("file-offset-range"),
				start: z.int().min(0),
				end: z.int().min(0)
			})
		]);
		evidenceAuthoritySchema = z.enum([
			"shipped-artifact",
			"controlled-replay",
			"historical-reference",
			"external-service",
			"analyst-inference"
		]);
		executionEnvironmentSchema = z.strictObject({
			id: z.string().min(1),
			platform: z.string().min(1),
			architecture: z.string().min(1),
			isolation: z.enum([
				"none",
				"process",
				"container",
				"virtual-machine"
			])
		});
		evidenceBaseSchema = z.object({
			evidence_id: prefixedDigestSchema("ev"),
			subject: subjectSchema.nullable(),
			provider: providerSchema,
			analysis_profile: analysisProfileSchema.nullable(),
			predicate_type: z.string().min(1),
			operation: z.string().min(1),
			parameters: jsonObjectSchema,
			/** Verbatim selected path for a direct request; absent on older records. */
			caller_input_path: nulFreeStringSchema.exactOptional().describe("Verbatim direct-request path; not part of semantic identity."),
			raw_result: jsonValueSchema.nullable(),
			normalized_result: jsonValueSchema,
			confidence: z.enum([
				"observed",
				"derived",
				"inferred"
			]),
			authority: evidenceAuthoritySchema,
			environment: executionEnvironmentSchema.nullable(),
			limitations: z.array(z.string()),
			relationship_coverage: relationshipCoverageSchema.nullable(),
			locations: z.array(evidenceLocationSchema),
			evidence_links: z.array(prefixedDigestSchema("ev"))
		}).strict();
		validateAnalysisProfileProvider = (evidence, context) => {
			const profile = evidence.analysis_profile;
			if (profile !== null && (profile.provider.id !== evidence.provider.id || profile.provider.name !== evidence.provider.name || profile.provider.version !== evidence.provider.version)) context.addIssue({
				code: "custom",
				path: ["analysis_profile", "provider"],
				message: "Analysis profile provider does not match Evidence provider"
			});
		};
		evidenceSchema = evidenceBaseSchema.superRefine(validateAnalysisProfileProvider);
		authenticatedEvidenceSchema = evidenceSchema.superRefine((evidence, context) => {
			const { evidence_id: evidenceId, ...withoutId } = evidence;
			if (computeEvidenceId(withoutId) !== evidenceId) context.addIssue({
				code: "custom",
				path: ["evidence_id"],
				message: usesPre66NullCoverageIdentity(withoutId, evidenceId) ? "Evidence uses an earlier relationship_coverage identity commitment: explicit null was omitted from that digest. Recreate this observation with the current REA release; re-exporting the old bundle cannot update its identity." : "Evidence semantic identifier does not match its record"
			});
		});
		immutableEvidenceSnapshots = new WeakMap();
		immutableResultSchema = z.custom(isImmutableJsonSnapshot).superRefine((value, context) => {
			const issue = jsonValueValidationIssue(value);
			if (issue !== undefined) context.addIssue({
				code: "custom",
				message: issue
			});
		});
		rebindEvidenceSubjectTargetPath = (subject, target) => subject.sha256 === target.sha256 && subject.format === target.format && (subject.architecture ?? null) === (target.architecture ?? null) ? {
			...subject,
			path: target.path
		} : subject;
		evidenceSubjectIdentity = (subject) => subject === null ? null : {
			digest: subject.digest,
			format: subject.format,
			architecture: subject.architecture
		};
		evidenceSemanticContent = (evidence) => ({
			subject: evidenceSubjectIdentity(evidence.subject),
			provider: evidence.provider,
			analysis_profile: evidence.analysis_profile,
			predicate_type: evidence.predicate_type,
			operation: evidence.operation,
			parameters: evidence.parameters,
			raw_result: evidence.raw_result,
			normalized_result: evidence.normalized_result,
			confidence: evidence.confidence,
			authority: evidence.authority,
			environment: evidence.environment,
			limitations: evidence.limitations,
			relationship_coverage: evidence.relationship_coverage,
			locations: evidence.locations,
			evidence_links: evidence.evidence_links
		});
		computeEvidenceId = (evidence) => `ev_${digestCanonicalValue(evidenceSemanticContent(evidence), "Evidence")}`;
		usesPre66NullCoverageIdentity = (evidence, evidenceId) => {
			if (evidence.relationship_coverage !== null) return false;
			const legacyProjection = evidenceSemanticContent(evidence);
			delete legacyProjection.relationship_coverage;
			return evidenceId === `ev_${digestCanonicalValue(legacyProjection, "Historical Evidence identity")}`;
		};
		parseEvidence = (input) => {
			const immutable = typeof input === "object" && input !== null ? immutableEvidenceSnapshots.get(input) : undefined;
			if (immutable !== undefined) return immutable;
			return authenticatedEvidenceSchema.parse(input);
		};
		tryParseEvidence = (input) => {
			if (typeof input !== "object" || input === null || !("evidence_id" in input)) return undefined;
			const immutable = immutableEvidenceSnapshots.get(input);
			if (immutable !== undefined) return immutable;
			const parsed = authenticatedEvidenceSchema.safeParse(input);
			return parsed.success ? parsed.data : undefined;
		};
		immutableEvidence = (input) => {
			const parsed = parseEvidence(input);
			return rememberImmutableEvidence(canBorrowParsedJsonSnapshot(input, parsed) ? input : parsed);
		};
		rebindEvidenceToTargetPath = (evidence, target) => {
			const subject = evidence.subject;
			if (subject === null) return evidence;
			const rebound = rebindEvidenceSubjectTargetPath({
				path: subject.local_path,
				sha256: subject.digest.sha256,
				format: subject.format,
				...subject.architecture === null ? {} : { architecture: subject.architecture }
			}, target);
			if (rebound.path === subject.local_path) return evidence;
			const reboundSubject = subjectSchema.parse({
				...subject,
				name: basename(target.path) || "artifact",
				local_path: target.path
			});
			const reboundEvidence = {
				...evidence,
				subject: reboundSubject
			};
			if (!isImmutableEvidence(evidence)) return immutableEvidence(reboundEvidence);
			return rememberReboundEvidence(evidence, reboundEvidence);
		};
		withEvidenceCallerInputPath = (evidence, rawPath) => {
			const callerInputPath = nulFreeStringSchema.parse(rawPath);
			const owned = immutableEvidence(evidence);
			if (owned.caller_input_path === callerInputPath) return owned;
			const rebound = {
				...owned,
				caller_input_path: callerInputPath
			};
			return rememberReboundEvidence(owned, rebound);
		};
		rememberReboundEvidence = (source, rebound) => {
			for (const key of Object.keys(source)) immutableJsonSnapshotMember(source, key);
			return rememberImmutableEvidence(rebound);
		};
		isImmutableEvidence = (evidence) => immutableEvidenceSnapshots.has(evidence);
		rememberImmutableEvidence = (evidence) => {
			freezeJsonSnapshot(evidence);
			immutableEvidenceSnapshots.set(evidence, evidence);
			return evidence;
		};
		createEvidence = (target, provider, observation, options) => {
			const { normalized, sharedResult } = normalizeEvidenceObservation(target, provider, observation);
			const evidence = {
				...normalized,
				evidence_id: computeEvidenceId(normalized)
			};
			if (sharedResult || options?.immutable === true) {
				freezeOwnedJsonTreeSnapshot(evidence);
				immutableEvidenceSnapshots.set(evidence, evidence);
			}
			return evidence;
		};
		normalizeEvidenceObservation = (target, provider, observation) => {
			const subject = target === undefined ? null : {
				name: basename(target.path) || "artifact",
				digest: { sha256: target.sha256 },
				format: target.format,
				architecture: target.architecture ?? null,
				local_path: target.path
			};
			const semantic = {
				subject: subject === null ? null : {
					digest: subject.digest,
					format: subject.format,
					architecture: subject.architecture
				},
				provider: {
					id: provider.id,
					name: provider.name,
					version: provider.version
				},
				analysis_profile: observation.analysisProfile ?? null,
				predicate_type: observation.predicateType ?? "rea.analysis",
				operation: observation.operation,
				parameters: observation.parameters,
				raw_result: observation.rawResult ?? null,
				normalized_result: observation.result,
				confidence: observation.confidence ?? "observed",
				authority: observation.authority ?? "shipped-artifact",
				environment: observation.environment ?? null,
				limitations: [...target === undefined ? [observation.subjectUnavailableReason ?? "Artifact identity is unavailable for this observation."] : [], ...observation.limitations ?? []],
				...observation.relationshipCoverage === undefined ? { relationship_coverage: null } : { relationship_coverage: observation.relationshipCoverage },
				locations: [...observation.locations ?? []],
				evidence_links: [...observation.evidenceLinks ?? []]
			};
			const sharedResult = typeof observation.result === "object" && observation.result !== null && isImmutableJsonSnapshot(observation.result);
			const selectedSchema = sharedResult ? evidenceSchema.safeExtend({ normalized_result: immutableResultSchema }) : evidenceSchema;
			const normalized = selectedSchema.parse({
				...semantic,
				evidence_id: `ev_${"0".repeat(64)}`,
				subject
			});
			return {
				normalized,
				sharedResult
			};
		};
	})))();
}

//#endregion
//#region dist/domain/native/nativeSymbol.js
var nativeSymbolMetadataSchema, nativeSymbolOrigin, hasStableNativeSymbol;
function init_nativeSymbol() {
	return (init_nativeSymbol = __esmMin((() => {
		nativeSymbolMetadataSchema = z.object({
			primary: z.boolean(),
			dynamic: z.boolean(),
			external: z.boolean(),
			type: z.string(),
			source: z.enum([
				"default",
				"analysis",
				"ai",
				"imported",
				"user_defined"
			])
		});
		nativeSymbolOrigin = (symbol) => symbol == null ? "unknown" : symbol.dynamic || symbol.source === "default" ? "generated" : "named";
		hasStableNativeSymbol = (name, symbol) => name.length > 0 && nativeSymbolOrigin(symbol) === "named";
	})))();
}

//#endregion
//#region dist/domain/native/nativeAddress.js
var nativeAddressObservationSchema, nativeAddressSchema, nativeAddressCoordinateInputSchema, nativeAddressInputSchema;
function init_nativeAddress() {
	return (init_nativeAddress = __esmMin((() => {
		nativeAddressObservationSchema = z.string().regex(/^(?:(?:[A-Za-z0-9._~\x2d]|%[0-9A-F]{2})+:)?0x[0-9a-f]+$/u);
		nativeAddressSchema = z.string().regex(/^(?:(?:[A-Za-z0-9._~\x2d]|%[0-9A-F]{2})+:)?0x(?:0|[1-9a-f][0-9a-f]*)$/u);
		nativeAddressCoordinateInputSchema = z.string().regex(/^(?:(?:[A-Za-z0-9._~\x2d]|%[0-9a-fA-F]{2})+:)?0[xX][0-9a-fA-F]+$/u).transform((address) => {
			const separator = address.lastIndexOf(":") + 1;
			const space = separator === 0 ? null : address.slice(0, separator - 1).replace(/%[0-9a-fA-F]{2}/gu, (escape) => escape.toUpperCase());
			return {
				space,
				offset: BigInt(address.slice(separator))
			};
		});
		nativeAddressInputSchema = nativeAddressCoordinateInputSchema.transform(({ space, offset }) => `${space === null ? "" : `${space}:`}0x${offset.toString(16)}`);
	})))();
}

//#endregion
//#region dist/domain/native/addressCoordinate.js
var observedCoordinateSchema, addressCoordinate, addressDistance;
function init_addressCoordinate() {
	return (init_addressCoordinate = __esmMin((() => {
		init_nativeAddress();
		observedCoordinateSchema = nativeAddressObservationSchema.pipe(nativeAddressCoordinateInputSchema);
		addressCoordinate = (value) => {
			const parsed = observedCoordinateSchema.safeParse(value);
			return parsed.success ? parsed.data : null;
		};
		addressDistance = (start, end) => {
			const left = addressCoordinate(start);
			const right = addressCoordinate(end);
			if (left === null || right === null || left.space !== right.space) return null;
			const distance = right.offset - left.offset;
			if (distance < 0n || distance > BigInt(Number.MAX_SAFE_INTEGER)) return null;
			return Number(distance);
		};
	})))();
}

//#endregion
//#region dist/domain/native/nativeFactAvailability.js
var unavailableNativeFactSchema;
function init_nativeFactAvailability() {
	return (init_nativeFactAvailability = __esmMin((() => {
		unavailableNativeFactSchema = z.object({
			available: z.literal(false),
			reason: z.string()
		}).strict();
	})))();
}

//#endregion
//#region dist/domain/native/functionBody.js
var availableFunctionBodySchema, functionBodySchema, functionBodyEntryAgrees;
function init_functionBody() {
	return (init_functionBody = __esmMin((() => {
		init_addressCoordinate();
		init_nativeFactAvailability();
		availableFunctionBodySchema = z.strictObject({
			available: z.literal(true),
			provenance: z.string().min(1),
			ranges: z.array(z.strictObject({
				start: z.string(),
				end: z.string().describe("Inclusive last address of this observed body range.")
			})),
			total_bytes: z.int().min(0).max(Number.MAX_SAFE_INTEGER),
			span_bytes: z.int().min(0).max(Number.MAX_SAFE_INTEGER).nullable(),
			non_contiguous: z.boolean(),
			contains_entry: z.boolean()
		}).superRefine((body, context) => {
			let total = 0n;
			const bounds = new Map();
			const closedSpaces = new Set();
			let previousSpace;
			for (const range of body.ranges) {
				const start = addressCoordinate(range.start);
				const end = addressCoordinate(range.end);
				if (start === null || end === null || start.space !== end.space || end.offset < start.offset) {
					context.addIssue({
						code: "custom",
						message: "Function body range has invalid inclusive endpoints"
					});
					return;
				}
				if (previousSpace !== undefined && previousSpace !== start.space) closedSpaces.add(previousSpace);
				const previous = bounds.get(start.space);
				if (closedSpaces.has(start.space) || previous !== undefined && start.offset <= previous.end + 1n) {
					context.addIssue({
						code: "custom",
						message: "Function body ranges must be ordered, disjoint and maximal within each address space"
					});
					return;
				}
				bounds.set(start.space, {
					start: previous?.start ?? start.offset,
					end: end.offset
				});
				previousSpace = start.space;
				total += end.offset - start.offset + 1n;
			}
			const onlyBounds = bounds.size === 1 ? [...bounds.values()][0] : undefined;
			const span = bounds.size === 0 ? 0n : onlyBounds === undefined ? null : onlyBounds.end - onlyBounds.start + 1n;
			const reportedSpan = body.span_bytes === null ? null : BigInt(body.span_bytes);
			if (total !== BigInt(body.total_bytes) || span !== reportedSpan || body.non_contiguous !== body.ranges.length > 1) context.addIssue({
				code: "custom",
				message: "Function body counts, enclosing span or contiguity disagree with inclusive ranges"
			});
		});
		functionBodySchema = z.discriminatedUnion("available", [unavailableNativeFactSchema, availableFunctionBodySchema]);
		functionBodyEntryAgrees = (body, address) => {
			if (!body.available) return true;
			const entry = addressCoordinate(address);
			if (entry === null) return false;
			const contains = body.ranges.some((range) => {
				const start = addressCoordinate(range.start);
				const end = addressCoordinate(range.end);
				return start !== null && end !== null && start.space === entry.space && entry.offset >= start.offset && entry.offset <= end.offset;
			});
			return contains === body.contains_entry;
		};
	})))();
}

//#endregion
//#region dist/domain/native/procedureInfo.js
var procedureClassificationSchema, procedureIdentitySchema, localVariableSchema, procedureInfoSchema;
function init_procedureInfo() {
	return (init_procedureInfo = __esmMin((() => {
		init_nativeSymbol();
		init_functionBody();
		procedureClassificationSchema = z.object({
			external: z.boolean(),
			thunk: z.boolean(),
			thunk_target: z.string().nullable(),
			provenance: z.string().min(1)
		}).strict();
		procedureIdentitySchema = z.object({
			address: z.string(),
			name: z.string(),
			symbol: nativeSymbolMetadataSchema.nullable().exactOptional(),
			classification: procedureClassificationSchema.nullable(),
			body: functionBodySchema
		}).strict().superRefine((identity, context) => {
			if (!functionBodyEntryAgrees(identity.body, identity.address)) context.addIssue({
				code: "custom",
				message: "Function body entry membership disagrees with procedure identity"
			});
		});
		localVariableSchema = z.object({
			description: z.string(),
			provenance: z.string().min(1),
			name: z.string().nullable().exactOptional(),
			stack_displacement: z.string().regex(/^-?\d+$/u).nullable().exactOptional().describe("Observed signed stack byte displacement, encoded as decimal to preserve precision.")
		}).strict();
		procedureInfoSchema = z.object({
			name: z.string(),
			symbol: nativeSymbolMetadataSchema.nullable().exactOptional(),
			entrypoint: z.string(),
			basicblock_count: z.number().int().min(0),
			length: z.number().min(0),
			signature: z.string().nullable(),
			locals: z.array(localVariableSchema),
			classification: procedureClassificationSchema.nullable(),
			body: functionBodySchema
		});
	})))();
}

//#endregion
//#region dist/domain/unicodeCodePointOrder.js
var compareUnicodeCodePoints, compositeKey;
function init_unicodeCodePointOrder() {
	return (init_unicodeCodePointOrder = __esmMin((() => {
		compareUnicodeCodePoints = (left, right) => {
			let leftIndex = 0;
			let rightIndex = 0;
			while (leftIndex < left.length && rightIndex < right.length) {
				const leftPoint = left.codePointAt(leftIndex) ?? 0;
				const rightPoint = right.codePointAt(rightIndex) ?? 0;
				const difference = leftPoint - rightPoint;
				if (difference !== 0) return difference;
				leftIndex += leftPoint > 65535 ? 2 : 1;
				rightIndex += rightPoint > 65535 ? 2 : 1;
			}
			if (leftIndex === left.length && rightIndex === right.length) return 0;
			return leftIndex === left.length ? -1 : 1;
		};
		compositeKey = (parts) => JSON.stringify(parts);
	})))();
}

//#endregion
//#region dist/domain/validationFailure.js
var describeValidationFailure;
function init_validationFailure() {
	return (init_validationFailure = __esmMin((() => {
		describeValidationFailure = (cause) => {
			if (!(cause instanceof z.ZodError)) return cause instanceof Error ? cause.message : String(cause);
			const [first, ...rest] = cause.issues;
			const location = first === undefined || first.path.length === 0 ? "the document root" : first.path.map(String).join(".");
			return `at ${location}: ${first?.message ?? "invalid value"}${rest.length === 0 ? "" : ` (${String(rest.length)} more issues)`}`;
		};
	})))();
}

//#endregion
//#region dist/domain/canonicalOrdering.js
var uniqueSorted$1, uniqueSortedBy, compareAsciiStrings, isSortedUniqueAscii;
function init_canonicalOrdering() {
	return (init_canonicalOrdering = __esmMin((() => {
		init_unicodeCodePointOrder();
		uniqueSorted$1 = (values) => [...new Set(values)].sort(compareUnicodeCodePoints);
		uniqueSortedBy = (values, key) => {
			const byKey = new Map();
			for (const value of values) byKey.set(key(value), value);
			return [...byKey].sort(([left], [right]) => compareUnicodeCodePoints(left, right)).map(([, value]) => value);
		};
		compareAsciiStrings = (left, right) => left < right ? -1 : left > right ? 1 : 0;
		isSortedUniqueAscii = (values) => values.every((value, index) => index === 0 || compareAsciiStrings(values[index - 1] ?? "", value) < 0);
	})))();
}

//#endregion
//#region dist/domain/functionComparisonResults.js
var dimensionResult, unresolvedDimension, overallStatus, summarize, digest;
function init_functionComparisonResults() {
	return (init_functionComparisonResults = __esmMin((() => {
		init_canonicalDigest();
		dimensionResult = (input) => {
			const context = {
				dimension: input.dimension,
				left_digest: digest(input.left),
				right_digest: digest(input.right),
				left_count: input.leftCount,
				right_count: input.rightCount,
				text_delta: input.textDelta,
				evidence_links: [...input.links],
				limitations: [...input.limitations]
			};
			if (input.status === "unchanged") return {
				...context,
				status: "unchanged",
				conclusion_kind: "derived_relationship"
			};
			return {
				...context,
				status: "changed",
				conclusion_kind: input.providersDiffer ? "contradiction" : "derived_relationship"
			};
		};
		unresolvedDimension = (input) => ({
			dimension: input.dimension,
			status: "unknown",
			left_digest: null,
			right_digest: null,
			left_count: input.leftCount,
			right_count: input.rightCount,
			text_delta: null,
			conclusion_kind: "unresolved_branch",
			evidence_links: [...input.links],
			limitations: [...input.limitations]
		});
		overallStatus = (dimensions, match) => {
			if (match === "mismatched") return "changed";
			if (match === "ambiguous") return "unknown";
			if (dimensions.some(({ status }) => status === "changed")) return "changed";
			if (dimensions.some(({ status }) => status === "unknown")) return "unknown";
			return "unchanged";
		};
		summarize = (dimensions) => ({
			unchanged: dimensions.filter(({ status }) => status === "unchanged").length,
			changed: dimensions.filter(({ status }) => status === "changed").length,
			unknown: dimensions.filter(({ status }) => status === "unknown").length
		});
		digest = (value) => digestCanonicalValue(value, "Function comparison");
	})))();
}

//#endregion
//#region dist/domain/comparisonSemantics.js
var absenceClaimable, canonicalJson;
function init_comparisonSemantics() {
	return (init_comparisonSemantics = __esmMin((() => {
		absenceClaimable = (coverage) => coverage.status === "complete" && coverage.truncated !== true && (coverage.omitted_count === undefined || coverage.omitted_count === 0);
		canonicalJson = (value, context = "Comparison") => {
			const encoded = canonicalize(value);
			if (encoded === undefined) throw new TypeError(`${context} could not canonicalize data`);
			return encoded;
		};
	})))();
}

//#endregion
//#region dist/domain/evidenceInputContract.js
var declarations, referenceAlternatives, borrowedDeclarations, isDeclaredEvidenceInput, declareEvidenceInput, declareEvidenceReferenceAlternative, declareBorrowedEvidenceInput, contracts, identity$1, getEvidenceInputContract, compile, replaceWrappedSchema, objectContract, arrayContract, unionContract;
function init_evidenceInputContract() {
	return (init_evidenceInputContract = __esmMin((() => {
		init_result();
		declarations = z.registry();
		referenceAlternatives = z.registry();
		borrowedDeclarations = new WeakMap();
		isDeclaredEvidenceInput = (schema) => declarations.get(schema) !== undefined;
		declareEvidenceInput = (schema) => {
			declarations.add(schema, { kind: "evidence" });
			return schema;
		};
		declareEvidenceReferenceAlternative = (schema) => {
			referenceAlternatives.add(schema, { retained: true });
			return schema;
		};
		declareBorrowedEvidenceInput = (schema, declaration) => {
			const owner = {};
			borrowedDeclarations.set(owner, declaration);
			declarations.add(schema, {
				kind: "borrowed",
				owner
			});
			return schema;
		};
		contracts = new WeakMap();
		identity$1 = (schema, hasEvidenceReferenceAlternative = false) => ({
			frameSchema: schema,
			hasEvidence: false,
			hasEvidenceReferenceAlternative,
			resolve: (input) => ok(input)
		});
		getEvidenceInputContract = (schema) => {
			const existing = contracts.get(schema);
			if (existing !== undefined) return existing;
			const result = compile(schema);
			contracts.set(schema, result);
			return result;
		};
		compile = (schema) => {
			if (referenceAlternatives.get(schema) !== undefined) return identity$1(schema, true);
			const declared = declarations.get(schema);
			if (declared?.kind === "evidence") return {
				frameSchema: z.unknown().nonoptional(),
				hasEvidence: true,
				hasEvidenceReferenceAlternative: true,
				resolve: (input, visit, path = []) => visit(input, path)
			};
			if (declared?.kind === "borrowed") {
				const declaration = borrowedDeclarations.get(declared.owner);
				if (declaration === undefined) throw new TypeError("Borrowed Evidence schema has no owning declaration");
				const source = getEvidenceInputContract(declaration);
				return {
					...source,
					frameSchema: schema
				};
			}
			if (schema instanceof z.ZodObject) return objectContract(schema);
			if (schema instanceof z.ZodArray) return arrayContract(schema);
			if (schema instanceof z.ZodUnion) return unionContract(schema);
			if (schema instanceof z.ZodOptional || schema instanceof z.ZodExactOptional || schema instanceof z.ZodNullable || schema instanceof z.ZodDefault || schema instanceof z.ZodPrefault || schema instanceof z.ZodNonOptional || schema instanceof z.ZodReadonly) {
				const child = getEvidenceInputContract(schema.unwrap());
				if (!child.hasEvidence) return identity$1(schema, child.hasEvidenceReferenceAlternative);
				return {
					hasEvidence: true,
					hasEvidenceReferenceAlternative: child.hasEvidenceReferenceAlternative,
					frameSchema: replaceWrappedSchema(schema, child.frameSchema),
					resolve: (input, visit, path = []) => input === undefined || input === null && schema instanceof z.ZodNullable ? ok(input) : child.resolve(input, visit, path)
				};
			}
			return identity$1(schema);
		};
		replaceWrappedSchema = (schema, innerType) => {
			const definition = {
				...schema.def,
				innerType
			};
			return z.clone(schema, definition, { parent: true });
		};
		objectContract = (schema) => {
			const children = Object.entries(schema.shape).map(([key, child]) => [key, getEvidenceInputContract(child)]);
			const selected = children.filter(([, child]) => child.hasEvidence);
			const hasEvidenceReferenceAlternative = children.some(([, child]) => child.hasEvidenceReferenceAlternative);
			if (selected.length === 0) return identity$1(schema, hasEvidenceReferenceAlternative);
			return {
				hasEvidence: true,
				hasEvidenceReferenceAlternative,
				frameSchema: schema.clone({
					...schema.def,
					shape: Object.fromEntries(children.map(([key, child]) => [key, child.frameSchema]))
				}, { parent: true }),
				resolve: (input, visit, path = []) => {
					if (typeof input !== "object" || input === null || Array.isArray(input)) return ok(input);
					let result = input;
					for (const [key, child] of selected) {
						if (!Object.hasOwn(result, key)) continue;
						const value = child.resolve(result[key], visit, [...path, key]);
						if (!value.ok) return value;
						if (value.value !== result[key]) result = {
							...result,
							[key]: value.value
						};
					}
					return ok(result);
				}
			};
		};
		arrayContract = (schema) => {
			const child = getEvidenceInputContract(schema.element);
			if (!child.hasEvidence) return identity$1(schema, child.hasEvidenceReferenceAlternative);
			return {
				hasEvidence: true,
				hasEvidenceReferenceAlternative: child.hasEvidenceReferenceAlternative,
				frameSchema: schema.clone({
					...schema.def,
					element: child.frameSchema
				}, { parent: true }),
				resolve: (input, visit, path = []) => {
					if (!Array.isArray(input)) return ok(input);
					let result = input;
					for (const [index, item] of input.entries()) {
						const value = child.resolve(item, visit, [...path, index]);
						if (!value.ok) return value;
						if (value.value !== item) {
							if (result === input) result = input.slice();
							result[index] = value.value;
						}
					}
					return ok(result);
				}
			};
		};
		unionContract = (schema) => {
			const options = schema.options.map((option) => getEvidenceInputContract(option));
			const hasEvidenceReferenceAlternative = options.some((option) => option.hasEvidenceReferenceAlternative);
			if (!options.some((option) => option.hasEvidence)) return identity$1(schema, hasEvidenceReferenceAlternative);
			const branches = new WeakMap();
			const frame = z.union(options.map((option) => option.frameSchema.transform((value) => {
				if (typeof value === "object" && value !== null) branches.set(value, option);
				return value;
			})));
			return {
				hasEvidence: true,
				hasEvidenceReferenceAlternative,
				frameSchema: frame.clone({
					...frame.def,
					...schema.def.error === undefined ? {} : { error: schema.def.error },
					...schema.def.checks === undefined ? {} : { checks: schema.def.checks }
				}),
				resolve: (input, visit, path = []) => {
					const selected = typeof input === "object" && input !== null ? branches.get(input) : undefined;
					return selected?.resolve(input, visit, path) ?? ok(input);
				}
			};
		};
	})))();
}

//#endregion
//#region dist/domain/evidenceReference.js
var retainedEvidenceReferenceSchema, evidenceFileReferenceSchema, evidenceInputSchema, borrowEvidenceInput, borrowEvidenceArray, evidenceSourceInputSchema;
function init_evidenceReference() {
	return (init_evidenceReference = __esmMin((() => {
		init_digests();
		init_localPath();
		init_evidenceInputContract();
		init_evidence();
		retainedEvidenceReferenceSchema = z.strictObject({
			kind: z.literal("retained-evidence"),
			evidence_id: prefixedDigestSchema("ev")
		});
		evidenceFileReferenceSchema = z.strictObject({
			kind: z.literal("evidence-file"),
			path: absoluteLocalPathStringSchema.describe("Absolute local path of one completed Evidence JSON file, or of an Evidence bundle written by --evidence_output or export_evidence_bundle. REA reads and authenticates it, then uses it like retained Evidence, so large records are not charged as inline input."),
			evidence_id: prefixedDigestSchema("ev").exactOptional().describe("The record to select when the file is an Evidence bundle, such as a summary's normalized_result.parent_evidence_id. A bundle holding exactly one record needs no selection.")
		});
		evidenceInputSchema = declareEvidenceInput(z.union([evidenceSchema, retainedEvidenceReferenceSchema]));
		borrowEvidenceInput = () => {
			const input = z.unknown().nonoptional();
			input._zod.processJSONSchema = evidenceInputSchema._zod.processJSONSchema;
			return declareBorrowedEvidenceInput(input, evidenceInputSchema);
		};
		borrowEvidenceArray = () => {
			const declaration = z.array(evidenceInputSchema);
			const input = z.custom(Array.isArray);
			input._zod.processJSONSchema = declaration._zod.processJSONSchema;
			return declareBorrowedEvidenceInput(input, declaration);
		};
		evidenceSourceInputSchema = declareEvidenceReferenceAlternative(z.union([...evidenceInputSchema.options, evidenceFileReferenceSchema]));
	})))();
}

//#endregion
//#region dist/domain/functionComparisonSchemas.js
var comparisonStatusSchema, functionComparisonDimensionNameSchema, evidenceIdSchema$2, functionComparisonInputSchema, textDeltaSchema, functionDimensionContextShape, functionDimensionSchema, functionMatchSchema, functionComparisonResultSchema;
function init_functionComparisonSchemas() {
	return (init_functionComparisonSchemas = __esmMin((() => {
		init_functionComparisonResults();
		init_comparisonSemantics();
		init_evidenceReference();
		init_digests();
		init_nativeAddress();
		comparisonStatusSchema = z.enum([
			"unchanged",
			"changed",
			"unknown"
		]);
		functionComparisonDimensionNameSchema = z.enum([
			"identity",
			"pseudocode",
			"assembly",
			"comments",
			"calls",
			"references",
			"strings_names",
			"cfg"
		]);
		evidenceIdSchema$2 = prefixedDigestSchema("ev");
		functionComparisonInputSchema = z.strictObject({
			left: evidenceInputSchema,
			right: evidenceInputSchema
		});
		textDeltaSchema = z.object({
			added_lines: z.int().min(0),
			removed_lines: z.int().min(0),
			hunks: z.int().min(0)
		});
		functionDimensionContextShape = {
			dimension: functionComparisonDimensionNameSchema,
			left_count: z.int().min(0).nullable(),
			right_count: z.int().min(0).nullable(),
			evidence_links: z.array(evidenceIdSchema$2).min(2),
			limitations: z.array(z.string())
		};
		functionDimensionSchema = z.union([
			z.object({
				...functionDimensionContextShape,
				status: z.literal("unchanged"),
				left_digest: digestSchema,
				right_digest: digestSchema,
				text_delta: textDeltaSchema.nullable(),
				conclusion_kind: z.literal("derived_relationship")
			}),
			z.object({
				...functionDimensionContextShape,
				status: z.literal("changed"),
				left_digest: digestSchema,
				right_digest: digestSchema,
				text_delta: textDeltaSchema.nullable(),
				conclusion_kind: z.enum(["derived_relationship", "contradiction"])
			}),
			z.object({
				...functionDimensionContextShape,
				status: z.literal("unknown"),
				left_digest: z.null(),
				right_digest: z.null(),
				text_delta: z.null(),
				conclusion_kind: z.literal("unresolved_branch")
			})
		]);
		functionMatchSchema = z.union([
			z.object({
				status: z.literal("matched"),
				method: z.literal("symbol"),
				left_name: z.string(),
				right_name: z.string()
			}),
			z.object({
				status: z.literal("matched"),
				method: z.literal("same-entry"),
				entry_address: nativeAddressSchema,
				left_name: z.string(),
				right_name: z.string()
			}),
			z.object({
				status: z.enum(["mismatched", "ambiguous"]),
				method: z.literal("explicit"),
				left_name: z.string(),
				right_name: z.string()
			})
		]);
		functionComparisonResultSchema = z.object({
			status: comparisonStatusSchema,
			function_match: functionMatchSchema,
			left_subject_sha256: digestSchema,
			right_subject_sha256: digestSchema,
			summary: z.object({
				unchanged: z.int().min(0),
				changed: z.int().min(0),
				unknown: z.int().min(0)
			}),
			dimensions: z.array(functionDimensionSchema).length(functionComparisonDimensionNameSchema.options.length),
			changes: z.array(functionDimensionSchema),
			limitations: z.array(z.string())
		}).superRefine((result, context) => {
			const dimensions = new Map();
			for (const [index, dimension] of result.dimensions.entries()) {
				if (dimensions.has(dimension.dimension)) context.addIssue({
					code: "custom",
					path: [
						"dimensions",
						index,
						"dimension"
					],
					message: "Function comparison dimensions must occur exactly once."
				});
				dimensions.set(dimension.dimension, dimension);
			}
			const expectedSummary = summarize(result.dimensions);
			for (const status of comparisonStatusSchema.options) if (result.summary[status] !== expectedSummary[status]) context.addIssue({
				code: "custom",
				path: ["summary", status],
				message: "Function comparison summary must count its dimensions."
			});
			const changes = new Set();
			for (const [index, change] of result.changes.entries()) {
				const dimension = dimensions.get(change.dimension);
				if (changes.has(change.dimension) || dimension === undefined || change.status === "unchanged" || canonicalJson(change) !== canonicalJson(dimension)) context.addIssue({
					code: "custom",
					path: ["changes", index],
					message: "Function comparison changes must cite each changed or unknown dimension exactly as recorded."
				});
				changes.add(change.dimension);
			}
			if (result.dimensions.some(({ dimension, status }) => status !== "unchanged" && !changes.has(dimension))) context.addIssue({
				code: "custom",
				path: ["changes"],
				message: "Function comparison changes must include every changed or unknown dimension."
			});
			if (result.status !== overallStatus(result.dimensions, result.function_match.status)) context.addIssue({
				code: "custom",
				path: ["status"],
				message: "Function comparison status contradicts its dimensions or function match."
			});
		});
	})))();
}

//#endregion
//#region dist/domain/residualUnknown.js
var evidenceIdSchema$1, unknownIdSchema, text, environmentRequirementSchema, stableUnknownId, probeSchema, comparisonConclusionScopeSchema, relationshipSchema, resolutionSchema, residualUnknownObjectSchema, refineRevision, residualUnknownSchema, generatedRevisionSchema, recordUnknownInputSchema, updateUnknownInputSchema, createResidualUnknown, updateResidualUnknown, createRevision, projectRevisionDetails, computeRevisionDigest, sameOrderedValues, sortedRelationships;
function init_residualUnknown() {
	return (init_residualUnknown = __esmMin((() => {
		init_canonicalOrdering();
		init_canonicalDigest();
		init_unicodeCodePointOrder();
		init_digests();
		init_functionComparisonSchemas();
		evidenceIdSchema$1 = prefixedDigestSchema("ev");
		unknownIdSchema = prefixedDigestSchema("unk");
		text = z.string().trim().min(1);
		environmentRequirementSchema = z.strictObject({
			id: z.string().min(1).nullable(),
			platform: z.string().min(1).nullable(),
			architecture: z.string().min(1).nullable(),
			isolation: z.enum([
				"none",
				"process",
				"container",
				"virtual-machine"
			]).nullable()
		});
		stableUnknownId = (question, domain, scopeDigest, comparisonConclusionScope) => `unk_${digestCanonicalValue({
			domain: domain.trim(),
			question: question.replace(/\s+/gu, " ").trim(),
			scope_digest: scopeDigest,
			...comparisonConclusionScope === undefined ? {} : { comparison_conclusion_scope: comparisonConclusionScope }
		}, "Unknown identity")}`;
		probeSchema = z.strictObject({
			operation: z.string().min(1),
			rationale: text
		});
		comparisonConclusionScopeSchema = z.object({
			comparison_evidence_id: evidenceIdSchema$1,
			dimensions: z.array(z.union([z.literal("overall"), functionComparisonDimensionNameSchema])).min(1)
		}).strict().superRefine(({ dimensions }, context) => {
			if (!sameOrderedValues(dimensions, uniqueSorted$1(dimensions))) context.addIssue({
				code: "custom",
				message: "Comparison dimensions must be sorted and unique"
			});
		});
		relationshipSchema = z.strictObject({
			type: z.enum([
				"depends-on",
				"related-to",
				"contradicts"
			]),
			unknown_id: unknownIdSchema
		});
		resolutionSchema = z.discriminatedUnion("disposition", [z.strictObject({
			disposition: z.literal("verified"),
			rationale: text,
			evidence_ids: z.array(evidenceIdSchema$1).min(1)
		}), z.strictObject({
			disposition: z.enum(["withdrawn", "out-of-scope"]),
			rationale: text,
			evidence_ids: z.array(evidenceIdSchema$1)
		})]);
		residualUnknownObjectSchema = z.strictObject({
			unknown_id: unknownIdSchema,
			revision: z.int().min(1),
			previous_revision_digest: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
			revision_digest: z.string().regex(/^[a-f0-9]{64}$/u),
			scope_digest: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
			question: text,
			status: z.enum([
				"open",
				"investigating",
				"blocked",
				"contradicted",
				"resolved"
			]),
			severity: z.enum([
				"low",
				"medium",
				"high",
				"critical"
			]),
			domain: text,
			comparison_conclusion_scope: comparisonConclusionScopeSchema.exactOptional(),
			supporting_evidence_ids: z.array(evidenceIdSchema$1),
			contradicting_evidence_ids: z.array(evidenceIdSchema$1),
			required_authority: z.enum([
				"shipped-artifact",
				"controlled-replay",
				"historical-reference",
				"external-service",
				"analyst-inference"
			]).nullable(),
			required_confidence: z.enum([
				"observed",
				"derived",
				"inferred"
			]),
			required_environment: environmentRequirementSchema.nullable(),
			recommended_probes: z.array(probeSchema),
			relationships: z.array(relationshipSchema),
			resolution: resolutionSchema.nullable(),
			mutation_evidence_ids: z.array(evidenceIdSchema$1).min(1)
		});
		refineRevision = (value, context) => {
			if (value.unknown_id !== stableUnknownId(value.question, value.domain, value.scope_digest, value.comparison_conclusion_scope)) context.addIssue({
				code: "custom",
				message: "Residual unknown ID does not match its immutable identity",
				path: ["unknown_id"]
			});
			if (value.revision === 1 !== (value.previous_revision_digest === null)) context.addIssue({
				code: "custom",
				message: "Only the first revision has no predecessor",
				path: ["previous_revision_digest"]
			});
			if (value.status === "resolved" !== (value.resolution !== null)) context.addIssue({
				code: "custom",
				message: "Only resolved unknowns carry a resolution",
				path: ["resolution"]
			});
			if (value.status === "contradicted" && value.contradicting_evidence_ids.length === 0) context.addIssue({
				code: "custom",
				message: "Contradicted status requires contradicting evidence",
				path: ["contradicting_evidence_ids"]
			});
			if (value.relationships.some((relationship) => relationship.unknown_id === value.unknown_id)) context.addIssue({
				code: "custom",
				message: "An unknown cannot relate to itself",
				path: ["relationships"]
			});
			for (const ids of [
				value.supporting_evidence_ids,
				value.contradicting_evidence_ids,
				value.mutation_evidence_ids
			]) if (new Set(ids).size !== ids.length) context.addIssue({
				code: "custom",
				message: "Evidence IDs must be unique"
			});
			if (value.comparison_conclusion_scope !== undefined && ![...value.supporting_evidence_ids, ...value.contradicting_evidence_ids].includes(value.comparison_conclusion_scope.comparison_evidence_id)) context.addIssue({
				code: "custom",
				message: "Scoped comparison Evidence must support or contradict the unknown",
				path: ["comparison_conclusion_scope"]
			});
			if (value.comparison_conclusion_scope !== undefined && value.domain !== "function-comparison") context.addIssue({
				code: "custom",
				message: "Comparison conclusion scope requires function-comparison domain",
				path: ["comparison_conclusion_scope"]
			});
			const contradictingEvidence = new Set(value.contradicting_evidence_ids);
			if (value.supporting_evidence_ids.some((id) => contradictingEvidence.has(id))) context.addIssue({
				code: "custom",
				message: "Evidence cannot simultaneously support and contradict"
			});
			const relationships = value.relationships.map((relationship) => `${relationship.type}:${relationship.unknown_id}`);
			if (new Set(relationships).size !== relationships.length) context.addIssue({
				code: "custom",
				message: "Relationships must be unique",
				path: ["relationships"]
			});
		};
		residualUnknownSchema = residualUnknownObjectSchema.superRefine((value, context) => {
			if (computeRevisionDigest(value) !== value.revision_digest) context.addIssue({
				code: "custom",
				message: "Residual unknown revision digest does not match",
				path: ["revision_digest"]
			});
			refineRevision(value, context);
		});
		generatedRevisionSchema = residualUnknownObjectSchema.omit({ revision_digest: true }).superRefine(refineRevision);
		recordUnknownInputSchema = residualUnknownObjectSchema.omit({
			unknown_id: true,
			revision: true,
			previous_revision_digest: true,
			revision_digest: true,
			scope_digest: true,
			status: true,
			supporting_evidence_ids: true,
			contradicting_evidence_ids: true,
			resolution: true,
			mutation_evidence_ids: true
		}).extend({
			supporting_evidence_ids: z.array(evidenceIdSchema$1).default([]),
			contradicting_evidence_ids: z.array(evidenceIdSchema$1).default([])
		}).strict();
		updateUnknownInputSchema = z.strictObject({
			unknown_id: unknownIdSchema,
			expected_revision: z.int().min(1),
			status: residualUnknownObjectSchema.shape.status,
			severity: residualUnknownObjectSchema.shape.severity,
			supporting_evidence_ids: z.array(evidenceIdSchema$1),
			contradicting_evidence_ids: z.array(evidenceIdSchema$1),
			required_authority: residualUnknownObjectSchema.shape.required_authority,
			required_confidence: residualUnknownObjectSchema.shape.required_confidence,
			required_environment: environmentRequirementSchema.nullable(),
			recommended_probes: z.array(probeSchema),
			relationships: z.array(relationshipSchema),
			resolution: resolutionSchema.nullable()
		});
		createResidualUnknown = (input, mutationEvidenceId, scopeDigest) => {
			const question = input.question.replace(/\s+/gu, " ").trim();
			const domain = input.domain.trim();
			const comparisonConclusionScope = input.comparison_conclusion_scope === undefined ? undefined : {
				comparison_evidence_id: input.comparison_conclusion_scope.comparison_evidence_id,
				dimensions: input.comparison_conclusion_scope.dimensions
			};
			const revision = {
				unknown_id: stableUnknownId(question, domain, scopeDigest, comparisonConclusionScope),
				revision: 1,
				previous_revision_digest: null,
				scope_digest: scopeDigest,
				question,
				status: input.contradicting_evidence_ids.length > 0 ? "contradicted" : "open",
				domain,
				...comparisonConclusionScope === undefined ? {} : { comparison_conclusion_scope: comparisonConclusionScope },
				...projectRevisionDetails(input),
				resolution: null,
				mutation_evidence_ids: [mutationEvidenceId]
			};
			return createRevision(revision);
		};
		updateResidualUnknown = (current, input, mutationEvidenceId) => {
			const revision = {
				unknown_id: current.unknown_id,
				revision: current.revision + 1,
				previous_revision_digest: current.revision_digest,
				scope_digest: current.scope_digest,
				question: current.question,
				status: input.status,
				domain: current.domain,
				...current.comparison_conclusion_scope === undefined ? {} : { comparison_conclusion_scope: current.comparison_conclusion_scope },
				...projectRevisionDetails(input),
				resolution: input.resolution,
				mutation_evidence_ids: uniqueSorted$1([...current.mutation_evidence_ids, mutationEvidenceId])
			};
			return createRevision(revision);
		};
		createRevision = (value) => {
			const revision = generatedRevisionSchema.parse(value);
			return {
				...revision,
				revision_digest: computeRevisionDigest(revision)
			};
		};
		projectRevisionDetails = (input) => ({
			severity: input.severity,
			supporting_evidence_ids: uniqueSorted$1(input.supporting_evidence_ids),
			contradicting_evidence_ids: uniqueSorted$1(input.contradicting_evidence_ids),
			required_authority: input.required_authority,
			required_confidence: input.required_confidence,
			required_environment: input.required_environment,
			recommended_probes: [...input.recommended_probes],
			relationships: sortedRelationships(input.relationships)
		});
		computeRevisionDigest = (value) => {
			const { revision_digest: _revisionDigest, ...semantic } = "revision_digest" in value ? value : {
				...value,
				revision_digest: ""
			};
			void _revisionDigest;
			return digestCanonicalValue(semantic, "Unknown identity");
		};
		sameOrderedValues = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
		sortedRelationships = (values) => [...values].sort((left, right) => compareUnicodeCodePoints(compositeKey([left.type, left.unknown_id]), compositeKey([right.type, right.unknown_id])));
	})))();
}

//#endregion
//#region dist/domain/evidenceBundle.js
var artifactManifestBaseSchema, artifactManifestSchema, providerManifestSchema, environmentManifestSchema, scenarioManifestSchema, captureManifestSchema, evidenceBundleSchema, immutableBundles, isImmutableEvidenceBundle, NonCanonicalEvidenceBundleError, DuplicateEvidenceRecordError, createImmutableEvidenceBundle, createEvidenceBundle, evidenceBundleForTarget, referencedEvidenceIds, describeEvidenceBundleFailure, parseEvidenceBundle, parseImmutableEvidenceBundle, safeParseEvidenceBundle, safeParseImmutableEvidenceBundle, parseBundle, readEvidenceBundle, readBundle, authenticateParsedEvidenceBundle, authenticateBundle, validateUnknownGraph, validateVerifiedResolution, validateResidualUnknownAddition, reachesUnknown, evidenceQualifies, rejectDependencyCycles, serializeEvidenceBundle, uniqueSorted;
function init_evidenceBundle() {
	return (init_evidenceBundle = __esmMin((() => {
		init_residualUnknownGraphError();
		init_evidenceSubject();
		init_digests();
		init_evidenceErrors();
		init_analysisErrorCore();
		init_result();
		init_validationFailure();
		init_jsonSerialization();
		init_unicodeCodePointOrder();
		init_evidence();
		init_residualUnknown();
		init_immutableJson();
		artifactManifestBaseSchema = z.strictObject({ digest: z.strictObject({ sha256: digestSchema }) });
		artifactManifestSchema = withEvidenceSubjectDeclaration(artifactManifestBaseSchema);
		providerManifestSchema = providerSchema;
		environmentManifestSchema = evidenceSchema.shape.environment.unwrap();
		scenarioManifestSchema = z.strictObject({
			evidence_id: evidenceSchema.shape.evidence_id,
			operation: z.string().min(1),
			authority: z.literal("controlled-replay")
		});
		captureManifestSchema = z.strictObject({
			evidence_id: evidenceSchema.shape.evidence_id,
			predicate_type: z.string().min(1)
		});
		evidenceBundleSchema = z.strictObject({
			artifacts: z.array(artifactManifestSchema),
			providers: z.array(providerManifestSchema),
			environments: z.array(environmentManifestSchema),
			scenarios: z.array(scenarioManifestSchema),
			captures: z.array(captureManifestSchema),
			unknowns: z.array(residualUnknownSchema),
			records: z.array(evidenceSchema)
		});
		immutableBundles = new WeakMap();
		isImmutableEvidenceBundle = (input) => typeof input === "object" && input !== null && immutableBundles.has(input);
		NonCanonicalEvidenceBundleError = class extends TypeError {
			constructor() {
				super("Evidence bundle manifests are not canonical");
				this.name = "NonCanonicalEvidenceBundleError";
			}
		};
		DuplicateEvidenceRecordError = class extends TypeError {
			constructor() {
				super("Evidence bundle contains duplicate record IDs");
				this.name = "DuplicateEvidenceRecordError";
			}
		};
		createImmutableEvidenceBundle = (records, unknowns = []) => {
			const checkedRecords = records.map(immutableEvidence);
			if (new Set(checkedRecords.map(({ evidence_id }) => evidence_id)).size !== checkedRecords.length) throw new DuplicateEvidenceRecordError();
			const checkedUnknowns = unknowns.map((unknown) => residualUnknownSchema.parse(unknown));
			validateUnknownGraph(checkedUnknowns, checkedRecords);
			const bundle = freezeJsonSnapshot(createEvidenceBundle(checkedRecords, checkedUnknowns));
			immutableBundles.set(bundle, bundle);
			return bundle;
		};
		createEvidenceBundle = (records, unknowns = []) => {
			const sortedRecords = [...records].sort((left, right) => compareUnicodeCodePoints(left.evidence_id, right.evidence_id));
			return {
				artifacts: uniqueSorted(sortedRecords.flatMap(({ subject }) => subject === null ? [] : [artifactManifestSchema.parse({
					digest: subject.digest,
					format: subject.format,
					architecture: subject.architecture
				})])),
				providers: uniqueSorted(sortedRecords.map(({ provider }) => provider)),
				environments: uniqueSorted(sortedRecords.flatMap(({ environment }) => environment === null ? [] : [environment])),
				scenarios: sortedRecords.flatMap((evidence) => evidence.authority === "controlled-replay" ? [{
					evidence_id: evidence.evidence_id,
					operation: evidence.operation,
					authority: evidence.authority
				}] : []),
				captures: sortedRecords.flatMap((evidence) => evidence.predicate_type === "rea.process-capture" ? [{
					evidence_id: evidence.evidence_id,
					predicate_type: evidence.predicate_type
				}] : []),
				unknowns: [...unknowns].sort((left, right) => compareUnicodeCodePoints(left.unknown_id, right.unknown_id) || left.revision - right.revision),
				records: sortedRecords
			};
		};
		evidenceBundleForTarget = (bundle, sha256) => {
			const recordsById = new Map(bundle.records.map((record) => [record.evidence_id, record]));
			const histories = new Map();
			for (const unknown of bundle.unknowns) {
				const history = histories.get(unknown.unknown_id) ?? [];
				history.push(unknown);
				histories.set(unknown.unknown_id, history);
			}
			const retained = new Set();
			const dependents = new Map();
			const relationships = new Map();
			for (const [id, history] of histories) {
				const eligible = history.every((unknown) => {
					if (unknown.scope_digest !== sha256) return false;
					const mutationEvidenceIds = new Set(unknown.mutation_evidence_ids);
					return referencedEvidenceIds(unknown).every((evidenceId) => {
						const record = recordsById.get(evidenceId);
						return record?.subject?.digest.sha256 === sha256 || mutationEvidenceIds.has(evidenceId) && record?.predicate_type === "rea.residual-unknown-mutation";
					});
				});
				if (!eligible) continue;
				retained.add(id);
				const relatedIds = new Set(history.flatMap((unknown) => unknown.relationships.map(({ unknown_id }) => unknown_id)));
				relationships.set(id, relatedIds);
				for (const relatedId of relatedIds) {
					const references = dependents.get(relatedId) ?? new Set();
					references.add(id);
					dependents.set(relatedId, references);
				}
			}
			const pending = [];
			for (const [id, relatedIds] of relationships) if ([...relatedIds].some((relatedId) => !retained.has(relatedId))) pending.push(id);
			for (let index = 0; index < pending.length; index += 1) {
				const id = pending[index];
				if (id === undefined || !retained.delete(id)) continue;
				for (const dependent of dependents.get(id) ?? []) pending.push(dependent);
			}
			const unknowns = bundle.unknowns.filter((unknown) => retained.has(unknown.unknown_id));
			const mutationIds = new Set(unknowns.flatMap(({ mutation_evidence_ids: ids }) => ids));
			const selectedIds = new Set(bundle.records.filter((record) => record.subject?.digest.sha256 === sha256 || mutationIds.has(record.evidence_id)).map((record) => record.evidence_id));
			const pendingEvidence = [...selectedIds];
			for (let index = 0; index < pendingEvidence.length; index += 1) {
				const record = recordsById.get(pendingEvidence[index] ?? "");
				for (const id of record?.evidence_links ?? []) {
					if (!selectedIds.has(id) && recordsById.has(id)) {
						selectedIds.add(id);
						pendingEvidence.push(id);
					}
				}
			}
			return createEvidenceBundle(bundle.records.filter((record) => selectedIds.has(record.evidence_id)), unknowns);
		};
		referencedEvidenceIds = (unknown) => [
			...unknown.supporting_evidence_ids,
			...unknown.contradicting_evidence_ids,
			...unknown.mutation_evidence_ids,
			...unknown.resolution?.evidence_ids ?? []
		];
		describeEvidenceBundleFailure = (input, cause) => {
			try {
				const record = parseEvidence(input);
				return {
					kind: "single-record",
					cause,
					message: `Expected an Evidence bundle with records and manifest arrays, but this JSON is one Evidence record (${record.evidence_id}). Export a session bundle with the MCP export_evidence_bundle tool and supply that file.`
				};
			} catch (recordFailure) {
				if (!(recordFailure instanceof z.ZodError)) throw recordFailure;
				return {
					kind: "invalid-bundle",
					cause,
					message: cause instanceof z.ZodError ? `Evidence bundle does not match the bundle schema ${describeValidationFailure(cause)}. Supply an unmodified bundle produced by this REA identity format. Recreate observations from earlier formats; re-exporting an old bundle does not update its identities.` : `Evidence bundle validation failed: ${describeValidationFailure(cause)}. Recreate or re-export the bundle, then try again.`
				};
			}
		};
		parseEvidenceBundle = (input) => {
			return parseBundle(input, false);
		};
		parseImmutableEvidenceBundle = (input) => parseBundle(input, true);
		safeParseEvidenceBundle = (input) => readBundle(input, false);
		safeParseImmutableEvidenceBundle = (input) => readBundle(input, true);
		parseBundle = (input, seal) => {
			if (typeof input === "object" && input !== null) {
				const owned = immutableBundles.get(input);
				if (owned !== undefined) return owned;
			}
			return authenticateBundle(evidenceBundleSchema.parse(input), seal);
		};
		readEvidenceBundle = (input, context) => {
			const parsed = safeParseEvidenceBundle(input);
			if (parsed.ok) return parsed;
			const { cause, kind, message } = parsed.error;
			if (kind === "single-record") return err(new AnalysisInputError(context.operation, {
				cause,
				userMessage: message,
				remediationAction: message
			}, [{
				path: context.path,
				reason: "invalid_value",
				message
			}]));
			return err(new EvidenceIntegrityError(cause.message, {
				cause,
				userMessage: message
			}));
		};
		readBundle = (input, seal) => {
			try {
				return ok(seal ? parseImmutableEvidenceBundle(input) : parseEvidenceBundle(input));
			} catch (cause) {
				if (!(cause instanceof z.ZodError) && !(cause instanceof DuplicateEvidenceRecordError) && !(cause instanceof InvalidResidualUnknownGraphError) && !(cause instanceof NonCanonicalEvidenceBundleError)) throw cause;
				return err(describeEvidenceBundleFailure(input, cause));
			}
		};
		authenticateParsedEvidenceBundle = (parsed) => authenticateBundle(parsed, false);
		authenticateBundle = (parsed, seal) => {
			const recordIds = parsed.records.map(({ evidence_id: id }) => id);
			if (new Set(recordIds).size !== recordIds.length) throw new DuplicateEvidenceRecordError();
			validateUnknownGraph(parsed.unknowns, parsed.records);
			const canonical = createEvidenceBundle(parsed.records.map((record, index) => {
				try {
					if (!seal) return parseEvidence(record);
					record.normalized_result = freezeJsonSnapshot(record.normalized_result);
					record.raw_result = freezeJsonSnapshot(record.raw_result);
					return immutableEvidence(record);
				} catch (cause) {
					if (cause instanceof z.ZodError) throw new z.ZodError(cause.issues.map((issue) => ({
						...issue,
						path: [
							"records",
							index,
							...issue.path
						]
					})));
					throw cause;
				}
			}), parsed.unknowns);
			if (!equalJsonText(parsed, canonical)) throw new NonCanonicalEvidenceBundleError();
			if (seal) {
				freezeJsonSnapshot(canonical);
				immutableBundles.set(canonical, canonical);
			}
			return canonical;
		};
		validateUnknownGraph = (unknowns, records) => {
			const evidenceById = new Map(records.map((record) => [record.evidence_id, record]));
			const histories = new Map();
			for (const unknown of unknowns) {
				const history = histories.get(unknown.unknown_id) ?? [];
				history.push(unknown);
				histories.set(unknown.unknown_id, history);
			}
			const unknownById = new Map();
			for (const [id, unordered] of histories) {
				const history = [...unordered].sort((left, right) => left.revision - right.revision);
				for (const [index, revision] of history.entries()) {
					if (revision.revision !== index + 1) throw new InvalidResidualUnknownGraphError({
						kind: "history_gap",
						unknown_id: id
					});
					if (index > 0 && revision.previous_revision_digest !== history[index - 1]?.revision_digest) throw new InvalidResidualUnknownGraphError({
						kind: "revision_chain",
						unknown_id: id
					});
				}
				const head = history.at(-1);
				if (head === undefined) throw new TypeError("Residual unknown revision history is empty");
				unknownById.set(id, head);
			}
			for (const unknown of unknowns) {
				const referencedEvidence = [
					...unknown.supporting_evidence_ids,
					...unknown.contradicting_evidence_ids,
					...unknown.mutation_evidence_ids,
					...unknown.resolution?.evidence_ids ?? []
				];
				for (const evidenceId of referencedEvidence) if (!evidenceById.has(evidenceId)) throw new InvalidResidualUnknownGraphError({
					kind: "missing_evidence",
					unknown_id: unknown.unknown_id,
					evidence_id: evidenceId
				});
				for (const relationship of unknown.relationships) if (!unknownById.has(relationship.unknown_id)) throw new InvalidResidualUnknownGraphError({
					kind: "missing_unknown",
					unknown_id: unknown.unknown_id,
					related_unknown_id: relationship.unknown_id
				});
				if (unknown.resolution?.disposition === "verified") validateVerifiedResolution(unknown, evidenceById);
			}
			rejectDependencyCycles(unknownById);
		};
		validateVerifiedResolution = (unknown, evidenceById) => {
			if (unknown.contradicting_evidence_ids.length > 0) throw new InvalidResidualUnknownGraphError({
				kind: "contradicting_evidence",
				unknown_id: unknown.unknown_id
			});
			const qualifies = unknown.resolution?.evidence_ids.some((evidenceId) => {
				const evidence = evidenceById.get(evidenceId);
				return unknown.supporting_evidence_ids.includes(evidenceId) && evidence !== undefined && evidence.predicate_type !== "rea.residual-unknown-mutation" && evidenceQualifies(unknown, evidence);
			});
			if (qualifies !== true) throw new InvalidResidualUnknownGraphError({
				kind: "resolution_unproven",
				unknown_id: unknown.unknown_id
			});
		};
		validateResidualUnknownAddition = (unknown, evidenceById, currentHeads) => {
			const current = currentHeads.get(unknown.unknown_id);
			if (current === undefined ? unknown.revision !== 1 || unknown.previous_revision_digest !== null : unknown.revision !== current.revision + 1 || unknown.previous_revision_digest !== current.revision_digest) throw new InvalidResidualUnknownGraphError({
				kind: "revision_chain",
				unknown_id: unknown.unknown_id
			});
			for (const evidenceId of referencedEvidenceIds(unknown)) if (!evidenceById.has(evidenceId)) throw new InvalidResidualUnknownGraphError({
				kind: "missing_evidence",
				unknown_id: unknown.unknown_id,
				evidence_id: evidenceId
			});
			for (const relationship of unknown.relationships) if (relationship.unknown_id !== unknown.unknown_id && !currentHeads.has(relationship.unknown_id)) throw new InvalidResidualUnknownGraphError({
				kind: "missing_unknown",
				unknown_id: unknown.unknown_id,
				related_unknown_id: relationship.unknown_id
			});
			if (unknown.resolution?.disposition === "verified") validateVerifiedResolution(unknown, evidenceById);
			if (current !== undefined) {
				const dependencies = unknown.relationships.filter((relationship) => relationship.type === "depends-on").map(({ unknown_id }) => unknown_id);
				if (dependencies.length > 0 && reachesUnknown(dependencies, unknown.unknown_id, currentHeads, unknown)) throw new InvalidResidualUnknownGraphError({
					kind: "dependency_cycle",
					unknown_id: unknown.unknown_id
				});
			}
		};
		reachesUnknown = (starts, goal, currentHeads, candidate) => {
			const pending = [...starts];
			const visited = new Set();
			while (pending.length > 0) {
				const id = pending.pop();
				if (id === undefined) break;
				if (id === goal) return true;
				if (visited.has(id)) continue;
				visited.add(id);
				const unknown = id === candidate.unknown_id ? candidate : currentHeads.get(id);
				if (unknown === undefined) continue;
				for (const relationship of unknown.relationships) if (relationship.type === "depends-on") pending.push(relationship.unknown_id);
			}
			return false;
		};
		evidenceQualifies = (unknown, evidence) => {
			if (unknown.required_authority !== null && evidence.authority !== unknown.required_authority) return false;
			const confidenceRank = {
				inferred: 1,
				derived: 2,
				observed: 3
			};
			if (confidenceRank[evidence.confidence] < confidenceRank[unknown.required_confidence]) return false;
			const requirement = unknown.required_environment;
			if (requirement === null) return true;
			if (evidence.environment === null) return false;
			return (requirement.id === null || requirement.id === evidence.environment.id) && (requirement.platform === null || requirement.platform === evidence.environment.platform) && (requirement.architecture === null || requirement.architecture === evidence.environment.architecture) && (requirement.isolation === null || requirement.isolation === evidence.environment.isolation);
		};
		rejectDependencyCycles = (unknownById) => {
			const visited = new Set();
			const active = new Set();
			const pending = [];
			for (const root of unknownById.keys()) {
				if (visited.has(root)) continue;
				const rootUnknown = unknownById.get(root);
				if (rootUnknown === undefined) throw new TypeError("Residual unknown dependency graph is inconsistent");
				active.add(root);
				pending.push({
					id: root,
					relationships: rootUnknown.relationships,
					nextRelationship: 0
				});
				while (pending.length > 0) {
					const frame = pending[pending.length - 1];
					if (frame === undefined) break;
					let descended = false;
					while (frame.nextRelationship < frame.relationships.length) {
						const relationship = frame.relationships[frame.nextRelationship];
						frame.nextRelationship += 1;
						if (relationship?.type !== "depends-on") continue;
						const dependency = relationship.unknown_id;
						if (active.has(dependency)) throw new InvalidResidualUnknownGraphError({
							kind: "dependency_cycle",
							unknown_id: dependency
						});
						if (visited.has(dependency)) continue;
						const unknown = unknownById.get(dependency);
						if (unknown === undefined) throw new TypeError("Residual unknown dependency graph is inconsistent");
						active.add(dependency);
						pending.push({
							id: dependency,
							relationships: unknown.relationships,
							nextRelationship: 0
						});
						descended = true;
						break;
					}
					if (descended) continue;
					pending.pop();
					active.delete(frame.id);
					visited.add(frame.id);
				}
			}
		};
		serializeEvidenceBundle = (bundle) => {
			const serialized = canonicalize(parseEvidenceBundle(bundle));
			if (serialized === undefined) throw new TypeError("Evidence bundle canonicalization failed");
			return serialized;
		};
		uniqueSorted = (values) => {
			const unique = new Map();
			for (const value of values) unique.set(JSON.stringify(value), value);
			return [...unique.entries()].sort(([left], [right]) => compareUnicodeCodePoints(left, right)).map(([, value]) => value);
		};
	})))();
}

//#endregion
//#region dist/domain/rawBinary.js
var BINARY_ARCHITECTURES, binaryArchitectureSchema, RAW_BINARY_ENTRY_POINT, rawBinaryEntryPointSchema, parseRawBinaryEntryPoint, validateRawBinaryLength, addressWidth, admitRawBinary, rawBinarySelectionError;
function init_rawBinary() {
	return (init_rawBinary = __esmMin((() => {
		init_result();
		BINARY_ARCHITECTURES = [
			"x86",
			"x86_64",
			"arm",
			"arm64",
			"6502",
			"m68k"
		];
		binaryArchitectureSchema = z.enum(BINARY_ARCHITECTURES);
		RAW_BINARY_ENTRY_POINT = /^0x[0-9A-Fa-f]{1,16}$/u;
		rawBinaryEntryPointSchema = z.string().regex(RAW_BINARY_ENTRY_POINT, { message: "entry_point must be a hexadecimal address of the form 0x…" });
		parseRawBinaryEntryPoint = (value) => {
			if (!RAW_BINARY_ENTRY_POINT.test(value)) return err("entry_point must be a hexadecimal address of the form 0x…");
			const parsed = BigInt(value);
			return ok({
				source: value,
				canonical: `0x${parsed.toString(16)}`,
				value: parsed
			});
		};
		validateRawBinaryLength = (length) => Number.isSafeInteger(length) && length >= 1 ? ok(null) : err("raw-binary requires at least one file byte");
		addressWidth = (architecture) => architecture === "6502" ? 65535n : architecture === "x86" || architecture === "arm" || architecture === "m68k" ? 4294967295n : 18446744073709551615n;
		admitRawBinary = (input) => {
			const architecture = binaryArchitectureSchema.safeParse(input.architecture);
			if (!architecture.success) return err({
				reason: "raw-binary format requires architecture (x86, x86_64, arm, arm64, 6502, or m68k)",
				constraint: "load_selection_rejected"
			});
			if (typeof input.entryPoint !== "string") return err({
				reason: "raw-binary format requires entry_point as a hexadecimal address of the form 0x…",
				constraint: "load_selection_rejected"
			});
			const entry = parseRawBinaryEntryPoint(input.entryPoint);
			if (!entry.ok) return err({
				reason: entry.error,
				constraint: "load_selection_rejected"
			});
			if ((architecture.data === "arm" || architecture.data === "arm64") && entry.value.value % 4n !== 0n) return err({
				reason: `raw-binary ${architecture.data} entry_point ${entry.value.canonical} must be 4-byte aligned`,
				constraint: "load_selection_rejected"
			});
			if (architecture.data === "m68k" && entry.value.value % 2n !== 0n) return err({
				reason: `raw-binary m68k entry_point ${entry.value.canonical} must be 2-byte aligned`,
				constraint: "load_selection_rejected"
			});
			const length = validateRawBinaryLength(input.fileBytes);
			if (!length.ok) return err({
				reason: length.error,
				constraint: "file_format_rejected"
			});
			const last = entry.value.value + BigInt(input.fileBytes) - 1n;
			const max = addressWidth(architecture.data);
			if (entry.value.value > max || last > max) return err({
				reason: `raw-binary mapping from ${entry.value.canonical} must fit in the ${architecture.data} address width`,
				constraint: "load_selection_rejected"
			});
			return ok({
				architecture: architecture.data,
				entryPoint: entry.value.canonical,
				entryPointSource: entry.value.source
			});
		};
		rawBinarySelectionError = (input) => {
			const hasArchitecture = input.architecture !== undefined;
			const hasEntry = input.entryPoint !== undefined;
			if (input.format === "gamecube-dol") {
				return hasArchitecture ? "format=gamecube-dol takes its architecture from the DOL header; omit architecture" : undefined;
			}
			if (input.format === "raw-binary") {
				if (!hasArchitecture || !hasEntry) return "format=raw-binary requires architecture and entry_point";
				return undefined;
			}
			if (hasArchitecture || hasEntry) return "architecture and entry_point apply only with format=raw-binary";
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/symlinkTarget.js
var observedSymlinkTarget;
function init_symlinkTarget() {
	return (init_symlinkTarget = __esmMin((() => {
		observedSymlinkTarget = (raw) => {
			const decoded = raw.toString("utf8");
			return {
				text: Buffer.from(decoded, "utf8").equals(raw) ? decoded : null,
				hex: raw.toString("hex")
			};
		};
	})))();
}

//#endregion
//#region dist/domain/offsetDateTime.js
var CALENDAR_DATE, CLOCK_TIME, UTC_OFFSET, offsetDateTimeSchema, utcDateTimeSchema, parseOffsetDateTimeInstant, inspectRecordedDateTime, readRecordedDateTime, readRecordedStart, offsetDateTimeInstantFromEpochMilliseconds, fractionalSecondFromMilliseconds, compareOffsetDateTimeInstants;
function init_offsetDateTime() {
	return (init_offsetDateTime = __esmMin((() => {
		CALENDAR_DATE = String.raw`(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))`;
		CLOCK_TIME = String.raw`(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?`;
		UTC_OFFSET = String.raw`(?:Z|[+\x2d](?:[01]\d|2[0-3]):[0-5]\d)`;
		offsetDateTimeSchema = z.string().regex(new RegExp(`^${CALENDAR_DATE}T${CLOCK_TIME}${UTC_OFFSET}$`, "u"), "Use an ISO-8601 date-time with an explicit UTC offset");
		utcDateTimeSchema = z.string().regex(new RegExp(`^${CALENDAR_DATE}T${CLOCK_TIME}Z$`, "u"), "Use an ISO-8601 date-time in UTC");
		parseOffsetDateTimeInstant = (value) => {
			const match = /^(.*?)(?:\.(\d+))?(Z|[+\x2d]\d{2}:\d{2})$/u.exec(value);
			if (match === null) throw new TypeError("Expected a validated offset date-time.");
			const [, dateTime, fractionalDigits, offset] = match;
			if (dateTime === undefined || offset === undefined) throw new TypeError("Expected a validated offset date-time.");
			const wholeSecondMilliseconds = Date.parse(`${dateTime}${offset}`);
			if (!Number.isSafeInteger(wholeSecondMilliseconds) || wholeSecondMilliseconds % 1e3 !== 0) throw new TypeError("Offset date-time is outside the supported time range.");
			return {
				epochSecond: wholeSecondMilliseconds / 1e3,
				fraction: fractionalDigits?.replace(/0+$/u, "") ?? ""
			};
		};
		inspectRecordedDateTime = (value) => {
			const match = /^(\d{4}-\d{2}-\d{2})([T ])(\d{2}:\d{2})(?::(\d{2})(?:\.(\d+))?)?(Z|[+-]\d{2}:?\d{2})?$/u.exec(value);
			if (match === null) return { kind: "unrecognized" };
			const [, date, separator, time, seconds, fraction = "", zone = ""] = match;
			const offset = zone === "" ? "Z" : zone === "Z" || zone.includes(":") ? zone : `${zone.slice(0, 3)}:${zone.slice(3)}`;
			const normalized = offsetDateTimeSchema.safeParse(`${date}T${time}${seconds === undefined ? "" : `:${seconds}`}${fraction === "" ? "" : `.${fraction}`}${offset}`);
			if (!normalized.success) return { kind: "invalid" };
			return {
				kind: "valid",
				reading: {
					instant: parseOffsetDateTimeInstant(normalized.data),
					spelling: {
						separator,
						secondsPresent: seconds !== undefined,
						fractionDigits: fraction.length,
						zone
					}
				}
			};
		};
		readRecordedDateTime = (value) => {
			const inspected = inspectRecordedDateTime(value);
			return inspected.kind === "valid" ? inspected.reading : undefined;
		};
		readRecordedStart = (value) => {
			const inspected = inspectRecordedDateTime(value);
			if (inspected.kind === "valid") return {
				instant: inspected.reading.instant,
				interpretation: "recorded-iso"
			};
			if (inspected.kind === "invalid") return undefined;
			const milliseconds = Date.parse(value);
			return Number.isFinite(milliseconds) ? {
				instant: offsetDateTimeInstantFromEpochMilliseconds(milliseconds),
				interpretation: "native-date"
			} : undefined;
		};
		offsetDateTimeInstantFromEpochMilliseconds = (epochMilliseconds) => {
			if (!Number.isFinite(epochMilliseconds)) throw new TypeError("Expected finite epoch milliseconds.");
			if (Math.abs(epochMilliseconds) > Number.MAX_SAFE_INTEGER) return {
				epochSecond: epochMilliseconds / 1e3,
				fraction: ""
			};
			const epochSecond = Math.floor(epochMilliseconds / 1e3);
			const millisecondsWithinSecond = epochMilliseconds - epochSecond * 1e3;
			return {
				epochSecond,
				fraction: fractionalSecondFromMilliseconds(millisecondsWithinSecond)
			};
		};
		fractionalSecondFromMilliseconds = (milliseconds) => {
			if (milliseconds === 0) return "";
			const [coefficient = "", exponentText] = String(milliseconds).toLowerCase().split("e");
			const exponent = exponentText === undefined ? 0 : Number(exponentText);
			const point = coefficient.indexOf(".");
			const decimalPosition = (point < 0 ? coefficient.length : point) + exponent - 3;
			const digits = coefficient.replace(".", "");
			const fraction = decimalPosition <= 0 ? `0.${"0".repeat(-decimalPosition)}${digits}` : decimalPosition < digits.length ? `${digits.slice(0, decimalPosition)}.${digits.slice(decimalPosition)}` : `${digits}${"0".repeat(decimalPosition - digits.length)}`;
			return (fraction.includes(".") ? fraction.slice(fraction.indexOf(".") + 1) : "").replace(/0+$/u, "");
		};
		compareOffsetDateTimeInstants = (left, right) => {
			if (left.epochSecond !== right.epochSecond) return left.epochSecond < right.epochSecond ? -1 : 1;
			const length = Math.max(left.fraction.length, right.fraction.length);
			for (let index = 0; index < length; index += 1) {
				const leftDigit = left.fraction.charCodeAt(index) || 48;
				const rightDigit = right.fraction.charCodeAt(index) || 48;
				if (leftDigit !== rightDigit) return leftDigit < rightDigit ? -1 : 1;
			}
			return 0;
		};
	})))();
}

//#endregion
//#region dist/domain/jsonRecord.js
var jsonRecordSchema;
function init_jsonRecord() {
	return (init_jsonRecord = __esmMin((() => {
		init_jsonValue();
		jsonRecordSchema = (valueSchema, keySchema = z.string()) => {
			const projection = z.record(keySchema, valueSchema);
			const schema = jsonObjectSchema.transform((value, context) => {
				const entries = [];
				let invalid = false;
				for (const [key, entry] of Object.entries(value)) {
					const parsedKey = keySchema.safeParse(key);
					if (!parsedKey.success) {
						invalid = true;
						context.addIssue({
							code: "invalid_key",
							origin: "record",
							issues: parsedKey.error.issues,
							path: [key]
						});
						continue;
					}
					const parsed = valueSchema.safeParse(entry);
					if (parsed.success) entries.push([parsedKey.data, parsed.data]);
					else {
						invalid = true;
						for (const issue of parsed.error.issues) context.addIssue({
							...issue,
							path: [key, ...issue.path]
						});
					}
				}
				return invalid ? z.NEVER : Object.fromEntries(entries);
			});
			const JsonRecord = z.core.$constructor("JsonRecord", (instance, definition) => {
				z.ZodPipe.init(instance, definition);
				instance._zod.processJSONSchema = (context, json, params) => projection._zod.processJSONSchema(context, json, params);
			});
			return new JsonRecord(schema._zod.def);
		};
	})))();
}

//#endregion
//#region dist/domain/process/processScenario.js
var positiveBudget, processScenarioOutputBudgetProjectionSchema, PROCESS_TERMINAL_CELL_BUDGET, PROCESS_TERMINAL_MIN_COLUMNS, timedEventBase, reservedRunIdEnvironmentName, ENVIRONMENT_NAME_CHARACTER, environmentNamePattern, environmentName, unsupportedPtyEnvironmentName, ptyEnvironmentName, childProcessString, processEnvironmentSchema, fitsProcessTerminalCellBudget, normalizationSchema, digestProcessCommitment, sensitiveProcessInputProjection, committedScenarioEvents, processScenarioCommitment, processComparisonContract, processScenarioSchema, eventsOutOfOrder;
function init_processScenario() {
	return (init_processScenario = __esmMin((() => {
		init_jsonRecord();
		positiveBudget = z.int().safe().positive();
		processScenarioOutputBudgetProjectionSchema = z.object({ output_bytes: positiveBudget }).passthrough();
		PROCESS_TERMINAL_CELL_BUDGET = 1e6;
		PROCESS_TERMINAL_MIN_COLUMNS = 2;
		timedEventBase = { at_ms: z.int().safe().nonnegative() };
		reservedRunIdEnvironmentName = "REA_PROCESS_RUN_ID";
		ENVIRONMENT_NAME_CHARACTER = "[^=\\x00]";
		environmentNamePattern = (reserved) => {
			let rest = `${ENVIRONMENT_NAME_CHARACTER}+`;
			for (let index = reserved.length - 1; index >= 0; index -= 1) {
				const character = reserved[index] ?? "";
				const choice = `[^=\\x00${character}]${ENVIRONMENT_NAME_CHARACTER}*|${character}${rest}`;
				rest = index === 0 ? choice : `(?:${choice})?`;
			}
			return new RegExp(`^(?:${rest})$`, "u");
		};
		environmentName = z.string().min(1, "Environment names must not be empty").regex(environmentNamePattern(reservedRunIdEnvironmentName), { error: (issue) => issue.input === reservedRunIdEnvironmentName ? `${reservedRunIdEnvironmentName} is reserved by the process adapter` : "Environment names cannot contain '=' or NUL" });
		unsupportedPtyEnvironmentName = "__proto__";
		ptyEnvironmentName = environmentName.regex(environmentNamePattern(unsupportedPtyEnvironmentName), { error: "The installed PTY backend cannot preserve the __proto__ environment name; pass it through /usr/bin/env instead." });
		childProcessString = z.string().regex(/^[^\x00]*$/u, "Values passed to operating-system APIs cannot contain NUL");
		processEnvironmentSchema = jsonRecordSchema(childProcessString, ptyEnvironmentName);
		fitsProcessTerminalCellBudget = (columns, rows, scrollback) => rows + scrollback <= Math.floor(PROCESS_TERMINAL_CELL_BUDGET / columns);
		normalizationSchema = z.object({
			paths: z.boolean(),
			pids: z.boolean(),
			ports: z.boolean(),
			time_bucket_ms: positiveBudget,
			patterns: z.array(z.object({
				pattern: z.string(),
				replacement: z.string()
			}))
		});
		digestProcessCommitment = (value) => {
			const serialized = canonicalize(value);
			if (serialized === undefined) throw new TypeError("Process capture commitment is not canonical JSON");
			return createHash("sha256").update(serialized).digest("hex");
		};
		sensitiveProcessInputProjection = (data) => ({
			data: "",
			sensitive: true,
			input_bytes: Buffer.byteLength(data)
		});
		committedScenarioEvents = (events, includeSensitiveInputLength) => events.map((event) => event.type === "input" && event.sensitive ? {
			...event,
			...includeSensitiveInputLength ? sensitiveProcessInputProjection(event.data) : { data: "" }
		} : event);
		processScenarioCommitment = (scenario, executableSha256) => {
			const { finalization_ms: finalizationMs, ...committed } = scenario;
			return {
				...committed,
				...finalizationMs > 0 ? { finalization_ms: finalizationMs } : {},
				events: committedScenarioEvents(scenario.events, true),
				executable_sha256: executableSha256 ?? null
			};
		};
		processComparisonContract = (scenario) => ({
			working_directory: scenario.working_directory,
			environment: scenario.environment,
			ambient_environment: "unknown",
			filesystem_observation_paths: scenario.filesystem_observation_paths,
			terminal: scenario.terminal,
			events: committedScenarioEvents(scenario.events, false),
			timeout_ms: scenario.timeout_ms,
			idle_timeout_ms: scenario.idle_timeout_ms,
			settle_ms: scenario.settle_ms,
			...scenario.finalization_ms > 0 ? { finalization_ms: scenario.finalization_ms } : {},
			limits: scenario.limits,
			normalization: scenario.normalization,
			terminal_observation_version: "deferred-rendered-journal-v1",
			...scenario.events.some((event) => event.type === "input" && event.sensitive) ? { sensitive_input_redaction_version: "literal-terminal-input-v1" } : {},
			...scenario.normalization.pids ? { pid_normalization_version: "sampled-identifiers-v2" } : {},
			...scenario.normalization.paths ? { path_normalization_version: "path-component-boundaries-v4" } : {},
			...scenario.normalization.ports ? { port_normalization_version: "contextual-endpoints-v3" } : {},
			...scenario.normalization.patterns.length > 0 ? { pattern_normalization_version: "literal-replacements-v1" } : {},
			rendered_line_format: "trailing-spaces-trimmed-v1"
		});
		processScenarioSchema = z.strictObject({
			executable: childProcessString.min(1),
			arguments: z.array(childProcessString).default([]),
			working_directory: childProcessString.default("."),
			environment: processEnvironmentSchema.default({}),
			filesystem_observation_paths: z.array(childProcessString.min(1)).default([]),
			terminal: z.strictObject({
				columns: z.int().min(2).max(65535).default(80),
				rows: z.int().min(1).max(65535).default(24),
				scrollback: z.int().safe().nonnegative().default(1e3)
			}).describe("The renderer requires at least 2 columns. The visible terminal and scrollback together must use at most 1,000,000 xterm renderer cells: columns × (rows + scrollback). Resize events use the same minimum width, scrollback and limit. This release has no runtime override.").default({
				columns: 80,
				rows: 24,
				scrollback: 1e3
			}),
			events: z.array(z.discriminatedUnion("type", [
				z.strictObject({
					...timedEventBase,
					type: z.literal("input"),
					data: z.string(),
					sensitive: z.boolean().default(false)
				}),
				z.strictObject({
					...timedEventBase,
					type: z.literal("resize"),
					columns: z.int().min(2).max(65535),
					rows: z.int().min(1).max(65535)
				}),
				z.strictObject({
					...timedEventBase,
					type: z.literal("signal"),
					signal: z.enum([
						"SIGINT",
						"SIGTERM",
						"SIGKILL"
					])
				})
			])).default([]),
			timeout_ms: positiveBudget.default(3e4),
			idle_timeout_ms: positiveBudget.default(3e4),
			settle_ms: z.int().safe().nonnegative().default(100),
			finalization_ms: z.int().safe().nonnegative().default(0).describe("Milliseconds a target may keep running after SIGTERM when timeout_ms or idle_timeout_ms fires, before SIGKILL; 0 sends SIGKILL immediately. Both signals reach the captured root only while its launch-time start identity still matches; cancellation ends the run at once."),
			limits: z.strictObject({
				output_bytes: positiveBudget.default(1e6),
				files: positiveBudget.default(1e4),
				file_bytes: positiveBudget.default(1e7),
				processes: positiveBudget.default(1e3),
				filesystem_depth: z.int().safe().nonnegative().default(16)
			}).strict().default({
				output_bytes: 1e6,
				files: 1e4,
				file_bytes: 1e7,
				processes: 1e3,
				filesystem_depth: 16
			}),
			normalization: z.strictObject({
				paths: z.boolean().default(false),
				pids: z.boolean().default(true),
				ports: z.boolean().default(true),
				time_bucket_ms: positiveBudget.default(10),
				patterns: z.array(z.strictObject({
					pattern: z.string().describe("Literal text to replace in captured output; not a regular expression."),
					replacement: z.string()
				})).default([])
			}).default({
				paths: false,
				pids: true,
				ports: true,
				time_bucket_ms: 10,
				patterns: []
			})
		}).superRefine((scenario, context) => {
			const lifecycleBudget = BigInt(scenario.timeout_ms) + BigInt(scenario.finalization_ms) + BigInt(scenario.settle_ms);
			if (lifecycleBudget > BigInt(Number.MAX_SAFE_INTEGER)) context.addIssue({
				code: "custom",
				message: `timeout_ms + finalization_ms + settle_ms must stay at or below ${String(Number.MAX_SAFE_INTEGER)} ms, the largest total exactly representable as a JavaScript number`,
				path: ["timeout_ms"]
			});
			if (!fitsProcessTerminalCellBudget(scenario.terminal.columns, scenario.terminal.rows, scenario.terminal.scrollback)) context.addIssue({
				code: "custom",
				path: ["terminal"],
				message: `terminal columns × (rows + scrollback) must not exceed ${String(PROCESS_TERMINAL_CELL_BUDGET)} renderer cells. This release has no runtime override.`
			});
			for (let index = 1; index < scenario.events.length; index += 1) {
				const event = scenario.events[index];
				const previous = scenario.events[index - 1];
				if (eventsOutOfOrder(event, previous)) {
					context.addIssue({
						code: "custom",
						message: "events must be ordered by at_ms",
						path: ["events", index]
					});
				}
			}
			for (const [index, event] of scenario.events.entries()) {
				if (event.type === "resize" && !fitsProcessTerminalCellBudget(event.columns, event.rows, scenario.terminal.scrollback)) context.addIssue({
					code: "custom",
					path: ["events", index],
					message: `resize event at ${String(event.at_ms)} ms exceeds the ${String(PROCESS_TERMINAL_CELL_BUDGET)}-cell renderer budget with the selected scrollback. This release has no runtime override.`
				});
				if (event.at_ms > scenario.timeout_ms) {
					context.addIssue({
						code: "custom",
						message: `event at ${String(event.at_ms)} ms occurs after the ${String(scenario.timeout_ms)} ms scenario timeout`,
						path: ["events", index]
					});
				}
			}
		});
		eventsOutOfOrder = (event, previous) => event !== undefined && previous !== undefined && event.at_ms < previous.at_ms;
	})))();
}

//#endregion
//#region dist/domain/process/processCaptureCoverage.js
var byteRetentionSchema, enumerationOmissionReasonSchema, filesystemCoverageSchema, processCaptureTruncationDetailsSchema, omitted, filesystemTruncated, hasCaptureTruncation, processSourceTruncated;
function init_processCaptureCoverage() {
	return (init_processCaptureCoverage = __esmMin((() => {
		byteRetentionSchema = z.strictObject({
			budget_bytes: z.int().nonnegative(),
			observed_bytes: z.int().nonnegative(),
			retained_bytes: z.int().nonnegative(),
			observed_frames: z.int().nonnegative(),
			retained_frames: z.int().nonnegative(),
			unknown_size_frames: z.int().nonnegative().optional(),
			normalization_over_budget_frames: z.int().nonnegative().optional()
		});
		enumerationOmissionReasonSchema = z.enum([
			"identity_changed",
			"directory_unavailable",
			"entry_unavailable",
			"symlink_not_followed"
		]);
		filesystemCoverageSchema = z.strictObject({
			files_limit: z.int().nonnegative(),
			depth_limit: z.int().nonnegative(),
			enumeration_truncated: z.boolean(),
			enumeration_reasons: z.array(z.enum([
				"files_limit",
				"depth_limit",
				"unrepresentable_name",
				...enumerationOmissionReasonSchema.options
			])),
			enumeration_omissions: z.array(z.union([z.strictObject({
				path: z.string(),
				reason: enumerationOmissionReasonSchema,
				system_code: z.string().nullable()
			}), z.strictObject({
				path: z.string(),
				reason: z.literal("unrepresentable_name"),
				system_code: z.null(),
				raw_name_hex: z.string().regex(/^(?:[0-9a-f]{2})+$/u)
			})])),
			unobserved_subtrees: z.array(z.strictObject({
				path: z.string(),
				reason: z.enum(["symlink_not_followed", "observer_owned"])
			})).optional(),
			hash_budget_bytes: z.int().nonnegative(),
			hashed_bytes: z.int().nonnegative(),
			hash_omissions: z.array(z.strictObject({
				path: z.string(),
				size_bytes: z.int().nonnegative(),
				remaining_budget_bytes: z.int().nonnegative(),
				reason: z.enum([
					"file_bytes_budget",
					"file_changed_or_short_read",
					"file_unavailable"
				]),
				system_code: z.string().nullable()
			}))
		});
		processCaptureTruncationDetailsSchema = z.strictObject({
			raw_terminal: byteRetentionSchema.extend({ redacted_bytes: z.int().nonnegative().optional() }).describe("Original PTY UTF-8 admission accounting. retained_bytes counts the safe projection; redacted_bytes counts removed bytes from admitted chunks. Their sum consumes the original output budget. Whole chunks are otherwise retained or omitted."),
			rendered_terminal: byteRetentionSchema.describe("Cumulative UTF-8 bytes of serialized state plus visible lines, evaluated from retained PTY input; whole frames are retained or omitted. observed_bytes contains the exact total for size-known frames; unknown_size_frames counts frames whose complete size was not calculated. normalization_over_budget_frames identifies the subset stopped by an ordered normalization stage rather than final representation retention."),
			normalized_terminal: z.strictObject({
				budget_bytes: z.int().nonnegative(),
				retained_bytes: z.int().nonnegative(),
				omitted_frames: z.int().nonnegative()
			}).optional().describe("UTF-8 bytes of normalized raw-chunk text retained under output_bytes; omitted frames can have unknown final size when normalization exceeded an intermediate bound."),
			filesystem_before: filesystemCoverageSchema,
			filesystem_after: filesystemCoverageSchema,
			process: z.strictObject({
				sample_limit: z.int().nonnegative(),
				sampling_partial: z.boolean(),
				retained_samples: z.int().nonnegative(),
				sample_limit_reached: z.boolean(),
				sampling_failures: z.int().nonnegative(),
				first_sampling_failure: z.string().nullable(),
				coverage: z.literal("sampled")
			})
		});
		omitted = (retention) => retention.observed_frames > retention.retained_frames;
		filesystemTruncated = (coverage) => coverage.enumeration_truncated || coverage.enumeration_omissions.length > 0 || coverage.hash_omissions.length > 0;
		hasCaptureTruncation = (details) => omitted(details.raw_terminal) || omitted(details.rendered_terminal) || (details.normalized_terminal?.omitted_frames ?? 0) > 0 || (details.rendered_terminal.unknown_size_frames ?? 0) > 0 || filesystemTruncated(details.filesystem_before) || filesystemTruncated(details.filesystem_after) || details.process.sampling_partial;
		processSourceTruncated = (capture, source) => {
			const details = capture.truncation_details;
			switch (source) {
				case "terminal_raw": return omitted(details.raw_terminal);
				case "terminal_rendered": return omitted(details.raw_terminal) || omitted(details.rendered_terminal);
				case "filesystem": return filesystemTruncated(details.filesystem_before) || filesystemTruncated(details.filesystem_after);
				case "process": return details.process.sampling_partial;
				case "interaction":
				case "lifecycle": return false;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/process/processCaptureValidation.js
var sameJsonValue, orderedTimestamps, validateCommitments, validateOrdering, validateEventJournal, finalizationManifestIssue, finalizationAgreementIssue, finalizationConsistencyIssue, validateLifecycle, validateCoverage, collectProcessCaptureIssues;
function init_processCaptureValidation() {
	return (init_processCaptureValidation = __esmMin((() => {
		init_processScenario();
		init_processCaptureCoverage();
		sameJsonValue = (left, right) => {
			const encoded = canonicalize(left);
			return encoded !== undefined && encoded === canonicalize(right);
		};
		orderedTimestamps = (values) => values.every((value, index) => {
			const previous = values[index - 1];
			return previous === undefined || value >= previous;
		});
		validateCommitments = (capture, require) => {
			const { manifest } = capture;
			require(manifest.scenario.executable_sha256 === manifest.selected_executable_sha256, "manifest.selected_executable_sha256", "selected executable commitment does not match the scenario projection");
			require(manifest.executable_identity.state === "path_metadata_unchanged" ? manifest.executable_sha256 === manifest.selected_executable_sha256 && manifest.executable_identity.reason === null : manifest.executable_sha256 === null && manifest.executable_identity.reason !== null, "manifest.executable_identity", "launch identity and executable digest do not agree");
			for (const [field, value] of [
				["full_scenario_sha256", manifest.scenario],
				["comparison_contract_sha256", manifest.comparison_contract],
				["normalization_sha256", capture.normalization]
			]) require(manifest[field] === digestProcessCommitment(value), `manifest.${field}`, "commitment does not match its canonical value");
		};
		validateOrdering = (capture, require) => {
			for (const [name, values] of [
				["frames", capture.frames],
				["rendered_frames", capture.rendered_frames],
				["interaction_events", capture.interaction_events]
			]) require(values.every(({ sequence }, index) => sequence === index), name, "sequence values must be contiguous from zero");
			for (const [name, values] of [
				["frames", capture.frames],
				["rendered_frames", capture.rendered_frames],
				["process_samples", capture.process_samples]
			]) require(orderedTimestamps(values.map(({ at_ms }) => at_ms)), name, "timestamps must be ordered");
			require(orderedTimestamps(capture.interaction_events.map(({ dispatched_at_ms }) => dispatched_at_ms)), "interaction_events", "dispatch timestamps must be ordered");
		};
		validateEventJournal = (capture, require) => {
			const journal = capture.event_journal;
			if (journal.length === 0) return;
			const sizes = {
				frames: capture.frames.length,
				rendered_frames: capture.rendered_frames.length,
				interaction_events: capture.interaction_events.length,
				lifecycle: 2,
				process_samples: capture.process_samples.length,
				filesystem_checkpoints: capture.filesystem_checkpoints.length
			};
			const references = new Set();
			for (const [position, entry] of journal.entries()) {
				require(entry.capture_order === position, `event_journal.${String(position)}.capture_order`, "capture order must be contiguous from zero");
				require(entry.index < sizes[entry.collection], `event_journal.${String(position)}.index`, "journal reference is outside its capture collection");
				const reference = `${entry.collection}:${String(entry.index)}`;
				require(!references.has(reference), `event_journal.${String(position)}`, "journal references must be unique");
				references.add(reference);
			}
			const expectedSize = Object.values(sizes).reduce((total, size) => total + size, 0);
			require(journal.length === expectedSize, "event_journal", "nonempty journal must reference every captured observation");
		};
		finalizationManifestIssue = (committedScenario, committedComparison) => committedScenario !== undefined && committedComparison !== undefined && committedScenario["finalization_ms"] !== committedComparison["finalization_ms"] ? "comparison_contract finalization_ms must match the committed scenario" : undefined;
		finalizationAgreementIssue = (exitFinalization, observedFinalization) => exitFinalization !== undefined && observedFinalization !== undefined && JSON.stringify(exitFinalization) !== JSON.stringify(observedFinalization) ? "exit finalization and finalization observation must agree" : undefined;
		finalizationConsistencyIssue = (exit, committedScenario, committedComparison, options) => {
			const manifestIssue = finalizationManifestIssue(committedScenario, committedComparison);
			if (manifestIssue !== undefined) return manifestIssue;
			const finalization = exit?.finalization ?? options?.finalization;
			if (finalization === undefined) {
				const committed = committedScenario?.["finalization_ms"];
				return (exit?.reason === "timeout" || exit?.reason === "idle_timeout") && typeof committed === "number" && committed > 0 ? "a deadline exit under a committed finalization_ms requires finalization evidence" : undefined;
			}
			if (exit?.reason === "exited") return "finalization requires a deadline exit reason";
			const first = finalization.signals[0];
			if (first?.signal !== "SIGTERM") return "finalization signals must start with SIGTERM";
			const killIndexes = finalization.signals.flatMap(({ signal }, index) => signal === "SIGKILL" ? [index] : []);
			if (killIndexes.length > 1 || killIndexes[0] !== undefined && killIndexes[0] !== finalization.signals.length - 1) return "finalization may contain at most one final SIGKILL";
			if (!finalization.signals.every(({ sent_at_ms }, index) => {
				const previous = finalization.signals[index - 1];
				return previous === undefined || sent_at_ms >= previous.sent_at_ms;
			})) return "finalization signal attempt times must not decrease";
			if (finalization.signals.filter(({ signal }) => signal === "SIGTERM").length !== 1) return "finalization must attempt SIGTERM exactly once";
			const kill = finalization.signals.find(({ signal }) => signal === "SIGKILL");
			if (kill !== undefined && kill.sent_at_ms < finalization.requested_ms && exit !== undefined && exit.reason !== "cancelled") return "finalization SIGKILL cannot precede the requested interval";
			if (finalization.elapsed_ms === null && options?.allowNullElapsedMs !== true) return "finalization requires an observed elapsed_ms";
			if (finalization.exit_code !== null && exit?.signal !== undefined && exit.signal !== null && exit.signal !== 0) return "finalization exit_code requires an exit not caused by a signal";
			if (finalization.elapsed_ms !== null && finalization.elapsed_ms < (finalization.signals.at(-1)?.sent_at_ms ?? first.sent_at_ms)) return "finalization elapsed_ms cannot precede the last signal attempt";
			if (committedScenario !== undefined && committedScenario["finalization_ms"] !== finalization.requested_ms) return "finalization must match the committed finalization_ms";
			return undefined;
		};
		validateLifecycle = (capture, require) => {
			require(capture.filesystem_checkpoints.map(({ name }) => name).join(",") === "before,after_settlement", "filesystem_checkpoints", "capture must include initial and final filesystem snapshots");
			require(orderedTimestamps(capture.filesystem_checkpoints.map(({ at_ms }) => at_ms)), "filesystem_checkpoints", "filesystem snapshot times must be ordered");
			require(!capture.filesystem_checkpoints.some(({ truncated }) => truncated) || capture.truncated, "truncated", "filesystem snapshot truncation must propagate to the capture");
			const [initial, final] = capture.filesystem_checkpoints;
			require(sameJsonValue(initial?.files, capture.files_before) && initial?.effects.length === 0 && sameJsonValue(final?.files, capture.files_after) && sameJsonValue(final?.effects, capture.filesystem_effects), "filesystem_checkpoints", "top-level filesystem snapshots and effects must match the initial and final checkpoints");
			require(capture.exit.reason === "exited" || capture.exit.code === null, "exit", "deadline termination cannot declare a normal exit code");
			const finalizationIssue = finalizationConsistencyIssue(capture.exit, capture.manifest.scenario, capture.manifest.comparison_contract);
			require(finalizationIssue === undefined, "exit", finalizationIssue ?? "");
		};
		validateCoverage = (capture, require) => {
			const details = capture.truncation_details;
			require(details.process.retained_samples === capture.process_samples.length && details.process.retained_samples <= details.process.sample_limit && details.process.sampling_partial === (details.process.sample_limit_reached || details.process.sampling_failures > 0) && details.process.sampling_failures === 0 === (details.process.first_sampling_failure === null), "truncation_details.process", "sampling coverage must agree with retained samples and observed failures");
			require(capture.truncated === hasCaptureTruncation(details), "truncation_details", "aggregate truncation must match producer coverage");
			require((details.rendered_terminal.normalization_over_budget_frames ?? 0) <= (details.rendered_terminal.unknown_size_frames ?? 0), "truncation_details.rendered_terminal.normalization_over_budget_frames", "normalization omissions must be a subset of unknown-size rendered frames");
			for (const [name, retention, count, bytes] of [[
				"raw_terminal",
				details.raw_terminal,
				capture.frames.length,
				capture.frames.reduce((total, frame) => total + Buffer.byteLength(frame.raw_data ?? frame.data), 0)
			], [
				"rendered_terminal",
				details.rendered_terminal,
				capture.rendered_frames.length,
				capture.rendered_frames.reduce((total, frame) => frame.lines.reduce((sum, line) => sum + Buffer.byteLength(line), total + Buffer.byteLength(frame.serialized_state)), 0)
			]]) {
				const accountedBytes = retention.retained_bytes + (name === "raw_terminal" ? details.raw_terminal.redacted_bytes ?? 0 : 0);
				require(retention.retained_frames === count && retention.observed_frames >= count && retention.retained_bytes === bytes && retention.observed_bytes >= accountedBytes && (retention.observed_frames > count || retention.observed_bytes === accountedBytes) && accountedBytes <= retention.budget_bytes && (retention.unknown_size_frames ?? 0) <= retention.observed_frames - retention.retained_frames, `truncation_details.${name}`, "retained observations and budget accounting do not agree");
			}
			const normalized = details.normalized_terminal;
			if (normalized !== undefined) {
				const committedOutputBudget = processScenarioOutputBudgetProjectionSchema.safeParse(capture.manifest.scenario["limits"]);
				require(committedOutputBudget.success, "manifest.scenario.limits.output_bytes", "committed process scenario must include an explicit valid output_bytes budget");
				const retainedBytes = capture.frames.reduce((total, frame) => total + Buffer.byteLength(frame.data), 0);
				if (committedOutputBudget.success) require(normalized.budget_bytes === committedOutputBudget.data.output_bytes && normalized.retained_bytes === retainedBytes && normalized.retained_bytes <= normalized.budget_bytes && normalized.omitted_frames <= details.raw_terminal.observed_frames - details.raw_terminal.retained_frames, "truncation_details.normalized_terminal", "normalized terminal retention must agree with the committed budget and retained frames");
			}
			for (const [name, coverage, files, checkpoint] of [[
				"filesystem_before",
				details.filesystem_before,
				capture.files_before,
				capture.filesystem_checkpoints[0]
			], [
				"filesystem_after",
				details.filesystem_after,
				capture.files_after,
				capture.filesystem_checkpoints[1]
			]]) {
				const unhashedFiles = new Map(files.filter((file) => file.type === "file" && file.sha256 === null).map((file) => [file.path, file]));
				const entryTypes = new Map(files.map(({ path, type }) => [path, type]));
				require(coverage.hash_omissions.length === unhashedFiles.size && new Set(coverage.hash_omissions.map(({ path }) => path)).size === unhashedFiles.size && coverage.hash_omissions.every((omission) => unhashedFiles.get(omission.path)?.size === omission.size_bytes && omission.remaining_budget_bytes <= coverage.hash_budget_bytes && (omission.reason === "file_unavailable" ? omission.system_code !== null : omission.system_code === null)), `truncation_details.${name}.hash_omissions`, "every retained regular file without a digest must have one matching omission reason");
				require(new Set(coverage.enumeration_omissions.map((omission) => omission.reason === "unrepresentable_name" ? JSON.stringify([
					omission.path,
					omission.reason,
					omission.raw_name_hex
				]) : JSON.stringify([omission.path]))).size === coverage.enumeration_omissions.length && (!coverage.enumeration_reasons.includes("entry_unavailable") || coverage.enumeration_omissions.some(({ reason }) => reason === "entry_unavailable")) && (!coverage.enumeration_reasons.includes("symlink_not_followed") || coverage.enumeration_omissions.some(({ reason }) => reason === "symlink_not_followed")) && (!coverage.enumeration_reasons.includes("unrepresentable_name") || coverage.enumeration_omissions.some(({ reason }) => reason === "unrepresentable_name")) && coverage.enumeration_omissions.every((omission) => {
					if (!coverage.enumeration_reasons.includes(omission.reason)) return false;
					const entryType = entryTypes.get(omission.path);
					if (omission.reason === "symlink_not_followed") return entryType === "symlink" && omission.system_code === null;
					if (omission.reason === "directory_unavailable") return entryType === "directory" && omission.system_code !== null;
					return (entryType === undefined || entryType === "directory") && (omission.reason === "entry_unavailable" ? omission.system_code !== null : omission.system_code === null);
				}), `truncation_details.${name}.enumeration_omissions`, "every enumeration omission must identify an unavailable entry, retained directory or unfollowed symlink, with a matching reason and system error only for unavailable reads");
				require(coverage.hashed_bytes === files.filter((file) => file.type === "file" && file.sha256 !== null).reduce((sum, file) => sum + file.size, 0) && coverage.hashed_bytes <= coverage.hash_budget_bytes && files.length <= coverage.files_limit, `truncation_details.${name}`, "filesystem budget accounting does not match retained observations");
				require(coverage.enumeration_truncated === coverage.enumeration_reasons.length > 0 && checkpoint?.truncated === (coverage.enumeration_truncated || coverage.enumeration_omissions.length > 0 || coverage.hash_omissions.length > 0), `truncation_details.${name}`, "filesystem checkpoint truncation must match enumeration and digest coverage");
			}
		};
		collectProcessCaptureIssues = (capture) => {
			const issues = [];
			const require = (condition, path, message) => {
				if (!condition) issues.push({
					path,
					message
				});
			};
			validateCommitments(capture, require);
			validateOrdering(capture, require);
			validateEventJournal(capture, require);
			validateLifecycle(capture, require);
			validateCoverage(capture, require);
			return issues;
		};
	})))();
}

//#endregion
//#region dist/domain/process/processCapture.js
var interactionEventSchema, PROCESS_CAPTURE_EVENT_COLLECTIONS, fileStateShape, fileStateSchema, processFilesystemSnapshotSchema, fileEffectSchema, processSettlementSchema, unverifiedCleanupProcessesSchema, processCaptureFinalizationSchema, processCaptureShapeSchema, processCleanupResourceSchema, partialObservationFieldSchema, incompleteProcessCaptureObservationsSchema, partialCleanupReportSchema, partialObservationMetadataSchema, completedCaptureObservationSchema, incompleteCaptureObservationSchema, partialProcessCaptureObservationSchema, processCaptureSchema;
function init_processCapture() {
	return (init_processCapture = __esmMin((() => {
		init_symlinkTarget();
		init_offsetDateTime();
		init_jsonValue();
		init_processScenario();
		init_processCaptureValidation();
		init_processCaptureCoverage();
		interactionEventSchema = z.object({
			sequence: z.int().nonnegative(),
			scheduled_at_ms: z.int().nonnegative(),
			dispatched_at_ms: z.int().nonnegative(),
			type: z.enum([
				"input",
				"resize",
				"signal"
			]),
			data: z.string(),
			sensitive: z.literal(true).optional(),
			input_bytes: z.int().nonnegative().optional(),
			outcome: z.enum([
				"dispatched",
				"target_exited",
				"failed"
			])
		}).superRefine((event, context) => {
			if (event.sensitive === true !== (event.input_bytes !== undefined) || event.sensitive === true && (event.type !== "input" || event.data !== "")) context.addIssue({
				code: "custom",
				message: "Private input facts require input type, empty data, sensitive: true and input_bytes together."
			});
		});
		PROCESS_CAPTURE_EVENT_COLLECTIONS = [
			"frames",
			"rendered_frames",
			"interaction_events",
			"lifecycle",
			"process_samples",
			"filesystem_checkpoints"
		];
		fileStateShape = {
			path: z.string(),
			mode: z.int().nonnegative(),
			size: z.int().nonnegative()
		};
		fileStateSchema = z.discriminatedUnion("type", [
			z.object({
				...fileStateShape,
				type: z.literal("file"),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
				symlink_target: z.null()
			}),
			z.object({
				...fileStateShape,
				type: z.literal("symlink"),
				sha256: z.null(),
				symlink_target: z.string().nullable(),
				symlink_target_hex: z.string().regex(/^(?:[a-f0-9]{2})+$/u).optional()
			}).superRefine((file, context) => {
				if (file.symlink_target_hex === undefined) {
					if (file.symlink_target === null) context.addIssue({
						code: "custom",
						message: "An unknown symlink target requires its exact bytes"
					});
					return;
				}
				const { text } = observedSymlinkTarget(Buffer.from(file.symlink_target_hex, "hex"));
				if (file.symlink_target !== text) context.addIssue({
					code: "custom",
					message: "Symlink target text contradicts its exact bytes"
				});
			}),
			z.object({
				...fileStateShape,
				type: z.enum(["directory", "other"]),
				sha256: z.null(),
				symlink_target: z.null()
			})
		]);
		processFilesystemSnapshotSchema = z.strictObject({
			files: z.array(fileStateSchema),
			truncated: z.boolean(),
			completeRoots: z.array(z.string()),
			coverage: filesystemCoverageSchema
		});
		fileEffectSchema = z.discriminatedUnion("status", [
			z.object({
				path: z.string(),
				status: z.literal("created"),
				before: z.null(),
				after: fileStateSchema
			}),
			z.object({
				path: z.string(),
				status: z.literal("deleted"),
				before: fileStateSchema,
				after: z.null()
			}),
			z.object({
				path: z.string(),
				status: z.enum(["modified", "unchanged"]),
				before: fileStateSchema,
				after: fileStateSchema
			}),
			z.object({
				path: z.string(),
				status: z.literal("unknown"),
				before: fileStateSchema.nullable(),
				after: fileStateSchema.nullable(),
				reason: z.string().min(1)
			})
		]);
		processSettlementSchema = z.discriminatedUnion("state", [z.object({
			state: z.literal("quiesced"),
			elapsed_ms: z.int().nonnegative(),
			cleanup_outcome: z.enum(["not_required", "failed"])
		}), z.object({
			state: z.enum(["alive_at_deadline", "unverifiable"]),
			elapsed_ms: z.int().nonnegative(),
			cleanup_outcome: z.enum(["cleaned", "failed"])
		})]);
		unverifiedCleanupProcessesSchema = z.array(z.strictObject({
			pid: z.int().positive(),
			reason: z.string()
		}));
		processCaptureFinalizationSchema = z.strictObject({
			requested_ms: z.int().safe().positive(),
			elapsed_ms: z.int().nonnegative().nullable(),
			exit_code: z.int().nonnegative().nullable(),
			signals: z.array(z.strictObject({
				signal: z.enum(["SIGTERM", "SIGKILL"]),
				sent_at_ms: z.int().nonnegative(),
				delivery: z.enum([
					"signaled",
					"gone",
					"identity-changed",
					"unverified"
				]),
				reason: z.string().min(1).optional()
			})).min(1)
		}).superRefine((finalization, context) => {
			if (finalization.exit_code !== null && finalization.elapsed_ms === null) context.addIssue({
				code: "custom",
				path: ["exit_code"],
				message: "finalization exit_code requires an observed exit"
			});
			for (const [index, attempt] of finalization.signals.entries()) if (attempt.reason !== undefined && attempt.delivery !== "unverified") context.addIssue({
				code: "custom",
				path: [
					"signals",
					index,
					"reason"
				],
				message: "finalization reason is only allowed for an unverified delivery"
			});
		});
		processCaptureShapeSchema = z.strictObject({
			manifest: z.strictObject({
				rea_version: z.string().min(1),
				provider_version: z.string().min(1),
				platform: z.string().min(1),
				architecture: z.string().min(1),
				pty_backend: z.literal("node-pty"),
				started_at: utcDateTimeSchema,
				completed_at: utcDateTimeSchema,
				scenario: z.record(z.string(), jsonValueSchema),
				comparison_contract: z.record(z.string(), jsonValueSchema),
				full_scenario_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				comparison_contract_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				selected_executable_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
				executable_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
				executable_identity: z.strictObject({
					state: z.enum(["path_metadata_unchanged", "unknown"]),
					reason: z.string().nullable()
				}),
				normalization_sha256: z.string().regex(/^[a-f0-9]{64}$/u)
			}),
			normalization: normalizationSchema,
			frames: z.array(z.object({
				sequence: z.int().nonnegative(),
				at_ms: z.int().nonnegative(),
				data: z.string(),
				raw_data: z.string().optional()
			})),
			rendered_frames: z.array(z.object({
				sequence: z.int().nonnegative(),
				at_ms: z.int().nonnegative(),
				columns: z.int().positive(),
				rows: z.int().positive(),
				cursor_x: z.int().nonnegative(),
				cursor_y: z.int().nonnegative(),
				active_buffer: z.enum(["normal", "alternate"]),
				lines: z.array(z.string()),
				serialized_state: z.string()
			})),
			interaction_events: z.array(interactionEventSchema),
			exit: z.object({
				code: z.int().nullable(),
				signal: z.int().nullable(),
				reason: z.enum([
					"exited",
					"timeout",
					"idle_timeout"
				]),
				finalization: processCaptureFinalizationSchema.optional()
			}),
			settlement: z.discriminatedUnion("state", [z.object({
				state: z.literal("quiesced"),
				elapsed_ms: z.int().nonnegative(),
				cleanup_outcome: z.literal("not_required")
			}), z.object({
				state: z.enum(["alive_at_deadline", "unverifiable"]),
				elapsed_ms: z.int().nonnegative(),
				cleanup_outcome: z.enum(["cleaned", "failed"])
			})]),
			process_samples: z.array(z.object({
				at_ms: z.int().nonnegative(),
				pid: z.int().positive(),
				parent_pid: z.int().nonnegative(),
				command: z.string(),
				process_group_id: z.int().positive().nullable(),
				session_id: z.int().nonnegative().nullable()
			})),
			filesystem_checkpoints: z.array(z.object({
				name: z.enum(["before", "after_settlement"]),
				at_ms: z.int().nonnegative(),
				files: z.array(fileStateSchema),
				effects: z.array(fileEffectSchema),
				truncated: z.boolean()
			})),
			event_journal: z.array(z.object({
				capture_order: z.int().nonnegative(),
				collection: z.enum(PROCESS_CAPTURE_EVENT_COLLECTIONS),
				index: z.int().nonnegative()
			})),
			files_before: z.array(fileStateSchema),
			files_after: z.array(fileStateSchema),
			filesystem_effects: z.array(fileEffectSchema),
			truncated: z.boolean(),
			truncation_details: processCaptureTruncationDetailsSchema,
			limitations: z.array(z.string()),
			residual_unknowns: z.array(z.object({
				scope: z.enum([
					"terminal",
					"interaction",
					"exit",
					"process",
					"filesystem",
					"cleanup",
					"network",
					"environment"
				]),
				reason: z.string()
			})),
			cleanup: z.object({
				owned_process_group: z.literal("verified"),
				temporary_root: z.literal("removed"),
				unverified_processes: unverifiedCleanupProcessesSchema.optional()
			})
		});
		processCleanupResourceSchema = z.strictObject({
			state: z.enum([
				"cleaned",
				"failed",
				"unverified",
				"not_required"
			]),
			reason: z.string().nullable(),
			unverified_processes: unverifiedCleanupProcessesSchema.optional()
		});
		partialObservationFieldSchema = (value) => z.discriminatedUnion("state", [z.strictObject({
			state: z.literal("available"),
			value
		}), z.strictObject({
			state: z.literal("unavailable"),
			reason: z.string()
		})]);
		incompleteProcessCaptureObservationsSchema = z.strictObject({
			target_pid: partialObservationFieldSchema(z.int().positive()),
			frames: partialObservationFieldSchema(processCaptureShapeSchema.shape.frames),
			rendered_frames: partialObservationFieldSchema(processCaptureShapeSchema.shape.rendered_frames),
			interaction_events: partialObservationFieldSchema(processCaptureShapeSchema.shape.interaction_events),
			exit: partialObservationFieldSchema(z.strictObject({
				code: z.int().nullable(),
				signal: z.int().nullable(),
				reason: z.enum([
					"exited",
					"timeout",
					"idle_timeout",
					"cancelled"
				]),
				finalization: processCaptureFinalizationSchema.optional()
			})),
			finalization: partialObservationFieldSchema(processCaptureFinalizationSchema).optional(),
			settlement: partialObservationFieldSchema(z.strictObject({
				state: z.enum([
					"quiesced",
					"alive_at_deadline",
					"unverifiable"
				]),
				elapsed_ms: z.int().nonnegative()
			})),
			process_samples: partialObservationFieldSchema(processCaptureShapeSchema.shape.process_samples),
			filesystem_snapshots: z.strictObject({
				before: partialObservationFieldSchema(processFilesystemSnapshotSchema),
				after: partialObservationFieldSchema(processFilesystemSnapshotSchema)
			}),
			event_journal: partialObservationFieldSchema(processCaptureShapeSchema.shape.event_journal),
			manifest: partialObservationFieldSchema(processCaptureShapeSchema.shape.manifest)
		});
		partialCleanupReportSchema = z.strictObject({
			owned_process_group: processCleanupResourceSchema,
			terminal_renderer: processCleanupResourceSchema,
			temporary_root: processCleanupResourceSchema
		});
		partialObservationMetadataSchema = z.strictObject({
			cleanup: partialCleanupReportSchema,
			execution_failure: z.string().nullable()
		});
		completedCaptureObservationSchema = z.strictObject({ capture: processCaptureShapeSchema.omit({ cleanup: true }).extend({ settlement: processSettlementSchema }) });
		incompleteCaptureObservationSchema = z.strictObject({ observations: incompleteProcessCaptureObservationsSchema });
		partialProcessCaptureObservationSchema = z.union([completedCaptureObservationSchema.extend(partialObservationMetadataSchema.shape), incompleteCaptureObservationSchema.extend(partialObservationMetadataSchema.shape)]).superRefine((partial, context) => {
			const cleanupIncomplete = Object.values(partial.cleanup).some(({ state }) => state === "failed" || state === "unverified");
			if (!cleanupIncomplete && partial.execution_failure === null) context.addIssue({
				code: "custom",
				path: ["execution_failure"],
				message: "partial observations require incomplete cleanup or an execution failure"
			});
			const observedExit = "capture" in partial ? partial.capture.exit : partial.observations.exit.state === "available" ? partial.observations.exit.value : undefined;
			const observedFinalization = "observations" in partial && partial.observations.finalization?.state === "available" ? partial.observations.finalization.value : undefined;
			const committedManifest = "capture" in partial ? partial.capture.manifest : partial.observations.manifest.state === "available" ? partial.observations.manifest.value : undefined;
			const manifestFinalizationIssue = finalizationManifestIssue(committedManifest?.scenario, committedManifest?.comparison_contract);
			const exitFinalizationIssue = manifestFinalizationIssue ?? (observedExit === undefined ? undefined : finalizationConsistencyIssue(observedExit, committedManifest?.scenario, committedManifest?.comparison_contract));
			const incompleteFinalizationIssue = manifestFinalizationIssue ?? (observedFinalization === undefined ? undefined : finalizationConsistencyIssue(observedExit === undefined ? undefined : {
				reason: observedExit.reason,
				signal: observedExit.signal
			}, committedManifest?.scenario, committedManifest?.comparison_contract, {
				finalization: observedFinalization,
				allowNullElapsedMs: true
			}));
			if (exitFinalizationIssue !== undefined) context.addIssue({
				code: "custom",
				path: ["exit"],
				message: exitFinalizationIssue
			});
			if (incompleteFinalizationIssue !== undefined) context.addIssue({
				code: "custom",
				path: ["finalization"],
				message: incompleteFinalizationIssue
			});
			const agreementIssue = finalizationAgreementIssue(observedExit?.finalization, observedFinalization);
			if (agreementIssue !== undefined) context.addIssue({
				code: "custom",
				path: ["finalization"],
				message: agreementIssue
			});
			if ("observations" in partial && partial.observations.exit.state === "unavailable" && observedFinalization !== undefined && observedFinalization?.elapsed_ms !== null) context.addIssue({
				code: "custom",
				path: ["finalization"],
				message: "finalization elapsed_ms must be null when the exit observation is unavailable"
			});
			if ("observations" in partial) {
				const { observations } = partial;
				if (![
					observations.frames,
					observations.interaction_events,
					observations.process_samples,
					observations.filesystem_snapshots.before,
					observations.event_journal
				].some(({ state }) => state === "available")) context.addIssue({
					code: "custom",
					path: ["observations"],
					message: "incomplete observations contain no collected evidence"
				});
				return;
			}
			const { capture } = partial;
			const settlement = capture.settlement.state === "quiesced" ? {
				...capture.settlement,
				cleanup_outcome: "not_required"
			} : {
				...capture.settlement,
				cleanup_outcome: "cleaned"
			};
			const validationCapture = {
				...capture,
				settlement,
				cleanup: {
					owned_process_group: "verified",
					temporary_root: "removed"
				}
			};
			for (const issue of collectProcessCaptureIssues(validationCapture)) context.addIssue({
				code: "custom",
				path: ["capture", ...issue.path.split(".")],
				message: issue.message
			});
		});
		processCaptureSchema = processCaptureShapeSchema.superRefine((capture, context) => {
			if (capture.settlement.cleanup_outcome === "failed") context.addIssue({
				code: "custom",
				path: ["settlement", "cleanup_outcome"],
				message: "verified captures cannot contain failed cleanup"
			});
			for (const issue of collectProcessCaptureIssues(capture)) context.addIssue({
				code: "custom",
				path: issue.path.split("."),
				message: issue.message
			});
		}).describe("The capture must preserve its canonical scenario, comparison, and normalization SHA-256 commitments; ordered capture timestamps and contiguous sequence numbers; before and final filesystem snapshots with truncation propagated; and exit-code consistency with deadline termination. The event journal is required; empty journals are valid. A non-empty journal must reference every captured observation exactly once with unique in-range references. These cross-field invariants are checked by REA after capture.");
	})))();
}

//#endregion
//#region dist/domain/process/processCaptureParsing.js
var verifiedProcessCaptureSchema, safeParseProcessCapture, parseProcessCapture;
function init_processCaptureParsing() {
	return (init_processCaptureParsing = __esmMin((() => {
		init_processCapture();
		verifiedProcessCaptureSchema = processCaptureSchema.brand();
		safeParseProcessCapture = (input) => verifiedProcessCaptureSchema.safeParse(input);
		parseProcessCapture = (input) => verifiedProcessCaptureSchema.parse(input);
	})))();
}

//#endregion
//#region dist/domain/analysisView/analysisViewErrors.js
var INSPECT_ANALYSIS_VIEW_OPERATION, ANALYSIS_VIEW_PAGE_BUDGET_RECOVERY, analysisViewInputError;
function init_analysisViewErrors() {
	return (init_analysisViewErrors = __esmMin((() => {
		init_analysisErrorCore();
		INSPECT_ANALYSIS_VIEW_OPERATION = "inspect_analysis_view";
		ANALYSIS_VIEW_PAGE_BUDGET_RECOVERY = {
			retryable: false,
			remediationAction: "The 1,048,576-byte analysis-view page allowance is fixed and has no runtime override. For a pageable collection, select fewer fields or a smaller selection; one oversized field may not fit even in a one-row page. If the error includes details.partial_observation, use that complete parent Evidence. Otherwise, read the parent directly from the caller-supplied bundle, or retrieve/export the retained parent in the same MCP session. Reading the parent does not increase the page allowance."
		};
		analysisViewInputError = (issues) => new AnalysisInputError(INSPECT_ANALYSIS_VIEW_OPERATION, undefined, issues);
	})))();
}

//#endregion
//#region dist/domain/evidenceValidation.js
var safeParseEvidence, safeParseImmutableEvidence, readEvidence, readImmutableEvidence, authenticateEvidence, readEvidencePayload, integrityFailure;
function init_evidenceValidation() {
	return (init_evidenceValidation = __esmMin((() => {
		init_evidence();
		init_evidenceErrors();
		init_validationFailure();
		init_result();
		safeParseEvidence = (input) => authenticateEvidence(input, parseEvidence);
		safeParseImmutableEvidence = (input) => authenticateEvidence(input, immutableEvidence);
		readEvidence = (input) => {
			const parsed = safeParseEvidence(input);
			return parsed.ok ? parsed : err(integrityFailure(parsed.error));
		};
		readImmutableEvidence = (input) => {
			const parsed = safeParseImmutableEvidence(input);
			return parsed.ok ? parsed : err(integrityFailure(parsed.error));
		};
		authenticateEvidence = (input, parse) => {
			try {
				return ok(parse(input));
			} catch (cause) {
				if (!(cause instanceof z.ZodError)) throw cause;
				return err(cause);
			}
		};
		readEvidencePayload = (schema, input) => {
			const parsed = schema.safeParse(input);
			return parsed.success ? ok(parsed.data) : err(integrityFailure(parsed.error));
		};
		integrityFailure = (cause) => {
			const message = `Evidence validation failed ${describeValidationFailure(cause)}`;
			return new EvidenceIntegrityError(message, {
				cause,
				userMessage: message
			});
		};
	})))();
}

//#endregion
//#region dist/domain/jsonStringByteLength.js
var jsonStringByteLength;
function init_jsonStringByteLength() {
	return (init_jsonStringByteLength = __esmMin((() => {
		jsonStringByteLength = (value, budget = Number.POSITIVE_INFINITY) => {
			let bytes = 2;
			for (let index = 0; index < value.length && bytes <= budget; index++) {
				const unit = value.charCodeAt(index);
				if (unit === 34 || unit === 92) bytes += 2;
				else if (unit < 32) bytes += unit === 8 || unit === 9 || unit === 10 || unit === 12 || unit === 13 ? 2 : 6;
				else if (unit < 128) bytes += 1;
				else if (unit < 2048) bytes += 2;
				else if (unit >= 55296 && unit <= 56319) {
					const next = value.charCodeAt(index + 1);
					if (next >= 56320 && next <= 57343) {
						bytes += 4;
						index++;
					} else bytes += 6;
				} else if (unit >= 56320 && unit <= 57343) bytes += 6;
				else bytes += 3;
			}
			return bytes;
		};
	})))();
}

//#endregion
//#region dist/domain/jsonValueByteLength.js
var jsonValueByteLength;
function init_jsonValueByteLength() {
	return (init_jsonValueByteLength = __esmMin((() => {
		init_jsonStringByteLength();
		jsonValueByteLength = (value, budget = Number.POSITIVE_INFINITY) => {
			if (typeof value === "string") return jsonStringByteLength(value, budget);
			if (Array.isArray(value)) {
				let bytes = 2 + Math.max(0, value.length - 1);
				for (const child of value) {
					if (bytes > budget) break;
					bytes += jsonValueByteLength(child, budget - bytes);
				}
				return bytes;
			}
			if (value !== null && typeof value === "object") {
				const keys = Object.keys(value);
				let bytes = 2 + Math.max(0, keys.length - 1);
				for (const key of keys) {
					if (bytes > budget) break;
					bytes += jsonStringByteLength(key, budget - bytes) + 1;
					if (bytes <= budget) bytes += jsonValueByteLength(value[key], budget - bytes);
				}
				return bytes;
			}
			return typeof value === "number" && !Number.isFinite(value) ? 4 : String(value).length;
		};
	})))();
}

//#endregion
//#region dist/domain/native/nativeValueFlow.js
var nativeVarnodeSchema, nativePcodeOperationSchema, nativePcodeDefUseSchema, nativePcodeEffectSchema, availableNativeValueFlowSchema, unavailableNativeValueFlowSchema, nativeValueFlowSchema, nativeValueFlowMetadataSchema;
function init_nativeValueFlow() {
	return (init_nativeValueFlow = __esmMin((() => {
		nativeVarnodeSchema = z.strictObject({
			kind: z.enum([
				"constant",
				"address",
				"register",
				"unique",
				"other"
			]),
			size_bytes: z.int().nonnegative(),
			location: z.string().nullable(),
			constant_hex: z.string().regex(/^[0-9a-f]+$/u).nullable()
		});
		nativePcodeOperationSchema = z.strictObject({
			id: z.string().min(1),
			address: z.string().min(1),
			sequence: z.int().nonnegative(),
			opcode: z.string().min(1),
			is_dead: z.boolean(),
			block_membership: z.enum([
				"member",
				"detached",
				"unavailable"
			]),
			inputs: z.array(nativeVarnodeSchema),
			output: nativeVarnodeSchema.nullable()
		});
		nativePcodeDefUseSchema = z.strictObject({
			definition: z.string().min(1),
			use: z.string().min(1),
			input_index: z.int().nonnegative()
		});
		nativePcodeEffectSchema = z.strictObject({
			operation: z.string().min(1),
			kind: z.enum([
				"memory_read",
				"memory_write",
				"conditional_branch",
				"indirect_branch",
				"direct_call",
				"indirect_call"
			]),
			operand_input: z.int().nonnegative().nullable(),
			value_input: z.int().nonnegative().nullable()
		});
		availableNativeValueFlowSchema = z.strictObject({
			available: z.literal(true),
			provenance: z.literal("ghidra-high-pcode"),
			operations: z.array(nativePcodeOperationSchema),
			def_use: z.array(nativePcodeDefUseSchema),
			effects: z.array(nativePcodeEffectSchema),
			parameters: z.array(z.strictObject({
				ordinal: z.int().nonnegative(),
				name: z.string(),
				data_type: z.string()
			})),
			parameter_uses: z.array(z.strictObject({
				ordinal: z.int().nonnegative(),
				use: z.string(),
				input_index: z.int().nonnegative()
			})),
			truncated: z.boolean(),
			omitted_operations_lower_bound: z.int().nonnegative(),
			known_omitted_inputs: z.int().nonnegative(),
			known_omitted_edges: z.int().nonnegative(),
			limitations: z.array(z.string().min(1))
		});
		unavailableNativeValueFlowSchema = z.strictObject({
			available: z.literal(false),
			reason: z.string().min(1),
			limitations: z.array(z.string().min(1))
		});
		nativeValueFlowSchema = z.discriminatedUnion("available", [availableNativeValueFlowSchema, unavailableNativeValueFlowSchema]);
		nativeValueFlowMetadataSchema = z.union([availableNativeValueFlowSchema.pick({
			available: true,
			truncated: true,
			omitted_operations_lower_bound: true,
			known_omitted_inputs: true,
			known_omitted_edges: true
		}).partial({
			omitted_operations_lower_bound: true,
			known_omitted_inputs: true,
			known_omitted_edges: true
		}).strip(), unavailableNativeValueFlowSchema.pick({
			available: true,
			reason: true
		}).extend({ reason: z.string() }).strip()]);
	})))();
}

//#endregion
//#region dist/domain/firmware/devicetree.js
var uint$1, MAX_DEVICETREE_FILE_BYTES, inspectDevicetreeInputSchema, devicetreePropertySchema, devicetreeNodeSchema, devicetreeSchema;
function init_devicetree() {
	return (init_devicetree = __esmMin((() => {
		init_digests();
		init_localPath();
		uint$1 = z.number().int().min(0).max(4294967295);
		MAX_DEVICETREE_FILE_BYTES = 16777216;
		inspectDevicetreeInputSchema = z.strictObject({
			path: localPathStringSchema,
			max_file_bytes: z.number().int().min(40).max(MAX_DEVICETREE_FILE_BYTES).default(4194304),
			max_nodes: z.number().int().min(1).max(65536).default(8192),
			max_properties: z.number().int().min(1).max(262144).default(32768),
			max_depth: z.number().int().min(1).max(256).default(64)
		});
		devicetreePropertySchema = z.strictObject({
			name: z.string(),
			offset: uint$1,
			bytes: uint$1,
			hex: z.string().regex(/^[0-9a-f]*$/).max(512),
			truncated: z.boolean(),
			derived: z.strictObject({
				confidence: z.literal("derived"),
				strings: z.array(z.string()).nullable(),
				cells: z.array(uint$1).nullable(),
				reg: z.array(z.strictObject({
					address: z.string().nullable(),
					size: z.string().nullable()
				})).nullable()
			})
		});
		devicetreeNodeSchema = z.strictObject({
			path: z.string(),
			parent: z.string().nullable(),
			offset: uint$1,
			properties: z.array(devicetreePropertySchema)
		});
		devicetreeSchema = z.strictObject({
			artifact: z.strictObject({
				path: z.string(),
				sha256: digestSchema,
				bytes: uint$1
			}),
			header: z.strictObject({
				magic: uint$1,
				totalsize: uint$1,
				off_dt_struct: uint$1,
				off_dt_strings: uint$1,
				off_mem_rsvmap: uint$1,
				version: uint$1,
				last_comp_version: uint$1,
				boot_cpuid_phys: uint$1,
				size_dt_strings: uint$1,
				size_dt_struct: uint$1.nullable()
			}),
			reservations: z.array(z.strictObject({
				offset: uint$1,
				address: z.string(),
				size: z.string()
			})),
			nodes: z.array(devicetreeNodeSchema).superRefine((nodes, ctx) => {
				const paths = new Set();
				for (const [index, node] of nodes.entries()) {
					if (paths.has(node.path)) {
						ctx.addIssue({
							code: "custom",
							path: [index, "path"],
							message: "Duplicate Devicetree node path."
						});
						return;
					}
					paths.add(node.path);
				}
			}),
			references: z.array(z.strictObject({
				source: z.string(),
				property: z.string(),
				phandle: uint$1,
				target: z.string().nullable(),
				confidence: z.literal("derived")
			})),
			summary: z.strictObject({
				confidence: z.literal("derived"),
				compatible: z.array(z.string()).nullable(),
				model: z.string().nullable(),
				bootargs: z.string().nullable(),
				stdout_path: z.string().nullable(),
				aliases: z.array(z.strictObject({
					name: z.string(),
					path: z.string().nullable()
				}))
			}),
			coverage: z.strictObject({
				status: z.literal("complete"),
				examined_nodes: uint$1,
				examined_properties: uint$1
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/stringPatterns.js
var IDENTIFIER_PATTERN, STABLE_IDENTIFIER_PATTERN, BASE64_QUARTET_LENGTH_PATTERN, INVALID_BASE64_CHARACTER_PATTERN, INVALID_BASE64_PADDING_PATTERN, INVALID_CANONICAL_BASE64_PAD_BITS_PATTERN, isPaddedBase64, isCanonicalBase64, paddedBase64SchemaRules, canonicalBase64Schema;
function init_stringPatterns() {
	return (init_stringPatterns = __esmMin((() => {
		IDENTIFIER_PATTERN = /^[A-Za-z][A-Za-z0-9._\x2d]*$/u;
		STABLE_IDENTIFIER_PATTERN = /^[A-Za-z][A-Za-z0-9._:\x2f\x2d]*$/u;
		BASE64_QUARTET_LENGTH_PATTERN = /^(?:....)*$/;
		INVALID_BASE64_CHARACTER_PATTERN = /[^A-Za-z0-9+\x2f=]/;
		INVALID_BASE64_PADDING_PATTERN = /(?:=[^=]|===)/;
		INVALID_CANONICAL_BASE64_PAD_BITS_PATTERN = /(?:[^AQgw]==$|[BCDFGHJKLNOPRSTVWXZabdefhijlmnpqrtuvxyz1235679+\x2f]=$)/;
		isPaddedBase64 = (value) => value.length % 4 === 0 && !INVALID_BASE64_CHARACTER_PATTERN.test(value) && !INVALID_BASE64_PADDING_PATTERN.test(value);
		isCanonicalBase64 = (value) => isPaddedBase64(value) && !INVALID_CANONICAL_BASE64_PAD_BITS_PATTERN.test(value);
		paddedBase64SchemaRules = [
			{ pattern: BASE64_QUARTET_LENGTH_PATTERN.source },
			{ not: { pattern: INVALID_BASE64_CHARACTER_PATTERN.source } },
			{ not: { pattern: INVALID_BASE64_PADDING_PATTERN.source } }
		];
		canonicalBase64Schema = z.string().refine(isCanonicalBase64, {
			message: "Expected canonical padded base64",
			abort: true
		}).meta({ allOf: [...paddedBase64SchemaRules, { not: { pattern: INVALID_CANONICAL_BASE64_PAD_BITS_PATTERN.source } }] });
	})))();
}

//#endregion
//#region dist/domain/browserCompleteness.js
var browserSectionSchema, browserExclusionReasonSchema, browserExclusionSchema, browserDroppedEventsSchema, browserCompletenessConditionSchema, browserCompletenessSchema, classifyBrowserCompleteness, sortedSections, canonicalExclusions;
function init_browserCompleteness() {
	return (init_browserCompleteness = __esmMin((() => {
		init_unicodeCodePointOrder();
		browserSectionSchema = z.enum([
			"frames",
			"dom",
			"accessibility",
			"scripts",
			"script_sources",
			"resources",
			"network_requests",
			"network_initiators",
			"console_events",
			"console_text",
			"websocket_connections",
			"websocket_frames",
			"websocket_shapes",
			"json_body_shapes",
			"workers",
			"storage",
			"storage_keys",
			"metadata",
			"webmcp_tools",
			"screenshot",
			"source_maps",
			"timeline"
		]);
		browserExclusionReasonSchema = z.enum([
			"disallowed_origin",
			"unsupported_url",
			"unattributed_origin",
			"not_approved",
			"out_of_target_scope",
			"unattributed_target",
			"unknown_target_relationship",
			"provider_unavailable",
			"invalid_protocol_value",
			"resource_budget_exhausted"
		]);
		browserExclusionSchema = z.object({
			section: browserSectionSchema,
			reason: browserExclusionReasonSchema,
			count: z.int().min(0).nullable()
		});
		browserDroppedEventsSchema = z.object({
			scripts: z.int().min(0),
			network_requests: z.int().min(0),
			console_events: z.int().min(0),
			websocket_connections: z.int().min(0),
			websocket_frames: z.int().min(0),
			webmcp_tools: z.int().min(0),
			timeline_events: z.int().min(0),
			total: z.int().min(0)
		});
		browserCompletenessConditionSchema = z.enum([
			"complete_within_window",
			"policy_filtered",
			"attach_limited",
			"truncated"
		]);
		browserCompletenessSchema = z.object({
			status: browserCompletenessConditionSchema,
			conditions: z.array(browserCompletenessConditionSchema).min(1).max(3),
			policy_filtered_sections: z.array(browserSectionSchema),
			attach_limited_sections: z.array(browserSectionSchema),
			truncated_sections: z.array(browserSectionSchema),
			unavailable_sections: z.array(browserSectionSchema),
			excluded: z.array(browserExclusionSchema),
			dropped_events: browserDroppedEventsSchema
		});
		classifyBrowserCompleteness = (input) => {
			const policyFiltered = input.policyFilteredSections.size > 0;
			const truncated = input.truncatedSections.size > 0 || Object.values(input.droppedEvents).some((count) => count > 0);
			const attachLimited = input.attachLimitedSections.size > 0 || input.unavailableSections.size > 0;
			const status = truncated ? "truncated" : policyFiltered ? "policy_filtered" : attachLimited ? "attach_limited" : "complete_within_window";
			const conditions = [
				...attachLimited ? ["attach_limited"] : [],
				...policyFiltered ? ["policy_filtered"] : [],
				...truncated ? ["truncated"] : []
			];
			const droppedTotal = Object.values(input.droppedEvents).reduce((sum, count) => sum + count, 0);
			return browserCompletenessSchema.parse({
				status,
				conditions: conditions.length === 0 ? ["complete_within_window"] : conditions,
				policy_filtered_sections: sortedSections(input.policyFilteredSections),
				attach_limited_sections: sortedSections(input.attachLimitedSections),
				truncated_sections: sortedSections(input.truncatedSections),
				unavailable_sections: sortedSections(input.unavailableSections),
				excluded: canonicalExclusions(input.excluded),
				dropped_events: {
					...input.droppedEvents,
					total: droppedTotal
				}
			});
		};
		sortedSections = (sections) => [...sections].sort();
		canonicalExclusions = (exclusions) => [...exclusions].sort((left, right) => compareUnicodeCodePoints(left.section, right.section) || compareUnicodeCodePoints(left.reason, right.reason));
	})))();
}

//#endregion
//#region dist/domain/webContentArtifact.js
var webTextArtifactMetadataSchema, webTextArtifactSchema, createWebTextArtifact;
function init_webContentArtifact() {
	return (init_webContentArtifact = __esmMin((() => {
		webTextArtifactMetadataSchema = z.object({
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			bytes: z.int().min(0),
			media_type: z.string().min(1),
			charset: z.literal("utf-8")
		});
		webTextArtifactSchema = webTextArtifactMetadataSchema.extend({ text: z.string() }).superRefine((artifact, context) => {
			const bytes = Buffer.byteLength(artifact.text);
			const digest = createHash("sha256").update(artifact.text).digest("hex");
			if (artifact.bytes !== bytes) context.addIssue({
				code: "custom",
				path: ["bytes"],
				message: "Byte count mismatch"
			});
			if (artifact.sha256 !== digest) context.addIssue({
				code: "custom",
				path: ["sha256"],
				message: "Digest mismatch"
			});
		});
		createWebTextArtifact = (text, mediaType) => {
			const sha256 = createHash("sha256").update(text).digest("hex");
			return {
				sha256,
				bytes: Buffer.byteLength(text),
				media_type: mediaType,
				charset: "utf-8",
				text
			};
		};
	})))();
}

//#endregion
//#region dist/domain/cdpObservationSchemas.js
var cdpResourceColumnSchema, cdpDomNodeSchema, cdpDomSnapshotSchema, cdpScriptSourceSchema, cdpScriptMetadataSchema;
function init_cdpObservationSchemas() {
	return (init_cdpObservationSchemas = __esmMin((() => {
		init_webContentArtifact();
		cdpResourceColumnSchema = z.int();
		cdpDomNodeSchema = z.object({
			index: z.number().int().min(0),
			parent_index: z.number().int().min(-1),
			node_type: z.number().int().min(0),
			node_name: z.string(),
			node_value_length: z.number().int().min(0).describe("Length in the enclosing DOM snapshot's node_value_length_unit."),
			attribute_names: z.array(z.string())
		});
		cdpDomSnapshotSchema = z.object({
			total_nodes: z.int().min(0),
			node_value_length_unit: z.enum(["utf16-code-units", "utf8-bytes"]).describe("Unit for all node_value_length values; absent in historical captures means unknown.").exactOptional(),
			nodes: z.array(cdpDomNodeSchema)
		});
		cdpScriptSourceSchema = z.discriminatedUnion("included", [z.object({
			included: z.literal(false),
			reason: z.string()
		}), z.object({
			included: z.literal(true),
			artifact: webTextArtifactSchema
		})]);
		cdpScriptMetadataSchema = z.object({
			cdp_hash: z.string().nullable().describe("Producer-reported script hash; null when unavailable."),
			length: z.number().int().min(0).nullable().describe("Producer-reported script length; null when unavailable."),
			is_module: z.boolean().nullable().describe("Producer-reported module classification; null when unavailable."),
			language: z.string().nullable()
		});
	})))();
}

//#endregion
//#region dist/domain/jsonShape.js
/** Keep traversal scratch proportional to nesting rather than a wide input array. */
function* shapeChildren(value) {
	if (Array.isArray(value)) {
		for (const item of value) yield [arrayElementKey, item];
	} else if (isRecord(value)) {
		for (const key in value) if (Object.hasOwn(value, key)) yield [key, value[key]];
	}
}
var jsonValueTypeSchema, jsonShapePathSegmentSchema, jsonShapeSchema, arrayElementKey, propertyBaseBytes, digits, inferJsonShape, parseJsonObject, jsonValueType, isRecord, orderedChildren;
function init_jsonShape() {
	return (init_jsonShape = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_safeJson();
		init_jsonStringByteLength();
		init_jsonValueByteLength();
		init_result();
		jsonValueTypeSchema = z.enum([
			"object",
			"array",
			"string",
			"number",
			"boolean",
			"null"
		]);
		jsonShapePathSegmentSchema = z.discriminatedUnion("kind", [z.object({
			kind: z.literal("property"),
			name: z.string()
		}), z.object({ kind: z.literal("array-element") })]);
		jsonShapeSchema = z.object({
			root_type: jsonValueTypeSchema,
			node_count: z.int().min(1),
			max_depth_observed: z.int().min(0),
			properties: z.array(z.object({
				path: z.array(jsonShapePathSegmentSchema).min(1),
				types: z.array(jsonValueTypeSchema).min(1),
				observations: z.int().min(1)
			}))
		});
		arrayElementKey = Symbol("array-element");
		propertyBaseBytes = jsonValueByteLength({
			path: [],
			types: [],
			observations: 0
		});
		digits = (value) => String(value).length;
		inferJsonShape = (source, maximumBytes) => {
			if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 0) throw new RangeError("JSON shape byte allowance must be a non-negative safe integer");
			let text;
			try {
				text = typeof source === "string" ? source : new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(source);
			} catch {
				return err({ kind: "invalid-json" });
			}
			const parsed = safeParseJson(text);
			if (!parsed.ok) return err({ kind: "invalid-json" });
			const root = parsed.value;
			const rootType = jsonValueType(root);
			let serializedBytes = jsonValueByteLength({
				root_type: rootType,
				node_count: 0,
				max_depth_observed: 0,
				properties: []
			});
			let requiredBytesAtLeast = serializedBytes;
			const capacity = () => err({
				kind: "capacity",
				maximumBytes,
				requiredBytesAtLeast
			});
			const reserve = (bytes) => {
				requiredBytesAtLeast = serializedBytes + bytes;
				if (requiredBytesAtLeast > maximumBytes) return false;
				serializedBytes = requiredBytesAtLeast;
				return true;
			};
			if (serializedBytes > maximumBytes) return capacity();
			const rootShape = {
				depth: 0,
				pathBytes: 2,
				types: new Set(),
				observations: 0
			};
			let propertyCount = 0;
			const childShape = (parent, key) => {
				const existing = parent.children?.get(key);
				if (existing !== undefined) return existing;
				const segment = typeof key === "string" ? {
					kind: "property",
					name: key
				} : { kind: "array-element" };
				const segmentBytes = jsonValueByteLength(segment, maximumBytes - serializedBytes);
				const pathBytes = parent.pathBytes + segmentBytes + (parent.depth === 0 ? 0 : 1);
				if (!reserve(propertyBaseBytes - 2 + pathBytes + (propertyCount === 0 ? 0 : 1))) return undefined;
				const node = {
					parent,
					segment,
					depth: parent.depth + 1,
					pathBytes,
					types: new Set(),
					observations: 0
				};
				(parent.children ??= new Map()).set(key, node);
				propertyCount++;
				return node;
			};
			const pending = [{
				value: root,
				shape: rootShape
			}];
			let nodeCount = 0;
			let maxDepthObserved = 0;
			while (pending.length > 0) {
				const current = pending.at(-1);
				if (current.children === undefined) {
					const nextCount = nodeCount + 1;
					const nextDepth = Math.max(maxDepthObserved, current.shape.depth);
					if (!reserve(digits(nextCount) - digits(nodeCount) + digits(nextDepth) - digits(maxDepthObserved))) return capacity();
					nodeCount = nextCount;
					maxDepthObserved = nextDepth;
					if (current.shape.parent !== undefined) {
						const type = jsonValueType(current.value);
						const newType = !current.shape.types.has(type);
						const nextObservations = current.shape.observations + 1;
						const typeBytes = newType ? jsonStringByteLength(type) + (current.shape.types.size === 0 ? 0 : 1) : 0;
						if (!reserve(typeBytes + digits(nextObservations) - digits(current.shape.observations))) return capacity();
						current.shape.types.add(type);
						current.shape.observations = nextObservations;
					}
					current.children = shapeChildren(current.value);
				}
				const next = current.children.next();
				if (next.done) {
					pending.pop();
					continue;
				}
				const [key, value] = next.value;
				const shape = childShape(current.shape, key);
				if (shape === undefined) return capacity();
				pending.push({
					value,
					shape
				});
			}
			const properties = [];
			const shapes = orderedChildren(rootShape);
			while (shapes.length > 0) {
				const shape = shapes.pop();
				const path = [];
				let ancestor = shape;
				while (ancestor.parent !== undefined && ancestor.segment !== undefined) {
					path.push({ ...ancestor.segment });
					ancestor = ancestor.parent;
				}
				path.reverse();
				properties.push({
					path,
					types: [...shape.types].sort(),
					observations: shape.observations
				});
				for (const child of orderedChildren(shape)) shapes.push(child);
			}
			return ok({
				shape: {
					root_type: rootType,
					node_count: nodeCount,
					max_depth_observed: maxDepthObserved,
					properties
				},
				serializedBytes
			});
		};
		parseJsonObject = (text) => {
			const parsed = safeParseJson(text);
			return parsed.ok && isRecord(parsed.value) ? parsed.value : null;
		};
		jsonValueType = (value) => {
			if (value === null) return "null";
			if (Array.isArray(value)) return "array";
			switch (typeof value) {
				case "string": return "string";
				case "number": return "number";
				case "boolean": return "boolean";
				default: return "object";
			}
		};
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		orderedChildren = (node) => [...node.children ?? []].sort(([left], [right]) => left === right ? 0 : left === arrayElementKey ? 1 : right === arrayElementKey ? -1 : compareUnicodeCodePoints(right, left)).map(([, child]) => child);
	})))();
}

//#endregion
//#region dist/domain/browserObservationSchemas.js
var browserVersionSchema, browserTargetSchema, browserTargetListSchema, browserFrameSchema, browserAxNodeSchema, browserResourceReconciliationSchema, browserScriptSchema, browserResourceSchema, browserNetworkRequestSchema, browserConsoleEventSchema, browserWebSocketFrameSchema, browserWebSocketConnectionSchema, browserWorkerSchema, browserCspSourceSchema, browserLinkMetadataSchema, browserAgentHintSchema, browserSafeMetadataSchema, webPageInspectionSchema;
function init_browserObservationSchemas() {
	return (init_browserObservationSchemas = __esmMin((() => {
		init_offsetDateTime();
		init_browserCompleteness();
		init_cdpObservationSchemas();
		init_jsonShape();
		init_digests();
		browserVersionSchema = z.object({
			product: z.string(),
			protocol_version: z.string(),
			revision: z.string(),
			user_agent: z.string(),
			js_version: z.string()
		});
		browserTargetSchema = z.object({
			target_id: z.string(),
			type: z.string(),
			title: z.string(),
			url: z.string(),
			origin: z.string(),
			attached: z.boolean().nullable().describe("Discovery-reported debugger attachment state; null means unknown")
		});
		browserTargetListSchema = z.object({
			browser: browserVersionSchema,
			targets: z.array(browserTargetSchema),
			excluded: z.object({
				disallowed_origin: z.int().min(0),
				unsupported_url: z.int().min(0),
				non_page: z.int().min(0)
			}),
			limitations: z.array(z.string())
		});
		browserFrameSchema = z.object({
			frame_id: z.string(),
			parent_frame_id: z.string().nullable(),
			url: z.string(),
			origin: z.string().nullable()
		});
		browserAxNodeSchema = z.object({
			node_id: z.string(),
			parent_id: z.string().nullable(),
			role: z.string().nullable(),
			name: z.string().nullable(),
			description: z.string().nullable(),
			ignored: z.boolean(),
			states: z.array(z.object({
				name: z.string(),
				value: z.union([
					z.boolean(),
					z.number(),
					z.string()
				])
			})).default([])
		});
		browserResourceReconciliationSchema = z.discriminatedUnion("status", [
			z.object({
				status: z.literal("exact"),
				resource_key: z.string()
			}),
			z.object({
				status: z.literal("ambiguous"),
				candidate_resource_keys: z.array(z.string())
			}),
			z.object({
				status: z.literal("unmatched"),
				reason: z.literal("no_exact_sanitized_url")
			})
		]);
		browserScriptSchema = z.object({
			script_key: z.string().regex(/^scr_[a-f0-9]{64}(?:_[0-9]+)?$/u),
			frame_id: z.string().nullable().default(null),
			url: z.string(),
			origin: z.string().nullable(),
			...cdpScriptMetadataSchema.shape,
			source_map_url: z.string().nullable(),
			resource_reconciliation: browserResourceReconciliationSchema,
			source: cdpScriptSourceSchema
		});
		browserResourceSchema = z.object({
			resource_key: prefixedDigestSchema("res"),
			url: z.string(),
			origin: z.string().nullable(),
			type: z.string(),
			mime_type: z.string(),
			content_size: z.number().min(0).nullable()
		});
		browserNetworkRequestSchema = z.object({
			request_id: z.string(),
			url: z.string(),
			origin: z.string().nullable(),
			method: z.string(),
			resource_type: z.string().nullable(),
			status: z.number().nullable(),
			mime_type: z.string().nullable(),
			encoded_data_length: z.number().min(0).nullable(),
			redirects: z.array(z.object({
				url: z.string(),
				response_url: z.string(),
				method: z.string(),
				resource_type: z.string().nullable(),
				status: z.number().nullable(),
				mime_type: z.string().nullable(),
				encoded_data_length: z.number().min(0).nullable(),
				request_timestamp: z.number().nullable(),
				redirect_event_timestamp: z.number().nullable()
			})).optional(),
			initiator: z.object({
				type: z.string(),
				url: z.string().nullable(),
				line: z.int().min(0).nullable(),
				column: cdpResourceColumnSchema.nullable()
			}),
			body_shapes: z.object({
				status: z.enum([
					"not_approved",
					"included",
					"partial",
					"unavailable"
				]),
				request: jsonShapeSchema.nullable(),
				response: jsonShapeSchema.nullable()
			})
		});
		browserConsoleEventSchema = z.object({
			type: z.string(),
			timestamp: z.number().nullable().describe("CDP Runtime.Timestamp in milliseconds since Unix epoch; null when the producer value is absent or invalid."),
			argument_types: z.array(z.string()).nullable().describe("CDP argument types by argument position; null when the producer argument inventory is absent or not an array."),
			url: z.string().nullable(),
			line: z.int().min(0).nullable(),
			column: cdpResourceColumnSchema.nullable(),
			text_capture: z.object({
				status: z.enum([
					"not_approved",
					"included",
					"unavailable"
				]),
				values: z.array(z.object({
					argument_index: z.int().min(0),
					type: z.string(),
					text: z.string()
				})),
				retained_bytes: z.int().min(0)
			})
		});
		browserWebSocketFrameSchema = z.object({
			direction: z.enum(["sent", "received"]),
			opcode: z.int().min(0).max(15).nullable(),
			payload_bytes: z.int().min(0).nullable(),
			payload_shape: z.object({
				format: z.enum([
					"json",
					"text",
					"binary"
				]),
				json_shape: jsonShapeSchema.nullable()
			}).nullable()
		});
		browserWebSocketConnectionSchema = z.object({
			request_id: z.string(),
			url: z.string(),
			events: z.array(browserWebSocketFrameSchema)
		});
		browserWorkerSchema = z.object({
			target_id: z.string(),
			type: z.string(),
			url: z.string(),
			origin: z.string().nullable(),
			attached: z.boolean(),
			opener_target_id: z.string().nullable().default(null),
			parent_frame_id: z.string().nullable().default(null)
		});
		browserCspSourceSchema = z.object({
			kind: z.enum([
				"keyword",
				"scheme",
				"approved_origin",
				"external_origin",
				"other"
			]),
			value: z.string().nullable()
		});
		browserLinkMetadataSchema = z.object({
			href: z.string().nullable(),
			destination_scope: z.enum([
				"approved",
				"outside_policy",
				"unsupported"
			]),
			context_url: z.string().nullable().optional(),
			context_scope: z.enum([
				"approved",
				"outside_policy",
				"unsupported"
			]).optional(),
			rel: z.array(z.string()),
			as: z.string().nullable(),
			type: z.string().nullable(),
			crossorigin: z.string().nullable()
		});
		browserAgentHintSchema = z.object({
			mechanism: z.enum([
				"link_rel",
				"dom_link_rel",
				"well_known_resource",
				"response_header"
			]),
			declaration: z.string(),
			url: z.string().nullable(),
			trust: z.literal("page-declared-untrusted")
		});
		browserSafeMetadataSchema = z.object({
			responses: z.array(z.object({
				request_id: z.string(),
				url: z.string(),
				mime_type: z.string().nullable(),
				content_length: z.int().min(0).nullable(),
				content_encoding: z.string().nullable(),
				csp: z.object({
					directives: z.array(z.object({
						name: z.string(),
						sources: z.array(browserCspSourceSchema)
					})),
					nonce_count: z.int().min(0),
					hash_count: z.int().min(0)
				}),
				links: z.array(browserLinkMetadataSchema),
				policies: z.object({
					coop: z.string().nullable(),
					coep: z.string().nullable(),
					corp: z.string().nullable(),
					referrer_policy: z.string().nullable(),
					x_content_type_options: z.string().nullable(),
					permissions_policy_features: z.array(z.string())
				})
			})),
			dom_urls: z.array(z.object({
				node_index: z.int().min(0),
				attribute: z.enum([
					"href",
					"src",
					"action",
					"formaction",
					"poster"
				]),
				url: z.string().nullable(),
				destination_scope: z.enum([
					"approved",
					"outside_policy",
					"unsupported"
				])
			})),
			agent_hints: z.array(browserAgentHintSchema),
			excluded_dom_urls: z.int().min(0),
			headers_allowlisted: z.literal(true)
		});
		webPageInspectionSchema = z.object({
			browser: browserVersionSchema,
			target: browserTargetSchema,
			capture_window: z.object({
				started_at: utcDateTimeSchema,
				ended_at: utcDateTimeSchema,
				observation_ms: z.int().min(0)
			}),
			completeness: browserCompletenessSchema,
			frames: z.array(browserFrameSchema),
			dom: cdpDomSnapshotSchema,
			accessibility: z.object({
				total_nodes: z.int().min(0),
				text_capture: z.object({
					status: z.enum([
						"not_approved",
						"included",
						"unavailable"
					]),
					retained_bytes: z.int().min(0),
					excluded_fields: z.int().min(0)
				}),
				nodes: z.array(browserAxNodeSchema)
			}),
			scripts: z.object({
				total: z.int().min(0),
				items: z.array(browserScriptSchema)
			}),
			resources: z.array(browserResourceSchema),
			network: z.object({
				requests: z.array(browserNetworkRequestSchema),
				websocket_connections: z.array(browserWebSocketConnectionSchema),
				coverage_started_at: utcDateTimeSchema,
				prior_activity_available: z.literal(false)
			}),
			console: z.object({
				events: z.array(browserConsoleEventSchema),
				coverage_started_at: utcDateTimeSchema,
				prior_activity_available: z.literal(false)
			}),
			workers: z.array(browserWorkerSchema),
			metadata: browserSafeMetadataSchema,
			storage: z.object({
				origin: z.string(),
				usage_bytes: z.number().min(0).nullable(),
				quota_bytes: z.number().min(0).nullable(),
				local_storage_keys: z.array(z.string()),
				session_storage_keys: z.array(z.string()),
				indexed_db_names: z.array(z.string()),
				cache_names: z.array(z.string()),
				content_fingerprints: z.array(z.object({
					scope: z.enum([
						"cookie",
						"local_storage",
						"session_storage",
						"indexed_db_schema",
						"indexed_db_record",
						"cache_entry"
					]),
					identity_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
					value_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
					projection_version: z.literal(2).optional().describe("IndexedDB schema projection including database version; absent on historical store-only fingerprints."),
					complete: z.boolean()
				})).default([]),
				fingerprint_algorithm: z.literal("sha256").default("sha256"),
				fingerprints_complete: z.boolean().default(false),
				values_redacted: z.literal(true)
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/browserDeadline.js
var MAX_BROWSER_DEADLINE_MS, DEFAULT_CDP_COMMAND_TIMEOUT_MS, CDP_DISCOVERY_RESPONSE_TIMEOUT_MS, CDP_CLEANUP_GRACE_MS, optionalBrowserDeadlineMs, selectedBrowserDeadlineMs, browserDeadlineIncrease, browserDeadlineRetry, noRuntimeOverrideSentence, webRuntimeCommandTimeoutSchema, COMMAND_TIMEOUT_OPERATIONS, cdpCommandTimeoutIsSelectable, cdpCommandTimeoutUnrelatedControl, cdpDeadlineSubject, cdpCommandDeadlineRecovery, cdpCleanupGraceExpired, selectedCdpCommandTimeoutMs;
function init_browserDeadline() {
	return (init_browserDeadline = __esmMin((() => {
		MAX_BROWSER_DEADLINE_MS = 2147483647;
		DEFAULT_CDP_COMMAND_TIMEOUT_MS = 2e4;
		CDP_DISCOVERY_RESPONSE_TIMEOUT_MS = 1e4;
		CDP_CLEANUP_GRACE_MS = 5e3;
		optionalBrowserDeadlineMs = (description) => z.number().int().min(1).max(MAX_BROWSER_DEADLINE_MS).optional().describe(description);
		selectedBrowserDeadlineMs = (selected, defaultMs) => selected ?? defaultMs;
		browserDeadlineIncrease = (key, timeoutMs, defaultMs, cli) => timeoutMs < 2147483647 ? `Increase ${key} above ${String(timeoutMs)} (integer milliseconds from 1 to ${String(MAX_BROWSER_DEADLINE_MS)}; omitted means ${String(defaultMs)}), or use ${cli} on the CLI.` : `${key} is already at the maximum ${String(MAX_BROWSER_DEADLINE_MS)} ms; do not increase it further.`;
		browserDeadlineRetry = "Applies on the next call. Allow execution, cleanup and delivery headroom in the outer MCP client deadline. Confirm outstanding work and cleanup before retrying.";
		noRuntimeOverrideSentence = (allowance, unrelatedControl) => `${allowance} This release has no runtime override.${unrelatedControl === undefined ? "" : ` ${unrelatedControl} does not raise it.`}`;
		webRuntimeCommandTimeoutSchema = optionalBrowserDeadlineMs(`CDP WebSocket handshake and per-command response deadline in milliseconds (default ${String(DEFAULT_CDP_COMMAND_TIMEOUT_MS)}). Omitted means ${String(DEFAULT_CDP_COMMAND_TIMEOUT_MS)} and applies on the next call. deadlineExpired for a handshake or command is not the caller observation window, not the ${String(CDP_DISCOVERY_RESPONSE_TIMEOUT_MS)} ms CDP discovery response deadline, and not the ${String(CDP_CLEANUP_GRACE_MS)} ms cleanup grace. It also bounds passive script-source collection and the inspection/source-join phase that share this deadline. Does not raise the fixed protocol, retained-event, or source byte budgets. CDP discovery and cleanup grace have no runtime override.`);
		COMMAND_TIMEOUT_OPERATIONS = new Set([
			"inspect_web_page",
			"analyze_web_bundle",
			"observe_web_session",
			"observe_web_execution",
			"inspect_web_event_listeners",
			"discover_webmcp_tools",
			"capture_web_screenshot",
			"inspect_electron_page",
			"capture_browser_scenario"
		]);
		cdpCommandTimeoutIsSelectable = (operation) => COMMAND_TIMEOUT_OPERATIONS.has(operation);
		cdpCommandTimeoutUnrelatedControl = (operation) => cdpCommandTimeoutIsSelectable(operation) ? "command_timeout_ms" : undefined;
		cdpDeadlineSubject = (timeoutMs, phase, method, selectable) => {
			const budget = selectable ? `${String(timeoutMs)} ms command_timeout_ms` : `fixed ${String(timeoutMs)} ms`;
			if (phase === "handshake") return `CDP WebSocket handshake exceeded its ${budget} deadline (deadlineExpired).`;
			if (phase === "source-join") return `The inspection/source-join phase exceeded its ${budget} deadline (deadlineExpired).`;
			return `CDP command ${method ?? "request"} exceeded its ${budget} response deadline (deadlineExpired).`;
		};
		cdpCommandDeadlineRecovery = (timeoutMs, phase, method, selectable = true) => {
			const subject = cdpDeadlineSubject(timeoutMs, phase, method, selectable);
			if (!selectable) {
				const fixed = noRuntimeOverrideSentence(`${subject} This is not the caller observation window and not the ${String(CDP_DISCOVERY_RESPONSE_TIMEOUT_MS)} ms CDP discovery deadline.`);
				return {
					userMessage: fixed,
					remediationAction: fixed
				};
			}
			return {
				userMessage: `${subject} This is not the caller observation window, not the ${String(CDP_DISCOVERY_RESPONSE_TIMEOUT_MS)} ms CDP discovery deadline, and not the ${String(CDP_CLEANUP_GRACE_MS)} ms cleanup grace.`,
				remediationAction: `${browserDeadlineIncrease("command_timeout_ms", timeoutMs, DEFAULT_CDP_COMMAND_TIMEOUT_MS, "--command-timeout-ms")} ${browserDeadlineRetry} command_timeout_ms does not raise the fixed protocol, retained-event, or source byte budgets, the ${String(CDP_DISCOVERY_RESPONSE_TIMEOUT_MS)} ms CDP discovery response deadline, or the ${String(CDP_CLEANUP_GRACE_MS)} ms cleanup grace. Those have no runtime override.`
			};
		};
		cdpCleanupGraceExpired = () => noRuntimeOverrideSentence(`CDP runtime cleanup exceeded its ${String(CDP_CLEANUP_GRACE_MS)} ms cleanup grace.`, "command_timeout_ms");
		selectedCdpCommandTimeoutMs = (selected) => selectedBrowserDeadlineMs(selected, DEFAULT_CDP_COMMAND_TIMEOUT_MS);
	})))();
}

//#endregion
//#region dist/domain/emptyArraySchema.js
var emptyArraySchema;
function init_emptyArraySchema() {
	return (init_emptyArraySchema = __esmMin((() => {
		emptyArraySchema = z.array(z.never()).length(0);
	})))();
}

//#endregion
//#region dist/domain/urlComponents.js
var urlDeclaresQueryOrFragment;
function init_urlComponents() {
	return (init_urlComponents = __esmMin((() => {
		urlDeclaresQueryOrFragment = (url) => url.href.includes("?") || url.href.includes("#");
	})))();
}

//#endregion
//#region dist/domain/recordedTransportUrl.js
/** Separator coordinates shared by name projection and selected-value matching. */
function* queryFields(query) {
	let start = query.startsWith("?") ? 1 : 0;
	let equals = query.indexOf("=", start);
	while (start < query.length) {
		const separator = query.indexOf("&", start);
		const end = separator < 0 ? query.length : separator;
		if (end > start) yield [
			start,
			equals >= start && equals < end ? equals : end,
			end
		];
		start = end + 1;
		if (equals >= 0 && equals < start) equals = query.indexOf("=", start);
	}
}
/** Scan one field at a time; selection avoids decoding unrelated values. */
function* iterateUrlQueryParameters(query, selected) {
	for (const [start, nameEnd, end] of queryFields(query)) {
		const name = formComponent(query.slice(start, nameEnd));
		if (selected === undefined || selected.has(name)) yield [name, formComponent(nameEnd < end ? query.slice(nameEnd + 1, end) : "")];
	}
}
/** WHATWG form-query names, preserving order, repeats and empty names without decoding values. */
function* parseUrlQueryParameterNames(query) {
	for (const [start, nameEnd] of queryFields(query)) yield formComponent(query.slice(start, nameEnd));
}
var parseRecordedTransportUrl, formComponent, singleQueryValues, recordedPathSegments;
function init_recordedTransportUrl() {
	return (init_recordedTransportUrl = __esmMin((() => {
		parseRecordedTransportUrl = (value, options = {}) => {
			const prefix = /^[\x00-\x20]*(?:([A-Za-z][A-Za-z0-9+.-]*):)?\/\//u.exec(value);
			const absolute = URL.parse(value);
			const credentialBase = options.credentialBaseUrl === undefined ? null : URL.parse(options.credentialBaseUrl);
			if (credentialBase !== null) {
				credentialBase.username = "";
				credentialBase.password = "";
			}
			const parsed = credentialBase === null ? absolute ?? URL.parse(value, "https://rea.invalid") : URL.parse(value, credentialBase);
			const hasCredentials = parsed !== null && (parsed.username !== "" || parsed.password !== "");
			const origin = absolute !== null && absolute.origin !== "null" ? absolute.origin : null;
			if (prefix === null) return {
				origin,
				path: null,
				credentials: hasCredentials ? "ambiguous" : null
			};
			const authorityStart = prefix[0].length;
			const protocol = parsed?.protocol ?? `${prefix[1]?.toLowerCase() ?? "https"}:`;
			const special = [
				"ftp:",
				"file:",
				"http:",
				"https:",
				"ws:",
				"wss:"
			].includes(protocol);
			let authorityEnd = authorityStart;
			while (authorityEnd < value.length && !"/?#".includes(value[authorityEnd]) && !(special && value[authorityEnd] === "\\")) authorityEnd += 1;
			const authority = value.slice(authorityStart, authorityEnd);
			const stableAuthority = authority.length > 0 && !/[\t\n\r]/u.test(authority);
			const at = authority.lastIndexOf("@");
			const credentials = !stableAuthority && hasCredentials ? "ambiguous" : at >= 0 ? {
				start: authorityStart,
				end: authorityStart + at + 1
			} : hasCredentials ? "ambiguous" : null;
			if (origin === null || !/^[A-Za-z][A-Za-z0-9+.-]*:\/\//u.test(value) || !stableAuthority || special && value[authorityEnd] === "\\") return {
				origin,
				path: null,
				credentials
			};
			const hash = value.indexOf("#", authorityEnd);
			const question = value.indexOf("?", authorityEnd);
			const hasQuery = question >= 0 && (hash < 0 || question < hash);
			const query = options.includeQuery === true ? { query: absolute.search || (hasQuery ? "?" : "") } : {};
			if (value[authorityEnd] !== "/") return {
				origin,
				path: "/",
				credentials,
				...query
			};
			let pathEnd = authorityEnd;
			while (pathEnd < value.length && !"?#".includes(value[pathEnd])) pathEnd += 1;
			return {
				origin,
				path: value.slice(authorityEnd, pathEnd),
				credentials,
				...query
			};
		};
		formComponent = (raw) => {
			if (!/[%+\uD800-\uDFFF]/u.test(raw)) return raw;
			if (!/[\uD800-\uDFFF]/u.test(raw)) {
				try {
					return decodeURIComponent(raw.replaceAll("+", " "));
				} catch {}
			}
			return new URLSearchParams(`value=${raw}`).get("value") ?? "";
		};
		singleQueryValues = (query) => {
			const values = new Map();
			for (const [name, value] of iterateUrlQueryParameters(query ?? "")) {
				if (values.has(name) && values.get(name) !== value) return undefined;
				values.set(name, value);
			}
			return values;
		};
		recordedPathSegments = (path, indexes) => {
			const needed = new Set();
			for (const index of indexes) if (Number.isSafeInteger(index) && index >= 0) needed.add(index);
			const result = new Map();
			if (needed.size === 0) return result;
			let start = path.indexOf("/");
			if (start < 0) return result;
			start += 1;
			let index = 0;
			while (needed.size > 0) {
				const end = path.indexOf("/", start);
				if (needed.delete(index)) result.set(index, path.slice(start, end < 0 ? path.length : end));
				if (end < 0) break;
				start = end + 1;
				index += 1;
			}
			return result;
		};
	})))();
}

//#endregion
//#region dist/domain/browserObservation.js
var parseExactOrigin, browserOriginSchema, recordedBrowserOriginSchema, isLiteralLoopbackHostname, HTTP_ENDPOINT_MESSAGE, BROWSER_SOCKET_PATH, REDACTED_BROWSER_SOCKET_PATH, explicitEndpointAuthority, httpDiscoveryOrigin, browserSocketAuthority, browserEndpointSchema, browserObservationEndpointSchema, recordedBrowserObservationEndpointSchema, browserAllowedOriginsSchema, browserInput, listBrowserTargetsInputSchema, inspectWebPageInputFacts, inspectWebPageWithoutSourceSchema, inspectWebPageWithSourceShapeSchema, refineInspectWebPageInput, inspectWebPageWithSourceInputSchema, inspectWebPageInputSchema, sanitizedBrowserUrlSchema, observeBrowserUrl, sanitizeBrowserUrl, removeUrlUserInfo, credentialFreeHref, sanitizeEndpointCandidate;
function init_browserObservation() {
	return (init_browserObservation = __esmMin((() => {
		init_browserDeadline();
		init_urlComponents();
		init_recordedTransportUrl();
		parseExactOrigin = (value) => {
			let url;
			try {
				url = new URL(value);
			} catch (cause) {
				void cause;
				return undefined;
			}
			if (url.protocol !== "http:" && url.protocol !== "https:" || url.hostname.includes("*") || url.username !== "" || url.password !== "" || url.pathname !== "/" || urlDeclaresQueryOrFragment(url)) return undefined;
			return url.origin;
		};
		browserOriginSchema = z.string().min(1).transform((value, context) => {
			const origin = parseExactOrigin(value);
			if (origin === undefined) {
				context.addIssue({
					code: "custom",
					message: "Expected one exact HTTP(S) origin without a path or wildcard"
				});
				return z.NEVER;
			}
			return origin;
		});
		recordedBrowserOriginSchema = z.string().superRefine((value, context) => {
			const parsed = browserOriginSchema.safeParse(value);
			if (parsed.success && parsed.data === value) return;
			context.addIssue({
				code: "custom",
				message: "Expected one canonical HTTP(S) origin"
			});
		});
		isLiteralLoopbackHostname = (hostname) => hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1";
		HTTP_ENDPOINT_MESSAGE = "CDP endpoint must be an explicit-port HTTP URL on 127.0.0.1 or ::1";
		BROWSER_SOCKET_PATH = "/devtools/browser/";
		REDACTED_BROWSER_SOCKET_PATH = `${BROWSER_SOCKET_PATH}[REDACTED]`;
		explicitEndpointAuthority = (value, url) => {
			const authority = /^[a-z][a-z0-9+.-]*:\/\/([^/?#\\]*)/iu.exec(value)?.[1];
			const port = authority === undefined ? undefined : /:([0-9]+)$/u.exec(authority)?.[1];
			return port === undefined ? undefined : `${url.protocol}//${url.hostname}:${String(Number(port))}`;
		};
		httpDiscoveryOrigin = (value, url) => url.protocol === "http:" && isLiteralLoopbackHostname(url.hostname) && url.username === "" && url.password === "" && url.pathname === "/" && !urlDeclaresQueryOrFragment(url) ? explicitEndpointAuthority(value, url) : undefined;
		browserSocketAuthority = (value, url) => {
			const id = url.pathname.slice(BROWSER_SOCKET_PATH.length);
			return url.protocol === "ws:" && isLiteralLoopbackHostname(url.hostname) && url.username === "" && url.password === "" && !urlDeclaresQueryOrFragment(url) && url.pathname.startsWith(BROWSER_SOCKET_PATH) && id.length > 0 && !id.includes("/") ? explicitEndpointAuthority(value, url) : undefined;
		};
		browserEndpointSchema = z.string().min(1).transform((value, context) => {
			const url = URL.parse(value);
			const origin = url === null ? undefined : httpDiscoveryOrigin(value, url);
			if (origin !== undefined) return origin;
			context.addIssue({
				code: "custom",
				message: url === null ? "Invalid CDP endpoint URL" : HTTP_ENDPOINT_MESSAGE
			});
			return z.NEVER;
		});
		browserObservationEndpointSchema = z.string().min(1).describe("Literal loopback CDP endpoint: http://127.0.0.1:PORT, or ws://127.0.0.1:PORT/devtools/browser/ID.").transform((value, context) => {
			const url = URL.parse(value);
			if (url === null) {
				context.addIssue({
					code: "custom",
					message: "Invalid CDP endpoint URL"
				});
				return z.NEVER;
			}
			const origin = httpDiscoveryOrigin(value, url);
			if (origin !== undefined) return {
				transport: "http_discovery",
				url: origin,
				recorded: origin
			};
			const authority = browserSocketAuthority(value, url);
			if (authority !== undefined) return {
				transport: "browser_websocket",
				url: `${authority}${url.pathname}`,
				recorded: `${authority}${REDACTED_BROWSER_SOCKET_PATH}`
			};
			context.addIssue({
				code: "custom",
				message: url.protocol === "ws:" ? "CDP browser WebSocket must be ws://127.0.0.1:PORT/devtools/browser/ID or ws://[::1]:PORT/devtools/browser/ID" : HTTP_ENDPOINT_MESSAGE
			});
			return z.NEVER;
		});
		recordedBrowserObservationEndpointSchema = z.string().min(1).refine((value) => {
			const url = URL.parse(value);
			return url !== null && (httpDiscoveryOrigin(value, url) !== undefined || browserSocketAuthority(value, url) !== undefined && url.pathname === REDACTED_BROWSER_SOCKET_PATH);
		}, { message: "Recorded CDP endpoint must be a loopback HTTP origin or a redacted browser WebSocket URL" });
		browserAllowedOriginsSchema = z.array(browserOriginSchema).transform((origins) => Array.from(new Set(origins)).sort()).default([]);
		browserInput = {
			cdp_endpoint: browserObservationEndpointSchema,
			allowed_origins: browserAllowedOriginsSchema
		};
		listBrowserTargetsInputSchema = z.strictObject({ ...browserInput });
		inspectWebPageInputFacts = {
			...browserInput,
			target_id: z.string().min(1),
			command_timeout_ms: webRuntimeCommandTimeoutSchema,
			observation_ms: z.int().min(0).default(500),
			include_accessibility_text: z.boolean().default(false),
			include_console_text: z.boolean().default(false),
			include_json_body_shapes: z.boolean().default(false),
			include_websocket_shapes: z.boolean().default(false),
			include_storage_keys: z.boolean().default(false),
			include_storage_fingerprints: z.boolean().default(false)
		};
		inspectWebPageWithoutSourceSchema = z.strictObject({
			...inspectWebPageInputFacts,
			include_script_sources: z.literal(false).optional().default(false)
		});
		inspectWebPageWithSourceShapeSchema = z.strictObject({
			...inspectWebPageInputFacts,
			include_script_sources: z.literal(true).default(true)
		});
		refineInspectWebPageInput = (input, context) => {
			if (input.include_storage_fingerprints && !input.include_storage_keys) context.addIssue({
				code: "custom",
				path: ["include_storage_fingerprints"],
				message: "Storage fingerprints require storage key capture"
			});
		};
		inspectWebPageWithSourceInputSchema = inspectWebPageWithSourceShapeSchema.superRefine(refineInspectWebPageInput);
		inspectWebPageInputSchema = z.discriminatedUnion("include_script_sources", [inspectWebPageWithoutSourceSchema.superRefine(refineInspectWebPageInput), inspectWebPageWithSourceShapeSchema.extend({ include_script_sources: z.literal(true) }).superRefine(refineInspectWebPageInput)]);
		sanitizedBrowserUrlSchema = z.object({
			url: z.string(),
			origin: z.string().nullable(),
			query_parameter_names: z.array(z.string()),
			redacted: z.boolean()
		});
		observeBrowserUrl = (value) => {
			let parsed;
			try {
				parsed = new URL(value);
			} catch (cause) {
				void cause;
				return {
					kind: "malformed",
					source: value
				};
			}
			const hadCredentials = parsed.username !== "" || parsed.password !== "";
			return {
				kind: "parsed",
				source: value,
				protocol: parsed.protocol,
				sanitized: {
					url: hadCredentials ? removeUrlUserInfo(value, parsed) : value,
					origin: parsed.origin === "null" ? null : parsed.origin,
					query_parameter_names: [...parseUrlQueryParameterNames(parsed.search)],
					redacted: hadCredentials
				}
			};
		};
		sanitizeBrowserUrl = (value) => {
			const observation = observeBrowserUrl(value);
			return observation.kind === "parsed" ? observation.sanitized : {
				url: observation.source,
				origin: null,
				query_parameter_names: [],
				redacted: false
			};
		};
		removeUrlUserInfo = (value, parsed) => {
			const { credentials } = parseRecordedTransportUrl(value);
			return credentials === null || credentials === "ambiguous" ? credentialFreeHref(parsed) : `${value.slice(0, credentials.start)}${value.slice(credentials.end)}`;
		};
		credentialFreeHref = (parsed) => {
			parsed.username = "";
			parsed.password = "";
			return parsed.href;
		};
		sanitizeEndpointCandidate = (value) => {
			return sanitizeBrowserUrl(value).url;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptArtifactFiles.js
var javaScriptFileOccurrenceSchema, isJavaScriptSourcePath, javaScriptArtifactTextExclusion, javaScriptSemanticSourceExclusion;
function init_javascriptArtifactFiles() {
	return (init_javascriptArtifactFiles = __esmMin((() => {
		init_digests();
		javaScriptFileOccurrenceSchema = z.strictObject({
			container_sha256: digestSchema,
			path: z.string().min(1),
			sha256: digestSchema
		});
		isJavaScriptSourcePath = (path) => /\.(?:cjs|cts|mjs|mts|js|jsx|ts|tsx)$/iu.test(path);
		javaScriptArtifactTextExclusion = (file) => {
			if (file.text.included || file.text.reason === "not-applicable") return null;
			if (file.text.reason === "invalid-utf8" && file.kind !== "javascript") return null;
			return file.text.reason === "outside-analysis-scope" ? "Source was not analyzed because it is outside the caller-selected source_paths." : "Source bytes are not valid UTF-8; JavaScript semantics were not analyzed.";
		};
		javaScriptSemanticSourceExclusion = (file, parseStatus) => {
			if (file.kind !== "javascript") return null;
			return javaScriptArtifactTextExclusion(file) ?? (parseStatus === "failed" ? "JavaScript syntax could not be parsed; JavaScript semantics were not analyzed." : null);
		};
	})))();
}

//#endregion
//#region dist/domain/referenceSourcePathIdentity.js
var createReferenceSourcePathLookup, isPortableAbsoluteReferenceTarget, decodeReferenceSourceModuleUrlPath;
function init_referenceSourcePathIdentity() {
	return (init_referenceSourcePathIdentity = __esmMin((() => {
		init_result();
		createReferenceSourcePathLookup = (paths) => {
			const exact = new Set(paths);
			const canonical = new Map();
			for (const path of exact) {
				const key = path.normalize("NFC");
				canonical.set(key, canonical.has(key) ? null : path);
			}
			const equivalent = (path) => canonical.get(path.normalize("NFC")) ?? undefined;
			const has = (path) => exact.has(path) || canonical.has(path.normalize("NFC"));
			const resolve = (path) => exact.has(path) ? path : equivalent(path);
			return {
				has,
				resolve,
				resolveCandidates: (candidates) => candidates.find((path) => exact.has(path)) ?? candidates.map(equivalent).find((path) => path !== undefined),
				resolveAncestor: (path) => {
					for (let candidate = path; candidate !== "." && candidate !== "/"; candidate = posix.dirname(candidate)) {
						const found = resolve(candidate);
						if (found !== undefined) return found;
					}
					return undefined;
				}
			};
		};
		isPortableAbsoluteReferenceTarget = (target) => target.startsWith("/") || /^[A-Za-z]:[\\/]/u.test(target) || /^\\\\[^\\/]+[\\/][^\\/]+/u.test(target);
		decodeReferenceSourceModuleUrlPath = (value) => {
			if (/%2f/iu.test(value)) return err("Historical module URL paths cannot contain percent-encoded slash bytes.");
			try {
				const decoded = decodeURIComponent(value);
				return decoded.includes("\0") ? err("The decoded historical module URL path contains NUL.") : ok(decoded);
			} catch (cause) {
				if (!(cause instanceof URIError)) throw cause;
				return err("The historical module URL path contains malformed percent encoding.");
			}
		};
	})))();
}

//#endregion
//#region dist/domain/referenceSourceGraph.js
function checkGraphInvariants(graph, context) {
	checkSortedUnique(graph.entries.map(({ path }) => path), "entries", context);
	for (const [index, entry] of graph.entries.entries()) checkSortedUnique(entry.classifications, `entries.${index}.classifications`, context);
	checkSortedUnique(graph.languages, "languages", context);
	checkSortedUnique(graph.manifests, "manifests", context);
	checkSortedUnique(graph.relationships.map(historicalSourceRelationshipKey), "relationships", context);
	checkSortedUnique(graph.parse_failures.map(historicalSourceParseFailureKey), "parse_failures", context);
	checkSortedUnique(graph.exclusions.map((exclusion) => `${exclusion.path}\u0000${exclusion.reason}\u0000${"pattern" in exclusion ? exclusion.pattern : ""}`), "exclusions", context);
	if (canonicalJson(graph.languages, "Reference source graph") !== canonicalJson(historicalSourceLanguages(graph.entries), "Reference source graph")) context.addIssue({
		code: "custom",
		message: "languages must be derived from file entries",
		path: ["languages"]
	});
	if (canonicalJson(graph.manifests, "Reference source graph") !== canonicalJson(historicalSourceManifests(graph.entries), "Reference source graph")) context.addIssue({
		code: "custom",
		message: "manifests must be derived from classified file entries",
		path: ["manifests"]
	});
	const paths = new Set(graph.entries.map(({ path }) => path));
	checkRelationships(graph, paths, context);
	checkSymlinks(graph, paths, context);
	checkCompleteInventory(graph, context);
}
var boundedTextSchema, relativePathSchema, classificationSchema, entryBaseShape, sourceFileBaseShape, sourceFileSchema, sourceDirectorySchema, symlinkTargetSchema, sourceSymlinkSchema, sourceEntrySchema, sourceRelationshipSchema, parseFailureSchema, exclusionSchema, vcsSchema, graphShape, historicalSourceGraphStructureSchema, historicalSourceGraphSchema, historicalSourceGraphInputSchema, historicalSourceManifestBaseSchema, historicalSourceInventoryHasPartialFacts, historicalSourceParseFailureKey, historicalSourceRelationshipKey, checkSortedUnique, historicalSourceLanguages, historicalSourceManifests, checkRelationships, checkSymlinks, checkCompleteInventory, rootCommitment, computeRootSha256, createHistoricalSourceGraph, parseHistoricalSourceGraph, computeHistoricalSourceGraphSha256, createHistoricalSourceManifest;
function init_referenceSourceGraph() {
	return (init_referenceSourceGraph = __esmMin((() => {
		init_comparisonSemantics();
		init_canonicalDigest();
		init_referenceSourcePathIdentity();
		init_unicodeCodePointOrder();
		init_digests();
		boundedTextSchema = z.string().min(1);
		relativePathSchema = z.string().min(1).refine((path) => !path.startsWith("/") && !path.includes("\0") && path.split("/").every((part) => part !== "" && part !== "." && part !== ".."), "Expected a normalized relative POSIX path without traversal");
		classificationSchema = z.enum([
			"source",
			"test",
			"config",
			"manifest",
			"generated",
			"vendor",
			"documentation",
			"unknown"
		]);
		entryBaseShape = {
			path: relativePathSchema,
			classifications: z.array(classificationSchema).min(1),
			limitations: z.array(boundedTextSchema),
			local_diagnostics: z.array(boundedTextSchema).exactOptional()
		};
		sourceFileBaseShape = {
			...entryBaseShape,
			kind: z.literal("file"),
			language: z.string().min(1).nullable()
		};
		sourceFileSchema = z.union([z.strictObject({
			...sourceFileBaseShape,
			sha256: digestSchema,
			size: z.int().min(0).max(Number.MAX_SAFE_INTEGER),
			content_state: z.literal("hashed")
		}), z.strictObject({
			...sourceFileBaseShape,
			sha256: z.null(),
			size: z.int().min(0).max(Number.MAX_SAFE_INTEGER).nullable(),
			content_state: z.enum([
				"redacted-secret",
				"excluded",
				"unreadable",
				"unknown"
			])
		})]);
		sourceDirectorySchema = z.strictObject({
			...entryBaseShape,
			kind: z.literal("directory"),
			tree_state: z.enum([
				"enumerated",
				"partial",
				"excluded",
				"unreadable",
				"unknown"
			])
		});
		symlinkTargetSchema = z.string().min(1).refine((target) => !target.includes("\0") && (isPortableAbsoluteReferenceTarget(target) || !target.startsWith("/") && posix.normalize(target) === target), "Expected a normalized POSIX symlink target");
		sourceSymlinkSchema = z.union([z.strictObject({
			...entryBaseShape,
			kind: z.literal("symlink"),
			target: symlinkTargetSchema,
			target_state: z.enum([
				"internal",
				"external",
				"missing"
			])
		}), z.strictObject({
			...entryBaseShape,
			kind: z.literal("symlink"),
			target: z.null(),
			target_state: z.enum(["unreadable", "unknown"])
		})]);
		sourceEntrySchema = z.union([
			sourceFileSchema,
			sourceDirectorySchema,
			sourceSymlinkSchema,
			z.strictObject({
				...entryBaseShape,
				kind: z.literal("unknown")
			})
		]);
		sourceRelationshipSchema = z.strictObject({
			from_path: relativePathSchema,
			to: z.string().min(1),
			source_specifier: z.string().min(1).exactOptional(),
			kind: z.enum([
				"imports",
				"requires",
				"references",
				"declares-module"
			]),
			resolution: z.enum([
				"internal",
				"external",
				"unresolved",
				"unknown"
			]),
			parse_state: z.enum([
				"parsed",
				"partial",
				"unknown"
			])
		});
		parseFailureSchema = z.strictObject({
			path: relativePathSchema,
			parser: z.string().min(1),
			reason: boundedTextSchema
		});
		exclusionSchema = z.discriminatedUnion("reason", [z.strictObject({
			path: relativePathSchema,
			entry_kind: z.enum([
				"file",
				"directory",
				"symlink",
				"other",
				"unknown"
			]).exactOptional(),
			reason: z.enum([
				"configured-secret",
				"project-ignored",
				"default-ignored",
				"caller-excluded"
			]),
			pattern: boundedTextSchema
		}), z.strictObject({
			path: relativePathSchema,
			entry_kind: z.enum([
				"file",
				"directory",
				"symlink",
				"other",
				"unknown"
			]).exactOptional(),
			reason: z.enum(["symlink-escape", "unreadable"])
		})]);
		vcsSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("git"),
				head: z.string().regex(/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u),
				dirty: z.boolean().nullable()
			}),
			z.strictObject({
				kind: z.literal("none"),
				head: z.null(),
				dirty: z.null()
			}),
			z.strictObject({
				kind: z.literal("unknown"),
				head: z.null(),
				dirty: z.null()
			})
		]).nullable();
		graphShape = {
			schema: z.literal("HistoricalSourceGraph"),
			authority: z.literal("historical-reference"),
			root_alias: z.literal("$REFERENCE_ROOT"),
			root_sha256: digestSchema,
			inventory_state: z.enum([
				"complete",
				"partial",
				"unknown"
			]),
			entries: z.array(sourceEntrySchema),
			relationships: z.array(sourceRelationshipSchema),
			parse_failures: z.array(parseFailureSchema),
			exclusions: z.array(exclusionSchema),
			languages: z.array(z.string().min(1)),
			manifests: z.array(relativePathSchema),
			vcs: vcsSchema,
			provenance: z.strictObject({
				importer: z.string().min(1),
				importer_version: z.string().min(1).nullable(),
				caller: z.string().min(1).regex(/^[\w .:@\x2f+\x2d]+$/u)
			}),
			limitations: z.array(boundedTextSchema)
		};
		historicalSourceGraphStructureSchema = z.strictObject(graphShape).superRefine(checkGraphInvariants);
		historicalSourceGraphSchema = historicalSourceGraphStructureSchema.superRefine((graph, context) => {
			if (computeRootSha256(graph.entries, graph.exclusions) !== graph.root_sha256) context.addIssue({
				code: "custom",
				message: "Historical source root commitment does not match entries",
				path: ["root_sha256"]
			});
		});
		historicalSourceGraphInputSchema = z.strictObject({
			...graphShape,
			root_sha256: z.never().optional()
		});
		historicalSourceManifestBaseSchema = z.strictObject({
			schema: z.literal("HistoricalSourceManifest"),
			authority: z.literal("historical-reference"),
			manifest_id: prefixedDigestSchema("hsm"),
			graph_sha256: digestSchema,
			root_sha256: digestSchema,
			inventory_state: z.enum([
				"complete",
				"partial",
				"unknown"
			]),
			entry_count: z.int().min(0).max(Number.MAX_SAFE_INTEGER),
			relationship_count: z.int().min(0).max(Number.MAX_SAFE_INTEGER)
		});
		historicalSourceInventoryHasPartialFacts = (input) => input.limitations.length > 0 || input.exclusions.length > 0 || input.parse_failures.length > 0 || input.entries.some((entry) => entry.limitations.length > 0 || entry.kind === "file" && entry.content_state !== "hashed" || entry.kind === "directory" && entry.tree_state !== "enumerated" || entry.kind === "symlink" && entry.target_state !== "internal" || entry.kind === "unknown") || input.relationships.some(({ parse_state, resolution }) => parse_state !== "parsed" || resolution === "unresolved" || resolution === "unknown");
		historicalSourceParseFailureKey = (failure) => `${failure.path}\u0000${failure.parser}\u0000${failure.reason}`;
		historicalSourceRelationshipKey = (relationship) => `${relationship.from_path}\u0000${relationship.to}\u0000${relationship.kind}\u0000${relationship.resolution}\u0000${relationship.parse_state}${relationship.source_specifier === undefined ? "" : `\u0000${relationship.source_specifier}`}`;
		checkSortedUnique = (values, field, context) => {
			for (let index = 1; index < values.length; index += 1) if (compareUnicodeCodePoints(values[index - 1] ?? "", values[index] ?? "") >= 0) {
				context.addIssue({
					code: "custom",
					message: `${field} must be sorted and unique by Unicode code point`,
					path: [field, index]
				});
				return;
			}
		};
		historicalSourceLanguages = (entries) => [...new Set(entries.flatMap((entry) => entry.kind === "file" && entry.language !== null ? [entry.language] : []))].sort(compareUnicodeCodePoints);
		historicalSourceManifests = (entries) => entries.flatMap((entry) => entry.kind === "file" && entry.classifications.includes("manifest") ? [entry.path] : []).sort(compareUnicodeCodePoints);
		checkRelationships = (graph, paths, context) => {
			const files = new Set(graph.entries.flatMap((entry) => entry.kind === "file" ? [entry.path] : []));
			for (const [index, relationship] of graph.relationships.entries()) {
				if (!files.has(relationship.from_path)) context.addIssue({
					code: "custom",
					message: "Relationship source must name an inventoried file",
					path: [
						"relationships",
						index,
						"from_path"
					]
				});
				if (relationship.resolution !== "internal") continue;
				const parsed = relativePathSchema.safeParse(relationship.to);
				if (!parsed.success || !paths.has(parsed.data)) context.addIssue({
					code: "custom",
					message: "Internal relationship target must be normalized and inventoried",
					path: [
						"relationships",
						index,
						"to"
					]
				});
			}
		};
		checkSymlinks = (graph, paths, context) => {
			const lookupPath = createReferenceSourcePathLookup(paths);
			const excludedPaths = createReferenceSourcePathLookup(graph.exclusions.map(({ path }) => path));
			const excludedKinds = new Map();
			for (const { path, entry_kind } of graph.exclusions) {
				const kinds = excludedKinds.get(path) ?? new Set();
				kinds.add(entry_kind);
				excludedKinds.set(path, kinds);
			}
			for (const [index, entry] of graph.entries.entries()) {
				if (entry.kind !== "symlink") continue;
				if (entry.target === null) continue;
				const resolved = posix.normalize(posix.join(posix.dirname(entry.path), entry.target));
				const escapesRoot = resolved.startsWith("../") || resolved === "..";
				const inventoried = resolved === "." || lookupPath.resolve(resolved) !== undefined;
				const exactExcluded = excludedPaths.resolve(resolved);
				let excluded = exactExcluded !== undefined;
				for (let candidate = posix.dirname(resolved); candidate !== "." && candidate !== "/"; candidate = posix.dirname(candidate)) {
					const excludedAncestor = excludedPaths.resolve(candidate);
					if (excludedAncestor === undefined) continue;
					const kinds = excludedKinds.get(excludedAncestor);
					if (kinds?.size !== 1 || !kinds.has("directory")) {
						excluded = false;
						break;
					}
					excluded = true;
				}
				const ownedRelativeTarget = !entry.target.startsWith("/") && !escapesRoot && inventoried;
				const absolute = isPortableAbsoluteReferenceTarget(entry.target) && !(entry.target_state === "internal" && ownedRelativeTarget);
				if (entry.target_state === "external" && !absolute || entry.target_state === "internal" && absolute) context.addIssue({
					code: "custom",
					message: "Symlink target path does not match its target state",
					path: [
						"entries",
						index,
						"target"
					]
				});
				if (entry.target_state !== "internal") continue;
				if (escapesRoot || !inventoried && !excluded) context.addIssue({
					code: "custom",
					message: "Internal symlink target must resolve to an inventoried entry or a recorded exclusion",
					path: [
						"entries",
						index,
						"target"
					]
				});
			}
		};
		checkCompleteInventory = (graph, context) => {
			if (graph.inventory_state !== "complete" || !historicalSourceInventoryHasPartialFacts(graph)) return;
			context.addIssue({
				code: "custom",
				message: "Complete inventory cannot contain partial states, exclusions, failures, or limitations",
				path: ["inventory_state"]
			});
		};
		rootCommitment = (entries, exclusions) => ({
			entries: entries.map((entry) => {
				switch (entry.kind) {
					case "file": return {
						kind: entry.kind,
						path: entry.path,
						sha256: entry.sha256,
						size: entry.size,
						content_state: entry.content_state
					};
					case "directory": return {
						kind: entry.kind,
						path: entry.path,
						tree_state: entry.tree_state
					};
					case "symlink": return {
						kind: entry.kind,
						path: entry.path,
						target: entry.target,
						target_state: entry.target_state
					};
					case "unknown": return {
						kind: entry.kind,
						path: entry.path
					};
				}
			}),
			exclusions
		});
		computeRootSha256 = (entries, exclusions) => digestCanonicalValue(rootCommitment(entries, exclusions), "Reference source graph");
		createHistoricalSourceGraph = (input) => {
			const parsed = historicalSourceGraphInputSchema.parse(input);
			return historicalSourceGraphSchema.parse({
				...parsed,
				root_sha256: computeRootSha256(parsed.entries, parsed.exclusions)
			});
		};
		parseHistoricalSourceGraph = (input) => historicalSourceGraphSchema.parse(input);
		computeHistoricalSourceGraphSha256 = (graph) => digestCanonicalValue({
			...graph,
			entries: graph.entries.map(({ local_diagnostics: _local, ...entry }) => entry)
		}, "Reference source graph");
		createHistoricalSourceManifest = (input) => {
			const graph = parseHistoricalSourceGraph(input);
			const semantic = {
				schema: "HistoricalSourceManifest",
				authority: "historical-reference",
				graph_sha256: computeHistoricalSourceGraphSha256(graph),
				root_sha256: graph.root_sha256,
				inventory_state: graph.inventory_state,
				entry_count: graph.entries.length,
				relationship_count: graph.relationships.length
			};
			return historicalSourceManifestBaseSchema.parse({
				...semantic,
				manifest_id: `hsm_${digestCanonicalValue(semantic, "Reference source graph")}`
			});
		};
	})))();
}

//#endregion
//#region dist/domain/native/nativeString.js
var analysisStringSchema;
function init_nativeString() {
	return (init_nativeString = __esmMin((() => {
		init_nativeFactAvailability();
		analysisStringSchema = z.object({
			address: z.string(),
			value: z.string(),
			provider_value: z.string().exactOptional().describe("Original provider display text, which may shorten the typed object."),
			decoding: unavailableNativeFactSchema.exactOptional().describe("When present, value retains native display text because typed bytes could not be decoded."),
			string: z.object({
				encoding: z.string().min(1),
				encoding_status: z.enum(["observed", "inferred"]).exactOptional().describe("Whether the provider declares the encoding or REA infers it from the typed bytes and native display. This does not establish the original source's intended encoding."),
				termination: z.enum(["missing", "present_or_not_required"]),
				byte_length: z.int().min(0)
			}).exactOptional()
		});
	})))();
}

//#endregion
//#region dist/domain/browserNetworkEvidence.js
var PLAYWRIGHT_RESPONSE_BODY_PROVENANCE_LIMITATION, browserNetworkContentSelectionValuesSchema, browserNetworkContentSelectionSchema, unavailableBrowserNetworkBodySchema, browserNetworkBodySchema, browserNetworkHeadersSchema;
function init_browserNetworkEvidence() {
	return (init_browserNetworkEvidence = __esmMin((() => {
		PLAYWRIGHT_RESPONSE_BODY_PROVENANCE_LIMITATION = "Captured response-body bytes are the result of Playwright's Response.body() API. Playwright may satisfy that API with a credentialed follow-up load of the request URL when CDP has no body, so transaction and event links do not verify that retained bytes came from the original network transaction.";
		browserNetworkContentSelectionValuesSchema = z.strictObject({
			request_body: z.boolean(),
			response_body: z.boolean(),
			header_values: z.boolean()
		});
		browserNetworkContentSelectionSchema = browserNetworkContentSelectionValuesSchema.extend({
			request_body: z.boolean().default(false),
			response_body: z.boolean().default(false),
			header_values: z.boolean().default(false)
		}).default({
			request_body: false,
			response_body: false,
			header_values: false
		});
		unavailableBrowserNetworkBodySchema = z.discriminatedUnion("reason", [
			z.strictObject({
				state: z.literal("unavailable"),
				reason: z.enum([
					"request-failed",
					"response-unfinished",
					"body-read-failed",
					"body-read-timeout",
					"cancelled",
					"capture-ended"
				]),
				message: z.string().min(1)
			}),
			z.strictObject({
				state: z.literal("unavailable"),
				reason: z.literal("body-size-limit"),
				message: z.string().min(1),
				limit_bytes: z.int().positive().safe(),
				observed_bytes: z.int().positive().safe()
			}),
			z.strictObject({
				state: z.literal("unavailable"),
				reason: z.literal("body-allocation-limit"),
				message: z.string().min(1),
				limit_allocation_bytes: z.int().positive().safe(),
				observed_allocation_bytes: z.int().positive().safe()
			})
		]);
		browserNetworkBodySchema = z.union([
			z.strictObject({ state: z.literal("not_requested") }),
			z.strictObject({ state: z.literal("not_exposed") }),
			unavailableBrowserNetworkBodySchema,
			z.strictObject({
				state: z.literal("captured"),
				representation: z.enum([
					"browser-exposed-request-bytes",
					"playwright-response-body-bytes",
					"browser-decoded-response-bytes"
				]),
				encoding: z.literal("base64"),
				content: z.string(),
				bytes: z.int().min(0),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				media_type: z.string().nullable(),
				redacted: z.boolean()
			}).superRefine((artifact, context) => {
				const bytes = Buffer.from(artifact.content, "base64");
				if (bytes.toString("base64") !== artifact.content) context.addIssue({
					code: "custom",
					path: ["content"],
					message: "Network body must use canonical base64"
				});
				if (bytes.length !== artifact.bytes) context.addIssue({
					code: "custom",
					path: ["bytes"],
					message: "Network body byte count disagrees with retained bytes"
				});
				if (createHash("sha256").update(bytes).digest("hex") !== artifact.sha256) context.addIssue({
					code: "custom",
					path: ["sha256"],
					message: "Network body digest disagrees with retained bytes"
				});
			})
		]);
		browserNetworkHeadersSchema = z.union([
			z.strictObject({ state: z.literal("not_requested") }),
			z.strictObject({
				state: z.literal("unavailable"),
				message: z.string().min(1)
			}),
			z.strictObject({
				state: z.literal("captured"),
				items: z.array(z.strictObject({
					name: z.string().min(1),
					value: z.string().nullable(),
					redacted: z.boolean()
				}))
			})
		]);
	})))();
}

//#endregion
//#region dist/domain/browserScenarioCaptureLimits.js
var positiveSafeInteger, DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS, browserScenarioCaptureLimitsValuesSchema, browserScenarioCaptureLimitsSchema;
function init_browserScenarioCaptureLimits() {
	return (init_browserScenarioCaptureLimits = __esmMin((() => {
		positiveSafeInteger = z.int().safe().positive();
		DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS = {
			max_events: 1e4,
			max_event_allocation_bytes: 4 * 1024 * 1024,
			max_total_event_allocation_bytes: 16 * 1024 * 1024,
			max_network_transactions: 1024,
			max_network_body_bytes: 64 * 1024,
			max_network_body_allocation_bytes: 1024 * 1024,
			max_network_header_allocation_bytes: 1024 * 1024,
			max_network_metadata_allocation_bytes: 1024 * 1024
		};
		browserScenarioCaptureLimitsValuesSchema = z.strictObject({
			max_events: positiveSafeInteger,
			max_event_allocation_bytes: positiveSafeInteger,
			max_total_event_allocation_bytes: positiveSafeInteger,
			max_network_transactions: positiveSafeInteger,
			max_network_body_bytes: positiveSafeInteger,
			max_network_body_allocation_bytes: positiveSafeInteger,
			max_network_header_allocation_bytes: positiveSafeInteger,
			max_network_metadata_allocation_bytes: positiveSafeInteger
		});
		browserScenarioCaptureLimitsSchema = browserScenarioCaptureLimitsValuesSchema.extend({
			max_events: browserScenarioCaptureLimitsValuesSchema.shape.max_events.default(DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS.max_events),
			max_event_allocation_bytes: browserScenarioCaptureLimitsValuesSchema.shape.max_event_allocation_bytes.default(DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS.max_event_allocation_bytes),
			max_total_event_allocation_bytes: browserScenarioCaptureLimitsValuesSchema.shape.max_total_event_allocation_bytes.default(DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS.max_total_event_allocation_bytes),
			max_network_transactions: browserScenarioCaptureLimitsValuesSchema.shape.max_network_transactions.default(DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS.max_network_transactions),
			max_network_body_bytes: browserScenarioCaptureLimitsValuesSchema.shape.max_network_body_bytes.default(DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS.max_network_body_bytes),
			max_network_body_allocation_bytes: browserScenarioCaptureLimitsValuesSchema.shape.max_network_body_allocation_bytes.default(DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS.max_network_body_allocation_bytes),
			max_network_header_allocation_bytes: browserScenarioCaptureLimitsValuesSchema.shape.max_network_header_allocation_bytes.default(DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS.max_network_header_allocation_bytes),
			max_network_metadata_allocation_bytes: browserScenarioCaptureLimitsValuesSchema.shape.max_network_metadata_allocation_bytes.default(DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS.max_network_metadata_allocation_bytes)
		});
	})))();
}

//#endregion
//#region dist/domain/webScreenshot.js
var webScreenshotArtifactSchema, captureWebScreenshotInputSchema, webScreenshotSchema, compareWebScreenshotsInputSchema, webScreenshotDiffContextShape, webScreenshotDiffSchema, createWebScreenshotArtifact, decodeCanonicalBase64;
function init_webScreenshot() {
	return (init_webScreenshot = __esmMin((() => {
		init_offsetDateTime();
		init_browserDeadline();
		init_browserCompleteness();
		init_browserObservation();
		init_browserObservationSchemas();
		webScreenshotArtifactSchema = z.object({
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			bytes: z.int().min(1),
			media_type: z.literal("image/png"),
			data_base64: z.string()
		}).superRefine((artifact, context) => {
			const bytes = decodeCanonicalBase64(artifact.data_base64);
			if (bytes === undefined) {
				context.addIssue({
					code: "custom",
					message: "Invalid canonical base64"
				});
				return;
			}
			const sha256 = createHash("sha256").update(bytes).digest("hex");
			if (bytes.byteLength !== artifact.bytes || sha256 !== artifact.sha256) context.addIssue({
				code: "custom",
				message: "Screenshot artifact digest or size mismatch"
			});
		});
		captureWebScreenshotInputSchema = z.strictObject({
			cdp_endpoint: browserObservationEndpointSchema,
			allowed_origins: browserAllowedOriginsSchema,
			target_id: z.string().min(1),
			command_timeout_ms: webRuntimeCommandTimeoutSchema
		});
		webScreenshotSchema = z.object({
			browser: browserVersionSchema,
			target: z.object({
				target_id: z.string(),
				url: z.string(),
				origin: z.string()
			}),
			captured_at: utcDateTimeSchema,
			viewport: z.object({
				width: z.int().min(1),
				height: z.int().min(1)
			}),
			artifact: webScreenshotArtifactSchema,
			completeness: browserCompletenessSchema,
			limitations: z.array(z.string())
		});
		compareWebScreenshotsInputSchema = z.strictObject({
			before: webScreenshotArtifactSchema,
			after: webScreenshotArtifactSchema,
			channel_threshold: z.int().min(0).max(255).default(0)
		});
		webScreenshotDiffContextShape = {
			before: z.object({
				width: z.int().min(1),
				height: z.int().min(1)
			}),
			after: z.object({
				width: z.int().min(1),
				height: z.int().min(1)
			}),
			channel_threshold: z.int().min(0).max(255),
			limitations: z.array(z.string())
		};
		webScreenshotDiffSchema = z.discriminatedUnion("status", [
			z.object({
				...webScreenshotDiffContextShape,
				status: z.literal("identical"),
				compared_pixels: z.int().positive(),
				changed_pixels: z.literal(0),
				changed_ratio: z.literal(0),
				maximum_channel_delta: z.int().min(0).max(255),
				mean_absolute_channel_delta: z.number().min(0).max(255)
			}),
			z.object({
				...webScreenshotDiffContextShape,
				status: z.literal("different"),
				compared_pixels: z.int().positive(),
				changed_pixels: z.int().positive(),
				changed_ratio: z.number().positive().max(1),
				maximum_channel_delta: z.int().positive().max(255),
				mean_absolute_channel_delta: z.number().positive().max(255)
			}),
			z.object({
				...webScreenshotDiffContextShape,
				status: z.literal("dimension_mismatch"),
				compared_pixels: z.literal(0),
				changed_pixels: z.null(),
				changed_ratio: z.null(),
				maximum_channel_delta: z.null(),
				mean_absolute_channel_delta: z.null()
			})
		]).superRefine((diff, context) => {
			const sameDimensions = diff.before.width === diff.after.width && diff.before.height === diff.after.height;
			if (sameDimensions !== (diff.status !== "dimension_mismatch")) context.addIssue({
				code: "custom",
				path: ["status"],
				message: "Screenshot comparison status must match viewport dimensions"
			});
			if (diff.status !== "dimension_mismatch" && diff.compared_pixels !== diff.before.width * diff.before.height) context.addIssue({
				code: "custom",
				path: ["compared_pixels"],
				message: "Compared pixel count must match the shared dimensions"
			});
		});
		createWebScreenshotArtifact = (bytes) => {
			const sha256 = createHash("sha256").update(bytes).digest("hex");
			return webScreenshotArtifactSchema.parse({
				sha256,
				bytes: bytes.byteLength,
				media_type: "image/png",
				data_base64: bytes.toString("base64")
			});
		};
		decodeCanonicalBase64 = (value) => {
			if (value.length === 0 || value.length % 4 !== 0) return undefined;
			const decoded = Buffer.from(value, "base64");
			return decoded.toString("base64") === value ? decoded : undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/browserScenarioCaptureValues.js
var textArtifactSchema, captureStateSchema, historySchema, hashedStorageValueShape, redactedStorageValueShape, storageValueFingerprintSchema, storageValueSchema, cookieShape, BROWSER_STORAGE_FINGERPRINT_VERSION, storageSnapshotSchema, browserStepArtifactsSchema, browserScenarioEventFamilySchema, eventBase, eventUrl, browserStartSchema, elapsedMsSchema, networkEventShape, webSocketFrameShape, browserScenarioEventSchema, completenessSectionSchema, browserScenarioEventKindSchema, browserScenarioEventBudgetReasonSchema, browserScenarioEventOmissionsSchema, browserScenarioCompletenessSchema, classifyBrowserScenarioCompleteness, browserScenarioStepShape, browserScenarioStepSchema;
function init_browserScenarioCaptureValues() {
	return (init_browserScenarioCaptureValues = __esmMin((() => {
		init_offsetDateTime();
		init_emptyArraySchema();
		init_browserNetworkEvidence();
		init_browserObservation();
		init_webScreenshot();
		init_digests();
		textArtifactSchema = z.strictObject({
			sha256: digestSchema,
			bytes: z.int().min(0),
			text: z.string()
		}).superRefine((artifact, context) => {
			const bytes = Buffer.from(artifact.text);
			const sha256 = createHash("sha256").update(bytes).digest("hex");
			if (bytes.byteLength !== artifact.bytes || sha256 !== artifact.sha256) context.addIssue({
				code: "custom",
				message: "Text artifact digest or size mismatch"
			});
		});
		captureStateSchema = (value) => z.discriminatedUnion("state", [
			z.strictObject({
				state: z.literal("captured"),
				value
			}),
			z.strictObject({ state: z.literal("not_requested") }),
			z.strictObject({
				state: z.literal("missing"),
				reason: z.string().min(1)
			}),
			z.strictObject({
				state: z.literal("truncated"),
				observed: z.int().min(0),
				retained: z.int().min(0),
				reason: z.string().min(1)
			})
		]);
		historySchema = z.strictObject({
			length: z.int().min(0),
			current_url: sanitizedBrowserUrlSchema,
			navigation_entries: z.array(z.strictObject({
				type: z.enum([
					"navigate",
					"reload",
					"back_forward",
					"prerender",
					"unknown"
				]),
				name: sanitizedBrowserUrlSchema
			}))
		});
		hashedStorageValueShape = {
			value_state: z.literal("hashed"),
			value_sha256: digestSchema
		};
		redactedStorageValueShape = {
			value_state: z.literal("redacted-secret"),
			value_sha256: z.null()
		};
		storageValueFingerprintSchema = z.discriminatedUnion("value_state", [z.strictObject(hashedStorageValueShape), z.strictObject(redactedStorageValueShape)]);
		storageValueSchema = z.discriminatedUnion("value_state", [z.strictObject({
			name: z.string(),
			...hashedStorageValueShape
		}), z.strictObject({
			name: z.string(),
			...redactedStorageValueShape
		})]);
		cookieShape = {
			name: z.string(),
			domain: z.string(),
			path: z.string(),
			secure: z.boolean(),
			http_only: z.boolean(),
			same_site: z.enum([
				"Strict",
				"Lax",
				"None"
			])
		};
		BROWSER_STORAGE_FINGERPRINT_VERSION = 2;
		storageSnapshotSchema = z.strictObject({
			fingerprint_version: z.literal(2).optional(),
			cookies: z.array(z.discriminatedUnion("value_state", [z.strictObject({
				...cookieShape,
				...hashedStorageValueShape
			}), z.strictObject({
				...cookieShape,
				...redactedStorageValueShape
			})])),
			local_storage: z.array(storageValueSchema),
			session_storage: z.array(storageValueSchema)
		});
		browserStepArtifactsSchema = z.strictObject({
			screenshot: captureStateSchema(webScreenshotArtifactSchema),
			dom: captureStateSchema(textArtifactSchema),
			accessibility: captureStateSchema(textArtifactSchema),
			url: captureStateSchema(sanitizedBrowserUrlSchema),
			history: captureStateSchema(historySchema),
			storage: captureStateSchema(storageSnapshotSchema)
		});
		browserScenarioEventFamilySchema = z.enum([
			"console",
			"page-errors",
			"network",
			"websockets",
			"frames",
			"workers",
			"popups",
			"downloads"
		]);
		eventBase = {
			sequence: z.int().min(1),
			step_index: z.int().min(0)
		};
		eventUrl = sanitizedBrowserUrlSchema.nullable();
		browserStartSchema = utcDateTimeSchema.optional().describe("Wall-clock time the browser started the request, as it reported at completion; absent when it reported none.");
		elapsedMsSchema = z.number().nonnegative().optional().describe("Milliseconds from the request start to the end of its response, as the browser timed it; absent when it reported none.");
		networkEventShape = {
			...eventBase,
			transaction_id: z.string().min(1),
			redirected_from_transaction_id: z.string().min(1).nullable(),
			/** Distinguishes a captured root from an unobserved predecessor for null links. */
			redirected_from_transaction_state: z.enum(["root", "unknown"]).optional(),
			method: z.string().min(1),
			url: sanitizedBrowserUrlSchema,
			resource_type: z.string().min(1),
			header_names: z.array(z.string())
		};
		webSocketFrameShape = {
			...eventBase,
			kind: z.enum(["websocket-frame-sent", "websocket-frame-received"]),
			url: sanitizedBrowserUrlSchema,
			payload_bytes: z.int().min(0),
			truncated: z.boolean()
		};
		browserScenarioEventSchema = z.union([
			z.strictObject({
				...eventBase,
				kind: z.literal("console"),
				level: z.string().min(1),
				text: z.string(),
				url: eventUrl
			}),
			z.strictObject({
				...eventBase,
				kind: z.literal("page-error"),
				message: z.string(),
				stack: z.string().nullable()
			}),
			z.strictObject({
				...networkEventShape,
				kind: z.literal("request"),
				status: z.null(),
				failure: z.null(),
				observed_at: utcDateTimeSchema.optional().describe("Wall-clock time the provider observed the request start; absent in captures made before it was recorded.")
			}),
			z.strictObject({
				...networkEventShape,
				kind: z.literal("response"),
				status: z.int().min(100).max(999),
				failure: z.null()
			}),
			z.strictObject({
				...networkEventShape,
				kind: z.literal("request-failed"),
				status: z.null(),
				failure: z.string().min(1),
				started_at: browserStartSchema,
				elapsed_ms: elapsedMsSchema
			}),
			z.strictObject({
				...networkEventShape,
				kind: z.literal("request-finished"),
				status: z.null(),
				failure: z.null(),
				started_at: browserStartSchema,
				elapsed_ms: elapsedMsSchema
			}),
			z.strictObject({
				...networkEventShape,
				kind: z.literal("request-unfinished"),
				status: z.null(),
				failure: z.null(),
				reason: z.enum(["capture-ended", "cancelled"])
			}),
			z.strictObject({
				...eventBase,
				kind: z.literal("network-content"),
				transaction_id: z.string().min(1),
				source_event_sequence: z.int().min(1),
				phase: z.enum(["request", "response"]),
				headers: browserNetworkHeadersSchema,
				body: browserNetworkBodySchema
			}),
			z.strictObject({
				...eventBase,
				kind: z.enum(["websocket-opened", "websocket-closed"]),
				url: sanitizedBrowserUrlSchema
			}),
			z.strictObject({
				...webSocketFrameShape,
				payload_type: z.literal("text"),
				payload_text: z.string()
			}),
			z.strictObject({
				...webSocketFrameShape,
				payload_type: z.literal("binary"),
				payload_text: z.null()
			}),
			z.strictObject({
				...eventBase,
				kind: z.enum([
					"frame-attached",
					"frame-detached",
					"frame-navigated",
					"worker-created",
					"worker-closed",
					"popup-opened",
					"popup-closed"
				]),
				url: eventUrl,
				name: z.string().nullable()
			}),
			z.strictObject({
				...eventBase,
				kind: z.literal("download-cancelled"),
				suggested_filename: z.string(),
				url: sanitizedBrowserUrlSchema
			})
		]).superRefine((event, context) => {
			if ("redirected_from_transaction_id" in event && event.redirected_from_transaction_id !== null && event.redirected_from_transaction_state !== undefined) context.addIssue({
				code: "custom",
				message: "Redirect state is valid only when the predecessor transaction ID is null",
				path: ["redirected_from_transaction_state"]
			});
		});
		completenessSectionSchema = z.enum([
			"action",
			"screenshot",
			"dom",
			"accessibility",
			"url",
			"history",
			"storage",
			"events",
			"frames",
			"workers",
			"popups",
			"websockets"
		]);
		browserScenarioEventKindSchema = z.enum([
			"console",
			"page-error",
			"request",
			"response",
			"request-failed",
			"request-finished",
			"request-unfinished",
			"network-content",
			"websocket-opened",
			"websocket-closed",
			"websocket-frame-sent",
			"websocket-frame-received",
			"frame-attached",
			"frame-detached",
			"frame-navigated",
			"worker-created",
			"worker-closed",
			"popup-opened",
			"popup-closed",
			"download-cancelled"
		]);
		browserScenarioEventBudgetReasonSchema = z.enum([
			"max-events",
			"max-event-allocation-bytes",
			"max-total-event-allocation-bytes",
			"max-network-transactions",
			"max-network-metadata-allocation-bytes",
			"max-listener-owners"
		]);
		browserScenarioEventOmissionsSchema = z.strictObject({
			by_kind: z.array(z.strictObject({
				kind: browserScenarioEventKindSchema,
				count: z.int().positive(),
				reasons: z.array(browserScenarioEventBudgetReasonSchema).min(1)
			})),
			network_transactions: z.array(z.strictObject({
				transaction_id: z.string().min(1),
				omitted_kinds: z.array(browserScenarioEventKindSchema).min(1),
				reasons: z.array(browserScenarioEventBudgetReasonSchema).min(1)
			})),
			network_transaction_range: z.strictObject({
				first_transaction_id: z.string().min(1),
				last_transaction_id: z.string().min(1),
				count: z.int().positive(),
				reason: z.literal("max-network-transactions")
			}).nullable()
		});
		browserScenarioCompletenessSchema = z.discriminatedUnion("status", [
			z.strictObject({
				status: z.literal("complete"),
				equality_eligible: z.literal(true),
				missing_sections: emptyArraySchema,
				truncated_sections: emptyArraySchema
			}),
			z.strictObject({
				status: z.literal("incomplete"),
				equality_eligible: z.literal(false),
				missing_sections: z.array(completenessSectionSchema).min(1),
				truncated_sections: emptyArraySchema
			}),
			z.strictObject({
				status: z.literal("truncated"),
				equality_eligible: z.literal(false),
				missing_sections: z.array(completenessSectionSchema),
				truncated_sections: z.array(completenessSectionSchema).min(1)
			})
		]);
		classifyBrowserScenarioCompleteness = (missing, truncated) => {
			const missingSections = [...new Set(missing)].sort();
			const truncatedSections = [...new Set(truncated)].sort();
			if (truncatedSections.length > 0) return browserScenarioCompletenessSchema.parse({
				status: "truncated",
				equality_eligible: false,
				missing_sections: missingSections,
				truncated_sections: truncatedSections
			});
			if (missingSections.length > 0) return browserScenarioCompletenessSchema.parse({
				status: "incomplete",
				equality_eligible: false,
				missing_sections: missingSections,
				truncated_sections: []
			});
			return {
				status: "complete",
				equality_eligible: true,
				missing_sections: [],
				truncated_sections: []
			};
		};
		browserScenarioStepShape = {
			step_index: z.int().min(0),
			step_id: z.string().min(1),
			action: z.string().min(1),
			elapsed_ms: z.int().min(0),
			before_url: sanitizedBrowserUrlSchema,
			after_url: sanitizedBrowserUrlSchema,
			event_sequence_start: z.int().min(1),
			event_sequence_end: z.int().min(0),
			artifacts: browserStepArtifactsSchema,
			completeness: browserScenarioCompletenessSchema
		};
		browserScenarioStepSchema = z.union([z.strictObject({
			...browserScenarioStepShape,
			status: z.literal("completed"),
			error: z.null()
		}), z.strictObject({
			...browserScenarioStepShape,
			status: z.enum(["failed", "cancelled"]),
			error: z.string()
		})]);
	})))();
}

//#endregion
//#region dist/domain/browserScenarioCapture.js
var retainedBrowserScenarioCaptureSchema, browserScenarioCaptureSchema$1;
function init_browserScenarioCapture() {
	return (init_browserScenarioCapture = __esmMin((() => {
		init_browserNetworkEvidence();
		init_browserScenarioCaptureLimits();
		init_browserScenarioCaptureValues();
		retainedBrowserScenarioCaptureSchema = z.strictObject({
			browser: z.strictObject({
				mode: z.enum(["launch", "connect"]),
				process_ownership: z.enum(["provider-owned", "external"]),
				cleanup: z.enum(["terminated-owned-process", "disconnected-external"]),
				product: z.string().min(1),
				version: z.string().min(1)
			}),
			scenario: z.strictObject({
				start_origin: z.string().min(1),
				action_count: z.int().min(1),
				secret_references: z.array(z.string().min(1)),
				network_content: browserNetworkContentSelectionValuesSchema,
				event_families: z.array(browserScenarioEventFamilySchema).optional(),
				limits: browserScenarioCaptureLimitsValuesSchema
			}),
			duration_ms: z.int().min(0),
			steps: z.array(browserScenarioStepSchema).min(1),
			events: z.strictObject({
				retained: z.int().min(0),
				dropped: z.int().min(0),
				items: z.array(browserScenarioEventSchema),
				omissions: browserScenarioEventOmissionsSchema
			}),
			completeness: browserScenarioCompletenessSchema,
			limitations: z.array(z.string().min(1))
		}).superRefine((capture, context) => {
			const bySequence = new Map(capture.events.items.map((event) => [event.sequence, event]));
			if (bySequence.size !== capture.events.items.length) context.addIssue({
				code: "custom",
				path: ["events", "items"],
				message: "Event sequence numbers must be unique"
			});
			for (const [index, event] of capture.events.items.entries()) {
				if (event.kind !== "network-content") continue;
				const source = bySequence.get(event.source_event_sequence);
				if (source?.kind !== event.phase || source.transaction_id !== event.transaction_id || source.sequence >= event.sequence) context.addIssue({
					code: "custom",
					path: [
						"events",
						"items",
						index,
						"source_event_sequence"
					],
					message: "Network content must reference an earlier matching transaction phase"
				});
			}
			if (capture.events.retained !== capture.events.items.length) context.addIssue({
				code: "custom",
				path: ["events", "retained"],
				message: "Retained event count must equal items length"
			});
			if (capture.events.omissions.by_kind.reduce((count, omission) => count + omission.count, 0) !== capture.events.dropped) context.addIssue({
				code: "custom",
				path: [
					"events",
					"omissions",
					"by_kind"
				],
				message: "Per-kind omission counts must equal the dropped event count"
			});
			if (capture.steps.length !== capture.scenario.action_count + 1) context.addIssue({
				code: "custom",
				path: ["steps"],
				message: "Capture must include initial state and one entry per action"
			});
			const expectedIndices = capture.steps.map((_, index) => index);
			if (capture.steps.some(({ step_index: index }, offset) => index !== expectedIndices[offset])) context.addIssue({
				code: "custom",
				path: ["steps"],
				message: "Step indices must be contiguous from zero"
			});
			if (capture.events.items.some(({ step_index: index }) => index >= capture.steps.length)) context.addIssue({
				code: "custom",
				path: ["events", "items"],
				message: "Event references an unknown step index"
			});
		});
		browserScenarioCaptureSchema$1 = retainedBrowserScenarioCaptureSchema.safeExtend({ scenario: retainedBrowserScenarioCaptureSchema.shape.scenario.extend({ event_families: z.array(browserScenarioEventFamilySchema) }) });
	})))();
}

//#endregion
//#region dist/domain/artifactFormatMetadata.js
var offset, uint32, godotPckMetadataSchema, godotPckEntryMetadataSchema, unityFsMetadataSchema, unityFsEntryMetadataSchema, wxapkgMetadataSchema, wxapkgEntryMetadataSchema, pyInstallerMetadataSchema, pyInstallerEntryMetadataSchema, dotnetBundleEntryMetadataSchema, nodeSeaMetadataSchema, nodeSeaEntryMetadataSchema, uf2MetadataSchema, uf2RegionMetadataSchema, dfuSeMetadataSchema, dfuSeElementMetadataSchema, hexRecordsMetadataSchema, hexRecordRegionMetadataSchema, fitMetadataSchema, fitImageMetadataSchema, uint8, uint16, sha256Hex, byteRange, espChipFactsSchema, espAppDescriptorSchema, espBootloaderDescriptorSchema, espImageMetadataSchema, espImageSegmentMetadataSchema, espImageSignatureBlockMetadataSchema, espFlashPartitionMetadataSchema, espFlashImageFactsSchema, espOtaRecordSchema, espFlashImageMetadataSchema, uImageMetadataSchema, uImageEntryMetadataSchema, bunHex, bunStandaloneMetadataSchema, bunStandaloneEntryMetadataSchema, artifactFormatMetadataSchema, declarationsByKind, COMPARED_FORMAT_METADATA_KINDS, declarationOf, formatMetadataDeclaration;
function init_artifactFormatMetadata() {
	return (init_artifactFormatMetadata = __esmMin((() => {
		offset = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
		uint32 = z.number().int().min(0).max(4294967295);
		godotPckMetadataSchema = z.strictObject({
			kind: z.literal("godot-pck"),
			format_version: uint32,
			engine_major: uint32,
			engine_minor: uint32,
			engine_patch: uint32,
			pack_start: offset,
			pack_end: offset,
			embedded: z.boolean(),
			pack_flags: uint32,
			file_base: offset,
			directory_start: offset,
			declared_file_count: uint32,
			directory_status: z.enum([
				"available",
				"encrypted",
				"sparse-bundle"
			])
		});
		godotPckEntryMetadataSchema = z.strictObject({
			kind: z.literal("godot-pck-entry"),
			index: uint32,
			source_path: z.string(),
			declared_offset: offset,
			flags: uint32,
			md5_status: z.enum(["declared", "all-zero"])
		});
		unityFsMetadataSchema = z.strictObject({
			kind: z.literal("unityfs"),
			signature: z.string(),
			format_version: uint32,
			player_version: z.string(),
			engine_version: z.string(),
			declared_size: offset,
			flags: uint32,
			blocks_info_compressed_size: uint32,
			blocks_info_uncompressed_size: uint32,
			blocks_info_at_end: z.boolean(),
			data_start: offset.nullable(),
			block_count: uint32.nullable(),
			/** The 16-byte producer hash of the uncompressed block stream, as declared. */
			data_hash: z.string().nullable(),
			directory_status: z.enum([
				"available",
				"encrypted",
				"unsupported-compression",
				"unsupported-layout"
			])
		});
		unityFsEntryMetadataSchema = z.strictObject({
			kind: z.literal("unityfs-entry"),
			index: uint32,
			source_path: z.string(),
			declared_offset: offset,
			flags: uint32
		});
		wxapkgMetadataSchema = z.strictObject({
			kind: z.literal("wxapkg"),
			info: uint32.nullable(),
			index_length: uint32.nullable(),
			data_length: uint32.nullable(),
			file_count: uint32.nullable(),
			directory_status: z.enum(["available", "encrypted"])
		});
		wxapkgEntryMetadataSchema = z.strictObject({
			kind: z.literal("wxapkg-entry"),
			index: uint32,
			source_path: z.string(),
			declared_offset: offset
		});
		pyInstallerMetadataSchema = z.strictObject({
			kind: z.literal("pyinstaller"),
			layout_version: z.enum(["2.0", "2.1"]),
			archive_start: offset,
			archive_size: offset,
			cookie_offset: offset,
			toc_offset: offset,
			toc_size: offset,
			entry_count: offset,
			runtime_option_count: offset,
			external_dependency_count: offset,
			python_version_raw: uint32,
			python_major: uint32.nullable(),
			python_minor: uint32.nullable(),
			python_library: z.string().nullable(),
			encryption_marker_present: z.boolean()
		});
		pyInstallerEntryMetadataSchema = z.strictObject({
			kind: z.literal("pyinstaller-entry"),
			container: z.enum(["carchive", "pyz"]),
			container_name: z.string().nullable(),
			index: offset,
			source_name: z.string(),
			type_code: z.union([z.string().length(1), uint32]),
			relative_offset: offset,
			directory_record_offset: offset.nullable(),
			directory_record_size: offset.nullable(),
			compression_flag: z.union([z.literal(0), z.literal(1)]),
			bytecode_header: z.enum([
				"not-bytecode",
				"unknown",
				"derived"
			]),
			bytecode_magic: z.string().regex(/^[0-9a-f]{8}$/u).nullable(),
			pyz_status: z.enum([
				"not-pyz",
				"decoded",
				"opaque"
			]),
			pyz_sha256: z.string().regex(/^[0-9a-f]{64}$/u).nullable(),
			pyz_python_magic: z.string().regex(/^[0-9a-f]{8}$/u).nullable(),
			pyz_python_version: z.string().nullable(),
			pyz_entry_count: offset.nullable(),
			encryption_source: z.literal("carchive-marker").nullable(),
			dependency_status: z.enum(["unresolved", "invalid-reference"]).exactOptional(),
			dependency_archive: z.string().nullable().exactOptional(),
			dependency_member: z.string().nullable().exactOptional()
		});
		dotnetBundleEntryMetadataSchema = z.strictObject({
			kind: z.literal("dotnet-bundle-entry"),
			major_version: uint32,
			minor_version: uint32,
			file_type: z.number().int().min(0).max(255)
		});
		nodeSeaMetadataSchema = z.strictObject({
			kind: z.literal("node-sea"),
			magic: z.literal(21223968),
			flags: uint32,
			disable_experimental_sea_warning: z.boolean(),
			use_snapshot: z.boolean(),
			use_code_cache: z.boolean(),
			include_assets: z.boolean(),
			include_exec_argv: z.boolean(),
			exec_argv_extension: z.enum([
				"none",
				"env",
				"cli"
			]),
			exec_argv: z.array(z.string()),
			code_path: z.string(),
			carrier: z.enum([
				"mach-o",
				"elf",
				"pe"
			]),
			blob_offset: offset,
			blob_length: offset,
			fuse_state: z.enum([
				"set",
				"unset",
				"absent",
				"conflicting"
			]),
			fuse_sentinel: z.string().nullable(),
			fuse_contradiction: z.string().nullable()
		});
		nodeSeaEntryMetadataSchema = z.strictObject({
			kind: z.literal("node-sea-entry"),
			role: z.enum([
				"main-script",
				"snapshot",
				"code-cache",
				"asset"
			]),
			source_path: z.string(),
			index: uint32
		});
		uf2MetadataSchema = z.strictObject({
			kind: z.literal("uf2"),
			block_count: offset,
			trailing_bytes: offset,
			invalid_block_count: offset,
			flash_block_count: offset,
			not_main_flash_block_count: offset,
			file_container_block_count: offset,
			md5_block_count: offset,
			extension_tag_block_count: offset,
			family_count: offset,
			/** The registry revision REA's region `family_name` values come from. */
			family_name_registry: z.string(),
			numbering_group_count: offset,
			missing_block_count: offset,
			ambiguous_numbering_group_count: offset,
			repeated_block_count: offset,
			out_of_order_block_count: offset,
			block_number_out_of_range_count: offset,
			region_count: offset,
			data_bytes: offset,
			duplicate_bytes: offset
		});
		uf2RegionMetadataSchema = z.strictObject({
			kind: z.literal("uf2-region"),
			family_id: uint32.nullable(),
			/** REA's label for `family_id`, from `family_name_registry`; not file content. */
			family_name: z.string().nullable(),
			start_address: uint32,
			end_address: uint32,
			length: offset,
			block_count: offset,
			first_file_block: offset,
			last_file_block: offset
		});
		dfuSeMetadataSchema = z.strictObject({
			kind: z.literal("dfuse"),
			image_size: uint32,
			target_count: uint32,
			element_count: offset,
			empty_element_count: offset,
			overlapping_element_count: offset,
			data_bytes: offset,
			device_version: uint32,
			product_id: uint32,
			vendor_id: uint32,
			suffix_crc: uint32,
			computed_crc: uint32
		});
		dfuSeElementMetadataSchema = z.strictObject({
			kind: z.literal("dfuse-element"),
			target_index: uint32,
			alternate_setting: uint32,
			target_name: z.string().nullable(),
			element_index: uint32,
			start_address: uint32,
			end_address: uint32,
			length: offset
		});
		hexRecordsMetadataSchema = z.strictObject({
			kind: z.literal("hex-records"),
			encoding: z.enum(["intel-hex", "srec"]),
			variant: z.enum([
				"I8HEX",
				"I16HEX",
				"I32HEX",
				"S19",
				"S28",
				"S37",
				"mixed"
			]).nullable(),
			line_count: offset,
			record_count: offset,
			data_record_count: offset,
			data_bytes: offset,
			duplicate_bytes: offset,
			region_count: offset,
			lowest_address: uint32.nullable(),
			highest_address: uint32.nullable(),
			termination: z.enum(["present", "absent"]),
			start_address: uint32.nullable(),
			start_address_record: z.enum([
				"05",
				"S7",
				"S8",
				"S9"
			]).nullable(),
			start_segment_cs: uint32.nullable(),
			start_segment_ip: uint32.nullable(),
			header_hex: z.string().regex(/^(?:[0-9a-f]{2}){0,252}$/u).nullable(),
			header_text: z.string().nullable(),
			declared_data_record_count: uint32.nullable()
		});
		hexRecordRegionMetadataSchema = z.strictObject({
			kind: z.literal("hex-record-region"),
			start_address: uint32,
			end_address: uint32,
			length: offset,
			record_count: offset,
			first_line: offset,
			last_line: offset
		});
		fitMetadataSchema = z.strictObject({
			kind: z.literal("fit"),
			fdt_version: uint32,
			fdt_totalsize: offset,
			external_data_base: offset,
			description: z.string().nullable(),
			timestamp: uint32.nullable(),
			address_cells: uint32.nullable(),
			default_configuration: z.string().nullable(),
			configurations: z.array(z.strictObject({
				name: z.string(),
				description: z.string().nullable(),
				kernel: z.array(z.string()),
				firmware: z.array(z.string()),
				fdt: z.array(z.string()),
				ramdisk: z.array(z.string()),
				loadables: z.array(z.string()),
				signature_count: uint32,
				signatures_unreadable: uint32,
				unresolved_reference_count: uint32,
				signature_algorithms: z.array(z.string())
			}))
		});
		fitImageMetadataSchema = z.strictObject({
			kind: z.literal("fit-image"),
			index: uint32,
			name: z.string(),
			description: z.string().nullable(),
			type: z.string().nullable(),
			arch: z.string().nullable(),
			os: z.string().nullable(),
			compression: z.string().nullable(),
			load: z.string().nullable(),
			entry: z.string().nullable(),
			data_source: z.enum([
				"embedded",
				"data-offset",
				"data-position"
			]),
			declared_offset: uint32.nullable(),
			image_data: z.string().nullable(),
			/** Presence is independent of whether the declared algorithm is readable. */
			cipher_present: z.boolean(),
			cipher_algo: z.string().nullable(),
			unreadable_fields: z.array(z.enum([
				"description",
				"type",
				"arch",
				"os",
				"compression",
				"load",
				"entry",
				"cipher_algo"
			])),
			hash_algorithms: z.array(z.string()),
			hashes_verified: uint32,
			hashes_unverified: uint32,
			signature_count: uint32,
			signatures_unreadable: uint32,
			signature_algorithms: z.array(z.string())
		});
		uint8 = z.number().int().min(0).max(255);
		uint16 = z.number().int().min(0).max(65535);
		sha256Hex = z.string().regex(/^[0-9a-f]{64}$/u);
		byteRange = z.strictObject({
			offset,
			length: offset
		});
		espChipFactsSchema = z.strictObject({
			target: z.string(),
			isa: z.enum(["xtensa", "riscv"]),
			source: z.string()
		});
		espAppDescriptorSchema = z.strictObject({
			kind: z.literal("app"),
			offset,
			/** Descriptor bytes the file holds, at most the 256 of `esp_app_desc_t`. */
			observed_length: z.int().min(4).max(256),
			secure_version: uint32.nullable(),
			version: z.string().nullable(),
			project_name: z.string().nullable(),
			time: z.string().nullable(),
			date: z.string().nullable(),
			idf_ver: z.string().nullable(),
			app_elf_sha256: sha256Hex.nullable(),
			min_efuse_blk_rev_full: uint16.nullable(),
			max_efuse_blk_rev_full: uint16.nullable(),
			/**
			* ESP-IDF's value: the MMU page size as a base-2 logarithm (16 is 64 KiB);
			* 0 in images built before ESP-IDF v5.4.
			*/
			mmu_page_size: uint8.nullable(),
			/**
			* The byte ESP-IDF v6.1 names `spi_flash_mode`, as stored; REA does not
			* interpret it. Releases that reserve this byte leave it zero.
			*/
			spi_flash_mode: uint8.nullable()
		});
		espBootloaderDescriptorSchema = z.strictObject({
			kind: z.literal("bootloader"),
			offset,
			secure_version: uint8,
			version: uint32,
			idf_ver: z.string().nullable(),
			date_time: z.string().nullable()
		});
		espImageMetadataSchema = z.strictObject({
			kind: z.literal("esp-image"),
			/** `esp_image_header_t` fields, as ESP-IDF names them. */
			header: z.strictObject({
				segment_count: uint8,
				spi_mode: uint8,
				spi_speed: uint8,
				spi_size: uint8,
				entry_addr: uint32,
				wp_pin: uint8,
				spi_pin_drv: z.string().regex(/^[0-9a-f]{6}$/u),
				chip_id: uint16,
				min_chip_rev: uint8,
				min_chip_rev_full: uint16,
				max_chip_rev_full: uint16,
				reserved: z.string().regex(/^[0-9a-f]{8}$/u),
				hash_appended: z.boolean()
			}),
			/** Derived from `chip_id` through the cited table; null for unknown IDs. */
			chip: espChipFactsSchema.nullable(),
			checksum: z.strictObject({
				offset: offset.nullable(),
				stored: uint8.nullable(),
				computed: uint8.nullable(),
				status: z.enum([
					"valid",
					"invalid",
					"unavailable"
				])
			}),
			/** The SHA-256 the header's `hash_appended` adds after the checksum. */
			appended_sha256: z.strictObject({
				offset: offset.nullable(),
				stored: sha256Hex.nullable(),
				computed: sha256Hex.nullable(),
				status: z.enum([
					"valid",
					"invalid",
					"unavailable",
					"not-appended"
				])
			}),
			/** End of the checksum block and any digest; null when truncated before it. */
			image_end: offset.nullable(),
			signature_sector_offset: offset.nullable(),
			/** Bytes after the image that no padding, signature or erased flash describes. */
			undescribed_trailing: z.array(byteRange),
			/** Its kind classifies the image as an app or a bootloader. */
			descriptor: z.discriminatedUnion("kind", [espAppDescriptorSchema, espBootloaderDescriptorSchema]).nullable(),
			/**
			* Set when the file is a flash dump read from a later flash address: this
			* image is not an app, its chip's ROM loads the bootloader from
			* `flash_offset`, and a partition table sits at `table_file_offset`, where
			* that origin puts the default `0x8000`. Reopen the file as
			* `esp-flash-image` with that `flash_offset`. Null otherwise, and in the
			* nested facts of a flash layout. Absent from Evidence recorded before REA
			* reported it; its graph digest covers the record without the field.
			*/
			flash_dump: z.strictObject({
				flash_offset: uint32,
				table_file_offset: offset
			}).nullable().exactOptional()
		});
		espImageSegmentMetadataSchema = z.strictObject({
			kind: z.literal("esp-image-segment"),
			index: uint8,
			load_addr: uint32,
			data_len: uint32,
			header_offset: offset,
			/** ESP-IDF's cold-boot `should_map` and `should_load`; derived. */
			classification: z.enum([
				"mapped",
				"loaded",
				"not-loaded",
				"unknown"
			])
		});
		espImageSignatureBlockMetadataSchema = z.strictObject({
			kind: z.literal("esp-image-signature-block"),
			/** Slot in the signature sector, 0 to 2. */
			index: uint8,
			version: uint8,
			scheme: z.enum(["rsa", "ecdsa"]).nullable(),
			/** Third block byte for ECDSA: 0 selects SHA-256, 1 SHA-384. */
			sha_version: uint8.nullable(),
			curve_id: uint8.nullable(),
			digest_algorithm: z.enum(["sha256", "sha384"]).nullable(),
			image_digest: z.string().regex(/^(?:[0-9a-f]{64}|[0-9a-f]{96})$/u).nullable(),
			/** Whether `image_digest` equals the digest of the bytes before the sector. */
			image_digest_matches: z.boolean().nullable(),
			/** SHA-256 of the block's public key, the value eFuse key digests hold. */
			public_key_sha256: sha256Hex.nullable(),
			/** REA checks no key, signature or eFuse. */
			signature_status: z.literal("unverified")
		});
		espFlashPartitionMetadataSchema = z.strictObject({
			kind: z.literal("esp-flash-partition"),
			/** Position among the table's partition entries. */
			index: uint8,
			/** The label up to its first NUL; null when it is not UTF-8. */
			label: z.string().nullable(),
			/** The label's bytes up to its first NUL in hex, when it is not UTF-8. */
			label_hex: z.string().regex(/^(?:[0-9a-f]{2}){1,16}$/u).nullable(),
			type: uint8,
			subtype: uint8,
			/** `gen_esp32part.py` names; null for values it does not name. */
			type_name: z.string().nullable(),
			subtype_name: z.string().nullable(),
			flash_address: uint32,
			size: uint32,
			encrypted: z.boolean(),
			readonly: z.boolean(),
			/** Flag bits other than `encrypted` and `readonly`, which ESP-IDF ignores. */
			unknown_flags: uint32,
			/**
			* Observed in the bytes the dump holds, from the partition's start: the
			* first byte that is not 0xFF and just past the last, null when every byte
			* is erased, and how many bytes are not 0xFF. All null for a partition the
			* dump holds none of.
			*/
			written_offset: uint32.nullable(),
			written_end: uint32.nullable(),
			written_bytes: uint32.nullable()
		});
		espFlashImageFactsSchema = z.strictObject({
			/** An ESP image, erased flash, or bytes that are not one, such as ciphertext. */
			status: z.enum([
				"esp-image",
				"erased",
				"unrecognized"
			]),
			image: espImageMetadataSchema.nullable(),
			segments: z.array(espImageSegmentMetadataSchema),
			signature_blocks: z.array(espImageSignatureBlockMetadataSchema),
			coverage: z.enum(["complete", "unknown"]).nullable(),
			limitations: z.array(z.string())
		});
		espOtaRecordSchema = z.strictObject({
			index: z.union([z.literal(0), z.literal(1)]),
			ota_seq: uint32,
			seq_label: z.string().regex(/^[0-9a-f]{40}$/u),
			ota_state: uint32,
			state_name: z.enum([
				"new",
				"pending-verify",
				"valid",
				"invalid",
				"aborted",
				"undefined"
			]).nullable(),
			crc: uint32,
			/** CRC-32 of `ota_seq` seeded with 0xFFFFFFFF, as the bootloader checks it. */
			crc_matches: z.boolean(),
			valid: z.boolean()
		});
		espFlashImageMetadataSchema = z.strictObject({
			kind: z.literal("esp-flash-image"),
			/** Flash address of the file's first byte: 0 unless the caller gave one. */
			flash_offset: z.strictObject({
				value: uint32,
				source: z.enum(["default", "caller"])
			}),
			/** From the bootloader's `chip_id`; null without a located bootloader. */
			chip: espChipFactsSchema.nullable(),
			/**
			* The image at its chip's ROM offset, through the partition table; `path`
			* is its entry.
			*/
			bootloader: z.strictObject({
				path: z.string(),
				flash_address: uint32,
				region_size: offset,
				facts: espFlashImageFactsSchema
			}).nullable(),
			partition_table: z.strictObject({
				flash_address: uint32,
				/** 0x8000, the caller's offset, or a scan for a verified MD5 (derived). */
				method: z.enum([
					"default",
					"caller",
					"scan"
				]),
				partition_count: uint8,
				md5: z.strictObject({
					status: z.enum([
						"valid",
						"invalid",
						"absent"
					]),
					stored: z.string().regex(/^[0-9a-f]{32}$/u).nullable(),
					computed: z.string().regex(/^[0-9a-f]{32}$/u).nullable()
				})
			}),
			/**
			* Declared partitions that begin before the dump's first byte, which have
			* no entry. A partition past the dump's end is an entry with no bytes.
			*/
			partitions_outside_dump: z.array(espFlashPartitionMetadataSchema),
			/** ESP image facts for each app partition the dump holds, by its entry. */
			apps: z.array(z.strictObject({
				path: z.string(),
				partition_index: uint8,
				facts: espFlashImageFactsSchema
			})),
			/** The otadata partition the bootloader uses: the last one declared. */
			otadata: z.strictObject({
				partition_index: uint8,
				/** The records the dump holds, at most one per sector. */
				records: z.array(espOtaRecordSchema).max(2)
			}).nullable(),
			/**
			* The app the bootloader would select, derived for every table under the
			* stated assumptions. `basis` names the branch: `otadata`,
			* `factory-fallback` and `ota_0-fallback` from the otadata records,
			* `no-otadata` for a table without otadata (the factory index), `none`
			* for the bootloader's INVALID_INDEX, after which it resets, and
			* `unknown` when the dump lacks a record the bootloader reads.
			* `partition_index` is null when the table declares no partition for the
			* selected slot or fallback.
			*/
			boot_selection: z.strictObject({
				basis: z.enum([
					"otadata",
					"factory-fallback",
					"ota_0-fallback",
					"no-otadata",
					"none",
					"unknown"
				]),
				active_record: z.union([z.literal(0), z.literal(1)]).nullable(),
				slot: uint8.nullable(),
				partition_index: uint8.nullable(),
				assumptions: z.array(z.string()),
				/** Rollback, anti-rollback and load fallback decide it at boot. */
				running_partition: z.literal("unknown")
			}),
			/**
			* Ranges outside every described region, each from a byte that is not
			* erased flash to the end of its gap.
			*/
			undescribed: z.array(byteRange)
		});
		uImageMetadataSchema = z.strictObject({
			kind: z.literal("uimage"),
			magic: z.literal(654645590),
			timestamp: uint32,
			timestamp_iso: z.string(),
			payload_size: uint32,
			load_address: uint32,
			entry_point: uint32,
			header_crc32: uint32,
			data_crc32: uint32,
			crc_verified: z.literal(true),
			os: z.number().int().min(0).max(255),
			os_name: z.string(),
			arch: z.number().int().min(0).max(255),
			arch_name: z.string(),
			type: z.number().int().min(0).max(255),
			type_name: z.string(),
			compression: z.number().int().min(0).max(255),
			compression_name: z.string(),
			name: z.string().nullable(),
			name_bytes_hex: z.string().regex(/^[0-9a-f]{64}$/u),
			sub_image_count: uint32
		});
		uImageEntryMetadataSchema = z.strictObject({
			kind: z.literal("uimage-entry"),
			role: z.enum(["payload", "sub-image"]),
			index: uint32
		});
		bunHex = z.string().regex(/^[0-9a-f]+$/u).nullable();
		bunStandaloneMetadataSchema = z.strictObject({
			kind: z.literal("bun-standalone"),
			layout_revision: z.enum(["bun-1.3.3", "bun-1.3.9"]),
			carrier: z.enum([
				"mach-o-section",
				"pe-section",
				"elf-section",
				"appended-trailer"
			]),
			payload_offset: offset,
			payload_length: offset,
			module_count: uint32,
			entry_point_id: uint32,
			entry_point_source_name: z.string().nullable(),
			entry_point_logical_path: z.string().nullable(),
			compile_exec_argv: z.string().nullable(),
			compile_exec_argv_hex: bunHex,
			flags: uint32
		});
		bunStandaloneEntryMetadataSchema = z.strictObject({
			kind: z.literal("bun-standalone-entry"),
			index: uint32,
			region: z.enum([
				"contents",
				"sourcemap",
				"bytecode",
				"module-info"
			]),
			source_name: z.string().nullable(),
			source_name_hex: bunHex,
			encoding: uint32,
			encoding_name: z.enum([
				"binary",
				"latin1",
				"utf8",
				"utf16"
			]).nullable(),
			loader: uint32,
			loader_name: z.string().nullable(),
			module_format: uint32,
			module_format_name: z.enum([
				"none",
				"esm",
				"cjs"
			]).nullable(),
			side: uint32,
			side_name: z.enum(["server", "client"]).nullable(),
			entry_point: z.boolean(),
			sourcemap_bytes: offset,
			bytecode_bytes: offset,
			module_info_bytes: offset,
			bytecode_origin: z.string().nullable(),
			bytecode_origin_hex: bunHex
		});
		artifactFormatMetadataSchema = z.discriminatedUnion("kind", [
			godotPckMetadataSchema,
			godotPckEntryMetadataSchema,
			unityFsMetadataSchema,
			unityFsEntryMetadataSchema,
			wxapkgMetadataSchema,
			wxapkgEntryMetadataSchema,
			pyInstallerMetadataSchema,
			pyInstallerEntryMetadataSchema,
			dotnetBundleEntryMetadataSchema,
			bunStandaloneMetadataSchema,
			bunStandaloneEntryMetadataSchema,
			nodeSeaMetadataSchema,
			nodeSeaEntryMetadataSchema,
			hexRecordsMetadataSchema,
			hexRecordRegionMetadataSchema,
			uImageMetadataSchema,
			uImageEntryMetadataSchema,
			espImageMetadataSchema,
			espImageSegmentMetadataSchema,
			espImageSignatureBlockMetadataSchema,
			uf2MetadataSchema,
			uf2RegionMetadataSchema,
			dfuSeMetadataSchema,
			dfuSeElementMetadataSchema,
			espFlashImageMetadataSchema,
			espFlashPartitionMetadataSchema,
			fitMetadataSchema,
			fitImageMetadataSchema
		]);
		declarationsByKind = {
			"godot-pck": { notCompared: "Its fields come from the pack's own bytes, which content comparison covers." },
			"godot-pck-entry": { notCompared: "index and declared_offset are layout; flags and md5_status repeat occurrence facts; source_path spells Godot's lookup path in a version-dependent way. docs/godot-pck.md gives the evidence." },
			unityfs: { notCompared: "Its fields come from the bundle's own bytes, which content comparison covers." },
			/** What the directory declares for a member: its source path and raw node flags. Index and offset are layout. */
			"unityfs-entry": { declaration: (metadata) => ({
				source_path: metadata.source_path,
				flags: metadata.flags
			}) },
			wxapkg: { notCompared: "Its fields come from the package's own bytes, which content comparison covers." },
			"wxapkg-entry": { notCompared: "index is layout. source_path keeps the declared name, including a producer root prefix the occurrence path strips." },
			pyinstaller: { notCompared: "Its fields come from the archive's own bytes, which content comparison covers." },
			/** Declaration identity that is stable across archive layout changes. */
			"pyinstaller-entry": { declaration: (metadata) => ({
				container: metadata.container,
				container_name: metadata.container_name,
				source_name: metadata.source_name,
				type_code: metadata.type_code
			}) },
			"dotnet-bundle-entry": { notCompared: "Its fields come from the host's bundle manifest, whose bytes the host's content comparison covers." },
			"bun-standalone": { notCompared: "Its fields come from the carrier's own bytes, which content comparison covers." },
			"bun-standalone-entry": { notCompared: "Its fields come from the carrier's module graph, whose bytes the carrier's content comparison covers." },
			"node-sea": { notCompared: "Its fields come from the carrier's own bytes, which content comparison covers." },
			/** Runtime member identity, independent of blob layout and directory order. */
			"node-sea-entry": { declaration: (metadata) => ({
				role: metadata.role,
				source_path: metadata.source_path
			}) },
			"hex-records": { notCompared: "Its fields come from the file's own records, which content comparison covers." },
			"hex-record-region": { notCompared: "start_address and end_address restate the region's path, and length follows from them; record and line counts are layout." },
			uimage: { notCompared: "Its header facts come from the image's own bytes, which content comparison covers." },
			"uimage-entry": { notCompared: "role and index restate the entry's path; its stored bytes are compared by content." },
			"esp-image": { notCompared: "Its fields come from the image's own bytes, which content comparison covers." },
			/**
			* What a segment header declares: where its bytes load and how many there
			* are. Header offsets are layout, and the classification is derived.
			*/
			"esp-image-segment": { declaration: (metadata) => ({
				load_addr: metadata.load_addr,
				data_len: metadata.data_len
			}) },
			"esp-image-signature-block": { notCompared: "Its fields come from the block's own bytes, which content comparison covers, and image_digest_matches follows the image's content." },
			uf2: { notCompared: "Its counts come from the file's own blocks, which content comparison covers, and family_name_registry names REA's label registry." },
			"uf2-region": { notCompared: "Its familyID and addresses are in its path, family_name is REA's label for the familyID, and its block counts and positions are layout; content comparison covers its bytes." },
			dfuse: { notCompared: "Its fields come from the file's own prefix, target headers and suffix, which content comparison covers." },
			/** The device memory an element targets, which its path and bytes do not show. */
			"dfuse-element": { declaration: (metadata) => ({
				alternate_setting: metadata.alternate_setting,
				target_name: metadata.target_name
			}) },
			"esp-flash-image": { notCompared: "Its fields come from the dump's bytes and from the caller's flash_offset and partition_table_offset, which are target identity; each partition's range, compared by content, reflects them." },
			/**
			* What a partition entry declares; its index is layout, and the written
			* fields are observed from its bytes, which content comparison covers.
			*/
			"esp-flash-partition": { declaration: (metadata) => ({
				label: metadata.label,
				label_hex: metadata.label_hex,
				type: metadata.type,
				subtype: metadata.subtype,
				flash_address: metadata.flash_address,
				size: metadata.size,
				encrypted: metadata.encrypted,
				readonly: metadata.readonly,
				unknown_flags: metadata.unknown_flags
			}) },
			fit: { notCompared: "Its fields come from the FIT's own bytes, which content comparison covers." },
			/**
			* Payload interpretation and sharing declarations, independent of FIT
			* placement: the image's name, index and data position are layout.
			*/
			"fit-image": {
				declaration: (metadata) => ({
					type: metadata.type,
					arch: metadata.arch,
					os: metadata.os,
					compression: metadata.compression,
					load: metadata.load,
					entry: metadata.entry,
					image_data: metadata.image_data,
					cipher_present: metadata.cipher_present,
					cipher_algo: metadata.cipher_algo
				}),
				unreadable: (metadata) => metadata.unreadable_fields
			}
		};
		COMPARED_FORMAT_METADATA_KINDS = Object.entries(declarationsByKind).flatMap(([kind, entry]) => "declaration" in entry ? [kind] : []);
		declarationOf = (kind, metadata) => {
			const entry = declarationsByKind[kind];
			return "declaration" in entry ? {
				kind,
				facts: entry.declaration(metadata),
				unreadable: entry.unreadable?.(metadata) ?? []
			} : undefined;
		};
		formatMetadataDeclaration = (metadata) => metadata === undefined ? undefined : declarationOf(metadata.kind, metadata);
	})))();
}

//#endregion
//#region dist/domain/inesContainer.js
var nesContainerFormat, inesHeaderSchema, inesInventorySchema, parseInesLayout;
function init_inesContainer() {
	return (init_inesContainer = __esmMin((() => {
		init_result();
		nesContainerFormat = (prefix) => {
			if (prefix.subarray(0, 4).equals(Buffer.from("UNIF"))) return "unif";
			if (!prefix.subarray(0, 4).equals(Buffer.from([
				78,
				69,
				83,
				26
			]))) return undefined;
			return prefix.length >= 8 && (prefix.readUInt8(7) & 12) === 8 ? "nes-2.0" : "ines";
		};
		inesHeaderSchema = z.strictObject({
			format: z.literal("ines"),
			header_hex: z.string().regex(/^[a-f0-9]{32}$/u),
			prg_rom_units_16k: z.number().int().min(1).max(255),
			chr_rom_units_8k: z.number().int().min(0).max(255),
			mapper: z.number().int().min(0).max(255),
			flags_6: z.number().int().min(0).max(255),
			flags_7: z.number().int().min(0).max(255),
			trainer_present: z.boolean(),
			battery_flag: z.boolean(),
			mirroring: z.enum([
				"horizontal",
				"vertical",
				"four-screen"
			])
		});
		inesInventorySchema = z.strictObject({
			header: inesHeaderSchema,
			reconstruction: z.strictObject({
				region_order: z.array(z.string().min(1)).min(2),
				bytes: z.number().int().min(16).max(Number.MAX_SAFE_INTEGER),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				verified: z.literal(true)
			})
		});
		parseInesLayout = (prefix, fileSize) => {
			const format = nesContainerFormat(prefix);
			if (format !== "ines") return err(format === undefined ? "missing iNES byte signature" : `${format} containers are not supported by the classic iNES lane`);
			if (!Number.isSafeInteger(fileSize) || fileSize < 0) return err("invalid iNES file extent: expected a nonnegative safe integer");
			if (fileSize < 16 || prefix.length < 16) return err("truncated iNES header: expected 16 bytes");
			const prgUnits = prefix.readUInt8(4);
			const chrUnits = prefix.readUInt8(5);
			const flags6 = prefix.readUInt8(6);
			const flags7 = prefix.readUInt8(7);
			if ((flags7 & 12) !== 0) return err("unsupported iNES header variant");
			if (prefix.subarray(12, 16).some((byte) => byte !== 0)) return err("ambiguous iNES mapper: reserved header bytes 12..15 are nonzero");
			if (prgUnits === 0) return err("iNES requires at least one PRG-ROM unit");
			const trainer = (flags6 & 4) !== 0;
			const declaredEnd = 16 + (trainer ? 512 : 0) + prgUnits * 16384 + chrUnits * 8192;
			if (declaredEnd > fileSize) return err(`truncated iNES payload: header declares ${declaredEnd} bytes; file has ${fileSize}`);
			const regions = [{
				path: "header.bin",
				offset: 0,
				length: 16
			}];
			let offset = 16;
			if (trainer) {
				regions.push({
					path: "trainer.bin",
					offset,
					length: 512
				});
				offset += 512;
			}
			for (const [kind, count, length] of [[
				"prg",
				prgUnits,
				16384
			], [
				"chr",
				chrUnits,
				8192
			]]) for (let index = 0; index < count; index += 1) {
				regions.push({
					path: `${kind}/${String(index).padStart(3, "0")}.bin`,
					offset,
					length
				});
				offset += length;
			}
			if (offset < fileSize) regions.push({
				path: "trailing.bin",
				offset,
				length: fileSize - offset
			});
			return ok({
				header: {
					format: "ines",
					header_hex: prefix.subarray(0, 16).toString("hex"),
					prg_rom_units_16k: prgUnits,
					chr_rom_units_8k: chrUnits,
					mapper: flags6 >>> 4 | flags7 & 240,
					flags_6: flags6,
					flags_7: flags7,
					trainer_present: trainer,
					battery_flag: (flags6 & 2) !== 0,
					mirroring: (flags6 & 8) !== 0 ? "four-screen" : (flags6 & 1) !== 0 ? "vertical" : "horizontal"
				},
				regions
			});
		};
	})))();
}

//#endregion
//#region dist/domain/artifactGraph.js
var artifactTraversalOmissionKindSchema, sha256Schema, artifactIdSchema$1, occurrenceIdSchema, edgeIdSchema, manifestIdSchema, extractionIdSchema, contradictionIdSchema, boundedRelativePathSchema, artifactKindSchema, ARTIFACT_FORMAT_IDS, artifactFormatSchema, artifactContentFormatSchema, artifactByteRangeSchema, artifactCommandSchema, artifactNodeSchema, artifactOccurrenceSchema, integrityContradictionBaseSchema, integrityContradictionSchema, artifactEdgeSchema, artifactGraphManifestSchema, artifactInventoryCoverageSchema, artifactInventoryResultSchema, extractedArtifactSchema, artifactExtractionManifestSchema, artifactExtractionResultSchema;
function init_artifactGraph() {
	return (init_artifactGraph = __esmMin((() => {
		init_artifactIntegrity();
		init_artifactFormatMetadata();
		init_digests();
		init_inesContainer();
		artifactTraversalOmissionKindSchema = z.enum([
			"fifo",
			"socket",
			"block-device",
			"character-device",
			"unsupported",
			"directory-descendants"
		]);
		sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
		artifactIdSchema$1 = prefixedDigestSchema("art");
		occurrenceIdSchema = prefixedDigestSchema("occ");
		edgeIdSchema = prefixedDigestSchema("edge");
		manifestIdSchema = prefixedDigestSchema("agm");
		extractionIdSchema = prefixedDigestSchema("aex");
		contradictionIdSchema = prefixedDigestSchema("ic");
		boundedRelativePathSchema = z.string().min(1).refine((path) => !path.startsWith("/") && path.split("/").every((part) => part !== "" && part !== ".."), "Expected a normalized relative POSIX path without traversal");
		artifactKindSchema = z.enum([
			"container",
			"executable",
			"dynamic-library",
			"framework",
			"native-addon",
			"javascript",
			"source-map",
			"plist",
			"entitlements",
			"resource",
			"universal-slice",
			"package-metadata",
			"unknown"
		]);
		ARTIFACT_FORMAT_IDS = [
			"dotnet-bundle",
			"bun-standalone",
			"dmg",
			"zip",
			"pkg",
			"asar",
			"ines",
			"godot-pck",
			"unityfs",
			"wxapkg",
			"uimage",
			"javascript-bundle",
			"source-map",
			"mach-o-universal",
			"mach-o",
			"elf",
			"pe",
			"dos-mz",
			"dos-com",
			"raw-binary",
			"gamecube-dol",
			"hopper",
			"analysis-database",
			"ipa",
			"apk",
			"msix",
			"appx",
			"hap",
			"hsp",
			"app-pack",
			"plist",
			"entitlements",
			"directory",
			"file",
			"pyinstaller",
			"node-sea",
			"intel-hex",
			"srec",
			"esp-image",
			"uf2",
			"dfuse",
			"esp-flash-image",
			"fit",
			"unknown"
		];
		artifactFormatSchema = z.enum(ARTIFACT_FORMAT_IDS);
		artifactContentFormatSchema = artifactFormatSchema.extract([
			"ines",
			"zip",
			"godot-pck",
			"unityfs",
			"wxapkg",
			"uimage",
			"intel-hex",
			"srec",
			"esp-image",
			"uf2",
			"dfuse",
			"fit",
			"mach-o-universal",
			"mach-o",
			"elf",
			"pe",
			"dos-mz",
			"plist",
			"directory",
			"file",
			"unknown"
		]);
		artifactByteRangeSchema = z.object({
			offset: z.int().min(0),
			length: z.int().min(0)
		});
		artifactCommandSchema = z.object({
			tool: z.string().min(1),
			arguments: z.array(z.string()),
			tool_version: z.string().nullable(),
			executable_sha256: sha256Schema.nullable(),
			exit_code: z.int().nullable(),
			effects: z.array(z.enum([
				"read",
				"write",
				"mount"
			]))
		});
		artifactNodeSchema = z.object({
			artifact_id: artifactIdSchema$1,
			format: artifactContentFormatSchema,
			sha256: sha256Schema,
			size: z.int().min(0).max(Number.MAX_SAFE_INTEGER),
			media_type: z.string().min(1).nullable(),
			architecture: z.string().min(1).nullable(),
			content_state: z.enum([
				"materialized",
				"embedded",
				"virtual"
			]),
			limitations: z.array(z.string())
		});
		artifactOccurrenceSchema = z.object({
			occurrence_id: occurrenceIdSchema,
			artifact_id: artifactIdSchema$1.nullable(),
			parent_occurrence_id: occurrenceIdSchema.nullable(),
			logical_path: boundedRelativePathSchema,
			entry_kind: z.enum([
				"file",
				"directory",
				"symlink",
				"slice",
				"metadata"
			]),
			artifact_kind: artifactKindSchema,
			artifact_format: artifactFormatSchema,
			declared_size: z.int().min(0).max(Number.MAX_SAFE_INTEGER).nullable(),
			compressed_size: z.int().min(0).max(Number.MAX_SAFE_INTEGER).nullable(),
			executable: z.boolean(),
			encrypted: z.boolean(),
			/** Reader-observed ASAR storage; omission leaves historical storage unknown. */
			unpacked: z.boolean().exactOptional(),
			hash_status: z.enum([
				"verified",
				"mismatched",
				"not-hashed",
				"unavailable"
			]),
			source_location: artifactByteRangeSchema.nullable(),
			/** Exact reader-source path or opaque key, including an observed empty key. */
			source_path: z.string().exactOptional(),
			declared_integrity: artifactIntegrityClaimSchema.exactOptional(),
			format_metadata: artifactFormatMetadataSchema.exactOptional(),
			limitations: z.array(z.string())
		});
		integrityContradictionBaseSchema = z.object({
			contradiction_id: contradictionIdSchema,
			occurrence_id: occurrenceIdSchema,
			parent_artifact_id: artifactIdSchema$1,
			logical_path: boundedRelativePathSchema,
			entry_kind: z.enum(["file", "slice"]),
			unpacked: z.boolean(),
			trust: z.literal("observed-untrusted"),
			provenance: z.literal("container-integrity-metadata-versus-observed-bytes"),
			limitations: z.array(z.string()).min(1)
		});
		integrityContradictionSchema = z.union([
			integrityContradictionBaseSchema.extend(artifactSha256PairSchema.shape),
			integrityContradictionBaseSchema.extend(artifactMd5PairSchema.shape),
			integrityContradictionBaseSchema.extend(artifactDfuCrc32PairSchema.shape)
		]);
		artifactEdgeSchema = z.object({
			edge_id: edgeIdSchema,
			ordinal: z.int().min(0),
			parent_artifact_id: artifactIdSchema$1,
			relation: z.enum([
				"contains",
				"extracts",
				"slice-of",
				"embeds",
				"loads",
				"maps-source",
				"derived-from"
			]),
			occurrence_id: occurrenceIdSchema,
			producer: artifactCommandSchema.nullable()
		});
		artifactGraphManifestSchema = z.object({
			manifest_id: manifestIdSchema,
			root_artifact_id: artifactIdSchema$1,
			root_sha256: sha256Schema,
			root_format: artifactFormatSchema,
			graph_sha256: sha256Schema,
			node_count: z.int().min(1),
			occurrence_count: z.int().min(1),
			edge_count: z.int().min(0)
		});
		artifactInventoryCoverageSchema = z.strictObject({
			scope: z.enum(["root", "container-entries"]),
			status: z.enum(["complete", "unknown"])
		});
		artifactInventoryResultSchema = z.strictObject({
			manifest: artifactGraphManifestSchema,
			nodes: z.array(artifactNodeSchema),
			occurrences: z.array(artifactOccurrenceSchema),
			edges: z.array(artifactEdgeSchema),
			provenance: z.array(artifactCommandSchema),
			ines: inesInventorySchema.exactOptional(),
			integrity_contradictions: z.array(integrityContradictionSchema),
			coverage: artifactInventoryCoverageSchema,
			limitations: z.array(z.string())
		});
		extractedArtifactSchema = z.object({
			artifact_id: artifactIdSchema$1,
			relative_path: boundedRelativePathSchema,
			sha256: sha256Schema,
			bytes_written: z.int().min(0).max(Number.MAX_SAFE_INTEGER),
			created: z.boolean()
		});
		artifactExtractionManifestSchema = z.object({
			extraction_id: extractionIdSchema,
			source_manifest_id: manifestIdSchema,
			selected_occurrence_ids: z.array(occurrenceIdSchema),
			files_sha256: sha256Schema,
			output_root_alias: z.literal("$OUTPUT_ROOT")
		});
		artifactExtractionResultSchema = z.object({
			manifest: artifactGraphManifestSchema,
			extraction_manifest: artifactExtractionManifestSchema,
			output_root: z.string().min(1),
			artifacts: z.array(extractedArtifactSchema),
			containment_verified: z.boolean(),
			cleanup: z.object({
				attempted: z.boolean(),
				verified: z.boolean(),
				residual_paths: z.array(boundedRelativePathSchema)
			}),
			coverage: artifactInventoryCoverageSchema,
			provenance: z.array(artifactCommandSchema),
			integrity_contradictions: z.array(integrityContradictionSchema),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/native/nativeDeadlines.js
var MAX_NATIVE_TIMER_MS, DEFAULT_NATIVE_COMMAND_TIMEOUT_MS, DEFAULT_NATIVE_UI_DEADLINE_MS, DEFAULT_PWNTOOLS_TIMEOUT_MS, NATIVE_UI_WAIT_STEP_MAX_MS, nativeDeadlineMsSchema, deadlineField, nativeCommandTimeoutField, nativeUiDeadlineField, pwntoolsTimeoutField, readNativeDeadline, nativeDeadlineRecovery, fixedNativeAllowance;
function init_nativeDeadlines() {
	return (init_nativeDeadlines = __esmMin((() => {
		init_fixedAllowanceRemediation();
		MAX_NATIVE_TIMER_MS = 2147483647;
		DEFAULT_NATIVE_COMMAND_TIMEOUT_MS = 6e4;
		DEFAULT_NATIVE_UI_DEADLINE_MS = 18e4;
		DEFAULT_PWNTOOLS_TIMEOUT_MS = 3e4;
		NATIVE_UI_WAIT_STEP_MAX_MS = 18e4;
		nativeDeadlineMsSchema = z.number().int().min(1).max(MAX_NATIVE_TIMER_MS);
		deadlineField = (description) => nativeDeadlineMsSchema.optional().describe(description);
		nativeCommandTimeoutField = deadlineField("Wall-clock budget in milliseconds for each macOS native command in this call (lipo, codesign, plutil, swift-demangle, and the other allowlisted Xcode tools). Omitted means 60000. Integer from 1 to 2147483647. Applies on the next call. Does not raise the fixed 67108864-byte output allowance or the 65536-byte failure-diagnostic excerpt. Named native_command_timeout_ms rather than command_timeout_ms because command_timeout_ms is the separate one-shot objdump and rizin deadline (default 120000).");
		nativeUiDeadlineField = deadlineField("Deadline in milliseconds for this UI observation or scenario, including helper preparation and captures. Omitted means 180000. Integer from 1 to 2147483647. Applies on the next call. Does not raise the fixed 67108864-byte scenario output allowance or the 180000 ms cap on one wait step. A partial observation may already be retained when this deadline expires.");
		pwntoolsTimeoutField = deadlineField("Deadline in milliseconds for each owned pwntools command in this call. Omitted means 30000. Integer from 1 to 2147483647. Applies on the next call. Does not raise cpuSeconds 30 or the output (67108864 bytes), diagnostic (1048576 bytes), or address-space (3221225472 bytes) allowances. Artifact admission stays REA_PWNTOOLS_MAX_INPUT_BYTES (default 33554432 bytes).");
		readNativeDeadline = (value, defaultMs) => {
			if (value === undefined) return {
				ok: true,
				timeoutMs: defaultMs
			};
			const parsed = nativeDeadlineMsSchema.safeParse(value);
			if (parsed.success) return {
				ok: true,
				timeoutMs: parsed.data
			};
			const invalidType = parsed.error.issues.some((issue) => issue.code === "invalid_type");
			return {
				ok: false,
				reason: invalidType ? "invalid_type" : "out_of_range",
				message: `Expected an integer from 1 to ${String(MAX_NATIVE_TIMER_MS)} milliseconds; received ${JSON.stringify(value)}. Omitted means ${String(defaultMs)}.`
			};
		};
		nativeDeadlineRecovery = (input) => {
			const atMaximum = input.timeoutMs >= MAX_NATIVE_TIMER_MS;
			const adjustment = atMaximum ? `${input.setting} (${input.cliFlag} on the CLI) is already at the maximum ${String(MAX_NATIVE_TIMER_MS)} ms; do not increase it.` : `Increase ${input.setting} above ${String(input.timeoutMs)} (integer milliseconds from 1 to ${String(MAX_NATIVE_TIMER_MS)}; omitted means ${String(input.defaultMs)}), or pass ${input.cliFlag} on the CLI. A change applies on the next call.`;
			return {
				userMessage: `This request reached REA's ${input.phase} of ${String(input.timeoutMs)} ms (${input.setting}). This is a server/provider deadline, not the MCP client deadline.${input.detail ?? ""}`,
				remediationAction: `${adjustment} ${input.unchanged} Allow execution, cleanup, and delivery headroom in the outer MCP client deadline. Confirm outstanding work and cleanup before retrying.`
			};
		};
		fixedNativeAllowance = (allowance, kind, valueWithUnits) => ({
			retryable: false,
			remediationAction: `${fixedAllowanceRemediation(allowance, kind)} This release has no runtime override. The allowance is ${valueWithUnits}.`
		});
	})))();
}

//#endregion
//#region dist/domain/native/nativeCallReference.js
var nativeCallClassificationSchema, nativeCallReferenceSchema;
function init_nativeCallReference() {
	return (init_nativeCallReference = __esmMin((() => {
		nativeCallClassificationSchema = z.strictObject({
			classification: z.enum([
				"none",
				"unknown",
				"direct",
				"objective_c"
			]),
			provider_type: z.number().int(),
			provenance: z.string().min(1)
		});
		nativeCallReferenceSchema = nativeCallClassificationSchema.extend({
			source_address: z.string(),
			target_address: z.string()
		});
	})))();
}

//#endregion
//#region dist/domain/native/nativeReference.js
var availableReferenceKindSchema, referenceKindSchema, unresolvedCallSchema, referenceEdgeSchema;
function init_nativeReference() {
	return (init_nativeReference = __esmMin((() => {
		init_nativeFactAvailability();
		init_procedureInfo();
		init_nativeCallReference();
		availableReferenceKindSchema = z.object({
			available: z.literal(true),
			provenance: z.string().min(1),
			type: z.string(),
			flow: z.boolean(),
			call: z.boolean(),
			jump: z.boolean(),
			data: z.boolean(),
			read: z.boolean(),
			write: z.boolean(),
			indirect: z.boolean(),
			computed: z.boolean(),
			conditional: z.boolean(),
			terminal: z.boolean(),
			primary: z.boolean(),
			operand_index: z.int(),
			external: z.boolean()
		}).strict();
		referenceKindSchema = z.discriminatedUnion("available", [unavailableNativeFactSchema, availableReferenceKindSchema]);
		unresolvedCallSchema = z.strictObject({
			address: z.string(),
			reason: z.string()
		});
		referenceEdgeSchema = z.object({
			source_address: z.string(),
			target_address: z.string(),
			source_procedure: procedureIdentitySchema.nullable(),
			target_procedure: procedureIdentitySchema.nullable(),
			kind: referenceKindSchema,
			call: nativeCallClassificationSchema.exactOptional()
		}).strict();
	})))();
}

//#endregion
//#region dist/domain/native/swiftStringLiteral.js
var swiftStringLiteralFields, swiftSmallStringLiteralSchema, swiftLargeStringLiteralSchema, swiftStringLiteralSchema, swiftStringLiteralOmissionFields, swiftSmallStringLiteralOmissionSchema, swiftLargeStringLiteralOmissionSchema, swiftStringLiteralOmissionSchema;
function init_swiftStringLiteral() {
	return (init_swiftStringLiteral = __esmMin((() => {
		init_fixedTupleSchema();
		swiftStringLiteralFields = {
			source_address: z.string().describe("Instruction that consumes both words: a call, tail call, return, or paired store."),
			value: z.string().describe("Decoded UTF-8 text, including the canonical empty string."),
			registers: fixedTupleSchema([z.string(), z.string()]),
			words: fixedTupleSchema([z.string(), z.string()]).describe("Observed constant register values, in register order.")
		};
		swiftSmallStringLiteralSchema = z.strictObject({
			...swiftStringLiteralFields,
			representation: z.literal("small").describe("The UTF-8 bytes are inside the two words."),
			address: z.null().describe("A small literal has no storage of its own.")
		});
		swiftLargeStringLiteralSchema = z.strictObject({
			...swiftStringLiteralFields,
			representation: z.literal("large").describe("An immortal literal whose words hold its count and a pointer to its bytes."),
			address: z.string().describe("Address of a large literal's bytes.")
		});
		swiftStringLiteralSchema = z.discriminatedUnion("representation", [swiftSmallStringLiteralSchema, swiftLargeStringLiteralSchema]);
		swiftStringLiteralOmissionFields = {
			source_address: swiftStringLiteralFields.source_address,
			byte_length: z.int().min(0).max(Number.MAX_SAFE_INTEGER),
			reason: z.enum(["capacity", "unresolved_jump"]).describe("Why this candidate is omitted: capacity stopped decoding, or an unresolved jump left its use unknown."),
			registers: swiftStringLiteralFields.registers,
			words: swiftStringLiteralFields.words
		};
		swiftSmallStringLiteralOmissionSchema = z.strictObject({
			...swiftStringLiteralOmissionFields,
			representation: z.literal("small"),
			address: z.null()
		});
		swiftLargeStringLiteralOmissionSchema = z.strictObject({
			...swiftStringLiteralOmissionFields,
			representation: z.literal("large"),
			address: z.string().describe("Address of the literal's bytes.")
		});
		swiftStringLiteralOmissionSchema = z.discriminatedUnion("representation", [swiftSmallStringLiteralOmissionSchema, swiftLargeStringLiteralOmissionSchema]);
	})))();
}

//#endregion
//#region dist/domain/native/nativeApiBoundary.js
var inferenceConfidenceSchema, inferenceEvidenceSchema, inferredBoundaryTypeFacts, inferredReturnTypeSchema, inferredParameterTypeSchema, jumpTableDataSourceSchema, jumpTableMappingSchema, jumpTableDefaultTargetSchema, inferredJumpTableSchema, availableNativeApiBoundarySchema, unavailableNativeApiBoundarySchema, nativeApiBoundarySchema, nativeApiInspectionSubstepSchema, nativeApiInspectionResultSchema;
function init_nativeApiBoundary() {
	return (init_nativeApiBoundary = __esmMin((() => {
		inferenceConfidenceSchema = z.enum([
			"low",
			"medium",
			"high"
		]);
		inferenceEvidenceSchema = z.object({
			kind: z.enum([
				"signature-source",
				"decompiler-type",
				"type-lock",
				"calling-convention",
				"jump-table"
			]),
			source: z.string().min(1),
			detail: z.string().min(1)
		}).strict();
		inferredBoundaryTypeFacts = {
			ordinal: z.int().min(0).nullable(),
			name: z.string().min(1).nullable(),
			data_type: z.string().min(1),
			size_bytes: z.int().min(0).nullable(),
			storage: z.string().min(1).nullable(),
			confidence: inferenceConfidenceSchema,
			evidence: z.array(inferenceEvidenceSchema).min(1),
			decompiler_artifacts: z.array(z.enum([
				"recovered-signature",
				"register-or-stack-storage",
				"compiler-generated-variable"
			]))
		};
		inferredReturnTypeSchema = z.strictObject({
			...inferredBoundaryTypeFacts,
			role: z.literal("return"),
			ordinal: z.null(),
			name: z.null()
		});
		inferredParameterTypeSchema = z.strictObject({
			...inferredBoundaryTypeFacts,
			role: z.literal("parameter"),
			ordinal: z.int().min(0)
		});
		jumpTableDataSourceSchema = z.object({
			address: z.string().min(1),
			provenance: z.enum([
				"ghidra-decompiler-load-table",
				"ghidra-dispatch-block-data-reference",
				"ghidra-aarch64-byte-table",
				"ghidra-aarch64-halfword-table"
			]),
			entry_size_bytes: z.int().min(1).nullable(),
			entry_count: z.int().min(0).nullable(),
			confidence: inferenceConfidenceSchema,
			evidence: z.array(inferenceEvidenceSchema).min(1)
		}).strict();
		jumpTableMappingSchema = z.object({
			case_value: z.int().nullable(),
			target_address: z.string().min(1),
			confidence: inferenceConfidenceSchema,
			evidence: z.array(inferenceEvidenceSchema).min(1)
		}).strict();
		jumpTableDefaultTargetSchema = z.strictObject({
			target_address: z.string().min(1),
			confidence: inferenceConfidenceSchema,
			evidence: z.array(inferenceEvidenceSchema).min(1)
		});
		inferredJumpTableSchema = z.object({
			dispatch_address: z.string().min(1),
			data_sources: z.array(jumpTableDataSourceSchema),
			mappings: z.array(jumpTableMappingSchema),
			default_targets: z.array(jumpTableDefaultTargetSchema),
			limitations: z.array(z.string())
		}).strict();
		availableNativeApiBoundarySchema = z.object({
			available: z.literal(true),
			provenance: z.string().min(1),
			signature_source: z.string().min(1),
			calling_convention: z.string().min(1),
			return_type: inferredReturnTypeSchema,
			parameters: z.array(inferredParameterTypeSchema),
			jump_tables: z.array(inferredJumpTableSchema),
			pseudocode: z.object({
				classification: z.literal("decompiler-generated-non-source"),
				compilable: z.literal(false)
			}).strict(),
			decompiler_artifacts: z.array(z.enum([
				"recovered-signature",
				"register-and-stack-variables",
				"compiler-generated-control-flow",
				"pointer-arithmetic",
				"pseudocode"
			])),
			limitations: z.array(z.string())
		}).strict();
		unavailableNativeApiBoundarySchema = z.object({
			available: z.literal(false),
			reason: z.string().min(1),
			residual_unknowns: z.array(z.string().min(1)).min(1)
		}).strict();
		nativeApiBoundarySchema = z.discriminatedUnion("available", [unavailableNativeApiBoundarySchema, availableNativeApiBoundarySchema]);
		nativeApiInspectionSubstepSchema = z.object({
			operation: z.enum([
				"analyze_function",
				"project_native_api_boundary",
				"preserve_residual_unknowns"
			]),
			status: z.enum(["completed", "unsupported"]),
			observations: z.array(z.string().min(1))
		}).strict();
		nativeApiInspectionResultSchema = z.object({
			procedure: z.object({
				address: z.string().min(1),
				name: z.string().min(1)
			}).strict(),
			boundary: nativeApiBoundarySchema,
			substeps: z.array(nativeApiInspectionSubstepSchema).length(3),
			unsupported_branches: z.array(z.string().min(1)),
			residual_unknowns: z.array(z.string().min(1))
		}).strict();
	})))();
}

//#endregion
//#region dist/domain/native/functionDossier.js
var functionInstructionWindowSchema, facetAvailabilitySchema, functionFacetAvailabilitySchema, functionDossierSchema, parseFunctionDossier;
function init_functionDossier() {
	return (init_functionDossier = __esmMin((() => {
		init_result();
		init_analysisErrorCore();
		init_procedureInfo();
		init_nativeString();
		init_nativeReference();
		init_swiftStringLiteral();
		init_nativeApiBoundary();
		init_nativeValueFlow();
		functionInstructionWindowSchema = z.object({
			procedure: procedureIdentitySchema,
			instructions: z.array(z.string()),
			limitations: z.array(z.string())
		}).strict();
		facetAvailabilitySchema = z.discriminatedUnion("available", [z.object({ available: z.literal(true) }).strict(), z.object({
			available: z.literal(false),
			reason: z.string().min(1)
		}).strict()]);
		functionFacetAvailabilitySchema = z.object({
			pseudocode: facetAvailabilitySchema.exactOptional(),
			assembly: facetAvailabilitySchema.exactOptional(),
			comments: facetAvailabilitySchema.exactOptional(),
			callers: facetAvailabilitySchema.exactOptional(),
			callees: facetAvailabilitySchema.exactOptional(),
			references: facetAvailabilitySchema.exactOptional(),
			strings_names: facetAvailabilitySchema.exactOptional(),
			cfg: facetAvailabilitySchema.exactOptional()
		}).strict();
		functionDossierSchema = z.object({
			procedure: procedureIdentitySchema.safeExtend({
				signature: z.string().nullable(),
				locals: z.array(localVariableSchema)
			}),
			pseudocode: z.string(),
			assembly: z.array(z.string()),
			comments: z.array(z.object({
				address: z.string(),
				kind: z.enum(["comment", "inline"]),
				text: z.string()
			}).strict()),
			callers: z.array(procedureIdentitySchema),
			callees: z.array(procedureIdentitySchema),
			incoming_references: z.array(referenceEdgeSchema),
			outgoing_references: z.array(referenceEdgeSchema),
			unresolved_calls: z.array(unresolvedCallSchema).exactOptional(),
			referenced_strings: z.array(analysisStringSchema.extend({ source_address: z.string() })),
			referenced_names: z.array(z.object({
				address: z.string(),
				value: z.string(),
				source_address: z.string()
			}).strict()),
			swift_string_literals: z.array(swiftStringLiteralSchema).exactOptional().describe("Swift String literals decoded from constant register values. Absent when the provider does not decode them for this target."),
			swift_string_literal_omissions: z.array(swiftStringLiteralOmissionSchema).exactOptional().describe("Literal candidates omitted for capacity or unresolved control flow. Present exactly when swift_string_literals is present; empty when all examined use sites were classified."),
			basic_blocks: z.array(z.object({
				start: z.string(),
				end: z.string(),
				successors: z.array(z.string())
			}).strict()),
			native_api: nativeApiBoundarySchema.nullable(),
			native_value_flow: nativeValueFlowSchema.nullable(),
			facet_availability: functionFacetAvailabilitySchema.exactOptional(),
			limitations: z.array(z.string())
		}).strict();
		parseFunctionDossier = (value) => {
			const parsed = functionDossierSchema.safeParse(value);
			return parsed.success ? ok(parsed.data) : err(new AnalysisOutputError("analyze_function", "provider output did not match the dossier contract", { cause: parsed.error }));
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticValueTypes.js
var javaScriptSemanticResourceLimitSchema;
function init_javascriptSemanticValueTypes() {
	return (init_javascriptSemanticValueTypes = __esmMin((() => {
		javaScriptSemanticResourceLimitSchema = z.enum([
			"primitive-candidates",
			"primitive-bytes",
			"expression-depth",
			"getter-expansion",
			"alias-selections"
		]);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptStaticCoverage.js
var javaScriptStaticCoverageSchema, javaScriptStaticParseStatus, unexaminedJavaScriptStaticCoverage;
function init_javascriptStaticCoverage() {
	return (init_javascriptStaticCoverage = __esmMin((() => {
		init_javascriptSemanticValueTypes();
		javaScriptStaticCoverageSchema = z.strictObject({
			syntax: z.discriminatedUnion("status", [
				z.strictObject({
					status: z.literal("complete"),
					error_count: z.literal(0)
				}),
				z.strictObject({
					status: z.literal("recovered"),
					error_count: z.int().positive()
				}),
				z.strictObject({
					status: z.literal("failed"),
					error_count: z.null()
				}),
				z.strictObject({
					status: z.literal("not-examined"),
					error_count: z.null()
				})
			]),
			semantics: z.strictObject({
				unknown_findings: z.int().nonnegative().nullable(),
				uncertainty: z.array(z.enum([
					"dynamic-findings",
					"returned-reference-widening",
					"type-only-module-side-effect"
				]))
			}),
			examination: z.strictObject({
				status: z.enum([
					"complete",
					"limited",
					"not-examined"
				]),
				semantic_resource_limits: z.array(javaScriptSemanticResourceLimitSchema),
				electron_call_paths_limited: z.boolean()
			}),
			applicability: z.strictObject({ electron: z.enum(["observed", "unknown"]) }),
			unexamined_reason: z.string().min(1).exactOptional()
		});
		javaScriptStaticParseStatus = (coverage) => coverage.syntax.status === "failed" || coverage.syntax.status === "not-examined" ? "failed" : coverage.syntax.status === "recovered" || (coverage.semantics.unknown_findings ?? 0) > 0 || coverage.examination.semantic_resource_limits.includes("alias-selections") ? "partial" : "complete";
		unexaminedJavaScriptStaticCoverage = (reason) => ({
			syntax: {
				status: "not-examined",
				error_count: null
			},
			semantics: {
				unknown_findings: null,
				uncertainty: []
			},
			examination: {
				status: "not-examined",
				semantic_resource_limits: [],
				electron_call_paths_limited: false
			},
			applicability: { electron: "unknown" },
			unexamined_reason: reason
		});
	})))();
}

//#endregion
//#region dist/domain/analysisView/recordedMediaType.js
var MEDIA_TYPE_ESSENCE, JSON_LIKE_TEXT, mediaTypeEssence, isJson, isJsonLike;
function init_recordedMediaType() {
	return (init_recordedMediaType = __esmMin((() => {
		MEDIA_TYPE_ESSENCE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+\/[A-Za-z0-9!#$%&'*+.^_`|~-]+$/u;
		JSON_LIKE_TEXT = new Set(["text/plain", "text/markdown"]);
		mediaTypeEssence = (reported) => {
			const separator = reported.indexOf(";");
			let start = 0;
			let end = separator < 0 ? reported.length : separator;
			while (start < end && (reported[start] === " " || reported[start] === "	")) start += 1;
			while (end > start && (reported[end - 1] === " " || reported[end - 1] === "	")) end -= 1;
			const essence = reported.slice(start, end);
			return MEDIA_TYPE_ESSENCE.test(essence) ? essence.toLowerCase() : null;
		};
		isJson = (essence) => essence === "application/json" || essence !== null && essence.startsWith("application/") && essence.endsWith("+json");
		isJsonLike = (essence) => isJson(essence) || essence !== null && JSON_LIKE_TEXT.has(essence);
	})))();
}

//#endregion
//#region dist/domain/protobufWire.js
var protobufOptionsSchema, index, issueSchema, protobufFieldSchema, protobufFrameSchema, protobufDecodingObjectSchema, protobufDecodingSchema;
function init_protobufWire() {
	return (init_protobufWire = __esmMin((() => {
		init_localPath();
		protobufOptionsSchema = z.strictObject({
			framing: z.enum([
				"auto",
				"raw",
				"grpc",
				"grpc-web",
				"grpc-web-text"
			]).default("auto"),
			body_pointers: z.array(z.string()).optional(),
			schema: z.strictObject({
				descriptor_set_path: absoluteLocalPathStringSchema,
				message_type: z.string().min(1)
			}).optional()
		});
		index = z.number().int().nonnegative();
		issueSchema = z.strictObject({
			offset: index,
			reason: z.string()
		});
		protobufFieldSchema = z.strictObject({
			index,
			frame_index: index,
			field_id: z.string(),
			parent_field_id: z.string().nullable(),
			parent_index: index.nullable(),
			number: z.number().int().positive().max(536870911),
			wire_type: z.enum([
				"varint",
				"i64",
				"len",
				"i32",
				"group"
			]),
			offset: index,
			bytes: index,
			payload_offset: index,
			payload_bytes: index,
			value: z.string().exactOptional(),
			text: z.string().exactOptional(),
			interpretations: z.array(z.enum([
				"utf8-string",
				"nested-message",
				"packed-varint",
				"packed-fixed32",
				"packed-fixed64",
				"bytes"
			])).exactOptional(),
			schema_name: z.string().exactOptional(),
			schema_type: z.string().exactOptional(),
			schema_value: z.string().exactOptional(),
			schema_enum_values: z.array(z.strictObject({
				number: z.string(),
				names: z.array(z.string())
			})).exactOptional(),
			schema_status: z.enum([
				"decoded",
				"unknown-field",
				"wire-type-mismatch",
				"invalid-message",
				"unsupported"
			]).exactOptional(),
			schema_error: issueSchema.exactOptional()
		});
		protobufFrameSchema = z.strictObject({
			index,
			kind: z.enum(["data", "trailer"]),
			offset: index,
			payload_offset: index,
			bytes: index,
			compressed: z.boolean(),
			status: z.enum([
				"complete",
				"partial",
				"unknown"
			]),
			examined_bytes: index,
			error: issueSchema.exactOptional(),
			trailers: z.array(z.strictObject({
				name: z.string(),
				value: z.string()
			})).exactOptional()
		});
		protobufDecodingObjectSchema = z.strictObject({
			pointer: z.string(),
			content_type: z.string().nullable(),
			decoder: z.literal("rea-protobuf-wire-v1"),
			body_sha256: z.string().regex(/^[0-9a-f]{64}$/),
			framing: z.enum([
				"raw",
				"grpc",
				"grpc-web",
				"grpc-web-text"
			]),
			offset_basis: z.enum(["retained-body", "base64-decoded-body"]),
			decoded_bytes: index,
			status: z.enum([
				"complete",
				"partial",
				"unknown"
			]),
			examined_bytes: index,
			frames: z.array(protobufFrameSchema),
			fields: z.array(protobufFieldSchema),
			error: issueSchema.exactOptional(),
			limitations: z.array(z.string()),
			schema: z.strictObject({
				decoder: z.literal("protobuf-es-2.16.0"),
				descriptor_set_path: z.string(),
				descriptor_set_sha256: z.string().regex(/^[0-9a-f]{64}$/),
				descriptor_set_bytes: index,
				message_type: z.string()
			}).exactOptional()
		});
		protobufDecodingSchema = protobufDecodingObjectSchema.superRefine((body, context) => {
			const issue = (path, message) => context.addIssue({
				code: "custom",
				path,
				message
			});
			if (body.examined_bytes > body.decoded_bytes) issue(["examined_bytes"], "Examined bytes exceed the decoded body");
			if (body.status === "complete" && (body.error !== undefined || body.frames.some((frame) => frame.status !== "complete"))) issue(["status"], "Complete body contradicts frame coverage");
			let expectedOffset = 0;
			for (const [index, frame] of body.frames.entries()) {
				if (frame.offset !== expectedOffset || frame.payload_offset !== frame.offset + (body.framing === "raw" ? 0 : 5)) issue([
					"frames",
					index,
					"offset"
				], "Frames must preserve contiguous protocol ranges");
				expectedOffset = frame.payload_offset + frame.bytes;
				if (frame.index !== index || frame.payload_offset < frame.offset || frame.payload_offset + frame.bytes > body.decoded_bytes || frame.examined_bytes > frame.bytes) issue(["frames", index], "Frame identity or range contradicts the body");
				if (frame.status === "complete" && (frame.error !== undefined || frame.examined_bytes !== frame.bytes || frame.compressed)) issue([
					"frames",
					index,
					"status"
				], "Complete frame contradicts decoding coverage");
				if (body.framing === "grpc" && frame.kind === "trailer") issue([
					"frames",
					index,
					"kind"
				], "Native gRPC has no in-body trailer frame");
			}
			if (body.status === "complete" && (body.examined_bytes !== body.decoded_bytes || expectedOffset !== body.decoded_bytes)) issue(["status"], "Complete decoding must cover the whole decoded body");
			const ids = new Set();
			for (const [index, field] of body.fields.entries()) {
				const frame = body.frames[field.frame_index];
				if (field.index !== index || field.field_id !== `offset:${field.offset}` || ids.has(field.field_id)) issue(["fields", index], "Field occurrence identity is inconsistent");
				ids.add(field.field_id);
				if (frame === undefined || frame.kind !== "data" || field.offset < frame.payload_offset || field.offset + field.bytes > frame.payload_offset + frame.bytes || field.payload_offset < field.offset || field.payload_offset + field.payload_bytes > field.offset + field.bytes) issue(["fields", index], "Field range contradicts its frame");
				const parent = field.parent_index === null ? undefined : body.fields[field.parent_index];
				if (field.parent_index === null ? field.parent_field_id !== null : parent === undefined || parent.index >= index || parent.field_id !== field.parent_field_id || parent.frame_index !== field.frame_index || field.offset < parent.payload_offset || field.offset + field.bytes > parent.payload_offset + parent.payload_bytes) issue([
					"fields",
					index,
					"parent_field_id"
				], "Field parent contradicts its source range");
			}
		});
	})))();
}

//#endregion
//#region dist/domain/qlogCapture.js
var decimal, unsignedFact, traceLocation, qlogCaptureFactsSchema;
function init_qlogCapture() {
	return (init_qlogCapture = __esmMin((() => {
		decimal = z.string().regex(/^(0|[1-9][0-9]*)$/u);
		unsignedFact = z.discriminatedUnion("state", [z.strictObject({
			state: z.literal("reported"),
			value: decimal
		}), z.strictObject({
			state: z.literal("unknown"),
			reason: z.literal("omitted-null-or-redacted")
		})]);
		traceLocation = z.discriminatedUnion("kind", [z.strictObject({
			kind: z.literal("json-pointer"),
			pointer: z.string()
		}), z.strictObject({
			kind: z.literal("unknown"),
			reason: z.literal("explicit-sensitive-value")
		})]);
		qlogCaptureFactsSchema = z.strictObject({
			profile: z.literal("aioquic-1.5.0-json-0.3"),
			scope: z.literal("all-recorded-events-before-selection"),
			body_bytes: z.literal("not-reported"),
			clock: z.strictObject({
				unit: z.literal("milliseconds"),
				domain: z.literal("unix-epoch"),
				basis: z.literal("selected-aioquic-profile-not-producer-authentication")
			}),
			traces: z.array(z.strictObject({
				trace_index: z.int().nonnegative(),
				location: traceLocation,
				event_count: z.int().nonnegative(),
				odcid: z.string().nullable(),
				vantage_point: z.enum(["client", "server"]).nullable(),
				incomplete_fact_records: z.array(z.int().nonnegative()),
				loss_declarations: z.array(z.strictObject({
					record_ordinal: z.int().nonnegative(),
					confidence: z.literal("observed"),
					packet_number: unsignedFact,
					packet_type: z.string().nullable(),
					packet_number_space: z.enum([
						"initial",
						"handshake",
						"application"
					]).nullable()
				})),
				streams: z.array(z.strictObject({
					stream_id: decimal,
					direction: z.enum(["sent", "received"]),
					confidence: z.literal("derived"),
					scope: z.literal("observed-stream-frame-ranges"),
					contributions: z.array(z.strictObject({
						record_ordinal: z.int().nonnegative(),
						frame_index: z.int().nonnegative(),
						offset: decimal,
						length: decimal,
						fin: z.boolean().nullable()
					})),
					covered_ranges: z.array(z.strictObject({
						start: decimal,
						end: decimal
					})),
					unique_bytes: decimal,
					frame_length_sum: decimal,
					repeated_bytes: decimal,
					reported_final_sizes: z.array(decimal)
				}))
			}))
		});
	})))();
}

//#endregion
//#region dist/domain/webNetworkCapture.js
var WEB_NETWORK_CAPTURE_LIMITS, DEFAULT_WEB_NETWORK_CAPTURE_TIMEOUT_MS, selectedWebNetworkCaptureTimeoutMs, webNetworkCaptureTimeoutRecovery, WEB_NETWORK_CAPTURE_FORMATS, inspectWebNetworkCaptureInputSchema, captureSensitiveValues, pointerSchema, redactionSchema, binaryBase, retainedBinaryDescriptorSchema, redactedBinaryDescriptorSchema, webNetworkCaptureBinaryDescriptorSchema, binarySchema, numberSchema, webNetworkCaptureRecordSchema, webNetworkCaptureDecoderSchema, protobufCaptureCoverageSchema, payloadShape, refineCoverage, webNetworkCapturePayloadSchema, webNetworkCaptureArtifactSchema, artifactShape, webNetworkCaptureSchema, validatedImmutableCaptures, safeParseOwnedWebNetworkCapture;
function init_webNetworkCapture() {
	return (init_webNetworkCapture = __esmMin((() => {
		init_browserDeadline();
		init_jsonValue();
		init_localPath();
		init_protobufWire();
		init_qlogCapture();
		init_immutableJson();
		WEB_NETWORK_CAPTURE_LIMITS = {
			inputBytes: 32 * 1024 * 1024,
			outputBytes: 96 * 1024 * 1024,
			timeoutMs: 3e4,
			depth: 64
		};
		DEFAULT_WEB_NETWORK_CAPTURE_TIMEOUT_MS = WEB_NETWORK_CAPTURE_LIMITS.timeoutMs;
		selectedWebNetworkCaptureTimeoutMs = (selected) => selectedBrowserDeadlineMs(selected, DEFAULT_WEB_NETWORK_CAPTURE_TIMEOUT_MS);
		webNetworkCaptureTimeoutRecovery = (timeoutMs) => ({
			userMessage: `inspect_web_network_capture reached its ${String(timeoutMs)} ms capture deadline (deadlineExpired) for capture_timeout_ms. No partial capture is returned. This is not the MCP client deadline.`,
			remediationAction: `${browserDeadlineIncrease("capture_timeout_ms", timeoutMs, DEFAULT_WEB_NETWORK_CAPTURE_TIMEOUT_MS, "--capture-timeout-ms")} ${browserDeadlineRetry} ${noRuntimeOverrideSentence(`The ${String(WEB_NETWORK_CAPTURE_LIMITS.inputBytes)}-byte input budget, ${String(WEB_NETWORK_CAPTURE_LIMITS.outputBytes)}-byte reply budget, and ${String(WEB_NETWORK_CAPTURE_LIMITS.depth)}-level nesting cap stay fixed.`, "capture_timeout_ms")}`
		});
		WEB_NETWORK_CAPTURE_FORMATS = [
			"har",
			"mitmproxy",
			"saz",
			"qlog"
		];
		inspectWebNetworkCaptureInputSchema = z.strictObject({
			capture_path: absoluteLocalPathStringSchema.describe("Absolute local HAR, mitmproxy, Fiddler SAZ or aioquic qlog capture path."),
			format: z.enum(WEB_NETWORK_CAPTURE_FORMATS),
			record_ordinals: z.array(z.int().nonnegative()).min(1).optional().describe("Zero-based producer record ordinals, in caller-selected order. Omit to inspect every record."),
			protobuf: protobufOptionsSchema.optional(),
			sensitive_values: z.array(z.string().min(1)).default([]).describe("Literal text excluded from capture payloads, byte/numeric projections, producer coordinates, artifact paths/digests and diagnostic text. Declaration strings are never persisted in Evidence parameters. Canonical contract keys, enums and provider identities remain intact."),
			capture_timeout_ms: optionalBrowserDeadlineMs(`Capture wall-clock deadline in milliseconds (default ${String(DEFAULT_WEB_NETWORK_CAPTURE_TIMEOUT_MS)}), from decoder start through process exit. Omitted means ${String(DEFAULT_WEB_NETWORK_CAPTURE_TIMEOUT_MS)} and applies on the next capture. deadlineExpired returns no partial capture. Does not raise the fixed ${String(WEB_NETWORK_CAPTURE_LIMITS.inputBytes)}-byte input budget, ${String(WEB_NETWORK_CAPTURE_LIMITS.outputBytes)}-byte reply budget, or ${String(WEB_NETWORK_CAPTURE_LIMITS.depth)}-level nesting cap. Those have no runtime override.`)
		});
		captureSensitiveValues = (rawInput) => {
			const parsed = inspectWebNetworkCaptureInputSchema.shape.sensitive_values.safeParse(typeof rawInput === "object" && rawInput !== null && "sensitive_values" in rawInput ? rawInput.sensitive_values : undefined);
			return parsed.success ? parsed.data : [];
		};
		pointerSchema = z.string().describe("RFC 6901 pointer in the producer's reported object.");
		redactionSchema = z.union([z.strictObject({
			pointer: pointerSchema,
			reason: z.enum(["transport-credential", "explicit-sensitive-value"])
		}), z.strictObject({
			pointer: pointerSchema,
			reason: z.literal("explicit-sensitive-value"),
			scope: z.literal("property-name").describe("An omitted property name; pointer identifies its actual parent, not an invented child coordinate.")
		})]);
		binaryBase = {
			pointer: pointerSchema,
			representation: z.enum(["producer-bytes", "har-base64-content"])
		};
		retainedBinaryDescriptorSchema = z.strictObject({
			...binaryBase,
			state: z.literal("retained"),
			bytes: z.int().nonnegative(),
			sha256: z.string().regex(/^[0-9a-f]{64}$/)
		});
		redactedBinaryDescriptorSchema = z.strictObject({
			...binaryBase,
			state: z.literal("redacted"),
			bytes: z.null(),
			sha256: z.null()
		});
		webNetworkCaptureBinaryDescriptorSchema = z.discriminatedUnion("state", [retainedBinaryDescriptorSchema, redactedBinaryDescriptorSchema]);
		binarySchema = z.discriminatedUnion("state", [retainedBinaryDescriptorSchema.extend({ content_base64: z.string() }), redactedBinaryDescriptorSchema.extend({ content_base64: z.null() })]);
		numberSchema = z.strictObject({
			pointer: pointerSchema,
			producer_type: z.enum([
				"json-number",
				"integer",
				"float"
			]),
			literal: z.string()
		});
		webNetworkCaptureRecordSchema = z.strictObject({
			ordinal: z.int().nonnegative(),
			location: z.discriminatedUnion("kind", [
				z.strictObject({
					kind: z.literal("unknown"),
					reason: z.literal("explicit-sensitive-value")
				}),
				z.strictObject({
					kind: z.literal("json-pointer"),
					pointer: pointerSchema
				}),
				z.strictObject({
					kind: z.literal("archive-members"),
					members: z.array(z.string()).min(1)
				}),
				z.strictObject({
					kind: z.literal("byte-range"),
					offset: z.int().nonnegative(),
					bytes: z.int().positive()
				})
			]),
			reported: jsonValueSchema,
			binary_fields: z.array(binarySchema),
			numeric_literals: z.array(numberSchema),
			redactions: z.array(redactionSchema),
			limitations: z.array(z.string()),
			protobuf: z.array(protobufDecodingSchema).exactOptional().describe("Flat decoding facts for explicitly selected records. Field indices are local to a body; offset_basis states whether ranges refer to retained or base64-decoded bytes. Interpretations without a caller-supplied schema are candidates.")
		});
		webNetworkCaptureDecoderSchema = z.strictObject({
			id: z.string().min(1),
			name: z.string().min(1),
			version: z.string().min(1)
		});
		protobufCaptureCoverageSchema = z.strictObject({
			status: z.enum(["complete", "partial"]),
			selected_records: z.number().int().nonnegative(),
			inspected_records: z.number().int().nonnegative()
		}).superRefine((coverage, context) => {
			if (coverage.inspected_records > coverage.selected_records || coverage.status === "complete" && coverage.inspected_records !== coverage.selected_records) context.addIssue({
				code: "custom",
				path: ["status"],
				message: "Protobuf coverage contradicts its inspected selection."
			});
		});
		payloadShape = {
			protobuf_coverage: protobufCaptureCoverageSchema.exactOptional(),
			decoder: webNetworkCaptureDecoderSchema,
			container: z.strictObject({
				reported: jsonValueSchema,
				numeric_literals: z.array(numberSchema),
				redactions: z.array(redactionSchema),
				records_pointer: pointerSchema.nullable()
			}),
			total_records: z.int().nonnegative(),
			records: z.array(webNetworkCaptureRecordSchema)
		};
		refineCoverage = (capture, context) => {
			const seen = new Set();
			for (const [index, record] of capture.records.entries()) {
				if (record.ordinal >= capture.total_records || seen.has(record.ordinal)) {
					context.addIssue({
						code: "custom",
						path: [
							"records",
							index,
							"ordinal"
						],
						message: "Retained ordinals must be unique and within the declared capture total."
					});
					return;
				}
				seen.add(record.ordinal);
			}
		};
		webNetworkCapturePayloadSchema = z.union([z.strictObject({
			...payloadShape,
			qlog: qlogCaptureFactsSchema
		}), z.strictObject(payloadShape)]).superRefine(refineCoverage);
		webNetworkCaptureArtifactSchema = z.strictObject({
			path: z.string().describe("Selected artifact path; empty when explicitly excluded from Evidence."),
			sha256: z.string().regex(/^[0-9a-f]{64}$/).nullable().describe("Observed SHA-256; null only when explicitly excluded."),
			bytes: z.int().nonnegative()
		});
		artifactShape = {
			artifact: webNetworkCaptureArtifactSchema,
			runtime_attribution: z.literal("unknown"),
			limitations: z.array(z.string())
		};
		webNetworkCaptureSchema = z.discriminatedUnion("format", [z.strictObject({
			...payloadShape,
			...artifactShape,
			format: z.enum([
				"har",
				"mitmproxy",
				"saz"
			])
		}), z.strictObject({
			...payloadShape,
			...artifactShape,
			format: z.literal("qlog"),
			qlog: qlogCaptureFactsSchema
		})]).superRefine(refineCoverage);
		validatedImmutableCaptures = new WeakSet();
		safeParseOwnedWebNetworkCapture = (input) => {
			if (typeof input === "object" && input !== null && validatedImmutableCaptures.has(input)) return {
				success: true,
				data: input
			};
			const parsed = webNetworkCaptureSchema.safeParse(input);
			if (parsed.success && canBorrowParsedJsonSnapshot(input, parsed.data)) {
				validatedImmutableCaptures.add(input);
				return {
					success: true,
					data: input
				};
			}
			return parsed;
		};
	})))();
}

//#endregion
//#region dist/domain/firmware/espImageStructures.js
var ESP_IMAGE_SEGMENT_HEADER_BYTES, ESP_IMAGE_DIGEST_BYTES, ESP_FLASH_SECTOR_BYTES, ESP_APP_DESC_BYTES, ESP_SIGNATURE_BLOCK_BYTES, ERASED, APP_DESC_MAGIC, BOOTLOADER_DESC_MAGIC, BOOTLOADER_DESC_BYTES, SIGNATURE_MAGIC, SIGNATURE_CRC_OFFSET, u32, u16, hex$1, offsetText, firstUnerased, allZero, UTF8, cStringBytes, cString, ESP_DESCRIPTOR_LIMITATIONS, decodeEspDescriptor, espSignatureSlot, RSA_LAYOUT, ECDSA_LAYOUTS, decodeEspSignatureBlock;
function init_espImageStructures() {
	return (init_espImageStructures = __esmMin((() => {
		ESP_IMAGE_SEGMENT_HEADER_BYTES = 8;
		ESP_IMAGE_DIGEST_BYTES = 32;
		ESP_FLASH_SECTOR_BYTES = 4096;
		ESP_APP_DESC_BYTES = 256;
		ESP_SIGNATURE_BLOCK_BYTES = 1216;
		ERASED = 255;
		APP_DESC_MAGIC = 2882360370;
		BOOTLOADER_DESC_MAGIC = 80;
		BOOTLOADER_DESC_BYTES = 80;
		SIGNATURE_MAGIC = 231;
		SIGNATURE_CRC_OFFSET = 1196;
		u32 = (bytes, at) => ((bytes[at] ?? 0) | (bytes[at + 1] ?? 0) << 8 | (bytes[at + 2] ?? 0) << 16 | (bytes[at + 3] ?? 0) << 24) >>> 0;
		u16 = (bytes, at) => (bytes[at] ?? 0) | (bytes[at + 1] ?? 0) << 8;
		hex$1 = (bytes) => Buffer.from(bytes).toString("hex");
		offsetText = (value) => `0x${value.toString(16)}`;
		firstUnerased = (bytes, offset) => {
			const index = bytes.findIndex((byte) => byte !== ERASED);
			return index < 0 ? undefined : offset + index;
		};
		allZero = (bytes) => bytes.every((byte) => byte === 0);
		UTF8 = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
		cStringBytes = (bytes) => {
			const end = bytes.indexOf(0);
			return end < 0 ? bytes : bytes.subarray(0, end);
		};
		cString = (bytes) => {
			try {
				return UTF8.decode(cStringBytes(bytes));
			} catch {
				return null;
			}
		};
		ESP_DESCRIPTOR_LIMITATIONS = {
			fieldNotUtf8: (field) => `ESP image descriptor field ${field} is not valid UTF-8; its text is unknown.`,
			reservedBytesNotZero: "ESP image segment 0 begins with the bootloader descriptor magic 0x50, but its reserved bytes are not zero; it is not read as an esp_bootloader_desc_t."
		};
		decodeEspDescriptor = (bytes, offset, limitations) => {
			const text = (from, length, field) => {
				const value = cString(bytes.subarray(from, from + length));
				if (value === null) limitations.push(ESP_DESCRIPTOR_LIMITATIONS.fieldNotUtf8(field));
				return value;
			};
			if (bytes.length >= 4 && u32(bytes, 0) === APP_DESC_MAGIC) {
				const held = (end) => bytes.length >= end;
				return {
					kind: "app",
					offset,
					observed_length: Math.min(bytes.length, 256),
					secure_version: held(8) ? u32(bytes, 4) : null,
					version: held(48) ? text(16, 32, "version") : null,
					project_name: held(80) ? text(48, 32, "project_name") : null,
					time: held(96) ? text(80, 16, "time") : null,
					date: held(112) ? text(96, 16, "date") : null,
					idf_ver: held(144) ? text(112, 32, "idf_ver") : null,
					app_elf_sha256: held(176) ? hex$1(bytes.subarray(144, 176)) : null,
					min_efuse_blk_rev_full: held(178) ? u16(bytes, 176) : null,
					max_efuse_blk_rev_full: held(180) ? u16(bytes, 178) : null,
					mmu_page_size: bytes[180] ?? null,
					spi_flash_mode: bytes[181] ?? null
				};
			}
			if (bytes.length < BOOTLOADER_DESC_BYTES || bytes[0] !== BOOTLOADER_DESC_MAGIC) return null;
			if (!allZero(bytes.subarray(1, 3)) || !allZero(bytes.subarray(64, 80))) {
				limitations.push(ESP_DESCRIPTOR_LIMITATIONS.reservedBytesNotZero);
				return null;
			}
			return {
				kind: "bootloader",
				offset,
				secure_version: bytes[3] ?? 0,
				version: u32(bytes, 4),
				idf_ver: text(8, 32, "idf_ver"),
				date_time: text(40, 24, "date_time")
			};
		};
		espSignatureSlot = (slot) => {
			if (slot.length === 1216 && slot[0] === SIGNATURE_MAGIC && crc32(slot.subarray(0, SIGNATURE_CRC_OFFSET)) === u32(slot, SIGNATURE_CRC_OFFSET)) return "block";
			return slot.every((byte) => byte === ERASED) ? "erased" : "other";
		};
		RSA_LAYOUT = {
			digestBytes: 32,
			keyStart: 36,
			keyEnd: 812,
			curveAt: undefined
		};
		ECDSA_LAYOUTS = {
			0: {
				digestBytes: 32,
				keyStart: 36,
				keyEnd: 101,
				curveAt: 36
			},
			1: {
				digestBytes: 48,
				keyStart: 52,
				keyEnd: 149,
				curveAt: 52
			}
		};
		decodeEspSignatureBlock = (block, index, content) => {
			const version = block[1] ?? 0;
			const scheme = version === 2 ? "rsa" : version === 3 ? "ecdsa" : null;
			const shaVersion = scheme === "ecdsa" ? block[2] ?? 0 : null;
			const layout = scheme === "rsa" ? RSA_LAYOUT : shaVersion === null ? undefined : ECDSA_LAYOUTS[shaVersion];
			const unknown = {
				curve_id: null,
				digest_algorithm: null,
				image_digest: null,
				image_digest_matches: null,
				public_key_sha256: null
			};
			if (layout === undefined) return {
				kind: "esp-image-signature-block",
				index,
				version,
				scheme,
				sha_version: shaVersion,
				...unknown,
				signature_status: "unverified"
			};
			const digestAlgorithm = layout.digestBytes === 48 ? "sha384" : "sha256";
			const imageDigest = hex$1(block.subarray(4, 4 + layout.digestBytes));
			const expected = content[digestAlgorithm];
			return {
				kind: "esp-image-signature-block",
				index,
				version,
				scheme,
				sha_version: shaVersion,
				curve_id: layout.curveAt === undefined ? null : block[layout.curveAt] ?? 0,
				digest_algorithm: digestAlgorithm,
				image_digest: imageDigest,
				image_digest_matches: expected === undefined ? null : expected === imageDigest,
				public_key_sha256: createHash("sha256").update(block.subarray(layout.keyStart, layout.keyEnd)).digest("hex"),
				signature_status: "unverified"
			};
		};
	})))();
}

//#endregion
//#region dist/domain/artifactInspection.js
var textSchema, evidenceIdSchema, artifactIdSchema, inspectionObservationSchema, inspectionHypothesisSchema, inspectionContradictionBaseSchema, inspectionContradictionSchema, nextProbeSchema, unexploredBranchSchema, artifactInspectionResultSchema, createArtifactInspection, parseInventoryEvidence, allObservations, observation, allHypotheses, contradictions, probesFor, espFlashDumpProbes, fitProbes, DIRECTORY_MEMBER_FORMATS, directoryProbes, probesForFormat, allUnexploredBranches, branch, inspectionCoverage, artifactInspectionSources, readArtifactInspectionSources;
function init_artifactInspection() {
	return (init_artifactInspection = __esmMin((() => {
		init_evidenceValidation();
		init_result();
		init_immutableJson();
		init_artifactIntegrity();
		init_artifactGraph();
		init_canonicalDigest();
		init_javascriptArtifactFiles();
		init_rawBinary();
		init_canonicalOrdering();
		init_evidence();
		init_espImageStructures();
		init_jsonValue();
		init_digests();
		textSchema = z.string().min(1);
		evidenceIdSchema = prefixedDigestSchema("ev");
		artifactIdSchema = prefixedDigestSchema("art");
		inspectionObservationSchema = z.strictObject({
			observation_id: prefixedDigestSchema("aio"),
			kind: z.enum([
				"root-manifest",
				"integrity",
				"container-header",
				"reconstruction"
			]),
			subject: textSchema,
			value: jsonValueSchema,
			evidence_id: evidenceIdSchema
		});
		inspectionHypothesisSchema = z.strictObject({
			hypothesis_id: prefixedDigestSchema("aih"),
			statement: textSchema,
			confidence: z.enum(["medium", "low"]),
			basis_evidence_ids: z.array(evidenceIdSchema).min(1),
			limitation: textSchema
		});
		inspectionContradictionBaseSchema = z.strictObject({
			contradiction_id: prefixedDigestSchema("aic"),
			statement: textSchema,
			occurrence_id: prefixedDigestSchema("occ"),
			evidence_id: evidenceIdSchema
		});
		inspectionContradictionSchema = z.union([
			inspectionContradictionBaseSchema.extend(artifactSha256PairSchema.shape),
			inspectionContradictionBaseSchema.extend(artifactMd5PairSchema.shape),
			inspectionContradictionBaseSchema.extend(artifactDfuCrc32PairSchema.shape)
		]);
		nextProbeSchema = z.strictObject({
			operation: textSchema,
			rationale: textSchema,
			authority: z.enum([
				"artifact-bytes",
				"managed-static-analysis",
				"native-analysis-provider",
				"ast-static-analysis"
			])
		});
		unexploredBranchSchema = z.strictObject({
			branch_id: prefixedDigestSchema("aib"),
			reason: z.enum(["format-specific-analysis-required", "unknown-format"]),
			detail: textSchema,
			next_probe: nextProbeSchema.nullable(),
			evidence_id: evidenceIdSchema
		});
		artifactInspectionResultSchema = z.strictObject({
			inspection_id: prefixedDigestSchema("ai"),
			subject: z.strictObject({
				manifest_id: prefixedDigestSchema("agm"),
				root_artifact_id: artifactIdSchema,
				root_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				root_format: textSchema
			}),
			substeps: z.array(z.strictObject({
				substep_id: prefixedDigestSchema("ais"),
				operation: z.literal("inventory_artifact"),
				status: z.literal("completed"),
				evidence_id: evidenceIdSchema,
				evidence: evidenceSchema.safeExtend({
					operation: z.literal("inventory_artifact"),
					normalized_result: artifactInventoryResultSchema
				})
			})).min(1),
			observations: z.array(inspectionObservationSchema),
			hypotheses: z.array(inspectionHypothesisSchema),
			contradictions: z.array(inspectionContradictionSchema),
			unexplored_branches: z.array(unexploredBranchSchema),
			next_probes: z.array(nextProbeSchema),
			coverage: z.strictObject({
				status: z.enum([
					"complete-within-substeps",
					"partial",
					"truncated"
				]),
				substeps_completed: z.int().min(1),
				observations_retained: z.int().min(0),
				observations_omitted: z.int().min(0),
				hypotheses_retained: z.int().min(0),
				hypotheses_omitted: z.int().min(0),
				unexplored_branches_retained: z.int().min(0),
				unexplored_branches_omitted: z.int().min(0),
				next_probes_retained: z.int().min(0),
				next_probes_omitted: z.int().min(0)
			}),
			evidence_links: z.array(evidenceIdSchema).min(1),
			limitations: z.array(textSchema)
		});
		createArtifactInspection = (inventoryInput) => {
			const inventoryEvidence = parseInventoryEvidence(inventoryInput);
			const inventory = artifactInventoryResultSchema.parse(inventoryEvidence.normalized_result);
			const observations = allObservations(inventory, inventoryEvidence.evidence_id);
			const hypotheses = allHypotheses(inventory, inventoryEvidence.evidence_id);
			const nextProbes = probesFor(inventory);
			const branches = allUnexploredBranches(inventory, inventoryEvidence.evidence_id, nextProbes);
			const retained = {
				observations,
				hypotheses,
				branches,
				probes: nextProbes
			};
			const omissions = {
				observations: 0,
				hypotheses: 0,
				branches: 0,
				probes: 0
			};
			const semantic = {
				subject: {
					manifest_id: inventory.manifest.manifest_id,
					root_artifact_id: inventory.manifest.root_artifact_id,
					root_sha256: inventory.manifest.root_sha256,
					root_format: inventory.manifest.root_format
				},
				substeps: [{
					substep_id: `ais_${digestCanonicalValue({
						operation: "inventory_artifact",
						evidence_id: inventoryEvidence.evidence_id
					}, "Artifact inspection")}`,
					operation: "inventory_artifact",
					status: "completed",
					evidence_id: inventoryEvidence.evidence_id,
					evidence: inventoryEvidence
				}],
				observations: retained.observations,
				hypotheses: retained.hypotheses,
				contradictions: contradictions(inventory, inventoryEvidence.evidence_id),
				unexplored_branches: retained.branches,
				next_probes: retained.probes,
				coverage: {
					status: inspectionCoverage(inventory, omissions),
					substeps_completed: 1,
					observations_retained: retained.observations.length,
					observations_omitted: omissions.observations,
					hypotheses_retained: retained.hypotheses.length,
					hypotheses_omitted: omissions.hypotheses,
					unexplored_branches_retained: retained.branches.length,
					unexplored_branches_omitted: omissions.branches,
					next_probes_retained: retained.probes.length,
					next_probes_omitted: omissions.probes
				},
				evidence_links: [inventoryEvidence.evidence_id],
				limitations: uniqueSorted$1([...inventory.limitations, "Inspection derives bounded static hypotheses and next probes; it does not execute the artifact or claim format-specific semantics."])
			};
			return artifactInspectionResultSchema.parse({
				...semantic,
				inspection_id: `ai_${digestCanonicalValue(semantic, "Artifact inspection")}`
			});
		};
		parseInventoryEvidence = (input) => {
			const evidence = parseEvidence(input);
			if (evidence.operation !== "inventory_artifact") throw new TypeError("Artifact inspection substep requires inventory_artifact Evidence");
			return evidence;
		};
		allObservations = (inventory, evidenceId) => [
			observation("root-manifest", inventory.manifest.root_artifact_id, inventory.manifest, evidenceId),
			...inventory.integrity_contradictions.map((value) => observation("integrity", value.contradiction_id, value, evidenceId)),
			...inventory.ines === undefined ? [] : [observation("container-header", inventory.manifest.root_artifact_id, inventory.ines.header, evidenceId), observation("reconstruction", inventory.manifest.root_artifact_id, inventory.ines.reconstruction, evidenceId)]
		];
		observation = (kind, subject, value, evidenceId) => {
			const semantic = {
				kind,
				subject,
				value: jsonValueSchema.parse(value),
				evidence_id: evidenceId
			};
			return {
				observation_id: `aio_${digestCanonicalValue(semantic, "Artifact inspection")}`,
				...semantic
			};
		};
		allHypotheses = (inventory, evidenceId) => {
			const statements = inventory.manifest.root_format === "pe" ? ["The PE artifact may contain managed CLI metadata or native code; inventory bytes alone do not distinguish them."] : ["asar", "javascript-bundle"].includes(inventory.manifest.root_format) ? ["The artifact may contain a recoverable JavaScript application graph."] : [];
			return statements.map((statement) => {
				const semantic = {
					statement,
					confidence: "low",
					basis_evidence_ids: [evidenceId],
					limitation: "Format classification proposes a bounded follow-up; it is not semantic proof."
				};
				return {
					hypothesis_id: `aih_${digestCanonicalValue(semantic, "Artifact inspection")}`,
					...semantic
				};
			});
		};
		contradictions = (inventory, evidenceId) => inventory.integrity_contradictions.map((value) => {
			const semantic = {
				statement: value.logical_path === "." ? "The container's declared integrity contradicts its observed bytes." : `Declared integrity for ${value.logical_path} contradicts observed bytes.`,
				occurrence_id: value.occurrence_id,
				...artifactIntegrityPairOf(value),
				evidence_id: evidenceId
			};
			return {
				contradiction_id: `aic_${digestCanonicalValue(semantic, "Artifact inspection")}`,
				...semantic
			};
		});
		probesFor = (inventory) => {
			const format = inventory.manifest.root_format;
			if (format === "node-sea") return inventory.occurrences.some((row) => row.format_metadata?.kind === "node-sea-entry" && row.format_metadata.role === "main-script" && isJavaScriptSourcePath(row.logical_path)) ? [{
				operation: "analyze_javascript_application",
				rationale: "Extract the SEA main script with extract_artifact, then analyze the extracted JavaScript application.",
				authority: "ast-static-analysis"
			}] : [];
			if (format === "intel-hex" || format === "srec" || format === "uf2" || format === "dfuse") return inventory.occurrences.some((row) => row.format_metadata?.kind === "hex-record-region" || row.format_metadata?.kind === "uf2-region" || row.format_metadata?.kind === "dfuse-element") ? [{
				operation: "open_binary",
				rationale: "Extract regions with extract_artifact, then open one with format raw-binary, a caller-chosen architecture, and entry_point set to the region start address (raw-binary maps file offset 0 at entry_point).",
				authority: "native-analysis-provider"
			}] : [];
			if (format === "esp-image") return espFlashDumpProbes(inventory);
			if (format === "fit") return fitProbes(inventory);
			return format === "directory" ? directoryProbes(inventory) : probesForFormat(format);
		};
		espFlashDumpProbes = (inventory) => {
			const root = inventory.occurrences.find(({ logical_path }) => logical_path === ".")?.format_metadata;
			if (root?.kind !== "esp-image") return [];
			const dump = root.flash_dump;
			if (dump === null || dump === undefined) return [];
			const offset = offsetText(dump.flash_offset);
			return [{
				operation: "open_binary",
				rationale: `Reopen the file with format esp-flash-image and flash_offset ${offset}, then inspect_artifact: it is a flash dump read from flash ${offset}, with a partition table at file offset ${offsetText(dump.table_file_offset)}.`,
				authority: "artifact-bytes"
			}];
		};
		fitProbes = (inventory) => {
			const images = inventory.occurrences.flatMap((row) => row.format_metadata?.kind === "fit-image" && row.format_metadata.compression === "none" && row.format_metadata.cipher_present === false ? [{
				row,
				image: row.format_metadata
			}] : []);
			let rawProbe;
			for (const { row, image } of images) {
				if (row.declared_size === null) continue;
				if (image.entry !== null && image.entry !== image.load) continue;
				if (image.unreadable_fields.includes("entry")) continue;
				const admitted = admitRawBinary({
					architecture: image.arch,
					entryPoint: image.load,
					fileBytes: row.declared_size
				});
				if (!admitted.ok) continue;
				rawProbe = {
					operation: "open_binary",
					rationale: `Extract ${JSON.stringify(row.logical_path)} with extract_artifact, then open those uncompressed, unciphered bytes with format raw-binary, architecture ${admitted.value.architecture} and entry_point ${admitted.value.entryPoint}. This maps offset 0 and seeds analysis at that address; the declared entry is absent or equal to load.`,
					authority: "native-analysis-provider"
				};
				break;
			}
			return [...images.some(({ image }) => image.type === "flat_dt") ? [{
				operation: "inspect_devicetree",
				rationale: "Extract images with extract_artifact, then inspect uncompressed, unciphered flat_dt images with inspect_devicetree.",
				authority: "artifact-bytes"
			}] : [], ...rawProbe === undefined ? [] : [rawProbe]];
		};
		DIRECTORY_MEMBER_FORMATS = [
			"asar",
			"javascript-bundle",
			"mach-o-universal",
			"mach-o",
			"elf",
			"pe",
			"plist"
		];
		directoryProbes = (inventory) => {
			const present = new Set(inventory.occurrences.filter(({ entry_kind, artifact_format }) => entry_kind !== "symlink" || artifact_format !== "javascript-bundle").map(({ artifact_format }) => artifact_format));
			const members = DIRECTORY_MEMBER_FORMATS.filter((memberFormat) => present.has(memberFormat));
			const probes = members.flatMap(probesForFormat);
			return probes.filter((probe, index) => probes.findIndex(({ operation }) => operation === probe.operation) === index);
		};
		probesForFormat = (format) => {
			if (format === "bun-standalone") return [{
				operation: "extract_artifact",
				authority: "artifact-bytes",
				rationale: "Extract the stored module regions into a fresh owned directory, then inspect compatible source separately. Bytecode and source-map regions remain stored evidence; they are not decoded or executed."
			}];
			if (format === "dotnet-bundle") return [{
				operation: "extract_artifact",
				rationale: "Extract members into a fresh owned directory, then inspect candidate files separately; bundle declarations do not establish their format.",
				authority: "artifact-bytes"
			}];
			if (["asar", "javascript-bundle"].includes(format)) return [{
				operation: "analyze_javascript_application",
				rationale: "Recover bounded JavaScript modules, source maps, Electron boundaries, and application relationships.",
				authority: "ast-static-analysis"
			}];
			if (format === "pe") return [{
				operation: "inspect_managed_artifact",
				rationale: "Check execution-free CLI metadata before choosing a deep native provider.",
				authority: "managed-static-analysis"
			}, {
				operation: "open_binary",
				rationale: "Open as native code only when managed inspection reports a native or mixed boundary.",
				authority: "native-analysis-provider"
			}];
			if ([
				"mach-o",
				"mach-o-universal",
				"elf"
			].includes(format)) return [{
				operation: "open_binary",
				rationale: "Bind one deep native provider before function-level analysis.",
				authority: "native-analysis-provider"
			}];
			if (format === "plist") return [{
				operation: "inspect_plist",
				rationale: "Parse property-list values without executing the artifact.",
				authority: "artifact-bytes"
			}];
			return [];
		};
		allUnexploredBranches = (inventory, evidenceId, nextProbes) => {
			const branches = [];
			branches.push(...nextProbes.map((probe) => branch("format-specific-analysis-required", `${probe.operation} was not run by provider-neutral artifact inspection.`, probe, evidenceId)));
			if (inventory.manifest.root_format === "unknown") branches.push(branch("unknown-format", "Artifact bytes did not match an admitted format classifier.", null, evidenceId));
			return branches;
		};
		branch = (reason, detail, nextProbe, evidenceId) => {
			const semantic = {
				reason,
				detail,
				next_probe: nextProbe,
				evidence_id: evidenceId
			};
			return {
				branch_id: `aib_${digestCanonicalValue(semantic, "Artifact inspection")}`,
				...semantic
			};
		};
		inspectionCoverage = (inventory, omissions) => {
			if (Object.values(omissions).some((count) => count > 0)) return "truncated";
			if (inventory.coverage.status !== "complete") return "partial";
			return "complete-within-substeps";
		};
		artifactInspectionSources = (inspection) => {
			const substeps = immutableJsonSnapshotMember(inspection, "substeps");
			return Object.freeze(inspection.substeps.map((step, index) => {
				const ownedStep = immutableJsonSnapshotMember(substeps, String(index));
				immutableJsonSnapshotMember(ownedStep, "evidence");
				return step.evidence;
			}));
		};
		readArtifactInspectionSources = (result) => {
			const parsed = readEvidencePayload(artifactInspectionResultSchema, result);
			if (!parsed.ok) return parsed;
			const inspection = canBorrowParsedJsonSnapshot(result, parsed.value) ? result : parsed.value;
			return ok(artifactInspectionSources(inspection));
		};
	})))();
}

//#endregion
//#region dist/domain/artifactIdentity.js
var logicalPathNfc, normalizeJoinedLogicalPath, logicalPathEscapesRoot, artifactIdForContent, occurrenceIdForLocation, artifactGraphDigest, artifactManifestId, artifactContradictionId, artifactEdgeId;
function init_artifactIdentity() {
	return (init_artifactIdentity = __esmMin((() => {
		init_artifactIntegrity();
		init_canonicalDigest();
		logicalPathNfc = (value) => value.normalize("NFC");
		normalizeJoinedLogicalPath = (value) => {
			if (value.includes("\0")) return value;
			return logicalPathNfc(posix.normalize(value).replace(/^\.\//u, ""));
		};
		logicalPathEscapesRoot = (path) => path.includes("\0") || path === ".." || path.startsWith("../") || path.startsWith("/");
		artifactIdForContent = (sha256) => `art_${digestCanonicalValue({ sha256 }, "Artifact")}`;
		occurrenceIdForLocation = (input) => input.logicalPath === "." ? `occ_${digestCanonicalValue({ root: input.rootArtifactId }, "Artifact")}` : `occ_${digestCanonicalValue({
			root_artifact_id: input.rootArtifactId,
			logical_path: input.logicalPath,
			entry_kind: input.entryKind,
			...input.duplicateOrdinal === undefined ? {} : { duplicate_ordinal: input.duplicateOrdinal }
		}, "Artifact")}`;
		artifactGraphDigest = (input) => digestCanonicalValue({
			nodes: input.nodes,
			occurrences: input.occurrences,
			edges: input.edges,
			integrity_contradictions: input.contradictions
		}, "Artifact");
		artifactManifestId = (rootArtifactId, graphSha256) => `agm_${digestCanonicalValue({
			root_artifact_id: rootArtifactId,
			graph_sha256: graphSha256
		}, "Artifact")}`;
		artifactContradictionId = (input) => `ic_${digestCanonicalValue({
			root_artifact_id: input.rootArtifactId,
			logical_path: input.logicalPath,
			...artifactIntegrityPairOf(input.integrity)
		}, "Artifact")}`;
		artifactEdgeId = (edge, occurrence) => `edge_${digestCanonicalValue({
			parent_artifact_id: edge.parent_artifact_id,
			child_artifact_id: occurrence.artifact_id,
			relation: edge.relation,
			occurrence_id: edge.occurrence_id,
			logical_path: occurrence.logical_path
		}, "Artifact")}`;
	})))();
}

//#endregion
//#region dist/domain/artifactInventoryEvidence.js
var hasCompleteInventoryCoverage, ArtifactInventoryValidationError, ArtifactInventoryCompositionError, ArtifactInventoryCarrierError, parseArtifactInventoryEvidence, parseInspectionEvidencePayload, parseArtifactInspectionInventoryResult, parseInspectionInventoryPayload, validateInspectionSubject, parseArtifactInventoryResult, parseInventoryPage, parseInventoryEvidencePage, subjectMatchesInventoryRoot, validateArtifactInventorySubject, validateInventoryPage, assembleInventoryResults, orderedInventory, orderOccurrences, validateCompleteInventory, validateOccurrence, validateEdge, mergeExact, assertUnique;
function init_artifactInventoryEvidence() {
	return (init_artifactInventoryEvidence = __esmMin((() => {
		init_immutableJson();
		init_artifactGraph();
		init_unicodeCodePointOrder();
		init_comparisonSemantics();
		init_artifactIdentity();
		init_evidenceErrors();
		init_evidenceValidation();
		init_artifactInspection();
		hasCompleteInventoryCoverage = (inventory, requiredScope) => inventory.complete && inventory.coverage.scope === requiredScope && inventory.coverage.status === "complete";
		ArtifactInventoryValidationError = class extends TypeError {
			constructor(message, options) {
				super(message, options);
				this.name = "ArtifactInventoryValidationError";
			}
		};
		ArtifactInventoryCompositionError = class extends ArtifactInventoryValidationError {};
		ArtifactInventoryCarrierError = class extends Error {
			index;
			constructor(message, index = undefined, options) {
				super(message, options);
				this.index = index;
				this.name = "ArtifactInventoryCarrierError";
			}
		};
		parseArtifactInventoryEvidence = (input) => {
			const carriers = Array.isArray(input) ? input : [input];
			if (carriers.length === 0) throw new ArtifactInventoryCarrierError("Artifact inventory requires at least one Evidence carrier");
			const evidence = carriers.map((carrier) => {
				const parsed = readEvidence(carrier);
				if (!parsed.ok) throw parsed.error;
				return parsed.value;
			});
			try {
				const pageGroups = evidence.map((carrier, index) => {
					if (carrier.operation === "inventory_artifact") return [parseInventoryEvidencePage(carrier)];
					if (carrier.operation !== "inspect_artifact") throw new ArtifactInventoryCarrierError("Artifact inventory requires inventory_artifact or inspect_artifact Evidence", index);
					return parseInspectionEvidencePayload(carrier.normalized_result, carrier.subject);
				});
				for (const pages of pageGroups) if (pages.length > 1) assembleInventoryResults(pages);
				try {
					return {
						evidence,
						inventory: assembleInventoryResults(pageGroups.flat())
					};
				} catch (cause) {
					if (!(cause instanceof ArtifactInventoryCompositionError)) throw cause;
					if (pageGroups.length === 1) throw cause;
					throw new ArtifactInventoryCarrierError(cause.message, undefined, { cause });
				}
			} catch (cause) {
				if (cause instanceof ArtifactInventoryCarrierError) throw cause;
				if (!(cause instanceof ArtifactInventoryValidationError)) throw cause;
				throw new EvidenceIntegrityError(cause.message, {
					cause,
					userMessage: cause.message
				});
			}
		};
		parseInspectionEvidencePayload = (input, subject) => {
			try {
				return parseInspectionInventoryPayload(input, subject).pages;
			} catch (cause) {
				if (!(cause instanceof z.ZodError)) throw cause;
				throw new ArtifactInventoryValidationError(cause.message, { cause });
			}
		};
		parseArtifactInspectionInventoryResult = (input, subject) => {
			const parsed = parseInspectionInventoryPayload(input, subject);
			return {
				inspection: parsed.inspection,
				inventory: assembleInventoryResults(parsed.pages),
				evidenceIds: parsed.evidenceIds
			};
		};
		parseInspectionInventoryPayload = (input, subject) => {
			const parsedInspection = artifactInspectionResultSchema.parse(input);
			const inspection = canBorrowParsedJsonSnapshot(input, parsedInspection) ? input : isImmutableJsonSnapshot(input) ? freezeJsonSnapshot(parsedInspection) : parsedInspection;
			const sealedSubsteps = immutableJsonSnapshotMember(inspection, "substeps");
			if (inspection.coverage.substeps_completed !== inspection.substeps.length) throw new ArtifactInventoryValidationError("Artifact inspection substep count does not match its coverage declaration");
			const substeps = inspection.substeps.map((step, index) => {
				const sealedStep = immutableJsonSnapshotMember(sealedSubsteps, String(index));
				const sourceEvidence = immutableJsonSnapshotMember(sealedStep, "evidence") ?? step.evidence;
				const parsedEvidence = safeParseEvidence(sourceEvidence);
				if (!parsedEvidence.ok) throw Object.assign(new z.ZodError(parsedEvidence.error.issues.map((issue) => ({
					...issue,
					path: [
						"substeps",
						index,
						"evidence",
						...issue.path
					]
				}))), { cause: parsedEvidence.error });
				const evidence = canBorrowParsedJsonSnapshot(sourceEvidence, parsedEvidence.value) ? sourceEvidence : parsedEvidence.value;
				immutableJsonSnapshotMember(evidence, "normalized_result");
				if (step.evidence_id !== evidence.evidence_id) throw new ArtifactInventoryValidationError("Artifact inspection substep evidence ID does not match nested Evidence");
				return {
					evidenceId: evidence.evidence_id,
					page: parseInventoryEvidencePage(evidence)
				};
			});
			const firstPage = substeps[0]?.page;
			if (firstPage === undefined) throw new ArtifactInventoryValidationError("Artifact inspection requires inventory substeps");
			validateInspectionSubject(subject, inspection, firstPage.manifest);
			return {
				inspection,
				pages: substeps.map(({ page }) => page),
				evidenceIds: substeps.map(({ evidenceId }) => evidenceId)
			};
		};
		validateInspectionSubject = (subject, inspection, manifest) => {
			if (inspection.subject.manifest_id !== manifest.manifest_id || inspection.subject.root_artifact_id !== manifest.root_artifact_id || inspection.subject.root_sha256 !== manifest.root_sha256 || inspection.subject.root_format !== manifest.root_format) throw new ArtifactInventoryValidationError("Artifact inspection subject does not match its inventory manifest");
			if (!subjectMatchesInventoryRoot(subject, manifest)) throw new ArtifactInventoryValidationError("Artifact inspection Evidence subject does not match its root manifest");
		};
		parseArtifactInventoryResult = (input, subject) => assembleInventoryResults([parseInventoryPage(input, subject)]);
		parseInventoryPage = (input, subject) => {
			const parsed = artifactInventoryResultSchema.parse(input);
			const inventory = canBorrowParsedJsonSnapshot(input, parsed) ? input : isImmutableJsonSnapshot(input) ? freezeJsonSnapshot(parsed) : parsed;
			validateArtifactInventorySubject(subject, inventory.manifest);
			validateInventoryPage(inventory);
			return inventory;
		};
		parseInventoryEvidencePage = (evidence) => {
			if (evidence.operation !== "inventory_artifact") throw new ArtifactInventoryValidationError("Artifact inventory page must be inventory_artifact Evidence");
			try {
				return parseInventoryPage(evidence.normalized_result, evidence.subject);
			} catch (cause) {
				if (!(cause instanceof z.ZodError)) throw cause;
				throw new ArtifactInventoryValidationError(cause.message, { cause });
			}
		};
		subjectMatchesInventoryRoot = (subject, manifest) => subject !== null && subject.digest.sha256 === manifest.root_sha256 && subject.format === manifest.root_format;
		validateArtifactInventorySubject = (subject, manifest) => {
			if (!subjectMatchesInventoryRoot(subject, manifest)) throw new ArtifactInventoryValidationError("Artifact inventory Evidence subject does not match its root digest");
		};
		validateInventoryPage = (inventory) => {
			const manifest = inventory.manifest;
			if (manifest.root_artifact_id !== artifactIdForContent(manifest.root_sha256)) throw new ArtifactInventoryValidationError("Artifact root identity does not match its manifest digest");
			if (manifest.manifest_id !== artifactManifestId(manifest.root_artifact_id, manifest.graph_sha256)) throw new ArtifactInventoryValidationError("Artifact manifest ID does not match its commitment");
			for (const occurrence of inventory.occurrences) {
				if (occurrence.logical_path !== ".") continue;
				if (occurrence.artifact_id !== manifest.root_artifact_id || occurrence.artifact_format !== manifest.root_format || occurrence.parent_occurrence_id !== null || occurrence.entry_kind !== (manifest.root_format === "directory" ? "directory" : "file")) throw new ArtifactInventoryValidationError("Artifact root occurrence does not match its manifest representation");
				if (occurrence.occurrence_id !== occurrenceIdForLocation({
					rootArtifactId: manifest.root_artifact_id,
					logicalPath: ".",
					entryKind: occurrence.entry_kind
				})) throw new ArtifactInventoryValidationError("Artifact occurrence ID does not match its identity");
			}
			assertUnique(inventory.nodes.map(({ artifact_id: id }) => id), "node ID");
			assertUnique(inventory.occurrences.map(({ occurrence_id: id }) => id), "occurrence ID");
			assertUnique(inventory.edges.map(({ edge_id: id }) => id), "edge ID");
			for (const node of inventory.nodes) if (node.artifact_id !== artifactIdForContent(node.sha256)) throw new ArtifactInventoryValidationError("Artifact node ID is not content-addressed");
		};
		assembleInventoryResults = (pages) => {
			const first = pages[0];
			if (first === undefined) throw new ArtifactInventoryValidationError("Artifact inventory requires Evidence pages");
			const manifestJson = canonicalJson(first.manifest, "Artifact inventory");
			const coverageJson = canonicalJson(first.coverage, "Artifact inventory coverage");
			const nodes = new Map();
			const occurrences = new Map();
			const edges = new Map();
			for (const page of pages) {
				if (canonicalJson(page.manifest, "Artifact inventory") !== manifestJson) throw new ArtifactInventoryCompositionError("Artifact inventory pages do not share one manifest");
				if (canonicalJson(page.coverage, "Artifact inventory coverage") !== coverageJson) throw new ArtifactInventoryCompositionError("Artifact inventory pages do not share one coverage declaration");
				if (canonicalJson(page.integrity_contradictions, "Artifact inventory") !== canonicalJson(first.integrity_contradictions, "Artifact inventory")) throw new ArtifactInventoryCompositionError("Artifact inventory pages do not share integrity contradictions");
				for (const node of page.nodes) mergeExact(nodes, node.artifact_id, node, "node");
				for (const occurrence of page.occurrences) {
					mergeExact(occurrences, occurrence.occurrence_id, occurrence, "occurrence");
				}
				for (const edge of page.edges) mergeExact(edges, edge.edge_id, edge, "edge");
			}
			const inventory = orderedInventory(first, pages, {
				nodes,
				occurrences,
				edges
			});
			if (inventory.nodes.length > inventory.manifest.node_count || inventory.occurrences.length > inventory.manifest.occurrence_count || inventory.edges.length > inventory.manifest.edge_count) throw new ArtifactInventoryValidationError("Artifact inventory members exceed their manifest counts");
			const occurrencesById = new Map(inventory.occurrences.map((occurrence) => [occurrence.occurrence_id, occurrence]));
			for (const edge of inventory.edges) {
				const occurrence = occurrencesById.get(edge.occurrence_id);
				if (occurrence === undefined) continue;
				if (occurrence.artifact_id === null) throw new ArtifactInventoryValidationError("Artifact edge references a missing graph member");
				if (edge.edge_id !== artifactEdgeId(edge, occurrence)) throw new ArtifactInventoryValidationError("Artifact edge ID does not match its identity");
			}
			if (inventory.complete) validateCompleteInventory(inventory);
			return inventory;
		};
		orderedInventory = (first, pages, values) => {
			const nodes = [...values.nodes.values()].sort((left, right) => compareUnicodeCodePoints(left.artifact_id, right.artifact_id));
			const occurrences = orderOccurrences(first.manifest.root_artifact_id, [...values.occurrences.values()]);
			const edges = [...values.edges.values()].sort((left, right) => compareUnicodeCodePoints(left.edge_id, right.edge_id));
			const limitations = [...new Set(pages.flatMap((inventory) => inventory.limitations))].sort(compareUnicodeCodePoints);
			return {
				manifest: first.manifest,
				nodes,
				occurrences,
				edges,
				integrityContradictions: first.integrity_contradictions,
				limitations,
				coverage: first.coverage,
				complete: nodes.length === first.manifest.node_count && occurrences.length === first.manifest.occurrence_count && edges.length === first.manifest.edge_count
			};
		};
		orderOccurrences = (rootArtifactId, occurrences) => {
			const groups = new Map();
			for (const occurrence of occurrences) {
				const group = groups.get(occurrence.logical_path);
				if (group === undefined) groups.set(occurrence.logical_path, [occurrence]);
				else group.push(occurrence);
			}
			return [...groups].sort(([left], [right]) => compareUnicodeCodePoints(left, right)).flatMap(([path, group]) => {
				if (group.length < 2) return group;
				const ordinalById = new Map();
				const kinds = new Set(group.map(({ entry_kind }) => entry_kind));
				for (let ordinal = 0; ordinal < group.length; ordinal++) {
					for (const entryKind of kinds) ordinalById.set(occurrenceIdForLocation({
						rootArtifactId,
						logicalPath: path,
						entryKind,
						...ordinal === 0 ? {} : { duplicateOrdinal: ordinal }
					}), ordinal);
				}
				return group.sort((left, right) => (ordinalById.get(left.occurrence_id) ?? Number.MAX_SAFE_INTEGER) - (ordinalById.get(right.occurrence_id) ?? Number.MAX_SAFE_INTEGER) || compareUnicodeCodePoints(left.occurrence_id, right.occurrence_id));
			});
		};
		validateCompleteInventory = (inventory) => {
			const nodeIds = new Set(inventory.nodes.map(({ artifact_id: id }) => id));
			const occurrenceIds = new Set(inventory.occurrences.map(({ occurrence_id: id }) => id));
			const rootNode = inventory.nodes.find(({ artifact_id: id }) => id === inventory.manifest.root_artifact_id);
			if (rootNode?.sha256 !== inventory.manifest.root_sha256) throw new ArtifactInventoryValidationError("Artifact root node does not match its manifest digest");
			const rootOccurrence = inventory.occurrences.find(({ logical_path }) => logical_path === ".");
			if (rootOccurrence === undefined) throw new ArtifactInventoryValidationError("Artifact root occurrence does not match its manifest representation");
			const duplicateOrdinalByPath = new Map();
			for (const occurrence of inventory.occurrences) {
				const ordinal = duplicateOrdinalByPath.get(occurrence.logical_path) ?? 0;
				duplicateOrdinalByPath.set(occurrence.logical_path, ordinal + 1);
				validateOccurrence(occurrence, inventory, nodeIds, occurrenceIds, ordinal);
			}
			const occurrencesById = new Map(inventory.occurrences.map((occurrence) => [occurrence.occurrence_id, occurrence]));
			for (const edge of inventory.edges) validateEdge(edge, nodeIds, occurrencesById);
			for (const contradiction of inventory.integrityContradictions) {
				if (!nodeIds.has(contradiction.parent_artifact_id) || !occurrenceIds.has(contradiction.occurrence_id)) throw new ArtifactInventoryValidationError("Integrity contradiction references a missing graph member");
				const expectedId = artifactContradictionId({
					rootArtifactId: inventory.manifest.root_artifact_id,
					logicalPath: contradiction.logical_path,
					integrity: contradiction
				});
				if (contradiction.contradiction_id !== expectedId) throw new ArtifactInventoryValidationError("Integrity contradiction ID does not match its identity");
			}
			const graphSha256 = artifactGraphDigest({
				nodes: inventory.nodes,
				occurrences: inventory.occurrences,
				edges: inventory.edges,
				contradictions: inventory.integrityContradictions
			});
			if (graphSha256 !== inventory.manifest.graph_sha256) throw new ArtifactInventoryValidationError("Artifact graph commitment does not match its members");
		};
		validateOccurrence = (occurrence, inventory, nodeIds, occurrenceIds, duplicateOrdinal) => {
			if (occurrence.artifact_id !== null && !nodeIds.has(occurrence.artifact_id)) throw new ArtifactInventoryValidationError("Artifact occurrence references a missing node");
			if (occurrence.parent_occurrence_id !== null && !occurrenceIds.has(occurrence.parent_occurrence_id)) throw new ArtifactInventoryValidationError("Artifact occurrence references a missing parent");
			const expectedId = occurrenceIdForLocation({
				rootArtifactId: inventory.manifest.root_artifact_id,
				logicalPath: occurrence.logical_path,
				entryKind: occurrence.entry_kind,
				...duplicateOrdinal === 0 ? {} : { duplicateOrdinal }
			});
			if (occurrence.occurrence_id !== expectedId) throw new ArtifactInventoryValidationError("Artifact occurrence ID does not match its identity");
		};
		validateEdge = (edge, nodeIds, occurrences) => {
			const occurrence = occurrences.get(edge.occurrence_id);
			if (!nodeIds.has(edge.parent_artifact_id) || occurrence?.artifact_id === null || occurrence === undefined || !nodeIds.has(occurrence.artifact_id)) throw new ArtifactInventoryValidationError("Artifact edge references a missing graph member");
		};
		mergeExact = (output, key, value, label) => {
			const previous = output.get(key);
			if (previous !== undefined && canonicalJson(previous, "Artifact inventory") !== canonicalJson(value, "Artifact inventory")) throw new ArtifactInventoryCompositionError(`Artifact inventory has conflicting ${label} pages`);
			output.set(key, value);
		};
		assertUnique = (values, label) => {
			if (new Set(values).size !== values.length) throw new ArtifactInventoryValidationError(`Artifact inventory contains a duplicate ${label}`);
		};
	})))();
}

//#endregion
//#region dist/domain/managed/managedFieldConstant.js
var managedFieldConstantSchema;
function init_managedFieldConstant() {
	return (init_managedFieldConstant = __esmMin((() => {
		managedFieldConstantSchema = z.object({
			state: z.enum(["decoded", "unavailable"]),
			element_type: z.enum([
				"boolean",
				"char",
				"i1",
				"u1",
				"i2",
				"u2",
				"i4",
				"u4",
				"i8",
				"u8",
				"r4",
				"r8",
				"string",
				"class"
			]).nullable(),
			declarations: z.array(z.object({
				row_offset: z.int().nonnegative(),
				type_code: z.int().min(0).max(255),
				padding: z.int().min(0).max(255),
				blob_index: z.int().nonnegative()
			})),
			raw_hex: z.string().regex(/^(?:[0-9a-f]{2})*$/u).nullable(),
			value: z.union([
				z.string(),
				z.number(),
				z.boolean(),
				z.null()
			]).describe("Encoded scalar, not runtime state. i8/u8 are decimal strings; negative zero and nonfinite floats are -0/NaN/Infinity/-Infinity strings. Null is a decoded class null only when state is decoded."),
			limitation: z.string().nullable()
		});
	})))();
}

//#endregion
//#region dist/domain/managed/managedArtifact.js
var managedMetadataTokenSchema, offsetSchema, cliMetadataGuidSchema, publicKeyIdentitySchema, assemblyIdentitySchema, moduleIdentitySchema, managedArtifactReferenceSchema, managedMetadataSummarySchema, managedTokenIdentityScopeSchema, assemblyReferenceSchema, managedResourceSchema, customAttributeSchema, managedSignatureSchema, managedTypeSchema, managedExportedTypeSchema, managedFieldSchema, managedExceptionRegionSchema, managedInstructionAnchorSchema, managedMethodBodySchema, managedMethodSchema, declaringTypeNameSchema, managedMemberReferenceSchema, managedUserStringSchema, managedModuleReferenceSchema, managedNativeImportSchema, managedNativeImplementationSchema, managedCallEdgeSchema, managedFieldAccessSchema, managedParseIssueSchema, managedArtifactInspectionSchema, managedMemberInspectionSchema, managedNativeBoundaryInspectionSchema;
function init_managedArtifact() {
	return (init_managedArtifact = __esmMin((() => {
		init_digests();
		init_managedFieldConstant();
		managedMetadataTokenSchema = z.string().regex(/^0x[0-9a-f]{8}$/u);
		offsetSchema = z.int().min(0);
		cliMetadataGuidSchema = z.string().regex(/^[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$/u);
		publicKeyIdentitySchema = z.object({
			kind: z.enum([
				"none",
				"public-key",
				"public-key-token"
			]),
			byte_length: z.int().min(0),
			sha256: digestSchema.nullable(),
			token: z.string().regex(/^[a-f0-9]{16}$/u).nullable()
		});
		assemblyIdentitySchema = z.object({
			name: z.string(),
			version: z.string().regex(/^\d+\.\d+\.\d+\.\d+$/u),
			culture: z.string().nullable(),
			flags: z.int().min(0).max(4294967295),
			hash_algorithm: z.int().min(0).max(4294967295),
			public_key: publicKeyIdentitySchema,
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema
		});
		moduleIdentitySchema = z.object({
			name: z.string(),
			generation: z.int().min(0).max(65535),
			mvid: cliMetadataGuidSchema.nullable(),
			enc_id: cliMetadataGuidSchema.nullable(),
			enc_base_id: cliMetadataGuidSchema.nullable(),
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema
		});
		managedArtifactReferenceSchema = z.object({
			path: z.string().min(1),
			sha256: digestSchema,
			byte_length: z.int().min(0),
			format: z.literal("pe")
		});
		managedMetadataSummarySchema = z.object({
			status: z.enum([
				"absent",
				"complete",
				"partial",
				"malformed"
			]),
			version: z.string().nullable(),
			table_row_counts: z.record(z.string(), z.int().min(0).max(4294967295))
		});
		managedTokenIdentityScopeSchema = z.object({
			token_identity: z.literal("build-local"),
			requires_artifact_sha256: digestSchema,
			requires_mvid: cliMetadataGuidSchema.nullable()
		});
		assemblyReferenceSchema = z.object({
			name: z.string(),
			version: z.string().regex(/^\d+\.\d+\.\d+\.\d+$/u),
			culture: z.string().nullable(),
			flags: z.int().min(0).max(4294967295),
			public_key_or_token: publicKeyIdentitySchema,
			hash_value_sha256: digestSchema.nullable(),
			hash_value_length: z.int().min(0),
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema
		});
		managedResourceSchema = z.object({
			name: z.string(),
			flags: z.int().min(0).max(4294967295),
			visibility: z.enum([
				"public",
				"private",
				"unknown"
			]),
			implementation_token: managedMetadataTokenSchema.nullable(),
			embedded: z.boolean(),
			declared_offset: z.int().min(0).max(4294967295),
			data_length: z.int().min(0).nullable(),
			data_sha256: digestSchema.nullable(),
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema
		});
		customAttributeSchema = z.object({
			parent_token: managedMetadataTokenSchema,
			constructor_token: managedMetadataTokenSchema.nullable(),
			type_name: z.string().nullable(),
			value_length: z.int().min(0),
			value_sha256: digestSchema,
			decoded_fixed_string: z.string().nullable(),
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema
		});
		managedSignatureSchema = z.object({
			raw_length: z.int().min(0),
			raw_sha256: digestSchema,
			resolved_sha256: digestSchema.nullable().default(null).describe("SHA-256 of the raw signature with each TypeDef or TypeRef operand replaced by that type's namespace-qualified name; equals raw_sha256 when the signature names no types. Unlike raw_sha256 it does not depend on build-local metadata rows. Null when the signature could not be decoded or names a type REA could not resolve, such as a TypeSpec."),
			kind: z.enum([
				"method",
				"field",
				"unknown"
			]),
			parse_status: z.enum([
				"decoded",
				"partial",
				"unsupported",
				"malformed"
			]),
			calling_convention: z.string().nullable(),
			generic_parameter_count: z.int().min(0).nullable(),
			parameter_count: z.int().min(0).nullable(),
			return_type: z.string().nullable(),
			parameter_types: z.array(z.string()),
			field_type: z.string().nullable(),
			issue: z.string().nullable()
		});
		managedTypeSchema = z.object({
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema,
			namespace: z.string(),
			name: z.string(),
			full_name: z.string(),
			name_sha256: digestSchema.nullable().default(null).describe("Framed nominal namespace/name/enclosing-name digest, independent of build-local rows. Null for historical Evidence or unresolved nesting; defining assemblies and CLR runtime identity are not established."),
			flags: z.int().min(0).max(4294967295),
			extends_token: managedMetadataTokenSchema.nullable(),
			enclosing_type_token: managedMetadataTokenSchema.nullable().default(null).describe("Observed enclosing TypeDef from NestedClass; null when no enclosing entry was available, which alone does not establish top-level identity."),
			field_list: z.object({
				first_row: z.int().min(1).nullable(),
				last_row: z.int().min(0).nullable(),
				count: z.int().min(0)
			}),
			method_list: z.object({
				first_row: z.int().min(1).nullable(),
				last_row: z.int().min(0).nullable(),
				count: z.int().min(0)
			})
		});
		managedExportedTypeSchema = z.object({
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema,
			namespace: z.string(),
			name: z.string(),
			flags: z.int().min(0).max(4294967295),
			forwarder: z.boolean(),
			type_def_id: z.int().min(0).max(4294967295),
			implementation_token: managedMetadataTokenSchema.nullable()
		});
		managedFieldSchema = z.object({
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema,
			declaring_type_token: managedMetadataTokenSchema.nullable(),
			declaring_type: z.string().nullable(),
			name: z.string(),
			flags: z.int().min(0).max(65535),
			signature: managedSignatureSchema,
			constant: managedFieldConstantSchema.nullable().exactOptional().describe("Field-owned ECMA-335 Constant declaration and decoded default. Null means neither a declaration nor HasDefault was observed; omission means historical Evidence without this inspection.")
		});
		managedExceptionRegionSchema = z.object({
			flags: z.int().min(0).max(4294967295),
			try_offset: z.int().min(0),
			try_length: z.int().min(0),
			handler_offset: z.int().min(0),
			handler_length: z.int().min(0),
			class_token: managedMetadataTokenSchema.nullable().describe("Raw build-local catch type token; not a cross-artifact identity"),
			/** Resolved from this artifact's own metadata; raw token remains build-local. */
			class_type: z.string().nullable().default(null),
			class_type_name_sha256: digestSchema.nullable().default(null).describe("Nested nominal TypeDef/TypeRef name digest; assembly scope is compared separately and local tokens are not cross-artifact identities"),
			class_type_identity_resolved: z.boolean().nullable().default(null).describe("Whether this artifact's local token identifies the reported catch type; null when unexamined"),
			filter_offset: z.int().min(0).nullable()
		});
		managedInstructionAnchorSchema = z.object({
			il_offset: z.int().min(0),
			opcode: z.string().min(1),
			operand_kind: z.enum([
				"none",
				"branch",
				"constant",
				"field",
				"method",
				"signature",
				"string",
				"switch",
				"token",
				"type",
				"variable",
				"unknown"
			]),
			operand: z.string().nullable()
		});
		managedMethodBodySchema = z.object({
			status: z.enum([
				"present",
				"partial",
				"absent",
				"malformed"
			]),
			header_format: z.enum([
				"tiny",
				"fat",
				"none",
				"unknown"
			]),
			rva: z.int().min(0).max(4294967295),
			file_offset: offsetSchema.nullable(),
			max_stack: z.int().min(0).nullable(),
			init_locals: z.boolean().nullable(),
			local_var_sig_token: managedMetadataTokenSchema.nullable(),
			local_var_signature: z.object({
				raw_sha256: digestSchema,
				has_context_dependent_types: z.boolean()
			}).nullable().default(null).describe("Validated LocalVarSig blob facts; null when absent or unrecorded. Named types, modifiers and generic variables require metadata or declaring context; equal raw digests do not establish their cross-artifact type identity."),
			il_size: z.int().min(0),
			il_sha256: digestSchema.nullable().describe("SHA-256 of exactly the raw il_size CIL bytes; excludes the method header, locals signature, alignment, and extra sections"),
			normalized_il_sha256: digestSchema.nullable().describe("Member-result-v1 SHA-256 of UTF-8 JSON [opcode, operand_kind, operand] tuples for a complete decode; retains build-local tokens, omits switch targets, and excludes headers, locals, and exception regions"),
			instruction_count: z.int().min(0),
			decoded_instruction_count: z.int().min(0),
			truncated_instructions: z.int().min(0),
			opcode_counts: z.record(z.string(), z.int().min(1)),
			anchors: z.array(managedInstructionAnchorSchema),
			exception_regions: z.array(managedExceptionRegionSchema),
			issue: z.string().nullable()
		});
		managedMethodSchema = z.object({
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema,
			declaring_type_token: managedMetadataTokenSchema.nullable(),
			declaring_type: z.string().nullable(),
			name: z.string(),
			rva: z.int().min(0).max(4294967295),
			impl_flags: z.int().min(0).max(65535),
			flags: z.int().min(0).max(65535),
			signature: managedSignatureSchema,
			body: managedMethodBodySchema
		});
		declaringTypeNameSchema = z.string().nullable().default(null);
		managedMemberReferenceSchema = z.object({
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema,
			parent_token: managedMetadataTokenSchema.nullable(),
			parent_name: declaringTypeNameSchema.describe("Name of a TypeDef, TypeRef, or generic-instantiation TypeSpec parent; null for other parents or when unknown"),
			name: z.string(),
			signature: managedSignatureSchema
		});
		managedUserStringSchema = z.object({
			token: managedMetadataTokenSchema,
			offset: offsetSchema.describe("File offset of the #US item"),
			value: z.string().describe("Decoded UTF-16 code units, excluding the terminal flag byte; unpaired surrogates are kept")
		});
		managedModuleReferenceSchema = z.object({
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema,
			name: z.string()
		});
		managedNativeImportSchema = z.object({
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema,
			mapping_flags: z.int().min(0).max(65535),
			mapping_flags_hex: z.string().regex(/^0x[0-9a-f]{4}$/u),
			member_token: managedMetadataTokenSchema.nullable(),
			member_kind: z.enum([
				"method",
				"field",
				"unknown"
			]),
			member_name: z.string().nullable(),
			import_name: z.string(),
			import_scope_token: managedMetadataTokenSchema.nullable(),
			import_scope_name: z.string().nullable(),
			no_mangle: z.boolean(),
			char_set: z.enum([
				"not-specified",
				"ansi",
				"unicode",
				"auto",
				"unknown"
			]),
			call_convention: z.enum([
				"not-specified",
				"winapi",
				"cdecl",
				"stdcall",
				"thiscall",
				"fastcall",
				"unknown"
			]),
			supports_last_error: z.boolean(),
			best_fit: z.enum([
				"assembly-default",
				"enabled",
				"disabled",
				"unknown"
			]),
			throw_on_unmappable_char: z.enum([
				"assembly-default",
				"enabled",
				"disabled",
				"unknown"
			]),
			verification: z.literal("managed-declaration-only")
		});
		managedNativeImplementationSchema = z.object({
			token: managedMetadataTokenSchema,
			row_offset: offsetSchema,
			name: z.string(),
			rva: z.int().min(0).max(4294967295),
			flags: z.int().min(0).max(65535),
			impl_flags: z.int().min(0).max(65535),
			code_type: z.enum([
				"il",
				"native",
				"optil",
				"runtime",
				"unknown"
			]),
			managed_kind: z.enum([
				"managed",
				"unmanaged",
				"unknown"
			]),
			pinvoke_declared: z.boolean(),
			boundary_kind: z.enum([
				"pinvoke",
				"native-body",
				"runtime-provided",
				"unmanaged-method",
				"mixed-or-unknown"
			]),
			body_interpretation: z.enum([
				"managed-cil",
				"native-or-runtime",
				"not-file-backed",
				"unknown"
			])
		});
		managedCallEdgeSchema = z.object({
			caller_token: managedMetadataTokenSchema,
			il_offset: offsetSchema.nullable().default(null),
			target_identity_sha256: digestSchema.nullable().default(null).describe("Nominal declaring-type/name/signature digest; null when unresolved or unrecorded. Does not establish assembly or runtime binding."),
			caller: z.string().nullable(),
			opcode: z.string(),
			target_token: managedMetadataTokenSchema,
			target_kind: z.enum([
				"method-def",
				"member-ref",
				"method-spec",
				"unknown"
			]),
			target_name: z.string().nullable().describe("Method name; a method-spec target reports its generic method"),
			target_declaring_type: declaringTypeNameSchema.describe("Declaring type of the called method; null when unknown")
		});
		managedFieldAccessSchema = z.object({
			method_token: managedMetadataTokenSchema,
			il_offset: offsetSchema.nullable().default(null),
			target_identity_sha256: digestSchema.nullable().default(null).describe("Nominal declaring-type/name/signature digest; null when unresolved or unrecorded. Does not establish assembly or runtime binding."),
			method: z.string().nullable(),
			opcode: z.string(),
			field_token: managedMetadataTokenSchema,
			field_name: z.string().nullable(),
			field_declaring_type: declaringTypeNameSchema.describe("Declaring type of the accessed field; null when unknown")
		});
		managedParseIssueSchema = z.object({
			code: z.enum([
				"resource-limit",
				"invalid-cli-header",
				"invalid-directory",
				"invalid-metadata-root",
				"invalid-stream",
				"missing-stream",
				"invalid-tables",
				"unsupported-metadata",
				"invalid-row",
				"invalid-heap-index",
				"invalid-string",
				"invalid-blob",
				"unsupported-signature",
				"invalid-guid",
				"invalid-resource"
			]),
			scope: z.string().min(1),
			offset: offsetSchema.nullable(),
			detail: z.string().min(1)
		});
		managedArtifactInspectionSchema = z.object({
			artifact: managedArtifactReferenceSchema,
			pe: z.object({
				machine: z.int().min(0).max(65535),
				machine_hex: z.string().regex(/^0x[0-9a-f]{4}$/u),
				architecture: z.enum([
					"x86",
					"x86_64",
					"arm",
					"arm64"
				]),
				optional_header: z.enum(["pe32", "pe32-plus"]),
				section_count: z.int().min(1).max(65535),
				characteristics: z.int().min(0).max(65535),
				cli: z.object({
					header_offset: offsetSchema,
					header_size: z.int().min(72),
					runtime_version: z.string(),
					flags: z.int().min(0).max(4294967295),
					flag_names: z.array(z.string()),
					entry_point: z.object({
						kind: z.enum([
							"metadata-token",
							"native-rva",
							"none"
						]),
						value: z.string().nullable()
					}),
					metadata_rva: z.int().min(1).max(4294967295),
					metadata_size: z.int().min(1).max(4294967295),
					resources_rva: z.int().min(0).max(4294967295),
					resources_size: z.int().min(0).max(4294967295),
					strong_name_rva: z.int().min(0).max(4294967295),
					strong_name_size: z.int().min(0).max(4294967295),
					managed_native_header_rva: z.int().min(0).max(4294967295),
					managed_native_header_size: z.int().min(0).max(4294967295),
					ready_to_run_signature: z.boolean()
				}).nullable()
			}),
			classification: z.object({
				status: z.enum([
					"managed",
					"not-managed",
					"malformed"
				]),
				container: z.literal("pe"),
				runtime_family: z.enum([
					"dotnet-framework",
					"modern-dotnet",
					"unity-mono",
					"mixed-clr-native",
					"unknown"
				]),
				implementation: z.enum([
					"cil",
					"cil-and-ready-to-run",
					"cpp-cli-mixed",
					"metadata-only",
					"not-managed",
					"unknown"
				]),
				managed_architecture: z.enum([
					"anycpu",
					"anycpu-prefer-32",
					"x86",
					"x86_64",
					"arm",
					"arm64",
					"unknown"
				]),
				evidence: z.array(z.object({
					code: z.string().min(1),
					detail: z.string().min(1),
					file_offset: offsetSchema.nullable()
				}))
			}),
			metadata: z.object({
				status: z.enum([
					"absent",
					"complete",
					"partial",
					"malformed"
				]),
				version: z.string().nullable(),
				stream_names: z.array(z.string()),
				table_row_counts: z.record(z.string(), z.int().min(0).max(4294967295))
			}),
			module: moduleIdentitySchema.nullable(),
			assembly: assemblyIdentitySchema.nullable(),
			target_frameworks: z.array(z.string()),
			references: z.array(assemblyReferenceSchema),
			resources: z.array(managedResourceSchema),
			attributes: z.array(customAttributeSchema),
			coverage: z.object({
				state: z.enum([
					"complete",
					"partial",
					"unavailable"
				]),
				issues: z.array(managedParseIssueSchema)
			}),
			limitations: z.array(z.string())
		});
		managedMemberInspectionSchema = z.object({
			signature_resolution: z.enum(["type-names-v1", "type-names-v2"]).nullable().default(null).describe("Signature type-name resolution was examined, including unresolved operands; v2 also renders readable operand names, v1 retains raw operand text; null means no attestation, including historical or capacity-limited Evidence."),
			artifact: managedArtifactReferenceSchema,
			module: moduleIdentitySchema.nullable(),
			assembly: assemblyIdentitySchema.nullable().default(null),
			metadata: managedMetadataSummarySchema,
			identity_scope: managedTokenIdentityScopeSchema,
			types: z.array(managedTypeSchema),
			nesting_read: z.boolean().nullable().default(null).describe("Whether all NestedClass rows were read and valid. Null for historical Evidence; false means current nesting is incomplete. Individual name digests can remain unresolved for missing, cyclic or over-deep enclosing chains."),
			exported_types: z.array(managedExportedTypeSchema).nullable().default(null),
			fields: z.array(managedFieldSchema),
			methods: z.array(managedMethodSchema),
			member_refs: z.array(managedMemberReferenceSchema),
			call_edges: z.array(managedCallEdgeSchema),
			field_accesses: z.array(managedFieldAccessSchema),
			user_strings: z.object({
				state: z.enum(["complete", "partial"]),
				literals: z.array(managedUserStringSchema),
				issues: z.array(managedParseIssueSchema)
			}).nullable().default(null),
			/** Caller-selected declaring types; null when every type was inspected. */
			selection: z.object({
				type_names: z.array(z.string().min(1)).min(1),
				unmatched_type_names: z.array(z.string().min(1))
			}).nullable().default(null),
			method_rows: z.object({
				offset: z.int().nonnegative(),
				count: z.int().nonnegative(),
				total: z.int().nonnegative()
			}).nullable().default(null).describe("Examined zero-based MethodDef row interval before declaring-type selection; null means the row scope was not recorded. Row coordinates are build-local and cannot prove cross-build member absence for a page."),
			coverage: z.object({
				state: z.enum([
					"complete",
					"partial",
					"unavailable"
				]),
				issues: z.array(managedParseIssueSchema)
			}),
			limitations: z.array(z.string())
		});
		managedNativeBoundaryInspectionSchema = z.object({
			artifact: managedArtifactReferenceSchema,
			module: moduleIdentitySchema.nullable(),
			metadata: managedMetadataSummarySchema,
			identity_scope: managedTokenIdentityScopeSchema,
			cli_native: z.object({
				il_only: z.boolean(),
				requires_32bit: z.boolean(),
				strong_name_signed: z.boolean(),
				native_entry_point: z.boolean(),
				ready_to_run_signature: z.boolean(),
				managed_native_header_rva: z.int().min(0).max(4294967295),
				managed_native_header_size: z.int().min(0).max(4294967295)
			}).nullable(),
			module_refs: z.array(managedModuleReferenceSchema),
			pinvoke_imports: z.array(managedNativeImportSchema),
			native_implementations: z.array(managedNativeImplementationSchema),
			summary: z.object({
				module_ref_count: z.int().min(0),
				pinvoke_import_count: z.int().min(0),
				native_implementation_count: z.int().min(0),
				ready_to_run: z.boolean().nullable(),
				mixed_mode_or_native_header: z.boolean().nullable()
			}),
			coverage: z.object({
				state: z.enum([
					"complete",
					"partial",
					"unavailable"
				]),
				issues: z.array(managedParseIssueSchema)
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/exactJsonNumber.js
var isExactJsonNumber, parseExactJson;
function init_exactJsonNumber() {
	return (init_exactJsonNumber = __esmMin((() => {
		init_jsonValue();
		init_safeJson();
		isExactJsonNumber = (value, source) => source !== undefined && isSafeNumber(source) && isSafeNumber(String(value)) && !Object.is(value, -0);
		parseExactJson = (text) => {
			const parsed = safeParseJson(text, (_key, value, context) => {
				if (typeof value === "number" && !isExactJsonNumber(value, context?.source)) throw new RangeError("JSON numeric conversion would lose recorded data");
				return value;
			});
			if (!parsed.ok) return undefined;
			const value = jsonValueSchema.safeParse(parsed.value);
			return value.success ? value.data : undefined;
		};
	})))();
}

//#endregion
//#region dist/cliCommandNames.js
var CLI_COMMANDS, CLI_COMMAND_NAMES;
function init_cliCommandNames() {
	return (init_cliCommandNames = __esmMin((() => {
		CLI_COMMANDS = Object.freeze({
			inspectPacketFields: "inspect-packet-fields",
			inspectPacketCapture: "inspect-packet-capture",
			inspectSignalDecoders: "inspect-signal-decoders",
			decodeSignalRecording: "decode-signal-recording",
			matchNativeFunctions: "match-native-functions",
			compareWasmInterfaces: "compare-wasm-interfaces",
			inspectWasmArtifact: "inspect-wasm-artifact",
			inspectApkSignature: "inspect-apk-signature",
			inspectSqliteDatabase: "inspect-sqlite-database",
			inspectEvmInterface: "inspect-evm-interface",
			inspectWebNetworkCapture: "inspect-web-network-capture",
			observeWebExecution: "observe-web-execution",
			inspectWebEventListeners: "inspect-web-event-listeners",
			traceWebSourceLocation: "trace-web-source-location",
			traceWebModuleImports: "trace-web-module-imports",
			analyze: "analyze",
			inspect: "inspect",
			decompile: "decompile",
			decompileAll: "decompile-all",
			setup: "setup",
			doctor: "doctor",
			uninstall: "uninstall",
			update: "update",
			xrefs: "xrefs",
			trace: "trace",
			traceNativeUiAction: "trace-native-ui-action",
			inspectNativeDispatchMetadata: "inspect-native-dispatch-metadata",
			capabilities: "capabilities",
			providers: "providers",
			guidance: "guidance",
			guidedWorkflows: "guided-workflows",
			function: "function",
			annotateNativeFunction: "annotate-native-function",
			inspectNativeApi: "inspect-native-api",
			instructions: "instructions",
			search: "search",
			importReferenceSource: "import-reference-source",
			inspectArtifact: "inspect-artifact",
			extractArtifact: "extract-artifact",
			compareArtifacts: "compare-artifacts",
			decodeInterfaceBuilder: "decode-interface-builder",
			inspectKeyedArchive: "inspect-keyed-archive",
			traceDylibResolution: "trace-dylib-resolution",
			inspectNativeDataType: "inspect-native-data-type",
			inspectNativeLoadImage: "inspect-native-load-image",
			readBytes: "read-bytes",
			searchBytes: "search-bytes",
			addressToFileOffset: "address-to-file-offset",
			traceNativeValues: "trace-native-values",
			inspectNativeInstruction: "inspect-native-instruction",
			resolveNativeCallTargets: "resolve-native-call-targets",
			inspectAssetCatalog: "inspect-asset-catalog",
			inspectManagedArtifact: "inspect-managed-artifact",
			inspectRecordedCrash: "inspect-recorded-crash",
			inspectByteEntropy: "inspect-byte-entropy",
			inspectBinaryLayout: "inspect-binary-layout",
			listCutterSessions: "list-cutter-sessions",
			cutterCommand: "cutter-command",
			inspectWithObjdump: "inspect-with-objdump",
			listObjdumpArchitectures: "list-objdump-architectures",
			executeRizinCommand: "execute-rizin-command",
			debugWithGdb: "debug-with-gdb",
			debugWithRizin: "debug-with-rizin",
			inspectDesktopApplication: "inspect-desktop-application",
			inspectGoBinary: "inspect-go-binary",
			inspectIl2cppMetadata: "inspect-il2cpp-metadata",
			inspectModelArtifact: "inspect-model-artifact",
			inspectGpuCodeObjects: "inspect-gpu-code-objects",
			inspectRustBinary: "inspect-rust-binary",
			inspectPythonPyc: "inspect-python-pyc",
			inspectErlangBeam: "inspect-erlang-beam",
			inspectPeResources: "inspect-pe-resources",
			inspectPeCertificates: "inspect-pe-certificates",
			inspectPeImports: "inspect-pe-imports",
			inspectNativeExports: "inspect-native-exports",
			inspectDevicetree: "inspect-devicetree",
			inspectElfNotes: "inspect-elf-notes",
			inspectAppleIps: "inspect-apple-ips",
			inspectKernelModule: "inspect-kernel-module",
			inspectPeLoadConfig: "inspect-pe-load-config",
			inspectAnalysisView: "inspect-analysis-view",
			listFridaDevices: "list-frida-devices",
			listFridaProcesses: "list-frida-processes",
			instrumentWithFrida: "instrument-with-frida",
			inspectEvidenceBundle: "inspect-evidence-bundle",
			inspectFirmwareRegions: "inspect-firmware-regions",
			extractFirmware: "extract-firmware",
			inspectAndroidPackage: "inspect-android-package",
			inspectPcapClient: "inspect-pcap-client",
			inspectPcapCapture: "inspect-pcap-capture",
			identifyFlutterBuild: "identify-flutter-build",
			inspectDartAot: "inspect-dart-aot",
			inspectApktoolClient: "inspect-apktool-client",
			decodeAndroidResources: "decode-android-resources",
			inspectAdbClient: "inspect-adb-client",
			listAdbDevices: "list-adb-devices",
			inspectAdbDevice: "inspect-adb-device",
			listAdbPackages: "list-adb-packages",
			pullAdbPackage: "pull-adb-package",
			readAdbLogcat: "read-adb-logcat",
			inspectAdbPackage: "inspect-adb-package",
			pullAdbFile: "pull-adb-file",
			pushAdbFile: "push-adb-file",
			captureAdbScreen: "capture-adb-screen",
			listAdbProcesses: "list-adb-processes",
			listAdbDirectory: "list-adb-directory",
			listAdbFeatures: "list-adb-features",
			listAdbServices: "list-adb-services",
			inspectAdbDisplay: "inspect-adb-display",
			inspectAdbWindow: "inspect-adb-window",
			readAdbSetting: "read-adb-setting",
			collectAdbBugreport: "collect-adb-bugreport",
			resolveAdbPackages: "resolve-adb-packages",
			installAdbPackage: "install-adb-package",
			uninstallAdbPackage: "uninstall-adb-package",
			startAdbApp: "start-adb-app",
			startAdbActivity: "start-adb-activity",
			stopAdbApp: "stop-adb-app",
			searchAndroidClasses: "search-android-classes",
			inspectAndroidClass: "inspect-android-class",
			inspectAndroidMethod: "inspect-android-method",
			inspectAndroidJniBindings: "inspect-android-jni-bindings",
			traceAndroidReferences: "trace-android-references",
			inspectJebClient: "inspect-jeb-client",
			openJebProject: "open-jeb-project",
			listJebUnits: "list-jeb-units",
			decompileJebItem: "decompile-jeb-item",
			inspectManagedMembers: "inspect-managed-members",
			inspectManagedNativeBoundaries: "inspect-managed-native-boundaries",
			compareManagedMembers: "compare-managed-members",
			verifyManagedNativeBoundaries: "verify-managed-native-boundaries",
			importManagedReconstruction: "import-managed-reconstruction",
			projectManagedApplicationGraph: "project-managed-application-graph",
			observeNativeUi: "observe-native-ui",
			observeNativeCalls: "observe-native-calls",
			captureNativeUiScenario: "capture-native-ui-scenario",
			inspectMacho: "inspect-macho",
			inspectSignature: "inspect-signature",
			listArchitectures: "list-architectures",
			inspectPlist: "inspect-plist",
			demangleSwift: "demangle-swift",
			evidenceImport: "evidence-import",
			evidenceExport: "evidence-export",
			environmentServe: "environment-serve",
			environmentExport: "environment-export",
			environmentCompare: "environment-compare",
			environmentBuild: "environment-build",
			compare: "compare",
			captureProcess: "capture-process",
			captureDesktopApplication: "capture-desktop-application",
			inspectDesktopApplicationState: "inspect-desktop-application-state",
			exportDesktopApplication: "export-desktop-application",
			describeDesktopApplicationTask: "describe-desktop-application-task",
			compareProcessCaptures: "compare-process-captures",
			listBrowserTargets: "list-browser-targets",
			inspectWebPage: "inspect-web-page",
			analyzeWebBundle: "analyze-web-bundle",
			exportWebScripts: "export-web-scripts",
			recoverJavaScriptSources: "recover-javascript-sources",
			observeWebSession: "observe-web-session",
			discoverWebMcpTools: "discover-webmcp-tools",
			compareWebCaptures: "compare-web-captures",
			captureWebScreenshot: "capture-web-screenshot",
			compareWebScreenshots: "compare-web-screenshots",
			captureBrowserScenario: "capture-browser-scenario",
			validateBrowserScenario: "validate-browser-scenario",
			listElectronTargets: "list-electron-targets",
			inspectElectronPage: "inspect-electron-page",
			inspectElectronFuses: "inspect-electron-fuses",
			captureElectronScenario: "capture-electron-scenario",
			listJavaScriptRuntimeTargets: "list-javascript-runtime-targets",
			observeJavaScriptRuntime: "observe-javascript-runtime",
			analyzeJavaScriptApplication: "analyze-javascript-application",
			reconcileJavaScriptRuntime: "reconcile-javascript-runtime",
			traceApplicationFeature: "trace-application-feature",
			traceJavaScriptSemantics: "trace-javascript-semantics",
			compareApplicationVersions: "compare-application-versions",
			compareSourceToBundle: "compare-source-to-bundle",
			compareJavaScriptExportShapes: "compare-javascript-export-shapes",
			buildReconstructionObligationLedger: "build-reconstruction-obligation-ledger",
			evaluateReconstructionCoverage: "evaluate-reconstruction-coverage",
			projectAndroidApplicationGraph: "project-android-application-graph",
			projectAppleApplicationGraph: "project-apple-application-graph",
			projectHarmonyApplicationGraph: "project-harmony-application-graph"
		});
		CLI_COMMAND_NAMES = Object.freeze(Object.values(CLI_COMMANDS));
	})))();
}

//#endregion
//#region dist/domain/process/processEvidenceProvider.js
var PROCESS_PROVIDER, isProcessEvidenceProvider;
function init_processEvidenceProvider() {
	return (init_processEvidenceProvider = __esmMin((() => {
		PROCESS_PROVIDER = {
			id: "rea-process",
			name: "REA process capture",
			version: "3"
		};
		isProcessEvidenceProvider = (provider) => provider.id === PROCESS_PROVIDER.id && provider.version === PROCESS_PROVIDER.version && (provider.name === PROCESS_PROVIDER.name || provider.name === "REA deterministic process harness");
	})))();
}

//#endregion
//#region dist/domain/analysisSource.js
var analysisSourceDescriptorSchema;
function init_analysisSource() {
	return (init_analysisSource = __esmMin((() => {
		init_digests();
		init_localPath();
		analysisSourceDescriptorSchema = z.discriminatedUnion("kind", [z.strictObject({
			kind: z.literal("file-range"),
			path: absoluteLocalPathStringSchema,
			sha256: digestSchema,
			byte_offset: z.int().nonnegative(),
			byte_length: z.int().nonnegative()
		}), z.strictObject({ kind: z.literal("single-function-decompile") })]);
	})))();
}

//#endregion
//#region dist/domain/providerSelection.js
var analysisProviderIdSchema, analysisProviderSelectorSchema, PROVIDER_REJECTION_CODES;
function init_providerSelection() {
	return (init_providerSelection = __esmMin((() => {
		analysisProviderIdSchema = z.string().min(1).regex(/^[a-z][a-z0-9\x2d]*$/u).refine((value) => value !== "auto", { message: "auto is reserved for provider selection" });
		analysisProviderSelectorSchema = z.union([z.literal("auto"), analysisProviderIdSchema]);
		PROVIDER_REJECTION_CODES = [
			"not_configured",
			"executable_missing",
			"runtime_missing",
			"runtime_unavailable",
			"unsupported_host",
			"unsupported_version",
			"target_kind_unsupported",
			"target_format_unsupported",
			"architecture_unsupported",
			"target_role_unsupported",
			"managed_target_unsupported",
			"open_options_invalid",
			"version_unresolved"
		];
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticResourceLimits.js
var SEMANTIC_PRIMITIVE_CANDIDATE_LIMIT, SEMANTIC_EXPRESSION_DEPTH_LIMIT, SEMANTIC_GETTER_EXPANSION_LIMIT, SEMANTIC_ALIAS_SELECTION_LIMIT, SEMANTIC_PRIMITIVE_JSON_BYTES_LIMIT, RESOURCE_LIMIT_REASON, jsonStringBytesFromLength, exceedsSemanticPrimitiveStringByteBudget, exceedsSemanticPrimitiveAdditionByteBudget, exceedsSemanticTemplateByteBudget, semanticResourceLimitUnknown, semanticResourceLimitReason;
function init_javascriptSemanticResourceLimits() {
	return (init_javascriptSemanticResourceLimits = __esmMin((() => {
		SEMANTIC_PRIMITIVE_CANDIDATE_LIMIT = 256;
		SEMANTIC_EXPRESSION_DEPTH_LIMIT = 256;
		SEMANTIC_GETTER_EXPANSION_LIMIT = 512;
		SEMANTIC_ALIAS_SELECTION_LIMIT = 512;
		SEMANTIC_PRIMITIVE_JSON_BYTES_LIMIT = 1048576;
		RESOURCE_LIMIT_REASON = {
			"primitive-candidates": "Primitive candidate budget exceeded (maximum 256 alternatives).",
			"primitive-bytes": "Primitive string-byte budget exceeded (maximum 1048576 estimated JSON bytes).",
			"expression-depth": "Semantic expression depth budget exceeded (maximum 256 nested expressions).",
			"getter-expansion": "Getter expansion was conservatively bounded (maximum 512 scheduled states or a growing receiver cycle).",
			"alias-selections": "Alias selection expansion was conservatively bounded (maximum 512 additional selector states); selected paths remain unknown."
		};
		jsonStringBytesFromLength = (codeUnits) => codeUnits * 6 + 2;
		exceedsSemanticPrimitiveStringByteBudget = (strings) => {
			let total = 0;
			for (const value of strings) {
				total += jsonStringBytesFromLength(value.length);
				if (total > 1048576) return true;
			}
			return false;
		};
		exceedsSemanticPrimitiveAdditionByteBudget = (left, right) => {
			let total = 0;
			for (const leftValue of left) {
				for (const rightValue of right) {
					if (typeof leftValue !== "string" && typeof rightValue !== "string") continue;
					const length = String(leftValue).length + String(rightValue).length;
					total += jsonStringBytesFromLength(length);
					if (total > 1048576) return true;
				}
			}
			return false;
		};
		exceedsSemanticTemplateByteBudget = (prefixes, suffixes) => {
			let total = 0;
			for (const prefix of prefixes) {
				for (const suffix of suffixes) {
					total += jsonStringBytesFromLength(prefix.length + suffix.length);
					if (total > 1048576) return true;
				}
			}
			return false;
		};
		semanticResourceLimitUnknown = (resourceLimit) => ({
			status: "unknown",
			reason: RESOURCE_LIMIT_REASON[resourceLimit],
			resourceLimit
		});
		semanticResourceLimitReason = (resourceLimit) => RESOURCE_LIMIT_REASON[resourceLimit];
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticPropertyPaths.js
function joinSemanticPropertyPaths(previous, incoming) {
	if (previous.length !== incoming.length) return undefined;
	const joined = previous.map((key, index) => joinPropertySelections(key, incoming[index]));
	return joined.every((key, index) => key === previous[index]) ? previous : joined;
}
var joinPropertySelections, semanticArrayIndex, semanticPropertyPathKeyMatches, coverageNode, SemanticPropertyPathCoverage, keyCovers;
function init_javascriptSemanticPropertyPaths() {
	return (init_javascriptSemanticPropertyPaths = __esmMin((() => {
		joinPropertySelections = (previous, incoming) => {
			if (keyCovers(previous, incoming)) return previous;
			if (keyCovers(incoming, previous)) return incoming;
			if (previous === null || incoming === null) return null;
			if (typeof previous !== "object" && typeof incoming !== "object") return null;
			if (typeof previous === "object" && typeof incoming === "object") return {
				excludedKeys: previous.excludedKeys.filter((key) => incoming.excludedKeys.includes(key)),
				...previous.startIndex === undefined || incoming.startIndex === undefined ? {} : { startIndex: Math.min(previous.startIndex, incoming.startIndex) }
			};
			const selected = typeof previous === "object" ? previous : incoming;
			const scalar = typeof previous === "object" ? incoming : previous;
			if (typeof selected !== "object" || typeof scalar === "object") return null;
			const index = semanticArrayIndex(scalar);
			return {
				excludedKeys: selected.excludedKeys.filter((key) => key !== String(scalar)),
				...selected.startIndex === undefined || index === null ? {} : { startIndex: Math.min(selected.startIndex, index) }
			};
		};
		semanticArrayIndex = (key) => {
			const index = Number(key);
			return Number.isInteger(index) && index >= 0 && index < 4294967295 && String(index) === String(key) ? index : null;
		};
		semanticPropertyPathKeyMatches = (key, name) => {
			if (key === null) return true;
			if (typeof key !== "object") return String(key) === name;
			if (key.excludedKeys.includes(name)) return false;
			if (key.startIndex === undefined) return true;
			const index = semanticArrayIndex(name);
			return index !== null && index >= key.startIndex;
		};
		coverageNode = () => ({
			terminal: false,
			exact: new Map(),
			selectors: new Map()
		});
		SemanticPropertyPathCoverage = class {
			#root = coverageNode();
			/** Match optional per-slot receiver identities along the covering prefix. */
			retain(path, contexts) {
				if (this.covers(path, contexts)) return false;
				let node = this.#root;
				for (const [offset, key] of path.entries()) {
					const context = contexts?.[offset];
					if (key !== null && typeof key !== "object") {
						const name = JSON.stringify([String(key), context]);
						let child = node.exact.get(name);
						if (child === undefined) {
							child = coverageNode();
							node.exact.set(name, child);
						}
						node = child;
					} else {
						const identity = JSON.stringify([key, context]);
						let selected = node.selectors.get(identity);
						if (selected === undefined) {
							selected = {
								key,
								context,
								node: coverageNode()
							};
							node.selectors.set(identity, selected);
						}
						node = selected.node;
					}
				}
				node.terminal = true;
				node.exact.clear();
				node.selectors.clear();
				return true;
			}
			/** Query retained prefixes without changing the coverage index. */
			covers(path, contexts) {
				const pending = [{
					node: this.#root,
					offset: 0
				}];
				while (pending.length > 0) {
					const current = pending.pop();
					if (current === undefined) break;
					if (current.node.terminal) return true;
					const key = path[current.offset];
					if (key === undefined) continue;
					const context = contexts?.[current.offset];
					if (key !== null && typeof key !== "object") {
						const exact = current.node.exact.get(JSON.stringify([String(key), context]));
						if (exact !== undefined) pending.push({
							node: exact,
							offset: current.offset + 1
						});
					}
					for (const selected of current.node.selectors.values()) {
						if (selected.context === context && keyCovers(selected.key, key)) pending.push({
							node: selected.node,
							offset: current.offset + 1
						});
					}
				}
				return false;
			}
		};
		keyCovers = (covering, key) => {
			if (covering === null) return true;
			if (key === null) return false;
			if (typeof key !== "object") return typeof covering === "object" ? semanticPropertyPathKeyMatches(covering, String(key)) : String(covering) === String(key);
			return typeof covering === "object" && covering.excludedKeys.every((name) => key.excludedKeys.includes(name)) && (covering.startIndex === undefined || key.startIndex !== undefined && covering.startIndex <= key.startIndex);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptAstValues.js
/** Visit binding and member leaves in direct and destructuring write targets. */
function* semanticWriteTargets(root) {
	const pending = [root];
	while (pending.length > 0) {
		const next = pending.pop();
		if (next === undefined) break;
		const node = unwrapJavaScriptExpression(next).node;
		if (t.isIdentifier(node) || t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) yield node;
		else if (t.isRestElement(node)) pending.push(node.argument);
		else if (t.isAssignmentPattern(node)) pending.push(node.left);
		else if (t.isArrayPattern(node)) {
			for (const element of node.elements.toReversed()) if (element !== null) pending.push(element);
		} else if (t.isObjectPattern(node)) {
			for (const property of node.properties.toReversed()) pending.push(t.isRestElement(property) ? property.argument : property.value);
		}
	}
}
var javaScriptComputedDefinitionKey, javaScriptDefinitionExpression, isRuntimeJavaScriptClassProperty, runtimeFunctionParameters, javaScriptExpressionWrapperTarget, unwrapJavaScriptExpression, readExactJavaScriptLiteral, propertyName, semanticStaticPropertyName, semanticStaticPropertyKey, staticJavaScriptTruthiness, isNullishJavaScriptSyntax, objectDataPropertyValue, PROPERTYLESS_UNARY, PROPERTYLESS_BINARY, primitiveOwnKeys, UNKNOWN_STATIC_OBJECT_MEMBER, isObjectPrototypeSetter, appendStaticObjectMembers, staticObjectMembers, staticObjectPropertySource, readStaticObjectProperty, staticObjectPropertyReader, staticObjectProperty, staticObjectOwnMethodReader, staticObjectPropertyNames, semanticFinalObjectProperty, semanticFinalObjectStringProperty, semanticObjectPatternKeys, semanticWriteSiteTarget, semanticWriteSiteReadsFirst, semanticWrappedWriteSite, javascriptDisplayText, semanticMemberChain;
function init_javascriptAstValues() {
	return (init_javascriptAstValues = __esmMin((() => {
		init_javascriptSemanticResourceLimits();
		init_javascriptSemanticPropertyPaths();
		javaScriptComputedDefinitionKey = (parent, child) => (t.isObjectMethod(parent) || t.isClassMethod(parent) || t.isClassProperty(parent) || t.isClassAccessorProperty(parent)) && parent.computed && parent.key === child;
		javaScriptDefinitionExpression = (parent, child) => t.isDecorator(child) || javaScriptComputedDefinitionKey(parent, child);
		isRuntimeJavaScriptClassProperty = (node) => t.isClassProperty(node) && node.declare !== true && node.abstract !== true;
		runtimeFunctionParameters = (node) => t.isIdentifier(node.params[0], { name: "this" }) ? node.params.slice(1) : node.params;
		javaScriptExpressionWrapperTarget = (node) => t.isParenthesizedExpression(node) || t.isTSAsExpression(node) || t.isTSTypeAssertion(node) || t.isTSNonNullExpression(node) || t.isTSSatisfiesExpression(node) || t.isTSInstantiationExpression(node) || t.isTypeCastExpression(node) ? node.expression : undefined;
		unwrapJavaScriptExpression = (node, options) => {
			let current = node;
			let depth = 0;
			for (;;) {
				const target = javaScriptExpressionWrapperTarget(current);
				if (target === undefined) break;
				if (options?.stopAtParentheses === true && (t.isParenthesizedExpression(current) || current.extra?.parenthesized === true)) break;
				current = target;
				depth += 1;
			}
			return {
				node: current,
				depth
			};
		};
		readExactJavaScriptLiteral = (node) => {
			node = unwrapJavaScriptExpression(node).node;
			if (t.isStringLiteral(node)) return {
				found: true,
				value: node.value
			};
			if (t.isNumericLiteral(node) && Number.isFinite(node.value)) return {
				found: true,
				value: node.value
			};
			if (t.isBooleanLiteral(node)) return {
				found: true,
				value: node.value
			};
			if (t.isNullLiteral(node)) return {
				found: true,
				value: null
			};
			if (t.isUnaryExpression(node) && (node.operator === "+" || node.operator === "-")) {
				const operand = unwrapJavaScriptExpression(node.argument).node;
				if (t.isNumericLiteral(operand)) {
					const value = node.operator === "-" ? -operand.value : operand.value;
					if (Number.isFinite(value) && !Object.is(value, -0)) return {
						found: true,
						value
					};
				}
			}
			if (t.isTemplateLiteral(node) && node.expressions.length === 0 && node.quasis.length === 1) {
				const cooked = node.quasis[0]?.value.cooked;
				return cooked === null || cooked === undefined ? { found: false } : {
					found: true,
					value: cooked
				};
			}
			return { found: false };
		};
		propertyName = (node) => {
			if (t.isIdentifier(node)) return node.name;
			if (t.isStringLiteral(node) || t.isNumericLiteral(node)) return String(node.value);
			return "";
		};
		semanticStaticPropertyName = (property, computed) => semanticStaticPropertyKey(property, computed) ?? "";
		semanticStaticPropertyKey = (property, computed) => {
			property = unwrapJavaScriptExpression(property).node;
			if (t.isStringLiteral(property) || t.isNumericLiteral(property) || t.isBooleanLiteral(property)) return String(property.value);
			if (t.isNullLiteral(property)) return "null";
			if (t.isBigIntLiteral(property)) return String(property.value);
			if (t.isUnaryExpression(property, { operator: "void" })) return "undefined";
			if (t.isUnaryExpression(property, { operator: "+" })) {
				const argument = unwrapJavaScriptExpression(property.argument).node;
				if (t.isNumericLiteral(argument)) return String(argument.value);
			}
			if (t.isUnaryExpression(property, { operator: "-" })) {
				const argument = unwrapJavaScriptExpression(property.argument).node;
				if (t.isNumericLiteral(argument)) return String(-argument.value);
				if (t.isBigIntLiteral(argument)) return String(-BigInt(argument.value));
			}
			if (t.isTemplateLiteral(property) && property.expressions.length === 0 && property.quasis.length === 1) {
				const cooked = property.quasis[0]?.value.cooked;
				return cooked === null || cooked === undefined ? null : cooked;
			}
			return !computed && t.isIdentifier(property) ? property.name : null;
		};
		staticJavaScriptTruthiness = (node) => {
			const value = unwrapJavaScriptExpression(node).node;
			if (t.isBooleanLiteral(value)) return value.value;
			if (t.isNullLiteral(value)) return false;
			if (t.isStringLiteral(value)) return value.value.length > 0;
			if (t.isNumericLiteral(value)) return value.value !== 0 && !Number.isNaN(value.value);
			if (t.isBigIntLiteral(value)) return String(value.value) !== "0";
			if (t.isUnaryExpression(value) && value.operator === "-" && t.isNumericLiteral(value.argument)) return value.argument.value !== 0 && !Number.isNaN(value.argument.value);
			if (t.isObjectExpression(value) || t.isArrayExpression(value) || t.isFunctionExpression(value) || t.isArrowFunctionExpression(value)) return true;
			return undefined;
		};
		isNullishJavaScriptSyntax = (node) => {
			node = unwrapJavaScriptExpression(node).node;
			return t.isNullLiteral(node) || t.isUnaryExpression(node, { operator: "void" });
		};
		objectDataPropertyValue = (property) => t.isObjectProperty(property) ? property.value : property.kind === "method" ? property : undefined;
		PROPERTYLESS_UNARY = new Set([
			"+",
			"-",
			"~",
			"!",
			"void",
			"delete"
		]);
		PROPERTYLESS_BINARY = new Set([
			"-",
			"*",
			"/",
			"%",
			"**",
			"<<",
			">>",
			">>>",
			"|",
			"^",
			"&",
			"==",
			"!=",
			"===",
			"!==",
			"<",
			"<=",
			">",
			">=",
			"in",
			"instanceof"
		]);
		primitiveOwnKeys = (node, isNullish) => {
			if (t.isStringLiteral(node) || t.isTemplateLiteral(node) || t.isUnaryExpression(node) && node.operator === "typeof" || t.isBinaryExpression(node) && node.operator === "+") return "indices";
			return t.isNumericLiteral(node) || t.isBooleanLiteral(node) || t.isBigIntLiteral(node) || t.isNullLiteral(node) || t.isUnaryExpression(node) && PROPERTYLESS_UNARY.has(node.operator) || t.isUpdateExpression(node) || t.isBinaryExpression(node) && PROPERTYLESS_BINARY.has(node.operator) || isNullish?.(node) === true ? "none" : null;
		};
		UNKNOWN_STATIC_OBJECT_MEMBER = { kind: "unknown" };
		isObjectPrototypeSetter = (property, key = semanticStaticPropertyKey(property.key, property.computed)) => t.isObjectProperty(property) && !property.computed && !property.shorthand && key === "__proto__";
		appendStaticObjectMembers = (members, object, depth, isNullish) => {
			for (const property of object.properties) {
				if (!t.isSpreadElement(property)) {
					const key = semanticStaticPropertyKey(property.key, property.computed);
					if (t.isObjectProperty(property) && isObjectPrototypeSetter(property, key)) {
						if (depth === 0) {
							const prototype = unwrapJavaScriptExpression(property.value).node;
							const primitive = primitiveOwnKeys(prototype, isNullish);
							members.push({
								kind: "prototype-setter",
								prototype: t.isNullLiteral(prototype) ? "null" : primitive !== null ? "ignored" : "unknown"
							});
						}
						continue;
					}
					members.push({
						kind: "property",
						property,
						key
					});
					continue;
				}
				const { node: spread, depth: wrappers } = unwrapJavaScriptExpression(property.argument);
				if (t.isObjectExpression(spread)) {
					const nextDepth = depth + wrappers + 1;
					if (nextDepth > 256 || spread.properties.some((entry) => t.isObjectMethod(entry, { kind: "get" }))) {
						members.push(UNKNOWN_STATIC_OBJECT_MEMBER);
						continue;
					}
					appendStaticObjectMembers(members, spread, nextDepth, isNullish);
					continue;
				}
				if (t.isArrayExpression(spread)) {
					let firstSpread = -1;
					let hasElements = false;
					for (let index = 0; index < spread.elements.length; index++) {
						const element = spread.elements[index];
						if (element == null) continue;
						hasElements = true;
						if (t.isSpreadElement(element)) {
							firstSpread = index;
							break;
						}
					}
					if (hasElements) members.push({
						kind: "array-indices",
						elements: spread.elements,
						firstSpread
					});
					continue;
				}
				const primitive = primitiveOwnKeys(spread, isNullish);
				if (primitive === "indices") {
					const literal = readExactJavaScriptLiteral(spread);
					const length = literal.found && typeof literal.value === "string" ? literal.value.length : null;
					if (length !== 0) members.push({
						kind: "primitive-indices",
						length
					});
					continue;
				}
				if (primitive === "none" || t.isFunctionExpression(spread) || t.isArrowFunctionExpression(spread) || t.isRegExpLiteral(spread)) continue;
				members.push(UNKNOWN_STATIC_OBJECT_MEMBER);
			}
		};
		staticObjectMembers = (object, depth, isNullish) => {
			const members = [];
			appendStaticObjectMembers(members, object, depth, isNullish);
			return members;
		};
		staticObjectPropertySource = (object, isNullish) => object === undefined ? "missing" : t.isObjectExpression(object) ? staticObjectMembers(object, 0, isNullish) : "dynamic";
		readStaticObjectProperty = (source, name) => {
			if (typeof source === "string") return { status: source };
			let prototypeMaySupply = false;
			for (let index = source.length - 1; index >= 0; index--) {
				const member = source[index];
				if (member.kind === "prototype-setter") {
					prototypeMaySupply ||= member.prototype === "unknown";
					continue;
				}
				if (member.kind === "unknown") return { status: "dynamic" };
				if (member.kind === "primitive-indices") {
					const index = semanticArrayIndex(name);
					if (index !== null && (member.length === null || index < member.length)) return { status: "dynamic" };
					continue;
				}
				if (member.kind === "array-indices") {
					const index = semanticArrayIndex(name);
					if (index !== null && (member.firstSpread >= 0 && index >= member.firstSpread || index < member.elements.length && member.elements[index] != null)) return { status: "dynamic" };
					continue;
				}
				const { property, key } = member;
				if (key === null) return { status: "dynamic" };
				if (key !== name) continue;
				const value = objectDataPropertyValue(property);
				return value === undefined ? { status: "dynamic" } : {
					status: "explicit",
					property,
					value
				};
			}
			return prototypeMaySupply ? { status: "dynamic" } : { status: "missing" };
		};
		staticObjectPropertyReader = (object, isNullish) => {
			const source = staticObjectPropertySource(object, isNullish);
			if (typeof source === "string") return () => ({ status: source });
			const properties = new Map();
			let fallback = "missing";
			let hasIndexedSpread = false;
			for (let index = source.length - 1; index >= 0; index--) {
				const member = source[index];
				if (member.kind === "prototype-setter") {
					if (member.prototype === "unknown") fallback = "dynamic";
				} else if (member.kind === "primitive-indices" || member.kind === "array-indices") {
					hasIndexedSpread = true;
				} else if (member.kind === "unknown" || member.key === null) {
					fallback = "dynamic";
					break;
				} else if (!properties.has(member.key)) {
					const { property, key } = member;
					const value = objectDataPropertyValue(property);
					properties.set(key, value === undefined ? { status: "dynamic" } : {
						status: "explicit",
						property,
						value
					});
				}
			}
			return (name) => hasIndexedSpread && semanticArrayIndex(name) !== null ? readStaticObjectProperty(source, name) : properties.get(name) ?? { status: fallback };
		};
		staticObjectProperty = (object, name, isNullish) => readStaticObjectProperty(staticObjectPropertySource(object, isNullish), name);
		staticObjectOwnMethodReader = (object) => {
			if (!t.isObjectExpression(object)) return () => false;
			const methods = new Map();
			const members = staticObjectMembers(object, 0);
			for (let index = members.length - 1; index >= 0; index--) {
				const member = members[index];
				if (member.kind === "prototype-setter") continue;
				if (member.kind === "unknown") break;
				if (member.kind !== "property") continue;
				if (member.key === null) break;
				if (!methods.has(member.key)) methods.set(member.key, t.isObjectMethod(member.property) && member.property.kind === "method");
			}
			return (name) => methods.get(name) === true;
		};
		staticObjectPropertyNames = (object, isNullish) => {
			if (object === undefined) return { status: "missing" };
			if (!t.isObjectExpression(object)) return { status: "dynamic" };
			const names = new Set();
			let complete = true;
			for (const member of staticObjectMembers(object, 0, isNullish)) {
				if (member.kind === "prototype-setter") continue;
				if (member.kind === "unknown" || member.kind === "primitive-indices" || member.kind === "array-indices") {
					complete = false;
					continue;
				}
				const { key } = member;
				if (key === null) {
					complete = false;
					continue;
				}
				names.add(key);
			}
			return complete ? {
				status: "complete",
				names: [...names]
			} : {
				status: "partial",
				names: [...names]
			};
		};
		semanticFinalObjectProperty = (node, key) => {
			const property = staticObjectProperty(node, key);
			return property.status === "explicit" ? property.value : undefined;
		};
		semanticFinalObjectStringProperty = (node, key) => {
			const value = semanticFinalObjectProperty(node, key);
			return t.isStringLiteral(value) ? value.value : undefined;
		};
		semanticObjectPatternKeys = (pattern) => pattern.properties.flatMap((property) => {
			if (t.isRestElement(property)) return [];
			const key = semanticStaticPropertyKey(property.key, property.computed);
			return key === null ? [] : [key];
		});
		semanticWriteSiteTarget = (node) => {
			if (t.isAssignmentExpression(node)) return node.left;
			if (t.isUpdateExpression(node)) return node.argument;
			if (t.isUnaryExpression(node, { operator: "delete" })) return node.argument;
			if (t.isForOfStatement(node) || t.isForInStatement(node)) return node.left;
			return null;
		};
		semanticWriteSiteReadsFirst = (site) => t.isAssignmentExpression(site) && site.operator !== "=" || t.isUpdateExpression(site);
		semanticWrappedWriteSite = (node, parent, ancestors) => {
			const chain = ancestors.at(-1) === parent ? ancestors : [...ancestors, parent];
			for (let index = chain.length - 1; index >= 0; index -= 1) {
				const candidate = chain[index];
				if (candidate === undefined) return null;
				const target = semanticWriteSiteTarget(candidate);
				if (target !== null) return unwrapJavaScriptExpression(target).node === node ? candidate : null;
				if (unwrapJavaScriptExpression(candidate).depth === 0) return null;
			}
			return null;
		};
		javascriptDisplayText = (value) => value === "" ? "\"\"" : value;
		semanticMemberChain = (node, admit) => {
			const members = [];
			let current = node;
			while (current !== null && current !== undefined) {
				current = unwrapJavaScriptExpression(current).node;
				if (admit?.(current) === false) return undefined;
				if (!t.isMemberExpression(current) && !t.isOptionalMemberExpression(current)) break;
				const member = semanticStaticPropertyKey(current.property, current.computed);
				if (member === null || !t.isNode(current.object)) return undefined;
				members.push(member);
				current = current.object;
			}
			return {
				root: current,
				members: members.reverse()
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptModuleDeclaration.js
var isErasedJavaScriptDeclaration, isUnmodeledJavaScriptRuntimeScope, isTypeOnlyImportDeclaration, isTypeOnlyExportDeclaration, semanticStaticModuleSource, semanticImportEqualsSpecifier, isTypeOnlyImportSpecifier, isTypeOnlyExportSpecifier, semanticRuntimeExportValueSources, hasOnlyInlineTypeImportSpecifiers, hasOnlyInlineTypeExportSpecifiers, hasUncertainTypeOnlyModuleSideEffect;
function init_javascriptModuleDeclaration() {
	return (init_javascriptModuleDeclaration = __esmMin((() => {
		init_javascriptAstValues();
		isErasedJavaScriptDeclaration = (node) => t.isTSInterfaceDeclaration(node) || t.isTSTypeAliasDeclaration(node) || t.isTSDeclareFunction(node) || (t.isVariableDeclaration(node) || t.isClassDeclaration(node) || t.isTSEnumDeclaration(node) || t.isTSModuleDeclaration(node)) && node.declare === true;
		isUnmodeledJavaScriptRuntimeScope = (node) => t.isTSModuleDeclaration(node) || t.isTSEnumDeclaration(node);
		isTypeOnlyImportDeclaration = (node) => node.importKind === "type" || node.importKind === "typeof";
		isTypeOnlyExportDeclaration = (node) => node.exportKind === "type" || t.isExportNamedDeclaration(node) && node.declaration != null && isErasedJavaScriptDeclaration(node.declaration);
		semanticStaticModuleSource = (node) => {
			if (t.isImportDeclaration(node)) return isTypeOnlyImportDeclaration(node) ? null : node.source;
			if (t.isExportAllDeclaration(node) || t.isExportNamedDeclaration(node)) return isTypeOnlyExportDeclaration(node) ? null : node.source ?? null;
			return null;
		};
		semanticImportEqualsSpecifier = (node) => node.importKind !== "type" && t.isTSExternalModuleReference(node.moduleReference) && t.isStringLiteral(node.moduleReference.expression) ? node.moduleReference.expression.value : null;
		isTypeOnlyImportSpecifier = (node) => node.importKind === "type" || node.importKind === "typeof";
		isTypeOnlyExportSpecifier = (node) => node.exportKind === "type";
		semanticRuntimeExportValueSources = (node) => {
			if (t.isExportDefaultDeclaration(node)) return isErasedJavaScriptDeclaration(node.declaration) ? [] : [node.declaration];
			if (!t.isExportNamedDeclaration(node) || node.source != null || isTypeOnlyExportDeclaration(node)) return [];
			const values = [];
			if (t.isVariableDeclaration(node.declaration)) for (const declaration of node.declaration.declarations) values.push(...semanticWriteTargets(declaration.id));
			else if ((t.isFunctionDeclaration(node.declaration) || t.isClassDeclaration(node.declaration)) && node.declaration.id != null) values.push(node.declaration.id);
			for (const specifier of node.specifiers) if (t.isExportSpecifier(specifier) && !isTypeOnlyExportSpecifier(specifier)) values.push(specifier.local);
			return values;
		};
		hasOnlyInlineTypeImportSpecifiers = (node) => !isTypeOnlyImportDeclaration(node) && node.specifiers.length > 0 && node.specifiers.every((specifier) => t.isImportSpecifier(specifier) && isTypeOnlyImportSpecifier(specifier));
		hasOnlyInlineTypeExportSpecifiers = (node) => !isTypeOnlyExportDeclaration(node) && node.source != null && node.specifiers.length > 0 && node.specifiers.every((specifier) => t.isExportSpecifier(specifier) && isTypeOnlyExportSpecifier(specifier));
		hasUncertainTypeOnlyModuleSideEffect = (program) => program.body.some((node) => t.isImportDeclaration(node) && hasOnlyInlineTypeImportSpecifiers(node) || t.isExportNamedDeclaration(node) && hasOnlyInlineTypeExportSpecifiers(node));
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSourceParser.js
var runtimeContextByProgram, javaScriptRuntimeContext, javaScriptProgramStrictness, hasRuntimeModuleDeclaration, parseWithRuntimeContext, parserPluginsForPath, isExplicitModuleSourcePath, runtimeSourceTypeForPath, parseRecoveredJavaScript, parseJavaScriptSource, javaScriptThisOwner, javaScriptTopLevelThisMayBeGlobal;
function init_javascriptSourceParser() {
	return (init_javascriptSourceParser = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptModuleDeclaration();
		runtimeContextByProgram = new WeakMap();
		javaScriptRuntimeContext = (program) => runtimeContextByProgram.get(program) ?? "unknown";
		javaScriptProgramStrictness = (program) => {
			if (program.directives.some(({ value }) => value.value === "use strict")) return "strict";
			const context = javaScriptRuntimeContext(program);
			return context === "module" ? "strict" : context === "commonjs" ? "sloppy" : "unknown";
		};
		hasRuntimeModuleDeclaration = (program) => program.body.some((node) => {
			if (t.isTSImportEqualsDeclaration(node)) return semanticImportEqualsSpecifier(node) !== null;
			if (t.isImportDeclaration(node)) return !isTypeOnlyImportDeclaration(node) && !hasOnlyInlineTypeImportSpecifiers(node);
			if (t.isExportNamedDeclaration(node) || t.isExportAllDeclaration(node)) return !isTypeOnlyExportDeclaration(node) && (!t.isExportNamedDeclaration(node) || !hasOnlyInlineTypeExportSpecifiers(node) && (node.declaration == null || !isErasedJavaScriptDeclaration(node.declaration)));
			return t.isExportDefaultDeclaration(node) && !isErasedJavaScriptDeclaration(node.declaration);
		});
		parseWithRuntimeContext = (source, sourcePath, options, packageContext) => {
			const file = parse(source, options);
			runtimeContextByProgram.set(file.program, /\.c[jt]s$/iu.test(sourcePath ?? "") ? /\.d\.cts$/iu.test(sourcePath ?? "") ? "unknown" : "commonjs" : isExplicitModuleSourcePath(sourcePath) ? "module" : packageContext === "module" || packageContext === "commonjs" ? packageContext : packageContext === "unspecified" && /\.js$/iu.test(sourcePath ?? "") ? file.program.sourceType === "module" ? "module" : "commonjs" : file.program.body.some((node) => t.isTSExportAssignment(node)) ? "commonjs" : file.program.sourceType === "module" && hasRuntimeModuleDeclaration(file.program) ? "module" : "unknown");
			return file;
		};
		parserPluginsForPath = (sourcePath) => {
			const path = sourcePath ?? "";
			const syntax = ["decorators-legacy", "sourcePhaseImports"];
			if (/\.(?:js|jsx|mjs|cjs)$/iu.test(path)) return [...syntax, "jsx"];
			const dts = /\.d\.(?:ts|mts|cts)$/iu.test(path);
			const isTsLike = /\.(?:ts|cts|mts)$/iu.test(path);
			const isTsx = /\.tsx$/iu.test(path);
			const isMts = /\.mts$/iu.test(path);
			const typescript = ["typescript", {
				dts,
				...isMts ? { disallowAmbiguousJSXLike: true } : {}
			}];
			const jsxCapable = !dts && (isTsx || !isTsLike);
			return jsxCapable ? [
				...syntax,
				"jsx",
				typescript
			] : [...syntax, typescript];
		};
		isExplicitModuleSourcePath = (path) => /\.m[jt]s$/iu.test(path ?? "");
		runtimeSourceTypeForPath = (path) => /\.cjs$/iu.test(path ?? "") ? "commonjs" : isExplicitModuleSourcePath(path) ? "module" : "unambiguous";
		parseRecoveredJavaScript = (source, sourcePath, options, observedPackageType) => {
			const filenameType = runtimeSourceTypeForPath(sourcePath);
			const packageContext = /\.(?:js|ts)$/iu.test(sourcePath ?? "") && !/\.d\.ts$/iu.test(sourcePath ?? "") ? observedPackageType : undefined;
			const sourceType = filenameType !== "unambiguous" ? filenameType : packageContext === "module" ? "module" : packageContext === "commonjs" && /\.js$/iu.test(sourcePath ?? "") ? "commonjs" : "unambiguous";
			if (sourceType !== "unambiguous") {
				const normalizedOptions = { ...options };
				if (sourceType === "commonjs") {
					delete normalizedOptions.allowAwaitOutsideFunction;
					delete normalizedOptions.allowReturnOutsideFunction;
					delete normalizedOptions.allowNewTargetOutsideFunction;
				}
				return {
					file: parseWithRuntimeContext(source, sourcePath, {
						...normalizedOptions,
						sourceType,
						errorRecovery: true
					}, packageContext),
					moduleOnlyErrors: []
				};
			}
			const file = parseWithRuntimeContext(source, sourcePath, {
				...options,
				sourceType: "unambiguous",
				errorRecovery: true
			}, packageContext);
			if (file.program.sourceType !== "script" || file.errors.length === 0) return {
				file,
				moduleOnlyErrors: []
			};
			const script = parseWithRuntimeContext(source, sourcePath, {
				...options,
				sourceType: "script",
				errorRecovery: true
			}, packageContext);
			const scriptErrors = new Set(script.errors.map((error) => error.message));
			return {
				file: script,
				moduleOnlyErrors: javaScriptRuntimeContext(script.program) === "commonjs" ? [] : file.errors.map((error) => error.message).filter((message) => !scriptErrors.has(message))
			};
		};
		parseJavaScriptSource = (source, sourcePath) => {
			try {
				const runtimeSourceType = runtimeSourceTypeForPath(sourcePath);
				const commonjs = runtimeSourceType === "commonjs";
				const options = {
					errorRecovery: true,
					attachComment: false,
					plugins: parserPluginsForPath(sourcePath)
				};
				const file = parseWithRuntimeContext(source, sourcePath, {
					...options,
					sourceType: commonjs ? "unambiguous" : runtimeSourceType,
					allowReturnOutsideFunction: commonjs,
					allowNewTargetOutsideFunction: commonjs
				});
				return commonjs && file.program.sourceType === "script" && file.errors.length > 0 ? parseWithRuntimeContext(source, sourcePath, {
					...options,
					sourceType: "commonjs"
				}) : file;
			} catch (cause) {
				void cause;
				return null;
			}
		};
		javaScriptThisOwner = (node, program, parents) => {
			let child = node;
			let classDefinitionExpression = false;
			let current = parents.get(node);
			while (current !== undefined && current !== program) {
				const definitionExpression = javaScriptDefinitionExpression(current, child);
				if (definitionExpression && !t.isObjectMethod(current)) classDefinitionExpression = true;
				if ((t.isClassProperty(current) || t.isClassPrivateProperty(current) || t.isClassAccessorProperty(current)) && current.value === child) return "isolated";
				if (t.isStaticBlock(current)) return "isolated";
				if (t.isFunction(current) && !t.isArrowFunctionExpression(current) && !definitionExpression) return "caller";
				if (t.isClass(current) && current.superClass !== child && !classDefinitionExpression) return "isolated";
				if (t.isClass(current)) classDefinitionExpression = false;
				child = current;
				current = parents.get(current);
			}
			return current === program && javaScriptRuntimeContext(program) === "unknown" ? "global" : "isolated";
		};
		javaScriptTopLevelThisMayBeGlobal = (node, program, parents) => javaScriptThisOwner(node, program, parents) === "global";
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticTraversal.js
/** Cooperative value-only view of the same deterministic AST traversal. */
function* traverseJavaScriptValueAstSteps(root, erasedSyntaxNodes, visitor) {
	if (erasedSyntaxNodes.has(root)) return;
	yield* traverseJavaScriptAstSteps(root, {
		...visitor,
		skip: (node) => erasedSyntaxNodes.has(node) || visitor.skip?.(node) === true
	});
}
/**
* {@link traverseJavaScriptAst} with a yield every 1,024 visited nodes, so a
* caller can serve control messages during one large traversal. Visit order
* and callbacks are identical.
*/
function* traverseJavaScriptAstSteps(root, visitor) {
	const ancestors = [];
	const enter = (node, parent) => {
		visitor.enter(node, parent, () => [...ancestors]);
		ancestors.push(node);
		return {
			node,
			parent,
			children: childNodes(node),
			nextIndex: 0
		};
	};
	const pending = [enter(root, null)];
	let visited = 1;
	while (pending.length > 0) {
		const current = pending.at(-1);
		if (current === undefined) break;
		const child = current.children[current.nextIndex];
		if (child !== undefined) {
			current.nextIndex += 1;
			if (visited % 1024 === 0) yield;
			visited += 1;
			if (visitor.skip?.(child) === true) continue;
			pending.push(enter(child, current.node));
		} else {
			visitor.exit?.(current.node, current.parent);
			ancestors.pop();
			pending.pop();
		}
	}
}
var isErasedJavaScriptValueChild, traverseJavaScriptAst, traverseJavaScriptValueAst, completeSemanticSteps, childNodes, javaScriptAstChildKeys;
function init_javascriptSemanticTraversal() {
	return (init_javascriptSemanticTraversal = __esmMin((() => {
		init_javascriptModuleDeclaration();
		isErasedJavaScriptValueChild = (node, parent) => {
			if (isErasedJavaScriptDeclaration(node) || t.isTSType(node) || t.isTSTypeElement(node) || t.isTSDeclareMethod(node) || t.isTSTypeAnnotation(node) || t.isTSTypeParameterDeclaration(node) || t.isTSTypeParameterInstantiation(node) || t.isTSClassImplements(node) || t.isTSInterfaceHeritage(node) || t.isTSInterfaceBody(node) || t.isImportDeclaration(node) && isTypeOnlyImportDeclaration(node) || (t.isExportNamedDeclaration(node) || t.isExportAllDeclaration(node)) && isTypeOnlyExportDeclaration(node) || t.isImportSpecifier(node) && isTypeOnlyImportSpecifier(node) || t.isExportSpecifier(node) && isTypeOnlyExportSpecifier(node) || t.isTSImportEqualsDeclaration(node) && node.importKind === "type") return true;
			return t.isClassProperty(parent) && (parent.declare === true || parent.abstract === true) && !t.isDecorator(node) && !(node === parent.key && parent.computed === true && (parent.decorators?.length ?? 0) > 0);
		};
		traverseJavaScriptAst = (root, visitor) => completeSemanticSteps(traverseJavaScriptAstSteps(root, visitor));
		traverseJavaScriptValueAst = (root, erasedSyntaxNodes, visitor) => completeSemanticSteps(traverseJavaScriptValueAstSteps(root, erasedSyntaxNodes, visitor));
		completeSemanticSteps = (steps) => {
			for (;;) {
				const step = steps.next();
				if (step.done === true) return step.value;
			}
		};
		childNodes = (node) => {
			const keys = javaScriptAstChildKeys(node);
			const children = [];
			for (const key of keys) {
				const value = Reflect.get(node, key);
				if (t.isNode(value)) {
					children.push(value);
					continue;
				}
				if (!Array.isArray(value)) continue;
				for (const item of value) {
					if (t.isNode(item)) children.push(item);
				}
			}
			return children;
		};
		javaScriptAstChildKeys = (node) => t.VISITOR_KEYS[node.type] ?? [];
	})))();
}

//#endregion
//#region dist/domain/zipEndOfCentralDirectory.js
/**
* Observe complete classic records whose declared comment ends this window,
* latest first. Candidate recognition does not establish directory validity,
* ambiguity policy, disk support, or the meaning of Zip64 sentinel fields.
*/
function* zipEndOfCentralDirectoryCandidates(bytes) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const earliest = Math.max(0, bytes.byteLength - 22 - ZIP_MAX_COMMENT_BYTES);
	for (let offset = bytes.byteLength - 22; offset >= earliest; offset--) {
		if (view.getUint32(offset, true) !== 101010256) continue;
		const commentLength = view.getUint16(offset + 20, true);
		if (offset + 22 + commentLength !== bytes.byteLength) continue;
		yield {
			offset,
			disk: view.getUint16(offset + 4, true),
			directoryDisk: view.getUint16(offset + 6, true),
			entriesOnDisk: view.getUint16(offset + 8, true),
			totalEntries: view.getUint16(offset + 10, true),
			directorySize: view.getUint32(offset + 12, true),
			directoryOffset: view.getUint32(offset + 16, true),
			commentLength
		};
	}
}
var ZIP_EOCD_BYTES, ZIP_MAX_COMMENT_BYTES;
function init_zipEndOfCentralDirectory() {
	return (init_zipEndOfCentralDirectory = __esmMin((() => {
		ZIP_EOCD_BYTES = 22;
		ZIP_MAX_COMMENT_BYTES = 65535;
	})))();
}

//#endregion
//#region dist/domain/apkSignature/apkV1MetadataName.js
var APK_V1_META_INF_PREFIX, APK_V1_MANIFEST_PATH, META_INF_PREFIX_BYTES, BLOCK_SUFFIXES, isV1SignatureFileName, isV1SignatureBlockName, v1SignatureFileNameForBlock, isV1SignatureMetadataName, startsWithV1MetaInfPrefix;
function init_apkV1MetadataName() {
	return (init_apkV1MetadataName = __esmMin((() => {
		APK_V1_META_INF_PREFIX = "META-INF/";
		APK_V1_MANIFEST_PATH = `${APK_V1_META_INF_PREFIX}MANIFEST.MF`;
		META_INF_PREFIX_BYTES = Uint8Array.from([...APK_V1_META_INF_PREFIX].map((character) => character.charCodeAt(0)));
		BLOCK_SUFFIXES = [
			".RSA",
			".DSA",
			".EC"
		];
		isV1SignatureFileName = (name) => name.endsWith(".SF");
		isV1SignatureBlockName = (name) => BLOCK_SUFFIXES.some((suffix) => name.endsWith(suffix));
		v1SignatureFileNameForBlock = (block) => `${block.slice(0, block.lastIndexOf("."))}.SF`;
		isV1SignatureMetadataName = (name) => name.startsWith("META-INF/") && (name === APK_V1_MANIFEST_PATH || isV1SignatureFileName(name) || isV1SignatureBlockName(name));
		startsWithV1MetaInfPrefix = (bytes, start, length) => {
			if (length < META_INF_PREFIX_BYTES.length) return false;
			for (let index = 0; index < META_INF_PREFIX_BYTES.length; index += 1) if (bytes[start + index] !== META_INF_PREFIX_BYTES[index]) return false;
			return true;
		};
	})))();
}

//#endregion
//#region dist/domain/zipPackageFormat.js
var ZIP_PACKAGE_FORMATS, isZipPackageFormat, hasZipSignature, CENTRAL_DIRECTORY_HEADER, LOCAL_FILE_HEADER, CENTRAL_HEADER_BYTES, locateTrailingZipArchive, zipPackageFormatForPath, zipRootPackageFormat, ZIP_NON_ENTRY_LIMITATION;
function init_zipPackageFormat() {
	return (init_zipPackageFormat = __esmMin((() => {
		init_zipEndOfCentralDirectory();
		ZIP_PACKAGE_FORMATS = [
			"zip",
			"ipa",
			"apk",
			"msix",
			"appx",
			"hap",
			"hsp",
			"app-pack"
		];
		isZipPackageFormat = (format) => ZIP_PACKAGE_FORMATS.some((candidate) => candidate === format);
		hasZipSignature = (bytes) => bytes.length >= 4 && bytes[0] === 80 && bytes[1] === 75 && (bytes[2] === 3 && bytes[3] === 4 || bytes[2] === 5 && bytes[3] === 6 || bytes[2] === 6 && bytes[3] === 6 || bytes[2] === 7 && bytes[3] === 8);
		CENTRAL_DIRECTORY_HEADER = 33639248;
		LOCAL_FILE_HEADER = 67324752;
		CENTRAL_HEADER_BYTES = 46;
		locateTrailingZipArchive = async (size, read) => {
			if (!Number.isSafeInteger(size) || size < 22) return undefined;
			const tailStart = Math.max(0, size - 22 - ZIP_MAX_COMMENT_BYTES);
			const tail = Buffer.from(await read(tailStart, size - tailStart));
			if (tail.length !== size - tailStart) return undefined;
			for (const candidate of zipEndOfCentralDirectoryCandidates(tail)) {
				const { offset: record, entriesOnDisk, directorySize: directoryBytes, directoryOffset: declaredDirectory } = candidate;
				if (candidate.disk !== 0 || candidate.directoryDisk !== 0 || entriesOnDisk === 0 || entriesOnDisk === 65535 || entriesOnDisk !== candidate.totalEntries || directoryBytes === 4294967295 || declaredDirectory === 4294967295) continue;
				const directory = tailStart + record - directoryBytes;
				const shift = directory - declaredDirectory;
				if (directory < 0 || shift < 0) continue;
				const header = Buffer.from(await read(directory, CENTRAL_HEADER_BYTES));
				if (header.length !== CENTRAL_HEADER_BYTES || header.readUInt32LE(0) !== CENTRAL_DIRECTORY_HEADER) continue;
				const firstLocal = header.readUInt32LE(42) + shift;
				if (firstLocal === 0 || firstLocal >= directory) continue;
				const local = Buffer.from(await read(firstLocal, 4));
				if (local.length === 4 && local.readUInt32LE(0) === LOCAL_FILE_HEADER) return { leadingBytes: firstLocal };
			}
			return undefined;
		};
		zipPackageFormatForPath = (path) => {
			const lower = path.toLowerCase();
			if (lower.endsWith(".zip")) return "zip";
			if (lower.endsWith(".ipa")) return "ipa";
			if (lower.endsWith(".apk")) return "apk";
			if (lower.endsWith(".msix") || lower.endsWith(".msixbundle")) return "msix";
			if (lower.endsWith(".appx") || lower.endsWith(".appxbundle")) return "appx";
			if (lower.endsWith(".hap")) return "hap";
			if (lower.endsWith(".hsp")) return "hsp";
			return undefined;
		};
		zipRootPackageFormat = (path) => {
			const lower = path.toLowerCase();
			return lower.endsWith(".app") ? "app-pack" : zipPackageFormatForPath(lower) ?? "zip";
		};
		ZIP_NON_ENTRY_LIMITATION = "ZIP inventory lists central-directory entries only. Non-entry bytes, including leading bytes before the first entry such as a self-extractor stub, an APK Signing Block before the central directory or a ZIP comment after it, are not occurrences.";
	})))();
}

//#endregion
//#region dist/config/positiveDecimalInteger.js
var decimalInteger, positiveDecimalIntegerSchema;
function init_positiveDecimalInteger() {
	return (init_positiveDecimalInteger = __esmMin((() => {
		decimalInteger = /^[1-9]\d*$/u;
		positiveDecimalIntegerSchema = (minimum, maximum, constraint) => z.string().regex(decimalInteger, { error: constraint }).refine((value) => {
			if (!decimalInteger.test(value)) return true;
			const parsed = BigInt(value);
			return parsed >= BigInt(minimum) && parsed <= BigInt(maximum);
		}, { error: constraint }).transform(Number);
	})))();
}

//#endregion
//#region dist/config/mcpInputSchemaProfile.js
var COMPACT_INPUT_SCHEMA_BUDGET_BYTES, mcpInputSchemaProfileSchema, resolveMcpInputSchemaProfile, compactPresentationForMcpInputSchemaProfile, profileConstraint$1, parseMcpInputSchemaProfile;
function init_mcpInputSchemaProfile() {
	return (init_mcpInputSchemaProfile = __esmMin((() => {
		init_configurationErrors();
		init_result();
		COMPACT_INPUT_SCHEMA_BUDGET_BYTES = 13 * 1024;
		mcpInputSchemaProfileSchema = z.enum(["full", "compact"]);
		resolveMcpInputSchemaProfile = (profile) => profile ?? "compact";
		compactPresentationForMcpInputSchemaProfile = (profile) => resolveMcpInputSchemaProfile(profile) === "full" ? undefined : { budgetBytes: COMPACT_INPUT_SCHEMA_BUDGET_BYTES };
		profileConstraint$1 = "REA_MCP_INPUT_SCHEMA_PROFILE must be \"compact\" (default) or \"full\". The compact profile advertises bounded input schemas with fewer nested annotations; full preserves complete advertised input guidance.";
		parseMcpInputSchemaProfile = (value) => {
			if (value === undefined) return ok(undefined);
			const parsed = mcpInputSchemaProfileSchema.safeParse(value);
			return parsed.success ? ok(parsed.data) : err(new ConfigurationError(profileConstraint$1, { settings: [{
				setting: "REA_MCP_INPUT_SCHEMA_PROFILE",
				constraint: profileConstraint$1
			}] }));
		};
	})))();
}

//#endregion
//#region dist/config/mcpOutputSchemaProfile.js
var COMPACT_OUTPUT_SCHEMA_BUDGET_BYTES, mcpOutputSchemaProfileSchema, compactPresentationForMcpOutputSchemaProfile, profileConstraint, parseMcpOutputSchemaProfile;
function init_mcpOutputSchemaProfile() {
	return (init_mcpOutputSchemaProfile = __esmMin((() => {
		init_configurationErrors();
		init_result();
		COMPACT_OUTPUT_SCHEMA_BUDGET_BYTES = 4 * 1024;
		mcpOutputSchemaProfileSchema = z.enum([
			"full",
			"compact",
			"off"
		]);
		compactPresentationForMcpOutputSchemaProfile = (profile) => profile === "compact" ? { budgetBytes: COMPACT_OUTPUT_SCHEMA_BUDGET_BYTES } : undefined;
		profileConstraint = "REA_MCP_OUTPUT_SCHEMA_PROFILE must be \"full\" (default), \"compact\", or \"off\". The compact profile advertises every output schema within a 4,096-byte budget; the off profile omits output schemas. Both keep canonical server-side validation and complete structured content.";
		parseMcpOutputSchemaProfile = (value) => {
			if (value === undefined) return ok(undefined);
			const parsed = mcpOutputSchemaProfileSchema.safeParse(value);
			return parsed.success ? ok(parsed.data) : err(new ConfigurationError(profileConstraint, { settings: [{
				setting: "REA_MCP_OUTPUT_SCHEMA_PROFILE",
				constraint: profileConstraint
			}] }));
		};
	})))();
}

//#endregion
//#region dist/config/mcpStartupBudgets.js
var MCP_PHASE_BUDGET_FLOOR_MS, MCP_PHASE_BUDGET_MAXIMUM_MS, PHASES, phaseConstraint, phaseBudgetSchema, mcpInitializeBudgetMsSchema, mcpToolsListBudgetMsSchema, mcpFirstCatalogBudgetMsSchema, mcpDoctorDeadlineMsSchema, defaultBudget, parsePhaseBudget, parseMcpStartupBudgets, resolveMcpStartupBudgets, mcpPhaseBudgetRecovery;
function init_mcpStartupBudgets() {
	return (init_mcpStartupBudgets = __esmMin((() => {
		init_positiveDecimalInteger();
		init_configurationErrors();
		init_result();
		MCP_PHASE_BUDGET_FLOOR_MS = 1;
		MCP_PHASE_BUDGET_MAXIMUM_MS = 2147483647;
		PHASES = [
			{
				key: "initialize",
				setting: "REA_MCP_INITIALIZE_BUDGET_MS",
				phase: "MCP initialize phase budget",
				defaultMilliseconds: 15e3
			},
			{
				key: "toolsList",
				setting: "REA_MCP_TOOLS_LIST_BUDGET_MS",
				phase: "MCP tools/list phase budget",
				defaultMilliseconds: 5e3
			},
			{
				key: "firstCatalog",
				setting: "REA_MCP_FIRST_CATALOG_BUDGET_MS",
				phase: "MCP first-catalog phase budget",
				defaultMilliseconds: 2e4
			},
			{
				key: "doctor",
				setting: "REA_MCP_DOCTOR_DEADLINE_MS",
				phase: "MCP doctor startup deadline",
				defaultMilliseconds: 3e4
			}
		];
		phaseConstraint = (phase) => `${phase.setting} must be a positive decimal integer from ${String(1)} to ${String(MCP_PHASE_BUDGET_MAXIMUM_MS)} ms; the default is ${String(phase.defaultMilliseconds)} ms. Node schedules a delay above that maximum as 1 ms, so a larger value is refused.`;
		phaseBudgetSchema = (phase) => positiveDecimalIntegerSchema(1, MCP_PHASE_BUDGET_MAXIMUM_MS, phaseConstraint(phase));
		mcpInitializeBudgetMsSchema = phaseBudgetSchema(PHASES[0]);
		mcpToolsListBudgetMsSchema = phaseBudgetSchema(PHASES[1]);
		mcpFirstCatalogBudgetMsSchema = phaseBudgetSchema(PHASES[2]);
		mcpDoctorDeadlineMsSchema = phaseBudgetSchema(PHASES[3]);
		defaultBudget = (phase) => ({
			setting: phase.setting,
			phase: phase.phase,
			milliseconds: phase.defaultMilliseconds,
			source: "default",
			defaultMilliseconds: phase.defaultMilliseconds,
			floorMilliseconds: 1,
			maximumMilliseconds: MCP_PHASE_BUDGET_MAXIMUM_MS
		});
		parsePhaseBudget = (phase, value) => {
			if (value === undefined) return ok(defaultBudget(phase));
			const parsed = phaseBudgetSchema(phase).safeParse(value);
			return parsed.success ? ok({
				setting: phase.setting,
				phase: phase.phase,
				milliseconds: parsed.data,
				source: "setting",
				defaultMilliseconds: phase.defaultMilliseconds,
				floorMilliseconds: 1,
				maximumMilliseconds: MCP_PHASE_BUDGET_MAXIMUM_MS
			}) : err(new ConfigurationError(phaseConstraint(phase), { settings: [{
				setting: phase.setting,
				constraint: phaseConstraint(phase)
			}] }));
		};
		parseMcpStartupBudgets = (environment) => {
			const issues = [];
			const budgets = new Map();
			for (const phase of PHASES) {
				const parsed = parsePhaseBudget(phase, environment[phase.setting]);
				if (!parsed.ok) issues.push(...parsed.error.settings);
				else budgets.set(phase.key, parsed.value);
			}
			if (issues.length > 0) return err(new ConfigurationError(issues.map(({ constraint }) => constraint).join(" "), { settings: issues }));
			const initialize = budgets.get("initialize");
			const toolsList = budgets.get("toolsList");
			const firstCatalog = budgets.get("firstCatalog");
			const doctor = budgets.get("doctor");
			if (initialize === undefined || toolsList === undefined || firstCatalog === undefined || doctor === undefined) throw new Error("MCP startup budget resolution dropped a phase");
			return ok({
				initialize,
				toolsList,
				firstCatalog,
				doctor
			});
		};
		resolveMcpStartupBudgets = (environment) => {
			const parsed = parseMcpStartupBudgets(environment);
			if (!parsed.ok) throw parsed.error;
			return parsed.value;
		};
		mcpPhaseBudgetRecovery = (budget) => [`The effective ${budget.setting} value for the ${budget.phase} is ${String(budget.milliseconds)} ms (source ${budget.source}; default ${String(budget.defaultMilliseconds)} ms, floor ${String(budget.floorMilliseconds)} ms, maximum ${String(budget.maximumMilliseconds)} ms).`, `Set ${budget.setting} in the environment that starts REA to a positive decimal integer from ${String(budget.floorMilliseconds)} to ${String(budget.maximumMilliseconds)}, then restart REA.`].join(" ");
	})))();
}

//#endregion
//#region dist/config/mcpToolFamilies.js
var toolFamiliesConstraint, toolFamilyIdSchema, mcpToolFamiliesSchema, parseMcpToolFamilies;
function init_mcpToolFamilies() {
	return (init_mcpToolFamilies = __esmMin((() => {
		init_toolFamilyIds();
		init_configurationErrors();
		init_result();
		toolFamiliesConstraint = `REA_MCP_TOOL_FAMILIES must be a non-empty comma-separated subset of the tool family ids: ${TOOL_FAMILY_IDS.join(", ")}.`;
		toolFamilyIdSchema = z.enum(TOOL_FAMILY_IDS);
		mcpToolFamiliesSchema = z.string().transform((value) => [...new Set(value.split(",").map((family) => family.trim()).filter((family) => family !== ""))]).refine((families) => families.length > 0 && families.every(isToolFamilyId), toolFamiliesConstraint).transform((families) => families.map((family) => toolFamilyIdSchema.parse(family)));
		parseMcpToolFamilies = (value) => {
			if (value === undefined) return ok(undefined);
			const parsed = mcpToolFamiliesSchema.safeParse(value);
			return parsed.success ? ok(parsed.data) : err(new ConfigurationError(toolFamiliesConstraint, { settings: [{
				setting: "REA_MCP_TOOL_FAMILIES",
				constraint: toolFamiliesConstraint
			}] }));
		};
	})))();
}

//#endregion
//#region dist/domain/nativeConvention.js
var foldSegment, REACT_NATIVE_SEGMENTS, FLUTTER_SEGMENTS, UNITY_SEGMENTS, DESKTOP_IL2CPP_LIBRARIES, UNITY_PREDEFINED_ASSEMBLIES, nativeRuntimeConvention, isSwiftRuntimeLibrary, UNITY_IL2CPP_BACKUP_SUFFIX, desktopPathConventions;
function init_nativeConvention() {
	return (init_nativeConvention = __esmMin((() => {
		foldSegment = (segment) => segment.toLocaleLowerCase("en-US");
		REACT_NATIVE_SEGMENTS = new Set([
			"react.framework",
			"reactnative.framework",
			"libreactnative.so",
			"libreactnativejni.so",
			"libhermes_executor.so",
			"libhermes.so",
			"hermes.framework"
		]);
		FLUTTER_SEGMENTS = new Set(["libflutter.so", "flutter.framework"]);
		UNITY_SEGMENTS = new Set(["libunity.so", "unityframework.framework"]);
		DESKTOP_IL2CPP_LIBRARIES = new Set([
			"gameassembly.dll",
			"gameassembly.so",
			"gameassembly.dylib",
			"libil2cpp.so"
		]);
		UNITY_PREDEFINED_ASSEMBLIES = new Set(["assembly-csharp.dll", "assembly-csharp-firstpass.dll"]);
		nativeRuntimeConvention = (path) => {
			const segments = path.split("/");
			for (const [index, segment] of segments.entries()) {
				const folded = foldSegment(segment);
				if (index !== segments.length - 1 && !folded.endsWith(".framework")) continue;
				if (REACT_NATIVE_SEGMENTS.has(folded)) return "react-native";
				if (FLUTTER_SEGMENTS.has(folded)) return "flutter";
				if (UNITY_SEGMENTS.has(folded)) return "unity";
			}
			return null;
		};
		isSwiftRuntimeLibrary = (path) => path.split("/").some((segment) => /^libswift.+\.dylib$/u.test(foldSegment(segment)));
		UNITY_IL2CPP_BACKUP_SUFFIX = "_backupthisfolder_butdontshipitwithyourgame";
		desktopPathConventions = (path, rootName) => {
			const segments = path.split("/");
			const folded = segments.map(foldSegment);
			let unityManagedDirectory = null;
			let unityManagedIndex = -1;
			for (let index = 0; index + 2 < folded.length; index++) {
				const segment = folded[index];
				const namedDataDirectory = segment !== undefined && segment.length > 5 && segment.endsWith("_data");
				const bundleDataDirectory = segment === "data" && folded[index - 1] === "resources" && folded[index - 2] === "contents";
				if ((namedDataDirectory || bundleDataDirectory) && folded[index + 1] === "managed") {
					unityManagedDirectory = segments.slice(0, index + 2).join("/");
					unityManagedIndex = index + 1;
				}
			}
			const rooted = rootName === undefined ? folded : [foldSegment(rootName), ...folded];
			const shift = rooted.length - folded.length;
			let unityIl2cppBackupDirectory = null;
			let unityIl2cppBackupIndex = -1;
			for (let index = 0; index + 1 < rooted.length; index++) {
				const segment = rooted[index] ?? "";
				if (segment.length > UNITY_IL2CPP_BACKUP_SUFFIX.length && segment.endsWith(UNITY_IL2CPP_BACKUP_SUFFIX)) {
					unityIl2cppBackupDirectory = index < shift ? "." : segments.slice(0, index - shift + 1).join("/");
					unityIl2cppBackupIndex = index - shift;
				}
			}
			const name = folded.at(-1) ?? "";
			return {
				unityIl2cppBackupDirectory,
				unityIl2cppBackupAssembly: unityIl2cppBackupIndex === segments.length - 3 && folded[unityIl2cppBackupIndex + 1] === "managed" && UNITY_PREDEFINED_ASSEMBLIES.has(name),
				unityManagedDirectory,
				unityPredefinedAssembly: unityManagedIndex === segments.length - 2 && UNITY_PREDEFINED_ASSEMBLIES.has(name),
				il2cppLibrary: DESKTOP_IL2CPP_LIBRARIES.has(name),
				electronArchive: folded.at(-2) === "resources" && (name === "app.asar" || name === "default_app.asar"),
				unrealContainer: (name.endsWith(".pak") || name.endsWith(".utoc")) && folded.some((segment, index) => segment === "content" && folded[index + 1] === "paks" && index + 2 < folded.length)
			};
		};
	})))();
}

//#endregion
//#region dist/domain/apple/machoCpuIdentity.js
var CPU_SUBTYPE_CAPABILITY_MASK, machoCpuSubtypeBase, machoArchitectureName, machoArchitectureFamily;
function init_machoCpuIdentity() {
	return (init_machoCpuIdentity = __esmMin((() => {
		CPU_SUBTYPE_CAPABILITY_MASK = 4278190080;
		machoCpuSubtypeBase = (cpuSubtype) => cpuSubtype & ~CPU_SUBTYPE_CAPABILITY_MASK;
		machoArchitectureName = (cpuType, cpuSubtype) => {
			const subtype = machoCpuSubtypeBase(cpuSubtype);
			if (cpuType === 16777228) {
				if (subtype === 12) return "arm64e.x1";
				if (subtype === 2) return "arm64e";
				if (subtype === 1) return "arm64v8";
				return "arm64";
			}
			if (cpuType === 33554444) return "arm64_32";
			if (cpuType === 16777223) return subtype === 8 ? "x86_64h" : "x86_64";
			if (cpuType === 7) return "i386";
			if (cpuType === 12) return "arm";
			return `cpu-${cpuType.toString(16)}`;
		};
		machoArchitectureFamily = (architecture) => {
			if (architecture === "arm64e.x1") return "arm64e";
			if (architecture === "arm64v8") return "arm64";
			return architecture;
		};
	})))();
}

//#endregion
//#region dist/domain/sqlite/sqliteDatabase.js
var SQLITE_SCHEMA_TABLE_NAME, sqliteSchemaHasObjectDeclaration, SQLITE_ROW_LIMIT_DEFAULT, DEFAULT_SQLITE_WORKER_TIMEOUT_MS, MAX_SQLITE_WORKER_TIMEOUT_MS, workerTimeout, nonnegative, hex, encoding, artifactSchema, inspectSqliteDatabaseInputSchema, sqliteValueSchema, sqliteDatabaseSchema, sqliteInspectionParameters, sqliteSchemaScope;
function init_sqliteDatabase() {
	return (init_sqliteDatabase = __esmMin((() => {
		init_localPath();
		SQLITE_SCHEMA_TABLE_NAME = "sqlite_schema";
		sqliteSchemaHasObjectDeclaration = (name) => name !== SQLITE_SCHEMA_TABLE_NAME;
		SQLITE_ROW_LIMIT_DEFAULT = 20;
		DEFAULT_SQLITE_WORKER_TIMEOUT_MS = 3e4;
		MAX_SQLITE_WORKER_TIMEOUT_MS = 2147483647;
		workerTimeout = z.number().int().min(1).max(MAX_SQLITE_WORKER_TIMEOUT_MS);
		nonnegative = z.int().nonnegative();
		hex = z.string().regex(/^(?:[0-9a-f]{2})*$/);
		encoding = z.enum([
			"UTF-8",
			"UTF-16le",
			"UTF-16be"
		]);
		artifactSchema = z.strictObject({
			path: z.string().min(1),
			sha256: z.string().regex(/^[0-9a-f]{64}$/),
			bytes: nonnegative
		});
		inspectSqliteDatabaseInputSchema = z.strictObject({
			path: absoluteLocalPathStringSchema.describe("Absolute path to an offline SQLite database snapshot"),
			worker_timeout_ms: workerTimeout.optional().describe(`Deadline in milliseconds for worker startup, queries and reply writing (default ${String(DEFAULT_SQLITE_WORKER_TIMEOUT_MS)}), not snapshot acquisition or the whole call. Allow client headroom for acquisition, reply reads, cleanup and delivery. Fixed byte/heap limits do not change.`),
			table: z.string().optional().describe("Exact ordinary table name; views and virtual/shadow tables are not executed"),
			columns: z.array(z.string()).min(1).optional().describe("Exact row columns in caller-selected order; requires table. Omit to sample all visible columns."),
			schema_scope: z.enum([
				"inventory",
				"selected_table",
				"database"
			]).optional().describe("Default: compact inventory without a table, or detailed selected-table schema with a table. selected_table requires table. Database explicitly expands all stored declarations and supported columns."),
			row_limit: z.int().min(1).optional().describe("Selected-table sample size, default 20; subject to byte and worker resource limits")
		}).describe("When schema_scope is selected_table, also provide table.").superRefine((input, context) => {
			if (input.row_limit !== undefined && input.table === undefined) context.addIssue({
				code: "custom",
				path: ["row_limit"],
				message: "row_limit requires an explicit table selection"
			});
			if (input.columns !== undefined && input.table === undefined) context.addIssue({
				code: "custom",
				path: ["columns"],
				message: "columns requires an explicit table selection"
			});
			if (input.schema_scope === "selected_table" && input.table === undefined) context.addIssue({
				code: "custom",
				path: ["schema_scope"],
				message: "selected_table schema scope requires table"
			});
		}).meta({
			dependentRequired: {
				row_limit: ["table"],
				columns: ["table"]
			},
			if: {
				properties: { schema_scope: { const: "selected_table" } },
				required: ["schema_scope"]
			},
			then: { required: ["table"] }
		});
		sqliteValueSchema = z.discriminatedUnion("type", [
			z.strictObject({ type: z.literal("null") }),
			z.strictObject({
				type: z.literal("integer"),
				value: z.string().regex(/^-?(?:0|[1-9][0-9]*)$/)
			}),
			z.strictObject({
				type: z.literal("real"),
				value: z.union([z.number(), z.enum([
					"Infinity",
					"-Infinity",
					"-0"
				])])
			}),
			z.strictObject({
				type: z.literal("text"),
				value: z.string(),
				bytes_hex: hex,
				encoding
			}),
			z.strictObject({
				type: z.literal("blob"),
				hex
			})
		]);
		sqliteDatabaseSchema = z.strictObject({
			artifact: artifactSchema,
			wal: artifactSchema.nullable(),
			engine: z.strictObject({
				name: z.literal("SQLite"),
				version: z.string().min(1)
			}),
			worker_timeout_ms: workerTimeout.exactOptional().describe("Actual parent-supervised worker deadline in milliseconds; absent in historical Evidence means unknown, not the default."),
			database_encoding: encoding,
			schema: z.strictObject({
				scope: z.enum([
					"inventory",
					"selected_table",
					"database"
				]),
				completeness: z.literal("complete").describe("Complete within the indicated schema scope; inventory omits declarations and column details"),
				tables: z.array(z.strictObject({
					name: z.string(),
					sql: z.string().nullable().optional(),
					root_page: nonnegative,
					kind: z.enum([
						"table",
						"virtual",
						"shadow",
						"unknown"
					]).describe("Unknown means a possible shadow table of an unresolved virtual table; its rows cannot be inspected"),
					without_rowid: z.boolean(),
					strict: z.boolean(),
					column_count: nonnegative.nullable(),
					columns_completeness: z.enum([
						"complete",
						"unsupported",
						"not_requested"
					]),
					columns: z.array(z.strictObject({
						cid: nonnegative,
						name: z.string(),
						declared_type: z.string(),
						not_null: z.boolean(),
						default_sql: z.string().nullable(),
						primary_key_position: nonnegative,
						hidden: z.union([
							z.literal(0),
							z.literal(1),
							z.literal(2),
							z.literal(3)
						])
					}))
				})),
				indexes: z.array(z.strictObject({
					name: z.string(),
					table: z.string(),
					sql: z.string().nullable().optional(),
					root_page: nonnegative
				})),
				views: z.array(z.strictObject({
					name: z.string(),
					sql: z.string().nullable().optional()
				})),
				triggers: z.array(z.strictObject({
					name: z.string(),
					table: z.string(),
					sql: z.string().nullable().optional()
				}))
			}),
			rows: z.strictObject({
				table: z.string(),
				columns: z.array(z.string()),
				values: z.array(z.array(sqliteValueSchema)),
				row_limit: z.int().min(1),
				returned_rows: nonnegative,
				truncated: z.boolean(),
				order: z.literal("unspecified")
			}).nullable(),
			limitations: z.array(z.string())
		}).superRefine((report, context) => {
			const rows = report.rows;
			if (rows !== null && (rows.returned_rows !== rows.values.length || rows.returned_rows > rows.row_limit || rows.values.some((row) => row.length !== rows.columns.length))) context.addIssue({
				code: "custom",
				path: ["rows"],
				message: "Selected row counts and column dimensions must match the retained values"
			});
		});
		sqliteInspectionParameters = (input) => ({
			path: input.path,
			...input.worker_timeout_ms === undefined ? {} : { worker_timeout_ms: input.worker_timeout_ms },
			...input.table === undefined ? {} : { table: input.table },
			...input.columns === undefined ? {} : { columns: input.columns },
			...input.schema_scope === undefined ? {} : { schema_scope: input.schema_scope },
			...input.row_limit === undefined ? {} : { row_limit: input.row_limit }
		});
		sqliteSchemaScope = (input) => input.schema_scope ?? (input.table === undefined ? "inventory" : "selected_table");
	})))();
}

//#endregion
//#region dist/domain/native/peResources.js
var uint, range$1, identity, MAX_INSPECT_PE_FILE_BYTES, MAX_INSPECT_PE_DIRECTORY_ENTRIES, inspectPeResourcesInputSchema, peResourcesSchema;
function init_peResources() {
	return (init_peResources = __esmMin((() => {
		init_localPath();
		uint = z.number().int().min(0).max(4294967295);
		range$1 = z.strictObject({
			offset: uint,
			bytes: uint
		});
		identity = z.discriminatedUnion("kind", [z.strictObject({
			kind: z.literal("id"),
			id: uint
		}), z.strictObject({
			kind: z.literal("name"),
			name: z.string(),
			utf16le_hex: z.string().regex(/^(?:[0-9a-f]{4})*$/),
			location: range$1
		})]);
		MAX_INSPECT_PE_FILE_BYTES = 536870912;
		MAX_INSPECT_PE_DIRECTORY_ENTRIES = 65536;
		inspectPeResourcesInputSchema = z.strictObject({
			path: absoluteLocalPathStringSchema.describe("Absolute filesystem path to a PE image"),
			max_file_bytes: z.number().int().min(64).max(MAX_INSPECT_PE_FILE_BYTES).default(67108864).describe("Maximum stable artifact bytes to read (default 64 MiB)"),
			max_entries: z.number().int().min(1).max(MAX_INSPECT_PE_DIRECTORY_ENTRIES).default(16384).describe("Maximum resource directory entries to examine; exceeding the budget fails without partial success")
		});
		peResourcesSchema = z.strictObject({
			artifact: z.strictObject({
				path: z.string().min(1),
				sha256: z.string().regex(/^[a-f0-9]{64}$/),
				bytes: uint
			}),
			format: z.enum(["pe32", "pe32-plus"]),
			machine: uint,
			directory: z.strictObject({
				rva: uint,
				location: range$1,
				data_directory_location: range$1
			}).nullable(),
			directories: z.array(z.strictObject({
				path: z.array(identity).max(2).describe("Type/name identities leading to this directory; [] for the root"),
				entry_locations: z.array(range$1).max(2).describe("Incoming entry file ranges corresponding to path"),
				location: range$1,
				characteristics: uint,
				timestamp: uint,
				major_version: uint,
				minor_version: uint,
				named_entries: uint,
				id_entries: uint
			})),
			resources: z.array(z.strictObject({
				index: uint,
				type: identity,
				name: identity,
				language: identity,
				entry_locations: z.array(range$1).length(3),
				data_entry_location: range$1,
				code_page: uint,
				reserved: uint,
				payload: z.strictObject({
					rva: uint,
					location: range$1,
					sha256: z.string().regex(/^[a-f0-9]{64}$/)
				})
			})),
			icon_groups: z.array(z.strictObject({
				resource_index: uint,
				images: z.array(z.strictObject({
					location: range$1,
					width: uint,
					height: uint,
					color_count: uint,
					reserved: uint,
					planes: uint,
					bit_count: uint,
					declared_bytes: uint,
					resource_id: uint,
					candidate_resource_indices: z.array(uint),
					same_language_resource_index: uint.nullable(),
					size_matches: z.boolean().nullable()
				}))
			})),
			coverage: z.strictObject({
				status: z.literal("complete"),
				examined_entries: uint,
				resources: uint
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/identity.js
var PRODUCT_IDENTITY, SDK_IDENTITY;
function init_identity() {
	return (init_identity = __esmMin((() => {
		PRODUCT_IDENTITY = {
			displayName: "REA",
			packageName: PACKAGE_METADATA.name,
			packageSpecifier: `${PACKAGE_METADATA.name}@latest`,
			registrationPackageSpecifier: `${PACKAGE_METADATA.name}@${PACKAGE_METADATA.version}`,
			packageVersion: PACKAGE_METADATA.version,
			cliBinary: "rea",
			mcpCommand: `npx -y ${PACKAGE_METADATA.name}@${PACKAGE_METADATA.version} mcp`,
			mcpServerKey: "rea",
			skillName: "reverse-engineer-anything",
			skillVersion: PACKAGE_METADATA.skillVersion,
			configFileName: "rea.json"
		};
		SDK_IDENTITY = {
			server: PACKAGE_METADATA.serverSdkVersion,
			client_test: PACKAGE_METADATA.clientSdkVersion,
			core: PACKAGE_METADATA.coreSdkVersion
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptElectronMemberWrites.js
/**
* Index writes through possible lexical object identities. Resolve the complete
* object before appending the written key: self-reference properties can denote
* the same object, while replacing that property is a distinct write.
*/
function* collectJavaScriptIdentityWritesSteps(program, erasedSyntaxNodes, origin, intrinsicInvocation, staticString, freshObject, retain, observeInvocation) {
	const objectMutators = new Set([
		"defineProperty",
		"defineProperties",
		"assign",
		"setPrototypeOf"
	]);
	const reflectMutators = new Set([
		"set",
		"deleteProperty",
		"defineProperty",
		"setPrototypeOf"
	]);
	const keyedMutators = new Set([
		"set",
		"deleteProperty",
		"defineProperty"
	]);
	yield* traverseJavaScriptValueAstSteps(program, erasedSyntaxNodes, { enter: (node) => {
		if (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node) || t.isTaggedTemplateExpression(node)) {
			const invocation = t.isNewExpression(node) || t.isTaggedTemplateExpression(node) ? undefined : intrinsicInvocation(node);
			observeInvocation?.(node, invocation);
			if (t.isNewExpression(node) || t.isTaggedTemplateExpression(node)) return;
			if (invocation?.kind === "opaque") {
				for (const scope of origin(node, "opaque-call", node)) retain(node, scope);
				return;
			}
			const callee = invocation?.path;
			const arguments_ = invocation?.arguments;
			const method = callee?.at(-1);
			const owner = callee?.length === 3 ? callee[1] : undefined;
			if (owner === "Object" && objectMutators.has(method ?? "") || owner === "Reflect" && reflectMutators.has(method ?? "")) {
				const targets = owner === "Reflect" && method === "set" && arguments_ !== undefined && (arguments_.length >= 4 || arguments_.some(t.isSpreadElement)) ? [arguments_[0], arguments_.some(t.isSpreadElement) ? undefined : arguments_[3]] : [arguments_?.[0]];
				for (const target of targets) {
					if (target === undefined || t.isSpreadElement(target)) {
						for (const scope of origin(node, "opaque-call", node)) retain(node, scope);
					}
					if (t.isNode(target) && !t.isSpreadElement(target)) {
						const identities = origin(target, "member", node);
						if (identities.length > 0) {
							const key = keyedMutators.has(method ?? "") ? [staticString(arguments_?.[1]) ?? null] : [null];
							for (const identity of identities) retain(node, [...identity, ...key]);
						} else if (!freshObject(target)) {
							for (const scope of origin(node, "opaque-call", node)) retain(node, scope);
						}
					}
				}
			}
		}
		const target = semanticWriteSiteTarget(node);
		if (target === null) return;
		for (const leaf of semanticWriteTargets(target)) {
			if (t.isIdentifier(leaf)) {
				for (const identity of origin(leaf, "binding", node)) retain(node, identity);
				continue;
			}
			const member = unwrapJavaScriptExpression(leaf).node;
			if (!t.isMemberExpression(member) && !t.isOptionalMemberExpression(member)) continue;
			const key = semanticStaticPropertyKey(member.property, member.computed);
			for (const identity of origin(member.object, "member", node)) retain(node, [...identity, key]);
		}
	} });
}
var ELECTRON_MODULE, electronExportPath, ELECTRON_IDENTITY_LIMITATION, electronMemberPath;
function init_javascriptElectronMemberWrites() {
	return (init_javascriptElectronMemberWrites = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticTraversal();
		ELECTRON_MODULE = /^electron(?:\/(?:common|main|renderer|utility))?$/u;
		electronExportPath = (importedPath) => importedPath[0] === "default" ? importedPath.slice(1) : importedPath;
		ELECTRON_IDENTITY_LIMITATION = "Electron API identity follows proven lexical module aliases and structurally verified module-namespace interop. Other reassignments, dynamic selections, and visibly overwritten namespace members are unresolved; missing findings do not establish absence. Arbitrary call side effects and runtime registration are not evaluated.";
		electronMemberPath = (node) => {
			let root = unwrapJavaScriptExpression(node).node;
			const members = [];
			while (t.isMemberExpression(root) || t.isOptionalMemberExpression(root)) {
				members.push(semanticStaticPropertyKey(root.property, root.computed));
				root = unwrapJavaScriptExpression(root.object).node;
			}
			return {
				root,
				members: members.toReversed()
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticState.js
var semanticPrototypeOwners, recordSemanticValueLimit, semanticStableInitializer, currentSemanticScope, semanticScopeId, semanticBindingId, resolveSemanticBindingState, semanticResolutionBlocked, semanticScopeForNode, semanticBindingLookupFromScope, semanticBindingLookupAt, resolveSemanticBindingFromScope, semanticUnscopablesKey, semanticWithRequireLookup, semanticWithPropertyName, finalSemanticWithSymbolProperty, semanticWithPrototypeKind, finalSemanticWithStringProperty, isSemanticWithPrimitive, semanticVariableScope;
function init_javascriptSemanticState() {
	return (init_javascriptSemanticState = __esmMin((() => {
		init_javascriptAstValues();
		semanticPrototypeOwners = [
			"Object",
			"Array",
			"String",
			"Function",
			"Number",
			"Boolean",
			"RegExp",
			"BigInt"
		];
		recordSemanticValueLimit = (state, value) => {
			if (value.status === "unknown" && value.resourceLimit !== undefined) state.valueResourceLimits.add(value.resourceLimit);
		};
		semanticStableInitializer = (binding, state) => {
			const [initializer] = binding?.initializers ?? [];
			const [definition] = binding?.definitions ?? [];
			return binding !== undefined && (definition?.kind === "variable" && binding.definitions.every(({ kind }) => kind === "variable") || binding.definitions.length === 1 && (definition?.kind === "function" || definition?.kind === "class")) && binding.initializers.length === 1 && initializer !== undefined && !state.conditionallySkippedExpressions.has(initializer.node) ? initializer : undefined;
		};
		currentSemanticScope = (stack) => {
			const scope = stack.at(-1);
			if (scope === undefined) throw new TypeError("Missing semantic scope");
			return scope;
		};
		semanticScopeId = (kind, node) => `scope:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`;
		semanticBindingId = (scopeId, name) => `${scopeId}:binding:${encodeURIComponent(name)}`;
		resolveSemanticBindingState = (state, node, name) => {
			const lookup = semanticBindingLookupAt(state, node, name);
			return lookup.kind === "binding" ? lookup.binding : undefined;
		};
		semanticResolutionBlocked = (state, node, name) => {
			const lookup = semanticBindingLookupAt(state, node, name);
			return lookup.kind !== "binding" && lookup.kind !== "ambient";
		};
		semanticScopeForNode = (state, node) => {
			let candidate = node;
			while (candidate !== undefined) {
				const scope = state.scopeByNode.get(candidate);
				if (scope !== undefined) {
					let descendant = node;
					while (descendant !== undefined && descendant !== candidate) {
						state.scopeByNode.set(descendant, scope);
						descendant = state.parentsByNode.get(descendant);
					}
					return scope;
				}
				candidate = state.parentsByNode.get(candidate);
			}
			return undefined;
		};
		semanticBindingLookupFromScope = (scope, name, state) => {
			let uncertain = false;
			while (scope !== undefined) {
				const binding = scope.bindings.get(name);
				if (binding !== undefined) return {
					kind: uncertain ? "uncertain-binding" : "binding",
					binding
				};
				if (name === "arguments" && scope.implicitArguments === true) return { kind: "implicit-arguments" };
				if (!scope.bindingsComplete) {
					if (scope.dynamicWithStatement === undefined) return { kind: "unknown" };
					const lookup = semanticWithRequireLookup(state, scope.dynamicWithStatement, name);
					if (lookup === "captures") return { kind: "captured" };
					if (lookup === "unknown") uncertain = true;
				}
				scope = scope.parentScopeId === null ? undefined : state.scopesById.get(scope.parentScopeId);
			}
			return { kind: uncertain ? "uncertain-ambient" : "ambient" };
		};
		semanticBindingLookupAt = (state, node, name) => semanticBindingLookupFromScope(semanticScopeForNode(state, node), name, state);
		resolveSemanticBindingFromScope = (scope, name, state) => {
			const lookup = semanticBindingLookupFromScope(scope, name, state);
			return lookup.kind === "binding" ? lookup.binding : undefined;
		};
		semanticUnscopablesKey = Symbol("semantic-unscopables-key");
		semanticWithRequireLookup = (state, statement, name) => {
			if (name !== "require") return "unknown";
			const object = unwrapJavaScriptExpression(statement.object).node;
			if (!t.isObjectExpression(object)) return "unknown";
			let ownRequire = false;
			let hasUnknownOwnProperties = false;
			let prototypeIsNull = false;
			let unknownPrototype = false;
			for (const property of object.properties) {
				if (t.isSpreadElement(property)) {
					hasUnknownOwnProperties = true;
					continue;
				}
				const key = semanticWithPropertyName(property.key, property.computed, state);
				if (key === "require") ownRequire = true;
				else if (key === "__proto__" && t.isObjectProperty(property) && !property.computed && !property.shorthand) {
					const prototype = unwrapJavaScriptExpression(property.value).node;
					if (t.isNullLiteral(prototype)) prototypeIsNull = true;
					else unknownPrototype = true;
				} else if (key === null && property.computed) {
					hasUnknownOwnProperties = true;
				}
			}
			if (ownRequire) {
				const unscopablesValue = finalSemanticWithSymbolProperty(object, state);
				if (unscopablesValue === "unknown") return "unknown";
				if (unscopablesValue === undefined) return prototypeIsNull || !unknownPrototype && state.prototypeRequireMutationObserved === false ? "captures" : "unknown";
				const unscopables = unwrapJavaScriptExpression(unscopablesValue).node;
				if (!t.isObjectExpression(unscopables)) return isSemanticWithPrimitive(unscopables) ? "captures" : "unknown";
				const entry = finalSemanticWithStringProperty(unscopables, "require");
				if (entry === "unknown") return "unknown";
				if (entry === undefined) {
					const prototype = semanticWithPrototypeKind(unscopables);
					return prototype === "null" || prototype === "ordinary" && state.prototypeRequireMutationObserved === false ? "captures" : "unknown";
				}
				const truthiness = staticJavaScriptTruthiness(entry);
				return truthiness === true ? "skips" : truthiness === false ? "captures" : "unknown";
			}
			if (hasUnknownOwnProperties || unknownPrototype) return "unknown";
			if (prototypeIsNull) return "skips";
			return state.prototypeRequireMutationObserved === false ? "skips" : "unknown";
		};
		semanticWithPropertyName = (key, computed, state) => {
			if (computed && t.isMemberExpression(key) && !key.computed && t.isIdentifier(key.object, { name: "Symbol" }) && semanticStaticPropertyKey(key.property, false) === "unscopables" && resolveSemanticBindingState(state, key.object, "Symbol") === undefined && !semanticResolutionBlocked(state, key.object, "Symbol")) return semanticUnscopablesKey;
			return semanticStaticPropertyKey(key, computed);
		};
		finalSemanticWithSymbolProperty = (object, state) => {
			for (let index = object.properties.length - 1; index >= 0; index -= 1) {
				const property = object.properties[index];
				if (property === undefined || t.isSpreadElement(property)) return "unknown";
				const name = semanticWithPropertyName(property.key, property.computed, state);
				if (name === semanticUnscopablesKey) return t.isObjectProperty(property) ? property.value : "unknown";
				if (name === null && property.computed) return "unknown";
			}
			return undefined;
		};
		semanticWithPrototypeKind = (object) => {
			for (const property of object.properties) {
				if (t.isObjectProperty(property) && !property.computed && !property.shorthand && t.isIdentifier(property.key, { name: "__proto__" })) return t.isNullLiteral(unwrapJavaScriptExpression(property.value).node) ? "null" : "other";
			}
			return "ordinary";
		};
		finalSemanticWithStringProperty = (object, sought) => {
			for (let index = object.properties.length - 1; index >= 0; index -= 1) {
				const property = object.properties[index];
				if (property === undefined || t.isSpreadElement(property)) return "unknown";
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === sought) return t.isObjectProperty(property) ? property.value : "unknown";
				if (name === null && property.computed) return "unknown";
			}
			return undefined;
		};
		isSemanticWithPrimitive = (node) => t.isNullLiteral(node) || t.isBooleanLiteral(node) || t.isStringLiteral(node) || t.isNumericLiteral(node) || t.isBigIntLiteral(node) || t.isUnaryExpression(node, { operator: "-" }) && (t.isNumericLiteral(node.argument) || t.isBigIntLiteral(node.argument));
		semanticVariableScope = (scope, parent, state) => {
			if (!(parent !== null && t.isVariableDeclaration(parent, { kind: "var" }))) return scope;
			let candidate = scope;
			while (candidate.kind === "block" || candidate.kind === "catch") {
				const outer = candidate.parentScopeId === null ? undefined : state.scopesById.get(candidate.parentScopeId);
				if (outer === undefined) break;
				candidate = outer;
			}
			return candidate;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCopiedReferencePaths.js
var semanticCopiedReferencePath;
function init_javascriptSemanticCopiedReferencePaths() {
	return (init_javascriptSemanticCopiedReferencePaths = __esmMin((() => {
		init_javascriptSemanticPropertyPaths();
		init_unicodeCodePointOrder();
		semanticCopiedReferencePath = (initializer, path, effect) => {
			const offset = initializer.copyProjectionOffset;
			if (offset === undefined) return [...initializer.projection, ...path];
			const copiedPath = [...initializer.projection.slice(offset + 1), ...path];
			if (effect === "identity" && copiedPath.length === 0) return null;
			if (effect === "write" && copiedPath.length < 2) return null;
			let [key, ...remaining] = copiedPath;
			if (initializer.copyKind === "array-rest") {
				const startIndex = initializer.copyStartIndex ?? 0;
				if (key === undefined || key === null) key = {
					excludedKeys: [],
					startIndex
				};
				else if (typeof key === "object") key = {
					excludedKeys: key.excludedKeys.flatMap((name) => {
						const index = semanticArrayIndex(name);
						return index === null ? [] : [String(index + startIndex)];
					}),
					startIndex: (key.startIndex ?? 0) + startIndex
				};
				else {
					const index = semanticArrayIndex(key);
					if (index === null) return null;
					key = index + startIndex;
				}
			} else {
				const excludedKeys = initializer.copyExcludedKeys ?? [];
				if (key === undefined || key === null) key = { excludedKeys };
				else if (typeof key === "object") key = {
					...key,
					excludedKeys: [...new Set([...key.excludedKeys, ...excludedKeys])].sort(compareUnicodeCodePoints)
				};
				else if (excludedKeys.includes(String(key))) return null;
			}
			return [
				...initializer.projection.slice(0, offset),
				key,
				...remaining
			];
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticEvaluationOrder.js
var preserveGrouping, semanticMethodDefinitionExpression, semanticIterationCardinality, delayedInstanceFieldValue, semanticBranchMayBeSkipped, optionalChainMayShortCircuit, emptyAbruptLabels, emptyAbruptSummary, abruptSummaries, abruptPrefixes, abruptSummary, semanticPriorStatementMayExit;
function init_javascriptSemanticEvaluationOrder() {
	return (init_javascriptSemanticEvaluationOrder = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticTraversal();
		preserveGrouping = { stopAtParentheses: true };
		semanticMethodDefinitionExpression = (parent, child) => (t.isObjectMethod(parent) || t.isClassMethod(parent) || t.isClassPrivateMethod(parent)) && javaScriptDefinitionExpression(parent, child);
		semanticIterationCardinality = (loop, prototypeMayAffectEnumeration) => {
			const iterable = unwrapJavaScriptExpression(loop.right).node;
			const literal = readExactJavaScriptLiteral(iterable);
			if (t.isForOfStatement(loop)) {
				if (prototypeMayAffectEnumeration !== false) return "unknown";
				if (t.isArrayExpression(iterable)) {
					if (iterable.elements.length === 0) return "empty";
					if (iterable.elements.some((element) => element === null || !t.isSpreadElement(element))) return "nonempty";
					return "unknown";
				}
				if (literal.found && typeof literal.value === "string") return literal.value.length === 0 ? "empty" : "nonempty";
				return "unknown";
			}
			if (t.isObjectExpression(iterable)) {
				let prototype;
				for (const property of iterable.properties) {
					if (t.isSpreadElement(property)) return "unknown";
					const key = semanticStaticPropertyKey(property.key, property.computed);
					if (t.isObjectProperty(property) && !property.computed && !property.shorthand && key === "__proto__") {
						prototype = unwrapJavaScriptExpression(property.value).node;
						continue;
					}
					if (key === null) return "unknown";
					return "nonempty";
				}
				if (t.isNullLiteral(prototype)) return "empty";
				if (prototype !== undefined && !readExactJavaScriptLiteral(prototype).found) return "unknown";
				return prototypeMayAffectEnumeration === false ? "empty" : "unknown";
			}
			if (literal.found && literal.value === null) return "empty";
			if (literal.found && typeof literal.value === "string" && literal.value.length > 0) return "nonempty";
			if (literal.found) return prototypeMayAffectEnumeration === false ? "empty" : "unknown";
			return "unknown";
		};
		delayedInstanceFieldValue = (parent, child) => (t.isClassProperty(parent) || t.isClassPrivateProperty(parent) || t.isClassAccessorProperty(parent)) && !parent.static && parent.value === child;
		semanticBranchMayBeSkipped = (parent, child) => {
			if (delayedInstanceFieldValue(parent, child)) return true;
			if (t.isIfStatement(parent)) return child === parent.consequent || child === parent.alternate;
			if (t.isSwitchCase(parent)) return true;
			if (t.isTryStatement(parent)) return child === parent.block || child === parent.handler;
			if (t.isForStatement(parent)) return child === parent.body || child === parent.update;
			if (t.isWhileStatement(parent)) return child === parent.body;
			if (t.isDoWhileStatement(parent)) return child === parent.test;
			if (t.isForInStatement(parent) || t.isForOfStatement(parent)) return child === parent.left || child === parent.body;
			if (t.isLogicalExpression(parent)) return child === parent.right;
			if (t.isAssignmentPattern(parent)) return child === parent.right;
			if (t.isAssignmentExpression(parent)) return [
				"&&=",
				"||=",
				"??="
			].includes(parent.operator) && child === parent.right;
			if (t.isConditionalExpression(parent)) return child === parent.consequent || child === parent.alternate;
			if (t.isOptionalCallExpression(parent) || t.isCallExpression(parent)) return parent.arguments.includes(child) && (t.isOptionalCallExpression(parent) && parent.optional || optionalChainMayShortCircuit(parent.callee));
			if (t.isOptionalMemberExpression(parent)) return parent.computed && child === parent.property && (parent.optional || optionalChainMayShortCircuit(parent.object));
			return false;
		};
		optionalChainMayShortCircuit = (expression) => {
			let current = expression;
			while (true) {
				if (current.extra?.parenthesized === true) return false;
				const unwrapped = unwrapJavaScriptExpression(current, preserveGrouping).node;
				if (unwrapped !== current) {
					current = unwrapped;
					continue;
				}
				if (t.isOptionalMemberExpression(current)) {
					if (current.optional) return true;
					current = current.object;
				} else if (t.isMemberExpression(current)) current = current.object;
				else if (t.isOptionalCallExpression(current)) {
					if (current.optional) return true;
					current = current.callee;
				} else if (t.isCallExpression(current)) current = current.callee;
				else return false;
			}
		};
		emptyAbruptLabels = new Set();
		emptyAbruptSummary = {
			breaks: emptyAbruptLabels,
			continues: emptyAbruptLabels
		};
		abruptSummaries = new WeakMap();
		abruptPrefixes = new WeakMap();
		abruptSummary = (root) => {
			const pending = [{
				node: root,
				visited: false
			}];
			while (pending.length > 0) {
				const { node, visited } = pending.pop();
				if (abruptSummaries.has(node)) continue;
				const children = t.isFunction(node) || t.isClass(node) ? [] : childNodes(node).filter((child) => t.isStatement(child) || t.isSwitchCase(child) || t.isCatchClause(child));
				if (!visited) {
					pending.push({
						node,
						visited: true
					});
					for (const child of children) if (!abruptSummaries.has(child)) pending.push({
						node: child,
						visited: false
					});
					continue;
				}
				let breaks, continues;
				if (t.isBreakStatement(node)) (breaks ??= new Set()).add(node.label?.name ?? null);
				if (t.isContinueStatement(node)) (continues ??= new Set()).add(node.label?.name ?? null);
				for (const child of children) {
					const summary = abruptSummaries.get(child);
					for (const label of summary.breaks) (breaks ??= new Set()).add(label);
					for (const label of summary.continues) (continues ??= new Set()).add(label);
				}
				if (t.isLoop(node) || t.isSwitchStatement(node)) breaks?.delete(null);
				if (t.isLoop(node)) continues?.delete(null);
				if (t.isLabeledStatement(node)) {
					breaks?.delete(node.label.name);
					continues?.delete(node.label.name);
				}
				abruptSummaries.set(node, (breaks?.size ?? 0) > 0 || (continues?.size ?? 0) > 0 ? {
					breaks: breaks ?? emptyAbruptLabels,
					continues: continues ?? emptyAbruptLabels
				} : emptyAbruptSummary);
			}
			return abruptSummaries.get(root);
		};
		semanticPriorStatementMayExit = (parent, child) => {
			if (!t.isBlockStatement(parent) && !t.isProgram(parent)) return false;
			let skipped = abruptPrefixes.get(parent);
			if (skipped === undefined) {
				const prefixes = new Set();
				let exits = false;
				for (const statement of parent.body) {
					if (exits) prefixes.add(statement);
					const summary = abruptSummary(statement);
					exits ||= summary.breaks.size > 0 || summary.continues.size > 0;
				}
				skipped = prefixes;
				abruptPrefixes.set(parent, skipped);
			}
			return skipped.has(child);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticIterationSources.js
var semanticStoredSourceSelection, add, project, visit, emptySourceFacts, guardedExecutions, guardedBodyMayCall, sourceFacts, semanticSourceFacts, semanticIterationSources, semanticPatternPropertyReadSources, semanticPropertyReadSources;
function init_javascriptSemanticIterationSources() {
	return (init_javascriptSemanticIterationSources = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticPropertyPaths();
		init_unicodeCodePointOrder();
		init_javascriptSemanticCopiedReferencePaths();
		init_javascriptSemanticEvaluationOrder();
		init_javascriptSemanticTraversal();
		semanticStoredSourceSelection = (source, selected) => {
			const copy = source.projection.at(-1);
			if (copy === null || typeof copy !== "object") return { projection: [...source.projection, ...selected] };
			const projection = semanticCopiedReferencePath({
				projection: source.projection,
				copyProjectionOffset: source.projection.length - 1,
				copyKind: copy.startIndex === undefined ? "object-rest" : "array-rest",
				copyExcludedKeys: copy.excludedKeys,
				...copy.startIndex === undefined ? {} : { copyStartIndex: copy.startIndex }
			}, selected, "identity");
			return projection === null ? null : {
				projection,
				capturedSelectionDepth: source.projection.length,
				...copy.startIndex === undefined ? { ownEnumerable: true } : {}
			};
		};
		add = (sources, source, mutation, guards, kind = "iteration", target) => {
			sources.push({
				kind,
				node: source.node,
				projection: source.projection,
				mutation,
				...guards,
				...target === undefined ? {} : { target }
			});
		};
		project = (source, key) => {
			if (source === undefined) return undefined;
			const index = key === null ? null : semanticArrayIndex(key);
			return {
				node: source.node,
				projection: [...source.projection, source.restStartIndex !== undefined && index !== null ? source.restStartIndex + index : key]
			};
		};
		visit = (context, pattern, source, guards = {}) => {
			pattern = unwrapJavaScriptExpression(pattern).node;
			const { sources, mutation } = context;
			if (t.isMemberExpression(pattern)) {
				if (source !== undefined) add(sources, source.restStartIndex === undefined ? source : {
					node: source.node,
					projection: [...source.projection, {
						excludedKeys: [],
						startIndex: source.restStartIndex
					}]
				}, mutation, guards, "reference-store", pattern);
				return;
			}
			if (t.isTSParameterProperty(pattern)) {
				visit(context, pattern.parameter, source, guards);
				return;
			}
			if (t.isAssignmentPattern(pattern)) {
				visit(context, pattern.left, source, {
					...guards,
					requiredSources: [...guards.requiredSources ?? [], ...source === undefined ? [] : [{
						...source,
						...guards.iterationSources === undefined ? {} : { iterationSources: guards.iterationSources }
					}]]
				});
				visit(context, pattern.left, {
					node: pattern.right,
					projection: []
				}, {
					...guards,
					fallbackSources: [...guards.fallbackSources ?? [], ...source === undefined ? [] : [{
						...source,
						...guards.iterationSources === undefined ? {} : { iterationSources: guards.iterationSources }
					}]]
				});
				return;
			}
			if (t.isObjectPattern(pattern)) {
				for (const property of pattern.properties) {
					if (t.isRestElement(property)) {
						const rest = source === undefined ? undefined : {
							node: source.node,
							projection: [...source.projection, { excludedKeys: [...new Set(semanticObjectPatternKeys(pattern))].sort(compareUnicodeCodePoints) }]
						};
						if (rest !== undefined) context.propertyReads.push({
							...rest,
							...guards,
							mutation,
							lookup: "own"
						});
						visit(context, property.argument, rest, guards);
						continue;
					}
					const selected = project(source, semanticStaticPropertyKey(property.key, property.computed));
					if (selected !== undefined) context.propertyReads.push({
						...selected,
						...guards,
						mutation,
						lookup: "prototype"
					});
					visit(context, property.value, selected, guards);
				}
				return;
			}
			if (t.isArrayPattern(pattern)) {
				if (source !== undefined && source.restStartIndex === undefined) add(sources, source, mutation, guards);
				const selectedGuards = {
					...guards,
					iterationSources: [...guards.iterationSources ?? [], ...source === undefined ? [] : [source]]
				};
				pattern.elements.forEach((element, index) => {
					if (element === null) return;
					if (t.isRestElement(element)) visit(context, element.argument, source === undefined ? undefined : {
						node: source.node,
						projection: source.projection,
						restStartIndex: (source.restStartIndex ?? 0) + index
					}, selectedGuards);
					else visit(context, element, project(source, index), selectedGuards);
				});
				return;
			}
			if (t.isRestElement(pattern)) visit(context, pattern.argument, undefined, guards);
		};
		emptySourceFacts = {
			iterations: [],
			propertyReads: []
		};
		guardedExecutions = new WeakMap();
		guardedBodyMayCall = (body) => {
			const pending = [{
				node: body,
				parent: null,
				finish: false
			}];
			while (pending.length > 0) {
				const frame = pending.pop();
				if (frame === undefined || guardedExecutions.has(frame.node)) continue;
				const { node, parent } = frame;
				const children = [...childNodes(node)].filter((child) => !t.isFunction(node) || semanticMethodDefinitionExpression(node, child));
				if (!frame.finish) {
					pending.push({
						node,
						parent,
						finish: true
					});
					for (const child of children) pending.push({
						node: child,
						parent: node,
						finish: false
					});
				} else {
					const direct = t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node) || t.isTaggedTemplateExpression(node) || t.isMemberExpression(node) || t.isOptionalMemberExpression(node) || t.isBinaryExpression(node) || t.isUnaryExpression(node) || t.isUpdateExpression(node) || t.isSpreadElement(node) || t.isForOfStatement(node) || t.isAwaitExpression(node) || (t.isVariableDeclarator(node) || t.isAssignmentExpression(node)) && semanticSourceFacts(node, parent).propertyReads.length > 0;
					guardedExecutions.set(node, direct || children.some((child) => guardedExecutions.get(child) === true));
				}
			}
			return guardedExecutions.get(body) === true;
		};
		sourceFacts = new WeakMap();
		semanticSourceFacts = (node, parent) => {
			if (!(t.isVariableDeclarator(node) || t.isAssignmentExpression(node) || t.isForOfStatement(node) || t.isSpreadElement(node) || t.isYieldExpression(node) || t.isCatchClause(node) || t.isFunction(node))) return emptySourceFacts;
			const cached = sourceFacts.get(node);
			if (cached?.parent === parent) return cached.facts;
			const sources = [];
			const propertyReads = [];
			const context = {
				sources,
				propertyReads,
				mutation: node
			};
			if (t.isVariableDeclarator(node) && node.init != null) visit(context, node.id, {
				node: node.init,
				projection: []
			});
			else if (t.isAssignmentExpression(node) && [
				"=",
				"||=",
				"&&=",
				"??="
			].includes(node.operator)) visit(context, node.left, {
				node: node.right,
				projection: []
			});
			else if (t.isForOfStatement(node)) {
				add(sources, {
					node: node.right,
					projection: []
				}, node, {});
				const source = {
					node: node.right,
					projection: [null]
				};
				if (t.isVariableDeclaration(node.left)) {
					for (const declaration of node.left.declarations) visit(context, declaration.id, source);
				} else visit(context, node.left, source);
			} else if (t.isSpreadElement(node)) {
				if (t.isArrayExpression(parent)) add(sources, {
					node: node.argument,
					projection: []
				}, node, {});
				else if (t.isObjectExpression(parent)) propertyReads.push({
					node: node.argument,
					projection: [{ excludedKeys: [] }],
					mutation: node,
					lookup: "own"
				});
			} else if (t.isYieldExpression(node) && node.delegate && node.argument != null) add(sources, {
				node: node.argument,
				projection: []
			}, node, {});
			else if (t.isCatchClause(node) && node.param != null && t.isTryStatement(parent) && guardedBodyMayCall(parent.block)) visit(context, node.param, {
				node: node.param,
				projection: [null]
			});
			else if (t.isFunction(node)) for (const parameter of runtimeFunctionParameters(node)) visit(context, parameter, {
				node: parameter,
				projection: []
			});
			const facts = {
				iterations: sources,
				propertyReads
			};
			sourceFacts.set(node, {
				parent,
				facts
			});
			return facts;
		};
		semanticIterationSources = (node, parent) => semanticSourceFacts(node, parent).iterations;
		semanticPatternPropertyReadSources = (pattern, source, mutation) => {
			const propertyReads = [];
			visit({
				sources: [],
				propertyReads,
				mutation
			}, pattern, source);
			return propertyReads;
		};
		semanticPropertyReadSources = (node, parent, supplemental) => {
			const ordinary = semanticSourceFacts(node, parent).propertyReads;
			const implicit = supplemental?.implicitPropertyReads.get(node);
			return implicit === undefined ? ordinary : [...ordinary, ...implicit];
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticMutationInitializers.js
var initializerPositionCaches, initializerPositionCache, statementPosition, positionPrecedes, computeTopLevelStatementPosition, topLevelStatementPosition, semanticTopLevelEffectFollowsCapture, scopeExitMarkers, scopeExitOwners, semanticScopeExitEffect, withinScopeExit, semanticEffectFollowsReference, semanticEffectTiming, semanticEnclosingIteration, expressionSiblings, expressionChildIndices, expressionEvaluationOrder, computeDirectInitializerPosition, directInitializerPosition, computeDirectMutationPosition, directMutationPosition, semanticDefiniteEffectPrecedesReference, semanticReadPrecedesEffectWithinActivation, semanticEffectTimingWithinActivation, computeReferenceInitializerPosition, referenceInitializerPosition, initializerPosition, semanticMutationInitializers, bindingEnclosingFunction, bindingReadPosition, semanticCaptureOrderingIdentity, moduleFunctionFirstRead, semanticBindingAtRead, selectInitializers, initializerMayRetainEntry, retainedInitializerOrigins, semanticCapturePosition, semanticBindingPrecedesCapture, semanticBindingEffectFollowsCapture, semanticBindingEffectFollowsRead, semanticEscapeFollowsCapture, commonJsWrapperBindingDeclaration, semanticBindingHasPriorValueWrite, isUnmodifiedCommonJsWrapperBinding, isUnshadowedGlobal;
function init_javascriptSemanticMutationInitializers() {
	return (init_javascriptSemanticMutationInitializers = __esmMin((() => {
		init_javascriptSemanticTraversal();
		init_javascriptModuleDeclaration();
		init_javascriptSourceParser();
		init_javascriptSemanticIterationSources();
		init_javascriptSemanticEvaluationOrder();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		initializerPositionCaches = new WeakMap();
		initializerPositionCache = (parents) => {
			const cached = initializerPositionCaches.get(parents);
			if (cached !== undefined) return cached;
			const created = {
				direct: new WeakMap(),
				topLevel: new WeakMap(),
				mutation: new WeakMap(),
				reference: new WeakMap(),
				read: new WeakMap(),
				enclosingFunction: new WeakMap(),
				functionPosition: new WeakMap(),
				statementIndices: new WeakMap(),
				moduleFunctionReads: new WeakMap(),
				evaluationChildren: new WeakMap(),
				expressionAncestry: undefined
			};
			initializerPositionCaches.set(parents, created);
			return created;
		};
		statementPosition = (statement, parents, declarator) => {
			const directParent = parents.get(statement);
			const enclosing = (t.isExportNamedDeclaration(directParent) || t.isExportDefaultDeclaration(directParent)) && directParent.declaration === statement ? directParent : statement;
			const parent = parents.get(enclosing);
			if (!t.isProgram(parent) && !t.isBlockStatement(parent)) return null;
			const cache = initializerPositionCache(parents).statementIndices;
			let positions = cache.get(parent.body);
			if (positions === undefined) {
				positions = new Map(parent.body.map((entry, index) => [entry, index]));
				cache.set(parent.body, positions);
			}
			const index = positions.get(enclosing) ?? -1;
			return index < 0 ? null : {
				body: parent.body,
				index,
				declaratorIndex: t.isVariableDeclaration(statement) && declarator !== undefined ? statement.declarations.indexOf(declarator) : -1
			};
		};
		positionPrecedes = (left, right) => left.body === right.body && (left.index < right.index || left.index === right.index && left.declaratorIndex >= 0 && left.declaratorIndex < right.declaratorIndex);
		computeTopLevelStatementPosition = (node, parents) => {
			let selected = null;
			let declarator;
			let child;
			while (node !== undefined) {
				if (t.isFunction(node) && (child === undefined || !semanticMethodDefinitionExpression(node, child)) || t.isLoop(node)) return null;
				if (delayedInstanceFieldValue(node, child)) return null;
				if (t.isVariableDeclarator(node)) declarator = node;
				if (t.isStatement(node)) {
					const enclosing = statementPosition(node, parents, declarator);
					if (enclosing !== null) selected = enclosing;
				}
				if (t.isProgram(node)) return selected;
				child = node;
				node = parents.get(node);
			}
			return null;
		};
		topLevelStatementPosition = (node, parents) => {
			if (node === undefined) return null;
			const cache = initializerPositionCache(parents);
			const cached = cache.topLevel.get(node);
			if (cached !== undefined) return cached;
			const computed = computeTopLevelStatementPosition(node, parents);
			cache.topLevel.set(node, computed);
			return computed;
		};
		semanticTopLevelEffectFollowsCapture = (capture, effect, parents) => {
			const before = topLevelStatementPosition(capture, parents);
			const after = topLevelStatementPosition(effect, parents);
			if (before === null || after === null) return false;
			if (positionPrecedes(before, after)) return true;
			if (before.body !== after.body || before.index !== after.index || before.declaratorIndex !== after.declaratorIndex) return false;
			return expressionEvaluationOrder(capture, effect, parents) === "before";
		};
		scopeExitMarkers = new WeakMap();
		scopeExitOwners = new WeakMap();
		semanticScopeExitEffect = (scope) => {
			const cached = scopeExitMarkers.get(scope);
			if (cached !== undefined) return cached;
			const marker = t.emptyStatement();
			if (scope.end !== undefined) {
				marker.start = scope.end;
				marker.end = scope.end;
			}
			if (scope.loc != null) marker.loc = {
				...scope.loc,
				start: scope.loc.end,
				end: scope.loc.end
			};
			scopeExitMarkers.set(scope, marker);
			scopeExitOwners.set(marker, scope);
			return marker;
		};
		withinScopeExit = (reference, scope, parents) => {
			for (let node = reference; node !== undefined; node = parents.get(node)) {
				if (node === scope) {
					for (let owner = parents.get(scope); owner !== undefined; owner = parents.get(owner)) {
						if (t.isLoop(owner)) return false;
						if (t.isFunction(owner)) break;
					}
					return !t.isLoop(scope);
				}
				if (t.isFunction(node) || t.isLoop(node)) return false;
			}
			return false;
		};
		semanticEffectFollowsReference = (reference, effect, parents) => {
			if (reference === effect) return false;
			const exit = effect === undefined ? undefined : scopeExitOwners.get(effect);
			if (exit !== undefined) {
				if (withinScopeExit(reference, exit, parents)) return true;
				effect = exit;
			}
			let current = reference;
			let child;
			while (current !== undefined && current !== effect) {
				if (t.isFunction(current)) break;
				child = current;
				current = parents.get(current);
			}
			const loopInput = (t.isForInStatement(effect) || t.isForOfStatement(effect)) && child === effect.right;
			let once = current;
			child = undefined;
			while (once !== undefined) {
				const initialLoopInput = t.isForStatement(once) && child === once.init || (t.isForInStatement(once) || t.isForOfStatement(once)) && child === once.right || once === effect && loopInput;
				if (t.isFunction(once) || t.isLoop(once) && !initialLoopInput || delayedInstanceFieldValue(once, child)) break;
				child = once;
				once = parents.get(once);
			}
			return current === effect && once === undefined && (t.isAssignmentExpression(effect) || t.isUpdateExpression(effect) || t.isVariableDeclarator(effect) || t.isCallExpression(effect) || t.isOptionalCallExpression(effect) || t.isNewExpression(effect)) || current === effect && once === undefined && loopInput || semanticTopLevelEffectFollowsCapture(reference, effect, parents);
		};
		semanticEffectTiming = (site, effect, state) => {
			if (effect === undefined) return "unknown";
			const exit = scopeExitOwners.get(effect);
			if (exit !== undefined) {
				if (withinScopeExit(site, exit, state.parentsByNode)) return "after";
				effect = exit;
			}
			if (site === effect && (t.isCallExpression(site) || t.isOptionalCallExpression(site) || t.isNewExpression(site))) return "after";
			const loop = semanticEnclosingIteration(effect, state);
			if (loop !== undefined) {
				const cardinality = semanticIterationCardinality(loop, state.prototypeEnumerationMayAffect);
				if (cardinality === "empty") return "after";
				if (cardinality === "nonempty") {
					const loopParent = state.parentsByNode.get(loop);
					const crossesFunction = (node) => {
						let current = node;
						while (current !== undefined) {
							if (t.isFunction(current)) return true;
							current = state.parentsByNode.get(current);
						}
						return false;
					};
					if (loopParent === state.program && !crossesFunction(site) && typeof loop.start === "number" && typeof loop.end === "number" && typeof site.start === "number") {
						if (site.start > loop.end) return "before";
						if (site.start < loop.start) return "after";
					}
				}
			}
			if (semanticEffectFollowsReference(site, effect, state.parentsByNode)) return "after";
			if (semanticEffectFollowsReference(effect, site, state.parentsByNode)) return "before";
			return "unknown";
		};
		semanticEnclosingIteration = (node, state) => {
			let current = node;
			while (current !== undefined) {
				if (t.isForInStatement(current) || t.isForOfStatement(current)) return current;
				if (t.isFunction(current)) return undefined;
				current = state.parentsByNode.get(current);
			}
			return undefined;
		};
		expressionSiblings = (earlier, later, parents) => {
			const cache = initializerPositionCache(parents);
			let context = cache.expressionAncestry;
			if (context?.source !== earlier) {
				const ancestors = new Map();
				let child;
				for (let node = earlier; node !== undefined; node = parents.get(node)) {
					ancestors.set(node, child);
					child = node;
				}
				context = {
					source: earlier,
					ancestors,
					siblings: new WeakMap()
				};
				cache.expressionAncestry = context;
			}
			const path = [];
			let result = null;
			for (let node = later; node !== undefined; node = parents.get(node)) {
				if (context.ancestors.has(node)) {
					const sourceChild = context.ancestors.get(node);
					const readChild = path.at(-1);
					if (sourceChild !== undefined && readChild !== undefined) result = {
						common: node,
						earlier: sourceChild,
						later: readChild
					};
					break;
				}
				const cached = context.siblings.get(node);
				if (cached !== undefined) {
					result = cached;
					break;
				}
				path.push(node);
			}
			for (const node of path) context.siblings.set(node, result);
			return result;
		};
		expressionChildIndices = (node, parents) => {
			const cache = initializerPositionCache(parents).evaluationChildren;
			const cached = cache.get(node);
			if (cached !== undefined) return cached;
			const children = (() => {
				if (t.isSequenceExpression(node)) return node.expressions;
				if (t.isArrayExpression(node)) return node.elements;
				if (t.isObjectExpression(node)) return node.properties;
				if (t.isObjectProperty(node)) return node.computed ? [node.key, node.value] : [node.value];
				if (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node)) return node.arguments;
				if (t.isBinaryExpression(node) || t.isLogicalExpression(node)) return [node.left, node.right];
				if (t.isConditionalExpression(node)) return [node.test];
				return null;
			})();
			if (children === null) {
				cache.set(node, null);
				return null;
			}
			const indices = new Map();
			let index = 0;
			if (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node)) indices.set(node.callee, index++);
			for (const child of children) {
				if (child !== null) indices.set(child, index);
				index++;
			}
			cache.set(node, indices);
			return indices;
		};
		expressionEvaluationOrder = (earlier, later, parents) => {
			if (later === undefined) return "unresolved";
			const siblings = expressionSiblings(earlier, later, parents);
			if (siblings === null) return "unresolved";
			const children = expressionChildIndices(siblings.common, parents);
			const earlierIndex = children?.get(siblings.earlier);
			const laterIndex = children?.get(siblings.later);
			if (earlierIndex === undefined || laterIndex === undefined || earlierIndex === laterIndex) return "unresolved";
			return earlierIndex < laterIndex ? "before" : "after";
		};
		computeDirectInitializerPosition = (node, parents) => {
			if (t.isClassDeclaration(node) && node.id !== null) return statementPosition(node, parents);
			if (t.isAssignmentExpression(node) && t.isIdentifier(unwrapJavaScriptExpression(node.left).node) || t.isUpdateExpression(node)) return directMutationPosition(node, parents);
			const parent = parents.get(node);
			if (t.isVariableDeclarator(parent) && parent.init === node) {
				const declaration = parents.get(parent);
				return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, parent) : null;
			}
			if (t.isAssignmentExpression(parent) && parent.right === node && t.isIdentifier(parent.left)) {
				return directMutationPosition(parent, parents);
			}
			return null;
		};
		directInitializerPosition = (node, parents) => {
			const cache = initializerPositionCache(parents);
			const cached = cache.direct.get(node);
			if (cached !== undefined) return cached;
			const computed = computeDirectInitializerPosition(node, parents);
			cache.direct.set(node, computed);
			return computed;
		};
		computeDirectMutationPosition = (node, parents) => {
			if (t.isForOfStatement(node)) return statementPosition(node, parents);
			if (t.isVariableDeclarator(node)) {
				const declaration = parents.get(node);
				return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, node) : null;
			}
			if (t.isSpreadElement(node)) {
				const array = parents.get(node);
				return t.isArrayExpression(array) ? semanticCapturePosition(array, parents) : null;
			}
			if (!t.isAssignmentExpression(node) && !t.isUpdateExpression(node) && !t.isUnaryExpression(node, { operator: "delete" }) && !t.isCallExpression(node) && !t.isOptionalCallExpression(node) && !t.isNewExpression(node) && !t.isTaggedTemplateExpression(node)) return null;
			let current = node;
			while (true) {
				const parent = parents.get(current);
				if (parent === undefined || t.isFunction(parent) || semanticBranchMayBeSkipped(parent, current)) return null;
				if (t.isStatement(parent)) return statementPosition(parent, parents);
				if (t.isVariableDeclarator(parent)) {
					const declaration = parents.get(parent);
					return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, parent) : null;
				}
				current = parent;
			}
		};
		directMutationPosition = (node, parents) => {
			const cache = initializerPositionCache(parents);
			const cached = cache.mutation.get(node);
			if (cached !== undefined) return cached;
			const computed = computeDirectMutationPosition(node, parents);
			cache.mutation.set(node, computed);
			return computed;
		};
		semanticDefiniteEffectPrecedesReference = (effect, reference, parents) => {
			const before = directMutationPosition(effect, parents);
			const after = bindingReadPosition(reference, parents);
			if (before === null || after.position === null || after.repeatingLoop) return false;
			if (positionPrecedes(before, after.position)) return true;
			return before.body === after.position.body && before.index === after.position.index && before.declaratorIndex === after.position.declaratorIndex && expressionEvaluationOrder(effect, reference, parents) === "before";
		};
		semanticReadPrecedesEffectWithinActivation = (read, effect, parents) => {
			const before = bindingReadPosition(read, parents);
			const after = directMutationPosition(effect, parents);
			if (before.position === null || before.repeatingLoop || after === null) return false;
			if (positionPrecedes(before.position, after)) return true;
			return before.position.body === after.body && before.position.index === after.index && before.position.declaratorIndex === after.declaratorIndex && expressionEvaluationOrder(read, effect, parents) === "before";
		};
		semanticEffectTimingWithinActivation = (site, effect, state) => {
			if (effect !== undefined) {
				if (semanticDefiniteEffectPrecedesReference(site, effect, state.parentsByNode)) return "after";
				if (semanticDefiniteEffectPrecedesReference(effect, site, state.parentsByNode)) return "before";
			}
			return semanticEffectTiming(site, effect, state);
		};
		computeReferenceInitializerPosition = (node, parents) => {
			let current = node;
			while (true) {
				const direct = directInitializerPosition(current, parents);
				if (direct !== null) return direct;
				const parent = parents.get(current);
				if (t.isAssignmentExpression(parent, { operator: "=" }) && (t.isObjectPattern(parent.left) || t.isArrayPattern(parent.left))) return directMutationPosition(parent, parents);
				if (t.isFunction(parent)) return t.isBlockStatement(parent.body) ? {
					body: parent.body.body,
					index: -1,
					declaratorIndex: -1
				} : null;
				if (parent === undefined || t.isStatement(parent) || delayedInstanceFieldValue(parent, current)) return null;
				if (t.isVariableDeclarator(parent)) {
					const declaration = parents.get(parent);
					return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, parent) : null;
				}
				current = parent;
			}
		};
		referenceInitializerPosition = (node, parents) => {
			const cache = initializerPositionCache(parents);
			const cached = cache.reference.get(node);
			if (cached !== undefined) return cached;
			const computed = computeReferenceInitializerPosition(node, parents);
			cache.reference.set(node, computed);
			return computed;
		};
		initializerPosition = (initializer, parents, reference = false) => {
			if (initializer.entryBody !== undefined) return {
				body: initializer.entryBody.body,
				index: -1,
				declaratorIndex: -1
			};
			return reference ? referenceInitializerPosition(initializer.node, parents) : directInitializerPosition(initializer.node, parents);
		};
		semanticMutationInitializers = (binding, mutation, parents) => {
			const mutationPosition = directMutationPosition(mutation, parents) ?? referenceInitializerPosition(mutation, parents);
			if (mutationPosition === null) return binding;
			const origins = [...binding.initializers.map((initializer) => ({
				initializer,
				position: initializerPosition(initializer, parents)
			})), ...binding.referenceInitializers.map((initializer) => ({
				initializer,
				position: initializerPosition(initializer, parents, true)
			}))];
			if (origins.some(({ position }) => position === null || !positionPrecedes(position, mutationPosition))) return binding;
			const { retained, replacesEntry } = retainedInitializerOrigins(origins, binding, parents);
			return {
				directOrigins: replacesEntry ? [] : binding.directOrigins,
				initializers: binding.initializers.filter((initializer) => retained.has(initializer)),
				referenceInitializers: binding.referenceInitializers.filter((initializer) => retained.has(initializer))
			};
		};
		bindingEnclosingFunction = (read, parents) => {
			const cache = initializerPositionCache(parents).enclosingFunction;
			const path = [];
			let current = read;
			let result = null;
			while (true) {
				const cached = cache.get(current);
				if (cached !== undefined) {
					result = cached;
					break;
				}
				path.push(current);
				const parent = parents.get(current);
				if (parent === undefined || delayedInstanceFieldValue(parent, current)) break;
				if (t.isFunction(parent) && !semanticMethodDefinitionExpression(parent, current)) {
					if (current === parent.body) result = parent;
					break;
				}
				current = parent;
			}
			for (const node of path) cache.set(node, result);
			return result ?? undefined;
		};
		bindingReadPosition = (read, parents) => {
			const cache = initializerPositionCache(parents).read;
			const path = [];
			let current = read;
			let result;
			while (true) {
				const cached = cache.get(current);
				if (cached !== undefined) {
					result = cached;
					break;
				}
				path.push(current);
				const parent = parents.get(current);
				if (t.isLoop(parent)) {
					result = {
						position: null,
						repeatingLoop: parent
					};
					break;
				}
				if (parent === undefined || t.isFunction(parent) && !semanticMethodDefinitionExpression(parent, current) || delayedInstanceFieldValue(parent, current)) {
					result = {
						position: null,
						repeatingLoop: undefined
					};
					break;
				}
				current = parent;
			}
			for (let index = path.length - 1; index >= 0; index--) {
				const node = path[index];
				if (node === undefined) continue;
				const parent = parents.get(node);
				let position = null;
				if (t.isVariableDeclarator(parent)) {
					const declaration = parents.get(parent);
					if (t.isVariableDeclaration(declaration)) position = statementPosition(declaration, parents, parent);
				} else if (t.isStatement(parent) && !t.isLoop(parent) && !t.isFunction(parent)) position = statementPosition(parent, parents);
				if (position !== null && position !== result.position) result = {
					...result,
					position
				};
				cache.set(node, result);
			}
			return result;
		};
		semanticCaptureOrderingIdentity = (capture, parents) => {
			if (!t.isMemberExpression(capture) && !t.isOptionalMemberExpression(capture)) return capture;
			const loop = bindingReadPosition(capture, parents).repeatingLoop;
			if (loop === undefined) return capture;
			let child = capture;
			for (let parent = parents.get(child); parent !== undefined && parent !== loop; parent = parents.get(child)) child = parent;
			if (t.isForStatement(loop) && child === loop.init || (t.isForInStatement(loop) || t.isForOfStatement(loop)) && child === loop.right) return capture;
			return loop;
		};
		moduleFunctionFirstRead = (declaration, body, parents, state) => {
			const cache = initializerPositionCache(parents).moduleFunctionReads;
			let retained = cache.get(body);
			const memberEffectsComplete = state?.memberMutationFactsComplete === true;
			if (retained?.memberEffectsComplete !== memberEffectsComplete) retained = undefined;
			if (retained === undefined) {
				const reads = new WeakMap();
				retained = {
					reads,
					memberEffectsComplete,
					opaquePositions: new WeakMap(),
					opaqueSitesIndexed: 0,
					firstOpaqueRead: Infinity
				};
				cache.set(body, retained);
				const functions = new Map();
				for (const statement of body) {
					const exported = t.isExportNamedDeclaration(statement) || t.isExportDefaultDeclaration(statement);
					if (t.isExportNamedDeclaration(statement) && isTypeOnlyExportDeclaration(statement)) continue;
					const node = exported ? statement.declaration : statement;
					if (!t.isFunctionDeclaration(node)) continue;
					reads.set(node, exported ? null : Infinity);
					if (node.id == null) continue;
					const name = node.id.name;
					if (functions.has(name)) {
						const previous = functions.get(name);
						if (previous != null) reads.set(previous, null);
						reads.set(node, null);
						functions.set(name, null);
					} else functions.set(name, node);
				}
				const indexedReads = reads;
				const firstStatement = body[0];
				const program = firstStatement === undefined ? undefined : parents.get(firstStatement);
				const classicScript = t.isProgram(program) && javaScriptRuntimeContext(program) === "unknown";
				const globalReceivers = new WeakMap();
				const propertyReaders = new WeakMap();
				const ownMethodReaders = new WeakMap();
				const ownMethodAtSource = (node, name) => {
					let read = ownMethodReaders.get(node);
					if (read === undefined) {
						read = staticObjectOwnMethodReader(node);
						ownMethodReaders.set(node, read);
					}
					return read(name);
				};
				const receiverPrototypeOwners = new WeakMap();
				const bindingReceivers = new WeakMap();
				const globalReceiver = (input) => {
					const pending = [{
						node: input,
						finish: false
					}];
					const visiting = new Set();
					const origins = new WeakMap();
					while (pending.length > 0) {
						const frame = pending.pop();
						if (frame === undefined) continue;
						const current = frame.node;
						if (frame.finish) {
							const fact = origins.get(current);
							if (fact === undefined) continue;
							let global = fact.global;
							let unknown = fact.unknown;
							for (const dependency of fact.dependencies) {
								for (const owner of receiverPrototypeOwners.get(dependency) ?? []) fact.owners.add(owner);
								const answer = globalReceivers.get(dependency);
								if (answer === true) global = true;
								if (answer === null || answer === undefined) unknown = true;
							}
							receiverPrototypeOwners.set(current, fact.owners);
							globalReceivers.set(current, global ? true : unknown ? null : false);
							visiting.delete(current);
							continue;
						}
						if (globalReceivers.has(current)) continue;
						if (visiting.has(current)) {
							globalReceivers.set(current, null);
							continue;
						}
						visiting.add(current);
						const fact = {
							dependencies: [],
							unknown: false,
							global: false,
							owners: new Set()
						};
						const node = unwrapJavaScriptExpression(current).node;
						if (t.isArrayExpression(node)) fact.owners.add("Array");
						else if (t.isFunction(node)) fact.owners.add("Function");
						else if (t.isObjectExpression(node)) fact.owners.add("Object");
						else if (t.isStringLiteral(node) || t.isTemplateLiteral(node)) fact.owners.add("String");
						else if (t.isNumericLiteral(node)) fact.owners.add("Number");
						else if (t.isBooleanLiteral(node)) fact.owners.add("Boolean");
						else if (t.isRegExpLiteral(node)) fact.owners.add("RegExp");
						else if (t.isBigIntLiteral(node)) fact.owners.add("BigInt");
						if (node !== current) fact.dependencies.push(node);
						else if (t.isThisExpression(node)) {
							const owner = t.isProgram(program) ? javaScriptThisOwner(node, program, parents) : "caller";
							fact.global = owner === "global";
							fact.unknown = owner === "caller";
						} else if (t.isIdentifier(node)) {
							const binding = state === undefined ? undefined : resolveSemanticBindingState(state, node, node.name);
							if (binding === undefined) {
								if ([
									"globalThis",
									"window",
									"self"
								].includes(node.name)) fact.global = true;
								else fact.unknown = true;
							} else {
								const representative = bindingReceivers.get(binding);
								if (representative !== undefined && representative !== current) {
									fact.dependencies.push(representative);
								} else {
									bindingReceivers.set(binding, current);
									if (binding.initializers.length === 0 || binding.referenceInitializers.length > 0) fact.unknown = true;
									for (const initializer of binding.initializers) {
										if (initializer.projection.length > 0) fact.unknown = true;
										else fact.dependencies.push(initializer.node);
									}
								}
							}
						} else if (t.isObjectExpression(node)) {
							fact.unknown = node.properties.some((property) => t.isSpreadElement(property) || t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "__proto__");
						} else if (!t.isArrayExpression(node) && !t.isLiteral(node) && !t.isFunction(node)) fact.unknown = true;
						origins.set(current, fact);
						pending.push({
							node: current,
							finish: true
						});
						for (const dependency of fact.dependencies) pending.push({
							node: dependency,
							finish: false
						});
					}
					return globalReceivers.get(input) ?? null;
				};
				const receiverBounds = new WeakMap();
				const receiverBound = (root) => {
					const pending = [{
						binding: root,
						finish: false
					}];
					const activeBindings = new Set();
					const dependencies = new WeakMap();
					const merge = (left, right) => {
						if (left.index < right.index) return left;
						if (right.index < left.index) return right;
						return {
							...left,
							ambiguous: left.ambiguous || right.ambiguous || left.node !== right.node
						};
					};
					while (pending.length > 0) {
						const frame = pending.pop();
						const binding = frame.binding;
						if (frame.finish) {
							let bound = {
								index: Infinity,
								ambiguous: false
							};
							for (const effects of [binding.memberWrites, binding.escapedPaths]) {
								for (const effect of effects) {
									const position = effect.node === undefined ? null : directMutationPosition(effect.node, parents);
									if (effect.node === undefined || position === null || position.body !== body) {
										bound = null;
										break;
									}
									bound = merge(bound, {
										index: position.index,
										node: effect.node,
										ambiguous: false
									});
								}
								if (bound === null) break;
							}
							for (const dependency of dependencies.get(binding) ?? []) {
								const inherited = receiverBounds.get(dependency);
								if (bound === null || inherited === null || inherited === undefined) {
									bound = null;
									break;
								}
								bound = merge(bound, inherited);
							}
							receiverBounds.set(binding, bound);
							activeBindings.delete(binding);
							continue;
						}
						if (receiverBounds.has(binding)) continue;
						if (activeBindings.has(binding)) {
							receiverBounds.set(binding, null);
							continue;
						}
						activeBindings.add(binding);
						const selected = [];
						for (const initializer of binding.initializers) {
							const node = unwrapJavaScriptExpression(initializer.node).node;
							if (!t.isIdentifier(node) || state === undefined) continue;
							const dependency = resolveSemanticBindingState(state, node, node.name);
							if (dependency !== undefined) selected.push(dependency);
						}
						dependencies.set(binding, selected);
						pending.push({
							binding,
							finish: true
						});
						for (const dependency of selected) pending.push({
							binding: dependency,
							finish: false
						});
					}
					return receiverBounds.get(root) ?? null;
				};
				const prototypeBounds = new Map();
				for (const owner of semanticPrototypeOwners) {
					let bound = {
						index: Infinity,
						ambiguous: false
					};
					for (const effect of state?.prototypeMutationSites ?? []) {
						if (effect.owner !== owner && effect.owner !== "Object") continue;
						const position = directMutationPosition(effect.node, parents);
						if (position === null || position.body !== body) {
							bound = null;
							break;
						}
						if (position.index < bound.index) bound = {
							index: position.index,
							node: effect.node,
							ambiguous: false
						};
						else if (position.index === bound.index && effect.node !== bound.node) bound = {
							...bound,
							ambiguous: true
						};
					}
					prototypeBounds.set(owner, bound);
				}
				const receiverAtRead = (input, read) => {
					const identity = globalReceiver(input);
					for (const owner of receiverPrototypeOwners.get(input) ?? []) {
						const bound = prototypeBounds.get(owner);
						if (bound === null) return null;
						if (bound !== undefined && bound.index !== Infinity) {
							const position = bindingReadPosition(read, parents);
							if (position.position === null || position.repeatingLoop || position.position.body !== body) return null;
							if (position.position.index > bound.index) return null;
							if (position.position.index === bound.index && (bound.ambiguous || bound.node === undefined || state === undefined || semanticEffectTiming(read, bound.node, state) !== "after")) return null;
						}
					}
					if (identity !== false || state === undefined || !memberEffectsComplete) return identity;
					const root = unwrapJavaScriptExpression(input).node;
					if (!t.isIdentifier(root)) return identity;
					const binding = resolveSemanticBindingState(state, root, root.name);
					if (binding === undefined) return null;
					const bound = receiverBound(binding);
					if (bound === null) return null;
					if (bound.index === Infinity) return identity;
					const position = bindingReadPosition(read, parents);
					if (position.position === null || position.repeatingLoop || position.position.body !== body) return null;
					if (position.position.index < bound.index) return identity;
					if (position.position.index > bound.index || bound.ambiguous) return null;
					return bound.node !== undefined && (semanticReadPrecedesEffectWithinActivation(read, bound.node, parents) || semanticEffectTiming(read, bound.node, state) === "after") ? identity : null;
				};
				const active = new Set();
				const retainNamedRead = (name, parent, index) => {
					const fn = functions.get(name);
					if (fn == null || active.has(fn)) return;
					const current = indexedReads.get(fn);
					if (current === null || current === undefined) return;
					indexedReads.set(fn, active.size > 0 || t.isExportSpecifier(parent) ? null : Math.min(current, index));
				};
				const opaquePositions = retained.opaquePositions;
				const definitionKeys = new WeakMap();
				let unknownPropertyRead = Infinity;
				for (let index = 0; index < body.length; index++) {
					const statement = body[index];
					if (statement === undefined) continue;
					traverseJavaScriptAst(statement, {
						skip: (node) => state?.erasedSyntaxNodes.has(node) === true || isErasedJavaScriptValueChild(node, parents.get(node) ?? null),
						enter(node, parent) {
							if (semanticMethodDefinitionExpression(parent ?? undefined, node) && parent !== null && t.isFunction(parent)) {
								active.delete(parent);
								definitionKeys.set(node, parent);
							}
							if (t.isFunction(node)) active.add(node);
							if (t.isCallExpression(node) && state?.opaqueEffects.sites.has(node)) {
								if (unknownPropertyRead !== null) unknownPropertyRead = active.size > 0 ? null : Math.min(unknownPropertyRead, index);
							}
							if (classicScript && (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node) || t.isTaggedTemplateExpression(node))) {
								opaquePositions.set(node, active.size > 0 ? null : index);
							}
							if (classicScript) {
								for (const source of semanticPropertyReadSources(node, parent, state)) {
									const projected = source.iterationSources !== undefined || source.projection.length > 1;
									if (!projected && receiverAtRead(source.node, node) === false) continue;
									if (projected && source.iterationSources === undefined) {
										let receiver = source.node;
										for (const key of source.projection.slice(0, -1)) {
											if (typeof key !== "string" && typeof key !== "number") {
												receiver = undefined;
												break;
											}
											if (receiver === undefined) break;
											let read = propertyReaders.get(receiver);
											if (read === undefined) {
												read = staticObjectPropertyReader(receiver);
												propertyReaders.set(receiver, read);
											}
											const selected = read(String(key));
											receiver = selected.status === "explicit" ? selected.value : undefined;
											if (receiver === undefined) break;
										}
										if (receiver !== undefined && receiverAtRead(receiver, node) === false) continue;
									}
									const key = source.projection[0];
									if (!projected && typeof key === "string") retainNamedRead(key, parent, index);
									else if (unknownPropertyRead !== null) unknownPropertyRead = active.size > 0 ? null : Math.min(unknownPropertyRead, index);
								}
							}
							let name = null;
							if (t.isIdentifier(node) && parent !== null && (t.isReferenced(node, parent) || t.isAssignmentExpression(parent) && parent.left === node && semanticWriteSiteReadsFirst(parent))) {
								const candidate = functions.get(node.name);
								const binding = state === undefined ? undefined : resolveSemanticBindingState(state, node, node.name);
								if (candidate != null && state !== undefined && semanticResolutionBlocked(state, node, node.name)) {
									const current = indexedReads.get(candidate);
									if (current !== null && current !== undefined) indexedReads.set(candidate, active.size > 0 ? null : Math.min(current, index));
									return;
								}
								if (state === undefined || candidate != null && binding?.initializers.some(({ node: value }) => value === candidate)) name = node.name;
							} else if (classicScript && (t.isMemberExpression(node) || t.isOptionalMemberExpression(node))) {
								const receiver = unwrapJavaScriptExpression(node.object).node;
								const selected = semanticStaticPropertyKey(node.property, node.computed);
								const ownMethod = selected !== null && functions.has(selected) && (ownMethodAtSource(receiver, selected) || state !== undefined && t.isIdentifier(receiver) && (() => {
									const binding = resolveSemanticBindingState(state, receiver, receiver.name);
									if (binding === undefined || receiverBound(binding)?.index !== Infinity) return false;
									return binding.initializers.length === 1 && binding.initializers[0].projection.length === 0 && ownMethodAtSource(unwrapJavaScriptExpression(binding.initializers[0].node).node, selected);
								})());
								if (!ownMethod && receiverAtRead(receiver, node) !== false) {
									name = selected;
									if (name === null) {
										if (unknownPropertyRead !== null) unknownPropertyRead = active.size > 0 ? null : Math.min(unknownPropertyRead, index);
										return;
									}
								}
							}
							if (name !== null) retainNamedRead(name, parent, index);
						},
						exit(node) {
							if (t.isFunction(node)) active.delete(node);
							const method = definitionKeys.get(node);
							if (method !== undefined) active.add(method);
						}
					});
				}
				for (const fn of functions.values()) {
					if (fn == null) continue;
					const current = indexedReads.get(fn);
					if (current !== null && current !== undefined) indexedReads.set(fn, unknownPropertyRead === null ? null : Math.min(current, unknownPropertyRead));
				}
			}
			const sites = state?.opaqueEffects.globalSites ?? [];
			while (retained.opaqueSitesIndexed < sites.length) {
				const site = sites[retained.opaqueSitesIndexed++];
				const position = site === undefined ? undefined : retained.opaquePositions.get(site);
				if (position === undefined || retained.firstOpaqueRead === null) continue;
				retained.firstOpaqueRead = position === null ? null : Math.min(retained.firstOpaqueRead, position);
			}
			const read = retained.reads.get(declaration);
			const first = read === undefined || read === null || retained.firstOpaqueRead === null ? null : Math.min(read, retained.firstOpaqueRead);
			return first !== undefined && Number.isFinite(first) ? first : null;
		};
		semanticBindingAtRead = (binding, read, context) => {
			const state = "parentsByNode" in context ? context : undefined;
			const parents = state === undefined ? context : state.parentsByNode;
			if (binding.initializers.length === 0 && binding.referenceInitializers.length === 0) return {
				status: "ordered",
				binding,
				hasDefiniteInitializer: false
			};
			const [soleInitializer] = binding.initializers;
			if (binding.initializers.length === 1 && binding.referenceInitializers.length === 0 && binding.declarationKinds.size === 0 && binding.definitions.length === 1 && binding.definitions[0]?.kind === "function" && soleInitializer !== undefined && t.isFunctionDeclaration(soleInitializer.node)) return {
				status: "ordered",
				binding,
				hasDefiniteInitializer: true
			};
			if (soleInitializer !== undefined && t.isClass(soleInitializer.node) && binding.scopeId === semanticScopeId("class", soleInitializer.node) && !binding.mutable && binding.initializers.length === 1 && binding.referenceInitializers.length === 0 && !binding.definitions.some(({ kind }) => kind === "assignment")) {
				const owner = soleInitializer.node;
				let child = read;
				let memberPart;
				for (let parent = parents.get(child); parent !== undefined; child = parent, parent = parents.get(parent)) {
					if (parents.get(parent) === owner.body) memberPart = child;
					if (parent === owner.body) {
						if (t.isClassMethod(child) || t.isClassPrivateMethod(child) ? memberPart === child.body : t.isStaticBlock(child) || (t.isClassProperty(child) || t.isClassPrivateProperty(child) || t.isClassAccessorProperty(child)) && memberPart === child.value) return {
							status: "ordered",
							binding,
							hasDefiniteInitializer: true
						};
						break;
					}
					if (parent === owner) break;
				}
			}
			const initializer = binding.initializers[0];
			const reference = binding.referenceInitializers[0];
			const origin = initializer ?? reference;
			const sourcePosition = initializer === undefined ? reference === undefined ? null : initializerPosition(reference, parents, true) : initializerPosition(initializer, parents);
			const { position, repeatingLoop } = bindingReadPosition(read, parents);
			const hasDefiniteInitializer = position !== null && [...binding.initializers, ...binding.referenceInitializers.filter(({ assignment }) => assignment)].some((initializer) => {
				const source = initializerPosition(initializer, parents, binding.referenceInitializers.includes(initializer));
				return source !== null && positionPrecedes(source, position) && !initializerMayRetainEntry(initializer, binding, parents);
			});
			if (!repeatingLoop && origin !== undefined && binding.initializers.length + binding.referenceInitializers.length === 1 && sourcePosition !== null && position !== null && positionPrecedes(sourcePosition, position)) return {
				status: "ordered",
				binding,
				hasDefiniteInitializer
			};
			const moduleConstBinding = binding.scopeId.startsWith("scope:program:") && binding.declarationKinds.size === 1 && binding.declarationKinds.has("const") && !binding.mutable;
			const enclosingFunction = moduleConstBinding ? bindingEnclosingFunction(read, parents) : undefined;
			let functionPosition = null;
			if (enclosingFunction !== undefined) {
				const positions = initializerPositionCache(parents).functionPosition;
				const cached = positions.get(enclosingFunction);
				if (cached !== undefined) functionPosition = cached;
				else {
					const compute = () => {
						if (t.isStatement(enclosingFunction)) return statementPosition(enclosingFunction, parents);
						for (let owner = parents.get(enclosingFunction); owner !== undefined; owner = parents.get(owner)) {
							if (t.isFunction(owner)) return null;
							if (t.isStatement(owner)) return statementPosition(owner, parents);
						}
						return null;
					};
					functionPosition = compute();
					positions.set(enclosingFunction, functionPosition);
				}
			}
			const firstFunctionRead = moduleConstBinding && sourcePosition !== null && functionPosition !== null && sourcePosition.body === functionPosition.body && t.isFunctionDeclaration(enclosingFunction) ? moduleFunctionFirstRead(enclosingFunction, sourcePosition.body, parents, state) : null;
			const moduleConstInitializedBeforeActivation = moduleConstBinding && sourcePosition !== null && functionPosition !== null && sourcePosition.body === functionPosition.body && (t.isFunctionDeclaration(enclosingFunction) ? firstFunctionRead !== null && sourcePosition.index < firstFunctionRead : positionPrecedes(sourcePosition, functionPosition));
			const uncertainOrder = repeatingLoop || sourcePosition === null || position === null || sourcePosition.body !== position.body;
			if (uncertainOrder && moduleConstInitializedBeforeActivation) return {
				status: "unresolved",
				binding,
				hasDefiniteInitializer: true
			};
			if (uncertainOrder) return {
				status: "unresolved",
				binding,
				hasDefiniteInitializer
			};
			const selected = selectInitializers(binding, position, read, parents);
			if (selected === undefined) return {
				status: "unresolved",
				binding,
				hasDefiniteInitializer
			};
			if (selected.binding === binding) return {
				status: "ordered",
				binding,
				hasDefiniteInitializer: hasDefiniteInitializer || selected.hasDefiniteInitializer
			};
			return {
				status: "ordered",
				hasDefiniteInitializer: hasDefiniteInitializer || selected.hasDefiniteInitializer,
				binding: {
					...binding,
					...selected.binding,
					definitions: binding.definitions.filter(({ kind }) => kind !== "assignment")
				}
			};
		};
		selectInitializers = (binding, position, read, parents) => {
			if (position === null) return undefined;
			const origins = [...binding.initializers.map((initializer) => ({
				initializer,
				position: initializerPosition(initializer, parents)
			})), ...binding.referenceInitializers.map((initializer) => ({
				initializer,
				position: initializerPosition(initializer, parents, true)
			}))];
			const preceding = [];
			for (const origin of origins) {
				const source = origin.position;
				if (source === null || source.body !== position.body) return undefined;
				if (positionPrecedes(source, position)) preceding.push(origin);
				else if (!positionPrecedes(position, source)) {
					if (source.index !== position.index || source.declaratorIndex !== position.declaratorIndex) return undefined;
					const order = expressionEvaluationOrder(origin.initializer.node, read, parents);
					if (order === "unresolved") return undefined;
					if (order === "before") preceding.push(origin);
				}
			}
			const { retained, replacesEntry } = retainedInitializerOrigins(preceding, binding, parents);
			if (binding.initializers.every((initializer) => retained.has(initializer)) && binding.referenceInitializers.every((initializer) => retained.has(initializer))) return {
				binding,
				hasDefiniteInitializer: replacesEntry
			};
			return {
				hasDefiniteInitializer: replacesEntry,
				binding: {
					initializers: binding.initializers.filter((initializer) => retained.has(initializer)),
					referenceInitializers: binding.referenceInitializers.filter((initializer) => retained.has(initializer))
				}
			};
		};
		initializerMayRetainEntry = (initializer, binding, parents) => {
			const node = initializer.node, parent = parents.get(node);
			const assignment = t.isAssignmentExpression(node) ? node : t.isAssignmentExpression(parent) && parent.right === node ? parent : undefined;
			if (assignment === undefined || ![
				"&&=",
				"||=",
				"??="
			].includes(assignment.operator)) return false;
			const emptyLocal = node === assignment.right && binding.kind === "variable" && !binding.runtimeImport && binding.initializers.length === 1 && binding.initializers[0] === initializer && binding.referenceInitializers.length === 0 && binding.directOrigins.length === 0 && binding.definitions.some(({ kind }) => kind === "variable") && binding.definitions.every(({ kind }) => kind === "variable" || kind === "assignment");
			return !emptyLocal;
		};
		retainedInitializerOrigins = (origins, binding, parents) => {
			const latest = origins.reduce((latest, { initializer, position }) => position !== null && !initializerMayRetainEntry(initializer, binding, parents) && (latest === null || positionPrecedes(latest, position)) ? position : latest, null);
			return {
				replacesEntry: latest !== null,
				retained: new Set(origins.filter(({ position }) => latest === null || position?.index === latest.index && position?.declaratorIndex === latest.declaratorIndex || position !== null && positionPrecedes(latest, position)).map(({ initializer }) => initializer))
			};
		};
		semanticCapturePosition = (node, parents) => {
			let current = node;
			while (true) {
				const direct = directInitializerPosition(current, parents);
				if (direct !== null) return direct;
				const parent = parents.get(current);
				if (t.isReturnStatement(parent) && parent.argument === current) return statementPosition(parent, parents);
				if (t.isObjectProperty(parent) && parent.value === current && semanticStaticPropertyKey(parent.key, parent.computed) !== null) current = parent;
				else if (t.isSpreadElement(parent) && parent.argument === current && t.isObjectExpression(parents.get(parent))) current = parent;
				else if (t.isObjectExpression(parent) || t.isArrayExpression(parent)) current = parent;
				else return null;
			}
		};
		semanticBindingPrecedesCapture = (binding, capture, parents) => {
			const initializer = binding.initializers[0];
			if (binding.initializers.length !== 1 || initializer === undefined) return false;
			const sourcePosition = initializerPosition(initializer, parents);
			const capturePosition = semanticCapturePosition(capture, parents);
			return sourcePosition !== null && capturePosition !== null && positionPrecedes(sourcePosition, capturePosition);
		};
		semanticBindingEffectFollowsCapture = (binding, capture, effect, parents) => {
			if (!semanticBindingPrecedesCapture(binding, capture, parents)) return false;
			const captured = semanticCapturePosition(capture, parents);
			const written = directMutationPosition(effect, parents);
			return captured !== null && written !== null && positionPrecedes(captured, written);
		};
		semanticBindingEffectFollowsRead = (binding, read, effect, parents) => {
			const initializer = binding.initializers[0];
			if (binding.initializers.length !== 1 || initializer === undefined) return false;
			const declaration = parents.get(initializer.node);
			if (!t.isVariableDeclarator(declaration) || declaration.init !== initializer.node) return false;
			const initialized = initializerPosition(initializer, parents);
			const selected = bindingReadPosition(read, parents).position;
			return initialized !== null && selected !== null && positionPrecedes(initialized, selected) && semanticReadPrecedesEffectWithinActivation(read, effect, parents);
		};
		semanticEscapeFollowsCapture = (binding, capture, escape, parents) => {
			const initializer = binding.initializers[0];
			if (escape === undefined || initializer === undefined || !semanticBindingPrecedesCapture(binding, capture, parents)) return false;
			const origin = unwrapJavaScriptExpression(initializer.node).node;
			if (!t.isObjectExpression(origin) && !t.isArrayExpression(origin) && !t.isIdentifier(origin) && !t.isMemberExpression(origin) && !t.isOptionalMemberExpression(origin)) return false;
			const capturePosition = semanticCapturePosition(capture, parents);
			const exit = scopeExitOwners.get(escape);
			if (exit !== undefined) {
				const exitPosition = t.isStatement(exit) ? statementPosition(exit, parents) : null;
				return withinScopeExit(capture, exit, parents) || capturePosition !== null && exitPosition !== null && positionPrecedes(capturePosition, exitPosition);
			}
			const escapePosition = directMutationPosition(escape, parents);
			return capturePosition !== null && escapePosition !== null && positionPrecedes(capturePosition, escapePosition);
		};
		commonJsWrapperBindingDeclaration = (node, name, state) => {
			if (![
				"module",
				"exports",
				"require",
				"__dirname",
				"__filename"
			].includes(name) || !t.isIdentifier(node, { name })) return undefined;
			const binding = resolveSemanticBindingState(state, node, name);
			if (binding === undefined) return undefined;
			const scope = state.scopesById.get(binding.scopeId);
			if (scope?.kind !== "program" || ![...binding.declarationKinds].every((kind) => kind === "var")) return undefined;
			if (binding.hostOrigin === "commonjs-wrapper") return binding;
			return state.program.sourceType === "script" && binding.declarationKinds.size > 0 ? binding : undefined;
		};
		semanticBindingHasPriorValueWrite = (site, binding, state) => {
			if (binding.definitions.some(({ kind }) => kind === "function")) return true;
			const writes = state.bindingWrites.get(binding.bindingId) ?? [];
			const read = semanticBindingAtRead(binding, site, state);
			const retained = read.status === "ordered" ? new Set([...read.binding.initializers, ...read.binding.referenceInitializers]) : undefined;
			const representedWrites = new Set();
			const retainedWrites = new Set();
			for (const source of [...binding.initializers, ...binding.referenceInitializers]) {
				let owner = source.node;
				while (owner !== undefined && !writes.includes(owner)) owner = state.parentsByNode.get(owner);
				if (owner !== undefined) {
					representedWrites.add(owner);
					if (retained === undefined || retained.has(source)) retainedWrites.add(owner);
				} else if ((retained === undefined || retained.has(source)) && semanticEffectTiming(site, source.node, state) !== "after") return true;
			}
			return writes.some((write) => (!representedWrites.has(write) || retainedWrites.has(write)) && semanticEffectTiming(site, write, state) !== "after");
		};
		isUnmodifiedCommonJsWrapperBinding = (node, name, state) => {
			const binding = commonJsWrapperBindingDeclaration(node, name, state);
			return binding !== undefined && !semanticBindingHasPriorValueWrite(node, binding, state);
		};
		isUnshadowedGlobal = (node, state, name) => t.isIdentifier(node, { name }) && (resolveSemanticBindingState(state, node, name) === undefined ? !semanticResolutionBlocked(state, node, name) : isUnmodifiedCommonJsWrapperBinding(node, name, state));
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticRequireOriginSlot.js
var semanticRequireOriginReaders, readSemanticRequireOrigin, readSemanticRequireLoader;
function init_javascriptSemanticRequireOriginSlot() {
	return (init_javascriptSemanticRequireOriginSlot = __esmMin((() => {
		semanticRequireOriginReaders = {
			origin: undefined,
			loader: undefined
		};
		readSemanticRequireOrigin = (node, state) => semanticRequireOriginReaders.origin?.(node, state);
		readSemanticRequireLoader = (node, state, factoryBindingIds) => semanticRequireOriginReaders.loader?.(node, state, factoryBindingIds) ?? "unknown";
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptIntrinsicInvocation.js
var unknownArrayIteration, expandJavaScriptInvocationArguments, arrayArguments, invocationArguments, javaScriptGenericInvocationMethod, javaScriptSourceInvocationContext, resolveJavaScriptGenericInvocation, resolveJavaScriptIntrinsicInvocation;
function init_javascriptIntrinsicInvocation() {
	return (init_javascriptIntrinsicInvocation = __esmMin((() => {
		init_javascriptAstValues();
		unknownArrayIteration = () => false;
		expandJavaScriptInvocationArguments = (arguments_, nativeArrayIteration = unknownArrayIteration) => {
			const expanded = [];
			const pending = [...arguments_].reverse();
			while (pending.length > 0) {
				const argument = pending.pop();
				if (argument === undefined) break;
				const array = t.isSpreadElement(argument) ? unwrapJavaScriptExpression(argument.argument).node : undefined;
				if (t.isArrayExpression(array) && nativeArrayIteration(array) && array.elements.every((element) => t.isExpression(element) || t.isSpreadElement(element))) for (let index = array.elements.length - 1; index >= 0; index -= 1) {
					const element = array.elements[index];
					if (element !== null && element !== undefined) pending.push(element);
				}
				else expanded.push(argument);
			}
			return expanded;
		};
		arrayArguments = (node, nativeArrayIteration) => {
			const array = node === undefined ? undefined : unwrapJavaScriptExpression(node).node;
			if (!t.isArrayExpression(array) || array.elements.some((element) => element === null)) return undefined;
			const expanded = expandJavaScriptInvocationArguments(array.elements.filter((element) => element !== null), nativeArrayIteration);
			return expanded.every((element) => t.isExpression(element)) ? expanded.filter((element) => t.isExpression(element)) : undefined;
		};
		invocationArguments = (method, arguments_, nativeArrayIteration) => t.isSpreadElement(arguments_?.[0]) ? undefined : method === "apply" ? arrayArguments(arguments_?.[1], nativeArrayIteration) : arguments_?.slice(1);
		javaScriptGenericInvocationMethod = (callee) => {
			const expression = unwrapJavaScriptExpression(callee).node;
			const method = t.isMemberExpression(expression) || t.isOptionalMemberExpression(expression) ? semanticStaticPropertyKey(expression.property, expression.computed) : undefined;
			return method === "call" || method === "apply" ? method : undefined;
		};
		javaScriptSourceInvocationContext = (node, nativeArrayIteration = unknownArrayIteration) => {
			const callee = unwrapJavaScriptExpression(node.callee).node;
			return {
				receiver: t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee) ? callee.object : undefined,
				arguments: expandJavaScriptInvocationArguments(node.arguments, nativeArrayIteration)
			};
		};
		resolveJavaScriptGenericInvocation = (method, context, nativeArrayIteration = unknownArrayIteration) => !t.isExpression(context.receiver) ? undefined : {
			callable: context.receiver,
			context: {
				receiver: context.arguments?.[0],
				...context.arguments === undefined || t.isSpreadElement(context.arguments[0]) ? { receiverUnknown: true } : {},
				arguments: invocationArguments(method, context.arguments, nativeArrayIteration)
			}
		};
		resolveJavaScriptIntrinsicInvocation = (node, intrinsicPath, boundIntrinsic, intrinsicReadChanged, nativeArrayIteration = unknownArrayIteration) => {
			const visited = new Set();
			let callee = t.isTaggedTemplateExpression(node) ? node.tag : node.callee;
			let arguments_ = t.isTaggedTemplateExpression(node) ? undefined : expandJavaScriptInvocationArguments(node.arguments, nativeArrayIteration);
			let receiver;
			let explicitReceiver = false;
			for (;;) {
				callee = unwrapJavaScriptExpression(callee).node;
				if (t.isSequenceExpression(callee)) {
					const finalExpression = callee.expressions.at(-1);
					if (finalExpression === undefined) return undefined;
					explicitReceiver = true;
					callee = finalExpression;
					continue;
				}
				if (visited.has(callee)) return undefined;
				visited.add(callee);
				let path = intrinsicPath(callee);
				if (path !== undefined && intrinsicReadChanged(callee, path)) return {
					kind: "opaque",
					path,
					arguments: undefined
				};
				if (path === undefined) {
					if (t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) {
						const method = semanticStaticPropertyKey(callee.property, callee.computed);
						if (method === "call" || method === "apply") {
							const bound = boundIntrinsic(callee.object);
							const callablePath = bound?.path ?? intrinsicPath(callee.object);
							if (callablePath !== undefined && intrinsicReadChanged(callee, [...callablePath, method])) return {
								kind: "opaque",
								path: callablePath,
								arguments: undefined
							};
							receiver = arguments_?.[0];
							explicitReceiver = true;
							callee = callee.object;
							arguments_ = invocationArguments(method, arguments_, nativeArrayIteration);
							continue;
						}
					}
					const bound = boundIntrinsic(callee);
					if (bound === undefined) return undefined;
					if (bound.kind === "opaque") return bound;
					path = bound.path;
					receiver = bound.receiver;
					explicitReceiver = true;
					arguments_ = bound.arguments === undefined ? undefined : [...bound.arguments, ...arguments_ ?? []];
				}
				const method = path.length > 3 ? path.at(-1) : undefined;
				if (method === "call" || method === "apply") {
					const callable = explicitReceiver ? receiver : t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee) ? callee.object : undefined;
					const selected = resolveJavaScriptGenericInvocation(method, {
						receiver: callable,
						arguments: arguments_
					}, nativeArrayIteration);
					if (selected === undefined) return {
						kind: "opaque",
						path,
						arguments: undefined
					};
					callee = selected.callable;
					receiver = selected.context.receiver;
					explicitReceiver = true;
					arguments_ = selected.context.arguments;
					continue;
				}
				if (path.join(".") === "intrinsic.Reflect.construct") {
					const callable = arguments_?.[0];
					if (!t.isExpression(callable)) return undefined;
					callee = callable;
					receiver = undefined;
					explicitReceiver = true;
					arguments_ = arrayArguments(arguments_?.[1], nativeArrayIteration);
					continue;
				}
				if (path.join(".") === "intrinsic.Reflect.apply") {
					const callable = arguments_?.[0];
					if (!t.isExpression(callable)) return undefined;
					callee = callable;
					receiver = arguments_?.[1];
					explicitReceiver = true;
					arguments_ = arrayArguments(arguments_?.[2], nativeArrayIteration);
					continue;
				}
				return {
					kind: "known",
					path,
					arguments: arguments_,
					...receiver === undefined ? {} : { receiver }
				};
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticOpaqueEffects.js
/** Rebinding requires lexical visibility. Object references can remain reachable
* through aliases even where the original name is shadowed or out of block scope.
* Without a disjointness proof, consider their enclosing activation and closures.
* Queries retain no binding-by-eval table. */
function* semanticOpaqueBindingEffects(binding, state, kind = "binding") {
	if (state.opaqueEffects.byScope.size === 0) return;
	const pending = [kind === "reference" ? activation(binding.scopeId, state) : binding.scopeId];
	while (pending.length > 0) {
		const scope = pending.pop();
		for (const node of state.opaqueEffects.byScope.get(scope) ?? []) if (kind === "reference" || resolveSemanticBindingState(state, node, binding.name)?.bindingId === binding.bindingId) yield node;
		for (const child of state.opaqueEffects.children.get(scope) ?? []) pending.push(child);
	}
}
var indexSemanticOpaqueEffects, createSemanticOpaqueGlobalObserver, semanticOpaqueGlobalMayHaveChanged, semanticBindingMayHaveOpaqueEffect, semanticOpaqueNameMayHaveChanged, semanticBindingCanBeRebound, semanticOpaqueBindingReadMayHaveChanged, activation, strictEval;
function init_javascriptSemanticOpaqueEffects() {
	return (init_javascriptSemanticOpaqueEffects = __esmMin((() => {
		init_javascriptSourceParser();
		init_javascriptAstValues();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticState();
		indexSemanticOpaqueEffects = (candidates, state) => {
			for (const { node, scopeId } of candidates) {
				const callee = unwrapJavaScriptExpression(node.callee).node;
				if (!isUnshadowedGlobal(callee, state, "eval")) continue;
				state.opaqueEffects.sites.add(node);
				if (!strictEval(node, state)) state.opaqueEffects.sloppySites.add(node);
				const sites = state.opaqueEffects.byScope.get(scopeId) ?? [];
				sites.push(node);
				state.opaqueEffects.byScope.set(scopeId, sites);
				let scope = state.scopesById.get(scopeId);
				while (scope?.parentScopeId != null) {
					const children = state.opaqueEffects.children.get(scope.parentScopeId) ?? new Set();
					if (children.has(scope.scopeId)) break;
					children.add(scope.scopeId);
					state.opaqueEffects.children.set(scope.parentScopeId, children);
					scope = state.scopesById.get(scope.parentScopeId);
				}
			}
		};
		createSemanticOpaqueGlobalObserver = (state, dependencies) => {
			if (!state.opaqueEffects.mayReferenceGlobalCode) return undefined;
			const ambientPaths = dependencies.createAmbientPathResolver(state, true);
			let invocationSite;
			const interop = dependencies.createSemanticModuleInterop(state, { intrinsicPath: (node) => {
				const { paths, callerPaths } = ambientPaths(node, invocationSite);
				const path = paths.find((path) => path[1] === "eval" || path[1] === "Function") ?? callerPaths.find((path) => path[1] === "eval" || path[1] === "Function") ?? paths[0];
				if (path?.[0] !== "global" || path.some((key) => key === null)) return undefined;
				return path[1] === "eval" || path[1] === "Function" ? ["intrinsic", ...path] : ["intrinsic", ...path.slice(1)];
			} });
			return (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node) && !t.isNewExpression(node) && !t.isTaggedTemplateExpression(node)) return;
				invocationSite = node;
				const path = interop.intrinsicInvocation(node)?.path;
				if (path?.join(".") === "intrinsic.global.eval" || path?.join(".") === "intrinsic.global.Function") state.opaqueEffects.globalSites.push(node);
			};
		};
		semanticOpaqueGlobalMayHaveChanged = (read, state) => state.opaqueEffects.globalSites.some((effect) => semanticEffectTiming(read, effect, state) !== "after");
		semanticBindingMayHaveOpaqueEffect = (binding, state, read, kind = "binding") => {
			if (state.opaqueEffects.byScope.size === 0) return false;
			for (const effect of semanticOpaqueBindingEffects(binding, state, kind)) if (read === undefined || semanticEffectTiming(read, effect, state) !== "after" && !semanticBindingEffectFollowsCapture(binding, read, effect, state.parentsByNode) && !(kind === "binding" && semanticBindingEffectFollowsRead(binding, read, effect, state.parentsByNode))) return true;
			return false;
		};
		semanticOpaqueNameMayHaveChanged = (read, state, binding) => {
			if (state.opaqueEffects.byScope.size === 0) return false;
			const visible = new Set();
			let node = read;
			while (node !== undefined) {
				const scope = state.scopeByNode.get(node);
				if (scope !== undefined) {
					let current = scope;
					while (current !== undefined) {
						visible.add(current.scopeId);
						current = current.parentScopeId === null ? undefined : state.scopesById.get(current.parentScopeId);
					}
					break;
				}
				node = state.parentsByNode.get(node);
			}
			for (const [scopeId, sites] of state.opaqueEffects.byScope) {
				let scope = state.scopesById.get(scopeId);
				while (scope !== undefined && scope.kind !== "function" && scope.kind !== "program") scope = scope.parentScopeId === null ? undefined : state.scopesById.get(scope.parentScopeId);
				if (scope !== undefined && visible.has(scope.scopeId) && (binding === undefined || activation(binding.scopeId, state) !== scope.scopeId) && sites.some((effect) => state.opaqueEffects.sloppySites.has(effect) && (binding === undefined || resolveSemanticBindingState(state, effect, binding.name)?.bindingId === binding.bindingId) && semanticEffectTiming(read, effect, state) !== "after" && !semanticReadPrecedesEffectWithinActivation(read, effect, state.parentsByNode))) return true;
			}
			return false;
		};
		semanticBindingCanBeRebound = (binding) => binding.mutable || binding.definitions.some(({ kind }) => kind === "function" || kind === "class") && binding.initializers.some(({ node }) => t.isFunctionDeclaration(node) || t.isClassDeclaration(node));
		semanticOpaqueBindingReadMayHaveChanged = (binding, read, state) => semanticBindingCanBeRebound(binding) && semanticBindingMayHaveOpaqueEffect(binding, state, read) || semanticOpaqueNameMayHaveChanged(read, state, binding);
		activation = (scopeId, state) => {
			let scope = state.scopesById.get(scopeId);
			while (scope !== undefined && scope.kind !== "function" && scope.kind !== "program" && scope.parentScopeId !== null) scope = state.scopesById.get(scope.parentScopeId);
			return scope?.scopeId ?? scopeId;
		};
		strictEval = (site, state) => {
			for (let node = site; node !== undefined; node = state.parentsByNode.get(node)) {
				if (t.isClass(node) || t.isProgram(node) && javaScriptProgramStrictness(node) === "strict") return true;
				const directives = t.isFunction(node) && t.isBlockStatement(node.body) ? node.body.directives : [];
				if (directives.some(({ value }) => value.value === "use strict")) return true;
			}
			return false;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptStaticAnalysisHelpers.js
var failedJavaScriptStaticAnalysis, argumentNode, chunkRuntime, findChunkRuntime, moduleFactory, modulePropertyName, staticArrayValues, staticPathResolutionContext, staticPath, staticPathFact, staticFileExpressionPath, staticConcatenation, staticCallPath, staticFileUrlPathFact, staticSourceRelativeUrlPath, staticResolvedPath, isFilesystemPathExpression, isDirectoryPath, isImportMetaUrl, isFileIdentity, XHR_METHODS, isRequestUrlOrPathLiteral, isRequestUrlReference, WINDOW_OPEN_CALL, FS_OPEN_FLAGS, BROWSING_CONTEXT_KEYWORDS, xhrOpenUrl, KEYED_COLLECTION_CONSTRUCTORS, isKeyedCollectionReceiver, endpointArgument, storageKind, calleeName, memberPropertyName, stringValue, argumentValue, prefixedArgument, sourceSlice, range, rangeForOffsets, sourceRangesEqual, pointForOffset, detectVendors, registrationKey, sha256Text, STATIC_ROUTE_CALL_NAMES, vendorPatterns;
function init_javascriptStaticAnalysisHelpers() {
	return (init_javascriptStaticAnalysisHelpers = __esmMin((() => {
		init_javascriptAstValues();
		init_unicodeCodePointOrder();
		init_javascriptStaticCoverage();
		failedJavaScriptStaticAnalysis = () => ({
			parse_status: "failed",
			analysis_coverage: {
				...unexaminedJavaScriptStaticCoverage("JavaScript source could not be parsed."),
				syntax: {
					status: "failed",
					error_count: null
				}
			},
			parse_error_count: 1,
			visited_ast_nodes: 0,
			references: [],
			endpoints: [],
			storage: [],
			bundler_registrations: [],
			role_paths: [],
			source_map_urls: [],
			vendors: [],
			electron: {
				browser_windows: [],
				context_bridge_apis: [],
				ipc: [],
				sender_validations: [],
				utility_processes: [],
				native_addon_bindings: [],
				protocols: []
			},
			limitations: ["JavaScript source could not be parsed; absence of findings is not evidence of absence.", "JavaScript syntax was parsed as data and was never evaluated."]
		});
		argumentNode = (argument) => argument !== null && t.isNode(argument) ? argument : undefined;
		chunkRuntime = (call) => {
			if (!t.isMemberExpression(call.callee) && !t.isOptionalMemberExpression(call.callee)) return undefined;
			if (semanticStaticPropertyName(call.callee.property, call.callee.computed) !== "push") return undefined;
			return findChunkRuntime(call.callee.object);
		};
		findChunkRuntime = (node) => {
			const pending = [node];
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined) continue;
				if (t.isIdentifier(current) && /(?:webpack|rspack)Chunk/iu.test(current.name)) return current.name;
				if (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
					const property = semanticStaticPropertyName(current.property, current.computed);
					if (/(?:webpack|rspack)Chunk/iu.test(property)) return property;
					if (t.isNode(current.object)) pending.push(current.object);
					continue;
				}
				if (t.isAssignmentExpression(current)) {
					pending.push(current.right, current.left);
					continue;
				}
				if (t.isLogicalExpression(current) || t.isBinaryExpression(current)) {
					pending.push(current.right, current.left);
					continue;
				}
				const unwrapped = unwrapJavaScriptExpression(current).node;
				if (unwrapped !== current) pending.push(unwrapped);
			}
			return undefined;
		};
		moduleFactory = (property) => {
			if (t.isObjectMethod(property)) return property;
			if (t.isObjectProperty(property) && (t.isFunctionExpression(property.value) || t.isArrowFunctionExpression(property.value))) return property.value;
			return undefined;
		};
		modulePropertyName = (property) => {
			if (!t.isObjectMethod(property) && !t.isObjectProperty(property)) return `[unknown@${String(property.start ?? -1)}]`;
			const key = semanticStaticPropertyKey(property.key, property.computed);
			if (key !== null) return key;
			return property.computed ? `[computed@${String(property.start ?? -1)}]` : `[unknown@${String(property.start ?? -1)}]`;
		};
		staticArrayValues = (array) => {
			const staticValues = array.elements.flatMap((element) => {
				const value = argumentValue(element);
				return value === undefined ? [] : [value];
			});
			const values = [...new Set(staticValues)].sort(compareUnicodeCodePoints);
			return {
				values,
				unknown: array.elements.length - staticValues.length
			};
		};
		staticPathResolutionContext = (node, pathIntrinsics) => isFilesystemPathExpression(node, pathIntrinsics) ? "filesystem-expression" : "module-specifier";
		staticPath = (node, pathIntrinsics) => staticPathFact(node, pathIntrinsics)?.path;
		staticPathFact = (raw, pathIntrinsics) => {
			const node = unwrapJavaScriptExpression(raw).node;
			const value = stringValue(node);
			if (value !== undefined) return {
				path: value,
				base: "literal-path"
			};
			if (t.isBinaryExpression(node, { operator: "+" })) return staticConcatenation(node, pathIntrinsics);
			if (t.isCallExpression(node) || t.isNewExpression(node)) return staticCallPath(node, pathIntrinsics);
			return undefined;
		};
		staticFileExpressionPath = (node, pathIntrinsics) => {
			const fact = staticPathFact(node, pathIntrinsics);
			return fact === undefined || fact.base === "unknown" ? undefined : {
				path: fact.path,
				base: fact.base
			};
		};
		staticConcatenation = (node, pathIntrinsics) => {
			const operands = [];
			let current = node;
			while (t.isBinaryExpression(current, { operator: "+" })) {
				operands.push(current.right);
				current = unwrapJavaScriptExpression(current.left).node;
			}
			const anchored = isDirectoryPath(current, pathIntrinsics);
			if (!anchored) operands.push(current);
			let text = "";
			let literal = true;
			for (const operand of operands.reverse()) {
				const value = staticPathFact(operand, pathIntrinsics);
				if (value === undefined) return undefined;
				text += value.path;
				literal &&= value.base === "literal-path";
			}
			if (!anchored) return {
				path: text,
				base: literal ? "literal-path" : "unknown"
			};
			return text.startsWith("/") ? {
				path: posix.join(".", text),
				base: literal ? "source-directory" : "unknown"
			} : undefined;
		};
		staticCallPath = (node, pathIntrinsics) => {
			if (t.isCallExpression(node) && pathIntrinsics?.(node.callee)) return staticResolvedPath(node, pathIntrinsics);
			if (t.isCallExpression(node) && pathIntrinsics?.(node.callee, "file-url-to-path")) return staticFileUrlPathFact(node, pathIntrinsics);
			if (!t.isCallExpression(node) || !pathIntrinsics?.(node.callee, "join")) return undefined;
			const parts = [];
			for (const argument of node.arguments) {
				if (isDirectoryPath(argumentNode(argument), pathIntrinsics)) {
					parts.push({
						path: ".",
						base: "source-directory"
					});
					continue;
				}
				const value = t.isNode(argument) ? staticPathFact(argument, pathIntrinsics) : undefined;
				if (value === undefined) return undefined;
				parts.push(value);
			}
			if (parts.length === 0) return undefined;
			const first = parts.findIndex(({ path }) => path !== "");
			const sourceAnchors = parts.flatMap(({ base }, index) => base === "source-directory" ? [index] : []);
			const base = parts.some(({ base }) => base === "unknown") ? "unknown" : sourceAnchors.length === 0 ? "literal-path" : sourceAnchors.length === 1 && sourceAnchors[0] === first ? "source-directory" : "unknown";
			return {
				path: posix.join(...parts.map(({ path }) => path)),
				base
			};
		};
		staticFileUrlPathFact = (node, pathIntrinsics) => {
			if (node.arguments.length !== 1) return undefined;
			const rawArgument = argumentNode(node.arguments[0]);
			if (rawArgument === undefined) return undefined;
			const argument = unwrapJavaScriptExpression(rawArgument).node;
			if (t.isNewExpression(argument) && pathIntrinsics?.(argument, "source-url")) {
				const resolved = staticSourceRelativeUrlPath(argument);
				return resolved === undefined ? undefined : {
					path: resolved.path,
					base: "source-directory"
				};
			}
			const value = staticPath(argument, pathIntrinsics);
			const rawPath = value?.split(/[?#]/u, 1)[0] ?? "";
			if (value === undefined || !/^file:/iu.test(value) || value !== value.trim() || value.includes("\\") || [...value].some((character) => character.charCodeAt(0) < 32) || /%(?:2f|5c)/iu.test(rawPath)) return undefined;
			try {
				const url = new URL(value);
				if (url.protocol !== "file:") return undefined;
				const path = fileURLToPath(url, { windows: false });
				return /^\/[a-z]:/iu.test(path) ? undefined : {
					path,
					base: "literal-path"
				};
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		staticSourceRelativeUrlPath = (node) => {
			const value = stringValue(node.arguments[0]);
			if (value === undefined || (value.split(/[?#]/u, 1)[0] ?? "") === "" || value !== value.trim() || value.includes("\\") || [...value].some((character) => character.charCodeAt(0) < 32) || /^[a-z][a-z0-9+.-]*:/iu.test(value) || value.startsWith("//") || /%(?:2e|2f|5c)/iu.test(value.split(/[?#]/u, 1)[0] ?? "")) return undefined;
			const directory = `/${"source/".repeat(value.split("/").length + 1)}`;
			try {
				const resolved = new URL(value, `file://${directory}entry.js`);
				const path = fileURLToPath(resolved, { windows: false });
				if (value.startsWith("/")) return {
					path,
					directory: resolved.pathname.endsWith("/")
				};
				const relative = posix.relative(directory, path) || ".";
				return {
					path: value.startsWith("./") && relative !== "." && !relative.startsWith("../") ? `./${relative}` : relative,
					directory: resolved.pathname.endsWith("/")
				};
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		staticResolvedPath = (node, pathIntrinsics) => {
			const parts = [];
			let base;
			for (let index = node.arguments.length - 1; index >= 0; index -= 1) {
				const argument = node.arguments[index];
				if (isDirectoryPath(argumentNode(argument), pathIntrinsics)) {
					base = "source-directory";
					break;
				}
				const value = t.isNode(argument) ? staticPathFact(argument, pathIntrinsics) : undefined;
				if (value === undefined || value.base === "unknown") return undefined;
				parts.push(value.path);
				if (value.base === "source-directory" || posix.isAbsolute(value.path)) {
					base = value.base;
					break;
				}
			}
			if (base === undefined) return undefined;
			const path = posix.join(...parts.reverse());
			return {
				path: path === "/" ? path : path.replace(/\/$/u, ""),
				base
			};
		};
		isFilesystemPathExpression = (node, pathIntrinsics) => {
			node = unwrapJavaScriptExpression(node).node;
			const value = stringValue(node);
			if (value !== undefined) return value.startsWith("/");
			if (isFileIdentity(node) || isDirectoryPath(node, pathIntrinsics)) return true;
			if (t.isBinaryExpression(node, { operator: "+" })) return isFilesystemPathExpression(node.left, pathIntrinsics) || isFilesystemPathExpression(node.right, pathIntrinsics);
			if (t.isCallExpression(node) || t.isNewExpression(node)) {
				if (!t.isCallExpression(node)) return false;
				const native = pathIntrinsics?.(node.callee) || pathIntrinsics?.(node.callee, "join") || pathIntrinsics?.(node.callee, "file-url-to-path");
				return native === true && staticCallPath(node, pathIntrinsics) !== undefined;
			}
			return false;
		};
		isDirectoryPath = (node, pathIntrinsics) => {
			if (node !== undefined) node = unwrapJavaScriptExpression(node).node;
			return node !== undefined && pathIntrinsics?.(node, "source-directory") === true;
		};
		isImportMetaUrl = (node) => {
			if (node === undefined) return false;
			const expression = unwrapJavaScriptExpression(node).node;
			if (!t.isMemberExpression(expression)) return false;
			const object = unwrapJavaScriptExpression(expression.object).node;
			return t.isMetaProperty(object) && object.meta.name === "import" && object.property.name === "meta" && semanticStaticPropertyName(expression.property, expression.computed) === "url";
		};
		isFileIdentity = (node) => {
			if (node !== undefined) node = unwrapJavaScriptExpression(node).node;
			if (t.isIdentifier(node, { name: "__filename" }) || isImportMetaUrl(node)) return true;
			if (!t.isCallExpression(node)) return false;
			const name = calleeName(node.callee);
			return (name === "fileURLToPath" || name.endsWith(".fileURLToPath")) && isFileIdentity(argumentNode(node.arguments[0]));
		};
		XHR_METHODS = new Set([
			"CONNECT",
			"DELETE",
			"GET",
			"HEAD",
			"OPTIONS",
			"PATCH",
			"POST",
			"PUT",
			"TRACE"
		]);
		isRequestUrlOrPathLiteral = (value) => /^(?:https?|wss?):\/\//iu.test(value) || value.startsWith("/") || value.startsWith("./") || value.startsWith("../");
		isRequestUrlReference = (value) => {
			if (isRequestUrlOrPathLiteral(value) || value.startsWith("?") || value.startsWith("#")) return true;
			if (!/^(?:https?|wss?):/iu.test(value)) return false;
			return URL.parse(value) !== null;
		};
		WINDOW_OPEN_CALL = /(?:^|\.)(?:window|self|globalThis|top|parent|opener|frames|document)\.open$/u;
		FS_OPEN_FLAGS = new Set([
			"a",
			"a+",
			"as",
			"as+",
			"ax",
			"ax+",
			"r",
			"r+",
			"rs",
			"rs+",
			"sa",
			"sa+",
			"sr",
			"sr+",
			"w",
			"w+",
			"wx",
			"wx+",
			"xa",
			"xa+",
			"xw",
			"xw+"
		]);
		BROWSING_CONTEXT_KEYWORDS = new Set([
			"_blank",
			"_parent",
			"_self",
			"_top"
		]);
		xhrOpenUrl = (name, methodNode, urlNode, receiverFact) => {
			const url = stringValue(urlNode);
			if (url === undefined) return undefined;
			if (receiverFact === "window") return undefined;
			const method = stringValue(methodNode);
			const storage = receiverFact === "local-indexed-db" || receiverFact === "local-cache-storage" || receiverFact === "indexed-db" || receiverFact === "cache-storage" || storageKind(name) !== undefined;
			if (method === undefined) return storage || receiverFact === undefined && WINDOW_OPEN_CALL.test(name) || FS_OPEN_FLAGS.has(url) || BROWSING_CONTEXT_KEYWORDS.has(url.toLowerCase()) ? undefined : url;
			return XHR_METHODS.has(method.toUpperCase()) || (!storage || receiverFact === "local-indexed-db" || receiverFact === "local-cache-storage") && /^[A-Z][A-Z-]*$/u.test(method) ? url : undefined;
		};
		KEYED_COLLECTION_CONSTRUCTORS = new Set([
			"FormData",
			"Headers",
			"Map",
			"Set",
			"URLSearchParams",
			"WeakMap",
			"WeakSet"
		]);
		isKeyedCollectionReceiver = (callee) => {
			callee = unwrapJavaScriptExpression(callee).node;
			if (!t.isMemberExpression(callee) && !t.isOptionalMemberExpression(callee)) return false;
			const receiver = unwrapJavaScriptExpression(callee.object).node;
			if (t.isNewExpression(receiver)) {
				const constructor = unwrapJavaScriptExpression(receiver.callee).node;
				return t.isIdentifier(constructor) && KEYED_COLLECTION_CONSTRUCTORS.has(constructor.name);
			}
			if (!t.isMemberExpression(receiver) && !t.isOptionalMemberExpression(receiver)) return false;
			const property = semanticStaticPropertyName(receiver.property, receiver.computed);
			return property === "headers" || property === "headersList" || property === "searchParams";
		};
		endpointArgument = (name, args, callee, receiverFact) => {
			const candidate = (value) => value === undefined ? undefined : {
				kind: "candidate",
				value
			};
			if (receiverFact === "window") return undefined;
			if (name === "fetch" || name.endsWith(".fetch") || name === "WebSocket" || name === "EventSource" || name.endsWith(".EventSource")) return candidate(stringValue(args[0]));
			if (name.endsWith(".open")) {
				const value = xhrOpenUrl(name, args[0], args[1], receiverFact);
				if (value === undefined) return undefined;
				return {
					kind: "candidate",
					value
				};
			}
			const method = [
				"get",
				"post",
				"put",
				"patch",
				"delete",
				"request"
			].find((candidate) => name === candidate || name.endsWith(`.${candidate}`));
			if (method !== undefined) {
				const value = stringValue(args[0]);
				if (value === undefined) return undefined;
				if ((method === "get" || method === "delete") && !isRequestUrlOrPathLiteral(value) && (isKeyedCollectionReceiver(callee) || method === "get" && (receiverFact === "configuration" || receiverFact === "extension-state"))) return undefined;
				return {
					kind: "candidate",
					value
				};
			}
			if (name === "sendBeacon" || name.endsWith(".sendBeacon")) return candidate(stringValue(args[0]));
			if (name === "loadURL" || name.endsWith(".loadURL")) {
				const value = stringValue(args[0]);
				return value === undefined ? undefined : {
					kind: "candidate",
					value
				};
			}
			return undefined;
		};
		storageKind = (name) => {
			if (name.includes("localStorage.")) return "local-storage";
			if (name.includes("sessionStorage.")) return "session-storage";
			if (name.endsWith("indexedDB.open")) return "indexed-db";
			if (name.endsWith("caches.open")) return "cache-storage";
			return undefined;
		};
		calleeName = (node) => {
			node = unwrapJavaScriptExpression(node).node;
			const segments = [];
			while (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
				segments.push(memberPropertyName(node));
				if (!t.isNode(node.object)) break;
				node = unwrapJavaScriptExpression(node.object).node;
			}
			const base = t.isIdentifier(node) ? node.name : "";
			segments.push(base);
			segments.reverse();
			const first = segments.findIndex((segment) => segment !== "");
			return first === -1 ? "" : segments.slice(first).join(".");
		};
		memberPropertyName = (node) => semanticStaticPropertyKey(node.property, node.computed) ?? (node.computed ? `[computed@${String(node.property.start ?? -1)}]` : "");
		stringValue = (node) => {
			if (node === null || node === undefined) return undefined;
			const literal = readExactJavaScriptLiteral(node);
			return literal.found && typeof literal.value === "string" ? literal.value : undefined;
		};
		argumentValue = (node) => t.isNumericLiteral(node) ? String(node.value) : stringValue(node);
		prefixedArgument = (prefix, node) => {
			const value = argumentValue(node);
			return value === undefined ? undefined : `${prefix}${value}`;
		};
		sourceSlice = (source, node) => typeof node.start !== "number" || typeof node.end !== "number" ? "" : source.slice(node.start, node.end);
		range = (node) => ({
			start: {
				line: node.loc?.start.line ?? 1,
				column: node.loc?.start.column ?? 0
			},
			end: {
				line: node.loc?.end.line ?? node.loc?.start.line ?? 1,
				column: node.loc?.end.column ?? node.loc?.start.column ?? 0
			}
		});
		rangeForOffsets = (source, start, end) => ({
			start: pointForOffset(source, start),
			end: pointForOffset(source, end)
		});
		sourceRangesEqual = (left, right) => left !== null && left.start.line === right.start.line && left.start.column === right.start.column && left.end.line === right.end.line && left.end.column === right.end.column;
		pointForOffset = (source, offset) => {
			const before = source.slice(0, offset);
			const lines = before.split(/\r\n|[\n\r\u2028\u2029]/u);
			return {
				line: lines.length,
				column: lines.at(-1)?.length ?? 0
			};
		};
		detectVendors = (source) => vendorPatterns.flatMap(({ name, patterns }) => patterns.some((pattern) => source.includes(pattern)) ? [name] : []);
		registrationKey = (registration) => compositeKey([
			registration.runtime,
			registration.chunk_keys,
			String(registration.unknown_chunk_keys),
			registration.runtime_require_name,
			registration.runtime_module_cache_status,
			registration.entry_module_keys,
			String(registration.unknown_entry_module_keys),
			registration.async_chunk_keys,
			String(registration.unknown_async_chunk_keys),
			registration.modules.map(({ module_key: key, source_sha256: digest }) => [key, digest])
		]);
		sha256Text = (value) => createHash("sha256").update(value).digest("hex");
		STATIC_ROUTE_CALL_NAMES = [
			"route",
			"addRoute",
			"useRoutes",
			"createBrowserRouter",
			"createHashRouter"
		];
		vendorPatterns = [
			{
				name: "webpack",
				patterns: ["__webpack_require__", "webpackChunk"]
			},
			{
				name: "Rspack",
				patterns: ["__webpack_require__.f", "rspackChunk"]
			},
			{
				name: "Vite",
				patterns: ["__vite__", "import.meta.hot"]
			},
			{
				name: "Rollup",
				patterns: ["ROLLUP_FILE_URL", "import.meta.ROLLUP"]
			},
			{
				name: "esbuild",
				patterns: ["__commonJS", "__esm"]
			},
			{
				name: "React",
				patterns: ["React.createElement", "react/jsx-runtime"]
			},
			{
				name: "Vue",
				patterns: ["__VUE__", "createApp("]
			},
			{
				name: "Next.js",
				patterns: ["__NEXT_DATA__", "/_next/"]
			},
			{
				name: "Angular",
				patterns: ["ɵɵdefineComponent"]
			},
			{
				name: "Svelte",
				patterns: ["svelte/internal"]
			}
		];
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticGlobalReference.js
var GLOBAL_OBJECT_NAMES, globalObjectName, globalReferenceNamespace, isUnmodifiedGlobalReference, isUnmodifiedImportMetaUrl;
function init_javascriptSemanticGlobalReference() {
	return (init_javascriptSemanticGlobalReference = __esmMin((() => {
		init_javascriptElectronMemberWrites();
		init_javascriptSemanticMutationInitializers();
		init_javascriptStaticAnalysisHelpers();
		GLOBAL_OBJECT_NAMES = [
			"globalThis",
			"global",
			"window",
			"self"
		];
		globalObjectName = (node, state) => GLOBAL_OBJECT_NAMES.find((name) => isUnshadowedGlobal(node, state, name));
		globalReferenceNamespace = (callee, state, path) => {
			const { root, members } = electronMemberPath(callee);
			const matches = (expected) => members.length === expected.length && members.every((key, index) => key === expected[index]);
			if (isUnshadowedGlobal(root, state, path[0]) && matches(path.slice(1))) return null;
			const namespace = globalObjectName(root, state);
			return namespace !== undefined && matches(path) ? namespace : undefined;
		};
		isUnmodifiedGlobalReference = (callee, state, name) => {
			const path = typeof name === "string" ? [name] : name;
			if (state.ambientWrites.covers(["global", ...path])) return false;
			const namespace = globalReferenceNamespace(callee, state, path);
			return namespace !== undefined && (namespace === null || !state.ambientWrites.covers(["global", namespace]));
		};
		isUnmodifiedImportMetaUrl = (node, state) => isImportMetaUrl(node) && !state.ambientWrites.covers(["import-meta", "url"]);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticPropertyKeys.js
var wellKnownSymbols, semanticKnownSymbolKey;
function init_javascriptSemanticPropertyKeys() {
	return (init_javascriptSemanticPropertyKeys = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticGlobalReference();
		wellKnownSymbols = new Set([
			"asyncIterator",
			"hasInstance",
			"isConcatSpreadable",
			"iterator",
			"match",
			"matchAll",
			"replace",
			"search",
			"species",
			"split",
			"toPrimitive",
			"toStringTag",
			"unscopables",
			"dispose",
			"asyncDispose"
		]);
		semanticKnownSymbolKey = (node, state) => {
			const key = unwrapJavaScriptExpression(node).node;
			if (!t.isMemberExpression(key)) return false;
			const name = semanticStaticPropertyKey(key.property, key.computed);
			return name !== null && wellKnownSymbols.has(name) && isUnmodifiedGlobalReference(key, state, ["Symbol", name]);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSymbolicValues.js
var symbolicUnknown, symbolicVariants, symbolicUnion, symbolicTruth, symbolicCondition, symbolicConditionsUnresolved;
function init_javascriptSymbolicValues() {
	return (init_javascriptSymbolicValues = __esmMin((() => {
		symbolicUnknown = (reason) => ({
			kind: "unknown",
			reason
		});
		symbolicVariants = (value) => value.kind === "union" ? value.values : [value];
		symbolicUnion = (values) => {
			const unique = [...new Set(values.flatMap(symbolicVariants))];
			return unique.length === 1 ? unique[0] : {
				kind: "union",
				values: unique
			};
		};
		symbolicTruth = (value) => {
			if (value.kind === "namespace" && value.runtimeValueUnknown) return undefined;
			if (value.kind === "union") {
				const choices = value.values.map(symbolicTruth);
				return choices.length > 0 && choices.every((choice) => choice === choices[0]) ? choices[0] : undefined;
			}
			return value.kind === "literal" ? Boolean(value.value) : [
				"function",
				"object",
				"namespace",
				"array",
				"record",
				"loader",
				"promise",
				"iterator"
			].includes(value.kind) ? true : undefined;
		};
		symbolicCondition = (value, condition) => {
			if (value.kind === "union") return symbolicUnion(value.values.map((variant) => symbolicCondition(variant, condition)));
			return {
				...value,
				conditions: [...value.conditions ?? [], condition]
			};
		};
		symbolicConditionsUnresolved = (value) => {
			if (value.kind === "union") return symbolicUnion(value.values.map(symbolicConditionsUnresolved));
			return {
				...value,
				conditionUnresolved: true
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSymbolicControlFlow.js
var logicalRightOperand, symbolicLogicalRight;
function init_javascriptSymbolicControlFlow() {
	return (init_javascriptSymbolicControlFlow = __esmMin((() => {
		init_javascriptSymbolicValues();
		logicalRightOperand = (operator, truth, nullish) => operator === "??" ? nullish : truth === undefined ? undefined : operator === "&&" ? truth : !truth;
		symbolicLogicalRight = (operator, left) => {
			if (left.kind === "namespace" && left.runtimeValueUnknown) return undefined;
			if (left.kind === "union") {
				const choices = left.values.map((value) => symbolicLogicalRight(operator, value));
				return choices.length > 0 && choices.every((choice) => choice === choices[0]) ? choices[0] : undefined;
			}
			if (operator === "??") {
				if (left.kind === "literal") return left.value === null || left.value === undefined;
				return [
					"function",
					"object",
					"namespace",
					"array",
					"record",
					"loader",
					"promise",
					"iterator"
				].includes(left.kind) ? false : undefined;
			}
			const truth = symbolicTruth(left);
			return logicalRightOperand(operator, truth, undefined);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticDependencies.js
var SemanticDependencyProofs;
function init_javascriptSemanticDependencies() {
	return (init_javascriptSemanticDependencies = __esmMin((() => {
		SemanticDependencyProofs = class SemanticDependencyProofs {
			layout;
			unions = new WeakMap();
			constructor(layout) {
				this.layout = layout;
			}
			static forBindings(bindings) {
				const indices = new Map();
				for (const binding of bindings) indices.set(binding, indices.size);
				return new SemanticDependencyProofs({
					indices,
					singletons: new Map(),
					height: Math.ceil(Math.log2(Math.max(1, indices.size)))
				});
			}
			/** Share identity proofs while retaining unions for only one query. */
			forQuery() {
				return new SemanticDependencyProofs(this.layout);
			}
			binding(binding) {
				const prior = this.layout.singletons.get(binding);
				if (prior !== undefined) return prior;
				const index = this.index(binding);
				let proof = true;
				for (let bit = 0; bit < this.layout.height; bit++) {
					const one = Math.floor(index / 2 ** bit) % 2 === 1;
					proof = Object.freeze({
						zero: one ? undefined : proof,
						one: one ? proof : undefined
					});
				}
				this.layout.singletons.set(binding, proof);
				return proof;
			}
			union(first, second) {
				if (first === second || second === undefined) return first;
				if (first === undefined) return second;
				if (first === true || second === true) return true;
				const cached = this.unions.get(first)?.get(second) ?? this.unions.get(second)?.get(first);
				if (cached !== undefined) return cached;
				const zero = this.union(first.zero, second.zero);
				const one = this.union(first.one, second.one);
				const result = zero === first.zero && one === first.one ? first : zero === second.zero && one === second.one ? second : Object.freeze({
					zero,
					one
				});
				let unions = this.unions.get(first);
				if (unions === undefined) {
					unions = new WeakMap();
					this.unions.set(first, unions);
				}
				unions.set(second, result);
				return result;
			}
			intersects(proof, active) {
				for (const binding of active.keys()) if (this.has(proof, binding)) return true;
				return false;
			}
			has(proof, binding) {
				const index = this.index(binding);
				for (let bit = this.layout.height - 1; bit >= 0; bit--) {
					if (proof === undefined) return false;
					if (proof === true) return true;
					proof = Math.floor(index / 2 ** bit) % 2 === 1 ? proof.one : proof.zero;
				}
				return proof === true;
			}
			index(binding) {
				const index = this.layout.indices.get(binding);
				if (index === undefined) throw new TypeError(`Unindexed semantic dependency: ${binding}`);
				return index;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticSlots.js
function semanticContainer(value) {
	if (value.status === "object") return {
		slots: value.properties,
		coverage: value.unknownProperties ? {
			status: "partial",
			omitted: value.omittedProperties
		} : {
			status: "complete",
			omitted: 0
		}
	};
	if (value.status === "array") return {
		slots: value.items,
		coverage: value.unknownItems ? {
			status: "partial",
			omitted: value.omittedItems
		} : {
			status: "complete",
			omitted: 0
		}
	};
	return null;
}
var semanticSlotAtPath, semanticPropertyPointer;
function init_javascriptSemanticSlots() {
	return (init_javascriptSemanticSlots = __esmMin((() => {
		semanticSlotAtPath = (value, path) => {
			const leafName = path.at(-1) ?? "";
			let current = {
				name: "",
				presence: "present",
				value
			};
			for (const [index, name] of path.entries()) {
				const container = semanticContainer(current.value);
				if (current.presence !== "present" || container === null) return {
					name: leafName,
					presence: "unknown-coverage",
					value: "reason" in current.value ? {
						...current.value,
						reason: `${current.value.reason} Cannot continue ${semanticPropertyPointer(path)} through receiver ${semanticPropertyPointer(path.slice(0, index))}.`
					} : {
						status: "unknown",
						reason: `Cannot resolve ${semanticPropertyPointer(path)} through ${current.value.status} receiver ${semanticPropertyPointer(path.slice(0, index))}.`
					}
				};
				if (current.value.status === "array" && name === "length") {
					current = {
						name,
						presence: "present",
						value: {
							status: "unknown",
							reason: "Array length is present but its value is not retained."
						}
					};
					continue;
				}
				const observed = container.slots.find((slot) => slot.name === name);
				current = observed ?? {
					name,
					presence: container.coverage.status === "complete" ? "absent" : "unknown-coverage",
					value: {
						status: "unknown",
						reason: `Own property ${name} was not observed.`
					}
				};
			}
			return current;
		};
		semanticPropertyPointer = (path) => path.map((key) => `/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`).join("");
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticMutationValues.js
var invalidateSemanticEscapedPath, invalidateSemanticMutationPaths;
function init_javascriptSemanticMutationValues() {
	return (init_javascriptSemanticMutationValues = __esmMin((() => {
		init_javascriptSemanticPropertyPaths();
		invalidateSemanticEscapedPath = (value, path) => {
			if (value.status !== "object" && value.status !== "array") return value;
			const [key, ...remaining] = path;
			if (key === undefined) return {
				status: "unknown",
				reason: "This object reference may have been mutated by a call."
			};
			const invalidateChild = (property) => semanticPropertyPathKeyMatches(key, property.name) ? {
				...property,
				value: invalidateSemanticEscapedPath(property.value, remaining)
			} : property;
			return value.status === "object" ? {
				...value,
				properties: value.properties.map(invalidateChild)
			} : {
				...value,
				items: value.items.map(invalidateChild)
			};
		};
		invalidateSemanticMutationPaths = (value, paths) => {
			if (paths.length === 0) return value;
			if (value.status !== "object" && value.status !== "array" || paths.some(([key]) => key === undefined || key === null)) return {
				status: "unknown",
				reason: "This property may have been mutated."
			};
			const reset = value.status === "array" ? paths.findLastIndex(([key]) => key === "length") : -1;
			const base = reset < 0 ? value : {
				status: "array",
				items: [],
				unknownItems: true,
				omittedItems: null
			};
			const slots = base.status === "object" ? base.properties : base.items;
			const slotsByName = new Map();
			slots.forEach((property, index) => {
				const indexes = slotsByName.get(property.name) ?? [];
				indexes.push(index);
				slotsByName.set(property.name, indexes);
			});
			const slotPaths = new Map();
			const replacedSlots = new Set();
			const select = (index, remaining) => {
				const selected = slotPaths.get(index) ?? [];
				selected.push(remaining);
				slotPaths.set(index, selected);
				if (remaining.length === 0) replacedSlots.add(index);
			};
			const added = new Set();
			for (const [key, ...remaining] of paths.slice(reset + 1)) {
				if (key === undefined || key === null) continue;
				if (typeof key === "object") {
					slots.forEach((property, index) => {
						if (semanticPropertyPathKeyMatches(key, property.name)) select(index, remaining);
					});
					continue;
				}
				const indexes = slotsByName.get(String(key));
				if (indexes === undefined) added.add(String(key));
				else for (const index of indexes) select(index, remaining);
			}
			const properties = slots.map((property, index) => {
				const selected = slotPaths.get(index);
				return selected === undefined ? property : {
					...property,
					...replacedSlots.has(index) ? { presence: "unknown-coverage" } : {},
					value: invalidateSemanticMutationPaths(property.value, selected)
				};
			});
			for (const name of added) properties.push({
				name,
				value: {
					status: "unknown",
					reason: "This property may have been mutated."
				},
				presence: "unknown-coverage"
			});
			return base.status === "object" ? {
				...base,
				properties
			} : {
				...base,
				items: properties
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticProvenance.js
var semanticLocalProvenance, semanticUnresolvedProvenance, semanticAmbiguousProvenance, semanticOriginsProvenance, uniqueSemanticOrigins, semanticOriginKey, semanticPrimitiveKey, semanticBuiltinNamespacePath;
function init_javascriptSemanticProvenance() {
	return (init_javascriptSemanticProvenance = __esmMin((() => {
		init_unicodeCodePointOrder();
		semanticLocalProvenance = () => ({
			status: "local",
			origins: [],
			reason: null
		});
		semanticUnresolvedProvenance = (status, reason) => ({
			status,
			origins: [],
			reason
		});
		semanticAmbiguousProvenance = (origins, reason) => ({
			status: "ambiguous",
			origins,
			reason
		});
		semanticOriginsProvenance = (origins) => {
			const unique = uniqueSemanticOrigins(origins);
			const origin = unique[0];
			return unique.length === 1 && origin !== undefined ? {
				status: "module",
				origins: [origin],
				reason: null
			} : semanticAmbiguousProvenance(unique, "Multiple module origins.");
		};
		uniqueSemanticOrigins = (origins) => [...new Map(origins.map((origin) => [semanticOriginKey(origin), origin])).values()].sort((left, right) => compareUnicodeCodePoints(semanticOriginKey(left), semanticOriginKey(right)));
		semanticOriginKey = (origin) => JSON.stringify([
			origin.specifier,
			origin.importedPath,
			origin.resolutionMode ?? "import"
		]);
		semanticPrimitiveKey = (value) => `${value === null ? "null" : typeof value}:${JSON.stringify(value)}`;
		semanticBuiltinNamespacePath = (importedPath) => importedPath.length === 0 || importedPath.length === 1 && importedPath[0] === "default";
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticPrimitives.js
var semanticPrimitiveSet, semanticPrimitiveCandidates;
function init_javascriptSemanticPrimitives() {
	return (init_javascriptSemanticPrimitives = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_javascriptSemanticProvenance();
		init_javascriptSemanticResourceLimits();
		semanticPrimitiveSet = (values) => {
			let uniqueValues;
			for (const value of values) {
				if (typeof value === "number" && !Number.isFinite(value)) return {
					status: "unknown",
					reason: "Nonfinite numbers are outside the JSON primitive lattice."
				};
				if (typeof value === "number" && Object.is(value, -0)) return {
					status: "unknown",
					reason: "Negative zero cannot be preserved by JSON primitive evidence."
				};
				if (values.length === 1) return typeof value === "string" && exceedsSemanticPrimitiveStringByteBudget([value]) ? semanticResourceLimitUnknown("primitive-bytes") : {
					status: "literal",
					value
				};
				uniqueValues ??= new Set();
				uniqueValues.add(value);
				if (uniqueValues.size > 256) return semanticResourceLimitUnknown("primitive-candidates");
			}
			if (uniqueValues === undefined) return {
				status: "union",
				values: []
			};
			if (exceedsSemanticPrimitiveStringByteBudget([...uniqueValues].flatMap((value) => typeof value === "string" ? [value] : []))) return semanticResourceLimitUnknown("primitive-bytes");
			const unique = [...uniqueValues].map((value) => ({
				key: semanticPrimitiveKey(value),
				value
			})).sort((left, right) => compareUnicodeCodePoints(left.key, right.key)).map(({ value }) => value);
			const only = unique[0];
			return unique.length === 1 && only !== undefined ? {
				status: "literal",
				value: only
			} : {
				status: "union",
				values: unique
			};
		};
		semanticPrimitiveCandidates = (value) => value.status === "literal" ? [value.value] : value.status === "union" ? value.values : null;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticValues.js
var definitelyDefinedValues, definedNonPrimitiveValue, semanticValueDefinitelyDefined, dependencyProofsByState, createEvaluationMemo, CALLER_INDEPENDENT, EVERY_CALLER, callerIndependentBindingValuesByState, primitiveBindingValuesByState, primitiveExpressionValuesByState, capturedBindingValuesByState, clearSemanticValueCaches, callerIndependentBindingValuesFor, primitiveBindingValuesFor, isSemanticResourceLimit, evaluateSemanticBinding, evaluateSemanticExpression, evaluateSemanticExpressionProvenance, evaluateSemanticProvenance, evaluateSemanticProvenanceAtRead, readMemoizedEvaluation, retainDependencyProof, recordBindingDependency, collectEvaluationDependencies, readSnapshotValuesFor, evaluateBinding, evaluateExpression, evaluateExpressionValue, evaluateTemplate, semanticSelectedBranches, semanticCondition, evaluateObject, evaluateArray, evaluateMember, evaluateAddition, addPrimitiveValues, evaluateUnary, projectValue, provenanceForBinding, provenanceForBindingUncached, provenanceForBindingValue, provenanceForBindingInitializers, provenanceForExpression, provenanceForBindingAtRead, isLocallyCreatedValue, mergeValues, nestedContext, isPrimitive, canCapturePrimitive, primitiveCaptureContext, captureContextAt, evaluateCapturedExpression;
function init_javascriptSemanticValues() {
	return (init_javascriptSemanticValues = __esmMin((() => {
		init_javascriptSemanticOpaqueEffects();
		init_javascriptSemanticPropertyKeys();
		init_javascriptSymbolicControlFlow();
		init_javascriptSemanticDependencies();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticSlots();
		init_javascriptSemanticMutationValues();
		init_javascriptSemanticState();
		init_javascriptSemanticRequireOriginSlot();
		init_unicodeCodePointOrder();
		init_javascriptAstValues();
		init_javascriptSemanticProvenance();
		init_javascriptSemanticPrimitives();
		init_javascriptSemanticResourceLimits();
		definitelyDefinedValues = new WeakSet();
		definedNonPrimitiveValue = (reason) => {
			const value = {
				status: "unknown",
				reason
			};
			definitelyDefinedValues.add(value);
			return value;
		};
		semanticValueDefinitelyDefined = (value) => value.status === "literal" || value.status === "union" || value.status === "object" || value.status === "array" || definitelyDefinedValues.has(value);
		dependencyProofsByState = new WeakMap();
		createEvaluationMemo = (state) => {
			let dependencies = dependencyProofsByState.get(state);
			if (dependencies === undefined) {
				dependencies = SemanticDependencyProofs.forBindings(state.bindingsById.keys());
				dependencyProofsByState.set(state, dependencies);
			}
			return {
				provenance: new Map(),
				dependencyFrames: [],
				dependencies: dependencies.forQuery()
			};
		};
		CALLER_INDEPENDENT = Number.POSITIVE_INFINITY;
		EVERY_CALLER = -1;
		callerIndependentBindingValuesByState = new WeakMap();
		primitiveBindingValuesByState = new WeakMap();
		primitiveExpressionValuesByState = new WeakMap();
		capturedBindingValuesByState = new WeakMap();
		clearSemanticValueCaches = (state) => {
			primitiveBindingValuesByState.delete(state);
			capturedBindingValuesByState.delete(state);
			primitiveExpressionValuesByState.delete(state);
			callerIndependentBindingValuesByState.delete(state);
		};
		callerIndependentBindingValuesFor = (state) => {
			const existing = callerIndependentBindingValuesByState.get(state);
			if (existing !== undefined) return existing;
			const values = new Map();
			callerIndependentBindingValuesByState.set(state, values);
			return values;
		};
		primitiveBindingValuesFor = (state) => {
			const existing = primitiveBindingValuesByState.get(state);
			if (existing !== undefined) return existing;
			const values = new Map();
			primitiveBindingValuesByState.set(state, values);
			return values;
		};
		isSemanticResourceLimit = (value) => value.status === "unknown" && value.resourceLimit !== undefined;
		evaluateSemanticBinding = (binding, state) => semanticBindingCanBeRebound(binding) && semanticBindingMayHaveOpaqueEffect(binding, state) ? {
			status: "unknown",
			reason: "Direct eval may have changed this lexical binding."
		} : evaluateBinding(binding, {
			state,
			bindings: new Map(),
			expressionDepth: 0,
			primitiveBindingValues: primitiveBindingValuesFor(state),
			dependence: { lowest: CALLER_INDEPENDENT },
			memo: createEvaluationMemo(state)
		});
		evaluateSemanticExpression = (node, state, capturePoint) => {
			const context = {
				state,
				bindings: new Map(),
				expressionDepth: 0,
				primitiveBindingValues: primitiveBindingValuesFor(state),
				dependence: { lowest: CALLER_INDEPENDENT },
				memo: createEvaluationMemo(state)
			};
			return capturePoint === undefined ? evaluateCapturedExpression(node, context) : evaluateExpression(node, captureContextAt(capturePoint, context) ?? context);
		};
		evaluateSemanticExpressionProvenance = (node, state) => provenanceForExpression(node, {
			state,
			bindings: new Map(),
			expressionDepth: 0,
			primitiveBindingValues: primitiveBindingValuesFor(state),
			dependence: { lowest: CALLER_INDEPENDENT },
			memo: createEvaluationMemo(state)
		});
		evaluateSemanticProvenance = (binding, state) => {
			const provenance = provenanceForBinding(binding, {
				state,
				bindings: new Map(),
				expressionDepth: 0,
				primitiveBindingValues: primitiveBindingValuesFor(state),
				dependence: { lowest: CALLER_INDEPENDENT },
				memo: createEvaluationMemo(state)
			});
			return semanticBindingCanBeRebound(binding) && semanticBindingMayHaveOpaqueEffect(binding, state) ? semanticAmbiguousProvenance(provenance.origins, "Direct eval may have changed this runtime value.") : provenance;
		};
		evaluateSemanticProvenanceAtRead = (binding, read, state) => provenanceForBindingAtRead(binding, read, {
			state,
			bindings: new Map(),
			expressionDepth: 0,
			primitiveBindingValues: primitiveBindingValuesFor(state),
			dependence: { lowest: CALLER_INDEPENDENT },
			memo: createEvaluationMemo(state)
		});
		readMemoizedEvaluation = (entry, context) => {
			if (entry === undefined || context.memo.dependencies.intersects(entry.dependencies, context.bindings)) return undefined;
			retainDependencyProof(entry.dependencies, context);
			return entry.value;
		};
		retainDependencyProof = (proof, context) => {
			const parent = context.memo.dependencyFrames.at(-1);
			if (parent !== undefined) parent.proof = context.memo.dependencies.union(parent.proof, proof);
		};
		recordBindingDependency = (binding, context) => retainDependencyProof(context.memo.dependencies.binding(binding.bindingId), context);
		collectEvaluationDependencies = (binding, context, evaluate) => {
			const frame = { proof: context.memo.dependencies.binding(binding.bindingId) };
			context.memo.dependencyFrames.push(frame);
			try {
				return {
					value: evaluate(),
					dependencies: frame.proof
				};
			} finally {
				context.memo.dependencyFrames.pop();
				retainDependencyProof(frame.proof, context);
			}
		};
		readSnapshotValuesFor = (binding, context) => {
			const initializer = binding.initializers[0];
			if (binding.initializers.length !== 1 || initializer === undefined) return undefined;
			let values;
			if (context.capturePoint === undefined) values = context.memo.snapshotValues ??= new WeakMap();
			else {
				const captures = context.memo.capturedSnapshotValues ??= new WeakMap();
				let captured = captures.get(context.capturePoint);
				if (captured === undefined) {
					captured = new WeakMap();
					captures.set(context.capturePoint, captured);
				}
				values = captured;
			}
			let entries = values.get(initializer);
			if (entries === undefined) {
				entries = new Map();
				values.set(initializer, entries);
			}
			let depths = entries.get(binding.bindingId);
			if (depths === undefined) {
				depths = new Map();
				entries.set(binding.bindingId, depths);
			}
			return depths;
		};
		evaluateBinding = (binding, context, wholeBinding = true) => {
			recordBindingDependency(binding, context);
			const cycleHead = context.bindings.get(binding.bindingId);
			if (cycleHead !== undefined) {
				context.dependence.lowest = Math.min(context.dependence.lowest, cycleHead);
				return {
					status: "cycle",
					reason: `Alias cycle at ${binding.name}.`
				};
			}
			if (wholeBinding && context.capturePoint !== undefined && !semanticBindingPrecedesCapture(binding, context.capturePoint, context.state.parentsByNode)) {
				const { capturePoint: _capturePoint, ...liveContext } = context;
				return evaluateBinding(binding, {
					...liveContext,
					primitiveBindingValues: primitiveBindingValuesFor(context.state)
				});
			}
			const cached = wholeBinding ? context.primitiveBindingValues.get(binding.bindingId) : undefined;
			if (cached !== undefined) return cached;
			const snapshots = wholeBinding ? undefined : readSnapshotValuesFor(binding, context);
			const snapshot = snapshots?.get(context.expressionDepth);
			const snapshotValue = readMemoizedEvaluation(snapshot, context);
			if (snapshotValue !== undefined) {
				if (snapshot?.depthDependent === true) context.dependence.lowest = EVERY_CALLER;
				return snapshotValue;
			}
			const independent = wholeBinding && context.capturePoint === undefined ? callerIndependentBindingValuesFor(context.state) : undefined;
			const retained = independent?.get(binding.bindingId);
			if (retained !== undefined && context.expressionDepth <= retained.expressionDepth) {
				const reusable = readMemoizedEvaluation(retained, context);
				if (reusable !== undefined) return reusable;
			}
			if (binding.referenceInitializers.some(({ assignment }) => assignment) && (binding.initializers.length > 0 || (context.state.bindingsById.get(binding.bindingId)?.initializers.length ?? 0) > 0)) return {
				status: "ambiguous",
				reason: `Binding ${binding.name} has value and projected-reference assignments.`
			};
			if (binding.initializers.length === 0) return {
				status: "unknown",
				reason: wholeBinding ? `Binding ${binding.name} has no constant initializer.` : `Binding ${binding.name} has no proven initializer at this read.`
			};
			if (binding.initializers.some(({ node }) => t.isUpdateExpression(node) || t.isAssignmentExpression(node) && node.operator !== "=" && node.operator !== "&&=" && node.operator !== "||=" && node.operator !== "??=")) return {
				status: "unknown",
				reason: `Binding ${binding.name} has a compound or update write.`
			};
			if (binding.initializers.length > 1) return {
				status: "ambiguous",
				reason: `Binding ${binding.name} has multiple possible assignments.`
			};
			const initializer = binding.initializers[0];
			if (initializer === undefined) return {
				status: "unknown",
				reason: "Missing binding initializer."
			};
			if (context.state.conditionallySkippedExpressions.has(initializer.node)) return {
				status: "unknown",
				reason: `Binding ${binding.name} may remain uninitialized.`
			};
			const position = context.bindings.size;
			const callerDependence = context.dependence.lowest;
			context.dependence.lowest = CALLER_INDEPENDENT;
			context.bindings.set(binding.bindingId, position);
			let value;
			let callerIndependent = false;
			let depthDependent = false;
			let evaluated;
			try {
				evaluated = collectEvaluationDependencies(binding, context, () => {
					const nested = nestedContext(context);
					let value = projectValue(evaluateExpression(initializer.node, nested), initializer.projection);
					if (canCapturePrimitive(value)) {
						const captureContext = primitiveCaptureContext(initializer.node, nested);
						if (captureContext !== undefined) {
							const captured = projectValue(evaluateExpression(initializer.node, captureContext), initializer.projection);
							if (isPrimitive(captured)) value = captured;
						}
					}
					return value;
				});
				value = evaluated.value;
				callerIndependent = context.dependence.lowest > position;
				depthDependent = context.dependence.lowest === EVERY_CALLER;
			} finally {
				context.bindings.delete(binding.bindingId);
				context.dependence.lowest = callerIndependent ? callerDependence : Math.min(callerDependence, context.dependence.lowest);
			}
			let projected = invalidateSemanticMutationPaths(value, binding.memberWrites.filter(({ node }) => context.capturePoint === undefined || node === undefined || !semanticBindingEffectFollowsCapture(binding, context.capturePoint, node, context.state.parentsByNode)).map(({ path }) => path));
			for (const escape of binding.escapedPaths) {
				if (projected.status !== "object" && projected.status !== "array") break;
				if (context.capturePoint !== undefined && semanticEscapeFollowsCapture(binding, context.capturePoint, escape.node, context.state.parentsByNode)) continue;
				projected = invalidateSemanticEscapedPath(projected, escape.path);
			}
			if ((projected.status === "object" || projected.status === "array") && semanticBindingMayHaveOpaqueEffect(binding, context.state, context.capturePoint, "reference")) projected = {
				status: "unknown",
				reason: "Direct eval may have mutated this object reference."
			};
			if (callerIndependent && independent !== undefined && (retained === undefined || retained.expressionDepth < context.expressionDepth)) independent.set(binding.bindingId, {
				value: projected,
				dependencies: evaluated.dependencies,
				expressionDepth: context.expressionDepth
			});
			if (snapshots !== undefined && (callerIndependent || depthDependent) && !context.memo.dependencies.intersects(evaluated.dependencies, context.bindings)) snapshots.set(context.expressionDepth, {
				value: projected,
				dependencies: evaluated.dependencies,
				depthDependent
			});
			if (wholeBinding && (context.capturePoint !== undefined || projected.status === "literal" || projected.status === "union" || isSemanticResourceLimit(projected) && (projected.resourceLimit === "primitive-bytes" || projected.resourceLimit === "primitive-candidates"))) context.primitiveBindingValues.set(binding.bindingId, projected);
			return projected;
		};
		evaluateExpression = (node, context) => {
			const value = evaluateExpressionValue(node, context);
			recordSemanticValueLimit(context.state, value);
			return value;
		};
		evaluateExpressionValue = (node, context) => {
			if (context.expressionDepth > 256) {
				context.dependence.lowest = EVERY_CALLER;
				return semanticResourceLimitUnknown("expression-depth");
			}
			const unwrapped = unwrapJavaScriptExpression(node);
			if (unwrapped.depth > 0) {
				if (context.expressionDepth + unwrapped.depth > 256) {
					context.dependence.lowest = EVERY_CALLER;
					return semanticResourceLimitUnknown("expression-depth");
				}
				return evaluateExpression(unwrapped.node, {
					...context,
					expressionDepth: context.expressionDepth + unwrapped.depth
				});
			}
			const literal = readExactJavaScriptLiteral(node);
			if (literal.found) return semanticPrimitiveSet([literal.value]);
			if (t.isFunctionExpression(node) || t.isFunctionDeclaration(node) || t.isArrowFunctionExpression(node) || t.isClassExpression(node) || t.isClassDeclaration(node)) return definedNonPrimitiveValue(`Unsupported ${node.type} value.`);
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(context.state, node, node.name);
				if (binding === undefined) return {
					status: "unknown",
					reason: `Unbound identifier ${node.name}.`
				};
				const read = semanticBindingAtRead(binding, node, context.state);
				if (read.status === "unresolved" && binding.mutable && binding.definitions.some(({ kind }) => kind === "assignment")) {
					const value = evaluateBinding(binding, nestedContext(context));
					if (value.status === "unknown" || value.status === "ambiguous" || value.status === "cycle") return value;
					return {
						status: "unknown",
						reason: `Binding ${binding.name} has unresolved ordering at this read.`
					};
				}
				const atRead = read.binding;
				if (semanticOpaqueBindingReadMayHaveChanged(binding, context.capturePoint ?? node, context.state)) return {
					status: "unknown",
					reason: "Direct eval may have changed this lexical binding."
				};
				return evaluateBinding(atRead, nestedContext(context), atRead === binding);
			}
			if (t.isTemplateLiteral(node)) return evaluateTemplate(node, context);
			if (t.isConditionalExpression(node) || t.isLogicalExpression(node)) return mergeValues(semanticSelectedBranches(node, context).map((branch) => branch.value ?? evaluateExpression(branch.node, nestedContext(context))));
			if (t.isObjectExpression(node)) return evaluateObject(node, context);
			if (t.isArrayExpression(node)) return evaluateArray(node, context);
			if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) return evaluateMember(node, context);
			if (t.isBinaryExpression(node, { operator: "+" })) return evaluateAddition(node, context);
			if (t.isUnaryExpression(node)) return evaluateUnary(node, context);
			return {
				status: "unknown",
				reason: `Unsupported ${node.type} value.`
			};
		};
		evaluateTemplate = (node, context) => {
			let candidates = [""];
			for (let index = 0; index < node.quasis.length; index += 1) {
				const quasi = node.quasis[index];
				const text = quasi?.value.cooked;
				if (text === undefined || text === null) return {
					status: "unknown",
					reason: "Template text has no cooked representation."
				};
				if (exceedsSemanticTemplateByteBudget(candidates, [text])) return semanticResourceLimitUnknown("primitive-bytes");
				candidates = candidates.map((prefix) => `${prefix}${text}`);
				const expression = node.expressions[index];
				if (expression === undefined) continue;
				const evaluated = evaluateExpression(expression, nestedContext(context));
				const values = semanticPrimitiveCandidates(evaluated);
				if (values === null) {
					if (isSemanticResourceLimit(evaluated)) return evaluated;
					return {
						status: "unknown",
						reason: "Template expression is not a bounded primitive."
					};
				}
				if (candidates.length > 256 / values.length) return semanticResourceLimitUnknown("primitive-candidates");
				const suffixes = values.map((value) => String(value));
				if (exceedsSemanticTemplateByteBudget(candidates, suffixes)) return semanticResourceLimitUnknown("primitive-bytes");
				candidates = candidates.flatMap((prefix) => suffixes.map((suffix) => `${prefix}${suffix}`));
			}
			return semanticPrimitiveSet(candidates);
		};
		semanticSelectedBranches = (node, context) => {
			if (t.isConditionalExpression(node)) {
				const test = evaluateExpression(node.test, nestedContext(context));
				const choice = semanticCondition(test, Boolean);
				return choice === undefined ? [{ node: node.consequent }, { node: node.alternate }] : [{ node: choice ? node.consequent : node.alternate }];
			}
			const value = evaluateExpression(node.left, nestedContext(context));
			const left = {
				node: node.left,
				value
			};
			const choice = logicalRightOperand(node.operator, semanticCondition(value, Boolean), semanticCondition(value, (candidate) => candidate === null, false));
			return choice === undefined ? [left, { node: node.right }] : [choice ? { node: node.right } : left];
		};
		semanticCondition = (value, select, objectResult = true) => {
			if (value.status === "object" || value.status === "array") return objectResult;
			const choices = semanticPrimitiveCandidates(value)?.map(select);
			return choices !== undefined && choices.length > 0 && choices.every((choice) => choice === choices[0]) ? choices[0] : undefined;
		};
		evaluateObject = (node, context) => {
			const propertiesByName = new Map();
			let unknownProperties = false;
			let omittedProperties = 0;
			const invalidateEarlierProperties = () => {
				for (const [name] of propertiesByName) propertiesByName.set(name, {
					name,
					presence: "present",
					value: {
						status: "unknown",
						reason: "A later property may overwrite this value."
					}
				});
			};
			for (const property of node.properties) {
				if (t.isSpreadElement(property)) {
					const copied = evaluateExpression(property.argument, captureContextAt(property.argument, nestedContext(context)) ?? nestedContext(context));
					if (copied.status === "object" || copied.status === "array") {
						const unknown = copied.status === "object" ? copied.unknownProperties : copied.unknownItems;
						if (unknown) {
							unknownProperties = true;
							omittedProperties = null;
							invalidateEarlierProperties();
						}
						for (const field of semanticContainer(copied).slots) {
							if (field.presence === "absent") continue;
							propertiesByName.set(field.name, {
								...field,
								value: isPrimitive(field.value) ? field.value : {
									status: "unknown",
									reason: "Copied reference fields retain live identity rather than a scalar snapshot."
								}
							});
						}
					} else if (copied.status !== "literal" || typeof copied.value === "string") {
						unknownProperties = true;
						omittedProperties = null;
						invalidateEarlierProperties();
					}
					continue;
				}
				if (property.computed && semanticKnownSymbolKey(property.key, context.state)) {
					unknownProperties = true;
					if (omittedProperties !== null) omittedProperties += 1;
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === null) {
					unknownProperties = true;
					if (omittedProperties !== null) omittedProperties += 1;
					invalidateEarlierProperties();
					continue;
				}
				if (t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__") {
					unknownProperties = true;
					if (omittedProperties !== null) omittedProperties += 1;
					continue;
				}
				propertiesByName.set(name, {
					name,
					presence: "present",
					value: t.isObjectProperty(property) ? evaluateCapturedExpression(property.value, nestedContext(context)) : property.kind === "method" ? definedNonPrimitiveValue("Object method or accessor value is not a primitive.") : {
						status: "unknown",
						reason: "Object method or accessor value is not a primitive."
					}
				});
			}
			const properties = [...propertiesByName.values()].sort((left, right) => compareUnicodeCodePoints(left.name, right.name));
			return unknownProperties ? {
				status: "object",
				properties,
				unknownProperties: true,
				omittedProperties
			} : {
				status: "object",
				properties,
				unknownProperties: false,
				omittedProperties: 0
			};
		};
		evaluateArray = (node, context) => {
			const items = [];
			let unknownItems = false;
			let omittedItems = 0;
			for (const element of node.elements) {
				if (t.isSpreadElement(element)) {
					unknownItems = true;
					omittedItems = null;
					break;
				}
				if (element === null) {
					items.push({
						name: String(items.length),
						presence: "absent",
						value: {
							status: "unknown",
							reason: "Array hole has no own value."
						}
					});
					continue;
				}
				items.push({
					name: String(items.length),
					presence: "present",
					value: evaluateCapturedExpression(element, nestedContext(context))
				});
			}
			return unknownItems ? {
				status: "array",
				items,
				unknownItems: true,
				omittedItems
			} : {
				status: "array",
				items,
				unknownItems: false,
				omittedItems: 0
			};
		};
		evaluateMember = (node, context) => {
			const keys = [];
			let current = node;
			let value;
			while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
				if (!t.isNode(current.object)) {
					value = {
						status: "unknown",
						reason: "Unsupported member base."
					};
					break;
				}
				const key = semanticStaticPropertyKey(current.property, current.computed);
				if (key === null) {
					value = {
						status: "unknown",
						reason: "Dynamic member key."
					};
					break;
				}
				keys.push(key);
				current = current.object;
			}
			value ??= evaluateExpression(current, nestedContext(context));
			for (const key of keys.reverse()) value = projectValue(value, [key]);
			return value;
		};
		evaluateAddition = (node, context) => {
			const pending = [];
			let current = node;
			while (true) {
				if (t.isBinaryExpression(current, { operator: "+" })) {
					pending.push({
						node: current,
						left: undefined
					});
					current = current.left;
					continue;
				}
				let value = evaluateExpression(current, nestedContext(context));
				while (true) {
					const parent = pending.at(-1);
					if (parent === undefined) return value;
					if (parent.left === undefined) {
						parent.left = value;
						current = parent.node.right;
						break;
					}
					value = addPrimitiveValues(parent.left, value);
					pending.pop();
				}
			}
		};
		addPrimitiveValues = (leftValue, rightValue) => {
			const left = semanticPrimitiveCandidates(leftValue);
			const right = semanticPrimitiveCandidates(rightValue);
			if (left === null || right === null) {
				if (isSemanticResourceLimit(leftValue)) return leftValue;
				if (isSemanticResourceLimit(rightValue)) return rightValue;
				return {
					status: "unknown",
					reason: "Non-primitive addition."
				};
			}
			if (left.length > 256 / right.length) return semanticResourceLimitUnknown("primitive-candidates");
			if (exceedsSemanticPrimitiveAdditionByteBudget(left, right)) return semanticResourceLimitUnknown("primitive-bytes");
			const values = left.flatMap((leftValue) => right.map((rightValue) => typeof leftValue === "string" || typeof rightValue === "string" ? `${String(leftValue)}${String(rightValue)}` : Number(leftValue) + Number(rightValue)));
			return semanticPrimitiveSet(values);
		};
		evaluateUnary = (node, context) => {
			const evaluated = evaluateExpression(node.argument, nestedContext(context));
			const argument = semanticPrimitiveCandidates(evaluated);
			if (argument === null) {
				if (isSemanticResourceLimit(evaluated)) return evaluated;
				return {
					status: "unknown",
					reason: "Non-primitive unary operand."
				};
			}
			if (node.operator === "!") return semanticPrimitiveSet(argument.map((value) => !value));
			if (node.operator === "+") return semanticPrimitiveSet(argument.map((value) => Number(value)));
			if (node.operator === "-") return semanticPrimitiveSet(argument.map((value) => -Number(value)));
			return {
				status: "unknown",
				reason: `Unsupported unary ${node.operator}.`
			};
		};
		projectValue = (value, projection) => {
			if (isSemanticResourceLimit(value)) return value;
			if (projection.includes(null)) return {
				status: "unknown",
				reason: "Cannot project a dynamic property."
			};
			const path = projection.map((key) => String(key));
			const slot = semanticSlotAtPath(value, path);
			return slot.presence === "present" || isSemanticResourceLimit(slot.value) ? slot.value : {
				status: "unknown",
				reason: `Own property ${path.join("/")} is ${slot.presence}.`
			};
		};
		provenanceForBinding = (binding, context) => {
			recordBindingDependency(binding, context);
			const cycleHead = context.bindings.get(binding.bindingId);
			if (cycleHead !== undefined) {
				context.dependence.lowest = Math.min(context.dependence.lowest, cycleHead);
				return semanticUnresolvedProvenance("cycle", `Alias cycle at ${binding.name}.`);
			}
			let depths = context.memo.provenance.get(binding.bindingId);
			const prior = readMemoizedEvaluation(depths?.get(context.expressionDepth), context);
			if (prior !== undefined) return prior;
			const position = context.bindings.size;
			const callerDependence = context.dependence.lowest;
			context.dependence.lowest = CALLER_INDEPENDENT;
			let result;
			let callerIndependent = false;
			try {
				result = collectEvaluationDependencies(binding, context, () => provenanceForBindingUncached(binding, context));
				callerIndependent = context.dependence.lowest > position;
			} finally {
				context.dependence.lowest = callerIndependent ? callerDependence : Math.min(callerDependence, context.dependence.lowest);
			}
			if (callerIndependent) {
				if (depths === undefined) {
					depths = new Map();
					context.memo.provenance.set(binding.bindingId, depths);
				}
				depths.set(context.expressionDepth, result);
			}
			return result.value;
		};
		provenanceForBindingUncached = (binding, context) => {
			const provenance = provenanceForBindingValue(binding, context);
			const assigned = binding.definitions.some(({ kind }) => kind === "assignment");
			const conditionallyInitialized = binding.initializers.some(({ node }) => context.state.conditionallySkippedExpressions.has(node));
			if (provenance.status !== "module" || !assigned && !conditionallyInitialized) return provenance;
			return semanticAmbiguousProvenance(provenance.origins, assigned ? `Binding ${binding.name} may be reassigned.` : `Binding ${binding.name} may remain uninitialized.`);
		};
		provenanceForBindingValue = (binding, context) => {
			const provenance = provenanceForBindingInitializers(binding, context);
			if (!binding.referenceInitializers.some(({ assignment }) => assignment)) return provenance;
			if (provenance.status === "local") return semanticUnresolvedProvenance("unknown", `Binding ${binding.name} has projected reference assignments whose module provenance is unresolved.`);
			return provenance.status === "module" ? semanticAmbiguousProvenance(provenance.origins, `Binding ${binding.name} has projected reference assignments that may replace its module origin.`) : provenance;
		};
		provenanceForBindingInitializers = (binding, context) => {
			if (binding.kind === "parameter" || binding.kind === "catch") return semanticUnresolvedProvenance("unknown", binding.kind === "parameter" ? "Parameter provenance depends on caller arguments." : "Catch binding provenance depends on the thrown value.");
			if (binding.directOrigins.length > 0) return semanticOriginsProvenance(binding.directOrigins);
			if (binding.initializers.length === 0) return semanticLocalProvenance();
			if (binding.initializers.length > 1) return semanticAmbiguousProvenance([], `Binding ${binding.name} has multiple possible assignments.`);
			const initializer = binding.initializers[0];
			if (initializer === undefined) return semanticUnresolvedProvenance("unknown", "Missing binding initializer.");
			if (initializer.projection.includes(null)) return semanticUnresolvedProvenance("unknown", "Dynamic provenance projection.");
			context.bindings.set(binding.bindingId, context.bindings.size);
			let resolved;
			try {
				resolved = provenanceForExpression(initializer.node, nestedContext(context));
			} finally {
				context.bindings.delete(binding.bindingId);
			}
			if (resolved.status !== "module" || initializer.projection.length === 0) return resolved;
			return semanticOriginsProvenance(resolved.origins.map((origin) => ({
				...origin,
				importedPath: [...origin.importedPath, ...initializer.projection.map((segment) => String(segment))]
			})));
		};
		provenanceForExpression = (node, context) => {
			if (context.expressionDepth > 256) {
				context.dependence.lowest = EVERY_CALLER;
				context.state.valueResourceLimits.add("expression-depth");
				return semanticUnresolvedProvenance("unknown", semanticResourceLimitReason("expression-depth"));
			}
			const unwrapped = unwrapJavaScriptExpression(node);
			if (unwrapped.depth > 0) {
				if (context.expressionDepth + unwrapped.depth > 256) {
					context.dependence.lowest = EVERY_CALLER;
					context.state.valueResourceLimits.add("expression-depth");
					return semanticUnresolvedProvenance("unknown", semanticResourceLimitReason("expression-depth"));
				}
				return provenanceForExpression(unwrapped.node, {
					...context,
					expressionDepth: context.expressionDepth + unwrapped.depth
				});
			}
			const required = readSemanticRequireOrigin(node, context.state);
			if (required !== undefined) return semanticOriginsProvenance([required.origin]);
			if (t.isSequenceExpression(node)) {
				const finalExpression = node.expressions.at(-1);
				return finalExpression === undefined ? semanticUnresolvedProvenance("unknown", "Empty sequence expression.") : provenanceForExpression(finalExpression, nestedContext(context));
			}
			if (t.isAssignmentExpression(node) && node.operator === "=") return provenanceForExpression(node.right, nestedContext(context));
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(context.state, node, node.name);
				return binding === undefined ? semanticUnresolvedProvenance("unknown", `Unbound identifier ${node.name}.`) : provenanceForBindingAtRead(binding, node, nestedContext(context));
			}
			if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
				const members = [];
				let current = node;
				while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
					if (!t.isNode(current.object)) return semanticUnresolvedProvenance("unknown", "Unsupported member base.");
					const member = semanticStaticPropertyKey(current.property, current.computed);
					if (member === null) return semanticUnresolvedProvenance("unknown", "Dynamic provenance member.");
					members.push(member);
					current = current.object;
				}
				const base = provenanceForExpression(current, nestedContext(context));
				const path = members.reverse();
				return base.status !== "module" ? base : semanticOriginsProvenance(base.origins.map((origin) => ({
					...origin,
					importedPath: [...origin.importedPath, ...path]
				})));
			}
			if (t.isConditionalExpression(node) || t.isLogicalExpression(node)) {
				const candidates = semanticSelectedBranches(node, context).map((branch) => provenanceForExpression(branch.node, nestedContext(context)));
				const origins = uniqueSemanticOrigins(candidates.flatMap((candidate) => candidate.origins));
				const allModuleOrigins = candidates.every(({ status }) => status === "module");
				if (allModuleOrigins && origins.length === 1) return semanticOriginsProvenance(origins);
				return origins.length > 0 ? semanticAmbiguousProvenance(origins, allModuleOrigins ? "Multiple module origins." : "Conditional provenance includes a non-module alternative.") : semanticUnresolvedProvenance("unknown", "Conditional provenance is unresolved.");
			}
			if (isLocallyCreatedValue(node)) return semanticLocalProvenance();
			return semanticUnresolvedProvenance("unknown", `Unsupported ${node.type} provenance.`);
		};
		provenanceForBindingAtRead = (binding, read, context) => {
			if (semanticOpaqueBindingReadMayHaveChanged(binding, read, context.state)) return semanticAmbiguousProvenance(provenanceForBinding(binding, context).origins, "Direct eval may have changed this runtime value.");
			const { binding: snapshot } = semanticBindingAtRead(binding, read, context.state);
			if (snapshot === binding) return provenanceForBinding(binding, context);
			if (context.bindings.has(binding.bindingId)) return semanticUnresolvedProvenance("cycle", `Alias cycle at ${binding.name}.`);
			context.bindings.set(binding.bindingId, context.bindings.size);
			try {
				return provenanceForBindingValue(snapshot, context);
			} finally {
				context.bindings.delete(binding.bindingId);
			}
		};
		isLocallyCreatedValue = (node) => readExactJavaScriptLiteral(node).found || t.isObjectExpression(node) || t.isArrayExpression(node) || t.isFunctionExpression(node) || t.isFunctionDeclaration(node) || t.isArrowFunctionExpression(node) || t.isClassExpression(node) || t.isClassDeclaration(node) || t.isTemplateLiteral(node) || t.isUnaryExpression(node) || t.isBinaryExpression(node) || t.isUpdateExpression(node);
		mergeValues = (values) => {
			const resourceLimit = values.find(isSemanticResourceLimit);
			if (resourceLimit !== undefined) return resourceLimit;
			const primitives = values.flatMap((value) => semanticPrimitiveCandidates(value) ?? []);
			const merged = values.every((value) => value.status === "union" || value.status === "literal") ? semanticPrimitiveSet(primitives) : {
				status: "ambiguous",
				reason: "Branches have incompatible values."
			};
			if (values.length > 0 && values.every(semanticValueDefinitelyDefined)) definitelyDefinedValues.add(merged);
			return merged;
		};
		nestedContext = (context) => ({
			state: context.state,
			primitiveBindingValues: context.primitiveBindingValues,
			...context.capturePoint === undefined ? {} : { capturePoint: context.capturePoint },
			expressionDepth: context.expressionDepth + 1,
			bindings: context.bindings,
			dependence: context.dependence,
			memo: context.memo
		});
		isPrimitive = (value) => value.status === "literal" || value.status === "union";
		canCapturePrimitive = (value) => !isPrimitive(value) && !(isSemanticResourceLimit(value) && value.resourceLimit === "expression-depth");
		primitiveCaptureContext = (node, context) => {
			if (t.isObjectExpression(node) || t.isArrayExpression(node)) return undefined;
			return captureContextAt(node, context);
		};
		captureContextAt = (node, context) => {
			if (context.capturePoint !== undefined || semanticCapturePosition(node, context.state.parentsByNode) === null) return undefined;
			let captures = capturedBindingValuesByState.get(context.state);
			if (captures === undefined) {
				captures = new WeakMap();
				capturedBindingValuesByState.set(context.state, captures);
			}
			let values = captures.get(node);
			if (values === undefined) {
				values = new Map();
				captures.set(node, values);
			}
			return {
				...context,
				capturePoint: node,
				primitiveBindingValues: values
			};
		};
		evaluateCapturedExpression = (node, context) => {
			let values = primitiveExpressionValuesByState.get(context.state);
			const cached = values?.get(node);
			if (cached !== undefined) return cached;
			let value = evaluateExpression(node, context);
			if (canCapturePrimitive(value)) {
				const captureContext = primitiveCaptureContext(node, context);
				if (captureContext !== undefined) {
					const captured = evaluateExpression(node, captureContext);
					if (isPrimitive(captured)) value = captured;
				}
			}
			if (context.capturePoint === undefined && isPrimitive(value)) {
				if (values === undefined) {
					values = new WeakMap();
					primitiveExpressionValuesByState.set(context.state, values);
				}
				values.set(node, value);
			}
			return value;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticReferenceSources.js
var semanticCommonJsRequireOwnEnumerableAt, semanticKnownArrayIteration, semanticKnownArrayIterationAt, semanticReferenceIterationUnknown, selectedReferenceIterationKnown, semanticReferenceSourcesInactive, semanticSelectedReferenceSlot;
function init_javascriptSemanticReferenceSources() {
	return (init_javascriptSemanticReferenceSources = __esmMin((() => {
		init_javascriptSemanticPropertyPaths();
		init_javascriptSemanticValues();
		init_javascriptSemanticSlots();
		init_javascriptSemanticMutationInitializers();
		semanticCommonJsRequireOwnEnumerableAt = (capture, state) => {
			const selected = ["commonjs-module", "require"];
			const mayAffect = (effect) => effect.path.length <= selected.length && effect.path.every((key, index) => semanticPropertyPathKeyMatches(key, selected[index] ?? "")) && semanticEffectTiming(capture, effect.node, state) !== "after";
			return state.ambientWriteEffects.some(mayAffect) || state.ambientEscapeEffects.some(mayAffect);
		};
		semanticKnownArrayIteration = (value, state) => !state.arrayIterationUnknown && value?.status === "array" && value.items.every((item) => semanticArrayIndex(item.name) !== null);
		semanticKnownArrayIterationAt = (node, state) => semanticKnownArrayIteration(evaluateSemanticExpression(node, state, node), state);
		semanticReferenceIterationUnknown = (source, state) => source.iterationSources?.some((iterable) => !selectedReferenceIterationKnown(iterable, state)) === true;
		selectedReferenceIterationKnown = (source, state) => {
			let values = [evaluateSemanticExpression(source.node, state, source.node)];
			for (const key of source.projection) {
				if (typeof key === "object" && key !== null) return false;
				const selected = new Set();
				for (const value of values) {
					if (key === null) {
						if (!semanticKnownArrayIteration(value, state) || value.status !== "array" || value.unknownItems) return false;
						for (const slot of value.items) {
							if (slot.presence !== "present") return false;
							selected.add(slot.value);
						}
					} else {
						const slot = semanticSlotAtPath(value, [String(key)]);
						if (slot.presence !== "present") return false;
						selected.add(slot.value);
					}
				}
				values = [...selected];
			}
			return values.every((value) => semanticKnownArrayIteration(value, state));
		};
		semanticReferenceSourcesInactive = (reference, state) => reference.requiredSources?.some((source) => !semanticReferenceIterationUnknown(source, state) && semanticSelectedReferenceSlot(source, state, source.node)?.presence === "absent") === true || reference.fallbackSources?.some((source) => {
			const slot = semanticSelectedReferenceSlot(source, state, source.node);
			return !semanticReferenceIterationUnknown(source, state) && slot?.presence === "present" && semanticValueDefinitelyDefined(slot.value);
		}) === true;
		semanticSelectedReferenceSlot = (source, state, capturePoint) => {
			const path = [];
			for (const key of source.projection) {
				if (key === null || typeof key === "object") return undefined;
				path.push(String(key));
			}
			return semanticSlotAtPath(evaluateSemanticExpression(source.node, state, capturePoint), path);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptModuleInterop.js
var TO_ESM, COPY_PROPS, INTRINSICS, createSemanticModuleInterop, identityFunction, unprojectedInitializer, canonicalRoles, controlBodyOperation;
function init_javascriptModuleInterop() {
	return (init_javascriptModuleInterop = __esmMin((() => {
		init_javascriptSemanticState();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticRequireOriginSlot();
		init_javascriptSemanticTraversal();
		init_javascriptElectronMemberWrites();
		init_javascriptIntrinsicInvocation();
		init_javascriptSemanticPropertyPaths();
		init_javascriptAstValues();
		init_javascriptSemanticReferenceSources();
		init_javascriptSemanticOpaqueEffects();
		TO_ESM = parseExpression(`(mod, isNodeMode, target) => (
  target = mod != null ? __create(__getProtoOf(mod)) : {},
  __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default")
    ? __defProp(target, "default", {value: mod, enumerable: true}) : target, mod)
)`);
		COPY_PROPS = parseExpression(`(to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function")
    for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
      key = keys[i];
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: ((k) => from[k]).bind(null, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
  return to;
}`);
		INTRINSICS = {
			__create: ["Object", "create"],
			__getProtoOf: ["Object", "getPrototypeOf"],
			__defProp: ["Object", "defineProperty"],
			__getOwnPropNames: ["Object", "getOwnPropertyNames"],
			__getOwnPropDesc: ["Object", "getOwnPropertyDescriptor"],
			__hasOwnProp: [
				"Object",
				"prototype",
				"hasOwnProperty"
			]
		};
		createSemanticModuleInterop = (state, options) => {
			const nativeArrayIteration = (array) => semanticKnownArrayIterationAt(array, state);
			const helpers = new Map();
			const origins = new Map();
			const aliasTargets = new Map();
			const aliasChangedCache = new Map();
			const calls = new WeakMap();
			const intrinsicBindings = new Map();
			const writes = [];
			const invalidatedBindings = new Map();
			const invalidatedCalls = new WeakMap();
			const opaqueMutationPath = (node) => {
				let current = node;
				while (current !== undefined) {
					if (t.isFunction(current)) return ["opaque-intrinsic", semanticScopeId("function", current)];
					current = state.parentsByNode.get(current);
				}
				return ["intrinsic"];
			};
			const intrinsicPath = options?.intrinsicPath ?? ((node) => {
				let current = node;
				const visited = new Set();
				const pending = [];
				let suffix = [];
				const finish = (path) => {
					for (const binding of pending) intrinsicBindings.set(binding.id, path === undefined ? null : path.slice(0, path.length - binding.suffixLength));
					return path;
				};
				for (;;) {
					const { root, members } = electronMemberPath(current);
					if (members.some((member) => member === null)) return finish(undefined);
					suffix = [...members, ...suffix];
					for (const global of [
						"Object",
						"Function",
						"Reflect"
					]) if (isUnshadowedGlobal(root, state, global)) return finish([
						"intrinsic",
						global,
						...suffix
					]);
					for (const global of [
						"globalThis",
						"global",
						"window",
						"self"
					]) if (isUnshadowedGlobal(root, state, global)) return finish(["intrinsic", ...suffix]);
					if (!t.isIdentifier(root)) return finish(undefined);
					const binding = resolveSemanticBindingState(state, root, root.name);
					const cached = binding === undefined ? undefined : intrinsicBindings.get(binding.bindingId);
					if (cached !== undefined) return finish(cached === null ? undefined : [...cached, ...suffix]);
					const initializer = semanticStableInitializer(binding, state);
					if (binding === undefined || initializer === undefined || initializer.projection.some((segment) => segment === null) || visited.has(binding.bindingId)) return finish(undefined);
					visited.add(binding.bindingId);
					pending.push({
						id: binding.bindingId,
						suffixLength: suffix.length
					});
					suffix = [...initializer.projection.map(String), ...suffix];
					current = initializer.node;
				}
			});
			const capturedIntrinsic = (node) => {
				const path = intrinsicPath(node);
				if (path === undefined) return undefined;
				const visited = new Set();
				let current = node;
				let capturedAt = node;
				let suffixLength = 0;
				for (;;) {
					const { root, members } = electronMemberPath(current);
					suffixLength += members.length;
					if (!t.isIdentifier(root)) return undefined;
					const binding = resolveSemanticBindingState(state, root, root.name);
					if (binding === undefined) return {
						path,
						capturedAt
					};
					const initializer = semanticStableInitializer(binding, state);
					if (initializer === undefined || (initializer.node.end ?? Infinity) >= (root.start ?? -1) || visited.has(binding.bindingId)) return undefined;
					visited.add(binding.bindingId);
					if (suffixLength === 0) capturedAt = initializer.node;
					suffixLength += initializer.projection.length;
					current = initializer.node;
				}
			};
			const staticString = (node) => {
				if (node === undefined) return undefined;
				const visited = new Set();
				let current = node;
				for (;;) {
					const literal = readExactJavaScriptLiteral(current);
					if (literal.found) return typeof literal.value === "string" ? literal.value : undefined;
					const expression = unwrapJavaScriptExpression(current).node;
					if (!t.isIdentifier(expression)) return undefined;
					const binding = resolveSemanticBindingState(state, expression, expression.name);
					const initializer = semanticStableInitializer(binding, state);
					if (binding === undefined || initializer === undefined || initializer.projection.length !== 0 || (initializer.node.end ?? Infinity) >= (expression.start ?? -1) || visited.has(binding.bindingId)) return undefined;
					visited.add(binding.bindingId);
					current = initializer.node;
				}
			};
			const intrinsicReadChanged = (node, path) => {
				const capture = capturedIntrinsic(node)?.capturedAt ?? node;
				const scope = opaqueMutationPath(capture).join(".");
				const method = path.at(-1);
				const invocationMethod = method === "bind" || method === "call" || method === "apply";
				return writes.some((write) => (write.scope === scope || write.scope === "intrinsic") && write.offset < (capture.start ?? -1) && (write.coverage.covers(path) || invocationMethod && write.coverage.covers([
					"intrinsic",
					"Function",
					"prototype",
					method
				])));
			};
			const resolveBoundIntrinsic = (node) => {
				const visited = new Set();
				const argumentGroups = [];
				const bindReads = [];
				let opaqueArguments = false;
				let receiver;
				let current = node;
				for (;;) {
					current = unwrapJavaScriptExpression(current).node;
					if (t.isIdentifier(current)) {
						const binding = resolveSemanticBindingState(state, current, current.name);
						const initializer = semanticStableInitializer(binding, state);
						if (binding === undefined || initializer === undefined || initializer.projection.length !== 0 || (initializer.node.end ?? Infinity) >= (current.start ?? -1) || visited.has(binding.bindingId)) return undefined;
						visited.add(binding.bindingId);
						current = initializer.node;
						continue;
					}
					if (!t.isCallExpression(current)) return undefined;
					const { root, members } = electronMemberPath(current.callee);
					let bindTarget = root;
					let bindingArguments = expandJavaScriptInvocationArguments(current.arguments, nativeArrayIteration);
					let captured = capturedIntrinsic(current.callee);
					let terminal = captured?.path.at(-1) === "bind";
					let path = captured?.path.slice(0, -1);
					if (members.at(-1) === "bind") {
						if (!terminal && members.length !== 1) return undefined;
						bindReads.push(captured?.capturedAt ?? current.callee);
					} else {
						const invocation = resolveJavaScriptIntrinsicInvocation(current, intrinsicPath, boundIntrinsic, intrinsicReadChanged, nativeArrayIteration);
						if (invocation?.kind !== "known" || invocation.path.join(".") !== "intrinsic.Function.prototype.bind" || invocation.receiver === undefined) return undefined;
						bindTarget = invocation.receiver;
						bindingArguments = invocation.arguments;
						captured = capturedIntrinsic(bindTarget);
						terminal = captured !== undefined;
						path = captured?.path;
					}
					receiver = bindingArguments?.[0];
					const ownArguments = bindingArguments?.slice(1) ?? [];
					opaqueArguments ||= bindingArguments === undefined || t.isSpreadElement(receiver);
					opaqueArguments ||= ownArguments.some((argument) => t.isSpreadElement(argument));
					argumentGroups.push(ownArguments);
					if (!terminal || path === undefined) {
						current = bindTarget;
						continue;
					}
					const boundPath = [...path, "bind"];
					const functionBind = [
						"intrinsic",
						"Function",
						"prototype",
						"bind"
					];
					opaqueArguments ||= bindReads.some((capture) => {
						const scope = opaqueMutationPath(capture).join(".");
						return writes.some((write) => (write.scope === scope || write.scope === "intrinsic") && write.offset < (capture.start ?? -1) && (write.coverage.covers(boundPath) || write.coverage.covers(functionBind)));
					});
					return {
						kind: opaqueArguments ? "opaque" : "known",
						path,
						...receiver === undefined ? {} : { receiver },
						arguments: opaqueArguments ? undefined : argumentGroups.toReversed().flat()
					};
				}
			};
			const activeBoundValues = new WeakSet();
			const boundIntrinsic = (node) => {
				if (activeBoundValues.has(node)) return undefined;
				activeBoundValues.add(node);
				try {
					return resolveBoundIntrinsic(node);
				} finally {
					activeBoundValues.delete(node);
				}
			};
			const isFreshObject = (node) => {
				const visited = new Set();
				let current = node;
				for (;;) {
					current = unwrapJavaScriptExpression(current).node;
					if (t.isObjectExpression(current) || t.isArrayExpression(current) || t.isFunction(current) || t.isClass(current) && !current.decorators?.length || t.isRegExpLiteral(current)) return true;
					if (!t.isIdentifier(current)) return false;
					const binding = resolveSemanticBindingState(state, current, current.name);
					const initializer = unprojectedInitializer(binding, state);
					if (binding === undefined || initializer === undefined || !t.isFunctionDeclaration(initializer) && (initializer.end ?? Infinity) >= (current.start ?? -1) || visited.has(binding.bindingId)) return false;
					visited.add(binding.bindingId);
					current = initializer;
				}
			};
			const helperProof = (binding) => {
				const cached = helpers.get(binding.bindingId);
				if (cached !== undefined) return cached ?? undefined;
				helpers.set(binding.bindingId, null);
				if (state.scopesById.get(binding.scopeId)?.kind !== "program") return undefined;
				const wrapper = unprojectedInitializer(binding, state);
				if (wrapper === undefined) return undefined;
				if (identityFunction(wrapper, state)) {
					const proof = {
						dependencies: [],
						readyAfter: t.isFunctionDeclaration(wrapper) ? -1 : wrapper.end ?? Infinity,
						identity: true
					};
					helpers.set(binding.bindingId, proof);
					return proof;
				}
				const wrapperRoles = canonicalRoles(wrapper, TO_ESM, state);
				const copyBinding = wrapperRoles?.get("__copyProps");
				const copy = unprojectedInitializer(copyBinding, state);
				const copyRoles = copy === undefined ? undefined : canonicalRoles(copy, COPY_PROPS, state);
				if (wrapperRoles === undefined || copyRoles === undefined || copy === undefined) return undefined;
				const dependencies = [];
				let readyAfter = Math.max(wrapper.end ?? Infinity, copy.end ?? Infinity);
				for (const roles of [wrapperRoles, copyRoles]) for (const [role, dependency] of roles) {
					const expected = INTRINSICS[role];
					if (expected === undefined) continue;
					const initializer = unprojectedInitializer(dependency, state);
					const captured = initializer === undefined ? undefined : capturedIntrinsic(initializer);
					if (initializer === undefined || captured === undefined || JSON.stringify(captured.path) !== JSON.stringify(["intrinsic", ...expected])) return undefined;
					readyAfter = Math.max(readyAfter, initializer.end ?? Infinity);
					dependencies.push(captured);
					if (role === "__hasOwnProp") dependencies.push({ path: [...captured.path, "call"] });
				}
				dependencies.push({ path: [
					"intrinsic",
					"Function",
					"prototype",
					"bind"
				] }, { path: [
					"intrinsic",
					"Function",
					"prototype",
					"call"
				] });
				const proof = {
					dependencies,
					identity: false,
					readyAfter
				};
				helpers.set(binding.bindingId, proof);
				return proof;
			};
			const provenCall = (node) => {
				if (!t.isCallExpression(node) || !t.isIdentifier(node.callee)) return undefined;
				const helper = resolveSemanticBindingState(state, node.callee, node.callee.name);
				const proof = helper === undefined ? undefined : helperProof(helper);
				const input = node.arguments[0];
				const mode = node.arguments[1];
				const literalMode = mode === undefined ? {
					found: true,
					value: false
				} : t.isExpression(mode) ? readExactJavaScriptLiteral(mode) : { found: false };
				if (proof === undefined || proof.readyAfter >= (node.start ?? -1) || !t.isExpression(input) || node.arguments.length > 2 || !literalMode.found) return undefined;
				return {
					input,
					defaultIsModule: !proof.identity && Boolean(literalMode.value),
					dependencies: proof.dependencies.map((dependency) => ({
						...dependency,
						capturedAt: dependency.capturedAt ?? node
					}))
				};
			};
			const callOrigin = (node) => {
				const cached = calls.get(node);
				if (cached !== undefined) return cached;
				const { root, members } = electronMemberPath(node);
				if (!members.every((member) => member !== null)) return undefined;
				const converted = provenCall(root);
				const required = converted === undefined ? undefined : readSemanticRequireOrigin(converted.input, state)?.origin;
				if (converted === undefined || required === undefined || required.importedPath.length !== 0 || members[0] === "default" && !converted.defaultIsModule) return undefined;
				const result = {
					origin: {
						...required,
						importedPath: members
					},
					dependencies: converted.dependencies,
					defaultIsModule: converted.defaultIsModule
				};
				calls.set(node, result);
				return result;
			};
			const twoInitializerOrigin = (binding) => {
				const [initial, converted] = binding.initializers;
				if (binding.definitions.length !== 2 || binding.definitions[0]?.kind !== "variable" || binding.definitions[1]?.kind !== "assignment" || binding.initializers.length !== 2 || initial === undefined || converted === undefined || initial.projection.length !== 0 || converted.projection.length !== 0 || state.conditionallySkippedExpressions.has(initial.node)) return undefined;
				const call = converted.node;
				const assignment = state.parentsByNode.get(call);
				const statement = assignment === undefined ? undefined : state.parentsByNode.get(assignment);
				const declaration = state.parentsByNode.get(initial.node);
				const declarationStatement = declaration === undefined ? undefined : state.parentsByNode.get(declaration);
				if (!t.isCallExpression(call) || !t.isIdentifier(call.callee) || !t.isAssignmentExpression(assignment, { operator: "=" }) || assignment.right !== call || !t.isIdentifier(assignment.left, { name: binding.name }) || !t.isExpressionStatement(statement) || !t.isVariableDeclarator(declaration) || !t.isVariableDeclaration(declarationStatement) || state.parentsByNode.get(statement) !== state.parentsByNode.get(declarationStatement) || (initial.node.start ?? Infinity) >= (call.start ?? -1)) return undefined;
				const convertedCall = provenCall(call);
				const input = convertedCall?.input;
				if (!t.isIdentifier(input) || resolveSemanticBindingState(state, input, input.name) !== binding) return undefined;
				const required = readSemanticRequireOrigin(initial.node, state)?.origin;
				if (required === undefined || required.importedPath.length !== 0) return undefined;
				if (convertedCall === undefined) return undefined;
				return {
					origin: required,
					dependencies: convertedCall.dependencies,
					defaultIsModule: convertedCall.defaultIsModule
				};
			};
			const origin = (binding) => {
				const cached = origins.get(binding.bindingId);
				if (cached !== undefined) return cached;
				let currentBinding = binding;
				const visited = new Set();
				const steps = [];
				let baseOrigin;
				while (currentBinding !== undefined) {
					const alreadyCached = origins.get(currentBinding.bindingId);
					if (alreadyCached !== undefined) {
						baseOrigin = alreadyCached;
						break;
					}
					if (visited.has(currentBinding.bindingId)) return undefined;
					visited.add(currentBinding.bindingId);
					const single = semanticStableInitializer(currentBinding, state);
					if (single !== undefined) {
						if (!single.projection.every((key) => typeof key === "string")) return undefined;
						const converted = callOrigin(single.node);
						if (converted !== undefined) {
							if (converted.origin.importedPath.length === 0 && single.projection[0] === "default" && !converted.defaultIsModule) return undefined;
							baseOrigin = {
								...converted,
								origin: {
									...converted.origin,
									importedPath: [...converted.origin.importedPath, ...single.projection]
								}
							};
							break;
						}
						const { root, members } = electronMemberPath(single.node);
						if (!t.isIdentifier(root) || !members.every((member) => member !== null)) return undefined;
						const targetBinding = resolveSemanticBindingState(state, root, root.name);
						if (targetBinding === undefined || targetBinding === currentBinding) return undefined;
						aliasTargets.set(currentBinding.bindingId, {
							targetBinding,
							node: root
						});
						steps.push({
							binding: currentBinding,
							segments: [...members, ...single.projection]
						});
						currentBinding = targetBinding;
						continue;
					}
					const twoInit = twoInitializerOrigin(currentBinding);
					if (twoInit !== undefined) {
						baseOrigin = twoInit;
						break;
					}
					return undefined;
				}
				if (baseOrigin === undefined) return undefined;
				origins.set(currentBinding.bindingId, baseOrigin);
				let currentOrigin = baseOrigin;
				for (let i = steps.length - 1; i >= 0; i--) {
					const step = steps[i];
					const firstSegment = step.segments[0];
					if (currentOrigin.origin.importedPath.length === 0 && firstSegment === "default" && !currentOrigin.defaultIsModule) return undefined;
					currentOrigin = {
						...currentOrigin,
						origin: {
							...currentOrigin.origin,
							importedPath: [...currentOrigin.origin.importedPath, ...step.segments]
						}
					};
					origins.set(step.binding.bindingId, currentOrigin);
				}
				return currentOrigin;
			};
			const invalidatedOrigin = (record) => record?.dependencies.some(({ path, capturedAt }) => {
				if (capturedAt === undefined) return true;
				const scope = opaqueMutationPath(capturedAt).join(".");
				return writes.some((write) => (write.scope === scope || write.scope === "intrinsic") && write.offset < (capturedAt.start ?? -1) && write.coverage.covers(path));
			}) ?? false;
			return {
				origin,
				callOrigin,
				intrinsicPath,
				intrinsicInvocation: (node, callablePath = intrinsicPath) => resolveJavaScriptIntrinsicInvocation(node, callablePath, boundIntrinsic, intrinsicReadChanged, nativeArrayIteration),
				boundIntrinsic,
				staticString,
				isFreshObject,
				opaqueMutationPath,
				retainWrite: (node, path) => {
					const coverage = new SemanticPropertyPathCoverage();
					coverage.retain(path[0] === "opaque-intrinsic" ? ["intrinsic"] : path);
					writes.push({
						scope: opaqueMutationPath(node).join("."),
						offset: node.start ?? Infinity,
						coverage
					});
				},
				invalidated: (binding) => {
					const cached = invalidatedBindings.get(binding.bindingId);
					if (cached !== undefined) return cached;
					const result = invalidatedOrigin(origins.get(binding.bindingId));
					invalidatedBindings.set(binding.bindingId, result);
					return result;
				},
				invalidatedCall: (node) => {
					const cached = invalidatedCalls.get(node);
					if (cached !== undefined) return cached;
					const result = invalidatedOrigin(calls.get(node));
					invalidatedCalls.set(node, result);
					return result;
				},
				aliasMayHaveChanged: (binding) => {
					if (state.opaqueEffects.byScope.size === 0) return false;
					const cached = aliasChangedCache.get(binding.bindingId);
					if (cached !== undefined) return cached;
					origin(binding);
					let current = binding;
					const seen = new Set();
					let changed = false;
					while (current !== undefined) {
						if (seen.has(current.bindingId)) break;
						seen.add(current.bindingId);
						const next = aliasTargets.get(current.bindingId);
						if (next === undefined) break;
						if (semanticOpaqueBindingReadMayHaveChanged(next.targetBinding, next.node, state)) {
							changed = true;
							break;
						}
						current = next.targetBinding;
					}
					aliasChangedCache.set(binding.bindingId, changed);
					return changed;
				}
			};
		};
		identityFunction = (node, state) => {
			if (!t.isFunction(node) || node.async || node.generator || runtimeFunctionParameters(node).length !== 1) return false;
			const parameter = runtimeFunctionParameters(node)[0];
			const result = t.isBlockStatement(node.body) ? node.body.body.length === 1 && t.isReturnStatement(node.body.body[0]) ? node.body.body[0].argument : undefined : node.body;
			return t.isIdentifier(parameter) && t.isIdentifier(result) && resolveSemanticBindingState(state, parameter, parameter.name) !== undefined && resolveSemanticBindingState(state, parameter, parameter.name) === resolveSemanticBindingState(state, result, result.name);
		};
		unprojectedInitializer = (binding, state) => {
			const initializer = semanticStableInitializer(binding, state);
			return initializer?.projection.length === 0 ? initializer.node : undefined;
		};
		canonicalRoles = (actual, pattern, state) => {
			const roles = new Map();
			const used = new Map();
			const pending = [{
				actual,
				pattern,
				parent: null
			}];
			while (pending.length !== 0) {
				const pair = pending.pop();
				if (pair === undefined) return undefined;
				const { parent } = pair;
				const controlBody = t.isIfStatement(parent) && (parent.consequent === pair.pattern || parent.alternate === pair.pattern) || t.isForStatement(parent) && parent.body === pair.pattern;
				const node = controlBody ? controlBodyOperation(pair.actual) : pair.actual;
				const expected = controlBody ? controlBodyOperation(pair.pattern) : pair.pattern;
				if (node.type !== expected.type) return undefined;
				const literalKey = parent !== null && (t.isMemberExpression(parent) && !parent.computed && parent.property === expected || t.isObjectProperty(parent) && !parent.computed && parent.key === expected);
				if (t.isIdentifier(expected) && t.isIdentifier(node) && !literalKey) {
					const binding = resolveSemanticBindingState(state, node, node.name);
					if (binding === undefined || roles.has(expected.name) && roles.get(expected.name) !== binding || used.has(binding.bindingId) && used.get(binding.bindingId) !== expected.name) return undefined;
					roles.set(expected.name, binding);
					used.set(binding.bindingId, expected.name);
				}
				const visitorKeys = javaScriptAstChildKeys(expected);
				for (const [key, field] of Object.entries(t.NODE_FIELDS[expected.type] ?? {})) {
					if (visitorKeys.includes(key) || t.isIdentifier(expected) && key === "name" && !literalKey) continue;
					const fallback = Reflect.get(field, "default");
					if (JSON.stringify(Reflect.get(node, key) ?? fallback) !== JSON.stringify(Reflect.get(expected, key) ?? fallback)) return undefined;
				}
				const children = childNodes(node), expectedChildren = childNodes(expected);
				if (children.length !== expectedChildren.length) return undefined;
				for (const [index, child] of children.entries()) {
					const expectedChild = expectedChildren[index];
					if (expectedChild !== undefined) pending.push({
						actual: child,
						pattern: expectedChild,
						parent: expected
					});
				}
			}
			return roles;
		};
		controlBodyOperation = (node) => {
			while (t.isBlockStatement(node) && node.directives.length === 0 && node.body.length === 1) {
				const statement = node.body[0];
				if (statement === undefined) break;
				node = statement;
			}
			return node;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCallableResults.js
var resultExpressions, semanticCallableResultExpressions, semanticCallableResultKind;
function init_javascriptSemanticCallableResults() {
	return (init_javascriptSemanticCallableResults = __esmMin((() => {
		init_javascriptSemanticTraversal();
		resultExpressions = new WeakMap();
		semanticCallableResultExpressions = (callable) => {
			const cached = resultExpressions.get(callable);
			if (cached !== undefined) return cached;
			if (t.isArrowFunctionExpression(callable) && !t.isBlockStatement(callable.body)) {
				const result = [{
					node: callable.body,
					site: callable.body,
					kind: "return",
					delegated: false
				}];
				resultExpressions.set(callable, result);
				return result;
			}
			if (!t.isFunction(callable)) return [];
			const output = [];
			const pending = childNodes(callable.body).reverse();
			while (pending.length > 0) {
				const node = pending.pop();
				if (node === undefined || t.isFunction(node) || t.isClass(node)) continue;
				if (t.isReturnStatement(node)) {
					output.push({
						node: node.argument ?? null,
						site: node,
						kind: "return",
						delegated: false
					});
				}
				if (t.isYieldExpression(node)) output.push({
					node: node.argument ?? null,
					site: node,
					kind: "yield",
					delegated: node.delegate
				});
				for (const child of childNodes(node).reverse()) pending.push(child);
			}
			resultExpressions.set(callable, output);
			return output;
		};
		semanticCallableResultKind = (callable) => {
			if (!t.isFunction(callable)) return "value";
			if (callable.generator) return callable.async ? "async-iterator" : "iterator";
			return callable.async ? "promise" : "value";
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticGetterQueries.js
var SemanticObjectReferenceSet, SemanticGetterQuery;
function init_javascriptSemanticGetterQueries() {
	return (init_javascriptSemanticGetterQueries = __esmMin((() => {
		init_javascriptSemanticResourceLimits();
		SemanticObjectReferenceSet = class {
			#nodes = new Map();
			#owners = new WeakMap();
			#ownerCount = 0;
			add(reference) {
				const owner = reference.ownerInitializer;
				if (owner !== undefined && !this.#owners.has(owner)) this.#owners.set(owner, ++this.#ownerCount);
				const key = JSON.stringify([
					reference.path,
					owner === undefined ? null : this.#owners.get(owner),
					reference.escapes === true,
					reference.widenedGetterResult === true
				]);
				const paths = this.#nodes.get(reference.node) ?? new Map();
				paths.set(key, reference);
				this.#nodes.set(reference.node, paths);
			}
			values() {
				return [...this.#nodes.values()].flatMap((paths) => [...paths.values()]);
			}
		};
		SemanticGetterQuery = class {
			state;
			#memo = new WeakMap();
			#references = new SemanticObjectReferenceSet();
			#pending = [];
			#current;
			#limited = false;
			#visits = 0;
			#fallback = false;
			constructor(state) {
				this.state = state;
			}
			get widening() {
				return this.#fallback;
			}
			/** Charge retained local work and getter jobs to the same precise query. */
			reserveResult() {
				if (this.#limited) return false;
				if (!this.#fallback && this.#visits >= 512) {
					this.#limited = true;
					return false;
				}
				this.#visits++;
				return true;
			}
			retain(reference, escapes = false) {
				this.#references.add({
					...reference,
					...escapes ? { escapes: true } : {},
					...this.#fallback && this.#current !== undefined ? { widenedGetterResult: true } : {}
				});
			}
			#known(invocation, path, escapes) {
				const receiver = invocation.receiver ?? invocation.owner;
				const receivers = this.#memo.get(invocation.getter);
				const paths = receivers?.get(receiver);
				const key = JSON.stringify([path, escapes]);
				if (paths?.has(key)) return true;
				if (!this.reserveResult()) return true;
				const selections = paths ?? new Set();
				const owners = receivers ?? new WeakMap();
				selections.add(key);
				owners.set(receiver, selections);
				this.#memo.set(invocation.getter, owners);
				return false;
			}
			#ancestor(invocation) {
				const receiver = invocation.receiver ?? invocation.owner;
				for (let visit = this.#current?.ancestry; visit !== undefined; visit = visit.parent) if (visit.getter === invocation.getter && visit.receiver === receiver) return visit;
				return undefined;
			}
			#grows(invocation, path) {
				if (this.#fallback) return false;
				const previous = this.#ancestor(invocation);
				if (previous === undefined || previous.length >= path.length) return false;
				this.#limited = true;
				return true;
			}
			schedule(invocation, path, escaped = false) {
				if (this.#limited) return;
				const escapes = escaped || this.#fallback || this.#current?.escapes === true;
				const selection = this.#fallback ? [] : path;
				if (this.#grows(invocation, selection)) return;
				if (this.#known(invocation, selection, escapes)) return;
				this.#pending.push({
					invocation,
					path: selection,
					escapes,
					ancestry: {
						getter: invocation.getter,
						receiver: invocation.receiver ?? invocation.owner,
						length: selection.length,
						...this.#current === undefined ? {} : { parent: this.#current.ancestry }
					}
				});
			}
			#collect(root, expand) {
				for (const reference of root()) this.retain(reference);
				for (let cursor = 0; cursor < this.#pending.length && !this.#limited; cursor++) {
					const job = this.#pending[cursor];
					if (job === undefined) break;
					this.#current = job;
					expand(job);
				}
				this.#current = undefined;
			}
			run(root, expand) {
				this.#collect(root, expand);
				if (this.#limited) {
					this.state.getterResourceLimits.add("getter-expansion");
					this.#fallback = true;
					this.#limited = false;
					this.#memo = new WeakMap();
					this.#references = new SemanticObjectReferenceSet();
					this.#pending = [];
					this.#collect(root, expand);
				}
				return this.#references.values();
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticGetterResultWalker.js
var resultBranches, GetterResultWalker, expandSemanticGetterResult;
function init_javascriptSemanticGetterResultWalker() {
	return (init_javascriptSemanticGetterResultWalker = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticCallableResults();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticReferenceSources();
		init_javascriptSemanticState();
		init_javascriptSemanticGetterQueries();
		resultBranches = (node) => {
			if (t.isConditionalExpression(node)) return [node.consequent, node.alternate];
			if (t.isLogicalExpression(node)) return [node.left, node.right];
			if (t.isSequenceExpression(node)) {
				const last = node.expressions.at(-1);
				return last === undefined ? [] : [last];
			}
			if (t.isAssignmentExpression(node)) {
				if (node.operator === "=") return [node.right];
				if ([
					"&&=",
					"||=",
					"??="
				].includes(node.operator)) return [node.left, node.right];
			}
			return undefined;
		};
		GetterResultWalker = class {
			job;
			query;
			resolvers;
			#pending = [];
			#aliases = new Map();
			#scope;
			constructor(job, query, resolvers, roots = semanticCallableResultExpressions(job.invocation.getter)) {
				this.job = job;
				this.query = query;
				this.resolvers = resolvers;
				for (const { node } of roots) if (node !== null) this.#enqueue(() => ({
					node,
					path: job.path
				}));
				this.#scope = query.state.scopeByNode.get(job.invocation.getter)?.scopeId;
			}
			run() {
				for (let cursor = 0; cursor < this.#pending.length; cursor++) {
					const current = this.#pending[cursor];
					if (current !== undefined) this.#visit(current);
				}
			}
			#enqueue(create) {
				if (!this.query.reserveResult()) return;
				const work = create();
				this.#pending.push(this.query.widening ? {
					...work,
					path: [],
					escapes: true,
					...work.privateRead === undefined ? {} : { privateRead: {
						...work.privateRead,
						path: []
					} }
				} : work);
			}
			#retain(current, reference) {
				this.query.retain(reference, current.escapes || this.job.escapes);
			}
			#privateRead(current) {
				if (current.privateRead !== undefined) this.#retain(current, {
					node: current.privateRead.node,
					path: current.escapes ? [] : current.privateRead.path
				});
			}
			#localBinding(expression) {
				const state = this.query.state;
				const binding = resolveSemanticBindingState(state, expression, expression.name);
				let scope = binding === undefined ? undefined : state.scopesById.get(binding.scopeId);
				while (scope !== undefined && scope.scopeId !== this.#scope) {
					if (scope.kind === "function" || scope.parentScopeId === null) return undefined;
					scope = state.scopesById.get(scope.parentScopeId);
				}
				return scope !== undefined && binding?.referenceInitializers.every((initializer) => initializer.copyKind === undefined) ? binding : undefined;
			}
			#cycle(current, identity) {
				for (let visit = current.aliases; visit !== undefined; visit = visit.parent) if (visit.identity === identity) return visit;
				return undefined;
			}
			#alias(current, expression) {
				const binding = this.#localBinding(expression);
				if (binding === undefined) return false;
				const identity = JSON.stringify([
					binding.bindingId,
					expression.start,
					expression.end
				]);
				const previous = this.#cycle(current, identity);
				if (previous !== undefined) {
					if (current.path.length > previous.pathLength && !current.escapes) this.#enqueue(() => ({
						...current,
						path: [],
						aliases: undefined,
						escapes: true
					}));
					return true;
				}
				const key = JSON.stringify([
					current.path,
					current.privateRead?.name,
					current.privateRead?.path,
					current.escapes
				]);
				const known = this.#aliases.get(identity) ?? new Set();
				if (!known.has(key)) {
					known.add(key);
					this.#aliases.set(identity, known);
					this.#aliasOrigins(current, expression, binding, identity);
				}
				return true;
			}
			#aliasOrigins(current, expression, binding, identity) {
				const state = this.query.state;
				const { binding: origins } = semanticBindingAtRead(binding, expression, state);
				const aliases = {
					identity,
					pathLength: current.path.length,
					...current.aliases === undefined ? {} : { parent: current.aliases }
				};
				for (const initializer of [...origins.initializers, ...origins.referenceInitializers.filter((origin) => !semanticReferenceSourcesInactive(origin, state))]) this.#enqueue(() => ({
					...current,
					node: initializer.node,
					path: [...initializer.projection, ...current.path],
					aliases
				}));
			}
			#ownsThis(expression) {
				let owner = this.query.state.parentsByNode.get(expression);
				while (owner !== undefined && !t.isClass(owner) && !(t.isFunction(owner) && !t.isArrowFunctionExpression(owner))) owner = this.query.state.parentsByNode.get(owner);
				return owner === this.job.invocation.getter;
			}
			#privateValue(current, owner) {
				const read = current.privateRead;
				if (read === undefined) return;
				const { getter, receiver = owner } = this.job.invocation;
				const isStatic = t.isClassMethod(getter) && getter.static;
				if (!t.isClass(receiver) || !this.resolvers.privateReceiver(receiver, owner, current.path, isStatic)) {
					this.#privateRead(current);
					return;
				}
				for (const member of owner.body.body) if (t.isClassPrivateProperty(member) && member.static === isStatic && member.key.id.name === read.name && member.value != null) this.#retain(current, {
					node: member.value,
					path: current.escapes ? [] : read.path
				});
			}
			#thisValue(current, expression) {
				if (!this.#ownsThis(expression)) return;
				const { getter, owner, receiver = owner } = this.job.invocation;
				if (current.privateRead !== undefined && t.isClass(owner)) {
					this.#privateValue(current, owner);
					return;
				}
				const references = t.isClass(receiver) ? this.resolvers.classReferences({
					owner: receiver,
					kind: t.isClassMethod(getter) && getter.static ? "static" : "instance"
				}, current.path, current.escapes || this.job.escapes) : this.resolvers.objectReferences(receiver, current.path);
				for (const reference of references) this.#retain(current, reference);
			}
			#superValue(current, expression) {
				const { getter, owner, receiver = owner } = this.job.invocation;
				if (!t.isSuper(expression.object) || !t.isClass(owner) || owner.superClass == null) return false;
				const key = semanticStaticPropertyKey(expression.property, expression.computed);
				for (const base of this.resolvers.bases(owner.superClass)) for (const reference of this.resolvers.classReferences({
					owner: base,
					receiver: t.isClass(receiver) ? receiver : owner,
					kind: t.isClassMethod(getter) && getter.static ? "static" : "prototype"
				}, [key, ...current.path], current.escapes || this.job.escapes)) this.#retain(current, reference);
				return true;
			}
			#member(current, expression) {
				if (current.privateRead !== undefined && t.isPrivateName(expression.property)) {
					this.#privateRead(current);
					return;
				}
				if (t.isPrivateName(expression.property) && t.isClass(this.job.invocation.owner)) {
					const name = expression.property.id.name;
					this.#enqueue(() => ({
						...current,
						node: expression.object,
						path: [],
						privateRead: {
							node: expression,
							name,
							path: current.path
						}
					}));
					return;
				}
				if (!this.#superValue(current, expression)) this.#enqueue(() => ({
					...current,
					node: expression.object,
					path: [semanticStaticPropertyKey(expression.property, expression.computed), ...current.path]
				}));
			}
			#visit(current) {
				const expression = unwrapJavaScriptExpression(current.node).node;
				if (t.isIdentifier(expression) && this.#alias(current, expression)) return;
				if (t.isForOfStatement(expression)) {
					this.#enqueue(() => ({
						...current,
						node: expression.right,
						path: [null, ...current.path]
					}));
					return;
				}
				if (t.isThisExpression(expression) || t.isSuper(expression)) this.#thisValue(current, expression);
				else if (t.isMemberExpression(expression) || t.isOptionalMemberExpression(expression)) this.#member(current, expression);
				else {
					const branches = resultBranches(expression);
					if (branches !== undefined) for (const node of branches) this.#enqueue(() => ({
						...current,
						node
					}));
					else if (current.privateRead !== undefined) this.#privateRead(current);
					else if (current.path.length > 0 && (t.isObjectExpression(expression) || t.isArrayExpression(expression)) && this.resolvers.containerReferences !== undefined) {
						for (const reference of this.resolvers.containerReferences(expression, current.path)) this.#enqueue(() => ({
							...current,
							node: reference.node,
							path: reference.path
						}));
					} else this.#retain(current, {
						node: expression,
						path: current.path
					});
				}
			}
		};
		expandSemanticGetterResult = (job, query, resolvers) => new GetterResultWalker(job, query, resolvers).run();
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticObjectReferences.js
var semanticClassCandidates, instanceFieldReferences, classPropertyDescriptors, semanticClassPropertyReferences, semanticClassAccessorReferences, ClassReferenceWalk, classPropertyReferences, objectReceiverReference, privateReceiverProjection, expandGetterResult, propertyIndexes, objectPropertyIndex, relevantPropertiesInReverse, semanticObjectPropertyReferences, semanticObjectAccessorReferences, ObjectReferenceWalk, objectPropertyReferences, objectExpressionDefinesKey, semanticArrayPropertyReferences;
function init_javascriptSemanticObjectReferences() {
	return (init_javascriptSemanticObjectReferences = __esmMin((() => {
		init_javascriptSemanticPropertyKeys();
		init_javascriptSemanticState();
		init_javascriptAstValues();
		init_javascriptSemanticPropertyPaths();
		init_unicodeCodePointOrder();
		init_javascriptSemanticGetterQueries();
		init_javascriptSemanticGetterResultWalker();
		semanticClassCandidates = (root, state) => {
			const pending = [root];
			const seenNodes = new Set();
			const seenBindings = new Set();
			const classes = [];
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const node = pending[cursor];
				if (node === undefined) continue;
				const expression = unwrapJavaScriptExpression(node).node;
				if (seenNodes.has(expression)) continue;
				seenNodes.add(expression);
				if (t.isClass(expression)) {
					classes.push(expression);
				} else if (t.isIdentifier(expression)) {
					const binding = resolveSemanticBindingState(state, expression, expression.name);
					if (binding === undefined || seenBindings.has(binding.bindingId)) continue;
					seenBindings.add(binding.bindingId);
					for (const initializer of binding.initializers) pending.push(initializer.node);
				} else if (t.isConditionalExpression(expression) || t.isLogicalExpression(expression)) {
					pending.push(t.isConditionalExpression(expression) ? expression.consequent : expression.left, t.isConditionalExpression(expression) ? expression.alternate : expression.right);
				} else if (t.isSequenceExpression(expression)) {
					const last = expression.expressions.at(-1);
					if (last !== undefined) pending.push(last);
				}
			}
			return classes;
		};
		instanceFieldReferences = (root, propertyName, path, state, initializedBefore) => {
			const references = [];
			const pending = [{
				klass: root,
				excluded: new Set()
			}];
			const selections = new Map();
			let definiteNames;
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const current = pending[cursor];
				if (current === undefined) continue;
				const previous = selections.get(current.klass);
				const excluded = previous === undefined ? current.excluded : new Set([...previous].filter((name) => current.excluded.has(name)));
				if (previous !== undefined && previous.size === excluded.size) continue;
				selections.set(current.klass, excluded);
				const shadowed = new Set(excluded);
				const before = initializedBefore === undefined ? -1 : current.klass.body.body.indexOf(initializedBefore);
				const members = before < 0 ? current.klass.body.body : current.klass.body.body.slice(0, before);
				for (const member of [...members].reverse()) {
					if (!isRuntimeJavaScriptClassProperty(member) || member.static) continue;
					if (propertyName !== null && member.computed && semanticKnownSymbolKey(member.key, state)) continue;
					const key = semanticStaticPropertyKey(member.key, member.computed);
					if (key !== null && shadowed.has(key)) continue;
					if (key !== null) shadowed.add(key);
					if ((propertyName === null || key === null || key === propertyName) && member.value != null) references.push({
						node: member.value,
						path
					});
				}
				const bases = current.klass.superClass == null ? [] : semanticClassCandidates(current.klass.superClass, state);
				if (bases.length === 0) definiteNames = definiteNames === undefined ? shadowed : new Set([...definiteNames].filter((name) => shadowed.has(name)));
				for (const klass of bases) pending.push({
					klass,
					excluded: shadowed
				});
			}
			return {
				references,
				definiteNames: definiteNames ?? new Set()
			};
		};
		classPropertyDescriptors = (klass, propertyName, kind, state, initializedBefore, accessor = "get") => {
			const isStatic = kind === "static";
			const selectedAccessors = [];
			const fields = [];
			const indexedMembers = [];
			const before = initializedBefore === undefined ? -1 : klass.body.body.indexOf(initializedBefore);
			klass.body.body.forEach((member, index) => {
				if ((t.isClassMethod(member) || t.isClassProperty(member)) && propertyName !== null && member.computed && semanticKnownSymbolKey(member.key, state)) return;
				if (before >= 0 && index >= before && isRuntimeJavaScriptClassProperty(member)) return;
				if ((t.isClassMethod(member) || kind === "static" && isRuntimeJavaScriptClassProperty(member)) && member.static === isStatic) indexedMembers.push({
					member,
					index,
					key: semanticStaticPropertyKey(member.key, member.computed)
				});
			});
			const matchingMembers = propertyName === null ? [] : indexedMembers.filter(({ key }) => key === propertyName);
			const uncertainAccessors = indexedMembers.filter((entry) => {
				const { member, key } = entry;
				return t.isClassMethod(member) && member.kind === accessor && (propertyName === null || member.computed && key === null);
			});
			const getters = matchingMembers.filter((entry) => t.isClassMethod(entry.member) && entry.member.kind === accessor);
			const getter = getters.at(-1);
			const getterIndex = getter?.index ?? -1;
			const laterDataMember = matchingMembers.some(({ member, index }) => t.isClassProperty(member) || t.isClassMethod(member) && member.kind === "method" && index > getterIndex);
			const seenFields = new Set();
			for (const { member, key } of [...indexedMembers].reverse()) {
				if (!t.isClassProperty(member)) continue;
				if (key !== null && seenFields.has(key)) continue;
				if (key !== null) seenFields.add(key);
				if (propertyName === null || key === null || key === propertyName) fields.push(member);
			}
			if (getters.length > 0 && !laterDataMember && getter !== undefined) selectedAccessors.push(getter.member);
			for (const { member, index } of uncertainAccessors) if (!matchingMembers.some(({ member: matching, index: matchingIndex }) => (t.isClassProperty(matching) || t.isClassMethod(matching) && (matching.kind === "method" || matching.kind === accessor)) && matchingIndex > index)) selectedAccessors.push(member);
			return {
				accessors: selectedAccessors,
				fields,
				inherits: matchingMembers.length === 0
			};
		};
		semanticClassPropertyReferences = (lookup, selection, state) => {
			const query = new SemanticGetterQuery(state);
			return query.run(() => classPropertyReferences(lookup, selection, state, { query }), (job) => expandGetterResult(job, query));
		};
		semanticClassAccessorReferences = (lookup, key, state, accessor) => new ClassReferenceWalk(lookup, [key], state, {
			query: new SemanticGetterQuery(state),
			accessor
		}).run();
		ClassReferenceWalk = class {
			lookup;
			state;
			context;
			#references = [];
			#pending;
			#seen = new Set();
			#name;
			#path;
			#fields = new Set();
			constructor(lookup, selection, state, context) {
				this.lookup = lookup;
				this.state = state;
				this.context = context;
				const [key, ...path] = selection;
				this.#name = key == null || typeof key === "object" ? null : String(key);
				this.#path = path;
				this.#pending = [lookup.owner];
			}
			#instanceFields() {
				if (this.lookup.kind !== "instance") return false;
				const fields = instanceFieldReferences(this.lookup.owner, this.#name, this.#path, this.state, this.lookup.initializedBefore);
				if (this.context.accessor === undefined) for (const reference of fields.references) this.#references.push(reference);
				this.#fields = fields.definiteNames;
				return this.#name !== null && this.#fields.has(this.#name);
			}
			#getter(klass, getter) {
				const key = semanticStaticPropertyKey(getter.key, getter.computed);
				if (key !== null && this.#fields.has(key)) return;
				if (this.context.accessor !== undefined) {
					this.#references.push({
						node: getter,
						path: []
					});
					return;
				}
				this.context.query.schedule({
					getter,
					owner: klass,
					receiver: this.lookup.receiver ?? this.lookup.owner
				}, this.#path, this.context.escapes);
			}
			#visit(klass) {
				const descriptors = classPropertyDescriptors(klass, this.#name, this.lookup.kind, this.state, this.lookup.initializedBefore, this.context.accessor);
				for (const field of this.context.accessor === undefined ? descriptors.fields : []) if (field.value != null) this.#references.push({
					node: field.value,
					path: this.#path
				});
				for (const getter of this.lookup.fieldsOnly ? [] : descriptors.accessors) this.#getter(klass, getter);
				if (descriptors.inherits && klass.superClass != null) for (const base of semanticClassCandidates(klass.superClass, this.state)) this.#pending.push(base);
			}
			run() {
				if (this.#instanceFields()) return this.#references;
				for (let cursor = 0; cursor < this.#pending.length; cursor++) {
					const klass = this.#pending[cursor];
					if (klass === undefined || this.#seen.has(klass)) continue;
					this.#seen.add(klass);
					this.#visit(klass);
				}
				return this.#references;
			}
		};
		classPropertyReferences = (lookup, selection, state, context) => new ClassReferenceWalk(lookup, selection, state, context).run();
		objectReceiverReference = (object, path, state) => {
			let current = object;
			const projection = [];
			while (true) {
				const parent = state.parentsByNode.get(current);
				if (t.isVariableDeclarator(parent) && parent.init === current && t.isIdentifier(parent.id)) return [{
					node: parent.id,
					path: [...projection, ...path],
					ownerInitializer: current
				}];
				if (t.isAssignmentExpression(parent, { operator: "=" }) && parent.right === current && t.isIdentifier(parent.left)) return [{
					node: parent.left,
					path: [...projection, ...path],
					ownerInitializer: current
				}];
				if (t.isArrayExpression(parent)) {
					let minimumIndex = 0;
					let uncertainIndex = false;
					for (const element of parent.elements) {
						if (element === current) break;
						if (t.isSpreadElement(element)) uncertainIndex = true;
						else minimumIndex++;
					}
					projection.unshift(uncertainIndex ? {
						excludedKeys: [],
						startIndex: minimumIndex
					} : minimumIndex);
					current = parent;
					continue;
				}
				if (t.isObjectProperty(parent) && parent.value === current) {
					projection.unshift(semanticStaticPropertyKey(parent.key, parent.computed));
					const container = state.parentsByNode.get(parent);
					if (t.isObjectExpression(container)) {
						current = container;
						continue;
					}
				}
				break;
			}
			return [{
				node: object,
				path
			}];
		};
		privateReceiverProjection = (receiver, owner, path, isStatic, state) => {
			if (path.some((key) => key === null || typeof key === "object")) return false;
			const pending = [{
				receiver,
				path: path.map((key) => ({ key: String(key) })),
				visits: new Map()
			}];
			const seen = new Set();
			const declaringClass = (field) => {
				const body = state.parentsByNode.get(field);
				return body === undefined ? undefined : state.parentsByNode.get(body);
			};
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const current = pending[cursor];
				if (current === undefined) break;
				const [selection, ...remaining] = current.path;
				if (selection === undefined) {
					if (!isStatic || current.receiver === owner) return true;
					continue;
				}
				const origin = JSON.stringify([
					current.receiver.start,
					selection.key,
					selection.before?.start
				]);
				const previous = current.visits.get(origin);
				if (previous !== undefined && previous <= current.path.length) continue;
				const visits = new Map(current.visits).set(origin, current.path.length);
				const identity = JSON.stringify([current.receiver.start, current.path.map(({ key, before }) => [key, before?.start])]);
				if (seen.has(identity)) continue;
				seen.add(identity);
				const lookupOwner = selection.before === undefined ? current.receiver : declaringClass(selection.before);
				if (!t.isClass(lookupOwner)) continue;
				for (const reference of semanticClassPropertyReferences({
					owner: lookupOwner,
					receiver: current.receiver,
					kind: isStatic ? "static" : "instance",
					fieldsOnly: true,
					...selection.before === undefined ? {} : { initializedBefore: selection.before }
				}, [selection.key], state)) {
					const field = state.parentsByNode.get(reference.node);
					if (!t.isClassProperty(field)) continue;
					const fieldOwner = declaringClass(field);
					if (!t.isClass(fieldOwner)) continue;
					const projection = [];
					let value = unwrapJavaScriptExpression(reference.node).node;
					while (t.isMemberExpression(value) || t.isOptionalMemberExpression(value)) {
						const key = semanticStaticPropertyKey(value.property, value.computed);
						if (key === null || t.isPrivateName(value.property)) break;
						projection.unshift({
							key,
							before: field
						});
						value = unwrapJavaScriptExpression(value.object).node;
					}
					if (!t.isThisExpression(value)) continue;
					pending.push({
						receiver: isStatic ? fieldOwner : current.receiver,
						path: [...projection, ...remaining],
						visits
					});
				}
			}
			return false;
		};
		expandGetterResult = (job, query) => {
			const state = query.state;
			expandSemanticGetterResult(job, query, {
				classReferences: (lookup, path, escapes) => classPropertyReferences(lookup, path, state, {
					query,
					escapes
				}),
				objectReferences: (receiver, path) => objectReceiverReference(receiver, path, state),
				privateReceiver: (receiver, owner, path, isStatic) => privateReceiverProjection(receiver, owner, path, isStatic, state),
				bases: (node) => semanticClassCandidates(node, state)
			});
		};
		propertyIndexes = new WeakMap();
		objectPropertyIndex = (node) => {
			const cached = propertyIndexes.get(node);
			if (cached !== undefined) return cached;
			const keyIndependent = [];
			const byName = new Map();
			node.properties.forEach((property, index) => {
				const name = t.isSpreadElement(property) ? null : semanticStaticPropertyKey(property.key, property.computed);
				if (name === null || t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__") {
					keyIndependent.push(index);
					return;
				}
				const positions = byName.get(name);
				if (positions === undefined) byName.set(name, [index]);
				else positions.push(index);
			});
			const index = {
				keyIndependent,
				byName
			};
			propertyIndexes.set(node, index);
			return index;
		};
		relevantPropertiesInReverse = (node, key) => {
			if (typeof key !== "string" && typeof key !== "number") return [...node.properties].reverse();
			const { keyIndependent, byName } = objectPropertyIndex(node);
			const named = byName.get(String(key)) ?? [];
			const relevant = [];
			let left = keyIndependent.length - 1;
			let right = named.length - 1;
			while (left >= 0 || right >= 0) {
				const fromLeft = right < 0 || left >= 0 && (keyIndependent[left] ?? -1) > (named[right] ?? -1);
				const position = fromLeft ? keyIndependent[left--] : named[right--];
				const property = position === undefined ? undefined : node.properties[position];
				if (property !== undefined) relevant.push(property);
			}
			return relevant;
		};
		semanticObjectPropertyReferences = (node, path, state) => {
			const query = new SemanticGetterQuery(state);
			return query.run(() => objectPropertyReferences(node, path, query), (job) => expandGetterResult(job, query));
		};
		semanticObjectAccessorReferences = (node, key, state, accessor, lookup = "prototype") => new ObjectReferenceWalk(node, [key], new SemanticGetterQuery(state), accessor, lookup).run();
		ObjectReferenceWalk = class {
			node;
			query;
			accessor;
			accessorLookup;
			#references = [];
			#overwritten = new Set();
			#data = new Set();
			#accessors = new Set();
			#getters = new Set();
			#setters = new Set();
			#key;
			#remaining;
			constructor(node, path, query, accessor, accessorLookup = "prototype") {
				this.node = node;
				this.query = query;
				this.accessor = accessor;
				this.accessorLookup = accessorLookup;
				[this.#key, ...this.#remaining] = path;
			}
			#spreadKey() {
				const selected = this.#key ?? null;
				return typeof selected !== "object" ? selected : {
					...selected,
					excludedKeys: [...new Set([...selected?.excludedKeys ?? [], ...this.#overwritten])].sort(compareUnicodeCodePoints)
				};
			}
			#spread(property) {
				const selected = this.#key ?? null;
				if (typeof selected !== "object" && this.#overwritten.has(String(selected))) return;
				if (this.accessor === undefined) this.#references.push({
					node: property.argument,
					path: [this.#spreadKey(), ...this.#remaining],
					capturedSelectionAt: property.argument,
					ownEnumerable: true
				});
				if (selected !== null && typeof selected !== "object" && t.isObjectExpression(property.argument) && objectExpressionDefinesKey(property.argument, String(selected))) {
					this.#overwritten.add(String(selected));
					this.#data.add(String(selected));
				}
			}
			#prototype(property, name) {
				if (!t.isObjectProperty(property) || property.computed || property.shorthand || name !== "__proto__") return false;
				const selected = this.#key ?? null;
				if (this.accessor !== undefined && this.accessorLookup === "own") return true;
				if (t.isExpression(property.value) && (selected === null || typeof selected === "object" || typeof selected === "string" && !objectExpressionDefinesKey(this.node, selected))) this.#references.push({
					node: property.value,
					path: [selected, ...this.#remaining],
					inherited: true
				});
				return true;
			}
			#read(property, name) {
				if (name === null && this.#key != null && typeof this.#key !== "object" && (t.isObjectMethod(property) && property.kind === (this.accessor ?? "get") ? this.#data.has(String(this.#key)) || (this.accessor === "set" ? this.#setters : this.#getters).has(String(this.#key)) : this.#overwritten.has(String(this.#key)))) return;
				if (name !== null && !semanticPropertyPathKeyMatches(this.#key ?? null, name)) return;
				if (this.accessor !== undefined) {
					if (t.isObjectMethod(property) && property.kind === this.accessor) this.#references.push({
						node: property,
						path: []
					});
					return;
				}
				if (t.isObjectMethod(property)) {
					if (property.kind === "get") this.query.schedule({
						getter: property,
						owner: this.node
					}, this.#remaining);
					if (property.kind === "get" || property.kind === "set") return;
				}
				this.#references.push({
					node: t.isObjectProperty(property) ? property.value : property,
					path: this.#remaining
				});
			}
			#record(name, kind) {
				this.#overwritten.add(name);
				if (kind === "data") this.#data.add(name);
				else {
					this.#accessors.add(name);
					(kind === "get" ? this.#getters : this.#setters).add(name);
				}
			}
			#visit(property) {
				if (t.isSpreadElement(property)) {
					this.#spread(property);
					return;
				}
				if (property.computed && this.#key !== undefined && this.#key !== null && typeof this.#key !== "object" && semanticKnownSymbolKey(property.key, this.query.state)) return;
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (this.#prototype(property, name)) return;
				const kind = t.isObjectMethod(property) && property.kind !== "method" ? property.kind : "data";
				if (name !== null && (kind === "data" ? this.#data.has(name) || this.#accessors.has(name) : this.#data.has(name) || (kind === "get" ? this.#getters : this.#setters).has(name))) return;
				this.#read(property, name);
				if (name !== null) this.#record(name, kind);
			}
			run() {
				for (const property of relevantPropertiesInReverse(this.node, this.#key)) this.#visit(property);
				return this.#references;
			}
		};
		objectPropertyReferences = (node, path, query) => new ObjectReferenceWalk(node, path, query).run();
		objectExpressionDefinesKey = (root, key) => {
			const pending = [root];
			const seen = new Set();
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const object = pending[cursor];
				if (object === undefined || seen.has(object)) continue;
				seen.add(object);
				for (const property of object.properties) {
					if (t.isSpreadElement(property)) {
						if (t.isObjectExpression(property.argument)) pending.push(property.argument);
						continue;
					}
					const name = semanticStaticPropertyKey(property.key, property.computed);
					if (name === key && !(t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__")) return true;
				}
			}
			return false;
		};
		semanticArrayPropertyReferences = (node, path) => {
			const [key, ...remaining] = path;
			const selected = key ?? null;
			const selectedIndex = typeof selected === "object" ? null : semanticArrayIndex(selected);
			if (typeof selected !== "object" && selectedIndex === null) return [];
			const references = [];
			let minimumIndex = 0;
			let uncertainIndex = false;
			for (const element of node.elements) {
				if (t.isSpreadElement(element)) {
					if (selectedIndex === null || selectedIndex >= minimumIndex) {
						let sourceKey = null;
						if (!uncertainIndex) {
							if (selectedIndex !== null) sourceKey = selectedIndex - minimumIndex;
							else if (selected !== null && typeof selected === "object") sourceKey = {
								excludedKeys: selected.excludedKeys.flatMap((name) => {
									const index = semanticArrayIndex(name);
									return index === null || index < minimumIndex ? [] : [String(index - minimumIndex)];
								}),
								startIndex: Math.max(0, (selected.startIndex ?? 0) - minimumIndex)
							};
						}
						references.push({
							node: element.argument,
							path: [sourceKey, ...remaining],
							capturedSelectionAt: element.argument,
							iterableFallbackPath: []
						});
					}
					uncertainIndex = true;
					continue;
				}
				if (element !== null && (uncertainIndex ? selectedIndex === null || selectedIndex >= minimumIndex : semanticPropertyPathKeyMatches(selected, String(minimumIndex)))) references.push({
					node: element,
					path: remaining
				});
				minimumIndex++;
			}
			return references;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticAliasSelections.js
var semanticAliasSelectionChoices, selection, selectionCovers, pathCovers, joinSelections, SemanticAliasSelections;
function init_javascriptSemanticAliasSelections() {
	return (init_javascriptSemanticAliasSelections = __esmMin((() => {
		init_javascriptSemanticResourceLimits();
		semanticAliasSelectionChoices = (key) => key !== null && typeof key === "object" && "alternatives" in key ? key.alternatives : [key];
		selection = (choices) => {
			if (choices.includes(null)) return null;
			const alternatives = [...new Map(choices.map((choice) => [JSON.stringify(choice), choice]))].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([, choice]) => choice);
			return alternatives.length === 1 ? alternatives[0] : { alternatives };
		};
		selectionCovers = (prior, next) => {
			if (prior === null) return true;
			const choices = new Set(semanticAliasSelectionChoices(prior).map((key) => JSON.stringify(key)));
			return semanticAliasSelectionChoices(next).every((key) => choices.has(JSON.stringify(key)));
		};
		pathCovers = (prior, next) => prior.every((key, index) => next[index] !== undefined && selectionCovers(key, next[index]));
		joinSelections = (prior, next) => {
			let changed = -1;
			for (let index = 0; index < prior.length; index++) {
				if (JSON.stringify(prior[index]) === JSON.stringify(next[index])) continue;
				if (changed !== -1) return undefined;
				changed = index;
			}
			return prior.map((key, index) => index === changed ? selection([...semanticAliasSelectionChoices(key), ...semanticAliasSelectionChoices(next[index])]) : key);
		};
		SemanticAliasSelections = class {
			onLimit;
			#paths = new WeakMap();
			#calls = 0;
			#limited = false;
			constructor(onLimit) {
				this.onLimit = onLimit;
			}
			get limited() {
				return this.#limited;
			}
			normalize(node, next) {
				if (this.#limited) return next.map(() => null);
				const existing = this.#paths.get(node);
				const byDepth = existing ?? new Map();
				const paths = [...byDepth.get(next.length) ?? []];
				let candidate = next.map((key) => selection(semanticAliasSelectionChoices(key)));
				const covered = paths.find((prior) => pathCovers(prior, candidate));
				if (covered !== undefined) return covered;
				if (existing !== undefined && ++this.#calls > 512) {
					this.#limited = true;
					this.#paths = new WeakMap();
					this.onLimit();
					return next.map(() => null);
				}
				for (let index = 0; index < paths.length;) {
					const prior = paths[index];
					if (pathCovers(prior, candidate)) return prior;
					const joined = pathCovers(candidate, prior) ? candidate : joinSelections(prior, candidate);
					if (joined === undefined) {
						index++;
						continue;
					}
					candidate = [...joined];
					paths.splice(index, 1);
					index = 0;
				}
				paths.push(candidate);
				byDepth.set(candidate.length, paths);
				this.#paths.set(node, byDepth);
				return candidate;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticEffectPathIndex.js
var semanticEffectPathMatches, effectPathIndexes, currentEffectPathIndex, visitEffectPathCandidates, semanticEffectPathCandidates, semanticSomeEffectPathCandidate;
function init_javascriptSemanticEffectPathIndex() {
	return (init_javascriptSemanticEffectPathIndex = __esmMin((() => {
		init_javascriptSemanticAliasSelections();
		init_javascriptSemanticPropertyPaths();
		semanticEffectPathMatches = (effectPath, path) => path.length > 0 && effectPath.length <= path.length && effectPath.every((key, index) => {
			const selected = path[index];
			return selected !== undefined && semanticAliasSelectionChoices(selected).some((choice) => choice === null || typeof choice === "object" || semanticPropertyPathKeyMatches(key, String(choice)));
		});
		effectPathIndexes = new WeakMap();
		currentEffectPathIndex = (effects) => {
			let index = effectPathIndexes.get(effects);
			if (index === undefined) {
				index = {
					root: {},
					indexed: 0
				};
				effectPathIndexes.set(effects, index);
			}
			for (; index.indexed < effects.length; index.indexed++) {
				let node = index.root;
				for (const key of effects[index.indexed].path) {
					if (key === null || typeof key === "object") node = node.open ??= {};
					else {
						const exact = node.exact ??= new Map();
						const name = String(key);
						let child = exact.get(name);
						if (child === undefined) {
							child = {};
							exact.set(name, child);
						}
						node = child;
					}
				}
				(node.ends ??= []).push(index.indexed);
			}
			return index;
		};
		visitEffectPathCandidates = (effects, path, visit) => {
			const pending = [{
				node: currentEffectPathIndex(effects).root,
				depth: 0
			}];
			while (pending.length > 0) {
				const { node, depth } = pending.pop();
				for (const position of node.ends ?? []) if (visit(position)) return true;
				if (depth >= path.length) continue;
				if (node.open !== undefined) pending.push({
					node: node.open,
					depth: depth + 1
				});
				const exact = node.exact;
				if (exact === undefined) continue;
				const choices = semanticAliasSelectionChoices(path[depth]);
				if (choices.some((choice) => choice === null || typeof choice === "object")) for (const child of exact.values()) pending.push({
					node: child,
					depth: depth + 1
				});
				else for (const name of new Set(choices.map((choice) => String(choice)))) {
					const child = exact.get(name);
					if (child !== undefined) pending.push({
						node: child,
						depth: depth + 1
					});
				}
			}
			return false;
		};
		semanticEffectPathCandidates = (effects, path) => {
			const positions = [];
			visitEffectPathCandidates(effects, path, (position) => {
				positions.push(position);
				return false;
			});
			return positions.sort((left, right) => left - right).map((position) => effects[position]);
		};
		semanticSomeEffectPathCandidate = (effects, path, predicate) => visitEffectPathCandidates(effects, path, (position) => predicate(effects[position]));
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticProjectedSources.js
function semanticProjectedSourceFactsAtRead(...arguments_) {
	return projectedSourceFactsAtRead(...arguments_);
}
var semanticNormalizeCapturedSelections, semanticShiftCapturedSelections, semanticCapturedSelectionsAfterPropertyRead, hasFreshProjectedReceiver, semanticProjectedSourcesAtRead, semanticProjectedSourceEligibilityAtRead, projectedSourceFactsAtRead;
function init_javascriptSemanticProjectedSources() {
	return (init_javascriptSemanticProjectedSources = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticObjectReferences();
		init_javascriptSemanticResourceLimits();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticReferenceSources();
		init_javascriptSemanticCopiedReferencePaths();
		init_javascriptSemanticIterationSources();
		init_javascriptSemanticEffectPathIndex();
		init_javascriptSemanticAliasSelections();
		semanticNormalizeCapturedSelections = (selections, pathLength) => {
			const byDepth = new Map();
			for (const capture of selections ?? []) if (capture.depth > 0 && (pathLength === undefined || capture.depth <= pathLength)) byDepth.set(capture.depth, capture);
			const normalized = [...byDepth.values()].sort((left, right) => left.depth - right.depth);
			return normalized.length ? normalized : undefined;
		};
		semanticShiftCapturedSelections = (selections, delta) => {
			const shifted = selections?.flatMap((selection) => selection.depth + delta > 0 ? [{
				...selection,
				depth: selection.depth + delta
			}] : []);
			return semanticNormalizeCapturedSelections(shifted);
		};
		semanticCapturedSelectionsAfterPropertyRead = (selections, source) => [...semanticShiftCapturedSelections(selections, source.path.length - 1) ?? [], ...source.capturedSelectionAt === undefined ? [] : [{
			at: source.capturedSelectionAt,
			depth: source.path.length,
			...source.ownEnumerable ? { ownEnumerable: true } : {}
		}]];
		hasFreshProjectedReceiver = (root, path, state) => {
			const pending = [{
				node: root,
				path
			}];
			const examined = new WeakMap();
			let selections = 0;
			while (pending.length > 0) {
				const current = pending.pop();
				const node = unwrapJavaScriptExpression(current.node).node;
				const key = JSON.stringify(current.path);
				const paths = examined.get(node) ?? new Set();
				if (paths.has(key)) return false;
				paths.add(key);
				examined.set(node, paths);
				if (++selections > 512) {
					state.valueResourceLimits.add("alias-selections");
					return false;
				}
				if (current.path.length === 0) {
					if (!t.isObjectExpression(node) && !t.isArrayExpression(node) && !t.isFunction(node) && !t.isClassExpression(node)) return false;
					continue;
				}
				const [selected, ...remaining] = current.path;
				const sources = t.isObjectExpression(node) ? semanticObjectPropertyReferences(node, [selected], state) : t.isArrayExpression(node) ? semanticArrayPropertyReferences(node, [selected]) : [];
				if (sources.length === 0) return false;
				if (selections + pending.length + sources.length > 512) {
					state.valueResourceLimits.add("alias-selections");
					return false;
				}
				pending.push(...sources.map((source) => ({
					node: source.node,
					path: [...source.path, ...remaining]
				})));
			}
			return true;
		};
		semanticProjectedSourcesAtRead = (...arguments_) => semanticProjectedSourceFactsAtRead(...arguments_)?.sources;
		semanticProjectedSourceEligibilityAtRead = (binding, reference, path, state, memberReadAt = reference, capturedSelections = []) => projectedSourceFactsAtRead(binding, reference, path, state, false, memberReadAt, capturedSelections, true)?.sources;
		projectedSourceFactsAtRead = (binding, reference, path, state, includeUnknown, memberReadAt = reference, capturedSelections = [], retainEligibility = false) => {
			const read = semanticBindingAtRead(binding, reference, state);
			const captured = [...read.binding.initializers, ...read.binding.referenceInitializers];
			const normalizedCaptures = semanticNormalizeCapturedSelections(capturedSelections, path.length);
			const captureForDepth = (depth) => normalizedCaptures?.find((capture) => capture.depth >= depth)?.at;
			const selectedAt = (depth) => captureForDepth(depth) ?? memberReadAt;
			const samePrefix = (prefix, effect) => prefix.path.length < effect.path.length && prefix.path.every((key, index) => key !== null && typeof key !== "object" && effect.path[index] !== null && typeof effect.path[index] !== "object" && String(key) === String(effect.path[index]));
			const prefixReplacements = normalizedCaptures === undefined ? [] : binding.memberWrites.filter((replacement) => replacement.receiverIdentity === "definite" && t.isAssignmentExpression(replacement.node, { operator: "=" }) && replacement.path.length < path.length);
			const targetsReplacedPrefix = (effect) => capturedSelections.length > 0 && prefixReplacements.some((replacement) => {
				const capture = captureForDepth(replacement.path.length);
				const receiverAt = effect.receiverAt ?? effect.node;
				return capture !== undefined && receiverAt !== undefined && samePrefix(replacement, effect) && semanticTopLevelEffectFollowsCapture(capture, replacement.node, state.parentsByNode) && semanticDefiniteEffectPrecedesReference(replacement.node, receiverAt, state.parentsByNode) && hasFreshProjectedReceiver(replacement.node.right, effect.path.slice(replacement.path.length, -1), state);
			});
			const matches = (effect) => semanticEffectPathMatches(effect.path, path) && (effect.receiverInitializers === undefined || effect.receiverInitializers.length === 0 || captured.length === 0 || effect.receiverInitializers.some((receiver) => captured.some((source) => source.node === receiver.node && JSON.stringify(source.projection) === JSON.stringify(receiver.projection)))) && semanticEffectTiming(selectedAt(effect.path.length), effect.node, state) !== "after" && !targetsReplacedPrefix(effect);
			const writes = semanticEffectPathCandidates(binding.memberWrites, path).filter(matches);
			let replacement;
			for (const effect of writes) {
				if (effect.receiverIdentity === "definite" && t.isAssignmentExpression(effect.node, { operator: "=" }) && effect.path.every((key, index) => key !== null && typeof key !== "object" && path[index] !== null && typeof path[index] !== "object" && String(key) === String(path[index])) && semanticDefiniteEffectPrecedesReference(effect.node, selectedAt(effect.path.length), state.parentsByNode) && (replacement === undefined || semanticDefiniteEffectPrecedesReference(replacement.node, effect.node, state.parentsByNode) || replacement.node === effect.node && (replacement.assignedSources?.[0]?.target?.start ?? -1) < (effect.assignedSources?.[0]?.target?.start ?? -1))) replacement = effect;
			}
			const superseded = (effect) => replacement !== undefined && effect.node !== undefined && effect !== replacement && (semanticEffectTiming(replacement.node, effect.node, state) === "before" || effect.node === replacement.node && (effect.assignedSources?.[0]?.target?.start ?? -1) < (replacement.assignedSources?.[0]?.target?.start ?? -1));
			if (includeUnknown && semanticSomeEffectPathCandidate(binding.escapedPaths, path, (effect) => matches(effect) && !superseded(effect))) return undefined;
			const sources = [];
			const sourceKeys = new WeakMap();
			const captureIds = new WeakMap();
			let nextCaptureId = 0;
			const appendSource = (source) => {
				const captures = semanticNormalizeCapturedSelections(source.capturedSelections)?.map(({ at, depth, ownEnumerable }) => {
					let id = captureIds.get(at);
					if (id === undefined) {
						id = nextCaptureId++;
						captureIds.set(at, id);
					}
					return [
						id,
						depth,
						ownEnumerable
					];
				});
				const key = JSON.stringify([source.path, captures]);
				const keys = sourceKeys.get(source.node) ?? new Set();
				if (keys.has(key)) return;
				keys.add(key);
				sourceKeys.set(source.node, keys);
				sources.push(source);
			};
			for (const effect of writes) {
				if (!retainEligibility && superseded(effect)) continue;
				if (!t.isAssignmentExpression(effect.node) || ![
					"=",
					"||=",
					"&&=",
					"??="
				].includes(effect.node.operator)) {
					if (includeUnknown) return undefined;
					continue;
				}
				if (effect.assignedSources === undefined) {
					if (includeUnknown) return undefined;
					continue;
				}
				const remaining = path.slice(effect.path.length);
				for (const source of effect.assignedSources) {
					if (semanticReferenceIterationUnknown(source, state)) return undefined;
					if (semanticReferenceSourcesInactive(source, state)) continue;
					const [key, ...suffix] = remaining;
					for (const choice of key === undefined ? [undefined] : semanticAliasSelectionChoices(key)) {
						const selection = semanticStoredSourceSelection(source, choice === undefined ? [] : [choice]);
						if (selection !== null) appendSource({
							node: source.node,
							path: [...selection.projection, ...suffix],
							...selection.capturedSelectionDepth === undefined ? {} : { capturedSelections: [{
								at: source.node,
								depth: selection.capturedSelectionDepth,
								...selection.ownEnumerable ? { ownEnumerable: true } : {}
							}] }
						});
					}
				}
			}
			const storedSources = [...sources];
			if (!retainEligibility && replacement !== undefined) return {
				sources,
				storedSources,
				retainsOrigin: false
			};
			for (const initializer of read.binding.initializers) {
				if (semanticReferenceIterationUnknown(initializer, state)) return undefined;
				if (semanticReferenceSourcesInactive(initializer, state)) continue;
				appendSource({
					node: initializer.node,
					path: [...initializer.projection, ...path]
				});
			}
			for (const initializer of read.binding.referenceInitializers) {
				if (semanticReferenceIterationUnknown(initializer, state)) return undefined;
				if (semanticReferenceSourcesInactive(initializer, state)) continue;
				const [key, ...suffix] = path;
				for (const choice of key === undefined ? [undefined] : semanticAliasSelectionChoices(key)) {
					const projection = semanticCopiedReferencePath(initializer, choice === undefined ? [] : [choice], "identity");
					if (projection !== null) appendSource({
						node: initializer.node,
						path: [...projection, ...suffix],
						capturedSelections: initializer.copyProjectionOffset === undefined ? [] : [{
							at: initializer.node,
							depth: projection.length + suffix.length - path.length + 1,
							...initializer.copyKind === "object-rest" ? { ownEnumerable: true } : {}
						}]
					});
				}
			}
			return {
				sources,
				storedSources,
				retainsOrigin: true
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticReturnedReferences.js
var createSemanticReturnedReferences, selectObjectTargets, objectTargetIndex;
function init_javascriptSemanticReturnedReferences() {
	return (init_javascriptSemanticReturnedReferences = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticCallableResults();
		init_javascriptIntrinsicInvocation();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticReferenceSources();
		init_javascriptSemanticObjectReferences();
		init_javascriptSemanticProjectedSources();
		init_javascriptSemanticResourceLimits();
		init_javascriptSemanticPropertyPaths();
		init_javascriptSemanticAliasSelections();
		init_javascriptSemanticState();
		createSemanticReturnedReferences = (state, consumption = "potential-reference") => {
			const results = new WeakMap();
			const objectTargets = new WeakMap();
			return (callee, invocation) => {
				const existing = results.get(callee);
				if (existing !== undefined && existing.invocation === invocation && existing.iterationUnknown === state.arrayIterationUnknown && existing.ambientWrites === state.ambientWriteEffects.length && existing.dependencies.every(({ binding, writes, escapes }) => binding.memberWrites.length === writes && binding.escapedPaths.length === escapes)) return existing.result;
				const dependencies = new Map();
				const functions = new Set();
				const work = [];
				const projectionDepths = new WeakMap();
				const expanded = new WeakMap();
				let additionalContexts = 0;
				let contextsWidened = false;
				const result = {
					references: [],
					callables: functions,
					precision: "exact"
				};
				const nativeArrayIteration = (array) => semanticKnownArrayIterationAt(array, state);
				const sourceInvocation = invocation === undefined ? undefined : javaScriptSourceInvocationContext(invocation, nativeArrayIteration);
				const sourceGenericInvocation = invocation !== undefined && javaScriptGenericInvocationMethod(invocation.callee) !== undefined;
				const inheritedInvocationChanged = (method) => {
					if (invocation === undefined) return false;
					const inheritedPath = [
						"global",
						"Function",
						"prototype",
						method
					];
					return state.ambientWriteEffects.some((effect) => effect.path.length <= inheritedPath.length && effect.path.every((key, index) => key === null || semanticPropertyPathKeyMatches(key, inheritedPath[index] ?? "")) && semanticEffectTiming(invocation, effect.node, state) !== "after");
				};
				const selections = new SemanticAliasSelections(() => {
					state.valueResourceLimits.add("alias-selections");
					result.precision = "widened";
				});
				const enqueue = (node, path, readAt, capturedSelections, invocationContext) => {
					const source = unwrapJavaScriptExpression(node).node;
					if (contextsWidened) {
						path = undefined;
						capturedSelections = undefined;
						invocationContext = undefined;
					}
					const invocationKey = () => invocationContext === undefined ? null : [
						invocationContext.receiver?.start,
						invocationContext.receiver?.end,
						invocationContext.receiverUnknown,
						invocationContext.arguments?.map((argument) => [argument.start, argument.end])
					];
					let readKey = JSON.stringify([
						readAt?.start ?? -1,
						readAt?.end ?? -1,
						invocationKey()
					]);
					const depths = projectionDepths.get(source) ?? new Map();
					projectionDepths.set(source, depths);
					if (!depths.has(readKey)) {
						depths.set(readKey, path?.length);
					} else {
						const previous = depths.get(readKey);
						if (previous === undefined || previous !== path?.length) {
							if (previous !== undefined) result.precision = "widened";
							depths.set(readKey, undefined);
							path = undefined;
						}
					}
					if (path !== undefined) path = selections.normalize(source, path);
					capturedSelections = path === undefined ? undefined : semanticNormalizeCapturedSelections(capturedSelections, path.length);
					const expansionKey = () => JSON.stringify([
						readKey,
						path ?? null,
						capturedSelections?.map(({ at, depth, ownEnumerable }) => [
							at.start,
							at.end,
							depth,
							ownEnumerable
						])
					]);
					let key = expansionKey();
					const paths = expanded.get(source) ?? new Set();
					if (paths.has(key)) return;
					if (!contextsWidened && (capturedSelections !== undefined || invocationContext !== undefined) && paths.size > 0 && ++additionalContexts > 512) {
						contextsWidened = true;
						state.valueResourceLimits.add("alias-selections");
						result.precision = "widened";
						if (sourceInvocation !== undefined) {
							if (sourceInvocation.receiver !== undefined) enqueue(sourceInvocation.receiver, undefined);
							for (const argument of sourceInvocation.arguments ?? []) if (t.isExpression(argument)) enqueue(argument, undefined);
							else if (t.isSpreadElement(argument)) enqueue(argument.argument, undefined);
						}
					}
					if (contextsWidened) {
						path = undefined;
						capturedSelections = undefined;
						invocationContext = undefined;
						readKey = JSON.stringify([
							readAt?.start ?? -1,
							readAt?.end ?? -1,
							null
						]);
						if (sourceGenericInvocation) result.unresolvedInvocation = true;
						depths.set(readKey, undefined);
						key = expansionKey();
						if (paths.has(key)) return;
					}
					paths.add(key);
					expanded.set(source, paths);
					work.push({
						node: source,
						path,
						...readAt === undefined ? {} : { readAt },
						...capturedSelections === undefined ? {} : { capturedSelections },
						...invocationContext === undefined ? {} : { invocation: invocationContext }
					});
				};
				enqueue(callee, [], undefined, undefined, sourceInvocation);
				while (work.length > 0) {
					const current = work.pop();
					if (current === undefined) break;
					const { node } = current;
					if (current.invocation !== undefined && current.path?.length === 0 && (t.isObjectExpression(node) || t.isArrayExpression(node))) continue;
					const pending = [];
					if (t.isIdentifier(node)) {
						const binding = resolveSemanticBindingState(state, node, node.name);
						if (binding === undefined) {
							if (sourceGenericInvocation && current.path?.length === 0) result.unresolvedInvocation = true;
							continue;
						}
						dependencies.set(binding, {
							writes: binding.memberWrites.length,
							escapes: binding.escapedPaths.length
						});
						if (current.path !== undefined) {
							if (sourceGenericInvocation && current.path.length > 0 && semanticProjectedSourcesAtRead(binding, node, current.path, state, true, invocation !== undefined && current.readAt === unwrapJavaScriptExpression(invocation.callee).node ? invocation : current.readAt ?? node, current.capturedSelections) === undefined) result.unresolvedInvocation = true;
							const selectedSources = semanticProjectedSourcesAtRead(binding, node, current.path, state, false, current.readAt ?? node, current.capturedSelections);
							if (selectedSources !== undefined) {
								for (const source of selectedSources) {
									const capturedSelections = [...semanticShiftCapturedSelections(current.capturedSelections, source.path.length - current.path.length) ?? [], ...source.capturedSelections ?? []];
									pending.push({
										...source,
										...current.path.length === 0 ? {} : { readAt: current.readAt ?? node },
										...capturedSelections.length === 0 ? {} : { capturedSelections }
									});
								}
								for (let index = pending.length - 1; index >= 0; index--) {
									const child = pending[index];
									if (child !== undefined) enqueue(child.node, child.path, child.readAt, child.capturedSelections, child.invocation ?? current.invocation);
								}
								continue;
							}
							result.precision = "widened";
							if (sourceGenericInvocation) result.unresolvedInvocation = true;
						}
						const selected = semanticBindingAtRead(binding, node, state).binding;
						for (const initializer of [...selected.initializers, ...selected.referenceInitializers]) {
							if (semanticReferenceSourcesInactive(initializer, state)) continue;
							pending.push({
								node: initializer.node,
								path: current.path === undefined ? undefined : [...initializer.projection, ...current.path],
								...current.path?.length === 0 ? {} : { readAt: current.readAt ?? node },
								...current.capturedSelections === undefined ? {} : { capturedSelections: semanticShiftCapturedSelections(current.capturedSelections, initializer.projection.length) }
							});
						}
						if (current.path === undefined) {
							for (const effect of binding.memberWrites) for (const source of effect.assignedSources ?? []) if (!semanticReferenceSourcesInactive(source, state)) pending.push({
								node: source.node,
								path: undefined
							});
						}
					} else if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
						const path = [];
						let receiver = node;
						while (t.isMemberExpression(receiver) || t.isOptionalMemberExpression(receiver)) {
							path.push(semanticStaticPropertyKey(receiver.property, receiver.computed));
							receiver = unwrapJavaScriptExpression(receiver.object).node;
						}
						pending.push({
							...current,
							node: receiver,
							readAt: current.readAt ?? node,
							...current.capturedSelections === undefined ? {} : { capturedSelections: semanticShiftCapturedSelections(current.capturedSelections, path.length) },
							path: current.path === undefined ? undefined : [...path.reverse(), ...current.path]
						});
					} else if (t.isConditionalExpression(node) || t.isLogicalExpression(node)) {
						pending.push({
							...current,
							node: t.isConditionalExpression(node) ? node.consequent : node.left
						}, {
							...current,
							node: t.isConditionalExpression(node) ? node.alternate : node.right
						});
					} else if (t.isSequenceExpression(node)) {
						const last = node.expressions.at(-1);
						if (last !== undefined) pending.push({
							...current,
							node: last
						});
					} else if (t.isFunction(node)) {
						if (current.path === undefined || current.path.length === 0) functions.add(node);
						else if (current.invocation !== undefined && current.path.every((key) => semanticAliasSelectionChoices(key).every((choice) => choice === "call" || choice === "apply"))) {
							const methods = semanticAliasSelectionChoices(current.path.at(-1)).filter((method) => method === "call" || method === "apply");
							for (const method of methods) {
								const selected = resolveJavaScriptGenericInvocation(method, current.invocation, nativeArrayIteration);
								if (selected !== undefined) pending.push({
									node: selected.callable,
									path: [],
									invocation: selected.context
								});
								else if (current.invocation.receiverUnknown) result.unresolvedInvocation = true;
								if (inheritedInvocationChanged(method)) result.unresolvedInvocation = true;
							}
						}
					} else if (t.isObjectExpression(node)) selectObjectTargets(node, current, pending, objectTargets);
					else if (t.isArrayExpression(node)) {
						const [key, ...path] = current.path ?? [];
						if (current.path !== undefined && key !== undefined) {
							for (const choice of semanticAliasSelectionChoices(key)) for (const source of semanticArrayPropertyReferences(node, [choice])) {
								let projection = source.path;
								if (source.capturedSelectionAt !== undefined && !semanticKnownArrayIteration(semanticSelectedReferenceSlot({
									node: source.node,
									projection: []
								}, state, source.capturedSelectionAt)?.value, state)) projection = [null, ...source.path.slice(1)];
								const selectedPath = [...projection, ...path];
								pending.push({
									...current,
									node: source.node,
									path: selectedPath,
									capturedSelections: [...semanticShiftCapturedSelections(current.capturedSelections, selectedPath.length - current.path.length) ?? [], ...source.capturedSelectionAt === undefined ? [] : [{
										at: source.capturedSelectionAt,
										depth: 1
									}]]
								});
							}
							for (let index = pending.length - 1; index >= 0; index--) {
								const child = pending[index];
								if (child !== undefined) enqueue(child.node, child.path, child.readAt, child.capturedSelections, child.invocation ?? current.invocation);
							}
							continue;
						}
						let uncertainOffset = false;
						node.elements.forEach((element, offset) => {
							if (element === null) return;
							if (t.isSpreadElement(element)) {
								uncertainOffset = true;
								pending.push({
									...current,
									node: element.argument,
									path: current.path === undefined ? undefined : [null, ...path],
									capturedSelections: [...current.capturedSelections ?? [], {
										at: element.argument,
										depth: 1
									}]
								});
							} else if (current.path === undefined || key === undefined || uncertainOffset || semanticAliasSelectionChoices(key).some((choice) => semanticPropertyPathKeyMatches(choice, String(offset)))) pending.push({
								...current,
								node: element,
								path: current.path === undefined ? undefined : path,
								capturedSelections: semanticShiftCapturedSelections(current.capturedSelections, -1) ?? []
							});
						});
					} else if (t.isNewExpression(node)) pending.push({
						...current,
						node: node.callee
					});
					else if (t.isClass(node)) {
						const [key, ...path] = current.path ?? [];
						for (const member of node.body.body) {
							if (t.isClassMethod(member)) {
								if ((current.path === undefined || current.path.length === 0) && member.kind === "constructor" || current.path === undefined || key !== undefined && semanticAliasSelectionChoices(key).some((choice) => {
									const name = semanticStaticPropertyKey(member.key, member.computed);
									return name === null || semanticPropertyPathKeyMatches(choice, name);
								})) pending.push({
									...current,
									node: member,
									path: current.path === undefined ? undefined : path,
									capturedSelections: semanticShiftCapturedSelections(current.capturedSelections, -1)
								});
							} else if (t.isClassProperty(member) && member.value !== null && member.value !== undefined && (key !== undefined || current.path === undefined) && (current.path === undefined || key !== undefined && semanticAliasSelectionChoices(key).some((choice) => {
								const name = semanticStaticPropertyKey(member.key, member.computed);
								return name === null || semanticPropertyPathKeyMatches(choice, name);
							}))) pending.push({
								...current,
								node: member.value,
								path: current.path === undefined ? undefined : path,
								capturedSelections: semanticShiftCapturedSelections(current.capturedSelections, -1)
							});
						}
						if (node.superClass !== null && node.superClass !== undefined) pending.push({
							...current,
							node: node.superClass
						});
					}
					for (let index = pending.length - 1; index >= 0; index--) {
						const child = pending[index];
						if (child !== undefined) enqueue(child.node, child.path, child.readAt, child.capturedSelections, child.invocation ?? current.invocation);
					}
				}
				const output = [...functions].flatMap((callable) => {
					const resultKind = semanticCallableResultKind(callable);
					if (consumption !== "potential-reference" && (resultKind === "iterator" || resultKind === "async-iterator" || consumption === "direct-call" && resultKind === "promise")) return [];
					return semanticCallableResultExpressions(callable).flatMap(({ node, delegated, kind }) => node === null || consumption !== "potential-reference" && kind !== "return" ? [] : [{
						node,
						projection: delegated ? [null] : []
					}]);
				});
				result.references = output;
				results.set(callee, {
					result,
					invocation,
					iterationUnknown: state.arrayIterationUnknown,
					ambientWrites: state.ambientWriteEffects.length,
					dependencies: [...dependencies].map(([binding, counts]) => ({
						binding,
						...counts
					}))
				});
				if (result.precision === "widened") state.returnedReferenceWidenings.add(callee);
				return result;
			};
		};
		selectObjectTargets = (node, item, pending, indexes) => {
			const [key, ...path] = item.path ?? [];
			const childPath = item.path === undefined ? undefined : path;
			if (key !== null && typeof key === "object" && "alternatives" in key) {
				for (const choice of semanticAliasSelectionChoices(key)) selectObjectTargets(node, {
					...item,
					path: [choice, ...path]
				}, pending, indexes);
				return;
			}
			if (key !== null && key !== undefined && typeof key !== "object") {
				const index = objectTargetIndex(node, indexes);
				const property = index.propertyByName.get(String(key));
				if (property !== undefined) {
					const unknowns = [];
					for (let unknown = index.trailingUnknownsByProperty.get(property); unknown !== undefined; unknown = unknown.previous) unknowns.push(unknown);
					for (const { node: unknown } of unknowns.reverse()) pending.push({
						...item,
						node: t.isSpreadElement(unknown) ? unknown.argument : t.isObjectProperty(unknown) ? unknown.value : unknown,
						...t.isSpreadElement(unknown) ? {} : { path: childPath },
						capturedSelections: t.isSpreadElement(unknown) ? [...item.capturedSelections ?? [], {
							at: unknown.argument,
							depth: 1,
							ownEnumerable: true
						}] : semanticShiftCapturedSelections(item.capturedSelections, -1) ?? []
					});
					pending.push({
						...item,
						node: t.isObjectProperty(property) ? property.value : property,
						path: childPath,
						capturedSelections: semanticShiftCapturedSelections(item.capturedSelections, -1) ?? []
					});
					return;
				}
			}
			let replaced = false;
			for (const property of [...node.properties].reverse()) {
				if (replaced) break;
				if (t.isSpreadElement(property)) {
					pending.push({
						...item,
						node: property.argument,
						capturedSelections: [...item.capturedSelections ?? [], {
							at: property.argument,
							depth: 1,
							ownEnumerable: true
						}]
					});
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (key !== null && key !== undefined && name !== null && !semanticPropertyPathKeyMatches(key, name)) continue;
				if (t.isObjectProperty(property)) pending.push({
					...item,
					node: property.value,
					path: childPath,
					capturedSelections: semanticShiftCapturedSelections(item.capturedSelections, -1) ?? []
				});
				else pending.push({
					...item,
					node: property,
					path: childPath,
					capturedSelections: semanticShiftCapturedSelections(item.capturedSelections, -1) ?? []
				});
				if (key !== null && key !== undefined && typeof key !== "object" && name === String(key)) replaced = true;
			}
		};
		objectTargetIndex = (node, indexes) => {
			const existing = indexes.get(node);
			if (existing !== undefined) return existing;
			const propertyByName = new Map();
			const trailingUnknownsByProperty = new Map();
			let trailingUnknown;
			for (const property of [...node.properties].reverse()) {
				if (t.isSpreadElement(property)) {
					trailingUnknown = {
						node: property,
						previous: trailingUnknown
					};
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === null) {
					trailingUnknown = {
						node: property,
						previous: trailingUnknown
					};
					continue;
				}
				if (propertyByName.has(name)) continue;
				propertyByName.set(name, property);
				if (trailingUnknown !== undefined) trailingUnknownsByProperty.set(property, trailingUnknown);
			}
			const created = {
				propertyByName,
				trailingUnknownsByProperty
			};
			indexes.set(node, created);
			return created;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticAmbientWrites.js
/**
* Index source-local writes through ambient identities and stable aliases.
* The shared invocation owner resolves intrinsic aliases, bind/call/apply and
* literal argument spreads. Runtime reachability and arbitrary call effects
* remain unevaluated; a visible possible write is sufficient.
*/
function* indexJavaScriptAmbientWritesSteps(program, state, observeOpaqueInvocation, observeWriteSite) {
	const ambientReads = createAmbientPathResolver(state, false);
	const browserReceiverMethods = new Set();
	const storedSites = new WeakSet();
	const storedReferences = [];
	const writes = [];
	const targets = [];
	const escapes = [];
	const stores = new WeakMap();
	const interop = createSemanticModuleInterop(state, { intrinsicPath: (node) => {
		const [path] = ambientReads(node).paths;
		return path?.[0] === "global" && path.every((key) => key !== null) ? ["intrinsic", ...path.slice(1)] : undefined;
	} });
	const ambientWrites = createAmbientPathResolver(state, true, {
		stores,
		freshObject: interop.isFreshObject,
		prototypeTarget: (node) => {
			if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return undefined;
			const invocation = interop.intrinsicInvocation(node);
			if (invocation?.kind !== "known" || invocation.path.length !== 3 || !["Object", "Reflect"].includes(invocation.path[1] ?? "") || invocation.path[2] !== "getPrototypeOf") return undefined;
			const target = invocation.arguments?.[0];
			return t.isNode(target) && !t.isSpreadElement(target) ? target : undefined;
		}
	});
	yield* collectJavaScriptIdentityWritesSteps(program, state.erasedSyntaxNodes, (root, kind, writeSite) => {
		if (kind === "opaque-call") return [];
		observeWriteSite?.(writeSite);
		if (kind === "binding") return t.isIdentifier(root) && isUnshadowedGlobal(root, state, root.name) ? [["global", root.name]] : [];
		if (!storedSites.has(writeSite)) {
			storedSites.add(writeSite);
			for (const source of semanticIterationSources(writeSite, state.parentsByNode.get(writeSite) ?? null)) {
				if (source.kind === "reference-store") storedReferences.push(source);
			}
		}
		const id = targets.push({
			node: root,
			capture: writeSite
		}) - 1;
		return [["pending-target", String(id)]];
	}, interop.intrinsicInvocation, interop.staticString, interop.isFreshObject, (node, path) => {
		writes.push({
			node,
			path
		});
	}, (node, invocation) => {
		observeOpaqueInvocation?.(node);
		const retainEscape = (target, browserReceiver = false) => {
			escapes.push({
				target,
				node,
				browserReceiver
			});
		};
		for (const argument of t.isTaggedTemplateExpression(node) ? node.quasi.expressions : node.arguments) if (t.isNode(argument)) retainEscape(t.isSpreadElement(argument) ? argument.argument : argument);
		const callee = unwrapJavaScriptExpression(t.isTaggedTemplateExpression(node) ? node.tag : node.callee).node;
		const browserMethod = invocation?.kind === "known" && invocation.path.length === 2 && ["open", "fetch"].includes(invocation.path[1] ?? "") ? invocation.path[1] : undefined;
		if (!t.isNewExpression(node) && (t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && !(invocation?.kind === "known" && ["Object", "Reflect"].includes(invocation.path[1] ?? ""))) {
			if (browserMethod !== undefined) browserReceiverMethods.add(browserMethod);
			retainEscape(callee.object, browserMethod !== undefined);
		}
	});
	const pendingStores = new Set(storedReferences);
	const dependents = new WeakMap();
	while (pendingStores.size > 0) {
		const source = pendingStores.values().next().value;
		if (source === undefined) break;
		pendingStores.delete(source);
		if (source.target === undefined) continue;
		const identities = new Map();
		ambientWrites(source.target, source.mutation, false, [], (node, path) => {
			identities.set(node, identities.has(node) ? joinAmbientProjection(identities.get(node), path) : path);
		});
		for (const [node, path] of identities) {
			const users = dependents.get(node) ?? new Map();
			users.set(source, path);
			dependents.set(node, users);
		}
		for (const [node, path] of identities) {
			const entries = stores.get(node) ?? new Map();
			const previous = entries.get(source);
			const joined = entries.has(source) ? joinAmbientProjection(previous, path) : path;
			if (entries.has(source) && (previous === undefined || joined !== undefined && previous.every((key, index) => key === joined[index]))) continue;
			entries.set(source, joined);
			stores.set(node, entries);
			for (const [dependent, reached] of dependents.get(node) ?? []) {
				const stored = storedValueProjection(reached, source, joined, false);
				if (stored !== null && stored?.length !== 0) pendingStores.add(dependent);
			}
		}
		yield;
	}
	for (const source of storedReferences) {
		if (source.target === undefined) continue;
		const receiver = ambientWrites(source.target.object, source.mutation);
		if (receiver.ownership !== "local") {
			state.escapingReferenceStores.add(source.target);
			escapes.push({
				node: source.mutation,
				target: source.node,
				browserReceiver: false,
				projection: source.projection.map((key) => key === null || typeof key === "object" ? null : String(key))
			});
		}
	}
	for (const { node, path } of writes) {
		const target = path[0] === "pending-target" ? targets[Number(path[1])] : undefined;
		const paths = target === undefined ? [path] : ambientWrites(target.node, target.capture).paths.map((identity) => [...identity, ...path.slice(2)]);
		for (const resolved of paths) {
			retainSemanticAmbientEffect(state, "write", resolved, node);
		}
	}
	const resolverReceivers = [];
	for (const effect of escapes) {
		const { node, target } = effect;
		const callee = t.isCallExpression(node) || t.isOptionalCallExpression(node) ? unwrapJavaScriptExpression(node.callee).node : undefined;
		if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && callee.object === target && t.isIdentifier(target, { name: "require" }) && isUnshadowedGlobal(target, state, "require") && semanticStaticPropertyKey(callee.property, callee.computed) === "resolve") {
			resolverReceivers.push(effect);
			continue;
		}
		retainEscapeEffect(effect);
	}
	for (const effect of resolverReceivers) {
		const { node } = effect;
		if ((t.isCallExpression(node) || t.isOptionalCallExpression(node)) && !state.ambientWrites.covers([
			"global",
			"require",
			"resolve"
		]) && !state.ambientEscapes.covers([
			"global",
			"require",
			"resolve"
		]) && readSemanticRequireLoader(node, state, new Set()) === "commonjs-loader") continue;
		retainEscapeEffect(effect);
	}
	function retainEscapeEffect({ node, target, browserReceiver, projection }) {
		const resolved = ambientWrites(target, node, true, projection);
		if (browserReceiver && resolved.ownership === "ambient" && resolved.paths.length > 0 && resolved.paths.every((path) => path.length === 1 && path[0] === "global")) state.retainedGlobalCallReceivers.add(target);
		for (const path of resolved.paths) if (!(browserReceiver && path.length === 1 && path[0] === "global")) {
			retainSemanticAmbientEffect(state, "escape", path, node);
		}
	}
	if ([...browserReceiverMethods].some((method) => state.ambientWrites.covers(["global", method]))) state.ambientEscapes.retain(["global", null]);
}
var canonicalAmbientPath, retainedAmbientEffects, retainSemanticAmbientEffect, storedValueProjection, joinAmbientProjection, createAmbientPathResolver, createGlobalReferenceReader;
function init_javascriptSemanticAmbientWrites() {
	return (init_javascriptSemanticAmbientWrites = __esmMin((() => {
		init_javascriptSourceParser();
		init_javascriptAstValues();
		init_javascriptElectronMemberWrites();
		init_javascriptModuleInterop();
		init_javascriptSemanticState();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticIterationSources();
		init_javascriptSemanticPropertyPaths();
		init_javascriptSemanticReturnedReferences();
		init_javascriptSemanticGlobalReference();
		init_javascriptSemanticRequireOriginSlot();
		init_javascriptSemanticReferenceSources();
		init_javascriptSemanticCopiedReferencePaths();
		canonicalAmbientPath = (path) => {
			if (path[0] !== "global") return path;
			let firstProperty = 1;
			while (GLOBAL_OBJECT_NAMES.includes(path[firstProperty] ?? "")) firstProperty += 1;
			return ["global", ...path.slice(firstProperty)];
		};
		retainedAmbientEffects = new WeakMap();
		retainSemanticAmbientEffect = (state, kind, path, node) => {
			const selected = kind === "escape" ? [...path, null] : path;
			const byNode = retainedAmbientEffects.get(state) ?? new Map();
			const keys = byNode.get(node) ?? new Set();
			const key = JSON.stringify([kind, selected]);
			if (keys.has(key)) return false;
			keys.add(key);
			byNode.set(node, keys);
			retainedAmbientEffects.set(state, byNode);
			if (kind === "write") {
				state.ambientWrites.retain(selected);
				state.ambientWriteEffects.push({
					path: selected,
					node
				});
			} else {
				state.ambientEscapes.retain(selected);
				state.ambientEscapeEffects.push({
					path: selected,
					node
				});
			}
			return true;
		};
		storedValueProjection = (suffix, source, path, escapedContents) => {
			if (suffix !== undefined && path !== undefined && (!path.every((key, index) => index >= suffix.length || key === null || suffix[index] === null || key === suffix[index]) || suffix.length < path.length && !escapedContents)) return null;
			return suffix === undefined || path === undefined ? undefined : [...source.projection.map((key) => key === null || typeof key === "object" ? null : String(key)), ...suffix.slice(path.length)];
		};
		joinAmbientProjection = (left, right) => left === undefined || right === undefined || left.length !== right.length ? undefined : left.map((key, index) => key === right[index] ? key : null);
		createAmbientPathResolver = (state, possibleWrites, facts) => {
			const cached = new WeakMap();
			const returnedReferences = createSemanticReturnedReferences(state);
			return (node, capture, escapedContents = false, projection = [], receiver) => {
				const prior = possibleWrites ? undefined : cached.get(node);
				if (prior !== undefined) return prior;
				const result = new Map();
				const callerPaths = new Map();
				let hasLocalIdentity = false;
				const unknownReasons = new Set();
				const pending = [{
					node,
					suffix: projection
				}];
				const queue = (item) => {
					if (receiver !== undefined && item.suffix?.length === 0) return;
					pending.push(item);
				};
				const expanded = new WeakMap();
				const retain = (path) => {
					let canonical = canonicalAmbientPath(path);
					for (;;) {
						result.set(JSON.stringify(canonical), canonical);
						if (possibleWrites && canonical[0] === "global" && canonical[2] === "prototype" && canonical[3] === "constructor") {
							canonical = [
								"global",
								canonical[1] ?? null,
								...canonical.slice(4)
							];
							continue;
						}
						if (!possibleWrites || canonical[0] !== "global" || canonical[1] !== null) break;
						canonical = canonicalAmbientPath(["global", ...canonical.slice(2)]);
					}
				};
				while (pending.length > 0) {
					const current = pending.pop();
					if (current === undefined) break;
					const queuedBefore = pending.length;
					const pathsBefore = result.size;
					let resolvedIdentity = false;
					try {
						const { root, members } = electronMemberPath(current.node);
						let suffix = current.suffix === undefined ? undefined : [...members, ...current.suffix];
						if (expanded.has(root)) {
							const previous = expanded.get(root);
							if (previous === undefined) {
								resolvedIdentity = true;
								continue;
							}
							if (suffix !== undefined && previous.length === suffix.length) {
								const joined = joinSemanticPropertyPaths(previous, suffix);
								if (joined === previous) {
									resolvedIdentity = true;
									continue;
								}
								suffix = joined;
							} else suffix = undefined;
							if (!possibleWrites) {
								const unresolved = {
									paths: [],
									callerPaths: [...callerPaths.values()],
									ownership: "unknown",
									unknownReasons: ["widened-projection"]
								};
								cached.set(node, unresolved);
								return unresolved;
							}
						}
						expanded.set(root, suffix);
						if (suffix === undefined || suffix.includes(null)) unknownReasons.add("widened-projection");
						if (suffix === undefined && !possibleWrites) continue;
						const continueWith = (node, path = suffix) => queue({
							node,
							suffix: path,
							...current.readsAtSelf && { readsAtSelf: true }
						});
						const continueReturned = (callee, path) => {
							const returned = returnedReferences(callee);
							unknownReasons.add("unresolved-call");
							for (const source of returned.references) continueWith(source.node, path === undefined ? undefined : [...source.projection.map((key) => key === null || typeof key === "object" ? null : String(key)), ...path]);
						};
						if (!t.isIdentifier(root) && facts?.freshObject(root)) {
							receiver?.(root, suffix);
							if (suffix?.length === 0) {
								hasLocalIdentity = true;
								resolvedIdentity = true;
							}
							for (const [source, path] of facts?.stores.get(root) ?? []) {
								const stored = storedValueProjection(suffix, source, path, escapedContents);
								if (stored === null) continue;
								queue({
									node: source.node,
									readsAtSelf: true,
									suffix: stored
								});
							}
						}
						if (t.isMetaProperty(root) && root.meta.name === "import" && root.property.name === "meta") {
							retain(["import-meta", ...suffix ?? []]);
							resolvedIdentity = true;
							continue;
						}
						if (t.isThisExpression(root)) {
							const owner = javaScriptThisOwner(root, state.program, state.parentsByNode);
							if (owner === "global") {
								retain(["global", ...suffix ?? []]);
								resolvedIdentity = true;
								continue;
							}
							if (owner === "caller" && suffix !== undefined) {
								const path = canonicalAmbientPath(["global", ...suffix]);
								callerPaths.set(JSON.stringify(path), path);
							}
						}
						if (t.isIdentifier(root)) {
							if (isUnshadowedGlobal(root, state, "module")) {
								retain(["commonjs-module", ...suffix ?? []]);
								resolvedIdentity = true;
								continue;
							}
							if (globalObjectName(root, state) !== undefined) {
								retain(["global", ...suffix ?? []]);
								resolvedIdentity = true;
								continue;
							}
							if (isUnshadowedGlobal(root, state, root.name)) {
								retain([
									"global",
									root.name,
									...suffix ?? []
								]);
								resolvedIdentity = true;
								continue;
							}
							const binding = resolveSemanticBindingState(state, root, root.name);
							if (binding === undefined) continue;
							const stable = possibleWrites ? undefined : semanticStableInitializer(binding, state);
							const readAt = current.readsAtSelf ? root : capture;
							const atRead = possibleWrites && readAt !== undefined ? semanticBindingAtRead(binding, readAt, state) : undefined;
							const selected = atRead?.binding ?? binding;
							if (possibleWrites && atRead?.hasDefiniteInitializer === false) unknownReasons.add("unresolved-value");
							const initializers = possibleWrites ? [...selected.initializers, ...selected.referenceInitializers] : stable === undefined ? [] : [stable];
							for (const initializer of initializers) {
								if (semanticReferenceSourcesInactive(initializer, state)) continue;
								const path = semanticCopiedReferencePath(initializer, suffix ?? [null], escapedContents ? "escape" : "identity");
								if (path === null) continue;
								queue({
									node: initializer.node,
									readsAtSelf: true,
									suffix: suffix === undefined || semanticReferenceIterationUnknown(initializer, state) ? undefined : path.map((key) => key === null || typeof key === "object" ? null : String(key))
								});
							}
							continue;
						}
						if (possibleWrites && t.isNewExpression(root) && (suffix?.[0] === "__proto__" || suffix?.[0] === "constructor")) {
							continueWith(root.callee, suffix[0] === "__proto__" ? ["prototype", ...suffix.slice(1)] : suffix.slice(1));
							continue;
						}
						const prototypeTarget = possibleWrites ? facts?.prototypeTarget(root) : undefined;
						if (prototypeTarget !== undefined) {
							continueWith(prototypeTarget, suffix === undefined ? undefined : ["__proto__", ...suffix]);
							continue;
						}
						if (possibleWrites && (t.isCallExpression(root) || t.isOptionalCallExpression(root) || t.isNewExpression(root) || t.isTaggedTemplateExpression(root) || escapedContents && (t.isFunction(root) || t.isClass(root)))) {
							continueReturned(t.isFunction(root) || t.isClass(root) ? root : t.isTaggedTemplateExpression(root) ? root.tag : root.callee, suffix);
							continue;
						}
						if (possibleWrites && t.isConditionalExpression(root)) {
							continueWith(root.consequent);
							continueWith(root.alternate);
							continue;
						}
						if (possibleWrites && t.isLogicalExpression(root)) {
							continueWith(root.left);
							continueWith(root.right);
							continue;
						}
						if (possibleWrites && t.isSequenceExpression(root)) {
							const value = root.expressions.at(-1);
							if (value !== undefined) continueWith(value);
							continue;
						}
						if (possibleWrites && t.isAssignmentExpression(root) && root.operator === "=") {
							continueWith(root.right);
							continue;
						}
						const key = suffix?.[0];
						if (escapedContents && suffix?.length === 0) {
							if (t.isObjectExpression(root)) {
								for (const property of root.properties) if (t.isSpreadElement(property)) continueWith(property.argument, [null]);
								else if (t.isObjectProperty(property) && t.isExpression(property.value)) continueWith(property.value, []);
								else if (t.isObjectMethod(property) && property.kind === "get") continueReturned(property, []);
								continue;
							}
							if (t.isArrayExpression(root)) {
								for (const element of root.elements) if (t.isSpreadElement(element)) continueWith(element.argument, []);
								else if (t.isExpression(element)) continueWith(element, []);
								continue;
							}
						}
						if (suffix !== undefined && key === undefined) continue;
						if (t.isObjectExpression(root)) {
							if (possibleWrites) {
								for (const property of root.properties) {
									if (t.isSpreadElement(property)) continueWith(property.argument);
									else if (t.isObjectProperty(property) && t.isExpression(property.value) || t.isObjectMethod(property) && property.kind === "get") {
										const ownKey = semanticStaticPropertyKey(property.key, property.computed);
										if (suffix === undefined || key === null || ownKey === null || ownKey === key) {
											if (t.isObjectMethod(property)) continueReturned(property, suffix?.slice(1));
											else if (t.isExpression(property.value)) continueWith(property.value, suffix?.slice(1));
										}
									}
								}
							} else if (suffix !== undefined && key !== null && root.properties.every((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) !== null)) {
								const property = root.properties.findLast((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === key);
								if (t.isObjectProperty(property) && t.isExpression(property.value)) continueWith(property.value, suffix.slice(1));
							}
						} else if (t.isArrayExpression(root)) {
							if (suffix === undefined) {
								for (const element of root.elements) if (t.isSpreadElement(element)) continueWith(element.argument);
								else if (t.isExpression(element)) continueWith(element);
							} else if (!root.elements.some(t.isSpreadElement)) {
								const index = Number(key);
								if (key === null && possibleWrites) {
									for (const element of root.elements) if (t.isExpression(element)) continueWith(element, suffix.slice(1));
								} else if (key !== null && Number.isInteger(index) && index >= 0 && String(index) === key) {
									const element = root.elements[index];
									if (t.isExpression(element)) continueWith(element, suffix.slice(1));
								}
							}
						}
					} finally {
						if (!resolvedIdentity && pending.length === queuedBefore && result.size === pathsBefore) unknownReasons.add("unresolved-value");
					}
				}
				const paths = [...result.values()];
				if (paths.length > 0 && hasLocalIdentity) unknownReasons.add("mixed-identities");
				const resolution = {
					paths,
					callerPaths: [...callerPaths.values()],
					ownership: unknownReasons.size > 0 ? "unknown" : paths.length > 0 ? "ambient" : hasLocalIdentity ? "local" : "unknown",
					unknownReasons: [...unknownReasons]
				};
				if (!possibleWrites) cached.set(node, resolution);
				return resolution;
			};
		};
		createGlobalReferenceReader = (state, path) => {
			const selected = ["global", ...path];
			let generation = -1;
			const byNamespace = new Map();
			const matches = (effect, target) => effect.path.length <= target.length && effect.path.every((key, index) => semanticPropertyPathKeyMatches(key, target[index]));
			return (callee) => {
				const namespace = globalReferenceNamespace(callee, state, path);
				if (namespace === undefined) return { status: "unrelated" };
				if (!state.ambientWrites.covers(selected) && (namespace === null || !state.ambientWrites.covers(["global", namespace]))) return { status: "unmodified" };
				if (generation !== state.ambientWriteEffects.length) {
					generation = state.ambientWriteEffects.length;
					byNamespace.clear();
				}
				let effects = byNamespace.get(namespace);
				if (effects === undefined) {
					effects = state.ambientWriteEffects.filter((effect) => matches(effect, selected) || namespace !== null && matches(effect, ["global", namespace]));
					byNamespace.set(namespace, effects);
				}
				if (effects.length === 0) return { status: "unknown" };
				const active = effects.filter((effect) => semanticEffectTiming(callee, effect.node, state) !== "after");
				if (active.length === 0) return { status: "unmodified" };
				if (active.some((effect) => effect.path.length !== selected.length || !effect.path.every((key, index) => key === selected[index]))) return { status: "unknown" };
				let replacement;
				for (const effect of active) {
					const write = effect.node;
					const writeNamespace = t.isAssignmentExpression(write) ? globalReferenceNamespace(write.left, state, path) : undefined;
					if (t.isAssignmentExpression(write, { operator: "=" }) && writeNamespace !== undefined && (writeNamespace === null || !state.ambientWrites.covers(["global", writeNamespace])) && semanticDefiniteEffectPrecedesReference(write, callee, state.parentsByNode) && (replacement === undefined || semanticDefiniteEffectPrecedesReference(replacement, write, state.parentsByNode))) replacement = write;
				}
				if (replacement === undefined) return { status: "unknown" };
				const confirmed = replacement;
				if (active.some((effect) => effect.node !== confirmed && semanticEffectTiming(confirmed, effect.node, state) !== "before" && (effect.node === undefined || !semanticDefiniteEffectPrecedesReference(effect.node, confirmed, state.parentsByNode)))) return { status: "unknown" };
				return {
					status: "replacement",
					value: confirmed.right
				};
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptBuiltinResourceMethods.js
var BUILTIN_RESOURCE_METHODS, BUILTIN_RESOURCE_RELEASE_METHODS, BUILTIN_RESOURCE_SPECIFIERS;
function init_javascriptBuiltinResourceMethods() {
	return (init_javascriptBuiltinResourceMethods = __esmMin((() => {
		BUILTIN_RESOURCE_METHODS = {
			fs: [
				"open",
				"openSync",
				"createReadStream",
				"createWriteStream"
			],
			"fs/promises": ["open"],
			net: ["connect", "createConnection"],
			tls: ["connect"]
		};
		BUILTIN_RESOURCE_RELEASE_METHODS = {
			"fs:open": [],
			"fs:openSync": [],
			"fs:createReadStream": ["close", "destroy"],
			"fs:createWriteStream": [
				"close",
				"destroy",
				"end"
			],
			"fs/promises:open": ["close"],
			"net:connect": ["destroy", "end"],
			"net:createConnection": ["destroy", "end"],
			"tls:connect": ["destroy", "end"]
		};
		BUILTIN_RESOURCE_SPECIFIERS = Object.keys(BUILTIN_RESOURCE_METHODS);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticRequireOrigin.js
var possibleCommonJsDelegateWriteStates, observePossibleCommonJsDelegateWrite, hasPossibleCommonJsDelegateWrite, invalidateSemanticRequireDelegateWrites, commonJsDelegateChangedAt, commonJsLoaderAt, semanticRequireLoaderAt, requireLoaderValueAt, semanticFactoryRequireLoaderAt, semanticFactoryLoaderMemberAt, isSemanticCreateRequireBinding, createRequireFactoryCallAt, sourceRelativeCreateRequireBaseAt, hasSemanticCreateRequireFactoryOrigin, isCreateRequireOrigin, assignmentValueSources, selectedRequireSourcesAt, loaderInvocationInterops, loaderInvocationInterop, semanticRequireCallAt, isWrapperRequireInitializerCall, globalProcessReplacements, moduleRequireWrites, moduleReturnedReferences, returnedLoaderReferences, loaderSourceContextKey, inheritLoaderSourceContext, loaderMemberSource, projectedLoaderSources, loaderObjectPropertySources, isCommonJsModuleObject, isCommonJsRequireDelegate, hasCommonJsModuleSource, semanticModuleRequireReceiver, semanticModuleRequireCallAt, writesModuleRequire, semanticOriginalGlobalProcessAt, semanticGlobalProcessOrigin, semanticGlobalProcessPathOrigin, semanticRequireOrigin, semanticRequireExportsIdentity, MUTABLE_BUILTIN_DEFAULTS, semanticMutableBuiltinOrigin;
function init_javascriptSemanticRequireOrigin() {
	return (init_javascriptSemanticRequireOrigin = __esmMin((() => {
		init_javascriptSemanticProjectedSources();
		init_javascriptSemanticTraversal();
		init_javascriptBuiltinResourceMethods();
		init_javascriptSourceParser();
		init_javascriptSemanticState();
		init_javascriptSemanticMutationInitializers();
		init_javascriptAstValues();
		init_javascriptSemanticPropertyPaths();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptModuleInterop();
		init_javascriptSemanticReturnedReferences();
		init_javascriptSemanticIterationSources();
		init_javascriptSemanticReferenceSources();
		init_javascriptSemanticObjectReferences();
		init_javascriptSemanticAliasSelections();
		init_javascriptSemanticResourceLimits();
		init_javascriptSemanticRequireOriginSlot();
		init_javascriptSemanticAmbientWrites();
		possibleCommonJsDelegateWriteStates = new WeakSet();
		observePossibleCommonJsDelegateWrite = (node, state) => {
			if (possibleCommonJsDelegateWriteStates.has(state)) return;
			const target = t.isAssignmentExpression(node) ? node.left : t.isUpdateExpression(node) || t.isUnaryExpression(node, { operator: "delete" }) ? node.argument : undefined;
			if (semanticIterationSources(node, state.parentsByNode.get(node) ?? null).some((source) => source.kind === "reference-store")) possibleCommonJsDelegateWriteStates.add(state);
			if ((t.isMemberExpression(target) || t.isOptionalMemberExpression(target)) && ["require", null].includes(semanticStaticPropertyKey(target.property, target.computed))) possibleCommonJsDelegateWriteStates.add(state);
			else if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) possibleCommonJsDelegateWriteStates.add(state);
		};
		hasPossibleCommonJsDelegateWrite = (state) => possibleCommonJsDelegateWriteStates.has(state);
		invalidateSemanticRequireDelegateWrites = (state) => {
			moduleRequireWrites.delete(state);
			moduleReturnedReferences.delete(state);
		};
		commonJsDelegateChangedAt = (node, state) => writesModuleRequire(state).some((write) => semanticEffectTiming(node, write, state) !== "after");
		commonJsLoaderAt = (node, state) => commonJsDelegateChangedAt(node, state) ? "unknown" : "commonjs-loader";
		semanticRequireLoaderAt = (node, state, factoryBindingIds) => {
			const callee = unwrapJavaScriptExpression(node.callee).node;
			const loader = (t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && ["resolve", "main"].includes(semanticStaticPropertyKey(callee.property, callee.computed) ?? "") ? callee.object : callee;
			const selected = selectedRequireSourcesAt(loader, node, state, factoryBindingIds)?.loader;
			return selected !== undefined && selected !== "unknown" ? selected : requireLoaderValueAt(loader, node, state, factoryBindingIds);
		};
		requireLoaderValueAt = (value, node, state, factoryBindingIds) => {
			const callee = unwrapJavaScriptExpression(value).node;
			if (!t.isIdentifier(callee)) return "local";
			const loader = callee;
			const binding = resolveSemanticBindingState(state, loader, loader.name);
			if (binding !== undefined && factoryBindingIds.has(binding.bindingId)) return semanticBindingHasPriorValueWrite(node, binding, state) ? "unknown" : "factory-loader";
			if (binding !== undefined && isSemanticCreateRequireBinding(binding, state)) return "create-require";
			if (loader.name !== "require") return "local";
			if (binding === undefined) {
				if (javaScriptRuntimeContext(state.program) === "module" || semanticResolutionBlocked(state, loader, "require")) return "unknown";
				return (state.ambientBindingWrites.get("require") ?? []).some((write) => semanticEffectTiming(node, write, state) !== "after") ? "unknown" : commonJsLoaderAt(node, state);
			}
			if (binding.hostOrigin === "commonjs-wrapper" && [...binding.declarationKinds].every((kind) => kind === "var")) {
				if (binding.definitions.some(({ kind }) => kind === "function")) return "local";
				return semanticBindingHasPriorValueWrite(node, binding, state) ? "unknown" : commonJsLoaderAt(node, state);
			}
			if ((t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node)) && isWrapperRequireInitializerCall(binding, node, state)) return commonJsLoaderAt(node, state);
			const wrapperBinding = commonJsWrapperBindingDeclaration(loader, "require", state);
			if (wrapperBinding !== undefined && !semanticBindingHasPriorValueWrite(node, wrapperBinding, state)) return commonJsLoaderAt(node, state);
			const initializer = semanticStableInitializer(binding, state)?.node;
			if ((binding.kind === "function" || binding.kind === "class") && initializer !== undefined) return "local";
			if (binding.declarationKinds.size === 1 && binding.declarationKinds.has("const") && (t.isFunctionExpression(initializer) || t.isArrowFunctionExpression(initializer))) return "local";
			return "unknown";
		};
		semanticFactoryRequireLoaderAt = (node, state, bindingIds) => {
			const callee = unwrapJavaScriptExpression(node.callee).node;
			if (t.isIdentifier(callee)) return semanticFactoryLoaderMemberAt(node, state, bindingIds, null);
			if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && semanticStaticPropertyKey(callee.property, callee.computed) === "bind") return semanticFactoryLoaderMemberAt(node, state, bindingIds, "bind");
			return undefined;
		};
		semanticFactoryLoaderMemberAt = (node, state, bindingIds, member) => {
			const callee = unwrapJavaScriptExpression(node.callee).node;
			let loader;
			if (member === null) {
				if (t.isIdentifier(callee)) loader = callee;
			} else if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && semanticStaticPropertyKey(callee.property, callee.computed) === member) {
				const root = unwrapJavaScriptExpression(callee.object).node;
				if (t.isIdentifier(root)) loader = root;
			}
			if (loader === undefined) return undefined;
			const binding = resolveSemanticBindingState(state, loader, loader.name);
			if (binding === undefined || !bindingIds.has(binding.bindingId)) return undefined;
			return semanticBindingHasPriorValueWrite(node, binding, state) ? "unknown" : "factory-loader";
		};
		isSemanticCreateRequireBinding = (binding, state) => {
			if (binding.initializers.length !== 1) return false;
			const initializer = semanticStableInitializer(binding, state)?.node;
			return createRequireFactoryCallAt(initializer, state)?.loader === "create-require";
		};
		createRequireFactoryCallAt = (initializer, state, factoryBindingIds = new Set()) => !t.isCallExpression(initializer) ? undefined : selectedRequireSourcesAt(initializer.callee, initializer, state, factoryBindingIds, "factory");
		sourceRelativeCreateRequireBaseAt = (value, state) => {
			if (value === undefined) return undefined;
			if (isUnmodifiedImportMetaUrl(value, state)) return { kind: "source-file" };
			if (!t.isNewExpression(value) || value.arguments.length !== 2) return undefined;
			const callee = unwrapJavaScriptExpression(value.callee).node;
			if (!t.isIdentifier(callee, { name: "URL" }) || !isUnmodifiedGlobalReference(callee, state, "URL") || !isUnmodifiedImportMetaUrl(t.isNode(value.arguments[1]) ? value.arguments[1] : undefined, state)) return undefined;
			const urlPath = staticSourceRelativeUrlPath(value);
			return urlPath === undefined || urlPath.directory || urlPath.path.startsWith("/") ? undefined : {
				kind: "source-relative-file",
				path: urlPath.path
			};
		};
		hasSemanticCreateRequireFactoryOrigin = (initializer, state) => {
			const factory = createRequireFactoryCallAt(initializer, state);
			return factory !== undefined && factory.loader !== "local";
		};
		isCreateRequireOrigin = (origin, selected) => {
			if (!["module", "node:module"].includes(origin.specifier)) return false;
			const path = [...origin.importedPath, ...selected];
			return path.length === 1 && path[0] === "createRequire" || (origin.resolutionMode ?? "import") === "import" && path.length === 2 && path[0] === "default" && path[1] === "createRequire";
		};
		assignmentValueSources = (node) => node.operator === "=" ? [node.right] : [
			"||=",
			"&&=",
			"??="
		].includes(node.operator) ? [node.left, node.right] : [];
		selectedRequireSourcesAt = (root, site, state, factoryBindingIds, target = "loader") => {
			const pending = [{
				node: root,
				path: []
			}];
			const seen = new WeakMap();
			let count = 0;
			let found = false;
			let loaderBinding = false;
			let selectedLoader;
			let unknown = false;
			let local = false;
			let nativeMemberAlternative = false;
			let sourceRelative = true;
			let sourceRelativeBase;
			while (pending.length > 0) {
				const current = pending.pop();
				const node = unwrapJavaScriptExpression(current.node).node;
				const genericMember = current.path.length === 1 && semanticAliasSelectionChoices(current.path[0]).every((key) => key === "call" || key === "apply");
				const nativeGenericMember = target === "loader" && genericMember && t.isIdentifier(node) && requireLoaderValueAt(node, node, state, factoryBindingIds) !== "local";
				const key = JSON.stringify([current.path, loaderSourceContextKey(current)]);
				const paths = seen.get(node) ?? new Set();
				if (paths.has(key)) continue;
				paths.add(key);
				seen.set(node, paths);
				if (++count > 512) {
					state.valueResourceLimits.add("alias-selections");
					return {
						loader: "unknown",
						sourceRelative: false
					};
				}
				if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
					pending.push(...inheritLoaderSourceContext(current, [loaderMemberSource(current, node)]));
				} else if (t.isIdentifier(node)) {
					if (target === "loader" && current.path.length === 0) {
						const captured = requireLoaderValueAt(node, node, state, factoryBindingIds);
						if (captured !== "local" && captured !== "create-require") {
							const invoked = captured === "commonjs-loader" ? commonJsLoaderAt(site, state) : captured;
							found = true;
							unknown ||= invoked === "unknown" || selectedLoader !== undefined && selectedLoader !== invoked;
							selectedLoader ??= invoked;
							continue;
						}
					}
					const binding = resolveSemanticBindingState(state, node, node.name);
					if (binding === undefined) {
						unknown = true;
						continue;
					}
					loaderBinding ||= target === "loader" && binding.initializers.some((source) => hasSemanticCreateRequireFactoryOrigin(source.node, state) || t.isIdentifier(source.node) && requireLoaderValueAt(source.node, source.node, state, factoryBindingIds) !== "local");
					const facts = semanticProjectedSourceFactsAtRead(binding, node, current.path, state, true, current.readAt ?? node, current.capturedSelections);
					if (nativeGenericMember) nativeMemberAlternative ||= facts === undefined || facts.sources.length === 0 || !facts.sources.every(({ node: source }) => {
						const value = unwrapJavaScriptExpression(source).node;
						return t.isFunctionExpression(value) || t.isArrowFunctionExpression(value);
					});
					if (target === "factory" && binding.directOrigins.length > 0) {
						const native = binding.directOrigins.some((origin) => isCreateRequireOrigin(origin, current.path));
						loaderBinding ||= native;
						if (facts?.retainsOrigin) {
							found ||= native;
							local ||= !native;
							if (native) selectedLoader = "create-require";
						}
					}
					if (facts === undefined) {
						unknown = true;
						const retained = semanticBindingAtRead(binding, node, state).binding;
						pending.push(...inheritLoaderSourceContext(current, projectedLoaderSources(current, [...retained.initializers, ...retained.referenceInitializers].filter((source) => !semanticReferenceSourcesInactive(source, state)).map((source) => ({
							node: source.node,
							path: [...source.projection, ...current.path]
						})))));
					} else {
						unknown ||= facts.sources.length === 0 && !(target === "factory" && facts.retainsOrigin && binding.directOrigins.length > 0);
						pending.push(...inheritLoaderSourceContext(current, projectedLoaderSources(current, facts.sources)));
					}
				} else if (t.isObjectExpression(node) || t.isArrayExpression(node)) {
					if (current.path.length === 0) {
						local = true;
						continue;
					}
					const sources = loaderObjectPropertySources(current, node, state);
					unknown ||= sources.length === 0;
					pending.push(...inheritLoaderSourceContext(current, sources));
				} else if (t.isSequenceExpression(node)) {
					const last = node.expressions.at(-1);
					if (last !== undefined) pending.push({
						...current,
						node: last
					});
				} else if (t.isAssignmentExpression(node)) {
					for (const source of assignmentValueSources(node)) pending.push({
						...current,
						node: source
					});
				} else if (t.isConditionalExpression(node) || t.isLogicalExpression(node)) {
					pending.push({
						...current,
						node: t.isConditionalExpression(node) ? node.consequent : node.left
					}, {
						...current,
						node: t.isConditionalExpression(node) ? node.alternate : node.right
					});
				} else if (t.isCallExpression(node)) {
					const callee = unwrapJavaScriptExpression(node.callee).node;
					if (target === "loader" && current.path.length === 0 && t.isFunction(callee)) {
						if (callee.async || callee.generator) {
							local = true;
							continue;
						}
						const returned = returnedLoaderReferences(state, "direct-call")(node.callee, node);
						unknown ||= returned.unresolvedInvocation === true || !t.isArrowFunctionExpression(callee) || t.isBlockStatement(callee.body);
						pending.push(...inheritLoaderSourceContext(current, returned.references.map((reference) => ({
							node: reference.node,
							path: reference.projection
						}))));
						continue;
					}
					if (target === "factory") {
						const origin = semanticRequireOrigin(node, state)?.origin;
						if (origin !== undefined && isCreateRequireOrigin(origin, current.path)) {
							found = true;
							selectedLoader = "create-require";
						} else unknown = true;
					} else if (current.path.length === 0 || genericMember) {
						const factory = createRequireFactoryCallAt(node, state, factoryBindingIds);
						if (factory !== undefined && factory.loader !== "local") {
							if (genericMember) {
								nativeMemberAlternative = true;
								if (factory.loader === "unknown") {
									loaderBinding = true;
									unknown = true;
								}
							} else {
								found = true;
								unknown ||= factory.loader === "unknown" || selectedLoader !== undefined && selectedLoader !== "create-require";
								selectedLoader ??= "create-require";
								unknown ||= state.conditionallySkippedExpressions.has(node);
								const factoryBase = sourceRelativeCreateRequireBaseAt(node.arguments[0], state);
								if (factoryBase === undefined) sourceRelative = false;
								else if (sourceRelativeBase === undefined) sourceRelativeBase = factoryBase;
								else if (sourceRelativeBase.kind !== factoryBase.kind || sourceRelativeBase.kind === "source-relative-file" && factoryBase.kind === "source-relative-file" && sourceRelativeBase.path !== factoryBase.path) {
									sourceRelative = false;
								}
							}
						} else if (factory?.loader === "local") local = true;
						else unknown = true;
					} else unknown = true;
				} else if (current.path.length === 0 && (t.isFunction(node) || t.isClassExpression(node) || t.isLiteral(node))) {
					local = true;
				} else {
					unknown = true;
				}
			}
			return found || local || loaderBinding && unknown ? {
				loader: unknown && (found || loaderBinding) || local && (found || nativeMemberAlternative) ? "unknown" : found ? selectedLoader ?? "unknown" : "local",
				sourceRelative: found && sourceRelative && !unknown,
				...found && !unknown && sourceRelative && sourceRelativeBase?.kind === "source-relative-file" ? { sourceRelativePath: sourceRelativeBase.path } : {}
			} : undefined;
		};
		loaderInvocationInterops = new WeakMap();
		loaderInvocationInterop = (state) => {
			const prior = loaderInvocationInterops.get(state);
			if (prior?.writes === state.ambientWriteEffects.length) return prior.interop;
			const interop = createSemanticModuleInterop(state);
			for (const effect of state.ambientWriteEffects) if (effect.path[0] === "global") interop.retainWrite(effect.node ?? state.program, ["intrinsic", ...effect.path.slice(1).map((key) => key === null || typeof key === "object" ? null : String(key))]);
			loaderInvocationInterops.set(state, {
				writes: state.ambientWriteEffects.length,
				interop
			});
			return interop;
		};
		semanticRequireCallAt = (node, state, factoryBindingIds) => {
			if (semanticModuleRequireCallAt(node, state)) return {
				operation: "load",
				loader: "unknown",
				arguments: undefined,
				sourceRelative: false
			};
			const callee = unwrapJavaScriptExpression(node.callee).node;
			if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && ["call", "apply"].includes(semanticStaticPropertyKey(callee.property, callee.computed) ?? "") && selectedRequireSourcesAt(callee, node, state, factoryBindingIds)?.loader === "local") return {
				operation: "load",
				loader: "local",
				arguments: undefined,
				sourceRelative: false
			};
			if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && semanticStaticPropertyKey(callee.property, callee.computed) === "resolve") {
				const loader = requireLoaderValueAt(callee.object, node, state, factoryBindingIds);
				if (loader === "unknown") return {
					operation: "load",
					loader,
					arguments: undefined,
					sourceRelative: false
				};
				if (loader === "commonjs-loader" || loader === "create-require") {
					const selected = selectedRequireSourcesAt(callee.object, node, state, factoryBindingIds);
					return {
						operation: "resolve",
						loader: selected?.loader ?? loader,
						arguments: node.arguments,
						sourceRelative: selected?.sourceRelative ?? loader === "commonjs-loader",
						...selected?.sourceRelativePath === undefined ? {} : { sourceRelativePath: selected.sourceRelativePath }
					};
				}
			}
			if (t.isNewExpression(node)) {
				const loader = requireLoaderValueAt(node.callee, node, state, factoryBindingIds);
				const selected = selectedRequireSourcesAt(node.callee, node, state, factoryBindingIds);
				if (selected !== undefined || loader !== "local") return {
					operation: "load",
					loader: selected?.loader ?? loader,
					arguments: node.arguments,
					sourceRelative: selected?.sourceRelative ?? loader !== "create-require",
					...selected?.sourceRelativePath === undefined ? {} : { sourceRelativePath: selected.sourceRelativePath }
				};
			}
			const interop = loaderInvocationInterop(state);
			if (!t.isNewExpression(node)) {
				const invocation = interop.intrinsicInvocation(node, (callee) => {
					const loader = requireLoaderValueAt(callee, node, state, factoryBindingIds);
					if (loader !== "local" && loader !== "create-require") return [
						"require-loader",
						loader,
						"relative"
					];
					const selected = selectedRequireSourcesAt(callee, node, state, factoryBindingIds);
					if (selected !== undefined) return [
						"require-loader",
						selected.loader,
						selected.sourceRelative ? "relative" : "unknown"
					];
					return interop.intrinsicPath(callee);
				});
				if (invocation?.path[0] === "require-loader") {
					const selected = selectedRequireSourcesAt(node.callee, node, state, factoryBindingIds);
					return {
						operation: "load",
						loader: invocation.path[1] === "local" ? "local" : invocation.kind === "opaque" ? "unknown" : invocation.path[1],
						arguments: invocation.arguments,
						sourceRelative: invocation.kind === "known" && invocation.path[2] === "relative",
						...selected?.sourceRelativePath === undefined ? {} : { sourceRelativePath: selected.sourceRelativePath }
					};
				}
			}
			const factory = semanticFactoryRequireLoaderAt(node, state, factoryBindingIds);
			return factory === undefined ? undefined : {
				operation: "load",
				loader: factory,
				arguments: node.arguments.slice(t.isIdentifier(node.callee) ? 0 : 1),
				sourceRelative: true
			};
		};
		isWrapperRequireInitializerCall = (binding, node, state) => {
			const scope = state.scopesById.get(binding.scopeId);
			if (scope?.kind !== "program" || binding.kind !== "variable" || binding.declarationKinds.size !== 1 || !binding.declarationKinds.has("var") || binding.initializers.length !== 1 || binding.initializers[0]?.node !== node) return false;
			const assignment = state.parentsByNode.get(node);
			if (!t.isAssignmentExpression(assignment) || assignment.right !== node || state.conditionallySkippedExpressions.has(node)) return false;
			const statement = state.parentsByNode.get(assignment);
			if (!t.isExpressionStatement(statement)) return false;
			if (state.parentsByNode.get(statement) !== state.program) return false;
			const target = unwrapJavaScriptExpression(assignment.left).node;
			return t.isIdentifier(target, { name: "require" }) && resolveSemanticBindingState(state, target, target.name) === binding;
		};
		globalProcessReplacements = new WeakMap();
		moduleRequireWrites = new WeakMap();
		moduleReturnedReferences = new WeakMap();
		returnedLoaderReferences = (state, mode) => {
			let factories = moduleReturnedReferences.get(state);
			if (factories === undefined) {
				factories = new Map();
				moduleReturnedReferences.set(state, factories);
			}
			let returned = factories.get(mode);
			if (returned === undefined) {
				returned = createSemanticReturnedReferences(state, mode);
				factories.set(mode, returned);
			}
			return returned;
		};
		loaderSourceContextKey = (source) => JSON.stringify([
			source.eligibility,
			source.readAt?.start,
			source.readAt?.end,
			source.capturedSelections?.map(({ at, depth, ownEnumerable }) => [
				at.start,
				at.end,
				depth,
				ownEnumerable
			])
		]);
		inheritLoaderSourceContext = (current, sources) => sources.map((source) => ({
			...current.eligibility ? { eligibility: true } : {},
			...current.readAt === undefined ? {} : { readAt: current.readAt },
			...source,
			capturedSelections: semanticNormalizeCapturedSelections(source.capturedSelections ?? current.capturedSelections, source.path.length)
		}));
		loaderMemberSource = (current, member) => ({
			node: member.object,
			readAt: current.readAt ?? member,
			capturedSelections: current.readAt === undefined ? semanticShiftCapturedSelections(current.capturedSelections, 1) : semanticNormalizeCapturedSelections([{
				at: member,
				depth: 1
			}, ...semanticShiftCapturedSelections(current.capturedSelections, 1) ?? []]),
			path: [semanticStaticPropertyKey(member.property, member.computed), ...current.path]
		});
		projectedLoaderSources = (current, sources) => sources.map((source) => ({
			...source,
			readAt: current.path.length === 0 ? undefined : current.readAt ?? current.node,
			capturedSelections: [...semanticShiftCapturedSelections(current.capturedSelections, source.path.length - current.path.length) ?? [], ...source.capturedSelections ?? []]
		}));
		loaderObjectPropertySources = (current, object, state) => {
			const [key, ...remaining] = current.path;
			if (key === undefined) return [];
			return semanticAliasSelectionChoices(key).flatMap((choice) => (t.isObjectExpression(object) ? semanticObjectPropertyReferences(object, [choice], state) : semanticArrayPropertyReferences(object, [choice])).filter((source) => !source.inherited || !current.capturedSelections?.some((capture) => capture.depth === 1 && capture.ownEnumerable)).map((source) => ({
				node: source.node,
				path: [...source.path, ...remaining],
				capturedSelections: semanticCapturedSelectionsAfterPropertyRead(current.capturedSelections, source)
			})));
		};
		isCommonJsModuleObject = (node, state, includeUnknown = true) => hasCommonJsModuleSource(node, state, includeUnknown, "module");
		isCommonJsRequireDelegate = (node, state, includeUnknown = false, readAt) => hasCommonJsModuleSource(node, state, includeUnknown, "delegate", readAt);
		hasCommonJsModuleSource = (node, state, includeUnknown, target, readAt) => {
			const pending = [{
				node,
				path: [],
				readAt,
				awaitDepths: []
			}];
			const selections = new SemanticAliasSelections(() => {
				state.valueResourceLimits.add("alias-selections");
			});
			const contexts = new WeakMap();
			const examined = new WeakSet();
			let additionalStates = 0;
			for (let next = pending.pop(); next !== undefined; next = pending.pop()) {
				const value = unwrapJavaScriptExpression(next.node).node;
				const { awaitDepths } = next;
				const byMode = contexts.get(value) ?? new Map();
				const modeKey = JSON.stringify([awaitDepths, loaderSourceContextKey(next)]);
				let context = byMode.get(modeKey);
				if (context === undefined) {
					context = { identities: new Map() };
					byMode.set(modeKey, context);
					contexts.set(value, byMode);
				}
				const path = selections.normalize(context, next.path);
				if (selections.limited) return true;
				const pathKey = JSON.stringify(path);
				let identity = context.identities.get(pathKey);
				if (identity === undefined) {
					if ((byMode.size > 1 || context.identities.size > 0) && ++additionalStates > 512) {
						state.valueResourceLimits.add("alias-selections");
						return true;
					}
					identity = {};
					context.identities.set(pathKey, identity);
				}
				if (examined.has(identity)) continue;
				examined.add(identity);
				const enqueueAt = (depths, ...sources) => {
					pending.push(...inheritLoaderSourceContext(next, sources).map((source) => ({
						...source,
						awaitDepths: depths
					})));
				};
				const enqueue = (...sources) => {
					enqueueAt(awaitDepths, ...sources);
				};
				if (t.isAwaitExpression(value)) {
					enqueueAt([...new Set([...awaitDepths, path.length])].sort((left, right) => left - right), {
						node: value.argument,
						path
					});
					continue;
				}
				if (t.isMemberExpression(value) || t.isOptionalMemberExpression(value)) {
					enqueue(loaderMemberSource({
						...next,
						path
					}, value));
					continue;
				}
				if (path.length > 0 && (t.isObjectExpression(value) || t.isArrayExpression(value))) {
					enqueueAt(awaitDepths.filter((depth) => depth !== path.length), ...loaderObjectPropertySources({
						...next,
						path
					}, value, state));
					continue;
				}
				if (t.isConditionalExpression(value) || t.isLogicalExpression(value)) {
					enqueue({
						node: t.isConditionalExpression(value) ? value.consequent : value.left,
						path
					}, {
						node: t.isConditionalExpression(value) ? value.alternate : value.right,
						path
					});
					continue;
				}
				if (t.isSequenceExpression(value)) {
					const last = value.expressions.at(-1);
					if (last !== undefined) enqueue({
						node: last,
						path
					});
					continue;
				}
				if (t.isAssignmentExpression(value)) {
					enqueue(...assignmentValueSources(value).map((node) => ({
						node,
						path
					})));
					continue;
				}
				if (t.isCallExpression(value) || t.isOptionalCallExpression(value) || t.isNewExpression(value)) {
					const mode = awaitDepths.includes(path.length) ? "awaited-call" : "direct-call";
					const returnedResult = returnedLoaderReferences(state, mode)(value.callee, t.isNewExpression(value) ? undefined : value);
					if (returnedResult.unresolvedInvocation) return true;
					enqueue(...returnedResult.references.map((source) => ({
						node: source.node,
						path: [...source.projection, ...path],
						capturedSelections: semanticShiftCapturedSelections(next.capturedSelections, source.projection.length)
					})));
					continue;
				}
				if (!t.isIdentifier(value)) continue;
				const binding = resolveSemanticBindingState(state, value, value.name);
				const processMainModulePath = semanticGlobalProcessOrigin(value, state) !== undefined && path.length === (target === "module" ? 1 : 2) && semanticAliasSelectionChoices(path[0]).some((key) => key === null || semanticPropertyPathKeyMatches(key, "mainModule")) && (target === "module" || semanticAliasSelectionChoices(path[1]).some((key) => key === null || semanticPropertyPathKeyMatches(key, "require")));
				if (processMainModulePath) return true;
				const mainModulePath = value.name === "require" && state.program.sourceType === "script" && path.length === (target === "module" ? 1 : 2) && semanticAliasSelectionChoices(path[0]).some((key) => key === null || semanticPropertyPathKeyMatches(key, "main")) && (target === "module" || semanticAliasSelectionChoices(path[1]).some((key) => key === null || semanticPropertyPathKeyMatches(key, "require")));
				if (mainModulePath && binding === undefined && !semanticResolutionBlocked(state, value, "require")) return true;
				const copyAdmitsModuleDelegate = value.name !== "module" || target !== "delegate" || path.length !== 1 || !next.capturedSelections?.some((capture) => capture.depth === 1 && capture.ownEnumerable && !semanticCommonJsRequireOwnEnumerableAt(capture.at, state));
				if (value.name === "module" && binding === undefined) {
					if (copyAdmitsModuleDelegate && (target === "module" ? path.length === 0 : path.length === 1 && semanticAliasSelectionChoices(path[0]).some((key) => key === null || semanticPropertyPathKeyMatches(key, "require"))) && !semanticResolutionBlocked(state, value, "module")) return true;
					continue;
				}
				if (binding === undefined) continue;
				const read = semanticBindingAtRead(binding, value, state);
				const retainsMainModule = mainModulePath && commonJsWrapperBindingDeclaration(value, "require", state) !== undefined && !read.hasDefiniteInitializer;
				if (value.name === "module" && copyAdmitsModuleDelegate && (target === "module" ? path.length === 0 : path.length === 1 && semanticAliasSelectionChoices(path[0]).some((key) => key === null || semanticPropertyPathKeyMatches(key, "require"))) && commonJsWrapperBindingDeclaration(value, "module", state) !== undefined && !read.hasDefiniteInitializer) return true;
				let eligibility = next.eligibility;
				const facts = eligibility ? undefined : semanticProjectedSourceFactsAtRead(binding, value, path, state, includeUnknown, next.readAt ?? value, next.capturedSelections);
				if (retainsMainModule && (eligibility || facts?.retainsOrigin)) return true;
				let sources = eligibility ? semanticProjectedSourceEligibilityAtRead(binding, value, path, state, next.readAt ?? value, next.capturedSelections) : facts?.sources;
				if (sources === undefined) {
					if (target !== "delegate") return true;
					sources = semanticProjectedSourceEligibilityAtRead(binding, value, path, state, next.readAt ?? value, next.capturedSelections);
					if (sources === undefined) return true;
					eligibility = true;
				}
				enqueue(...projectedLoaderSources({
					...next,
					node: value,
					path
				}, sources).map((source) => eligibility ? {
					...source,
					eligibility
				} : source));
			}
			return false;
		};
		semanticModuleRequireReceiver = (node) => {
			let callee = unwrapJavaScriptExpression(node.callee).node;
			while ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && [
				"bind",
				"call",
				"apply"
			].includes(semanticStaticPropertyKey(callee.property, callee.computed) ?? "")) callee = unwrapJavaScriptExpression(callee.object).node;
			return (t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && semanticStaticPropertyKey(callee.property, callee.computed) === "require" ? callee.object : undefined;
		};
		semanticModuleRequireCallAt = (node, state, includeUnknown = true) => {
			const receiver = semanticModuleRequireReceiver(node);
			if (receiver !== undefined && isCommonJsModuleObject(receiver, state, includeUnknown)) return true;
			let target = unwrapJavaScriptExpression(node.callee).node;
			while ((t.isMemberExpression(target) || t.isOptionalMemberExpression(target)) && [
				"bind",
				"call",
				"apply"
			].includes(semanticStaticPropertyKey(target.property, target.computed) ?? "")) target = unwrapJavaScriptExpression(target.object).node;
			if (isCommonJsRequireDelegate(target, state, includeUnknown, node)) return true;
			if (t.isNewExpression(node)) return false;
			const interop = loaderInvocationInterop(state);
			return interop.intrinsicInvocation(node, (callee) => isCommonJsRequireDelegate(callee, state, false, node) ? ["commonjs-require-delegate"] : interop.intrinsicPath(callee))?.path[0] === "commonjs-require-delegate";
		};
		writesModuleRequire = (state) => {
			const cached = moduleRequireWrites.get(state);
			if (cached !== undefined) return cached;
			moduleRequireWrites.set(state, []);
			const writes = [];
			const interop = createSemanticModuleInterop(state);
			const isModuleObject = (node) => isCommonJsModuleObject(node, state, false);
			traverseJavaScriptValueAst(state.program, state.erasedSyntaxNodes, { enter: (node) => {
				const target = t.isAssignmentExpression(node) ? node.left : t.isUpdateExpression(node) || t.isUnaryExpression(node, { operator: "delete" }) ? node.argument : undefined;
				if (t.isMemberExpression(target) || t.isOptionalMemberExpression(target)) {
					const key = semanticStaticPropertyKey(target.property, target.computed);
					if ((key === "require" || key === null && target.computed) && isModuleObject(target.object)) writes.push(node);
				}
				if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
					const invocation = interop.intrinsicInvocation(node);
					const owner = invocation?.path?.length === 3 ? invocation.path[1] : undefined;
					const method = invocation?.path?.at(-1);
					const args = invocation?.arguments;
					if ((owner === "Object" || owner === "Reflect") && method === "defineProperty" && isModuleObject(args?.[0] ?? t.nullLiteral())) {
						const key = interop.staticString(args?.[1]);
						if (key === "require" || key === undefined) writes.push(node);
					} else if (owner === "Object" && method === "defineProperties" && isModuleObject(args?.[0] ?? t.nullLiteral())) {
						const descriptors = args?.[1];
						if (!t.isObjectExpression(descriptors) || descriptors.properties.some((property) => t.isSpreadElement(property) || t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "require")) writes.push(node);
					} else if (owner === "Object" && method === "assign" && args?.some((arg) => isModuleObject(arg))) {
						const target = args?.[0];
						if (target !== undefined && isModuleObject(target)) {
							const sourceHasRequire = args?.slice(1).some((arg) => t.isObjectExpression(arg) && arg.properties.some((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "require"));
							if (sourceHasRequire || args?.slice(1).some((arg) => !t.isObjectExpression(arg))) writes.push(node);
						}
					}
				}
			} });
			moduleRequireWrites.set(state, writes);
			return writes;
		};
		semanticOriginalGlobalProcessAt = (node, state) => {
			let replacements = globalProcessReplacements.get(state);
			if (replacements === undefined) {
				replacements = [...state.ambientWriteEffects.filter(({ path }) => path.length <= 2 && path.every((key, index) => semanticPropertyPathKeyMatches(key, ["global", "process"][index]))).map(({ node: write }) => write), ...state.ambientBindingWrites.get("process") ?? []];
				globalProcessReplacements.set(state, replacements);
			}
			return !replacements.some((write) => !semanticTopLevelEffectFollowsCapture(node, write, state.parentsByNode));
		};
		semanticGlobalProcessOrigin = (node, state) => t.isIdentifier(node, { name: "process" }) && resolveSemanticBindingState(state, node, "process") === undefined && !semanticResolutionBlocked(state, node, "process") && semanticOriginalGlobalProcessAt(node, state) ? {
			specifier: "node:process",
			importedPath: [],
			resolutionMode: "require"
		} : undefined;
		semanticGlobalProcessPathOrigin = (node, state) => {
			const chain = semanticMemberChain(node);
			if (chain === undefined) return undefined;
			const { root: current, members } = chain;
			if (!t.isIdentifier(current) || ![
				"globalThis",
				"global",
				"window",
				"self"
			].includes(current.name) || resolveSemanticBindingState(state, current, current.name) !== undefined || semanticResolutionBlocked(state, current, current.name) || members[0] !== "process" || !semanticOriginalGlobalProcessAt(node, state)) return undefined;
			return {
				specifier: "node:process",
				importedPath: members.slice(1),
				resolutionMode: "require"
			};
		};
		semanticRequireOrigin = (node, state) => {
			const chain = semanticMemberChain(node);
			const current = chain?.root;
			if (chain === undefined || !t.isCallExpression(current) || !t.isIdentifier(current.callee, { name: "require" })) return undefined;
			if (commonJsDelegateChangedAt(current, state)) return undefined;
			const requireBinding = resolveSemanticBindingState(state, current.callee, "require");
			if (requireBinding !== undefined && !isUnmodifiedCommonJsWrapperBinding(current.callee, "require", state) && !isWrapperRequireInitializerCall(requireBinding, current, state) || requireBinding === undefined && (javaScriptRuntimeContext(state.program) === "module" || semanticResolutionBlocked(state, current.callee, "require")) || (state.ambientBindingWrites.get("require") ?? []).some((write) => !semanticTopLevelEffectFollowsCapture(current, write, state.parentsByNode))) return undefined;
			const specifier = stringValue(current.arguments[0]);
			return specifier === undefined ? undefined : {
				origin: {
					specifier,
					importedPath: chain.members,
					resolutionMode: "require"
				},
				call: current
			};
		};
		semanticRequireExportsIdentity = (specifier, path) => {
			const name = specifier.replace(/^node:/u, "");
			if (name === "fs/promises") return {
				specifier: name,
				path
			};
			if ([
				"path",
				"path/posix",
				"path/win32"
			].includes(name)) {
				let selected = name;
				let remaining = path;
				while (remaining.length > 1 && (remaining[0] === "posix" || remaining[0] === "win32")) {
					selected = `path/${remaining[0]}`;
					remaining = remaining.slice(1);
				}
				return {
					specifier: selected,
					path: remaining
				};
			}
			return name === "fs" && path[0] === "promises" && path.length > 1 ? {
				specifier: "fs/promises",
				path: path.slice(1)
			} : {
				specifier: name,
				path
			};
		};
		MUTABLE_BUILTIN_DEFAULTS = new Set([
			...Object.keys(BUILTIN_RESOURCE_METHODS),
			"http",
			"https",
			"child_process",
			"timers",
			"process",
			"path",
			"path/posix",
			"path/win32",
			"url"
		]);
		semanticMutableBuiltinOrigin = (origin, selected = []) => {
			const path = [...origin.importedPath, ...selected];
			if (origin.resolutionMode === "require") return {
				specifier: origin.specifier,
				path
			};
			const specifier = origin.specifier.replace(/^node:/u, "");
			if (!MUTABLE_BUILTIN_DEFAULTS.has(specifier)) return undefined;
			if (path[0] === "default") return {
				specifier,
				path: path.slice(1)
			};
			if (specifier === "process" && (path[0] === "env" || path[0] === "argv")) return {
				specifier,
				path
			};
			return specifier === "fs" && path[0] === "promises" ? {
				specifier,
				path
			} : undefined;
		};
		semanticRequireOriginReaders.origin = semanticRequireOrigin;
		semanticRequireOriginReaders.loader = semanticRequireLoaderAt;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptCommonJsExportReceivers.js
/**
* Capture receivers before their RHS, then compare with the final public
* identity. Fresh allocations prove distinctness; explicit wrapper reads
* preserve even opaque identities. Branches and deferred execution remain
* uncertain, as do local aliases. Facts live for one analysis and the
* cooperative traversal bounds work to the source tree size.
*/
function* indexCommonJsExportReceiversSteps(state) {
	const initial = state.program;
	let publicIdentity = initial;
	let exportsIdentity = initial;
	let moduleIntact = true;
	let deferredReplacement = false;
	const fresh = new WeakSet([initial]);
	const values = new WeakMap();
	const captures = new Map();
	const describedFields = new Map();
	const deletions = new Map();
	const execution = [];
	const publicCallWrites = new WeakSet();
	for (const { node, path } of state.ambientWriteEffects) {
		if ((t.isCallExpression(node) || t.isOptionalCallExpression(node)) && path[0] === "commonjs-module" && path.length <= 2 && (path.length === 1 || semanticPropertyPathKeyMatches(path[1] ?? null, "exports"))) publicCallWrites.add(node);
	}
	const valueOf = (node) => {
		const value = unwrapJavaScriptExpression(node).node;
		return values.has(value) ? values.get(value) ?? null : value;
	};
	const write = (target, identity, mode) => {
		target = unwrapJavaScriptExpression(target).node;
		const possiblePublicWrite = (t.isMemberExpression(target) || t.isOptionalMemberExpression(target)) && isUnshadowedGlobal(target.object, state, "module") && semanticStaticPropertyKey(target.property, target.computed) === null;
		const publicWrite = isCommonJsModuleExports(target, state) || possiblePublicWrite;
		const exportsWrite = isUnshadowedGlobal(target, state, "exports");
		const moduleWrite = isUnshadowedGlobal(target, state, "module");
		if (!publicWrite && !exportsWrite && !moduleWrite) return;
		if (mode === "deferred") {
			deferredReplacement = true;
			return;
		}
		const selected = mode === "ordered" && !possiblePublicWrite ? identity : null;
		if (moduleWrite) moduleIntact = false;
		if (publicWrite || moduleWrite) publicIdentity = moduleIntact ? selected : null;
		if (exportsWrite) exportsIdentity = selected;
	};
	yield* traverseJavaScriptValueAstSteps(state.program, state.erasedSyntaxNodes, {
		enter: (node, parent) => {
			const outer = execution.at(-1) ?? "ordered";
			const mode = outer === "deferred" || t.isFunction(node) || t.isClass(node) ? "deferred" : outer === "conditional" || hasDestructuringEvaluationOrder(node) || t.isIfStatement(node) || t.isSwitchStatement(node) || t.isLoop(node) || t.isTryStatement(node) || t.isObjectPattern(node) || t.isArrayPattern(node) || t.isLogicalExpression(parent) && parent.right === node || t.isAssignmentPattern(parent) && parent.right === node || t.isAssignmentExpression(parent) && [
				"&&=",
				"||=",
				"??="
			].includes(parent.operator) && parent.right === node || t.isOptionalCallExpression(parent) || t.isOptionalMemberExpression(parent) && parent.property === node || t.isConditionalExpression(parent) && parent.test !== node ? "conditional" : "ordered";
			execution.push(mode);
			if (t.isAssignmentExpression(node) && commonJsExportName(node.left, state) !== undefined && !isCommonJsModuleExports(node.left, state)) {
				const receiver = t.isMemberExpression(node.left) || t.isOptionalMemberExpression(node.left) ? node.left.object : null;
				captures.set(node, mode !== "ordered" ? null : receiver !== null && isUnshadowedGlobal(receiver, state, "exports") ? exportsIdentity : publicIdentity);
			}
			const descriptor = commonJsDefinedExport(node, state);
			if (descriptor !== undefined) {
				const receiver = isUnshadowedGlobal(descriptor.receiver, state, "exports") ? exportsIdentity : publicIdentity;
				const names = describedFields.get(receiver) ?? new Set();
				names.add(descriptor.exportedName);
				describedFields.set(receiver, names);
			}
			const defined = descriptor ?? commonJsAssignedExports(node, state);
			if (defined !== undefined && t.isCallExpression(node)) captures.set(node, mode !== "ordered" ? null : isUnshadowedGlobal(defined.receiver, state, "exports") ? exportsIdentity : publicIdentity);
		},
		exit: (node) => {
			const mode = execution.pop() ?? "conditional";
			if (publicCallWrites.has(node)) {
				if (mode === "deferred") deferredReplacement = true;
				else publicIdentity = null;
			}
			if (t.isAssignmentExpression(node)) {
				const left = unwrapJavaScriptExpression(node.left).node;
				const identity = node.operator === "=" && (t.isIdentifier(left) || t.isMemberExpression(left) || t.isOptionalMemberExpression(left)) ? valueOf(node.right) : null;
				for (const target of semanticWriteTargets(node.left)) write(target, identity, mode);
				values.set(node, identity);
			} else if (t.isVariableDeclarator(node) && node.init != null) {
				for (const target of semanticWriteTargets(node.id)) write(target, t.isIdentifier(node.id) ? valueOf(node.init) : null, mode);
			} else if (t.isForOfStatement(node) || t.isForInStatement(node)) {
				if (!t.isVariableDeclaration(node.left)) for (const target of semanticWriteTargets(node.left)) write(target, null, mode);
			} else if (t.isUpdateExpression(node) || t.isUnaryExpression(node, { operator: "delete" })) {
				if (t.isUnaryExpression(node, { operator: "delete" })) {
					const name = commonJsExportName(node.argument, state);
					if (name !== undefined && !isCommonJsModuleExports(node.argument, state) && (t.isMemberExpression(node.argument) || t.isOptionalMemberExpression(node.argument))) {
						const receiver = isUnshadowedGlobal(node.argument.object, state, "exports") ? exportsIdentity : publicIdentity;
						const fields = deletions.get(receiver) ?? new Map();
						fields.set(name, {
							node,
							mode: name === "*" && mode === "ordered" ? "conditional" : mode
						});
						deletions.set(receiver, fields);
					}
				}
				write(node.argument, null, mode);
			} else if (isUnshadowedGlobal(node, state, "exports")) {
				values.set(node, exportsIdentity);
			} else if (isCommonJsModuleExports(node, state)) {
				values.set(node, publicIdentity);
			} else if (t.isObjectExpression(node) || t.isArrayExpression(node) || t.isFunctionExpression(node) || t.isArrowFunctionExpression(node) || t.isClassExpression(node)) {
				values.set(node, node);
				fresh.add(node);
			} else if (t.isSequenceExpression(node)) {
				const last = node.expressions.at(-1);
				values.set(node, last === undefined ? null : valueOf(last));
			}
		}
	});
	const effects = new Map();
	for (const [node, receiver] of captures) {
		const status = deferredReplacement || receiver === null || publicIdentity === null ? "uncertain" : receiver === publicIdentity ? "connected" : fresh.has(receiver) && fresh.has(publicIdentity) ? "detached" : "uncertain";
		if (status === "detached") {
			effects.set(node, { receiver: status });
			continue;
		}
		const fields = new Map();
		for (const { exportedName } of commonJsRuntimeExportValues(node, state)) {
			const removed = [deletions.get(receiver)?.get(exportedName), deletions.get(receiver)?.get("*")].filter((deletion) => deletion !== undefined && (deletion.mode === "deferred" || (deletion.node.start ?? -1) > (node.start ?? -1)));
			if (removed.length === 0) continue;
			const configurable = (t.isAssignmentExpression(node) || commonJsAssignedExports(node, state) !== undefined) && !describedFields.get(receiver)?.has(exportedName) && !describedFields.get(receiver)?.has("*");
			fields.set(exportedName, configurable && status !== "uncertain" && removed.every((deletion) => deletion?.mode === "ordered") ? "detached" : "uncertain");
		}
		effects.set(node, {
			receiver: status,
			...fields.size === 0 ? {} : { fields }
		});
	}
	return effects;
}
var exportInvocations, commonJsExportInvocation, commonJsExportApplicability, copiedOwnFields, isCommonJsModuleExports, commonJsExportName, commonJsDefinedExport, commonJsAssignedExports, commonJsRuntimeExportValues, hasDestructuringEvaluationOrder;
function init_javascriptCommonJsExportReceivers() {
	return (init_javascriptCommonJsExportReceivers = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticAmbientWrites();
		init_javascriptSemanticTraversal();
		init_javascriptSemanticPropertyPaths();
		init_javascriptModuleInterop();
		init_javascriptSemanticValues();
		init_javascriptSemanticProjectedSources();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticResourceLimits();
		exportInvocations = new WeakMap();
		commonJsExportInvocation = (node, state) => {
			let interop = exportInvocations.get(state);
			if (interop === undefined) {
				interop = createSemanticModuleInterop(state);
				for (const { node: write, path } of state.ambientWriteEffects) if (write !== undefined && path[0] === "global") interop.retainWrite(write, ["intrinsic", ...path.slice(1).map((key) => typeof key === "string" || typeof key === "number" ? String(key) : null)]);
				exportInvocations.set(state, interop);
			}
			return interop.intrinsicInvocation(node);
		};
		commonJsExportApplicability = (effect, name) => effect?.receiver === "detached" ? "detached" : effect?.fields?.get(name) ?? effect?.receiver ?? "connected";
		copiedOwnFields = (source, state) => {
			const unknown = {
				definite: new Set(),
				complete: false
			};
			const pending = [source];
			const seen = new Set();
			let common;
			let complete = true;
			while (pending.length > 0) {
				const node = unwrapJavaScriptExpression(pending.pop()).node;
				if (seen.has(node)) continue;
				if (seen.size >= 512) {
					state.valueResourceLimits.add("alias-selections");
					return unknown;
				}
				seen.add(node);
				if (t.isIdentifier(node)) {
					const binding = resolveSemanticBindingState(state, node, node.name);
					if (binding === undefined) return unknown;
					if (binding.memberWrites.some((effect) => semanticEffectTiming(source, effect.node, state) !== "after") || binding.escapedPaths.some((effect) => effect.node !== undefined && !((effect.node.start ?? -1) <= (source.start ?? -1) && (effect.node.end ?? -1) >= (source.end ?? -1)) && semanticEffectTiming(source, effect.node, state) !== "after")) return unknown;
					const selected = semanticProjectedSourcesAtRead(binding, node, [], state, false, source);
					if (selected === undefined || selected.length === 0 || selected.some((value) => value.path.length !== 0)) return unknown;
					if (seen.size + pending.length + selected.length > 512) {
						state.valueResourceLimits.add("alias-selections");
						return unknown;
					}
					for (const value of selected) pending.push(value.node);
					continue;
				}
				if (t.isObjectExpression(node) && node.properties.some((property) => t.isObjectMethod(property) && property.kind !== "method")) return unknown;
				const selected = evaluateSemanticExpression(node, state, source);
				const fields = selected.status === "object" ? selected.properties : selected.status === "array" ? selected.items : [];
				const own = new Set(fields.filter((field) => field.presence === "present").map((field) => field.name));
				const exact = selected.status === "object" ? !selected.unknownProperties : selected.status === "array" ? !selected.unknownItems : selected.status === "literal" && selected.value === null;
				complete &&= exact && (common === undefined || common.size === own.size && [...common].every((key) => own.has(key)));
				common = common === undefined ? own : new Set([...common].filter((key) => own.has(key)));
			}
			return {
				definite: common ?? new Set(),
				complete
			};
		};
		isCommonJsModuleExports = (node, state) => (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) && isUnshadowedGlobal(node.object, state, "module") && semanticStaticPropertyKey(node.property, node.computed) === "exports";
		commonJsExportName = (node, state) => {
			if (!t.isMemberExpression(node) && !t.isOptionalMemberExpression(node)) return undefined;
			const key = semanticStaticPropertyKey(node.property, node.computed);
			if (isUnshadowedGlobal(node.object, state, "exports") || isCommonJsModuleExports(node.object, state)) return key === null ? "*" : key;
			return isCommonJsModuleExports(node, state) ? "default" : undefined;
		};
		commonJsDefinedExport = (node, state) => {
			if (!t.isCallExpression(node)) return undefined;
			const [target, key, descriptor] = node.arguments;
			if (target === undefined || key === undefined || descriptor === undefined || t.isSpreadElement(target) || t.isSpreadElement(key) || t.isSpreadElement(descriptor) || t.isArgumentPlaceholder(target) || t.isArgumentPlaceholder(key) || t.isArgumentPlaceholder(descriptor)) return undefined;
			const receiver = unwrapJavaScriptExpression(target).node;
			if (!isUnshadowedGlobal(receiver, state, "exports") && !isCommonJsModuleExports(receiver, state) || !isUnmodifiedGlobalReference(node.callee, state, ["Object", "defineProperty"])) return undefined;
			return {
				exportedName: semanticStaticPropertyKey(key, true) ?? "*",
				receiver,
				descriptor
			};
		};
		commonJsAssignedExports = (node, state) => {
			if (!t.isCallExpression(node)) return undefined;
			const invocation = commonJsExportInvocation(node, state);
			if (invocation?.kind !== "known" || invocation.path.length !== 3 || invocation.path[0] !== "intrinsic" || invocation.path[1] !== "Object" || invocation.path[2] !== "assign") return undefined;
			const [target, ...sources] = invocation.arguments ?? [];
			if (!t.isExpression(target)) return undefined;
			const receiver = unwrapJavaScriptExpression(target).node;
			if (!isUnshadowedGlobal(receiver, state, "exports") && !isCommonJsModuleExports(receiver, state)) return undefined;
			return {
				receiver,
				sources: sources.map((source) => ({
					value: t.isExpression(source) ? source : null,
					...t.isSpreadElement(source) ? { iterationSource: source.argument } : {}
				}))
			};
		};
		commonJsRuntimeExportValues = (node, state) => {
			if (t.isAssignmentExpression(node)) {
				const exportedName = commonJsExportName(node.left, state);
				return exportedName === undefined ? [] : [{
					exportedName,
					value: node.operator === "=" ? node.right : null
				}];
			}
			const assigned = commonJsAssignedExports(node, state);
			if (assigned !== undefined) {
				const exported = [];
				const overwritten = new Set();
				for (let index = assigned.sources.length - 1; index >= 0; index--) {
					const { value, iterationSource } = assigned.sources[index];
					if (value === null) {
						exported.push({
							exportedName: "*",
							value: null,
							...iterationSource === undefined ? {} : { iterationSource }
						});
						continue;
					}
					const fields = copiedOwnFields(value, state);
					if (fields.complete) {
						for (const name of fields.definite) if (!overwritten.has(name)) exported.push({
							exportedName: name,
							value,
							projection: [name],
							ownEnumerable: true
						});
					} else exported.push({
						exportedName: "*",
						value,
						projection: [{ excludedKeys: [...overwritten] }],
						ownEnumerable: true
					});
					for (const field of fields.definite) overwritten.add(field);
				}
				return exported;
			}
			const defined = commonJsDefinedExport(node, state);
			if (defined === undefined) return [];
			const descriptor = unwrapJavaScriptExpression(defined.descriptor).node;
			return [{
				exportedName: defined.exportedName,
				value: t.isObjectExpression(descriptor) ? semanticFinalObjectProperty(descriptor, "value") ?? null : null
			}];
		};
		hasDestructuringEvaluationOrder = (node) => {
			const pattern = t.isAssignmentExpression(node) ? unwrapJavaScriptExpression(node.left).node : t.isVariableDeclarator(node) ? node.id : undefined;
			return t.isObjectPattern(pattern) || t.isArrayPattern(pattern);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticProjection.js
/** Collect lexical references in steps while preserving resolution and visit order. */
function* collectSemanticReferencesSteps(program, state, name) {
	const output = [];
	const seen = new Set();
	yield* traverseJavaScriptValueAstSteps(program, state.erasedSyntaxNodes, { enter: (node, parent, readAncestors) => {
		if (!t.isIdentifier(node) || parent === null || name !== undefined && node.name !== name) return;
		let ancestors;
		const ancestry = () => ancestors ??= readAncestors();
		const role = semanticIdentifierRole(node, parent, ancestry);
		if (role === null) return;
		const roles = role === "write" && semanticReadsBeforeWrite(node, semanticWrappedWriteSite(node, parent, ancestry()) ?? parent) ? ["read", "write"] : [role];
		for (const resolvedRole of roles) {
			const key = `${String(node.start)}:${resolvedRole}:${node.name}`;
			if (seen.has(key)) continue;
			seen.add(key);
			const binding = resolveSemanticBindingState(state, node, node.name);
			const blocked = binding === undefined && semanticResolutionBlocked(state, node, node.name);
			output.push({
				name: node.name,
				role: resolvedRole,
				location: range(node),
				bindingId: binding?.bindingId ?? null,
				resolution: binding !== undefined ? "resolved" : blocked ? "unknown" : "unbound"
			});
		}
	} });
	return output;
}
var collectSemanticCallable, collectSemanticModuleLink, collectImportEquals, collectSemanticReferences, immutableSemanticScopes, immutableSemanticBindings, callableKind, callableName, collectImports, collectNamedExports, collectRequireLink, collectUnboundRequireLink, requirePatternBindings, collectCommonJsExport, addCommonJsExport, addModuleLink, semanticCallableIdForNode, declarationCallableId, semanticReadsBeforeWrite, semanticIdentifierRole, enclosingPatternAncestor, bindsIdentifier, isPatternNode, isDeleteSite, isPatternOwnerDeclaration, semanticReferenceRole, patternNames, patternContains, declarationNames, defaultExportLocalName;
function init_javascriptSemanticProjection() {
	return (init_javascriptSemanticProjection = __esmMin((() => {
		init_javascriptSemanticState();
		init_javascriptSemanticRequireOrigin();
		init_unicodeCodePointOrder();
		init_javascriptSemanticTraversal();
		init_javascriptSemanticValues();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptAstValues();
		init_javascriptModuleDeclaration();
		init_javascriptCommonJsExportReceivers();
		init_javascriptSemanticEvaluationOrder();
		collectSemanticCallable = (input) => {
			const { node, parent, containerScope, bodyScope, state } = input;
			const kind = callableKind(node);
			if (kind === undefined) return;
			const callableId = semanticCallableIdForNode(node) ?? "callable:unknown:-1:-1";
			state.callables.push({
				callableId,
				kind,
				name: callableName(node, parent),
				containerScopeId: containerScope.scopeId,
				bodyScopeId: bodyScope === undefined || !bodyScope.bindingsComplete ? null : bodyScope.scopeId,
				location: range(node),
				computedKeyLocation: "key" in node && t.isNode(node.key) && semanticMethodDefinitionExpression(node, node.key) ? range(node.key) : null,
				returnSites: [],
				returnCoverage: {
					status: "partial",
					retainedCount: 0,
					omittedCount: null
				}
			});
			state.callableNodesById.set(callableId, node);
		};
		collectSemanticModuleLink = (node, state, commonJsReceivers) => {
			if (state.erasedSyntaxNodes.has(node) && !t.isTSImportEqualsDeclaration(node) && !t.isImportDeclaration(node) && !t.isExportNamedDeclaration(node) && !t.isExportAllDeclaration(node)) return;
			if (t.isTSImportEqualsDeclaration(node)) collectImportEquals(node, state);
			else if (t.isImportDeclaration(node)) collectImports(node, state);
			else if (t.isExportAllDeclaration(node)) addModuleLink(state, {
				kind: isTypeOnlyExportDeclaration(node) ? "type-import" : "re-export",
				specifier: node.source.value,
				importedName: "*",
				localName: null,
				exportedName: "*",
				location: range(node)
			}, node);
			else if (t.isExportNamedDeclaration(node)) collectNamedExports(node, state);
			else if (t.isExportDefaultDeclaration(node)) addModuleLink(state, {
				kind: isErasedJavaScriptDeclaration(node.declaration) ? "type-import" : "export",
				specifier: null,
				importedName: null,
				localName: defaultExportLocalName(node.declaration),
				exportedName: "default",
				callableId: semanticCallableIdForNode(node.declaration),
				location: range(node)
			}, node);
			else if (t.isVariableDeclarator(node)) collectRequireLink(node, state);
			else if (t.isAssignmentExpression(node)) collectCommonJsExport(node, state, commonJsReceivers.get(node));
			else if (t.isCallExpression(node)) {
				collectCommonJsExport(node, state, commonJsReceivers.get(node));
				collectUnboundRequireLink(node, state);
			}
		};
		collectImportEquals = (node, state) => {
			const moduleReference = node.moduleReference;
			const specifier = semanticImportEqualsSpecifier(node) ?? (node.importKind === "type" && t.isTSExternalModuleReference(moduleReference) && t.isStringLiteral(moduleReference.expression) ? moduleReference.expression.value : null);
			if (specifier === null) return;
			addModuleLink(state, {
				kind: node.importKind === "type" ? "type-import" : "require",
				specifier,
				importedName: null,
				localName: node.id.name,
				exportedName: null,
				location: range(node)
			}, node);
		};
		collectSemanticReferences = (program, state, name) => completeSemanticSteps(collectSemanticReferencesSteps(program, state, name));
		immutableSemanticScopes = (state) => state.scopes.map((scope) => ({
			scopeId: scope.scopeId,
			parentScopeId: scope.parentScopeId,
			kind: scope.kind,
			location: scope.location,
			bindingsComplete: scope.bindingsComplete,
			bindingIds: [...scope.bindings.values()].map(({ bindingId }) => bindingId).sort(compareUnicodeCodePoints)
		}));
		immutableSemanticBindings = (state) => [...state.bindingsById.values()].map((binding) => ({
			bindingId: binding.bindingId,
			scopeId: binding.scopeId,
			name: binding.name,
			kind: binding.kind,
			mutable: binding.mutable,
			definitions: binding.definitions,
			value: evaluateSemanticBinding(binding, state),
			...binding.memberWrites.length > 0 && binding.initializers.length === 1 && binding.initializers[0]?.projection.length === 0 ? { initializerValue: evaluateSemanticExpression(binding.initializers[0].node, state, binding.initializers[0].node) } : {},
			provenance: evaluateSemanticProvenance(binding, state)
		})).sort((left, right) => compareUnicodeCodePoints(left.bindingId, right.bindingId));
		callableKind = (node) => {
			if (t.isClassMethod(node) || t.isClassPrivateMethod(node) || t.isObjectMethod(node)) return "method";
			if (t.isFunction(node)) return "function";
			if (t.isClass(node)) return "class";
			return undefined;
		};
		callableName = (node, parent) => {
			if ((t.isFunctionDeclaration(node) || t.isFunctionExpression(node) || t.isClassDeclaration(node) || t.isClassExpression(node)) && t.isIdentifier(node.id)) return node.id.name;
			if (t.isClassMethod(node) || t.isClassPrivateMethod(node) || t.isObjectMethod(node)) {
				if (t.isPrivateName(node.key)) return `#${node.key.id.name}`;
				return semanticStaticPropertyKey(node.key, node.computed) ?? `[computed@${String(node.start ?? -1)}]`;
			}
			if (parent !== null && t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) return parent.id.name;
			return null;
		};
		collectImports = (node, state) => {
			if (node.specifiers.length === 0) addModuleLink(state, {
				kind: isTypeOnlyImportDeclaration(node) ? "type-import" : "import",
				specifier: node.source.value,
				importedName: null,
				localName: null,
				exportedName: null,
				location: range(node)
			}, node);
			for (const specifier of node.specifiers) addModuleLink(state, {
				kind: isTypeOnlyImportDeclaration(node) || t.isImportSpecifier(specifier) && isTypeOnlyImportSpecifier(specifier) ? "type-import" : "import",
				specifier: node.source.value,
				importedName: t.isImportDefaultSpecifier(specifier) ? "default" : t.isImportNamespaceSpecifier(specifier) ? "*" : propertyName(specifier.imported),
				localName: specifier.local.name,
				exportedName: null,
				location: range(specifier)
			}, node);
		};
		collectNamedExports = (node, state) => {
			const declarationTypeOnly = isTypeOnlyExportDeclaration(node);
			if (node.declaration !== null && node.declaration !== undefined) for (const localName of declarationNames(node.declaration)) addModuleLink(state, {
				kind: declarationTypeOnly ? "type-import" : "export",
				specifier: null,
				importedName: null,
				localName,
				exportedName: localName,
				callableId: declarationCallableId(node.declaration, localName),
				location: range(node.declaration)
			}, node);
			for (const specifier of node.specifiers) if (t.isExportSpecifier(specifier) || t.isExportNamespaceSpecifier(specifier) && node.exportKind !== "type") addModuleLink(state, {
				kind: declarationTypeOnly || t.isExportSpecifier(specifier) && isTypeOnlyExportSpecifier(specifier) ? "type-import" : node.source == null ? "export" : "re-export",
				specifier: node.source?.value ?? null,
				importedName: t.isExportNamespaceSpecifier(specifier) ? "*" : propertyName(specifier.local),
				localName: node.source == null && t.isExportSpecifier(specifier) ? propertyName(specifier.local) : null,
				exportedName: propertyName(specifier.exported),
				location: range(specifier)
			}, node);
		};
		collectRequireLink = (node, state) => {
			const required = semanticRequireOrigin(node.init, state);
			if (required === undefined) return;
			const { origin, call } = required;
			const bindings = requirePatternBindings(node.id, origin.importedPath);
			for (const binding of bindings) addModuleLink(state, {
				kind: "require",
				specifier: origin.specifier,
				importedName: binding.importedName,
				localName: binding.localName,
				exportedName: null,
				location: range(node)
			}, node);
			if (bindings.length > 0) state.linkedRequireCalls.add(call);
		};
		collectUnboundRequireLink = (node, state) => {
			if (state.linkedRequireCalls.has(node)) return;
			const required = semanticRequireOrigin(node, state);
			if (required === undefined) return;
			addModuleLink(state, {
				kind: "require",
				specifier: required.origin.specifier,
				importedName: null,
				localName: null,
				exportedName: null,
				location: range(node)
			}, node);
			state.linkedRequireCalls.add(node);
		};
		requirePatternBindings = (pattern, path) => {
			if (t.isTSParameterProperty(pattern)) return requirePatternBindings(pattern.parameter, path);
			if (t.isIdentifier(pattern)) return [{
				importedName: path.at(-1) ?? "*",
				localName: pattern.name
			}];
			if (t.isAssignmentPattern(pattern)) return requirePatternBindings(pattern.left, path);
			if (t.isObjectPattern(pattern)) return pattern.properties.flatMap((property) => {
				if (t.isRestElement(property)) return [];
				const name = semanticStaticPropertyKey(property.key, property.computed);
				return name === null ? [] : requirePatternBindings(property.value, [...path, name]);
			});
			if (t.isArrayPattern(pattern)) return pattern.elements.flatMap((element, index) => element === null ? [] : requirePatternBindings(element, [...path, String(index)]));
			return [];
		};
		collectCommonJsExport = (node, state, receiverEffect) => {
			for (const exported of commonJsRuntimeExportValues(node, state)) {
				const applicability = commonJsExportApplicability(receiverEffect, exported.exportedName);
				if (applicability === "detached") continue;
				addCommonJsExport(node, state, exported.exportedName, applicability === "uncertain" ? null : exported.value, exported.projection);
			}
		};
		addCommonJsExport = (node, state, exportedName, exported, projection) => {
			let value = exported;
			while (t.isAssignmentExpression(value, { operator: "=" })) value = value.right;
			const required = value === null ? undefined : semanticRequireOrigin(value, state);
			const origin = projection?.some((key) => typeof key === "object" && key !== null && key.excludedKeys.length > 0) ? undefined : required?.origin;
			const selectedName = projection?.at(-1);
			addModuleLink(state, {
				kind: "commonjs-export",
				specifier: origin?.specifier ?? null,
				importedName: origin === undefined ? null : typeof selectedName === "string" || typeof selectedName === "number" ? String(selectedName) : origin.importedPath.at(-1) ?? null,
				localName: projection === undefined && value !== null && t.isIdentifier(value) ? value.name : null,
				exportedName,
				callableId: projection !== undefined || value === null ? null : semanticCallableIdForNode(value),
				location: range(node)
			}, node);
			if (origin !== undefined && required !== undefined) state.linkedRequireCalls.add(required.call);
		};
		addModuleLink = (state, link, referenceNode) => {
			const resolutionMode = link.resolutionMode ?? (link.kind === "import" || link.kind === "re-export" || link.kind === "type-import" ? state.staticImportResolutionMode : link.kind === "require" ? "require" : undefined);
			const collected = {
				...link,
				...resolutionMode === undefined ? {} : { resolutionMode },
				callableId: link.callableId ?? null
			};
			state.moduleLinks.push(collected);
			if (t.isExportDefaultDeclaration(referenceNode) && t.isExpression(referenceNode.declaration)) state.defaultExportExpressions.set(collected, referenceNode.declaration);
			if (link.localName !== null) {
				const binding = resolveSemanticBindingState(state, referenceNode, link.localName);
				if (binding !== undefined) state.moduleLinkBindings.set(collected, binding);
			}
		};
		semanticCallableIdForNode = (node) => {
			const kind = callableKind(node);
			return kind === undefined ? null : `callable:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`;
		};
		declarationCallableId = (declaration, localName) => {
			if ((t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration)) && declaration.id?.name === localName) return semanticCallableIdForNode(declaration);
			if (!t.isVariableDeclaration(declaration)) return null;
			const declarator = declaration.declarations.find(({ id }) => t.isIdentifier(id, { name: localName }));
			return declarator?.init === null || declarator?.init === undefined ? null : semanticCallableIdForNode(declarator.init);
		};
		semanticReadsBeforeWrite = (node, site) => {
			const target = semanticWriteSiteTarget(site);
			return target !== null && unwrapJavaScriptExpression(target).node === node && semanticWriteSiteReadsFirst(site);
		};
		semanticIdentifierRole = (node, parent, readAncestors) => {
			if (t.isMemberExpression(parent) || t.isOptionalMemberExpression(parent)) return semanticReferenceRole(node, parent);
			if (t.isObjectProperty(parent) && parent.key === node && !parent.computed && parent.value !== node) return null;
			const ancestors = readAncestors();
			const patternAncestor = enclosingPatternAncestor(node, parent, ancestors);
			if (patternAncestor !== null) {
				if (isPatternOwnerDeclaration(patternAncestor)) return null;
				return "write";
			}
			const site = semanticWrappedWriteSite(node, parent, ancestors);
			if (site !== null && site !== parent && !isDeleteSite(site)) return "write";
			return semanticReferenceRole(node, parent, ancestors.at(-2));
		};
		enclosingPatternAncestor = (node, parent, ancestors) => {
			const chain = [...ancestors, parent];
			for (let index = chain.length - 1; index >= 0; index -= 1) {
				const ancestor = chain[index];
				if (ancestor === undefined || !isPatternNode(ancestor)) continue;
				if (!bindsIdentifier(ancestor, parent, node)) continue;
				for (let owner = index - 1; owner >= 0; owner -= 1) {
					const candidate = chain[owner];
					if (candidate === undefined) continue;
					if (t.isAssignmentExpression(candidate) || t.isForInStatement(candidate) || t.isForOfStatement(candidate)) return candidate;
					if (isPatternOwnerDeclaration(candidate)) return candidate;
				}
				return null;
			}
			return null;
		};
		bindsIdentifier = (pattern, parent, node) => {
			if (parent === pattern) return patternContains(pattern, node);
			if (t.isObjectPattern(pattern)) return t.isObjectProperty(parent) && (parent.value === node || parent.shorthand && parent.key === node);
			if (t.isArrayPattern(pattern)) return pattern.elements.some((element) => element === parent);
			if (t.isAssignmentPattern(pattern)) return pattern.left === parent;
			return t.isRestElement(pattern) && pattern.argument === parent;
		};
		isPatternNode = (node) => t.isObjectPattern(node) || t.isArrayPattern(node) || t.isAssignmentPattern(node) || t.isRestElement(node);
		isDeleteSite = (site) => t.isUnaryExpression(site, { operator: "delete" });
		isPatternOwnerDeclaration = (node) => t.isTSParameterProperty(node) || t.isVariableDeclarator(node) && t.isPattern(node.id) || t.isFunction(node) && node.params.some((value) => t.isPattern(value)) || t.isCatchClause(node) && node.param !== null && t.isPattern(node.param);
		semanticReferenceRole = (node, parent, grandparent) => {
			if (t.isAssignmentExpression(parent) && parent.left === node || t.isUpdateExpression(parent) || (t.isForInStatement(parent) || t.isForOfStatement(parent)) && parent.left === node) return "write";
			if (t.isTSImportEqualsDeclaration(parent) && parent.id === node || t.isTSParameterProperty(parent) && patternContains(parent.parameter, node) || (t.isTSDeclareMethod(parent) || t.isTSMethodSignature(parent)) && parent.key === node && !parent.computed) return null;
			if (!t.isReferenced(node, parent, grandparent)) return null;
			return t.isExportSpecifier(parent) && parent.local === node ? "export" : "read";
		};
		patternNames = (pattern) => {
			if (t.isTSParameterProperty(pattern)) return patternNames(pattern.parameter);
			if (t.isIdentifier(pattern)) return [pattern.name];
			if (t.isAssignmentPattern(pattern)) return patternNames(pattern.left);
			if (t.isRestElement(pattern)) return patternNames(pattern.argument);
			if (t.isObjectPattern(pattern)) return pattern.properties.flatMap((property) => t.isRestElement(property) ? patternNames(property.argument) : patternNames(property.value));
			if (t.isArrayPattern(pattern)) return pattern.elements.flatMap((element) => element === null ? [] : patternNames(element));
			return [];
		};
		patternContains = (pattern, target) => pattern === target || t.isTSParameterProperty(pattern) && patternContains(pattern.parameter, target) || t.isAssignmentPattern(pattern) && patternContains(pattern.left, target) || t.isRestElement(pattern) && patternContains(pattern.argument, target) || t.isObjectPattern(pattern) && pattern.properties.some((property) => t.isRestElement(property) ? patternContains(property.argument, target) : patternContains(property.value, target)) || t.isArrayPattern(pattern) && pattern.elements.some((element) => element !== null && patternContains(element, target));
		declarationNames = (declaration) => {
			if (t.isVariableDeclaration(declaration)) return declaration.declarations.flatMap(({ id }) => patternNames(id));
			if ((t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration)) && t.isIdentifier(declaration.id)) return [declaration.id.name];
			if ((t.isTSInterfaceDeclaration(declaration) || t.isTSTypeAliasDeclaration(declaration) || t.isTSDeclareFunction(declaration)) && t.isIdentifier(declaration.id)) return [declaration.id.name];
			if (t.isTSImportEqualsDeclaration(declaration) && semanticImportEqualsSpecifier(declaration) !== null) return [declaration.id.name];
			return [];
		};
		defaultExportLocalName = (declaration) => {
			const value = unwrapJavaScriptExpression(declaration).node;
			if (t.isIdentifier(value)) return value.name;
			return (t.isFunctionDeclaration(value) || t.isClassDeclaration(value)) && t.isIdentifier(value.id) ? value.id.name : null;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCoverage.js
var RETURNED_REFERENCE_WIDENING_LIMITATION, semanticCoverage, semanticCoverageResourceLimits, semanticResourceBounds, semanticResourceLimitCoverage, semanticReturnCoverage;
function init_javascriptSemanticCoverage() {
	return (init_javascriptSemanticCoverage = __esmMin((() => {
		init_javascriptSemanticResourceLimits();
		RETURNED_REFERENCE_WIDENING_LIMITATION = "Local returned-reference projections were conservatively widened; effects include additional source-local candidates.";
		semanticCoverage = (parserPartial, resourceLimits = [], widenedReturnedReferences = []) => {
			const widened = widenedReturnedReferences.length > 0 ? { widenedReturnedReferences } : {};
			if (resourceLimits.length > 0) return {
				status: "partial",
				omittedCount: null,
				resourceLimits,
				...widened
			};
			return {
				status: parserPartial || widenedReturnedReferences.length > 0 ? "partial" : "complete",
				omittedCount: 0,
				...widened
			};
		};
		semanticCoverageResourceLimits = (coverage) => coverage.resourceLimits ?? [];
		semanticResourceBounds = {
			"primitive-candidates": {
				value: 256,
				unit: "items"
			},
			"primitive-bytes": {
				value: SEMANTIC_PRIMITIVE_JSON_BYTES_LIMIT,
				unit: "bytes"
			},
			"expression-depth": {
				value: 256,
				unit: "depth"
			},
			"getter-expansion": {
				value: 512,
				unit: "items"
			},
			"alias-selections": {
				value: 512,
				unit: "items"
			}
		};
		semanticResourceLimitCoverage = (resourceLimits) => resourceLimits.map((resourceLimit) => ({
			name: `javascript_semantic_${resourceLimit.replaceAll("-", "_")}`,
			...semanticResourceBounds[resourceLimit]
		}));
		semanticReturnCoverage = (retainedCount, parserPartial) => ({
			status: parserPartial ? "partial" : "complete",
			retainedCount,
			omittedCount: 0
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticReturns.js
var collectSemanticReturns, semanticReturnSiteId, resolveSemanticModuleCallables, directReturnExpressions, callableIdsForBinding, callableIdsForNode, flattenSemanticReturnValue, flattenValue;
function init_javascriptSemanticReturns() {
	return (init_javascriptSemanticReturns = __esmMin((() => {
		init_javascriptSemanticSlots();
		init_unicodeCodePointOrder();
		init_javascriptSemanticProjection();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticValues();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticCoverage();
		init_javascriptSemanticCallableResults();
		init_javascriptSemanticMutationInitializers();
		collectSemanticReturns = (state, parserPartial) => {
			return state.callables.map((callable) => {
				const node = state.callableNodesById.get(callable.callableId);
				if (node === undefined) return {
					...callable,
					returnCoverage: {
						status: "partial",
						retainedCount: 0,
						omittedCount: null
					}
				};
				const expressions = directReturnExpressions(node);
				const sites = [];
				for (const expression of expressions) {
					const returned = expression.node === null ? null : unwrapJavaScriptExpression(expression.node).node;
					sites.push({
						returnSiteId: semanticReturnSiteId(callable.callableId, expression.location),
						location: expression.location,
						identityReferenceLocation: returned !== null && t.isIdentifier(returned) ? range(returned) : null,
						valueExpressionLocation: returned === null ? null : range(returned),
						value: expression.node === null ? {
							status: "unknown",
							reason: "Return has no value."
						} : evaluateSemanticExpression(expression.node, state)
					});
				}
				return {
					...callable,
					returnSites: sites,
					returnCoverage: semanticReturnCoverage(sites.length, parserPartial)
				};
			});
		};
		semanticReturnSiteId = (callableId, location) => [
			callableId,
			"return",
			String(location.start.line),
			String(location.start.column),
			String(location.end.line),
			String(location.end.column)
		].join(":");
		resolveSemanticModuleCallables = (state, callables, bindings) => {
			const callableIds = new Set(callables.map(({ callableId }) => callableId));
			const provenanceByBinding = new Map(bindings.map(({ bindingId, provenance }) => [bindingId, provenance]));
			return state.moduleLinks.map((link) => {
				if (link.kind === "type-import") return {
					...link,
					callableId: null
				};
				const captured = state.defaultExportExpressions.get(link);
				if (link.localName === null && captured === undefined) return link.callableId !== null && callableIds.has(link.callableId) ? link : {
					...link,
					callableId: null
				};
				const binding = state.moduleLinkBindings.get(link);
				const resolved = captured !== undefined ? callableIdsForNode(captured, state, callableIds, new Set(), true) : binding === undefined ? [] : callableIdsForBinding(binding, state, callableIds, new Set());
				const provenance = binding === undefined || link.specifier !== null ? undefined : provenanceByBinding.get(binding.bindingId);
				const resolutionMode = provenance?.status === "module" ? provenance.origins[0].resolutionMode : undefined;
				return {
					...link,
					...resolutionMode !== undefined ? { resolutionMode } : {},
					callableId: resolved.length === 1 ? resolved[0] ?? null : null
				};
			});
		};
		directReturnExpressions = (callable) => semanticCallableResultExpressions(callable).filter(({ kind }) => kind === "return").map(({ node, site }) => ({
			node,
			location: range(site)
		}));
		callableIdsForBinding = (binding, state, admitted, seen, read) => {
			if (seen.has(binding.bindingId) || read === undefined && binding.initializers.length !== 1 || binding.definitions.some(({ kind }) => read === undefined && kind === "assignment" || kind === "parameter" || kind === "catch")) return [];
			const selected = read === undefined ? binding : semanticBindingAtRead(binding, read, state).binding;
			const initializer = selected.initializers[0];
			if (initializer === undefined || selected.initializers.length !== 1 || initializer.projection.length > 0 || state.conditionallySkippedExpressions.has(initializer.node)) return [];
			return callableIdsForNode(initializer.node, state, admitted, new Set([...seen, binding.bindingId]), read !== undefined);
		};
		callableIdsForNode = (node, state, admitted, seen, snapshot = false) => {
			const unwrapped = unwrapJavaScriptExpression(node).node;
			if (unwrapped !== node) return callableIdsForNode(unwrapped, state, admitted, seen, snapshot);
			const direct = semanticCallableIdForNode(node);
			if (direct !== null && admitted.has(direct)) return [direct];
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(state, node, node.name);
				return binding === undefined ? [] : callableIdsForBinding(binding, state, admitted, seen, snapshot ? node : undefined);
			}
			return [];
		};
		flattenSemanticReturnValue = (value) => {
			const fields = [];
			const propertyCoverage = [];
			flattenValue(value, "", fields, propertyCoverage);
			fields.sort((left, right) => compareUnicodeCodePoints(left.path, right.path));
			propertyCoverage.sort((left, right) => compareUnicodeCodePoints(left.path, right.path));
			return {
				fields,
				propertyCoverage
			};
		};
		flattenValue = (value, path, fields, coverage, presence = "present") => {
			if (presence !== "present") {
				fields.push({
					path,
					presence,
					state: "unknown",
					value: null,
					reason: "reason" in value ? value.reason : "Property presence is uncertain."
				});
				return;
			}
			if (value.status === "literal") {
				fields.push({
					path,
					presence,
					state: "literal",
					value: value.value,
					reason: null
				});
				return;
			}
			if (value.status === "union") {
				fields.push({
					path,
					presence,
					state: "union",
					value: [...value.values],
					reason: null
				});
				return;
			}
			if ("reason" in value) {
				fields.push({
					path,
					presence,
					state: "unknown",
					value: null,
					reason: value.reason
				});
				return;
			}
			const container = semanticContainer(value);
			coverage.push({
				path,
				...container.coverage
			});
			for (const slot of container.slots) flattenValue(slot.value, `${path}${semanticPropertyPointer([slot.name])}`, fields, coverage, slot.presence);
		};
	})))();
}

//#endregion
//#region dist/domain/apple/dyldPaths.js
var MAX_SYMLINK_HOPS, resolveTreePath, segmentsOf, directoryOf, joinPath, expandPrefix, COMPATIBLE_ARCHITECTURES, ARM32_CPU_TYPE, ARM32_SUBTYPE_PREFERENCES, compatibleSlice;
function init_dyldPaths() {
	return (init_dyldPaths = __esmMin((() => {
		init_machoCpuIdentity();
		MAX_SYMLINK_HOPS = 32;
		resolveTreePath = async (view, input) => {
			const pending = segmentsOf(input);
			const resolved = [];
			let last;
			let hops = 0;
			while (pending.length > 0) {
				const segment = pending.shift() ?? "";
				if (segment === ".") continue;
				if (segment === "..") {
					if (resolved.length === 0) return { kind: "escapes" };
					resolved.pop();
					last = { kind: "directory" };
					continue;
				}
				const path = [...resolved, segment].join("/");
				const entry = await view.entry(path);
				if (entry === undefined) return { kind: "absent" };
				if (entry.kind === "symlink") {
					if (entry.target === null) return {
						kind: "undetermined",
						path,
						targetHex: entry.targetHex
					};
					hops += 1;
					if (hops > MAX_SYMLINK_HOPS) return { kind: "absent" };
					if (entry.target.startsWith("/")) return { kind: "escapes" };
					pending.unshift(...segmentsOf(entry.target));
					continue;
				}
				if (entry.kind === "file" && pending.length > 0) return { kind: "absent" };
				resolved.push(segment);
				last = entry;
			}
			return last?.kind === "file" ? {
				kind: "file",
				path: resolved.join("/")
			} : { kind: "not-file" };
		};
		segmentsOf = (path) => {
			const segments = path.split("/").filter((segment) => segment !== "");
			if (path.endsWith("/")) segments.push(".");
			return segments;
		};
		directoryOf = (path) => {
			const index = path.lastIndexOf("/");
			return index < 0 ? "" : path.slice(0, index);
		};
		joinPath = (directory, rest) => directory === "" ? rest : rest === "" ? directory : `${directory}/${rest}`;
		expandPrefix = (raw, context) => {
			const variable = /^@(executable_path|loader_path)(?:\/(.*))?$/su.exec(raw);
			if (variable !== null) {
				const rest = variable[2] ?? "";
				if (variable[1] === "loader_path") return {
					scope: "target",
					path: joinPath(context.ownerDirectory, rest)
				};
				return context.executable === null ? {
					scope: "undetermined",
					path: raw
				} : {
					scope: "target",
					path: joinPath(directoryOf(context.executable), rest)
				};
			}
			if (raw.startsWith("/")) {
				const lookupPath = context.rootRelativePath(raw);
				return lookupPath === undefined ? {
					scope: "outside",
					path: raw
				} : {
					scope: "target",
					path: raw,
					lookupPath
				};
			}
			return {
				scope: "undetermined",
				path: raw
			};
		};
		COMPATIBLE_ARCHITECTURES = { x86_64h: ["x86_64h", "x86_64"] };
		ARM32_CPU_TYPE = 12;
		ARM32_SUBTYPE_PREFERENCES = {
			0: [0],
			5: [5, 0],
			6: [
				6,
				7,
				5,
				0
			],
			7: [
				7,
				5,
				0
			],
			8: [
				8,
				7,
				5,
				0
			],
			9: [
				9,
				6,
				7,
				5,
				0
			],
			10: [
				10,
				9,
				6,
				7,
				5,
				0
			],
			11: [
				11,
				9,
				10,
				6,
				7,
				5,
				0
			],
			12: [12]
		};
		compatibleSlice = (slices, process) => {
			if (process.cpu_type === ARM32_CPU_TYPE) {
				const subtype = machoCpuSubtypeBase(process.cpu_subtype);
				const preferences = ARM32_SUBTYPE_PREFERENCES[subtype];
				if (preferences === undefined) return slices.some((item) => item.cpu_type === ARM32_CPU_TYPE) ? { kind: "unknown" } : { kind: "missing" };
				for (const preferredSubtype of preferences) {
					const slice = slices.find((item) => item.cpu_type === ARM32_CPU_TYPE && machoCpuSubtypeBase(item.cpu_subtype) === preferredSubtype);
					if (slice !== undefined) return {
						kind: "selected",
						slice
					};
				}
				return { kind: "missing" };
			}
			const processFamily = machoArchitectureFamily(process.architecture);
			for (const architecture of COMPATIBLE_ARCHITECTURES[processFamily] ?? [processFamily]) {
				const slice = slices.find((item) => machoArchitectureFamily(item.architecture) === architecture && (processFamily !== "arm64e" || item.cpu_type === process.cpu_type && machoCpuSubtypeBase(item.cpu_subtype) === machoCpuSubtypeBase(process.cpu_subtype)));
				if (slice !== undefined) return {
					kind: "selected",
					slice
				};
			}
			return { kind: "missing" };
		};
	})))();
}

//#endregion
//#region dist/domain/apple/dyldEnvironment.js
var embeddedDyldOverrides, overrideEffect, isFrameworkInstallName, hasApplicableDyldOverrides;
function init_dyldEnvironment() {
	return (init_dyldEnvironment = __esmMin((() => {
		embeddedDyldOverrides = (environment, platforms) => {
			const overrides = [];
			for (const setting of environment) {
				const delimiter = setting.indexOf("=");
				if (delimiter <= 0) continue;
				const variable = setting.slice(0, delimiter);
				const value = setting.slice(delimiter + 1);
				const effect = overrideEffect(variable, value);
				if (effect === undefined) continue;
				if (variable === "DYLD_ROOT_PATH" && platforms.length > 0 && platforms.every((platform) => platform >= 1 && platform <= 12) && !platforms.some((platform) => [
					7,
					8,
					9,
					12
				].includes(platform))) continue;
				overrides.push({
					variable,
					value,
					...effect
				});
			}
			return overrides;
		};
		overrideEffect = (variable, value) => {
			switch (variable) {
				case "DYLD_LIBRARY_PATH": return {
					phase: "override",
					scope: "library"
				};
				case "DYLD_FRAMEWORK_PATH": return {
					phase: "override",
					scope: "framework"
				};
				case "DYLD_FALLBACK_LIBRARY_PATH": return {
					phase: "fallback",
					scope: "library"
				};
				case "DYLD_FALLBACK_FRAMEWORK_PATH": return {
					phase: "fallback",
					scope: "framework"
				};
				case "DYLD_VERSIONED_LIBRARY_PATH":
				case "DYLD_VERSIONED_FRAMEWORK_PATH":
				case "DYLD_IMAGE_SUFFIX": return /[^:]/u.test(value) ? {
					phase: "override",
					scope: "all"
				} : undefined;
				case "DYLD_INSERT_LIBRARIES": return value === "" ? undefined : {
					phase: "override",
					scope: "all"
				};
				case "DYLD_ROOT_PATH":
				case "DYLD_OVERLAY_PATH": return value === "" ? undefined : {
					phase: "override",
					scope: "prefix"
				};
				default: return undefined;
			}
		};
		isFrameworkInstallName = (name, overrides) => {
			const separator = name.lastIndexOf(".framework/");
			if (separator < 0) return false;
			const framework = name.slice(0, separator).split("/").at(-1);
			const leaf = name.slice(name.lastIndexOf("/") + 1);
			return leaf === framework || overrides.some(({ variable, value }) => variable === "DYLD_IMAGE_SUFFIX" && leaf === `${framework}${value}`);
		};
		hasApplicableDyldOverrides = (overrides, installName, ordinarySearchFoundImage) => {
			const kind = isFrameworkInstallName(installName, overrides) ? "framework" : "library";
			return overrides.some(({ phase, scope }) => (phase === "override" || !ordinarySearchFoundImage) && (scope === "all" || scope === kind || scope === "prefix" && !installName.startsWith("@")));
		};
	})))();
}

//#endregion
//#region dist/domain/apple/dylibResolutionFindings.js
var isLazyLoadCommand, deriveFindings, unresolvedFinding, missingCandidateExplanation, candidateRejection, dependencyPhrase, lazyConsequence, DYLIB_RESOLUTION_LIMITATIONS;
function init_dylibResolutionFindings() {
	return (init_dylibResolutionFindings = __esmMin((() => {
		isLazyLoadCommand = (command) => command === "LC_LAZY_LOAD_DYLIB" || command === "LC_LAZY_LOAD_DYLIB_INFO";
		deriveFindings = (edges, roots) => {
			const findings = [];
			edges.forEach((edge, index) => {
				if (edge.resolution.status === "unresolved") findings.push(unresolvedFinding(edge, index));
				const resolvedAt = edge.candidates.findIndex(({ outcome }) => outcome === "resolved");
				const earlier = edge.candidates.slice(0, Math.max(resolvedAt, 0)).filter(({ source, outcome }) => source === "rpath" && outcome === "absent").map(({ path }) => path);
				if (resolvedAt > 0 && earlier.length > 0) findings.push({
					kind: "earlier-rpath-candidate-absent",
					edge_index: index,
					image: edge.loader,
					basis: "derived",
					explanation: `The modeled dyld search checks ${earlier.join(", ")} before ${edge.resolution.image ?? edge.install_name}. A compatible Mach-O placed at an earlier modeled path could take precedence over that fallback, subject to unmodeled search inputs and code-signing library validation; library validation is not evaluated here (see inspect_signature).${edge.loader_conditional ? " This loader loads only conditionally; if it never loads, this search never occurs." : ""}${edge.resolution.status === "conditional" ? " Unmodeled environment overrides or earlier unknown candidates may take precedence; placing an image at this rpath does not establish which image dyld will load." : ""}`
				});
			});
			for (const { image, slice } of roots) {
				const { architecture } = slice;
				const environment = slice.dyld_environment;
				if (environment.length > 0) findings.push({
					kind: "dyld-environment-present",
					edge_index: null,
					image,
					basis: "derived",
					explanation: slice.file_type === "execute" ? `${image} (${architecture}) sets dyld environment variables through LC_DYLD_ENVIRONMENT (${environment.join(", ")}); any image-selection overrides they request are not modeled. Diagnostic settings alone do not alter resolution.` : `${image} (${architecture}) contains LC_DYLD_ENVIRONMENT (${environment.join(", ")}). Dyld reads these commands only from the main executable; entries in this non-executable root are observations and do not alter resolution.`
				});
			}
			return findings;
		};
		unresolvedFinding = (edge, index) => {
			const base = {
				edge_index: index,
				image: edge.loader,
				basis: "derived"
			};
			const lazy = isLazyLoadCommand(edge.command);
			const missing = missingCandidateExplanation(edge, dependencyPhrase(edge, lazy));
			const when = edge.loader_conditional ? `. ${edge.loader} loads only conditionally; if it loads, ` : "; ";
			if (lazy) return {
				...base,
				kind: "lazy-load-unresolved",
				explanation: `${missing}${when}${lazyConsequence(edge.weak)}`
			};
			return edge.weak ? {
				...base,
				kind: "weak-load-unresolved",
				explanation: `${missing}${when}dyld continues without it.`
			} : {
				...base,
				kind: "required-load-unresolved",
				explanation: `${missing}${when}dyld would fail to load this required dependency for ${edge.root} (${edge.architecture}) unless the image is supplied elsewhere.`
			};
		};
		missingCandidateExplanation = (edge, dependency) => {
			const present = edge.candidates.flatMap(({ outcome, resolved_path }) => resolved_path === null ? [] : [{
				outcome,
				path: resolved_path
			}]);
			if (present.length === 0) return `No candidate for ${dependency} exists in the analyzed root`;
			const descriptions = present.map(({ outcome, path }) => `${path} (${candidateRejection(outcome)})`);
			return `No usable candidate for ${dependency} exists in the analyzed root; found ${descriptions.join(", ")}`;
		};
		candidateRejection = (outcome) => {
			switch (outcome) {
				case "not-mach-o": return "not a Mach-O image";
				case "malformed": return "malformed";
				case "architecture-missing": return "missing the process architecture";
				case "not-loadable": return "not a loadable dylib";
				case "platform-mismatch": return "incompatible with the process platform";
				case "unsupported": return "unsupported by the parser";
				case "resolved": return "loadable";
				case "absent": return "absent";
				case "outside-target": return "outside the analyzed root";
				case "escapes-target": return "escapes the analyzed root";
				case "undetermined": return "of undetermined loadability";
			}
		};
		dependencyPhrase = (edge, lazy) => {
			if (lazy && edge.weak) return `lazily loaded weak dependency ${edge.install_name}`;
			if (lazy) return `lazily loaded ${edge.install_name}`;
			if (edge.weak) return `weak dependency ${edge.install_name}`;
			return edge.install_name;
		};
		lazyConsequence = (weak) => weak ? "dyld loads it on first use and continues if it is absent." : "dyld loads it on first use, which would fail unless the image is supplied elsewhere.";
		DYLIB_RESOLUTION_LIMITATIONS = [
			"LC_LAZY_LOAD_DYLIB and LC_LAZY_LOAD_DYLIB_INFO dependencies are resolved but not traversed, because dyld loads them only on first use.",
			"Slices are matched by dyld's graded architectures (an x86_64h process also loads x86_64). arm64e processes that disable pointer authentication can also load arm64 slices; that fallback is not modeled.",
			"Absolute install names and rpaths are outside the analyzed root and are not evaluated, including /System and /usr/lib libraries that the dyld shared cache usually provides.",
			"Leaf and relative install names depend on dyld fallback paths, DYLD_* variables, and the working directory; they are undetermined.",
			"Load order follows dyld's dependents-first traversal in load-command order. An image reached through several chains is resolved once per process, with the rpath stack and conditionality of the first chain; a later @rpath request whose install name matches an already loaded image reuses it.",
			"@loader_path uses each image's symlink-resolved path within the analyzed root.",
			"Code-signing checks that can reject a found image, such as library validation and the hardened runtime, are not evaluated.",
			"Dylib compatibility versions are not compared. Apple's linker documentation describes a load-time rejection when an image's compatibility version is older than the loader requires, but dyld on macOS 26 was observed to load such an image."
		];
	})))();
}

//#endregion
//#region dist/domain/apple/dylibResolution.js
var ROOT_RELATIVE_PATH, rootRelativePathSchema, dylibResolutionInputSchema, dependencyCommandSchema, IMPLICIT_MACOS_PLATFORM, MACOS_DYLD_IMPLICIT_PLATFORM_CPU_TYPES, dependencySchema, machoSliceSchema, machoImageSlices, candidateSchema, edgeSchema, findingSchema, imageSchema, dylibResolutionResultSchema, expandCandidatePath, appendRpath, candidateTemplates, evaluateCandidate, platformLoadability, imageLoadabilityForPlatform, isKnownPlatform, imageFacts, resolution, resolveDependency, traceProcess, projectTraceResult, traceDylibLoading, withoutDependencies, compare;
function init_dylibResolution() {
	return (init_dylibResolution = __esmMin((() => {
		init_machoCpuIdentity();
		init_analysisErrorCore();
		init_dyldPaths();
		init_digests();
		init_dyldEnvironment();
		init_dylibResolutionFindings();
		ROOT_RELATIVE_PATH = /^(?:[^\x2f\\\x00.][^\x2f\\\x00]*|\.[^\x2f\\\x00.][^\x2f\\\x00]*|\.\.[^\x2f\\\x00]+)(?:\x2f(?:[^\x2f\\\x00.][^\x2f\\\x00]*|\.[^\x2f\\\x00.][^\x2f\\\x00]*|\.\.[^\x2f\\\x00]+))*$/u;
		rootRelativePathSchema = z.string().min(1).regex(ROOT_RELATIVE_PATH, "Use a normalized path relative to the analyzed root, without a leading or trailing '/', '//', or '.' and '..' segments");
		dylibResolutionInputSchema = z.strictObject({
			roots: z.array(rootRelativePathSchema).min(1).optional(),
			architecture: z.enum([
				"arm64",
				"arm64e",
				"x86_64"
			]).optional()
		});
		dependencyCommandSchema = z.enum([
			"LC_LOAD_DYLIB",
			"LC_LOAD_WEAK_DYLIB",
			"LC_REEXPORT_DYLIB",
			"LC_LAZY_LOAD_DYLIB",
			"LC_LAZY_LOAD_DYLIB_INFO",
			"LC_LOAD_UPWARD_DYLIB"
		]);
		IMPLICIT_MACOS_PLATFORM = 1;
		MACOS_DYLD_IMPLICIT_PLATFORM_CPU_TYPES = new Set([
			7,
			16777223,
			16777228
		]);
		dependencySchema = z.strictObject({
			command: dependencyCommandSchema,
			encoding: z.enum([
				"dylib_command",
				"dylib_use_command",
				"lazy_load_dylib_info"
			]),
			install_name: z.string(),
			weak: z.boolean(),
			upward: z.boolean(),
			reexport: z.boolean(),
			delayed_init: z.boolean(),
			/**
			* Null for `lazy_load_dylib_info`: that payload has no version fields.
			* Classic dylib commands still carry both versions.
			*/
			current_version: z.string().nullable(),
			compatibility_version: z.string().nullable()
		});
		machoSliceSchema = z.strictObject({
			architecture: z.string().min(1),
			hidden: z.boolean().exactOptional(),
			/** Physical identity observed in the thin header and, for FAT, its table. */
			slice_offset: z.int().nonnegative(),
			slice_size: z.int().positive(),
			cpu_type: z.int().nonnegative(),
			cpu_subtype: z.int().nonnegative(),
			fat_cpu_type: z.int().nonnegative().nullable(),
			fat_cpu_subtype: z.int().nonnegative().nullable(),
			fat_alignment_exponent: z.int().nonnegative().nullable(),
			file_type: z.enum([
				"execute",
				"dylib",
				"bundle",
				"other"
			]),
			file_type_code: z.int().nonnegative(),
			/** Raw LC_BUILD_VERSION platform number; null means no such command was observed. */
			platform: z.int().nonnegative().nullable(),
			/** Every distinct build platform declared by LC_BUILD_VERSION/version-min commands. */
			platforms: z.array(z.int().nonnegative()),
			install_name: z.string().nullable(),
			dependencies: z.array(dependencySchema),
			rpaths: z.array(z.string()),
			dyld_environment: z.array(z.string()),
			code_signature_present: z.boolean()
		});
		machoImageSlices = (facts) => facts.hiddenSlices === undefined ? facts.slices : [...facts.slices, ...facts.hiddenSlices];
		candidateSchema = z.strictObject({
			path: z.string(),
			source: z.enum([
				"literal",
				"executable_path",
				"loader_path",
				"rpath",
				"already-loaded"
			]),
			rpath: z.string().nullable(),
			rpath_owner: z.string().nullable(),
			outcome: z.enum([
				"resolved",
				"absent",
				"not-mach-o",
				"malformed",
				"unsupported",
				"architecture-missing",
				"not-loadable",
				"platform-mismatch",
				"outside-target",
				"escapes-target",
				"undetermined"
			]),
			resolved_path: z.string().nullable(),
			platform_basis: z.enum(["macos-dyld-implicit"]).optional()
		});
		edgeSchema = z.strictObject({
			root: z.string(),
			architecture: z.string(),
			loader: z.string(),
			via: z.array(z.string()),
			...dependencySchema.shape,
			candidates: z.array(candidateSchema),
			resolution: z.strictObject({
				status: z.enum([
					"resolved",
					"conditional",
					"unresolved",
					"undetermined"
				]),
				image: z.string().nullable()
			}),
			install_name_matches: z.boolean().nullable(),
			/**
			* The loader was reached through a conditional edge, so it might not load;
			* this edge describes what happens only if it does.
			*/
			loader_conditional: z.boolean()
		});
		findingSchema = z.strictObject({
			kind: z.enum([
				"required-load-unresolved",
				"weak-load-unresolved",
				"lazy-load-unresolved",
				"earlier-rpath-candidate-absent",
				"dyld-environment-present"
			]),
			edge_index: z.int().nonnegative().nullable(),
			image: z.string().nullable(),
			basis: z.literal("derived"),
			explanation: z.string().min(1)
		});
		imageSchema = z.strictObject({
			path: z.string(),
			sha256: digestSchema,
			parse_status: z.enum([
				"parsed",
				"malformed",
				"unsupported"
			]),
			reason: z.string().nullable(),
			slices: z.array(machoSliceSchema.omit({ dependencies: true }))
		});
		dylibResolutionResultSchema = z.strictObject({
			root_path: z.string(),
			target_sha256: digestSchema,
			roots: z.array(z.strictObject({
				image: z.string(),
				architecture: z.string()
			})),
			images: z.array(imageSchema),
			edges: z.array(edgeSchema),
			findings: z.array(findingSchema),
			coverage: z.strictObject({
				status: z.enum(["complete", "partial"]),
				unparsed_images: z.array(z.string()),
				roots_without_architecture: z.array(z.string())
			}),
			limitations: z.array(z.string().min(1))
		});
		expandCandidatePath = (raw, ownerDirectory, context) => expandPrefix(raw, {
			ownerDirectory,
			executable: context.executable,
			rootRelativePath: (absolutePath) => context.view.rootRelativePath(absolutePath)
		});
		appendRpath = (base, rest) => {
			if (base === "") return rest;
			if (base === "/") return `/${rest}`;
			return `${base.replace(/\/+$/u, "")}/${rest}`;
		};
		candidateTemplates = (dependency, loader, context) => {
			const name = dependency.install_name;
			if (!name.startsWith("@rpath/")) {
				const source = name.startsWith("@executable_path") ? "executable_path" : name.startsWith("@loader_path") ? "loader_path" : "literal";
				return [{
					expansion: expandCandidatePath(name, directoryOf(loader), context),
					source,
					rpath: null,
					rpathOwner: null
				}];
			}
			const rest = name.slice("@rpath/".length);
			const owners = [...context.loaded.get(loader)?.chain ?? [loader]].reverse();
			return owners.flatMap((owner) => (context.loaded.get(owner)?.slice.rpaths ?? []).map((rpath) => {
				const base = expandCandidatePath(rpath, directoryOf(owner), context);
				const lookupPath = base.scope === "target" ? base.lookupPath : undefined;
				const expansion = {
					scope: base.scope,
					path: base.scope === "outside" || lookupPath !== undefined ? appendRpath(base.path, rest) : `${base.path}${base.path === "" ? "" : "/"}${rest}`,
					...lookupPath === undefined ? {} : { lookupPath: appendRpath(lookupPath, rest) }
				};
				return {
					expansion,
					source: "rpath",
					rpath,
					rpathOwner: owner
				};
			}));
		};
		evaluateCandidate = async (template, context) => {
			const base = {
				path: template.expansion.path,
				source: template.source,
				rpath: template.rpath,
				rpath_owner: template.rpathOwner
			};
			if (template.expansion.scope === "outside") return {
				...base,
				outcome: "outside-target",
				resolved_path: null
			};
			if (template.expansion.scope === "undetermined") return {
				...base,
				outcome: "undetermined",
				resolved_path: null
			};
			const lookup = await resolveTreePath(context.view, template.expansion.lookupPath ?? template.expansion.path);
			if (lookup.kind === "escapes") return {
				...base,
				outcome: "escapes-target",
				resolved_path: null
			};
			if (lookup.kind === "undetermined") {
				context.undecodableSymlinkTargets.set(lookup.path, lookup.targetHex);
				return {
					...base,
					outcome: "undetermined",
					resolved_path: null
				};
			}
			if (lookup.kind !== "file") return {
				...base,
				outcome: "absent",
				resolved_path: null
			};
			const facts = await imageFacts(context, lookup.path);
			let outcome;
			if (facts.status !== "parsed") outcome = facts.status;
			else {
				const selection = compatibleSlice(machoImageSlices(facts), context.processIdentity);
				if (selection.kind === "unknown") outcome = "undetermined";
				else if (selection.kind === "missing") outcome = "architecture-missing";
				else if (selection.slice.file_type_code !== 6) outcome = "not-loadable";
				else {
					const { slice } = selection;
					const platformResult = platformLoadability(context, slice);
					outcome = platformResult.outcome === "compatible" ? "resolved" : platformResult.outcome === "incompatible" ? "platform-mismatch" : "undetermined";
					if (outcome === "undetermined") context.unknownPlatformCandidates.add(lookup.path);
					if (platformResult.basis !== undefined) {
						context.implicitMacOSPlatformCandidates.add(lookup.path);
						return {
							...base,
							outcome,
							resolved_path: lookup.path,
							platform_basis: platformResult.basis
						};
					}
				}
			}
			return {
				...base,
				outcome,
				resolved_path: lookup.path
			};
		};
		platformLoadability = (context, image) => {
			const { platforms: processPlatforms } = context;
			const { file_type_code: fileType, platforms: imagePlatforms } = image;
			let effectiveImagePlatforms = imagePlatforms;
			let basis;
			if (imagePlatforms.length === 0) {
				if (context.executable !== null && processPlatforms.length === 1 && processPlatforms[0] === IMPLICIT_MACOS_PLATFORM && MACOS_DYLD_IMPLICIT_PLATFORM_CPU_TYPES.has(image.cpu_type)) {
					effectiveImagePlatforms = [IMPLICIT_MACOS_PLATFORM];
					basis = "macos-dyld-implicit";
				} else return { outcome: "unknown" };
			}
			if (processPlatforms.length === 0) return { outcome: "unknown" };
			const outcomes = processPlatforms.map((processPlatform) => imageLoadabilityForPlatform(processPlatform, effectiveImagePlatforms, fileType, image.architecture));
			if (outcomes.every((outcome) => outcome === "compatible")) return {
				outcome: "compatible",
				...basis === undefined ? {} : { basis }
			};
			if (outcomes.every((outcome) => outcome === "incompatible")) return {
				outcome: "incompatible",
				...basis === undefined ? {} : { basis }
			};
			return {
				outcome: "unknown",
				...basis === undefined ? {} : { basis }
			};
		};
		imageLoadabilityForPlatform = (processPlatform, imagePlatforms, fileType, architecture) => {
			if (imagePlatforms.includes(processPlatform)) return "compatible";
			if (processPlatform === 6 && imagePlatforms.includes(1)) return "compatible";
			if (processPlatform === 2 && imagePlatforms.includes(6)) return "compatible";
			if (processPlatform === 2 && imagePlatforms.includes(11)) return "compatible";
			if (processPlatform === 7 && imagePlatforms.includes(12)) return "compatible";
			if (processPlatform === 1 && fileType === 2 && imagePlatforms.includes(6)) return "compatible";
			if (processPlatform === 2 && imagePlatforms.includes(1) && architecture.startsWith("arm64") || [
				7,
				8,
				9
			].includes(processPlatform) && imagePlatforms.includes(1)) return "unknown";
			if (isKnownPlatform(processPlatform) && imagePlatforms.every(isKnownPlatform)) return "incompatible";
			return "unknown";
		};
		isKnownPlatform = (platform) => platform >= 1 && platform <= 12;
		imageFacts = async (context, path) => {
			const known = context.images.get(path);
			if (known !== undefined) return known;
			const facts = await context.view.image(path);
			context.images.set(path, facts);
			return facts;
		};
		resolution = (candidates) => {
			let external = false;
			for (const candidate of candidates) {
				if (candidate.outcome === "resolved") return {
					status: external ? "conditional" : "resolved",
					image: candidate.resolved_path
				};
				if (candidate.outcome === "outside-target" || candidate.outcome === "escapes-target" || candidate.outcome === "unsupported" || candidate.outcome === "undetermined") external = true;
			}
			return {
				status: external ? "undetermined" : "unresolved",
				image: null
			};
		};
		resolveDependency = async (dependency, loader, context) => {
			const current = context.loaded.get(loader);
			const chain = current?.chain ?? [loader];
			const loaded = dependency.install_name.startsWith("@rpath/") ? context.byInstallName.get(dependency.install_name) : undefined;
			const candidates = [];
			if (loaded !== undefined) candidates.push({
				path: dependency.install_name,
				source: "already-loaded",
				rpath: null,
				rpath_owner: null,
				outcome: "resolved",
				resolved_path: loaded
			});
			else for (const template of candidateTemplates(dependency, loader, context)) {
				const candidate = await evaluateCandidate(template, context);
				candidates.push(candidate);
				if (candidate.outcome === "resolved") break;
			}
			const modeled = resolution(candidates);
			const searchUnknown = loaded === undefined && hasApplicableDyldOverrides(context.searchOverrides, dependency.install_name, modeled.image !== null);
			if (searchUnknown) context.environmentRoots.add(context.root);
			const searched = searchUnknown ? {
				...modeled,
				status: modeled.image === null ? "undetermined" : "conditional"
			} : modeled;
			const resolved = loaded !== undefined && context.loaded.get(loaded)?.conditional === true && searched.status === "resolved" ? {
				...searched,
				status: "conditional"
			} : searched;
			const image = resolved.image === null ? undefined : context.images.get(resolved.image);
			const selection = image?.status === "parsed" ? compatibleSlice(machoImageSlices(image), context.processIdentity) : undefined;
			const slice = selection?.kind === "selected" ? selection.slice : undefined;
			return {
				root: context.root,
				architecture: context.processIdentity.architecture,
				loader,
				via: [...chain],
				...dependency,
				candidates,
				resolution: resolved,
				install_name_matches: slice === undefined || slice.install_name === null ? null : slice.install_name === dependency.install_name,
				loader_conditional: current?.conditional ?? false
			};
		};
		traceProcess = async (context, rootSlice, signal) => {
			const edges = [];
			context.loaded.set(context.root, {
				slice: rootSlice,
				chain: [context.root],
				conditional: false
			});
			if (rootSlice.install_name !== null && rootSlice.install_name.startsWith("@rpath/")) context.byInstallName.set(rootSlice.install_name, context.root);
			const pending = [context.root];
			while (pending.length > 0) {
				if (signal?.aborted) throw new AnalysisCancelledError("trace_dylib_resolution", { cause: signal.reason });
				const loader = pending.pop() ?? "";
				const current = context.loaded.get(loader);
				if (current === undefined) continue;
				const created = [];
				for (const dependency of current.slice.dependencies) {
					const edge = await resolveDependency(dependency, loader, context);
					edges.push(edge);
					if (isLazyLoadCommand(dependency.command)) continue;
					const image = edge.resolution.image;
					if (image === null || context.loaded.has(image)) continue;
					const facts = context.images.get(image);
					const selection = facts?.status === "parsed" ? compatibleSlice(machoImageSlices(facts), context.processIdentity) : undefined;
					if (selection?.kind !== "selected") continue;
					const { slice } = selection;
					context.loaded.set(image, {
						slice,
						chain: [...current.chain, image],
						conditional: current.conditional || edge.resolution.status === "conditional"
					});
					if (slice.install_name !== null && slice.install_name.startsWith("@rpath/") && !context.byInstallName.has(slice.install_name)) context.byInstallName.set(slice.install_name, image);
					created.push(image);
				}
				pending.push(...created.reverse());
			}
			return edges;
		};
		projectTraceResult = (input) => {
			const reported = [...input.images.entries()].filter(([, facts]) => facts.status !== "not-mach-o").sort(([left], [right]) => compare(left, right));
			const unparsed = reported.filter(([, facts]) => facts.status !== "parsed").map(([path]) => path);
			return {
				roots: input.roots,
				images: reported.map(([path, facts]) => ({
					path,
					parse_status: facts.status === "not-mach-o" ? "unsupported" : facts.status,
					reason: facts.status === "parsed" || facts.status === "not-mach-o" ? null : facts.reason,
					slices: facts.status === "parsed" ? machoImageSlices(facts).map(withoutDependencies) : []
				})),
				edges: [...input.edges],
				findings: deriveFindings(input.edges, input.rootSlices),
				coverage: {
					status: unparsed.length === 0 && input.withoutArchitecture.length === 0 && input.environmentRoots.size === 0 && input.unknownPlatformCandidates.size === 0 && input.undecodableSymlinkTargets.size === 0 && input.rootEnumeration?.status !== "unknown" ? "complete" : "partial",
					unparsed_images: unparsed,
					roots_without_architecture: [...input.withoutArchitecture]
				},
				limitations: [
					...DYLIB_RESOLUTION_LIMITATIONS,
					...input.rootEnumeration?.limitations ?? [],
					...input.undecodableSymlinkTargets.size === 0 ? [] : [`Symlink targets cannot be represented as UTF-8; their paths and stored target bytes (hex) are ${JSON.stringify(Object.fromEntries(input.undecodableSymlinkTargets))}. Affected dependency resolution remains undetermined.`],
					...input.environmentRoots.size === 0 ? [] : [`Roots ${[...input.environmentRoots].join(", ")} request applicable image-selection inputs through LC_DYLD_ENVIRONMENT that are not modeled; affected dependencies or inserted images remain uncertain.`],
					...input.unknownPlatformCandidates.size === 0 ? [] : [`In-root dylib candidates ${[...input.unknownPlatformCandidates].sort(compare).join(", ")} have unknown platform compatibility and are not treated as incompatible. Their dependent graphs may be incomplete.`],
					...input.implicitMacOSPlatformCandidates.size === 0 ? [] : [`In-root dylib candidates ${[...input.implicitMacOSPlatformCandidates].sort(compare).join(", ")} have no observed platform load command; macOS compatibility was derived from dyld's implicit-platform rule for an executable root with explicit macOS platform and a supported CPU type. Reported platform facts remain unchanged.`]
				]
			};
		};
		traceDylibLoading = async (view, request) => {
			const images = new Map();
			for (const path of request.unclassified ?? []) images.set(path, await view.image(path));
			const roots = [];
			const rootSlices = [];
			const edges = [];
			const withoutArchitecture = [];
			const environmentRoots = new Set();
			const unknownPlatformCandidates = new Set();
			const undecodableSymlinkTargets = new Map();
			const implicitMacOSPlatformCandidates = new Set();
			for (const root of request.roots) {
				const facts = await view.image(root);
				images.set(root, facts);
				if (facts.status !== "parsed") continue;
				const slices = machoImageSlices(facts).filter(({ architecture }) => request.architecture === undefined || machoArchitectureFamily(architecture) === request.architecture);
				if (slices.length === 0) withoutArchitecture.push(root);
				for (const slice of slices) {
					const executable = slice.file_type === "execute" ? root : null;
					const searchOverrides = executable === null ? [] : embeddedDyldOverrides(slice.dyld_environment, slice.platforms);
					if (searchOverrides.some(({ variable, value }) => variable === "DYLD_INSERT_LIBRARIES" && value !== "")) environmentRoots.add(root);
					roots.push({
						image: root,
						architecture: slice.architecture
					});
					rootSlices.push({
						image: root,
						slice
					});
					edges.push(...await traceProcess({
						view,
						root,
						processIdentity: {
							architecture: slice.architecture,
							cpu_type: slice.cpu_type,
							cpu_subtype: slice.cpu_subtype
						},
						searchOverrides,
						environmentRoots,
						unknownPlatformCandidates,
						undecodableSymlinkTargets,
						implicitMacOSPlatformCandidates,
						platforms: slice.platforms,
						executable,
						loaded: new Map(),
						byInstallName: new Map(),
						images
					}, slice, request.signal));
				}
			}
			return projectTraceResult({
				images,
				roots,
				rootSlices,
				edges,
				withoutArchitecture,
				environmentRoots,
				unknownPlatformCandidates,
				undecodableSymlinkTargets,
				implicitMacOSPlatformCandidates,
				rootEnumeration: request.rootEnumeration
			});
		};
		withoutDependencies = (slice) => ({
			architecture: slice.architecture,
			...slice.hidden === undefined ? {} : { hidden: slice.hidden },
			slice_offset: slice.slice_offset,
			slice_size: slice.slice_size,
			cpu_type: slice.cpu_type,
			cpu_subtype: slice.cpu_subtype,
			fat_cpu_type: slice.fat_cpu_type,
			fat_cpu_subtype: slice.fat_cpu_subtype,
			fat_alignment_exponent: slice.fat_alignment_exponent,
			file_type: slice.file_type,
			file_type_code: slice.file_type_code,
			platform: slice.platform,
			platforms: slice.platforms,
			install_name: slice.install_name,
			rpaths: slice.rpaths,
			dyld_environment: slice.dyld_environment,
			code_signature_present: slice.code_signature_present
		});
		compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
	})))();
}

//#endregion
//#region dist/contracts/decompileDirectory.js
var DECOMPILE_DIRECTORY_JOURNAL_NAME, DECOMPILE_DIRECTORY_INDEX_NAME, DECOMPILE_DIRECTORY_FUNCTIONS_DIRECTORY, DECOMPILE_DIRECTORY_VERSION, DECOMPILE_DIRECTORY_INLINE_FAILURE_LIMIT, DECOMPILE_DIRECTORY_INLINE_FAILURE_BYTES, layoutSchema, exportProviderSchema, bodySchema, functionStatusSchema, failureFields, failureSchema, countSchema, decompileDirectoryInputSchema, decompileDirectoryManifestSchema, decompileDirectoryFunctionSchema, decompileJournalHeaderSchema, decompileJournalFunctionSchema, decompileJournalLineSchema, decompileSelectionSchema, decompileLatestRunSchema, decompileDirectoryIndexSchema, isDecompileFunctionRelativePath;
function init_decompileDirectory() {
	return (init_decompileDirectory = __esmMin((() => {
		init_digests();
		init_localPath();
		init_analysisSource();
		DECOMPILE_DIRECTORY_JOURNAL_NAME = "decompile-journal.jsonl";
		DECOMPILE_DIRECTORY_INDEX_NAME = "decompile-index.json";
		DECOMPILE_DIRECTORY_FUNCTIONS_DIRECTORY = "functions";
		DECOMPILE_DIRECTORY_VERSION = 1;
		DECOMPILE_DIRECTORY_INLINE_FAILURE_LIMIT = 32;
		DECOMPILE_DIRECTORY_INLINE_FAILURE_BYTES = 2048;
		layoutSchema = z.enum(["address", "dwarf"]);
		exportProviderSchema = z.strictObject({
			id: z.string().min(1),
			name: z.string().min(1),
			version: z.string().min(1).nullable()
		});
		bodySchema = z.discriminatedUnion("available", [z.strictObject({
			available: z.literal(false),
			reason: z.string().min(1)
		}), z.strictObject({
			available: z.literal(true),
			ranges: z.array(z.strictObject({
				start: z.string().min(1),
				end: z.string().min(1).describe("Inclusive last address of this body range.")
			})),
			non_contiguous: z.boolean()
		})]);
		functionStatusSchema = z.enum([
			"written",
			"failed",
			"external"
		]);
		failureFields = {
			address: z.string().min(1),
			code: z.string().min(1),
			message: z.string().min(1)
		};
		failureSchema = z.union([z.strictObject({
			...failureFields,
			name: z.string().nullable().describe("Observed name, or null when unknown.")
		}), z.strictObject(failureFields).describe("Name omitted to fit the inline text budget; the index retains the full observed name.")]);
		countSchema = (description) => z.number().int().min(0).describe(description);
		decompileDirectoryInputSchema = z.strictObject({
			output_directory: absoluteLocalPathStringSchema.describe("Absolute output directory. The parent must exist. The directory itself must be absent unless resume is true. One run at a time may use a directory; a second run is refused while the first holds it."),
			layout: layoutSchema.default("address").describe("address names files by canonical address. dwarf asks for compilation-unit paths and is reported unavailable when the provider has no such fact."),
			resume: z.boolean().default(false).describe("Continue a journal for the same target SHA-256, provider, analysis profile, and layout. Both digests must be known. Verified files and functions recorded as external are skipped, conflicting files are left unchanged, and functions not yet tried run before retries of recorded failures."),
			name: z.string().min(1).optional().describe("Case-sensitive literal substring of the provider function name."),
			namespace: z.string().min(1).optional().describe("Case-sensitive prefix of the provider function name, including any separator such as Foo:: or Class."),
			address_start: z.string().min(1).optional().describe("Inclusive lower bound as 0xoffset or space:0xoffset. Must use the same address space as address_end."),
			address_end: z.string().min(1).optional().describe("Inclusive upper bound as 0xoffset or space:0xoffset. Must use the same address space as address_start."),
			limit: z.number().int().min(1).optional().describe("Maximum functions to attempt on this call after skipping verified files and functions recorded as external. Further matches remain for a later resume.")
		});
		decompileDirectoryManifestSchema = z.strictObject({
			output_directory: z.string().min(1).describe("Absolute directory containing the function files."),
			index_path: z.string().min(1).describe("Absolute path of the index. The index lists functions and does not contain pseudocode."),
			layout: layoutSchema,
			layout_status: z.enum(["address", "debug_layout_unavailable"]).describe("address when files are named by address on request. debug_layout_unavailable when dwarf was requested and no compilation-unit fact exists."),
			counts: z.strictObject({
				selected: countSchema("Functions matching the filter."),
				excluded: countSchema("Inventory functions excluded by the filter."),
				requested: countSchema("Functions this call attempted."),
				written: countSchema("Function files created by this call."),
				failed: countSchema("Functions this call could not write."),
				external: countSchema("Functions this call found procedure_info classifies as external. No file is written and no pseudocode is requested. A function without a matching procedure_info classification is decompiled as usual."),
				skipped: countSchema("Selected functions already settled: existing files that still hold the same bytes, whether recorded in the journal or found on disk, and functions the journal records as external."),
				remaining: countSchema("Selected functions not attempted because the limit was reached.")
			}),
			failures: z.array(failureSchema).max(32).describe("At most 32 failure details within 2,048 JSON-encoded UTF-8 bytes. Names may be omitted to preserve addresses and reasons; the index retains complete records."),
			failures_omitted: countSchema("Failure records omitted from failures because of the inline count or encoded-text budget."),
			provider: exportProviderSchema.describe("Provider that produced the pseudocode."),
			analysis_profile_digest: digestSchema.nullable().describe("Provider analysis-profile digest, or null when the provider did not commit one."),
			target_sha256: digestSchema.nullable().describe("SHA-256 of the analyzed target, or null when the observation has no file subject."),
			inventory_limitations: z.array(z.string()).describe("Limitations reported by this call's procedure inventory. They describe the selection that produced this run, not every historical function record in the directory."),
			limitations: z.array(z.string()).describe("Limits of this export. Pseudocode is not included."),
			resume: z.boolean().describe("Whether this call continued a journal.")
		}).superRefine((manifest, context) => {
			const { counts } = manifest;
			if (counts.written + counts.failed + counts.external !== counts.requested) context.addIssue({
				code: "custom",
				path: ["counts", "requested"],
				message: "requested must equal written plus failed plus external"
			});
			if (counts.requested + counts.skipped + counts.remaining !== counts.selected) context.addIssue({
				code: "custom",
				path: ["counts", "selected"],
				message: "selected must equal requested plus skipped plus remaining"
			});
			if (manifest.failures.length + manifest.failures_omitted !== counts.failed) context.addIssue({
				code: "custom",
				path: ["failures_omitted"],
				message: "failures plus failures_omitted must equal failed"
			});
		});
		decompileDirectoryFunctionSchema = z.strictObject({
			address: z.string().min(1),
			name: z.string().nullable(),
			status: functionStatusSchema,
			relative_path: z.string().min(1).refine((path) => isDecompileFunctionRelativePath(path), "Function paths must remain inside functions/.").optional(),
			sha256: digestSchema.optional(),
			/** Source of this attempt's pseudocode observation; a matched file's original producer remains unknown. */
			provider_source: z.discriminatedUnion("status", [z.strictObject({
				status: z.literal("reported"),
				source: analysisSourceDescriptorSchema
			}), z.strictObject({
				status: z.literal("unknown"),
				reason: z.enum(["source_not_available", "existing_file_origin_unknown"])
			})]).optional(),
			body: bodySchema,
			failure: z.strictObject({
				code: z.string().min(1),
				message: z.string().min(1)
			}).optional(),
			/** Complete provider caveats of the observations this attempt used. */
			limitations: z.array(z.string().min(1)).min(1).optional()
		}).superRefine((record, context) => {
			const valid = record.status === "written" ? record.relative_path !== undefined && record.sha256 !== undefined : record.status === "failed" ? record.failure !== undefined : record.relative_path === undefined && record.sha256 === undefined && record.failure === undefined;
			if (!valid) context.addIssue({
				code: "custom",
				path: ["status"],
				message: "Function record fields do not match its status."
			});
		});
		decompileJournalHeaderSchema = z.strictObject({
			kind: z.literal("header"),
			version: z.literal(1),
			target_sha256: digestSchema.nullable(),
			provider: exportProviderSchema,
			analysis_profile_digest: digestSchema.nullable(),
			layout: layoutSchema
		});
		decompileJournalFunctionSchema = decompileDirectoryFunctionSchema.safeExtend({ kind: z.literal("function") });
		decompileJournalLineSchema = z.discriminatedUnion("kind", [decompileJournalHeaderSchema, decompileJournalFunctionSchema]);
		decompileSelectionSchema = z.strictObject({
			name: z.string().nullable(),
			namespace: z.string().nullable(),
			address_start: z.string().nullable(),
			address_end: z.string().nullable(),
			limit: z.number().int().min(1).nullable()
		});
		decompileLatestRunSchema = z.strictObject({
			resume: z.boolean(),
			selected: countSchema("Functions matching this run's filter."),
			excluded: countSchema("Inventory functions excluded by this run's filter."),
			selection: decompileSelectionSchema,
			inventory_limitations: z.array(z.string())
		});
		decompileDirectoryIndexSchema = z.strictObject({
			version: z.literal(1),
			target_sha256: digestSchema.nullable(),
			provider: exportProviderSchema,
			analysis_profile_digest: digestSchema.nullable(),
			layout: layoutSchema,
			layout_status: z.enum(["address", "debug_layout_unavailable"]),
			latest_run: decompileLatestRunSchema.optional().describe("Selection and inventory limitations owned by the run that last rewrote this index. Absent in indexes written before this field existed."),
			limitations: z.array(z.string()),
			functions: z.array(decompileDirectoryFunctionSchema)
		});
		isDecompileFunctionRelativePath = (value) => {
			if (value.includes("\\") || value.includes("\0")) return false;
			const [directory, name, extra] = value.split("/");
			return extra === undefined && directory === "functions" && name !== undefined && /^[A-Za-z0-9._-]+\.c$/u.test(name);
		};
	})))();
}

//#endregion
//#region dist/domain/electron/electronFuses.js
var ELECTRON_FUSE_SENTINEL, ELECTRON_FUSE_STATE_BYTES, ELECTRON_FUSE_V1_NAMES, FUSE_IMPLICATIONS, OTHER_MEANS_LIMITATION, MISSING_SENTINEL_LIMITATION, byteSchema, fuseStateSchema, electronFuseSchema, electronFuseSentinelSchema, electronFuseSliceSchema, implicationLocation, electronFuseImplicationSchema, electronFuseReportSchema, inspectElectronFusesInputSchema, electronFuseState, electronFuseName, describeElectronFuseFindings, embeddedAsarIntegrityApplies, describeSentinel, implicationFor, validateReportBounds, implicationKey, validateSentinel;
function init_electronFuses() {
	return (init_electronFuses = __esmMin((() => {
		init_digests();
		init_localPath();
		ELECTRON_FUSE_SENTINEL = "dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX";
		ELECTRON_FUSE_STATE_BYTES = {
			disabled: 48,
			enabled: 49,
			removed: 114
		};
		ELECTRON_FUSE_V1_NAMES = [
			"RunAsNode",
			"EnableCookieEncryption",
			"EnableNodeOptionsEnvironmentVariable",
			"EnableNodeCliInspectArguments",
			"EnableEmbeddedAsarIntegrityValidation",
			"OnlyLoadAppFromAsar",
			"LoadBrowserProcessSpecificV8Snapshot",
			"GrantFileProtocolExtraPrivileges",
			"WasmTrapHandlers"
		];
		FUSE_IMPLICATIONS = [
			{
				subject: "node_cli_inspect_arguments",
				fuseIndex: 3,
				enabled: "honored",
				inactive: "not_honored"
			},
			{
				subject: "electron_run_as_node",
				fuseIndex: 0,
				enabled: "honored",
				inactive: "not_honored"
			},
			{
				subject: "embedded_asar_integrity_validation",
				fuseIndex: 4,
				enabled: "enforced",
				inactive: "not_enforced"
			},
			{
				subject: "only_load_app_from_asar",
				fuseIndex: 5,
				enabled: "restricted_to_app_asar",
				inactive: "not_restricted_to_app_asar"
			}
		];
		OTHER_MEANS_LIMITATION = "Fuse state does not prove the application enables Inspector through other means, such as app.commandLine or a remote-debugging switch in application code.";
		MISSING_SENTINEL_LIMITATION = "A missing sentinel means fuse state is unknown, not that every fuse is disabled.";
		byteSchema = z.int().min(0).max(255);
		fuseStateSchema = z.enum([
			"enabled",
			"disabled",
			"removed",
			"unknown"
		]);
		electronFuseSchema = z.strictObject({
			index: z.int().nonnegative(),
			name: z.string().min(1).nullable(),
			state: fuseStateSchema,
			raw_byte: byteSchema
		});
		electronFuseSentinelSchema = z.strictObject({
			sentinel_offset: z.int().nonnegative(),
			wire_version: byteSchema.nullable(),
			declared_length: byteSchema.nullable(),
			fuses: z.array(electronFuseSchema),
			complete: z.boolean()
		});
		electronFuseSliceSchema = z.strictObject({
			index: z.int().nonnegative(),
			file_offset: z.int().nonnegative(),
			size: z.int().nonnegative(),
			architecture: z.string().min(1).nullable(),
			hidden: z.boolean().exactOptional(),
			sentinel_count: z.int().nonnegative(),
			sentinels: z.array(electronFuseSentinelSchema)
		});
		implicationLocation = {
			relationship: z.literal("derivation"),
			slice_index: z.int().nonnegative(),
			sentinel_offset: z.int().nonnegative()
		};
		electronFuseImplicationSchema = z.discriminatedUnion("subject", [
			z.strictObject({
				...implicationLocation,
				subject: z.literal("node_cli_inspect_arguments"),
				fuse_index: z.literal(3),
				outcome: z.enum([
					"honored",
					"not_honored",
					"unknown"
				])
			}),
			z.strictObject({
				...implicationLocation,
				subject: z.literal("electron_run_as_node"),
				fuse_index: z.literal(0),
				outcome: z.enum([
					"honored",
					"not_honored",
					"unknown"
				])
			}),
			z.strictObject({
				...implicationLocation,
				subject: z.literal("embedded_asar_integrity_validation"),
				fuse_index: z.literal(4),
				outcome: z.enum([
					"enforced",
					"not_enforced",
					"unknown"
				])
			}),
			z.strictObject({
				...implicationLocation,
				subject: z.literal("only_load_app_from_asar"),
				fuse_index: z.literal(5),
				outcome: z.enum([
					"restricted_to_app_asar",
					"not_restricted_to_app_asar",
					"unknown"
				])
			})
		]);
		electronFuseReportSchema = z.strictObject({
			artifact: z.strictObject({
				selected_path: localPathStringSchema,
				resolved_path: localPathStringSchema,
				sha256: digestSchema,
				bytes: z.int().nonnegative(),
				format: z.enum([
					"mach-o",
					"mach-o-universal",
					"pe",
					"elf"
				])
			}).describe("Caller-selected path, resolved regular file, and the container that was read"),
			slices: z.array(electronFuseSliceSchema).describe("One entry per universal Mach-O slice, or a single entry for a thin Mach-O, PE, or ELF file. Sentinel offsets are file-absolute."),
			runtime_implications: z.array(electronFuseImplicationSchema).describe("Derivations from version-1 fuse bytes. Each entry names the fuse index it came from."),
			limitations: z.array(z.string().min(1))
		}).superRefine((report, context) => {
			validateReportBounds(report, context);
		});
		inspectElectronFusesInputSchema = z.strictObject({ path: absoluteLocalPathStringSchema.describe("Absolute filesystem path to a macOS .app bundle, Electron Framework binary, Windows PE executable, or Linux ELF executable") });
		electronFuseState = (byte) => {
			if (byte === ELECTRON_FUSE_STATE_BYTES.disabled) return "disabled";
			if (byte === ELECTRON_FUSE_STATE_BYTES.enabled) return "enabled";
			if (byte === ELECTRON_FUSE_STATE_BYTES.removed) return "removed";
			return "unknown";
		};
		electronFuseName = (wireVersion, index) => wireVersion === 1 ? ELECTRON_FUSE_V1_NAMES[index] ?? null : null;
		describeElectronFuseFindings = (slices, container) => {
			const runtime_implications = [];
			const limitations = [OTHER_MEANS_LIMITATION, MISSING_SENTINEL_LIMITATION];
			for (const slice of slices) {
				if (slice.sentinel_count === 0) limitations.push(`Slice ${slice.index} at file offset ${slice.file_offset} contains no Electron fuse sentinel; fuse state for that slice is unknown, not disabled.`);
				else if (slice.sentinel_count > 1) limitations.push(`Slice ${slice.index} at file offset ${slice.file_offset} contains ${slice.sentinel_count} Electron fuse sentinels; every sentinel is reported and none is selected.`);
				for (const sentinel of slice.sentinels) describeSentinel(slice.index, sentinel, container, runtime_implications, limitations);
			}
			return {
				runtime_implications,
				limitations
			};
		};
		embeddedAsarIntegrityApplies = (container) => container === "mach-o" || container === "mach-o-universal" || container === "pe";
		describeSentinel = (sliceIndex, sentinel, container, implications, limitations) => {
			if (!sentinel.complete) limitations.push(`Electron fuse wire at file offset ${sentinel.sentinel_offset} is truncated; fuse bytes past the slice stay unknown.`);
			if (sentinel.wire_version === null) return;
			if (sentinel.wire_version !== 1) {
				limitations.push(`Electron fuse wire at file offset ${sentinel.sentinel_offset} uses wire version ${sentinel.wire_version}; version 1 is the only pinned name table, so runtime implications for this wire are unknown.`);
				return;
			}
			for (const spec of FUSE_IMPLICATIONS) {
				const fuse = sentinel.fuses.find((item) => item.index === spec.fuseIndex);
				if (fuse === undefined) {
					limitations.push(`Electron fuse wire at file offset ${sentinel.sentinel_offset} does not include fuse index ${spec.fuseIndex}; that runtime implication is unknown.`);
					continue;
				}
				const applicabilityUnknown = spec.subject === "embedded_asar_integrity_validation" && !embeddedAsarIntegrityApplies(container);
				if (applicabilityUnknown) limitations.push(`Electron compiles embedded ASAR integrity validation only on macOS and Windows; the observed fuse byte at file offset ${sentinel.sentinel_offset} does not establish enforcement.`);
				implications.push(implicationFor(spec, applicabilityUnknown ? "unknown" : fuse.state, {
					slice_index: sliceIndex,
					sentinel_offset: sentinel.sentinel_offset
				}));
			}
		};
		implicationFor = (spec, state, location) => {
			const outcome = state === "enabled" ? spec.enabled : state === "unknown" ? "unknown" : spec.inactive;
			return {
				relationship: "derivation",
				subject: spec.subject,
				fuse_index: spec.fuseIndex,
				outcome,
				...location
			};
		};
		validateReportBounds = (report, context) => {
			const size = report.artifact.bytes;
			for (const [sliceIndex, slice] of report.slices.entries()) {
				if (slice.index !== sliceIndex) context.addIssue({
					code: "custom",
					path: [
						"slices",
						sliceIndex,
						"index"
					],
					message: "Slice index does not match its position in the report."
				});
				if (slice.sentinel_count !== slice.sentinels.length) context.addIssue({
					code: "custom",
					path: [
						"slices",
						sliceIndex,
						"sentinel_count"
					],
					message: "Sentinel count does not match the reported sentinels."
				});
				if (slice.file_offset > size || slice.size > size - slice.file_offset) context.addIssue({
					code: "custom",
					path: ["slices", sliceIndex],
					message: "Slice range extends outside the selected artifact."
				});
				for (const [sentinelIndex, sentinel] of slice.sentinels.entries()) validateSentinel(slice, sentinel, sliceIndex, sentinelIndex, context);
			}
			const expected = new Set(describeElectronFuseFindings(report.slices, report.artifact.format).runtime_implications.map(implicationKey));
			for (const [index, implication] of report.runtime_implications.entries()) {
				if (!expected.has(implicationKey(implication))) context.addIssue({
					code: "custom",
					path: ["runtime_implications", index],
					message: "Runtime implication is not supported by the reported fuse bytes and applicability."
				});
				const slice = report.slices[implication.slice_index];
				if (slice?.sentinels.some((sentinel) => sentinel.sentinel_offset === implication.sentinel_offset) !== true) context.addIssue({
					code: "custom",
					path: ["runtime_implications", index],
					message: "Runtime implication does not reference a reported sentinel."
				});
			}
		};
		implicationKey = (fact) => JSON.stringify([
			fact.slice_index,
			fact.sentinel_offset,
			fact.subject,
			fact.fuse_index,
			fact.outcome
		]);
		validateSentinel = (slice, sentinel, sliceIndex, sentinelIndex, context) => {
			const sentinelEnd = sentinel.sentinel_offset + ELECTRON_FUSE_SENTINEL.length;
			const wireEnd = sentinelEnd + (sentinel.wire_version === null ? 0 : 1) + (sentinel.declared_length === null ? 0 : 1) + sentinel.fuses.length;
			if (wireEnd > slice.file_offset + slice.size) context.addIssue({
				code: "custom",
				path: [
					"slices",
					sliceIndex,
					"sentinels",
					sentinelIndex
				],
				message: "Reported wire header or fuse bytes extend outside the slice."
			});
			if (sentinel.sentinel_offset < slice.file_offset || sentinelEnd > slice.file_offset + slice.size) context.addIssue({
				code: "custom",
				path: [
					"slices",
					sliceIndex,
					"sentinels",
					sentinelIndex,
					"sentinel_offset"
				],
				message: "Sentinel is outside its slice."
			});
			if (sentinel.wire_version === null && sentinel.declared_length !== null) context.addIssue({
				code: "custom",
				path: [
					"slices",
					sliceIndex,
					"sentinels",
					sentinelIndex,
					"declared_length"
				],
				message: "A wire without a version byte cannot declare a fuse count."
			});
			if (sentinel.complete && (sentinel.declared_length === null || sentinel.fuses.length !== sentinel.declared_length)) context.addIssue({
				code: "custom",
				path: [
					"slices",
					sliceIndex,
					"sentinels",
					sentinelIndex,
					"complete"
				],
				message: "A complete wire must contain every declared fuse byte."
			});
			if (!sentinel.complete && sentinel.declared_length !== null && sentinel.fuses.length >= sentinel.declared_length) context.addIssue({
				code: "custom",
				path: [
					"slices",
					sliceIndex,
					"sentinels",
					sentinelIndex,
					"complete"
				],
				message: "An incomplete wire must omit at least one declared fuse byte."
			});
			for (const [fuseIndex, fuse] of sentinel.fuses.entries()) {
				if (fuse.index !== fuseIndex) context.addIssue({
					code: "custom",
					path: [
						"slices",
						sliceIndex,
						"sentinels",
						sentinelIndex,
						"fuses",
						fuseIndex,
						"index"
					],
					message: "Fuse index does not match its wire position."
				});
				if (fuse.state !== electronFuseState(fuse.raw_byte)) context.addIssue({
					code: "custom",
					path: [
						"slices",
						sliceIndex,
						"sentinels",
						sentinelIndex,
						"fuses",
						fuseIndex,
						"state"
					],
					message: "Fuse state does not match its raw byte."
				});
				if (sentinel.wire_version !== null && fuse.name !== electronFuseName(sentinel.wire_version, fuse.index)) context.addIssue({
					code: "custom",
					path: [
						"slices",
						sliceIndex,
						"sentinels",
						sentinelIndex,
						"fuses",
						fuseIndex,
						"name"
					],
					message: "Fuse name does not match the pinned version-1 table."
				});
			}
		};
	})))();
}

//#endregion
//#region dist/domain/firmware/espPartitionTable.js
var ESP_PARTITION_TABLE_DEFAULT_OFFSET, ESP_PARTITION_TABLE_SECTOR_BYTES, ESP_PARTITION_TABLE_MAX_BYTES, ENTRY_BYTES, MAX_ENTRIES, PARTITION_MAGIC, MD5_MAGIC, END_MAGIC, END_TYPE, MD5_DIGEST_OFFSET, KNOWN_FLAGS, partition, decodeEspPartitionTable, TYPE_NAMES, SUBTYPE_NAMES, espPartitionTypeName, espPartitionSubtypeName, APP_TYPE, OTA_DATA_SUBTYPE, DATA_TYPE, BOOTLOADER_TYPE, PARTITION_TABLE_TYPE, PRIMARY_SUBTYPE, OTA_APP_SUBTYPE_FLAG, OTA_APP_SUBTYPE_MASK, espOtaAppSlot, isEspFactoryApp, isEspOtaData, isEspAppPartition, espPrimaryLayoutRole, espBootPartitions;
function init_espPartitionTable() {
	return (init_espPartitionTable = __esmMin((() => {
		init_result();
		init_espImageStructures();
		ESP_PARTITION_TABLE_DEFAULT_OFFSET = 32768;
		ESP_PARTITION_TABLE_SECTOR_BYTES = 4096;
		ESP_PARTITION_TABLE_MAX_BYTES = 3072;
		ENTRY_BYTES = 32;
		MAX_ENTRIES = ESP_PARTITION_TABLE_MAX_BYTES / ENTRY_BYTES;
		PARTITION_MAGIC = 20650;
		MD5_MAGIC = 60395;
		END_MAGIC = 65535;
		END_TYPE = 255;
		MD5_DIGEST_OFFSET = 16;
		KNOWN_FLAGS = 3;
		partition = (entry, index, entryOffset) => {
			const flags = u32(entry, 28);
			const labelBytes = entry.subarray(12, 28);
			const label = cString(labelBytes);
			return {
				index,
				entryOffset,
				type: entry[2] ?? 0,
				subtype: entry[3] ?? 0,
				offset: u32(entry, 4),
				size: u32(entry, 8),
				label,
				labelHex: label === null ? hex$1(cStringBytes(labelBytes)) : null,
				encrypted: (flags & 1) !== 0,
				readonly: (flags & 2) !== 0,
				unknownFlags: (flags & ~KNOWN_FLAGS) >>> 0
			};
		};
		decodeEspPartitionTable = (bytes) => {
			const partitions = [];
			const limitations = [];
			let md5 = {
				status: "absent",
				entryOffset: null,
				stored: null,
				computed: null
			};
			for (let slot = 0; slot < MAX_ENTRIES; slot += 1) {
				const at = slot * ENTRY_BYTES;
				const entry = bytes.subarray(at, at + ENTRY_BYTES);
				if (entry.length < ENTRY_BYTES) return err(`the bytes end at ${offsetText(at + entry.length)}, inside entry ${String(slot)}`);
				const magic = u16(entry, 0);
				if (magic === PARTITION_MAGIC) {
					partitions.push(partition(entry, partitions.length, at));
					continue;
				}
				if (magic === MD5_MAGIC) {
					const computed = createHash("md5").update(bytes.subarray(0, at)).digest("hex");
					const stored = hex$1(entry.subarray(MD5_DIGEST_OFFSET, ENTRY_BYTES));
					if (md5.status !== "absent") {
						limitations.push(`The partition table has a second MD5 entry at ${offsetText(at)}; ESP-IDF allows one and rejects the table.`);
						md5 = {
							...md5,
							status: "invalid"
						};
						continue;
					}
					md5 = {
						status: stored === computed ? "valid" : "invalid",
						entryOffset: at,
						stored,
						computed
					};
					if (stored !== computed) limitations.push(`The partition table MD5 at ${offsetText(at)} does not match the entries before it; ESP-IDF's bootloader rejects the table.`);
					continue;
				}
				const terminator = magic === END_MAGIC && entry[2] === END_TYPE && entry[3] === END_TYPE;
				if (terminator && partitions.length > 0) return ok({
					partitions,
					md5,
					length: at + ENTRY_BYTES,
					limitations
				});
				return err(slot === 0 && magic === END_MAGIC ? "the first entry is empty" : terminator ? `entry ${String(slot)} at ${offsetText(at)} ends the table before any partition entry` : `entry ${String(slot)} at ${offsetText(at)} has magic ${offsetText(magic)}, not a partition, MD5 or terminating entry`);
			}
			return err(`no terminating entry within ${String(MAX_ENTRIES)} entries (${offsetText(ESP_PARTITION_TABLE_MAX_BYTES)} bytes)`);
		};
		TYPE_NAMES = {
			0: "app",
			1: "data",
			2: "bootloader",
			3: "partition_table"
		};
		SUBTYPE_NAMES = {
			0: {
				0: "factory",
				32: "test",
				...Object.fromEntries(Array.from({ length: 16 }, (_, slot) => [16 + slot, `ota_${String(slot)}`])),
				48: "tee_0",
				49: "tee_1"
			},
			1: {
				0: "ota",
				1: "phy",
				2: "nvs",
				3: "coredump",
				4: "nvs_keys",
				5: "efuse",
				6: "undefined",
				128: "esphttpd",
				129: "fat",
				130: "spiffs",
				131: "littlefs",
				144: "tee_ota"
			},
			2: {
				0: "primary",
				1: "ota",
				2: "recovery"
			},
			3: {
				0: "primary",
				1: "ota"
			}
		};
		espPartitionTypeName = (type) => TYPE_NAMES[type] ?? null;
		espPartitionSubtypeName = (type, subtype) => SUBTYPE_NAMES[type]?.[subtype] ?? null;
		APP_TYPE = 0;
		OTA_DATA_SUBTYPE = 0;
		DATA_TYPE = 1;
		BOOTLOADER_TYPE = 2;
		PARTITION_TABLE_TYPE = 3;
		PRIMARY_SUBTYPE = 0;
		OTA_APP_SUBTYPE_FLAG = 16;
		OTA_APP_SUBTYPE_MASK = 15;
		espOtaAppSlot = (part) => part.type === APP_TYPE && (part.subtype & ~OTA_APP_SUBTYPE_MASK) === OTA_APP_SUBTYPE_FLAG ? part.subtype & OTA_APP_SUBTYPE_MASK : null;
		isEspFactoryApp = (part) => part.type === APP_TYPE && part.subtype === 0;
		isEspOtaData = (part) => part.type === DATA_TYPE && part.subtype === OTA_DATA_SUBTYPE;
		isEspAppPartition = (part) => part.type === APP_TYPE;
		espPrimaryLayoutRole = (part) => {
			if (part.subtype !== PRIMARY_SUBTYPE) return undefined;
			if (part.type === BOOTLOADER_TYPE) return "bootloader";
			return part.type === PARTITION_TABLE_TYPE ? "partition-table" : undefined;
		};
		espBootPartitions = (partitions) => {
			let factory;
			let otadata;
			let otaAppCount = 0;
			const otaSlots = new Map();
			const roles = new Map();
			for (const part of partitions) {
				const slot = espOtaAppSlot(part);
				const role = isEspFactoryApp(part) ? "factory" : isEspOtaData(part) ? "otadata" : slot === null ? undefined : `ota_${String(slot)}`;
				if (role === undefined) continue;
				roles.set(role, [...roles.get(role) ?? [], part]);
				if (role === "factory") factory = part;
				else if (role === "otadata") otadata = part;
				else if (slot !== null) {
					otaSlots.set(slot, part);
					otaAppCount += 1;
				}
			}
			const limitations = [...roles].flatMap(([role, parts]) => parts.length < 2 ? [] : [`The table declares ${role} ${String(parts.length)} times (partitions ${parts.map(({ index }) => `#${String(index)}`).join(", ")}); ESP-IDF's bootloader uses the last.`]);
			return {
				factory,
				otadata,
				otaSlots,
				otaAppCount,
				limitations
			};
		};
	})))();
}

//#endregion
//#region dist/domain/webRuntime.js
var SCRIPT_ID, RESOURCE_LINE, RESOURCE_COLUMN, START_LINE, START_COLUMN, webRuntimeScopeSchema, webRuntimeSourceSchema, webRuntimeLocationSchema, webRuntimeTargetSchema, WEB_RUNTIME_LIMITS;
function init_webRuntime() {
	return (init_webRuntime = __esmMin((() => {
		init_browserObservation();
		init_browserDeadline();
		init_jsonValue();
		init_cdpObservationSchemas();
		SCRIPT_ID = "CDP session script ID; empty for a position a request initiator reported, which has no session-script association for joining captured source or resource_start.";
		RESOURCE_LINE = "Zero-based line in the resource named by url, as reported by CDP: the script file for an external script (including a module-import initiator), or the HTML document for an inline script or parser markup.";
		RESOURCE_COLUMN = "Zero-based UTF-16 column on that line of the resource named by url, as reported by CDP. Chrome can report a negative column, for example on the first line of a script whose resource_start column is negative; it then does not locate a column in url.";
		START_LINE = "Zero-based line where the script text starts in its enclosing resource (the HTML document for an inline script).";
		START_COLUMN = "Zero-based UTF-16 column where the script text starts on that line of its enclosing resource. Chrome reports a negative column for some inline scripts; it is kept as reported and does not locate a column in that resource.";
		webRuntimeScopeSchema = z.strictObject({
			cdp_endpoint: browserEndpointSchema,
			allowed_origins: browserAllowedOriginsSchema,
			target_id: z.string().min(1),
			command_timeout_ms: webRuntimeCommandTimeoutSchema
		});
		webRuntimeSourceSchema = z.object({
			script_id: z.string().min(1),
			url: z.string(),
			execution_context_id: z.int().nullable(),
			reported_execution_context: jsonObjectSchema.nullable(),
			reported_script_context_aux_data: jsonObjectSchema.nullable(),
			frame_id: z.string().nullable(),
			producer_hash: z.string().nullable(),
			source_map_url: z.string().nullable(),
			has_source_url: z.boolean().nullable(),
			language: z.string().nullable(),
			resource_start: z.object({
				line_number: z.int().min(0).describe(START_LINE),
				column_number: cdpResourceColumnSchema.describe(START_COLUMN)
			}).nullable(),
			source: z.discriminatedUnion("state", [z.object({
				state: z.literal("captured"),
				text: z.string(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				utf8_bytes: z.int().min(0),
				utf16_units: z.int().min(0)
			}), z.object({
				state: z.enum(["unavailable", "excluded"]),
				reason: z.string().min(1)
			})])
		});
		webRuntimeLocationSchema = z.object({
			script_id: z.string().describe(SCRIPT_ID),
			url: z.string().nullable(),
			line_number: z.int().min(0).describe(RESOURCE_LINE),
			column_number: cdpResourceColumnSchema.nullable().describe(RESOURCE_COLUMN),
			function_name: z.string().nullable(),
			source_association: z.enum(["script_id", "unknown"])
		});
		webRuntimeTargetSchema = z.object({
			target_id: z.string().min(1),
			origin: z.string().min(1),
			initial_url: z.string(),
			frame_id: z.string().min(1),
			loader_id: z.string().nullable()
		});
		WEB_RUNTIME_LIMITS = {
			protocolBytes: 64 * 1024 * 1024,
			retainedEventBytes: 8 * 1024 * 1024,
			sourceBytes: 32 * 1024 * 1024,
			commandTimeoutMs: DEFAULT_CDP_COMMAND_TIMEOUT_MS,
			cleanupTimeoutMs: CDP_CLEANUP_GRACE_MS
		};
	})))();
}

//#endregion
//#region dist/domain/browserScenarioValues.js
var scenarioIdentifierSchema, BROWSER_SCENARIO_START_STEP_ID, browserScenarioBaseUrlSchema, browserScenarioValueSchema, queryEntrySchema, BROWSER_SCENARIO_REQUEST_METHODS, FORBIDDEN_REQUEST_HEADERS, HEADER_FIELD_VALUE, settableRequestHeader, browserScenarioPageValueSchemas, START_ORIGIN_PATH, SAVED_PLACEHOLDER, SAVED_URL_PLACEHOLDER, savedPlaceholderNames, savedValueSchema, browserScenarioRequestValueSchema, basicCredentialPartSchema, validBasicCredentialUsername, basicCredentialsSchema, saveEntrySchema, saveResponseSchema, requestHeaderSchema, browserScenarioUrlSchema, browserScenarioBrowserSchema, browserScenarioEnvironmentSchema, locatorSchema, MAX_BROWSER_SCENARIO_TIMEOUT_MS, stepBase, browserScenarioActionSchema, storageEntrySchema, browserScenarioStorageSchema, browserScenarioSecretSchema, snapshotKindSchema, browserScenarioCaptureSchema;
function init_browserScenarioValues() {
	return (init_browserScenarioValues = __esmMin((() => {
		init_stringPatterns();
		init_jsonValue();
		init_localPath();
		init_browserNetworkEvidence();
		init_browserScenarioCaptureValues();
		init_browserScenarioCaptureLimits();
		init_browserObservation();
		scenarioIdentifierSchema = z.string().regex(IDENTIFIER_PATTERN);
		BROWSER_SCENARIO_START_STEP_ID = "scenario_start";
		browserScenarioBaseUrlSchema = z.string().min(1).transform((value, context) => {
			let url;
			try {
				url = new URL(value);
			} catch (cause) {
				void cause;
				context.addIssue({
					code: "custom",
					message: "Invalid browser URL"
				});
				return z.NEVER;
			}
			if (url.protocol !== "http:" && url.protocol !== "https:" || url.username !== "" || url.password !== "") {
				context.addIssue({
					code: "custom",
					message: "Browser URLs must be HTTP(S) and omit credentials"
				});
				return z.NEVER;
			}
			return url.toString();
		});
		browserScenarioValueSchema = z.discriminatedUnion("source", [z.strictObject({
			source: z.literal("literal"),
			value: z.string()
		}), z.strictObject({
			source: z.literal("secret"),
			secret_id: scenarioIdentifierSchema
		})]);
		queryEntrySchema = z.strictObject({
			name: z.string().min(1),
			value: browserScenarioValueSchema
		});
		BROWSER_SCENARIO_REQUEST_METHODS = [
			"GET",
			"HEAD",
			"POST",
			"PUT",
			"PATCH",
			"DELETE"
		];
		FORBIDDEN_REQUEST_HEADERS = new Set([
			"accept-charset",
			"accept-encoding",
			"access-control-request-headers",
			"access-control-request-method",
			"connection",
			"content-length",
			"cookie",
			"cookie2",
			"date",
			"dnt",
			"expect",
			"host",
			"keep-alive",
			"origin",
			"referer",
			"set-cookie",
			"te",
			"trailer",
			"transfer-encoding",
			"upgrade",
			"user-agent",
			"via"
		]);
		HEADER_FIELD_VALUE = /^[\t\x20-\x7e\x80-\xff]*$/u;
		settableRequestHeader = (name) => {
			const lower = name.toLowerCase();
			return !FORBIDDEN_REQUEST_HEADERS.has(lower) && !lower.startsWith("proxy-") && !lower.startsWith("sec-");
		};
		browserScenarioPageValueSchemas = [z.strictObject({
			source: z.literal("cookie"),
			name: z.string().min(1).describe("Cookie the browser holds for the request URL.")
		}), z.strictObject({
			source: z.literal("local_storage"),
			key: z.string().min(1).describe("Local storage key on the start origin."),
			json_pointer: z.string().regex(/^(?:\/.*)?$/u).optional().describe("Parse the stored value as JSON and use the string or number at this pointer; empty selects the whole value.")
		})];
		START_ORIGIN_PATH = /^\x2F(?:[^\x2F\x5C]|$)/u;
		SAVED_PLACEHOLDER = /\{saved:([A-Za-z][A-Za-z0-9._-]*)\}/gu;
		SAVED_URL_PLACEHOLDER = /(?:\{|%7[Bb])saved(?::|%3[Aa])([A-Za-z][A-Za-z0-9._-]*)(?:\}|%7[Dd])/gu;
		savedPlaceholderNames = (text, placeholder = SAVED_PLACEHOLDER) => [...text.matchAll(placeholder)].map(([, name]) => name);
		savedValueSchema = z.strictObject({
			source: z.literal("saved"),
			name: scenarioIdentifierSchema
		});
		browserScenarioRequestValueSchema = z.discriminatedUnion("source", [...browserScenarioValueSchema.options, savedValueSchema]);
		basicCredentialPartSchema = z.discriminatedUnion("source", [
			...browserScenarioRequestValueSchema.options,
			z.strictObject({
				source: z.literal("cookie"),
				name: z.string().min(1)
			}),
			z.strictObject({
				source: z.literal("local_storage"),
				key: z.string().min(1),
				json_pointer: z.string().regex(/^(?:\/.*)?$/u).optional()
			})
		]);
		validBasicCredentialUsername = (username) => !username.includes(":");
		basicCredentialsSchema = z.strictObject({
			source: z.literal("basic_credentials"),
			parts: z.array(basicCredentialPartSchema).length(2).describe("Username, then password.")
		});
		saveEntrySchema = z.strictObject({
			name: scenarioIdentifierSchema,
			json_pointer: z.string().regex(/^(?:\/.*)?$/u),
			secret: z.boolean().default(false)
		});
		saveResponseSchema = z.strictObject({
			method: z.enum(BROWSER_SCENARIO_REQUEST_METHODS),
			path: z.string().regex(START_ORIGIN_PATH).describe("`{*}` matches one segment; the query is ignored."),
			save: z.array(saveEntrySchema).min(1)
		}).describe("Save values from a newly observed matching 2xx JSON response; matching does not prove the UI caused it. Multiple observed matches fail.");
		requestHeaderSchema = z.strictObject({
			name: z.string().regex(/^[!#$%&'*+.^_`\x7C~0-9A-Za-z\x2D]+$/u).refine(settableRequestHeader, { message: "A page's fetch cannot set this header" }),
			value: z.discriminatedUnion("source", [
				...browserScenarioValueSchema.options,
				...browserScenarioPageValueSchemas,
				savedValueSchema,
				basicCredentialsSchema
			]),
			prefix: z.string().regex(HEADER_FIELD_VALUE, { message: "A header value cannot carry line breaks or control characters" }).optional().describe("Text sent before the value, such as `Bearer `.")
		});
		browserScenarioUrlSchema = z.strictObject({
			url: browserScenarioBaseUrlSchema,
			query: z.array(queryEntrySchema).default([])
		});
		browserScenarioBrowserSchema = z.discriminatedUnion("mode", [z.strictObject({
			mode: z.literal("launch"),
			executable_path: absoluteLocalPathStringSchema.describe("Absolute local filesystem path for the browser executable; relative paths are rejected."),
			headless: z.boolean().default(true).describe("Run without a visible browser window; defaults to true and can be disabled when the host supports a display.")
		}), z.strictObject({
			mode: z.literal("connect"),
			cdp_endpoint: browserEndpointSchema,
			target_id: z.string().min(1)
		})]);
		browserScenarioEnvironmentSchema = z.strictObject({
			viewport: z.strictObject({
				width: z.int().positive().default(1280),
				height: z.int().positive().default(720),
				device_scale_factor: z.number().positive().default(1)
			}).default({
				width: 1280,
				height: 720,
				device_scale_factor: 1
			}),
			locale: z.string().min(2).regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/u).default("en-US").describe("Formatting locale. Launch also sets navigator.language(s) and Accept-Language; connect retains the caller's page and request languages and reports this limitation."),
			timezone: z.string().min(1).regex(/^[A-Za-z0-9_+\x2d]+(?:\x2f[A-Za-z0-9_+\x2d]+)*$/u).default("UTC"),
			color_scheme: z.enum([
				"light",
				"dark",
				"no-preference"
			]).default("light"),
			reduced_motion: z.enum(["reduce", "no-preference"]).default("reduce"),
			service_workers: z.enum(["allow", "block"]).default("block")
		}).default({
			viewport: {
				width: 1280,
				height: 720,
				device_scale_factor: 1
			},
			locale: "en-US",
			timezone: "UTC",
			color_scheme: "light",
			reduced_motion: "reduce",
			service_workers: "block"
		}).describe("Optional deterministic browser settings. Defaults to 1280x720, en-US, UTC, light mode, reduced motion, and blocked service workers.");
		locatorSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("test_id"),
				value: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("role"),
				role: z.enum([
					"button",
					"checkbox",
					"combobox",
					"dialog",
					"link",
					"listbox",
					"menuitem",
					"option",
					"radio",
					"slider",
					"spinbutton",
					"switch",
					"tab",
					"textbox"
				]),
				name: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("css"),
				selector: z.string().min(1)
			})
		]);
		MAX_BROWSER_SCENARIO_TIMEOUT_MS = 2147483647;
		stepBase = {
			step_id: scenarioIdentifierSchema,
			timeout_ms: z.int().min(1).max(MAX_BROWSER_SCENARIO_TIMEOUT_MS).optional().describe("Optional action deadline in milliseconds; omitted means wait until completion or request cancellation.")
		};
		browserScenarioActionSchema = z.discriminatedUnion("action", [
			z.strictObject({
				...stepBase,
				action: z.literal("goto"),
				destination: browserScenarioUrlSchema,
				wait_until: z.enum([
					"commit",
					"domcontentloaded",
					"load"
				])
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("click"),
				locator: locatorSchema,
				button: z.enum([
					"left",
					"middle",
					"right"
				]).default("left"),
				click_count: z.int().positive().default(1),
				save_response: saveResponseSchema.optional()
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("fill"),
				locator: locatorSchema,
				value: browserScenarioValueSchema
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("press"),
				locator: locatorSchema,
				key: z.string().min(1),
				save_response: saveResponseSchema.optional()
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("select_option"),
				locator: locatorSchema,
				value: browserScenarioValueSchema
			}),
			z.strictObject({
				...stepBase,
				action: z.enum(["check", "uncheck"]),
				locator: locatorSchema
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("wait_for"),
				locator: locatorSchema,
				state: z.enum([
					"attached",
					"detached",
					"visible",
					"hidden"
				])
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("request"),
				method: z.enum(BROWSER_SCENARIO_REQUEST_METHODS),
				path: z.string().regex(START_ORIGIN_PATH).describe("Path, and optional literal query, on the start URL's origin, such as /api/folders; it must resolve to that origin."),
				query: z.array(queryEntrySchema).default([]),
				headers: z.array(requestHeaderSchema).default([]),
				json: jsonValueSchema.optional().describe("JSON request body, sent with Content-Type application/json unless a header sets one; not allowed for GET or HEAD."),
				save: z.array(saveEntrySchema).default([]).describe("Values to save from the JSON response. Later steps send one as `{saved:name}` in a request path, goto URL or JSON string, or as a header value."),
				expected_status: z.array(z.int().min(100).max(999).refine((status) => status < 300 || status > 399, { message: "Request steps follow no redirects, so a 3xx status cannot complete one" })).min(1).optional().describe("Statuses that complete the step; any other status fails it. Omitted means any response completes it.")
			}),
			z.strictObject({
				step_id: scenarioIdentifierSchema,
				action: z.literal("wait_for_timeout"),
				duration_ms: z.int().min(1).max(MAX_BROWSER_SCENARIO_TIMEOUT_MS).describe("Wait this many milliseconds; the wait ends early on cancellation.")
			})
		]);
		storageEntrySchema = z.strictObject({
			name: z.string().min(1),
			value: browserScenarioValueSchema
		});
		browserScenarioStorageSchema = z.strictObject({
			cookies: z.array(z.strictObject({
				name: z.string().min(1),
				value: browserScenarioValueSchema,
				destination: browserScenarioUrlSchema,
				http_only: z.boolean(),
				secure: z.boolean(),
				same_site: z.enum([
					"Strict",
					"Lax",
					"None"
				])
			})).default([]),
			local_storage: z.array(z.strictObject({
				origin: browserOriginSchema,
				entries: z.array(storageEntrySchema)
			})).default([]),
			session_storage: z.array(z.strictObject({
				origin: browserOriginSchema,
				entries: z.array(storageEntrySchema)
			})).default([])
		}).default({
			cookies: [],
			local_storage: [],
			session_storage: []
		}).describe("Optional initial cookies, local storage, or session storage. Defaults to empty; every supplied value and origin must be declared and within the allowed origins.");
		browserScenarioSecretSchema = z.strictObject({
			secret_id: scenarioIdentifierSchema,
			environment_variable: z.string().min(1).refine((name) => !name.includes("=") && !name.includes("\0"), "Environment variable names cannot contain '=' or NUL")
		});
		snapshotKindSchema = z.enum([
			"screenshot",
			"dom",
			"accessibility",
			"url",
			"history",
			"storage"
		]);
		browserScenarioCaptureSchema = z.strictObject({
			after_each_step: z.array(snapshotKindSchema).default([]),
			at_end: z.array(snapshotKindSchema).default(["url"]),
			events: z.array(browserScenarioEventFamilySchema).default([]),
			network: browserNetworkContentSelectionSchema,
			limits: browserScenarioCaptureLimitsSchema.default(DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS)
		}).default({
			after_each_step: [],
			at_end: ["url"],
			events: [],
			network: {
				request_body: false,
				response_body: false,
				header_values: false
			},
			limits: DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS
		}).describe("Optional retained artifacts and event families. Defaults to only a final sanitized URL; request screenshots, DOM, accessibility, history, storage, and event capture explicitly.");
	})))();
}

//#endregion
//#region dist/domain/javascript/electronObservation.js
var approvedElectronInput, listElectronTargetsInputSchema, inspectElectronPageFacts, inspectElectronPageInputSchema, electronTargetSchema, electronTargetListSchema, electronScriptFrameClaimsSchema, electronPageInspectionSchema;
function init_electronObservation() {
	return (init_electronObservation = __esmMin((() => {
		init_offsetDateTime();
		init_browserDeadline();
		init_browserCompleteness();
		init_browserObservation();
		init_browserObservationSchemas();
		init_cdpObservationSchemas();
		init_digests();
		approvedElectronInput = { cdp_endpoint: browserEndpointSchema };
		listElectronTargetsInputSchema = z.strictObject({ ...approvedElectronInput });
		inspectElectronPageFacts = {
			...approvedElectronInput,
			target_id: z.string().min(1),
			observation_ms: z.int().min(0).default(100),
			command_timeout_ms: webRuntimeCommandTimeoutSchema
		};
		inspectElectronPageInputSchema = z.union([z.strictObject({
			...inspectElectronPageFacts,
			include_script_sources: z.literal(false).default(false)
		}), z.strictObject({
			...inspectElectronPageFacts,
			include_script_sources: z.literal(true)
		})]);
		electronTargetSchema = z.object({
			target_id: z.string(),
			type: z.string(),
			title: z.string(),
			file_path: z.string(),
			attached: z.boolean().nullable().describe("Discovery-reported debugger attachment state; null means unknown")
		});
		electronTargetListSchema = z.object({
			browser: browserVersionSchema,
			targets: z.array(electronTargetSchema),
			excluded: z.object({
				unsupported_url: z.int().min(0),
				non_page: z.int().min(0)
			}),
			limitations: z.array(z.string())
		});
		electronScriptFrameClaimsSchema = z.object({
			script_event_frame_id: z.string().exactOptional(),
			execution_context_frame_id: z.string().exactOptional()
		});
		electronPageInspectionSchema = z.object({
			browser: browserVersionSchema,
			target: electronTargetSchema,
			capture_window: z.object({
				started_at: utcDateTimeSchema,
				ended_at: utcDateTimeSchema,
				observation_ms: z.int().min(0)
			}),
			completeness: browserCompletenessSchema,
			frames: z.array(z.object({
				frame_id: z.string(),
				parent_frame_id: z.string().nullable(),
				file_path: z.string()
			})),
			dom: cdpDomSnapshotSchema,
			scripts: z.object({
				total: z.int().min(0),
				items: z.array(z.object({
					script_key: prefixedDigestSchema("electron_script"),
					frame_id: z.string().nullable().default(null),
					frame_scope: z.enum(["authorized", "unknown"]).exactOptional(),
					frame_claims: electronScriptFrameClaimsSchema.exactOptional(),
					file_path: z.string(),
					has_source_url: z.boolean().nullable().exactOptional(),
					reported_url: z.string().exactOptional(),
					...cdpScriptMetadataSchema.shape,
					source: cdpScriptSourceSchema
				}))
			}),
			resources: z.array(z.object({
				resource_key: prefixedDigestSchema("electron_resource"),
				file_path: z.string(),
				type: z.string(),
				mime_type: z.string(),
				content_size: z.number().min(0).nullable()
			})),
			workers: z.array(z.object({
				target_id: z.string().min(1),
				type: z.string().min(1),
				file_path: z.string(),
				attached: z.boolean(),
				opener_target_id: z.string().min(1).nullable(),
				parent_frame_id: z.string().min(1).nullable()
			})).default([]),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/electronActiveObservation.js
var absolutePathSchema, windowIndexSchema, deepLinkUrlSchema, actionSchema, electronActiveObservationInputSchema, electronActiveTimelineEventSchema, ipcEventSchema, electronActiveProcessMetricSchema, electronActiveWindowSchema, coverageSchema, actionResultContextShape, actionResultSchema, electronActiveObservationResultSchema;
function init_electronActiveObservation() {
	return (init_electronActiveObservation = __esmMin((() => {
		init_localPath();
		absolutePathSchema = z.string().min(1).refine((value) => value.startsWith("/") || /^[A-Za-z]:[\\/]/u.test(value) || value.startsWith("\\\\"), "provider path must be absolute");
		windowIndexSchema = z.int().min(0);
		deepLinkUrlSchema = z.string().min(1).refine((value) => {
			try {
				return new URL(value).protocol.length > 0;
			} catch (cause) {
				void cause;
				return false;
			}
		}, "deep-link url must be an absolute URL");
		actionSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				step_id: z.string().min(1),
				kind: z.literal("click"),
				selector: z.string().min(1),
				window_index: windowIndexSchema.default(0)
			}),
			z.strictObject({
				step_id: z.string().min(1),
				kind: z.literal("wait"),
				duration_ms: z.int().min(0),
				window_index: windowIndexSchema.optional()
			}),
			z.strictObject({
				step_id: z.string().min(1),
				kind: z.literal("renderer-reload"),
				window_index: windowIndexSchema.default(0)
			}),
			z.strictObject({
				step_id: z.string().min(1),
				kind: z.literal("renderer-crash"),
				window_index: windowIndexSchema.default(0)
			}),
			z.strictObject({
				step_id: z.string().min(1),
				kind: z.literal("deep-link"),
				delivery: z.enum(["open-url", "second-instance"]),
				url: deepLinkUrlSchema
			})
		]);
		electronActiveObservationInputSchema = z.strictObject({
			executable_path: absoluteLocalPathStringSchema.describe("Absolute local filesystem path for the Electron executable; relative paths are rejected."),
			application_path: absoluteLocalPathStringSchema.describe("Absolute local filesystem path for the Electron application; relative paths are rejected."),
			application_root: absoluteLocalPathStringSchema.optional().describe("Absolute local filesystem root for application-relative paths; omit to derive it from the application path. Relative paths are rejected."),
			args: z.array(z.string().regex(/^[^\x00]*$/u, "Electron arguments must not contain NUL")).default([]),
			actions: z.array(actionSchema).default([])
		});
		electronActiveTimelineEventSchema = z.strictObject({
			sequence: z.int().min(1),
			correlation_id: z.string().nullable(),
			kind: z.enum([
				"main-handler-invocation",
				"main-event-invocation",
				"ipc-observation-gap",
				"utility-process-fork",
				"utility-process-message",
				"ipc-main-to-renderer",
				"ipc-utility-to-main",
				"ipc-renderer-send",
				"ipc-renderer-invoke",
				"ipc-renderer-post-message",
				"app-lifecycle",
				"window-lifecycle",
				"web-contents-lifecycle",
				"navigation",
				"shell-attempt",
				"process-lifecycle",
				"permission",
				"popup-attempt",
				"download",
				"protocol",
				"preload",
				"native-addon",
				"updater",
				"error"
			]),
			event: z.string().nullable(),
			phase: z.enum([
				"attempted",
				"completed",
				"blocked",
				"failed",
				"observed"
			]),
			channel: z.string().nullable(),
			direction: z.enum([
				"renderer-to-main",
				"main-to-renderer",
				"main-to-utility",
				"utility-to-main"
			]).nullable(),
			sender: z.string().nullable(),
			receiver: z.string().nullable(),
			frame: z.string().nullable(),
			target: z.string().nullable(),
			argument_shapes: z.array(z.string()),
			result_shape: z.string().nullable(),
			process_type: z.string().nullable(),
			source: z.string(),
			capture_method: z.enum([
				"api-wrapper",
				"event-emitter",
				"process-hook"
			]),
			artifact_path: z.string().nullable(),
			artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
			error: z.boolean()
		});
		ipcEventSchema = electronActiveTimelineEventSchema.extend({ kind: z.enum([
			"main-handler-invocation",
			"main-event-invocation",
			"utility-process-fork",
			"utility-process-message",
			"ipc-main-to-renderer",
			"ipc-utility-to-main",
			"ipc-renderer-send",
			"ipc-renderer-invoke",
			"ipc-renderer-post-message"
		]) });
		electronActiveProcessMetricSchema = z.strictObject({
			pid: z.int().min(1),
			type: z.string().min(1),
			name: z.string().nullable(),
			service_name: z.string().nullable()
		});
		electronActiveWindowSchema = z.strictObject({
			window_id: z.string(),
			web_contents_id: z.string(),
			url: z.string(),
			title: z.string(),
			visible: z.boolean().nullable(),
			destroyed: z.boolean()
		});
		coverageSchema = z.strictObject({
			status: z.enum([
				"complete",
				"partial_attach",
				"hook_conflict",
				"target_exited",
				"cleanup_failed"
			]),
			observed_event_families: z.array(z.string()),
			unavailable_event_families: z.array(z.string()),
			observed_roles: z.array(z.string()),
			pre_capture_activity: z.literal("unavailable")
		});
		actionResultContextShape = {
			step_id: z.string().min(1),
			kind: z.enum([
				"click",
				"wait",
				"renderer-reload",
				"renderer-crash",
				"deep-link"
			]),
			window_index: windowIndexSchema.nullable(),
			target: z.string().nullable(),
			elapsed_ms: z.int().min(0)
		};
		actionResultSchema = z.discriminatedUnion("status", [z.strictObject({
			...actionResultContextShape,
			status: z.literal("completed"),
			error: z.null()
		}), z.strictObject({
			...actionResultContextShape,
			status: z.enum(["failed", "cancelled"]),
			error: z.string()
		})]);
		electronActiveObservationResultSchema = z.strictObject({
			application: z.strictObject({
				executable_path: absolutePathSchema,
				application_path: absolutePathSchema,
				electron_version: z.string().min(1),
				process_ownership: z.literal("provider-owned"),
				cleanup: z.literal("terminated-owned-process")
			}),
			actions: z.array(actionResultSchema),
			windows: z.array(electronActiveWindowSchema),
			processes: z.strictObject({ items: z.array(electronActiveProcessMetricSchema) }),
			ipc: z.strictObject({
				events: z.array(ipcEventSchema),
				observed: z.int().min(0),
				dropped: z.int().min(0)
			}),
			timeline: z.strictObject({
				events: z.array(electronActiveTimelineEventSchema),
				observed: z.int().min(0),
				dropped: z.int().min(0)
			}),
			retention: z.strictObject({
				budget_bytes: z.int().min(0),
				estimated_retained_bytes: z.int().min(0),
				event_serialized_byte_upper_bound: z.int().min(0),
				retained: z.int().min(0),
				dropped: z.int().min(0),
				dropped_event_families: z.array(z.strictObject({
					family: z.string().min(1),
					count: z.int().min(1)
				})),
				dropped_event_roles: z.array(z.strictObject({
					role: z.string().min(1),
					count: z.int().min(1)
				})),
				observed_ipc: z.int().min(0),
				dropped_ipc: z.int().min(0),
				observed_runtime: z.int().min(0),
				dropped_runtime: z.int().min(0)
			}),
			coverage: coverageSchema,
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/mcpDoctorOptions.js
var MCP_DOCTOR_OPTIONS, MCP_DOCTOR_ALIAS;
function init_mcpDoctorOptions() {
	return (init_mcpDoctorOptions = __esmMin((() => {
		init_cliOutput();
		MCP_DOCTOR_OPTIONS = z$1.object({
			format: z$1.enum(CLI_DOCUMENT_OUTPUT_FORMATS).optional().describe("Output format"),
			json: z$1.boolean().optional().describe("Emit the report as JSON"),
			fullOutput: z$1.boolean().optional().describe("Show the full output envelope"),
			help: z$1.boolean().optional().describe("Show help")
		});
		MCP_DOCTOR_ALIAS = { help: "h" };
	})))();
}

//#endregion
export { ANALYSIS_EVIDENCE_PREDICATE, ANALYSIS_VIEW_PAGE_BUDGET_RECOVERY, APK_V1_MANIFEST_PATH, APK_V1_META_INF_PREFIX, ARTIFACT_FORMAT_IDS, ArtifactInventoryCarrierError, ArtifactInventoryValidationError, BINARY_ARCHITECTURES$1 as BINARY_ARCHITECTURES, BROWSER_SCENARIO_START_STEP_ID, BUILTIN_RESOURCE_METHODS, BUILTIN_RESOURCE_RELEASE_METHODS, BUILTIN_RESOURCE_SPECIFIERS, CDP_CLEANUP_GRACE_MS, CDP_DISCOVERY_RESPONSE_TIMEOUT_MS, CLI_COMMANDS, CLI_COMMAND_NAMES, COMPACT_INPUT_SCHEMA_BUDGET_BYTES, COMPACT_OUTPUT_SCHEMA_BUDGET_BYTES, DECOMPILE_DIRECTORY_FUNCTIONS_DIRECTORY, DECOMPILE_DIRECTORY_INDEX_NAME, DECOMPILE_DIRECTORY_INLINE_FAILURE_BYTES, DECOMPILE_DIRECTORY_JOURNAL_NAME, DEFAULT_BROWSER_SCENARIO_CAPTURE_LIMITS, DEFAULT_CDP_COMMAND_TIMEOUT_MS, DEFAULT_NATIVE_COMMAND_TIMEOUT_MS, DEFAULT_NATIVE_UI_DEADLINE_MS, DEFAULT_PWNTOOLS_TIMEOUT_MS, DEFAULT_SQLITE_WORKER_TIMEOUT_MS, ELECTRON_FUSE_SENTINEL, ELECTRON_IDENTITY_LIMITATION, ELECTRON_MODULE, ELF_METADATA_ARCHITECTURES, ESP_FLASH_SECTOR_BYTES, ESP_PARTITION_TABLE_DEFAULT_OFFSET, ESP_PARTITION_TABLE_MAX_BYTES, ESP_PARTITION_TABLE_SECTOR_BYTES, ESP_SIGNATURE_BLOCK_BYTES, FS_OPEN_FLAGS, GetterResultWalker, HEADER_FIELD_VALUE, IDENTIFIER_PATTERN, INSPECT_ANALYSIS_VIEW_OPERATION, MAX_BROWSER_DEADLINE_MS, MAX_DEVICETREE_FILE_BYTES, MAX_INSPECT_PE_DIRECTORY_ENTRIES, MAX_INSPECT_PE_FILE_BYTES, MAX_NATIVE_TIMER_MS, MAX_SQLITE_WORKER_TIMEOUT_MS, MCP_DOCTOR_ALIAS, MCP_DOCTOR_OPTIONS, NATIVE_UI_WAIT_STEP_MAX_MS, PLAYWRIGHT_RESPONSE_BODY_PROVENANCE_LIMITATION, PROCESS_PROVIDER, PRODUCT_IDENTITY, PROVIDER_REJECTION_CODES, RAW_ONLY_ARCHITECTURES, RETURNED_REFERENCE_WIDENING_LIMITATION, SAVED_PLACEHOLDER, SAVED_URL_PLACEHOLDER, SDK_IDENTITY, STABLE_IDENTIFIER_PATTERN, SemanticGetterQuery, SemanticPropertyPathCoverage, WEB_NETWORK_CAPTURE_FORMATS, WEB_NETWORK_CAPTURE_LIMITS, WEB_RUNTIME_LIMITS, ZIP_NON_ENTRY_LIMITATION, ZIP_PACKAGE_FORMATS, absenceClaimable, addressCoordinate, addressDistance, admitRawBinary, analysisInputErrorFromIssues, analysisOperationInputErrorFromIssues, analysisProfileSchema, analysisProfilesEqual, analysisProviderIdSchema, analysisProviderSelectorSchema, analysisSourceDescriptorSchema, analysisStringSchema, analysisViewInputError, argumentValue, artifactContradictionId, artifactEdgeId, artifactEdgeSchema, artifactExtractionResultSchema, artifactFormatMetadataSchema, artifactGraphDigest, artifactGraphManifestSchema, artifactIdForContent, artifactInspectionResultSchema, artifactInspectionSources, artifactInventoryCoverageSchema, artifactInventoryResultSchema, artifactManifestId, artifactNodeSchema, artifactOccurrenceSchema, artifactTargetSelectedPath, artifactTraversalOmissionKindSchema, assignmentValueSources, availableFunctionBodySchema, availableNativeApiBoundarySchema, availableNativeValueFlowSchema, availableReferenceKindSchema, binaryArchitectureSchema, borrowEvidenceArray, borrowEvidenceInput, browserAllowedOriginsSchema, browserCompletenessSchema, browserDeadlineIncrease, browserDeadlineRetry, browserEndpointSchema, browserExclusionSchema, browserObservationEndpointSchema, browserOriginSchema, browserScenarioActionSchema, browserScenarioBrowserSchema, browserScenarioCaptureSchema, browserScenarioCaptureSchema$1, browserScenarioCompletenessSchema, browserScenarioEnvironmentSchema, browserScenarioEventKindSchema, browserScenarioEventSchema, browserScenarioSecretSchema, browserScenarioStepSchema, browserScenarioStorageSchema, browserScenarioUrlSchema, browserStepArtifactsSchema, browserTargetListSchema, browserVersionSchema, calleeName, canonicalBase64Schema, canonicalJson, canonicalJsonDigestSteps, captureSensitiveValues, captureWebScreenshotInputSchema, cdpCleanupGraceExpired, cdpCommandDeadlineRecovery, cdpCommandTimeoutIsSelectable, cdpCommandTimeoutUnrelatedControl, cdpResourceColumnSchema, childNodes, classifyBrowserCompleteness, classifyBrowserScenarioCompleteness, clearSemanticValueCaches, cliMetadataGuidSchema, collectJavaScriptIdentityWritesSteps, collectSemanticCallable, collectSemanticModuleLink, collectSemanticReferences, collectSemanticReferencesSteps, collectSemanticReturns, committedProviderSchema, committedProvidersEqual, commonJsExportApplicability, commonJsRuntimeExportValues, compactPresentationForMcpInputSchemaProfile, compactPresentationForMcpOutputSchemaProfile, compareAsciiStrings, compareOffsetDateTimeInstants, compareUnicodeCodePoints, compareWebScreenshotsInputSchema, completeRelationshipCoverageSchema, completeSemanticSteps, compositeKey, createAmbientPathResolver, createAnalysisProfile, createArtifactInspection, createEvidence, createEvidenceBundle, createHistoricalSourceGraph, createHistoricalSourceManifest, createImmutableEvidenceBundle, createImmutableEvidenceSteps, createReferenceSourcePathLookup, createResidualUnknown, createSemanticModuleInterop, createSemanticOpaqueGlobalObserver, createSemanticReturnedReferences, createWebScreenshotArtifact, createWebTextArtifact, currentSemanticScope, declareEvidenceReferenceAlternative, decodeCanonicalBase64, decodeEspDescriptor, decodeEspPartitionTable, decodeEspSignatureBlock, decodeReferenceSourceModuleUrlPath, decompileDirectoryIndexSchema, decompileDirectoryInputSchema, decompileDirectoryManifestSchema, decompileJournalHeaderSchema, decompileJournalLineSchema, describeElectronFuseFindings, describeValidationFailure, desktopPathConventions, devicetreeSchema, digestCanonicalValue, digestProcessCommitment, digestSchema, dimensionResult, dylibResolutionInputSchema, dylibResolutionResultSchema, electronActiveObservationInputSchema, electronActiveObservationResultSchema, electronActiveProcessMetricSchema, electronActiveTimelineEventSchema, electronActiveWindowSchema, electronExportPath, electronFuseName, electronFuseReportSchema, electronFuseState, electronMemberPath, electronPageInspectionSchema, electronTargetListSchema, emptyArraySchema, espAppDescriptorSchema, espBootPartitions, espBootloaderDescriptorSchema, espFlashImageFactsSchema, espFlashImageMetadataSchema, espImageMetadataSchema, espImageSegmentMetadataSchema, espPartitionSubtypeName, espPartitionTypeName, espPrimaryLayoutRole, espSignatureSlot, evaluateSemanticBinding, evaluateSemanticExpression, evaluateSemanticProvenance, evaluateSemanticProvenanceAtRead, evidenceAuthoritySchema, evidenceBundleForTarget, evidenceBundleSchema, evidenceFileReferenceSchema, evidenceInputSchema, evidenceLocationSchema, evidenceSchema, evidenceSemanticContent, evidenceSourceInputSchema, evidenceSubjectIdentity, firstUnerased, fixedNativeAllowance, fixedTupleSchema, flattenSemanticReturnValue, formatMetadataDeclaration, functionBodyEntryAgrees, functionComparisonDimensionNameSchema, functionComparisonInputSchema, functionComparisonResultSchema, functionDossierSchema, functionFacetAvailabilitySchema, functionInstructionWindowSchema, getEvidenceInputContract, hasCaptureTruncation, hasCompleteInventoryCoverage, hasSemanticCreateRequireFactoryOrigin, hasStableNativeSymbol, hasUncertainTypeOnlyModuleSideEffect, hasZipSignature, hex$1 as hex, historicalSourceGraphSchema, historicalSourceInventoryHasPartialFacts, historicalSourceLanguages, historicalSourceManifests, historicalSourceParseFailureKey, historicalSourceRelationshipKey, immutableSemanticBindings, immutableSemanticScopes, indexCommonJsExportReceiversSteps, indexJavaScriptAmbientWritesSteps, indexSemanticOpaqueEffects, inferJsonShape, init_addressCoordinate, init_analysisProfile, init_analysisSource, init_analysisViewErrors, init_apkV1MetadataName, init_artifactFormatMetadata, init_artifactGraph, init_artifactIdentity, init_artifactInspection, init_artifactInventoryEvidence, init_binaryTargetTypes, init_browserCompleteness, init_browserDeadline, init_browserNetworkEvidence, init_browserObservation, init_browserObservationSchemas, init_browserScenarioCapture, init_browserScenarioCaptureLimits, init_browserScenarioCaptureValues, init_browserScenarioValues, init_canonicalDigest, init_canonicalJsonDigestSteps, init_canonicalOrdering, init_cdpObservationSchemas, init_cliCommandNames, init_comparisonSemantics, init_decompileDirectory, init_devicetree, init_digests, init_dyldPaths, init_dylibResolution, init_electronActiveObservation, init_electronFuses, init_electronObservation, init_emptyArraySchema, init_espImageStructures, init_espPartitionTable, init_evidence, init_evidenceBundle, init_evidenceInputContract, init_evidenceReference, init_evidenceSubject, init_evidenceValidation, init_exactJsonNumber, init_fixedTupleSchema, init_functionBody, init_functionComparisonResults, init_functionComparisonSchemas, init_functionDossier, init_identity, init_inesContainer, init_inputIssueProjection, init_javascriptArtifactFiles, init_javascriptAstValues, init_javascriptBuiltinResourceMethods, init_javascriptCommonJsExportReceivers, init_javascriptElectronMemberWrites, init_javascriptModuleDeclaration, init_javascriptModuleInterop, init_javascriptSemanticAliasSelections, init_javascriptSemanticAmbientWrites, init_javascriptSemanticCallableResults, init_javascriptSemanticCopiedReferencePaths, init_javascriptSemanticCoverage, init_javascriptSemanticEvaluationOrder, init_javascriptSemanticGetterQueries, init_javascriptSemanticGetterResultWalker, init_javascriptSemanticGlobalReference, init_javascriptSemanticIterationSources, init_javascriptSemanticMutationInitializers, init_javascriptSemanticObjectReferences, init_javascriptSemanticOpaqueEffects, init_javascriptSemanticPrimitives, init_javascriptSemanticProjectedSources, init_javascriptSemanticProjection, init_javascriptSemanticPropertyKeys, init_javascriptSemanticPropertyPaths, init_javascriptSemanticProvenance, init_javascriptSemanticReferenceSources, init_javascriptSemanticRequireOrigin, init_javascriptSemanticResourceLimits, init_javascriptSemanticReturnedReferences, init_javascriptSemanticReturns, init_javascriptSemanticSlots, init_javascriptSemanticState, init_javascriptSemanticTraversal, init_javascriptSemanticValueTypes, init_javascriptSemanticValues, init_javascriptSourceParser, init_javascriptStaticAnalysisHelpers, init_javascriptStaticCoverage, init_jsonRecord, init_jsonShape, init_jsonStringByteLength, init_jsonValueByteLength, init_machoCpuIdentity, init_managedArtifact, init_mcpDoctorOptions, init_mcpInputSchemaProfile, init_mcpOutputSchemaProfile, init_mcpStartupBudgets, init_mcpToolFamilies, init_nativeAddress, init_nativeApiBoundary, init_nativeCallReference, init_nativeConvention, init_nativeDeadlines, init_nativeFactAvailability, init_nativeReference, init_nativeString, init_nativeSymbol, init_nativeValueFlow, init_offsetDateTime, init_peResources, init_positiveDecimalInteger, init_procedureInfo, init_processCapture, init_processCaptureCoverage, init_processCaptureParsing, init_processEvidenceProvider, init_processScenario, init_protobufWire, init_providerSelection, init_qlogCapture, init_rawBinary, init_recordedMediaType, init_recordedTransportUrl, init_referenceSourceGraph, init_referenceSourcePathIdentity, init_relationshipCoverage, init_residualUnknown, init_safeJson, init_sqliteDatabase, init_stringPatterns, init_swiftStringLiteral, init_symlinkTarget, init_toolFamilyIds, init_unicodeCodePointOrder, init_urlComponents, init_validationFailure, init_webContentArtifact, init_webNetworkCapture, init_webRuntime, init_webScreenshot, init_zipEndOfCentralDirectory, init_zipPackageFormat, inspectDevicetreeInputSchema, inspectElectronFusesInputSchema, inspectElectronPageInputSchema, inspectPeResourcesInputSchema, inspectSqliteDatabaseInputSchema, inspectWebNetworkCaptureInputSchema, inspectWebPageInputSchema, inspectWebPageWithSourceInputSchema, integrityContradictionSchema, invalidateSemanticRequireDelegateWrites, isDecompileFunctionRelativePath, isDigest, isElfMetadataArchitecture, isErasedJavaScriptDeclaration, isErasedJavaScriptValueChild, isEspAppPartition, isExactJsonNumber, isImmutableEvidence, isImmutableEvidenceBundle, isJavaScriptSourcePath, isJson, isJsonLike, isLiteralLoopbackHostname, isMachOFormat, isNullishJavaScriptSyntax, isPaddedBase64, isPortableAbsoluteReferenceTarget, isProcessEvidenceProvider, isSwiftRuntimeLibrary, isTypeOnlyImportDeclaration, isTypeOnlyImportSpecifier, isUnmodeledJavaScriptRuntimeScope, isUnmodifiedGlobalReference, isUnshadowedGlobal, isV1SignatureBlockName, isV1SignatureFileName, isV1SignatureMetadataName, isZipPackageFormat, iterateUrlQueryParameters, javaScriptArtifactTextExclusion, javaScriptExpressionWrapperTarget, javaScriptFileOccurrenceSchema, javaScriptProgramStrictness, javaScriptRuntimeContext, javaScriptSemanticResourceLimitSchema, javaScriptSemanticSourceExclusion, javaScriptStaticCoverageSchema, javascriptDisplayText, joinSemanticPropertyPaths, jsonRecordSchema, jsonStringByteLength, jsonValueByteLength, jsonValueType, listBrowserTargetsInputSchema, listElectronTargetsInputSchema, locateTrailingZipArchive, logicalPathEscapesRoot, logicalPathNfc, machoArchitectureFamily, machoArchitectureName, machoCpuSubtypeBase, machoImageSlices, managedArtifactInspectionSchema, managedMemberInspectionSchema, managedMetadataTokenSchema, managedNativeBoundaryInspectionSchema, managedNativeImportSchema, mcpDoctorDeadlineMsSchema, mcpFirstCatalogBudgetMsSchema, mcpInitializeBudgetMsSchema, mcpInputSchemaProfileSchema, mcpOutputSchemaProfileSchema, mcpPhaseBudgetRecovery, mcpToolFamiliesSchema, mcpToolsListBudgetMsSchema, mediaTypeEssence, moduleFactory, modulePropertyName, nativeAddressCoordinateInputSchema, nativeAddressInputSchema, nativeAddressObservationSchema, nativeAddressSchema, nativeApiInspectionResultSchema, nativeCallClassificationSchema, nativeCallReferenceSchema, nativeCommandTimeoutField, nativeDeadlineRecovery, nativePcodeOperationSchema, nativeRuntimeConvention, nativeSymbolMetadataSchema, nativeSymbolOrigin, nativeUiDeadlineField, nativeValueFlowMetadataSchema, nativeVarnodeSchema, nesContainerFormat, noRuntimeOverrideSentence, normalizeJoinedLogicalPath, observeBrowserUrl, observePossibleCommonJsDelegateWrite, observedSymlinkTarget, occurrenceIdForLocation, offsetDateTimeInstantFromEpochMilliseconds, offsetDateTimeSchema, offsetText, optionalBrowserDeadlineMs, overallStatus, parseArtifactInspectionInventoryResult, parseArtifactInventoryEvidence, parseArtifactInventoryResult, parseEvidence, parseEvidenceBundle, parseExactJson, parseFunctionDossier, parseImmutableEvidenceBundle, parseInesLayout, parseJavaScriptSource, parseJsonObject, parseMcpInputSchemaProfile, parseMcpOutputSchemaProfile, parseMcpStartupBudgets, parseMcpToolFamilies, parseOffsetDateTimeInstant, parseProcessCapture, parseRawBinaryEntryPoint, parseRecordedTransportUrl, parseRecoveredJavaScript, parseUrlQueryParameterNames, parserPluginsForPath, partialProcessCaptureObservationSchema, partialRelationshipCoverageSchema, peResourcesSchema, positiveDecimalIntegerSchema, prefixedDigestSchema, procedureIdentitySchema, procedureInfoSchema, processCaptureSchema, processComparisonContract, processScenarioCommitment, processScenarioSchema, processSourceTruncated, projectInputIssues, protobufCaptureCoverageSchema, protobufDecodingObjectSchema, protobufDecodingSchema, protobufFieldSchema, protobufFrameSchema, providerSchema, pwntoolsTimeoutField, qlogCaptureFactsSchema, range, rawBinaryEntryPointSchema, rawBinarySelectionError, readArtifactInspectionSources, readEvidence, readEvidenceBundle, readEvidencePayload, readExactJavaScriptLiteral, readImmutableEvidence, readNativeDeadline, readRecordedDateTime, readRecordedStart, rebindEvidenceSubjectTargetPath, rebindEvidenceToTargetPath, recordSemanticValueLimit, recordUnknownInputSchema, recordedBrowserObservationEndpointSchema, recordedBrowserOriginSchema, recordedPathSegments, referenceEdgeSchema, referenceKindSchema, registerToolFamilies, relationshipCoverageLimitations, relationshipCoverageSchema, residualUnknownSchema, resolveSemanticBindingFromScope, resolveSemanticBindingState, resolveSemanticModuleCallables, resolveTreePath, retainSemanticAmbientEffect, retainedBrowserScenarioCaptureSchema, retainedEvidenceReferenceSchema, runtimeFunctionParameters, safeParseEvidence, safeParseEvidenceBundle, safeParseImmutableEvidence, safeParseImmutableEvidenceBundle, safeParseJson, safeParseOwnedWebNetworkCapture, safeParseProcessCapture, safeParseUtf8Json, sanitizeBrowserUrl, sanitizedBrowserUrlSchema, savedPlaceholderNames, selectedBrowserDeadlineMs, selectedCdpCommandTimeoutMs, selectedWebNetworkCaptureTimeoutMs, semanticAliasSelectionChoices, semanticArrayIndex, semanticArrayPropertyReferences, semanticBindingAtRead, semanticBindingCanBeRebound, semanticBindingId, semanticBindingLookupAt, semanticBindingLookupFromScope, semanticBranchMayBeSkipped, semanticBuiltinNamespacePath, semanticCallableIdForNode, semanticCallableResultExpressions, semanticCallableResultKind, semanticCaptureOrderingIdentity, semanticCapturedSelectionsAfterPropertyRead, semanticClassAccessorReferences, semanticClassCandidates, semanticClassPropertyReferences, semanticContainer, semanticCopiedReferencePath, semanticCoverage, semanticCoverageResourceLimits, semanticEffectTiming, semanticEffectTimingWithinActivation, semanticFinalObjectProperty, semanticFinalObjectStringProperty, semanticGlobalProcessOrigin, semanticGlobalProcessPathOrigin, semanticIdentifierRole, semanticImportEqualsSpecifier, semanticIterationCardinality, semanticIterationSources, semanticKnownArrayIteration, semanticKnownSymbolKey, semanticMemberChain, semanticMethodDefinitionExpression, semanticMutableBuiltinOrigin, semanticMutationInitializers, semanticNormalizeCapturedSelections, semanticObjectAccessorReferences, semanticObjectPatternKeys, semanticObjectPropertyReferences, semanticOpaqueBindingEffects, semanticOpaqueBindingReadMayHaveChanged, semanticOpaqueGlobalMayHaveChanged, semanticOpaqueNameMayHaveChanged, semanticOriginalGlobalProcessAt, semanticPatternPropertyReadSources, semanticPrimitiveSet, semanticPriorStatementMayExit, semanticProjectedSourceFactsAtRead, semanticPropertyPathKeyMatches, semanticPropertyPointer, semanticPropertyReadSources, semanticPrototypeOwners, semanticReferenceRole, semanticReferenceSourcesInactive, semanticRequireCallAt, semanticRequireExportsIdentity, semanticRequireLoaderAt, semanticRequireOrigin, semanticResolutionBlocked, semanticResourceLimitCoverage, semanticResourceLimitReason, semanticRuntimeExportValueSources, semanticScopeExitEffect, semanticScopeId, semanticSelectedReferenceSlot, semanticShiftCapturedSelections, semanticSlotAtPath, semanticStableInitializer, semanticStaticModuleSource, semanticStaticPropertyKey, semanticStaticPropertyName, semanticTopLevelEffectFollowsCapture, semanticVariableScope, semanticWriteSiteReadsFirst, semanticWriteSiteTarget, semanticWriteTargets, sensitiveProcessInputProjection, serializeEvidenceBundle, sha256Text, singleQueryValues, sourceRangesEqual, sqliteDatabaseSchema, sqliteInspectionParameters, sqliteSchemaHasObjectDeclaration, sqliteSchemaScope, startsWithV1MetaInfPrefix, staticJavaScriptTruthiness, staticObjectProperty, stringValue, summarize, swiftLargeStringLiteralOmissionSchema, swiftLargeStringLiteralSchema, swiftSmallStringLiteralOmissionSchema, swiftSmallStringLiteralSchema, toolFamiliesConstraint, traceDylibLoading, traverseJavaScriptAst, traverseJavaScriptAstSteps, traverseJavaScriptValueAst, traverseJavaScriptValueAstSteps, tryParseEvidence, u16, u32, uint32, uint8, unavailableNativeApiBoundarySchema, unavailableNativeFactSchema, unavailableNativeValueFlowSchema, unexaminedJavaScriptStaticCoverage, uniqueSorted$1 as uniqueSorted, uniqueSortedBy, unknownRelationshipCoverageSchema, unresolvedCallSchema, unresolvedDimension, unwrapJavaScriptExpression, updateResidualUnknown, updateUnknownInputSchema, urlDeclaresQueryOrFragment, utcDateTimeSchema, v1SignatureFileNameForBlock, validBasicCredentialUsername, validateAnalysisProfileProvider, validateArtifactInventorySubject, validateResidualUnknownAddition, webNetworkCaptureArtifactSchema, webNetworkCaptureBinaryDescriptorSchema, webNetworkCaptureDecoderSchema, webNetworkCapturePayloadSchema, webNetworkCaptureRecordSchema, webNetworkCaptureSchema, webNetworkCaptureTimeoutRecovery, webPageInspectionSchema, webRuntimeCommandTimeoutSchema, webRuntimeLocationSchema, webRuntimeScopeSchema, webRuntimeSourceSchema, webRuntimeTargetSchema, webScreenshotDiffSchema, webScreenshotSchema, webTextArtifactMetadataSchema, webTextArtifactSchema, withEvidenceCallerInputPath, withEvidenceSubjectDeclaration, zipEndOfCentralDirectoryCandidates, zipPackageFormatForPath, zipRootPackageFormat };