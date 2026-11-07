import { catalogIdentityForToolFamilies, } from "../catalogIdentity.js";
import { toolFamilyId } from "../contracts/toolFamilies.js";
import { EvidenceMcpServerCore } from "./EvidenceMcpServerCore.js";
/** Canonical composition retains the constructor's existing identity defaults. */
export class EvidenceMcpServer extends EvidenceMcpServerCore {
    constructor(info, options, recordEvidence, delivery, compactPresentation = undefined, outputSchemaProfile = "full", identity, advertisedToolFamilies = undefined) {
        super(info, options, recordEvidence, delivery, compactPresentation, outputSchemaProfile, identity ??
            catalogIdentityForToolFamilies(compactPresentation, outputSchemaProfile, advertisedToolFamilies), advertisedToolFamilies);
    }
    /**
     * Out-of-scope tools stay registered but disabled: `tools/list` omits them
     * and calls fail with the SDK's disabled-tool error, so status reports
     * cannot direct agents to calls that always fail.
     */
    advertisesTool(name) {
        const families = this.advertisedToolFamilies;
        if (families === undefined)
            return true;
        const family = toolFamilyId(name);
        return family !== undefined && families.has(family);
    }
}
