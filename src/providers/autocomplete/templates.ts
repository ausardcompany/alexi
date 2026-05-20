/**
 * Autocomplete Templates
 * Fill-in-the-middle (FIM) prompt templates for code autocomplete models
 */

// Fill in the middle prompts
//
// We only expose Codestral and Mercury Edit 2 as autocomplete models — every
// other FIM template in the upstream continuedev list is unreachable.

export interface FimTemplate {
  prefix: string;
  suffix: string;
  middle?: string;
}

/**
 * Codestral FIM template
 */
export const codestralTemplate: FimTemplate = {
  prefix: '<fim_prefix>',
  suffix: '<fim_suffix>',
  middle: '<fim_middle>',
};

/**
 * Mercury Edit 2 FIM template
 */
export const mercuryEdit2Template: FimTemplate = {
  prefix: '<|fim_prefix|>',
  suffix: '<|fim_suffix|>',
  middle: '<|fim_middle|>',
};

/**
 * Get FIM template for a model
 */
export function getFimTemplate(modelId: string): FimTemplate | null {
  const lowerModel = modelId.toLowerCase();

  if (lowerModel.includes('codestral')) {
    return codestralTemplate;
  }

  if (lowerModel.includes('mercury') && lowerModel.includes('edit')) {
    return mercuryEdit2Template;
  }

  return null;
}
