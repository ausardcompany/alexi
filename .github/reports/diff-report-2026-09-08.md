# Upstream Changes Report
Generated: 2026-09-08 10:44:23

## Summary
- kilocode: 153 commits, 288 files changed
- opencode: 4 commits, 21 files changed

## kilocode Changes (1a5ee1882..a7a7690ca)

### Commits

- a7a7690ca - Merge pull request #13913 from Kilo-Org/investigate-removed-line-highlight-history (Marius, 2026-09-08)
- a8299141a - Merge pull request #13903 from Kilo-Org/fix-inline-pr-comment-replies (Marius, 2026-09-08)
- f48de6b35 - release: v7.5.16 (kilo-maintainer[bot], 2026-09-08)
- 2c99cd6f5 - fix(vscode): keep deletion bars visible (marius-kilocode, 2026-09-08)
- 8cf990f5a - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-08)
- c34109691 - Merge remote-tracking branch 'origin/main' into fix-inline-pr-comment-replies (marius-kilocode, 2026-09-08)
- f5e0294cc - fix(vscode): schedule PR composer after layout (marius-kilocode, 2026-09-08)
- 9c45ded6e - Merge pull request #13910 from Kilo-Org/docs/eol-deploy (Rietie, 2026-09-08)
- 74fd150c4 - Merge pull request #13908 from Kilo-Org/fix-agent-ui-vertical-offset (Marius, 2026-09-08)
- c09f23b68 - Merge pull request #13911 from Kilo-Org/fix-pr-sidebar-comment-likes (Marius, 2026-09-08)
- 296cf76ad - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-08)
- bae2c0895 - Merge origin/main into fix-agent-ui-vertical-offset (marius-kilocode, 2026-09-08)
- 4416661de - fix(vscode): support reactions on PR comment replies (marius-kilocode, 2026-09-08)
- daf594f24 - Merge remote-tracking branch 'origin/main' into fix-inline-pr-comment-replies (marius-kilocode, 2026-09-08)
- de2c63894 - docs(kilo-docs): mark Kilo Deploy end of life (Rietie, 2026-09-08)
- 28bc6b0e0 - Merge pull request #13907 from Kilo-Org/replace-github-processing-spinners (Marius, 2026-09-08)
- 2afadfe5c - Merge remote-tracking branch 'origin/main' into replace-github-processing-spinners (marius-kilocode, 2026-09-08)
- 4b4db2ffa - Merge pull request #13904 from Kilo-Org/improve-pr-review-sidebar-actions (Marius, 2026-09-08)
- c8ec81383 - test(vscode): track bounded PR comment scrolling (marius-kilocode, 2026-09-08)
- 6ec7f105b - fix(vscode): prevent webview navigation offset (marius-kilocode, 2026-09-08)
- c5db396b3 - fix(vscode): address PR review feedback (marius-kilocode, 2026-09-08)
- 9a1d6263e - refactor(agent-manager): share PR comment send logic (marius-kilocode, 2026-09-08)
- 5cdba6ee9 - fix(agent-manager): use default spinner for PR processing (marius-kilocode, 2026-09-08)
- 9f26c6dd7 - Merge pull request #13906 from Kilo-Org/investigate-worktree-tab-order-focus-offsetof (Marius, 2026-09-08)
- b2111db01 - Merge pull request #13901 from Kilo-Org/fix-open-plan-worktree-targeting (Marius, 2026-09-08)
- 39e3e7e51 - Merge pull request #13892 from Kilo-Org/fix-update-from-base (Marius, 2026-09-08)
- 44c1b1ef5 - fix(agent-manager): format PR summary labels (marius-kilocode, 2026-09-08)
- ba2bc2666 - fix(agent-manager): preserve tab focus and order (marius-kilocode, 2026-09-08)
- 437c24b4d - Merge remote-tracking branch 'origin/fix-inline-pr-comment-replies' into fix-inline-pr-comment-replies (marius-kilocode, 2026-09-08)
- ee8fd66e7 - fix(agent-manager): add missing Polish summary keys (marius-kilocode, 2026-09-08)
- df9314c79 - fix(vscode): stabilize PR review checks (marius-kilocode, 2026-09-08)
- 45d3996eb - fix(agent-manager): align PR summary translations (marius-kilocode, 2026-09-08)
- 72a46000f - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-08)
- 44febacc8 - feat(agent-manager): surface PR actions in summary (marius-kilocode, 2026-09-08)
- 99eab84a2 - feat(vscode): support inline pull request reviews (marius-kilocode, 2026-09-08)
- 325656483 - fix(vscode): scope plan opens to active session (marius-kilocode, 2026-09-08)
- 7bcd13695 - Merge pull request #13896 from esc/fix/session-list-all (Marius, 2026-09-07)
- 627501673 - fix(cli): list sessions across all projects instead of crashing (Emergency Self-Construct, 2026-09-07)
- c65dd72fb - fix(vscode): restore update-from-base requests (marius-kilocode, 2026-09-07)
- 158641251 - Merge pull request #13877 from Kilo-Org/fix-agent-manager-session-routing (Marius, 2026-09-07)
- e162cd0ae - Merge remote-tracking branch 'origin/main' into fix-agent-manager-session-routing (marius-kilocode, 2026-09-07)
- ea902b90f - Merge pull request #13890 from Kilo-Org/fix-coffee-icon-enabled-state (Marius, 2026-09-07)
- 07c3a6e99 - test(kilo-ui): wait for diff indicator styles (marius-kilocode, 2026-09-07)
- 94bf0be87 - remove plan (marius-kilocode, 2026-09-07)
- a99f63a3b - fix(vscode): clarify keep-awake indicator (marius-kilocode, 2026-09-07)
- 36a89895f - Merge pull request #13885 from Kilo-Org/fix-agent-manager-worktree-removal (Marius, 2026-09-07)
- 6f35a327a - fix(agent-manager): restore worktree removal with cmd-w (marius-kilocode, 2026-09-07)
- c65d76ea1 - Merge pull request #13881 from Kilo-Org/add-pr-comment-reactions (Marius, 2026-09-07)
- c53c48012 - Merge pull request #13883 from Kilo-Org/enable-agent-plan-opening (Marius, 2026-09-07)
- eab5422bf - Merge pull request #13810 from sylwester-liljegren/feat/selector-typeahead (Marius, 2026-09-07)
- 6e19dc0f0 - Merge pull request #13824 from Kilo-Org/chore/jetbrains-cli-pin-v7.5.15 (Kirill Kalishev, 2026-09-07)
- 0d2631a0a - Merge branch 'main' into feat/selector-typeahead (Marius, 2026-09-07)
- 2ab53df4e - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-07)
- 15041d024 - fix(vscode): share plan open dedupe (marius-kilocode, 2026-09-07)
- b0d673668 - Merge remote-tracking branch 'origin/main' into add-pr-comment-reactions (marius-kilocode, 2026-09-07)
- 3b8b546b5 - Merge branch 'main' into chore/jetbrains-cli-pin-v7.5.15 (Kirill Kalishev, 2026-09-07)
- 782b6745f - Merge pull request #13878 from Kilo-Org/compact-pr-checks-display (Marius, 2026-09-07)
- 43209aec1 - test(cli): normalize plan output path (marius-kilocode, 2026-09-07)
- c13113dcf - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-07)
- 3d4b10087 - Merge branch 'main' into chore/jetbrains-cli-pin-v7.5.15 (Kirill Kalishev, 2026-09-07)
- 3cb4226da - Merge remote-tracking branch 'origin/main' into add-pr-comment-reactions (marius-kilocode, 2026-09-07)
- 0adeb37f9 - test(cli): normalize plan path assertion (marius-kilocode, 2026-09-07)
- d662f7462 - chore(jetbrains): sync bun.lock version with package.json bump (kirillk, 2026-09-07)
- fa4c32fe4 - Merge remote-tracking branch 'origin/add-pr-comment-reactions' into add-pr-comment-reactions (marius-kilocode, 2026-09-07)
- a57bde566 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-07)
- 810ed2f9f - fix(vscode): restore failed PR reaction changes (marius-kilocode, 2026-09-07)
- 7dadba41c - Merge remote-tracking branch 'origin/main' into compact-pr-checks-display (marius-kilocode, 2026-09-07)
- 6024a76db - feat(vscode): open agent-created plans (marius-kilocode, 2026-09-07)
- 5a83057f4 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-07)
- d6fbfa343 - Merge pull request #13879 from Kilo-Org/fix-comment-collapse-toggle (Marius, 2026-09-07)
- 8dc06079f - Merge pull request #13882 from Kilo-Org/prevent-self-messaging (Marius, 2026-09-07)
- 56e72c0de - fix(vscode): reference PR check locale keys (marius-kilocode, 2026-09-07)
- 0ecd50972 - fix(vscode): address PR checks review feedback (marius-kilocode, 2026-09-07)
- 34334efd7 - fix(agent-manager): guard route recovery metadata (marius-kilocode, 2026-09-07)
- ca1d7d4a6 - Merge pull request #13880 from Kilo-Org/fix-deleted-code-line-coloring (Marius, 2026-09-07)
- 12c78c655 - Merge pull request #13875 from Kilo-Org/enhance-worktree-delete-animation (Marius, 2026-09-07)
- 4849cf06c - Merge remote-tracking branch 'origin/main' into fix-agent-manager-session-routing (marius-kilocode, 2026-09-07)
- 67baa9692 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-07)
- 4e2b7a035 - fix(cli): prevent swarm self-messages (marius-kilocode, 2026-09-07)
- 49ce54b53 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-07)
- 077c74488 - feat(vscode): add PR comment reactions (marius-kilocode, 2026-09-07)
- 311d7eeb4 - fix(vscode): keep deleted diff line numbers neutral (marius-kilocode, 2026-09-07)
- f7ba2fc48 - fix(vscode): keep PR comment headers consistent (marius-kilocode, 2026-09-07)
- 512efb661 - feat(vscode): compact pull request checks (marius-kilocode, 2026-09-07)
- a1c674ada - feat(agent-manager): route peer replies to source sessions (marius-kilocode, 2026-09-07)
- 5f284296b - Merge pull request #12974 from Kilo-Org/implement-caffeine-button (Marius, 2026-09-07)
- 098e83d4c - Merge pull request #13876 from Kilo-Org/link-agent-messages-to-source-sessions (Marius, 2026-09-07)
- 921c7cf3c - fix(agent-manager): drop the fake checkbox from worktree removal (marius-kilocode, 2026-09-07)
- 293657757 - fix(agent-manager): use compact source session action (marius-kilocode, 2026-09-07)
- a96fa5127 - fix(agent-manager): draw a legible deletion checkmark (marius-kilocode, 2026-09-07)
- 40df34966 - fix(agent-manager): stabilize source session navigation (marius-kilocode, 2026-09-07)
- 1f189229f - Merge pull request #13874 from Kilo-Org/intriguing-mail (Marius, 2026-09-07)
- d8ac96f4d - merge: update feature branch with main (marius-kilocode, 2026-09-07)
- 781225fd0 - fix(agent-manager): animate sprite check icon (marius-kilocode, 2026-09-07)
- b1742663c - feat(agent-manager): attribute cross-session messages (marius-kilocode, 2026-09-07)
- 347706441 - Merge remote-tracking branch 'origin/main' into intriguing-mail (marius-kilocode, 2026-09-07)
- 1506246f5 - feat(agent-manager): polish worktree deletion animation (marius-kilocode, 2026-09-07)
- 99a5856a2 - fix(vscode): remove missing stale worktree entries (marius-kilocode, 2026-09-07)
- 91ff1fa24 - fix(vscode): show upstream inference cost for OpenRouter BYOK sessions (#13841) (Igor Šćekić, 2026-09-07)
- c5b6ccf7d - fix(opencode): exit nonzero when run produces no assistant message (#13832) (Igor Šćekić, 2026-09-07)
- 44d723c81 - Merge pull request #13872 from Kilo-Org/fix-describe-environments-to-honour-config (Marius, 2026-09-07)
- 89b9b1f93 - Merge pull request #13867 from Kilo-Org/add-agent-feedback-for-pipeline-fixes (Marius, 2026-09-07)
- 251f2809b - feat(cli): support stdin prompts for Cloud Agent commands (#13851) (Evgeny Shurakov, 2026-09-07)
- 3cb50f4fd - Merge origin/main into add-agent-feedback-for-pipeline-fixes (marius-kilocode, 2026-09-07)
- b11d5dd37 - Merge pull request #13871 from Kilo-Org/respect-git-diff-collapse-preferences (Marius, 2026-09-07)
- a74df512a - fix(agent-manager): avoid unrelated merged PR badges (marius-kilocode, 2026-09-07)
- e6bf7fd2e - Merge pull request #13868 from Kilo-Org/optimize-large-session-loading (Marius, 2026-09-07)
- 5e41fd384 - Merge pull request #13869 from Kilo-Org/improve-safe-worktree-deletion (Marius, 2026-09-07)
- 1fbcdfabb - Merge pull request #13870 from Kilo-Org/fix-local-diff-flake (Marius, 2026-09-07)
- 217777fed - Merge pull request #13860 from Kilo-Org/agent-branch-settings (Marius, 2026-09-07)
- 225d6308f - Merge pull request #13866 from Kilo-Org/rename-pr-sidebar-agent-labels (Marius, 2026-09-07)
- c0ca9ac63 - Merge pull request #13859 from Kilo-Org/fix-update-after-model-removal (Marius, 2026-09-07)
- 4a5c40217 - fix(vscode): remove diff source duplication (marius-kilocode, 2026-09-07)
- 3ef395a01 - fix(vscode): respect Git diff collapse attributes (marius-kilocode, 2026-09-07)
- abaafbbab - refactor(vscode): trim worktree completion changes (marius-kilocode, 2026-09-07)
- 515e7d0c5 - fix(vscode): resolve CI fixture name collision (marius-kilocode, 2026-09-07)
- 8629efeb6 - chore(vscode): format prompt contract test (marius-kilocode, 2026-09-07)
- 2d9abc1f2 - Merge remote-tracking branch 'origin/improve-safe-worktree-deletion' into improve-safe-worktree-deletion (marius-kilocode, 2026-09-07)
- bba257cf8 - Merge origin/main into add-agent-feedback-for-pipeline-fixes (marius-kilocode, 2026-09-07)
- f7ab43907 - test(vscode): make local diff cache timestamps deterministic (marius-kilocode, 2026-09-07)
- 127ec8a7f - fix(vscode): avoid animating sibling worktrees (marius-kilocode, 2026-09-07)
- b8a8e4677 - test(core): keep migration order assertion stable (marius-kilocode, 2026-09-07)
- 1c955a3e8 - Merge branch 'main' of github.com-kilocode:Kilo-Org/kilocode into fix-update-after-model-removal (marius-kilocode, 2026-09-07)
- e7c8dfc93 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-07)
- 02afea904 - fix(vscode): reference conversation PR action label (marius-kilocode, 2026-09-07)
- e93006759 - fix(vscode): animate worktree completion (marius-kilocode, 2026-09-07)
- 66053ef65 - fix(session): speed up cold session loading (marius-kilocode, 2026-09-07)
- 1210261d6 - feat(vscode): add CI failure fix action (marius-kilocode, 2026-09-07)
- e9db16291 - test(vscode): isolate naming settings snapshot fixture (marius-kilocode, 2026-09-07)
- 7a9e5f15a - fix(vscode): rename PR review actions to Kilo (marius-kilocode, 2026-09-07)
- a2d40c626 - fix(agent-manager): guard explicit branch naming edge cases (marius-kilocode, 2026-09-07)
- 18e1ac429 - fix(agent-manager): preserve explicit branch names and expose naming settings (marius-kilocode, 2026-09-07)
- e608b6210 - Merge branch 'main' of github.com-kilocode:Kilo-Org/kilocode into fix-update-after-model-removal (marius-kilocode, 2026-09-07)
- 111cf3f41 - fix(vscode): preserve model for update from base (marius-kilocode, 2026-09-07)
- 4d54351af - chore(jetbrains): bump CLI pin to v7.5.15 (kilo-maintainer[bot], 2026-09-06)
- 45cf9a5a9 - fix(vscode): don't restart type-ahead search from a bare space (Sylwester Liljegren, 2026-09-05)
- ef48a50de - feat(vscode): add type-ahead focus to agent and variant selectors (Sylwester Liljegren, 2026-09-05)
- 85bc28a45 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-04)
- 30828e7fe - fix(vscode): keep multi-project toolbar controls visible (marius-kilocode, 2026-09-04)
- a12a74762 - Merge branch 'main' into implement-caffeine-button (marius-kilocode, 2026-09-04)
- 261b09aaf - refactor(vscode): minimize keep-awake to extension status tracking (marius-kilocode, 2026-09-04)
- 425a0d405 - fix(cli): preserve legacy idle events during activity tracking (marius-kilocode, 2026-09-03)
- 53819a054 - chore: reconcile latest main intro handling (marius-kilocode, 2026-09-03)
- dd7437c1e - fix(vscode): harden keep-awake activity and indicator (marius-kilocode, 2026-09-03)
- 55951bfd2 - refactor(vscode): isolate keep-awake widget state (marius-kilocode, 2026-09-03)
- 1d70347f5 - chore: merge latest main into keep-awake branch (marius-kilocode, 2026-09-03)
- a31c9117b - feat(vscode): revive opt-in keep-awake (marius-kilocode, 2026-09-03)
- e49476f43 - Merge branch 'main' into implement-caffeine-button (marius-kilocode, 2026-08-17)
- 242afc248 - fix(vscode): only caffeinate while agent sessions are running (marius-kilocode, 2026-08-07)
- 2eade2728 - test(vscode): cover keep-awake disposal (marius-kilocode, 2026-08-07)
- c151cd7fd - Merge origin/main into implement-caffeine-button (marius-kilocode, 2026-08-07)
- 4c20e5a69 - fix(vscode): clean up keep-awake shutdown (marius-kilocode, 2026-08-07)
- 822d0aab4 - feat(vscode): add cross-platform keep-awake toggle (marius-kilocode, 2026-08-07)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+37, -20)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+3, -1)
- `packages/opencode/src/kilocode/tool/open-plan.ts` (+56, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+19, -1)
- `packages/opencode/test/kilocode/tool/open-plan.test.ts` (+68, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+1, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/schema.json` (+15, -1)
- `packages/core/script/kilocode/migration.ts` (+2, -2)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration/20260907102000_kilocode_model_usage_index.ts` (+13, -0)
- `packages/core/src/database/schema.gen.ts` (+5, -0)
- `packages/core/src/session/sql.ts` (+6, -0)
- `packages/core/test/kilocode/board/migration.test.ts` (+1, -1)
- `packages/core/test/kilocode/model-usage-index.test.ts` (+67, -0)
- `packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts` (+213, -13)
- `packages/kilo-vscode/src/agent-manager/orchestration-domain.ts` (+16, -5)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts` (+146, -2)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts` (+34, -0)

#### Other Changes
- `.changeset/chat-input-undo.md` (+0, -5)
- `.changeset/cli-board-messages.md` (+0, -5)
- `.changeset/fast-subagent-transcripts.md` (+0, -5)
- `.changeset/fix-indexing-git-path.md` (+0, -5)
- `.changeset/fix-session-prompt-home-end.md` (+0, -5)
- `.changeset/inline-pr-comment-dates.md` (+0, -5)
- `.changeset/inline-pr-replies.md` (+7, -0)
- `.changeset/inline-pr-review-comments.md` (+0, -6)
- `.changeset/managed-worktree-target.md` (+0, -6)
- `.changeset/neutral-deleted-line-numbers.md` (+6, -0)
- `.changeset/solid-deletion-bars.md` (+0, -5)
- `.changeset/windows-cli-startup.md` (+0, -5)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+33, -33)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/markdoc/partials/deploy-eol.md` (+3, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/deploy-secure/deploy.md` (+2, -0)
- `packages/kilo-docs/pages/deploy-secure/index.md` (+2, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-with-pr-threads-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/worktree-item-grouped-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/worktree-item-pending-delete-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/icon.tsx` (+8, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+5, -3)
- `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` (+34, -1)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+1, -1)
- `packages/kilo-ui/src/pierre/index.test.ts` (+8, -2)
- `packages/kilo-ui/src/pierre/index.ts` (+7, -2)
- `packages/kilo-ui/tests/diff-indicators.spec.ts` (+57, -28)
- `packages/kilo-vscode/CHANGELOG.md` (+75, -0)
- `packages/kilo-vscode/package.json` (+6, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+23, -4)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+3, -3)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+32, -10)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+45, -10)
- `packages/kilo-vscode/src/agent-manager/base-update.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/local-diff-cache.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/local-diff.ts` (+20, -53)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+182, -21)
- `packages/kilo-vscode/src/agent-manager/pr/PRActions.ts` (+83, -11)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-types.ts` (+17, -0)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-utils.ts` (+117, -20)
- `packages/kilo-vscode/src/agent-manager/pr/mutate-comment.ts` (+78, -0)
- `packages/kilo-vscode/src/agent-manager/pr/review-actions.ts` (+281, -0)
- `packages/kilo-vscode/src/agent-manager/pr/review-context.ts` (+17, -0)
- `packages/kilo-vscode/src/agent-manager/pr/suggestion-actions.ts` (+399, -0)
- `packages/kilo-vscode/src/agent-manager/project/pollers.ts` (+5, -0)
- `packages/kilo-vscode/src/agent-manager/prompt-attribution.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/provider-lifecycle.ts` (+12, -1)
- `packages/kilo-vscode/src/agent-manager/provider-multi-version.ts` (+5, -3)
- `packages/kilo-vscode/src/agent-manager/tool-start.ts` (+8, -6)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+38, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+23, -0)
- `packages/kilo-vscode/src/diff/DiffViewerProvider.ts` (+98, -1)
- `packages/kilo-vscode/src/diff/comment-actions.ts` (+127, -0)
- `packages/kilo-vscode/src/diff/pr-poller.ts` (+15, -1)
- `packages/kilo-vscode/src/diff/shared/git-attributes.ts` (+92, -0)
- `packages/kilo-vscode/src/diff/sources/catalog.ts` (+22, -7)
- `packages/kilo-vscode/src/diff/sources/git-status.ts` (+36, -2)
- `packages/kilo-vscode/src/diff/sources/session.ts` (+7, -4)
- `packages/kilo-vscode/src/diff/sources/staged.ts` (+10, -13)
- `packages/kilo-vscode/src/diff/sources/turn.ts` (+4, -1)
- `packages/kilo-vscode/src/diff/sources/unstaged.ts` (+14, -16)
- `packages/kilo-vscode/src/extension.ts` (+52, -2)
- `packages/kilo-vscode/src/kilo-provider/config-snapshot.ts` (+7, -1)
- `packages/kilo-vscode/src/kilo-provider/message-page.ts` (+17, -0)
- `packages/kilo-vscode/src/services/caffeination/confirm.ts` (+37, -0)
- `packages/kilo-vscode/src/services/caffeination/feed.ts` (+133, -0)
- `packages/kilo-vscode/src/services/caffeination/index.ts` (+3, -0)
- `packages/kilo-vscode/src/services/caffeination/inhibitor.ts` (+212, -0)
- `packages/kilo-vscode/src/services/caffeination/service.ts` (+182, -0)
- `packages/kilo-vscode/src/shared/pr-comment-actions.ts` (+74, -0)
- `packages/kilo-vscode/src/shared/pr-patch.ts` (+79, -0)
- `packages/kilo-vscode/src/shared/review-comments.ts` (+25, -2)
- `packages/kilo-vscode/tests/chat-auto-scroll.spec.ts` (+60, -0)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+80, -29)
- `packages/kilo-vscode/tests/fixtures/caffeination-button.tsx` (+72, -0)
- `packages/kilo-vscode/tests/fixtures/comment-harness.tsx` (+107, -0)
- `packages/kilo-vscode/tests/fixtures/diff-comment-render.tsx` (+164, -0)
- `packages/kilo-vscode/tests/fixtures/pr-comments-render.tsx` (+788, -21)
- `packages/kilo-vscode/tests/fixtures/pr-review-render.tsx` (+291, -0)
- `packages/kilo-vscode/tests/fixtures/run.ts` (+56, -0)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+123, -1)
- `packages/kilo-vscode/tests/fixtures/worktree-finish.tsx` (+191, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+13, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+10, -2)
- `packages/kilo-vscode/tests/unit/agent-manager-provider-lifecycle.test.ts` (+96, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-selection-actions.test.ts` (+27, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-settings.test.ts` (+60, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-state.test.ts` (+18, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-tool-start.test.ts` (+90, -6)
- `packages/kilo-vscode/tests/unit/am-pr-status-bridge.test.ts` (+667, -7)
- `packages/kilo-vscode/tests/unit/am-pr-utils.test.ts` (+159, -5)
- `packages/kilo-vscode/tests/unit/base-update.test.ts` (+21, -0)
- `packages/kilo-vscode/tests/unit/caffeination-button.test.ts` (+36, -0)
- `packages/kilo-vscode/tests/unit/caffeination-inhibitor.test.ts` (+199, -0)
- `packages/kilo-vscode/tests/unit/caffeination.test.ts` (+248, -0)
- `packages/kilo-vscode/tests/unit/diff-comment-actions.test.ts` (+205, -0)
- `packages/kilo-vscode/tests/unit/diff-comment-render.test.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/diff-comment-target.test.ts` (+91, -0)
- `packages/kilo-vscode/tests/unit/diff-session-source.test.ts` (+18, -0)
- `packages/kilo-vscode/tests/unit/diff-turn-source.test.ts` (+18, -0)
- `packages/kilo-vscode/tests/unit/diff-viewer-provider.test.ts` (+68, -2)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+3, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+116, -2)
- `packages/kilo-vscode/tests/unit/local-diff.test.ts` (+36, -1)
- `packages/kilo-vscode/tests/unit/message-page.test.ts` (+138, -3)
- `packages/kilo-vscode/tests/unit/new-worktree-branch.test.ts` (+100, -0)
- `packages/kilo-vscode/tests/unit/open-plan.test.ts` (+67, -0)
- `packages/kilo-vscode/tests/unit/plan-exit.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/pr-actions.test.ts` (+33, -0)
- `packages/kilo-vscode/tests/unit/pr-check-feedback.test.ts` (+104, -0)
- `packages/kilo-vscode/tests/unit/pr-check-groups.test.ts` (+33, -0)
- `packages/kilo-vscode/tests/unit/pr-comments-render.test.ts` (+7, -57)
- `packages/kilo-vscode/tests/unit/pr-review-actions.test.ts` (+482, -0)
- `packages/kilo-vscode/tests/unit/pr-review-render.test.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/pr-review-request.test.ts` (+75, -0)
- `packages/kilo-vscode/tests/unit/pr-suggestion-actions.test.ts` (+516, -0)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+11, -9)
- `packages/kilo-vscode/tests/unit/provider-multi-version.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/review-comments-pr.test.ts` (+36, -0)
- `packages/kilo-vscode/tests/unit/typeahead.test.ts` (+122, -0)
- `packages/kilo-vscode/tests/unit/worktree-finish.test.ts` (+37, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+61, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+29, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/CaffeinationButton.css` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/CaffeinationButton.tsx` (+42, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanelCache.tsx` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+12, -25)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+11, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsSection.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+26, -26)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+94, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeSectionActions.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+128, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+109, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+113, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+111, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+112, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+114, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+110, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+115, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+111, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+114, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+114, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+110, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+110, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+114, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+113, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+112, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+112, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+110, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+112, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+113, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+108, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+108, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/new-worktree-branch.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRChecks.tsx` (+172, -33)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentBody.tsx` (+38, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentCard.tsx` (+177, -81)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentForm.tsx` (+433, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentMarkdown.tsx` (+52, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRComments.tsx` (+30, -47)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRConversation.tsx` (+87, -43)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRFiles.tsx` (+226, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanel.tsx` (+70, -28)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRReactions.tsx` (+97, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRSuggestion.tsx` (+128, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRSummary.tsx` (+162, -55)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-actions.ts` (+74, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-check-feedback.ts` (+72, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-check-groups.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-comment-state.ts` (+112, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-panel.css` (+269, -29)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-review-request.ts` (+57, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-types.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/review.ts` (+9, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/selection-actions.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/state.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/update-from-base.ts` (+11, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-completion.ts` (+57, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffViewerApp.tsx` (+13, -1)
- `packages/kilo-vscode/webview-ui/diff-viewer/PRCommentDiff.tsx` (+0, -4)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-open-policy.ts` (+9, -2)
- `packages/kilo-vscode/webview-ui/diff-viewer/remote-comment-renderer.tsx` (+98, -4)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-controller.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+15, -9)
- `packages/kilo-vscode/webview-ui/src/components/chat/ReviewComments.tsx` (+49, -21)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeUserMessage.tsx` (+38, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModeSwitcher.tsx` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ThinkingSelector.tsx` (+18, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+31, -26)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+20, -1)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+18, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+32, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/utils/open-plan.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/utils/typeahead.ts` (+75, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+26, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+26, -0)
- `packages/opencode/src/cli/cmd/session.ts` (+1, -1)
- `packages/opencode/src/kilocode/agent-manager/protocol.ts` (+7, -3)
- `packages/opencode/src/kilocode/board/store.ts` (+2, -0)
- `packages/opencode/src/kilocode/cli/cmd/cloud-stdin.ts` (+93, -0)
- `packages/opencode/src/kilocode/cli/cmd/cloud.ts` (+24, -25)
- `packages/opencode/src/kilocode/session/index.ts` (+17, -4)
- `packages/opencode/src/kilocode/session/model-usage.ts` (+1, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+3, -0)
- `packages/opencode/test/cli/run/run-empty.process.test.ts` (+101, -0)
- `packages/opencode/test/cli/smokes/read-only.test.ts` (+16, -0)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+85, -0)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/board-tools.test.ts` (+10, -8)
- `packages/opencode/test/kilocode/board/store.test.ts` (+29, -0)
- `packages/opencode/test/kilocode/chart-tool-gating.test.ts` (+7, -0)
- `packages/opencode/test/kilocode/cli/cloud-stdin.test.ts` (+101, -0)
- `packages/opencode/test/kilocode/help.test.ts` (+6, -0)
- `packages/opencode/test/kilocode/provider-cost.test.ts` (+105, -1)
- `packages/opencode/test/kilocode/session-model-usage.test.ts` (+61, -1)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+2, -0)
- `packages/sdk/openapi.json` (+7, -0)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `plans/pr-checks-compact-plan.md` (+119, -0)
- `script/kilocode-duplication-allowlist.json` (+0, -9)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 5696e9143..33ee44eef 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.5.15",
+  "version": "7.5.16",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/schema.json
```diff
diff --git a/packages/core/schema.json b/packages/core/schema.json
index 2433b7f3f..d6abbcb97 100644
--- a/packages/core/schema.json
+++ b/packages/core/schema.json
@@ -2231,6 +2231,20 @@
       "entityType": "indexes",
       "table": "part"
     },
+    {
+      "columns": [
+        {
+          "value": "session_id",
+          "isExpression": false
+        }
+      ],
+      "isUnique": false,
+      "where": "json_valid(\"part\".\"data\") AND json_extract(\"part\".\"data\", '$.type') = 'step-finish'",
+      "origin": "manual",
+      "name": "part_session_step_finish_idx",
+      "entityType": "indexes",
+      "table": "part"
+    },
     {
       "columns": [
         {
@@ -2457,4 +2471,4 @@
     }
   ],
   "renames": []
-}
\ No newline at end of file
+}
```

#### packages/core/script/kilocode/migration.ts
```diff
diff --git a/packages/core/script/kilocode/migration.ts b/packages/core/script/kilocode/migration.ts
index 3d1ebbe95..c4ad0ee4a 100644
--- a/packages/core/script/kilocode/migration.ts
+++ b/packages/core/script/kilocode/migration.ts
@@ -7,11 +7,11 @@ export function file(name: string, value: string) {
 }
 
 export function block(name: string | undefined, source: string, value: string) {
-  return (name !== undefined && board(name)) || /kilo_board(?:_message)?/.test(source)
+  return (name !== undefined && board(name)) || /kilo_board(?:_message)?|part_session_step_finish_idx/.test(source)
     ? `// kilocode_change start\n${value}\n// kilocode_change end`
     : value
 }
 
 export function line(name: string, value: string) {
-  return board(name) ? `${value} // kilocode_change` : value
+  return board(name) || name.endsWith("_kilocode_model_usage_index") ? `${value} // kilocode_change` : value
 }
```

#### packages/core/src/database/migration.gen.ts
```diff
diff --git a/packages/core/src/database/migration.gen.ts b/packages/core/src/database/migration.gen.ts
index c293cc5e2..c6429a33a 100644
--- a/packages/core/src/database/migration.gen.ts
+++ b/packages/core/src/database/migration.gen.ts
@@ -42,5 +42,6 @@ export const migrations = (
     import("./migration/20260622202450_simplify_session_input"),
     import("./migration/20260714141136_session-message-legacy-writer-compat"),
     import("./migration/20260828074139_kilocode_board"), // kilocode_change
+    import("./migration/20260907102000_kilocode_model_usage_index"), // kilocode_change
   ])
 ).map((module) => module.default) satisfies DatabaseMigration.Migration[]
```

#### packages/core/src/database/migration/20260907102000_kilocode_model_usage_index.ts
```diff
diff --git a/packages/core/src/database/migration/20260907102000_kilocode_model_usage_index.ts b/packages/core/src/database/migration/20260907102000_kilocode_model_usage_index.ts
new file mode 100644
index 000000000..a88e0577a
--- /dev/null
+++ b/packages/core/src/database/migration/20260907102000_kilocode_model_usage_index.ts
@@ -0,0 +1,13 @@
+import { Effect } from "effect"
+import type { DatabaseMigration } from "../migration"
+
+export default {
+  id: "20260907102000_kilocode_model_usage_index",
+  up(tx) {
+    return Effect.gen(function* () {
+      yield* tx.run(
+        `CREATE INDEX \`part_session_step_finish_idx\` ON \`part\` (\`session_id\`) WHERE json_valid("part"."data") AND json_extract("part"."data", '$.type') = 'step-finish';`,
+      )
+    })
+  },
+} satisfies DatabaseMigration.Migration
```


*... and more files (showing first 5)*

## opencode Changes (57ef382..d6855b6)

### Commits

- d6855b6 - chore: generate (opencode-agent[bot], 2026-09-08)
- eebd85f - docs(go): translate client compatibility guidance (#47901) (Jack, 2026-09-08)
- ecbc6cc - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-07)
- 0b082b0 - chore: bump gitlab-ai-provider to 6.15.0 (#47792) (Vladimir Glafirov, 2026-09-07)

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
- `nix/hashes.json` (+4, -4)
- `packages/opencode/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+38, -9)
- `packages/web/src/content/docs/bs/go.mdx` (+38, -9)
- `packages/web/src/content/docs/da/go.mdx` (+38, -9)
- `packages/web/src/content/docs/de/go.mdx` (+38, -9)
- `packages/web/src/content/docs/es/go.mdx` (+38, -9)
- `packages/web/src/content/docs/fr/go.mdx` (+38, -9)
- `packages/web/src/content/docs/it/go.mdx` (+38, -9)
- `packages/web/src/content/docs/ja/go.mdx` (+32, -6)
- `packages/web/src/content/docs/ko/go.mdx` (+32, -6)
- `packages/web/src/content/docs/nb/go.mdx` (+38, -9)
- `packages/web/src/content/docs/pl/go.mdx` (+38, -9)
- `packages/web/src/content/docs/pt-br/go.mdx` (+38, -9)
- `packages/web/src/content/docs/ru/go.mdx` (+38, -9)
- `packages/web/src/content/docs/th/go.mdx` (+32, -6)
- `packages/web/src/content/docs/tr/go.mdx` (+32, -6)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+30, -5)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+30, -5)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 47b733d..daa4c4e 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -108,7 +108,7 @@
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
-    "gitlab-ai-provider": "6.14.0",
+    "gitlab-ai-provider": "6.15.0",
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "gray-matter": "4.0.3",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/schema.json
- `src/core/` - review core changes from packages/core/script/kilocode/migration.ts
- `src/core/` - review core changes from packages/core/src/database/migration.gen.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260907102000_kilocode_model_usage_index.ts
- `src/core/` - review core changes from packages/core/src/database/schema.gen.ts
- `src/core/` - review core changes from packages/core/src/session/sql.ts
- `src/core/` - review core changes from packages/core/test/kilocode/board/migration.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/model-usage-index.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
- `src/tool/open-plan.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/open-plan.test.ts changes
- `src/tool/open-plan.ts` - update based on kilocode packages/opencode/src/kilocode/tool/open-plan.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
