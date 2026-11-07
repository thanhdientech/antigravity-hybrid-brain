const EVM_ADMISSION_CODES = [
    "prlimit_not_absolute",
    "prlimit_not_file",
    "cleanup_incomplete",
    "cleanup_unconfirmed",
    "marker_mismatch",
    "request_path_missing",
    "tag_or_float",
    "text_bytes_unavailable",
    "collection_exceeds_bound",
    "nesting_exceeds_profile",
    "value_outside_profile",
    "repeated_map_key",
    "root_not_map",
];
/** EVM limiter, worker, or metadata admission failure. `code` is the stable identity. */
export class EvmAdmissionError extends Error {
    code;
    detail;
    _tag = "EvmAdmissionError";
    constructor(code, detail, options) {
        super(code, options);
        this.code = code;
        this.detail = detail;
        this.name = "EvmAdmissionError";
    }
}
