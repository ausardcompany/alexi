# Upstream Changes Report
Generated: 2026-06-17 10:58:10

## Summary
- kilocode: 157 commits, 388 files changed
- opencode: 15 commits, 104 files changed

## kilocode Changes (ca8515ade..e9894141c)

### Commits

- e9894141c - Merge pull request #11349 from Kilo-Org/shadow-rhythm (Marius, 2026-06-17)
- d190725c3 - fix(vscode): name compact settings tabs (#11348) (Marius, 2026-06-17)
- a5395a352 - fix(vscode): highlight exact changed characters in diffs (marius-kilocode, 2026-06-17)
- 632cef947 - Merge pull request #11294 from Kilo-Org/mica-potassium (Marius, 2026-06-17)
- d82982d05 - Merge pull request #11295 from Kilo-Org/quilt-asp (Marius, 2026-06-17)
- 27ac18b23 - Merge pull request #11258 from Kilo-Org/utopian-approval (Marius, 2026-06-17)
- 6cff96c2e - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-17)
- e50cd8975 - Merge pull request #11345 from Kilo-Org/chore/remove-unused-hono-zod-validator (Mark IJbema, 2026-06-17)
- fb31e56f8 - Merge pull request #11344 from Kilo-Org/chore/remove-stale-sst-env-types (Mark IJbema, 2026-06-17)
- cf94613c3 - Merge pull request #10261 from singhvishalkr/fix/7216-ime-enter-submit (Marius, 2026-06-17)
- 9a9f9ad93 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-17)
- e38c53e6e - chore(cli): remove unused @hono/zod-validator dependency (markijbema, 2026-06-17)
- 33a82f23c - chore: remove stale sst-env.d.ts artifacts (markijbema, 2026-06-17)
- b586f1a34 - Merge pull request #10993 from idreesmuhammadqazi-create/chore/remove-unused-deps (Mark IJbema, 2026-06-17)
- ed565abb8 - Merge branch 'main' into utopian-approval (Marius, 2026-06-17)
- 74c48c902 - Merge branch 'main' into quilt-asp (Marius, 2026-06-17)
- f854c920a - Merge branch 'main' into mica-potassium (Marius, 2026-06-17)
- 474171a6a - Merge pull request #10195 from truffle-dev/fix/custom-provider-picker-persists-after-add-10139 (Christiaan Arnoldus, 2026-06-17)
- fab2faea9 - Merge branch 'main' into fix/custom-provider-picker-persists-after-add-10139 (Christiaan Arnoldus, 2026-06-17)
- 0599442e0 - Merge pull request #11331 from Kilo-Org/aged-front (Marius, 2026-06-17)
- dbc3d2e88 - chore: regenerate dependency lockfile (markijbema, 2026-06-17)
- 5767094ed - Merge pull request #11339 from Kilo-Org/mark/extract-jetbrains-tests (Mark IJbema, 2026-06-17)
- c4e81f627 - Merge pull request #11309 from Kilo-Org/bead-moonstone (Mark IJbema, 2026-06-17)
- ab1e5b836 - ci: extract JetBrains test workflow (Mark IJbema, 2026-06-17)
- 0a50a5017 - Merge pull request #11182 from Kilo-Org/skinny-poetry (Marius, 2026-06-17)
- cf820cdb8 - Merge pull request #11306 from Kilo-Org/ci/use-prebuilt-jetbrains-container (Mark IJbema, 2026-06-17)
- 7849909d5 - Merge pull request #11141 from singhvishalkr/docs/agent-permission-rules (Joshua Lambert, 2026-06-16)
- df6f7d1c6 - Merge branch 'main' into docs/agent-permission-rules (Joshua Lambert, 2026-06-16)
- cb0a1ee44 - Merge branch 'main' into aged-front (Kirill Kalishev, 2026-06-16)
- c5bd1b3e0 - feat(agent-manager): add close others tab action (kirillk, 2026-06-16)
- 461c87576 - Merge pull request #11326 from Kilo-Org/briant/updateREADME (Brian Turcotte, 2026-06-16)
- d7c7b4cbd - Merge pull request #11328 from Kilo-Org/fix/composio-toolkits-link (Emilie Lima Schario, 2026-06-16)
- c763d3134 - docs: fix README badge and table formatting (Brian Turcotte, 2026-06-16)
- b3bb59c2c - fix(docs): update Composio toolkits link (Josh Lambert, 2026-06-16)
- f45003a9c - Update README.md (Brian Turcotte, 2026-06-16)
- 2673ff9ce - Revise README for improved clarity and details (Brian Turcotte, 2026-06-16)
- 93dd00b6b - Merge pull request #11262 from Kilo-Org/console-model-training-filter (Catriel Müller, 2026-06-16)
- 1321d7eb1 - Merge pull request #11318 from Kilo-Org/oceanic-angelfish (Marius, 2026-06-16)
- 76555a96e - Merge branch 'main' into bead-moonstone (Kirill Kalishev, 2026-06-16)
- eb000f3c8 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-16)
- 7f1870830 - fix(vscode): remove chat input separator (marius-kilocode, 2026-06-16)
- 0804178b9 - docs(kilo-docs): keep permission examples in precedence order (Vishal Kumar Singh, 2026-06-16)
- 1b65317fc - Merge pull request #11316 from Kilo-Org/delirious-lung (Marius, 2026-06-16)
- 5e853801c - Merge remote-tracking branch 'origin/main' into bead-moonstone (kirillk, 2026-06-16)
- 6e99eb061 - docs(kilo-docs): update Composio toolkit link (Vishal Kumar Singh, 2026-06-16)
- 0770d1d28 - docs(kilo-docs): align auto-approval examples with precedence (Vishal Kumar Singh, 2026-06-16)
- 61f2d6cee - docs(kilo-docs): clarify permission rule precedence (Vishal Kumar Singh, 2026-06-16)
- 6afe3553c - docs: clarify agent permission rules (Vishal Kumar Singh, 2026-06-16)
- 968c65105 - docs(customize): clarify agent permission rules (Vishal Kumar Singh, 2026-06-16)
- e629fd082 - Merge pull request #11313 from Kilo-Org/docs/kiloclaw-settings-linear-composio (Ligia Zanchet, 2026-06-16)
- 714f1ad4e - fix(cli): prevent tests from deleting session database (marius-kilocode, 2026-06-16)
- 4efd7baee - Merge branch 'main' into docs/kiloclaw-settings-linear-composio (Ligia Zanchet, 2026-06-16)
- 2caccfcfe - Merge pull request #11315 from Kilo-Org/puzzled-abacus (Kirill Kalishev, 2026-06-16)
- 80a54c480 - docs: rename Settings to Integrations, update Composio intro examples (kiloconnect[bot], 2026-06-16)
- f56871e49 - docs: move Tools nav section into Settings, rename to Settings Tools (kiloconnect[bot], 2026-06-16)
- b203b8ecd - fix(cli): use test instance fixture in permission override tests (kirillk, 2026-06-16)
- 087830088 - docs(kilo-docs): rename Development Tools to Settings, add Linear and Composio integration pages (kiloconnect[bot], 2026-06-16)
- 422d995c0 - Merge branch 'main' into bead-moonstone (Kirill Kalishev, 2026-06-16)
- 6c7eb360f - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-16)
- 5120e1510 - refactor(agent-manager): extract worktree header actions (marius-kilocode, 2026-06-16)
- c961f66bd - feat(agent-manager): add worktree and session search (marius-kilocode, 2026-06-16)
- f89bbe339 - test(jetbrains): tighten test UI timers (kirillk, 2026-06-16)
- 34f16a507 - Merge pull request #10091 from shssoichiro/deny-system-agents-tools (Marius, 2026-06-16)
- 5fed0d72b - Merge branch 'main' into chore/remove-unused-deps (Mark IJbema, 2026-06-16)
- 1807e2658 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-16)
- 23d60433c - test(jetbrains): inject UI timers per test (kirillk, 2026-06-16)
- 749f6655f - Merge pull request #11189 from Kilo-Org/docs/model-deep-link-protocol-handler (Joshua Lambert, 2026-06-16)
- 53102237d - Merge pull request #11293 from Kilo-Org/mark/filter-jetbrains-tests (Mark IJbema, 2026-06-16)
- 8c36dde02 - Merge pull request #11299 from Kilo-Org/mark/stabilize-session-cancellation-tests (Mark IJbema, 2026-06-16)
- 18b39abd5 - Merge pull request #11305 from Kilo-Org/shadow-pharaoh (Marius, 2026-06-16)
- 2c1a48393 - Merge pull request #11288 from Kilo-Org/mark/kilo-console-ui-boundary (Mark IJbema, 2026-06-16)
- 7abe19a6d - Merge pull request #10697 from Kilo-Org/docs/kilo-pass-links-approved-isolated (Ligia Zanchet, 2026-06-16)
- 360598c00 - Merge pull request #10699 from Kilo-Org/docs/dolthub-approved (Ligia Zanchet, 2026-06-16)
- 420a7391f - Merge pull request #10693 from Kilo-Org/docs/org-custom-modes-approved-isolated (Ligia Zanchet, 2026-06-16)
- 38f33f1a3 - ci: drop no-op docs/** filter exclusion (Mark IJbema, 2026-06-16)
- f43928aed - Merge pull request #10702 from Kilo-Org/docs/webhook-triggers-overview-approved (Ligia Zanchet, 2026-06-16)
- e1b83e13a - Merge pull request #10700 from Kilo-Org/docs/mobile-kilo-pass-link-approved (Ligia Zanchet, 2026-06-16)
- 290d5f4a1 - feat(vscode): remove dead layout setting from Display settings (#11312) (kilo-code-bot[bot], 2026-06-16)
- 650903432 - refactor: address comments (Catriel Müller, 2026-06-16)
- 11be7dda6 - Merge pull request #10929 from shssoichiro/fix/copy-command-scope (Marius, 2026-06-16)
- 017907feb - Merge remote-tracking branch 'origin/main' into skinny-poetry (marius-kilocode, 2026-06-16)
- 6291375d5 - chore: remove out-of-scope PR files (Catriel Müller, 2026-06-16)
- e02e532fa - Merge pull request #11308 from Kilo-Org/tarry-henley (Marius, 2026-06-16)
- 42627729b - fix(cli): refine shared index concurrency (marius-kilocode, 2026-06-16)
- 0e2132f36 - fix: file diff loading (Catriel Müller, 2026-06-16)
- b5df14024 - fix: fix persistence of sidebar width (Catriel Müller, 2026-06-16)
- 2ee379a19 - refactor: kilo-web-ui export required ui components (Catriel Müller, 2026-06-16)
- c68dbc952 - refactor(kilo-console): use Kilo UI boundary (markijbema, 2026-06-16)
- 8824fa0b3 - fix: restore @opencode-ai/ui in kilo-console — it is actively imported (Z User, 2026-06-16)
- 0155b4961 - test(jetbrains): make UI timers static (kirillk, 2026-06-16)
- d319f7468 - test(jetbrains): add fakeable UI timers (kirillk, 2026-06-16)
- b4b445cb9 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-16)
- d56bfdd9a - feat(vscode): align chat content in readable lane (marius-kilocode, 2026-06-16)
- 9240b506d - test(cli): stabilize hosted timeout coverage (marius-kilocode, 2026-06-16)
- 4a0117500 - ci: annotate containers.yml branch change with kilocode_change (markijbema, 2026-06-16)
- 5686915e0 - ci: add jetbrains container image and fix containers.yml trigger (markijbema, 2026-06-16)
- 3a360a895 - test(cli): replace remaining wall-clock sleeps in prompt tests (Mark IJbema, 2026-06-16)
- 04ed322aa - fix(cli): clean up slow snapshot progress (marius-kilocode, 2026-06-16)
- e49e5fef2 - ci: keep existing VS Code path filters (Mark IJbema, 2026-06-16)
- 2f8f652e0 - Merge pull request #11302 from Kilo-Org/fix/vscode-code-edit-block-flicker (Marius, 2026-06-16)
- 1bffc5337 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-16)
- ac1f0c8bd - chore(vscode): format speech model selector (marius-kilocode, 2026-06-16)
- e50bb7d1d - refactor(vscode): simplify speech state lookups (marius-kilocode, 2026-06-16)
- 2fa089092 - fix(vscode): restore speech input availability (marius-kilocode, 2026-06-16)
- c734bb162 - Delete .changeset/steady-code-edit-blocks.md (Marius, 2026-06-16)
- 87157ae99 - fix(vscode): stabilize expanded edit blocks (marius-kilocode, 2026-06-16)
- 327eddb19 - Merge pull request #11080 from Githubguy132010/codex/add-default-diff-expansion-setting (Mark IJbema, 2026-06-16)
- c1865af86 - Merge pull request #11201 from shssoichiro/agent-descriptions (Mark IJbema, 2026-06-16)
- dca49f29b - chore(ci): mark VS Code workflow as Kilo-only (Mark IJbema, 2026-06-16)
- d82649a07 - Merge branch 'main' into chore/remove-unused-deps (Mark IJbema, 2026-06-16)
- df34a3644 - fix: restore storybook addons and revert knip workaround per review feedback (Z User, 2026-06-16)
- 670f2fad3 - test(cli): remove session cancellation timing races (markijbema, 2026-06-16)
- 3095d990b - fix(ci): let paths-filter select event base (Mark IJbema, 2026-06-16)
- 42ceb15e5 - ci: filter editor-specific test suites (Mark IJbema, 2026-06-16)
- e6d299465 - fix(ci): use built-in JetBrains change detection (Mark IJbema, 2026-06-16)
- 8b2612fa1 - ci: skip unrelated JetBrains tests (Mark IJbema, 2026-06-16)
- 8d0c7dd60 - Merge remote-tracking branch 'origin/main' into utopian-approval (marius-kilocode, 2026-06-16)
- 40ccca44a - Merge upstream/main into codex/add-default-diff-expansion-setting (Githubguy132010, 2026-06-16)
- 7a1c908d5 - fix(core): improve guidelines for `kilo agent create` (Josh Holmer, 2026-06-15)
- b1b079710 - Merge branch 'main' into docs/model-deep-link-protocol-handler (Joshua Lambert, 2026-06-15)
- 9250846de - Merge remote-tracking branch 'origin/main' into console-model-training-filter Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (chrarnoldus, 2026-06-15)
- c06539145 - Merge branch 'main' into docs/model-deep-link-protocol-handler (Joshua Lambert, 2026-06-15)
- 1c39c4416 - docs: address PR review comments on model deep link docs (kiloconnect[bot], 2026-06-15)
- 090318379 - feat(cli): expose model training filter in console (chrarnoldus, 2026-06-15)
- a081fe37f - style(vscode): format image diff translations (marius-kilocode, 2026-06-15)
- f52ffab51 - fix: restore htmlparser2 — accidentally dropped during rebase conflict (Z User, 2026-06-15)
- 148b324c9 - fix(vscode): translate image diff labels (marius-kilocode, 2026-06-15)
- 056e06911 - feat(vscode): render images in diff viewer (marius-kilocode, 2026-06-15)
- b63d43cf8 - chore: update bun.lock after rebase (Z User, 2026-06-15)
- 5135ab95c - fix: add storybook story files to knip entry points (Z User, 2026-06-15)
- 19e5d1782 - fix: remove orphaned storybook addon references from .storybook/main.ts (Z User, 2026-06-15)
- 775365991 - chore: remove 39 unused dependencies across monorepo (Z User, 2026-06-15)
- c6b335c6e - Merge remote-tracking branch 'origin/main' into skinny-poetry (marius-kilocode, 2026-06-15)
- 019270e40 - test(cli): await ordinary workspace indexing (marius-kilocode, 2026-06-15)
- bbdc1f15b - Merge remote-tracking branch 'origin/main' into skinny-poetry (marius-kilocode, 2026-06-15)
- 9498af281 - chore: merge upstream main into code edit setting (Thomas Brugman, 2026-06-13)
- d0d1eee3f - docs: document VS Code model deep link protocol handler (kiloconnect[bot], 2026-06-12)
- 258b8bae1 - style(vscode): format IME Enter guard files (Vishal Kumar Singh, 2026-06-13)
- 8efc296ae - chore(vscode): add changeset for IME Enter composition guard (Vishal Kumar Singh, 2026-06-13)
- 38e27d478 - test(webview-ui): centralize IME Enter guard and add unit tests (Vishal Kumar Singh, 2026-06-13)
- 7ada6206d - fix(webview-ui): ignore Enter during IME composition (Vishal Kumar Singh, 2026-06-13)
- 0e735ba7b - test(cli): align semantic search registry coverage (marius-kilocode, 2026-06-12)
- 6e915601b - fix(cli): stabilize shared worktree indexing (marius-kilocode, 2026-06-12)
- 973d02cfd - feat(cli): share codebase indexes across worktrees (marius-kilocode, 2026-06-12)
- 622658efa - fix(cli): restore prompt loop formatting (Thomas Brugman, 2026-06-11)
- b4aa8f1a7 - fix(cli): avoid unannotated shared formatting churn (Thomas Brugman, 2026-06-11)
- 55f163041 - Merge upstream/main into codex/add-default-diff-expansion-setting (Thomas Brugman, 2026-06-11)
- 47467425b - Merge upstream/main into codex/add-default-diff-expansion-setting (Thomas Brugman, 2026-06-10)
- e335f9785 - Add code edit block display setting (Thomas Brugman, 2026-06-10)
- be234fa92 - fix(core): always deny tool calls for system agents (Josh Holmer, 2026-06-04)
- 932968277 - ux(cli): change `/copy` command to copy last message (Josh Holmer, 2026-06-03)
- 820dfb088 - Docs: document webhook trigger overview (Evan Jacobson, 2026-05-28)
- 762c6c317 - Docs: update mobile Kilo Pass link (Evan Jacobson, 2026-05-28)
- 00882a01e - Docs: add DoltHub coverage (Evan Jacobson, 2026-05-28)
- 60b29b9bc - Docs: update Kilo Pass links (Evan Jacobson, 2026-05-28)
- 42ef313c0 - Docs: document organization custom modes (Evan Jacobson, 2026-05-28)
- 69c158f3a - fix(vscode): keep custom provider picker open after partial add (Truffle, 2026-05-13)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/registry.ts` (+22, -10)
- `packages/opencode/src/tool/registry.ts` (+12, -2)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+2, -0)
- `packages/opencode/src/agent/generate.txt` (+7, -23)
- `packages/opencode/src/kilocode/agent/index.ts` (+28, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -2)
- `packages/core/sst-env.d.ts` (+0, -10)
- `packages/kilo-indexing/src/indexing/orchestrator.ts` (+63, -8)
- `packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts` (+130, -0)

#### Other Changes
- `.changeset/calm-snapshot-spinner.md` (+5, -0)
- `.changeset/close-other-tabs.md` (+5, -0)
- `.changeset/code-edit-block-display.md` (+5, -0)
- `.changeset/copy-command-scope.md` (+5, -0)
- `.changeset/fast-monkeys-smoke.md` (+5, -0)
- `.changeset/highlight-changed-characters.md` (+5, -0)
- `.changeset/ime-enter-composition-guard.md` (+5, -0)
- `.changeset/name-compact-settings-tabs.md` (+5, -0)
- `.changeset/readable-agent-chat.md` (+5, -0)
- `.changeset/remove-chat-input-divider.md` (+5, -0)
- `.changeset/render-image-diffs.md` (+5, -0)
- `.changeset/restore-authenticated-speech-input.md` (+7, -0)
- `.changeset/search-agent-manager-sidebar.md` (+5, -0)
- `.changeset/share-worktree-indexes.md` (+6, -0)
- `.changeset/show-console-training-filter.md` (+5, -0)
- `.github/workflows/containers.yml` (+1, -1)
- `.github/workflows/test-jetbrains.yml` (+109, -0)
- `.github/workflows/test.yml` (+9, -47)
- `README.md` (+116, -91)
- `bun.lock` (+57, -458)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -7)
- `packages/containers/README.md` (+1, -0)
- `packages/containers/jetbrains/Dockerfile` (+35, -0)
- `packages/containers/script/build.ts` (+1, -1)
- `packages/http-recorder/sst-env.d.ts` (+0, -10)
- `packages/kilo-console/package.json` (+0, -1)
- `packages/kilo-console/src/client.ts` (+2, -1)
- `packages/kilo-console/src/routes/config/ModelsRoute.tsx` (+45, -0)
- `packages/kilo-console/src/routes/projects/ProjectConsoleRoute.tsx` (+38, -13)
- `packages/kilo-console/src/styles/project-console.css` (+1, -1)
- `packages/kilo-console/vite.config.ts` (+1, -1)
- `packages/kilo-docs/lib/nav/customize.ts` (+5, -0)
- `packages/kilo-docs/lib/nav/kiloclaw.ts` (+7, -12)
- `packages/kilo-docs/pages/automate/integrations.md` (+34, -4)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+43, -0)
- `packages/kilo-docs/pages/code-with-ai/features/speech-to-text.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+2, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+15, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/kilo-connect.md` (+5, -4)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+4, -0)
- `packages/kilo-docs/pages/customize/agent-permissions.md` (+189, -0)
- `packages/kilo-docs/pages/customize/custom-modes.md` (+14, -1)
- `packages/kilo-docs/pages/customize/custom-subagents.md` (+1, -1)
- `packages/kilo-docs/pages/customize/index.md` (+1, -0)
- `packages/kilo-docs/pages/getting-started/adding-credits.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/settings/auto-approving-actions.md` (+65, -11)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+12, -11)
- `packages/kilo-docs/pages/getting-started/setup-authentication.md` (+1, -1)
- `packages/kilo-docs/pages/kiloclaw/development-tools/composio.md` (+66, -0)
- `packages/kilo-docs/pages/kiloclaw/development-tools/index.md` (+10, -4)
- `packages/kilo-docs/pages/kiloclaw/development-tools/linear.md` (+64, -0)
- `packages/kilo-docs/pages/kiloclaw/triggers/index.md` (+14, -0)
- `packages/kilo-docs/pages/kiloclaw/triggers/scheduled.md` (+4, -0)
- `packages/kilo-docs/pages/kiloclaw/triggers/webhooks.md` (+4, -0)
- `packages/kilo-docs/previous-docs-redirects.js` (+6, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-1280-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-420-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/sidebar-search-open-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-multiple-tabs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-single-tab-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-with-review-tab-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-agent-manager-completed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-idle-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-1280-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-420-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-messages-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-pending-question-empty-input-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/welcome-with-switcher-and-notification-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/bash-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/chat-idle-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/glob-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-apply-patch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-bash-many-rules-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-edit-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-external-dir-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-heredoc-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-subagent-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-todo-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-websearch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-write-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/question-above-chatbox-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-accessible-labels-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-autocomplete-open-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-speech-to-text-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/settings-panel-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+0, -1)
- `packages/kilo-indexing/src/file/ignore.ts` (+2, -0)
- `packages/kilo-indexing/src/indexing/cache-manager.ts` (+36, -15)
- `packages/kilo-indexing/src/indexing/interfaces/file-processor.ts` (+3, -0)
- `packages/kilo-indexing/src/indexing/interfaces/manager.ts` (+1, -1)
- `packages/kilo-indexing/src/indexing/interfaces/vector-store.ts` (+7, -0)
- `packages/kilo-indexing/src/indexing/manager.ts` (+135, -23)
- `packages/kilo-indexing/src/indexing/processors/file-watcher.ts` (+126, -56)
- `packages/kilo-indexing/src/indexing/processors/scanner.ts` (+6, -1)
- `packages/kilo-indexing/src/indexing/search-service.ts` (+45, -1)
- `packages/kilo-indexing/src/indexing/service-factory.ts` (+3, -3)
- `packages/kilo-indexing/src/indexing/vector-store/lancedb-vector-store.ts` (+81, -48)
- `packages/kilo-indexing/src/indexing/vector-store/qdrant-client.ts` (+35, -16)
- `packages/kilo-indexing/src/indexing/worktree-overlay.ts` (+92, -0)
- `packages/kilo-indexing/test/kilocode/indexing/cache-manager.test.ts` (+26, -0)
- `packages/kilo-indexing/test/kilocode/indexing/manager.test.ts` (+88, -16)
- `packages/kilo-indexing/test/kilocode/indexing/processors/file-watcher.test.ts` (+86, -1)
- `packages/kilo-indexing/test/kilocode/indexing/processors/scanner.test.ts` (+34, -0)
- `packages/kilo-indexing/test/kilocode/indexing/search-service.test.ts` (+175, -0)
- `packages/kilo-indexing/test/kilocode/indexing/vector-store/lancedb-vector-store.test.ts` (+80, -8)
- `packages/kilo-indexing/test/kilocode/indexing/vector-store/qdrant-client.test.ts` (+74, -36)
- `packages/kilo-indexing/test/kilocode/indexing/worktree-overlay.test.ts` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionSidePanelManager.kt` (+19, -16)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+7, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUiFactory.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/DelayedState.kt` (+7, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryPanel.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/EmptySessionPanel.kt` (+5, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/LoggedOutProfileUi.kt` (+5, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/ProfileUi.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/util/UiTimers.kt` (+41, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionSidePanelManagerTest.kt` (+24, -18)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/DelayedStateTest.kt` (+18, -22)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+12, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/TestUiTimers.kt` (+81, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+1, -1)
- `packages/kilo-ui/src/pierre/index.test.ts` (+9, -0)
- `packages/kilo-ui/src/pierre/index.ts` (+3, -0)
- `packages/kilo-vscode/package.json` (+11, -5)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+21, -6)
- `packages/kilo-vscode/src/agent-manager/format-keybinding.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/local-diff.ts` (+63, -20)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+3, -0)
- `packages/kilo-vscode/src/diff/shared/image.ts` (+69, -0)
- `packages/kilo-vscode/src/diff/shared/path.ts` (+9, -0)
- `packages/kilo-vscode/src/diff/sources/git-status.ts` (+45, -12)
- `packages/kilo-vscode/src/diff/sources/session.ts` (+40, -8)
- `packages/kilo-vscode/src/diff/sources/staged.ts` (+56, -15)
- `packages/kilo-vscode/src/diff/sources/unstaged.ts` (+78, -17)
- `packages/kilo-vscode/src/diff/sources/worktree.ts` (+2, -0)
- `packages/kilo-vscode/src/diff/types.ts` (+16, -0)
- `packages/kilo-vscode/src/extension.ts` (+3, -0)
- `packages/kilo-vscode/src/provider-actions.ts` (+10, -3)
- `packages/kilo-vscode/src/review-utils.ts` (+10, -8)
- `packages/kilo-vscode/src/speech-to-text/models.ts` (+5, -5)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+58, -0)
- `packages/kilo-vscode/tests/model-selector-accessibility.spec.ts` (+7, -0)
- `packages/kilo-vscode/tests/settings-accessibility.spec.ts` (+55, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+3, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+22, -2)
- `packages/kilo-vscode/tests/unit/diff-image.test.ts` (+78, -0)
- `packages/kilo-vscode/tests/unit/diff-session-source.test.ts` (+49, -0)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+11, -0)
- `packages/kilo-vscode/tests/unit/format-keybinding.test.ts` (+9, -1)
- `packages/kilo-vscode/tests/unit/ime-enter-key.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/local-diff.test.ts` (+36, -0)
- `packages/kilo-vscode/tests/unit/provider-actions-save.test.ts` (+53, -0)
- `packages/kilo-vscode/tests/unit/review-utils.test.ts` (+29, -0)
- `packages/kilo-vscode/tests/unit/sidebar-search.test.ts` (+154, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-availability.test.ts` (+11, -8)
- `packages/kilo-vscode/tests/unit/speech-to-text-models-sync.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/transcript-rows.test.ts` (+15, -1)
- `packages/kilo-vscode/tests/unit/use-speech-to-text.test.ts` (+31, -3)
- `packages/kilo-vscode/tests/visual-regression.spec.mts` (+3, -4)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+61, -116)
- `packages/kilo-vscode/webview-ui/agent-manager/CurrentTabsMenu.tsx` (+0, -288)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+54, -35)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSearchMenu.tsx` (+165, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeSectionActions.tsx` (+139, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+174, -100)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+10, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+12, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+10, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+13, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+11, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+10, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+12, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+11, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+12, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+11, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+10, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+10, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+11, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+11, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+11, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+10, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+11, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+11, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+10, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+10, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/shortcuts.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/sidebar-search.ts` (+225, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/sortable-tab.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+62, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SortableTerminalTab.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+54, -35)
- `packages/kilo-vscode/webview-ui/diff-viewer/ImageDiffView.tsx` (+80, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-open-policy.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-state.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/ConversationList.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/MessageArea.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/MessageBubble.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/StatusSidebar.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/pierre-worker.ts` (+5, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+13, -14)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+12, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/DisplayTab.tsx` (+28, -28)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+0, -40)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModelsTab.tsx` (+45, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProvidersTab.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+15, -15)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModeSwitcher.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ThinkingSelector.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/availability.ts` (+9, -4)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/useSpeechToText.ts` (+17, -14)
- `packages/kilo-vscode/webview-ui/src/context/transcript-rows.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+8, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+7, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+8, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+7, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+8, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+7, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+8, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+8, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+7, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+7, -7)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+264, -12)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+42, -0)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+52, -2)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/utils/ime-enter.ts` (+8, -0)
- `packages/kilo-web-ui/package.json` (+2, -0)
- `packages/kilo-web-ui/src/components/accordion.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/animated-number.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/app-icon.tsx` (+1, -16)
- `packages/kilo-web-ui/src/components/avatar.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/checkbox.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/collapsible.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/context-menu.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/dialog.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/diff-changes.tsx` (+1, -5)
- `packages/kilo-web-ui/src/components/diff.tsx` (+160, -3)
- `packages/kilo-web-ui/src/components/dock-prompt.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/dock-surface.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/dropdown-menu.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/favicon.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/file-icon.tsx` (+1, -16)
- `packages/kilo-web-ui/src/components/file.tsx` (+1, -5)
- `packages/kilo-web-ui/src/components/font.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/hover-card.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/image-preview.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/inline-input.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/keybind.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/line-comment-annotations.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/line-comment.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/list.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/logo.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/markdown.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/message-nav.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/motion-spring.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/popover.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/progress-circle.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/progress.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/radio-group.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/resize-handle.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/scroll-view.tsx` (+1, -15)
- `packages/kilo-web-ui/src/components/select.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/session-review.tsx` (+255, -1)
- `packages/kilo-web-ui/src/components/session-turn.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/spinner.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/sticky-accordion-header.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/switch.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/tabs.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/text-field.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/text-reveal.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/text-shimmer.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/text-strikethrough.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/toast.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/tooltip.tsx` (+1, -1)
- `packages/kilo-web-ui/src/components/typewriter.tsx` (+1, -1)
- `packages/kilo-web-ui/src/context/data.tsx` (+1, -1)
- `packages/kilo-web-ui/src/context/dialog.tsx` (+1, -1)
- `packages/kilo-web-ui/src/context/file.tsx` (+1, -1)
- `packages/kilo-web-ui/src/context/helper.tsx` (+1, -1)
- `packages/kilo-web-ui/src/context/i18n.tsx` (+1, -1)
- `packages/kilo-web-ui/src/context/index.ts` (+1, -1)
- `packages/kilo-web-ui/src/context/marked.tsx` (+1, -1)
- `packages/kilo-web-ui/src/context/worker-pool.tsx` (+1, -1)
- `packages/kilo-web-ui/src/i18n/ar.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/br.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/bs.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/da.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/de.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/en.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/es.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/fr.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/it.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/ja.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/ko.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/nl.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/no.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/pl.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/ru.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/th.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/tr.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/uk.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/zh.ts` (+1, -1)
- `packages/kilo-web-ui/src/i18n/zht.ts` (+1, -1)
- `packages/kilo-web-ui/src/icons/app.ts` (+1, -1)
- `packages/kilo-web-ui/src/icons/file-type.ts` (+1, -1)
- `packages/kilo-web-ui/src/icons/provider.ts` (+1, -1)
- `packages/kilo-web-ui/src/pierre/index.ts` (+1, -1)
- `packages/kilo-web-ui/src/pierre/selection-bridge.ts` (+1, -1)
- `packages/kilo-web-ui/src/pierre/worker.ts` (+1, -1)
- `packages/kilo-web-ui/src/styles/misc.css` (+7, -0)
- `packages/kilo-web-ui/src/theme/color.ts` (+1, -1)
- `packages/kilo-web-ui/src/theme/loader.ts` (+1, -1)
- `packages/kilo-web-ui/src/theme/resolve.ts` (+1, -1)
- `packages/kilo-web-ui/src/theme/types.ts` (+1, -1)
- `packages/llm/sst-env.d.ts` (+0, -10)
- `packages/opencode/package.json` (+1, -24)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+6, -1)
- `packages/opencode/src/config/config.ts` (+4, -0)
- `packages/opencode/src/kilocode/config/overlay.ts` (+1, -0)
- `packages/opencode/src/kilocode/indexing-worker-client.ts` (+124, -77)
- `packages/opencode/src/kilocode/indexing-worker-protocol.ts` (+14, -7)
- `packages/opencode/src/kilocode/indexing-worker.ts` (+45, -26)
- `packages/opencode/src/kilocode/indexing.ts` (+16, -19)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilo-gateway.ts` (+17, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+8, -0)
- `packages/opencode/src/kilocode/skills/kilo-config.md` (+2, -2)
- `packages/opencode/src/kilocode/snapshot/track.ts` (+211, -164)
- `packages/opencode/sst-env.d.ts` (+0, -10)
- `packages/opencode/test/fixture/db.ts` (+6, -5)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+68, -0)
- `packages/opencode/test/kilocode/command-timeout.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/database-reset-safety.test.ts` (+68, -0)
- `packages/opencode/test/kilocode/indexing-startup.test.ts` (+6, -2)
- `packages/opencode/test/kilocode/indexing-worker.test.ts` (+55, -3)
- `packages/opencode/test/kilocode/indexing-worktree.test.ts` (+56, -25)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+15, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+5, -0)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+7, -0)
- `packages/opencode/test/kilocode/server/kilo-gateway-statuses.test.ts` (+11, -0)
- `packages/opencode/test/kilocode/snapshot-track-timeout.test.ts` (+344, -8)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+29, -15)
- `packages/opencode/test/kilocode/tool-registry-semantic-import-failure.test.ts` (+19, -12)
- `packages/opencode/test/session/compaction.test.ts` (+4, -10)
- `packages/opencode/test/session/prompt.test.ts` (+13, -7)
- `packages/plugin/sst-env.d.ts` (+0, -10)
- `packages/script/sst-env.d.ts` (+0, -10)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+32, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+32, -0)
- `packages/sdk/js/sst-env.d.ts` (+0, -10)
- `packages/sdk/openapi.json` (+70, -0)
- `packages/storybook/sst-env.d.ts` (+0, -10)
- `packages/ui/package.json` (+0, -6)
- `packages/ui/sst-env.d.ts` (+0, -10)
- `script/check-workflows.ts` (+1, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 9b2c68a6f..8b3273507 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -22,8 +22,7 @@
     "@types/bun": "catalog:",
     "@types/cross-spawn": "catalog:",
     "@types/npm-package-arg": "6.1.4",
-    "@types/npmcli__arborist": "6.3.3",
-    "@types/semver": "catalog:"
+    "@types/npmcli__arborist": "6.3.3"
   },
   "dependencies": {
     "@kilocode/kilo-gateway": "workspace:*",
```

#### packages/core/sst-env.d.ts
```diff
diff --git a/packages/core/sst-env.d.ts b/packages/core/sst-env.d.ts
deleted file mode 100644
index f25b97145..000000000
--- a/packages/core/sst-env.d.ts
+++ /dev/null
@@ -1,10 +0,0 @@
-/* This file is auto-generated by SST. Do not edit. */
-/* tslint:disable */
-/* eslint-disable */
-/* deno-fmt-ignore-file */
-/* biome-ignore-all lint: auto-generated */
-
-/// <reference path="../../sst-env.d.ts" />
-
-import "sst"
-export {}
```

#### packages/kilo-indexing/src/indexing/orchestrator.ts
```diff
diff --git a/packages/kilo-indexing/src/indexing/orchestrator.ts b/packages/kilo-indexing/src/indexing/orchestrator.ts
index 06c1f97d4..e842dee17 100644
--- a/packages/kilo-indexing/src/indexing/orchestrator.ts
+++ b/packages/kilo-indexing/src/indexing/orchestrator.ts
@@ -17,6 +17,7 @@ import type { Disposable } from "./runtime"
 import { Log } from "../util/log"
 import { sanitizeErrorMessage } from "./shared/validation-helpers"
 import { DEFAULT_VECTOR_STORE } from "./constants"
+import type { WorktreeOverlay } from "./worktree-overlay"
 
 const log = Log.create({ service: "indexing-orchestrator" })
 
@@ -24,6 +25,7 @@ export class CodeIndexOrchestrator {
   private _fileWatcherSubscriptions: Disposable[] = []
   private _isProcessing = false
   private _cancelRequested = false
+  private _active?: Promise<void>
 
   constructor(
     private readonly configManager: CodeIndexConfigManager,
@@ -34,6 +36,8 @@ export class CodeIndexOrchestrator {
     private readonly scanner: DirectoryScanner,
     private readonly fileWatcher: IFileWatcher,
     private readonly onTelemetry?: IndexingTelemetryReporter,
+    private readonly overlay?: WorktreeOverlay,
+    private readonly independent = false,
   ) {}
 
   private getTelemetryMeta(): IndexingTelemetryMeta {
@@ -82,6 +86,9 @@ export class CodeIndexOrchestrator {
     this.stateManager.setSystemState("Indexing", "Initializing file watcher...")
 
     try {
+      this.fileWatcher.setCollecting(false)
+      for (const sub of this._fileWatcherSubscriptions) sub.dispose()
+      this._fileWatcherSubscriptions = []
       await this.fileWatcher.initialize()
       log.info("file watcher initialized", { workspacePath: this.workspacePath })
 
@@ -106,6 +113,7 @@ export class CodeIndexOrchestrator {
               workspacePath: this.workspacePath,
               totalInBatch,
             })
+            if (this.stateManager.state === "Error") return
             if (totalInBatch > 0) {
               this.stateManager.setSystemState("Indexed", "File changes processed. Index up-to-date.")
             } else if (this.stateManager.state === "Indexing") {
@@ -114,9 +122,11 @@ export class CodeIndexOrchestrator {
           }
         }),
```

#### packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts
```diff
diff --git a/packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts b/packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts
index 7ce180ff5..4bef1912c 100644
--- a/packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts
+++ b/packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts
@@ -17,6 +17,7 @@ import { Emitter } from "../../../src/indexing/runtime"
 
 class Store {
   public clearCount = 0
+  public closeCount = 0
   public deleteCount = 0
 
   constructor(
@@ -47,6 +48,9 @@ class Store {
   async deleteCollection(): Promise<void> {
     this.deleteCount += 1
   }
+  async close(): Promise<void> {
+    this.closeCount += 1
+  }
   async collectionExists(): Promise<boolean> {
     return true
   }
@@ -117,6 +121,27 @@ class Watcher {
   }
 }
 
+class BlockingScanner {
+  public isCancelled = false
+  public finished = false
+  private readonly gate = Promise.withResolvers<void>()
+  readonly started = Promise.withResolvers<void>()
+
+  async scanDirectory(): Promise<{ stats: { processed: number; skipped: number }; totalBlockCount: number }> {
+    this.started.resolve()
+    await this.gate.promise
+    this.finished = true
+    return { stats: { processed: 0, skipped: 0 }, totalBlockCount: 0 }
+  }
+
+  cancel(): void {
+    this.isCancelled = true
+    this.gate.resolve()
+  }
+
+  updateBatchSegmentThreshold(_newThreshold: number): void {}
+}
+
 class FailScanner {
   public readonly isCancelled = false
 
```

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index 723403ed8..4c8bcd4d3 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -413,6 +413,8 @@ export const layer = Layer.effect(
           )
         }
 
+        KiloAgent.hardenSystemAgents(agents) // kilocode_change - keep system utility agents deny-only after config merges
+
         const get = Effect.fnUntraced(function* (agent: string) {
           return agents[KiloAgent.resolveKey(agent)] // kilocode_change - treat "build" as "code"
         })
```


*... and more files (showing first 5)*

## opencode Changes (3a2ff11..85a7929)

### Commits

- 85a7929 - fix(stats): map lab aliases (Adam, 2026-06-17)
- 5c9e4ff - feat(app): add v2 home tab toggle (#32191) (Luke Parker, 2026-06-17)
- 417ad24 - chore: generate (opencode-agent[bot], 2026-06-17)
- 1e63e76 - fix(stats): scope model pages to go (Adam, 2026-06-17)
- 213ff3f - fix(opencode): sanitize OpenAI MCP tool schemas (#32489) (Jason Quense, 2026-06-17)
- 3ab3d04 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-16)
- 8fd5753 - fix(provider): pass apiKey to createUnified for Cloudflare AI Gateway (#32052) (Keefe Tang, 2026-06-16)
- 273efde - chore: generate (opencode-agent[bot], 2026-06-16)
- 3b811bd - feat(app): make session timelines much faster AND without flicker or scroll jumps (#32331) (Luke Parker, 2026-06-16)
- e772664 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-16)
- 1c2c2d6 - chore: generate (opencode-agent[bot], 2026-06-16)
- 88f5b9a - experiment: better web picker using @pierre/tree (#31208) (Luke Parker, 2026-06-16)
- 25cb2be - fix(mcp): default tool schema properties (#32568) (Aiden Cline, 2026-06-16)
- bd84c32 - fix(web): persist docs language selection (#32551) (Aiden Cline, 2026-06-16)
- 94652cf - fix(tui): render move errors inline (#32241) (Aiden Cline, 2026-06-16)

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
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+1, -1)
- `packages/stats/core/src/domain/home.ts` (+13, -26)

#### Other Changes
- `bun.lock` (+77, -25)
- `bunfig.toml` (+1, -1)
- `nix/hashes.json` (+4, -4)
- `package.json` (+8, -5)
- `packages/app/e2e/regression/session-timeline-collapse-state.spec.ts` (+93, -6)
- `packages/app/e2e/regression/session-timeline-context-resize.spec.ts` (+9, -9)
- `packages/app/e2e/smoke/session-timeline.spec.ts` (+286, -0)
- `packages/app/e2e/utils/mock-server.ts` (+10, -4)
- `packages/app/package.json` (+5, -3)
- `packages/app/src/components/dialog-select-directory-v2.css` (+107, -0)
- `packages/app/src/components/dialog-select-directory-v2.tsx` (+356, -0)
- `packages/app/src/components/dialog-select-directory.tsx` (+8, -203)
- `packages/app/src/components/dialog-select-file.tsx` (+26, -1)
- `packages/app/src/components/directory-picker-domain.test.ts` (+189, -0)
- `packages/app/src/components/directory-picker-domain.ts` (+331, -0)
- `packages/app/src/components/directory-picker.tsx` (+20, -4)
- `packages/app/src/components/pierre-tree.test.ts` (+23, -0)
- `packages/app/src/components/prompt-input.tsx` (+1, -0)
- `packages/app/src/components/prompt-input/attachments.ts` (+2, -0)
- `packages/app/src/components/prompt-input/build-request-parts.test.ts` (+25, -0)
- `packages/app/src/components/prompt-input/build-request-parts.ts` (+1, -1)
- `packages/app/src/components/titlebar.tsx` (+47, -30)
- `packages/app/src/context/command.tsx` (+56, -49)
- `packages/app/src/context/global-sync/event-reducer.test.ts` (+20, -0)
- `packages/app/src/context/global-sync/event-reducer.ts` (+7, -1)
- `packages/app/src/context/platform.tsx` (+3, -0)
- `packages/app/src/context/prompt.tsx` (+1, -0)
- `packages/app/src/context/server-sdk.test.ts` (+40, -1)
- `packages/app/src/context/server-sdk.tsx` (+36, -10)
- `packages/app/src/context/tabs.tsx` (+62, -6)
- `packages/app/src/desktop-menu.ts` (+1, -1)
- `packages/app/src/i18n/ar.ts` (+5, -0)
- `packages/app/src/i18n/br.ts` (+5, -0)
- `packages/app/src/i18n/bs.ts` (+5, -0)
- `packages/app/src/i18n/da.ts` (+5, -0)
- `packages/app/src/i18n/de.ts` (+5, -0)
- `packages/app/src/i18n/en.ts` (+5, -0)
- `packages/app/src/i18n/es.ts` (+5, -0)
- `packages/app/src/i18n/fr.ts` (+5, -0)
- `packages/app/src/i18n/ja.ts` (+5, -0)
- `packages/app/src/i18n/ko.ts` (+5, -0)
- `packages/app/src/i18n/no.ts` (+5, -0)
- `packages/app/src/i18n/pl.ts` (+5, -0)
- `packages/app/src/i18n/ru.ts` (+5, -0)
- `packages/app/src/i18n/th.ts` (+5, -0)
- `packages/app/src/i18n/tr.ts` (+5, -0)
- `packages/app/src/i18n/uk.ts` (+5, -0)
- `packages/app/src/i18n/zh.ts` (+5, -0)
- `packages/app/src/i18n/zht.ts` (+5, -0)
- `packages/app/src/pages/layout.tsx` (+3, -3)
- `packages/app/src/pages/session.tsx` (+81, -225)
- `packages/app/src/pages/session/timeline/measure.test.ts` (+30, -0)
- `packages/app/src/pages/session/timeline/measure.ts` (+5, -0)
- `packages/app/src/pages/session/{ => timeline}/message-timeline.tsx` (+307, -332)
- `packages/app/src/pages/session/timeline/model.test.ts` (+101, -0)
- `packages/app/src/pages/session/timeline/model.ts` (+148, -0)
- `packages/app/src/pages/session/timeline/projection.ts` (+116, -0)
- `packages/app/src/pages/session/{message-timeline.data.ts => timeline/rows.ts}` (+9, -11)
- `packages/app/test-browser/solid-virtual.test.ts` (+46, -0)
- `packages/desktop/src/preload/index.ts` (+2, -1)
- `packages/desktop/src/preload/types.ts` (+1, -0)
- `packages/desktop/src/renderer/index.tsx` (+8, -1)
- `packages/opencode/src/provider/provider.ts` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+95, -0)
- `packages/opencode/src/session/tools.ts` (+1, -1)
- `packages/opencode/test/provider/transform.test.ts` (+201, -0)
- `packages/opencode/test/share/share-next.test.ts` (+5, -5)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+15, -11)
- `packages/stats/app/src/routes/model-catalog.ts` (+16, -3)
- `packages/tui/src/component/dialog-move-session.tsx` (+77, -52)
- `packages/tui/src/ui/dialog-select.tsx` (+6, -3)
- `packages/ui/package.json` (+2, -2)
- `packages/ui/src/components/file.css` (+4, -0)
- `packages/ui/src/components/file.tsx` (+1, -1)
- `packages/ui/src/components/markdown-code-state.test.ts` (+32, -0)
- `packages/ui/src/components/markdown-code-state.ts` (+22, -0)
- `packages/ui/src/components/markdown-shiki.worker.ts` (+104, -0)
- `packages/ui/src/components/markdown-stream.test.ts` (+165, -3)
- `packages/ui/src/components/markdown-stream.ts` (+77, -16)
- `packages/ui/src/components/markdown-worker-protocol.test.ts` (+81, -0)
- `packages/ui/src/components/markdown-worker-protocol.ts` (+48, -0)
- `packages/ui/src/components/markdown-worker-queue.test.ts` (+49, -0)
- `packages/ui/src/components/markdown-worker-queue.ts` (+64, -0)
- `packages/ui/src/components/markdown-worker-transport.test.ts` (+56, -0)
- `packages/ui/src/components/markdown-worker-transport.ts` (+41, -0)
- `packages/ui/src/components/markdown-worker.ts` (+122, -0)
- `packages/ui/src/components/markdown.css` (+8, -0)
- `packages/ui/src/components/markdown.tsx` (+325, -45)
- `packages/ui/src/components/message-part.tsx` (+25, -2)
- `packages/ui/src/components/scroll-view.test.ts` (+36, -1)
- `packages/ui/src/components/scroll-view.tsx` (+29, -16)
- `packages/ui/src/context/marked.tsx` (+330, -327)
- `packages/ui/src/pierre/index.ts` (+9, -18)
- `packages/ui/src/pierre/virtualizer.ts` (+1, -1)
- `packages/ui/src/v2/components/icon-button-v2.css` (+1, -0)
- `packages/web/astro.config.mjs` (+1, -0)
- `packages/web/src/components/Footer.astro` (+1, -1)
- `packages/web/src/components/LanguageSelect.astro` (+29, -0)
- `patches/@pierre%2Ftrees@1.0.0-beta.4.patch` (+107, -0)
- `patches/@tanstack%2Fsolid-virtual@3.13.28.patch` (+45, -0)
- `patches/@tanstack%2Fvirtual-core@3.17.0.patch` (+58, -0)
- `patches/virtua@0.49.1.patch` (+0, -93)

### Key Diffs

#### packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
```diff
diff --git a/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts b/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
index afb3a18..ba7856b 100644
--- a/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
+++ b/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
@@ -24,7 +24,7 @@ export const CloudflareAIGatewayPlugin = PluginV2.define({
           apiKey: config.apiKey,
           options: gatewayOptions(evt.options, metadata),
         } as any)
-        const unified = createUnified()
+        const unified = createUnified({ apiKey: config.apiKey })
         evt.sdk = {
           languageModel(modelID: string) {
             return gateway(unified(modelID))
```

#### packages/stats/core/src/domain/home.ts
```diff
diff --git a/packages/stats/core/src/domain/home.ts b/packages/stats/core/src/domain/home.ts
index ffc1b8b..3023ae3 100644
--- a/packages/stats/core/src/domain/home.ts
+++ b/packages/stats/core/src/domain/home.ts
@@ -23,7 +23,6 @@ export type SessionCostEntry = { model: string; cost: number; tokens: number }
 export type CountryEntry = { country: string; continent: string; tokens: number; share: number; rank: number }
 export type ModelUsagePoint = { date: string; tokens: number; sessions: number; cost: number }
 export type ModelMixEntry = { label: string; tokens: number; share: number }
-export type ModelProductEntry = { product: string; tokens: number; sessions: number; share: number }
 export type ModelPeerEntry = {
   model: string
   provider: string
@@ -63,7 +62,6 @@ export type StatsModelData = {
   }
   usage: ModelUsagePoint[]
   tokenMix: ModelMixEntry[]
-  productMix: ModelProductEntry[]
   country: Record<UsageRange, CountryEntry[]>
   peers: ModelPeerEntry[]
 }
@@ -286,7 +284,6 @@ function buildStatsModelData(
     },
     usage: buildModelUsage(currentRows, window, "2M"),
     tokenMix: buildModelTokenMix(current),
-    productMix: buildModelProductMix(modelScopedRows, window, current),
     country: createRangeRecord((range) => buildCountryStats(geo, getWindow(range, earliest, latest))),
     peers: buildModelPeers(peers, peerRank, totalTokens),
   }
@@ -523,26 +520,6 @@ function buildModelTokenMix(aggregate: ModelAggregate): ModelMixEntry[] {
   return items.map((item) => ({ ...item, share: round((item.tokens / total) * 100, 1) }))
 }
 
-function buildModelProductMix(
-  rows: StatMetricRow[],
-  window: DateWindow,
-  fallback: ModelAggregate,
-): ModelProductEntry[] {
-  const products = ["Go", "Zen", "Enterprise"] as const
-  const items = products.flatMap((product) => {
-    const aggregate = combineRowsForModel(
-      fallback.model,
-      rows.filter((row) => row.tier === product && row.periodStart >= window.start && row.periodStart < window.end),
-    )
-    if (aggregate.totalTokens === 0) return []
-    return [{ product, tokens: aggregate.totalTokens, sessions: aggregate.sessions }]
-  })
-  const total = items.reduce((sum, item) => sum + item.tokens, 0)
-  if (total > 0) return items.map((item) => ({ ...item, share: round((item.tokens / total) * 100, 1) }))
-  if (fallback.totalTokens === 0) return []
-  return [{ product: "All Users", tokens: fallback.totalTokens, sessions: fallback.sessions, share: 100 }]
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/generate.txt
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/sst-env.d.ts
- `src/core/` - review core changes from packages/kilo-indexing/src/indexing/orchestrator.ts
- `src/core/` - review core changes from packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
