# Upstream Changes Report
Generated: 2026-09-05 10:03:53

## Summary
- kilocode: 29 commits, 161 files changed
- opencode: 15 commits, 101 files changed

## kilocode Changes (74b3141bb..ecccd1f54)

### Commits

- ecccd1f54 - Merge pull request #13805 from Kilo-Org/fix/glob-search-timeout-20260904 (Joshua Lambert, 2026-09-04)
- b8e497a35 - fix(cli): time out stalled glob searches (Josh Lambert, 2026-09-04)
- 1536aef0f - release: v7.5.14 (kilo-maintainer[bot], 2026-09-04)
- a48683162 - fix(vscode): retry marketplace publishing (#13802) (Marius, 2026-09-04)
- 35e0aeb06 - Merge pull request #13796 from Kilo-Org/investigate-stuck-indexing (Marius, 2026-09-04)
- 3593340ff - Merge pull request #13795 from Kilo-Org/investigate-watcher-cpu-usage (Marius, 2026-09-04)
- 3180ca93e - fix(vscode): handle async visibility updates explicitly (marius-kilocode, 2026-09-04)
- 4a3dc143f - refactor(vscode): remove redundant indexing refresh void (marius-kilocode, 2026-09-04)
- 2694e2adc - fix(vscode): preserve indexing consent across status races (marius-kilocode, 2026-09-04)
- 513462538 - fix(vscode): retry failed probes and recheck sampled files (marius-kilocode, 2026-09-04)
- f6918fbc8 - Merge pull request #13764 from Kilo-Org/fancy-tundra (Kirill Kalishev, 2026-09-04)
- b2cad7eec - release: v7.5.13 (kilo-maintainer[bot], 2026-09-04)
- 626d1cc57 - fix(vscode): keep indexing status in sync (marius-kilocode, 2026-09-04)
- 2fd712321 - fix(vscode): stop hidden polling and reuse diff file counts (marius-kilocode, 2026-09-04)
- bf59cde8c - Merge pull request #13792 from Kilo-Org/fix-shift-tab-variant-selection (Marius, 2026-09-04)
- 3987c9e01 - Merge pull request #13791 from Kilo-Org/replace-action-buttons-with-icons (Marius, 2026-09-04)
- 9d918e446 - release: v7.5.12 (kilo-maintainer[bot], 2026-09-04)
- 5d2038daa - fix(vscode): keep Shift+Tab out of slash command selection (marius-kilocode, 2026-09-04)
- 8110a30b7 - Merge pull request #13789 from Kilo-Org/fix-selector-autoclose-on-focus (Marius, 2026-09-04)
- 56bc3f14b - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-04)
- 6d221c2be - release: v7.5.11 (kilo-maintainer[bot], 2026-09-04)
- 294219be7 - fix(agent-manager): use consistent toolbar icon actions (marius-kilocode, 2026-09-04)
- b1ed65ed6 - fix(vscode): preserve open selectors during prompt focus recovery (marius-kilocode, 2026-09-04)
- 1c4b414d2 - Merge pull request #13786 from Kilo-Org/imminent-vanilla (Marius, 2026-09-04)
- 67cf93760 - fix(ci): download release archives before smoke tests (marius-kilocode, 2026-09-04)
- 86c1928c4 - fix(cli): bound the piped-stdin wait in kilo run (#13763) (Igor Šćekić, 2026-09-04)
- 51e11d5f2 - Merge pull request #13783 from Kilo-Org/remove-agent-manager-icon-button (Marius, 2026-09-04)
- 1ac26660f - fix(agent-manager): remove toolbar help icon (marius-kilocode, 2026-09-04)
- 17c915b2a - feat(jetbrains): add Ctrl+1/2/3/0 shortcuts for mode/model/reasoning pickers (kirillk, 2026-09-03)

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
- `packages/core/package.json` (+1, -1)
- `packages/core/src/ripgrep.ts` (+55, -40)
- `packages/core/test/kilocode/ripgrep-settlement.test.ts` (+138, -16)

#### Other Changes
- `.changeset/agent-manager-intro-base-update.md` (+0, -5)
- `.changeset/agent-manager-intro-screen.md` (+0, -5)
- `.changeset/agent-manager-pr-conversation-comments.md` (+0, -5)
- `.changeset/agent-manager-pr-refresh.md` (+0, -5)
- `.changeset/agent-manager-prompt-preview.md` (+0, -6)
- `.changeset/agent-manager-update-from-base.md` (+0, -5)
- `.changeset/bound-glob-searches.md` (+5, -0)
- `.changeset/calm-subagent-denial.md` (+0, -5)
- `.changeset/clear-completed-indicator-on-focus.md` (+0, -5)
- `.changeset/cli-ask-plain-text-diagrams.md` (+0, -5)
- `.changeset/compact-vscode-serializer.md` (+0, -5)
- `.changeset/fast-worktree-terminal-cleanup.md` (+0, -5)
- `.changeset/fix-agent-manager-shortcut-state.md` (+0, -5)
- `.changeset/fix-board-read-notices.md` (+0, -5)
- `.changeset/fix-explore-execution-limits.md` (+0, -5)
- `.changeset/fix-opencode-provider-headers.md` (+0, -5)
- `.changeset/fix-review-comment-shortcut.md` (+0, -5)
- `.changeset/fix-single-turn-subagent-pruning.md` (+0, -5)
- `.changeset/fix-stale-worktree-status.md` (+0, -5)
- `.changeset/fix-subagent-permission-replies.md` (+0, -5)
- `.changeset/jetbrains-worktree-editor-move.md` (+0, -5)
- `.changeset/kilo-indexing-file-watcher.md` (+0, -5)
- `.changeset/mention-query-spaces.md` (+0, -5)
- `.changeset/optimistic-worktree-prompts.md` (+0, -5)
- `.changeset/org-default-model-selection.md` (+0, -7)
- `.changeset/plan-name-collision-custom-agents.md` (+0, -5)
- `.changeset/pr-unresolved-thread-badges.md` (+0, -5)
- `.changeset/preserve-sections-after-deletion.md` (+0, -5)
- `.changeset/question-default-answer.md` (+0, -7)
- `.changeset/quiet-badge-scans.md` (+0, -5)
- `.changeset/quiet-balance-errors.md` (+0, -6)
- `.changeset/review-worktree-first.md` (+0, -5)
- `.changeset/run-question-space-toggle.md` (+0, -5)
- `.changeset/shared-agent-board.md` (+0, -13)
- `.changeset/suggestion-completion-status.md` (+0, -5)
- `.changeset/swarm-agent-identity.md` (+0, -7)
- `.changeset/swarm-collaboration-guidance.md` (+0, -5)
- `.changeset/terminal-only-tab-restore.md` (+0, -5)
- `.changeset/update-from-base-questions.md` (+0, -5)
- `.changeset/user-message-image-preview-tab.md` (+0, -5)
- `.changeset/worktree-deletion-selection.md` (+0, -5)
- `.github/workflows/smoke-test.yml` (+13, -21)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+32, -32)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-full-context-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/SessionSelectorActions.kt` (+104, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ReasoningPicker.kt` (+24, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/mode/ModePicker.kt` (+24, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+41, -21)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRows.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptDataKeys.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+35, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptSelectors.kt` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/PickerButton.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+62, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SessionSelectorActionsTest.kt` (+181, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SessionSelectorShortcutsTest.kt` (+71, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/mode/ModePickerTest.kt` (+65, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelPickerTest.kt` (+71, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+101, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/script/publish.ts` (+16, -8)
- `packages/kilo-vscode/src/KiloProvider.ts` (+66, -27)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+4, -4)
- `packages/kilo-vscode/src/agent-manager/git-stats-snapshot.ts` (+32, -14)
- `packages/kilo-vscode/src/agent-manager/local-diff.ts` (+11, -29)
- `packages/kilo-vscode/src/agent-manager/worktree-diff-controller.ts` (+4, -0)
- `packages/kilo-vscode/src/diff/DiffViewerProvider.ts` (+4, -0)
- `packages/kilo-vscode/src/diff/SourceController.ts` (+24, -7)
- `packages/kilo-vscode/src/diff/shared/binary.ts` (+8, -3)
- `packages/kilo-vscode/tests/model-selector-accessibility.spec.ts` (+37, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+3, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-focus.test.ts` (+19, -0)
- `packages/kilo-vscode/tests/unit/git-stats-snapshot.test.ts` (+73, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-acknowledgement.test.ts` (+129, -4)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+237, -46)
- `packages/kilo-vscode/tests/unit/local-diff.test.ts` (+180, -1)
- `packages/kilo-vscode/tests/unit/publish.test.ts` (+38, -0)
- `packages/kilo-vscode/tests/unit/source-controller.test.ts` (+101, -0)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+42, -0)
- `packages/kilo-vscode/tests/unit/worktree-diff-controller.test.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+1, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/TabBar.tsx` (+49, -34)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeSectionActions.tsx` (+0, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+15, -21)
- `packages/kilo-vscode/webview-ui/agent-manager/focus.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalDestinationButton.tsx` (+8, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+18, -8)
- `packages/kilo-vscode/webview-ui/src/utils/focus.ts` (+3, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+61, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/script/kilocode/repro-run-stdin-hang.sh` (+142, -0)
- `packages/opencode/src/cli/cmd/run-stdin.ts` (+64, -0)
- `packages/opencode/src/cli/cmd/run.ts` (+7, -1)
- `packages/opencode/test/cli/run/run-stdin.process.test.ts` (+97, -0)
- `packages/opencode/test/cli/run/run-stdin.subprocess.test.ts` (+87, -0)
- `packages/opencode/test/cli/run/run-stdin.unit.test.ts` (+84, -0)
- `packages/opencode/test/kilocode/run-network.test.ts` (+6, -4)
- `packages/opencode/test/lib/cli-process.ts` (+41, -6)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 2819dbc92..564dd16da 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.5.9",
+  "version": "7.5.14",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/ripgrep.ts
```diff
diff --git a/packages/core/src/ripgrep.ts b/packages/core/src/ripgrep.ts
index 71ee912e2..9beaace29 100644
--- a/packages/core/src/ripgrep.ts
+++ b/packages/core/src/ripgrep.ts
@@ -114,6 +114,7 @@ const layer = Layer.effect(
       readonly args: string[]
       readonly limit: number
       readonly signal?: AbortSignal
+      readonly timeout?: number // kilocode_change
       readonly parse: (line: string) => Effect.Effect<A | undefined, Error>
       readonly pattern?: string
       readonly onItem?: (item: A) => Effect.Effect<void>
@@ -128,50 +129,63 @@ const layer = Layer.effect(
             cwd: input.cwd,
             extendEnv: true,
             stdin: "ignore",
-            forceKillAfter: input.stop ? Duration.seconds(1) : undefined, // kilocode_change - bound grep interruption
+            forceKillAfter: input.stop || input.timeout != null ? Duration.seconds(1) : undefined, // kilocode_change - bound search interruption
           })
           const validated = input.validate ? SpawnValidation.attach(command, input.validate) : command
-          const spawned = input.stop ? SpawnExit.attach(validated) : validated // kilocode_change
+          const spawned = input.stop || input.timeout != null ? SpawnExit.attach(validated) : validated // kilocode_change
           const handle = yield* process.spawn(spawned)
-          // kilocode_change end
-          const stderrFiber = yield* collectStream(handle.stderr, ERROR_BYTES).pipe(
-            Effect.map((output) => output.buffer.toString("utf8")),
-            Effect.forkScoped,
-          )
-          let observed = 0
-          let stopped = false // kilocode_change
-          const take = input.stop // kilocode_change start
-            ? Stream.takeUntil<A>((row) => {
-                stopped = input.stop?.(row) ?? false
-                return stopped
-              })
-            : Stream.take(input.limit + 1) // kilocode_change end
-          const rows = yield* Stream.decodeText(handle.stdout).pipe(
-            Stream.splitLines,
-            Stream.filter((line) => line.length > 0),
-            Stream.mapEffect(input.parse),
-            Stream.filter((row): row is A => row !== undefined),
-            Stream.tap((row) => {
-              if (!input.onItem || observed++ >= input.limit) return Effect.void
-              return input.onItem(row)
-            }),
-            take, // kilocode_change
-            Stream.runCollect,
-            Effect.map((chunk) => [...chunk]),
-          )
-          if (stopped) return { items: rows, truncated: true, partial: false } // kilocode_change
```

#### packages/core/test/kilocode/ripgrep-settlement.test.ts
```diff
diff --git a/packages/core/test/kilocode/ripgrep-settlement.test.ts b/packages/core/test/kilocode/ripgrep-settlement.test.ts
index 955aa424a..fdcd8c8c1 100644
--- a/packages/core/test/kilocode/ripgrep-settlement.test.ts
+++ b/packages/core/test/kilocode/ripgrep-settlement.test.ts
@@ -1,10 +1,12 @@
 import { describe, expect } from "bun:test"
 import fs from "node:fs/promises"
 import path from "node:path"
-import { Effect, Fiber, Layer } from "effect"
+import { Cause, Deferred, Effect, Fiber, Layer } from "effect"
+import * as TestClock from "effect/testing/TestClock"
 import { LayerNode } from "@opencode-ai/core/effect/layer-node"
 import { Ripgrep } from "@opencode-ai/core/ripgrep"
 import { RipgrepBinary } from "@opencode-ai/core/ripgrep/binary"
+import { RelativePath } from "@opencode-ai/core/schema"
 import { tmpdir } from "../fixture/tmpdir"
 import { it } from "../lib/effect"
 
@@ -72,15 +74,96 @@ const fixture = async (dir: string, source: string) => {
   return binary
 }
 
-const layer = (binary: string) =>
+const layer = (binary: string, filepath = Effect.succeed(binary)) =>
   LayerNode.compile(Ripgrep.node, [
-    [
-      RipgrepBinary.node,
-      Layer.succeed(RipgrepBinary.Service, RipgrepBinary.Service.of({ filepath: Effect.succeed(binary) })),
-    ],
+    [RipgrepBinary.node, Layer.succeed(RipgrepBinary.Service, RipgrepBinary.Service.of({ filepath }))],
   ] as const)
 
 describe("Kilo ripgrep settlement", () => {
+  it.effect(
+    "starts the glob deadline after cached binary initialization",
+    Effect.acquireUseRelease(
+      Effect.promise(() => tmpdir()),
+      (tmp) =>
+        Effect.gen(function* () {
+          const binary = yield* Effect.promise(() => fixture(tmp.path, 'process.stdout.write("fixture.ts\\n")'))
+          const started = yield* Deferred.make<void>()
+          const release = yield* Deferred.make<void>()
+          const state = { initialized: 0 }
+          const filepath = yield* Effect.cached(
+            Effect.gen(function* () {
+              state.initialized++
+              yield* Deferred.succeed(started, undefined)
+              yield* Deferred.await(release)
+              return binary
+            }),
```


## opencode Changes (3f31139..e289456)

### Commits

- e289456 - fix(console): openai usage normalization and tier threshold config (#47342) (黑墨水鱼, 2026-09-05)
- 70b4ca8 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-09-04)
- 4db1eec - update zen docs (Frank, 2026-09-04)
- 79903a4 - chore: generate (opencode-agent[bot], 2026-09-05)
- e8548ae - update zen models (Frank, 2026-09-04)
- 7774580 - zen: add muse spark (Frank, 2026-09-04)
- 5b1e319 - sync release versions for v1.18.29 (opencode, 2026-09-04)
- 02a167e - fix(opencode): compare Codex GPT versions by major and minor (#47385) (Aiden Cline, 2026-09-04)
- 500c46e - fix(opencode): allow integer GPT versions in Codex model filter (#47384) (Aiden Cline, 2026-09-04)
- 5cf9f51 - feat(console): add quota reset support action (#47313) (黑墨水鱼, 2026-09-05)
- 5d5c35e - docs(zh): fix bold rendering by adding spaces around asterisks (#46231) (Peter267, 2026-09-04)
- 51f86c8 - sync release versions for v1.18.28 (opencode, 2026-09-04)
- 20a7743 - docs(go): renew DeepSeek ZDR through September 2026 (#47288) (Jack, 2026-09-04)
- 31afdd5 - chore: generate (opencode-agent[bot], 2026-09-04)
- 4178fd7 - fix(stats): hide stealth model providers (Adam, 2026-09-04)

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
- `packages/console/core/package.json` (+1, -1)
- `packages/console/core/src/model.ts` (+7, -1)
- `packages/console/core/src/quota.ts` (+65, -0)
- `packages/console/core/test/model.test.ts` (+49, -0)
- `packages/core/package.json` (+1, -1)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+28, -28)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/i18n/ar.ts` (+1, -1)
- `packages/console/app/src/i18n/br.ts` (+1, -1)
- `packages/console/app/src/i18n/da.ts` (+1, -1)
- `packages/console/app/src/i18n/de.ts` (+1, -1)
- `packages/console/app/src/i18n/en.ts` (+1, -1)
- `packages/console/app/src/i18n/es.ts` (+1, -1)
- `packages/console/app/src/i18n/fr.ts` (+1, -1)
- `packages/console/app/src/i18n/it.ts` (+1, -1)
- `packages/console/app/src/i18n/ja.ts` (+1, -1)
- `packages/console/app/src/i18n/ko.ts` (+1, -1)
- `packages/console/app/src/i18n/no.ts` (+1, -1)
- `packages/console/app/src/i18n/pl.ts` (+1, -1)
- `packages/console/app/src/i18n/ru.ts` (+1, -1)
- `packages/console/app/src/i18n/th.ts` (+1, -1)
- `packages/console/app/src/i18n/tr.ts` (+1, -1)
- `packages/console/app/src/i18n/uk.ts` (+1, -1)
- `packages/console/app/src/i18n/zh.ts` (+1, -1)
- `packages/console/app/src/i18n/zht.ts` (+1, -1)
- `packages/console/app/src/routes/api/support/actions/reset-quota.ts` (+24, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+2, -1)
- `packages/console/app/src/routes/zen/util/provider/openai.ts` (+4, -1)
- `packages/console/app/test/providerUsage.test.ts` (+19, -3)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/plugin/openai/codex.ts` (+5, -2)
- `packages/opencode/test/plugin/codex.test.ts` (+35, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/component/model-compare-detail.tsx` (+36, -22)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+60, -42)
- `packages/stats/app/src/routes/compare-cards.tsx` (+17, -13)
- `packages/stats/app/src/routes/compare-radar.tsx` (+2, -2)
- `packages/stats/app/src/routes/index.css` (+8, -0)
- `packages/stats/app/src/routes/index.tsx` (+41, -12)
- `packages/stats/app/src/routes/model-catalog.ts` (+10, -0)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/bs/go.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/da/go.mdx` (+1, -1)
- `packages/web/src/content/docs/da/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/de/go.mdx` (+1, -1)
- `packages/web/src/content/docs/de/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/es/go.mdx` (+1, -1)
- `packages/web/src/content/docs/es/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/fr/go.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/go.mdx` (+1, -1)
- `packages/web/src/content/docs/it/go.mdx` (+1, -1)
- `packages/web/src/content/docs/it/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/ja/go.mdx` (+1, -1)
- `packages/web/src/content/docs/ja/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/ko/go.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/nb/go.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/pl/go.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/pt-br/go.mdx` (+1, -1)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/ru/go.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/th/go.mdx` (+1, -1)
- `packages/web/src/content/docs/th/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/tr/go.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/zh-cn/enterprise.mdx` (+7, -7)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+14, -9)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+14, -9)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 3409dbd..23aade0 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.27",
+  "version": "1.18.29",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/model.ts
```diff
diff --git a/packages/console/core/src/model.ts b/packages/console/core/src/model.ts
index ffba490..d18ccc2 100644
--- a/packages/console/core/src/model.ts
+++ b/packages/console/core/src/model.ts
@@ -19,11 +19,17 @@ export namespace ZenData {
     cacheWrite1h: z.number().optional(),
   })
 
+  // Long-context tier. The flip threshold defaults to 200_000 for backward
+  // compatibility with existing ZEN_MODELS secrets.
+  const ModelCostTierSchema = ModelCostSchema.extend({
+    threshold: z.number().default(200_000),
+  })
+
   const ModelSchema = z.object({
     name: z.string(),
     cost: ModelCostSchema,
     costMultiplier: z.number().default(1),
-    cost200K: ModelCostSchema.optional(),
+    cost200K: ModelCostTierSchema.optional(),
     costPeak: ModelCostSchema.optional(),
     allowAnonymous: z.boolean().optional(),
     byokProvider: z.enum(["openai", "anthropic", "google"]).optional(),
```

#### packages/console/core/src/quota.ts
```diff
diff --git a/packages/console/core/src/quota.ts b/packages/console/core/src/quota.ts
new file mode 100644
index 0000000..856cbab
--- /dev/null
+++ b/packages/console/core/src/quota.ts
@@ -0,0 +1,65 @@
+import { z } from "zod"
+import { and, Database, eq, isNull } from "./drizzle"
+import { LiteTable, SubscriptionTable } from "./schema/billing.sql"
+import { Identifier } from "./identifier"
+import { fn } from "./util/fn"
+
+export namespace Quota {
+  // Zero all usage counters of one plan for a workspace, using the same
+  // workspace-scoped addressing as unsubscribeLite/unsubscribeBlack and
+  // Billing.subtractLiteUsage. Timestamps are left untouched on purpose: a
+  // zeroed counter with a current-window stamp reads as empty and the next
+  // write accumulates on top of zero, so the active windows stay undisturbed.
+  export const reset = fn(
+    z.object({
+      workspaceID: Identifier.schema("workspace"),
+      plan: z.enum(["lite", "subscription"]),
+    }),
+    async (input) => {
+      if (input.plan === "lite") {
+        return Database.transaction(async (db) => {
+          const where = and(eq(LiteTable.workspaceID, input.workspaceID), isNull(LiteTable.timeDeleted))
+          const rows = await db
+            .select({
+              rollingUsage: LiteTable.rollingUsage,
+              weeklyUsage: LiteTable.weeklyUsage,
+              monthlyUsage: LiteTable.monthlyUsage,
+            })
+            .from(LiteTable)
+            .where(where)
+          if (rows.length === 0) throw new Error("No lite usage counters found for workspace")
+
+          await db.update(LiteTable).set({ rollingUsage: 0, weeklyUsage: 0, monthlyUsage: 0 }).where(where)
+          return {
+            plan: "lite" as const,
+            before: {
+              rollingUsage: rows.reduce((sum, row) => sum + (row.rollingUsage ?? 0), 0),
+              weeklyUsage: rows.reduce((sum, row) => sum + (row.weeklyUsage ?? 0), 0),
+              monthlyUsage: rows.reduce((sum, row) => sum + (row.monthlyUsage ?? 0), 0),
+            },
+          }
+        })
+      }
+      if (input.plan === "subscription") {
+        return Database.transaction(async (db) => {
```

#### packages/console/core/test/model.test.ts
```diff
diff --git a/packages/console/core/test/model.test.ts b/packages/console/core/test/model.test.ts
new file mode 100644
index 0000000..bf4204d
--- /dev/null
+++ b/packages/console/core/test/model.test.ts
@@ -0,0 +1,49 @@
+import { describe, expect, test } from "bun:test"
+import { ZenData } from "../src/model"
+
+const base = {
+  zenModels: {
+    "gpt-5.6-sol": {
+      name: "GPT-5.6 Sol",
+      cost: { input: 2, output: 10 },
+      costMultiplier: 1,
+      providers: [{ id: "openai", model: "gpt-5.6-sol" }],
+    },
+  },
+  liteModels: {},
+  providers: { openai: { api: "https://api.openai.com/v1", apiKey: "test" } },
+}
+
+const entry = (data: ReturnType<typeof ZenData.validate>) => {
+  const value = data.zenModels["gpt-5.6-sol"]
+  return Array.isArray(value) ? value[0] : value
+}
+
+describe("ZenData cost200K threshold", () => {
+  test("defaults to 200_000 when not configured", () => {
+    const data = ZenData.validate({
+      ...base,
+      zenModels: {
+        "gpt-5.6-sol": {
+          ...base.zenModels["gpt-5.6-sol"],
+          // The secret arrives as parsed JSON in production, so untyped here too.
+          cost200K: JSON.parse('{"input":4,"output":15}'),
+        },
+      },
+    })
+    expect(entry(data).cost200K?.threshold).toBe(200_000)
+  })
+
+  test("accepts an explicit 272_000 threshold", () => {
+    const data = ZenData.validate({
+      ...base,
+      zenModels: {
+        "gpt-5.6-sol": {
+          ...base.zenModels["gpt-5.6-sol"],
+          cost200K: { input: 4, output: 15, threshold: 272_000 },
+        },
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 0dbf20f..276b0fe 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.27",
+  "version": "1.18.29",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/ripgrep.ts
- `src/core/` - review core changes from packages/core/test/kilocode/ripgrep-settlement.test.ts
