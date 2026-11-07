import { SAVED_URL_PLACEHOLDER, } from "../domain/browserScenarioValues.js";
import { awaitSavedResponse, performScenarioRequest, withSavedPlaceholders, } from "./PlaywrightScenarioRequest.js";
const resolveLocator = (page, locator) => {
    switch (locator.kind) {
        case "test_id":
            return page.getByTestId(locator.value);
        case "role":
            return page.getByRole(locator.role, {
                name: locator.name,
                exact: true,
            });
        case "css":
            return page.locator(locator.selector);
    }
};
const resolveValue = (value, secrets) => secrets.value(value);
/** Watch the response selector before the UI action; matching does not prove action causality. */
const savingResponse = (input, action, timeout) => action.save_response === undefined
    ? undefined
    : awaitSavedResponse(input.page, {
        stepId: action.step_id,
        spec: action.save_response,
        startOrigin: input.startOrigin,
        timeout,
        secrets: input.secrets,
        signal: input.signal,
    });
/** Execute one admitted declarative action; a request step sends one declared request through the page's own fetch, and no action runs caller-supplied code. */
export const performPlaywrightScenarioAction = async (input) => {
    const { page, action, secrets, startOrigin, signal } = input;
    const timeout = "timeout_ms" in action ? action.timeout_ms : undefined;
    const options = timeout === undefined ? {} : { timeout };
    switch (action.action) {
        case "goto":
            // Placeholders fill the URL as written, before structured query values join it.
            await page.goto(secrets.url({
                ...action.destination,
                url: withSavedPlaceholders(action.destination.url, secrets, SAVED_URL_PLACEHOLDER),
            }), { ...options, waitUntil: action.wait_until });
            return;
        case "click": {
            const saving = savingResponse(input, action, timeout);
            try {
                await resolveLocator(page, action.locator).click({
                    ...options,
                    button: action.button,
                    clickCount: action.click_count,
                });
                await saving?.saved();
            }
            finally {
                saving?.stop();
            }
            return;
        }
        case "fill":
            await resolveLocator(page, action.locator).fill(resolveValue(action.value, secrets), options);
            return;
        case "press": {
            const saving = savingResponse(input, action, timeout);
            try {
                await resolveLocator(page, action.locator).press(action.key, options);
                await saving?.saved();
            }
            finally {
                saving?.stop();
            }
            return;
        }
        case "select_option":
            await resolveLocator(page, action.locator).selectOption(resolveValue(action.value, secrets), options);
            return;
        case "check":
            await resolveLocator(page, action.locator).check(options);
            return;
        case "uncheck":
            await resolveLocator(page, action.locator).uncheck(options);
            return;
        case "wait_for":
            await resolveLocator(page, action.locator).waitFor({
                ...options,
                state: action.state,
            });
            return;
        case "wait_for_timeout":
            await page.waitForTimeout(action.duration_ms);
            return;
        case "request":
            await performScenarioRequest({
                page,
                action,
                secrets,
                startOrigin,
                signal,
                onOpaqueRedirect: input.onOpaqueRedirect,
            });
            return;
        default: {
            const unhandled = action;
            throw new Error(`Unhandled browser scenario action ${String(unhandled)}`);
        }
    }
};
