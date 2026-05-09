# Update Plan for Alexi

Generated: 2026-05-09
Based on upstream commits: kilocode 045fa8913..2a6c3e7d5 (1061 commits)

## Summary
- Total changes planned: 47
- Critical: 5 | High: 15 | Medium: 20 | Low: 7

## Changes

### 1. Add Agent Manager Tool
**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: feature
**Reason**: New tool for managing agent workflows, enabling orchestration of multiple agents

**New code**:
```typescript
import { Schema } from "effect"
import { Tool } from "./tool"

export const AgentManagerTool = Tool.define({
  name: "agent_manager",
  description: "Manage and orchestrate multiple agent sessions and workflows",
  parameters: Schema.Struct({
    action: Schema.Literal("create", "list", "stop", "status"),
    sessionId: Schema.optional(Schema.String),
    worktreeId: Schema.optional(Schema.String),
    config: Schema.optional(Schema.Struct({
      mode: Schema.optional(Schema.String),
      model: Schema.optional(Schema.String),
    })),
  }),
  execute: async (params, context) => {
    const { action, sessionId, worktreeId, config } = params
    
    switch (action) {
      case "create":
        return await context.agentManager.createSession(config)
      case "list":
        return await context.agentManager.listSessions()
      case "stop":
        if (!sessionId) throw new Error("sessionId required for stop action")
        return await context.agentManager.stopSession(sessionId)
      case "status":
        if (!sessionId) throw new Error("sessionId required for status action")
        return await context.agentManager.getStatus(sessionId)
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  },
})
```

### 2. Update Bash Tool with Shell Operator Denial
**File**: `src/tool/bash.ts`
**Priority**: critical
**Type**: security
**Reason**: Prevent shell injection attacks by denying dangerous shell operators

**Current code**:
```typescript
export const BashTool = Tool.define({
  name: "bash",
  // ... existing implementation
})
```

**New code**:
```typescript
import { Schema, Effect } from "effect"
import { Tool } from "./tool"

const DENIED_OPERATORS = [";", "&&", "||", "|", ">", ">>", "<", "<<", "`", "$("]
const DENIED_PATTERNS = [
  /;\s*rm\s/i,
  /\|\s*bash/i,
  />\s*\/dev\//i,
]

function validateCommand(command: string): Effect.Effect<void, Error> {
  return Effect.gen(function* () {
    // Check for denied operators
    for (const op of DENIED_OPERATORS) {
      if (command.includes(op)) {
        yield* Effect.fail(new Error(`Shell operator "${op}" is not allowed for security reasons`))
      }
    }
    
    // Check for denied patterns
    for (const pattern of DENIED_PATTERNS) {
      if (pattern.test(command)) {
        yield* Effect.fail(new Error(`Command pattern not allowed for security reasons`))
      }
    }
  })
}

export const BashTool = Tool.define({
  name: "bash",
  description: "Execute bash commands in the terminal",
  parameters: Schema.Struct({
    command: Schema.String.pipe(
      Schema.description("The bash command to execute")
    ),
    workingDirectory: Schema.optional(Schema.String),
    timeout: Schema.optional(Schema.Number),
  }),
  execute: async (params, context) => {
    // Validate command before execution
    await Effect.runPromise(validateCommand(params.command))
    
    // ... rest of execution logic
    return await context.shell.execute(params.command, {
      cwd: params.workingDirectory,
      timeout: params.timeout ?? 30000,
    })
  },
})
```

### 3. Update Read Tool with UTF-8 Streaming
**File**: `src/tool/read.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Fix UTF-8 encoding issues when reading files with streaming

**Current code**:
```typescript
async function readFile(path: string): Promise<string> {
  return fs.readFile(path, "utf-8")
}
```

**New code**:
```typescript
import { createReadStream } from "fs"
import { Schema, Effect, Stream } from "effect"

async function readFileStreaming(path: string, options?: { offset?: number; limit?: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const stream = createReadStream(path, {
      encoding: null, // Read as Buffer for proper UTF-8 handling
      start: options?.offset,
      end: options?.limit ? (options.offset ?? 0) + options.limit : undefined,
    })
    
    stream.on("data", (chunk: Buffer) => chunks.push(chunk))
    stream.on("end", () => {
      const buffer = Buffer.concat(chunks)
      resolve(buffer.toString("utf-8"))
    })
    stream.on("error", reject)
    
    // Ensure stream is destroyed on consumer teardown
    stream.once("close", () => stream.destroy())
  })
}

export const ReadTool = Tool.define({
  name: "read",
  description: "Read file contents with proper UTF-8 encoding",
  parameters: Schema.Struct({
    path: Schema.String,
    offset: Schema.optional(Schema.Number.pipe(Schema.int(), Schema.nonNegative())),
    limit: Schema.optional(Schema.Number.pipe(Schema.int(), Schema.positive())),
  }),
  execute: async (params, context) => {
    const content = await readFileStreaming(params.path, {
      offset: params.offset,
      limit: params.limit,
    })
    return { content }
  },
})
```

### 4. Add Encoding-Aware Apply Patch
**File**: `src/tool/apply_patch.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Handle non-UTF-8 files correctly in patch updates to prevent mojibake

**Current code**:
```typescript
async function applyPatch(filePath: string, patch: string): Promise<void> {
  const content = await fs.readFile(filePath, "utf-8")
  // ... apply patch
}
```

**New code**:
```typescript
import { detectEncoding, readWithEncoding, writeWithEncoding } from "../encoding"

async function applyPatch(filePath: string, patch: string): Promise<{ diff: string }> {
  // Detect original file encoding
  const encoding = await detectEncoding(filePath)
  
  // Read with detected encoding
  const originalContent = await readWithEncoding(filePath, encoding)
  
  // Apply patch
  const patchedContent = applyPatchToContent(originalContent, patch)
  
  // Write back with original encoding
  await writeWithEncoding(filePath, patchedContent, encoding)
  
  // Return diff in UTF-8 for display
  return {
    diff: generateDiff(originalContent, patchedContent),
  }
}

export const ApplyPatchTool = Tool.define({
  name: "apply_patch",
  description: "Apply a patch to a file while preserving encoding",
  parameters: Schema.Struct({
    path: Schema.String,
    patch: Schema.String,
  }),
  execute: async (params, context) => {
    return await applyPatch(params.path, params.patch)
  },
})
```

### 5. Add External Directory Permission Support
**File**: `src/permission/external-directory.ts`
**Priority**: high
**Type**: feature
**Reason**: Support read-only external directory allows for Ask mode

**New code**:
```typescript
import { Schema, Effect } from "effect"
import { Permission } from "./types"

export interface ExternalDirectoryConfig {
  path: string
  readonly: boolean
}

export const ExternalDirectoryPermission = {
  evaluate: (
    config: ExternalDirectoryConfig,
    requestedPath: string,
    operation: "read" | "write"
  ): Effect.Effect<Permission, Error> => {
    return Effect.gen(function* () {
      // Normalize paths for comparison
      const normalizedConfig = normalizePath(config.path)
      const normalizedRequest = normalizePath(requestedPath)
      
      // Check if requested path is within allowed directory
      if (!normalizedRequest.startsWith(normalizedConfig)) {
        return { allowed: false, reason: "Path outside allowed directory" }
      }
      
      // Check readonly constraint
      if (config.readonly && operation === "write") {
        return { allowed: false, reason: "Write operations not allowed in readonly directory" }
      }
      
      return { allowed: true }
    })
  },
  
  // Support for Ask mode external directories
  allowReadOnly: (paths: string[]): ExternalDirectoryConfig[] => {
    return paths.map(path => ({ path, readonly: true }))
  },
}
```

### 6. Update Tool Registry with Indexing Isolation
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Isolate indexing from tool registry to prevent startup failures

**Current code**:
```typescript
export class ToolRegistry {
  private tools: Map<string, Tool> = new Map()
  
  async initialize() {
    // Load all tools including semantic search
    await this.loadSemanticSearch()
  }
}
```

**New code**:
```typescript
import { Effect, Layer, Context } from "effect"

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map()
  private indexingTools: Map<string, Tool> = new Map()
  private indexingInitialized = false
  
  async initialize() {
    // Load core tools first
    await this.loadCoreTools()
    
    // Defer indexing tool initialization
    this.initializeIndexingAsync()
  }
  
  private async initializeIndexingAsync() {
    try {
      await this.loadSemanticSearch()
      this.indexingInitialized = true
      
      // Merge indexing tools into main registry
      for (const [name, tool] of this.indexingTools) {
        this.tools.set(name, tool)
      }
    } catch (error) {
      console.warn("Indexing tools failed to initialize:", error)
      // Continue without indexing tools
    }
  }
  
  getTool(name: string): Tool | undefined {
    return this.tools.get(name)
  }
  
  isIndexingReady(): boolean {
    return this.indexingInitialized
  }
}
```

### 7. Add Permission Drain for Stale Requests
**File**: `src/permission/drain.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Let stale permission prompts clear instead of leaving approvals stuck

**New code**:
```typescript
import { Effect, Fiber, Duration } from "effect"

export interface PermissionRequest {
  id: string
  createdAt: number
  tool: string
  params: unknown
}

export class PermissionDrain {
  private pendingRequests: Map<string, PermissionRequest> = new Map()
  private readonly STALE_THRESHOLD = Duration.minutes(5)
  
  addRequest(request: PermissionRequest): void {
    this.pendingRequests.set(request.id, request)
  }
  
  removeRequest(id: string): void {
    this.pendingRequests.delete(id)
  }
  
  // Drain stale requests to prevent stuck approvals
  drainStale(): Effect.Effect<void, never> {
    return Effect.gen(this, function* () {
      const now = Date.now()
      const staleThresholdMs = Duration.toMillis(this.STALE_THRESHOLD)
      
      for (const [id, request] of this.pendingRequests) {
        if (now - request.createdAt > staleThresholdMs) {
          this.pendingRequests.delete(id)
          yield* Effect.logWarning(`Drained stale permission request: ${id}`)
        }
      }
    })
  }
  
  // Start periodic drain
  startDrainLoop(): Effect.Effect<Fiber.Fiber<never, never>, never> {
    return Effect.gen(this, function* () {
      return yield* Effect.fork(
        Effect.forever(
          Effect.delay(this.drainStale(), Duration.minutes(1))
        )
      )
    })
  }
}
```

### 8. Update Agent Config with Steps Nullable Schema
**File**: `src/agent/config.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Fix agent toggle false persistence by preserving null sentinel for steps config

**Current code**:
```typescript
const AgentConfigSchema = Schema.Struct({
  steps: Schema.optional(Schema.Number),
})
```

**New code**:
```typescript
import { Schema } from "effect"

// Use explicit undefined guard for proper null handling
const AgentConfigSchema = Schema.Struct({
  steps: Schema.NullOr(Schema.Number).pipe(
    Schema.description("Maximum steps for agent execution. Null means use default.")
  ),
  enabled: Schema.optional(Schema.Boolean),
})

export function normalizeAgentConfig(config: unknown): AgentConfig {
  // Preserve explicit null/undefined distinction
  if (config === null || config === undefined) {
    return { steps: null, enabled: undefined }
  }
  
  const parsed = Schema.decodeUnknownSync(AgentConfigSchema)(config)
  return {
    steps: parsed.steps ?? null,
    enabled: parsed.enabled,
  }
}
```

### 9. Add Tool Output Truncation Limits Configuration
**File**: `src/tool/truncate.ts`
**Priority**: medium
**Type**: feature
**Reason**: Allow configuring tool output truncation limits per tool

**Current code**:
```typescript
const DEFAULT_TRUNCATION_LIMIT = 10000

export function truncateOutput(output: string): string {
  if (output.length > DEFAULT_TRUNCATION_LIMIT) {
    return output.slice(0, DEFAULT_TRUNCATION_LIMIT) + "\n... [truncated]"
  }
  return output
}
```

**New code**:
```typescript
import { Schema } from "effect"

export interface TruncationConfig {
  defaultLimit: number
  toolLimits: Record<string, number>
  contextLimit: number
}

const DEFAULT_CONFIG: TruncationConfig = {
  defaultLimit: 10000,
  toolLimits: {
    read: 50000,
    grep: 20000,
    glob: 30000,
    bash: 15000,
  },
  contextLimit: 100000,
}

export class Truncator {
  private config: TruncationConfig
  
  constructor(config?: Partial<TruncationConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }
  
  truncateOutput(output: string, toolName?: string): string {
    const limit = toolName 
      ? (this.config.toolLimits[toolName] ?? this.config.defaultLimit)
      : this.config.defaultLimit
    
    if (output.length > limit) {
      const truncated = output.slice(0, limit)
      const remaining = output.length - limit
      return `${truncated}\n... [${remaining} characters truncated]`
    }
    return output
  }
  
  truncateContext(context: string): string {
    if (context.length > this.config.contextLimit) {
      return context.slice(0, this.config.contextLimit) + "\n... [context truncated]"
    }
    return context
  }
}

export const TruncationConfigSchema = Schema.Struct({
  defaultLimit: Schema.optional(Schema.Number.pipe(Schema
{"prompt_tokens":120811,"completion_tokens":4096,"total_tokens":124907}

[Session: 355b20be-24cc-4c86-832f-2016ba4f830a]
[Messages: 2, Tokens: 124907]
