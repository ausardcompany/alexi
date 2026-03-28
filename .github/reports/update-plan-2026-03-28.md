# Update Plan for Alexi

Generated: 2026-03-28
Based on upstream commits: kilocode (121f6e3c..eeebbd26), opencode (7715252..6c14ea1)

## Summary
- Total changes planned: 14
- Critical: 2 | High: 5 | Medium: 5 | Low: 2

## Changes

### 1. Add Config Path Protection for Permission System
**File**: `src/permission/config-paths.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Prevents unauthorized modifications to config files (.kilo/, .kilocode/, .opencode/, kilo.json, etc.) by forcing permission prompts and blocking "always allow" for sensitive paths. This closes a security bypass where agents could modify configuration without explicit approval.

**New code**:
```typescript
import path from "path"

export namespace ConfigProtection {
  /**
   * Config directory prefixes (relative paths, forward-slash normalized).
   * Matches .kilo/, .kilocode/, .opencode/ at any depth within the project.
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

  /** Return true if remainder path is in excluded subdirectory. */
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
    const basename = path.basename(normalized)
    const dirname = path.dirname(normalized)
    if ((dirname === "." || dirname === "") && CONFIG_ROOT_FILES.has(basename)) {
      return true
    }

    return false
  }

  /** Check if an absolute path points to a config file. */
  export function isAbsolute(absolutePath: string, projectRoot: string): boolean {
    const normalized = normalize(absolutePath)
    const normalizedRoot = normalize(projectRoot)
    
    if (!normalized.startsWith(normalizedRoot)) {
      return false
    }
    
    const relative = normalized.slice(normalizedRoot.length).replace(/^\//, "")
    return isRelative(relative)
  }

  /** Check if a permission request involves config files. */
  export function isRequest(request: { patterns?: string[]; permission?: string }): boolean {
    if (!request.patterns) return false
    
    // Only protect write operations
    const writePermissions = ["write", "edit", "patch", "apply_patch", "delete"]
    if (request.permission && !writePermissions.some(p => request.permission!.includes(p))) {
      return false
    }
    
    return request.patterns.some(pattern => isRelative(pattern))
  }
}
```

### 2. Integrate Config Protection into Permission Drain Logic
**File**: `src/permission/drain.ts`
**Priority**: critical
**Type**: security
**Reason**: Ensures config file edit permissions are never auto-resolved, requiring explicit user approval every time.

**Current code** (if exists, add to drainCovered function):
```typescript
export async function drainCovered(
  pending: Record<string, PendingEntry>,
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
import { ConfigProtection } from "./config-paths"

export async function drainCovered(
  pending: Record<string, PendingEntry>,
  approved: ApprovedRules,
  exclude?: string
) {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) continue
    // Never auto-resolve config file edit permissions
    if (ConfigProtection.isRequest(entry.info)) continue
    
    const actions = entry.info.patterns.map((pattern) =>
      evaluate(entry.info.permission, pattern, entry.ruleset, approved)
    )
    // ... rest of existing logic
  }
}
```

### 3. Update Permission Next Module with Config Protection Override
**File**: `src/permission/next.ts`
**Priority**: high
**Type**: security
**Reason**: Forces "ask" mode for config file edits even when rules would allow automatic approval, and prevents rule persistence for config file permissions.

**Current code** (in request handler):
```typescript
async (input) => {
  const s = await state()
  const { ruleset, ...request } = input
  for (const pattern of request.patterns ?? []) {
    const rule = evaluate(request.permission, pattern, ruleset, s.approved)
    if (rule.action === "deny")
      throw new DeniedError(ruleset.filter((r) => Wildcard.match(request.permission, r.permission)))
    if (rule.action === "ask") {
      // ... prompt logic
    }
  }
}
```

**New code**:
```typescript
import { ConfigProtection } from "./config-paths"

async (input) => {
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
}

// In the approve handler, add:
async (input) => {
  const s = await state()
  const existing = s.pending[input.requestID]
  if (!existing) throw new NotFoundError({ message: `Permission request ${input.requestID} not found` })

  // Skip rule persistence for config file edits
  if (ConfigProtection.isRequest(existing.info)) {
    existing.resolve()
    delete s.pending[input.requestID]
    return
  }
  
  // ... rest of existing approve logic
}
```

### 4. Update Skill Tool to Handle Built-in Skills
**File**: `src/tool/skill.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Built-in skills don't have filesystem paths, causing pathToFileURL to fail. This guards against that and properly handles built-in skill content loading.

**Current code**:
```typescript
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
import { Skill } from "../skill/skill"

const BUILTIN = Skill.BUILTIN_LOCATION

// In the skill listing:
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

// Add handling for built-in skill content loading:
if (skill.location === BUILTIN) {
  return {
    title: `Loaded skill: ${skill.name}`,
    output: [
      `<skill_content name="${skill.name}">`,
      `# Skill: ${skill.name}`,
      skill.content, // Built-in skills have content property
      `</skill_content>`,
    ].join("\n"),
  }
}

// Add guard for built-in skill removal:
export function rejectBuiltinRemoval(skillName: string, location: string): void {
  if (location === BUILTIN) {
    throw new Error(`Cannot remove built-in skill: ${skillName}`)
  }
}
```

### 5. Add Built-in Alexi Config Skill
**File**: `src/skill/builtin.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Provides on-demand configuration reference for the agent, helping it understand how to configure Alexi properly.

**New code**:
```typescript
import { Skill } from "./skill"
import alexiConfigContent from "./alexi-config.md"

export namespace BuiltinSkills {
  export const ALEXI_CONFIG: Skill.Info = {
    name: "alexi-config",
    description: "Reference documentation for Alexi configuration files and settings. Use when helping users configure Alexi or when you need to understand configuration options.",
    location: Skill.BUILTIN_LOCATION,
    content: alexiConfigContent,
    enabled: true,
  }

  export function all(): Skill.Info[] {
    return [ALEXI_CONFIG]
  }

  export function get(name: string): Skill.Info | undefined {
    return all().find(s => s.name === name)
  }
}
```

**File**: `src/skill/alexi-config.md` (new file)
```markdown
# Alexi Configuration Reference

## Configuration Files

Alexi looks for configuration in these locations (in order of precedence):
1. `.alexi/config.json` in the current project
2. `alexi.json` or `alexi.jsonc` in the project root
3. `~/.config/alexi/config.json` for global settings

## Configuration Options

### Model Selection
```json
{
  "model": {
    "default": "claude-sonnet-4-20250514",
    "small": "claude-haiku-3-20240307"
  }
}
```

### SAP AI Core Integration
```json
{
  "sap": {
    "aiCore": {
      "endpoint": "https://api.ai.sap.com",
      "resourceGroup": "default"
    }
  }
}
```

### Permission Settings
```json
{
  "permissions": {
    "autoApprove": ["read"],
    "alwaysAsk": ["write", "execute"]
  }
}
```

## TUI Settings

Settings for the terminal UI can be configured in `.alexi/tui.json`:
```json
{
  "theme": "dark",
  "keybindings": {
    "submit": "ctrl+enter",
    "cancel": "escape"
  }
}
```
```

### 6. Update Tool Registry with Effect.forEach Pattern
**File**: `src/tool/registry.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Aligns with opencode's effectified tool registry pattern for better composability and error handling.

**Current code**:
```typescript
export async function loadTools(config: Config, plugins: Plugin[]): Promise<Tool[]> {
  const tools: Tool[] = []
  
  for (const plugin of plugins) {
    const pluginTools = await plugin.getTools()
    tools.push(...pluginTools)
  }
  
  return tools
}
```

**New code**:
```typescript
import { Effect, Array as Arr } from "effect"

export const loadTools = (config: Config, plugins: Plugin[]) =>
  Effect.gen(function* () {
    const configService = yield* Config
    const pluginService = yield* Plugin
    
    const pluginTools = yield* Effect.forEach(
      plugins,
      (plugin) => pluginService.getTools(plugin),
      { concurrency: "unbounded" }
    )
    
    return Arr.flatten(pluginTools)
  })

// Provide backward-compatible async wrapper
export async function loadToolsAsync(config: Config, plugins: Plugin[]): Promise<Tool[]> {
  return Effect.runPromise(
    loadTools(config, plugins).pipe(
      Effect.provide(/* layer */)
    )
  )
}
```

### 7. Update AI SDK Tool Factories to v6 API
**File**: `src/tool/provider-tools.ts`
**Priority**: high
**Type**: feature
**Reason**: AI SDK v6 changed `createProviderDefinedToolFactoryWithOutputSchema` to `createProviderToolFactoryWithOutputSchema` and removed the `name` property requirement.

**Current code** (if using provider-defined tools):
```typescript
import { createProviderDefinedToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

export const codeInterpreterToolFactory = createProviderDefinedToolFactoryWithOutputSchema<...>({
  id: "openai.code_interpreter",
  name: "code_interpreter",
  inputSchema: codeInterpreterInputSchema,
  outputSchema: codeInterpreterOutputSchema,
})
```

**New code**:
```typescript
import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

export const codeInterpreterToolFactory = createProviderToolFactoryWithOutputSchema<
  {
    code: string | null
    results: Array<{
      type: "logs" | "files" | "images"
      logs?: string
      files?: Array<{ name: string; content: string }>
      images?: Array<{ url: string; alt?: string }>
    }>
  },
  CodeInterpreterArgs
>({
  id: "openai.code_interpreter",
  // name property removed in v6
  inputSchema: codeInterpreterInputSchema,
  outputSchema: codeInterpreterOutputSchema,
})

// Apply same pattern to all provider tools:
// - fileSearchToolFactory
// - imageGenerationToolFactory  
// - localShellToolFactory
// - webSearchToolFactory
// - webSearchPreviewToolFactory
{"prompt_tokens":19431,"completion_tokens":4096,"total_tokens":23527}

[Session: db1e70ae-b351-4508-a9d5-99036631cd88]
[Messages: 2, Tokens: 23527]
