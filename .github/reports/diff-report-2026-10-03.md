# Upstream Changes Report
Generated: 2026-10-03 11:13:18

## Summary
- kilocode: 50 commits, 56 files changed
- opencode: 3 commits, 25 files changed

## kilocode Changes (a10fa8ebe..76bcfd40b)

### Commits

- 76bcfd40b - Merge pull request #14702 from calebnorman/allow-subagent-steering-in-tui (Anil Kulkarni, 2026-10-02)
- d2d3f7d1c - Merge branch 'main' into allow-subagent-steering-in-tui (Anil Kulkarni, 2026-10-02)
- 5e42a46f7 - Merge pull request #14701 from calebnorman/implement-esc-interrupt-and-fix-ctrl-c-exit (Anil Kulkarni, 2026-10-02)
- d3f7af288 - Merge branch 'main' into implement-esc-interrupt-and-fix-ctrl-c-exit (Caleb Norman, 2026-10-02)
- 9fc5ae592 - Merge pull request #14721 from Kilo-Org/fix/agent-manager-pool-home (Marius, 2026-10-02)
- 4a3074317 - Merge #14701 (subagent keys hook) into allow-subagent-steering-in-tui (Caleb Norman, 2026-10-02)
- 9a3d20bed - refactor(tui): move subagent-view keys out of the shared session route (Caleb Norman, 2026-10-02)
- a377550fa - Merge pull request #14733 from Kilo-Org/fix-issue-14719 (Marius, 2026-10-02)
- c98978f2e - Merge pull request #14735 from Kilo-Org/chore/outdated-kilo-deps (Bruno Agatão, 2026-10-02)
- 78f82b976 - Merge pull request #14695 from Kilo-Org/chore/dependabot-noise-reduction (Bruno Agatão, 2026-10-02)
- e8cabb4b8 - chore(jetbrains): bump gradle wrapper to 9.8.0 and intellij-gradle-plugin to 2.19.0 (#14739) (dependabot[bot], 2026-10-02)
- e67896af7 - Merge remote-tracking branch 'fork/implement-esc-interrupt-and-fix-ctrl-c-exit' into allow-subagent-steering-in-tui (Caleb Norman, 2026-10-02)
- e687409ce - chore(tui): annotate the subagent footer usage block (Caleb Norman, 2026-10-02)
- 3e31a9a0f - refactor(tui): share the double-press helper with the prompt's exit guard (Caleb Norman, 2026-10-02)
- 17a6a7cd6 - fix(cli): tell the parent a subagent was cancelled by the user (Caleb Norman, 2026-10-02)
- 9ac737068 - Merge branch 'main' into implement-esc-interrupt-and-fix-ctrl-c-exit (Caleb Norman, 2026-10-02)
- 8e90721a6 - Merge branch 'main' into allow-subagent-steering-in-tui (Caleb Norman, 2026-10-02)
- e470489e9 - Merge pull request #14750 from Kilo-Org/fix-issue-14649 (Marius, 2026-10-02)
- 0fe8e4fdf - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-10-02)
- bf40cc7cb - fix(cli): register semantic_search from VS Code project consent (marius-kilocode, 2026-10-02)
- df1973474 - Merge pull request #14745 from Kilo-Org/dependabot/bun/vscode/vsce-4.0.0 (Bruno Agatão, 2026-10-02)
- cf2a83ab1 - fix(security): remove empty expression from stale-bot-pr-notify comment (Bruno Agatao, 2026-10-02)
- 2bc34d290 - fix(security): complete outdated report and guard against silent failure (Bruno Agatao, 2026-10-02)
- 3ff97f556 - chore(deps-dev): bump @vscode/vsce from 3.9.2 to 4.0.0 (dependabot[bot], 2026-10-02)
- 95a98b7fd - chore(security): report outdated Kilo-owned dependencies monthly (Bruno Agatao, 2026-10-02)
- 671153394 - fix(sandbox): keep the mutation worker offline (marius-kilocode, 2026-10-02)
- 3472d3d1b - refactor(agent-manager): move worktree pool into its own module (marius-kilocode, 2026-10-02)
- bce2c7dc1 - chore(security): use ecosystem-specific examples in ignore comments (Bruno Agatao, 2026-10-02)
- 670a30e48 - chore(security): group bun security updates and size the gradle limit (Bruno Agatao, 2026-10-02)
- 492090805 - fix(agent-manager): never pre-warm worktrees inside the project (marius-kilocode, 2026-10-02)
- 40c0ba21e - refactor(tui): guard shell mode at history recall instead of an effect (Caleb Norman, 2026-10-01)
- 67c545b97 - Merge remote-tracking branch 'fork/implement-esc-interrupt-and-fix-ctrl-c-exit' into allow-subagent-steering-in-tui (Caleb Norman, 2026-10-01)
- 0ba771852 - Merge remote-tracking branch 'fork/allow-subagent-steering-in-tui' into allow-subagent-steering-in-tui (Caleb Norman, 2026-10-01)
- 614101761 - feat(tui): show which subagent the prompt is steering (Caleb Norman, 2026-10-01)
- 6eb0b3e93 - Merge branch 'main' into implement-esc-interrupt-and-fix-ctrl-c-exit (Caleb Norman, 2026-10-01)
- b38a5dda9 - Merge branch 'main' into allow-subagent-steering-in-tui (Caleb Norman, 2026-10-01)
- 9233ae72b - Merge #14701 (subagent Esc interrupt) into allow-subagent-steering-in-tui (Caleb Norman, 2026-10-01)
- 71c42fb56 - fix(tui): hide the interrupt hint in subagent views (Caleb Norman, 2026-10-01)
- b299b9779 - fix(agent-manager): keep pooled worktrees outside the project (marius-kilocode, 2026-10-01)
- e9a636518 - refactor(tui): limit subagent views to plain steering prompts (Caleb Norman, 2026-10-01)
- 6dda4b78e - refactor(cli): stop subagents from the TUI like the VS Code task card (Caleb Norman, 2026-10-01)
- 8e99b007e - Revert "fix(cli): wait for the TUI worker before sending RPC calls" (Caleb Norman, 2026-10-01)
- 46eff1d82 - Merge branch 'main' into allow-subagent-steering-in-tui (Caleb Norman, 2026-09-30)
- 17618d4bb - Merge branch 'main' into implement-esc-interrupt-and-fix-ctrl-c-exit (Caleb Norman, 2026-09-30)
- faa860e2d - feat(cli): show the subagent interrupt shortcut beside the footer navigation (Caleb Norman, 2026-09-30)
- f1e766d33 - feat(tui): steer running subagents from their view (Caleb Norman, 2026-09-30)
- 3b88c2e41 - fix(cli): wait for the TUI worker before sending RPC calls (Caleb Norman, 2026-09-30)
- d627b3185 - feat(cli): interrupt a subagent from its view with double Esc (Caleb Norman, 2026-09-30)
- 12c7cc58d - Merge branch 'main' into chore/dependabot-noise-reduction (Bruno Agatão, 2026-09-30)
- cdae41a30 - chore(security): reduce Dependabot noise (Bruno Agatao, 2026-09-30)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/registry.ts` (+30, -4)
- `packages/opencode/src/tool/task.ts` (+4, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/agent-manager-pool-home.md` (+5, -0)
- `.changeset/sandbox-linux-allowed-hosts-writes.md` (+5, -0)
- `.changeset/semantic-search-vscode-consent.md` (+6, -0)
- `.changeset/tui-subagent-esc-interrupt.md` (+5, -0)
- `.changeset/tui-subagent-steering.md` (+5, -0)
- `.github/dependabot.yml` (+91, -12)
- `.github/workflows/README.md` (+7, -4)
- `.github/workflows/outdated-kilo-deps.yml` (+53, -0)
- `.github/workflows/stale-bot-pr-notify.yml` (+3, -1)
- `bun.lock` (+54, -250)
- `nix/hashes.json` (+4, -4)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/run/WorktreeRunDelegateTest.kt` (+10, -4)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/run/WorktreeRunManagerTest.kt` (+5, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/PlainApplicationType.kt` (+36, -2)
- `packages/kilo-jetbrains/build.gradle.kts` (+2, -1)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+1, -1)
- `packages/kilo-jetbrains/gradle/wrapper/gradle-wrapper.jar` (+-, --)
- `packages/kilo-jetbrains/gradle/wrapper/gradle-wrapper.properties` (+1, -1)
- `packages/kilo-jetbrains/gradlew.bat` (+112, -82)
- `packages/kilo-sandbox/src/mutation.ts` (+5, -1)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+11, -31)
- `packages/kilo-vscode/src/agent-manager/pool/home.ts` (+56, -0)
- `packages/kilo-vscode/src/agent-manager/{worktree-pool.ts => pool/pool.ts}` (+200, -72)
- `packages/kilo-vscode/src/agent-manager/pool/slot.ts` (+52, -0)
- `packages/kilo-vscode/src/agent-manager/pool/sweep.ts` (+80, -0)
- `packages/kilo-vscode/src/agent-manager/project/context.ts` (+10, -1)
- `packages/kilo-vscode/src/agent-manager/project/wiring.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/worktree-pool-home.test.ts` (+66, -0)
- `packages/kilo-vscode/tests/unit/worktree-pool-sweep.test.ts` (+164, -0)
- `packages/kilo-vscode/tests/unit/worktree-pool.test.ts` (+143, -30)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/memory-prompt.tsx` (+3, -0)
- `packages/opencode/src/kilocode/indexing.ts` (+7, -0)
- `packages/opencode/src/kilocode/session/steering.ts` (+76, -0)
- `packages/opencode/src/session/prompt.ts` (+4, -0)
- `packages/opencode/test/kilocode/session-steering.test.ts` (+297, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+38, -0)
- `packages/opencode/test/session/prompt.test.ts` (+58, -0)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+3, -0)
- `packages/tui/src/component/prompt/index.tsx` (+41, -18)
- `packages/tui/src/config/keybind.ts` (+2, -0)
- `packages/tui/src/kilocode/double-press.ts` (+34, -0)
- `packages/tui/src/kilocode/steer-label.tsx` (+56, -0)
- `packages/tui/src/kilocode/steer.ts` (+75, -0)
- `packages/tui/src/kilocode/subagent-keys.ts` (+93, -0)
- `packages/tui/src/routes/session/index.tsx` (+2, -4)
- `packages/tui/src/routes/session/subagent-footer.tsx` (+45, -2)
- `packages/tui/test/kilocode/double-press.test.ts` (+40, -0)
- `packages/tui/test/kilocode/steer.test.ts` (+76, -0)
- `packages/tui/test/kilocode/subagent-view.test.tsx` (+388, -0)
- `script/check-workflows.ts` (+1, -0)
- `script/kilocode/outdated.test.ts` (+150, -0)
- `script/kilocode/outdated.ts` (+144, -0)

### Key Diffs

#### packages/opencode/src/kilocode/tool/registry.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/registry.ts b/packages/opencode/src/kilocode/tool/registry.ts
index daf468044..3f1571e71 100644
--- a/packages/opencode/src/kilocode/tool/registry.ts
+++ b/packages/opencode/src/kilocode/tool/registry.ts
@@ -50,9 +50,27 @@ export namespace KiloToolRegistry {
     config: Pick<Config.Info, "indexing">,
     global?: Pick<Config.Info, "indexing">,
   ): boolean | undefined {
+    // VS Code enables indexing from project consent, not from config. Build the tool here and let
+    // applyVisibility check consent on each turn, because consent can change after the registry is built.
+    if (process.env["KILO_PLATFORM"] === "vscode") return true
     return config.indexing?.enabled ?? global?.indexing?.enabled
   }
 
+  /**
+   * Check VS Code project consent without failing tool resolution. Import lazily like semanticTool:
+   * indexing.ts imports AppRuntime, which imports the tool registry, and indexing load failures must not break tools.
+   */
+  function consented(dir: string) {
+    return Effect.tryPromise(() => import("@/kilocode/indexing").then((mod) => mod.KiloIndexing.consented(dir))).pipe(
+      Effect.catch((err) =>
+        Effect.sync(() => {
+          log.warn("semantic search consent unavailable", { err })
+          return false
+        }),
+      ),
+    )
+  }
+
   export function usePatch(input: { modelID: string; family?: string }) {
     if (process.env["KILO_E2E_LLM_URL"]) return true
 
@@ -414,10 +432,18 @@ export namespace KiloToolRegistry {
           return yield* Network.available(new URL(base), token)
         })
       : false
-    return tools.filter((tool) => {
-      if (tool.id.startsWith("kilo_memory_")) return memoryEnabled
-      if (tool.id === "browser_open") return browser
-      return true
+    const semantic =
+      process.env["KILO_PLATFORM"] === "vscode" && tools.some((tool) => tool.id === "semantic_search")
+        ? yield* consented(ctx.directory)
+        : true
+    return tools.flatMap((tool) => {
+      if (tool.id.startsWith("kilo_memory_")) return memoryEnabled ? [tool] : []
+      if (tool.id === "browser_open") return browser ? [tool] : []
+      if (semantic) return [tool]
+      if (tool.id === "semantic_search") return []
+      if (tool.id !== "glob" && tool.id !== "grep") return [tool]
```

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index e8e6186f0..d37e74eb9 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -480,7 +480,10 @@ export const TaskTool = Tool.define(
             }
             // kilocode_change end
             if (result?.status === "error") return yield* Effect.fail(new Error(result.error ?? "Task failed"))
-            if (result?.status === "cancelled") return yield* Effect.fail(new Error("Task cancelled"))
+            // kilocode_change start - only an explicit stop/delete cancels a task its parent still awaits;
+            // without that reason, models treat the result as a failure and start a new subagent right away
+            if (result?.status === "cancelled") return yield* Effect.fail(new Error("Task cancelled by the user"))
+            // kilocode_change end
             return {
               title: params.description,
               metadata,
```


## opencode Changes (1ddb087..907b3bc)

### Commits

- 907b3bc - docs(web): add Fledge Alpha Free to Zen docs (#52895) (Daniel Chen, 2026-10-02)
- 108b988 - fix(stats): hide models listed in a secret (#52834) (vprdev, 2026-10-02)
- c42ae0d - docs(web): add Ling 3.1 Flash Free to Zen docs (#52781) (Jack, 2026-10-02)

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
- `packages/stats/core/src/domain/geo.ts` (+9, -3)
- `packages/stats/core/src/domain/inference.test.ts` (+13, -0)
- `packages/stats/core/src/domain/inference.ts` (+21, -3)
- `packages/stats/core/src/domain/model.ts` (+6, -2)
- `packages/stats/core/src/resource.d.ts` (+4, -0)
- `packages/stats/core/src/stat-sync.ts` (+3, -2)

#### Other Changes
- `infra/stats.ts` (+5, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+8, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+8, -0)

### Key Diffs

#### packages/stats/core/src/domain/geo.ts
```diff
diff --git a/packages/stats/core/src/domain/geo.ts b/packages/stats/core/src/domain/geo.ts
index e1c3367..3d17d4c 100644
--- a/packages/stats/core/src/domain/geo.ts
+++ b/packages/stats/core/src/domain/geo.ts
@@ -55,7 +55,10 @@ export declare namespace GeoStatRepo {
       readonly model?: string
     }) => Effect.Effect<GeoStatRow[], DatabaseError>
     readonly upsert: (rows: GeoStatRow[]) => Effect.Effect<void, DatabaseError>
-    readonly deleteRetiredDimensions: (rows: GeoStatRow[]) => Effect.Effect<void, DatabaseError>
+    readonly deleteRetiredDimensions: (
+      rows: GeoStatRow[],
+      hiddenModels: readonly string[],
+    ) => Effect.Effect<void, DatabaseError>
     readonly deleteUnknownDimensions: (rows: GeoStatRow[]) => Effect.Effect<void, DatabaseError>
   }
 }
@@ -193,7 +196,10 @@ export class GeoStatRepo extends Context.Service<GeoStatRepo, GeoStatRepo.Servic
           })
       }
 
-      const deleteRetiredDimensions = Effect.fn("GeoStatRepo.deleteRetiredDimensions")(function* (rows: GeoStatRow[]) {
+      const deleteRetiredDimensions = Effect.fn("GeoStatRepo.deleteRetiredDimensions")(function* (
+        rows: GeoStatRow[],
+        hiddenModels: readonly string[],
+      ) {
         const scope = statRowScope(rows)
         if (!scope) return
 
@@ -210,7 +216,7 @@ export class GeoStatRepo extends Context.Service<GeoStatRepo, GeoStatRepo.Servic
                   inArray(geoStat.source, scope.sources),
                   or(
                     inArray(geoStat.provider, RETIRED_STAT_PROVIDERS),
-                    inArray(geoStat.model, RETIRED_STAT_MODELS),
+                    inArray(geoStat.model, [...RETIRED_STAT_MODELS, ...hiddenModels]),
                     and(eq(geoStat.provider, "unknown"), eq(geoStat.model, "hy4-preview")),
                   ),
                 ),
```

#### packages/stats/core/src/domain/inference.test.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.test.ts b/packages/stats/core/src/domain/inference.test.ts
index 7e9ac06..6ec2cc0 100644
--- a/packages/stats/core/src/domain/inference.test.ts
+++ b/packages/stats/core/src/domain/inference.test.ts
@@ -245,6 +245,19 @@ describe("inference stat normalization", () => {
     ).toMatchObject([{ period_key: "2026-W20" }])
   })
 
+  test("excludes hidden models from stats and retention queries", () => {
+    const source = { namespace: "inference", table: "generation", dataset: "zen", hiddenModels: ["hidden-model"] }
+    const queries = [
+      ...buildStatsQueries(new Date("2026-08-10T00:00:00.000Z"), new Date("2026-08-11T00:00:00.000Z"), source),
+      ...buildRetentionQueries(new Date("2026-08-10T00:00:00.000Z"), new Date("2026-08-24T00:00:00.000Z"), source).map(
+        (item) => item.query,
+      ),
+    ]
+
+    expect(queries.length).toBeGreaterThan(0)
+    queries.forEach((query) => expect(query).toContain("lower(model) NOT IN ('alpha-gpt-next', 'hidden-model')"))
+  })
+
   test("builds bounded R2 SQL queries for each day and week", () => {
     const queries = buildStatsQueries(new Date("2026-08-10T00:00:00.000Z"), new Date("2026-08-12T12:00:00.000Z"), {
       namespace: "inference",
```

#### packages/stats/core/src/domain/inference.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.ts b/packages/stats/core/src/domain/inference.ts
index ee724ca..2ca6747 100644
--- a/packages/stats/core/src/domain/inference.ts
+++ b/packages/stats/core/src/domain/inference.ts
@@ -26,7 +26,12 @@ import {
 } from "./stat"
 
 export type StatDimension = "model" | "provider" | "geo" | "geo_model"
-export type StatsQuerySource = { namespace: string; table: string; dataset: string }
+export type StatsQuerySource = {
+  namespace: string
+  table: string
+  dataset: string
+  hiddenModels?: readonly string[]
+}
 export type RetentionQuery = { cohortDates: string[]; query: string }
 type StatsQueryFamily = "usage" | "geo"
 
@@ -50,6 +55,7 @@ export function buildStatsQueries(
     namespace: Resource.R2Sql.namespace,
     table: Resource.R2Sql.table,
     dataset: Resource.StatsSyncConfig.dataset,
+    hiddenModels: hiddenStatModels(),
   }
   return [...statPeriods("week", periodStart, periodEnd), ...statPeriods("day", periodStart, periodEnd)].flatMap(
     (period) => [buildStatsQuery(period, source, "usage", catalog), buildStatsQuery(period, source, "geo", catalog)],
@@ -66,6 +72,7 @@ export function buildRetentionQueries(
     namespace: Resource.R2Sql.namespace,
     table: Resource.R2Sql.table,
     dataset: Resource.StatsSyncConfig.dataset,
+    hiddenModels: hiddenStatModels(),
   }
   const periods = retentionPeriods(periodStart, periodEnd)
   // Bound the user-level joins to one activity week and its return week.
@@ -144,7 +151,7 @@ WITH normalized AS (
   FROM normalized
   WHERE activity_week IS NOT NULL
     AND user_key <> ''
-    AND lower(model) NOT IN (${[...EXCLUDED_MODELS].map(sqlString).join(", ")})
+    AND lower(model) NOT IN (${excludedModels(source).map(sqlString).join(", ")})
 ), model_usage AS (
   SELECT
     activity_week AS cohort_date,
@@ -329,7 +336,7 @@ WITH normalized AS (
     cost_output_microcents,
     cost_total_microcents
   FROM normalized
-  WHERE lower(model) NOT IN (${[...EXCLUDED_MODELS].map(sqlString).join(", ")})
+  WHERE lower(model) NOT IN (${excludedModels(source).map(sqlString).join(", ")})
 )
```

#### packages/stats/core/src/domain/model.ts
```diff
diff --git a/packages/stats/core/src/domain/model.ts b/packages/stats/core/src/domain/model.ts
index abbc8cc..a272469 100644
--- a/packages/stats/core/src/domain/model.ts
+++ b/packages/stats/core/src/domain/model.ts
@@ -46,7 +46,10 @@ export declare namespace ModelStatRepo {
     readonly listDaily: () => Effect.Effect<ModelStatMetric[], DatabaseError>
     readonly lastSyncedAt: () => Effect.Effect<Date | null, DatabaseError>
     readonly upsert: (rows: ModelStatRow[]) => Effect.Effect<void, DatabaseError>
-    readonly deleteRetiredDimensions: (rows: ModelStatRow[]) => Effect.Effect<void, DatabaseError>
+    readonly deleteRetiredDimensions: (
+      rows: ModelStatRow[],
+      hiddenModels: readonly string[],
+    ) => Effect.Effect<void, DatabaseError>
     readonly deleteUnknownDimensions: (rows: ModelStatRow[]) => Effect.Effect<void, DatabaseError>
   }
 }
@@ -178,6 +181,7 @@ export class ModelStatRepo extends Context.Service<ModelStatRepo, ModelStatRepo.
 
       const deleteRetiredDimensions = Effect.fn("ModelStatRepo.deleteRetiredDimensions")(function* (
         rows: ModelStatRow[],
+        hiddenModels: readonly string[],
       ) {
         const scope = statRowScope(rows)
         if (!scope) return
@@ -195,7 +199,7 @@ export class ModelStatRepo extends Context.Service<ModelStatRepo, ModelStatRepo.
                   inArray(modelStat.source, scope.sources),
                   or(
                     inArray(modelStat.provider, RETIRED_STAT_PROVIDERS),
-                    inArray(modelStat.model, RETIRED_STAT_MODELS),
+                    inArray(modelStat.model, [...RETIRED_STAT_MODELS, ...hiddenModels]),
                     and(eq(modelStat.provider, "unknown"), eq(modelStat.model, "hy4-preview")),
                   ),
                 ),
```

#### packages/stats/core/src/resource.d.ts
```diff
diff --git a/packages/stats/core/src/resource.d.ts b/packages/stats/core/src/resource.d.ts
index db2167b..e66f871 100644
--- a/packages/stats/core/src/resource.d.ts
+++ b/packages/stats/core/src/resource.d.ts
@@ -13,6 +13,10 @@ declare module "sst/resource" {
       type: "sst.sst.Secret"
       value: string
     }
+    StatsHiddenModels: {
+      type: "sst.sst.Secret"
+      value: string
+    }
     StatsSyncConfig: {
       dataset: string
       type: "sst.sst.Linkable"
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
