import { addElectronIpcBoundaries } from "./ElectronBoundaryGraphIpc.js";
import { addElectronNativeBoundaries } from "./ElectronBoundaryGraphNative.js";
import { addElectronProtocolBoundaries } from "./ElectronBoundaryGraphProtocols.js";
import { addElectronWindowBoundaries } from "./ElectronBoundaryGraphWindows.js";
import { addElectronCallPaths } from "./ElectronBoundaryGraphCallPaths.js";
/** Add every static Electron process and security-boundary fact to the JAG. */
export const addElectronBoundaries = (context, ipc) => {
    addElectronWindowBoundaries(context);
    addElectronIpcBoundaries(context, ipc);
    addElectronNativeBoundaries(context);
    addElectronProtocolBoundaries(context);
    addElectronCallPaths(context, ipc);
};
