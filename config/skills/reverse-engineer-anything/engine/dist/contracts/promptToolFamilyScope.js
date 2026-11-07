import { PROMPT_CONTRACTS } from "./promptContracts.js";
import { toolFamilyId } from "./toolFamilies.js";
/**
 * Require core workflow tools and omit optional routes whose tools are disabled.
 * Consumers share this projected contract so discovery, rendering and catalog
 * identity agree. An absent selection preserves the complete inventory.
 */
export const promptsForToolFamilies = (selection, contracts = PROMPT_CONTRACTS) => selection === undefined
    ? contracts
    : contracts.flatMap((contract) => {
        const steps = [];
        for (const step of contract.steps) {
            const available = step.tools.every((tool) => {
                const family = toolFamilyId(tool);
                return family !== undefined && selection.has(family);
            });
            if (available)
                steps.push(step);
            else if (step.availability !== "optional")
                return [];
        }
        return [{ ...contract, steps }];
    });
