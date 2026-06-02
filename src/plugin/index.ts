/**
 * Plugin System
 * Extensible plugin architecture for Alexi
 * Supports tools, skills, commands, and event hooks
 */

import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { pathToFileURL } from 'url';
import { defineEvent, type BusEvent } from '../bus/index.js';
import { type Tool, type ToolDefinition, registerTool } from '../tool/index.js';
import { type SkillDefinition, registerSkill } from '../skill/index.js';
import { registerCommand, defineCommand, loadCommandFromFile } from '../command/index.js';
import { runRuleCommandLenient } from './ruleCommandRunner.js';
import logger from '../utils/logger.js';

// ============ Plugin Events ============

export const PluginLoaded = defineEvent(
  'plugin.loaded',
  z.object({
    name: z.string(),
    version: z.string(),
    timestamp: z.number(),
  })
);

export const PluginUnloaded = defineEvent(
  'plugin.unloaded',
  z.object({
    name: z.string(),
    timestamp: z.number(),
  })
);

export const PluginHookExecuted = defineEvent(
  'plugin.hook.executed',
  z.object({
    pluginName: z.string(),
    hookName: z.string(),
    duration: z.number(),
    timestamp: z.number(),
  })
);

export const PluginError = defineEvent(
  'plugin.error',
  z.object({
    pluginName: z.string(),
    error: z.string(),
    context: z.string().optional(),
    timestamp: z.number(),
  })
);

// ============ Type Definitions ============

// Hook argument types
export interface ToolExecuteArgs {
  toolName: string;
  parameters: Record<string, unknown>;
  context: {
    workdir: string;
    sessionId?: string;
  };
}

export interface ToolExecuteResult {
  toolName: string;
  parameters: Record<string, unknown>;
  result: unknown;
  duration: number;
  success: boolean;
  error?: string;
}

export interface MessageArgs {
  sessionId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface SessionArgs {
  sessionId: string;
  modelId?: string;
  timestamp: number;
}

export interface SessionIdleArgs {
  sessionId: string;
  duration: number;
  timestamp: number;
}

export interface AgentSwitchArgs {
  from?: string;
  to: string;
  reason?: string;
  timestamp: number;
}

// Hook handler type
export type HookHandler<T = any, R = T | void> = (args: T) => Promise<R>;

// Plugin hooks interface
export interface PluginHooks {
  // Tool execution hooks
  'tool.execute.before'?: HookHandler<ToolExecuteArgs, ToolExecuteArgs | void>;
  'tool.execute.after'?: HookHandler<ToolExecuteResult, void>;

  // Message hooks
  'message.send.before'?: HookHandler<MessageArgs, MessageArgs | void>;
  'message.receive.after'?: HookHandler<MessageArgs, void>;

  // Session hooks
  'session.create'?: HookHandler<SessionArgs, void>;
  'session.end'?: HookHandler<SessionArgs, void>;
  'session.idle'?: HookHandler<SessionIdleArgs, void>;

  // Agent hooks
  'agent.switch'?: HookHandler<AgentSwitchArgs, void>;

  // Custom hooks (string index signature for extensibility)
  [key: string]: HookHandler | undefined;
}

// Logger interface for plugins
export interface PluginLogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

// Event bus access for plugins (restricted interface)
export interface EventBusAccess {
  subscribe<T>(event: BusEvent<T>, handler: (payload: T) => void | Promise<void>): () => void;
  publish<T>(event: BusEvent<T>, payload: T): void;
}

// Plugin configuration
export interface PluginConfig {
  [key: string]: unknown;
}

// Command definition for plugins
export interface CommandDefinition {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
    default?: string;
  }>;
  template: string;
}

// Plugin context provided to plugins
export interface PluginContext {
  // Plugin can access these
  eventBus: EventBusAccess;
  config: PluginConfig;
  logger: PluginLogger;

  // Register additional features dynamically
  registerTool(tool: ToolDefinition<any, any>): void;
  registerSkill(skill: SkillDefinition): void;
  registerCommand(command: CommandDefinition): void;

  // Access to other plugins
  getPlugin(name: string): Plugin | undefined;

  // Working directory
  workdir: string;
}

// Plugin interface
export interface Plugin {
  // Metadata
  name: string;
  version: string;
  description?: string;
  author?: string;

  // Lifecycle hooks
  onLoad?(context: PluginContext): Promise<void> | void;
  onUnload?(context: PluginContext): Promise<void> | void;

  // Feature registration
  tools?: ToolDefinition<any, any>[];
  skills?: SkillDefinition[];
  commands?: CommandDefinition[];

  // Event hooks
  hooks?: PluginHooks;

  // Dependencies
  dependencies?: string[];
}

// Plugin configuration for definePlugin
export interface PluginDefinitionConfig {
  name: string;
  version: string;
  description?: string;
  author?: string;

  // Optional: dependencies on other plugins
  dependencies?: string[];

  // Feature definitions
  tools?: ToolDefinition<any, any>[];
  skills?: SkillDefinition[];
  commands?: CommandDefinition[];
  hooks?: PluginHooks;

  // Lifecycle
  setup?: (ctx: PluginContext) => Promise<void> | void;
  teardown?: (ctx: PluginContext) => Promise<void> | void;
}

// Load result
export interface LoadResult {
  success: boolean;
  pluginName: string;
  error?: string;
  warnings?: string[];
}

// Enable result
export interface EnableResult {
  success: boolean;
  pluginName: string;
  error?: string;
  enabledDependencies?: string[];
}

// Disable result
export interface DisableResult {
  success: boolean;
  pluginName: string;
  error?: string;
}

// Plugin info for listing
export interface PluginInfo {
  name: string;
  version: string;
  description?: string;
  author?: string;
  enabled: boolean;
  loadedAt: number;
  toolCount: number;
  skillCount: number;
  commandCount: number;
  hookCount: number;
}

// Internal plugin state
interface PluginState {
  plugin: Plugin;
  context: PluginContext;
  enabled: boolean;
  loadedAt: number;
  registeredTools: string[];
  registeredSkills: string[];
  registeredCommands: string[];
  hookSubscriptions: Array<() => void>;
  /**
   * Resolved rule contributions from this plugin's manifest. Empty for plugins
   * loaded via `load()` / `loadFromFile()` (i.e. JS plugins) since they don't
   * yet expose a `rules` surface — only manifest-declared rules are tracked.
   */
  resolvedRules: ResolvedPluginRule[];
}

// ============ Default Plugin Directories ============

export const PLUGIN_DIRS = [
  path.join(os.homedir(), '.alexi', 'plugins'), // Global plugins
  path.join(process.cwd(), '.alexi', 'plugins'), // Project plugins
];

// ============ Plugin Manifest (plugin.json) ============

/**
 * Maximum number of bytes a single resolved rule may contribute to the system
 * prompt. Rules exceeding this size are truncated with a clear marker.
 */
export const PLUGIN_RULE_MAX_BYTES = 32 * 1024;

/** Truncation marker appended to a rule whose resolved content exceeded the cap. */
export const PLUGIN_RULE_TRUNCATION_MARKER =
  '\n\n[... truncated: rule content exceeded 32 KB cap ...]';

/**
 * Default timeout (in ms) for `source: 'command'` rules when none is specified.
 */
export const PLUGIN_RULE_COMMAND_DEFAULT_TIMEOUT_MS = 5_000;

/**
 * Maximum permitted value for a `source: 'command'` rule's `timeoutMs`. Keeps
 * a misbehaving plugin from stalling system-prompt assembly indefinitely.
 */
export const PLUGIN_RULE_COMMAND_MAX_TIMEOUT_MS = 30_000;

/**
 * Zod schema for an `inline` rule declaration. Content lives directly in
 * `plugin.json` via the `content` field.
 *
 * Inline rules are mutually exclusive with `file` and `command` rules — a
 * single rule entry must declare exactly one source. The discriminator is
 * the `source` literal, which keeps the union variants statically distinct.
 */
const InlineRuleSchema = z
  .object({
    name: z.string().min(1),
    scope: z.enum(['session', 'always']).default('always'),
    source: z.literal('inline'),
    content: z.string(),
  })
  .strict();

/**
 * Zod schema for a `file` rule declaration. Content is read from `path`,
 * resolved against the plugin root with a `..` escape guard at load time.
 */
const FileRuleSchema = z
  .object({
    name: z.string().min(1),
    scope: z.enum(['session', 'always']).default('always'),
    source: z.literal('file'),
    path: z.string().min(1),
  })
  .strict();

/**
 * Zod schema for a `command` rule declaration. Content is produced by
 * spawning `argv` (shell-free) inside the plugin root, with strict
 * timeout, stdout-cap, and env-scrub bounds.
 *
 * Defaults (per parent tracker #633 / B003):
 *   - `scope` defaults to `'session'` so a freshly-spawned command rule
 *     observes session-scoped state, but is re-evaluated for each new
 *     session unless a plugin opts into `'always'` for process-lifetime
 *     caching.
 *   - `timeoutMs` defaults to 5_000 ms and is capped at 30_000 ms.
 *
 * Mutual exclusion with `inline`/`file` is enforced by the discriminated
 * union: a `command` rule cannot carry `content` or `path` fields and a
 * non-`command` rule cannot carry `argv` / `timeoutMs` / `maxBytes`.
 */
const CommandRuleSchema = z
  .object({
    name: z.string().min(1),
    scope: z.enum(['session', 'always']).default('session'),
    source: z.literal('command'),
    /** Argv array. `argv[0]` is the binary, `argv.slice(1)` are arguments. */
    argv: z.array(z.string()).min(1),
    /**
     * Optional per-rule timeout override. Bounded at 30_000 ms so a misbehaving
     * plugin can't stall system-prompt assembly indefinitely.
     */
    timeoutMs: z
      .number()
      .int()
      .positive()
      .max(PLUGIN_RULE_COMMAND_MAX_TIMEOUT_MS)
      .default(PLUGIN_RULE_COMMAND_DEFAULT_TIMEOUT_MS),
    /** Optional override of the per-rule 32 KB stdout cap (in bytes). */
    maxBytes: z.number().int().positive().optional(),
  })
  .strict();

/**
 * Zod schema for a `PluginRule` declaration in `plugin.json`.
 *
 * A rule ships markdown that gets injected into the agent's system prompt
 * when the plugin is enabled. Three source types are supported:
 *
 *   - `inline`:  content lives inline in `plugin.json` (`content` field).
 *   - `file`:    content is read from `path` resolved against the plugin root.
 *   - `command`: content is produced by spawning `argv` (no shell) inside
 *                the plugin root. See `runRuleCommand` for safety bounds.
 *
 * Variants are a Zod discriminated union over `source` — fields from one
 * source cannot be mixed with another (e.g. a `command` rule cannot carry
 * `content` / `path`, and inline/file rules cannot carry `argv`).
 */
export const PluginRuleSchema = z.discriminatedUnion('source', [
  InlineRuleSchema,
  FileRuleSchema,
  CommandRuleSchema,
]);

export type PluginRule = z.infer<typeof PluginRuleSchema>;

/**
 * A `PluginRule` whose declared source has been materialized — the `content`
 * field is guaranteed populated for `inline` and `file` sources, with the
 * 32 KB cap applied. Consumed by the system-prompt assembler.
 *
 * For `command` sources, materialization is deferred to prompt-assembly time
 * (so we can look up the per-session cache and respect `scope`); a deferred
 * descriptor is carried through alongside the resolved metadata.
 */
export interface ResolvedPluginRule {
  /** Plugin that contributed the rule. */
  pluginName: string;
  /** Rule identifier (unique within a plugin). */
  name: string;
  /** Currently 'always' or 'session' — both included verbatim in the prompt today. */
  scope: 'session' | 'always';
  /** Original declared source ('inline', 'file', or 'command'). */
  source: 'inline' | 'file' | 'command';
  /**
   * Materialized rule content (already capped + truncation-marked). Empty
   * for unresolved `command` sources — callers should consult `command`
   * and run {@link materializeCommandRule} to obtain the dynamic content.
   */
  content: string;
  /**
   * For `command` sources, the spawn descriptor needed to materialize the
   * rule on demand. Always undefined for `inline` and `file` sources.
   */
  command?: {
    /** Working directory for the spawn (typically the plugin root). */
    pluginRoot: string;
    /** Argv array. `argv[0]` is the binary, `argv.slice(1)` are arguments. */
    argv: string[];
    /** Per-rule timeout override (defaults to 5000 ms, capped at 30_000 ms). */
    timeoutMs?: number;
    /** Per-rule stdout cap override (defaults to 32 KB). */
    maxBytes?: number;
  };
}

/**
 * Zod schema for `plugin.json` manifests located under
 * `.alexi/skills/<name>/plugin.json` (project) or `~/.alexi/skills/<name>/plugin.json`
 * (global). The shape mirrors `definePlugin`'s static-feature surface — runtime
 * `setup`/`teardown` and JS-defined hooks are out of scope for the JSON format.
 */
export const PluginManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().optional(),
  author: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  /**
   * Relative paths (from the plugin root) to markdown command files. Each file
   * is loaded via `loadCommandFromFile` so the same frontmatter conventions as
   * project commands apply.
   */
  commands: z.array(z.string()).optional(),
  /**
   * Markdown rule contributions injected into the agent's system prompt when
   * the plugin is enabled. See `PluginRuleSchema` for the per-rule shape.
   */
  rules: z.array(PluginRuleSchema).optional(),
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

/**
 * Apply the per-rule 32 KB content cap. Truncation is byte-based so that
 * downstream prompt-size accounting doesn't have to re-measure.
 */
function capRuleContent(content: string): string {
  const buf = Buffer.from(content, 'utf-8');
  if (buf.byteLength <= PLUGIN_RULE_MAX_BYTES) {
    return content;
  }
  // Truncate at the byte boundary, then drop any trailing partial UTF-8
  // sequence so we never emit invalid encoding into the prompt.
  const sliced = buf.subarray(0, PLUGIN_RULE_MAX_BYTES).toString('utf-8');
  return sliced + PLUGIN_RULE_TRUNCATION_MARKER;
}

/**
 * Resolve a single declared `PluginRule` to its materialized content, applying
 * the path-escape guard for `file` sources and the 32 KB cap.
 *
 * Returns `{ ok: true, rule }` on success or `{ ok: false, error }` on failure
 * so callers can surface a warning without throwing.
 */
export function resolvePluginRule(
  pluginRoot: string,
  pluginName: string,
  rule: PluginRule
): { ok: true; rule: ResolvedPluginRule } | { ok: false; error: string } {
  if (rule.source === 'inline') {
    return {
      ok: true,
      rule: {
        pluginName,
        name: rule.name,
        scope: rule.scope,
        source: 'inline',
        content: capRuleContent(rule.content),
      },
    };
  }

  if (rule.source === 'file') {
    const resolved = path.resolve(pluginRoot, rule.path);
    const rel = path.relative(pluginRoot, resolved);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return {
        ok: false,
        error: `rule '${rule.name}' path '${rule.path}' escapes plugin root`,
      };
    }

    let raw: string;
    try {
      raw = fs.readFileSync(resolved, 'utf-8');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, error: `rule '${rule.name}' failed to read '${rule.path}': ${msg}` };
    }

    return {
      ok: true,
      rule: {
        pluginName,
        name: rule.name,
        scope: rule.scope,
        source: 'file',
        content: capRuleContent(raw),
      },
    };
  }

  // source === 'command'
  // Defer execution to prompt-assembly time so we can apply per-session
  // caching. The descriptor is carried verbatim — `runRuleCommand` does the
  // env-scrub / spawn-bounding.
  return {
    ok: true,
    rule: {
      pluginName,
      name: rule.name,
      scope: rule.scope,
      source: 'command',
      content: '',
      command: {
        pluginRoot,
        argv: rule.argv,
        timeoutMs: rule.timeoutMs,
        maxBytes: rule.maxBytes,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Command-rule cache + materialization
// ---------------------------------------------------------------------------

/**
 * Module-scope cache of command-rule outputs.
 *
 * Cache key shape:
 *   - `${pluginName}::${ruleName}::always`                  — process lifetime.
 *   - `${pluginName}::${ruleName}::session::${sessionId}`   — dropped on session close.
 *
 * Stored value is the *capped* rule content, ready to drop into the prompt.
 * Errors are not cached — a transient failure should re-run on the next
 * prompt assembly so a fixed environment can recover automatically.
 */
const commandRuleCache = new Map<string, string>();

/** Build a cache key from the rule's identity and effective scope. */
function commandRuleCacheKey(
  pluginName: string,
  ruleName: string,
  scope: 'session' | 'always',
  sessionId: string | undefined
): string {
  if (scope === 'always') {
    return `${pluginName}::${ruleName}::always`;
  }
  return `${pluginName}::${ruleName}::session::${sessionId ?? 'default'}`;
}

/**
 * Drop cache entries.
 *
 *   - With `sessionId` set: drop only entries scoped to that session.
 *   - Without `sessionId`: drop *all* entries (process-wide reset). Used by
 *     tests; production callers should always pass a session ID.
 */
export function clearRuleCommandCache(sessionId?: string): void {
  if (sessionId === undefined) {
    commandRuleCache.clear();
    return;
  }
  const suffix = `::session::${sessionId}`;
  for (const key of Array.from(commandRuleCache.keys())) {
    if (key.endsWith(suffix)) {
      commandRuleCache.delete(key);
    }
  }
}

/**
 * Resolve a single `command`-source rule, consulting the cache first. On
 * cache miss, the command is spawned via {@link runRuleCommand} and the
 * (capped) output is stored under the appropriate scope key.
 *
 * Truncation/timeout/non-zero exits emit a single `logger.warn` line — the
 * rule is still returned (potentially partial) so a flaky generator does
 * not silently disappear from the prompt.
 */
export async function materializeCommandRule(
  rule: ResolvedPluginRule,
  sessionId?: string
): Promise<string> {
  if (rule.source !== 'command' || !rule.command) {
    return rule.content;
  }

  const key = commandRuleCacheKey(rule.pluginName, rule.name, rule.scope, sessionId);
  const cached = commandRuleCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const result = await runRuleCommandLenient({
    pluginRoot: rule.command.pluginRoot,
    command: rule.command.argv,
    timeoutMs: rule.command.timeoutMs,
    maxBytes: rule.command.maxBytes,
  });

  let content = result.stdout;
  if (result.truncated) {
    content += '\n\n[... truncated: command rule stdout exceeded cap ...]';
    logger.warn(
      `Plugin rule '${rule.pluginName}/${rule.name}' command stdout exceeded cap (truncated)`
    );
  }
  if (result.timedOut) {
    content += '\n\n[... truncated: command rule timed out ...]';
    logger.warn(`Plugin rule '${rule.pluginName}/${rule.name}' command timed out`);
  }
  if (result.exitCode !== null && result.exitCode !== 0 && !result.timedOut) {
    logger.warn(
      `Plugin rule '${rule.pluginName}/${rule.name}' command exited with code ${result.exitCode}: ${result.stderr.trim()}`
    );
  } else if (result.exitCode === null && !result.timedOut && !result.truncated) {
    // Only treat exitCode===null as a spawn failure when neither the timeout
    // nor the size guard fired (those paths SIGKILL the child themselves).
    logger.warn(
      `Plugin rule '${rule.pluginName}/${rule.name}' command failed to spawn: ${result.stderr.trim()}`
    );
  }

  commandRuleCache.set(key, content);
  return content;
}

/**
 * Discover plugin roots under `.alexi/skills/<name>/plugin.json` (project) and
 * `~/.alexi/skills/<name>/plugin.json` (global).
 *
 * Mirrors the symlink-aware dedup pattern from `src/skill/index.ts` so that
 * a project skills dir symlinked to the global skills dir, or a `dup` entry
 * symlinking to a sibling, does not load the same plugin twice.
 *
 * Failures (missing dirs, unreadable entries, broken symlinks) are logged
 * via `console.warn` and skipped — discovery never throws.
 */
export function autoDiscoverPluginRoots(projectRoot: string): string[] {
  const roots: string[] = [];
  const seenResolved = new Set<string>();
  const candidates = [
    path.join(projectRoot, '.alexi', 'skills'),
    path.join(os.homedir(), '.alexi', 'skills'),
  ];

  for (const dir of candidates) {
    if (!fs.existsSync(dir)) {
      continue;
    }
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      console.warn(`Failed to scan plugin auto-load dir ${dir}:`, err);
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) {
        continue;
      }
      const pluginRoot = path.join(dir, entry.name);
      const manifest = path.join(pluginRoot, 'plugin.json');
      if (!fs.existsSync(manifest)) {
        continue;
      }
      let resolved: string;
      try {
        resolved = fs.realpathSync(pluginRoot);
      } catch (err) {
        console.warn(`Failed to resolve plugin dir ${pluginRoot}:`, err);
        continue;
      }
      if (seenResolved.has(resolved)) {
        continue;
      }
      seenResolved.add(resolved);
      roots.push(pluginRoot);
    }
  }
  return roots;
}

// ============ Plugin Manager ============

export class PluginManager {
  private plugins: Map<string, PluginState> = new Map();
  private hookRegistry: Map<string, Array<{ pluginName: string; handler: HookHandler }>> =
    new Map();
  private workdir: string;
  private config: Record<string, PluginConfig> = {};

  constructor(workdir?: string) {
    this.workdir = workdir || process.cwd();
  }

  /**
   * Set working directory
   */
  setWorkdir(workdir: string): void {
    this.workdir = workdir;
  }

  /**
   * Set plugin-specific configuration
   */
  setPluginConfig(pluginName: string, config: PluginConfig): void {
    this.config[pluginName] = config;
  }

  /**
   * Create a logger for a plugin
   */
  private createLogger(pluginName: string): PluginLogger {
    const prefix = `[plugin:${pluginName}]`;
    return {
      debug: (message: string, ...args: unknown[]) => console.debug(prefix, message, ...args),
      info: (message: string, ...args: unknown[]) => console.info(prefix, message, ...args),
      warn: (message: string, ...args: unknown[]) => console.warn(prefix, message, ...args),
      error: (message: string, ...args: unknown[]) => console.error(prefix, message, ...args),
    };
  }

  /**
   * Create event bus access for a plugin
   */
  private createEventBusAccess(): EventBusAccess {
    return {
      subscribe: <T>(
        event: BusEvent<T>,
        handler: (payload: T) => void | Promise<void>
      ): (() => void) => {
        return event.subscribe(handler);
      },
      publish: <T>(event: BusEvent<T>, payload: T): void => {
        event.publish(payload);
      },
    };
  }

  /**
   * Create plugin context
   */
  private createContext(plugin: Plugin, state: PluginState): PluginContext {
    // Using arrow functions to preserve 'this' context
    const registerToolForPlugin = this.registerToolForPlugin.bind(this);
    const registerSkillForPlugin = this.registerSkillForPlugin.bind(this);
    const registerCommandForPlugin = this.registerCommandForPlugin.bind(this);

    return {
      eventBus: this.createEventBusAccess(),
      config: this.config[plugin.name] || {},
      logger: this.createLogger(plugin.name),
      workdir: this.workdir,

      registerTool(tool: ToolDefinition<any, any>): void {
        const toolInstance = registerToolForPlugin(tool, state);
        if (toolInstance) {
          state.registeredTools.push(tool.name);
        }
      },

      registerSkill(skill: SkillDefinition): void {
        registerSkillForPlugin(skill, state);
        state.registeredSkills.push(skill.id);
      },

      registerCommand(command: CommandDefinition): void {
        registerCommandForPlugin(command, state);
        state.registeredCommands.push(command.name);
      },

      getPlugin: (name: string): Plugin | undefined => {
        return this.get(name);
      },
    };
  }

  /**
   * Register a tool from a plugin
   */
  private registerToolForPlugin(
    toolDef: ToolDefinition<any, any>,
    state: PluginState
  ): Tool<any, any> | null {
    try {
      // Import defineTool dynamically to create the tool
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { defineTool } = require('../tool/index.js');
      const tool = defineTool(toolDef);
      registerTool(tool);
      return tool;
    } catch (error) {
      console.error(
        `[plugin:${state.plugin.name}] Failed to register tool ${toolDef.name}:`,
        error
      );
      return null;
    }
  }

  /**
   * Register a skill from a plugin
   */
  private registerSkillForPlugin(skillDef: SkillDefinition, state: PluginState): void {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { defineSkill } = require('../skill/index.js');
      const skill = defineSkill(skillDef);
      registerSkill(skill);
    } catch (error) {
      console.error(
        `[plugin:${state.plugin.name}] Failed to register skill ${skillDef.id}:`,
        error
      );
    }
  }

  /**
   * Register a command from a plugin
   */
  private registerCommandForPlugin(commandDef: CommandDefinition, state: PluginState): void {
    try {
      const command = defineCommand(commandDef);
      registerCommand(command);
    } catch (error) {
      console.error(
        `[plugin:${state.plugin.name}] Failed to register command ${commandDef.name}:`,
        error
      );
    }
  }

  /**
   * Register hooks from a plugin
   */
  private registerHooks(plugin: Plugin, _state: PluginState): void {
    if (!plugin.hooks) return;

    for (const [hookName, handler] of Object.entries(plugin.hooks)) {
      if (!handler) continue;

      if (!this.hookRegistry.has(hookName)) {
        this.hookRegistry.set(hookName, []);
      }

      this.hookRegistry.get(hookName)!.push({
        pluginName: plugin.name,
        handler: handler as HookHandler,
      });
    }
  }

  /**
   * Unregister hooks from a plugin
   */
  private unregisterHooks(pluginName: string): void {
    for (const [hookName, handlers] of this.hookRegistry.entries()) {
      const filtered = handlers.filter((h) => h.pluginName !== pluginName);
      if (filtered.length === 0) {
        this.hookRegistry.delete(hookName);
      } else {
        this.hookRegistry.set(hookName, filtered);
      }
    }
  }

  /**
   * Validate plugin structure
   */
  private validatePlugin(plugin: unknown): plugin is Plugin {
    if (!plugin || typeof plugin !== 'object') {
      return false;
    }

    const p = plugin as Record<string, unknown>;

    if (typeof p.name !== 'string' || !p.name) {
      return false;
    }

    if (typeof p.version !== 'string' || !p.version) {
      return false;
    }

    return true;
  }

  /**
   * Check plugin dependencies
   */
  private checkDependencies(plugin: Plugin): { satisfied: boolean; missing: string[] } {
    if (!plugin.dependencies || plugin.dependencies.length === 0) {
      return { satisfied: true, missing: [] };
    }

    const missing: string[] = [];
    for (const dep of plugin.dependencies) {
      if (!this.plugins.has(dep)) {
        missing.push(dep);
      }
    }

    return { satisfied: missing.length === 0, missing };
  }

  /**
   * Load a plugin
   */
  async load(plugin: Plugin): Promise<LoadResult> {
    const warnings: string[] = [];

    // Validate plugin structure
    if (!this.validatePlugin(plugin)) {
      return {
        success: false,
        pluginName: (plugin as any)?.name || 'unknown',
        error: 'Invalid plugin structure: missing name or version',
      };
    }

    // Check if already loaded
    if (this.plugins.has(plugin.name)) {
      return {
        success: false,
        pluginName: plugin.name,
        error: `Plugin '${plugin.name}' is already loaded`,
      };
    }

    // Check dependencies
    const deps = this.checkDependencies(plugin);
    if (!deps.satisfied) {
      return {
        success: false,
        pluginName: plugin.name,
        error: `Missing dependencies: ${deps.missing.join(', ')}`,
      };
    }

    // Create plugin state
    const state: PluginState = {
      plugin,
      context: null as unknown as PluginContext, // Will be set below
      enabled: true,
      loadedAt: Date.now(),
      registeredTools: [],
      registeredSkills: [],
      registeredCommands: [],
      hookSubscriptions: [],
      resolvedRules: [],
    };

    // Create context
    state.context = this.createContext(plugin, state);

    try {
      // Register static tools
      if (plugin.tools) {
        for (const toolDef of plugin.tools) {
          const tool = this.registerToolForPlugin(toolDef, state);
          if (tool) {
            state.registeredTools.push(toolDef.name);
          } else {
            warnings.push(`Failed to register tool: ${toolDef.name}`);
          }
        }
      }

      // Register static skills
      if (plugin.skills) {
        for (const skillDef of plugin.skills) {
          this.registerSkillForPlugin(skillDef, state);
          state.registeredSkills.push(skillDef.id);
        }
      }

      // Register static commands
      if (plugin.commands) {
        for (const commandDef of plugin.commands) {
          this.registerCommandForPlugin(commandDef, state);
          state.registeredCommands.push(commandDef.name);
        }
      }

      // Register hooks
      this.registerHooks(plugin, state);

      // Store plugin state
      this.plugins.set(plugin.name, state);

      // Call onLoad lifecycle hook
      if (plugin.onLoad) {
        await plugin.onLoad(state.context);
      }

      // Publish loaded event
      PluginLoaded.publish({
        name: plugin.name,
        version: plugin.version,
        timestamp: Date.now(),
      });

      return {
        success: true,
        pluginName: plugin.name,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error) {
      // Cleanup on failure
      this.plugins.delete(plugin.name);
      this.unregisterHooks(plugin.name);

      const errorMessage = error instanceof Error ? error.message : String(error);

      PluginError.publish({
        pluginName: plugin.name,
        error: errorMessage,
        context: 'load',
        timestamp: Date.now(),
      });

      return {
        success: false,
        pluginName: plugin.name,
        error: `Failed to load plugin: ${errorMessage}`,
      };
    }
  }

  /**
   * Load plugin from file
   */
  async loadFromFile(filePath: string): Promise<LoadResult> {
    const resolvedPath = path.resolve(filePath);

    if (!fs.existsSync(resolvedPath)) {
      return {
        success: false,
        pluginName: path.basename(filePath),
        error: `Plugin file not found: ${resolvedPath}`,
      };
    }

    try {
      // Use dynamic import for both ESM and CommonJS
      let pluginModule: any;

      // Convert to file URL for ESM compatibility
      const fileUrl = pathToFileURL(resolvedPath).href;

      try {
        // Try ESM import first
        pluginModule = await import(fileUrl);
      } catch (esmError) {
        // Fall back to require for CommonJS
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          pluginModule = require(resolvedPath);
        } catch {
          throw new Error(
            `Failed to import plugin as ESM or CommonJS: ${esmError instanceof Error ? esmError.message : String(esmError)}`
          );
        }
      }

      // Get the plugin (support both default export and named export)
      const plugin = pluginModule.default || pluginModule.plugin || pluginModule;

      if (!this.validatePlugin(plugin)) {
        return {
          success: false,
          pluginName: path.basename(filePath),
          error: 'Invalid plugin export: missing name or version',
        };
      }

      return this.load(plugin);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        pluginName: path.basename(filePath),
        error: `Failed to load plugin file: ${errorMessage}`,
      };
    }
  }

  /**
   * Load all plugins from directory
   */
  async loadFromDirectory(dirPath: string): Promise<LoadResult[]> {
    const results: LoadResult[] = [];
    const resolvedDir = path.resolve(dirPath);

    if (!fs.existsSync(resolvedDir)) {
      return results;
    }

    try {
      const entries = fs.readdirSync(resolvedDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(resolvedDir, entry.name);

        if (entry.isFile()) {
          // Load .js, .mjs, .cjs, .ts files
          if (/\.(js|mjs|cjs|ts)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
            const result = await this.loadFromFile(fullPath);
            results.push(result);
          }
        } else if (entry.isDirectory()) {
          // Try to load index file from subdirectory
          const indexFiles = ['index.js', 'index.mjs', 'index.cjs', 'index.ts'];
          for (const indexFile of indexFiles) {
            const indexPath = path.join(fullPath, indexFile);
            if (fs.existsSync(indexPath)) {
              const result = await this.loadFromFile(indexPath);
              results.push(result);
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to read plugin directory ${dirPath}:`, error);
    }

    return results;
  }

  /**
   * Load plugins from all default locations
   */
  async loadFromDefaultLocations(): Promise<LoadResult[]> {
    const results: LoadResult[] = [];

    for (const dir of PLUGIN_DIRS) {
      const dirResults = await this.loadFromDirectory(dir);
      results.push(...dirResults);
    }

    return results;
  }

  /**
   * Load a plugin from a `plugin.json` manifest at the given plugin root.
   * Validation failures emit a `PluginError` event and return a failed
   * `LoadResult` rather than throwing, so a single bad manifest cannot
   * break auto-discovery for siblings.
   */
  async loadFromManifest(pluginRoot: string): Promise<LoadResult> {
    const manifestPath = path.join(pluginRoot, 'plugin.json');
    const fallbackName = path.basename(pluginRoot);

    let raw: string;
    try {
      raw = fs.readFileSync(manifestPath, 'utf-8');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      PluginError.publish({
        pluginName: fallbackName,
        error: errorMessage,
        context: 'manifest:read',
        timestamp: Date.now(),
      });
      return {
        success: false,
        pluginName: fallbackName,
        error: `Failed to read plugin manifest at ${manifestPath}: ${errorMessage}`,
      };
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      PluginError.publish({
        pluginName: fallbackName,
        error: errorMessage,
        context: 'manifest:parse',
        timestamp: Date.now(),
      });
      return {
        success: false,
        pluginName: fallbackName,
        error: `Invalid JSON in ${manifestPath}: ${errorMessage}`,
      };
    }

    const validation = PluginManifestSchema.safeParse(parsedJson);
    if (!validation.success) {
      const errorMessage = validation.error.issues.map((i) => i.message).join('; ');
      PluginError.publish({
        pluginName: (parsedJson as { name?: string } | null)?.name?.toString() || fallbackName,
        error: errorMessage,
        context: 'manifest:validate',
        timestamp: Date.now(),
      });
      return {
        success: false,
        pluginName: fallbackName,
        error: `Invalid plugin.json at ${manifestPath}: ${errorMessage}`,
      };
    }

    const manifest = validation.data;
    const warnings: string[] = [];

    // Resolve commands declared in the manifest by reading their markdown files.
    const commands: CommandDefinition[] = [];
    if (manifest.commands) {
      for (const relPath of manifest.commands) {
        const commandPath = path.isAbsolute(relPath) ? relPath : path.join(pluginRoot, relPath);
        const cmd = loadCommandFromFile(commandPath);
        if (!cmd) {
          warnings.push(`Failed to load command file: ${relPath}`);
          continue;
        }
        commands.push({
          name: cmd.name,
          description: cmd.description,
          arguments: cmd.arguments,
          template: cmd.template,
        });
      }
    }

    // Resolve rule contributions declared in the manifest. We materialize them
    // *before* `load()` so an invalid file source (escape, missing file) can
    // surface a warning while the rest of the plugin loads normally.
    const resolvedRules: ResolvedPluginRule[] = [];
    if (manifest.rules) {
      for (const rule of manifest.rules) {
        const result = resolvePluginRule(pluginRoot, manifest.name, rule);
        if (result.ok) {
          resolvedRules.push(result.rule);
        } else {
          warnings.push(`Failed to resolve rule: ${result.error}`);
          PluginError.publish({
            pluginName: manifest.name,
            error: result.error,
            context: 'manifest:rule',
            timestamp: Date.now(),
          });
        }
      }
    }

    const plugin: Plugin = {
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author,
      dependencies: manifest.dependencies,
      commands,
    };

    const result = await this.load(plugin);
    if (result.success && resolvedRules.length > 0) {
      const state = this.plugins.get(manifest.name);
      if (state) {
        state.resolvedRules = resolvedRules;
      }
    }
    if (warnings.length > 0) {
      result.warnings = [...(result.warnings ?? []), ...warnings];
    }
    return result;
  }

  /**
   * Return all resolved rule contributions from currently *enabled* plugins,
   * in plugin-load order. Disabled plugins are skipped so the system-prompt
   * builder can call this once per assembly without further filtering.
   */
  getEnabledRules(): ResolvedPluginRule[] {
    const rules: ResolvedPluginRule[] = [];
    for (const state of this.plugins.values()) {
      if (!state.enabled) {
        continue;
      }
      rules.push(...state.resolvedRules);
    }
    return rules;
  }

  /**
   * Auto-discover and load plugins from `.alexi/skills/<name>/plugin.json`
   * (project) and `~/.alexi/skills/<name>/plugin.json` (global).
   */
  async loadAutoDiscovered(projectRoot?: string): Promise<LoadResult[]> {
    const root = projectRoot ?? this.workdir;
    const roots = autoDiscoverPluginRoots(root);
    const results: LoadResult[] = [];
    for (const pluginRoot of roots) {
      results.push(await this.loadFromManifest(pluginRoot));
    }
    return results;
  }

  /**
   * Unload a plugin
   */
  async unload(pluginName: string): Promise<void> {
    const state = this.plugins.get(pluginName);
    if (!state) {
      throw new Error(`Plugin '${pluginName}' is not loaded`);
    }

    try {
      // Call onUnload lifecycle hook
      if (state.plugin.onUnload) {
        await state.plugin.onUnload(state.context);
      }

      // Unsubscribe from events
      for (const unsub of state.hookSubscriptions) {
        unsub();
      }

      // Unregister hooks
      this.unregisterHooks(pluginName);

      // Note: Tools, skills, and commands are not automatically unregistered
      // as they might be in use. The registries don't support removal by source.

      // Remove from plugins map
      this.plugins.delete(pluginName);

      // Publish unloaded event
      PluginUnloaded.publish({
        name: pluginName,
        timestamp: Date.now(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      PluginError.publish({
        pluginName,
        error: errorMessage,
        context: 'unload',
        timestamp: Date.now(),
      });

      throw error;
    }
  }

  /**
   * Get loaded plugin
   */
  get(name: string): Plugin | undefined {
    return this.plugins.get(name)?.plugin;
  }

  /**
   * List all loaded plugins
   */
  list(): PluginInfo[] {
    const infos: PluginInfo[] = [];

    for (const [_name, state] of this.plugins.entries()) {
      infos.push({
        name: state.plugin.name,
        version: state.plugin.version,
        description: state.plugin.description,
        author: state.plugin.author,
        enabled: state.enabled,
        loadedAt: state.loadedAt,
        toolCount: state.registeredTools.length,
        skillCount: state.registeredSkills.length,
        commandCount: state.registeredCommands.length,
        hookCount: state.plugin.hooks ? Object.keys(state.plugin.hooks).length : 0,
      });
    }

    return infos;
  }

  /**
   * Get names of enabled plugins that depend on the given plugin
   */
  getDependents(name: string): string[] {
    const dependents: string[] = [];
    for (const [pluginName, state] of this.plugins.entries()) {
      if (!state.enabled) continue;
      if (pluginName === name) continue;
      const deps = state.plugin.dependencies;
      if (deps && deps.includes(name)) {
        dependents.push(pluginName);
      }
    }
    return dependents;
  }

  /**
   * Enable a plugin and recursively enable its dependencies
   */
  enable(name: string): EnableResult {
    const state = this.plugins.get(name);
    if (!state) {
      return {
        success: false,
        pluginName: name,
        error: `Plugin '${name}' is not loaded`,
      };
    }

    const enabledDependencies: string[] = [];
    const visited = new Set<string>();

    const enableRecursive = (pluginName: string): string | undefined => {
      if (visited.has(pluginName)) return undefined;
      visited.add(pluginName);

      const pluginState = this.plugins.get(pluginName);
      if (!pluginState) {
        return `Dependency '${pluginName}' is not loaded`;
      }

      // Recursively enable dependencies first
      const deps = pluginState.plugin.dependencies;
      if (deps) {
        for (const dep of deps) {
          const err = enableRecursive(dep);
          if (err) return err;
        }
      }

      // Enable the plugin if not already enabled
      if (!pluginState.enabled) {
        pluginState.enabled = true;
        if (pluginName !== name) {
          enabledDependencies.push(pluginName);
        }
      }

      return undefined;
    };

    const error = enableRecursive(name);
    if (error) {
      return { success: false, pluginName: name, error };
    }

    return {
      success: true,
      pluginName: name,
      enabledDependencies: enabledDependencies.length > 0 ? enabledDependencies : undefined,
    };
  }

  /**
   * Disable a plugin
   * Refuses if other enabled plugins depend on it unless force is true
   */
  disable(name: string, options?: { force?: boolean }): DisableResult {
    const state = this.plugins.get(name);
    if (!state) {
      return {
        success: false,
        pluginName: name,
        error: `Plugin '${name}' is not loaded`,
      };
    }

    const force = options?.force ?? false;

    if (!force) {
      const dependents = this.getDependents(name);
      if (dependents.length > 0) {
        return {
          success: false,
          pluginName: name,
          error: `Cannot disable '${name}': required by ${dependents.join(', ')}. Disable those plugins first.`,
        };
      }
    }

    state.enabled = false;
    return { success: true, pluginName: name };
  }

  /**
   * Check if a plugin is enabled
   */
  isEnabled(name: string): boolean {
    const state = this.plugins.get(name);
    return state?.enabled ?? false;
  }

  /**
   * Execute hooks for a given hook name
   * Hooks are chainable - output of one becomes input of next
   */
  async executeHook<T>(hookName: string, args: T): Promise<T> {
    const handlers = this.hookRegistry.get(hookName);
    if (!handlers || handlers.length === 0) {
      return args;
    }

    let currentArgs = args;

    for (const { pluginName, handler } of handlers) {
      const state = this.plugins.get(pluginName);

      // Skip disabled plugins
      if (!state?.enabled) {
        continue;
      }

      const startTime = Date.now();

      try {
        const result = await handler(currentArgs);

        // If handler returns a value, use it as next input
        if (result !== undefined && result !== null) {
          currentArgs = result as T;
        }

        const duration = Date.now() - startTime;

        // Publish hook executed event
        PluginHookExecuted.publish({
          pluginName,
          hookName,
          duration,
          timestamp: Date.now(),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Log error but continue with other hooks
        console.error(`[plugin:${pluginName}] Hook '${hookName}' failed:`, errorMessage);

        PluginError.publish({
          pluginName,
          error: errorMessage,
          context: `hook:${hookName}`,
          timestamp: Date.now(),
        });
      }
    }

    return currentArgs;
  }

  /**
   * Get registered hooks for a hook name
   */
  getHooks(hookName: string): Array<{ pluginName: string }> {
    const handlers = this.hookRegistry.get(hookName);
    if (!handlers) return [];
    return handlers.map(({ pluginName }) => ({ pluginName }));
  }

  /**
   * Get all registered hook names
   */
  getHookNames(): string[] {
    return Array.from(this.hookRegistry.keys());
  }

  /**
   * Clear all plugins
   */
  async clear(): Promise<void> {
    const pluginNames = Array.from(this.plugins.keys());

    for (const name of pluginNames) {
      try {
        await this.unload(name);
      } catch (error) {
        console.error(`Failed to unload plugin '${name}' during clear:`, error);
      }
    }

    this.plugins.clear();
    this.hookRegistry.clear();
  }
}

// ============ Define Plugin Helper ============

/**
 * Define a new plugin with validation and type safety
 */
export function definePlugin(config: PluginDefinitionConfig): Plugin {
  // Validate required fields
  if (!config.name || typeof config.name !== 'string') {
    throw new Error('Plugin name is required');
  }

  if (!config.version || typeof config.version !== 'string') {
    throw new Error('Plugin version is required');
  }

  // Validate version format (semver-like)
  if (!/^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/.test(config.version)) {
    console.warn(
      `Plugin '${config.name}' version '${config.version}' doesn't follow semver format`
    );
  }

  // Create the plugin object
  const plugin: Plugin = {
    name: config.name,
    version: config.version,
    description: config.description,
    author: config.author,
    dependencies: config.dependencies,
    tools: config.tools,
    skills: config.skills,
    commands: config.commands,
    hooks: config.hooks,
  };

  // Add lifecycle hooks if provided
  if (config.setup) {
    plugin.onLoad = config.setup;
  }

  if (config.teardown) {
    plugin.onUnload = config.teardown;
  }

  return plugin;
}

// ============ Global Plugin Manager ============

let globalPluginManager: PluginManager | null = null;

/**
 * Get the global plugin manager instance
 */
export function getPluginManager(): PluginManager {
  if (!globalPluginManager) {
    globalPluginManager = new PluginManager();
  }
  return globalPluginManager;
}

/**
 * Load a plugin into the global manager
 */
export async function loadPlugin(plugin: Plugin): Promise<LoadResult> {
  return getPluginManager().load(plugin);
}

/**
 * Load plugins from all default locations
 */
export async function loadPluginsFromDefaultLocations(): Promise<LoadResult[]> {
  return getPluginManager().loadFromDefaultLocations();
}

/**
 * Auto-discover and load plugins from `.alexi/skills/<name>/plugin.json`
 * (project) and `~/.alexi/skills/<name>/plugin.json` (global).
 */
export async function loadAutoDiscoveredPlugins(projectRoot?: string): Promise<LoadResult[]> {
  return getPluginManager().loadAutoDiscovered(projectRoot);
}

/**
 * Execute a plugin hook through the global manager
 */
export async function executePluginHook<T>(hookName: string, args: T): Promise<T> {
  return getPluginManager().executeHook(hookName, args);
}

/**
 * Unload a plugin from the global manager
 */
export async function unloadPlugin(pluginName: string): Promise<void> {
  return getPluginManager().unload(pluginName);
}

/**
 * Get a loaded plugin from the global manager
 */
export function getPlugin(name: string): Plugin | undefined {
  return getPluginManager().get(name);
}

/**
 * List all loaded plugins from the global manager
 */
export function listPlugins(): PluginInfo[] {
  return getPluginManager().list();
}

/**
 * Enable a plugin in the global manager
 */
export function enablePlugin(name: string): EnableResult {
  return getPluginManager().enable(name);
}

/**
 * Disable a plugin in the global manager
 */
export function disablePlugin(name: string, options?: { force?: boolean }): DisableResult {
  return getPluginManager().disable(name, options);
}

/**
 * Return resolved rule contributions from all enabled plugins in the global
 * manager. Used by the system-prompt assembler to layer plugin rules after
 * AGENTS.md.
 *
 * NOTE: For `command`-source rules this returns the *unmaterialized* descriptor
 * with `content: ''`. Callers that want the dynamic output should go through
 * {@link resolvePluginRulesForPrompt} which materializes commands in parallel.
 */
export function getEnabledPluginRules(): ResolvedPluginRule[] {
  return getPluginManager().getEnabledRules();
}

/**
 * Resolve all enabled plugin rules with command-source rules materialized.
 *
 * Inline and file rules are passed through unchanged. Command rules are
 * spawned in parallel (each respecting its own timeout/cap) and their
 * outputs are cached per `scope` — `'always'` for the process lifetime,
 * `'session'` keyed by `sessionId`. The cache is the same map drained by
 * {@link clearRuleCommandCache} on session close.
 */
export async function resolvePluginRulesForPrompt(
  sessionId?: string
): Promise<ResolvedPluginRule[]> {
  const rules = getEnabledPluginRules();
  return Promise.all(
    rules.map(async (rule) => {
      if (rule.source !== 'command') {
        return rule;
      }
      const content = await materializeCommandRule(rule, sessionId);
      return { ...rule, content };
    })
  );
}

// Type exports are already included via class declarations above
