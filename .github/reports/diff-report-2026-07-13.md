# Upstream Changes Report
Generated: 2026-07-13 09:28:14

## Summary
- kilocode: 33 commits, 60 files changed
- opencode: 14 commits, 20 files changed

## kilocode Changes (3cb82a090..f3abace24)

### Commits

- f3abace24 - Merge pull request #11837 from mjnaderi/fix-kilo-gateway-login-rate-limit-message (Marius, 2026-07-13)
- 92c4b3bfb - Merge pull request #12151 from Kilo-Org/fix-flaky-test (Marius, 2026-07-13)
- 857c496f7 - chore(script): reconcile team list with active maintainers (#12154) (Marius, 2026-07-13)
- 6cfa52bb7 - Merge pull request #12155 from Kilo-Org/feat/vscode-chat-search-supersede (Marius, 2026-07-13)
- 54a27c3fc - chore(script): drop kilo-engineering from team list (marius-kilocode, 2026-07-13)
- 167c304a4 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-13)
- d6720d2af - Merge pull request #12028 from sylwester-liljegren/feat/vscode-file-picker-mention (Marius, 2026-07-13)
- 064be73fe - fix(vscode): strip markdown links from non-JSON MCP/generic tool output (Sylwester Liljegren, 2026-07-13)
- fb44bb8dc - fix(vscode): don't strip markdown link syntax from tool/bash text; revert history-search cap (Sylwester Liljegren, 2026-07-13)
- e841aca8f - fix(vscode): don't strip markdown link syntax from user message text (Sylwester Liljegren, 2026-07-13)
- b0d19df9b - fix(vscode): strip markdown link/image URLs before counting search matches (Sylwester Liljegren, 2026-07-13)
- f96771d30 - fix(vscode): address chat search review findings from testing round (Sylwester Liljegren, 2026-07-13)
- 3d28bfc50 - fix(vscode): style No results as neutral text, not an error (Sylwester Liljegren, 2026-07-13)
- db9da24a3 - feat(vscode): show No results text in chat search when nothing matches (Sylwester Liljegren, 2026-07-13)
- d402df2cf - fix(vscode): jump to first match automatically while typing/toggling (Sylwester Liljegren, 2026-07-13)
- f4f23e1e3 - fix(vscode): match search text to error-row rendering for all variants (Sylwester Liljegren, 2026-07-13)
- 628ce6da9 - fix(vscode): address CI failure and review feedback on chat search (Sylwester Liljegren, 2026-07-13)
- 7a7c28c27 - feat(vscode): add in-chat search for the current session (Sylwester Liljegren, 2026-07-13)
- f6149e8b1 - fix(agent-manager): accept Windows workspace path casing (#12152) (Marius, 2026-07-13)
- d17041f7a - chore(script): reconcile team list with active maintainers (marius-kilocode, 2026-07-13)
- 77f798399 - fix(cli): resolve latest CLI release when GitHub latest points to non-CLI tag (#12148) (Ulises Millán, 2026-07-13)
- 76f6002ab - fix(vscode): use unknown bridge for migration message casts (marius-kilocode, 2026-07-13)
- 6d61b45dd - refactor(vscode): extract legacy-migration message cases out of webview switch (marius-kilocode, 2026-07-13)
- 411125ea3 - Merge branch 'main' into feat/vscode-file-picker-mention (Marius, 2026-07-13)
- bf2b33b87 - fix(cli): use filePath in Gemini prompt (Thomas Brugman, 2026-07-13)
- 135c2c4e9 - test(sandbox): stabilize fragmented ClientHello coverage (marius-kilocode, 2026-07-13)
- 80d2109bf - fix(vscode): normalize path traversal before workspace-containment check (Sylwester Liljegren, 2026-07-08)
- a41b81c0a - fix(vscode): don't auto-attach out-of-workspace files picked via the file picker (Sylwester Liljegren, 2026-07-08)
- c382cc38f - fix(vscode): focus textarea before execCommand in insertFilePickerResult (Sylwester Liljegren, 2026-07-08)
- 4b7fcee2f - fix(vscode): address file-picker mention review feedback (Sylwester Liljegren, 2026-07-08)
- 1dfed4858 - Merge remote-tracking branch 'upstream/main' into feat/vscode-file-picker-mention (Sylwester Liljegren, 2026-07-08)
- b2831c20d - feat(vscode): add file picker to @ mention dropdown (Sylwester Liljegren, 2026-07-08)
- 654e10e25 - fix(cli): show Kilo Gateway login rate limit message (Mohammad Javad Naderi, 2026-06-30)

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
- `.changeset/chat-transcript-search.md` (+5, -0)
- `.changeset/fix-gemini-file-path.md` (+5, -0)
- `.changeset/fix-install-jetbrains-tag.md` (+5, -0)
- `.changeset/gateway-login-rate-limit.md` (+5, -0)
- `.changeset/vscode-file-picker-mention.md` (+5, -0)
- `.changeset/windows-local-agent-sessions.md` (+5, -0)
- `install` (+8, -4)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-todos-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-sandbox/test/proxy.test.ts` (+38, -9)
- `packages/kilo-vscode/src/KiloProvider.ts` (+40, -17)
- `packages/kilo-vscode/src/agent-manager/tool-start.ts` (+4, -2)
- `packages/kilo-vscode/src/kilo-provider/file-picker.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-tool-start.test.ts` (+48, -1)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+67, -9)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+273, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+54, -51)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+449, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+49, -34)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+23, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptSearch.tsx` (+167, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/transcript-search-highlight.ts` (+133, -0)
- `packages/kilo-vscode/webview-ui/src/context/transcript-search.tsx` (+91, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+65, -3)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+67, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+8, -5)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-dropdowns.css` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+114, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+6, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+2, -1)
- `packages/opencode/src/provider/auth.ts` (+7, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+1, -1)
- `packages/opencode/src/session/prompt/gemini.txt` (+1, -1)
- `packages/opencode/test/kilocode/provider-auth-error-message.test.ts` (+83, -0)
- `packages/opencode/test/kilocode/system-prompt.test.ts` (+2, -0)
- `packages/script/src/index.ts` (+8, -12)
- `script/changelog-github.cjs` (+8, -12)

### Key Diffs

(no key diffs to show)

## opencode Changes (34e5809..17cd4a8)

### Commits

- 17cd4a8 - feat(app): align edit project modal with v2 style (#36213) (Aarav Sareen, 2026-07-13)
- 9bbf791 - chore: generate (opencode-agent[bot], 2026-07-13)
- 97f502e - feat(app): middle click to open new tab (#36215) (Aarav Sareen, 2026-07-13)
- dd02cea - feat(desktop): fix clipped labels and branch tooltip (#35724) (usrnk1, 2026-07-13)
- a8062ea - fix(provider): derive variants from reasoning metadata (#36624) (Aiden Cline, 2026-07-13)
- f476847 - fix(opencode): filter unsupported GPT-5.6 OAuth alias (#36621) (Aiden Cline, 2026-07-13)
- 8168f0f - fix(provider): route gateway variants by api id (#36614) (Aiden Cline, 2026-07-13)
- 8036440 - ci: remove starptech from core triage assignees (#36618) (opencode-agent[bot], 2026-07-12)
- cf75036 - chore: generate (opencode-agent[bot], 2026-07-12)
- 6f8e1dd - fix(provider): derive variants from reasoning options (#36543) (Aiden Cline, 2026-07-12)
- 4dcfd91 - chore: generate (opencode-agent[bot], 2026-07-12)
- d7c0db8 - fix(openai): use codex context limits for gpt-5.6 (#36248) (Nabs, 2026-07-12)
- 184da0e - test(opencode): refresh stale model references (#36546) (Aiden Cline, 2026-07-12)
- a244d82 - test(opencode): refresh models.dev fixture (#36541) (Aiden Cline, 2026-07-12)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `.opencode/tool/github-triage.ts` (+1, -1)
- `packages/opencode/test/tool/fixtures/models-api.json` (+122173, -66780)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/models-dev.ts` (+16, -0)

#### Other Changes
- `packages/app/src/components/dialog-edit-project-v2.tsx` (+156, -0)
- `packages/app/src/components/dialog-edit-project.tsx` (+38, -135)
- `packages/app/src/components/edit-project.ts` (+119, -0)
- `packages/app/src/components/prompt-input.tsx` (+1, -1)
- `packages/app/src/components/prompt-workspace-selector.tsx` (+12, -4)
- `packages/app/src/context/layout.tsx` (+12, -4)
- `packages/app/src/pages/home-session-open.test.ts` (+24, -5)
- `packages/app/src/pages/home-session-open.ts` (+3, -0)
- `packages/app/src/pages/home.tsx` (+21, -4)
- `packages/opencode/src/plugin/openai/codex.ts` (+8, -1)
- `packages/opencode/src/provider/provider.ts` (+9, -3)
- `packages/opencode/src/provider/transform.ts` (+189, -4)
- `packages/opencode/test/plugin/codex.test.ts` (+24, -0)
- `packages/opencode/test/provider/provider.test.ts` (+128, -28)
- `packages/opencode/test/provider/transform.test.ts` (+273, -0)
- `packages/ui/src/v2/components/icon.tsx` (+4, -0)
- `packages/ui/src/v2/components/project-avatar-v2.tsx` (+2, -3)

### Key Diffs

#### .opencode/tool/github-triage.ts
```diff
diff --git a/.opencode/tool/github-triage.ts b/.opencode/tool/github-triage.ts
index f25ca48..e861e1e 100644
--- a/.opencode/tool/github-triage.ts
+++ b/.opencode/tool/github-triage.ts
@@ -4,7 +4,7 @@ import { tool } from "@opencode-ai/plugin"
 const TEAM = {
   tui: ["kommander", "simonklee"],
   desktop_web: ["Hona", "Brendonovich"],
-  core: ["jlongster", "rekram1-node", "nexxeln", "kitlangton", "starptech"],
+  core: ["jlongster", "rekram1-node", "nexxeln", "kitlangton"],
   inference: ["fwang", "MrMushrooooom", "starptech"],
   windows: ["Hona"],
 } as const
```

#### packages/core/src/models-dev.ts
```diff
diff --git a/packages/core/src/models-dev.ts b/packages/core/src/models-dev.ts
index c2325cb..602133d 100644
--- a/packages/core/src/models-dev.ts
+++ b/packages/core/src/models-dev.ts
@@ -44,6 +44,21 @@ const Cost = Schema.Struct({
   ),
 })
 
+const ReasoningOption = Schema.Union([
+  Schema.Struct({
+    type: Schema.Literal("effort"),
+    values: Schema.Array(Schema.NullOr(Schema.String)),
+  }),
+  Schema.Struct({
+    type: Schema.Literal("toggle"),
+  }),
+  Schema.Struct({
+    type: Schema.Literal("budget_tokens"),
+    min: Schema.optional(Schema.Finite),
+    max: Schema.optional(Schema.Finite),
+  }),
+])
+
 export const Model = Schema.Struct({
   id: Schema.String,
   name: Schema.String,
@@ -53,6 +68,7 @@ export const Model = Schema.Struct({
   reasoning: Schema.Boolean,
   temperature: Schema.Boolean,
   tool_call: Schema.Boolean,
+  reasoning_options: Schema.optional(Schema.Array(ReasoningOption)),
   interleaved: Schema.optional(
     Schema.Union([
       Schema.Literal(true),
```

#### packages/opencode/test/tool/fixtures/models-api.json
```diff
diff --git a/packages/opencode/test/tool/fixtures/models-api.json b/packages/opencode/test/tool/fixtures/models-api.json
index 6302a95..8ead8c2 100644
--- a/packages/opencode/test/tool/fixtures/models-api.json
+++ b/packages/opencode/test/tool/fixtures/models-api.json
@@ -1,709 +1,976 @@
 {
-  "302ai": {
-    "id": "302ai",
-    "env": ["302AI_API_KEY"],
+  "requesty": {
+    "id": "requesty",
+    "env": ["REQUESTY_API_KEY"],
     "npm": "@ai-sdk/openai-compatible",
-    "api": "https://api.302.ai/v1",
-    "name": "302.AI",
-    "doc": "https://doc.302.ai",
+    "api": "https://router.requesty.ai/v1",
+    "name": "Requesty",
+    "doc": "https://requesty.ai/solution/llm-routing/models",
     "models": {
-      "qwen3-235b-a22b": {
-        "id": "qwen3-235b-a22b",
-        "name": "Qwen3-235B-A22B",
-        "family": "qwen",
-        "attachment": false,
-        "reasoning": false,
-        "tool_call": true,
-        "temperature": true,
-        "knowledge": "2025-04",
-        "release_date": "2025-04-29",
-        "last_updated": "2025-04-29",
-        "modalities": {
-          "input": ["text"],
-          "output": ["text"]
-        },
-        "open_weights": false,
-        "limit": {
-          "context": 128000,
-          "output": 16384
-        },
-        "cost": {
-          "input": 0.29,
-          "output": 2.86
-        }
-      },
-      "grok-4.1": {
-        "id": "grok-4.1",
-        "name": "grok-4.1",
+      "xai/grok-4": {
+        "id": "xai/grok-4",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/github-triage.ts` - update based on opencode .opencode/tool/github-triage.ts changes
- `src/tool/models-api.json.ts` - update based on opencode packages/opencode/test/tool/fixtures/models-api.json changes
