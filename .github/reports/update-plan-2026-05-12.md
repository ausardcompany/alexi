# Update Plan for Alexi

Generated: 2026-05-12
Based on upstream commits: kilocode 64e45eaba..08a3e0a09 (116 commits), opencode caf1151..c933504 (76 commits)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 5 | Medium: 8 | Low: 3

## Changes

### 1. Prevent Nested Subagent Delegation
**File**: `src/tool/task.ts`
**Priority**: critical
**Type**: security
**Reason**: Prevents recursive subagent chains which could cause infinite loops, resource exhaustion, and unpredictable behavior. Kilocode explicitly blocks subagents from spawning other subagents.

**Current code** (if modifying):
```typescript
// Assuming current implementation allows nested delegation
const canTask = next.permission.some((rule) => rule.permission === id)
```

**New code**:
```typescript
export namespace TaskTool {
  /** Alexi keeps delegation one level deep to avoid recursive subagent chains. */
  export function nestedTask(): false {
    return false
  }
  
  export function validate(info: AgentInfo, name: string): void {
    if (info.mode === "primary") {
      throw new Error(`Agent "${name}" is a primary agent and cannot be used as a subagent`)
    }
  }
}

// In the tool execution:
const canTask = TaskTool.nestedTask() // Alexi disallows subagents spawning subagents
const canTodo = next.permission.some((rule) => rule.permission === "todowrite")
```

---

### 2. Normalize URLs in Permission Dialogs (Homograph Attack Protection)
**File**: `src/util/url.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Protects against IDN homograph attacks by normalizing internationalized domain names to punycode in permission dialogs, preventing malicious domains from masquerading as trusted ones.

**New code**:
```typescript
/**
 * Normalize URLs to protect against IDN homograph attacks.
 * Converts internationalized domain names to punycode representation.
 */
export function normalizeUrls(text: string): string {
  // Match URLs in text
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi
  
  return text.replace(urlPattern, (url) => {
    try {
      const parsed = new URL(url)
      // Convert IDN hostname to punycode (ASCII)
      const asciiHostname = toASCII(parsed.hostname)
      
      if (asciiHostname !== parsed.hostname) {
        parsed.hostname = asciiHostname
      }
      
      // Strip trailing sentence punctuation that may have been captured
      let normalized = parsed.toString()
      normalized = normalized.replace(/[.,;:!?]+$/, '')
      
      return normalized
    } catch {
      return url
    }
  })
}

/**
 * Convert Unicode hostname to ASCII (punycode) representation.
 * Uses the WHATWG URL standard's ToASCII algorithm.
 */
function toASCII(hostname: string): string {
  try {
    // Use URL constructor which handles punycode conversion
    const url = new URL(`http://${hostname}`)
    return url.hostname
  } catch {
    return hostname
  }
}
```

---

### 3. Apply URL Normalization to Bash Tool Permission Requests
**File**: `src/tool/bash.ts`
**Priority**: high
**Type**: security
**Reason**: Ensures bash commands displayed in permission dialogs have normalized URLs to prevent homograph attacks.

**Current code** (if modifying):
```typescript
const ask = Effect.fn("BashTool.ask")(function* (ctx: Tool.Context, scan: Scan, command: string) {
  yield* Permission.ask({
    permission: "bash",
    patterns: Array.from(scan.patterns),
    always: Array.from(scan.always),
    metadata: { command },
  })
})
```

**New code**:
```typescript
import { normalizeUrls } from "@/util/url"

const ask = Effect.fn("BashTool.ask")(function* (ctx: Tool.Context, scan: Scan, command: string) {
  yield* Permission.ask({
    permission: "bash",
    patterns: Array.from(scan.patterns),
    always: Array.from(scan.always),
    metadata: { command: normalizeUrls(command) },
  })
})
```

---

### 4. Update Semantic Search Tool Description
**File**: `src/tool/semantic-search.txt`
**Priority**: medium
**Type**: bugfix
**Reason**: Clarifies that semantic search returns code snippets with context (file paths, line ranges, relevance scores), not just file paths. Improves LLM understanding of tool output format.

**Current code** (if modifying):
```text
- Find files most relevant to the search query using semantic search.
- Searches based on meaning rather than exact text matches.
- By default searches entire workspace, with capability to filter by path.
```

**New code**:
```text
- Find code snippets most relevant to the search query using semantic search.
- Returns matching content with file paths, line ranges, and relevance scores.
- Searches based on meaning rather than exact text matches.
- By default searches entire workspace, with capability to filter by path.
```

---

### 5. Remove Codesearch Tool
**File**: `src/tool/codesearch.ts`
**Priority**: high
**Type**: refactor
**Reason**: Opencode removed the codesearch tool entirely. This simplifies the codebase and removes redundant functionality that may have been superseded by improved semantic search.

**Current code** (if modifying):
```typescript
// Entire codesearch.ts file
export const CodesearchTool = Tool.define(/* ... */)
```

**New code**:
```typescript
// Delete file entirely or mark as deprecated
// Remove from tool registry
```

---

### 6. Update Tool Registry to Remove Codesearch
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: refactor
**Reason**: Complement to removing codesearch tool - must update registry to not register the removed tool.

**Current code** (if modifying):
```typescript
import { CodesearchTool } from "./codesearch"

const tools = [
  // ... other tools
  CodesearchTool,
  // ...
]
```

**New code**:
```typescript
// Remove CodesearchTool import and registration
const tools = [
  // ... other tools (codesearch removed)
  // ...
]
```

---

### 7. Add JSON Schema Generation for Tools
**File**: `src/tool/json-schema.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Opencode added dedicated JSON schema generation for tools, improving interoperability and validation capabilities.

**New code**:
```typescript
import { Schema, JSONSchema } from "effect"

/**
 * Generate JSON Schema from Effect Schema for tool parameters.
 * Used for OpenAPI documentation and external tool integrations.
 */
export function generateToolSchema<S extends Schema.Schema.Any>(
  schema: S
): JSONSchema.JsonSchema {
  return JSONSchema.make(schema)
}

/**
 * Validate tool parameters against generated schema.
 */
export function validateToolParams<S extends Schema.Schema.Any>(
  schema: S,
  params: unknown
): Schema.Schema.Type<S> {
  return Schema.decodeUnknownSync(schema)(params)
}

/**
 * Generate OpenAPI-compatible parameter schema for a tool.
 */
export function toOpenAPIParameters<S extends Schema.Schema.Any>(
  schema: S,
  options?: { required?: boolean }
): Record<string, unknown> {
  const jsonSchema = generateToolSchema(schema)
  return {
    ...jsonSchema,
    required: options?.required ?? true
  }
}
```

---

### 8. Fix Grep External Directory Permission Evaluation
**File**: `src/tool/grep.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Fixes permission evaluation for grep operations on external directories, ensuring proper security checks are applied.

**Current code** (if modifying):
```typescript
function evaluatePermission(path: string, patterns: string[]): boolean {
  // Current implementation may not properly handle external directories
  return patterns.some(pattern => minimatch(path, pattern))
}
```

**New code**:
```typescript
import * as path from "path"

function evaluatePermission(targetPath: string, patterns: string[], workspaceRoot: string): boolean {
  // Normalize the target path
  const normalizedTarget = path.resolve(targetPath)
  const normalizedRoot = path.resolve(workspaceRoot)
  
  // Check if path is external to workspace
  const isExternal = !normalizedTarget.startsWith(normalizedRoot)
  
  if (isExternal) {
    // External directories require explicit permission patterns
    return patterns.some(pattern => {
      // Pattern must explicitly match external path
      if (pattern.startsWith('/') || pattern.startsWith('~')) {
        return minimatch(normalizedTarget, path.resolve(pattern))
      }
      return false
    })
  }
  
  // Internal paths use relative matching
  const relativePath = path.relative(normalizedRoot, normalizedTarget)
  return patterns.some(pattern => minimatch(relativePath, pattern))
}
```

---

### 9. Prune Tool Outputs for Large Requests
**File**: `src/session/compaction.ts`
**Priority**: medium
**Type**: feature
**Reason**: Prevents context window overflow by pruning large tool outputs during compaction, improving reliability for long-running sessions.

**Current code** (if modifying):
```typescript
export function compactMessages(messages: Message[]): Message[] {
  // Current compaction logic
  return messages.filter(m => !m.pruned)
}
```

**New code**:
```typescript
const MAX_TOOL_OUTPUT_LENGTH = 50000 // 50KB threshold
const PRUNED_TOOL_MARKER = "[Output truncated due to size]"

export function compactMessages(messages: Message[], options?: CompactionOptions): Message[] {
  return messages.map(message => {
    if (message.role === "tool" && message.content) {
      const contentLength = typeof message.content === "string" 
        ? message.content.length 
        : JSON.stringify(message.content).length
      
      if (contentLength > MAX_TOOL_OUTPUT_LENGTH) {
        return {
          ...message,
          content: pruneToolOutput(message.content, MAX_TOOL_OUTPUT_LENGTH),
          metadata: {
            ...message.metadata,
            originalLength: contentLength,
            pruned: true
          }
        }
      }
    }
    return message
  }).filter(m => !m.pruned || options?.keepPruned)
}

function pruneToolOutput(content: string | object, maxLength: number): string {
  const text = typeof content === "string" ? content : JSON.stringify(content, null, 2)
  
  if (text.length <= maxLength) return text
  
  // Keep beginning and end for context
  const headLength = Math.floor(maxLength * 0.7)
  const tailLength = Math.floor(maxLength * 0.2)
  
  return `${text.slice(0, headLength)}\n\n${PRUNED_TOOL_MARKER}\n\n${text.slice(-tailLength)}`
}
```

---

### 10. Add Tool Type Declaration
**File**: `src/tool/tool.ts`
**Priority**: low
**Type**: feature
**Reason**: Adds explicit tool type declarations for better TypeScript support and documentation.

**Current code** (if modifying):
```typescript
export const Tool = {
  define: <T extends ToolDefinition>(def: T) => def,
  // ...
}
```

**New code**:
```typescript
export interface ToolCapabilities {
  streaming?: boolean
  batchable?: boolean
  cacheable?: boolean
  requiresPermission?: boolean
}

export const Tool = {
  define: <T extends ToolDefinition>(def: T & { capabilities?: ToolCapabilities }) => ({
    ...def,
    capabilities: def.capabilities ?? {}
  }),
  // ...
}
```

---

### 11. Update Webfetch Tool URL Handling
**File**: `src/tool/webfetch.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Improves URL handling in webfetch tool with proper normalization and validation.

**Current code** (if modifying):
```typescript
async function fetchUrl(url: string, options: FetchOptions) {
  const response = await fetch(url, options)
  return response
}
```

**New code**:
```typescript
import { normalizeUrls } from "@/util/url"

async function fetchUrl(url: string, options: FetchOptions) {
  // Normalize URL to prevent homograph attacks
  const normalizedUrl = normalizeUrls(url).trim()
  
  // Validate URL format
  try {
    new URL(normalizedUrl)
  } catch {
    throw new Error(`Invalid URL format: ${url}`)
  }
  
  const response = await fetch(normalizedUrl, {
    ...options,
    // Ensure reasonable timeouts
    signal: options.signal ?? AbortSignal.timeout(30000)
  })
  
  return response
}
```

---

### 12. Add Subagent Auto Flag Propagation
**File**: `src/tool/task.ts`
**Priority**: medium
**Type**: feature
**Reason**: Ensures the --auto flag is properly propagated to subagents spawned by the Task tool, maintaining consistent automation behavior.

**New code** (addition to existing file):
```typescript
export interface SubagentOptions {
  autoMode?: boolean
  inheritPermissions?: boolean
  maxDepth?: number
}

/**
 * Build configuration for spawning a subagent.
 * Propagates relevant flags from parent context.
 */
export function buildSubagentConfig(
  parentCtx: Tool.Context,
  options: SubagentOptions = {}
): SubagentConfig {
  return {
    autoMode: options.autoMode ?? parentCtx.flags?.auto ?? false,
    permissions: options.inheritPermissions 
      ? inheritPermissions(parentCtx)
      : defaultPermissions(),
    maxDepth: 1, // Enforce single-level nesting
  }
}

function inheritPermissions(ctx: Tool.Context): PermissionRule[] {
  // Merge static agent definition with session's accumulated permissions
  const sessionPermissions = ctx.session?.permissions ?? []
  const agentPermissions = ctx.agent?.permission ?? []
  
  return [...agentPermissions, ...sessionPermissions]
}
```

---

### 13. Add MCP Websearch Provider Label Reactivity
**File**: `src/tool/mcp-websearch.ts`
**Priority**: low
**Type**: bugfix
**Reason**: Makes websearch provider label reactive to configuration changes.

**Current code** (if modifying):
```typescript
const provider = config.websearch?.provider ?? "default"
```

**New code**:
```typescript
import { Effect } from "effect"

const getProvider = Effect.gen(function* () {
  const config = yield* Config.get()
  // Reactive: re-evaluates when config changes
  return config.websearch?.provider ?? "default"
})

// Use in tool execution
const provider = yield* getProvider
```

---

### 14. Remove Effect-Zod Bridge (Schema Migration)
**File**: `src/core/schema.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Opencode removed the effect-zod bridge, migrating fully to Effect Schema. This simplifies the codebase and removes the Zod dependency for schema validation.

**Current code** (if modifying):
```typescript
import { zod, zodObject } from "@/core/effect-zod"
import z from "zod"

export const SessionSchema = z.object({
  id: z.string(),
  // ...
})
```

**New code**:
```typescript
import { Schema } from "effect"

export const SessionSchema = Schema.Struct({
  id: Schema.String,
  // ...
})

// For validation
export const decodeSession = Schema.decodeUnknownSync(SessionSchema)

// For type inference
{"prompt_tokens":26701,"completion_tokens":4096,"total_tokens":30797}

[Session: d235de49-897b-4343-9507-2b140e793c48]
[Messages: 2, Tokens: 30797]
