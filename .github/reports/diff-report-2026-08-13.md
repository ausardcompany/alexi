# Upstream Changes Report
Generated: 2026-08-13 07:27:19

## Summary
- kilocode: 48 commits, 94 files changed
- opencode: 21 commits, 84 files changed

## kilocode Changes (64e5dd036..f71154707)

### Commits

- f71154707 - Merge pull request #13077 from Kilo-Org/fix/ci-test-stability-in-process (yzialionka-anaconda, 2026-08-12)
- 7f92ecb8e - Merge pull request #13071 from Kilo-Org/feature/pr-actions-diff-hunk (cosi-conda, 2026-08-12)
- 479459539 - Merge branch 'main' into feature/pr-actions-diff-hunk (cosi-conda, 2026-08-12)
- 9f4ab3a8b - fix(vscode): preserve changes in multi-repo sessions (#13088) (Johnny Eric Amancio, 2026-08-12)
- 938105dad - fix(pr-view): Address bot comment about timing of refreshing pr data (cmanu, 2026-08-12)
- 7d2ba0a5a - Merge branch 'main' into feature/pr-actions-diff-hunk (cosi-conda, 2026-08-12)
- d31a81a92 - Merge pull request #12916 from amypoolside/docs/add-poolside-provider (Joshua Lambert, 2026-08-12)
- 0b9ffe391 - Update packages/kilo-docs/pages/ai-providers/poolside.md (Amy Duquette, 2026-08-12)
- 7671e015f - Merge branch 'main' into docs/add-poolside-provider (Amy Duquette, 2026-08-12)
- 0aaa5cc0c - docs: update Poolside provider setup (amypoolside, 2026-08-12)
- 43775eb17 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-12)
- 5c97b481d - refactor(cli): remove built-in WarpGrep (#13084) (Johnny Eric Amancio, 2026-08-12)
- ef0686eb4 - Merge pull request #13073 from IamCoder18/docs/remove-three-pr-rule (Christiaan Arnoldus, 2026-08-12)
- 74832c468 - Merge branch 'main' into docs/remove-three-pr-rule (Christiaan Arnoldus, 2026-08-12)
- 4431875e8 - fix(ci): reduce Windows CLI test contention (Yury Zialionka, 2026-08-11)
- ec94d8b7c - feat(pr-actions): Prettier (cmanu, 2026-08-11)
- 4ee393478 - fix(pr-actions): Adjut fallback for thread id in parseComments (cmanu, 2026-08-11)
- d96d357cc - fix(pr-actions): Adjust comment total count and loading style; Fetch on resolve/unresolve (cmanu, 2026-08-11)
- 328dbd34a - fix(pr-actions): Adjust typing for better type safety in pr status bridge (cmanu, 2026-08-11)
- 3e3dd3dcb - fix(pr-actions): Add changeset md (cmanu, 2026-08-11)
- 4af09d133 - fix(pr-actions): Use button for clickable pr summary item (cmanu, 2026-08-11)
- 3746ae5dd - fix(pr-actions): post to webview if no cwd (cmanu, 2026-08-11)
- 9fde6825e - feat(pr-actions): Unit test mocks (cmanu, 2026-08-11)
- 851d372fd - feat(pr-actions): Unit test mocks (cmanu, 2026-08-11)
- 0be9469a0 - feat(pr-actions): Unit test mocks (cmanu, 2026-08-11)
- 545145199 - feat(pr-actions): Prettier (cmanu, 2026-08-11)
- b42d83486 - Merge branch 'main' into feature/pr-actions-diff-hunk (cosi-conda, 2026-08-11)
- 58ca25f61 - feat(pr-actions): Unit tests (cmanu, 2026-08-11)
- c7da8a644 - feat(pr-actions): Unit tests (cmanu, 2026-08-11)
- ca4392a42 - docs: remove no-more-than-three-PRs rule (Aarav Sharma, 2026-08-11)
- 6f5b5316a - feat(pr-actions): Unit tests (cmanu, 2026-08-11)
- 7010e7e2c - Merge branch 'main' into feature/pr-actions-diff-hunk (cosi-conda, 2026-08-11)
- 8a9990ddb - feat(pr-actions): Unit tests (cmanu, 2026-08-11)
- 95b2e18d1 - feat(pr-actions): Unit tests (cmanu, 2026-08-11)
- 954ee41f8 - feat(pr-actions): Clear state if index changes (cmanu, 2026-08-11)
- 15d13f340 - feat(pr-actions): Match colors to diff panel and consolidate types (cmanu, 2026-08-11)
- 1ac66c35d - feat(pr-actions): Refresh data on open pr panel (cmanu, 2026-08-11)
- dbf779630 - feat(pr-actions): Scroll to top floating button (cmanu, 2026-08-11)
- de6bb9545 - feat(pr-actions): Prevent scroll on update (cmanu, 2026-08-11)
- 13dd6de2f - feat(pr-actions): Jump to comments (cmanu, 2026-08-11)
- 91773d6bc - feat(pr-actions): Resolve/unresolve comment functionality with error handling. (cmanu, 2026-08-11)
- 599683406 - feat(pr-diff): Jump to comments section; Add unresolve comment function (cmanu, 2026-08-10)
- 66b78dbc7 - feat(pr-diff): Move consts to file and add catch to resolve comment (cmanu, 2026-08-10)
- 695e68500 - feat(pr-diff): Move resolve button / styles and add error message (cmanu, 2026-08-10)
- 3ce2ef189 - feat(pr-diff): Log if no cwd for wt (cmanu, 2026-08-10)
- feb7fc26a - feat(pr-diff): organize files (cmanu, 2026-08-10)
- ada60ca8d - feat(pr-diff): show diff hunk in comments on pr panel (cmanu, 2026-08-10)
- c38f350fb - docs: add Poolside provider page (amypoolside, 2026-08-05)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/registry.ts` (+3, -9)
- `packages/opencode/src/tool/warpgrep.ts` (+0, -110)
- `packages/opencode/src/tool/warpgrep.txt` (+0, -10)
- `packages/opencode/test/kilocode/tool/send-file.test.ts` (+0, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+3, -9)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/v1/config/config.ts` (+0, -1)

#### Other Changes
- `.changeset/multirepo-changes.md` (+5, -0)
- `.changeset/pr-comment-actions.md` (+5, -0)
- `.changeset/remove-builtin-warpgrep.md` (+6, -0)
- `.github/workflows/test.yml` (+15, -1)
- `CONTRIBUTING.md` (+1, -1)
- `bun.lock` (+0, -73)
- `docs/jetbrains-vscode-settings-parity.md` (+1, -2)
- `nix/hashes.json` (+4, -4)
- `packages/kilo-docs/lib/nav/ai-providers.ts` (+1, -0)
- `packages/kilo-docs/pages/ai-providers/index.md` (+1, -0)
- `packages/kilo-docs/pages/ai-providers/poolside.md` (+52, -0)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+1, -1)
- `packages/kilo-docs/pages/contributing/index.md` (+1, -1)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+2, -1)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+0, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+0, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/Message.kt` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+80, -19)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+9, -4)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+44, -0)
- `packages/kilo-vscode/src/agent-manager/pr/PRActions.ts` (+30, -0)
- `packages/kilo-vscode/src/agent-manager/{ => pr}/am-pr-types.ts` (+3, -1)
- `packages/kilo-vscode/src/agent-manager/{ => pr}/am-pr-utils.ts` (+3, -1)
- `packages/kilo-vscode/src/agent-manager/pr/pr-constants.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+18, -0)
- `packages/kilo-vscode/src/diff/DiffViewerProvider.ts` (+20, -6)
- `packages/kilo-vscode/src/extension.ts` (+2, -1)
- `packages/kilo-vscode/src/kilo-provider/session-edits.ts` (+47, -0)
- `packages/kilo-vscode/src/review-utils.ts` (+4, -5)
- `packages/kilo-vscode/tests/unit/am-pr-status-bridge.test.ts` (+84, -2)
- `packages/kilo-vscode/tests/unit/am-pr-utils.test.ts` (+25, -2)
- `packages/kilo-vscode/tests/unit/diff-viewer-provider.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+22, -15)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+34, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-route-integration.test.ts` (+128, -1)
- `packages/kilo-vscode/tests/unit/review-utils.test.ts` (+15, -1)
- `packages/kilo-vscode/tests/unit/session-edits.test.ts` (+38, -0)
- `packages/kilo-vscode/tests/unit/source-controller.test.ts` (+7, -1)
- `packages/kilo-vscode/tests/unit/timeline-colors.test.ts` (+0, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+20, -17)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRComments.tsx` (+119, -24)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanel.tsx` (+44, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRSummary.tsx` (+34, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-panel.css` (+147, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-types.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+0, -13)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/stories/tool-call-lab.stories.tsx` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/utils/timeline/colors.ts` (+1, -1)
- `packages/opencode/package.json` (+0, -1)
- `packages/opencode/script/test-runner.ts` (+57, -8)
- `packages/opencode/src/config/config.ts` (+13, -4)
- `packages/opencode/src/kilocode/config/config.ts` (+13, -4)
- `packages/opencode/src/kilocode/sandbox/network-tools.ts` (+0, -9)
- `packages/opencode/test/kilocode/ask-agent-permissions.test.ts` (+1, -3)
- `packages/opencode/test/kilocode/chart-tool-gating.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/config/config.test.ts` (+73, -2)
- `packages/opencode/test/kilocode/sandbox/network.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/tool-registry-indexing-import-failure.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+14, -35)
- `packages/opencode/test/kilocode/tool-registry-semantic-import-failure.test.ts` (+0, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+0, -1)
- `packages/sdk/openapi.json` (+0, -3)
- `script/architecture-allowlist.json` (+0, -1)
- `script/check-model-tool-network.ts` (+1, -1)

### Key Diffs

#### packages/core/src/v1/config/config.ts
```diff
diff --git a/packages/core/src/v1/config/config.ts b/packages/core/src/v1/config/config.ts
index 75c096509..42d18611e 100644
--- a/packages/core/src/v1/config/config.ts
+++ b/packages/core/src/v1/config/config.ts
@@ -293,7 +293,6 @@ export const Info = Schema.Struct({
       disable_paste_summary: Schema.optional(Schema.Boolean),
       batch_tool: Schema.optional(Schema.Boolean).annotate({ description: "Enable the batch tool" }),
       // kilocode_change start
-      codebase_search: Schema.optional(Schema.Boolean).annotate({ description: "Enable AI-powered codebase search" }),
       image_generation: Schema.optional(Schema.Boolean).annotate({ description: "Enable AI image generation" }),
       image_generation_model: Schema.optional(Schema.String).annotate({
         description: "Model ID to use for image generation (default: openrouter/auto)",
```

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index afaec2ca4..1be61ef82 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -160,7 +160,6 @@ function askGuard(mcp: Record<string, "allow" | "ask" | "deny"> = {}) {
     question: "allow",
     webfetch: "allow",
     websearch: "allow",
-    codebase_search: "allow",
     semantic_search: "allow",
     external_directory: {
       [Truncate.GLOB]: "allow",
@@ -247,7 +246,6 @@ function planGuard(worktree: string, mcp: Record<string, "allow" | "ask" | "deny
     list: "allow",
     webfetch: "allow",
     websearch: "allow",
-    codebase_search: "allow",
     semantic_search: "allow",
     external_directory: {
       [Truncate.GLOB]: "allow",
@@ -373,7 +371,7 @@ export function telemetryOptions(_cfg: Config.Info) {
 // Patch the base agents map in-place with all kilo-specific changes:
 // - Rename build → code
 // - Patch plan with readOnlyBash, mcpRules, .kilo paths
-// - Patch explore with codebase_search and conditional prompt
+// - Patch explore permissions and prompt
 // - Patch appropriate agents with semantic_search
 // - Add debug, orchestrator, ask agents
 export function patchAgents(
@@ -436,7 +434,7 @@ export function patchAgents(
     }
   }
 
-  // Patch explore with codebase_search and conditional prompt
+  // Patch explore permissions and prompt
   if (agents.explore) {
     agents.explore = {
       ...agents.explore,
@@ -451,7 +449,6 @@ export function patchAgents(
           skill: "allow",
           webfetch: "allow",
           websearch: "allow",
-          codebase_search: "allow",
           semantic_search: "allow",
           read: "allow",
           external_directory: {
@@ -466,9 +463,7 @@ export function patchAgents(
         }),
         user,
       ),
```

#### packages/opencode/src/kilocode/tool/registry.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/registry.ts b/packages/opencode/src/kilocode/tool/registry.ts
index bb86481a6..53dfa3132 100644
--- a/packages/opencode/src/kilocode/tool/registry.ts
+++ b/packages/opencode/src/kilocode/tool/registry.ts
@@ -1,4 +1,3 @@
-import { CodebaseSearchTool } from "../../tool/warpgrep"
 import { RecallTool } from "../../tool/recall"
 import { AgentManagerModelsTool } from "./agent-manager-models"
 import { AgentManagerTool } from "./agent-manager"
@@ -68,7 +67,6 @@ export namespace KiloToolRegistry {
 
   export function infos(host?: AgentManager.Interface, notebook?: Notebook.Interface) {
     return Effect.gen(function* () {
-      const codebase = yield* CodebaseSearchTool
       const recall = yield* RecallTool
       const managerModels = yield* AgentManagerModelsTool
       const memory = yield* MemoryRecallTool
@@ -85,13 +83,13 @@ export namespace KiloToolRegistry {
       const notify = yield* NotifyUserTool.pipe(Effect.provideService(KiloSessions.Service, sessions))
       const send = yield* SendFileTool
       if (!notebook)
-        return { codebase, recall, managerModels, memory, save, manager, process, chart, image, terminal, notify, send }
+        return { recall, managerModels, memory, save, manager, process, chart, image, terminal, notify, send }
       const tools = yield* Effect.all({
         notebookRead: NotebookReadTool,
         notebookEdit: NotebookEditTool,
         notebookExecute: NotebookExecuteTool,
       }).pipe(Effect.provideService(Notebook.Service, notebook))
-      return { codebase, recall, managerModels, memory, save, manager, process, chart, image, terminal, notify, send, ...tools }
+      return { recall, managerModels, memory, save, manager, process, chart, image, terminal, notify, send, ...tools }
     })
   }
 
@@ -99,7 +97,6 @@ export namespace KiloToolRegistry {
    * it has no Service deps beyond what Tool.init itself needs. */
   export function build(
     tools: {
-      codebase: Tool.Info
       recall: Tool.Info
       managerModels: Tool.Info
       memory: Tool.Info
@@ -120,7 +117,6 @@ export namespace KiloToolRegistry {
   ) {
     return Effect.gen(function* () {
       const base = yield* Effect.all({
-        codebase: Tool.init(tools.codebase),
         recall: Tool.init(tools.recall),
         managerModels: Tool.init(tools.managerModels),
         memory: Tool.init(tools.memory),
@@ -194,7 +190,6 @@ export namespace KiloToolRegistry {
```

#### packages/opencode/src/tool/warpgrep.ts
```diff
diff --git a/packages/opencode/src/tool/warpgrep.ts b/packages/opencode/src/tool/warpgrep.ts
deleted file mode 100644
index 891eb0e3f..000000000
--- a/packages/opencode/src/tool/warpgrep.ts
+++ /dev/null
@@ -1,110 +0,0 @@
-import { Effect, Schema } from "effect"
-import * as Tool from "./tool"
-import { WarpGrepClient } from "@morphllm/morphsdk/tools/warp-grep/client" // kilocode_change
-import { Telemetry } from "@kilocode/kilo-telemetry" // kilocode_change
-import { Instance } from "../kilocode/instance" // kilocode_change
-import { EventV2Bridge } from "@/event-v2-bridge" // kilocode_change
-import { TuiEvent } from "@/server/tui-event" // kilocode_change
-import DESCRIPTION from "./warpgrep.txt"
-
-// FREE_PERIOD_TODO: Remove KILO_WARPGREP_PROXY_URL constant and the proxy
-// fallback below. After the free period ends, require MORPH_API_KEY and
-// return an error when it is missing.
-const KILO_WARPGREP_PROXY_URL = "https://api.kilo.ai/api/gateway"
-
-const Parameters = Schema.Struct({
-  query: Schema.String.annotate({
-    description: "Search query describing what code you are looking for. Be specific and descriptive for best results.", // kilocode_change
-  }),
-})
-
-export const CodebaseSearchTool = Tool.define(
-  "codebase_search",
-  Effect.gen(function* () {
-    const events = yield* EventV2Bridge.Service // kilocode_change
-    return {
-      description: DESCRIPTION,
-      parameters: Parameters,
-      execute: (params: Schema.Schema.Type<typeof Parameters>, ctx: Tool.Context) =>
-        Effect.gen(function* () {
-          yield* ctx.ask({
-            permission: "codebase_search",
-            patterns: [params.query],
-            always: ["*"],
-            metadata: { query: params.query },
-          })
-          Telemetry.trackToolUsed("codebase_search", ctx.sessionID) // kilocode_change
-
-          const apiKey = process.env["MORPH_API_KEY"]
-
-          // FREE_PERIOD_TODO: Remove proxy fallback — require apiKey, error if missing:
-          //   if (!apiKey) return { title: ..., output: "Set MORPH_API_KEY to use codebase search.", metadata: {} }
-          const client = new WarpGrepClient({
-            morphApiKey: apiKey ?? "kilo-free",
-            ...(apiKey ? {} : { morphApiUrl: KILO_WARPGREP_PROXY_URL }),
```

#### packages/opencode/src/tool/warpgrep.txt
```diff
diff --git a/packages/opencode/src/tool/warpgrep.txt b/packages/opencode/src/tool/warpgrep.txt
deleted file mode 100644
index bcb282d3a..000000000
--- a/packages/opencode/src/tool/warpgrep.txt
+++ /dev/null
@@ -1,10 +0,0 @@
-- Searches the codebase using a natural language search string
-- Takes a natural language search string as input: a question about something you want to understand, or a description of what you're looking for
-- This is not pattern matching or semantic search — it is an AI-powered search agent that performs intelligent multi-step searches across the repository, returning only the most relevant spans
-- Use this when you're looking for a feature or implementation, or trying to understand how something works in a large codebase but are unclear about the exact patterns to search for
-
-Usage notes:
-  - This does NOT accept regex or keyword dumps — use natural language
-  - Best practice is using this at the start of long codebase explorations when you haven't yet mapped out the relevant areas
-  - Firing two or three concurrent codebase_search calls at different angles helps go through a large codebase faster
-  - This tool is read-only and does not modify any files
\ No newline at end of file
```


*... and more files (showing first 5)*

## opencode Changes (1f94d8a..cc4b456)

### Commits

- cc4b456 - sync release versions for v1.18.18 (opencode, 2026-08-13)
- 14b37df - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-12)
- 91df883 - fix(opencode): select Kimi prompt by provider (#42161) (opencode-agent[bot], 2026-08-12)
- 6fea419 - fix(groq): pass through reasoning effort (#42166) (opencode-agent[bot], 2026-08-12)
- beeabe2 - fix(mistral): pass through reasoning effort (#42164) (opencode-agent[bot], 2026-08-12)
- 502310f - fix(xai): pass through reasoning effort (#42160) (opencode-agent[bot], 2026-08-12)
- 37fe5c8 - sync release versions for v1.18.17 (opencode, 2026-08-12)
- dab2637 - fix(compaction): adjust instructions and structure to be more clear to smaller models like dsv4 flash (#42045) (Aiden Cline, 2026-08-12)
- 39fb919 - chore: add neriousy to team members (#42107) (opencode-agent[bot], 2026-08-12)
- 999be62 - chore: generate (opencode-agent[bot], 2026-08-12)
- 521906f - docs(go): clarify DeepSeek ZDR coverage (#42085) (opencode-agent[bot], 2026-08-12)
- 069165e - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-12)
- df09c3e - update ds v4 pro (Frank, 2026-08-12)
- 6d3ae4d - chore: generate (opencode-agent[bot], 2026-08-12)
- 284187a - fix(ci): authenticate pulumi downloads (Adam, 2026-08-12)
- 7e0353c - fix(stats): correct r2 daily totals (Adam, 2026-08-12)
- 959c8bd - docs: fix provider display name and PAT typos (#42034) (SKY ZHAO, 2026-08-12)
- ca3df21 - docs: fix broken DigitalOcean and Daytona links (#42048) (SKY ZHAO, 2026-08-12)
- 8571a92 - fix(provider): add Merge Gateway reasoning variants (#41867) (Matthew Feroz, 2026-08-12)
- d92d1e6 - docs(zen): add Grok 4.6 (Frank, 2026-08-12)
- 46a14e6 - feat(stats): query r2 data catalog (Adam, 2026-08-12)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `.opencode/tool/github-triage.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/prompt/compaction.txt` (+2, -6)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/plugin/agent.ts` (+2, -6)
- `packages/core/src/session/compaction.ts` (+25, -19)
- `packages/core/src/v1/config/config.ts` (+1, -1)
- `packages/core/test/provider-groq.test.ts` (+28, -0)
- `packages/core/test/provider-mistral.test.ts` (+26, -0)
- `packages/core/test/provider-xai-responses.test.ts` (+53, -0)
- `packages/core/test/session-compaction.test.ts` (+20, -0)
- `packages/core/test/session-runner.test.ts` (+62, -1)
- `packages/stats/core/package.json` (+2, -1)
- `packages/stats/core/src/domain/inference.test.ts` (+50, -1)
- `packages/stats/core/src/domain/inference.ts` (+147, -105)
- `packages/stats/core/src/r2-sql.ts` (+105, -0)
- `packages/stats/core/src/resource.d.ts` (+11, -0)
- `packages/stats/core/src/stat-sync.ts` (+14, -13)

#### Other Changes
- `.github/TEAM_MEMBERS` (+1, -0)
- `.github/workflows/deploy.yml` (+1, -0)
- `bun.lock` (+29, -28)
- `infra/stats.ts` (+13, -1)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -1)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+1, -1)
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
- `packages/opencode/src/provider/transform.ts` (+3, -0)
- `packages/opencode/src/session/compaction.ts` (+24, -17)
- `packages/opencode/src/session/system.ts` (+5, -1)
- `packages/opencode/test/provider/provider.test.ts` (+27, -0)
- `packages/opencode/test/provider/transform.test.ts` (+20, -0)
- `packages/opencode/test/session/compaction.test.ts` (+71, -2)
- `packages/opencode/test/session/system.test.ts` (+7, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/stats/server/src/stat-sync.ts` (+5, -5)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/es/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/github.mdx` (+1, -1)
- `packages/web/src/content/docs/go.mdx` (+3, -3)
- `packages/web/src/content/docs/it/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/providers.mdx` (+3, -3)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+3, -0)
- `patches/@ai-sdk%2Fgroq@3.0.31.patch` (+79, -0)
- `patches/@ai-sdk%2Fmistral@3.0.51.patch` (+16, -11)
- `patches/@ai-sdk%2Fxai@3.0.102.patch` (+115, -7)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### .opencode/tool/github-triage.ts
```diff
diff --git a/.opencode/tool/github-triage.ts b/.opencode/tool/github-triage.ts
index e861e1e..d610a81 100644
--- a/.opencode/tool/github-triage.ts
+++ b/.opencode/tool/github-triage.ts
@@ -4,7 +4,7 @@ import { tool } from "@opencode-ai/plugin"
 const TEAM = {
   tui: ["kommander", "simonklee"],
   desktop_web: ["Hona", "Brendonovich"],
-  core: ["jlongster", "rekram1-node", "nexxeln", "kitlangton"],
+  core: ["jlongster", "rekram1-node", "neriousy", "nexxeln", "kitlangton"],
   inference: ["fwang", "MrMushrooooom", "starptech"],
   windows: ["Hona"],
 } as const
```

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 6313e41..a0a1676 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.16",
+  "version": "1.18.18",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index f682e9e..96c989d 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.16",
+  "version": "1.18.18",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/plugin/agent.ts
```diff
diff --git a/packages/core/src/plugin/agent.ts b/packages/core/src/plugin/agent.ts
index 9a763c7..915df79 100644
--- a/packages/core/src/plugin/agent.ts
+++ b/packages/core/src/plugin/agent.ts
@@ -30,15 +30,11 @@ Guidelines:
 
 Complete the user's search request efficiently and report your findings clearly.`
 
-const PROMPT_COMPACTION = `You are an anchored context summarization assistant for coding sessions.
-
-Summarize only the conversation history you are given. The newest turns may be kept verbatim outside your summary, so focus on the older context that still matters for continuing the work.
-
-If the prompt includes a <previous-summary> block, treat it as the current anchored summary. Update it with the new history by preserving still-true details, removing stale details, and merging in new facts.
+const PROMPT_COMPACTION = `You are a context summarization agent. You are given a conversation between a user and an agent. Your goal is to produce a structured summary matching the format specified so another coding agent can continue the work.
 
 Always follow the exact output structure requested by the user prompt. Keep every section, preserve exact file paths and identifiers when known, and prefer terse bullets over paragraphs.
 
-Do not answer the conversation itself. Do not mention that you are summarizing, compacting, or merging context. Respond in the same language as the conversation.`
+Do not continue the conversation. Do not respond to any questions in the conversation. Only output the structured summary in the exact format requested by the user prompt. Respond in the same language as the conversation.`
 
 const PROMPT_TITLE = `You are a title generator. You output ONLY a thread title. Nothing else.
 
```

#### packages/core/src/session/compaction.ts
```diff
diff --git a/packages/core/src/session/compaction.ts b/packages/core/src/session/compaction.ts
index 4b21ff3..ea4cf04 100644
--- a/packages/core/src/session/compaction.ts
+++ b/packages/core/src/session/compaction.ts
@@ -44,6 +44,15 @@ Rules:
 - Use terse bullets, not prose paragraphs.
 - Preserve exact file paths, symbols, commands, error strings, URLs, and identifiers when known.
 - Do not mention the summary process or that context was compacted.`
+const SUMMARY_UPDATE_INSTRUCTIONS = `The <prior-summary> summarizes everything that happened before the <conversation>. Construct a new summary that combines both. The <prior-summary> is discarded after this: anything you do not carry into the new summary is lost.
+
+When combining:
+- Carry forward objectives, constraints, user directives, decisions, and parallel workstreams from the <prior-summary> even when the <conversation> does not mention them. Drop only what is finished and no longer needed.
+- The <conversation> is more recent than the <prior-summary>. Where they conflict, the conversation wins: state the corrected fact and drop the old claim.
+- Add new progress, decisions, constraints, and context from the conversation.
+- Move completed work from "Active" to "Completed".
+- If a blocker has been resolved, update the summary to reflect that while keeping any details still needed to continue the work.
+- Update "Objective" and "Next Move" to reflect the current work state.`
 
 type Entry = {
   readonly seq: number
@@ -136,36 +145,33 @@ const select = (
   if (conversation.length === 0) return
   let total = 0
   let split = conversation.length
-  let splitPrefix = ""
-  let splitSuffix = ""
   for (let index = conversation.length - 1; index >= 0; index--) {
     const next = total + Token.estimate(conversation[index])
-    if (next > tokens) {
-      const remaining = Math.max(0, tokens - total) * 4
-      if (remaining > 0) {
-        splitPrefix = conversation[index].slice(0, -remaining)
-        splitSuffix = conversation[index].slice(-remaining)
-        split = index + 1
-      }
-      break
-    }
+    if (next > tokens) break
     total = next
     split = index
   }
   return {
-    head: [...conversation.slice(0, split), splitPrefix].filter(Boolean).join("\n\n"),
-    recent: [splitSuffix, ...conversation.slice(split)].filter(Boolean).join("\n\n"),
+    head: conversation.slice(0, split).join("\n\n"),
+    recent: conversation.slice(split).join("\n\n"),
   }
 }
 
-export const buildPrompt = (input: { readonly previousSummary?: string; readonly context: readonly string[] }) =>
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/prompt/compaction.txt
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/tool/github-triage.ts` - update based on opencode .opencode/tool/github-triage.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/send-file.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/send-file.test.ts changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
- `src/tool/warpgrep.txt.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.txt changes
