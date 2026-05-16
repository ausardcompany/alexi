# Update Plan for Alexi

Generated: 2026-05-15
Based on upstream commits: kilocode 8de6c2ea8..c60006514 (68 commits), opencode 202cc86..27ac53a (69 commits)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 6 | Medium: 7 | Low: 3

## Changes

### 1. Add Background Subagents Support (Task Tool Enhancement)
**File**: `src/tool/task.ts`
**Priority**: critical
**Type**: feature
**Reason**: OpenCode added experimental background subagents capability (#27084) which significantly enhances the task tool with status tracking and background execution support.

**Current code** (if modifying):
```typescript
// Existing task tool implementation
export const TaskTool = {
  name: "task",
  description: "Create and manage tasks",
  // ... basic implementation
}
```

**New code**:
```typescript
import { Effect, Schema } from "effect"
import { RuntimeFlags } from "../effect/runtime-flags"

export const TaskTool = {
  name: "task",
  description: "Create and manage tasks with optional background execution",
  
  parameters: Schema.Struct({
    description: Schema.String.pipe(Schema.description("Task description")),
    prompt: Schema.String.pipe(Schema.description("Prompt for the task")),
    background: Schema.optional(Schema.Boolean).pipe(
      Schema.description("Run task in background (experimental)")
    ),
  }),

  execute: (params: { description: string; prompt: string; background?: boolean }) =>
    Effect.gen(function* () {
      const flags = yield* RuntimeFlags.Service
      const enableBackground = yield* flags.get("OPENCODE_EXPERIMENTAL_BACKGROUND_TASKS")
      
      if (params.background && enableBackground) {
        // Background task execution
        return yield* executeBackgroundTask(params)
      }
      
      // Standard foreground task execution
      return yield* executeForegroundTask(params)
    }),
}

const executeBackgroundTask = (params: { description: string; prompt: string }) =>
  Effect.gen(function* () {
    const taskId = yield* createTaskId()
    // Queue task for background processing
    yield* queueBackgroundTask({
      id: taskId,
      description: params.description,
      prompt: params.prompt,
      status: "queued",
    })
    return { taskId, status: "queued", message: "Task queued for background execution" }
  })

const executeForegroundTask = (params: { description: string; prompt: string }) =>
  Effect.gen(function* () {
    // Existing foreground task logic
    const taskId = yield* createTaskId()
    const result = yield* runTask(params)
    return { taskId, status: "completed", result }
  })
```

### 2. Add Task Status Tool
**File**: `src/tool/task_status.ts` (new file)
**Priority**: critical
**Type**: feature
**Reason**: New tool added in OpenCode to query status of background tasks, essential for the background subagents feature.

**New code**:
```typescript
import { Effect, Schema } from "effect"
import { Tool } from "./registry"

export const TaskStatusTool: Tool = {
  name: "task_status",
  description: "Query the status of a background task",
  
  parameters: Schema.Struct({
    taskId: Schema.String.pipe(Schema.description("The ID of the task to query")),
  }),

  execute: (params: { taskId: string }) =>
    Effect.gen(function* () {
      const taskStore = yield* TaskStore.Service
      const task = yield* taskStore.get(params.taskId)
      
      if (!task) {
        return {
          found: false,
          message: `Task ${params.taskId} not found`,
        }
      }
      
      return {
        found: true,
        taskId: task.id,
        status: task.status,
        description: task.description,
        result: task.result,
        error: task.error,
        startedAt: task.startedAt,
        completedAt: task.completedAt,
      }
    }),
}

// Task status types
export type TaskStatus = "queued" | "running" | "completed" | "failed" | "cancelled"

export interface TaskInfo {
  id: string
  status: TaskStatus
  description: string
  result?: unknown
  error?: string
  startedAt?: Date
  completedAt?: Date
}
```

### 3. Add Task Status Tool Description
**File**: `src/tool/task_status.txt` (new file)
**Priority**: high
**Type**: feature
**Reason**: Tool description file for task_status tool, following OpenCode pattern.

**New code**:
```text
Query the status of a background task.

Use this tool to check on the progress of tasks that were started in the background.
Returns the current status, any results if completed, or error information if failed.

Parameters:
- taskId: The unique identifier of the task to query

Returns:
- found: Whether the task was found
- taskId: The task identifier
- status: Current status (queued, running, completed, failed, cancelled)
- description: The task description
- result: Task result if completed
- error: Error message if failed
- startedAt: When the task started
- completedAt: When the task completed
```

### 4. Enhance Tool Registry with Invalid Export Handling
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: bugfix
**Reason**: OpenCode fixed issue where invalid custom tool exports could crash the system (commit 7a012ca).

**Current code** (if modifying):
```typescript
export const loadCustomTools = (toolsPath: string) =>
  Effect.gen(function* () {
    const files = yield* readToolFiles(toolsPath)
    const tools = files.map((file) => require(file))
    return tools
  })
```

**New code**:
```typescript
import { Effect, Option } from "effect"

export class InvalidToolExportError extends Error {
  readonly _tag = "InvalidToolExportError"
  constructor(
    readonly path: string,
    readonly reason: string
  ) {
    super(`Invalid tool export at ${path}: ${reason}`)
  }
}

export const loadCustomTools = (toolsPath: string) =>
  Effect.gen(function* () {
    const files = yield* readToolFiles(toolsPath)
    const tools: Tool[] = []
    
    for (const file of files) {
      const result = yield* Effect.try({
        try: () => require(file),
        catch: (error) => new InvalidToolExportError(file, String(error)),
      }).pipe(Effect.option)
      
      if (Option.isNone(result)) {
        yield* Effect.logWarning(`Skipping invalid tool export: ${file}`)
        continue
      }
      
      const exported = result.value
      
      // Validate tool structure
      if (!isValidToolExport(exported)) {
        yield* Effect.logWarning(`Invalid tool structure in ${file}, skipping`)
        continue
      }
      
      tools.push(exported)
    }
    
    return tools
  })

const isValidToolExport = (exported: unknown): exported is Tool => {
  if (!exported || typeof exported !== "object") return false
  const obj = exported as Record<string, unknown>
  return (
    typeof obj.name === "string" &&
    typeof obj.description === "string" &&
    typeof obj.execute === "function"
  )
}
```

### 5. Fix Shell Tool Stream Truncation
**File**: `src/tool/shell.ts`
**Priority**: high
**Type**: bugfix
**Reason**: OpenCode fixed shell truncation stream not being properly closed (commit e26abd8), which could cause resource leaks.

**Current code** (if modifying):
```typescript
const truncateOutput = (output: string, maxLength: number) => {
  if (output.length <= maxLength) return output
  return output.slice(0, maxLength) + "\n... (truncated)"
}
```

**New code**:
```typescript
import { Effect, Stream, Scope } from "effect"

const truncateOutput = (output: string, maxLength: number) => {
  if (output.length <= maxLength) return output
  return output.slice(0, maxLength) + "\n... (truncated)"
}

export const createTruncatingStream = (maxLength: number) =>
  Effect.gen(function* () {
    let totalLength = 0
    let truncated = false
    const chunks: string[] = []
    
    return {
      write: (chunk: string) =>
        Effect.gen(function* () {
          if (truncated) return
          
          if (totalLength + chunk.length > maxLength) {
            const remaining = maxLength - totalLength
            chunks.push(chunk.slice(0, remaining))
            chunks.push("\n... (truncated)")
            truncated = true
            totalLength = maxLength
          } else {
            chunks.push(chunk)
            totalLength += chunk.length
          }
        }),
      
      getOutput: () => chunks.join(""),
      
      close: () =>
        Effect.gen(function* () {
          // Ensure stream resources are released
          chunks.length = 0
          yield* Effect.logDebug("Shell truncation stream closed")
        }),
    }
  })

export const executeShellWithTruncation = (
  command: string,
  options: { maxOutputLength: number; timeout?: number }
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const stream = yield* createTruncatingStream(options.maxOutputLength)
      
      yield* Effect.addFinalizer(() => stream.close())
      
      const result = yield* executeShell(command, {
        onStdout: (chunk) => stream.write(chunk),
        onStderr: (chunk) => stream.write(chunk),
        timeout: options.timeout,
      })
      
      return {
        ...result,
        output: stream.getOutput(),
      }
    })
  )
```

### 6. Add Core Event System
**File**: `src/core/event.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: OpenCode added Effect-native core event system (#27415) for better event handling and type safety.

**New code**:
```typescript
import { Context, Effect, Layer, PubSub, Schema, Stream } from "effect"
import { Identifier } from "../util/identifier"

export const EventID = Schema.String.pipe(Schema.brand("Event.ID"))
export type EventID = typeof EventID.Type

export const createEventID = (): EventID => 
  EventID.make(`evt_${Identifier.ascending()}`)

export type EventDefinition<
  Type extends string = string,
  DataSchema extends Schema.Schema.Any = Schema.Schema.Any
> = {
  readonly type: Type
  readonly version?: number
  readonly aggregate?: string
  readonly data: DataSchema
}

export type EventPayload<D extends EventDefinition = EventDefinition> = {
  readonly id: EventID
  readonly type: D["type"]
  readonly data: Schema.Schema.Type<D["data"]>
  readonly version?: number
  readonly metadata?: Record<string, unknown>
  readonly timestamp: Date
}

const eventRegistry = new Map<string, EventDefinition>()

export const defineEvent = <
  const Type extends string,
  Fields extends Schema.Struct.Fields
>(input: {
  readonly type: Type
  readonly version?: number
  readonly aggregate?: string
  readonly schema: Fields
}): EventDefinition<Type, Schema.Struct<Fields>> => {
  const definition: EventDefinition<Type, Schema.Struct<Fields>> = {
    type: input.type,
    version: input.version,
    aggregate: input.aggregate,
    data: Schema.Struct(input.schema),
  }
  
  const key = input.version ? `${input.type}@${input.version}` : input.type
  eventRegistry.set(key, definition as EventDefinition)
  
  return definition
}

export interface EventService {
  readonly publish: <D extends EventDefinition>(
    definition: D,
    data: Schema.Schema.Type<D["data"]>
  ) => Effect.Effect<EventPayload<D>>
  
  readonly subscribe: <D extends EventDefinition>(
    definition: D
  ) => Stream.Stream<EventPayload<D>>
  
  readonly subscribeAll: () => Stream.Stream<EventPayload>
}

export class EventServiceImpl extends Context.Tag("@alexi/core/EventService")<
  EventServiceImpl,
  EventService
>() {}

export const EventServiceLive = Layer.effect(
  EventServiceImpl,
  Effect.gen(function* () {
    const pubsub = yield* PubSub.unbounded<EventPayload>()
    
    return {
      publish: <D extends EventDefinition>(
        definition: D,
        data: Schema.Schema.Type<D["data"]>
      ) =>
        Effect.gen(function* () {
          const payload: EventPayload<D> = {
            id: createEventID(),
            type: definition.type,
            data,
            version: definition.version,
            timestamp: new Date(),
          }
          
          yield* PubSub.publish(pubsub, payload as EventPayload)
          return payload
        }),
      
      subscribe: <D extends EventDefinition>(definition: D) =>
        Stream.fromPubSub(pubsub).pipe(
          Stream.filter((event): event is EventPayload<D> => 
            event.type === definition.type
          )
        ),
      
      subscribeAll: () => Stream.fromPubSub(pubsub),
    }
  })
)
```

### 7. Add Runtime Flags System
**File**: `src/effect/runtime-flags.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: OpenCode migrated multiple flags to a centralized RuntimeFlags system for better configuration management.

**New code**:
```typescript
import { Context, Effect, Layer, Ref, Schema } from "effect"

export const RuntimeFlagSchema = Schema.Struct({
  OPENCODE_EXPERIMENTAL_BACKGROUND_TASKS: Schema.Boolean.pipe(Schema.optional),
  OPENCODE_EXPERIMENTAL_ICON_DISCOVERY: Schema.Boolean.pipe(Schema.optional),
  OPENCODE_ENABLE_EXPERIMENTAL_MODELS: Schema.Boolean.pipe(Schema.optional),
  OPENCODE_AUTO_SHARE: Schema.Boolean.pipe(Schema.optional),
  OPENCODE_DISABLE_CLAUDE_CODE_SKILLS: Schema.Boolean.pipe(Schema.optional),
  OPENCODE_DISABLE_CLAUDE_CODE_PROMPT: Schema.Boolean.pipe(Schema.optional),
  OPENCODE_DISABLE_EXTERNAL_SKILLS: Schema.Boolean.pipe(Schema.optional),
  OPENCODE_BASH_TIMEOUT: Schema.Number.pipe(Schema.optional),
  OPENCODE_OUTPUT_TOKEN_MAX: Schema.Number.pipe(Schema.optional),
})

export type RuntimeFlags = Schema.Schema.Type<typeof RuntimeFlagSchema>
export type RuntimeFlagKey = keyof RuntimeFlags

const parseEnvBoolean = (value: string | undefined): boolean | undefined => {
  if (value === undefined) return undefined
  return value === "true" || value === "1"
}

const parseEnvNumber = (value: string | undefined): number | undefined => {
  if (value === undefined) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const loadFromEnv = (): RuntimeFlags => ({
  OPENCODE_EXPERIMENTAL_BACKGROUND_TASKS: parseEnvBoolean(
    process.env.OPENCODE_EXPERIMENTAL_BACKGROUND_TASKS
  ),
  OPENCODE_EXPERIMENTAL_ICON_DISCOVERY: parseEnvBoolean(
    process.env.OPENCODE_EXPERIMENTAL_ICON_DISCOVERY
  ),
  OPENCODE_ENABLE_EXPERIMENTAL_MODELS: parseEnvBoolean(
    process.env.OPENCODE_ENABLE_EXPERIMENTAL_MODELS
  ),
  OPENCODE_AUTO_SHARE: parseEnvBoolean(process.env.OPENCODE_AUTO_SHARE),
  OPENCODE_DISABLE_CLAUDE_CODE_
{"prompt_tokens":19785,"completion_tokens":4096,"total_tokens":23881}

[Session: fd1507ea-3428-408f-aa3e-b38f02e300f9]
[Messages: 2, Tokens: 23881]
