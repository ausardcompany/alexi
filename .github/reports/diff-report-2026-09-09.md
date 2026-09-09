# Upstream Changes Report
Generated: 2026-09-09 10:52:41

## Summary
- kilocode: 119 commits, 526 files changed
- opencode: 4 commits, 36 files changed

## kilocode Changes (a7a7690ca..492a2ffa2)

### Commits

- 492a2ffa2 - feat(vscode): sync Agent Manager PR fixes with remote (#13951) (Marius, 2026-09-09)
- 718c2b36a - Merge pull request #13948 from Kilo-Org/implement-issue-13915 (Marius, 2026-09-09)
- 84fbc544a - Merge CI visual regression baselines (marius-kilocode, 2026-09-09)
- 6b1b382fd - style(vscode): format permission toggle test (marius-kilocode, 2026-09-09)
- a65894264 - fix(remote): derive session repository metadata from the session directory (#13949) (Igor Šćekić, 2026-09-09)
- f7a2127d6 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- 02a01b812 - test(vscode): update permission toggle selectors (marius-kilocode, 2026-09-09)
- b39606d1f - fix(vscode): preserve icon button aria state (marius-kilocode, 2026-09-09)
- 63cc39a8e - Merge remote-tracking branch 'origin/main' into implement-issue-13915 (marius-kilocode, 2026-09-09)
- a5667d23f - fix(vscode): unify icon button controls (marius-kilocode, 2026-09-09)
- 4e4d87d12 - Merge pull request #13945 from Kilo-Org/fix-snapshot-initialization-hang (Marius, 2026-09-09)
- 0739ea399 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-09)
- 000e0ca89 - Merge remote-tracking branch 'origin/main' into fix-snapshot-initialization-hang (marius-kilocode, 2026-09-09)
- 298f9a273 - Merge pull request #13947 from Kilo-Org/fix-flaky-jetbrains-tests (Marius, 2026-09-09)
- 8f0e05463 - Merge pull request #13927 from Kilo-Org/dust-dianella (Marius, 2026-09-09)
- e3620878a - Merge pull request #13942 from Kilo-Org/fix-goal-send-bad-request (Marius, 2026-09-09)
- 03fa3084c - Merge pull request #13926 from Kilo-Org/investigate-empty-project-bar-agent-manager (Marius, 2026-09-09)
- a4776aed0 - test(jetbrains): fix flaky worktree fork dedupe test (marius-kilocode, 2026-09-09)
- 2342b1f57 - Merge remote-tracking branch 'origin/main' into investigate-empty-project-bar-agent-manager (marius-kilocode, 2026-09-09)
- 861fc33f0 - Merge pull request #13925 from Kilo-Org/optimize-fix-production-build (Marius, 2026-09-09)
- f82911314 - Merge remote-tracking branch 'origin/main' into dust-dianella (marius-kilocode, 2026-09-09)
- a0da7221e - Merge pull request #13946 from Kilo-Org/remove-token-cost-wording (Marius, 2026-09-09)
- a386f96a2 - Merge pull request #13940 from Kilo-Org/add-theme-colored-agent-avatars (Marius, 2026-09-09)
- c6416e20a - Merge pull request #13944 from Kilo-Org/fix-cli-link-clickability (Marius, 2026-09-09)
- aa57a4960 - Merge pull request #13941 from Kilo-Org/document-agent-manager-orchestration (Marius, 2026-09-09)
- 708196890 - Merge pull request #13943 from Kilo-Org/revert-feature-flag-implementation (Marius, 2026-09-09)
- 241193c5c - fix(goal): preserve active goal cancellation (marius-kilocode, 2026-09-09)
- 14821478d - Merge remote-tracking branch 'origin/add-theme-colored-agent-avatars' into add-theme-colored-agent-avatars (marius-kilocode, 2026-09-09)
- 6d2c2b826 - test(cli): classify snapshot runtime integration (marius-kilocode, 2026-09-09)
- 6e38e1d92 - fix(vscode): update subagent activity fixture (marius-kilocode, 2026-09-09)
- 501d08daa - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- 3ceeeb1c6 - fix(goal): remove credit wording (marius-kilocode, 2026-09-09)
- 3fd7be426 - fix(vscode): update avatar CI expectations (marius-kilocode, 2026-09-09)
- 408338f5c - test(goal): avoid fiber exit assumption (marius-kilocode, 2026-09-09)
- 9db971865 - fix(cli): prevent snapshot progress session hangs (marius-kilocode, 2026-09-09)
- 1423442f2 - feat(cli): make terminal links clickable (marius-kilocode, 2026-09-09)
- ada216a90 - revert(agent-manager): enable multiple projects by default (marius-kilocode, 2026-09-09)
- decc0e536 - fix(goal): allow goals to replace running responses (marius-kilocode, 2026-09-09)
- 021c977fd - docs(agent-manager): document orchestration workflows (marius-kilocode, 2026-09-09)
- 4bb09b125 - feat(vscode): round subagent avatars with sibling colors and live shimmer (marius-kilocode, 2026-09-08)
- b8fe0095d - tmp (marius-kilocode, 2026-09-08)
- 08f696e4b - Merge pull request #13771 from sylwester-liljegren/feat/vscode-notifications (Marius, 2026-09-08)
- a365ba695 - Merge pull request #13930 from Kilo-Org/jetbrains/release/v7.1.6 (Kirill Kalishev, 2026-09-08)
- 8bbbcf0e3 - docs(jetbrains): edit changelog for v7.1.6 (Kirill Kalishev, 2026-09-08)
- 9224095da - release(jetbrains): v7.1.6 (kilo-maintainer[bot], 2026-09-08)
- 34875ae07 - Merge pull request #13928 from Kilo-Org/fix-terminal-tab-close-resize (Marius, 2026-09-08)
- 4ff8f1930 - Merge remote-tracking branch 'origin/feat/vscode-notifications' into feat/vscode-notifications (Sylwester Liljegren, 2026-09-08)
- c2e4e728c - fix(vscode): fix CI failures from the notification changes (Sylwester Liljegren, 2026-09-08)
- ed3cdc6a1 - feat(cli): add caffeinate command (marius-kilocode, 2026-09-08)
- 3e057279b - fix(vscode): release terminal tab widths after close (marius-kilocode, 2026-09-08)
- 702ed79c7 - Merge branch 'main' into feat/vscode-notifications (Marius, 2026-09-08)
- 0af5b307e - fix(kilo-console): isolate shared dialog styles (marius-kilocode, 2026-09-08)
- c60221a6b - fix(agent-manager): preserve restricted overlay behavior (marius-kilocode, 2026-09-08)
- 46034d417 - fix(kilo-console): preserve route providers during lazy loads (marius-kilocode, 2026-09-08)
- 31a4eab15 - Merge remote-tracking branch 'origin/main' into investigate-empty-project-bar-agent-manager (marius-kilocode, 2026-09-08)
- b5a7d6243 - Merge pull request #13924 from Kilo-Org/fix-pr-sidebar-margin-display (Marius, 2026-09-08)
- 9911ae0d1 - Merge pull request #13923 from Kilo-Org/jetbrains/release/v7.1.6-rc.3 (Kirill Kalishev, 2026-09-08)
- 818d31d0a - fix(agent-manager): explain restricted workspaces (marius-kilocode, 2026-09-08)
- a4be3ccca - docs(jetbrains): edit changelog for v7.1.6-rc.3 (Kirill Kalishev, 2026-09-08)
- cdbb92655 - fix(kilo-console): reduce startup bundle size (marius-kilocode, 2026-09-08)
- 6e136a8dc - docs(jetbrains): edit changelog for v7.1.6-rc.3 (Kirill Kalishev, 2026-09-08)
- eea393684 - fix(vscode): add PR sidebar review margins (marius-kilocode, 2026-09-08)
- 3c4148d83 - release(jetbrains): v7.1.6-rc.3 (kilo-maintainer[bot], 2026-09-08)
- b856113c5 - Merge upstream/main into feat/vscode-notifications (Sylwester Liljegren, 2026-09-08)
- 1dde56d61 - Merge pull request #13921 from Kilo-Org/shocking-farmer (Marius, 2026-09-08)
- 74a9e2aa0 - Merge pull request #13886 from Kilo-Org/fix-jetbrains-config-warning-scope (Kirill Kalishev, 2026-09-08)
- cc3f87c7d - Merge pull request #13887 from Kilo-Org/tidy-tundra (Kirill Kalishev, 2026-09-08)
- 13caf02bb - Merge pull request #13888 from Kilo-Org/clever-tundra (Kirill Kalishev, 2026-09-08)
- 36d6d7dab - fix(release): include CLI notes in GitHub releases (marius-kilocode, 2026-09-08)
- fa4a8401f - feat(agent-manager): enable multiple projects by default (#13918) (Marius, 2026-09-08)
- 19604b890 - Merge pull request #13679 from Kilo-Org/add-goal-session-reruns (Marius, 2026-09-08)
- 4fc96d68e - fix(goal): preserve attachment admission interrupts (marius-kilocode, 2026-09-08)
- c5df354dd - Merge pull request #13920 from Kilo-Org/fix/agent-manager-worktree-failure-notification (Marius, 2026-09-08)
- 70ba5985a - fix(agent-manager): allow committed bases from orphan branches (marius-kilocode, 2026-09-08)
- 05c763f12 - fix(agent-manager): explain empty repository worktree failures (marius-kilocode, 2026-09-08)
- 5bfe44c80 - fix(goal): resolve main conflicts and stabilize layout test (marius-kilocode, 2026-09-08)
- 6fc3a9623 - Merge pull request #13793 from Kilo-Org/remove-unwanted-feature (Marius, 2026-09-08)
- e97d11dd4 - fix(goal): preserve running goals and pending drafts (marius-kilocode, 2026-09-08)
- 8a2403b9f - chore: merge main into goal branch (marius-kilocode, 2026-09-08)
- e9be65bc6 - Merge branch 'main' into remove-unwanted-feature (Marius, 2026-09-08)
- 3451814b8 - Merge pull request #13917 from Kilo-Org/fix-release-test-failures (Marius, 2026-09-08)
- 77b657c6a - Merge pull request #13782 from Kilo-Org/add-session-board-view-and-reset (Marius, 2026-09-08)
- 8bce7a75a - Merge pull request #13916 from Kilo-Org/reorganize-agent-manager-toolbar (Marius, 2026-09-08)
- 99630f25d - fix(ci): preserve container publishing and retry Bun installation (marius-kilocode, 2026-09-08)
- 1ff33e8a4 - fix(ci): stop unused container workflow from blocking releases (marius-kilocode, 2026-09-08)
- cb744c74f - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-08)
- 1ec62684f - feat(agent-manager): regroup toolbar actions (marius-kilocode, 2026-09-08)
- 9fe193cdb - chore: merge latest main into goal branch (marius-kilocode, 2026-09-08)
- 6199c0126 - feat(goal): add persistent session goals (marius-kilocode, 2026-09-08)
- e89dd9e86 - Merge origin/main into remove-unwanted-feature (marius-kilocode, 2026-09-08)
- f83275f4d - fix(vscode): clean up board reader observer (marius-kilocode, 2026-09-08)
- 65b9c3590 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-08)
- ffbffa591 - fix: harden board paths and CI coverage (marius-kilocode, 2026-09-08)
- 4d2d8001e - feat(vscode): add shared agent board reader and reset (marius-kilocode, 2026-09-08)
- 981dde6e8 - Merge origin/main into remove-unwanted-feature (marius-kilocode, 2026-09-08)
- d5a919f11 - Merge origin/main into remove-unwanted-feature (marius-kilocode, 2026-09-08)
- b43ac8833 - Merge branch 'main' into fix-jetbrains-config-warning-scope (Kirill Kalishev, 2026-09-07)
- 2029d4ce9 - fix(jetbrains): address worktree deletion review findings (kirillk, 2026-09-07)
- 6aa8d391a - fix(jetbrains): bound the workspace config-warnings fetch (kirillk, 2026-09-07)
- f9dbc697a - Merge upstream/main into feat/vscode-notifications (Sylwester Liljegren, 2026-09-07)
- 8d7ef91e7 - fix(jetbrains): stop auto-expanding worktree session list on new/forked sessions (kirillk, 2026-09-07)
- 05c1bb0a0 - fix(jetbrains): make Agent Manager worktree deletion non-blocking and fault tolerant (kirillk, 2026-09-07)
- 102761b01 - fix(jetbrains): scope config warnings to the workspace directory (kirillk, 2026-09-07)
- cf59107f1 - chore: merge main into goal session branch (marius-kilocode, 2026-09-07)
- 4cb80539a - fix(vscode): address review feedback on OS notifications (Sylwester Liljegren, 2026-09-06)
- dd72b1dd7 - Merge upstream/main into feat/vscode-notifications (Sylwester Liljegren, 2026-09-06)
- 0c4cb4620 - feat(vscode): deliver native OS notifications on all platforms (Sylwester Liljegren, 2026-09-06)
- b5cf42615 - fix(cli): remove nonfunctional interactive terminal tool (marius-kilocode, 2026-09-04)
- 43e6a6e89 - refactor(vscode): dedupe agent manager memory commands (Sylwester Liljegren, 2026-09-04)
- 5970da2a6 - Merge commit 'dc8caf95a6efae1bf028e968b3a0e063b12e3493' into add-goal-session-reruns (marius-kilocode, 2026-09-04)
- db13759be - chore: annotate goal admission error handling (marius-kilocode, 2026-09-04)
- 2298ea087 - chore: merge main and fix goal CI checks (marius-kilocode, 2026-09-04)
- 4051293c2 - fix(vscode): gate OS notifications by platform and recheck channel (Sylwester Liljegren, 2026-09-04)
- 716c378df - fix(goal): harden continuation and session controls (marius-kilocode, 2026-09-04)
- 1bf83fa8e - feat(vscode): translate notification settings strings (Sylwester Liljegren, 2026-09-04)
- 3c28e7a9a - feat(vscode): add task attention notifications (Sylwester Liljegren, 2026-09-03)
- a6f67ce22 - chore: merge main into goal branch (marius-kilocode, 2026-09-02)
- c42a0b154 - refactor: simplify goal controls above the prompt (marius-kilocode, 2026-09-01)
- e27ff0a6d - feat: add continuous session goals (marius-kilocode, 2026-09-01)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/interactive-terminal.ts` (+0, -94)
- `packages/opencode/src/kilocode/tool/interactive-terminal.txt` (+0, -25)
- `packages/opencode/src/kilocode/tool/registry.ts` (+13, -14)
- `packages/opencode/src/kilocode/tool/task.ts` (+0, -1)
- `packages/opencode/src/tool/registry.ts` (+1, -1)
- `packages/opencode/src/tool/shell.ts` (+1, -1)
- `packages/opencode/src/tool/task.ts` (+0, -1)
- `packages/opencode/test/kilocode/tool/notify-user.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/tool/send-file.test.ts` (+3, -3)
- `packages/opencode/test/tool/task.test.ts` (+0, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+1, -5)
- `packages/opencode/src/kilocode/agent/index.ts` (+0, -2)
- `packages/opencode/test/agent/agent.test.ts` (+0, -3)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/schema.json` (+12, -2)
- `packages/core/script/kilocode/migration.ts` (+1, -1)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration/20260903104806_kilocode_board_reset.ts` (+13, -0)
- `packages/core/src/database/schema.gen.ts` (+1, -0)
- `packages/core/src/kilocode/board/sql.ts` (+1, -0)
- `packages/core/src/kilocode/caffeination.ts` (+217, -0)
- `packages/core/src/pty/driver.ts` (+1, -1)
- `packages/core/test/kilocode/board/migration.test.ts` (+39, -0)
- `packages/core/test/npm.test.ts` (+4, -2)

#### Other Changes
- `.changeset/agent-manager-home-guidance.md` (+5, -0)
- `.changeset/agent-manager-push-fixes.md` (+5, -0)
- `.changeset/agent-manager-toolbar-groups.md` (+5, -0)
- `.changeset/caffeinate-cli.md` (+6, -0)
- `.changeset/clear-empty-repository-worktree-error.md` (+5, -0)
- `.changeset/cli-links.md` (+5, -0)
- `.changeset/complete-release-notes.md` (+5, -0)
- `.changeset/console-bundle-split.md` (+5, -0)
- `.changeset/fix-terminal-tab-close-resize.md` (+5, -0)
- `.changeset/keep-agent-manager-projects-opt-in.md` (+5, -0)
- `.changeset/meta-launch-directory-no-context-fallback.md` (+5, -0)
- `.changeset/notify-workbench-attention.md` (+5, -0)
- `.changeset/remote-session-metadata-from-session-directory.md` (+5, -0)
- `.changeset/remove-interactive-terminal.md` (+6, -0)
- `.changeset/session-goals.md` (+17, -0)
- `.changeset/skip-disabled-snapshot-locks.md` (+5, -0)
- `.changeset/subagent-avatars.md` (+5, -0)
- `.changeset/swarm-session-board.md` (+8, -0)
- `.changeset/unify-icon-buttons.md` (+6, -0)
- `bun.lock` (+24, -27)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -3)
- `packages/client/test/contract-identity.test.ts` (+1, -1)
- `packages/containers/bun-node/Dockerfile` (+13, -1)
- `packages/kilo-console/package.json` (+0, -1)
- `packages/kilo-console/public/logo.lottie` (+-, --)
- `packages/kilo-console/src/App.tsx` (+5, -2)
- `packages/kilo-console/src/components/LoadingLogo.tsx` (+2, -31)
- `packages/kilo-console/src/index.tsx` (+8, -4)
- `packages/kilo-console/src/layouts/ConfigLayout.tsx` (+4, -0)
- `packages/kilo-console/src/routes/config/AgentsRoute.tsx` (+2, -0)
- `packages/kilo-console/src/routes/config/CliNotificationsRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/CliUiRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/ConsoleUiRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/FormattersRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/IndexingRoute.tsx` (+2, -0)
- `packages/kilo-console/src/routes/config/KeybindsRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/McpRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/ModelsRoute.tsx` (+2, -0)
- `packages/kilo-console/src/routes/config/OverviewRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/PermissionsRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/ServersRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/SourcesRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/ToolsRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/sections.tsx` (+23, -16)
- `packages/kilo-console/src/routes/profile/LoginRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/profile/ProfileRoute.tsx` (+7, -1)
- `packages/kilo-console/src/routes/projects/ProjectConsoleRoute.tsx` (+49, -29)
- `packages/kilo-console/src/routes/projects/ProjectsRoute.tsx` (+1, -0)
- `packages/kilo-console/src/styles.css` (+0, -17)
- `packages/kilo-console/src/styles/dialogs.css` (+85, -0)
- `packages/kilo-console/src/styles/empty.css` (+1, -0)
- `packages/kilo-console/src/styles/project-console.css` (+8, -0)
- `packages/kilo-console/src/styles/providers.css` (+0, -86)
- `packages/kilo-console/vite.config.ts` (+4, -0)
- `packages/kilo-docs/pages/automate/agent-manager-workflows.md` (+15, -1)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+89, -8)
- `packages/kilo-docs/pages/automate/tools/index.md` (+45, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+8, -0)
- `packages/kilo-docs/pages/customize/custom-subagents.md` (+5, -3)
- `packages/kilo-docs/pages/getting-started/settings/sandboxing.md` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/all-colors-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/default-color-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/dense-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/empty-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/expanded-with-items-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/first-and-last-section-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/long-section-name-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/multiple-sections-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-active-worktree-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-busy-worktree-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-pr-badges-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-stale-worktree-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-versions-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-scroll-up-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-with-diffs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-with-pr-threads-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/full-screen-diff-with-pr-threads-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/inline-diff-bulk-action-collapse-all-button-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/inline-diff-bulk-action-expand-all-button-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-summary-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/sidebar-search-open-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-full-context-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-multiple-tabs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-single-tab-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-with-review-tab-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-closed-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-empty-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-open-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-messages-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-layout-correction-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-many-prompts-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-wide-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/sidebar-top-bar-default-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-single-background-agent-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-todos-all-done-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-todos-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/agent-messages-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/agent-messages-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/bash-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/diff-summary-collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/glob-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-apply-patch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-edit-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-external-dir-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-heredoc-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-skill-shell-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-subagent-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-todo-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-websearch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-write-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/question-above-chatbox-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/history-sessionlist/worktree-sources-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/iconbutton/states-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/agent-behaviour-agents-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/agent-behaviour-edit-custom-mode-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/agent-behaviour-skills-overflow-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mcp-edit-view-local-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mcp-edit-view-local-with-env-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mcp-edit-view-remote-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mode-edit-export-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mode-edit-permissions-chromium-linux.png` (+2, -2)
- `packages/kilo-jetbrains/CHANGELOG.md` (+35, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloAppState.kt` (+0, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+5, -60)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+19, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/diff/GitComparison.kt` (+19, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+0, -9)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapper.kt` (+8, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+396, -154)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/PrResolver.kt` (+8, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+48, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorkspaceState.kt` (+2, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/worktree/WorktreeTrash.kt` (+250, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+4, -107)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloBackendCliManagerEnvTest.kt` (+47, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapperTest.kt` (+22, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+95, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTrashTest.kt` (+193, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceTest.kt` (+83, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/worktree/WorktreeTrashTest.kt` (+192, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinator.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManager.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+5, -20)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListController.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusService.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+6, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManagerTest.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanelTest.kt` (+24, -15)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/AppWatchingTest.kt` (+5, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ConnectionDelayTest.kt` (+2, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+3, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+0, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloWorkspaceStateDto.kt` (+1, -0)
- `packages/kilo-ui/package.json` (+2, -0)
- `packages/kilo-ui/src/components/agent-avatar-identity.test.ts` (+61, -0)
- `packages/kilo-ui/src/components/agent-avatar-identity.ts` (+77, -0)
- `packages/kilo-ui/src/components/agent-avatar.css` (+87, -0)
- `packages/kilo-ui/src/components/agent-avatar.tsx` (+56, -0)
- `packages/kilo-ui/src/components/basic-tool.css` (+13, -106)
- `packages/kilo-ui/src/components/board-message.css` (+115, -0)
- `packages/kilo-ui/src/components/board-message.tsx` (+85, -0)
- `packages/kilo-ui/src/components/icon-button.css` (+114, -11)
- `packages/kilo-ui/src/components/icon-button.tsx` (+44, -3)
- `packages/kilo-ui/src/components/icon.css` (+17, -0)
- `packages/kilo-ui/src/components/icon.tsx` (+41, -8)
- `packages/kilo-ui/src/components/message-part.css` (+0, -18)
- `packages/kilo-ui/src/components/message-part.tsx` (+29, -90)
- `packages/kilo-ui/src/components/prompt-input.css` (+0, -5)
- `packages/kilo-ui/src/stories/dropdown-menu.stories.tsx` (+4, -4)
- `packages/kilo-ui/src/stories/icon-button.stories.tsx` (+54, -12)
- `packages/kilo-ui/src/stories/tooltip.stories.tsx` (+4, -4)
- `packages/kilo-ui/src/styles/index.css` (+3, -0)
- `packages/kilo-ui/src/styles/tailwind/index.css` (+1, -0)
- `packages/kilo-vscode/docs/features/task-completion-notification.md` (+0, -12)
- `packages/kilo-vscode/docs/opencode-migration-plan.md` (+0, -1)
- `packages/kilo-vscode/package.json` (+15, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+87, -29)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+5, -4)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+16, -7)
- `packages/kilo-vscode/src/agent-manager/base-update.ts` (+16, -4)
- `packages/kilo-vscode/src/agent-manager/home-workspace.ts` (+12, -0)
- `packages/kilo-vscode/src/agent-manager/provider-multi-version.ts` (+11, -3)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-create.ts` (+19, -3)
- `packages/kilo-vscode/src/extension.ts` (+35, -1)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+24, -1)
- `packages/kilo-vscode/src/kilo-provider/command-completion.ts` (+5, -1)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+7, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+9, -1)
- `packages/kilo-vscode/src/kilo-provider/push-fixes-settings.ts` (+6, -0)
- `packages/kilo-vscode/src/kilo-provider/session-board.ts` (+99, -0)
- `packages/kilo-vscode/src/services/attention/index.ts` (+1, -0)
- `packages/kilo-vscode/src/services/attention/notice.ts` (+15, -0)
- `packages/kilo-vscode/src/services/attention/os.ts` (+169, -0)
- `packages/kilo-vscode/src/services/attention/service.ts` (+132, -15)
- `packages/kilo-vscode/src/services/caffeination/inhibitor.ts` (+2, -212)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.test.ts` (+23, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+10, -0)
- `packages/kilo-vscode/src/services/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/attention/ar.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/br.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/bs.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/da.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/de.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/en.ts` (+16, -0)
- `packages/kilo-vscode/src/services/i18n/attention/es.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/fa.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/fr.ts` (+14, -0)
- `packages/kilo-vscode/src/services/i18n/attention/it.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/ja.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/ko.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/nl.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/no.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/pl.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/ru.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/th.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/tr.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/uk.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/zh.ts` (+12, -0)
- `packages/kilo-vscode/src/services/i18n/attention/zht.ts` (+12, -0)
- `packages/kilo-vscode/src/services/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/fa.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/it.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/src/shared/review-comments.ts` (+11, -0)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+46, -13)
- `packages/kilo-vscode/tests/fixtures/caffeination-button.tsx` (+3, -3)
- `packages/kilo-vscode/tests/fixtures/pr-comments-render.tsx` (+48, -24)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+400, -8)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts` (+7, -8)
- `packages/kilo-vscode/tests/session-dock-stability.spec.ts` (+127, -0)
- `packages/kilo-vscode/tests/swarm-board.spec.ts` (+321, -0)
- `packages/kilo-vscode/tests/unit/abort-state.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-settings.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-layout.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/attention-os.test.ts` (+172, -0)
- `packages/kilo-vscode/tests/unit/attention.test.ts` (+287, -7)
- `packages/kilo-vscode/tests/unit/base-update.test.ts` (+11, -1)
- `packages/kilo-vscode/tests/unit/cloud-session-handler.test.ts` (+35, -0)
- `packages/kilo-vscode/tests/unit/command-completion.test.ts` (+21, -2)
- `packages/kilo-vscode/tests/unit/early-message.test.ts` (+29, -0)
- `packages/kilo-vscode/tests/unit/git-import.test.ts` (+6, -0)
- `packages/kilo-vscode/tests/unit/goal-composer.test.ts` (+108, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-open-session.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-route-integration.test.ts` (+118, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+36, -1)
- `packages/kilo-vscode/tests/unit/pr-check-feedback.test.ts` (+11, -1)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+21, -9)
- `packages/kilo-vscode/tests/unit/provider-multi-version.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/review-comments-pr.test.ts` (+19, -0)
- `packages/kilo-vscode/tests/unit/session-board.test.ts` (+136, -0)
- `packages/kilo-vscode/tests/unit/session-dock.test.ts` (+47, -1)
- `packages/kilo-vscode/tests/unit/session-scroll-bottom.test.ts` (+142, -0)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+27, -0)
- `packages/kilo-vscode/tests/unit/worktree-create.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+34, -20)
- `packages/kilo-vscode/webview-ui/agent-manager/CaffeinationButton.css` (+0, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/CaffeinationButton.tsx` (+2, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+5, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectActions.tsx` (+5, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSearchMenu.tsx` (+2, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSectionHeader.tsx` (+7, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/SubagentPanel.tsx` (+17, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/TabBar.tsx` (+125, -121)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+52, -152)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRChecks.tsx` (+9, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanel.tsx` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRSummary.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-check-feedback.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-panel.css` (+16, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+8, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SideTerminalPanel.tsx` (+4, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalDestinationButton.tsx` (+10, -4)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/ConversationList.tsx` (+17, -18)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/MessageArea.tsx` (+12, -11)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/MessageBubble.tsx` (+52, -73)
- `packages/kilo-vscode/webview-ui/kiloclaw/kiloclaw.css` (+0, -54)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/BackgroundAgents.tsx` (+8, -28)
- `packages/kilo-vscode/webview-ui/src/components/chat/BrowserReferences.tsx` (+6, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+88, -71)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+20, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionCommand.tsx` (+6, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+15, -10)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+268, -92)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionDock.tsx` (+19, -18)
- `packages/kilo-vscode/webview-ui/src/components/chat/SidebarTopBar.tsx` (+14, -22)
- `packages/kilo-vscode/webview-ui/src/components/chat/SwarmBoard.tsx` (+351, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+8, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+11, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeUserMessage.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/background-agents.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/goal/GoalHeader.tsx` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/goal/useGoalComposer.ts` (+68, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/goal/useGoalDock.tsx` (+171, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/task-tool-state.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+15, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/NotificationsTab.tsx` (+119, -35)
- `packages/kilo-vscode/webview-ui/src/components/shared/ActivityIcon.tsx` (+1, -10)
- `packages/kilo-vscode/webview-ui/src/components/shared/SandboxButton.tsx` (+4, -5)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/SpeechToTextButton.tsx` (+5, -23)
- `packages/kilo-vscode/webview-ui/src/context/abort-state.ts` (+8, -4)
- `packages/kilo-vscode/webview-ui/src/context/local-tabs.tsx` (+5, -5)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+58, -41)
- `packages/kilo-vscode/webview-ui/src/hooks/useImageAttachments.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+31, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+97, -47)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+144, -3)
- `packages/kilo-vscode/webview-ui/src/stories/icon-button.stories.tsx` (+65, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+4, -7)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/goal.css` (+128, -0)
- `packages/kilo-vscode/webview-ui/src/styles/permission-dock.css` (+2, -52)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+28, -93)
- `packages/kilo-vscode/webview-ui/src/styles/search-menu.css` (+0, -4)
- `packages/kilo-vscode/webview-ui/src/styles/session-actions.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/styles/session-tabs.css` (+0, -13)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+40, -19)
- `packages/kilo-vscode/webview-ui/src/styles/tool-overrides.css` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/board.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/index.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/sessions.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/utils/review-comment-markdown.ts` (+1, -0)
- `packages/opencode/package.json` (+18, -18)
- `packages/opencode/script/kilocode/test-durations.json` (+0, -2)
- `packages/opencode/script/kilocode/test-profile.ts` (+0, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+15, -8)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+1, -14)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+0, -21)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+1, -9)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+0, -8)
- `packages/opencode/src/cli/cmd/run/session-data.ts` (+1, -59)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+0, -12)
- `packages/opencode/src/cli/cmd/run/tool.ts` (+0, -42)
- `packages/opencode/src/cli/cmd/run/types.ts` (+0, -2)
- `packages/opencode/src/command/index.ts` (+10, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+75, -16)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+1, -2)
- `packages/opencode/src/kilocode/board/store.ts` (+170, -68)
- `packages/opencode/src/kilocode/cli/cmd/run-terminal.ts` (+0, -54)
- `packages/opencode/src/kilocode/cli/cmd/run.ts` (+32, -0)
- `packages/opencode/src/kilocode/cli/cmd/run/interactive-terminal.tsx` (+0, -144)
- `packages/opencode/src/kilocode/cli/cmd/run/types.ts` (+0, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+4, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/caffeination.tsx` (+152, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/goal.tsx` (+109, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/goal-sync.ts` (+85, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/vt/vt-screen.ts` (+0, -14)
- `packages/opencode/src/kilocode/interactive-terminal/index.ts` (+0, -469)
- `packages/opencode/src/kilocode/interactive-terminal/output.ts` (+0, -13)
- `packages/opencode/src/kilocode/sandbox/activation.ts` (+1, -11)
- `packages/opencode/src/kilocode/sandbox/network-tools.ts` (+0, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/interactive-terminal.ts` (+0, -103)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+44, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/interactive-terminal.ts` (+0, -62)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+48, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/sandbox.ts` (+0, -2)
- `packages/opencode/src/kilocode/server/httpapi/public.ts` (+10, -3)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+0, -2)
- `packages/opencode/src/kilocode/session/goal/instructions.ts` (+8, -0)
- `packages/opencode/src/kilocode/session/goal/policy.ts` (+58, -0)
- `packages/opencode/src/kilocode/session/goal/runner.ts` (+486, -0)
- `packages/opencode/src/kilocode/session/goal/state.ts` (+67, -0)
- `packages/opencode/src/kilocode/session/goal/tool.ts` (+41, -0)
- `packages/opencode/src/kilocode/session/part-lifecycle.ts` (+1, -1)
- `packages/opencode/src/kilocode/session/prompt-queue.ts` (+5, -0)
- `packages/opencode/src/kilocode/snapshot/track.ts` (+6, -4)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+0, -2)
- `packages/opencode/src/server/shared/workspace-routing.ts` (+1, -1)
- `packages/opencode/src/session/message-v2.ts` (+2, -0)
- `packages/opencode/src/session/prompt.ts` (+84, -34)
- `packages/opencode/src/session/session.ts` (+6, -3)
- `packages/opencode/src/session/tools.ts` (+2, -0)
- `packages/opencode/src/snapshot/index.ts` (+4, -0)
- `packages/opencode/test/cli/auto-mode.test.ts` (+1, -12)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+0, -6)
- `packages/opencode/test/cli/run/run-process.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+2, -4)
- `packages/opencode/test/kilocode/board/store.test.ts` (+174, -0)
- `packages/opencode/test/kilocode/chmod-injection-contract.test.ts` (+38, -0)
- `packages/opencode/test/kilocode/cli/cmd/run-goal.test.ts` (+108, -0)
- `packages/opencode/test/kilocode/cli/cmd/run-terminal.test.ts` (+0, -72)
- `packages/opencode/test/kilocode/cli/cmd/run/interactive-terminal.test.ts` (+0, -98)
- `packages/opencode/test/kilocode/cli/cmd/tui/goal.test.tsx` (+163, -0)
- `packages/opencode/test/kilocode/cli/cmd/tui/prompt/interrupt.test.tsx` (+223, -0)
- `packages/opencode/test/kilocode/interactive-terminal.test.ts` (+0, -410)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+139, -2)
- `packages/opencode/test/kilocode/message-v2-transient.test.ts` (+84, -0)
- `packages/opencode/test/kilocode/run-drain.test.ts` (+73, -0)
- `packages/opencode/test/kilocode/sandbox/network.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/server/board.test.ts` (+161, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+130, -32)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+31, -1)
- `packages/opencode/test/kilocode/session/goal.test.ts` (+1884, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+1, -6)
- `packages/opencode/test/kilocode/snapshot-disabled.test.ts` (+37, -0)
- `packages/opencode/test/kilocode/snapshot-track-timeout.test.ts` (+76, -1)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+0, -7)
- `packages/opencode/test/kilocode/test-profile.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+32, -34)
- `packages/opencode/test/kilocode/tui/goal-sync.test.ts` (+166, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+87, -211)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+120, -261)
- `packages/sdk/openapi.json` (+367, -742)
- `packages/tui/src/component/prompt/index.tsx` (+10, -4)
- `packages/tui/src/context/sync.tsx` (+3, -65)
- `packages/tui/src/kilocode/link-interactions.ts` (+153, -0)
- `packages/tui/src/routes/session/index.tsx` (+8, -61)
- `packages/tui/src/routes/session/terminal.tsx` (+0, -206)
- `packages/tui/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+8, -8)
- `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+0, -1)
- `packages/tui/test/fixture/tui-sdk.ts` (+1, -2)
- `packages/tui/test/kilocode/interactive-terminal.test.tsx` (+0, -117)
- `packages/tui/test/kilocode/link-interactions.test.ts` (+186, -0)
- `packages/ui/src/components/basic-tool.tsx` (+2, -1)
- `script/architecture-allowlist.json` (+2, -1)
- `script/check-opencode-promise-facades.ts` (+15, -3)
- `script/kilocode/release-notes.test.ts` (+37, -1)
- `script/kilocode/release-notes.ts` (+27, -2)

### Key Diffs

#### packages/core/schema.json
```diff
diff --git a/packages/core/schema.json b/packages/core/schema.json
index d6abbcb97..4443db4f5 100644
--- a/packages/core/schema.json
+++ b/packages/core/schema.json
@@ -1,9 +1,9 @@
 {
   "version": "7",
   "dialect": "sqlite",
-  "id": "fcf518b9-c8bc-4ee5-8e68-2608bffcef43",
+  "id": "38a74186-5907-4662-9e14-e059300a8b4e",
   "prevIds": [
-    "08cfecbf-f95d-404b-a76a-2afc564baa8b"
+    "fcf518b9-c8bc-4ee5-8e68-2608bffcef43"
   ],
   "ddl": [
     {
@@ -700,6 +700,16 @@
       "entityType": "columns",
       "table": "kilo_board"
     },
+    {
+      "type": "integer",
+      "notNull": true,
+      "autoincrement": false,
+      "default": "0",
+      "generated": null,
+      "name": "cleared_seq",
+      "entityType": "columns",
+      "table": "kilo_board"
+    },
     {
       "type": "integer",
       "notNull": true,
```

#### packages/core/script/kilocode/migration.ts
```diff
diff --git a/packages/core/script/kilocode/migration.ts b/packages/core/script/kilocode/migration.ts
index c4ad0ee4a..40750df1d 100644
--- a/packages/core/script/kilocode/migration.ts
+++ b/packages/core/script/kilocode/migration.ts
@@ -1,5 +1,5 @@
 function board(name: string) {
-  return name === "kilocode_board" || name.endsWith("_kilocode_board")
+  return /(?:^|_)kilocode_board(?:_reset)?$/.test(name)
 }
 
 export function file(name: string, value: string) {
```

#### packages/core/src/database/migration.gen.ts
```diff
diff --git a/packages/core/src/database/migration.gen.ts b/packages/core/src/database/migration.gen.ts
index c6429a33a..1b40d57d9 100644
--- a/packages/core/src/database/migration.gen.ts
+++ b/packages/core/src/database/migration.gen.ts
@@ -42,6 +42,7 @@ export const migrations = (
     import("./migration/20260622202450_simplify_session_input"),
     import("./migration/20260714141136_session-message-legacy-writer-compat"),
     import("./migration/20260828074139_kilocode_board"), // kilocode_change
+    import("./migration/20260903104806_kilocode_board_reset"), // kilocode_change
     import("./migration/20260907102000_kilocode_model_usage_index"), // kilocode_change
   ])
 ).map((module) => module.default) satisfies DatabaseMigration.Migration[]
```

#### packages/core/src/database/migration/20260903104806_kilocode_board_reset.ts
```diff
diff --git a/packages/core/src/database/migration/20260903104806_kilocode_board_reset.ts b/packages/core/src/database/migration/20260903104806_kilocode_board_reset.ts
new file mode 100644
index 000000000..1683db3a2
--- /dev/null
+++ b/packages/core/src/database/migration/20260903104806_kilocode_board_reset.ts
@@ -0,0 +1,13 @@
+import { Effect } from "effect"
+import type { DatabaseMigration } from "../migration"
+
+export default {
+  id: "20260903104806_kilocode_board_reset",
+  up(tx) {
+    return Effect.gen(function* () {
+      // kilocode_change start
+      yield* tx.run(`ALTER TABLE \`kilo_board\` ADD \`cleared_seq\` integer DEFAULT 0 NOT NULL;`)
+      // kilocode_change end
+    })
+  },
+} satisfies DatabaseMigration.Migration
```

#### packages/core/src/database/schema.gen.ts
```diff
diff --git a/packages/core/src/database/schema.gen.ts b/packages/core/src/database/schema.gen.ts
index 340cd7749..f961caf4a 100644
--- a/packages/core/src/database/schema.gen.ts
+++ b/packages/core/src/database/schema.gen.ts
@@ -111,6 +111,7 @@ export default {
           \`objective\` text NOT NULL,
           \`objective_message_id\` text,
           \`next_seq\` integer DEFAULT 1 NOT NULL,
+          \`cleared_seq\` integer DEFAULT 0 NOT NULL,
           \`message_count\` integer DEFAULT 0 NOT NULL,
           \`message_bytes\` integer DEFAULT 0 NOT NULL,
           \`time_created\` integer NOT NULL,
```


*... and more files (showing first 5)*

## opencode Changes (d6855b6..830d5eb)

### Commits

- 830d5eb - sync release versions for v1.18.30 (opencode, 2026-09-09)
- 5cd8e68 - feat(opencode): port Astra system prompt from v2 (#48057) (Aiden Cline, 2026-09-08)
- dff8fbc - chore: generate (opencode-agent[bot], 2026-09-08)
- ac1758c - fix: preserve Bedrock DeepSeek model ids (#34441) (Emrick, 2026-09-08)

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
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+11, -3)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+7, -0)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+28, -28)
- `packages/app/package.json` (+1, -1)
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
- `packages/opencode/src/provider/provider.ts` (+5, -1)
- `packages/opencode/src/session/prompt/gpt-astra.txt` (+46, -0)
- `packages/opencode/src/session/system.ts` (+2, -0)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+43, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 23aade0..19aade6 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.29",
+  "version": "1.18.30",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index daa4c4e..cc782f5 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.29",
+  "version": "1.18.30",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/plugin/provider/amazon-bedrock.ts
```diff
diff --git a/packages/core/src/plugin/provider/amazon-bedrock.ts b/packages/core/src/plugin/provider/amazon-bedrock.ts
index 0995cf1..7b83079 100644
--- a/packages/core/src/plugin/provider/amazon-bedrock.ts
+++ b/packages/core/src/plugin/provider/amazon-bedrock.ts
@@ -13,15 +13,23 @@ type MantleSDK = {
 // specific model/region combinations. Keep the mapping narrow and avoid
 // double-prefixing model IDs that models.dev already marks as global/us/eu/etc.
 function resolveModelID(modelID: string, region: string | undefined) {
+  if (modelID.startsWith("arn:")) return modelID
+
   const crossRegionPrefixes = ["global.", "us.", "eu.", "jp.", "apac.", "au."]
   if (crossRegionPrefixes.some((prefix) => modelID.startsWith(prefix))) return modelID
 
   const resolvedRegion = region ?? "us-east-1"
   const regionPrefix = resolvedRegion.split("-")[0]
   if (regionPrefix === "us") {
-    const requiresPrefix = ["nova-micro", "nova-lite", "nova-pro", "nova-premier", "nova-2", "claude", "deepseek"].some(
-      (item) => modelID.includes(item),
-    )
+    const requiresPrefix = [
+      "nova-micro",
+      "nova-lite",
+      "nova-pro",
+      "nova-premier",
+      "nova-2",
+      "claude",
+      "deepseek.r1",
+    ].some((item) => modelID.includes(item))
     if (requiresPrefix && !resolvedRegion.startsWith("us-gov")) return `${regionPrefix}.${modelID}`
     return modelID
   }
```

#### packages/core/test/plugin/provider-amazon-bedrock.test.ts
```diff
diff --git a/packages/core/test/plugin/provider-amazon-bedrock.test.ts b/packages/core/test/plugin/provider-amazon-bedrock.test.ts
index 5d24879..9ddcd12 100644
--- a/packages/core/test/plugin/provider-amazon-bedrock.test.ts
+++ b/packages/core/test/plugin/provider-amazon-bedrock.test.ts
@@ -528,6 +528,13 @@ describe("AmazonBedrockPlugin", () => {
         { region: "us-east-1", modelID: "amazon.nova-2-lite-v1:0", expected: "us.amazon.nova-2-lite-v1:0" },
         { region: "us-east-1", modelID: "anthropic.claude-sonnet-4-5", expected: "us.anthropic.claude-sonnet-4-5" },
         { region: "us-east-1", modelID: "deepseek.r1-v1:0", expected: "us.deepseek.r1-v1:0" },
+        { region: "us-east-1", modelID: "us.deepseek.r1-v1:0", expected: "us.deepseek.r1-v1:0" },
+        { region: "us-east-1", modelID: "deepseek.v3.2", expected: "deepseek.v3.2" },
+        {
+          region: "us-east-1",
+          modelID: "arn:aws:bedrock:us-east-1::foundation-model/deepseek.v3.2",
+          expected: "arn:aws:bedrock:us-east-1::foundation-model/deepseek.v3.2",
+        },
         { region: "us-gov-west-1", modelID: "anthropic.claude-sonnet-4-5", expected: "anthropic.claude-sonnet-4-5" },
         { region: "us-east-1", modelID: "cohere.command-r-plus-v1:0", expected: "cohere.command-r-plus-v1:0" },
         { region: "eu-west-1", modelID: "anthropic.claude-sonnet-4-5", expected: "eu.anthropic.claude-sonnet-4-5" },
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index 3da366c..d6ffa5f 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.29",
+  "version": "1.18.30",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/core/` - review core changes from packages/core/schema.json
- `src/core/` - review core changes from packages/core/script/kilocode/migration.ts
- `src/core/` - review core changes from packages/core/src/database/migration.gen.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260903104806_kilocode_board_reset.ts
- `src/core/` - review core changes from packages/core/src/database/schema.gen.ts
- `src/core/` - review core changes from packages/core/src/kilocode/board/sql.ts
- `src/core/` - review core changes from packages/core/src/kilocode/caffeination.ts
- `src/core/` - review core changes from packages/core/src/pty/driver.ts
- `src/core/` - review core changes from packages/core/test/kilocode/board/migration.test.ts
- `src/core/` - review core changes from packages/core/test/npm.test.ts
- `src/tool/interactive-terminal.ts` - update based on kilocode packages/opencode/src/kilocode/tool/interactive-terminal.ts changes
- `src/tool/interactive-terminal.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/interactive-terminal.txt changes
- `src/tool/notify-user.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/notify-user.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/send-file.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/send-file.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
