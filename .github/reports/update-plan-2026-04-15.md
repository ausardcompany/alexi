# Update Plan for Alexi

Generated: 2026-04-15
Based on upstream commits: kilocode ba7b123f0..b0a658ed1 (227 commits), opencode 7cbe162..c98f616 (66 commits)

## Summary
- Total changes planned: 28
- Critical: 3 | High: 8 | Medium: 12 | Low: 5

## Changes

### 1. Add Global Config Directory Whitelisting for Agent Reads
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: security
**Reason**: Agents need to read global config directories without prompting, but this must be explicitly whitelisted to prevent security issues. This change allows skill files and global configs to be read without triggering permission prompts.

**Current code** (if modifying):
```typescript
const whitelistedDirs = [Truncate.GLOB, ...skillDirs.map((dir) => path.join(dir, "*"))]
```

**New code**:
```typescript
import { Global } from "@/global"
import { AlexiPaths } from "@/alexi/paths" // Create this module if needed

// Include global config dirs so agents can read them without prompting
const whitelistedDirs = [
  Truncate.GLOB,
  ...skillDirs.map((dir) => path.join(dir, "*")),
  path.join(Global.Path.config, "*"),
  ...AlexiPaths.globalDirs().map((dir) => path.join(dir, "*")),
]
```

### 2. Create Alexi Paths Module for Global Directory Management
**File**: `src/alexi/paths.ts` (new file)
**Priority**: critical
**Type**: feature
**Reason**: Centralized management of Alexi-specific global directories for config, cache, and data paths. Required by the agent whitelisting change.

**New code**:
```typescript
// Alexi-specific path management
import path from "path"
import os from "os"

export namespace AlexiPaths {
  /**
   * Returns all global directories that Alexi uses for configuration and data.
   * These directories are whitelisted for agent read access.
   */
  export function globalDirs(): string[] {
    const home = os.homedir()
    const dirs: string[] = []
    
    // XDG-style config directories
    const xdgConfig = process.env.XDG_CONFIG_HOME || path.join(home, ".config")
    dirs.push(path.join(xdgConfig, "alexi"))
    
    // XDG-style data directories
    const xdgData = process.env.XDG_DATA_HOME || path.join(home, ".local", "share")
    dirs.push(path.join(xdgData, "alexi"))
    
    // Legacy home directory config
    dirs.push(path.join(home, ".alexi"))
    
    // Platform-specific paths
    if (process.platform === "darwin") {
      dirs.push(path.join(home, "Library", "Application Support", "alexi"))
    } else if (process.platform === "win32") {
      const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming")
      dirs.push(path.join(appData, "alexi"))
    }
    
    return dirs
  }
  
  /**
   * Check if a path is within a global config directory
   */
  export function isGlobalConfigPath(filePath: string): boolean {
    const normalizedPath = path.normalize(filePath)
    return globalDirs().some(dir => normalizedPath.startsWith(path.normalize(dir)))
  }
}
```

### 3. Update Config Protection to Allow File Tool Reads
**File**: `src/permission/config-paths.ts`
**Priority**: critical
**Type**: security
**Reason**: File tools should be able to read global config without prompting, but edits must still be protected. The current implementation may block legitimate read operations.

**Current code** (if modifying):
```typescript
export function isRequest(request: {
  permission: string
  patterns: string[]
  metadata?: Record<string, any>
}): boolean {
  if (request.permission === "external_directory") {
    for (const pattern of request.patterns) {
      const dir = pattern.replace(/\/\*$/, "")
      if (isAbsolute(dir)) return true
    }
    return false
  }
  // ...
}
```

**New code**:
```typescript
import path from "path"

/**
 * Determine if a permission request targets config files.
 * Gates `edit` permissions and bash-originated `external_directory` requests.
 * File-tool reads are not restricted.
 */
export function isRequest(request: {
  permission: string
  patterns: string[]
  metadata?: Record<string, any>
}): boolean {
  if (request.permission === "external_directory") {
    // File tools include metadata.filepath. They may read global config
    // without prompting, but edits are still protected separately via `edit`.
    if (request.metadata?.filepath) return false
    for (const pattern of request.patterns) {
      const dir = pattern.replace(/\/\*$/, "")
      if (path.isAbsolute(dir) && isAbsolute(dir)) return true
    }
    return false
  }
  // ... rest of implementation
}
```

### 4. Add Config Validation for Apply Patch Tool
**File**: `src/tool/apply_patch.ts`
**Priority**: high
**Type**: security
**Reason**: Validate configuration files after patches are applied to prevent malformed configs from being written.

**Current code** (if modifying):
```typescript
const changedPaths = fileChanges
  .filter((c) => c.type !== "delete")
  .map((c) => Filesystem.normalizePath(c.movePath ?? c.filePath))
```

**New code**:
```typescript
import { ConfigValidation } from "../alexi/config-validation"

const changedPaths = fileChanges
  .filter((c) => c.type !== "delete")
  .map((c) => Filesystem.normalizePath(c.movePath ?? c.filePath))

// Validate config files after changes
for (const changed of fileChanges) {
  if (changed.type === "delete") continue
  output += await ConfigValidation.check(changed.movePath ?? changed.filePath)
}
```

### 5. Create Config Validation Module
**File**: `src/alexi/config-validation.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Validates configuration files after edits to ensure they remain valid. Prevents agents from corrupting config files.

**New code**:
```typescript
import path from "path"
import { AlexiPaths } from "./paths"

export namespace ConfigValidation {
  /**
   * Check if a file is a config file and validate it if so.
   * Returns warning messages if validation fails.
   */
  export async function check(filePath: string): Promise<string> {
    if (!AlexiPaths.isGlobalConfigPath(filePath)) {
      return ""
    }
    
    const ext = path.extname(filePath).toLowerCase()
    const warnings: string[] = []
    
    try {
      const fs = await import("fs/promises")
      const content = await fs.readFile(filePath, "utf-8")
      
      if (ext === ".json") {
        try {
          JSON.parse(content)
        } catch (e) {
          warnings.push(`Warning: ${filePath} contains invalid JSON`)
        }
      } else if (ext === ".yaml" || ext === ".yml") {
        // Optional: Add YAML validation if yaml parser is available
        try {
          const yaml = await import("yaml")
          yaml.parse(content)
        } catch (e) {
          warnings.push(`Warning: ${filePath} contains invalid YAML`)
        }
      } else if (ext === ".toml") {
        // Optional: Add TOML validation if toml parser is available
        try {
          const toml = await import("@iarna/toml")
          toml.parse(content)
        } catch (e) {
          warnings.push(`Warning: ${filePath} contains invalid TOML`)
        }
      }
    } catch (e) {
      // File doesn't exist or can't be read - not a validation error
    }
    
    return warnings.join("\n")
  }
}
```

### 6. Update Diff Schema to Use Patch Field
**File**: `src/tool/apply_patch.ts`
**Priority**: high
**Type**: refactor
**Reason**: Upstream changed diff schema to use a single `patch` field instead of separate `diff`, `before`, and `after` fields. This simplifies the data structure and reduces memory usage.

**Current code** (if modifying):
```typescript
return {
  filePath: change.filePath,
  relativePath: path.relative(Instance.worktree, change.movePath ?? change.filePath).replaceAll("\\", "/"),
  type: change.type,
  diff: change.diff,
  before: change.oldContent,
  after: change.newContent,
  additions: change.additions,
  deletions: change.deletions,
  movePath: change.movePath,
}
```

**New code**:
```typescript
return {
  filePath: change.filePath,
  relativePath: path.relative(Instance.worktree, change.movePath ?? change.filePath).replaceAll("\\", "/"),
  type: change.type,
  patch: change.diff,  // Consolidated field
  additions: change.additions,
  deletions: change.deletions,
  movePath: change.movePath,
}
```

### 7. Create Alexi Tool Registry Module
**File**: `src/alexi/tool/registry.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Centralized Alexi-specific tool registration logic, including SAP AI Core specific tools and feature flags.

**New code**:
```typescript
import { Tool } from "../../tool/tool"
import { Flag } from "@/flag/flag"
import { ProviderID } from "../../provider/schema"
import { Env } from "../../env"
import { Effect } from "effect"

export namespace AlexiToolRegistry {
  /** Build Alexi-specific tools */
  export function build() {
    return Effect.all({
      // Add SAP-specific tools here
      // sapSearch: Tool.init(SAPSearchTool),
    })
  }

  /** Override question-tool client gating */
  export function question(): boolean {
    return ["app", "cli", "desktop", "vscode", "sap"].includes(Flag.ALEXI_CLIENT) || Flag.ALEXI_ENABLE_QUESTION_TOOL
  }

  /** Plan tool availability */
  export function plan(): boolean {
    return true
  }

  /** Alexi-specific tools to append to the builtin list */
  export function extra(
    tools: Record<string, Tool.Def>,
    cfg: { experimental?: { codebase_search?: boolean; sap_integration?: boolean } },
  ): Tool.Def[] {
    const extra: Tool.Def[] = []
    // Add SAP-specific tools based on config
    if (cfg.experimental?.sap_integration) {
      // extra.push(tools.sapSearch)
    }
    return extra
  }

  /** Check for E2E LLM URL */
  export function e2e(): boolean {
    return !!Env.get("ALEXI_E2E_LLM_URL")
  }
}
```

### 8. Create Alexi Task Module for Subagent Validation
**File**: `src/alexi/tool/task.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Handles subagent validation and permission inheritance for task tool operations.

**New code**:
```typescript
import { Permission } from "@/permission"
import type { Session } from "../../session"
import type { Agent } from "../../agent/agent"
import type { Config } from "../../config/config"

export namespace AlexiTask {
  /** Reject primary agents used as subagents */
  export function validate(info: Agent.Info, name: string) {
    if (info.mode === "primary") {
      throw new Error(`Agent "${name}" is a primary agent and cannot be used as a subagent`)
    }
  }

  /**
   * Build inherited permission rules from the calling agent.
   * Merges the static agent definition with the session's accumulated permissions
   * so restrictions survive multi-hop chains.
   */
  export function inherited(input: {
    caller: Agent.Info
    session: Session.Info
    mcp: Config.Info["mcp"]
  }): Permission.Ruleset {
    const rules = Permission.merge(input.caller.permission ?? [], input.session.permission ?? [])
    const prefixes = Object.keys(input.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
    const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))
    return rules.filter(
      (r: Permission.Rule) => r.permission === "edit" || r.permission === "bash" || isMcp(r.permission),
    )
  }

  /** Extra permission rules appended to subagent sessions */
  export function permissions(rules: Permission.Ruleset): Permission.Ruleset {
    return [{ permission: "task", pattern: "*", action: "deny" }, ...rules]
  }
}
```

### 9. Update Tool Registry to Support Alexi Extensions
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: refactor
**Reason**: Integrate Alexi-specific tool registry with the main tool registration system.

**Current code** (if modifying):
```typescript
export function buildTools(config: Config.Info) {
  // existing tool building logic
}
```

**New code**:
```typescript
import { AlexiToolRegistry } from "../alexi/tool/registry"

export function buildTools(config: Config.Info) {
  return Effect.gen(function* () {
    // Build base tools
    const baseTools = yield* buildBaseTools(config)
    
    // Build Alexi-specific tools
    const alexiTools = yield* AlexiToolRegistry.build()
    
    // Get extra tools based on config
    const extraTools = AlexiToolRegistry.extra(
      { ...baseTools, ...alexiTools },
      config
    )
    
    // Override question tool availability
    const questionEnabled = AlexiToolRegistry.question()
    
    return {
      ...baseTools,
      ...alexiTools,
      extra: extraTools,
      questionEnabled,
    }
  })
}
```

### 10. Update Bash Tool Timeout Handling
**File**: `src/tool/bash.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Improve bash timeout retry hints and handle interrupted bash output properly in tool results.

**Current code** (if modifying):
```typescript
if (timedOut) {
  return {
    output: truncatedOutput,
    error: "Command timed out",
  }
}
```

**New code**:
```typescript
if (timedOut) {
  return {
    output: truncatedOutput,
    error: `Command timed out after ${timeout}ms. Consider:
- Breaking the command into smaller steps
- Using background execution with &
- Increasing timeout in config if this is expected behavior`,
  }
}

// Preserve interrupted bash output in tool results
if (interrupted && truncatedOutput) {
  return {
    output: truncatedOutput,
    error: "Command was interrupted but partial output is available",
    interrupted: true,
  }
}
```

### 11. Update Read Tool with Improved Permission Handling
**File**: `src/tool/read.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Major refactor of read tool to improve permission handling and config file access patterns.

**New code** (add to existing):
```typescript
import { AlexiPaths } from "../alexi/paths"

// Add to permission check logic
function shouldPromptForRead(filePath: string, metadata?: Record<string, any>): boolean {
  // Global config files can be read without prompting
  if (AlexiPaths.
{"prompt_tokens":37491,"completion_tokens":4096,"total_tokens":41587}

[Session: d1a2b2ba-4cfa-4ae1-b829-b44dea91f7ea]
[Messages: 2, Tokens: 41587]
