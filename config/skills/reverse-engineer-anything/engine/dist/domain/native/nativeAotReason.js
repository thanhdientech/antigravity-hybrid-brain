import { z } from "zod";
/**
 * Windows image-loader maximum for a PE executable. This is a format
 * constraint, not a REA resource budget, so it is not an environment setting.
 */
export const WINDOWS_IMAGE_LOADER_SECTION_LIMIT = 96;
const NATIVE_AOT_HYDRATION_DETAILS = [
    "length_outside_section",
    "leaves_captured_sections",
    "missing_base_pointer",
    "base_outside_mapped_sections",
    "exceeds_mapped_section",
    "relative_pointer_overflow",
    "fixup_leaves_sections",
    "invalid_payload_encoding",
    "copy_leaves_section",
    "inline_relative_fixups_leave",
    "invalid_inline_relative_pointer",
    "inline_pointer_fixups_leave",
    "invalid_inline_pointer",
    "pointer_outside_address_domain",
    "unsupported_command",
    "work_budget",
    "working_memory_budget",
];
const NATIVE_AOT_TRUNCATION_REASONS = [
    "source-byte-budget",
    "work-unit-budget",
    "working-memory-budget",
    "response-budget",
];
const NATIVE_AOT_SIMPLE_REASON_CODES = [
    "not_pe_image",
    "mz_header_not_pe",
    "pe_header_overlaps_dos",
    "coff_header_truncated",
    "section_header_truncated",
    "optional_header_too_short",
    "optional_header_truncated",
    "unsupported_pe32_plus",
    "unsupported_image_extent",
    "address_domain",
    "headers_do_not_fit",
    "section_exceeds_image",
    "virtual_section_overlap",
    "field_outside_file",
    "rebased_image",
    "no_rtr_directory",
    "ambiguous_rtr_directory",
    "dehydrated_section_count",
];
const nativeAotHydrationFactsSchema = z.strictObject({
    detail: z.enum(NATIVE_AOT_HYDRATION_DETAILS),
    command: z.int().nonnegative().optional(),
    runtime_override: z.literal(false).optional(),
});
const nonnegative = z.int().nonnegative();
/** Public NativeAOT admission and recovery reason. Display text is not the code. */
export const nativeAotReasonSchema = z.discriminatedUnion("code", [
    z.strictObject({ code: z.enum(NATIVE_AOT_SIMPLE_REASON_CODES) }),
    z.strictObject({
        code: z.literal("section_limit"),
        limit: z.literal(WINDOWS_IMAGE_LOADER_SECTION_LIMIT),
        observed: z.int().positive(),
    }),
    z.strictObject({
        code: z.literal("source_byte_budget"),
        limit_bytes: nonnegative,
        observed_bytes: nonnegative,
        runtime_override: z.literal(false),
    }),
    z.strictObject({
        code: z.literal("rtr_scan_budget"),
        runtime_override: z.literal(false),
    }),
    z.strictObject({
        code: z.literal("unsupported_rtr_version"),
        format_major: nonnegative,
        format_minor: nonnegative,
    }),
    z.strictObject({
        code: z.literal("hydration_failed"),
        detail: z.enum(NATIVE_AOT_HYDRATION_DETAILS),
        command: z.int().nonnegative().optional(),
        runtime_override: z.literal(false).optional(),
    }),
    z.strictObject({
        code: z.literal("no_system_object_root"),
        hydration: nativeAotHydrationFactsSchema.optional(),
    }),
    z.strictObject({
        code: z.literal("system_object_root_unproven"),
        runtime_override: z.literal(false),
        hydration: nativeAotHydrationFactsSchema.optional(),
    }),
    z.strictObject({
        code: z.literal("truncated"),
        truncation_reason: z.enum(NATIVE_AOT_TRUNCATION_REASONS),
    }),
]);
/** Admission failure whose public identity is `reason.code`, not `message`. */
export class NativeAotAdmissionError extends Error {
    reason;
    code;
    constructor(reason) {
        super(reason.code);
        this.reason = reason;
        this.name = "NativeAotAdmissionError";
        this.code = reason.code;
    }
}
/** Hydration detail carried on a reason without copying an Error message. */
export const nativeAotHydrationFacts = (detail, command) => {
    const budget = detail === "work_budget" || detail === "working_memory_budget"
        ? { runtime_override: false }
        : {};
    return command === undefined
        ? { detail, ...budget }
        : { detail, command, ...budget };
};
const BUDGET_HYDRATION_DETAILS = new Set([
    "work_budget",
    "working_memory_budget",
]);
/** Reason for a hydration failure, including the no-override fact for parser budgets. */
export const nativeAotHydrationReason = (facts) => BUDGET_HYDRATION_DETAILS.has(facts.detail)
    ? { code: "hydration_failed", ...facts, runtime_override: false }
    : { code: "hydration_failed", ...facts };
