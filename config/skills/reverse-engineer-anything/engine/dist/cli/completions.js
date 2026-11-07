import { Cli, Completions, z } from "incur";
import { CLI_COMPLETION_SHELLS, cliCompletionShell, INCUR_BUILTIN_FLAGS, OUTPUT_SWITCHES, VALUED_OUTPUT_FLAGS, normalizeCliArguments, splitIncurBuiltinArguments, } from "../cliBuiltinArguments.js";
import { CLI_OUTPUT_FORMATS, parseCliOutputArguments } from "../cliOutput.js";
import { bashCompletionScript } from "./bashCompletionRegistration.js";
import { MCP_DOCTOR_ALIAS, MCP_DOCTOR_OPTIONS } from "../mcpDoctorOptions.js";
const ROOT_FLAGS = new Set(["--mcp", "--update", "--version"]);
/** Supplement Incur's built-in setup instructions without replacing its help. */
export const completionHelpNote = (arguments_) => {
    const split = splitIncurBuiltinArguments(arguments_);
    const words = split.command[0] === "rea" ? split.command.slice(1) : split.command;
    if (words[0] !== "completions")
        return undefined;
    const rest = words.slice(1);
    if (rest.length > 1 ||
        (rest.length === 1 &&
            !CLI_COMPLETION_SHELLS.includes(rest[0])))
        return undefined;
    const values = new Set(split.outputValues.map(({ index }) => index));
    const flags = arguments_.filter((_, index) => !values.has(index));
    if (flags.some((word) => [
        "--schema",
        "--llms",
        "--llms-full",
        "--mcp",
        "--update",
        "--version",
    ].includes(word)))
        return undefined;
    if (rest.length > 0 && !flags.includes("--help") && !flags.includes("-h"))
        return undefined;
    return "Zsh: initialize completion with `autoload -Uz compinit; compinit` before evaluating the zsh hook. If your shell already runs compinit, place the hook after it.\n";
};
const standardGlobals = (root) => z.object(Object.fromEntries([
    ...[...VALUED_OUTPUT_FLAGS].map((flag) => [
        flag.slice(2),
        flag === "--format"
            ? z.enum(CLI_OUTPUT_FORMATS).optional()
            : z.string().optional(),
    ]),
    ...[...INCUR_BUILTIN_FLAGS]
        .filter((flag) => flag.startsWith("--") &&
        flag !== "--incur-update-check" &&
        (root || !ROOT_FLAGS.has(flag)))
        .map((flag) => [flag.slice(2), z.boolean().optional()]),
    ...(root ? [["version", z.boolean().optional()]] : []),
]));
/** Pinned Incur builtins are not exported in its registered command map. */
const completionCommands = (cli) => {
    const commands = new Map(Cli.toCommands.get(cli));
    commands.set("mcp", {
        _group: true,
        description: "Register as MCP server",
        commands: new Map([
            [
                "add",
                {
                    description: "Register as MCP server",
                    alias: { command: "c" },
                    options: z.object({
                        agent: z.string().optional(),
                        command: z.string().optional(),
                        noGlobal: z.boolean().optional(),
                    }),
                },
            ],
            [
                "doctor",
                { description: "Validate MCP server startup and tool listing" },
            ],
        ]),
    });
    commands.set("completions", {
        _group: true,
        description: "Generate shell completion script",
        commands: new Map(CLI_COMPLETION_SHELLS.map((shell) => [shell, {}])),
    });
    // REA uses sync:false, so the framework's skills integration is disabled.
    return commands;
};
/** One tree owns command scope; the framework retains option/enum binding and shell formatting. */
export const createCliCompletions = (cli, environment) => {
    const script = (shell) => shell === "bash"
        ? bashCompletionScript(cli.name)
        : Completions.register(shell, cli.name);
    return (arguments_, options) => {
        const write = options.stdout ?? ((text) => process.stdout.write(text));
        const shell = cliCompletionShell(environment);
        if (shell !== undefined) {
            const separator = arguments_.indexOf("--");
            const words = separator < 0 ? arguments_ : arguments_.slice(separator + 1);
            if (words.length === 0) {
                write(script(shell));
                return true;
            }
            const index = Number(environment._COMPLETE_INDEX ?? words.length - 1);
            if (!Number.isSafeInteger(index) || index < 0 || index > words.length)
                return true;
            // Consume global option values before scope resolution. A value named
            // 'mcp' is still data; leave an unfinished flag for Incur's enum hints.
            const before = splitIncurBuiltinArguments(normalizeCliArguments(words.slice(1, index))).command;
            const input = [cli.name, ...before, words[index] ?? ""];
            const doctor = before[0] === "mcp" && before[1] === "doctor";
            const candidates = Completions.complete(completionCommands(cli), undefined, input, input.length - 1, {
                schema: doctor
                    ? // The launcher consumes this global before doctor parses options.
                        MCP_DOCTOR_OPTIONS.extend({ timings: z.boolean().optional() })
                    : standardGlobals(before.length === 0),
                alias: doctor ? MCP_DOCTOR_ALIAS : { help: "h" },
            });
            const result = Completions.format(shell, candidates);
            if (result !== "")
                write(result);
            return true;
        }
        const normalized = normalizeCliArguments(arguments_);
        const split = splitIncurBuiltinArguments(normalized);
        const offset = split.command[0] === cli.name ? 1 : 0;
        const selected = CLI_COMPLETION_SHELLS.find((value) => value === split.command[offset + 1]);
        if (split.command[offset] !== "completions" ||
            selected === undefined ||
            split.command.length !== offset + 2)
            return false;
        // Help/manifests/schema/version and server controls keep framework precedence.
        const values = new Set(split.outputValues.map(({ index }) => index));
        if (normalized.some((token, index) => !values.has(index) &&
            ((INCUR_BUILTIN_FLAGS.has(token) && !OUTPUT_SWITCHES.has(token)) ||
                token === "--version")))
            return false;
        if (!parseCliOutputArguments(normalized).validation.ok)
            return false;
        write(`${script(selected)}\n`);
        return true;
    };
};
