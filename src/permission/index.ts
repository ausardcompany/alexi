/**
 * Permission System
 * Last-match-wins rule evaluation with interactive ask flow
 * Based on kilocode/opencode permission patterns
 *
 * Enhanced with:
 * - Doom loop detection
 * - External directory control
 * - Enhanced pattern matching
 */

import { z } from 'zod';
import { nanoid } from 'nanoid';
import * as path from 'path';
import * as os from 'os';
import { matchPattern, matchPatterns, matchCommand, isUnderDirectory } from './wildcard.js';
import {
  PermissionRequested,
  PermissionResponse,
  waitForEvent,
  defineEvent,
} from '../bus/index.js';
import { ConfigProtection } from './config-paths.js';

// Permission action types
export type PermissionAction = 'read' | 'write' | 'execute' | 'network' | 'admin';

// Permission decision
export type PermissionDecision = 'allow' | 'deny' | 'ask';

// Doom loop configuration
export interface DoomLoopConfig {
  maxRetries: number; // Max retries for same operation (default: 3)
  windowMs: number; // Time window to track retries (default: 60000)
  onDetected: 'warn' | 'block' | 'ask'; // Action when detected
}

// Doom loop check result
export interface DoomLoopCheckResult {
  isLoop: boolean;
  attempts: number;
}

// Operation attempt tracking
interface OperationAttempt {
  count: number;
  firstAttempt: number;
}

// Rule schema - enhanced with external path and home expansion options
export const PermissionRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  // Matching criteria
  tools: z.array(z.string()).optional(), // Tool name patterns
  actions: z.array(z.enum(['read', 'write', 'execute', 'network', 'admin'])).optional(),
  paths: z.array(z.string()).optional(), // File path patterns
  commands: z.array(z.string()).optional(), // Command patterns
  hosts: z.array(z.string()).optional(), // Network host patterns
  // Decision
  decision: z.enum(['allow', 'deny', 'ask']),
  // Priority (higher = evaluated later in last-match-wins)
  priority: z.number().default(0),
  // Enhanced options
  externalPaths: z.boolean().optional(), // Whether rule applies to external paths
  homeExpansion: z.boolean().optional(), // Expand ~/ to home directory in paths
});

export type PermissionRule = z.infer<typeof PermissionRuleSchema>;

// ============ New Permission Events ============

export const DoomLoopDetected = defineEvent(
  'permission.doomloop',
  z.object({
    operation: z.string(),
    attempts: z.number(),
    action: z.string(),
    timestamp: z.number(),
  })
);

export const ExternalAccessAttempted = defineEvent(
  'permission.external',
  z.object({
    path: z.string(),
    allowed: z.boolean(),
    timestamp: z.number(),
  })
);

// Permission request context
export interface PermissionContext {
  toolName: string;
  action: PermissionAction;
  resource: string; // Path, command, URL, etc.
  description?: string;
}

// Permission check result
export interface PermissionResult {
  decision: PermissionDecision;
  rule?: PermissionRule;
  granted: boolean;
}

// Permission manager class
export class PermissionManager {
  private rules: PermissionRule[] = [];
  private sessionGrants: Map<string, boolean> = new Map();
  private askTimeoutMs: number = 60000; // 1 minute timeout for ask prompts

  // Doom loop detection
  private recentOperations: Map<string, OperationAttempt> = new Map();
  private doomLoopConfig: DoomLoopConfig = {
    maxRetries: 3,
    windowMs: 60000,
    onDetected: 'warn',
  };

  // External directory control
  private projectRoot: string = process.cwd();
  private allowExternalDirectories: boolean = false;

  constructor(rules: PermissionRule[] = []) {
    this.rules = this.sortRules(rules);
  }

  /**
   * Sort rules by priority (ascending for last-match-wins)
   */
  private sortRules(rules: PermissionRule[]): PermissionRule[] {
    return [...rules].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }

  // ============ Doom Loop Detection ============

  /**
   * Configure doom loop detection
   */
  configureDoomLoop(config: Partial<DoomLoopConfig>): void {
    this.doomLoopConfig = { ...this.doomLoopConfig, ...config };
  }

  /**
   * Reset doom loop tracking
   */
  resetDoomLoopTracking(): void {
    this.recentOperations.clear();
  }

  /**
   * Get current doom loop config
   */
  getDoomLoopConfig(): DoomLoopConfig {
    return { ...this.doomLoopConfig };
  }

  /**
   * Generate operation key for doom loop tracking
   */
  private getOperationKey(ctx: PermissionContext): string {
    return `${ctx.toolName}:${ctx.action}:${ctx.resource}`;
  }

  /**
   * Check for doom loop - detects repeated failed operation attempts
   */
  checkDoomLoop(ctx: PermissionContext): DoomLoopCheckResult {
    const key = this.getOperationKey(ctx);
    const now = Date.now();
    const existing = this.recentOperations.get(key);

    // Clean up expired entries
    this.cleanupExpiredOperations(now);

    if (!existing) {
      return { isLoop: false, attempts: 0 };
    }

    // Check if within window
    if (now - existing.firstAttempt > this.doomLoopConfig.windowMs) {
      // Expired, reset
      this.recentOperations.delete(key);
      return { isLoop: false, attempts: 0 };
    }

    const isLoop = existing.count >= this.doomLoopConfig.maxRetries;
    return { isLoop, attempts: existing.count };
  }

  /**
   * Record an operation attempt for doom loop tracking
   */
  private recordOperationAttempt(ctx: PermissionContext): void {
    const key = this.getOperationKey(ctx);
    const now = Date.now();
    const existing = this.recentOperations.get(key);

    if (existing && now - existing.firstAttempt <= this.doomLoopConfig.windowMs) {
      // Within window, increment count
      existing.count++;
    } else {
      // New or expired, start fresh
      this.recentOperations.set(key, { count: 1, firstAttempt: now });
    }
  }

  /**
   * Clean up expired operation tracking entries
   */
  private cleanupExpiredOperations(now: number): void {
    for (const [key, value] of this.recentOperations.entries()) {
      if (now - value.firstAttempt > this.doomLoopConfig.windowMs) {
        this.recentOperations.delete(key);
      }
    }
  }

  /**
   * Handle doom loop detection
   */
  private handleDoomLoop(ctx: PermissionContext, attempts: number): PermissionResult | null {
    const action = this.doomLoopConfig.onDetected;

    // Publish doom loop detected event
    DoomLoopDetected.publish({
      operation: this.getOperationKey(ctx),
      attempts,
      action,
      timestamp: Date.now(),
    });

    if (action === 'block') {
      return {
        decision: 'deny',
        granted: false,
      };
    }

    // "warn" and "ask" continue with normal flow
    return null;
  }

  // ============ External Directory Control ============

  /**
   * Set the project root directory
   */
  setProjectRoot(rootPath: string): void {
    this.projectRoot = path.resolve(rootPath);
  }

  /**
   * Get the current project root
   */
  getProjectRoot(): string {
    return this.projectRoot;
  }

  /**
   * Set whether external directories are allowed
   */
  setAllowExternalDirectories(allow: boolean): void {
    this.allowExternalDirectories = allow;
  }

  /**
   * Check if external directories are allowed
   */
  getAllowExternalDirectories(): boolean {
    return this.allowExternalDirectories;
  }

  /**
   * Check if a path is external to the project
   */
  isExternalPath(targetPath: string): boolean {
    const resolved = path.resolve(targetPath);
    return !isUnderDirectory(resolved, this.projectRoot);
  }

  /**
   * Handle external path access
   */
  private handleExternalPath(ctx: PermissionContext): PermissionResult | null {
    // Only check for file-related actions
    if (ctx.action === 'network') {
      return null;
    }

    const isExternal = this.isExternalPath(ctx.resource);

    if (isExternal) {
      // Publish external access event
      ExternalAccessAttempted.publish({
        path: ctx.resource,
        allowed: this.allowExternalDirectories,
        timestamp: Date.now(),
      });

      if (!this.allowExternalDirectories) {
        return {
          decision: 'deny',
          granted: false,
        };
      }
    }

    return null;
  }

  // ============ Enhanced Pattern Matching ============

  /**
   * Expand home directory in path (~/ -> /Users/xxx)
   */
  private expandHomePath(pathStr: string): string {
    if (pathStr.startsWith('~/') || pathStr === '~') {
      return path.join(os.homedir(), pathStr.slice(1));
    }
    return pathStr;
  }

  /**
   * Process rule paths with home expansion
   */
  private processRulePaths(rule: PermissionRule): string[] {
    if (!rule.paths) return [];

    if (rule.homeExpansion) {
      return rule.paths.map((p) => this.expandHomePath(p));
    }

    return rule.paths;
  }

  /**
   * Add a permission rule
   */
  addRule(rule: PermissionRule): void {
    const validated = PermissionRuleSchema.parse(rule);
    this.rules.push(validated);
    this.rules = this.sortRules(this.rules);
  }

  /**
   * Remove a rule by id
   */
  removeRule(ruleId: string): boolean {
    const idx = this.rules.findIndex((r) => r.id === ruleId);
    if (idx >= 0) {
      this.rules.splice(idx, 1);
      return true;
    }
    return false;
  }

  /**
   * Get all rules
   */
  getRules(): PermissionRule[] {
    return [...this.rules];
  }

  /**
   * Check if a context matches a rule
   */
  private matchRule(ctx: PermissionContext, rule: PermissionRule): boolean {
    // Check tool name
    if (rule.tools && rule.tools.length > 0) {
      const matches = rule.tools.some((pattern) => matchPattern(pattern, ctx.toolName).matched);
      if (!matches) return false;
    }

    // Check action
    if (rule.actions && rule.actions.length > 0) {
      if (!rule.actions.includes(ctx.action)) return false;
    }

    // Check external paths constraint
    if (rule.externalPaths !== undefined && ctx.action !== 'network') {
      const isExternal = this.isExternalPath(ctx.resource);
      // If rule is for external paths but path is internal, skip
      // If rule is for internal paths but path is external, skip
      if (rule.externalPaths !== isExternal) {
        return false;
      }
    }

    // Check paths (for file operations) with home expansion support
    if (rule.paths && rule.paths.length > 0 && ctx.action !== 'network') {
      const processedPaths = this.processRulePaths(rule);
      const processedResource = rule.homeExpansion
        ? this.expandHomePath(ctx.resource)
        : ctx.resource;
      const pathMatch = matchPatterns(processedPaths, processedResource);
      if (!pathMatch.matched) return false;
    }

    // Check commands (for execute actions)
    if (rule.commands && rule.commands.length > 0 && ctx.action === 'execute') {
      if (!matchCommand(ctx.resource, rule.commands)) return false;
    }

    // Check hosts (for network actions)
    if (rule.hosts && rule.hosts.length > 0 && ctx.action === 'network') {
      const hostMatch = rule.hosts.some((pattern) => matchPattern(pattern, ctx.resource).matched);
      if (!hostMatch) return false;
    }

    return true;
  }

  /**
   * Evaluate permission using last-match-wins
   */
  evaluate(ctx: PermissionContext): { decision: PermissionDecision; rule?: PermissionRule } {
    // Check session grants first
    const sessionKey = `${ctx.toolName}:${ctx.action}:${ctx.resource}`;
    const sessionGrant = this.sessionGrants.get(sessionKey);
    if (sessionGrant !== undefined) {
      return { decision: sessionGrant ? 'allow' : 'deny' };
    }

    // Evaluate rules in order (last match wins)
    let lastMatch: { decision: PermissionDecision; rule: PermissionRule } | null = null;

    for (const rule of this.rules) {
      if (this.matchRule(ctx, rule)) {
        lastMatch = { decision: rule.decision, rule };
      }
    }

    // Default to "ask" if no rules match
    return lastMatch ?? { decision: 'ask' };
  }

  /**
   * Check permission with interactive ask flow
   * Enhanced with doom loop detection and external path checking
   */
  async check(ctx: PermissionContext): Promise<PermissionResult> {
    // Check for doom loop first
    const loopCheck = this.checkDoomLoop(ctx);
    if (loopCheck.isLoop) {
      const loopResult = this.handleDoomLoop(ctx, loopCheck.attempts);
      if (loopResult) {
        return loopResult;
      }
      // If onDetected is "ask", continue to ask user
      if (this.doomLoopConfig.onDetected === 'ask') {
        return this.askUser(ctx);
      }
    }

    // Check for external path access
    const externalResult = this.handleExternalPath(ctx);
    if (externalResult) {
      // Record the attempt before returning
      this.recordOperationAttempt(ctx);
      return externalResult;
    }

    const { decision, rule } = this.evaluate(ctx);

    if (decision === 'allow') {
      // Reset operation tracking on success
      const key = this.getOperationKey(ctx);
      this.recentOperations.delete(key);
      return { decision: 'allow', rule, granted: true };
    }

    if (decision === 'deny') {
      // Record the denied attempt
      this.recordOperationAttempt(ctx);
      return { decision: 'deny', rule, granted: false };
    }

    // Ask the user
    return this.askUser(ctx);
  }

  /**
   * Interactive ask flow - publishes event and waits for response
   */
  private async askUser(ctx: PermissionContext): Promise<PermissionResult> {
    const requestId = nanoid();

    // Check if this is a config file edit
    const isConfigEdit =
      (ctx.action === 'write' || ctx.action === 'admin') &&
      ConfigProtection.isRelative(ctx.resource);

    // For config edits, add metadata to disable "always allow" option
    const metadata = isConfigEdit ? ConfigProtection.getMetadata() : {};

    // Publish permission request event
    PermissionRequested.publish({
      id: requestId,
      toolName: ctx.toolName,
      action: ctx.action,
      resource: ctx.resource,
      description: ctx.description ?? `${ctx.action} on ${ctx.resource}`,
      timestamp: Date.now(),
      metadata,
    });

    try {
      // Wait for response
      const response = await waitForEvent(
        PermissionResponse,
        (r) => r.id === requestId,
        this.askTimeoutMs
      );

      // Remember for session if requested
      if (response.remember) {
        const sessionKey = `${ctx.toolName}:${ctx.action}:${ctx.resource}`;
        this.sessionGrants.set(sessionKey, response.granted);
      }

      if (response.granted) {
        // Reset operation tracking on user approval
        const key = this.getOperationKey(ctx);
        this.recentOperations.delete(key);
      } else {
        // Record the denied attempt
        this.recordOperationAttempt(ctx);
      }

      return {
        decision: response.granted ? 'allow' : 'deny',
        granted: response.granted,
      };
    } catch {
      // Timeout - deny by default, record the attempt
      this.recordOperationAttempt(ctx);
      return { decision: 'deny', granted: false };
    }
  }

  /**
   * Grant permission for current session
   */
  grantSession(ctx: PermissionContext): void {
    const sessionKey = `${ctx.toolName}:${ctx.action}:${ctx.resource}`;
    this.sessionGrants.set(sessionKey, true);
  }

  /**
   * Revoke session permission
   */
  revokeSession(ctx: PermissionContext): void {
    const sessionKey = `${ctx.toolName}:${ctx.action}:${ctx.resource}`;
    this.sessionGrants.delete(sessionKey);
  }

  /**
   * Clear all session grants
   */
  clearSession(): void {
    this.sessionGrants.clear();
  }

  /**
   * Enable or disable "allow everything" mode
   * When enabled, all permission checks will pass automatically
   */
  private allowEverythingEnabled: boolean = false;

  setAllowEverything(enable: boolean): void {
    this.allowEverythingEnabled = enable;
    if (enable) {
      // Add a catch-all rule with highest priority
      this.addRule({
        id: 'allow-everything',
        name: 'Allow Everything',
        description: 'Temporary rule to allow all operations',
        decision: 'allow',
        priority: 10000,
      });
    } else {
      // Remove the catch-all rule
      this.removeRule('allow-everything');
    }
  }

  getAllowEverything(): boolean {
    return this.allowEverythingEnabled;
  }

  /**
   * Load rules from config
   */
  static fromConfig(config: unknown): PermissionManager {
    const rules = z.array(PermissionRuleSchema).parse(config);
    return new PermissionManager(rules);
  }
}

// Default permission rules for common scenarios
export const defaultRules: PermissionRule[] = [
  // Allow reading most files
  {
    id: 'default-read-allow',
    name: 'Default Read Allow',
    description: 'Allow reading files in workspace',
    actions: ['read'],
    decision: 'allow',
    priority: 0,
  },
  // Deny sensitive files
  {
    id: 'deny-secrets',
    name: 'Deny Secrets',
    description: 'Deny access to secret files',
    paths: ['**/.env', '**/.env.*', '**/secrets.*', '**/*credential*', '**/*secret*'],
    decision: 'deny',
    priority: 100,
  },
  // Ask for write operations
  {
    id: 'ask-write',
    name: 'Ask for Write',
    description: 'Ask before writing files',
    actions: ['write'],
    decision: 'ask',
    priority: 10,
  },
  // Ask for execute operations
  {
    id: 'ask-execute',
    name: 'Ask for Execute',
    description: 'Ask before executing commands',
    actions: ['execute'],
    decision: 'ask',
    priority: 10,
  },
  // Allow safe commands
  {
    id: 'allow-safe-commands',
    name: 'Allow Safe Commands',
    description: 'Allow safe read-only commands',
    actions: ['execute'],
    commands: ['ls', 'pwd', 'cat', 'head', 'tail', 'grep', 'find', 'wc', 'file', 'which', 'echo'],
    decision: 'allow',
    priority: 50,
  },
  // Deny dangerous commands
  {
    id: 'deny-dangerous',
    name: 'Deny Dangerous Commands',
    description: 'Deny dangerous commands',
    actions: ['execute'],
    commands: ['rm -rf /', 'rm -rf /*', 'dd', 'mkfs*', '> /dev/*'],
    decision: 'deny',
    priority: 100,
  },
];

// Global permission manager instance
let globalPermissionManager: PermissionManager | null = null;

export function getPermissionManager(): PermissionManager {
  if (!globalPermissionManager) {
    globalPermissionManager = new PermissionManager(defaultRules);
  }
  return globalPermissionManager;
}

export function setPermissionManager(manager: PermissionManager): void {
  globalPermissionManager = manager;
}

// Export prompt functionality
export { startPermissionPromptHandler, isPermissionPromptSupported } from './prompt.js';
