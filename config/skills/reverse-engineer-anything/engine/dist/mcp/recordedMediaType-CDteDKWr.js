import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";

//#region dist/domain/analysisView/recordedMediaType.js
var MEDIA_TYPE_ESSENCE, JSON_LIKE_TEXT, mediaTypeEssence, isJson, isJsonLike;
function init_recordedMediaType() {
	return (init_recordedMediaType = __esmMin((() => {
		MEDIA_TYPE_ESSENCE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+\/[A-Za-z0-9!#$%&'*+.^_`|~-]+$/u;
		JSON_LIKE_TEXT = new Set(["text/plain", "text/markdown"]);
		mediaTypeEssence = (reported) => {
			const separator = reported.indexOf(";");
			let start = 0;
			let end = separator < 0 ? reported.length : separator;
			while (start < end && (reported[start] === " " || reported[start] === "	")) start += 1;
			while (end > start && (reported[end - 1] === " " || reported[end - 1] === "	")) end -= 1;
			const essence = reported.slice(start, end);
			return MEDIA_TYPE_ESSENCE.test(essence) ? essence.toLowerCase() : null;
		};
		isJson = (essence) => essence === "application/json" || essence !== null && essence.startsWith("application/") && essence.endsWith("+json");
		isJsonLike = (essence) => isJson(essence) || essence !== null && JSON_LIKE_TEXT.has(essence);
	})))();
}

//#endregion
export { mediaTypeEssence as i, isJson as n, isJsonLike as r, init_recordedMediaType as t };