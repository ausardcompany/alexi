# Upstream Changes Report
Generated: 2026-07-22 08:30:08

## Summary
- kilocode: 73 commits, 226 files changed
- opencode: 13 commits, 66 files changed

## kilocode Changes (a288dbc2e..3cab1bd2d)

### Commits

- 3cab1bd2d - Merge pull request #12440 from Kilo-Org/jetbrains/release/v7.0.9 (Kirill Kalishev, 2026-07-21)
- 724473e32 - docs(jetbrains): edit changelog for v7.0.9 (Kirill Kalishev, 2026-07-21)
- 05b5e9bcd - release(jetbrains): v7.0.9 (kilo-maintainer[bot], 2026-07-21)
- 5c7978c20 - Merge pull request #12437 from Kilo-Org/feat/jetbrains-rules-settings (Kirill Kalishev, 2026-07-21)
- 016fa42db - fix(cli): rewire stalled-stream watchdog test to post-v1.17.4 modules (#12438) (Igor Šćekić, 2026-07-21)
- 3d5ee24ef - fix(jetbrains): address rules settings PR review (kirillk, 2026-07-21)
- d016a09e4 - Merge branch 'main' into feat/jetbrains-rules-settings (Kirill Kalishev, 2026-07-21)
- c7c7d775c - fix(jetbrains): pin CLI to v7.4.13 to repair cloud session history import (kirillk, 2026-07-21)
- af33eded9 - feat(jetbrains): add Rules settings page with instruction files and Claude Code compatibility (kirillk, 2026-07-21)
- cd205d857 - fix(cli): prevent stalled agent streams (#12249) (Igor Šćekić, 2026-07-21)
- f206b1319 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-21)
- 9f7c8e58b - Merge pull request #12427 from Kilo-Org/cherry-pick/improve-xai-cache-hit-rate (Christiaan Arnoldus, 2026-07-21)
- 232d7f2c6 - fix(script): add worktree mode to annotation check (#11842) (Mohammad Javad Naderi, 2026-07-21)
- 8465c1d74 - Merge pull request #12430 from Kilo-Org/fix/routed-model-openrouter (Christiaan Arnoldus, 2026-07-21)
- 439b96354 - chore: add kilocode_change markers to test file (chrarnoldus, 2026-07-21)
- b20e4b393 - chore: add kilocode_change marker to satisfy annotation check (chrarnoldus, 2026-07-21)
- eec0c111d - fix(cli): allow openrouter models in routed model resolution (Christiaan Arnoldus, 2026-07-21)
- 156f176b9 - Merge pull request #12426 from Kilo-Org/fix/gateway-optimistic-tools-support (Christiaan Arnoldus, 2026-07-21)
- 80880dd45 - Merge pull request #12405 from Kilo-Org/investigate-pipeline-bottlenecks (Marius, 2026-07-21)
- 2d03f282e - Merge pull request #12429 from Kilo-Org/jetbrains/release/v7.0.8 (Kirill Kalishev, 2026-07-21)
- 51c487849 - Merge pull request #12414 from Kilo-Org/fix-sandbox-scandir-permission-error (Marius, 2026-07-21)
- b1439c46b - docs(jetbrains): edit changelog for v7.0.8 (Kirill Kalishev, 2026-07-21)
- f3905fbaa - Merge branch 'main' into fix/gateway-optimistic-tools-support (Christiaan Arnoldus, 2026-07-21)
- bcbb6917d - Merge pull request #12402 from Kilo-Org/fix/vscode-unfiltered-typecheck (Christiaan Arnoldus, 2026-07-21)
- 00b0c88e7 - release(jetbrains): v7.0.8 (kilo-maintainer[bot], 2026-07-21)
- 8951749dd - Merge pull request #12291 from Kilo-Org/gigantic-fighter (Kirill Kalishev, 2026-07-21)
- fa23cd22f - Merge pull request #12422 from Kilo-Org/johnnyeric/fix-memory-ui-feedback (Johnny Eric Amancio, 2026-07-21)
- 2dc1a520c - chore: add changeset for xai cache hit rate improvement (chrarnoldus, 2026-07-21)
- b692d03f3 - fix(gateway): also optimistically set tool_call for models with missing supported_parameters (chrarnoldus, 2026-07-21)
- c6b45fecd - fix: improve xai cache hit rate (#35970) (Aiden Cline, 2026-07-21)
- e944a5764 - fix(gateway): optimistically assume tools support when supported_parameters is missing (chrarnoldus, 2026-07-21)
- fa77ec581 - Merge pull request #11928 from jhapate0704/fix-diff-scroll (Marius, 2026-07-21)
- b0034dcb9 - Merge branch 'main' into fix-diff-scroll (Marius, 2026-07-21)
- f21793af4 - Merge branch 'main' into fix/vscode-unfiltered-typecheck (Christiaan Arnoldus, 2026-07-21)
- 4e1655da8 - chore(ci): trim darwin test profile (marius-kilocode, 2026-07-21)
- 8b9ec382d - fix(jetbrains): stabilize auto-approve test clicks (kirillk, 2026-07-21)
- e7dc13c1d - test(jetbrains): exercise auto-approve row clicks (kirillk, 2026-07-20)
- 341b9a8c8 - fix(jetbrains): harden auto-approve tests (kirillk, 2026-07-20)
- 28d015f8f - fix(memory): refine CLI and extension experience (Johnny Amancio, 2026-07-21)
- bdc534c51 - test(jetbrains): align permission merge fake (kirillk, 2026-07-20)
- ba18d8433 - fix(jetbrains): prevent duplicate auto-approve exceptions (kirillk, 2026-07-20)
- e8b8daee5 - fix(console): restore shared indexing parsing (kirillk, 2026-07-20)
- d95f447e1 - fix(jetbrains): refine settings interactions (kirillk, 2026-07-20)
- c277e852c - Merge remote-tracking branch 'origin/main' into gigantic-fighter (kirillk, 2026-07-20)
- 851967b3d - fix(jetbrains): keep settings row active during popups (kirillk, 2026-07-20)
- 45b58eade - fix(jetbrains): restore settings header right inset (kirillk, 2026-07-20)
- c53464975 - fix(jetbrains): flush settings scrollbar and align auto-approve filter (kirillk, 2026-07-20)
- 308c86f81 - refactor(jetbrains): page-level auto-approve filter and wildcard labels (kirillk, 2026-07-20)
- ef8354e92 - refactor(jetbrains): auto-approve level popup, stable list scroll and focus (kirillk, 2026-07-20)
- aae91e4c5 - feat(jetbrains): add auto-approve settings (kirillk, 2026-07-20)
- 2d7d5d563 - chore: refresh lockfile after main merge (kirillk, 2026-07-20)
- 25b58d909 - fix(console): resolve indexing helper imports (kirillk, 2026-07-20)
- 3fef2d888 - Merge remote-tracking branch 'origin/main' into gigantic-fighter (kirillk, 2026-07-20)
- 15e23acc7 - fix(jetbrains): dispose active prompt views (kirillk, 2026-07-20)
- 1a456f403 - fix(jetbrains): address permission review feedback (kirillk, 2026-07-20)
- badf70dce - fix(sandbox): tolerate unreadable directories during Linux writable-root scan (marius-kilocode, 2026-07-20)
- 3ab9e489e - fix(jetbrains): highlight bash commands consistently (kirillk, 2026-07-20)
- 39a09ffb2 - fix(ui): keep diff narrowing type-only (Christiaan Arnoldus, 2026-07-20)
- 00c5da38e - fix(ui): surface invalid diff inputs (Christiaan Arnoldus, 2026-07-20)
- 5cb038205 - Merge latest main into typecheck improvements (Christiaan Arnoldus, 2026-07-20)
- 6aca958e9 - fix(vscode): stop filtering typecheck errors (Christiaan Arnoldus, 2026-07-20)
- 00c7d737d - fix(vscode): stop filtering typecheck errors (Christiaan Arnoldus, 2026-07-20)
- 668fbf60d - fix(vscode): stop filtering typecheck errors (Christiaan Arnoldus, 2026-07-20)
- 9b0b0a372 - fix(vscode): stop filtering typecheck errors (Christiaan Arnoldus, 2026-07-20)
- 1a22a59f1 - fix(vscode): stop filtering typecheck errors (Christiaan Arnoldus, 2026-07-20)
- 067237564 - fix(jetbrains): refine permission dialog rules (kirillk, 2026-07-19)
- 4f2ec5611 - fix(jetbrains): label saved allows clearly (kirillk, 2026-07-19)
- 88613211f - fix(jetbrains): clarify permission save actions (kirillk, 2026-07-19)
- e9d0af577 - fix(jetbrains): align permission rules with vscode (kirillk, 2026-07-19)
- 6689b2dd7 - Merge remote-tracking branch 'origin/main' into gigantic-fighter (kirillk, 2026-07-17)
- 08866aa99 - feat(jetbrains): add permission rule candidates (kirillk, 2026-07-16)
- 725200270 - refactor(vscode): remove dead scroll-reset code from PermissionDiff (jhapate0704, 2026-07-03)
- c08302b47 - fix(vscode): reset scroll position on diff change (jhapate0704, 2026-07-03)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+15, -2)
- `packages/opencode/test/kilocode/tool/memory-recall.test.ts` (+0, -11)
- `packages/opencode/test/kilocode/tool/memory-save.test.ts` (+0, -5)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt` (+2, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt` (+640, -106)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt` (+435, -28)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/v1/config/provider.ts` (+4, -2)

#### Other Changes
- `.changeset/chunk-idle-timeout-default.md` (+5, -0)
- `.changeset/improve-xai-cache-hit-rate.md` (+5, -0)
- `.changeset/jetbrains-permission-dialog-ui.md` (+5, -0)
- `.changeset/jetbrains-permission-rules.md` (+5, -0)
- `.changeset/jetbrains-rules-settings.md` (+5, -0)
- `.changeset/refine-memory-controls.md` (+8, -0)
- `.changeset/reset-diff-scroll.md` (+5, -0)
- `.changeset/sandbox-unreadable-directory-scan.md` (+6, -0)
- `.kilo/skills/kilocode-merge-minimizer/SKILL.md` (+2, -2)
- `AGENTS.md` (+2, -2)
- `bun.lock` (+16, -6)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-memory-200-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-memory-chromium-linux.png` (+0, -3)
- `packages/kilo-gateway/src/api/models.ts` (+4, -3)
- `packages/kilo-jetbrains/CHANGELOG.md` (+29, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendConnectionService.kt` (+6, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+39, -8)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+7, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloBackendCliManagerEnvTest.kt` (+3, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+112, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloAppService.kt` (+8, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+15, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/Workspace.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloPluginSettings.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+26, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/Permission.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/SessionViewIcons.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/BaseQuestionView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurable.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurable.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/SkillsConfigurable.kt` (+31, -116)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveConfigurable.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveContent.kt` (+140, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveSettingsState.kt` (+199, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveSettingsUi.kt` (+99, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/GranularToolSection.kt` (+68, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/LevelSelect.kt` (+61, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/SettingsInlineList.kt` (+236, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/BaseSettingsUi.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/DraftReadyConfigurable.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/KiloReadyConfigurable.kt` (+6, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsContentEditor.kt` (+85, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsInlineListPanel.kt` (+180, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListModel.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListPanel.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListRenderer.kt` (+11, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListView.kt` (+76, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsPanel.kt` (+31, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsPathDialog.kt` (+44, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsPathInput.kt` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/ProfileUi.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUi.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/rules/RulesConfigurable.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/rules/RulesSettingsState.kt` (+40, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/rules/RulesSettingsUi.kt` (+367, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/DiffStatBadge.kt` (+2, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/editor/BashCommandHighlighter.kt` (+75, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdLanguage.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdShellHighlight.kt` (+26, -23)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdViewHybrid.kt` (+1, -13)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/check-small-active.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/check-small-active_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/check-small.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/check-small_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/close-small-active.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/close-small-active_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/close-small.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/close-small_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+16, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+70, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/KiloRecoveryActionsTest.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloWorkspaceServiceTest.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PromptLifecycleTest.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ShellToolViewTest.kt` (+6, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/BaseQuestionViewTest.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurableTest.kt` (+13, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/UserProfileConfigurableTest.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurableTest.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/SkillsSettingsUiTest.kt` (+12, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveSettingsStateTest.kt` (+238, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveSettingsUiTest.kt` (+477, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/autoapprove/SettingsInlineListTest.kt` (+345, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+99, -12)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsPathDialogTest.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsRowsTest.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUiTest.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/rules/RulesSettingsStateTest.kt` (+64, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/rules/RulesSettingsUiTest.kt` (+401, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAgentBehaviorRpcApi.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAppRpcApi.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdLanguageTest.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdShellHighlightTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridTest.kt` (+16, -10)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorkspaceRpcApi.kt` (+3, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+8, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+2, -0)
- `packages/kilo-memory/src/commands.ts` (+6, -20)
- `packages/kilo-memory/src/effect/index.ts` (+3, -1)
- `packages/kilo-memory/src/storage/audit.ts` (+6, -51)
- `packages/kilo-memory/src/storage/fs.ts` (+9, -0)
- `packages/kilo-memory/src/storage/state.ts` (+38, -2)
- `packages/kilo-memory/src/storage/store.ts` (+1, -0)
- `packages/kilo-memory/test/command-cases.json` (+3, -29)
- `packages/kilo-memory/test/commands.test.ts` (+19, -2)
- `packages/kilo-memory/test/core.test.ts` (+116, -60)
- `packages/kilo-memory/test/effect-capture.test.ts` (+8, -30)
- `packages/kilo-sandbox/src/bubblewrap.ts` (+30, -1)
- `packages/kilo-sandbox/test/backend.test.ts` (+66, -1)
- `packages/kilo-ui/src/components/basic-tool.css` (+8, -0)
- `packages/kilo-ui/src/components/diff.tsx` (+4, -2)
- `packages/kilo-ui/src/components/message-part.tsx` (+1, -1)
- `packages/kilo-vscode/knip.json` (+1, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/script/typecheck.ts` (+0, -38)
- `packages/kilo-vscode/src/KiloProvider.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider/memory.ts` (+84, -111)
- `packages/kilo-vscode/tests/setup/vscode-mock.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-memory-events.test.ts` (+0, -17)
- `packages/kilo-vscode/tests/unit/kilo-provider-memory.test.ts` (+92, -14)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+59, -0)
- `packages/kilo-vscode/tests/unit/memory-activity.test.ts` (+0, -89)
- `packages/kilo-vscode/tests/unit/memory-command.test.ts` (+2, -3)
- `packages/kilo-vscode/tests/unit/transcript-parts.test.ts` (+15, -1)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+70, -0)
- `packages/kilo-vscode/webview-ui/diff-virtual/DiffVirtualApp.tsx` (+15, -2)
- `packages/kilo-vscode/webview-ui/src/assets.d.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+0, -45)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+17, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+12, -190)
- `packages/kilo-vscode/webview-ui/src/components/settings/ContextTab.tsx` (+14, -19)
- `packages/kilo-vscode/webview-ui/src/context/memory.tsx` (+19, -141)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+45, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+0, -85)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+0, -8)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+0, -166)
- `packages/kilo-vscode/webview-ui/src/types/messages/memory.ts` (+2, -16)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+1, -2)
- `packages/kilo-vscode/webview-ui/src/utils/memory-activity.ts` (+0, -45)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/script/kilocode/test-profile.ts` (+17, -36)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-memory.tsx` (+41, -63)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/memory-prompt.tsx` (+6, -4)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/memory-status.tsx` (+2, -36)
- `packages/opencode/src/kilocode/cli/cmd/tui/memory-command.ts` (+6, -51)
- `packages/opencode/src/kilocode/cli/cmd/tui/memory-meta.ts` (+0, -6)
- `packages/opencode/src/kilocode/cli/cmd/tui/memory-state.ts` (+0, -4)
- `packages/opencode/src/kilocode/cli/cmd/tui/routes/session/memory.tsx` (+0, -79)
- `packages/opencode/src/kilocode/session/llm.ts` (+196, -14)
- `packages/opencode/src/kilocode/session/routed-model.ts` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+8, -1)
- `packages/opencode/src/session/llm.ts` (+28, -6)
- `packages/opencode/test/kilocode/cli/cmd/tui/memory-command.test.ts` (+40, -45)
- `packages/opencode/test/kilocode/cli/cmd/tui/memory-status.test.tsx` (+7, -132)
- `packages/opencode/test/kilocode/memory/memory-integration.test.ts` (+2, -12)
- `packages/opencode/test/kilocode/server/httpapi-memory.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/session-stream-watchdog.test.ts` (+554, -0)
- `packages/opencode/test/kilocode/session/llm.test.ts` (+68, -20)
- `packages/opencode/test/kilocode/session/session-stream-watchdog.test.ts` (+282, -0)
- `packages/opencode/test/kilocode/test-profile.test.ts` (+13, -2)
- `packages/opencode/test/provider/transform.test.ts` (+53, -1)
- `packages/script/tests/check-opencode-annotations.test.ts` (+134, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+5, -2)
- `packages/sdk/openapi.json` (+11, -2)
- `packages/tui/src/component/prompt/index.tsx` (+0, -1)
- `packages/tui/src/routes/session/index.tsx` (+1, -7)
- `patches/@ai-sdk%2Fxai@3.0.102.patch` (+174, -0)
- `patches/@ai-sdk%2Fxai@3.0.92.patch` (+0, -76)
- `script/check-opencode-annotations.ts` (+45, -9)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index d098834e4..d06e20794 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -101,7 +101,7 @@
     "@ai-sdk/provider-utils": "4.0.23",
     "@ai-sdk/togetherai": "2.0.41",
     "@ai-sdk/vercel": "2.0.39",
-    "@ai-sdk/xai": "3.0.92",
+    "@ai-sdk/xai": "3.0.102",
     "@aws-sdk/credential-providers": "3.1057.0",
     "@openrouter/ai-sdk-provider": "2.9.0",
     "ai-gateway-provider": "3.1.2",
```

#### packages/core/src/v1/config/provider.ts
```diff
diff --git a/packages/core/src/v1/config/provider.ts b/packages/core/src/v1/config/provider.ts
index 4b884fc0d..2a644a0b5 100644
--- a/packages/core/src/v1/config/provider.ts
+++ b/packages/core/src/v1/config/provider.ts
@@ -115,9 +115,11 @@ export const Info = Schema.Struct({
           description:
             "Timeout in milliseconds to wait for response headers. Provider integrations may set defaults. Set to false to disable timeout.",
         }),
-        chunkTimeout: Schema.optional(PositiveInt).annotate({
+        // kilocode_change: accept `false` so internal callers can disable the
+        // watchdog. PositiveInt already excludes 0, so a public zero stays invalid.
+        chunkTimeout: Schema.optional(Schema.Union([PositiveInt, Schema.Literal(false)])).annotate({
           description:
-            "Timeout in milliseconds between streamed SSE chunks for this provider. If no chunk arrives within this window, the request is aborted.",
+            "Timeout in milliseconds between streamed SSE chunks for this provider. If no chunk arrives within this window, the request is aborted. Set to false to disable the idle watchdog.",
         }),
       }),
       [Schema.Record(Schema.String, Schema.Any)],
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
index fd9c200b8..026228d3c 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
@@ -4,10 +4,9 @@ import ai.kilocode.client.session.model.PermissionFileDiff
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionEditorStyleTarget
 import ai.kilocode.client.ui.DiffStatBadge
-import ai.kilocode.client.ui.UiStyle
+import ai.kilocode.client.ui.layout.Stack
 import com.intellij.util.ui.JBUI
 import com.intellij.util.ui.components.BorderLayoutPanel
-import java.awt.FlowLayout
 
 /**
  * Renders a single [PermissionFileDiff] inside a permission card as a compact diff-stat badge.
@@ -35,9 +34,7 @@ class PermissionDiffView(
         isOpaque = false
         border = JBUI.Borders.empty()
 
-        val inner = object : javax.swing.JPanel(FlowLayout(FlowLayout.LEFT, 0, 0)) {
-            init { isOpaque = false }
-        }
+        val inner = Stack.horizontal()
         inner.add(badge)
         addToCenter(inner)
     }
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
index a3acdfe1c..d5323dd58 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
@@ -1,39 +1,62 @@
 package ai.kilocode.client.session.views.permission
 
 import ai.kilocode.client.plugin.KiloBundle
+import ai.kilocode.client.plugin.KiloPluginSettings
 import ai.kilocode.client.session.model.Permission
 import ai.kilocode.client.session.model.PermissionFileDiff
+import ai.kilocode.client.session.model.PermissionRuleCandidate
+import ai.kilocode.client.session.model.PermissionRuleDecision
 import ai.kilocode.client.session.model.PermissionRequestState
 import ai.kilocode.client.session.ui.SessionView
 import ai.kilocode.client.session.views.base.BaseQuestionView
 import ai.kilocode.client.session.ui.selection.SessionSelection
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionEditorStyleTarget
-import ai.kilocode.client.session.ui.style.SessionUiStyle
 import ai.kilocode.client.session.views.SessionViewIcons
 import ai.kilocode.client.ui.UiStyle
+import ai.kilocode.client.ui.iconButton
+import ai.kilocode.client.ui.editor.BashCommandHighlighter
 import ai.kilocode.client.ui.layout.HAlign
 import ai.kilocode.client.ui.layout.Stack
+import ai.kilocode.client.ui.layout.StackAxis
 import ai.kilocode.client.ui.layout.VAlign
 import ai.kilocode.client.ui.layout.align
+import ai.kilocode.client.ui.md.MdCodeBlockBorder
+import ai.kilocode.client.ui.md.MdCodeBlockFactory
+import ai.kilocode.client.ui.md.MdCodeBlockOptions
+import ai.kilocode.client.ui.md.MdCommon
+import ai.kilocode.client.ui.md.MdView
+import ai.kilocode.client.ui.md.MdViewFactory
+import ai.kilocode.rpc.dto.PermissionAlwaysRulesDto
 import ai.kilocode.rpc.dto.PermissionReplyDto
+import com.intellij.icons.AllIcons
 import com.intellij.openapi.Disposable
+import com.intellij.openapi.editor.EditorFactory
+import com.intellij.openapi.editor.ex.EditorEx
+import com.intellij.openapi.fileTypes.PlainTextFileType
+import com.intellij.openapi.project.ProjectManager
 import com.intellij.openapi.util.Disposer
-import com.intellij.ui.ColorUtil
-import com.intellij.ui.components.JBHtmlPane
-import com.intellij.ui.components.JBHtmlPaneConfiguration
-import com.intellij.ui.components.JBHtmlPaneStyleConfiguration
+import com.intellij.ui.EditorTextField
 import com.intellij.ui.components.JBLabel
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
index a08b54a8a..de4119773 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
@@ -342,7 +342,7 @@ private data class ShellContent(
     val body: String = listOf(command, output, error).filter { it.isNotBlank() }.joinToString("\n\n")
 
     val markdown: String = buildString {
-        section(KiloBundle.message("session.part.tool.shell.command"), command, "shell-command")
+        section(KiloBundle.message("session.part.tool.shell.command"), command, "bash")
         section(KiloBundle.message("session.part.tool.shell.output"), rawOutput, outputLang(rawOutput))
         section(KiloBundle.message("session.part.tool.shell.error"), rawError, "ansi-stderr")
     }
@@ -352,7 +352,7 @@ private fun outputLang(text: String): String = if (MdTerminal.hasAnsi(text)) "an
 
 private fun popupMd(text: String): String = buildString {
     val fence = fence(text)
-    append(fence).append("shell-command\n")
+    append(fence).append("bash\n")
     append(text)
     if (!text.endsWith('\n')) append('\n')
     append(fence)
```


*... and more files (showing first 5)*

## opencode Changes (849c259..0a601cf)

### Commits

- 0a601cf - fix(docs): correct Kimi K2.7 Code request limits (#38248) (Jack, 2026-07-22)
- c9db6e9 - fix(app): show running shell command (#38080) (opencode-agent[bot], 2026-07-22)
- 130038e - fix(app): defer unavailable notification state (#38186) (opencode-agent[bot], 2026-07-22)
- 4438f69 - zen: add security check (Frank, 2026-07-21)
- 76ced54 - chore: generate (opencode-agent[bot], 2026-07-21)
- c40e3e7 - zen: add security check (Frank, 2026-07-21)
- 0317531 - zen: add laguna-2-2.1 (Frank, 2026-07-21)
- 5f241f1 - chore: generate (opencode-agent[bot], 2026-07-21)
- b513faf - fix(app): support nested slash command autocomplete (#38097) (Daniel Polito, 2026-07-21)
- 21c4c93 - fix(ui): improve progress circle contrast (#38101) (Daniel Polito, 2026-07-21)
- abc4b83 - Zen: gemini 3.6 flash and 3.5 flash lite (Frank, 2026-07-21)
- cb562b2 - chore: generate (opencode-agent[bot], 2026-07-21)
- 2d2339d - feat(app): draggable project rows (#38055) (Aarav Sareen, 2026-07-21)

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
- `packages/console/core/migrations/20260721182121_wet_pestilence/migration.sql` (+3, -0)
- `packages/console/core/migrations/20260721182121_wet_pestilence/snapshot.json` (+3135, -0)
- `packages/console/core/src/schema/workspace.sql.ts` (+4, -1)

#### Other Changes
- `packages/app/e2e/regression/session-timeline-lifecycle-state.spec.ts` (+17, -0)
- `packages/app/src/pages/home.tsx` (+128, -25)
- `packages/app/src/pages/layout/project-avatar-state.ts` (+7, -5)
- `packages/console/app/src/i18n/ar.ts` (+1, -0)
- `packages/console/app/src/i18n/br.ts` (+1, -0)
- `packages/console/app/src/i18n/da.ts` (+1, -0)
- `packages/console/app/src/i18n/de.ts` (+1, -0)
- `packages/console/app/src/i18n/en.ts` (+1, -0)
- `packages/console/app/src/i18n/es.ts` (+1, -0)
- `packages/console/app/src/i18n/fr.ts` (+1, -0)
- `packages/console/app/src/i18n/it.ts` (+1, -0)
- `packages/console/app/src/i18n/ja.ts` (+1, -0)
- `packages/console/app/src/i18n/ko.ts` (+1, -0)
- `packages/console/app/src/i18n/no.ts` (+1, -0)
- `packages/console/app/src/i18n/pl.ts` (+1, -0)
- `packages/console/app/src/i18n/ru.ts` (+1, -0)
- `packages/console/app/src/i18n/th.ts` (+1, -0)
- `packages/console/app/src/i18n/tr.ts` (+1, -0)
- `packages/console/app/src/i18n/uk.ts` (+1, -0)
- `packages/console/app/src/i18n/zh.ts` (+1, -0)
- `packages/console/app/src/i18n/zht.ts` (+1, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+9, -0)
- `packages/session-ui/src/components/basic-tool.tsx` (+3, -2)
- `packages/session-ui/src/components/message-part.tsx` (+2, -1)
- `packages/session-ui/src/v2/components/prompt-input/machine.test.ts` (+13, -0)
- `packages/session-ui/src/v2/components/prompt-input/machine.ts` (+2, -2)
- `packages/ui/src/v2/components/progress-circle-v2.css` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/bs/go.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/da/go.mdx` (+1, -1)
- `packages/web/src/content/docs/da/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/de/go.mdx` (+1, -1)
- `packages/web/src/content/docs/de/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/es/go.mdx` (+1, -1)
- `packages/web/src/content/docs/es/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/fr/go.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/go.mdx` (+1, -1)
- `packages/web/src/content/docs/it/go.mdx` (+1, -1)
- `packages/web/src/content/docs/it/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/ja/go.mdx` (+1, -1)
- `packages/web/src/content/docs/ja/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/ko/go.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/nb/go.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/pl/go.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/pt-br/go.mdx` (+1, -1)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/ru/go.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/th/go.mdx` (+1, -1)
- `packages/web/src/content/docs/th/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/tr/go.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+64, -56)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+64, -56)

### Key Diffs

#### packages/console/core/migrations/20260721182121_wet_pestilence/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260721182121_wet_pestilence/migration.sql b/packages/console/core/migrations/20260721182121_wet_pestilence/migration.sql
new file mode 100644
index 0000000..caa5d08
--- /dev/null
+++ b/packages/console/core/migrations/20260721182121_wet_pestilence/migration.sql
@@ -0,0 +1,3 @@
+ALTER TABLE `workspace` ADD `is_blocked` boolean;--> statement-breakpoint
+ALTER TABLE `workspace` ADD `is_flagged_by_anthropic` boolean;--> statement-breakpoint
+ALTER TABLE `workspace` ADD `is_flagged_by_openai` boolean;
\ No newline at end of file
```

#### packages/console/core/migrations/20260721182121_wet_pestilence/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260721182121_wet_pestilence/snapshot.json b/packages/console/core/migrations/20260721182121_wet_pestilence/snapshot.json
new file mode 100644
index 0000000..cfe079d
--- /dev/null
+++ b/packages/console/core/migrations/20260721182121_wet_pestilence/snapshot.json
@@ -0,0 +1,3135 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "c143f6ef-07b8-401f-8281-462bf49b6501",
+  "prevIds": ["d78d7057-b247-4572-9150-2532149169db"],
+  "ddl": [
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "auth",
+      "entityType": "tables"
+    },
+    {
+      "name": "benchmark",
+      "entityType": "tables"
+    },
+    {
+      "name": "billing",
+      "entityType": "tables"
+    },
+    {
+      "name": "coupon",
+      "entityType": "tables"
+    },
+    {
+      "name": "lite",
+      "entityType": "tables"
+    },
+    {
+      "name": "payment",
+      "entityType": "tables"
+    },
+    {
+      "name": "subscription",
+      "entityType": "tables"
+    },
+    {
+      "name": "usage",
+      "entityType": "tables"
+    },
+    {
+      "name": "ip_rate_limit",
```

#### packages/console/core/src/schema/workspace.sql.ts
```diff
diff --git a/packages/console/core/src/schema/workspace.sql.ts b/packages/console/core/src/schema/workspace.sql.ts
index ab729d5..4a04755 100644
--- a/packages/console/core/src/schema/workspace.sql.ts
+++ b/packages/console/core/src/schema/workspace.sql.ts
@@ -1,4 +1,4 @@
-import { json, primaryKey, mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core"
+import { boolean, json, primaryKey, mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core"
 import { timestamps, ulid } from "../drizzle/types"
 
 export const WorkspaceTable = mysqlTable(
@@ -8,6 +8,9 @@ export const WorkspaceTable = mysqlTable(
     slug: varchar("slug", { length: 255 }),
     name: varchar("name", { length: 255 }).notNull(),
     region: json("region").$type<("us" | "eu" | "sg" | "cn")[]>(),
+    is_blocked: boolean(),
+    is_flagged_by_anthropic: boolean(),
+    is_flagged_by_openai: boolean(),
     ...timestamps,
   },
   (table) => [uniqueIndex("slug").on(table.slug)],
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/v1/config/provider.ts
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
- `src/tool/memory-recall.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/memory-recall.test.ts changes
- `src/tool/memory-save.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/memory-save.test.ts changes
