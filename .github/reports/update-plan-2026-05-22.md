# Update Plan for Alexi

Generated: 2026-05-22
Based on upstream commits: kilocode e27b1bfd2..4c0e6987b (233 commits)

## Summary
- Total changes planned: 24
- Critical: 2 | High: 8 | Medium: 10 | Low: 4

## Changes

### 1. Rename Bash Tool to Shell Tool
**File**: `src/tool/shell.ts` (rename from `src/tool/bash.ts`)
**Priority**: high
**Type**: refactor
**Reason**: Upstream has renamed the bash tool to shell tool for better cross-platform compatibility and clearer naming. This is a significant architectural change that affects tool registration and invocation.

**Current code** (if exists as bash.ts):
```typescript
import { tool } from "@kilocode/plugin"

export const bashTool = tool({
  name: "bash",
  description: "Execute bash commands...",
  // ...
})
```

**New code**:
```typescript
import { tool } from "@kilocode/plugin"
import { shellId } from "./shell/id"
import { shellPrompt } from "./shell/prompt"

export const shellTool = tool({
  name: "shell",
  description: "Execute shell commands in the user's environment. Supports bash, zsh, fish, and PowerShell based on the detected shell.",
  // ...
})

export { shellId, shellPrompt }
```

### 2. Create Shell ID Module
**File**: `src/tool/shell/id.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New module for generating unique shell session identifiers, extracted from the main shell tool for better modularity.

**New code**:
```typescript
import { Effect } from "effect"
import { randomUUID } from "crypto"

export interface ShellId {
  readonly id: string
  readonly timestamp: number
}

export const createShellId = Effect.sync((): ShellId => ({
  id: randomUUID(),
  timestamp: Date.now(),
}))

export const parseShellId = (raw: string): ShellId | undefined => {
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed.id === "string" && typeof parsed.timestamp === "number") {
      return parsed as ShellId
    }
  } catch {
    return undefined
  }
  return undefined
}

export const serializeShellId = (shellId: ShellId): string => 
  JSON.stringify(shellId)
```

### 3. Create Shell Prompt Module
**File**: `src/tool/shell/prompt.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New 297-line module for shell prompt handling, including cross-platform shell detection and prompt customization.

**New code**:
```typescript
import { Effect, pipe } from "effect"
import * as os from "os"
import * as path from "path"

export interface ShellPromptConfig {
  readonly shell: "bash" | "zsh" | "fish" | "powershell" | "cmd" | "unknown"
  readonly cwd: string
  readonly user: string
  readonly hostname: string
}

export const detectShell = Effect.sync((): ShellPromptConfig["shell"] => {
  const shell = process.env.SHELL || process.env.ComSpec || ""
  const shellName = path.basename(shell).toLowerCase()
  
  if (shellName.includes("bash")) return "bash"
  if (shellName.includes("zsh")) return "zsh"
  if (shellName.includes("fish")) return "fish"
  if (shellName.includes("powershell") || shellName.includes("pwsh")) return "powershell"
  if (shellName.includes("cmd")) return "cmd"
  return "unknown"
})

export const getShellPromptConfig = Effect.gen(function* () {
  const shell = yield* detectShell
  return {
    shell,
    cwd: process.cwd(),
    user: os.userInfo().username,
    hostname: os.hostname(),
  } satisfies ShellPromptConfig
})

export const formatPrompt = (config: ShellPromptConfig): string => {
  const { shell, cwd, user, hostname } = config
  switch (shell) {
    case "powershell":
      return `PS ${cwd}> `
    case "cmd":
      return `${cwd}>`
    default:
      return `${user}@${hostname}:${cwd}$ `
  }
}

export const getShellExecutable = (shell: ShellPromptConfig["shell"]): string => {
  switch (shell) {
    case "bash": return "bash"
    case "zsh": return "zsh"
    case "fish": return "fish"
    case "powershell": return process.platform === "win32" ? "powershell.exe" : "pwsh"
    case "cmd": return "cmd.exe"
    default: return process.platform === "win32" ? "cmd.exe" : "sh"
  }
}

export const getShellArgs = (shell: ShellPromptConfig["shell"], command: string): string[] => {
  switch (shell) {
    case "powershell":
      return ["-NoProfile", "-Command", command]
    case "cmd":
      return ["/c", command]
    default:
      return ["-c", command]
  }
}
```

### 4. Update Tool Registry for Shell Rename
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: refactor
**Reason**: Update tool registry to use new shell tool name instead of bash.

**Current code**:
```typescript
import { bashTool } from "./bash"

export const defaultTools = {
  bash: bashTool,
  // ...
}
```

**New code**:
```typescript
import { shellTool } from "./shell"

export const defaultTools = {
  shell: shellTool,
  // Maintain backward compatibility alias
  bash: shellTool,
  // ...
}

// Tool name normalization for backward compatibility
export const normalizeToolName = (name: string): string => {
  if (name === "bash") return "shell"
  return name
}
```

### 5. Add Filesystem readFileStringSafe Method
**File**: `src/core/filesystem.ts`
**Priority**: critical
**Type**: feature
**Reason**: New safe file reading method that returns undefined instead of throwing on NotFound errors. Critical for robust file handling.

**Current code**:
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

  // In implementation:
  const readFileStringSafe = Effect.fn("FileSystem.readFileStringSafe")(function* (path: string) {
    return yield* fs
      .readFileString(path)
      .pipe(Effect.catchReason("PlatformError", "NotFound", () => Effect.succeed(undefined)))
  })
}
```

### 6. Add HTTPAPI Feature Flag with Channel-Based Defaults
**File**: `src/core/flag.ts`
**Priority**: critical
**Type**: feature
**Reason**: New feature flag system for experimental HTTPAPI with intelligent defaults based on installation channel. Critical for controlled rollout.

**Current code**:
```typescript
export const Flag = {
  KILO_EXPERIMENTAL: truthy("KILO_EXPERIMENTAL"),
  // ...
}
```

**New code**:
```typescript
import { InstallationChannel } from "../installation/version"

// Channels that default to the new effect-httpapi server backend
const HTTPAPI_DEFAULT_ON_CHANNELS = new Set(["dev", "beta", "local"])

export const Flag = {
  KILO_EXPERIMENTAL: truthy("KILO_EXPERIMENTAL"),
  
  KILO_WORKSPACE_ID: process.env["KILO_WORKSPACE_ID"],
  
  // Defaults to true on dev/beta/local channels so internal users exercise the
  // new effect-httpapi server backend. Stable (`prod`/`latest`) installs stay
  // on the legacy hono backend until the rollout is complete.
  KILO_EXPERIMENTAL_HTTPAPI:
    truthy("KILO_EXPERIMENTAL_HTTPAPI") ||
    (!falsy("KILO_EXPERIMENTAL_HTTPAPI") && HTTPAPI_DEFAULT_ON_CHANNELS.has(InstallationChannel)),
  
  KILO_EXPERIMENTAL_WORKSPACES: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_WORKSPACES"),
  KILO_EXPERIMENTAL_EVENT_SYSTEM: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_EVENT_SYSTEM"),
  // ...
}
```

### 7. Add Allow-Everything Permission Mode
**File**: `src/permission/allow-everything.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New permission mode that allows all operations without prompting. Useful for automated/CI environments.

**New code**:
```typescript
import { Effect } from "effect"
import { Permission, PermissionResult, PermissionRequest } from "./types"

export interface AllowEverythingConfig {
  readonly enabled: boolean
  readonly logAllowed?: boolean
}

export const createAllowEverythingPermission = (
  config: AllowEverythingConfig
): Permission => ({
  check: (request: PermissionRequest): Effect.Effect<PermissionResult> =>
    Effect.succeed({
      allowed: true,
      reason: "allow-everything mode enabled",
      request,
    }),
  
  name: "allow-everything",
  
  description: "Allows all permission requests without prompting",
})

export const isAllowEverythingEnabled = (): boolean => {
  return (
    process.env["ALEXI_ALLOW_EVERYTHING"] === "true" ||
    process.env["ALEXI_ALLOW_EVERYTHING"] === "1" ||
    process.env["CI"] === "true"
  )
}

export const maybeCreateAllowEverything = (): Permission | undefined => {
  if (isAllowEverythingEnabled()) {
    return createAllowEverythingPermission({ enabled: true, logAllowed: true })
  }
  return undefined
}
```

### 8. Update Permission Routes to Support Allow-Everything
**File**: `src/permission/routes.ts`
**Priority**: high
**Type**: refactor
**Reason**: Simplify permission routes and integrate allow-everything mode.

**Current code**:
```typescript
export const permissionRoutes = {
  check: async (request: PermissionRequest) => {
    // complex permission checking logic
  },
  // ...
}
```

**New code**:
```typescript
import { maybeCreateAllowEverything } from "./allow-everything"

const allowEverything = maybeCreateAllowEverything()

export const permissionRoutes = {
  check: async (request: PermissionRequest) => {
    // Check allow-everything first
    if (allowEverything) {
      return allowEverything.check(request)
    }
    
    // Standard permission checking logic
    // ...
  },
  // ...
}
```

### 9. Update Permission Index Exports
**File**: `src/permission/index.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Update exports to include new allow-everything module.

**Current code**:
```typescript
export * from "./types"
export * from "./routes"
export * from "./checker"
```

**New code**:
```typescript
export * from "./types"
export * from "./routes"
export * from "./checker"
export * from "./allow-everything"
```

### 10. Update Agent Triage Configuration
**File**: `src/agent/triage.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Update triage agent configuration to use new model and simplified team structure.

**Current code**:
```typescript
export const triageConfig = {
  model: "kilo/minimax/minimax-m2.5",
  // ...
}
```

**New code**:
```typescript
export const triageConfig = {
  mode: "primary",
  hidden: true,
  model: "openai/gpt-5-nano",
  color: "#44BA81",
  tools: {
    "*": false,
    "github-triage": true,
  },
}

// Simplified team structure
export const TEAMS = {
  tui: ["catrielmuller"],
  desktop_web: ["markijbema"],
  core: ["markijbema", "marius-kilocode", "catrielmuller", "chrarnoldus", "imanolmzd-svg"],
  jetbrains: ["kirillk"],
  inference: ["chrarnoldus", "markijbema"],
  windows: ["catrielmuller"],
  extension: ["markijbema"],
} as const

export type TeamName = keyof typeof TEAMS
```

### 11. Update GitHub Triage Tool
**File**: `src/tool/github-triage.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Simplify GitHub triage tool to only assign issues, removing label management.

**Current code**:
```typescript
export default tool({
  description: `Use this tool to assign and/or label a GitHub issue.`,
  args: {
    assignee: tool.schema.enum([...]),
    labels: tool.schema.array(...),
  },
  // ...
})
```

**New code**:
```typescript
import { tool } from "@kilocode/plugin"
import { TEAMS, TeamName } from "../agent/triage"

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

export default tool({
  description: `Use this tool to assign a GitHub issue.

Provide the team that should own the issue. This tool picks a random assignee from that team and does not apply labels.`,
  args: {
    team: tool.schema
      .enum(["tui", "desktop_web", "core", "inference", "windows", "jetbrains", "extension"])
      .describe("The team that should own this issue"),
    issue: tool.schema
      .number()
      .describe("The issue number to assign"),
  },
  run: async ({ team, issue }) => {
    const teamMembers = TEAMS[team as TeamName]
    const assignee = pick(teamMembers)
    
    await githubFetch(`/issues/${issue}`, {
      method: "PATCH",
      body: JSON.stringify({ assignees: [assignee] }),
    })
    
    return { success: true, assignee, team }
  },
})
```

### 12. Add Bus Event Type for Network Restored
**File**: `src/bus/bus-event.ts`
**Priority**: medium
**Type**: feature
**Reason**: Add new event type for network restoration with proper Schema.Finite typing.

**Current code**:
```typescript
export type BusEvent = 
  | { type: "session.created"; payload: SessionCreatedPayload }
  | { type: "session.updated"; payload: SessionUpdatedPayload }
  // ...
```

**New code**:
```typescript
import { Schema } from "effect"

export interface NetworkRestoredPayload {
  readonly restoredAt: number // Schema.Finite ensures valid number
  readonly sessionId: string
}

export type BusEvent = 
  | { type: "session.created"; payload: SessionCreatedPayload }
  | { type: "session.updated"; payload: SessionUpdatedPayload }
  | { type: "network.restored"; payload: NetworkRestoredPayload }
  // ...

// Schema for validation
export const NetworkRestoredPayloadSchema = Schema.Struct({
  restoredAt: Schema.Finite,
  sessionId: Schema.String,
})
```

### 13. Update Global Bus with Enhanced Event Handling
**File**: `src/
{"prompt_tokens":30689,"completion_tokens":4096,"total_tokens":34785}

[Session: 7b0e8c3f-94d1-46b9-94bc-d652d8e7d0e9]
[Messages: 2, Tokens: 34785]
