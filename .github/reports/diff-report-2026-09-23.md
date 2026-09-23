# Upstream Changes Report
Generated: 2026-09-23 10:55:34

## Summary
- kilocode: 395 commits, 631 files changed
- opencode: 13 commits, 81 files changed

## kilocode Changes (f47c29dfe..95b45e54e)

### Commits

- 95b45e54e - Merge pull request #14492 from Kilo-Org/fix/marketplace-git-plugin-hardening (Marius, 2026-09-23)
- 2e72d2673 - fix(marketplace): keep shared git clone cache on uninstall (marius-kilocode, 2026-09-23)
- 43f5d5551 - fix(marketplace): harden git plugin install and cleanup (marius-kilocode, 2026-09-23)
- 776d8b2c5 - Merge pull request #14487 from Kilo-Org/fix-multi-project-status-icon (Marius, 2026-09-23)
- 56241567e - Merge pull request #14486 from Kilo-Org/fix-tools-disappear-session-switch (Marius, 2026-09-23)
- dccf52b6e - Merge pull request #14485 from Kilo-Org/feat/marketplace-git-plugins (Marius, 2026-09-23)
- 3d24284e8 - chore(agent-manager): clarify activity routing comments (marius-kilocode, 2026-09-23)
- d923074f2 - fix(marketplace): clone local git plugins from a normalized path (marius-kilocode, 2026-09-23)
- b0cb4bc73 - fix(vscode): skip history paging during transcript resync (marius-kilocode, 2026-09-23)
- b6592ecfe - fix(marketplace): parse git file URLs on Windows (marius-kilocode, 2026-09-23)
- c887e66c8 - fix(agent-manager): keep status icons current for other projects (marius-kilocode, 2026-09-23)
- d52cd889d - fix(vscode): remount transcript virtualizer per session (marius-kilocode, 2026-09-23)
- 82c72d4aa - test(marketplace): update git identity expectations (marius-kilocode, 2026-09-23)
- 5a7127856 - Merge pull request #14484 from Kilo-Org/abundance-recorder (Marius, 2026-09-23)
- b3e2f664e - Merge pull request #14482 from Kilo-Org/fix/bash-live-output-tail (Marius, 2026-09-23)
- e3c1d46fe - fix(marketplace): harden git plugin resolution (marius-kilocode, 2026-09-23)
- 9088b7d0b - feat(marketplace): install plugins from git repositories (marius-kilocode, 2026-09-23)
- 065bc5c2e - fix(vscode): keep session cost totals complete on restart (marius-kilocode, 2026-09-23)
- d0dcb11fb - test(vscode): align bash output contract with callback ref (marius-kilocode, 2026-09-23)
- ae5cfbc53 - fix(vscode): show latest live bash output in chat (marius-kilocode, 2026-09-23)
- 4dae48547 - Merge pull request #14474 from Kilo-Org/brave-dolphin (Kirill Kalishev, 2026-09-22)
- 7c8186f99 - test(jetbrains): stabilize session recovery hooks (kirillk, 2026-09-22)
- 15d183fa3 - Merge pull request #14471 from Kilo-Org/restless-sparrow (Kirill Kalishev, 2026-09-22)
- 6609f750f - fix(jetbrains): address prompt review feedback (kirillk, 2026-09-22)
- 9b67d015d - Merge pull request #14473 from Kilo-Org/fix/jetbrains-worktree-tab-switch-lag (Kirill Kalishev, 2026-09-22)
- abd069811 - Merge pull request #14472 from Kilo-Org/fix/jetbrains-board-dialog-list (Kirill Kalishev, 2026-09-22)
- 3a686dde2 - fix(jetbrains): scan nested bundle key expressions (kirillk, 2026-09-22)
- be65f5e40 - fix(jetbrains): sync agent permission attention (kirillk, 2026-09-22)
- 99d20f6cd - fix(jetbrains): bound worktree catch-up preprocessing (kirillk, 2026-09-22)
- 51cc3076c - fix(jetbrains): keep worktree tab switches responsive (kirillk, 2026-09-22)
- b6d47ef52 - fix(jetbrains): scope list resize remeasurement (kirillk, 2026-09-22)
- 7168b1767 - Update packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/plugin/KiloBundleLocaleTest.kt (Kirill Kalishev, 2026-09-22)
- acf0647d3 - fix(jetbrains): close multi-line bundle key gaps found in review (kirillk, 2026-09-22)
- e0022c687 - fix(jetbrains): fix board dialog icon alignment, resize, and tooltips (kirillk, 2026-09-22)
- 7ce49ccfa - fix(jetbrains): guard release locale keys (kirillk, 2026-09-22)
- 27cb2de31 - Merge pull request #14281 from Kilo-Org/feat/marketplace-plugin-support (Marius, 2026-09-22)
- 4cb5f589f - Merge pull request #14466 from Kilo-Org/jetbrains/release/v7.1.7-rc.4 (Kirill Kalishev, 2026-09-22)
- 8c7babdad - Merge pull request #14464 from Kilo-Org/fix-checkpoint-snapshot-creation (Marius, 2026-09-22)
- 98c5974bc - docs(jetbrains): edit changelog for v7.1.7-rc.4 (Kirill Kalishev, 2026-09-22)
- a6eeabf0e - release(jetbrains): v7.1.7-rc.4 (kilo-maintainer[bot], 2026-09-22)
- d5a38a5f2 - Merge pull request #14443 from Kilo-Org/chore/jetbrains-cli-pin-v7.7.7 (Kirill Kalishev, 2026-09-22)
- 449aba51e - Merge pull request #14368 from Kilo-Org/feat/jetbrains-nested-worktree-delete-actions (Kirill Kalishev, 2026-09-22)
- e9563f710 - Merge pull request #14452 from Kilo-Org/fix/jetbrains-swarm-board-wrap-copy (Kirill Kalishev, 2026-09-22)
- b9dc741b1 - fix: explain file checkpoints require Git in revert notice (marius-kilocode, 2026-09-22)
- 516e9ca17 - Merge pull request #14457 from Kilo-Org/fix/jetbrains-custom-provider-remove-models (Kirill Kalishev, 2026-09-22)
- a483feb5d - Merge pull request #14434 from Kilo-Org/fix/jetbrains-selection-context-grounding (Kirill Kalishev, 2026-09-22)
- b13a1995d - Merge pull request #14441 from Kilo-Org/fearless-yak (Kirill Kalishev, 2026-09-22)
- 00061c812 - Merge pull request #14440 from Kilo-Org/cosmic-cobble (Kirill Kalishev, 2026-09-22)
- 31253705f - Merge pull request #14439 from Kilo-Org/fix/jetbrains-markdown-line-endings (Kirill Kalishev, 2026-09-22)
- 5696d62ed - Merge pull request #14438 from Kilo-Org/lucky-lantern (Kirill Kalishev, 2026-09-22)
- 47077cf9d - Merge pull request #14435 from Kilo-Org/zesty-reef (Kirill Kalishev, 2026-09-22)
- 651323d2b - Merge pull request #14461 from Kilo-Org/revert-13981-feat/ev-code-signing (Zeke Fralish, 2026-09-22)
- 1b23fd6c9 - Revert "feat(ci): sign Windows CLI binaries with Azure Key Vault EV certificate" (Zeke Fralish, 2026-09-22)
- fc44793e8 - Merge pull request #14460 from jezdez/docs/skill-path-trust (Marius, 2026-09-22)
- abe29a3a7 - Merge pull request #13981 from Kilo-Org/feat/ev-code-signing (Zeke Fralish, 2026-09-22)
- d69803039 - docs(kilo-docs): clarify trusted skill execution (Jannis Leidel, 2026-09-22)
- 98c8a5e63 - fix(jetbrains): run other-scope model cleanup on the delete-recreate path too (kirillk, 2026-09-22)
- 38f8867bc - docs(kilo-docs): clarify skill paths and trust (Jannis Leidel, 2026-09-22)
- 37c98ca49 - fix(jetbrains): address review — dual-scope model removal, stale KDoc (kirillk, 2026-09-22)
- 560ac1104 - fix(jetbrains): clarify background agent strip caption wording (kirillk, 2026-09-22)
- 3adc432d3 - fix(jetbrains): remove deselected models from custom OpenAI-compatible providers (kirillk, 2026-09-22)
- 43a8d4f25 - Merge remote-tracking branch 'origin/main' into fix/jetbrains-swarm-board-wrap-copy (kirillk, 2026-09-22)
- 2d9a13452 - Merge branch 'main' into feat/ev-code-signing (Zeke Fralish, 2026-09-22)
- 7c19534bb - fix(jetbrains): preserve expanded agent strip state (kirillk, 2026-09-22)
- b7aae4f8f - fix(jetbrains): harden reconnect recovery races (kirillk, 2026-09-22)
- 2c79e263f - fix(jetbrains): wrap Swarm board messages, keep board open, add copy all (kirillk, 2026-09-22)
- 49df20fc7 - fix(mcp): keep the OAuth flow's own state and PKCE verifier (#14196) (Igor Šćekić, 2026-09-22)
- 3fbb454a4 - feat(cli): link sessions to pull requests via tool and remote check (#14315) (Igor Šćekić, 2026-09-22)
- dfeeb48bd - feat(cli): add background process monitor and session cron scheduling (#14312) (Igor Šćekić, 2026-09-22)
- 5edf432c2 - fix(session): keep the session when compaction returns an empty summary (#14318) (Igor Šćekić, 2026-09-22)
- f33084689 - feat(cli): add experimental self-context tools (#14268) (Igor Šćekić, 2026-09-22)
- 56635c852 - fix(marketplace): keep plugin config discovery non-throwing (marius-kilocode, 2026-09-22)
- 28680d812 - Merge pull request #14448 from Kilo-Org/fix/provider-auth-allowlist (Marius, 2026-09-22)
- 96656c2b4 - fix(marketplace): bound plugin config walk without case-sensitive path equality (marius-kilocode, 2026-09-22)
- 4f782ef20 - Merge pull request #14446 from Kilo-Org/feat/sidebar-pin-close-to-right (Marius, 2026-09-22)
- a90afda50 - Merge pull request #14447 from Kilo-Org/treasure-archduchess (Marius, 2026-09-22)
- ba2b4bcfe - fix(marketplace): harden plugin lifecycle and localize installation (marius-kilocode, 2026-09-22)
- 859d06d8f - Merge pull request #14361 from Kilo-Org/profile-vscode-bash-rendering-performance (Marius, 2026-09-22)
- 9340d34f5 - fix(cli): skip providers excluded by enabled_providers before auth loaders (marius-kilocode, 2026-09-22)
- e6c48ac49 - fix(sidebar): bound persisted pins and report pending tabs in close deps (marius-kilocode, 2026-09-22)
- 17401e3bb - fix: scope MCP permission input metadata to MCP asks (marius-kilocode, 2026-09-22)
- 06fad000a - refactor(sidebar): share tab close helpers between sidebar and agent manager (marius-kilocode, 2026-09-22)
- 87e62a399 - Merge pull request #14445 from Kilo-Org/implement-agent-goal-management-tool (Marius, 2026-09-22)
- 91197c633 - refactor(ui): remove the stale shell output tail with a Range (marius-kilocode, 2026-09-22)
- f1e0744e2 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-22)
- 390b92cf9 - fix: show pending MCP tool arguments in the permission prompt (marius-kilocode, 2026-09-22)
- fccda25ca - feat(sidebar): add pinning and close to the right to chat tabs (marius-kilocode, 2026-09-22)
- 152ab49a4 - Merge pull request #14444 from Kilo-Org/lowly-veterinarian (Marius, 2026-09-22)
- 4de937647 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-22)
- fc2d8a742 - Merge pull request #13513 from Kilo-Org/johnnyeric/kilo-opencode-v1.18.20 (Marius, 2026-09-22)
- 1ac7cc170 - feat(goal): let the agent start or resume a session goal (marius-kilocode, 2026-09-22)
- f85f62ca7 - feat(agent-manager): add close to the right tab action (marius-kilocode, 2026-09-22)
- 9de77b966 - chore(jetbrains): bump CLI pin to v7.7.7 (kilo-maintainer[bot], 2026-09-22)
- 32411c45d - release: v7.7.7 (kilo-maintainer[bot], 2026-09-22)
- 3add59707 - chore: add changeset for OpenCode v1.18.19 to v1.18.20 merge (marius-kilocode, 2026-09-22)
- 4f4c5fc40 - fix(cli): adopt upstream connected provider list (marius-kilocode, 2026-09-22)
- 347137290 - fix(jetbrains): address review on selection-grounding marker (kirillk, 2026-09-21)
- 3f71b7aa1 - fix(jetbrains): surface a warning when reveal can't open the worktree (kirillk, 2026-09-21)
- f022acb72 - fix(jetbrains): address PR review feedback (kirillk, 2026-09-21)
- e2db8e17e - fix(jetbrains): use normal session model defaults for new worktrees (kirillk, 2026-09-21)
- 0800c0454 - fix(jetbrains): recover pending question/permission after reconnect (kirillk, 2026-09-21)
- d2727d2df - fix(jetbrains): normalize markdown line endings (kirillk, 2026-09-21)
- cf07d9c6c - feat(jetbrains): preview agents in collapsed strip (kirillk, 2026-09-21)
- 4dd690516 - fix(jetbrains): wrap session status messages (kirillk, 2026-09-21)
- 9fd9bb754 - fix(jetbrains): ground selected-code prompts in the active selection (kirillk, 2026-09-21)
- f767e57b7 - Merge pull request #14358 from Kilo-Org/chore/jetbrains-cli-pin-v7.7.6 (Kirill Kalishev, 2026-09-21)
- ae24ad1a4 - Merge branch 'main' into chore/jetbrains-cli-pin-v7.7.6 (Kirill Kalishev, 2026-09-21)
- dca646a16 - feat(jetbrains): add copy path/reveal actions to nested-worktree delete error (kirillk, 2026-09-21)
- 4b0e36991 - Merge pull request #14366 from Kilo-Org/jetbrains/release/v7.1.7-rc.3 (Kirill Kalishev, 2026-09-21)
- c89e96cee - docs(jetbrains): edit changelog for v7.1.7-rc.3 (Kirill Kalishev, 2026-09-21)
- 7e06f2b8c - refactor(ui): trim shell output lines by element with their separator (marius-kilocode, 2026-09-21)
- d1135557f - Merge commit '3873ac306671fd85d44c341c3c5e5e15b8e7fe3b' into johnnyeric/kilo-opencode-v1.18.20 (marius-kilocode, 2026-09-21)
- eebc30983 - release(jetbrains): v7.1.7-rc.3 (kilo-maintainer[bot], 2026-09-21)
- 047c5d7b6 - Merge branch 'main' into feat/ev-code-signing (Zeke Fralish, 2026-09-21)
- 3873ac306 - Merge pull request #14365 from Kilo-Org/fix/jetbrains-tool-window-create-buttons (Kirill Kalishev, 2026-09-21)
- cf284a571 - Merge branch 'main' into fix/jetbrains-tool-window-create-buttons (Kirill Kalishev, 2026-09-21)
- 615f59d1a - Merge pull request #14311 from Kilo-Org/quiet-quokka (Kirill Kalishev, 2026-09-21)
- 55da82b5e - fix(jetbrains): use semantic shimmer foreground (kirillk, 2026-09-21)
- 1255e0f25 - test(jetbrains): assert centered progress footer (kirillk, 2026-09-21)
- 193a44bdd - fix(jetbrains): address avatar review feedback (kirillk, 2026-09-21)
- 351a420fa - ci: merge signed Windows binaries into dist on Linux and drop ev-sign-test workflow (Zeke Fralish, 2026-09-21)
- 4f593957c - chore(jetbrains): update combined release note (kirillk, 2026-09-21)
- e16a2cf7b - feat(jetbrains): shimmer session progress text, center footer row (kirillk, 2026-09-21)
- 385db87c7 - test(jetbrains): harden title button coverage (kirillk, 2026-09-21)
- 79ae22f18 - feat(jetbrains): add unique subagent avatars (kirillk, 2026-09-21)
- 4486af2a9 - fix(jetbrains): center tool window create buttons (kirillk, 2026-09-21)
- c9e93d16a - Merge pull request #14360 from Kilo-Org/analyze-subagent-spawn-permission-errors (Marius, 2026-09-21)
- 1b650feb0 - fix(ui): clear the shell output fallback block and drop the highlight marker (marius-kilocode, 2026-09-21)
- 99180c729 - fix(ui): guard incremental shell output when the block is rebuilt (marius-kilocode, 2026-09-21)
- a2cd6b89e - Merge branch 'main' into feat/ev-code-signing (Zeke Fralish, 2026-09-21)
- 499a1ca5e - refactor: address review feedback on permission retry (marius-kilocode, 2026-09-21)
- f27140ace - fix(ui): highlight streaming shell output incrementally (marius-kilocode, 2026-09-21)
- 799e68cf0 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-21)
- 5d45b4625 - fix(cli): drop duplicate Auth import after merge (marius-kilocode, 2026-09-21)
- 2129ab225 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.20 (marius-kilocode, 2026-09-21)
- fefbb8431 - Merge pull request #13368 from Kilo-Org/johnnyeric/kilo-opencode-v1.18.18 (Marius, 2026-09-21)
- e07fb2498 - Merge pull request #14306 from Kilo-Org/fluffy-quartz (Kirill Kalishev, 2026-09-21)
- d4aa7277d - Merge pull request #14305 from Kilo-Org/eager-badger (Kirill Kalishev, 2026-09-21)
- 675ed4b12 - fix: retry dropped permission replies (marius-kilocode, 2026-09-21)
- a8b16a88b - fix(core): document Kilo's tail_turns default (marius-kilocode, 2026-09-21)
- d56f00854 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-21)
- 8a04d329a - chore(jetbrains): bump CLI pin to v7.7.6 (kilo-maintainer[bot], 2026-09-21)
- 93862bb10 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.18 (marius-kilocode, 2026-09-21)
- 250bfaae5 - release: v7.7.6 (kilo-maintainer[bot], 2026-09-21)
- 80aa7ef57 - Merge pull request #13002 from Kilo-Org/johnnyeric/kilo-opencode-v1.18.15 (Marius, 2026-09-21)
- 51509bede - Merge pull request #14354 from Kilo-Org/fix-pin-tab-icon (Marius, 2026-09-21)
- aa26fc001 - Merge remote-tracking branch 'origin/fix-pin-tab-icon' into fix-pin-tab-icon (marius-kilocode, 2026-09-21)
- f55d0b59a - chore(vscode): format diff style enum to satisfy prettier (marius-kilocode, 2026-09-21)
- cee348456 - Merge remote-tracking branch 'origin/main' into fix-pin-tab-icon (marius-kilocode, 2026-09-21)
- 962114ed5 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-21)
- e0357e7c0 - fix(ui): use a standard pushpin icon for pinned session tabs (marius-kilocode, 2026-09-21)
- 9a74f1ad3 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (marius-kilocode, 2026-09-21)
- 905f93383 - fix(jetbrains): reorder agent rows through Stack's layout order (kirillk, 2026-09-18)
- 0bfcf75be - fix(jetbrains): address review on the background agents strip (kirillk, 2026-09-18)
- d437e9bdd - fix(jetbrains): close three ways a false PR absence could be cached (kirillk, 2026-09-18)
- cfe8d2a0f - feat(jetbrains): add background agents strip to the session header (kirillk, 2026-09-18)
- 54235418f - Merge branch 'main' into fluffy-quartz (Kirill Kalishev, 2026-09-18)
- 0dc629674 - fix(jetbrains): close worktree run failure modes found in review (kirillk, 2026-09-18)
- 9de800f43 - feat(jetbrains): run npm script configurations in a worktree (kirillk, 2026-09-18)
- 7778930a9 - Merge branch 'main' into eager-badger (Kirill Kalishev, 2026-09-18)
- 7d6accb5b - docs(jetbrains): correct the ladder comment about which strategies always run (kirillk, 2026-09-18)
- f1188ded0 - fix(jetbrains): harden the PR absence cache and timeout confirmation (kirillk, 2026-09-18)
- 122d849f6 - fix(jetbrains): stop one slow gh lookup from blanking PR badges (kirillk, 2026-09-18)
- a39abf88c - ci: make ev-sign-test workflow manual trigger only (Zeke Fralish, 2026-09-18)
- a308798e3 - fix(marketplace): do not fail removal on unreadable sibling config (marius-kilocode, 2026-09-18)
- 2514281df - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-18)
- 430968212 - fix(marketplace): align plugin identity and removal (marius-kilocode, 2026-09-18)
- 7c59855ff - feat(marketplace): support installing npm plugins (marius-kilocode, 2026-09-18)
- 21a9c3899 - Merge remote-tracking branch 'origin/main' into fluffy-quartz (kirillk, 2026-09-17)
- b099533fd - fix(jetbrains): rebase worktree run log tabs onto the worktree (kirillk, 2026-09-16)
- ca365f905 - Merge branch 'main' into feat/ev-code-signing (Zeke Fralish, 2026-09-16)
- eb6e5dd89 - fix(ci): select versioned Windows SDK dir for signtool lookup (Zeke Fralish, 2026-09-16)
- e7a887011 - merge: main into feat/ev-code-signing (Zeke Fralish, 2026-09-14)
- aadb50c4b - fix(ci): address review and use repo-level Azure secrets (Zeke Fralish, 2026-09-14)
- bb8d951ae - Merge branch 'main' into feat/ev-code-signing (Zeke Fralish, 2026-09-09)
- 6dad716ec - feat(ci): add temporary EV signing test workflow (Zeke Fralish, 2026-09-09)
- 7bbcb7eb6 - feat(ci): sign Windows CLI binaries with Azure Key Vault EV certificate (Zeke Fralish, 2026-09-09)
- 7480a48f4 - merge: reconcile latest v1.18.15 base into v1.18.18 (Johnny Eric Amancio, 2026-09-03)
- ad084ced5 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (Johnny Eric Amancio, 2026-09-03)
- 0aff14dc1 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (Johnny Eric Amancio, 2026-09-03)
- 3d3a72273 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (Johnny Eric Amancio, 2026-08-28)
- bf1cf502a - merge: reconcile updated v1.18.15 base into v1.18.18 (Johnny Eric Amancio, 2026-08-27)
- 6a7d6bc00 - resolve merge conflicts (Johnny Eric Amancio, 2026-08-27)
- 91ca95bad - merge: record upstream v1.18.20 (Johnny Eric Amancio, 2026-08-27)
- 9563af96a - refactor: kilo compat for v1.18.20 (Johnny Eric Amancio, 2026-08-27)
- 3dad77513 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (Johnny Eric Amancio, 2026-08-26)
- 4cd817a17 - chore(opencode): restore Kilo change markers (Johnny Eric Amancio, 2026-08-25)
- 0bea46cea - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-25)
- b8b5b15c8 - resolve merge conflicts (Johnny Eric Amancio, 2026-08-25)
- aeddfc656 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (Johnny Eric Amancio, 2026-08-25)
- dae08d08e - fix: address upstream merge review findings (Johnny Eric Amancio, 2026-08-25)
- 46da388b5 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-25)
- 2f5410d9e - fix: address upstream merge review findings (Johnny Eric Amancio, 2026-08-25)
- 5d120f069 - fix(cli): preserve warnings for unknown config fields (Johnny Eric Amancio, 2026-08-24)
- c9861e954 - resolve merge conflicts (Johnny Eric Amancio, 2026-08-24)
- 6b9a826e0 - merge: record upstream v1.18.18 (Johnny Eric Amancio, 2026-08-24)
- 6ef57a694 - refactor: kilo compat for v1.18.18 (Johnny Eric Amancio, 2026-08-24)
- 6175210c0 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (Johnny Eric Amancio, 2026-08-24)
- c14316a7d - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (Johnny Eric Amancio, 2026-08-21)
- 7248bc196 - release: v1.18.20 (opencode, 2026-08-21)
- 35fe5b721 - fix(opencode): surface subagent tool errors (#43821) (Aiden Cline, 2026-08-21)
- 62cb3f77b - test(opencode): remove flaky subagent test (#43819) (opencode-agent[bot], 2026-08-21)
- e0b9e68a6 - fix(opencode): retry raw network finish errors (#43813) (opencode-agent[bot], 2026-08-21)
- 1e4c153ae - chore: generate (opencode-agent[bot], 2026-08-21)
- c9dc1a1b3 - feat(go): add Ox Alpha to usage graph (#43809) (Jack, 2026-08-21)
- 40282c1d4 - fix(opencode): retry network error variants (#43806) (opencode-agent[bot], 2026-08-21)
- e11dbd020 - chore: generate (opencode-agent[bot], 2026-08-21)
- 7b11ef5a5 - docs(go): add Ox Alpha Free (#43798) (Jack, 2026-08-21)
- 2859603cb - chore: generate (opencode-agent[bot], 2026-08-21)
- c313504c8 - fix(opencode): surface resumable subagent errors (#43657) (opencode-agent[bot], 2026-08-20)
- e49772a8b - fix(opencode): preserve Cerebras completion limit (#43736) (opencode-agent[bot], 2026-08-20)
- 08faeb389 - fix(opencode): answer subagent permissions in run (#43675) (opencode-agent[bot], 2026-08-20)
- 5e75e5e99 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-20)
- 5cc5b622f - update muse country list (Frank, 2026-08-20)
- 11e8110f9 - fix(docs): align Ox Alpha free model ID (#43695) (Jack, 2026-08-21)
- 82dee2430 - docs(zen): add Ox Alpha free model (#43690) (Jack, 2026-08-21)
- ad192a59b - fix(stats): clarify market share providers (#43647) (Adam, 2026-08-20)
- 71d08e94d - fix(opencode): retry xAI capacity stream errors (#43640) (opencode-agent[bot], 2026-08-20)
- 2251248a7 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (Johnny Eric Amancio, 2026-08-20)
- b155b1569 - sync release versions for v1.18.19 (opencode, 2026-08-20)
- d06bf487a - sync (Frank, 2026-08-20)
- ccccd7532 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-20)
- 03d65f36d - sync (Frank, 2026-08-20)
- f4a89683d - fix(tui): remove encrypted label from thought header (#43588) (Aiden Cline, 2026-08-20)
- f715478a1 - doc muse regions (Frank, 2026-08-20)
- e0e9bd7d5 - fix(tui): show encrypted reasoning status (#43578) (opencode-agent[bot], 2026-08-20)
- 5ccb1e88e - fix(stats): normalize routed model ids (#43582) (opencode-agent[bot], 2026-08-20)
- be469f328 - sync (Frank, 2026-08-20)
- fc80874f4 - chore: generate (opencode-agent[bot], 2026-08-20)
- 3d26b1225 - zen: muse spark contributor (Frank, 2026-08-19)
- 1b77242d4 - country check for muse spark in free (Frank, 2026-08-19)
- 4c5960dc4 - feat(stats): include free tier usage (Adam, 2026-08-19)
- e2505d434 - Revert "update go models" (Frank, 2026-08-19)
- a466a357b - Revert "chore: generate" (Frank, 2026-08-19)
- 6386e6794 - chore: generate (opencode-agent[bot], 2026-08-19)
- 16af13405 - update go models (Frank, 2026-08-19)
- 058f2808d - fix(acp): correlate idle events with current turn (Johnny Eric Amancio, 2026-08-19)
- d545d8fba - feat(go): promote Hy3 usage (#43429) (Jack, 2026-08-19)
- 860f5d9e6 - fix(upstream): preserve Kilo merge invariants (Johnny Eric Amancio, 2026-08-19)
- c50f6be6a - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (Johnny Eric Amancio, 2026-08-19)
- da4730e4a - chore: generate (opencode-agent[bot], 2026-08-19)
- 18fc3eea7 - update zen model name (Frank, 2026-08-19)
- 101ff6d1a - chore: generate (opencode-agent[bot], 2026-08-19)
- 20ad497bc - docs(console): end Luna usage promotion (#43351) (Jack, 2026-08-19)
- 1b18a5041 - chore: generate (opencode-agent[bot], 2026-08-19)
- 0a6397272 - Merge branch 'muse-spark' into dev (Frank, 2026-08-18)
- 3477d28a8 - Merge branch 'muse-spark' of github.com:anomalyco/opencode into muse-spark (Frank, 2026-08-18)
- fb772e8a0 - sync (Frank, 2026-08-18)
- 4e29e04f2 - sync (Frank, 2026-08-18)
- fbcd4faa6 - sync (Frank, 2026-08-18)
- da3ba6387 - sync (Frank, 2026-08-18)
- e2a2bc301 - sync (Frank, 2026-08-18)
- 72824fe65 - sync (Frank, 2026-08-18)
- 64b4f7df4 - sync (Frank, 2026-08-18)
- 7774461bb - docs: add SCX.ai to the providers list (#42520) (bhuvankakkar, 2026-08-18)
- 8b65fa2ef - fix(opencode): remove Qwen sampling defaults (#43310) (opencode-agent[bot], 2026-08-18)
- 0033bb355 - fix(core): restore session request headers (#43188) (Filip, 2026-08-18)
- ad905f8e6 - fix(opencode): properly show authed providers on /connect command (#39915) (OpeOginni, 2026-08-18)
- 9b0dd36cd - fix(session): ignore malformed model costs (#43248) (Shoubhit Dash, 2026-08-18)
- 4e81a0b73 - fix(console): preserve inference sessions (#43124) (Adam, 2026-08-18)
- 32320409b - fix(app): keep server details editable (#43169) (opencode-agent[bot], 2026-08-18)
- 040b85614 - fix(cli): stop legacy preview publishing (Dax Raad, 2026-08-17)
- 65c35977b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-17)
- 57075d8cd - fix(provider): update Google Vertex SDK (#43108) (opencode-agent[bot], 2026-08-17)
- e14acea58 - update ds flash limit (Frank, 2026-08-17)
- 7af274a92 - fix(core): fall back on oversized websocket requests (#43099) (Filip, 2026-08-17)
- a97fec8af - fix: codex data residency (#42432) (Filip, 2026-08-17)
- 2cba7e227 - fix(cli): update default console URL (#43043) (opencode-agent[bot], 2026-08-17)
- 4d68d30b4 - tweak: match codex limits for openai models exactly when using chatgpt subscription (#39082) (Game On, 2026-08-17)
- 5a0e07efc - chore: generate (opencode-agent[bot], 2026-08-17)
- cba6b5f2f - feat(opencode): native OpenAI and Anthropic passthroughs for Cloudflare AI Gateway (#42634) (Aiden Cline, 2026-08-16)
- 1c965451b - fix(stats): correct YouTube footer link (#42941) (opencode-agent[bot], 2026-08-16)
- a0f8dccbf - docs: update DeepSeek V4 pricing (#42881) (Jack, 2026-08-17)
- fb8344f3c - chore: remove scheduled beta sync (Dax Raad, 2026-08-16)
- 3fd77ae98 - zen: peak pricing (Frank, 2026-08-16)
- 976c18517 - docs(go): remove DeepSeek Flash promotion (#42858) (Jack, 2026-08-16)
- 4643e65ad - fix(opencode): enable web search for Go (#42630) (opencode-agent[bot], 2026-08-14)
- e23586af2 - feat(go): add GLM 5.3 (#42518) (Jack, 2026-08-14)
- 92d29ba4a - chore: generate (opencode-agent[bot], 2026-08-14)
- 886fd98f5 - docs(zen): add Muse Spark 1.2 (#42508) (Jack, 2026-08-14)
- 722e717e9 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-14)
- 6d635007a - chore(deps): update ai-gateway-provider to 3.2.0 (#42488) (Aiden Cline, 2026-08-13)
- 0e3474509 - docs: sort Gemini 3.7 before 3.6 (#42473) (opencode-agent[bot], 2026-08-14)
- d8bf79225 - fix(opencode): preserve v1 database compatibility (#42444) (Dax, 2026-08-14)
- 8a55ba75b - chore: generate (opencode-agent[bot], 2026-08-13)
- 244958154 - fix(go): remove Gemini 3.7 Flash (#42393) (Jack, 2026-08-14)
- 3e25e80f7 - chore: generate (opencode-agent[bot], 2026-08-13)
- f06e9491e - feat(go): add Gemini 3.7 Flash (#42390) (Jack, 2026-08-14)
- d0c2b41ad - docs(go): use responses API for Grok 4.5 (#42373) (Jack, 2026-08-14)
- 31406ccc5 - release: v1.18.18 (opencode, 2026-08-13)
- 14b37df39 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-12)
- 91df88323 - fix(opencode): select Kimi prompt by provider (#42161) (opencode-agent[bot], 2026-08-12)
- 6fea419fe - fix(groq): pass through reasoning effort (#42166) (opencode-agent[bot], 2026-08-12)
- beeabe2e4 - fix(mistral): pass through reasoning effort (#42164) (opencode-agent[bot], 2026-08-12)
- 502310f4d - fix(xai): pass through reasoning effort (#42160) (opencode-agent[bot], 2026-08-12)
- 37fe5c83d - sync release versions for v1.18.17 (opencode, 2026-08-12)
- dab263721 - fix(compaction): adjust instructions and structure to be more clear to smaller models like dsv4 flash (#42045) (Aiden Cline, 2026-08-12)
- 39fb919a0 - chore: add neriousy to team members (#42107) (opencode-agent[bot], 2026-08-12)
- 999be6266 - chore: generate (opencode-agent[bot], 2026-08-12)
- 521906f5f - docs(go): clarify DeepSeek ZDR coverage (#42085) (opencode-agent[bot], 2026-08-12)
- 069165eb5 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-12)
- df09c3ec6 - update ds v4 pro (Frank, 2026-08-12)
- 6d3ae4d63 - chore: generate (opencode-agent[bot], 2026-08-12)
- 284187ac5 - fix(ci): authenticate pulumi downloads (Adam, 2026-08-12)
- 7e0353cca - fix(stats): correct r2 daily totals (Adam, 2026-08-12)
- 959c8bd49 - docs: fix provider display name and PAT typos (#42034) (SKY ZHAO, 2026-08-12)
- ca3df21b7 - docs: fix broken DigitalOcean and Daytona links (#42048) (SKY ZHAO, 2026-08-12)
- 8571a922d - fix(provider): add Merge Gateway reasoning variants (#41867) (Matthew Feroz, 2026-08-12)
- d92d1e654 - docs(zen): add Grok 4.6 (Frank, 2026-08-12)
- 46a14e685 - feat(stats): query r2 data catalog (Adam, 2026-08-12)
- 1f94d8a3c - docs(zen): remove expired free models (#41943) (Jack, 2026-08-12)
- c78986831 - fix(opencode): cap session retries with jitter (#41939) (Aiden Cline, 2026-08-11)
- d47043474 - refactor(console): simplify go usage response (vimtor, 2026-08-11)
- 561afb401 - fix(opencode): detect Copilot PDF input support (#41522) (Steven Ao, 2026-08-11)
- 2b8a5969e - feat(console): add go usage endpoint (#16513) (Arif Rahman (Bolt), 2026-08-11)
- 36b205370 - docs(zen): add Hy3 Free (#41814) (Jack, 2026-08-12)
- 6afef2f88 - fix(console): update blocked account message (#41819) (opencode-agent[bot], 2026-08-11)
- 0d927ba03 - chore: generate (opencode-agent[bot], 2026-08-11)
- 9fdd4824d - docs(zen): add Nemotron 3.5 Lightning (#41750) (Jack, 2026-08-11)
- baae5ec7e - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.15 (Johnny Eric Amancio, 2026-08-11)
- d041eee55 - chore: use DeepSeek for beta conflicts (#41669) (opencode-agent[bot], 2026-08-11)
- d62e50075 - chore: build beta from v2 (#41627) (Luke Parker, 2026-08-11)
- 5d953482a - fix(provider): scope DeepSeek V4 Flash sampling defaults (#41620) (opencode-agent[bot], 2026-08-10)
- 3a90639cb - fix(ui): correct OC-2 weak icon color (#41504) (OpeOginni, 2026-08-10)
- b9f3b382f - fix(session): route all Muse family models to the Meta system prompt (#41581) (Matthias Reso, 2026-08-10)
- 6d8876045 - Merge remote-tracking branch 'origin/johnnyeric/kilo-opencode-v1.18.13' into test-amend (Johnny Eric Amancio, 2026-08-10)
- c24adedfa - fix: address merge review findings and CI guards (Johnny Eric Amancio, 2026-08-10)
- 550d1ffd2 - fix(i18n): use widely recognized developer terminology (#41532) (opencode-agent[bot], 2026-08-10)
- 941e71dbb - fix(app): use current default model (#38603) (Brendan Allan, 2026-08-10)
- d90532a59 - sync release versions for v1.18.16 (opencode, 2026-08-10)
- 0bff28de0 - fix(stats): fall back after full sync failure (#41411) (opencode-agent[bot], 2026-08-09)
- 38e10eb14 - fix(opencode): ignore unknown config fields (#41312) (opencode-agent[bot], 2026-08-08)
- fe82a1b6c - chore: generate (opencode-agent[bot], 2026-08-08)
- 2ea728f73 - fix(app): populate project picker from home (#41158) (Brendan Allan, 2026-08-08)
- 3a10be340 - resolve merge conflicts (Johnny Eric Amancio, 2026-08-07)
- ed7c69dbf - merge: record upstream v1.18.15 (Johnny Eric Amancio, 2026-08-07)
- 7f36c5044 - refactor: kilo compat for v1.18.15 (Johnny Eric Amancio, 2026-08-07)
- 284214c78 - feat(app): open project menu on right-click (#41013) (Aarav Sareen, 2026-08-07)
- b05a0d1fb - fix(i18n): use 词元 instead of 令牌 for token in zh locale (#40977) (日常无语的无语者, 2026-08-07)
- be25c905f - docs(zen): replace Ling Flash with Tiny (#41027) (Jack, 2026-08-07)
- 5347b5e00 - fix(app): register new home projects (#41018) (Brendan Allan, 2026-08-07)
- b467518da - fix(desktop): preserve macOS app on window close (#40974) (opencode-agent[bot], 2026-08-07)
- 1ec6bdc8c - sync release versions for v1.18.15 (opencode, 2026-08-07)
- d7b115f62 - release: v1.18.15 (opencode, 2026-08-07)
- 265472ef7 - fix(ui): use tokens for button loading state (#40884) (Aarav Sareen, 2026-08-07)
- 325529761 - sync (Frank, 2026-08-07)
- 741244b69 - feat(app): add global locale coverage (#40992) (opencode-agent[bot], 2026-08-07)
- 4abddbbfd - feat(go): promote DeepSeek V4 Flash usage (#40988) (Jack, 2026-08-07)
- 5aa5cb352 - fix(app): use chronological message boundaries (#41006) (opencode-agent[bot], 2026-08-07)
- 911325511 - fix(app): order stored messages by creation time (#41001) (opencode-agent[bot], 2026-08-07)
- 23cc67710 - fix(tui): order messages by creation time (#40994) (opencode-agent[bot], 2026-08-07)
- 28bcc0e4f - fix(app): sort sessions by persisted time (#41000) (opencode-agent[bot], 2026-08-07)
- 8bf5062b8 - feat(tui): add cursor style configuration (#32295) (Dmitry Nefedov, 2026-08-06)
- 20750c332 - fix(web): order shared messages by creation time (#40995) (opencode-agent[bot], 2026-08-07)
- db581e47a - fix(opencode): order legacy message loop by time (#40990) (opencode-agent[bot], 2026-08-07)
- a54a693af - fix(opencode): use chronological message boundaries (#40991) (opencode-agent[bot], 2026-08-07)
- d46820195 - fix(opencode): use file times for truncation cleanup (#40987) (opencode-agent[bot], 2026-08-07)
- 31c5c4e92 - fix(app): keep locale names native (#40985) (opencode-agent[bot], 2026-08-07)
- 8d65dbdd0 - fix(app): complete translation coverage (#40981) (opencode-agent[bot], 2026-08-07)
- b7f936339 - fix(opencode): serialize orphaned compaction history (#40800) (opencode-agent[bot], 2026-08-06)
- 69f2cbaa3 - chore: generate (opencode-agent[bot], 2026-08-06)
- dc898ca2c - sync (Frank, 2026-08-06)
- 03bff6500 - fix(app): update homepage stats (Adam, 2026-08-06)
- b379d71d1 - fix(stats): update github stars (Adam, 2026-08-06)
- def7220bf - fix(tui): support copying over ssh with `set-clipboard on` tmux config (#30472) (ayu, 2026-08-06)
- f6c5afe5a - fix(desktop): disable packaged console logging (#40794) (opencode-agent[bot], 2026-08-06)
- 847771fe0 - fix log processor (Frank, 2026-08-06)
- b8bd88901 - chore: generate (opencode-agent[bot], 2026-08-06)
- f1adabcdd - feat(app): export session as json from ui (#40781) (Luke Parker, 2026-08-06)
- 24470e52a - fix(desktop): embed version in server sidecar (#40764) (Luke Parker, 2026-08-06)
- 23bbc5cd1 - fix(server): allow blob attachments in web UI (#40692) (mridul, 2026-08-05)
- ebf6fc07a - sync release versions for v1.18.14 (opencode, 2026-08-05)
- 04513d969 - chore: generate (opencode-agent[bot], 2026-08-05)
- 146720e19 - fix(stats): improve page speed (Adam, 2026-08-05)
- b1f8cc04a - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-05)
- 082fe93e1 - chore: generate (opencode-agent[bot], 2026-08-05)
- 709c19590 - fix(opencode): preserve compatible stream errors (#40718) (Aiden Cline, 2026-08-05)
- 3355b78d9 - chore: generate (opencode-agent[bot], 2026-08-05)
- b84c63d03 - fix(stats): reduce html payloads (Adam, 2026-08-05)
- 057b5a9de - chore: generate (opencode-agent[bot], 2026-08-05)
- 61aefc075 - fix(opencode): expand retryable error patterns (#40707) (Aiden Cline, 2026-08-05)
- f929f8f10 - refactor(opencode): simplify retry error matching (#40694) (Aiden Cline, 2026-08-05)
- 4a57013cf - fix(app): show pending tool details (#40603) (opencode-agent[bot], 2026-08-05)
- 2f17fc961 - docs(zen): add LongCat free model (#40585) (Jack, 2026-08-05)
- b8ea3ea09 - chore: generate (opencode-agent[bot], 2026-08-05)
- 82a579615 - test(app): harden flaky e2e synchronization (#40556) (Luke Parker, 2026-08-05)
- 9f3856223 - fix(opencode): include cache writes in ACP usage (#40450) (opencode-agent[bot], 2026-08-04)
- 5b4fb1f77 - chore: generate (opencode-agent[bot], 2026-08-05)
- cb88db6ce - tweak(opencode): make xAI OAuth device-only to reduce confusion w/ headless environments (#40537) (Aiden Cline, 2026-08-04)
- 66fdd51f0 - docs: add RTL development skill (#40543) (Luke Parker, 2026-08-05)
- 98dd65cd6 - fix(app): collapse deletion-only edit parts (#40536) (opencode-agent[bot], 2026-08-05)
- f0afb6750 - fix(server): log upstream 5xx bodies from proxied workspace requests (#40135) (James Murdza, 2026-08-04)
- 703d09f30 - fix(server): don't forward host directory to remote workspace (#40136) (James Murdza, 2026-08-04)
- aefaf140c - sync release versions for v1.18.13 (opencode, 2026-08-04)
- 44614c79c - fix(acp): drain updates before end turn (#40422) (Shoubhit Dash, 2026-08-04)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt` (+62, -3)
- `packages/opencode/src/kilocode/tool/background-process.ts` (+124, -6)
- `packages/opencode/src/kilocode/tool/background-process.txt` (+10, -3)
- `packages/opencode/src/kilocode/tool/cancel-wakeup.ts` (+1, -14)
- `packages/opencode/src/kilocode/tool/context.ts` (+121, -0)
- `packages/opencode/src/kilocode/tool/cron-create.txt` (+22, -0)
- `packages/opencode/src/kilocode/tool/cron-delete.txt` (+9, -0)
- `packages/opencode/src/kilocode/tool/cron-list.txt` (+7, -0)
- `packages/opencode/src/kilocode/tool/cron.ts` (+180, -0)
- `packages/opencode/src/kilocode/tool/link-pr.ts` (+88, -0)
- `packages/opencode/src/kilocode/tool/link-pr.txt` (+12, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+40, -1)
- `packages/opencode/src/kilocode/tool/schedule-wakeup.ts` (+1, -9)
- `packages/opencode/src/kilocode/tool/wakeup-format.ts` (+14, -0)
- `packages/opencode/src/tool/code-mode.ts` (+1, -1)
- `packages/opencode/src/tool/registry.ts` (+16, -1)
- `packages/opencode/src/tool/task.ts` (+4, -0)
- `packages/opencode/test/kilocode/tool/cron.test.ts` (+294, -0)
- `packages/opencode/test/kilocode/tool/link-pr.test.ts` (+283, -0)
- `packages/opencode/test/kilocode/tool/send-file.test.ts` (+1, -0)
- `packages/opencode/test/tool/registry.test.ts` (+23, -0)
- `packages/opencode/test/tool/task.test.ts` (+119, -2)
- `packages/opencode/test/tool/websearch.test.ts` (+2, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/prompt/compaction.txt` (+2, -6)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+3, -3)
- `packages/core/src/plugin/agent.ts` (+2, -6)
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+7, -1)
- `packages/core/src/plugin/skill/customize-opencode.md` (+1, -1)
- `packages/core/src/ripgrep.ts` (+4, -1)
- `packages/core/src/session/compaction.ts` (+26, -19)
- `packages/core/src/session/projector.ts` (+3, -3)
- `packages/core/src/session/runner/llm.ts` (+7, -0)
- `packages/core/src/session/sql.ts` (+1, -1)
- `packages/core/src/v1/config/config.ts` (+2, -1)
- `packages/core/test/provider-groq.test.ts` (+28, -0)
- `packages/core/test/provider-mistral.test.ts` (+26, -0)
- `packages/core/test/provider-xai-responses.test.ts` (+53, -0)
- `packages/core/test/ripgrep.test.ts` (+20, -0)
- `packages/core/test/session-compaction.test.ts` (+20, -0)
- `packages/core/test/session-runner.test.ts` (+109, -1)

#### Other Changes
- `.changeset/agent-goal-tool.md` (+5, -0)
- `.changeset/agent-manager-close-to-right.md` (+5, -0)
- `.changeset/agent-manager-pin-tabs.md` (+0, -5)
- `.changeset/auto-cleanup-reintroduce.md` (+0, -5)
- `.changeset/background-monitor-and-session-cron.md` (+5, -0)
- `.changeset/bash-live-output-tail.md` (+5, -0)
- `.changeset/bright-project-setup.md` (+0, -7)
- `.changeset/calm-agents-preview.md` (+5, -0)
- `.changeset/diff-keyboard-focus.md` (+0, -5)
- `.changeset/empty-compaction-keeps-session.md` (+5, -0)
- `.changeset/experimental-context-tools.md` (+5, -0)
- `.changeset/fix-autocompaction-threshold.md` (+0, -5)
- `.changeset/fix-background-project-activity.md` (+5, -0)
- `.changeset/fix-background-project-spinner.md` (+0, -5)
- `.changeset/fix-jetbrains-board-list.md` (+5, -0)
- `.changeset/fix-paste-chip-deletion.md` (+0, -5)
- `.changeset/fuzzy-pandas-reason.md` (+0, -5)
- `.changeset/injected-prompt-header.md` (+0, -6)
- `.changeset/inspect-pending-mcp-arguments.md` (+5, -0)
- `.changeset/jetbrains-activity-prompt-state.md` (+5, -0)
- `.changeset/jetbrains-custom-provider-remove-models.md` (+5, -0)
- `.changeset/jetbrains-ground-selection-context.md` (+5, -0)
- `.changeset/jetbrains-locale-release-keys.md` (+5, -0)
- `.changeset/jetbrains-markdown-line-endings.md` (+5, -0)
- `.changeset/jetbrains-nested-worktree-delete-actions.md` (+5, -0)
- `.changeset/jetbrains-reconnect-question-recovery.md` (+5, -0)
- `.changeset/jetbrains-session-status-wrap.md` (+5, -0)
- `.changeset/jetbrains-swarm-board-wrap-copy.md` (+5, -0)
- `.changeset/jetbrains-worktree-session-model-defaults.md` (+5, -0)
- `.changeset/jetbrains-worktree-tab-catchup.md` (+5, -0)
- `.changeset/link-pr-and-remote-check.md` (+5, -0)
- `.changeset/markdown-loose-list-comment-lines.md` (+0, -5)
- `.changeset/marketplace-git-plugin-hardening.md` (+5, -0)
- `.changeset/marketplace-git-plugins.md` (+6, -0)
- `.changeset/marketplace-plugins.md` (+6, -0)
- `.changeset/mcp-oauth-flow-owns-its-state.md` (+5, -0)
- `.changeset/mcp-probe-content-type.md` (+0, -5)
- `.changeset/opencode-v1-18-19-to-v1-18-20.md` (+6, -0)
- `.changeset/paged-session-history.md` (+0, -5)
- `.changeset/persist-diff-style.md` (+0, -5)
- `.changeset/preserve-dollar-placeholders.md` (+0, -5)
- `.changeset/provider-enabled-allowlist-auth.md` (+5, -0)
- `.changeset/quiet-session-preview.md` (+0, -7)
- `.changeset/remove-experimental-plan-mode-flag.md` (+0, -5)
- `.changeset/retry-transient-terminated.md` (+0, -5)
- `.changeset/revert-not-a-git-repo-notice.md` (+6, -0)
- `.changeset/scheduled-wakeup-status.md` (+0, -5)
- `.changeset/semantic-search-scope-reporting.md` (+0, -5)
- `.changeset/session-cleanup-translations.md` (+0, -5)
- `.changeset/session-cost-restart.md` (+7, -0)
- `.changeset/session-switch-blank-transcript.md` (+5, -0)
- `.changeset/sidebar-tabs-pin-close-to-right.md` (+5, -0)
- `.changeset/streaming-shell-output-highlight.md` (+5, -0)
- `.opencode-version` (+1, -1)
- `.opencode/skills/rtl-aware-development/SKILL.md` (+63, -0)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+109, -44)
- `nix/hashes.json` (+4, -4)
- `package.json` (+7, -4)
- `packages/client/package.json` (+1, -1)
- `packages/client/src/generated/types.ts` (+6, -6)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/extending/plugins.md` (+49, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/goals.md` (+7, -1)
- `packages/kilo-docs/pages/customize/marketplace.md` (+9, -3)
- `packages/kilo-docs/pages/customize/skills.md` (+12, -4)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/empty-list-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/install-plugin-modal-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/single-plugin-card-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/pinned-tabs-chromium-linux.png` (+3, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-i18n/src/ar.ts` (+6, -2)
- `packages/kilo-i18n/src/br.ts` (+7, -2)
- `packages/kilo-i18n/src/bs.ts` (+7, -2)
- `packages/kilo-i18n/src/da.ts` (+8, -2)
- `packages/kilo-i18n/src/de.ts` (+8, -3)
- `packages/kilo-i18n/src/en.ts` (+7, -2)
- `packages/kilo-i18n/src/es.ts` (+8, -2)
- `packages/kilo-i18n/src/fr.ts` (+7, -2)
- `packages/kilo-i18n/src/it.ts` (+7, -2)
- `packages/kilo-i18n/src/ja.ts` (+7, -2)
- `packages/kilo-i18n/src/ko.ts` (+8, -2)
- `packages/kilo-i18n/src/nl.ts` (+7, -2)
- `packages/kilo-i18n/src/no.ts` (+8, -2)
- `packages/kilo-i18n/src/pl.ts` (+7, -2)
- `packages/kilo-i18n/src/ru.ts` (+7, -2)
- `packages/kilo-i18n/src/th.ts` (+8, -2)
- `packages/kilo-i18n/src/tr.ts` (+7, -2)
- `packages/kilo-i18n/src/uk.ts` (+8, -2)
- `packages/kilo-i18n/src/zh.ts` (+6, -2)
- `packages/kilo-i18n/src/zht.ts` (+6, -2)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/.run/Run IDE (Backend).run.xml` (+1, -1)
- `packages/kilo-jetbrains/.run/Run IDE (Frontend).run.xml` (+1, -1)
- `packages/kilo-jetbrains/.run/Run IDE (Split Mode).run.xml` (+2, -2)
- `packages/kilo-jetbrains/CHANGELOG.md` (+46, -0)
- `packages/kilo-jetbrains/README.md` (+32, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendActivityManager.kt` (+87, -14)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+54, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendChatManager.kt` (+29, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+125, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+68, -7)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/provider/KiloBackendProviderSettingsManager.kt` (+39, -6)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+6, -5)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+15, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+23, -4)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/PrResolver.kt` (+185, -25)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/run/WorktreeRunAdapter.kt` (+159, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/run/WorktreeRunManager.kt` (+5, -4)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendActivityManagerTest.kt` (+119, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+62, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendChatManagerTest.kt` (+30, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendSessionManagerBackgroundJobsTest.kt` (+158, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+215, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/provider/KiloBackendProviderSettingsManagerTest.kt` (+183, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+23, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/PrResolverTest.kt` (+258, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/run/WorktreeRunManagerTest.kt` (+153, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+40, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloNotifications.kt` (+12, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/KiloActionIcons.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/NewSessionAction.kt` (+7, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/NewWorktreeAction.kt` (+7, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/TitleButton.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+33, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinator.kt` (+75, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialog.kt` (+58, -15)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunControl.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunPopup.kt` (+18, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+32, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ActivityIcon.kt` (+5, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/AgentAvatar.kt` (+192, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+17, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/background/BackgroundAgent.kt` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/background/BackgroundAgents.kt` (+56, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/board/BoardAvatars.kt` (+19, -59)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/board/SessionBoardDialog.kt` (+106, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/context/EditorContextGatherer.kt` (+34, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+223, -107)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionSelection.kt` (+93, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionUpdateQueue.kt` (+78, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModelEvent.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/subagent/SubagentSessionEditorKind.kt` (+11, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/subagent/SubagentTitleCache.kt` (+26, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/LoadingPanel.kt` (+12, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ProgressPanel.kt` (+202, -20)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+15, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/BackgroundAgentStrip.kt` (+718, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+53, -84)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/Strip.kt` (+215, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/TodoStrip.kt` (+60, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/BackgroundPromote.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+13, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+7, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+20, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorSettingsUi.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/ShimmerLabel.kt` (+169, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+52, -29)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListModel.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListRenderer.kt` (+82, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdViewHybrid.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloFileIconProvider.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/add-small.svg` (+0, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/add-small_dark.svg` (+0, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+33, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+44, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/KiloNotificationsTest.kt` (+93, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/NewSessionActionTest.kt` (+11, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/NewWorktreeActionTest.kt` (+11, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/TitleButtonTest.kt` (+215, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeControllerTest.kt` (+30, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeIconsTest.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhBannerTest.kt` (+8, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinatorTest.kt` (+98, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialogTest.kt` (+66, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunPopupTest.kt` (+65, -9)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/plugin/KiloBundleLocaleTest.kt` (+236, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/AgentAvatarTest.kt` (+135, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiEditorSelectionTest.kt` (+75, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/background/BackgroundAgentsTest.kt` (+104, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/board/BoardAvatarsTest.kt` (+32, -25)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/board/SessionBoardDialogTest.kt` (+131, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/context/EditorContextGathererTest.kt` (+38, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/BackgroundAgentControllerTest.kt` (+146, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ListenerLifecycleTest.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PromptLifecycleTest.kt` (+35, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionRecoveryTest.kt` (+227, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionUpdateQueueTest.kt` (+106, -14)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/subagent/SubagentSessionEditorKindTest.kt` (+67, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/LoadingPanelTest.kt` (+42, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ProgressPanelTest.kt` (+125, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/BackgroundAgentStripStressTest.kt` (+61, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/BackgroundAgentStripTest.kt` (+774, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+63, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/StripTest.kt` (+193, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TaskToolViewStressTest.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TaskToolViewTest.kt` (+117, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorSettingsUiTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUiTest.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+54, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/ShimmerLabelTest.kt` (+58, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListRowHeightTest.kt` (+116, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridTest.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/vfs/KiloFileIconProviderTest.kt` (+68, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/log/KiloLog.kt` (+21, -2)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+12, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/BackgroundJobDto.kt` (+26, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+7, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/RunConfigDto.kt` (+12, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorktreeDto.kt` (+1, -0)
- `packages/kilo-jetbrains/shared/src/test/kotlin/ai/kilocode/log/KiloLogTest.kt` (+62, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/icon.tsx` (+4, -4)
- `packages/kilo-ui/src/components/message-part.tsx` (+136, -12)
- `packages/kilo-ui/src/components/tool-utils.test.ts` (+43, -1)
- `packages/kilo-ui/src/components/tool-utils.ts` (+41, -0)
- `packages/kilo-ui/src/i18n/fa.ts` (+1, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+48, -0)
- `packages/kilo-vscode/package.json` (+5, -2)
- `packages/kilo-vscode/src/KiloProvider.ts` (+30, -11)
- `packages/kilo-vscode/src/commands/toggle-auto-approve.ts` (+5, -15)
- `packages/kilo-vscode/src/kilo-provider/handlers/permission-handler.ts` (+38, -3)
- `packages/kilo-vscode/src/kilo-provider/slim-metadata.ts` (+20, -3)
- `packages/kilo-vscode/src/services/marketplace/index.ts` (+7, -1)
- `packages/kilo-vscode/src/services/marketplace/notify.ts` (+1, -0)
- `packages/kilo-vscode/src/services/marketplace/types.ts` (+8, -1)
- `packages/kilo-vscode/tests/fixtures/marketplace-install-modal.tsx` (+151, -0)
- `packages/kilo-vscode/tests/fixtures/permission-dock-input.tsx` (+95, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/close-to-right.test.ts` (+249, -0)
- `packages/kilo-vscode/tests/unit/i18n-keys.test.ts` (+11, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+105, -3)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/local-tabs.test.ts` (+14, -0)
- `packages/kilo-vscode/tests/unit/marketplace-actions.test.ts` (+34, -0)
- `packages/kilo-vscode/tests/unit/marketplace-install-modal.test.ts` (+4, -0)
- `packages/kilo-vscode/tests/unit/marketplace-notify.test.ts` (+17, -4)
- `packages/kilo-vscode/tests/unit/permission-dock-input.test.ts` (+4, -0)
- `packages/kilo-vscode/tests/unit/permission-recovery.test.ts` (+109, -1)
- `packages/kilo-vscode/tests/unit/revert-checkpoints.test.ts` (+6, -3)
- `packages/kilo-vscode/tests/unit/session-close.test.ts` (+130, -0)
- `packages/kilo-vscode/tests/unit/session-merge.test.ts` (+25, -0)
- `packages/kilo-vscode/tests/unit/session-utils.test.ts` (+47, -0)
- `packages/kilo-vscode/tests/unit/sidebar-tab-dnd.test.ts` (+8, -5)
- `packages/kilo-vscode/tests/unit/slim-metadata.test.ts` (+37, -0)
- `packages/kilo-vscode/tests/unit/tab-order.test.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ClosableTab.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/close-others.ts` (+3, -46)
- `packages/kilo-vscode/webview-ui/agent-manager/close-to-right.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/sortable-tab.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-order.ts` (+1, -29)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+12, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SortableTerminalTab.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/state.ts` (+3, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+44, -15)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/RevertBanner.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabMenu.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabStrip.tsx` (+20, -8)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+6, -5)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/InstallModal.tsx` (+15, -4)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/ItemCard.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceListView.tsx` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/RemoveDialog.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/marketplace.css` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/context/language.tsx` (+4, -3)
- `packages/kilo-vscode/webview-ui/src/context/local-tabs.tsx` (+55, -9)
- `packages/kilo-vscode/webview-ui/src/context/session-merge.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+26, -1)
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
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/marketplace.stories.tsx` (+46, -2)
- `packages/kilo-vscode/webview-ui/src/stories/session-tabs.stories.tsx` (+66, -0)
- `packages/kilo-vscode/webview-ui/src/styles/high-contrast.css` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/styles/permission-dock.css` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/styles/session-tabs.css` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/types/marketplace.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/sessions.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/utils/local-tabs.ts` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/utils/session-close.ts` (+44, -0)
- `packages/kilo-vscode/webview-ui/src/utils/tab-close.ts` (+104, -0)
- `packages/kilo-vscode/webview-ui/src/utils/tab-order.ts` (+52, -0)
- `packages/kilo-vscode/webview-ui/src/utils/terminal-tab-id.ts` (+13, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+26, -0)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/script/build-node.ts` (+1, -0)
- `packages/opencode/src/acp/event.ts` (+171, -9)
- `packages/opencode/src/acp/service.ts` (+40, -32)
- `packages/opencode/src/acp/usage.ts` (+5, -1)
- `packages/opencode/src/cli/cmd/account.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/pr.ts` (+5, -0)
- `packages/opencode/src/cli/cmd/run.ts` (+8, -4)
- `packages/opencode/src/config/config.ts` (+84, -15)
- `packages/opencode/src/config/parse.ts` (+5, -23)
- `packages/opencode/src/config/tui.ts` (+2, -0)
- `packages/opencode/src/control-plane/workspace.ts` (+2, -0)
- `packages/opencode/src/effect/runtime-flags.ts` (+3, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+18, -5)
- `packages/opencode/src/kilo-sessions/pr-link-poller.ts` (+223, -0)
- `packages/opencode/src/kilo-sessions/pr-link.ts` (+106, -152)
- `packages/opencode/src/kilocode/background-process/index.ts` (+23, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/context/tui-config.tsx` (+6, -0)
- `packages/opencode/src/kilocode/config-validation.ts` (+3, -1)
- `packages/opencode/src/kilocode/config/config.ts` (+8, -1)
- `packages/opencode/src/kilocode/config/excess.ts` (+20, -0)
- `packages/opencode/src/kilocode/config/writer.ts` (+9, -0)
- `packages/opencode/src/kilocode/marketplace/api.ts` (+10, -1)
- `packages/opencode/src/kilocode/marketplace/detection.ts` (+31, -1)
- `packages/opencode/src/kilocode/marketplace/installer.ts` (+121, -1)
- `packages/opencode/src/kilocode/marketplace/paths.ts` (+58, -0)
- `packages/opencode/src/kilocode/marketplace/plugin-config.ts` (+64, -0)
- `packages/opencode/src/kilocode/marketplace/plugin-spec.ts` (+19, -0)
- `packages/opencode/src/kilocode/marketplace/schema.ts` (+20, -1)
- `packages/opencode/src/kilocode/mcp-oauth-callback.ts` (+116, -8)
- `packages/opencode/src/kilocode/plugin/git-source.ts` (+254, -0)
- `packages/opencode/src/kilocode/provider/error.ts` (+2, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+2, -2)
- `packages/opencode/src/kilocode/server/httpapi/groups/session-import.ts` (+1, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+19, -4)
- `packages/opencode/src/kilocode/session/compaction-chunks.ts` (+9, -13)
- `packages/opencode/src/kilocode/session/compaction-payload-recovery.ts` (+11, -13)
- `packages/opencode/src/kilocode/session/goal/policy.ts` (+1, -1)
- `packages/opencode/src/kilocode/session/goal/runner.ts` (+243, -130)
- `packages/opencode/src/kilocode/session/goal/tool.ts` (+44, -0)
- `packages/opencode/src/kilocode/session/model-usage.ts` (+29, -15)
- `packages/opencode/src/kilocode/wakeup/cron.ts` (+179, -0)
- `packages/opencode/src/kilocode/wakeup/index.ts` (+225, -3)
- `packages/opencode/src/kilocode/wakeup/resume.ts` (+7, -4)
- `packages/opencode/src/kilocode/wakeup/schema.ts` (+53, -1)
- `packages/opencode/src/mcp/index.ts` (+101, -24)
- `packages/opencode/src/mcp/oauth-callback.ts` (+40, -1)
- `packages/opencode/src/mcp/oauth-provider.ts` (+41, -3)
- `packages/opencode/src/plugin/cerebras.ts` (+11, -0)
- `packages/opencode/src/plugin/cloudflare.ts` (+0, -11)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+4, -1)
- `packages/opencode/src/plugin/index.ts` (+2, -0)
- `packages/opencode/src/plugin/install.ts` (+5, -1)
- `packages/opencode/src/plugin/openai/codex.ts` (+16, -4)
- `packages/opencode/src/plugin/openai/ws-pool.ts` (+3, -2)
- `packages/opencode/src/plugin/openai/ws.ts` (+6, -4)
- `packages/opencode/src/plugin/shared.ts` (+11, -0)
- `packages/opencode/src/provider/provider.ts` (+49, -13)
- `packages/opencode/src/provider/transform.ts` (+10, -2)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/proxy.ts` (+33, -0)
- `packages/opencode/src/server/shared/ui.ts` (+1, -1)
- `packages/opencode/src/server/shared/workspace-routing.ts` (+7, -0)
- `packages/opencode/src/session/compaction.ts` (+114, -23)
- `packages/opencode/src/session/llm/ai-sdk.ts` (+3, -0)
- `packages/opencode/src/session/message-v2.ts` (+12, -9)
- `packages/opencode/src/session/prompt.ts` (+4, -2)
- `packages/opencode/src/session/prompt/meta.txt` (+2, -2)
- `packages/opencode/src/session/retry.ts` (+47, -33)
- `packages/opencode/src/session/revert.ts` (+16, -7)
- `packages/opencode/src/session/session.ts` (+12, -12)
- `packages/opencode/src/session/system.ts` (+9, -2)
- `packages/opencode/src/session/tools.ts` (+4, -1)
- `packages/opencode/test/acp/event.test.ts` (+47, -0)
- `packages/opencode/test/acp/service-session.test.ts` (+168, -23)
- `packages/opencode/test/acp/usage.test.ts` (+3, -3)
- `packages/opencode/test/cli/account.test.ts` (+2, -2)
- `packages/opencode/test/cli/pr-status.test.ts` (+8, -0)
- `packages/opencode/test/config/config.test.ts` (+5, -10)
- `packages/opencode/test/control-plane/workspace.test.ts` (+16, -0)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+26, -0)
- `packages/opencode/test/kilocode/background-process-monitor.test.ts` (+302, -0)
- `packages/opencode/test/kilocode/background-process-tool.test.ts` (+6, -1)
- `packages/opencode/test/kilocode/chart-tool-gating.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/cli/cmd/tui/context/tui-config.test.ts` (+6, -0)
- `packages/opencode/test/kilocode/compaction-payload-recovery.test.ts` (+5, -0)
- `packages/opencode/test/kilocode/config-resilience.test.ts` (+34, -3)
- `packages/opencode/test/kilocode/config-validation.test.ts` (+1, -2)
- `packages/opencode/test/kilocode/config/config.test.ts` (+67, -0)
- `packages/opencode/test/kilocode/context-tools-cli.test.ts` (+148, -0)
- `packages/opencode/test/kilocode/context-tools.test.ts` (+283, -0)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+169, -6)
- `packages/opencode/test/kilocode/marketplace-api.test.ts` (+7, -1)
- `packages/opencode/test/kilocode/marketplace-plugin-http.test.ts` (+73, -0)
- `packages/opencode/test/kilocode/marketplace-plugin.test.ts` (+339, -0)
- `packages/opencode/test/kilocode/mcp-oauth-callback.test.ts` (+128, -1)
- `packages/opencode/test/kilocode/plugin-git-source.test.ts` (+266, -0)
- `packages/opencode/test/kilocode/project-config-update.test.ts` (+24, -0)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+37, -0)
- `packages/opencode/test/kilocode/server/provider-enabled-allowlist.test.ts` (+136, -0)
- `packages/opencode/test/kilocode/server/tui-config.test.ts` (+29, -0)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+13, -1)
- `packages/opencode/test/kilocode/session-model-usage.test.ts` (+43, -0)
- `packages/opencode/test/kilocode/session-processor-retry-limit.test.ts` (+136, -79)
- `packages/opencode/test/kilocode/session/goal.test.ts` (+132, -2)
- `packages/opencode/test/kilocode/session/revert.test.ts` (+34, -0)
- `packages/opencode/test/kilocode/sessions/pr-link.test.ts` (+500, -156)
- `packages/opencode/test/kilocode/tool-registry-indexing-import-failure.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+12, -0)
- `packages/opencode/test/kilocode/tool-registry-semantic-import-failure.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/wakeup/cron.test.ts` (+202, -0)
- `packages/opencode/test/kilocode/wakeup/wakeup-cron.test.ts` (+562, -0)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+1, -1)
- `packages/opencode/test/mcp/oauth-browser-completion.test.ts` (+375, -0)
- `packages/opencode/test/plugin/cerebras.test.ts` (+47, -0)
- `packages/opencode/test/plugin/cloudflare.test.ts` (+5, -48)
- `packages/opencode/test/plugin/codex.test.ts` (+216, -46)
- `packages/opencode/test/plugin/github-copilot-models.test.ts` (+68, -0)
- `packages/opencode/test/plugin/openai-ws.test.ts` (+26, -1)
- `packages/opencode/test/plugin/xai.test.ts` (+1, -7)
- `packages/opencode/test/provider/cf-ai-gateway-e2e.test.ts` (+216, -40)
- `packages/opencode/test/provider/error.test.ts` (+24, -0)
- `packages/opencode/test/provider/provider.test.ts` (+27, -0)
- `packages/opencode/test/provider/transform.test.ts` (+65, -0)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+15, -0)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+5, -0)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+3, -2)
- `packages/opencode/test/server/workspace-routing.test.ts` (+7, -0)
- `packages/opencode/test/session/compaction.test.ts` (+358, -14)
- `packages/opencode/test/session/llm.test.ts` (+65, -0)
- `packages/opencode/test/session/message-v2.test.ts` (+67, -0)
- `packages/opencode/test/session/processor-effect.test.ts` (+104, -0)
- `packages/opencode/test/session/prompt.test.ts` (+82, -5)
- `packages/opencode/test/session/retry.test.ts` (+87, -6)
- `packages/opencode/test/session/revert-compact.test.ts` (+45, -0)
- `packages/opencode/test/session/session.test.ts` (+32, -0)
- `packages/opencode/test/session/system.test.ts` (+82, -3)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/schema/src/revert.ts` (+1, -1)
- `packages/schema/src/v1/session.ts` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/script/tests/check-opencode-annotations.test.ts` (+48, -0)
- `packages/sdk-next/package.json` (+3, -3)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/kilocode/permission.ts` (+69, -17)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+3, -3)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+38, -16)
- `packages/sdk/js/test/kilocode/permission.test.ts` (+101, -0)
- `packages/sdk/openapi.json` (+92, -16)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/components/basic-tool.tsx` (+15, -1)
- `packages/session-ui/src/components/message-part.tsx` (+4, -11)
- `packages/session-ui/src/components/part-default-open.test.ts` (+66, -0)
- `packages/session-ui/src/components/part-default-open.ts` (+26, -0)
- `packages/session-ui/src/components/session-turn.tsx` (+1, -1)
- `packages/session-ui/src/context/data.tsx` (+4, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/clipboard.ts` (+2, -1)
- `packages/tui/src/component/prompt/index.tsx` (+3, -0)
- `packages/tui/src/config/index.tsx` (+20, -1)
- `packages/tui/src/context/sync.tsx` (+3, -3)
- `packages/tui/src/routes/session/index.tsx` (+41, -33)
- `packages/tui/src/routes/session/permission.tsx` (+1, -0)
- `packages/tui/src/routes/session/question.tsx` (+1, -0)
- `packages/tui/src/ui/dialog-export-options.tsx` (+3, -0)
- `packages/tui/src/ui/dialog-prompt.tsx` (+1, -0)
- `packages/tui/src/ui/dialog-select.tsx` (+1, -0)
- `packages/tui/src/util/transcript.ts` (+3, -1)
- `packages/tui/test/cli/cmd/tui/sync-live-hydration.test.tsx` (+23, -0)
- `packages/tui/test/config.test.tsx` (+17, -2)
- `packages/tui/test/util/transcript.test.ts` (+28, -0)
- `packages/ui/AGENTS.md` (+3, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/i18n/am.ts` (+196, -0)
- `packages/ui/src/i18n/bg.ts` (+197, -0)
- `packages/ui/src/i18n/bn.ts` (+199, -0)
- `packages/ui/src/i18n/ca.ts` (+201, -0)
- `packages/ui/src/i18n/cs.ts` (+205, -0)
- `packages/ui/src/i18n/dv.ts` (+198, -0)
- `packages/ui/src/i18n/dz.ts` (+199, -0)
- `packages/ui/src/i18n/el.ts` (+197, -0)
- `packages/ui/src/i18n/et.ts` (+197, -0)
- `packages/ui/src/i18n/fa.ts` (+197, -0)
- `packages/ui/src/i18n/fo.ts` (+197, -0)
- `packages/ui/src/i18n/hr.ts` (+202, -0)
- `packages/ui/src/i18n/hu.ts` (+199, -0)
- `packages/ui/src/i18n/hy.ts` (+197, -0)
- `packages/ui/src/i18n/is.ts` (+197, -0)
- `packages/ui/src/i18n/ka.ts` (+197, -0)
- `packages/ui/src/i18n/km.ts` (+198, -0)
- `packages/ui/src/i18n/lo.ts` (+197, -0)
- `packages/ui/src/i18n/lt.ts` (+205, -0)
- `packages/ui/src/i18n/lv.ts` (+201, -0)
- `packages/ui/src/i18n/mk.ts` (+197, -0)
- `packages/ui/src/i18n/mn.ts` (+197, -0)
- `packages/ui/src/i18n/ms.ts` (+197, -0)
- `packages/ui/src/i18n/my.ts` (+198, -0)
- `packages/ui/src/i18n/ne.ts` (+199, -0)
- `packages/ui/src/i18n/ro.ts` (+201, -0)
- `packages/ui/src/i18n/si.ts` (+197, -0)
- `packages/ui/src/i18n/sk.ts` (+205, -0)
- `packages/ui/src/i18n/sl.ts` (+206, -0)
- `packages/ui/src/i18n/sq.ts` (+197, -0)
- `packages/ui/src/i18n/sr.ts` (+202, -0)
- `packages/ui/src/i18n/tg.ts` (+197, -0)
- `packages/ui/src/i18n/tk.ts` (+197, -0)
- `packages/ui/src/i18n/uz.ts` (+200, -0)
- `packages/ui/src/theme/themes/oc-2.json` (+1, -1)
- `packages/ui/src/v2/components/button-v2.css` (+2, -2)
- `patches/@ai-sdk%2Fgroq@3.0.31.patch` (+76, -0)
- `patches/@ai-sdk%2Fmistral@3.0.51.patch` (+16, -11)
- `patches/@ai-sdk%2Fopenai-compatible@2.0.41.patch` (+39, -0)
- `patches/@ai-sdk%2Fopenai-compatible@2.0.48.patch` (+39, -0)
- `patches/@ai-sdk%2Fxai@3.0.102.patch` (+111, -7)
- `script/check-opencode-annotations.ts` (+5, -1)
- `script/check-opencode-promise-facades.ts` (+6, -2)
- `script/upstream/README.md` (+9, -9)
- `script/upstream/analyze.ts` (+1, -1)
- `script/upstream/package.json` (+1, -1)
- `script/upstream/transforms/transform-package-json.test.ts` (+12, -1)
- `script/upstream/transforms/transform-package-json.ts` (+3, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 097e0cd59..701b1a9e9 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.7.5",
+  "version": "7.7.7",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -92,7 +92,7 @@
     "@ai-sdk/deepinfra": "2.0.41",
     "@ai-sdk/gateway": "3.0.157",
     "@ai-sdk/google": "3.0.73",
-    "@ai-sdk/google-vertex": "4.0.128",
+    "@ai-sdk/google-vertex": "4.0.181",
     "@ai-sdk/groq": "3.0.31",
     "@ai-sdk/mistral": "3.0.51",
     "@ai-sdk/openai": "3.0.88",
@@ -105,7 +105,7 @@
     "@ai-sdk/xai": "3.0.102",
     "@aws-sdk/credential-providers": "3.1057.0",
     "@openrouter/ai-sdk-provider": "2.9.0",
-    "ai-gateway-provider": "3.1.2",
+    "ai-gateway-provider": "3.2.0",
     "gitlab-ai-provider": "6.12.1",
     "google-auth-library": "10.5.0",
     "immer": "11.1.4",
```

#### packages/core/src/plugin/agent.ts
```diff
diff --git a/packages/core/src/plugin/agent.ts b/packages/core/src/plugin/agent.ts
index 9a763c7ea..915df79d5 100644
--- a/packages/core/src/plugin/agent.ts
+++ b/packages/core/src/plugin/agent.ts
@@ -30,15 +30,11 @@ Guidelines:
 
 Complete the user's search request efficiently and report your findings clearly.`
 
-const PROMPT_COMPACTION = `You are an anchored context summarization assistant for coding sessions.
-
-Summarize only the conversation history you are given. The newest turns may be kept verbatim outside your summary, so focus on the older context that still matters for continuing the work.
-
-If the prompt includes a <previous-summary> block, treat it as the current anchored summary. Update it with the new history by preserving still-true details, removing stale details, and merging in new facts.
+const PROMPT_COMPACTION = `You are a context summarization agent. You are given a conversation between a user and an agent. Your goal is to produce a structured summary matching the format specified so another coding agent can continue the work.
 
 Always follow the exact output structure requested by the user prompt. Keep every section, preserve exact file paths and identifiers when known, and prefer terse bullets over paragraphs.
 
-Do not answer the conversation itself. Do not mention that you are summarizing, compacting, or merging context. Respond in the same language as the conversation.`
+Do not continue the conversation. Do not respond to any questions in the conversation. Only output the structured summary in the exact format requested by the user prompt. Respond in the same language as the conversation.`
 
 const PROMPT_TITLE = `You are a title generator. You output ONLY a thread title. Nothing else.
 
```

#### packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
```diff
diff --git a/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts b/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
index d416f6f19..2803cb7a8 100644
--- a/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
+++ b/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
@@ -24,9 +24,15 @@ export const CloudflareAIGatewayPlugin = define({
           apiKey: config.apiKey,
           options: gatewayOptions(evt.options, metadata),
         } as any)
-        const unified = createUnified({ apiKey: config.apiKey })
         evt.sdk = {
           languageModel(modelID: string) {
+            // Workers AI is the only first-party provider whose upstream is Cloudflare itself, so it is
+            // the only one that should receive the Cloudflare token as its upstream Authorization header.
+            // The Unified API addresses Workers AI both with the explicit "workers-ai/" prefix and as
+            // bare "@cf/..." ids. Third-party providers must not receive the token; they rely on the
+            // gateway's stored/BYOK keys instead.
+            const isWorkersAi = modelID.startsWith("workers-ai/") || modelID.startsWith("@cf/")
+            const unified = createUnified(isWorkersAi ? { apiKey: config.apiKey } : {})
             return gateway(unified(modelID))
           },
         }
```

#### packages/core/src/plugin/skill/customize-opencode.md
```diff
diff --git a/packages/core/src/plugin/skill/customize-opencode.md b/packages/core/src/plugin/skill/customize-opencode.md
index 6d8beba6e..df541b7af 100644
--- a/packages/core/src/plugin/skill/customize-opencode.md
+++ b/packages/core/src/plugin/skill/customize-opencode.md
@@ -40,7 +40,7 @@ already-loaded config until then.
 | Scope                         | Path                                                                                                                      |
 | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
 | Project config                | `./opencode.json`, `./opencode.jsonc`, or `.opencode/opencode.json` (opencode walks up from the cwd to the worktree root) |
-| Global config                 | `~/.config/opencode/opencode.json` (NOT `~/.opencode/`)                                                                   |
+| Global config                 | `~/.config/opencode/opencode.json` or `~/.config/opencode/opencode.jsonc` (NOT `~/.opencode/`)                            |
 | Project agents                | `.opencode/agent/<name>.md` or `.opencode/agents/<name>.md`                                                               |
 | Global agents                 | `~/.config/opencode/agent(s)/<name>.md`                                                                                   |
 | Project commands              | `.opencode/command/<name>.md` or `.opencode/commands/<name>.md`                                                           |
```

#### packages/core/src/ripgrep.ts
```diff
diff --git a/packages/core/src/ripgrep.ts b/packages/core/src/ripgrep.ts
index 9beaace29..5702b043d 100644
--- a/packages/core/src/ripgrep.ts
+++ b/packages/core/src/ripgrep.ts
@@ -328,7 +328,10 @@ const layer = Layer.effect(
                 }),
                 line: match.line_number,
                 offset: match.absolute_offset,
-                text: match.lines.text.length > 2_000 ? match.lines.text.slice(0, 2_000) + "..." : match.lines.text,
+                text:
+                  match.lines.text.length > 2_000
+                    ? match.lines.text.slice(0, 2_000).replace(/[\uD800-\uDBFF]$/, "") + "..."
+                    : match.lines.text,
                 submatches: match.submatches.map((submatch) => ({
                   text: submatch.match.text,
                   start: submatch.start,
```


*... and more files (showing first 5)*

## opencode Changes (70a2469..18ef3cc)

### Commits

- 18ef3cc - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-23)
- 45719ac - maint(gitlab): bump gitlab-ai-provider to 6.16.0 (#50742) (Vladimir Glafirov, 2026-09-22)
- 2406400 - chore: generate (opencode-agent[bot], 2026-09-22)
- fe51b0b - fix(console): restrict legacy access to Black (#50716) (vprdev, 2026-09-22)
- 6ea95e5 - docs(web): add Claude Opus 5.5, GPT 6 Sol, and GPT 6 Luna to Zen (#50708) (Daniel Chen, 2026-09-22)
- fc827ea - chore: generate (opencode-agent[bot], 2026-09-22)
- 3a35b45 - feat(openai): allow GPT-6 Sol and Luna with Codex (#50704) (opencode-agent[bot], 2026-09-22)
- fe3f3a4 - sync release versions for v1.18.32 (opencode, 2026-09-21)
- f5ce4f8 - fix(core): break filesystem search import cycle (#50439) (Aiden Cline, 2026-09-21)
- f54ce31 - chore: generate (opencode-agent[bot], 2026-09-21)
- 32808ad - docs: add MiMo V2.6 models (#50395) (Jack, 2026-09-22)
- ba341c6 - fix(core): resolve npm package entrypoint to a file under Node (#50413) (Aiden Cline, 2026-09-21)
- e059ac5 - feat: add Grok 4.7 to Zen and Go (#50288) (Daniel Chen, 2026-09-21)

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
- `packages/console/core/src/billing.ts` (+1, -0)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/filesystem/search.ts` (+10, -9)
- `packages/core/src/npm.ts` (+9, -1)
- `packages/core/test/npm.test.ts` (+70, -0)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+36, -30)
- `nix/hashes.json` (+4, -4)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/go-models.ts` (+11, -1)
- `packages/console/app/src/component/limits-graph.tsx` (+1, -1)
- `packages/console/app/src/context/auth.ts` (+49, -18)
- `packages/console/app/src/routes/auth/index.ts` (+2, -1)
- `packages/console/app/src/routes/go/index.tsx` (+5, -2)
- `packages/console/app/src/routes/workspace/[id]/go/index.tsx` (+2, -1)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+3, -0)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/function/src/auth.ts` (+45, -69)
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
- `packages/opencode/src/plugin/openai/codex.ts` (+1, -1)
- `packages/opencode/test/plugin/codex.test.ts` (+12, -4)
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
- `packages/web/src/content/docs/ar/go.mdx` (+22, -4)
- `packages/web/src/content/docs/ar/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/bs/go.mdx` (+22, -4)
- `packages/web/src/content/docs/bs/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/da/go.mdx` (+22, -4)
- `packages/web/src/content/docs/da/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/de/go.mdx` (+22, -4)
- `packages/web/src/content/docs/de/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/es/go.mdx` (+22, -4)
- `packages/web/src/content/docs/es/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/fr/go.mdx` (+22, -4)
- `packages/web/src/content/docs/fr/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/go.mdx` (+22, -4)
- `packages/web/src/content/docs/it/go.mdx` (+22, -4)
- `packages/web/src/content/docs/it/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/ja/go.mdx` (+22, -4)
- `packages/web/src/content/docs/ja/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/ko/go.mdx` (+22, -4)
- `packages/web/src/content/docs/ko/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/nb/go.mdx` (+22, -4)
- `packages/web/src/content/docs/nb/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/pl/go.mdx` (+22, -4)
- `packages/web/src/content/docs/pl/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+22, -4)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/ru/go.mdx` (+22, -4)
- `packages/web/src/content/docs/ru/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/th/go.mdx` (+22, -4)
- `packages/web/src/content/docs/th/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/tr/go.mdx` (+22, -4)
- `packages/web/src/content/docs/tr/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+22, -4)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+15, -0)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+22, -4)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+15, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index fefbe8a..0c6b062 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.31",
+  "version": "1.18.32",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/billing.ts
```diff
diff --git a/packages/console/core/src/billing.ts b/packages/console/core/src/billing.ts
index adeabd9..1942704 100644
--- a/packages/console/core/src/billing.ts
+++ b/packages/console/core/src/billing.ts
@@ -304,6 +304,7 @@ export namespace Billing {
     }),
     async (input) => {
       const user = Actor.assert("user")
+      throw new Error("Go subscriptions have moved to the new Console")
       const { successUrl, cancelUrl, method } = input
 
       const email = (await User.getAuthEmail(user.properties.userID))!
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 72e834c..ced7b61 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.31",
+  "version": "1.18.32",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -108,7 +108,7 @@
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
-    "gitlab-ai-provider": "6.15.0",
+    "gitlab-ai-provider": "6.16.0",
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "gray-matter": "4.0.3",
```

#### packages/core/src/filesystem/search.ts
```diff
diff --git a/packages/core/src/filesystem/search.ts b/packages/core/src/filesystem/search.ts
index c773838..cdba2be 100644
--- a/packages/core/src/filesystem/search.ts
+++ b/packages/core/src/filesystem/search.ts
@@ -5,7 +5,8 @@ import path from "path"
 import { Context, Effect, Layer, Scope } from "effect"
 import { Fff } from "#fff"
 import fuzzysort from "fuzzysort"
-import { FileSystem } from "../filesystem"
+import { Entry, Match } from "@opencode-ai/schema/filesystem"
+import type { FileSystem } from "../filesystem"
 import { FSUtil } from "../fs-util"
 import { Location } from "../location"
 import { Ripgrep } from "../ripgrep"
@@ -61,7 +62,7 @@ export const ripgrepLayer = Layer.effect(
             .pipe(
               Effect.map((result) =>
                 result.map((entry) =>
-                  FileSystem.Entry.make({
+                  Entry.make({
                     ...entry,
                     path: RelativePath.make(path.relative(location.directory, path.resolve(cwd, entry.path))),
                   }),
@@ -86,9 +87,9 @@ export const ripgrepLayer = Layer.effect(
             .pipe(
               Effect.map((result) =>
                 result.map((match) =>
-                  FileSystem.Match.make({
+                  Match.make({
                     ...match,
-                    entry: FileSystem.Entry.make({
+                    entry: Entry.make({
                       ...match.entry,
                       path: RelativePath.make(path.relative(location.directory, path.resolve(cwd, match.entry.path))),
                     }),
@@ -109,7 +110,7 @@ export const ripgrepLayer = Layer.effect(
           return fuzzysort.go(input.query, items, { limit: input.limit ?? 50 }).map((item) => {
             const relative = item.target
             const type = relative.endsWith(path.sep) ? ("directory" as const) : ("file" as const)
-            return FileSystem.Entry.make({
+            return Entry.make({
               path: RelativePath.make(relative),
               type,
             })
@@ -154,7 +155,7 @@ export const fffLayer = Layer.effect(
           })
           if (!found.ok) throw found.error
           return found.value.items.map((item) =>
-            FileSystem.Entry.make({
+            Entry.make({
```

#### packages/core/src/npm.ts
```diff
diff --git a/packages/core/src/npm.ts b/packages/core/src/npm.ts
index 30e12cf..94e573d 100644
--- a/packages/core/src/npm.ts
+++ b/packages/core/src/npm.ts
@@ -1,6 +1,8 @@
 export * as Npm from "./npm"
 
 import path from "path"
+import { createRequire } from "module"
+import { pathToFileURL } from "url"
 import npa from "npm-package-arg"
 import { Effect, Schema, Context, Layer, Option, FileSystem } from "effect"
 import { NodeFileSystem } from "@effect/platform-node"
@@ -50,7 +52,13 @@ export function sanitize(pkg: string) {
 const resolveEntryPoint = (name: string, dir: string): EntryPoint => {
   let entrypoint: string | undefined
   try {
-    entrypoint = typeof Bun !== "undefined" ? import.meta.resolve(name, dir) : import.meta.resolve(dir)
+    // Node only honors the parent argument behind --experimental-import-meta-resolve, and
+    // import() of the bare package directory fails with ERR_UNSUPPORTED_DIR_IMPORT. require
+    // resolution picks the "require"/"default" export target, which import() loads fine.
+    entrypoint =
+      typeof Bun !== "undefined"
+        ? import.meta.resolve(name, dir)
+        : pathToFileURL(createRequire(path.join(dir, "package.json")).resolve(name)).href
   } catch {
     entrypoint = undefined
   }
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/prompt/compaction.txt
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/plugin/agent.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/skill/customize-opencode.md
- `src/core/` - review core changes from packages/core/src/ripgrep.ts
- `src/core/` - review core changes from packages/core/src/session/compaction.ts
- `src/core/` - review core changes from packages/core/src/session/projector.ts
- `src/core/` - review core changes from packages/core/src/session/runner/llm.ts
- `src/core/` - review core changes from packages/core/src/session/sql.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/core/` - review core changes from packages/core/test/provider-groq.test.ts
- `src/core/` - review core changes from packages/core/test/provider-mistral.test.ts
- `src/core/` - review core changes from packages/core/test/provider-xai-responses.test.ts
- `src/core/` - review core changes from packages/core/test/ripgrep.test.ts
- `src/core/` - review core changes from packages/core/test/session-compaction.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner.test.ts
- `src/tool/TaskToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt changes
- `src/tool/background-process.ts` - update based on kilocode packages/opencode/src/kilocode/tool/background-process.ts changes
- `src/tool/background-process.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/background-process.txt changes
- `src/tool/cancel-wakeup.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cancel-wakeup.ts changes
- `src/tool/code-mode.ts` - update based on kilocode packages/opencode/src/tool/code-mode.ts changes
- `src/tool/context.ts` - update based on kilocode packages/opencode/src/kilocode/tool/context.ts changes
- `src/tool/cron-create.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cron-create.txt changes
- `src/tool/cron-delete.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cron-delete.txt changes
- `src/tool/cron-list.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cron-list.txt changes
- `src/tool/cron.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/cron.test.ts changes
- `src/tool/cron.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cron.ts changes
- `src/tool/link-pr.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/link-pr.test.ts changes
- `src/tool/link-pr.ts` - update based on kilocode packages/opencode/src/kilocode/tool/link-pr.ts changes
- `src/tool/link-pr.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/link-pr.txt changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/schedule-wakeup.ts` - update based on kilocode packages/opencode/src/kilocode/tool/schedule-wakeup.ts changes
- `src/tool/send-file.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/send-file.test.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/wakeup-format.ts` - update based on kilocode packages/opencode/src/kilocode/tool/wakeup-format.ts changes
- `src/tool/websearch.test.ts` - update based on kilocode packages/opencode/test/tool/websearch.test.ts changes
