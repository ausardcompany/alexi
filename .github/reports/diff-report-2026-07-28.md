# Upstream Changes Report
Generated: 2026-07-28 08:34:42

## Summary
- kilocode: 36 commits, 82 files changed
- opencode: 34 commits, 127 files changed

## kilocode Changes (b2735bfbc..a0a760e00)

### Commits

- a0a760e00 - fix(cli): enforce permissions on shell commands the parser fails to scan (#12585) (Marius, 2026-07-28)
- 40cbad4f3 - Merge pull request #12581 from Kilo-Org/jetbrains/release/v7.0.12-rc.2 (Kirill Kalishev, 2026-07-27)
- ea605a20d - docs(jetbrains): edit changelog for v7.0.12-rc.2 (Kirill Kalishev, 2026-07-27)
- de105b79d - release(jetbrains): v7.0.12-rc.2 (kilo-maintainer[bot], 2026-07-27)
- f84f3773f - Merge pull request #12578 from Kilo-Org/fix/jetbrains-bundled-signing-files-rc (Kirill Kalishev, 2026-07-27)
- 2d9ac3a86 - fix(jetbrains): use file signing inputs for bundled publish (kirillk, 2026-07-27)
- 7955f645e - Merge pull request #12577 from Kilo-Org/jetbrains/release/v7.0.12-rc.1 (Kirill Kalishev, 2026-07-27)
- 9cca61539 - docs(jetbrains): edit changelog for v7.0.12-rc.1 (Kirill Kalishev, 2026-07-27)
- e096b17f4 - release(jetbrains): v7.0.12-rc.1 (kilo-maintainer[bot], 2026-07-27)
- d33387705 - Merge pull request #12575 from Kilo-Org/fix/jetbrains-release-signing-raw-secrets (Kirill Kalishev, 2026-07-27)
- 3083fdb02 - fix(jetbrains): avoid writing release signing secrets (kirillk, 2026-07-27)
- b42b87e76 - Merge pull request #12571 from Kilo-Org/developing-liver (Kirill Kalishev, 2026-07-27)
- 633669e90 - Merge pull request #12572 from Kilo-Org/docs/note-bot-prs-ignored-code-reviews (Emilie Lima Schario, 2026-07-27)
- da6d20a32 - fix(jetbrains): localize queued prompt labels (kirillk, 2026-07-27)
- c1ebda7c5 - Update packages/kilo-docs/pages/automate/code-reviews/overview.md (Emilie Lima Schario, 2026-07-27)
- e20403565 - Apply suggestion from @emilieschario (Emilie Lima Schario, 2026-07-27)
- d362812a4 - Merge pull request #12570 from Kilo-Org/fix/jetbrains-bundled-publish-signing-file-vars (Kirill Kalishev, 2026-07-27)
- 0178e3361 - fix(jetbrains): handle queued prompt deletion misses (kirillk, 2026-07-27)
- b00a8e4d8 - docs: note that bot-generated PRs are ignored by default in Code Reviews (emilieschario, 2026-07-27)
- 2da0cac53 - fix(jetbrains): use file-based signing secrets for bundled publish workflow (kirillk, 2026-07-27)
- ec1e67b8d - chore: merge main into developing-liver (kirillk, 2026-07-27)
- 714b987c4 - Merge pull request #12567 from Kilo-Org/foul-aries (Kirill Kalishev, 2026-07-27)
- 51d660319 - fix(jetbrains): split bundled publish Gradle tasks (kirillk, 2026-07-27)
- 2da894981 - fix(ui): preserve parenthesized tildes in markdown (#12540) (Thomas Brugman, 2026-07-27)
- 44f596366 - fix(vscode): prevent recursive settings saves (#12561) (Marius, 2026-07-27)
- 439448291 - Merge pull request #12563 from Kilo-Org/jetbrains/release/v7.0.11 (Kirill Kalishev, 2026-07-27)
- d7baa1e67 - Apply suggestion from @kilo-code-bot[bot] (Kirill Kalishev, 2026-07-27)
- c96a67920 - docs(jetbrains): edit changelog for v7.0.11 (Kirill Kalishev, 2026-07-27)
- ee77f9edd - Merge pull request #12556 from Kilo-Org/fix/explain-tool-auto-approval (bagatao@anaconda.com, 2026-07-27)
- c12a567f2 - test(cli): cover TUI startup outside package (#12417) (Josh Holmer, 2026-07-27)
- b31833a24 - release(jetbrains): v7.0.11 (kilo-maintainer[bot], 2026-07-27)
- 1f3383cf3 - fix(tui): restore variant cycle keybind hint in prompt footer (#12463) (Aarav, 2026-07-27)
- 65c5e9d2c - fix(vscode): sync mode cycling state (#12560) (Marius, 2026-07-27)
- d93537cd7 - fix(ui): actually hide auto-approval line for hidden placement (Bruno Agatao, 2026-07-27)
- 61c86222c - fix(ui): refine auto-approval line for subagent and todo tools (Bruno Agatao, 2026-07-27)
- 9950739e3 - feat(jetbrains): support queued prompts (kirillk, 2026-07-26)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/shell-unparsed.ts` (+22, -0)
- `packages/opencode/src/tool/shell.ts` (+9, -0)
- `packages/opencode/test/kilocode/tool/shell-unparsed.test.ts` (+232, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/fix-scoped-mode-cycling.md` (+5, -0)
- `.changeset/fix-vscode-settings-save.md` (+5, -0)
- `.changeset/fuzzy-tildes-smile.md` (+5, -0)
- `.changeset/jetbrains-queued-prompts.md` (+5, -0)
- `.changeset/pwsh-permission-fail-closed.md` (+5, -0)
- `.changeset/tui-variant-shortcut-hint.md` (+5, -0)
- `.github/workflows/publish-jetbrains-bundled.yml` (+26, -6)
- `packages/kilo-docs/pages/automate/code-reviews/overview.md` (+5, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+33, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendChatManager.kt` (+27, -4)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+6, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+3, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendChatManagerTest.kt` (+43, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+13, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+7, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+27, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModelEvent.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+23, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+16, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+61, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PromptLifecycleTest.kt` (+40, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+9, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/log/ChatLogSummary.kt` (+7, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+3, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+7, -0)
- `packages/kilo-ui/src/components/basic-tool.css` (+7, -0)
- `packages/kilo-ui/src/components/basic-tool.test.ts` (+19, -0)
- `packages/kilo-ui/src/components/basic-tool.tsx` (+20, -4)
- `packages/kilo-ui/src/components/message-part.tsx` (+25, -6)
- `packages/kilo-ui/src/components/select-change.ts` (+4, -0)
- `packages/kilo-ui/src/components/select.test.ts` (+17, -0)
- `packages/kilo-ui/src/components/select.tsx` (+18, -0)
- `packages/kilo-ui/src/components/tool-approval.test.ts` (+57, -0)
- `packages/kilo-ui/src/components/tool-approval.tsx` (+9, -6)
- `packages/kilo-vscode/package.json` (+2, -2)
- `packages/kilo-vscode/src/KiloProvider.ts` (+14, -0)
- `packages/kilo-vscode/src/extension.ts` (+3, -1)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+17, -0)
- `packages/kilo-vscode/tests/unit/session-agent.test.ts` (+49, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+9, -8)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+9, -8)
- `packages/kilo-vscode/webview-ui/src/context/session-agent.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/context/vscode.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+6, -0)
- `packages/opencode/script/kilocode/test-profile.ts` (+1, -0)
- `packages/opencode/test/kilocode/cli/tui/thread.test.ts` (+78, -0)
- `packages/opencode/test/kilocode/test-profile.test.ts` (+1, -0)
- `packages/tui/src/component/prompt/index.tsx` (+6, -0)
- `packages/ui/src/context/marked.tsx` (+11, -0)
- `packages/ui/src/kilocode/markdown-strikethrough.test.ts` (+26, -0)

### Key Diffs

#### packages/opencode/src/kilocode/tool/shell-unparsed.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/shell-unparsed.ts b/packages/opencode/src/kilocode/tool/shell-unparsed.ts
new file mode 100644
index 000000000..3680f2eb7
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/shell-unparsed.ts
@@ -0,0 +1,22 @@
+import type { Node } from "web-tree-sitter"
+
+// tree-sitter-powershell drops commands containing a bare `--` into ERROR nodes
+// instead of command nodes, so the shell permission scanner collected zero
+// patterns and skipped the check entirely (Kilo-Org/kilocode#12326). Recover
+// the failed command text from ERROR nodes, and fail closed with the raw input
+// whenever the parse has errors and nothing else was recovered, so every
+// executed command yields at least one permission pattern. The raw fallback
+// also covers ERROR chunks without a command_name descendant (for example
+// PowerShell backtick escapes), which can still contain runnable text.
+export function unparsed(root: Node, commands: number): string[] {
+  if (!root.hasError && commands > 0) return []
+  const failed = root
+    .descendantsOfType("ERROR")
+    .filter((node): node is Node => Boolean(node))
+    .filter((node) => node.descendantsOfType("command_name").length > 0)
+    .map((node) => node.text.trim())
+    .filter((text) => text.length > 0)
+  if (failed.length > 0) return failed
+  const raw = root.text.trim()
+  return raw ? [raw] : []
+}
```

#### packages/opencode/src/tool/shell.ts
```diff
diff --git a/packages/opencode/src/tool/shell.ts b/packages/opencode/src/tool/shell.ts
index 429a04c7f..05c22e5cd 100644
--- a/packages/opencode/src/tool/shell.ts
+++ b/packages/opencode/src/tool/shell.ts
@@ -20,6 +20,7 @@ import { Plugin } from "@/plugin"
 import { normalizeUrls } from "@/kilocode/util/url" // kilocode_change
 import { CommandTimeout } from "@/kilocode/command-timeout" // kilocode_change
 import { heredocs } from "@/kilocode/tool/shell-heredoc" // kilocode_change
+import { unparsed } from "@/kilocode/tool/shell-unparsed" // kilocode_change
 import { ChildProcess } from "effect/unstable/process"
 import { ChildProcessSpawner } from "effect/unstable/process/ChildProcessSpawner"
 import { ShellPrompt, type Parameters } from "./shell/prompt"
@@ -404,6 +405,14 @@ export const ShellPermission = Effect.gen(function* () {
       }
     }
 
+    // kilocode_change start - fail closed on commands the grammar failed to parse (#12326)
+    const lost = unparsed(root, nodes.length)
+    if (lost.length > 0) scan.access = "unknown"
+    for (const pattern of lost) {
+      scan.patterns.add(pattern)
+    }
+    // kilocode_change end
+
     return scan
   })
 
```

#### packages/opencode/test/kilocode/tool/shell-unparsed.test.ts
```diff
diff --git a/packages/opencode/test/kilocode/tool/shell-unparsed.test.ts b/packages/opencode/test/kilocode/tool/shell-unparsed.test.ts
new file mode 100644
index 000000000..e9818cdbe
--- /dev/null
+++ b/packages/opencode/test/kilocode/tool/shell-unparsed.test.ts
@@ -0,0 +1,232 @@
+// Regression tests for Kilo-Org/kilocode#12326.
+//
+// tree-sitter-powershell dropped commands containing a bare `--` (for example
+// `git checkout -- <file>`) into ERROR nodes instead of command nodes, so the
+// shell permission scanner collected zero patterns and the command executed
+// with no permission evaluation at all, bypassing every bash rule including
+// `"git *": "deny"` and `"*": "deny"`. The scanner now fails closed: failed
+// command text is recovered from ERROR nodes, and any parse with errors that
+// recovered nothing falls back to the raw command text (also covering ERROR
+// chunks without a command_name descendant, such as backtick escapes).
+
+import { describe, expect, test } from "bun:test"
+import { Cause, Effect, Exit, Layer } from "effect"
+import path from "path"
+import { CrossSpawnSpawner } from "@opencode-ai/core/cross-spawn-spawner"
+import { FSUtil } from "@opencode-ai/core/fs-util"
+import type { PermissionV1 } from "@opencode-ai/core/v1/permission"
+import { Permission } from "../../../src/permission"
+import { ShellPermission } from "../../../src/tool/shell"
+import { ShellTool } from "../../../src/tool/shell"
+import { Shell } from "../../../src/shell/shell"
+import { Config } from "../../../src/config/config"
+import { Agent } from "../../../src/agent/agent"
+import { Plugin } from "../../../src/plugin"
+import { Truncate } from "../../../src/tool/truncate"
+import { RuntimeFlags } from "../../../src/effect/runtime-flags"
+import { SessionID, MessageID } from "../../../src/session/schema"
+import { disposeAllInstances, provideInstance, testInstanceStoreLayer, tmpdir } from "../../fixture/fixture"
+import { afterEach } from "bun:test"
+
+const layer = Layer.mergeAll(CrossSpawnSpawner.defaultLayer, FSUtil.defaultLayer, testInstanceStoreLayer)
+
+type ScanRequest = Omit<PermissionV1.Request, "id" | "sessionID" | "tool">
+
+async function scan(dir: string, command: string, shell: string) {
+  const requests: ScanRequest[] = []
+  const ctx = {
+    sessionID: SessionID.make("ses_test"),
+    messageID: MessageID.make("msg_test"),
+    callID: "",
+    agent: "code",
+    abort: AbortSignal.any([]),
+    messages: [],
+    metadata: () => Effect.void,
```


## opencode Changes (0b4edfc..1ead8d8)

### Commits

- 1ead8d8 - fix(app): localize home session suspense (#39285) (Brendan Allan, 2026-07-28)
- 8c81f9a - refactor(app): extract v2 settings controllers (#39228) (Brendan Allan, 2026-07-28)
- 95636bd - feat(desktop): collapse model provider sections (#39283) (usrnk1, 2026-07-28)
- 7dae9a1 - chore: generate (opencode-agent[bot], 2026-07-28)
- d46be56 - refactor(app): thin new session composition (#39227) (Brendan Allan, 2026-07-28)
- 8021dbd - sync release versions for v1.18.8 (opencode, 2026-07-28)
- c8487ba - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-28)
- 484f00e - fix(mcp): recover expired SDK sessions (#39265) (Aiden Cline, 2026-07-28)
- c3be6c4 - fix(mcp): honor callback port in debug (#39259) (Aiden Cline, 2026-07-28)
- 172d08c - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-28)
- 5e39051 - fix(provider): omit deprecated Gemini sampling defaults (#38924) (opencode-agent[bot], 2026-07-27)
- d50b9e8 - chore: generate (opencode-agent[bot], 2026-07-28)
- 921b1c6 - feat(mcp): upgrade client SDK to v2 (#39247) (Aiden Cline, 2026-07-27)
- 9c8060d - refactor(app): extract keybind settings controller (#39226) (Brendan Allan, 2026-07-28)
- 87db7a7 - fix(app): follow visual tab order (#39241) (Brendan Allan, 2026-07-28)
- 237e694 - fix(app): expand Windows file tree folders (#39249) (opencode-agent[bot], 2026-07-28)
- 3f9dad3 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-28)
- 3cc7016 - chore: generate (opencode-agent[bot], 2026-07-28)
- b72d7b6 - refactor(app): separate model selector controller and view (#39084) (Brendan Allan, 2026-07-28)
- 029f5aa - chore: bump gitlab-ai-provider to 6.12.0 (#39096) (Vladimir Glafirov, 2026-07-27)
- 284e970 - fix(app): use blue for server status attention (#39217) (Brendan Allan, 2026-07-28)
- 970c382 - chore: generate (opencode-agent[bot], 2026-07-28)
- c39ad38 - fix(app): refresh global provider state (#39220) (Brendan Allan, 2026-07-28)
- 91508f6 - chore: generate (opencode-agent[bot], 2026-07-28)
- 1274408 - fix(desktop): install AppStream metainfo in Linux packages (#36872) (Andrei Dziahel, 2026-07-28)
- 7ae1be5 - fix(desktop): use channel database in local runs (#39209) (Luke Parker, 2026-07-28)
- 40e4d73 - fix(console): avoid Safari brand icon repaint (#39154) (opencode-agent[bot], 2026-07-27)
- 8dc539b - fix(core): correct MCP environment field in built-in skill (#39175) (OpeOginni, 2026-07-27)
- 8e8d38c - fix(app): prevent freeze when closing projects (#39158) (Brendan Allan, 2026-07-27)
- a9bebd3 - docs(zen): add Kimi K3 (#39152) (Jack, 2026-07-28)
- 78f5764 - fix(console): stabilize brand download icons in Safari (#39151) (opencode-agent[bot], 2026-07-27)
- 55b0211 - feat(desktop): use bg layer 4 for v2 switch (#39085) (usrnk1, 2026-07-27)
- 4f62295 - fix(app): contain right panel suspense (#39080) (Brendan Allan, 2026-07-27)
- e1c4194 - refactor(app): extract tab rename adapter (#39079) (Brendan Allan, 2026-07-27)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/code-mode.ts` (+2, -23)
- `packages/opencode/test/tool/code-mode-integration.test.ts` (+8, -9)
- `packages/opencode/test/tool/code-mode.test.ts` (+1, -1)
- `packages/opencode/test/tool/registry.test.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/plugin/skill/customize-opencode.md` (+4, -3)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+49, -98)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -2)
- `packages/app/e2e/regression/open-file-expand-folder.spec.ts` (+132, -0)
- `packages/app/e2e/regression/tab-navigate-mousedown.spec.ts` (+33, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/dialog-connect-provider.tsx` (+2, -6)
- `packages/app/src/components/dialog-select-model.tsx` (+94, -86)
- `packages/app/src/components/prompt-input-v2.tsx` (+15, -13)
- `packages/app/src/components/prompt-input.tsx` (+24, -22)
- `packages/app/src/components/prompt-project-selector.tsx` (+14, -22)
- `packages/app/src/components/session/index.ts` (+0, -1)
- `packages/app/src/components/session/session-new-design-view.tsx` (+0, -16)
- `packages/app/src/components/settings-keybinds.tsx` (+289, -61)
- `packages/app/src/components/settings-v2/general-controller-behavior.ts` (+70, -0)
- `packages/app/src/components/settings-v2/general-controllers.test.ts` (+53, -0)
- `packages/app/src/components/settings-v2/general-controllers.ts` (+173, -0)
- `packages/app/src/components/settings-v2/general.tsx` (+258, -410)
- `packages/app/src/components/settings-v2/models.tsx` (+83, -34)
- `packages/app/src/components/settings-v2/settings-v2.css` (+56, -2)
- `packages/app/src/components/status-popover-indicator.test.ts` (+23, -1)
- `packages/app/src/components/status-popover-indicator.ts` (+11, -1)
- `packages/app/src/components/status-popover.tsx` (+19, -1)
- `packages/app/src/components/titlebar-tab-gesture.ts` (+2, -2)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+80, -105)
- `packages/app/src/components/titlebar-tab-order.test.ts` (+23, -0)
- `packages/app/src/components/titlebar-tab-order.ts` (+12, -0)
- `packages/app/src/components/titlebar-tab-strip.tsx` (+127, -43)
- `packages/app/src/components/titlebar.tsx` (+0, -34)
- `packages/app/src/context/file/path.test.ts` (+23, -0)
- `packages/app/src/context/file/path.ts` (+6, -1)
- `packages/app/src/context/server-sync.tsx` (+6, -0)
- `packages/app/src/pages/home/home-projects-view.tsx` (+18, -17)
- `packages/app/src/pages/home/home-sessions-view.tsx` (+19, -19)
- `packages/app/src/pages/home/home-sessions.tsx` (+0, -1)
- `packages/app/src/pages/new-session.tsx` (+27, -268)
- `packages/app/src/pages/new-session/new-session-draft-controller.ts` (+64, -0)
- `packages/app/src/pages/new-session/new-session-view.tsx` (+162, -0)
- `packages/app/src/pages/new-session/new-session-workspace-controller.test.ts` (+43, -0)
- `packages/app/src/pages/new-session/new-session-workspace-controller.ts` (+77, -0)
- `packages/app/src/pages/new-session/use-new-session-commands.tsx` (+44, -0)
- `packages/app/src/pages/session.tsx` (+42, -37)
- `packages/app/src/utils/menu-dismiss-controller.ts` (+30, -0)
- `packages/app/test-browser/settings-keybinds.test.ts` (+107, -0)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/brand/index.css` (+0, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/electron-builder.config.test.ts` (+12, -2)
- `packages/desktop/electron-builder.config.ts` (+9, -4)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/server.ts` (+0, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+4, -3)
- `packages/opencode/src/cli/cmd/mcp.ts` (+45, -102)
- `packages/opencode/src/mcp/auth.ts` (+4, -0)
- `packages/opencode/src/mcp/catalog.ts` (+44, -91)
- `packages/opencode/src/mcp/index.ts` (+52, -30)
- `packages/opencode/src/mcp/oauth-callback.ts` (+9, -3)
- `packages/opencode/src/mcp/oauth-provider.ts` (+63, -22)
- `packages/opencode/src/provider/transform.ts` (+17, -6)
- `packages/opencode/src/server/routes/instance/httpapi/groups/mcp.ts` (+1, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/mcp.ts` (+1, -1)
- `packages/opencode/src/session/tools.ts` (+1, -1)
- `packages/opencode/test/fixture/mcp-lifecycle-stdio.ts` (+3, -4)
- `packages/opencode/test/fixture/mcp-session-recovery.ts` (+9, -5)
- `packages/opencode/test/mcp/catalog.test.ts` (+51, -15)
- `packages/opencode/test/mcp/headers.test.ts` (+21, -4)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+13, -18)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+3, -5)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+2, -4)
- `packages/opencode/test/mcp/oauth-callback.test.ts` (+1, -1)
- `packages/opencode/test/mcp/oauth-provider.test.ts` (+0, -41)
- `packages/opencode/test/mcp/session-recovery.test.ts` (+20, -0)
- `packages/opencode/test/provider/transform.test.ts` (+63, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+2, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -0)
- `packages/sdk/openapi.json` (+3, -0)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/storybook/.storybook/mocks/app/components/dialog-select-model.tsx` (+4, -5)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/v2/components/switch-v2.css` (+2, -2)
- `packages/web/package.json` (+1, -1)
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
- `patches/@modelcontextprotocol%2Fclient@2.0.0-beta.5.patch` (+214, -0)
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch` (+0, -629)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 140c32e..f5a1bbb 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.7",
+  "version": "1.18.8",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index c91df0d..c1635e6 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.7",
+  "version": "1.18.8",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -108,7 +108,7 @@
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
-    "gitlab-ai-provider": "6.11.1",
+    "gitlab-ai-provider": "6.12.0",
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "gray-matter": "4.0.3",
```

#### packages/core/src/plugin/skill/customize-opencode.md
```diff
diff --git a/packages/core/src/plugin/skill/customize-opencode.md b/packages/core/src/plugin/skill/customize-opencode.md
index 6932dbf..549f15e 100644
--- a/packages/core/src/plugin/skill/customize-opencode.md
+++ b/packages/core/src/plugin/skill/customize-opencode.md
@@ -112,7 +112,7 @@ Every field is optional.
       "type": "local",
       "command": ["npx", "-y", "@playwright/mcp"],
       "enabled": true,
-      "env": {}
+      "environment": {}
     },
     "remote-thing": {
       "type": "remote",
@@ -371,7 +371,7 @@ Special object-shaped (not callbacks): `tool: { my_tool: { ... } }`,
       "type": "local",
       "command": ["npx", "-y", "@playwright/mcp"],
       "enabled": true,
-      "env": { "BROWSER": "chromium" }
+      "environment": { "BROWSER": "chromium" }
     },
     "github": {
       "type": "remote",
@@ -384,7 +384,8 @@ Special object-shaped (not callbacks): `tool: { my_tool: { ... } }`,
 }
 ```
 
-`command` is an array of strings. `type` is required. Use `enabled: false` to
+`command` is an array of strings. `environment` sets environment variables for
+a local MCP server. `type` is required. Use `enabled: false` to
 disable a server inherited from a parent config. String values such as header
 tokens support `{env:VAR}` interpolation (and `{file:path}`); the shell-style
 `${VAR}` is not substituted.
```

#### packages/opencode/src/tool/code-mode.ts
```diff
diff --git a/packages/opencode/src/tool/code-mode.ts b/packages/opencode/src/tool/code-mode.ts
index 332d4b4..a046b40 100644
--- a/packages/opencode/src/tool/code-mode.ts
+++ b/packages/opencode/src/tool/code-mode.ts
@@ -1,5 +1,5 @@
 import * as Tool from "./tool"
-import { CallToolResultSchema, type CallToolResult } from "@modelcontextprotocol/sdk/types.js"
+import { type CallToolResult } from "@modelcontextprotocol/client"
 import { Cause, Effect, Schema } from "effect"
 import { CodeMode, Tool as SandboxTool, toolError } from "@opencode-ai/codemode"
 import { MCP } from "@/mcp"
@@ -145,28 +145,7 @@ const invokeChildTool = Effect.fn("CodeMode.invokeChildTool")(function* (input:
   )
   const result: CallToolResult = yield* Effect.gen(function* () {
     yield* input.ctx.ask({ permission: input.entry.key, metadata: {}, patterns: ["*"], always: ["*"] })
-    // Deliberately mirrors McpCatalog.convertTool's transport call so the MCP service stays free of tool-loop concerns.
-    return yield* Effect.promise(async () => {
-      const raw = await input.entry.tool.client.callTool(
-        { name: input.entry.tool.def.name, arguments: input.args },
-        CallToolResultSchema,
-        {
-          resetTimeoutOnProgress: true,
-          signal: input.ctx.abort,
-          timeout: input.entry.tool.timeout,
-          // The MCP SDK only sends a progress token when this hook is present, enabling timeout resets.
-          onprogress: () => {},
-        },
-      )
-      if (raw.isError)
-        throw new Error(
-          raw.content
-            .flatMap((item) => (item.type === "text" ? [item.text] : []))
-            .filter((text) => text.trim())
-            .join("\n\n") || "MCP tool returned an error",
-        )
-      return raw
-    })
+    return yield* Effect.promise(() => McpCatalog.callTool(input.entry.tool, input.args, input.ctx.abort))
   }).pipe(
     Effect.withSpan("Tool.execute", {
       attributes: {
```

#### packages/opencode/test/tool/code-mode-integration.test.ts
```diff
diff --git a/packages/opencode/test/tool/code-mode-integration.test.ts b/packages/opencode/test/tool/code-mode-integration.test.ts
index 671acd8..32cb420 100644
--- a/packages/opencode/test/tool/code-mode-integration.test.ts
+++ b/packages/opencode/test/tool/code-mode-integration.test.ts
@@ -8,15 +8,14 @@ import { Session } from "@/session/session"
 import { Tool } from "@/tool/tool"
 import * as Truncate from "@/tool/truncate"
 import { MessageID, SessionID } from "@/session/schema"
-import { Server } from "@modelcontextprotocol/sdk/server/index.js"
-import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
-import type { Client } from "@modelcontextprotocol/sdk/client/index.js"
+import { Server } from "@modelcontextprotocol/server"
 import {
-  CallToolRequestSchema,
+  InMemoryTransport,
   LATEST_PROTOCOL_VERSION,
-  ListToolsRequestSchema,
+  type CallToolResult,
+  type Client,
   type Tool as MCPToolDef,
-} from "@modelcontextprotocol/sdk/types.js"
+} from "@modelcontextprotocol/client"
 import { Cause, Effect, Exit, Layer } from "effect"
 
 const PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
@@ -100,7 +99,7 @@ const TOOL_DEFS: MCPToolDef[] = [
   },
 ] as MCPToolDef[]
 
-function handleCall(name: string, args: Record<string, unknown>) {
+function handleCall(name: string, args: Record<string, unknown>): CallToolResult {
   switch (name) {
     case "get_text":
       return { content: [{ type: "text", text: `hello ${args.name}` }] }
@@ -122,8 +121,8 @@ let description: string
 
 async function buildTool() {
   const server = new Server({ name: SERVER, version: "1.0.0" }, { capabilities: { tools: {} } })
-  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFS }))
-  server.setRequestHandler(CallToolRequestSchema, async (req) =>
+  server.setRequestHandler("tools/list", async () => ({ tools: TOOL_DEFS }))
+  server.setRequestHandler("tools/call", async (req) =>
     handleCall(req.params.name, (req.params.arguments ?? {}) as Record<string, unknown>),
   )
 
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/code-mode-integration.test.ts` - update based on opencode packages/opencode/test/tool/code-mode-integration.test.ts changes
- `src/tool/code-mode.test.ts` - update based on opencode packages/opencode/test/tool/code-mode.test.ts changes
- `src/tool/code-mode.ts` - update based on opencode packages/opencode/src/tool/code-mode.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/shell-unparsed.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/shell-unparsed.test.ts changes
- `src/tool/shell-unparsed.ts` - update based on kilocode packages/opencode/src/kilocode/tool/shell-unparsed.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
