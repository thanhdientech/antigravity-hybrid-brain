import { decodeXmlPropertyList } from "./propertyListXml.js";
import { decodeOpenStepPropertyList, startsOpenStepPropertyList, } from "./propertyListOpenStep.js";
import { createPlistNumberCollector, } from "./apple/plistNumbers.js";
import { MAX_PLIST_DEPTH } from "./apple/plistValue.js";
/** Decode XML or the existing OpenStep container form, retaining every dictionary key. */
export const parseXmlPropertyList = (text, maximumDepth = MAX_PLIST_DEPTH) => startsOpenStepPropertyList(text)
    ? {
        value: decodeOpenStepPropertyList(text, maximumDepth),
        numberLiterals: createPlistNumberCollector().result(true),
    }
    : decodeXmlPropertyList(text, maximumDepth);
