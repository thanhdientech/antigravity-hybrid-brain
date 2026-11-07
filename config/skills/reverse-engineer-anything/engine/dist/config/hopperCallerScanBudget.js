import { DEFAULT_HOPPER_CALLER_SCAN_BUDGET_MS, MAX_NODE_TIMER_DELAY_MS, MINIMUM_HOPPER_CALLER_SCAN_BUDGET_MS, } from "../domain/analysisResourceLimits.js";
import { HOPPER_CALLER_PAGE_ALLOWANCE_BYTES, HOPPER_CALLER_SCAN_RETENTION_BYTES, } from "../domain/native/hopperCallerReconciliation.js";
export const HOPPER_CALLER_SCAN_BUDGET_SETTING = "REA_HOPPER_CALLER_SCAN_BUDGET_MS";
export const defaultHopperCallerScanBudget = () => ({
    setting: HOPPER_CALLER_SCAN_BUDGET_SETTING,
    milliseconds: DEFAULT_HOPPER_CALLER_SCAN_BUDGET_MS,
    source: "default",
    defaultMilliseconds: DEFAULT_HOPPER_CALLER_SCAN_BUDGET_MS,
    floorMilliseconds: MINIMUM_HOPPER_CALLER_SCAN_BUDGET_MS,
    maximumMilliseconds: MAX_NODE_TIMER_DELAY_MS,
});
/** Record whether the launch environment supplied the budget. */
export const hopperCallerScanBudgetFromEnvironment = (configured, milliseconds) => ({
    ...defaultHopperCallerScanBudget(),
    milliseconds,
    source: configured === undefined ? "default" : "setting",
});
/** Budget record for a caller that already resolved the millisecond count. */
export const hopperCallerScanBudgetForMilliseconds = (milliseconds) => hopperCallerScanBudgetFromEnvironment(milliseconds === DEFAULT_HOPPER_CALLER_SCAN_BUDGET_MS
    ? undefined
    : String(milliseconds), milliseconds);
const fixedAllowanceRecovery = `This release has no runtime override for the ${String(HOPPER_CALLER_PAGE_ALLOWANCE_BYTES)} byte instruction, native-caller, and page allowances or the ${String(HOPPER_CALLER_SCAN_RETENTION_BYTES)} byte retention budget. ${HOPPER_CALLER_SCAN_BUDGET_SETTING} does not raise them.`;
/** Environment recovery for a caller-scan limit. Domain facts stay separate. */
export const hopperCallerScanRecovery = (facts, budget) => {
    const fixedLimit = facts.stop.code === "page_allowance" ||
        facts.stop.code === "retention_budget" ||
        !facts.instructions_complete ||
        facts.native_callers_complete === false;
    if (facts.stop.code === "work_budget")
        return `${budget.setting} is ${String(budget.milliseconds)} ms (source: ${budget.source}). The default is ${String(budget.defaultMilliseconds)} ms. Allowed values are integers from ${String(budget.floorMilliseconds)} to ${String(budget.maximumMilliseconds)} ms. Set it in the environment that starts REA and restart REA. ${fixedAllowanceRecovery}`;
    return fixedLimit ? fixedAllowanceRecovery : "";
};
