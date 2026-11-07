import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import canonicalize from "canonicalize";

//#region dist/domain/comparisonSemantics.js
var absenceClaimable, canonicalJson;
function init_comparisonSemantics() {
	return (init_comparisonSemantics = __esmMin((() => {
		absenceClaimable = (coverage) => coverage.status === "complete" && coverage.truncated !== true && (coverage.omitted_count === undefined || coverage.omitted_count === 0);
		canonicalJson = (value, context = "Comparison") => {
			const encoded = canonicalize(value);
			if (encoded === undefined) throw new TypeError(`${context} could not canonicalize data`);
			return encoded;
		};
	})))();
}

//#endregion
export { canonicalJson as n, init_comparisonSemantics as r, absenceClaimable as t };