# Upstream Changes Report
Generated: 2026-07-03 09:19:20

## Summary
- kilocode: 98 commits, 243 files changed
- opencode: 26 commits, 66 files changed

## kilocode Changes (2992e3e44..4c07a1db5)

### Commits

- 4c07a1db5 - Merge pull request #11899 from Kilo-Org/fix/jetbrains-publish-recovery (Kirill Kalishev, 2026-07-02)
- 38488b729 - fix(jetbrains): allow release publish recovery (kirillk, 2026-07-02)
- ef76d67f8 - Merge pull request #11897 from Kilo-Org/jetbrains/release/v7.0.1-rc.14 (Kirill Kalishev, 2026-07-02)
- 574da7c93 - docs(jetbrains): edit changelog for v7.0.1-rc.14 (Kirill Kalishev, 2026-07-02)
- 9424b51d2 - docs(jetbrains): edit changelog for v7.0.1-rc.14 (Kirill Kalishev, 2026-07-02)
- 1ab9e7a04 - release(jetbrains): v7.0.1-rc.14 (kilo-maintainer[bot], 2026-07-02)
- ad56c2235 - Merge pull request #11553 from Kilo-Org/beneficial-auroraceratops (Kirill Kalishev, 2026-07-02)
- de94694d9 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-07-02)
- 3d4a5ac34 - fix(vscode): stabilize visual regression snapshots (kirillk, 2026-07-02)
- e59589072 - fix(jetbrains): make workspace load cleanup deterministic (kirillk, 2026-07-02)
- d5f196585 - chore: remove local plan file (kirillk, 2026-07-02)
- 9ba4c1f13 - chore: add agent removal follow-up plan (kirillk, 2026-07-02)
- b82858173 - Merge remote-tracking branch 'origin/main' into beneficial-auroraceratops (kirillk, 2026-07-02)
- a5f484c76 - chore: remove local plan from branch (kirillk, 2026-07-02)
- 0e57f82f7 - fix(vscode): tidy agent removal refresh (kirillk, 2026-07-02)
- f6e0e87cf - Merge pull request #11890 from Kilo-Org/mark/readonly-bash-exec-flag-denies (Mark IJbema, 2026-07-02)
- a8b4b72da - fix(cli): scope session model-usage to family ids to avoid full part scan (#11893) (Marius, 2026-07-02)
- e1379b04d - fix(vscode): rely on CLI agent removal (kirillk, 2026-07-02)
- c8e66ae6e - fix(jetbrains): adapt model details badges (kirillk, 2026-07-02)
- 8cdbf8a53 - Revert "chore: update local agent and run configs" (kirillk, 2026-07-02)
- 2bc1b045e - Merge branch 'main' into beneficial-auroraceratops (kirillk, 2026-07-02)
- b0a50da0e - fix(cli): close read-only bash exec-flag escapes (Mark IJbema, 2026-07-02)
- 8668760a9 - Merge pull request #11870 from Kilo-Org/concrete-chip (Kirill Kalishev, 2026-07-02)
- 094fed0e2 - chore: update local agent and run configs (kirillk, 2026-07-02)
- 8ec9c80ae - test(jetbrains): share list mouse event helper (kirillk, 2026-07-02)
- 887f6f9e1 - Merge branch 'main' into beneficial-auroraceratops (kirillk, 2026-07-02)
- 0fa33f40d - Merge origin/main into concrete-chip (kirillk, 2026-07-02)
- bfb630d61 - Merge pull request #11871 from Kilo-Org/efficacious-fern (Kirill Kalishev, 2026-07-02)
- 1d714c649 - Merge pull request #11881 from Kilo-Org/feat/providers-tab-show-more (Christiaan Arnoldus, 2026-07-02)
- 83182c6c6 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-02)
- 394346247 - feat(vscode): add soft max-cost nudge (#11832) (Johnny Eric Amancio, 2026-07-02)
- 8cdd0aab1 - feat(cli): soft per-session max-cost nudge (#11833) (Johnny Eric Amancio, 2026-07-02)
- 327e974b1 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-07-02)
- 1c3c85fca - test(vscode): add expanded disabled providers story for visual coverage (chrarnoldus, 2026-07-02)
- 21e958bfc - fix(vscode): wrap disabled providers Collapsible in div for margin (chrarnoldus, 2026-07-02)
- 39646f0d3 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-02)
- 1ce95dc76 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-07-02)
- 9ff1062d9 - feat(vscode): make Show more providers prominent, collapse disabled providers (chrarnoldus, 2026-07-02)
- 4e50230d3 - Merge pull request #11880 from Kilo-Org/chore/bump-vite-7.3.5 (Jean du Plessis, 2026-07-02)
- b2f9eb93a - chore: bump vite to 7.3.5 (Jean du Plessis, 2026-07-02)
- 193e52cf8 - fix: repair agent behavior CI failures (kirillk, 2026-07-02)
- a5af63a6a - fix: address model picker review feedback (kirillk, 2026-07-02)
- 872d7c5d8 - fix(jetbrains): keep progress body during session open (kirillk, 2026-07-02)
- 03629b598 - fix(cli): use config overlay targets for agent removal (kirillk, 2026-07-01)
- d916e10ec - test(jetbrains): cover header popup disposal guard (kirillk, 2026-07-01)
- 679542759 - chore(jetbrains): add model picker planning notes (kirillk, 2026-07-01)
- e2ba25628 - fix(jetbrains): address agent behavior review (kirillk, 2026-07-01)
- 3ff5b0954 - fix(jetbrains): address model picker review feedback (kirillk, 2026-07-01)
- 77c6579be - fix(jetbrains): clean up header popup disposal guard (kirillk, 2026-07-01)
- 8cb93ea22 - Merge branch 'main' into beneficial-auroraceratops (Kirill Kalishev, 2026-07-01)
- fd3042c5f - fix(jetbrains): remediate settings apply lifecycle (kirillk, 2026-07-01)
- cfa4705cc - fix(jetbrains): guard prompt hover in headless tests (kirillk, 2026-07-01)
- 5d0426990 - fix(jetbrains): address session UI review comments (kirillk, 2026-07-01)
- 42995d27e - fix(jetbrains): address session UI review feedback (kirillk, 2026-07-01)
- 5dd4aaa0d - test(jetbrains): wait for workspace readiness (kirillk, 2026-07-01)
- beca5698b - Merge remote-tracking branch 'origin/main' into beneficial-auroraceratops (kirillk, 2026-07-01)
- 2f29ba2d2 - fix(jetbrains): update mcp add hint (kirillk, 2026-07-01)
- 3365d00e8 - Merge remote-tracking branch 'origin/main' into efficacious-fern (kirillk, 2026-07-01)
- 521a8ff31 - fix(jetbrains): simplify session popups (kirillk, 2026-07-01)
- 14d14fd94 - fix(jetbrains): persist mcp env edits (kirillk, 2026-07-01)
- ad746f22a - chore: add jetbrains model picker changeset (kirillk, 2026-07-01)
- 6b7d793f4 - feat(jetbrains): add model picker details (kirillk, 2026-07-01)
- 73bdb923c - fix(jetbrains): improve checklist styling (kirillk, 2026-07-01)
- 06231f97a - fix(jetbrains): clear session link hover on scroll (kirillk, 2026-07-01)
- 95b1d54b5 - fix(jetbrains): open session file links in workspace (kirillk, 2026-07-01)
- 384712255 - fix(jetbrains): stage agent settings changes (kirillk, 2026-07-01)
- f27661782 - fix(jetbrains): remove rules skills workflows settings (kirillk, 2026-06-30)
- 17aebf929 - fix(jetbrains): edit project MCP settings (kirillk, 2026-06-30)
- 9ca57af0a - feat(jetbrains): show full command on shell header hover (kirillk, 2026-06-30)
- 30d432be3 - fix(jetbrains): configure settings list row layout (kirillk, 2026-06-30)
- 112e7d7be - fix(jetbrains): clip tool headers to one line (kirillk, 2026-06-30)
- 07f1e27b0 - fix(jetbrains): align markdown inline styling (kirillk, 2026-06-30)
- b85276235 - fix(jetbrains): load MCP settings with resolved project dir (kirillk, 2026-06-30)
- dda98c589 - Merge remote-tracking branch 'origin/main' into beneficial-auroraceratops (kirillk, 2026-06-30)
- a07c7a239 - docs(jetbrains): document settings UI primitives (kirillk, 2026-06-29)
- fea54c3c6 - fix(jetbrains): show friendly agent delete failure (kirillk, 2026-06-29)
- bbba32b32 - fix(jetbrains): hide non-removable agent delete actions (kirillk, 2026-06-29)
- 1d3348a01 - feat(jetbrains): export custom agents (kirillk, 2026-06-29)
- 16821c20e - Merge remote-tracking branch 'origin/main' into beneficial-auroraceratops (kirillk, 2026-06-29)
- ac104dd56 - Merge remote-tracking branch 'origin/main' into beneficial-auroraceratops (kirillk, 2026-06-29)
- 3380f732d - fix(jetbrains): equal settings list row heights and unified Delete label (kirillk, 2026-06-27)
- e96bed0ee - docs: add JetBrains session error logging plan (kirillk, 2026-06-25)
- 35bc12e75 - Merge remote-tracking branch 'origin/main' into beneficial-auroraceratops (kirillk, 2026-06-25)
- b5fc91709 - fix(jetbrains): refresh settings lists after mutations (kirillk, 2026-06-23)
- b35da53fd - fix(jetbrains): remove redundant settings list headers (kirillk, 2026-06-22)
- 8fdfce118 - fix(jetbrains): refine agent settings visibility UI (kirillk, 2026-06-22)
- 18cafe303 - test(jetbrains): add agent settings coverage (kirillk, 2026-06-22)
- 90616599d - fix(cli): resolve workspace type imports (kirillk, 2026-06-22)
- 68623a06d - fix(jetbrains): resolve main merge compile errors (kirillk, 2026-06-22)
- ebbc06bff - Merge remote-tracking branch 'origin/main' into beneficial-auroraceratops (kirillk, 2026-06-22)
- 5e28a806a - fix(jetbrains): stabilize settings apply lifecycle (kirillk, 2026-06-22)
- 4295d11d2 - feat(jetbrains): add custom agent creation (kirillk, 2026-06-21)
- 30d35877b - fix(jetbrains): polish agent settings interactions (kirillk, 2026-06-20)
- 9ea21708a - feat(jetbrains): restrict agent editor behavior (kirillk, 2026-06-19)
- 9496a1c58 - feat(jetbrains): edit agent settings (kirillk, 2026-06-19)
- e0ff8d15a - fix(jetbrains): load agent behavior settings (kirillk, 2026-06-18)
- 547b40f18 - feat(jetbrains): polish settings lists and badges (kirillk, 2026-06-18)
- da064ee09 - feat(jetbrains): add agent behavior settings foundation (kirillk, 2026-06-17)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+119, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+46, -22)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+55, -10)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/fix-model-usage-full-scan.md` (+5, -0)
- `.changeset/fix-readonly-bash-exec-flag-escapes.md` (+5, -0)
- `.changeset/jetbrains-checklist-styling.md` (+5, -0)
- `.changeset/jetbrains-inline-code-foreground.md` (+5, -0)
- `.changeset/jetbrains-model-picker-details.md` (+5, -0)
- `.changeset/jetbrains-popups.md` (+5, -0)
- `.changeset/jetbrains-session-file-links.md` (+5, -0)
- `.changeset/jetbrains-session-link-hover.md` (+5, -0)
- `.changeset/jetbrains-tool-header-clipping.md` (+5, -0)
- `.changeset/providers-tab-show-more.md` (+5, -0)
- `.changeset/soft-maxcost-nudge-cli.md` (+5, -0)
- `.changeset/soft-maxcost-nudge.md` (+5, -0)
- `.changeset/staged-agent-settings.md` (+6, -0)
- `.github/workflows/publish-jetbrains.yml` (+29, -7)
- `.kilo/plans/1782926865817-jetbrains-model-picker-details-plan.md` (+84, -0)
- `bun.lock` (+19, -17)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-badge-checks-pending-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/providers-configure-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/providers-disabled-expanded-chromium-linux.png` (+3, -0)
- `packages/kilo-jetbrains/AGENTS.md` (+33, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+12, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloAppState.kt` (+2, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+49, -11)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloClaudeCompatSettings.kt` (+23, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+316, -19)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAgentBehaviorRpcApiImpl.kt` (+243, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAgentBehaviorRpcApiProvider.kt` (+15, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+1, -37)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapper.kt` (+28, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+26, -15)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+20, -6)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorkspaceState.kt` (+47, -0)
- `packages/kilo-jetbrains/backend/src/main/resources/kilo.jetbrains.backend.xml` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloAppStateTest.kt` (+2, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+85, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloBackendCliManagerEnvTest.kt` (+10, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+279, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/provider/KiloBackendProviderSettingsManagerTest.kt` (+27, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloAgentBehaviorRpcApiImplTest.kt` (+148, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapperTest.kt` (+45, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/WorkspacePathScopingTest.kt` (+34, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+69, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceTest.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/build.gradle.kts` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenSettingsAction.kt` (+12, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloAgentBehaviorService.kt` (+75, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionActivityKind.kt` (+3, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionFileLinks.kt` (+200, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+34, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryListRenderer.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+10, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/account/SessionAccountOverlay.kt` (+1, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/RecentsList.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/mode/ModePickerRenderer.kt` (+5, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelDetailsPanel.kt` (+392, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+130, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRenderer.kt` (+2, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopup.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupController.kt` (+155, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/AttachmentView.kt` (+9, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+3, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PlanExitView.kt` (+9, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PromptView.kt` (+10, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ReasoningView.kt` (+9, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+8, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+2, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+8, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/PartView.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/todo/TodoListPanel.kt` (+73, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/todo/TodoWriteView.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurable.kt` (+15, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurable.kt` (+45, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurableBase.kt` (+54, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentCreateDialog.kt` (+204, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentCreateState.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentEditDialog.kt` (+402, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentExport.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentImport.kt` (+103, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentSettingsState.kt` (+211, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentsConfigurable.kt` (+432, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/McpConfigurable.kt` (+219, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/McpEditDialog.kt` (+310, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/BaseContentPanel.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/BaseSettingsUi.kt` (+21, -45)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/DraftReadyConfigurable.kt` (+33, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/KiloReadyConfigurable.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsDraftPage.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsDraftState.kt` (+75, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListModel.kt` (+111, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListPanel.kt` (+331, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListRenderer.kt` (+149, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListView.kt` (+239, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsRow.kt` (+35, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsToggle.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelsConfigurable.kt` (+4, -24)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelsSettingsState.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelsSettingsUi.kt` (+23, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProviderListRenderer.kt` (+0, -176)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProviderListRows.kt` (+32, -20)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUi.kt` (+23, -89)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/FilledBadgeIcon.kt` (+3, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+59, -30)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdCommon.kt` (+101, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdView.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdViewFactory.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdViewHybrid.kt` (+89, -12)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/collapse.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/collapse_dark.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/expand.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/expand_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+25, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+166, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloAgentBehaviorServiceTest.kt` (+103, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloWorkspaceServiceTest.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionFileLinksTest.kt` (+102, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+27, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionUiUpdateTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelPickerTest.kt` (+162, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupControllerTest.kt` (+107, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/GlobToolViewTest.kt` (+10, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/PlanExitViewTest.kt` (+5, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionResultViewTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReadToolViewTest.kt` (+13, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/SearchToolViewTest.kt` (+10, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ShellToolViewTest.kt` (+142, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TextViewTest.kt` (+12, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TurnViewTest.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/todo/TodoWriteViewTest.kt` (+22, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurableTest.kt` (+9, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurableTest.kt` (+55, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentCreateDialogTest.kt` (+110, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentCreateStateTest.kt` (+57, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentEditDialogTest.kt` (+241, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentImportTest.kt` (+106, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentSettingsStateTest.kt` (+243, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentsSettingsUiTest.kt` (+533, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpEditDialogTest.kt` (+206, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpSettingsUiTest.kt` (+471, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/BaseSettingsUiTest.kt` (+21, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsDraftStateTest.kt` (+118, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+324, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/models/ModelsSettingsStateTest.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/models/ModelsSettingsUiTest.kt` (+22, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUiTest.kt` (+149, -53)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAgentBehaviorRpcApi.kt` (+133, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAppRpcApi.kt` (+40, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/MouseEvents.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridTest.kt` (+120, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewLoggingTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewTest.kt` (+96, -8)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/cli/KiloCliParser.kt` (+9, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloAgentBehaviorRpcApi.kt` (+50, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorkspaceRpcApi.kt` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/WorkspacePath.kt` (+6, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/AgentBehaviorDto.kt` (+46, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/CommandDto.kt` (+1, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+64, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ProviderDto.kt` (+54, -0)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/package.json` (+8, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+135, -17)
- `packages/kilo-vscode/src/kilo-provider/remove-config-item.ts` (+0, -4)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+235, -1)
- `packages/kilo-vscode/tests/unit/marketplace-panel-arch.test.ts` (+0, -1)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/remove-config-item.test.ts` (+3, -15)
- `packages/kilo-vscode/tests/visual-regression.spec.mts` (+28, -1)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+13, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/AutoApproveTab.tsx` (+48, -6)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProvidersTab.tsx` (+128, -81)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/context/cost-alert.ts` (+65, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+18, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/styles/question-dock.css` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/questions.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+8, -0)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+14, -9)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+35, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/context/nudge.tsx` (+123, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/cost-alert.ts` (+95, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+8, -3)
- `packages/opencode/src/kilocode/session/model-usage.ts` (+14, -17)
- `packages/opencode/test/kilocode/agent-remove.test.ts` (+41, -0)
- `packages/opencode/test/kilocode/ask-agent-permissions.test.ts` (+10, -0)
- `packages/opencode/test/kilocode/cli/cmd/tui/cost-alert.test.ts` (+41, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+31, -0)
- `packages/opencode/test/session/prompt.test.ts` (+5, -7)

### Key Diffs

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt
index d2c2a623e..2a2050918 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt
@@ -1,5 +1,6 @@
 package ai.kilocode.client.session.views.tool
 
+import ai.kilocode.client.session.SessionFileOpener
 import ai.kilocode.client.session.model.Content
 import ai.kilocode.client.session.model.Tool
 import ai.kilocode.client.session.model.ToolExecState
@@ -17,10 +18,10 @@ import javax.swing.ScrollPaneConstants
 /** Renders read calls with secondary, borderless chrome. */
 class ReadToolView(
     tool: Tool,
-    openFile: (String) -> Unit = {},
+    openFile: SessionFileOpener = { _, _ -> },
     private val selection: SessionSelection? = null,
     private val parts: ToolParts = toolParts(tool, openFile),
-) : SecondarySessionPartView(parts.header, parts.scroll(tool), expandable = false) {
+    ) : SecondarySessionPartView(parts.header, parts.scroll(tool), expandable = false) {
 
     companion object {
         fun canRender(tool: Tool): Boolean = tool.kind == ToolKind.READ
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
index 2593c941a..be75209af 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
@@ -3,6 +3,9 @@ package ai.kilocode.client.session.views.tool
 import ai.kilocode.client.plugin.KiloBundle
 import ai.kilocode.client.session.model.Content
 import ai.kilocode.client.session.model.Tool
+import ai.kilocode.client.telemetry.Telemetry
+import ai.kilocode.client.session.ui.popup.HeaderPopupBody
+import ai.kilocode.client.session.ui.popup.HeaderPopupRequest
 import ai.kilocode.client.session.ui.selection.SessionSelection
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionUiStyle
@@ -22,7 +25,10 @@ import com.intellij.ui.components.JBHtmlPane
 import com.intellij.ui.components.JBScrollPane
 import com.intellij.util.concurrency.annotations.RequiresEdt
 import com.intellij.util.ui.JBUI
+import java.awt.BorderLayout
+import java.awt.Container
 import java.awt.Dimension
+import javax.swing.JComponent
 import javax.swing.JPanel
 import javax.swing.ScrollPaneConstants
 
@@ -124,6 +130,9 @@ class ShellToolView(
     @RequiresEdt
     internal fun subtitleForeground() = parts.sub.foreground
 
+    @RequiresEdt
+    internal fun subtitleMarkup() = parts.sub.text ?: ""
+
     @RequiresEdt
     internal fun stateFont() = parts.state.font
 
@@ -137,6 +146,15 @@ class ShellToolView(
     internal fun horizontalPolicy() = holder.shell?.scrolls()?.firstOrNull()?.horizontalScrollBarPolicy
         ?: ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER
 
+    @RequiresEdt
+    override fun headerPopup(): HeaderPopupRequest? {
+        if (isExpanded()) return null
+        val cmd = command(item).takeIf { it.isNotBlank() } ?: return null
+        return HeaderPopupRequest(row, build = { buildPopupBody(cmd) }) {
+            Telemetry.send("Header Popup Shown", mapOf("surface" to "session", "tool" to "bash"))
+        }
+    }
+
     @RequiresEdt
     override fun applyStyle(style: SessionEditorStyle) {
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
index 5b0654b56..9bc89f3b1 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
@@ -3,6 +3,7 @@
 package ai.kilocode.client.session.views.tool
 
 import ai.kilocode.client.plugin.KiloBundle
+import ai.kilocode.client.session.SessionFileOpener
 import ai.kilocode.client.session.model.Tool
 import ai.kilocode.client.session.model.ToolExecState
 import ai.kilocode.client.session.ui.selection.SessionSelection
@@ -27,6 +28,7 @@ import com.intellij.openapi.util.Disposer
 import com.intellij.openapi.util.io.FileUtil
 import com.intellij.openapi.util.io.OSAgnosticPathUtil
 import com.intellij.ui.EditorTextField
+import com.intellij.ui.awt.RelativePoint
 import com.intellij.ui.components.JBLabel
 import com.intellij.ui.components.JBScrollPane
 import com.intellij.ui.components.JBTextArea
@@ -39,6 +41,7 @@ import java.awt.CardLayout
 import java.awt.Color
 import java.awt.Cursor
 import java.awt.Font
+import java.awt.Point
 import java.awt.event.MouseAdapter
 import java.awt.event.MouseEvent
 import javax.swing.Icon
@@ -60,7 +63,7 @@ class ToolParts(
     val state: JBLabel,
     val center: JPanel,
     val controls: JComponent,
-    private val open: ((String) -> Unit)? = null,
+    private val open: SessionFileOpener? = null,
     val extra: JBLabel? = null,
     val targets: List<JBLabel> = emptyList(),
     private val mode: ToolBodyMode = ToolBodyMode.EDITOR,
@@ -88,9 +91,9 @@ class ToolParts(
     fun bodyCreated() = body != null
 
     @RequiresEdt
-    fun openLink() {
+    fun openLink(anchor: RelativePoint? = null) {
         val value = href ?: return
-        open?.invoke(value)
+        open?.invoke(value, anchor)
     }
 
     @RequiresEdt
@@ -332,14 +335,14 @@ private const val LINK_CARD = "link"
```

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index 30a575061..56e3f17bd 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -9,6 +9,7 @@ import { Schema } from "effect"
 import path from "path"
 import { Global } from "@opencode-ai/core/global"
 import { Flag } from "@opencode-ai/core/flag/flag"
+import { applyEdits, modify, parse as parseJsonc } from "jsonc-parser"
 
 import PROMPT_DEBUG from "../../agent/prompt/debug.txt"
 import PROMPT_ORCHESTRATOR from "../../agent/prompt/orchestrator.txt"
@@ -109,24 +110,37 @@ export const readOnlyBash: Record<string, "allow" | "ask" | "deny"> = {
   "git branch -r *": "allow",
   "git remote -v *": "allow",
   "gh *": "ask",
+  // Everything below is a blocklist layered on the allowlist above: it catches ways
+  // an "allowed" read-only command can still write files, chain commands, or exec an
+  // arbitrary program. This is defense-in-depth, not a sandbox — the durable fix is
+  // OS-level sandboxing, not command-line string matching.
+  // `*` matches any run of characters (including spaces and empty), so each rule
+  // catches its operator anywhere. Broad forms subsume narrow ones: `*&*` covers
+  // `&&`, and `*>*` covers `>`, `>>`, `>|`, and `>(` in any spacing.
   "*\n*": "deny",
   "*<(*": "deny",
   "*|*": "deny",
   "*;*": "deny",
-  "*&&*": "deny",
   "*&*": "deny",
   "*$(*": "deny",
   "*`*": "deny",
   "*>*": "deny",
-  "* > *": "deny",
-  "*>>*": "deny",
-  "* >> *": "deny",
-  "*>|*": "deny",
-  "* >| *": "deny",
+  // Short -o is space-anchored (two forms) so it never matches filenames like
+  // `foo-o bar`; long flags use `*--flag*`, which is specific enough to bridge both
+  // "flag first" and "flag after args" positions in one rule.
   "sort -o *": "deny",
   "sort * -o *": "deny",
-  "sort --output*": "deny",
-  "sort * --output*": "deny",
+  "sort *--output*": "deny",
+  // Flags that make otherwise "read-only" commands exec an arbitrary program.
+  "sort *--compress-program*": "deny",
+  "sort *--files0-from*": "deny",
+  "rg *--pre *": "deny",
+  "rg *--pre=*": "deny",
```


## opencode Changes (f52424e..30936a9)

### Commits

- 30936a9 - chore: generate (opencode-agent[bot], 2026-07-03)
- a9144ec - feat(app): improvements to model search (#34954) (Aarav Sareen, 2026-07-03)
- 458ec7b - refactor(opencode): expose MCP tools in native shape from the service (#35103) (Aiden Cline, 2026-07-03)
- d46c02b - feat(desktop): papercut fixes (#34939) (usrnk1, 2026-07-03)
- caedf36 - chore: generate (opencode-agent[bot], 2026-07-03)
- 4c6e2a9 - feat(app): align subagent UI with v2 (#34931) (Aarav Sareen, 2026-07-03)
- bf58fae - feat(desktop): add recently closed projects to home (#34926) (usrnk1, 2026-07-03)
- eb34766 - chore: remove root node-gyp pin after Node 24 setup (#35092) (Aiden Cline, 2026-07-03)
- 7d48a22 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-03)
- 3f0fc22 - chore: generate (opencode-agent[bot], 2026-07-03)
- 2409c7a - feat(codemode): add confined execution package (#35079) (Aiden Cline, 2026-07-03)
- 379adee - revert: back out experimental codemode (#35077) (Aiden Cline, 2026-07-02)
- 2ef1a59 - fix(ci): setup Node 24 before bun install for node-gyp (#35076) (Luke Parker, 2026-07-03)
- 83c638e - chore: generate (opencode-agent[bot], 2026-07-03)
- cb93114 - feat: experimental codemode (#34677) (Aiden Cline, 2026-07-02)
- 04d236c - fix(app): keep v2 review pane mounted across session tab switches (#35074) (Luke Parker, 2026-07-03)
- 5455fed - zen: new inference (Frank, 2026-07-02)
- 6dba0cc - zen: new inference (Frank, 2026-07-02)
- c07ac0d - feat(app): navigate tabs on mousedown in new layout (#35042) (Luke Parker, 2026-07-03)
- 20b090e - zen: new inference (Frank, 2026-07-02)
- cb54824 - zen: new inference (Frank, 2026-07-02)
- 3adfb97 - feat(tui): add debug info dialog with copy to clipboard (#35004) (Dustin Deus, 2026-07-02)
- 5ecd19d - chore: generate (opencode-agent[bot], 2026-07-02)
- 299daa2 - feat(stats): redesign model hero (Adam, 2026-07-02)
- 7457139 - fix(stats): polish lab pages (Adam, 2026-07-02)
- 373cd08 - fix(copilot): honor advertised model endpoints (#34958) (Aiden Cline, 2026-07-02)

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
- `packages/core/src/plugin/provider/github-copilot.ts` (+19, -15)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+36, -0)

#### Other Changes
- `.github/actions/setup-bun/action.yml` (+7, -0)
- `bun.lock` (+35, -1)
- `nix/hashes.json` (+4, -4)
- `packages/app/e2e/regression/review-tab-switch.spec.ts` (+129, -0)
- `packages/app/e2e/regression/tab-navigate-mousedown.spec.ts` (+108, -0)
- `packages/app/src/components/dialog-select-model-search.test.ts` (+19, -0)
- `packages/app/src/components/dialog-select-model-search.ts` (+18, -0)
- `packages/app/src/components/dialog-select-model.tsx` (+5, -15)
- `packages/app/src/components/prompt-input.tsx` (+3, -1)
- `packages/app/src/components/settings-v2/settings-v2.css` (+1, -1)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+17, -0)
- `packages/app/src/components/titlebar-tab-popover.tsx` (+1, -1)
- `packages/app/src/context/global.tsx` (+11, -1)
- `packages/app/src/context/layout.tsx` (+11, -2)
- `packages/app/src/context/server.test.ts` (+83, -1)
- `packages/app/src/context/server.tsx` (+40, -5)
- `packages/app/src/i18n/en.ts` (+1, -0)
- `packages/app/src/pages/home.tsx` (+105, -6)
- `packages/app/src/pages/session.tsx` (+6, -3)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+2, -2)
- `packages/app/src/pages/session/use-composer-commands.tsx` (+16, -1)
- `packages/codemode/AGENTS.md` (+15, -0)
- `packages/codemode/README.md` (+338, -0)
- `packages/codemode/codemode.md` (+1218, -0)
- `packages/codemode/package.json` (+26, -0)
- `packages/codemode/src/codemode.ts` (+4126, -0)
- `packages/codemode/src/index.ts` (+21, -0)
- `packages/codemode/src/token.ts` (+10, -0)
- `packages/codemode/src/tool-error.ts` (+11, -0)
- `packages/codemode/src/tool-runtime.ts` (+829, -0)
- `packages/codemode/src/tool.ts` (+348, -0)
- `packages/codemode/src/values.ts` (+34, -0)
- `packages/codemode/test/codemode.test.ts` (+1110, -0)
- `packages/codemode/test/enumeration.test.ts` (+159, -0)
- `packages/codemode/test/parity.test.ts` (+425, -0)
- `packages/codemode/test/promise.test.ts` (+453, -0)
- `packages/codemode/test/signature.test.ts` (+341, -0)
- `packages/codemode/test/stdlib.test.ts` (+495, -0)
- `packages/codemode/tsconfig.json` (+7, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+40, -32)
- `packages/llm/src/providers/github-copilot.ts` (+6, -3)
- `packages/llm/test/exports.test.ts` (+14, -0)
- `packages/opencode/src/mcp/index.ts` (+12, -6)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+13, -1)
- `packages/opencode/src/provider/provider.ts` (+5, -1)
- `packages/opencode/src/session/tools.ts` (+3, -1)
- `packages/opencode/test/plugin/github-copilot-models.test.ts` (+38, -0)
- `packages/session-ui/src/components/basic-tool.css` (+52, -0)
- `packages/session-ui/src/components/message-part.tsx` (+74, -7)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+178, -112)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+14, -9)
- `packages/stats/app/src/routes/index.css` (+349, -17)
- `packages/tui/src/app.tsx` (+11, -0)
- `packages/tui/src/component/dialog-debug.tsx` (+90, -0)
- `packages/tui/src/component/error-component.tsx` (+1, -20)
- `packages/tui/src/config/keybind.ts` (+2, -0)
- `packages/tui/src/ui/dialog.tsx` (+3, -0)
- `packages/tui/src/util/system.ts` (+20, -0)
- `packages/ui/src/styles/theme.css` (+18, -0)
- `packages/ui/src/theme/v2/mapping.ts` (+26, -0)
- `packages/ui/src/v2/components/project-avatar-v2.css` (+7, -0)
- `packages/ui/src/v2/components/project-avatar-v2.stories.tsx` (+9, -1)
- `packages/ui/src/v2/components/project-avatar-v2.tsx` (+4, -1)
- `packages/ui/src/v2/styles/theme.css` (+40, -0)

### Key Diffs

#### packages/core/src/plugin/provider/github-copilot.ts
```diff
diff --git a/packages/core/src/plugin/provider/github-copilot.ts b/packages/core/src/plugin/provider/github-copilot.ts
index 682579d..6fd5b50 100644
--- a/packages/core/src/plugin/provider/github-copilot.ts
+++ b/packages/core/src/plugin/provider/github-copilot.ts
@@ -1,19 +1,11 @@
 import { Effect } from "effect"
 import { ModelV2 } from "../../model"
-import { define } from "../internal"
 import { ProviderV2 } from "../../provider"
+import type { PluginContext } from "@opencode-ai/plugin/v2/effect"
 
-function shouldUseResponses(modelID: string) {
-  // Copilot supports Responses for GPT-5 class models, except mini variants
-  // which still need the chat-completions endpoint.
-  const match = /^gpt-(\d+)/.exec(modelID)
-  if (!match) return false
-  return Number(match[1]) >= 5 && !modelID.startsWith("gpt-5-mini")
-}
-
-export const GithubCopilotPlugin = define({
+export const GithubCopilotPlugin = {
   id: "github-copilot",
-  effect: Effect.fn(function* (ctx) {
+  effect: Effect.fn(function* (ctx: PluginContext) {
     yield* ctx.catalog.transform(
       Effect.fn(function* (evt) {
         const item = evt.provider.get(ProviderV2.ID.githubCopilot)
@@ -39,10 +31,22 @@ export const GithubCopilotPlugin = define({
           evt.language = evt.sdk.languageModel(evt.model.api.id)
           return
         }
-        evt.language = shouldUseResponses(evt.model.api.id)
-          ? evt.sdk.responses(evt.model.api.id)
-          : evt.sdk.chat(evt.model.api.id)
+        if (evt.options.endpoint === "responses" && evt.sdk.responses) {
+          evt.language = evt.sdk.responses(evt.model.api.id)
+          return
+        }
+        if (evt.options.endpoint === "chat" && evt.sdk.chat) {
+          evt.language = evt.sdk.chat(evt.model.api.id)
+          return
+        }
+        const match = /^gpt-(\d+)/.exec(evt.model.api.id)
+        // Copilot supports Responses for GPT-5 class models, except mini variants
+        // which still need the chat-completions endpoint.
+        evt.language =
+          match && Number(match[1]) >= 5 && !evt.model.api.id.startsWith("gpt-5-mini") && evt.sdk.responses
+            ? evt.sdk.responses(evt.model.api.id)
+            : evt.sdk.chat(evt.model.api.id)
       }),
```

#### packages/core/test/plugin/provider-github-copilot.test.ts
```diff
diff --git a/packages/core/test/plugin/provider-github-copilot.test.ts b/packages/core/test/plugin/provider-github-copilot.test.ts
index beef89a..b88f04f 100644
--- a/packages/core/test/plugin/provider-github-copilot.test.ts
+++ b/packages/core/test/plugin/provider-github-copilot.test.ts
@@ -157,6 +157,42 @@ describe("GithubCopilotPlugin", () => {
     }),
   )
 
+  it.effect("uses advertised Copilot endpoint metadata before model ID fallbacks", () =>
+    Effect.gen(function* () {
+      const plugin = yield* PluginV2.Service
+      const aisdk = yield* AISDK.Service
+      const calls: string[] = []
+      yield* addPlugin()
+      yield* aisdk.runLanguage({
+        model: ModelV2.Info.make({
+          ...ModelV2.Info.empty(ProviderV2.ID.make("github-copilot"), ModelV2.ID.make("mai-code-1-flash-picker")),
+          api: {
+            id: ModelV2.ID.make("mai-code-1-flash-picker"),
+            type: "aisdk",
+            package: "test-provider",
+            settings: { endpoint: "responses" },
+          },
+        }),
+        sdk: fakeSelectorSdk(calls),
+        options: { endpoint: "responses" },
+      })
+      yield* aisdk.runLanguage({
+        model: ModelV2.Info.make({
+          ...ModelV2.Info.empty(ProviderV2.ID.make("github-copilot"), ModelV2.ID.make("gpt-5")),
+          api: {
+            id: ModelV2.ID.make("gpt-5"),
+            type: "aisdk",
+            package: "test-provider",
+            settings: { endpoint: "chat" },
+          },
+        }),
+        sdk: fakeSelectorSdk(calls),
+        options: { endpoint: "chat" },
+      })
+      expect(calls).toEqual(["responses:mai-code-1-flash-picker", "chat:gpt-5"])
+    }),
+  )
+
   it.effect("uses the API model ID when selecting responses or chat", () =>
     Effect.gen(function* () {
       const plugin = yield* PluginV2.Service
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/tool/ReadToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt changes
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
