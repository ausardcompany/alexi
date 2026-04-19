# Update Plan for Alexi

Generated: 2026-04-19
Based on upstream commits: b24baf93e, 568d7463b, dfd939443, 46e785b03, 28abdeded, and 184 others from kilocode

## Summary
- Total changes planned: 47
- Critical: 3 | High: 12 | Medium: 22 | Low: 10

## Changes

### 1. Update Effect Service Pattern - ServiceMap to Context.Service Migration
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: refactor
**Reason**: Effect library updated from `ServiceMap.Service` to `Context.Service` pattern. This is a breaking change in the Effect ecosystem that must be applied consistently.

**Current code**:
```typescript
import { Effect, ServiceMap, Layer } from "effect"

export class Service extends ServiceMap.Service<Service, Interface>()("@alexi/Agent") {}
```

**New code**:
```typescript
import { Effect, Context, Layer } from "effect"

export class Service extends Context.Service<Service, Interface>()("@alexi/Agent") {}
```

---

### 2. Update Effect Service Pattern in Bus Module
**File**: `src/bus/index.ts`
**Priority**: critical
**Type**: refactor
**Reason**: Same ServiceMap to Context.Service migration required for Bus service.

**Current code**:
```typescript
import { Effect, Exit, Layer, PubSub, Scope, ServiceMap, Stream } from "effect"

export class Service extends ServiceMap.Service<Service, Interface>()("@alexi/Bus") {}
```

**New code**:
```typescript
import { Effect, Exit, Layer, PubSub, Scope, Context, Stream } from "effect"
import { EffectLogger } from "@/effect/logger"
import { WorkspaceContext } from "@/control-plane/workspace-context"

export class Service extends Context.Service<Service, Interface>()("@alexi/Bus") {}
```

---

### 3. Add Suggest Permission to Agent Defaults
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: feature
**Reason**: New "suggest" permission added to agents for code review suggestions feature. Without this, suggest tool calls will be denied.

**Current code**:
```typescript
const defaults = Permission.fromConfig({
  question: "deny",
  plan_enter: "deny",
  plan_exit: "deny",
  // ... other permissions
})
```

**New code**:
```typescript
const defaults = Permission.fromConfig({
  suggest: "deny", // alexi_change: new suggest permission
  question: "deny",
  plan_enter: "deny",
  plan_exit: "deny",
  // ... other permissions
})
```

---

### 4. Add makeRuntime Import to Agent Module
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: Runtime creation pattern changed to use makeRuntime helper for consistent service instantiation.

**Current code**:
```typescript
import { Effect, Context, Layer } from "effect"
import { InstanceState } from "@/effect/instance-state"
```

**New code**:
```typescript
import { Effect, Context, Layer } from "effect"
import { makeRuntime } from "@/effect/run-service"
import { InstanceState } from "@/effect/instance-state"
```

---

### 5. Add Plugin Service Dependency to Agent Layer
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Agent layer now requires Plugin service for workspace adaptor integration.

**Current code**:
```typescript
export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const config = yield* Config.Service
    const auth = yield* Auth.Service
    const skill = yield* Skill.Service
    const provider = yield* Provider.Service
```

**New code**:
```typescript
export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const config = yield* Config.Service
    const auth = yield* Auth.Service
    const plugin = yield* Plugin.Service
    const skill = yield* Skill.Service
    const provider = yield* Provider.Service
```

---

### 6. Add Project and Workspace Context to Global Bus Events
**File**: `src/bus/global.ts`
**Priority**: high
**Type**: feature
**Reason**: Global bus events now include project and workspace identifiers for proper event routing in multi-workspace scenarios.

**Current code**:
```typescript
export const GlobalBus = new EventEmitter<{
  event: [
    {
      directory?: string
      payload: any
    },
  ]
}>()
```

**New code**:
```typescript
export const GlobalBus = new EventEmitter<{
  event: [
    {
      directory?: string
      project?: string
      workspace?: string
      payload: any
    },
  ]
}>()
```

---

### 7. Update Bus Event Publishing with Workspace Context
**File**: `src/bus/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Bus publish now includes workspace and project context for proper event scoping.

**Current code**:
```typescript
const dir = yield* InstanceState.directory
GlobalBus.emit("event", {
  directory: dir,
  payload,
})
```

**New code**:
```typescript
const dir = yield* InstanceState.directory
const context = yield* InstanceState.context
const workspace = yield* InstanceState.workspaceID

GlobalBus.emit("event", {
  directory: dir,
  project: context.project.id,
  workspace,
  payload,
})
```

---

### 8. Fix Bus Unsubscribe with EffectLogger
**File**: `src/bus/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Unsubscribe effect now properly provides EffectLogger layer to prevent runtime errors.

**Current code**:
```typescript
return () => {
  log.info("unsubscribing", { type })
  Effect.runFork(Scope.close(scope, Exit.void))
}
```

**New code**:
```typescript
return () => {
  log.info("unsubscribing", { type })
  Effect.runFork(Scope.close(scope, Exit.void).pipe(Effect.provide(EffectLogger.layer)))
}
```

---

### 9. Simplify BusEvent Payloads Schema
**File**: `src/bus/bus-event.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Simplified schema generation by removing discriminatedUnion wrapper, returning array of schemas directly.

**Current code**:
```typescript
export function payloads() {
  return z
    .discriminatedUnion(
      "type",
      registry
        .entries()
        .map(([type, def]) => {
          return z
            .object({
              type: z.literal(type),
              properties: def.properties,
            })
            .meta({
              ref: "Event" + "." + def.type,
            })
        })
        .toArray() as any,
    )
    .meta({
      ref: "Event",
    })
}
```

**New code**:
```typescript
export function payloads() {
  return registry
    .entries()
    .map(([type, def]) => {
      return z
        .object({
          type: z.literal(type),
          properties: def.properties,
        })
        .meta({
          ref: "Event" + "." + def.type,
        })
    })
    .toArray()
}
```

---

### 10. Create New Suggest Tool
**File**: `src/tool/suggest.ts`
**Priority**: high
**Type**: feature
**Reason**: New suggest tool for code review suggestions functionality.

**New code**:
```typescript
import { Tool } from "./tool"
import { z } from "zod"

export namespace Suggest {
  export const schema = z.object({
    suggestion: z.string().describe("The code suggestion or review comment"),
    file: z.string().optional().describe("Optional file path the suggestion relates to"),
    line: z.number().optional().describe("Optional line number for the suggestion"),
  })

  export type Input = z.infer<typeof schema>

  export const tool = Tool.define({
    name: "suggest",
    description: "Provide a code review suggestion or recommendation to the user",
    parameters: schema,
    execute: async (input: Input, context) => {
      // Suggestion handling is done by the client
      return {
        type: "suggestion" as const,
        suggestion: input.suggestion,
        file: input.file,
        line: input.line,
      }
    },
  })
}
```

---

### 11. Register Suggest Tool in Registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: Suggest tool must be registered in the tool registry.

**Current code**:
```typescript
import { Question } from "./question"
import { Task } from "./task"
// ... other imports

const tools = [
  Question.tool,
  Task.tool,
  // ... other tools
]
```

**New code**:
```typescript
import { Question } from "./question"
import { Suggest } from "./suggest"
import { Task } from "./task"
// ... other imports

const tools = [
  Question.tool,
  Suggest.tool,
  Task.tool,
  // ... other tools
]
```

---

### 12. Create Read Directory Tool
**File**: `src/tool/read-directory.ts`
**Priority**: high
**Type**: feature
**Reason**: New tool for reading directory contents, extracted from kilocode.

**New code**:
```typescript
import { Tool } from "./tool"
import { z } from "zod"
import { Effect } from "effect"
import { File } from "../file"

export namespace ReadDirectory {
  export const schema = z.object({
    path: z.string().describe("The directory path to read"),
    recursive: z.boolean().optional().default(false).describe("Whether to read recursively"),
    maxDepth: z.number().optional().default(3).describe("Maximum depth for recursive reads"),
  })

  export type Input = z.infer<typeof schema>

  export const tool = Tool.define({
    name: "read_directory",
    description: "Read the contents of a directory, optionally recursively",
    parameters: schema,
    execute: async (input: Input, context) => {
      return Effect.gen(function* () {
        const file = yield* File.Service
        const entries = yield* file.listDirectory(input.path, {
          recursive: input.recursive,
          maxDepth: input.maxDepth,
        })
        return {
          type: "directory_listing" as const,
          path: input.path,
          entries,
        }
      })
    },
  })
}
```

---

### 13. Add Suggest Permission to Permission Schema
**File**: `src/permission/schema.ts`
**Priority**: high
**Type**: feature
**Reason**: Permission schema must include the new suggest permission type.

**Current code**:
```typescript
export const PermissionType = z.enum([
  "bash",
  "read",
  "write",
  "question",
  "task",
  // ... other permissions
])
```

**New code**:
```typescript
export const PermissionType = z.enum([
  "bash",
  "read",
  "write",
  "question",
  "suggest",
  "task",
  // ... other permissions
])
```

---

### 14. Update Permission Index with Suggest Handling
**File**: `src/permission/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Permission evaluation must handle the new suggest permission.

**Current code**:
```typescript
const defaultPermissions: Record<string, PermissionLevel> = {
  bash: "ask",
  read: "allow",
  write: "ask",
  question: "allow",
  // ... other defaults
}
```

**New code**:
```typescript
const defaultPermissions: Record<string, PermissionLevel> = {
  bash: "ask",
  read: "allow",
  write: "ask",
  question: "allow",
  suggest: "allow",
  // ... other defaults
}
```

---

### 15. Update Tool Schema - Remove Unused Import
**File**: `src/tool/schema.ts`
**Priority**: low
**Type**: refactor
**Reason**: Clean up unused imports in schema file.

**Current code**:
```typescript
import { z } from "zod"
import { Effect, Schema } from "effect"
```

**New code**:
```typescript
import { z } from "zod"
import { Effect } from "effect"
```

---

### 16. Update Apply Patch Tool with Effect Pattern
**File**: `src/tool/apply_patch.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Apply patch tool updated to use new Effect patterns for better error handling.

**Current code**:
```typescript
export const tool = Tool.define({
  name: "apply_patch",
  description: "Apply a unified diff patch to files",
  parameters: schema,
  execute: async (input: Input, context) => {
    try {
      const result = await applyPatch(input.patch, context.cwd)
      return { success: true, result }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  },
})
```

**New code**:
```typescript
export const tool = Tool.define({
  name: "apply_patch",
  description: "Apply a unified diff patch to files",
  parameters: schema,
  execute: (input: Input, context) => {
    return Effect.gen(function* () {
      const file = yield* File.Service
      const result = yield* Effect.tryPromise({
        try: () => applyPatch(input.patch, context.cwd),
        catch: (error) => new ApplyPatchError({ message: String(error) }),
      })
      return { success: true, result }
    }).pipe(
      Effect.catchAll((error) => 
        Effect.succeed({ success: false, error: error.message })
      )
    )
  },
})
```

---

### 17. Update Bash Tool with Effect Runtime Pattern
**File**: `src/tool/bash.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Bash tool refactored to use Effect runtime pattern for consistent service access.

**Current code**:
```typescript
execute: async (input: Input, context) => {
  const pty = await Pty.create(context.cwd)
  const result = await pty.execute(input.command, {
    timeout: input.timeout,
  })
  return result
}
```

**New code**:
```typescript
execute: (input: Input, context) => {
  return Effect.gen(function* () {
    const pty = yield* Pty.Service
    const result = yield* pty.execute(input.command, {
      timeout: input.timeout,
      cwd: context.cwd,
    })
    return result
  })
}
```

---

### 18. Update Codesearch Tool - Simplify Implementation
**File**: `src/tool/codesearch.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Codesearch tool simplified with reduced code complexity (57 additions, 126 deletions upstream).

**New code**:
```typescript
import { Tool } from "./tool"
import { z } from "zod"
import { Effect } from "effect"
import { File } from "../file"

export namespace Codesearch {
  export const schema = z.object({
    query: z.string().describe("The search query"),
    path: z.string().optional().describe("Optional path to search within"),
    caseSensitive: z.boolean().optional().default(false),
  })

  export type Input = z.infer<typeof schema>

  export const tool = Tool.define({
    name: "codesearch",
    description: "Search for code patterns across the codebase",
    parameters: schema,
    execute: (input: Input, context) => {
      return Effect.gen(function* () {
        const file = yield* File.Service
        const results = yield* file.search(input.query, {
{"prompt_tokens":29164,"completion_tokens":4096,"total_tokens":33260}

[Session: 09c3753b-af08-48da-be98-da8c933d7b5a]
[Messages: 2, Tokens: 33260]
