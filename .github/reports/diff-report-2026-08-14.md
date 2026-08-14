# Upstream Changes Report
Generated: 2026-08-14 07:25:05

## Summary
- kilocode: 55 commits, 144 files changed
- opencode: 17 commits, 50 files changed

## kilocode Changes (f71154707..67cda85c9)

### Commits

- 67cda85c9 - release: v7.4.22 (kilo-maintainer[bot], 2026-08-13)
- e9a3aa035 - test(cli): wait for default agent before permission create (#13113) (Johnny Eric Amancio, 2026-08-13)
- f4cba053a - fix(cli): preserve session agent for headless prompts (#13102) (Quan Zhuo, 2026-08-13)
- b5f5d9f22 - fix(tui): stop leftover toast titles during update install (#13114) (Johnny Eric Amancio, 2026-08-13)
- 330bd7e2d - docs: document --worktree flag in CLI reference (#13111) (Johnny Eric Amancio, 2026-08-13)
- 3a99f36d9 - fix(cli): stop read-only agent bash denies from blocking delegated subagents (#12373) (Matt Van Horn, 2026-08-13)
- 738163bb1 - fix(cli): surface commit-message generation errors (#13108) (Johnny Eric Amancio, 2026-08-13)
- 12c392ce4 - test(cli): optimize httpapi exerciser by removing redundant git fixtures and isolating scenario passes (#13091) (Aarav, 2026-08-13)
- 746fa974e - fix(cli): keep models.dev refresh errors off the TUI (#13107) (Johnny Eric Amancio, 2026-08-13)
- e396ccc9f - Merge pull request #13063 from Kilo-Org/fix/vscode-default-model-variant (Christiaan Arnoldus, 2026-08-13)
- 568beb5a8 - Merge pull request #13106 from Kilo-Org/docs/bedrock-vertex-setup (Christiaan Arnoldus, 2026-08-13)
- c8e9c3bf8 - fix(cli): surface real --cloud-fork import failure reasons (#12388) (rakshith1928, 2026-08-13)
- bf7582249 - docs: match provider submit labels (chrarnoldus, 2026-08-13)
- 6ee0872b1 - docs: update Bedrock and Vertex setup (chrarnoldus, 2026-08-13)
- b016c617e - Merge pull request #13100 from Kilo-Org/fix/vscode-cloud-provider-credential-setup (Christiaan Arnoldus, 2026-08-13)
- 9b01d97cf - fix(vscode): preserve revert workspace status (#13104) (Johnny Eric Amancio, 2026-08-13)
- a6723b0cd - fix(vscode): preserve explicit default variant (Christiaan Arnoldus, 2026-08-13)
- a6283d3bf - fix(vscode): avoid default variant collision (Christiaan Arnoldus, 2026-08-13)
- 82560c046 - Merge branch 'main' into fix/vscode-default-model-variant (Christiaan Arnoldus, 2026-08-13)
- 509bb87fe - fix(vscode): constrain Vertex credentials editor (chrarnoldus, 2026-08-13)
- 5cc0470f3 - Merge branch 'main' into fix/vscode-cloud-provider-credential-setup (Christiaan Arnoldus, 2026-08-13)
- 8013e5f50 - feat(ui): parse and render clickable file links (#11219) (sylwester-liljegren, 2026-08-13)
- 8db4d5ec0 - Merge pull request #12809 from Kilo-Org/feat/worktree-for-cli (bagatao@anaconda.com, 2026-08-13)
- 6b2a71637 - Merge branch 'main' into feat/worktree-for-cli (bagatao@anaconda.com, 2026-08-13)
- b8d5a81ce - fix: keep cloud credentials private (chrarnoldus, 2026-08-13)
- 7bc71ef71 - fix(vscode): include cloud auth locale fallback (chrarnoldus, 2026-08-13)
- 753d56098 - fix(vscode): support Bedrock and Vertex credentials (chrarnoldus, 2026-08-13)
- 0af6c2d8f - Merge branch 'main' into feat/worktree-for-cli (bagatao@anaconda.com, 2026-08-12)
- 6efc88c8b - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-11)
- d04252f2b - fix(vscode): hide empty variant selector (Christiaan Arnoldus, 2026-08-11)
- ebb693a9f - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-11)
- ca9a99ffd - fix(vscode): show default model variant (Christiaan Arnoldus, 2026-08-11)
- 8f70f8f1c - Merge remote-tracking branch 'origin/main' into feat/worktree-for-cli (Bruno Agatao, 2026-08-07)
- 6f9f2309f - Merge branch 'feat/worktree-for-cli' of github.com:Kilo-Org/kilocode into feat/worktree-for-cli (Bruno Agatao, 2026-08-07)
- b93b97557 - fix(cli): use Effect.tryPromise instead of Effect.promise for lazy @/worktree import (Bruno Agatao, 2026-08-07)
- 8294c69ee - Merge branch 'main' into feat/worktree-for-cli (bagatao@anaconda.com, 2026-08-07)
- 91747c04a - docs: update worktree-for-cli changeset to cover create/list/remove and /worktree (Bruno Agatao, 2026-08-06)
- 7d74034a8 - Merge remote-tracking branch 'origin/main' into feat/worktree-for-cli (Bruno Agatao, 2026-08-06)
- e344cea70 - fix(cli): lazy-import @/worktree in worktree.ts to unblock cli-shutdown test (Bruno Agatao, 2026-08-06)
- 914b67e1a - Merge remote-tracking branch 'origin/main' into feat/worktree-for-cli (Bruno Agatao, 2026-08-06)
- aac78b2ad - Merge branch 'feat/worktree-for-cli' of github.com:Kilo-Org/kilocode into feat/worktree-for-cli (Bruno Agatao, 2026-08-06)
- b57cfdce4 - feat(cli): add kilo worktree create/list/remove commands and TUI alias (Bruno Agatao, 2026-08-06)
- a8290bf83 - Merge branch 'main' into feat/worktree-for-cli (bagatao@anaconda.com, 2026-08-06)
- 142575ae7 - Merge branch 'main' into feat/worktree-for-cli (bagatao@anaconda.com, 2026-08-06)
- 7c25f5b5a - Merge remote-tracking branch 'origin/main' into feat/worktree-for-cli (Bruno Agatao, 2026-08-05)
- 4fdaa4c41 - refactor(cli): tighten tui-worktree, log exclude-write failures, fix event count (Bruno Agatao, 2026-08-05)
- 90989d451 - fix(cli): update tui-worktree to use Database.layerFromPath after upstream merge (Bruno Agatao, 2026-08-05)
- e6214f7e8 - Merge remote-tracking branch 'origin/main' into feat/worktree-for-cli (Bruno Agatao, 2026-08-05)
- f3e93ecb3 - fix(cli): don't force-delete pre-existing branches when reclaiming a worktree (Bruno Agatao, 2026-08-05)
- 627e24deb - refactor(cli): tighten tui-worktree implementation and note reuse limitation (Bruno Agatao, 2026-08-04)
- 0d7879112 - Merge remote-tracking branch 'origin/main' into feat/worktree-for-cli (Bruno Agatao, 2026-08-04)
- 2762d09c5 - fix(cli): wait for worktree setup and align --worktree with Agent Manager's layout (Bruno Agatao, 2026-08-04)
- 8e13edec6 - Merge remote-tracking branch 'origin/main' into feat/worktree-for-cli (Bruno Agatao, 2026-08-03)
- fb5f41082 - fix(cli): prune stale worktree registrations and avoid full app bootstrap for --session resume (Bruno Agatao, 2026-08-03)
- 907f7dfcf - feat(cli): add --worktree flag to create/reuse a git worktree for the TUI (Bruno Agatao, 2026-08-03)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/task.ts` (+16, -4)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+1, -0)
- `packages/opencode/src/kilocode/agent/index.ts` (+25, -1)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+103, -3)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/models-dev.ts` (+11, -2)
- `packages/core/test/kilocode/models-dev-logger.test.ts` (+65, -0)

#### Other Changes
- `.changeset/multirepo-changes.md` (+0, -5)
- `.changeset/opencode-v1-17-13-to-v1-18-0.md` (+0, -30)
- `.changeset/opencode-v1-18-1-to-v1-18-13.md` (+0, -6)
- `.changeset/pr-comment-actions.md` (+0, -5)
- `.changeset/remove-builtin-warpgrep.md` (+0, -6)
- `.changeset/steady-migration-journal.md` (+0, -5)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+33, -33)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/client/src/generated/types.ts` (+6, -0)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/bedrock.md` (+20, -7)
- `packages/kilo-docs/pages/ai-providers/vertex.md` (+15, -8)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+1, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/default-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-model-override-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-model-override-420-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+150, -7)
- `packages/kilo-ui/src/file-link-validator.test.ts` (+70, -0)
- `packages/kilo-ui/src/file-link-validator.ts` (+179, -0)
- `packages/kilo-ui/src/file-path.ts` (+0, -68)
- `packages/kilo-vscode/CHANGELOG.md` (+49, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+3, -1)
- `packages/kilo-vscode/src/kilo-provider/editor-actions.ts` (+11, -3)
- `packages/kilo-vscode/src/kilo-provider/file-links.ts` (+18, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/revert-checkpoints.test.ts` (+10, -5)
- `packages/kilo-vscode/tests/unit/session-variant-store.test.ts` (+12, -2)
- `packages/kilo-vscode/tests/unit/session-variants.test.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+6, -4)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+14, -8)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProviderConnectDialog.tsx` (+133, -13)
- `packages/kilo-vscode/webview-ui/src/components/shared/ThinkingSelector.tsx` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-variant-store.ts` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/context/session-variants.ts` (+9, -6)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/cloud-provider.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+9, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+55, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/attach.ts` (+7, -6)
- `packages/opencode/src/cli/cmd/run.ts` (+21, -21)
- `packages/opencode/src/cli/cmd/tui.ts` (+22, -7)
- `packages/opencode/src/kilocode/cli/cmd/tui-worktree.ts` (+216, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/thread.ts` (+10, -8)
- `packages/opencode/src/kilocode/cli/cmd/worktree.ts` (+99, -0)
- `packages/opencode/src/kilocode/cli/setup.ts` (+2, -0)
- `packages/opencode/src/kilocode/cloud-session.ts` (+39, -3)
- `packages/opencode/src/kilocode/provider/cloud-auth.ts` (+69, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/commit-message.ts` (+4, -2)
- `packages/opencode/src/kilocode/server/httpapi/handlers/commit-message.ts` (+4, -1)
- `packages/opencode/src/provider/provider.ts` (+25, -16)
- `packages/opencode/src/session/prompt.ts` (+1, -1)
- `packages/opencode/src/worktree/index.ts` (+12, -0)
- `packages/opencode/test/event-manifest.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/cli/cmd/tui-worktree.test.ts` (+56, -0)
- `packages/opencode/test/kilocode/cloud-session.test.ts` (+54, -0)
- `packages/opencode/test/kilocode/headless-session-agent.test.ts` (+73, -0)
- `packages/opencode/test/kilocode/provider/cloud-auth.test.ts` (+81, -0)
- `packages/opencode/test/kilocode/server/commit-message-no-changes.test.ts` (+27, -1)
- `packages/opencode/test/kilocode/server/httpapi-exercise-ready.ts` (+25, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+3, -0)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+3, -1)
- `packages/opencode/test/server/httpapi-exercise/backend.ts` (+18, -0)
- `packages/opencode/test/server/httpapi-exercise/dsl.ts` (+5, -3)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+76, -42)
- `packages/opencode/test/server/httpapi-exercise/routing.ts` (+22, -0)
- `packages/opencode/test/server/httpapi-exercise/runtime.ts` (+8, -0)
- `packages/opencode/test/server/httpapi-exercise/types.ts` (+1, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/schema/src/revert.ts` (+1, -0)
- `packages/schema/src/v1/session.ts` (+1, -0)
- `packages/schema/src/worktree-event.ts` (+11, -1)
- `packages/schema/test/kilocode/revert-workspace.test.ts` (+37, -0)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+56, -2)
- `packages/sdk/openapi.json` (+172, -2)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/app.tsx` (+1, -0)
- `packages/tui/src/ui/toast.tsx` (+2, -1)
- `packages/tui/test/kilocode/toast.test.tsx` (+37, -0)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/components/markdown.css` (+18, -0)
- `packages/ui/src/context/data.tsx` (+9, -2)
- `packages/ui/src/context/marked.tsx` (+44, -12)
- `packages/ui/src/file-path.test.ts` (+205, -138)
- `packages/ui/src/file-path.ts` (+80, -32)
- `packages/ui/src/kilocode/markdown-bidi.test.ts` (+49, -2)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 085a70bef..fbc64130a 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.4.21",
+  "version": "7.4.22",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/models-dev.ts
```diff
diff --git a/packages/core/src/models-dev.ts b/packages/core/src/models-dev.ts
index 4e6128091..2a46d342f 100644
--- a/packages/core/src/models-dev.ts
+++ b/packages/core/src/models-dev.ts
@@ -1,5 +1,5 @@
 import path from "path"
-import { Context, Duration, Effect, Layer, Option, Schedule, Schema } from "effect"
+import { Context, Duration, Effect, Layer, Logger, Option, Schedule, Schema } from "effect" // kilocode_change
 import { FetchHttpClient, HttpClient, HttpClientRequest } from "effect/unstable/http"
 import { ModelsDev } from "@opencode-ai/schema/models-dev"
 import { Global } from "./global"
@@ -12,6 +12,7 @@ import * as ModelsRefresh from "./kilocode/models-refresh" // kilocode_change
 import { EventV2 } from "./event"
 import { makeGlobalNode } from "./effect/app-node"
 import { httpClient } from "./effect/app-node-platform"
+import { Observability } from "./observability" // kilocode_change
 
 export const CatalogModelStatus = Schema.Literals(["alpha", "beta", "deprecated"])
 export type CatalogModelStatus = typeof CatalogModelStatus.Type
@@ -156,6 +157,7 @@ const layer = Layer.effect(
   Effect.gen(function* () {
     const fs = yield* FSUtil.Service
     const events = yield* EventV2.Service
+    const loggers = yield* Effect.service(Logger.CurrentLoggers) // kilocode_change
     const http = HttpClient.filterStatusOk(
       (yield* HttpClient.HttpClient).pipe(
         HttpClient.retryTransient({
@@ -259,6 +261,7 @@ const layer = Layer.effect(
       ).pipe(
         Effect.tapCause((cause) => Effect.logError("Failed to fetch models.dev", { cause: cause })),
         Effect.ignore,
+        Effect.provideService(Logger.CurrentLoggers, loggers), // kilocode_change
       )
     })
 
@@ -271,6 +274,12 @@ const layer = Layer.effect(
   }),
 )
 
-export const node = makeGlobalNode({ service: Service, layer: layer, deps: [FSUtil.node, EventV2.node, httpClient] })
+// kilocode_change start - capture file/OTLP loggers before the refresh fork
+export const node = makeGlobalNode({
+  service: Service,
+  layer: layer,
+  deps: [FSUtil.node, EventV2.node, httpClient, Observability.node],
+})
+// kilocode_change end
 
 export * as ModelsDev from "./models-dev"
```

#### packages/core/test/kilocode/models-dev-logger.test.ts
```diff
diff --git a/packages/core/test/kilocode/models-dev-logger.test.ts b/packages/core/test/kilocode/models-dev-logger.test.ts
new file mode 100644
index 000000000..c67d583c6
--- /dev/null
+++ b/packages/core/test/kilocode/models-dev-logger.test.ts
@@ -0,0 +1,65 @@
+import { afterAll, beforeAll, describe, expect } from "bun:test"
+import { Effect, Layer } from "effect"
+import { HttpClient, HttpClientResponse } from "effect/unstable/http"
+import { AppNodeBuilder } from "@opencode-ai/core/effect/app-node-builder"
+import { LayerNodePlatform } from "@opencode-ai/core/effect/app-node-platform"
+import { Flag } from "@opencode-ai/core/flag/flag"
+import { Global } from "@opencode-ai/core/global"
+import { ModelsDev } from "@opencode-ai/core/models-dev"
+import { mkdir, readFile, rm, writeFile } from "fs/promises"
+import path from "path"
+import * as TestConsole from "effect/testing/TestConsole"
+import { it } from "../lib/effect"
+
+const ORIGINAL_MODELS_PATH = Flag.KILO_MODELS_PATH
+const ORIGINAL_DISABLE_FETCH = Flag.KILO_DISABLE_MODELS_FETCH
+const cache = Global.Path.cache
+const log = Global.Path.log
+const root = path.join(Global.Path.tmp, `models-logger-${process.pid}-${Math.random().toString(36).slice(2)}`)
+const logs = path.join(root, "log")
+
+beforeAll(async () => {
+  Flag.KILO_MODELS_PATH = undefined
+  Flag.KILO_DISABLE_MODELS_FETCH = true
+  Global.Path.cache = root
+  Global.Path.log = logs
+  await mkdir(logs, { recursive: true })
+  await writeFile(path.join(root, "models.json"), "{}")
+})
+
+afterAll(async () => {
+  Flag.KILO_MODELS_PATH = ORIGINAL_MODELS_PATH
+  Flag.KILO_DISABLE_MODELS_FETCH = ORIGINAL_DISABLE_FETCH
+  Global.Path.cache = cache
+  Global.Path.log = log
+  await rm(root, { recursive: true, force: true })
+})
+
+const client = HttpClient.make((request) =>
+  Effect.succeed(HttpClientResponse.fromWeb(request, new Response("boom", { status: 500 }))),
+)
+
+const layer = Layer.fresh(
+  AppNodeBuilder.build(ModelsDev.node, [[LayerNodePlatform.httpClient, Layer.succeed(HttpClient.HttpClient, client)]]),
+)
```

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index a80f81cd8..4ba811299 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -383,6 +383,7 @@ const layer = Layer.effect(
           // kilocode_change start
           KiloAgent.processConfigItem(item)
           KiloAgent.hardenPlan(key, item, ctx.worktree, user, Permission.fromConfig(value.permission ?? {}))
+          KiloAgent.hardenExplore(key, item, user, Permission.fromConfig(value.permission ?? {}))
         }
 
         function referencePrompt(reference: KiloReference.Resolved) {
```

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index 1be61ef82..3fcecd449 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -143,6 +143,14 @@ export const readOnlyBash: Record<string, "allow" | "ask" | "deny"> = {
   "man *-H*": "deny",
 }
 
+const exploreBash: Record<string, "allow" | "ask" | "deny"> = {
+  ...readOnlyBash,
+  // Explore runs as a delegated agent, so it cannot answer permission prompts.
+  "gh *": "deny",
+  // `find` can mutate through `-delete` and `-exec`; use glob/list instead.
+  "find *": "deny",
+}
+
 function askGuard(mcp: Record<string, "allow" | "ask" | "deny"> = {}) {
   return Permission.fromConfig({
     "*": "deny",
@@ -223,6 +231,20 @@ export function hardenPlan(
   item.permission = Permission.merge(item.permission, planEditGuard(worktree), ...edit)
 }
 
+export function hardenExplore(
+  key: string,
+  item: { permission: Permission.Ruleset },
+  ...explicit: Permission.Ruleset[]
+) {
+  if (key !== "explore") return
+  item.permission = Permission.merge(
+    item.permission,
+    Permission.fromConfig({ bash: exploreBash }),
+    // Hardening is a ceiling, so retain any stricter user-authored denies.
+    ...explicit.map(denies),
+  )
+}
+
 function planGuard(worktree: string, mcp: Record<string, "allow" | "ask" | "deny"> = {}) {
   return Permission.fromConfig({
     "*": "deny",
@@ -445,7 +467,6 @@ export function patchAgents(
           grep: "allow",
           glob: "allow",
           list: "allow",
-          bash: "allow",
           skill: "allow",
           webfetch: "allow",
           websearch: "allow",
@@ -462,6 +483,9 @@ export function patchAgents(
           },
```


*... and more files (showing first 5)*

## opencode Changes (cc4b456..e23586a)

### Commits

- e23586a - feat(go): add GLM 5.3 (#42518) (Jack, 2026-08-14)
- 92d29ba - chore: generate (opencode-agent[bot], 2026-08-14)
- 886fd98 - docs(zen): add Muse Spark 1.2 (#42508) (Jack, 2026-08-14)
- 722e717 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-14)
- 6d63500 - chore(deps): update ai-gateway-provider to 3.2.0 (#42488) (Aiden Cline, 2026-08-13)
- 0e34745 - docs: sort Gemini 3.7 before 3.6 (#42473) (opencode-agent[bot], 2026-08-14)
- d8bf792 - fix(opencode): preserve v1 database compatibility (#42444) (Dax, 2026-08-14)
- 8a55ba7 - chore: generate (opencode-agent[bot], 2026-08-13)
- 2449581 - fix(go): remove Gemini 3.7 Flash (#42393) (Jack, 2026-08-14)
- 3e25e80 - chore: generate (opencode-agent[bot], 2026-08-13)
- f06e949 - feat(go): add Gemini 3.7 Flash (#42390) (Jack, 2026-08-14)
- d0c2b41 - docs(go): use responses API for Grok 4.5 (#42373) (Jack, 2026-08-14)
- c7af47f - update grok endpoint (Frank, 2026-08-13)
- 6c035e1 - fix(core): preserve unicode in grep previews (#42356) (Kit Langton, 2026-08-13)
- ab7cbc8 - chore: generate (opencode-agent[bot], 2026-08-13)
- 62387f3 - fix(skills): Update global config path in documentation (#42337) (Aditya Sethi, 2026-08-13)
- 864889a - docs: remove Ling 3.0 Tiny free model (#42314) (Jack, 2026-08-13)

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
- `packages/core/src/plugin/skill/customize-opencode.md` (+1, -1)
- `packages/core/src/ripgrep.ts` (+4, -1)
- `packages/core/src/session/projector.ts` (+0, -3)
- `packages/core/test/ripgrep.test.ts` (+20, -0)
- `packages/core/test/session-projector.test.ts` (+35, -1)
- `packages/core/test/session-runner.test.ts` (+0, -7)

#### Other Changes
- `bun.lock` (+88, -34)
- `nix/hashes.json` (+4, -4)
- `packages/console/app/src/routes/go/index.tsx` (+1, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/control-plane/workspace.ts` (+2, -0)
- `packages/opencode/test/control-plane/workspace.test.ts` (+16, -0)
- `packages/web/src/content/docs/ar/go.mdx` (+7, -2)
- `packages/web/src/content/docs/ar/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/bs/go.mdx` (+7, -2)
- `packages/web/src/content/docs/bs/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/da/go.mdx` (+7, -2)
- `packages/web/src/content/docs/da/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/de/go.mdx` (+7, -2)
- `packages/web/src/content/docs/de/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/es/go.mdx` (+7, -2)
- `packages/web/src/content/docs/es/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/fr/go.mdx` (+7, -2)
- `packages/web/src/content/docs/fr/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/go.mdx` (+7, -2)
- `packages/web/src/content/docs/it/go.mdx` (+7, -2)
- `packages/web/src/content/docs/it/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ja/go.mdx` (+7, -2)
- `packages/web/src/content/docs/ja/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ko/go.mdx` (+7, -2)
- `packages/web/src/content/docs/ko/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/nb/go.mdx` (+7, -2)
- `packages/web/src/content/docs/nb/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/pl/go.mdx` (+7, -2)
- `packages/web/src/content/docs/pl/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/pt-br/go.mdx` (+7, -2)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ru/go.mdx` (+7, -2)
- `packages/web/src/content/docs/ru/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/th/go.mdx` (+7, -2)
- `packages/web/src/content/docs/th/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/tr/go.mdx` (+7, -2)
- `packages/web/src/content/docs/tr/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+7, -2)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+7, -2)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+4, -4)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 96c989d..ee24893 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -101,7 +101,7 @@
     "@parcel/watcher": "2.5.1",
     "@silvia-odwyer/photon-node": "0.3.4",
     "@openrouter/ai-sdk-provider": "2.9.0",
-    "ai-gateway-provider": "3.1.2",
+    "ai-gateway-provider": "3.2.0",
     "bun-pty": "0.4.8",
     "cross-spawn": "catalog:",
     "diff": "catalog:",
```

#### packages/core/src/plugin/skill/customize-opencode.md
```diff
diff --git a/packages/core/src/plugin/skill/customize-opencode.md b/packages/core/src/plugin/skill/customize-opencode.md
index 549f15e..c02ed72 100644
--- a/packages/core/src/plugin/skill/customize-opencode.md
+++ b/packages/core/src/plugin/skill/customize-opencode.md
@@ -40,7 +40,7 @@ already-loaded config until then.
 | Scope                         | Path                                                                                                                      |
 | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
 | Project config                | `./opencode.json`, `./opencode.jsonc`, or `.opencode/opencode.json` (opencode walks up from the cwd to the worktree root) |
-| Global config                 | `~/.config/opencode/opencode.json` (NOT `~/.opencode/`)                                                                   |
+| Global config                 | `~/.config/opencode/opencode.json` or `~/.config/opencode/opencode.jsonc` (NOT `~/.opencode/`)                            |
 | Project agents                | `.opencode/agent/<name>.md` or `.opencode/agents/<name>.md`                                                               |
 | Global agents                 | `~/.config/opencode/agent(s)/<name>.md`                                                                                   |
 | Project commands              | `.opencode/command/<name>.md` or `.opencode/commands/<name>.md`                                                           |
```

#### packages/core/src/ripgrep.ts
```diff
diff --git a/packages/core/src/ripgrep.ts b/packages/core/src/ripgrep.ts
index ac8ea52..7e32ddb 100644
--- a/packages/core/src/ripgrep.ts
+++ b/packages/core/src/ripgrep.ts
@@ -264,7 +264,10 @@ const layer = Layer.effect(
                 }),
                 line: match.line_number,
                 offset: match.absolute_offset,
-                text: match.lines.text.length > 2_000 ? match.lines.text.slice(0, 2_000) + "..." : match.lines.text,
+                text:
+                  match.lines.text.length > 2_000
+                    ? match.lines.text.slice(0, 2_000).replace(/[\uD800-\uDBFF]$/, "") + "..."
+                    : match.lines.text,
                 submatches: match.submatches.map((submatch) => ({
                   text: submatch.match.text,
                   start: submatch.start,
```

#### packages/core/src/session/projector.ts
```diff
diff --git a/packages/core/src/session/projector.ts b/packages/core/src/session/projector.ts
index afa60df..7920670 100644
--- a/packages/core/src/session/projector.ts
+++ b/packages/core/src/session/projector.ts
@@ -12,7 +12,6 @@ import { SessionMessage } from "./message"
 import { SessionMessageUpdater } from "./message-updater"
 import { SessionInput } from "./input"
 import { WorkspaceV2 } from "../workspace"
-import { SessionContextEpoch } from "./context-epoch"
 import { MessageTable, PartTable, SessionInputTable, SessionMessageTable, SessionTable } from "./sql"
 import type { DeepMutable } from "../schema"
 
@@ -253,7 +252,6 @@ const layer = Layer.effectDiscard(
           .where(eq(SessionTable.id, event.data.sessionID))
           .run()
           .pipe(Effect.orDie)
-        yield* SessionContextEpoch.reset(db, event.data.sessionID)
       }),
     )
     yield* events.project(SessionV1.Event.Deleted, (event) =>
@@ -449,7 +447,6 @@ const layer = Layer.effectDiscard(
           .where(eq(SessionTable.id, event.data.sessionID))
           .run()
           .pipe(Effect.orDie)
-        yield* SessionContextEpoch.reset(db, event.data.sessionID)
       }),
     )
   }),
```

#### packages/core/test/ripgrep.test.ts
```diff
diff --git a/packages/core/test/ripgrep.test.ts b/packages/core/test/ripgrep.test.ts
index 3abce1c..5695af0 100644
--- a/packages/core/test/ripgrep.test.ts
+++ b/packages/core/test/ripgrep.test.ts
@@ -62,4 +62,24 @@ describe("Ripgrep", () => {
       (tmp) => Effect.promise(() => tmp[Symbol.asyncDispose]()),
     ),
   )
+  it.live("does not split surrogate pairs in oversized line previews", () =>
+    Effect.acquireUseRelease(
+      Effect.promise(() => tmpdir()),
+      (tmp) =>
+        Effect.gen(function* () {
+          yield* Effect.promise(() =>
+            fs.writeFile(path.join(tmp.path, "unicode.txt"), `needle${"x".repeat(1_993)}😀\n`),
+          )
+
+          const matches = yield* (yield* Ripgrep.Service).grep({
+            cwd: tmp.path,
+            pattern: "needle",
+            limit: 10,
+          })
+
+          expect(matches[0]?.text).toBe(`needle${"x".repeat(1_993)}...`)
+        }),
+      (tmp) => Effect.promise(() => tmp[Symbol.asyncDispose]()),
+    ),
+  )
 })
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/models-dev.ts
- `src/core/` - review core changes from packages/core/test/kilocode/models-dev-logger.test.ts
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
