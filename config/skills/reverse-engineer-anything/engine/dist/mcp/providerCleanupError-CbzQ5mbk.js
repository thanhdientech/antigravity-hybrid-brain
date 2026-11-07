import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { X as init_providerAdapterError, Y as ProviderAdapterError } from "./analysisErrorProjection-B_6dTGtM.js";

//#region dist/domain/providerCleanupError.js
var ProviderCleanupError;
function init_providerCleanupError() {
	return (init_providerCleanupError = __esmMin((() => {
		init_providerAdapterError();
		ProviderCleanupError = class extends ProviderAdapterError {
			cleanupIncomplete = true;
			userMessage = "Provider cleanup could not be fully confirmed. Review the reported local resources before opening another target.";
			/** Producer-attested completed output; ordinary partial observations cannot recover success. */
			completedObservation;
			constructor(providerId, resources, diagnostics, options) {
				const { operation = "close_binary", completedObservation, ...errorOptions } = options ?? {};
				super(providerId, operation, {
					...errorOptions,
					diagnostics
				});
				this.completedObservation = completedObservation;
				this.setCleanupResources(resources);
			}
		};
	})))();
}

//#endregion
export { init_providerCleanupError as n, ProviderCleanupError as t };