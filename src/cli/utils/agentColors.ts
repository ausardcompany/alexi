/**
 * Agent color mappings and prompt formatting utilities
 * Maps each agent to a distinct terminal color for visual differentiation
 */

import { c, colors, type ColorName } from './colors.js';

export type { ColorName };

/** @deprecated Use src/cli/tui/index.ts (startTui) instead. */
/** Color mapping for each built-in agent */
export const AGENT_COLORS: Record<string, ColorName> = {
  code: 'green',
  debug: 'red',
  plan: 'cyan',
  explore: 'yellow',
  orchestrator: 'magenta',
};

/** Fallback color for unknown or unregistered agents */
export const DEFAULT_AGENT_COLOR: ColorName = 'blue';

/**
 * Get the terminal color for an agent
 * @param agentId - Agent identifier
 * @returns ColorName from the colors module
 */
export function getAgentColor(agentId: string): ColorName {
  return AGENT_COLORS[agentId] ?? DEFAULT_AGENT_COLOR;
}

/**
 * Format the REPL prompt with agent name and color
 * Example: "code ❯ " in green, or "debug ❯ " in red
 * @param agentId - Current agent ID (defaults to 'code')
 * @returns Colored prompt string ending with a space
 */
export function formatAgentPrompt(agentId: string | undefined): string {
  const agent = agentId ?? 'code';
  const color = getAgentColor(agent);
  return `${colors[color]}${agent} ❯${colors.reset} `;
}

/**
 * Format a compact agent badge for status lines
 * Example: "[code]" in green
 * @param agentId - Agent identifier
 * @returns Colored badge string
 */
export function formatAgentBadge(agentId: string): string {
  const color = getAgentColor(agentId);
  return c(color, `[${agentId}]`);
}

/**
 * Format a visual notification for agent switches
 * Example: "  ● Switched to debug agent" or "  ● Switched to debug agent (from code)"
 * @param fromAgent - Previous agent ID (undefined if none)
 * @param toAgent - New agent ID
 * @returns Formatted notification string
 */
export function formatAgentSwitchNotice(fromAgent: string | undefined, toAgent: string): string {
  const color = getAgentColor(toAgent);
  const dot = c(color, '●');
  const name = c(color, toAgent);
  const suffix = fromAgent && fromAgent !== toAgent ? ` ${c('dim', `(from ${fromAgent})`)}` : '';
  return `  ${dot} Switched to ${name} agent${suffix}`;
}
