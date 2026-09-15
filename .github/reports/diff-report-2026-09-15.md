# Upstream Changes Report
Generated: 2026-09-15 11:15:30

## Summary
- kilocode: 117 commits, 358 files changed
- opencode: 7 commits, 41 files changed

## kilocode Changes (2ad448820..9597be3a1)

### Commits

- 9597be3a1 - Merge pull request #14160 from Kilo-Org/peaceful-pickup (Marius, 2026-09-15)
- 8f3430edf - Merge pull request #14159 from Kilo-Org/supersede/speech-to-text-custom-source-13039 (Marius, 2026-09-15)
- 43d13cf78 - Merge pull request #14161 from Kilo-Org/fix/sdk-next-embedded-hosts-flake (Marius, 2026-09-15)
- 65a76d5f7 - Merge pull request #14162 from Kilo-Org/fix/link-checker-external-503 (Marius, 2026-09-15)
- 8aae5df8d - fix(ci): exclude flaky ai.google.dev links from link-checker (marius-kilocode, 2026-09-15)
- 5b629ca96 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- 875a2dea9 - fix(vscode): resolve speech-to-text source from the global config only (marius-kilocode, 2026-09-15)
- a81f1a05b - fix(ci): tolerate transient 503 responses in link-checker (marius-kilocode, 2026-09-15)
- 6a423a3d3 - Merge pull request #14154 from Kilo-Org/fix-top-bar-ui-flicker (Marius, 2026-09-15)
- 93674a96d - Merge pull request #14158 from Kilo-Org/investigate-subagent-rendering-flicker (Marius, 2026-09-15)
- 6cfb025f9 - fix(cli): warn when retired experimental.shared_agent_board is present (marius-kilocode, 2026-09-15)
- 1de10e318 - Merge remote-tracking branch 'origin/peaceful-pickup' into peaceful-pickup (marius-kilocode, 2026-09-15)
- 467a1d424 - test(sdk-next): make embedded host isolation test deterministic (marius-kilocode, 2026-09-15)
- c63f77c2e - fix(vscode): add shared_agent_board to known config keys (marius-kilocode, 2026-09-15)
- b0f4ebed4 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- 3509c9213 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- 2272b06f3 - Merge pull request #14149 from Kilo-Org/agent-manager/add-project-footer (Marius, 2026-09-15)
- 037c108a9 - Merge pull request #14156 from Kilo-Org/smooth-vscode-loading-indicator-overlay (Marius, 2026-09-15)
- 1c33649f9 - feat: make Kilo Swarm a top-level config setting (marius-kilocode, 2026-09-15)
- 6ca8c523c - test(vscode): skip the flaky diff-panel scroll-up baseline (marius-kilocode, 2026-09-15)
- 049aaf937 - test(vscode): cover visible stream marking for inspector sessions (marius-kilocode, 2026-09-15)
- cad5f4fcf - Merge remote-tracking branch 'origin/main' into pr-13039 (marius-kilocode, 2026-09-15)
- 5517390af - fix(vscode): stream visible subagent transcripts smoothly (marius-kilocode, 2026-09-15)
- 8c22dd487 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- ef5603ec0 - release: v7.7.1 (kilo-maintainer[bot], 2026-09-15)
- fdacb1cdd - fix(vscode): reserve the header graph height across the turn boundary (marius-kilocode, 2026-09-15)
- e2fb0b7f6 - test(vscode): cover the status swap fade and the outgoing label exit (marius-kilocode, 2026-09-15)
- 1b62b5e52 - fix(vscode): stop clipping the working status label during a status swap (marius-kilocode, 2026-09-15)
- 4ff4c2d49 - Merge remote-tracking branch 'origin/main' into pr-13039 (marius-kilocode, 2026-09-15)
- 85119318f - Merge pull request #14151 from Kilo-Org/buttercup-haumea (Marius, 2026-09-15)
- 95182b654 - Merge pull request #14152 from Kilo-Org/fix/issue-8656-stall-test-flake (Marius, 2026-09-15)
- 39e935e35 - fix(vscode): show header skeletons only while a turn is running (marius-kilocode, 2026-09-15)
- cc3748e91 - fix(vscode): keep Kilo Gateway speech-to-text model when the custom source is cleared (marius-kilocode, 2026-09-15)
- 121b2abdb - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- 130fdad2a - test(cli): keep stall fixture disk writes off the response path (marius-kilocode, 2026-09-15)
- f77ae0b09 - fix(vscode): keep session header height stable while streaming (marius-kilocode, 2026-09-15)
- ce18a2f78 - test(cli): stabilize issue 8656 stall test on Windows (marius-kilocode, 2026-09-15)
- 8e144cc68 - Merge pull request #14150 from Kilo-Org/fix-empty-sidebar-webview (Marius, 2026-09-15)
- e6add5439 - test(opencode): wait for the source pin release in snapshot materialization test (marius-kilocode, 2026-09-15)
- 55b381def - test(vscode): reuse the shared fixture harness for the icon registry test (marius-kilocode, 2026-09-15)
- ed5b3f6da - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- 94c3e3c32 - fix(vscode): keep Agent Manager sidebar rendered when an icon changes registry (marius-kilocode, 2026-09-15)
- 60628eed9 - feat(agent-manager): move add project to a fixed footer (marius-kilocode, 2026-09-15)
- 5566394cc - Merge pull request #14148 from Kilo-Org/optimize-kilo-local-recall-performance (Marius, 2026-09-15)
- 306b4ed6c - fix(cli): recover recall role lookups from prepare-time index errors (marius-kilocode, 2026-09-15)
- 2ba015d6a - fix(cli): log recall role index fallback and mark the changeset minor (marius-kilocode, 2026-09-15)
- 0861063ad - Merge pull request #14144 from Kilo-Org/add-reasoning-mode-visual-setting (Marius, 2026-09-15)
- 716b506b4 - Merge pull request #14146 from Kilo-Org/agent-manager/sticky-project-row (Marius, 2026-09-15)
- 61143892b - Merge remote-tracking branch 'origin/main' into optimize-kilo-local-recall-performance (marius-kilocode, 2026-09-15)
- 02e92bcc6 - fix(cli): speed up local recall searches and improve match ranking (marius-kilocode, 2026-09-15)
- 86cac9b4e - Merge pull request #14120 from Kilo-Org/docs/compaction-model-location (Marius, 2026-09-15)
- c79624dcf - Merge remote-tracking branch 'origin/agent-manager/sticky-project-row' into agent-manager/sticky-project-row (marius-kilocode, 2026-09-15)
- c3d5b9088 - fix(agent-manager): avoid guessing unloaded project base branch (marius-kilocode, 2026-09-15)
- ee8e158f4 - refactor(vscode): drop the dead subagent viewer background flag (marius-kilocode, 2026-09-15)
- bc6cda567 - Merge commit 'aa51594c06a8b8636b09cf7c2edea259ccb48c00' into docs/compaction-model-location (marius-kilocode, 2026-09-15)
- 26ce52fcf - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- aa51594c0 - Merge pull request #14127 from Kilo-Org/sugary-satellite (Marius, 2026-09-15)
- 2ce2bbc1d - Merge pull request #14121 from Kilo-Org/docs/permission-reject-feedback (Marius, 2026-09-15)
- cd21d7cda - test(agent-manager): make scrolled project list story scroll (marius-kilocode, 2026-09-15)
- a242a912d - fix(agent-manager): enable row worktree control before project state loads (marius-kilocode, 2026-09-15)
- 00ca5f652 - Merge pull request #14122 from Kilo-Org/docs/agent-manager-ux (Marius, 2026-09-15)
- 9c7736f87 - Merge pull request #14126 from Kilo-Org/add-comment-copy-link-button (Marius, 2026-09-15)
- 14dbd4822 - Merge pull request #14145 from Kilo-Org/fix-pr-batching-logic-errors (Marius, 2026-09-15)
- 4eedf2a83 - fix(vscode): make subagent reasoning follow the reasoning display setting (marius-kilocode, 2026-09-15)
- 50d3a8e64 - Merge pull request #14138 from Kilo-Org/frosty-nebula (Kirill Kalishev, 2026-09-15)
- 5584ba52c - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- e2d49349d - test(agent-manager): hide the console window of the real-git fixture (marius-kilocode, 2026-09-15)
- 1748eeca0 - fix(ui): address reasoning display review findings (marius-kilocode, 2026-09-15)
- 76194f1ee - test(agent-manager): cover the PR ownership guard against real git (marius-kilocode, 2026-09-15)
- c338003fa - fix(agent-manager): show project actions as buttons and drop worktrees label (marius-kilocode, 2026-09-15)
- a6edb7d14 - refactor(agent-manager): drop a redundant git call from the PR ownership guard (marius-kilocode, 2026-09-15)
- d94f74de0 - style(vscode): format the reasoning contract assertion (marius-kilocode, 2026-09-15)
- 7a9cd7263 - fix(ui): keep the capped reasoning preview anchored after the block settles (marius-kilocode, 2026-09-15)
- c1195f081 - fix(agent-manager): do not inherit a merged PR on a reused branch name (marius-kilocode, 2026-09-15)
- 9701f1242 - feat(agent-manager): pin project row with new worktree button (marius-kilocode, 2026-09-15)
- 95daf5cdd - refactor(vscode): group the reasoning display setting with the other block settings (marius-kilocode, 2026-09-15)
- e2878c3ce - release: v7.7.0 (kilo-maintainer[bot], 2026-09-15)
- 2d9c6eda1 - Merge pull request #14135 from Kilo-Org/docs/consolidate-auto-sync-2026-09-14 (Joshua Lambert, 2026-09-14)
- c49a8e621 - docs(kilo-docs): use Azure Foundry naming consistently (Josh Lambert, 2026-09-14)
- 2151ac907 - Merge pull request #14027 from Kilo-Org/chore/jetbrains-cli-pin-v7.6.2 (Kirill Kalishev, 2026-09-14)
- 95659b1e1 - docs(kilo-docs): restore Swarm migration guidance (Josh Lambert, 2026-09-14)
- 0d20561bf - docs(kilo-docs): address provider review and deprecated mode guidance (Josh Lambert, 2026-09-14)
- 028a2d2e0 - chore(kilo-docs): merge main and resolve Swarm settings (Josh Lambert, 2026-09-14)
- 552f042e9 - chore(jetbrains): sync bun.lock version with package.json bump (kirillk, 2026-09-14)
- c237f1444 - Merge branch 'main' into frosty-nebula (Kirill Kalishev, 2026-09-14)
- 184c87e08 - chore(jetbrains): add shared run configs for VS Code extension scripts (kirillk, 2026-09-14)
- 9b1bc9891 - Merge pull request #14136 from Kilo-Org/planet-primrose (Marius, 2026-09-14)
- d4861e335 - Merge pull request #14134 from Kilo-Org/northern-conifer (Marius, 2026-09-14)
- 8d8267fee - docs(kilo-docs): keep assigned product reviews separate (Josh Lambert, 2026-09-14)
- 2e22a4aa2 - fix(ci): package VSIX with the current changelog (marius-kilocode, 2026-09-14)
- 2798ba013 - docs(kilo-docs): consolidate reviewed documentation updates (Josh Lambert, 2026-09-14)
- 3e4f07eae - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-14)
- 50fc57db0 - feat: enable the Kilo Swarm shared board by default (marius-kilocode, 2026-09-14)
- 17c1066a2 - Merge pull request #14125 from Kilo-Org/fix/smoke-test-go-toolchain (Joshua Lambert, 2026-09-14)
- 64335bd6c - chore(agent-manager): fix Close Others test formatting (marius-kilocode, 2026-09-14)
- ff8b3e915 - fix(agent-manager): harden Close Others tab suppression (marius-kilocode, 2026-09-14)
- 7bbba885b - fix(agent-manager): keep only the target tab on Close Others (marius-kilocode, 2026-09-14)
- 9ca5aab90 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-14)
- 5042e966b - fix(docs-sync): reuse CROSS_REPO_ACCESS_TOKEN for cloud reviewer ranking (#14123) (Igor Šćekić, 2026-09-14)
- 4fb9f3831 - feat(vscode): add copy link action to PR comments (marius-kilocode, 2026-09-14)
- 80fb8e891 - fix(ci): install Go 1.26 for kilo-bench smoke tests (marius-kilocode, 2026-09-14)
- b7070e507 - feat(cli): add scheduled wakeup and cancel tools (#14094) (Igor Šćekić, 2026-09-14)
- d5f81f52c - feat(docs-sync): open per-surface docs PRs, rank reviewers, and cover the cloud product surfaces (#14093) (Igor Šćekić, 2026-09-14)
- fdf1bca9d - fix(opencode): link sessions to PRs without a timed gh pr view probe (#14075) (Igor Šćekić, 2026-09-14)
- 53a553f03 - feat(vscode): add reasoning display modes and headline setting (marius-kilocode, 2026-09-14)
- e7d4c8d0e - docs(agent-manager): document prompt drops and PR comment destinations (marius-kilocode, 2026-09-14)
- 30de2a109 - docs(kilo-docs): document permission rejection feedback and project reload (marius-kilocode, 2026-09-14)
- c32d38149 - docs(settings): document compaction model in Models settings (marius-kilocode, 2026-09-14)
- fa025ffca - chore(jetbrains): bump CLI pin to v7.6.2 (kilo-maintainer[bot], 2026-09-10)
- d399b4878 - Merge upstream main into feat/speech-to-text-custom-source (bsflasher, 2026-09-05)
- 47a92b583 - Merge remote-tracking branch 'upstream/main' into feat/speech-to-text-custom-source (bsflasher, 2026-08-19)
- 4202a4545 - Merge remote-tracking branch 'upstream/main' into feat/speech-to-text-custom-source (bsflasher, 2026-08-11)
- 0f7122232 - chore(sdk): regenerate types for the speech-to-text source keys (bsflasher, 2026-08-10)
- c5cb25702 - test(vscode): update Models tab screenshot baselines (bsflasher, 2026-08-10)
- b9054ee4c - fix(vscode): surface custom transcription auth failures directly (bsflasher, 2026-08-10)
- 471e7c205 - fix(vscode): translate new speech-to-text settings strings (bsflasher, 2026-08-10)
- 0480c79e6 - feat(vscode): support a custom speech-to-text source (bsflasher, 2026-08-10)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/board.ts` (+4, -4)
- `packages/opencode/src/kilocode/tool/cancel-wakeup.ts` (+95, -0)
- `packages/opencode/src/kilocode/tool/cancel-wakeup.txt` (+12, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+21, -2)
- `packages/opencode/src/kilocode/tool/schedule-wakeup.ts` (+99, -0)
- `packages/opencode/src/kilocode/tool/schedule-wakeup.txt` (+16, -0)
- `packages/opencode/src/tool/recall.ts` (+5, -1)
- `packages/opencode/src/tool/recall.txt` (+3, -1)
- `packages/opencode/src/tool/registry.ts` (+2, -0)
- `packages/opencode/test/kilocode/tool/cancel-wakeup.test.ts` (+153, -0)
- `packages/opencode/test/kilocode/tool/schedule-wakeup.test.ts` (+217, -0)
- `packages/opencode/test/tool/recall.test.ts` (+2, -1)
- `packages/opencode/test/tool/registry.test.ts` (+12, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+3, -11)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/schema.json` (+25, -2)
- `packages/core/script/kilocode/migration.ts` (+2, -1)
- `packages/core/src/database/schema.gen.ts` (+7, -0)
- `packages/core/src/kilocode/session/recall-message-index.ts` (+17, -0)
- `packages/core/src/session/sql.ts` (+7, -1)
- `packages/core/src/v1/config/config.ts` (+15, -4)
- `packages/core/test/kilocode/config-shared-agent-board.test.ts` (+5, -5)
- `packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md` (+4, -2)

#### Other Changes
- `.changeset/agent-manager-add-project-footer.md` (+5, -0)
- `.changeset/agent-manager-prompt-mention-drop.md` (+0, -5)
- `.changeset/background-subagent-reasoning-preview.md` (+0, -5)
- `.changeset/batched-pr-poller.md` (+0, -5)
- `.changeset/compaction-model-models-tab.md` (+0, -5)
- `.changeset/goal-continues-after-message.md` (+0, -5)
- `.changeset/improve-review-findings-formatting.md` (+0, -5)
- `.changeset/inspector-visible-stream.md` (+5, -0)
- `.changeset/mention-prose-close.md` (+0, -5)
- `.changeset/permission-exit-shortcut.md` (+0, -5)
- `.changeset/permission-reject-feedback.md` (+0, -8)
- `.changeset/pr-comments-from-changes.md` (+0, -5)
- `.changeset/project-scoped-reload.md` (+0, -6)
- `.changeset/provider-key-replacement.md` (+0, -7)
- `.changeset/pty-early-output.md` (+0, -5)
- `.changeset/quiet-docks-align.md` (+0, -5)
- `.changeset/small-model-fallback-requires-kilo-credentials.md` (+0, -5)
- `.changeset/snapshot-startup-latency.md` (+0, -8)
- `.changeset/speech-to-text-custom-source.md` (+5, -0)
- `.changeset/stable-session-header-height.md` (+5, -0)
- `.changeset/swarm-agent-behaviour-setting.md` (+6, -0)
- `.changeset/transcript-step-handoff-flicker.md` (+0, -5)
- `.changeset/working-status-swap-clip.md` (+5, -0)
- `.changeset/worktree-pool-prewarm.md` (+0, -10)
- `.github/docs-sync/edit.mjs` (+4, -3)
- `.github/docs-sync/learn.mjs` (+309, -208)
- `.github/docs-sync/lib.mjs` (+9, -2)
- `.github/docs-sync/model-config.test.mjs` (+166, -0)
- `.github/docs-sync/prepare-branch.mjs` (+128, -23)
- `.github/docs-sync/reviewers.mjs` (+203, -0)
- `.github/docs-sync/scope.test.mjs` (+50, -0)
- `.github/docs-sync/selftest.mjs` (+1211, -25)
- `.github/docs-sync/surfaces.json` (+74, -0)
- `.github/docs-sync/surfaces.mjs` (+202, -0)
- `.github/docs-sync/surfaces.test.mjs` (+388, -0)
- `.github/docs-sync/triage.mjs` (+24, -3)
- `.github/docs-sync/upsert-pr.mjs` (+381, -131)
- `.github/docs-sync/watermark.mjs` (+22, -10)
- `.github/workflows/docs-sync.yml` (+16, -4)
- `.github/workflows/publish.yml` (+8, -1)
- `.github/workflows/smoke-test.yml` (+9, -0)
- `.kilo/plans/swarm-enabled-by-default.md` (+124, -0)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+43, -43)
- `docs/jetbrains-vscode-settings-parity.md` (+1, -1)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/lychee.toml` (+3, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager-workflows.md` (+3, -6)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+57, -13)
- `packages/kilo-docs/pages/automate/code-reviews/github.md` (+7, -2)
- `packages/kilo-docs/pages/automate/code-reviews/overview.md` (+1, -0)
- `packages/kilo-docs/pages/automate/integrations.md` (+5, -3)
- `packages/kilo-docs/pages/automate/tools/index.md` (+7, -10)
- `packages/kilo-docs/pages/code-with-ai/agents/context-mentions.md` (+12, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+9, -2)
- `packages/kilo-docs/pages/code-with-ai/agents/using-agents.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/features/speech-to-text.md` (+34, -5)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+20, -14)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+9, -2)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+53, -9)
- `packages/kilo-docs/pages/code-with-ai/platforms/jetbrains.md` (+59, -2)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+48, -5)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/index.md` (+12, -1)
- `packages/kilo-docs/pages/collaborate/enterprise/sso.md` (+2, -0)
- `packages/kilo-docs/pages/collaborate/teams/team-management.md` (+16, -4)
- `packages/kilo-docs/pages/customize/context/context-condensing.md` (+4, -2)
- `packages/kilo-docs/pages/customize/custom-instructions.md` (+2, -2)
- `packages/kilo-docs/pages/customize/custom-subagents.md` (+1, -1)
- `packages/kilo-docs/pages/deploy-secure/security-reviews.md` (+7, -3)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+1, -10)
- `packages/kilo-docs/pages/getting-started/byok.md` (+39, -1)
- `packages/kilo-docs/pages/getting-started/faq/account-and-integration.md` (+10, -0)
- `packages/kilo-docs/pages/getting-started/settings/auto-approving-actions.md` (+7, -4)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+73, -14)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-scroll-up-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-scrolled-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-closed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-empty-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-open-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-agent-manager-completed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-messages-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-layout-correction-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-many-prompts-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-wide-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-single-background-agent-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-skeleton-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-todos-all-done-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-todos-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-usage-collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-usage-expanded-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-usage-expanded-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/bash-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/glob-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-apply-patch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-bash-many-rules-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-edit-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-external-dir-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-heredoc-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-skill-shell-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-subagent-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-todo-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-websearch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-write-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/question-above-chatbox-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/agent-behaviour-agents-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-accessible-labels-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-autocomplete-open-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-speech-to-text-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/.run/VSCode - Isolated Clean.run.xml` (+12, -0)
- `packages/kilo-jetbrains/.run/VSCode - Isolated.run.xml` (+12, -0)
- `packages/kilo-jetbrains/.run/VSCode - watch_tsc.run.xml` (+12, -0)
- `packages/kilo-jetbrains/.run/VSCode.run.xml` (+12, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/icon.tsx` (+33, -26)
- `packages/kilo-ui/src/components/message-part.tsx` (+63, -28)
- `packages/kilo-ui/src/components/reasoning-open.ts` (+22, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+66, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+85, -11)
- `packages/kilo-vscode/src/SubAgentViewerProvider.ts` (+2, -13)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+12, -2)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-batch.ts` (+2, -1)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-types.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-utils.ts` (+34, -2)
- `packages/kilo-vscode/src/extension.ts` (+2, -2)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+9, -1)
- `packages/kilo-vscode/src/services/input-tools.ts` (+3, -1)
- `packages/kilo-vscode/src/shared/work-style-presets.ts` (+5, -4)
- `packages/kilo-vscode/src/speech-to-text/catalog.ts` (+44, -0)
- `packages/kilo-vscode/src/speech-to-text/handler.ts` (+11, -2)
- `packages/kilo-vscode/src/speech-to-text/source.ts` (+49, -0)
- `packages/kilo-vscode/src/speech-to-text/transcribe.ts` (+64, -15)
- `packages/kilo-vscode/tests/fixtures/icon-registry-switch.tsx` (+41, -0)
- `packages/kilo-vscode/tests/fixtures/pr-comments-render.tsx` (+16, -0)
- `packages/kilo-vscode/tests/fixtures/pr-conversation-render.tsx` (+11, -1)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+15, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/session-dock-stability.spec.ts` (+84, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-settings.test.ts` (+4, -4)
- `packages/kilo-vscode/tests/unit/am-pr-status-bridge.test.ts` (+37, -0)
- `packages/kilo-vscode/tests/unit/am-pr-utils.test.ts` (+96, -0)
- `packages/kilo-vscode/tests/unit/background-agents.test.ts` (+0, -28)
- `packages/kilo-vscode/tests/unit/close-others.test.ts` (+179, -0)
- `packages/kilo-vscode/tests/unit/config-scope.test.ts` (+2, -6)
- `packages/kilo-vscode/tests/unit/config-utils.test.ts` (+5, -5)
- `packages/kilo-vscode/tests/unit/icon-registry-switch.test.ts` (+4, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+28, -0)
- `packages/kilo-vscode/tests/unit/local-tabs.test.ts` (+27, -0)
- `packages/kilo-vscode/tests/unit/reasoning-display.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/reasoning-open-state.test.ts` (+45, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-source-switch.test.ts` (+126, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-source.test.ts` (+179, -0)
- `packages/kilo-vscode/tests/unit/work-style-apply.test.ts` (+3, -3)
- `packages/kilo-vscode/tests/unit/work-style-presets.test.ts` (+12, -3)
- `packages/kilo-vscode/tests/visual-regression.spec.mts` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+21, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectActions.tsx` (+0, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+36, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectRowActions.tsx` (+56, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+6, -50)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsFooter.tsx` (+26, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsSection.tsx` (+22, -36)
- `packages/kilo-vscode/webview-ui/agent-manager/SubagentPanel.tsx` (+5, -16)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+51, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/close-others.ts` (+45, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/CopyButton.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentCard.tsx` (+8, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRConversation.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+1, -20)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+1, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/BackgroundAgents.tsx` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/ContextProgress.tsx` (+35, -15)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+0, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/SwarmBoard.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+34, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/background-agents.ts` (+2, -8)
- `packages/kilo-vscode/webview-ui/src/components/chat/open-subagent.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+13, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/DisplayTab.tsx` (+28, -16)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+0, -13)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModelsTab.tsx` (+71, -31)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/StatusText.tsx` (+24, -10)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/availability.ts` (+21, -3)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/catalog-state.ts` (+50, -0)
- `packages/kilo-vscode/webview-ui/src/context/display.tsx` (+7, -5)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/context/speech-to-text-models.tsx` (+17, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+23, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+21, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+20, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+19, -7)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+97, -69)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+46, -3)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+26, -4)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+42, -2)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/utils/local-tabs.ts` (+21, -3)
- `packages/kilo-vscode/webview-ui/src/utils/reasoning-display.ts` (+14, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+46, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/effect/app-runtime.ts` (+2, -0)
- `packages/opencode/src/effect/runtime-flags.ts` (+3, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+20, -4)
- `packages/opencode/src/kilo-sessions/pr-link.test.ts` (+0, -159)
- `packages/opencode/src/kilo-sessions/pr-link.ts` (+272, -22)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+60, -0)
- `packages/opencode/src/kilocode/board/context.ts` (+1, -1)
- `packages/opencode/src/kilocode/board/enabled.ts` (+7, -5)
- `packages/opencode/src/kilocode/bootstrap.ts` (+24, -1)
- `packages/opencode/src/kilocode/config/config.ts` (+16, -2)
- `packages/opencode/src/kilocode/session/control.ts` (+8, -1)
- `packages/opencode/src/kilocode/session/recall-search.ts` (+198, -48)
- `packages/opencode/src/kilocode/wakeup/index.ts` (+191, -0)
- `packages/opencode/src/kilocode/wakeup/resume.ts` (+86, -0)
- `packages/opencode/src/kilocode/wakeup/schema.ts` (+150, -0)
- `packages/opencode/src/session/prompt.ts` (+2, -0)
- `packages/opencode/src/session/tools.ts` (+1, -1)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+18, -0)
- `packages/opencode/test/kilocode/board-context.test.ts` (+15, -13)
- `packages/opencode/test/kilocode/board-enabled.test.ts` (+20, -14)
- `packages/opencode/test/kilocode/board-live.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/board-tools.test.ts` (+25, -12)
- `packages/opencode/test/kilocode/config/config.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/config/speech-to-text-config.test.ts` (+12, -0)
- `packages/opencode/test/kilocode/fixture/stall-transport.ts` (+44, -11)
- `packages/opencode/test/kilocode/issue-8656-stall.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+150, -0)
- `packages/opencode/test/kilocode/recall-search.test.ts` (+91, -6)
- `packages/opencode/test/kilocode/server/board.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/sessions/pr-link.test.ts` (+407, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+128, -0)
- `packages/opencode/test/kilocode/snapshot-prepare.test.ts` (+9, -4)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+18, -2)
- `packages/opencode/test/kilocode/wakeup/wakeup-resume.test.ts` (+223, -0)
- `packages/opencode/test/kilocode/wakeup/wakeup.test.ts` (+505, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk-next/test/embedded.test.ts` (+7, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+2, -2)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+4, -1)
- `packages/sdk/openapi.json` (+13, -3)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `patches/ghostty-web@0.3.0.patch` (+0, -40)
- `script/check-opencode-promise-facades.ts` (+13, -0)
- `script/kilocode/changeset-version.test.ts` (+12, -0)
- `script/kilocode/changeset-version.ts` (+40, -0)
- `script/publish.ts` (+5, -26)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index abc52ee64..ab8f0c9dd 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.6.2",
+  "version": "7.7.1",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/schema.json
```diff
diff --git a/packages/core/schema.json b/packages/core/schema.json
index 4443db4f5..298023e85 100644
--- a/packages/core/schema.json
+++ b/packages/core/schema.json
@@ -1,9 +1,9 @@
 {
   "version": "7",
   "dialect": "sqlite",
-  "id": "38a74186-5907-4662-9e14-e059300a8b4e",
+  "id": "8e919778-bf29-4e1b-a106-88bc9d8b8b21",
   "prevIds": [
-    "fcf518b9-c8bc-4ee5-8e68-2608bffcef43"
+    "38a74186-5907-4662-9e14-e059300a8b4e"
   ],
   "ddl": [
     {
@@ -2209,6 +2209,28 @@
       "entityType": "indexes",
       "table": "message"
     },
+    {
+      "columns": [
+        {
+          "value": "id",
+          "isExpression": false
+        },
+        {
+          "value": "json_extract(\"data\", '$.role')",
+          "isExpression": true
+        },
+        {
+          "value": "coalesce(json_extract(\"data\", '$.parentID'), '')",
+          "isExpression": true
+        }
+      ],
+      "isUnique": false,
+      "where": null,
+      "origin": "manual",
+      "name": "recall_message_role_idx",
+      "entityType": "indexes",
+      "table": "message"
+    },
     {
       "columns": [
         {
@@ -2482,3 +2504,4 @@
   ],
   "renames": []
 }
+
```

#### packages/core/script/kilocode/migration.ts
```diff
diff --git a/packages/core/script/kilocode/migration.ts b/packages/core/script/kilocode/migration.ts
index 40750df1d..110a7ae62 100644
--- a/packages/core/script/kilocode/migration.ts
+++ b/packages/core/script/kilocode/migration.ts
@@ -7,7 +7,8 @@ export function file(name: string, value: string) {
 }
 
 export function block(name: string | undefined, source: string, value: string) {
-  return (name !== undefined && board(name)) || /kilo_board(?:_message)?|part_session_step_finish_idx/.test(source)
+  return (name !== undefined && board(name)) ||
+    /kilo_board(?:_message)?|part_session_step_finish_idx|recall_(?:part_search|message_role)_idx/.test(source)
     ? `// kilocode_change start\n${value}\n// kilocode_change end`
     : value
 }
```

#### packages/core/src/database/schema.gen.ts
```diff
diff --git a/packages/core/src/database/schema.gen.ts b/packages/core/src/database/schema.gen.ts
index f961caf4a..9af0e2935 100644
--- a/packages/core/src/database/schema.gen.ts
+++ b/packages/core/src/database/schema.gen.ts
@@ -283,6 +283,11 @@ export default {
       yield* tx.run(
         `CREATE INDEX \`message_session_time_created_id_idx\` ON \`message\` (\`session_id\`,\`time_created\`,\`id\`);`,
       )
+      // kilocode_change start
+      yield* tx.run(
+        `CREATE INDEX \`recall_message_role_idx\` ON \`message\` (\`id\`,json_extract("data", '$.role'),coalesce(json_extract("data", '$.parentID'), ''));`,
+      )
+      // kilocode_change end
       yield* tx.run(`CREATE INDEX \`part_message_id_id_idx\` ON \`part\` (\`message_id\`,\`id\`);`)
       yield* tx.run(`CREATE INDEX \`part_session_idx\` ON \`part\` (\`session_id\`);`)
       // kilocode_change start
@@ -290,9 +295,11 @@ export default {
         `CREATE INDEX \`part_session_step_finish_idx\` ON \`part\` (\`session_id\`) WHERE json_valid("part"."data") AND json_extract("part"."data", '$.type') = 'step-finish';`,
       )
       // kilocode_change end
+      // kilocode_change start
       yield* tx.run(
         `CREATE INDEX \`recall_part_search_idx\` ON \`part\` (\`session_id\`,\`id\`,\`message_id\`,json_extract("data", '$.type'),CASE WHEN json_extract("data", '$.type') = 'text' THEN coalesce(json_extract("data", '$.text'), '') WHEN json_extract("data", '$.type') = 'file' THEN trim(coalesce(json_extract("data", '$.filename'), '') || ' ' || CASE WHEN coalesce(json_extract("data", '$.url'), '') NOT LIKE 'data:%' THEN coalesce(json_extract("data", '$.url'), '') ELSE '' END || ' ' || coalesce(json_extract("data", '$.source.path'), '') || ' ' || coalesce(json_extract("data", '$.source.name'), '') || ' ' || CASE WHEN coalesce(json_extract("data", '$.source.uri'), '') NOT LIKE 'data:%' THEN coalesce(json_extract("data", '$.source.uri'), '') ELSE '' END || ' ' || coalesce(json_extract("data", '$.source.clientName'), '')) ELSE coalesce(json_extract("data", '$.state.error'), '') END) WHERE json_valid("part"."data") AND ((json_extract("part"."data", '$.type') = 'text' AND coalesce(json_extract("part"."data", '$.synthetic'), 0) = 0 AND coalesce(json_extract("part"."data", '$.ignored'), 0) = 0) OR json_extract("part"."data", '$.type') = 'file' OR (json_extract("part"."data", '$.type') = 'tool' AND json_extract("part"."data", '$.state.status') = 'error'));`,
       )
+      // kilocode_change end
       yield* tx.run(
         `CREATE INDEX \`session_input_session_pending_delivery_seq_idx\` ON \`session_input\` (\`session_id\`,\`promoted_seq\`,\`delivery\`,\`admitted_seq\`);`,
       )
```

#### packages/core/src/kilocode/session/recall-message-index.ts
```diff
diff --git a/packages/core/src/kilocode/session/recall-message-index.ts b/packages/core/src/kilocode/session/recall-message-index.ts
new file mode 100644
index 000000000..e391b4f69
--- /dev/null
+++ b/packages/core/src/kilocode/session/recall-message-index.ts
@@ -0,0 +1,17 @@
+import { sql } from "drizzle-orm"
+import { index, type AnySQLiteColumn } from "drizzle-orm/sqlite-core"
+
+// Covering index so recall search can resolve message roles without reading message rows.
+export namespace RecallMessageIndex {
+  export const name = "recall_message_role_idx"
+
+  export const createSql = `CREATE INDEX IF NOT EXISTS \`${name}\` ON \`message\` (\`id\`,json_extract("data", '$.role'),coalesce(json_extract("data", '$.parentID'), ''));`
+
+  export function make(table: { id: AnySQLiteColumn; data: AnySQLiteColumn }) {
+    return index(name).on(
+      table.id,
+      sql`json_extract(${table.data}, '$.role')`,
+      sql`coalesce(json_extract(${table.data}, '$.parentID'), '')`,
+    )
+  }
+}
```


*... and more files (showing first 5)*

## opencode Changes (228e909..e03db9b)

### Commits

- e03db9b - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-09-14)
- 403627b - deepseek v4.1 flash (Frank, 2026-09-14)
- 5cf4e13 - fix(console): route new Console keys to inference (#49036) (vprdev, 2026-09-14)
- 4ae1765 - chore: add Alan to team members (#49054) (opencode-agent[bot], 2026-09-14)
- a74c472 - sync release versions for v1.18.31 (opencode, 2026-09-14)
- a97622c - fix(tui): surface remote auth startup errors (#49016) (opencode-agent[bot], 2026-09-14)
- 7f20943 - test(app): retire legacy layout e2e coverage (#49015) (opencode-agent[bot], 2026-09-14)

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
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `.github/TEAM_MEMBERS` (+1, -0)
- `bun.lock` (+28, -28)
- `packages/app/e2e/regression/legacy-new-session.spec.ts` (+0, -41)
- `packages/app/e2e/regression/session-timeline-projection.spec.ts` (+2, -6)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/lib/inference-proxy.ts` (+39, -37)
- `packages/console/app/src/routes/zen/util/handler.ts` (+1, -1)
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
- `packages/opencode/src/cli/cmd/tui.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-error-middleware.test.ts` (+21, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/app.tsx` (+3, -1)
- `packages/tui/src/util/error.ts` (+11, -0)
- `packages/tui/test/app-lifecycle.test.tsx` (+62, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 19aade6..fefbe8a 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.30",
+  "version": "1.18.31",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ab20288..2b465e5 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.30",
+  "version": "1.18.31",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index d6ffa5f..3bfb642 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.30",
+  "version": "1.18.31",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/schema.json
- `src/core/` - review core changes from packages/core/script/kilocode/migration.ts
- `src/core/` - review core changes from packages/core/src/database/schema.gen.ts
- `src/core/` - review core changes from packages/core/src/kilocode/session/recall-message-index.ts
- `src/core/` - review core changes from packages/core/src/session/sql.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/core/` - review core changes from packages/core/test/kilocode/config-shared-agent-board.test.ts
- `src/core/` - review core changes from packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
- `src/tool/board.ts` - update based on kilocode packages/opencode/src/kilocode/tool/board.ts changes
- `src/tool/cancel-wakeup.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/cancel-wakeup.test.ts changes
- `src/tool/cancel-wakeup.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cancel-wakeup.ts changes
- `src/tool/cancel-wakeup.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cancel-wakeup.txt changes
- `src/tool/recall.test.ts` - update based on kilocode packages/opencode/test/tool/recall.test.ts changes
- `src/tool/recall.ts` - update based on kilocode packages/opencode/src/tool/recall.ts changes
- `src/tool/recall.txt.ts` - update based on kilocode packages/opencode/src/tool/recall.txt changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/schedule-wakeup.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/schedule-wakeup.test.ts changes
- `src/tool/schedule-wakeup.ts` - update based on kilocode packages/opencode/src/kilocode/tool/schedule-wakeup.ts changes
- `src/tool/schedule-wakeup.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/schedule-wakeup.txt changes
