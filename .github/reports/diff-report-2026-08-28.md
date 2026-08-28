# Upstream Changes Report
Generated: 2026-08-28 18:17:03

## Summary
- kilocode: 138 commits, 488 files changed
- opencode: 12 commits, 140 files changed

## kilocode Changes (c03a20394..e126cc3ca)

### Commits

- e126cc3ca - Merge pull request #13551 from Kilo-Org/happy-ferret (Kirill Kalishev, 2026-08-28)
- 2c3b545da - Merge pull request #13556 from Kilo-Org/allow-editing-queued-messages (Marius, 2026-08-28)
- 46a885c2d - refactor(jetbrains): reuse autolink url scanner (kirillk, 2026-08-28)
- fa02955bf - release: v7.5.6 (kilo-maintainer[bot], 2026-08-28)
- e491ff565 - Merge pull request #13560 from Kilo-Org/fix-dismissed-background-subagents (Marius, 2026-08-28)
- 454b1013e - fix(vscode): preserve background agent dismissals across navigation (marius-kilocode, 2026-08-28)
- 38f93ec1d - ci: fall back to GitHub-hosted runners in forks (#13364) (matt wilkie, 2026-08-28)
- 667821fd8 - Merge pull request #13559 from Kilo-Org/fix-vscode-worktree-launch (Marius, 2026-08-28)
- 4b2d6ee1e - fix(vscode): build missing bundles before isolated launch (marius-kilocode, 2026-08-28)
- 3ce687502 - Merge pull request #13525 from Kilo-Org/hidden-meadow (Kirill Kalishev, 2026-08-28)
- 4e311d56d - Merge pull request #13555 from Kilo-Org/investigate-cli-startup-bottleneck (Marius, 2026-08-28)
- b301c627e - fix(vscode): release queued edits after interrupted deletion (marius-kilocode, 2026-08-28)
- 3d7d5f0e8 - fix(jetbrains): prune only stale kilo managed worktrees (kirillk, 2026-08-28)
- 8a8f67f9c - fix(cli): reduce startup initialization work (marius-kilocode, 2026-08-28)
- 52d4247d9 - feat(vscode): edit queued messages in the prompt input (marius-kilocode, 2026-08-28)
- f93583fb4 - Merge pull request #13553 from Kilo-Org/investigate-kio-server-crashes (Marius, 2026-08-28)
- 768b38f5d - Merge pull request #13548 from Kilo-Org/queue-messages-for-busy-sessions (Marius, 2026-08-28)
- c4309e06e - Merge pull request #13546 from Kilo-Org/validate-and-improve-pr-13539-fix (Marius, 2026-08-28)
- 03672289b - Merge pull request #13549 from Kilo-Org/dust-bubble (Marius, 2026-08-28)
- 2160f0c3a - Merge pull request #13550 from Kilo-Org/jetbrains/release/v7.1.1 (Kirill Kalishev, 2026-08-28)
- 1e1322019 - fix(vscode): preserve activity during routine reconnects (marius-kilocode, 2026-08-28)
- 690994f3a - docs(jetbrains): edit changelog for v7.1.1 (Kirill Kalishev, 2026-08-28)
- 1d6744e63 - fix(jetbrains): linkify urls inside inline code (kirillk, 2026-08-28)
- 835c9f1e5 - fix(jetbrains): keep gh availability reporting when worktree sync fails (kirillk, 2026-08-28)
- a0aed6353 - release(jetbrains): v7.1.1 (kilo-maintainer[bot], 2026-08-28)
- d5ae59ac0 - docs(vscode): refresh extension agent guide (marius-kilocode, 2026-08-28)
- c3deca608 - feat(remote-sender): forward messageID and drop queued prompts (#13496) (Igor Šćekić, 2026-08-28)
- 039a235b6 - fix(agent-manager): queue prompts for busy sessions (marius-kilocode, 2026-08-28)
- df80ed9a0 - Merge pull request #13544 from Kilo-Org/enable-send-to-continue (Marius, 2026-08-28)
- 25bed6857 - Merge pull request #13547 from Kilo-Org/fix-disabled-snapshot-prompt-race (Marius, 2026-08-28)
- 679cc23ec - Merge pull request #13543 from Kilo-Org/fix-task-status-after-agent-resume (Marius, 2026-08-28)
- 4f929d6ff - Merge pull request #13542 from Kilo-Org/show-running-background-agents-in-agent-manager (Marius, 2026-08-28)
- 5cbe97554 - test(vscode): cover reasoning defaults in pending drafts (marius-kilocode, 2026-08-28)
- 2fd53b027 - fix(vscode): prevent drained questions from reappearing (marius-kilocode, 2026-08-28)
- 31e76dd11 - fix(vscode): honor configured reasoning defaults (marius-kilocode, 2026-08-28)
- 10e3f8373 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-28)
- d14d7e96e - fix(vscode): keep background agent summary clickable (marius-kilocode, 2026-08-28)
- dc208291e - fix(agent-manager): preserve shared activity spinner sizing (marius-kilocode, 2026-08-28)
- fadc88e7b - fix(vscode): show partial agent overflow and open agents directly (marius-kilocode, 2026-08-28)
- 3495daf0e - Merge pull request #13545 from Kilo-Org/investigate-errors-in-cloud-and-kilo-repos (Marius, 2026-08-28)
- c08276d2b - test(cli): use scoped effects for session resume HTTP coverage (marius-kilocode, 2026-08-28)
- d65caf82d - fix(agent-manager): remove unused worktree spinner style (marius-kilocode, 2026-08-28)
- b8058a30b - fix(vscode): clear failure banners after overflow recovery (marius-kilocode, 2026-08-28)
- f5a7a1d61 - feat(vscode): resume interrupted tasks from the send button (marius-kilocode, 2026-08-28)
- 67b299f66 - fix(agent-manager): correct activity indicators after recovery (marius-kilocode, 2026-08-28)
- ca316c938 - fix(vscode): adapt background agent indicators to available space (marius-kilocode, 2026-08-28)
- 23f6677d3 - Merge pull request #13540 from Kilo-Org/fix-checkpoint-cleanup-on-worktree-deletion (Marius, 2026-08-28)
- 0feab49bd - Merge pull request #13537 from Kilo-Org/refactor-prompt-sandbox-responses (Marius, 2026-08-28)
- 21264ec3e - Merge pull request #13538 from Kilo-Org/refactor-agent-manager-review-routing (Marius, 2026-08-28)
- 47dc16b15 - fix(vscode): show running background agent names inline (marius-kilocode, 2026-08-28)
- bac304314 - fix(cli): avoid protected ancestors during checkpoint cleanup (marius-kilocode, 2026-08-28)
- f60c6870c - refactor(agent-manager): extract project-scoped review routing (marius-kilocode, 2026-08-28)
- 618d956a9 - refactor(vscode): extract prompt sandbox response handling (marius-kilocode, 2026-08-28)
- 68804090c - Merge pull request #13536 from Kilo-Org/reduce-duplicated-and-dead-code (Marius, 2026-08-28)
- b92a36f60 - Merge pull request #13509 from Kilo-Org/fix-indexing-root-guard (Marius, 2026-08-28)
- b0dbd398a - refactor(core): simplify root prefix check (marius-kilocode, 2026-08-28)
- fc7b1c510 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-28)
- 00f0c7d77 - chore: merge main into UI cleanup (marius-kilocode, 2026-08-28)
- 142db490c - Merge pull request #13534 from Kilo-Org/fix-pipeline-issues (Marius, 2026-08-28)
- 1f547ade8 - refactor(vscode): remove duplicate and unused UI code (marius-kilocode, 2026-08-28)
- eb22f3227 - fix(vscode): fix pipeline test and lint failures (marius-kilocode, 2026-08-28)
- 8e7ce28c8 - Merge pull request #13531 from Kilo-Org/fix-question-tool-focus-stealing (Marius, 2026-08-28)
- f0db1f2dd - Merge pull request #13533 from Kilo-Org/configurable-compaction-model (Marius, 2026-08-28)
- 08467dba4 - fix(cli): limit indexing safeguards to home and root (marius-kilocode, 2026-08-28)
- 0661a1fae - Merge pull request #13530 from Kilo-Org/fix-past-session-referencing (Marius, 2026-08-28)
- 568a8218c - Merge pull request #13529 from Kilo-Org/optimize-harness-resource-usage (Marius, 2026-08-28)
- 3c5c8c89c - Merge pull request #13504 from Kilo-Org/improve-vscode-tab-session-status (Marius, 2026-08-28)
- 788ed4035 - Merge pull request #13532 from Kilo-Org/refactor-composite-ids (Marius, 2026-08-28)
- c1608c834 - Merge pull request #13374 from Kilo-Org/fix-compaction-message-reinjection (Marius, 2026-08-28)
- 34d70fe6b - fix(vscode): simplify replaced transcript cleanup (marius-kilocode, 2026-08-28)
- 6d15d18fa - feat(vscode): add compaction model setting (marius-kilocode, 2026-08-28)
- 1c9709706 - fix(ui): remove redundant observer feature detection (marius-kilocode, 2026-08-28)
- 8507bddb0 - refactor: centralize NUL-delimited composite keys (marius-kilocode, 2026-08-28)
- d93783f57 - fix(vscode): cap past-chat history at 5000 sessions (marius-kilocode, 2026-08-28)
- 9f4c69804 - Merge pull request #13528 from Kilo-Org/investigate-empty-queued-messages (Marius, 2026-08-28)
- c1d1e9bcd - fix(vscode): preserve typing focus when questions update (marius-kilocode, 2026-08-28)
- 5d1313f8a - fix(vscode): restore past session references (marius-kilocode, 2026-08-28)
- 8cb193127 - fix: reduce offscreen animation and transcript memory overhead (marius-kilocode, 2026-08-28)
- de9e1edcf - fix(vscode): prevent empty queued messages (marius-kilocode, 2026-08-28)
- 02a2f723b - refactor(cli): simplify indexing safety changes (marius-kilocode, 2026-08-28)
- 6c5f31fc0 - Merge pull request #13505 from Kilo-Org/optimize-git-diff-session-switching (Marius, 2026-08-28)
- 8b3e353fc - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-28)
- 84a0b4b67 - refactor(vscode): share array-based activity priority (marius-kilocode, 2026-08-28)
- 66e687169 - fix(jetbrains): skip probes for removed worktrees (kirillk, 2026-08-27)
- c1602eb82 - Merge pull request #13524 from Kilo-Org/jetbrains/release/v7.1.1-rc.1 (Kirill Kalishev, 2026-08-27)
- 548a17847 - docs(jetbrains): edit changelog for v7.1.1-rc.1 (Kirill Kalishev, 2026-08-27)
- a4afcaee0 - release(jetbrains): v7.1.1-rc.1 (kilo-maintainer[bot], 2026-08-28)
- 34eca7656 - Merge pull request #13490 from Kilo-Org/chore/jetbrains-cli-pin-v7.5.5 (Kirill Kalishev, 2026-08-27)
- 1184f95e3 - Merge branch 'main' into chore/jetbrains-cli-pin-v7.5.5 (Kirill Kalishev, 2026-08-27)
- cf3c00a3f - Merge pull request #13520 from Kilo-Org/snappy-hedgehog (Kirill Kalishev, 2026-08-27)
- 9b92b05d5 - fix(jetbrains): measure the failure card text at its painted width (kirillk, 2026-08-27)
- b3f68e0a2 - fix(jetbrains): warn when a provider ends a response unfinished (kirillk, 2026-08-27)
- a1c57ff8d - Merge pull request #13521 from Kilo-Org/sturdy-reef (Kirill Kalishev, 2026-08-27)
- 9f6af4414 - fix(jetbrains): reword German worktree empty-state hint (kirillk, 2026-08-27)
- dfaa30b0b - feat(jetbrains): toggle the worktree session list (kirillk, 2026-08-27)
- 56dc51e8a - fix(jetbrains): recover failed turn state and show retry once (kirillk, 2026-08-27)
- 9b72db37d - Merge pull request #13396 from Kilo-Org/mighty-acorn (Kirill Kalishev, 2026-08-27)
- 921bce7cc - fix(jetbrains): harden diagram rendering fallbacks and logging (kirillk, 2026-08-27)
- bac3e7a7a - fix(jetbrains): surface failed turn errors (kirillk, 2026-08-27)
- 4801e4312 - fix(jetbrains): use standard diagram toolbar icons (kirillk, 2026-08-27)
- 0ee530d85 - fix(jetbrains): refine diagram viewer interactions (kirillk, 2026-08-27)
- a453e2d23 - feat(jetbrains): hint worktree usage on empty session (kirillk, 2026-08-27)
- 54b7225c4 - fix(jetbrains): repair diagram viewer controls (kirillk, 2026-08-27)
- e702f2a58 - fix(jetbrains): continue failed turns on retry (kirillk, 2026-08-27)
- d96b1b3c3 - fix(jetbrains): label tool window create actions (kirillk, 2026-08-27)
- dedd439be - feat(jetbrains): open diagrams in editor tabs (kirillk, 2026-08-27)
- 7bce2f4f8 - fix(vscode): preserve cached diff lines on worktree switches (marius-kilocode, 2026-08-27)
- f6ff101cc - chore: merge main and preserve worktree deletion guards (marius-kilocode, 2026-08-27)
- 72dcd4221 - test(core): avoid unsafe inode arithmetic (marius-kilocode, 2026-08-27)
- 23833e2fe - fix(cli): preserve VCS metadata and cancel stale searches (marius-kilocode, 2026-08-27)
- 9a287dce8 - chore: merge main and resolve worktree activity conflicts (marius-kilocode, 2026-08-27)
- ec20f8f36 - fix(agent-manager): scope activity colors to owned CSS names (marius-kilocode, 2026-08-27)
- cdcf69e0d - fix(vscode): preserve activity colors in selected and portalled views (marius-kilocode, 2026-08-27)
- 980650ee1 - test(core): use native paths in search expectations (marius-kilocode, 2026-08-27)
- bd4789f9d - fix(vscode): reject stale diff reads and prune removed reviews (marius-kilocode, 2026-08-27)
- 04ac919af - fix(cli): make file search on demand (marius-kilocode, 2026-08-27)
- 727083532 - chore: merge main Git executable fixes (marius-kilocode, 2026-08-27)
- b382a3b83 - fix(vscode): keep large worktree reviews responsive (marius-kilocode, 2026-08-27)
- f293ecbba - fix(vscode): show consistent session activity indicators (marius-kilocode, 2026-08-27)
- aa2359ce5 - Merge remote-tracking branch 'origin/main' into fix-compaction-message-reinjection (marius-kilocode, 2026-08-27)
- ae00c228d - refactor(cli): narrow compaction fix to replay eligibility (marius-kilocode, 2026-08-27)
- 6e05f48fb - fix(cli): prevent filesystem root indexing (marius-kilocode, 2026-08-26)
- d02a5beba - chore(jetbrains): bump CLI pin to v7.5.5 (kilo-maintainer[bot], 2026-08-26)
- c0773eb77 - fix(jetbrains): detect corrupt IDE extractions (kirillk, 2026-08-26)
- 4ee3b8f4c - Merge remote-tracking branch 'origin/main' into mighty-acorn (kirillk, 2026-08-26)
- 83ec1b33d - fix(jetbrains): harden mermaid parsing, limits and sequence layout (kirillk, 2026-08-26)
- eb3a1ab57 - test(core): synchronize durable PTY exit notifications (marius-kilocode, 2026-08-25)
- fa3d0b5c8 - Merge remote-tracking branch 'origin/main' into fix-compaction-message-reinjection (marius-kilocode, 2026-08-25)
- 2b3be5cb1 - Merge commit 'b9f2a597229c29ff197a0da0a4ea43955f7df1fd' into fix-compaction-message-reinjection (marius-kilocode, 2026-08-25)
- 76ea62098 - fix(cli): preserve pending turns across compaction recovery (marius-kilocode, 2026-08-25)
- b9f2a5972 - fix(cli): handle tool progress during compaction (marius-kilocode, 2026-08-25)
- bde7ebc50 - Merge remote-tracking branch 'origin/main' into fix-compaction-message-reinjection (marius-kilocode, 2026-08-25)
- c1ded75ba - fix(jetbrains): show diagram hover actions and order block children (kirillk, 2026-08-24)
- f557ba61c - feat(jetbrains): add open-in-editor action to rendered diagrams (kirillk, 2026-08-24)
- b9d4d874f - feat(jetbrains): render mermaid diagrams inline in markdown (kirillk, 2026-08-24)
- ccfd17ef1 - feat(jetbrains): add mermaid diagram engine (kirillk, 2026-08-24)
- 831530265 - fix(cli): preserve compaction replay context (marius-kilocode, 2026-08-24)
- 8bcd9f4b8 - fix(cli): prevent compaction request replay loops (marius-kilocode, 2026-08-24)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+2, -2)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+1, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+7, -12)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/filesystem/search.ts` (+34, -18)
- `packages/core/src/filesystem/watcher.ts` (+4, -1)
- `packages/core/src/kilocode/fff.ts` (+29, -4)
- `packages/core/src/kilocode/zero-id.ts` (+5, -0)
- `packages/core/test/kilocode/fff.test.ts` (+106, -22)
- `packages/core/test/kilocode/zero-id.test.ts` (+58, -0)
- `packages/kilo-vscode/src/agent-manager/orchestration-domain.ts` (+0, -29)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts` (+4, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts` (+77, -37)

#### Other Changes
- `.changeset/agent-manager-worktree-mentions.md` (+0, -6)
- `.changeset/background-worktree-activity.md` (+0, -5)
- `.changeset/calm-prompt-navigator.md` (+0, -5)
- `.changeset/clear-empty-failed-turn.md` (+0, -5)
- `.changeset/edit-queued-messages.md` (+6, -0)
- `.changeset/fix-streaming-scroll-intent.md` (+0, -5)
- `.changeset/fix-vscode-server-startup-output.md` (+0, -5)
- `.changeset/fix-windows-worktree-git.md` (+0, -5)
- `.changeset/hey-api-security-update.md` (+0, -5)
- `.changeset/jetbrains-inline-code-urls.md` (+5, -0)
- `.changeset/jetbrains-stopped-session-not-an-error.md` (+0, -5)
- `.changeset/jetbrains-worktree-pr-detection.md` (+0, -5)
- `.changeset/jetbrains-worktree-tab-artifacts.md` (+0, -5)
- `.changeset/minimatch-security-fix.md` (+0, -7)
- `.changeset/nanoid-security-update.md` (+0, -5)
- `.changeset/open-read-tool-files.md` (+0, -5)
- `.changeset/plan-mode-ruleset-stacking.md` (+0, -5)
- `.changeset/prune-orphaned-worktree-snapshots.md` (+0, -6)
- `.changeset/review-agent-manager-worktrees.md` (+0, -6)
- `.changeset/steady-agent-manager-ownership.md` (+0, -5)
- `.changeset/task-tool-empty-result.md` (+0, -5)
- `.github/workflows/docs-build.yml` (+1, -1)
- `.github/workflows/test-jetbrains.yml` (+3, -3)
- `.github/workflows/test-vscode.yml` (+1, -1)
- `.github/workflows/typecheck.yml` (+4, -4)
- `.github/workflows/visual-regression.yml` (+2, -2)
- `AGENTS.md` (+1, -0)
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
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+2, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/session-tab-activity-states-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/worktree-activity-states-active-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/worktree-activity-states-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-1280-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-420-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-single-background-agent-420-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/diff-summary-collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/activity-states-1280-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/activity-states-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/multiple-sessions-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/multiple-sessions-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/switcher-open-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+1, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+67, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendActivityManager.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+146, -20)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendActivityManagerTest.kt` (+48, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+2, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+153, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+23, -0)
- `packages/kilo-jetbrains/frontend/build.gradle.kts` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/KiloActionIcons.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/NewSessionAction.kt` (+6, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/NewWorktreeAction.kt` (+11, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/KiloWorktreeService.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeActivity.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+107, -26)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListToggle.kt` (+165, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListVisibility.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloFrontendDynamicPluginListener.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloPluginSettings.kt` (+0, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionHost.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionManager.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+16, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+62, -51)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionState.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/TurnOutcome.kt` (+15, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+73, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionSurface.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/EmptySessionPanel.kt` (+114, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionCopyButton.kt` (+24, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionCopyTarget.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionHoverCopyOverlay.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionTargetResolver.kt` (+6, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageErrorView.kt` (+138, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageToolbar.kt` (+5, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/SessionOutcomeView.kt` (+37, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/SkillsConfigurable.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/WorkflowsConfigurable.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsContentEditor.kt` (+3, -48)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/rules/RulesSettingsUi.kt` (+2, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/Clipboard.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/CodeViewField.kt` (+48, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/HoverIcon.kt` (+14, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/Art.kt` (+97, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/Engine.kt` (+57, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/Measure.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/Metrics.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/Painter.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/Palette.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ScenePainter.kt` (+170, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/Type.kt` (+40, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Flow.kt` (+352, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/FlowLayout.kt` (+422, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/FlowMarks.kt` (+258, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Mermaid.kt` (+59, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Seq.kt` (+206, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/SeqLayout.kt` (+289, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/mermaid/Source.kt` (+123, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramBlock.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramCanvas.kt` (+267, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramContent.kt` (+63, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramEditorKind.kt` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramPanel.kt` (+110, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramTheme.kt` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramViewer.kt` (+183, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramWindow.kt` (+145, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/diagram/ui/Diagrams.kt` (+121, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdCommon.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdLanguage.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdProjector.kt` (+53, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdViewHybrid.kt` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloEditorKind.kt` (+7, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloFileEditor.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloFileEditorProvider.kt` (+24, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloSourceEditorProvider.kt` (+37, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVirtualFileKind.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/add-small.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/add-small_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+23, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/NewSessionActionTest.kt` (+52, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/NewWorktreeActionTest.kt` (+75, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeActivityTest.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanelTest.kt` (+252, -20)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListToggleTest.kt` (+101, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListVisibilityTest.kt` (+98, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/plugin/KiloBundleLocaleTest.kt` (+100, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionRecoveryTest.kt` (+194, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionRetryTest.kt` (+90, -38)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/TurnLifecycleTest.kt` (+48, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/EmptySessionPanelTest.kt` (+144, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+263, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionSelectionCopyTest.kt` (+44, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/SessionOutcomeViewTest.kt` (+80, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/rules/RulesSettingsUiTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorktreeRpcApi.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/CancelTest.kt` (+104, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ConformanceTest.kt` (+78, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/DiagramAsserts.kt` (+129, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ErrorTest.kt` (+54, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/FakeMeasure.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/FlowLayoutTest.kt` (+88, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/InvariantTest.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/LimitsTest.kt` (+106, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/MetricsTest.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ScenePainterTest.kt` (+66, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/SeqLayoutTest.kt` (+121, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/SerializeTest.kt` (+58, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/TypeTest.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/mermaid/FlowParseTest.kt` (+219, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/mermaid/SeqParseTest.kt` (+164, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/mermaid/SourceTest.kt` (+114, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramEditorKindTest.kt` (+135, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramPanelTest.kt` (+115, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramViewerTest.kt` (+361, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramWindowTest.kt` (+111, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/diagram/ui/DiagramsTest.kt` (+184, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdLanguageTest.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdProjectorTest.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewDiagramTest.kt` (+329, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridTest.kt` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewTest.kt` (+77, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/flow-basic.mmd` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/flow-cycle.mmd` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/flow-long.mmd` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/flow-shapes.mmd` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/flow-subgraph.mmd` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/seq-basic.mmd` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/seq-blocks.mmd` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/test/resources/diagram/seq-notes.mmd` (+8, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+2, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorktreeRpcApi.kt` (+9, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+1, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/diff.tsx` (+6, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+27, -0)
- `packages/kilo-ui/src/components/spinner.css` (+5, -0)
- `packages/kilo-ui/src/pierre/index.ts` (+1, -0)
- `packages/kilo-ui/src/stories/spinner.stories.tsx` (+11, -1)
- `packages/kilo-ui/src/styles/index.css` (+1, -0)
- `packages/kilo-vscode/AGENTS.md` (+33, -19)
- `packages/kilo-vscode/CHANGELOG.md` (+69, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/script/launch.ts` (+2, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+54, -6)
- `packages/kilo-vscode/src/SubAgentViewerProvider.ts` (+7, -1)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+29, -12)
- `packages/kilo-vscode/src/agent-manager/local-diff-batch.ts` (+203, -0)
- `packages/kilo-vscode/src/agent-manager/local-diff-cache.ts` (+313, -0)
- `packages/kilo-vscode/src/agent-manager/local-diff.ts` (+124, -188)
- `packages/kilo-vscode/src/agent-manager/project/route.ts` (+2, -2)
- `packages/kilo-vscode/src/agent-manager/semaphore.ts` (+12, -6)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-activity.ts` (+9, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-diff-controller.ts` (+5, -2)
- `packages/kilo-vscode/src/diff/sources/worktree.ts` (+11, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+7, -1)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+24, -1)
- `packages/kilo-vscode/src/kilo-provider/native-tab-title.ts` (+14, -5)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+1, -0)
- `packages/kilo-vscode/src/kilo-provider/session-search.ts` (+1, -1)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+1, -0)
- `packages/kilo-vscode/src/services/cli-backend/explicit-abort.ts` (+3, -2)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+20, -0)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+149, -0)
- `packages/kilo-vscode/tests/fixtures/question-dock-disposal.tsx` (+32, -2)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+592, -0)
- `packages/kilo-vscode/tests/fixtures/session-tab-switcher.tsx` (+1, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/setup/vscode-mock.ts` (+4, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+7, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-focus.test.ts` (+56, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-initial-message.test.ts` (+9, -9)
- `packages/kilo-vscode/tests/unit/agent-manager-review-routing.test.ts` (+152, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-worktree-diffs.test.ts` (+137, -1)
- `packages/kilo-vscode/tests/unit/agent-project-route.test.ts` (+7, -0)
- `packages/kilo-vscode/tests/unit/background-agents.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/config-utils.test.ts` (+21, -0)
- `packages/kilo-vscode/tests/unit/connection-service-question.test.ts` (+8, -2)
- `packages/kilo-vscode/tests/unit/diff-preview-request.test.ts` (+33, -0)
- `packages/kilo-vscode/tests/unit/diff-source-catalog.test.ts` (+38, -1)
- `packages/kilo-vscode/tests/unit/early-message.test.ts` (+27, -0)
- `packages/kilo-vscode/tests/unit/explicit-abort.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+34, -0)
- `packages/kilo-vscode/tests/unit/git-ops.test.ts` (+29, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+43, -3)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+15, -0)
- `packages/kilo-vscode/tests/unit/launch.test.ts` (+87, -0)
- `packages/kilo-vscode/tests/unit/local-diff.test.ts` (+593, -1)
- `packages/kilo-vscode/tests/unit/native-tab-title.test.ts` (+34, -0)
- `packages/kilo-vscode/tests/unit/plan-exit.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/project-session-busy.test.ts` (+101, -81)
- `packages/kilo-vscode/tests/unit/prompt-continue.test.ts` (+64, -0)
- `packages/kilo-vscode/tests/unit/prompt-drafts.test.ts` (+10, -1)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+34, -9)
- `packages/kilo-vscode/tests/unit/prompt-rail.test.ts` (+17, -1)
- `packages/kilo-vscode/tests/unit/prompt-sandbox-messages.test.ts` (+241, -0)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+4, -3)
- `packages/kilo-vscode/tests/unit/question-dock-disposal.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/revert-checkpoints.test.ts` (+3, -3)
- `packages/kilo-vscode/tests/unit/review-comments.test.ts` (+17, -0)
- `packages/kilo-vscode/tests/unit/semaphore.test.ts` (+40, -0)
- `packages/kilo-vscode/tests/unit/session-activity.test.ts` (+184, -0)
- `packages/kilo-vscode/tests/unit/session-outcome.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/session-parts.test.ts` (+84, -1)
- `packages/kilo-vscode/tests/unit/session-preferences.test.ts` (+13, -1)
- `packages/kilo-vscode/tests/unit/session-provider-activity.test.ts` (+48, -0)
- `packages/kilo-vscode/tests/unit/session-queue.test.ts` (+62, -1)
- `packages/kilo-vscode/tests/unit/session-search.test.ts` (+19, -1)
- `packages/kilo-vscode/tests/unit/session-variant-store.test.ts` (+25, -0)
- `packages/kilo-vscode/tests/unit/session-variants.test.ts` (+47, -3)
- `packages/kilo-vscode/tests/unit/sidebar-search.test.ts` (+20, -3)
- `packages/kilo-vscode/tests/unit/transcript-rows-reactivity.test.ts` (+55, -0)
- `packages/kilo-vscode/tests/unit/transcript-rows.test.ts` (+86, -6)
- `packages/kilo-vscode/tests/unit/worktree-activity.test.ts` (+53, -0)
- `packages/kilo-vscode/tests/unit/worktree-diff-controller.test.ts` (+148, -12)
- `packages/kilo-vscode/tests/visual-regression.spec.mts` (+4, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+4, -0)
- `packages/kilo-vscode/tsconfig.json` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+47, -74)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+12, -27)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanelCache.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+8, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectActions.tsx` (+53, -50)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+19, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+22, -15)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+19, -12)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSearchMenu.tsx` (+39, -21)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+19, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeSectionActions.tsx` (+5, -62)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager-review.css` (+0, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+49, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/focus.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/initial-message.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/project/review-routing.ts` (+52, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/session-busy.ts` (+42, -56)
- `packages/kilo-vscode/webview-ui/agent-manager/sidebar-search.ts` (+15, -33)
- `packages/kilo-vscode/webview-ui/agent-manager/sortable-tab.tsx` (+5, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+7, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-diffs.ts` (+59, -1)
- `packages/kilo-vscode/webview-ui/diff-viewer/FileTree.tsx` (+79, -99)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+12, -28)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-open-policy.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-requests.ts` (+62, -3)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-annotations.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/documents/DocumentPanel.tsx` (+4, -20)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/BackgroundAgents.tsx` (+131, -32)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+12, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+12, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+123, -103)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionMentionPicker.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTab.tsx` (+55, -49)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabStrip.tsx` (+7, -7)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabSwitcher.tsx` (+10, -12)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+13, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeSessionTurn.tsx` (+0, -210)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeUserMessage.tsx` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/background-agents.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-sandbox-messages.ts` (+98, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ContextTab.tsx` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ActivityIcon.tsx` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/context/part-stash.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-continuation.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-parts.ts` (+24, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-preferences.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-queue.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+217, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-variant-store.ts` (+6, -4)
- `packages/kilo-vscode/webview-ui/src/context/session-variants.ts` (+15, -4)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+162, -215)
- `packages/kilo-vscode/webview-ui/src/context/transcript-rows.ts` (+11, -2)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+319, -4)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+18, -11)
- `packages/kilo-vscode/webview-ui/src/stories/section-header.stories.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/stories/session-tabs.stories.tsx` (+117, -7)
- `packages/kilo-vscode/webview-ui/src/styles/session-tabs.css` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+88, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+18, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/utils/draft-store.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/utils/session-activity.ts` (+90, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+43, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui.ts` (+3, -2)
- `packages/opencode/src/config/config.ts` (+2, -1)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+33, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui.ts` (+6, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/thread.ts` (+6, -4)
- `packages/opencode/src/kilocode/indexing-warning.ts` (+2, -1)
- `packages/opencode/src/kilocode/indexing-worker-client.ts` (+3, -2)
- `packages/opencode/src/kilocode/indexing.ts` (+12, -3)
- `packages/opencode/src/kilocode/reference.ts` (+18, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+22, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+66, -1)
- `packages/opencode/src/kilocode/session/continuation.ts` (+40, -0)
- `packages/opencode/src/kilocode/session/index.ts` (+17, -4)
- `packages/opencode/src/kilocode/snapshot/cleanup.ts` (+27, -42)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+7, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+10, -6)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+1, -0)
- `packages/opencode/src/session/compaction.ts` (+20, -5)
- `packages/opencode/src/session/prompt.ts` (+38, -24)
- `packages/opencode/src/session/system.ts` (+6, -12)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+3, -1)
- `packages/opencode/test/kilocode/cli/tui/thread.test.ts` (+9, -1)
- `packages/opencode/test/kilocode/indexing-startup.test.ts` (+72, -0)
- `packages/opencode/test/kilocode/indexing-warning.test.ts` (+8, -0)
- `packages/opencode/test/kilocode/indexing-worker.test.ts` (+32, -0)
- `packages/opencode/test/kilocode/instance-vcs-watcher.test.ts` (+5, -11)
- `packages/opencode/test/kilocode/reference.test.ts` (+32, -1)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+9, -0)
- `packages/opencode/test/kilocode/server/session-mentions.test.ts` (+192, -0)
- `packages/opencode/test/kilocode/server/session-resume.test.ts` (+216, -0)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+125, -4)
- `packages/opencode/test/kilocode/session/resume.test.ts` (+172, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+174, -1)
- `packages/opencode/test/kilocode/snapshot-repository-cleanup.test.ts` (+47, -0)
- `packages/opencode/test/kilocode/tui-config-boundary.test.ts` (+37, -0)
- `packages/opencode/test/server/httpapi-session.test.ts` (+27, -18)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+51, -2)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+38, -0)
- `packages/sdk/openapi.json` (+224, -33)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/config/index.tsx` (+11, -2)
- `packages/tui/test/kilocode/config.test.tsx` (+32, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/spinner.css` (+6, -0)
- `packages/ui/src/components/spinner.tsx` (+3, -1)
- `packages/ui/src/kilocode/spinner.ts` (+40, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index b32061e57..ddb81f008 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.5.5",
+  "version": "7.5.6",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/filesystem/search.ts
```diff
diff --git a/packages/core/src/filesystem/search.ts b/packages/core/src/filesystem/search.ts
index 66ad56a4b..dc4fc77fb 100644
--- a/packages/core/src/filesystem/search.ts
+++ b/packages/core/src/filesystem/search.ts
@@ -13,7 +13,7 @@ import { RelativePath } from "../schema"
 import { Flag } from "../flag/flag"
 // kilocode_change start
 import * as SearchTarget from "../kilocode/search-target"
-import { scanning } from "../kilocode/fff"
+import { allowed, message } from "../kilocode/fff"
 // kilocode_change end
 
 export interface Interface {
@@ -48,20 +48,25 @@ export const ripgrepLayer = Layer.effect(
       directories: [] as string[],
     }
     const directories = new Set<string>()
-    yield* ripgrep
-      .find({
-        cwd: location.directory,
-        pattern: "*",
-        limit: location.vcs ? Number.MAX_SAFE_INTEGER : 100_000,
-        onEntry: (entry) =>
-          Effect.sync(() => {
-            state.files.push(entry.path)
-            const parts = entry.path.split("/")
-            parts.slice(0, -1).forEach((_, index) => directories.add(parts.slice(0, index + 1).join("/") + path.sep))
-            state.directories = Array.from(directories)
-          }),
-      })
-      .pipe(Effect.orDie, Effect.asVoid, Effect.forkIn(scope))
+    // kilocode_change start - never eagerly enumerate a filesystem root.
+    const real = yield* fs.realPath(location.directory).pipe(Effect.catch(() => Effect.succeed(undefined)))
+    if (real && allowed(real)) {
+      yield* ripgrep
+        .find({
+          cwd: real,
+          pattern: "*",
+          limit: location.vcs ? Number.MAX_SAFE_INTEGER : 100_000,
+          onEntry: (entry) =>
+            Effect.sync(() => {
+              state.files.push(entry.path)
+              const parts = entry.path.split("/")
+              parts.slice(0, -1).forEach((_, index) => directories.add(parts.slice(0, index + 1).join("/") + path.sep))
+              state.directories = Array.from(directories)
+            }),
+        })
+        .pipe(Effect.orDie, Effect.asVoid, Effect.forkIn(scope))
+    }
+    // kilocode_change end
```

#### packages/core/src/filesystem/watcher.ts
```diff
diff --git a/packages/core/src/filesystem/watcher.ts b/packages/core/src/filesystem/watcher.ts
index 9e4ec0291..e77597e1a 100644
--- a/packages/core/src/filesystem/watcher.ts
+++ b/packages/core/src/filesystem/watcher.ts
@@ -16,6 +16,7 @@ import { Location } from "../location"
 import { lazy } from "../util/lazy"
 import { Ignore } from "./ignore"
 import { Protected } from "./protected"
+import { allowed } from "../kilocode/fff" // kilocode_change
 
 declare const KILO_LIBC: string | undefined
 
@@ -106,11 +107,13 @@ const layer = Layer.effect(
     const config = (yield* (yield* Config.Service).entries())
       .filter((entry): entry is Config.Document => entry.type === "document")
       .flatMap((item) => item.info.watcher?.ignore ?? [])
-    if (location.vcs && (yield* Flag.KILO_EXPERIMENTAL_FILEWATCHER)) {
+    // kilocode_change start
+    if (location.vcs && (yield* Flag.KILO_EXPERIMENTAL_FILEWATCHER) && allowed(location.directory)) {
       yield* Effect.forkScoped(
         subscribe(location.directory, [...Ignore.PATTERNS, ...config, ...protecteds(location.directory)]),
       )
     }
+    // kilocode_change end
 
     if (location.vcs?.type === "git") {
       const resolved = (yield* git.repo.discover(location.directory))?.gitDirectory
```

#### packages/core/src/kilocode/fff.ts
```diff
diff --git a/packages/core/src/kilocode/fff.ts b/packages/core/src/kilocode/fff.ts
index f217a4176..5601adc1d 100644
--- a/packages/core/src/kilocode/fff.ts
+++ b/packages/core/src/kilocode/fff.ts
@@ -1,9 +1,34 @@
+import { realpathSync } from "node:fs"
 import os from "os"
 import path from "path"
 
-export function scanning(directory: string) {
-  return {
-    enableFsRootScanning: directory === path.parse(directory).root,
-    enableHomeDirScanning: directory === os.homedir(),
+export const message =
+  "Automatic indexing is disabled in home and filesystem root directories. Open a project folder to enable indexing. File tools remain available."
+
+function root(directory: string, api: typeof path.posix) {
+  if (!api.isAbsolute(directory)) return false
+  return api.normalize(directory) === api.normalize(api.parse(directory).root)
+}
+
+function real(directory: string) {
+  try {
+    return realpathSync.native(directory)
+  } catch {
+    return path.resolve(directory)
   }
 }
+
+export function allowed(directory: string, home = (process.env.KILO_TEST_HOME ?? os.homedir()).trim()) {
+  const value = path.win32.normalize(directory)
+  const prefix = "\\\\?\\UNC\\"
+  const windows = value.toUpperCase().startsWith(prefix) ? `\\\\${value.slice(prefix.length)}` : value
+  if (root(directory, path.posix) || root(windows, path.win32)) return false
+  const resolved = real(directory)
+  if (root(resolved, path)) return false
+  const base = real(home)
+  return process.platform === "win32" ? resolved.toLowerCase() !== base.toLowerCase() : resolved !== base
+}
+
+export function notices(directory: string) {
+  return allowed(directory) ? [] : [{ path: directory, message }]
+}
```

#### packages/core/src/kilocode/zero-id.ts
```diff
diff --git a/packages/core/src/kilocode/zero-id.ts b/packages/core/src/kilocode/zero-id.ts
new file mode 100644
index 000000000..b182d4072
--- /dev/null
+++ b/packages/core/src/kilocode/zero-id.ts
@@ -0,0 +1,5 @@
+export function zeroID(...parts: (string | number | boolean)[]) {
+  if (parts.length === 2) return `${parts[0]}\0${parts[1]}`
+  if (parts.length === 3) return `${parts[0]}\0${parts[1]}\0${parts[2]}`
+  return parts.join("\0")
+}
```


*... and more files (showing first 5)*

## opencode Changes (05ea507..df35e84)

### Commits

- df35e84 - docs(zen): add Ling 3.0 Flash Fin Free (#45923) (Jack, 2026-08-28)
- 1be9fd5 - docs(go): add Hy4 preview (#45904) (Jack, 2026-08-28)
- 755ebdb - sync release versions for v1.18.25 (opencode, 2026-08-28)
- c2e39bb - test(opencode): use native config path in permission assertion (#45849) (opencode-agent[bot], 2026-08-28)
- 733562e - fix(opencode): remove Bun dependency from Azure authentication (#45845) (opencode-agent[bot], 2026-08-28)
- 8a7cc0c - docs(go): add Qwen3.8 Flash (#45836) (Jack, 2026-08-28)
- 19db518 - sync release versions for v1.18.24 (opencode, 2026-08-28)
- 15537a4 - fix(opencode): compare config snapshots as JSON (#45784) (opencode-agent[bot], 2026-08-27)
- 790fb5b - feat(opencode): support Azure CLI authentication (#45079) (opencode-agent[bot], 2026-08-28)
- 517ee73 - fix(provider): filter unreplayable Bedrock reasoning before caching (#45769) (opencode-agent[bot], 2026-08-28)
- c77100a - chore: generate (opencode-agent[bot], 2026-08-27)
- 03afae5 - feat(opencode): load supported v2 config in v1 (#45421) (James Long, 2026-08-27)

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
- `bun.lock` (+28, -28)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/go/index.tsx` (+4, -1)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+2, -0)
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
- `packages/opencode/src/config/config.ts` (+26, -6)
- `packages/opencode/src/config/v2-compat.ts` (+449, -0)
- `packages/opencode/src/plugin/azure.ts` (+238, -3)
- `packages/opencode/src/provider/provider.ts` (+1, -0)
- `packages/opencode/src/provider/transform.ts` (+4, -5)
- `packages/opencode/test/config/config.test.ts` (+188, -1)
- `packages/opencode/test/config/fixtures/v2-compat/README.md` (+40, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/agents-commands-precedence-input.jsonc` (+17, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/agents-commands-precedence-output.json` (+29, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/agents-input.jsonc` (+15, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/agents-output.json` (+24, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/commands-input.jsonc` (+12, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/commands-output.json` (+17, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/ignored-fields-input.jsonc` (+8, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/ignored-fields-output.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/lsp-input.jsonc` (+8, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/lsp-output.json` (+14, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-enablement-input.jsonc` (+15, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-enablement-output.json` (+45, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-merge-input.jsonc` (+11, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-merge-output.json` (+18, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-oauth-input.jsonc` (+19, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-oauth-output.json` (+25, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-partial-timeout-input.jsonc` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-partial-timeout-output.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-reserved-enabled-input.jsonc` (+7, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-reserved-enabled-output.json` (+10, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-reserved-input.jsonc` (+6, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-reserved-output.json` (+12, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-timeouts-input.jsonc` (+15, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-timeouts-output.json` (+28, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-object-input.jsonc` (+4, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-object-output.json` (+4, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-string-input.jsonc` (+4, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-string-output.json` (+6, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-variant-input.jsonc` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-variant-output.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/settings-input.jsonc` (+12, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/settings-output.json` (+27, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/settings-precedence-input.jsonc` (+15, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/settings-precedence-output.json` (+17, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/skills-input.jsonc` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/skills-output.json` (+6, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/clear-shell-input.jsonc` (+7, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/clear-shell-normalized.json` (+5, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/clear-shell-output.jsonc` (+5, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/clear-shell-patch.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-json-input.json` (+18, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-json-normalized.json` (+11, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-json-output.json` (+20, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-json-patch.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-jsonc-input.jsonc` (+19, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-jsonc-normalized.json` (+11, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-jsonc-output.jsonc` (+19, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-jsonc-patch.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/v1-overrides-input.json` (+16, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/v1-overrides-normalized.json` (+19, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/v1-overrides-output.json` (+32, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/v1-overrides-patch.json` (+6, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/preserve-v2-input.json` (+18, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/preserve-v2-normalized.json` (+11, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/preserve-v2-output.json` (+20, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/preserve-v2-patch.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/v1-overrides-input.json` (+16, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/v1-overrides-normalized.json` (+17, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/v1-overrides-output.json` (+30, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/v1-overrides-patch.json` (+6, -0)
- `packages/opencode/test/config/snapshot.ts` (+8, -0)
- `packages/opencode/test/config/v2-compat.test.ts` (+400, -0)
- `packages/opencode/test/plugin/azure.test.ts` (+502, -0)
- `packages/opencode/test/provider/transform.test.ts` (+130, -1)
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
- `packages/web/src/content/docs/ar/go.mdx` (+12, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/bs/go.mdx` (+12, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/da/go.mdx` (+12, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/de/go.mdx` (+12, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/es/go.mdx` (+12, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/fr/go.mdx` (+12, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/go.mdx` (+12, -0)
- `packages/web/src/content/docs/it/go.mdx` (+12, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/ja/go.mdx` (+12, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/ko/go.mdx` (+12, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/nb/go.mdx` (+12, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/pl/go.mdx` (+12, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/providers.mdx` (+33, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+12, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/ru/go.mdx` (+12, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/th/go.mdx` (+12, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/tr/go.mdx` (+12, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+12, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+12, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+4, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 78b0a05..0ce0fa7 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.23",
+  "version": "1.18.25",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ba3653d..37afa0b 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.23",
+  "version": "1.18.25",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index f4ab6c5..5d333cf 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.23",
+  "version": "1.18.25",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/filesystem/search.ts
- `src/core/` - review core changes from packages/core/src/filesystem/watcher.ts
- `src/core/` - review core changes from packages/core/src/kilocode/fff.ts
- `src/core/` - review core changes from packages/core/src/kilocode/zero-id.ts
- `src/core/` - review core changes from packages/core/test/kilocode/fff.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/zero-id.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
