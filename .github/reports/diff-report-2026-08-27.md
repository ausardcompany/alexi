# Upstream Changes Report
Generated: 2026-08-27 17:24:22

## Summary
- kilocode: 136 commits, 399 files changed
- opencode: 18 commits, 106 files changed

## kilocode Changes (24b1fa1fc..c03a20394)

### Commits

- c03a20394 - feat(remote): add directory listing and create_session directory (#13497) (Igor Šćekić, 2026-08-27)
- 5fba3ea9a - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-27)
- 78fb1b7a3 - Merge pull request #13503 from Kilo-Org/dependabot-babel-core (Andrea Giammarchi, 2026-08-27)
- 62998965e - fix(cli): dedupe plan-mode permission ruleset stacking (#13219) (matt wilkie, 2026-08-27)
- e3ff6fb90 - Merge pull request #13512 from Kilo-Org/support-worktree-references-in-prompts (Marius, 2026-08-27)
- bb20d34d3 - fix(vscode): open files from read tool headers (#12830) (Thomas Boom, 2026-08-27)
- 6bf338775 - refactor(vscode): extract worktree session selectors (marius-kilocode, 2026-08-27)
- 13a9673d0 - feat(vscode): add searchable worktree references (marius-kilocode, 2026-08-27)
- 156fb64fd - feat(cli): import cloud transcript on create_session (#13483) (Igor Šćekić, 2026-08-27)
- 1e6131b0d - Merge pull request #13476 from Kilo-Org/add-safe-snapshot-pruning (Marius, 2026-08-27)
- 6fa1cf229 - chore: merge main and preserve worktree deletion guards (marius-kilocode, 2026-08-27)
- 15c3db763 - Merge pull request #13502 from Kilo-Org/show-worktree-running-state (Marius, 2026-08-27)
- c0ab96107 - Merge pull request #13506 from Kilo-Org/prefer-array-at (Andrea Giammarchi, 2026-08-27)
- ed80a25d5 - refactor(agent-manager): clarify activity snapshot updates (marius-kilocode, 2026-08-27)
- 5ccf4774c - Merge pull request #13475 from Kilo-Org/fix-windows-git-detection-worktree (Marius, 2026-08-27)
- ee945e85c - docs: Use `Array.prototype.at(index)` instead of out-of-bounds accesses (webreflection, 2026-08-27)
- cf0a20922 - refactor(agent-manager): isolate failed deletion progress handling (marius-kilocode, 2026-08-27)
- 672f48fa9 - refactor: simplify worktree snapshot cleanup (marius-kilocode, 2026-08-27)
- 0a9237c7f - Merge branch 'main' into dependabot-babel-core (Andrea Giammarchi, 2026-08-27)
- 5a685dd04 - fix(agent-manager): handle activity review edge cases (marius-kilocode, 2026-08-27)
- dbb019c0a - fix(vscode): bound preferred Git activation wait (marius-kilocode, 2026-08-27)
- 4b6a0c03e - chore(deps-dev): bump @babel/core from 7.28.4 to 7.29.6 in /packages/opencode (webreflection, 2026-08-27)
- 38dec028b - chore(agent-manager): keep provider within merged file-size limit (marius-kilocode, 2026-08-27)
- 094ca1987 - fix(agent-manager): show background worktree activity (marius-kilocode, 2026-08-27)
- f273509a6 - Merge pull request #13499 from Kilo-Org/improve-prompt-navigator-placement (Marius, 2026-08-27)
- 67064b5df - fix(agent-manager): persist retained session relocation after worktree deletion (marius-kilocode, 2026-08-27)
- 421088864 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-27)
- fddaf5fb0 - refactor(vscode): clarify prompt rail edge intent (marius-kilocode, 2026-08-27)
- f3c426cb8 - chore(ci): remove dedicated Windows Git regression job (marius-kilocode, 2026-08-27)
- 7b8895a0e - Merge pull request #13500 from Kilo-Org/fix-streaming-scroll-race (Marius, 2026-08-27)
- c8df9c4a7 - fix(vscode): preserve streaming scroll intent (marius-kilocode, 2026-08-27)
- 97409b085 - fix(agent-manager): recover checkpoint cleanup and blocked deletion states (marius-kilocode, 2026-08-27)
- e0d08fd18 - fix(ci): annotate Windows Git regression job (marius-kilocode, 2026-08-27)
- ab03e87cc - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-27)
- 8c0a57022 - fix(vscode): reduce prompt navigator interruptions (marius-kilocode, 2026-08-27)
- 6edf1163d - Merge pull request #13493 from maphew/fix/cli-task-empty-result (Marius, 2026-08-27)
- 9eb968198 - Merge pull request #13487 from Kilo-Org/dependabot-hey-api-openapi-ts (Andrea Giammarchi, 2026-08-27)
- fcfefc4ce - Merge pull request #13498 from Kilo-Org/support-review-worktree-agent-manager (Marius, 2026-08-27)
- 6c1116dd3 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-27)
- af4d09b75 - Merge pull request #13484 from Kilo-Org/dependabot-minimatch (Andrea Giammarchi, 2026-08-27)
- 94f5998f1 - Merge pull request #13477 from Kilo-Org/fix/nanoid-security-update (Andrea Giammarchi, 2026-08-27)
- 46bd29d73 - feat(agent-manager): scope worktree reviews (marius-kilocode, 2026-08-27)
- 0c55eac65 - Merge pull request #13422 from Kilo-Org/fix-agent-manager-worktree-ownership (Marius, 2026-08-27)
- 3308bf533 - Merge pull request #13466 from Kilo-Org/investigate-connection-failures-root-cause (Marius, 2026-08-27)
- c45e7e8b4 - chore: merge upstream main into fix/cli-task-empty-result (maphew, 2026-08-27)
- d8ceabb2f - Merge pull request #13492 from Kilo-Org/jetbrains/release/v7.1.0 (Kirill Kalishev, 2026-08-26)
- e1c6340be - docs(jetbrains): edit changelog for v7.1.0 (Kirill Kalishev, 2026-08-26)
- bf7848cb4 - fix(cli): return the real subagent answer instead of an empty task result (maphew, 2026-08-26)
- f31c519fb - release(jetbrains): v7.1.0 (kilo-maintainer[bot], 2026-08-26)
- 22bdaff48 - Merge pull request #13491 from Kilo-Org/jetbrains/release/v7.1.0-rc.5 (Kirill Kalishev, 2026-08-26)
- f59742428 - docs(jetbrains): edit changelog for v7.1.0-rc.5 (Kirill Kalishev, 2026-08-26)
- 04706b7c8 - release(jetbrains): v7.1.0-rc.5 (kilo-maintainer[bot], 2026-08-26)
- ee987f61b - Merge pull request #13440 from Kilo-Org/bold-island (Kirill Kalishev, 2026-08-26)
- 87b647938 - Merge pull request #13482 from Kilo-Org/shiny-glacier (Kirill Kalishev, 2026-08-26)
- c3066e988 - fix(jetbrains): prevent worktree tab paint artifacts (kirillk, 2026-08-26)
- 87c7e946c - test(jetbrains): avoid font-sensitive dialog assertion (kirillk, 2026-08-26)
- 4e2508649 - fix(cli): restore process signal typings (kirillk, 2026-08-26)
- 36efe6a1c - fix(jetbrains): retry unanswered failed turns (kirillk, 2026-08-26)
- 99c621ee7 - release: v7.5.5 (kilo-maintainer[bot], 2026-08-26)
- 1aac872cb - Merge pull request #13478 from Kilo-Org/docs/pricing-check (Rietie, 2026-08-26)
- 85e13e59f - fix(jetbrains): detect worktree pull requests (kirillk, 2026-08-26)
- 20b594b05 - Merge pull request #13489 from Kilo-Org/fix-windows-pwsh-probe (Marius, 2026-08-26)
- 0d6f87db6 - test(jetbrains): cover retry with a slash-containing auto model id (kirillk, 2026-08-26)
- b74dc0c1b - chore: add PowerShell rollback changeset (marius-kilocode, 2026-08-26)
- a15d25359 - Revert "Merge pull request #13365 from Kilo-Org/support-configurable-powershell-shell" (marius-kilocode, 2026-08-26)
- 13a8c29a7 - fix(jetbrains): retry with the currently selected model and effort (kirillk, 2026-08-26)
- f1a0a9dda - Merge branch 'main' into dependabot-hey-api-openapi-ts (Andrea Giammarchi, 2026-08-26)
- 2a16b871a - release: v7.5.4 (kilo-maintainer[bot], 2026-08-26)
- 0a227218b - Merge remote-tracking branch 'origin/main' into shiny-glacier (kirillk, 2026-08-26)
- f9ddb78b1 - fix(security): @hey-api/openapi-ts updated due dependabot warnings (webreflection, 2026-08-26)
- 648fa0a6a - feat(jetbrains): retry failed turns from the error card (kirillk, 2026-08-26)
- 29b3315aa - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-26)
- 89b7561c1 - release: v7.5.3 (kilo-maintainer[bot], 2026-08-26)
- d20d13b06 - Merge branch 'main' into fix/nanoid-security-update (Andrea Giammarchi, 2026-08-26)
- 8aefddda9 - Merge branch 'main' into dependabot-minimatch (Andrea Giammarchi, 2026-08-26)
- b0c5bb251 - Merge pull request #13481 from Kilo-Org/fix-cli-bun-rollback (Marius, 2026-08-26)
- b269adb61 - chore: retrigger CI (marius-kilocode, 2026-08-26)
- 34b10a672 - fix(security): minimatch updated due dependabot warnings (webreflection, 2026-08-26)
- ec94fdc79 - fix(jetbrains): avoid error badges for stopped sessions (kirillk, 2026-08-26)
- cb4abf432 - chore(cli): restore Bun 1.3 build rationale (marius-kilocode, 2026-08-26)
- 42a63663b - fix(cli): roll back Bun 1.4 (marius-kilocode, 2026-08-26)
- 1c7cbe712 - test(vscode): stabilize Windows Git worktree reproduction (marius-kilocode, 2026-08-26)
- 08608e128 - fix(security): drop nanoid override from package.json (webreflection, 2026-08-26)
- 7d3f6d7bd - docs(kilo-docs): clarify pricing and processing fees (Rietie, 2026-08-26)
- 362aaad2b - Merge pull request #13474 from Kilo-Org/fix-prerelease-pty-smoke (Marius, 2026-08-26)
- 7f378414e - fix(security): nanoid updated due dependabot warnings (webreflection, 2026-08-26)
- 45202c076 - fix(agent-manager): safely clean up deleted worktree snapshots (marius-kilocode, 2026-08-26)
- 9fa0c0a99 - test(core): stabilize PTY exit ownership (marius-kilocode, 2026-08-26)
- be2ec5115 - fix(vscode): honor configured Git executable for worktrees (marius-kilocode, 2026-08-26)
- e84e232e2 - fix(cli): stabilize packaged PTY smoke test (marius-kilocode, 2026-08-26)
- 4282d1364 - Merge pull request #13472 from Kilo-Org/fix-kilo-startup-black-screen (Marius, 2026-08-26)
- 4032c3907 - Merge pull request #13470 from Kilo-Org/fix/jetbrains-deleted-session-activity-snapshot (Kirill Kalishev, 2026-08-26)
- 7b9a84f63 - fix(cli): restore terminal startup (marius-kilocode, 2026-08-26)
- 17bef7550 - fix(jetbrains): prune deleted sessions in the merged activity snapshot (kirillk, 2026-08-26)
- 96388f9e2 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-26)
- 82ec63727 - Merge pull request #13464 from Kilo-Org/fix/mermaid-security-update (Andrea Giammarchi, 2026-08-26)
- 4229f698c - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-26)
- 64c75a53a - fix(vscode): handle fragmented CLI startup output (marius-kilocode, 2026-08-26)
- fe6ef1285 - Merge pull request #13465 from Kilo-Org/fix/dompurify-security-update (Andrea Giammarchi, 2026-08-26)
- 83e27728e - fix(agent-manager): resolve live managed worktree sessions (marius-kilocode, 2026-08-26)
- e4003da9e - fix(security): Mermaid updated due dependabot warnings (webreflection, 2026-08-26)
- 4e38e0c2e - fix(security): update DOMPurify to 3.4.13 to fix dependabot warnings (webreflection, 2026-08-26)
- 3c2bc841c - Merge pull request #13463 from Kilo-Org/investigate-kilo-crowdstrike-high-cpu (Marius, 2026-08-26)
- d8815eb51 - Merge pull request #13459 from Kilo-Org/fix-worktree-session-metadata (Marius, 2026-08-26)
- d9f066556 - fix(agent-manager): harden GitHub CLI fallback and check status (marius-kilocode, 2026-08-26)
- 743fafce0 - fix(agent-manager): reduce background Git and GitHub process churn (marius-kilocode, 2026-08-26)
- ed3380ea4 - release: v7.5.0 (kilo-maintainer[bot], 2026-08-26)
- f9606d8de - fix(agent-manager): restore promoted session metadata (marius-kilocode, 2026-08-26)
- b6e6d9df8 - Merge pull request #13458 from Kilo-Org/fix-review-followup-message-spacing (Marius, 2026-08-26)
- 92ad04da4 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-26)
- b925f25a1 - fix(vscode): space review follow-up messages (marius-kilocode, 2026-08-26)
- 06bd7ef88 - Merge pull request #13457 from Kilo-Org/fix-chat-scroll-user-intent (Marius, 2026-08-26)
- c880daf76 - fix(vscode): preserve chat scroll intent (marius-kilocode, 2026-08-26)
- 6b4370b3b - Merge pull request #13456 from Kilo-Org/revert-diff-viewer-performance-fixes (Marius, 2026-08-26)
- 24cf297c8 - Revert "Merge pull request #13449 from Kilo-Org/perf/agent-manager-bulk-diff-details" (marius-kilocode, 2026-08-26)
- 472c301da - Merge pull request #13454 from Kilo-Org/evaluate-agent-manager-panel-defaults (Marius, 2026-08-26)
- 98278ab41 - Merge pull request #13453 from Kilo-Org/kilo-local-settings (Andrea Giammarchi, 2026-08-26)
- d6bc417a9 - fix(ci): skip unsupported PTY smoke targets (marius-kilocode, 2026-08-26)
- 6722ea600 - fix(vscode) Removed top level Auto-Approve permission on onboarding (webreflection, 2026-08-26)
- 3725fb488 - Merge pull request #13435 from Kilo-Org/simplify-manual-abort-warning (Marius, 2026-08-26)
- 9e04b37f7 - fix(agent-manager): surface worktree transfer abort errors (marius-kilocode, 2026-08-26)
- 80d5353fb - Merge pull request #13448 from Kilo-Org/fix-cli-errors-on-project-switching (Marius, 2026-08-26)
- cf7a0023a - Merge pull request #13450 from Kilo-Org/investigate-agent-manager-false-stops (Marius, 2026-08-26)
- f78d736e9 - Merge pull request #13449 from Kilo-Org/perf/agent-manager-bulk-diff-details (Marius, 2026-08-26)
- c479c6448 - fix(agent-manager): read project ownership once per PR error (marius-kilocode, 2026-08-26)
- 721cc33c8 - test(vscode): align shared session status fixture (marius-kilocode, 2026-08-26)
- 6a9fb70ab - fix(vscode): prevent completed sessions from staying busy (marius-kilocode, 2026-08-26)
- a2d7e689f - fix(agent-manager): preserve bulk diff fallback during refresh (marius-kilocode, 2026-08-26)
- 7834f9308 - Merge pull request #13447 from Kilo-Org/enable-concurrent-worktree-creation (Marius, 2026-08-26)
- 23abb9755 - chore(vscode): format manual interruption handling (marius-kilocode, 2026-08-26)
- 613414eb7 - fix(agent-manager): prevent false GitHub CLI warnings on project switches (marius-kilocode, 2026-08-26)
- 44395d3f2 - fix(agent-manager): batch worktree diff details (marius-kilocode, 2026-08-26)
- d2eb7273a - Merge remote-tracking branch 'origin/main' into bold-island (kirillk, 2026-08-25)
- ecb864e0f - fix(agent-manager): speed up worktree session startup (marius-kilocode, 2026-08-25)
- 67b96293c - feat(jetbrains): add From PR and From Branch tabs to New Worktree dialog (kirillk, 2026-08-25)
- f0080183f - refactor(vscode): simplify manual interruption handling (marius-kilocode, 2026-08-25)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/task.ts` (+7, -1)
- `packages/opencode/test/tool/task.test.ts` (+64, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/background-job.ts` (+1, -1)
- `packages/core/src/kilocode/powershell.ts` (+1, -19)
- `packages/core/src/shell.ts` (+1, -2)
- `packages/core/test/background-job.test.ts` (+21, -0)
- `packages/core/test/kilocode/powershell.test.ts` (+0, -120)
- `packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts` (+10, -2)
- `packages/kilo-vscode/src/agent-manager/orchestration-domain.ts` (+13, -5)
- `packages/kilo-vscode/src/agent-manager/orchestration-setup.ts` (+24, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts` (+232, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts` (+115, -1)
- `packages/sdk/js/src/v2/gen/core/bodySerializer.gen.ts` (+6, -6)
- `packages/sdk/js/src/v2/gen/core/params.gen.ts` (+5, -5)
- `packages/sdk/js/src/v2/gen/core/serverSentEvents.gen.ts` (+3, -4)
- `packages/sdk/js/src/v2/gen/core/types.gen.ts` (+1, -1)
- `packages/sdk/js/src/v2/gen/core/utils.gen.ts` (+1, -1)

#### Other Changes
- `.changeset/agent-manager-answer-action.md` (+0, -5)
- `.changeset/agent-manager-history-routing-fix.md` (+0, -5)
- `.changeset/agent-manager-history-switch-queue.md` (+0, -5)
- `.changeset/agent-manager-sessions-button.md` (+0, -5)
- `.changeset/agent-manager-settings-tab.md` (+0, -5)
- `.changeset/agent-manager-terminal-render-performance.md` (+0, -5)
- `.changeset/agent-manager-toolbar-consistency.md` (+0, -5)
- `.changeset/agent-manager-worktree-mentions.md` (+6, -0)
- `.changeset/align-slash-command-selection.md` (+0, -5)
- `.changeset/answered-questions-expanded.md` (+0, -5)
- `.changeset/background-worktree-activity.md` (+5, -0)
- `.changeset/calm-agent-manager-streams.md` (+0, -5)
- `.changeset/calm-prompt-navigator.md` (+5, -0)
- `.changeset/clear-background-task-waiting.md` (+0, -5)
- `.changeset/clear-empty-failed-turn.md` (+5, -0)
- `.changeset/copy-pr-link.md` (+0, -5)
- `.changeset/edit-preview-agent-manager.md` (+0, -5)
- `.changeset/enable-background-subagents.md` (+0, -6)
- `.changeset/explicit-agent-manager-provider.md` (+0, -6)
- `.changeset/fast-agent-manager-diffs.md` (+0, -5)
- `.changeset/fix-background-promotion-edge-cases.md` (+0, -6)
- `.changeset/fix-cli-startup-followup.md` (+0, -5)
- `.changeset/fix-max-steps-prefill.md` (+0, -5)
- `.changeset/fix-streaming-scroll-intent.md` (+5, -0)
- `.changeset/fix-sync-filter-lifecycle.md` (+0, -5)
- `.changeset/fix-vscode-server-startup-output.md` (+5, -0)
- `.changeset/fix-windows-pty-termination.md` (+0, -5)
- `.changeset/fix-windows-worktree-git.md` (+5, -0)
- `.changeset/fix-working-indicator-prompt-gap.md` (+0, -5)
- `.changeset/hey-api-security-update.md` (+5, -0)
- `.changeset/individual-background-subagent-promotion.md` (+0, -5)
- `.changeset/isolated-reasoning-streams.md` (+0, -5)
- `.changeset/jetbrains-advanced-logging.md` (+0, -5)
- `.changeset/jetbrains-agent-manager-activity-icons.md` (+0, -5)
- `.changeset/jetbrains-chat-dock-move-and-worktree-dialog.md` (+0, -5)
- `.changeset/jetbrains-chat-popup-orientation.md` (+0, -5)
- `.changeset/jetbrains-chat-pr-badge-alignment.md` (+0, -5)
- `.changeset/jetbrains-dock-idle-actions.md` (+0, -5)
- `.changeset/jetbrains-empty-recents-padding.md` (+0, -5)
- `.changeset/jetbrains-list-description-spinner-color.md` (+0, -5)
- `.changeset/jetbrains-list-refresh-selection.md` (+0, -5)
- `.changeset/jetbrains-list-selection-sync.md` (+0, -5)
- `.changeset/jetbrains-log-pattern.md` (+0, -5)
- `.changeset/jetbrains-permission-diff.md` (+0, -5)
- `.changeset/jetbrains-session-error-card-freeze.md` (+0, -5)
- `.changeset/jetbrains-session-spinner.md` (+0, -5)
- `.changeset/jetbrains-slash-completion-fast-typing.md` (+0, -5)
- `.changeset/jetbrains-stopped-session-not-an-error.md` (+5, -0)
- `.changeset/jetbrains-tool-approval-footer.md` (+0, -5)
- `.changeset/jetbrains-tool-window-tabs.md` (+0, -5)
- `.changeset/jetbrains-workflows-settings.md` (+0, -5)
- `.changeset/jetbrains-worktree-drag-reorder.md` (+0, -5)
- `.changeset/jetbrains-worktree-list-fixes.md` (+0, -5)
- `.changeset/jetbrains-worktree-pr-badge-clicks.md` (+0, -5)
- `.changeset/jetbrains-worktree-pr-detection.md` (+5, -0)
- `.changeset/jetbrains-worktree-row-icons.md` (+0, -5)
- `.changeset/jetbrains-worktree-safety.md` (+0, -5)
- `.changeset/jetbrains-worktree-session-history.md` (+0, -5)
- `.changeset/jetbrains-worktree-tab-artifacts.md` (+5, -0)
- `.changeset/keep-reasoning-output-budget.md` (+0, -5)
- `.changeset/minimatch-security-fix.md` (+7, -0)
- `.changeset/model-selector-provider-prefix.md` (+0, -5)
- `.changeset/nanoid-security-update.md` (+5, -0)
- `.changeset/open-read-tool-files.md` (+5, -0)
- `.changeset/overlay-takes-hover.md` (+0, -5)
- `.changeset/plain-worktree-headers.md` (+0, -5)
- `.changeset/plan-mode-ruleset-stacking.md` (+5, -0)
- `.changeset/prefer-powershell-7-on-windows.md` (+0, -6)
- `.changeset/prompt-input-minimum-gutter.md` (+0, -5)
- `.changeset/provider-usage-center.md` (+0, -7)
- `.changeset/prune-orphaned-worktree-snapshots.md` (+6, -0)
- `.changeset/quick-clis-rest.md` (+0, -5)
- `.changeset/quiet-badges.md` (+0, -5)
- `.changeset/quiet-editor-location-watchers.md` (+0, -5)
- `.changeset/quiet-jetbrains-workspace-errors.md` (+0, -5)
- `.changeset/quiet-manual-interruptions.md` (+0, -5)
- `.changeset/quiet-project-plugin-dependencies.md` (+0, -5)
- `.changeset/quiet-project-session-switch.md` (+0, -5)
- `.changeset/remove-model-reset.md` (+0, -5)
- `.changeset/rendered-document-inspector.md` (+0, -5)
- `.changeset/restore-undo-attachments.md` (+0, -5)
- `.changeset/retry-reasoning-only-responses.md` (+0, -5)
- `.changeset/review-agent-manager-worktrees.md` (+6, -0)
- `.changeset/review-comment-previews.md` (+0, -5)
- `.changeset/sidebar-scroll-preservation.md` (+0, -5)
- `.changeset/smooth-streaming-transcript.md` (+0, -6)
- `.changeset/stable-editor-context-prompt-prefix.md` (+0, -5)
- `.changeset/steady-agent-manager-ownership.md` (+5, -0)
- `.changeset/steady-location-keys.md` (+0, -5)
- `.changeset/subagent-session-tabs.md` (+0, -5)
- `.changeset/task-tool-empty-result.md` (+5, -0)
- `.changeset/terminal-replay-close-code.md` (+0, -5)
- `.changeset/update-bun-1-4.md` (+0, -5)
- `.changeset/wet-lemons-walk.md` (+0, -5)
- `.changeset/worktree-move-reliability.md` (+0, -5)
- `.changeset/worktree-progress-agent-row.md` (+0, -5)
- `.changeset/worktree-pty-cleanup.md` (+0, -5)
- `.github/workflows/publish.yml` (+5, -5)
- `AGENTS.md` (+1, -0)
- `CONTRIBUTING.md` (+2, -2)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+89, -115)
- `bunfig.toml` (+1, -1)
- `nix/bun.nix` (+4, -4)
- `nix/hashes.json` (+4, -4)
- `package.json` (+5, -5)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/containers/bun-node/Dockerfile` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+2, -2)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+11, -3)
- `packages/kilo-docs/pages/collaborate/enterprise/migration.md` (+1, -1)
- `packages/kilo-docs/pages/collaborate/index.md` (+1, -1)
- `packages/kilo-docs/pages/collaborate/teams/about-plans.md` (+1, -1)
- `packages/kilo-docs/pages/collaborate/teams/billing.md` (+3, -1)
- `packages/kilo-docs/pages/collaborate/teams/getting-started.md` (+1, -1)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+1, -1)
- `packages/kilo-docs/pages/gateway/usage-and-billing.md` (+2, -0)
- `packages/kilo-docs/pages/getting-started/adding-credits.md` (+6, -5)
- `packages/kilo-docs/pages/getting-started/rate-limits-and-costs.md` (+1, -1)
- `packages/kilo-docs/pnpm-lock.yaml` (+27, -14)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-left-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-right-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-many-review-comments-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-review-comments-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+2, -2)
- `packages/kilo-jetbrains/CHANGELOG.md` (+137, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendActivityManager.kt` (+5, -4)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+136, -56)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/PrResolver.kt` (+102, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendActivityManagerTest.kt` (+20, -5)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+148, -3)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/PrResolverTest.kt` (+120, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+34, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/BranchPicker.kt` (+127, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialog.kt` (+141, -116)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+30, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+121, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionState.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/TurnOutcome.kt` (+7, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/SessionOutcomeView.kt` (+54, -16)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/DialogView.kt` (+15, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+15, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerPanelTest.kt` (+73, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeControllerTest.kt` (+29, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialogTest.kt` (+159, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloSessionServiceTest.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionRetryTest.kt` (+417, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/TurnLifecycleTest.kt` (+2, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+3, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/SessionOutcomeViewTest.kt` (+117, -12)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/DialogViewTest.kt` (+27, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorktreeRpcApi.kt` (+3, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/PrUrl.kt` (+12, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+7, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+19, -6)
- `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` (+380, -4)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+15, -4)
- `packages/kilo-ui/src/hooks/scroll-user-activity.ts` (+138, -29)
- `packages/kilo-vscode/CHANGELOG.md` (+111, -0)
- `packages/kilo-vscode/docs/mercury-next-edit-testing.html` (+1, -1)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+122, -55)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+28, -33)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+10, -2)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+18, -2)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+50, -54)
- `packages/kilo-vscode/src/agent-manager/SetupScriptRunner.ts` (+1, -2)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+49, -22)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+29, -0)
- `packages/kilo-vscode/src/agent-manager/continue-in-worktree.ts` (+9, -14)
- `packages/kilo-vscode/src/agent-manager/git-import.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/git-stats-snapshot.ts` (+43, -10)
- `packages/kilo-vscode/src/agent-manager/git-transfer.ts` (+19, -13)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+11, -2)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-types.ts` (+5, -1)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-utils.ts` (+45, -5)
- `packages/kilo-vscode/src/agent-manager/project/messages.ts` (+13, -1)
- `packages/kilo-vscode/src/agent-manager/project/pollers.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/project/wiring.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/provider-lifecycle.ts` (+76, -7)
- `packages/kilo-vscode/src/agent-manager/run/service.ts` (+1, -2)
- `packages/kilo-vscode/src/agent-manager/state-recovery.ts` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+10, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-activity.ts` (+399, -0)
- `packages/kilo-vscode/src/extension.ts` (+9, -2)
- `packages/kilo-vscode/src/kilo-provider/abort.ts` (+15, -12)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+1, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.test.ts` (+27, -43)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+5, -12)
- `packages/kilo-vscode/src/services/cli-backend/explicit-abort.ts` (+33, -59)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+8, -4)
- `packages/kilo-vscode/src/services/cli-backend/server-utils.ts` (+9, -2)
- `packages/kilo-vscode/src/session-status.ts` (+3, -7)
- `packages/kilo-vscode/src/shared/work-style-presets.ts` (+0, -1)
- `packages/kilo-vscode/src/util/git-executable.ts` (+23, -0)
- `packages/kilo-vscode/src/util/powershell.ts` (+0, -33)
- `packages/kilo-vscode/src/utils.ts` (+2, -1)
- `packages/kilo-vscode/tests/chat-auto-scroll.spec.ts` (+270, -0)
- `packages/kilo-vscode/tests/fixtures/session-tab-switcher.tsx` (+9, -0)
- `packages/kilo-vscode/tests/fixtures/worktree-references.ts` (+67, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/prompt-rail.spec.ts` (+180, -0)
- `packages/kilo-vscode/tests/unit/abort.test.ts` (+3, -26)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+27, -5)
- `packages/kilo-vscode/tests/unit/agent-manager-provider-lifecycle.test.ts` (+262, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-worktree-reference.test.ts` (+300, -0)
- `packages/kilo-vscode/tests/unit/agent-project-messages.test.ts` (+16, -1)
- `packages/kilo-vscode/tests/unit/agent-project-progress.test.ts` (+31, -1)
- `packages/kilo-vscode/tests/unit/am-pr-status-bridge.test.ts` (+110, -2)
- `packages/kilo-vscode/tests/unit/am-pr-utils.test.ts` (+86, -0)
- `packages/kilo-vscode/tests/unit/continue-in-worktree.test.ts` (+28, -44)
- `packages/kilo-vscode/tests/unit/explicit-abort.test.ts` (+7, -48)
- `packages/kilo-vscode/tests/unit/gh.test.ts` (+102, -0)
- `packages/kilo-vscode/tests/unit/git-executable.test.ts` (+106, -0)
- `packages/kilo-vscode/tests/unit/git-ops.test.ts` (+19, -0)
- `packages/kilo-vscode/tests/unit/git-stats-poller.test.ts` (+149, -0)
- `packages/kilo-vscode/tests/unit/git-stats-snapshot.test.ts` (+58, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+43, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+148, -3)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+9, -0)
- `packages/kilo-vscode/tests/unit/permission-editor.test.ts` (+30, -0)
- `packages/kilo-vscode/tests/unit/powershell.test.ts` (+0, -38)
- `packages/kilo-vscode/tests/unit/project-message-ownership.test.ts` (+7, -1)
- `packages/kilo-vscode/tests/unit/project-session-busy.test.ts` (+102, -18)
- `packages/kilo-vscode/tests/unit/project-session-filter.test.ts` (+20, -1)
- `packages/kilo-vscode/tests/unit/project-sessions-live.test.ts` (+63, -0)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+35, -0)
- `packages/kilo-vscode/tests/unit/run-script-service.test.ts` (+1, -2)
- `packages/kilo-vscode/tests/unit/server-manager-utils.test.ts` (+46, -1)
- `packages/kilo-vscode/tests/unit/sidebar-position.test.ts` (+45, -0)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+28, -1)
- `packages/kilo-vscode/tests/unit/work-style-apply.test.ts` (+17, -1)
- `packages/kilo-vscode/tests/unit/work-style-presets.test.ts` (+7, -1)
- `packages/kilo-vscode/tests/unit/worktree-activity.test.ts` (+476, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+200, -1)
- `packages/kilo-vscode/tests/unit/worktree-recency.test.ts` (+74, -0)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+19, -26)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+15, -12)
- `packages/kilo-vscode/webview-ui/agent-manager/project/progress.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/session-busy.ts` (+47, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/project/session-filter.ts` (+21, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/project/sessions-live.ts` (+6, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-recency.ts` (+23, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-references.ts` (+75, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+34, -7)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptRail.tsx` (+81, -25)
- `packages/kilo-vscode/webview-ui/src/components/chat/WorktreeMentionPicker.tsx` (+59, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/PermissionEditor.tsx` (+2, -4)
- `packages/kilo-vscode/webview-ui/src/components/settings/permission-utils.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/context/vscode.tsx` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+56, -1)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+67, -10)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/sidebar-position.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+67, -1)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-dropdowns.css` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-rail.css` (+22, -4)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+9, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+56, -0)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/script/build.ts` (+9, -2)
- `packages/opencode/src/bun-compat.d.ts` (+0, -12)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+20, -4)
- `packages/opencode/src/kilo-sessions/remote-command.ts` (+26, -0)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+5, -0)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+222, -9)
- `packages/opencode/src/kilo-sessions/remote-ws.ts` (+20, -9)
- `packages/opencode/src/kilocode/background-process/index.ts` (+1, -3)
- `packages/opencode/src/kilocode/background-process/runner.ts` (+1, -3)
- `packages/opencode/src/kilocode/review/review.txt` (+43, -19)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+17, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+34, -141)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+23, -0)
- `packages/opencode/src/kilocode/server/import-cloud-session-in-process.ts` (+208, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+89, -15)
- `packages/opencode/src/kilocode/shell/shell.ts` (+1, -1)
- `packages/opencode/src/kilocode/snapshot/cleanup.ts` (+234, -0)
- `packages/opencode/src/kilocode/suggestion/tool.txt` (+3, -1)
- `packages/opencode/src/process.d.ts` (+19, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+1, -1)
- `packages/opencode/src/session/prompt.ts` (+2, -0)
- `packages/opencode/test/kilocode/plan-mode-ruleset-stacking.test.ts` (+151, -0)
- `packages/opencode/test/kilocode/review-command.test.ts` (+56, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+18, -0)
- `packages/opencode/test/kilocode/server/httpapi-snapshot-auth.test.ts` (+96, -0)
- `packages/opencode/test/kilocode/session/recover-failed-assistant.test.ts` (+191, -0)
- `packages/opencode/test/kilocode/sessions/remote-command.test.ts` (+30, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+612, -0)
- `packages/opencode/test/kilocode/sessions/remote-ws.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/snapshot-repository-cleanup.test.ts` (+510, -0)
- `packages/opencode/test/kilocode/suggestion/suggestion.test.ts` (+23, -0)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+13, -13)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+2, -2)
- `packages/sdk/js/script/build.ts` (+0, -18)
- `packages/sdk/js/src/v2/gen/client/client.gen.ts` (+124, -136)
- `packages/sdk/js/src/v2/gen/client/types.gen.ts` (+9, -5)
- `packages/sdk/js/src/v2/gen/client/utils.gen.ts` (+10, -10)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+233, -182)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+44, -38)
- `packages/sdk/openapi.json` (+78, -0)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+2, -2)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+3, -3)
- `packages/ui/src/components/list.tsx` (+1, -1)
- `patches/@ff-labs%2Ffff-bun@0.9.4.patch` (+0, -106)
- `script/upstream/package.json` (+2, -2)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 03ed5fec4..b32061e57 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.4.23",
+  "version": "7.5.5",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -77,7 +77,7 @@
     "cross-spawn": "catalog:",
     "glob": "13.0.5",
     "mime-types": "3.0.2",
-    "minimatch": "10.2.5",
+    "minimatch": "10.2.6",
     "npm-package-arg": "13.0.2",
     "rotating-file-stream": "3.2.9",
     "semver": "^7.6.3",
```

#### packages/core/src/background-job.ts
```diff
diff --git a/packages/core/src/background-job.ts b/packages/core/src/background-job.ts
index cdffd212b..285e65bf8 100644
--- a/packages/core/src/background-job.ts
+++ b/packages/core/src/background-job.ts
@@ -137,7 +137,7 @@ export const make = Effect.gen(function* () {
       if (job.info.status !== "running") return [{ info: snapshot(job) }, jobs]
       const pending = job.pending - 1
       const output =
-        Exit.isSuccess(exit) && (!job.output || sequence > job.output.sequence)
+        Exit.isSuccess(exit) && exit.value && sequence > (job.output?.sequence ?? -1) // kilocode_change - empty outputs never clobber; only the latest non-empty result wins (#13469)
           ? { sequence, text: exit.value }
           : job.output
       if (Exit.isSuccess(exit) && pending > 0) {
```

#### packages/core/src/kilocode/powershell.ts
```diff
diff --git a/packages/core/src/kilocode/powershell.ts b/packages/core/src/kilocode/powershell.ts
index 13a0e17ab..866f215e0 100644
--- a/packages/core/src/kilocode/powershell.ts
+++ b/packages/core/src/kilocode/powershell.ts
@@ -1,25 +1,7 @@
-import { statSync } from "fs"
-import path from "path"
-import { which } from "../util/which"
-
 export function args(command: string) {
   return ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", script(command)]
 }
 
-export const locations = (env: NodeJS.ProcessEnv = process.env) =>
-  [
-    env["ProgramFiles"] && path.join(env["ProgramFiles"], "PowerShell", "7"),
-    env["ProgramFiles(x86)"] && path.join(env["ProgramFiles(x86)"], "PowerShell", "7"),
-    env["LOCALAPPDATA"] && path.join(env["LOCALAPPDATA"], "Microsoft", "WindowsApps"),
-  ]
-    .filter((item): item is string => Boolean(item))
-    .map((root) => path.join(root, "pwsh.exe"))
-
-export const probe = (env: NodeJS.ProcessEnv = process.env) =>
-  locations(env).filter((file) => statSync(file, { throwIfNoEntry: false })?.isFile())
-
-export const pwsh = (env: NodeJS.ProcessEnv = process.env) => which("pwsh", env) ?? probe(env)[0]
-
 const setup = `[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false);
 [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false);
 $OutputEncoding = [Console]::OutputEncoding;
@@ -141,4 +123,4 @@ function block(command: string, start: number, open: string, close: string) {
   }
 }
 
-export const PowerShell = { args, locations, probe, pwsh }
+export const PowerShell = { args }
```

#### packages/core/src/shell.ts
```diff
diff --git a/packages/core/src/shell.ts b/packages/core/src/shell.ts
index 821e69082..f92906aeb 100644
--- a/packages/core/src/shell.ts
+++ b/packages/core/src/shell.ts
@@ -99,8 +99,7 @@ function resolve(file: string) {
 function win() {
   return Array.from(
     new Set(
-      // kilocode_change - probe known PowerShell 7 install locations so legacy 5.1 is not picked when pwsh is off PATH
-      [PowerShell.pwsh(), which("powershell"), gitbash(), process.env.COMSPEC || "cmd.exe"] // kilocode_change
+      [which("pwsh"), which("powershell"), gitbash(), process.env.COMSPEC || "cmd.exe"]
         .filter((item): item is string => Boolean(item))
         .map(full),
     ),
```

#### packages/core/test/background-job.test.ts
```diff
diff --git a/packages/core/test/background-job.test.ts b/packages/core/test/background-job.test.ts
index 5ad1e061a..8be1769c5 100644
--- a/packages/core/test/background-job.test.ts
+++ b/packages/core/test/background-job.test.ts
@@ -86,6 +86,27 @@ describe("BackgroundJob", () => {
     }).pipe(Effect.provide(jobsLayer)),
   )
 
+  // kilocode_change start - regression for #13469: an empty extended run must not clobber an earlier non-empty result
+  it.live("keeps the earlier non-empty output when an extended run returns empty", () =>
+    Effect.gen(function* () {
+      const jobs = yield* BackgroundJob.Service
+      const first = yield* Deferred.make<void>()
+      const job = yield* jobs.start({
+        type: "test",
+        run: Deferred.await(first).pipe(Effect.as("real answer")),
+      })
+
+      expect(yield* jobs.extend({ id: job.id, run: Effect.succeed("") })).toBe(true)
+
+      yield* Deferred.succeed(first, undefined)
+      expect(yield* jobs.wait({ id: job.id })).toMatchObject({
+        timedOut: false,
+        info: { status: "completed", output: "real answer" },
+      })
+    }).pipe(Effect.provide(jobsLayer)),
+  )
+  // kilocode_change end
+
   it.live("interrupts live work without promising settlement after the owning process-local scope closes", () =>
     Effect.gen(function* () {
       const scope = yield* Scope.make()
```


*... and more files (showing first 5)*

## opencode Changes (13c2759..05ea507)

### Commits

- 05ea507 - fix(console): improve Go comparison chart on mobile (#45044) (opencode-agent[bot], 2026-08-27)
- 5f5ea53 - chore: generate (opencode-agent[bot], 2026-08-27)
- 1120d07 - fix(stats): map ox alpha to glm 5.3 flash (#45542) (Adam, 2026-08-27)
- 6568a82 - fix(console): merge duplicate Go usage rows (#45503) (opencode-agent[bot], 2026-08-27)
- c2eacd7 - fix(console): secure server action redirects (#45374) (Adam, 2026-08-26)
- c5ef753 - fix(stats): align retention columns (Adam, 2026-08-26)
- 530535c - fix(stats): reduce retention query scan (Adam, 2026-08-26)
- 023620b - chore: add sst unlock workflow (Adam, 2026-08-26)
- 902e67e - feat(stats): add weekly retention (Adam, 2026-08-26)
- 830aaf2 - docs(go): add GLM-5.3-Flash (#45269) (Jack, 2026-08-26)
- a0f36c9 - feat(stats): add retention metrics (Adam, 2026-08-26)
- 1216c55 - chore: generate (opencode-agent[bot], 2026-08-26)
- ec25388 - docs: remove Ox Alpha Free (#45221) (Jack, 2026-08-26)
- c7134cb - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-26)
- ba4d0ea - fix(console): validate auth redirects (#45027) (Adam, 2026-08-26)
- 1cc5389 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-26)
- ae2ea3c - fix map inaccuracy (Frank, 2026-08-26)
- 3f31551 - fix map inaccuracy (Frank, 2026-08-26)

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
- `packages/stats/core/migrations/20260826000000_model_retention/migration.sql` (+18, -0)
- `packages/stats/core/src/database/schema.ts` (+26, -0)
- `packages/stats/core/src/domain/home.test.ts` (+48, -0)
- `packages/stats/core/src/domain/home.ts` (+108, -6)
- `packages/stats/core/src/domain/inference.test.ts` (+74, -5)
- `packages/stats/core/src/domain/inference.ts` (+168, -4)
- `packages/stats/core/src/domain/model-normalization.ts` (+4, -6)
- `packages/stats/core/src/domain/retention.ts` (+110, -0)
- `packages/stats/core/src/index.ts` (+1, -0)
- `packages/stats/core/src/runtime.ts` (+7, -3)
- `packages/stats/core/src/stat-sync.ts` (+53, -9)

#### Other Changes
- `.github/workflows/unlock.yml` (+52, -0)
- `bun.lock` (+1, -23)
- `nix/hashes.json` (+4, -4)
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
- `packages/console/app/src/lib/lite-usage.ts` (+14, -1)
- `packages/console/app/src/lib/server-action.ts` (+11, -0)
- `packages/console/app/src/middleware.ts` (+3, -0)
- `packages/console/app/src/routes/go/index.css` (+66, -0)
- `packages/console/app/src/routes/go/index.tsx` (+5, -5)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -1)
- `packages/console/app/test/liteUsage.test.ts` (+58, -0)
- `packages/console/app/test/serverAction.test.ts` (+34, -0)
- `packages/console/function/package.json` (+1, -0)
- `packages/console/function/src/auth-redirect.test.ts` (+18, -0)
- `packages/console/function/src/auth-redirect.ts` (+18, -0)
- `packages/console/function/src/auth.ts` (+13, -0)
- `packages/console/function/tsconfig.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -8)
- `packages/stats/app/src/component/model-compare-detail.tsx` (+21, -0)
- `packages/stats/app/src/i18n.ts` (+0, -4)
- `packages/stats/app/src/i18n/ar.ts` (+0, -4)
- `packages/stats/app/src/i18n/br.ts` (+0, -4)
- `packages/stats/app/src/i18n/da.ts` (+0, -4)
- `packages/stats/app/src/i18n/de.ts` (+0, -4)
- `packages/stats/app/src/i18n/es.ts` (+0, -4)
- `packages/stats/app/src/i18n/fr.ts` (+0, -4)
- `packages/stats/app/src/i18n/it.ts` (+0, -4)
- `packages/stats/app/src/i18n/ja.ts` (+0, -4)
- `packages/stats/app/src/i18n/ko.ts` (+0, -4)
- `packages/stats/app/src/i18n/no.ts` (+0, -4)
- `packages/stats/app/src/i18n/pl.ts` (+0, -4)
- `packages/stats/app/src/i18n/ru.ts` (+0, -4)
- `packages/stats/app/src/i18n/th.ts` (+0, -4)
- `packages/stats/app/src/i18n/tr.ts` (+0, -4)
- `packages/stats/app/src/i18n/uk.ts` (+0, -4)
- `packages/stats/app/src/i18n/zh.ts` (+0, -4)
- `packages/stats/app/src/i18n/zht.ts` (+0, -4)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+39, -131)
- `packages/stats/app/src/routes/geo-map.ts` (+0, -120)
- `packages/stats/app/src/routes/index.css` (+180, -123)
- `packages/stats/app/src/routes/index.tsx` (+80, -0)
- `packages/stats/app/src/routes/model-catalog.ts` (+6, -2)
- `packages/web/src/content/docs/ar/go.mdx` (+6, -7)
- `packages/web/src/content/docs/ar/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/bs/go.mdx` (+6, -7)
- `packages/web/src/content/docs/bs/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/da/go.mdx` (+6, -7)
- `packages/web/src/content/docs/da/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/de/go.mdx` (+6, -7)
- `packages/web/src/content/docs/de/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/es/go.mdx` (+6, -7)
- `packages/web/src/content/docs/es/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/fr/go.mdx` (+6, -7)
- `packages/web/src/content/docs/fr/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/go.mdx` (+6, -7)
- `packages/web/src/content/docs/it/go.mdx` (+6, -7)
- `packages/web/src/content/docs/it/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/ja/go.mdx` (+6, -7)
- `packages/web/src/content/docs/ja/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/ko/go.mdx` (+6, -7)
- `packages/web/src/content/docs/ko/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/nb/go.mdx` (+6, -7)
- `packages/web/src/content/docs/nb/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/pl/go.mdx` (+6, -7)
- `packages/web/src/content/docs/pl/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/pt-br/go.mdx` (+6, -7)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/ru/go.mdx` (+6, -7)
- `packages/web/src/content/docs/ru/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/th/go.mdx` (+6, -7)
- `packages/web/src/content/docs/th/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/tr/go.mdx` (+6, -7)
- `packages/web/src/content/docs/tr/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+6, -7)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+0, -3)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+6, -7)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+0, -3)

### Key Diffs

#### packages/stats/core/migrations/20260826000000_model_retention/migration.sql
```diff
diff --git a/packages/stats/core/migrations/20260826000000_model_retention/migration.sql b/packages/stats/core/migrations/20260826000000_model_retention/migration.sql
new file mode 100644
index 0000000..e69d7f5
--- /dev/null
+++ b/packages/stats/core/migrations/20260826000000_model_retention/migration.sql
@@ -0,0 +1,18 @@
+CREATE TABLE `model_retention` (
+	`id` bigint AUTO_INCREMENT NOT NULL,
+	`cohort_date` char(10) NOT NULL,
+	`dataset` varchar(64) NOT NULL DEFAULT 'all',
+	`tier` varchar(64) NOT NULL DEFAULT 'all',
+	`provider` varchar(128) NOT NULL,
+	`model` varchar(256) NOT NULL,
+	`eligible_users` bigint NOT NULL DEFAULT 0,
+	`retained_users` bigint NOT NULL DEFAULT 0,
+	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
+	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
+	CONSTRAINT `model_retention_id` PRIMARY KEY(`id`),
+	CONSTRAINT `uniq_model_retention_cohort` UNIQUE(`cohort_date`,`dataset`,`tier`,`provider`,`model`)
+);
+--> statement-breakpoint
+CREATE INDEX `idx_model_retention_recent` ON `model_retention` (`dataset`,`tier`,`cohort_date`);
+--> statement-breakpoint
+CREATE INDEX `idx_model_retention_model` ON `model_retention` (`model`,`cohort_date`);
```

#### packages/stats/core/src/database/schema.ts
```diff
diff --git a/packages/stats/core/src/database/schema.ts b/packages/stats/core/src/database/schema.ts
index d5bfa31..dcf8d52 100644
--- a/packages/stats/core/src/database/schema.ts
+++ b/packages/stats/core/src/database/schema.ts
@@ -107,6 +107,32 @@ export const geoStat = mysqlTable(
   ],
 )
 
+export const modelRetention = mysqlTable(
+  "model_retention",
+  {
+    id: bigint({ mode: "number" }).autoincrement().primaryKey(),
+    cohort_date: char({ length: 10 }).notNull(),
+    dataset: varchar({ length: 64 }).notNull().default("all"),
+    tier: varchar({ length: 64 }).notNull().default("all"),
+    provider: varchar({ length: 128 }).notNull(),
+    model: varchar({ length: 256 }).notNull(),
+    eligible_users: bigint({ mode: "number" }).notNull().default(0),
+    retained_users: bigint({ mode: "number" }).notNull().default(0),
+    ...timestampColumns(),
+  },
+  (table) => [
+    uniqueIndex("uniq_model_retention_cohort").on(
+      table.cohort_date,
+      table.dataset,
+      table.tier,
+      table.provider,
+      table.model,
+    ),
+    index("idx_model_retention_recent").on(table.dataset, table.tier, table.cohort_date),
+    index("idx_model_retention_model").on(table.model, table.cohort_date),
+  ],
+)
+
 function periodColumns() {
   return {
     id: bigint({ mode: "number" }).autoincrement().primaryKey(),
```

#### packages/stats/core/src/domain/home.test.ts
```diff
diff --git a/packages/stats/core/src/domain/home.test.ts b/packages/stats/core/src/domain/home.test.ts
new file mode 100644
index 0000000..3608d56
--- /dev/null
+++ b/packages/stats/core/src/domain/home.test.ts
@@ -0,0 +1,48 @@
+import { describe, expect, test } from "bun:test"
+import type { RetentionMetricRow } from "./home"
+
+process.env.SST_RESOURCE_App = JSON.stringify({ name: "opencode", stage: "test" })
+process.env.SST_RESOURCE_StatsDatabase = JSON.stringify({ url: "mysql://localhost/stats" })
+
+const { buildRetentionEntries } = await import("./home")
+
+describe("retention aggregates", () => {
+  test("pools the latest seven weekly cohorts and ranks models above the sample floor", () => {
+    const rows = [
+      ...cohorts("model-a", "provider-a", 8, 20, 10),
+      ...cohorts("model-b", "provider-b", 8, 20, 12),
+      ...cohorts("small-model", "provider-c", 8, 10, 9),
+    ]
+    const entries = buildRetentionEntries(rows)
+
+    expect(entries.find((item) => item.model === "model-a")).toMatchObject({
+      eligibleUserWeeks: 140,
+      retainedUserWeeks: 70,
+      rate: 50,
+      rank: 2,
+    })
+    expect(entries.find((item) => item.model === "model-b")).toMatchObject({
+      eligibleUserWeeks: 140,
+      retainedUserWeeks: 84,
+      rate: 60,
+      rank: 1,
+    })
+    expect(entries.find((item) => item.model === "small-model")).toMatchObject({
+      eligibleUserWeeks: 70,
+      retainedUserWeeks: 63,
+      rate: 90,
+      rank: null,
+    })
+  })
+})
+
+function cohorts(model: string, provider: string, count: number, eligibleUsers: number, retainedUsers: number) {
+  return Array.from({ length: count }, (_, index) => ({
+    cohortDate: `2026-08-${String(index + 1).padStart(2, "0")}`,
+    updatedAt: Date.UTC(2026, 7, index + 9),
+    provider,
+    model,
```

#### packages/stats/core/src/domain/home.ts
```diff
diff --git a/packages/stats/core/src/domain/home.ts b/packages/stats/core/src/domain/home.ts
index e0fd2be..d5ce1b9 100644
--- a/packages/stats/core/src/domain/home.ts
+++ b/packages/stats/core/src/domain/home.ts
@@ -5,6 +5,7 @@ import { DatabaseError } from "../database"
 import type { GeoStatMetric } from "./geo"
 import { ModelStatRepo, type ModelStatMetric } from "./model"
 import { statProvider } from "./model-normalization"
+import { isMissingRetentionTable } from "./retention"
 import { DATA_SITE_TIERS, normalizeTier } from "./stat"
 
 export type UsageProduct = "All Users" | "Zen" | "Go" | "Enterprise"
@@ -23,6 +24,15 @@ export type LeaderboardEntry = {
 export type TokenCostEntry = { model: string; total: number; input: number; output: number; cached: number }
 export type CacheRatioEntry = { model: string; ratio: number; cached: number; uncached: number; total: number }
 export type SessionCostEntry = { model: string; cost: number; tokens: number }
+export type RetentionEntry = {
+  model: string
+  provider: string
+  author: string
+  rate: number
+  eligibleUserWeeks: number
+  retainedUserWeeks: number
+  rank: number | null
+}
 export type CountryEntry = { country: string; continent: string; tokens: number; share: number; rank: number }
 export type ModelUsagePoint = { date: string; tokens: number; users: number; sessions: number; cost: number }
 export type ModelMixEntry = { label: string; tokens: number; share: number }
@@ -54,6 +64,7 @@ export type StatsModelData = {
   totalModels: number
   tokenShare: number
   tokenChange: number
+  weeklyRetention: RetentionEntry | null
   totals: {
     sessions: number
     uniqueUsers: number
@@ -94,6 +105,7 @@ export type StatsModelComparisonEntry = {
   totalModels: number
   tokenShare: number
   tokenChange: number
+  weeklyRetention: RetentionEntry | null
   totals: StatsModelData["totals"]
   usage: ModelUsagePoint[]
 }
@@ -114,6 +126,7 @@ export type StatsHomeData = {
   tokenCost: Record<TokenProduct, TokenCostEntry[]>
   cacheRatio: Record<TokenProduct, CacheRatioEntry[]>
   sessionCost: Record<TokenProduct, SessionCostEntry[]>
+  retention: RetentionEntry[]
   country: Record<UsageRange, CountryEntry[]>
```

#### packages/stats/core/src/domain/inference.test.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.test.ts b/packages/stats/core/src/domain/inference.test.ts
index ad95dad..5f7e026 100644
--- a/packages/stats/core/src/domain/inference.test.ts
+++ b/packages/stats/core/src/domain/inference.test.ts
@@ -1,5 +1,12 @@
 import { describe, expect, test } from "bun:test"
-import { buildStatsQueries, toGeoAggregate, toModelAggregate, toProviderAggregate } from "./inference"
+import {
+  buildRetentionQueries,
+  buildStatsQueries,
+  toGeoAggregate,
+  toModelAggregate,
+  toProviderAggregate,
+  toRetentionAggregate,
+} from "./inference"
 import { modelAuthor, normalizeInferenceModel, statModel, statProvider } from "./model-normalization"
 
 describe("inference stat normalization", () => {
@@ -43,14 +50,18 @@ describe("inference stat normalization", () => {
   })
 
   test("merges renamed models under their current name", () => {
-    expect(statModel("x-preview-f", "")).toBe("ox-alpha")
+    expect(statModel("x-preview-f", "")).toBe("glm-5.3-flash")
+    expect(statModel("ox-alpha", "")).toBe("glm-5.3-flash")
+    expect(statModel("ox-alpha-free", "")).toBe("glm-5.3-flash")
+    expect(statModel("big-pickle", "zhipuai/ox-alpha-free")).toBe("glm-5.3-flash")
     expect(statModel("xiaomi/mimo-v2.5", "")).toBe("mimo-v2.5")
-    expect(toModelAggregate(aggregate("x-preview-f", "openai"))).toMatchObject([
+    expect(toModelAggregate(aggregate("x-preview-f", "unknown"))).toMatchObject([
       {
-        provider: "openai",
-        model: "ox-alpha",
+        provider: "zhipu",
+        model: "glm-5.3-flash",
       },
     ])
+    expect(toProviderAggregate(aggregate("ox-alpha", "unknown"))).toMatchObject([{ provider: "zhipu" }])
   })
 
   test("model aggregates prefer provider.model and use normalized model", () => {
@@ -119,6 +130,8 @@ describe("inference stat normalization", () => {
     expect(queries[0]).toContain("COALESCE(NULLIF(lower(model_tier), ''), '') AS raw_tier")
     expect(queries[0]).toContain("WHEN lower(COALESCE(raw_tier, '')) = 'free'")
     expect(queries[0]).toContain("regexp_replace(NULLIF(route_model, ''), '^.*/', '')")
+    expect(queries[0]).toContain("= 'ox-alpha' THEN 'glm-5.3-flash'")
+    expect(queries[0]).toContain("= 'x-preview-f' THEN 'glm-5.3-flash'")
     expect(queries[0]).toContain("OR lower(raw_model) IN ('gpt-5-nano', 'grok-code', 'big-pickle')")
     expect(queries[0]).toContain("OR lower(raw_model) LIKE '%-free'")
     expect(queries[0]).toContain("THEN 'Free'")
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/background-job.ts
- `src/core/` - review core changes from packages/core/src/kilocode/powershell.ts
- `src/core/` - review core changes from packages/core/src/shell.ts
- `src/core/` - review core changes from packages/core/test/background-job.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/powershell.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-setup.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts
- `src/core/` - review core changes from packages/sdk/js/src/v2/gen/core/bodySerializer.gen.ts
- `src/core/` - review core changes from packages/sdk/js/src/v2/gen/core/params.gen.ts
- `src/core/` - review core changes from packages/sdk/js/src/v2/gen/core/serverSentEvents.gen.ts
- `src/core/` - review core changes from packages/sdk/js/src/v2/gen/core/types.gen.ts
- `src/core/` - review core changes from packages/sdk/js/src/v2/gen/core/utils.gen.ts
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
