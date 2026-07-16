# Upstream Changes Report
Generated: 2026-07-16 08:14:41

## Summary
- kilocode: 41 commits, 129 files changed
- opencode: 10 commits, 48 files changed

## kilocode Changes (323227940..a0ffa3ed0)

### Commits

- a0ffa3ed0 - Merge pull request #12086 from rakshith1928/fix/grok-4.5-reasoning-variants (Christiaan Arnoldus, 2026-07-16)
- 29277b16b - test(cli): stabilize global skill permission test on slow CI (#12248) (Marius, 2026-07-16)
- 06c23379d - perf(cli): speed up local recall searches (#12242) (Marius, 2026-07-16)
- 1246d9898 - Merge pull request #12258 from Kilo-Org/jetbrains/release/v7.0.7 (Kirill Kalishev, 2026-07-15)
- e2be875b3 - docs(jetbrains): edit changelog for v7.0.7 (Kirill Kalishev, 2026-07-15)
- 526f7d203 - release(jetbrains): v7.0.7 (kilo-maintainer[bot], 2026-07-16)
- abd24c722 - Merge pull request #12217 from Kilo-Org/investigate-jetbrains-plugin-custom-provider-issue (Kirill Kalishev, 2026-07-15)
- 95d4ab674 - fix(jetbrains): remove leftover test preset in custom provider dialog (kirillk, 2026-07-15)
- 675d58cc4 - chore(jetbrains): add planning notes for custom provider dialog and picker consolidation (kirillk, 2026-07-15)
- 03a72e8f9 - fix(jetbrains): map custom provider delete action to disconnect (kirillk, 2026-07-15)
- cae3270c9 - fix(jetbrains): polish model picker popup and provider list actions (kirillk, 2026-07-15)
- 4ae998119 - Merge branch 'main' into fix/grok-4.5-reasoning-variants (rakshith1928, 2026-07-16)
- 0d13b79d2 - release: v7.4.9 (kilo-maintainer[bot], 2026-07-15)
- e19feecc4 - feat(jetbrains): improve custom model picker (kirillk, 2026-07-15)
- 14d343b24 - refactor(jetbrains): consolidate model picker popup (kirillk, 2026-07-15)
- 0c5dd5f8b - Merge pull request #12244 from Kilo-Org/fix/agent-manager-object-schema (Christiaan Arnoldus, 2026-07-15)
- d44efcb23 - Merge branch 'main' into fix/agent-manager-object-schema (Christiaan Arnoldus, 2026-07-15)
- 7e9285a25 - docs: clarify agent manager schema compatibility (chrarnoldus, 2026-07-15)
- 1b126c2fa - fix(cli): flatten agent manager tool schema (chrarnoldus, 2026-07-15)
- e1c7eadfd - Merge pull request #12194 from sylwester-liljegren/feat/vscode-chat-search-toggle (Marius, 2026-07-15)
- a76dc7738 - fix(vscode): support filenames with spaces and unicode in @mentions (#11977) (sylwester-liljegren, 2026-07-15)
- 814e8f827 - Merge pull request #12243 from Kilo-Org/fix-cli-test-ci-failure (Marius, 2026-07-15)
- fe4142630 - fix(cli): add object type to agent manager schema (chrarnoldus, 2026-07-15)
- e4ceeaebb - fix(cli): bound background process probes (marius-kilocode, 2026-07-15)
- 64017ac83 - Merge remote-tracking branch 'origin/main' into investigate-jetbrains-plugin-custom-provider-issue (kirillk, 2026-07-15)
- 5c05b86a7 - chore: retrigger CI (Sylwester Liljegren, 2026-07-15)
- 20f564ca5 - Merge branch 'main' into fix/grok-4.5-reasoning-variants (Christiaan Arnoldus, 2026-07-15)
- 19bd048e2 - release: v7.4.8 (kilo-maintainer[bot], 2026-07-15)
- 116a63c49 - feat(cli): wire dev:local to local event service (#12216) (Evgeny Shurakov, 2026-07-15)
- a4d15a58d - fix(vscode): skip posting toggleChatSearch when target webview is not ready (Sylwester Liljegren, 2026-07-15)
- b706b4d3b - chore: retrigger CI (Sylwester Liljegren, 2026-07-15)
- d6b36a028 - feat(jetbrains): edit custom providers and fix add dialog close (kirillk, 2026-07-14)
- 6077c1c3b - fix(jetbrains): make custom provider dialog report errors and require a model (kirillk, 2026-07-14)
- 8e8ce2b36 - fix(vscode): address chat-search review feedback (Sylwester Liljegren, 2026-07-14)
- fae8eba11 - fix(vscode): update unit tests for waitForReady and forceOpen mount guard (Sylwester Liljegren, 2026-07-14)
- d6262c06a - Merge remote-tracking branch 'upstream/main' into feat/vscode-chat-search-toggle (Sylwester Liljegren, 2026-07-14)
- 57c46044c - fix(vscode): address chat-search review feedback (Sylwester Liljegren, 2026-07-14)
- 9cc63d08c - chore(provider): annotate grok-4.5 kilocode_change markers (Rakshith N, 2026-07-14)
- 46fe0a91d - feat(vscode): toggle chat search from Command Palette, jump focus on close, and auto-expand matched blocks (Sylwester Liljegren, 2026-07-14)
- c654f1e3d - fix(provider): enable reasoning variants for Grok 4.5 (Rakshith N, 2026-07-10)
- cb02cb42f - fix(provider): enable reasoning variants for Grok models (Rakshith N, 2026-07-10)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+12, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `.changeset/orchestrate-agent-manager-sessions.md` (+0, -7)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/agent-behaviour-setting-descriptions.md` (+0, -5)
- `.changeset/calm-skill-permissions.md` (+0, -5)
- `.changeset/clean-windows-file-handles.md` (+0, -5)
- `.changeset/fast-local-recall.md` (+5, -0)
- `.changeset/file-picker-default-selection.md` (+0, -5)
- `.changeset/fix-cache-token-arrow.md` (+0, -5)
- `.changeset/fix-question-option-contrast.md` (+0, -5)
- `.changeset/fork-session-variant.md` (+0, -5)
- `.changeset/grok-4.5-reasoning-variants.md` (+5, -0)
- `.changeset/indexing-invalid-model-error.md` (+0, -5)
- `.changeset/inherit-agent-manager-sandbox.md` (+0, -7)
- `.changeset/isolate-model-cache-refresh.md` (+0, -5)
- `.changeset/jetbrains-custom-provider-edit.md` (+5, -0)
- `.changeset/jetbrains-custom-provider-inline-errors.md` (+5, -0)
- `.changeset/jetbrains-ide-zoom.md` (+0, -5)
- `.changeset/jetbrains-legacy-todos.md` (+0, -5)
- `.changeset/jetbrains-legacy-tool-turns.md` (+0, -5)
- `.changeset/jetbrains-legacy-v5-migration.md` (+0, -5)
- `.changeset/jetbrains-migration-later-and-language.md` (+0, -5)
- `.changeset/jetbrains-model-picker-close-button.md` (+5, -0)
- `.changeset/jetbrains-platform-http.md` (+0, -5)
- `.changeset/jetbrains-platform-stop-icon.md` (+0, -5)
- `.changeset/jetbrains-progress-elapsed-time.md` (+0, -5)
- `.changeset/jetbrains-prompt-action-separator.md` (+0, -5)
- `.changeset/jetbrains-prompt-right-padding.md` (+0, -5)
- `.changeset/jetbrains-providers-list-actions.md` (+5, -0)
- `.changeset/jetbrains-rollback-redo-font.md` (+0, -5)
- `.changeset/jetbrains-send-scroll-color.md` (+0, -5)
- `.changeset/neat-mammals-fry.md` (+0, -5)
- `.changeset/preserve-compaction-errors.md` (+0, -5)
- `.changeset/preserve-moved-worktree-head.md` (+0, -5)
- `.changeset/quiet-agent-tabs.md` (+0, -5)
- `.changeset/quiet-session-export-again.md` (+0, -5)
- `.changeset/remember-initial-prompts.md` (+0, -5)
- `.changeset/report-cli-vscode-presence.md` (+0, -6)
- `.changeset/secure-file-mentions.md` (+0, -6)
- `.changeset/share-session-database-safely.md` (+0, -5)
- `.changeset/sidebar-tab-close-focus.md` (+0, -5)
- `.changeset/stop-agent-manager-sessions.md` (+0, -6)
- `.changeset/timeline-bar-highlight.md` (+0, -5)
- `.changeset/worktree-dialog-prompt-enhancer.md` (+0, -5)
- `.kilo/plans/1784057744472-jetbrains-custom-provider-dialog.md` (+341, -0)
- `.kilo/plans/1784058434633-consolidate-jetbrains-model-pickers.md` (+198, -0)
- `bun.lock` (+29, -29)
- `package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+44, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/provider/KiloBackendProviderSettingsManager.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/provider/KiloBackendProviderSettingsManagerTest.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+32, -314)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRenderer.kt` (+100, -132)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProviderCatalog.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProviderListRows.kt` (+16, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUi.kt` (+406, -23)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/picker/PickerListRenderer.kt` (+118, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/picker/PickerPopup.kt` (+383, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUiTest.kt` (+339, -9)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/picker/PickerPopupTest.kt` (+89, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-highlight.test.ts` (+321, -0)
- `packages/kilo-ui/src/components/message-highlight.ts` (+114, -12)
- `packages/kilo-ui/src/components/message-part.tsx` (+76, -4)
- `packages/kilo-vscode/CHANGELOG.md` (+53, -0)
- `packages/kilo-vscode/package.json` (+6, -1)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+7, -0)
- `packages/kilo-vscode/src/extension.ts` (+1, -1)
- `packages/kilo-vscode/src/services/code-actions/register-code-actions.ts` (+39, -7)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+102, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+5, -2)
- `packages/kilo-vscode/tests/unit/register-code-actions.test.ts` (+35, -3)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+86, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/navigate.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+23, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+368, -15)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+32, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptSearch.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/question-dock-utils.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/transcript-search-highlight.ts` (+42, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/context/transcript-search.tsx` (+25, -1)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+52, -12)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/parts.ts` (+2, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+50, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/script/dev-local.ts` (+12, -2)
- `packages/opencode/src/kilocode/background-process/index.ts` (+2, -0)
- `packages/opencode/src/kilocode/background-process/runner.ts` (+1, -0)
- `packages/opencode/src/kilocode/session/recall-search.ts` (+76, -42)
- `packages/opencode/src/provider/transform.ts` (+5, -1)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+20, -0)
- `packages/opencode/test/kilocode/recall-search.test.ts` (+10, -8)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+11, -3)
- `packages/opencode/test/provider/transform.test.ts` (+19, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `plans/jetbrains-custom-provider-inline-errors.md` (+159, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### .changeset/orchestrate-agent-manager-sessions.md
```diff
diff --git a/.changeset/orchestrate-agent-manager-sessions.md b/.changeset/orchestrate-agent-manager-sessions.md
deleted file mode 100644
index 90a7658e1..000000000
--- a/.changeset/orchestrate-agent-manager-sessions.md
+++ /dev/null
@@ -1,7 +0,0 @@
----
-"@kilocode/cli": patch
-"@kilocode/sdk": patch
-"kilo-code": patch
----
-
-Inspect managed Agent Manager sessions and send a targeted prompt to an idle existing session from the native Agent Manager tool. Require a separate explicit approval before prompting another managed session.
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index f42f42758..71258f03f 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.4.7",
+  "version": "7.4.9",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/tool/agent-manager.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.ts b/packages/opencode/src/kilocode/tool/agent-manager.ts
index 38812128c..17607c9a7 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.ts
+++ b/packages/opencode/src/kilocode/tool/agent-manager.ts
@@ -8,6 +8,7 @@ import * as SandboxInheritance from "@/kilocode/sandbox/inheritance"
 import { KiloSessionMessageOrder } from "@/kilocode/session/message-order"
 import { Provider } from "@/provider/provider"
 import { SessionID } from "@/session/schema"
+import * as ToolJsonSchema from "@/tool/json-schema"
 import { Tool } from "@/tool/tool"
 import { Effect, Schema } from "effect"
 import { matchesQuery } from "./model-search"
@@ -76,6 +77,16 @@ const PromptParams = Schema.Struct({
 
 export const Params = Schema.Union([StartParams, ListParams, PromptParams])
 
+const WireParams = Schema.Struct({
+  mode: Schema.optional(StartParams.fields.mode),
+  versions: Schema.optional(StartParams.fields.versions),
+  tasks: Schema.optional(StartParams.fields.tasks),
+  action: Schema.optional(Schema.Literals(["list", "prompt"])),
+  filter: Schema.optional(ListParams.fields.filter),
+  sessionID: Schema.optional(PromptParams.fields.sessionID),
+  prompt: Schema.optional(PromptParams.fields.prompt),
+})
+
 type Input = Schema.Schema.Type<typeof Task>
 type Selected = { task?: AgentManagerTask; error?: string }
 type Candidate = { providerID: string; model: Provider.Info["models"][string] }
@@ -237,6 +248,7 @@ export const AgentManagerTool = Tool.define<
     return {
       description: DESCRIPTION,
       parameters: Params,
+      jsonSchema: ToolJsonSchema.fromSchema(WireParams),
       execute: (params, ctx) =>
         Effect.gen(function* () {
           if ("action" in params) {
```


## opencode Changes (05c3e40..1754480)

### Commits

- 1754480 - fix(app): remove inactive help button (#37217) (opencode-agent[bot], 2026-07-16)
- 4a760b5 - fix(app): show selector for custom agents (#37198) (Brendan Allan, 2026-07-16)
- 888c4cb - feat(tui): exit subagent menu with up arrow (#36951) (opencode-agent[bot], 2026-07-15)
- 4394b32 - sync release versions for v1.18.2 (opencode, 2026-07-15)
- a27ffb2 - docs: document subagent depth (#37132) (opencode-agent[bot], 2026-07-15)
- 81141dc - chore: generate (opencode-agent[bot], 2026-07-15)
- 285d315 - fix(core): limit subagent nesting depth (#37124) (opencode-agent[bot], 2026-07-15)
- 656f299 - fix(core): tolerate AlreadyExists in FSUtil.ensureDir (#36542) (BB84, 2026-07-15)
- 04bdf77 - fix(app): show help button in release builds (#37098) (opencode-agent[bot], 2026-07-15)
- ab7dfb1 - feat(app): open new tabs with mod+n (#37079) (opencode-agent[bot], 2026-07-15)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/task.ts` (+15, -1)
- `packages/opencode/test/tool/task.test.ts` (+80, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/fs-util.ts` (+8, -1)
- `packages/core/src/v1/config/config.ts` (+3, -0)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+28, -28)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/help-button.tsx` (+1, -43)
- `packages/app/src/components/titlebar.tsx` (+1, -1)
- `packages/app/src/context/local-agent.test.ts` (+29, -0)
- `packages/app/src/context/local-agent.ts` (+7, -0)
- `packages/app/src/context/local.tsx` (+7, -4)
- `packages/app/src/pages/layout-new.tsx` (+1, -2)
- `packages/app/src/pages/layout.tsx` (+1, -2)
- `packages/app/src/pages/session/composer/session-composer-controls.ts` (+1, -1)
- `packages/app/src/pages/session/use-composer-commands.tsx` (+2, -4)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
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
- `packages/opencode/src/cli/cmd/run/footer.command.tsx` (+6, -0)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+36, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -0)
- `packages/sdk/openapi.json` (+4, -0)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/config.mdx` (+15, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 6cb447d..2532744 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.1",
+  "version": "1.18.2",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 5de186c..eb5a037 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.1",
+  "version": "1.18.2",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/fs-util.ts
```diff
diff --git a/packages/core/src/fs-util.ts b/packages/core/src/fs-util.ts
index eb68627..93a551c 100644
--- a/packages/core/src/fs-util.ts
+++ b/packages/core/src/fs-util.ts
@@ -114,7 +114,14 @@ export namespace FSUtil {
       })
 
       const ensureDir = Effect.fn("FileSystem.ensureDir")(function* (path: string) {
-        yield* fs.makeDirectory(path, { recursive: true })
+        yield* fs.makeDirectory(path, { recursive: true }).pipe(
+          // Bun on Windows can throw EEXIST here despite recursive mode.
+          // https://github.com/oven-sh/bun/issues/21901
+          Effect.catchIf(
+            (error) => error.reason._tag === "AlreadyExists",
+            (error) => isDir(path).pipe(Effect.flatMap((exists) => (exists ? Effect.void : Effect.fail(error)))),
+          ),
+        )
       })
 
       const writeWithDirs = Effect.fn("FileSystem.writeWithDirs")(function* (
```

#### packages/core/src/v1/config/config.ts
```diff
diff --git a/packages/core/src/v1/config/config.ts b/packages/core/src/v1/config/config.ts
index 2e773f7..691f551 100644
--- a/packages/core/src/v1/config/config.ts
+++ b/packages/core/src/v1/config/config.ts
@@ -81,6 +81,9 @@ export const Info = Schema.Struct({
     description:
       "Default agent to use when none is specified. Must be a primary agent. Falls back to 'build' if not set or if the specified agent is invalid.",
   }),
+  subagent_depth: Schema.optional(NonNegativeInt).annotate({
+    description: "Maximum subagent nesting depth. Defaults to 1, which prevents subagents from launching subagents.",
+  }),
   username: Schema.optional(Schema.String).annotate({
     description: "Custom username to display in conversations instead of system username",
   }),
```

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index b0a866c..1384e5d 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -101,6 +101,21 @@ export const TaskTool = Tool.define(
         )
       }
 
+      const parent = yield* sessions.get(ctx.sessionID)
+      let current = parent
+      let depth = 0
+      while (current.parentID) {
+        depth++
+        current = yield* sessions.get(current.parentID)
+      }
+      if (depth >= (cfg.subagent_depth ?? 1)) {
+        return yield* Effect.fail(
+          new Error(
+            `Subagent depth limit reached (${cfg.subagent_depth ?? 1}). Increase "subagent_depth" to allow nested subagents.`,
+          ),
+        )
+      }
+
       if (!ctx.extra?.bypassAgentCheck) {
         yield* ctx.ask({
           permission: id,
@@ -121,7 +136,6 @@ export const TaskTool = Tool.define(
       const session = params.task_id
         ? yield* sessions.get(SessionID.make(params.task_id)).pipe(Effect.catchCause(() => Effect.succeed(undefined)))
         : undefined
-      const parent = yield* sessions.get(ctx.sessionID)
       const childPermission = deriveSubagentSessionPermission({
         parentSessionPermission: parent.permission ?? [],
         subagent: next,
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from .changeset/orchestrate-agent-manager-sessions.md
- `src/core/` - review core changes from packages/core/package.json
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
