import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./jsonLines-CKG28FwL.js";
import { DOMParser, onErrorStopParsing } from "@xmldom/xmldom";
import { SaxesParser } from "saxes";

//#region dist/domain/xmlDocument.js
var XML_LINE_ENDING, XmlDocumentParseError, parseXmlDocument;
function init_xmlDocument() {
	return (init_xmlDocument = __esmMin((() => {
		init_result();
		XML_LINE_ENDING = /\r\n?|\n/gu;
		XmlDocumentParseError = class extends Error {
			reason;
			_tag = "XmlDocumentParseError";
			constructor(reason, cause) {
				super(reason === "doctype" ? "XML document types are unsupported" : `XML is not well-formed${cause instanceof Error ? `: ${cause.message}` : ""}`, { cause });
				this.reason = reason;
			}
		};
		parseXmlDocument = (source, policy) => {
			try {
				const syntax = new SaxesParser({
					xmlns: true,
					defaultXMLVersion: "1.0",
					forceXMLVersion: true
				});
				syntax.on("doctype", () => {
					if (policy.doctype === "reject") throw new XmlDocumentParseError("doctype");
				});
				syntax.write(source).close();
				return ok(new DOMParser({
					normalizeLineEndings: policy.lineEndings === "preserve" ? (text) => text : (text) => text.replace(XML_LINE_ENDING, "\n"),
					onError: onErrorStopParsing
				}).parseFromString(source, "application/xml"));
			} catch (cause) {
				return err(cause instanceof XmlDocumentParseError ? cause : new XmlDocumentParseError("malformed", cause));
			}
		};
	})))();
}

//#endregion
export { XML_LINE_ENDING, init_xmlDocument, parseXmlDocument };