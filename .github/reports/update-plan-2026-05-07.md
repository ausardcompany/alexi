# Update Plan for Alexi

Generated: 2026-05-07
Based on upstream commits: kilocode c1ea8100e (812 commits from 2a6c3e7d5)

## Summary
- Total changes planned: 47
- Critical: 5 | High: 15 | Medium: 20 | Low: 7

## Changes

### 1. Add Agent Manager Tool
**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: feature
**Reason**: New tool for managing agent worktrees and parallel task execution from kilocode

**New code**:
```typescript
import { Schema } from "effect"
import { Tool } from "./tool"

export const AgentManagerTool = Tool.define({
  name: "agent_manager",
  description: "Manage agent worktrees for parallel task execution",
  parameters: Schema.Struct({
    action: Schema.Literal("create", "list", "delete", "switch"),
    worktree_id: Schema.optional(Schema.String),
    task_description: Schema.optional(Schema.String),
    branch_name: Schema.optional(Schema.String),
  }),
  async execute(params, context) {
    const { action, worktree_id, task_description, branch_name } = params
    
    switch (action) {
      case "create":
        return await context.worktreeManager.create({
          taskDescription: task_description,
          branchName: branch_name,
        })
      case "list":
        return await context.worktreeManager.list()
      case "delete":
        if (!worktree_id) throw new Error("worktree_id required for delete")
        return await context.worktreeManager.delete(worktree_id)
      case "switch":
        if (!worktree_id) throw new Error("worktree_id required for switch")
        return await context.worktreeManager.switch(worktree_id)
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  },
})
```

### 2. Update Bash Tool with Enhanced Shell Operator Blocking
**File**: `src/tool/bash.ts`
**Priority**: critical
**Type**: security
**Reason**: Security fix to block shell separators and dangerous operators

**Current code**:
```typescript
function validateCommand(command: string): void {
  // Basic validation
  if (command.includes("rm -rf /")) {
    throw new Error("Dangerous command detected")
  }
}
```

**New code**:
```typescript
const BLOCKED_OPERATORS = [
  "&&", "||", ";", "|", 
  "$(", "`",
  ">", ">>", "<", "<<",
  "&",
]

const BLOCKED_SORT_FLAGS = ["-o", "--output"]

function validateCommand(command: string): void {
  // Block shell separators and operators
  for (const op of BLOCKED_OPERATORS) {
    if (command.includes(op)) {
      throw new Error(`Shell operator '${op}' is not allowed for security reasons`)
    }
  }
  
  // Block dangerous sort output flags
  const tokens = command.split(/\s+/)
  if (tokens[0] === "sort") {
    for (const flag of BLOCKED_SORT_FLAGS) {
      if (tokens.includes(flag)) {
        throw new Error(`Sort flag '${flag}' is not allowed`)
      }
    }
  }
  
  // Block dangerous rm commands
  if (command.includes("rm -rf /")) {
    throw new Error("Dangerous command detected")
  }
}

function iterateBashNodes(
  command: string,
  callback: (node: SyntaxNode) => void
): void {
  const parser = new Parser()
  parser.setLanguage(BashLanguage)
  const tree = parser.parse(command)
  
  try {
    const cursor = tree.walk()
    do {
      callback(cursor.currentNode)
    } while (cursor.gotoNextSibling() || cursor.gotoParent())
  } finally {
    // Memory leak fix - release parsed syntax trees
    tree.delete()
  }
}
```

### 3. Update Tool Schema to Use Effect Schema
**File**: `src/tool/tool.ts`
**Priority**: high
**Type**: refactor
**Reason**: Migration from Zod to Effect Schema for consistency with upstream

**Current code**:
```typescript
import { z } from "zod"

export const ToolParametersSchema = z.object({
  name: z.string(),
  description: z.string(),
})
```

**New code**:
```typescript
import { Schema } from "effect"

export const ToolParametersSchema = Schema.Struct({
  name: Schema.String,
  description: Schema.String,
})

export type ToolParameters = Schema.Schema.Type<typeof ToolParametersSchema>

// Helper for Zod compatibility during migration
export function schemaToJsonSchema<A, I>(schema: Schema.Schema<A, I>) {
  return Schema.JSONSchema.make(schema)
}
```

### 4. Add Configurable Tool Output Truncation
**File**: `src/tool/truncate.ts`
**Priority**: medium
**Type**: feature
**Reason**: Allow configuring tool output truncation limits per upstream changes

**Current code**:
```typescript
const DEFAULT_MAX_OUTPUT = 10000

export function truncateOutput(output: string): string {
  if (output.length > DEFAULT_MAX_OUTPUT) {
    return output.slice(0, DEFAULT_MAX_OUTPUT) + "\n... (truncated)"
  }
  return output
}
```

**New code**:
```typescript
import { Schema } from "effect"

export const TruncationConfigSchema = Schema.Struct({
  maxOutputLength: Schema.optional(Schema.Number.pipe(
    Schema.positive()
  )),
  maxLineCount: Schema.optional(Schema.Number.pipe(
    Schema.positive()
  )),
  preserveEnds: Schema.optional(Schema.Boolean),
})

export type TruncationConfig = Schema.Schema.Type<typeof TruncationConfigSchema>

const DEFAULT_CONFIG: Required<TruncationConfig> = {
  maxOutputLength: 10000,
  maxLineCount: 500,
  preserveEnds: true,
}

export function truncateOutput(
  output: string, 
  config: TruncationConfig = {}
): string {
  const { maxOutputLength, maxLineCount, preserveEnds } = {
    ...DEFAULT_CONFIG,
    ...config,
  }
  
  const lines = output.split("\n")
  
  // Truncate by line count first
  if (lines.length > maxLineCount) {
    if (preserveEnds) {
      const half = Math.floor(maxLineCount / 2)
      const head = lines.slice(0, half)
      const tail = lines.slice(-half)
      output = [...head, `\n... (${lines.length - maxLineCount} lines omitted) ...\n`, ...tail].join("\n")
    } else {
      output = lines.slice(0, maxLineCount).join("\n") + "\n... (truncated)"
    }
  }
  
  // Then truncate by character count
  if (output.length > maxOutputLength) {
    if (preserveEnds) {
      const half = Math.floor(maxOutputLength / 2)
      output = output.slice(0, half) + "\n... (truncated) ...\n" + output.slice(-half)
    } else {
      output = output.slice(0, maxOutputLength) + "\n... (truncated)"
    }
  }
  
  return output
}
```

### 5. Update Read Tool with External Directory Support
**File**: `src/tool/read.ts`
**Priority**: high
**Type**: feature
**Reason**: Honor external directory allows in Ask mode per upstream fix

**Current code**:
```typescript
export async function readFile(path: string, context: ToolContext): Promise<string> {
  const resolvedPath = resolvePath(path, context.workingDirectory)
  
  if (!isWithinWorkspace(resolvedPath, context.workspaceRoot)) {
    throw new Error("Cannot read files outside workspace")
  }
  
  return await fs.readFile(resolvedPath, "utf-8")
}
```

**New code**:
```typescript
import { isExternalDirectoryAllowed } from "../permission/external-directory"

export async function readFile(path: string, context: ToolContext): Promise<string> {
  const resolvedPath = resolvePath(path, context.workingDirectory)
  
  const withinWorkspace = isWithinWorkspace(resolvedPath, context.workspaceRoot)
  const externalAllowed = await isExternalDirectoryAllowed(resolvedPath, context.config)
  
  if (!withinWorkspace && !externalAllowed) {
    throw new Error("Cannot read files outside workspace without explicit permission")
  }
  
  // For external directories, only allow read operations (not write)
  if (!withinWorkspace && context.mode === "ask") {
    // Ask mode can read external allowed directories
    return await fs.readFile(resolvedPath, "utf-8")
  }
  
  if (!withinWorkspace) {
    throw new Error("Write operations not allowed on external directories")
  }
  
  return await fs.readFile(resolvedPath, "utf-8")
}
```

### 6. Add External Directory Permission Module
**File**: `src/permission/external-directory.ts`
**Priority**: high
**Type**: feature
**Reason**: New permission module for external directory access control

**New code**:
```typescript
import { Schema } from "effect"
import * as path from "path"

export const ExternalDirectoryRuleSchema = Schema.Struct({
  path: Schema.String,
  mode: Schema.Literal("read", "write", "deny"),
})

export type ExternalDirectoryRule = Schema.Schema.Type<typeof ExternalDirectoryRuleSchema>

export interface ExternalDirectoryConfig {
  allowedDirectories?: ExternalDirectoryRule[]
}

export async function isExternalDirectoryAllowed(
  filePath: string,
  config: ExternalDirectoryConfig
): Promise<boolean> {
  const { allowedDirectories = [] } = config
  
  const normalizedPath = path.normalize(filePath)
  
  for (const rule of allowedDirectories) {
    const normalizedRule = path.normalize(rule.path)
    
    if (normalizedPath.startsWith(normalizedRule)) {
      return rule.mode !== "deny"
    }
  }
  
  return false
}

export function getExternalDirectoryMode(
  filePath: string,
  config: ExternalDirectoryConfig
): "read" | "write" | "deny" | null {
  const { allowedDirectories = [] } = config
  
  const normalizedPath = path.normalize(filePath)
  
  for (const rule of allowedDirectories) {
    const normalizedRule = path.normalize(rule.path)
    
    if (normalizedPath.startsWith(normalizedRule)) {
      return rule.mode
    }
  }
  
  return null
}
```

### 7. Update Permission Evaluation with User Overrides
**File**: `src/permission/evaluate.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Fix to ensure user permission overrides apply correctly (commit c1ea8100e)

**Current code**:
```typescript
export function evaluatePermission(
  request: PermissionRequest,
  rules: PermissionRule[]
): PermissionResult {
  for (const rule of rules) {
    if (matchesRule(request, rule)) {
      return rule.effect
    }
  }
  return "deny"
}
```

**New code**:
```typescript
export function evaluatePermission(
  request: PermissionRequest,
  rules: PermissionRule[],
  userOverrides?: PermissionRule[]
): PermissionResult {
  // User overrides take precedence
  if (userOverrides) {
    for (const override of userOverrides) {
      if (matchesRule(request, override)) {
        return override.effect
      }
    }
  }
  
  // Then check standard rules
  for (const rule of rules) {
    if (matchesRule(request, rule)) {
      return rule.effect
    }
  }
  
  return "deny"
}

export function mergePermissionRules(
  baseRules: PermissionRule[],
  userOverrides: PermissionRule[]
): PermissionRule[] {
  // User overrides are prepended to take precedence
  return [...userOverrides, ...baseRules]
}
```

### 8. Add Permission Rule Schema
**File**: `src/permission/rule.ts`
**Priority**: medium
**Type**: feature
**Reason**: New permission rule definitions from upstream

**New code**:
```typescript
import { Schema } from "effect"

export const PermissionEffectSchema = Schema.Literal("allow", "deny", "ask")
export type PermissionEffect = Schema.Schema.Type<typeof PermissionEffectSchema>

export const PermissionRuleSchema = Schema.Struct({
  tool: Schema.optional(Schema.String),
  toolPattern: Schema.optional(Schema.String),
  path: Schema.optional(Schema.String),
  pathPattern: Schema.optional(Schema.String),
  command: Schema.optional(Schema.String),
  commandPattern: Schema.optional(Schema.String),
  effect: PermissionEffectSchema,
  reason: Schema.optional(Schema.String),
})

export type PermissionRule = Schema.Schema.Type<typeof PermissionRuleSchema>

export function matchesRule(
  request: { tool?: string; path?: string; command?: string },
  rule: PermissionRule
): boolean {
  // Exact matches
  if (rule.tool && request.tool !== rule.tool) return false
  if (rule.path && request.path !== rule.path) return false
  if (rule.command && request.command !== rule.command) return false
  
  // Pattern matches
  if (rule.toolPattern && !matchPattern(request.tool, rule.toolPattern)) return false
  if (rule.pathPattern && !matchPattern(request.path, rule.pathPattern)) return false
  if (rule.commandPattern && !matchPattern(request.command, rule.commandPattern)) return false
  
  return true
}

function matchPattern(value: string | undefined, pattern: string): boolean {
  if (!value) return false
  const regex = new RegExp(pattern)
  return regex.test(value)
}
```

### 9. Update Agent Configuration with Nullable Steps
**File**: `src/agent/index.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Preserve null sentinel for agent steps config per upstream fix

**Current code**:
```typescript
export interface AgentConfig {
  name: string
  model: string
  steps?: AgentStep[]
}

export function normalizeAgentConfig(config: AgentConfig): AgentConfig {
  return {
    ...config,
    steps: config.steps || [],
  }
}
```

**New code**:
```typescript
import { Schema } from "effect"

export const AgentStepSchema = Schema.Struct({
  name: Schema.String,
  tool: Schema.String,
  parameters: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown })),
})

export const AgentConfigSchema = Schema.Struct({
  name: Schema.String,
  model: Schema.String,
  // null means "use defaults", undefined means "not specified", [] means "no steps"
  steps: Schema.optional(Schema.NullOr(Schema.Array(AgentStepSchema))),
  enabled: Schema.optional(Schema.NullOr(Schema.Boolean)),
})

export type AgentConfig = Schema.Schema.Type<typeof AgentConfigSchema>

export function normalizeAgentConfig(config: AgentConfig): AgentConfig {
  return {
    ...config,
    // Preserve null sentinel - don't convert to empty array
    steps: config.steps === undefined ? undefined : config.steps,
    // Preserve null for enabled toggle
    enabled: config.enabled === undefined ? undefined : config.enabled,
  }
}
```

### 10. Add LSP Workspace Symbol Query Support
**File**: `src/tool/lsp.ts`
{"prompt_tokens":102804,"completion_tokens":4096,"total_tokens":106900}

[Session: 2ca0d5ee-aa1c-43e3-a0c8-c4447eded41a]
[Messages: 2, Tokens: 106900]
