# Update Plan for Alexi

Generated: 2026-05-24
Based on upstream commits: kilocode 4c0e6987b..59bf44712 (409 commits)

## Summary
- Total changes planned: 23
- Critical: 2 | High: 8 | Medium: 9 | Low: 4

## Changes

### 1. Rename bash tool to shell tool with enhanced prompt handling
**File**: `src/tool/shell.ts` (rename from `src/tool/bash.ts`)
**Priority**: high
**Type**: refactor
**Reason**: Upstream renamed bash tool to shell for better cross-platform support and added dedicated prompt handling module

**Current code** (if modifying):
```typescript
// src/tool/bash.ts
export const BashTool = {
  name: "bash",
  // ... existing implementation
}
```

**New code**:
```typescript
// src/tool/shell.ts
import { ShellId } from "./shell/id"
import { ShellPrompt } from "./shell/prompt"

export const ShellTool = {
  name: "shell",
  description: `Execute shell commands in a persistent shell session.`,
  
  async execute(params: { command: string; timeout?: number }) {
    const shellId = ShellId.generate()
    const prompt = await ShellPrompt.create({
      id: shellId,
      command: params.command,
      timeout: params.timeout ?? 30000,
    })
    
    return prompt.run()
  }
}
```

### 2. Add shell ID generation module
**File**: `src/tool/shell/id.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New module for generating unique shell session identifiers

**New code**:
```typescript
// src/tool/shell/id.ts
import { nanoid } from "nanoid"

export namespace ShellId {
  export type ShellId = string & { readonly _tag: "ShellId" }
  
  export function generate(): ShellId {
    return `shell_${nanoid(12)}` as ShellId
  }
  
  export function isValid(id: string): id is ShellId {
    return id.startsWith("shell_") && id.length === 18
  }
}
```

### 3. Add shell prompt handling module
**File**: `src/tool/shell/prompt.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Comprehensive shell prompt handling with timeout, output streaming, and error handling (297 new lines upstream)

**New code**:
```typescript
// src/tool/shell/prompt.ts
import { Effect, Stream, Duration } from "effect"
import { ShellId } from "./id"

export interface ShellPromptConfig {
  id: ShellId.ShellId
  command: string
  timeout: number
  workingDirectory?: string
  environment?: Record<string, string>
}

export interface ShellPromptResult {
  exitCode: number
  stdout: string
  stderr: string
  timedOut: boolean
  duration: number
}

export namespace ShellPrompt {
  export async function create(config: ShellPromptConfig): Promise<ShellPromptRunner> {
    return new ShellPromptRunner(config)
  }
}

class ShellPromptRunner {
  constructor(private config: ShellPromptConfig) {}
  
  async run(): Promise<ShellPromptResult> {
    const startTime = Date.now()
    let timedOut = false
    let stdout = ""
    let stderr = ""
    let exitCode = 0
    
    try {
      const proc = Bun.spawn(["sh", "-c", this.config.command], {
        cwd: this.config.workingDirectory,
        env: { ...process.env, ...this.config.environment },
        stdout: "pipe",
        stderr: "pipe",
      })
      
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => {
          timedOut = true
          proc.kill()
          reject(new Error("Command timed out"))
        }, this.config.timeout)
      })
      
      const resultPromise = (async () => {
        stdout = await new Response(proc.stdout).text()
        stderr = await new Response(proc.stderr).text()
        exitCode = await proc.exited
      })()
      
      await Promise.race([resultPromise, timeoutPromise])
    } catch (error) {
      if (!timedOut) {
        throw error
      }
    }
    
    return {
      exitCode,
      stdout,
      stderr,
      timedOut,
      duration: Date.now() - startTime,
    }
  }
}
```

### 4. Add background process tool
**File**: `src/tool/background-process.ts` (new file)
**Priority**: critical
**Type**: feature
**Reason**: New tool for managing long-running background processes (175 new lines upstream) - critical for async task handling

**New code**:
```typescript
// src/tool/background-process.ts
import { Effect, Context, Layer } from "effect"
import { nanoid } from "nanoid"

export interface BackgroundProcess {
  id: string
  command: string
  pid: number
  status: "running" | "stopped" | "failed"
  startedAt: Date
  ports: number[]
  logs: string[]
}

export class BackgroundProcessRegistry extends Context.Tag("BackgroundProcessRegistry")<
  BackgroundProcessRegistry,
  {
    readonly start: (command: string, options?: { ports?: number[] }) => Effect.Effect<BackgroundProcess>
    readonly stop: (id: string) => Effect.Effect<void>
    readonly list: () => Effect.Effect<BackgroundProcess[]>
    readonly getLogs: (id: string, tail?: number) => Effect.Effect<string[]>
    readonly getByPort: (port: number) => Effect.Effect<BackgroundProcess | undefined>
  }
>() {}

export const BackgroundProcessTool = {
  name: "background_process",
  description: `Start, stop, and manage long-running background processes.
  
Use this for:
- Starting development servers
- Running watch processes
- Managing database connections
- Any process that should persist across commands`,

  actions: {
    start: {
      description: "Start a new background process",
      parameters: {
        command: { type: "string", description: "Command to run" },
        ports: { type: "array", items: { type: "number" }, description: "Ports to monitor" },
      },
    },
    stop: {
      description: "Stop a running background process",
      parameters: {
        id: { type: "string", description: "Process ID to stop" },
      },
    },
    list: {
      description: "List all background processes",
      parameters: {},
    },
    logs: {
      description: "Get logs from a background process",
      parameters: {
        id: { type: "string", description: "Process ID" },
        tail: { type: "number", description: "Number of lines to return" },
      },
    },
  },
}

export const BackgroundProcessRegistryLive = Layer.succeed(
  BackgroundProcessRegistry,
  {
    processes: new Map<string, BackgroundProcess & { proc: any }>(),
    
    start: (command, options) => Effect.gen(function* () {
      const id = `bg_${nanoid(8)}`
      const proc = Bun.spawn(["sh", "-c", command], {
        stdout: "pipe",
        stderr: "pipe",
      })
      
      const process: BackgroundProcess = {
        id,
        command,
        pid: proc.pid,
        status: "running",
        startedAt: new Date(),
        ports: options?.ports ?? [],
        logs: [],
      }
      
      // @ts-ignore - accessing internal map
      this.processes.set(id, { ...process, proc })
      
      return process
    }),
    
    stop: (id) => Effect.gen(function* () {
      // @ts-ignore
      const entry = this.processes.get(id)
      if (entry) {
        entry.proc.kill()
        entry.status = "stopped"
        // @ts-ignore
        this.processes.delete(id)
      }
    }),
    
    list: () => Effect.gen(function* () {
      // @ts-ignore
      return Array.from(this.processes.values()).map(({ proc, ...p }) => p)
    }),
    
    getLogs: (id, tail = 100) => Effect.gen(function* () {
      // @ts-ignore
      const entry = this.processes.get(id)
      return entry?.logs.slice(-tail) ?? []
    }),
    
    getByPort: (port) => Effect.gen(function* () {
      // @ts-ignore
      for (const [, entry] of this.processes) {
        if (entry.ports.includes(port)) {
          const { proc, ...process } = entry
          return process
        }
      }
      return undefined
    }),
  }
)
```

### 5. Add background process port management
**File**: `src/tool/background-process/ports.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Port allocation and management for background processes (138 new lines upstream)

**New code**:
```typescript
// src/tool/background-process/ports.ts
import { Effect } from "effect"
import * as net from "net"

export namespace BackgroundProcessPorts {
  const MIN_PORT = 3000
  const MAX_PORT = 9999
  const allocatedPorts = new Set<number>()
  
  export function allocate(preferred?: number): Effect.Effect<number, Error> {
    return Effect.gen(function* () {
      if (preferred && !allocatedPorts.has(preferred)) {
        const available = yield* isAvailable(preferred)
        if (available) {
          allocatedPorts.add(preferred)
          return preferred
        }
      }
      
      // Find next available port
      for (let port = MIN_PORT; port <= MAX_PORT; port++) {
        if (allocatedPorts.has(port)) continue
        const available = yield* isAvailable(port)
        if (available) {
          allocatedPorts.add(port)
          return port
        }
      }
      
      return yield* Effect.fail(new Error("No available ports"))
    })
  }
  
  export function release(port: number): Effect.Effect<void> {
    return Effect.sync(() => {
      allocatedPorts.delete(port)
    })
  }
  
  export function isAvailable(port: number): Effect.Effect<boolean> {
    return Effect.async<boolean>((resume) => {
      const server = net.createServer()
      
      server.once("error", () => {
        resume(Effect.succeed(false))
      })
      
      server.once("listening", () => {
        server.close(() => {
          resume(Effect.succeed(true))
        })
      })
      
      server.listen(port, "127.0.0.1")
    })
  }
  
  export function getAllocated(): number[] {
    return Array.from(allocatedPorts)
  }
}
```

### 6. Update tool registry with new tools
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: Register new shell and background process tools

**Current code** (if modifying):
```typescript
import { BashTool } from "./bash"

export const ToolRegistry = {
  tools: new Map([
    ["bash", BashTool],
    // ... other tools
  ])
}
```

**New code**:
```typescript
import { ShellTool } from "./shell"
import { BackgroundProcessTool } from "./background-process"

export const ToolRegistry = {
  tools: new Map([
    ["shell", ShellTool],
    ["background_process", BackgroundProcessTool],
    // ... other tools
  ]),
  
  // Alias for backward compatibility
  aliases: new Map([
    ["bash", "shell"],
  ]),
  
  get(name: string) {
    const aliased = this.aliases.get(name) ?? name
    return this.tools.get(aliased)
  }
}
```

### 7. Add allow-everything permission mode
**File**: `src/permission/allow-everything.ts` (new file)
**Priority**: critical
**Type**: feature
**Reason**: New permission mode that bypasses all checks - useful for trusted environments (67 new lines upstream)

**New code**:
```typescript
// src/permission/allow-everything.ts
import { Effect, Context, Layer } from "effect"
import { PermissionChecker, PermissionResult } from "./index"

export interface AllowEverythingConfig {
  enabled: boolean
  auditLog?: boolean
}

export const AllowEverythingPermission = {
  create(config: AllowEverythingConfig): Layer.Layer<PermissionChecker> {
    if (!config.enabled) {
      return Layer.fail(new Error("AllowEverything mode not enabled"))
    }
    
    return Layer.succeed(
      PermissionChecker,
      {
        check: (request) => Effect.gen(function* () {
          if (config.auditLog) {
            console.log(`[PERMISSION AUDIT] Allowing: ${request.tool} - ${request.action}`)
          }
          
          return {
            allowed: true,
            reason: "allow-everything mode enabled",
            mode: "allow-everything",
          } satisfies PermissionResult
        }),
        
        checkBatch: (requests) => Effect.gen(function* () {
          return requests.map(request => ({
            request,
            result: {
              allowed: true,
              reason: "allow-everything mode enabled",
              mode: "allow-everything",
            } satisfies PermissionResult,
          }))
        }),
      }
    )
  },
  
  isEnabled(): boolean {
    return process.env["ALEXI_ALLOW_EVERYTHING"] === "true" ||
           process.env["KILO_ALLOW_EVERYTHING"] === "true"
  },
}
```

### 8. Update permission routes with simplified API
**File**: `src/permission/routes.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Upstream simplified permission routes, removing 46 lines of redundant code

**Current code** (if modifying):
```typescript
export const permissionRoutes = {
  check: async (request: PermissionRequest) => {
    // Complex validation logic
    const validated = validateRequest(request)
    if (!validated.valid) {
      return { allowed: false, reason: validated.error }
    }
    // ... more logic
  }
}
```

**New code**:
```typescript
import { Effect } from "effect"
import { PermissionChecker } from "./index"
import { AllowEverythingPermission } from "./allow-everything"

export const permissionRoutes = {
  check: (request: PermissionRequest) => Effect.gen(function* () {
    // Check for allow-everything mode first
    if (AllowEverythingPermission.isEnabled()) {
      return { allowed: true, reason: "allow-everything mode" }
    }
    
    const checker = yield* PermissionChecker
    return yield* checker.check(request)
  }),
}
```

### 9. Add filesystem readFileStringSafe method
**File**: `src/core/filesystem.ts`
**Priority**: medium
**Type**: feature
**Reason**: New safe file reading method that returns undefined instead of throwing on NotFound

**Current code** (if modifying):
```typescript
export namespace AppFileSystem {
  export interface Service {
    readonly existsSafe: (path: string) => Effect.Effect<boolean>
    readonly readJson: (path: string) => Effect.Effect<unknown, Error>
    // ...
  }
}
```

**New code**:
```typescript
export namespace AppFileSystem {
  export interface Service {
    readonly existsSafe: (path: string) => Effect.Effect<boolean>
    readonly readFileStringSafe: (path: string) => Effect.Effect<string | undefined, Error>
    readonly readJson: (path: string) => Effect.Effect<unknown, Error>
    // ...
  }
{"prompt_tokens":45056,"completion_tokens":4096,"total_tokens":49152}

[Session: 2714c506-0380-4b14-bfd8-2427180696a5]
[Messages: 2, Tokens: 49152]
