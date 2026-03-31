# Update Plan for Alexi

Generated: 2026-03-31
Based on upstream commits: kilocode 5da71b06..121f6e3c (185 commits)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 4 | Medium: 4 | Low: 2

## Changes

### 1. Add Config Path Protection for Permission System
**File**: `src/permission/config-paths.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Prevents AI agents from silently modifying configuration files (.kilo/, .kilocode/, .opencode/, kilo.json, etc.). This is a critical security feature that forces explicit user approval for config file edits and disables "Always allow" option for such operations.

**New code**:
```typescript
import path from "path"

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

  /** Return true if remainder path is in an excluded subdir. */
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
      const nested = "/" + dir
      const idx = normalized.indexOf(nested)
      if (idx !== -1) {
        const remainder = normalized.slice(idx + nested.length)
        if (!excluded(remainder)) return true
      }
    }
    // Check root-level config files
    if (!normalized.includes("/") && CONFIG_ROOT_FILES.has(normalized)) {
      return true
    }
    return false
  }

  /** Check if an absolute path points to a config file. */
  export function isAbsolute(absolutePath: string, projectRoot: string): boolean {
    const normalized = normalize(absolutePath)
    const normalizedRoot = normalize(projectRoot)
    
    // Check if path is within project
    if (normalized.startsWith(normalizedRoot)) {
      const relative = normalized.slice(normalizedRoot.length).replace(/^\//, "")
      return isRelative(relative)
    }
    
    // Check global config directory
    const globalConfigDir = normalize(getGlobalConfigDir())
    if (normalized.startsWith(globalConfigDir)) {
      return true
    }
    
    return false
  }

  /** Check if a permission request involves config files. */
  export function isRequest(info: { patterns: string[]; permission: string }): boolean {
    // Only protect write operations
    const writeOps = ["write", "edit", "delete", "move", "patch", "apply_patch"]
    if (!writeOps.some(op => info.permission.toLowerCase().includes(op))) {
      return false
    }
    return info.patterns.some(p => isRelative(p) || isAbsolute(p, process.cwd()))
  }

  function getGlobalConfigDir(): string {
    const home = process.env.HOME || process.env.USERPROFILE || ""
    return path.join(home, ".alexi")
  }
}
```

### 2. Integrate Config Protection into Permission Drain Logic
**File**: `src/permission/drain.ts`
**Priority**: critical
**Type**: security
**Reason**: Prevents auto-resolution of config file edit permissions. Users must always explicitly approve changes to configuration files.

**Current code** (if exists, otherwise add to permission resolution logic):
```typescript
export async function drainCovered(
  pending: Record<string, PendingEntry>,
  exclude: string,
  evaluate: EvaluateFunction,
  approved: ApprovedRules
) {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) continue
    const actions = entry.info.patterns.map((pattern) =>
      evaluate(entry.info.permission, pattern, entry.ruleset, approved),
    )
    // ... rest of logic
  }
}
```

**New code**:
```typescript
import { ConfigProtection } from "./config-paths"

export async function drainCovered(
  pending: Record<string, PendingEntry>,
  exclude: string,
  evaluate: EvaluateFunction,
  approved: ApprovedRules
) {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) continue
    // Never auto-resolve config file edit permissions
    if (ConfigProtection.isRequest(entry.info)) continue
    const actions = entry.info.patterns.map((pattern) =>
      evaluate(entry.info.permission, pattern, entry.ruleset, approved),
    )
    // ... rest of logic
  }
}
```

### 3. Add Deprecated Field Support to Agent Schema
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Supports deprecation of agents (like orchestrator) with visual indicators in UI. Allows graceful sunset of agent types.

**Current code**:
```typescript
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  mode: z.enum(["subagent", "primary", "all"]),
  native: z.boolean().optional(),
  hidden: z.boolean().optional(),
  topP: z.number().optional(),
  temperature: z.number().optional(),
  color: z.string().optional(),
  // ... other fields
})
```

**New code**:
```typescript
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  mode: z.enum(["subagent", "primary", "all"]),
  native: z.boolean().optional(),
  hidden: z.boolean().optional(),
  deprecated: z.boolean().optional(),
  topP: z.number().optional(),
  temperature: z.number().optional(),
  color: z.string().optional(),
  // ... other fields
})

export type Agent = z.infer<typeof AgentSchema>

/** Check if an agent is deprecated and should show warning UI */
export function isDeprecated(agent: Agent): boolean {
  return agent.deprecated === true
}

/** Merge agent configs, preserving deprecated field */
export function mergeAgentConfig(base: Agent, override: Partial<Agent>): Agent {
  return {
    ...base,
    ...override,
    // Ensure deprecated propagates correctly
    deprecated: override.deprecated ?? base.deprecated,
  }
}
```

### 4. Add Read-Only Bash Command Allowlist for Ask Agent
**File**: `src/agent/permissions/read-only-bash.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: The Ask agent now supports read-only bash commands for information gathering while maintaining its read-only nature. Unknown commands are DENIED (not "ask") to prevent any filesystem modifications.

**New code**:
```typescript
/**
 * Read-only bash commands for the Ask agent.
 * Unlike the default bash allowlist, unknown commands are DENIED (not "ask")
 * because the Ask agent must never modify the filesystem.
 */
export const readOnlyBashPermissions: Record<string, "allow" | "ask" | "deny"> = {
  "*": "deny", // Default: deny unknown commands
  
  // Read-only / informational
  "cat *": "allow",
  "head *": "allow",
  "tail *": "allow",
  "less *": "allow",
  "ls *": "allow",
  "tree *": "allow",
  "pwd *": "allow",
  "echo *": "allow",
  "wc *": "allow",
  "which *": "allow",
  "type *": "allow",
  "file *": "allow",
  "diff *": "allow",
  "du *": "allow",
  "df *": "allow",
  "date *": "allow",
  "uname *": "allow",
  "whoami *": "allow",
  "printenv *": "allow",
  "man *": "allow",
  
  // Text processing (stdout only, no file modification)
  "grep *": "allow",
  "rg *": "allow",
  "ag *": "allow",
  "sort *": "allow",
  "uniq *": "allow",
  "cut *": "allow",
  "awk *": "allow",
  "sed *": "allow", // Note: sed -i would need explicit denial
  "tr *": "allow",
  "jq *": "allow",
  "yq *": "allow",
  
  // Git read-only commands
  "git status *": "allow",
  "git log *": "allow",
  "git diff *": "allow",
  "git show *": "allow",
  "git branch --list *": "allow",
  "git branch -l *": "deny", // Ambiguous, use --list
  "git tag --list *": "allow",
  "git tag -l *": "deny", // Ambiguous, use --list
  "git remote -v *": "allow",
  "git remote show *": "allow",
  "git blame *": "allow",
  "git shortlog *": "allow",
  "git rev-parse *": "allow",
  "git ls-files *": "allow",
  "git ls-tree *": "allow",
  
  // Explicitly deny git write operations
  "git add *": "deny",
  "git commit *": "deny",
  "git push *": "deny",
  "git pull *": "deny",
  "git merge *": "deny",
  "git rebase *": "deny",
  "git reset *": "deny",
  "git checkout *": "deny",
  "git switch *": "deny",
  "git restore *": "deny",
  "git stash *": "deny",
  "git cherry-pick *": "deny",
  
  // Archive reading (no extraction that modifies filesystem)
  "tar -tf *": "allow",
  "tar --list *": "allow",
  "unzip -l *": "allow",
  "zipinfo *": "allow",
  
  // Explicitly deny find (can be used for modification via -exec)
  "find *": "deny",
}

/** Get permission for a bash command in Ask agent context */
export function getAskBashPermission(command: string): "allow" | "ask" | "deny" {
  // Check exact matches first
  for (const [pattern, permission] of Object.entries(readOnlyBashPermissions)) {
    if (pattern === "*") continue
    if (matchesPattern(command, pattern)) {
      return permission
    }
  }
  // Default to deny for unknown commands
  return readOnlyBashPermissions["*"]
}

function matchesPattern(command: string, pattern: string): boolean {
  if (pattern.endsWith(" *")) {
    const prefix = pattern.slice(0, -2)
    return command.startsWith(prefix)
  }
  return command === pattern
}
```

### 5. Update Ask Agent Prompt with MCP and Bash Support
**File**: `src/agent/prompts/ask.txt`
**Priority**: high
**Type**: feature
**Reason**: Ask agent now supports read-only bash commands and MCP tools for better information gathering while maintaining read-only guarantees.

**Current code**:
```text
Guidelines:
- Answer questions thoroughly with clear explanations and relevant examples
- Analyze code, explain concepts, and provide recommendations without making changes
- Use Mermaid diagrams when they help clarify your response
- Do not edit files or execute commands; this agent is read-only
- If a question requires implementation, suggest switching to a different agent
```

**New code**:
```text
Guidelines:
- Answer questions thoroughly with clear explanations and relevant examples
- Analyze code, explain concepts, and provide recommendations without making changes
- Use Mermaid diagrams when they help clarify your response
- You may run read-only bash commands (ls, cat, grep, git log, git diff, etc.) to gather information
- You must NOT modify files, run write commands, or execute code — you are read-only
- MCP tools are available if configured — each call requires user approval
- If a question requires implementation, suggest switching to a different agent
```

### 6. Add Built-in Config Skill for On-Demand Reference
**File**: `src/tool/skills/builtin.ts`
**Priority**: high
**Type**: feature
**Reason**: Provides agents with on-demand access to configuration documentation, helping them understand available settings and options.

**New code**:
```typescript
import { Skill } from "../skill"
import kiloConfigContent from "./kilo-config.md"

export namespace BuiltinSkills {
  /** IDs of built-in skills that cannot be removed */
  export const BUILTIN_IDS = new Set(["alexi-config", "kilo-config"])

  /** Check if a skill ID is a built-in skill */
  export function isBuiltin(skillId: string): boolean {
    return BUILTIN_IDS.has(skillId)
  }

  /** Get all built-in skill definitions */
  export function getBuiltinSkills(): Skill.Definition[] {
    return [
      {
        id: "alexi-config",
        name: "Alexi Configuration Reference",
        description: "Reference documentation for Alexi configuration options",
        content: kiloConfigContent,
        builtin: true,
      },
    ]
  }

  /** Reject removal of built-in skills */
  export function guardRemoval(skillId: string): void {
    if (isBuiltin(skillId)) {
      throw new Error(`Cannot remove built-in skill: ${skillId}`)
    }
  }
}
```

### 7. Update Skill System to Support Built-in Skills
**File**: `src/tool/skill.ts`
**Priority**: medium
**Type**: feature
**Reason**: Extends skill system to support built-in skills that cannot be removed and are always available.

**Current code**:
```typescript
export namespace Skill {
  export interface Definition {
    id: string
    name: string
    description: string
    content: string
  }

  export function remove(skillId: string): void {
    // Remove skill logic
  }
}
```

**New code**:
```typescript
import { BuiltinSkills } from "./skills/builtin"

export namespace Skill {
  export interface Definition {
    id: string
    name: string
    description: string
    content: string
    builtin?: boolean
  }

  export function remove(skillId: string): void {
    // Guard against removing built-in skills
    BuiltinSkills.guardRemoval(skillId)
    
    // Remove skill logic
    // ... existing implementation
  }

  export function getAll(): Definition[] {
    const builtins
{"prompt_tokens":18683,"completion_tokens":4096,"total_tokens":22779}

[Session: fc077567-f57b-4e9c-801d-e36ff87128fe]
[Messages: 2, Tokens: 22779]
