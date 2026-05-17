/**
 * Hooks System for Alexi
 * Lifecycle hooks for tool execution and session events
 * Inspired by Claude Code's hooks system
 *
 * Features:
 * - Command hooks (spawn child process)
 * - HTTP hooks (fetch with timeout)
 * - Script hooks (dynamic import and execute)
 * - Template variable substitution
 */

import { z } from 'zod';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { pathToFileURL } from 'url';
import { defineEvent } from '../bus/index.js';

// ============ Type Definitions ============

export type HookEvent =
  | 'SessionStart' // Session begins or resumes
  | 'SessionEnd' // Session terminates
  | 'PreToolUse' // Before tool execution
  | 'PostToolUse' // After successful tool execution
  | 'PostToolUseFailure' // After failed tool execution
  | 'PermissionRequest' // Permission dialog appears
  | 'Stop' // Claude finishes responding
  | 'Error'; // Error occurred

export type HookType = 'command' | 'http' | 'script';

export interface HookDefinition {
  event: HookEvent;
  type: HookType;

  // For 'command' type
  command?: string;

  // For 'http' type
  url?: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;

  // For 'script' type (JS/TS file to execute)
  script?: string;

  // Common options
  timeout?: number; // Max execution time in ms, default 30000
  enabled?: boolean; // Default true
  description?: string; // Human-readable description

  // Tool filtering
  /** When set, restricts this hook to only fire for the specified tool names */
  tools?: string[];

  // Rejection behavior
  /** When true, hook rejection feeds the error back to the model instead of halting */
  continueOnBlock?: boolean;
}

export interface HookContext {
  event: HookEvent;
  timestamp: number;
  sessionId?: string;

  // Event-specific data
  toolName?: string;
  toolParams?: Record<string, unknown>;
  toolResult?: unknown;
  error?: string;
}

export interface HookResult {
  success: boolean;
  output?: string;
  error?: string;
  duration: number;
  /** True when a Stop hook exceeded the consecutive block cap */
  capped?: boolean;
  /** When true, callers should feed the rejection reason back to the model instead of halting */
  continueOnBlock?: boolean;
}

// Zod schemas for validation
export const HookDefinitionSchema = z.object({
  event: z.enum([
    'SessionStart',
    'SessionEnd',
    'PreToolUse',
    'PostToolUse',
    'PostToolUseFailure',
    'PermissionRequest',
    'Stop',
    'Error',
  ]),
  type: z.enum(['command', 'http', 'script']),
  command: z.string().optional(),
  url: z.string().url().optional(),
  method: z.enum(['GET', 'POST']).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  script: z.string().optional(),
  timeout: z.number().positive().optional(),
  enabled: z.boolean().optional(),
  description: z.string().optional(),
  tools: z.array(z.string()).optional(),
  continueOnBlock: z.boolean().optional(),
});

export const HookContextSchema = z.object({
  event: z.enum([
    'SessionStart',
    'SessionEnd',
    'PreToolUse',
    'PostToolUse',
    'PostToolUseFailure',
    'PermissionRequest',
    'Stop',
    'Error',
  ]),
  timestamp: z.number(),
  sessionId: z.string().optional(),
  toolName: z.string().optional(),
  toolParams: z.record(z.string(), z.unknown()).optional(),
  toolResult: z.unknown().optional(),
  error: z.string().optional(),
});

export const HooksConfigSchema = z.object({
  hooks: z.array(HookDefinitionSchema),
});

// ============ Events ============

export const HookExecuted = defineEvent(
  'hook.executed',
  z.object({
    event: z.string(),
    type: z.string(),
    success: z.boolean(),
    duration: z.number(),
    timestamp: z.number(),
  })
);

export const HookFailed = defineEvent(
  'hook.failed',
  z.object({
    event: z.string(),
    type: z.string(),
    error: z.string(),
    timestamp: z.number(),
  })
);

// ============ Constants ============

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const HOOK_CONFIG_FILES = ['.alexi/hooks.json', 'alexi.config.json'];

/** Default maximum consecutive blocks before a Stop hook is capped */
export const STOP_HOOK_BLOCK_CAP = 8;

/**
 * Get the effective block cap from env var or default
 */
export function getBlockCap(): number {
  const envVal = process.env.ALEXI_STOP_HOOK_BLOCK_CAP;
  if (envVal !== undefined) {
    const parsed = parseInt(envVal, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return STOP_HOOK_BLOCK_CAP;
}

// ============ Template Substitution ============

/**
 * Substitute template variables in a string
 * Supports: {{event}}, {{toolName}}, {{sessionId}}, {{timestamp}}, {{error}}
 */
export function substituteTemplates(template: string, context: HookContext): string {
  return template
    .replace(/\{\{event\}\}/g, context.event)
    .replace(/\{\{toolName\}\}/g, context.toolName || '')
    .replace(/\{\{sessionId\}\}/g, context.sessionId || '')
    .replace(/\{\{timestamp\}\}/g, String(context.timestamp))
    .replace(/\{\{error\}\}/g, context.error || '');
}

// ============ Hook Interface ============

export interface HookManager {
  // Register a hook
  register(hook: HookDefinition): void;

  // Unregister hooks for an event
  unregister(event: HookEvent, index?: number): void;

  // Execute all hooks for an event
  execute(event: HookEvent, context: HookContext): Promise<HookResult[]>;

  // Get registered hooks
  getHooks(event?: HookEvent): HookDefinition[];

  // Load hooks from config file
  loadFromConfig(configPath?: string): Promise<void>;
}

// ============ Hook Execution Functions ============

/**
 * Execute a command hook by spawning a child process
 */
async function executeCommandHook(hook: HookDefinition, context: HookContext): Promise<HookResult> {
  const startTime = Date.now();

  if (!hook.command) {
    return {
      success: false,
      error: 'Command not specified',
      duration: Date.now() - startTime,
    };
  }

  const command = substituteTemplates(hook.command, context);
  const timeout = hook.timeout ?? DEFAULT_TIMEOUT;

  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    const shell = isWindows ? 'cmd.exe' : '/bin/sh';
    const shellFlag = isWindows ? '/c' : '-c';

    const child = spawn(shell, [shellFlag, command], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        ALEXI_HOOK_EVENT: context.event,
        ALEXI_HOOK_TOOL: context.toolName || '',
        ALEXI_HOOK_SESSION: context.sessionId || '',
        ALEXI_HOOK_TIMESTAMP: String(context.timestamp),
      },
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, timeout);

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      const duration = Date.now() - startTime;

      if (timedOut) {
        resolve({
          success: false,
          error: `Command timed out after ${timeout}ms`,
          output: stdout,
          duration,
        });
      } else if (code !== 0) {
        resolve({
          success: false,
          error: stderr || `Command exited with code ${code}`,
          output: stdout,
          duration,
        });
      } else {
        resolve({
          success: true,
          output: stdout,
          duration,
        });
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        success: false,
        error: `Failed to spawn command: ${err.message}`,
        duration: Date.now() - startTime,
      });
    });
  });
}

/**
 * Execute an HTTP hook by making a fetch request
 */
async function executeHttpHook(hook: HookDefinition, context: HookContext): Promise<HookResult> {
  const startTime = Date.now();

  if (!hook.url) {
    return {
      success: false,
      error: 'URL not specified',
      duration: Date.now() - startTime,
    };
  }

  const url = substituteTemplates(hook.url, context);
  const timeout = hook.timeout ?? DEFAULT_TIMEOUT;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...hook.headers,
    };

    // Substitute templates in headers
    for (const [key, value] of Object.entries(headers)) {
      headers[key] = substituteTemplates(value, context);
    }

    const response = await fetch(url, {
      method: hook.method || 'POST',
      headers,
      body: hook.method === 'GET' ? undefined : JSON.stringify(context),
      signal: controller.signal,
    });

    clearTimeout(timer);

    const duration = Date.now() - startTime;
    const responseText = await response.text();

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        output: responseText,
        duration,
      };
    }

    return {
      success: true,
      output: responseText,
      duration,
    };
  } catch (err) {
    const duration = Date.now() - startTime;
    const error = err instanceof Error ? err.message : String(err);

    if (error.includes('abort')) {
      return {
        success: false,
        error: `HTTP request timed out after ${timeout}ms`,
        duration,
      };
    }

    return {
      success: false,
      error: `HTTP request failed: ${error}`,
      duration,
    };
  }
}

/**
 * Execute a script hook by dynamically importing and running a JS/TS file
 */
async function executeScriptHook(hook: HookDefinition, context: HookContext): Promise<HookResult> {
  const startTime = Date.now();

  if (!hook.script) {
    return {
      success: false,
      error: 'Script path not specified',
      duration: Date.now() - startTime,
    };
  }

  const scriptPath = hook.script.startsWith('~')
    ? path.join(os.homedir(), hook.script.slice(1))
    : path.resolve(hook.script);

  if (!fs.existsSync(scriptPath)) {
    return {
      success: false,
      error: `Script not found: ${scriptPath}`,
      duration: Date.now() - startTime,
    };
  }

  const timeout = hook.timeout ?? DEFAULT_TIMEOUT;

  try {
    // Create a promise that rejects on timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Script timed out after ${timeout}ms`)), timeout);
    });

    // Import and execute the script
    const executePromise = (async () => {
      const fileUrl = pathToFileURL(scriptPath).href;
      const scriptModule = await import(fileUrl);

      // Support both default export and named 'hook' export
      const hookFn = scriptModule.default || scriptModule.hook;

      if (typeof hookFn !== 'function') {
        throw new Error('Script must export a function as default or named "hook"');
      }

      return hookFn(context);
    })();

    const result = await Promise.race([executePromise, timeoutPromise]);
    const duration = Date.now() - startTime;

    return {
      success: true,
      output: result !== undefined ? JSON.stringify(result) : undefined,
      duration,
    };
  } catch (err) {
    const duration = Date.now() - startTime;
    const error = err instanceof Error ? err.message : String(err);

    return {
      success: false,
      error: `Script execution failed: ${error}`,
      duration,
    };
  }
}

// ============ HookManagerImpl Class ============

export class HookManagerImpl implements HookManager {
  private hooks: Map<HookEvent, HookDefinition[]> = new Map();
  private consecutiveBlocks: Map<string, number> = new Map();

  /**
   * Register a hook for an event
   */
  register(hook: HookDefinition): void {
    // Validate hook
    const validated = HookDefinitionSchema.parse(hook);

    // Validate event-type compatibility
    const COMMAND_ONLY_EVENTS: HookEvent[] = ['SessionStart', 'SessionEnd', 'Error'];

    if (COMMAND_ONLY_EVENTS.includes(validated.event) && validated.type !== 'command') {
      throw new Error(
        `Event '${validated.event}' requires a command-type hook. ` +
          `${validated.type}-type hooks are not supported for this event because they ` +
          `may have long timeouts or rely on session state not yet available.`
      );
    }

    // Validate type-specific fields
    if (validated.type === 'command' && !validated.command) {
      throw new Error('Command hook requires "command" field');
    }
    if (validated.type === 'http' && !validated.url) {
      throw new Error('HTTP hook requires "url" field');
    }
    if (validated.type === 'script' && !validated.script) {
      throw new Error('Script hook requires "script" field');
    }

    const event = validated.event;
    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }

    // Cast to HookDefinition since validation passed
    this.hooks.get(event)!.push(validated as HookDefinition);
  }

  /**
   * Unregister hooks for an event
   * If index is provided, only remove that specific hook
   * Otherwise, remove all hooks for the event
   */
  unregister(event: HookEvent, index?: number): void {
    if (!this.hooks.has(event)) {
      return;
    }

    if (index !== undefined) {
      const eventHooks = this.hooks.get(event)!;
      if (index >= 0 && index < eventHooks.length) {
        eventHooks.splice(index, 1);
      }
    } else {
      this.hooks.delete(event);
    }
  }

  /**
   * Execute all hooks for an event
   */
  async execute(event: HookEvent, context: HookContext): Promise<HookResult[]> {
    const eventHooks = this.hooks.get(event) || [];
    const results: HookResult[] = [];
    const cap = getBlockCap();

    for (const hook of eventHooks) {
      // Skip disabled hooks
      if (hook.enabled === false) {
        continue;
      }

      // Skip hooks whose tool filter doesn't match the current tool
      if (hook.tools && hook.tools.length > 0 && !hook.tools.includes(context.toolName ?? '')) {
        continue;
      }

      // For Stop hooks, check if we've hit the block cap
      const hookKey = `${event}:${hook.type}:${hook.command ?? hook.url ?? hook.script ?? ''}`;
      if (event === 'Stop') {
        const currentCount = this.consecutiveBlocks.get(hookKey) ?? 0;
        if (currentCount >= cap) {
          results.push({
            success: false,
            error: `Stop hook blocked ${cap} consecutive times. Ending turn to prevent infinite loop.`,
            duration: 0,
            capped: true,
          });
          continue;
        }
      }

      let result: HookResult;

      try {
        switch (hook.type) {
          case 'command':
            result = await executeCommandHook(hook, context);
            break;
          case 'http':
            result = await executeHttpHook(hook, context);
            break;
          case 'script':
            result = await executeScriptHook(hook, context);
            break;
          default:
            result = {
              success: false,
              error: `Unknown hook type: ${hook.type}`,
              duration: 0,
            };
        }
      } catch (err) {
        result = {
          success: false,
          error: `Hook execution error: ${err instanceof Error ? err.message : String(err)}`,
          duration: 0,
        };
      }

      // Track consecutive blocks for Stop hooks
      if (event === 'Stop') {
        if (result.success) {
          this.consecutiveBlocks.set(hookKey, 0);
        } else {
          const current = this.consecutiveBlocks.get(hookKey) ?? 0;
          this.consecutiveBlocks.set(hookKey, current + 1);
        }
      }

      // Propagate continueOnBlock from hook definition to result
      if (hook.continueOnBlock) {
        result.continueOnBlock = true;
      }

      results.push(result);

      // Publish events
      if (result.success) {
        HookExecuted.publish({
          event,
          type: hook.type,
          success: true,
          duration: result.duration,
          timestamp: Date.now(),
        });
      } else {
        HookFailed.publish({
          event,
          type: hook.type,
          error: result.error || 'Unknown error',
          timestamp: Date.now(),
        });
      }
    }

    return results;
  }

  /**
   * Get registered hooks, optionally filtered by event
   */
  getHooks(event?: HookEvent): HookDefinition[] {
    if (event) {
      return [...(this.hooks.get(event) || [])];
    }

    const allHooks: HookDefinition[] = [];
    for (const hooks of this.hooks.values()) {
      allHooks.push(...hooks);
    }
    return allHooks;
  }

  /**
   * Load hooks from a config file
   * Searches in order: provided path, .alexi/hooks.json, alexi.config.json
   */
  async loadFromConfig(configPath?: string): Promise<void> {
    const searchPaths: string[] = [];

    if (configPath) {
      searchPaths.push(configPath);
    }

    // Add default search paths
    for (const file of HOOK_CONFIG_FILES) {
      searchPaths.push(path.join(process.cwd(), file));
      searchPaths.push(path.join(os.homedir(), '.alexi', file));
    }

    for (const filePath of searchPaths) {
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const config = JSON.parse(content);

          // Support both { hooks: [...] } and direct [...] format
          const hooksArray = Array.isArray(config) ? config : config.hooks;

          if (!hooksArray) {
            continue;
          }

          // Validate the config
          const validated = z.array(HookDefinitionSchema).parse(hooksArray);

          // Register all hooks
          for (const hook of validated) {
            this.register(hook as HookDefinition);
          }

          return;
        } catch (err) {
          // Log error but continue searching
          console.warn(`Failed to load hooks from ${filePath}:`, err);
        }
      }
    }
  }

  /**
   * Reset the consecutive block counter.
   * If event is specified, only reset counters for that event.
   * Otherwise, reset all counters.
   */
  resetBlockCount(event?: string): void {
    if (event) {
      for (const key of this.consecutiveBlocks.keys()) {
        if (key.startsWith(`${event}:`)) {
          this.consecutiveBlocks.delete(key);
        }
      }
    } else {
      this.consecutiveBlocks.clear();
    }
  }

  /**
   * Clear all hooks
   */
  clear(): void {
    this.hooks.clear();
    this.consecutiveBlocks.clear();
  }
}

// ============ Global Hook Manager ============

let globalHookManager: HookManagerImpl | null = null;

/**
 * Get the global hook manager instance
 */
export function getHookManager(): HookManager {
  if (!globalHookManager) {
    globalHookManager = new HookManagerImpl();
  }
  return globalHookManager;
}

/**
 * Reset the global hook manager (useful for testing)
 */
export function resetHookManager(): void {
  if (globalHookManager) {
    globalHookManager.clear();
  }
  globalHookManager = null;
}

// ============ Convenience Functions ============

/**
 * Register a hook with the global manager
 */
export function registerHook(hook: HookDefinition): void {
  getHookManager().register(hook);
}

/**
 * Execute hooks for an event with the global manager
 */
export async function executeHooks(event: HookEvent, context: HookContext): Promise<HookResult[]> {
  return getHookManager().execute(event, context);
}

/**
 * Create a hook context for the current moment
 */
export function createHookContext(
  event: HookEvent,
  data?: Partial<Omit<HookContext, 'event' | 'timestamp'>>
): HookContext {
  return {
    event,
    timestamp: Date.now(),
    ...data,
  };
}
