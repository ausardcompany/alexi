# Upstream Changes Report
Generated: 2026-07-05 08:53:42

## Summary
- kilocode: 0 commits, 0 files changed
- opencode: 12 commits, 64 files changed

## kilocode Changes (1fc8f066f..1fc8f066f)

### Commits

(no commits)

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
(no changes)

### Key Diffs

(no key diffs to show)

## opencode Changes (7a8e7c8..b7e4f1e)

### Commits

- b7e4f1e - fix: update Feishu community link (#35392) (Jack, 2026-07-05)
- efd5f0a - fix(app): preserve timeline selection autoscroll (#35383) (Luke Parker, 2026-07-05)
- 7135bc4 - chore: generate (opencode-agent[bot], 2026-07-05)
- 7cf8d1c - feat(app): terminal improvements (#34747) (Aarav Sareen, 2026-07-05)
- 78bca5c - chore: generate (opencode-agent[bot], 2026-07-05)
- 82db86e - feat(desktop): reopen closed tabs and background tab open (#35010) (usrnk1, 2026-07-05)
- 476e3fc - chore: generate (opencode-agent[bot], 2026-07-05)
- a12d50e - fix(app): hydrate timeline message parents (#35269) (Luke Parker, 2026-07-05)
- 1b9b260 - chore: generate (opencode-agent[bot], 2026-07-04)
- a8983bd - feat(codemode): add OpenAPI tool adapter (#35192) (Aiden Cline, 2026-07-04)
- 709af58 - fix(core): stop after declined permissions (#35356) (opencode-agent[bot], 2026-07-04)
- bcbbf32 - fix(app): use v2 tooltip for prompt context (#35351) (opencode-agent[bot], 2026-07-04)

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
- `packages/core/src/permission.ts` (+10, -9)
- `packages/core/src/session/runner/llm.ts` (+9, -4)
- `packages/core/test/permission.test.ts` (+21, -3)
- `packages/core/test/session-runner.test.ts` (+142, -0)
- `packages/core/test/tool-apply-patch.test.ts` (+1, -1)
- `packages/core/test/tool-bash.test.ts` (+1, -1)
- `packages/core/test/tool-edit.test.ts` (+1, -1)
- `packages/core/test/tool-question.test.ts` (+1, -1)
- `packages/core/test/tool-read.test.ts` (+1, -1)
- `packages/core/test/tool-skill.test.ts` (+1, -1)
- `packages/core/test/tool-todowrite.test.ts` (+1, -1)
- `packages/core/test/tool-write.test.ts` (+1, -1)

#### Other Changes
- `README.zh.md` (+1, -1)
- `README.zht.md` (+1, -1)
- `packages/app/e2e/performance/timeline-stability/scroll-interaction.spec.ts` (+34, -0)
- `packages/app/e2e/performance/timeline/session-parent-hydration-benchmark.spec.ts` (+151, -0)
- `packages/app/e2e/performance/timeline/session-tab-switch-metrics.ts` (+4, -1)
- `packages/app/e2e/performance/timeline/session-tab-switch-probe.ts` (+48, -8)
- `packages/app/e2e/performance/unit/mock-server.test.ts` (+46, -0)
- `packages/app/e2e/performance/unit/session-tab-switch-metrics.test.ts` (+32, -0)
- `packages/app/e2e/performance/unit/session-tab-switch-probe.test.ts` (+55, -0)
- `packages/app/e2e/regression/session-timeline-history-root.spec.ts` (+220, -0)
- `packages/app/e2e/regression/terminal-hidden.spec.ts` (+3, -2)
- `packages/app/e2e/utils/mock-server.ts` (+27, -2)
- `packages/app/src/components/prompt-input/context-items.tsx` (+3, -3)
- `packages/app/src/components/session/session-sortable-terminal-tab-v2.tsx` (+271, -0)
- `packages/app/src/components/titlebar-tab-strip.tsx` (+0, -2)
- `packages/app/src/components/titlebar.tsx` (+9, -2)
- `packages/app/src/context/closed-tabs.ts` (+40, -0)
- `packages/app/src/context/server-session.test.ts` (+306, -0)
- `packages/app/src/context/server-session.ts` (+109, -30)
- `packages/app/src/context/tabs.test.ts` (+81, -0)
- `packages/app/src/context/tabs.tsx` (+56, -3)
- `packages/app/src/i18n/en.ts` (+1, -0)
- `packages/app/src/pages/home-session-open.test.ts` (+12, -0)
- `packages/app/src/pages/home-session-open.ts` (+11, -0)
- `packages/app/src/pages/home.tsx` (+31, -10)
- `packages/app/src/pages/session.tsx` (+86, -18)
- `packages/app/src/pages/session/session-panel-layout.test.ts` (+19, -0)
- `packages/app/src/pages/session/session-panel-layout.ts` (+6, -0)
- `packages/app/src/pages/session/session-side-panel.tsx` (+4, -1)
- `packages/app/src/pages/session/terminal-panel-v2.tsx` (+366, -0)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+7, -2)
- `packages/app/src/pages/session/timeline/model.test.ts` (+7, -1)
- `packages/app/src/pages/session/timeline/model.ts` (+5, -1)
- `packages/codemode/AGENTS.md` (+8, -0)
- `packages/codemode/README.md` (+25, -0)
- `packages/codemode/src/index.ts` (+1, -0)
- `packages/codemode/src/openapi/TODO.md` (+19, -0)
- `packages/codemode/src/openapi/index.ts` (+130, -0)
- `packages/codemode/src/openapi/runtime.ts` (+326, -0)
- `packages/codemode/src/openapi/spec.ts` (+511, -0)
- `packages/codemode/src/openapi/types.ts` (+112, -0)
- `packages/codemode/src/token.ts` (+0, -10)
- `packages/codemode/src/tool-runtime.ts` (+41, -39)
- `packages/codemode/src/tool.ts` (+61, -11)
- `packages/codemode/test/fixtures/openapi-happy-path.json` (+230, -0)
- `packages/codemode/test/fixtures/opencode-v2-openapi.json` (+23730, -0)
- `packages/codemode/test/openapi.test.ts` (+964, -0)
- `packages/codemode/test/signature.test.ts` (+64, -2)
- `packages/console/app/src/routes/feishu.ts` (+1, -1)
- `packages/protocol/src/groups/pty.ts` (+1, -0)
- `packages/sdk/openapi.json` (+1, -0)
- `packages/ui/src/components/tabs.css` (+47, -1)

### Key Diffs

#### packages/core/src/permission.ts
```diff
diff --git a/packages/core/src/permission.ts b/packages/core/src/permission.ts
index 95219e1..3f28632 100644
--- a/packages/core/src/permission.ts
+++ b/packages/core/src/permission.ts
@@ -57,13 +57,13 @@ export type AskResult = typeof AskResult.Type
 
 export const Event = Permission.Event
 
-export class RejectedError extends Schema.TaggedErrorClass<RejectedError>()("PermissionV2.RejectedError", {}) {}
+export class DeclinedError extends Schema.TaggedErrorClass<DeclinedError>()("PermissionV2.DeclinedError", {}) {}
 
 export class CorrectedError extends Schema.TaggedErrorClass<CorrectedError>()("PermissionV2.CorrectedError", {
   feedback: Schema.String,
 }) {}
 
-export class DeniedError extends Schema.TaggedErrorClass<DeniedError>()("PermissionV2.DeniedError", {
+export class BlockedError extends Schema.TaggedErrorClass<BlockedError>()("PermissionV2.BlockedError", {
   rules: Permission.Ruleset,
 }) {}
 
@@ -71,7 +71,7 @@ export class NotFoundError extends Schema.TaggedErrorClass<NotFoundError>()("Per
   requestID: ID,
 }) {}
 
-export type Error = DeniedError | RejectedError | CorrectedError
+export type Error = BlockedError | CorrectedError
 
 export function evaluate(action: string, resource: string, ...rulesets: Permission.Ruleset[]): Permission.Rule {
   return (
@@ -103,7 +103,7 @@ export class Service extends Context.Service<Service, Interface>()("@opencode/v2
 interface Pending {
   readonly request: Request
   readonly agent?: AgentV2.ID
-  readonly deferred: Deferred.Deferred<void, RejectedError | CorrectedError>
+  readonly deferred: Deferred.Deferred<void, DeclinedError | CorrectedError>
 }
 
 const layer = Layer.effect(
@@ -117,7 +117,7 @@ const layer = Layer.effect(
     const pending = new Map<ID, Pending>()
 
     yield* EffectRuntime.addFinalizer(() =>
-      EffectRuntime.forEach(pending.values(), (item) => Deferred.fail(item.deferred, new RejectedError()), {
+      EffectRuntime.forEach(pending.values(), (item) => Deferred.fail(item.deferred, new DeclinedError()), {
         discard: true,
       }).pipe(
         EffectRuntime.ensuring(
@@ -176,7 +176,7 @@ const layer = Layer.effect(
     const create = (request: Request, agent?: AgentV2.ID) =>
       EffectRuntime.uninterruptible(
```

#### packages/core/src/session/runner/llm.ts
```diff
diff --git a/packages/core/src/session/runner/llm.ts b/packages/core/src/session/runner/llm.ts
index 94c77d1..72c761e 100644
--- a/packages/core/src/session/runner/llm.ts
+++ b/packages/core/src/session/runner/llm.ts
@@ -15,6 +15,7 @@ import { Database } from "../../database/database"
 import { EventV2 } from "../../event"
 import { Location } from "../../location"
 import { ModelV2 } from "../../model"
+import { PermissionV2 } from "../../permission"
 import { ProviderV2 } from "../../provider"
 import { QuestionV2 } from "../../question"
 import { SystemContext } from "../../system-context/index"
@@ -140,9 +141,13 @@ const layer = Layer.effect(
     const awaitToolFibers = (fibers: FiberSet.FiberSet<void, ToolOutputStore.Error>) =>
       Effect.raceFirst(FiberSet.join(fibers), FiberSet.awaitEmpty(fibers))
 
-    // Match V1: dismissing a question halts the loop instead of becoming model-facing tool output.
-    const isQuestionRejected = (cause: Cause.Cause<unknown>) =>
-      cause.reasons.some((reason) => Cause.isDieReason(reason) && reason.defect instanceof QuestionV2.RejectedError)
+    // Match V1: declining a user prompt halts the loop instead of becoming model-facing tool output.
+    const isUserDeclined = (cause: Cause.Cause<unknown>) =>
+      cause.reasons.some(
+        (reason) =>
+          Cause.isDieReason(reason) &&
+          (reason.defect instanceof PermissionV2.DeclinedError || reason.defect instanceof QuestionV2.RejectedError),
+      )
 
     type TurnTransition =
       // Automatic compaction completed; rebuild the request from compacted history.
@@ -289,7 +294,7 @@ const layer = Layer.effect(
           }
           if (stream._tag === "Failure" && Cause.hasInterrupts(stream.cause)) yield* FiberSet.clear(toolFibers)
           const settled = yield* restore(awaitToolFibers(toolFibers)).pipe(Effect.exit)
-          if (settled._tag === "Failure" && isQuestionRejected(settled.cause)) {
+          if (settled._tag === "Failure" && isUserDeclined(settled.cause)) {
             yield* FiberSet.clear(toolFibers)
             yield* withPublication(publisher.failUnsettledTools("Tool execution interrupted"))
             return yield* Effect.interrupt
```

#### packages/core/test/permission.test.ts
```diff
diff --git a/packages/core/test/permission.test.ts b/packages/core/test/permission.test.ts
index a556f1f..df87c1d 100644
--- a/packages/core/test/permission.test.ts
+++ b/packages/core/test/permission.test.ts
@@ -1,5 +1,5 @@
 import { describe, expect } from "bun:test"
-import { Deferred, Effect, Fiber, Layer } from "effect"
+import { Cause, Deferred, Effect, Fiber, Layer } from "effect"
 import { AgentV2 } from "@opencode-ai/core/agent"
 import { Database } from "@opencode-ai/core/database/database"
 import { AppNodeBuilder } from "@opencode-ai/core/effect/app-node-builder"
@@ -147,8 +147,8 @@ describe("PermissionV2", () => {
       const service = yield* PermissionV2.Service
       yield* service.assert(assertion())
       yield* setRules([{ action: "read", resource: "*", effect: "deny" }])
-      const denied = yield* service.assert(assertion()).pipe(Effect.flip)
-      expect(denied).toBeInstanceOf(PermissionV2.DeniedError)
+      const blocked = yield* service.assert(assertion()).pipe(Effect.flip)
+      expect(blocked).toBeInstanceOf(PermissionV2.BlockedError)
       expect(yield* service.list()).toEqual([])
     }),
   )
@@ -265,6 +265,24 @@ describe("PermissionV2", () => {
     }),
   )
 
+  it.effect("defects when an asked permission is declined", () =>
+    Effect.gen(function* () {
+      yield* setup()
+      const { service, fiber, request } = yield* waitForRequest()
+      yield* service.reply({ requestID: request.id, reply: "reject" })
+      const exit = yield* Fiber.await(fiber)
+
+      expect(exit._tag).toBe("Failure")
+      if (exit._tag === "Failure")
+        expect(
+          exit.cause.reasons.some(
+            (reason) => Cause.isDieReason(reason) && reason.defect instanceof PermissionV2.DeclinedError,
+          ),
+        ).toBe(true)
+      expect(yield* service.list()).toEqual([])
+    }),
+  )
+
   it.effect("stores and removes saved resources for a project", () =>
     Effect.gen(function* () {
       yield* setup()
```

#### packages/core/test/session-runner.test.ts
```diff
diff --git a/packages/core/test/session-runner.test.ts b/packages/core/test/session-runner.test.ts
index 9cf3139..0515d55 100644
--- a/packages/core/test/session-runner.test.ts
+++ b/packages/core/test/session-runner.test.ts
@@ -2609,6 +2609,148 @@ describe("SessionRunnerLLM", () => {
     }),
   )
 
+  it.effect("returns policy-blocked tools to the model and continues", () =>
+    Effect.gen(function* () {
+      yield* setup
+      const session = yield* SessionV2.Service
+      const registry = yield* ToolRegistry.Service
+      yield* registry.register({
+        blocked: Tool.make({
+          description: "Fail because policy blocked execution",
+          input: Schema.Struct({}),
+          output: Schema.Struct({}),
+          execute: () =>
+            Effect.fail(new PermissionV2.BlockedError({ rules: [] })).pipe(
+              Effect.mapError(() => new Tool.Failure({ message: "Permission blocked" })),
+            ),
+        }),
+      })
+      yield* session.prompt({ sessionID, prompt: Prompt.make({ text: "Call blocked" }), resume: false })
+
+      requests.length = 0
+      responses = [
+        [
+          LLMEvent.stepStart({ index: 0 }),
+          LLMEvent.toolCall({ id: "call-blocked", name: "blocked", input: {} }),
+          LLMEvent.stepFinish({ index: 0, reason: "tool-calls" }),
+          LLMEvent.finish({ reason: "tool-calls" }),
+        ],
+        [
+          LLMEvent.stepStart({ index: 0 }),
+          LLMEvent.stepFinish({ index: 0, reason: "stop" }),
+          LLMEvent.finish({ reason: "stop" }),
+        ],
+      ]
+
+      yield* session.resume(sessionID)
+
+      expect(requests).toHaveLength(2)
+      expect(yield* session.context(sessionID)).toMatchObject([
+        { type: "user", text: "Call blocked" },
+        {
+          type: "assistant",
+          content: [
+            { type: "tool", id: "call-blocked", state: { status: "error", error: { message: "Permission blocked" } } },
```

#### packages/core/test/tool-apply-patch.test.ts
```diff
diff --git a/packages/core/test/tool-apply-patch.test.ts b/packages/core/test/tool-apply-patch.test.ts
index b986d49..542a08d 100644
--- a/packages/core/test/tool-apply-patch.test.ts
+++ b/packages/core/test/tool-apply-patch.test.ts
@@ -40,7 +40,7 @@ const permission = Layer.succeed(
       }).pipe(
         Effect.andThen(input.action === "edit" ? Effect.suspend(afterEditApproval) : Effect.void),
         Effect.andThen(
-          input.action === denyAction ? Effect.fail(new PermissionV2.DeniedError({ rules: [] })) : Effect.void,
+          input.action === denyAction ? Effect.fail(new PermissionV2.BlockedError({ rules: [] })) : Effect.void,
         ),
       ),
     ask: () => Effect.die("unused"),
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
