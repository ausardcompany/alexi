# Update Plan for Alexi

Generated: 2026-05-08
Based on upstream commits: kilocode 2a6c3e7d5..b6966f4c2 (996 commits)

## Summary
- Total changes planned: 47
- Critical: 5 | High: 15 | Medium: 18 | Low: 9

## Changes

### 1. Remove deprecated codesearch tool
**File**: `src/tool/codesearch.ts`
**Priority**: critical
**Type**: refactor
**Reason**: Upstream removed the codesearch tool entirely (packages/opencode/src/tool/codesearch.ts deleted). This tool was broken and replaced by other search mechanisms.

**Current code** (if exists):
```typescript
// Any codesearch tool implementation
```

**New code**:
```typescript
// DELETE THIS FILE - codesearch tool has been removed upstream
// Search functionality is now handled by grep, glob, and semantic-search tools
```

### 2. Update bash tool with enhanced shell operator protection
**File**: `src/tool/bash.ts`
**Priority**: critical
**Type**: security
**Reason**: Upstream added security hardening to deny shell operators and prevent command injection attacks.

**Current code**:
```typescript
export const bash = defineTool({
  name: "bash",
  // ... existing implementation
})
```

**New code**:
```typescript
import { Schema } from "effect"

// Shell operators that must be denied for security
const DENIED_OPERATORS = [';', '&&', '||', '|', '>', '>>', '<', '<<', '`', '$(' ]

function containsDeniedOperator(command: string): boolean {
  return DENIED_OPERATORS.some(op => command.includes(op))
}

export const BashInput = Schema.Struct({
  command: Schema.String.pipe(
    Schema.filter((cmd) => !containsDeniedOperator(cmd), {
      message: () => "Shell operators are not allowed for security reasons"
    })
  ),
  timeout: Schema.optional(Schema.Number),
  cwd: Schema.optional(Schema.String),
})

export const bash = defineTool({
  name: "bash",
  description: `Execute a bash command. Shell operators (;, &&, ||, |, >, <, etc.) are blocked for security.`,
  input: BashInput,
  execute: async (input, context) => {
    // Validate no shell operators
    if (containsDeniedOperator(input.command)) {
      return {
        success: false,
        error: "Shell operators are not allowed for security reasons",
      }
    }
    
    // ... rest of implementation with enhanced security
  }
})
```

### 3. Migrate tool schemas from Zod to Effect Schema
**File**: `src/tool/tool.ts`
**Priority**: critical
**Type**: refactor
**Reason**: Upstream migrated all 18 built-in tools from Zod to Effect Schema. This is a fundamental architectural change.

**Current code**:
```typescript
import { z } from "zod"

export const ToolInputSchema = z.object({
  // ...
})
```

**New code**:
```typescript
import { Schema } from "effect"

export const ToolInput = Schema.Struct({
  name: Schema.String,
  description: Schema.String,
  parameters: Schema.Record({ key: Schema.String, value: Schema.Unknown }),
})

export type ToolInput = Schema.Schema.Type<typeof ToolInput>

// Helper for defining tool schemas
export function defineToolSchema<A, I>(schema: Schema.Schema<A, I>) {
  return schema
}

// Schema validation helper
export function validateToolInput<A>(
  schema: Schema.Schema<A, unknown>,
  input: unknown
): A {
  return Schema.decodeUnknownSync(schema)(input)
}
```

### 4. Add truncation limit configuration for tool outputs
**File**: `src/tool/truncate.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added configurable tool output truncation limits (packages/opencode/src/tool/truncate.ts +24, -6).

**Current code**:
```typescript
const DEFAULT_TRUNCATION_LIMIT = 10000

export function truncateOutput(output: string): string {
  if (output.length > DEFAULT_TRUNCATION_LIMIT) {
    return output.slice(0, DEFAULT_TRUNCATION_LIMIT) + "\n... (truncated)"
  }
  return output
}
```

**New code**:
```typescript
import { Schema } from "effect"

export const TruncationConfig = Schema.Struct({
  maxLength: Schema.optional(Schema.Number.pipe(Schema.positive())),
  maxLines: Schema.optional(Schema.Number.pipe(Schema.positive())),
  preserveEnding: Schema.optional(Schema.Boolean),
})

export type TruncationConfig = Schema.Schema.Type<typeof TruncationConfig>

const DEFAULT_CONFIG: Required<TruncationConfig> = {
  maxLength: 10000,
  maxLines: 500,
  preserveEnding: true,
}

export function truncateOutput(
  output: string, 
  config: Partial<TruncationConfig> = {}
): string {
  const { maxLength, maxLines, preserveEnding } = { ...DEFAULT_CONFIG, ...config }
  
  let result = output
  
  // Truncate by lines first
  const lines = result.split('\n')
  if (lines.length > maxLines) {
    if (preserveEnding) {
      const keepStart = Math.floor(maxLines * 0.7)
      const keepEnd = maxLines - keepStart
      result = [
        ...lines.slice(0, keepStart),
        `\n... (${lines.length - maxLines} lines truncated) ...\n`,
        ...lines.slice(-keepEnd)
      ].join('\n')
    } else {
      result = lines.slice(0, maxLines).join('\n') + '\n... (truncated)'
    }
  }
  
  // Then truncate by length
  if (result.length > maxLength) {
    if (preserveEnding) {
      const keepStart = Math.floor(maxLength * 0.7)
      const keepEnd = maxLength - keepStart - 50 // space for message
      result = result.slice(0, keepStart) + 
        '\n... (truncated) ...\n' + 
        result.slice(-keepEnd)
    } else {
      result = result.slice(0, maxLength) + '\n... (truncated)'
    }
  }
  
  return result
}
```

### 5. Update read tool to prevent unsupported image formats
**File**: `src/tool/read.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream fixed issue where unsupported image formats were being sent to providers causing API errors.

**Current code**:
```typescript
export const read = defineTool({
  name: "read",
  // ...
})
```

**New code**:
```typescript
import { Schema } from "effect"

const SUPPORTED_IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'gif', 'webp'] as const
const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg', 
  'image/gif',
  'image/webp'
] as const

function isSupportedImageFormat(path: string): boolean {
  const ext = path.split('.').pop()?.toLowerCase()
  return ext ? SUPPORTED_IMAGE_FORMATS.includes(ext as any) : false
}

function isImageFile(path: string): boolean {
  const ext = path.split('.').pop()?.toLowerCase()
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tiff', 'svg', 'ico'].includes(ext || '')
}

export const ReadInput = Schema.Struct({
  path: Schema.String,
  offset: Schema.optional(Schema.Number.pipe(Schema.greaterThanOrEqualTo(0))),
  limit: Schema.optional(Schema.Number.pipe(Schema.positive())),
})

export const read = defineTool({
  name: "read",
  description: "Read file contents. Supports text files and common image formats (png, jpg, gif, webp).",
  input: ReadInput,
  execute: async (input, context) => {
    const { path, offset, limit } = input
    
    // Check if it's an image file
    if (isImageFile(path)) {
      if (!isSupportedImageFormat(path)) {
        return {
          success: false,
          error: `Unsupported image format. Supported formats: ${SUPPORTED_IMAGE_FORMATS.join(', ')}`,
        }
      }
      // Handle supported image - return base64 encoded
      // ... image handling logic
    }
    
    // Handle text file with offset support
    // offset of 0 is now explicitly allowed
    const effectiveOffset = offset ?? 0
    // ... rest of implementation
  }
})
```

### 6. Add LSP workspace symbol query support
**File**: `src/tool/lsp.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added workspace symbol query parameter to experimental LSP tool.

**Current code**:
```typescript
export const lsp = defineTool({
  name: "lsp",
  // ...
})
```

**New code**:
```typescript
import { Schema } from "effect"

export const LspInput = Schema.Struct({
  action: Schema.Literal("hover", "definition", "references", "symbols", "workspace-symbols"),
  path: Schema.optional(Schema.String),
  line: Schema.optional(Schema.Number),
  character: Schema.optional(Schema.Number),
  query: Schema.optional(Schema.String), // For workspace-symbols action
})

export const lsp = defineTool({
  name: "lsp",
  description: `Language Server Protocol operations:
- hover: Get hover information at position
- definition: Go to definition
- references: Find all references  
- symbols: List document symbols
- workspace-symbols: Search workspace symbols (requires query parameter)`,
  input: LspInput,
  execute: async (input, context) => {
    const { action, path, line, character, query } = input
    
    if (action === "workspace-symbols") {
      if (!query) {
        return {
          success: false,
          error: "workspace-symbols action requires a query parameter"
        }
      }
      // Pass query to LSP workspace symbol request
      return await context.lsp.workspaceSymbols(query)
    }
    
    // ... rest of implementation
  }
})
```

### 7. Add Agent Manager tool
**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added new Agent Manager tool for managing worktrees and parallel agent sessions.

**New code**:
```typescript
import { Schema } from "effect"
import { defineTool } from "./tool"

export const AgentManagerInput = Schema.Struct({
  action: Schema.Literal(
    "create-worktree",
    "list-worktrees", 
    "remove-worktree",
    "start-session",
    "stop-session",
    "list-sessions"
  ),
  worktreeName: Schema.optional(Schema.String),
  sessionId: Schema.optional(Schema.String),
  branch: Schema.optional(Schema.String),
  initialPrompt: Schema.optional(Schema.String),
})

export type AgentManagerInput = Schema.Schema.Type<typeof AgentManagerInput>

export const agentManager = defineTool({
  name: "agent_manager",
  description: `Manage parallel agent sessions in isolated git worktrees.
  
Actions:
- create-worktree: Create a new git worktree for isolated work
- list-worktrees: List all active worktrees
- remove-worktree: Remove a worktree and clean up
- start-session: Start a new agent session in a worktree
- stop-session: Stop a running agent session
- list-sessions: List all active sessions`,
  input: AgentManagerInput,
  execute: async (input, context) => {
    const { action, worktreeName, sessionId, branch, initialPrompt } = input
    
    switch (action) {
      case "create-worktree":
        if (!worktreeName) {
          return { success: false, error: "worktreeName required for create-worktree" }
        }
        return await context.agentManager.createWorktree(worktreeName, branch)
        
      case "list-worktrees":
        return await context.agentManager.listWorktrees()
        
      case "remove-worktree":
        if (!worktreeName) {
          return { success: false, error: "worktreeName required for remove-worktree" }
        }
        return await context.agentManager.removeWorktree(worktreeName)
        
      case "start-session":
        if (!worktreeName) {
          return { success: false, error: "worktreeName required for start-session" }
        }
        return await context.agentManager.startSession(worktreeName, initialPrompt)
        
      case "stop-session":
        if (!sessionId) {
          return { success: false, error: "sessionId required for stop-session" }
        }
        return await context.agentManager.stopSession(sessionId)
        
      case "list-sessions":
        return await context.agentManager.listSessions()
        
      default:
        return { success: false, error: `Unknown action: ${action}` }
    }
  }
})
```

### 8. Update permission system with external directory read support
**File**: `src/permission/external-directory.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added support for read-only external directory allows in Ask mode.

**New code**:
```typescript
import { Schema } from "effect"

export const ExternalDirectoryPermission = Schema.Struct({
  path: Schema.String,
  mode: Schema.Literal("read", "write", "read-write"),
  recursive: Schema.optional(Schema.Boolean),
})

export type ExternalDirectoryPermission = Schema.Schema.Type<typeof ExternalDirectoryPermission>

export interface ExternalDirectoryConfig {
  allows: ExternalDirectoryPermission[]
  defaultMode: "ask" | "deny"
}

export function isExternalPathAllowed(
  path: string,
  operation: "read" | "write",
  config: ExternalDirectoryConfig
): boolean {
  for (const allow of config.allows) {
    if (pathMatches(path, allow.path, allow.recursive ?? false)) {
      if (allow.mode === "read-write") return true
      if (allow.mode === operation) return true
      if (allow.mode === "read" && operation === "read") return true
    }
  }
  return false
}

function pathMatches(path: string, pattern: string, recursive: boolean): boolean {
  const normalizedPath = path.replace(/\\/g, '/')
  const normalizedPattern = pattern.replace(/\\/g, '/')
  
  if (recursive) {
    return normalizedPath.startsWith(normalizedPattern)
  }
  return normalizedPath === normalizedPattern || 
         normalizedPath.startsWith(normalizedPattern + '/')
}
```

### 9. Add permission rule system with always-allow rules
**File**: `src/permission/rule.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added permission rule system with always-allow rules for specific patterns.

**New code**:
```typescript
import { Schema } from "effect"

export const PermissionRule = Schema.Struct({
  pattern: Schema.String,
  action: Schema.Literal("allow", "deny", "ask"),
  scope: Schema.optional(Schema.Literal("read", "write", "execute", "all")),
  reason: Schema.optional(Schema.String),
})

export type PermissionRule = Schema.Schema.Type<typeof PermissionRule>

// Built-in always-allow rules for safe operations
export const BUILTIN_ALLOW_RULES: PermissionRule[] = [
  // Git read operations
  { pattern: "git status *", action: "allow", scope: "execute
{"prompt_tokens":116156,"completion_tokens":4096,"total_tokens":120252}

[Session: 38c2cd6e-70ff-44df-94b2-36d68319f7ef]
[Messages: 2, Tokens: 120252]
