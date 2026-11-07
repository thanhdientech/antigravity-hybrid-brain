import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { z } from "zod";
import { isIPv6 } from "node:net";

//#region dist/domain/httpHostname.js
var normalizeHttpHostname, httpHostnameSchema;
function init_httpHostname() {
	return (init_httpHostname = __esmMin((() => {
		normalizeHttpHostname = (host) => {
			const unbracketed = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
			const ipv6 = isIPv6(unbracketed);
			if (/[\s\x00-\x1F\x7F%\x2F\x5C?#@]/u.test(host) || !ipv6 && host.includes(":")) return undefined;
			try {
				return new URL(`http://${ipv6 ? `[${unbracketed}]` : host}`).hostname;
			} catch {
				return undefined;
			}
		};
		httpHostnameSchema = z.string().transform((source, context) => {
			const hostname = normalizeHttpHostname(source);
			if (hostname !== undefined) return hostname;
			context.addIssue({
				code: "custom",
				message: "Expected a host name or IP address without URL components or ports"
			});
			return z.NEVER;
		}).brand();
	})))();
}

//#endregion
export { httpHostnameSchema, init_httpHostname, normalizeHttpHostname };