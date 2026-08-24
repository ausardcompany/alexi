# Upstream Changes Report
Generated: 2026-08-24 06:58:40

## Summary
- kilocode: 0 commits, 0 files changed
- opencode: 18 commits, 9 files changed

## kilocode Changes (ff74e2ea3..ff74e2ea3)

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

## opencode Changes (3a31c4e..4161695)

### Commits

- 4161695 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-24)
- 7bbfe42 - always allow ox alpha in go (Frank, 2026-08-24)
- f2a1d54 - fix(console): set duplex for streamed zen requests (Frank, 2026-08-24)
- b1ce938 - fix(console): support DeepSeek weekend pricing (#44305) (opencode-agent[bot], 2026-08-24)
- 03bba46 - chore: generate (opencode-agent[bot], 2026-08-23)
- 63a883a - refactor(console): stream zen bodies without modifiers (#44472) (Dax, 2026-08-23)
- b3bad6b - fix(console): revert scanned zen request streaming (#44470) (Dax, 2026-08-23)
- ca10088 - chore: generate (opencode-agent[bot], 2026-08-23)
- dd3f915 - fix(console): release streamed zen prefixes (#44465) (Dax, 2026-08-23)
- c11c41b - chore: generate (opencode-agent[bot], 2026-08-23)
- fa11755 - fix(console): scan zen model before streaming (#44463) (Dax, 2026-08-23)
- 17b4730 - feat(console): add unblock workspace action (Frank, 2026-08-23)
- 3d31e4b - fix(console): revert streamed zen request bodies (#44444) (Dax, 2026-08-23)
- bb72277 - chore: generate (opencode-agent[bot], 2026-08-23)
- 32c3637 - fix(console): stream zen request bodies (#44429) (Dax, 2026-08-23)
- 9d466cd - fix(stats): normalize model casing (Dax Raad, 2026-08-23)
- e3bd6e0 - chore: generate (opencode-agent[bot], 2026-08-23)
- dc13c6b - fix(console): reduce zen request memory (#44403) (Dax, 2026-08-23)

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
- `packages/console/core/src/workspace.ts` (+12, -0)
- `packages/stats/core/src/domain/inference.test.ts` (+1, -0)
- `packages/stats/core/src/domain/model-normalization.ts` (+1, -1)

#### Other Changes
- `packages/console/app/src/routes/api/support/actions/unblock-workspace.ts` (+21, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+72, -125)
- `packages/console/app/src/routes/zen/util/pricing.ts` (+11, -0)
- `packages/console/app/src/routes/zen/util/requestBody.ts` (+191, -0)
- `packages/console/app/test/pricing.test.ts` (+16, -0)
- `packages/console/app/test/requestBody.test.ts` (+122, -0)

### Key Diffs

#### packages/console/core/src/workspace.ts
```diff
diff --git a/packages/console/core/src/workspace.ts b/packages/console/core/src/workspace.ts
index 124710b..432d494 100644
--- a/packages/console/core/src/workspace.ts
+++ b/packages/console/core/src/workspace.ts
@@ -97,6 +97,18 @@ export namespace Workspace {
     },
   )
 
+  export const unblock = fn(
+    z.object({
+      workspaceID: Identifier.schema("workspace"),
+    }),
+    async (input) => {
+      const result = await Database.use((tx) =>
+        tx.update(WorkspaceTable).set({ is_blocked: false }).where(eq(WorkspaceTable.id, input.workspaceID)),
+      )
+      if (result.rowsAffected === 0) throw new Error("Workspace not found")
+    },
+  )
+
   export const remove = fn(z.void(), async () => {
     await Database.use((tx) =>
       tx
```

#### packages/stats/core/src/domain/inference.test.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.test.ts b/packages/stats/core/src/domain/inference.test.ts
index d8937ff..ad95dad 100644
--- a/packages/stats/core/src/domain/inference.test.ts
+++ b/packages/stats/core/src/domain/inference.test.ts
@@ -4,6 +4,7 @@ import { modelAuthor, normalizeInferenceModel, statModel, statProvider } from ".
 
 describe("inference stat normalization", () => {
   test("normalizes model suffixes used by router/provider variants", () => {
+    expect(normalizeInferenceModel("GPT-5-Free")).toBe("gpt-5")
     expect(normalizeInferenceModel("deepseek-v4-flash-free")).toBe("deepseek-v4-flash")
     expect(normalizeInferenceModel("deepseek-v4-flash:global")).toBe("deepseek-v4-flash")
     expect(normalizeInferenceModel("mimo-v2.5-free")).toBe("mimo-v2.5")
```

#### packages/stats/core/src/domain/model-normalization.ts
```diff
diff --git a/packages/stats/core/src/domain/model-normalization.ts b/packages/stats/core/src/domain/model-normalization.ts
index 778e5ed..c950fda 100644
--- a/packages/stats/core/src/domain/model-normalization.ts
+++ b/packages/stats/core/src/domain/model-normalization.ts
@@ -23,7 +23,7 @@ export const RETIRED_STAT_MODELS = ["big-pickle", ...Object.keys(MODEL_NAME_ALIA
 export const RETIRED_STAT_PROVIDERS = ["opencode"]
 
 export function normalizeInferenceModel(value: string | undefined) {
-  return (value || "unknown").replace(/(-free|:free|:global)+$/, "") || "unknown"
+  return (value || "unknown").toLowerCase().replace(/(-free|:free|:global)+$/, "") || "unknown"
 }
 
 export function modelAuthor(value: string | undefined) {
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
