# Upstream Changes Report
Generated: 2026-06-04 09:57:12

## Summary
- kilocode: 187 commits, 530 files changed
- opencode: 41 commits, 519 files changed

## kilocode Changes (66f053a38..38eb5879f)

### Commits

- 38eb5879f - Merge pull request #10862 from Kilo-Org/chrarnoldus-patch-1 (Christiaan Arnoldus, 2026-06-04)
- b7ce077c9 - release: v7.3.29 (kilo-maintainer[bot], 2026-06-04)
- 1c8653130 - Merge pull request #10892 from Kilo-Org/jetbrains/release/v7.0.1-rc.6 (Kirill Kalishev, 2026-06-03)
- 797027422 - Update CHANGELOG.md (Kirill Kalishev, 2026-06-03)
- 089770ad7 - release(jetbrains): v7.0.1-rc.6 (kilo-maintainer[bot], 2026-06-03)
- a4cdb1649 - Merge pull request #10889 from Kilo-Org/jetbrains/release/v7.0.1-rc.5 (Kirill Kalishev, 2026-06-03)
- 287d15423 - fix(jetbrains): use tooltip html helper (kirillk, 2026-06-03)
- fbb118d8f - fix(jetbrains): update model picker training disclosure (kirillk, 2026-06-03)
- 3227a8ab2 - fix(jetbrains): position session model picker above control (kirillk, 2026-06-03)
- 8bc1ea02f - Update CHANGELOG.md by removing 7.3.23 section (Kirill Kalishev, 2026-06-03)
- fd6c6a858 - docs(jetbrains): clarify rc changelog (kirillk, 2026-06-03)
- 19db7e69c - Merge pull request #10887 from Kilo-Org/docs/security-architecture-content (Jean du Plessis, 2026-06-03)
- 6feabcb1f - release(jetbrains): v7.0.1-rc.5 (kilo-maintainer[bot], 2026-06-03)
- e27ea8ab7 - Merge pull request #9976 from Kilo-Org/crystalline-dive (Kirill Kalishev, 2026-06-03)
- b89d4ea02 - Extract Marketplace logic from KiloProvider (#10850) (Imanol Maiztegui, 2026-06-03)
- 9e065d84c - docs(jetbrains): move log helper notes (kirillk, 2026-06-03)
- 41e50ab5f - test(cli): rollback prompt timeout (kirillk, 2026-06-03)
- aa5c0fbfa - chore(jetbrains): move dev log helper (kirillk, 2026-06-03)
- 01df91d87 - test: stabilize PR checks (kirillk, 2026-06-03)
- b6ba97a09 - release: v7.3.28 (kilo-maintainer[bot], 2026-06-03)
- d8ee60add - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-03)
- ac02d821b - Merge pull request #10822 from Kilo-Org/marius-kilocode/kilo-opencode-v1.14.46 (Marius, 2026-06-03)
- 8b1ee6628 - fix: restore routed APIs and task restrictions (marius-kilocode, 2026-06-03)
- ec6eebb85 - docs(kilo-docs): clarify architecture documentation (Jean du Plessis, 2026-06-03)
- 95b12ffcb - docs(kilo-docs): expand architecture docs (Jean du Plessis, 2026-06-03)
- 454b1a219 - Revert "fix(cli): add node types dependency" (kirillk, 2026-06-03)
- 90ab22a00 - fix(cli): add node types dependency (kirillk, 2026-06-03)
- 73d641ae2 - Merge pull request #10839 from Kilo-Org/generated-flame (Kirill Kalishev, 2026-06-03)
- 82cfbc081 - Merge remote-tracking branch 'origin/main' into crystalline-dive (kirillk, 2026-06-03)
- e03be2b96 - fix(cli): restore zstd worker bindings (kirillk, 2026-06-03)
- 18e1ed99e - fix(jetbrains): align prompt view padding (kirillk, 2026-06-03)
- 855a1015a - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-03)
- 31ea7bc79 - Merge branch 'main' into generated-flame (Kirill Kalishev, 2026-06-03)
- f12f5b93d - build(types): remove direct node type dependency (kirillk, 2026-06-03)
- 18493c659 - build(types): add node type dependency (kirillk, 2026-06-03)
- b933703e1 - fix(cli): restore native zstd imports (kirillk, 2026-06-03)
- 6cfd2dd0b - build(deps): bump bun from 1.3.13 to 1.3.14 (#10884) (Imanol Maiztegui, 2026-06-03)
- 52a517e8b - Merge remote-tracking branch 'origin/main' into generated-flame (kirillk, 2026-06-03)
- 33333e44c - fix(cli): type zstd runtime imports (kirillk, 2026-06-03)
- a60db52ca - fix(cli): remove zstd declaration shim (kirillk, 2026-06-03)
- 3d648795e - fix(jetbrains): refine session view styling (kirillk, 2026-06-03)
- bb35fd799 - Merge pull request #10880 from Kilo-Org/useful-neem (Joshua Lambert, 2026-06-03)
- 80bd352ec - Merge remote-tracking branch 'origin/main' into generated-flame (kirillk, 2026-06-03)
- 8c5d24bf2 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-03)
- 002e75570 - Merge pull request #10883 from Kilo-Org/sophisticated-octave (Catriel Müller, 2026-06-03)
- 33a1f3949 - fix(cli): expand free model training disclosure (Josh Lambert, 2026-06-03)
- b78055379 - build(types): upgrade @types/node to 24.12.4 (#10860) (Imanol Maiztegui, 2026-06-03)
- ae6f3c0e0 - fix(jetbrains): refresh markdown after theme changes (kirillk, 2026-06-03)
- 1cdc39856 - fix(cli): restore packaged console startup (Catriel Müller, 2026-06-03)
- ac5104ea4 - fix(jetbrains): address session UI review feedback (kirillk, 2026-06-03)
- e356f068d - fix: clarify free model training disclosure (Josh Lambert, 2026-06-03)
- 9a938ff5a - Merge branch 'main' into chrarnoldus-patch-1 (Imanol Maiztegui, 2026-06-03)
- 1a7532528 - Merge branch 'main' into crystalline-dive (Kirill Kalishev, 2026-06-03)
- 57627c2e8 - ci(codeql): split Kotlin analysis into dedicated workflow (#10869) (Imanol Maiztegui, 2026-06-03)
- 916c2d539 - Merge pull request #10870 from Kilo-Org/add-opencode-keywords (Rietie, 2026-06-03)
- 4ecef9e2f - Merge pull request #10864 from Kilo-Org/fix-10857-gateway-statuses (Marius, 2026-06-03)
- eba939e41 - fix(cli): address Kilo gateway review feedback (marius-kilocode, 2026-06-03)
- 9a747af1d - Merge pull request #10863 from Kilo-Org/fix-10858-kilo-next-edit (Marius, 2026-06-03)
- 5e32fe487 - Merge remote-tracking branch 'origin/main' into fix-10857-gateway-statuses (marius-kilocode, 2026-06-03)
- 54a5d9f62 - fix(cli): type node zstd bindings locally (kirillk, 2026-06-03)
- cadbe4018 - Merge pull request #10861 from Kilo-Org/fix-10856-gateway-nullability (Marius, 2026-06-03)
- 27eb82adc - Merge remote-tracking branch 'origin/main' into crystalline-dive (kirillk, 2026-06-03)
- ad4263318 - fix(jetbrains): add missing localized bundle keys (kirillk, 2026-06-03)
- ec51a8e95 - Merge pull request #10853 from Kilo-Org/refactor/shared-diff-review-ui (Marius, 2026-06-03)
- 8b912f665 - Merge remote-tracking branch 'origin/main' into generated-flame (kirillk, 2026-06-03)
- 77076dcb3 - Merge pull request #10801 from Kilo-Org/certain-barnacle (Kirill Kalishev, 2026-06-03)
- db16a80ed - vscode: add opencode and open code as keywords (kiloconnect[bot], 2026-06-03)
- 492c85d70 - fix(cli): move zstd typings to declaration (kirillk, 2026-06-03)
- 3b5dc47c7 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-03)
- 124081df1 - chore(cli): drop local zstd typing workaround (kirillk, 2026-06-03)
- b0e93eaa2 - Merge branch 'main' into refactor/shared-diff-review-ui (Marius, 2026-06-03)
- df3119f64 - chore: remove local planning artifacts (kirillk, 2026-06-03)
- a56c5471c - Merge pull request #10865 from Kilo-Org/linen-dracorex (Catriel Müller, 2026-06-03)
- 557d6ad02 - fix(cli): preserve Kilo gateway error statuses (marius-kilocode, 2026-06-03)
- 9c561074b - feat(cli): add animated console loading screens (Catriel Müller, 2026-06-03)
- c4de1acdf - chore(cli): add Mistral reasoning changeset (chrarnoldus, 2026-06-03)
- e0f9bae4f - Merge pull request #10854 from Kilo-Org/fix/ci-unit-timeout (Marius, 2026-06-03)
- 35aa9bbbb - fix(cli): restore Kilo Gateway next edit proxying (marius-kilocode, 2026-06-03)
- fa41bb796 - Add additional Mistral model IDs for reasoning (Christiaan Arnoldus, 2026-06-03)
- fc4cf10b0 - fix(sdk): preserve nullable Kilo gateway fields (marius-kilocode, 2026-06-03)
- a0c91eb07 - fix(ci): restore workflow change annotation (marius-kilocode, 2026-06-03)
- 02f226d41 - chore(ci): remove workflow change marker (marius-kilocode, 2026-06-03)
- cdf46c973 - fix(vscode): use brain circuit for data disclosure (#10847) (Igor Šćekić, 2026-06-03)
- 99407ef83 - fix(ci): cap stalled unit jobs at 45 minutes (marius-kilocode, 2026-06-03)
- 52aa8c0ee - refactor(vscode): extract shared diff review UI (marius-kilocode, 2026-06-03)
- ebc169d1f - Merge pull request #10849 from Kilo-Org/ultra-traffic (Marius, 2026-06-03)
- a6b005dfe - fix: restore cloud session previews (marius-kilocode, 2026-06-03)
- 94fc42255 - fix(jetbrains): support numeric session summaries (marius-kilocode, 2026-06-03)
- 000607285 - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.14.46 (marius-kilocode, 2026-06-03)
- b1ade4b2e - Merge branch 'main' into marius-kilocode/kilo-opencode-v1.14.46 (Marius, 2026-06-03)
- b2b34a803 - test(kilo-jetbrains): align config action expectations (kirillk, 2026-06-03)
- 3462fa012 - fix(kilo-jetbrains): address config review feedback (kirillk, 2026-06-02)
- 2a05e0252 - fix(jetbrains): reuse editor style font in markdown (kirillk, 2026-06-02)
- 7d1f6ae5f - fix(cli): type zstd worker helpers (kirillk, 2026-06-02)
- cf9a0a488 - fix(kilo-jetbrains): preserve empty model selection (kirillk, 2026-06-02)
- 27feaa02b - Merge remote-tracking branch 'origin/main' into crystalline-dive (kirillk, 2026-06-02)
- 947985289 - Merge branch 'main' into generated-flame (kirillk, 2026-06-02)
- 7c121dbbf - fix(cli): update worktree family effect test (kirillk, 2026-06-02)
- e86d44514 - fix(kilo-jetbrains): restore last kilo settings page (kirillk, 2026-06-02)
- 87b0cf15d - fix(jetbrains): use semantic session timeline colors (kirillk, 2026-06-02)
- d47085948 - fix(kilo-jetbrains): shorten cli action labels (kirillk, 2026-06-02)
- d3e189a90 - fix(kilo-jetbrains): resolve config action labels (kirillk, 2026-06-02)
- 8c06a3b78 - fix(jetbrains): improve session UI retained updates (kirillk, 2026-06-02)
- 138a58f80 - feat(kilo-jetbrains): add settings config file actions (kirillk, 2026-06-02)
- 750bb7789 - fix(jetbrains): confine session subscriptions to EDT (kirillk, 2026-06-02)
- 7e856a57c - fix(kilo-jetbrains): polish profile and picker UI (kirillk, 2026-06-02)
- 56b0834db - fix(jetbrains): dispose hidden session UIs after timeout (kirillk, 2026-06-02)
- ebeb65ad7 - refactor(kilo-jetbrains): unify settings base lifecycle (kirillk, 2026-06-02)
- b4ac8fac4 - refactor(kilo-jetbrains): move settings workspace lifecycle to base (kirillk, 2026-06-02)
- 7adb134f2 - chore(jetbrains): add session event log helper (kirillk, 2026-06-02)
- fe4d6b940 - docs(jetbrains): document session event logging (kirillk, 2026-06-02)
- d00178562 - fix(jetbrains): preserve streamed chat markdown (kirillk, 2026-06-02)
- b2a989f5c - refactor(kilo-jetbrains): centralize settings EDT checks (kirillk, 2026-06-02)
- da86d255b - refactor(kilo-jetbrains): extract base settings UI (kirillk, 2026-06-02)
- 9d43f4dde - fix(kilo-jetbrains): stabilize model settings saves (kirillk, 2026-06-02)
- 709efd09a - fix(kilo-jetbrains): log settings saves (kirillk, 2026-06-02)
- 218310284 - fix(kilo-jetbrains): stabilize model settings layout (kirillk, 2026-06-02)
- 1856776d8 - revert(jetbrains): remove sync-only compatibility shim (marius-kilocode, 2026-06-02)
- 03029eea4 - fix(kilo-jetbrains): surface model settings save failures (kirillk, 2026-06-02)
- ce3851f5b - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.14.46 (marius-kilocode, 2026-06-02)
- e17c4f936 - fix(jetbrains): stop duplicated streaming text in chat code blocks (kirillk, 2026-06-02)
- ede4369ba - fix(kilo-jetbrains): show settings progress as overlay (kirillk, 2026-06-02)
- 344df31dc - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.14.46 (marius-kilocode, 2026-06-02)
- 2a3975ea2 - fix(jetbrains): support copying session text (kirillk, 2026-06-02)
- aeef0df2f - resolve merge conflicts (marius-kilocode, 2026-06-02)
- 729a1ae5e - merge: record upstream v1.14.46 (marius-kilocode, 2026-06-02)
- 4472e6d76 - refactor: kilo compat for v1.14.46 (marius-kilocode, 2026-06-02)
- cf0fd63f0 - fix(kilo-jetbrains): stabilize models settings pickers (kirillk, 2026-06-01)
- bee54755f - fix(jetbrains): dispose embedded markdown editors (kirillk, 2026-06-01)
- 910f4a6c3 - fix(kilo-jetbrains): show sign-in banner in models settings (kirillk, 2026-06-01)
- fdcfe107b - Merge remote-tracking branch 'origin/main' into certain-barnacle (kirillk, 2026-06-01)
- 746b33e0e - fix(jetbrains): expand markdown code block language resolution (kirillk, 2026-06-01)
- 8bbefb330 - fix(jetbrains): avoid config update SSE race (kirillk, 2026-06-01)
- cb99e77ca - fix(jetbrains): dispose empty session feedback balloon (kirillk, 2026-06-01)
- d437a4d3b - refactor(jetbrains): refine empty session feedback UI (kirillk, 2026-06-01)
- 50f4d28e0 - fix(jetbrains): expand markdown code blocks (kirillk, 2026-06-01)
- 253f8351e - feat(kilo-jetbrains): add models settings (kirillk, 2026-06-01)
- 076d8ab13 - feat(jetbrains): add empty session feedback UI (kirillk, 2026-06-01)
- 9d0b9d9eb - Merge remote-tracking branch 'origin/main' into crystalline-dive (kirillk, 2026-06-01)
- dfcb62351 - test(jetbrains): stabilize session controller construction (kirillk, 2026-05-28)
- 986b53211 - Merge remote-tracking branch 'origin/main' into crystalline-dive (kirillk, 2026-05-28)
- d802b0a27 - release: v1.14.46 (opencode, 2026-05-10)
- e1c1193f3 - chore: generate (opencode-agent[bot], 2026-05-10)
- 29250a0ef - fix(session): loosen remaining stored numeric schemas to tolerate legacy data (#26622) (Kit Langton, 2026-05-09)
- c6e6bdf59 - fix(session): tolerate negative token counts in stored parts (#26620) (Kit Langton, 2026-05-09)
- d80e1199c - chore: generate (opencode-agent[bot], 2026-05-10)
- 10ea59066 - feat(skill): built-in opencode-meta skill (#26617) (Kit Langton, 2026-05-09)
- 79d6b10d7 - fix(mcp): tolerate output schema ref failures (#26614) (Kit Langton, 2026-05-09)
- 6e78f36a0 - Narrow HTTP API numeric query overrides (#26618) (Kit Langton, 2026-05-09)
- 16866e118 - Share HTTP API boolean query schema (#26615) (Kit Langton, 2026-05-09)
- 6d130e5de - chore: generate (opencode-agent[bot], 2026-05-10)
- e30d8173c - Fix OpenAPI workspace query drift (#26609) (Kit Langton, 2026-05-09)
- 9e192da98 - Merge remote-tracking branch 'origin/main' into crystalline-dive (kirillk, 2026-05-09)
- 7a79f3a5e - sync release versions for v1.14.45 (opencode, 2026-05-10)
- b8ca71d30 - fix(task): subagent inherits parent agent's deny rules (Plan Mode security bypass) (#26597) (Kit Langton, 2026-05-09)
- 6849f9682 - refactor(provider): share model status schema (#26595) (Kit Langton, 2026-05-09)
- 00c324829 - fix(config): allow active provider model status (#26592) (Kit Langton, 2026-05-09)
- 818b56dbd - chore: generate (opencode-agent[bot], 2026-05-09)
- 29b5b2478 - fix(tui): aggregate bootstrap request failures (Kit Langton, 2026-05-09)
- 11363170c - fix(sdk): wrap thrown error bodies in Error (Kit Langton, 2026-05-09)
- ba9e4b67e - fix(tool/read): match permission patterns against worktree-relative path (Kit Langton, 2026-05-09)
- bd1029b19 - test(server): cover HttpApi context inheritance (Kit Langton, 2026-05-09)
- 43b51f09d - fix(httpapi): align runtime query schemas with workspace routing params (#26581) (Kit Langton, 2026-05-09)
- c61ab5188 - chore: generate (opencode-agent[bot], 2026-05-09)
- d373c562f - fix(session): accept legacy summary diffs (#26579) (Kit Langton, 2026-05-09)
- 5fa5d876f - chore: generate (opencode-agent[bot], 2026-05-09)
- 805af011c - test(session): regression test for #26574 + mirror loosening on Vcs.FileDiff (#26578) (Kit Langton, 2026-05-09)
- 480aa8b23 - chore: generate (opencode-agent[bot], 2026-05-09)
- d62442bb5 - fix(sessions): allow optional patch field in diff for migrated sessions (#26574) (OpeOginni, 2026-05-09)
- 8602937a3 - test(session): cover workspace-routed messages (#26576) (Kit Langton, 2026-05-09)
- 77da433e0 - fix(session): accept routing params in message list (#26569) (Kit Langton, 2026-05-09)
- ad79f3e0c - chore: generate (opencode-agent[bot], 2026-05-09)
- 6c2dfd2f5 - fix(tui): guard messages.data in session.sync against undefined (#26566) (Kit Langton, 2026-05-09)
- 9a8b54fe6 - Plugin command API shim  (#26564) (Sebastian, 2026-05-09)
- dcdbdb218 - Move schema utilities into core (#26565) (Dax, 2026-05-09)
- 5e49029e7 - fix(provider): isolate plugin model mutations (#26561) (Kit Langton, 2026-05-09)
- 19abadaf2 - sync release versions for v1.14.44 (opencode, 2026-05-09)
- 6fea0178e - fix(server): defer validation error body change (Kit Langton, 2026-05-09)
- ebe9dcf27 - fix(server): return validation error bodies (Kit Langton, 2026-05-09)
- 57efec442 - fix(storage): default workspace time migration (#26556) (Kit Langton, 2026-05-09)
- e22144806 - sync release versions for v1.14.43 (opencode, 2026-05-09)
- 27fa297a4 - fix(server): keep provider lists JSON-safe (#26550) (Kit Langton, 2026-05-09)
- b1cd25de3 - ignore: fix typerrs on dev (#26544) (Aiden Cline, 2026-05-09)
- 780bbb0f3 - sync release versions for v1.14.42 (opencode, 2026-05-09)
- 817cb076a - fix(acp): include tool image attachments in updates (#25128) (Steffen Deusch, 2026-05-09)
- 347526e9f - chore: generate (opencode-agent[bot], 2026-05-09)
- ee727b8bc - fix(jetbrains): render markdown code blocks with scrollable components (kirillk, 2026-05-06)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/task.ts` (+12, -0)
- `packages/opencode/src/tool/read.ts` (+2, -2)
- `packages/opencode/src/tool/registry.ts` (+1, -1)
- `packages/opencode/src/tool/schema.ts` (+2, -2)
- `packages/opencode/src/tool/shell/prompt.ts` (+1, -1)
- `packages/opencode/src/tool/task.ts` (+37, -33)
- `packages/opencode/test/tool/parameters.test.ts` (+1, -1)
- `packages/opencode/test/tool/read.test.ts` (+14, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+2, -2)
- `packages/opencode/src/agent/subagent-permissions.ts` (+33, -0)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+141, -0)

#### Permission System (**/permission/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt` (+16, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt` (+4, -3)
- `packages/opencode/src/permission/index.ts` (+2, -2)
- `packages/opencode/src/permission/schema.ts` (+2, -2)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/flag/flag.ts` (+11, -0)

#### Other Changes
- `.changeset/calm-marketplace-skills-install.md` (+0, -5)
- `.changeset/console-diff-refresh.md` (+0, -5)
- `.changeset/console-favicon.md` (+0, -5)
- `.changeset/fresh-compaction-order.md` (+0, -6)
- `.changeset/mistral-medium-reasoning.md` (+5, -0)
- `.changeset/shell-permission-descriptions.md` (+0, -5)
- `.changeset/stable-tool-scroll.md` (+0, -5)
- `.changeset/steady-review-drafts.md` (+0, -5)
- `.changeset/steady-session-forks.md` (+0, -5)
- `.changeset/vscode-lazy-historical-tool-details.md` (+0, -5)
- `.github/workflows/codeql-kotlin.yml` (+62, -0)
- `.github/workflows/codeql.yml` (+25, -61)
- `.github/workflows/test.yml` (+1, -0)
- `.kilo/plans/1780256109130-stellar-forest.md` (+109, -0)
- `.opencode-version` (+1, -1)
- `.opencode/tui.json` (+2, -3)
- `CONTRIBUTING.md` (+2, -2)
- `bun.lock` (+68, -24)
- `flake.nix` (+7, -7)
- `nix/hashes.json` (+4, -4)
- `package.json` (+4, -4)
- `packages/containers/bun-node/Dockerfile` (+1, -1)
- `packages/{opencode/src/util => core/src}/effect-zod.ts` (+0, -0)
- `packages/{opencode/src/util => core/src}/schema.ts` (+0, -0)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+4, -2)
- `packages/kilo-console/public/logo.lottie` (+-, --)
- `packages/kilo-console/src/components/LoadingLogo.tsx` (+34, -0)
- `packages/kilo-console/src/components/LoadingScreen.tsx` (+20, -0)
- `packages/kilo-console/src/layouts/ConfigLayout.tsx` (+2, -3)
- `packages/kilo-console/src/routes/projects/ProjectConsoleRoute.tsx` (+3, -6)
- `packages/kilo-console/src/routes/projects/ProjectsRoute.tsx` (+3, -6)
- `packages/kilo-console/src/styles.css` (+1, -0)
- `packages/kilo-console/src/styles/loading.css` (+46, -0)
- `packages/kilo-docs/__tests__/heading.test.ts` (+17, -0)
- `packages/kilo-docs/lib/nav/contributing.ts` (+65, -57)
- `packages/kilo-docs/markdoc/nodes/heading.markdoc.ts` (+8, -2)
- `packages/kilo-docs/markdoc/tags/index.ts` (+1, -0)
- `packages/kilo-docs/markdoc/tags/linebreak.markdoc.ts` (+4, -0)
- `packages/kilo-docs/package.json` (+4, -2)
- `packages/kilo-docs/pages/code-with-ai/agents/auto-model.md` (+2, -2)
- `packages/kilo-docs/pages/contributing/architecture/agent-observability.md` (+0, -150)
- `packages/kilo-docs/pages/contributing/architecture/auto-model-tiers.md` (+0, -184)
- `packages/kilo-docs/pages/contributing/architecture/automation-services.md` (+190, -0)
- `packages/kilo-docs/pages/contributing/architecture/benchmarking.md` (+0, -306)
- `packages/kilo-docs/pages/contributing/architecture/cli-runtime.md` (+331, -0)
- `packages/kilo-docs/pages/contributing/architecture/cloud-platform.md` (+397, -0)
- `packages/kilo-docs/pages/contributing/architecture/cloud-security.md` (+427, -0)
- `packages/kilo-docs/pages/contributing/architecture/config-schema.md` (+91, -19)
- `packages/kilo-docs/pages/contributing/architecture/development-patterns.md` (+195, -0)
- `packages/kilo-docs/pages/contributing/architecture/enterprise-mcp-controls.md` (+0, -111)
- `packages/kilo-docs/pages/contributing/architecture/feature-template.md` (+0, -42)
- `packages/kilo-docs/pages/contributing/architecture/features.md` (+0, -23)
- `packages/kilo-docs/pages/contributing/architecture/index.md` (+175, -232)
- `packages/kilo-docs/pages/contributing/architecture/jetbrains-plugin.md` (+160, -0)
- `packages/kilo-docs/pages/contributing/architecture/mcp-oauth-authorization.md` (+0, -572)
- `packages/kilo-docs/pages/contributing/architecture/onboarding-improvements.md` (+0, -148)
- `packages/kilo-docs/pages/contributing/architecture/organization-modes-library.md` (+0, -71)
- `packages/kilo-docs/pages/contributing/architecture/per-message-feedback.md` (+0, -75)
- `packages/kilo-docs/pages/contributing/architecture/track-repo-url.md` (+0, -42)
- `packages/kilo-docs/pages/contributing/architecture/voice-transcription.md` (+0, -133)
- `packages/kilo-docs/pages/contributing/architecture/vscode-extension.md` (+180, -0)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+1, -1)
- `packages/kilo-docs/pages/contributing/features/agent-observability.md` (+94, -0)
- `packages/kilo-docs/pages/contributing/features/benchmarking.md` (+110, -0)
- `packages/kilo-docs/pages/contributing/features/enterprise-mcp-controls.md` (+108, -0)
- `packages/kilo-docs/pages/contributing/features/index.md` (+17, -0)
- `packages/kilo-docs/pages/contributing/features/onboarding-improvements.md` (+72, -0)
- `packages/kilo-docs/pages/contributing/features/template.md` (+73, -0)
- `packages/kilo-docs/pages/contributing/index.md` (+1, -1)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+1, -1)
- `packages/kilo-docs/previous-docs-redirects.js` (+80, -2)
- `packages/kilo-docs/public/img/kiloclaw/kiloclaw-architecture.png` (+-, --)
- `packages/kilo-docs/public/img/organization-modes-library-1.png` (+-, --)
- `packages/kilo-docs/public/img/organization-modes-library-2.png` (+-, --)
- `packages/kilo-docs/public/img/track-repo-url-system-design.png` (+-, --)
- `packages/kilo-docs/public/img/voice-transcription-architecture.png` (+-, --)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/cloud-sessions.ts` (+3, -0)
- `packages/kilo-gateway/test/cloud-sessions.test.ts` (+48, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/.run/Run IDE (Frontend).run.xml` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+8, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+29, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+36, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendConnectionService.kt` (+18, -4)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+79, -70)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+26, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+9, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapper.kt` (+93, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+143, -94)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloConnectionServiceTest.kt` (+86, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+43, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/SessionModelSerializationTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloNotifications.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+0, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenConfigActions.kt` (+74, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenSettingsAction.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloAppService.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+63, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionManager.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionSidePanelManager.kt` (+24, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+53, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+71, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionUpdateQueue.kt` (+35, -21)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+25, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModelEvent.kt` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ReasoningPicker.kt` (+4, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+33, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionRootPanel.kt` (+9, -149)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/account/SessionAccountOverlay.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/EmptySessionFeedback.kt` (+133, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/{ => empty}/EmptySessionPanel.kt` (+39, -156)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/RecentsList.kt` (+200, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+66, -20)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRenderer.kt` (+26, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRows.kt` (+9, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+5, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionSelection.kt` (+257, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionEditorStyle.kt` (+12, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+38, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/LoginRequiredView.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+27, -17)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PlanExitView.kt` (+8, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PromptView.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ReasoningView.kt` (+105, -39)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+24, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ToolView.kt` (+106, -57)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+15, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+33, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartView.kt` (+27, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/BaseQuestionView.kt` (+20, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/PartView.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/PrimarySessionPartView.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/SecondarySessionPartView.kt` (+10, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionResultView.kt` (+25, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionView.kt` (+26, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/todo/TodoWriteView.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurable.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloSettingsSelection.kt` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/BaseContentPanel.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/BaseSettingsUi.kt` (+321, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsPanel.kt` (+80, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsProgressOverlay.kt` (+94, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsRow.kt` (+116, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsTop.kt` (+89, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelSettingPicker.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelsConfigurable.kt` (+66, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelsSettingsState.kt` (+90, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelsSettingsUi.kt` (+302, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/LoggedInProfileUi.kt` (+29, -33)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/LoggedOutProfileUi.kt` (+10, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/UserProfileConfigurable.kt` (+13, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/LayeredOverlayPanel.kt` (+158, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/RoundedContentPanel.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+32, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdCommon.kt` (+77, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdView.kt` (+32, -355)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdViewFactory.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdViewHtmlPane.kt` (+344, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdViewHybrid.kt` (+924, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/book-open-check.svg` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/book-open-check_dark.svg` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/discord.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/discord_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/kilo-profile.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/kilo-profile_dark.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+40, -8)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+48, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+182, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/KiloRecoveryActionsTest.kt` (+155, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionSidePanelManagerTest.kt` (+78, -35)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiFactoryTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ChatLoggingFlowTest.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PromptLifecycleTest.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+10, -10)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionRecoveryTest.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionUpdateQueueTest.kt` (+185, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/SessionModelTest.kt` (+20, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/EmptySessionPanelTest.kt` (+45, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionEditorStyleTest.kt` (+18, -8)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionSelectionCopyTest.kt` (+125, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/account/SessionAccountOverlayTest.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+16, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelPickerTest.kt` (+104, -12)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/selection/SessionSelectionTest.kt` (+72, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionViewTest.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReasoningViewTest.kt` (+13, -12)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TextViewTest.kt` (+61, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+7, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TurnViewTest.kt` (+41, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurableTest.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloSettingsSelectionTest.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/UserProfileConfigurableTest.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/BaseSettingsUiTest.kt` (+253, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/BaseSettingsUiWorkspaceTest.kt` (+191, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsRowsTest.kt` (+251, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/models/ModelSettingPickerTest.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/models/ModelsSettingsStateTest.kt` (+152, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/models/ModelsSettingsUiTest.kt` (+385, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAppRpcApi.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/LayeredOverlayPanelTest.kt` (+116, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/UiStyleTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewFactoryTest.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridTest.kt` (+471, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewLoggingTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewTest.kt` (+32, -15)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/script/dev/part-update.sh` (+134, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloAppRpcApi.kt` (+4, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorkspaceRpcApi.kt` (+17, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ConfigTargetDto.kt` (+10, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+14, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloWorkspaceStateDto.kt` (+7, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/icon.tsx` (+4, -0)
- `packages/kilo-ui/src/components/session-diff.test.ts` (+8, -0)
- `packages/kilo-ui/src/components/session-diff.ts` (+9, -6)
- `packages/kilo-vscode/CHANGELOG.md` (+43, -0)
- `packages/kilo-vscode/docs/mercury-next-edit-testing.html` (+1, -1)
- `packages/kilo-vscode/esbuild.js` (+6, -0)
- `packages/kilo-vscode/knip.json` (+1, -0)
- `packages/kilo-vscode/package.json` (+4, -2)
- `packages/kilo-vscode/script/local-bin.ts` (+8, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+20, -203)
- `packages/kilo-vscode/src/MarketplacePanelProvider.ts` (+290, -0)
- `packages/kilo-vscode/src/SettingsEditorProvider.ts` (+4, -5)
- `packages/kilo-vscode/src/diff/sources/session.ts` (+1, -1)
- `packages/kilo-vscode/src/diff/sources/worktree.ts` (+1, -1)
- `packages/kilo-vscode/src/extension.ts` (+17, -6)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+10, -5)
- `packages/kilo-vscode/src/kilo-provider/remove-config-item.ts` (+39, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+3, -14)
- `packages/kilo-vscode/src/services/marketplace/actions.ts` (+163, -0)
- `packages/kilo-vscode/src/services/marketplace/installer.ts` (+12, -4)
- `packages/kilo-vscode/src/services/marketplace/types.ts` (+1, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+8, -8)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/cloud-session-handler.test.ts` (+92, -0)
- `packages/kilo-vscode/tests/unit/diff-viewer-css-arch.test.ts` (+4, -4)
- `packages/kilo-vscode/tests/unit/file-tree.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/font-size-arch.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/markdown-annotation-layer.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/marketplace-actions.test.ts` (+110, -0)
- `packages/kilo-vscode/tests/unit/marketplace-panel-arch.test.ts` (+36, -0)
- `packages/kilo-vscode/tests/unit/model-preview-data-line.test.ts` (+12, -1)
- `packages/kilo-vscode/tests/unit/model-selector-utils.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/project-directory.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/remove-config-item.test.ts` (+55, -0)
- `packages/kilo-vscode/tests/unit/review-comments.test.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+6, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/ApplyDialog.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+14, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/MultiModelSelector.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/DiffEndMarker.tsx` (+0, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffViewerApp.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/FileTree.tsx` (+0, -0)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/FullScreenDiffView.tsx` (+4, -4)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/MarkdownAnnotationLayer.tsx` (+0, -0)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/MarkdownDiffView.tsx` (+0, -0)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/diff-open-policy.ts` (+0, -0)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/diff-state.ts` (+0, -0)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/file-tree-utils.ts` (+0, -0)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/markdown-annotation-mutation.ts` (+0, -0)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/markdown-comment-ranges.ts` (+0, -0)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/review-annotation-speech.tsx` (+0, -0)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/review-annotations.ts` (+0, -0)
- `packages/kilo-vscode/webview-ui/{agent-manager => diff-viewer}/review-comments.ts` (+0, -0)
- `packages/kilo-vscode/webview-ui/diff-virtual/DiffVirtualApp.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/marketplace/MarketplaceApp.tsx` (+29, -0)
- `packages/kilo-vscode/webview-ui/marketplace/index.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+3, -23)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeSessionTurn.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/InstallModal.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelPreview.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/context/language-bridge.tsx` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/context/marketplace-session.tsx` (+41, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/tsconfig.json` (+8, -1)
- `packages/kilo-web-ui/package.json` (+3, -2)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+37, -0)
- `packages/opencode/migration/20260507164347_add_workspace_time/migration.sql` (+1, -1)
- `packages/opencode/package.json` (+2, -1)
- `packages/opencode/script/postinstall.mjs` (+13, -1)
- `packages/opencode/specs/effect/migration.md` (+2, -2)
- `packages/opencode/specs/effect/schema.md` (+3, -3)
- `packages/opencode/specs/openapi-translation-cleanup.md` (+204, -0)
- `packages/opencode/specs/v2/tui-command-shim.md` (+67, -0)
- `packages/opencode/src/acp/agent.ts` (+68, -62)
- `packages/opencode/src/auth/index.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/export.ts` (+8, -2)
- `packages/opencode/src/cli/cmd/tui/context/aggregate-failures.ts` (+34, -0)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+21, -13)
- `packages/opencode/src/cli/cmd/tui/event.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+6, -1)
- `packages/opencode/src/cli/cmd/tui/plugin/command-shim.ts` (+109, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+3, -0)
- `packages/opencode/src/command/index.ts` (+2, -2)
- `packages/opencode/src/config/agent.ts` (+2, -2)
- `packages/opencode/src/config/command.ts` (+2, -2)
- `packages/opencode/src/config/config.ts` (+4, -4)
- `packages/opencode/src/config/console-state.ts` (+2, -2)
- `packages/opencode/src/config/formatter.ts` (+2, -2)
- `packages/opencode/src/config/layout.ts` (+2, -2)
- `packages/opencode/src/config/lsp.ts` (+2, -2)
- `packages/opencode/src/config/mcp.ts` (+2, -2)
- `packages/opencode/src/config/model-id.ts` (+2, -2)
- `packages/opencode/src/config/parse.ts` (+1, -1)
- `packages/opencode/src/config/permission.ts` (+2, -2)
- `packages/opencode/src/config/plugin.ts` (+2, -2)
- `packages/opencode/src/config/provider.ts` (+4, -3)
- `packages/opencode/src/config/reference.ts` (+2, -2)
- `packages/opencode/src/config/server.ts` (+2, -2)
- `packages/opencode/src/config/skills.ts` (+2, -2)
- `packages/opencode/src/control-plane/schema.ts` (+2, -2)
- `packages/opencode/src/control-plane/types.ts` (+1, -1)
- `packages/opencode/src/file/index.ts` (+2, -2)
- `packages/opencode/src/file/ripgrep.ts` (+2, -2)
- `packages/opencode/src/format/index.ts` (+2, -2)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+16, -2)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+1, -1)
- `packages/opencode/src/kilocode/background-process/index.ts` (+2, -2)
- `packages/opencode/src/kilocode/components/free-model-disclosure.ts` (+2, -2)
- `packages/opencode/src/kilocode/daemon/daemon.ts` (+8, -4)
- `packages/opencode/src/kilocode/indexing-event.ts` (+1, -1)
- `packages/opencode/src/kilocode/provider/provider.ts` (+1, -1)
- `packages/opencode/src/kilocode/review/worktree-diff.ts` (+2, -2)
- `packages/opencode/src/kilocode/server/httpapi/groups/agent-builder.ts` (+6, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/background-process.ts` (+10, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/commit-message.ts` (+5, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/config-console.ts` (+25, -4)
- `packages/opencode/src/kilocode/server/httpapi/groups/enhance-prompt.ts` (+5, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/indexing.ts` (+5, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilo-gateway.ts` (+55, -25)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+7, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/network.ts` (+7, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/remote.ts` (+7, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/session-import.ts` (+8, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/suggestion.ts` (+7, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/telemetry.ts` (+6, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+98, -35)
- `packages/opencode/src/kilocode/server/httpapi/public.ts` (+20, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+5, -0)
- `packages/opencode/src/kilocode/suggestion/index.ts` (+1, -1)
- `packages/opencode/src/lsp/lsp.ts` (+2, -2)
- `packages/opencode/src/markdown.d.ts` (+4, -0)
- `packages/opencode/src/mcp/index.ts` (+46, -8)
- `packages/opencode/src/project/project.ts` (+2, -2)
- `packages/opencode/src/project/schema.ts` (+2, -2)
- `packages/opencode/src/project/vcs.ts` (+10, -7)
- `packages/opencode/src/provider/auth.ts` (+2, -2)
- `packages/opencode/src/provider/model-status.ts` (+9, -0)
- `packages/opencode/src/provider/models.ts` (+2, -1)
- `packages/opencode/src/provider/provider.ts` (+16, -5)
- `packages/opencode/src/provider/schema.ts` (+2, -2)
- `packages/opencode/src/provider/transform.ts` (+4, -0)
- `packages/opencode/src/pty/index.ts` (+2, -2)
- `packages/opencode/src/pty/schema.ts` (+2, -2)
- `packages/opencode/src/pty/ticket.ts` (+1, -1)
- `packages/opencode/src/question/index.ts` (+2, -2)
- `packages/opencode/src/question/schema.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/event.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/config.ts` (+5, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+21, -10)
- `packages/opencode/src/server/routes/instance/httpapi/groups/file.ts` (+10, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/instance.ts` (+17, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/mcp.ts` (+9, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/permission.ts` (+5, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project.ts` (+5, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/provider.ts` (+5, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/pty.ts` (+17, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/query.ts` (+8, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/question.ts` (+4, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+38, -10)
- `packages/opencode/src/server/routes/instance/httpapi/groups/sync.ts` (+6, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/tui.ts` (+14, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/message.ts` (+20, -35)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+30, -54)
- `packages/opencode/src/server/routes/instance/httpapi/groups/workspace.ts` (+8, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/config.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/message.ts` (+1, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/session.ts` (+27, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+0, -26)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts` (+13, -1)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+21, -41)
- `packages/opencode/src/session/message-v2.ts` (+16, -16)
- `packages/opencode/src/session/message.ts` (+7, -7)
- `packages/opencode/src/session/network.ts` (+2, -2)
- `packages/opencode/src/session/prompt.ts` (+11, -5)
- `packages/opencode/src/session/revert.ts` (+2, -2)
- `packages/opencode/src/session/schema.ts` (+2, -2)
- `packages/opencode/src/session/session.ts` (+6, -6)
- `packages/opencode/src/session/status.ts` (+2, -2)
- `packages/opencode/src/session/summary.ts` (+4, -3)
- `packages/opencode/src/session/todo.ts` (+2, -2)
- `packages/opencode/src/share/share-next.ts` (+16, -2)
- `packages/opencode/src/skill/index.ts` (+22, -2)
- `packages/opencode/src/skill/prompt/customize-opencode.md` (+354, -0)
- `packages/opencode/src/snapshot/index.ts` (+9, -6)
- `packages/opencode/src/storage/storage.ts` (+1, -1)
- `packages/opencode/src/sync/index.ts` (+1, -1)
- `packages/opencode/src/sync/schema.ts` (+2, -2)
- `packages/opencode/src/util/named-schema-error.ts` (+1, -1)
- `packages/opencode/src/v2/auth.ts` (+1, -1)
- `packages/opencode/src/v2/event.ts` (+1, -1)
- `packages/opencode/src/v2/model.ts` (+3, -2)
- `packages/opencode/src/v2/session-event.ts` (+8, -8)
- `packages/opencode/src/v2/session.ts` (+1, -1)
- `packages/opencode/test/acp/event-subscription.test.ts` (+179, -2)
- `packages/opencode/test/cli/cmd/tui/aggregate-failures.test.ts` (+55, -0)
- `packages/opencode/test/cli/cmd/tui/sync-fixture.tsx` (+130, -0)
- `packages/opencode/test/cli/cmd/tui/sync-undefined-messages.test.tsx` (+53, -0)
- `packages/opencode/test/cli/cmd/tui/sync.test.tsx` (+1, -128)
- `packages/opencode/test/cli/install-artifact.test.ts` (+35, -0)
- `packages/opencode/test/kilocode/background-process-tool.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/cloud-session-schema.test.ts` (+38, -0)
- `packages/opencode/test/kilocode/daemon.test.ts` (+33, -0)
- `packages/opencode/test/kilocode/free-model-disclosure.test.ts` (+6, -1)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+1, -1)
- `packages/opencode/test/kilocode/server/httpapi-kilo-edit.test.ts` (+221, -0)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+110, -0)
- `packages/opencode/test/kilocode/server/kilo-gateway-statuses.test.ts` (+183, -0)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+107, -2)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+67, -1)
- `packages/opencode/test/preload.ts` (+5, -0)
- `packages/opencode/test/provider/model-status.test.ts` (+61, -0)
- `packages/opencode/test/server/httpapi-config.test.ts` (+37, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+113, -1)
- `packages/opencode/test/server/httpapi-promptasync-context.test.ts` (+189, -0)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+185, -0)
- `packages/opencode/test/server/httpapi-query-schema-drift.test.ts` (+282, -0)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+9, -1)
- `packages/opencode/test/server/httpapi-session.test.ts` (+37, -0)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+1, -1)
- `packages/opencode/test/server/negative-tokens-regression.test.ts` (+97, -0)
- `packages/opencode/test/server/sdk-error-shape.test.ts` (+74, -0)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+81, -0)
- `packages/opencode/test/server/session-messages.test.ts` (+24, -1)
- `packages/opencode/test/session/schema-decoding.test.ts` (+20, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+1, -1)
- `packages/opencode/test/storage/workspace-time-migration.test.ts` (+43, -0)
- `packages/opencode/test/util/effect-zod.test.ts` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/plugin/src/tui.ts` (+43, -0)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/client.ts` (+2, -0)
- `packages/sdk/js/src/error-interceptor.ts` (+52, -0)
- `packages/sdk/js/src/gen/types.gen.ts` (+2, -2)
- `packages/sdk/js/src/v2/client.ts` (+2, -19)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+20, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+144, -127)
- `packages/sdk/openapi.json` (+1443, -1343)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/session-diff.ts` (+2, -1)
- `packages/ui/src/components/session-review.tsx` (+7, -2)
- `packages/ui/src/components/session-turn.tsx` (+9, -2)
- `packages/ui/src/components/timeline-playground.stories.tsx` (+1, -1)
- `script/check-workflows.ts` (+1, -0)
- `script/upstream/package.json` (+2, -2)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ddfaf9d4a..cc5c9246b 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.22",
+  "version": "7.3.29",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/flag/flag.ts
```diff
diff --git a/packages/core/src/flag/flag.ts b/packages/core/src/flag/flag.ts
index 262d8919c..95c8e0163 100644
--- a/packages/core/src/flag/flag.ts
+++ b/packages/core/src/flag/flag.ts
@@ -1,4 +1,5 @@
 import { Config } from "effect"
+import { InstallationChannel } from "../installation/version"
 
 function truthy(key: string) {
   const value = process.env[key]?.toLowerCase()
@@ -10,6 +11,13 @@ function falsy(key: string) {
   return value === "false" || value === "0"
 }
 
+// Channels where new experiments default to ON (unstable / internal users).
+// Stable channels (`prod`, `latest`) stay opt-in.
+const UNSTABLE_CHANNELS = new Set(["dev", "beta", "local"])
+function unstableDefault(key: string) {
+  return truthy(key) || (!falsy(key) && UNSTABLE_CHANNELS.has(InstallationChannel))
+}
+
 function number(key: string) {
   const value = process.env[key]
   if (!value) return undefined
@@ -47,6 +55,9 @@ export const Flag = {
   KILO_DISABLE_CLAUDE_CODE_PROMPT: KILO_DISABLE_CLAUDE_CODE || truthy("KILO_DISABLE_CLAUDE_CODE_PROMPT"),
   KILO_DISABLE_CLAUDE_CODE_SKILLS,
   KILO_DISABLE_EXTERNAL_SKILLS: truthy("KILO_DISABLE_EXTERNAL_SKILLS"), // kilocode_change
+  // Default-on for dev/beta/local; opt-in for stable. Set
+  // KILO_EXPERIMENTAL_CUSTOMIZE_SKILL=false to force off, =true to force on.
+  KILO_EXPERIMENTAL_CUSTOMIZE_SKILL: unstableDefault("KILO_EXPERIMENTAL_CUSTOMIZE_SKILL"),
   KILO_FAKE_VCS: process.env["KILO_FAKE_VCS"],
   KILO_SERVER_PASSWORD: process.env["KILO_SERVER_PASSWORD"],
   KILO_SERVER_USERNAME: process.env["KILO_SERVER_USERNAME"],
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
index b35fbb9f9..d6584f0f0 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
@@ -6,10 +6,11 @@ import ai.kilocode.client.session.model.PermissionFileDiff
 import ai.kilocode.client.session.model.PermissionRequestState
 import ai.kilocode.client.session.ui.SessionView
 import ai.kilocode.client.session.views.base.BaseQuestionView
+import ai.kilocode.client.session.ui.selection.SessionSelection
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionEditorStyleTarget
 import ai.kilocode.client.session.ui.style.SessionUiStyle
-import ai.kilocode.client.session.ui.style.SessionUiStyle.View.CARD_LAYOUT_GAP
+import ai.kilocode.client.session.ui.style.SessionUiStyle.View.SESSION_VIEW_GAP
 import ai.kilocode.client.ui.UiStyle
 import ai.kilocode.client.ui.layout.HAlign
 import ai.kilocode.client.ui.layout.Stack
@@ -17,6 +18,8 @@ import ai.kilocode.client.ui.layout.VAlign
 import ai.kilocode.client.ui.layout.align
 import ai.kilocode.rpc.dto.PermissionReplyDto
 import com.intellij.icons.AllIcons
+import com.intellij.openapi.Disposable
+import com.intellij.openapi.util.Disposer
 import com.intellij.ui.ColorUtil
 import com.intellij.ui.components.JBHtmlPane
 import com.intellij.ui.components.JBHtmlPaneConfiguration
@@ -42,18 +45,20 @@ import javax.swing.text.html.StyleSheet
  */
 class PermissionView(
     private val reply: (String, PermissionReplyDto) -> Unit,
+    private val selection: SessionSelection? = null,
 ) : BorderLayoutPanel(), SessionEditorStyleTarget, SessionView {
     override val sessionViewKind = SessionView.Kind.Default
 
     private var requestId: String? = null
     private var style = SessionEditorStyle.current()
 
-    private val card = BaseQuestionView()
+    private val card = BaseQuestionView(selection)
 
     private val body = Stack.vertical()
 
     // Track target panes for style updates
     private val panes = mutableListOf<JBHtmlPane>()
+    private val regs = mutableListOf<Disposable>()
     private val diffViews = mutableListOf<PermissionDiffView>()
 
     private val ID_DENY = "deny"
@@ -79,6 +84,7 @@ class PermissionView(
         card.setHeader(KiloBundle.message("session.permission.title"))
```

#### packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt b/packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt
index 5d78b8479..1e6c3a281 100644
--- a/packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt
+++ b/packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt
@@ -438,9 +438,9 @@ class PermissionViewTest : BasePlatformTestCase() {
         assertEquals(SessionUiStyle.View.surface(), view.denyButtonForTest().background)
     }
 
-    // ------ code labels use editor style ------
+    // ------ code labels use transcript style ------
 
-    fun `test code label uses editor font family after applyStyle`() {
+    fun `test code label uses ui font family after applyStyle`() {
         view.show(
             Permission(
                 id = "perm_codefont",
@@ -456,7 +456,8 @@ class PermissionViewTest : BasePlatformTestCase() {
 
         val labels = view.codeLabelsForTest()
         assertNotNull("Should have at least one code label for command", labels.firstOrNull())
-        assertEquals("Code label font family should use editor family", "Courier New", labels[0].font.name)
+        assertEquals("Code label font family should use transcript family", style.transcriptFont.name, labels[0].font.name)
+        assertEquals(style.transcriptFont.size, labels[0].font.size)
     }
 
     fun `test permission header uses headerFont not editor font family`() {
```

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index 9b4572eb6..5bc2372e9 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -23,8 +23,8 @@ import { Plugin } from "@/plugin"
 import { Skill } from "../skill"
 import { Effect, Context, Layer, Schema } from "effect"
 import { InstanceState } from "@/effect/instance-state"
-import { zod } from "@/util/effect-zod"
-import { withStatics, type DeepMutable } from "@/util/schema"
+import { zod } from "@opencode-ai/core/effect-zod"
+import { withStatics, type DeepMutable } from "@opencode-ai/core/schema"
 import * as KiloAgent from "@/kilocode/agent" // kilocode_change
 
 type ReferenceEntry = NonNullable<Config.Info["reference"]>[string]
```


*... and more files (showing first 5)*

## opencode Changes (56ec4b6..69cfc44)

### Commits

- 69cfc44 - fix(acp): replay loaded session transcript (#30645) (opencode-agent[bot], 2026-06-04)
- 30ec231 - chore: generate (opencode-agent[bot], 2026-06-04)
- 1ff1910 - feat(core): add command registry (#30624) (Dax, 2026-06-04)
- 70bb710 - refactor(opencode): clean up task tool prompts (#30687) (Aiden Cline, 2026-06-04)
- 51fd7c0 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-04)
- 74a27db - test: wait for shell truncation readiness (#30679) (Aiden Cline, 2026-06-04)
- 9f42bd4 - feat: bump bedrock and add proper mantle support for openai models through aws bedrock (#30464) (Aiden Cline, 2026-06-04)
- 2a33add - fix(opencode): avoid shell cancel race (#30641) (Aiden Cline, 2026-06-03)
- 9251e5d - docs: correct compaction prune default (#30670) (Aiden Cline, 2026-06-03)
- b6305cb - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-04)
- b0a9294 - chore: generate (opencode-agent[bot], 2026-06-04)
- 76ee87e - feat(core): add embedded v2 session runtime and tool foundation (#30632) (Kit Langton, 2026-06-03)
- c352677 - fix(app,ui): session review reactivity and VCS query cache (#30660) (Brendan Allan, 2026-06-04)
- 55bafa2 - feat(app): v2 thinking level selector (#30646) (Luke Parker, 2026-06-04)
- f62ba5e - fix(app): hide unavailable titlebar update (#30642) (Luke Parker, 2026-06-03)
- 04b38ce - chore: generate (opencode-agent[bot], 2026-06-03)
- 0b796c5 - fix(opencode): route SAP AI Core reasoning variants through modelParams (#30482) (Jérôme Benoit, 2026-06-03)
- fa6ea8b - zen: update nvidia tos (Frank, 2026-06-03)
- ee74dd8 - fix(opencode): preserve variant for delegated tasks (#30630) (Aiden Cline, 2026-06-03)
- d3d4335 - chore: remove zed extension and automation (#30628) (Aiden Cline, 2026-06-03)
- 2c32f7e - fix(stats): count all go usage (Adam, 2026-06-03)
- 36234c4 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-03)
- a41f774 - chore: generate (opencode-agent[bot], 2026-06-03)
- 889e0f9 - feat(core): add skill registry and file agent loading (#30617) (Dax, 2026-06-03)
- 9991a33 - fix(core): expose azure openai xhigh efforts (#30620) (Aiden Cline, 2026-06-03)
- 11dbd15 - refactor(core): nest model api id (#30603) (Dax, 2026-06-03)
- af63834 - chore: generate (opencode-agent[bot], 2026-06-03)
- 5900345 - test(core): cover v1 provider option lowering (#30599) (Dax, 2026-06-03)
- a0e4db3 - chore: generate (opencode-agent[bot], 2026-06-03)
- 1520b0d - refactor(core): remove ai sdk option fields (#30581) (Dax, 2026-06-03)
- 7f8412e - fix(openai): preserve websocket idle state (#30586) (Aiden Cline, 2026-06-03)
- 400f0fb - docs(go): add Qwen3.7 Plus model (#30594) (Jack, 2026-06-04)
- d08feda - fix(stats): serve stats og image from banner (Adam, 2026-06-03)
- f4851e3 - fix(tui): route question responses by session directory (#30578) (James Long, 2026-06-03)
- 8851e4d - fix(acp): clean read tool display content (#30569) (Shoubhit Dash, 2026-06-03)
- e707e41 - fix(acp): include external directory permission context (#30567) (Shoubhit Dash, 2026-06-03)
- fc62b3d - fix(acp): classify task as think (#30565) (Shoubhit Dash, 2026-06-03)
- 89b26e8 - fix(acp): classify apply_patch as edit (#30564) (Shoubhit Dash, 2026-06-03)
- 5970f78 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-03)
- 0c31beb - chore: generate (opencode-agent[bot], 2026-06-03)
- 7af6eaf - feat(stats): add geo breakdown (#30456) (Adam, 2026-06-03)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/apply-patch.ts` (+176, -0)
- `packages/core/src/tool/bash.ts` (+206, -0)
- `packages/core/src/tool/builtins.ts` (+43, -0)
- `packages/core/src/tool/edit.ts` (+177, -0)
- `packages/core/src/tool/glob.ts` (+90, -0)
- `packages/core/src/tool/grep.ts` (+106, -0)
- `packages/core/src/tool/question.ts` (+76, -0)
- `packages/core/src/tool/read.ts` (+100, -0)
- `packages/core/src/tool/skill.ts` (+119, -0)
- `packages/core/src/tool/todowrite.ts` (+50, -0)
- `packages/core/src/tool/webfetch.ts` (+224, -0)
- `packages/core/src/tool/websearch.ts` (+258, -0)
- `packages/core/src/tool/write.ts` (+78, -0)
- `packages/opencode/src/tool/read.ts` (+50, -3)
- `packages/opencode/src/tool/registry.ts` (+2, -1)
- `packages/opencode/src/tool/shell.ts` (+18, -5)
- `packages/opencode/src/tool/task.ts` (+43, -50)
- `packages/opencode/src/tool/task.txt` (+6, -5)
- `packages/opencode/test/tool/read.test.ts` (+17, -0)
- `packages/opencode/test/tool/registry.test.ts` (+3, -2)
- `packages/opencode/test/tool/shell.test.ts` (+6, -0)
- `packages/opencode/test/tool/task.test.ts` (+5, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+4, -3)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
- `packages/core/src/event/sql.ts` (+17, -10)

#### Core (**/core/)
- `packages/core/migration/20260603001617_session_message_projection_indexes/migration.sql` (+5, -0)
- `packages/core/migration/20260603001617_session_message_projection_indexes/snapshot.json` (+1636, -0)
- `packages/core/migration/20260603040000_session_message_projection_order/migration.sql` (+5, -0)
- `packages/core/migration/20260603040000_session_message_projection_order/snapshot.json` (+1638, -0)
- `packages/core/migration/20260603141458_session_input_inbox/migration.sql` (+12, -0)
- `packages/core/migration/20260603141458_session_input_inbox/snapshot.json` (+1759, -0)
- `packages/core/migration/20260603160727_jittery_ezekiel_stane/migration.sql` (+4, -0)
- `packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json` (+1869, -0)
- `packages/core/package.json` (+9, -2)
- `packages/core/src/agent.ts` (+2, -6)
- `packages/core/src/aisdk.ts` (+18, -10)
- `packages/core/src/background-job.ts` (+284, -0)
- `packages/core/src/catalog.ts` (+22, -27)
- `packages/core/src/command.ts` (+68, -0)
- `packages/core/src/config.ts` (+50, -47)
- `packages/core/src/config/agent.ts` (+3, -3)
- `packages/core/src/config/command.ts` (+12, -0)
- `packages/core/src/config/markdown.ts` (+36, -0)
- `packages/core/src/config/plugin/agent.ts` (+98, -23)
- `packages/core/src/config/plugin/command.ts` (+84, -0)
- `packages/core/src/config/plugin/provider.ts` (+10, -21)
- `packages/core/src/config/plugin/skill.ts` (+48, -0)
- `packages/core/src/config/provider.ts` (+21, -12)
- `packages/core/src/database/migration.gen.ts` (+4, -0)
- `packages/core/src/database/migration.ts` (+3, -2)
- `packages/core/src/database/migration/20260603001617_session_message_projection_indexes.ts` (+19, -0)
- `packages/core/src/database/migration/20260603040000_session_message_projection_order.ts` (+25, -0)
- `packages/core/src/database/migration/20260603141458_session_input_inbox.ts` (+25, -0)
- `packages/core/src/database/migration/20260603160727_jittery_ezekiel_stane.ts` (+20, -0)
- `packages/core/src/database/sqlite.bun.ts` (+6, -5)
- `packages/core/src/database/sqlite.node.ts` (+6, -5)
- `packages/core/src/effect/keyed-mutex.ts` (+45, -0)
- `packages/core/src/event.ts` (+442, -230)
- `packages/core/src/file-mutation.ts` (+212, -0)
- `packages/core/src/filesystem.ts` (+335, -31)
- `packages/core/src/filesystem/ripgrep.ts` (+2, -1)
- `packages/core/src/filesystem/watcher.ts` (+3, -1)
- `packages/core/src/flag/flag.ts` (+1, -1)
- `packages/core/src/fs-util.ts` (+4, -5)
- `packages/core/src/location-layer.ts` (+59, -5)
- `packages/core/src/location-mutation.ts` (+311, -0)
- `packages/core/src/location-search.ts` (+198, -0)
- `packages/core/src/location.ts` (+16, -8)
- `packages/core/src/model.ts` (+23, -15)
- `packages/core/src/opencode.ts` (+39, -0)
- `packages/core/src/patch.ts` (+197, -0)
- `packages/core/src/permission.ts` (+102, -86)
- `packages/core/src/plugin.ts` (+33, -21)
- `packages/core/src/plugin/account.ts` (+3, -3)
- `packages/core/src/plugin/agent.ts` (+0, -3)
- `packages/core/src/plugin/boot.ts` (+26, -0)
- `packages/core/src/plugin/command.ts` (+29, -0)
- `packages/core/src/plugin/command/initialize.txt` (+65, -0)
- `packages/core/src/plugin/command/review.txt` (+100, -0)
- `packages/core/src/plugin/models-dev.ts` (+10, -8)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+31, -8)
- `packages/core/src/plugin/provider/anthropic.ts` (+3, -3)
- `packages/core/src/plugin/provider/azure.ts` (+10, -10)
- `packages/core/src/plugin/provider/cerebras.ts` (+3, -3)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+8, -8)
- `packages/core/src/plugin/provider/github-copilot.ts` (+4, -4)
- `packages/core/src/plugin/provider/gitlab.ts` (+6, -8)
- `packages/core/src/plugin/provider/google-vertex.ts` (+19, -19)
- `packages/core/src/plugin/provider/kilo.ts` (+5, -5)
- `packages/core/src/plugin/provider/llmgateway.ts` (+6, -6)
- `packages/core/src/plugin/provider/nvidia.ts` (+6, -6)
- `packages/core/src/plugin/provider/openai.ts` (+3, -3)
- `packages/core/src/plugin/provider/opencode.ts` (+2, -2)
- `packages/core/src/plugin/provider/openrouter.ts` (+4, -4)
- `packages/core/src/plugin/provider/sap-ai-core.ts` (+1, -1)
- `packages/core/src/plugin/provider/vercel.ts` (+4, -4)
- `packages/core/src/plugin/provider/xai.ts` (+1, -1)
- `packages/core/src/plugin/provider/zenmux.ts` (+5, -5)
- `packages/core/src/plugin/skill.ts` (+32, -0)
- `packages/core/src/process.ts` (+3, -3)
- `packages/core/src/project-reference.ts` (+6, -1)
- `packages/core/src/provider.ts` (+18, -56)
- `packages/core/src/question.ts` (+198, -0)
- `packages/core/src/ripgrep.ts` (+192, -0)
- `packages/core/src/schema.ts` (+9, -0)
- `packages/core/src/session-system-context.ts` (+54, -0)
- `packages/core/src/session.ts` (+225, -121)
- `packages/core/src/session/context.ts` (+47, -0)
- `packages/core/src/session/error.ts` (+8, -0)
- `packages/core/src/session/event.ts` (+75, -55)
- `packages/core/src/session/execution.ts` (+18, -0)
- `packages/core/src/session/execution/local.ts` (+35, -0)
- `packages/core/src/session/info.ts` (+47, -0)
- `packages/core/src/session/input.ts` (+286, -0)
- `packages/core/src/session/message-updater.ts` (+117, -131)
- `packages/core/src/session/message.ts` (+7, -1)
- `packages/core/src/session/projector.ts` (+144, -208)
- `packages/core/src/session/prompt.ts` (+12, -1)
- `packages/core/src/session/run-coordinator.ts` (+183, -0)
- `packages/core/src/session/runner/index.ts` (+28, -0)
- `packages/core/src/session/runner/llm.ts` (+262, -0)
- `packages/core/src/session/runner/model.ts` (+141, -0)
- `packages/core/src/session/runner/publish-llm-event.ts` (+391, -0)
- `packages/core/src/session/runner/to-llm-message.ts` (+139, -0)
- `packages/core/src/session/schema.ts` (+9, -11)
- `packages/core/src/session/sql.ts` (+32, -2)
- `packages/core/src/session/store.ts` (+53, -0)
- `packages/core/src/session/todo.ts` (+91, -0)
- `packages/core/src/skill.ts` (+170, -0)
- `packages/core/src/skill/discovery.ts` (+174, -0)
- `packages/core/src/state.ts` (+32, -1)
- `packages/core/src/system-context.ts` (+141, -0)
- `packages/core/src/tool-output-store.ts` (+362, -0)
- `packages/core/src/tool-output.ts` (+7, -14)
- `packages/core/src/tool-registry.ts` (+173, -0)
- `packages/core/src/util/hash.ts` (+4, -0)
- `packages/core/src/v1/config/command.ts` (+1, -0)
- `packages/core/src/v1/config/config.ts` (+1, -1)
- `packages/core/src/v1/config/migrate.ts` (+45, -16)
- `packages/core/src/v1/config/provider-options.ts` (+211, -0)
- `packages/core/src/v1/session.ts` (+9, -6)
- `packages/core/test/account.test.ts` (+1, -4)
- `packages/core/test/agent.test.ts` (+30, -0)
- `packages/core/test/background-job.test.ts` (+103, -0)
- `packages/core/test/catalog.test.ts` (+42, -32)
- `packages/core/test/command.test.ts` (+56, -0)
- `packages/core/test/config/agent.test.ts` (+121, -29)
- `packages/core/test/config/command.test.ts` (+81, -0)
- `packages/core/test/config/config.test.ts` (+153, -41)
- `packages/core/test/config/provider-options.test.ts` (+211, -0)
- `packages/core/test/config/provider.test.ts` (+20, -21)
- `packages/core/test/config/skill.test.ts` (+78, -0)
- `packages/core/test/database-migration.test.ts` (+81, -2)
- `packages/core/test/effect/keyed-mutex.test.ts` (+73, -0)
- `packages/core/test/event.test.ts` (+337, -4)
- `packages/core/test/file-mutation.test.ts` (+357, -0)
- `packages/core/test/filesystem/filesystem.test.ts` (+5, -0)
- `packages/core/test/filesystem/ripgrep.test.ts` (+11, -0)
- `packages/core/test/filesystem/watcher.test.ts` (+1, -2)
- `packages/core/test/fixture/tmpdir.ts` (+13, -2)
- `packages/core/test/fixtures/recordings/session-runner/openai-chat-streams-text.json` (+27, -0)
- `packages/core/test/location-filesystem.test.ts` (+185, -27)
- `packages/core/test/location-layer.test.ts` (+39, -7)
- `packages/core/test/location-mutation.test.ts` (+234, -0)
- `packages/core/test/location-search.test.ts` (+285, -0)
- `packages/core/test/location.test.ts` (+4, -2)
- `packages/core/test/opencode.test.ts` (+16, -0)
- `packages/core/test/patch.test.ts` (+68, -0)
- `packages/core/test/permission.test.ts` (+73, -1)
- `packages/core/test/plugin.test.ts` (+90, -0)
- `packages/core/test/plugin/command.test.ts` (+44, -0)
- `packages/core/test/plugin/provider-alibaba.test.ts` (+3, -3)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+94, -9)
- `packages/core/test/plugin/provider-anthropic.test.ts` (+7, -7)
- `packages/core/test/plugin/provider-azure-cognitive-services.test.ts` (+11, -11)
- `packages/core/test/plugin/provider-azure.test.ts` (+21, -25)
- `packages/core/test/plugin/provider-cerebras.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+15, -15)
- `packages/core/test/plugin/provider-cohere.test.ts` (+1, -1)
- `packages/core/test/plugin/provider-deepinfra.test.ts` (+1, -1)
- `packages/core/test/plugin/provider-dynamic.test.ts` (+5, -6)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+7, -9)
- `packages/core/test/plugin/provider-google-vertex-anthropic.test.ts` (+8, -8)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+24, -24)
- `packages/core/test/plugin/provider-google.test.ts` (+4, -8)
- `packages/core/test/plugin/provider-groq.test.ts` (+5, -9)
- `packages/core/test/plugin/provider-helper.ts` (+26, -20)
- `packages/core/test/plugin/provider-kilo.test.ts` (+18, -18)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+9, -9)
- `packages/core/test/plugin/provider-mistral.test.ts` (+3, -3)
- `packages/core/test/plugin/provider-nvidia.test.ts` (+17, -18)
- `packages/core/test/plugin/provider-openai.test.ts` (+5, -3)
- `packages/core/test/plugin/provider-opencode.test.ts` (+11, -15)
- `packages/core/test/plugin/provider-openrouter.test.ts` (+8, -8)
- `packages/core/test/plugin/provider-perplexity.test.ts` (+1, -1)
- `packages/core/test/plugin/provider-togetherai.test.ts` (+1, -1)
- `packages/core/test/plugin/provider-vercel.test.ts` (+10, -10)
- `packages/core/test/plugin/provider-xai.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-zenmux.test.ts` (+17, -19)
- `packages/core/test/plugin/skill.test.ts` (+32, -0)
- `packages/core/test/process/process.test.ts` (+59, -1)
- `packages/core/test/project-reference.test.ts` (+3, -6)
- `packages/core/test/question.test.ts` (+115, -0)
- `packages/core/test/session-create.test.ts` (+259, -0)
- `packages/core/test/session-projector.test.ts` (+458, -0)
- `packages/core/test/session-prompt.test.ts` (+463, -0)
- `packages/core/test/session-run-coordinator.test.ts` (+384, -0)
- `packages/core/test/session-runner-message.test.ts` (+377, -0)
- `packages/core/test/session-runner-model.test.ts` (+213, -0)
- `packages/core/test/session-runner-recorded.test.ts` (+155, -0)
- `packages/core/test/session-runner-tool-registry.test.ts` (+211, -0)
- `packages/core/test/session-runner.test.ts` (+2121, -0)
- `packages/core/test/session-system-context.test.ts` (+70, -0)
- `packages/core/test/session-todo.test.ts` (+95, -0)
- `packages/core/test/session-tool-progress.test.ts` (+159, -0)
- `packages/core/test/skill-discovery.test.ts` (+104, -0)
- `packages/core/test/skill.test.ts` (+130, -0)
- `packages/core/test/system-context.test.ts` (+188, -0)
- `packages/core/test/tool-apply-patch.test.ts` (+368, -0)
- `packages/core/test/tool-bash.test.ts` (+406, -0)
- `packages/core/test/tool-edit.test.ts` (+458, -0)
- `packages/core/test/tool-glob.test.ts` (+231, -0)
- `packages/core/test/tool-grep.test.ts` (+286, -0)
- `packages/core/test/tool-output-store.test.ts` (+265, -0)
- `packages/core/test/tool-question.test.ts` (+119, -0)
- `packages/core/test/tool-read.test.ts` (+402, -0)
- `packages/core/test/tool-skill.test.ts` (+150, -0)
- `packages/core/test/tool-todowrite.test.ts` (+106, -0)
- `packages/core/test/tool-webfetch.test.ts` (+295, -0)
- `packages/core/test/tool-websearch.test.ts` (+331, -0)
- `packages/core/test/tool-write.test.ts` (+328, -0)
- `packages/stats/core/src/domain/home.ts` (+2, -2)
- `packages/stats/core/src/domain/inference.ts` (+2, -2)

#### Other Changes
- `.github/workflows/publish.yml` (+12, -0)
- `.github/workflows/sync-zed-extension.yml` (+0, -35)
- `.github/workflows/test.yml` (+2, -1)
- `.gitignore` (+2, -0)
- `.opencode/command/translate.md` (+1, -1)
- `AGENTS.md` (+11, -0)
- `CONTEXT.md` (+77, -0)
- `bun.lock` (+644, -1002)
- `bunfig.toml` (+1, -1)
- `infra/stats.ts` (+1, -1)
- `nix/hashes.json` (+4, -4)
- `packages/app/e2e/regression/prompt-thinking-level.spec.ts` (+86, -0)
- `packages/app/src/components/prompt-input.tsx` (+38, -1)
- `packages/app/src/components/titlebar.tsx` (+3, -1)
- `packages/app/src/pages/layout.tsx` (+2, -5)
- `packages/app/src/pages/layout/update.test.ts` (+19, -0)
- `packages/app/src/pages/layout/update.ts` (+10, -0)
- `packages/app/src/pages/session.tsx` (+0, -2)
- `packages/cli/bin/lildax.cjs` (+130, -0)
- `packages/cli/package.json` (+8, -2)
- `packages/cli/script/build.ts` (+103, -0)
- `packages/cli/script/generate.ts` (+7, -0)
- `packages/cli/script/publish.ts` (+52, -0)
- `packages/cli/src/api.ts` (+0, -12)
- `packages/cli/src/commands/commands.ts` (+36, -0)
- `packages/cli/src/commands/handlers/debug/agents.ts` (+21, -0)
- `packages/cli/src/commands/handlers/migrate.ts` (+5, -0)
- `packages/cli/src/commands/handlers/serve.ts` (+39, -0)
- `packages/cli/src/commands/handlers/service/password.ts` (+16, -0)
- `packages/cli/src/commands/handlers/service/restart.ts` (+14, -0)
- `packages/cli/src/commands/handlers/service/start.ts` (+12, -0)
- `packages/cli/src/commands/handlers/service/status.ts` (+13, -0)
- `packages/cli/src/commands/handlers/service/stop.ts` (+11, -0)
- `packages/cli/src/{cli-builder.ts => framework/runtime.ts}` (+23, -16)
- `packages/cli/src/{cli-api.ts => framework/spec.ts}` (+1, -1)
- `packages/cli/src/handlers/debug/agents.ts` (+0, -30)
- `packages/cli/src/handlers/migrate.ts` (+0, -5)
- `packages/cli/src/index.ts` (+16, -6)
- `packages/cli/src/services/daemon.ts` (+143, -0)
- `packages/cli/tsconfig.json` (+1, -0)
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
- `packages/console/app/src/lib/stats-proxy.ts` (+1, -1)
- `packages/console/app/src/routes/go/index.tsx` (+2, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+1, -2)
- `packages/console/function/src/log-processor.ts` (+1, -1)
- `packages/{opencode/src/skill/prompt => core/src/plugin/skill}/customize-opencode.md` (+1, -1)
- `packages/extensions/zed/LICENSE` (+0, -1)
- `packages/extensions/zed/extension.toml` (+0, -36)
- `packages/extensions/zed/icons/opencode.svg` (+0, -3)
- `packages/llm/AGENTS.md` (+36, -19)
- `packages/llm/example/tutorial.ts` (+28, -19)
- `packages/llm/src/index.ts` (+5, -8)
- `packages/llm/src/llm.ts` (+3, -8)
- `packages/llm/src/protocols/anthropic-messages.ts` (+75, -1)
- `packages/llm/src/protocols/bedrock-converse.ts` (+44, -11)
- `packages/llm/src/protocols/gemini.ts` (+52, -4)
- `packages/llm/src/protocols/openai-chat.ts` (+26, -5)
- `packages/llm/src/protocols/openai-responses.ts` (+30, -0)
- `packages/llm/src/protocols/shared.ts` (+39, -0)
- `packages/llm/src/protocols/utils/lifecycle.ts` (+8, -2)
- `packages/llm/src/route/client.ts` (+12, -32)
- `packages/llm/src/schema/events.ts` (+8, -2)
- `packages/llm/src/schema/ids.ts` (+1, -1)
- `packages/llm/src/schema/messages.ts` (+135, -0)
- `packages/llm/src/tool-runtime.ts` (+50, -312)
- `packages/llm/src/tool.ts` (+62, -11)
- `packages/llm/test/lib/tool-runtime.ts` (+143, -5)
- `packages/llm/test/llm.test.ts` (+20, -1)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+95, -0)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+56, -0)
- `packages/llm/test/provider/gemini.test.ts` (+82, -0)
- `packages/llm/test/provider/openai-chat.test.ts` (+45, -4)
- `packages/llm/test/provider/openai-responses.test.ts` (+62, -0)
- `packages/llm/test/recorded-scenarios.ts` (+58, -10)
- `packages/llm/test/schema.test.ts` (+11, -0)
- `packages/llm/test/tool-runtime.test.ts` (+219, -81)
- `packages/llm/test/tool.types.ts` (+18, -8)
- `packages/opencode/package.json` (+3, -2)
- `packages/opencode/src/acp/directory.ts` (+3, -2)
- `packages/opencode/src/acp/event.ts` (+25, -0)
- `packages/opencode/src/acp/service.ts` (+6, -5)
- `packages/opencode/src/acp/session.ts` (+2, -1)
- `packages/opencode/src/acp/tool.ts` (+35, -4)
- `packages/opencode/src/acp/usage.ts` (+6, -5)
- `packages/opencode/src/background/job.ts` (+23, -266)
- `packages/opencode/src/cli/cmd/tui/context/sync-v2.tsx` (+76, -19)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+3, -1)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+4, -1)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+4, -1)
- `packages/opencode/src/config/markdown.ts` (+11, -65)
- `packages/opencode/src/control-plane/workspace.ts` (+2, -2)
- `packages/opencode/src/event-v2-bridge.ts` (+24, -2)
- `packages/opencode/src/plugin/openai/codex.ts` (+4, -0)
- `packages/opencode/src/plugin/openai/ws-pool.ts` (+12, -1)
- `packages/opencode/src/provider/provider.ts` (+42, -29)
- `packages/opencode/src/provider/transform.ts` (+59, -79)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+2, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+7, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+3, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2.ts` (+0, -24)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/sync.ts` (+2, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2.ts` (+0, -27)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/fs.ts` (+0, -12)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+1, -32)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+19, -4)
- `packages/opencode/src/session/compaction.ts` (+3, -2)
- `packages/opencode/src/session/llm/native-runtime.ts` (+62, -18)
- `packages/opencode/src/session/message-v2.ts` (+1, -0)
- `packages/opencode/src/session/message.ts` (+2, -1)
- `packages/opencode/src/session/processor.ts` (+195, -37)
- `packages/opencode/src/session/prompt.ts` (+8, -7)
- `packages/opencode/src/session/run-state.ts` (+1, -1)
- `packages/opencode/src/session/session.ts` (+22, -66)
- `packages/opencode/src/session/tools.ts` (+2, -1)
- `packages/opencode/src/share/share-next.ts` (+2, -1)
- `packages/opencode/src/skill/index.ts` (+3, -1)
- `packages/opencode/src/util/filesystem.ts` (+4, -5)
- `packages/opencode/test/acp/directory.test.ts` (+5, -4)
- `packages/opencode/test/acp/event.test.ts` (+57, -3)
- `packages/opencode/test/acp/permission.test.ts` (+36, -0)
- `packages/opencode/test/acp/service-session.test.ts` (+44, -3)
- `packages/opencode/test/acp/session.test.ts` (+2, -1)
- `packages/opencode/test/acp/tool.test.ts` (+45, -0)
- `packages/opencode/test/acp/usage.test.ts` (+5, -4)
- `packages/opencode/test/cli/tui/sync-v2.test.tsx` (+137, -0)
- `packages/opencode/test/fake/provider.ts` (+2, -1)
- `packages/opencode/test/plugin/openai-ws.test.ts` (+100, -1)
- `packages/opencode/test/plugin/trigger.test.ts` (+2, -1)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+74, -0)
- `packages/opencode/test/provider/cf-ai-gateway-e2e.test.ts` (+2, -1)
- `packages/opencode/test/provider/header-timeout.test.ts` (+5, -4)
- `packages/opencode/test/provider/provider.test.ts` (+15, -20)
- `packages/opencode/test/provider/transform.test.ts` (+135, -41)
- `packages/opencode/test/server/httpapi-exercise/backend.ts` (+13, -4)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+83, -11)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+4, -2)
- `packages/opencode/test/server/httpapi-exercise/runtime.ts` (+3, -3)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+57, -3)
- `packages/opencode/test/server/httpapi-query-schema-drift.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-schema-error-body.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+40, -3)
- `packages/opencode/test/server/httpapi-session.test.ts` (+93, -18)
- `packages/opencode/test/server/httpapi-v2-location.test.ts` (+85, -0)
- `packages/opencode/test/server/negative-tokens-regression.test.ts` (+2, -1)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+2, -1)
- `packages/opencode/test/server/session-messages.test.ts` (+2, -1)
- `packages/opencode/test/session/compaction.test.ts` (+2, -1)
- `packages/opencode/test/session/instruction.test.ts` (+2, -1)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+14, -21)
- `packages/opencode/test/session/llm-native.test.ts` (+65, -4)
- `packages/opencode/test/session/llm.test.ts` (+14, -16)
- `packages/opencode/test/session/message-v2.test.ts` (+6, -5)
- `packages/opencode/test/session/messages-pagination.test.ts` (+2, -1)
- `packages/opencode/test/session/processor-effect.test.ts` (+166, -3)
- `packages/opencode/test/session/prompt.test.ts` (+18, -10)
- `packages/opencode/test/session/revert-compact.test.ts` (+9, -8)
- `packages/opencode/test/session/session.test.ts` (+27, -0)
- `packages/opencode/test/share/share-next.test.ts` (+6, -2)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+16, -7)
- `packages/sdk/js/src/v2/client.ts` (+9, -2)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+710, -480)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1824, -1251)
- `packages/sdk/openapi.json` (+4467, -3146)
- `packages/server/package.json` (+24, -0)
- `packages/server/src/api.ts` (+39, -0)
- `packages/server/src/auth.ts` (+63, -0)
- `packages/server/src/errors.ts` (+86, -0)
- `packages/server/src/groups/v2/agent.ts` (+24, -0)
- `packages/server/src/groups/v2/command.ts` (+30, -0)
- `packages/server/src/groups/v2/event.ts` (+36, -0)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/fs.ts` (+3, -2)
- `packages/server/src/groups/v2/health.ts` (+17, -0)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/location.ts` (+26, -1)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/message.ts` (+3, -5)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/model.ts` (+2, -1)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/permission.ts` (+4, -3)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/provider.ts` (+3, -2)
- `packages/server/src/groups/v2/question.ts` (+60, -0)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/session.ts` (+14, -16)
- `packages/server/src/groups/v2/skill.ts` (+30, -0)
- `packages/server/src/handlers.ts` (+57, -0)
- `packages/server/src/handlers/v2/agent.ts` (+15, -0)
- `packages/server/src/handlers/v2/command.ts` (+9, -0)
- `packages/server/src/handlers/v2/event.ts` (+63, -0)
- `packages/server/src/handlers/v2/fs.ts` (+13, -0)
- `packages/server/src/handlers/v2/health.ts` (+7, -0)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/handlers/v2/message.ts` (+5, -9)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/handlers/v2/model.ts` (+4, -3)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/handlers/v2/permission.ts` (+8, -7)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/handlers/v2/provider.ts` (+6, -4)
- `packages/server/src/handlers/v2/question.ts` (+97, -0)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/handlers/v2/session.ts` (+59, -47)
- `packages/server/src/handlers/v2/skill.ts` (+8, -0)
- `packages/server/src/middleware/authorization.ts` (+60, -0)
- `packages/server/src/middleware/schema-error.ts` (+23, -0)
- `packages/server/src/routes.ts` (+37, -0)
- `packages/server/tsconfig.json` (+8, -0)
- `packages/stats/app/package.json` (+10, -2)
- `packages/stats/app/public/banner.png` (+-, --)
- `packages/stats/app/src/asset/unfurl-rankings.png` (+-, --)
- `packages/stats/app/src/routes/index.css` (+203, -0)
- `packages/stats/app/src/routes/index.tsx` (+231, -6)
- `packages/ui/src/components/session-review.tsx` (+21, -20)
- `packages/web/src/content/docs/ar/config.mdx` (+2, -2)
- `packages/web/src/content/docs/ar/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/bs/config.mdx` (+2, -2)
- `packages/web/src/content/docs/bs/go.mdx` (+5, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/config.mdx` (+3, -3)
- `packages/web/src/content/docs/da/config.mdx` (+2, -2)
- `packages/web/src/content/docs/da/go.mdx` (+5, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/de/config.mdx` (+2, -2)
- `packages/web/src/content/docs/de/go.mdx` (+5, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/es/config.mdx` (+2, -2)
- `packages/web/src/content/docs/es/go.mdx` (+5, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/fr/config.mdx` (+2, -2)
- `packages/web/src/content/docs/fr/go.mdx` (+5, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/go.mdx` (+5, -0)
- `packages/web/src/content/docs/it/config.mdx` (+2, -2)
- `packages/web/src/content/docs/it/go.mdx` (+5, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/ja/config.mdx` (+2, -2)
- `packages/web/src/content/docs/ja/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/ko/config.mdx` (+2, -2)
- `packages/web/src/content/docs/ko/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/nb/config.mdx` (+2, -2)
- `packages/web/src/content/docs/nb/go.mdx` (+5, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/pl/config.mdx` (+2, -2)
- `packages/web/src/content/docs/pl/go.mdx` (+5, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/pt-br/config.mdx` (+2, -2)
- `packages/web/src/content/docs/pt-br/go.mdx` (+5, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/ru/config.mdx` (+2, -2)
- `packages/web/src/content/docs/ru/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/th/config.mdx` (+2, -2)
- `packages/web/src/content/docs/th/go.mdx` (+5, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/tr/config.mdx` (+2, -2)
- `packages/web/src/content/docs/tr/go.mdx` (+5, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/zh-cn/config.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+5, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+3, -1)
- `packages/web/src/content/docs/zh-tw/config.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+5, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+3, -1)
- `script/publish.ts` (+3, -7)
- `script/raw-changelog.ts` (+1, -3)
- `script/sync-zed.ts` (+0, -130)
- `specs/v2/catalog-config-plugin-lifecycle.md` (+2, -0)
- `specs/v2/config.md` (+2, -2)
- `specs/v2/provider-model.md` (+43, -13)
- `specs/v2/schema-changelog.md` (+665, -0)
- `specs/v2/session.md` (+94, -0)
- `specs/v2/todo.md` (+95, -4)

### Key Diffs

#### packages/core/migration/20260603001617_session_message_projection_indexes/migration.sql
```diff
diff --git a/packages/core/migration/20260603001617_session_message_projection_indexes/migration.sql b/packages/core/migration/20260603001617_session_message_projection_indexes/migration.sql
new file mode 100644
index 0000000..ed6b728
--- /dev/null
+++ b/packages/core/migration/20260603001617_session_message_projection_indexes/migration.sql
@@ -0,0 +1,5 @@
+DROP INDEX IF EXISTS `session_message_session_idx`;--> statement-breakpoint
+DROP INDEX IF EXISTS `session_message_session_type_idx`;--> statement-breakpoint
+CREATE INDEX `event_aggregate_seq_idx` ON `event` (`aggregate_id`,`seq`);--> statement-breakpoint
+CREATE INDEX `session_message_session_time_created_id_idx` ON `session_message` (`session_id`,`time_created`,`id`);--> statement-breakpoint
+CREATE INDEX `session_message_session_type_time_created_id_idx` ON `session_message` (`session_id`,`type`,`time_created`,`id`);
\ No newline at end of file
```

#### packages/core/migration/20260603001617_session_message_projection_indexes/snapshot.json
```diff
diff --git a/packages/core/migration/20260603001617_session_message_projection_indexes/snapshot.json b/packages/core/migration/20260603001617_session_message_projection_indexes/snapshot.json
new file mode 100644
index 0000000..e89ee64
--- /dev/null
+++ b/packages/core/migration/20260603001617_session_message_projection_indexes/snapshot.json
@@ -0,0 +1,1636 @@
+{
+  "version": "7",
+  "dialect": "sqlite",
+  "id": "6a0e33d0-4866-402f-b287-de400200b05e",
+  "prevIds": ["80f2378a-ed35-45cb-9d3b-9f4837fac801"],
+  "ddl": [
+    {
+      "name": "workspace",
+      "entityType": "tables"
+    },
+    {
+      "name": "data_migration",
+      "entityType": "tables"
+    },
+    {
+      "name": "account_state",
+      "entityType": "tables"
+    },
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "control_account",
+      "entityType": "tables"
+    },
+    {
+      "name": "event_sequence",
+      "entityType": "tables"
+    },
+    {
+      "name": "event",
+      "entityType": "tables"
+    },
+    {
+      "name": "permission",
+      "entityType": "tables"
+    },
+    {
+      "name": "project",
+      "entityType": "tables"
+    },
+    {
+      "name": "message",
```

#### packages/core/migration/20260603040000_session_message_projection_order/migration.sql
```diff
diff --git a/packages/core/migration/20260603040000_session_message_projection_order/migration.sql b/packages/core/migration/20260603040000_session_message_projection_order/migration.sql
new file mode 100644
index 0000000..a56b07b
--- /dev/null
+++ b/packages/core/migration/20260603040000_session_message_projection_order/migration.sql
@@ -0,0 +1,5 @@
+ALTER TABLE `session_message` ADD `seq` integer NOT NULL;--> statement-breakpoint
+DROP INDEX IF EXISTS `session_message_session_time_created_id_idx`;--> statement-breakpoint
+DROP INDEX IF EXISTS `session_message_session_type_time_created_id_idx`;--> statement-breakpoint
+CREATE INDEX `session_message_session_seq_idx` ON `session_message` (`session_id`,`seq`);--> statement-breakpoint
+CREATE INDEX `session_message_session_type_seq_idx` ON `session_message` (`session_id`,`type`,`seq`);
```

#### packages/core/migration/20260603040000_session_message_projection_order/snapshot.json
```diff
diff --git a/packages/core/migration/20260603040000_session_message_projection_order/snapshot.json b/packages/core/migration/20260603040000_session_message_projection_order/snapshot.json
new file mode 100644
index 0000000..35aac3f
--- /dev/null
+++ b/packages/core/migration/20260603040000_session_message_projection_order/snapshot.json
@@ -0,0 +1,1638 @@
+{
+  "version": "7",
+  "dialect": "sqlite",
+  "id": "127d5585-9d6d-4b89-b126-15a36980392c",
+  "prevIds": ["6a0e33d0-4866-402f-b287-de400200b05e"],
+  "ddl": [
+    {
+      "name": "workspace",
+      "entityType": "tables"
+    },
+    {
+      "name": "data_migration",
+      "entityType": "tables"
+    },
+    {
+      "name": "account_state",
+      "entityType": "tables"
+    },
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "control_account",
+      "entityType": "tables"
+    },
+    {
+      "name": "event_sequence",
+      "entityType": "tables"
+    },
+    {
+      "name": "event",
+      "entityType": "tables"
+    },
+    {
+      "name": "permission",
+      "entityType": "tables"
+    },
+    {
+      "name": "project",
+      "entityType": "tables"
+    },
+    {
+      "name": "message",
```

#### packages/core/migration/20260603141458_session_input_inbox/migration.sql
```diff
diff --git a/packages/core/migration/20260603141458_session_input_inbox/migration.sql b/packages/core/migration/20260603141458_session_input_inbox/migration.sql
new file mode 100644
index 0000000..c721ba8
--- /dev/null
+++ b/packages/core/migration/20260603141458_session_input_inbox/migration.sql
@@ -0,0 +1,12 @@
+CREATE TABLE `session_input` (
+	`seq` integer PRIMARY KEY AUTOINCREMENT,
+	`id` text NOT NULL UNIQUE,
+	`session_id` text NOT NULL,
+	`prompt` text NOT NULL,
+	`delivery` text NOT NULL,
+	`promoted_seq` integer,
+	`time_created` integer NOT NULL,
+	CONSTRAINT `fk_session_input_session_id_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE CASCADE
+);
+--> statement-breakpoint
+CREATE INDEX `session_input_session_pending_seq_idx` ON `session_input` (`session_id`,`promoted_seq`,`seq`);
\ No newline at end of file
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/subagent-permissions.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/schema.ts
- `src/tool/apply-patch.ts` - update based on opencode packages/core/src/tool/apply-patch.ts changes
- `src/tool/bash.ts` - update based on opencode packages/core/src/tool/bash.ts changes
- `src/tool/builtins.ts` - update based on opencode packages/core/src/tool/builtins.ts changes
- `src/tool/edit.ts` - update based on opencode packages/core/src/tool/edit.ts changes
- `src/tool/glob.ts` - update based on opencode packages/core/src/tool/glob.ts changes
- `src/tool/grep.ts` - update based on opencode packages/core/src/tool/grep.ts changes
- `src/tool/parameters.test.ts` - update based on kilocode packages/opencode/test/tool/parameters.test.ts changes
- `src/tool/prompt.ts` - update based on kilocode packages/opencode/src/tool/shell/prompt.ts changes
- `src/tool/question.ts` - update based on opencode packages/core/src/tool/question.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/read.ts` - update based on opencode packages/core/src/tool/read.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/schema.ts` - update based on kilocode packages/opencode/src/tool/schema.ts changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on opencode packages/opencode/src/tool/shell.ts changes
- `src/tool/skill.ts` - update based on opencode packages/core/src/tool/skill.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/task.txt.ts` - update based on opencode packages/opencode/src/tool/task.txt changes
- `src/tool/todowrite.ts` - update based on opencode packages/core/src/tool/todowrite.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/core/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on opencode packages/core/src/tool/websearch.ts changes
- `src/tool/write.ts` - update based on opencode packages/core/src/tool/write.ts changes
