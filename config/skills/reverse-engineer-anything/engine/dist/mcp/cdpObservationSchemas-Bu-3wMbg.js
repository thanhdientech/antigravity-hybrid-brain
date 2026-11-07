import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { z } from "zod";
import { createHash } from "node:crypto";

//#region dist/domain/webContentArtifact.js
var webTextArtifactMetadataSchema, webTextArtifactSchema, createWebTextArtifact;
function init_webContentArtifact() {
	return (init_webContentArtifact = __esmMin((() => {
		webTextArtifactMetadataSchema = z.object({
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			bytes: z.int().min(0),
			media_type: z.string().min(1),
			charset: z.literal("utf-8")
		});
		webTextArtifactSchema = webTextArtifactMetadataSchema.extend({ text: z.string() }).superRefine((artifact, context) => {
			const bytes = Buffer.byteLength(artifact.text);
			const digest = createHash("sha256").update(artifact.text).digest("hex");
			if (artifact.bytes !== bytes) context.addIssue({
				code: "custom",
				path: ["bytes"],
				message: "Byte count mismatch"
			});
			if (artifact.sha256 !== digest) context.addIssue({
				code: "custom",
				path: ["sha256"],
				message: "Digest mismatch"
			});
		});
		createWebTextArtifact = (text, mediaType) => {
			const sha256 = createHash("sha256").update(text).digest("hex");
			return {
				sha256,
				bytes: Buffer.byteLength(text),
				media_type: mediaType,
				charset: "utf-8",
				text
			};
		};
	})))();
}

//#endregion
//#region dist/domain/cdpObservationSchemas.js
var cdpResourceColumnSchema, cdpDomNodeSchema, cdpDomSnapshotSchema, cdpScriptSourceSchema, cdpScriptMetadataSchema;
function init_cdpObservationSchemas() {
	return (init_cdpObservationSchemas = __esmMin((() => {
		init_webContentArtifact();
		cdpResourceColumnSchema = z.int();
		cdpDomNodeSchema = z.object({
			index: z.number().int().min(0),
			parent_index: z.number().int().min(-1),
			node_type: z.number().int().min(0),
			node_name: z.string(),
			node_value_length: z.number().int().min(0).describe("Length in the enclosing DOM snapshot's node_value_length_unit."),
			attribute_names: z.array(z.string())
		});
		cdpDomSnapshotSchema = z.object({
			total_nodes: z.int().min(0),
			node_value_length_unit: z.enum(["utf16-code-units", "utf8-bytes"]).describe("Unit for all node_value_length values; absent in historical captures means unknown.").exactOptional(),
			nodes: z.array(cdpDomNodeSchema)
		});
		cdpScriptSourceSchema = z.discriminatedUnion("included", [z.object({
			included: z.literal(false),
			reason: z.string()
		}), z.object({
			included: z.literal(true),
			artifact: webTextArtifactSchema
		})]);
		cdpScriptMetadataSchema = z.object({
			cdp_hash: z.string().nullable().describe("Producer-reported script hash; null when unavailable."),
			length: z.number().int().min(0).nullable().describe("Producer-reported script length; null when unavailable."),
			is_module: z.boolean().nullable().describe("Producer-reported module classification; null when unavailable."),
			language: z.string().nullable()
		});
	})))();
}

//#endregion
export { init_cdpObservationSchemas as a, webTextArtifactMetadataSchema as c, cdpScriptSourceSchema as i, webTextArtifactSchema as l, cdpResourceColumnSchema as n, createWebTextArtifact as o, cdpScriptMetadataSchema as r, init_webContentArtifact as s, cdpDomSnapshotSchema as t };