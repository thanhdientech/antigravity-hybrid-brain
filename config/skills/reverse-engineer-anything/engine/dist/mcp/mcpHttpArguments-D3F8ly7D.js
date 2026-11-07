import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { a as mcpHttpListenerPortSchema, i as mcpAllowedHostsTextSchema, n as MCP_HTTP_PORT_CONSTRAINT, o as mcpHttpPortSchema, r as init_mcpHttpEndpoint, t as MCP_ALLOWED_HOSTS_FLAG_CONSTRAINT } from "./mcpHttpEndpoint-BxAnZJhL.js";
import { Help, z } from "incur";

//#region dist/main/mcpHttpArguments.js
var MCP_HTTP_OPTIONS, MCP_HTTP_ALIAS, MCP_HTTP_COMMAND, MCP_HTTP_DESCRIPTION, HELP_FLAGS, VALUED_FLAGS, renderMcpHttpHelp, invalid, splitFlag, parseMcpHttpArguments;
function init_mcpHttpArguments() {
	return (init_mcpHttpArguments = __esmMin((() => {
		init_mcpHttpEndpoint();
		MCP_HTTP_OPTIONS = z.object({
			http: z.boolean().describe("Serve the MCP catalog over streamable HTTP at /mcp, not stdio"),
			host: z.string().min(1).optional().describe("Listener address; default MCP_HOST, else 127.0.0.1"),
			port: mcpHttpListenerPortSchema.optional().describe("Listener port; default MCP_PORT, else 0 for an ephemeral port"),
			allowedHosts: z.array(z.string()).optional().describe("Host/Origin names a non-loopback bind may serve; repeat or separate names with commas; default MCP_ALLOWED_HOSTS, else the bind is refused"),
			help: z.boolean().optional().describe("Show help")
		});
		MCP_HTTP_ALIAS = { help: "h" };
		MCP_HTTP_COMMAND = "rea mcp --http";
		MCP_HTTP_DESCRIPTION = "Serve the MCP server over streamable HTTP for one local client";
		HELP_FLAGS = new Set(["--help", "-h"]);
		VALUED_FLAGS = new Set([
			"--host",
			"--port",
			"--allowed-hosts"
		]);
		renderMcpHttpHelp = () => Help.formatCommand(MCP_HTTP_COMMAND, {
			description: MCP_HTTP_DESCRIPTION,
			hideGlobalOptions: true,
			options: MCP_HTTP_OPTIONS,
			alias: MCP_HTTP_ALIAS,
			hint: "This entry accepts only the options above. The bound URL is logged as one JSON line on stderr."
		});
		invalid = (message) => ({
			ok: false,
			help: false,
			message
		});
		splitFlag = (argument) => {
			const separator = argument.indexOf("=");
			return separator === -1 ? [argument, undefined] : [argument.slice(0, separator), argument.slice(separator + 1)];
		};
		parseMcpHttpArguments = (arguments_) => {
			const values = new Map();
			const allowedHostValues = [];
			let http = false;
			for (let index = 0; index < arguments_.length; index += 1) {
				const argument = arguments_[index] ?? "";
				if (HELP_FLAGS.has(argument)) return {
					ok: false,
					help: true
				};
				if (argument === "--http") {
					http = true;
					continue;
				}
				const [flag, inline] = splitFlag(argument);
				if (!VALUED_FLAGS.has(flag)) return invalid(`Unknown mcp --http argument: ${argument}`);
				const value = inline ?? arguments_[index + 1];
				if (inline === undefined) index += 1;
				if (value === undefined || inline === undefined && value.startsWith("-")) return invalid(`Missing value for ${flag}`);
				if (flag === "--allowed-hosts") allowedHostValues.push(value);
				else values.set(flag, value);
			}
			if (!http) return invalid("--host and --port require --http");
			const host = values.get("--host")?.trim();
			if (host !== undefined && host.length === 0) return invalid("--host must be a non-empty host name or IP address");
			const portText = values.get("--port");
			const port = portText === undefined ? undefined : mcpHttpPortSchema.safeParse(portText);
			if (port !== undefined && !port.success) return invalid(`Invalid --port: ${MCP_HTTP_PORT_CONSTRAINT}`);
			const allowedHostsText = allowedHostValues.length === 0 ? undefined : allowedHostValues.join(",");
			const allowedHosts = allowedHostsText === undefined ? undefined : mcpAllowedHostsTextSchema.safeParse(allowedHostsText);
			if (allowedHosts !== undefined && !allowedHosts.success) return invalid(`Invalid --allowed-hosts: ${MCP_ALLOWED_HOSTS_FLAG_CONSTRAINT}`);
			return {
				ok: true,
				...host === undefined ? {} : { host },
				...port === undefined ? {} : { port: port.data },
				...allowedHosts === undefined ? {} : { allowedHosts: allowedHosts.data }
			};
		};
	})))();
}

//#endregion
init_mcpHttpArguments();
export { parseMcpHttpArguments, renderMcpHttpHelp };