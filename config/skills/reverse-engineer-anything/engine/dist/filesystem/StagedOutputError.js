const STAGED_OUTPUT_CODES = [
    "handle_already_owned",
    "identity_unverified",
    "identity_changed",
    "file_disappeared",
    "unexpected_entries",
    "directory_unverified",
    "directory_identity_changed",
];
/** Owned staged-output admission failure. `code` is the stable identity. */
export class StagedOutputError extends Error {
    code;
    detail;
    _tag = "StagedOutputError";
    constructor(code, detail, options) {
        super(code, options);
        this.code = code;
        this.detail = detail;
        this.name = "StagedOutputError";
    }
}
