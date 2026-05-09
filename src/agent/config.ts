/**
 * Agent Configuration
 * Handles agent configuration with proper null/undefined handling
 */

import { z } from 'zod';

/**
 * Agent configuration schema with nullable steps
 * Uses explicit null to distinguish between "use default" and "unset"
 */
export const AgentConfigSchema = z.object({
  steps: z.number().nullable().optional().describe('Maximum steps for agent execution. Null means use default.'),
  enabled: z.boolean().optional().describe('Whether the agent is enabled'),
  maxTokens: z.number().optional().describe('Maximum tokens for agent responses'),
  temperature: z.number().min(0).max(2).optional().describe('Temperature for agent responses'),
});

export type AgentConfigData = z.infer<typeof AgentConfigSchema>;

/**
 * Normalize agent config to handle null/undefined properly
 * Preserves explicit null/undefined distinction for steps
 */
export function normalizeAgentConfig(config: unknown): AgentConfigData {
  // Handle null or undefined input
  if (config === null || config === undefined) {
    return {
      steps: null,
      enabled: undefined,
    };
  }

  // Parse with schema
  const parsed = AgentConfigSchema.parse(config);

  // Preserve explicit null for steps (means "use default")
  // vs undefined (means "not set")
  return {
    steps: parsed.steps ?? null,
    enabled: parsed.enabled,
    maxTokens: parsed.maxTokens,
    temperature: parsed.temperature,
  };
}

/**
 * Merge agent configs with proper null handling
 */
export function mergeAgentConfig(
  base: AgentConfigData,
  override: Partial<AgentConfigData>
): AgentConfigData {
  return {
    steps: override.steps !== undefined ? override.steps : base.steps,
    enabled: override.enabled !== undefined ? override.enabled : base.enabled,
    maxTokens: override.maxTokens !== undefined ? override.maxTokens : base.maxTokens,
    temperature: override.temperature !== undefined ? override.temperature : base.temperature,
  };
}

/**
 * Get effective steps value
 * Returns the configured steps or a default if null/undefined
 */
export function getEffectiveSteps(config: AgentConfigData, defaultSteps = 50): number {
  return config.steps ?? defaultSteps;
}
