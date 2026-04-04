# Update Plan for Alexi

Generated: 2026-04-03
Based on upstream commits: opencode 0f48899..500dcfc (42 commits), kilocode c27c81a2b..3b794539f (134 commits)

## Summary
- Total changes planned: 12
- Critical: 1 | High: 4 | Medium: 5 | Low: 2

## Changes

### 1. Fix Tool.define() wrapper accumulation on object-defined tools
**File**: `src/tool/tool.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Prevents unbounded wrapper accumulation when Tool.define() is called multiple times on the same object-defined tool, which can cause memory leaks and performance degradation.

**Current code** (if modifying):
```typescript
export namespace Tool {
  export function define<T extends Tool.Info>(id: string, info: T): T {
    // Current implementation may wrap execute multiple times
    const wrapped = {
      ...info,
      id,
      execute: async (ctx: Context, params: unknown) => {
        return info.execute(ctx, params)
      }
    }
    return wrapped as T
  }
}
```

**New code**:
```typescript
export namespace Tool {
  // Symbol to track if tool has already been wrapped
  const WRAPPED_SYMBOL = Symbol.for("tool.wrapped")
  
  export function define<T extends Tool.Info>(id: string, info: T): T {
    // Prevent wrapper accumulation by checking if already wrapped
    if ((info as any)[WRAPPED_SYMBOL]) {
      return info
    }
    
    const wrapped = {
      ...info,
      id,
      [WRAPPED_SYMBOL]: true,
      execute: async (ctx: Context, params: unknown) => {
        return info.execute(ctx, params)
      }
    }
    return wrapped as T
  }
}
```

---

### 2. Update bash tool description to remove dynamic directory reference
**File**: `src/tool/bash.txt.ts` (or wherever bash tool description is stored)
**Priority**: high
**Type**: bugfix
**Reason**: Removes dynamic part from bash tool description to restore cache hits across projects, improving performance.

**Current code** (if modifying):
```typescript
export const bashToolDescription = `Executes a given bash command in a persistent shell session with optional timeout.

Be aware: OS: \${os}, Shell: \${shell}

All commands run in \${directory} by default. Use the \`workdir\` parameter if you need to run a command in a different directory. AVOID using \`cd <directory> && <command>\` patterns - use \`workdir\` instead.
`
```

**New code**:
```typescript
export const bashToolDescription = `Executes a given bash command in a persistent shell session with optional timeout.

Be aware: OS: \${os}, Shell: \${shell}

All commands run in the current working directory by default. Use the \`workdir\` parameter if you need to run a command in a different directory. AVOID using \`cd <directory> && <command>\` patterns - use \`workdir\` instead.
`
```

---

### 3. Add E2E LLM URL support for tool selection in registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: Enables proper tool selection (patch vs edit/write) when running E2E tests with mock LLM server.

**Current code** (if modifying):
```typescript
const usePatch =
  model.modelID.includes("gpt-") && 
  !model.modelID.includes("oss") && 
  !model.modelID.includes("gpt-4")
if (tool.id === "apply_patch") return usePatch
if (tool.id === "edit" || tool.id === "write") return !usePatch
```

**New code**:
```typescript
import { Env } from "../env"

// ... in tool filtering logic:

const usePatch =
  !!Env.get("ALEXI_E2E_LLM_URL") ||
  (model.modelID.includes("gpt-") && 
   !model.modelID.includes("oss") && 
   !model.modelID.includes("gpt-4"))
if (tool.id === "apply_patch") return usePatch
if (tool.id === "edit" || tool.id === "write") return !usePatch
```

---

### 4. Fix async handling in todo tool update
**File**: `src/tool/todo.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Ensures Todo.update is properly awaited to prevent race conditions and ensure data consistency.

**Current code** (if modifying):
```typescript
export const TodoWriteTool = Tool.define("todowrite", {
  // ... tool definition
  execute: async (ctx, params) => {
    // ... validation
    
    Todo.update({
      sessionID: ctx.sessionID,
      todos: params.todos,
    })
    
    return { success: true }
  }
})
```

**New code**:
```typescript
export const TodoWriteTool = Tool.define("todowrite", {
  // ... tool definition
  execute: async (ctx, params) => {
    // ... validation
    
    await Todo.update({
      sessionID: ctx.sessionID,
      todos: params.todos,
    })
    
    return { success: true }
  }
})
```

---

### 5. Effectify permission system bus publishing
**File**: `src/permission/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: Properly yields bus.publish calls within Effect generators for correct error handling and control flow.

**Current code** (if modifying):
```typescript
export namespace Permission {
  export const layer = Layer.effect(
    Service,
    Effect.gen(function* () {
      const state = yield* InstanceState.make<State>(/* ... */)
      
      // In ask function:
      const deferred = yield* Deferred.make<void, RejectedError | CorrectedError>()
      pending.set(id, { info, deferred })
      void Bus.publish(Event.Asked, info)
      
      // In reply function:
      void Bus.publish(Event.Replied, {
        sessionID: existing.info.sessionID,
        requestID: existing.info.id,
        reply: input.reply,
      })
    })
  )
}
```

**New code**:
```typescript
export namespace Permission {
  export const layer = Layer.effect(
    Service,
    Effect.gen(function* () {
      const bus = yield* Bus.Service
      const state = yield* InstanceState.make<State>(/* ... */)
      
      // In ask function:
      const deferred = yield* Deferred.make<void, RejectedError | CorrectedError>()
      pending.set(id, { info, deferred })
      yield* bus.publish(Event.Asked, info)
      return yield* Effect.ensuring(
        Deferred.await(deferred),
        Effect.sync(() => {
          pending.delete(id)
        })
      )
      
      // In reply function:
      yield* bus.publish(Event.Replied, {
        sessionID: existing.info.sessionID,
        requestID: existing.info.id,
        reply: input.reply,
      })
      
      // In reject all for session:
      for (const [id, item] of pending.entries()) {
        if (item.info.sessionID !== existing.info.sessionID) continue
        pending.delete(id)
        yield* bus.publish(Event.Replied, {
          sessionID: item.info.sessionID,
          requestID: item.info.id,
          reply: "reject",
        })
      }
      
      // In auto-approve matching:
      yield* bus.publish(Event.Replied, {
        sessionID: item.info.sessionID,
        requestID: item.info.id,
        reply: "always",
      })
    })
  )
}
```

---

### 6. Add automatic heap snapshots for high-memory CLI processes
**File**: `src/cli/heap.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Enables debugging of memory issues in long-running CLI processes by automatically capturing heap snapshots.

**New code**:
```typescript
import * as v8 from "v8"
import * as fs from "fs"
import * as path from "path"
import { Log } from "../util/log"

const log = Log.create({ service: "cli.heap" })

export namespace HeapSnapshot {
  const HEAP_THRESHOLD_MB = 1024 // 1GB threshold
  const SNAPSHOT_DIR = ".alexi/heap-snapshots"
  
  let lastSnapshotTime = 0
  const MIN_SNAPSHOT_INTERVAL_MS = 60000 // 1 minute between snapshots
  
  export function checkAndSnapshot(): void {
    const heapUsed = process.memoryUsage().heapUsed
    const heapUsedMB = heapUsed / 1024 / 1024
    
    if (heapUsedMB < HEAP_THRESHOLD_MB) return
    
    const now = Date.now()
    if (now - lastSnapshotTime < MIN_SNAPSHOT_INTERVAL_MS) return
    
    lastSnapshotTime = now
    
    try {
      if (!fs.existsSync(SNAPSHOT_DIR)) {
        fs.mkdirSync(SNAPSHOT_DIR, { recursive: true })
      }
      
      const filename = `heap-${Date.now()}.heapsnapshot`
      const filepath = path.join(SNAPSHOT_DIR, filename)
      
      v8.writeHeapSnapshot(filepath)
      log.info(`Heap snapshot written to ${filepath} (heap: ${heapUsedMB.toFixed(2)}MB)`)
    } catch (err) {
      log.error("Failed to write heap snapshot", { error: err })
    }
  }
  
  export function startMonitoring(intervalMs: number = 30000): NodeJS.Timeout {
    return setInterval(checkAndSnapshot, intervalMs)
  }
}
```

---

### 7. Add macOS managed preferences support for enterprise MDM deployments
**File**: `src/config/config.ts`
**Priority**: medium
**Type**: feature
**Reason**: Enables enterprise IT administrators to configure Alexi settings via macOS MDM (Mobile Device Management) profiles.

**New code** (add to existing config module):
```typescript
import { execSync } from "child_process"
import * as os from "os"

export namespace ManagedPreferences {
  const DOMAIN = "ai.alexi.cli"
  
  interface ManagedConfig {
    disableTelemetry?: boolean
    allowedProviders?: string[]
    defaultModel?: string
    proxyUrl?: string
    // Add more enterprise-configurable options as needed
  }
  
  export function read(): ManagedConfig | null {
    if (os.platform() !== "darwin") {
      return null
    }
    
    try {
      const result = execSync(`defaults read ${DOMAIN} 2>/dev/null`, {
        encoding: "utf-8",
        timeout: 5000,
      })
      
      // Parse plist output
      const config: ManagedConfig = {}
      
      const disableTelemetry = readKey("disableTelemetry")
      if (disableTelemetry !== null) {
        config.disableTelemetry = disableTelemetry === "1" || disableTelemetry === "true"
      }
      
      const allowedProviders = readKey("allowedProviders")
      if (allowedProviders !== null) {
        config.allowedProviders = allowedProviders.split(",").map(s => s.trim())
      }
      
      const defaultModel = readKey("defaultModel")
      if (defaultModel !== null) {
        config.defaultModel = defaultModel
      }
      
      const proxyUrl = readKey("proxyUrl")
      if (proxyUrl !== null) {
        config.proxyUrl = proxyUrl
      }
      
      return Object.keys(config).length > 0 ? config : null
    } catch {
      return null
    }
  }
  
  function readKey(key: string): string | null {
    try {
      const result = execSync(`defaults read ${DOMAIN} ${key} 2>/dev/null`, {
        encoding: "utf-8",
        timeout: 5000,
      })
      return result.trim()
    } catch {
      return null
    }
  }
}

// Integrate into config loading:
export function loadConfig(): Config {
  const managedPrefs = ManagedPreferences.read()
  const userConfig = loadUserConfig()
  
  // Managed preferences take precedence over user config
  return {
    ...userConfig,
    ...(managedPrefs?.disableTelemetry !== undefined && {
      telemetry: { enabled: !managedPrefs.disableTelemetry }
    }),
    ...(managedPrefs?.defaultModel && {
      defaultModel: managedPrefs.defaultModel
    }),
    ...(managedPrefs?.proxyUrl && {
      proxy: { url: managedPrefs.proxyUrl }
    }),
  }
}
```

---

### 8. Add session affinity and parent session ID headers
**File**: `src/providers/base.ts` (or appropriate provider base)
**Priority**: medium
**Type**: feature
**Reason**: Enables better session tracking and routing for load-balanced deployments.

**New code** (add to request headers):
```typescript
export interface SessionHeaders {
  "x-session-affinity"?: string
  "x-parent-session-id"?: string
}

export function buildSessionHeaders(
  sessionID: string,
  parentSessionID?: string
): SessionHeaders {
  const headers: SessionHeaders = {
    "x-session-affinity": sessionID,
  }
  
  if (parentSessionID) {
    headers["x-parent-session-id"] = parentSessionID
  }
  
  return headers
}

// In provider request methods:
async function makeRequest(
  endpoint: string,
  body: unknown,
  sessionContext?: { sessionID: string; parentSessionID?: string }
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // ... other headers
  }
  
  if (sessionContext) {
    const sessionHeaders = buildSessionHeaders(
      sessionContext.sessionID,
      sessionContext.parentSessionID
    )
    Object.assign(headers, sessionHeaders)
  }
  
  return fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
}
```

---

### 9. Honor model limit.input overrides from config
**File**: `src/providers/models.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Ensures user-configured model input limits are respected instead of being overwritten by defaults.

**Current code** (if modifying):
```typescript
export function getModelLimits(modelID: string): ModelLimits {
  const defaults = MODEL_DEFAULTS[modelID] || DEFAULT_LIMITS
  return defaults
}
```

**New code**:
```typescript
export function getModelLimits(
  modelID: string, 
  configOverrides?: Partial<ModelLimits>
): ModelLimits {
  const defaults = MODEL_DEFAULTS[modelID] || DEFAULT_LIMITS
  
  if (!configOverrides) {
    return defaults
  }
  
  return {
    ...defaults,
    ...(configOverrides.input !== undefined && { input: configOverrides.input }),
    ...(configOverrides.output !== undefined && { output: configOverrides.output }),
    ...(configOverrides.context !== undefined && { context: configOverrides.context }),
  }
}

// Update model resolution to check config:
export function resolveModel(modelID: string, config: Config): ResolvedModel {
  const modelConfig = config.models?.[modelID]
  const limits = getModelLimits(modelID, modelConfig?.limit)
  
  return {
    modelID,
    limits,
    // ... other model properties
  }
}
```

---

### 10. Add abort signal
{"prompt_tokens":19138,"completion_tokens":4096,"total_tokens":23234}

[Session: bb7cd566-ae08-4bea-afeb-12de2211a659]
[Messages: 2, Tokens: 23234]
