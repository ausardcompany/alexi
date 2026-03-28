# Update Plan for Alexi

Generated: 2026-03-28
Based on upstream commits: kilocode 121f6e3c..43811bfa (69 commits), opencode 7715252..1f290fc (47 commits)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 6 | Medium: 7 | Low: 3

## Changes

### 1. Add Config Path Protection System
**File**: `src/permission/config-paths.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Prevents unauthorized modifications to configuration files. This security feature ensures that tools cannot silently modify config files without explicit user approval, closing potential security bypass vectors.

**New code**:
```typescript
import path from "path"
import { Global } from "@/global"
import { Paths } from "@/paths"

export namespace ConfigProtection {
  /**
   * Config directory prefixes (relative paths, forward-slash normalized).
   * Matches .alexi/, .kilo/, .kilocode/, .opencode/ at any depth within the project.
   */
  const CONFIG_DIRS = [".alexi/", ".kilo/", ".kilocode/", ".opencode/"]

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
      if (idx !== -1) {
        const remainder = normalized.slice(idx + nested.length)
        if (!excluded(remainder)) return true
      }
    }
    // Root-level config files
    if (!normalized.includes("/") && CONFIG_ROOT_FILES.has(normalized)) return true
    return false
  }

  /** Check if an absolute path points to a config file. */
  export function isAbsolute(absolutePath: string, cwd: string): boolean {
    const normalized = normalize(absolutePath)
    const normalizedCwd = normalize(cwd)
    
    // Check if within project directory
    if (normalized.startsWith(normalizedCwd + "/")) {
      const relative = normalized.slice(normalizedCwd.length + 1)
      return isRelative(relative)
    }
    
    // Check global config directory
    const globalConfigDir = normalize(Paths.config)
    if (normalized.startsWith(globalConfigDir + "/") || normalized === globalConfigDir) {
      return true
    }
    
    return false
  }

  /** Check if a permission request involves config file modification. */
  export function isRequest(request: { permission: string; patterns?: string[] }): boolean {
    if (!request.patterns) return false
    const writePermissions = ["write", "edit", "patch", "move", "delete"]
    if (!writePermissions.some(p => request.permission.includes(p))) return false
    return request.patterns.some(pattern => isRelative(pattern) || isAbsolute(pattern, Global.cwd))
  }
}
```

### 2. Integrate Config Protection into Permission Drain
**File**: `src/permission/drain.ts`
**Priority**: critical
**Type**: security
**Reason**: Ensures that config file edit permissions are never auto-resolved, requiring explicit user approval each time.

**Current code**:
```typescript
export async function drainCovered(
  pending: Record<string, PendingEntry>,
  approved: ApprovedRule[],
  exclude?: string
) {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) continue
    const actions = entry.info.patterns.map((pattern) =>
      evaluate(entry.info.permission, pattern, entry.ruleset, approved),
    )
```

**New code**:
```typescript
import { ConfigProtection } from "@/permission/config-paths"

export async function drainCovered(
  pending: Record<string, PendingEntry>,
  approved: ApprovedRule[],
  exclude?: string
) {
  for (const [id, entry] of Object.entries(pending)) {
    if (id === exclude) continue
    // Never auto-resolve config file edit permissions
    if (ConfigProtection.isRequest(entry.info)) continue
    const actions = entry.info.patterns.map((pattern) =>
      evaluate(entry.info.permission, pattern, entry.ruleset, approved),
    )
```

### 3. Add Config Protection to Permission Request Flow
**File**: `src/permission/next.ts`
**Priority**: high
**Type**: security
**Reason**: Forces permission prompts for config file edits and prevents "Allow always" option from being saved for these operations.

**Current code**:
```typescript
async (input) => {
  const s = await state()
  const { ruleset, ...request } = input
  for (const pattern of request.patterns ?? []) {
    const rule = evaluate(request.permission, pattern, ruleset, s.approved)
    log.info("evaluated", { permission: request.permission, pattern, action: rule })
    if (rule.action === "deny")
      throw new DeniedError(ruleset.filter((r) => Wildcard.match(request.permission, r.permission)))
    if (rule.action === "ask") {
      const id = input.id ?? Identifier.ascending("permission")
      return new Promise<void>((resolve, reject) => {
        const info: Request = {
          id,
          ...request,
        }
```

**New code**:
```typescript
import { ConfigProtection } from "@/permission/config-paths"

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
```

### 4. Update Permission Response to Skip Rule Persistence for Config Files
**File**: `src/permission/next.ts`
**Priority**: high
**Type**: security
**Reason**: Prevents "Allow always" rules from being persisted for config file operations.

**Current code** (in the respond handler):
```typescript
const existing = s.pending[input.requestID]
if (!existing) throw new NotFoundError({ message: `Permission request ${input.requestID} not found` })

// Combine metadata.rules (bash hierarchy) and always (all tools).
```

**New code**:
```typescript
const existing = s.pending[input.requestID]
if (!existing) throw new NotFoundError({ message: `Permission request ${input.requestID} not found` })

// Skip rule persistence for config file edits
if (ConfigProtection.isRequest(existing.info)) return

// Combine metadata.rules (bash hierarchy) and always (all tools).
```

### 5. Update Skill Tool to Handle Builtin Skills
**File**: `src/tool/skill.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Fixes pathToFileURL crash when skill location is a builtin marker rather than a filesystem path.

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
import { Skill } from "@/skill/skill"

const BUILTIN = Skill.BUILTIN_LOCATION

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
```

### 6. Add Builtin Skill Content Handler
**File**: `src/tool/skill.ts`
**Priority**: high
**Type**: feature
**Reason**: Allows builtin skills (like kilo-config) to be loaded without filesystem access.

**Current code** (after permission request):
```typescript
return {
  title: `Loaded skill: ${skill.name}`,
  output: [
    `<skill_content name="${skill.name}">`,
```

**New code**:
```typescript
// Built-in skills have no filesystem directory
if (skill.location === BUILTIN) {
  return {
    title: `Loaded skill: ${skill.name}`,
    output: [
      `<skill_content name="${skill.name}">`,
      `# Skill: ${skill.name}`,
      ``,
      skill.content ?? "",
      `</skill_content>`,
    ].join("\n"),
    metadata: {},
  }
}

return {
  title: `Loaded skill: ${skill.name}`,
  output: [
    `<skill_content name="${skill.name}">`,
```

### 7. Add Builtin Skills Support to Skill Service
**File**: `src/skill/skill.ts`
**Priority**: high
**Type**: feature
**Reason**: Enables built-in skills that don't require filesystem presence, like configuration reference skills.

**New code** (add to existing file):
```typescript
export namespace Skill {
  export const BUILTIN_LOCATION = "__builtin__" as const

  /** Built-in skills that are always available */
  const BUILTIN_SKILLS: SkillDefinition[] = [
    {
      name: "alexi-config",
      description: "Reference for Alexi configuration options and TUI settings",
      location: BUILTIN_LOCATION,
      content: getConfigSkillContent(), // Import from separate file
    },
  ]

  export async function all(): Promise<SkillDefinition[]> {
    const fileSkills = await loadFileSkills()
    return [...BUILTIN_SKILLS, ...fileSkills]
  }

  export function isBuiltin(skill: SkillDefinition): boolean {
    return skill.location === BUILTIN_LOCATION
  }

  /** Prevent removal of built-in skills */
  export function canRemove(skill: SkillDefinition): boolean {
    return !isBuiltin(skill)
  }
}
```

### 8. Guard Builtin Skill Removal
**File**: `src/skill/skill.ts`
**Priority**: medium
**Type**: security
**Reason**: Prevents users or agents from removing built-in skills.

**New code** (add to remove function):
```typescript
export async function remove(skillName: string): Promise<void> {
  const skill = await find(skillName)
  if (!skill) {
    throw new NotFoundError({ message: `Skill '${skillName}' not found` })
  }
  
  // Reject removal of built-in skills
  if (isBuiltin(skill)) {
    throw new PermissionError({ message: `Cannot remove built-in skill '${skillName}'` })
  }
  
  // Continue with filesystem removal...
}
```

### 9. Update AI SDK Tool Factories for v6 Compatibility
**File**: `src/providers/copilot/tools/code-interpreter.ts`
**Priority**: high
**Type**: feature
**Reason**: AI SDK v6 renamed createProviderDefinedToolFactoryWithOutputSchema to createProviderToolFactoryWithOutputSchema.

**Current code**:
```typescript
import { createProviderDefinedToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

export const codeInterpreterToolFactory = createProviderDefinedToolFactoryWithOutputSchema<
  // ...
>({
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
  // ...
>({
  id: "openai.code_interpreter",
  inputSchema: codeInterpreterInputSchema,
  outputSchema: codeInterpreterOutputSchema,
})
```

### 10. Update File Search Tool for AI SDK v6
**File**: `src/providers/copilot/tools/file-search.ts`
**Priority**: medium
**Type**: feature
**Reason**: AI SDK v6 compatibility - remove deprecated name property.

**Current code**:
```typescript
export const fileSearch = createProviderDefinedToolFactoryWithOutputSchema<
  // ...
>({
  id: "openai.file_search",
  name: "file_search",
  inputSchema: z.object({}),
  outputSchema: fileSearchOutputSchema,
})
```

**New code**:
```typescript
export const fileSearch = createProviderToolFactoryWithOutputSchema<
  // ...
>({
  id: "openai.file_search",
  inputSchema: z.object({}),
  outputSchema: fileSearchOutputSchema,
})
```

### 11. Update Image Generation Tool for AI SDK v6
**File**: `src/providers/copilot/tools/image-generation.ts`
**Priority**: medium
**Type**: feature
**Reason**: AI SDK v6 compatibility - remove deprecated name property.

**Current code**:
```typescript
const imageGenerationToolFactory = createProviderDefinedToolFactoryWithOutputSchema<
  // ...
>({
  id: "openai.image_generation",
  name: "image_generation",
  inputSchema: z.object({}),
  outputSchema: imageGenerationOutputSchema,
})
```

**New code**:
```typescript
const imageGenerationToolFactory = createProviderToolFactoryWithOutputSchema<
  // ...
>({
  id: "openai.image_generation",
  inputSchema: z.object({}),
{"prompt_tokens":20435,"completion_tokens":4096,"total_tokens":24531}

[Session: 31cc8aac-175e-4eb3-9ad4-0863f333bdb4]
[Messages: 2, Tokens: 24531]
