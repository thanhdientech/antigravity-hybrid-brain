const PROCESS_ADMISSION_CODES = [
    "runtime_closing",
    "stdout_missing",
    "request_stream_failed",
    "finalization_unobserved",
    "prefix_identity_lost",
    "prefix_unavailable",
    "identity_snapshot_unavailable",
    "current_process_unreported",
    "baseline_unavailable",
    "memory_limit_unsupported",
    "launcher_pid_missing",
    "duplicate_key",
    "reader_closed",
    "token_json_invalid",
    "token_response_invalid",
    "token_pid_set",
    "token_pid_incomplete",
    "identity_json_invalid",
    "identity_response_invalid",
    "identity_pid_set",
    "identity_pid_incomplete",
    "limit_unreadable",
    "limit_invalid",
    "report_exceeds_budget",
];
/** Process ownership, worker, or limit admission failure. `code` is the stable identity. */
export class ProcessAdmissionError extends Error {
    code;
    detail;
    _tag = "ProcessAdmissionError";
    constructor(code, detail, options) {
        super(code, options);
        this.code = code;
        this.detail = detail;
        this.name = "ProcessAdmissionError";
    }
}
