# Upstream Changes Report
Generated: 2026-04-04 07:03:22

## Summary
- kilocode: 6 commits, 30 files changed
- opencode: 21 commits, 62 files changed

## kilocode Changes (3b794539..cb0c58c0)

### Commits

- cb0c58c0 - Merge pull request #8281 from Kilo-Org/docs/add-scheduled-triggers-documentation (Andrew Storms, 2026-04-03)
- 7f8c5ac8 - docs: fix scheduled trigger example to use weekly frequency for weekdays (St0rmz1, 2026-04-03)
- 6fba6179 - docs: add scheduled triggers documentation (St0rmz1, 2026-04-03)
- 4bebc24e - feat(vscode): add Claude Code compatibility toggle in Agent Behaviour settings (#8230) (Marius, 2026-04-03)
- dd2b9297 - Merge pull request #8258 from Kilo-Org/session/agent_bfb21c74-e11d-4bf7-930d-dc2fce46bfe5 (Mark IJbema, 2026-04-03)
- 25874277 - fix(cli): exclude /global/health from request logging (kiloconnect[bot], 2026-04-03)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `packages/kilo-docs/lib/nav/kiloclaw.ts` (+1, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+33, -13)
- `packages/kilo-docs/pages/kiloclaw/triggers/index.md` (+14, -9)
- `packages/kilo-docs/pages/kiloclaw/triggers/scheduled.md` (+123, -0)
- `packages/kilo-docs/pages/kiloclaw/triggers/webhooks.md` (+3, -1)
- `packages/kilo-vscode/package.json` (+5, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+14, -0)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+34, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+11, -0)
- `packages/opencode/src/server/server.ts` (+2, -1)

### Key Diffs

(no key diffs to show)

## opencode Changes (500dcfc..00fa68b)

### Commits

- 00fa68b - fix(ci): create JUnit output dirs before tests (#20959) (Kit Langton, 2026-04-03)
- 288eb04 - perf(opencode): batch snapshot diffFull blob reads (#20752) (Kit Langton, 2026-04-04)
- 59ca454 - refactor(provider): stop custom loaders using facades (#20776) (Kit Langton, 2026-04-04)
- 650d0db - chore: generate (opencode-agent[bot], 2026-04-03)
- a5ec741 - notes on v2 (#20941) (Sebastian, 2026-04-04)
- fff9863 - chore: rm models snapshot (#20929) (Aiden Cline, 2026-04-03)
- c72642d - test(ci): publish unit reports in actions (#20547) (Kit Langton, 2026-04-03)
- f2d4ced - refactor(effect): build todowrite tool from Todo service (#20789) (Kit Langton, 2026-04-03)
- ae7e2eb - chore(app): remove queued follow-ups for now (Adam, 2026-04-03)
- a32ffab - fix(app): show correct submit icon when typing follow up (Adam, 2026-04-03)
- a4e75a0 - chore: generate (opencode-agent[bot], 2026-04-03)
- 35350b1 - feat: restore git-backed review modes (#20845) (Shoubhit Dash, 2026-04-03)
- 263dcf7 - fix: restore prompt focus after footer selection (#20841) (Shoubhit Dash, 2026-04-03)
- 7994dce - refactor(effect): resolve built tools through the registry (#20787) (Kit Langton, 2026-04-03)
- fbfa148 - fix(app): hide default session timestamps (#20892) (Shoubhit Dash, 2026-04-03)
- 9d57f21 - feat(ui): redesign modified files section in session turn (#20348) (Shoubhit Dash, 2026-04-03)
- 3deee3a - fix(session): disable todo dock auto-scroll (#20840) (Shoubhit Dash, 2026-04-03)
- 2002f08 - fix(prompt): unmount model controls in shell mode (#20886) (Shoubhit Dash, 2026-04-03)
- c307505 - fix(session): delay jump-to-bottom button (#20853) (Shoubhit Dash, 2026-04-03)
- 6359d00 - fix(core): fix restoring earlier messages in a reverted chain (#20780) (Nate Williams, 2026-04-03)
- b969066 - electron: better menus (#20878) (Brendan Allan, 2026-04-03)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/question.ts` (+36, -23)
- `packages/opencode/src/tool/registry.ts` (+166, -140)
- `packages/opencode/src/tool/todo.ts` (+40, -23)
- `packages/opencode/src/tool/tool.ts` (+56, -36)
- `packages/opencode/test/tool/question.test.ts` (+63, -45)
- `packages/opencode/test/tool/tool-define.test.ts` (+10, -20)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.github/workflows/test.yml` (+31, -4)
- `packages/app/e2e/prompt/prompt-footer-focus.spec.ts` (+88, -0)
- `packages/app/e2e/prompt/prompt-shell.spec.ts` (+22, -10)
- `packages/app/package.json` (+1, -0)
- `packages/app/src/components/dialog-select-model.tsx` (+20, -15)
- `packages/app/src/components/prompt-input.tsx` (+113, -87)
- `packages/app/src/components/settings-general.tsx` (+0, -23)
- `packages/app/src/context/global-sync/bootstrap.ts` (+1, -1)
- `packages/app/src/context/global-sync/event-reducer.test.ts` (+6, -4)
- `packages/app/src/context/global-sync/event-reducer.ts` (+2, -2)
- `packages/app/src/context/settings.tsx` (+10, -2)
- `packages/app/src/i18n/en.ts` (+2, -0)
- `packages/app/src/pages/layout/sidebar-items.tsx` (+41, -36)
- `packages/app/src/pages/session.tsx` (+240, -43)
- `packages/app/src/pages/session/composer/session-todo-dock.tsx` (+3, -54)
- `packages/app/src/pages/session/message-timeline.tsx` (+12, -10)
- `packages/app/src/pages/session/session-side-panel.tsx` (+22, -36)
- `packages/app/src/pages/session/use-session-commands.tsx` (+1, -5)
- `packages/app/src/utils/session-title.ts` (+7, -0)
- `packages/desktop-electron/src/main/menu.ts` (+27, -8)
- `packages/opencode/package.json` (+1, -0)
- `packages/opencode/specs/v2.md` (+14, -0)
- `packages/opencode/src/cli/cmd/github.ts` (+5, -5)
- `packages/opencode/src/cli/cmd/pr.ts` (+4, -4)
- `packages/opencode/src/cli/cmd/run.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+1, -1)
- `packages/opencode/src/file/index.ts` (+7, -7)
- `packages/opencode/src/file/watcher.ts` (+2, -2)
- `packages/opencode/src/git/index.ts` (+303, -0)
- `packages/opencode/src/project/vcs.ts` (+149, -33)
- `packages/opencode/src/provider/models-snapshot.ts` (+0, -60410)
- `packages/opencode/src/provider/provider.ts` (+592, -585)
- `packages/opencode/src/question/index.ts` (+1, -1)
- `packages/opencode/src/server/instance.ts` (+31, -2)
- `packages/opencode/src/session/prompt.ts` (+4, -4)
- `packages/opencode/src/session/revert.ts` (+1, -0)
- `packages/opencode/src/session/todo.ts` (+1, -1)
- `packages/opencode/src/snapshot/index.ts` (+178, -23)
- `packages/opencode/src/storage/storage.ts` (+2, -2)
- `packages/opencode/src/util/git.ts` (+0, -35)
- `packages/opencode/src/worktree/index.ts` (+10, -41)
- `packages/opencode/test/git/git.test.ts` (+128, -0)
- `packages/opencode/test/project/vcs.test.ts` (+122, -10)
- `packages/opencode/test/provider/provider.test.ts` (+210, -0)
- `packages/opencode/test/session/prompt-effect.test.ts` (+9, -1)
- `packages/opencode/test/session/revert-compact.test.ts` (+184, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+9, -1)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+92, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+33, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+21, -0)
- `packages/sdk/openapi.json` (+56, -0)
- `packages/ui/src/components/session-review.tsx` (+17, -18)
- `packages/ui/src/components/session-turn.css` (+28, -36)
- `packages/ui/src/components/session-turn.tsx` (+102, -107)
- `packages/ui/src/i18n/en.ts` (+6, -0)
- `turbo.json` (+10, -0)

### Key Diffs

#### packages/opencode/src/tool/question.ts
```diff
diff --git a/packages/opencode/src/tool/question.ts b/packages/opencode/src/tool/question.ts
index a288754..dd99688 100644
--- a/packages/opencode/src/tool/question.ts
+++ b/packages/opencode/src/tool/question.ts
@@ -1,33 +1,46 @@
 import z from "zod"
+import { Effect } from "effect"
 import { Tool } from "./tool"
 import { Question } from "../question"
 import DESCRIPTION from "./question.txt"
 
-export const QuestionTool = Tool.define("question", {
-  description: DESCRIPTION,
-  parameters: z.object({
-    questions: z.array(Question.Info.omit({ custom: true })).describe("Questions to ask"),
-  }),
-  async execute(params, ctx) {
-    const answers = await Question.ask({
-      sessionID: ctx.sessionID,
-      questions: params.questions,
-      tool: ctx.callID ? { messageID: ctx.messageID, callID: ctx.callID } : undefined,
-    })
+const parameters = z.object({
+  questions: z.array(Question.Info.omit({ custom: true })).describe("Questions to ask"),
+})
 
-    function format(answer: Question.Answer | undefined) {
-      if (!answer?.length) return "Unanswered"
-      return answer.join(", ")
-    }
+type Metadata = {
+  answers: Question.Answer[]
+}
 
-    const formatted = params.questions.map((q, i) => `"${q.question}"="${format(answers[i])}"`).join(", ")
+export const QuestionTool = Tool.defineEffect<typeof parameters, Metadata, Question.Service>(
+  "question",
+  Effect.gen(function* () {
+    const question = yield* Question.Service
 
     return {
-      title: `Asked ${params.questions.length} question${params.questions.length > 1 ? "s" : ""}`,
-      output: `User has answered your questions: ${formatted}. You can now continue with the user's answers in mind.`,
-      metadata: {
-        answers,
+      description: DESCRIPTION,
+      parameters,
+      async execute(params: z.infer<typeof parameters>, ctx: Tool.Context<Metadata>) {
+        const answers = await question
+          .ask({
```

#### packages/opencode/src/tool/registry.ts
```diff
diff --git a/packages/opencode/src/tool/registry.ts b/packages/opencode/src/tool/registry.ts
index 1bb2707..b538a9e 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -33,6 +33,8 @@ import { Effect, Layer, ServiceMap } from "effect"
 import { InstanceState } from "@/effect/instance-state"
 import { makeRuntime } from "@/effect/run-service"
 import { Env } from "../env"
+import { Question } from "../question"
+import { Todo } from "../session/todo"
 
 export namespace ToolRegistry {
   const log = Log.create({ service: "tool.registry" })
@@ -42,8 +44,11 @@ export namespace ToolRegistry {
   }
 
   export interface Interface {
-    readonly register: (tool: Tool.Info) => Effect.Effect<void>
     readonly ids: () => Effect.Effect<string[]>
+    readonly named: {
+      task: Tool.Info
+      read: Tool.Info
+    }
     readonly tools: (
       model: { providerID: ProviderID; modelID: ModelID },
       agent?: Agent.Info,
@@ -52,156 +57,177 @@ export namespace ToolRegistry {
 
   export class Service extends ServiceMap.Service<Service, Interface>()("@opencode/ToolRegistry") {}
 
-  export const layer: Layer.Layer<Service, never, Config.Service | Plugin.Service> = Layer.effect(
-    Service,
-    Effect.gen(function* () {
-      const config = yield* Config.Service
-      const plugin = yield* Plugin.Service
-
-      const state = yield* InstanceState.make<State>(
-        Effect.fn("ToolRegistry.state")(function* (ctx) {
-          const custom: Tool.Info[] = []
-
-          function fromPlugin(id: string, def: ToolDefinition): Tool.Info {
-            return {
-              id,
-              init: async (initCtx) => ({
-                parameters: z.object(def.args),
-                description: def.description,
-                execute: async (args, toolCtx) => {
-                  const pluginCtx = {
-                    ...toolCtx,
-                    directory: ctx.directory,
```

#### packages/opencode/src/tool/todo.ts
```diff
diff --git a/packages/opencode/src/tool/todo.ts b/packages/opencode/src/tool/todo.ts
index a5e56cb..d10e849 100644
--- a/packages/opencode/src/tool/todo.ts
+++ b/packages/opencode/src/tool/todo.ts
@@ -1,31 +1,48 @@
 import z from "zod"
+import { Effect } from "effect"
 import { Tool } from "./tool"
 import DESCRIPTION_WRITE from "./todowrite.txt"
 import { Todo } from "../session/todo"
 
-export const TodoWriteTool = Tool.define("todowrite", {
-  description: DESCRIPTION_WRITE,
-  parameters: z.object({
-    todos: z.array(z.object(Todo.Info.shape)).describe("The updated todo list"),
-  }),
-  async execute(params, ctx) {
-    await ctx.ask({
-      permission: "todowrite",
-      patterns: ["*"],
-      always: ["*"],
-      metadata: {},
-    })
+const parameters = z.object({
+  todos: z.array(z.object(Todo.Info.shape)).describe("The updated todo list"),
+})
+
+type Metadata = {
+  todos: Todo.Info[]
+}
+
+export const TodoWriteTool = Tool.defineEffect<typeof parameters, Metadata, Todo.Service>(
+  "todowrite",
+  Effect.gen(function* () {
+    const todo = yield* Todo.Service
 
-    await Todo.update({
-      sessionID: ctx.sessionID,
-      todos: params.todos,
-    })
     return {
-      title: `${params.todos.filter((x) => x.status !== "completed").length} todos`,
-      output: JSON.stringify(params.todos, null, 2),
-      metadata: {
-        todos: params.todos,
+      description: DESCRIPTION_WRITE,
+      parameters,
+      async execute(params: z.infer<typeof parameters>, ctx: Tool.Context<Metadata>) {
+        await ctx.ask({
+          permission: "todowrite",
```

#### packages/opencode/src/tool/tool.ts
```diff
diff --git a/packages/opencode/src/tool/tool.ts b/packages/opencode/src/tool/tool.ts
index 069c655..a107dad 100644
--- a/packages/opencode/src/tool/tool.ts
+++ b/packages/opencode/src/tool/tool.ts
@@ -1,4 +1,5 @@
 import z from "zod"
+import { Effect } from "effect"
 import type { MessageV2 } from "../session/message-v2"
 import type { Agent } from "../agent/agent"
 import type { Permission } from "../permission"
@@ -45,48 +46,67 @@ export namespace Tool {
     init: (ctx?: InitContext) => Promise<Def<Parameters, M>>
   }
 
-  export type InferParameters<T extends Info> = T extends Info<infer P> ? z.infer<P> : never
-  export type InferMetadata<T extends Info> = T extends Info<any, infer M> ? M : never
+  export type InferParameters<T> =
+    T extends Info<infer P, any>
+      ? z.infer<P>
+      : T extends Effect.Effect<Info<infer P, any>, any, any>
+        ? z.infer<P>
+        : never
+  export type InferMetadata<T> =
+    T extends Info<any, infer M> ? M : T extends Effect.Effect<Info<any, infer M>, any, any> ? M : never
+
+  function wrap<Parameters extends z.ZodType, Result extends Metadata>(
+    id: string,
+    init: ((ctx?: InitContext) => Promise<Def<Parameters, Result>>) | Def<Parameters, Result>,
+  ) {
+    return async (initCtx?: InitContext) => {
+      const toolInfo = init instanceof Function ? await init(initCtx) : { ...init }
+      const execute = toolInfo.execute
+      toolInfo.execute = async (args, ctx) => {
+        try {
+          toolInfo.parameters.parse(args)
+        } catch (error) {
+          if (error instanceof z.ZodError && toolInfo.formatValidationError) {
+            throw new Error(toolInfo.formatValidationError(error), { cause: error })
+          }
+          throw new Error(
+            `The ${id} tool was called with invalid arguments: ${error}.\nPlease rewrite the input so it satisfies the expected schema.`,
+            { cause: error },
+          )
+        }
+        const result = await execute(args, ctx)
+        if (result.metadata.truncated !== undefined) {
+          return result
+        }
+        const truncated = await Truncate.output(result.output, {}, initCtx?.agent)
+        return {
```

#### packages/opencode/test/tool/question.test.ts
```diff
diff --git a/packages/opencode/test/tool/question.test.ts b/packages/opencode/test/tool/question.test.ts
index 9157aaa..f1d9492 100644
--- a/packages/opencode/test/tool/question.test.ts
+++ b/packages/opencode/test/tool/question.test.ts
@@ -1,8 +1,12 @@
-import { describe, expect, test, spyOn, beforeEach, afterEach } from "bun:test"
-import { z } from "zod"
+import { describe, expect } from "bun:test"
+import { Effect, Fiber, Layer } from "effect"
+import { Tool } from "../../src/tool/tool"
 import { QuestionTool } from "../../src/tool/question"
-import * as QuestionModule from "../../src/question"
+import { Question } from "../../src/question"
 import { SessionID, MessageID } from "../../src/session/schema"
+import * as CrossSpawnSpawner from "../../src/effect/cross-spawn-spawner"
+import { provideTmpdirInstance } from "../fixture/fixture"
+import { testEffect } from "../lib/effect"
 
 const ctx = {
   sessionID: SessionID.make("ses_test-session"),
@@ -15,55 +19,69 @@ const ctx = {
   ask: async () => {},
 }
 
-describe("tool.question", () => {
-  let askSpy: any
-
-  beforeEach(() => {
-    askSpy = spyOn(QuestionModule.Question, "ask").mockImplementation(async () => {
-      return []
-    })
-  })
+const it = testEffect(Layer.mergeAll(Question.defaultLayer, CrossSpawnSpawner.defaultLayer))
 
-  afterEach(() => {
-    askSpy.mockRestore()
-  })
+const pending = Effect.fn("QuestionToolTest.pending")(function* (question: Question.Interface) {
+  for (;;) {
+    const items = yield* question.list()
+    const item = items[0]
+    if (item) return item
+    yield* Effect.sleep("10 millis")
+  }
+})
 
-  test("should successfully execute with valid question parameters", async () => {
-    const tool = await QuestionTool.init()
-    const questions = [
-      {
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/question.test.ts` - update based on opencode packages/opencode/test/tool/question.test.ts changes
- `src/tool/question.ts` - update based on opencode packages/opencode/src/tool/question.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/todo.ts` - update based on opencode packages/opencode/src/tool/todo.ts changes
- `src/tool/tool-define.test.ts` - update based on opencode packages/opencode/test/tool/tool-define.test.ts changes
- `src/tool/tool.ts` - update based on opencode packages/opencode/src/tool/tool.ts changes
