import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { C as compactPresentationForMcpInputSchemaProfile, O as CURRENT_ENTRYPOINT_PATH, k as init_CurrentEntrypointPath, w as init_mcpInputSchemaProfile } from "./promptContracts-SGAqCWKX.js";
import { n as init_result, r as ok } from "./result-Dbqc_peo.js";
import { n as init_jsonValue, r as jsonObjectSchema } from "./jsonValue-CbQQraup.js";
import { n as init_logger, r as silentLogger } from "./logger-Brcs2SlV.js";
import { aa as init_SqliteDatabaseCapability, do as init_serverIdentity, ia as init_catalogIdentity, oa as sqliteDatabaseCapability, oo as init_BinarySessionStatus, ra as catalogIdentityForToolFamilies, so as providerCapabilitySets, uo as createServerIdentity } from "./createServer-CMxQrH3I.js";
import { ld as init_toolOutputSchemaPrimitives, ud as providerCapabilitySet } from "./toolOutputSchemaGroups-3HUmDmX5.js";
import { a as projectInvocationFailure, n as init_DirectAnalysisCleanup, o as withSessionCleanup, t as directAnalysisCleanupFailure } from "./DirectAnalysisCleanup-BJIsnH9_.js";

//#region dist/application/DirectAnalysisStatus.js
var runSessionStatus;
function init_DirectAnalysisStatus() {
	return (init_DirectAnalysisStatus = __esmMin((() => {
		init_jsonValue();
		init_serverIdentity();
		init_logger();
		init_toolOutputSchemaPrimitives();
		init_BinarySessionStatus();
		init_SqliteDatabaseCapability();
		init_CurrentEntrypointPath();
		init_catalogIdentity();
		init_mcpInputSchemaProfile();
		init_DirectAnalysisCleanup();
		init_result();
		runSessionStatus = async (dependencies, logger = silentLogger) => {
			const config = dependencies.readConfiguration();
			if (!config.ok) return { error: projectInvocationFailure(config.error) };
			const session = await dependencies.createBinarySession(config.value, logger);
			return withSessionCleanup(session, async () => {
				const status = jsonObjectSchema.parse(await session.status());
				return {
					...status,
					capabilities: [...providerCapabilitySet.array().parse(status.capabilities), ...providerCapabilitySets([sqliteDatabaseCapability(process.versions.node)])],
					server_identity: createServerIdentity({
						startedAt: new Date().toISOString(),
						commandPath: CURRENT_ENTRYPOINT_PATH,
						catalog: catalogIdentityForToolFamilies(compactPresentationForMcpInputSchemaProfile(config.value.mcpInputSchemaProfile), config.value.mcpOutputSchemaProfile ?? "full", config.value.mcpToolFamilies === undefined ? undefined : new Set(config.value.mcpToolFamilies))
					})
				};
			}, (status, cleanup) => directAnalysisCleanupFailure(ok(status), cleanup));
		};
	})))();
}

//#endregion
init_DirectAnalysisStatus();
export { runSessionStatus };