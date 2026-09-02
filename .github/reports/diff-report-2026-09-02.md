# Upstream Changes Report
Generated: 2026-09-02 10:47:17

## Summary
- kilocode: 58 commits, 177 files changed
- opencode: 21 commits, 73 files changed

## kilocode Changes (b6a2979e5..dfbf8df62)

### Commits

- dfbf8df62 - fix(opencode): announce locally started sessions to the mobile live list (#13681) (Igor Šćekić, 2026-09-02)
- f65277f08 - Merge pull request #13680 from Kilo-Org/jetbrains/release/v7.1.5 (Kirill Kalishev, 2026-09-01)
- c16b187a7 - docs(jetbrains): edit changelog for v7.1.5 (Kirill Kalishev, 2026-09-01)
- b6e44a6ae - release(jetbrains): v7.1.5 (kilo-maintainer[bot], 2026-09-01)
- 3ba64cef9 - Merge pull request #13678 from Kilo-Org/electric-falcon (Kirill Kalishev, 2026-09-01)
- fe6ad3c57 - docs(jetbrains): record the platform precedent for dumb-aware run actions (kirillk, 2026-09-01)
- d64bec02d - fix(jetbrains): keep actions available while the IDE indexes (kirillk, 2026-09-01)
- 1f1835354 - Merge pull request #13677 from Kilo-Org/jetbrains/release/v7.1.4 (Kirill Kalishev, 2026-09-01)
- 97dc2574f - release(jetbrains): v7.1.4 (kilo-maintainer[bot], 2026-09-01)
- 3fc9cb41f - fix(cli): separate environment details from user prompt text (#13190) (matt wilkie, 2026-09-01)
- a79fea7d5 - Merge pull request #13676 from Kilo-Org/plucky-grove (Kirill Kalishev, 2026-09-01)
- 617cc7cdb - fix(jetbrains): open the worktree row popup only for pull requests (kirillk, 2026-09-01)
- 3dff75d4a - Merge pull request #13667 from Kilo-Org/indecisive-pilot (Marius, 2026-09-01)
- 95c731e9d - fix(cli): remember bash permission migration (#12642) (Whitebeard, 2026-09-01)
- afbbcd250 - Merge pull request #13665 from Kilo-Org/add-open-all-agents-button (Marius, 2026-09-01)
- b4621b751 - Merge pull request #13635 from Kilo-Org/swift-quartz (Kirill Kalishev, 2026-09-01)
- d8149d597 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-01)
- 91ad15bbf - test(jetbrains): isolate worktree session UI scopes (marius-kilocode, 2026-09-01)
- c2030d3fc - Merge pull request #13623 from Kilo-Org/fix/headless-session-drain (Marius, 2026-09-01)
- a20d0c32f - fix(cli): resolve main conflicts in headless drain (marius-kilocode, 2026-09-01)
- 72600b6d5 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-01)
- 7af9ee525 - Merge pull request #13666 from Kilo-Org/optimize-tab-agent-forking-performance (Marius, 2026-09-01)
- a3f8ce57f - fix(vscode): translate open-all background agents tooltip (marius-kilocode, 2026-09-01)
- bb87cc850 - feat(vscode): open all background agents from the toolbar (marius-kilocode, 2026-09-01)
- 1d8689f6d - fix(vscode): align answered question font with tool output (marius-kilocode, 2026-09-01)
- a946e190d - Merge pull request #13636 from Kilo-Org/rapid-nebula (Kirill Kalishev, 2026-09-01)
- 40cfef71f - Merge pull request #13663 from Kilo-Org/improve-background-agent-status-bar (Marius, 2026-09-01)
- c09f89d84 - Merge pull request #13664 from Kilo-Org/dedupe-c-connected-providers (Marius, 2026-09-01)
- 0a9ce2f0e - fix(cli): close remaining headless drain races (marius-kilocode, 2026-09-01)
- f1330aceb - fix(cli): surface real tool name when tool call repair fails (#13446) (matt wilkie, 2026-09-01)
- 2e76572ec - fix(agent-manager): speed up long-session forks (marius-kilocode, 2026-09-01)
- 84a23000e - refactor(kilo-console): share available provider selection (marius-kilocode, 2026-09-01)
- a3b39a005 - Merge pull request #13662 from Kilo-Org/dedupe-a-seventh-host-group (Marius, 2026-09-01)
- 57fe9f66b - fix(vscode): preserve background status accessibility (marius-kilocode, 2026-09-01)
- e5a0d7fcc - Merge pull request #13661 from Kilo-Org/dedupe-c-model-choices (Marius, 2026-09-01)
- c9fb6b0b1 - fix(vscode): prioritize active background agent previews (marius-kilocode, 2026-09-01)
- e65395752 - Merge pull request #13659 from Kilo-Org/dedupe-b-ui-fifth (Marius, 2026-09-01)
- 3d001ffb4 - refactor(vscode): reuse script error formatting (marius-kilocode, 2026-09-01)
- 17bb54d43 - fix(vscode): keep finished background agents compact (marius-kilocode, 2026-09-01)
- fe7f3ac06 - refactor(kilo-console): share model picker choices (marius-kilocode, 2026-09-01)
- 5f617c1df - test(vscode): include shared menu styles in architecture checks (marius-kilocode, 2026-09-01)
- 4cf781457 - Merge pull request #13645 from Kilo-Org/sync-cli-spinner-state (Marius, 2026-09-01)
- 521feb8d4 - Merge pull request #13660 from Kilo-Org/dedupe-a-sixth-host-group (Marius, 2026-09-01)
- 2eaff4030 - Merge pull request #13658 from Kilo-Org/dedupe-c-config-toggle (Marius, 2026-09-01)
- de4ebfc53 - refactor(vscode): reuse metadata leaf validators (marius-kilocode, 2026-09-01)
- f9360df27 - refactor(vscode): share context menu styles (marius-kilocode, 2026-09-01)
- 7c43c31ab - refactor(kilo-console): share CLI settings toggle (marius-kilocode, 2026-09-01)
- 337ee2258 - test(agent-manager): consolidate terminal activity coverage (marius-kilocode, 2026-09-01)
- 4e0d3d161 - refactor(agent-manager): share terminal focus callbacks (marius-kilocode, 2026-09-01)
- cd366ceff - feat(agent-manager): show CLI terminal activity in worktree indicators (marius-kilocode, 2026-09-01)
- ac54cca97 - fix(cli): scope and simplify headless session draining (marius-kilocode, 2026-09-01)
- 7621dde58 - Merge branch 'main' into fix/headless-session-drain (Joshua Lambert, 2026-08-31)
- 29b277c14 - fix(jetbrains): show a changes badge for uncommitted worktree work (kirillk, 2026-08-31)
- f8427765b - test(jetbrains): install UIResource fonts when simulating an IDE zoom (kirillk, 2026-08-31)
- 037ae10cc - fix(jetbrains): rescale Agent Manager list rows on IDE zoom (kirillk, 2026-08-31)
- 383d9e961 - fix(cli): snapshot drain waiters before resuming them (Josh Lambert, 2026-08-31)
- a3f4b4674 - fix(cli): harden drain lifecycle and update CI fixtures (Josh Lambert, 2026-08-31)
- 7c845aa0e - fix(cli): drain background work before headless exit (Josh Lambert, 2026-08-31)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/registry.ts` (+2, -0)
- `packages/opencode/src/tool/task.ts` (+88, -47)
- `packages/opencode/test/tool/task.test.ts` (+2, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/event.ts` (+8, -0)
- `packages/core/src/kilocode/event-batch.ts` (+132, -0)
- `packages/core/test/kilocode/event-batch.test.ts` (+84, -0)
- `packages/core/test/session-runner-tool-events.test.ts` (+1, -0)

#### Other Changes
- `.changeset/compact-finished-background-agents.md` (+5, -0)
- `.changeset/env-details-separator.md` (+5, -0)
- `.changeset/fast-session-forks.md` (+6, -0)
- `.changeset/headless-session-drain.md` (+6, -0)
- `.changeset/invalid-tool-repair-surfaces-real-name.md` (+5, -0)
- `.changeset/jetbrains-actions-during-indexing.md` (+5, -0)
- `.changeset/jetbrains-agent-manager-zoom-scaling.md` (+5, -0)
- `.changeset/jetbrains-uncommitted-changes-badge.md` (+5, -0)
- `.changeset/jetbrains-worktree-popup-pr-only.md` (+5, -0)
- `.changeset/open-background-agents.md` (+5, -0)
- `.changeset/question-output-font.md` (+5, -0)
- `.changeset/quiet-bash-permissions.md` (+5, -0)
- `.changeset/terminal-cli-activity.md` (+6, -0)
- `bun.lock` (+9, -9)
- `packages/kilo-console/src/routes/config/CliNotificationsRoute.tsx` (+1, -26)
- `packages/kilo-console/src/routes/config/CliUiRoute.tsx` (+1, -26)
- `packages/kilo-console/src/routes/config/ConfigPage.tsx` (+25, -0)
- `packages/kilo-console/src/routes/config/state/agents.ts` (+3, -32)
- `packages/kilo-console/src/routes/config/state/models.ts` (+30, -27)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+2, -2)
- `packages/kilo-jetbrains/CHANGELOG.md` (+54, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/CopyWorktreePrRefAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/DeleteSessionAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/DeleteWorktreeAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/DeleteWorktreeSessionAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/KiloSettingsAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenSessionAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenWorktreeDiffAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenWorktreeLocalDiffAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenWorktreePrAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RenameSessionAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RenameWorktreeAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RenameWorktreeSessionAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RunWorktreeSetupScriptAction.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+34, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRowPopupBody.kt` (+6, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunPopup.kt` (+14, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/KiloDiffEditorContent.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/ChangesPanel.kt` (+62, -15)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/DiffStatBadge.kt` (+21, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/FilledBadgeIcon.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+27, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/layout/Stack.kt` (+20, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveList.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListActions.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListModel.kt` (+16, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListRenderer.kt` (+76, -24)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+51, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/DeclaredActionsDumbAwareTest.kt` (+65, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SessionContextMenuActionsTest.kt` (+4, -29)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerPanelTest.kt` (+223, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRowPopupBodyTest.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManagerTest.kt` (+9, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/PluginDescriptor.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/ChangesPanelTest.kt` (+33, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/FilledBadgeIconTest.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/UiStyleTest.kt` (+35, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/layout/StackTest.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListScaleTest.kt` (+206, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-ui/src/components/message-part.css` (+2, -1)
- `packages/kilo-vscode/src/agent-manager/ScriptTerminalManager.ts` (+1, -6)
- `packages/kilo-vscode/src/agent-manager/run/manager.ts` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/terminal-manager.ts` (+1, -1)
- `packages/kilo-vscode/src/services/cli-backend/sdk-sse-adapter.ts` (+1, -0)
- `packages/kilo-vscode/src/shared/browser-feedback.ts` (+8, -17)
- `packages/kilo-vscode/src/shared/review-comments.ts` (+3, -3)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+123, -9)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+3, -2)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-activity.test.ts` (+77, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-routing.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/font-size-arch.test.ts` (+9, -0)
- `packages/kilo-vscode/tests/unit/project-session-busy.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/sdk-sse-adapter.test.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+0, -29)
- `packages/kilo-vscode/webview-ui/agent-manager/project/session-busy.ts` (+8, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SideTerminalPanel.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SortableTerminalTab.tsx` (+39, -26)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/activity.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+13, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/state.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/BackgroundAgents.tsx` (+76, -31)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/session-tabs.css` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+24, -0)
- `packages/opencode/src/cli/cmd/run.ts` (+60, -62)
- `packages/opencode/src/effect/app-runtime.ts` (+9, -1)
- `packages/opencode/src/effect/instance-registry.ts` (+4, -1)
- `packages/opencode/src/effect/runner.ts` (+55, -34)
- `packages/opencode/src/event-v2-bridge.ts` (+3, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+82, -3)
- `packages/opencode/src/kilocode/cli/cmd/run.ts` (+3, -2)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+13, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/terminal-activity.ts` (+85, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/terminal-title.ts` (+3, -3)
- `packages/opencode/src/kilocode/cli/run-auto.ts` (+1, -1)
- `packages/opencode/src/kilocode/cli/run-drain.ts` (+134, -0)
- `packages/opencode/src/kilocode/config/config.ts` (+49, -11)
- `packages/opencode/src/kilocode/editor-context.ts` (+4, -1)
- `packages/opencode/src/kilocode/effect/instance-registry.ts` (+36, -0)
- `packages/opencode/src/kilocode/effect/runner.ts` (+39, -2)
- `packages/opencode/src/kilocode/event-v2-bridge.ts` (+24, -0)
- `packages/opencode/src/kilocode/event-wire.ts` (+2, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+18, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+15, -0)
- `packages/opencode/src/kilocode/session/drain.ts` (+157, -0)
- `packages/opencode/src/kilocode/session/fork.ts` (+28, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+50, -38)
- `packages/opencode/src/provider/transform.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/global.ts` (+7, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/server/shared/workspace-routing.ts` (+1, -0)
- `packages/opencode/src/session/llm.ts` (+5, -8)
- `packages/opencode/src/session/prompt.ts` (+13, -1)
- `packages/opencode/src/session/reminders.ts` (+3, -3)
- `packages/opencode/src/session/run-state.ts` (+26, -5)
- `packages/opencode/src/session/session.ts` (+9, -3)
- `packages/opencode/test/event-manifest.test.ts` (+4, -1)
- `packages/opencode/test/kilocode/cli-run-auto-helper.test.ts` (+8, -1)
- `packages/opencode/test/kilocode/config/config.test.ts` (+135, -0)
- `packages/opencode/test/kilocode/editor-context-injection.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/headless-session-drain.test.ts` (+487, -0)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+20, -0)
- `packages/opencode/test/kilocode/reminders-separator.test.ts` (+92, -0)
- `packages/opencode/test/kilocode/run-auto.test.ts` (+124, -9)
- `packages/opencode/test/kilocode/run-drain.test.ts` (+217, -0)
- `packages/opencode/test/kilocode/run-network.test.ts` (+53, -42)
- `packages/opencode/test/kilocode/runner-start-order.test.ts` (+129, -2)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+18, -0)
- `packages/opencode/test/kilocode/server/httpapi-global-sse.test.ts` (+23, -3)
- `packages/opencode/test/kilocode/session-drain.test.ts` (+230, -0)
- `packages/opencode/test/kilocode/sessions/kilo-sessions-local-announce.test.ts` (+464, -0)
- `packages/opencode/test/kilocode/system-prompt.test.ts` (+68, -0)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+126, -3)
- `packages/opencode/test/kilocode/terminal-activity.test.ts` (+117, -0)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+4, -0)
- `packages/opencode/test/provider/transform.test.ts` (+1, -1)
- `packages/opencode/test/session/llm.test.ts` (+99, -0)
- `packages/schema/src/event-manifest.ts` (+2, -0)
- `packages/schema/src/kilocode/session-drain.ts` (+17, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+45, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+128, -0)
- `packages/sdk/openapi.json` (+386, -0)
- `script/kilocode-duplication-allowlist.json` (+0, -48)

### Key Diffs

#### packages/core/src/event.ts
```diff
diff --git a/packages/core/src/event.ts b/packages/core/src/event.ts
index c38de61ef..d75ce3d5c 100644
--- a/packages/core/src/event.ts
+++ b/packages/core/src/event.ts
@@ -7,6 +7,7 @@ import { and, asc, eq, gt, inArray } from "drizzle-orm"
 import { Database } from "./database/database"
 import { EventSequenceTable, EventTable } from "./event/sql"
 import * as EventStorage from "./kilocode/event-storage" // kilocode_change - released tool content shapes
+import * as EventBatch from "./kilocode/event-batch" // kilocode_change
 import { Location } from "./location"
 import { makeGlobalNode } from "./effect/app-node"
 import { isDeepStrictEqual } from "node:util"
@@ -131,6 +132,12 @@ export interface Interface {
     data: Data<D>,
     options?: PublishOptions,
   ) => Effect.Effect<Payload<D>>
+  // kilocode_change start
+  readonly publishAll: (
+    entries: readonly { readonly definition: Definition; readonly data: Data<Definition> }[],
+    options?: PublishOptions,
+  ) => Effect.Effect<void>
+  // kilocode_change end
   readonly subscribe: <D extends Definition>(definition: D) => Stream.Stream<Payload<D>>
   readonly all: () => Stream.Stream<Payload>
   readonly durable: (input: { readonly aggregateID: string; readonly after?: number }) => Stream.Stream<Payload>
@@ -624,6 +631,7 @@ export const layerWith = (options?: LayerOptions) =>
 
       return Service.of({
         publish,
+        publishAll: EventBatch.make({ db, projectors, durable: pubsub.durable, notify }), // kilocode_change
         subscribe,
         all: streamAll,
         durable,
```

#### packages/core/src/kilocode/event-batch.ts
```diff
diff --git a/packages/core/src/kilocode/event-batch.ts b/packages/core/src/kilocode/event-batch.ts
new file mode 100644
index 000000000..eb08c7212
--- /dev/null
+++ b/packages/core/src/kilocode/event-batch.ts
@@ -0,0 +1,132 @@
+import { Effect, Option, PubSub, Schema } from "effect"
+import { eq } from "drizzle-orm"
+import { Event, type Payload } from "@opencode-ai/schema/event"
+import type { Database } from "../database/database"
+import { InvalidDurableEventError, type Interface, type Subscriber } from "../event"
+import { EventSequenceTable, EventTable } from "../event/sql"
+import { Location } from "../location"
+import * as EventStorage from "./event-storage"
+
+const record = (input: unknown): input is Record<string, unknown> =>
+  typeof input === "object" && input !== null && !Array.isArray(input)
+
+export function make(input: {
+  readonly db: Database.Interface["db"]
+  readonly projectors: ReadonlyMap<string, readonly Subscriber[]>
+  readonly durable: ReadonlyMap<string, ReadonlySet<PubSub.PubSub<void>>>
+  readonly notify: (event: Payload, isolate: boolean) => Effect.Effect<void>
+}): Interface["publishAll"] {
+  return (entries, options) =>
+    Effect.gen(function* () {
+      if (entries.length === 0) return
+      const context = Option.getOrUndefined(yield* Effect.serviceOption(Location.Service))
+      const location =
+        options?.location ?? (context ? { directory: context.directory, workspaceID: context.workspaceID } : undefined)
+      const sequences = new Map<string, number>()
+      const pending = new Array<Payload>()
+      const rows = new Array<typeof EventTable.$inferInsert>()
+
+      yield* input.db
+        .transaction(
+          () =>
+            Effect.gen(function* () {
+              for (const entry of entries) {
+                const event: Payload = {
+                  id: options?.id ?? Event.ID.create(),
+                  ...(options?.metadata ? { metadata: options.metadata } : {}),
+                  type: entry.definition.type,
+                  ...(location ? { location } : {}),
+                  data: entry.data,
+                }
+                const durable = entry.definition.durable
+                if (!durable) {
+                  if (options?.commit)
+                    throw new InvalidDurableEventError({
```

#### packages/core/test/kilocode/event-batch.test.ts
```diff
diff --git a/packages/core/test/kilocode/event-batch.test.ts b/packages/core/test/kilocode/event-batch.test.ts
new file mode 100644
index 000000000..e224f8d64
--- /dev/null
+++ b/packages/core/test/kilocode/event-batch.test.ts
@@ -0,0 +1,84 @@
+import { expect, test } from "bun:test"
+import { Database as SQLite } from "bun:sqlite"
+import { Effect, Schema } from "effect"
+import path from "path"
+import { Database } from "@opencode-ai/core/database/database"
+import { AppNodeBuilder } from "@opencode-ai/core/effect/app-node-builder"
+import { LayerNode } from "@opencode-ai/core/effect/layer-node"
+import { EventV2 } from "@opencode-ai/core/event"
+import { EventSequenceTable, EventTable } from "@opencode-ai/core/event/sql"
+import { tmpdir } from "../fixture/tmpdir"
+import { testEffect } from "../lib/effect"
+
+const layer = (filename = ":memory:") =>
+  AppNodeBuilder.build(LayerNode.group([EventV2.node, Database.node]), [
+    [Database.node, Database.layerFromPath(filename)],
+  ])
+const it = testEffect(layer())
+const Durable = EventV2.define({
+  type: "test.batch.durable",
+  durable: { version: 1, aggregate: "id" },
+  schema: { id: Schema.String, value: Schema.Int },
+})
+const entries = Array.from({ length: 201 }, (_, value) => ({
+  definition: Durable,
+  data: { id: value % 2 === 0 ? "one" : "two", value },
+}))
+
+test("commits every chunk before notifying and preserves per-aggregate sequences", async () => {
+  await using tmp = await tmpdir()
+  const filename = path.join(tmp.path, "batch.db")
+  await Effect.runPromise(
+    Effect.gen(function* () {
+      const events = yield* EventV2.Service
+      const { db } = yield* Database.Service
+      for (const id of ["one", "two"]) yield* events.publish(Durable, { id, value: -1 })
+      const reader = yield* Effect.acquireRelease(
+        Effect.sync(() => new SQLite(filename, { readonly: true })),
+        (reader) => Effect.sync(() => reader.close()),
+      )
+      const observed = new Array<unknown>()
+      const stop = yield* events.listen(() =>
+        Effect.sync(() => observed.push(reader.query("SELECT COUNT(*) AS count FROM event").get())),
+      )
+      yield* events.publishAll(entries)
```

#### packages/core/test/session-runner-tool-events.test.ts
```diff
diff --git a/packages/core/test/session-runner-tool-events.test.ts b/packages/core/test/session-runner-tool-events.test.ts
index f96ea4dea..33d38db8f 100644
--- a/packages/core/test/session-runner-tool-events.test.ts
+++ b/packages/core/test/session-runner-tool-events.test.ts
@@ -26,6 +26,7 @@ const capture = () => {
         })
         return event
       }),
+    publishAll: () => Effect.die("Unexpected publishAll"), // kilocode_change
     subscribe: () => Stream.empty,
     all: () => Stream.empty,
     durable: () => Stream.empty,
```

#### packages/opencode/src/tool/registry.ts
```diff
diff --git a/packages/opencode/src/tool/registry.ts b/packages/opencode/src/tool/registry.ts
index 85b4be204..414ebbb3e 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -33,6 +33,7 @@ import { WebSearchTool } from "./websearch"
 import { KiloToolRegistry } from "../kilocode/tool/registry" // kilocode_change
 import { Notebook } from "@/kilocode/notebook/service" // kilocode_change
 import { AgentManager } from "@/kilocode/agent-manager/service" // kilocode_change
+import { SessionDrain } from "@/kilocode/session/drain" // kilocode_change
 import { RepoOverviewTool } from "@/kilocode/tool/repo-overview" // kilocode_change
 import { RepoCloneTool } from "./repo_clone" // kilocode_change
 import { Flag } from "@opencode-ai/core/flag/flag" // kilocode_change
@@ -516,6 +517,7 @@ export const node = LayerNode.suspend(() =>
       Skill.node,
       Session.node,
       BackgroundJob.node,
+      SessionDrain.node,
       Provider.node,
       LSP.node,
       Instruction.node,
```


*... and more files (showing first 5)*

## opencode Changes (ebece6e..69c172e)

### Commits

- 69c172e - fix(provider): handle SSE reader cancel rejections (#44944) (Alex, 2026-09-01)
- 82b6650 - docs(zen): add Claude Fable 5.1 (#46728) (Jack, 2026-09-02)
- 8e0f1c2 - sync release versions for v1.18.26 (opencode, 2026-09-01)
- 8ff796f - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-01)
- 8100c68 - fix(app): bump happy-dom to fix GC-dependent MutationObserver flake (#46675) (Aiden Cline, 2026-09-01)
- 86387e9 - test(opencode): fix session tools test typecheck and runtime (#46677) (Aiden Cline, 2026-09-01)
- c10d676 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-01)
- 765ae64 - fix(core): Fix for incorrect time.start reset in tool call logging (#32574) (#32596) (Roscoe A. Bartlett, 2026-09-01)
- c066339 - test(opencode): guard patched dependency versions (#46673) (Aiden Cline, 2026-09-01)
- 1542195 - fix(opencode): allow none reasoning effort in Bedrock SDK (#46671) (Aiden Cline, 2026-09-01)
- af1f9e6 - remove azure discovery stuff (#46666) (Filip, 2026-09-01)
- 2961956 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-01)
- 3f39a32 - feat(opencode): tolerate Anthropic thinking block binding (#46653) (Aiden Cline, 2026-09-01)
- dc8753f - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-01)
- 4502ee5 - fix(core): bump @ai-sdk/amazon-bedrock to 4.0.166 for reasoning and replay fixes (#45520) (KevinZhou, 2026-09-01)
- 55c54d1 - chore: use native runtime conditions in development (#46644) (Aiden Cline, 2026-09-01)
- 2da5a4b - refactor(tui): use OpenTUI Dynamic in session view (#46649) (Aiden Cline, 2026-09-01)
- 216ba8f - fix(opencode): stop Azure model discovery from logging to stdout (#46646) (Aiden Cline, 2026-09-01)
- df6aecd - chore: generate (opencode-agent[bot], 2026-09-01)
- 1ce281b - fix(stats): prevent comparison legend collapse (Adam, 2026-09-01)
- 5341a5e - feat(console): add workspace migration timestamp (#46627) (Victor Navarro, 2026-09-01)

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
- `packages/console/core/migrations/20260901161032_workspace_migrated_at/migration.sql` (+1, -0)
- `packages/console/core/migrations/20260901161032_workspace_migrated_at/snapshot.json` (+3195, -0)
- `packages/console/core/package.json` (+1, -1)
- `packages/console/core/src/schema/workspace.sql.ts` (+2, -1)
- `packages/core/package.json` (+3, -3)
- `packages/core/src/aisdk.ts` (+1, -1)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `CONTRIBUTING.md` (+1, -1)
- `bun.lock` (+49, -56)
- `nix/hashes.json` (+4, -4)
- `package.json` (+5, -3)
- `packages/app/AGENTS.md` (+1, -1)
- `packages/app/package.json` (+2, -2)
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
- `packages/opencode/package.json` (+5, -5)
- `packages/opencode/src/plugin/azure.ts` (+6, -145)
- `packages/opencode/src/provider/provider.ts` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+36, -1)
- `packages/opencode/src/session/processor.ts` (+14, -0)
- `packages/opencode/src/session/tools.ts` (+1, -1)
- `packages/opencode/test/lib/cli-process.ts` (+4, -4)
- `packages/opencode/test/patched-dependencies.test.ts` (+29, -0)
- `packages/opencode/test/plugin/azure.test.ts` (+35, -257)
- `packages/opencode/test/provider/transform.test.ts` (+232, -1)
- `packages/opencode/test/server/httpapi-v2-pty.test.ts` (+1, -1)
- `packages/opencode/test/session/tools.test.ts` (+167, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/routes/index.css` (+3, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/routes/session/index.tsx` (+1, -2)
- `packages/ui/package.json` (+1, -1)
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
- `packages/web/src/content/docs/providers.mdx` (+2, -4)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+2, -0)
- `patches/@ai-sdk%2Famazon-bedrock@4.0.166.patch` (+164, -0)
- `patches/@ai-sdk%2Fanthropic@3.0.111.patch` (+528, -0)
- `patches/@ff-labs%2Ffff-bun@0.9.3.patch` (+0, -31)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/migrations/20260901161032_workspace_migrated_at/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260901161032_workspace_migrated_at/migration.sql b/packages/console/core/migrations/20260901161032_workspace_migrated_at/migration.sql
new file mode 100644
index 0000000..87918c7
--- /dev/null
+++ b/packages/console/core/migrations/20260901161032_workspace_migrated_at/migration.sql
@@ -0,0 +1 @@
+ALTER TABLE `workspace` ADD `migrated_at` timestamp(3);
```

#### packages/console/core/migrations/20260901161032_workspace_migrated_at/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260901161032_workspace_migrated_at/snapshot.json b/packages/console/core/migrations/20260901161032_workspace_migrated_at/snapshot.json
new file mode 100644
index 0000000..e81037d
--- /dev/null
+++ b/packages/console/core/migrations/20260901161032_workspace_migrated_at/snapshot.json
@@ -0,0 +1,3195 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "3e952a24-4137-4944-b7fa-e39e71061235",
+  "prevIds": ["e365c1d7-fb02-44ad-b681-87bb51d01964"],
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

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 0ce0fa7..b1f79b2 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.25",
+  "version": "1.18.26",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/schema/workspace.sql.ts
```diff
diff --git a/packages/console/core/src/schema/workspace.sql.ts b/packages/console/core/src/schema/workspace.sql.ts
index 3497979..c71f76b 100644
--- a/packages/console/core/src/schema/workspace.sql.ts
+++ b/packages/console/core/src/schema/workspace.sql.ts
@@ -1,5 +1,5 @@
 import { boolean, json, primaryKey, mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core"
-import { timestamps, ulid } from "../drizzle/types"
+import { timestamps, ulid, utc } from "../drizzle/types"
 
 export const WorkspaceTable = mysqlTable(
   "workspace",
@@ -12,6 +12,7 @@ export const WorkspaceTable = mysqlTable(
     is_blocked: boolean(),
     is_flagged_by_anthropic: boolean(),
     is_flagged_by_openai: boolean(),
+    migrated_at: utc("migrated_at"),
     ...timestamps,
   },
   (table) => [uniqueIndex("slug").on(table.slug)],
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 37afa0b..ce620bc 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.25",
+  "version": "1.18.26",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -62,8 +62,8 @@
   },
   "dependencies": {
     "@ai-sdk/alibaba": "1.0.17",
-    "@ai-sdk/amazon-bedrock": "4.0.158",
-    "@ai-sdk/anthropic": "3.0.82",
+    "@ai-sdk/amazon-bedrock": "4.0.166",
+    "@ai-sdk/anthropic": "3.0.111",
     "@ai-sdk/azure": "3.0.88",
     "@ai-sdk/cerebras": "2.0.41",
     "@ai-sdk/cohere": "3.0.27",
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/event.ts
- `src/core/` - review core changes from packages/core/src/kilocode/event-batch.ts
- `src/core/` - review core changes from packages/core/test/kilocode/event-batch.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-tool-events.test.ts
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
