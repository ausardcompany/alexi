# Upstream Changes Report
Generated: 2026-09-04 10:46:14

## Summary
- kilocode: 86 commits, 167 files changed
- opencode: 14 commits, 74 files changed

## kilocode Changes (cf954237c..74b3141bb)

### Commits

- 74b3141bb - Merge pull request #13780 from Kilo-Org/improve-merge-conflict-resolution-workflow (Marius, 2026-09-04)
- bc2ee0412 - fix(agent-manager): preserve local edits during base updates (marius-kilocode, 2026-09-04)
- 48c44c67d - Merge pull request #13779 from Kilo-Org/add-agent-manager-pr-refresh (Marius, 2026-09-04)
- 0f3ad38bf - Merge pull request #13753 from Kilo-Org/agent-manager-intro-base-update (Marius, 2026-09-04)
- 3dced72a8 - Merge pull request #13592 from sylwester-liljegren/fix/mention-query-spaces (Marius, 2026-09-04)
- 737fba02c - feat(agent-manager): add PR panel refresh button (marius-kilocode, 2026-09-04)
- f1c71f449 - refactor(vscode): centralize mention entries (marius-kilocode, 2026-09-04)
- 378709c18 - Merge pull request #13776 from Kilo-Org/display-pr-comments-in-agent-manager (Marius, 2026-09-04)
- 25fb610c6 - fix(agent-manager): validate https protocol on conversation comment URLs before openExternal (marius-kilocode, 2026-09-04)
- 88a3ba678 - Merge pull request #13777 from Kilo-Org/fix-missing-worktree-delete-button (Marius, 2026-09-04)
- 6a9e08e61 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-04)
- 687685654 - fix(agent-manager): restore worktree delete actions (marius-kilocode, 2026-09-04)
- 7ba794161 - fix(agent-manager): use Kilo in conflict guidance (marius-kilocode, 2026-09-04)
- dc8caf95a - Merge pull request #13775 from Kilo-Org/fix-stale-worktree-status (Marius, 2026-09-04)
- 2829b2fda - fix(agent-manager): explain worktree conflict resolution (marius-kilocode, 2026-09-04)
- 103baaba9 - Merge pull request #13774 from Kilo-Org/fix-slash-command-with-unanswered-question (Marius, 2026-09-04)
- f29d6f5ad - refactor(vscode): eliminate duplication between PR types and lock in allowlist cleanup (marius-kilocode, 2026-09-04)
- f936e8b22 - test(agent-manager): cover released child unblock (marius-kilocode, 2026-09-04)
- 0d5ca6ec7 - fix(agent-manager): clarify base update onboarding copy (marius-kilocode, 2026-09-04)
- 46dfbbc67 - feat(agent-manager): show PR conversation comments in PR panel (marius-kilocode, 2026-09-04)
- d842b975a - fix(agent-manager): clear stale child activity (marius-kilocode, 2026-09-04)
- a780b41de - fix(agent-manager): show base update command in onboarding (marius-kilocode, 2026-09-04)
- f0aee125d - Merge pull request #13773 from Kilo-Org/fix-worktree-deletion-agent-manager-navigation (Marius, 2026-09-04)
- 7b4f502df - fix(agent-manager): handle unanswered update questions (marius-kilocode, 2026-09-04)
- f18516ea0 - fix(agent-manager): preserve collapsed sections after deletion (marius-kilocode, 2026-09-04)
- fccc74a55 - feat(vscode): rank the whole @ menu against one query (Sylwester Liljegren, 2026-09-04)
- f9cc1ae0d - fix(vscode): let @browse files open the file picker (Sylwester Liljegren, 2026-09-03)
- 673b5e944 - fix(vscode): let past chats answer a spaced query before closing it (Sylwester Liljegren, 2026-09-03)
- 456676bb6 - Merge remote-tracking branch 'upstream/main' into fix/mention-query-spaces (Sylwester Liljegren, 2026-09-03)
- 13b6005c0 - feat(vscode): search past chats and every menu entry from @ (Sylwester Liljegren, 2026-09-03)
- 5861e4048 - Merge pull request #13760 from Kilo-Org/rapid-acorn (Kirill Kalishev, 2026-09-03)
- 3c298d4cc - Merge pull request #13756 from Kilo-Org/lucky-keyboard (Kirill Kalishev, 2026-09-03)
- a1a6d4c0e - fix(jetbrains): harden worktree editor move wiring against review findings (kirillk, 2026-09-03)
- df21a974b - Merge pull request #13755 from Kilo-Org/humble-grove (Kirill Kalishev, 2026-09-03)
- 6e162b598 - fix(jetbrains): hold a focus refresh blocked by a running PR lookup (kirillk, 2026-09-03)
- fefb51271 - fix(jetbrains): report base checkout changes in the tab header, not the dock (kirillk, 2026-09-03)
- 22f6bd4f6 - Merge pull request #13758 from Kilo-Org/compact-serializer (Andrea Giammarchi, 2026-09-03)
- 5d4c699e6 - Merge pull request #13759 from Kilo-Org/fix-explore-execution-limits (Marius, 2026-09-03)
- 27de3c69e - fix(jetbrains): refresh PR badges app-wide on IDE focus gain (kirillk, 2026-09-03)
- c50423d5b - Merge branch 'main' into humble-grove (Kirill Kalishev, 2026-09-03)
- c330a000f - fix(cli): clarify Explore execution limits (marius-kilocode, 2026-09-03)
- 64df33388 - fix(vscode): a more compact serializer outcome (webreflection, 2026-09-03)
- 1fee30fe0 - Merge pull request #13752 from Kilo-Org/fix/opencode-provider-request-headers (Christiaan Arnoldus, 2026-09-03)
- 7db1716d8 - test(cli): cover JSON-clean task metadata without a selected variant (#13688) (matt wilkie, 2026-09-03)
- f20ab7f88 - feat(jetbrains): move sessions to a worktree from the worktree editor (kirillk, 2026-09-03)
- d15b0eceb - chore(jetbrains): disable feedback surveys and enable internal mode in dev runs (kirillk, 2026-09-03)
- 2457e957d - Merge commit '2b4c1718e198715a0f53699ec107400b75e96922' into agent-manager-intro-base-update (marius-kilocode, 2026-09-03)
- 2b4c1718e - fix(vscode): restore Agent Manager build within line cap (#13754) (Marius, 2026-09-03)
- 62c366011 - fix(agent-manager): reference update-from-base in introduction (marius-kilocode, 2026-09-03)
- e9e2cfd77 - Merge pull request #13744 from Kilo-Org/fix-subagent-permission-denial (Marius, 2026-09-03)
- 6f0e43bfa - Merge pull request #13734 from Kilo-Org/improve-agent-manager-welcome-screen (Marius, 2026-09-03)
- 2f4bc4c20 - fix(cli): restore OpenCode provider request headers (chrarnoldus, 2026-09-03)
- 961bae346 - fix(cli): use space to toggle and enter to advance multi-select questions (#13578) (matt wilkie, 2026-09-03)
- 64824499c - Merge pull request #13733 from Kilo-Org/show-unresolved-pr-comments-status (Marius, 2026-09-03)
- 22df919bd - fix(cli): stop plan-mode edit hardening for custom plan/architect agents (#13590) (matt wilkie, 2026-09-03)
- e0dd6c8e0 - fix(vscode): open sent-message images in an editor tab (#13683) (sylwester-liljegren, 2026-09-03)
- cbe13ec28 - test(cli): allow time for permission integration cases (marius-kilocode, 2026-09-03)
- b9b92fb6f - Merge pull request #13743 from Kilo-Org/fix-suggestion-completion-status (Marius, 2026-09-03)
- 4b85267ae - fix(cli): keep subagents running after permission denial (marius-kilocode, 2026-09-03)
- 82bb76671 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-03)
- 1414543dc - chore(agent-manager): merge main and isolate intro rendering (marius-kilocode, 2026-09-03)
- 26a8922be - fix(agent-manager): prefer terminal outcomes over stale suggestions (marius-kilocode, 2026-09-03)
- 48e0bf067 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-03)
- 62acc16a2 - fix(agent-manager): show completed status for review suggestions (marius-kilocode, 2026-09-03)
- 4427a7f46 - refactor(vscode): share encoding for domain signatures (marius-kilocode, 2026-09-03)
- a77d72ee7 - Merge pull request #13742 from Kilo-Org/dedupe-ui-css-cleanup (Marius, 2026-09-03)
- e35d82e1d - Merge pull request #13741 from Kilo-Org/dedupe-session-tab-css (Marius, 2026-09-03)
- c67958996 - Merge pull request #13740 from Kilo-Org/dedupe-context-mentions (Marius, 2026-09-03)
- 8060a2208 - Merge pull request #13738 from Kilo-Org/investigate-worktree-creation-message-delay (Marius, 2026-09-03)
- c0e1831a4 - Merge pull request #13739 from Kilo-Org/dedupe-question-resolution (Marius, 2026-09-03)
- fa59aa531 - chore: merge main into PR comment badges (marius-kilocode, 2026-09-03)
- 88fb0c1ab - refactor(vscode): keep PR signatures in the PR domain (marius-kilocode, 2026-09-03)
- 6566aadd8 - refactor(vscode): share session tab layout styles (marius-kilocode, 2026-09-03)
- 76e794466 - refactor(ui): remove redundant shared CSS (marius-kilocode, 2026-09-03)
- 024276eb0 - refactor(vscode): share context mention parsing and attachments (marius-kilocode, 2026-09-03)
- 0d0aead54 - refactor(vscode): share question resolution routing (marius-kilocode, 2026-09-03)
- 02230244e - fix(agent-manager): align intro captions and add stories (marius-kilocode, 2026-09-03)
- 8d347a941 - fix(agent-manager): show initial worktree prompts immediately (marius-kilocode, 2026-09-03)
- 4739577f3 - fix(agent-manager): simplify welcome session routing (marius-kilocode, 2026-09-03)
- d95e20d1c - feat(agent-manager): add inline worktree introduction (marius-kilocode, 2026-09-03)
- d969f8b3e - feat(vscode): show unresolved PR comments on worktrees (marius-kilocode, 2026-09-03)
- 881d75637 - fix(vscode): settle mentions by insertion, not by any known path (Sylwester Liljegren, 2026-09-01)
- 916b94f66 - test(vscode): give the session activity fixture an explicit timeout (Sylwester Liljegren, 2026-09-01)
- e4d321ffb - Merge remote-tracking branch 'upstream/main' into fix/mention-query-spaces (Sylwester Liljegren, 2026-09-01)
- e4a3905db - fix(vscode): close mention dropdown once a mention is complete (Sylwester Liljegren, 2026-09-01)
- 6a224d2d7 - fix(vscode): keep @ mention search open across spaces (Sylwester Liljegren, 2026-08-31)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+10, -2)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/kilo-vscode/src/agent-manager/orchestration-domain.ts` (+4, -3)

#### Other Changes
- `.changeset/agent-manager-intro-base-update.md` (+5, -0)
- `.changeset/agent-manager-intro-screen.md` (+5, -0)
- `.changeset/agent-manager-pr-conversation-comments.md` (+5, -0)
- `.changeset/agent-manager-pr-refresh.md` (+5, -0)
- `.changeset/calm-subagent-denial.md` (+5, -0)
- `.changeset/compact-vscode-serializer.md` (+5, -0)
- `.changeset/fix-agent-manager-shortcut-state.md` (+5, -0)
- `.changeset/fix-explore-execution-limits.md` (+5, -0)
- `.changeset/fix-opencode-provider-headers.md` (+5, -0)
- `.changeset/fix-stale-worktree-status.md` (+5, -0)
- `.changeset/jetbrains-worktree-editor-move.md` (+5, -0)
- `.changeset/mention-query-spaces.md` (+5, -0)
- `.changeset/optimistic-worktree-prompts.md` (+5, -0)
- `.changeset/plan-name-collision-custom-agents.md` (+5, -0)
- `.changeset/pr-unresolved-thread-badges.md` (+5, -0)
- `.changeset/preserve-sections-after-deletion.md` (+5, -0)
- `.changeset/run-question-space-toggle.md` (+5, -0)
- `.changeset/suggestion-completion-status.md` (+5, -0)
- `.changeset/update-from-base-questions.md` (+5, -0)
- `.changeset/user-message-image-preview-tab.md` (+5, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/introduction-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/introduction-skipped-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-badge-unresolved-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-badge-unresolved-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/source-links.md` (+2, -0)
- `packages/kilo-jetbrains/AGENTS.md` (+3, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+7, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/BranchLocalDiffTest.kt` (+11, -4)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+29, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/MoveWorktreeSessionAction.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerHost.kt` (+77, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/Away.kt` (+5, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinator.kt` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+5, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManager.kt` (+62, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+17, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusService.kt` (+120, -15)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloFrontendDynamicPluginListener.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionActivityKind.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+25, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/BranchDock.kt` (+10, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerHostTest.kt` (+113, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeControllerTest.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManagerTest.kt` (+144, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanelTest.kt` (+106, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusServiceTest.kt` (+202, -18)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+64, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/BranchDockTest.kt` (+46, -0)
- `packages/kilo-ui/src/components/message-part.css` (+0, -40)
- `packages/kilo-ui/src/components/message-part.tsx` (+2, -0)
- `packages/kilo-ui/src/components/model-selector.css` (+0, -101)
- `packages/kilo-ui/src/styles/index.css` (+0, -1)
- `packages/kilo-ui/src/styles/tailwind/index.css` (+0, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+52, -6)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+144, -57)
- `packages/kilo-vscode/src/agent-manager/base-update.ts` (+3, -1)
- `packages/kilo-vscode/src/agent-manager/git-stats-snapshot.ts` (+2, -1)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-types.ts` (+17, -0)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-utils.ts` (+90, -5)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+26, -41)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+8, -1)
- `packages/kilo-vscode/src/image-preview.ts` (+3, -6)
- `packages/kilo-vscode/src/kilo-provider/handlers/question.ts` (+23, -38)
- `packages/kilo-vscode/src/shared/image-data-url.ts` (+11, -0)
- `packages/kilo-vscode/src/shared/review-comments.ts` (+7, -2)
- `packages/kilo-vscode/src/util/serialize.ts` (+12, -0)
- `packages/kilo-vscode/src/utils.ts` (+2, -1)
- `packages/kilo-vscode/tests/fixtures/pr-comments-render.tsx` (+216, -1)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+95, -3)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-i18n-split.test.ts` (+13, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-modifier.test.ts` (+45, -0)
- `packages/kilo-vscode/tests/unit/am-pr-status-bridge.test.ts` (+101, -3)
- `packages/kilo-vscode/tests/unit/am-pr-utils.test.ts` (+181, -2)
- `packages/kilo-vscode/tests/unit/base-update.test.ts` (+85, -11)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+218, -21)
- `packages/kilo-vscode/tests/unit/image-preview.test.ts` (+26, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+79, -6)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+48, -2)
- `packages/kilo-vscode/tests/unit/next-selection-after-delete.test.ts` (+40, -0)
- `packages/kilo-vscode/tests/unit/pr-comments-render.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/pr-status-merge.test.ts` (+23, -4)
- `packages/kilo-vscode/tests/unit/question-handler.test.ts` (+11, -6)
- `packages/kilo-vscode/tests/unit/review-comments-pr.test.ts` (+11, -1)
- `packages/kilo-vscode/tests/unit/section-helpers.test.ts` (+8, -4)
- `packages/kilo-vscode/tests/unit/serialize.test.ts` (+169, -0)
- `packages/kilo-vscode/tests/unit/session-activity.test.ts` (+21, -0)
- `packages/kilo-vscode/tests/unit/terminal-architecture.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/terminal-context-utils.test.ts` (+23, -19)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+736, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+84, -87)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+20, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/ShortcutsDialog.tsx` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+36, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeSectionActions.tsx` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+45, -65)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+31, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/intro/AgentManagerIntro.tsx` (+172, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/intro/IntroGraph.tsx` (+118, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/intro/intro.css` (+299, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/modifier.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRConversation.tsx` (+235, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanel.tsx` (+101, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanelHost.tsx` (+66, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-comment-payload.ts` (+15, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-comment-state.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-panel.css` (+26, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-types.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/section-helpers.ts` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+20, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+26, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeUserMessage.tsx` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/WelcomeEmptyState.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+31, -4)
- `packages/kilo-vscode/webview-ui/src/hooks/context-mention-utils.ts` (+37, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+193, -58)
- `packages/kilo-vscode/webview-ui/src/hooks/git-changes-context-utils.ts` (+4, -26)
- `packages/kilo-vscode/webview-ui/src/hooks/terminal-context-utils.ts` (+4, -26)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+226, -47)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+98, -1)
- `packages/kilo-vscode/webview-ui/src/styles/session-tabs.css` (+18, -4)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/utils/session-activity.ts` (+10, -2)
- `packages/opencode/src/cli/cmd/run/footer.question.tsx` (+33, -1)
- `packages/opencode/src/kilocode/cli/cmd/run/question.shared.ts` (+20, -0)
- `packages/opencode/src/session/llm/request.ts` (+6, -6)
- `packages/opencode/src/session/processor.ts` (+1, -1)
- `packages/opencode/test/kilocode/agent-config-metadata.test.ts` (+35, -0)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+76, -0)
- `packages/opencode/test/kilocode/cli/run/question.shared.test.tsx` (+174, -0)
- `packages/opencode/test/kilocode/session-llm-request.test.ts` (+83, -0)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+117, -0)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+19, -1)
- `script/kilocode-duplication-allowlist.json` (+0, -42)

### Key Diffs

#### packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
```diff
diff --git a/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts b/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
index 6f5ae24ec..675cc554b 100644
--- a/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
+++ b/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
@@ -355,7 +355,7 @@ function truncate(value: string, max: number): string {
   return value.length <= max ? value : `${value.slice(0, max - 1)}…`
 }
 
-async function blocked(input: Target, dir: string, name: string): Promise<string | undefined> {
+async function blocked(input: Target, dir: string, name: string, questions?: "dismiss"): Promise<string | undefined> {
   const [perms, qs] = await Promise.all([
     input.client.permission.list({ directory: dir }),
     input.client.question.list({ directory: dir }),
@@ -363,7 +363,7 @@ async function blocked(input: Target, dir: string, name: string): Promise<string
   if (perms.error || qs.error)
     throw new OrchestrationError("host_error", "The managed session blockers could not be read")
   const mine = (qs.data ?? []).filter((value) => value.sessionID === input.sessionID)
-  const first = mine[0]
+  const first = questions === "dismiss" ? undefined : mine.at(0)
   if (first) {
     const detail = mine
       .map((value) => {
@@ -395,10 +395,11 @@ export async function prompt(input: {
   messageID: string
   signal?: AbortSignal
   managed?: ManagedSession
+  questions?: "dismiss"
 }): Promise<void> {
   if (input.signal?.aborted) return
   const target = await locate(input)
-  const blocker = await blocked(input, target.dir, target.name)
+  const blocker = await blocked(input, target.dir, target.name, input.questions)
   if (blocker) throw new OrchestrationError("unavailable_session", blocker)
   if (input.signal?.aborted) return
   await input.client.session.promptAsync(
```

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index 3352845fc..b7f8b8f4d 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -279,11 +279,18 @@ function planEditGuard(worktree: string) {
 
 export function hardenPlan(
   key: string,
-  item: { permission: Permission.Ruleset },
+  item: { native?: boolean; permission: Permission.Ruleset },
   worktree: string,
   ...explicit: Permission.Ruleset[]
 ) {
-  if (key !== "plan" && key !== "architect") return
+  // Plan-mode edit restrictions are a ceiling for the built-in plan agent only.
+  // Custom agents named `architect` are governed by their own permission config;
+  // the previous name check appended the guard after their rules, so last-match-
+  // wins made their edit allows unreachable with no opt-out (#13581). A custom
+  // `agent.plan` config reuses the built-in object, so `native` stays true and
+  // the ceiling still applies there.
+  if (key !== "plan") return
+  if (item.native !== true) return
   const edit = explicit.map(editRestrictions)
   item.permission = Permission.merge(item.permission, planEditGuard(worktree), ...edit)
 }
@@ -525,6 +532,7 @@ export function patchAgents(
   if (agents.explore) {
     agents.explore = {
       ...agents.explore,
+      description: `${agents.explore.description} Bash is limited to an allowlist of read-only commands. For required scripts, tests, or binary-analysis commands outside that allowlist, select an available agent whose permissions allow them while preserving the requested no-change scope.`,
       permission: Permission.merge(
         defaults,
         Permission.fromConfig({
```


## opencode Changes (f12e14c..3f31139)

### Commits

- 3f31139 - feat(console): route migrated BYOK through provider connections (#47266) (Victor Navarro, 2026-09-04)
- 475b408 - fix(console): backport usage reset boundary fix to dev (#47267) (Jack, 2026-09-04)
- 70f7411 - fix(stats): keep omen-alpha under unknown provider (#47248) (opencode-agent[bot], 2026-09-04)
- 03cb632 - test(core): disable npm audits in the test preload (#47222) (opencode-agent[bot], 2026-09-04)
- dd417f1 - chore: generate (opencode-agent[bot], 2026-09-04)
- 8b9f89e - docs(go): add Omen Alpha (#47220) (Jack, 2026-09-04)
- c0f09af - feat(copilot): send X-Interaction-Id header with session id (#47215) (opencode-agent[bot], 2026-09-03)
- 8a6cf2c - feat(stats): improve market share chart (#47115) (Adam, 2026-09-03)
- a935432 - chore: generate (opencode-agent[bot], 2026-09-03)
- 7561b4a - fix(tui): use unicode ellipses in interface text (#45126) (David Hill, 2026-09-03)
- d8eb3b8 - chore: generate (opencode-agent[bot], 2026-09-03)
- 08c483d - fix(stats): reduce database query load (Adam, 2026-09-03)
- d2efd81 - fix(console): proxy migrated model discovery to v1 endpoint (#47065) (Victor Navarro, 2026-09-03)
- 79d5031 - docs(web): translate Go usage requirements (#47057) (Jack, 2026-09-03)

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
- `packages/core/test/preload.test.ts` (+5, -0)
- `packages/core/test/preload.ts` (+1, -0)
- `packages/stats/core/migrations/20260903161929_parched_patriot/migration.sql` (+1, -0)
- `packages/stats/core/migrations/20260903161929_parched_patriot/snapshot.json` (+2367, -0)
- `packages/stats/core/src/database/schema.ts` (+10, -0)
- `packages/stats/core/src/domain/home.ts` (+86, -99)
- `packages/stats/core/src/domain/inference.test.ts` (+24, -0)
- `packages/stats/core/src/domain/inference.ts` (+2, -0)
- `packages/stats/core/src/domain/model-normalization.ts` (+5, -1)

#### Other Changes
- `packages/console/app/src/component/limits-graph.tsx` (+1, -0)
- `packages/console/app/src/i18n/ar.ts` (+1, -1)
- `packages/console/app/src/i18n/br.ts` (+1, -1)
- `packages/console/app/src/i18n/da.ts` (+1, -1)
- `packages/console/app/src/i18n/de.ts` (+1, -1)
- `packages/console/app/src/i18n/en.ts` (+1, -1)
- `packages/console/app/src/i18n/es.ts` (+1, -1)
- `packages/console/app/src/i18n/fr.ts` (+1, -1)
- `packages/console/app/src/i18n/it.ts` (+1, -1)
- `packages/console/app/src/i18n/ja.ts` (+1, -1)
- `packages/console/app/src/i18n/ko.ts` (+1, -1)
- `packages/console/app/src/i18n/no.ts` (+1, -1)
- `packages/console/app/src/i18n/pl.ts` (+1, -1)
- `packages/console/app/src/i18n/ru.ts` (+1, -1)
- `packages/console/app/src/i18n/th.ts` (+1, -1)
- `packages/console/app/src/i18n/tr.ts` (+1, -1)
- `packages/console/app/src/i18n/uk.ts` (+1, -1)
- `packages/console/app/src/i18n/zh.ts` (+1, -1)
- `packages/console/app/src/i18n/zht.ts` (+1, -1)
- `packages/console/app/src/lib/inference-proxy.ts` (+44, -7)
- `packages/console/app/src/lib/stats-proxy.ts` (+43, -2)
- `packages/console/app/src/middleware.ts` (+0, -8)
- `packages/console/app/src/routes/go/index.tsx` (+1, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+47, -7)
- `packages/console/app/src/routes/zen/v1/models.ts` (+35, -1)
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+1, -0)
- `packages/opencode/test/plugin/github-copilot.test.ts` (+56, -0)
- `packages/stats/app/src/component/model-compare-detail.tsx` (+2, -2)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+2, -2)
- `packages/stats/app/src/routes/index.css` (+125, -0)
- `packages/stats/app/src/routes/index.tsx` (+71, -32)
- `packages/tui/src/app.tsx` (+2, -2)
- `packages/tui/src/component/dialog-console-org.tsx` (+1, -1)
- `packages/tui/src/component/dialog-move-session.tsx` (+1, -1)
- `packages/tui/src/component/dialog-provider.tsx` (+1, -1)
- `packages/tui/src/component/dialog-skill.tsx` (+1, -1)
- `packages/tui/src/component/dialog-workspace-list.tsx` (+1, -1)
- `packages/tui/src/component/error-component.tsx` (+1, -1)
- `packages/tui/src/component/prompt/index.tsx` (+3, -3)
- `packages/tui/src/component/startup-loading.tsx` (+1, -1)
- `packages/tui/src/feature-plugins/system/diff-viewer.tsx` (+1, -1)
- `packages/tui/src/feature-plugins/system/plugins.tsx` (+1, -1)
- `packages/tui/src/routes/session/index.tsx` (+15, -26)
- `packages/tui/src/ui/dialog-prompt.tsx` (+2, -2)
- `packages/tui/test/cli/tui/diff-viewer-file-tree.test.tsx` (+1, -1)
- `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+2, -2)
- `packages/web/src/content/docs/ar/go.mdx` (+23, -3)
- `packages/web/src/content/docs/bs/go.mdx` (+23, -3)
- `packages/web/src/content/docs/da/go.mdx` (+23, -3)
- `packages/web/src/content/docs/de/go.mdx` (+23, -3)
- `packages/web/src/content/docs/es/go.mdx` (+59, -39)
- `packages/web/src/content/docs/fr/go.mdx` (+23, -3)
- `packages/web/src/content/docs/go.mdx` (+13, -4)
- `packages/web/src/content/docs/it/go.mdx` (+23, -3)
- `packages/web/src/content/docs/ja/go.mdx` (+23, -3)
- `packages/web/src/content/docs/ko/go.mdx` (+23, -3)
- `packages/web/src/content/docs/nb/go.mdx` (+23, -3)
- `packages/web/src/content/docs/pl/go.mdx` (+23, -3)
- `packages/web/src/content/docs/pt-br/go.mdx` (+59, -39)
- `packages/web/src/content/docs/ru/go.mdx` (+23, -3)
- `packages/web/src/content/docs/th/go.mdx` (+23, -3)
- `packages/web/src/content/docs/tr/go.mdx` (+23, -3)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+23, -3)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+23, -3)

### Key Diffs

#### packages/core/test/preload.test.ts
```diff
diff --git a/packages/core/test/preload.test.ts b/packages/core/test/preload.test.ts
new file mode 100644
index 0000000..cd31307
--- /dev/null
+++ b/packages/core/test/preload.test.ts
@@ -0,0 +1,5 @@
+import { expect, test } from "bun:test"
+
+test("disables public npm security audits", () => {
+  expect(process.env.NPM_CONFIG_AUDIT).toBe("false")
+})
```

#### packages/core/test/preload.ts
```diff
diff --git a/packages/core/test/preload.ts b/packages/core/test/preload.ts
index 39b237d..7a2a3d2 100644
--- a/packages/core/test/preload.ts
+++ b/packages/core/test/preload.ts
@@ -1,5 +1,6 @@
 import path from "path"
 
 process.env.OPENCODE_DB = ":memory:"
+process.env.NPM_CONFIG_AUDIT = "false"
 process.env.OPENCODE_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
 process.env.OPENCODE_DISABLE_MODELS_FETCH = "true"
```

#### packages/stats/core/migrations/20260903161929_parched_patriot/migration.sql
```diff
diff --git a/packages/stats/core/migrations/20260903161929_parched_patriot/migration.sql b/packages/stats/core/migrations/20260903161929_parched_patriot/migration.sql
new file mode 100644
index 0000000..e80bd5d
--- /dev/null
+++ b/packages/stats/core/migrations/20260903161929_parched_patriot/migration.sql
@@ -0,0 +1 @@
+CREATE INDEX `idx_country_model_range` ON `geo_stat` (`model`,`provider`,`grain`,`dataset`,`client`,`source`,`tier`,`period_key`);
```

#### packages/stats/core/migrations/20260903161929_parched_patriot/snapshot.json
```diff
diff --git a/packages/stats/core/migrations/20260903161929_parched_patriot/snapshot.json b/packages/stats/core/migrations/20260903161929_parched_patriot/snapshot.json
new file mode 100644
index 0000000..1c2302f
--- /dev/null
+++ b/packages/stats/core/migrations/20260903161929_parched_patriot/snapshot.json
@@ -0,0 +1,2367 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "43e72697-1bf9-4df7-bc8e-5ca091bf2ff1",
+  "prevIds": ["9d4d1a06-7d28-4cb4-b0cd-3dfb7b481b8b"],
+  "ddl": [
+    {
+      "name": "geo_stat",
+      "entityType": "tables"
+    },
+    {
+      "name": "model_retention",
+      "entityType": "tables"
+    },
+    {
+      "name": "model_stat",
+      "entityType": "tables"
+    },
+    {
+      "name": "provider_stat",
+      "entityType": "tables"
+    },
+    {
+      "type": "bigint",
+      "notNull": true,
+      "autoIncrement": true,
+      "default": null,
+      "onUpdateNow": false,
+      "onUpdateNowFsp": null,
+      "charSet": null,
+      "collation": null,
+      "generated": null,
+      "name": "id",
+      "entityType": "columns",
+      "table": "geo_stat"
+    },
+    {
+      "type": "varchar(16)",
+      "notNull": true,
+      "autoIncrement": false,
+      "default": null,
+      "onUpdateNow": false,
+      "onUpdateNowFsp": null,
+      "charSet": null,
```

#### packages/stats/core/src/database/schema.ts
```diff
diff --git a/packages/stats/core/src/database/schema.ts b/packages/stats/core/src/database/schema.ts
index dcf8d52..c17b1aa 100644
--- a/packages/stats/core/src/database/schema.ts
+++ b/packages/stats/core/src/database/schema.ts
@@ -104,6 +104,16 @@ export const geoStat = mysqlTable(
     index("idx_country").on(table.country, table.grain, table.period_key),
     index("idx_continent").on(table.continent, table.grain, table.period_key),
     index("idx_country_model").on(table.model, table.country, table.grain, table.period_key),
+    index("idx_country_model_range").on(
+      table.model,
+      table.provider,
+      table.grain,
+      table.dataset,
+      table.client,
+      table.source,
+      table.tier,
+      table.period_key,
+    ),
   ],
 )
 
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
