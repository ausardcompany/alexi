/**
 * Agent System
 * Defines specialized agents with different capabilities and prompts
 * Based on kilocode/opencode agent patterns with @syntax for switching
 */

import { z } from 'zod';
import { AgentSwitched } from '../bus/index.js';
import { getAgentPrompt } from './system.js';

// Agent mode - determines when agent is available
export type AgentMode = 'primary' | 'subagent' | 'all';

// Agent schema for validation
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string().optional(), // Human-readable name for org modes
  description: z.string(),
  mode: z.enum(['primary', 'subagent', 'all']).default('all'),
  systemPrompt: z.string(),
  deprecated: z.boolean().optional(), // Mark agents as deprecated
  // Tool configuration
  tools: z.array(z.string()).optional(), // Tool IDs this agent can use
  disabledTools: z.array(z.string()).optional(), // Explicitly disabled tools
  // Model preferences
  preferredModel: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().optional(),
  // Aliases for @syntax switching
  aliases: z.array(z.string()).optional(),
  // Options for organization-managed agents
  options: z.record(z.string(), z.unknown()).optional(),
});

export type AgentConfig = z.infer<typeof AgentSchema>;

// Agent definition with utilities
export interface Agent extends AgentConfig {
  canUseTool(toolId: string): boolean;
}

// Create an agent from config
function createAgent(config: AgentConfig): Agent {
  return {
    ...config,
    canUseTool(toolId: string): boolean {
      // Check disabled first
      if (this.disabledTools?.includes(toolId)) return false;
      // If tools list specified, check inclusion
      if (this.tools && this.tools.length > 0) {
        return this.tools.includes(toolId) || this.tools.includes('*');
      }
      // Default: allow all
      return true;
    },
  };
}

// Load agent prompts from .txt files via the system module.
// Each prompt is loaded once at module init time.
const codeAgentPrompt = getAgentPrompt('code');
const debugAgentPrompt = getAgentPrompt('debug');
const planAgentPrompt = getAgentPrompt('plan');
const exploreAgentPrompt = getAgentPrompt('explore');
const orchestratorPrompt = getAgentPrompt('orchestrator');

// Built-in agents
export const builtInAgents: AgentConfig[] = [
  {
    id: 'code',
    name: 'Code Agent',
    description: 'General-purpose coding agent for implementation tasks',
    mode: 'all',
    systemPrompt: codeAgentPrompt,
    aliases: ['c', 'default'],
  },
  {
    id: 'debug',
    name: 'Debug Agent',
    description: 'Specialized for debugging and fixing issues',
    mode: 'all',
    systemPrompt: debugAgentPrompt,
    aliases: ['d', 'fix'],
  },
  {
    id: 'plan',
    name: 'Plan Agent',
    description: 'Creates detailed implementation plans',
    mode: 'all',
    systemPrompt: planAgentPrompt,
    aliases: ['p', 'architect'],
    tools: ['read', 'glob', 'grep', 'webfetch'], // Read-only tools
  },
  {
    id: 'explore',
    name: 'Explore Agent',
    description: 'Fast codebase exploration and search',
    mode: 'subagent',
    systemPrompt: exploreAgentPrompt,
    aliases: ['e', 'search'],
    tools: ['read', 'glob', 'grep'],
    temperature: 0.2, // Lower temperature for factual responses
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    description: 'Coordinates work across multiple agents',
    mode: 'primary',
    systemPrompt: orchestratorPrompt,
    aliases: ['o', 'main'],
    tools: ['task'], // Can only delegate
  },
];

// Agent registry
class AgentRegistry {
  private agents: Map<string, Agent> = new Map();
  private aliasMap: Map<string, string> = new Map();
  private currentAgentId: string = 'code';

  constructor() {
    // Register built-in agents
    for (const config of builtInAgents) {
      this.register(config);
    }
  }

  /**
   * Register an agent
   */
  register(config: AgentConfig): Agent {
    const validated = AgentSchema.parse(config);

    // Populate displayName from org mode options if available
    if (
      validated.options?.displayName &&
      typeof validated.options.displayName === 'string' &&
      !validated.displayName
    ) {
      validated.displayName = validated.options.displayName;
    }

    const agent = createAgent(validated);
    this.agents.set(agent.id, agent);

    // Register aliases
    if (agent.aliases) {
      for (const alias of agent.aliases) {
        this.aliasMap.set(alias.toLowerCase(), agent.id);
      }
    }
    // Also register id as alias
    this.aliasMap.set(agent.id.toLowerCase(), agent.id);

    return agent;
  }

  /**
   * Get agent by id or alias
   */
  get(idOrAlias: string): Agent | undefined {
    const id = this.aliasMap.get(idOrAlias.toLowerCase()) ?? idOrAlias;
    return this.agents.get(id);
  }

  /**
   * Get current agent
   */
  getCurrent(): Agent {
    return this.agents.get(this.currentAgentId) ?? this.agents.get('code')!;
  }

  /**
   * Switch to a different agent
   */
  switchTo(idOrAlias: string, reason?: string): Agent | null {
    const agent = this.get(idOrAlias);
    if (!agent) return null;

    const fromId = this.currentAgentId;
    this.currentAgentId = agent.id;

    // Publish event
    AgentSwitched.publish({
      from: fromId,
      to: agent.id,
      reason,
      timestamp: Date.now(),
    });

    return agent;
  }

  /**
   * List all agents
   */
  list(mode?: AgentMode): Agent[] {
    const agents = Array.from(this.agents.values());
    if (mode) {
      return agents.filter((a) => a.mode === mode || a.mode === 'all');
    }
    return agents;
  }

  /**
   * Remove an agent by id or alias
   * Prevents removal of built-in and organization-managed agents
   */
  remove(idOrAlias: string): boolean {
    const agent = this.get(idOrAlias);
    if (!agent) {
      throw new Error(`Agent not found: ${idOrAlias}`);
    }

    // Check if this is a built-in agent
    const isBuiltIn = builtInAgents.some((a) => a.id === agent.id);
    if (isBuiltIn) {
      throw new Error(`Cannot remove built-in agent: ${agent.id}`);
    }

    // Prevent removal of organization-managed agents
    if (agent.options?.source === 'organization') {
      throw new Error(
        `Cannot remove organization agent — manage it from the cloud dashboard: ${agent.id}`
      );
    }

    // Remove the agent
    this.agents.delete(agent.id);

    // Remove aliases
    if (agent.aliases) {
      for (const alias of agent.aliases) {
        this.aliasMap.delete(alias.toLowerCase());
      }
    }
    this.aliasMap.delete(agent.id.toLowerCase());

    return true;
  }

  /**
   * Parse @syntax from message and switch if found
   * Returns the cleaned message
   */
  parseAndSwitch(message: string): { message: string; switched: boolean; agent?: Agent } {
    // Match @agent at start of message
    const match = message.match(/^@(\w+)\s*(.*)$/s);
    if (!match) {
      return { message, switched: false };
    }

    const [, agentRef, rest] = match;
    const agent = this.get(agentRef);

    if (agent) {
      this.switchTo(agent.id, `User requested via @${agentRef}`);
      return { message: rest.trim() || message, switched: true, agent };
    }

    // Unknown agent reference, keep original message
    return { message, switched: false };
  }
}

// Global registry instance
let globalRegistry: AgentRegistry | null = null;

export function getAgentRegistry(): AgentRegistry {
  if (!globalRegistry) {
    globalRegistry = new AgentRegistry();
  }
  return globalRegistry;
}

export function getCurrentAgent(): Agent {
  return getAgentRegistry().getCurrent();
}

export function switchAgent(idOrAlias: string, reason?: string): Agent | null {
  return getAgentRegistry().switchTo(idOrAlias, reason);
}

export function removeAgent(idOrAlias: string): boolean {
  return getAgentRegistry().remove(idOrAlias);
}

export function parseAgentSwitch(message: string): {
  message: string;
  switched: boolean;
  agent?: Agent;
} {
  return getAgentRegistry().parseAndSwitch(message);
}

/**
 * Parse @mention from message without switching
 * Returns agent ID and cleaned message
 */
export function parseAgentMention(message: string): {
  agentId: string | null;
  cleanMessage: string;
} {
  const match = message.match(/^@(\w+)\s*(.*)$/s);
  if (!match) {
    return { agentId: null, cleanMessage: message };
  }

  const [, agentRef, rest] = match;
  const registry = getAgentRegistry();
  const agent = registry.get(agentRef);

  if (agent) {
    return { agentId: agent.id, cleanMessage: rest.trim() || message };
  }

  return { agentId: null, cleanMessage: message };
}

/**
 * Read-only bash commands for the ask agent and plan mode.
 * Unlike the default bash allowlist, unknown commands are DENIED (not "ask")
 * because the ask agent must never modify the filesystem.
 */
const readOnlyBash: Record<string, 'allow' | 'ask' | 'deny'> = {
  '*': 'deny',
  // read-only / informational
  'cat *': 'allow',
  'head *': 'allow',
  'tail *': 'allow',
  'less *': 'allow',
  'ls *': 'allow',
  'tree *': 'allow',
  'pwd *': 'allow',
  'echo *': 'allow',
  'wc *': 'allow',
  'which *': 'allow',
  'type *': 'allow',
  'file *': 'allow',
  'diff *': 'allow',
  'du *': 'allow',
  'df *': 'allow',
  'date *': 'allow',
  'uname *': 'allow',
  'whoami *': 'allow',
  'printenv *': 'allow',
  'man *': 'allow',
  // text processing (stdout only, no file modification)
  'grep *': 'allow',
  'rg *': 'allow',
  'ag *': 'allow',
  'sort *': 'allow',
  'uniq *': 'allow',
  'cut *': 'allow',
  'awk *': 'allow',
  'sed *': 'allow',
  'tr *': 'allow',
  'jq *': 'allow',
  'yq *': 'allow',
  // git read-only commands
  'git status *': 'allow',
  'git log *': 'allow',
  'git diff *': 'allow',
  'git show *': 'allow',
  'git branch --list *': 'allow',
  'git tag --list *': 'allow',
  'git remote -v *': 'allow',
  'git rev-parse *': 'allow',
  'git ls-files *': 'allow',
  'git ls-tree *': 'allow',
  'git blame *': 'allow',
  'git shortlog *': 'allow',
  // explicitly deny git write operations
  'git add *': 'deny',
  'git commit *': 'deny',
  'git push *': 'deny',
  'git pull *': 'deny',
  'git checkout *': 'deny',
  'git merge *': 'deny',
  'git rebase *': 'deny',
  'git reset *': 'deny',
  'git stash *': 'deny',
};

/**
 * Get bash rules for the ask agent (read-only commands only)
 */
export function getAskAgentBashRules(): Record<string, 'allow' | 'ask' | 'deny'> {
  return readOnlyBash;
}
