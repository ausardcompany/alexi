/**
 * Modes Migrator
 * Syncs organization-managed modes from cloud configuration
 */

import type { AgentConfig } from '../agent/index.js';
import { getAgentRegistry } from '../agent/index.js';

export interface OrgMode {
  name: string;
  displayName?: string;
  description?: string;
  steps?: string[];
  options?: Record<string, unknown>;
  permission?: Record<string, unknown>;
}

/**
 * Migrate organization modes into the agent registry
 */
export async function migrateOrgModes(orgModes: OrgMode[]): Promise<void> {
  const registry = getAgentRegistry();

  for (const mode of orgModes) {
    const agentConfig: AgentConfig = {
      id: mode.name,
      name: mode.displayName ?? mode.name,
      displayName: mode.displayName,
      description: mode.description ?? '',
      mode: 'all',
      systemPrompt: '', // Organization modes should have their own system prompts
      options: {
        ...mode.options,
        source: 'organization',
        displayName: mode.displayName,
      },
    };

    // Register or update the agent
    registry.register(agentConfig);
  }
}

/**
 * Check if an agent is organization-managed
 */
export function isOrgManagedMode(agent: { options?: Record<string, unknown> }): boolean {
  return agent.options?.source === 'organization';
}
