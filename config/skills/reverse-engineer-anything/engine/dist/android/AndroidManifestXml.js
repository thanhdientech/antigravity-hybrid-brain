import { XML_LINE_ENDING } from "../domain/xmlDocument.js";
const ANDROID_NAMESPACE = "http://schemas.android.com/apk/res/android";
export const childNodes = (element) => Array.from(element.childNodes);
export const isManifestElement = (node) => node !== null &&
    node.nodeType === 1 &&
    node.namespaceURI === null;
export const plainAttribute = (element, name) => {
    const value = element.getAttribute(name);
    return value === "" ? null : value;
};
/** Namespace identity, never the spelling of a bound prefix, selects a fact. */
export const isAndroidAttribute = (attribute) => attribute.namespaceURI === ANDROID_NAMESPACE ||
    (attribute.namespaceURI === null && attribute.prefix === "android");
export const androidAttribute = (element, localName) => {
    for (let index = 0; index < element.attributes.length; index += 1) {
        const attribute = element.attributes.item(index);
        if (attribute === null || attribute.localName !== localName)
            continue;
        if (isAndroidAttribute(attribute))
            return attribute.nodeValue;
    }
    return null;
};
/** Build the source line index once; all locations address the same retained text. */
export const createManifestLocationReader = (source) => {
    const starts = [0];
    for (const match of source.matchAll(XML_LINE_ENDING))
        starts.push(match.index + match[0].length);
    return (element) => {
        const line = element.lineNumber;
        const column = element.columnNumber;
        if (line === undefined || column === undefined || line < 1 || column < 1)
            return null;
        const start = starts[line - 1];
        if (start === undefined)
            return null;
        const offset = start + column - 1;
        return source[offset] === "<" ? { line, column, offset } : null;
    };
};
