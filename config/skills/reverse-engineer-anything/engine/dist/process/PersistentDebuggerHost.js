/** Both persistent debugger managers require Linux procfs descriptor readback. */
export const persistentDebuggerHostSupported = (platform) => platform === "linux";
