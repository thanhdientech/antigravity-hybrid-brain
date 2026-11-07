import { createAnalysisExecution, } from "../application/AnalysisProvider.js";
import { AnalysisProtocolError } from "../domain/analysisErrorCore.js";
import { err, ok } from "../domain/result.js";
import { adbArguments, runAdb } from "./AdbCommand.js";
import { parseAdbDevicesOutput, parseGetpropOutput, } from "./AdbDeviceOutput.js";
const DEVICES_TIMEOUT_MS = 20_000;
const DEVICES_MAX_OUTPUT_BYTES = 1024 * 1024;
const SHELL_TIMEOUT_MS = 30_000;
const GETPROP_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const inspectAdbClientOperation = (context) => ok(createAnalysisExecution({ client: context.client, contacted_adb_server: false }, context.provider));
export const listAdbDevicesOperation = async (context) => {
    const ran = await runAdb(context.operation, { device: "adb-devices" }, context.selection, ["devices", "-l"], {
        timeoutMs: DEVICES_TIMEOUT_MS,
        maxOutputBytes: DEVICES_MAX_OUTPUT_BYTES,
        volatileOutput: true,
    }, context.signal);
    if (!ran.ok)
        return ran;
    const { devices, unparsedLines, daemonStarted } = parseAdbDevicesOutput(ran.value.stdout, ran.value.stderr);
    if (unparsedLines.total > 0)
        return err(new AnalysisProtocolError(`adb devices reported an unrecognized line: ${unparsedLines.sample[0]}`));
    return ok(createAnalysisExecution({
        client: context.client,
        devices,
        may_have_started_adb_server: daemonStarted,
    }, context.provider, {
        limitations: [
            "Device kind is inferred from the emulator serial prefix and USB transport metadata, not from device attestation",
            "Kind stays unknown for TCP transports unless the serial is an emulator port",
        ],
    }));
};
export const inspectAdbDeviceOperation = async (context) => {
    const { request } = context;
    if (request.operation !== "inspect_adb_device")
        return err(new AnalysisProtocolError(`adb device inspection does not accept ${request.operation}`));
    const serial = request.input.serial;
    const ran = await runAdb(context.operation, { device: serial }, context.selection, adbArguments(serial, ["shell", "getprop"]), {
        timeoutMs: SHELL_TIMEOUT_MS,
        maxOutputBytes: GETPROP_MAX_OUTPUT_BYTES,
        volatileOutput: true,
    }, context.signal);
    if (!ran.ok)
        return ran;
    const { properties, emulatorObserved } = parseGetpropOutput(ran.value.stdout);
    return ok(createAnalysisExecution({
        client: context.client,
        serial,
        properties,
        property_count: properties.length,
        emulator_observed: emulatorObserved,
    }, context.provider, {
        limitations: [
            "Properties are a fixed whitelist of build identity facts, not the full getprop dump",
            "emulator_observed is null when the build does not report ro.kernel.qemu",
        ],
    }));
};
