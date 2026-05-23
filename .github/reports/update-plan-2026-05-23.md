# Update Plan for Alexi

Generated: 2026-05-23
Based on upstream commits: kilocode 4c0e6987b..59bf44712 (409 commits)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 6 | Medium: 7 | Low: 3

## Changes

### 1. Rename bash tool to shell tool with enhanced prompt handling
**File**: `src/tool/shell.ts` (rename from `src/tool/bash.ts`)
**Priority**: high
**Type**: refactor
**Reason**: Upstream renamed bash.ts to shell.ts with significant refactoring for better shell handling, including new prompt detection and ID management

**Current code** (if exists as bash.ts):
```typescript
// bash.ts - original implementation
export const BashTool = {
  name: "bash",
  // ... existing implementation
}
```

**New code**:
```typescript
// shell.ts - renamed and enhanced
import { ShellId } from "./shell/id"
import { ShellPrompt } from "./shell/prompt"

export const ShellTool = {
  name: "shell",
  description: `Execute shell commands in the user's environment`,
  
  async execute(params: { command: string; workingDir?: string }) {
    const id = ShellId.generate()
    const prompt = new ShellPrompt({
      id,
      command: params.command,
      workingDir: params.workingDir
    })
    
    return prompt.execute()
  }
}
```

### 2. Add shell ID management module
**File**: `src/tool/shell/id.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New module for generating and managing shell execution IDs, extracted from upstream packages/opencode/src/tool/shell/id.ts

**New code**:
```typescript
import { nanoid } from "nanoid"

export namespace ShellId {
  export type ShellId = string & { readonly _brand: unique symbol }
  
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
**Reason**: New module with 297 lines of prompt handling logic from upstream, including command execution, output capture, and error handling

**New code**:
```typescript
import { Effect, Stream } from "effect"
import { ShellId } from "./id"

export interface ShellPromptConfig {
  id: ShellId.ShellId
  command: string
  workingDir?: string
  timeout?: number
  env?: Record<string, string>
}

export class ShellPrompt {
  private readonly config: ShellPromptConfig
  
  constructor(config: ShellPromptConfig) {
    this.config = {
      timeout: 30000,
      ...config
    }
  }
  
  execute(): Effect.Effect<ShellResult, ShellError> {
    return Effect.gen(this, function* () {
      const proc = yield* this.spawn()
      const output = yield* this.captureOutput(proc)
      return {
        id: this.config.id,
        exitCode: proc.exitCode,
        stdout: output.stdout,
        stderr: output.stderr,
        duration: output.duration
      }
    })
  }
  
  private spawn() {
    return Effect.tryPromise({
      try: () => Bun.spawn({
        cmd: ["sh", "-c", this.config.command],
        cwd: this.config.workingDir,
        env: { ...process.env, ...this.config.env },
        stdout: "pipe",
        stderr: "pipe"
      }),
      catch: (error) => new ShellSpawnError({ cause: error })
    })
  }
  
  private captureOutput(proc: Subprocess) {
    return Effect.gen(function* () {
      const startTime = Date.now()
      const stdout = yield* Effect.tryPromise(() => 
        new Response(proc.stdout).text()
      )
      const stderr = yield* Effect.tryPromise(() => 
        new Response(proc.stderr).text()
      )
      return {
        stdout,
        stderr,
        duration: Date.now() - startTime
      }
    })
  }
}

export interface ShellResult {
  id: ShellId.ShellId
  exitCode: number
  stdout: string
  stderr: string
  duration: number
}

export class ShellError extends Error {
  readonly _tag = "ShellError"
}

export class ShellSpawnError extends ShellError {
  readonly _tag = "ShellSpawnError"
}
```

### 4. Add background process tool for long-running operations
**File**: `src/tool/background-process.ts` (new file)
**Priority**: critical
**Type**: feature
**Reason**: New 175-line tool from upstream for managing background processes, critical for long-running operations like dev servers

**New code**:
```typescript
import { Effect, Layer, Context } from "effect"
import { Tool } from "./types"

export interface BackgroundProcess {
  id: string
  command: string
  pid: number
  startedAt: Date
  status: "running" | "stopped" | "failed"
  port?: number
}

export class BackgroundProcessRegistry extends Context.Tag("BackgroundProcessRegistry")<
  BackgroundProcessRegistry,
  {
    readonly list: () => Effect.Effect<BackgroundProcess[]>
    readonly start: (command: string, options?: StartOptions) => Effect.Effect<BackgroundProcess>
    readonly stop: (id: string) => Effect.Effect<void>
    readonly getOutput: (id: string, lines?: number) => Effect.Effect<string>
  }
>() {}

interface StartOptions {
  workingDir?: string
  env?: Record<string, string>
  port?: number
}

export const BackgroundProcessTool: Tool = {
  name: "background_process",
  description: `Start, stop, and manage background processes like dev servers.
  
Use this tool when:
- Starting development servers (npm run dev, etc.)
- Running long-lived processes that shouldn't block the conversation
- Managing multiple concurrent processes

The tool returns process IDs that can be used to check status or stop processes.`,

  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["start", "stop", "list", "output"],
        description: "The action to perform"
      },
      command: {
        type: "string",
        description: "Command to run (for start action)"
      },
      processId: {
        type: "string", 
        description: "Process ID (for stop/output actions)"
      },
      workingDir: {
        type: "string",
        description: "Working directory for the process"
      },
      port: {
        type: "number",
        description: "Expected port the process will listen on"
      }
    },
    required: ["action"]
  },

  execute: Effect.fn(function* (params: {
    action: "start" | "stop" | "list" | "output"
    command?: string
    processId?: string
    workingDir?: string
    port?: number
  }) {
    const registry = yield* BackgroundProcessRegistry
    
    switch (params.action) {
      case "list":
        return yield* registry.list()
      
      case "start":
        if (!params.command) {
          return yield* Effect.fail(new Error("Command required for start action"))
        }
        return yield* registry.start(params.command, {
          workingDir: params.workingDir,
          port: params.port
        })
      
      case "stop":
        if (!params.processId) {
          return yield* Effect.fail(new Error("Process ID required for stop action"))
        }
        yield* registry.stop(params.processId)
        return { stopped: params.processId }
      
      case "output":
        if (!params.processId) {
          return yield* Effect.fail(new Error("Process ID required for output action"))
        }
        return yield* registry.getOutput(params.processId, 100)
    }
  })
}
```

### 5. Add background process port management
**File**: `src/tool/background-process/ports.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: 138-line module from upstream for managing ports used by background processes

**New code**:
```typescript
import { Effect } from "effect"
import * as net from "net"

export namespace Ports {
  const usedPorts = new Set<number>()
  
  export function isAvailable(port: number): Effect.Effect<boolean> {
    return Effect.tryPromise({
      try: () => new Promise<boolean>((resolve) => {
        const server = net.createServer()
        server.once("error", () => resolve(false))
        server.once("listening", () => {
          server.close()
          resolve(true)
        })
        server.listen(port, "127.0.0.1")
      }),
      catch: () => false
    })
  }
  
  export function reserve(port: number): Effect.Effect<void> {
    return Effect.sync(() => {
      usedPorts.add(port)
    })
  }
  
  export function release(port: number): Effect.Effect<void> {
    return Effect.sync(() => {
      usedPorts.delete(port)
    })
  }
  
  export function findAvailable(startPort: number = 3000): Effect.Effect<number> {
    return Effect.gen(function* () {
      let port = startPort
      while (port < 65535) {
        if (!usedPorts.has(port)) {
          const available = yield* isAvailable(port)
          if (available) {
            yield* reserve(port)
            return port
          }
        }
        port++
      }
      return yield* Effect.fail(new Error("No available ports found"))
    })
  }
  
  export function waitForPort(port: number, timeout: number = 30000): Effect.Effect<void> {
    return Effect.gen(function* () {
      const startTime = Date.now()
      while (Date.now() - startTime < timeout) {
        const available = yield* isAvailable(port)
        if (!available) {
          // Port is in use, meaning the server started
          return
        }
        yield* Effect.sleep(500)
      }
      return yield* Effect.fail(new Error(`Timeout waiting for port ${port}`))
    })
  }
}
```

### 6. Update tool registry with background process and shell tools
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: Registry needs to include new background_process tool and updated shell tool

**Current code**:
```typescript
import { BashTool } from "./bash"

export const defaultTools = [
  BashTool,
  // ... other tools
]
```

**New code**:
```typescript
import { ShellTool } from "./shell"
import { BackgroundProcessTool } from "./background-process"

export const defaultTools = [
  ShellTool,
  BackgroundProcessTool,
  // ... other tools
]

// Tool registration with indexing support
export function registerTool(tool: Tool, options?: { indexing?: boolean }) {
  const registered = [...defaultTools, tool]
  
  if (options?.indexing) {
    // Enable semantic search for tool documentation
    indexToolDocumentation(tool)
  }
  
  return registered
}

function indexToolDocumentation(tool: Tool) {
  // Index tool name, description, and parameter documentation
  // for semantic search capabilities
}
```

### 7. Add permission allow-everything module for development
**File**: `src/permission/allow-everything.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: New 67-line module from upstream for development/testing scenarios where all permissions are granted

**New code**:
```typescript
import { Effect } from "effect"
import { Permission, PermissionResult } from "./types"

/**
 * Permission handler that allows all operations.
 * 
 * WARNING: Only use in development/testing environments.
 * Never use in production as it bypasses all security checks.
 */
export const AllowEverythingPermission: Permission = {
  name: "allow-everything",
  
  check(request: PermissionRequest): Effect.Effect<PermissionResult> {
    return Effect.succeed({
      allowed: true,
      reason: "Development mode - all permissions granted"
    })
  },
  
  isEnabled(): boolean {
    return process.env.NODE_ENV === "development" || 
           process.env.ALEXI_ALLOW_ALL_PERMISSIONS === "true"
  }
}

export function withAllowEverything<R, E, A>(
  effect: Effect.Effect<R, E, A>
): Effect.Effect<R, E, A> {
  if (!AllowEverythingPermission.isEnabled()) {
    return effect
  }
  
  return Effect.provideService(
    effect,
    PermissionService,
    {
      check: () => Effect.succeed({ allowed: true, reason: "allow-everything" })
    }
  )
}
```

### 8. Update permission routes with simplified structure
**File**: `src/permission/routes.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Upstream removed 46 lines and added 4, simplifying permission route handling

**Current code**:
```typescript
export const permissionRoutes = {
  // ... complex routing logic
}
```

**New code**:
```typescript
import { Effect } from "effect"
import { PermissionService } from "./service"

export const permissionRoutes = {
  check: (request: PermissionRequest) => 
    Effect.gen(function* () {
      const service = yield* PermissionService
      return yield* service.check(request)
    }),
    
  grant: (request: PermissionRequest) =>
    Effect.gen(function* () {
      const service = yield* PermissionService
      return yield* service.grant(request)
    })
}
```

### 9. Update core filesystem with readFileStringSafe method
**File**: `src/core/filesystem.ts`
**Priority**: medium
**Type**: feature
**Reason**: New safe file reading method that returns undefined instead of throwing on NotFound

**Current code**:
```typescript
export const AppFileSystem = {
  readFileString: (path: string) => Effect.Effect<string, Error>
  // ... other methods
}
```

**New code**:
```typescript
export const AppFileSystem = {
  readFileString: (path: string): Effect.Effect<string, Error> => {
    return Effect.tryPromise({
      try: () => Bun.file(path).text(),
      catch: (error) => new FileReadError({ path, cause: error })
    })
  },
  
  /**
   * Safely read a file, returning undefined if the file doesn't exist.
   * Useful for optional configuration files.
   */
  readFileStringSafe: (path: string): Effect.Effect<string | undefined, Error> => {
    return Effect.gen(function* () {
      const exists = yield* AppFileSystem.existsSafe(path)
      if (!exists) {
        return undefined
      }
      return yield* AppFileSystem.readFileString(path)
    }).pipe(
      Effect.catchTag("NotFound", () => Effect.succeed(undefined))
    )
  },
  
  // ... other methods
}
```

### 10. Add experimental httpapi flag support
**File**: `src/core/flag.ts`
**Priority**: medium
**Type**: feature
**Reason**: New flags for experimental httpapi and event system from upstream

**Current code**:
```typescript
export const Flag = {
  // existing flags
}
```

**New code**:
```typescript
const HTTPAPI_DEFAULT_ON_CHANNELS = new Set(["dev", "beta", "local"])

function truthy(key: string): boolean
{"prompt_tokens":45057,"completion_tokens":4096,"total_tokens":49153}

[Session: dc39e73e-4bc8-4634-bcda-c4f306d844a7]
[Messages: 2, Tokens: 49153]
