/**
 * Agent System
 * Defines specialized agents with different capabilities and prompts
 * Based on kilocode/opencode agent patterns with @syntax for switching
 */
import { z } from 'zod';

import { AgentSwitched } from '../bus/index.js';
import { getAgentPrompt } from './system.js';
import { loadAllCustomAgents } from './customAgentLoader.js';

// Agent mode - determines when agent is available
export type AgentMode = 'primary' | 'subagent' | 'all';

// Agent schema for validation
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string().optional(), // Human-readable name for org modes
  source: z.string().optional(), // New field for source metadata
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

/**
 * Agent-metadata keys that must NEVER be forwarded to `provider.complete()` or
 * `provider.streamComplete()`. These fields describe the agent itself (its
 * identity, prompt, mode, aliases, tool allowlist, source origin, reference
 * resolution state) and have no meaning to SAP AI Core / SAP Orchestration.
 *
 * Some SAP orchestration paths reject unknown options; others silently pass
 * them through to the model. Either way, leaking agent metadata into request
 * options is a bug. This deny-list is the source of truth for `stripInternalOptions`.
 *
 * If you add a new field to `AgentSchema` that is NOT a legitimate
 * `CompletionOptions` field (see `src/providers/sapOrchestration.ts`), add it
 * here too and update the JSDoc on `stripInternalOptions`.
 *
 * Notable exclusions:
 * - `preferredModel` on the agent is consumed by callers to pick the model
 *   BEFORE dispatch (see `agenticChat.ts`), never as a provider option, so it
 *   is included here as internal.
 * - `tools` is intentionally NOT in this list: on the agent it means "allowed
 *   tool names" (string[]) but on `CompletionOptions` it means "tool schemas"
 *   (ChatCompletionTool[]). The two must never share an options bag; callers
 *   must never spread `AgentConfig` into `CompletionOptions` directly.
 */
export const INTERNAL_OPTION_KEYS = [
  'id',
  'name',
  'displayName',
  'description',
  'source',
  'reference',
  'resolved',
  'mode',
  'systemPrompt',
  'deprecated',
  'disabledTools',
  'aliases',
  'preferredModel',
] as const;

const internal: ReadonlySet<string> = new Set(INTERNAL_OPTION_KEYS);

/**
 * Strip agent-metadata keys from an options-like object before forwarding it to
 * `provider.complete()` / `provider.streamComplete()`.
 *
 * ## When to use
 *
 * Call this whenever an options bag passed to a provider MIGHT contain agent
 * metadata. That happens when a caller constructs `CompletionOptions` by
 * merging in fields from an `AgentConfig` (for example carrying
 * `source: 'user' | 'org'` provenance alongside real request options, or
 * spreading an org-managed agent's `options` blob into the request).
 *
 * As of this writing (2026-07-04), the built-in dispatch sites in
 * `src/core/agenticChat.ts`, `src/core/streamingOrchestrator.ts`, and
 * `src/core/orchestrator.ts` construct `CompletionOptions` explicitly with only
 * legitimate provider fields (`maxTokens`, `temperature`, `signal`, `tools`,
 * `headers`), so they do NOT need to call this helper. If you introduce a new
 * dispatch site that merges agent metadata into the options bag, you MUST call
 * `stripInternalOptions` on the merged bag before passing it to the provider.
 *
 * The deny-list is `INTERNAL_OPTION_KEYS`; see its JSDoc for what is stripped
 * and why. Non-listed keys (including all legitimate `CompletionOptions`
 * fields) are preserved with their original values, including `undefined`.
 */
export function stripInternalOptions(options: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in options) {
    if (internal.has(key)) {
      continue;
    }
    result[key] = options[key];
  }
  return result;
}

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
   * Load custom agents from user-global and project-local directories.
   * Custom agents are registered after built-in agents; duplicates overwrite.
   * Returns the number of custom agents loaded.
   */
  async loadCustomAgents(workdir?: string): Promise<number> {
    const customAgents = await loadAllCustomAgents(workdir);
    let count = 0;

    for (const config of customAgents) {
      try {
        this.register(config);
        count++;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        // eslint-disable-next-line no-console
        console.warn(`[agent-registry] Failed to register custom agent '${config.id}': ${message}`);
      }
    }

    return count;
  }

  /**
   * List only custom (non-built-in) agents.
   */
  listCustom(): Agent[] {
    const builtInIds = new Set(builtInAgents.map((a) => a.id));
    return this.list().filter((a) => !builtInIds.has(a.id));
  }

  /**
   * Check if an agent is a custom (non-built-in) agent.
   */
  isCustomAgent(idOrAlias: string): boolean {
    const agent = this.get(idOrAlias);
    if (!agent) return false;
    return !builtInAgents.some((a) => a.id === agent.id);
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
