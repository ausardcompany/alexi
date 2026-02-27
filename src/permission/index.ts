/**
 * Permission System
 * Last-match-wins rule evaluation with interactive ask flow
 * Based on kilocode/opencode permission patterns
 */

import { z } from "zod"
import { nanoid } from "nanoid"
import { matchPattern, matchPatterns, matchCommand, isUnderDirectory } from "./wildcard.js"
import { PermissionRequested, PermissionResponse, waitForEvent } from "../bus/index.js"

// Permission action types
export type PermissionAction = "read" | "write" | "execute" | "network" | "admin"

// Permission decision
export type PermissionDecision = "allow" | "deny" | "ask"

// Rule schema
export const PermissionRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  // Matching criteria
  tools: z.array(z.string()).optional(), // Tool name patterns
  actions: z.array(z.enum(["read", "write", "execute", "network", "admin"])).optional(),
  paths: z.array(z.string()).optional(), // File path patterns
  commands: z.array(z.string()).optional(), // Command patterns
  hosts: z.array(z.string()).optional(), // Network host patterns
  // Decision
  decision: z.enum(["allow", "deny", "ask"]),
  // Priority (higher = evaluated later in last-match-wins)
  priority: z.number().default(0),
})

export type PermissionRule = z.infer<typeof PermissionRuleSchema>

// Permission request context
export interface PermissionContext {
  toolName: string
  action: PermissionAction
  resource: string // Path, command, URL, etc.
  description?: string
}

// Permission check result
export interface PermissionResult {
  decision: PermissionDecision
  rule?: PermissionRule
  granted: boolean
}

// Permission manager class
export class PermissionManager {
  private rules: PermissionRule[] = []
  private sessionGrants: Map<string, boolean> = new Map()
  private askTimeoutMs: number = 60000 // 1 minute timeout for ask prompts

  constructor(rules: PermissionRule[] = []) {
    this.rules = this.sortRules(rules)
  }

  /**
   * Sort rules by priority (ascending for last-match-wins)
   */
  private sortRules(rules: PermissionRule[]): PermissionRule[] {
    return [...rules].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
  }

  /**
   * Add a permission rule
   */
  addRule(rule: PermissionRule): void {
    const validated = PermissionRuleSchema.parse(rule)
    this.rules.push(validated)
    this.rules = this.sortRules(this.rules)
  }

  /**
   * Remove a rule by id
   */
  removeRule(ruleId: string): boolean {
    const idx = this.rules.findIndex((r) => r.id === ruleId)
    if (idx >= 0) {
      this.rules.splice(idx, 1)
      return true
    }
    return false
  }

  /**
   * Get all rules
   */
  getRules(): PermissionRule[] {
    return [...this.rules]
  }

  /**
   * Check if a context matches a rule
   */
  private matchRule(ctx: PermissionContext, rule: PermissionRule): boolean {
    // Check tool name
    if (rule.tools && rule.tools.length > 0) {
      const matches = rule.tools.some(
        (pattern) => matchPattern(pattern, ctx.toolName).matched
      )
      if (!matches) return false
    }

    // Check action
    if (rule.actions && rule.actions.length > 0) {
      if (!rule.actions.includes(ctx.action)) return false
    }

    // Check paths (for file operations)
    if (rule.paths && rule.paths.length > 0 && ctx.action !== "network") {
      const pathMatch = matchPatterns(rule.paths, ctx.resource)
      if (!pathMatch.matched) return false
    }

    // Check commands (for execute actions)
    if (rule.commands && rule.commands.length > 0 && ctx.action === "execute") {
      if (!matchCommand(ctx.resource, rule.commands)) return false
    }

    // Check hosts (for network actions)
    if (rule.hosts && rule.hosts.length > 0 && ctx.action === "network") {
      const hostMatch = rule.hosts.some(
        (pattern) => matchPattern(pattern, ctx.resource).matched
      )
      if (!hostMatch) return false
    }

    return true
  }

  /**
   * Evaluate permission using last-match-wins
   */
  evaluate(ctx: PermissionContext): { decision: PermissionDecision; rule?: PermissionRule } {
    // Check session grants first
    const sessionKey = `${ctx.toolName}:${ctx.action}:${ctx.resource}`
    const sessionGrant = this.sessionGrants.get(sessionKey)
    if (sessionGrant !== undefined) {
      return { decision: sessionGrant ? "allow" : "deny" }
    }

    // Evaluate rules in order (last match wins)
    let lastMatch: { decision: PermissionDecision; rule: PermissionRule } | null = null

    for (const rule of this.rules) {
      if (this.matchRule(ctx, rule)) {
        lastMatch = { decision: rule.decision, rule }
      }
    }

    // Default to "ask" if no rules match
    return lastMatch ?? { decision: "ask" }
  }

  /**
   * Check permission with interactive ask flow
   */
  async check(ctx: PermissionContext): Promise<PermissionResult> {
    const { decision, rule } = this.evaluate(ctx)

    if (decision === "allow") {
      return { decision: "allow", rule, granted: true }
    }

    if (decision === "deny") {
      return { decision: "deny", rule, granted: false }
    }

    // Ask the user
    return this.askUser(ctx)
  }

  /**
   * Interactive ask flow - publishes event and waits for response
   */
  private async askUser(ctx: PermissionContext): Promise<PermissionResult> {
    const requestId = nanoid()

    // Publish permission request event
    PermissionRequested.publish({
      id: requestId,
      toolName: ctx.toolName,
      action: ctx.action,
      resource: ctx.resource,
      description: ctx.description ?? `${ctx.action} on ${ctx.resource}`,
      timestamp: Date.now(),
    })

    try {
      // Wait for response
      const response = await waitForEvent(
        PermissionResponse,
        (r) => r.id === requestId,
        this.askTimeoutMs
      )

      // Remember for session if requested
      if (response.remember) {
        const sessionKey = `${ctx.toolName}:${ctx.action}:${ctx.resource}`
        this.sessionGrants.set(sessionKey, response.granted)
      }

      return {
        decision: response.granted ? "allow" : "deny",
        granted: response.granted,
      }
    } catch {
      // Timeout - deny by default
      return { decision: "deny", granted: false }
    }
  }

  /**
   * Grant permission for current session
   */
  grantSession(ctx: PermissionContext): void {
    const sessionKey = `${ctx.toolName}:${ctx.action}:${ctx.resource}`
    this.sessionGrants.set(sessionKey, true)
  }

  /**
   * Revoke session permission
   */
  revokeSession(ctx: PermissionContext): void {
    const sessionKey = `${ctx.toolName}:${ctx.action}:${ctx.resource}`
    this.sessionGrants.delete(sessionKey)
  }

  /**
   * Clear all session grants
   */
  clearSession(): void {
    this.sessionGrants.clear()
  }

  /**
   * Load rules from config
   */
  static fromConfig(config: unknown): PermissionManager {
    const rules = z.array(PermissionRuleSchema).parse(config)
    return new PermissionManager(rules)
  }
}

// Default permission rules for common scenarios
export const defaultRules: PermissionRule[] = [
  // Allow reading most files
  {
    id: "default-read-allow",
    name: "Default Read Allow",
    description: "Allow reading files in workspace",
    actions: ["read"],
    decision: "allow",
    priority: 0,
  },
  // Deny sensitive files
  {
    id: "deny-secrets",
    name: "Deny Secrets",
    description: "Deny access to secret files",
    paths: ["**/.env", "**/.env.*", "**/secrets.*", "**/*credential*", "**/*secret*"],
    decision: "deny",
    priority: 100,
  },
  // Ask for write operations
  {
    id: "ask-write",
    name: "Ask for Write",
    description: "Ask before writing files",
    actions: ["write"],
    decision: "ask",
    priority: 10,
  },
  // Ask for execute operations
  {
    id: "ask-execute",
    name: "Ask for Execute",
    description: "Ask before executing commands",
    actions: ["execute"],
    decision: "ask",
    priority: 10,
  },
  // Allow safe commands
  {
    id: "allow-safe-commands",
    name: "Allow Safe Commands",
    description: "Allow safe read-only commands",
    actions: ["execute"],
    commands: ["ls", "pwd", "cat", "head", "tail", "grep", "find", "wc", "file", "which", "echo"],
    decision: "allow",
    priority: 50,
  },
  // Deny dangerous commands
  {
    id: "deny-dangerous",
    name: "Deny Dangerous Commands",
    description: "Deny dangerous commands",
    actions: ["execute"],
    commands: ["rm -rf /", "rm -rf /*", "dd", "mkfs*", "> /dev/*"],
    decision: "deny",
    priority: 100,
  },
]

// Global permission manager instance
let globalPermissionManager: PermissionManager | null = null

export function getPermissionManager(): PermissionManager {
  if (!globalPermissionManager) {
    globalPermissionManager = new PermissionManager(defaultRules)
  }
  return globalPermissionManager
}

export function setPermissionManager(manager: PermissionManager): void {
  globalPermissionManager = manager
}
