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
  /**
   * True when this agent is the built-in shipped default (not a user override
   * or a custom agent). Only built-in native agents receive plan-mode edit
   * ceilings from `hardenPlan`; custom agents named `plan` or `architect` are
   * governed by their own permission config. Ports upstream kilocode fix
   * #13581 / #13590 — the previous name-only check made custom `architect`
   * agents' edit permissions unreachable because the plan-guard was appended
   * after their rules and last-match-wins swallowed their allows.
   */
  native: z.boolean().optional(),
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
  'native',
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
 * As of 2026-07-14, the runtime dispatch paths in `src/core/agenticChat.ts`
 * and `src/core/streamingOrchestrator.ts` call this helper defense-in-depth
 * on every `provider.complete(...)` / `provider.streamComplete(...)`
 * invocation. Even though those sites currently construct options with only
 * legitimate provider fields (`maxTokens`, `temperature`, `signal`, `tools`,
 * `headers`), the strip guarantees that any future merge accidentally pulling
 * in agent metadata will not leak through to SAP AI Core / SAP Orchestration.
 *
 * If you introduce a new dispatch site, you MUST call `stripInternalOptions`
 * on the merged options bag before passing it to the provider — the JSDoc on
 * `INTERNAL_OPTION_KEYS` describes what is stripped and why.
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
    // Marks this as the built-in native plan agent. `hardenPlan` applies its
    // read-only edit ceiling ONLY to native plan agents so custom user agents
    // named `plan` or `architect` retain full control over their own edit
    // permissions (ports upstream kilocode fixes #13581 / #13590).
    native: true,
  },
  {
    id: 'explore',
    name: 'Explore Agent',
    // kilocode #13759 — spell out the bash allowlist restriction so the
    // router/orchestrator picks a different subagent when a read-only task
    // needs shell commands outside the allowlist, instead of dead-ending
    // on `gh` / `find` / test-runner invocations the explore agent cannot run.
    description:
      'Fast codebase exploration and search. Bash is limited to an allowlist of ' +
      'read-only commands. For required scripts, tests, or binary-analysis commands ' +
      'outside that allowlist, select an available agent whose permissions allow ' +
      'them while preserving the requested no-change scope.',
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
  /**
   * Marker describing the most recent unconsumed `switchTo` call. On the next
   * outbound user turn, orchestrators consume this marker and prepend a
   * `<agent_switch from="X" to="Y"/>` tag to the user message content so the
   * destination agent's model can see that a handover happened.
   *
   * Semantics:
   * - `switchTo(...)` REPLACES the pending marker (last-writer-wins). If two
   *   switches happen back-to-back with no consume in between, only the
   *   second switch's `from`/`to` are surfaced. This intentionally collapses
   *   rapid ping-pong into a single marker on the first upcoming user turn.
   * - `consumePendingSwitchMarker()` atomically returns and clears the value.
   * - In-memory only. A process restart clears the pending state naturally.
   */
  private pendingSwitchMarker: { from: string; to: string } | null = null;
  /**
   * Most-recent non-`ask` agent id seen before switching *into* `ask`. Used
   * by `restorePreviousAgent` so that leaving `ask` returns to the caller's
   * prior working agent (typically `code`) instead of resetting to default.
   *
   * Ports upstream kilocode commit `e2966abcb` — "preserve Code agent when
   * switching from Ask" — which fixed a UX bug where the user had to
   * manually reselect their coding agent after every Ask handoff.
   */
  private preAskAgentId: string | null = null;

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
   *
   * Bookkeeping: when the caller switches INTO the `ask` agent, the current
   * (non-`ask`) agent id is remembered in `preAskAgentId` so that
   * `restorePreviousAgent` can send the user back to their working agent
   * when they leave Ask. Consecutive switches into `ask` do NOT overwrite an
   * existing `preAskAgentId` — otherwise a rapid `code → ask → ask` sequence
   * would lose the original `code` context.
   */
  switchTo(idOrAlias: string, reason?: string): Agent | null {
    const agent = this.get(idOrAlias);
    if (!agent) return null;

    const fromId = this.currentAgentId;

    // Remember the pre-Ask working agent on the transition INTO Ask so a
    // subsequent leave-Ask restore returns to the same coding context.
    // See kilocode e2966abcb.
    if (agent.id === 'ask' && fromId !== 'ask') {
      this.preAskAgentId = fromId;
    } else if (agent.id !== 'ask' && fromId !== 'ask') {
      // Any non-Ask ↔ non-Ask switch invalidates the stale marker so we do
      // not "restore" the user to something they no longer expect.
      this.preAskAgentId = null;
    }

    this.currentAgentId = agent.id;

    // Stamp a pending marker so the next outbound user turn can inform the
    // destination model that a handover happened. Last-writer-wins: if a
    // previous marker is unconsumed, it is overwritten (see field JSDoc).
    this.pendingSwitchMarker = { from: fromId, to: agent.id };

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
   * Restore the pre-Ask working agent when leaving the Ask agent. Returns
   * `null` if the current agent is not `ask`, no pre-Ask agent was recorded,
   * or the recorded agent is no longer registered.
   *
   * Callers use this from the UI/switch handler:
   *
   *   if (currentAgent.id === 'ask') {
   *     const restored = registry.restorePreviousAgent();
   *     if (restored) return restored;
   *   }
   *   // fall through to default switch behaviour
   *
   * Ports upstream kilocode commit `e2966abcb`.
   */
  restorePreviousAgent(reason?: string): Agent | null {
    if (this.currentAgentId !== 'ask') return null;
    const prevId = this.preAskAgentId;
    if (!prevId) return null;
    const prev = this.agents.get(prevId);
    if (!prev) {
      // Stale reference (agent was removed). Clear the marker and bail.
      this.preAskAgentId = null;
      return null;
    }
    this.preAskAgentId = null;
    return this.switchTo(prev.id, reason ?? 'Restored pre-Ask agent');
  }

  /**
   * Atomically return the pending switch marker and clear it. Callers
   * (agenticChat, streamingOrchestrator) invoke this immediately before
   * appending the outbound user message, and if the return value is
   * non-null they prepend `<agent_switch from="X" to="Y"/>\n\n` to the
   * user content.
   */
  consumePendingSwitchMarker(): { from: string; to: string } | null {
    const marker = this.pendingSwitchMarker;
    this.pendingSwitchMarker = null;
    return marker;
  }

  /**
   * Non-destructive peek at the pending switch marker. Intended for tests
   * and diagnostics; production callers should use `consumePendingSwitchMarker`
   * to guarantee the marker is emitted only once per switch.
   */
  peekPendingSwitchMarker(): { from: string; to: string } | null {
    return this.pendingSwitchMarker;
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

/**
 * Restore the pre-Ask agent when currently on `ask`. See
 * `AgentRegistry.restorePreviousAgent` for semantics. Ports upstream kilocode
 * `e2966abcb`.
 */
export function restorePreviousAgent(reason?: string): Agent | null {
  return getAgentRegistry().restorePreviousAgent(reason);
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
 * Shared read-only bash allow entries.
 *
 * Ports upstream kilocode commit `e096d3ab7` (`refactor(cli): share common
 * bash permission entries`), which deduplicated the read-only allow list
 * between the default `bash` and `readOnlyBash` maps. Alexi only exposes
 * `readOnlyBash` today, but extracting this constant means callers that
 * need "just the pure read-only allow set" (without the git-deny rules
 * baked into `readOnlyBash`) can reuse it directly, and any new
 * read-only command is added in ONE place instead of drifting between
 * mirrored maps.
 *
 * ONLY commands whose *default* mode reads from the filesystem / writes
 * to stdout should live here. Some entries (`sed *`, `awk *`) DO have
 * in-place-mutate flags (`sed -i`, `awk -i inplace`); these are inherited
 * from the pre-existing `readOnlyBash` allow-list and are accepted
 * because a downstream `bash` tool with a stricter deny-list (or an
 * explicit user rule) still gates the actual invocation. Do not add
 * genuinely destructive commands (`rm`, `mv`, `dd`) to this map.
 */
const readable: Record<string, 'allow'> = {
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
};

/**
 * Read-only bash commands for the ask agent and plan mode.
 * Unlike the default bash allowlist, unknown commands are DENIED (not "ask")
 * because the ask agent must never modify the filesystem.
 */
const readOnlyBash: Record<string, 'allow' | 'ask' | 'deny'> = {
  '*': 'deny',
  ...readable,
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

/**
 * Bash rules for the `explore` subagent.
 *
 * The explore agent is a *delegated* subagent — it cannot answer permission
 * prompts, so any `ask` rule effectively behaves like a `deny`. It is also
 * strictly read-only, so it must never be able to reach out to `gh` (which
 * can mutate GitHub state) or `find` (which mutates the filesystem via
 * `-delete` / `-exec`). Prefer `glob`/`list` over `find`.
 *
 * Ported from upstream kilocode commit 3a99f36d9 (`hardenExplore`). Any
 * caller merging bash permissions for the explore agent MUST use this
 * table instead of `readOnlyBash` directly.
 */
const exploreBash: Record<string, 'allow' | 'ask' | 'deny'> = {
  ...readOnlyBash,
  // Explore runs as a delegated agent, so it cannot answer permission prompts.
  'gh *': 'deny',
  // `find` can mutate through `-delete` and `-exec`; use glob/list instead.
  'find *': 'deny',
};

/**
 * Get bash rules for the `explore` subagent.
 *
 * Callers that construct a permission ruleset for a delegated `explore`
 * subagent should merge this table on top of any user-supplied denies
 * (hardening is a *ceiling* — stricter denies take precedence). See
 * upstream kilocode `hardenExplore` for the reference semantics.
 */
export function getExploreAgentBashRules(): Record<string, 'allow' | 'ask' | 'deny'> {
  return exploreBash;
}

/**
 * Return `true` when the given agent id (or alias resolvable via the
 * registry) is the built-in `explore` subagent. Callers use this to gate
 * the stricter bash allow-list returned by `getExploreAgentBashRules`.
 */
export function isExploreAgent(idOrAlias: string): boolean {
  const agent = getAgentRegistry().get(idOrAlias);
  return agent?.id === 'explore';
}

/**
 * Apply plan-mode edit ceilings to an agent's ruleset.
 *
 * Ports upstream kilocode fix #13581 / #13590 (commit context: plan-mode
 * hardening restricted to native plan agent only). Previously, any agent
 * named `plan` OR `architect` had plan-mode edit ceilings appended to its
 * ruleset. Because permissions use last-match-wins semantics, this made
 * custom `architect` agents' edit `allow` rules unreachable — the guard
 * always appended a stricter rule after them with no opt-out.
 *
 * The fix restricts the ceiling to the built-in native plan agent only:
 *
 *   - `key !== 'plan'` — architect and other custom names are skipped.
 *   - `item.native !== true` — a user override that reuses the `plan` key
 *     but sets its own permissions is treated as a custom agent (its
 *     `native` flag is not carried over from the built-in registration).
 *   - A custom `agent.plan` config that reuses the built-in object keeps
 *     `native: true` and the ceiling still applies — this matches the
 *     upstream semantics for "plan agent config extends the built-in".
 *
 * @param key - Agent registry key (typically the agent id).
 * @param item - Agent-like object; must expose `native?: boolean` and be
 *   mutated in place by the caller when the ceiling should apply.
 * @param apply - Callback invoked with `item` when the ceiling should be
 *   applied. Callers use this to merge their plan-mode restriction rules
 *   into `item.permission` / `item.disabledTools` / etc. When the guard
 *   short-circuits (custom agent path), the callback is NOT invoked.
 */
export function hardenPlan<T extends { native?: boolean }>(
  key: string,
  item: T,
  apply: (item: T) => void
): void {
  // Plan-mode edit restrictions are a ceiling for the built-in plan agent only.
  // Custom agents named `architect` are governed by their own permission config;
  // the previous name check appended the guard after their rules, so last-match-
  // wins made their edit allows unreachable with no opt-out (#13581). A custom
  // `agent.plan` config reuses the built-in object, so `native` stays true and
  // the ceiling still applies there.
  if (key !== 'plan') return;
  if (item.native !== true) return;
  apply(item);
}
