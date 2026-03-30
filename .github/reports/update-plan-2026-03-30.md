# Update Plan for Alexi

Generated: 2026-03-30
Based on upstream commits: kilocode 32a2fb9d..121f6e3c (80 commits), opencode 47d2ab1..7715252 (80 commits)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 6 | Medium: 7 | Low: 3

## Changes

### 1. Add Config Path Protection System
**File**: `src/permission/config-paths.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Prevents AI agents from modifying configuration files without explicit user approval, closing a potential security bypass where agents could modify their own permissions or behavior.

**New code**:
```typescript
import path from "path"
import { Global } from "@/global"
import { AlexiPaths } from "@/paths"

export namespace ConfigProtection {
  /**
   * Config directory prefixes (relative paths, forward-slash normalized).
   * Matches .alexi/, .kilocode/, .opencode/ at any depth within the project.
   */
  const CONFIG_DIRS = [".alexi/", ".kilocode/", ".opencode/"]

  /**
   * Subdirectories under CONFIG_DIRS that are NOT config files (e.g. plan files).
   * Paths under these subdirs are exempt from config protection.
   */
  const EXCLUDED_SUBDIRS = ["plans/"]

  /**
   * Root-level config files that must be protected.
   * Matched only when the relative path has no directory component.
   */
  const CONFIG_ROOT_FILES = new Set([
    "alexi.json",
    "alexi.jsonc", 
    "kilo.json",
    "kilo.jsonc",
    "opencode.json",
    "opencode.jsonc",
    "AGENTS.md"
  ])

  /** Metadata key used to signal the UI to hide the "Allow always" option. */
  export const DISABLE_ALWAYS_KEY = "disableAlways" as const

  function normalize(p: string): string {
    return path.posix.normalize(p.replaceAll("\\", "/"))
  }

  /** Return the remainder after the config dir prefix, or undefined if excluded. */
  function excluded(remainder: string): boolean {
    return EXCLUDED_SUBDIRS.some((sub) => remainder.startsWith(sub))
  }

  /** Check if a project-relative path points to a config file or directory. */
  export function isRelative(pattern: string): boolean {
    const normalized = normalize(pattern)
    for (const dir of CONFIG_DIRS) {
      const bare = dir.slice(0, -1) // e.g. ".alexi"
      // Match at root (e.g. ".alexi/foo") or nested (e.g. "packages/sub/.alexi/foo")
      if (normalized === bare || normalized.endsWith("/" + bare)) return true
      if (normalized.startsWith(dir)) {
        if (excluded(normalized.slice(dir.length))) continue
        return true
      }
      const nested = "/" + dir
      const idx = normalized.indexOf(nested)
      if (idx >= 0) {
        const remainder = normalized.slice(idx + nested.length)
        if (!excluded(remainder)) return true
      }
    }
    // Check root-level config files
    const basename = path.posix.basename(normalized)
    const dirname = path.posix.dirname(normalized)
    if ((dirname === "." || dirname === "") && CONFIG_ROOT_FILES.has(basename)) {
      return true
    }
    return false
  }

  /** Check if an absolute path points to the global config directory. */
  export function isGlobalConfigDir(absolutePath: string): boolean {
    const globalConfigDir = AlexiPaths.globalConfigDir()
    const normalized = normalize(absolutePath)
    const normalizedGlobal = normalize(globalConfigDir)
    return normalized.startsWith(normalizedGlobal + "/") || normalized === normalizedGlobal
  }

  /** Check if a permission request involves config files. */
  export function isRequest(request: { patterns?: string[]; metadata?: Record<string, unknown> }): boolean {
    if (!request.patterns) return false
    return request.patterns.some((p) => isRelative(p) || isGlobalConfigDir(p))
  }
}
```

### 2. Integrate Config Protection into Permission System
**File**: `src/permission/next.ts`
**Priority**: critical
**Type**: security
**Reason**: Forces permission prompts for config file edits and prevents "always allow" rules from being saved for config modifications.

**Current code**:
```typescript
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
import { drainCovered } from "@/permission/drain"
```

**New code**:
```typescript
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
import { drainCovered } from "@/permission/drain"
import { ConfigProtection } from "@/permission/config-paths"

// ... existing code ...

export namespace PermissionNext {
  // ... existing functions ...

  export const request = fn(RequestInput, async (input) => {
    const s = await state()
    const { ruleset, ...request } = input
    
    // Force "ask" for config file edits
    const protected_ = ConfigProtection.isRequest(request)
    
    for (const pattern of request.patterns ?? []) {
      const rule = evaluate(request.permission, pattern, ruleset, s.approved)
      log.info("evaluated", { permission: request.permission, pattern, action: rule })
      if (rule.action === "deny")
        throw new DeniedError(ruleset.filter((r) => Wildcard.match(request.permission, r.permission)))
      
      // Override "allow" to "ask" for config paths
      if (rule.action === "ask" || (rule.action === "allow" && protected_)) {
        const id = input.id ?? Identifier.ascending("permission")
        return new Promise<void>((resolve, reject) => {
          const info: Request = {
            id,
            ...request,
            metadata: {
              ...request.metadata,
              ...(protected_ ? { [ConfigProtection.DISABLE_ALWAYS_KEY]: true } : {}),
            },
          }
          s.pending[id] = {
            info,
            ruleset,
            resolve,
            reject,
          }
          Bus.publish("permission.requested", info)
        })
      }
    }
  })

  export const approve = fn(ApproveInput, async (input) => {
    const s = await state()
    const existing = s.pending[input.requestID]
    if (!existing) throw new NotFoundError({ message: `Permission request ${input.requestID} not found` })

    // Skip rule persistence for config file edits
    if (ConfigProtection.isRequest(existing.info)) {
      delete s.pending[input.requestID]
      existing.resolve()
      return
    }

    // ... rest of existing approve logic ...
  })
}
```

### 3. Update Permission Drain to Skip Config Files
**File**: `src/permission/drain.ts`
**Priority**: high
**Type**: security
**Reason**: Ensures config file edit permissions are never auto-resolved, always requiring explicit user approval.

**Current code**:
```typescript
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
import type { PermissionNext } from "@/permission/next"

export async function drainCovered(
  pending: Record<string, PendingEntry>,
  approved: ApprovedRules,
  exclude?: string,
) {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) continue
    const actions = entry.info.patterns.map((pattern) =>
      evaluate(entry.info.permission, pattern, entry.ruleset, approved),
    )
```

**New code**:
```typescript
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
import type { PermissionNext } from "@/permission/next"
import { ConfigProtection } from "@/permission/config-paths"

export async function drainCovered(
  pending: Record<string, PendingEntry>,
  approved: ApprovedRules,
  exclude?: string,
) {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) continue
    // Never auto-resolve config file edit permissions
    if (ConfigProtection.isRequest(entry.info)) continue
    const actions = entry.info.patterns.map((pattern) =>
      evaluate(entry.info.permission, pattern, entry.ruleset, approved),
    )
```

### 4. Add Built-in Skills Support with Config Reference Skill
**File**: `src/skill/builtin.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Provides a built-in skill for on-demand configuration reference, helping users understand available settings without external documentation.

**New code**:
```typescript
import { Skill } from "@/skill/skill"
import alexiConfigContent from "./alexi-config.md"

export namespace BuiltinSkills {
  export const ALEXI_CONFIG: Skill.Info = {
    name: "alexi-config",
    description: "Reference for Alexi configuration options and settings. Use when users ask about configuring Alexi, customizing behavior, or understanding available settings.",
    location: Skill.BUILTIN_LOCATION,
    content: alexiConfigContent,
  }

  export const ALL = [ALEXI_CONFIG] as const

  export function get(name: string): Skill.Info | undefined {
    return ALL.find((s) => s.name === name)
  }

  export function isBuiltin(location: string): boolean {
    return location === Skill.BUILTIN_LOCATION
  }
}
```

### 5. Update Skill Tool to Handle Built-in Skills
**File**: `src/tool/skill.ts`
**Priority**: high
**Type**: feature
**Reason**: Enables the skill tool to properly load and display built-in skills that don't have filesystem locations.

**Current code**:
```typescript
import { pathToFileURL } from "url"
import { Tool } from "@/tool"
import { Skill } from "@/skill"

export const SkillTool = Tool.define("skill", async (ctx) => {
  const skills = await Skill.all()
  
  // ... existing code ...
  
  ...accessibleSkills.flatMap((skill) => [
    `  <skill>`,
    `    <name>${skill.name}</name>`,
    `    <description>${skill.description}</description>`,
    `    <location>${pathToFileURL(skill.location).href}</location>`,
    `  </skill>`,
  ]),
```

**New code**:
```typescript
import { pathToFileURL } from "url"
import { Tool } from "@/tool"
import { Skill } from "@/skill"
import { BuiltinSkills } from "@/skill/builtin"

const BUILTIN = Skill.BUILTIN_LOCATION

export const SkillTool = Tool.define("skill", async (ctx) => {
  const skills = await Skill.all()
  
  // ... existing code ...
  
  ...accessibleSkills.flatMap((skill) => {
    const loc = skill.location === BUILTIN ? BUILTIN : pathToFileURL(skill.location).href
    return [
      `  <skill>`,
      `    <name>${skill.name}</name>`,
      `    <description>${skill.description}</description>`,
      `    <location>${loc}</location>`,
      `  </skill>`,
    ]
  }),
  
  // ... in execute function, add handling for built-in skills ...
  
  // Built-in skills have no filesystem directory
  if (skill.location === BUILTIN) {
    const builtinSkill = BuiltinSkills.get(skill.name)
    if (!builtinSkill?.content) {
      return {
        title: `Error: Built-in skill ${skill.name} not found`,
        output: `The built-in skill "${skill.name}" could not be loaded.`,
        metadata: {},
      }
    }
    return {
      title: `Loaded skill: ${skill.name}`,
      output: [
        `<skill_content name="${skill.name}">`,
        `# Skill: ${skill.name}`,
        "",
        builtinSkill.content,
        "</skill_content>",
      ].join("\n"),
      metadata: {},
    }
  }
```

### 6. Prevent Removal of Built-in Skills
**File**: `src/skill/skill.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Prevents errors when attempting to remove built-in skills which have no filesystem location.

**Current code**:
```typescript
export namespace Skill {
  // ... existing code ...
  
  export async function remove(name: string): Promise<void> {
    const skill = await get(name)
    if (!skill) {
      throw new Error(`Skill "${name}" not found`)
    }
    await fs.rm(skill.location, { recursive: true })
  }
}
```

**New code**:
```typescript
export namespace Skill {
  export const BUILTIN_LOCATION = "__builtin__" as const
  
  // ... existing code ...
  
  export async function remove(name: string): Promise<void> {
    const skill = await get(name)
    if (!skill) {
      throw new Error(`Skill "${name}" not found`)
    }
    if (skill.location === BUILTIN_LOCATION) {
      throw new Error(`Cannot remove built-in skill "${name}"`)
    }
    await fs.rm(skill.location, { recursive: true })
  }
}
```

### 7. Add First-Class PowerShell Support for Windows
**File**: `src/tool/bash.ts`
**Priority**: high
**Type**: feature
**Reason**: Provides native PowerShell support on Windows for better compatibility and user experience.

**Current code**:
```typescript
export namespace BashTool {
  export function getDefaultShell(): string {
    if (process.platform === "win32") {
      return "cmd.exe"
    }
    return process.env.SHELL || "/bin/bash"
  }
}
```

**New code**:
```typescript
import { Shell } from "@/shell/shell"

export namespace BashTool {
  export function getDefaultShell(): string {
    if (process.platform === "win32") {
      // Prefer PowerShell on Windows for better scripting support
      const pwsh = Shell.findPowerShell()
      if (pwsh) return pwsh
      return "cmd.exe"
    }
    return process.env.SHELL || "/bin/bash"
  }
  
  export function getShellArgs(shell: string): string[] {
    const basename = path.basename(shell).toLowerCase()
    if (basename === "pwsh.exe" || basename === "powershell.exe" || basename === "pwsh") {
      return ["-NoProfile", "-NonInteractive", "-Command"]
    }
    if (basename === "cmd.exe") {
      return ["/c"]
    }
    return ["-c"]
  }
}
```

### 8. Add PowerShell Detection Utility
**File**: `src/shell/shell.ts`
**Priority**: medium
**Type**: feature
**Reason**: Supports the PowerShell integration by detecting available PowerShell installations.

**New code**:
```typescript
import { existsSync } from "fs"
import path from "path"

export namespace Shell {
  /**
   * Find PowerShell executable on Windows.
   * Prefers pwsh (PowerShell Core) over powershell.exe (Windows PowerShell).
   */
  export function findPowerShell(): string | undefined {
    if (process.platform !== "win32") return undefined
    
    // Check for PowerShell Core (pwsh) first
    const pwshPaths = [
      "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
      "C:\\Program Files\\PowerShell\\pwsh.exe",
    ]
    
    for (const p of pwshPaths) {
      if (existsSync(p)) return p
    }
{"prompt_tokens":24502,"completion_tokens":4096,"total_tokens":28598}

[Session: 9d6bc9a5-4b78-4fa2-a4ef-3730674d7ab9]
[Messages: 2, Tokens: 28598]
