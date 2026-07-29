# Upstream Changes Report
Generated: 2026-07-29 08:41:12

## Summary
- kilocode: 119 commits, 433 files changed
- opencode: 16 commits, 81 files changed

## kilocode Changes (a0a760e00..0d853df3e)

### Commits

- 0d853df3e - feat(vscode): add prompt navigator rail to chat transcript (#12632) (Marius, 2026-07-29)
- 3321216c0 - feat(agent-manager): reveal jump shortcut badges while modifier is held (#12631) (Marius, 2026-07-29)
- a7f972f63 - fix(vscode): speed up embedded terminal startup and fix cold-connection race (#12630) (Marius, 2026-07-29)
- 0a1c14073 - fix(agent-manager): keep terminal destination consistent across windows (#12629) (Marius, 2026-07-29)
- c0ebf9877 - feat(opencode): route websearch Exa through Kilo proxy (#12470) (Aarav, 2026-07-29)
- f844790ed - Merge pull request #12603 from Kilo-Org/fix-jetbrains-ci-gh-token (Kirill Kalishev, 2026-07-28)
- 2fb37a098 - fix(ci): authenticate JetBrains OpenAPI codegen GitHub API calls (kirillk, 2026-07-28)
- 3075d35f1 - fix(vscode): make message copy buttons reliable (#12123) (Mohammad Javad Naderi, 2026-07-28)
- 5d87ca598 - chore(vscode): remove unused translation keys (#12602) (Marius, 2026-07-28)
- 77812dbd1 - Merge pull request #12598 from Kilo-Org/refactor-terminal-sidebar-integration (Marius, 2026-07-28)
- 290a5af56 - fix(cli): include credentials in console URLs printed for headless users (#12333) (Aarav, 2026-07-28)
- 8f4195cfa - chore(agent-manager): remove side terminal plan docs from the branch (marius-kilocode, 2026-07-28)
- 1310c1200 - fix: make snapshot diffs resilient on Windows (#12583) (Whitebeard, 2026-07-28)
- 625d2b974 - fix(vscode): show prompt input toggle tooltips instantly (#12591) (Marius, 2026-07-28)
- 9fe25c12a - refactor(vscode): remove unused webview context APIs and orphaned CSS (#12596) (Marius, 2026-07-28)
- d80aeac02 - refactor(vscode): remove dead code from Agent Manager (#12594) (Marius, 2026-07-28)
- d9289e1a0 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-28)
- 63a6f26b0 - fix(agent-manager): give the side terminal kill button an accessible name (marius-kilocode, 2026-07-28)
- 33d996d0f - Merge branch 'main' into refactor-terminal-sidebar-integration (Marius, 2026-07-28)
- 8c8804878 - fix(nix): use the required Bun version for builds (#12592) (Whitebeard, 2026-07-28)
- c6711fcf6 - feat(agent-manager): add embedded side-panel terminal destination (marius-kilocode, 2026-07-28)
- fb5f5ae31 - Merge pull request #12593 from Kilo-Org/profile-active-kilo-sessions-cpu-usage (Marius, 2026-07-28)
- 8f4b14610 - fix(vscode): use normalized client flag (marius-kilocode, 2026-07-28)
- 160b06661 - fix(vscode): avoid eager worktree watchers (marius-kilocode, 2026-07-28)
- b20986b36 - Merge pull request #12587 from Kilo-Org/reproduce-and-fix-revert-file-rollback-bug (Marius, 2026-07-28)
- fc04f4f6f - Merge branch 'main' into reproduce-and-fix-revert-file-rollback-bug (Marius, 2026-07-28)
- d41e0cdc0 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-28)
- 2c61d29fb - fix(cli): compensate checkpoint restore failures (marius-kilocode, 2026-07-28)
- c21b01f25 - Merge pull request #12460 from Kilo-Org/marius-kilocode/kilo-opencode-v1.17.9 (Marius, 2026-07-28)
- f336cfee0 - Merge pull request #12588 from Kilo-Org/fix/provider-first-byte-timeout (Marius, 2026-07-28)
- 8dba38a2f - fix(cli): update shell regression import (marius-kilocode, 2026-07-28)
- 60217b482 - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.17.9 (marius-kilocode, 2026-07-28)
- e4759b75a - fix(ci): docs-sync bot — no errors, no timeouts, no lost PRs (#12580) (Igor Šćekić, 2026-07-28)
- 7058e0764 - fix(cli): dispose HttpApi instances before apps (marius-kilocode, 2026-07-28)
- deddf0012 - fix(cli): bound provider first response byte by the request timeout (marius-kilocode, 2026-07-28)
- 16f8e7ef7 - fix(cli): keep session reverts atomic (marius-kilocode, 2026-07-28)
- 8932a2033 - test(cli): disable indexing in HttpApi exerciser (marius-kilocode, 2026-07-27)
- 46d48db82 - fix(cli): close HttpApi exerciser resources (marius-kilocode, 2026-07-27)
- cc8d56737 - fix(agent-manager): register dialog-created sessions (marius-kilocode, 2026-07-27)
- 28f2abe5e - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.17.9 (marius-kilocode, 2026-07-27)
- c8abc86fe - fix: align merged CI contracts (marius-kilocode, 2026-07-27)
- bdf168b8a - Merge branch 'main' into marius-kilocode/kilo-opencode-v1.17.9 (Marius, 2026-07-24)
- 40328be5a - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-24)
- 64343089d - chore: merge latest main (marius-kilocode, 2026-07-24)
- 3d2036a37 - fix: preserve Kilo repository links (marius-kilocode, 2026-07-24)
- 1b60773ca - fix: resolve OpenCode merge regressions (marius-kilocode, 2026-07-24)
- 51d8031c9 - chore: complete OpenCode v1.17.9 integration (marius-kilocode, 2026-07-22)
- f1e22ebf2 - fix(upstream): preserve compatibility tree overlays (marius-kilocode, 2026-07-22)
- a51864cd7 - resolve merge conflicts (marius-kilocode, 2026-07-22)
- 7bb4538ce - merge: record upstream v1.17.9 (marius-kilocode, 2026-07-22)
- a776bd4d2 - refactor: kilo compat for v1.17.9 (marius-kilocode, 2026-07-22)
- 5c23e8841 - release: v1.17.9 (opencode, 2026-06-21)
- d99f86b28 - fix(tui): separate subagent tool rows (#33158) (Dax, 2026-06-20)
- 22cc758b1 - feat(opencode): expose High/Max thinking variants for GLM-5.2 (#32446) (imranshaiedi-byte, 2026-06-20)
- 0b7ec51d0 - chore: generate (opencode-agent[bot], 2026-06-20)
- 4f1a9d7ae - fix(core): honor configured agent step limits (#33142) (Kit Langton, 2026-06-20)
- 503309d24 - fix(stats): tolerate pending user column (Adam, 2026-06-20)
- 1c76587ce - chore: generate (opencode-agent[bot], 2026-06-20)
- 24c70ec97 - feat(stats): add unique user charts (Adam, 2026-06-20)
- 2d993cd0d - fix(experimental llm pkg): forward topK to Converse via additionalModelRequestFields (#33030) (Lucas Kim, 2026-06-20)
- babe5070e - fix(opencode): use toLowerCase for Devstral model detection (#33109) (卫斯李, 2026-06-20)
- 009f3799c - refactor(tui): simplify inline tool spacing (#33097) (Dax, 2026-06-20)
- 95237a90a - fix(stats): align model peers ranking (Adam, 2026-06-20)
- e6cdc543f - fix(tui): render console org load errors inline (#33040) (Aiden Cline, 2026-06-19)
- f092bafe8 - tweak: remove steering wrapper that can bust cache (#33039) (Aiden Cline, 2026-06-19)
- 3f1fffeb6 - fix(core): fix command docs in customize-opencode skill (#32718) (Grant Martin, 2026-06-19)
- c6083a474 - test(app): add manual performance diagnostics (#32937) (Luke Parker, 2026-06-19)
- 10ec856ff - chore: generate (opencode-agent[bot], 2026-06-19)
- 0f6c9b387 - chore(stats): update data seo metadata (Adam, 2026-06-19)
- 355a0bcf5 - chore: generate (opencode-agent[bot], 2026-06-18)
- 2892e97c5 - fix(tui): gate background shortcut by capability (#32837) (Aiden Cline, 2026-06-18)
- 62c746f2e - zen: budget (Frank, 2026-06-18)
- ec50db334 - fix(opencode): pass configured headers to Copilot models (#32815) (Aiden Cline, 2026-06-18)
- 8716c4309 - sync release versions for v1.17.8 (opencode, 2026-06-17)
- 10b6672be - go: glm 5.2 (Frank, 2026-06-17)
- 85a79292e - fix(stats): map lab aliases (Adam, 2026-06-17)
- 5c9e4ff21 - feat(app): add v2 home tab toggle (#32191) (Luke Parker, 2026-06-17)
- 417ad240c - chore: generate (opencode-agent[bot], 2026-06-17)
- 1e63e7619 - fix(stats): scope model pages to go (Adam, 2026-06-17)
- 213ff3f2d - fix(opencode): sanitize OpenAI MCP tool schemas (#32489) (Jason Quense, 2026-06-17)
- 3ab3d04ec - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-16)
- 8fd5753f7 - fix(provider): pass apiKey to createUnified for Cloudflare AI Gateway (#32052) (Keefe Tang, 2026-06-16)
- 273efdeee - chore: generate (opencode-agent[bot], 2026-06-16)
- 3b811bd01 - feat(app): make session timelines much faster AND without flicker or scroll jumps (#32331) (Luke Parker, 2026-06-16)
- e77266438 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-16)
- 1c2c2d6b5 - chore: generate (opencode-agent[bot], 2026-06-16)
- 88f5b9a90 - experiment: better web picker using @pierre/tree (#31208) (Luke Parker, 2026-06-16)
- 25cb2be61 - fix(mcp): default tool schema properties (#32568) (Aiden Cline, 2026-06-16)
- bd84c3286 - fix(web): persist docs language selection (#32551) (Aiden Cline, 2026-06-16)
- 94652cfe4 - fix(tui): render move errors inline (#32241) (Aiden Cline, 2026-06-16)
- 3a2ff11be - Revert "fix(mcp): type tool error content" (adamelmore, 2026-06-16)
- a98d5732c - fix(mcp): enable progress timeout resets (#32477) (RAMA, 2026-06-16)
- 5d0f86606 - fix(mcp): stop idle OAuth callback server (#32245) (Aiden Cline, 2026-06-14)
- 98d66e9a8 - chore: generate (opencode-agent[bot], 2026-06-15)
- 0dbfb6bc0 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-15)
- 9258e8ca8 - fix(mcp): type tool error content (Adam, 2026-06-14)
- 9fdfa23f0 - fix(stats): align homepage model ranks (Adam, 2026-06-14)
- dfb616f06 - fix(mcp): handle tool result errors (#32244) (Aiden Cline, 2026-06-14)
- 1338d7b47 - fix(stats): rank model pages by week (Adam, 2026-06-14)
- a774c62ea - chore(opencode): consolidate escape logic (#32360) (Aiden Cline, 2026-06-14)
- a9a4b2f00 - fix(stats): scope data charts to go (Adam, 2026-06-14)
- e4ccb505b - fix(mcp): escape OAuth callback errors (#32242) (Aiden Cline, 2026-06-14)
- 85e278b72 - sync release versions for v1.17.7 (opencode, 2026-06-14)
- 87c33b3d8 - fix(plugin): reuse active server for client requests (Dax Raad, 2026-06-14)
- 3f8140266 - chore: generate (opencode-agent[bot], 2026-06-14)
- d37ddc501 - feat(app): add prompt input story (#32308) (Brendan Allan, 2026-06-14)
- 3e523d506 - fix(tui): match @ mention items by name, not description or uri (#32309) (Shoubhit Dash, 2026-06-14)
- e4d4b07e7 - test(acp): make shell workdir location assertion windows-safe (#32306) (Shoubhit Dash, 2026-06-14)
- 51461429f - fix(acp): show shell command in ACP tool calls (#32304) (Shoubhit Dash, 2026-06-14)
- 3ab19bfd7 - chore: generate (opencode-agent[bot], 2026-06-14)
- 0cf3ee440 - refactor(core): derive catalog availability from integrations (#32272) (Dax, 2026-06-14)
- 4810df0a7 - chore: generate (opencode-agent[bot], 2026-06-14)
- 010b456df - feat(app): scope sdk/sync hooks per-route so /new-session targets its draft server (#32290) (Brendan Allan, 2026-06-14)
- c81cd3202 - chore: generate (opencode-agent[bot], 2026-06-14)
- 7ad68f815 - fix(server): apply plugin pty environment (#32296) (Shoubhit Dash, 2026-06-14)
- 8cc2276db - chore: generate (opencode-agent[bot], 2026-06-14)
- f2cf60737 - refactor(core): canonicalize pty service (#32182) (Shoubhit Dash, 2026-06-14)
- 7efade2d5 - zen: monitor budget (Frank, 2026-06-14)
- 231f4944c - fix(mcp): use SDK protocol version in debug (#32243) (Aiden Cline, 2026-06-13)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/interactive-terminal.ts` (+1, -1)
- `packages/opencode/src/kilocode/tool/websearch-kilo-exa.ts` (+74, -0)
- `packages/opencode/src/tool/shell.ts` (+1, -1)
- `packages/opencode/src/tool/websearch.ts` (+57, -9)
- `packages/opencode/test/kilocode/tool/shell-unparsed.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/tool/websearch-kilo-exa.test.ts` (+180, -0)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+1, -1)
- `packages/opencode/test/tool/shell.test.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/test/kilocode/permission/external-directory-allow.test.ts` (+1, -1)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/catalog.ts` (+38, -55)
- `packages/core/src/config/plugin/provider.ts` (+25, -2)
- `packages/core/src/credential.ts` (+7, -0)
- `packages/core/src/integration.ts` (+73, -25)
- `packages/core/src/integration/connection.ts` (+6, -4)
- `packages/core/src/kilocode/powershell.ts` (+126, -0)
- `packages/core/src/kilocode/pty-self-command.ts` (+61, -0)
- `packages/core/src/location.ts` (+2, -2)
- `packages/core/src/plugin/boot.ts` (+0, -2)
- `packages/core/src/plugin/env.ts` (+0, -22)
- `packages/core/src/plugin/models-dev.ts` (+2, -8)
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+1, -1)
- `packages/core/src/plugin/provider/kilo.ts` (+2, -2)
- `packages/core/src/plugin/provider/llmgateway.ts` (+5, -2)
- `packages/core/src/plugin/provider/openai-auth.ts` (+6, -6)
- `packages/core/src/plugin/provider/opencode.ts` (+4, -4)
- `packages/core/src/plugin/skill.ts` (+1, -1)
- `packages/core/src/plugin/skill/customize-opencode.md` (+39, -11)
- `packages/core/src/project/copy.ts` (+1, -0)
- `packages/core/src/provider.ts` (+1, -19)
- `packages/core/src/pty.ts` (+156, -107)
- `packages/core/src/pty/input.ts` (+0, -24)
- `packages/core/src/pty/protocol.ts` (+37, -0)
- `packages/core/src/session/runner/index.ts` (+1, -10)
- `packages/core/src/session/runner/llm.ts` (+26, -22)
- `packages/core/src/session/runner/model.ts` (+44, -19)
- `packages/core/sst-env.d.ts` (+10, -0)
- `packages/core/test/catalog.test.ts` (+55, -52)
- `packages/core/test/config/provider.test.ts` (+116, -103)
- `packages/core/test/integration.test.ts` (+31, -21)
- `packages/core/test/kilocode/integration-settlement.test.ts` (+22, -16)
- `packages/core/test/kilocode/provider-isolation.test.ts` (+7, -3)
- `packages/core/test/kilocode/session-runner-model.test.ts` (+56, -0)
- `packages/core/test/plugin/models-dev.test.ts` (+6, -4)
- `packages/core/test/plugin/provider-azure.test.ts` (+3, -56)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+3, -62)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+3, -100)
- `packages/core/test/plugin/provider-helper.ts` (+1, -0)
- `packages/core/test/plugin/provider-kilo.test.ts` (+5, -5)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+20, -13)
- `packages/core/test/plugin/provider-openai.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-opencode.test.ts` (+22, -36)
- `packages/core/test/project-copy.test.ts` (+12, -0)
- `packages/core/test/pty/info-schema.test.ts` (+5, -0)
- `packages/core/test/pty/input.test.ts` (+0, -19)
- `packages/core/test/pty/protocol.test.ts` (+27, -0)
- `packages/core/test/pty/pty-output-isolation.test.ts` (+0, -110)
- `packages/core/test/pty/pty-session.test.ts` (+158, -10)
- `packages/core/test/session-runner-model.test.ts` (+32, -3)
- `packages/core/test/session-runner.test.ts` (+47, -49)

#### Other Changes
- `.changeset/agent-manager-modifier-shortcut-peek.md` (+5, -0)
- `.changeset/agent-manager-side-terminal.md` (+5, -0)
- `.changeset/agent-manager-terminal-destination-consistency.md` (+5, -0)
- `.changeset/atomic-session-revert.md` (+6, -0)
- `.changeset/console-headless-credentials.md` (+5, -0)
- `.changeset/fast-agent-manager-terminals.md` (+5, -0)
- `.changeset/fix-nix-bun-pin.md` (+5, -0)
- `.changeset/instant-prompt-tooltips.md` (+5, -0)
- `.changeset/kilo-exa-websearch.md` (+5, -0)
- `.changeset/opencode-v1-17-5-to-v1-17-9.md` (+30, -0)
- `.changeset/prompt-rail.md` (+5, -0)
- `.changeset/quiet-vscode-watchers.md` (+6, -0)
- `.changeset/reliable-vscode-message-copy.md` (+5, -0)
- `.changeset/safe-windows-snapshot-diffs.md` (+6, -0)
- `.changeset/stalled-provider-first-byte.md` (+5, -0)
- `.changeset/tidy-am-i18n-keys.md` (+5, -0)
- `.github/docs-sync/edit.mjs` (+107, -31)
- `.github/docs-sync/lib.mjs` (+95, -0)
- `.github/docs-sync/prepare-branch.mjs` (+77, -33)
- `.github/docs-sync/selftest.mjs` (+964, -0)
- `.github/docs-sync/triage.mjs` (+120, -42)
- `.github/docs-sync/upsert-pr.mjs` (+245, -15)
- `.github/docs-sync/watermark.mjs` (+58, -26)
- `.github/workflows/docs-sync.yml` (+54, -5)
- `.github/workflows/test-jetbrains.yml` (+2, -0)
- `.opencode-version` (+1, -1)
- `CONTEXT.md` (+5, -0)
- `bun.lock` (+37, -24)
- `bunfig.toml` (+1, -1)
- `flake.nix` (+4, -55)
- `nix/bun.nix` (+60, -0)
- `nix/hashes.json` (+4, -4)
- `package.json` (+11, -5)
- `packages/{opencode/src/session/prompt/max-steps.txt => core/src/session/runner/max-steps.ts}` (+2, -2)
- `packages/{opencode/src/shell => core/src}/shell.ts` (+33, -22)
- `packages/{opencode/test/shell => core/test}/shell.test.ts` (+12, -3)
- `packages/effect-drizzle-sqlite/package.json` (+2, -2)
- `packages/effect-sqlite-node/sst-env.d.ts` (+10, -0)
- `packages/http-recorder/package.json` (+2, -2)
- `packages/http-recorder/sst-env.d.ts` (+10, -0)
- `packages/kilo-docs/lychee.toml` (+3, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/custom-models.md` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-with-diffs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/full-screen-diff-with-changes-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/full-screen-diff-with-collapsed-context-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/side-terminal-panel-empty-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-many-prompts-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-wide-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-apply-patch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-edit-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/shared/markdown-mermaid-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/source-links.md` (+0, -2)
- `packages/kilo-i18n/src/ar.ts` (+2, -22)
- `packages/kilo-i18n/src/br.ts` (+2, -19)
- `packages/kilo-i18n/src/bs.ts` (+0, -18)
- `packages/kilo-i18n/src/da.ts` (+1, -20)
- `packages/kilo-i18n/src/de.ts` (+0, -18)
- `packages/kilo-i18n/src/en.ts` (+2, -19)
- `packages/kilo-i18n/src/es.ts` (+1, -20)
- `packages/kilo-i18n/src/fr.ts` (+0, -18)
- `packages/kilo-i18n/src/it.ts` (+0, -18)
- `packages/kilo-i18n/src/ja.ts` (+2, -21)
- `packages/kilo-i18n/src/ko.ts` (+3, -23)
- `packages/kilo-i18n/src/nl.ts` (+0, -18)
- `packages/kilo-i18n/src/no.ts` (+0, -18)
- `packages/kilo-i18n/src/pl.ts` (+0, -18)
- `packages/kilo-i18n/src/ru.ts` (+0, -18)
- `packages/kilo-i18n/src/th.ts` (+2, -22)
- `packages/kilo-i18n/src/tr.ts` (+3, -21)
- `packages/kilo-i18n/src/uk.ts` (+2, -22)
- `packages/kilo-i18n/src/zh.ts` (+2, -20)
- `packages/kilo-i18n/src/zht.ts` (+3, -22)
- `packages/kilo-ui/package.json` (+1, -0)
- `packages/kilo-ui/src/components/code.tsx` (+1, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+5, -2)
- `packages/kilo-ui/src/context/clipboard.tsx` (+17, -0)
- `packages/kilo-vscode/bunfig.toml` (+1, -1)
- `packages/kilo-vscode/esbuild.js` (+40, -0)
- `packages/kilo-vscode/package.json` (+14, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+25, -23)
- `packages/kilo-vscode/src/agent-manager/SessionTerminalManager.ts` (+21, -12)
- `packages/kilo-vscode/src/agent-manager/SetupScriptService.ts` (+0, -12)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+2, -23)
- `packages/kilo-vscode/src/agent-manager/__tests__/AgentManagerProvider.spec.ts` (+15, -1)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+0, -3)
- `packages/kilo-vscode/src/agent-manager/terminal-destination.ts` (+37, -0)
- `packages/kilo-vscode/src/agent-manager/terminal-routing.ts` (+53, -18)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+27, -36)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+1, -5)
- `packages/kilo-vscode/src/agent-manager/worktree-importer.ts` (+1, -151)
- `packages/kilo-vscode/src/diff/sources/session.ts` (+11, -2)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+23, -1)
- `packages/kilo-vscode/src/services/i18n/autocomplete/ar.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/br.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/bs.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/da.ts` (+0, -24)
- `packages/kilo-vscode/src/services/i18n/autocomplete/de.ts` (+0, -24)
- `packages/kilo-vscode/src/services/i18n/autocomplete/en.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/es.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/fr.ts` (+0, -24)
- `packages/kilo-vscode/src/services/i18n/autocomplete/it.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/ja.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/ko.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/nl.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/no.ts` (+0, -24)
- `packages/kilo-vscode/src/services/i18n/autocomplete/pl.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/ru.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/th.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/tr.ts` (+0, -24)
- `packages/kilo-vscode/src/services/i18n/autocomplete/uk.ts` (+0, -24)
- `packages/kilo-vscode/src/services/i18n/autocomplete/zh.ts` (+0, -23)
- `packages/kilo-vscode/src/services/i18n/autocomplete/zht.ts` (+0, -23)
- `packages/kilo-vscode/src/utils.ts` (+2, -1)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+1, -0)
- `packages/kilo-vscode/tests/markdown-mermaid.spec.ts` (+15, -0)
- `packages/kilo-vscode/tests/setup/worker-url.ts` (+11, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+20, -6)
- `packages/kilo-vscode/tests/unit/agent-manager-i18n.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-destination.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-font.test.ts` (+13, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-routing.test.ts` (+155, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-side.test.ts` (+185, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-state.test.ts` (+168, -0)
- `packages/kilo-vscode/tests/unit/diff-session-source.test.ts` (+33, -0)
- `packages/kilo-vscode/tests/unit/early-message.test.ts` (+44, -0)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+30, -0)
- `packages/kilo-vscode/tests/unit/i18n-unused-keys.test.ts` (+153, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/markdown-raf-coalesce.test.ts` (+0, -62)
- `packages/kilo-vscode/tests/unit/prompt-rail.test.ts` (+192, -0)
- `packages/kilo-vscode/tests/unit/session-terminal-manager.test.ts` (+61, -5)
- `packages/kilo-vscode/tests/unit/transcript-parts.test.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+135, -53)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+95, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+6, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SideTerminalPanel.tsx` (+85, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalDestinationButton.tsx` (+65, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+48, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/index.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+54, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/side.ts` (+156, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/state.ts` (+299, -51)
- `packages/kilo-vscode/webview-ui/kiloclaw/kiloclaw.css` (+0, -52)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+72, -9)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+6, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptRail.tsx` (+223, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-rail.ts` (+98, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/marketplace.css` (+0, -9)
- `packages/kilo-vscode/webview-ui/src/components/migration/migration.css` (+1, -73)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+314, -309)
- `packages/kilo-vscode/webview-ui/src/components/shared/ThinkingSelector.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/SpeechToTextButton.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+7, -25)
- `packages/kilo-vscode/webview-ui/src/context/vscode.tsx` (+33, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+9, -623)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+9, -632)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+9, -634)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+10, -630)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+10, -639)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+9, -634)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+10, -638)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+9, -642)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+4, -580)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+10, -632)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+10, -626)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+9, -635)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+9, -629)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+9, -632)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+9, -636)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+9, -625)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+9, -637)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+9, -632)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+10, -617)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+10, -619)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+135, -0)
- `packages/kilo-vscode/webview-ui/src/stories/history.stories.tsx` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/stories/shared.stories.tsx` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/styles/agent-requirements.css` (+0, -4)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/high-contrast.css` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+0, -10)
- `packages/kilo-vscode/webview-ui/src/styles/notifications.css` (+0, -14)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-rail.css` (+213, -0)
- `packages/kilo-vscode/webview-ui/src/styles/session-actions.css` (+0, -34)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+6, -6)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+24, -19)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+14, -20)
- `packages/llm/package.json` (+2, -2)
- `packages/llm/src/protocols/bedrock-converse.ts` (+3, -0)
- `packages/llm/sst-env.d.ts` (+10, -0)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+20, -0)
- `packages/opencode/script/kilocode/test-profile.ts` (+1, -1)
- `packages/opencode/src/acp/event.ts` (+13, -7)
- `packages/opencode/src/acp/tool.ts` (+65, -19)
- `packages/opencode/src/cli/cmd/mcp.ts` (+2, -1)
- `packages/opencode/src/kilocode/background-process/index.ts` (+1, -1)
- `packages/opencode/src/kilocode/cli/cmd/console.ts` (+5, -5)
- `packages/opencode/src/kilocode/command-timeout.ts` (+1, -1)
- `packages/opencode/src/kilocode/interactive-terminal/index.ts` (+1, -1)
- `packages/opencode/src/kilocode/provider/provider.ts` (+87, -9)
- `packages/opencode/src/kilocode/pty/self-command.ts` (+1, -61)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+1, -1)
- `packages/opencode/src/kilocode/server/server.ts` (+0, -8)
- `packages/opencode/src/kilocode/session/prompt-queue.ts` (+3, -1)
- `packages/opencode/src/kilocode/session/revert.ts` (+51, -0)
- `packages/opencode/src/kilocode/shell/shell.ts` (+1, -124)
- `packages/opencode/src/kilocode/snapshot/diff-full.ts` (+7, -6)
- `packages/opencode/src/kilocode/watcher.ts` (+6, -2)
- `packages/opencode/src/mcp/catalog.ts` (+9, -0)
- `packages/opencode/src/mcp/index.ts` (+30, -5)
- `packages/opencode/src/mcp/oauth-callback.ts` (+18, -6)
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+1, -0)
- `packages/opencode/src/plugin/index.ts` (+3, -2)
- `packages/opencode/src/plugin/openai/codex.ts` (+10, -9)
- `packages/opencode/src/plugin/pty-environment.ts` (+24, -0)
- `packages/opencode/src/plugin/xai.ts` (+1, -19)
- `packages/opencode/src/provider/provider.ts` (+23, -11)
- `packages/opencode/src/provider/transform.ts` (+97, -3)
- `packages/opencode/src/pty-preparation.ts` (+0, -46)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+17, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+23, -20)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+84, -74)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+3, -1)
- `packages/opencode/src/server/server.ts` (+15, -7)
- `packages/opencode/src/session/prompt.ts` (+18, -41)
- `packages/opencode/src/session/revert.ts` (+58, -30)
- `packages/opencode/src/session/tools.ts` (+1, -1)
- `packages/opencode/src/snapshot/index.ts` (+24, -5)
- `packages/opencode/src/util/html.ts` (+8, -0)
- `packages/opencode/sst-env.d.ts` (+10, -0)
- `packages/opencode/test/acp/event.test.ts` (+9, -2)
- `packages/opencode/test/acp/tool.test.ts` (+8, -1)
- `packages/opencode/test/kilocode/background-process.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/bash-permission-metadata.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/command-timeout.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/diff-full.test.ts` (+19, -0)
- `packages/opencode/test/kilocode/fixture/stall-plugin.ts` (+30, -0)
- `packages/opencode/test/kilocode/fixture/stall-transport.ts` (+119, -0)
- `packages/opencode/test/kilocode/instance-vcs-watcher.test.ts` (+13, -1)
- `packages/opencode/test/kilocode/interactive-terminal.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/issue-8656-stall.test.ts` (+180, -0)
- `packages/opencode/test/kilocode/prompt-dismiss-contract.test.ts` (+5, -8)
- `packages/opencode/test/kilocode/provider-saved-auth.test.ts` (+78, -0)
- `packages/opencode/test/kilocode/provider/first-byte.test.ts` (+84, -0)
- `packages/opencode/test/kilocode/sandbox/session.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/session-prompt-steering.test.ts` (+209, -0)
- `packages/opencode/test/kilocode/session/revert.test.ts` (+222, -2)
- `packages/opencode/test/kilocode/shell/shell.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/test-profile.test.ts` (+2, -2)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+34, -2)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+2, -0)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+2, -0)
- `packages/opencode/test/mcp/oauth-callback.test.ts` (+38, -0)
- `packages/opencode/test/plugin/codex.test.ts` (+9, -0)
- `packages/opencode/test/plugin/xai.test.ts` (+0, -14)
- `packages/opencode/test/provider/transform.test.ts` (+297, -0)
- `packages/opencode/test/pty/pty-shell.test.ts` (+0, -102)
- `packages/opencode/test/server/httpapi-event.test.ts` (+4, -11)
- `packages/opencode/test/server/httpapi-exercise/environment.ts` (+1, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+61, -3)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+53, -0)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+27, -0)
- `packages/opencode/test/server/httpapi-v2-pty.test.ts` (+284, -0)
- `packages/opencode/test/session/prompt.test.ts` (+10, -3)
- `packages/opencode/test/share/share-next.test.ts` (+8, -8)
- `packages/opencode/test/util/html.test.ts` (+15, -0)
- `packages/plugin/sst-env.d.ts` (+10, -0)
- `packages/script/sst-env.d.ts` (+10, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+336, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+471, -224)
- `packages/sdk/js/sst-env.d.ts` (+10, -0)
- `packages/sdk/openapi.json` (+2700, -2445)
- `packages/server/src/api.ts` (+2, -0)
- `packages/{opencode/src/server => server/src}/cors.ts` (+2, -4)
- `packages/server/src/errors.ts` (+15, -0)
- `packages/server/src/groups/credential.ts` (+22, -14)
- `packages/server/src/groups/pty.ts` (+144, -0)
- `packages/server/src/handlers.ts` (+4, -0)
- `packages/server/src/handlers/credential.ts` (+3, -3)
- `packages/server/src/handlers/integration.ts` (+2, -2)
- `packages/server/src/handlers/pty.ts` (+219, -0)
- `packages/server/src/kilocode/cors.ts` (+5, -0)
- `packages/server/src/middleware/authorization.ts` (+4, -0)
- `packages/server/src/pty-environment.ts` (+16, -0)
- `packages/server/src/routes.ts` (+2, -0)
- `packages/server/sst-env.d.ts` (+10, -0)
- `packages/storybook/.storybook/main.ts` (+1, -1)
- `packages/storybook/.storybook/mocks/app/context/permission.ts` (+3, -0)
- `packages/storybook/.storybook/mocks/app/context/prompt.ts` (+36, -28)
- `packages/storybook/.storybook/mocks/app/context/sdk.ts` (+10, -8)
- `packages/storybook/.storybook/mocks/app/context/sync.ts` (+17, -14)
- `packages/storybook/.storybook/mocks/solid-router.tsx` (+4, -0)
- `packages/storybook/.storybook/preview.tsx` (+1, -0)
- `packages/storybook/sst-env.d.ts` (+10, -0)
- `packages/tui/package.json` (+4, -3)
- `packages/tui/src/component/dialog-console-org.tsx` (+38, -6)
- `packages/tui/src/component/dialog-move-session.tsx` (+78, -46)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+4, -2)
- `packages/tui/src/context/data.tsx` (+11, -1)
- `packages/tui/src/context/sync.tsx` (+20, -5)
- `packages/tui/src/kilocode/session-mentions.ts` (+0, -2)
- `packages/tui/src/routes/session/index.tsx` (+40, -52)
- `packages/tui/src/ui/dialog-select.tsx` (+6, -3)
- `packages/tui/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+10, -4)
- `packages/tui/test/cli/tui/data.test.tsx` (+53, -3)
- `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+42, -30)
- `packages/tui/test/fixture/tui-sdk.ts` (+1, -0)
- `packages/ui/package.json` (+4, -3)
- `packages/ui/src/components/file.css` (+4, -0)
- `packages/ui/src/components/file.tsx` (+1, -1)
- `packages/ui/src/components/markdown-code-state.test.ts` (+32, -0)
- `packages/ui/src/components/markdown-code-state.ts` (+22, -0)
- `packages/ui/src/components/markdown-shiki.worker.ts` (+106, -0)
- `packages/ui/src/components/markdown-stream.test.ts` (+165, -3)
- `packages/ui/src/components/markdown-stream.ts` (+77, -20)
- `packages/ui/src/components/markdown-worker-protocol.test.ts` (+81, -0)
- `packages/ui/src/components/markdown-worker-protocol.ts` (+48, -0)
- `packages/ui/src/components/markdown-worker-queue.test.ts` (+49, -0)
- `packages/ui/src/components/markdown-worker-queue.ts` (+64, -0)
- `packages/ui/src/components/markdown-worker-transport.test.ts` (+56, -0)
- `packages/ui/src/components/markdown-worker-transport.ts` (+41, -0)
- `packages/ui/src/components/markdown-worker.ts` (+122, -0)
- `packages/ui/src/components/markdown.css` (+8, -0)
- `packages/ui/src/components/markdown.tsx` (+420, -180)
- `packages/ui/src/components/message-part.tsx` (+25, -2)
- `packages/ui/src/components/popover.tsx` (+1, -1)
- `packages/ui/src/components/scroll-view.test.ts` (+36, -1)
- `packages/ui/src/components/scroll-view.tsx` (+29, -16)
- `packages/ui/src/context/marked.tsx` (+378, -2)
- `packages/ui/src/kilocode/markdown-bidi.test.ts` (+8, -0)
- `packages/ui/src/kilocode/markdown-stable-blocks.test.ts` (+0, -54)
- `packages/ui/src/kilocode/markdown-stable-blocks.ts` (+0, -25)
- `packages/ui/src/pierre/index.ts` (+12, -20)
- `packages/ui/src/pierre/kilo-diff-theme.ts` (+18, -5)
- `packages/ui/src/pierre/virtualizer.ts` (+1, -1)
- `packages/ui/src/v2/components/icon-button-v2.css` (+1, -0)
- `packages/ui/sst-env.d.ts` (+10, -0)
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch` (+26, -0)
- `patches/@pierre%2Ftrees@1.0.0-beta.4.patch` (+107, -0)
- `patches/@tanstack%2Fsolid-virtual@3.13.28.patch` (+45, -0)
- `patches/@tanstack%2Fvirtual-core@3.17.0.patch` (+58, -0)
- `patches/gcp-metadata@8.1.2.patch` (+14, -0)
- `script/check-opencode-promise-facades.ts` (+4, -0)
- `script/upstream/merge.ts` (+9, -2)
- `script/upstream/transforms/transform-package-json.test.ts` (+26, -0)
- `script/upstream/transforms/transform-package-json.ts` (+16, -7)
- `script/upstream/utils/git.test.ts` (+40, -0)
- `script/upstream/utils/git.ts` (+42, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index d5f73a398..ddb4d33d3 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -10,8 +10,8 @@
     "migration": "bun run script/migration.ts",
     "fix-node-pty": "bun run script/fix-node-pty.ts",
     "test": "bun test --only-failures",
-    "test:ci": "mkdir -p .artifacts/unit && bun test --timeout 30000 --reporter=junit --reporter-outfile=.artifacts/unit/junit.xml",
-    "typecheck": "tsgo --noEmit"
+    "typecheck": "tsgo --noEmit",
+    "test:ci": "mkdir -p .artifacts/unit && bun test --timeout 30000 --reporter=junit --reporter-outfile=.artifacts/unit/junit.xml"
   },
   "bin": {
     "opencode": "./bin/opencode"
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index 82ab2b821..4156db5c3 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -10,8 +10,7 @@ import { Location } from "./location"
 import { EventV2 } from "./event"
 import { Policy } from "./policy"
 import { State } from "./state"
-import { Credential } from "./credential"
-import { IntegrationSchema } from "./integration/schema"
+import { Integration } from "./integration"
 
 export type ProviderRecord = {
   provider: ProviderV2.Info
@@ -35,12 +34,7 @@ export class ModelNotFoundError extends Schema.TaggedErrorClass<ModelNotFoundErr
 export const PolicyActions = Schema.Literals(["provider.use"])
 
 export const Event = {
-  ModelUpdated: EventV2.define({
-    type: "catalog.model.updated",
-    schema: {
-      model: ModelV2.Info,
-    },
-  }),
+  Updated: EventV2.define({ type: "catalog.updated", schema: {} }),
 }
 
 type Data = {
@@ -96,31 +90,17 @@ export const layer = Layer.effect(
     const plugin = yield* PluginV2.Service
     const events = yield* EventV2.Service
     const policy = yield* Policy.Service
-    const credentials = yield* Credential.Service
+    const integrations = yield* Integration.Service
     const scope = yield* Scope.Scope
 
-    const project = (provider: ProviderV2.Info, active: Map<IntegrationSchema.ID, Credential.Stored>) => {
-      const credential = active.get(IntegrationSchema.ID.make(provider.id))
-      if (!credential) return provider
-      const body = { ...provider.request.body }
-      if (credential.value.type === "key") {
-        body.apiKey = credential.value.key
-        Object.assign(body, credential.value.metadata ?? {})
-      }
-      // kilocode_change start - preserve Kilo organization routing from migrated OAuth credentials
-      if (credential.value.type === "oauth") {
-        body.apiKey = credential.value.access
-        if (credential.value.metadata?.accountID) body.kilocodeOrganizationId = credential.value.metadata.accountID
-      }
-      // kilocode_change end
```

#### packages/core/src/config/plugin/provider.ts
```diff
diff --git a/packages/core/src/config/plugin/provider.ts b/packages/core/src/config/plugin/provider.ts
index 0d31b32d0..47a3712e3 100644
--- a/packages/core/src/config/plugin/provider.ts
+++ b/packages/core/src/config/plugin/provider.ts
@@ -3,6 +3,7 @@ export * as ConfigProviderPlugin from "./provider"
 import { Effect } from "effect"
 import { Catalog } from "../../catalog"
 import { Config } from "../../config"
+import { Integration } from "../../integration"
 import { ModelV2 } from "../../model"
 import { ModelRequest } from "../../model-request"
 import { PluginV2 } from "../../plugin"
@@ -13,9 +14,33 @@ export const Plugin = PluginV2.define({
   effect: Effect.gen(function* () {
     const catalog = yield* Catalog.Service
     const config = yield* Config.Service
+    const integrations = yield* Integration.Service
     const transform = yield* catalog.transform()
+    const integrationTransform = yield* integrations.transform()
     const entries = yield* config.entries()
     const files = entries.filter((entry): entry is Config.Document => entry.type === "document")
+    const configuredIntegrations = new Set(
+      files.flatMap((file) =>
+        Object.entries(file.info.providers ?? {}).flatMap(([id, provider]) => (provider.env === undefined ? [] : [id])),
+      ),
+    )
+    yield* integrationTransform((integrations) => {
+      for (const file of files) {
+        for (const [id, item] of Object.entries(file.info.providers ?? {})) {
+          const integrationID = Integration.ID.make(id)
+          if (!configuredIntegrations.has(id) && !integrations.get(integrationID)) continue
+          integrations.update(integrationID, (integration) => {
+            integration.name = item.name ?? integration.name
+          })
+          if (item.env !== undefined) {
+            integrations.method.update({
+              integrationID,
+              method: { type: "env", names: [...item.env] },
+            })
+          }
+        }
+      }
+    })
 
     yield* transform((catalog) => {
       const configuredDefault = Config.latest(entries, "model")
@@ -28,8 +53,6 @@ export const Plugin = PluginV2.define({
           const providerID = ProviderV2.ID.make(id)
           catalog.provider.update(providerID, (provider) => {
             if (item.name !== undefined) provider.name = item.name
```

#### packages/core/src/credential.ts
```diff
diff --git a/packages/core/src/credential.ts b/packages/core/src/credential.ts
index 11a987fac..6dc4bae1e 100644
--- a/packages/core/src/credential.ts
+++ b/packages/core/src/credential.ts
@@ -102,6 +102,8 @@ export interface Interface {
   readonly all: () => Effect.Effect<Stored[]>
   /** Returns stored credentials belonging to one integration. */
   readonly list: (integrationID: IntegrationSchema.ID) => Effect.Effect<Stored[]>
+  /** Returns one stored credential by ID. */
+  readonly get: (id: ID) => Effect.Effect<Stored | undefined>
   /** Replaces any credential for an integration and returns the new record. */
   readonly create: (input: {
     readonly integrationID: IntegrationSchema.ID
@@ -350,6 +352,11 @@ export const layer = Layer.effect(
           return credential ? [credential] : []
         })
       }),
+      get: Effect.fn("Credential.get")(function* (id) {
+        if (isolated) return find(id) // kilocode_change - injected workspace credentials are process-local
+        const row = yield* db.select().from(CredentialTable).where(eq(CredentialTable.id, id)).get().pipe(Effect.orDie)
+        return row ? stored(row) : undefined
+      }),
       create: Effect.fn("Credential.create")(function* (input) {
         const credential = new Stored({
           id: ID.create(),
```

#### packages/core/src/integration.ts
```diff
diff --git a/packages/core/src/integration.ts b/packages/core/src/integration.ts
index 64053ee44..7e007aa83 100644
--- a/packages/core/src/integration.ts
+++ b/packages/core/src/integration.ts
@@ -29,15 +29,16 @@ export const When = Schema.Struct({
 }).annotate({ identifier: "Integration.When" })
 export type When = typeof When.Type
 
-export class TextPrompt extends Schema.Class<TextPrompt>("Integration.TextPrompt")({
+export const TextPrompt = Schema.Struct({
   type: Schema.Literal("text"),
   key: Schema.String,
   message: Schema.String,
   placeholder: Schema.optional(Schema.String),
   when: Schema.optional(When),
-}) {}
+}).annotate({ identifier: "Integration.TextPrompt" })
+export type TextPrompt = typeof TextPrompt.Type
 
-export class SelectPrompt extends Schema.Class<SelectPrompt>("Integration.SelectPrompt")({
+export const SelectPrompt = Schema.Struct({
   type: Schema.Literal("select"),
   key: Schema.String,
   message: Schema.String,
@@ -49,27 +50,31 @@ export class SelectPrompt extends Schema.Class<SelectPrompt>("Integration.Select
     }),
   ),
   when: Schema.optional(When),
-}) {}
+}).annotate({ identifier: "Integration.SelectPrompt" })
+export type SelectPrompt = typeof SelectPrompt.Type
 
 export const Prompt = Schema.Union([TextPrompt, SelectPrompt]).pipe(Schema.toTaggedUnion("type"))
 export type Prompt = typeof Prompt.Type
 
-export class OAuthMethod extends Schema.Class<OAuthMethod>("Integration.OAuthMethod")({
+export const OAuthMethod = Schema.Struct({
   id: MethodID,
   type: Schema.Literal("oauth"),
   label: Schema.String,
   prompts: Schema.optional(Schema.Array(Prompt)),
-}) {}
+}).annotate({ identifier: "Integration.OAuthMethod" })
+export type OAuthMethod = typeof OAuthMethod.Type
 
-export class KeyMethod extends Schema.Class<KeyMethod>("Integration.KeyMethod")({
+export const KeyMethod = Schema.Struct({
   type: Schema.Literal("key"),
   label: Schema.optional(Schema.String),
-}) {}
```


*... and more files (showing first 5)*

## opencode Changes (1ead8d8..7565e03)

### Commits

- 7565e03 - chore: generate (opencode-agent[bot], 2026-07-29)
- 035a5a1 - feat(desktop): refine tab states (#39472) (usrnk1, 2026-07-29)
- e8b0992 - fix(app): defer model variant selector (#39445) (Brendan Allan, 2026-07-29)
- 8cbea4f - chore: generate (opencode-agent[bot], 2026-07-29)
- f256a4c - fix(app): preserve agent picker for existing users (#39300) (Brendan Allan, 2026-07-29)
- a45c2b9 - sync release versions for v1.18.9 (opencode, 2026-07-28)
- f28d72d - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-28)
- d8a9d8a - chore: generate (opencode-agent[bot], 2026-07-28)
- 982a904 - fix(mcp): restore legacy SDK compatibility (#39373) (Aiden Cline, 2026-07-28)
- 7edefb3 - chore(mcp): upgrade client to 2.0.0 (#39369) (opencode-agent[bot], 2026-07-28)
- 017a597 - feat(desktop): remove v2 vertical menu borders (#39317) (usrnk1, 2026-07-28)
- 7336cc5 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-28)
- e158758 - chore: generate (opencode-agent[bot], 2026-07-28)
- be93cec - fix(app): guard reentrant Solid cleanup (#39261) (opencode-agent[bot], 2026-07-28)
- 7c89824 - fix(desktop): patch @dnd-kit/solid to preserve core scroll plugins (#38119) (Robin Andrew, 2026-07-28)
- 9e432a6 - feat(desktop): add opt-in v2 sidecar (#39286) (Brendan Allan, 2026-07-28)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/code-mode.ts` (+23, -2)
- `packages/opencode/test/tool/code-mode-integration.test.ts` (+9, -8)
- `packages/opencode/test/tool/code-mode.test.ts` (+1, -1)
- `packages/opencode/test/tool/registry.test.ts` (+1, -1)

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
- `.github/workflows/publish.yml` (+0, -4)
- `bun.lock` (+96, -46)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -2)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/prompt-input-v2.tsx` (+1, -0)
- `packages/app/src/components/titlebar-tab-nav.css` (+51, -18)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+6, -6)
- `packages/app/src/context/settings.test.ts` (+17, -0)
- `packages/app/src/context/settings.tsx` (+19, -3)
- `packages/app/src/pages/home/home-projects-view.tsx` (+2, -3)
- `packages/app/test-browser/solid-router-cleanup.test.ts` (+64, -0)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/electron-builder.config.test.ts` (+33, -0)
- `packages/desktop/electron-builder.config.ts` (+10, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/scripts/prebuild.ts` (+2, -1)
- `packages/desktop/scripts/predev.ts` (+2, -0)
- `packages/desktop/scripts/utils.ts` (+42, -22)
- `packages/desktop/src/main/background-cli.ts` (+125, -0)
- `packages/desktop/src/main/index.ts` (+47, -28)
- `packages/desktop/src/main/server.ts` (+3, -1)
- `packages/desktop/src/renderer/onboarding.tsx` (+1, -0)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+2, -3)
- `packages/opencode/src/cli/cmd/mcp.ts` (+102, -45)
- `packages/opencode/src/mcp/auth.ts` (+0, -4)
- `packages/opencode/src/mcp/catalog.ts` (+91, -44)
- `packages/opencode/src/mcp/index.ts` (+30, -52)
- `packages/opencode/src/mcp/oauth-callback.ts` (+3, -9)
- `packages/opencode/src/mcp/oauth-provider.ts` (+22, -63)
- `packages/opencode/src/server/routes/instance/httpapi/groups/mcp.ts` (+0, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/mcp.ts` (+1, -1)
- `packages/opencode/src/session/tools.ts` (+1, -1)
- `packages/opencode/test/fixture/mcp-lifecycle-stdio.ts` (+4, -3)
- `packages/opencode/test/fixture/mcp-session-recovery.ts` (+5, -9)
- `packages/opencode/test/mcp/catalog.test.ts` (+15, -51)
- `packages/opencode/test/mcp/headers.test.ts` (+4, -21)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+18, -13)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+5, -3)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+4, -2)
- `packages/opencode/test/mcp/oauth-callback.test.ts` (+1, -1)
- `packages/opencode/test/mcp/oauth-provider.test.ts` (+41, -0)
- `packages/opencode/test/mcp/session-recovery.test.ts` (+0, -20)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+0, -2)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+0, -1)
- `packages/sdk/openapi.json` (+0, -3)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/v2/components/prompt-input/index.tsx` (+2, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/v2/components/tabs-v2.css` (+0, -2)
- `packages/web/package.json` (+1, -1)
- `patches/@dnd-kit%2Fdom@0.5.0.patch` (+40, -0)
- `patches/@modelcontextprotocol%2Fclient@2.0.0-beta.5.patch` (+0, -214)
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch` (+629, -0)
- `patches/solid-js@1.9.10.patch` (+146, -10)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index f5a1bbb..f922ab9 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.8",
+  "version": "1.18.9",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index c1635e6..2325bcc 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.8",
+  "version": "1.18.9",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/tool/code-mode.ts
```diff
diff --git a/packages/opencode/src/tool/code-mode.ts b/packages/opencode/src/tool/code-mode.ts
index a046b40..332d4b4 100644
--- a/packages/opencode/src/tool/code-mode.ts
+++ b/packages/opencode/src/tool/code-mode.ts
@@ -1,5 +1,5 @@
 import * as Tool from "./tool"
-import { type CallToolResult } from "@modelcontextprotocol/client"
+import { CallToolResultSchema, type CallToolResult } from "@modelcontextprotocol/sdk/types.js"
 import { Cause, Effect, Schema } from "effect"
 import { CodeMode, Tool as SandboxTool, toolError } from "@opencode-ai/codemode"
 import { MCP } from "@/mcp"
@@ -145,7 +145,28 @@ const invokeChildTool = Effect.fn("CodeMode.invokeChildTool")(function* (input:
   )
   const result: CallToolResult = yield* Effect.gen(function* () {
     yield* input.ctx.ask({ permission: input.entry.key, metadata: {}, patterns: ["*"], always: ["*"] })
-    return yield* Effect.promise(() => McpCatalog.callTool(input.entry.tool, input.args, input.ctx.abort))
+    // Deliberately mirrors McpCatalog.convertTool's transport call so the MCP service stays free of tool-loop concerns.
+    return yield* Effect.promise(async () => {
+      const raw = await input.entry.tool.client.callTool(
+        { name: input.entry.tool.def.name, arguments: input.args },
+        CallToolResultSchema,
+        {
+          resetTimeoutOnProgress: true,
+          signal: input.ctx.abort,
+          timeout: input.entry.tool.timeout,
+          // The MCP SDK only sends a progress token when this hook is present, enabling timeout resets.
+          onprogress: () => {},
+        },
+      )
+      if (raw.isError)
+        throw new Error(
+          raw.content
+            .flatMap((item) => (item.type === "text" ? [item.text] : []))
+            .filter((text) => text.trim())
+            .join("\n\n") || "MCP tool returned an error",
+        )
+      return raw
+    })
   }).pipe(
     Effect.withSpan("Tool.execute", {
       attributes: {
```

#### packages/opencode/test/tool/code-mode-integration.test.ts
```diff
diff --git a/packages/opencode/test/tool/code-mode-integration.test.ts b/packages/opencode/test/tool/code-mode-integration.test.ts
index 32cb420..671acd8 100644
--- a/packages/opencode/test/tool/code-mode-integration.test.ts
+++ b/packages/opencode/test/tool/code-mode-integration.test.ts
@@ -8,14 +8,15 @@ import { Session } from "@/session/session"
 import { Tool } from "@/tool/tool"
 import * as Truncate from "@/tool/truncate"
 import { MessageID, SessionID } from "@/session/schema"
-import { Server } from "@modelcontextprotocol/server"
+import { Server } from "@modelcontextprotocol/sdk/server/index.js"
+import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
+import type { Client } from "@modelcontextprotocol/sdk/client/index.js"
 import {
-  InMemoryTransport,
+  CallToolRequestSchema,
   LATEST_PROTOCOL_VERSION,
-  type CallToolResult,
-  type Client,
+  ListToolsRequestSchema,
   type Tool as MCPToolDef,
-} from "@modelcontextprotocol/client"
+} from "@modelcontextprotocol/sdk/types.js"
 import { Cause, Effect, Exit, Layer } from "effect"
 
 const PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
@@ -99,7 +100,7 @@ const TOOL_DEFS: MCPToolDef[] = [
   },
 ] as MCPToolDef[]
 
-function handleCall(name: string, args: Record<string, unknown>): CallToolResult {
+function handleCall(name: string, args: Record<string, unknown>) {
   switch (name) {
     case "get_text":
       return { content: [{ type: "text", text: `hello ${args.name}` }] }
@@ -121,8 +122,8 @@ let description: string
 
 async function buildTool() {
   const server = new Server({ name: SERVER, version: "1.0.0" }, { capabilities: { tools: {} } })
-  server.setRequestHandler("tools/list", async () => ({ tools: TOOL_DEFS }))
-  server.setRequestHandler("tools/call", async (req) =>
+  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFS }))
+  server.setRequestHandler(CallToolRequestSchema, async (req) =>
     handleCall(req.params.name, (req.params.arguments ?? {}) as Record<string, unknown>),
   )
 
```

#### packages/opencode/test/tool/code-mode.test.ts
```diff
diff --git a/packages/opencode/test/tool/code-mode.test.ts b/packages/opencode/test/tool/code-mode.test.ts
index cc32d2a..34b3faa 100644
--- a/packages/opencode/test/tool/code-mode.test.ts
+++ b/packages/opencode/test/tool/code-mode.test.ts
@@ -1,6 +1,6 @@
 import { describe, expect, test } from "bun:test"
 import { CODE_MODE_TOOL, CodeModeTool, Parameters, describeCatalog } from "@/tool/code-mode"
-import type { Tool as MCPToolDef } from "@modelcontextprotocol/client"
+import type { Tool as MCPToolDef } from "@modelcontextprotocol/sdk/types.js"
 import type { PermissionV1 } from "@opencode-ai/core/v1/permission"
 import { Agent } from "@/agent/agent"
 import { MCP } from "@/mcp"
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/catalog.ts
- `src/core/` - review core changes from packages/core/src/config/plugin/provider.ts
- `src/core/` - review core changes from packages/core/src/credential.ts
- `src/core/` - review core changes from packages/core/src/integration.ts
- `src/core/` - review core changes from packages/core/src/integration/connection.ts
- `src/core/` - review core changes from packages/core/src/kilocode/powershell.ts
- `src/core/` - review core changes from packages/core/src/kilocode/pty-self-command.ts
- `src/core/` - review core changes from packages/core/src/location.ts
- `src/core/` - review core changes from packages/core/src/plugin/boot.ts
- `src/core/` - review core changes from packages/core/src/plugin/env.ts
- `src/core/` - review core changes from packages/core/src/plugin/models-dev.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/kilo.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/llmgateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openai-auth.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/opencode.ts
- `src/core/` - review core changes from packages/core/src/plugin/skill.ts
- `src/core/` - review core changes from packages/core/src/plugin/skill/customize-opencode.md
- `src/core/` - review core changes from packages/core/src/project/copy.ts
- `src/core/` - review core changes from packages/core/src/provider.ts
- `src/core/` - review core changes from packages/core/src/pty.ts
- `src/core/` - review core changes from packages/core/src/pty/input.ts
- `src/core/` - review core changes from packages/core/src/pty/protocol.ts
- `src/core/` - review core changes from packages/core/src/session/runner/index.ts
- `src/core/` - review core changes from packages/core/src/session/runner/llm.ts
- `src/core/` - review core changes from packages/core/src/session/runner/model.ts
- `src/core/` - review core changes from packages/core/sst-env.d.ts
- `src/core/` - review core changes from packages/core/test/catalog.test.ts
- `src/core/` - review core changes from packages/core/test/config/provider.test.ts
- `src/core/` - review core changes from packages/core/test/integration.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/integration-settlement.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/provider-isolation.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/session-runner-model.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/models-dev.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-gitlab.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-helper.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-kilo.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-llmgateway.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-opencode.test.ts
- `src/core/` - review core changes from packages/core/test/project-copy.test.ts
- `src/core/` - review core changes from packages/core/test/pty/info-schema.test.ts
- `src/core/` - review core changes from packages/core/test/pty/input.test.ts
- `src/core/` - review core changes from packages/core/test/pty/protocol.test.ts
- `src/core/` - review core changes from packages/core/test/pty/pty-output-isolation.test.ts
- `src/core/` - review core changes from packages/core/test/pty/pty-session.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-model.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/external-directory-allow.test.ts
- `src/tool/code-mode-integration.test.ts` - update based on opencode packages/opencode/test/tool/code-mode-integration.test.ts changes
- `src/tool/code-mode.test.ts` - update based on opencode packages/opencode/test/tool/code-mode.test.ts changes
- `src/tool/code-mode.ts` - update based on opencode packages/opencode/src/tool/code-mode.ts changes
- `src/tool/interactive-terminal.ts` - update based on kilocode packages/opencode/src/kilocode/tool/interactive-terminal.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on kilocode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/shell-unparsed.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/shell-unparsed.test.ts changes
- `src/tool/shell.test.ts` - update based on kilocode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/websearch-kilo-exa.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/websearch-kilo-exa.test.ts changes
- `src/tool/websearch-kilo-exa.ts` - update based on kilocode packages/opencode/src/kilocode/tool/websearch-kilo-exa.ts changes
- `src/tool/websearch.ts` - update based on kilocode packages/opencode/src/tool/websearch.ts changes
