import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ConfigurationError, ProviderAdapterError, err, init_configurationErrors, init_providerAdapterError, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { NonRegularFileReadError, init_RegularFile } from "./ArtifactReader-DJ9rniiL.js";
import { AnalysisProtocolError, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { init_jsonValue, jsonValueSchema } from "./jsonValue-DGGrC1lE.js";
import { ProcessAdmissionError, init_ProcessAdmissionError } from "./ProcessOwnershipEvidence-7mvEaeb9.js";
import { GhidraAdmissionError, ghidraFileFailure, init_GhidraAdmissionError, init_GhidraFileArtifacts, readGhidraProfileArtifact, writeGhidraProfileArtifact } from "./ownedProcessAvailability-ByGEvJxG.js";
import { isAbsolute, join } from "node:path";
import { mkdir, realpath, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { z } from "zod";
import { Client } from "@modelcontextprotocol/client";

//#region dist/ghidra/GhidraAnalysisSeeds.js
var GHIDRA_SEED_FORMAT, MAX_GHIDRA_SEED_BYTES, MAX_GHIDRA_SEED_ENTRIES, MAX_GHIDRA_SEED_NAME_LENGTH, digest, count, ghidraSeedCommitmentSchema, ghidraSeedReportSchema, seedLineError, parseGhidraSeeds, normalizedSeeds, sha256, readSeeds, resolveSeedPath, resolveGhidraAnalysisSeeds, snapshotGhidraAnalysisSeeds, totalEntries, ghidraSeedFailure, ghidraSeedLimitations;
function init_GhidraAnalysisSeeds() {
	return (init_GhidraAnalysisSeeds = __esmMin((() => {
		init_GhidraAdmissionError();
		init_configurationErrors();
		init_providerAdapterError();
		init_GhidraFileArtifacts();
		init_RegularFile();
		init_result();
		GHIDRA_SEED_FORMAT = "rea-ghidra-seeds-v1";
		MAX_GHIDRA_SEED_BYTES = 32 * 1024 * 1024;
		MAX_GHIDRA_SEED_ENTRIES = 1e6;
		MAX_GHIDRA_SEED_NAME_LENGTH = 2e3;
		digest = z.string().regex(/^[a-f0-9]{64}$/u);
		count = z.int().nonnegative();
		ghidraSeedCommitmentSchema = z.strictObject({
			format: z.literal(GHIDRA_SEED_FORMAT),
			path: z.string().refine(isAbsolute, "Seed path must be absolute"),
			configured_path: z.string().refine(isAbsolute, "Seed path must be absolute"),
			sha256: digest,
			entries: z.strictObject({
				function: count,
				code: count,
				label: count
			})
		});
		ghidraSeedReportSchema = z.strictObject({
			format: z.literal(GHIDRA_SEED_FORMAT),
			sha256: digest,
			entries: count,
			function_created: count,
			function_existing: count,
			function_failed: count,
			code_decoded: count,
			code_failed: count,
			label_applied: count,
			label_failed: count,
			unmapped: count
		});
		seedLineError = (line, constraint) => new ConfigurationError("Invalid REA environment configuration", { settings: [{
			setting: "REA_GHIDRA_SEED_FILE",
			constraint: `line ${line}: ${constraint}`
		}] });
		parseGhidraSeeds = (text) => {
			const entries = [];
			const seen = new Set();
			const lines = text.split("\n");
			for (const [index, raw] of lines.entries()) {
				const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
				if (line.trim() === "" || line.startsWith("#")) continue;
				const number = index + 1;
				const fields = line.split("	");
				if (fields.length < 2 || fields.length > 3) return err(seedLineError(number, "expected address<TAB>kind[<TAB>name]"));
				const [address, kind, name] = fields;
				if (address === undefined || !/^0x[0-9a-fA-F]{1,16}$/u.test(address)) return err(seedLineError(number, "address must be 0x-prefixed hex"));
				if (kind !== "function" && kind !== "code" && kind !== "label") return err(seedLineError(number, "kind must be function, code or label"));
				if (name !== undefined && (name.length === 0 || name.length > 2e3 || /[\s\0]/u.test(name))) return err(seedLineError(number, `name must be 1..${MAX_GHIDRA_SEED_NAME_LENGTH} characters without whitespace`));
				if (kind === "label" && name === undefined) return err(seedLineError(number, "a label seed requires a name"));
				if (kind === "code" && name !== undefined) return err(seedLineError(number, "a code seed takes no name; add a label seed"));
				const value = BigInt(address);
				const key = `${value.toString(16)}:${kind}`;
				if (seen.has(key)) return err(seedLineError(number, `duplicate ${kind} seed at ${address}`));
				seen.add(key);
				entries.push({
					address: value,
					kind,
					...name === undefined ? {} : { name }
				});
				if (entries.length > 1e6) return err(seedLineError(number, `more than ${MAX_GHIDRA_SEED_ENTRIES} seed entries`));
			}
			return ok(entries);
		};
		normalizedSeeds = (entries) => entries.map((entry) => `0x${entry.address.toString(16)}\t${entry.kind}${entry.name === undefined ? "" : `\t${entry.name}`}\n`).join("");
		sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
		readSeeds = (path, resources, signal) => readGhidraProfileArtifact(path, MAX_GHIDRA_SEED_BYTES, resources, signal, (bytes) => {
			let text;
			try {
				text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
			} catch {
				throw seedLineError(0, "file is not valid UTF-8");
			}
			const parsed = parseGhidraSeeds(text);
			if (!parsed.ok) throw parsed.error;
			return parsed.value;
		});
		resolveSeedPath = async (configured) => {
			const selected = await stat(configured);
			if (!selected.isFile()) throw new NonRegularFileReadError(configured, selected.isDirectory());
			return realpath(configured);
		};
		resolveGhidraAnalysisSeeds = async (configured, resources, signal) => resources.run(async () => {
			if (configured === undefined) return ok(undefined);
			let entries;
			let path;
			try {
				path = await resolveSeedPath(configured);
				entries = await readSeeds(path, resources, signal);
			} catch (cause) {
				return err(ghidraFileFailure(cause, "resolve_analysis_profile", {
					setting: "REA_GHIDRA_SEED_FILE",
					path: configured
				}));
			}
			const normalized = normalizedSeeds(entries);
			const tally = {
				function: 0,
				code: 0,
				label: 0
			};
			for (const entry of entries) tally[entry.kind] += 1;
			return ok({
				format: GHIDRA_SEED_FORMAT,
				path,
				configured_path: configured,
				sha256: sha256(normalized),
				entries: tally
			});
		}).catch((cause) => err(ghidraFileFailure(cause, "resolve_analysis_profile", { setting: "REA_GHIDRA_SEED_FILE" })));
		snapshotGhidraAnalysisSeeds = async (commitment, runtimeRoot, resources, signal) => resources.run(async () => {
			ghidraSeedCommitmentSchema.parse(commitment);
			if (await resolveSeedPath(commitment.configured_path) !== commitment.path) throw new GhidraAdmissionError("seed_path_differs");
			const entries = await readSeeds(commitment.path, resources, signal);
			const normalized = normalizedSeeds(entries);
			if (sha256(normalized) !== commitment.sha256) throw new GhidraAdmissionError("seed_changed", { path: commitment.path });
			const directory = join(runtimeRoot, "seeds");
			await mkdir(directory, { mode: 448 });
			const path = join(directory, "seeds.tsv");
			await writeGhidraProfileArtifact(path, normalized, resources, signal);
			return path;
		}).catch((cause) => {
			throw ghidraFileFailure(cause, "open_binary", {
				setting: "REA_GHIDRA_SEED_FILE",
				path: commitment.path
			});
		});
		totalEntries = (commitment) => commitment.entries.function + commitment.entries.code + commitment.entries.label;
		ghidraSeedFailure = (commitment, report, operation) => {
			if (commitment === undefined && report === undefined) return undefined;
			const reason = commitment === undefined ? "The Ghidra session reported analysis seeds that the profile did not commit." : report === undefined ? "The Ghidra session did not report the committed analysis seeds." : report.sha256 !== commitment.sha256 || report.entries !== totalEntries(commitment) ? "The Ghidra session applied analysis seeds that differ from the committed profile." : undefined;
			return reason === undefined ? undefined : new ProviderAdapterError("ghidra", operation, { diagnostics: { reason } });
		};
		ghidraSeedLimitations = (commitment, report) => commitment === undefined ? [] : [`Ghidra analysis was seeded before auto-analysis from ${commitment.path} (sha256 ${commitment.sha256}: ${commitment.entries.function} function, ${commitment.entries.code} code, ${commitment.entries.label} label entries). Seeded functions, code and names are caller assertions, not Ghidra discoveries.`, ...report === undefined ? [] : [`Seed outcome: ${report.function_created} functions created, ${report.function_existing} already present, ${report.function_failed} failed; ${report.code_decoded} code seeds decoded, ${report.code_failed} failed; ${report.label_applied} labels applied, ${report.label_failed} failed; ${report.unmapped} seeds outside initialized memory.`]];
	})))();
}

//#endregion
//#region dist/process/PendingOperations.js
var PendingOperations;
function init_PendingOperations() {
	return (init_PendingOperations = __esmMin((() => {
		init_ProcessAdmissionError();
		PendingOperations = class {
			#pending = new Map();
			/** Number of currently correlated operations. */
			get size() {
				return this.#pending.size;
			}
			/** Return whether an operation key is awaiting a protocol reply. */
			has(key) {
				return this.#pending.has(key);
			}
			/** Register one unique operation key and await its reply or cancellation. */
			wait(key, options) {
				if (this.#pending.has(key)) throw new ProcessAdmissionError("duplicate_key");
				if (options.signal?.aborted === true) return Promise.resolve(options.cancelledValue());
				return new Promise((resolve) => {
					const onAbort = options.signal === undefined ? undefined : () => this.#finish(key, options.cancelledValue());
					const timer = options.timeoutMs === undefined ? undefined : setTimeout(() => this.#finish(key, options.timeoutValue()), options.timeoutMs);
					this.#pending.set(key, {
						resolve,
						timer,
						signal: options.signal,
						onAbort
					});
					if (onAbort !== undefined) options.signal?.addEventListener("abort", onAbort, { once: true });
				});
			}
			/** Settle one correlated reply; returns false for late or unknown keys. */
			settle(key, value) {
				return this.#finish(key, value);
			}
			/** Fail every active operation while releasing all timers and listeners. */
			failAll(valueFor) {
				for (const key of this.#pending.keys()) this.#finish(key, valueFor(key));
			}
			#finish(key, value) {
				const pending = this.#pending.get(key);
				if (pending === undefined) return false;
				this.#pending.delete(key);
				if (pending.timer !== undefined) clearTimeout(pending.timer);
				if (pending.signal !== undefined && pending.onAbort !== undefined) pending.signal.removeEventListener("abort", pending.onAbort);
				pending.resolve(value);
				return true;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/jsonStringSourceSpans.js
/** Map parsed string facts back to their original, validated JSON spelling.
* `encoded` excludes the quotes; callers own JSON decoding and span validity.
*/
function* jsonStringSourceSpans(encoded, offset, spans) {
	let sourceCursor = 0;
	let decodedCursor = 0;
	const sourceOffset = (boundary) => {
		while (decodedCursor < boundary) {
			sourceCursor += encoded[sourceCursor] === "\\" ? encoded[sourceCursor + 1] === "u" ? 6 : 2 : 1;
			decodedCursor++;
		}
		return offset + sourceCursor;
	};
	for (const span of spans) yield {
		start: sourceOffset(span.start),
		end: sourceOffset(span.end)
	};
}
function init_jsonStringSourceSpans() {
	return (init_jsonStringSourceSpans = __esmMin((() => {})))();
}

//#endregion
//#region dist/providers/StructuredContentMcpClient.js
var isSchema, StructuredContentMcpClient;
function init_StructuredContentMcpClient() {
	return (init_StructuredContentMcpClient = __esmMin((() => {
		isSchema = (value) => typeof value === "object" && value !== null && "~standard" in value;
		StructuredContentMcpClient = class extends Client {
			#toolResult = { "~standard": {
				version: 1,
				vendor: "rea-mcp-structured-content",
				validate: (input) => {
					const parsed = this._wireCodec().validateResult("tools/call", input);
					if (!parsed.ok) return { issues: [{ message: parsed.reason === "invalid" ? parsed.message : "not-in-era: tools/call" }] };
					if (typeof input === "object" && input !== null && Object.hasOwn(input, "structuredContent")) return { value: {
						...parsed.value,
						structuredContent: input.structuredContent
					} };
					return { value: parsed.value };
				}
			} };
			request(request, schemaOrOptions, options) {
				if (isSchema(schemaOrOptions)) return super.request(request, schemaOrOptions, options);
				if (request.method === "tools/call") return super.request(request, this.#toolResult, schemaOrOptions);
				return super.request(request, schemaOrOptions);
			}
		};
	})))();
}

//#endregion
//#region dist/providers/Utf8McpResponse.js
var McpHttpUtf8Error, validateMcpHttpResponse;
function init_Utf8McpResponse() {
	return (init_Utf8McpResponse = __esmMin((() => {
		init_analysisErrorCore();
		McpHttpUtf8Error = class extends AnalysisProtocolError {
			constructor(cause) {
				super("MCP HTTP response body omitted: not valid UTF-8.", { cause });
			}
		};
		validateMcpHttpResponse = (response, rejectTransport) => {
			if (!response.ok || response.body === null) return response;
			const decoder = new TextDecoder("utf-8", {
				fatal: true,
				ignoreBOM: true
			});
			const validate = (bytes) => {
				try {
					decoder.decode(bytes, { stream: bytes !== undefined });
				} catch (cause) {
					const failure = new McpHttpUtf8Error(cause);
					rejectTransport(failure);
					throw failure;
				}
			};
			const body = response.body.pipeThrough(new TransformStream({
				transform(bytes, controller) {
					validate(bytes);
					controller.enqueue(bytes);
				},
				flush() {
					validate();
				}
			}));
			const validated = new Response(body, {
				status: response.status,
				statusText: response.statusText,
				headers: response.headers
			});
			Object.defineProperties(validated, {
				url: { value: response.url },
				redirected: { value: response.redirected },
				type: { value: response.type }
			});
			return validated;
		};
	})))();
}

//#endregion
//#region dist/providers/McpToolResult.js
var structuredContentSchema, mcpToolResultSchema, mcpTextBlocks, parseMcpJsonOrText;
function init_McpToolResult() {
	return (init_McpToolResult = __esmMin((() => {
		init_jsonValue();
		structuredContentSchema = z.custom((value) => {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
			const prototype = Object.getPrototypeOf(value);
			return prototype === Object.prototype || prototype === null;
		});
		mcpToolResultSchema = z.object({
			isError: z.boolean().optional(),
			structuredContent: structuredContentSchema.optional(),
			content: z.array(z.object({
				type: z.string(),
				text: z.string().optional()
			}).passthrough())
		});
		mcpTextBlocks = (content) => content.flatMap((block) => block.type === "text" && block.text !== undefined ? [block.text] : []);
		parseMcpJsonOrText = (text) => {
			let value;
			try {
				value = JSON.parse(text);
			} catch {
				return text;
			}
			return jsonValueSchema.parse(value);
		};
	})))();
}

//#endregion
export { MAX_GHIDRA_SEED_BYTES, MAX_GHIDRA_SEED_ENTRIES, MAX_GHIDRA_SEED_NAME_LENGTH, McpHttpUtf8Error, PendingOperations, StructuredContentMcpClient, ghidraSeedCommitmentSchema, ghidraSeedFailure, ghidraSeedLimitations, ghidraSeedReportSchema, init_GhidraAnalysisSeeds, init_McpToolResult, init_PendingOperations, init_StructuredContentMcpClient, init_Utf8McpResponse, init_jsonStringSourceSpans, jsonStringSourceSpans, mcpTextBlocks, mcpToolResultSchema, parseMcpJsonOrText, resolveGhidraAnalysisSeeds, snapshotGhidraAnalysisSeeds, validateMcpHttpResponse };