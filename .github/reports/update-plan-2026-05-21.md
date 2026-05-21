# Update Plan for Alexi

Generated: 2026-05-21
Based on upstream commits: kilocode 637c61e0a..4c0e6987b (184 commits)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 6 | Medium: 7 | Low: 3

## Changes

### 1. Rename bash tool to shell tool with enhanced prompt system
**File**: `src/tool/shell.ts` (rename from `src/tool/bash.ts`)
**Priority**: high
**Type**: refactor
**Reason**: Upstream renamed bash.ts to shell.ts and introduced a modular shell prompt system with separate ID generation and prompt construction. This improves maintainability and allows for more sophisticated shell command handling.

**Current code** (if exists as bash.ts):
```typescript
// src/tool/bash.ts
export const bashTool = {
  name: "bash",
  // ... existing implementation
}
```

**New code**:
```typescript
// src/tool/shell.ts
import { shellId } from "./shell/id"
import { shellPrompt } from "./shell/prompt"

export const shellTool = {
  name: "shell",
  description: "Execute shell commands in the user's environment",
  
  async execute(params: { command: string; timeout?: number }) {
    const id = shellId()
    const prompt = shellPrompt(params.command)
    // ... implementation using new prompt system
  }
}

export { shellId } from "./shell/id"
export { shellPrompt } from "./shell/prompt"
```

---

### 2. Create shell ID generation module
**File**: `src/tool/shell/id.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Upstream introduced dedicated ID generation for shell commands to improve traceability and debugging.

**New code**:
```typescript
// src/tool/shell/id.ts
import { randomUUID } from "crypto"

let counter = 0

export function shellId(): string {
  counter++
  const timestamp = Date.now().toString(36)
  const random = randomUUID().slice(0, 8)
  return `shell-${timestamp}-${counter}-${random}`
}

export function resetShellIdCounter(): void {
  counter = 0
}
```

---

### 3. Create shell prompt construction module
**File**: `src/tool/shell/prompt.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Upstream added a 297-line prompt module for sophisticated shell command prompting with safety checks, environment handling, and output formatting.

**New code**:
```typescript
// src/tool/shell/prompt.ts
import { Effect } from "effect"

export interface ShellPromptOptions {
  command: string
  workingDirectory?: string
  environment?: Record<string, string>
  timeout?: number
  captureStderr?: boolean
}

export interface ShellPromptResult {
  formattedCommand: string
  safetyWarnings: string[]
  environmentOverrides: Record<string, string>
}

export function shellPrompt(options: ShellPromptOptions | string): ShellPromptResult {
  const opts = typeof options === "string" ? { command: options } : options
  
  const safetyWarnings: string[] = []
  
  // Check for potentially dangerous commands
  const dangerousPatterns = [
    /rm\s+-rf\s+[\/~]/,
    />\s*\/dev\/sd[a-z]/,
    /mkfs\./,
    /dd\s+if=/,
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(opts.command)) {
      safetyWarnings.push(`Potentially dangerous command pattern detected: ${pattern}`)
    }
  }
  
  // Build environment overrides
  const environmentOverrides: Record<string, string> = {
    ...opts.environment,
    SHELL_PROMPT_ID: `alexi-${Date.now()}`,
  }
  
  // Format command with proper escaping
  const formattedCommand = opts.command
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
  
  return {
    formattedCommand,
    safetyWarnings,
    environmentOverrides,
  }
}

export function validateShellCommand(command: string): Effect.Effect<void, Error> {
  return Effect.gen(function* () {
    const result = shellPrompt(command)
    if (result.safetyWarnings.length > 0) {
      yield* Effect.logWarning(`Shell command warnings: ${result.safetyWarnings.join(", ")}`)
    }
  })
}
```

---

### 4. Add allow-everything permission handler for controlled environments
**File**: `src/permission/allow-everything.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Upstream added a dedicated permission handler for environments where all permissions should be granted (e.g., automated CI/CD pipelines, trusted execution contexts). This provides a clean, auditable way to bypass permission checks when appropriate.

**New code**:
```typescript
// src/permission/allow-everything.ts
import { Effect, Context } from "effect"
import { PermissionRequest, PermissionResult } from "./types"

export interface AllowEverythingConfig {
  enabled: boolean
  auditLog?: boolean
  allowedContexts?: string[]
}

export class AllowEverythingPermission extends Context.Tag("AllowEverythingPermission")<
  AllowEverythingPermission,
  AllowEverythingConfig
>() {}

export function createAllowEverythingHandler(config: AllowEverythingConfig) {
  return {
    async check(request: PermissionRequest): Promise<PermissionResult> {
      if (!config.enabled) {
        return { allowed: false, reason: "allow-everything is disabled" }
      }
      
      if (config.allowedContexts && config.allowedContexts.length > 0) {
        if (!config.allowedContexts.includes(request.context)) {
          return { allowed: false, reason: `Context ${request.context} not in allowed list` }
        }
      }
      
      if (config.auditLog) {
        console.log(`[PERMISSION AUDIT] Allowing: ${request.action} on ${request.resource}`)
      }
      
      return {
        allowed: true,
        reason: "allow-everything handler granted permission",
        grantedBy: "allow-everything",
      }
    },
  }
}

export const AllowEverythingLayer = Effect.gen(function* () {
  const config = yield* AllowEverythingPermission
  return createAllowEverythingHandler(config)
})
```

---

### 5. Update permission routes to simplify handler registration
**File**: `src/permission/routes.ts`
**Priority**: high
**Type**: refactor
**Reason**: Upstream simplified permission routes by removing 46 lines of redundant code and consolidating handler registration.

**Current code**:
```typescript
// src/permission/routes.ts
export function registerPermissionRoutes(router: Router) {
  router.post("/permission/check", async (req, res) => {
    // ... verbose implementation
  })
  
  router.post("/permission/grant", async (req, res) => {
    // ... verbose implementation  
  })
  
  // ... many more route handlers
}
```

**New code**:
```typescript
// src/permission/routes.ts
import { Effect } from "effect"
import { PermissionHandler } from "./handler"
import { AllowEverythingPermission } from "./allow-everything"

export function registerPermissionRoutes(router: Router) {
  const handler = new PermissionHandler()
  
  router.post("/permission/check", handler.createCheckEndpoint())
  router.post("/permission/grant", handler.createGrantEndpoint())
  router.post("/permission/revoke", handler.createRevokeEndpoint())
  router.get("/permission/status", handler.createStatusEndpoint())
}

export function createPermissionMiddleware() {
  return Effect.gen(function* () {
    const allowEverything = yield* Effect.serviceOption(AllowEverythingPermission)
    
    return async (req: Request, res: Response, next: NextFunction) => {
      if (allowEverything._tag === "Some" && allowEverything.value.enabled) {
        req.permissionGranted = true
        return next()
      }
      // ... standard permission check
      next()
    }
  })
}
```

---

### 6. Add readFileStringSafe to filesystem utilities
**File**: `src/core/filesystem.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream added a safe file reading method that returns undefined instead of throwing on NotFound errors, reducing boilerplate in calling code.

**Current code**:
```typescript
// src/core/filesystem.ts
export const AppFileSystem = {
  existsSafe: (path: string) => Effect.Effect<boolean>,
  readJson: (path: string) => Effect.Effect<unknown, Error>,
  // ...
}
```

**New code**:
```typescript
// src/core/filesystem.ts
import { Effect } from "effect"

export const AppFileSystem = {
  existsSafe: (path: string): Effect.Effect<boolean> => {
    return Effect.gen(function* () {
      return yield* fs.exists(path).pipe(Effect.orElseSucceed(() => false))
    })
  },
  
  readFileStringSafe: (path: string): Effect.Effect<string | undefined, Error> => {
    return Effect.gen(function* () {
      return yield* fs
        .readFileString(path)
        .pipe(Effect.catchReason("PlatformError", "NotFound", () => Effect.succeed(undefined)))
    })
  },
  
  readJson: (path: string): Effect.Effect<unknown, Error> => {
    // ... existing implementation
  },
  // ...
}
```

---

### 7. Add HTTPAPI experimental flag with channel-based defaults
**File**: `src/core/flag.ts`
**Priority**: critical
**Type**: feature
**Reason**: Upstream added sophisticated feature flag handling that defaults experimental HTTPAPI to enabled on dev/beta channels while keeping stable channels on legacy backend. This is critical for SAP AI Core integration testing.

**Current code**:
```typescript
// src/core/flag.ts
export const Flag = {
  KILO_EXPERIMENTAL_HTTPAPI: truthy("KILO_EXPERIMENTAL_HTTPAPI"),
}
```

**New code**:
```typescript
// src/core/flag.ts
import { InstallationChannel } from "./installation/version"

function truthy(key: string): boolean {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

function falsy(key: string): boolean {
  const value = process.env[key]?.toLowerCase()
  return value === "false" || value === "0"
}

// Channels that default to the new effect-httpapi server backend
const HTTPAPI_DEFAULT_ON_CHANNELS = new Set(["dev", "beta", "local"])

export const Flag = {
  // Defaults to true on dev/beta/local channels for internal testing
  // Stable (prod/latest) installs stay on legacy backend until rollout complete
  // Explicit env var always wins (opt-in for stable, escape hatch for dev/beta)
  KILO_EXPERIMENTAL_HTTPAPI:
    truthy("KILO_EXPERIMENTAL_HTTPAPI") ||
    (!falsy("KILO_EXPERIMENTAL_HTTPAPI") && HTTPAPI_DEFAULT_ON_CHANNELS.has(InstallationChannel)),
  
  KILO_EXPERIMENTAL_WORKSPACES: truthy("KILO_EXPERIMENTAL") || truthy("KILO_EXPERIMENTAL_WORKSPACES"),
  KILO_EXPERIMENTAL_EVENT_SYSTEM: truthy("KILO_EXPERIMENTAL") || truthy("KILO_EXPERIMENTAL_EVENT_SYSTEM"),
  
  // SAP AI Core specific flags
  SAP_AI_CORE_ENABLED: truthy("SAP_AI_CORE_ENABLED"),
  SAP_AI_CORE_STRICT_MODE: truthy("SAP_AI_CORE_STRICT_MODE"),
}
```

---

### 8. Update tool registry with improved type safety
**File**: `src/tool/registry.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Upstream improved the tool registry with better type safety and consistent naming conventions.

**Current code**:
```typescript
// src/tool/registry.ts
export const toolRegistry = new Map<string, Tool>()

export function registerTool(tool: Tool) {
  toolRegistry.set(tool.name, tool)
}
```

**New code**:
```typescript
// src/tool/registry.ts
import { Effect, Context } from "effect"

export interface ToolDefinition<TArgs = unknown, TResult = unknown> {
  name: string
  description: string
  args: TArgs
  execute: (args: TArgs) => Effect.Effect<TResult, Error>
}

export class ToolRegistry extends Context.Tag("ToolRegistry")<
  ToolRegistry,
  {
    readonly register: <T extends ToolDefinition>(tool: T) => Effect.Effect<void>
    readonly get: (name: string) => Effect.Effect<ToolDefinition | undefined>
    readonly list: () => Effect.Effect<readonly ToolDefinition[]>
    readonly has: (name: string) => Effect.Effect<boolean>
  }
>() {}

export const createToolRegistry = () => {
  const tools = new Map<string, ToolDefinition>()
  
  return {
    register: <T extends ToolDefinition>(tool: T) =>
      Effect.sync(() => {
        tools.set(tool.name, tool)
      }),
    
    get: (name: string) =>
      Effect.sync(() => tools.get(name)),
    
    list: () =>
      Effect.sync(() => Array.from(tools.values())),
    
    has: (name: string) =>
      Effect.sync(() => tools.has(name)),
  }
}
```

---

### 9. Update webfetch tool with improved error handling
**File**: `src/tool/webfetch.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream added better error handling and type safety to the webfetch tool.

**Current code**:
```typescript
// src/tool/webfetch.ts
export const webfetchTool = {
  name: "webfetch",
  async execute(params: { url: string }) {
    const response = await fetch(params.url)
    return response.text()
  }
}
```

**New code**:
```typescript
// src/tool/webfetch.ts
import { Effect } from "effect"

export interface WebfetchParams {
  url: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: string
  timeout?: number
}

export interface WebfetchResult {
  status: number
  headers: Record<string, string>
  body: string
  url: string
}

export const webfetchTool = {
  name: "webfetch",
  description: "Fetch content from a URL",
  
  execute: (params: WebfetchParams): Effect.Effect<WebfetchResult, Error> =>
    Effect.gen(function* () {
      const controller = new AbortController()
      const timeoutId = params.timeout
        ? setTimeout(() => controller.abort(), params.timeout)
        : undefined
      
      try {
        const response = yield* Effect.tryPromise({
          try: () =>
            fetch(params.url, {
              method: params.method ?? "GET",
              headers: params.headers,
              body: params.body,
              signal: controller.signal,
            }),
          catch: (error) => new Error(`Fetch failed: ${error}`),
        })
        
        const body = yield* Effect.tryPromise({
          try: () => response.text(),
          catch: (error) => new Error(`Failed to read response body: ${error}`),
        })
        
        const headers: Record<string, string> = {}
        response.headers.forEach((value, key
{"prompt_tokens":27824,"completion_tokens":4096,"total_tokens":31920}

[Session: c7154cd1-310c-4479-9666-edc721e6088b]
[Messages: 2, Tokens: 31920]
