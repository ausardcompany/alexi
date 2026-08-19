# Upstream Changes Report
Generated: 2026-08-19 06:43:03

## Summary
- kilocode: 180 commits, 427 files changed
- opencode: 19 commits, 60 files changed

## kilocode Changes (91a337e31..0004b748b)

### Commits

- 0004b748b - Merge pull request #13218 from Kilo-Org/jetbrains/release/v7.1.0-rc.2 (Kirill Kalishev, 2026-08-18)
- c94808062 - docs(jetbrains): edit changelog for v7.1.0-rc.2 (Kirill Kalishev, 2026-08-18)
- dda58f04c - release(jetbrains): v7.1.0-rc.2 (kilo-maintainer[bot], 2026-08-18)
- e4e410da2 - Merge pull request #13215 from Kilo-Org/fix/jetbrains-public-api-release (Kirill Kalishev, 2026-08-18)
- 03aac0ae3 - fix(jetbrains): preserve recovered session states (kirillk, 2026-08-18)
- 940467b32 - Merge pull request #13208 from Kilo-Org/clean-musician (Kirill Kalishev, 2026-08-18)
- ae3eb9b40 - fix(jetbrains): show empty panel for empty sessions (kirillk, 2026-08-18)
- c3a9f0839 - fix(jetbrains): reuse session modal layout for migration wizard (kirillk, 2026-08-18)
- 9e1ef74c2 - fix(jetbrains): keep migration wizard across reconnects and restore worktree session after migration (kirillk, 2026-08-18)
- 8ae524bec - fix(jetbrains): avoid verifier-blocked API usage (kirillk, 2026-08-18)
- c90f5d688 - Merge pull request #13210 from Kilo-Org/fix-deduplicate-skill-catalog (Marius, 2026-08-18)
- 39d273512 - Merge branch 'main' into fix-deduplicate-skill-catalog (Marius, 2026-08-18)
- eb3f47029 - Merge pull request #13212 from Kilo-Org/jetbrains/release/v7.1.0-rc.1 (Kirill Kalishev, 2026-08-18)
- ca8cc76c8 - Merge branch 'main' into fix-deduplicate-skill-catalog (Marius, 2026-08-18)
- cf75c6938 - docs(jetbrains): edit changelog for v7.1.0-rc.1 (Kirill Kalishev, 2026-08-18)
- 029e817a1 - Merge pull request #13211 from Kilo-Org/indispensable-iguanacolossus (Marius, 2026-08-18)
- 5a8a8f811 - release(jetbrains): v7.1.0-rc.1 (kilo-maintainer[bot], 2026-08-18)
- 9aef0fb44 - Merge pull request #12433 from Kilo-Org/puddle-barometer (Kirill Kalishev, 2026-08-18)
- db3bba027 - test(jetbrains): decouple delete failure manager test (kirillk, 2026-08-18)
- a9c3d301b - test(core): make project copy cleanup idempotent (marius-kilocode, 2026-08-18)
- b92dd5820 - test(jetbrains): wait for async worktree test updates (kirillk, 2026-08-18)
- 73ffe7da9 - ci: skip JetBrains checks for CLI-only changes (kirillk, 2026-08-18)
- 45a69a825 - Merge branch 'main' into puddle-barometer (Kirill Kalishev, 2026-08-18)
- 20312aff9 - ci: ignore Kilo plan files in path filters (kirillk, 2026-08-18)
- 66d7e47a3 - chore: remove plan files from PR (kirillk, 2026-08-18)
- 8d717a05d - fix(cli): remove duplicate skill catalog (marius-kilocode, 2026-08-18)
- 724c52fb4 - ci: skip JS typecheck for JetBrains-only changes (kirillk, 2026-08-18)
- 97abdab66 - fix(core): prevent concurrent WAL recovery crashes (#13180) (Johnny Eric Amancio, 2026-08-18)
- 2a73fbfc9 - Merge pull request #13203 from Kilo-Org/revert-strict-agent-manager-tool-schema (Marius, 2026-08-18)
- b563c0a2c - Update packages/opencode/test/kilocode/agent-manager-tool.test.ts (Marius, 2026-08-18)
- 06998004f - Revert "Merge pull request #13197 from Kilo-Org/fix-agent-manager-tool-schema" (marius-kilocode, 2026-08-18)
- 3acb1ec38 - fix(tui): keep Kilo Gateway models visible in the model picker (#13170) (Johnny Eric Amancio, 2026-08-18)
- 1b0e9404b - Merge pull request #13201 from Kilo-Org/fix-permission-prompt-scrolling (Marius, 2026-08-18)
- d4f3a3a9e - fix(cli): keep ask and plan modes read-only under broad permission rules (#13124) (Johnny Eric Amancio, 2026-08-18)
- d9f0eff30 - fix(cli): prevent VS Code server connection failure on unwritable state paths (#13115) (Johnny Eric Amancio, 2026-08-18)
- facd3f170 - Merge pull request #13200 from Kilo-Org/fix-inline-diff-viewer-scroll-jump (Marius, 2026-08-18)
- 91809136b - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-18)
- 1317b38a2 - fix(vscode): preserve diff rendering in scrollable permission prompts (marius-kilocode, 2026-08-18)
- 017410bf6 - fix(cli): accept JWT share tokens when importing sessions (#13183) (Evgeny Shurakov, 2026-08-18)
- eb731248c - Merge pull request #13197 from Kilo-Org/fix-agent-manager-tool-schema (Marius, 2026-08-18)
- 9f04990c5 - Merge pull request #13195 from quanzhuo/issues/13134 (Marius, 2026-08-18)
- e4058bfd9 - Merge pull request #13199 from Kilo-Org/cosmic-oval (Marius, 2026-08-18)
- 704577a56 - Merge pull request #13196 from Kilo-Org/fix-import-pull-request-refspec-exclusion (Marius, 2026-08-18)
- bee6fb3b2 - fix(vscode): keep permission prompt actions reachable with large diffs (marius-kilocode, 2026-08-18)
- 94b426179 - fix(agent-manager): preserve tool schema guidance (marius-kilocode, 2026-08-18)
- 62996f1f3 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-18)
- dfd7a487a - docs(cli): explain Kilo upgrade version source (marius-kilocode, 2026-08-18)
- 59048c44b - fix(vscode): stabilize inline diff scrolling (marius-kilocode, 2026-08-18)
- ee00a4f0a - fix(agent-manager): avoid tracking deleted PR branches (marius-kilocode, 2026-08-18)
- abad71cff - Merge pull request #13194 from Kilo-Org/fix-worktree-title-description-leak (Marius, 2026-08-18)
- 6131ed269 - fix(cli): preserve Kilo upgrade version lookup (marius-kilocode, 2026-08-18)
- db0784bd7 - fix(agent-manager): make tool requests strict (marius-kilocode, 2026-08-18)
- 35e4dadd1 - fix(agent-manager): preserve sparse root sessions (marius-kilocode, 2026-08-18)
- b4c83878e - fix(agent-manager): use explicit git fetch refspecs (marius-kilocode, 2026-08-18)
- af158e615 - fix(agent-manager): ignore subagent sessions in worktree labels (marius-kilocode, 2026-08-18)
- 94ec2a89b - Merge pull request #13178 from Kilo-Org/fix-macos-sandbox-git-write-permission (Marius, 2026-08-18)
- ee7866e21 - Merge branch 'main' into fix-macos-sandbox-git-write-permission (Marius, 2026-08-18)
- 6e1270534 - Merge pull request #13173 from Kilo-Org/acidic-fennel (Marius, 2026-08-18)
- 1c05bbe6b - Merge pull request #13179 from Kilo-Org/filter-sessions-by-worktree-2 (Marius, 2026-08-18)
- c5dd13498 - Merge pull request #13175 from Kilo-Org/ginger-appeal (Marius, 2026-08-18)
- f54c215e6 - fix(cli): persist snapshot disable across restarts (全卓, 2026-08-18)
- 923cf79ee - fix(cli): clean truncation files by mtime (marius-kilocode, 2026-08-18)
- d7d3ddaf1 - fix(vscode): complete sandbox escalation translations (marius-kilocode, 2026-08-18)
- 9788f4970 - Merge branch 'main' into acidic-fennel (Marius, 2026-08-18)
- 90524ceb2 - Merge branch 'main' into fix-macos-sandbox-git-write-permission (Marius, 2026-08-18)
- ada5efdd7 - test(jetbrains): clear leaked modality before pumping the EDT (kirillk, 2026-08-17)
- 667adae1e - test(jetbrains): stabilize async EDT test synchronization (kirillk, 2026-08-17)
- 75f11ca3e - fix(jetbrains): unfollow transcript on keyboard scroll-up (kirillk, 2026-08-17)
- bb81cb329 - Merge branch 'pr-13128' into puddle-barometer (kirillk, 2026-08-17)
- bfac65573 - Merge branch 'main' into fix-openrouter-model-compatibility (Kirill Kalishev, 2026-08-17)
- a417b220f - fix(jetbrains): polish session prompt chrome (kirillk, 2026-08-17)
- 2b45ac5a2 - fix(jetbrains): restyle connection status banner (kirillk, 2026-08-17)
- d9e48b425 - Revert "fix(cli): stabilize CI unit tests" (kirillk, 2026-08-17)
- 65aea829a - fix(cli): stabilize CI unit tests (kirillk, 2026-08-17)
- c22ca3ab7 - fix(jetbrains): keep session scroll pinned (kirillk, 2026-08-17)
- 8db5a8c5c - feat(jetbrains): center session readable width (kirillk, 2026-08-17)
- e13864aa8 - fix(jetbrains): simplify scroll bottom state (kirillk, 2026-08-17)
- 485573657 - fix(jetbrains): preserve tail follow during expansion (kirillk, 2026-08-17)
- ede14046d - fix(jetbrains): address agent manager review feedback (kirillk, 2026-08-17)
- b144666a5 - fix(jetbrains): keep session scroll pinned on resize (kirillk, 2026-08-17)
- a066d0f98 - fix(permission): cover tui sandbox escalation prompt (marius-kilocode, 2026-08-17)
- 0067dbac3 - fix(vscode): preserve inspector sync scope (marius-kilocode, 2026-08-17)
- 4279750e0 - test(vscode): update session selection contract (marius-kilocode, 2026-08-17)
- d563ba2a7 - fix(vscode): isolate subagent inspector sessions (marius-kilocode, 2026-08-17)
- 2477bde2c - fix(agent-manager): default worktree session history (marius-kilocode, 2026-08-17)
- 4cbd411d5 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-17)
- 86af8dd7c - fix(opencode): prompt before sandboxed git writes (marius-kilocode, 2026-08-17)
- 385dd1434 - test(vscode): update compact model label expectation (marius-kilocode, 2026-08-17)
- ae26eed9b - fix(vscode): shorten prompt model label (marius-kilocode, 2026-08-17)
- d95c5d460 - fix(vscode): format subagent inspector files (marius-kilocode, 2026-08-17)
- 53d0af74f - feat(vscode): add subagent inspector tabs (marius-kilocode, 2026-08-17)
- 5ad8db8a6 - fix(jetbrains): refine outcome error padding (kirillk, 2026-08-17)
- 1c93e9879 - docs(jetbrains): add DialogView extraction plan (kirillk, 2026-08-16)
- 8e70bc1ff - refactor(jetbrains): extract DialogView base (kirillk, 2026-08-16)
- 58b6edd04 - fix(jetbrains): refine session outcome error card (kirillk, 2026-08-16)
- 707b1ca89 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-14)
- 3f676e588 - fix(jetbrains): show git install banner (kirillk, 2026-08-14)
- 430306e37 - feat(jetbrains): centralize gh status polling (kirillk, 2026-08-14)
- 0116b6364 - fix(jetbrains): address session outcome review (kirillk, 2026-08-14)
- 7994a80a3 - Merge remote-tracking branch 'origin/main' into fix-openrouter-model-compatibility (kirillk, 2026-08-14)
- b1a8893f1 - fix(jetbrains): show failed turn outcomes in chat (kirillk, 2026-08-14)
- aadf773f2 - feat(jetbrains): badge agent manager as beta (kirillk, 2026-08-14)
- 3219e32e6 - Merge branch 'speckled-globe' into fix-openrouter-model-compatibility (kirillk, 2026-08-14)
- 66819e69a - fix(jetbrains): let worktree toolbar inherit theme (kirillk, 2026-08-14)
- 1ebc4a88b - fix(jetbrains): sync worktree terminal titles (kirillk, 2026-08-14)
- 71918edb5 - feat(jetbrains): refine worktree header actions (kirillk, 2026-08-14)
- 1d964e082 - feat(jetbrains): open worktree terminals (kirillk, 2026-08-13)
- b7d41af3a - fix(jetbrains): pad worktree header right edge (kirillk, 2026-08-13)
- 7ecb04de1 - fix(jetbrains): refine worktree open action (kirillk, 2026-08-13)
- 106b5f4d5 - feat(jetbrains): open worktrees in new window (kirillk, 2026-08-12)
- 24ff69827 - test(jetbrains): stabilize worktree rename tests (kirillk, 2026-08-12)
- c6c74b6fe - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-12)
- ce32dd154 - fix: keep CI fix scoped to JetBrains (kirillk, 2026-08-12)
- 7524abc38 - fix: stabilize PR test failures (kirillk, 2026-08-12)
- f6f8aa563 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-12)
- f5ff70ea3 - fix(jetbrains): improve worktree base branch selector (kirillk, 2026-08-11)
- d17cd80cc - fix(jetbrains): simplify new worktree dialog (kirillk, 2026-08-11)
- 9e09eafb8 - fix(jetbrains): start worktree session with picked mode, model, and effort (kirillk, 2026-08-11)
- 579245d8f - feat(jetbrains): use prompt panel for new worktrees (kirillk, 2026-08-11)
- 45540e159 - fix(jetbrains): clarify worktree action menu (kirillk, 2026-08-11)
- 6d520d66d - fix(jetbrains): tighten active list menu spacing (kirillk, 2026-08-11)
- 686208eb0 - fix(jetbrains): align worktree editor titles (kirillk, 2026-08-11)
- a39dc5ddf - fix(jetbrains): restore history back context (kirillk, 2026-08-11)
- ac23a8e2c - fix(jetbrains): move settings into tool window gear (kirillk, 2026-08-11)
- bf1ebd686 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-10)
- 17d42485b - feat(jetbrains): refine worktree session header (kirillk, 2026-08-10)
- 745ee1ecc - fix(jetbrains): harden agent manager session lifecycle (kirillk, 2026-08-10)
- 5ba298792 - fix(cli): remove unreleased opencode changes (kirillk, 2026-08-10)
- 32cb1a494 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-10)
- 89532bb89 - fix(jetbrains): improve worktree PR tooltips (kirillk, 2026-08-07)
- c8694bcff - fix(jetbrains): align worktree action badges (kirillk, 2026-08-07)
- b2015b864 - fix(jetbrains): tolerate profile bad request (kirillk, 2026-08-07)
- 0ec086377 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-07)
- b6dcee651 - feat(jetbrains): make worktree metrics actionable (kirillk, 2026-08-07)
- 6a69c7fc4 - fix(jetbrains): refine worktree row layout (kirillk, 2026-08-06)
- d1ae90774 - feat(jetbrains): add worktree row menus (kirillk, 2026-08-06)
- 4100415ac - feat(jetbrains): show worktree change and PR badges (kirillk, 2026-08-05)
- 46eac5371 - feat(jetbrains): hover rename/delete + popover rename in session history (kirillk, 2026-08-05)
- 271c121c3 - Merge branch 'main' of github.com:Kilo-Org/kilocode into puddle-barometer (kirillk, 2026-08-05)
- ec6e72882 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-04)
- a89936bf8 - feat(jetbrains): use active list for history rows (kirillk, 2026-08-04)
- 319d1f485 - fix(jetbrains): stabilize worktree list updates (kirillk, 2026-08-03)
- c78461d59 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-03)
- 38e822042 - fix(jetbrains): keep worktree selection on next row after delete (kirillk, 2026-08-03)
- 916548a8c - fix(jetbrains): persist worktree order (kirillk, 2026-08-03)
- aafde0bf7 - feat(agent-manager): reveal worktree and session row actions on hover (kirillk, 2026-08-03)
- 5ab0ba24b - fix(jetbrains): sync worktree selection with editor (kirillk, 2026-08-03)
- 46d19bf62 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-03)
- 03fb182c4 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-02)
- f4aa4707e - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-01)
- 34073e2ff - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-08-01)
- a388c0147 - fix(cli): remove stale ai sdk stream option (kirillk, 2026-07-31)
- 34b1489ef - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-07-31)
- 1709104aa - fix(jetbrains): overlay active list action cells (kirillk, 2026-07-31)
- 506aaf63a - fix(jetbrains): trail active list badges after titles (kirillk, 2026-07-31)
- 919d312fa - feat(jetbrains): show worktree activity badges (kirillk, 2026-07-30)
- a678e549f - fix(jetbrains): adopt the agent session title onto worktrees, not the placeholder (kirillk, 2026-07-30)
- ee9a441cc - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-07-30)
- 6af1c0619 - refactor(jetbrains): tidy worktree agent manager dead code and leaks (kirillk, 2026-07-30)
- 0db965252 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-07-29)
- cd3204c15 - fix(jetbrains): remove worktree editor inset (kirillk, 2026-07-29)
- a201a3429 - fix(jetbrains): focus worktree session list by default (kirillk, 2026-07-29)
- 174c64659 - fix(jetbrains): align agent manager list surfaces (kirillk, 2026-07-29)
- 698b2806c - fix(jetbrains): polish agent manager rename UX (kirillk, 2026-07-29)
- cb3fd9a93 - fix(cli): type MCP tool call results (kirillk, 2026-07-29)
- d522ff80e - feat(jetbrains): support agent manager renaming (kirillk, 2026-07-29)
- 91e2f0612 - fix(jetbrains): refine session list selection (kirillk, 2026-07-28)
- a0dcab0c6 - fix(jetbrains): open created worktree editor (kirillk, 2026-07-28)
- 8254e9c52 - fix(jetbrains): share active list delete UX (kirillk, 2026-07-28)
- 4acb9e46a - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-07-28)
- 5b0acee01 - fix(jetbrains): show pending session deletion state (kirillk, 2026-07-28)
- 3056986f2 - fix(jetbrains): group pending worktree session under today (kirillk, 2026-07-27)
- bf6fd12f6 - fix(jetbrains): preserve worktree editor focus intent (kirillk, 2026-07-27)
- f3d11341c - fix(jetbrains): keep active list section rows compact (kirillk, 2026-07-27)
- 89163e7e0 - feat(jetbrains): match worktree session rows to history and persist new sessions (kirillk, 2026-07-27)
- 15efe98cb - fix(jetbrains): match project view open focus behavior (kirillk, 2026-07-27)
- b6bd9f224 - feat(jetbrains): manage worktree sessions (kirillk, 2026-07-27)
- 47b38190a - feat(jetbrains): open worktree session editor tabs (kirillk, 2026-07-26)
- bf2a04c74 - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-07-24)
- e783d200b - Merge remote-tracking branch 'origin/main' into puddle-barometer (kirillk, 2026-07-24)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/task.ts` (+5, -2)
- `packages/opencode/src/tool/registry.ts` (+0, -16)
- `packages/opencode/src/tool/shell.ts` (+39, -12)
- `packages/opencode/src/tool/shell/shell.txt` (+1, -0)
- `packages/opencode/src/tool/tool.ts` (+1, -4)
- `packages/opencode/src/tool/truncate.ts` (+8, -6)
- `packages/opencode/test/kilocode/tool/shell-unparsed.test.ts` (+14, -3)
- `packages/opencode/test/tool/skill.test.ts` (+13, -2)
- `packages/opencode/test/tool/truncation.test.ts` (+7, -3)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+88, -2)

#### Permission System (**/permission/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt` (+20, -31)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt` (+4, -4)
- `packages/opencode/src/kilocode/permission/drain.ts` (+1, -0)
- `packages/opencode/src/permission/index.ts` (+8, -3)
- `packages/opencode/test/kilocode/permission/skill-shell.test.ts` (+21, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/database/database.ts` (+4, -2)
- `packages/core/src/global.ts` (+3, -3)
- `packages/core/src/kilocode/global.ts` (+49, -0)
- `packages/core/test/kilocode/database-recovery.test.ts` (+58, -0)
- `packages/core/test/kilocode/fixture/database-recovery-worker.ts` (+30, -0)
- `packages/core/test/kilocode/global.test.ts` (+109, -0)
- `packages/core/test/project-copy.test.ts` (+1, -1)

#### Other Changes
- `.changeset/active-list-equal-rows.md` (+5, -0)
- `.changeset/ask-mode-permission-boundary.md` (+5, -0)
- `.changeset/calm-diff-scroll.md` (+5, -0)
- `.changeset/calm-sqlite-recovery.md` (+5, -0)
- `.changeset/center-jetbrains-session-width.md` (+5, -0)
- `.changeset/compact-model-trigger-label.md` (+5, -0)
- `.changeset/fallback-state-directory.md` (+5, -0)
- `.changeset/fix-duplicate-skill-catalog.md` (+5, -0)
- `.changeset/fix-import-jwt-share-url.md` (+6, -0)
- `.changeset/fix-pr-branch-refspec.md` (+5, -0)
- `.changeset/fresh-worktree-prompt.md` (+5, -0)
- `.changeset/fresh-worktrees-move.md` (+5, -0)
- `.changeset/gh-status-banners.md` (+5, -0)
- `.changeset/hover-agent-manager-actions.md` (+5, -0)
- `.changeset/jetbrains-agent-manager-beta.md` (+5, -0)
- `.changeset/jetbrains-history-hover-rename.md` (+5, -0)
- `.changeset/jetbrains-pr-worktree-tooltips.md` (+5, -0)
- `.changeset/jetbrains-profile-400-ready.md` (+5, -0)
- `.changeset/jetbrains-session-errors.md` (+5, -0)
- `.changeset/jetbrains-worktree-activity-badge.md` (+5, -0)
- `.changeset/jetbrains-worktree-adopt-session-name.md` (+5, -0)
- `.changeset/jetbrains-worktree-change-badges.md` (+5, -0)
- `.changeset/jetbrains-worktree-delete-reappear.md` (+5, -0)
- `.changeset/jetbrains-worktree-delete-selection.md` (+5, -0)
- `.changeset/jetbrains-worktree-list-stability.md` (+5, -0)
- `.changeset/jetbrains-worktree-open-focus.md` (+5, -0)
- `.changeset/jetbrains-worktree-open-in-new-window.md` (+5, -0)
- `.changeset/jetbrains-worktree-order.md` (+5, -0)
- `.changeset/jetbrains-worktree-session-deleting.md` (+5, -0)
- `.changeset/jetbrains-worktree-session-list.md` (+5, -0)
- `.changeset/jetbrains-worktree-terminal.md` (+5, -0)
- `.changeset/permission-prompt-scroll.md` (+5, -0)
- `.changeset/persist-snapshot-disable.md` (+5, -0)
- `.changeset/polite-history-rows.md` (+5, -0)
- `.changeset/prompt-focus-scroll-polish.md` (+5, -0)
- `.changeset/quiet-branches-search.md` (+5, -0)
- `.changeset/quiet-worktrees-filter.md` (+5, -0)
- `.changeset/rename-jetbrains-worktrees.md` (+5, -0)
- `.changeset/restore-kilo-upgrade-version-lookup.md` (+5, -0)
- `.changeset/sandbox-git-escalation.md` (+5, -0)
- `.changeset/scroll-resize-dialog-fixes.md` (+5, -0)
- `.changeset/show-empty-jetbrains-sessions.md` (+5, -0)
- `.changeset/subagent-inspector-tabs.md` (+5, -0)
- `.changeset/tui-gateway-model-picker.md` (+5, -0)
- `.changeset/worktree-editor-selection.md` (+5, -0)
- `.changeset/worktree-history-default.md` (+5, -0)
- `.changeset/worktree-session-history-rows.md` (+5, -0)
- `.github/workflows/publish-jetbrains-bundled.yml` (+0, -11)
- `.github/workflows/publish-jetbrains.yml` (+0, -11)
- `.github/workflows/test-jetbrains.yml` (+2, -0)
- `.github/workflows/test.yml` (+1, -0)
- `.github/workflows/typecheck.yml` (+47, -29)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-scroll-up-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/bash-with-permission-chromium-linux.png` (+2, -2)
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
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/shared/model-selector-large-catalog-chromium-linux.png` (+2, -2)
- `packages/kilo-jetbrains/AGENTS.md` (+4, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+34, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendActivityManager.kt` (+136, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+27, -5)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+33, -17)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+12, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+702, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiProvider.kt` (+15, -0)
- `packages/kilo-jetbrains/backend/src/main/resources/kilo.jetbrains.backend.xml` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendActivityManagerTest.kt` (+140, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+14, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/PreservesMigrationTest.kt` (+41, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImplTest.kt` (+49, -11)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+433, -0)
- `packages/kilo-jetbrains/frontend/build.gradle.kts` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloNotifications.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+90, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/DeleteWorktreeAction.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/DeleteWorktreeSessionAction.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/HistoryAction.kt` (+22, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/NewSessionAction.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/NewWorktreeAction.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenWorktreeDiffAction.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenWorktreePrAction.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RenameSessionAction.kt` (+2, -36)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RenameWorktreeAction.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RenameWorktreeSessionAction.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+531, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/SidePanelKeys.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhAuth.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhBanner.kt` (+87, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinator.kt` (+224, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusListener.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/KiloWorktreeService.kt` (+130, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialog.kt` (+359, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/PendingWorktreePrompt.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeActivity.kt` (+35, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+262, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeDataKeys.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeEditorMatcher.kt` (+35, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeIcons.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeNameCache.kt` (+81, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeNames.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreePrHeaderView.kt` (+170, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionDataKeys.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorKind.kt` (+62, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManager.kt` (+331, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+588, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionFileType.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListController.kt` (+135, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatsView.kt` (+218, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusBinding.kt` (+46, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusService.kt` (+107, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeTitle.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+21, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/migration/ui/MigrationOverlayPanel.kt` (+0, -58)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/migration/ui/MigrationWizardPanel.kt` (+19, -25)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloFrontendDynamicPluginListener.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloPluginSettings.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionActivityKind.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionHost.kt` (+257, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionManager.kt` (+17, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionSidePanelManager.kt` (+33, -149)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+68, -35)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/DelayedState.kt` (+1, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+134, -36)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionControllerEvent.kt` (+2, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionUpdateQueue.kt` (+6, -17)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryController.kt` (+2, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryDataKeys.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryListRenderer.kt` (+0, -166)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryPanel.kt` (+145, -169)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryRows.kt` (+83, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionState.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/TurnOutcome.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+75, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ConnectionPanel.kt` (+25, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/RevertBanner.kt` (+15, -21)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionLayout.kt` (+17, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+36, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/EmptySessionPanel.kt` (+30, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/BranchChangesBadge.kt` (+18, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/mode/ModeItems.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelItems.kt` (+46, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/KiloPromptCompletionProvider.kt` (+2, -37)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptFuzzyRanker.kt` (+37, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+66, -39)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/LoginRequiredView.kt` (+9, -21)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/SessionOutcomeView.kt` (+165, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/{BaseQuestionView.kt => DialogView.kt}` (+61, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionView.kt` (+17, -30)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentsConfigurable.kt` (+27, -27)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/McpConfigurable.kt` (+18, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/McpEditDialog.kt` (+6, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/SkillsConfigurable.kt` (+27, -29)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/SettingsInlineList.kt` (+10, -27)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsInlineListPanel.kt` (+11, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListModel.kt` (+0, -131)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListPanel.kt` (+22, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListRenderer.kt` (+0, -162)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListView.kt` (+0, -349)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelsSettingsUi.kt` (+2, -38)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProviderListRows.kt` (+8, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUi.kt` (+20, -20)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/rules/RulesSettingsUi.kt` (+18, -19)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/DiffStatBadge.kt` (+7, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/HoverIcon.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/LayeredOverlayPanel.kt` (+6, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/ToolbarButton.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+60, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/layout/Align.kt` (+43, -21)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveList.kt` (+203, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListActions.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListDeletePopup.kt` (+66, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListEditPopup.kt` (+87, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListMenu.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListModel.kt` (+242, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListPopup.kt` (+72, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListRenderer.kt` (+333, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+746, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/util/Edt.kt` (+37, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloFileEditorProvider.kt` (+9, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVfsManager.kt` (+14, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVirtualFile.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVirtualFileKind.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVirtualFileSystem.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/layout-left-full.svg` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/layout-left-full_dark.svg` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/layout-left-partial.svg` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/layout-left-partial_dark.svg` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeBranch.svg` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeBranch_dark.svg` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeLock.svg` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeLock_dark.svg` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+43, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+90, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/KiloToolWindowFactoryTest.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+109, -103)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/NewSessionActionTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerPanelTest.kt` (+552, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeControllerTest.kt` (+442, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeSessionEditorKindTest.kt` (+71, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhBannerTest.kt` (+90, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinatorTest.kt` (+145, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialogTest.kt` (+274, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeActivityTest.kt` (+51, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeNameCacheTest.kt` (+77, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeNamesTest.kt` (+52, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreePrHeaderViewTest.kt` (+199, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManagerTest.kt` (+480, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanelTest.kt` (+608, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListControllerTest.kt` (+149, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionTitleTest.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusServiceTest.kt` (+130, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/migration/SessionUiMigrationTest.kt` (+19, -12)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionScrollTest.kt` (+164, -12)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionSidePanelManagerTest.kt` (+41, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiFactoryTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+34, -14)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiTestBase.kt` (+21, -8)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/DelayedStateTest.kt` (+2, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/DisposedStateTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/HistoryLoadingTest.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerSelectionTest.kt` (+60, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+8, -16)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionRecoveryTest.kt` (+43, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/TurnLifecycleTest.kt` (+128, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ViewSwitchingTest.kt` (+51, -24)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/WorkspaceWatchingTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/history/HistoryControllerTest.kt` (+102, -66)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/SessionModelTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ConnectionPanelTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/EmptySessionPanelTest.kt` (+25, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+84, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionLayoutTest.kt` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+51, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionRootPanelTest.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/mode/ModeItemsTest.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelItemsTest.kt` (+46, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/LoginRequiredViewTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionViewTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/SessionOutcomeViewTest.kt` (+193, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/{BaseQuestionViewTest.kt => DialogViewTest.kt}` (+98, -59)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurableTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/UserProfileConfigurableTest.kt` (+8, -20)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurableTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentCreateDialogTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentEditDialogTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentsSettingsUiTest.kt` (+19, -23)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpEditDialogTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpSettingsUiTest.kt` (+14, -18)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/SkillsSettingsUiTest.kt` (+22, -26)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveSettingsUiTest.kt` (+15, -19)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/autoapprove/SettingsInlineListTest.kt` (+9, -13)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/BaseSettingsUiTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/BaseSettingsUiWorkspaceTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/KiloReadyConfigurableTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+729, -69)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/context/ContextSettingsUiTest.kt` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/models/ModelsSettingsUiTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUiTest.kt` (+49, -53)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/rules/RulesSettingsUiTest.kt` (+23, -28)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorktreeRpcApi.kt` (+126, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/TestCoroutines.kt` (+20, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/TestPump.kt` (+45, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/TestPumpTest.kt` (+36, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/TestUiTimers.kt` (+2, -8)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/LayeredOverlayPanelTest.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/UiStyleTest.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/layout/AlignTest.kt` (+57, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListDeletePopupTest.kt` (+63, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListEditPopupTest.kt` (+75, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListMatchTest.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/picker/PickerPopupTest.kt` (+2, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/vfs/KiloVfsManagerTest.kt` (+71, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/script/clear-migration-status.sh` (+118, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+4, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorktreeRpcApi.kt` (+64, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/SessionDto.kt` (+14, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorktreeDto.kt` (+85, -0)
- `packages/kilo-ui/src/components/diff-ssr.tsx` (+1, -0)
- `packages/kilo-ui/src/components/diff.tsx` (+33, -1)
- `packages/kilo-ui/src/pierre/index.ts` (+3, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+64, -9)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+20, -3)
- `packages/kilo-vscode/src/agent-manager/project/init.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+1, -0)
- `packages/kilo-vscode/src/commands/toggle-auto-approve.ts` (+2, -0)
- `packages/kilo-vscode/src/kilo-provider/visible-task-streams.ts` (+4, -0)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+62, -0)
- `packages/kilo-vscode/tests/history-accessibility.spec.ts` (+3, -0)
- `packages/kilo-vscode/tests/model-selector-accessibility.spec.ts` (+2, -2)
- `packages/kilo-vscode/tests/permission-diff.spec.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+3, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+13, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-layout.test.ts` (+17, -1)
- `packages/kilo-vscode/tests/unit/agent-project-sessions.test.ts` (+12, -0)
- `packages/kilo-vscode/tests/unit/model-selector-utils.test.ts` (+17, -19)
- `packages/kilo-vscode/tests/unit/project-session-filter.test.ts` (+26, -0)
- `packages/kilo-vscode/tests/unit/session-select-connection.test.ts` (+5, -2)
- `packages/kilo-vscode/tests/unit/subagent-tabs.test.ts` (+92, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+87, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+45, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/ClosableTab.tsx` (+155, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/InspectorTabStrip.tsx` (+108, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/SubagentPanel.tsx` (+131, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+80, -17)
- `packages/kilo-vscode/webview-ui/agent-manager/index.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/session-filter.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/side-panel-layout.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/subagent-tabs.ts` (+90, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SideTerminalPanel.tsx` (+67, -177)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SortableTerminalTab.tsx` (+79, -171)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+1, -4)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-state.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+53, -43)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabMenu.tsx` (+11, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+20, -2)
- `packages/kilo-vscode/webview-ui/src/components/history/HistoryView.tsx` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/model-selector-utils.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+31, -12)
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
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+29, -5)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+36, -0)
- `packages/kilo-vscode/webview-ui/src/styles/permission-dock.css` (+57, -3)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+9, -0)
- `packages/opencode/src/acp/permission.ts` (+10, -3)
- `packages/opencode/src/cli/cmd/import.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/run.ts` (+4, -2)
- `packages/opencode/src/cli/cmd/run/footer.permission.tsx` (+4, -3)
- `packages/opencode/src/cli/cmd/run/permission.shared.ts` (+21, -6)
- `packages/opencode/src/installation/index.ts` (+2, -14)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+4, -4)
- `packages/opencode/src/kilocode/installation/latest.ts` (+16, -0)
- `packages/opencode/src/kilocode/sandbox/git.ts` (+113, -0)
- `packages/opencode/src/kilocode/sandbox/policy.ts` (+4, -0)
- `packages/opencode/src/kilocode/snapshot/track.ts` (+12, -19)
- `packages/opencode/src/session/tools.ts` (+72, -58)
- `packages/opencode/test/cli/import.test.ts` (+7, -0)
- `packages/opencode/test/cli/run/permission.shared.test.ts` (+16, -0)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+378, -5)
- `packages/opencode/test/kilocode/installation/upgrade.test.ts` (+5, -1)
- `packages/opencode/test/kilocode/sandbox/git.test.ts` (+49, -0)
- `packages/opencode/test/kilocode/session-share.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/skill-catalog.test.ts` (+73, -0)
- `packages/opencode/test/kilocode/snapshot-track-timeout.test.ts` (+42, -0)
- `packages/tui/src/component/dialog-model.tsx` (+18, -109)
- `packages/tui/src/kilocode/model-picker.ts` (+186, -0)
- `packages/tui/src/routes/session/permission.tsx` (+27, -5)
- `packages/tui/src/ui/dialog-select.tsx` (+9, -4)
- `packages/tui/test/kilocode/model-picker.test.ts` (+125, -0)

### Key Diffs

#### packages/core/src/database/database.ts
```diff
diff --git a/packages/core/src/database/database.ts b/packages/core/src/database/database.ts
index 024a3d4df..b1feddee6 100644
--- a/packages/core/src/database/database.ts
+++ b/packages/core/src/database/database.ts
@@ -27,9 +27,11 @@ const layer = Layer.effect(
   Effect.gen(function* () {
     const db = yield* makeDatabase
 
+    // kilocode_change start - install SQLite's busy handler before concurrent processes can race to recover the WAL
+    yield* db.run("PRAGMA busy_timeout = 5000")
     yield* db.run("PRAGMA journal_mode = WAL")
+    // kilocode_change end
     yield* db.run("PRAGMA synchronous = NORMAL")
-    yield* db.run("PRAGMA busy_timeout = 5000")
     yield* db.run("PRAGMA cache_size = -64000")
     yield* db.run("PRAGMA foreign_keys = ON")
     yield* db.run("PRAGMA wal_checkpoint(PASSIVE)")
@@ -42,7 +44,7 @@ const layer = Layer.effect(
 
 export function layerFromPath(filename: string) {
   DbPreflight.assertWritable(filename) // kilocode_change - actionable error (and self-heal for kilo-owned files) instead of an opaque wal_checkpoint crash on read-only db files
-  return layer.pipe(Layer.provide(sqliteLayer({ filename })))
+  return layer.pipe(Layer.provide(sqliteLayer({ filename, disableWAL: true }))) // kilocode_change - Database configures WAL after busy_timeout
 }
 
 export function path() {
```

#### packages/core/src/global.ts
```diff
diff --git a/packages/core/src/global.ts b/packages/core/src/global.ts
index ffc199317..10861364a 100644
--- a/packages/core/src/global.ts
+++ b/packages/core/src/global.ts
@@ -5,7 +5,7 @@ import os from "os"
 import { Context, Effect, Layer } from "effect"
 import { Flock } from "./util/flock"
 import { markNoIndex } from "./kilocode/spotlight" // kilocode_change
-import { ensureRealDir } from "./kilocode/global" // kilocode_change
+import { ensureRealDir, resolveState } from "./kilocode/global" // kilocode_change
 import { Flag } from "./flag/flag"
 import { makeGlobalNode } from "./effect/app-node"
 
@@ -22,7 +22,8 @@ const clean = (p: string | undefined) => p?.replace(/[\r\n]+/g, "")
 const data = path.join(clean(xdgData)!, app)
 const cache = path.join(clean(xdgCache)!, app)
 const config = path.join(clean(xdgConfig)!, app)
-const state = path.join(clean(xdgState)!, app)
+const preferred = path.join(clean(xdgState)!, app)
+const state = await resolveState(preferred, process.env.XDG_STATE_HOME ? undefined : path.join(data, "state"))
 // kilocode_change end
 const tmp = path.join(os.tmpdir(), app)
 
@@ -47,7 +48,6 @@ Flock.setGlobal({ state })
 await Promise.all([
   ensureRealDir(Path.data), // kilocode_change
   ensureRealDir(Path.config), // kilocode_change
-  ensureRealDir(Path.state), // kilocode_change
   ensureRealDir(Path.tmp), // kilocode_change
   ensureRealDir(Path.log), // kilocode_change
   ensureRealDir(Path.bin), // kilocode_change
```

#### packages/core/src/kilocode/global.ts
```diff
diff --git a/packages/core/src/kilocode/global.ts b/packages/core/src/kilocode/global.ts
index b57d06f7a..a98d81589 100644
--- a/packages/core/src/kilocode/global.ts
+++ b/packages/core/src/kilocode/global.ts
@@ -1,4 +1,6 @@
 import fs from "fs/promises"
+import path from "path"
+import { randomUUID } from "crypto"
 
 /**
  * Like `fs.mkdir({ recursive: true })` but also repairs broken symlinks and
@@ -21,3 +23,50 @@ export async function ensureRealDir(p: string) {
     await fs.mkdir(p, { recursive: true })
   }
 }
+
+async function writable(p: string) {
+  const probe = path.join(p, `.kilo-write-${process.pid}-${randomUUID()}`)
+  await fs.writeFile(probe, "", { flag: "wx", mode: 0o600 })
+  await fs.unlink(probe)
+}
+
+async function ready(p: string) {
+  await ensureRealDir(p)
+  await writable(p)
+}
+
+export async function resolveState(p: string, fallback?: string) {
+  const sticky =
+    fallback === undefined
+      ? false
+      : await fs.stat(fallback).then(
+          (stat) =>
+            stat.isDirectory() &&
+            writable(fallback).then(
+              () => true,
+              () => false,
+            ),
+          () => false,
+        )
+  if (sticky && fallback !== undefined) return fallback
+
+  const err = await ready(p).then(
+    () => undefined,
+    (err: unknown) => err,
+  )
+  if (err === undefined) return p
+  if (fallback === undefined) throw err
+
+  const failed = await ready(fallback).then(
```

#### packages/core/test/kilocode/database-recovery.test.ts
```diff
diff --git a/packages/core/test/kilocode/database-recovery.test.ts b/packages/core/test/kilocode/database-recovery.test.ts
new file mode 100644
index 000000000..64264bcb7
--- /dev/null
+++ b/packages/core/test/kilocode/database-recovery.test.ts
@@ -0,0 +1,58 @@
+import { describe, expect, test } from "bun:test"
+import fs from "fs/promises"
+import path from "path"
+import { Database } from "@opencode-ai/core/database/database"
+import { Effect, Layer } from "effect"
+import { tmpdir } from "../fixture/tmpdir"
+
+const wait = async (dir: string, glob: string, count = 1, end = Date.now() + 5_000): Promise<void> => {
+  const files = await Array.fromAsync(new Bun.Glob(glob).scan({ cwd: dir }))
+  if (files.length >= count) return
+  if (Date.now() >= end) throw new Error(`Timed out waiting for ${glob}`)
+  await Bun.sleep(1)
+  return wait(dir, glob, count, end)
+}
+
+const remove = async (file: string, retry = 30): Promise<void> => {
+  try {
+    await fs.rm(file, { force: true })
+  } catch (err) {
+    if (retry === 0 || !err || typeof err !== "object" || !("code" in err) || err.code !== "EBUSY") throw err
+    await Bun.sleep(100)
+    return remove(file, retry - 1)
+  }
+}
+
+describe("database WAL recovery", () => {
+  test("starts concurrent processes while recovering an abandoned WAL", async () => {
+    await using tmp = await tmpdir()
+    const file = path.join(tmp.path, "kilo.db")
+    await Effect.runPromise(Layer.build(Database.layerFromPath(file).pipe(Layer.fresh)).pipe(Effect.scoped))
+
+    const worker = path.join(import.meta.dir, "fixture/database-recovery-worker.ts")
+    const seed = Bun.spawn([process.execPath, worker, "seed", tmp.path], { stdout: "ignore", stderr: "pipe" })
+    try {
+      await wait(tmp.path, "seed-ready")
+    } finally {
+      if (seed.exitCode === null) seed.kill(9)
+      await seed.exited
+    }
+
+    await remove(`${file}-shm`)
+    const children: (typeof seed)[] = []
+    try {
+      for (const _ of Array.from({ length: 12 }))
```

#### packages/core/test/kilocode/fixture/database-recovery-worker.ts
```diff
diff --git a/packages/core/test/kilocode/fixture/database-recovery-worker.ts b/packages/core/test/kilocode/fixture/database-recovery-worker.ts
new file mode 100644
index 000000000..910a3d013
--- /dev/null
+++ b/packages/core/test/kilocode/fixture/database-recovery-worker.ts
@@ -0,0 +1,30 @@
+import { Database as SQLite } from "bun:sqlite"
+import path from "path"
+import { Database } from "@opencode-ai/core/database/database"
+import { Effect, Layer } from "effect"
+
+const mode = process.argv[2]
+const dir = process.argv[3]
+if (!mode || !dir) throw new Error("Expected mode and data directory")
+
+const file = path.join(dir, "kilo.db")
+
+if (mode === "seed") {
+  const sqlite = new SQLite(file)
+  sqlite.run("PRAGMA journal_mode = WAL")
+  sqlite.run("PRAGMA wal_autocheckpoint = 0")
+  sqlite.run("CREATE TABLE recovery_load (value BLOB)")
+  const insert = sqlite.prepare("INSERT INTO recovery_load VALUES (?)")
+  const value = new Uint8Array(4096)
+  sqlite.transaction(() => {
+    for (const _ of Array.from({ length: 1_000 })) insert.run(value)
+  })()
+  await Bun.write(path.join(dir, "seed-ready"), "")
+  await new Promise(() => {})
+}
+
+if (mode === "open") {
+  await Bun.write(path.join(dir, `open-ready-${process.pid}`), "")
+  while (!(await Bun.file(path.join(dir, "start")).exists())) await Bun.sleep(1)
+  await Effect.runPromise(Layer.build(Database.layerFromPath(file).pipe(Layer.fresh)).pipe(Effect.scoped))
+}
```


*... and more files (showing first 5)*

## opencode Changes (4e81a0b..da4730e)

### Commits

- da4730e - chore: generate (opencode-agent[bot], 2026-08-19)
- 18fc3ee - update zen model name (Frank, 2026-08-19)
- 101ff6d - chore: generate (opencode-agent[bot], 2026-08-19)
- 20ad497 - docs(console): end Luna usage promotion (#43351) (Jack, 2026-08-19)
- 1b18a50 - chore: generate (opencode-agent[bot], 2026-08-19)
- 0a63972 - Merge branch 'muse-spark' into dev (Frank, 2026-08-18)
- 3477d28 - Merge branch 'muse-spark' of github.com:anomalyco/opencode into muse-spark (Frank, 2026-08-18)
- fb772e8 - sync (Frank, 2026-08-18)
- 4e29e04 - sync (Frank, 2026-08-18)
- fbcd4fa - sync (Frank, 2026-08-18)
- da3ba63 - sync (Frank, 2026-08-18)
- e2a2bc3 - sync (Frank, 2026-08-18)
- 72824fe - sync (Frank, 2026-08-18)
- 64b4f7d - sync (Frank, 2026-08-18)
- 7774461 - docs: add SCX.ai to the providers list (#42520) (bhuvankakkar, 2026-08-18)
- 8b65fa2 - fix(opencode): remove Qwen sampling defaults (#43310) (opencode-agent[bot], 2026-08-18)
- 0033bb3 - fix(core): restore session request headers (#43188) (Filip, 2026-08-18)
- ad905f8 - fix(opencode): properly show authed providers on /connect command (#39915) (OpeOginni, 2026-08-18)
- 9b0dd36 - fix(session): ignore malformed model costs (#43248) (Shoubhit Dash, 2026-08-18)

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
- `packages/console/core/migrations/20260819012908_flashy_arclight/migration.sql` (+1, -0)
- `packages/console/core/migrations/20260819012908_flashy_arclight/snapshot.json` (+3181, -0)
- `packages/console/core/migrations/20260819031011_oval_morlocks/migration.sql` (+1, -0)
- `packages/console/core/migrations/20260819031011_oval_morlocks/snapshot.json` (+3181, -0)
- `packages/console/core/src/schema/billing.sql.ts` (+1, -0)
- `packages/console/core/src/schema/referral.sql.ts` (+5, -2)
- `packages/console/core/src/schema/workspace.sql.ts` (+1, -0)
- `packages/console/core/src/workspace.ts` (+2, -0)
- `packages/core/src/session/compaction.ts` (+1, -0)
- `packages/core/src/session/runner/llm.ts` (+7, -0)
- `packages/core/test/session-runner.test.ts` (+47, -0)

#### Other Changes
- `packages/console/app/src/i18n/ar.ts` (+6, -0)
- `packages/console/app/src/i18n/br.ts` (+6, -0)
- `packages/console/app/src/i18n/da.ts` (+6, -0)
- `packages/console/app/src/i18n/de.ts` (+6, -0)
- `packages/console/app/src/i18n/en.ts` (+8, -1)
- `packages/console/app/src/i18n/es.ts` (+6, -0)
- `packages/console/app/src/i18n/fr.ts` (+6, -0)
- `packages/console/app/src/i18n/it.ts` (+6, -0)
- `packages/console/app/src/i18n/ja.ts` (+6, -0)
- `packages/console/app/src/i18n/ko.ts` (+6, -0)
- `packages/console/app/src/i18n/no.ts` (+6, -0)
- `packages/console/app/src/i18n/pl.ts` (+6, -0)
- `packages/console/app/src/i18n/ru.ts` (+6, -0)
- `packages/console/app/src/i18n/th.ts` (+6, -0)
- `packages/console/app/src/i18n/tr.ts` (+6, -0)
- `packages/console/app/src/i18n/uk.ts` (+6, -0)
- `packages/console/app/src/i18n/zh.ts` (+4, -0)
- `packages/console/app/src/i18n/zht.ts` (+4, -0)
- `packages/console/app/src/lib/request-country.ts` (+73, -0)
- `packages/console/app/src/routes/go/index.css` (+0, -16)
- `packages/console/app/src/routes/go/index.tsx` (+12, -15)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.module.css` (+1, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+36, -0)
- `packages/console/app/src/routes/zen/util/error.ts` (+1, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+19, -3)
- `packages/opencode/src/provider/transform.ts` (+0, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+4, -1)
- `packages/opencode/src/session/session.ts` (+7, -9)
- `packages/opencode/test/provider/transform.test.ts` (+13, -0)
- `packages/opencode/test/session/compaction.test.ts` (+16, -0)
- `packages/web/src/content/docs/ar/go.mdx` (+71, -64)
- `packages/web/src/content/docs/bs/go.mdx` (+71, -64)
- `packages/web/src/content/docs/da/go.mdx` (+71, -64)
- `packages/web/src/content/docs/de/go.mdx` (+71, -64)
- `packages/web/src/content/docs/es/go.mdx` (+71, -64)
- `packages/web/src/content/docs/fr/go.mdx` (+71, -64)
- `packages/web/src/content/docs/go.mdx` (+71, -64)
- `packages/web/src/content/docs/it/go.mdx` (+71, -64)
- `packages/web/src/content/docs/ja/go.mdx` (+71, -64)
- `packages/web/src/content/docs/ko/go.mdx` (+71, -64)
- `packages/web/src/content/docs/nb/go.mdx` (+71, -64)
- `packages/web/src/content/docs/pl/go.mdx` (+71, -64)
- `packages/web/src/content/docs/providers.mdx` (+29, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+71, -64)
- `packages/web/src/content/docs/ru/go.mdx` (+71, -64)
- `packages/web/src/content/docs/th/go.mdx` (+71, -64)
- `packages/web/src/content/docs/tr/go.mdx` (+71, -64)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+71, -64)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+71, -64)

### Key Diffs

#### packages/console/core/migrations/20260819012908_flashy_arclight/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260819012908_flashy_arclight/migration.sql b/packages/console/core/migrations/20260819012908_flashy_arclight/migration.sql
new file mode 100644
index 0000000..c7741dd
--- /dev/null
+++ b/packages/console/core/migrations/20260819012908_flashy_arclight/migration.sql
@@ -0,0 +1 @@
+ALTER TABLE `workspace` ADD `allow_non_zdr` boolean;
```

#### packages/console/core/migrations/20260819012908_flashy_arclight/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260819012908_flashy_arclight/snapshot.json b/packages/console/core/migrations/20260819012908_flashy_arclight/snapshot.json
new file mode 100644
index 0000000..e2ae909
--- /dev/null
+++ b/packages/console/core/migrations/20260819012908_flashy_arclight/snapshot.json
@@ -0,0 +1,3181 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "39a41b57-a092-4356-a8ed-2a51cde2da1d",
+  "prevIds": ["2752a0ba-95b5-492a-83fd-3dfe7fa77734"],
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

#### packages/console/core/migrations/20260819031011_oval_morlocks/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260819031011_oval_morlocks/migration.sql b/packages/console/core/migrations/20260819031011_oval_morlocks/migration.sql
new file mode 100644
index 0000000..310a224
--- /dev/null
+++ b/packages/console/core/migrations/20260819031011_oval_morlocks/migration.sql
@@ -0,0 +1 @@
+ALTER TABLE `workspace` RENAME COLUMN `allow_non_zdr` TO `allow_training`;
\ No newline at end of file
```

#### packages/console/core/migrations/20260819031011_oval_morlocks/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260819031011_oval_morlocks/snapshot.json b/packages/console/core/migrations/20260819031011_oval_morlocks/snapshot.json
new file mode 100644
index 0000000..30a561a
--- /dev/null
+++ b/packages/console/core/migrations/20260819031011_oval_morlocks/snapshot.json
@@ -0,0 +1,3181 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "e365c1d7-fb02-44ad-b681-87bb51d01964",
+  "prevIds": ["39a41b57-a092-4356-a8ed-2a51cde2da1d"],
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

#### packages/console/core/src/schema/billing.sql.ts
```diff
diff --git a/packages/console/core/src/schema/billing.sql.ts b/packages/console/core/src/schema/billing.sql.ts
index 915646c..b177858 100644
--- a/packages/console/core/src/schema/billing.sql.ts
+++ b/packages/console/core/src/schema/billing.sql.ts
@@ -53,6 +53,7 @@ export const BillingTable = mysqlTable(
     ...workspaceIndexes(table),
     uniqueIndex("global_customer_id").on(table.customerID),
     uniqueIndex("global_subscription_id").on(table.subscriptionID),
+    uniqueIndex("global_lite_subscription_id").on(table.liteSubscriptionID),
   ],
 )
 
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/core/src/database/database.ts
- `src/core/` - review core changes from packages/core/src/global.ts
- `src/core/` - review core changes from packages/core/src/kilocode/global.ts
- `src/core/` - review core changes from packages/core/test/kilocode/database-recovery.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/fixture/database-recovery-worker.ts
- `src/core/` - review core changes from packages/core/test/kilocode/global.test.ts
- `src/core/` - review core changes from packages/core/test/project-copy.test.ts
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/drain.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/skill-shell.test.ts
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/shell-unparsed.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/shell-unparsed.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/shell.txt.ts` - update based on kilocode packages/opencode/src/tool/shell/shell.txt changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/tool.ts` - update based on kilocode packages/opencode/src/tool/tool.ts changes
- `src/tool/truncate.ts` - update based on kilocode packages/opencode/src/tool/truncate.ts changes
- `src/tool/truncation.test.ts` - update based on kilocode packages/opencode/test/tool/truncation.test.ts changes
