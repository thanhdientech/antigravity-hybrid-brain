import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { i as init_configurationErrors, n as ConfigurationError } from "./configurationErrors-Dc_G1uM0.js";
import { n as init_result, r as ok, t as err } from "./result-Dbqc_peo.js";
import { Gt as DEFAULT_ASAR_MAX_HEADER_BYTES, en as MAXIMUM_ASAR_MAX_HEADER_BYTES, ln as init_analysisResourceLimits } from "./analysisErrorProjection-B_6dTGtM.js";
import { z } from "zod";

//#region dist/config/asarHeaderAdmission.js
var ASAR_HEADER_ADMISSION_SETTING, DEFAULT_ASAR_HEADER_ADMISSION, asarMaxHeaderBytesConstraint, asarMaxHeaderBytesSchema, parseAsarHeaderAdmission;
function init_asarHeaderAdmission() {
	return (init_asarHeaderAdmission = __esmMin((() => {
		init_analysisResourceLimits();
		init_configurationErrors();
		init_result();
		ASAR_HEADER_ADMISSION_SETTING = "REA_ASAR_MAX_HEADER_BYTES";
		DEFAULT_ASAR_HEADER_ADMISSION = {
			maximumBytes: DEFAULT_ASAR_MAX_HEADER_BYTES,
			source: "default"
		};
		asarMaxHeaderBytesConstraint = `${ASAR_HEADER_ADMISSION_SETTING} must be a positive decimal integer of at most ${String(MAXIMUM_ASAR_MAX_HEADER_BYTES)} bytes (256 MiB); the default is ${String(DEFAULT_ASAR_MAX_HEADER_BYTES)} bytes (16 MiB).`;
		asarMaxHeaderBytesSchema = z.string().regex(/^[1-9]\d*$/u, { error: asarMaxHeaderBytesConstraint }).transform(Number).pipe(z.number().int().max(MAXIMUM_ASAR_MAX_HEADER_BYTES, { error: asarMaxHeaderBytesConstraint }));
		parseAsarHeaderAdmission = (value) => {
			if (value === undefined) return ok(DEFAULT_ASAR_HEADER_ADMISSION);
			const parsed = asarMaxHeaderBytesSchema.safeParse(value);
			return parsed.success ? ok({
				maximumBytes: parsed.data,
				source: "setting"
			}) : err(new ConfigurationError(asarMaxHeaderBytesConstraint, { settings: [{
				setting: ASAR_HEADER_ADMISSION_SETTING,
				constraint: asarMaxHeaderBytesConstraint
			}] }));
		};
	})))();
}

//#endregion
export { parseAsarHeaderAdmission as a, init_asarHeaderAdmission as i, DEFAULT_ASAR_HEADER_ADMISSION as n, asarMaxHeaderBytesSchema as r, ASAR_HEADER_ADMISSION_SETTING as t };