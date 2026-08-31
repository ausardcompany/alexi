# Upstream Changes Report
Generated: 2026-08-31 12:54:30

## Summary
- kilocode: 54 commits, 269 files changed
- opencode: 1 commits, 4 files changed

## kilocode Changes (5e02825c8..ab143253a)

### Commits

- ab143253a - Merge pull request #13566 from Kilo-Org/fix-worktree-conflict-transfer (Kirill Kalishev, 2026-08-31)
- 9bf267803 - test(jetbrains): pin disposal badge test to the reload it survives (kirillk, 2026-08-31)
- d8a35ff6f - feat(tui): add About dialog (#12466) (Aarav, 2026-08-31)
- d6384186c - feat(tui): add last-commit diff view option (#13257) (Aarav, 2026-08-31)
- 08757f708 - fix(vscode): reduce chat prompt bottom spacing (#13603) (Marius, 2026-08-31)
- 5651135fa - Merge pull request #13604 from Kilo-Org/fix-background-agent-spinner-reset (Marius, 2026-08-31)
- 9d569adfc - Merge pull request #13598 from Kilo-Org/fix-cli-startup-smoke-test (Marius, 2026-08-31)
- 8fb8f289c - Merge pull request #13602 from Kilo-Org/make-subagent-task-bar-minimizable (Marius, 2026-08-31)
- edb929d83 - fix(vscode): preserve background agent spinner animation (marius-kilocode, 2026-08-31)
- 2234b6733 - Merge pull request #13601 from Kilo-Org/set-cancelled-agent-icon-to-idle (Marius, 2026-08-31)
- 9aa11e11e - Merge pull request #13468 from Kilo-Org/fix-worktree-cleanup-on-windows (Marius, 2026-08-31)
- 45bc84164 - fix(cli): normalize terminal redraws in TUI smoke checks (marius-kilocode, 2026-08-31)
- b4763a4d6 - Merge pull request #13597 from Kilo-Org/fix-subagent-tab-progress-spinner (Marius, 2026-08-31)
- 3b6e055c4 - Merge pull request #13600 from Kilo-Org/promise-with-resolvers (Andrea Giammarchi, 2026-08-31)
- 0701c5fe4 - fix(vscode): make subagent task headers collapsible (marius-kilocode, 2026-08-31)
- 438dbe7c2 - fix(cli): keep cancelled agent sessions idle (marius-kilocode, 2026-08-31)
- 5b62d34c3 - refactor(agent-manager): use Promise.withResolvers for Run tasks (marius-kilocode, 2026-08-31)
- 3308c6e16 - test(cli): avoid trailing-space chunks in TUI smoke fixture (marius-kilocode, 2026-08-31)
- c09ec41b1 - docs: enforce Promise.withResolvers() more explicitly. (webreflection, 2026-08-31)
- 925afc933 - chore: merge latest main into Windows worktree fix (marius-kilocode, 2026-08-31)
- 222bc9e6b - test(cli): catch blank TUI in release smoke checks (marius-kilocode, 2026-08-31)
- 915b4a2dd - fix(agent-manager): show activity in subagent tabs (marius-kilocode, 2026-08-31)
- f4b7c4150 - Merge pull request #13557 from Kilo-Org/enable-configurable-subagent-model-selection (Marius, 2026-08-31)
- b4366b4f3 - chore(jetbrains): drop plan file from the PR (kirillk, 2026-08-30)
- 90ad80a8e - test(jetbrains): remove race in setup script refresh test (kirillk, 2026-08-30)
- 2ef13de42 - fix(jetbrains): keep HoverIcon.match height off the icon size (kirillk, 2026-08-30)
- 1edf5acd6 - fix(jetbrains): address review on worktree status and hover icon (kirillk, 2026-08-30)
- abe330b21 - Merge branch 'fix-jetbrains-mode-switch-session-cancel' into fix-worktree-conflict-transfer (kirillk, 2026-08-30)
- 3402f4502 - feat(jetbrains): sync gh state on frame focus and tab switch (kirillk, 2026-08-30)
- 024733efe - feat(jetbrains): add Integrations settings page with GitHub toggle (kirillk, 2026-08-30)
- 960173752 - fix(jetbrains): keep interruption badges across the disposal reload (kirillk, 2026-08-30)
- a68cb8a03 - fix(jetbrains): stop mode picker from cancelling running sessions (kirillk, 2026-08-30)
- b9d0c736e - fix(jetbrains): make HoverIcon.match height stable across LAF font metrics (kirillk, 2026-08-30)
- 7f63e5578 - Merge remote-tracking branch 'origin/shiny-pebble' into fix-worktree-conflict-transfer (kirillk, 2026-08-30)
- db6d5a5cb - feat(jetbrains): run and manage worktree setup scripts (kirillk, 2026-08-30)
- 4cb99653d - Merge remote-tracking branch 'origin/main' into shiny-pebble (kirillk, 2026-08-30)
- bbf6a278d - Merge pull request #13569 from Kilo-Org/swift-pebble (Kirill Kalishev, 2026-08-30)
- e0be1a7fa - fix(jetbrains): drop leading toolbar separator, keep the left inset (kirillk, 2026-08-28)
- 723190843 - fix(jetbrains): fence worktree toolbar and align icon-only action height (kirillk, 2026-08-28)
- 3521fdf58 - fix(jetbrains): separate worktree header actions and fix button sizing (kirillk, 2026-08-28)
- 0eab3a47a - fix(jetbrains): harden new Mermaid engines against malformed input (kirillk, 2026-08-28)
- cc73d6f7c - fix(jetbrains): drop text captions from full worktree changes panel (kirillk, 2026-08-28)
- 57b0d1085 - feat(jetbrains): render all Mermaid diagram types in chat (kirillk, 2026-08-28)
- fffb45141 - Merge remote-tracking branch 'origin/main' into shiny-pebble (kirillk, 2026-08-28)
- 4b53c4eb0 - refactor(jetbrains): consolidate change summaries into ChangesPanel (kirillk, 2026-08-28)
- 3f2766f28 - fix(jetbrains): preserve changes when moving to worktrees (kirillk, 2026-08-28)
- 94169371f - refactor(jetbrains): decouple PR badges from ActiveList (kirillk, 2026-08-28)
- e6de1ebfa - feat(jetbrains): show uncommitted changes separately from the PR diff on worktree rows (kirillk, 2026-08-28)
- 7929565ca - test(cli): refresh task model selection schema snapshot (marius-kilocode, 2026-08-28)
- 6624c1a2b - feat: allow experimental task model selection (marius-kilocode, 2026-08-28)
- 6be24c21b - chore: merge main and preserve Windows worktree cleanup (marius-kilocode, 2026-08-27)
- dad0f3fed - chore(ci): reuse existing Windows job for worktree regression (marius-kilocode, 2026-08-27)
- 298c978f5 - chore(ci): annotate Windows worktree cleanup job (marius-kilocode, 2026-08-26)
- 32e4b0a39 - fix(agent-manager): release worktree locks on Windows (marius-kilocode, 2026-08-26)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager-models.ts` (+39, -28)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+9, -132)
- `packages/opencode/src/kilocode/tool/model-selection.ts` (+117, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+7, -2)
- `packages/opencode/src/kilocode/tool/task.ts` (+55, -3)
- `packages/opencode/src/tool/task.ts` (+55, -32)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+12, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/kilocode/pty/smoke.ts` (+91, -0)
- `packages/core/src/v1/config/config.ts` (+3, -0)
- `packages/core/test/kilocode/pty-smoke.test.ts` (+53, -0)

#### Other Changes
- `.changeset/fix-subagent-tab-activity.md` (+5, -0)
- `.changeset/fix-windows-worktree-cleanup.md` (+5, -0)
- `.changeset/idle-stopped-sessions.md` (+6, -0)
- `.changeset/jetbrains-gh-sync-on-focus.md` (+5, -0)
- `.changeset/jetbrains-github-integration-toggle.md` (+5, -0)
- `.changeset/jetbrains-mermaid-all-diagrams.md` (+5, -0)
- `.changeset/jetbrains-mode-switch-cancels-sessions.md` (+9, -0)
- `.changeset/jetbrains-worktree-setup-script.md` (+5, -0)
- `.changeset/jetbrains-worktree-uncommitted-badge.md` (+5, -0)
- `.changeset/last-commit-diff-viewer.md` (+5, -0)
- `.changeset/quiet-worktrees-refuse-conflicts.md` (+5, -0)
- `.changeset/smooth-background-agent-spinner.md` (+5, -0)
- `.changeset/subagent-task-header.md` (+5, -0)
- `.changeset/task-model-selection.md` (+7, -0)
- `.changeset/tidy-prompt-bottom.md` (+5, -0)
- `.changeset/tui-about-dialog.md` (+5, -0)
- `.github/workflows/test.yml` (+6, -1)
- `AGENTS.md` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-agent-manager-completed-chromium-linux.png` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-idle-chromium-linux.png` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-messages-chromium-linux.png` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-pending-question-empty-input-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-layout-correction-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-many-prompts-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-wide-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/welcome-with-switcher-and-notification-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-apply-patch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-bash-many-rules-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-edit-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-heredoc-chromium-linux.png` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-write-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/question-above-chatbox-chromium-linux.png` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+5, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendActivityManager.kt` (+35, -5)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+16, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendChatManager.kt` (+16, -20)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+0, -26)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/diff/GitComparison.kt` (+249, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+0, -4)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+56, -180)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+72, -102)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/SetupScriptTemplate.kt` (+99, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/WorktreeTransfer.kt` (+98, -53)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendActivityManagerTest.kt` (+58, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+85, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendChatManagerTest.kt` (+24, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+0, -30)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/BranchDiffTest.kt` (+51, -25)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/BranchLocalDiffTest.kt` (+397, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+802, -49)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/SetupScriptResolutionTest.kt` (+156, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/TestLog.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+9, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenConfigActions.kt` (+36, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenWorktreeLocalDiffAction.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RunWorktreeSetupScriptAction.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+84, -33)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhBanner.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinator.kt` (+81, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GithubIntegrationListener.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/KiloWorktreeService.kt` (+10, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialog.kt` (+5, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreePrHeaderView.kt` (+21, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+17, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSetupScript.kt` (+59, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatsView.kt` (+0, -196)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusBinding.kt` (+5, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusService.kt` (+76, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+0, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+57, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/DiffFileStatus.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/KiloDiffEditorContent.kt` (+9, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/KiloDiffEditorKind.kt` (+64, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloPluginSettings.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+48, -42)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+112, -15)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/BranchChangesBadge.kt` (+0, -145)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/BranchDock.kt` (+42, -40)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/PrHeaderView.kt` (+68, -50)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurable.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/integrations/IntegrationsConfigurable.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/integrations/IntegrationsSettingsUi.kt` (+48, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/ChangesPanel.kt` (+331, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/HoverIcon.kt` (+51, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/ToolbarButton.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/Art.kt` (+53, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/Palette.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ScenePainter.kt` (+104, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/Type.kt` (+32, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Arch.kt` (+258, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Axis.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/BlockDg.kt` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/C4Dg.kt` (+216, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/ClassDg.kt` (+246, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/ErDg.kt` (+165, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Gantt.kt` (+171, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/GitDg.kt` (+131, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Journey.kt` (+111, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Kanban.kt` (+90, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Layered.kt` (+146, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Lex.kt` (+60, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Mermaid.kt` (+27, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Mindmap.kt` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Packet.kt` (+89, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Pie.kt` (+103, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Quadrant.kt` (+108, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Radar.kt` (+179, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/ReqDg.kt` (+148, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Sankey.kt` (+153, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Scopes.kt` (+66, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/SeqLayout.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Sheet.kt` (+135, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/StateDg.kt` (+223, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Timeline.kt` (+87, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Treemap.kt` (+110, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/XyChart.kt` (+145, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramTheme.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListActions.kt` (+13, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListModel.kt` (+22, -16)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListRenderer.kt` (+92, -33)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+12, -16)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+22, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+29, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+22, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/KiloRecoveryActionsTest.kt` (+115, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerPanelTest.kt` (+268, -10)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhBannerTest.kt` (+40, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinatorTest.kt` (+138, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialogTest.kt` (+19, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreePrHeaderViewTest.kt` (+84, -13)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanelTest.kt` (+174, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSetupScriptTest.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusServiceTest.kt` (+197, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloWorkspaceServiceTest.kt` (+71, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/diff/KiloDiffEditorContentTest.kt` (+101, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/diff/KiloInlineDiffStoreTest.kt` (+276, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+274, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ConfigSelectionTest.kt` (+33, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PromptLifecycleTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionCancellationTest.kt` (+188, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/TurnLifecycleTest.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/BranchDockTest.kt` (+58, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/PrHeaderViewTest.kt` (+61, -11)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurableTest.kt` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+377, -36)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/integrations/IntegrationsConfigurableTest.kt` (+131, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+0, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+40, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorktreeRpcApi.kt` (+30, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/TestIdeActivation.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/ChangesPanelTest.kt` (+340, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/HoverIconTest.kt` (+97, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/CancelTest.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ConformanceTest.kt` (+33, -14)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/DiagramAsserts.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ErrorTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/InvariantTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ScenePainterTest.kt` (+35, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/SerializeTest.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/TypeTest.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/mermaid/EnginesTest.kt` (+412, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewDiagramTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/architecture-basic.mmd` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/block-basic.mmd` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/c4-basic.mmd` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/class-basic.mmd` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/er-basic.mmd` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/gantt-basic.mmd` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/git-basic.mmd` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/journey-basic.mmd` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/kanban-basic.mmd` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/mindmap-basic.mmd` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/packet-basic.mmd` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/pie-basic.mmd` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/quadrant-basic.mmd` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/radar-basic.mmd` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/requirement-basic.mmd` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/sankey-basic.mmd` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/state-basic.mmd` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/timeline-basic.mmd` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/treemap-basic.mmd` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/xychart-basic.mmd` (+6, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/log/ChatLogSummary.kt` (+7, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+0, -4)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorkspaceRpcApi.kt` (+9, -6)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorktreeRpcApi.kt` (+15, -2)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+19, -9)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/SetupScriptTargetDto.kt` (+15, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorktreeDto.kt` (+22, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+2, -6)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/SessionTerminalManager.ts` (+12, -0)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+9, -4)
- `packages/kilo-vscode/src/agent-manager/provider-lifecycle.ts` (+10, -6)
- `packages/kilo-vscode/src/agent-manager/pty-cleanup.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/run/task.ts` (+18, -1)
- `packages/kilo-vscode/src/kilo-provider/chat-settings.ts` (+11, -0)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+56, -0)
- `packages/kilo-vscode/tests/chat-auto-scroll.spec.ts` (+24, -9)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+64, -5)
- `packages/kilo-vscode/tests/prompt-spacing.spec.ts` (+14, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+6, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-provider-lifecycle.test.ts` (+64, -1)
- `packages/kilo-vscode/tests/unit/chat-settings-message.test.ts` (+69, -5)
- `packages/kilo-vscode/tests/unit/pty-cleanup.test.ts` (+54, -1)
- `packages/kilo-vscode/tests/unit/run-script-manager.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/session-provider-activity.test.ts` (+6, -1)
- `packages/kilo-vscode/tests/unit/session-terminal-manager.test.ts` (+30, -2)
- `packages/kilo-vscode/tests/unit/task-model-selection.test.ts` (+36, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+72, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/ClosableTab.tsx` (+12, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/SubagentPanel.tsx` (+23, -10)
- `packages/kilo-vscode/webview-ui/src/components/chat/BackgroundAgents.tsx` (+56, -52)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+8, -15)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+3, -0)
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
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/opencode/src/kilocode/cli/cmd/pty-smoke.ts` (+2, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-about.tsx` (+180, -0)
- `packages/opencode/src/kilocode/git-refs.ts` (+92, -0)
- `packages/opencode/src/kilocode/kilo-commands.tsx` (+13, -0)
- `packages/opencode/src/kilocode/pii.ts` (+1, -0)
- `packages/opencode/src/project/vcs.ts` (+64, -1)
- `packages/opencode/src/session/prompt.ts` (+8, -1)
- `packages/opencode/test/kilocode/agent-manager-models-tool.test.ts` (+17, -6)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+60, -10)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+5, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+12, -0)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+198, -18)
- `packages/opencode/test/project/vcs.test.ts` (+67, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+2, -1)
- `packages/sdk/openapi.json` (+4, -1)
- `packages/tui/src/feature-plugins/system/diff-viewer.tsx` (+10, -2)

### Key Diffs

#### packages/core/src/kilocode/pty/smoke.ts
```diff
diff --git a/packages/core/src/kilocode/pty/smoke.ts b/packages/core/src/kilocode/pty/smoke.ts
index fa5a4e01b..f97c39d62 100644
--- a/packages/core/src/kilocode/pty/smoke.ts
+++ b/packages/core/src/kilocode/pty/smoke.ts
@@ -1,8 +1,99 @@
 import { Shell } from "../../shell"
 import { KiloPtyTermination } from "./termination"
 import { spawn } from "#pty"
+import { mkdtemp, rm } from "node:fs/promises"
+import os from "node:os"
+import path from "node:path"
+import { stripVTControlCharacters } from "node:util"
 
 const TIMEOUT = 15_000
+const OUTPUT_LIMIT = 20_000
+const DIAGNOSTIC =
+  /(?:TUI worker error\b|(?:^|[\r\n])\s*(?:panic|fatal(?: error)?|unhandled exception|uncaught exception)\b)/i
+
+export async function render(file: string, args: string[] = ["--pure"], timeout = 60_000) {
+  const dir = await mkdtemp(path.join(os.tmpdir(), "kilo-pty-render-"))
+  const env: Record<string, string> = {}
+  for (const key of ["PATH", "SystemRoot", "SYSTEMROOT", "ComSpec", "LANG", "LC_ALL", "LC_CTYPE", "LANGUAGE"]) {
+    const value = process.env[key]
+    if (value !== undefined) env[key] = value
+  }
+  Object.assign(env, {
+    TERM: "xterm-256color",
+    KILO_TERMINAL: "1",
+    KILO_TEST_HOME: dir,
+    KILO_NO_DAEMON: "1",
+    KILO_DISABLE_AUTOUPDATE: "1",
+    KILO_DISABLE_MODELS_FETCH: "1",
+    KILO_DISABLE_PROJECT_CONFIG: "1",
+    KILO_DISABLE_DEFAULT_PLUGINS: "1",
+    KILO_PURE: "1",
+    KILO_CONFIG_CONTENT: JSON.stringify({ enabled_providers: [], experimental: { openTelemetry: false } }),
+    KILO_AUTH_CONTENT: "{}",
+    HOME: dir,
+    USERPROFILE: dir,
+    APPDATA: path.join(dir, "AppData", "Roaming"),
+    LOCALAPPDATA: path.join(dir, "AppData", "Local"),
+    XDG_DATA_HOME: path.join(dir, ".local", "share"),
+    XDG_CACHE_HOME: path.join(dir, ".cache"),
+    XDG_CONFIG_HOME: path.join(dir, ".config"),
+    XDG_STATE_HOME: path.join(dir, ".local", "state"),
+    TMPDIR: dir,
+    TMP: dir,
+    TEMP: dir,
+  })
+
```

#### packages/core/src/v1/config/config.ts
```diff
diff --git a/packages/core/src/v1/config/config.ts b/packages/core/src/v1/config/config.ts
index 5dd4d7612..ab51e3e2a 100644
--- a/packages/core/src/v1/config/config.ts
+++ b/packages/core/src/v1/config/config.ts
@@ -304,6 +304,9 @@ export const Info = Schema.Struct({
       native_notebook_tools: Schema.optional(Schema.Boolean).annotate({
         description: "Enable native tools for reading, editing, and executing VS Code notebooks",
       }),
+      task_model_selection: Schema.optional(Schema.Boolean).annotate({
+        description: "Allow task subagents to select a model, provider, and reasoning effort",
+      }),
       speech_to_text_model: Schema.optional(Schema.String).annotate({
         description: "Speech-to-text transcription model ID to use for voice input",
       }),
```

#### packages/core/test/kilocode/pty-smoke.test.ts
```diff
diff --git a/packages/core/test/kilocode/pty-smoke.test.ts b/packages/core/test/kilocode/pty-smoke.test.ts
new file mode 100644
index 000000000..d3b50987e
--- /dev/null
+++ b/packages/core/test/kilocode/pty-smoke.test.ts
@@ -0,0 +1,53 @@
+import { describe, expect, test } from "bun:test"
+import { render } from "../../src/kilocode/pty/smoke"
+
+const run = (source: string, timeout = 3_000) => render(process.execPath, ["-e", source], timeout)
+
+describe("rendered PTY smoke", () => {
+  test("accepts chunked terminal redraws and a responsive command palette", async () => {
+    const source = [
+      "if (process.stdin.isTTY && process.stdin.setRawMode) process.stdin.setRawMode(true)",
+      'process.stdout.write("\\x1b[2J\\x1b[HAsk any" + "\\r\\n".repeat(39) + "\\x1b[1;8H")',
+      'setTimeout(() => process.stdout.write("thing..."), 20)',
+      'process.stdin.on("data", (data) => {',
+      '  if (!data.toString().includes("\\x10")) return',
+      '  process.stdout.write("\\x1b[2J\\x1b[HCom" + "\\r\\n".repeat(39) + "\\x1b[1;4H")',
+      '  setTimeout(() => process.stdout.write("mands"), 20)',
+      "})",
+      "setInterval(() => {}, 1000)",
+    ].join("\n")
+
+    await run(source)
+  })
+
+  test("times out when output has no visible prompt", async () => {
+    const source = 'process.stdout.write("\\x1b[2J\\x1b[H\\x1b[?25l\\r\\n"); setInterval(() => {}, 1000)'
+
+    await expect(run(source)).rejects.toThrow(/timed out during prompt/)
+  })
+
+  test("rejects a zero exit before the prompt", async () => {
+    const source = 'process.stdout.write("started"); setTimeout(() => process.exit(0), 20)'
+
+    await expect(run(source)).rejects.toThrow(/exited during prompt \(code 0,/)
+  })
+
+  test("rejects a nonzero exit before the prompt", async () => {
+    const source = 'process.stdout.write("started"); setTimeout(() => process.exit(7), 20)'
+
+    await expect(run(source)).rejects.toThrow(/exited during prompt \(code 7,/)
+  })
+
+  test("times out when the prompt ignores the palette key", async () => {
+    const source = 'process.stdout.write("\\x1b[2J\\x1b[HAsk anything..."); setInterval(() => {}, 1000)'
+
+    await expect(run(source)).rejects.toThrow(/timed out during palette/)
```

#### packages/opencode/src/kilocode/tool/agent-manager-models.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager-models.ts b/packages/opencode/src/kilocode/tool/agent-manager-models.ts
index d70d697db..210092d7c 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager-models.ts
+++ b/packages/opencode/src/kilocode/tool/agent-manager-models.ts
@@ -4,6 +4,7 @@ import { Tool } from "@/tool/tool"
 import { Effect, Schema } from "effect"
 import { matchesQuery } from "./model-search"
 import DESCRIPTION from "./agent-manager-models.txt"
+import { Config } from "@/config/config"
 
 const Params = Schema.Struct({
   query: Schema.optional(Schema.String).annotate({
@@ -61,39 +62,49 @@ function view(entry: Entry) {
 export const AgentManagerModelsTool = Tool.define<
   typeof Params,
   { count: number; total: number },
-  Provider.Service,
+  Provider.Service | Config.Service,
   "agent_manager_models"
 >(
   "agent_manager_models",
   Effect.gen(function* () {
     const provider = yield* Provider.Service
-    return {
-      description: DESCRIPTION,
-      parameters: Params,
-      execute: (params) =>
-        Effect.gen(function* () {
-          const providers = yield* provider.list()
-          const all = entries(providers)
-          const query = params.query?.trim()
-          const matches = query ? all.filter((entry) => matchesQuery([entry.name, ...entry.ids], query)) : all
-          const offset = params.offset ?? 0
-          const limit = Math.min(params.limit ?? MAX_LIMIT, MAX_LIMIT)
-          const models = matches.slice(offset, offset + limit).map(view)
-          const nextOffset = offset + models.length < matches.length ? offset + models.length : undefined
-          return {
-            title: query
-              ? `${matches.length} model${matches.length === 1 ? "" : "s"} matching "${params.query?.trim()}"`
-              : `${matches.length} available models`,
-            output: JSON.stringify({
-              models,
-              offset,
-              total: matches.length,
-              nextOffset,
-              hint: "Pass a model name (or one of its providers/IDs) as the agent_manager task `model`. Add the task `provider` to force one of the listed providers; otherwise Agent Manager prefers the provider used by the current turn.",
+    const config = yield* Config.Service
+    return () =>
+      Effect.gen(function* () {
+        const cfg = yield* config.get()
```

#### packages/opencode/src/kilocode/tool/agent-manager.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.ts b/packages/opencode/src/kilocode/tool/agent-manager.ts
index 099900d73..a74c1ca20 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.ts
+++ b/packages/opencode/src/kilocode/tool/agent-manager.ts
@@ -1,4 +1,3 @@
-// kilocode_change - new file
 import { Bus } from "@/bus"
 import { InstanceState } from "@/effect/instance-state"
 import { AgentManagerEvent, type AgentManagerTask } from "@/kilocode/agent-manager/event"
@@ -11,7 +10,7 @@ import { SessionID } from "@/session/schema"
 import * as ToolJsonSchema from "@/tool/json-schema"
 import { Tool } from "@/tool/tool"
 import { Effect, Schema } from "effect"
-import { matchesQuery } from "./model-search"
+import { selectModel } from "./model-selection"
 import DESCRIPTION from "./agent-manager.txt"
 
 const Task = Schema.Struct({
@@ -172,7 +171,6 @@ const WireParams = Schema.Struct({
 
 type Input = Schema.Schema.Type<typeof Task>
 type Selected = { task?: AgentManagerTask; error?: string }
-type Candidate = { providerID: string; model: Provider.Info["models"][string] }
 type Source = { model: NonNullable<AgentManagerTask["model"]>; variant?: string }
 
 function abort(signal: AbortSignal) {
@@ -189,59 +187,9 @@ function run(effect: Effect.Effect<Result, HostError>, signal: AbortSignal) {
   return effect.pipe(Effect.raceFirst(abort(signal)), Effect.orDie)
 }
 
-function candidates(providers: Record<string, Provider.Info>): Candidate[] {
-  return Object.values(providers).flatMap((provider) =>
-    Object.values(provider.models).map((model) => ({ providerID: provider.id, model })),
-  )
-}
-
-// Resolve a model query to the candidates for a single logical model (possibly
-// offered by several providers). Exact id/name win first so a precise request is
-// never drowned out; otherwise fall back to lenient fuzzy matching so the agent
-// does not need the exact model name.
-function lookup(all: Candidate[], value: string): { pool: Candidate[]; names: string[] } {
-  const query = value.toLowerCase()
-  const exactId = all.filter((item) => `${item.providerID}/${item.model.id}`.toLowerCase() === query)
-  const exactName = exactId.length ? exactId : all.filter((item) => item.model.name.toLowerCase() === query)
-  const pool = exactName.length
-    ? exactName
-    : all.filter((item) => matchesQuery([item.model.name, `${item.providerID}/${item.model.id}`], value))
-  const names = [...new Set(pool.map((item) => item.model.name))]
-  return { pool, names }
-}
```


*... and more files (showing first 5)*

## opencode Changes (10765ff..9f69463)

### Commits

- 9f69463 - fix(app): backport session rename and tab menu fixes to v1 (#46116) (opencode-agent[bot], 2026-08-31)

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
- `packages/app/e2e/regression/session-rename.spec.ts` (+141, -0)
- `packages/app/e2e/regression/subagent-child-navigation.spec.ts` (+1, -1)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+51, -20)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+3, -1)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/kilocode/pty/smoke.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/core/` - review core changes from packages/core/test/kilocode/pty-smoke.test.ts
- `src/tool/agent-manager-models.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager-models.ts changes
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/model-selection.ts` - update based on kilocode packages/opencode/src/kilocode/tool/model-selection.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on kilocode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
