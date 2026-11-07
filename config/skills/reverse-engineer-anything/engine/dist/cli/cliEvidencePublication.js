import { AsyncLocalStorage } from "node:async_hooks";
const publication = new AsyncLocalStorage();
/** Keep publication state in the invocation that owns delivery and formatting. */
export const withCliEvidencePublication = (run) => publication.run({}, run);
export const recordCliEvidencePublication = (receipt) => {
    const context = publication.getStore();
    if (context !== undefined)
        context.receipt = receipt;
};
/** Snapshot a receipt for output recovery after the invocation context ends. */
export const cliEvidencePublicationReceipt = () => publication.getStore()?.receipt;
/** Preserve an already committed file when subsequent output selection fails. */
export const retainCliPublicationOnError = (error, receipt = cliEvidencePublicationReceipt()) => {
    return receipt === undefined
        ? error
        : error.retainDiagnostics({ evidence_bundle: { ...receipt } });
};
