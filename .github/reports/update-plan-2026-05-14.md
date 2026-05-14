# Update Plan for Alexi

Generated: 2026-05-14
Based on upstream commits: kilocode (174d467a4..c60006514), opencode (b0dc8e4..27ac53a)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 5 | Medium: 8 | Low: 3

## Changes

### 1. Add Review Telemetry Tracking to Task Tool
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream kilocode added telemetry tracking for review commands in child sessions. This enables proper attribution of /review command completions in telemetry data.

**Current code** (if modifying):
```typescript
import type { SessionPrompt } from "../session/prompt"
import { Config } from "@/config/config"
import { Effect, Schema } from "effect"

export interface TaskPromptOps {
  // existing interface
}
```

**New code**:
```typescript
import type { SessionPrompt } from "../session/prompt"
import { Config } from "@/config/config"
import { AlexiSessionProcessor } from "../alexi/session/processor" // alexi_change
import { Effect, Schema } from "effect"

export interface TaskPromptOps {
  // existing interface
}
```

**Additional change in TaskTool execution**:
```typescript
// In the TaskTool.define execution block, add before ops.prompt call:
() =>
  Effect.gen(function* () {
    const parts = yield* ops.resolvePromptParts(params.prompt)
    AlexiSessionProcessor.markReviewTelemetry(parts, params.command) // alexi_change - carry review command into child session telemetry
    const result = yield* ops.prompt({
      messageID,
      sessionID: nextSession.id,
```

---

### 2. Migrate Read Tool to AppFileSystem
**File**: `src/tool/read.ts`
**Priority**: high
**Type**: refactor
**Reason**: Upstream opencode migrated the read tool to use the new AppFileSystem abstraction for better Effect integration and error handling.

**Current code** (if modifying):
```typescript
import * as fs from "fs/promises"
import * as path from "path"

export async function readFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf-8")
  return content
}
```

**New code**:
```typescript
import { AppFileSystem } from "@/core/filesystem"
import { Effect, pipe } from "effect"

export const readFile = (filePath: string) =>
  pipe(
    Effect.gen(function* () {
      const fs = yield* AppFileSystem
      const content = yield* fs.readFileString(filePath)
      return content
    }),
    Effect.catchTag("SystemError", (error) =>
      Effect.fail({
        _tag: "ReadError" as const,
        path: filePath,
        cause: error,
      })
    )
  )
```

---

### 3. Add stdin Option to AppProcess.run
**File**: `src/core/process.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added stdin option to AppProcess.run for snapshot and clipboard operations. Required for proper process input handling.

**Current code** (if modifying):
```typescript
export interface ProcessRunOptions {
  command: string
  args: string[]
  cwd?: string
  env?: Record<string, string>
  timeout?: number
}

export const run = (options: ProcessRunOptions) =>
```

**New code**:
```typescript
export interface ProcessRunOptions {
  command: string
  args: string[]
  cwd?: string
  env?: Record<string, string>
  timeout?: number
  stdin?: string | Buffer // Added for input piping
}

export const run = (options: ProcessRunOptions) =>
  Effect.gen(function* () {
    const result = yield* Effect.tryPromise({
      try: async () => {
        const proc = spawn(options.command, options.args, {
          cwd: options.cwd,
          env: { ...process.env, ...options.env },
        })
        
        if (options.stdin !== undefined) {
          proc.stdin.write(options.stdin)
          proc.stdin.end()
        }
        
        // ... rest of implementation
      },
      catch: (error) => new ProcessError({ cause: error }),
    })
    return result
  })
```

---

### 4. Track stderr Truncation in Process Output
**File**: `src/core/process.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream added tracking for stderr truncation to help diagnose issues where error output is cut off.

**New code** (add to ProcessResult interface):
```typescript
export interface ProcessResult {
  stdout: string
  stderr: string
  exitCode: number
  stdoutTruncated: boolean
  stderrTruncated: boolean // Added
}

// In the run function, track truncation:
const MAX_STDERR_LENGTH = 1024 * 100 // 100KB

let stderr = ""
let stderrTruncated = false

proc.stderr.on("data", (data) => {
  if (stderr.length < MAX_STDERR_LENGTH) {
    stderr += data.toString()
    if (stderr.length > MAX_STDERR_LENGTH) {
      stderr = stderr.slice(0, MAX_STDERR_LENGTH)
      stderrTruncated = true
    }
  }
})
```

---

### 5. Fix Apply Patch Tool Error Handling
**File**: `src/tool/apply_patch.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream fixed patch application to properly handle edge cases. The change adds better validation before applying patches.

**Current code** (if modifying):
```typescript
export const applyPatch = (patch: string, targetPath: string) =>
  Effect.gen(function* () {
    const result = yield* runPatch(patch, targetPath)
    return result
  })
```

**New code**:
```typescript
export const applyPatch = (patch: string, targetPath: string) =>
  Effect.gen(function* () {
    // Validate patch format before applying
    if (!patch || typeof patch !== "string") {
      return yield* Effect.fail({
        _tag: "PatchValidationError" as const,
        message: "Invalid patch: must be a non-empty string",
      })
    }
    
    const fs = yield* AppFileSystem
    const exists = yield* fs.exists(targetPath)
    
    if (!exists) {
      return yield* Effect.fail({
        _tag: "PatchTargetNotFound" as const,
        path: targetPath,
      })
    }
    
    const result = yield* runPatch(patch, targetPath)
    return result
  })
```

---

### 6. Preserve Tool Error Defects in LLM Module
**File**: `src/providers/llm.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream fixed an issue where tool error defects were being swallowed, making debugging difficult. Errors must be properly preserved and propagated.

**Current code** (if modifying):
```typescript
const executeToolCall = (toolCall: ToolCall) =>
  Effect.gen(function* () {
    try {
      const result = yield* tool.execute(toolCall.args)
      return result
    } catch (error) {
      return { error: "Tool execution failed" }
    }
  })
```

**New code**:
```typescript
const executeToolCall = (toolCall: ToolCall) =>
  pipe(
    Effect.gen(function* () {
      const result = yield* tool.execute(toolCall.args)
      return result
    }),
    Effect.catchAllDefect((defect) =>
      Effect.fail({
        _tag: "ToolExecutionDefect" as const,
        toolName: toolCall.name,
        defect,
      })
    ),
    Effect.catchAll((error) =>
      Effect.succeed({
        _tag: "ToolError" as const,
        toolName: toolCall.name,
        error,
      })
    )
  )
```

---

### 7. Add Model Catalog System
**File**: `src/core/catalog.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Upstream added a centralized model catalog system for managing provider models with better type safety and validation.

**New code**:
```typescript
import { Effect, Schema } from "effect"

export const ModelCapability = Schema.Literal(
  "text",
  "vision",
  "function_calling",
  "json_mode",
  "streaming"
)

export type ModelCapability = Schema.Schema.Type<typeof ModelCapability>

export interface ModelInfo {
  id: string
  name: string
  provider: string
  capabilities: ModelCapability[]
  contextWindow: number
  maxOutputTokens?: number
  pricing?: {
    inputPerMillion: number
    outputPerMillion: number
  }
}

export interface ModelCatalog {
  models: Map<string, ModelInfo>
  getModel: (id: string) => Effect.Effect<ModelInfo, ModelNotFoundError>
  listModels: (filter?: ModelFilter) => ModelInfo[]
  hasCapability: (modelId: string, capability: ModelCapability) => boolean
}

export interface ModelFilter {
  provider?: string
  capabilities?: ModelCapability[]
  minContextWindow?: number
}

export class ModelNotFoundError {
  readonly _tag = "ModelNotFoundError"
  constructor(readonly modelId: string) {}
}

export const createCatalog = (models: ModelInfo[]): ModelCatalog => {
  const modelMap = new Map(models.map((m) => [m.id, m]))
  
  return {
    models: modelMap,
    getModel: (id) =>
      Effect.fromNullable(modelMap.get(id)).pipe(
        Effect.mapError(() => new ModelNotFoundError(id))
      ),
    listModels: (filter) => {
      let result = Array.from(modelMap.values())
      if (filter?.provider) {
        result = result.filter((m) => m.provider === filter.provider)
      }
      if (filter?.capabilities) {
        result = result.filter((m) =>
          filter.capabilities!.every((c) => m.capabilities.includes(c))
        )
      }
      if (filter?.minContextWindow) {
        result = result.filter((m) => m.contextWindow >= filter.minContextWindow!)
      }
      return result
    },
    hasCapability: (modelId, capability) => {
      const model = modelMap.get(modelId)
      return model?.capabilities.includes(capability) ?? false
    },
  }
}
```

---

### 8. Add SAP AI Core Provider Plugin
**File**: `src/providers/sap-ai-core.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added a plugin architecture for providers. We need to ensure SAP AI Core integration follows this pattern for consistency.

**New code**:
```typescript
import { Effect } from "effect"
import type { ProviderPlugin, ProviderConfig } from "./plugin"

export interface SapAiCoreConfig extends ProviderConfig {
  serviceUrl: string
  resourceGroup: string
  deploymentId: string
  clientId: string
  clientSecret: string
  tokenUrl: string
}

export const SapAiCoreProvider: ProviderPlugin<SapAiCoreConfig> = {
  id: "sap-ai-core",
  name: "SAP AI Core",
  
  validateConfig: (config) =>
    Effect.gen(function* () {
      if (!config.serviceUrl) {
        return yield* Effect.fail({
          _tag: "ConfigValidationError" as const,
          field: "serviceUrl",
          message: "SAP AI Core service URL is required",
        })
      }
      if (!config.deploymentId) {
        return yield* Effect.fail({
          _tag: "ConfigValidationError" as const,
          field: "deploymentId",
          message: "Deployment ID is required",
        })
      }
      return config
    }),
    
  createClient: (config) =>
    Effect.gen(function* () {
      const token = yield* fetchSapToken(config)
      return {
        baseUrl: `${config.serviceUrl}/v2/inference/deployments/${config.deploymentId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "AI-Resource-Group": config.resourceGroup,
        },
      }
    }),
    
  mapModel: (modelId) => {
    // SAP AI Core uses deployment-based model routing
    return modelId
  },
}

const fetchSapToken = (config: SapAiCoreConfig) =>
  Effect.tryPromise({
    try: async () => {
      const response = await fetch(config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: config.clientId,
          client_secret: config.clientSecret,
        }),
      })
      const data = await response.json()
      return data.access_token
    },
    catch: (error) => ({
      _tag: "SapTokenError" as const,
      cause: error,
    }),
  })
```

---

### 9. Centralize Session Busy Mapping
**File**: `src/session/busy.ts` (new file)
**Priority**: medium
**Type**: refactor
**Reason**: Upstream centralized session busy state mapping to avoid duplication and ensure consistent error handling across HTTP handlers.

**New code**:
```typescript
import { Effect } from "effect"

export class SessionBusyError {
  readonly _tag = "SessionBusyError"
  constructor(
    readonly sessionId: string,
    readonly operation: string
  ) {}
}

export const mapBusySession = <A, E>(
  effect: Effect.Effect<A, E>,
  sessionId: string,
  operation: string
) =>
  effect.pipe(
    Effect.catchTag("SessionBusy", () =>
      Effect.fail(new SessionBusyError(sessionId, operation))
    )
  )

export const toBusyResponse = (error: SessionBusyError) => ({
  status: 409,
  body: {
    error: "SessionBusy",
    message: `Session ${error.sessionId} is busy with ${error.operation}`,
    sessionId: error.sessionId,
  },
})
```

---

### 10. Finalize Interrupted Assistant Messages
**File**: `src/session/message.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fixed an issue where interrupted assistant messages were left in an incomplete state, causing issues when resuming sessions.

**New code** (add to session message handling):
```typescript
export const finalizeInterruptedMessages = (sessionId: string) =>
  Effect.gen(function* () {
    const storage = yield* SessionStorage
    const messages = yield* storage.getMessages(sessionId)
    
    const interruptedMessages = messages.filter(
      (m) => m.role === "assistant" && m.status === "pending"
    )
    
    for (const message of interruptedMessages) {
      yield* storage.updateMessage(sessionId, message.id, {
        status: "interrupted",
        finishedAt: Date.now(),
        metadata: {
          ...message.metadata,
          interruptedReason: "session_terminated",
        },
      })
    }
    
    return interruptedMessages.length
  })

// Call this when session is being restored or terminated
export const cleanupSession = (sessionId: string) =>
  Effect.gen(function* () {
    yield* finalizeInterruptedMessages(sessionId)
    // ... other cleanup
  })
```

---

### 11. Type Provider Auth Errors
**File**: `src/providers/auth.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Upstream added typed auth errors for better error handling and user feedback.

**New code**:
```typescript
import { Schema } from "effect
{"prompt_tokens":22959,"completion_tokens":4096,"total_tokens":27055}

[Session: 21392548-de70-45ef-a915-9d0976c36a1e]
[Messages: 2, Tokens: 27055]
