import { probeBunStandaloneGraph, } from "./bun/BunModuleGraphLayout.js";
import { regularFileState, sameRegularFileState, } from "../filesystem/RegularFile.js";
import { findDotnetBundleHeader } from "./dotnet/DotnetBundle.js";
import { ArtifactReaderFailure } from "./ArtifactReader.js";
import { abortIfNeeded } from "./ArtifactHash.js";
import { locateGodotPck } from "./GodotPckLocation.js";
import { locateNodeSea, } from "./nodeSea/NodeSeaLocation.js";
import { observePyInstallerCookie, } from "./pyinstaller/CArchiveLayout.js";
/** Share format observations only across admissions of the same unchanged regular file. */
export class ArtifactEmbeddedFormatProbes {
    source;
    signal;
    #facts;
    constructor(path, source, signal, previous) {
        this.source = source;
        this.signal = signal;
        abortIfNeeded(signal);
        if (previous !== undefined &&
            !sameRegularFileState(previous.sourceState, source.initial))
            throw new ArtifactReaderFailure("integrity", `Root artifact changed before inventory: ${path}`);
        this.#facts = previous ?? { sourceState: regularFileState(source.initial) };
    }
    async godotPck(prefix) {
        abortIfNeeded(this.signal);
        if (this.#facts.godotPck !== undefined)
            return this.#facts.godotPck ?? undefined;
        const location = await locateGodotPck(this.source.handle, this.source.initial.size, this.signal, prefix);
        this.#facts = { ...this.#facts, godotPck: location ?? null };
        return location;
    }
    async nodeSea() {
        abortIfNeeded(this.signal);
        if (this.#facts.nodeSea !== undefined)
            return this.#facts.nodeSea ?? undefined;
        const location = await locateNodeSea(this.source.handle, this.source.initial.size, this.signal);
        this.#facts = { ...this.#facts, nodeSea: location ?? null };
        return location;
    }
    async pyInstaller() {
        abortIfNeeded(this.signal);
        if (this.#facts.pyInstaller !== undefined)
            return this.#facts.pyInstaller.state === "located"
                ? this.#facts.pyInstaller.cookie
                : undefined;
        const found = await observePyInstallerCookie(this.source.handle, this.source.initial.size, this.signal);
        abortIfNeeded(this.signal);
        if (!found.ok)
            throw new ArtifactReaderFailure(found.error.reason, found.error.message);
        this.#facts = { ...this.#facts, pyInstaller: found.value };
        return found.value.state === "located" ? found.value.cookie : undefined;
    }
    async dotnetBundle() {
        abortIfNeeded(this.signal);
        if (this.#facts.dotnetBundleHeaderOffset !== undefined)
            return this.#facts.dotnetBundleHeaderOffset ?? undefined;
        // An apphost inside a recognized CArchive cannot claim its outer carrier.
        const packaged = await this.pyInstaller();
        const header = await findDotnetBundleHeader(this.source.handle, this.source.initial.size, this.signal, packaged?.archiveStart ?? this.source.initial.size);
        abortIfNeeded(this.signal);
        this.#facts = { ...this.#facts, dotnetBundleHeaderOffset: header ?? null };
        return header;
    }
    async bunStandalone() {
        abortIfNeeded(this.signal);
        if (this.#facts.bunStandalone !== undefined)
            return this.#facts.bunStandalone;
        const observed = await probeBunStandaloneGraph(this.source.handle, this.source.initial.size, this.signal);
        abortIfNeeded(this.signal);
        this.#facts = { ...this.#facts, bunStandalone: observed };
        return observed;
    }
    completedFacts() {
        return this.#facts;
    }
}
