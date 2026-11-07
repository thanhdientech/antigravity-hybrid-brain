import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { init_exactJsonNumber, init_safeJson, isExactJsonNumber, safeParseJson } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { MAX_JSON_DEPTH, init_jsonValue } from "./jsonValue-DGGrC1lE.js";
import { init_xmlDocument, parseXmlDocument } from "./xmlDocument-BXZu5o82.js";

//#region dist/domain/desktop/stateFormats.js
var SQLITE_HEADER, SQLITE_SIDECARS, GVDB_HEADER, XML_EXTENSIONS, MAX_TEXT_LINES, MAX_XML_NODES, MAX_XML_DEPTH, MAX_JSON_VIEW_DEPTH, keyfileLine, isKeyfile, decodeStateText, detectStateFormat, deeperThan, jsonView, textView, plainRecord, keyfileView, xmlNode, xmlView;
function init_stateFormats() {
	return (init_stateFormats = __esmMin((() => {
		init_exactJsonNumber();
		init_jsonValue();
		init_result();
		init_safeJson();
		init_xmlDocument();
		SQLITE_HEADER = "SQLite format 3\0";
		SQLITE_SIDECARS = [{
			suffix: "-wal",
			label: "write-ahead log"
		}, {
			suffix: "-journal",
			label: "rollback journal"
		}];
		GVDB_HEADER = "GVariant";
		XML_EXTENSIONS = /\.(?:xml|xbel|plist|svg|ui)$/iu;
		MAX_TEXT_LINES = 5e3;
		MAX_XML_NODES = 5e3;
		MAX_XML_DEPTH = 64;
		MAX_JSON_VIEW_DEPTH = MAX_JSON_DEPTH / 2;
		keyfileLine = (raw) => {
			const line = raw.trim();
			if (line.length === 0 || line.startsWith("#") || line.startsWith(";")) return { kind: "skip" };
			const name = /^\[(?<name>[^\]]+)\]$/u.exec(line)?.groups?.name;
			if (name !== undefined) return {
				kind: "group",
				name
			};
			const equals = line.indexOf("=");
			return equals <= 0 ? { kind: "other" } : {
				kind: "entry",
				key: line.slice(0, equals).trim(),
				value: line.slice(equals + 1).trim()
			};
		};
		isKeyfile = (text) => {
			let group = false;
			for (let start = 0; start <= text.length;) {
				const end = text.indexOf("\n", start);
				const kind = keyfileLine(text.slice(start, end < 0 ? undefined : end)).kind;
				if (kind === "other") return false;
				if (kind === "group") group = true;
				if (end < 0) break;
				start = end + 1;
			}
			return group;
		};
		decodeStateText = (bytes) => {
			if (bytes.subarray(0, 8192).includes(0)) return undefined;
			try {
				return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
			} catch {
				return undefined;
			}
		};
		detectStateFormat = (path, bytes) => {
			const header = new TextDecoder("latin1").decode(bytes.subarray(0, 16));
			if (header === SQLITE_HEADER) return "sqlite";
			if (header.startsWith(GVDB_HEADER)) return "dconf";
			const text = decodeStateText(bytes);
			if (text === undefined) return "binary";
			const trimmed = text.trimStart();
			if ((path.endsWith(".json") || /^[[{]/u.test(trimmed)) && safeParseJson(text).ok) return "json";
			if (XML_EXTENSIONS.test(path) || trimmed.startsWith("<?xml")) return parseXmlDocument(text, {
				doctype: "reject",
				lineEndings: "normalize"
			}).ok ? "xml" : "text";
			return isKeyfile(text) ? "keyfile" : "text";
		};
		deeperThan = (root, limit) => {
			const pending = [[root, 0]];
			for (let next = pending.pop(); next !== undefined; next = pending.pop()) {
				const [value, depth] = next;
				if (depth > limit) return true;
				if (typeof value === "object" && value !== null) for (const item of Object.values(value)) pending.push([item, depth + 1]);
			}
			return false;
		};
		jsonView = (text) => {
			let rounded = false;
			const parsed = safeParseJson(text, (_key, value, context) => {
				if (typeof value === "number" && !isExactJsonNumber(value, context?.source)) rounded = true;
				return value;
			});
			if (!parsed.ok) return err(parsed.error);
			if (rounded) return err("a number in it cannot be read exactly, such as an integer above 2^53");
			const value = parsed.value;
			return deeperThan(value, MAX_JSON_VIEW_DEPTH) ? err(`nested deeper than the ${String(MAX_JSON_VIEW_DEPTH)} levels a JSON view keeps`) : ok(value);
		};
		textView = (text) => {
			const lines = text.split(/\r?\n/u);
			if (lines.at(-1) === "") lines.pop();
			return {
				lines: lines.slice(0, MAX_TEXT_LINES),
				line_count: lines.length,
				truncated: lines.length > MAX_TEXT_LINES
			};
		};
		plainRecord = () => Object.create(null);
		keyfileView = (text) => {
			const groups = plainRecord();
			let group = "";
			for (const raw of text.split(/\r?\n/u)) {
				const line = keyfileLine(raw);
				if (line.kind === "group") {
					group = line.name;
					groups[group] ??= plainRecord();
				} else if (line.kind === "entry") (groups[group] ??= plainRecord())[line.key] = line.value;
			}
			return groups;
		};
		xmlNode = (node, depth, budget, scope) => {
			if (budget.remaining <= 0 || depth > MAX_XML_DEPTH) {
				budget.truncated = true;
				return undefined;
			}
			budget.remaining -= 1;
			if (node.nodeType === node.TEXT_NODE || node.nodeType === node.CDATA_SECTION_NODE) {
				const text = node.nodeValue ?? "";
				return text.trim().length === 0 && scope.elementContent && !scope.preserve ? undefined : text;
			}
			if (node.nodeType !== node.ELEMENT_NODE) return undefined;
			const element = node;
			const attributes = plainRecord();
			for (let index = 0; index < element.attributes.length; index += 1) {
				const attribute = element.attributes.item(index);
				if (attribute !== null) attributes[attribute.name] = attribute.value;
			}
			const space = element.getAttribute("xml:space");
			let elementContent = false;
			for (let child = element.firstChild; child !== null && !elementContent; child = child.nextSibling) elementContent = child.nodeType === child.ELEMENT_NODE;
			const inner = {
				preserve: space === null || space === "" ? scope.preserve : space === "preserve",
				elementContent
			};
			const children = [];
			for (let child = element.firstChild; child !== null; child = child.nextSibling) {
				const value = xmlNode(child, depth + 1, budget, inner);
				if (value !== undefined) children.push(value);
			}
			return {
				name: element.tagName,
				attributes,
				children
			};
		};
		xmlView = (text) => {
			const parsed = parseXmlDocument(text, {
				doctype: "reject",
				lineEndings: "normalize"
			});
			const root = parsed.ok ? parsed.value.documentElement : null;
			if (root === null) return undefined;
			const budget = {
				remaining: MAX_XML_NODES,
				truncated: false
			};
			const tree = xmlNode(root, 0, budget, {
				preserve: false,
				elementContent: false
			});
			return tree === undefined ? undefined : {
				root: tree,
				truncated: budget.truncated
			};
		};
	})))();
}

//#endregion
export { SQLITE_SIDECARS, decodeStateText, detectStateFormat, init_stateFormats, jsonView, keyfileView, plainRecord, textView, xmlView };