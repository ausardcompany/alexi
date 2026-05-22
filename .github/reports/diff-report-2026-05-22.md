# Upstream Changes Report
Generated: 2026-05-22 09:26:38

## Summary
- kilocode: 233 commits, 580 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (4c0e6987b..e27b1bfd2)

### Commits

- e27b1bfd2 - Merge pull request #10117 from shssoichiro/fix-vscode-token-display (Marius, 2026-05-21)
- c604a1bb3 - Merge pull request #10495 from Kilo-Org/impartial-peacock (Catriel Müller, 2026-05-21)
- 06d6e208a - Merge pull request #10494 from Kilo-Org/heady-magpie (Catriel Müller, 2026-05-21)
- ae0fbe89d - fix(cli): show recent models in provider picker (Catriel Müller, 2026-05-21)
- ac61526d7 - fix(cli): brand OpenAI OAuth flow as Kilo (Catriel Müller, 2026-05-21)
- fca2afcf1 - refactor: kilo command branding (Catriel Müller, 2026-05-21)
- 8df0bb73a - release: v7.3.7 (kilo-maintainer[bot], 2026-05-21)
- 65733baa0 - Merge pull request #10463 from Kilo-Org/panoramic-existence (Kirill Kalishev, 2026-05-21)
- 4e5fe6043 - Merge pull request #10297 from IamCoder18/fix/tui-dialog-vertical-centering (Catriel Müller, 2026-05-21)
- b10b4c5d7 - release: v7.3.6 (kilo-maintainer[bot], 2026-05-21)
- 0ba8f9bbb - Merge pull request #10431 from Kilo-Org/dependabot/npm_and_yarn/turbo-2.9.14 (Marius, 2026-05-21)
- 13e900f63 - release: v7.3.5 (kilo-maintainer[bot], 2026-05-21)
- 30d34c3f5 - Merge pull request #10484 from Kilo-Org/great-marble (Catriel Müller, 2026-05-21)
- d42e99d78 - refactor: implement OIDC NPM publish (Catriel Müller, 2026-05-21)
- c03f3a016 - Merge pull request #10482 from Kilo-Org/fix-openrouter-indexing-dimensions (Marius, 2026-05-21)
- 94af83cdd - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-05-21)
- 3a4f96fd0 - fix(indexing): avoid retrying invalid OpenRouter bodies (marius-kilocode, 2026-05-21)
- 688f42a5a - Merge pull request #10481 from Kilo-Org/fix-cli-sse-reconnect-loop (Marius, 2026-05-21)
- 8b792937e - Merge pull request #10480 from Kilo-Org/juvenile-tower (Marius, 2026-05-21)
- 9c8451f42 - chore(vscode): keep extension launch logs opt-in (marius-kilocode, 2026-05-21)
- 205e22ee4 - fix(indexing): support OpenRouter Gemini embeddings (marius-kilocode, 2026-05-21)
- 37475b657 - style(vscode): format SSE reconnect adapter (marius-kilocode, 2026-05-21)
- f73020031 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-05-21)
- 94f58e824 - fix(vscode): keep Pierre diff theme in Kilo UI (marius-kilocode, 2026-05-21)
- 15bdd0f96 - fix(vscode): stop local CLI SSE reconnect flapping (marius-kilocode, 2026-05-21)
- fe853f383 - chore(ui): annotate Pierre diff theme override (marius-kilocode, 2026-05-21)
- 9067de039 - fix(vscode): update Pierre diff rendering (marius-kilocode, 2026-05-21)
- 5cf8db10d - Merge pull request #10477 from Kilo-Org/docs/add-auto-top-ups-redirect (arrrkady, 2026-05-21)
- 3769f6959 - Merge branch 'main' into docs/add-auto-top-ups-redirect (arrrkady, 2026-05-21)
- 333c6053d - Merge pull request #10479 from Kilo-Org/mercury-way (Marius, 2026-05-21)
- 048338a31 - fix(vscode): clear stale diff preview loading (marius-kilocode, 2026-05-21)
- 637c61e0a - Merge pull request #10474 from Kilo-Org/docs/fix-auto-top-ups-links (arrrkady, 2026-05-21)
- c94b43f95 - docs: add redirect from /auto-top-ups to kilo.ai features page (kiloconnect[bot], 2026-05-21)
- 063059c38 - docs: fix auto top-ups links and clarify individual/org availability (kiloconnect[bot], 2026-05-21)
- 87fd1d601 - release: v7.3.4 (kilo-maintainer[bot], 2026-05-21)
- 90bc4b0fb - release: v7.3.3 (kilo-maintainer[bot], 2026-05-21)
- 3a022d8c9 - fix: add kilocode_change markers to waitFor block in prompt.test.ts (kirillk, 2026-05-20)
- 6202944b9 - test(cli): wait for shell output before truncation cancel (kirillk, 2026-05-20)
- e01965562 - Merge branch 'main' into panoramic-existence (Kirill Kalishev, 2026-05-20)
- aeab31ed9 - Merge pull request #10155 from Kilo-Org/fix-tree-sitter-wasm-path (Marius, 2026-05-20)
- 38e463cc2 - Merge pull request #10464 from Kilo-Org/sincere-panama (Marius, 2026-05-20)
- 04373bfd4 - Merge branch 'main' into panoramic-existence (Kirill Kalishev, 2026-05-20)
- 28e9cd09c - docs(jetbrains): add SDKMAN Java 21 install instructions to README (kirillk, 2026-05-20)
- 30b1848c5 - docs: document Java 21 prerequisite and SDKMAN setup for JetBrains checks (kirillk, 2026-05-20)
- 7f979dbfd - fix(cli): preserve tree-sitter installer resources (marius-kilocode, 2026-05-20)
- d31b25eea - Merge pull request #10460 from Kilo-Org/sulky-nail (Marius, 2026-05-20)
- f75d1cb45 - Merge pull request #10450 from Kilo-Org/endurable-titanosaurus (Marius, 2026-05-20)
- 5c71e70e9 - test(cli): make tree-sitter wasm tests portable (marius-kilocode, 2026-05-20)
- 371b7e8ae - fix(cli): resolve packaged tree-sitter wasm paths (marius-kilocode, 2026-05-20)
- f300c6aca - feat(vscode): track sidebar title button clicks (marius-kilocode, 2026-05-20)
- 5ee2a5f89 - fix(jetbrains): address review suggestions in OpenApiSpecNormalizer (kirillk, 2026-05-20)
- c334e5cc1 - fix(jetbrains): include JetBrains in repo typecheck/tests and fix serialization failures (kirillk, 2026-05-20)
- 241efc695 - feat(ui): show reasoning titles in block headers (marius-kilocode, 2026-05-20)
- 510b628f1 - fix(jetbrains): fix clean rebuild after OpenAPI tag normalization refactor (kirillk, 2026-05-20)
- 75f68190e - fix(vscode): keep streamed responses visible after reconcile (marius-kilocode, 2026-05-20)
- 794189be2 - fix(jetbrains): normalize duplicate OpenAPI tag (#10444) (Imanol Maiztegui, 2026-05-20)
- b032e5875 - Merge pull request #10099 from sylwester-liljegren/enhanced-file-mention-style (Marius, 2026-05-20)
- db344140d - Merge pull request #9806 from shssoichiro/issue-9804 (Marius, 2026-05-20)
- 841687d57 - release: v7.3.2 (kilo-maintainer[bot], 2026-05-20)
- 81ee896da - Merge pull request #10430 from bravos2k5/fix/add-xhigh-reasoning-effort-option-to-VariantConfigSchemas (Marius, 2026-05-20)
- 11314e17d - Merge pull request #10440 from Kilo-Org/classy-dedication (Marius, 2026-05-20)
- 7a1743c9f - Merge branch 'main' into classy-dedication (marius-kilocode, 2026-05-20)
- a5bd88b06 - Merge pull request #10401 from Kilo-Org/military-fluorine (Kirill Kalishev, 2026-05-20)
- e739c29bb - fix(vscode): persist speech settings in CLI config (marius-kilocode, 2026-05-20)
- 0ba8a844b - Merge branch 'main' into military-fluorine (Kirill Kalishev, 2026-05-20)
- 8635ea128 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-05-20)
- 4855645b9 - chore(deps-dev): bump turbo from 2.8.13 to 2.9.14 (dependabot[bot], 2026-05-20)
- 79fd42e3e - OpenCode v1.14.34 (#10387) (Imanol Maiztegui, 2026-05-20)
- 34c4a90f5 - Merge pull request #10438 from Kilo-Org/update-vscode-keywords (Mark IJbema, 2026-05-20)
- 5cbdb9dba - test(opencode): increase timeout for flaky plugin lifecycle CI test (Imanol Maiztegui, 2026-05-20)
- a80281c2f - feat(vscode): add zoo-code to extension keywords (kiloconnect[bot], 2026-05-20)
- 28cbd5a67 - vscode: update marketplace keywords (kiloconnect[bot], 2026-05-20)
- 8d9c12e5a - fix(opencode): replace InstanceLayer.layer with explicit dependencies in instance context test (Imanol Maiztegui, 2026-05-20)
- 32777136c - fix(opencode): resolve race conditions and update tests for kilo compatibility (Imanol Maiztegui, 2026-05-20)
- 055a932c6 - Merge remote-tracking branch 'origin/main' into imanolmaiztegui/kilo-opencode-v1.14.34 (Imanol Maiztegui, 2026-05-20)
- 39affcc14 - ci: skip jetbrains tests (#10433) (Imanol Maiztegui, 2026-05-20)
- 22486c90e - refactor(repo): rebrand to kilo and improve issue triage configuration (Imanol Maiztegui, 2026-05-20)
- 591f57041 - refactor(remote): simplify effect bridge usage in enable handler (Imanol Maiztegui, 2026-05-20)
- 2d84bfb01 - Merge branch 'main' into imanolmaiztegui/kilo-opencode-v1.14.34 (Imanol Maiztegui, 2026-05-20)
- 95a5fa5c5 - Merge pull request #10411 from reeceshuttle/update-mercury-edit-2 (Mark IJbema, 2026-05-20)
- d0c010a9c - fix(kilo-vscode): add xhigh reasoning effort option to VariantConfigSchema (Bravos, 2026-05-20)
- 8537e85d8 - chore: update model to mercury-edit-2 (Reece Shuttleworth, 2026-05-19)
- 6f3725803 - Merge pull request #10304 from baco/update-ascii-logo (Catriel Müller, 2026-05-19)
- fbbeb3c7a - fix: fix flaky test (Catriel Müller, 2026-05-19)
- 72a5a84f8 - Merge branch 'main' into update-ascii-logo (Catriel Müller, 2026-05-19)
- ba09fa8f0 - refactor: unify kilo logos (Catriel Müller, 2026-05-19)
- 62f492de3 - fix: fix shadows (Catriel Müller, 2026-05-19)
- a92e6e508 - refactor: safe render on ssh (Catriel Müller, 2026-05-19)
- 739564535 - refactor: fallback support (Catriel Müller, 2026-05-19)
- 28b5dac67 - Merge branch 'main' into military-fluorine (Kirill Kalishev, 2026-05-19)
- db7518806 - refactor: fix logo shadows (Catriel Müller, 2026-05-19)
- 780d09729 - fix(jetbrains): warn and skip isolation when mkdirs fails for .kilo-dev dirs (kirillk, 2026-05-19)
- 19b233ffa - feat(jetbrains): isolate dev CLI storage under .kilo-dev via XDG env vars (kirillk, 2026-05-19)
- 83c09cac2 - fix(desktop): prepare cli before backend runs (kirillk, 2026-05-19)
- 86342e373 - ci: exclude jetbrains from root typecheck (#10397) (Imanol Maiztegui, 2026-05-19)
- 24b134b06 - refactor(session): use Schema.Finite for network restored time and deduplicate event type (Imanol Maiztegui, 2026-05-19)
- 9b3e1818c - Merge pull request #10288 from Kilo-Org/stylish-bloom (Marius, 2026-05-19)
- cce24c238 - Merge pull request #10221 from Kilo-Org/striped-patch (Kirill Kalishev, 2026-05-19)
- ad2372a5e - fix(test): replace Instance.provide with WithInstance.provide in network tests (Imanol Maiztegui, 2026-05-19)
- f6bb9972e - release: v7.3.1 (kilo-maintainer[bot], 2026-05-19)
- f9679c477 - Merge branch 'main' into imanolmaiztegui/kilo-opencode-v1.14.34 (Imanol Maiztegui, 2026-05-19)
- 046567eda - Merge pull request #10377 from mjnaderi/patch-1 (Marius, 2026-05-19)
- 6cdfe6802 - Merge remote-tracking branch 'origin/main' into stylish-bloom (marius-kilocode, 2026-05-19)
- 7f0685a78 - Merge branch 'main' into striped-patch (Kirill Kalishev, 2026-05-19)
- b44fd2d73 - Merge pull request #10322 from Kilo-Org/rainbow-hotel (Kirill Kalishev, 2026-05-19)
- d966bf55e - Merge branch 'main' into rainbow-hotel (Kirill Kalishev, 2026-05-19)
- 86585a341 - fix(vscode): add missing ProviderProvider and ConfigProvider to DiffViewerApp (#10389) (kilo-code-bot[bot], 2026-05-19)
- a0ca6ae06 - refactor(kilo-sessions): lazify WithInstance and InstanceRuntime imports to break circular module dependencies (Imanol Maiztegui, 2026-05-19)
- ecc2f7af1 - feat(kilocode): introduce EffectBridge for async-to-effect interop and lazify runtime constructors (Imanol Maiztegui, 2026-05-19)
- d8163c895 - docs: update KiloClaw pricing post-beta (#10295) (Aarav, 2026-05-19)
- ad00b1461 - refactor(kilocode): decouple provider-auth lifecycle, add cloud-fork CLI option, and migrate indexing config to Effect Schema (Imanol Maiztegui, 2026-05-19)
- 7c8817a33 - Merge pull request #10382 from Kilo-Org/mark/collapsible-model-picker-sections (Mark IJbema, 2026-05-19)
- 522c5b50a - feat(vscode): show match dot on collapsed model picker groups during search (kiloconnect[bot], 2026-05-19)
- 24454bf79 - fix(vscode): honor collapse state during model picker search (Mark IJbema, 2026-05-19)
- 6ce2ded75 - feat(vscode): make model picker sections collapsible (kiloconnect[bot], 2026-05-19)
- 4523bf99c - feat(opencode): rename InstanceStore to InstanceRuntime and refine model schema (Imanol Maiztegui, 2026-05-19)
- 8e053f34b - refactor(opencode): extract indexing event schema and align OpenAPI contracts (Imanol Maiztegui, 2026-05-19)
- 6392a88bc - Fix misplaced section in AGENTS.md (Mohammad Javad Naderi, 2026-05-19)
- 5c74c819c - docs(jetbrains): reorganize AGENTS.md for logical grouping and deduplication (kirillk, 2026-05-18)
- b5be9977e - test(jetbrains): stabilize history timezone assertions (kirillk, 2026-05-18)
- 23e48c0fb - test(jetbrains): stabilize backend loading state test (kirillk, 2026-05-18)
- eeca40407 - docs(jetbrains): consolidate agent guidance (kirillk, 2026-05-18)
- d37cdd61f - fix(jetbrains): serialize history deletes (kirillk, 2026-05-18)
- 1c5931552 - chore: ignore .secrets directory (kirillk, 2026-05-18)
- 215421433 - refactor(jetbrains): extract QuestionResultParser and add unit tests (kirillk, 2026-05-18)
- 2ef26e44d - Merge remote-tracking branch 'origin/main' into striped-patch (kirillk, 2026-05-18)
- 4cd17dcc5 - fix(jetbrains): ignore stale workspace reloads (kirillk, 2026-05-18)
- 18fbc4298 - chore: remove plan from question parity PR (kirillk, 2026-05-18)
- 44942c1f6 - test(jetbrains): snapshot captured log messages (kirillk, 2026-05-18)
- 1bae6adfe - Merge remote-tracking branch 'origin/rainbow-hotel' into rainbow-hotel (kirillk, 2026-05-18)
- 6b5952694 - fix(jetbrains): prevent empty question replies (kirillk, 2026-05-18)
- 32b3a43fd - Merge branch 'main' into rainbow-hotel (Kirill Kalishev, 2026-05-18)
- 59e680ffe - Merge remote-tracking branch 'origin/main' into rainbow-hotel (kirillk, 2026-05-18)
- 9164f42c4 - refactor(jetbrains): organize question views (kirillk, 2026-05-18)
- 7b0b12375 - fix(jetbrains): collapse answered-question card by default (kirillk, 2026-05-18)
- 276276bbc - feat(jetbrains): add review step and answered-question card for question tool parity (kirillk, 2026-05-18)
- 5051a595f - feat(jetbrains): hide active question tool row in transcript for parity with VS Code (kirillk, 2026-05-18)
- 7437ec03a - docs(jetbrains): plan question tool parity (kirillk, 2026-05-18)
- ad982ba51 - fix(jetbrains): align question prompt layout (kirillk, 2026-05-18)
- 128df55d6 - fix(opencode): migrate Instance.provide calls to WithInstance.provide (Imanol Maiztegui, 2026-05-18)
- 4ffcfabe1 - feat(jetbrains): show questions one at a time with radio/checkbox rows (kirillk, 2026-05-18)
- d7fcb894e - refactor(kilo-gateway): clean up proxy auth naming, error handling, and OpenAPI schema alignment (Imanol Maiztegui, 2026-05-18)
- a1a193641 - feat(kilocode): add worktree diff, FIM proxy, audio transcription, and session viewed endpoints (Imanol Maiztegui, 2026-05-18)
- f560e5bd7 - refactor(kilo-gateway): extract cloud sessions logic and wire up cloud sync endpoints (Imanol Maiztegui, 2026-05-18)
- 580a94aaa - feat(kilo-gateway): add Effect HttpApi endpoints for kilo gateway operations (Imanol Maiztegui, 2026-05-18)
- 09923fbe5 - style: apply formatting and lint fixes across packages (Imanol Maiztegui, 2026-05-18)
- 0b41d2dc4 - feat(kilocode): migrate kilo HTTP routes to Effect HttpApi layer (Imanol Maiztegui, 2026-05-18)
- ae31cf218 - feat(jetbrains): render question/permission prompts in scrollable transcript (kirillk, 2026-05-17)
- e83c804fc - Merge remote-tracking branch 'origin/main' into rainbow-hotel (kirillk, 2026-05-17)
- 74e860431 - chore: add changeset for TUI dialog vertical centering (Aarav Sharma, 2026-05-16)
- eac749c46 - feat(tui): update ascii style to mimic company's logo (Dionisio E Alonso, 2026-05-15)
- 929cfb526 - fix(cli): vertically center TUI dialogs (Aarav Sharma, 2026-05-15)
- 853736f1f - style(vscode): format history search focus (marius-kilocode, 2026-05-15)
- d19294922 - test(vscode): isolate markdown annotation mutation helper (marius-kilocode, 2026-05-15)
- e5bc6f096 - Merge remote-tracking branch 'origin/main' into stylish-bloom (marius-kilocode, 2026-05-15)
- 889d56758 - fix(vscode): focus session history search (marius-kilocode, 2026-05-15)
- e68fd6781 - resolve merge conflicts (Imanol Maiztegui, 2026-05-15)
- 806603606 - merge: record upstream v1.14.34 (Imanol Maiztegui, 2026-05-15)
- b7a7ecf44 - refactor: kilo compat for v1.14.34 (Imanol Maiztegui, 2026-05-15)
- 85020124b - fix(vscode): show session-cumulative token usage (Josh Holmer, 2026-05-14)
- 47c8600b2 - feat(prompt-input): add interactive file mention interactions with visual enhancements (Sylwester Liljegren, 2026-05-14)
- 5492b905a - Merge remote-tracking branch 'origin/main' into rainbow-hotel (kirillk, 2026-05-13)
- 092757556 - Merge remote-tracking branch 'origin/main' into striped-patch (kirillk, 2026-05-13)
- 4174c0f92 - docs(kilo-jetbrains): add threading and coroutine context annotations section to skill guide (kirillk, 2026-05-13)
- c5903fdc0 - fix(vscode): fix codebase indexing status update on windows (Josh Holmer, 2026-05-12)
- 4bfa644e0 - test(vscode): assert question replies as compact strings (kirillk, 2026-05-09)
- 93e7cb1e2 - feat(vscode): support multi-question prompts in QuestionPanel and add controller stream test (kirillk, 2026-05-09)
- b5f433b44 - release: v1.14.34 (opencode, 2026-05-04)
- d431a0e4b - fix: ensure effect server middleware properly parses errors (#25717) (Aiden Cline, 2026-05-04)
- 5720883d5 - sync (Frank, 2026-05-04)
- 007b57f07 - test(agent): skip InstanceBootstrap in plugin-agent regression test (#25737) (Kit Langton, 2026-05-04)
- fb07c2070 - fix(server): provide fresh ConfigProvider per HttpApi listener (#25726) (Kit Langton, 2026-05-04)
- 25dc6f09b - fix(worktree): fork workspace worktree boot (#25723) (Kit Langton, 2026-05-04)
- b70e2700e - chore(docs): rename firmware provider to frogbot (#25453) (Colby Gilbert, 2026-05-04)
- 1aed6b1d8 - sync (Frank, 2026-05-04)
- c1f607d20 - fix: ensure anthropic sdk properly resolves when using azure (#25721) (Aiden Cline, 2026-05-04)
- 2c819f290 - chore: generate (opencode-agent[bot], 2026-05-04)
- 6e9f10ad3 - test(server): regression reproducers for #25698 (#25714) (Kit Langton, 2026-05-04)
- 1251a870c - fix(opencode): strip transfer-encoding in UI proxy and allow public manifest assets (#25698) (OpeOginni, 2026-05-04)
- 67047fa76 - chore: generate (opencode-agent[bot], 2026-05-04)
- a366128a9 - fix(app): prevent terminal recovery loops (#25710) (Luke Parker, 2026-05-04)
- 9f708e748 - chore: generate (opencode-agent[bot], 2026-05-04)
- 7bc26dafa - feat(server): pty websocket auth tickets (#25660) (Kit Langton, 2026-05-03)
- ce89bcb8e - fix: allow Codex Spark with Codex OAuth (#25640) (Utkub24, 2026-05-03)
- c2b1974dd - Effectify plugin agent regression test (#25646) (Kit Langton, 2026-05-03)
- ca6150d6f - fix(app): preserve auth token credentials (#25636) (Kit Langton, 2026-05-03)
- 825ab2e38 - refactor(cli): effectify provider commands (#25633) (Kit Langton, 2026-05-03)
- 755cd561e - chore: generate (opencode-agent[bot], 2026-05-03)
- 6312c55d5 - fix(server): serve embedded UI from bunfs (#25632) (Kit Langton, 2026-05-03)
- a9dc0fae3 - chore: generate (opencode-agent[bot], 2026-05-03)
- 7749d8e85 - Add v2 session failure events (#25628) (Dax, 2026-05-03)
- 28112fbd1 - chore: generate (opencode-agent[bot], 2026-05-03)
- 387220f36 - fix(server): support desktop PTY websockets with HttpApi (#25598) (Kit Langton, 2026-05-03)
- adb7cb103 - fix(auth): add username option for basic auth in RunCommand (#25600) (OpeOginni, 2026-05-03)
- c06af70ab - chore: generate (opencode-agent[bot], 2026-05-03)
- 40dc2fa3c - refactor(cli/providers): flatten — Effect-native handlers end-to-end (#25537) (Kit Langton, 2026-05-03)
- df7dd06a0 - refactor(cli/github+run): Stage 4 — drop AppRuntime.runPromise bridges (#25539) (Kit Langton, 2026-05-03)
- 57d5c095d - chore: generate (opencode-agent[bot], 2026-05-03)
- 13ac849db - refactor(config+core): drop ConfigPaths.readFile, add AppFileSystem.readFileStringSafe, flatten TuiConfig.loadState (#25602) (Kit Langton, 2026-05-03)
- 8694c5b68 - fix(auth): respect server username in clients (#25596) (Shoubhit Dash, 2026-05-03)
- 0a7d02c87 - feat: group changelog bugfixes (#25597) (Shoubhit Dash, 2026-05-03)
- e77867ef0 - ci: only build electron desktop (#19067) (Brendan Allan, 2026-05-03)
- fb224d897 - chore: generate (opencode-agent[bot], 2026-05-03)
- 101566131 - fix(httpapi): add basic auth challenge for browser login (OpeOginni, 2026-05-03)
- 8433e8b43 - chore: generate (opencode-agent[bot], 2026-05-03)
- 379600b5a - fix(sdk+cli): surface real errors instead of bare {} when server returns empty body (#25592) (Kit Langton, 2026-05-03)
- 7a503de60 - fix(acp): pass server auth to internal client (#25591) (Shoubhit Dash, 2026-05-03)
- 2ad1eb56d - feat(server): native HttpApi listener with Bun.serve + WS upgrade (#25547) (Kit Langton, 2026-05-03)
- a43f767ab - chore: generate (opencode-agent[bot], 2026-05-03)
- 0ee3b8728 - feat(server): Server.openapi() backed by HttpApi spec, parity-checked against Hono output (#25545) (Kit Langton, 2026-05-03)
- 3c9f3c578 - chore: generate (opencode-agent[bot], 2026-05-03)
- ca75ac668 - refactor(server): extract Hono-coupled utilities to backend-neutral modules (#25542) (Kit Langton, 2026-05-03)
- d1f597b5b - fix(vcs): avoid unbounded diff memory usage (#25581) (Shoubhit Dash, 2026-05-03)
- 8299fb3e2 - ignore: remove triage-unassigned.ts script (Dax Raad, 2026-05-03)
- 4f7f90133 - ci: stop sending daily community recap notifications (Dax Raad, 2026-05-03)
- b205e104f - ci: remove vouch-based contributor filtering workflows (Dax Raad, 2026-05-03)
- 252e2f98e - ci: remove automatic labels from GitHub issue templates to allow manual triage (Dax Raad, 2026-05-03)
- e2afdc120 - chore: generate (opencode-agent[bot], 2026-05-03)
- a08e4c965 - core: simplify triage workflow to focus on issue ownership (Dax Raad, 2026-05-03)
- 7ccab8d27 - core: update triage agent to use qwen3.6-plus model for improved response quality (Dax Raad, 2026-05-03)
- fc57eb3b8 - ci (Dax Raad, 2026-05-03)
- 9179bafd5 - Add debug info command (#25550) (Dax, 2026-05-03)
- 2df8eda8a - fix(cli): bridge Instance.current ALS in effectCmd handlers (regression from #25522) (#25546) (Kit Langton, 2026-05-03)
- bd32252a7 - refactor(cli/providers): Stage 4 — drop inline AppRuntime.runPromise calls (#25532) (Kit Langton, 2026-05-02)
- 1717d636a - refactor(cli/mcp+agent): Stage 4 — drop AppRuntime.runPromise bridges (#25530) (Kit Langton, 2026-05-02)
- 8e016b470 - fix: regression w/ auth login where stderr was ignored instead of inherited (#25529) (Aiden Cline, 2026-05-02)
- b89d48a2a - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-03)
- 33312bfd1 - fix(session): encode v2 session responses (#25528) (Dax, 2026-05-03)
- 3f1ce3641 - chore: generate (opencode-agent[bot], 2026-05-03)
- 0e1327954 - refactor(cli): convert agent / providers / mcp to effectCmd (#25525) (Kit Langton, 2026-05-02)
- 5f03d892c - fix(httpapi): pagination Link header echoes request host (#25527) (Kit Langton, 2026-05-02)
- bdabb102f - refactor(cli/stats): Stage 4 — fully Effect-native body (#25523) (Kit Langton, 2026-05-02)
- a79a6594b - chore: bump Effect beta (#25524) (Kit Langton, 2026-05-02)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `.opencode/tool/github-triage.ts` (+21, -63)
- `packages/opencode/src/tool/registry.ts` (+4, -4)
- `packages/opencode/src/tool/{bash.ts => shell.ts}` (+52, -59)
- `packages/opencode/src/tool/shell/id.ts` (+19, -0)
- `packages/opencode/src/tool/shell/prompt.ts` (+297, -0)
- `packages/opencode/src/tool/{bash.txt => shell/shell.txt}` (+9, -51)
- `packages/opencode/src/tool/webfetch.ts` (+2, -1)
- `packages/opencode/test/tool/apply_patch.test.ts` (+25, -24)
- `packages/opencode/test/tool/edit.test.ts` (+19, -18)
- `packages/opencode/test/tool/external-directory.test.ts` (+8, -7)
- `packages/opencode/test/tool/glob.test.ts` (+61, -61)
- `packages/opencode/test/tool/grep.test.ts` (+50, -53)
- `packages/opencode/test/tool/parameters.test.ts` (+7, -7)
- `packages/opencode/test/tool/question.test.ts` (+40, -45)
- `packages/opencode/test/tool/read.test.ts` (+13, -13)
- `packages/opencode/test/tool/recall.test.ts` (+9, -9)
- `packages/opencode/test/tool/registry.test.ts` (+165, -128)
- `packages/opencode/test/tool/{bash.test.ts => shell.test.ts}` (+131, -68)
- `packages/opencode/test/tool/truncation.test.ts` (+2, -5)
- `packages/opencode/test/tool/webfetch.test.ts` (+4, -3)
- `packages/opencode/test/tool/write.test.ts` (+155, -169)

#### Agent System (packages/*/src/agent/)
- `.opencode/agent/triage.md` (+19, -76)
- `packages/opencode/src/kilocode/agent/index.ts` (+2, -2)
- `packages/opencode/test/agent/agent.test.ts` (+46, -46)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+28, -0)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/allow-everything.ts` (+67, -0)
- `packages/opencode/src/kilocode/permission/routes.ts` (+4, -46)
- `packages/opencode/src/permission/index.ts` (+0, -1)
- `packages/opencode/test/kilocode/permission/env-read.test.ts` (+3, -1)
- `packages/opencode/test/kilocode/permission/external-directory-allow.test.ts` (+10, -10)
- `packages/opencode/test/kilocode/permission/next.always-rules.test.ts` (+3, -1)
- `packages/opencode/test/kilocode/permission/next.reply-http.test.ts` (+15, -12)
- `packages/opencode/test/kilocode/permission/next.reply-routing.test.ts` (+3, -1)
- `packages/opencode/test/permission/next.test.ts` (+14, -6)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/bus-event.ts` (+2, -0)
- `packages/opencode/src/bus/global.ts` (+12, -2)
- `packages/opencode/src/bus/index.ts` (+20, -5)
- `packages/opencode/test/bus/bus-effect.test.ts` (+89, -98)
- `packages/opencode/test/bus/bus-integration.test.ts` (+2, -2)
- `packages/opencode/test/bus/bus.test.ts` (+2, -2)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/filesystem.ts` (+8, -0)
- `packages/core/src/flag/flag.ts` (+14, -1)
- `packages/core/src/util/log.ts` (+2, -0)
- `packages/core/test/filesystem/filesystem.test.ts` (+28, -0)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts` (+1, -1)

#### Other Changes
- `.changeset/agent-manager-prompt-picker.md` (+0, -5)
- `.changeset/bright-searches-count.md` (+0, -5)
- `.changeset/clever-networks-resume.md` (+0, -5)
- `.changeset/continue-worktree-sessions.md` (+0, -5)
- `.changeset/inline-review-speech.md` (+0, -5)
- `.changeset/jetbrains-question-carousel.md` (+5, -0)
- `.changeset/jetbrains-scrollable-prompts.md` (+5, -0)
- `.changeset/markdown-review-voice.md` (+0, -5)
- `.changeset/mermaid-security-fixes.md` (+0, -6)
- `.changeset/openai-recent-models.md` (+5, -0)
- `.changeset/quick-mice-trade.md` (+5, -0)
- `.changeset/shiny-sessions-export.md` (+0, -5)
- `.changeset/smart-views-restore.md` (+0, -5)
- `.changeset/swift-voices-send.md` (+0, -5)
- `.github/workflows/disabled/daily-issues-recap.yml.disabled` (+0, -170)
- `.github/workflows/disabled/daily-pr-recap.yml.disabled` (+0, -173)
- `.github/workflows/publish.yml` (+2, -1)
- `.github/workflows/typecheck.yml` (+8, -0)
- `.gitignore` (+2, -0)
- `.opencode-version` (+1, -1)
- `.opencode/command/changelog.md` (+4, -1)
- `AGENTS.md` (+14, -14)
- `CONTRIBUTING.md` (+43, -1)
- `bun.lock` (+59, -33)
- `install` (+43, -3)
- `nix/hashes.json` (+4, -4)
- `package.json` (+16, -6)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+3, -2)
- `packages/kilo-docs/pages/code-with-ai/features/autocomplete/index.md` (+3, -3)
- `packages/kilo-docs/pages/code-with-ai/features/speech-to-text.md` (+46, -28)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+36, -21)
- `packages/kilo-docs/pages/collaborate/teams/billing.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/adding-credits.md` (+2, -2)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+11, -0)
- `packages/kilo-docs/pages/kiloclaw/faq/pricing.md` (+1, -1)
- `packages/kilo-docs/previous-docs-redirects.js` (+6, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-apply-patch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-edit-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/index.ts` (+15, -0)
- `packages/kilo-gateway/src/server/handlers.ts` (+190, -0)
- `packages/kilo-gateway/src/server/routes.ts` (+43, -155)
- `packages/kilo-i18n/package.json` (+4, -2)
- `packages/kilo-indexing/package.json` (+4, -2)
- `packages/kilo-indexing/src/config.ts` (+103, -1)
- `packages/kilo-indexing/src/indexing/config-manager.ts` (+2, -3)
- `packages/kilo-indexing/src/indexing/embedders/openrouter.ts` (+33, -7)
- `packages/kilo-indexing/src/indexing/embedding-profile.ts` (+1, -1)
- `packages/kilo-indexing/src/indexing/model-registry.ts` (+1, -0)
- `packages/kilo-indexing/src/tree-sitter/languageParser.ts` (+4, -4)
- `packages/kilo-indexing/test/kilocode/indexing/config-manager.test.ts` (+14, -0)
- `packages/kilo-indexing/test/kilocode/indexing/embedders/openrouter.test.ts` (+38, -17)
- `packages/kilo-indexing/test/kilocode/indexing/service-factory.test.ts` (+33, -1)
- `packages/kilo-indexing/test/kilocode/tree-sitter/wasm-resolution.test.ts` (+32, -0)
- `packages/kilo-jetbrains/.kilo/skills/jetbrains-ui-style/SKILL.md` (+0, -1335)
- `packages/kilo-jetbrains/.run/Run IDE (Backend).run.xml` (+2, -2)
- `packages/kilo-jetbrains/AGENTS.md` (+413, -599)
- `packages/kilo-jetbrains/README.md` (+80, -5)
- `packages/kilo-jetbrains/backend/build.gradle.kts` (+25, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+42, -11)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+5, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+16, -15)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloBackendCliManagerEnvTest.kt` (+116, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/TestLog.kt` (+7, -5)
- `packages/kilo-jetbrains/build-tasks/build.gradle.kts` (+9, -0)
- `packages/kilo-jetbrains/build-tasks/settings.gradle.kts` (+8, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/BuildTasksPlugin.kt` (+3, -1)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/PrepareLocalCliTask.kt` (+139, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/normalization/NormalizeOpenApiSpecTask.kt` (+31, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/normalization/OpenApiSpecNormalizer.kt` (+169, -0)
- `packages/kilo-jetbrains/build-tasks/src/test/kotlin/normalization/OpenApiSpecNormalizerTest.kt` (+234, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+32, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+14, -29)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryController.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/Message.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/PermissionPanel.kt` (+0, -83)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/QuestionPanel.kt` (+0, -92)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+66, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+1, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+72, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PermissionView.kt` (+100, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+14, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionResultParser.kt` (+44, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionResultView.kt` (+281, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionView.kt` (+471, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+60, -24)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/JsonSessionStreamTest.kt` (+124, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/history/HistoryControllerTest.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PermissionPanelTest.kt` (+0, -115)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/QuestionPanelTest.kt` (+0, -134)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+206, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/PermissionViewTest.kt` (+74, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionResultViewTest.kt` (+223, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionViewTest.kt` (+521, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/question/QuestionResultParserTest.kt` (+155, -0)
- `packages/kilo-telemetry/package.json` (+3, -2)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.css` (+27, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+44, -4)
- `packages/kilo-ui/src/components/reasoning-heading.test.ts` (+49, -0)
- `packages/kilo-ui/src/components/reasoning-heading.ts` (+40, -0)
- `packages/kilo-ui/src/stories/message-part.stories.tsx` (+1, -1)
- `packages/kilo-ui/src/styles/vscode-bridge.css` (+2, -2)
- `packages/kilo-vscode/CHANGELOG.md` (+64, -0)
- `packages/kilo-vscode/package.json` (+93, -21)
- `packages/kilo-vscode/script/build.ts` (+2, -0)
- `packages/kilo-vscode/script/local-bin.ts` (+13, -2)
- `packages/kilo-vscode/script/watch-cli.ts` (+2, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+23, -25)
- `packages/kilo-vscode/src/diff/SourceController.ts` (+6, -2)
- `packages/kilo-vscode/src/extension.ts` (+32, -1)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+12, -0)
- `packages/kilo-vscode/src/services/autocomplete/__tests__/settings.spec.ts` (+10, -3)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/__tests__/uselessSuggestionFilter.test.ts` (+1, -1)
- `packages/kilo-vscode/src/services/cli-backend/cli-resources.ts` (+39, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+3, -5)
- `packages/kilo-vscode/src/services/cli-backend/sdk-sse-adapter.ts` (+21, -8)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+2, -0)
- `packages/kilo-vscode/src/services/input-tools.ts` (+0, -6)
- `packages/kilo-vscode/src/shared/autocomplete-models.ts` (+11, -3)
- `packages/kilo-vscode/src/shared/custom-provider.ts` (+1, -1)
- `packages/kilo-vscode/src/speech-to-text/config.ts` (+0, -13)
- `packages/kilo-vscode/src/speech-to-text/settings.ts` (+0, -19)
- `packages/kilo-vscode/tests/package.json` (+5, -1)
- `packages/kilo-vscode/tests/unit/config-scope.test.ts` (+17, -0)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+152, -0)
- `packages/kilo-vscode/tests/unit/indexing-utils.test.ts` (+56, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+40, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+30, -0)
- `packages/kilo-vscode/tests/unit/prompt-input-utils.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/sameDirectory.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/sdk-sse-adapter.test.ts` (+148, -0)
- `packages/kilo-vscode/tests/unit/server-manager-utils.test.ts` (+56, -0)
- `packages/kilo-vscode/tests/unit/session-parts.test.ts` (+113, -0)
- `packages/kilo-vscode/tests/unit/session-utils.test.ts` (+30, -0)
- `packages/kilo-vscode/tests/unit/source-controller.test.ts` (+34, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-availability.test.ts` (+29, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-models-sync.test.ts` (+9, -12)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+61, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffViewerApp.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+43, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+4, -21)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/components/history/CloudSessionList.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/history/HistoryView.tsx` (+17, -2)
- `packages/kilo-vscode/webview-ui/src/components/history/SessionList.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+7, -5)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+135, -89)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/availability.ts` (+8, -9)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+0, -8)
- `packages/kilo-vscode/webview-ui/src/context/indexing-utils.ts` (+12, -1)
- `packages/kilo-vscode/webview-ui/src/context/indexing.tsx` (+2, -5)
- `packages/kilo-vscode/webview-ui/src/context/session-parts.ts` (+47, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+21, -17)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+68, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+144, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+37, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+18, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+1, -9)
- `packages/kilo-vscode/webview-ui/src/types/messages/parts.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+0, -5)
- `packages/opencode/CHANGELOG.md` (+31, -0)
- `packages/opencode/bin/kilo` (+11, -0)
- `packages/opencode/migration/20260427172553_slow_nightmare/migration.sql` (+17, -0)
- `packages/opencode/migration/20260427172553_slow_nightmare/snapshot.json` (+1409, -0)
- `packages/opencode/migration/20260428004200_add_session_path/snapshot.json` (+18, -18)
- `packages/opencode/migration/20260501142318_next_venus/migration.sql` (+2, -0)
- `packages/opencode/migration/20260501142318_next_venus/snapshot.json` (+1439, -0)
- `packages/opencode/package.json` (+6, -1)
- `packages/opencode/script/build.ts` (+28, -0)
- `packages/opencode/script/httpapi-exercise.ts` (+2014, -0)
- `packages/opencode/script/postinstall.mjs` (+14, -0)
- `packages/opencode/script/publish.ts` (+13, -5)
- `packages/opencode/src/acp/agent.ts` (+21, -17)
- `packages/opencode/src/cli/bootstrap.ts` (+4, -5)
- `packages/opencode/src/cli/cmd/account.ts` (+26, -21)
- `packages/opencode/src/cli/cmd/acp.ts` (+47, -44)
- `packages/opencode/src/cli/cmd/agent.ts` (+164, -169)
- `packages/opencode/src/cli/cmd/cmd.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+87, -100)
- `packages/opencode/src/cli/cmd/debug/config.ts` (+7, -10)
- `packages/opencode/src/cli/cmd/debug/file.ts` (+27, -37)
- `packages/opencode/src/cli/cmd/debug/index.ts` (+45, -10)
- `packages/opencode/src/cli/cmd/debug/lsp.ts` (+23, -32)
- `packages/opencode/src/cli/cmd/debug/ripgrep.ts` (+42, -48)
- `packages/opencode/src/cli/cmd/debug/skill.ts` (+7, -15)
- `packages/opencode/src/cli/cmd/debug/snapshot.ts` (+17, -20)
- `packages/opencode/src/cli/cmd/export.ts` (+52, -64)
- `packages/opencode/src/cli/cmd/generate.ts` (+14, -8)
- `packages/opencode/src/cli/cmd/github.ts` (+209, -205)
- `packages/opencode/src/cli/cmd/import.ts` (+119, -114)
- `packages/opencode/src/cli/cmd/mcp.ts` (+510, -533)
- `packages/opencode/src/cli/cmd/plug.ts` (+19, -22)
- `packages/opencode/src/cli/cmd/pr.ts` (+96, -119)
- `packages/opencode/src/cli/cmd/providers.ts` (+314, -342)
- `packages/opencode/src/cli/cmd/remote.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/run.ts` (+464, -444)
- `packages/opencode/src/cli/cmd/serve.ts` (+30, -22)
- `packages/opencode/src/cli/cmd/session.ts` (+60, -81)
- `packages/opencode/src/cli/cmd/stats.ts` (+133, -147)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+24, -21)
- `packages/opencode/src/cli/cmd/tui/attach.ts` (+7, -6)
- `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx` (+8, -5)
- `packages/opencode/src/cli/cmd/tui/component/kilo-logo.tsx` (+3, -8)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+10, -2)
- `packages/opencode/src/cli/cmd/tui/config/tui.ts` (+69, -51)
- `packages/opencode/src/cli/cmd/tui/context/sync-v2.tsx` (+307, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+9, -9)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+1087, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+3, -3)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+9, -14)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/ui/dialog.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+16, -16)
- `packages/opencode/src/cli/cmd/web.ts` (+28, -21)
- `packages/opencode/src/cli/effect-cmd.ts` (+64, -11)
- `packages/opencode/src/cli/effect/prompt.ts` (+18, -6)
- `packages/opencode/src/cli/logo.ts` (+3, -5)
- `packages/opencode/src/cli/ui.ts` (+4, -6)
- `packages/opencode/src/config/config.ts` (+43, -54)
- `packages/opencode/src/config/paths.ts` (+0, -10)
- `packages/opencode/src/effect/app-runtime.ts` (+6, -19)
- `packages/opencode/src/file/watcher.ts` (+4, -2)
- `packages/opencode/src/git/index.ts` (+99, -7)
- `packages/opencode/src/index.ts` (+2, -2)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+8, -3)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+16, -14)
- `packages/opencode/src/kilocode/cli/cmd/roll-call.ts` (+2, -2)
- `packages/opencode/src/kilocode/cli/logo.ts` (+86, -0)
- `packages/opencode/src/kilocode/config-validation.ts` (+6, -2)
- `packages/opencode/src/kilocode/config/config.ts` (+0, -1)
- `packages/opencode/src/kilocode/indexing-event.ts` (+23, -0)
- `packages/opencode/src/kilocode/indexing.ts` (+3, -28)
- `packages/opencode/src/kilocode/plan-followup.ts` (+15, -13)
- `packages/opencode/src/kilocode/provider/provider.ts` (+2, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/commit-message.ts` (+56, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/enhance-prompt.ts` (+50, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/indexing.ts` (+46, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilo-gateway.ts` (+350, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+78, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/network.ts` (+70, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/remote.ts` (+70, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/session-import.ts` (+290, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/suggestion.ts` (+78, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/telemetry.ts` (+70, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/commit-message.ts` (+31, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/enhance-prompt.ts` (+19, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/indexing.ts` (+16, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+318, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+35, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/network.ts` (+26, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/remote.ts` (+27, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/session-import.ts` (+39, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/suggestion.ts` (+36, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/telemetry.ts` (+28, -0)
- `packages/opencode/src/kilocode/server/httpapi/instance.ts` (+50, -0)
- `packages/opencode/src/kilocode/server/httpapi/public.ts` (+85, -0)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+25, -0)
- `packages/opencode/src/kilocode/server/instance.ts` (+2, -2)
- `packages/opencode/src/kilocode/server/provider-auth-lifecycle.ts` (+9, -0)
- `packages/opencode/src/kilocode/server/server.ts` (+2, -2)
- `packages/opencode/src/kilocode/suggestion/index.ts` (+2, -2)
- `packages/opencode/src/plugin/codex.ts` (+9, -6)
- `packages/opencode/src/plugin/index.ts` (+2, -5)
- `packages/opencode/src/project/bootstrap-service.ts` (+9, -0)
- `packages/opencode/src/project/bootstrap.ts` (+14, -22)
- `packages/opencode/src/project/instance-layer.ts` (+11, -0)
- `packages/opencode/src/project/instance-runtime.ts` (+16, -0)
- `packages/opencode/src/project/instance-store.ts` (+16, -34)
- `packages/opencode/src/project/instance.ts` (+0, -9)
- `packages/opencode/src/project/project.ts` (+28, -1)
- `packages/opencode/src/project/vcs.ts` (+157, -58)
- `packages/opencode/src/project/with-instance.ts` (+12, -0)
- `packages/opencode/src/provider/auth.ts` (+0, -3)
- `packages/opencode/src/provider/models.ts` (+1, -1)
- `packages/opencode/src/provider/provider.ts` (+12, -13)
- `packages/opencode/src/pty/ticket.ts` (+68, -0)
- `packages/opencode/src/server/auth.ts` (+48, -0)
- `packages/opencode/src/server/cors.ts` (+19, -0)
- `packages/opencode/src/server/error.ts` (+3, -0)
- `packages/opencode/src/server/fence.ts` (+2, -72)
- `packages/opencode/src/server/global-lifecycle.ts` (+37, -0)
- `packages/opencode/src/server/httpapi-server.node.ts` (+34, -0)
- `packages/opencode/src/server/httpapi-server.ts` (+9, -0)
- `packages/opencode/src/server/middleware.ts` (+5, -0)
- `packages/opencode/src/server/proxy.ts` (+1, -1)
- `packages/opencode/src/server/routes/global.ts` (+13, -14)
- `packages/opencode/src/server/routes/instance/config.ts` (+29, -10)
- `packages/opencode/src/server/routes/instance/event.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+26, -0)
- `packages/opencode/src/server/routes/instance/httpapi/event.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/config.ts` (+20, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+53, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+4, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/permission.ts` (+22, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/pty.ts` (+14, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+19, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2.ts` (+14, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/message.ts` (+69, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+140, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/config.ts` (+12, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+100, -16)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/global.ts` (+10, -10)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/permission.ts` (+15, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+54, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+14, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/tui.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2.ts` (+6, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/message.ts` (+60, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/session.ts` (+115, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+61, -70)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+58, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/instance-context.ts` (+3, -7)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/proxy.ts` (+28, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+7, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+19, -11)
- `packages/opencode/src/server/routes/instance/httpapi/websocket-tracker.ts` (+57, -0)
- `packages/opencode/src/server/routes/instance/index.ts` (+139, -5)
- `packages/opencode/src/server/routes/instance/middleware.ts` (+2, -4)
- `packages/opencode/src/server/routes/instance/project.ts` (+2, -4)
- `packages/opencode/src/server/routes/instance/provider.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/pty.ts` (+75, -11)
- `packages/opencode/src/server/routes/instance/tui.ts` (+9, -21)
- `packages/opencode/src/server/routes/ui.ts` (+3, -46)
- `packages/opencode/src/server/server.ts` (+164, -20)
- `packages/opencode/src/server/shared/fence.ts` (+74, -0)
- `packages/opencode/src/server/shared/pty-ticket.ts` (+15, -0)
- `packages/opencode/src/server/shared/public-ui.ts` (+12, -0)
- `packages/opencode/src/server/shared/tui-control.ts` (+28, -0)
- `packages/opencode/src/server/shared/ui.ts` (+57, -0)
- `packages/opencode/src/server/shared/workspace-routing.ts` (+36, -0)
- `packages/opencode/src/server/workspace.ts` (+4, -41)
- `packages/opencode/src/session/compaction.ts` (+27, -4)
- `packages/opencode/src/session/network.ts` (+3, -3)
- `packages/opencode/src/session/processor.ts` (+154, -10)
- `packages/opencode/src/session/projectors-next.ts` (+226, -0)
- `packages/opencode/src/session/projectors.ts` (+4, -1)
- `packages/opencode/src/session/prompt.ts` (+118, -4)
- `packages/opencode/src/session/session.sql.ts` (+16, -9)
- `packages/opencode/src/session/session.ts` (+33, -0)
- `packages/opencode/src/storage/db.ts` (+1, -0)
- `packages/opencode/src/sync/index.ts` (+4, -4)
- `packages/opencode/src/util/effect-zod.ts` (+1, -1)
- `packages/opencode/src/util/error.ts` (+17, -11)
- `packages/opencode/src/util/lazy.ts` (+2, -0)
- `packages/opencode/src/util/timeout.ts` (+2, -2)
- `packages/opencode/src/v2/event.ts` (+53, -0)
- `packages/opencode/src/v2/schema.ts` (+10, -0)
- `packages/opencode/src/v2/session-entry-stepper.ts` (+0, -261)
- `packages/opencode/src/v2/session-entry.ts` (+0, -220)
- `packages/opencode/src/v2/session-event.ts` (+333, -381)
- `packages/opencode/src/v2/session-message-updater.ts` (+420, -0)
- `packages/opencode/src/v2/session-message.ts` (+178, -0)
- `packages/opencode/src/v2/session-prompt.ts` (+36, -0)
- `packages/opencode/src/v2/session.ts` (+258, -47)
- `packages/opencode/src/v2/tool-output.ts` (+18, -0)
- `packages/opencode/src/worktree/index.ts` (+22, -16)
- `packages/opencode/test/AGENTS.md` (+22, -11)
- `packages/opencode/test/acp/event-subscription.test.ts` (+12, -10)
- `packages/opencode/test/cli/cmd/tui/sync.test.tsx` (+2, -2)
- `packages/opencode/test/cli/effect-cmd-instance-als.test.ts` (+48, -0)
- `packages/opencode/test/cli/tui/plugin-lifecycle.test.ts` (+2, -1)
- `packages/opencode/test/cli/tui/use-event.test.tsx` (+2, -0)
- `packages/opencode/test/config/config.test.ts` (+86, -74)
- `packages/opencode/test/config/tui.test.ts` (+47, -4)
- `packages/opencode/test/control-plane/workspace.test.ts` (+2, -1)
- `packages/opencode/test/effect/instance-state.test.ts` (+3, -4)
- `packages/opencode/test/file/fsmonitor.test.ts` (+3, -2)
- `packages/opencode/test/file/index.test.ts` (+55, -54)
- `packages/opencode/test/file/path-traversal.test.ts` (+12, -11)
- `packages/opencode/test/file/watcher.test.ts` (+3, -2)
- `packages/opencode/test/fixture/agent-plugin.constants.ts` (+6, -0)
- `packages/opencode/test/fixture/agent-plugin.ts` (+12, -0)
- `packages/opencode/test/fixture/config.ts` (+24, -0)
- `packages/opencode/test/fixture/fixture.ts` (+54, -14)
- `packages/opencode/test/git/git.test.ts` (+47, -0)
- `packages/opencode/test/kilocode/agent-global-config-dirs.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/agent-skill-permissions.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/bash-permission-metadata.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/bin-tree-sitter-env.test.ts` (+72, -0)
- `packages/opencode/test/kilocode/builtin-skills.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/command-branding.test.ts` (+27, -0)
- `packages/opencode/test/kilocode/compaction-payload-recovery.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/config-gitignore.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/config-resilience.test.ts` (+10, -10)
- `packages/opencode/test/kilocode/config-validation.test.ts` (+11, -11)
- `packages/opencode/test/kilocode/config/config.test.ts` (+14, -10)
- `packages/opencode/test/kilocode/config/indexing-default-plugin.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/config/speech-to-text-config.test.ts` (+26, -0)
- `packages/opencode/test/kilocode/edit-permission-filediff.test.ts` (+6, -6)
- `packages/opencode/test/kilocode/external-directory-boundary.test.ts` (+6, -5)
- `packages/opencode/test/kilocode/indexing-startup.test.ts` (+8, -16)
- `packages/opencode/test/kilocode/indexing-worktree.test.ts` (+3, -6)
- `packages/opencode/test/kilocode/instruction.test.ts` (+2, -16)
- `packages/opencode/test/kilocode/kilo-gateway-headers.test.ts` (+13, -2)
- `packages/opencode/test/kilocode/kilo-loader-auth.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/kilo-models-401-fallback.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/logo.test.ts` (+32, -0)
- `packages/opencode/test/kilocode/model-cache-org.test.ts` (+29, -33)
- `packages/opencode/test/kilocode/oauth-branding.test.ts` (+22, -0)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+2, -1)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+6, -5)
- `packages/opencode/test/kilocode/project-config-update.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/project-id.test.ts` (+23, -23)
- `packages/opencode/test/kilocode/provider-list-failed-state.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/question-dismiss-all.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/semantic-search.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/server/httpapi-bridge.test.ts` (+146, -0)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+24, -0)
- `packages/opencode/test/kilocode/server/permission-allow-everything.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+7, -7)
- `packages/opencode/test/kilocode/session-fork-remap.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/session-list.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+8, -8)
- `packages/opencode/test/kilocode/session/instruction-substitution.test.ts` (+2, -16)
- `packages/opencode/test/kilocode/session/platform-attribution.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/session/session.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/snapshot-cache.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/snapshot-freeze-repro.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/stats-subagent-cost.test.ts` (+41, -41)
- `packages/opencode/test/kilocode/suggestion/auto-dismiss.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/suggestion/suggestion.test.ts` (+6, -6)
- `packages/opencode/test/lib/effect.ts` (+59, -1)
- `packages/opencode/test/lsp/client.test.ts` (+13, -12)
- `packages/opencode/test/lsp/index.test.ts` (+3, -2)
- `packages/opencode/test/mcp/headers.test.ts` (+4, -3)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+4, -3)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+5, -4)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+4, -3)
- `packages/opencode/test/permission-task.test.ts` (+7, -6)
- `packages/opencode/test/plugin/auth-override.test.ts` (+52, -21)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+29, -11)
- `packages/opencode/test/preload.ts` (+2, -1)
- `packages/opencode/test/project/instance-bootstrap-regression.test.ts` (+86, -0)
- `packages/opencode/test/project/instance.test.ts` (+61, -81)
- `packages/opencode/test/project/project.test.ts` (+2, -0)
- `packages/opencode/test/project/vcs.test.ts` (+32, -2)
- `packages/opencode/test/project/worktree.test.ts` (+13, -8)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+21, -40)
- `packages/opencode/test/provider/gitlab-duo.test.ts` (+14, -13)
- `packages/opencode/test/provider/provider.test.ts` (+130, -229)
- `packages/opencode/test/pty/pty-output-isolation.test.ts` (+4, -3)
- `packages/opencode/test/pty/pty-session.test.ts` (+3, -2)
- `packages/opencode/test/pty/pty-shell.test.ts` (+4, -3)
- `packages/opencode/test/pty/ticket.test.ts` (+57, -0)
- `packages/opencode/test/question/question.test.ts` (+262, -295)
- `packages/opencode/test/server/auth.test.ts` (+59, -0)
- `packages/opencode/test/server/experimental-session-list.test.ts` (+7, -7)
- `packages/opencode/test/server/global-bus.ts` (+34, -0)
- `packages/opencode/test/server/global-session-list.test.ts` (+10, -10)
- `packages/opencode/test/server/httpapi-authorization.test.ts` (+45, -12)
- `packages/opencode/test/server/httpapi-bridge.test.ts` (+14, -14)
- `packages/opencode/test/server/httpapi-config.test.ts` (+4, -16)
- `packages/opencode/test/server/httpapi-event.test.ts` (+13, -2)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+7, -17)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+10, -21)
- `packages/opencode/test/server/httpapi-instance.legacy.test.ts` (+8, -24)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+319, -0)
- `packages/opencode/test/server/httpapi-mcp-oauth.test.ts` (+1, -4)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+3, -2)
- `packages/opencode/test/server/httpapi-parity.test.ts` (+128, -0)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+3, -2)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-session.test.ts` (+46, -3)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-tui.test.ts` (+5, -10)
- `packages/opencode/test/server/session-actions.test.ts` (+2, -1)
- `packages/opencode/test/server/session-list.test.ts` (+21, -20)
- `packages/opencode/test/server/session-messages.test.ts` (+5, -4)
- `packages/opencode/test/server/session-select.test.ts` (+4, -3)
- `packages/opencode/test/server/workspace-routing.test.ts` (+5, -1)
- `packages/opencode/test/server/worktree-endpoint-repro.test.ts` (+148, -0)
- `packages/opencode/test/session/compaction.test.ts` (+32, -20)
- `packages/opencode/test/session/instruction.test.ts` (+2, -16)
- `packages/opencode/test/session/llm.test.ts` (+9, -8)
- `packages/opencode/test/session/message-v2.test.ts` (+3, -3)
- `packages/opencode/test/session/messages-pagination.test.ts` (+43, -42)
- `packages/opencode/test/session/network.test.ts` (+8, -8)
- `packages/opencode/test/session/prompt.test.ts` (+85, -4)
- `packages/opencode/test/session/session-entry-stepper.test.ts` (+0, -916)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+2, -1)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+58, -57)
- `packages/opencode/test/sync/index.test.ts` (+1, -1)
- `packages/opencode/test/util/error.test.ts` (+13, -0)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+203, -0)
- `packages/opencode/test/workspace/workspace-restore.test.ts` (+3, -2)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/script/build.ts` (+5, -3)
- `packages/sdk/js/src/v2/client.ts` (+19, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+2068, -1804)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+4491, -3464)
- `packages/sdk/openapi.json` (+14911, -10334)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/provider-icons/types.ts` (+15, -15)
- `script/raw-changelog.ts` (+32, -8)
- `script/upstream/package.json` (+3, -2)
- `specs/v2/session-concepts-gap.md` (+131, -0)

### Key Diffs

#### .opencode/agent/triage.md
```diff
diff --git a/.opencode/agent/triage.md b/.opencode/agent/triage.md
index d85586c66..69ab7ac86 100644
--- a/.opencode/agent/triage.md
+++ b/.opencode/agent/triage.md
@@ -1,7 +1,7 @@
 ---
 mode: primary
 hidden: true
-model: kilo/minimax/minimax-m2.5
+model: openai/gpt-5-nano
 color: "#44BA81"
 tools:
   "*": false
@@ -14,95 +14,38 @@ Use your github-triage tool to triage issues.
 
 This file is the source of truth for ownership/routing rules.
 
-## Labels
+Assign issues by choosing the team with the strongest overlap. The github-triage tool will assign a random member from that team.
 
-### windows
+Do not add labels to issues. Only assign an owner.
 
-Use for any issue that mentions Windows (the OS). Be sure they are saying that they are on Windows.
+When calling github-triage, pass one of these team values: tui, desktop_web, core, inference, windows, jetbrains, extension
 
-- Use if they mention WSL too
+## Teams
 
-#### perf
+### TUI
 
-Performance-related issues:
+Terminal UI issues, including rendering, keybindings, scrolling, terminal compatibility, SSH behavior, crashes in the TUI, and low-level TUI performance.
 
-- Slow performance
-- High RAM usage
-- High CPU usage
+### Desktop / Web
 
-**Only** add if it's likely a RAM or CPU issue. **Do not** add for LLM slowness.
+Desktop application and browser-based app issues, including `opencode web`, desktop-specific UI behavior, packaging, and web view problems.
 
-#### nix
+### Core
 
-**Only** add if the issue explicitly mentions nix.
+Core opencode server and harness issues, including sqlite, snapshots, memory, API behavior, agent context construction, tool execution, provider integrations, model behavior, documentation, and larger architectural features.
 
-If the issue does not mention nix, do not add nix.
```

#### .opencode/tool/github-triage.ts
```diff
diff --git a/.opencode/tool/github-triage.ts b/.opencode/tool/github-triage.ts
index 8f80f8685..ce07fdebc 100644
--- a/.opencode/tool/github-triage.ts
+++ b/.opencode/tool/github-triage.ts
@@ -1,15 +1,16 @@
 /// <reference path="../env.d.ts" />
 import { tool } from "@kilocode/plugin"
+
+// kilocode_change start
 const TEAM = {
-  desktop: ["adamdotdevin", "iamdavidhill", "Brendonovich", "nexxeln"],
-  zen: ["fwang", "MrMushrooooom"],
-  tui: ["kommander", "rekram1-node", "simonklee"],
-  core: ["kitlangton", "rekram1-node", "jlongster"],
-  docs: ["R44VC0RP"],
-  windows: ["Hona"],
+  tui: ["catrielmuller"],
+  desktop_web: ["markijbema"],
+  core: ["markijbema", "marius-kilocode", "catrielmuller", "chrarnoldus", "imanolmzd-svg"],
+  jetbrains: ["kirillk"],
+  inference: ["chrarnoldus", "markijbema"],
+  windows: ["catrielmuller"],
 } as const
-
-const ASSIGNEES = [...new Set(Object.values(TEAM).flat())]
+// kilocode_change end
 
 function pick<T>(items: readonly T[]) {
   return items[Math.floor(Math.random() * items.length)]!
@@ -38,70 +39,27 @@ async function githubFetch(endpoint: string, options: RequestInit = {}) {
 }
 
 export default tool({
-  description: `Use this tool to assign and/or label a GitHub issue.
-
-Choose labels and assignee using the current triage policy and ownership rules.
-Pick the most fitting labels for the issue and assign one owner.
+  description: `Use this tool to assign a GitHub issue.
 
-If unsure, choose the team/section with the most overlap with the issue and assign a member from that team at random.`,
+Provide the team that should own the issue. This tool picks a random assignee from that team and does not apply labels.`,
   args: {
-    assignee: tool.schema
-      .enum(["thdxr", "adamdotdevin", "rekram1-node", "fwang", "jayair", "kommander"])
-      .describe("The username of the assignee")
-      .default("rekram1-node"),
-    labels: tool.schema
-      .array(tool.schema.enum(["nix", "opentui", "perf", "desktop", "zen", "docs", "windows"]))
-      .describe("The labels(s) to add to the issue")
-      .default([]),
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 9f1fd76ff..a06949867 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.0",
+  "version": "7.3.7",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/filesystem.ts
```diff
diff --git a/packages/core/src/filesystem.ts b/packages/core/src/filesystem.ts
index bc149d586..2e7a450d9 100644
--- a/packages/core/src/filesystem.ts
+++ b/packages/core/src/filesystem.ts
@@ -46,6 +46,7 @@ export namespace AppFileSystem {
     readonly isDir: (path: string) => Effect.Effect<boolean>
     readonly isFile: (path: string) => Effect.Effect<boolean>
     readonly existsSafe: (path: string) => Effect.Effect<boolean>
+    readonly readFileStringSafe: (path: string) => Effect.Effect<string | undefined, Error>
     readonly readJson: (path: string) => Effect.Effect<unknown, Error>
     readonly writeJson: (path: string, data: unknown, mode?: number) => Effect.Effect<void, Error>
     readonly ensureDir: (path: string) => Effect.Effect<void, Error>
@@ -69,6 +70,12 @@ export namespace AppFileSystem {
         return yield* fs.exists(path).pipe(Effect.orElseSucceed(() => false))
       })
 
+      const readFileStringSafe = Effect.fn("FileSystem.readFileStringSafe")(function* (path: string) {
+        return yield* fs
+          .readFileString(path)
+          .pipe(Effect.catchReason("PlatformError", "NotFound", () => Effect.succeed(undefined)))
+      })
+
       const isDir = Effect.fn("FileSystem.isDir")(function* (path: string) {
         const info = yield* fs.stat(path).pipe(Effect.catch(() => Effect.void))
         return info?.type === "Directory"
@@ -195,6 +202,7 @@ export namespace AppFileSystem {
       return Service.of({
         ...fs,
         existsSafe,
+        readFileStringSafe,
         isDir,
         isFile,
         readDirectoryEntries,
```

#### packages/core/src/flag/flag.ts
```diff
diff --git a/packages/core/src/flag/flag.ts b/packages/core/src/flag/flag.ts
index ff01b402d..ffcf86728 100644
--- a/packages/core/src/flag/flag.ts
+++ b/packages/core/src/flag/flag.ts
@@ -1,4 +1,5 @@
 import { Config } from "effect"
+import { InstallationChannel } from "../installation/version"
 
 function truthy(key: string) {
   const value = process.env[key]?.toLowerCase()
@@ -10,6 +11,10 @@ function falsy(key: string) {
   return value === "false" || value === "0"
 }
 
+// Channels that default to the new effect-httpapi server backend. The legacy
+// hono backend remains the default for stable (`prod`/`latest`) installs.
+const HTTPAPI_DEFAULT_ON_CHANNELS = new Set(["dev", "beta", "local"])
+
 function number(key: string) {
   const value = process.env[key]
   if (!value) return undefined
@@ -78,8 +83,16 @@ export const Flag = {
   KILO_STRICT_CONFIG_DEPS: truthy("KILO_STRICT_CONFIG_DEPS"),
 
   KILO_WORKSPACE_ID: process.env["KILO_WORKSPACE_ID"],
-  KILO_EXPERIMENTAL_HTTPAPI: truthy("KILO_EXPERIMENTAL_HTTPAPI"),
+  // Defaults to true on dev/beta/local channels so internal users exercise the
+  // new effect-httpapi server backend. Stable (`prod`/`latest`) installs stay
+  // on the legacy hono backend until the rollout is complete. An explicit env
+  // var ("true"/"1" or "false"/"0") always wins, providing an opt-in for
+  // stable users and an escape hatch for dev/beta users.
+  KILO_EXPERIMENTAL_HTTPAPI:
+    truthy("KILO_EXPERIMENTAL_HTTPAPI") ||
+    (!falsy("KILO_EXPERIMENTAL_HTTPAPI") && HTTPAPI_DEFAULT_ON_CHANNELS.has(InstallationChannel)),
   KILO_EXPERIMENTAL_WORKSPACES: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_WORKSPACES"),
+  KILO_EXPERIMENTAL_EVENT_SYSTEM: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_EVENT_SYSTEM"),
 
   // Evaluated at access time (not module load) because tests, the CLI, and
   // external tooling set these env vars at runtime.
```


*... and more files (showing first 5)*

## opencode Changes (2339aac..76d9c2c)

### Commits

(no commits)

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
(no changes)

#### Other Changes
(no changes)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from .opencode/agent/triage.md
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/filesystem.ts
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/core/` - review core changes from packages/core/src/util/log.ts
- `src/core/` - review core changes from packages/core/test/filesystem/filesystem.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/allow-everything.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/routes.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/env-read.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/external-directory-allow.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.always-rules.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.reply-http.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.reply-routing.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.test.ts
- `src/tool/apply_patch.test.ts` - update based on kilocode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/edit.test.ts` - update based on kilocode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/external-directory.test.ts` - update based on kilocode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/github-triage.ts` - update based on kilocode .opencode/tool/github-triage.ts changes
- `src/tool/glob.test.ts` - update based on kilocode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/grep.test.ts` - update based on kilocode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/id.ts` - update based on kilocode packages/opencode/src/tool/shell/id.ts changes
- `src/tool/parameters.test.ts` - update based on kilocode packages/opencode/test/tool/parameters.test.ts changes
- `src/tool/prompt.ts` - update based on kilocode packages/opencode/src/tool/shell/prompt.ts changes
- `src/tool/question.test.ts` - update based on kilocode packages/opencode/test/tool/question.test.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/recall.test.ts` - update based on kilocode packages/opencode/test/tool/recall.test.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/shell.txt}.ts` - update based on kilocode packages/opencode/src/tool/{bash.txt => shell/shell.txt} changes
- `src/tool/truncation.test.ts` - update based on kilocode packages/opencode/test/tool/truncation.test.ts changes
- `src/tool/webfetch.test.ts` - update based on kilocode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/webfetch.ts` - update based on kilocode packages/opencode/src/tool/webfetch.ts changes
- `src/tool/write.test.ts` - update based on kilocode packages/opencode/test/tool/write.test.ts changes
- `src/tool/{bash.test.ts => shell.test.ts}.ts` - update based on kilocode packages/opencode/test/tool/{bash.test.ts => shell.test.ts} changes
- `src/tool/{bash.ts => shell.ts}.ts` - update based on kilocode packages/opencode/src/tool/{bash.ts => shell.ts} changes
