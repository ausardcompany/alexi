# Update Plan for Alexi

Generated: 2026-04-04
Based on upstream commits: opencode 500dcfc..00fa68b (21 commits), kilocode 3b794539..cb0c58c0 (6 commits)

## Summary
- Total changes planned: 8
- Critical: 0 | High: 4 | Medium: 3 | Low: 1

## Changes

### 1. Refactor Tool Definition to Support Effect-based Tools
**File**: `src/tool/tool.ts`
**Priority**: high
**Type**: refactor
**Reason**: Upstream opencode has introduced `Tool.defineEffect` pattern allowing tools to be built from Effect services with proper dependency injection. This enables better testability and composition of tools with their required services.

**Current code** (if modifying):
```typescript
export namespace Tool {
  // ... existing types ...

  export type InferParameters<T extends Info> = T extends Info<infer P> ? z.infer<P> : never
  export type InferMetadata<T extends Info> = T extends Info<any, infer M> ? M : never

  export function define<Parameters extends z.ZodType, Result extends Metadata>(
    id: string,
    def: Def<Parameters, Result> | ((ctx?: InitContext) => Promise<Def<Parameters, Result>>),
  ): Info<Parameters, Result> {
    // existing implementation
  }
}
```

**New code**:
```typescript
import { Effect } from "effect"

export namespace Tool {
  // ... existing types ...

  export type InferParameters<T> =
    T extends Info<infer P, any>
      ? z.infer<P>
      : T extends Effect.Effect<Info<infer P, any>, any, any>
        ? z.infer<P>
        : never
  
  export type InferMetadata<T> =
    T extends Info<any, infer M> 
      ? M 
      : T extends Effect.Effect<Info<any, infer M>, any, any> 
        ? M 
        : never

  function wrap<Parameters extends z.ZodType, Result extends Metadata>(
    id: string,
    init: ((ctx?: InitContext) => Promise<Def<Parameters, Result>>) | Def<Parameters, Result>,
  ) {
    return async (initCtx?: InitContext) => {
      const toolInfo = init instanceof Function ? await init(initCtx) : { ...init }
      const execute = toolInfo.execute
      toolInfo.execute = async (args, ctx) => {
        try {
          toolInfo.parameters.parse(args)
        } catch (error) {
          if (error instanceof z.ZodError && toolInfo.formatValidationError) {
            throw new Error(toolInfo.formatValidationError(error), { cause: error })
          }
          throw new Error(
            `The ${id} tool was called with invalid arguments: ${error}.\nPlease rewrite the input so it satisfies the expected schema.`,
            { cause: error },
          )
        }
        const result = await execute(args, ctx)
        if (result.metadata.truncated !== undefined) {
          return result
        }
        const truncated = await Truncate.output(result.output, {}, initCtx?.agent)
        return {
          ...result,
          output: truncated.output,
          metadata: {
            ...result.metadata,
            truncated: truncated.truncated,
          },
        }
      }
      return toolInfo
    }
  }

  export function define<Parameters extends z.ZodType, Result extends Metadata>(
    id: string,
    def: Def<Parameters, Result> | ((ctx?: InitContext) => Promise<Def<Parameters, Result>>),
  ): Info<Parameters, Result> {
    return {
      id,
      init: wrap(id, def),
    }
  }

  /**
   * Define a tool that depends on Effect services.
   * The effect should yield the tool definition when provided with its dependencies.
   */
  export function defineEffect<
    Parameters extends z.ZodType,
    Result extends Metadata,
    R,
  >(
    id: string,
    effect: Effect.Effect<Def<Parameters, Result>, never, R>,
  ): Effect.Effect<Info<Parameters, Result>, never, R> {
    return Effect.gen(function* () {
      const def = yield* effect
      return {
        id,
        init: wrap(id, def),
      }
    })
  }
}
```

---

### 2. Refactor QuestionTool to Use Effect-based Definition
**File**: `src/tool/question.ts`
**Priority**: high
**Type**: refactor
**Reason**: Upstream has refactored QuestionTool to use the new `Tool.defineEffect` pattern, making it depend on the Question service through Effect's dependency injection rather than direct imports. This improves testability and decoupling.

**Current code** (if modifying):
```typescript
import z from "zod"
import { Tool } from "./tool"
import { Question } from "../question"
import DESCRIPTION from "./question.txt"

export const QuestionTool = Tool.define("question", {
  description: DESCRIPTION,
  parameters: z.object({
    questions: z.array(Question.Info.omit({ custom: true })).describe("Questions to ask"),
  }),
  async execute(params, ctx) {
    const answers = await Question.ask({
      sessionID: ctx.sessionID,
      questions: params.questions,
      tool: ctx.callID ? { messageID: ctx.messageID, callID: ctx.callID } : undefined,
    })

    function format(answer: Question.Answer | undefined) {
      if (!answer?.length) return "Unanswered"
      return answer.join(", ")
    }

    const formatted = params.questions.map((q, i) => `"${q.question}"="${format(answers[i])}"`).join(", ")

    return {
      title: `Asked ${params.questions.length} question${params.questions.length > 1 ? "s" : ""}`,
      output: `User has answered your questions: ${formatted}. You can now continue with the user's answers in mind.`,
      metadata: {
        answers,
      },
    }
  },
})
```

**New code**:
```typescript
import z from "zod"
import { Effect } from "effect"
import { Tool } from "./tool"
import { Question } from "../question"
import DESCRIPTION from "./question.txt"

const parameters = z.object({
  questions: z.array(Question.Info.omit({ custom: true })).describe("Questions to ask"),
})

type Metadata = {
  answers: Question.Answer[]
}

export const QuestionTool = Tool.defineEffect<typeof parameters, Metadata, Question.Service>(
  "question",
  Effect.gen(function* () {
    const question = yield* Question.Service

    return {
      description: DESCRIPTION,
      parameters,
      async execute(params: z.infer<typeof parameters>, ctx: Tool.Context<Metadata>) {
        const answers = await question
          .ask({
            sessionID: ctx.sessionID,
            questions: params.questions,
            tool: ctx.callID ? { messageID: ctx.messageID, callID: ctx.callID } : undefined,
          })

        function format(answer: Question.Answer | undefined) {
          if (!answer?.length) return "Unanswered"
          return answer.join(", ")
        }

        const formatted = params.questions
          .map((q, i) => `"${q.question}"="${format(answers[i])}"`)
          .join(", ")

        return {
          title: `Asked ${params.questions.length} question${params.questions.length > 1 ? "s" : ""}`,
          output: `User has answered your questions: ${formatted}. You can now continue with the user's answers in mind.`,
          metadata: {
            answers,
          },
        }
      },
    }
  }),
)
```

---

### 3. Refactor TodoWriteTool to Use Effect-based Definition
**File**: `src/tool/todo.ts`
**Priority**: high
**Type**: refactor
**Reason**: Upstream has refactored TodoWriteTool to use `Tool.defineEffect` pattern with dependency injection for the Todo service. This aligns with the new architecture for building tools from Effect services.

**Current code** (if modifying):
```typescript
import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION_WRITE from "./todowrite.txt"
import { Todo } from "../session/todo"

export const TodoWriteTool = Tool.define("todowrite", {
  description: DESCRIPTION_WRITE,
  parameters: z.object({
    todos: z.array(z.object(Todo.Info.shape)).describe("The updated todo list"),
  }),
  async execute(params, ctx) {
    await ctx.ask({
      permission: "todowrite",
      patterns: ["*"],
      always: ["*"],
      metadata: {},
    })

    await Todo.update({
      sessionID: ctx.sessionID,
      todos: params.todos,
    })
    return {
      title: `${params.todos.filter((x) => x.status !== "completed").length} todos`,
      output: JSON.stringify(params.todos, null, 2),
      metadata: {
        todos: params.todos,
      },
    }
  },
})
```

**New code**:
```typescript
import z from "zod"
import { Effect } from "effect"
import { Tool } from "./tool"
import DESCRIPTION_WRITE from "./todowrite.txt"
import { Todo } from "../session/todo"

const parameters = z.object({
  todos: z.array(z.object(Todo.Info.shape)).describe("The updated todo list"),
})

type Metadata = {
  todos: Todo.Info[]
}

export const TodoWriteTool = Tool.defineEffect<typeof parameters, Metadata, Todo.Service>(
  "todowrite",
  Effect.gen(function* () {
    const todo = yield* Todo.Service

    return {
      description: DESCRIPTION_WRITE,
      parameters,
      async execute(params: z.infer<typeof parameters>, ctx: Tool.Context<Metadata>) {
        await ctx.ask({
          permission: "todowrite",
          patterns: ["*"],
          always: ["*"],
          metadata: {},
        })

        await todo.update({
          sessionID: ctx.sessionID,
          todos: params.todos,
        })
        
        return {
          title: `${params.todos.filter((x) => x.status !== "completed").length} todos`,
          output: JSON.stringify(params.todos, null, 2),
          metadata: {
            todos: params.todos,
          },
        }
      },
    }
  }),
)
```

---

### 4. Update ToolRegistry to Resolve Effect-based Tools
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: refactor
**Reason**: The registry needs to be updated to handle the new Effect-based tool definitions. It should resolve tools through their Effect dependencies and expose named tools (task, read) for direct access.

**Current code** (if modifying):
```typescript
export namespace ToolRegistry {
  // ... existing code ...

  export interface Interface {
    readonly register: (tool: Tool.Info) => Effect.Effect<void>
    readonly ids: () => Effect.Effect<string[]>
    readonly tools: (
      model: { providerID: ProviderID; modelID: ModelID },
      agent?: Agent.Info,
    ) => Effect.Effect<Tool.Info[]>
  }
  
  // ... rest of implementation ...
}
```

**New code**:
```typescript
import { Effect, Layer, ServiceMap } from "effect"
import { Question } from "../question"
import { Todo } from "../session/todo"

export namespace ToolRegistry {
  const log = Log.create({ service: "tool.registry" })

  interface State {
    tools: Map<string, Tool.Info>
  }

  export interface Interface {
    readonly ids: () => Effect.Effect<string[]>
    readonly named: {
      task: Tool.Info
      read: Tool.Info
    }
    readonly tools: (
      model: { providerID: ProviderID; modelID: ModelID },
      agent?: Agent.Info,
    ) => Effect.Effect<Tool.Info[]>
  }

  export class Service extends ServiceMap.Service<Service, Interface>()("@opencode/ToolRegistry") {}

  export const layer: Layer.Layer<Service, never, Config.Service | Plugin.Service | Question.Service | Todo.Service> = Layer.effect(
    Service,
    Effect.gen(function* () {
      const config = yield* Config.Service
      const plugin = yield* Plugin.Service
      const questionService = yield* Question.Service
      const todoService = yield* Todo.Service

      // Resolve effect-based tools with their dependencies
      const questionTool = yield* QuestionTool.pipe(
        Effect.provideService(Question.Service, questionService)
      )
      const todoWriteTool = yield* TodoWriteTool.pipe(
        Effect.provideService(Todo.Service, todoService)
      )

      const state = yield* InstanceState.make<State>(
        Effect.fn("ToolRegistry.state")(function* (ctx) {
          const builtinTools = new Map<string, Tool.Info>()
          
          // Register effect-based tools
          builtinTools.set(questionTool.id, questionTool)
          builtinTools.set(todoWriteTool.id, todoWriteTool)
          
          // Register other static tools
          const staticTools = [
            ReadTool,
            WriteTool,
            EditTool,
            // ... other tools
          ]
          
          for (const tool of staticTools) {
            builtinTools.set(tool.id, tool)
          }

          const custom: Tool.Info[] = []

          function fromPlugin(id: string, def: ToolDefinition): Tool.Info {
            return {
              id,
              init: async (initCtx) => ({
                parameters: z.object(def.args),
                description: def.description,
                execute: async (args, toolCtx) => {
                  const pluginCtx = {
                    ...toolCtx,
                    directory: ctx.directory,
                  }
                  return def.execute(args, pluginCtx)
                },
              }),
            }
          }

          // Load plugin tools
          const plugins = yield* plugin.list()
          for (const p of plugins) {
            if (p.tools) {
              for (const [toolId, toolDef] of Object.entries(p.tools)) {
                custom.push(fromPlugin(`${p.id}:${toolId}`, toolDef))
              }
            }
          }

          return {
            tools: new Map([...builtinTools, ...custom.map(t => [t.id, t] as const)]),
          }
        }),
      )

      return Service.make({
        ids: () => Effect.gen(function* () {
          const s = yield* state.get
          return Array.from(s.tools.keys())
        }),
        named: {
          task: todoWriteTool,
          read: yield* state.get.pipe(Effect.map(s => s.tools.get("read")!)),
        },
        tools: (model, agent) => Effect.gen(function* () {
          const s = yield* state.get
          const cfg = yield* config.get
          
          // Filter tools based on model capabilities and agent configuration
          const available: Tool.Info[] = []
          for (const tool of s.tools.values()) {
            // Apply filtering logic based on model and agent
            available.push(tool)
          }
          
          return available
        }),
      })
    }),
  )
}
```

---

### 5. Update Question Tool Tests for Effect-based Architecture
**File**: `src/tool/question.test.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Tests need to be updated to work with the new Effect-based tool definitions, using proper service mocking through Effect layers rather than direct function spying.

**Current code** (if modifying):
```typescript
import { describe, expect, test, spyOn, beforeEach, afterEach } from "bun:test"
import { z } from "zod"
import { QuestionTool } from "../../src/tool/question"
import
{"prompt_tokens":7742,"completion_tokens":4096,"total_tokens":11838}

[Session: 5adb9ce1-21ed-4630-b96e-7cf87d4a5533]
[Messages: 2, Tokens: 11838]
