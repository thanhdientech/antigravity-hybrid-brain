import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { z } from "zod";

//#region dist/domain/fileSnapshotObservation.js
var byteCount, sha256, fileSnapshotPartialObservationSchema;
function init_fileSnapshotObservation() {
	return (init_fileSnapshotObservation = __esmMin((() => {
		byteCount = z.number().int().nonnegative().safe();
		sha256 = z.string().regex(/^[a-f0-9]{64}$/u);
		fileSnapshotPartialObservationSchema = z.discriminatedUnion("kind", [z.strictObject({
			kind: z.literal("file-snapshot-hash"),
			path: z.string().min(1).nullable(),
			sha256: sha256.nullable(),
			bytes: byteCount
		}), z.strictObject({
			kind: z.literal("file-snapshot-read"),
			path: z.string().min(1).nullable(),
			admitted_sha256: sha256.nullable(),
			capture: z.discriminatedUnion("status", [z.strictObject({
				status: z.literal("captured"),
				bytes: byteCount
			}), z.strictObject({
				status: z.literal("over-capacity"),
				source_bytes_at_least: byteCount,
				maximum_bytes: byteCount
			})])
		})]);
	})))();
}

//#endregion
export { init_fileSnapshotObservation as n, fileSnapshotPartialObservationSchema as t };