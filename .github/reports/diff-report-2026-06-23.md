# Upstream Changes Report
Generated: 2026-06-23 09:40:30

## Summary
- kilocode: 23 commits, 83 files changed
- opencode: 63 commits, 327 files changed

## kilocode Changes (d378114b8..9fc6f1e8b)

### Commits

- 9fc6f1e8b - Merge pull request #11570 from Kilo-Org/glow-albacore (Marius, 2026-06-23)
- d4f2a9671 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-23)
- 1d16effe9 - feat(vscode): let users hide disabled indexing button (marius-kilocode, 2026-06-23)
- e5a16d7af - Merge pull request #11526 from Kilo-Org/truth-athlete (Marius, 2026-06-23)
- 0f55066dc - release: v7.3.54 (kilo-maintainer[bot], 2026-06-23)
- f15aa1f81 - Merge pull request #11555 from Kilo-Org/observant-tornado (Catriel Müller, 2026-06-22)
- 82d56d8ba - Merge remote-tracking branch 'origin/main' into observant-tornado (Josh Lambert, 2026-06-22)
- 4d63437f4 - Merge pull request #11552 from Kilo-Org/fourth-cilantro (Catriel Müller, 2026-06-22)
- 5c1dcdffc - fix(cli): support GLM 5.2 thinking variants (Josh Lambert, 2026-06-22)
- 251774b72 - fix(opencode): support MiniMax M3 thinking toggle (#31426) (Aiden Cline, 2026-06-22)
- de23a36ca - Merge pull request #11524 from Kilo-Org/docs/review-md-subagents (Marian Alexandru Alecu, 2026-06-22)
- acb278084 - docs: nest sub-agent behavior heading under REVIEW.md section (kiloconnect[bot], 2026-06-22)
- 5c4bcb4a8 - Update packages/kilo-docs/pages/automate/code-reviews/overview.md (Marian Alexandru Alecu, 2026-06-22)
- 90643d232 - release: v7.3.53 (kilo-maintainer[bot], 2026-06-22)
- bd58e3af8 - Merge pull request #11036 from Kilo-Org/feat/default-mercury-next-edit (Mark IJbema, 2026-06-22)
- dc6d083f0 - Merge pull request #11533 from Kilo-Org/concise-pin (Marius, 2026-06-22)
- 15f42d4be - fix(cli): restore read tool streaming (marius-kilocode, 2026-06-22)
- e5deb4ebe - fix(cli): handle advanced PowerShell prologues (marius-kilocode, 2026-06-22)
- e95384de0 - fix(cli): preserve PowerShell prologues (marius-kilocode, 2026-06-22)
- 579a78704 - fix(cli): avoid encoded PowerShell commands (marius-kilocode, 2026-06-22)
- 7ee941d57 - docs: document REVIEW.md sub-agent guidance (Alex Alecu, 2026-06-22)
- 20a9e225e - test(gateway): expect Next Edit default routing (chrarnoldus, 2026-06-09)
- 6c55c28ec - feat(gateway): default autocomplete to Mercury Next Edit (chrarnoldus, 2026-06-09)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/read.ts` (+45, -28)
- `packages/opencode/src/tool/shell.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/calm-powershell-alerts.md` (+6, -0)
- `.changeset/search-local-transcripts.md` (+0, -5)
- `.changeset/tidy-indexing-button.md` (+5, -0)
- `bun.lock` (+21, -21)
- `package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/code-reviews/github.md` (+1, -1)
- `packages/kilo-docs/pages/automate/code-reviews/gitlab.md` (+1, -1)
- `packages/kilo-docs/pages/automate/code-reviews/overview.md` (+63, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-kilo-catalog-loading-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-kilo-model-preset-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-provider-blur-race-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-scope-switch-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/autocomplete.ts` (+1, -1)
- `packages/kilo-gateway/test/autocomplete.test.ts` (+4, -1)
- `packages/kilo-gateway/test/edit.test.ts` (+8, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+14, -0)
- `packages/kilo-vscode/package.json` (+7, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+14, -0)
- `packages/kilo-vscode/src/kilo-provider/indexing-settings.ts` (+25, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/indexing-settings-message.test.ts` (+54, -0)
- `packages/kilo-vscode/tests/unit/indexing-utils.test.ts` (+36, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+10, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/IndexingTab.tsx` (+14, -2)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/context/indexing-utils.ts` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+3, -0)
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
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+5, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+22, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilocode/shell/shell.ts` (+118, -10)
- `packages/opencode/src/kilocode/text-stream.ts` (+47, -39)
- `packages/opencode/src/provider/transform.ts` (+37, -1)
- `packages/opencode/src/session/message-v2.ts` (+6, -2)
- `packages/opencode/src/shell/shell.ts` (+2, -2)
- `packages/opencode/test/kilocode/read-directory.test.ts` (+14, -0)
- `packages/opencode/test/kilocode/session-compaction-safety.test.ts` (+28, -0)
- `packages/opencode/test/kilocode/shell/shell.test.ts` (+28, -11)
- `packages/opencode/test/kilocode/tool-encoding.test.ts` (+152, -3)
- `packages/opencode/test/provider/transform.test.ts` (+165, -3)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 7f6af6685..61894b76c 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.52",
+  "version": "7.3.54",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/tool/read.ts
```diff
diff --git a/packages/opencode/src/tool/read.ts b/packages/opencode/src/tool/read.ts
index 8c8fc2146..16c3156fa 100644
--- a/packages/opencode/src/tool/read.ts
+++ b/packages/opencode/src/tool/read.ts
@@ -15,11 +15,14 @@ import { Reference } from "@/reference/reference"
 // kilocode_change start
 import * as Encoding from "../kilocode/encoding"
 import * as Extract from "../kilocode/tool/read-extract"
+import * as TextStream from "../kilocode/text-stream"
 // kilocode_change end
 
 const DEFAULT_READ_LIMIT = 2000
 const MAX_LINE_LENGTH = 2000
-const MAX_LINE_SUFFIX = `... (line truncated to ${MAX_LINE_LENGTH} chars)`
+// kilocode_change start - report the safe Unicode slice length
+const suffix = (length: number) => `... (line truncated to ${length} chars)`
+// kilocode_change end
 const MAX_BYTES = 50 * 1024
 const MAX_BYTES_LABEL = `${MAX_BYTES / 1024} KB`
 const SAMPLE_BYTES = 4096
@@ -110,30 +113,33 @@ export const ReadTool = Tool.define(
       )
     })
 
-    const lines = Effect.fn("ReadTool.lines")((filepath: string, opts: { limit: number; offset: number }) =>
-      // kilocode_change - extracted formats still need their native readers; ordinary text stays on AppFileSystem
-      Effect.tryPromise({
-        try: () => Extract.open(filepath),
-        catch: (err) => (err instanceof Error ? err : new Error(String(err))),
-      }).pipe(
-        Effect.flatMap((extracted) =>
-          extracted
-            ? Effect.tryPromise({
-                try: () => collect(extracted, opts),
-                catch: (err) => (err instanceof Error ? err : new Error(String(err))),
-              })
-            : fs.readFile(filepath).pipe(
-                Effect.map((bytes) => Encoding.decode(Buffer.from(bytes), Encoding.detect(Buffer.from(bytes)))),
-                Effect.flatMap((text) =>
-                  Effect.tryPromise({
-                    try: () => collect(Readable.from([text]), opts),
-                    catch: (err) => (err instanceof Error ? err : new Error(String(err))),
-                  }),
-                ),
-              ),
+    // kilocode_change start - extracted formats use native readers; ordinary text streams through AppFileSystem
+    const lines = Effect.fn("ReadTool.lines")(
+      (filepath: string, opts: { limit: number; offset: number }, abort: AbortSignal) =>
+        Effect.tryPromise({
+          try: () => Extract.open(filepath),
```

#### packages/opencode/src/tool/shell.ts
```diff
diff --git a/packages/opencode/src/tool/shell.ts b/packages/opencode/src/tool/shell.ts
index 99f4eb2ac..0b4df59c1 100644
--- a/packages/opencode/src/tool/shell.ts
+++ b/packages/opencode/src/tool/shell.ts
@@ -312,7 +312,7 @@ const ask = Effect.fn("ShellTool.ask")(function* (
 
 function cmd(shell: string, command: string, cwd: string, env: NodeJS.ProcessEnv) {
   if (process.platform === "win32" && Shell.ps(shell)) {
-    // kilocode_change start - encoded PowerShell args
+    // kilocode_change start - PowerShell args
     return ChildProcess.make(shell, Shell.args(shell, command, cwd), {
       // kilocode_change end
       cwd,
```


## opencode Changes (4ecc3ac..fc95a84)

### Commits

- fc95a84 - chore: generate (opencode-agent[bot], 2026-06-23)
- b006370 - feat(app): add mobile bottom navigation (#32797) (Brendan Allan, 2026-06-23)
- 7752269 - chore: generate (opencode-agent[bot], 2026-06-23)
- bbc88eb - fix(app): refine mobile session layout (#32796) (Brendan Allan, 2026-06-23)
- a379c79 - chore: generate (opencode-agent[bot], 2026-06-23)
- 52eae83 - fix(app): add server button dropdown (#33358) (Aarav Sareen, 2026-06-23)
- 3cc626b - feat(app): collapsible servers (#33384) (Aarav Sareen, 2026-06-23)
- f0849a6 - fix(app): reject stale timeline range indexes (#33488) (Luke Parker, 2026-06-23)
- 3f3f120 - feat(mcp): add resource read tools (#33483) (Shoubhit Dash, 2026-06-23)
- ea17d9b - zen: glm 5.2 (Frank, 2026-06-23)
- 726b2d7 - zen: remove unused fields (Frank, 2026-06-23)
- bffc593 - chore: generate (opencode-agent[bot], 2026-06-23)
- d111812 - fix(app): restore review line comments (#33481) (Luke Parker, 2026-06-23)
- 597f47b - fix(app): improve mobile home layout (#32789) (Brendan Allan, 2026-06-23)
- 09757c6 - chore: generate (opencode-agent[bot], 2026-06-23)
- 0c4f508 - feat(app): add server-keyed session routes (#32570) (Brendan Allan, 2026-06-23)
- 40db33c - chore: generate (opencode-agent[bot], 2026-06-23)
- 9b01f15 - test(opencode): retry Windows CLI cleanup (Dax Raad, 2026-06-23)
- 81851ca - test(opencode): stabilize Windows async readiness (Dax Raad, 2026-06-23)
- 3c5632e - test(opencode): stabilize Windows CLI subprocesses (Dax Raad, 2026-06-23)
- 6ea3e66 - fix(opencode): scope reference readiness wait (Dax Raad, 2026-06-23)
- ed75ce9 - fix(core): prioritize reference plugin registration (Dax Raad, 2026-06-22)
- af14fef - test(opencode): relax compaction readiness timeout (Dax Raad, 2026-06-22)
- 4a710e4 - fix(core): await plugin readiness (Dax Raad, 2026-06-22)
- d2c866b - test(core): speed up test setup (Dax Raad, 2026-06-22)
- 237595e - chore: generate (opencode-agent[bot], 2026-06-23)
- d29f5eb - refactor(core): remove shell description input (#32823) (Aiden Cline, 2026-06-22)
- fbf889d - fix(tui): preserve worker rejection handling (#33448) (Aiden Cline, 2026-06-22)
- ef23579 - fix(tui): scope file autocomplete to session (#33458) (Dax, 2026-06-22)
- 975b113 - refactor(plugin): use direct runtime registry (Dax Raad, 2026-06-22)
- cd97de7 - refactor(plugin): consolidate internal registration (Dax Raad, 2026-06-22)
- 23fd590 - fix(opencode): normalize CLI test line endings (Dax Raad, 2026-06-22)
- 49d3f86 - chore: generate (opencode-agent[bot], 2026-06-22)
- 909a1a6 - feat(plugin): add namespaced hook API (#33416) (Dax, 2026-06-22)
- dc468bd - fix(core): reset steps for promoted prompts (#33452) (Kit Langton, 2026-06-22)
- f48f24e - refactor(core): simplify session input promotion (#33443) (Kit Langton, 2026-06-22)
- 34b3d59 - ignore: update agents.md (#33446) (Aiden Cline, 2026-06-22)
- a0a5003 - zen: new inference (Frank, 2026-06-22)
- 1787fa4 - refactor(core): drop legacy compaction event (#33404) (Kit Langton, 2026-06-22)
- 1309572 - fix(llm): preserve structured tool errors (#33405) (Kit Langton, 2026-06-22)
- c5a4a82 - fix: dont show gpt-5.5-pro when using codex oauth (#33400) (Aiden Cline, 2026-06-22)
- 39d7394 - fix(stats): hide unique users tooltip total (Adam, 2026-06-22)
- 494123a - chore: generate (opencode-agent[bot], 2026-06-22)
- fe840d4 - refactor(core): simplify session run coordination (#33388) (Kit Langton, 2026-06-22)
- f50e4ac - test(opencode): synchronize shell cancellation (#33386) (Kit Langton, 2026-06-22)
- 9bceb8e - test(opencode): synchronize websocket retry failures (#33387) (Kit Langton, 2026-06-22)
- adebb87 - test(opencode): use EventV2 location contract (#33383) (Kit Langton, 2026-06-22)
- 4d5efba - chore: generate (opencode-agent[bot], 2026-06-22)
- c6ee511 - refactor(core): simplify session context epochs (#33378) (Kit Langton, 2026-06-22)
- f9f2280 - fix(core): defer session model validation (#33377) (Kit Langton, 2026-06-22)
- d5980b4 - feat(llm): add video and audio media support to Gemini protocol (#31889) (Tommy D. Rossi, 2026-06-22)
- 41d1279 - fix(opencode): preserve request logger context (#33381) (Kit Langton, 2026-06-22)
- 0d32d1f - cli: add --mini (#33353) (Simon Klee, 2026-06-22)
- cf31029 - fix(core): batch plugin shutdown (Dax Raad, 2026-06-22)
- 79b55d4 - fix(tui): use bridged event stream for data (Dax Raad, 2026-06-22)
- 36264cc - fix(stats): format market share tokens (Adam, 2026-06-22)
- 7b750a8 - fix(ci): preserve test log groups (Dax Raad, 2026-06-22)
- e50261e - fix(core): format generated migrations (Dax Raad, 2026-06-22)
- 639c94a - chore: generate (opencode-agent[bot], 2026-06-22)
- b13a2d7 - fix(server): isolate event schema types (Dax Raad, 2026-06-22)
- 1b91b5d - fix(core): constrain event schema services (Dax Raad, 2026-06-22)
- 595cc91 - feat(server): stream events across locations (Dax Raad, 2026-06-22)
- 57ce1b9 - fix(cli): increment ports from default (#33282) (Dax, 2026-06-22)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/bash.ts` (+0, -3)
- `packages/core/src/tool/skill.ts` (+0, -3)
- `packages/opencode/src/tool/shell.ts` (+2, -14)
- `packages/opencode/src/tool/shell/prompt.ts` (+3, -17)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+0, -18)
- `packages/opencode/test/tool/parameters.test.ts` (+4, -7)
- `packages/opencode/test/tool/shell.test.ts` (+4, -48)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+7, -5)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+2, -1)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/src/model.ts` (+1, -2)
- `packages/core/schema.json` (+2, -32)
- `packages/core/script/migration.ts` (+19, -5)
- `packages/core/src/agent.ts` (+1, -1)
- `packages/core/src/aisdk.ts` (+74, -21)
- `packages/core/src/catalog.ts` (+1, -1)
- `packages/core/src/command.ts` (+1, -1)
- `packages/core/src/config/plugin/agent.ts` (+1, -1)
- `packages/core/src/config/plugin/command.ts` (+1, -1)
- `packages/core/src/config/plugin/external.ts` (+91, -0)
- `packages/core/src/config/plugin/provider.ts` (+1, -1)
- `packages/core/src/config/plugin/reference.ts` (+7, -3)
- `packages/core/src/config/plugin/skill.ts` (+7, -5)
- `packages/core/src/database/migration.gen.ts` (+3, -0)
- `packages/core/src/database/migration/20260622142730_simplify_session_context_epoch.ts` (+13, -0)
- `packages/core/src/database/migration/20260622170816_reset_v2_session_state.ts` (+17, -0)
- `packages/core/src/database/migration/20260622202450_simplify_session_input.ts` (+17, -0)
- `packages/core/src/database/schema.gen.ts` (+0, -3)
- `packages/core/src/event.ts` (+13, -0)
- `packages/core/src/integration.ts` (+1, -1)
- `packages/core/src/location-layer.ts` (+2, -2)
- `packages/core/src/plugin.ts` (+119, -169)
- `packages/core/src/plugin/agent.ts` (+4, -2)
- `packages/core/src/plugin/boot.ts` (+0, -137)
- `packages/core/src/plugin/command.ts` (+5, -3)
- `packages/core/src/plugin/host.ts` (+32, -114)
- `packages/core/src/plugin/internal.ts` (+118, -0)
- `packages/core/src/plugin/models-dev.ts` (+5, -3)
- `packages/core/src/plugin/promise.ts` (+89, -0)
- `packages/core/src/plugin/provider.ts` (+3, -1)
- `packages/core/src/plugin/provider/alibaba.ts` (+2, -3)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+3, -5)
- `packages/core/src/plugin/provider/anthropic.ts` (+2, -3)
- `packages/core/src/plugin/provider/azure.ts` (+4, -7)
- `packages/core/src/plugin/provider/cerebras.ts` (+2, -3)
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+2, -3)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+3, -5)
- `packages/core/src/plugin/provider/cohere.ts` (+2, -3)
- `packages/core/src/plugin/provider/deepinfra.ts` (+2, -3)
- `packages/core/src/plugin/provider/dynamic.ts` (+5, -4)
- `packages/core/src/plugin/provider/gateway.ts` (+2, -3)
- `packages/core/src/plugin/provider/github-copilot.ts` (+3, -5)
- `packages/core/src/plugin/provider/gitlab.ts` (+3, -5)
- `packages/core/src/plugin/provider/google-vertex.ts` (+5, -9)
- `packages/core/src/plugin/provider/google.ts` (+2, -3)
- `packages/core/src/plugin/provider/groq.ts` (+2, -3)
- `packages/core/src/plugin/provider/kilo.ts` (+1, -1)
- `packages/core/src/plugin/provider/llmgateway.ts` (+4, -2)
- `packages/core/src/plugin/provider/mistral.ts` (+2, -3)
- `packages/core/src/plugin/provider/nvidia.ts` (+1, -1)
- `packages/core/src/plugin/provider/openai-compatible.ts` (+2, -3)
- `packages/core/src/plugin/provider/openai.ts` (+3, -5)
- `packages/core/src/plugin/provider/opencode.ts` (+4, -2)
- `packages/core/src/plugin/provider/openrouter.ts` (+2, -3)
- `packages/core/src/plugin/provider/perplexity.ts` (+2, -3)
- `packages/core/src/plugin/provider/sap-ai-core.ts` (+6, -6)
- `packages/core/src/plugin/provider/snowflake-cortex.ts` (+2, -3)
- `packages/core/src/plugin/provider/togetherai.ts` (+2, -3)
- `packages/core/src/plugin/provider/venice.ts` (+2, -3)
- `packages/core/src/plugin/provider/vercel.ts` (+2, -3)
- `packages/core/src/plugin/provider/xai.ts` (+3, -5)
- `packages/core/src/plugin/provider/zenmux.ts` (+1, -1)
- `packages/core/src/plugin/skill.ts` (+1, -1)
- `packages/core/src/project/copy.ts` (+0, -3)
- `packages/core/src/public/opencode.ts` (+11, -64)
- `packages/core/src/public/session.ts` (+2, -22)
- `packages/core/src/reference.ts` (+1, -1)
- `packages/core/src/reference/guidance.ts` (+0, -3)
- `packages/core/src/session.ts` (+4, -34)
- `packages/core/src/session/context-epoch.ts` (+47, -216)
- `packages/core/src/session/event.ts` (+13, -51)
- `packages/core/src/session/execution.ts` (+4, -4)
- `packages/core/src/session/execution/local.ts` (+9, -6)
- `packages/core/src/session/history.ts` (+2, -2)
- `packages/core/src/session/input.ts` (+48, -63)
- `packages/core/src/session/logging.ts` (+0, -8)
- `packages/core/src/session/message-updater.ts` (+0, -2)
- `packages/core/src/session/projector.ts` (+9, -51)
- `packages/core/src/session/run-coordinator.ts` (+53, -235)
- `packages/core/src/session/runner/index.ts` (+1, -3)
- `packages/core/src/session/runner/llm.ts` (+36, -59)
- `packages/core/src/session/runner/model.ts` (+58, -15)
- `packages/core/src/session/sql.ts` (+0, -3)
- `packages/core/src/skill.ts` (+1, -1)
- `packages/core/src/skill/guidance.ts` (+0, -3)
- `packages/core/src/state.ts` (+15, -15)
- `packages/core/test/agent.test.ts` (+6, -2)
- `packages/core/test/catalog.test.ts` (+1, -1)
- `packages/core/test/config/command.test.ts` (+1, -1)
- `packages/core/test/config/fixtures/plugin/directory-plugin.ts` (+13, -0)
- `packages/core/test/config/plugin.test.ts` (+248, -0)
- `packages/core/test/config/provider.test.ts` (+2, -5)
- `packages/core/test/config/skill.test.ts` (+3, -8)
- `packages/core/test/database-migration.test.ts` (+94, -2)
- `packages/core/test/location-layer.test.ts` (+69, -31)
- `packages/core/test/plugin.test.ts` (+50, -72)
- `packages/core/test/plugin/command.test.ts` (+6, -2)
- `packages/core/test/plugin/fixture.ts` (+1, -14)
- `packages/core/test/plugin/fixtures/config-effect-plugin.ts` (+15, -0)
- `packages/core/test/plugin/fixtures/config-promise-plugin.ts` (+13, -0)
- `packages/core/test/plugin/fixtures/invalid-plugin.ts` (+1, -0)
- `packages/core/test/plugin/host.ts` (+31, -105)
- `packages/core/test/plugin/models-dev.test.ts` (+3, -14)
- `packages/core/test/plugin/promise.test.ts` (+67, -0)
- `packages/core/test/plugin/provider-alibaba.test.ts` (+33, -39)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+242, -308)
- `packages/core/test/plugin/provider-anthropic.test.ts` (+22, -26)
- `packages/core/test/plugin/provider-azure-cognitive-services.test.ts` (+55, -80)
- `packages/core/test/plugin/provider-azure.test.ts` (+85, -113)
- `packages/core/test/plugin/provider-cerebras.test.ts` (+52, -59)
- `packages/core/test/plugin/provider-cloudflare-ai-gateway.test.ts` (+127, -158)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+82, -98)
- `packages/core/test/plugin/provider-cohere.test.ts` (+39, -50)
- `packages/core/test/plugin/provider-deepinfra.test.ts` (+62, -86)
- `packages/core/test/plugin/provider-dynamic.test.ts` (+40, -60)
- `packages/core/test/plugin/provider-gateway.test.ts` (+43, -54)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+114, -158)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+117, -139)
- `packages/core/test/plugin/provider-google-vertex-anthropic.test.ts` (+81, -107)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+53, -63)
- `packages/core/test/plugin/provider-google.test.ts` (+36, -47)
- `packages/core/test/plugin/provider-groq.test.ts` (+53, -66)
- `packages/core/test/plugin/provider-kilo.test.ts` (+2, -2)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+3, -2)
- `packages/core/test/plugin/provider-mistral.test.ts` (+51, -64)
- `packages/core/test/plugin/provider-nvidia.test.ts` (+2, -2)
- `packages/core/test/plugin/provider-openai-compatible.test.ts` (+51, -72)
- `packages/core/test/plugin/provider-openai.test.ts` (+40, -53)
- `packages/core/test/plugin/provider-opencode.test.ts` (+3, -2)
- `packages/core/test/plugin/provider-openrouter.test.ts` (+21, -26)
- `packages/core/test/plugin/provider-perplexity.test.ts` (+49, -62)
- `packages/core/test/plugin/provider-sap-ai-core.test.ts` (+36, -45)
- `packages/core/test/plugin/provider-snowflake-cortex.test.ts` (+64, -80)
- `packages/core/test/plugin/provider-togetherai.test.ts` (+55, -69)
- `packages/core/test/plugin/provider-venice.test.ts` (+48, -62)
- `packages/core/test/plugin/provider-vercel.test.ts` (+13, -14)
- `packages/core/test/plugin/provider-xai.test.ts` (+49, -63)
- `packages/core/test/plugin/provider-zenmux.test.ts` (+2, -2)
- `packages/core/test/plugin/skill.test.ts` (+1, -1)
- `packages/core/test/preload.ts` (+4, -0)
- `packages/core/test/process/process.test.ts` (+1, -1)
- `packages/core/test/public-opencode.test.ts` (+16, -117)
- `packages/core/test/reference-guidance.test.ts` (+0, -4)
- `packages/core/test/session-create.test.ts` (+3, -3)
- `packages/core/test/session-logging.test.ts` (+0, -30)
- `packages/core/test/session-projector.test.ts` (+6, -5)
- `packages/core/test/session-prompt.test.ts` (+33, -38)
- `packages/core/test/session-run-coordinator.test.ts` (+91, -757)
- `packages/core/test/session-runner-model.test.ts` (+29, -8)
- `packages/core/test/session-runner-recorded.test.ts` (+14, -13)
- `packages/core/test/session-runner.test.ts` (+112, -435)
- `packages/core/test/skill/guidance.test.ts` (+3, -16)
- `packages/core/test/state.test.ts` (+2, -2)
- `packages/core/test/tool-bash.test.ts` (+2, -3)
- `packages/core/test/tool-skill.test.ts` (+2, -16)
- `packages/stats/core/src/domain/home.ts` (+2, -2)

#### Other Changes
- `.github/workflows/test.yml` (+1, -1)
- `AGENTS.md` (+3, -3)
- `CONTEXT.md` (+23, -9)
- `packages/app/e2e/regression/review-line-comment.spec.ts` (+157, -0)
- `packages/app/e2e/smoke/session-timeline.fixture.ts` (+5, -4)
- `packages/app/e2e/smoke/session-timeline.spec.ts` (+14, -1)
- `packages/app/e2e/utils/mock-server.ts` (+2, -0)
- `packages/app/index.html` (+4, -1)
- `packages/app/src/app.tsx` (+198, -63)
- `packages/app/src/components/prompt-input/submit.ts` (+1, -6)
- `packages/app/src/components/session/session-header.tsx` (+20, -14)
- `packages/app/src/components/settings-v2/general.tsx` (+16, -0)
- `packages/app/src/components/settings-v2/servers.tsx` (+2, -6)
- `packages/app/src/components/titlebar.tsx` (+71, -54)
- `packages/app/src/context/comments.tsx` (+4, -1)
- `packages/app/src/context/file.tsx` (+2, -1)
- `packages/app/src/context/layout.tsx` (+13, -3)
- `packages/app/src/context/notification.tsx` (+4, -4)
- `packages/app/src/context/permission.tsx` (+4, -4)
- `packages/app/src/context/prompt.tsx` (+4, -2)
- `packages/app/src/context/settings.tsx` (+9, -0)
- `packages/app/src/context/tabs.tsx` (+5, -24)
- `packages/app/src/context/terminal.tsx` (+7, -5)
- `packages/app/src/i18n/en.ts` (+5, -0)
- `packages/app/src/pages/directory-layout.tsx` (+22, -8)
- `packages/app/src/pages/home.tsx` (+87, -39)
- `packages/app/src/pages/layout-new.tsx` (+38, -0)
- `packages/app/src/pages/layout.tsx` (+150, -171)
- `packages/app/src/pages/session.tsx` (+53, -35)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+6, -1)
- `packages/app/src/pages/session/file-tabs.tsx` (+2, -3)
- `packages/app/src/pages/session/session-layout.ts` (+9, -5)
- `packages/app/src/pages/session/terminal-panel.tsx` (+5, -3)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+22, -5)
- `packages/app/src/pages/session/timeline/virtual-items.ts` (+3, -0)
- `packages/app/src/pages/session/use-session-commands.tsx` (+10, -1)
- `packages/app/src/utils/session-route.test.ts` (+39, -0)
- `packages/app/src/utils/session-route.ts` (+25, -0)
- `packages/app/src/wsl/settings.tsx` (+21, -6)
- `packages/app/test-browser/solid-virtual.test.ts` (+25, -1)
- `packages/cli/src/commands/handlers/serve.ts` (+5, -3)
- `packages/console/app/src/routes/zen/util/handler.ts` (+8, -2)
- `packages/llm/src/protocols/gemini.ts` (+3, -3)
- `packages/llm/src/protocols/shared.ts` (+14, -4)
- `packages/llm/test/provider/openai-chat.test.ts` (+21, -0)
- `packages/llm/test/provider/openai-responses.test.ts` (+58, -0)
- `packages/opencode/src/acp/tool.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/attach.ts` (+54, -3)
- `packages/opencode/src/cli/cmd/cmd.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+0, -2)
- `packages/opencode/src/cli/cmd/run.ts` (+82, -26)
- `packages/opencode/src/cli/cmd/run/runtime.stdin.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run/splash.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run/tool.ts` (+6, -9)
- `packages/opencode/src/cli/cmd/run/types.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui.ts` (+65, -0)
- `packages/opencode/src/cli/tui/worker.ts` (+9, -0)
- `packages/opencode/src/mcp/catalog.ts` (+5, -1)
- `packages/opencode/src/mcp/index.ts` (+15, -4)
- `packages/opencode/src/plugin/openai/codex.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+4, -2)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+1, -1)
- `packages/opencode/src/session/prompt.ts` (+57, -7)
- `packages/opencode/src/session/system.ts` (+0, -2)
- `packages/opencode/src/session/tools.ts` (+287, -2)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+16, -20)
- `packages/opencode/test/cli/help/help-snapshots.test.ts` (+5, -2)
- `packages/opencode/test/cli/run/scrollback.surface.test.ts` (+33, -6)
- `packages/opencode/test/cli/run/session-data.test.ts` (+0, -2)
- `packages/opencode/test/cli/run/session-replay.test.ts` (+0, -1)
- `packages/opencode/test/cli/tui/thread.test.ts` (+60, -1)
- `packages/opencode/test/lib/cli-process.ts` (+21, -9)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+10, -7)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+1, -1)
- `packages/opencode/test/plugin/openai-ws.test.ts` (+10, -3)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-file.test.ts` (+15, -5)
- `packages/opencode/test/server/httpapi-reference.test.ts` (+15, -6)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+7, -2)
- `packages/opencode/test/server/httpapi-v2-location.test.ts` (+24, -11)
- `packages/opencode/test/session/compaction.test.ts` (+2, -1)
- `packages/opencode/test/session/prompt.test.ts` (+11, -6)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+0, -1)
- `packages/plugin/package.json` (+2, -1)
- `packages/plugin/src/v2/effect/README.md` (+66, -540)
- `packages/plugin/src/v2/effect/agent.ts` (+4, -7)
- `packages/plugin/src/v2/effect/aisdk.ts` (+7, -10)
- `packages/plugin/src/v2/effect/catalog.ts` (+4, -16)
- `packages/plugin/src/v2/effect/command.ts` (+4, -6)
- `packages/plugin/src/v2/effect/context.ts` (+22, -0)
- `packages/plugin/src/v2/effect/host.ts` (+0, -27)
- `packages/plugin/src/v2/effect/index.ts` (+1, -15)
- `packages/plugin/src/v2/effect/integration.ts` (+4, -6)
- `packages/plugin/src/v2/effect/plugin.ts` (+9, -4)
- `packages/plugin/src/v2/effect/reference.ts` (+5, -6)
- `packages/plugin/src/v2/effect/registration.ts` (+6, -7)
- `packages/plugin/src/v2/effect/skill.ts` (+4, -6)
- `packages/plugin/src/v2/options.ts` (+1, -0)
- `packages/plugin/src/v2/promise/README.md` (+103, -0)
- `packages/plugin/src/v2/promise/agent.ts` (+8, -0)
- `packages/plugin/src/v2/promise/aisdk.ts` (+18, -0)
- `packages/plugin/src/v2/promise/catalog.ts` (+8, -0)
- `packages/plugin/src/v2/promise/command.ts` (+8, -0)
- `packages/plugin/src/v2/promise/context.ts` (+22, -0)
- `packages/plugin/src/v2/promise/index.ts` (+17, -0)
- `packages/plugin/src/v2/promise/integration.ts` (+8, -0)
- `packages/plugin/src/v2/promise/plugin.ts` (+15, -0)
- `packages/plugin/src/v2/promise/reference.ts` (+8, -0)
- `packages/plugin/src/v2/promise/registration.ts` (+11, -0)
- `packages/plugin/src/v2/promise/skill.ts` (+8, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+4, -14)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1887, -168)
- `packages/sdk/openapi.json` (+5616, -827)
- `packages/server/src/groups/event.ts` (+29, -21)
- `packages/server/src/groups/session.ts` (+2, -2)
- `packages/server/src/handlers/agent.ts` (+0, -2)
- `packages/server/src/handlers/event.ts` (+1, -18)
- `packages/server/src/handlers/model.ts` (+0, -9)
- `packages/server/src/handlers/provider.ts` (+1, -11)
- `packages/stats/app/src/routes/index.tsx` (+12, -7)
- `packages/tui/src/app.tsx` (+7, -4)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+34, -19)
- `packages/tui/src/context/data.tsx` (+136, -162)
- `packages/tui/src/context/location.tsx` (+14, -0)
- `packages/tui/src/context/path-format.tsx` (+7, -23)
- `packages/tui/src/routes/session/index.tsx` (+30, -20)
- `packages/tui/src/routes/session/permission.tsx` (+1, -3)
- `packages/tui/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+0, -2)
- `packages/tui/test/cli/tui/data.test.tsx` (+13, -61)
- `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+0, -1)
- `packages/tui/test/fixture/tui-sdk.ts` (+28, -1)
- `packages/ui/src/components/basic-tool.tsx` (+4, -2)
- `packages/ui/src/components/line-comment-annotations.tsx` (+5, -20)
- `packages/ui/src/components/message-part.tsx` (+5, -5)
- `packages/ui/src/components/session-review.tsx` (+5, -4)
- `packages/ui/src/components/timeline-playground.stories.tsx` (+2, -2)
- `packages/ui/src/v2/components/button-v2.css` (+19, -2)
- `packages/ui/src/v2/components/icon-button-v2.css` (+11, -2)
- `packages/web/src/components/share/content-bash.tsx` (+1, -2)
- `packages/web/src/components/share/part.tsx` (+0, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+2, -0)
- `specs/v2/schema-changelog.md` (+56, -2)
- `specs/v2/session.md` (+23, -24)
- `specs/v2/todo.md` (+12, -18)

### Key Diffs

#### packages/console/core/src/model.ts
```diff
diff --git a/packages/console/core/src/model.ts b/packages/console/core/src/model.ts
index 4355c18..bb0260d 100644
--- a/packages/console/core/src/model.ts
+++ b/packages/console/core/src/model.ts
@@ -52,9 +52,8 @@ export namespace ZenData {
     api: z.string(),
     apiKey: z.union([z.string(), z.record(z.string(), z.string())]),
     format: FormatSchema.optional(),
-    headerMappings: z.record(z.string(), z.string()).optional(),
+    headerModifier: z.record(z.string(), z.any()).optional(),
     payloadModifier: z.record(z.string(), z.any()).optional(),
-    payloadMappings: z.record(z.string(), z.string()).optional(),
     adjustCacheUsage: z.boolean().optional(),
     budget: z.number().optional(),
   })
```

#### packages/core/schema.json
```diff
diff --git a/packages/core/schema.json b/packages/core/schema.json
index c041a4e..d0eeeeb 100644
--- a/packages/core/schema.json
+++ b/packages/core/schema.json
@@ -1,8 +1,8 @@
 {
   "version": "7",
   "dialect": "sqlite",
-  "id": "169a0f0f-d58f-479f-b024-fa1c7b9a09db",
-  "prevIds": ["abd2f920-b822-49af-b8a7-2e48367d424f"],
+  "id": "f14a9b18-8207-487e-a3d3-227e629ba9ad",
+  "prevIds": ["169a0f0f-d58f-479f-b024-fa1c7b9a09db"],
   "ddl": [
     {
       "name": "workspace",
@@ -900,16 +900,6 @@
       "entityType": "columns",
       "table": "session_context_epoch"
     },
-    {
-      "type": "text",
-      "notNull": true,
-      "autoincrement": false,
-      "default": "'build'",
-      "generated": null,
-      "name": "agent",
-      "entityType": "columns",
-      "table": "session_context_epoch"
-    },
     {
       "type": "text",
       "notNull": true,
@@ -930,26 +920,6 @@
       "entityType": "columns",
       "table": "session_context_epoch"
     },
-    {
-      "type": "integer",
-      "notNull": false,
-      "autoincrement": false,
-      "default": null,
-      "generated": null,
-      "name": "replacement_seq",
-      "entityType": "columns",
-      "table": "session_context_epoch"
-    },
-    {
-      "type": "integer",
-      "notNull": true,
-      "autoincrement": false,
```

#### packages/core/script/migration.ts
```diff
diff --git a/packages/core/script/migration.ts b/packages/core/script/migration.ts
index 48b555b..4f383f5 100644
--- a/packages/core/script/migration.ts
+++ b/packages/core/script/migration.ts
@@ -45,15 +45,17 @@ async function generate() {
       if (await Bun.file(target).exists()) throw new Error(`Database migration already exists: ${name}`)
       await Bun.write(
         target,
-        renderMigration(name, await Bun.file(path.join(incremental, name, "migration.sql")).text()),
+        await formatTypescript(
+          renderMigration(name, await Bun.file(path.join(incremental, name, "migration.sql")).text()),
+        ),
       )
       await fs.copyFile(path.join(incremental, name, "snapshot.json"), snapshot)
     }
 
     await fs.mkdir(full)
     await drizzle(temporary, full, "schema")
-    await Bun.write(schema, renderSchema(await generatedSql(full)))
-    await Bun.write(registry, renderRegistry(await typescriptMigrations()))
+    await Bun.write(schema, await formatTypescript(renderSchema(await generatedSql(full))))
+    await Bun.write(registry, await formatTypescript(renderRegistry(await typescriptMigrations())))
   } finally {
     await fs.rm(temporary, { recursive: true, force: true })
   }
@@ -76,12 +78,12 @@ async function check() {
 
     await fs.mkdir(full)
     await drizzle(temporary, full, "schema")
-    if ((await Bun.file(schema).text()) !== renderSchema(await generatedSql(full))) {
+    if ((await Bun.file(schema).text()) !== (await formatTypescript(renderSchema(await generatedSql(full))))) {
       throw new Error("Current database schema is stale. Run `bun script/migration.ts` from packages/core.")
     }
 
     const migrations = await typescriptMigrations()
-    if ((await Bun.file(registry).text()) !== renderRegistry(migrations)) {
+    if ((await Bun.file(registry).text()) !== (await formatTypescript(renderRegistry(migrations)))) {
       throw new Error("Database migration registry is stale. Run `bun script/migration.ts` from packages/core.")
     }
   } finally {
@@ -170,6 +172,18 @@ function escapeTemplate(line: string) {
   return line.replaceAll("\\", "\\\\").replaceAll("`", "\\`").replaceAll("${", "\\${")
 }
 
+async function formatTypescript(input: string) {
+  const prettier = await import("prettier")
+  const typescript = await import("prettier/plugins/typescript")
+  const estree = await import("prettier/plugins/estree")
+  return prettier.format(input, {
+    parser: "typescript",
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index 18e9e59..f27b5c3 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -108,7 +108,7 @@ export const layer = Layer.effect(
 
     return Service.of({
       transform: state.transform,
-      rebuild: state.rebuild,
+      reload: state.reload,
       get: Effect.fn("AgentV2.get")(function* (id) {
         return state.get().agents.get(id)
       }),
```

#### packages/core/src/aisdk.ts
```diff
diff --git a/packages/core/src/aisdk.ts b/packages/core/src/aisdk.ts
index 769941f..9ea7939 100644
--- a/packages/core/src/aisdk.ts
+++ b/packages/core/src/aisdk.ts
@@ -1,14 +1,27 @@
 export * as AISDK from "./aisdk"
 
 import type { LanguageModelV3 } from "@ai-sdk/provider"
-import { Cause, Context, Effect, Layer, Schema } from "effect"
+import { Cause, Context, Effect, Layer, Schema, Scope } from "effect"
 import { ModelV2 } from "./model"
-import { EventV2 } from "./event"
-import { PluginV2 } from "./plugin"
 import { ProviderV2 } from "./provider"
+import { State } from "./state"
 
 type SDK = any
 
+export interface SDKEvent {
+  readonly model: ModelV2.Info
+  readonly package: string
+  readonly options: Record<string, any>
+  sdk?: SDK
+}
+
+export interface LanguageEvent {
+  readonly model: ModelV2.Info
+  readonly sdk: SDK
+  readonly options: Record<string, any>
+  language?: LanguageModelV3
+}
+
 function wrapSSE(res: Response, ms: number, ctl: AbortController) {
   if (typeof ms !== "number" || ms <= 0) return res
   if (!res.body) return res
@@ -117,19 +130,70 @@ function initError(providerID: ProviderV2.ID) {
 }
 
 export interface Interface {
+  readonly hook: {
+    readonly sdk: (
+      callback: (event: SDKEvent) => Effect.Effect<void> | void,
+    ) => Effect.Effect<State.Registration, never, Scope.Scope>
+    readonly language: (
+      callback: (event: LanguageEvent) => Effect.Effect<void> | void,
+    ) => Effect.Effect<State.Registration, never, Scope.Scope>
+  }
+  readonly runSDK: (event: SDKEvent) => Effect.Effect<SDKEvent>
+  readonly runLanguage: (event: LanguageEvent) => Effect.Effect<LanguageEvent>
   readonly language: (model: ModelV2.Info) => Effect.Effect<LanguageModelV3, InitError>
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/tool/bash.ts` - update based on opencode packages/core/src/tool/bash.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on opencode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/parameters.test.ts` - update based on opencode packages/opencode/test/tool/parameters.test.ts changes
- `src/tool/prompt.ts` - update based on opencode packages/opencode/src/tool/shell/prompt.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/shell.ts` - update based on opencode packages/opencode/src/tool/shell.ts changes
- `src/tool/skill.ts` - update based on opencode packages/core/src/tool/skill.ts changes
