# Update Plan for Alexi

Generated: 2026-05-25
Based on upstream commits: kilocode cd915e833..4c0e6987b (438 commits)

## Summary
- Total changes planned: 28
- Critical: 3 | High: 8 | Medium: 12 | Low: 5

## Changes

### 1. Rename Bash Tool to Shell Tool
**File**: `src/tool/shell.ts` (rename from `src/tool/bash.ts`)
**Priority**: high
**Type**: refactor
**Reason**: Upstream renamed bash tool to shell for better cross-platform compatibility and clearer naming

**Current code**:
```typescript
// src/tool/bash.ts
export const BashTool = {
  name: "bash",
  // ...
}
```

**New code**:
```typescript
// src/tool/shell.ts
import { ShellId } from "./shell/id"
import { ShellPrompt } from "./shell/prompt"

export const ShellTool = {
  name: "shell",
  description: "Execute shell commands in the user's environment",
  // Updated implementation with better shell detection
  async execute(args: { command: string }) {
    const shellId = await ShellId.detect()
    const prompt = ShellPrompt.build(shellId)
    // ... execution logic
  }
}
```

### 2. Add Shell ID Detection Module
**File**: `src/tool/shell/id.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New module for detecting and managing shell types across platforms

**New code**:
```typescript
// src/tool/shell/id.ts
export namespace ShellId {
  export type ShellType = "bash" | "zsh" | "fish" | "powershell" | "cmd" | "unknown"
  
  export interface ShellInfo {
    type: ShellType
    path: string
    version?: string
  }

  export async function detect(): Promise<ShellInfo> {
    const shell = process.env.SHELL || process.env.COMSPEC || "/bin/sh"
    const type = inferType(shell)
    return { type, path: shell }
  }

  function inferType(shellPath: string): ShellType {
    const name = shellPath.toLowerCase()
    if (name.includes("bash")) return "bash"
    if (name.includes("zsh")) return "zsh"
    if (name.includes("fish")) return "fish"
    if (name.includes("powershell") || name.includes("pwsh")) return "powershell"
    if (name.includes("cmd")) return "cmd"
    return "unknown"
  }
}
```

### 3. Add Shell Prompt Builder Module
**File**: `src/tool/shell/prompt.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New module with 297 lines of shell prompt building logic for better command execution

**New code**:
```typescript
// src/tool/shell/prompt.ts
import { ShellId } from "./id"

export namespace ShellPrompt {
  export interface PromptOptions {
    workingDirectory?: string
    timeout?: number
    env?: Record<string, string>
  }

  export function build(shell: ShellId.ShellInfo, options: PromptOptions = {}): string {
    const { workingDirectory, timeout = 120000 } = options
    
    // Build shell-specific prompt configuration
    switch (shell.type) {
      case "powershell":
        return buildPowerShellPrompt(workingDirectory, timeout)
      case "cmd":
        return buildCmdPrompt(workingDirectory, timeout)
      default:
        return buildUnixPrompt(shell.type, workingDirectory, timeout)
    }
  }

  function buildUnixPrompt(type: ShellId.ShellType, cwd?: string, timeout?: number): string {
    const cdCmd = cwd ? `cd ${JSON.stringify(cwd)} && ` : ""
    return `${cdCmd}timeout ${Math.floor((timeout || 120000) / 1000)}`
  }

  function buildPowerShellPrompt(cwd?: string, timeout?: number): string {
    const cdCmd = cwd ? `Set-Location ${JSON.stringify(cwd)}; ` : ""
    return `${cdCmd}$ProgressPreference = 'SilentlyContinue'`
  }

  function buildCmdPrompt(cwd?: string, timeout?: number): string {
    return cwd ? `cd /d "${cwd}" &&` : ""
  }
}
```

### 4. Add Background Process Tool
**File**: `src/tool/background-process.ts` (new file)
**Priority**: critical
**Type**: feature
**Reason**: New tool for managing long-running background processes (175 lines of new functionality)

**New code**:
```typescript
// src/tool/background-process.ts
import { Effect, Schema } from "effect"
import { Tool } from "./registry"

export const BackgroundProcessSchema = Schema.Struct({
  command: Schema.String,
  name: Schema.optional(Schema.String),
  workingDirectory: Schema.optional(Schema.String),
  env: Schema.optional(Schema.Record(Schema.String, Schema.String)),
})

export type BackgroundProcessArgs = Schema.Schema.Type<typeof BackgroundProcessSchema>

export interface BackgroundProcess {
  id: string
  name: string
  command: string
  pid: number
  startedAt: Date
  status: "running" | "stopped" | "failed"
  ports: number[]
}

const runningProcesses = new Map<string, BackgroundProcess>()

export const BackgroundProcessTool: Tool = {
  name: "background_process",
  description: `Start and manage long-running background processes like dev servers.
Use this for commands that need to run continuously (e.g., npm run dev, docker-compose up).
The process will continue running after the tool returns.`,
  schema: BackgroundProcessSchema,
  
  async execute(args: BackgroundProcessArgs): Promise<string> {
    const { command, name, workingDirectory, env } = args
    const processId = generateId()
    const processName = name || command.split(" ")[0]
    
    // Start process in background
    const child = spawn(command, {
      shell: true,
      cwd: workingDirectory,
      env: { ...process.env, ...env },
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    })
    
    const bgProcess: BackgroundProcess = {
      id: processId,
      name: processName,
      command,
      pid: child.pid!,
      startedAt: new Date(),
      status: "running",
      ports: [],
    }
    
    runningProcesses.set(processId, bgProcess)
    
    // Detect ports asynchronously
    detectPorts(child).then(ports => {
      bgProcess.ports = ports
    })
    
    return JSON.stringify({
      success: true,
      processId,
      pid: child.pid,
      message: `Started background process: ${processName}`,
    })
  },
}

function generateId(): string {
  return `bg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

async function detectPorts(child: ChildProcess): Promise<number[]> {
  // Port detection logic
  return []
}

export function listBackgroundProcesses(): BackgroundProcess[] {
  return Array.from(runningProcesses.values())
}

export function stopBackgroundProcess(id: string): boolean {
  const proc = runningProcesses.get(id)
  if (!proc) return false
  
  try {
    process.kill(proc.pid, "SIGTERM")
    proc.status = "stopped"
    runningProcesses.delete(id)
    return true
  } catch {
    return false
  }
}
```

### 5. Add Background Process Port Detection
**File**: `src/tool/background-process/ports.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Port detection for background processes (138 lines)

**New code**:
```typescript
// src/tool/background-process/ports.ts
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export namespace BackgroundPorts {
  export async function detectForPid(pid: number): Promise<number[]> {
    const platform = process.platform
    
    try {
      if (platform === "darwin" || platform === "linux") {
        return await detectUnixPorts(pid)
      } else if (platform === "win32") {
        return await detectWindowsPorts(pid)
      }
    } catch {
      return []
    }
    
    return []
  }

  async function detectUnixPorts(pid: number): Promise<number[]> {
    try {
      const { stdout } = await execAsync(`lsof -Pan -p ${pid} -i`)
      const ports: number[] = []
      const lines = stdout.split("\n")
      
      for (const line of lines) {
        const match = line.match(/:(\d+)\s+\(LISTEN\)/)
        if (match) {
          ports.push(parseInt(match[1], 10))
        }
      }
      
      return [...new Set(ports)]
    } catch {
      return []
    }
  }

  async function detectWindowsPorts(pid: number): Promise<number[]> {
    try {
      const { stdout } = await execAsync(`netstat -ano | findstr ${pid}`)
      const ports: number[] = []
      const lines = stdout.split("\n")
      
      for (const line of lines) {
        const match = line.match(/:(\d+)\s+.*LISTENING/)
        if (match) {
          ports.push(parseInt(match[1], 10))
        }
      }
      
      return [...new Set(ports)]
    } catch {
      return []
    }
  }
}
```

### 6. Update Tool Registry with New Tools
**File**: `src/tool/registry.ts`
**Priority**: critical
**Type**: feature
**Reason**: Register new shell and background process tools

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

// Add tool categories for better organization
export const toolCategories = {
  execution: [ShellTool, BackgroundProcessTool],
  file: [ReadTool, WriteTool, GlobTool, GrepTool],
  // ... other categories
}
```

### 7. Add Allow-Everything Permission Mode
**File**: `src/permission/allow-everything.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New permission mode for trusted environments (67 lines)

**New code**:
```typescript
// src/permission/allow-everything.ts
import { Permission, PermissionResult } from "./index"

export interface AllowEverythingConfig {
  enabled: boolean
  excludePatterns?: string[]
}

export class AllowEverythingPermission implements Permission {
  private config: AllowEverythingConfig

  constructor(config: AllowEverythingConfig = { enabled: false }) {
    this.config = config
  }

  async check(request: PermissionRequest): Promise<PermissionResult> {
    if (!this.config.enabled) {
      return { allowed: false, reason: "Allow-everything mode is disabled" }
    }

    // Check exclusion patterns
    if (this.config.excludePatterns) {
      for (const pattern of this.config.excludePatterns) {
        if (this.matchesPattern(request.resource, pattern)) {
          return { 
            allowed: false, 
            reason: `Resource matches exclusion pattern: ${pattern}` 
          }
        }
      }
    }

    return { 
      allowed: true, 
      reason: "Allow-everything mode is enabled" 
    }
  }

  private matchesPattern(resource: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace(/\*/g, ".*"))
    return regex.test(resource)
  }
}

export function createAllowEverythingPermission(
  config?: AllowEverythingConfig
): AllowEverythingPermission {
  return new AllowEverythingPermission(config)
}
```

### 8. Update Permission Routes
**File**: `src/permission/routes.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Simplify permission routes (removed 42 lines, cleaner implementation)

**Current code**:
```typescript
export function setupPermissionRoutes(app: Hono) {
  app.post("/permission/check", async (c) => {
    // Complex permission checking logic
    // ...50+ lines
  })
}
```

**New code**:
```typescript
import { AllowEverythingPermission } from "./allow-everything"

export function setupPermissionRoutes(app: Hono) {
  const allowEverything = new AllowEverythingPermission({
    enabled: process.env.ALEXI_ALLOW_EVERYTHING === "true",
  })

  app.post("/permission/check", async (c) => {
    const request = await c.req.json<PermissionRequest>()
    
    // Check allow-everything first
    const allowResult = await allowEverything.check(request)
    if (allowResult.allowed) {
      return c.json(allowResult)
    }
    
    // Fall back to standard permission checking
    const result = await permissionManager.check(request)
    return c.json(result)
  })
}
```

### 9. Add AppFileSystem.readFileStringSafe Method
**File**: `src/core/filesystem.ts`
**Priority**: medium
**Type**: feature
**Reason**: Safe file reading that returns undefined instead of throwing on NotFound

**Current code**:
```typescript
export namespace AppFileSystem {
  export interface Service {
    readonly existsSafe: (path: string) => Effect.Effect<boolean>
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
    // ...
  }

  // In the implementation:
  const readFileStringSafe = Effect.fn("FileSystem.readFileStringSafe")(
    function* (path: string) {
      return yield* fs
        .readFileString(path)
        .pipe(
          Effect.catchReason("PlatformError", "NotFound", () => 
            Effect.succeed(undefined)
          )
        )
    }
  )
}
```

### 10. Add Experimental HttpApi Flag
**File**: `src/core/flag.ts`
**Priority**: medium
**Type**: feature
**Reason**: Feature flag for new HttpApi server backend with channel-based defaults

**Current code**:
```typescript
export const Flag = {
  ALEXI_EXPERIMENTAL: truthy("ALEXI_EXPERIMENTAL"),
  // ...
}
```

**New code**:
```typescript
import { InstallationChannel } from "./installation/version"

// Channels that default to the new effect-httpapi server backend
const HTTPAPI_DEFAULT_ON_CHANNELS = new Set(["dev", "beta", "local"])

export const Flag = {
  ALEXI_EXPERIMENTAL: truthy("ALEXI_EXPERIMENTAL"),
  
  // Defaults to true on dev/beta/local channels
  ALEXI_EXPERIMENTAL_HTTPAPI:
    truthy("ALEXI_EXPERIMENTAL_HTTPAPI") ||
    (!falsy("ALEXI_EXPERIMENTAL_HTTPAPI") && 
     HTTPAPI_DEFAULT_ON_CHANNELS.has(InstallationChannel)),
  
  ALEXI_EXPERIMENTAL_EVENT_SYSTEM: 
    ALEXI_
{"prompt_tokens":46557,"completion_tokens":4096,"total_tokens":50653}

[Session: 7880e33e-1fbc-4ff0-8ec9-2f267c65591b]
[Messages: 2, Tokens: 50653]
