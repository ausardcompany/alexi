# Upstream Changes Report
Generated: 2026-09-06 10:24:29

## Summary
- kilocode: 40 commits, 150 files changed
- opencode: 4 commits, 27 files changed

## kilocode Changes (ecccd1f54..1e4693558)

### Commits

- 1e4693558 - release: v7.5.15 (kilo-maintainer[bot], 2026-09-06)
- 9458f33d5 - Merge pull request #13823 from Kilo-Org/jetbrains/release/v7.1.6-rc.1 (Kirill Kalishev, 2026-09-05)
- 9df901d81 - docs(jetbrains): edit changelog for v7.1.6-rc.1 (Kirill Kalishev, 2026-09-05)
- 7ffc80df6 - release(jetbrains): v7.1.6-rc.1 (kilo-maintainer[bot], 2026-09-06)
- 81f2cc306 - Merge pull request #13816 from Kilo-Org/verbena-clove (Joshua Lambert, 2026-09-05)
- 4585cc83c - Merge pull request #13761 from Kilo-Org/mighty-meadow (Kirill Kalishev, 2026-09-05)
- 5aff8306e - Merge remote-tracking branch 'origin/main' into mighty-meadow (kirillk, 2026-09-05)
- e8f9d727a - Merge pull request #13765 from Kilo-Org/sturdy-yak (Kirill Kalishev, 2026-09-05)
- b234d4f7e - Merge branch 'main' into sturdy-yak (Kirill Kalishev, 2026-09-05)
- e2b1945e0 - Merge pull request #13712 from Kilo-Org/snappy-fjord (Kirill Kalishev, 2026-09-05)
- e30b839b5 - Merge pull request #13766 from Kilo-Org/humble-yak (Kirill Kalishev, 2026-09-05)
- da603b122 - fix(jetbrains): address fork session review findings (kirillk, 2026-09-05)
- dd67a2759 - fix(jetbrains): settle attention per session, not per snapshot (kirillk, 2026-09-05)
- 978cc3a76 - Merge pull request #13797 from Kilo-Org/humble-thunder (Kirill Kalishev, 2026-09-05)
- 2d0ea12c1 - Merge pull request #13800 from Kilo-Org/eager-yak (Kirill Kalishev, 2026-09-05)
- f65206c7e - chore: add Astra OAuth changeset (Josh Lambert, 2026-09-05)
- 6e67b8555 - chore(opencode): annotate Astra upstream fix (Josh Lambert, 2026-09-05)
- 5ed4433f0 - fix(opencode): compare Codex GPT versions by major and minor (#47385) (Aiden Cline, 2026-09-05)
- bbe720304 - fix(opencode): allow integer GPT versions in Codex model filter (#47384) (Aiden Cline, 2026-09-05)
- f608dd9f1 - fix(jetbrains): harden the worktree-index toggle against review findings (kirillk, 2026-09-04)
- b803cda29 - fix(jetbrains): keep the review conversation count through a refused lookup (kirillk, 2026-09-04)
- 1e76cdcf3 - feat(jetbrains): show a live-run indicator on worktree rows and run controls (kirillk, 2026-09-04)
- de5bdbe44 - feat(jetbrains): exclude Kilo worktrees from IntelliJ indexing (kirillk, 2026-09-04)
- b1d769f8b - fix(jetbrains): soften dialog-card fill so it blends with the backdrop (kirillk, 2026-09-04)
- 13ca51d80 - fix(jetbrains): fill session dialog cards with a raised surface (kirillk, 2026-09-04)
- 399a1a539 - feat(jetbrains): fork a session from the worktree editor (kirillk, 2026-09-03)
- 63d7aadb8 - fix(jetbrains): settle attention badges during auto-approve (kirillk, 2026-09-03)
- 9aa8edda6 - fix(jetbrains): tolerate os clock skew when matching app process start times (kirillk, 2026-09-03)
- 576a22b27 - Merge branch 'main' into mighty-meadow (Kirill Kalishev, 2026-09-03)
- 440ed4c93 - Merge remote-tracking branch 'origin/main' into snappy-fjord (kirillk, 2026-09-03)
- 040841417 - feat(jetbrains): mark worktrees whose pull request no longer merges (kirillk, 2026-09-03)
- a9e8a6a4c - fix(jetbrains): keep replace-path reaping off a sibling run's application (kirillk, 2026-09-03)
- 11034d676 - fix(jetbrains): reap a replaced worktree run's app without waiting on its handler (kirillk, 2026-09-03)
- 048b6db81 - fix(jetbrains): fade clipped list row text instead of ellipsizing (kirillk, 2026-09-03)
- fe0220a34 - fix(jetbrains): scope worktree app-process reaping to what it can attribute (kirillk, 2026-09-03)
- 0554e987e - feat(jetbrains): run project run configs delegated to Gradle in worktrees (kirillk, 2026-09-03)
- a323b84c9 - fix(jetbrains): ellipsize clipped list row titles (kirillk, 2026-09-03)
- 4dee03708 - feat(jetbrains): lead PR indicators with unresolved conversations (kirillk, 2026-09-03)
- 1afeede21 - feat(jetbrains): make every PR header element hoverable (kirillk, 2026-09-02)
- 4b604f843 - feat(jetbrains): show unresolved PR review conversations (kirillk, 2026-09-02)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt` (+1, -1)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/bound-glob-searches.md` (+0, -5)
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
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+1, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+46, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/ForkHandoff.kt` (+50, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendConnectionService.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+9, -4)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+21, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+9, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+23, -4)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+51, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/PrResolver.kt` (+80, -7)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/run/WorktreeRunAdapter.kt` (+2, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/run/WorktreeRunDelegate.kt` (+283, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/run/WorktreeRunManager.kt` (+350, -46)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/run/WorktreeRunReaper.kt` (+144, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorktreeExcludePolicy.kt` (+31, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorktreeIndexSettings.kt` (+28, -0)
- `packages/kilo-jetbrains/backend/src/main/resources/kilo.jetbrains.backend.xml` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendSessionManagerTest.kt` (+50, -8)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImplIndexWorktreesTest.kt` (+38, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImplTest.kt` (+40, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+88, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/PrResolverTest.kt` (+161, -13)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/WorkspacePathScopingTest.kt` (+29, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/run/WorktreeRunDelegateTest.kt` (+377, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/run/WorktreeRunManagerTest.kt` (+395, -7)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/run/WorktreeRunReaperTest.kt` (+209, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/PlainApplicationType.kt` (+118, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/StubbornJvm.kt` (+65, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloWorktreeExcludePolicyTest.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloNotifications.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ForkSessionAction.kt` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ForkWorktreeSessionAction.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+35, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeIcons.kt` (+46, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRowPopupBody.kt` (+72, -16)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunBinding.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunControl.kt` (+17, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunPopup.kt` (+13, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManager.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+51, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListController.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloAppService.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+76, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionActions.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionManager.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/PrHeaderView.kt` (+91, -49)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+33, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageToolbar.kt` (+6, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/DialogView.kt` (+15, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/AdvancedConfigurable.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/AdvancedSettingsUi.kt` (+33, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/AttentionDotIcon.kt` (+0, -27)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/ChangesPanel.kt` (+17, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/DiffStatBadge.kt` (+51, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/DotIcon.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/FadeText.kt` (+51, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/HoverArea.kt` (+204, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/PrBadges.kt` (+64, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/PrIcons.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListModel.kt` (+9, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListRenderer.kt` (+62, -13)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-comments.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-comments_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SessionContextMenuActionsTest.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerPanelTest.kt` (+275, -20)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeIconsTest.kt` (+82, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRowPopupBodyTest.kt` (+202, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunControlTest.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunPopupTest.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManagerTest.kt` (+93, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanelTest.kt` (+139, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListControllerTest.kt` (+61, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloSessionServiceTest.kt` (+56, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/PrHeaderViewTest.kt` (+156, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/DialogViewTest.kt` (+69, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/AdvancedConfigurableTest.kt` (+105, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpSettingsUiTest.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/SkillsSettingsUiTest.kt` (+3, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/WorkflowsSettingsUiTest.kt` (+3, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+17, -18)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUiTest.kt` (+3, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/ActiveListRows.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAppRpcApi.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/ChangesPanelTest.kt` (+64, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/DiffStatBadgeTest.kt` (+74, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/HoverAreaTest.kt` (+259, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/PrBadgesTest.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/PrIconsTest.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListBadgeCellTest.kt` (+56, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListFadeTest.kt` (+202, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloAppRpcApi.kt` (+9, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+6, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/WorkspacePath.kt` (+3, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+2, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/RunConfigDto.kt` (+11, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorktreeDto.kt` (+30, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+2, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+8, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/plugin/openai/codex.ts` (+7, -2)
- `packages/opencode/test/plugin/codex.test.ts` (+37, -0)
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
index 564dd16da..5696e9143 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.5.14",
+  "version": "7.5.15",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
index 2eaf44cf3..647b42784 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
@@ -871,7 +871,7 @@ internal class PermissionRulesView private constructor(
             val g2 = g.create() as Graphics2D
             try {
                 g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
-                val base = SessionUiStyle.Colors.sessionBackground()
+                val base = SessionUiStyle.View.Dialog.bgColor()
                 g2.color = when {
                     active -> UiStyle.Colors.blend(base, if (approve) UiStyle.Colors.addedForeground() else UiStyle.Colors.removedForeground(), 0.15f)
                     else -> UiStyle.Colors.actionHoverBackground()
```


## opencode Changes (e289456..337fd14)

### Commits

- 337fd14 - chore: generate (opencode-agent[bot], 2026-09-06)
- 1ddaeec - docs(console): add localized refund FAQs for Go and Zen (#47575) (Jack, 2026-09-06)
- 7c2199d - fix(opencode): add GitLab reasoning variants (#47306) (far-ouq, 2026-09-05)
- bbd72fb - fix(console): connect enterprise form to Chatwoot (#47488) (Stefan Avram, 2026-09-05)

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

#### Other Changes
- `bun.lock` (+3, -3)
- `infra/console.ts` (+2, -0)
- `packages/console/app/src/i18n/ar.ts` (+7, -0)
- `packages/console/app/src/i18n/br.ts` (+7, -0)
- `packages/console/app/src/i18n/da.ts` (+7, -0)
- `packages/console/app/src/i18n/de.ts` (+7, -0)
- `packages/console/app/src/i18n/en.ts` (+6, -0)
- `packages/console/app/src/i18n/es.ts` (+7, -0)
- `packages/console/app/src/i18n/fr.ts` (+7, -0)
- `packages/console/app/src/i18n/it.ts` (+7, -0)
- `packages/console/app/src/i18n/ja.ts` (+7, -0)
- `packages/console/app/src/i18n/ko.ts` (+7, -0)
- `packages/console/app/src/i18n/no.ts` (+7, -0)
- `packages/console/app/src/i18n/pl.ts` (+7, -0)
- `packages/console/app/src/i18n/ru.ts` (+7, -0)
- `packages/console/app/src/i18n/th.ts` (+7, -0)
- `packages/console/app/src/i18n/tr.ts` (+7, -0)
- `packages/console/app/src/i18n/uk.ts` (+6, -0)
- `packages/console/app/src/i18n/zh.ts` (+7, -0)
- `packages/console/app/src/i18n/zht.ts` (+6, -0)
- `packages/console/app/src/routes/api/enterprise.ts` (+1, -1)
- `packages/console/app/src/routes/go/index.tsx` (+9, -0)
- `packages/console/app/src/routes/zen/index.tsx` (+10, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+4, -1)
- `packages/opencode/test/provider/transform.test.ts` (+16, -2)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 276b0fe..5e6ccd4 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -108,7 +108,7 @@
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
-    "gitlab-ai-provider": "6.13.0",
+    "gitlab-ai-provider": "6.14.0",
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "gray-matter": "4.0.3",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
