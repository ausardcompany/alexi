# Update Plan for Alexi

Generated: 2026-04-20
Based on upstream commits: kilocode 7038ce061..883f12819 (197 commits)

## Summary
- Total changes planned: 28
- Critical: 3 | High: 9 | Medium: 12 | Low: 4

## Changes

### 1. Add Suggest Permission to Permission System
**File**: `src/permission/index.ts`
**Priority**: critical
**Type**: feature
**Reason**: New "suggest" permission type added to support code review suggestions. This is required for the new suggestion tool to function properly.

**New code** (add to permission types):
```typescript
// Add to permission schema/types
export type PermissionType = 
  | "allow"
  | "deny"
  | "ask"
  // ... existing types
  | "suggest"  // NEW: for code review suggestions

// In permission defaults or configuration
export const defaultPermissions = {
  // ... existing permissions
  suggest: "deny" as const,  // Default to deny, agents explicitly enable
}
```

### 2. Add Suggest Permission to Agent Defaults
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: feature
**Reason**: Agents need explicit suggest permission configuration. Subagents should deny by default, main agents should allow.

**Current code**:
```typescript
// In agent permission configuration
const agentPermissions = {
  question: "deny",
  plan_enter: "deny",
  plan_exit: "deny",
  // ...
}
```

**New code**:
```typescript
// In agent permission configuration
const agentPermissions = {
  question: "deny",
  suggest: "deny",  // NEW: deny for subagents
  plan_enter: "deny",
  plan_exit: "deny",
  // ...
}

// For main agents that should allow suggestions:
const mainAgentPermissions = {
  question: "allow",
  suggest: "allow",  // NEW: allow for main agents
  plan_enter: "allow",
  // ...
}
```

### 3. Update Tool Registry with Suggest Tool Support
**File**: `src/tool/registry.ts`
**Priority**: critical
**Type**: feature
**Reason**: Tool registry needs to register the new suggest tool for code review functionality.

**New code** (add to registry):
```typescript
import { SuggestTool } from "./suggest"

// In tool registration
export function registerTools(registry: ToolRegistry) {
  // ... existing tools
  registry.register("suggest", SuggestTool)
}

// Update tool type exports
export type ToolName = 
  | "read"
  | "write"
  // ... existing tools
  | "suggest"  // NEW
```

### 4. Create Suggest Tool Implementation
**File**: `src/tool/suggest.ts`
**Priority**: high
**Type**: feature
**Reason**: New suggest tool for code review suggestions based on kilocode implementation.

**New code**:
```typescript
import { Tool } from "./tool"
import { z } from "zod"
import { Effect } from "effect"

export const SuggestToolSchema = z.object({
  suggestion: z.string().describe("The code review suggestion"),
  file: z.string().optional().describe("Optional file path the suggestion relates to"),
  line: z.number().optional().describe("Optional line number"),
  severity: z.enum(["info", "warning", "error"]).optional().default("info"),
})

export type SuggestToolInput = z.infer<typeof SuggestToolSchema>

export const SuggestTool = Tool.define({
  name: "suggest",
  description: "Suggest code improvements or review comments to the user",
  parameters: SuggestToolSchema,
  execute: (input: SuggestToolInput) =>
    Effect.gen(function* () {
      // Emit suggestion event for UI handling
      yield* Effect.logInfo("Code suggestion", { 
        suggestion: input.suggestion,
        file: input.file,
        line: input.line,
        severity: input.severity,
      })
      
      return {
        success: true,
        message: "Suggestion recorded",
      }
    }),
})
```

### 5. Update Bus Event System with Project/Workspace Context
**File**: `src/bus/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Global bus events now include project and workspace context for better event routing.

**Current code**:
```typescript
GlobalBus.emit("event", {
  directory: dir,
  payload,
})
```

**New code**:
```typescript
import { WorkspaceContext } from "@/control-plane/workspace-context"

// In event emission
const context = yield* InstanceState.context
const workspace = yield* InstanceState.workspaceID

GlobalBus.emit("event", {
  directory: dir,
  project: context.project.id,
  workspace,
  payload,
})
```

### 6. Update Bus Global Types
**File**: `src/bus/global.ts`
**Priority**: high
**Type**: feature
**Reason**: Add project and workspace fields to global bus event type.

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

### 7. Simplify Bus Event Payloads Schema
**File**: `src/bus/bus-event.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Simplified event payload schema generation - removed discriminated union wrapper for cleaner API.

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

### 8. Update Effect Service Pattern
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: Migrate from `ServiceMap.Service` to `Context.Service` pattern per Effect library updates.

**Current code**:
```typescript
import { Effect, ServiceMap, Layer } from "effect"

export class Service extends ServiceMap.Service<Service, Interface>()("@opencode/Agent") {}
```

**New code**:
```typescript
import { Effect, Context, Layer } from "effect"

export class Service extends Context.Service<Service, Interface>()("@opencode/Agent") {}
```

### 9. Update Bus Service Pattern
**File**: `src/bus/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: Same ServiceMap to Context migration for Bus service.

**Current code**:
```typescript
import { Effect, Exit, Layer, PubSub, Scope, ServiceMap, Stream } from "effect"

export class Service extends ServiceMap.Service<Service, Interface>()("@opencode/Bus") {}
```

**New code**:
```typescript
import { Effect, Exit, Layer, PubSub, Scope, Context, Stream } from "effect"

export class Service extends Context.Service<Service, Interface>()("@opencode/Bus") {}
```

### 10. Add Effect Logger to Bus Unsubscribe
**File**: `src/bus/index.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Proper logger context needed when closing scope to prevent logging errors.

**Current code**:
```typescript
return () => {
  log.info("unsubscribing", { type })
  Effect.runFork(Scope.close(scope, Exit.void))
}
```

**New code**:
```typescript
import { EffectLogger } from "@/effect/logger"

return () => {
  log.info("unsubscribing", { type })
  Effect.runFork(Scope.close(scope, Exit.void).pipe(Effect.provide(EffectLogger.layer)))
}
```

### 11. Add Read Directory Tool
**File**: `src/tool/read-directory.ts`
**Priority**: high
**Type**: feature
**Reason**: New tool for reading directory contents, extracted from kilocode.

**New code**:
```typescript
import { Tool } from "./tool"
import { z } from "zod"
import { Effect } from "effect"
import { File } from "@/file"

export const ReadDirectorySchema = z.object({
  path: z.string().describe("Directory path to read"),
  recursive: z.boolean().optional().default(false).describe("Whether to read recursively"),
  maxDepth: z.number().optional().default(3).describe("Maximum depth for recursive reads"),
})

export type ReadDirectoryInput = z.infer<typeof ReadDirectorySchema>

export const ReadDirectoryTool = Tool.define({
  name: "read_directory",
  description: "List contents of a directory",
  parameters: ReadDirectorySchema,
  execute: (input: ReadDirectoryInput) =>
    Effect.gen(function* () {
      const file = yield* File.Service
      const entries = yield* file.listDirectory(input.path, {
        recursive: input.recursive,
        maxDepth: input.maxDepth,
      })
      
      return {
        entries,
        count: entries.length,
      }
    }),
})
```

### 12. Update Tool Schema - Remove Deprecated Fields
**File**: `src/tool/schema.ts`
**Priority**: low
**Type**: refactor
**Reason**: Schema cleanup removing deprecated fields.

**Current code**:
```typescript
export const ToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  // ... other fields
  deprecated: z.boolean().optional(),
})
```

**New code**:
```typescript
export const ToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  // ... other fields
  // deprecated field removed
})
```

### 13. Update Permission Schema - Simplify
**File**: `src/permission/schema.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Permission schema simplified, removing redundant fields.

**Current code**:
```typescript
export const PermissionSchema = z.object({
  type: z.string(),
  level: z.enum(["allow", "deny", "ask"]),
  // ... extra fields
  metadata: z.record(z.unknown()).optional(),
})
```

**New code**:
```typescript
export const PermissionSchema = z.object({
  type: z.string(),
  level: z.enum(["allow", "deny", "ask"]),
  // metadata field removed - use specific typed fields instead
})
```

### 14. Add MCP Exa Tool
**File**: `src/tool/mcp-exa.ts`
**Priority**: medium
**Type**: feature
**Reason**: New MCP Exa integration tool for enhanced search capabilities.

**New code**:
```typescript
import { Tool } from "./tool"
import { z } from "zod"
import { Effect } from "effect"

export const McpExaSchema = z.object({
  query: z.string().describe("Search query"),
  numResults: z.number().optional().default(10).describe("Number of results to return"),
  type: z.enum(["keyword", "neural", "auto"]).optional().default("auto"),
})

export type McpExaInput = z.infer<typeof McpExaSchema>

export const McpExaTool = Tool.define({
  name: "mcp_exa",
  description: "Search using Exa AI for web content",
  parameters: McpExaSchema,
  execute: (input: McpExaInput) =>
    Effect.gen(function* () {
      // MCP integration for Exa search
      yield* Effect.logInfo("Exa search", { query: input.query })
      
      // Placeholder - actual implementation depends on MCP server
      return {
        results: [],
        query: input.query,
      }
    }),
})
```

### 15. Update Codesearch Tool - Simplify Implementation
**File**: `src/tool/codesearch.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Codesearch implementation simplified with reduced line count (-69 lines).

**Current code**:
```typescript
// Complex search implementation with multiple code paths
export const CodeSearchTool = Tool.define({
  // ... verbose implementation
})
```

**New code**:
```typescript
import { Tool } from "./tool"
import { z } from "zod"
import { Effect } from "effect"
import { File } from "@/file"

export const CodeSearchSchema = z.object({
  query: z.string().describe("Search query"),
  path: z.string().optional().describe("Path to search in"),
  caseSensitive: z.boolean().optional().default(false),
  regex: z.boolean().optional().default(false),
})

export const CodeSearchTool = Tool.define({
  name: "codesearch",
  description: "Search code in the project",
  parameters: CodeSearchSchema,
  execute: (input) =>
    Effect.gen(function* () {
      const file = yield* File.Service
      return yield* file.search(input.query, {
        path: input.path,
        caseSensitive: input.caseSensitive,
        regex: input.regex,
      })
    }),
})
```

### 16. Update Plan Tool - Major Simplification
**File**: `src/tool/plan.ts`
**Priority**: high
**Type**: refactor
**Reason**: Plan tool significantly simplified (-61 lines), removing redundant logic.

**Current code**:
```typescript
// Complex plan tool with multiple states
```

**New code**:
```typescript
import { Tool } from "./tool"
import { z } from "zod"
import { Effect } from "effect"

export const PlanSchema = z.object({
  action: z.enum(["enter", "exit", "update"]).describe("Plan action"),
  content: z.string().optional().describe("Plan content for update"),
})

export const PlanTool = Tool.define({
  name: "plan",
  description: "Manage execution plans",
  parameters: PlanSchema,
  execute: (input) =>
    Effect.gen(function* () {
      switch (input.action) {
        case "enter":
          yield* Effect.logInfo("Entering plan mode")
          return { status: "planning" }
        case "exit":
          yield* Effect.logInfo("Exiting plan mode")
          return { status: "executing" }
        case "update":
          yield* Effect.logInfo("Updating plan", { content: input.content })
          return { status: "updated" }
      }
    }),
})
```

### 17. Update Websearch Tool - Simplify
**File**: `src/tool/websearch.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Websearch tool simplified (-76 lines), streamlined search implementation.

**Current code**:
```typescript
// Complex websearch with multiple providers
```

**New code**:
```typescript
import { Tool } from "./tool"
import { z } from "zod"
import { Effect } from "effect"

export const WebSearchSchema = z.object({
  query: z.string().describe("Search query"),
  numResults: z.number().optional().default(5),
})

export const WebSearchTool = Tool.define({
  name: "websearch",
  description: "Search the web",
  parameters: WebSearchSchema,
  execute: (input) =>
    Effect.gen(function* () {
{"prompt_tokens":29906,"completion_tokens":4096,"total_tokens":34002}

[Session: e6b107cd-6232-4d09-8612-157a04ff4105]
[Messages: 2, Tokens: 34002]
