# Upstream Changes Report
Generated: 2026-06-18 10:22:01

## Summary
- kilocode: 196 commits, 363 files changed
- opencode: 3 commits, 67 files changed

## kilocode Changes (e9894141c..7606ee893)

### Commits

- 7606ee893 - Merge pull request #11401 from Kilo-Org/mark/stabilize-visual-regression (Mark IJbema, 2026-06-18)
- 30debe190 - Merge pull request #11402 from Kilo-Org/humorous-manuscript (Marius, 2026-06-18)
- 9994679cf - test(vscode): fail fast when screenshots do not settle (markijbema, 2026-06-18)
- 37d88a0f8 - Merge pull request #11342 from Kilo-Org/ci/jetbrains-use-container (Mark IJbema, 2026-06-18)
- 911e31dc4 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-18)
- 146c4f439 - fix(vscode): avoid animating shell output panels (marius-kilocode, 2026-06-18)
- 3d26a7c52 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-18)
- 9bb8a0ddf - test(kilo-vscode): add settle function to visual regression tests (markijbema, 2026-06-18)
- 576d71e4e - Merge pull request #11387 from Kilo-Org/fix/console-pierre-dependency (Mark IJbema, 2026-06-18)
- 390de4b12 - Merge pull request #9758 from Kilo-Org/sleepy-stoplight (Joshua Lambert, 2026-06-18)
- ebac27ae6 - Merge pull request #11379 from Kilo-Org/add-top-level-announcement-notification (Brian Turcotte, 2026-06-17)
- ba0f49ac4 - style: fix prettier formatting in notifications.tsx (kiloconnect[bot], 2026-06-17)
- 42617c000 - chore: update source-links.md with notifications.tsx URLs (kiloconnect[bot], 2026-06-17)
- 9ec1beb6e - ci: cache console production build (Josh Lambert, 2026-06-17)
- 89b182919 - fix(cli): declare console diff dependency (Josh Lambert, 2026-06-17)
- 67655c47c - Merge pull request #10788 from noobezlol/fix/bash-permission-string-migration (Catriel Müller, 2026-06-17)
- 7e1deaf1c - refactor: fix permission bypass (Catriel Müller, 2026-06-17)
- 4ff5df916 - refactor: move test to kilo folder (Catriel Müller, 2026-06-17)
- d07428d50 - Merge pull request #11382 from Kilo-Org/jetbrains/release/v7.0.1-rc.11 (Kirill Kalishev, 2026-06-17)
- 941007b68 - test(cli): cover json permission migration (noobezlol, 2026-06-17)
- ab1c90b68 - fix(cli): handle string permission migration (noobezlol, 2026-06-17)
- 7cd018af3 - fix(vscode): update star giveaway notification message and make dismissible (kiloconnect[bot], 2026-06-17)
- 4592ddd4b - docs(jetbrains): edit changelog for v7.0.1-rc.11 (Kirill Kalishev, 2026-06-17)
- 1e0df0cbc - release(jetbrains): v7.0.1-rc.11 (kilo-maintainer[bot], 2026-06-17)
- 2b5d4fef6 - Merge pull request #11378 from Kilo-Org/fix/jetbrains-publish-install (Kirill Kalishev, 2026-06-17)
- f02deb551 - feat(vscode): add top-level announcement notification (kiloconnect[bot], 2026-06-17)
- 90b90f0f0 - docs(jetbrains): clarify release PR handoff (kirillk, 2026-06-17)
- 05ed4b6a7 - ci(jetbrains): install deps before publish build (kirillk, 2026-06-17)
- 4de69af48 - Merge pull request #11374 from Kilo-Org/jetbrains/release/v7.0.1-rc.10 (Kirill Kalishev, 2026-06-17)
- 6ef2c111e - docs(jetbrains): edit changelog for v7.0.1-rc.10 (Kirill Kalishev, 2026-06-17)
- fd4f66950 - Merge pull request #11365 from Kilo-Org/mark/fork-cli-tips (Mark IJbema, 2026-06-17)
- 7bfbca20e - release(jetbrains): v7.0.1-rc.10 (kilo-maintainer[bot], 2026-06-17)
- 68c7755f2 - ci(jetbrains): rely on image-provided JBR libraries (markijbema, 2026-06-17)
- 31732111b - Merge remote-tracking branch 'origin/main' into ci/jetbrains-use-container Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (markijbema, 2026-06-17)
- 6f06eee32 - Merge pull request #11372 from Kilo-Org/ci/complete-jetbrains-image (Mark IJbema, 2026-06-17)
- 57622a1f3 - fix(cli): update kilocode_change markers in tips-view TIPS array (kiloconnect[bot], 2026-06-17)
- a91b33b6b - Merge pull request #11324 from Kilo-Org/leather-peace (Kirill Kalishev, 2026-06-17)
- 45c604831 - Merge branch 'main' into mark/fork-cli-tips (Mark IJbema, 2026-06-17)
- 52b3a0109 - Merge pull request #11373 from Kilo-Org/poised-exoplanet (Marius, 2026-06-17)
- 901ecd7c6 - Merge pull request #11221 from Kilo-Org/tidy-antlion (Kirill Kalishev, 2026-06-17)
- 7fa2239ce - Merge branch 'main' into leather-peace (Kirill Kalishev, 2026-06-17)
- 2ab931691 - ci: keep stable JetBrains image layers before dependency cache (markijbema, 2026-06-17)
- b53183b65 - Merge branch 'main' into tidy-antlion (Kirill Kalishev, 2026-06-17)
- ca014e690 - Merge branch 'main' into poised-exoplanet (Kirill Kalishev, 2026-06-17)
- 45dff0b7f - Merge pull request #11146 from Kilo-Org/feat/gitkilo (Marius, 2026-06-17)
- 57b7177d7 - ci: prewarm the JetBrains image Bun package cache (markijbema, 2026-06-17)
- f21a34a1e - fix: silence interrupted session notifications (marius-kilocode, 2026-06-17)
- 3b1ff4f98 - Merge pull request #9807 from truffle-dev/fix/cli-best-effort-telemetry-shutdown-on-exit-9788 (Mark IJbema, 2026-06-17)
- 0f9605dd4 - Merge remote-tracking branch 'origin/leather-peace' into leather-peace (kirillk, 2026-06-17)
- c541d849f - fix(jetbrains): localize session copy strings (kirillk, 2026-06-17)
- f9c691dfe - Merge branch 'main' into leather-peace (Kirill Kalishev, 2026-06-17)
- 9dd4711c9 - ci: complete the JetBrains test container (markijbema, 2026-06-17)
- b38492244 - Merge pull request #11335 from Kilo-Org/briant/addLanguages (Brian Turcotte, 2026-06-17)
- b76752dd1 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-17)
- f59a0f158 - Merge branch 'main' into fix/cli-best-effort-telemetry-shutdown-on-exit-9788 (Mark IJbema, 2026-06-17)
- 1cf904154 - test(kilocode): update command branding test file path (markijbema, 2026-06-17)
- 5746b1e06 - fix(vscode): restore tool preview motion (marius-kilocode, 2026-06-17)
- 9b12e1ca2 - test(cli): avoid global runtime mock (Mark IJbema, 2026-06-17)
- 9a8e27173 - Merge remote-tracking branch 'origin/main' into feat/gitkilo (marius-kilocode, 2026-06-17)
- d3aa48c70 - refactor(cli): comment unused upstream tips (Mark IJbema, 2026-06-17)
- 00b795946 - fix(jetbrains): preserve provider config scope (kirillk, 2026-06-17)
- 53940cbe7 - refactor(cli): empty unused upstream tips (Mark IJbema, 2026-06-17)
- f40302719 - ci(jetbrains): refresh apt indexes before installing font libraries (markijbema, 2026-06-17)
- 93941001f - chore: add telemetry shutdown changeset (Mark IJbema, 2026-06-17)
- 0f2fc6f33 - test(cli): cover rejected telemetry shutdown (Mark IJbema, 2026-06-17)
- 549725be5 - fix(cli): preserve successful exit when telemetry times out (Mark IJbema, 2026-06-17)
- d981c35e5 - docs: fix readme source link (Brian Turcotte, 2026-06-17)
- e208bfb5f - docs: fix localized readme source links (Brian Turcotte, 2026-06-17)
- 565f740e1 - Merge pull request #11351 from Kilo-Org/humorous-exhaust (Marius, 2026-06-17)
- 97f115dbc - Merge pull request #11352 from Kilo-Org/fix-a11y-model-navigation (Marius, 2026-06-17)
- 26b36c80f - Merge pull request #11366 from Kilo-Org/abrasive-scarer (Marius, 2026-06-17)
- 41dcfb652 - Merge pull request #11367 from Kilo-Org/night-saltasaurus (Marius, 2026-06-17)
- c5d8ae87b - Merge branch 'main' into leather-peace (Kirill Kalishev, 2026-06-17)
- c1bef8604 - ci(jetbrains): install font libs needed by JBR inside container (markijbema, 2026-06-17)
- c860f6c70 - Merge remote-tracking branch 'origin/main' into leather-peace (kirillk, 2026-06-17)
- f6083176b - Merge remote-tracking branch 'origin/main' into tidy-antlion (kirillk, 2026-06-17)
- 2a74b20f6 - Merge pull request #11310 from Kilo-Org/docs/jetbrains-eap-copyline (Kirill Kalishev, 2026-06-17)
- f6589aaec - Merge pull request #11332 from Kilo-Org/horn-icon (Kirill Kalishev, 2026-06-17)
- 0b267c6bf - ci(jetbrains): install bun dependencies inside container (markijbema, 2026-06-17)
- 019ca99bf - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-17)
- e93a65c0b - Merge branch 'main' into fix/cli-best-effort-telemetry-shutdown-on-exit-9788 (Mark IJbema, 2026-06-17)
- 1933cf7ca - feat(agent-manager): open pull requests with keyboard shortcut (marius-kilocode, 2026-06-17)
- ce7ec1ded - Merge pull request #11358 from Kilo-Org/swamp-isthmus (Marius, 2026-06-17)
- c04d47b47 - Merge branch 'main' into mark/fork-cli-tips (Mark IJbema, 2026-06-17)
- 47399547e - fix(vscode): widen chat readable lane from 78ch to 88ch for more content space (marius-kilocode, 2026-06-17)
- 1494f0512 - refactor(cli): fork TUI tips (Mark IJbema, 2026-06-17)
- 349aff8fb - Merge branch 'main' into ci/jetbrains-use-container (Mark IJbema, 2026-06-17)
- 4b624b9a2 - Merge pull request #10781 from shssoichiro/title-bar-status (Catriel Müller, 2026-06-17)
- 910f19858 - Merge pull request #11361 from Kilo-Org/fix/replace-oc-with-kilo-tip (Mark IJbema, 2026-06-17)
- f8052d939 - Merge pull request #11343 from Kilo-Org/perf/jetbrains-test-synchronization (Mark IJbema, 2026-06-17)
- 7b97e4624 - refactor: made this change configurable (Catriel Müller, 2026-06-17)
- 391a313a2 - Merge pull request #11317 from Kilo-Org/feat/vscode-switch-deep-links (Joshua Lambert, 2026-06-17)
- f7bc48e0b - fix(cli): comment out tips for GitHub Actions features Kilo doesn't offer (markijbema, 2026-06-17)
- dcb86c799 - refactor(jetbrains): share coroutine test harness (markijbema, 2026-06-17)
- 1b25a4363 - Merge branch 'main' into title-bar-status (Catriel Müller, 2026-06-17)
- fb6b5ed63 - Merge pull request #11347 from Kilo-Org/mark/fix-llm-user-agent-main (Mark IJbema, 2026-06-17)
- fc92aa65d - Merge pull request #11357 from Kilo-Org/even-conifer (Marius, 2026-06-17)
- 3bf66b18e - Merge pull request #11354 from Kilo-Org/solar-honeycrisp (Marius, 2026-06-17)
- 757c4c7e8 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-17)
- 0920b3ffa - fix(agent-manager): clean up failed session moves (marius-kilocode, 2026-06-17)
- deb502482 - Merge pull request #10758 from cooper-oai/codex/codex-refresh-process-lock (Catriel Müller, 2026-06-17)
- 14cb3dfd0 - fix(vscode): show line numbers in edit approval diffs (marius-kilocode, 2026-06-17)
- b2eef5cff - chore(cli): add Atomic Chat fix changeset (marius-kilocode, 2026-06-17)
- 2b304461f - fix(cli): skip bundled Atomic Chat in plugin loader (marius-kilocode, 2026-06-17)
- 5dd5c9a0d - fix(vscode): improve screen reader model navigation (marius-kilocode, 2026-06-17)
- 94bdfb9f8 - fix: sync remote sessions across extension surfaces (marius-kilocode, 2026-06-17)
- a5f2a84a6 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-17)
- 40cda2900 - Merge branch 'main' into feat/gitkilo (Marius, 2026-06-17)
- a75da5542 - test(cli): keep user agent marker focused (Mark IJbema, 2026-06-17)
- 074a3363e - test(cli): annotate LLM user agent assertion (Mark IJbema, 2026-06-17)
- b518a76ae - fix(cli): identify Kilo in LLM user agent (Mark IJbema, 2026-06-17)
- 2d46adb54 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-17)
- 069685edc - Merge branch 'main' into feat/gitkilo (Marius, 2026-06-17)
- 5eff92154 - Merge branch 'main' into sleepy-stoplight (Marius, 2026-06-17)
- 96e6fdca4 - Merge branch 'main' into perf/jetbrains-test-synchronization (Mark IJbema, 2026-06-17)
- 56205ea74 - perf(jetbrains): eliminate fixed waits from session tests (markijbema, 2026-06-17)
- af370bd56 - ci(jetbrains): run inside pre-built container, drop manual setup steps (markijbema, 2026-06-17)
- 8ff1550ee - chore: change title bar symbols (Josh Holmer, 2026-06-16)
- 3bd11cfdc - adding alternate language readmes (Brian Turcotte, 2026-06-16)
- 2e056c980 - chore(vscode): format provider catalog test (kirillk, 2026-06-16)
- 1c7d5ca7d - fix(jetbrains): restore popular provider settings (kirillk, 2026-06-16)
- 9b73bf91e - fix(vscode): restore popular provider settings (kirillk, 2026-06-16)
- 0aaef8332 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-17)
- af92e1ee1 - Merge branch 'main' into leather-peace (Kirill Kalishev, 2026-06-16)
- 2dcd5a42c - Merge origin/feat/gitkilo into fix/vscode-tool-call-preview-polish (Iván Uruchurtu, 2026-06-16)
- 33def8874 - fix(vscode): restore tool preview behavior (Iván Uruchurtu, 2026-06-16)
- 53219a8d0 - docs: skip routine Java preflight checks (kirillk, 2026-06-16)
- 625c03436 - fix(jetbrains): harden release skill (kirillk, 2026-06-16)
- 9df96468d - chore: remove session copy plan files (kirillk, 2026-06-16)
- 6e69bac72 - chore: remove provider settings plan files (kirillk, 2026-06-16)
- 33a2436f1 - Merge branch 'main' into feat/vscode-switch-deep-links (Joshua Lambert, 2026-06-16)
- 29d2cc4df - fix(jetbrains): stabilize session UI tests (kirillk, 2026-06-16)
- ccbdb34eb - fix(jetbrains): restore provider settings checks (kirillk, 2026-06-16)
- c8bad77f1 - refactor(vscode): inline switch link parsing (Josh Lambert, 2026-06-16)
- 2cbd155ca - fix(jetbrains): harden session copy UI (kirillk, 2026-06-16)
- 6455aa0da - fix: remove provider metadata duplication (kirillk, 2026-06-16)
- f703f7e3c - Merge branch 'main' into feat/vscode-switch-deep-links (Joshua Lambert, 2026-06-16)
- 3623676d7 - fix(vscode): eliminate phantom tool gaps (Iván Uruchurtu, 2026-06-16)
- 61729fd78 - fix(vscode): require agent parameter in switch links (Josh Lambert, 2026-06-16)
- 214b8da6c - fix(vscode): allow agent-only switch links (Josh Lambert, 2026-06-16)
- 358135f69 - feat(jetbrains): add session message copy toolbar (kirillk, 2026-06-16)
- 64ff1084c - fix: fix tests (Catriel Müller, 2026-06-16)
- 46b24e0c0 - Merge remote-tracking branch 'origin/main' into tidy-antlion (kirillk, 2026-06-16)
- db96e31e6 - fix(jetbrains): show provider in model picker trigger (kirillk, 2026-06-16)
- b0183f984 - fix(jetbrains): prefer headless provider oauth (kirillk, 2026-06-16)
- f90644471 - fix(jetbrains): keep hover copy button opaque (kirillk, 2026-06-16)
- e9bea7087 - fix: fix typecheck (Catriel Müller, 2026-06-16)
- 3e20e43b3 - refactor: prevent infinite lock (Catriel Müller, 2026-06-16)
- f11450c81 - fix(jetbrains): stabilize session hover copy overlay (kirillk, 2026-06-16)
- e13ee2fe2 - fix(jetbrains): keep provider auth overlay fixed (kirillk, 2026-06-16)
- bc7f9b05e - feat(jetbrains): add session hover copy overlay (kirillk, 2026-06-16)
- f0ad6db18 - fix(jetbrains): gate settings on CLI readiness (kirillk, 2026-06-16)
- 8e13875e2 - Revert "fix(jetbrains): preserve copy selection on context menu" (kirillk, 2026-06-16)
- a2ccf574a - feat(vscode): support agent switch links (Josh Lambert, 2026-06-16)
- 273a4fcee - Merge branch 'main' into codex/codex-refresh-process-lock (Catriel Müller, 2026-06-16)
- 2ea9f0c24 - fix(kilo-docs): copy JetBrains EAP URL without newline (kirillk, 2026-06-16)
- 057c5b7fc - fix(jetbrains): preserve copy selection on context menu (kirillk, 2026-06-15)
- 2fe8da18a - Merge branch 'main' into feat/gitkilo (Joshua Lambert, 2026-06-15)
- b4864ebd4 - fix(jetbrains): scope session copy context (kirillk, 2026-06-15)
- d8b6efd58 - fix(jetbrains): show cancellable provider oauth progress (kirillk, 2026-06-15)
- 2b60686f1 - docs(jetbrains): add provider settings plans (kirillk, 2026-06-15)
- 0086e0dcb - fix(jetbrains): widen provider api key dialog (kirillk, 2026-06-15)
- bf7779d17 - fix(jetbrains): keep provider toolbar fixed (kirillk, 2026-06-15)
- b92ae903d - docs(jetbrains): clarify CLI artifact refresh guidance (kirillk, 2026-06-15)
- abaf04883 - Merge remote-tracking branch 'origin/main' into fix/vscode-tool-call-preview-polish (Iván Uruchurtu, 2026-06-15)
- 8fc46998f - Merge remote-tracking branch 'origin/main' into tidy-antlion (kirillk, 2026-06-15)
- f394c5b6d - Merge origin/feat/gitkilo into fix/vscode-tool-call-preview-polish (Iván Uruchurtu, 2026-06-15)
- 486a709fc - fix(vscode): restore shell command highlighting (Iván Uruchurtu, 2026-06-15)
- 88bc6887c - Merge remote-tracking branch 'origin/main' into tidy-antlion (kirillk, 2026-06-15)
- b0ce1b0b1 - test(cli): cover reverting moved files (Josh Lambert, 2026-06-14)
- 650f81c82 - Merge stale PR history onto current main (Josh Lambert, 2026-06-14)
- 8db7b6858 - fix(cli): restore moved files during snapshot revert (Josh Lambert, 2026-06-14)
- f4843ae50 - Merge remote-tracking branch 'origin/main' into tidy-antlion (kirillk, 2026-06-14)
- 887f58ccc - fix(jetbrains): render provider descriptions (kirillk, 2026-06-14)
- f8ee07f84 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-13)
- 241f68b7e - Merge origin/main into fix/vscode-tool-call-preview-polish (Iván Uruchurtu, 2026-06-12)
- 66af69070 - feat(cli): show terminal title status indicators (Josh Holmer, 2026-06-12)
- 8d243a35b - fix(vscode): soften tool output surfaces (Iván Uruchurtu, 2026-06-12)
- d0167ebec - fix(vscode): unify tool card rhythm (Iván Uruchurtu, 2026-06-12)
- cd846d93d - fix(vscode): normalize chat block output surfaces (Iván Uruchurtu, 2026-06-12)
- 5a36af64d - fix(vscode): align chat block preview surfaces (Iván Uruchurtu, 2026-06-12)
- 987da2728 - feat: share provider metadata (kirillk, 2026-06-12)
- ad3be6cae - fix(jetbrains): restore provider catalog sections (kirillk, 2026-06-12)
- eaece449b - chore: trim tool preview PR scope (Iván Uruchurtu, 2026-06-11)
- e04593219 - style(vscode): format tool call preview files (Iván Uruchurtu, 2026-06-11)
- c9c4c794a - test(vscode): update shell preview contract (Iván Uruchurtu, 2026-06-11)
- 0277983d6 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-12)
- 481f8361c - fix(vscode): polish chat tool call previews (Iván Uruchurtu, 2026-06-11)
- ef7aa7fdf - fix(jetbrains): stabilize provider settings actions (kirillk, 2026-06-11)
- b6bbb839e - fix(jetbrains): add provider settings disconnect flow (kirillk, 2026-06-11)
- f202002c8 - test(cli): isolate Kilo Codex refresh fixtures (Cooper Gamble, 2026-05-30)
- 14cc0e76c - test(cli): await Codex refresh server teardown (Cooper Gamble, 2026-05-30)
- e511b230a - fix(cli): serialize Codex OAuth refresh across processes (Cooper Gamble, 2026-05-30)
- 2723c08b9 - test(telemetry): isolate shutdown timeout test in its own file (truffle, 2026-05-04)
- 5f16547ca - fix(cli): bound Telemetry.shutdown so unreachable PostHog endpoint cannot block CLI exit (truffle, 2026-05-04)
- b92677a58 - fix(cli): restore source file when reverting a move across folders (Josh Lambert, 2026-05-01)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+10, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+31, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt` (+9, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/models.ts` (+1, -0)

#### Other Changes
- `.changeset/fix-jetbrains-provider-settings.md` (+5, -0)
- `.changeset/fix-llm-user-agent.md` (+5, -0)
- `.changeset/fix-model-picker-navigation.md` (+5, -0)
- `.changeset/fix-string-permission-migration.md` (+5, -0)
- `.changeset/jetbrains-hover-copy-overlay.md` (+5, -0)
- `.changeset/jetbrains-message-toolbar.md` (+5, -0)
- `.changeset/jetbrains-model-provider-label.md` (+5, -0)
- `.changeset/jetbrains-provider-disconnect.md` (+5, -0)
- `.changeset/jetbrains-provider-headless-oauth.md` (+5, -0)
- `.changeset/jetbrains-provider-oauth-cancel.md` (+5, -0)
- `.changeset/jetbrains-session-copy.md` (+5, -0)
- `.changeset/move-worktrees-safely.md` (+5, -0)
- `.changeset/neat-jetbrains-provider-list.md` (+5, -0)
- `.changeset/open-worktree-pull-request.md` (+5, -0)
- `.changeset/polish-vscode-tool-previews.md` (+5, -0)
- `.changeset/preserve-cli-telemetry-exit.md` (+5, -0)
- `.changeset/prevent-atomic-chat-install.md` (+5, -0)
- `.changeset/quiet-interrupted-sessions.md` (+6, -0)
- `.changeset/remote-agent-manager-sessions.md` (+5, -0)
- `.changeset/restore-jetbrains-popular-providers.md` (+5, -0)
- `.changeset/restore-popular-providers.md` (+5, -0)
- `.changeset/revert-file-moves.md` (+5, -0)
- `.changeset/shared-provider-icons.md` (+7, -0)
- `.changeset/show-edit-approval-line-numbers.md` (+5, -0)
- `.changeset/steady-codex-refresh.md` (+5, -0)
- `.changeset/steady-shell-expansion.md` (+5, -0)
- `.changeset/switch-model-agent-links.md` (+5, -0)
- `.changeset/terminal-title-status.md` (+6, -0)
- `.changeset/widen-chat-readable-lane.md` (+5, -0)
- `.github/workflows/publish-jetbrains.yml` (+3, -0)
- `.github/workflows/test-jetbrains.yml` (+6, -12)
- `.github/workflows/typecheck.yml` (+3, -0)
- `.kilo/skills/release-jetbrains/SKILL.md` (+42, -3)
- `.kilo/skills/release-jetbrains/script/update-changelog.ts` (+1, -1)
- `.kilo/skills/release-jetbrains/script/watch-publish.ts` (+53, -22)
- `AGENTS.md` (+2, -2)
- `README.ar.md` (+181, -0)
- `README.bn.md` (+177, -0)
- `README.br.md` (+177, -0)
- `README.bs.md` (+177, -0)
- `README.da.md` (+177, -0)
- `README.de.md` (+177, -0)
- `README.es.md` (+177, -0)
- `README.fr.md` (+177, -0)
- `README.gr.md` (+177, -0)
- `README.it.md` (+177, -0)
- `README.ja.md` (+177, -0)
- `README.ko.md` (+177, -0)
- `README.md` (+5, -1)
- `README.no.md` (+177, -0)
- `README.pl.md` (+177, -0)
- `README.ru.md` (+177, -0)
- `README.th.md` (+177, -0)
- `README.tr.md` (+177, -0)
- `README.uk.md` (+177, -0)
- `README.vi.md` (+177, -0)
- `README.zh.md` (+177, -0)
- `README.zht.md` (+177, -0)
- `bun.lock` (+1, -0)
- `nix/hashes.json` (+4, -4)
- `packages/containers/README.md` (+1, -1)
- `packages/containers/jetbrains/Dockerfile` (+21, -4)
- `packages/kilo-console/package.json` (+1, -0)
- `packages/kilo-console/src/routes/config/CliNotificationsRoute.tsx` (+76, -44)
- `packages/kilo-console/src/routes/config/state/ui.ts` (+8, -1)
- `packages/kilo-console/src/styles/cli-ui.css` (+6, -3)
- `packages/kilo-docs/components/CopyLine.tsx` (+99, -0)
- `packages/kilo-docs/components/index.js` (+1, -0)
- `packages/kilo-docs/markdoc/partials/install-jetbrains.md` (+1, -3)
- `packages/kilo-docs/markdoc/tags/copy-line.markdoc.ts` (+13, -0)
- `packages/kilo-docs/markdoc/tags/index.ts` (+1, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+29, -11)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-with-diffs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/question-dock-many-options-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/question-dock-multi-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/question-dock-single-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/components-shell/shell-execution-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/background-process-tool-cards-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/chat-busy-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/diff-summary-collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/mcp-tool-cards-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/mcp-tool-expanded-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/multiple-tool-calls-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-apply-patch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-edit-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/question-dismissed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-compact-update-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-completed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-docs-overview-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/tool-cards-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/tool-errors-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/tool-errors-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/source-links.md` (+2, -0)
- `packages/kilo-i18n/src/ar.ts` (+11, -3)
- `packages/kilo-i18n/src/br.ts` (+11, -3)
- `packages/kilo-i18n/src/bs.ts` (+11, -3)
- `packages/kilo-i18n/src/da.ts` (+11, -3)
- `packages/kilo-i18n/src/de.ts` (+11, -3)
- `packages/kilo-i18n/src/en.ts` (+11, -3)
- `packages/kilo-i18n/src/es.ts` (+11, -3)
- `packages/kilo-i18n/src/fr.ts` (+11, -3)
- `packages/kilo-i18n/src/it.ts` (+11, -3)
- `packages/kilo-i18n/src/ja.ts` (+11, -3)
- `packages/kilo-i18n/src/ko.ts` (+11, -3)
- `packages/kilo-i18n/src/nl.ts` (+11, -3)
- `packages/kilo-i18n/src/no.ts` (+11, -3)
- `packages/kilo-i18n/src/pl.ts` (+11, -3)
- `packages/kilo-i18n/src/ru.ts` (+11, -3)
- `packages/kilo-i18n/src/th.ts` (+11, -3)
- `packages/kilo-i18n/src/tr.ts` (+11, -3)
- `packages/kilo-i18n/src/uk.ts` (+11, -3)
- `packages/kilo-i18n/src/zh.ts` (+11, -3)
- `packages/kilo-i18n/src/zht.ts` (+11, -3)
- `packages/kilo-jetbrains/AGENTS.md` (+7, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+30, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+21, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+198, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/provider/KiloBackendProviderSettingsManager.kt` (+294, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloProviderRpcApiImpl.kt` (+51, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloProviderRpcApiProvider.kt` (+15, -0)
- `packages/kilo-jetbrains/backend/src/main/resources/kilo.jetbrains.backend.xml` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+79, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/migration/LegacyMigrationHttpBackendTest.kt` (+3, -11)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/provider/KiloBackendProviderSettingsManagerTest.kt` (+284, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+29, -1)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/FixGeneratedApiTask.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/build.gradle.kts` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloProviderService.kt` (+85, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloBundle.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+13, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/PickerRow.kt` (+8, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+14, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/editor/SessionEditorTextField.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRenderer.kt` (+1, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptEditorTextField.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+9, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionContextMenu.kt` (+63, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionCopyButton.kt` (+56, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionCopyTarget.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionHoverCopyOverlay.kt` (+129, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionSelection.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionTargetResolver.kt` (+74, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionEditorStyle.kt` (+7, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageToolbar.kt` (+62, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+153, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionView.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurable.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/auth/DeviceOAuthPanel.kt` (+219, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/{profile => auth}/QrCode.kt` (+1, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/KiloReadyConfigurable.kt` (+152, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsOverlayPanel.kt` (+80, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsPanel.kt` (+1, -29)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsProgressOverlay.kt` (+39, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelsConfigurable.kt` (+9, -33)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/LoggedOutProfileUi.kt` (+17, -212)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/UserProfileConfigurable.kt` (+13, -50)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProviderCatalog.kt` (+99, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProviderListRenderer.kt` (+176, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProviderListRows.kt` (+84, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProvidersConfigurable.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUi.kt` (+656, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/HoverIcon.kt` (+13, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+33, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdViewHybrid.kt` (+45, -7)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+44, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiTestBase.kt` (+9, -11)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+20, -19)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionUpdateQueueTest.kt` (+3, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+50, -26)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+148, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionSelectionCopyTest.kt` (+246, -27)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionUiUpdateTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+16, -11)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelPickerTest.kt` (+33, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TextViewTest.kt` (+84, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/QrCodeTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/KiloReadyConfigurableTest.kt` (+284, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsRowsTest.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUiTest.kt` (+867, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/test/CopyProviderSink.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeProviderRpcApi.kt` (+82, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/TestCoroutines.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridTest.kt` (+33, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloProviderRpcApi.kt` (+37, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ProviderSettingsDto.kt` (+156, -0)
- `packages/kilo-telemetry/src/__tests__/telemetry-shutdown.test.ts` (+52, -0)
- `packages/kilo-telemetry/src/__tests__/telemetry.test.ts` (+1, -0)
- `packages/kilo-telemetry/src/client.ts` (+11, -5)
- `packages/kilo-telemetry/src/telemetry.ts` (+2, -2)
- `packages/kilo-ui/src/components/basic-tool.css` (+237, -15)
- `packages/kilo-ui/src/components/collapsible.css` (+3, -3)
- `packages/kilo-ui/src/components/diff.tsx` (+1, -1)
- `packages/kilo-ui/src/components/message-part.css` (+183, -17)
- `packages/kilo-ui/src/components/message-part.tsx` (+29, -28)
- `packages/kilo-ui/src/styles/vscode-bridge.css` (+6, -0)
- `packages/kilo-vscode/package.json` (+11, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+11, -8)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+15, -0)
- `packages/kilo-vscode/src/agent-manager/continue-in-worktree.ts` (+20, -1)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+3, -0)
- `packages/kilo-vscode/src/extension.ts` (+11, -6)
- `packages/kilo-vscode/src/services/attention/service.ts` (+12, -8)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.test.ts` (+44, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+34, -10)
- `packages/kilo-vscode/src/shared/provider-model.ts` (+6, -0)
- `packages/kilo-vscode/tests/model-selector-accessibility.spec.ts` (+93, -9)
- `packages/kilo-vscode/tests/permission-diff.spec.ts` (+12, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+12, -0)
- `packages/kilo-vscode/tests/unit/attention.test.ts` (+30, -2)
- `packages/kilo-vscode/tests/unit/continue-in-worktree.test.ts` (+81, -4)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/font-size-arch.test.ts` (+16, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+89, -17)
- `packages/kilo-vscode/tests/unit/navigate.test.ts` (+25, -0)
- `packages/kilo-vscode/tests/unit/provider-catalog.test.ts` (+36, -0)
- `packages/kilo-vscode/tests/unit/sidebar-search.test.ts` (+10, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+13, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+1, -0)
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
- `packages/kilo-vscode/webview-ui/agent-manager/navigate.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/remote-sessions.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/shortcuts.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+14, -9)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDiff.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeToolOverrides.tsx` (+19, -15)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProviderSelectDialog.tsx` (+12, -5)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProvidersTab.tsx` (+5, -8)
- `packages/kilo-vscode/webview-ui/src/components/settings/provider-catalog.ts` (+27, -21)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+274, -166)
- `packages/kilo-vscode/webview-ui/src/context/notifications.tsx` (+12, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+18, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+15, -3)
- `packages/kilo-vscode/webview-ui/src/stories/shared.stories.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/stories/tool-call-lab.stories.tsx` (+467, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+10, -2)
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/styles/plan-exit.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/styles/question-dock.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/styles/tool-overrides.css` (+29, -13)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/providers.ts` (+5, -0)
- `packages/kilo-web-ui/src/components/session-review.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+15, -22)
- `packages/opencode/src/cli/cmd/tui/config/tui-schema.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+27, -24)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/notifications.ts` (+12, -14)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+3, -7)
- `packages/opencode/src/kilo-sessions/remote-ws.ts` (+30, -3)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+56, -8)
- `packages/opencode/src/kilocode/cli/cmd/tui/context/tui-config.tsx` (+2, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/feature-plugins/home/tips.ts` (+180, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/terminal-title.ts` (+137, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/title-icon.ts` (+9, -0)
- `packages/opencode/src/kilocode/cli/setup.ts` (+16, -3)
- `packages/opencode/src/kilocode/config/config.ts` (+1, -1)
- `packages/opencode/src/kilocode/config/default-plugins.ts` (+1, -3)
- `packages/opencode/src/kilocode/provider/codex-refresh.ts` (+52, -32)
- `packages/opencode/src/kilocode/provider/metadata.ts` (+40, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/config-console.ts` (+2, -0)
- `packages/opencode/src/plugin/codex.ts` (+5, -2)
- `packages/opencode/src/plugin/loader.ts` (+2, -0)
- `packages/opencode/src/provider/provider.ts` (+12, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+5, -1)
- `packages/opencode/src/session/llm.ts` (+3, -3)
- `packages/opencode/src/snapshot/index.ts` (+6, -1)
- `packages/opencode/test/cli/cmd/tui/notifications.test.ts` (+47, -9)
- `packages/opencode/test/kilocode/cli-shutdown.test.ts` (+123, -0)
- `packages/opencode/test/kilocode/cli/cmd/tui/context/tui-config.test.ts` (+24, -1)
- `packages/opencode/test/kilocode/codex-auth-refresh.test.ts` (+219, -3)
- `packages/opencode/test/kilocode/codex-refresh-user-agent.test.ts` (+55, -0)
- `packages/opencode/test/kilocode/command-branding.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/config/atomic-chat-default-plugin.test.ts` (+20, -1)
- `packages/opencode/test/kilocode/config/config.test.ts` (+104, -1)
- `packages/opencode/test/kilocode/fixture/codex-auth-refresh-worker.ts` (+113, -0)
- `packages/opencode/test/kilocode/oauth-branding.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/provider-metadata.test.ts` (+31, -0)
- `packages/opencode/test/kilocode/server/tui-config.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/sessions/remote-ws.test.ts` (+42, -0)
- `packages/opencode/test/kilocode/snapshot-revert-move.test.ts` (+42, -0)
- `packages/opencode/test/kilocode/terminal-title.test.ts` (+155, -0)
- `packages/opencode/test/kilocode/tui-terminal-title-reactivity.test.ts` (+26, -0)
- `packages/opencode/test/session/llm.test.ts` (+3, -0)
- `packages/opencode/test/session/prompt.test.ts` (+4, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+2, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+14, -0)
- `packages/sdk/openapi.json` (+28, -0)
- `packages/ui/src/assets/icons/provider/kilo.svg` (+2, -3)
- `script/upstream/opencode-changesets.test.ts` (+35, -25)
- `script/upstream/opencode-changesets.ts` (+12, -3)

### Key Diffs

#### packages/core/src/models.ts
```diff
diff --git a/packages/core/src/models.ts b/packages/core/src/models.ts
index 1c2417684..f69ecc6d2 100644
--- a/packages/core/src/models.ts
+++ b/packages/core/src/models.ts
@@ -105,6 +105,7 @@ export type Model = Schema.Schema.Type<typeof Model>
 export const Provider = Schema.Struct({
   api: Schema.optional(Schema.String),
   name: Schema.String,
+  description: Schema.optional(Schema.String), // kilocode_change
   env: Schema.Array(Schema.String),
   id: Schema.String,
   npm: Schema.optional(Schema.String),
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
index 7200420d4..2593c941a 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
@@ -13,6 +13,8 @@ import ai.kilocode.client.ui.md.MdCodeBlockFactory
 import ai.kilocode.client.ui.md.MdCodeBlockOptions
 import ai.kilocode.client.ui.md.MdViewFactory
 import ai.kilocode.client.ui.md.hybrid.MdTerminal
+import com.intellij.openapi.actionSystem.DataSink
+import com.intellij.openapi.actionSystem.UiDataProvider
 import com.intellij.openapi.Disposable
 import com.intellij.openapi.util.Disposer
 import com.intellij.ui.EditorTextField
@@ -26,10 +28,10 @@ import javax.swing.ScrollPaneConstants
 
 class ShellToolView(
     tool: Tool,
-    selection: SessionSelection? = null,
+    private val selection: SessionSelection? = null,
     private val parts: ToolParts = toolParts(tool),
     private val holder: ShellHolder = ShellHolder(tool, selection),
-) : SecondarySessionPartView(parts.header, { holder.body().panel }) {
+) : SecondarySessionPartView(parts.header, { holder.body().panel }), UiDataProvider {
 
     override val contentId: String = tool.id
 
@@ -43,6 +45,12 @@ class ShellToolView(
         sync()
     }
 
+    override fun uiDataSnapshot(sink: DataSink) {
+        selection?.provideCopy(sink) { holder.shell?.markdown() ?: fallbackText() }
+    }
+
+    private fun fallbackText() = ShellContent(item).body
+
     @RequiresEdt
     override fun expand(): Boolean {
         val changed = super.expand()
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
index 0dd50b893..5b0654b56 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
@@ -6,6 +6,7 @@ import ai.kilocode.client.plugin.KiloBundle
 import ai.kilocode.client.session.model.Tool
 import ai.kilocode.client.session.model.ToolExecState
 import ai.kilocode.client.session.ui.selection.SessionSelection
+import ai.kilocode.client.session.ui.selection.SessionCopyTarget
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionUiStyle
 import ai.kilocode.client.session.views.SessionViewIcons
@@ -16,6 +17,8 @@ import ai.kilocode.client.ui.layout.VAlign
 import ai.kilocode.client.ui.layout.align
 import ai.kilocode.cli.KiloCliParser
 import ai.kilocode.log.KiloLog
+import com.intellij.openapi.actionSystem.DataSink
+import com.intellij.openapi.actionSystem.UiDataProvider
 import com.intellij.openapi.Disposable
 import com.intellij.openapi.editor.EditorFactory
 import com.intellij.openapi.fileTypes.PlainTextFileType
@@ -164,10 +167,14 @@ class ToolBody private constructor(
     fun register(selection: SessionSelection, parent: Disposable) {
         val field = ed
         if (field != null) {
+            (field as? ToolField)?.selection = selection
             selection.register(field, parent)
             return
         }
-        area?.let { selection.register(it, parent) }
+        area?.let {
+            (it as? ToolArea)?.selection = selection
+            selection.register(it, parent)
+        }
     }
 
     @RequiresEdt
@@ -233,7 +240,7 @@ class ToolBody private constructor(
             return body
         }
 
-        private fun area(tool: Tool, wrap: Boolean) = JBTextArea().apply {
+        private fun area(tool: Tool, wrap: Boolean) = ToolArea().apply {
             isEditable = false
             caret.isVisible = false
             caret.isSelectionVisible = true
@@ -272,13 +279,29 @@ class ToolBody private constructor(
     }
 }
 
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt
index 97324bccd..1f0486552 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt
@@ -8,6 +8,8 @@ import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionUiStyle
 import ai.kilocode.client.session.views.base.SecondarySessionPartView
 import ai.kilocode.client.ui.UiStyle
+import com.intellij.openapi.actionSystem.DataSink
+import com.intellij.openapi.actionSystem.UiDataProvider
 import com.intellij.openapi.util.Disposer
 import com.intellij.util.concurrency.annotations.RequiresEdt
 import com.intellij.util.ui.JBUI
@@ -19,7 +21,7 @@ class ToolView(
     tool: Tool,
     private val selection: SessionSelection? = null,
     private val parts: ToolParts = toolParts(tool, mode = ToolBodyMode.EDITOR),
-) : SecondarySessionPartView(parts.header, { parts.scroll(tool) }) {
+) : SecondarySessionPartView(parts.header, { parts.scroll(tool) }), UiDataProvider {
 
     override val contentId: String = tool.id
 
@@ -34,6 +36,12 @@ class ToolView(
         sync()
     }
 
+    override fun uiDataSnapshot(sink: DataSink) {
+        selection?.provideCopy(sink) { parts.content?.text ?: fallbackText() }
+    }
+
+    private fun fallbackText() = listOf(commandText(), outputText()).filter { it.isNotBlank() }.joinToString("\n\n")
+
     @RequiresEdt
     override fun expand(): Boolean {
         val changed = super.expand()
```


## opencode Changes (85a7929..ec50db3)

### Commits

- ec50db3 - fix(opencode): pass configured headers to Copilot models (#32815) (Aiden Cline, 2026-06-18)
- 8716c43 - sync release versions for v1.17.8 (opencode, 2026-06-17)
- 10b6672 - go: glm 5.2 (Frank, 2026-06-17)

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
- `bun.lock` (+26, -26)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/i18n/ar.ts` (+4, -4)
- `packages/console/app/src/i18n/br.ts` (+4, -4)
- `packages/console/app/src/i18n/da.ts` (+4, -4)
- `packages/console/app/src/i18n/de.ts` (+4, -4)
- `packages/console/app/src/i18n/en.ts` (+4, -4)
- `packages/console/app/src/i18n/es.ts` (+4, -4)
- `packages/console/app/src/i18n/fr.ts` (+4, -4)
- `packages/console/app/src/i18n/it.ts` (+4, -4)
- `packages/console/app/src/i18n/ja.ts` (+4, -4)
- `packages/console/app/src/i18n/ko.ts` (+4, -4)
- `packages/console/app/src/i18n/no.ts` (+4, -4)
- `packages/console/app/src/i18n/pl.ts` (+4, -4)
- `packages/console/app/src/i18n/ru.ts` (+4, -4)
- `packages/console/app/src/i18n/th.ts` (+4, -4)
- `packages/console/app/src/i18n/tr.ts` (+4, -4)
- `packages/console/app/src/i18n/uk.ts` (+4, -4)
- `packages/console/app/src/i18n/zh.ts` (+4, -4)
- `packages/console/app/src/i18n/zht.ts` (+4, -4)
- `packages/console/app/src/routes/go/index.tsx` (+2, -2)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -1)
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
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+1, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+6, -6)
- `packages/web/src/content/docs/bs/go.mdx` (+6, -6)
- `packages/web/src/content/docs/da/go.mdx` (+6, -6)
- `packages/web/src/content/docs/de/go.mdx` (+6, -6)
- `packages/web/src/content/docs/es/go.mdx` (+6, -6)
- `packages/web/src/content/docs/fr/go.mdx` (+6, -6)
- `packages/web/src/content/docs/go.mdx` (+6, -6)
- `packages/web/src/content/docs/it/go.mdx` (+6, -6)
- `packages/web/src/content/docs/ja/go.mdx` (+6, -6)
- `packages/web/src/content/docs/ko/go.mdx` (+6, -6)
- `packages/web/src/content/docs/nb/go.mdx` (+6, -6)
- `packages/web/src/content/docs/pl/go.mdx` (+6, -6)
- `packages/web/src/content/docs/pt-br/go.mdx` (+6, -6)
- `packages/web/src/content/docs/ru/go.mdx` (+6, -6)
- `packages/web/src/content/docs/th/go.mdx` (+6, -6)
- `packages/web/src/content/docs/tr/go.mdx` (+6, -6)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+6, -6)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+6, -6)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index c0639dc..b5e95fa 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.7",
+  "version": "1.17.8",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index bafccf4..26449b5 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.17.7",
+  "version": "1.17.8",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index 631a845..2dcfd54 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.17.7",
+  "version": "1.17.8",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/models.ts
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
- `src/tool/ToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt changes
