import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_result, ok } from "./jsonLines-CKG28FwL.js";
import { init_analysisErrorCore } from "./analysisErrorCore-Dm6oHouq.js";
import { addressDistance, init_addressCoordinate } from "./mcpDoctorOptions-DnJ1wqKj.js";
import { init_nativeProviderOutput, invalidNativeOutput } from "./interfaceBuilderGraph-DT1im95M.js";
import { z } from "zod";

//#region dist/domain/native/nativeSegments.js
var segmentSchema, parseSegments, parseSegmentImageBase, projectBinaryOverview;
function init_nativeSegments() {
	return (init_nativeSegments = __esmMin((() => {
		init_result();
		init_analysisErrorCore();
		init_nativeProviderOutput();
		init_addressCoordinate();
		segmentSchema = z.object({
			name: z.string(),
			start: z.string(),
			end: z.string(),
			readable: z.boolean().nullable(),
			writable: z.boolean().nullable(),
			executable: z.boolean().nullable(),
			image_base: z.string().min(1).exactOptional(),
			address_space: z.string().min(1).exactOptional()
		});
		parseSegments = (value, operation = "list_segments") => {
			const parsed = z.array(segmentSchema).safeParse(value);
			return parsed.success ? ok(parsed.data) : invalidNativeOutput(operation, "segment list", parsed.error);
		};
		parseSegmentImageBase = (segments) => {
			const base = segments[0]?.image_base;
			return base !== undefined && segments.every((segment) => segment.image_base === base) ? base : undefined;
		};
		projectBinaryOverview = (input) => {
			const { document, procedure_count, string_count, segments } = input;
			const imageBase = segments === undefined ? undefined : parseSegmentImageBase(segments);
			return {
				document,
				...imageBase === undefined ? {} : { image_base: imageBase },
				...segments === undefined ? {} : {
					segments: segments.map(({ name, start, end, image_base, address_space }) => ({
						name,
						start,
						end,
						length: addressDistance(start, end),
						...image_base === undefined ? {} : { image_base },
						...address_space === undefined ? {} : { address_space }
					})),
					segment_count: segments.length
				},
				procedure_count,
				string_count
			};
		};
	})))();
}

//#endregion
export { init_nativeSegments, parseSegments, projectBinaryOverview };