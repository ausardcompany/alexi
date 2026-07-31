# Upstream Changes Report
Generated: 2026-07-31 08:50:05

## Summary
- kilocode: 146 commits, 377 files changed
- opencode: 27 commits, 177 files changed

## kilocode Changes (3b8bd23e1..7cbe92e39)

### Commits

- 7cbe92e39 - Merge pull request #12644 from Kilo-Org/chore/jetbrains-cli-pin-v7.4.17 (Kirill Kalishev, 2026-07-30)
- 9837b4d63 - fix(docs-sync): intercept revert PRs and calibrate prompts (#12708) (Igor Šćekić, 2026-07-30)
- e959534ad - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-30)
- 2ef92e2e3 - Merge pull request #12700 from Kilo-Org/equable-stinger (Christiaan Arnoldus, 2026-07-30)
- 52e17568e - Merge branch 'main' into equable-stinger (Christiaan Arnoldus, 2026-07-30)
- e07d7d461 - docs: refresh stale schema comments (Christiaan Arnoldus, 2026-07-30)
- 9245279de - fix: match hyphenated rate-limit prose in retry heuristics (Christiaan Arnoldus, 2026-07-30)
- a7d72e257 - Merge pull request #12703 from Kilo-Org/feat/agent-manager-setup-terminal (Marius, 2026-07-30)
- 762367652 - Merge branch 'main' into feat/agent-manager-setup-terminal (Marius, 2026-07-30)
- 5c140b12c - feat(agent-manager): key diff review by selection with per-session scope (#12709) (Marius, 2026-07-30)
- 59bfcfd38 - test(agent-manager): cover multi-project setup terminals (marius-kilocode, 2026-07-30)
- 1856f20ba - refactor(agent-manager): extract setup panel predicates (marius-kilocode, 2026-07-30)
- e4a739a0b - chore(agent-manager): keep provider within size cap (marius-kilocode, 2026-07-30)
- 5076b6297 - feat(agent-manager): run setup scripts in panel terminal (marius-kilocode, 2026-07-30)
- 411f28f11 - fix: accept null error fields and narrow message retry heuristics (Christiaan Arnoldus, 2026-07-30)
- 166d04e84 - Merge pull request #12566 from Kilo-Org/abalone-bactrosaurus (Marius, 2026-07-30)
- 31d844a70 - fix: keep stream error retryability on par with previous heuristics (Christiaan Arnoldus, 2026-07-30)
- 677b315cb - refactor: parse stream error frames with zod (Christiaan Arnoldus, 2026-07-30)
- 97792169e - fix: cover envelope-less stream error shapes and unlisted codes (Christiaan Arnoldus, 2026-07-30)
- 6a0482d1f - Merge remote-tracking branch 'origin/abalone-bactrosaurus' into abalone-bactrosaurus (marius-kilocode, 2026-07-30)
- 52447ed2a - fix(agent-manager): scope run-script state to the owning project (marius-kilocode, 2026-07-30)
- 861e2e5bd - fix: render responses stream failure frames as clean provider errors (Christiaan Arnoldus, 2026-07-30)
- 0d923d0ef - fix(memory): accept extra digest fields (#12675) (Hardik Sharma, 2026-07-30)
- 1d1630b34 - fix(cli): settle signal-terminated shell commands as 128 + signum (#12698) (Marius, 2026-07-30)
- 0e3ce1186 - fix: align ai core with provider packages in lockstep, drop bedrock bump (Christiaan Arnoldus, 2026-07-30)
- 1836c1d57 - Merge pull request #12576 from Kilo-Org/docs/nvidia-byok-provider (Joshua Lambert, 2026-07-30)
- 0bcb019ce - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-07-30)
- 9fbe50243 - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-07-30)
- f69542532 - fix: surface provider error details from Responses API stream failures (Christiaan Arnoldus, 2026-07-30)
- 7fcdd110c - Merge branch 'main' into abalone-bactrosaurus (Marius, 2026-07-30)
- af6bb00ee - fix(agent-manager): align Cmd+/ fallback with platform binding and one-shot echo (#12694) (Marius, 2026-07-30)
- fcbb0ccfc - Merge pull request #12696 from Kilo-Org/tabby-modem (Marius, 2026-07-30)
- ff7fdf65b - fix(agent-manager): preserve diff watch mode across base changes (marius-kilocode, 2026-07-30)
- 5e283d625 - Merge pull request #12693 from Kilo-Org/grape-airedale (Marius, 2026-07-30)
- 1511eb641 - Merge pull request #12604 from Kilo-Org/feat/execute-cmds-in-skill-context (bagatao@anaconda.com, 2026-07-30)
- a2b22d07c - fix(agent-manager): propagate base branch override to active diff source (marius-kilocode, 2026-07-30)
- 1cd81a9e1 - fix(agent-manager): open terminal when switching worktrees (#12689) (Marius, 2026-07-30)
- e0d42fc5e - fix(core): re-check models.dev cache under the flock before refetching (marius-kilocode, 2026-07-30)
- 1e2a7f17d - fix(agent-manager): align panel terminal tabs with session tabs (marius-kilocode, 2026-07-30)
- d16b6daec - Merge remote-tracking branch 'origin/main' into abalone-bactrosaurus (marius-kilocode, 2026-07-30)
- 70eeaff38 - Merge pull request #12684 from Kilo-Org/gilded-impulse (Christiaan Arnoldus, 2026-07-30)
- 22ca04168 - Merge pull request #12692 from Kilo-Org/fix/vscode-past-chats-worktree-family (Marius, 2026-07-30)
- 301c14e55 - fix(agent-manager): make Cmd+/ terminal toggle reliable and sidebar-safe (#12691) (Marius, 2026-07-30)
- faf0236ca - fix(vscode): list past chats across the worktree family (marius-kilocode, 2026-07-30)
- bd0d1f08a - Merge pull request #12369 from Kilo-Org/feat/websearch-config-setting (Joshua Lambert, 2026-07-30)
- 759139d61 - Merge pull request #12682 from Kilo-Org/improve-kilo-cli-startup-performance (Marius, 2026-07-30)
- db74ede20 - Merge pull request #12664 from Kilo-Org/session/agent_b2f0c1c4-9afa-4394-af1b-d1fe60d6a632 (Emilie Lima Schario, 2026-07-30)
- cc082a76d - Merge pull request #12680 from Kilo-Org/move-run-capability-to-agent-manager-terminal (Marius, 2026-07-30)
- 4c0fcb0b4 - Merge pull request #12687 from Kilo-Org/yielding-newsboy (Marius, 2026-07-30)
- 91245aff1 - Merge pull request #12500 from sodiumsun/docs/add-mixlayer-provider (Joshua Lambert, 2026-07-30)
- 6f9ee943d - Merge pull request #12599 from Kilo-Org/remove-unused-cli-code (Marius, 2026-07-30)
- 85f4c0a33 - chore(cli): drop accidentally committed local tui state (marius-kilocode, 2026-07-30)
- 280c1176b - fix(cli): stop HttpApi exerciser hanging on blocking auth probes (marius-kilocode, 2026-07-30)
- b69f8e6a2 - Merge remote-tracking branch 'origin/main' into feat/execute-cmds-in-skill-context (Bruno Agatao, 2026-07-30)
- e19c4c77d - refactor(tui): extract skill-shell prompt presentation into kilocode (Bruno Agatao, 2026-07-30)
- 624b5890f - fix(cli): remove unset config keys from every layered config file (marius-kilocode, 2026-07-30)
- e60b06e13 - style: wrap config context import for prettier (marius-kilocode, 2026-07-30)
- b704f46ef - refactor(cli): move ACP skill-shell prompt presentation into kilocode (Bruno Agatao, 2026-07-30)
- 189d73443 - refactor(cli): move remote-skill path validation into kilocode (Bruno Agatao, 2026-07-30)
- e16350dc4 - Merge branch 'main' into feat/websearch-config-setting (Joshua Lambert, 2026-07-30)
- 11a011e97 - refactor(agent-manager): extract multi-version creation into its own module (marius-kilocode, 2026-07-30)
- 3e62398f4 - docs: link sidebar parity tracking issues from shipping gaps (marius-kilocode, 2026-07-30)
- a282a149e - fix(agent-manager): keep provider below size cap (marius-kilocode, 2026-07-30)
- a6f6655c5 - fix(agent-manager): address run terminal review findings (marius-kilocode, 2026-07-30)
- c1de91aec - fix(cli): address review feedback on startup changes (marius-kilocode, 2026-07-30)
- d7f8da917 - fix(core): include underlying reason in ripgrep execution failures (Christiaan Arnoldus, 2026-07-30)
- 3a829f5ef - chore: remove implementation plan (marius-kilocode, 2026-07-30)
- 9ab316e72 - test(telemetry): assert profile cache file mode only on POSIX (marius-kilocode, 2026-07-30)
- ed9e132bd - fix(cli): reduce startup time by deferring Kilo module loading and telemetry work (marius-kilocode, 2026-07-30)
- 878afffe4 - Merge pull request #12681 from Kilo-Org/plan-agent-manager-diff-viewer-integration (Marius, 2026-07-30)
- cd1b4e8b6 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-30)
- 4c4fbc1fa - fix(i18n): add Persian Agent Manager diff tooltip (marius-kilocode, 2026-07-30)
- c038ce8d6 - Merge remote-tracking branch 'origin/main' into plan-agent-manager-diff-viewer-integration (marius-kilocode, 2026-07-30)
- fad011b45 - chore: remove Agent Manager diff implementation plan (marius-kilocode, 2026-07-30)
- c94d6645a - fix(agent-manager): compact diff review controls (marius-kilocode, 2026-07-30)
- 401691923 - fix(agent-manager): route run through terminal dropdown (marius-kilocode, 2026-07-30)
- f0d2c8ffc - fix(vscode): improve long-session prompt navigation (#12656) (Marius, 2026-07-30)
- 9bbf2dab1 - refactor(agent-manager): move project domain into src/agent-manager/project (marius-kilocode, 2026-07-30)
- 22d1a506f - feat(agent-manager): add run terminal destination setting (marius-kilocode, 2026-07-30)
- 49223b3ad - feat(agent-manager): run project scripts in the embedded side terminal (marius-kilocode, 2026-07-30)
- f42ac42fe - Merge branch 'main' into docs/add-mixlayer-provider (Joshua Lambert, 2026-07-29)
- 2d2b73d74 - docs: remove stale limit.output reference in tips (Kelly Sun, 2026-07-29)
- 21263db2c - docs: fix intro to reference built-in provider (not OpenAI Compatible) (Kelly Sun, 2026-07-29)
- ddd3557bf - docs: address review - use built-in Mixlayer provider + /connect (Kelly Sun, 2026-07-29)
- 3a2309cff - fix(vscode): clarify web search config scope (Josh Lambert, 2026-07-29)
- 623cba4b9 - Merge remote-tracking branch 'origin/main' into feat/websearch-config-setting (Josh Lambert, 2026-07-29)
- cf9c9dc34 - docs(kilo-docs): fold orphaned skills bullet into paragraph (kiloconnect[bot], 2026-07-29)
- 0912f94cb - docs(kilo-docs): rewrite skill archive bullet as prose (kiloconnect[bot], 2026-07-29)
- eeb8c40af - docs(kilo-docs): add CLI usage section for Cloud Agents (emilieschario, 2026-07-29)
- 2da0517e3 - chore(cli): annotate skill download changes with kilocode_change markers (Bruno Agatao, 2026-07-29)
- b29bb9560 - Merge remote-tracking branch 'origin/main' into feat/execute-cmds-in-skill-context (Bruno Agatao, 2026-07-29)
- 6e46b809b - fix(cli): honor the kill-switch for skill slash-command shell (Bruno Agatao, 2026-07-29)
- 8205f353f - fix(cli): tighten skill shell execution and prompt-display bounds (Bruno Agatao, 2026-07-29)
- 3e7850b97 - Merge remote-tracking branch 'origin/main' into abalone-bactrosaurus (marius-kilocode, 2026-07-29)
- da328dfd8 - fix(cli): validate and origin-pin remote skill downloads (Bruno Agatao, 2026-07-29)
- 70f6271a2 - fix(cli): drop trust for skills symlinked into the project (Bruno Agatao, 2026-07-29)
- 572d8fdfd - fix(cli): let human surfaces approve skill shell batches (Bruno Agatao, 2026-07-29)
- 6b1b017e5 - fix(cli): resolve a parseable shell for skill command injection (Bruno Agatao, 2026-07-29)
- 6497a8dcb - fix(cli): fail closed when a skill batch has no authorizable commands (Bruno Agatao, 2026-07-29)
- 3655be492 - fix(cli): authorize verbatim skill commands to block cd-chained escapes (Bruno Agatao, 2026-07-29)
- 1ed1a4849 - fix(cli): display verbatim skill commands in the permission prompt (Bruno Agatao, 2026-07-29)
- 74a30e017 - Merge branch 'main' into plan-agent-manager-diff-viewer-integration (marius-kilocode, 2026-07-29)
- 5b5f96a52 - Merge branch 'main' into remove-unused-cli-code (Marius, 2026-07-29)
- 3ab1122e0 - feat(agent-manager): add diff scope selector and base branch picker (marius-kilocode, 2026-07-29)
- 83914ddc4 - chore(jetbrains): bump CLI pin to v7.4.17 (kilo-maintainer[bot], 2026-07-29)
- a86eb583f - Merge remote-tracking branch 'origin/main' into feat/execute-cmds-in-skill-context (Bruno Agatao, 2026-07-29)
- 9275fa419 - test(vscode): expect interactive flag in permission reply assertions (Bruno Agatao, 2026-07-29)
- 3877da6c2 - Merge branch 'main' into feat/execute-cmds-in-skill-context (bagatao@anaconda.com, 2026-07-29)
- 8f4725729 - fix(cli): harden skill shell permission prompt display (Bruno Agatao, 2026-07-29)
- 2d8377894 - fix(cli): bound skill shell execution (cwd, abort, timeout, output cap) (Bruno Agatao, 2026-07-29)
- 3cef158ef - fix(cli): confine downloaded skills to the cache directory (Bruno Agatao, 2026-07-29)
- cd266e8e5 - fix(cli): show skill shell commands in ACP permission prompts (Bruno Agatao, 2026-07-29)
- c74d448ff - fix(cli): apply skill trust to slash-command shell execution (Bruno Agatao, 2026-07-29)
- c2f2831bd - fix(cli): decompose skill shell commands for per-command permission checks (Bruno Agatao, 2026-07-29)
- e7a7478b3 - fix(cli): keep deny rules terminal for skill shell command batches (Bruno Agatao, 2026-07-29)
- 0c417acfa - chore(sdk): regenerate for permission reply interactive flag (Bruno Agatao, 2026-07-29)
- 7650d0fd0 - fix(cli): require human approval for skill shell command batches (Bruno Agatao, 2026-07-29)
- e80b3b2b0 - Merge branch 'main' into remove-unused-cli-code (Marius, 2026-07-29)
- 6617b2433 - refactor(agent-manager): consolidate lifecycle deps into ctx plus a capability host (marius-kilocode, 2026-07-29)
- 2d784a0e3 - chore(cli): add changeset for skill shell execution (Bruno Agatao, 2026-07-28)
- c08f37e88 - feat(cli): execute shell commands in skill files with batch approval (Bruno Agatao, 2026-07-28)
- c271a8ea5 - refactor(agent-manager): write state payloads into their own project store (marius-kilocode, 2026-07-28)
- 1064ce997 - refactor(agent-manager): per-project stores own sidebar state (marius-kilocode, 2026-07-28)
- 526572c6c - Merge branch 'main' into remove-unused-cli-code (marius-kilocode, 2026-07-28)
- b0a546049 - refactor(cli): remove provably unused kilocode code (marius-kilocode, 2026-07-28)
- f6a172535 - refactor(agent-manager): per-project stores for local tabs and tab memory (marius-kilocode, 2026-07-28)
- c9d59c4a8 - refactor(agent-manager): extract project state router and selection modules (marius-kilocode, 2026-07-28)
- 2108dc588 - fix(agent-manager): isolate local tabs per project and open clicked sessions (marius-kilocode, 2026-07-28)
- 2dba76605 - docs: fix typo in NVIDIA BYOK note (Josh Lambert, 2026-07-28)
- ae28bad7a - fix(agent-manager): apply selection acks before the state push catches up (marius-kilocode, 2026-07-28)
- d34bf88ab - Merge remote-tracking branch 'origin/abalone-bactrosaurus' into abalone-bactrosaurus (marius-kilocode, 2026-07-28)
- 827b61dee - fix(agent-manager): ignore stale project selection acknowledgements (marius-kilocode, 2026-07-28)
- 256703a37 - Merge branch 'main' into abalone-bactrosaurus (Marius, 2026-07-28)
- 8093fedfb - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-28)
- 80321b861 - fix(vscode): repair CI failures and address multi-project review findings (marius-kilocode, 2026-07-28)
- b71a9c0c2 - fix(vscode): include web search in config exports (Josh Lambert, 2026-07-27)
- 4a34d7b5d - Merge remote-tracking branch 'origin/main' into feat/websearch-config-setting (Josh Lambert, 2026-07-27)
- 605dc483e - chore(sdk): minimize web search schema diff (Josh Lambert, 2026-07-27)
- 62d290f9b - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-07-27)
- 5325cc711 - docs: add NVIDIA to BYOK providers (Josh Lambert, 2026-07-27)
- c5d303211 - fix: keep third-party web search opt-in (Josh Lambert, 2026-07-27)
- 34e787e5a - fix: enable web search by default (Josh Lambert, 2026-07-27)
- 46b7e55f8 - feat(vscode): multi-project Agent Manager with per-project state, sessions, and lifecycle (marius-kilocode, 2026-07-27)
- 25dcfb6cf - docs: add Mixlayer provider page (Kelly Sun, 2026-07-23)
- 91d87588b - fix: address web search review feedback (Josh Lambert, 2026-07-21)
- 44f13738a - feat: configure web search availability for all providers (Josh Lambert, 2026-07-18)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/registry.ts` (+2, -0)
- `packages/opencode/src/tool/shell.ts` (+18, -1)
- `packages/opencode/src/tool/skill.ts` (+27, -2)
- `packages/opencode/test/kilocode/tool/shell-signal.test.ts` (+72, -0)
- `packages/opencode/test/tool/registry.test.ts` (+45, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt` (+1, -1)
- `packages/opencode/src/kilocode/permission/drain.ts` (+2, -0)
- `packages/opencode/src/permission/index.ts` (+20, -0)
- `packages/opencode/test/kilocode/permission/skill-shell.test.ts` (+224, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+5, -5)
- `packages/core/src/cross-spawn-spawner.ts` (+2, -10)
- `packages/core/src/kilocode/exit-code.ts` (+16, -0)
- `packages/core/src/kilocode/pty/termination.ts` (+179, -0)
- `packages/core/src/models-dev.ts` (+9, -3)
- `packages/core/src/pty.ts` (+38, -25)
- `packages/core/src/ripgrep.ts` (+7, -5)
- `packages/core/src/v1/config/config.ts` (+3, -0)
- `packages/core/src/v1/permission.ts` (+2, -0)
- `packages/core/test/kilocode/exit-code.test.ts` (+30, -0)
- `packages/core/test/kilocode/pty-termination.test.ts` (+108, -0)
- `packages/core/test/pty/pty-session.test.ts` (+72, -0)
- `packages/core/test/ripgrep.test.ts` (+14, -0)

#### Other Changes
- `.changeset/agent-manager-diff-base-override.md` (+5, -0)
- `.changeset/agent-manager-diff-scope-selector.md` (+5, -0)
- `.changeset/agent-manager-multi-project.md` (+5, -0)
- `.changeset/agent-manager-session-scope-selection.md` (+5, -0)
- `.changeset/agent-manager-terminal-shortcut-focus.md` (+5, -0)
- `.changeset/agent-manager-terminal-shortcut-platform.md` (+5, -0)
- `.changeset/calm-run-terminals.md` (+5, -0)
- `.changeset/cli-startup-lazy-loading.md` (+6, -0)
- `.changeset/config-unset-propagation.md` (+5, -0)
- `.changeset/enable-websearch-config.md` (+6, -0)
- `.changeset/friendly-memories-rest.md` (+5, -0)
- `.changeset/fuzzy-otters-signal.md` (+5, -0)
- `.changeset/long-session-prompt-navigation.md` (+5, -0)
- `.changeset/past-chats-worktree-family.md` (+5, -0)
- `.changeset/quiet-terminals-switch.md` (+5, -0)
- `.changeset/responses-stream-error-details.md` (+5, -0)
- `.changeset/ripgrep-error-detail.md` (+5, -0)
- `.changeset/side-terminal-tab-parity.md` (+5, -0)
- `.changeset/skill-shell-execution.md` (+5, -0)
- `.changeset/smart-pandas-remain.md` (+5, -0)
- `.github/docs-sync/collect.mjs` (+56, -13)
- `.github/docs-sync/edit-prompt.md` (+5, -2)
- `.github/docs-sync/reverts.mjs` (+153, -0)
- `.github/docs-sync/selftest.mjs` (+422, -0)
- `.github/docs-sync/triage-prompt.md` (+2, -1)
- `.kilo/plans/agent-manager-multi-project-configuration.md` (+262, -0)
- `.kilo/plans/agent-manager-multi-project-implementation-handoff.md` (+459, -0)
- `.kilo/plans/agent-manager-multi-project-runtime.md` (+351, -0)
- `.kilo/plans/agent-manager-multi-project-shipping-gaps.md` (+210, -0)
- `.kilo/plans/agent-manager-multi-project-uniform-ui.md` (+740, -0)
- `bun.lock` (+100, -34)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/kilo-console/src/routes/config/SourcesRoute.tsx` (+5, -1)
- `packages/kilo-console/src/routes/config/ToolsRoute.tsx` (+47, -1)
- `packages/kilo-docs/lib/nav/ai-providers.ts` (+1, -0)
- `packages/kilo-docs/pages/ai-providers/mixlayer.md` (+79, -0)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+6, -2)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+11, -1)
- `packages/kilo-docs/pages/gateway/authentication.md` (+1, -0)
- `packages/kilo-docs/pages/getting-started/byok.md` (+1, -0)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+2, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-with-diffs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-many-prompts-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-wide-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-kilo-catalog-loading-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-kilo-model-preset-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-provider-blur-race-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-scope-switch-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+2, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+32, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PromptLifecycleTest.kt` (+42, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+2, -0)
- `packages/kilo-memory/src/capture/parse.ts` (+4, -6)
- `packages/kilo-memory/test/capture.test.ts` (+14, -0)
- `packages/kilo-telemetry/src/__tests__/identity.test.ts` (+89, -0)
- `packages/kilo-telemetry/src/client.ts` (+21, -0)
- `packages/kilo-telemetry/src/identity.ts` (+69, -0)
- `packages/kilo-telemetry/src/telemetry.ts` (+6, -0)
- `packages/kilo-vscode/eslint.config.mjs` (+4, -7)
- `packages/kilo-vscode/package.json` (+7, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+414, -78)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+467, -575)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+21, -9)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+38, -22)
- `packages/kilo-vscode/src/agent-manager/ScriptTerminalManager.ts` (+460, -0)
- `packages/kilo-vscode/src/agent-manager/SetupScriptRunner.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+39, -0)
- `packages/kilo-vscode/src/agent-manager/__tests__/AgentManagerProvider.spec.ts` (+6, -0)
- `packages/kilo-vscode/src/agent-manager/delete-worktree.ts` (+4, -4)
- `packages/kilo-vscode/src/agent-manager/diff-scope.ts` (+66, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+42, -0)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+5, -0)
- `packages/kilo-vscode/src/agent-manager/project/context.ts` (+230, -0)
- `packages/kilo-vscode/src/agent-manager/project/contexts.ts` (+266, -0)
- `packages/kilo-vscode/src/agent-manager/project/init.ts` (+237, -0)
- `packages/kilo-vscode/src/agent-manager/project/messages.ts` (+204, -0)
- `packages/kilo-vscode/src/agent-manager/project/paths.ts` (+80, -0)
- `packages/kilo-vscode/src/agent-manager/project/pollers.ts` (+179, -0)
- `packages/kilo-vscode/src/agent-manager/project/registry.ts` (+177, -0)
- `packages/kilo-vscode/src/agent-manager/project/route.ts` (+197, -0)
- `packages/kilo-vscode/src/agent-manager/project/scope.ts` (+15, -0)
- `packages/kilo-vscode/src/agent-manager/project/session-view.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/project/state-gate.ts` (+35, -0)
- `packages/kilo-vscode/src/agent-manager/project/wiring.ts` (+94, -0)
- `packages/kilo-vscode/src/agent-manager/provider-lifecycle.ts` (+299, -0)
- `packages/kilo-vscode/src/agent-manager/provider-multi-version.ts` (+262, -0)
- `packages/kilo-vscode/src/agent-manager/run/controller.ts` (+16, -10)
- `packages/kilo-vscode/src/agent-manager/run/destination.ts` (+16, -0)
- `packages/kilo-vscode/src/agent-manager/run/manager.ts` (+68, -22)
- `packages/kilo-vscode/src/agent-manager/run/message.ts` (+13, -3)
- `packages/kilo-vscode/src/agent-manager/run/task.ts` (+8, -0)
- `packages/kilo-vscode/src/agent-manager/script-terminal-runtime.ts` (+93, -0)
- `packages/kilo-vscode/src/agent-manager/script-terminal-url.ts` (+17, -0)
- `packages/kilo-vscode/src/agent-manager/section-handler.ts` (+15, -1)
- `packages/kilo-vscode/src/agent-manager/setup-script-task.ts` (+176, -0)
- `packages/kilo-vscode/src/agent-manager/shell-env.ts` (+9, -0)
- `packages/kilo-vscode/src/agent-manager/terminal-destination.ts` (+39, -0)
- `packages/kilo-vscode/src/agent-manager/terminal-routing.ts` (+4, -1)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+195, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+87, -1)
- `packages/kilo-vscode/src/agent-manager/worktree-diff-controller.ts` (+122, -101)
- `packages/kilo-vscode/src/diff/sources/catalog.ts` (+19, -6)
- `packages/kilo-vscode/src/diff/sources/staged.ts` (+32, -8)
- `packages/kilo-vscode/src/diff/sources/unstaged.ts` (+31, -7)
- `packages/kilo-vscode/src/diff/sources/worktree.ts` (+51, -10)
- `packages/kilo-vscode/src/diff/types.ts` (+21, -0)
- `packages/kilo-vscode/src/extension.ts` (+2, -0)
- `packages/kilo-vscode/src/indexing-consent.ts` (+109, -0)
- `packages/kilo-vscode/src/kilo-provider/config-bindings.ts` (+64, -0)
- `packages/kilo-vscode/src/kilo-provider/config-snapshot.ts` (+3, -2)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+15, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/permission-handler.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider/indexing-settings.ts` (+7, -5)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+23, -0)
- `packages/kilo-vscode/src/kilo-provider/session-search.ts` (+19, -7)
- `packages/kilo-vscode/tests/indexing-provider-blur-race.spec.ts` (+11, -2)
- `packages/kilo-vscode/tests/settings-accessibility.spec.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-ambient-setup.test.ts` (+59, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+132, -25)
- `packages/kilo-vscode/tests/unit/agent-manager-close-session.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-scope-state.test.ts` (+32, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-chrome.test.ts` (+50, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-destination.test.ts` (+14, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-side.test.ts` (+111, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-state.test.ts` (+279, -1)
- `packages/kilo-vscode/tests/unit/agent-project-contexts.test.ts` (+236, -0)
- `packages/kilo-vscode/tests/unit/agent-project-messages.test.ts` (+195, -0)
- `packages/kilo-vscode/tests/unit/agent-project-paths.test.ts` (+91, -0)
- `packages/kilo-vscode/tests/unit/agent-project-pollers.test.ts` (+175, -0)
- `packages/kilo-vscode/tests/unit/agent-project-reactivate.test.ts` (+54, -0)
- `packages/kilo-vscode/tests/unit/agent-project-registry.test.ts` (+112, -0)
- `packages/kilo-vscode/tests/unit/agent-project-restore.test.ts` (+113, -0)
- `packages/kilo-vscode/tests/unit/agent-project-route.test.ts` (+142, -0)
- `packages/kilo-vscode/tests/unit/agent-project-run-status-webview.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/agent-project-run-status.test.ts` (+91, -0)
- `packages/kilo-vscode/tests/unit/agent-project-selection-webview.test.ts` (+75, -0)
- `packages/kilo-vscode/tests/unit/agent-project-selection.test.ts` (+208, -0)
- `packages/kilo-vscode/tests/unit/agent-project-sessions.test.ts` (+436, -0)
- `packages/kilo-vscode/tests/unit/agent-project-state-router.test.ts` (+68, -0)
- `packages/kilo-vscode/tests/unit/config-bindings.test.ts` (+58, -0)
- `packages/kilo-vscode/tests/unit/config-scope.test.ts` (+3, -11)
- `packages/kilo-vscode/tests/unit/diff-scope.test.ts` (+69, -0)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/git-stats-poller.test.ts` (+99, -0)
- `packages/kilo-vscode/tests/unit/indexing-consent.test.ts` (+47, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+140, -22)
- `packages/kilo-vscode/tests/unit/kilo-provider-route-integration.test.ts` (+327, -0)
- `packages/kilo-vscode/tests/unit/navigate.test.ts` (+403, -1)
- `packages/kilo-vscode/tests/unit/permission-recovery.test.ts` (+9, -3)
- `packages/kilo-vscode/tests/unit/prompt-rail.test.ts` (+58, -11)
- `packages/kilo-vscode/tests/unit/run-controller.test.ts` (+83, -0)
- `packages/kilo-vscode/tests/unit/run-message.test.ts` (+75, -0)
- `packages/kilo-vscode/tests/unit/run-script-manager.test.ts` (+18, -2)
- `packages/kilo-vscode/tests/unit/run-terminal-destination.test.ts` (+14, -0)
- `packages/kilo-vscode/tests/unit/sandbox-bootstrap.test.ts` (+27, -17)
- `packages/kilo-vscode/tests/unit/script-terminal-manager.test.ts` (+492, -0)
- `packages/kilo-vscode/tests/unit/session-search.test.ts` (+115, -0)
- `packages/kilo-vscode/tests/unit/setup-script-task.test.ts` (+388, -0)
- `packages/kilo-vscode/tests/unit/worktree-diff-controller.test.ts` (+120, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+740, -942)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+39, -17)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+7, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectActions.tsx` (+96, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectBranchDialog.tsx` (+73, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+225, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+269, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsSection.tsx` (+102, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+462, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/TabBar.tsx` (+279, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/UnassignedSessionsSection.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager-review.css` (+10, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+220, -24)
- `packages/kilo-vscode/webview-ui/agent-manager/apply-to-local.tsx` (+10, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-review-scope.ts` (+136, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-scope-state.ts` (+106, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/navigate.ts` (+93, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project-nav.ts` (+146, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/live.ts` (+82, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/local-tabs.ts` (+51, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/registry.ts` (+68, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/restore.ts` (+64, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/run-status.ts` (+18, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/selection.ts` (+66, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/sessions-live.ts` (+43, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/state.ts` (+56, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/store.ts` (+128, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/revert-file.ts` (+12, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/selection-actions.ts` (+74, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/sidebar-search.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SideTerminalPanel.tsx` (+122, -47)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SortableTerminalTab.tsx` (+65, -24)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+30, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/ambient.ts` (+82, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/chrome.ts` (+42, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/index.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/side.ts` (+64, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/state.ts` (+212, -14)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-diffs.ts` (+28, -9)
- `packages/kilo-vscode/webview-ui/diff-viewer/BaseBranchPicker.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffScopeControls.tsx` (+80, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+26, -2)
- `packages/kilo-vscode/webview-ui/diff-viewer/InlineSelect.tsx` (+127, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+125, -12)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptRail.tsx` (+234, -51)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionMentionPicker.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-rail.ts` (+54, -8)
- `packages/kilo-vscode/webview-ui/src/components/settings/BrowserTab.tsx` (+102, -31)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+14, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/IndexingTab.tsx` (+110, -41)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+117, -39)
- `packages/kilo-vscode/webview-ui/src/context/indexing.tsx` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+4, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+12, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+13, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+13, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+152, -1)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+30, -3)
- `packages/kilo-vscode/webview-ui/src/styles/banners.css` (+113, -6)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-dropdowns.css` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-rail.css` (+85, -2)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+127, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/sessions.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+132, -1)
- `packages/kilo-vscode/webview-ui/src/utils/config-scope.ts` (+0, -22)
- `packages/kilo-vscode/webview-ui/src/utils/tab-widths.ts` (+8, -2)
- `packages/opencode/package.json` (+5, -5)
- `packages/opencode/src/acp/permission.ts` (+8, -5)
- `packages/opencode/src/cli/cmd/attach.ts` (+6, -2)
- `packages/opencode/src/cli/cmd/config.ts` (+6, -3)
- `packages/opencode/src/cli/cmd/mcp.ts` (+5, -2)
- `packages/opencode/src/cli/cmd/providers.ts` (+5, -2)
- `packages/opencode/src/cli/cmd/remote.ts` (+8, -5)
- `packages/opencode/src/cli/cmd/run.ts` (+20, -8)
- `packages/opencode/src/cli/cmd/run/footer.permission.tsx` (+3, -2)
- `packages/opencode/src/cli/cmd/run/permission.shared.ts` (+7, -4)
- `packages/opencode/src/cli/cmd/serve.ts` (+3, -3)
- `packages/opencode/src/cli/cmd/tui.ts` (+12, -8)
- `packages/opencode/src/cli/cmd/web.ts` (+2, -6)
- `packages/opencode/src/command/index.ts` (+2, -0)
- `packages/opencode/src/config/config.ts` (+19, -4)
- `packages/opencode/src/effect/runtime-flags.ts` (+1, -0)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+3, -0)
- `packages/opencode/src/kilocode/acp/permission.ts` (+16, -0)
- `packages/opencode/src/kilocode/background-process/windows-job.ts` (+0, -88)
- `packages/opencode/src/kilocode/bootstrap.ts` (+11, -8)
- `packages/opencode/src/kilocode/cli/cmd/cloud.ts` (+9, -1)
- `packages/opencode/src/kilocode/cli/cmd/console.ts` (+9, -7)
- `packages/opencode/src/kilocode/cli/cmd/daemon.ts` (+18, -8)
- `packages/opencode/src/kilocode/cli/cmd/profile.ts` (+18, -5)
- `packages/opencode/src/kilocode/cli/cmd/roll-call.ts` (+32, -7)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/prompt/vim.ts` (+0, -5)
- `packages/opencode/src/kilocode/cli/port-warning.ts` (+12, -0)
- `packages/opencode/src/kilocode/cli/setup.ts` (+28, -12)
- `packages/opencode/src/kilocode/cloud/contracts.ts` (+0, -1)
- `packages/opencode/src/kilocode/config/config.ts` (+101, -31)
- `packages/opencode/src/kilocode/config/overlay.ts` (+75, -8)
- `packages/opencode/src/kilocode/config/writer.ts` (+105, -0)
- `packages/opencode/src/kilocode/indexing.ts` (+36, -4)
- `packages/opencode/src/kilocode/plan-followup.ts` (+0, -1)
- `packages/opencode/src/kilocode/provider/error.ts` (+82, -0)
- `packages/opencode/src/kilocode/remote-attachments.ts` (+0, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/background-process.ts` (+0, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/config-console.ts` (+27, -5)
- `packages/opencode/src/kilocode/server/httpapi/groups/indexing.ts` (+17, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/session-import.ts` (+0, -7)
- `packages/opencode/src/kilocode/server/httpapi/handlers/config-console.ts` (+71, -16)
- `packages/opencode/src/kilocode/server/httpapi/handlers/indexing.ts` (+9, -1)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+0, -26)
- `packages/opencode/src/kilocode/skill/discovery-validate.ts` (+45, -0)
- `packages/opencode/src/kilocode/skill/trust.ts` (+28, -0)
- `packages/opencode/src/kilocode/skills/display.ts` (+35, -0)
- `packages/opencode/src/kilocode/skills/inject.ts` (+198, -0)
- `packages/opencode/src/kilocode/text-stream.ts` (+0, -5)
- `packages/opencode/src/provider/error.ts` (+7, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/permission.ts` (+1, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/permission.ts` (+1, -0)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+11, -3)
- `packages/opencode/src/session/prompt.ts` (+10, -1)
- `packages/opencode/src/skill/discovery.ts` (+45, -23)
- `packages/opencode/src/skill/index.ts` (+18, -7)
- `packages/opencode/test/acp/permission.test.ts` (+38, -1)
- `packages/opencode/test/cli/run/permission.shared.test.ts` (+11, -0)
- `packages/opencode/test/kilocode/acp/permission.test.ts` (+16, -0)
- `packages/opencode/test/kilocode/config/config.test.ts` (+147, -0)
- `packages/opencode/test/kilocode/indexing-startup.test.ts` (+103, -2)
- `packages/opencode/test/kilocode/provider/error.test.ts` (+168, -0)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+279, -47)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+6, -0)
- `packages/opencode/test/kilocode/skill-command-autocomplete.test.ts` (+24, -0)
- `packages/opencode/test/kilocode/skill/discovery-validate.test.ts` (+42, -0)
- `packages/opencode/test/kilocode/skills/display.test.ts` (+43, -0)
- `packages/opencode/test/kilocode/skills/inject.test.ts` (+355, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+4, -0)
- `packages/opencode/test/server/httpapi-exercise/dsl.ts` (+8, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+1, -0)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+1, -0)
- `packages/opencode/test/server/httpapi-exercise/types.ts` (+2, -0)
- `packages/opencode/test/skill/discovery.test.ts` (+36, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+46, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+90, -6)
- `packages/sdk/openapi.json` (+222, -7)
- `packages/server/src/groups/pty.ts` (+8, -1)
- `packages/server/src/handlers/pty.ts` (+7, -1)
- `packages/tui/src/routes/session/permission.tsx` (+23, -4)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index e64a66062..35301f1ac 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -85,20 +85,20 @@
     "@ai-sdk/alibaba": "1.0.17",
     "@ai-sdk/amazon-bedrock": "4.0.112",
     "@ai-sdk/anthropic": "3.0.82",
-    "@ai-sdk/azure": "3.0.49",
+    "@ai-sdk/azure": "3.0.93",
     "@ai-sdk/cerebras": "2.0.54",
     "@ai-sdk/cohere": "3.0.27",
     "@ai-sdk/deepinfra": "2.0.41",
-    "@ai-sdk/gateway": "3.0.104",
+    "@ai-sdk/gateway": "3.0.157",
     "@ai-sdk/google": "3.0.73",
     "@ai-sdk/google-vertex": "4.0.128",
     "@ai-sdk/groq": "3.0.31",
     "@ai-sdk/mistral": "3.0.27",
-    "@ai-sdk/openai": "3.0.53",
+    "@ai-sdk/openai": "3.0.88",
     "@ai-sdk/openai-compatible": "2.0.48",
     "@ai-sdk/perplexity": "3.0.26",
-    "@ai-sdk/provider": "3.0.8",
-    "@ai-sdk/provider-utils": "4.0.23",
+    "@ai-sdk/provider": "3.0.14",
+    "@ai-sdk/provider-utils": "4.0.40",
     "@ai-sdk/togetherai": "2.0.41",
     "@ai-sdk/vercel": "2.0.39",
     "@ai-sdk/xai": "3.0.102",
```

#### packages/core/src/cross-spawn-spawner.ts
```diff
diff --git a/packages/core/src/cross-spawn-spawner.ts b/packages/core/src/cross-spawn-spawner.ts
index 554bea489..0591311f1 100644
--- a/packages/core/src/cross-spawn-spawner.ts
+++ b/packages/core/src/cross-spawn-spawner.ts
@@ -4,6 +4,7 @@ import * as NodePath from "@effect/platform-node/NodePath"
 import { prepareCommand as prepareSandbox } from "@kilocode/sandbox" // kilocode_change
 import { tap as tapStdio, tapped } from "./kilocode/stdio-tap" // kilocode_change - Bun drops buffered stdio on close
 import * as SpawnValidation from "./kilocode/spawn-validation" // kilocode_change
+import { settle } from "./kilocode/exit-code" // kilocode_change - settle signal termination as 128 + signum
 import * as Deferred from "effect/Deferred"
 import * as Effect from "effect/Effect"
 import * as Exit from "effect/Exit"
@@ -441,16 +442,7 @@ export const make = Effect.gen(function* () {
             getInputFd: fd.getInputFd,
             getOutputFd: fd.getOutputFd,
             isRunning: Effect.map(Deferred.isDone(signal), (done) => !done),
-            exitCode: Effect.flatMap(Deferred.await(signal), ([code, signal]) => {
-              if (Predicate.isNotNull(code)) return Effect.succeed(ExitCode(code))
-              return Effect.fail(
-                toPlatformError(
-                  "exitCode",
-                  new Error(`Process interrupted due to receipt of signal: '${signal}'`),
-                  command,
-                ),
-              )
-            }),
+            exitCode: Effect.flatMap(Deferred.await(signal), settle), // kilocode_change - signal termination settles as 128 + signum
             kill: (opts?: ChildProcess.KillOptions) => {
               const sig = opts?.killSignal ?? "SIGTERM"
               const send = (s: NodeJS.Signals) =>
```

#### packages/core/src/kilocode/exit-code.ts
```diff
diff --git a/packages/core/src/kilocode/exit-code.ts b/packages/core/src/kilocode/exit-code.ts
new file mode 100644
index 000000000..4a4408a7b
--- /dev/null
+++ b/packages/core/src/kilocode/exit-code.ts
@@ -0,0 +1,16 @@
+import { constants } from "node:os"
+import * as Effect from "effect/Effect"
+import * as Predicate from "effect/Predicate"
+import { ExitCode } from "effect/unstable/process/ChildProcessSpawner"
+
+// A process terminated by a signal produces a null exit code (see the "exit"
+// event on node:child_process). Report the conventional 128 + signum code
+// (e.g. 139 for SIGSEGV) instead of failing, which left consumers like the
+// bash tool waiting on a numeric code that never arrived.
+export const settle = ([code, signal]: readonly [code: number | null, signal: NodeJS.Signals | null]) => {
+  if (Predicate.isNotNull(code)) return Effect.succeed(ExitCode(code))
+  if (Predicate.isNotNull(signal) && signal in constants.signals) {
+    return Effect.succeed(ExitCode(128 + constants.signals[signal]))
+  }
+  return Effect.succeed(ExitCode(1))
+}
```

#### packages/core/src/kilocode/pty/termination.ts
```diff
diff --git a/packages/core/src/kilocode/pty/termination.ts b/packages/core/src/kilocode/pty/termination.ts
new file mode 100644
index 000000000..bb1fd30be
--- /dev/null
+++ b/packages/core/src/kilocode/pty/termination.ts
@@ -0,0 +1,179 @@
+import { spawn } from "child_process"
+import { setTimeout as sleep } from "node:timers/promises"
+import type { Proc } from "../../pty/pty"
+import { Log } from "../../util/log"
+
+const log = Log.create({ service: "pty.termination" })
+const GRACE_MS = 200
+const SPAWN_TIMEOUT_MS = 5_000
+
+export type Process = Pick<Proc, "pid" | "onExit" | "kill">
+
+export type Runtime = {
+  readonly platform: NodeJS.Platform
+  readonly taskkill: (
+    file: string,
+    args: string[],
+    opts: { stdio: "ignore"; windowsHide: true; timeout: number },
+  ) => Promise<boolean>
+  readonly tree: () => Promise<Array<{ pid: number; parent: number }>>
+  readonly alive: (pid: number) => boolean
+  readonly signal: (pid: number, signal: "SIGTERM" | "SIGKILL") => void
+  readonly sleep: (ms: number) => Promise<void>
+}
+
+const runtime: Runtime = {
+  platform: process.platform,
+  taskkill,
+  tree,
+  alive: (pid) => {
+    try {
+      process.kill(pid, 0)
+      return true
+    } catch {
+      return false
+    }
+  },
+  signal: (pid, signal) => process.kill(pid, signal),
+  sleep,
+}
+
+function direct(proc: Process, signal?: "SIGTERM" | "SIGKILL") {
+  try {
+    proc.kill(signal)
+  } catch (err) {
```

#### packages/core/src/models-dev.ts
```diff
diff --git a/packages/core/src/models-dev.ts b/packages/core/src/models-dev.ts
index 8fff339ac..a1b9be304 100644
--- a/packages/core/src/models-dev.ts
+++ b/packages/core/src/models-dev.ts
@@ -210,13 +210,19 @@ export const layer = Layer.effect(
       if (snapshot) return snapshot
       if (Flag.KILO_DISABLE_MODELS_FETCH) return {}
       // Flock is cross-process: concurrent opencode CLIs can race on this cache file.
-      const text = yield* Effect.scoped(
+      return yield* Effect.scoped(
         Effect.gen(function* () {
           yield* Flock.effect(lockKey)
-          return yield* fetchAndWrite()
+          // kilocode_change start - re-read under the lock: a concurrent refresh
+          // may already have recovered the corrupted cache while we waited, and
+          // fetching again here would duplicate the network call.
+          const rechecked = yield* loadFromDisk
+          if (rechecked) return rechecked
+          // kilocode_change end
+          const text = yield* fetchAndWrite()
+          return JSON.parse(text) as Record<string, Provider>
         }),
       )
-      return JSON.parse(text) as Record<string, Provider>
     }).pipe(Effect.withSpan("ModelsDev.populate"), Effect.orDie)
 
     const [cachedGet, invalidate] = yield* Effect.cachedInvalidateWithTTL(populate, Duration.infinity)
```


*... and more files (showing first 5)*

## opencode Changes (f720490..14f0bf6)

### Commits

- 14f0bf6 - chore: generate (opencode-agent[bot], 2026-07-31)
- 2df47ee - deepseek v4 flash (Frank, 2026-07-31)
- ad82616 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-31)
- d4ad650 - chore: generate (opencode-agent[bot], 2026-07-31)
- 2039c90 - fix(desktop): open external links in system browser (#39820) (Luke Parker, 2026-07-31)
- da59457 - feat(go): add GPT 5.6 Luna content (#39812) (Jack, 2026-07-31)
- db4dbaa - fix(app): prevent stale session tab reads (#39767) (OpeOginni, 2026-07-31)
- d3f30df - fix(app): open legacy picker at home (#39804) (opencode-agent[bot], 2026-07-31)
- 7ea343c - fix(app): prevent file tree tab clipping (#39770) (OpeOginni, 2026-07-31)
- e024e2e - fix(app): align debug gutter text (#39782) (Luke Parker, 2026-07-31)
- ceb4890 - docs: add Modal provider setup (#39710) (Deven Navani, 2026-07-30)
- 3f239b3 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-30)
- c1ee3c6 - fix(opencode): stop MCP SSE error reconnect loops (#39697) (Aiden Cline, 2026-07-30)
- a1ab489 - fix(provider): widen interleaved reasoning fields (#39556) (opencode-agent[bot], 2026-07-30)
- 8c38d26 - sync release versions for v1.18.10 (opencode, 2026-07-30)
- a4f25a9 - fix: use OpenCode model catalog URL (#39672) (opencode-agent[bot], 2026-07-30)
- ff0382e - chore: generate (opencode-agent[bot], 2026-07-30)
- ac53806 - fix(app): repair malformed persisted tabs (#39645) (OpeOginni, 2026-07-30)
- c08350b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-30)
- c5cf416 - feat(app): fix composer attachment fades (#38547) (Aarav Sareen, 2026-07-30)
- 3dbce3d - feat(app): adds fades to file tree (#38549) (Aarav Sareen, 2026-07-30)
- a277557 - chore: generate (opencode-agent[bot], 2026-07-30)
- 005bf08 - feat(app): fix file tree button bg (#38629) (Aarav Sareen, 2026-07-30)
- eca5e68 - feat(app): disallow duplicate attachments (#39464) (Aarav Sareen, 2026-07-30)
- 5b11635 - feat(app): always show new session button (#39520) (Aarav Sareen, 2026-07-30)
- a9eda2e - feat(app): migrate to solid-sonner (#39519) (Aarav Sareen, 2026-07-30)
- 73009f0 - feat(app): update arrow buttons in review tab top bar (#39469) (Aarav Sareen, 2026-07-30)

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
- `packages/core/src/models-dev.ts` (+10, -4)
- `packages/core/src/v1/config/provider.ts` (+8, -2)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+32, -32)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -0)
- `packages/app/package.json` (+3, -3)
- `packages/app/src/components/debug-bar.tsx` (+36, -18)
- `packages/app/src/components/dialog-connect-provider.tsx` (+13, -9)
- `packages/app/src/components/dialog-custom-provider.tsx` (+3, -3)
- `packages/app/src/components/dialog-select-directory.tsx` (+2, -2)
- `packages/app/src/components/dialog-usage-exceeded.tsx` (+1, -1)
- `packages/app/src/components/external-link.tsx` (+21, -0)
- `packages/app/src/components/link.tsx` (+0, -26)
- `packages/app/src/components/prompt-input-v2.tsx` (+1, -0)
- `packages/app/src/components/session/session-header.tsx` (+6, -6)
- `packages/app/src/components/settings-general.tsx` (+2, -2)
- `packages/app/src/components/settings-v2/general.tsx` (+3, -3)
- `packages/app/src/components/terminal.tsx` (+5, -1)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+3, -2)
- `packages/app/src/components/titlebar.tsx` (+19, -21)
- `packages/app/src/components/windows-app-menu.tsx` (+1, -1)
- `packages/app/src/context/notification.tsx` (+8, -3)
- `packages/app/src/context/platform.tsx` (+7, -13)
- `packages/app/src/context/tab-migration.ts` (+23, -0)
- `packages/app/src/context/tabs.test.ts` (+18, -0)
- `packages/app/src/context/tabs.tsx` (+2, -7)
- `packages/app/src/entry.tsx` (+9, -16)
- `packages/app/src/i18n/ar.ts` (+1, -0)
- `packages/app/src/i18n/br.ts` (+1, -0)
- `packages/app/src/i18n/bs.ts` (+1, -0)
- `packages/app/src/i18n/da.ts` (+1, -0)
- `packages/app/src/i18n/de.ts` (+1, -0)
- `packages/app/src/i18n/en.ts` (+1, -0)
- `packages/app/src/i18n/es.ts` (+1, -0)
- `packages/app/src/i18n/fr.ts` (+1, -0)
- `packages/app/src/i18n/ja.ts` (+1, -0)
- `packages/app/src/i18n/ko.ts` (+1, -0)
- `packages/app/src/i18n/no.ts` (+1, -0)
- `packages/app/src/i18n/pl.ts` (+1, -0)
- `packages/app/src/i18n/ru.ts` (+1, -0)
- `packages/app/src/i18n/th.ts` (+1, -0)
- `packages/app/src/i18n/tr.ts` (+1, -0)
- `packages/app/src/i18n/uk.ts` (+1, -0)
- `packages/app/src/i18n/zh.ts` (+1, -0)
- `packages/app/src/i18n/zht.ts` (+1, -0)
- `packages/app/src/index.ts` (+0, -1)
- `packages/app/src/pages/directory-layout.tsx` (+1, -0)
- `packages/app/src/pages/error.tsx` (+1, -1)
- `packages/app/src/pages/home/home-projects-controller.tsx` (+1, -1)
- `packages/app/src/pages/layout-new.tsx` (+0, -4)
- `packages/app/src/pages/layout.tsx` (+7, -10)
- `packages/app/src/pages/new-session/new-session-view.tsx` (+2, -2)
- `packages/app/src/pages/session/session-side-panel.tsx` (+6, -4)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+1, -1)
- `packages/app/src/utils/notification-click.test.ts` (+0, -27)
- `packages/app/src/utils/notification-click.ts` (+0, -13)
- `packages/app/src/utils/toast.tsx` (+15, -2)
- `packages/app/test-browser/prompt-attachments.test.ts` (+85, -0)
- `packages/app/test-browser/toast-owner.test.ts` (+39, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/cli/script/generate.ts` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/i18n/ar.ts` (+8, -8)
- `packages/console/app/src/i18n/br.ts` (+8, -8)
- `packages/console/app/src/i18n/da.ts` (+8, -8)
- `packages/console/app/src/i18n/de.ts` (+8, -8)
- `packages/console/app/src/i18n/en.ts` (+8, -8)
- `packages/console/app/src/i18n/es.ts` (+8, -8)
- `packages/console/app/src/i18n/fr.ts` (+8, -8)
- `packages/console/app/src/i18n/it.ts` (+8, -8)
- `packages/console/app/src/i18n/ja.ts` (+8, -8)
- `packages/console/app/src/i18n/ko.ts` (+8, -8)
- `packages/console/app/src/i18n/no.ts` (+8, -8)
- `packages/console/app/src/i18n/pl.ts` (+8, -8)
- `packages/console/app/src/i18n/ru.ts` (+8, -8)
- `packages/console/app/src/i18n/th.ts` (+8, -8)
- `packages/console/app/src/i18n/tr.ts` (+8, -8)
- `packages/console/app/src/i18n/uk.ts` (+9, -8)
- `packages/console/app/src/i18n/zh.ts` (+8, -9)
- `packages/console/app/src/i18n/zht.ts` (+8, -9)
- `packages/console/app/src/routes/go/index.tsx` (+3, -1)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -2)
- `packages/console/app/src/routes/zen/util/handler.ts` (+16, -11)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+2, -3)
- `packages/desktop/src/main/external-url.test.ts` (+29, -0)
- `packages/desktop/src/main/external-url.ts` (+19, -0)
- `packages/desktop/src/main/index.ts` (+0, -2)
- `packages/desktop/src/main/ipc.ts` (+16, -12)
- `packages/desktop/src/main/markdown.ts` (+0, -16)
- `packages/desktop/src/main/menu.ts` (+3, -2)
- `packages/desktop/src/main/windows.ts` (+37, -1)
- `packages/desktop/src/preload/index.ts` (+2, -4)
- `packages/desktop/src/preload/types.ts` (+2, -4)
- `packages/desktop/src/renderer/index.tsx` (+10, -36)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/script/recording-cost-report.ts` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/provider/provider.ts` (+8, -3)
- `packages/opencode/test/mcp/transport.test.ts` (+38, -0)
- `packages/opencode/test/provider/provider.test.ts` (+6, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+7, -3)
- `packages/sdk/openapi.json` (+26, -6)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -2)
- `packages/session-ui/src/components/message-part.tsx` (+17, -27)
- `packages/session-ui/src/components/tool-error-card.tsx` (+6, -1)
- `packages/session-ui/src/context/data.tsx` (+4, -0)
- `packages/session-ui/src/v2/components/prompt-input/attachments.css` (+44, -0)
- `packages/session-ui/src/v2/components/prompt-input/attachments.ts` (+21, -3)
- `packages/session-ui/src/v2/components/prompt-input/index.tsx` (+11, -4)
- `packages/session-ui/src/v2/components/session-review-v2.css` (+65, -4)
- `packages/session-ui/src/v2/components/session-review-v2.tsx` (+10, -7)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/routes/model-catalog.ts` (+3, -3)
- `packages/stats/server/package.json` (+1, -1)
- `packages/storybook/.storybook/mocks/app/context/platform.ts` (+1, -4)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/v2/components/toast-v2.css` (+132, -122)
- `packages/ui/src/v2/components/toast-v2.stories.tsx` (+4, -4)
- `packages/ui/src/v2/components/toast-v2.tsx` (+204, -73)
- `packages/ui/vite.config.ts` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+8, -2)
- `packages/web/src/content/docs/ar/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/bs/go.mdx` (+8, -2)
- `packages/web/src/content/docs/bs/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/da/go.mdx` (+8, -2)
- `packages/web/src/content/docs/da/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/de/go.mdx` (+8, -2)
- `packages/web/src/content/docs/de/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/es/go.mdx` (+8, -2)
- `packages/web/src/content/docs/es/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/fr/go.mdx` (+8, -2)
- `packages/web/src/content/docs/fr/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/go.mdx` (+8, -2)
- `packages/web/src/content/docs/it/go.mdx` (+8, -2)
- `packages/web/src/content/docs/it/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ja/go.mdx` (+8, -2)
- `packages/web/src/content/docs/ja/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ko/go.mdx` (+8, -2)
- `packages/web/src/content/docs/ko/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/nb/go.mdx` (+8, -2)
- `packages/web/src/content/docs/nb/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/pl/go.mdx` (+8, -2)
- `packages/web/src/content/docs/pl/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/providers.mdx` (+24, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+8, -2)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ru/go.mdx` (+8, -2)
- `packages/web/src/content/docs/ru/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/th/go.mdx` (+8, -2)
- `packages/web/src/content/docs/th/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/tr/go.mdx` (+8, -2)
- `packages/web/src/content/docs/tr/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+8, -2)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+8, -2)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+4, -4)
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch` (+19, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index f922ab9..63ba0a5 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.9",
+  "version": "1.18.10",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index cc1f5d6..a8a5041 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.9",
+  "version": "1.18.10",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/models-dev.ts
```diff
diff --git a/packages/core/src/models-dev.ts b/packages/core/src/models-dev.ts
index 602133d..e577935 100644
--- a/packages/core/src/models-dev.ts
+++ b/packages/core/src/models-dev.ts
@@ -15,6 +15,11 @@ import { httpClient } from "./effect/app-node-platform"
 export const CatalogModelStatus = Schema.Literals(["alpha", "beta", "deprecated"])
 export type CatalogModelStatus = typeof CatalogModelStatus.Type
 
+const InterleavedField = Schema.Union([
+  Schema.Literals(["reasoning", "reasoning_content", "reasoning_text"]),
+  Schema.String,
+])
+
 const USER_AGENT = `opencode/${InstallationChannel}/${InstallationVersion}/${Flag.OPENCODE_CLIENT}`
 
 const CostTier = Schema.Struct({
@@ -71,9 +76,10 @@ export const Model = Schema.Struct({
   reasoning_options: Schema.optional(Schema.Array(ReasoningOption)),
   interleaved: Schema.optional(
     Schema.Union([
-      Schema.Literal(true),
+      Schema.Boolean,
+      InterleavedField,
       Schema.Struct({
-        field: Schema.Literals(["reasoning", "reasoning_content", "reasoning_details"]),
+        field: InterleavedField,
       }),
     ]),
   ),
@@ -151,10 +157,10 @@ const layer = Layer.effect(
       ),
     )
 
-    const source = Flag.OPENCODE_MODELS_URL || "https://models.dev"
+    const source = Flag.OPENCODE_MODELS_URL || "https://models.opencode.ai"
     const filepath = path.join(
       Global.Path.cache,
-      source === "https://models.dev" ? "models.json" : `models-${Hash.fast(source)}.json`,
+      source === "https://models.opencode.ai" ? "models.json" : `models-${Hash.fast(source)}.json`,
     )
     const ttl = Duration.minutes(5)
     const lockKey = `models-dev:${filepath}`
```

#### packages/core/src/v1/config/provider.ts
```diff
diff --git a/packages/core/src/v1/config/provider.ts b/packages/core/src/v1/config/provider.ts
index d54a3f0..f860a2b 100644
--- a/packages/core/src/v1/config/provider.ts
+++ b/packages/core/src/v1/config/provider.ts
@@ -5,6 +5,11 @@ import { PositiveInt } from "../../schema"
 
 export const ModelStatus = Schema.Literals(["alpha", "beta", "deprecated", "active"])
 
+const InterleavedField = Schema.Union([
+  Schema.Literals(["reasoning", "reasoning_content", "reasoning_text"]),
+  Schema.String,
+])
+
 export const Model = Schema.Struct({
   id: Schema.optional(Schema.String),
   name: Schema.optional(Schema.String),
@@ -16,9 +21,10 @@ export const Model = Schema.Struct({
   tool_call: Schema.optional(Schema.Boolean),
   interleaved: Schema.optional(
     Schema.Union([
-      Schema.Literal(true),
+      Schema.Boolean,
+      InterleavedField,
       Schema.Struct({
-        field: Schema.Literals(["reasoning", "reasoning_content", "reasoning_details"]),
+        field: InterleavedField,
       }),
     ]),
   ),
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index 45e6acf..c139702 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.9",
+  "version": "1.18.10",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/cross-spawn-spawner.ts
- `src/core/` - review core changes from packages/core/src/kilocode/exit-code.ts
- `src/core/` - review core changes from packages/core/src/kilocode/pty/termination.ts
- `src/core/` - review core changes from packages/core/src/models-dev.ts
- `src/core/` - review core changes from packages/core/src/pty.ts
- `src/core/` - review core changes from packages/core/src/ripgrep.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/core/` - review core changes from packages/core/src/v1/permission.ts
- `src/core/` - review core changes from packages/core/test/kilocode/exit-code.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/pty-termination.test.ts
- `src/core/` - review core changes from packages/core/test/pty/pty-session.test.ts
- `src/core/` - review core changes from packages/core/test/ripgrep.test.ts
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/drain.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/skill-shell.test.ts
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/shell-signal.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/shell-signal.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/skill.ts` - update based on kilocode packages/opencode/src/tool/skill.ts changes
