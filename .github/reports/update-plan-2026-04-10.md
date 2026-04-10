# Update Plan for Alexi

Generated: 2026-04-10
Based on upstream commits: kilocode f1a347102..1a5be52c7 (358 commits), opencode ce19c05..ae614d9 (52 commits)

## Summary
- Total changes planned: 24
- Critical: 2 | High: 8 | Medium: 10 | Low: 4

## Changes

### 1. Add Local Recall Tool for Cross-Session Search
**File**: `src/tool/recall.ts`
**Priority**: high
**Type**: feature
**Reason**: New tool added in kilocode that enables searching across previous sessions within the same project/worktree. This is valuable for context retrieval and session continuity.

**New code**:
```typescript
import { Tool } from "./tool"
import { z } from "zod"
import { Effect } from "effect"
import { Session } from "../session"
import { Project } from "../project/project"

export const RecallTool = Tool.defineEffect(
  "recall",
  {
    description: "Search and retrieve information from previous sessions in this project",
    parameters: z.object({
      query: z.string().describe("Search query to find relevant session content"),
      sessionId: z.string().optional().describe("Specific session ID to search within"),
      limit: z.number().default(10).describe("Maximum number of results to return"),
    }),
  },
  (input) =>
    Effect.gen(function* () {
      const project = yield* Project.get()
      const sessions = yield* Session.list({
        projectId: project.id,
        limit: input.limit,
      })

      if (input.sessionId) {
        const session = sessions.find((s) => s.id === input.sessionId)
        if (!session) {
          return { success: false, error: "Session not found" }
        }
        const messages = yield* Session.messages(input.sessionId)
        return {
          success: true,
          results: searchMessages(messages, input.query),
        }
      }

      const allResults = []
      for (const session of sessions) {
        const messages = yield* Session.messages(session.id)
        const matches = searchMessages(messages, input.query)
        if (matches.length > 0) {
          allResults.push({
            sessionId: session.id,
            sessionTitle: session.title,
            matches,
          })
        }
      }

      return { success: true, results: allResults.slice(0, input.limit) }
    })
)

function searchMessages(messages: any[], query: string) {
  const queryLower = query.toLowerCase()
  return messages
    .filter((m) => {
      const content = typeof m.content === "string" ? m.content : JSON.stringify(m.content)
      return content.toLowerCase().includes(queryLower)
    })
    .map((m) => ({
      role: m.role,
      preview: extractPreview(m.content, query),
    }))
}

function extractPreview(content: any, query: string, contextChars = 100): string {
  const text = typeof content === "string" ? content : JSON.stringify(content)
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text.slice(0, contextChars * 2)
  const start = Math.max(0, idx - contextChars)
  const end = Math.min(text.length, idx + query.length + contextChars)
  return (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "")
}
```

### 2. Add Allow Everything Permission Toggle
**File**: `src/permission/next.ts`
**Priority**: critical
**Type**: feature
**Reason**: kilocode added session-scoped "allow everything" functionality that auto-approves all permissions within a session scope. Critical for workflow efficiency.

**Current code**:
```typescript
export namespace Permission {
  export interface State {
    approved: string[]
    denied: string[]
  }
}
```

**New code**:
```typescript
export namespace Permission {
  export interface State {
    approved: string[]
    denied: string[]
    allowEverything: boolean
    allowEverythingScope?: "session" | "project"
  }

  export function allowEverything(
    state: State,
    scope: "session" | "project" = "session"
  ): State {
    return {
      ...state,
      allowEverything: true,
      allowEverythingScope: scope,
      approved: [...state.approved, "*"],
    }
  }

  export function disableAllowEverything(state: State): State {
    return {
      ...state,
      allowEverything: false,
      allowEverythingScope: undefined,
      approved: state.approved.filter((p) => p !== "*"),
    }
  }

  export function isAllowed(state: State, permission: string): boolean {
    if (state.allowEverything) return true
    if (state.denied.includes(permission)) return false
    if (state.approved.includes("*")) return true
    return state.approved.includes(permission)
  }

  export function pending(state: State): string[] {
    if (state.allowEverything) return []
    // Return permissions that are neither approved nor denied
    return [] // Implement based on pending permission tracking
  }
}
```

### 3. Add Permission Routes for Allow Everything
**File**: `src/permission/routes.ts`
**Priority**: high
**Type**: feature
**Reason**: Server routes needed to support the allow-everything toggle from CLI and extension.

**New code**:
```typescript
import { Hono } from "hono"
import { Permission } from "./next"
import { Session } from "../session"
import { Effect } from "effect"

export const permissionRoutes = new Hono()

permissionRoutes.post("/allow-everything", async (c) => {
  const body = await c.req.json()
  const { sessionId, scope = "session" } = body

  if (!sessionId) {
    return c.json({ error: "sessionId required" }, 400)
  }

  const result = await Effect.runPromise(
    Effect.gen(function* () {
      const session = yield* Session.get(sessionId)
      const newPermissionState = Permission.allowEverything(
        session.permissionState ?? { approved: [], denied: [], allowEverything: false },
        scope
      )
      yield* Session.updatePermissions(sessionId, newPermissionState)
      return { success: true, state: newPermissionState }
    })
  )

  return c.json(result)
})

permissionRoutes.post("/disable-allow-everything", async (c) => {
  const body = await c.req.json()
  const { sessionId } = body

  if (!sessionId) {
    return c.json({ error: "sessionId required" }, 400)
  }

  const result = await Effect.runPromise(
    Effect.gen(function* () {
      const session = yield* Session.get(sessionId)
      const newPermissionState = Permission.disableAllowEverything(
        session.permissionState ?? { approved: [], denied: [], allowEverything: false }
      )
      yield* Session.updatePermissions(sessionId, newPermissionState)
      return { success: true, state: newPermissionState }
    })
  )

  return c.json(result)
})
```

### 4. Update Tool Registry with Named Tool Access
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: refactor
**Reason**: opencode refactored tool registry to provide typed access to specific tools (task, read) and moved tool descriptions into the registry.

**Current code**:
```typescript
export namespace ToolRegistry {
  type State = {
    custom: Tool.Def[]
    builtin: Tool.Def[]
  }

  export interface Interface {
    readonly ids: () => Effect.Effect<string[]>
    readonly all: () => Effect.Effect<Tool.Def[]>
    readonly tools: (model: {...}) => Effect.Effect<Tool.Def[]>
    readonly fromID: (id: string) => Effect.Effect<Tool.Def>
  }
}
```

**New code**:
```typescript
import { TaskTool } from "./task"
import { ReadTool } from "./read"
import { RecallTool } from "./recall"

export namespace ToolRegistry {
  type TaskDef = Tool.InferDef<typeof TaskTool>
  type ReadDef = Tool.InferDef<typeof ReadTool>

  type State = {
    custom: Tool.Def[]
    builtin: Tool.Def[]
    task: TaskDef
    read: ReadDef
  }

  export interface Interface {
    readonly ids: () => Effect.Effect<string[]>
    readonly all: () => Effect.Effect<Tool.Def[]>
    readonly named: () => Effect.Effect<{ task: TaskDef; read: ReadDef }>
    readonly tools: (model: {
      providerID: ProviderID
      modelID: ModelID
      agent: Agent.Info
    }) => Effect.Effect<Tool.Def[]>
  }

  export const create = (): Interface => {
    const builtinTools = [
      ReadTool,
      WriteTool,
      EditTool,
      GlobTool,
      GrepTool,
      TaskTool,
      RecallTool,
      WebFetchTool,
      SkillTool,
      TodoWriteTool,
    ]

    return {
      ids: () => Effect.succeed(builtinTools.map((t) => t.name)),
      all: () => Effect.succeed(builtinTools),
      named: () =>
        Effect.succeed({
          task: TaskTool as TaskDef,
          read: ReadTool as ReadDef,
        }),
      tools: (model) =>
        Effect.gen(function* () {
          const config = yield* Config.get()
          const filtered = builtinTools.filter((tool) => {
            // Filter based on model capabilities and agent permissions
            if (tool.name === "task" && model.agent.disableSubagents) {
              return false
            }
            return true
          })
          return filtered
        }),
    }
  }
}
```

### 5. Update Task Tool to Build from Agent Services
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: refactor
**Reason**: opencode refactored task tool to use agent services for construction, improving modularity and testability.

**Current code**:
```typescript
export const TaskTool = Tool.define("task", async () => {
  return {
    description: TaskDescription,
    parameters: TaskParameters,
    execute: async (input, context) => {
      // Direct implementation
    },
  }
})
```

**New code**:
```typescript
import { Effect, Layer } from "effect"
import { Agent } from "../agent/agent"
import { Session } from "../session"

export const TaskParameters = z.object({
  description: z.string().describe("Clear description of the subtask to delegate"),
  context: z.string().optional().describe("Additional context for the subtask"),
})

export const TaskTool = Tool.defineEffect(
  "task",
  {
    description: "Delegate a subtask to a sub-agent for parallel or specialized processing",
    parameters: TaskParameters,
  },
  (input, context) =>
    Effect.gen(function* () {
      const agent = yield* Agent.current()
      
      // Prevent primary agents from using task tool in subagent sessions
      if (context.isSubagent && agent.type === "primary") {
        return {
          success: false,
          error: "Primary agents cannot use task tool in subagent sessions",
        }
      }

      const subSession = yield* Session.createSubSession({
        parentId: context.sessionId,
        description: input.description,
        context: input.context,
      })

      const result = yield* Session.runToCompletion(subSession.id, {
        prompt: input.description,
        agent: agent.subagentConfig,
      })

      return {
        success: true,
        sessionId: subSession.id,
        result: result.summary,
      }
    })
)

// Layer for providing task tool with dependencies
export const TaskToolLive = Layer.effect(
  TaskTool,
  Effect.gen(function* () {
    const agentService = yield* Agent.Service
    const sessionService = yield* Session.Service
    return TaskTool
  })
)
```

### 6. Add Network Resilience and Resume After Sleep
**File**: `src/session/network.ts`
**Priority**: critical
**Type**: feature
**Reason**: kilocode added comprehensive network error handling with pause/resume capability for sessions during network outages or system sleep.

**New code**:
```typescript
import { Effect, Ref, Schedule, Duration } from "effect"
import { EventBus } from "../bus"

export namespace Network {
  export interface State {
    isOnline: boolean
    lastError?: Error
    retryCount: number
    maxRetries: number
    backoffMs: number
  }

  export const initialState: State = {
    isOnline: true,
    retryCount: 0,
    maxRetries: 5,
    backoffMs: 1000,
  }

  export class NetworkError extends Error {
    constructor(
      message: string,
      public readonly code: string,
      public readonly isRetryable: boolean = true
    ) {
      super(message)
      this.name = "NetworkError"
    }
  }

  export const isNetworkError = (error: unknown): error is NetworkError => {
    if (error instanceof NetworkError) return true
    if (error instanceof Error) {
      const networkCodes = ["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN"]
      return networkCodes.some((code) => error.message.includes(code))
    }
    return false
  }

  export const withRetry = <A, E, R>(
    effect: Effect.Effect<A, E, R>,
    options: { maxRetries?: number; baseDelay?: number } = {}
  ): Effect.Effect<A, E | NetworkError, R> => {
    const { maxRetries = 5, baseDelay = 1000 } = options

    return effect.pipe(
      Effect.retry(
        Schedule.exponential(Duration.millis(baseDelay)).pipe(
          Schedule.compose(Schedule.recurs(maxRetries)),
          Schedule.whileInput((error: E) => isNetworkError(error))
        )
      ),
      Effect.catchAll((error) => {
        if (isNetworkError(error)) {
          return Effect.fail(
            new NetworkError(
              `Network request failed after ${maxRetries} retries: ${error.message}`,
              "MAX_RETRIES_EXCEEDED",
              false
            )
          )
        }
        return Effect.fail(error)
      })
    )
  }

  export const waitForNetwork = Effect.gen(function* () {
    const bus = yield* EventBus.get()
    
    yield* bus.publish({
      type: "network.waiting",
      timestamp: Date.now(),
    })

    // Poll for network availability
    yield* Effect.repeat(
      Effect.gen(function* () {
        const isOnline = yield* checkConnectivity()
        if (!isOnline) {
          yield* Effect.sleep(Duration.seconds(5))
          return yield* Effect.fail("offline")
        }
        return true
      }),
      Schedule.recurWhile((result) => result !== true)
    )

    yield* bus.publish({
      type: "network.restored",
      timestamp: Date.now(),
    })
  })

  const checkConnectivity = Effect.tryPromise({
    try: async () => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      try {
        await fetch("https://api.anthropic.com/health", {
          method: "HEAD",
          signal: controller.signal,
        })
        return true
      } finally {
        clearTimeout(timeout)
      }
{"prompt_tokens":44335,"completion_tokens":4096,"total_tokens":48431}

[Session: 73e8fc49-9017-437f-915b-27ebbf064e1a]
[Messages: 2, Tokens: 48431]
