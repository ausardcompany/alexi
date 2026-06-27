# Upstream Changes Report
Generated: 2026-06-27 08:36:49

## Summary
- kilocode: 58 commits, 159 files changed
- opencode: 54 commits, 270 files changed

## kilocode Changes (715e10249..c9d7016ea)

### Commits

- c9d7016ea - Merge pull request #11692 from Kilo-Org/mark/skip-general-tests-for-jetbrains (Mark IJbema, 2026-06-26)
- 9394887e1 - feat(vscode): improve auto model picker details (#11724) (Johnny Eric Amancio, 2026-06-26)
- d931216a6 - Merge pull request #11714 from Kilo-Org/married-lathe (Joshua Lambert, 2026-06-26)
- ef3e8cbff - remove overly specific ones (Mark IJbema, 2026-06-26)
- 78eed0bca - Merge pull request #11696 from Kilo-Org/hardly-wish (Marius, 2026-06-26)
- 91fa34111 - Merge pull request #11726 from Kilo-Org/mark/notebook-create-action (Mark IJbema, 2026-06-26)
- 3d1549dd3 - Merge remote-tracking branch 'origin/main' into hardly-wish (marius-kilocode, 2026-06-26)
- c153d171c - Merge pull request #11703 from Kilo-Org/fix-sandbox-config-self-disable (Marius, 2026-06-26)
- 8f471284b - Merge branch 'main' into hardly-wish (Marius, 2026-06-26)
- 5e27070ef - Merge pull request #11727 from Kilo-Org/mark/stabilize-jetbrains-workspace-test (Mark IJbema, 2026-06-26)
- 1b1406441 - Merge branch 'main' into hardly-wish (Marius, 2026-06-26)
- 68ed2d5dc - Delete .kilo/plans/sandbox-toggle-session-state.md (Marius, 2026-06-26)
- a526a0266 - Merge branch 'main' into hardly-wish (marius-kilocode, 2026-06-26)
- d98bb46db - Merge pull request #11697 from Kilo-Org/docs/sandbox-documentation (Marius, 2026-06-26)
- 3b7873b1d - docs(cli): clarify notebook_edit create workflow in tool descriptions (Mark IJbema, 2026-06-26)
- fe6f857bb - Merge pull request #11689 from Kilo-Org/feat/agent-manager-worktree-sandbox (Marius, 2026-06-26)
- e245fded3 - Merge pull request #11698 from Kilo-Org/mark/marketplace-match-notification (Mark IJbema, 2026-06-26)
- be1f77d43 - feat(gateway): expose kilo pass profile contract (#11721) (Johnny Eric Amancio, 2026-06-26)
- ac6478d14 - test(jetbrains): stabilize workspace startup wait (markijbema, 2026-06-26)
- 6bc57fe6f - feat(vscode): create empty notebooks via notebook_edit (Mark IJbema, 2026-06-26)
- a18acfc71 - fix(vscode): honor suggestion choice across rescans (Mark IJbema, 2026-06-26)
- 7b1383751 - ci: skip general tests for isolated changes (markijbema, 2026-06-26)
- e0c1e729d - Merge pull request #11715 from Kilo-Org/docs/cost-controls-and-usage-safeguards (Rietie, 2026-06-26)
- 1e83f0fbe - Merge pull request #11716 from Kilo-Org/mark/reset-read-notifications (Mark IJbema, 2026-06-26)
- 2acb32595 - refactor(vscode): move notification state handling (Mark IJbema, 2026-06-26)
- 3f4688c82 - refactor(vscode): extract notification reset handler (Mark IJbema, 2026-06-26)
- acfcbcace - fix(vscode): reset read notifications from settings (Mark IJbema, 2026-06-26)
- 80ed571bd - feat(vscode): notify on matching marketplace items (Mark IJbema, 2026-06-26)
- 6832cbeb4 - Update cost-control configuration to use only 'kilo-auto/efficient' (Ligia Zanchet, 2026-06-26)
- 5761f8b4d - docs: add maximum-constraint starter kilo.jsonc example to cost-controls page (kiloconnect[bot], 2026-06-26)
- a2af9a9cb - Revise cost controls and usage safeguards documentation (Ligia Zanchet, 2026-06-26)
- 10fcd8b11 - docs: add Cost Controls and Usage Safeguards page (kiloconnect[bot], 2026-06-26)
- 0589415d4 - fix: satisfy Anaconda Desktop CI contracts (Josh Lambert, 2026-06-26)
- 78b5777d7 - refactor: use standard provider icon fallback (Josh Lambert, 2026-06-25)
- 50b9f3eb4 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-26)
- 7b2063f35 - feat: add Anaconda Desktop provider (Josh Lambert, 2026-06-25)
- 6089b5f3d - test(cli): stabilize websocket retry timeout (marius-kilocode, 2026-06-25)
- 9c6146949 - docs(sandbox): clarify policy snapshot semantics (marius-kilocode, 2026-06-25)
- 4dbfa25d8 - refactor(sandbox): name persisted policy snapshot (marius-kilocode, 2026-06-25)
- 90ac84738 - fix(sandbox): reject credential substitutions (marius-kilocode, 2026-06-25)
- ad0b8ff30 - Merge remote-tracking branch 'origin/main' into hardly-wish (marius-kilocode, 2026-06-25)
- 801f8ff86 - fix(sandbox): protect policy store without ancestor denies (marius-kilocode, 2026-06-25)
- 7c65a3313 - fix: preserve sandbox state across session scopes (marius-kilocode, 2026-06-25)
- 0c237da12 - chore(opencode): fix config variable annotations (marius-kilocode, 2026-06-25)
- 36d304515 - Merge remote-tracking branch 'origin/main' into fix-sandbox-config-self-disable (marius-kilocode, 2026-06-25)
- eb82a38a2 - test(sandbox): cover primary kilo config (marius-kilocode, 2026-06-25)
- c70255b32 - docs: keep experimental example limited to config-only flags (marius-kilocode, 2026-06-25)
- 163aef567 - fix(sandbox): prevent config self-disable (marius-kilocode, 2026-06-25)
- 78d6243b2 - docs: document the experimental sandbox feature (marius-kilocode, 2026-06-25)
- be3ae8296 - fix: remember sandbox state per session (marius-kilocode, 2026-06-25)
- 8ffec05df - fix(agent-manager): align sandbox with prompt actions (marius-kilocode, 2026-06-25)
- 8d449df39 - fix(ci): retain full tests outside pull requests (markijbema, 2026-06-25)
- b1ae2a95d - Merge remote-tracking branch 'origin/main' into feat/agent-manager-worktree-sandbox (marius-kilocode, 2026-06-25)
- 4910ac895 - Merge remote-tracking branch 'origin/main' into feat/agent-manager-worktree-sandbox (marius-kilocode, 2026-06-25)
- 26ea495c3 - fix(agent-manager): fail closed when sandbox setup fails (marius-kilocode, 2026-06-25)
- 376398e88 - ci(github): implement path filtering to skip unit tests for JetBrains-only changes (markijbema, 2026-06-25)
- 3a072e9b2 - refactor(vscode): share one SandboxButton between prompt and worktree modal (marius-kilocode, 2026-06-25)
- 9e04e74eb - feat(agent-manager): add sandbox toggle to new worktree modal (marius-kilocode, 2026-06-25)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/notebook-host.ts` (+37, -13)
- `packages/opencode/src/tool/task.ts` (+8, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/test/kilocode/linux-sandbox.test.ts` (+24, -0)

#### Other Changes
- `.changeset/add-anaconda-desktop-provider.md` (+7, -0)
- `.changeset/agent-manager-worktree-sandbox.md` (+5, -0)
- `.changeset/auto-model-picker-details.md` (+5, -0)
- `.changeset/kilo-pass-profile-contract.md` (+7, -0)
- `.changeset/marketplace-match-notification.md` (+5, -0)
- `.changeset/notebook-create-action.md` (+5, -0)
- `.changeset/remember-sandbox-sessions.md` (+7, -0)
- `.changeset/reset-read-notifications.md` (+5, -0)
- `.changeset/secure-sandbox-config.md` (+5, -0)
- `.github/workflows/test.yml` (+59, -13)
- `packages/kilo-docs/lib/nav/ai-providers.ts` (+4, -0)
- `packages/kilo-docs/lib/nav/getting-started.ts` (+2, -0)
- `packages/kilo-docs/pages/ai-providers/anaconda-desktop.md` (+92, -0)
- `packages/kilo-docs/pages/ai-providers/index.md` (+1, -0)
- `packages/kilo-docs/pages/getting-started/cost-controls-and-usage-safeguards.md` (+400, -0)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+1, -0)
- `packages/kilo-docs/pages/getting-started/settings/sandboxing.md` (+76, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/anaconda-desktop/limited-tools-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/anaconda-desktop/not-installed-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/anaconda-desktop/ready-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/anaconda-desktop/waiting-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/source-links.md` (+2, -0)
- `packages/kilo-gateway/src/api/kilo-pass.ts` (+44, -0)
- `packages/kilo-gateway/src/api/models.ts` (+7, -0)
- `packages/kilo-gateway/src/index.ts` (+2, -0)
- `packages/kilo-gateway/src/server/handlers.ts` (+6, -3)
- `packages/kilo-gateway/src/server/routes.ts` (+8, -0)
- `packages/kilo-gateway/src/types.ts` (+7, -0)
- `packages/kilo-gateway/test/api/kilo-pass.test.ts` (+63, -0)
- `packages/kilo-gateway/test/api/models.test.ts` (+39, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceTest.kt` (+18, -10)
- `packages/kilo-vscode/src/KiloProvider.ts` (+157, -69)
- `packages/kilo-vscode/src/MarketplacePanelProvider.ts` (+17, -0)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+60, -4)
- `packages/kilo-vscode/src/agent-manager/__tests__/AgentManagerProvider.spec.ts` (+20, -0)
- `packages/kilo-vscode/src/agent-manager/sandbox-bootstrap.ts` (+39, -0)
- `packages/kilo-vscode/src/agent-manager/tool-start.ts` (+6, -1)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+18, -0)
- `packages/kilo-vscode/src/anaconda-desktop/bridge.ts` (+94, -0)
- `packages/kilo-vscode/src/extension.ts` (+8, -0)
- `packages/kilo-vscode/src/kilo-provider/notifications.ts` (+86, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.test.ts` (+18, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+9, -0)
- `packages/kilo-vscode/src/services/marketplace/notifier.ts` (+123, -0)
- `packages/kilo-vscode/src/services/marketplace/notify.ts` (+52, -0)
- `packages/kilo-vscode/src/services/notebook/adapter.ts` (+59, -13)
- `packages/kilo-vscode/src/services/notebook/bridge.ts` (+1, -1)
- `packages/kilo-vscode/src/services/notebook/path.ts` (+50, -0)
- `packages/kilo-vscode/src/services/notebook/types.ts` (+4, -2)
- `packages/kilo-vscode/src/services/sandbox-preference.ts` (+58, -0)
- `packages/kilo-vscode/src/shared/anaconda-desktop-messages.ts` (+36, -0)
- `packages/kilo-vscode/src/shared/sandbox-session.ts` (+31, -0)
- `packages/kilo-vscode/tests/model-selector-accessibility.spec.ts` (+46, -10)
- `packages/kilo-vscode/tests/unit/agent-manager-tool-start.test.ts` (+6, -1)
- `packages/kilo-vscode/tests/unit/anaconda-desktop-actions.test.ts` (+101, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+86, -86)
- `packages/kilo-vscode/tests/unit/marketplace-notify.test.ts` (+49, -0)
- `packages/kilo-vscode/tests/unit/message-contract.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/model-selector-utils.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/notebook-core.test.ts` (+74, -3)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+27, -15)
- `packages/kilo-vscode/tests/unit/sandbox-bootstrap.test.ts` (+144, -0)
- `packages/kilo-vscode/tests/unit/sandbox-preference.test.ts` (+72, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+24, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+62, -82)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceView.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/AboutKiloCodeTab.tsx` (+12, -15)
- `packages/kilo-vscode/webview-ui/src/components/settings/AnacondaDesktopDialog.tsx` (+301, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProviderConnectDialog.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProvidersTab.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelPreview.tsx` (+37, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+34, -4)
- `packages/kilo-vscode/webview-ui/src/components/shared/SandboxButton.tsx` (+88, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/model-selector-utils.ts` (+34, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+10, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+56, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+10, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+10, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+10, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+10, -1)
- `packages/kilo-vscode/webview-ui/src/stories/anaconda-desktop.stories.tsx` (+76, -0)
- `packages/kilo-vscode/webview-ui/src/stories/prompt-input.stories.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/stories/shared.stories.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/providers.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+27, -2)
- `packages/kilo-vscode/webview-ui/src/utils/anaconda-desktop-action.ts` (+57, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+1, -0)
- `packages/opencode/src/config/variable.ts` (+9, -1)
- `packages/opencode/src/kilocode/anaconda-desktop/discovery.ts` (+413, -0)
- `packages/opencode/src/kilocode/anaconda-desktop/domain.ts` (+429, -0)
- `packages/opencode/src/kilocode/anaconda-desktop/platform.ts` (+211, -0)
- `packages/opencode/src/kilocode/anaconda-desktop/provider.ts` (+116, -0)
- `packages/opencode/src/kilocode/anaconda-desktop/service.ts` (+92, -0)
- `packages/opencode/src/kilocode/anaconda-desktop/tui/model.ts` (+248, -0)
- `packages/opencode/src/kilocode/anaconda-desktop/tui/setup.tsx` (+124, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-provider.tsx` (+3, -1)
- `packages/opencode/src/kilocode/config/variable.ts` (+23, -0)
- `packages/opencode/src/kilocode/notebook/protocol.ts` (+6, -2)
- `packages/opencode/src/kilocode/provider/metadata.ts` (+2, -1)
- `packages/opencode/src/kilocode/provider/provider.ts` (+7, -0)
- `packages/opencode/src/kilocode/sandbox/policy.ts` (+125, -31)
- `packages/opencode/src/kilocode/sandbox/state.ts` (+83, -0)
- `packages/opencode/src/kilocode/sandbox/store.ts` (+77, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/anaconda-desktop.ts` (+100, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilo-gateway.ts` (+8, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+2, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/sandbox.ts` (+16, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/anaconda-desktop.ts` (+59, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+9, -3)
- `packages/opencode/src/kilocode/server/httpapi/handlers/sandbox.ts` (+1, -0)
- `packages/opencode/src/kilocode/server/httpapi/public.ts` (+1, -0)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+3, -0)
- `packages/opencode/src/plugin/index.ts` (+2, -0)
- `packages/opencode/src/provider/models.ts` (+2, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+2, -1)
- `packages/opencode/src/session/session.ts` (+5, -1)
- `packages/opencode/test/kilocode/anaconda-desktop/discovery.test.ts` (+358, -0)
- `packages/opencode/test/kilocode/anaconda-desktop/domain.test.ts` (+161, -0)
- `packages/opencode/test/kilocode/anaconda-desktop/httpapi-exercise-scenarios.ts` (+18, -0)
- `packages/opencode/test/kilocode/anaconda-desktop/plugin.test.ts` (+113, -0)
- `packages/opencode/test/kilocode/anaconda-desktop/service.test.ts` (+144, -0)
- `packages/opencode/test/kilocode/anaconda-desktop/tui/controller.test.ts` (+124, -0)
- `packages/opencode/test/kilocode/anaconda-desktop/tui/view.test.ts` (+42, -0)
- `packages/opencode/test/kilocode/config/variable.test.ts` (+58, -0)
- `packages/opencode/test/kilocode/notebook-tools.test.ts` (+21, -1)
- `packages/opencode/test/kilocode/provider-model-metadata.test.ts` (+45, -0)
- `packages/opencode/test/kilocode/sandbox/config-network.test.ts` (+13, -5)
- `packages/opencode/test/kilocode/sandbox/macos-confinement.test.ts` (+32, -0)
- `packages/opencode/test/kilocode/sandbox/policy.test.ts` (+8, -2)
- `packages/opencode/test/kilocode/sandbox/session.test.ts` (+23, -5)
- `packages/opencode/test/kilocode/sandbox/shell-network.test.ts` (+11, -8)
- `packages/opencode/test/kilocode/sandbox/state.test.ts` (+164, -45)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+6, -0)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+7, -0)
- `packages/opencode/test/plugin/openai-ws.test.ts` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+151, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+218, -2)
- `packages/sdk/openapi.json` (+612, -4)

### Key Diffs

#### packages/core/test/kilocode/linux-sandbox.test.ts
```diff
diff --git a/packages/core/test/kilocode/linux-sandbox.test.ts b/packages/core/test/kilocode/linux-sandbox.test.ts
index 83d5b4303..487d83ff8 100644
--- a/packages/core/test/kilocode/linux-sandbox.test.ts
+++ b/packages/core/test/kilocode/linux-sandbox.test.ts
@@ -441,6 +441,30 @@ linux("applies explicit file and subtree denies after a writable parent", async
   }
 })
 
+linux("prevents renaming denied policy state while sibling state remains writable", async () => {
+  const root = await fixture()
+  const state = path.join(root.project, "state")
+  const store = path.join(root.project, "policy")
+  const sibling = path.join(state, "sibling.txt")
+  const moved = path.join(state, "moved")
+  await fs.mkdir(state)
+  await fs.mkdir(store)
+  const policy = denied(profile([state]), [{ path: store, kind: "subtree" }])
+  const script = [
+    'const fs = require("node:fs")',
+    `fs.writeFileSync(${JSON.stringify(sibling)}, "allowed")`,
+    `try { fs.renameSync(${JSON.stringify(store)}, ${JSON.stringify(moved)}); process.exit(2) } catch {}`,
+  ].join("\n")
+
+  try {
+    expect(Number(await Effect.runPromise(spawn(script, root.project, policy)))).toBe(0)
+    expect(await fs.readFile(sibling, "utf8")).toBe("allowed")
+    expect((await fs.stat(store)).isDirectory()).toBe(true)
+  } finally {
+    await fs.rm(root.root, { recursive: true, force: true })
+  }
+})
+
 linux("supports writable literal files without opening writable siblings", async () => {
   const root = await fixture()
   const allowed = path.join(root.project, "allowed.txt")
```

#### packages/opencode/src/kilocode/tool/notebook-host.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/notebook-host.ts b/packages/opencode/src/kilocode/tool/notebook-host.ts
index f50f8e78c..867c229b9 100644
--- a/packages/opencode/src/kilocode/tool/notebook-host.ts
+++ b/packages/opencode/src/kilocode/tool/notebook-host.ts
@@ -58,7 +58,7 @@ export const NotebookReadTool = Tool.define<
     const notebook = yield* Notebook.Service
     return {
       description:
-        "Read a live, possibly unsaved VS Code notebook using a request-directory-relative path or a safe absolute path inside that directory. Returns an opaque content revision for edits; outputs are omitted unless include_outputs is true.",
+        "Read a live, possibly unsaved VS Code notebook using a request-directory-relative path or a safe absolute path inside that directory. Returns an opaque content revision for edits; outputs are omitted unless include_outputs is true. Use notebook_edit to create a notebook or change its cells, and notebook_execute to run a cell and generate its outputs.",
       parameters: ReadParams,
       execute: (params, ctx) =>
         Effect.gen(function* () {
@@ -91,10 +91,15 @@ export const NotebookReadTool = Tool.define<
 
 const EditParams = Schema.Struct({
   path: Path,
-  expected_revision: Revision,
-  index: Index,
-  action: Schema.Literals(["insert", "replace", "delete"]).annotate({
-    description: "insert and replace require kind and source; delete ignores cell fields",
+  expected_revision: Schema.optional(Revision).annotate({
+    description: "Required for insert, replace, and delete. Omit for create, which has no prior revision.",
+  }),
+  index: Schema.optional(Index).annotate({
+    description: "Zero-based cell index. Required for insert, replace, and delete. Ignored for create.",
+  }),
+  action: Schema.Literals(["insert", "replace", "delete", "create"]).annotate({
+    description:
+      "insert and replace require kind and source; delete ignores cell fields; create makes a new empty .ipynb at path and ignores cell fields, index, and expected_revision",
   }),
   kind: Schema.optional(Schema.Literals(["code", "markdown"])).annotate({
     description: "Cell kind. Required for insert and replace.",
@@ -105,12 +110,27 @@ const EditParams = Schema.Struct({
 type EditInput = Schema.Schema.Type<typeof EditParams>
 
 function cellEdit(params: EditInput) {
-  if (params.action === "delete") return Effect.succeed({ action: params.action } as const)
-  if (params.kind === undefined || params.source === undefined)
+  if (params.action === "create") return Effect.succeed({ action: params.action } as const)
+  if (params.action === "delete") {
+    if (params.expected_revision === undefined || params.index === undefined)
+      return Effect.die(
+        new Tool.InvalidArgumentsError({
+          tool: "notebook_edit",
+          detail: `the "delete" action requires both "expected_revision" and "index"`,
+        }),
+      )
+    return Effect.succeed({ action: params.action } as const)
+  }
```

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index eb7c748f0..f26541618 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -18,6 +18,7 @@ import { errorMessage } from "@/util/error" // kilocode_change
 import { Cause, Effect, Exit, Schema, Scope } from "effect"
 import { EffectBridge } from "@/effect/bridge"
 import { RuntimeFlags } from "@/effect/runtime-flags"
+import * as SandboxPolicy from "@/kilocode/sandbox/policy" // kilocode_change
 
 export interface TaskPromptOps {
   cancel(sessionID: SessionID): Effect.Effect<void>
@@ -160,7 +161,10 @@ export const TaskTool = Tool.define(
       const rules = KiloTask.inherited({ caller, session: parent, mcp: cfg.mcp })
       // kilocode_change end
       // kilocode_change start - refresh current parent restrictions when resuming an existing task session
+      const mode: "allow" | "deny" = cfg.experimental?.sandbox_restrict_network === false ? "allow" : "deny"
+      const fallback = { enabled: cfg.experimental?.sandbox ?? false, mode }
       if (session) {
+        yield* SandboxPolicy.inherit(ctx.sessionID, session.id, fallback)
         const permission = KiloTask.merge(
           session.permission ?? [],
           deriveSubagentSessionPermission({
@@ -175,6 +179,7 @@ export const TaskTool = Tool.define(
       }
       // kilocode_change end
       const platform = KiloSession.resolvePlatform(ctx.sessionID) // kilocode_change - preserve parent attribution across task creation/resume
+      // kilocode_change start - create a child session with inherited Kilo restrictions
       const nextSession =
         session ??
         (yield* sessions.create({
@@ -197,8 +202,10 @@ export const TaskTool = Tool.define(
           ),
           // kilocode_change end
         }))
-      // kilocode_change start - rebuild in-memory ancestry and attribution after process restart
+      // kilocode_change end
+      // kilocode_change start - rebuild in-memory ancestry and inherit confinement after creation/resume
       KiloSession.register({ id: nextSession.id, parentID: ctx.sessionID, platform })
+      yield* SandboxPolicy.inherit(ctx.sessionID, nextSession.id, fallback)
       // kilocode_change end
 
       const msg = yield* MessageV2.get({ sessionID: ctx.sessionID, messageID: ctx.messageID }).pipe(Effect.orDie)
```


## opencode Changes (eeb5b1d..6861fed)

### Commits

- 6861fed - chore: generate (opencode-agent[bot], 2026-06-27)
- 3d07211 - fix(app): reconcile session pages with concurrent events (#34042) (Luke Parker, 2026-06-27)
- bdfea04 - fix(desktop): recognize normal auth metadata input prompts in connect provider dialog (#33024) (OpeOginni, 2026-06-27)
- a2d08fb - feat(app): update home screen alignment + markdown styles (#34172) (Aarav Sareen, 2026-06-27)
- 5a55135 - fix(ui): make select hover feedback immediate (#34121) (opencode-agent[bot], 2026-06-27)
- 8870d36 - fix(app): space home sessions from scrollbar (#34132) (opencode-agent[bot], 2026-06-27)
- eb923c2 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-27)
- 9903abc - fix(opencode): allow empty provider config default (#34167) (opencode-agent[bot], 2026-06-26)
- 225a1fb - chore: generate (opencode-agent[bot], 2026-06-27)
- 93159bc - feat(core): port v2 runtime fixes onto dev (Dax Raad, 2026-06-27)
- fab8ec4 - fix(app): migrate composer tooltips to v2 (#34147) (opencode-agent[bot], 2026-06-27)
- a3035c5 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-27)
- 36c416e - fix(mcp): request refresh token scope (#34125) (Aiden Cline, 2026-06-26)
- e1e0304 - fix(mcp): surface OAuth completion errors (#34145) (Aiden Cline, 2026-06-26)
- 71c3a7c - chore: generate (opencode-agent[bot], 2026-06-27)
- ecdfff5 - refactor(core): separate out location node functionality and integrate into v2 (#34119) (James Long, 2026-06-26)
- 4b948c5 - fix(app): hide home session archive action (#34136) (opencode-agent[bot], 2026-06-27)
- cd56c51 - fix(app): keep bare slash as plain inline code (#34122) (opencode-agent[bot], 2026-06-26)
- 43e39d7 - fix(tui): use generated event union (#34118) (opencode-agent[bot], 2026-06-26)
- 7a17925 - zen: new inference (Frank, 2026-06-26)
- 5acb253 - fix(app): centralize notification state (#34105) (Brendan Allan, 2026-06-26)
- 44a6787 - chore: generate (opencode-agent[bot], 2026-06-26)
- 42e6b7d - feat(sdk): expose live event stream (#34098) (Kit Langton, 2026-06-26)
- 2c02f8b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-26)
- 2ec20e5 - fix(app): slow tooltip display for models (#30745) (Affan Ali, 2026-06-27)
- 20f47fe - chore: generate (opencode-agent[bot], 2026-06-26)
- 65210f2 - feat(api): add finite durable session history pages (#34097) (Kit Langton, 2026-06-26)
- af0b7ff - fix(app): animate prompt selectors after loading (#34101) (Brendan Allan, 2026-06-27)
- 0e2dd4a - chore: generate (opencode-agent[bot], 2026-06-26)
- 11d2f3e - fix(llm): end reasoning before responses (Dax Raad, 2026-06-26)
- 1ac6b4b - fix(core): authorize external read paths (Dax Raad, 2026-06-26)
- 0befd9b - chore: generate (opencode-agent[bot], 2026-06-26)
- 850a0df - fix(core): resolve prompt attachment mime types (Dax Raad, 2026-06-26)
- 18a419e - chore: generate (opencode-agent[bot], 2026-06-26)
- 82f47cb - feat(stats): add clickable section headings (#34095) (Adam, 2026-06-26)
- 7b1fe33 - fix(data): clarify unchanged rank (Adam, 2026-06-26)
- c72cca8 - docs: route enterprise contact links (#34080) (Stefan Avram, 2026-06-26)
- 05ce6bc - fix(data): canonicalize locale pages (Adam, 2026-06-26)
- 1de7368 - fix(acp): send partial completed tool updates (#34091) (Shoubhit Dash, 2026-06-26)
- 36f9015 - fix(app): wait for persisted home state before reading collapsed state (#34088) (Brendan Allan, 2026-06-27)
- 92f1a17 - docs(providers): document blacklist and whitelist model filtering (#33792) (Ariane Emory, 2026-06-26)
- ebf4007 - fix(acp): enrich permission prompts (#34079) (Shoubhit Dash, 2026-06-26)
- 1aea999 - fix(app): consolidate add project action (#34086) (Brendan Allan, 2026-06-26)
- 4a8fee3 - feat(app): add new session workspace controls (#34085) (Brendan Allan, 2026-06-26)
- 0d3e0fc - fix(core): enlarge OAuth callback card (#34082) (Aiden Cline, 2026-06-26)
- f254476 - fix(llm): omit stateless response item ids (#34027) (Aiden Cline, 2026-06-26)
- 639c8e6 - tweak: update OAuth callback branding (#34081) (Aiden Cline, 2026-06-26)
- e3bfd4c - fix(mcp): refresh credentials on reauthentication (#33717) (Aiden Cline, 2026-06-26)
- c288226 - fix(acp): skip resume transcript replay (#34070) (Shoubhit Dash, 2026-06-26)
- 9c38b91 - feat(app): updates to design system (#34066) (Aarav Sareen, 2026-06-26)
- 6e8e772 - fix(acp): surface prompt errors (#34061) (Shoubhit Dash, 2026-06-26)
- 971518c - fix(core): refresh cached remote skills (#34059) (Shoubhit Dash, 2026-06-26)
- ae85356 - fix(opencode): preserve skill resource paths (#34052) (Shoubhit Dash, 2026-06-26)
- 753d312 - fix(tui): preserve renderer initialization errors (#33996) (Luke Parker, 2026-06-26)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/application-tools.ts` (+3, -0)
- `packages/core/src/tool/apply-patch.ts` (+45, -11)
- `packages/core/src/tool/bash.ts` (+28, -36)
- `packages/core/src/tool/builtins.ts` (+37, -0)
- `packages/core/src/tool/edit.ts` (+22, -6)
- `packages/core/src/tool/read-filesystem.ts` (+3, -0)
- `packages/core/src/tool/read.ts` (+24, -20)
- `packages/core/src/tool/registry.ts` (+13, -0)
- `packages/core/src/tool/tool.ts` (+26, -8)
- `packages/opencode/test/tool/registry.test.ts` (+11, -4)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+8, -4)
- `packages/opencode/test/agent/agent.test.ts` (+2, -2)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+2, -2)

#### Permission System (**/permission/)
- `packages/core/src/permission/saved.ts` (+3, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+3, -0)
- `packages/core/src/agent.ts` (+3, -0)
- `packages/core/src/aisdk.ts` (+3, -0)
- `packages/core/src/background-job.ts` (+3, -0)
- `packages/core/src/catalog.ts` (+3, -0)
- `packages/core/src/command.ts` (+3, -0)
- `packages/core/src/config.ts` (+7, -0)
- `packages/core/src/credential.ts` (+3, -0)
- `packages/core/src/cross-spawn-spawner.ts` (+2, -2)
- `packages/core/src/database/database.ts` (+2, -2)
- `packages/core/src/effect/layer-node-platform.ts` (+6, -6)
- `packages/core/src/effect/layer-node.ts` (+0, -248)
- `packages/core/src/effect/layer-node/index.ts` (+2, -0)
- `packages/core/src/effect/layer-node/layer-node-tree.ts` (+118, -0)
- `packages/core/src/effect/layer-node/layer-node.ts` (+127, -0)
- `packages/core/src/effect/node-build.ts` (+18, -0)
- `packages/core/src/effect/node.ts` (+14, -0)
- `packages/core/src/effect/scoped-node.ts` (+0, -11)
- `packages/core/src/event.ts` (+83, -17)
- `packages/core/src/file-mutation.ts` (+3, -0)
- `packages/core/src/filesystem.ts` (+7, -0)
- `packages/core/src/filesystem/search.ts` (+6, -3)
- `packages/core/src/filesystem/watcher.ts` (+7, -0)
- `packages/core/src/fs-util.ts` (+2, -2)
- `packages/core/src/git.ts` (+2, -2)
- `packages/core/src/global.ts` (+2, -2)
- `packages/core/src/image.ts` (+3, -0)
- `packages/core/src/instruction-context.ts` (+7, -0)
- `packages/core/src/integration.ts` (+3, -0)
- `packages/core/src/location-layer.ts` (+0, -151)
- `packages/core/src/location-mutation.ts` (+7, -0)
- `packages/core/src/location-service-map.ts` (+18, -0)
- `packages/core/src/location-services.ts` (+112, -0)
- `packages/core/src/location.ts` (+11, -0)
- `packages/core/src/models-dev.ts` (+2, -2)
- `packages/core/src/npm.ts` (+2, -2)
- `packages/core/src/oauth/page.ts` (+12, -12)
- `packages/core/src/permission.ts` (+7, -0)
- `packages/core/src/plugin.ts` (+16, -0)
- `packages/core/src/plugin/internal.ts` (+46, -16)
- `packages/core/src/plugin/provider/opencode.ts` (+6, -3)
- `packages/core/src/policy.ts` (+3, -0)
- `packages/core/src/process.ts` (+21, -2)
- `packages/core/src/project.ts` (+2, -2)
- `packages/core/src/project/copy.ts` (+8, -2)
- `packages/core/src/project/directories.ts` (+2, -2)
- `packages/core/src/pty.ts` (+3, -0)
- `packages/core/src/pty/ticket.ts` (+2, -2)
- `packages/core/src/public-event-manifest.ts` (+5, -1)
- `packages/core/src/question.ts` (+3, -0)
- `packages/core/src/reference.ts` (+7, -0)
- `packages/core/src/reference/guidance.ts` (+3, -0)
- `packages/core/src/repository-cache.ts` (+7, -0)
- `packages/core/src/ripgrep.ts` (+2, -2)
- `packages/core/src/ripgrep/binary.ts` (+2, -2)
- `packages/core/src/session.ts` (+306, -265)
- `packages/core/src/session/execution.ts` (+4, -0)
- `packages/core/src/session/execution/local.ts` (+11, -2)
- `packages/core/src/session/message-updater.ts` (+2, -0)
- `packages/core/src/session/projector.ts` (+2, -2)
- `packages/core/src/session/runner/llm.ts` (+24, -1)
- `packages/core/src/session/runner/model.ts` (+4, -1)
- `packages/core/src/session/store.ts` (+3, -0)
- `packages/core/src/session/todo.ts` (+3, -0)
- `packages/core/src/skill.ts` (+3, -0)
- `packages/core/src/skill/discovery.ts` (+64, -12)
- `packages/core/src/skill/guidance.ts` (+3, -0)
- `packages/core/src/snapshot.ts` (+7, -0)
- `packages/core/src/system-context/builtins.ts` (+9, -0)
- `packages/core/src/system-context/registry.ts` (+3, -0)
- `packages/core/src/tool-output-store.ts` (+5, -0)
- `packages/core/src/util/effect-flock.ts` (+2, -2)
- `packages/core/src/v1/config/provider-options.ts` (+9, -0)
- `packages/core/test/config/config.test.ts` (+2, -2)
- `packages/core/test/config/provider-options.test.ts` (+5, -3)
- `packages/core/test/effect/layer-node/layer-node-types.test.ts` (+137, -0)
- `packages/core/test/effect/layer-node/layer-node.test.ts` (+226, -0)
- `packages/core/test/effect/layer-node/node-build.test.ts` (+119, -0)
- `packages/core/test/event.test.ts` (+64, -1)
- `packages/core/test/location-layer.test.ts` (+8, -6)
- `packages/core/test/move-session.test.ts` (+2, -2)
- `packages/core/test/permission.test.ts` (+2, -2)
- `packages/core/test/plugin/provider-opencode.test.ts` (+27, -3)
- `packages/core/test/process/process.test.ts` (+16, -0)
- `packages/core/test/session-create.test.ts` (+22, -4)
- `packages/core/test/session-history.test.ts` (+174, -0)
- `packages/core/test/session-projector.test.ts` (+2, -2)
- `packages/core/test/session-prompt.test.ts` (+23, -2)
- `packages/core/test/session-runner-model.test.ts` (+22, -0)
- `packages/core/test/session-runner-recorded.test.ts` (+2, -2)
- `packages/core/test/session-runner.test.ts` (+15, -5)
- `packages/core/test/skill-discovery.test.ts` (+62, -2)
- `packages/core/test/tool-apply-patch.test.ts` (+23, -0)
- `packages/core/test/tool-bash.test.ts` (+47, -31)
- `packages/core/test/tool-edit.test.ts` (+9, -4)
- `packages/core/test/tool-read.test.ts` (+55, -2)

#### Other Changes
- `bun.lock` (+5, -0)
- `nix/hashes.json` (+4, -4)
- `packages/app/package.json` (+1, -0)
- `packages/app/src/app.tsx` (+22, -12)
- `packages/app/src/components/dialog-connect-provider.tsx` (+27, -4)
- `packages/app/src/components/dialog-select-directory-v2.tsx` (+9, -4)
- `packages/app/src/components/dialog-select-model.tsx` (+1, -0)
- `packages/app/src/components/prompt-input.tsx` (+68, -26)
- `packages/app/src/components/prompt-project-selector.tsx` (+84, -23)
- `packages/app/src/components/prompt-workspace-selector.tsx` (+102, -0)
- `packages/app/src/components/settings-v2/dialog-server-v2.tsx` (+9, -4)
- `packages/app/src/components/settings-v2/settings-v2.css` (+1, -1)
- `packages/app/src/context/notification.tsx` (+328, -230)
- `packages/app/src/context/server-sdk.test.ts` (+115, -8)
- `packages/app/src/context/server-sdk.tsx` (+41, -50)
- `packages/app/src/context/server-session.test.ts` (+1033, -4)
- `packages/app/src/context/server-session.ts` (+537, -66)
- `packages/app/src/i18n/en.ts` (+4, -0)
- `packages/app/src/index.css` (+1, -9)
- `packages/app/src/pages/home.tsx` (+37, -27)
- `packages/app/src/pages/layout-new.tsx` (+1, -9)
- `packages/app/src/pages/new-session.tsx` (+42, -8)
- `packages/app/src/wsl/settings.tsx` (+10, -3)
- `packages/client/script/build.ts` (+15, -6)
- `packages/client/src/contract.ts` (+3, -1)
- `packages/client/src/effect.ts` (+1, -0)
- `packages/client/src/generated-effect/client.ts` (+43, -19)
- `packages/client/src/generated/client.ts` (+22, -0)
- `packages/client/src/generated/types.ts` (+475, -13)
- `packages/client/src/index.ts` (+1, -0)
- `packages/client/test/contract-identity.test.ts` (+2, -1)
- `packages/client/test/effect.test.ts` (+100, -1)
- `packages/client/test/promise.test.ts` (+66, -3)
- `packages/console/app/src/lib/stats-proxy.ts` (+68, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+10, -0)
- `packages/httpapi-codegen/src/index.ts` (+28, -17)
- `packages/httpapi-codegen/test/generate.test.ts` (+18, -0)
- `packages/llm/src/protocols/gemini.ts` (+23, -9)
- `packages/llm/src/protocols/openai-chat.ts` (+6, -1)
- `packages/llm/src/protocols/openai-responses.ts` (+13, -5)
- `packages/llm/test/fixtures/recordings/openai-responses/openai-responses-gpt-5-5-reasoning-continuation.json` (+1, -1)
- `packages/llm/test/provider/gemini.test.ts` (+4, -1)
- `packages/llm/test/provider/openai-chat.test.ts` (+1, -1)
- `packages/llm/test/provider/openai-responses.test.ts` (+17, -10)
- `packages/llm/test/tool-runtime.test.ts` (+1, -1)
- `packages/opencode/src/acp/error.ts` (+8, -1)
- `packages/opencode/src/acp/permission.ts` (+139, -9)
- `packages/opencode/src/acp/service.ts` (+57, -10)
- `packages/opencode/src/acp/tool.ts` (+1, -4)
- `packages/opencode/src/cli/cmd/debug/file.ts` (+3, -3)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+3, -3)
- `packages/opencode/src/command/index.ts` (+9, -1)
- `packages/opencode/src/mcp/index.ts` (+23, -20)
- `packages/opencode/src/mcp/oauth-provider.ts` (+62, -9)
- `packages/opencode/src/provider/provider.ts` (+2, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/file.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+5, -5)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+22, -1)
- `packages/opencode/src/session/message-v2.ts` (+1, -2)
- `packages/opencode/src/session/session.ts` (+2, -2)
- `packages/opencode/src/session/system.ts` (+8, -4)
- `packages/opencode/src/skill/discovery.ts` (+48, -11)
- `packages/opencode/src/skill/index.ts` (+2, -2)
- `packages/opencode/test/acp/permission.test.ts` (+130, -3)
- `packages/opencode/test/acp/service-session.test.ts` (+93, -19)
- `packages/opencode/test/acp/tool.test.ts` (+81, -0)
- `packages/opencode/test/effect/layer-node-tiers-types.test.ts` (+0, -19)
- `packages/opencode/test/effect/layer-node-tiers.test.ts` (+0, -169)
- `packages/opencode/test/effect/layer-node-types.test.ts` (+0, -66)
- `packages/opencode/test/effect/layer-node.test.ts` (+0, -86)
- `packages/opencode/test/effect/scoped-node-types.test.ts` (+0, -23)
- `packages/opencode/test/fixtures/recordings/session/native-openai-oauth-tool-loop.json` (+1, -1)
- `packages/opencode/test/fixtures/recordings/session/native-zen-tool-loop.json` (+1, -1)
- `packages/opencode/test/git/git.test.ts` (+2, -1)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+72, -1)
- `packages/opencode/test/mcp/oauth-provider.test.ts` (+41, -0)
- `packages/opencode/test/provider/provider.test.ts` (+11, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+34, -0)
- `packages/opencode/test/server/httpapi-v2-location.test.ts` (+37, -6)
- `packages/opencode/test/session/compaction.test.ts` (+4, -1)
- `packages/opencode/test/session/llm-native.test.ts` (+4, -8)
- `packages/opencode/test/session/messages-pagination.test.ts` (+2, -1)
- `packages/opencode/test/session/processor-effect.test.ts` (+15, -8)
- `packages/opencode/test/session/prompt.test.ts` (+5, -3)
- `packages/opencode/test/session/retry.test.ts` (+2, -1)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+11, -7)
- `packages/opencode/test/session/system.test.ts` (+2, -2)
- `packages/opencode/test/share/share-next.test.ts` (+10, -6)
- `packages/opencode/test/skill/discovery.test.ts` (+46, -0)
- `packages/opencode/test/skill/skill.test.ts` (+27, -0)
- `packages/protocol/src/groups/event.ts` (+10, -13)
- `packages/protocol/src/groups/session.ts` (+38, -4)
- `packages/protocol/test/session-cursor.test.ts` (+10, -2)
- `packages/schema/src/durable-event-manifest.ts` (+5, -0)
- `packages/schema/src/event.ts` (+3, -3)
- `packages/schema/src/index.ts` (+1, -0)
- `packages/schema/src/prompt-input.ts` (+26, -0)
- `packages/schema/src/session-event.ts` (+3, -1)
- `packages/schema/src/session-message.ts` (+4, -0)
- `packages/sdk-next/src/index.ts` (+1, -0)
- `packages/sdk-next/test/embedded.test.ts` (+84, -1)
- `packages/sdk/js/package.json` (+1, -0)
- `packages/sdk/js/script/build.ts` (+54, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+36, -2)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+437, -942)
- `packages/sdk/js/test/session-history.test.ts` (+12, -0)
- `packages/sdk/openapi.json` (+1076, -3530)
- `packages/server/src/handlers.ts` (+0, -21)
- `packages/server/src/handlers/event.ts` (+14, -8)
- `packages/server/src/handlers/session.ts` (+26, -0)
- `packages/server/src/location.ts` (+3, -3)
- `packages/server/src/middleware/session-location.ts` (+2, -2)
- `packages/server/src/pty-environment.ts` (+4, -1)
- `packages/server/src/routes.ts` (+34, -7)
- `packages/session-ui/src/components/markdown-inline-code-kind.ts` (+1, -0)
- `packages/session-ui/src/components/markdown.css` (+10, -2)
- `packages/stats/app/src/i18n.ts` (+1, -0)
- `packages/stats/app/src/i18n/ar.ts` (+1, -0)
- `packages/stats/app/src/i18n/br.ts` (+1, -0)
- `packages/stats/app/src/i18n/da.ts` (+1, -0)
- `packages/stats/app/src/i18n/de.ts` (+1, -0)
- `packages/stats/app/src/i18n/es.ts` (+1, -0)
- `packages/stats/app/src/i18n/fr.ts` (+1, -0)
- `packages/stats/app/src/i18n/it.ts` (+1, -0)
- `packages/stats/app/src/i18n/ja.ts` (+1, -0)
- `packages/stats/app/src/i18n/ko.ts` (+1, -0)
- `packages/stats/app/src/i18n/no.ts` (+1, -0)
- `packages/stats/app/src/i18n/pl.ts` (+1, -0)
- `packages/stats/app/src/i18n/ru.ts` (+1, -0)
- `packages/stats/app/src/i18n/th.ts` (+1, -0)
- `packages/stats/app/src/i18n/tr.ts` (+1, -0)
- `packages/stats/app/src/i18n/uk.ts` (+1, -0)
- `packages/stats/app/src/i18n/zh.ts` (+1, -0)
- `packages/stats/app/src/i18n/zht.ts` (+1, -0)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+44, -22)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+28, -12)
- `packages/stats/app/src/routes/index.css` (+34, -0)
- `packages/stats/app/src/routes/index.tsx` (+53, -19)
- `packages/stats/app/src/routes/section-heading.tsx` (+24, -0)
- `packages/stats/app/src/routes/stats-cache.ts` (+27, -0)
- `packages/tui/src/app.tsx` (+18, -16)
- `packages/tui/src/context/data.tsx` (+3, -3)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/components/select.css` (+0, -3)
- `packages/ui/src/v2/components/button-v2.css` (+24, -0)
- `packages/ui/src/v2/components/button-v2.stories.tsx` (+4, -3)
- `packages/ui/src/v2/components/button-v2.tsx` (+1, -1)
- `packages/ui/src/v2/components/dialog-v2.css` (+31, -7)
- `packages/ui/src/v2/components/dialog-v2.stories.tsx` (+60, -28)
- `packages/ui/src/v2/components/dialog-v2.tsx` (+66, -47)
- `packages/ui/src/v2/components/divider-v2.css` (+11, -0)
- `packages/ui/src/v2/components/divider-v2.stories.tsx` (+38, -0)
- `packages/ui/src/v2/components/divider-v2.tsx` (+20, -0)
- `packages/ui/src/v2/components/icon.tsx` (+16, -0)
- `packages/web/src/content/docs/enterprise.mdx` (+7, -8)
- `packages/web/src/content/docs/providers.mdx` (+36, -0)
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch` (+152, -0)
- `specs/layer-node-tiers.md` (+0, -235)
- `specs/v2/schema-changelog.md` (+7, -0)
- `specs/v2/session.md` (+5, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 139d116..636385e 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -16,6 +16,8 @@
     "opencode": "./bin/opencode"
   },
   "exports": {
+    "./effect/layer-node": "./src/effect/layer-node/index.ts",
+    "./effect/node": "./src/effect/node.ts",
     "./session/runner": "./src/session/runner/index.ts",
     "./system-context": "./src/system-context/index.ts",
     "./*": "./src/*.ts"
@@ -102,6 +104,7 @@
     "ai-gateway-provider": "3.1.2",
     "bun-pty": "0.4.8",
     "cross-spawn": "catalog:",
+    "diff": "catalog:",
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index 91f4116..6173551 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -1,5 +1,6 @@
 export * as AgentV2 from "./agent"
 
+import { makeLocationNode } from "./effect/node"
 import { Array, Context, Effect, Layer, Types } from "effect"
 import { Agent } from "@opencode-ai/schema/agent"
 import { State } from "./state"
@@ -106,3 +107,5 @@ export const layer = Layer.effect(
 )
 
 export const locationLayer = layer
+
+export const node = makeLocationNode({ service: Service, layer, deps: [] })
```

#### packages/core/src/aisdk.ts
```diff
diff --git a/packages/core/src/aisdk.ts b/packages/core/src/aisdk.ts
index 9ea7939..26bcef0 100644
--- a/packages/core/src/aisdk.ts
+++ b/packages/core/src/aisdk.ts
@@ -1,5 +1,6 @@
 export * as AISDK from "./aisdk"
 
+import { makeLocationNode } from "./effect/node"
 import type { LanguageModelV3 } from "@ai-sdk/provider"
 import { Cause, Context, Effect, Layer, Schema, Scope } from "effect"
 import { ModelV2 } from "./model"
@@ -231,4 +232,6 @@ export const locationLayer = Layer.effect(
   }),
 )
 
+export const node = makeLocationNode({ service: Service, layer: locationLayer, deps: [] })
+
 export const defaultLayer = locationLayer
```

#### packages/core/src/background-job.ts
```diff
diff --git a/packages/core/src/background-job.ts b/packages/core/src/background-job.ts
index 35724eb..98ba12e 100644
--- a/packages/core/src/background-job.ts
+++ b/packages/core/src/background-job.ts
@@ -2,6 +2,7 @@ export * as BackgroundJob from "./background-job"
 
 import { Cause, Clock, Context, Deferred, Effect, Exit, Layer, Scope, SynchronizedRef } from "effect"
 import { Identifier } from "./id/id"
+import { makeGlobalNode } from "./effect/node"
 
 export type Status = "running" | "completed" | "error" | "cancelled"
 
@@ -362,3 +363,5 @@ export const make = Effect.gen(function* () {
 export const layer = Layer.effect(Service, make)
 
 export const defaultLayer = layer
+
+export const node = makeGlobalNode({ service: Service, layer, deps: [] })
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index 63d0ae3..f63f3f0 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -1,5 +1,6 @@
 export * as Catalog from "./catalog"
 
+import { makeLocationNode } from "./effect/node"
 import { Array, Context, Effect, Layer, Option, Order, pipe, Schema } from "effect"
 import { Catalog } from "@opencode-ai/schema/catalog"
 import { ModelV2 } from "./model"
@@ -296,3 +297,5 @@ export const locationLayer = layer.pipe(
   Layer.provideMerge(Integration.locationLayer),
   Layer.provideMerge(Policy.locationLayer),
 )
+
+export const node = makeLocationNode({ service: Service, layer, deps: [EventV2.node, Policy.node, Integration.node] })
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/linux-sandbox.test.ts
- `src/tool/application-tools.ts` - update based on opencode packages/core/src/tool/application-tools.ts changes
- `src/tool/apply-patch.ts` - update based on opencode packages/core/src/tool/apply-patch.ts changes
- `src/tool/bash.ts` - update based on opencode packages/core/src/tool/bash.ts changes
- `src/tool/builtins.ts` - update based on opencode packages/core/src/tool/builtins.ts changes
- `src/tool/edit.ts` - update based on opencode packages/core/src/tool/edit.ts changes
- `src/tool/notebook-host.ts` - update based on kilocode packages/opencode/src/kilocode/tool/notebook-host.ts changes
- `src/tool/read-filesystem.ts` - update based on opencode packages/core/src/tool/read-filesystem.ts changes
- `src/tool/read.ts` - update based on opencode packages/core/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/core/src/tool/registry.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/tool.ts` - update based on opencode packages/core/src/tool/tool.ts changes
