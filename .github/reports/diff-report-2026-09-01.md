# Upstream Changes Report
Generated: 2026-09-01 11:13:38

## Summary
- kilocode: 171 commits, 474 files changed
- opencode: 10 commits, 24 files changed

## kilocode Changes (ab143253a..b6a2979e5)

### Commits

- b6a2979e5 - Merge pull request #13656 from Kilo-Org/dedupe-b-ui-fourth (Marius, 2026-09-01)
- 1ab7e3a9e - Merge pull request #13657 from Kilo-Org/dedupe-a-fifth-host-group (Marius, 2026-09-01)
- 9d1c0d16b - Merge pull request #13654 from Kilo-Org/dedupe-c-config-overlay (Marius, 2026-09-01)
- 49692a6ab - feat(remote): advertise instance kind and process identity (#13565) (Igor Šćekić, 2026-09-01)
- 73150fb40 - refactor(vscode): reuse Markdown fence formatting (marius-kilocode, 2026-09-01)
- ddf42be04 - Merge pull request #13655 from Kilo-Org/dedupe-a-fourth-host-group (Marius, 2026-09-01)
- 7b3c20a39 - refactor(vscode): share dropped mention text insertion (marius-kilocode, 2026-09-01)
- 131deb52f - refactor(vscode): share autocomplete FIM model selection (marius-kilocode, 2026-09-01)
- 706f776b8 - refactor(cli): reuse config overlay reader after updates (marius-kilocode, 2026-09-01)
- 5fbc3803e - Merge pull request #13641 from Kilo-Org/improve-esc-subagent-control (Marius, 2026-09-01)
- 971322a9f - Merge pull request #13652 from Kilo-Org/dedupe-a-third-host-group (Marius, 2026-09-01)
- b7d1527d2 - Merge pull request #13653 from Kilo-Org/dedupe-c-mcp-normalization (Marius, 2026-09-01)
- 4c1bdb03f - Merge pull request #13651 from Kilo-Org/dedupe-b-next-ui-group (Marius, 2026-09-01)
- c861cce87 - Merge pull request #13648 from Kilo-Org/dedupe-c-bash-permissions (Marius, 2026-09-01)
- b3a89e9df - Merge pull request #13650 from Kilo-Org/fix-inspector-state-collapse (Marius, 2026-09-01)
- 1c50fc935 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-01)
- f03f93c54 - refactor(kilo-console): remove duplicate remote MCP normalization (marius-kilocode, 2026-09-01)
- 01aaa241e - refactor(vscode): reuse Git directory resolver (marius-kilocode, 2026-09-01)
- 303c618c2 - refactor(vscode): share local activity indicator (marius-kilocode, 2026-09-01)
- 19546908b - fix: align scoped interruption with CI guards (marius-kilocode, 2026-09-01)
- 1f3f1caf5 - Merge pull request #13649 from Kilo-Org/dedupe-b-relative-path (Marius, 2026-09-01)
- 72babe6af - Merge pull request #13647 from Kilo-Org/dedupe-a-next-host-group (Marius, 2026-09-01)
- a6bdd6f2c - fix(agent-manager): keep inspectors open on browser state updates (marius-kilocode, 2026-09-01)
- fc53e6db8 - fix: limit background-agent changes to interruption controls (marius-kilocode, 2026-09-01)
- 3ba58e485 - chore: merge main and retain resolved duplication removals (marius-kilocode, 2026-09-01)
- 0fc7f3686 - refactor(ui): share project-relative path formatting (marius-kilocode, 2026-09-01)
- 078357910 - Merge pull request #13646 from Kilo-Org/fix-background-agent-modal-collapse-button (Marius, 2026-09-01)
- 018c5e544 - Merge pull request #13643 from Kilo-Org/dedupe-b-context-requests (Marius, 2026-09-01)
- e096d3ab7 - refactor(cli): share common bash permission entries (marius-kilocode, 2026-09-01)
- 51d5d9b0e - refactor(vscode): share not-found error detection (marius-kilocode, 2026-09-01)
- ff9d04b0e - Merge pull request #13644 from Kilo-Org/dedupe-a-git-file-entries (Marius, 2026-09-01)
- aff6d2752 - Merge pull request #13642 from Kilo-Org/dedupe-c-device-auth-http (Marius, 2026-09-01)
- e80381502 - fix(vscode): show background agents collapse icon (marius-kilocode, 2026-09-01)
- e2c26fc8b - Merge pull request #13610 from Kilo-Org/persist-subagent-sidebar-context-across-worktrees (Marius, 2026-09-01)
- 4c5d93535 - refactor(agent-manager): use else for setup status (marius-kilocode, 2026-09-01)
- 9a0992468 - test(vscode): rely on existing terminal cleanup coverage (marius-kilocode, 2026-09-01)
- f1c1fae1c - refactor(vscode): reduce context wrappers and test scope (marius-kilocode, 2026-09-01)
- 8bffb8465 - test: trim background agent coverage to the core scenarios (marius-kilocode, 2026-09-01)
- c366c32de - test(gateway): keep device auth coverage focused (marius-kilocode, 2026-09-01)
- fb0781d4a - refactor(vscode): share terminal directory blocking (marius-kilocode, 2026-09-01)
- f1d3f9f33 - refactor(vscode): share context request bookkeeping (marius-kilocode, 2026-09-01)
- 149eecab8 - refactor(gateway): share device authorization HTTP requests (marius-kilocode, 2026-09-01)
- cef1ba633 - refactor(vscode): reuse existing background agent strings for the count (marius-kilocode, 2026-09-01)
- fbed1d252 - Merge branch 'main' into persist-subagent-sidebar-context-across-worktrees (Andrea Giammarchi, 2026-09-01)
- dd390c193 - feat: keep background agents running when the main agent stops (marius-kilocode, 2026-09-01)
- 515d800bb - Merge pull request #13639 from Kilo-Org/undefined-or-null (Andrea Giammarchi, 2026-09-01)
- eee9bcf07 - Merge branch 'main' into persist-subagent-sidebar-context-across-worktrees (Andrea Giammarchi, 2026-09-01)
- 6ddb93ffe - Merge branch 'main' into undefined-or-null (Andrea Giammarchi, 2026-09-01)
- e2b1644b2 - docs: Use `ref == null` to check for both `null` and `undefined` (webreflection, 2026-09-01)
- e95f7e76b - fix(vscode): default Agent Manager terminals to the side panel (marius-kilocode, 2026-09-01)
- 0a5a7172b - Merge pull request #13630 from Kilo-Org/enable-terminal-agent-manager-by-default (Marius, 2026-09-01)
- 9233b5cc0 - Merge pull request #13637 from Kilo-Org/fix-empty-extension-crash (Marius, 2026-09-01)
- 36804b034 - fix(vscode): preserve packaged Playwright runtime (marius-kilocode, 2026-09-01)
- 4a0ea1297 - Merge pull request #13634 from Kilo-Org/jetbrains/release/v7.1.3 (Kirill Kalishev, 2026-08-31)
- dd45e685e - docs(jetbrains): edit changelog for v7.1.3 (Kirill Kalishev, 2026-08-31)
- 4289ef1a9 - release(jetbrains): v7.1.3 (kilo-maintainer[bot], 2026-08-31)
- 0dab8a43e - Merge pull request #13632 from Kilo-Org/update-jetbrains-plugin-description (Kirill Kalishev, 2026-08-31)
- 9cd826a58 - Merge pull request #13628 from Kilo-Org/brave-dune (Kirill Kalishev, 2026-08-31)
- b6d02ece5 - fix(jetbrains): double the dwell before a worktree row popup opens (kirillk, 2026-08-31)
- fc2ed1cea - Merge branch 'main' into update-jetbrains-plugin-description (Kirill Kalishev, 2026-08-31)
- fc8077b51 - fix(jetbrains): report a spent GitHub budget instead of blanking the badges (kirillk, 2026-08-31)
- 6e33fdf3e - chore(jetbrains): accept a dev-sha suffix on a local build version (kirillk, 2026-08-31)
- e5a962dbf - Merge pull request #13621 from Kilo-Org/docs/small-model-routing-config (Alex Gold, 2026-08-31)
- 8d0c4147f - Merge remote-tracking branch 'origin/main' into brave-dune (kirillk, 2026-08-31)
- cad7d81d9 - fix(jetbrains): measure a popup row's real width and pad it further (kirillk, 2026-08-31)
- 52c8af539 - fix(jetbrains): give the popup scrollbar its own room and double the width cap (kirillk, 2026-08-31)
- 3e4f95720 - fix(jetbrains): scroll the popup PR title instead of wrapping it (kirillk, 2026-08-31)
- 59c68e16c - fix(jetbrains): wrap the popup PR title and shrink the running dot (kirillk, 2026-08-31)
- 3f13f5fd8 - fix(jetbrains): stack the worktree row popup one fact per line (kirillk, 2026-08-31)
- 12c0aff10 - fix(jetbrains): quiet the PR indicators and line them up on worktree rows (kirillk, 2026-08-31)
- 11eb42721 - Merge pull request #13588 from Kilo-Org/silent-thunder (Kirill Kalishev, 2026-08-31)
- c3242b818 - docs: exclude synthetic.new from link checker (intermittent 503) (Alex Gold, 2026-08-31)
- d4cc74c05 - docs: remove dangling warning reference in local-usage guidance (Alex Gold, 2026-08-31)
- e48ad6308 - docs: refine model routing/config section and local-usage guidance (Alex Gold, 2026-08-31)
- 992427c7f - Merge pull request #13633 from Kilo-Org/snappy-urchin (Kirill Kalishev, 2026-08-31)
- 7b47b034a - fix(jetbrains): match the diff empty-state centering assertion to Centerizer's rounding (kirillk, 2026-08-31)
- 6d7939f99 - fix(jetbrains): release a popup body that could not be placed (kirillk, 2026-08-31)
- f14bc5e30 - fix(jetbrains): stop remeasuring worktree rows on every poll (kirillk, 2026-08-31)
- 2eac9d51b - fix(jetbrains): keep a PR visible when gh refuses review fields (kirillk, 2026-08-31)
- 18e560467 - fix(jetbrains): keep the migration wizard selectable when skip or later fails (kirillk, 2026-08-31)
- aebd040a8 - feat(jetbrains): show PR detail on worktree row hover (kirillk, 2026-08-31)
- 29cfaba99 - fix(jetbrains): keep onboarding recoverable on failed later and dismissal (kirillk, 2026-08-31)
- c004d78fa - Merge pull request #13586 from Kilo-Org/mellow-grove (Kirill Kalishev, 2026-08-31)
- 66b390179 - Merge branch 'main' into update-jetbrains-plugin-description (Kirill Kalishev, 2026-08-31)
- 7e5ddc0ae - feat(jetbrains): show PR review and CI status on worktree rows (kirillk, 2026-08-31)
- 9f3f477f0 - refactor(jetbrains): use the shared active list for the onboarding step rail (kirillk, 2026-08-31)
- d93c48139 - docs(jetbrains): use concise marketplace description (kirillk, 2026-08-31)
- 2736ab68c - docs(jetbrains): rewrite plugin marketplace description (kirillk, 2026-08-31)
- 7fcbaccc3 - fix(jetbrains): re-offer v5 migration onboarding on forced rerun (kirillk, 2026-08-31)
- a4f824224 - fix(jetbrains): polish list rename and delete popups (kirillk, 2026-08-31)
- 5a3d3de51 - Merge branch 'main' into docs/small-model-routing-config (Alex Gold, 2026-08-31)
- c9a01dcd3 - test(jetbrains): wait for dropped run state after async termination (kirillk, 2026-08-31)
- 42a1f98f8 - docs: clarify Mistral BYOK is not offline, disable autocomplete for true offline (kiloconnect[bot], 2026-08-31)
- c35dc1cc1 - test(jetbrains): wait for both update cycles in the session hook test (kirillk, 2026-08-31)
- a67b3b9be - fix(jetbrains): center the diff editor empty state (kirillk, 2026-08-31)
- cfbe25e2e - feat(jetbrains): add copy actions to worktree row menu (kirillk, 2026-08-31)
- 462f4a1f9 - fix(jetbrains): shorten onboarding bullets, reorder setup buttons (kirillk, 2026-08-31)
- 67a826415 - Merge pull request #13294 from Kilo-Org/feat/claude-code-session-import-endpoint (Kirill Kalishev, 2026-08-31)
- 663002d1a - Merge remote-tracking branch 'origin/main' into enable-terminal-agent-manager-by-default (marius-kilocode, 2026-08-31)
- 5ea583174 - Merge pull request #13627 from Kilo-Org/dedupe-vscode-diff-scope (Marius, 2026-08-31)
- 24ed324aa - Merge pull request #13625 from Kilo-Org/dedupe-vscode-marketplace-types (Marius, 2026-08-31)
- 139ee0374 - Merge pull request #13626 from Kilo-Org/dedupe-vscode-prompt-dropdown-css (Marius, 2026-08-31)
- 242bb18a8 - fix(vscode): default Agent Manager terminals to the side panel (marius-kilocode, 2026-08-31)
- 23007e17b - fix(jetbrains): keep PR lookups to one at a time (kirillk, 2026-08-31)
- af2c45aa2 - fix(jetbrains): make gh/PR focus sync responsive without overwhelming the backend (kirillk, 2026-08-31)
- daeaa0d21 - docs: document Kilo model routing/config and correct Gas Town small model docs (Alex Gold, 2026-08-31)
- 15e87b437 - Merge branch 'main' into mellow-grove (Kirill Kalishev, 2026-08-31)
- fc4718f61 - Merge remote-tracking branch 'origin/main' into persist-subagent-sidebar-context-across-worktrees (marius-kilocode, 2026-08-31)
- 2f0ed8df5 - refactor(vscode): reuse Agent Manager diff scope helpers (marius-kilocode, 2026-08-31)
- c420a4606 - refactor(vscode): share marketplace type contracts (marius-kilocode, 2026-08-31)
- d67f78f5b - refactor(vscode): share prompt dropdown container styles (marius-kilocode, 2026-08-31)
- 8fdc1bd7a - refactor(agent-manager): trim panel ownership changes (marius-kilocode, 2026-08-31)
- 8dcedb342 - Merge pull request #13622 from Kilo-Org/jetbrains/release/v7.1.2 (Kirill Kalishev, 2026-08-31)
- 38513c37e - docs(jetbrains): edit changelog for v7.1.2 (Kirill Kalishev, 2026-08-31)
- 077a481b9 - fix(jetbrains): preserve custom provider headers when clearing env var (kirillk, 2026-08-31)
- 436ff09e6 - release(jetbrains): v7.1.2 (kilo-maintainer[bot], 2026-08-31)
- a29fc822e - Merge pull request #13558 from Kilo-Org/add-kilo-code-duplication-lint (Marius, 2026-08-31)
- 207c37e54 - Merge pull request #13605 from Kilo-Org/investigate-code-keychain-storage-error (Marius, 2026-08-31)
- a28e5cb33 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-31)
- 49af57515 - test(vscode): set origin for Roo migration fixture (marius-kilocode, 2026-08-31)
- 18fd9ab37 - fix(i18n): clean up retired migration translations (marius-kilocode, 2026-08-31)
- 25d9448d6 - fix(vscode): remove unsupported legacy migration (marius-kilocode, 2026-08-31)
- f11e3a821 - Merge pull request #13614 from Kilo-Org/jetbrains/release/v7.1.2-rc.1 (Kirill Kalishev, 2026-08-31)
- b5ee423c7 - fix(agent-manager): preserve side panels across context switches (marius-kilocode, 2026-08-31)
- 694d34712 - docs(jetbrains): edit changelog for v7.1.2-rc.1 (Kirill Kalishev, 2026-08-31)
- 122aec00a - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-31)
- 2e1a70493 - fix(cli): look up migration markers without the recent-session page limit (kirillk, 2026-08-31)
- 9d46249b3 - release(jetbrains): v7.1.2-rc.1 (kilo-maintainer[bot], 2026-08-31)
- aeca097dc - Merge pull request #13501 from Kilo-Org/agent-browser-context-view (Marius, 2026-08-31)
- df24ce68e - Merge pull request #13608 from Kilo-Org/fix-13596-agent-manager-tasks (Marius, 2026-08-31)
- 2abc08505 - Merge pull request #13606 from Kilo-Org/fix-subagent-model-reasoning-defaults (Marius, 2026-08-31)
- 02df76976 - fix(agent-manager): decode JSON-encoded task arrays (marius-kilocode, 2026-08-31)
- 71e21a30e - fix(agent-manager): clarify browser diagnostics and restore DevTools (marius-kilocode, 2026-08-31)
- fdb987667 - chore: merge main before review handoff (marius-kilocode, 2026-08-31)
- 3a923e096 - chore: exclude JetBrains from duplication checks (marius-kilocode, 2026-08-31)
- 95404e99f - fix(cli): preserve default subagent model and reasoning (marius-kilocode, 2026-08-31)
- 50d0397d4 - chore: merge main into browser worktree (marius-kilocode, 2026-08-31)
- 10223fe92 - chore: merge main into duplication cleanup (marius-kilocode, 2026-08-31)
- 6cc21af6d - feat(cli): make session migration server-side and idempotent (kirillk, 2026-08-30)
- 91dfcb6e7 - fix(jetbrains): render onboarding steps as a bullet list, brand the dialog (kirillk, 2026-08-30)
- 8d05e8a0d - refactor(cli): move session transcript import to a migrate API group (kirillk, 2026-08-30)
- 1099d3129 - fix(jetbrains): pre-check migration rows and enable Run in setup dialog (kirillk, 2026-08-30)
- 4af0f19a1 - refactor(jetbrains): move v5 migration under onboarding/providers/v5migration (kirillk, 2026-08-30)
- 6ab9c56f1 - Merge origin/mellow-grove (main sync) into mellow-grove (kirillk, 2026-08-30)
- df4ac54d6 - i18n(jetbrains): translate new provider settings keys (kirillk, 2026-08-30)
- c67aa0954 - Merge branch 'main' into mellow-grove (Kirill Kalishev, 2026-08-30)
- 61b705a6c - Merge remote-tracking branch 'origin/main' into feat/claude-code-session-import-endpoint (kirillk, 2026-08-30)
- 421674405 - feat(jetbrains): add pluggable onboarding framework, port v5 migration (kirillk, 2026-08-30)
- bc07f1e66 - fix(jetbrains): only delete-recreate provider entry when clearing env (kirillk, 2026-08-30)
- a4956d3f7 - fix(jetbrains): clear provider env var without violating config schema (kirillk, 2026-08-30)
- ad5cf21c0 - fix(jetbrains): resolve api key env var when selecting custom provider models (kirillk, 2026-08-30)
- 0bfc47958 - fix(cli): reject unknown session and agent in session-resume import (kirillk, 2026-08-30)
- e618faedd - chore: merge main into browser worktree (marius-kilocode, 2026-08-28)
- c8f451873 - chore: merge main into duplication cleanup (marius-kilocode, 2026-08-28)
- a91bf44ac - refactor: ratchet and reduce Kilo-owned duplication (marius-kilocode, 2026-08-28)
- 5a1d8f3d7 - fix(vscode): retain browser draft types after main merge (marius-kilocode, 2026-08-28)
- 978ec1a9f - fix(vscode): align browser errors with shared error cards (marius-kilocode, 2026-08-28)
- f980b0169 - chore: merge main and preserve browser feedback contracts (marius-kilocode, 2026-08-28)
- 52552cb9f - fix(vscode): preserve browser previews and inspection retries (marius-kilocode, 2026-08-28)
- dd5e91f68 - chore: merge main and preserve browser integration (marius-kilocode, 2026-08-28)
- 41e71fe1b - fix: simplify browser previews and local URL handling (marius-kilocode, 2026-08-28)
- c1927d280 - chore(sdk): sync generated snapshot cleanup parameters (marius-kilocode, 2026-08-27)
- 72fa301b5 - chore: merge main and preserve browser lifecycle guards (marius-kilocode, 2026-08-27)
- bcd0fa133 - fix(vscode): isolate browser UI and secure message handling (marius-kilocode, 2026-08-27)
- e2bb864a5 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-27)
- 17647b9ec - chore: merge latest main into browser feedback feature (marius-kilocode, 2026-08-27)
- 71fe99d99 - feat(agent-manager): refine browser controls and render element feedback (marius-kilocode, 2026-08-27)
- c7f59f11e - chore: merge main into browser context feature (marius-kilocode, 2026-08-27)
- 9231c2554 - feat(agent-manager): add local browser previews and developer tools (marius-kilocode, 2026-08-27)
- 19ceae0bc - feat(cli): discover importable Claude Code / Codex sessions via session-resume endpoint (kirillk, 2026-08-20)
- b59ebd7bb - feat(cli): import Claude Code and Codex transcripts via a session-resume endpoint (kirillk, 2026-08-20)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+11, -1)
- `packages/opencode/src/kilocode/tool/browser-open.ts` (+164, -0)
- `packages/opencode/src/kilocode/tool/browser-open.txt` (+12, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+33, -3)
- `packages/opencode/src/kilocode/tool/task.ts` (+41, -11)
- `packages/opencode/src/tool/task.ts` (+14, -9)
- `packages/opencode/test/kilocode/tool/send-file.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/tool/shell-env.test.ts` (+10, -2)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+27, -6)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+8, -30)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/kilocode/session-message.ts` (+12, -18)
- `packages/core/test/kilocode/event-storage-compat.test.ts` (+31, -1)

#### Other Changes
- `.changeset/agent-manager-browser-context.md` (+6, -0)
- `.changeset/agent-manager-json-tasks.md` (+5, -0)
- `.changeset/agent-manager-terminal-default.md` (+5, -0)
- `.changeset/claude-code-session-import-endpoint.md` (+5, -0)
- `.changeset/fix-background-agents-chevron.md` (+5, -0)
- `.changeset/fix-browser-runtime-packaging.md` (+5, -0)
- `.changeset/fix-subagent-selection-defaults.md` (+5, -0)
- `.changeset/improve-background-agent-control.md` (+7, -0)
- `.changeset/jetbrains-custom-provider-env-var-models.md` (+5, -0)
- `.changeset/jetbrains-diff-empty-state-centered.md` (+5, -0)
- `.changeset/jetbrains-force-migration-rerun.md` (+5, -0)
- `.changeset/jetbrains-gh-focus-freshness.md` (+5, -0)
- `.changeset/jetbrains-gh-rate-limit.md` (+5, -0)
- `.changeset/jetbrains-onboarding-framework.md` (+5, -0)
- `.changeset/jetbrains-rename-popup-polish.md` (+5, -0)
- `.changeset/jetbrains-worktree-copy-actions.md` (+5, -0)
- `.changeset/jetbrains-worktree-popup-dwell.md` (+5, -0)
- `.changeset/jetbrains-worktree-review-checks.md` (+5, -0)
- `.changeset/jetbrains-worktree-row-popup.md` (+5, -0)
- `.changeset/keep-inspector-open-on-state-refresh.md` (+5, -0)
- `.changeset/mobile-instance-metadata.md` (+5, -0)
- `.changeset/remember-subagent-panel.md` (+5, -0)
- `.changeset/roo-import-only.md` (+5, -0)
- `.github/workflows/check-opencode-annotations.yml` (+14, -0)
- `AGENTS.md` (+1, -0)
- `bun.lock` (+23, -9)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -0)
- `packages/kilo-console/src/routes/config/state/mcp.ts` (+0, -10)
- `packages/kilo-docs/lychee.toml` (+3, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+28, -0)
- `packages/kilo-docs/pages/code-with-ai/gastown/settings.md` (+3, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-browser-feedback-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/migration/roo-wizard-selecting-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+0, -4)
- `packages/kilo-gateway/package.json` (+3, -1)
- `packages/kilo-gateway/src/auth/device-auth-tui.ts` (+3, -55)
- `packages/kilo-gateway/src/auth/device-auth.ts` (+2, -57)
- `packages/kilo-gateway/src/auth/device.ts` (+44, -0)
- `packages/kilo-gateway/src/claw/index.ts` (+39, -0)
- `packages/kilo-gateway/src/claw/kilo-chat-client.ts` (+232, -0)
- `packages/kilo-gateway/src/claw/types.ts` (+182, -0)
- `packages/kilo-gateway/src/event-service/client.ts` (+361, -0)
- `packages/kilo-gateway/test/auth/device.test.ts` (+35, -0)
- `packages/kilo-indexing/src/indexing/embedders/bedrock.ts` (+9, -43)
- `packages/kilo-indexing/src/indexing/embedders/openai-compatible.ts` (+29, -163)
- `packages/kilo-indexing/src/indexing/embedders/openai.ts` (+11, -61)
- `packages/kilo-indexing/src/indexing/embedders/openrouter.ts` (+29, -171)
- `packages/kilo-indexing/src/indexing/embedders/voyage.ts` (+11, -61)
- `packages/kilo-indexing/src/indexing/shared/embedder-helpers.ts` (+89, -0)
- `packages/kilo-indexing/src/indexing/shared/openai-compatible-helpers.ts` (+80, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+61, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/provider/KiloBackendProviderSettingsManager.kt` (+32, -8)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+117, -16)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/PrResolver.kt` (+94, -13)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/provider/KiloBackendProviderSettingsManagerTest.kt` (+282, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+147, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/PrResolverTest.kt` (+166, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/run/WorktreeRunManagerTest.kt` (+3, -2)
- `packages/kilo-jetbrains/build.gradle.kts` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+9, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/CopyBranchNameAction.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/CopyBranchPathAction.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/CopyWorktreePrRefAction.kt` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ForceMigrationAction.kt` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+180, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/Away.kt` (+71, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhAuth.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhBanner.kt` (+7, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinator.kt` (+137, -15)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/KiloWorktreeService.kt` (+6, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeIcons.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRowPopupBody.kt` (+76, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManager.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusService.kt` (+55, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeTitle.kt` (+0, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/KiloDiffEditorContent.kt` (+4, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/migration/ui/MigrationWizardPanel.kt` (+0, -233)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/onboarding/KiloOnboardingService.kt` (+172, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/onboarding/OnboardingProvider.kt` (+92, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/onboarding/OnboardingStep.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/{migration => onboarding/providers/v5migration}/KiloMigrationService.kt` (+27, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/onboarding/providers/v5migration/MigrationOnboardingProvider.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/{migration => onboarding/providers/v5migration}/MigrationSelectionBuilder.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/{migration => onboarding/providers/v5migration}/MigrationUiState.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/{migration => onboarding/providers/v5migration}/ui/MigrationItemRow.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/{migration => onboarding/providers/v5migration}/ui/MigrationStatusIcon.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/onboarding/providers/v5migration/ui/MigrationStepView.kt` (+218, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/onboarding/ui/OnboardingDialog.kt` (+308, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/onboarding/ui/OnboardingListCard.kt` (+68, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+35, -35)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/PrHeaderView.kt` (+86, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopup.kt` (+30, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupController.kt` (+28, -136)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupGeometry.kt` (+0, -111)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUi.kt` (+28, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/ChangesPanel.kt` (+7, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/PrBadges.kt` (+69, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/PrIcons.kt` (+45, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveList.kt` (+27, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListEditPopup.kt` (+7, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListModel.kt` (+14, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListRenderer.kt` (+17, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+62, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/popup/SidePopup.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/popup/SidePopupController.kt` (+195, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/popup/SidePopupGeometry.kt` (+110, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-checks-failed.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-checks-failed_dark.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-checks-passed.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-checks-passed_dark.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-checks-running.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-checks-running_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-review-approved.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-review-approved_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-review-changes.svg` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/pr-review-changes_dark.svg` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+19, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+42, -9)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+2, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/ForceMigrationActionTest.kt` (+110, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+15, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SessionContextMenuActionsTest.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerPanelTest.kt` (+145, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeIconsTest.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/AwayTest.kt` (+60, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhBannerTest.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinatorTest.kt` (+194, -12)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRowPopupBodyTest.kt` (+232, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManagerTest.kt` (+5, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanelTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusServiceTest.kt` (+178, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/diff/KiloDiffEditorContentTest.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/migration/SessionUiMigrationTest.kt` (+0, -283)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/onboarding/FakeOnboardingController.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/onboarding/FakeOnboardingProvider.kt` (+38, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/onboarding/FakeOnboardingStepView.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/onboarding/KiloOnboardingServiceTest.kt` (+200, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/onboarding/SessionUiOnboardingTest.kt` (+111, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/{migration => onboarding/providers/v5migration}/FakeMigrationUiController.kt` (+6, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/{migration => onboarding/providers/v5migration}/KiloMigrationServiceTest.kt` (+30, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/onboarding/providers/v5migration/MigrationOnboardingProviderTest.kt` (+63, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/onboarding/providers/v5migration/ui/MigrationStepViewTest.kt` (+293, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/onboarding/ui/OnboardingDialogTest.kt` (+279, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/onboarding/ui/OnboardingListCardTest.kt` (+128, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiTestBase.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionUpdateQueueTest.kt` (+7, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/PrHeaderViewTest.kt` (+91, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupBodyTest.kt` (+41, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupControllerTest.kt` (+10, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+5, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUiTest.kt` (+197, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeProviderRpcApi.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorktreeRpcApi.kt` (+9, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/TestIdeActivation.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/ChangesPanelTest.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/PrBadgesTest.kt` (+72, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/PrIconsTest.kt` (+144, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListAnchorTest.kt` (+55, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListBadgeCellTest.kt` (+77, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListEditPopupTest.kt` (+41, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListHoverTest.kt` (+122, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListRowHeightTest.kt` (+82, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/popup/SidePopupControllerTest.kt` (+219, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/{session/ui/popup/HeaderPopupGeometryTest.kt => ui/popup/SidePopupGeometryTest.kt}` (+34, -34)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/script/build-version.sh` (+6, -3)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorktreeRpcApi.kt` (+20, -5)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ProviderSettingsDto.kt` (+4, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorktreeDto.kt` (+42, -1)
- `packages/kilo-jetbrains/src/main/resources/META-INF/plugin.xml` (+14, -4)
- `packages/kilo-ui/src/components/code.tsx` (+19, -57)
- `packages/kilo-ui/src/components/diff-ssr.tsx` (+5, -147)
- `packages/kilo-ui/src/components/diff.tsx` (+16, -156)
- `packages/kilo-ui/src/components/message-part.tsx` (+1, -1)
- `packages/kilo-ui/src/components/prompt-input.css` (+56, -54)
- `packages/kilo-ui/src/pierre/diff-dom.ts` (+93, -0)
- `packages/kilo-ui/src/pierre/selection-range.ts` (+28, -0)
- `packages/kilo-ui/src/pierre/selection.ts` (+62, -0)
- `packages/kilo-vscode/esbuild.js` (+16, -1)
- `packages/kilo-vscode/package.json` (+12, -17)
- `packages/kilo-vscode/script/playwright-runtime.js` (+35, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+70, -85)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+44, -39)
- `packages/kilo-vscode/src/agent-manager/ScriptTerminalManager.ts` (+2, -11)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+3, -14)
- `packages/kilo-vscode/src/agent-manager/browser-lifecycle.ts` (+67, -0)
- `packages/kilo-vscode/src/agent-manager/browser-message.ts` (+201, -0)
- `packages/kilo-vscode/src/agent-manager/constants.ts` (+10, -14)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/project/state-gate.ts` (+7, -0)
- `packages/kilo-vscode/src/agent-manager/project/wiring.ts` (+5, -1)
- `packages/kilo-vscode/src/agent-manager/pty-cleanup.ts` (+13, -0)
- `packages/kilo-vscode/src/agent-manager/session-lifecycle.ts` (+57, -0)
- `packages/kilo-vscode/src/agent-manager/terminal-destination.ts` (+4, -4)
- `packages/kilo-vscode/src/agent-manager/terminal-manager.ts` (+2, -11)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+69, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+8, -0)
- `packages/kilo-vscode/src/extension.ts` (+19, -16)
- `packages/kilo-vscode/src/kilo-provider/abort.ts` (+12, -3)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+5, -2)
- `packages/kilo-vscode/src/kilo-provider/handlers/migration.ts` (+11, -185)
- `packages/kilo-vscode/src/kilo-provider/handlers/not-found.ts` (+12, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/permission-handler.ts` (+1, -13)
- `packages/kilo-vscode/src/kilo-provider/handlers/question.ts` (+3, -15)
- `packages/kilo-vscode/src/kiloclaw/event-service-client.ts` (+12, -380)
- `packages/kilo-vscode/src/kiloclaw/kilo-chat-client.ts` (+5, -264)
- `packages/kilo-vscode/src/kiloclaw/types.ts` (+48, -242)
- `packages/kilo-vscode/src/legacy-migration/legacy-types.ts` (+0, -337)
- `packages/kilo-vscode/src/legacy-migration/migration-service.ts` (+0, -1273)
- `packages/kilo-vscode/src/legacy-migration/migration-session-progress.ts` (+1, -1)
- `packages/kilo-vscode/src/legacy-migration/migration-types.ts` (+1, -1)
- `packages/kilo-vscode/src/legacy-migration/native-mode-defaults.ts` (+0, -91)
- `packages/kilo-vscode/src/legacy-migration/provider-mapping.ts` (+0, -308)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteServiceManager.ts` (+3, -11)
- `packages/kilo-vscode/src/services/autocomplete/chat-autocomplete/ChatTextAreaAutocomplete.ts` (+2, -7)
- `packages/kilo-vscode/src/services/autocomplete/fim.ts` (+7, -1)
- `packages/kilo-vscode/src/services/browser-automation/browser-automation-service.ts` (+0, -166)
- `packages/kilo-vscode/src/services/browser-automation/browser-broker.ts` (+781, -0)
- `packages/kilo-vscode/src/services/browser-automation/browser-devtools.ts` (+259, -0)
- `packages/kilo-vscode/src/services/browser-automation/browser-element.ts` (+208, -0)
- `packages/kilo-vscode/src/services/browser-automation/browser-runtime.ts` (+25, -0)
- `packages/kilo-vscode/src/services/browser-automation/index.ts` (+9, -1)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+2, -24)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+3, -0)
- `packages/kilo-vscode/src/shared/browser-feedback.ts` (+326, -0)
- `packages/kilo-vscode/src/shared/review-comments.ts` (+1, -5)
- `packages/kilo-vscode/src/utils.ts` (+4, -2)
- `packages/kilo-vscode/src/webview-html-utils.ts` (+2, -1)
- `packages/kilo-vscode/tests/fixtures/browser-panel-render.tsx` (+180, -0)
- `packages/kilo-vscode/tests/fixtures/pr-comments-render.tsx` (+1, -0)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+6, -5)
- `packages/kilo-vscode/tests/prompt-background-agents.spec.ts` (+65, -0)
- `packages/kilo-vscode/tests/unit/abort.test.ts` (+21, -18)
- `packages/kilo-vscode/tests/unit/agent-manager-ambient-setup.test.ts` (+28, -2)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+31, -9)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-scope-state.test.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-i18n.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-tab-bar.test.ts` (+51, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-destination.test.ts` (+17, -10)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-side.test.ts` (+23, -9)
- `packages/kilo-vscode/tests/unit/browser-broker.test.ts` (+849, -0)
- `packages/kilo-vscode/tests/unit/browser-controller.test.ts` (+250, -0)
- `packages/kilo-vscode/tests/unit/browser-element.test.ts` (+155, -0)
- `packages/kilo-vscode/tests/unit/browser-feedback.test.ts` (+114, -0)
- `packages/kilo-vscode/tests/unit/browser-message.test.ts` (+152, -0)
- `packages/kilo-vscode/tests/unit/browser-panel-render.test.ts` (+48, -0)
- `packages/kilo-vscode/tests/unit/browser-runtime.test.ts` (+46, -0)
- `packages/kilo-vscode/tests/unit/context-requests.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/draft-store.test.ts` (+5, -1)
- `packages/kilo-vscode/tests/unit/edit-preview.test.ts` (+28, -1)
- `packages/kilo-vscode/tests/unit/esbuild-dependencies.test.ts` (+66, -0)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+0, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+6, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+31, -4)
- `packages/kilo-vscode/tests/unit/kilo-provider-route-integration.test.ts` (+0, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-session-refresh.test.ts` (+38, -1)
- `packages/kilo-vscode/tests/unit/legacy-migration/migration-cache.test.ts` (+34, -39)
- `packages/kilo-vscode/tests/unit/legacy-migration/native-modes.test.ts` (+0, -322)
- `packages/kilo-vscode/tests/unit/path-mentions.test.ts` (+7, -1)
- `packages/kilo-vscode/tests/unit/permission-recovery.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/project-state-handlers.test.ts` (+175, -0)
- `packages/kilo-vscode/tests/unit/prompt-continue.test.ts` (+26, -0)
- `packages/kilo-vscode/tests/unit/prompt-drafts.test.ts` (+61, -1)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+15, -6)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+44, -2)
- `packages/kilo-vscode/tests/unit/question-handler.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/roo-migration-ui.fixture.tsx` (+261, -0)
- `packages/kilo-vscode/tests/unit/roo-migration-ui.test.ts` (+63, -0)
- `packages/kilo-vscode/tests/unit/session-lifecycle.test.ts` (+63, -0)
- `packages/kilo-vscode/tests/unit/session-utils.test.ts` (+34, -1)
- `packages/kilo-vscode/tests/unit/side-panel-state.test.ts` (+69, -0)
- `packages/kilo-vscode/tests/unit/webview-html.test.ts` (+11, -0)
- `packages/kilo-vscode/tests/unit/webview-message-trust.test.ts` (+61, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+117, -116)
- `packages/kilo-vscode/webview-ui/agent-manager/BrowserPanel.tsx` (+173, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+67, -566)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+6, -12)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+2, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+2, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/TabBar.tsx` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager-review.css` (+2, -434)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+34, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-scope-state.ts` (+8, -24)
- `packages/kilo-vscode/webview-ui/agent-manager/edit-preview.ts` (+32, -55)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/initial-message.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/project/progress.ts` (+51, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/project/state-handlers.ts` (+13, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/project/switch.ts` (+0, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/side-panel-layout.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/side-panel-state.ts` (+61, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/ambient.ts` (+4, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/side.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/browser/BrowserPanel.tsx` (+295, -0)
- `packages/kilo-vscode/webview-ui/browser/browser.css` (+249, -0)
- `packages/kilo-vscode/webview-ui/browser/controller.ts` (+291, -0)
- `packages/kilo-vscode/webview-ui/browser/index.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/browser/types.ts` (+91, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+65, -508)
- `packages/kilo-vscode/webview-ui/diff-viewer/ReviewDiffItem.tsx` (+250, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-requests.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-annotations.ts` (+11, -13)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-controller.ts` (+279, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-scroll.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-setup.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-state.ts` (+40, -0)
- `packages/kilo-vscode/webview-ui/documents/DocumentPanel.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/kiloclaw/lib/types.ts` (+16, -160)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+5, -23)
- `packages/kilo-vscode/webview-ui/src/components/chat/BackgroundAgents.tsx` (+14, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/BrowserReferences.tsx` (+121, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+1, -15)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+164, -93)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeUserMessage.tsx` (+18, -8)
- `packages/kilo-vscode/webview-ui/src/components/migration/MigrationWizard.tsx` (+116, -741)
- `packages/kilo-vscode/webview-ui/src/components/migration/index.ts` (+0, -4)
- `packages/kilo-vscode/webview-ui/src/components/migration/migration.css` (+0, -104)
- `packages/kilo-vscode/webview-ui/src/components/settings/AboutKiloCodeTab.tsx` (+7, -19)
- `packages/kilo-vscode/webview-ui/src/components/settings/BrowserTab.tsx` (+1, -19)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ActivityIcon.tsx` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/server.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-continuation.ts` (+15, -4)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+52, -2)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+14, -34)
- `packages/kilo-vscode/webview-ui/src/context/vscode.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/context-requests.ts` (+49, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useGitChangesContext.ts` (+11, -46)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/hooks/useTerminalContext.ts` (+12, -46)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+3, -45)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+3, -45)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+3, -45)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+3, -46)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+3, -47)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+8, -52)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+3, -46)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+3, -45)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+3, -46)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+3, -39)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+3, -45)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+3, -45)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+3, -46)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+3, -45)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+3, -45)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+3, -45)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+3, -45)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+3, -46)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+3, -46)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -44)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+3, -44)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+57, -0)
- `packages/kilo-vscode/webview-ui/src/stories/migration.stories.tsx` (+17, -23)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-dropdowns.css` (+2, -15)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+0, -60)
- `packages/kilo-vscode/webview-ui/src/types/marketplace.ts` (+15, -76)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+60, -4)
- `packages/kilo-vscode/webview-ui/src/types/messages/migration.ts` (+2, -86)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+28, -12)
- `packages/kilo-vscode/webview-ui/src/utils/draft-store.ts` (+7, -3)
- `packages/kilo-vscode/webview-ui/src/utils/path-mentions.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/utils/prompt-drafts.ts` (+26, -3)
- `packages/kilo-vscode/webview-ui/src/utils/webview-message.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/tsconfig.json` (+1, -1)
- `packages/opencode/src/cli/cmd/remote.ts` (+1, -1)
- `packages/opencode/src/effect/runner.ts` (+3, -2)
- `packages/opencode/src/kilo-sessions/instance-advertisement.ts` (+12, -3)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+5, -1)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+6, -0)
- `packages/opencode/src/kilocode/claw/kilo-chat-client.ts` (+4, -259)
- `packages/opencode/src/kilocode/claw/types.ts` (+35, -207)
- `packages/opencode/src/kilocode/config/variable.ts` (+6, -1)
- `packages/opencode/src/kilocode/event-service/client.ts` (+1, -382)
- `packages/opencode/src/kilocode/process/env.ts` (+2, -0)
- `packages/opencode/src/kilocode/sandbox/network.ts` (+71, -5)
- `packages/opencode/src/kilocode/sandbox/policy.ts` (+9, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/migrate.ts` (+158, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/config-console.ts` (+1, -30)
- `packages/opencode/src/kilocode/server/httpapi/handlers/migrate.ts` (+49, -0)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/kilocode/session-import/service.ts` (+22, -38)
- `packages/opencode/src/kilocode/session-resume/import.ts` (+632, -0)
- `packages/opencode/src/kilocode/session-resume/index.ts` (+48, -0)
- `packages/opencode/src/kilocode/session/continuation.ts` (+12, -1)
- `packages/opencode/src/kilocode/session/control.ts` (+68, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+21, -13)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+12, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+8, -2)
- `packages/opencode/src/session/prompt.ts` (+84, -84)
- `packages/opencode/src/session/run-state.ts` (+11, -4)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+56, -5)
- `packages/opencode/test/kilocode/chart-tool-gating.test.ts` (+7, -0)
- `packages/opencode/test/kilocode/cli/cmd/remote.test.ts` (+19, -6)
- `packages/opencode/test/kilocode/config/variable.test.ts` (+12, -0)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+135, -20)
- `packages/opencode/test/kilocode/sandbox/http-tools.test.ts` (+206, -2)
- `packages/opencode/test/kilocode/sandbox/policy.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+41, -0)
- `packages/opencode/test/kilocode/session-import-service.test.ts` (+44, -1)
- `packages/opencode/test/kilocode/session-resume-integration.test.ts` (+584, -2)
- `packages/opencode/test/kilocode/session-scoped-abort.test.ts` (+267, -0)
- `packages/opencode/test/kilocode/sessions/remote-protocol.test.ts` (+66, -0)
- `packages/opencode/test/kilocode/sessions/remote-ws.test.ts` (+60, -45)
- `packages/opencode/test/kilocode/tool-registry-indexing-import-failure.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+4, -0)
- `packages/opencode/test/kilocode/tool-registry-semantic-import-failure.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+49, -16)
- `packages/script/tests/check-kilocode-duplication.test.ts` (+298, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+107, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+170, -0)
- `packages/sdk/openapi.json` (+368, -0)
- `script/architecture-allowlist.json` (+2, -1)
- `script/check-kilocode-duplication.ts` (+351, -0)
- `script/check-opencode-promise-facades.ts` (+5, -2)
- `script/kilocode-duplication-allowlist.json` (+282, -0)

### Key Diffs

#### packages/core/src/kilocode/session-message.ts
```diff
diff --git a/packages/core/src/kilocode/session-message.ts b/packages/core/src/kilocode/session-message.ts
index 74f89af19..4f472a7bd 100644
--- a/packages/core/src/kilocode/session-message.ts
+++ b/packages/core/src/kilocode/session-message.ts
@@ -8,12 +8,7 @@ function record(value: unknown): value is Record<string, unknown> {
   return typeof value === "object" && value !== null && !Array.isArray(value)
 }
 
-export function normalize(value: unknown): unknown {
-  if (!record(value)) return value
-  // New readers recover the canonical summary while old readers receive recent context inline.
-  if (value.type === "compaction" && typeof value.kilo_summary === "string") {
-    return { ...value, summary: value.kilo_summary }
-  }
+function transform(value: Record<string, unknown>, convert: (value: unknown) => unknown): Record<string, unknown> {
   if (value.type !== "assistant" || !Array.isArray(value.content)) return value
   return {
     ...value,
@@ -22,11 +17,20 @@ export function normalize(value: unknown): unknown {
       const status = item.state.status
       if (status !== "running" && status !== "completed" && status !== "error") return item
       if (!Array.isArray(item.state.content)) return item
-      return { ...item, state: { ...item.state, content: item.state.content.map((entry) => decode(entry)) } }
+      return { ...item, state: { ...item.state, content: item.state.content.map((entry) => convert(entry)) } }
     }),
   }
 }
 
+export function normalize(value: unknown): unknown {
+  if (!record(value)) return value
+  // New readers recover the canonical summary while old readers receive recent context inline.
+  if (value.type === "compaction" && typeof value.kilo_summary === "string") {
+    return { ...value, summary: value.kilo_summary }
+  }
+  return transform(value, decode)
+}
+
 export function encode(value: unknown): unknown {
   if (!record(value)) return value
   // Preserve current semantics while making released compaction rows self-contained.
@@ -37,15 +41,5 @@ export function encode(value: unknown): unknown {
       kilo_summary: value.summary,
     }
   }
-  if (value.type !== "assistant" || !Array.isArray(value.content)) return value
-  return {
-    ...value,
-    content: value.content.map((item) => {
-      if (!record(item) || item.type !== "tool" || !record(item.state)) return item
-      const status = item.state.status
```

#### packages/core/test/kilocode/event-storage-compat.test.ts
```diff
diff --git a/packages/core/test/kilocode/event-storage-compat.test.ts b/packages/core/test/kilocode/event-storage-compat.test.ts
index 27746ec9e..1cf039335 100644
--- a/packages/core/test/kilocode/event-storage-compat.test.ts
+++ b/packages/core/test/kilocode/event-storage-compat.test.ts
@@ -1,5 +1,5 @@
 import { expect } from "bun:test"
-import { DateTime, Effect, Layer, Schema, Stream } from "effect"
+import { DateTime, Effect, Schema, Stream } from "effect"
 import { eq } from "drizzle-orm"
 import { Database } from "@opencode-ai/core/database/database"
 import { EventV2 } from "@opencode-ai/core/event"
@@ -179,6 +179,36 @@ replay.effect("reads and replays released prompt promotion events", () =>
   }),
 )
 
+it.effect("round-trips assistant tool content across running and settled states", () =>
+  Effect.sync(() => {
+    const text = { type: "text", text: "Tool output" }
+    const legacy = { type: "media", mediaType: "image/png", data: "AAAA", filename: "image.png" }
+    const file = { type: "file", uri: "data:image/png;base64,AAAA", mime: "image/png", name: "image.png" }
+    const stored = { type: "file", source: { type: "data", data: "AAAA" }, mime: "image/png", name: "image.png" }
+    for (const status of ["running", "completed", "error"]) {
+      const input = { type: "assistant", content: [{ type: "tool", state: { status, content: [text, legacy] } }] }
+      const normalized = StoredMessage.normalize(input)
+      expect(normalized).toMatchObject({ content: [{ state: { status, content: [text, file] } }] })
+      const encoded = StoredMessage.encode(normalized)
+      expect(encoded).toMatchObject({ content: [{ state: { status, content: [text, stored] } }] })
+      expect(StoredMessage.normalize(encoded)).toEqual(normalized)
+      expect(input.content.at(0)?.state.content.at(1)).toBe(legacy)
+    }
+  }),
+)
+
+it.effect("leaves non-assistant values and pending tool content unchanged", () =>
+  Effect.sync(() => {
+    for (const input of [null, 1, [], { type: "user", content: [] }, { type: "assistant", content: null }]) {
+      expect(StoredMessage.normalize(input)).toBe(input)
+      expect(StoredMessage.encode(input)).toBe(input)
+    }
+    const pending = { type: "assistant", content: [{ type: "tool", state: { status: "pending", content: [null] } }] }
+    expect(StoredMessage.normalize(pending)).toEqual(pending)
+    expect(StoredMessage.encode(pending)).toEqual(pending)
+  }),
+)
+
 it.effect("stores self-contained compaction projections for released readers", () =>
   Effect.sync(() => {
     const encoded = StoredMessage.encode({
```

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index 0a543c05a..76abed250 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -18,8 +18,7 @@ import PROMPT_ORCHESTRATOR from "../../agent/prompt/orchestrator.txt"
 import PROMPT_ASK from "../../agent/prompt/ask.txt"
 import PROMPT_EXPLORE from "../../agent/prompt/explore.txt"
 
-export const bash: Record<string, "allow" | "ask" | "deny"> = {
-  "*": "ask",
+const readable: Record<string, "allow"> = {
   "cat *": "allow",
   "head *": "allow",
   "tail *": "allow",
@@ -48,6 +47,11 @@ export const bash: Record<string, "allow" | "ask" | "deny"> = {
   "cut *": "allow",
   "tr *": "allow",
   "jq *": "allow",
+}
+
+export const bash: Record<string, "allow" | "ask" | "deny"> = {
+  "*": "ask",
+  ...readable,
   "touch *": "allow",
   "mkdir *": "allow",
   "cp *": "allow",
@@ -62,34 +66,7 @@ export const bash: Record<string, "allow" | "ask" | "deny"> = {
 
 export const readOnlyBash: Record<string, "allow" | "ask" | "deny"> = {
   "*": "deny",
-  "cat *": "allow",
-  "head *": "allow",
-  "tail *": "allow",
-  "less *": "allow",
-  "ls *": "allow",
-  "tree *": "allow",
-  "pwd *": "allow",
-  "echo *": "allow",
-  "wc *": "allow",
-  "which *": "allow",
-  "type *": "allow",
-  "file *": "allow",
-  "diff *": "allow",
-  "du *": "allow",
-  "df *": "allow",
-  "date *": "allow",
-  "uname *": "allow",
-  "whoami *": "allow",
-  "printenv *": "allow",
-  "man *": "allow",
```

#### packages/opencode/src/kilocode/tool/agent-manager.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.ts b/packages/opencode/src/kilocode/tool/agent-manager.ts
index a74c1ca20..a5fef9b17 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.ts
+++ b/packages/opencode/src/kilocode/tool/agent-manager.ts
@@ -128,7 +128,17 @@ const AnswerParams = Schema.Struct({
     }),
 })
 
-export const Params = Schema.Union([StartParams, ListParams, PromptParams, StopParams, MoveParams, AnswerParams])
+export const Params = Schema.Union([
+  Schema.Struct({
+    ...StartParams.fields,
+    tasks: Schema.Union([StartParams.fields.tasks, Schema.fromJsonString(StartParams.fields.tasks)]),
+  }),
+  ListParams,
+  PromptParams,
+  StopParams,
+  MoveParams,
+  AnswerParams,
+])
 
 // Anthropic rejects a top-level anyOf/oneOf/allOf, so the advertised schema has to
 // stay one flat object while Params keeps the real per-operation validation. That
```

#### packages/opencode/src/kilocode/tool/browser-open.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/browser-open.ts b/packages/opencode/src/kilocode/tool/browser-open.ts
new file mode 100644
index 000000000..ad5addfdb
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/browser-open.ts
@@ -0,0 +1,164 @@
+import { HttpClient } from "effect/unstable/http"
+import { Effect, Schema } from "effect"
+import { Env } from "@/env"
+import { InstanceState } from "@/effect/instance-state"
+import * as Network from "@/kilocode/sandbox/network"
+import { Tool } from "@/tool/tool"
+import DESCRIPTION from "./browser-open.txt"
+
+const Parameters = Schema.Struct({
+  url: Schema.String.annotate({
+    description: "HTTP loopback URL for the local application, for example http://localhost:3000.",
+  }),
+})
+
+const State = Schema.Struct({
+  browserId: Schema.String,
+  sessionId: Schema.String,
+  status: Schema.Literals(["starting", "ready", "loading", "error", "closed"]),
+  url: Schema.optional(Schema.String),
+  title: Schema.optional(Schema.String),
+  screenshot: Schema.optional(Schema.String.check(Schema.isMaxLength(3 * 1024 * 1024))),
+  mime: Schema.optional(Schema.Literal("image/jpeg")),
+  errors: Schema.Number,
+  logs: Schema.optional(Schema.Array(Schema.String.check(Schema.isMaxLength(1000)))),
+  error: Schema.optional(Schema.String),
+})
+
+type Meta = {
+  browserId?: string
+  status: Schema.Schema.Type<typeof State>["status"]
+  url?: string
+  title?: string
+  errors: number
+}
+
+export const BrowserOpenTool = Tool.define<
+  typeof Parameters,
+  Meta,
+  HttpClient.HttpClient | Env.Service,
+  "browser_open"
+>(
+  "browser_open",
+  Effect.gen(function* () {
+    const http = yield* HttpClient.HttpClient
```


*... and more files (showing first 5)*

## opencode Changes (9f69463..ebece6e)

### Commits

- ebece6e - docs(web): update Qwen3.7 Max Go usage (#46555) (Jack, 2026-09-01)
- 1ead9e3 - fix(web): number Go usage requirements (Dax Raad, 2026-08-31)
- be3b703 - fix(web): restore documentation list markers (Dax Raad, 2026-08-31)
- f7da00f - fix(opencode): omit empty apply patch move path (#45329) (Kyle Altendorf, 2026-08-31)
- 5c5c709 - fix(tui): pin diff highlights query (#46519) (opencode-agent[bot], 2026-08-31)
- 2386fce - chore: generate (opencode-agent[bot], 2026-09-01)
- ba79057 - docs on proper usage of OpenCode Go (Dax Raad, 2026-08-31)
- 0428492 - chore: generate (opencode-agent[bot], 2026-08-31)
- b639de0 - fix(stats): merge deepseek flash variants (#46446) (Adam, 2026-08-31)
- 26ff3ed - fix(tui): keep home shortcuts right-aligned (#36906) (opencode-agent[bot], 2026-08-31)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/apply_patch.ts` (+1, -1)
- `packages/opencode/test/tool/apply_patch.test.ts` (+21, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/stats/core/src/domain/inference.test.ts` (+7, -0)
- `packages/stats/core/src/domain/model-normalization.ts` (+2, -0)

#### Other Changes
- `packages/tui/src/component/prompt/index.tsx` (+1, -1)
- `packages/tui/src/parsers-config.ts` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+2, -2)
- `packages/web/src/content/docs/bs/go.mdx` (+2, -2)
- `packages/web/src/content/docs/da/go.mdx` (+2, -2)
- `packages/web/src/content/docs/de/go.mdx` (+2, -2)
- `packages/web/src/content/docs/es/go.mdx` (+2, -2)
- `packages/web/src/content/docs/fr/go.mdx` (+2, -2)
- `packages/web/src/content/docs/go.mdx` (+14, -2)
- `packages/web/src/content/docs/it/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ja/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ko/go.mdx` (+2, -2)
- `packages/web/src/content/docs/nb/go.mdx` (+2, -2)
- `packages/web/src/content/docs/pl/go.mdx` (+2, -2)
- `packages/web/src/content/docs/pt-br/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ru/go.mdx` (+2, -2)
- `packages/web/src/content/docs/th/go.mdx` (+2, -2)
- `packages/web/src/content/docs/tr/go.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+2, -2)

### Key Diffs

#### packages/opencode/src/tool/apply_patch.ts
```diff
diff --git a/packages/opencode/src/tool/apply_patch.ts b/packages/opencode/src/tool/apply_patch.ts
index f9201be..3f89a63 100644
--- a/packages/opencode/src/tool/apply_patch.ts
+++ b/packages/opencode/src/tool/apply_patch.ts
@@ -198,7 +198,7 @@ export const ApplyPatchTool = Tool.define(
         patch: change.diff,
         additions: change.additions,
         deletions: change.deletions,
-        movePath: change.movePath,
+        ...(change.movePath ? { movePath: change.movePath } : {}),
       }))
 
       // Check permissions if needed
```

#### packages/opencode/test/tool/apply_patch.test.ts
```diff
diff --git a/packages/opencode/test/tool/apply_patch.test.ts b/packages/opencode/test/tool/apply_patch.test.ts
index e394d80..7420361 100644
--- a/packages/opencode/test/tool/apply_patch.test.ts
+++ b/packages/opencode/test/tool/apply_patch.test.ts
@@ -1,8 +1,9 @@
 import { describe, expect } from "bun:test"
 import path from "path"
 import * as fs from "fs/promises"
+import { PermissionV1 } from "@opencode-ai/core/v1/permission"
 import { LayerNode } from "@opencode-ai/core/effect/layer-node"
-import { Cause, Effect, Exit, Layer } from "effect"
+import { Cause, Effect, Exit, Layer, Schema } from "effect"
 import { ApplyPatchTool } from "../../src/tool/apply_patch"
 import { LSP } from "@/lsp/lsp"
 import { FSUtil } from "@opencode-ai/core/fs-util"
@@ -107,6 +108,25 @@ describe("tool.apply_patch freeform", () => {
     }),
   )
 
+  it.instance(
+    "produces JSON-encodable permission metadata",
+    () =>
+      Effect.gen(function* () {
+        const { ctx, calls } = makeCtx()
+        yield* execute({ patchText: "*** Begin Patch\n*** Add File: new.txt\n+created\n*** End Patch" }, ctx)
+
+        expect(() => {
+          const request = Schema.encodeUnknownSync(PermissionV1.Request)({
+            id: PermissionV1.ID.ascending(),
+            sessionID: baseCtx.sessionID,
+            ...calls[0],
+          })
+          Schema.encodeUnknownSync(Schema.Json)(request)
+        }).not.toThrow()
+      }),
+    { git: true },
+  )
+
   it.instance(
     "applies add/update/delete in one patch",
     () =>
```

#### packages/stats/core/src/domain/inference.test.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.test.ts b/packages/stats/core/src/domain/inference.test.ts
index 5f7e026..20dbe86 100644
--- a/packages/stats/core/src/domain/inference.test.ts
+++ b/packages/stats/core/src/domain/inference.test.ts
@@ -50,6 +50,10 @@ describe("inference stat normalization", () => {
   })
 
   test("merges renamed models under their current name", () => {
+    expect(statModel("deepseek-v4-flash-0731", "")).toBe("deepseek-v4-flash")
+    expect(statModel("deepseek-v4-flash-0731-free", "")).toBe("deepseek-v4-flash")
+    expect(statModel("deepseek-v4-flash-dsv4-flash-final-rnaovd", "")).toBe("deepseek-v4-flash")
+    expect(statModel("deepseek-v4-flash-vision-exp", "")).toBe("deepseek-v4-flash-vision-exp")
     expect(statModel("x-preview-f", "")).toBe("glm-5.3-flash")
     expect(statModel("ox-alpha", "")).toBe("glm-5.3-flash")
     expect(statModel("ox-alpha-free", "")).toBe("glm-5.3-flash")
@@ -130,6 +134,9 @@ describe("inference stat normalization", () => {
     expect(queries[0]).toContain("COALESCE(NULLIF(lower(model_tier), ''), '') AS raw_tier")
     expect(queries[0]).toContain("WHEN lower(COALESCE(raw_tier, '')) = 'free'")
     expect(queries[0]).toContain("regexp_replace(NULLIF(route_model, ''), '^.*/', '')")
+    expect(queries[0]).toContain("= 'deepseek-v4-flash-0731' THEN 'deepseek-v4-flash'")
+    expect(queries[0]).toContain("= 'deepseek-v4-flash-dsv4-flash-final-rnaovd' THEN 'deepseek-v4-flash'")
+    expect(queries[0]).not.toContain("= 'deepseek-v4-flash-vision-exp' THEN 'deepseek-v4-flash'")
     expect(queries[0]).toContain("= 'ox-alpha' THEN 'glm-5.3-flash'")
     expect(queries[0]).toContain("= 'x-preview-f' THEN 'glm-5.3-flash'")
     expect(queries[0]).toContain("OR lower(raw_model) IN ('gpt-5-nano', 'grok-code', 'big-pickle')")
```

#### packages/stats/core/src/domain/model-normalization.ts
```diff
diff --git a/packages/stats/core/src/domain/model-normalization.ts b/packages/stats/core/src/domain/model-normalization.ts
index 744d761..6f2edb1 100644
--- a/packages/stats/core/src/domain/model-normalization.ts
+++ b/packages/stats/core/src/domain/model-normalization.ts
@@ -16,6 +16,8 @@ export const MODEL_AUTHOR_RULES = [
 export const EXCLUDED_MODELS = new Set(["alpha-gpt-next"])
 export const FREE_MODELS = new Set(["gpt-5-nano", "grok-code", "big-pickle"])
 export const MODEL_NAME_ALIASES: Record<string, string> = {
+  "deepseek-v4-flash-0731": "deepseek-v4-flash",
+  "deepseek-v4-flash-dsv4-flash-final-rnaovd": "deepseek-v4-flash",
   "ox-alpha": "glm-5.3-flash",
   "x-preview-f": "glm-5.3-flash",
   "xiaomi/mimo-v2.5": "mimo-v2.5",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/core/src/kilocode/session-message.ts
- `src/core/` - review core changes from packages/core/test/kilocode/event-storage-compat.test.ts
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/apply_patch.test.ts` - update based on opencode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/apply_patch.ts` - update based on opencode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/browser-open.ts` - update based on kilocode packages/opencode/src/kilocode/tool/browser-open.ts changes
- `src/tool/browser-open.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/browser-open.txt changes
- `src/tool/parameters.test.ts.snap.ts` - update based on kilocode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/send-file.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/send-file.test.ts changes
- `src/tool/shell-env.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/shell-env.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
