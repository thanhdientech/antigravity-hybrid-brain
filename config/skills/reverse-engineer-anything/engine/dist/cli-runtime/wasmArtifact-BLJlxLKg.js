import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { absoluteLocalPathStringSchema, init_localPath } from "./jsonValue-DGGrC1lE.js";
import { createHash } from "node:crypto";
import { z } from "zod";

//#region dist/domain/analysisErrorRecovery.js
var analysisCleanupRetrySchema, cleanupRetryRecovery, cleanupRetryRemediation, analysisErrorRecoverySchema;
function init_analysisErrorRecovery() {
	return (init_analysisErrorRecovery = __esmMin((() => {
		analysisCleanupRetrySchema = z.object({ operation: z.literal("close_binary") }).strict();
		cleanupRetryRecovery = (retry) => ({
			kind: "retry_cleanup",
			operation: retry.operation
		});
		cleanupRetryRemediation = (retry) => `This connection retains that cleanup. Keep it open; after the reported condition settles or is resolved, call ${retry.operation} without snapshot_path and check its result. That call retries the retained cleanup without rerunning the failed analysis, preserves investigation Evidence and Unknown history, and can report cleanup_incomplete again.`;
		analysisErrorRecoverySchema = z.discriminatedUnion("kind", [
			z.object({
				kind: z.literal("inspect_input_contract"),
				operation: z.string().min(1)
			}).strict(),
			z.object({
				kind: z.literal("inspect_timeout_state"),
				operation: z.string().min(1),
				timeout_ms: z.number().int().positive()
			}).strict(),
			z.object({
				kind: z.literal("retry_cleanup"),
				operation: z.string().min(1)
			}).strict()
		]);
	})))();
}

//#endregion
//#region dist/domain/wasm/wasmInterface.js
var kind, valueType, limit, signature, wasmInterfaceSchema, WASM_INTERFACE_REPRESENTATION_BYTES, wasmInterfaceEntryRepresentationBytes;
function init_wasmInterface() {
	return (init_wasmInterface = __esmMin((() => {
		kind = z.enum([
			"func",
			"table",
			"memory",
			"global",
			"tag",
			"unknown"
		]);
		valueType = z.enum([
			"i32",
			"i64",
			"f32",
			"f64",
			"v128",
			"funcref",
			"externref"
		]);
		limit = z.string().regex(/^(?:0|[1-9][0-9]*)$/u);
		signature = z.discriminatedUnion("kind", [
			z.object({
				kind: z.literal("func"),
				params: z.array(valueType),
				results: z.array(valueType)
			}),
			z.object({
				kind: z.literal("tag"),
				params: z.array(valueType),
				results: z.array(valueType)
			}),
			z.object({
				kind: z.literal("table"),
				element: z.enum(["funcref", "externref"]),
				address_type: z.enum(["i32", "i64"]),
				minimum: limit,
				maximum: limit.nullable(),
				shared: z.boolean()
			}),
			z.object({
				kind: z.literal("memory"),
				page_size: limit,
				address_type: z.enum(["i32", "i64"]),
				minimum: limit,
				maximum: limit.nullable(),
				shared: z.boolean()
			}),
			z.object({
				kind: z.literal("global"),
				value_type: valueType,
				mutable: z.boolean()
			})
		]);
		wasmInterfaceSchema = z.object({
			state: z.enum(["complete", "partial"]),
			entries: z.array(z.object({
				direction: z.enum(["import", "export"]),
				module: z.string().nullable(),
				name: z.string(),
				kind,
				index: z.int().nonnegative().max(4294967295).nullable(),
				signature: signature.nullable(),
				wat_form: z.string(),
				issue: z.string().nullable()
			}).superRefine((entry, context) => {
				if (entry.direction === "export" && entry.module !== null || entry.direction === "import" && entry.module === null) context.addIssue({
					code: "custom",
					message: "Interface direction does not match module-name presence"
				});
				if (entry.signature !== null && entry.signature.kind !== entry.kind) context.addIssue({
					code: "custom",
					message: "Interface kind does not match its typed signature"
				});
			})),
			issues: z.array(z.string())
		});
		WASM_INTERFACE_REPRESENTATION_BYTES = 32 * 1024 * 1024;
		wasmInterfaceEntryRepresentationBytes = (entry) => {
			let bytes = 1024 + [
				entry.module,
				entry.name,
				entry.wat_form,
				entry.issue
			].reduce((sum, value) => sum + (value?.length ?? 0) * 6, 0);
			const signature = entry.signature;
			if (signature?.kind === "func" || signature?.kind === "tag") bytes += (signature.params.length + signature.results.length) * 16;
			else if (signature !== null) {
				for (const value of Object.values(signature)) if (typeof value === "string") bytes += value.length * 6;
			}
			return bytes;
		};
	})))();
}

//#endregion
//#region dist/domain/wasm/wasmArtifact.js
var digest, artifact, DEFAULT_WASM_COMMAND_TIMEOUT_MS, MAX_WASM_COMMAND_TIMEOUT_MS, wasmArtifactPathsSchema, inspectWasmArtifactInputSchema, wasmArtifactSchema, wasmArtifactMatchesSubject;
function init_wasmArtifact() {
	return (init_wasmArtifact = __esmMin((() => {
		init_wasmInterface();
		init_localPath();
		digest = z.string().regex(/^[a-f0-9]{64}$/);
		artifact = z.strictObject({
			path: z.string().min(1),
			sha256: digest,
			bytes: z.int().nonnegative()
		});
		DEFAULT_WASM_COMMAND_TIMEOUT_MS = 3e4;
		MAX_WASM_COMMAND_TIMEOUT_MS = 2147483647;
		wasmArtifactPathsSchema = (pathSchema = absoluteLocalPathStringSchema) => z.array(pathSchema).max(16);
		inspectWasmArtifactInputSchema = z.strictObject({
			path: absoluteLocalPathStringSchema.describe("Absolute selected local WASM artifact path"),
			glue_paths: wasmArtifactPathsSchema().default([]),
			candidate_paths: wasmArtifactPathsSchema().default([]),
			command_timeout_ms: z.number().int().min(1).max(MAX_WASM_COMMAND_TIMEOUT_MS).exactOptional().describe(`Deadline in milliseconds for each WABT version/analysis command (default ${String(DEFAULT_WASM_COMMAND_TIMEOUT_MS)}), not the whole inspection. Allow additional client time for all commands, file checks and cleanup. Input/output safety limits remain fixed.`)
		});
		wasmArtifactSchema = z.strictObject({
			artifact,
			validation: z.literal("valid"),
			sections: z.array(z.strictObject({
				kind: z.string().min(1),
				start: z.int().nonnegative(),
				end: z.int().nonnegative(),
				bytes: z.int().nonnegative(),
				description: z.string()
			})),
			interface: wasmInterfaceSchema.exactOptional(),
			imports: z.array(z.string()),
			exports: z.array(z.string()),
			debug_name_metadata: z.enum([
				"unknown",
				"not-present",
				"complete",
				"uninterpretable"
			]).default("unknown"),
			custom_section_warnings: z.array(z.strictObject({
				tool: z.enum([
					"wasm-validate",
					"wasm-objdump",
					"wasm2wat"
				]),
				text: z.string().min(1)
			})).nullable().default(null),
			headers: z.string(),
			details: z.string(),
			wat: z.strictObject({
				text: z.string().min(1),
				sha256: digest,
				representation: z.literal("decoded-wat")
			}),
			tool_profile: z.strictObject({
				source: z.literal("https://github.com/WebAssembly/wabt"),
				release: z.literal("1.0.42"),
				source_commit: z.literal("ff0ef7e0009402740c805a9744c09b05be063e48"),
				commands: z.array(z.strictObject({
					tool: z.enum([
						"wasm-validate",
						"wasm-objdump",
						"wasm2wat"
					]),
					path: z.string().min(1),
					sha256: digest,
					version_banner: z.string(),
					arguments: z.array(z.string())
				})).length(3),
				timeout_ms: z.int().positive(),
				output_budget_bytes: z.int().positive()
			}),
			candidates: z.array(artifact),
			glue: z.array(z.strictObject({
				artifact,
				parse_status: z.enum([
					"complete",
					"partial",
					"failed"
				]),
				references: z.array(z.strictObject({
					value: z.string(),
					line: z.int().positive(),
					column: z.int().nonnegative(),
					candidate_paths: z.array(z.string()),
					association: z.enum([
						"local-path-candidate",
						"basename-candidates",
						"unresolved"
					]),
					evidence_kind: z.literal("static-literal")
				}))
			})),
			runtime_execution: z.literal("not-performed"),
			network_fetch: z.literal("not-performed"),
			limitations: z.array(z.string())
		}).superRefine((value, context) => {
			if (createHash("sha256").update(value.wat.text, "utf8").digest("hex") !== value.wat.sha256) context.addIssue({
				code: "custom",
				path: ["wat", "sha256"],
				message: "Decoded WAT digest does not match its UTF-8 text."
			});
			const selected = value.candidates[0];
			if (selected?.path !== value.artifact.path || selected.sha256 !== value.artifact.sha256 || selected.bytes !== value.artifact.bytes) context.addIssue({
				code: "custom",
				path: ["candidates"],
				message: "Selected candidate does not match artifact identity."
			});
			const tolerantCustomSections = value.tool_profile.commands[0]?.arguments.includes("--ignore-custom-section-errors");
			for (const [index, command] of value.tool_profile.commands.entries()) {
				const expected = [
					"wasm-validate",
					"wasm-objdump",
					"wasm2wat"
				][index];
				const argumentsExpected = command.tool === "wasm-objdump" ? [
					"-h",
					"-x",
					"module.wasm"
				] : tolerantCustomSections ? [
					"--enable-all",
					"--ignore-custom-section-errors",
					"module.wasm"
				] : ["--enable-all", "module.wasm"];
				if (command.tool !== expected || command.version_banner.trim() !== "1.0.42" || JSON.stringify(command.arguments) !== JSON.stringify(argumentsExpected)) context.addIssue({
					code: "custom",
					path: [
						"tool_profile",
						"commands",
						index
					],
					message: "Unexpected WABT command profile."
				});
			}
			for (const [index, section] of value.sections.entries()) if (section.end > value.artifact.bytes || section.end - section.start !== section.bytes) context.addIssue({
				code: "custom",
				path: ["sections", index],
				message: "Section range does not match selected artifact bytes."
			});
		});
		wasmArtifactMatchesSubject = (artifact, subject) => subject != null && subject.sha256 === artifact.sha256 && subject.format === "file";
	})))();
}

//#endregion
export { DEFAULT_WASM_COMMAND_TIMEOUT_MS, MAX_WASM_COMMAND_TIMEOUT_MS, WASM_INTERFACE_REPRESENTATION_BYTES, analysisCleanupRetrySchema, analysisErrorRecoverySchema, cleanupRetryRecovery, cleanupRetryRemediation, init_analysisErrorRecovery, init_wasmArtifact, init_wasmInterface, inspectWasmArtifactInputSchema, wasmArtifactMatchesSubject, wasmArtifactPathsSchema, wasmArtifactSchema, wasmInterfaceEntryRepresentationBytes, wasmInterfaceSchema };