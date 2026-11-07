import { GdbSessionManager } from "../gdb/GdbSessionManager.js";
import { RizinDebugSessionManager } from "../rizin/RizinDebugSessionManager.js";
/** Allocate a GDB session owner; acquisition remains explicit in start(). */
export const createGdbSessionManager = (environment = process.env, options = {}) => new GdbSessionManager({ ...options, environment });
/** Allocate a Rizin debugger owner without launching a process or target. */
export const createRizinDebugSessionManager = (environment = process.env, options = {}) => new RizinDebugSessionManager(environment, options);
