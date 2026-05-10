# Update Plan for Alexi

Generated: 2026-05-10
Based on upstream commits: opencode 903d818..b2baddc (67 commits), kilocode 9d37a1aea (1 commit - version bump only)

## Summary
- Total changes planned: 12
- Critical: 1 | High: 3 | Medium: 5 | Low: 3

## Changes

### 1. Security Fix: Subagent Permission Inheritance for Plan Mode Bypass
**File**: `src/agent/subagent-permissions.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Subagents spawned via the task tool were not inheriting parent agent deny rules, allowing Plan Mode security restrictions to be bypassed. This is a security vulnerability fix from PR #26597.

**New code**:
```typescript
import type { Permission } from "../permission"
import type { Agent } from "./agent"

/**
 * Build the `permission` ruleset for a subagent's session when it's spawned
 * via the task tool. Combines:
 *
 * 1. The parent **agent's** deny rules — Plan Mode and other agent-level
 *    restrictions live on the agent ruleset, not on the session, so a
 *    subagent that only inherited the parent SESSION's permission would
 *    silently bypass them. (#26514)
 * 2. The parent **session's** deny rules and external_directory rules —
 *    same forwarding the original code already did.
 * 3. Default `todowrite` and `task` denies if the subagent's own ruleset
 *    doesn't already permit them.
 */
export function deriveSubagentSessionPermission(input: {
  parentSessionPermission: Permission.Ruleset
  parentAgent: Agent.Info | undefined
  subagent: Agent.Info
}): Permission.Ruleset {
  const canTask = input.subagent.permission.some((rule) => rule.permission === "task")
  const canTodo = input.subagent.permission.some((rule) => rule.permission === "todowrite")
  const parentAgentDenies = input.parentAgent?.permission.filter((rule) => rule.action === "deny") ?? []
  return [
    ...parentAgentDenies,
    ...input.parentSessionPermission.filter(
      (rule) => rule.permission === "external_directory" || rule.action === "deny",
    ),
    ...(canTodo ? [] : [{ permission: "todowrite" as const, pattern: "*" as const, action: "deny" as const }]),
    ...(canTask ? [] : [{ permission: "task" as const, pattern: "*" as const, action: "deny" as const }]),
  ]
}
```

### 2. Update Task Tool to Use Subagent Permission Derivation
**File**: `src/tool/task.ts`
**Priority**: critical
**Type**: security
**Reason**: The task tool must use the new `deriveSubagentSessionPermission` function to properly inherit deny rules from parent agent, preventing Plan Mode bypass.

**Current code** (approximate):
```typescript
// When spawning subagent session, permission was derived only from session
const permission = [
  ...parentSessionPermission.filter(
    (rule) => rule.permission === "external_directory" || rule.action === "deny",
  ),
  // ... default denies
]
```

**New code**:
```typescript
import { deriveSubagentSessionPermission } from "../agent/subagent-permissions"

// When spawning subagent session
const permission = deriveSubagentSessionPermission({
  parentSessionPermission: ctx.session.permission,
  parentAgent: ctx.agent,
  subagent: resolvedSubagent,
})
```

### 3. Add Test for Plan Mode Subagent Bypass Prevention
**File**: `src/agent/subagent-permissions.test.ts` (new file)
**Priority**: high
**Type**: security
**Reason**: Regression test to ensure Plan Mode restrictions are properly inherited by subagents.

**New code**:
```typescript
import { describe, it, expect } from "vitest"
import { deriveSubagentSessionPermission } from "./subagent-permissions"

describe("deriveSubagentSessionPermission", () => {
  it("inherits parent agent deny rules", () => {
    const result = deriveSubagentSessionPermission({
      parentSessionPermission: [],
      parentAgent: {
        id: "plan-mode",
        name: "Plan Mode",
        permission: [
          { permission: "write", pattern: "*", action: "deny" },
          { permission: "shell", pattern: "*", action: "deny" },
        ],
      } as any,
      subagent: {
        id: "coder",
        name: "Coder",
        permission: [],
      } as any,
    })

    expect(result).toContainEqual({ permission: "write", pattern: "*", action: "deny" })
    expect(result).toContainEqual({ permission: "shell", pattern: "*", action: "deny" })
  })

  it("inherits parent session deny rules and external_directory", () => {
    const result = deriveSubagentSessionPermission({
      parentSessionPermission: [
        { permission: "external_directory", pattern: "/allowed", action: "allow" },
        { permission: "read", pattern: "*.secret", action: "deny" },
      ],
      parentAgent: undefined,
      subagent: { permission: [] } as any,
    })

    expect(result).toContainEqual({ permission: "external_directory", pattern: "/allowed", action: "allow" })
    expect(result).toContainEqual({ permission: "read", pattern: "*.secret", action: "deny" })
  })

  it("adds default todowrite and task denies unless subagent permits", () => {
    const resultWithoutPermission = deriveSubagentSessionPermission({
      parentSessionPermission: [],
      parentAgent: undefined,
      subagent: { permission: [] } as any,
    })

    expect(resultWithoutPermission).toContainEqual({ permission: "todowrite", pattern: "*", action: "deny" })
    expect(resultWithoutPermission).toContainEqual({ permission: "task", pattern: "*", action: "deny" })

    const resultWithPermission = deriveSubagentSessionPermission({
      parentSessionPermission: [],
      parentAgent: undefined,
      subagent: {
        permission: [
          { permission: "todowrite", pattern: "*", action: "allow" },
          { permission: "task", pattern: "*", action: "allow" },
        ],
      } as any,
    })

    expect(resultWithPermission).not.toContainEqual(expect.objectContaining({ permission: "todowrite", action: "deny" }))
    expect(resultWithPermission).not.toContainEqual(expect.objectContaining({ permission: "task", action: "deny" }))
  })
})
```

### 4. Fix Read Tool Permission Pattern Matching
**File**: `src/tool/read.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Permission patterns should match against worktree-relative paths, not absolute paths. This fixes potential permission bypass issues.

**Current code** (approximate):
```typescript
// Permission check using absolute path
const allowed = checkPermission(absolutePath, permission)
```

**New code**:
```typescript
// Permission check using worktree-relative path
const relativePath = path.relative(worktreePath, absolutePath)
const allowed = checkPermission(relativePath, permission)
```

### 5. Add Image Handling with Auto-Resize and Max Size Constraints
**File**: `src/config/attachment.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Better image handling from PR #26401 - auto resize and max size constraints for image attachments to prevent token/size issues.

**New code**:
```typescript
import { Schema } from "effect"

export const AttachmentConfig = Schema.Struct({
  image: Schema.optional(
    Schema.Struct({
      maxWidth: Schema.optional(Schema.Number.pipe(Schema.positive())),
      maxHeight: Schema.optional(Schema.Number.pipe(Schema.positive())),
      maxSizeBytes: Schema.optional(Schema.Number.pipe(Schema.positive())),
      autoResize: Schema.optional(Schema.Boolean),
      quality: Schema.optional(Schema.Number.pipe(Schema.between(0, 100))),
    })
  ),
})

export type AttachmentConfig = Schema.Schema.Type<typeof AttachmentConfig>

export const DEFAULT_ATTACHMENT_CONFIG: AttachmentConfig = {
  image: {
    maxWidth: 2048,
    maxHeight: 2048,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    autoResize: true,
    quality: 85,
  },
}
```

### 6. Add Image Processing Utility
**File**: `src/image/image.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Image processing utilities for resizing and optimizing images before sending to LLM providers.

**New code**:
```typescript
import { Effect } from "effect"

export interface ImageProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  maxSizeBytes?: number
  quality?: number
}

export interface ProcessedImage {
  data: Buffer
  mimeType: string
  width: number
  height: number
}

/**
 * Process an image buffer with size constraints and optional resizing.
 * Returns the processed image or the original if no processing needed.
 */
export function processImage(
  input: Buffer,
  mimeType: string,
  options: ImageProcessingOptions = {}
): Effect.Effect<ProcessedImage, Error> {
  return Effect.tryPromise(async () => {
    const { maxWidth = 2048, maxHeight = 2048, maxSizeBytes = 5 * 1024 * 1024, quality = 85 } = options

    // Check if processing is needed
    if (input.length <= maxSizeBytes) {
      // Return original if within size limits
      // Note: Full implementation would use sharp or similar for dimension checks
      return {
        data: input,
        mimeType,
        width: 0, // Would need actual dimension detection
        height: 0,
      }
    }

    // For actual implementation, integrate with sharp or photon-node
    // This is a placeholder that returns the original
    return {
      data: input,
      mimeType,
      width: 0,
      height: 0,
    }
  })
}

/**
 * Check if a buffer represents a supported image format
 */
export function isSupportedImage(mimeType: string): boolean {
  const supported = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  return supported.includes(mimeType.toLowerCase())
}
```

### 7. Add Built-in Customize Skill (opencode-meta)
**File**: `src/skill/customize-opencode.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Built-in skill for customizing opencode behavior, from PR #26617. Provides guidance on configuration and customization.

**New code**:
```typescript
import { Skill } from "./index"

export const customizeOpencodeSkill: Skill.Definition = {
  id: "opencode-meta",
  name: "Customize Opencode",
  description: "Guidance on customizing Alexi/opencode behavior and configuration",
  enabled: () => {
    // Check feature flag
    return process.env.OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL !== "false"
  },
  prompt: `# Customizing Alexi

## Configuration Files

Alexi can be customized through configuration files:

- \`.alexi/config.json\` - Project-level configuration
- \`~/.config/alexi/config.json\` - User-level configuration

## Available Settings

### Agent Configuration
Configure custom agents with specific permissions and behaviors.

### Model Selection
Set preferred models for different tasks.

### Permission Rules
Define allow/deny rules for file access and tool usage.

### MCP Servers
Configure Model Context Protocol servers for extended capabilities.

## Best Practices

1. Start with project-level config for team consistency
2. Use user-level config for personal preferences
3. Test permission changes carefully
4. Document custom agents for team members
`,
}
```

### 8. Update Skill Index to Include Customize Skill
**File**: `src/skill/index.ts`
**Priority**: medium
**Type**: feature
**Reason**: Register the new customize skill in the skill registry.

**Current code** (approximate):
```typescript
import { builtinSkills } from "./builtin"

export const allSkills = [...builtinSkills]
```

**New code**:
```typescript
import { builtinSkills } from "./builtin"
import { customizeOpencodeSkill } from "./customize-opencode"
import { Flag } from "@opencode-ai/core/flag"

export const allSkills = [
  ...builtinSkills,
  ...(Flag.OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL ? [customizeOpencodeSkill] : []),
]
```

### 9. Add Feature Flag for Customize Skill
**File**: `src/core/flag.ts`
**Priority**: medium
**Type**: feature
**Reason**: Add feature flag for the experimental customize skill, defaulting on for dev/beta channels.

**Current code** (if exists, add to flags):
```typescript
export const Flag = {
  // ... existing flags
}
```

**New code**:
```typescript
// Add to existing Flag object
const UNSTABLE_CHANNELS = new Set(["dev", "beta", "local"])

function unstableDefault(key: string) {
  const value = process.env[key]
  if (value === "true" || value === "1") return true
  if (value === "false" || value === "0") return false
  return UNSTABLE_CHANNELS.has(process.env.INSTALLATION_CHANNEL ?? "prod")
}

export const Flag = {
  // ... existing flags
  
  // Default-on for dev/beta/local; opt-in for stable. Set
  // OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL=false to force off, =true to force on.
  OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL: unstableDefault("OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL"),
}
```

### 10. Fix MCP Output Schema Reference Failures
**File**: `src/mcp/index.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Tolerate output schema reference failures in MCP tool definitions to prevent crashes when MCP servers return malformed schemas.

**Current code** (approximate):
```typescript
function parseToolSchema(schema: unknown) {
  // Strict parsing that throws on invalid refs
  return Schema.decodeUnknown(ToolSchema)(schema)
}
```

**New code**:
```typescript
function parseToolSchema(schema: unknown) {
  return Effect.gen(function* () {
    try {
      return yield* Schema.decodeUnknown(ToolSchema)(schema)
    } catch (error) {
      // Tolerate schema ref failures - log warning and return permissive schema
      console.warn("MCP tool schema parsing failed, using permissive fallback:", error)
      return {
        type: "object" as const,
        properties: {},
        additionalProperties: true,
      }
    }
  })
}
```

### 11. Add TUI Path Formatting Relative to Session Directory
**File**: `src/cli/tui/path-format.ts` (new file)
**Priority**: low
**Type**: feature
**Reason**: Format file paths relative to the session directory in TUI for better readability, from PR #26648.

**New code**:
```typescript
import * as path from "path"

/**
 * Format a path relative to the session's working directory.
 * Falls back to the original path if it's outside the session directory.
 */
export function formatPathRelativeToSession(
  absolutePath: string,
  sessionDirectory: string
): string {
  if (!absolutePath || !sessionDirectory) {
    return absolutePath
  }

  const relative = path.relative(sessionDirectory, absolutePath)
  
  // If the relative path starts with "..", it's outside the session directory
  if (relative.startsWith("..") || path.isAbsolute(relative))
{"prompt_tokens":14279,"completion_tokens":4096,"total_tokens":18375}

[Session: ebaaca21-7dfb-4579-aa10-f8adf5769acd]
[Messages: 2, Tokens: 18375]
