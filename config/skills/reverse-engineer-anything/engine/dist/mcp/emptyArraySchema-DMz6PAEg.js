import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { z } from "zod";

//#region dist/domain/emptyArraySchema.js
var emptyArraySchema;
function init_emptyArraySchema() {
	return (init_emptyArraySchema = __esmMin((() => {
		emptyArraySchema = z.array(z.never()).length(0);
	})))();
}

//#endregion
export { init_emptyArraySchema as n, emptyArraySchema as t };