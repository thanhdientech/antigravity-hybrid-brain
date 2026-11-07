import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { Ht as safeParseJson, Vt as init_safeJson } from "./analysisErrorProjection-B_6dTGtM.js";
import { i as jsonValueSchema, n as init_jsonValue } from "./jsonValue-CbQQraup.js";
import { isSafeNumber } from "lossless-json";

//#region dist/domain/exactJsonNumber.js
var isExactJsonNumber, parseExactJson;
function init_exactJsonNumber() {
	return (init_exactJsonNumber = __esmMin((() => {
		init_jsonValue();
		init_safeJson();
		isExactJsonNumber = (value, source) => source !== undefined && isSafeNumber(source) && isSafeNumber(String(value)) && !Object.is(value, -0);
		parseExactJson = (text) => {
			const parsed = safeParseJson(text, (_key, value, context) => {
				if (typeof value === "number" && !isExactJsonNumber(value, context?.source)) throw new RangeError("JSON numeric conversion would lose recorded data");
				return value;
			});
			if (!parsed.ok) return undefined;
			const value = jsonValueSchema.safeParse(parsed.value);
			return value.success ? value.data : undefined;
		};
	})))();
}

//#endregion
export { isExactJsonNumber as n, parseExactJson as r, init_exactJsonNumber as t };