import { FridaInstrumentationManager, } from "../frida/FridaInstrumentationManager.js";
/** Own a fresh Frida lifecycle; native bindings load only when requested. */
export const createFridaInstrumentationProvider = (options = {}) => new FridaInstrumentationManager(options);
