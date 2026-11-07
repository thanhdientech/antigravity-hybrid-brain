import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { i as init_configurationErrors, n as ConfigurationError } from "./configurationErrors-Dc_G1uM0.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { n as init_httpHostname, t as httpHostnameSchema } from "./httpHostname-PTgOuRKa.js";
import { z } from "zod";

//#region dist/config/mcpHttpEndpoint.js
var DEFAULT_MCP_HTTP_HOST, DEFAULT_MCP_HTTP_PORT, mcpHttpListenerPortSchema, mcpHttpPortSchema, mcpHttpHostSchema, MCP_HTTP_PORT_CONSTRAINT, MCP_HTTP_HOST_CONSTRAINT, MCP_ALLOWED_HOSTS_CONSTRAINT, MCP_ALLOWED_HOSTS_FLAG_CONSTRAINT, mcpAllowedHostsTextSchema, parseMcpHttpEndpoint;
function init_mcpHttpEndpoint() {
	return (init_mcpHttpEndpoint = __esmMin((() => {
		init_httpHostname();
		init_configurationErrors();
		init_result();
		DEFAULT_MCP_HTTP_HOST = "127.0.0.1";
		DEFAULT_MCP_HTTP_PORT = 0;
		mcpHttpListenerPortSchema = z.number().int().min(0).max(65535);
		mcpHttpPortSchema = z.string().regex(/^(?:0|[1-9]\d*)$/u).transform(Number).pipe(mcpHttpListenerPortSchema);
		mcpHttpHostSchema = z.string().trim().min(1);
		MCP_HTTP_PORT_CONSTRAINT = "MCP_PORT must be a decimal integer between 0 and 65535.";
		MCP_HTTP_HOST_CONSTRAINT = "MCP_HOST must be a non-empty host name or IP address.";
		MCP_ALLOWED_HOSTS_CONSTRAINT = "MCP_ALLOWED_HOSTS must list at least one host name or IP address, separated by commas, without URL components or ports.";
		MCP_ALLOWED_HOSTS_FLAG_CONSTRAINT = "must list at least one host name or IP address, separated by commas, without URL components or ports.";
		mcpAllowedHostsTextSchema = z.string().transform((text, context) => {
			const entries = text.split(",").map((entry) => entry.trim());
			if (entries.some((entry) => entry.length === 0)) {
				context.addIssue({
					code: "custom",
					message: MCP_ALLOWED_HOSTS_CONSTRAINT
				});
				return z.NEVER;
			}
			return entries;
		}).pipe(z.array(httpHostnameSchema)).transform((names) => [...new Set(names)]);
		parseMcpHttpEndpoint = (environment, overrides = {}) => {
			const issues = [];
			let host = overrides.host ?? "127.0.0.1";
			let port = overrides.port ?? 0;
			let allowedHosts = overrides.allowedHosts;
			if (overrides.host === undefined && environment.MCP_HOST !== undefined) {
				const parsed = mcpHttpHostSchema.safeParse(environment.MCP_HOST);
				if (parsed.success) host = parsed.data;
				else issues.push({
					setting: "MCP_HOST",
					constraint: MCP_HTTP_HOST_CONSTRAINT
				});
			}
			if (overrides.port === undefined && environment.MCP_PORT !== undefined) {
				const parsed = mcpHttpPortSchema.safeParse(environment.MCP_PORT);
				if (parsed.success) port = parsed.data;
				else issues.push({
					setting: "MCP_PORT",
					constraint: MCP_HTTP_PORT_CONSTRAINT
				});
			}
			if (overrides.allowedHosts === undefined && environment.MCP_ALLOWED_HOSTS !== undefined) {
				const parsed = mcpAllowedHostsTextSchema.safeParse(environment.MCP_ALLOWED_HOSTS);
				if (parsed.success) allowedHosts = parsed.data;
				else issues.push({
					setting: "MCP_ALLOWED_HOSTS",
					constraint: MCP_ALLOWED_HOSTS_CONSTRAINT
				});
			}
			if (issues.length > 0) return err(new ConfigurationError(issues.map(({ constraint }) => constraint).join(" "), { settings: issues }));
			return ok({
				host,
				port,
				...allowedHosts === undefined ? {} : { allowedHosts }
			});
		};
	})))();
}

//#endregion
export { mcpHttpListenerPortSchema as a, mcpAllowedHostsTextSchema as i, MCP_HTTP_PORT_CONSTRAINT as n, mcpHttpPortSchema as o, init_mcpHttpEndpoint as r, parseMcpHttpEndpoint as s, MCP_ALLOWED_HOSTS_FLAG_CONSTRAINT as t };