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
import { registerCommand, defineCommand } from '../command/index.js';

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
}

// ============ Default Plugin Directories ============

export const PLUGIN_DIRS = [
  path.join(os.homedir(), '.alexi', 'plugins'), // Global plugins
  path.join(process.cwd(), '.alexi', 'plugins'), // Project plugins
];

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
   * Enable a plugin
   */
  enable(name: string): void {
    const state = this.plugins.get(name);
    if (!state) {
      throw new Error(`Plugin '${name}' is not loaded`);
    }
    state.enabled = true;
  }

  /**
   * Disable a plugin
   */
  disable(name: string): void {
    const state = this.plugins.get(name);
    if (!state) {
      throw new Error(`Plugin '${name}' is not loaded`);
    }
    state.enabled = false;
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
export function enablePlugin(name: string): void {
  getPluginManager().enable(name);
}

/**
 * Disable a plugin in the global manager
 */
export function disablePlugin(name: string): void {
  getPluginManager().disable(name);
}

// Type exports are already included via class declarations above
