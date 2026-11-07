import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { containsUnpairedSurrogate, containsUnrepresentableMarkdown, delimitedOutputInputError, err, formatCliOutput, formatDelimitedOutputParts, hasUnpairedSurrogate, init_analysisErrorProjection, init_cliOutputFormatter, init_jsonLines, init_jsonOutput, init_result, isTerminalOutput, jsonLineParts, jsonLinesErrorRecord, jsonLinesParts, jsonLinesRecords, jsonOutputParts, ok, prepareDelimitedOutput, prepareJsonLines, projectAnalysisError, writeJsonOutput, writeOutputParts, writeOutputText } from "./jsonLines-CKG28FwL.js";
import { AnalysisError, AnalysisInputError, AnalysisResourceConstraintError, init_analysisErrorBase, init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { analysisCliErrorEnvelopeSchema, analysisErrorProjectionSchema, init_errorSchemas } from "./errorSchemas-D2zXEC9o.js";
import { init_cliBuiltinArguments, normalizeCliArguments, splitIncurBuiltinArguments } from "./cliBuiltinArguments-BJuf_1CV.js";
import { Cli, Filter } from "incur";
import { constants } from "node:buffer";
import { AsyncLocalStorage } from "node:async_hooks";
import { estimateTokenCount } from "tokenx";

//#region dist/cliLogging.js
var isRecord, loggedFailures, canonicalFailure, projectCliOperationFailure, inferCliOperationFailure, cliOperationFailurePayload, isCliOperationFailure, cliOperationFailureIdentity, logCliCommand;
function init_cliLogging() {
	return (init_cliLogging = __esmMin((() => {
		init_errorSchemas();
		init_analysisErrorBase();
		init_analysisErrorProjection();
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		loggedFailures = new WeakMap();
		canonicalFailure = (projection) => ({
			payload: projection,
			identity: {
				code: projection.code,
				category: projection.category,
				retryable: projection.retryable
			}
		});
		projectCliOperationFailure = (value) => {
			if (!isRecord(value)) return undefined;
			const direct = analysisErrorProjectionSchema.safeParse(value);
			if (direct.success) return value;
			const envelope = analysisCliErrorEnvelopeSchema.safeParse(value);
			if (envelope.success) {
				const { error: _label, input_path: inputPath, input_reason: inputReason, ...projection } = value;
				const parsed = projection;
				if (typeof inputPath !== "string" && typeof inputReason !== "string") return parsed;
				return {
					...parsed,
					details: {
						...parsed.details,
						...typeof inputPath === "string" ? { input_path: inputPath } : {},
						...typeof inputReason === "string" ? { input_reason: inputReason } : {}
					}
				};
			}
			if (isRecord(value.error)) {
				const nested = analysisErrorProjectionSchema.safeParse(value.error);
				if (nested.success) return value.error;
			}
			return undefined;
		};
		inferCliOperationFailure = (value) => {
			const projection = projectCliOperationFailure(value);
			if (projection !== undefined) return canonicalFailure(projection);
			if (isRecord(value) && value.healthy === false) return { payload: value };
			return undefined;
		};
		cliOperationFailurePayload = (value) => {
			if (isRecord(value) && loggedFailures.has(value)) return loggedFailures.get(value)?.payload;
			const failure = inferCliOperationFailure(value);
			if (failure !== undefined && isRecord(value)) loggedFailures.set(value, failure);
			return failure?.payload;
		};
		isCliOperationFailure = (value) => cliOperationFailurePayload(value) !== undefined;
		cliOperationFailureIdentity = (value) => isRecord(value) ? loggedFailures.get(value)?.identity : undefined;
		logCliCommand = async (logger, command, execute, isCommandFailure) => {
			const startedAt = performance.now();
			try {
				const value = await execute();
				const inferredFailure = inferCliOperationFailure(value);
				const failed = isCommandFailure?.(value) ?? inferredFailure !== undefined;
				if (isRecord(value)) loggedFailures.set(value, failed ? inferredFailure ?? { payload: value } : undefined);
				logger[failed ? "error" : "info"]({
					command,
					durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
					status: failed ? "error" : "ok"
				}, failed ? "CLI command failed" : "CLI command completed");
				if (failed) process.exitCode = 1;
				return value;
			} catch (cause) {
				process.exitCode = 1;
				logger.error({
					command,
					durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
					status: "error"
				}, "CLI command failed");
				if (cause instanceof AnalysisError) {
					process.exitCode = 1;
					const projection = projectAnalysisError(cause);
					loggedFailures.set(projection, canonicalFailure(projection));
					return projection;
				}
				throw cause;
			}
		};
	})))();
}

//#endregion
//#region dist/cli/cliEvidencePublication.js
var publication, withCliEvidencePublication, recordCliEvidencePublication, cliEvidencePublicationReceipt, retainCliPublicationOnError;
function init_cliEvidencePublication() {
	return (init_cliEvidencePublication = __esmMin((() => {
		publication = new AsyncLocalStorage();
		withCliEvidencePublication = (run) => publication.run({}, run);
		recordCliEvidencePublication = (receipt) => {
			const context = publication.getStore();
			if (context !== undefined) context.receipt = receipt;
		};
		cliEvidencePublicationReceipt = () => publication.getStore()?.receipt;
		retainCliPublicationOnError = (error, receipt = cliEvidencePublicationReceipt()) => {
			return receipt === undefined ? error : error.retainDiagnostics({ evidence_bundle: { ...receipt } });
		};
	})))();
}

//#endregion
//#region dist/cli/visitRegisteredCommands.js
var registeredCommands, visitRegisteredCommands, visitCommands;
function init_visitRegisteredCommands() {
	return (init_visitRegisteredCommands = __esmMin((() => {
		registeredCommands = Cli.toCommands;
		visitRegisteredCommands = (cli, visit) => {
			const commands = registeredCommands.get(cli);
			if (commands !== undefined) visitCommands(commands, [], undefined, visit);
		};
		visitCommands = (commands, parents, inheritedPolicy, visit) => {
			for (const [name, entry] of commands) {
				const path = [...parents, name];
				if ("_group" in entry) {
					const policy = entry.outputPolicy ?? inheritedPolicy;
					visitCommands(entry.commands, path, policy, visit);
					if (entry.root !== undefined) visit(entry.root, path.join(" "), entry.root.outputPolicy ?? policy);
				} else if (!("_alias" in entry) && !("_fetch" in entry)) {
					visit(entry, path.join(" "), entry.outputPolicy ?? inheritedPolicy);
				}
			}
		};
	})))();
}

//#endregion
//#region dist/cli/tokenWindow.js
var TOKEN_SPLIT_PATTERN, codePointSafeBoundary, segmentBoundary, sliceTextByTokenWindow;
function init_tokenWindow() {
	return (init_tokenWindow = __esmMin((() => {
		TOKEN_SPLIT_PATTERN = /(\s+|[.,!?;(){}[\]<>:/\\|@#$%^&*+=`~_-]+)/;
		codePointSafeBoundary = (text, offset) => offset > 0 && offset < text.length && text.charCodeAt(offset - 1) >= 55296 && text.charCodeAt(offset - 1) <= 56319 && text.charCodeAt(offset) >= 56320 && text.charCodeAt(offset) <= 57343 ? offset - 1 : offset;
		segmentBoundary = (segment, tokenOffset, tokenCount) => codePointSafeBoundary(segment, Math.floor(tokenOffset / tokenCount * segment.length));
		sliceTextByTokenWindow = (text, offset, limit) => {
			const total = estimateTokenCount(text);
			const end = limit === undefined ? total : offset + limit;
			if (offset === 0 && end >= total) return {
				text,
				total,
				start: 0,
				end: total,
				truncated: false
			};
			const actualEnd = Math.min(end, total);
			if (offset >= actualEnd) return {
				text: "",
				total,
				start: actualEnd,
				end: actualEnd,
				truncated: true
			};
			const parts = [];
			let tokenPosition = 0;
			for (const segment of text.split(TOKEN_SPLIT_PATTERN).filter(Boolean)) {
				if (tokenPosition >= actualEnd && actualEnd < total) break;
				const tokenCount = estimateTokenCount(segment);
				if (tokenCount === 0) {
					if (tokenPosition >= offset && (tokenPosition < actualEnd || actualEnd === total)) parts.push(segment);
					continue;
				}
				const segmentEnd = tokenPosition + tokenCount;
				if (tokenPosition < actualEnd && segmentEnd > offset) {
					const localStart = Math.max(0, offset - tokenPosition);
					const localEnd = Math.min(tokenCount, actualEnd - tokenPosition);
					const charStart = segmentBoundary(segment, localStart, tokenCount);
					const charEnd = segmentBoundary(segment, localEnd, tokenCount);
					parts.push(segment.slice(charStart, charEnd));
				}
				tokenPosition = segmentEnd;
			}
			return {
				text: parts.join(""),
				total,
				start: offset,
				end: actualEnd,
				truncated: true
			};
		};
	})))();
}

//#endregion
//#region dist/cli/jsonLinesOutput.js
var writeCliJsonLines;
function init_jsonLinesOutput() {
	return (init_jsonLinesOutput = __esmMin((() => {
		init_analysisErrorCore();
		init_analysisErrorProjection();
		init_jsonLines();
		init_jsonOutput();
		init_cliEvidencePublication();
		writeCliJsonLines = async (options, destination) => {
			const { source, selected, operationFailure } = options;
			let error;
			const meta = {
				command: options.command,
				duration: options.duration
			};
			const envelope = (data) => options.fullOutput ? {
				ok: true,
				data,
				meta
			} : data;
			let failureRecord = operationFailure === undefined ? undefined : jsonLinesErrorRecord(options.fullOutput ? {
				ok: false,
				error: operationFailure,
				meta
			} : operationFailure);
			const plan = failureRecord === undefined ? prepareJsonLines(envelope(selected), {
				command: options.command,
				source: envelope(source),
				...options.filterOutput === undefined ? {} : { filter: options.filterOutput },
				...options.filterPaths === undefined ? {} : { filterPaths: options.filterPaths },
				fullOutput: options.fullOutput
			}) : undefined;
			if (plan?.ok === false) {
				error = projectAnalysisError(retainCliPublicationOnError(plan.error));
				failureRecord = jsonLinesErrorRecord(options.fullOutput ? {
					ok: false,
					error,
					meta
				} : error);
			}
			if (failureRecord !== undefined) {
				await writeJsonOutput(failureRecord, destination, "jsonl");
			} else if (plan?.ok === true) {
				if (options.tokenCount) {
					let count = 0;
					for (const record of jsonLinesRecords(plan.value)) {
						let characters = 0;
						for (const part of jsonLineParts(record)) characters += part.length;
						if (characters > constants.MAX_STRING_LENGTH) {
							error = projectAnalysisError(retainCliPublicationOnError(new AnalysisResourceConstraintError(options.command, "memory", "A JSON Lines record exceeds the token estimator's runtime string limit.", {
								formatted_characters: characters,
								max_string_characters: constants.MAX_STRING_LENGTH
							}, { remediationAction: "Remove --token-count to stream the records, or select smaller fields with --filter-output." })));
							break;
						}
						count += estimateTokenCount([...jsonLineParts(record)].join(""));
					}
					if (error !== undefined) await writeJsonOutput(jsonLinesErrorRecord(options.fullOutput ? {
						ok: false,
						error,
						meta
					} : error), destination, "jsonl");
					else await writeOutputText(destination, `${count}\n`);
				} else await writeOutputParts(destination, jsonLinesParts(plan.value));
			}
			return error;
		};
	})))();
}

//#endregion
//#region dist/cli/cliResultOutput.js
var streamCliCommandResults, wrapCommand, createCliResultOutput, fullFailureEnvelope, resolveDelimitedRows, delimitedMetadata, applyCliOutputFilter, expandImplicitArrayPath, projectObjectPaths, projectChildPaths, projectArraySlices, normalizeSliceIndex, normalizeJsonArrayValues;
function init_cliResultOutput() {
	return (init_cliResultOutput = __esmMin((() => {
		init_errorSchemas();
		init_cliBuiltinArguments();
		init_cliLogging();
		init_analysisErrorCore();
		init_result();
		init_tokenWindow();
		init_analysisErrorProjection();
		init_cliOutputFormatter();
		init_cliEvidencePublication();
		init_jsonLines();
		init_jsonLinesOutput();
		init_jsonOutput();
		init_visitRegisteredCommands();
		streamCliCommandResults = (cli, output) => {
			visitRegisteredCommands(cli, (command, path, inheritedPolicy) => wrapCommand(command, path, output, inheritedPolicy));
			const serve = cli.serve.bind(cli);
			cli.serve = (args = process.argv.slice(2), serveOptions) => serve(output.sdkArguments(args), serveOptions);
		};
		wrapCommand = (command, name, output, inheritedPolicy) => {
			const run = command.run;
			command.run = (context) => withCliEvidencePublication(() => {
				const started = performance.now();
				const result = run(context);
				if (typeof result === "object" && result !== null && Symbol.asyncIterator in result) {
					output.delegateStreaming();
					return result;
				}
				return Promise.resolve(result).then(async (value) => {
					if (typeof value === "object" && value !== null && Symbol.for("incur.sentinel") in value) return value;
					if (!await output.write(value, {
						command: name,
						format: context.format,
						renderOutput: context.agent || inheritedPolicy !== "agent-only",
						duration: `${Math.round(performance.now() - started)}ms`
					})) return value;
					if (output.error !== undefined) return context.error({
						code: output.error.code,
						message: output.error.message
					});
					return undefined;
				});
			});
		};
		createCliResultOutput = (initialOptions, destination) => {
			let options = initialOptions;
			if (!options.validation.ok) return undefined;
			let format = options.format;
			let handled = false;
			let failed = false;
			let error;
			let streaming = false;
			let sdkDocumentControls = false;
			const sdkParts = [];
			let sdkCompletion;
			let completed;
			const recoverFormattingFailure = async (cause) => {
				if (completed === undefined || handled || !(cause instanceof RangeError) || cause.message !== "Invalid string length") return false;
				const { originalFailure } = completed;
				error = projectAnalysisError(retainCliPublicationOnError(new AnalysisResourceConstraintError(completed.metadata.command, "memory", `The ${format} result could not fit in a runtime string. The original result was not written.`, {
					format,
					formatted_characters: null,
					max_string_characters: constants.MAX_STRING_LENGTH,
					...originalFailure === undefined ? {} : { original_failure: originalFailure }
				}, {
					cause,
					retryable: false,
					remediationAction: "Use --format json to stream the complete result, or narrow it with --filter-output. Token limits are applied after formatting and cannot avoid this constraint."
				}), completed.receipt));
				const document = options.fullOutput ? {
					ok: false,
					error,
					meta: {
						command: completed.metadata.command,
						duration: completed.metadata.duration
					}
				} : error;
				const recoveryFormat = format === "csv" || format === "tsv" ? "json" : format;
				const text = formatCliOutput(format === "jsonl" ? jsonLinesErrorRecord(document) : document, recoveryFormat);
				handled = true;
				try {
					await writeOutputText(destination, `${text}\n`);
				} catch (writeFailure) {
					failed = true;
					throw writeFailure;
				}
				return true;
			};
			const write = async (value, metadata) => {
				completed = undefined;
				if (metadata.format !== format && !((format === "csv" || format === "tsv") && metadata.format === "json")) return false;
				try {
					return await writeResult(value, metadata);
				} catch (cause) {
					if (await recoverFormattingFailure(cause)) return true;
					throw cause;
				}
			};
			return {
				get handled() {
					return handled;
				},
				get failed() {
					return failed;
				},
				get error() {
					return error;
				},
				begin(nextOptions) {
					options = nextOptions;
					format = options.format;
					handled = false;
					failed = false;
					error = undefined;
					completed = undefined;
					streaming = false;
					sdkDocumentControls = false;
					sdkParts.length = 0;
					sdkCompletion = undefined;
				},
				sdkArguments(args) {
					const normalized = normalizeCliArguments(args);
					const split = splitIncurBuiltinArguments(normalized);
					const values = new Set(split.outputValues.map(({ index }) => index));
					const hasFlag = (flag) => normalized.some((token, index) => token === flag && !values.has(index));
					sdkDocumentControls = (options.tokenCount || options.tokenWindow) && (hasFlag("--llms") || hasFlag("--llms-full") || hasFlag("--schema") && ![
						"completions",
						"mcp",
						"skills"
					].includes(split.command[0] ?? "") && !hasFlag("--help") && !hasFlag("-h") && !hasFlag("--version"));
					if (format !== "jsonl" || !options.tokenCount) return normalized;
					return normalized.filter((token, index) => token !== "--token-count" || values.has(index));
				},
				delegateStreaming() {
					streaming = true;
				},
				captureSdkOutput(text) {
					const captureJson = format === "json" && !isTerminalOutput(destination);
					if (format !== "jsonl" && !sdkDocumentControls && !captureJson || streaming || handled) return false;
					if (text.length > 0) sdkParts.push(text);
					return true;
				},
				finishSdkOutput(exitCode) {
					return sdkCompletion ??= (async () => {
						const parts = sdkParts.splice(0);
						try {
							if (parts.length === 0) {
								await writeOutputText(destination, "");
								return;
							}
							if (format === "json") {
								const text = parts.join("");
								let result;
								try {
									result = JSON.parse(text);
								} catch {
									if (exitCode === 0 && options.tokenCount && sdkDocumentControls) {
										await writeOutputText(destination, `${estimateTokenCount(text)}\n`);
										return;
									}
									await writeOutputText(destination, text);
									return;
								}
								if (exitCode === 0 && options.tokenCount) {
									const compact = [...jsonOutputParts(result, "json", false)].join("");
									await writeOutputText(destination, `${estimateTokenCount(compact)}\n`);
									return;
								}
								await writeJsonOutput(result, destination, "json");
								return;
							}
							if (exitCode === 0) {
								if (options.tokenCount) await writeOutputText(destination, `${estimateTokenCount(parts.join(""))}\n`);
								else if (sdkDocumentControls && options.tokenWindow) {
									const text = parts.join("");
									const window = sliceTextByTokenWindow(text, options.tokenOffset ?? 0, options.tokenLimit);
									await writeOutputText(destination, window.truncated ? `${window.text}\n[truncated: showing tokens ${window.start}–${window.end} of ${window.total}]\n` : text);
								} else for (const part of parts) await writeOutputText(destination, part);
							} else {
								const text = parts.join("");
								if (format !== "jsonl") {
									await writeOutputText(destination, text);
									return;
								}
								let result = text;
								try {
									result = JSON.parse(text);
								} catch {}
								await writeJsonOutput(jsonLinesErrorRecord(result), destination, "jsonl");
							}
						} catch (cause) {
							handled = true;
							failed = true;
							throw cause;
						}
					})();
				},
				write,
				recoverFormattingFailure
			};
			async function writeResult(value, metadata) {
				completed = {
					metadata,
					receipt: cliEvidencePublicationReceipt(),
					originalFailure: cliOperationFailureIdentity(value)
				};
				const filterPaths = options.filterOutput ? Filter.parse(options.filterOutput) : undefined;
				const operationFailure = format === "jsonl" || options.fullOutput || filterPaths !== undefined ? cliOperationFailurePayload(value) : undefined;
				const failure = options.fullOutput ? operationFailure : undefined;
				const ownsFilteredOutput = operationFailure === undefined && filterPaths !== undefined && filterPaths.length > 0;
				if (operationFailure === undefined && metadata.renderOutput === false && format !== "jsonl" && !options.fullOutput && !options.tokenCount) return false;
				if (format === "csv" || format === "tsv") {
					const meta = {
						command: metadata.command,
						duration: metadata.duration
					};
					if (operationFailure !== undefined) {
						const parsedFailure = analysisErrorProjectionSchema.safeParse(operationFailure);
						error = parsedFailure.success ? parsedFailure.data : projectAnalysisError(delimitedOutputInputError(["--format"], "CSV/TSV output was not produced because the command did not return a successful row collection.", metadata.command));
						handled = true;
						try {
							await writeJsonOutput(options.fullOutput ? {
								ok: false,
								error: operationFailure,
								meta
							} : operationFailure, destination);
						} catch (cause) {
							failed = true;
							throw cause;
						}
						return true;
					}
					const selection = resolveDelimitedRows(value, filterPaths, metadata.command);
					const prepared = selection.ok ? prepareDelimitedOutput(selection.value.rows, format, {
						fields: options.columns ?? [],
						metadata: delimitedMetadata(selection.value, format, metadata)
					}) : selection;
					if (!prepared.ok) {
						error = projectAnalysisError(retainCliPublicationOnError(prepared.error));
						handled = true;
						try {
							await writeJsonOutput(options.fullOutput ? {
								ok: false,
								error,
								meta
							} : error, destination);
						} catch (writeFailure) {
							failed = true;
							throw writeFailure;
						}
					} else {
						handled = true;
						try {
							await writeOutputParts(destination, formatDelimitedOutputParts(prepared.value));
						} catch (cause) {
							failed = true;
							throw cause;
						}
					}
					return true;
				}
				const selection = operationFailure !== undefined || filterPaths === undefined ? ok(operationFailure ?? value) : applyCliOutputFilter(value, filterPaths);
				if (!selection.ok) {
					error = projectAnalysisError(retainCliPublicationOnError(new AnalysisInputError(metadata.command, {
						userMessage: selection.error,
						remediationAction: "Select array indices with slices, or request array properties in a separate --filter-output invocation."
					}, [{
						path: ["filter-output"],
						reason: "invalid_value",
						message: selection.error
					}])));
					const document = options.fullOutput ? {
						ok: false,
						error,
						meta: {
							command: metadata.command,
							duration: metadata.duration
						}
					} : error;
					handled = true;
					await writeOutputText(destination, `${formatCliOutput(format === "jsonl" ? jsonLinesErrorRecord(document) : document, format)}\n`);
					return true;
				}
				const selected = selection.value;
				const refuseUnrepresentableText = async () => {
					error = projectAnalysisError(new AnalysisInputError(metadata.command, {
						userMessage: format === "md" ? "Markdown cannot preserve NUL or unpaired UTF-16 surrogates in rendered output." : "TOON cannot preserve unpaired UTF-16 surrogates in UTF-8 output.",
						remediationAction: "Use --format json or --format yaml to retain the exact code units.",
						...completed?.originalFailure === undefined ? {} : { diagnostics: { original_failure: completed.originalFailure } }
					}, [{
						path: ["--format"],
						reason: "invalid_value",
						message: "The selected format cannot preserve this value."
					}]));
					const document = options.fullOutput ? {
						ok: false,
						error,
						meta: {
							command: metadata.command,
							duration: metadata.duration
						}
					} : error;
					handled = true;
					try {
						await writeOutputText(destination, `${formatCliOutput(document, format)}\n`);
					} catch (cause) {
						failed = true;
						throw cause;
					}
					return true;
				};
				if ((format === "toon" || format === "md") && !options.tokenCount && (!options.tokenWindow || format === "md" || operationFailure !== undefined) && (format === "md" ? containsUnrepresentableMarkdown(selected) : containsUnpairedSurrogate(selected))) return refuseUnrepresentableText();
				const filtered = (format === "json" || format === "jsonl") && ownsFilteredOutput && Array.isArray(selected) ? normalizeJsonArrayValues(selected) : selected;
				const ownsSuccessfulTokenWindow = operationFailure === undefined && options.tokenWindow && !options.tokenCount && format !== "json" && format !== "jsonl";
				if (format !== "md" && format !== "json" && format !== "jsonl" && operationFailure === undefined && !ownsFilteredOutput && !ownsSuccessfulTokenWindow) return false;
				if (format === "jsonl") {
					handled = true;
					try {
						error = await writeCliJsonLines({
							...options,
							source: value,
							selected: filtered,
							filterPaths,
							operationFailure,
							command: metadata.command,
							duration: metadata.duration
						}, destination);
					} catch (cause) {
						failed = true;
						throw cause;
					}
					return true;
				}
				const meta = {
					command: metadata.command,
					duration: metadata.duration
				};
				const errorDocument = options.fullOutput && failure !== undefined ? fullFailureEnvelope(failure, meta, format, options.tokenLimit, options.tokenOffset) : undefined;
				const document = options.fullOutput ? failure !== undefined ? errorDocument : filtered === undefined ? {
					ok: true,
					meta
				} : {
					ok: true,
					data: filtered,
					meta
				} : filtered === undefined || typeof filtered === "function" || typeof filtered === "symbol" ? {} : filtered;
				if (options.tokenCount) {
					const tokenValue = document;
					let characters = 0;
					if (tokenValue !== undefined && tokenValue !== null && typeof tokenValue !== "function" && typeof tokenValue !== "symbol") {
						if (format === "json") {
							for (const part of jsonOutputParts(tokenValue, format, isTerminalOutput(destination))) characters += part.length;
						}
					}
					if (characters <= constants.MAX_STRING_LENGTH) {
						let formatted;
						if (format === "json") {
							formatted = "";
							for (const part of jsonOutputParts(tokenValue, format, isTerminalOutput(destination))) formatted += part;
						} else formatted = formatCliOutput(tokenValue, format);
						const count = estimateTokenCount(formatted);
						handled = true;
						try {
							await writeOutputText(destination, `${count}\n`);
							return true;
						} catch (cause) {
							failed = true;
							throw cause;
						}
					}
					error = projectAnalysisError(retainCliPublicationOnError(new AnalysisResourceConstraintError(metadata.command, "memory", "Token counting requires a formatted string larger than the runtime permits.", {
						formatted_characters: characters,
						max_string_characters: constants.MAX_STRING_LENGTH
					}, { remediationAction: "Remove --token-count to stream the complete JSON result, or narrow it with --filter-output." })));
				}
				if (ownsSuccessfulTokenWindow) {
					const formatted = formatCliOutput(format === "md" && !options.fullOutput ? document : filtered, format);
					const window = sliceTextByTokenWindow(formatted, options.tokenOffset ?? 0, options.tokenLimit);
					if (!window.truncated && !options.fullOutput && formatted === "") return false;
					const sliced = window.truncated ? `${window.text}\n[truncated: showing tokens ${window.start}–${window.end} of ${window.total}]` : formatted;
					const outputDocument = options.fullOutput ? formatCliOutput(window.truncated ? {
						ok: true,
						data: sliced,
						meta: {
							command: metadata.command,
							duration: metadata.duration,
							...window.end < window.total ? { nextOffset: window.end } : {}
						}
					} : {
						ok: true,
						data: filtered,
						meta
					}, format) : sliced;
					if (format === "toon" && hasUnpairedSurrogate(outputDocument)) return refuseUnrepresentableText();
					handled = true;
					try {
						await writeOutputText(destination, outputDocument.endsWith("\n") ? outputDocument : `${outputDocument}\n`);
					} catch (cause) {
						failed = true;
						throw cause;
					}
					return true;
				}
				const formattedText = format === "md" || (operationFailure !== undefined || ownsFilteredOutput) && format !== "json" ? formatCliOutput(document, format) : undefined;
				if (format === "md" && formattedText === "" && !options.fullOutput && !ownsFilteredOutput && operationFailure === undefined) return false;
				handled = true;
				try {
					if (formattedText !== undefined) {
						await writeOutputText(destination, `${formattedText}\n`);
					} else {
						await writeJsonOutput(error === undefined ? document : options.fullOutput ? {
							ok: false,
							error,
							meta
						} : error, destination, format);
					}
				} catch (cause) {
					failed = true;
					throw cause;
				}
				return true;
			}
		};
		fullFailureEnvelope = (failure, meta, format, tokenLimit, tokenOffset) => {
			if (tokenLimit === undefined && tokenOffset === undefined) return {
				ok: false,
				error: failure,
				meta
			};
			const formatted = formatCliOutput(failure, format);
			const offset = tokenOffset ?? 0;
			const window = sliceTextByTokenWindow(formatted, offset, tokenLimit);
			if (!window.truncated) return {
				ok: false,
				error: failure,
				meta
			};
			const nextOffset = window.end < window.total ? window.end : undefined;
			return {
				ok: false,
				error: `${window.text}\n[truncated: showing tokens ${window.start}–${window.end} of ${window.total}]`,
				meta: {
					...meta,
					...nextOffset === undefined ? {} : { nextOffset }
				}
			};
		};
		resolveDelimitedRows = (source, paths, operation) => {
			const invalidSelection = () => err(delimitedOutputInputError(["--filter-output"], "--filter-output must select exactly one row-array path using object-field segments only.", operation));
			if (paths === undefined || paths.length !== 1) return invalidSelection();
			const path = [];
			for (const segment of paths[0] ?? []) {
				if (!("key" in segment)) return invalidSelection();
				path.push(segment.key);
			}
			if (path.length === 0) return invalidSelection();
			let current = source;
			const ancestors = [];
			for (const key of path) {
				if (typeof current !== "object" || current === null || Array.isArray(current) || !Object.hasOwn(current, key)) return invalidSelection();
				const owner = current;
				ancestors.push(owner);
				current = owner[key];
			}
			return Array.isArray(current) ? ok({
				rows: current,
				path,
				ancestors
			}) : invalidSelection();
		};
		delimitedMetadata = (selection, format, metadata) => {
			const valueFromOwner = (key) => {
				for (let index = selection.ancestors.length - 1; index >= 0; index -= 1) {
					const owner = selection.ancestors[index];
					if (Object.hasOwn(owner, key)) return {
						found: true,
						value: owner[key]
					};
				}
				return {
					found: false,
					value: undefined
				};
			};
			const projectOwnFields = (keys) => Object.fromEntries(keys.flatMap((key) => {
				const found = valueFromOwner(key);
				return found.found ? [[key, found.value]] : [];
			}));
			const metadataValue = (key) => valueFromOwner(key).value;
			return {
				version: 1,
				format,
				command: metadata.command,
				duration: metadata.duration,
				selected_path: selection.path,
				coverage: metadataValue("coverage") ?? null,
				source_coverage: metadataValue("source_coverage") ?? null,
				source_complete: metadataValue("source_complete") ?? null,
				view: metadataValue("view") ?? null,
				limitations: metadataValue("limitations") ?? null,
				unknowns: metadataValue("unknowns") ?? null,
				provenance: projectOwnFields([
					"parent_evidence_id",
					"parent_operation",
					"parent_digest",
					"inventory_evidence_ids"
				]),
				pagination: projectOwnFields([
					"offset",
					"limit",
					"total",
					"next_offset",
					"truncated",
					"pagination"
				])
			};
		};
		applyCliOutputFilter = (value, paths) => {
			if (paths.length === 0) return ok(value);
			if (Array.isArray(value)) {
				if (paths.some((path) => path[0] !== undefined && "start" in path[0])) return projectArraySlices(value, paths.flatMap((path) => {
					const first = path[0];
					if (first === undefined || "start" in first) return [path];
					return expandImplicitArrayPath(value, path);
				}));
				const selected = [];
				for (const item of value) {
					const projection = applyCliOutputFilter(item, paths);
					if (!projection.ok) return projection;
					selected.push(projection.value);
				}
				return ok(selected);
			}
			if (paths.length === 1 && paths[0]?.length === 1 && paths[0][0] !== undefined && "key" in paths[0][0]) {
				const key = paths[0][0].key;
				if (typeof value !== "object" || value === null || !Object.hasOwn(value, key)) return ok(undefined);
				const selected = value[key];
				return ok(typeof selected !== "object" || selected === null ? selected : { [key]: selected });
			}
			return projectObjectPaths(value, paths);
		};
		expandImplicitArrayPath = (value, path) => {
			if (Array.isArray(value)) return value.flatMap((item, index) => expandImplicitArrayPath(item, path).map((tail) => [{
				start: index,
				end: index + 1
			}, ...tail]));
			const first = path[0];
			return typeof value === "object" && value !== null && first !== undefined && "key" in first && Object.hasOwn(value, first.key) ? [path] : [];
		};
		projectObjectPaths = (value, paths) => {
			if (typeof value !== "object" || value === null) return ok({});
			const byKey = new Map();
			for (const path of paths) {
				const [segment, ...tail] = path;
				if (segment === undefined || !("key" in segment)) continue;
				const siblings = byKey.get(segment.key) ?? [];
				siblings.push(tail);
				byKey.set(segment.key, siblings);
			}
			const result = new Map();
			for (const key of [...byKey.keys()].sort()) {
				const siblings = byKey.get(key);
				if (!Object.hasOwn(value, key)) continue;
				const child = value[key];
				if (child === undefined) continue;
				if (siblings.some((path) => path.length === 0)) {
					result.set(key, child);
					continue;
				}
				const projection = projectChildPaths(child, siblings);
				if (!projection.ok) return projection;
				if (projection.value !== undefined) result.set(key, projection.value);
			}
			return ok(Object.fromEntries(result));
		};
		projectChildPaths = (value, paths) => {
			if (typeof value !== "object" || value === null) return ok(undefined);
			return Array.isArray(value) && paths.some((path) => path[0] !== undefined && "start" in path[0]) ? projectArraySlices(value, paths) : projectObjectPaths(value, paths);
		};
		projectArraySlices = (source, paths) => {
			const selected = new Map();
			const select = (index, tail) => {
				const siblings = selected.get(index) ?? [];
				siblings.push(tail);
				selected.set(index, siblings);
			};
			for (const path of paths) {
				const [segment, ...tail] = path;
				if (segment === undefined) continue;
				if ("key" in segment) {
					if (!Object.hasOwn(source, segment.key)) continue;
					const index = Number(segment.key);
					if (!Number.isInteger(index) || index < 0 || index >= 4294967295 || String(index) !== segment.key) return err(`The --filter-output selection mixes array slices with the non-index property ${JSON.stringify(segment.key)}. These selections cannot share an array result.`);
					select(index, tail);
					continue;
				}
				const start = normalizeSliceIndex(segment.start, source.length);
				const end = normalizeSliceIndex(segment.end, source.length);
				for (let index = start; index < end; index += 1) select(index, tail);
			}
			const result = [];
			for (const index of [...selected.keys()].sort((left, right) => left - right)) {
				const siblings = selected.get(index);
				const item = source[index];
				if (siblings.some((path) => path.length === 0)) {
					result.push(item === undefined ? null : item);
					continue;
				}
				const projection = projectChildPaths(item, siblings);
				if (!projection.ok) return projection;
				result.push(projection.value ?? {});
			}
			return ok(result);
		};
		normalizeSliceIndex = (index, length) => {
			const integer = Number.isNaN(index) ? 0 : Math.trunc(index);
			return integer < 0 ? Math.max(length + integer, 0) : Math.min(integer, length);
		};
		normalizeJsonArrayValues = (source) => {
			let result;
			for (let index = 0; index < source.length; index += 1) {
				const value = source[index];
				const normalized = value === undefined || typeof value === "function" || typeof value === "symbol" ? null : Array.isArray(value) ? normalizeJsonArrayValues(value) : value;
				if (normalized !== value) {
					result ??= source.slice();
					result[index] = normalized;
				}
			}
			return result ?? source;
		};
	})))();
}

//#endregion
export { createCliResultOutput, init_cliEvidencePublication, init_cliLogging, init_cliResultOutput, init_visitRegisteredCommands, isCliOperationFailure, logCliCommand, recordCliEvidencePublication, streamCliCommandResults, visitRegisteredCommands };