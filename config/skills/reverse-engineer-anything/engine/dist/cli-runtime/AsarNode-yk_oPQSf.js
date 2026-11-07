import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { z } from "zod";

//#region dist/artifacts/AsarNode.js
var asarDeclaredSizeSchema, asarNodeSchema;
function init_AsarNode() {
	return (init_AsarNode = __esmMin((() => {
		asarDeclaredSizeSchema = z.number().nonnegative().safe();
		asarNodeSchema = z.looseObject({
			files: z.custom((value) => value !== null && typeof value === "object" && !Array.isArray(value)).optional(),
			link: z.string().optional(),
			size: asarDeclaredSizeSchema.optional(),
			offset: z.string().optional(),
			unpacked: z.boolean().optional(),
			executable: z.boolean().optional(),
			integrity: z.looseObject({
				algorithm: z.string(),
				hash: z.string()
			}).optional()
		});
	})))();
}

//#endregion
export { asarDeclaredSizeSchema, asarNodeSchema, init_AsarNode };