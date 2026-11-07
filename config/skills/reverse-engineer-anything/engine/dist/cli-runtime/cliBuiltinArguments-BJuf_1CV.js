import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/cliBuiltinArguments.js
var VALUED_OUTPUT_FLAGS, OUTPUT_SWITCHES, INCUR_BUILTIN_FLAGS, cliTimingFlagValue, splitCliTimingArguments, splitIncurBuiltinArguments, normalizeCliArguments, adaptCliOutputArgumentsForIncur, productionMcpDoctorArguments, FLAGS, declaredSensitiveValues, CLI_COMPLETION_SHELLS, cliCompletionShell;
function init_cliBuiltinArguments() {
	return (init_cliBuiltinArguments = __esmMin((() => {
		VALUED_OUTPUT_FLAGS = new Set([
			"--format",
			"--filter-output",
			"--columns",
			"--token-limit",
			"--token-offset"
		]);
		OUTPUT_SWITCHES = new Set([
			"--json",
			"--full-output",
			"--token-count",
			"--timings"
		]);
		INCUR_BUILTIN_FLAGS = new Set([
			"--full-output",
			"--llms",
			"--llms-full",
			"--mcp",
			"--help",
			"-h",
			"--update",
			"--incur-update-check",
			"--schema",
			"--json",
			"--token-count",
			"--timings"
		]);
		cliTimingFlagValue = (token) => token === "--timings" ? true : token === "--no-timings" ? false : token.startsWith("--timings=") ? token.slice("--timings=".length) === "true" : undefined;
		splitCliTimingArguments = (arguments_) => {
			const values = new Set(splitIncurBuiltinArguments(arguments_).outputValues.map(({ index }) => index));
			let enabled = false;
			let ended = false;
			const remaining = arguments_.filter((token, index) => {
				if (values.has(index)) return true;
				if (token === "--") ended = true;
				const value = ended ? undefined : cliTimingFlagValue(token);
				if (value === undefined) return true;
				enabled = value;
				return false;
			});
			return {
				arguments: remaining,
				enabled
			};
		};
		splitIncurBuiltinArguments = (arguments_) => {
			const command = [];
			const flags = new Set();
			const outputValues = [];
			for (let index = 0; index < arguments_.length; index += 1) {
				const argument = arguments_[index];
				const next = arguments_[index + 1];
				if (INCUR_BUILTIN_FLAGS.has(argument) && argument !== "--timings" || argument === "--version" && (next === undefined || next.startsWith("-"))) {
					flags.add(argument);
					continue;
				}
				if (VALUED_OUTPUT_FLAGS.has(argument) && next) {
					outputValues.push({
						flag: argument,
						index: index + 1
					});
					index += 1;
					continue;
				}
				command.push(argument);
			}
			let globalsEnded = false;
			const remaining = command.filter((token) => {
				if (token === "--") globalsEnded = true;
				if (!globalsEnded && cliTimingFlagValue(token) !== undefined) {
					flags.add(token);
					return false;
				}
				return true;
			});
			return {
				command: remaining,
				flags,
				outputValues
			};
		};
		normalizeCliArguments = (arguments_) => {
			const normalized = [];
			const updates = new Set();
			let rootUpdate = true;
			for (let index = 0; index < arguments_.length; index += 1) {
				const argument = arguments_[index];
				if (VALUED_OUTPUT_FLAGS.has(argument) && arguments_[index + 1]) {
					normalized.push(argument, arguments_[index + 1]);
					index += 1;
					continue;
				}
				const separator = argument.indexOf("=");
				const flag = argument.slice(0, separator);
				if (separator >= 0 && VALUED_OUTPUT_FLAGS.has(flag)) normalized.push(flag, argument.slice(separator + 1));
				else {
					if (argument === "--update") updates.add(normalized.length);
					else if (!OUTPUT_SWITCHES.has(argument) && cliTimingFlagValue(argument) === undefined) rootUpdate = false;
					normalized.push(argument);
				}
			}
			return rootUpdate && updates.size > 0 ? ["update", ...normalized.filter((_, index) => !updates.has(index))] : normalized;
		};
		adaptCliOutputArgumentsForIncur = (arguments_) => {
			const adapted = [];
			for (let index = 0; index < arguments_.length; index += 1) {
				const argument = arguments_[index];
				const value = arguments_[index + 1];
				if (VALUED_OUTPUT_FLAGS.has(argument)) {
					if (argument === "--columns") {
						if (value !== undefined) index += 1;
						continue;
					}
					if (argument === "--format" && (value === "csv" || value === "tsv")) {
						adapted.push("--format", "json");
						index += 1;
						continue;
					}
					adapted.push(argument);
					if (value) {
						adapted.push(value);
						index += 1;
					}
					continue;
				}
				adapted.push(argument);
			}
			return adapted;
		};
		productionMcpDoctorArguments = (arguments_) => {
			const normalized = normalizeCliArguments(arguments_);
			const split = splitIncurBuiltinArguments(normalized);
			if (split.command[0] !== "mcp" || split.command[1] !== "doctor") return undefined;
			const values = new Set(split.outputValues.map(({ index }) => index));
			const mcp = normalized.findIndex((token, index) => token === "mcp" && !values.has(index));
			const doctor = normalized.findIndex((token, index) => index > mcp && token === "doctor" && !values.has(index));
			return normalized.filter((_, index) => index !== mcp && index !== doctor);
		};
		FLAGS = ["--sensitive-value", "--sensitiveValue"];
		declaredSensitiveValues = (command) => {
			const values = new Set();
			for (let index = 0; index < command.length; index += 1) {
				const token = command[index];
				const flag = FLAGS.find((candidate) => token === candidate || token.startsWith(`${candidate}=`));
				if (flag === undefined) continue;
				if (token !== flag) values.add(token.slice(flag.length + 1));
				else if (index + 1 < command.length) {
					values.add(command[index + 1]);
					index += 1;
				}
			}
			values.delete("");
			return [...values];
		};
		CLI_COMPLETION_SHELLS = [
			"bash",
			"zsh",
			"fish",
			"nushell"
		];
		cliCompletionShell = (environment) => CLI_COMPLETION_SHELLS.find((shell) => shell === environment.COMPLETE);
	})))();
}

//#endregion
export { CLI_COMPLETION_SHELLS, INCUR_BUILTIN_FLAGS, OUTPUT_SWITCHES, VALUED_OUTPUT_FLAGS, adaptCliOutputArgumentsForIncur, cliCompletionShell, declaredSensitiveValues, init_cliBuiltinArguments, normalizeCliArguments, productionMcpDoctorArguments, splitCliTimingArguments, splitIncurBuiltinArguments };