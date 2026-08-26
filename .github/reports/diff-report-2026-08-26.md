# Upstream Changes Report
Generated: 2026-08-26 06:50:29

## Summary
- kilocode: 125 commits, 278 files changed
- opencode: 14 commits, 78 files changed

## kilocode Changes (193a0b5e7..24b1fa1fc)

### Commits

- 24b1fa1fc - Merge pull request #13441 from Kilo-Org/jetbrains/release/v7.1.0-rc.4 (Kirill Kalishev, 2026-08-25)
- 8986b9cf5 - docs(jetbrains): edit changelog for v7.1.0-rc.4 (Kirill Kalishev, 2026-08-25)
- 80e3b2ee4 - release(jetbrains): v7.1.0-rc.4 (kilo-maintainer[bot], 2026-08-25)
- a604d9fe7 - Merge pull request #13423 from Kilo-Org/gentle-badger (Kirill Kalishev, 2026-08-25)
- cb7470b04 - chore: ignore JetBrains worktree state (kirillk, 2026-08-25)
- b3e198869 - Merge remote-tracking branch 'origin/main' into gentle-badger (kirillk, 2026-08-25)
- 20d547fd1 - chore: ignore jetbrains config (kirillk, 2026-08-25)
- a5f62bc2d - fix(jetbrains): keep worktree PR badges clickable (kirillk, 2026-08-25)
- 24e324799 - Merge pull request #13432 from Kilo-Org/nimble-reef (Kirill Kalishev, 2026-08-25)
- a7839e860 - Merge pull request #13431 from Kilo-Org/sleepy-meadow (Kirill Kalishev, 2026-08-25)
- 80e82130c - fix(jetbrains): let overlays take the pointer over from the transcript (kirillk, 2026-08-25)
- 4078d7cf0 - fix(jetbrains): hide session hover popup behind a blocking overlay (kirillk, 2026-08-25)
- e1e0f7538 - fix(jetbrains): plain worktree labels, quieter icons, prune deleted session status (kirillk, 2026-08-25)
- a6a6a3aca - fix(jetbrains): resolve worktree paths and evict cache canonically (kirillk, 2026-08-25)
- 6ecfca502 - Merge pull request #13376 from Kilo-Org/fix-abort-error-flash (Marius, 2026-08-25)
- 64ab942a1 - fix(jetbrains): keep shifted session popups pointing at the card (kirillk, 2026-08-25)
- 1aa18c1d2 - Merge pull request #13429 from Kilo-Org/investigate-worktree-scroll-reset (Marius, 2026-08-25)
- 145809f45 - Merge pull request #13430 from Kilo-Org/investigate-duplicate-sse-rendering (Marius, 2026-08-25)
- a5fcb33d6 - test(jetbrains): stop frontend tests opening a real browser (kirillk, 2026-08-25)
- d81a0b9b8 - fix(agent-manager): skip scroll restore on selection changes (marius-kilocode, 2026-08-25)
- 2127b8b4e - fix(jetbrains): harden agent manager worktrees (kirillk, 2026-08-25)
- 2a001759d - fix(vscode): isolate streamed parts across session stores (marius-kilocode, 2026-08-25)
- 322426db1 - fix(jetbrains): anchor session popups on the card, not the session edge (kirillk, 2026-08-25)
- 4a823c039 - Merge pull request #13411 from Kilo-Org/optimize-worktree-diff-loading (Marius, 2026-08-25)
- 71869fd88 - fix(agent-manager): preserve intentional sidebar scrolling (marius-kilocode, 2026-08-25)
- 7427eedfd - perf(agent-manager): combine worktree diff summary scans (marius-kilocode, 2026-08-25)
- 28d0f3f45 - fix(jetbrains): keep the Agents dot up until the attention is resolved (kirillk, 2026-08-25)
- 5da8d6b85 - fix(agent-manager): preserve worktree list scroll on deletion (marius-kilocode, 2026-08-25)
- bf07f6571 - fix(agent-manager): keep merged app below lint limit (marius-kilocode, 2026-08-25)
- a1ccea47b - fix(jetbrains): badge failed sessions in session lists and raise the Agents dot (kirillk, 2026-08-25)
- f38a963a2 - Merge pull request #13418 from Kilo-Org/fix/13378-location-ref-key (Marius, 2026-08-25)
- 3b91d099d - Merge pull request #13428 from Kilo-Org/fix/agent-manager-history-queue (Marius, 2026-08-25)
- f80d7d3b5 - fix(jetbrains): clear the Agents tab dot once the attention has been read (kirillk, 2026-08-25)
- b629accd3 - fix(jetbrains): show failed sessions on their worktree row (kirillk, 2026-08-25)
- e0aeb8471 - fix(agent-manager): avoid stale history switch entries (marius-kilocode, 2026-08-25)
- 485a2ff6a - Merge pull request #13420 from Kilo-Org/fix/cli-startup-review (Marius, 2026-08-25)
- ab89791c3 - Merge origin/main into fix-abort-error-flash (marius-kilocode, 2026-08-25)
- 2eb5bf3a9 - Merge pull request #13425 from Kilo-Org/fix-background-subagent-promotion-edge-cases (Marius, 2026-08-25)
- d8eda0a0d - Merge pull request #13419 from Kilo-Org/fix-agent-manager-provider-selection (Marius, 2026-08-25)
- 526acce93 - Merge pull request #13417 from Kilo-Org/fix-vscode-sync-filter-lifecycle (Marius, 2026-08-25)
- 7230c71b2 - fix(agent-manager): scope full-screen diff notices (marius-kilocode, 2026-08-25)
- 9af0f67c0 - fix(cli): avoid narrow shutdown runtime load (marius-kilocode, 2026-08-25)
- d4098801c - Merge pull request #13421 from Kilo-Org/fix/agent-manager-history-routing (Marius, 2026-08-25)
- 0ab894d64 - fix(agent-manager): remove unreachable provider check (marius-kilocode, 2026-08-25)
- 3f8346758 - fix(vscode): keep sync filter window moving (marius-kilocode, 2026-08-25)
- 1f6c8ef0c - fix(agent-manager): handle overlapping history switches (marius-kilocode, 2026-08-25)
- 52bf54673 - Merge pull request #13416 from Kilo-Org/validate-13413-luna-fast (Marius, 2026-08-25)
- e748515a2 - fix(vscode): guard subagent promotion edge cases (marius-kilocode, 2026-08-25)
- 047c9893a - fix(jetbrains): keep session popups inside the visible view (kirillk, 2026-08-25)
- 53770f6c4 - fix(jetbrains): keep the running icon after resuming a stopped session (kirillk, 2026-08-25)
- 235d98d95 - fix(jetbrains): add new worktrees to the top of the list (kirillk, 2026-08-25)
- a2cd74bc5 - fix(jetbrains): keep the account overlay hidden after a prompted worktree start (kirillk, 2026-08-25)
- 057b48cc0 - fix(jetbrains): render worktree session titles in regular weight (kirillk, 2026-08-25)
- c38ad0b3b - merge main into optimize worktree diff loading (marius-kilocode, 2026-08-25)
- 105bc0505 - Merge pull request #13378 from Kilo-Org/investigate-kilo-memory-usage (Marius, 2026-08-25)
- 71211f140 - refactor(agent-manager): share diff cleanup callback (marius-kilocode, 2026-08-25)
- 13023c9da - refactor(agent-manager): simplify cancellation cleanup (marius-kilocode, 2026-08-25)
- 0f576d086 - fix(agent-manager): preserve scoped history activation (marius-kilocode, 2026-08-25)
- a79c2f36a - Merge pull request #13379 from Kilo-Org/investigate-local-model-date-prompt-issue (Marius, 2026-08-25)
- 184ed2300 - fix(cli): address startup review feedback (marius-kilocode, 2026-08-25)
- 5fea23bbc - chore(agent-manager): stay under app line cap (marius-kilocode, 2026-08-25)
- 78692a7f2 - fix(agent-manager): allow explicit provider selection (marius-kilocode, 2026-08-25)
- 4b3cd34be - Merge remote-tracking branch 'origin/main' into fix-abort-error-flash (marius-kilocode, 2026-08-25)
- 651dab1a1 - fix(agent-manager): address diff review feedback (marius-kilocode, 2026-08-25)
- 1aeb62604 - fix(cli): align file location cache keys (marius-kilocode, 2026-08-25)
- 45695e619 - fix(vscode): bound sync filter state (marius-kilocode, 2026-08-25)
- b1f1dec04 - fix(agent-manager): use valid terminal close code (marius-kilocode, 2026-08-25)
- b0100195f - Merge pull request #13413 from Kilo-Org/audit-webgl-terminal-rendering (Marius, 2026-08-25)
- b0469ae8e - Merge origin/main into fix-abort-error-flash (marius-kilocode, 2026-08-25)
- 3f6d83c12 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-25)
- f561d95a6 - Merge pull request #13412 from Kilo-Org/optimize-cli-startup-time (Marius, 2026-08-25)
- e540e5a06 - Merge pull request #13410 from Kilo-Org/fix-kilo-high-cpu-usage (Marius, 2026-08-25)
- dee2a279f - Merge pull request #13408 from Kilo-Org/fix-session-scroll-flicker (Marius, 2026-08-25)
- f2da2eeab - Merge pull request #13409 from Kilo-Org/update-bun-to-latest (Marius, 2026-08-25)
- 1110616b5 - Merge pull request #13393 from Kilo-Org/fix-background-continuation-for-parallel-subagents (Marius, 2026-08-25)
- 116a064e9 - Merge pull request #13407 from Kilo-Org/plan-agent-manager-sessions (Marius, 2026-08-25)
- befab09aa - test(agent-manager): cover diff cancellation races (marius-kilocode, 2026-08-25)
- c2e8c216b - fix(agent-manager): address terminal renderer review (marius-kilocode, 2026-08-25)
- 44b438363 - fix(agent-manager): namespace diff data by project (marius-kilocode, 2026-08-25)
- 6a0335704 - fix(agent-manager): close diff cache review gaps (marius-kilocode, 2026-08-25)
- db40b6db1 - fix(agent-manager): remove unsafe WebGL terminal renderer (marius-kilocode, 2026-08-25)
- 4ca951c88 - perf(cli): optimize startup time (marius-kilocode, 2026-08-25)
- 694e21a19 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-25)
- b41784c2d - Merge remote-tracking branch 'origin/main' into update-bun-to-latest (marius-kilocode, 2026-08-25)
- 32dbe140a - fix(cli): handle Bun stream cancellation errors (marius-kilocode, 2026-08-25)
- 0440d1aa5 - Merge branch 'main' into investigate-local-model-date-prompt-issue (Marius, 2026-08-25)
- 3503136b1 - test(cli): cover fractional message timestamps (marius-kilocode, 2026-08-25)
- 9bc84d218 - fix(vscode): address transcript review feedback (marius-kilocode, 2026-08-25)
- ea74bda39 - perf(agent-manager): optimize worktree diff loading (marius-kilocode, 2026-08-25)
- d6e50cd15 - fix(vscode): deduplicate sync event delivery (marius-kilocode, 2026-08-25)
- eba00e6af - chore(cli): update Bun to 1.4.0 (marius-kilocode, 2026-08-25)
- c51694703 - style(vscode): format transcript row test (marius-kilocode, 2026-08-25)
- 4736250c4 - fix(vscode): stabilize streaming transcript scrolling (marius-kilocode, 2026-08-25)
- b1934a392 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-25)
- c92cac8a8 - fix(cli): keep location map scoped to listener (marius-kilocode, 2026-08-25)
- 534b6a19d - Merge pull request #13406 from Kilo-Org/optimize-sidebar-terminal-rendering (Marius, 2026-08-25)
- 755bc5abc - Delete .kilo/plans/agent-manager-sessions-behind-project-history-button.md (Marius, 2026-08-25)
- 54e3e8ef4 - fix(vscode): clarify background promotion action (marius-kilocode, 2026-08-25)
- efacf3f95 - Merge branch 'main' into investigate-kilo-memory-usage (marius-kilocode, 2026-08-25)
- 955b2c578 - fix(cli): stabilize editor context history (marius-kilocode, 2026-08-25)
- 4c0767c52 - fix(vscode): hide subagent promotion in readonly views (marius-kilocode, 2026-08-25)
- 229c27dc4 - fix(agent-manager): fall back to DOM renderer on WebGL context loss and keep hidden terminal layout size (marius-kilocode, 2026-08-25)
- 58f87e637 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-25)
- 6bf00bfef - fix(agent-manager): restore worktree skeleton list style (marius-kilocode, 2026-08-25)
- 05a54aad0 - fix(agent-manager): drop unused session skeleton (marius-kilocode, 2026-08-25)
- e1c578495 - Merge pull request #13405 from Kilo-Org/remove-unused-button-functionality (Marius, 2026-08-25)
- 11e4a38ad - test(cli): cover background job promotion route (marius-kilocode, 2026-08-25)
- 26a2aee93 - Merge remote-tracking branch 'origin/main' into investigate-local-model-date-prompt-issue (marius-kilocode, 2026-08-25)
- 28b16ea71 - test(cli): make editor context path assertion portable (marius-kilocode, 2026-08-25)
- 2f7301368 - feat(agent-manager): replace sessions list with a per-project history button (marius-kilocode, 2026-08-25)
- 80024c019 - style(agent-manager): prettier formatting for terminal replay code (marius-kilocode, 2026-08-25)
- 1c39f8376 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-25)
- 47599a304 - perf(agent-manager): render terminal output with WebGL and pause hidden terminals (marius-kilocode, 2026-08-25)
- 538b893a6 - fix(vscode): remove model reset button (marius-kilocode, 2026-08-25)
- 9d262793a - Merge pull request #13385 from Kilo-Org/docs-agent-manager-terminal-context (Marius, 2026-08-25)
- 49481e32e - Merge pull request #13391 from Kilo-Org/docs-background-agents (Marius, 2026-08-25)
- 5bc81ece1 - fix(cli): annotate shared location map binding (marius-kilocode, 2026-08-24)
- 7e633ce27 - fix(vscode): promote parallel subagents independently (marius-kilocode, 2026-08-24)
- ce555bb34 - fix(cli): preserve isolated location map test graphs (marius-kilocode, 2026-08-24)
- 34d7f0abd - docs(agent-manager): clarify terminal context routing (marius-kilocode, 2026-08-24)
- ef64b4b32 - docs(vscode): document background agent status strip (marius-kilocode, 2026-08-24)
- c658cd4c1 - fix(cli): stabilize historical editor routes (marius-kilocode, 2026-08-24)
- 903c02794 - fix(cli): share location services across server routes (marius-kilocode, 2026-08-24)
- 54bb7f3de - fix(cli): preserve editor context prompt prefix (marius-kilocode, 2026-08-24)
- e779480ab - fix(vscode): hide manual interruption warning (marius-kilocode, 2026-08-24)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager-models.ts` (+1, -1)
- `packages/opencode/src/kilocode/tool/agent-manager-models.txt` (+2, -2)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+23, -5)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/aisdk.ts` (+1, -1)

#### Other Changes
- `.changeset/agent-manager-history-routing-fix.md` (+5, -0)
- `.changeset/agent-manager-history-switch-queue.md` (+5, -0)
- `.changeset/agent-manager-sessions-button.md` (+5, -0)
- `.changeset/agent-manager-terminal-render-performance.md` (+5, -0)
- `.changeset/calm-agent-manager-streams.md` (+5, -0)
- `.changeset/explicit-agent-manager-provider.md` (+6, -0)
- `.changeset/fast-agent-manager-diffs.md` (+5, -0)
- `.changeset/fix-background-promotion-edge-cases.md` (+6, -0)
- `.changeset/fix-cli-startup-followup.md` (+5, -0)
- `.changeset/fix-sync-filter-lifecycle.md` (+5, -0)
- `.changeset/individual-background-subagent-promotion.md` (+5, -0)
- `.changeset/isolated-reasoning-streams.md` (+5, -0)
- `.changeset/jetbrains-worktree-list-fixes.md` (+5, -0)
- `.changeset/jetbrains-worktree-pr-badge-clicks.md` (+5, -0)
- `.changeset/jetbrains-worktree-safety.md` (+5, -0)
- `.changeset/overlay-takes-hover.md` (+5, -0)
- `.changeset/plain-worktree-headers.md` (+5, -0)
- `.changeset/quick-clis-rest.md` (+5, -0)
- `.changeset/quiet-editor-location-watchers.md` (+5, -0)
- `.changeset/quiet-manual-interruptions.md` (+5, -0)
- `.changeset/remove-model-reset.md` (+5, -0)
- `.changeset/sidebar-scroll-preservation.md` (+5, -0)
- `.changeset/smooth-streaming-transcript.md` (+6, -0)
- `.changeset/stable-editor-context-prompt-prefix.md` (+5, -0)
- `.changeset/steady-location-keys.md` (+5, -0)
- `.changeset/terminal-replay-close-code.md` (+5, -0)
- `.changeset/update-bun-1-4.md` (+5, -0)
- `.gitignore` (+1, -0)
- `CONTRIBUTING.md` (+2, -2)
- `bun.lock` (+12, -12)
- `bunfig.toml` (+1, -1)
- `nix/bun.nix` (+4, -4)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -2)
- `packages/containers/bun-node/Dockerfile` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+3, -1)
- `packages/kilo-docs/pages/automate/extending/shell-integration.md` (+4, -4)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/context-mentions.md` (+3, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/index.md` (+22, -0)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-layout-correction-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-model-override-200-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-model-override-420-chromium-linux.png` (+0, -3)
- `packages/kilo-jetbrains/CHANGELOG.md` (+19, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendActivityManager.kt` (+12, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+80, -18)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+7, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceManager.kt` (+22, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorkspaceState.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendActivityManagerTest.kt` (+30, -3)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+180, -3)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceTest.kt` (+53, -16)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentAttention.kt` (+6, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+7, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeActivity.kt` (+9, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+6, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeIcons.kt` (+9, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatsView.kt` (+44, -33)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+25, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionActivityKind.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupController.kt` (+31, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupGeometry.kt` (+58, -17)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartView.kt` (+13, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/LayeredOverlayPanel.kt` (+80, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListModel.kt` (+33, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListRenderer.kt` (+33, -14)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktree-local.svg` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktree-local_dark.svg` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeBranch.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeBranch_dark.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeLock.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeLock_dark.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentAttentionTest.kt` (+18, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerPanelTest.kt` (+42, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeControllerTest.kt` (+44, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeIconsTest.kt` (+13, -10)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhBannerTest.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinatorTest.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeActivityTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanelTest.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloSessionServiceTest.kt` (+40, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ConnectionDelayTest.kt` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/HistoryLoadingTest.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupGeometryTest.kt` (+133, -34)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartViewTest.kt` (+41, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+154, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUiTest.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeBrowserLauncher.kt` (+37, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/LayeredOverlayPanelTest.kt` (+69, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloWorkspaceStateDto.kt` (+1, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorktreeDto.kt` (+1, -0)
- `packages/kilo-ui/src/components/icon.tsx` (+4, -0)
- `packages/kilo-ui/src/components/message-part.css` (+24, -2)
- `packages/kilo-ui/src/components/message-part.tsx` (+5, -0)
- `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` (+69, -4)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+37, -2)
- `packages/kilo-vscode/docs/mercury-next-edit-testing.html` (+1, -1)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+18, -10)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+6, -6)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+8, -5)
- `packages/kilo-vscode/src/agent-manager/continue-in-worktree.ts` (+12, -6)
- `packages/kilo-vscode/src/agent-manager/local-diff.ts` (+155, -49)
- `packages/kilo-vscode/src/agent-manager/project/messages.ts` (+58, -1)
- `packages/kilo-vscode/src/agent-manager/project/state-gate.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/project/wiring.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/semaphore.ts` (+21, -11)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+8, -0)
- `packages/kilo-vscode/src/diff/SourceController.ts` (+37, -5)
- `packages/kilo-vscode/src/diff/sources/catalog.ts` (+12, -1)
- `packages/kilo-vscode/src/diff/sources/worktree.ts` (+13, -3)
- `packages/kilo-vscode/src/features.ts` (+15, -1)
- `packages/kilo-vscode/src/kilo-provider/abort.ts` (+11, -4)
- `packages/kilo-vscode/src/kilo-provider/config-snapshot.ts` (+5, -4)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+5, -3)
- `packages/kilo-vscode/src/kilo-provider/model-state.ts` (+0, -7)
- `packages/kilo-vscode/src/provider-actions.ts` (+5, -4)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.test.ts` (+69, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+53, -12)
- `packages/kilo-vscode/src/services/cli-backend/connection-utils.ts` (+27, -0)
- `packages/kilo-vscode/src/services/cli-backend/explicit-abort.ts` (+112, -0)
- `packages/kilo-vscode/tests/unit/abort.test.ts` (+26, -3)
- `packages/kilo-vscode/tests/unit/agent-manager-ambient-setup.test.ts` (+14, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+5, -3)
- `packages/kilo-vscode/tests/unit/agent-manager-sidebar-scroll.test.ts` (+165, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-layout.test.ts` (+27, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-replay.test.ts` (+144, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-worktree-diffs.test.ts` (+13, -2)
- `packages/kilo-vscode/tests/unit/agent-project-selection.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/background-agents.test.ts` (+33, -10)
- `packages/kilo-vscode/tests/unit/connection-utils.test.ts` (+189, -1)
- `packages/kilo-vscode/tests/unit/continue-in-worktree.test.ts` (+37, -24)
- `packages/kilo-vscode/tests/unit/early-message.test.ts` (+12, -0)
- `packages/kilo-vscode/tests/unit/explicit-abort.test.ts` (+131, -0)
- `packages/kilo-vscode/tests/unit/git-ops.test.ts` (+14, -0)
- `packages/kilo-vscode/tests/unit/indexing-utils.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+3, -1)
- `packages/kilo-vscode/tests/unit/local-diff.test.ts` (+46, -0)
- `packages/kilo-vscode/tests/unit/navigate.test.ts` (+42, -206)
- `packages/kilo-vscode/tests/unit/sandboxing-settings.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/section-helpers.test.ts` (+6, -9)
- `packages/kilo-vscode/tests/unit/semaphore.test.ts` (+16, -0)
- `packages/kilo-vscode/tests/unit/session-model-store.test.ts` (+0, -47)
- `packages/kilo-vscode/tests/unit/session-parts.test.ts` (+60, -1)
- `packages/kilo-vscode/tests/unit/source-controller.test.ts` (+55, -0)
- `packages/kilo-vscode/tests/unit/transcript-rows.test.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+156, -141)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+34, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanelCache.tsx` (+129, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+0, -28)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+1, -23)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsSection.tsx` (+18, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/SessionRowActions.tsx` (+40, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+3, -20)
- `packages/kilo-vscode/webview-ui/agent-manager/Skeleton.tsx` (+0, -19)
- `packages/kilo-vscode/webview-ui/agent-manager/UnassignedSessionsSection.tsx` (+0, -92)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeSectionActions.tsx` (+11, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+67, -128)
- `packages/kilo-vscode/webview-ui/agent-manager/apply-to-local.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/history-actions.tsx` (+20, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/navigate.ts` (+3, -22)
- `packages/kilo-vscode/webview-ui/agent-manager/project-nav.ts` (+15, -21)
- `packages/kilo-vscode/webview-ui/agent-manager/project/review-state.ts` (+3, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/revert-file.ts` (+18, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/review-composers.ts` (+42, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/section-helpers.ts` (+1, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/sidebar-scroll.ts` (+38, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SideTerminalPanel.tsx` (+8, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+58, -32)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/ambient.ts` (+11, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/index.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+23, -17)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/replay.ts` (+159, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-diffs.ts` (+73, -18)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-requests.ts` (+11, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/BackgroundAgents.tsx` (+2, -29)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+0, -14)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+39, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/background-agents.ts` (+0, -15)
- `packages/kilo-vscode/webview-ui/src/components/chat/task-tool-state.ts` (+26, -0)
- `packages/kilo-vscode/webview-ui/src/components/history/HistoryView.tsx` (+13, -2)
- `packages/kilo-vscode/webview-ui/src/components/history/SessionList.tsx` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-parts.ts` (+7, -2)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+7, -51)
- `packages/kilo-vscode/webview-ui/src/context/transcript-rows.ts` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/history.stories.tsx` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/stories/prompt-input.stories.tsx` (+1, -29)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+12, -9)
- `packages/opencode/script/build.ts` (+2, -9)
- `packages/opencode/src/bun-compat.d.ts` (+12, -0)
- `packages/opencode/src/index.ts` (+27, -21)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+7, -0)
- `packages/opencode/src/kilocode/cli/bootstrap-runtime.ts` (+30, -0)
- `packages/opencode/src/kilocode/cli/lazy-commands.ts` (+182, -0)
- `packages/opencode/src/kilocode/cli/lazy-kilo-commands.ts` (+67, -0)
- `packages/opencode/src/kilocode/cli/setup.ts` (+44, -35)
- `packages/opencode/src/kilocode/config/default-plugins.ts` (+2, -5)
- `packages/opencode/src/kilocode/editor-context.ts` (+5, -13)
- `packages/opencode/src/kilocode/help-command.ts` (+6, -3)
- `packages/opencode/src/kilocode/indexing-feature.ts` (+0, -20)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+13, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+13, -0)
- `packages/opencode/src/kilocode/server/reference-reconciler.ts` (+2, -2)
- `packages/opencode/src/kilocode/session/prompt.ts` (+47, -40)
- `packages/opencode/src/kilocode/storage/json-migration.ts` (+4, -1)
- `packages/opencode/src/provider/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/file.ts` (+13, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+4, -4)
- `packages/opencode/src/session/prompt.ts` (+6, -3)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+51, -0)
- `packages/opencode/test/kilocode/cli-shutdown.test.ts` (+3, -20)
- `packages/opencode/test/kilocode/cli/bootstrap-runtime.test.ts` (+27, -0)
- `packages/opencode/test/kilocode/cli/lazy-commands.test.ts` (+49, -0)
- `packages/opencode/test/kilocode/cli/lazy-completion.test.ts` (+14, -0)
- `packages/opencode/test/kilocode/editor-context-injection.test.ts` (+142, -0)
- `packages/opencode/test/kilocode/indexing-feature.test.ts` (+0, -10)
- `packages/opencode/test/kilocode/reference.test.ts` (+2, -1)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+7, -0)
- `packages/opencode/test/kilocode/sessions/ingest-shutdown-lifecycle.test.ts` (+59, -0)
- `packages/opencode/test/kilocode/shared-location-map-key.test.ts` (+37, -0)
- `packages/opencode/test/kilocode/shared-location-map.test.ts` (+32, -0)
- `packages/opencode/test/kilocode/storage/json-migration.test.ts` (+16, -0)
- `packages/opencode/test/kilocode/system-prompt.test.ts` (+6, -0)
- `packages/opencode/test/server/session-actions.test.ts` (+38, -2)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+38, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+36, -0)
- `patches/@ff-labs%2Ffff-bun@0.9.4.patch` (+106, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/src/aisdk.ts
```diff
diff --git a/packages/core/src/aisdk.ts b/packages/core/src/aisdk.ts
index b604dac66..bc0280036 100644
--- a/packages/core/src/aisdk.ts
+++ b/packages/core/src/aisdk.ts
@@ -35,7 +35,7 @@ function wrapSSE(res: Response, ms: number, ctl: AbortController) {
         const id = setTimeout(() => {
           const err = new Error("SSE read timed out")
           ctl.abort(err)
-          void reader.cancel(err)
+          void reader.cancel(err).catch(() => undefined) // kilocode_change - handle Bun 1.4 cancellation rejection
           reject(err)
         }, ms)
 
```

#### packages/opencode/src/kilocode/tool/agent-manager-models.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager-models.ts b/packages/opencode/src/kilocode/tool/agent-manager-models.ts
index 613489a1c..d70d697db 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager-models.ts
+++ b/packages/opencode/src/kilocode/tool/agent-manager-models.ts
@@ -89,7 +89,7 @@ export const AgentManagerModelsTool = Tool.define<
               offset,
               total: matches.length,
               nextOffset,
-              hint: "Pass a model name (or one of its providers/IDs) as the agent_manager task `model`. Agent Manager picks the provider, preferring the one used by the current turn.",
+              hint: "Pass a model name (or one of its providers/IDs) as the agent_manager task `model`. Add the task `provider` to force one of the listed providers; otherwise Agent Manager prefers the provider used by the current turn.",
             }),
             metadata: { count: models.length, total: matches.length },
           }
```

#### packages/opencode/src/kilocode/tool/agent-manager-models.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager-models.txt b/packages/opencode/src/kilocode/tool/agent-manager-models.txt
index 8c73797bd..8571d6045 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager-models.txt
+++ b/packages/opencode/src/kilocode/tool/agent-manager-models.txt
@@ -1,5 +1,5 @@
 Search the models available to Agent Manager sessions and inspect their reasoning variants.
 
-Use this tool before `agent_manager` when you need to pick a model or reasoning effort. Results are grouped by model, not by provider, because you select a model and Agent Manager chooses the provider for you. With no arguments it returns the top available models (capped at 20); pass `query` to search by model name or ID, and `offset` to page further. The query is matched leniently: it is case-insensitive, ignores spacing and punctuation, and is order-independent, so `opus claude`, `glm5.2`, and `gpt5` all work. You do not need the exact model name.
+Use this tool before `agent_manager` when you need to pick a model or reasoning effort. Results are grouped by model, not by provider, and list every provider that offers each model so you can constrain the provider when needed. With no arguments it returns the top available models (capped at 20); pass `query` to search by model name or ID, and `offset` to page further. The query is matched leniently: it is case-insensitive, ignores spacing and punctuation, and is order-independent, so `opus claude`, `glm5.2`, and `gpt5` all work. You do not need the exact model name.
 
-Each result includes the model name, its reasoning variant names, and the providers that offer it (informational only). Pass the model name back as the `agent_manager` task `model`. Agent Manager resolves the provider automatically, preferring the provider used by the current turn and falling back to the Kilo Gateway, so you do not need to choose a provider yourself.
+Each result includes the model name, its reasoning variant names, and the providers that offer it. Pass the model name back as the `agent_manager` task `model`; pass one of the listed provider IDs as the task `provider` when the provider must be explicit. When `provider` is omitted, Agent Manager resolves it automatically, preferring the one used by the current turn and falling back to the Kilo Gateway.
```

#### packages/opencode/src/kilocode/tool/agent-manager.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.ts b/packages/opencode/src/kilocode/tool/agent-manager.ts
index 8166f8302..630f08200 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.ts
+++ b/packages/opencode/src/kilocode/tool/agent-manager.ts
@@ -28,6 +28,10 @@ const Task = Schema.Struct({
     description:
       "Optional model override from agent_manager_models (e.g. 'Claude Opus 4.1'). Omit unless the user requests a different model. Agent Manager otherwise inherits the current turn's model. A qualified provider/model ID is also accepted to force a specific provider.",
   }),
+  provider: Schema.optional(Schema.NullOr(Schema.String)).annotate({
+    description:
+      "Optional provider ID to constrain model resolution (e.g. 'anthropic'). Use with model to select a model from a specific provider; omit to use the current-turn provider preference.",
+  }),
   variant: Schema.optional(Schema.NullOr(Schema.String)).annotate({
     description:
       "Optional reasoning variant override from agent_manager_models. Specify it without model to override the inherited model's variant. Omit both to inherit the current turn's selection.",
@@ -41,6 +45,9 @@ const Task = Schema.Struct({
   Schema.makeFilter((task) =>
     task.model?.trim() && !task.prompt?.trim() ? "A task model requires an initial prompt" : undefined,
   ),
+  Schema.makeFilter((task) =>
+    task.provider?.trim() && !task.model?.trim() ? "A task provider requires a model" : undefined,
+  ),
   Schema.makeFilter((task) =>
     task.variant?.trim() && !task.prompt?.trim() ? "A task variant requires an initial prompt" : undefined,
   ),
@@ -245,6 +252,7 @@ function select(
     ...(task.branchName != null ? { branchName: task.branchName } : {}),
   }
   const value = task.model?.trim()
+  const provider = task.provider?.trim()
   const variant = task.variant?.trim()
   if (!value) {
     if (!variant) {
@@ -271,12 +279,21 @@ function select(
     return { task: { ...base, model: source.model, variant } }
   }
 
-  const { pool, names } = lookup(all, value)
+  const scope = provider ? all.filter((item) => item.providerID === provider) : all
+  if (provider && scope.length === 0) {
+    return {
+      error: `Task ${index + 1} provider is not available for model selection: ${provider}. Requested model: ${value}.`,
+    }
+  }
+
+  const { pool, names } = lookup(scope, value)
   if (pool.length === 0) {
-    const close = suggest(all, value)
+    const close = suggest(scope, value)
     const hint = close.length ? ` Closest matches: ${close.join(", ")}.` : ""
```

#### packages/opencode/src/kilocode/tool/agent-manager.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.txt b/packages/opencode/src/kilocode/tool/agent-manager.txt
index 1d081b91d..4dbb410b8 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.txt
+++ b/packages/opencode/src/kilocode/tool/agent-manager.txt
@@ -14,7 +14,7 @@ Modes:
 - `worktree`: creates a new Agent Manager git worktree for each task, like the New Worktree dialog.
 - `local`: creates Agent Manager sessions in the current workspace directory without git worktree isolation.
 
-Each task may provide a prompt, a short display name, a branch name, a `model`, and a model-specific reasoning `variant`. By default, omit `model` and `variant`: prompted tasks inherit the exact model and reasoning variant used by the current turn. Only specify `model` when the user explicitly asks to use or compare a different model, and only specify `variant` when the user explicitly asks for a different reasoning variant. A variant can be specified without a model to override the inherited model's variant. Never choose a different model merely because work is being fanned out. Specify an override `model` by name (e.g. "Claude Opus 4.1"); the name is matched leniently (case-insensitive, punctuation/spacing-insensitive, order-independent), so an approximate name like "opus 4.1" works and you do not need the exact name. Agent Manager picks the provider for you, preferring the provider used by the current turn and falling back to the Kilo Gateway. A qualified `provider/model` ID is also accepted to force a specific provider. If the name is ambiguous and matches several different models, the tool returns the candidates so you can choose. A model or variant selection requires an initial prompt so the session can persist that selection. Keep display names short because Agent Manager cards are narrow. Branch names are sanitized before worktree creation. Use `agent_manager_models` to search available models and variants on demand instead of guessing or loading the full model catalog. Prepared sessions without an initial prompt use the normal defaults. The agent and base branch settings always use the normal defaults.
+Each task may provide a prompt, a short display name, a branch name, a `model`, an optional `provider`, and a model-specific reasoning `variant`. By default, omit `model`, `provider`, and `variant`: prompted tasks inherit the exact model and reasoning variant used by the current turn. Only specify `model` when the user explicitly asks to use or compare a different model, and only specify `variant` when the user explicitly asks for a different reasoning variant. A variant can be specified without a model to override the inherited model's variant. Specify `provider` with `model` to force a model-name match to one provider ID. Never choose a different model merely because work is being fanned out. Specify an override `model` by name (e.g. "Claude Opus 4.1"); the name is matched leniently (case-insensitive, punctuation/spacing-insensitive, order-independent), so an approximate name like "opus 4.1" works and you do not need the exact name. Agent Manager picks the provider for you, preferring the provider used by the current turn and falling back to the Kilo Gateway. A qualified `provider/model` ID is also accepted to force a specific provider. If the name is ambiguous and matches several different models, the tool returns the candidates so you can choose. A model or variant selection requires an initial prompt so the session can persist that selection. Keep display names short because Agent Manager cards are narrow. Branch names are sanitized before worktree creation. Use `agent_manager_models` to search available models and variants on demand instead of guessing or loading the full model catalog. Prepared sessions without an initial prompt use the normal defaults. The agent and base branch settings always use the normal defaults.
 
 By default, multiple tasks are started as independent Agent Manager sessions. Set `versions` to true only when all tasks are alternate versions of the same work that should be compared together. Versioned worktrees are grouped in Agent Manager and branch names may receive version suffixes.
 
```


## opencode Changes (2f36ffe..13c2759)

### Commits

- 13c2759 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-26)
- 2564a4f - remove map (Frank, 2026-08-26)
- fd9bd44 - docs: mention Exa and Parallel as web search backends (#38395) (Ravitez Dondeti, 2026-08-25)
- b72b500 - fix(core): recover legacy database migration history (#45061) (opencode-agent[bot], 2026-08-25)
- ac1c048 - docs(go): add Grok 4.6 (#45042) (Jack, 2026-08-26)
- 8615731 - fix(console): rate limit checkout session creation (#45007) (Dax, 2026-08-25)
- a7444bf - fix(ui): restore focus in stacked dialogs (#44928) (OpeOginni, 2026-08-25)
- 69aaa22 - zen: void invoice of cancelled subscription (Frank, 2026-08-25)
- 322e2b9 - chore: generate (opencode-agent[bot], 2026-08-25)
- afd6f3b - zen: display quota usage breakdown (Frank, 2026-08-25)
- 1e86be2 - update inference headers (Frank, 2026-08-25)
- a57230b - fix(app): drop archived sessions from home list right away (#44905) (Nathan Thomassin, 2026-08-25)
- 6bb1a76 - update inference headers (Frank, 2026-08-25)
- bdcb6be - update inference headers (Frank, 2026-08-25)

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
- `packages/console/core/src/schema/billing.sql.ts` (+1, -0)
- `packages/core/src/database/migration.ts` (+33, -6)
- `packages/core/src/database/migration/20260410174513_workspace-name.ts` (+4, -1)
- `packages/core/test/database-migration.test.ts` (+63, -0)

#### Other Changes
- `packages/app/src/context/global-sync/home-session-index.test.ts` (+32, -1)
- `packages/app/src/context/global-sync/home-session-index.ts` (+13, -1)
- `packages/app/src/pages/home/home-sessions-controller.tsx` (+4, -2)
- `packages/app/src/pages/session/session-archive.ts` (+3, -0)
- `packages/console/app/src/i18n/ar.ts` (+9, -1)
- `packages/console/app/src/i18n/br.ts` (+9, -1)
- `packages/console/app/src/i18n/da.ts` (+9, -1)
- `packages/console/app/src/i18n/de.ts` (+9, -1)
- `packages/console/app/src/i18n/en.ts` (+9, -1)
- `packages/console/app/src/i18n/es.ts` (+9, -1)
- `packages/console/app/src/i18n/fr.ts` (+9, -1)
- `packages/console/app/src/i18n/it.ts` (+9, -1)
- `packages/console/app/src/i18n/ja.ts` (+9, -1)
- `packages/console/app/src/i18n/ko.ts` (+9, -1)
- `packages/console/app/src/i18n/no.ts` (+9, -1)
- `packages/console/app/src/i18n/pl.ts` (+9, -1)
- `packages/console/app/src/i18n/ru.ts` (+9, -1)
- `packages/console/app/src/i18n/th.ts` (+9, -1)
- `packages/console/app/src/i18n/tr.ts` (+9, -1)
- `packages/console/app/src/i18n/uk.ts` (+9, -1)
- `packages/console/app/src/i18n/zh.ts` (+9, -1)
- `packages/console/app/src/i18n/zht.ts` (+9, -1)
- `packages/console/app/src/lib/lite-usage.ts` (+60, -0)
- `packages/console/app/src/routes/black/index.tsx` (+0, -3)
- `packages/console/app/src/routes/black/subscribe/[plan].tsx` (+0, -489)
- `packages/console/app/src/routes/go/index.tsx` (+3, -3)
- `packages/console/app/src/routes/stripe/webhook.ts` (+7, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.module.css` (+114, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+331, -30)
- `packages/console/app/src/routes/workspace/common.tsx` (+3, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+5, -1)
- `packages/console/app/src/routes/zen/util/redis.ts` (+8, -0)
- `packages/console/app/test/liteUsage.test.ts` (+75, -0)
- `packages/stats/app/src/i18n.ts` (+1, -2)
- `packages/stats/app/src/i18n/ar.ts` (+0, -1)
- `packages/stats/app/src/i18n/br.ts` (+0, -1)
- `packages/stats/app/src/i18n/da.ts` (+0, -1)
- `packages/stats/app/src/i18n/de.ts` (+0, -1)
- `packages/stats/app/src/i18n/es.ts` (+0, -1)
- `packages/stats/app/src/i18n/fr.ts` (+0, -1)
- `packages/stats/app/src/i18n/it.ts` (+0, -1)
- `packages/stats/app/src/i18n/ja.ts` (+0, -1)
- `packages/stats/app/src/i18n/ko.ts` (+0, -1)
- `packages/stats/app/src/i18n/no.ts` (+0, -1)
- `packages/stats/app/src/i18n/pl.ts` (+0, -1)
- `packages/stats/app/src/i18n/ru.ts` (+0, -1)
- `packages/stats/app/src/i18n/th.ts` (+0, -1)
- `packages/stats/app/src/i18n/tr.ts` (+0, -1)
- `packages/stats/app/src/i18n/uk.ts` (+0, -1)
- `packages/stats/app/src/i18n/zh.ts` (+0, -1)
- `packages/stats/app/src/i18n/zht.ts` (+0, -1)
- `packages/stats/app/src/routes/index.tsx` (+2, -122)
- `packages/stats/app/src/routes/section-heading.tsx` (+10, -4)
- `packages/ui/src/context/dialog.tsx` (+2, -2)
- `packages/web/src/content/docs/ar/go.mdx` (+8, -7)
- `packages/web/src/content/docs/bs/go.mdx` (+8, -7)
- `packages/web/src/content/docs/cli.mdx` (+1, -0)
- `packages/web/src/content/docs/da/go.mdx` (+8, -7)
- `packages/web/src/content/docs/de/go.mdx` (+8, -7)
- `packages/web/src/content/docs/es/go.mdx` (+8, -7)
- `packages/web/src/content/docs/fr/go.mdx` (+8, -7)
- `packages/web/src/content/docs/go.mdx` (+8, -7)
- `packages/web/src/content/docs/it/go.mdx` (+8, -7)
- `packages/web/src/content/docs/ja/go.mdx` (+8, -7)
- `packages/web/src/content/docs/ko/go.mdx` (+8, -7)
- `packages/web/src/content/docs/nb/go.mdx` (+8, -7)
- `packages/web/src/content/docs/pl/go.mdx` (+8, -7)
- `packages/web/src/content/docs/pt-br/go.mdx` (+8, -7)
- `packages/web/src/content/docs/ru/go.mdx` (+8, -7)
- `packages/web/src/content/docs/th/go.mdx` (+8, -7)
- `packages/web/src/content/docs/tools.mdx` (+5, -3)
- `packages/web/src/content/docs/tr/go.mdx` (+8, -7)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+8, -7)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+8, -7)

### Key Diffs

#### packages/console/core/src/schema/billing.sql.ts
```diff
diff --git a/packages/console/core/src/schema/billing.sql.ts b/packages/console/core/src/schema/billing.sql.ts
index b177858..c788b6a 100644
--- a/packages/console/core/src/schema/billing.sql.ts
+++ b/packages/console/core/src/schema/billing.sql.ts
@@ -129,6 +129,7 @@ export const UsageTable = mysqlTable(
     sessionID: varchar("session_id", { length: 30 }),
     enrichment: json("enrichment").$type<{
       plan: "sub" | "byok" | "lite"
+      costMultiplier?: number
     }>(),
   },
   (table) => [...workspaceIndexes(table), index("usage_time_created").on(table.workspaceID, table.timeCreated)],
```

#### packages/core/src/database/migration.ts
```diff
diff --git a/packages/core/src/database/migration.ts b/packages/core/src/database/migration.ts
index 90dee8a..644b22a 100644
--- a/packages/core/src/database/migration.ts
+++ b/packages/core/src/database/migration.ts
@@ -54,12 +54,39 @@ export function applyOnly(db: Database, input: Migration[]) {
       if (
         yield* db.get(sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${"__drizzle_migrations"}`)
       ) {
-        yield* db.run(sql`
-          INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
-          SELECT name, ${Date.now()}
-          FROM ${sql.identifier("__drizzle_migrations")}
-          WHERE name IS NOT NULL
-        `)
+        const named = (yield* db.all<{ name: string }>(
+          sql`SELECT name FROM pragma_table_info('__drizzle_migrations')`,
+        )).some((column) => column.name === "name")
+
+        if (named) {
+          yield* db.run(sql`
+            INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
+            SELECT name, ${Date.now()}
+            FROM ${sql.identifier("__drizzle_migrations")}
+            WHERE name IS NOT NULL
+          `)
+        }
+
+        if (!named) {
+          const entries = yield* db.all<{ created_at: number; prefix: string | null }>(sql`
+            SELECT created_at, strftime('%Y%m%d%H%M%S', created_at / 1000, 'unixepoch') AS prefix
+            FROM ${sql.identifier("__drizzle_migrations")}
+            WHERE created_at IS NOT NULL
+          `)
+
+          for (const entry of entries) {
+            const migration = input.find((item) => item.id.startsWith(`${entry.prefix}_`))
+            if (!migration) {
+              return yield* Effect.die(
+                new Error(`Legacy migration timestamp ${entry.created_at} does not match any known migration`),
+              )
+            }
+            yield* db.run(sql`
+              INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
+              VALUES (${migration.id}, ${Date.now()})
+            `)
+          }
+        }
         completed = new Set(
           (yield* db.all<{ id: string }>(sql`SELECT id FROM ${sql.identifier("migration")}`)).map((row) => row.id),
         )
```

#### packages/core/src/database/migration/20260410174513_workspace-name.ts
```diff
diff --git a/packages/core/src/database/migration/20260410174513_workspace-name.ts b/packages/core/src/database/migration/20260410174513_workspace-name.ts
index 18483e1..8a8557e 100644
--- a/packages/core/src/database/migration/20260410174513_workspace-name.ts
+++ b/packages/core/src/database/migration/20260410174513_workspace-name.ts
@@ -5,6 +5,9 @@ export default {
   id: "20260410174513_workspace-name",
   up(tx) {
     return Effect.gen(function* () {
+      const columns = yield* tx.all<{ name: string }>(`PRAGMA table_info(\`workspace\`)`)
+      const name = columns.some((column) => column.name === "name") ? "`name`" : "''"
+
       yield* tx.run(`PRAGMA foreign_keys=OFF;`)
       yield* tx.run(`
         CREATE TABLE \`__new_workspace\` (
@@ -19,7 +22,7 @@ export default {
         );
       `)
       yield* tx.run(
-        `INSERT INTO \`__new_workspace\`(\`id\`, \`type\`, \`branch\`, \`name\`, \`directory\`, \`extra\`, \`project_id\`) SELECT \`id\`, \`type\`, \`branch\`, \`name\`, \`directory\`, \`extra\`, \`project_id\` FROM \`workspace\`;`,
+        `INSERT INTO \`__new_workspace\`(\`id\`, \`type\`, \`branch\`, \`name\`, \`directory\`, \`extra\`, \`project_id\`) SELECT \`id\`, \`type\`, \`branch\`, ${name}, \`directory\`, \`extra\`, \`project_id\` FROM \`workspace\`;`,
       )
       yield* tx.run(`DROP TABLE \`workspace\`;`)
       yield* tx.run(`ALTER TABLE \`__new_workspace\` RENAME TO \`workspace\`;`)
```

#### packages/core/test/database-migration.test.ts
```diff
diff --git a/packages/core/test/database-migration.test.ts b/packages/core/test/database-migration.test.ts
index b381cc7..464ce26 100644
--- a/packages/core/test/database-migration.test.ts
+++ b/packages/core/test/database-migration.test.ts
@@ -8,6 +8,7 @@ import { Effect, Layer } from "effect"
 import { eq, inArray, sql } from "drizzle-orm"
 import { DatabaseMigration } from "@opencode-ai/core/database/migration"
 import { migrations } from "@opencode-ai/core/database/migration.gen"
+import workspaceNameMigration from "@opencode-ai/core/database/migration/20260410174513_workspace-name"
 import sessionUsageMigration from "@opencode-ai/core/database/migration/20260510033149_session_usage"
 import normalizeStoragePathsMigration from "@opencode-ai/core/database/migration/20260601010001_normalize_storage_paths"
 import sessionMessageProjectionOrderMigration from "@opencode-ai/core/database/migration/20260603040000_session_message_projection_order"
@@ -38,6 +39,68 @@ const run = <A, E>(effect: Effect.Effect<A, E, SqlClientService>) =>
 const makeDb = EffectDrizzleSqlite.makeWithDefaults()
 
 describe("DatabaseMigration", () => {
+  test("defaults missing workspace names while preserving legacy workspace data", async () => {
+    await run(
+      Effect.gen(function* () {
+        const db = yield* makeDb
+        yield* db.run(sql`
+          CREATE TABLE workspace (
+            id text PRIMARY KEY,
+            type text NOT NULL,
+            branch text,
+            directory text,
+            extra text,
+            project_id text NOT NULL
+          )
+        `)
+        yield* db.run(sql`
+          INSERT INTO workspace (id, type, branch, directory, extra, project_id)
+          VALUES ('wrk_legacy', 'remote', 'main', '/repo', '{}', 'proj_legacy')
+        `)
+
+        yield* DatabaseMigration.applyOnly(db, [workspaceNameMigration])
+
+        expect(yield* db.get(sql`SELECT id, name, branch, directory, extra FROM workspace`)).toEqual({
+          id: "wrk_legacy",
+          name: "",
+          branch: "main",
+          directory: "/repo",
+          extra: "{}",
+        })
+      }),
+    )
+  })
+
+  test("imports unnamed legacy Drizzle journal entries by their actual migration timestamps", async () => {
+    await run(
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/aisdk.ts
- `src/tool/agent-manager-models.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager-models.ts changes
- `src/tool/agent-manager-models.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager-models.txt changes
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
