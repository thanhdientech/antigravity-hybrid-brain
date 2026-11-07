import { locateWiresharkTool, selectWiresharkTool, } from "../pcap/PcapConfiguration.js";
import { CapabilityScope } from "../application/CapabilityScope.js";
import { CAPABILITY_DECLARATIONS, } from "./capabilityDeclarations.js";
import { isAbsolute } from "node:path";
import { createGpuCodeObjectsService } from "./gpu.js";
import { createPacketCaptureService, tsharkHostSupported } from "./captures.js";
import { createSignalRecordingService, sigrokHostSupported, } from "./signals.js";
import { wasmArtifactModule } from "./wasm.js";
import { apkSignatureModule } from "./apkSignature.js";
import { evmInterfaceModule, evmHostSupported, evmLimiterAvailability, } from "./evm.js";
import { createSqliteDatabaseService } from "./sqlite.js";
import { createDesktopApplicationService } from "./desktop.js";
import { createGoBinaryService } from "./go.js";
import { createRustBinaryService } from "./rust.js";
import { createBeamService } from "./erlang.js";
import { createModelArtifactService } from "./model.js";
import { createIl2cppMetadataService } from "./il2cpp.js";
import { createElectronFuseService } from "./electronFuses.js";
import { createPythonPycService } from "./pythonPyc.js";
import { createWebNetworkCaptureService } from "./webNetworkCaptures.js";
import { createWebSourceLocationService } from "./webSourceLocations.js";
import { createWebModuleTraceService } from "./webModules.js";
import { createWebRuntimeService } from "./webRuntime.js";
import { createJavaScriptRecoveryProvider, wakaruHostSupported, } from "./javascriptRecovery.js";
import { ArtifactResourceScope } from "../artifacts/ArtifactResourceScope.js";
import { createReverseEngineeringService } from "./reverseEngineering.js";
import { FirmwareAnalysisService } from "../application/firmware/FirmwareAnalysisService.js";
import { createFirmwareAnalysisProvider, firmwareHostSupported, } from "./firmware.js";
import { createAndroidAnalysisProvider } from "./android.js";
import { createPcapAnalysisProvider } from "./pcap.js";
import { createFlutterBuildAnalysisProvider } from "./flutter.js";
import { createApktoolResourceAnalysisProvider } from "./apktool.js";
import { createJebAnalysisProvider } from "./jeb.js";
import { createAdbDeviceAnalysisProvider } from "./adb.js";
import { createFridaInstrumentationProvider } from "./frida.js";
import { createCutterBridgeService } from "./cutter.js";
import { createGdbSessionManager, createRizinDebugSessionManager, } from "./debuggerSessions.js";
import { persistentDebuggerHostSupported } from "../process/PersistentDebuggerHost.js";
import { pcapCaptureHostSupported } from "../domain/pcap/pcapAnalysis.js";
import { createPeLoadConfigService, createPeCertificatesService, createPeImportsService, createNativeExportsService, createPeResourcesService, createRecordedCrashService, createBinaryLayoutService, pwntoolsHostSupported, createDevicetreeService, createElfNotesService, createAppleIpsService, createKernelModuleService, } from "./binaryDiagnostics.js";
const tsharkLocatable = (environment) => {
    try {
        return (locateWiresharkTool(selectWiresharkTool(environment, "tshark"), environment) !== undefined);
    }
    catch {
        // A relative REA_TSHARK_COMMAND is configuration the tool reports at execution.
        return false;
    }
};
const capability = (create, close, observe, ownership = () => "host") => (context) => {
    const value = create(context);
    return {
        value,
        close: () => close(value),
        ownership: ownership(context),
        ...(observe === undefined
            ? {}
            : { availability: observe(context, value) }),
    };
};
const service = (create, observe) => capability(create, (value) => value.close(), observe);
const outsideHost = (injected, supported) => injected === undefined && !supported;
const configuredPwntools = (context) => pwntoolsHostSupported(context.platform, context.arch) &&
    isAbsolute(context.environment.REA_PWNTOOLS_PYTHON ?? "");
const sharedObservationOwnership = (context) => context.options.optionalObservationProviderOwner === "caller"
    ? "caller"
    : "host";
const closeObservation = (value) => value?.close?.() ?? Promise.resolve();
/** Each entry binds construction, ownership and observed availability once. */
const modules = {
    wasmArtifact: service(({ environment, options, settings }) => wasmArtifactModule.create(environment, options.wasmArtifact, settings), ({ environment, options }) => ({
        optionalFeatures: {
            wasmArtifactEnabled: options.wasmArtifact !== undefined ||
                isAbsolute(environment.REA_WABT_BIN_DIRECTORY ?? ""),
        },
    })),
    apkSignature: service(({ environment, options }) => apkSignatureModule.create(environment, options.apkSignature)),
    evmInterface: service(({ environment, options }) => options.evmInterface ?? evmInterfaceModule.create(environment), ({ environment, options, platform, arch }) => ({
        hostUnsupported: {
            evmInterface: outsideHost(options.evmInterface, evmHostSupported(platform, arch)),
        },
        optionalFeatures: {
            evmInterfaceEnabled: options.evmInterface !== undefined ||
                evmHostSupported(platform, arch),
        },
        ...(options.evmInterface !== undefined ||
            !evmHostSupported(platform, arch)
            ? {}
            : {
                probes: {
                    evmLimiterAvailability: (signal) => evmLimiterAvailability(environment, { signal }),
                },
            }),
    })),
    sqliteDatabase: service(({ environment, options }) => options.sqliteDatabase ?? createSqliteDatabaseService(environment)),
    binaryLayout: service(({ environment, options }) => options.binaryLayout ?? createBinaryLayoutService(environment), (context) => ({
        hostUnsupported: {
            binaryLayout: outsideHost(context.options.binaryLayout, pwntoolsHostSupported(context.platform, context.arch)),
        },
        optionalFeatures: {
            binaryLayoutEnabled: context.options.binaryLayout !== undefined ||
                configuredPwntools(context),
        },
    })),
    recordedCrash: service(({ environment, options }) => options.recordedCrash ?? createRecordedCrashService(environment), (context) => ({
        hostUnsupported: {
            recordedCrash: outsideHost(context.options.recordedCrash, pwntoolsHostSupported(context.platform, context.arch)),
        },
        optionalFeatures: {
            recordedCrashEnabled: context.options.recordedCrash !== undefined ||
                configuredPwntools(context),
        },
    })),
    webSourceLocation: service(({ environment, options }) => options.webSourceLocation ?? createWebSourceLocationService(environment)),
    webModuleTrace: service(({ environment, options }) => options.webModuleTrace ?? createWebModuleTraceService(environment), ({ environment, options }) => ({
        optionalFeatures: {
            webModuleResolutionEnabled: options.webModuleTrace !== undefined ||
                isAbsolute(environment.REA_BROWSER_EXECUTABLE ?? ""),
        },
    })),
    desktopApplication: service(() => createDesktopApplicationService()),
    goBinary: service(({ options }) => options.goBinary ?? createGoBinaryService()),
    rustBinary: service(({ options }) => options.rustBinary ?? createRustBinaryService()),
    erlangBeam: service(({ options }) => options.erlangBeam ?? createBeamService()),
    modelArtifact: service(() => createModelArtifactService()),
    gpuCodeObjects: service(() => createGpuCodeObjectsService()),
    il2cppMetadata: service(({ options }) => options.il2cppMetadata ?? createIl2cppMetadataService()),
    peResources: service(() => createPeResourcesService()),
    nativeExports: service(() => createNativeExportsService()),
    devicetree: service(() => createDevicetreeService()),
    elfNotes: service(() => createElfNotesService()),
    appleIps: service(() => createAppleIpsService()),
    kernelModule: service(() => createKernelModuleService()),
    peLoadConfig: service(() => createPeLoadConfigService()),
    peCertificates: service(() => createPeCertificatesService()),
    peImports: service(() => createPeImportsService()),
    electronFuses: service(({ options }) => options.electronFuses ?? createElectronFuseService()),
    pythonPyc: service(({ options }) => options.pythonPyc ?? createPythonPycService()),
    webNetworkCapture: service(({ environment, options, settings }) => options.webNetworkCapture ??
        createWebNetworkCaptureService(environment, settings)),
    javascriptRecovery: capability(({ environment, options }) => options.javascriptRecovery ??
        createJavaScriptRecoveryProvider(environment), (value) => value.close?.() ?? Promise.resolve(), ({ environment, options, platform, arch }) => ({
        hostUnsupported: {
            javascriptRecovery: outsideHost(options.javascriptRecovery, wakaruHostSupported(platform, arch)),
        },
        optionalFeatures: {
            javascriptRecoveryEnabled: options.javascriptRecovery !== undefined ||
                (wakaruHostSupported(platform, arch) &&
                    isAbsolute(environment.REA_WAKARU_COMMAND ?? "")),
        },
    })),
    artifactResources: service(() => new ArtifactResourceScope()),
    reverseEngineering: service(({ providerEnvironment }) => createReverseEngineeringService(providerEnvironment)),
    firmwareAnalysis: service(({ environment, options }) => new FirmwareAnalysisService(options.firmwareAnalysis ?? createFirmwareAnalysisProvider(environment)), ({ environment, options, platform }) => ({
        hostUnsupported: {
            firmwareInspection: outsideHost(options.firmwareAnalysis, firmwareHostSupported(platform)),
            firmwareExtraction: outsideHost(options.firmwareAnalysis, firmwareHostSupported(platform)),
        },
        optionalFeatures: {
            firmwareInspectionEnabled: options.firmwareAnalysis !== undefined ||
                (firmwareHostSupported(platform) &&
                    isAbsolute(environment.REA_BINWALK_COMMAND ?? "")),
            firmwareExtractionEnabled: options.firmwareAnalysis !== undefined ||
                (firmwareHostSupported(platform) &&
                    isAbsolute(environment.REA_UNBLOB_COMMAND ?? "")),
        },
    })),
    gdbSessions: capability(({ providerEnvironment }) => createGdbSessionManager(providerEnvironment), (value) => value.closeAll(), ({ platform }) => ({
        hostUnsupported: {
            persistentDebugger: !persistentDebuggerHostSupported(platform),
        },
    })),
    rizinDebugSessions: capability(({ providerEnvironment }) => createRizinDebugSessionManager(providerEnvironment), (value) => value.closeAll()),
    android: service(({ environment, options, settings }) => options.androidAnalysis ??
        createAndroidAnalysisProvider(environment, undefined, settings), (_context, value) => ({
        probes: {
            androidAnalysisAvailability: (signal) => value.inspectAvailability(signal),
        },
    })),
    pcap: service(({ environment, options }) => options.pcapAnalysis ?? createPcapAnalysisProvider(environment), ({ options, platform }) => ({
        hostUnsupported: {
            pcapCapture: outsideHost(options.pcapAnalysis, pcapCaptureHostSupported(platform)),
        },
    })),
    flutter: service(({ options }) => options.flutterAnalysis ?? createFlutterBuildAnalysisProvider()),
    fridaInstrumentation: capability(({ options }) => options.fridaInstrumentation ?? createFridaInstrumentationProvider(), (value) => value.closeAll(), ({ options }, value) => ({
        observeProviderLoadFailures: () => {
            const failure = options.optionalProviderLoadFailures?.fridaInstrumentation ??
                value.availabilityFailure?.();
            return failure === undefined ? {} : { fridaInstrumentation: failure };
        },
    })),
    packetCapture: service(({ environment, options }) => options.packetCapture ?? createPacketCaptureService(environment), ({ environment, options, platform }) => ({
        hostUnsupported: {
            packetCapture: outsideHost(options.packetCapture, tsharkHostSupported(platform)),
        },
        optionalFeatures: {
            packetCaptureEnabled: options.packetCapture !== undefined ||
                (tsharkHostSupported(platform) && tsharkLocatable(environment)),
        },
    })),
    signalRecording: service(({ environment, options }) => options.signalRecording ?? createSignalRecordingService(environment), ({ environment, options, platform }) => ({
        hostUnsupported: {
            signalRecording: outsideHost(options.signalRecording, sigrokHostSupported(platform)),
        },
        optionalFeatures: {
            signalRecordingEnabled: options.signalRecording !== undefined ||
                (sigrokHostSupported(platform) &&
                    isAbsolute(environment.REA_SIGROK_COMMAND ?? "")),
        },
    })),
    webRuntime: capability(({ options }) => options.webRuntime ?? createWebRuntimeService(), (value) => value.provider.close?.() ?? Promise.resolve()),
    apktool: service(({ environment, options }) => options.apktoolAnalysis ??
        createApktoolResourceAnalysisProvider(environment), (_context, value) => ({
        probes: {
            apktoolAnalysisAvailability: (signal) => value.inspectAvailability(signal),
        },
    })),
    jeb: service(({ environment, options }) => options.jebAnalysis ?? createJebAnalysisProvider(environment), (_context, value) => ({
        probes: {
            jebAnalysisAvailability: (signal) => value.inspectAvailability(signal),
        },
    })),
    adbDevice: service(({ environment, options }) => options.adbDeviceAnalysis ?? createAdbDeviceAnalysisProvider(environment), (_context, value) => ({
        probes: {
            adbAnalysisAvailability: (signal) => value.inspectAvailability(signal),
        },
    })),
    cutter: service(({ providerEnvironment }) => createCutterBridgeService(providerEnvironment)),
    browserObservation: capability(({ options }) => options.browserObservation, closeObservation, ({ options }) => ({
        optionalFeatures: {
            browserObservationEnabled: options.browserObservation !== undefined,
        },
    }), sharedObservationOwnership),
    browserScenarioCapture: capability(({ options }) => options.browserScenarioCapture, closeObservation, ({ options }) => ({
        optionalFeatures: {
            browserScenarioEnabled: options.browserScenarioCapture !== undefined,
        },
    }), sharedObservationOwnership),
    electronObservation: capability(({ options }) => options.electronObservation, closeObservation, ({ options }) => ({
        optionalFeatures: {
            electronObservationEnabled: options.electronObservation !== undefined,
        },
    }), sharedObservationOwnership),
    electronActiveObservation: capability(({ options }) => options.electronActiveObservation, closeObservation, ({ options }) => ({
        optionalFeatures: {
            electronAutomationEnabled: options.electronActiveObservation !== undefined,
        },
    }), sharedObservationOwnership),
    javascriptRuntimeObservation: capability(({ options }) => options.javascriptRuntimeObservation, closeObservation, ({ options }) => ({
        optionalFeatures: {
            v8InspectorObservationEnabled: options.javascriptRuntimeObservation !== undefined,
        },
    }), sharedObservationOwnership),
};
/** Compose every service and its cleanup together, retaining precise typed ports. */
export const createCapabilityServices = (context) => {
    const scope = new CapabilityScope();
    const hostUnsupported = {};
    const optionalFeatures = {};
    const probes = {};
    const failureObservers = [];
    const availability = { hostUnsupported, optionalFeatures };
    // This is a key-preserving map of a source-owned typed declaration, not an
    // external value parser or a generic operation dispatcher.
    const services = Object.fromEntries(Object.entries(modules).map(([id, create]) => {
        const instance = create(context);
        const declaration = CAPABILITY_DECLARATIONS[id];
        if (declaration === undefined)
            throw new Error(`Undeclared capability ${id}`);
        Object.assign(availability.hostUnsupported, instance.availability?.hostUnsupported);
        Object.assign(availability.optionalFeatures, instance.availability?.optionalFeatures);
        Object.assign(probes, instance.availability?.probes);
        const observeFailure = instance.availability?.observeProviderLoadFailures;
        if (observeFailure !== undefined)
            failureObservers.push(observeFailure);
        return [
            id,
            instance.ownership === "host"
                ? scope.own(id, instance.value, instance.close)
                : instance.value,
        ];
    }));
    return {
        services,
        availability,
        probes,
        observeProviderLoadFailures: () => Object.assign({}, ...failureObservers.map((observe) => observe())),
        close: () => scope.close(),
    };
};
