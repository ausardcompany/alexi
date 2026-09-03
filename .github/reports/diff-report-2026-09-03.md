# Upstream Changes Report
Generated: 2026-09-03 10:47:35

## Summary
- kilocode: 83 commits, 361 files changed
- opencode: 14 commits, 92 files changed

## kilocode Changes (dfbf8df62..cf954237c)

### Commits

- cf954237c - Merge pull request #13735 from Kilo-Org/feat-agent-manager-update-from-base (Marius, 2026-09-03)
- cc991629a - Merge pull request #13736 from Kilo-Org/swarm-v2-guidance-13694 (Marius, 2026-09-03)
- 412d66ed4 - fix(agent-manager): queue base updates with busy child sessions (marius-kilocode, 2026-09-03)
- 40997fff9 - Merge pull request #13732 from Kilo-Org/swarm-v2-identity-13670 (Marius, 2026-09-03)
- c23758ab7 - Merge pull request #13731 from Kilo-Org/fix/completion-acknowledgement (Marius, 2026-09-03)
- e45acd845 - chore(agent-manager): resolve update-from-base merge conflict (marius-kilocode, 2026-09-03)
- 2f500b05a - fix(cli): clarify experimental board coordination (marius-kilocode, 2026-09-03)
- 5a1da6345 - feat(agent-manager): update worktrees from their saved base (marius-kilocode, 2026-09-03)
- 0145dc5ac - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-03)
- a3755edf9 - test(cli): compare stable board read history (marius-kilocode, 2026-09-03)
- 48a2e2df0 - fix: simplify board cards and complete test dependencies (marius-kilocode, 2026-09-03)
- beb84eb50 - feat: expose swarm agent identity and execution state (marius-kilocode, 2026-09-03)
- c1da52af3 - fix(vscode): separate DOM focus from session activation (marius-kilocode, 2026-09-03)
- f0da86e61 - fix(vscode): cache and bound change badge file reads (#13728) (Marius, 2026-09-03)
- 9ffe2a319 - Merge pull request #13730 from Kilo-Org/show-agent-prompt-in-permission-dialog (Marius, 2026-09-03)
- 39be7d052 - fix(vscode): skip badge cache work for excluded file sizes (marius-kilocode, 2026-09-03)
- 6afe782ca - Merge pull request #13729 from Kilo-Org/fix-cli-error (Marius, 2026-09-03)
- b2316457e - Merge pull request #13727 from Kilo-Org/support-preselected-agent-answers (Marius, 2026-09-03)
- 05ae51436 - fix(vscode): clear completion indicators when opening results (marius-kilocode, 2026-09-03)
- 0083235f7 - Merge pull request #13714 from Kilo-Org/fix-worktree-session-selection (Marius, 2026-09-03)
- 64123bc8a - fix(agent-manager): show outgoing prompts before approval (marius-kilocode, 2026-09-03)
- b8e1daece - fix(cli): keep balance errors out of the terminal (marius-kilocode, 2026-09-03)
- c378562a4 - fix: keep question defaults visible and ignore invalid labels (marius-kilocode, 2026-09-03)
- 0c72dddc8 - fix(vscode): cache and bound change badge file reads (marius-kilocode, 2026-09-03)
- ce274e676 - feat: support preselected question answers (marius-kilocode, 2026-09-03)
- cf118d048 - Merge remote-tracking branch 'origin/main' into fix-worktree-session-selection (marius-kilocode, 2026-09-03)
- 383a4b2d8 - Merge pull request #13726 from Kilo-Org/clarify-terminal-restoration-guards (Marius, 2026-09-03)
- 0aa76205f - refactor(agent-manager): clarify terminal restoration guards (marius-kilocode, 2026-09-03)
- ffc0655a1 - Merge pull request #13716 from Kilo-Org/prioritize-review-subcommand-suggestion (Marius, 2026-09-03)
- 719994281 - Merge pull request #13715 from Kilo-Org/fix-terminal-session-reuse (Marius, 2026-09-03)
- 32ef5a726 - Merge pull request #13713 from Kilo-Org/fix-single-turn-subagent-pruning (Marius, 2026-09-03)
- 05a901393 - fix(vscode): suggest worktree review first in Agent Manager (marius-kilocode, 2026-09-02)
- 54689a577 - fix(agent-manager): preserve terminal-only tab selection (marius-kilocode, 2026-09-02)
- e7f66a84e - fix(agent-manager): select nearest session after worktree deletion (marius-kilocode, 2026-09-02)
- f062b0737 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-02)
- bf7555d5a - fix(cli): prune old tool outputs in single-turn subagents (marius-kilocode, 2026-09-02)
- 97df6d445 - Merge pull request #13709 from Kilo-Org/swarm-v2-read-notices-13671 (Marius, 2026-09-02)
- bbc26e425 - fix(indexing): replace chokidar file watcher with @parcel/watcher (#12784) (Michael Avrukin, 2026-09-02)
- 53bb6dd44 - Merge pull request #13711 from Kilo-Org/swarm-v2-branding-13669 (Marius, 2026-09-02)
- 41d4bdd0c - Merge pull request #13707 from Kilo-Org/investigate-slow-worktree-deletion (Marius, 2026-09-02)
- d232c4976 - Merge pull request #13704 from Kilo-Org/investigate-stuck-subagent-permission-requests (Marius, 2026-09-02)
- 7cf7a5ed1 - feat(vscode): introduce Kilo Swarm branding (marius-kilocode, 2026-09-02)
- e7772de2c - Merge remote-tracking branch 'origin/main' into swarm-v2-read-notices-13671 (marius-kilocode, 2026-09-02)
- 162e30d23 - fix(cli): avoid stale shared-board notices after reads (marius-kilocode, 2026-09-02)
- 62fedf05a - Merge remote-tracking branch 'origin/main' into investigate-slow-worktree-deletion (marius-kilocode, 2026-09-02)
- 1aba34cc1 - Merge remote-tracking branch 'origin/main' into investigate-stuck-subagent-permission-requests (marius-kilocode, 2026-09-02)
- 785b0bcdf - Merge pull request #13708 from Kilo-Org/fix-session-activity-test-timeout (Marius, 2026-09-02)
- 307d8b60c - test(vscode): give session activity integration a 15s timeout (marius-kilocode, 2026-09-02)
- e14b4db1a - fix(agent-manager): parallelize worktree terminal cleanup (marius-kilocode, 2026-09-02)
- b391948e6 - Merge pull request #13706 from Kilo-Org/fix-second-cmd-enter-send-all-comments (Marius, 2026-09-02)
- 9a8ce09c7 - fix(vscode): send review comments on second Cmd+Enter (marius-kilocode, 2026-09-02)
- 3c049845e - fix(vscode): resolve subagent permission cards after replies (marius-kilocode, 2026-09-02)
- c278fcf41 - Merge pull request #13692 from Kilo-Org/onboarding-org-default-model (Andrea Giammarchi, 2026-09-02)
- acd3d1ff9 - fix: unify model defaults and credential precedence (webreflection, 2026-09-02)
- 9cbd9e414 - Merge pull request #13695 from Kilo-Org/chore/jetbrains-cli-pin-v7.5.9 (Kirill Kalishev, 2026-09-02)
- 8731e28a2 - Merge pull request #13697 from Kilo-Org/fix-telemetry-docs-redirect (Marius, 2026-09-02)
- 6c8efa4a9 - test(jetbrains): drop stale branch lookups from dock assertions (kirillk, 2026-09-02)
- f9cde251e - chore(jetbrains): sync bun.lock with the 7.5.9 CLI pin (kirillk, 2026-09-02)
- 52b6e8ea4 - docs(vscode): explain dialog model test harness (webreflection, 2026-09-02)
- 0b4e8409e - fix(docs): update VS Code telemetry link (marius-kilocode, 2026-09-02)
- 011fa7ddc - Merge pull request #13696 from Kilo-Org/accurate-noise (Marius, 2026-09-02)
- 7dff92b64 - Merge pull request #13629 from Kilo-Org/add-task-scoped-shared-board (Marius, 2026-09-02)
- da0fb3d6e - fix(cli): use terminal-safe diagram guidance in Ask mode (marius-kilocode, 2026-09-02)
- 2eb7a2ff3 - chore(jetbrains): bump CLI pin to v7.5.9 (kilo-maintainer[bot], 2026-09-02)
- 24b4b9fef - release: v7.5.9 (kilo-maintainer[bot], 2026-09-02)
- a6ff015f5 - release: v7.5.8 (kilo-maintainer[bot], 2026-09-02)
- bd26f60ec - Merge pull request #13684 from Kilo-Org/steep-car (Marius, 2026-09-02)
- 9cacc2678 - Merge pull request #13693 from Kilo-Org/investigate-prerelease-failure (Marius, 2026-09-02)
- 44e068c7a - test(cli): preserve pending smoke input during slow redraws (marius-kilocode, 2026-09-02)
- cf2127ef8 - fix(opencode): share session status across worktree contexts (#13685) (Igor Šćekić, 2026-09-02)
- c6a1ef1ba - test(cli): verify TUI rendering without fixed UI text (marius-kilocode, 2026-09-02)
- b77e9824b - fix: address org model selection review findings (webreflection, 2026-09-02)
- 354f58efe - Merge branch 'main' into onboarding-org-default-model (Andrea Giammarchi, 2026-09-02)
- 8c077fbee - fix(vscode): implement org-level default model selection (webreflection, 2026-09-02)
- 67f785d29 - Merge branch 'main' into steep-car (Joshua Lambert, 2026-09-01)
- 68cceca66 - fix(cli): normalize line breaks in question prompts (Josh Lambert, 2026-09-01)
- a3b1e04e0 - Merge branch 'main' into add-task-scoped-shared-board (Marius, 2026-09-01)
- 978ed7b75 - chore: merge main and resolve shared-board task completion conflict (marius-kilocode, 2026-09-01)
- 2682dcb31 - fix(cli): keep shared-board content in explicit tool reads (marius-kilocode, 2026-09-01)
- 45690f797 - chore: merge latest main into shared agent board branch (marius-kilocode, 2026-09-01)
- d38fda33e - chore: merge latest main into shared agent board branch (marius-kilocode, 2026-09-01)
- 5f9261cfe - chore: merge main into shared agent board branch (marius-kilocode, 2026-09-01)
- c0eba39ef - feat: add task-scoped shared agent boards (marius-kilocode, 2026-08-31)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+7, -2)
- `packages/opencode/src/kilocode/tool/board.ts` (+214, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+36, -3)
- `packages/opencode/src/kilocode/tool/task.ts` (+6, -0)
- `packages/opencode/src/tool/task.ts` (+4, -6)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+4, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+8, -6)
- `packages/opencode/src/kilocode/agent/index.ts` (+28, -14)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/schema.json` (+266, -2)
- `packages/core/script/kilocode/migration.ts` (+17, -0)
- `packages/core/script/migration.ts` (+24, -9)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration/20260828074139_kilocode_board.ts` (+49, -0)
- `packages/core/src/database/schema.gen.ts` (+38, -0)
- `packages/core/src/kilocode/board/sql.ts` (+36, -0)
- `packages/core/src/kilocode/pty/smoke.ts` (+0, -91)
- `packages/core/src/v1/config/config.ts` (+3, -0)
- `packages/core/test/kilocode/board/migration.test.ts` (+61, -0)
- `packages/core/test/kilocode/config-shared-agent-board.test.ts` (+22, -0)
- `packages/core/test/kilocode/pty-smoke.test.ts` (+0, -53)

#### Other Changes
- `.changeset/agent-manager-browser-context.md` (+0, -6)
- `.changeset/agent-manager-json-tasks.md` (+0, -5)
- `.changeset/agent-manager-prompt-preview.md` (+6, -0)
- `.changeset/agent-manager-terminal-default.md` (+0, -5)
- `.changeset/agent-manager-update-from-base.md` (+5, -0)
- `.changeset/claude-code-session-import-endpoint.md` (+0, -5)
- `.changeset/clear-completed-indicator-on-focus.md` (+5, -0)
- `.changeset/cli-ask-plain-text-diagrams.md` (+5, -0)
- `.changeset/compact-finished-background-agents.md` (+0, -5)
- `.changeset/edit-queued-messages.md` (+0, -6)
- `.changeset/env-details-separator.md` (+0, -5)
- `.changeset/fast-session-forks.md` (+0, -6)
- `.changeset/fast-worktree-terminal-cleanup.md` (+5, -0)
- `.changeset/fix-background-agents-chevron.md` (+0, -5)
- `.changeset/fix-board-read-notices.md` (+5, -0)
- `.changeset/fix-browser-runtime-packaging.md` (+0, -5)
- `.changeset/fix-review-comment-shortcut.md` (+5, -0)
- `.changeset/fix-single-turn-subagent-pruning.md` (+5, -0)
- `.changeset/fix-subagent-permission-replies.md` (+5, -0)
- `.changeset/fix-subagent-selection-defaults.md` (+0, -5)
- `.changeset/fix-subagent-tab-activity.md` (+0, -5)
- `.changeset/fix-windows-worktree-cleanup.md` (+0, -5)
- `.changeset/headless-session-drain.md` (+0, -6)
- `.changeset/idle-stopped-sessions.md` (+0, -6)
- `.changeset/improve-background-agent-control.md` (+0, -7)
- `.changeset/invalid-tool-repair-surfaces-real-name.md` (+0, -5)
- `.changeset/jetbrains-actions-during-indexing.md` (+0, -5)
- `.changeset/jetbrains-agent-manager-zoom-scaling.md` (+0, -5)
- `.changeset/jetbrains-custom-provider-env-var-models.md` (+0, -5)
- `.changeset/jetbrains-diff-empty-state-centered.md` (+0, -5)
- `.changeset/jetbrains-force-migration-rerun.md` (+0, -5)
- `.changeset/jetbrains-gh-focus-freshness.md` (+0, -5)
- `.changeset/jetbrains-gh-rate-limit.md` (+0, -5)
- `.changeset/jetbrains-gh-sync-on-focus.md` (+0, -5)
- `.changeset/jetbrains-github-integration-toggle.md` (+0, -5)
- `.changeset/jetbrains-inline-code-urls.md` (+0, -5)
- `.changeset/jetbrains-mermaid-all-diagrams.md` (+0, -5)
- `.changeset/jetbrains-mode-switch-cancels-sessions.md` (+0, -9)
- `.changeset/jetbrains-onboarding-framework.md` (+0, -5)
- `.changeset/jetbrains-rename-popup-polish.md` (+0, -5)
- `.changeset/jetbrains-session-context-menu.md` (+0, -5)
- `.changeset/jetbrains-split-mode-run-configs.md` (+0, -5)
- `.changeset/jetbrains-uncommitted-changes-badge.md` (+0, -5)
- `.changeset/jetbrains-worktree-copy-actions.md` (+0, -5)
- `.changeset/jetbrains-worktree-header-run-dropdown.md` (+0, -5)
- `.changeset/jetbrains-worktree-popup-dwell.md` (+0, -5)
- `.changeset/jetbrains-worktree-popup-pr-only.md` (+0, -5)
- `.changeset/jetbrains-worktree-review-checks.md` (+0, -5)
- `.changeset/jetbrains-worktree-row-popup.md` (+0, -5)
- `.changeset/jetbrains-worktree-run-configs.md` (+0, -5)
- `.changeset/jetbrains-worktree-setup-script.md` (+0, -5)
- `.changeset/jetbrains-worktree-uncommitted-badge.md` (+0, -5)
- `.changeset/keep-inspector-open-on-state-refresh.md` (+0, -5)
- `.changeset/kilo-indexing-file-watcher.md` (+5, -0)
- `.changeset/last-commit-diff-viewer.md` (+0, -5)
- `.changeset/mobile-instance-metadata.md` (+0, -5)
- `.changeset/open-background-agents.md` (+0, -5)
- `.changeset/org-default-model-selection.md` (+7, -0)
- `.changeset/question-default-answer.md` (+7, -0)
- `.changeset/question-output-font.md` (+0, -5)
- `.changeset/quiet-badge-scans.md` (+5, -0)
- `.changeset/quiet-balance-errors.md` (+6, -0)
- `.changeset/quiet-bash-permissions.md` (+0, -5)
- `.changeset/quiet-worktrees-refuse-conflicts.md` (+0, -5)
- `.changeset/remember-subagent-panel.md` (+0, -5)
- `.changeset/review-worktree-first.md` (+5, -0)
- `.changeset/roo-import-only.md` (+0, -5)
- `.changeset/shared-agent-board.md` (+13, -0)
- `.changeset/smooth-background-agent-spinner.md` (+0, -5)
- `.changeset/subagent-task-header.md` (+0, -5)
- `.changeset/swarm-agent-identity.md` (+7, -0)
- `.changeset/swarm-collaboration-guidance.md` (+5, -0)
- `.changeset/task-model-selection.md` (+0, -7)
- `.changeset/terminal-cli-activity.md` (+0, -6)
- `.changeset/terminal-only-tab-restore.md` (+5, -0)
- `.changeset/tidy-prompt-bottom.md` (+0, -5)
- `.changeset/tui-about-dialog.md` (+0, -5)
- `.changeset/worktree-deletion-selection.md` (+5, -0)
- `.github/workflows/test.yml` (+3, -2)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+34, -34)
- `nix/hashes.json` (+4, -4)
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
- `packages/kilo-docs/pages/automate/agent-manager.md` (+8, -0)
- `packages/kilo-docs/pages/code-with-ai/features/message-feedback.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+18, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/agent-messages-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/agent-messages-chromium-linux.png` (+3, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/models.ts` (+1, -2)
- `packages/kilo-gateway/src/api/profile.ts` (+16, -8)
- `packages/kilo-gateway/test/api/models.test.ts` (+31, -3)
- `packages/kilo-gateway/test/api/profile.test.ts` (+52, -2)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+2, -2)
- `packages/kilo-indexing/src/indexing/constants/index.ts` (+2, -0)
- `packages/kilo-indexing/src/indexing/processors/file-watcher.ts` (+223, -41)
- `packages/kilo-indexing/src/indexing/shared/load-ignore.ts` (+70, -2)
- `packages/kilo-indexing/test/kilocode/indexing/processors/file-watcher.test.ts` (+323, -4)
- `packages/kilo-indexing/test/kilocode/indexing/shared/load-ignore.test.ts` (+35, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+67, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+6, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/basic-tool.css` (+120, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+128, -12)
- `packages/kilo-vscode/CHANGELOG.md` (+61, -0)
- `packages/kilo-vscode/package.json` (+7, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+46, -7)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+3, -3)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+2, -14)
- `packages/kilo-vscode/src/agent-manager/base-update.ts` (+101, -0)
- `packages/kilo-vscode/src/agent-manager/git-stats-snapshot.ts` (+35, -11)
- `packages/kilo-vscode/src/agent-manager/project/state-gate.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/pty-cleanup.ts` (+12, -7)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+1, -0)
- `packages/kilo-vscode/src/extension.ts` (+3, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+2, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/auth.ts` (+4, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/permission-handler.ts` (+23, -14)
- `packages/kilo-vscode/src/provider-actions.ts` (+26, -4)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+57, -1)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+56, -0)
- `packages/kilo-vscode/tests/fixtures/question-dock-disposal.tsx` (+77, -0)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+677, -24)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-focus.test.ts` (+17, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-selection-actions.test.ts` (+106, -1)
- `packages/kilo-vscode/tests/unit/base-update.test.ts` (+221, -0)
- `packages/kilo-vscode/tests/unit/config-scope.test.ts` (+15, -0)
- `packages/kilo-vscode/tests/unit/config-utils.test.ts` (+12, -0)
- `packages/kilo-vscode/tests/unit/connection-service-question.test.ts` (+27, -0)
- `packages/kilo-vscode/tests/unit/git-stats-snapshot.test.ts` (+103, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-acknowledgement.test.ts` (+244, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-catalog.test.ts` (+264, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+14, -4)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+3, -2)
- `packages/kilo-vscode/tests/unit/model-selection.test.ts` (+107, -5)
- `packages/kilo-vscode/tests/unit/native-tab-title.test.ts` (+5, -1)
- `packages/kilo-vscode/tests/unit/new-worktree-dialog-sandbox.test.ts` (+234, -0)
- `packages/kilo-vscode/tests/unit/next-selection-after-delete.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/permission-recovery.test.ts` (+41, -13)
- `packages/kilo-vscode/tests/unit/presence-registration-contract.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/provider-actions-save.test.ts` (+132, -0)
- `packages/kilo-vscode/tests/unit/pty-cleanup.test.ts` (+81, -8)
- `packages/kilo-vscode/tests/unit/section-helpers.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/session-activity.test.ts` (+13, -0)
- `packages/kilo-vscode/tests/unit/session-model-store.test.ts` (+94, -0)
- `packages/kilo-vscode/tests/unit/session-provider-activity.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+77, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+41, -23)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+14, -22)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+43, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+9, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/SubagentPanel.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/focus.ts` (+7, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/navigate.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/new-worktree-models.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/local-tabs.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/section-helpers.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/selection-actions.ts` (+19, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/update-from-base.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-annotations.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-setup.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+17, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+23, -3)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/context/model-selection.ts` (+25, -30)
- `packages/kilo-vscode/webview-ui/src/context/provider.tsx` (+35, -9)
- `packages/kilo-vscode/webview-ui/src/context/session-model-store.ts` (+26, -11)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+112, -122)
- `packages/kilo-vscode/webview-ui/src/context/vscode.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+4, -4)
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
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+76, -0)
- `packages/kilo-vscode/webview-ui/src/stories/history.stories.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/styles/permission-dock.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/questions.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/utils/session-activity.ts` (+2, -2)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+55, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/run/footer.question.tsx` (+23, -3)
- `packages/opencode/src/cli/cmd/run/question.shared.ts` (+21, -7)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+1, -1)
- `packages/opencode/src/kilocode/board/context.ts` (+90, -0)
- `packages/opencode/src/kilocode/board/notice.ts` (+25, -0)
- `packages/opencode/src/kilocode/board/store.ts` (+716, -0)
- `packages/opencode/src/kilocode/cli/cmd/pty-smoke.ts` (+120, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/vt/vt-screen.ts` (+4, -2)
- `packages/opencode/src/kilocode/provider/catalog.ts` (+50, -0)
- `packages/opencode/src/kilocode/provider/provider.ts` (+21, -0)
- `packages/opencode/src/kilocode/question/index.ts` (+17, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilo-gateway.ts` (+1, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+11, -3)
- `packages/opencode/src/provider/model-cache.ts` (+6, -12)
- `packages/opencode/src/provider/models.ts` (+7, -4)
- `packages/opencode/src/provider/provider.ts` (+4, -1)
- `packages/opencode/src/question/index.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/config.ts` (+14, -8)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+23, -2)
- `packages/opencode/src/session/compaction.ts` (+7, -1)
- `packages/opencode/src/session/message-v2.ts` (+6, -2)
- `packages/opencode/src/session/prompt.ts` (+23, -7)
- `packages/opencode/src/session/status.ts` (+68, -0)
- `packages/opencode/src/session/tools.ts` (+23, -20)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+21, -5)
- `packages/opencode/test/kilocode/board-context.test.ts` (+520, -0)
- `packages/opencode/test/kilocode/board-live.test.ts` (+573, -0)
- `packages/opencode/test/kilocode/board-tools.test.ts` (+396, -0)
- `packages/opencode/test/kilocode/board/store.test.ts` (+721, -0)
- `packages/opencode/test/kilocode/cli/cmd/run/question-default.test.tsx` (+155, -0)
- `packages/opencode/test/kilocode/kilo-loader-auth.test.ts` (+238, -23)
- `packages/opencode/test/kilocode/model-cache-org.test.ts` (+267, -4)
- `packages/opencode/test/kilocode/provider-saved-auth.test.ts` (+311, -1)
- `packages/opencode/test/kilocode/pty-smoke.test.ts` (+76, -0)
- `packages/opencode/test/kilocode/question-normalize.test.ts` (+123, -0)
- `packages/opencode/test/kilocode/question-option-schema.test.ts` (+14, -1)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/server/kilo-gateway-statuses.test.ts` (+136, -4)
- `packages/opencode/test/kilocode/server/prompt-training-model-filter.test.ts` (+190, -3)
- `packages/opencode/test/kilocode/server/provider-auth-failure.test.ts` (+307, -0)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+55, -0)
- `packages/opencode/test/kilocode/session-pruning.test.ts` (+311, -0)
- `packages/opencode/test/kilocode/system-prompt.test.ts` (+34, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+11, -0)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+85, -55)
- `packages/opencode/test/kilocode/vt-screen.test.ts` (+21, -0)
- `packages/opencode/test/session/status.test.ts` (+120, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/schema/src/v1/question.ts` (+8, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+6, -0)
- `packages/sdk/openapi.json` (+10, -0)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/routes/session/question.tsx` (+9, -3)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/i18n/ar.ts` (+7, -0)
- `packages/ui/src/i18n/az.ts` (+9, -0)
- `packages/ui/src/i18n/br.ts` (+9, -0)
- `packages/ui/src/i18n/bs.ts` (+7, -0)
- `packages/ui/src/i18n/da.ts` (+9, -0)
- `packages/ui/src/i18n/de.ts` (+9, -0)
- `packages/ui/src/i18n/en.ts` (+9, -0)
- `packages/ui/src/i18n/es.ts` (+9, -0)
- `packages/ui/src/i18n/fi.ts` (+9, -0)
- `packages/ui/src/i18n/fr.ts` (+9, -0)
- `packages/ui/src/i18n/hi.ts` (+9, -0)
- `packages/ui/src/i18n/id.ts` (+9, -0)
- `packages/ui/src/i18n/it.ts` (+9, -0)
- `packages/ui/src/i18n/ja.ts` (+7, -0)
- `packages/ui/src/i18n/ko.ts` (+7, -0)
- `packages/ui/src/i18n/nl.ts` (+9, -0)
- `packages/ui/src/i18n/no.ts` (+9, -0)
- `packages/ui/src/i18n/pa.ts` (+9, -0)
- `packages/ui/src/i18n/pl.ts` (+7, -0)
- `packages/ui/src/i18n/ru.ts` (+7, -0)
- `packages/ui/src/i18n/sv.ts` (+9, -0)
- `packages/ui/src/i18n/th.ts` (+7, -0)
- `packages/ui/src/i18n/tr.ts` (+7, -0)
- `packages/ui/src/i18n/uk.ts` (+7, -0)
- `packages/ui/src/i18n/ur.ts` (+9, -0)
- `packages/ui/src/i18n/vi.ts` (+9, -0)
- `packages/ui/src/i18n/zh.ts` (+7, -0)
- `packages/ui/src/i18n/zht.ts` (+7, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ddb81f008..2819dbc92 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.5.6",
+  "version": "7.5.9",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/schema.json
```diff
diff --git a/packages/core/schema.json b/packages/core/schema.json
index f5811f4a8..2433b7f3f 100644
--- a/packages/core/schema.json
+++ b/packages/core/schema.json
@@ -1,9 +1,9 @@
 {
   "version": "7",
   "dialect": "sqlite",
-  "id": "08cfecbf-f95d-404b-a76a-2afc564baa8b",
+  "id": "fcf518b9-c8bc-4ee5-8e68-2608bffcef43",
   "prevIds": [
-    "f14a9b18-8207-487e-a3d3-227e629ba9ad"
+    "08cfecbf-f95d-404b-a76a-2afc564baa8b"
   ],
   "ddl": [
     {
@@ -38,6 +38,14 @@
       "name": "event",
       "entityType": "tables"
     },
+    {
+      "name": "kilo_board_message",
+      "entityType": "tables"
+    },
+    {
+      "name": "kilo_board",
+      "entityType": "tables"
+    },
     {
       "name": "permission",
       "entityType": "tables"
@@ -542,6 +550,196 @@
       "entityType": "columns",
       "table": "event"
     },
+    {
+      "type": "text",
+      "notNull": false,
+      "autoincrement": false,
+      "default": null,
+      "generated": null,
+      "name": "id",
+      "entityType": "columns",
+      "table": "kilo_board_message"
+    },
+    {
+      "type": "text",
+      "notNull": true,
+      "autoincrement": false,
+      "default": null,
```

#### packages/core/script/kilocode/migration.ts
```diff
diff --git a/packages/core/script/kilocode/migration.ts b/packages/core/script/kilocode/migration.ts
new file mode 100644
index 000000000..3d1ebbe95
--- /dev/null
+++ b/packages/core/script/kilocode/migration.ts
@@ -0,0 +1,17 @@
+function board(name: string) {
+  return name === "kilocode_board" || name.endsWith("_kilocode_board")
+}
+
+export function file(name: string, value: string) {
+  return board(name) ? `// kilocode_change - new file\n${value}` : value
+}
+
+export function block(name: string | undefined, source: string, value: string) {
+  return (name !== undefined && board(name)) || /kilo_board(?:_message)?/.test(source)
+    ? `// kilocode_change start\n${value}\n// kilocode_change end`
+    : value
+}
+
+export function line(name: string, value: string) {
+  return board(name) ? `${value} // kilocode_change` : value
+}
```

#### packages/core/script/migration.ts
```diff
diff --git a/packages/core/script/migration.ts b/packages/core/script/migration.ts
index 4f383f5f8..f6980beef 100644
--- a/packages/core/script/migration.ts
+++ b/packages/core/script/migration.ts
@@ -6,6 +6,9 @@ import os from "os"
 import path from "path"
 import { pathToFileURL } from "url"
 import { parseArgs } from "util"
+// kilocode_change start
+import { block, file, line } from "./kilocode/migration"
+// kilocode_change end
 
 const root = path.resolve(import.meta.dirname, "../../..")
 const snapshot = path.join(root, "packages/core/schema.json")
@@ -125,18 +128,23 @@ async function typescriptMigrations() {
 }
 
 function renderMigration(name: string, sql: string) {
-  return `import { Effect } from "effect"
+  // kilocode_change start
+  return file(
+    name,
+    `import { Effect } from "effect"
 import type { DatabaseMigration } from "../migration"
 
 export default {
   id: ${JSON.stringify(name)},
   up(tx) {
     return Effect.gen(function* () {
-${renderStatements(sql)}
+${renderStatements(sql, name)}
     })
   },
 } satisfies DatabaseMigration.Migration
-`
+`,
+  )
+  // kilocode_change end
 }
 
 function renderSchema(sql: string) {
@@ -153,20 +161,25 @@ ${renderStatements(sql)}
 `
 }
 
-function renderStatements(sql: string) {
+// kilocode_change start
+function renderStatements(sql: string, name?: string) {
   return sql
     .split("--> statement-breakpoint")
```

#### packages/core/src/database/migration.gen.ts
```diff
diff --git a/packages/core/src/database/migration.gen.ts b/packages/core/src/database/migration.gen.ts
index bd0c9850d..c293cc5e2 100644
--- a/packages/core/src/database/migration.gen.ts
+++ b/packages/core/src/database/migration.gen.ts
@@ -41,5 +41,6 @@ export const migrations = (
     import("./migration/20260622170816_reset_v2_session_state"),
     import("./migration/20260622202450_simplify_session_input"),
     import("./migration/20260714141136_session-message-legacy-writer-compat"),
+    import("./migration/20260828074139_kilocode_board"), // kilocode_change
   ])
 ).map((module) => module.default) satisfies DatabaseMigration.Migration[]
```


*... and more files (showing first 5)*

## opencode Changes (69c172e..f12e14c)

### Commits

- f12e14c - fix(app): identify desktop in Console device auth (v1) (#47000) (opencode-agent[bot], 2026-09-03)
- b578b72 - fix(app): increase open-in icon size (#46540) (David Hill, 2026-09-03)
- bbe4c95 - docs: add Eden AI to the providers list (#43386) (Victor M. SMITH, 2026-09-02)
- 3a9d4e7 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-02)
- 8d1f891 - chore: bump gitlab-ai-provider to 6.13.0 (#46914) (Vladimir Glafirov, 2026-09-02)
- 0502833 - sync release versions for v1.18.27 (opencode, 2026-09-02)
- b046973 - fix(opencode): default header timeout to five minutes (#46903) (Aiden Cline, 2026-09-02)
- 4eb29a6 - fix(opencode): default chunk timeout to five minutes (#46890) (Aiden Cline, 2026-09-02)
- 68abdce - fix(opencode): let config opt out of Anthropic thinking blockBinding (#46820) (Darien Kindlund, 2026-09-02)
- ef27925 - fix(console): restore migrated inference proxy requests (#46854) (Victor Navarro, 2026-09-02)
- 9a71624 - fix(provider): scope thinking binding to Claude 5.1+ (#46848) (Aiden Cline, 2026-09-02)
- ffbdee7 - chore: generate (opencode-agent[bot], 2026-09-02)
- 77aec36 - feat(console): add Muse Spark 1.3 and Gemini 3.8 Flash (#46836) (Jack, 2026-09-03)
- 50efc05 - feat(console): keep migrated teams on the new Console (#46830) (Victor Navarro, 2026-09-02)

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
- `packages/core/package.json` (+2, -2)
- `packages/core/src/v1/config/provider.ts` (+9, -4)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+31, -31)
- `infra/console.ts` (+10, -0)
- `nix/hashes.json` (+4, -4)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/dialog-connect-provider.tsx` (+7, -0)
- `packages/app/src/components/session/open-in-app-v2.tsx` (+4, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/limits-graph.tsx` (+2, -2)
- `packages/console/app/src/context/auth.ts` (+18, -1)
- `packages/console/app/src/lib/inference-proxy.ts` (+55, -0)
- `packages/console/app/src/lib/request-country.ts` (+6, -1)
- `packages/console/app/src/middleware.ts` (+9, -1)
- `packages/console/app/src/routes/go/index.css` (+1, -1)
- `packages/console/app/src/routes/go/index.tsx` (+8, -0)
- `packages/console/app/src/routes/workspace/[id]/billing/reload-section.tsx` (+19, -15)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -0)
- `packages/console/app/src/routes/workspace/[id]/model-section.tsx` (+1, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+2, -6)
- `packages/console/app/src/routes/zen/util/trainingConsent.ts` (+3, -0)
- `packages/console/app/test/museSparkPolicy.test.ts` (+31, -0)
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
- `packages/opencode/package.json` (+2, -2)
- `packages/opencode/src/provider/provider.ts` (+2, -2)
- `packages/opencode/src/provider/transform.ts` (+28, -12)
- `packages/opencode/test/provider/header-timeout.test.ts` (+78, -5)
- `packages/opencode/test/provider/transform.test.ts` (+172, -17)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+6, -3)
- `packages/sdk/openapi.json` (+12, -3)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/bs/go.mdx` (+7, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/config.mdx` (+3, -2)
- `packages/web/src/content/docs/da/go.mdx` (+7, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/de/go.mdx` (+7, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/es/go.mdx` (+7, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/fr/go.mdx` (+7, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/go.mdx` (+7, -0)
- `packages/web/src/content/docs/it/go.mdx` (+7, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/ja/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/ko/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/nb/go.mdx` (+7, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/pl/go.mdx` (+7, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/providers.mdx` (+48, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+7, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/ru/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/th/go.mdx` (+7, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/tr/go.mdx` (+7, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+7, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+6, -0)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+7, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+6, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index b1f79b2..3409dbd 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.26",
+  "version": "1.18.27",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ce620bc..0dbf20f 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.26",
+  "version": "1.18.27",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -108,7 +108,7 @@
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
-    "gitlab-ai-provider": "6.12.1",
+    "gitlab-ai-provider": "6.13.0",
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "gray-matter": "4.0.3",
```

#### packages/core/src/v1/config/provider.ts
```diff
diff --git a/packages/core/src/v1/config/provider.ts b/packages/core/src/v1/config/provider.ts
index f860a2b..5b6a813 100644
--- a/packages/core/src/v1/config/provider.ts
+++ b/packages/core/src/v1/config/provider.ts
@@ -108,15 +108,20 @@ export const Info = Schema.Struct({
         headerTimeout: Schema.optional(
           Schema.Union([PositiveInt, Schema.Literal(false)]).annotate({
             description:
-              "Timeout in milliseconds to wait for response headers. Provider integrations may set defaults. Set to false to disable timeout.",
+              "Timeout in milliseconds to wait for response headers (default: 300000). Set to false to disable timeout.",
           }),
         ).annotate({
           description:
-            "Timeout in milliseconds to wait for response headers. Provider integrations may set defaults. Set to false to disable timeout.",
+            "Timeout in milliseconds to wait for response headers (default: 300000). Set to false to disable timeout.",
         }),
-        chunkTimeout: Schema.optional(PositiveInt).annotate({
+        chunkTimeout: Schema.optional(
+          Schema.Union([PositiveInt, Schema.Literal(false)]).annotate({
+            description:
+              "Timeout in milliseconds between streamed SSE chunks for this provider (default: 300000). If no chunk arrives within this window, the request is aborted. Set to false to disable timeout.",
+          }),
+        ).annotate({
           description:
-            "Timeout in milliseconds between streamed SSE chunks for this provider. If no chunk arrives within this window, the request is aborted.",
+            "Timeout in milliseconds between streamed SSE chunks for this provider (default: 300000). If no chunk arrives within this window, the request is aborted. Set to false to disable timeout.",
         }),
       }),
       [Schema.Record(Schema.String, Schema.Any)],
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index c21dc5b..5d77e82 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.26",
+  "version": "1.18.27",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/schema.json
- `src/core/` - review core changes from packages/core/script/kilocode/migration.ts
- `src/core/` - review core changes from packages/core/script/migration.ts
- `src/core/` - review core changes from packages/core/src/database/migration.gen.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260828074139_kilocode_board.ts
- `src/core/` - review core changes from packages/core/src/database/schema.gen.ts
- `src/core/` - review core changes from packages/core/src/kilocode/board/sql.ts
- `src/core/` - review core changes from packages/core/src/kilocode/pty/smoke.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/core/` - review core changes from packages/core/test/kilocode/board/migration.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/config-shared-agent-board.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/pty-smoke.test.ts
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/board.ts` - update based on kilocode packages/opencode/src/kilocode/tool/board.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on kilocode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
