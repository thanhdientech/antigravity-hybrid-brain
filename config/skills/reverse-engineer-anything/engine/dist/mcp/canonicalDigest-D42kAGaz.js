import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { createHash } from "node:crypto";

//#region dist/domain/canonicalDigest.js
var digestCanonicalValue, CanonicalDigestError, emitCanonical;
function init_canonicalDigest() {
	return (init_canonicalDigest = __esmMin((() => {
		digestCanonicalValue = (value, context = "Comparison") => {
			const hash = createHash("sha256");
			let buffered = "";
			const flush = () => {
				if (buffered.length === 0) return;
				hash.update(buffered);
				buffered = "";
			};
			const emit = (part) => {
				if (part.length >= 8192) {
					flush();
					hash.update(part);
					return;
				}
				buffered += part;
				if (buffered.length >= 8192) flush();
			};
			const encoded = emitCanonical(value, emit, new Set());
			if (!encoded) throw new TypeError(`${context} could not canonicalize data`);
			flush();
			return hash.digest("hex");
		};
		CanonicalDigestError = class extends Error {
			code;
			_tag = "CanonicalDigestError";
			constructor(code) {
				super(code);
				this.code = code;
				this.name = "CanonicalDigestError";
			}
		};
		emitCanonical = (value, emit, ancestors) => {
			if (typeof value === "number" && !Number.isFinite(value)) throw new CanonicalDigestError(Number.isNaN(value) ? "nan" : "infinity");
			if (value === null || typeof value !== "object") {
				const encoded = JSON.stringify(value);
				if (encoded === undefined) return false;
				emit(encoded);
				return true;
			}
			if (ancestors.has(value)) throw new CanonicalDigestError("circular");
			ancestors.add(value);
			try {
				if ("toJSON" in value && typeof value.toJSON === "function") {
					const normalized = value.toJSON();
					return emitCanonical(normalized, emit, ancestors);
				}
				if (Array.isArray(value)) {
					emit("[");
					const length = value.length;
					for (let index = 0; index < length; index += 1) {
						if (index > 0) emit(",");
						if (!(index in value)) continue;
						const item = value[index];
						emitCanonical(item === undefined || typeof item === "symbol" ? null : item, emit, ancestors);
					}
					emit("]");
				} else {
					emit("{");
					let first = true;
					for (const key of Object.keys(value).sort()) {
						if (Reflect.get(value, key) === undefined || typeof Reflect.get(value, key) === "symbol") continue;
						const item = Reflect.get(value, key);
						if (!first) emit(",");
						first = false;
						emit(JSON.stringify(key));
						emit(":");
						if (!emitCanonical(item, emit, ancestors)) emit("undefined");
					}
					emit("}");
				}
				return true;
			} finally {
				ancestors.delete(value);
			}
		};
	})))();
}

//#endregion
export { digestCanonicalValue as n, init_canonicalDigest as r, CanonicalDigestError as t };