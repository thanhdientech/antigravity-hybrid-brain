import { CutterBridgeClient } from "../cutter/CutterBridgeClient.js";
import { CutterBridgeService } from "../cutter/CutterBridgeService.js";
/** Compose a fresh bridge owner without discovering or contacting Cutter. */
export const createCutterBridgeService = (environment = process.env, options = {}) => new CutterBridgeService(new CutterBridgeClient(environment, options));
