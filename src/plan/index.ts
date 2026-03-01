/**
 * Plan Mode System
 * Provides a read-only analysis mode where the AI can plan but not execute changes
 * Inspired by OpenCode's dual-agent system (Plan Mode vs Build Mode)
 */

import { z } from "zod"
import { defineEvent, type BusEvent } from "../bus/index.js"

// ============ Types ============

/** Operation types that can be checked against plan mode restrictions */
export type OperationType = "read" | "write" | "execute"

/** Mode types for the plan system */
export type PlanMode = "plan" | "build"

// ============ Events ============

/**
 * Event emitted when the mode changes between plan and build
 */
export const ModeChanged = defineEvent(
  "plan.mode.changed",
  z.object({
    previousMode: z.enum(["plan", "build"]),
    newMode: z.enum(["plan", "build"]),
    timestamp: z.number(),
  })
)

/**
 * Event emitted when an operation is blocked due to plan mode restrictions
 */
export const OperationBlocked = defineEvent(
  "plan.operation.blocked",
  z.object({
    operation: z.enum(["read", "write", "execute"]),
    toolName: z.string(),
    reason: z.string(),
    timestamp: z.number(),
  })
)

// ============ Constants ============

/**
 * Tools allowed in plan mode (read-only analysis tools)
 */
const PLAN_MODE_ALLOWED_TOOLS = [
  "read",
  "glob",
  "grep",
  "webfetch",
  "question",
] as const

/**
 * Tools blocked in plan mode (write/execute tools)
 */
const PLAN_MODE_BLOCKED_TOOLS = [
  "write",
  "edit",
  "bash",
  "todowrite",
] as const

/**
 * System prompt addition for plan mode
 */
const PLAN_MODE_SYSTEM_PROMPT = `You are in PLAN MODE. You can analyze and plan, but CANNOT make changes.

Your task is to:
1. Understand the request
2. Analyze the codebase
3. Create a detailed plan of what changes would be needed

Output your plan as:
## Plan
1. [Step 1]
2. [Step 2]
...

## Files to Modify
- path/to/file.ts: [description of changes]

## Files to Create
- path/to/new.ts: [description]

## Potential Risks
- [Risk 1]
- [Risk 2]

## Estimated Complexity
[Low/Medium/High] - [Brief justification]

You CANNOT execute any write operations in this mode. Use /mode build to switch to build mode and execute the plan.`

/**
 * System prompt addition for build mode
 */
const BUILD_MODE_SYSTEM_PROMPT = `You are in BUILD MODE. You have full access to read, write, and execute operations.

You can:
- Read and analyze files
- Write new files
- Edit existing files
- Execute bash commands
- Use all available tools

Proceed with caution when making changes. Consider running in plan mode first (/mode plan) if you want to analyze before making changes.`

// ============ Plan Mode Manager ============

/**
 * Manages the plan/build mode state and enforces restrictions
 * 
 * @example
 * ```ts
 * const manager = getPlanModeManager()
 * 
 * // Check current mode
 * if (manager.isPlanMode()) {
 *   console.log("Read-only mode active")
 * }
 * 
 * // Toggle mode
 * const newMode = manager.toggle()
 * console.log(`Switched to ${newMode} mode`)
 * 
 * // Check if operation is allowed
 * if (!manager.canExecute("write")) {
 *   console.log("Write operations blocked in plan mode")
 * }
 * ```
 */
export class PlanModeManager {
  /** Current mode state */
  private mode: PlanMode = "build"

  /**
   * Toggle between plan and build modes
   * @returns The new mode after toggling
   */
  toggle(): PlanMode {
    const previousMode = this.mode
    this.mode = this.mode === "plan" ? "build" : "plan"

    ModeChanged.publish({
      previousMode,
      newMode: this.mode,
      timestamp: Date.now(),
    })

    return this.mode
  }

  /**
   * Get the current mode
   * @returns Current mode ("plan" or "build")
   */
  getMode(): PlanMode {
    return this.mode
  }

  /**
   * Set mode explicitly
   * @param mode - The mode to set ("plan" or "build")
   */
  setMode(mode: PlanMode): void {
    if (this.mode !== mode) {
      const previousMode = this.mode
      this.mode = mode

      ModeChanged.publish({
        previousMode,
        newMode: this.mode,
        timestamp: Date.now(),
      })
    }
  }

  /**
   * Check if current mode allows a specific operation type
   * @param operation - The operation type to check ("read", "write", or "execute")
   * @returns true if the operation is allowed in current mode
   */
  canExecute(operation: OperationType): boolean {
    if (this.mode === "build") {
      return true
    }

    // Plan mode only allows read operations
    return operation === "read"
  }

  /**
   * Check if a specific tool is allowed in current mode
   * @param toolName - The name of the tool to check
   * @returns true if the tool is allowed in current mode
   */
  isToolAllowed(toolName: string): boolean {
    if (this.mode === "build") {
      return true
    }

    // Check against allowed tools list
    return (PLAN_MODE_ALLOWED_TOOLS as readonly string[]).includes(toolName)
  }

  /**
   * Get the appropriate system prompt addition for current mode
   * @returns System prompt string to append to base prompt
   */
  getModePrompt(): string {
    return this.mode === "plan"
      ? PLAN_MODE_SYSTEM_PROMPT
      : BUILD_MODE_SYSTEM_PROMPT
  }

  /**
   * Get list of allowed tools for current mode
   * @returns Array of allowed tool names
   */
  getAllowedTools(): string[] {
    if (this.mode === "build") {
      // Build mode allows all tools - return empty to indicate no restrictions
      return []
    }

    return [...PLAN_MODE_ALLOWED_TOOLS]
  }

  /**
   * Get list of blocked tools for current mode
   * @returns Array of blocked tool names
   */
  getBlockedTools(): string[] {
    if (this.mode === "build") {
      return []
    }

    return [...PLAN_MODE_BLOCKED_TOOLS]
  }

  /**
   * Attempt to execute a tool and emit blocked event if not allowed
   * @param toolName - Name of the tool being executed
   * @returns true if tool execution should proceed, false if blocked
   */
  checkToolExecution(toolName: string): boolean {
    if (this.isToolAllowed(toolName)) {
      return true
    }

    // Determine operation type from tool name
    const operation = this.getOperationTypeForTool(toolName)

    OperationBlocked.publish({
      operation,
      toolName,
      reason: `Tool '${toolName}' is blocked in plan mode. Switch to build mode with /mode build to execute.`,
      timestamp: Date.now(),
    })

    return false
  }

  /**
   * Get the operation type for a given tool
   * @param toolName - Name of the tool
   * @returns The operation type for the tool
   */
  private getOperationTypeForTool(toolName: string): OperationType {
    switch (toolName) {
      case "write":
      case "edit":
      case "todowrite":
        return "write"
      case "bash":
        return "execute"
      default:
        return "read"
    }
  }
}

// ============ Singleton Instance ============

let instance: PlanModeManager | null = null

/**
 * Get the singleton PlanModeManager instance
 * @returns The global PlanModeManager instance
 */
export function getPlanModeManager(): PlanModeManager {
  if (!instance) {
    instance = new PlanModeManager()
  }
  return instance
}

// ============ Helper Functions ============

/**
 * Quick check if currently in plan mode
 * @returns true if in plan mode, false if in build mode
 */
export function isPlanMode(): boolean {
  return getPlanModeManager().getMode() === "plan"
}

/**
 * Quick check if currently in build mode
 * @returns true if in build mode, false if in plan mode
 */
export function isBuildMode(): boolean {
  return getPlanModeManager().getMode() === "build"
}

/**
 * Get the mode indicator string for UI display
 * @returns "[PLAN]" if in plan mode, "[BUILD]" if in build mode
 */
export function getPlanModeIndicator(): string {
  return isPlanMode() ? "[PLAN]" : "[BUILD]"
}

/**
 * Wrapper that checks plan mode before executing an operation
 * 
 * @param operation - The operation type being performed
 * @param handler - The function to execute if allowed
 * @returns Result of handler or error object if blocked
 * 
 * @example
 * ```ts
 * const result = await withPlanModeCheck("write", async () => {
 *   // This will only execute if not in plan mode
 *   await writeFile(path, content)
 *   return { success: true }
 * })
 * 
 * if (!result.allowed) {
 *   console.log("Operation blocked:", result.reason)
 * }
 * ```
 */
export async function withPlanModeCheck<T>(
  operation: OperationType,
  handler: () => Promise<T>
): Promise<{ allowed: true; result: T } | { allowed: false; reason: string }> {
  const manager = getPlanModeManager()

  if (!manager.canExecute(operation)) {
    return {
      allowed: false,
      reason: `Operation '${operation}' is blocked in plan mode. Switch to build mode to proceed.`,
    }
  }

  const result = await handler()
  return { allowed: true, result }
}

/**
 * Synchronous wrapper that checks plan mode before executing an operation
 * 
 * @param operation - The operation type being performed
 * @param handler - The function to execute if allowed
 * @returns Result of handler or error object if blocked
 */
export function withPlanModeCheckSync<T>(
  operation: OperationType,
  handler: () => T
): { allowed: true; result: T } | { allowed: false; reason: string } {
  const manager = getPlanModeManager()

  if (!manager.canExecute(operation)) {
    return {
      allowed: false,
      reason: `Operation '${operation}' is blocked in plan mode. Switch to build mode to proceed.`,
    }
  }

  const result = handler()
  return { allowed: true, result }
}

/**
 * Decorator-style wrapper for tool execution with plan mode check
 * 
 * @param toolName - Name of the tool being executed
 * @param handler - The tool execution function
 * @returns Result of handler or error result if blocked
 */
export async function withToolCheck<T>(
  toolName: string,
  handler: () => Promise<T>
): Promise<T | { success: false; error: string }> {
  const manager = getPlanModeManager()

  if (!manager.checkToolExecution(toolName)) {
    return {
      success: false,
      error: `Tool '${toolName}' is blocked in plan mode. Use /mode build to switch to build mode.`,
    }
  }

  return handler()
}

// ============ Mode Configuration ============

/**
 * Configuration for plan mode behavior
 */
export interface PlanModeConfig {
  /** Allow bash commands that are read-only (like git status, ls) */
  allowReadOnlyBash: boolean
  /** Custom list of additional allowed tools */
  additionalAllowedTools: string[]
  /** Custom system prompt override */
  customPlanPrompt?: string
}

const defaultConfig: PlanModeConfig = {
  allowReadOnlyBash: false,
  additionalAllowedTools: [],
}

let currentConfig = { ...defaultConfig }

/**
 * Configure plan mode behavior
 * @param config - Partial configuration to merge
 */
export function configurePlanMode(config: Partial<PlanModeConfig>): void {
  currentConfig = { ...currentConfig, ...config }
}

/**
 * Get current plan mode configuration
 * @returns Current configuration
 */
export function getPlanModeConfig(): PlanModeConfig {
  return { ...currentConfig }
}

/**
 * Reset plan mode configuration to defaults
 */
export function resetPlanModeConfig(): void {
  currentConfig = { ...defaultConfig }
}

// ============ Exports ============

export {
  PLAN_MODE_ALLOWED_TOOLS,
  PLAN_MODE_BLOCKED_TOOLS,
  PLAN_MODE_SYSTEM_PROMPT,
  BUILD_MODE_SYSTEM_PROMPT,
}
