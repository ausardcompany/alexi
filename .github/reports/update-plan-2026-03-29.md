# Update Plan for Alexi

Generated: 2026-03-29
Based on upstream commits: kilocode 43811bfa..121f6e3c (69 commits), opencode a5b1dc0..7715252 (62 commits)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 6 | Medium: 7 | Low: 3

## Changes

### 1. Add Config Path Protection System
**File**: `src/permission/config-paths.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Prevents unauthorized modification of configuration files (.kilo/, .kilocode/, .opencode/, AGENTS.md). This is a security-critical feature that ensures AI agents cannot silently modify their own configuration.

**New code**:
```typescript
import path from "path"
import { Global } from "@/global"
import { AlexiPaths } from "@/paths"

export namespace ConfigProtection {
  /**
   * Config directory prefixes (relative paths, forward-slash normalized).
   * Matches .kilo/, .kilocode/, .opencode/, .alexi/ at any depth within the project.
   */
  const CONFIG_DIRS = [".kilo/", ".kilocode/", ".opencode/", ".alexi/"]

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
    "kilo.json",
    "kilo.jsonc",
    "opencode.json",
    "opencode.jsonc",
    "alexi.json",
    "alexi.jsonc",
    "AGENTS.md"
  ])

  /** Metadata key used to signal the UI to hide the "Allow always" option. */
  export const DISABLE_ALWAYS_KEY = "disableAlways" as const

  function normalize(p: string): string {
    return path.posix.normalize(p.replaceAll("\\", "/"))
  }

  /** Return true if remainder path is in an excluded subdirectory */
  function excluded(remainder: string): boolean {
    return EXCLUDED_SUBDIRS.some((sub) => remainder.startsWith(sub))
  }

  /** Check if a project-relative path points to a config file or directory. */
  export function isRelative(pattern: string): boolean {
    const normalized = normalize(pattern)
    for (const dir of CONFIG_DIRS) {
      const bare = dir.slice(0, -1) // e.g. ".kilo"
      // Match at root (e.g. ".kilo/foo") or nested (e.g. "packages/sub/.kilo/foo")
      if (normalized === bare || normalized.endsWith("/" + bare)) return true
      if (normalized.startsWith(dir)) {
        if (excluded(normalized.slice(dir.length))) continue
        return true
      }
      // Check for nested config dirs
      const nestedIndex = normalized.indexOf("/" + dir)
      if (nestedIndex !== -1) {
        const remainder = normalized.slice(nestedIndex + 1 + dir.length)
        if (!excluded(remainder)) return true
      }
    }
    // Check root-level config files
    if (!normalized.includes("/") && CONFIG_ROOT_FILES.has(normalized)) {
      return true
    }
    return false
  }

  /** Check if an absolute path points to the global config directory. */
  export function isGlobalConfig(absolutePath: string): boolean {
    const globalDir = AlexiPaths.globalConfigDir()
    const normalized = normalize(absolutePath)
    const normalizedGlobal = normalize(globalDir)
    return normalized.startsWith(normalizedGlobal + "/") || normalized === normalizedGlobal
  }

  /** Check if a permission request involves config files. */
  export function isRequest(request: { patterns?: string[]; permission?: string }): boolean {
    if (!request.patterns) return false
    // Only protect write operations
    const writePermissions = ["write", "edit", "patch", "delete", "move", "rename"]
    const isWriteOp = request.permission 
      ? writePermissions.some(wp => request.permission!.includes(wp))
      : true
    if (!isWriteOp) return false
    
    return request.patterns.some((p) => isRelative(p) || isGlobalConfig(p))
  }
}
```

### 2. Integrate Config Protection into Permission System
**File**: `src/permission/next.ts`
**Priority**: critical
**Type**: security
**Reason**: Enforces permission prompts for config file edits and prevents "Always allow" from being persisted for config paths.

**Current code**:
```typescript
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
// ... existing imports
```

**New code**:
```typescript
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
import { ConfigProtection } from "@/permission/config-paths"
// ... existing imports

export namespace PermissionNext {
  // ... existing code ...

  export const request = fn(
    "permission.request",
    async (input) => {
      const s = await state()
      const { ruleset, ...request } = input
      
      // Force "ask" for config file edits - security protection
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
            Bus.publish("permission.requested", { info })
          })
        }
      }
    }
  )

  export const respond = fn(
    "permission.respond",
    async (input) => {
      const s = await state()
      const existing = s.pending[input.requestID]
      if (!existing) throw new NotFoundError({ message: `Permission request ${input.requestID} not found` })

      // Skip rule persistence for config file edits
      if (ConfigProtection.isRequest(existing.info)) {
        // Allow this specific request but don't save the rule
        delete s.pending[input.requestID]
        existing.resolve()
        return
      }

      // ... rest of existing respond logic ...
    }
  )
}
```

### 3. Update Permission Drain to Skip Config Files
**File**: `src/permission/drain.ts`
**Priority**: high
**Type**: security
**Reason**: Ensures config file edit permissions are never auto-resolved, maintaining security even when other permissions are auto-approved.

**Current code**:
```typescript
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
import type { PermissionNext } from "@/permission/next"

export async function drainCovered(
  pending: Record<string, { info: PermissionNext.Request; ruleset: any }>,
  approved: any[],
  exclude?: string
) {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) continue
    // ... existing logic
  }
}
```

**New code**:
```typescript
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
import type { PermissionNext } from "@/permission/next"
import { ConfigProtection } from "@/permission/config-paths"

export async function drainCovered(
  pending: Record<string, { info: PermissionNext.Request; ruleset: any }>,
  approved: any[],
  exclude?: string
) {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) continue
    // Never auto-resolve config file edit permissions
    if (ConfigProtection.isRequest(entry.info)) continue
    const actions = entry.info.patterns.map((pattern) =>
      evaluate(entry.info.permission, pattern, entry.ruleset, approved),
    )
    // ... rest of existing logic
  }
}
```

### 4. Add Built-in Skills Support with Protection
**File**: `src/tool/skill.ts`
**Priority**: high
**Type**: feature
**Reason**: Adds support for built-in skills (like kilo-config) that don't have filesystem locations, and prevents removal of built-in skills.

**Current code**:
```typescript
import { Tool } from "./tool"
import { Skill } from "../skill/skill"
import { pathToFileURL } from "url"
// ... existing code
```

**New code**:
```typescript
import { Tool } from "./tool"
import { Skill } from "../skill/skill"
import { pathToFileURL } from "url"

const BUILTIN = Skill.BUILTIN_LOCATION

export const SkillTool = Tool.define("skill", async (ctx) => {
  const skills = await Skill.all()

  return {
    name: "skill",
    description: "Load and invoke skills for specialized tasks",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the skill to invoke" },
        action: { 
          type: "string", 
          enum: ["load", "remove"],
          description: "Action to perform" 
        }
      },
      required: ["name", "action"]
    },
    
    async execute(params: { name: string; action: string }) {
      const skill = skills.find(s => s.name === params.name)
      
      if (!skill) {
        return { error: `Skill '${params.name}' not found` }
      }

      if (params.action === "remove") {
        // Reject removal of built-in skills
        if (skill.location === BUILTIN) {
          return { 
            error: `Cannot remove built-in skill '${params.name}'`,
            title: `Skill removal rejected: ${params.name}`
          }
        }
        // ... existing removal logic
      }

      if (params.action === "load") {
        // Built-in skills have no filesystem directory
        if (skill.location === BUILTIN) {
          return {
            title: `Loaded skill: ${skill.name}`,
            output: [
              `<skill_content name="${skill.name}">`,
              `# Skill: ${skill.name}`,
              skill.content,
              `</skill_content>`
            ].join("\n")
          }
        }
        // ... existing load logic for filesystem skills
      }
    },

    systemPrompt() {
      const accessibleSkills = skills.filter(s => s.accessible)
      return [
        "Invoke this tool to load a skill when a task matches one of the available skills listed below:",
        "",
        "<available_skills>",
        ...accessibleSkills.flatMap((skill) => {
          // Guard pathToFileURL for builtin skills
          const loc = skill.location === BUILTIN 
            ? BUILTIN 
            : pathToFileURL(skill.location).href
          return [
            `  <skill>`,
            `    <name>${skill.name}</name>`,
            `    <description>${skill.description}</description>`,
            `    <location>${loc}</location>`,
            `  </skill>`,
          ]
        }),
        "</available_skills>",
      ].join("\n")
    }
  }
})
```

### 5. Add Built-in Alexi Config Skill
**File**: `src/skills/builtin.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Provides on-demand configuration reference for the AI agent, improving its ability to help users configure Alexi.

**New code**:
```typescript
import { Skill } from "../skill/skill"
import alexiConfigContent from "./alexi-config.md"

export namespace BuiltinSkills {
  export const ALEXI_CONFIG: Skill.Definition = {
    name: "alexi-config",
    description: "Reference documentation for Alexi configuration options, settings, and customization",
    location: Skill.BUILTIN_LOCATION,
    content: alexiConfigContent,
    accessible: true
  }

  export function all(): Skill.Definition[] {
    return [ALEXI_CONFIG]
  }

  export function register() {
    for (const skill of all()) {
      Skill.registerBuiltin(skill)
    }
  }
}
```

### 6. Create Alexi Config Skill Content
**File**: `src/skills/alexi-config.md` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Provides comprehensive configuration documentation for the AI agent.

**New code**:
```markdown
# Alexi Configuration Reference

This skill provides reference documentation for configuring Alexi.

## Configuration Files

### Project Configuration
- `alexi.json` or `alexi.jsonc` - Project-specific settings
- `.alexi/` directory - Project configuration folder
- `AGENTS.md` - Agent behavior customization

### Global Configuration
- Located in platform-specific config directory
- Contains user preferences and API keys

## Key Settings

### Provider Configuration
Configure AI providers including SAP AI Core:

```json
{
  "providers": {
    "sap-ai-core": {
      "enabled": true,
      "endpoint": "https://api.ai.sap.com",
      "resourceGroup": "default"
    }
  }
}
```

### Permission Settings
Control what actions require approval:

```json
{
  "permissions": {
    "autoApprove": ["read"],
    "alwaysAsk": ["write", "execute"]
  }
}
```

### Agent Modes
Available agent modes:
- `code` - Implementation and coding tasks
- `plan` - Architecture and planning
- `debug` - Troubleshooting and debugging
- `ask` - Questions and explanations (read-only)

## TUI Settings Reference
For terminal UI configuration options, see the TUI settings panel.
```

### 7. Update Tool Registry with Effect.forEach Pattern
**File**: `src/tool/registry.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Adopts the Effect.forEach pattern from opencode for better async handling and error propagation in tool registration.

**Current code**:
```typescript
export namespace ToolRegistry {
  const tools: Map<string, Tool> = new Map()

  export async function registerAll(toolList: Tool[]) {
    for (const tool of toolList) {
      tools.set(tool.name, tool)
    }
  }
}
```

**New code**:
```typescript
import { Effect, pipe } from "effect"
import { Config } from "@/config/config"
import { Plugin } from "@/plugin"

export namespace ToolRegistry {
  const tools: Map<string, Tool> = new Map()

  export const registerAll = Effect.gen(function* () {
    const config = yield* Config
    const plugin = yield* Plugin

    const builtinTools = getBuiltinTools()
    const pluginTools = yield* plugin.getTools()
    
    const allTools = [...builtinTools, ...pluginTools]
    
    yield* Effect.forEach(
      allTools,
      (tool) => Effect.sync(() => {
        tools.set(tool.name, tool)
      }),
      { concurrency: "unbounded" }
    )

    return tools
  })

  export function get(name:
{"prompt_tokens":21980,"completion_tokens":4096,"total_tokens":26076}

[Session: 753716d1-2e1d-444a-8914-8a4b50195976]
[Messages: 2, Tokens: 26076]
