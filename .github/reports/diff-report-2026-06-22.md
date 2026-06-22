# Upstream Changes Report
Generated: 2026-06-22 11:56:11

## Summary
- kilocode: 108 commits, 402 files changed
- opencode: 32 commits, 214 files changed

## kilocode Changes (a42413247..d378114b8)

### Commits

- d378114b8 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-22)
- e3da86822 - release: v7.3.52 (kilo-maintainer[bot], 2026-06-22)
- 9e0d693f1 - Merge pull request #11468 from Kilo-Org/smoggy-thunder (Marius, 2026-06-22)
- 1961f6363 - Merge pull request #11450 from Kilo-Org/imanolmaiztegui/kilo-opencode-v1.15.13 (Imanol Maiztegui, 2026-06-22)
- 2e89ea402 - release: v7.3.51 (kilo-maintainer[bot], 2026-06-22)
- 8cac9f043 - test(cli): keep recall regression in kilo tests (marius-kilocode, 2026-06-22)
- aaa9d324d - fix(cli): preserve recall tail during queued turns (marius-kilocode, 2026-06-22)
- b43bd5e06 - feat(worktree): walk ancestor directories when resolving primary checkout paths (Imanol Maiztegui, 2026-06-19)
- 4c3aaf428 - fix(cli): harden recall turn boundaries (marius-kilocode, 2026-06-19)
- 3eca0df90 - refactor(indexing): batch boot effects into single runtime execution (Imanol Maiztegui, 2026-06-19)
- 7aaa25d97 - feat(worktree): resolve primary checkout for config, skill, and session fallback (Imanol Maiztegui, 2026-06-19)
- 52523a736 - fix(cli): escape recalled system directives (marius-kilocode, 2026-06-19)
- 0a3f51d2e - perf(cli): scope local recall transcript scans (marius-kilocode, 2026-06-19)
- 27bd20680 - feat(cli): search local session transcripts (marius-kilocode, 2026-06-19)
- 0ab78cb8b - fix(core): correct listener routes, test expectations, and comment markers post-merge (Imanol Maiztegui, 2026-06-19)
- 351c2e4fc - chore(monorepo): remove stats package and align upstream skip rules (Imanol Maiztegui, 2026-06-19)
- 229068188 - Merge branch 'main' into imanolmaiztegui/kilo-opencode-v1.15.13 (Imanol Maiztegui, 2026-06-19)
- cc924a67d - docs(changeset): add patch notes for opencode v1.15.9 to v1.15.13 upgrade (Imanol Maiztegui, 2026-06-19)
- 984b1f204 - refactor: adapt kilo changes to upstream v1.15.13 API (Imanol Maiztegui, 2026-06-19)
- 8c2fa74f8 - resolve merge conflicts (Imanol Maiztegui, 2026-06-19)
- c1254fa52 - merge: record upstream v1.15.13 (Imanol Maiztegui, 2026-06-18)
- 2266489ef - refactor: kilo compat for v1.15.13 (Imanol Maiztegui, 2026-06-18)
- 385cb6944 - release: v1.15.13 (opencode, 2026-05-30)
- 30f978056 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-30)
- 3070b0f4a - fix(opencode): default display summarized for gateway opus 4.7+ adaptive reasoning (#30027) (Aiden Cline, 2026-05-30)
- 52e288ea7 - chore: generate (opencode-agent[bot], 2026-05-30)
- 9b915e70b - v2: default agents (Dax Raad, 2026-05-30)
- ddc30cd15 - feat(core): add session metadata support (#23068) (Shantur Rathore, 2026-05-30)
- ac8e686f3 - zen: batch balance calculation (Frank, 2026-05-30)
- 69b2784b1 - chore: generate (opencode-agent[bot], 2026-05-30)
- 6a2cd816b - core: credit referral invites on first Lite checkout (vimtor, 2026-05-30)
- 04c46117b - chore: generate (opencode-agent[bot], 2026-05-30)
- 51a9b0baa - zen: log ip prefix (Frank, 2026-05-30)
- bcc345ff8 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-30)
- 0d2508ffd - chore: generate (opencode-agent[bot], 2026-05-30)
- f6062bd5b - feat(core): add default agent plugin (Dax Raad, 2026-05-30)
- 181e58f50 - feat(cli): add effect cli scaffold (Dax Raad, 2026-05-30)
- 1ceb5dbd5 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-30)
- e4d3b81b0 - chore: generate (opencode-agent[bot], 2026-05-30)
- 9583e08be - feat(core): add location-scoped config loading (#29625) (Dax, 2026-05-30)
- 5fb85a6aa - fix(tui): align wrapped inline tool rows (#28664) (Kit Langton, 2026-05-29)
- b2a06351b - chore: generate (opencode-agent[bot], 2026-05-29)
- 9d5f3c183 - fix(workspaces): surface real error messages on failed workspace operations (#29167) (James Murdza, 2026-05-29)
- 7342e9409 - fix(stats): scroll dense mobile charts (Adam, 2026-05-29)
- 8fe6cd993 - chore: generate (opencode-agent[bot], 2026-05-29)
- 4cc166a40 - feat(acp): promote next implementation (#29929) (Shoubhit Dash, 2026-05-30)
- 0733c080c - ignore: bug report template (Aiden Cline, 2026-05-29)
- 73c7bef1d - chore: generate (opencode-agent[bot], 2026-05-29)
- 9854c5d91 - fix(stats): stabilize stacked chart bands (Adam, 2026-05-29)
- 494b55a2a - chore: generate (opencode-agent[bot], 2026-05-29)
- aa22cf841 - fix(stats): reorder market share section (Adam, 2026-05-29)
- c977cb7f3 - Combine top models and leaderboard sections (Adam, 2026-05-29)
- a4bc76d2a - chore: remove improve codebase architecture skill (#29926) (James Long, 2026-05-29)
- 39cd14826 - chore: generate (opencode-agent[bot], 2026-05-29)
- 6b0e5499f - fix(stats): tighten 2m chart gaps (Adam, 2026-05-29)
- a87b27a8b - chore: generate (opencode-agent[bot], 2026-05-29)
- ce4e0e8a4 - fix(stats): rotate dense chart labels (Adam, 2026-05-29)
- b956e9a06 - fix(opencode): support vertex opus adaptive reasoning (#29911) (Aiden Cline, 2026-05-29)
- 16cae9a32 - fix(stats): stack largest segments at bottom (Adam, 2026-05-29)
- 0a60dbdce - fix(stats): stabilize newsletter form reset (Adam, 2026-05-29)
- bccebb8a3 - fix(stats): refine newsletter modal (Adam, 2026-05-29)
- 76dbe10ad - feat(stats): match theme icons to figma (#29893) (Adam, 2026-05-29)
- 46836beec - fix(stats): add social unfurl metadata (#29892) (Adam, 2026-05-29)
- e84988b2a - fix(stats): ignore partial may 27 athena data (#29891) (Adam, 2026-05-29)
- 3f6cb631c - fix: referral edge case (vimtor, 2026-05-29)
- e9966b651 - feat(stats): improve mobile leaderboard layout (Adam, 2026-05-29)
- dc28b8239 - Add live GitHub star count to stats page (Adam, 2026-05-29)
- fb6275e04 - fix(stats): improve mobile charts (Adam, 2026-05-29)
- 6102fb2e3 - docs: update Go availability and Zen pricing (#29890) (Jack, 2026-05-29)
- 7da262007 - fix(tui): pin dialog select footer to bottom (#29878) (Shoubhit Dash, 2026-05-29)
- 5764f1993 - core: credit users for missed referral rewards (vimtor, 2026-05-29)
- 41198186b - chore: generate (opencode-agent[bot], 2026-05-29)
- 8f8b161ca - feat(tui): add session switcher plugin (#29861) (Shoubhit Dash, 2026-05-29)
- 710ed7cb3 - chore: generate (opencode-agent[bot], 2026-05-29)
- fa73ec4fa - fix(opencode): serialize mcp auth mutations (#29852) (Shoubhit Dash, 2026-05-29)
- c7e1fc5e4 - fix(opencode): retry stalled SSE streams (#29837) (Aiden Cline, 2026-05-29)
- a15d4f9f0 - fix(openai): proxy websocket connections under bun (#29832) (Aiden Cline, 2026-05-28)
- 43f110a6c - chore: generate (opencode-agent[bot], 2026-05-29)
- 29d17b905 - fix(opencode): allow pid 0 in Pty.Info for Windows ConPTY (#29828) (Luke Parker, 2026-05-29)
- 031f82adc - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-29)
- 672b8c476 - fix(desktop): bump @lydell/node-pty to 1.2.0-beta.12 (#29803) (Luke Parker, 2026-05-29)
- 0dc44772d - fix(stats): tune dark tooltip colors (Adam, 2026-05-28)
- 797c689ec - fix(opencode): pass OAuth scopes to GoogleAuth for Vertex AI (#15110) (Saurav M H, 2026-05-28)
- acca8864b - chore: generate (opencode-agent[bot], 2026-05-28)
- 7480b9763 - fix(stats): proxy build assets under stats path (Adam, 2026-05-28)
- edc7a20ce - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-28)
- 58da1ea48 - feat(stats): route stats app (Adam, 2026-05-28)
- 0d67d659f - feat(stats): polish rankings page (Adam, 2026-05-28)
- 6a9087007 - chore: generate (opencode-agent[bot], 2026-05-28)
- c63d532cc - refactor: simplify the changed workflow (Adam, 2026-05-28)
- 629d5593e - feat(stats): split updated timestamp ticker (Adam, 2026-05-28)
- ffbf9df18 - Refine leaderboard layout and styling (Adam, 2026-05-28)
- e3a6255c7 - Fix touch interaction in top models chart (Adam, 2026-05-28)
- 9f1571587 - zen: sync (Frank, 2026-05-28)
- ecd645b02 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-28)
- 4d894d129 - fix(app): prevent horizontal jitter on /go page (#29796) (NoisemakerJon, 2026-05-28)
- 4759ae44b - chore: generate (opencode-agent[bot], 2026-05-28)
- e00a62e46 - chore: bump gitlab-ai-provider to 6.8.0 (#29792) (Vladimir Glafirov, 2026-05-28)
- e16bfd745 - fix(app): start MCP servers only for open directories (#28937) (Luke Parker, 2026-05-28)
- 7b56a1cea - fix(tui): order connected provider models by release date (#29798) (Aiden Cline, 2026-05-28)
- 1f707f1b5 - fix(dialog-provider): change url for opencode-go provider to correct… (#29780) (Guilherme França, 2026-05-28)
- caf2451da - chore: generate (opencode-agent[bot], 2026-05-28)
- de7bb076a - docs: add opencode-goal-plugin to ecosystem (#29788) (William Ricchiuti, 2026-05-28)
- d92468593 - docs: fix russian translation (#29742) (Vadim Safonov, 2026-05-28)
- 569230bfb - sync release versions for v1.15.12 (opencode, 2026-05-28)
- cbc4b062f - fix(openai): preserve websocket upgrade error messages (#29774) (Aiden Cline, 2026-05-28)
- 824ecf2f4 - chore: generate (opencode-agent[bot], 2026-05-28)
- b623d86f1 - Improve top models chart mobile axis (Adam, 2026-05-28)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/recall.ts` (+44, -40)
- `packages/opencode/src/tool/recall.txt` (+4, -2)
- `packages/opencode/src/tool/registry.ts` (+7, -7)
- `packages/opencode/src/tool/shell.ts` (+3, -3)
- `packages/opencode/src/tool/shell/prompt.ts` (+24, -12)
- `packages/opencode/src/tool/task.ts` (+50, -92)
- `packages/opencode/src/tool/task_status.ts` (+0, -186)
- `packages/opencode/src/tool/task_status.txt` (+0, -13)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+1, -1)
- `packages/opencode/test/tool/recall.test.ts` (+87, -16)
- `packages/opencode/test/tool/registry.test.ts` (+1, -13)
- `packages/opencode/test/tool/shell.test.ts` (+9, -4)
- `packages/opencode/test/tool/task.test.ts` (+5, -30)
- `packages/opencode/test/tool/task_status.test.ts` (+0, -124)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+1, -1)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+2, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/index.ts` (+1, -1)

#### Core (**/core/)
- `packages/core/package.json` (+9, -7)
- `packages/core/src/agent.ts` (+76, -116)
- `packages/core/src/catalog.ts` (+95, -132)
- `packages/core/src/config.ts` (+203, -0)
- `packages/core/src/config/agent.ts` (+25, -0)
- `packages/core/src/config/attachments.ts` (+15, -0)
- `packages/core/src/config/compaction.ts` (+16, -0)
- `packages/core/src/config/experimental.ts` (+18, -0)
- `packages/core/src/config/formatter.ts` (+12, -0)
- `packages/core/src/config/lsp.ts` (+18, -0)
- `packages/core/src/config/mcp.ts` (+36, -0)
- `packages/core/src/config/plugin.ts` (+13, -0)
- `packages/core/src/config/plugin/agent.ts` (+65, -0)
- `packages/core/src/config/plugin/provider.ts` (+95, -0)
- `packages/core/src/config/provider.ts` (+62, -0)
- `packages/core/src/config/reference.ts` (+17, -0)
- `packages/core/src/config/tool-output.ts` (+9, -0)
- `packages/core/src/config/watcher.ts` (+7, -0)
- `packages/core/src/event.ts` (+1, -1)
- `packages/core/src/filesystem.ts` (+4, -1)
- `packages/core/src/flag/flag.ts` (+6, -2)
- `packages/core/src/git.ts` (+114, -0)
- `packages/core/src/location-layer.ts` (+10, -5)
- `packages/core/src/location.ts` (+32, -3)
- `packages/core/src/model.ts` (+1, -1)
- `packages/core/src/plugin.ts` (+15, -31)
- `packages/core/src/plugin/account.ts` (+1, -1)
- `packages/core/src/plugin/agent.ts` (+211, -0)
- `packages/core/src/plugin/boot.ts` (+24, -4)
- `packages/core/src/plugin/env.ts` (+1, -1)
- `packages/core/src/plugin/models-dev.ts` (+2, -2)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+1, -1)
- `packages/core/src/plugin/provider/anthropic.ts` (+1, -1)
- `packages/core/src/plugin/provider/azure.ts` (+2, -2)
- `packages/core/src/plugin/provider/cerebras.ts` (+1, -1)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+1, -1)
- `packages/core/src/plugin/provider/github-copilot.ts` (+1, -1)
- `packages/core/src/plugin/provider/google-vertex.ts` (+5, -5)
- `packages/core/src/plugin/provider/kilo.ts` (+1, -1)
- `packages/core/src/plugin/provider/llmgateway.ts` (+1, -1)
- `packages/core/src/plugin/provider/nvidia.ts` (+1, -1)
- `packages/core/src/plugin/provider/openai.ts` (+1, -1)
- `packages/core/src/plugin/provider/opencode.ts` (+1, -1)
- `packages/core/src/plugin/provider/openrouter.ts` (+1, -1)
- `packages/core/src/plugin/provider/vercel.ts` (+1, -1)
- `packages/core/src/plugin/provider/zenmux.ts` (+1, -1)
- `packages/core/src/policy.ts` (+44, -0)
- `packages/core/src/project.ts` (+128, -0)
- `packages/core/src/schema.ts` (+6, -0)
- `packages/core/src/state.ts` (+63, -0)
- `packages/core/test/account.test.ts` (+9, -6)
- `packages/core/test/agent.test.ts` (+101, -0)
- `packages/core/test/catalog.test.ts` (+75, -18)
- `packages/core/test/config/agent.test.ts` (+186, -0)
- `packages/core/test/config/config.test.ts` (+460, -0)
- `packages/core/test/config/provider.test.ts` (+131, -0)
- `packages/core/test/event.test.ts` (+4, -2)
- `packages/core/test/fixture/location.ts` (+12, -0)
- `packages/core/test/kilocode/provider-isolation.test.ts` (+2, -2)
- `packages/core/test/location.test.ts` (+38, -0)
- `packages/core/test/model.test.ts` (+23, -0)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+2, -2)
- `packages/core/test/plugin/provider-anthropic.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-azure-cognitive-services.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-azure.test.ts` (+17, -11)
- `packages/core/test/plugin/provider-cerebras.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+15, -9)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+15, -10)
- `packages/core/test/plugin/provider-google-vertex-anthropic.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+20, -15)
- `packages/core/test/plugin/provider-helper.ts` (+9, -3)
- `packages/core/test/plugin/provider-kilo.test.ts` (+12, -12)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-nvidia.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-openai.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-opencode.test.ts` (+28, -20)
- `packages/core/test/plugin/provider-openrouter.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-vercel.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-zenmux.test.ts` (+8, -8)
- `packages/core/test/policy.test.ts` (+83, -0)
- `packages/core/test/project.test.ts` (+220, -0)

#### Other Changes
- `.changeset/attach-daemon-console.md` (+0, -5)
- `.changeset/run-compact-summarize.md` (+0, -5)
- `.changeset/search-local-transcripts.md` (+5, -0)
- `.dockerignore` (+12, -0)
- `.opencode-version` (+1, -1)
- `.opencode/skills/improve-codebase-architecture/DEEPENING.md` (+0, -37)
- `.opencode/skills/improve-codebase-architecture/INTERFACE-DESIGN.md` (+0, -44)
- `.opencode/skills/improve-codebase-architecture/LANGUAGE.md` (+0, -53)
- `.opencode/skills/improve-codebase-architecture/SKILL.md` (+0, -71)
- `bun.lock` (+72, -36)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -2)
- `packages/{opencode => core}/src/effect/service-use.ts` (+6, -1)
- `packages/effect-drizzle-sqlite/package.json` (+3, -2)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+3, -2)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/source-links.md` (+4, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+47, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/protocols/anthropic-messages.ts` (+3, -1)
- `packages/llm/src/protocols/openai-responses.ts` (+216, -21)
- `packages/llm/src/protocols/utils/lifecycle.ts` (+14, -6)
- `packages/llm/src/protocols/utils/openai-options.ts` (+29, -5)
- `packages/llm/src/providers/openai-options.ts` (+14, -2)
- `packages/llm/src/providers/openai.ts` (+1, -1)
- `packages/llm/src/route/client.ts` (+1, -1)
- `packages/llm/src/route/protocol.ts` (+2, -2)
- `packages/llm/test/continuation-scenarios.ts` (+1, -1)
- `packages/llm/test/fixtures/recordings/openai-responses/openai-responses-gpt-5-5-image-tool-result.json` (+3, -3)
- `packages/llm/test/fixtures/recordings/openai-responses/openai-responses-gpt-5-5-reasoning-continuation.json` (+4, -4)
- `packages/llm/test/fixtures/recordings/openai-responses/openai-responses-gpt-5-5-reasoning.json` (+3, -3)
- `packages/llm/test/provider/openai-responses.test.ts` (+253, -1)
- `packages/llm/test/recorded-scenarios.ts` (+1, -1)
- `packages/llm/test/tool-runtime.test.ts` (+75, -0)
- `packages/opencode/CHANGELOG.md` (+53, -0)
- `packages/opencode/migration/20260511173437_session-metadata/migration.sql` (+1, -0)
- `packages/opencode/migration/20260511173437_session-metadata/snapshot.json` (+1500, -0)
- `packages/opencode/package.json` (+4, -2)
- `packages/opencode/src/account/account.ts` (+1, -1)
- `packages/opencode/src/account/repo.ts` (+1, -1)
- `packages/opencode/src/acp/README.md` (+0, -174)
- `packages/opencode/src/acp/agent.ts` (+38, -1948)
- `packages/opencode/src/acp/config-option.ts` (+203, -0)
- `packages/opencode/src/acp/content.ts` (+250, -0)
- `packages/opencode/src/acp/directory.ts` (+209, -0)
- `packages/opencode/src/acp/error.ts` (+90, -0)
- `packages/opencode/src/acp/event.ts` (+319, -0)
- `packages/opencode/src/acp/permission.ts` (+145, -0)
- `packages/opencode/src/acp/profile.ts` (+42, -0)
- `packages/opencode/src/acp/runtime.ts` (+0, -22)
- `packages/opencode/src/acp/service.ts` (+1060, -0)
- `packages/opencode/src/acp/session.ts` (+217, -109)
- `packages/opencode/src/acp/tool.ts` (+290, -0)
- `packages/opencode/src/acp/types.ts` (+0, -24)
- `packages/opencode/src/acp/usage.ts` (+238, -0)
- `packages/opencode/src/cli/cmd/acp.ts` (+5, -2)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+225, -220)
- `packages/opencode/src/cli/cmd/tui/attach.ts` (+5, -2)
- `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx` (+33, -9)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+7, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+13, -4)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-create.tsx` (+24, -13)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-list.tsx` (+112, -0)
- `packages/opencode/src/cli/cmd/tui/component/error-component.tsx` (+31, -21)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+31, -8)
- `packages/opencode/src/cli/cmd/tui/config/tui-schema.ts` (+10, -0)
- `packages/opencode/src/cli/cmd/tui/context/exit.tsx` (+31, -51)
- `packages/opencode/src/cli/cmd/tui/context/thinking.ts` (+8, -7)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/dialog.tsx` (+335, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/index.tsx` (+32, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/preview-pane.tsx` (+382, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/util.tsx` (+70, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/diff-viewer.tsx` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+41, -23)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/routes/home.tsx` (+11, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+235, -96)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+8, -5)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+106, -86)
- `packages/opencode/src/cli/cmd/tui/util/editor.ts` (+2, -1)
- `packages/opencode/src/config/config.ts` (+31, -6)
- `packages/opencode/src/config/managed.ts` (+8, -1)
- `packages/opencode/src/config/provider.ts` (+13, -4)
- `packages/opencode/src/control-plane/workspace.ts` (+1, -1)
- `packages/opencode/src/effect/runtime-flags.ts` (+6, -3)
- `packages/opencode/src/env/index.ts` (+1, -1)
- `packages/opencode/src/file/index.ts` (+1, -1)
- `packages/opencode/src/file/ripgrep.ts` (+1, -1)
- `packages/opencode/src/format/index.ts` (+1, -1)
- `packages/opencode/src/installation/index.ts` (+1, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/thread.ts` (+2, -1)
- `packages/opencode/src/kilocode/indexing.ts` (+18, -9)
- `packages/opencode/src/kilocode/primary-worktree.ts` (+64, -0)
- `packages/opencode/src/kilocode/session/index.ts` (+27, -19)
- `packages/opencode/src/kilocode/session/prompt-queue.ts` (+4, -0)
- `packages/opencode/src/kilocode/session/recall-search.ts` (+418, -0)
- `packages/opencode/src/mcp/auth.ts` (+41, -16)
- `packages/opencode/src/mcp/index.ts` (+14, -4)
- `packages/opencode/src/plugin/digitalocean.ts` (+17, -37)
- `packages/opencode/src/plugin/index.ts` (+43, -18)
- `packages/opencode/src/plugin/openai/README.md` (+31, -0)
- `packages/opencode/src/plugin/{ => openai}/codex.ts` (+32, -31)
- `packages/opencode/src/plugin/openai/ws-pool.ts` (+272, -0)
- `packages/opencode/src/plugin/openai/ws.ts` (+334, -0)
- `packages/opencode/src/project/instance-store.ts` (+1, -1)
- `packages/opencode/src/project/project.ts` (+90, -120)
- `packages/opencode/src/provider/auth.ts` (+1, -1)
- `packages/opencode/src/provider/error.ts` (+16, -0)
- `packages/opencode/src/provider/provider.ts` (+25, -13)
- `packages/opencode/src/provider/transform.ts` (+28, -15)
- `packages/opencode/src/pty/index.ts` (+5, -1)
- `packages/opencode/src/pty/pty.node.ts` (+0, -1)
- `packages/opencode/src/server/routes/instance/httpapi/AGENTS.md` (+6, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/event.ts` (+6, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/pty.ts` (+19, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+2, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/location.ts` (+4, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/workspace.ts` (+11, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+22, -24)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+7, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/workspace.ts` (+19, -4)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+29, -5)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/instance-context.ts` (+1, -8)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/proxy.ts` (+2, -8)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts` (+13, -24)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+24, -22)
- `packages/opencode/src/session/compaction.ts` (+1, -1)
- `packages/opencode/src/session/llm.ts` (+1, -1)
- `packages/opencode/src/session/llm/native-runtime.ts` (+8, -0)
- `packages/opencode/src/session/message-v2.ts` (+23, -0)
- `packages/opencode/src/session/projectors.ts` (+1, -0)
- `packages/opencode/src/session/prompt.ts` (+21, -11)
- `packages/opencode/src/session/session.sql.ts` (+1, -0)
- `packages/opencode/src/session/session.ts` (+24, -1)
- `packages/opencode/src/share/share-next.ts` (+1, -1)
- `packages/opencode/src/skill/index.ts` (+11, -7)
- `packages/opencode/src/sync/index.ts` (+1, -1)
- `packages/opencode/src/util/proxy-env.ts` (+72, -0)
- `packages/opencode/src/v2/session.ts` (+1, -1)
- `packages/opencode/src/worktree/index.ts` (+1, -1)
- `packages/opencode/test/acp/agent-interface.test.ts` (+0, -54)
- `packages/opencode/test/acp/config-option.test.ts` (+229, -0)
- `packages/opencode/test/acp/content.test.ts` (+201, -0)
- `packages/opencode/test/acp/directory.test.ts` (+185, -0)
- `packages/opencode/test/acp/error.test.ts` (+67, -0)
- `packages/opencode/test/acp/event-subscription.test.ts` (+0, -986)
- `packages/opencode/test/acp/event.test.ts` (+657, -0)
- `packages/opencode/test/acp/permission.test.ts` (+237, -0)
- `packages/opencode/test/acp/service-session.test.ts` (+1135, -0)
- `packages/opencode/test/acp/session.test.ts` (+199, -0)
- `packages/opencode/test/acp/tool.test.ts` (+169, -0)
- `packages/opencode/test/acp/usage.test.ts` (+314, -0)
- `packages/opencode/test/cli/acp/acp-process.test.ts` (+0, -70)
- `packages/opencode/test/cli/acp/acp-test-client.ts` (+97, -0)
- `packages/opencode/test/cli/acp/config-options.test.ts` (+103, -0)
- `packages/opencode/test/cli/acp/helpers.ts` (+96, -0)
- `packages/opencode/test/cli/acp/initialize-auth.test.ts` (+62, -0)
- `packages/opencode/test/cli/acp/lifecycle.test.ts` (+118, -0)
- `packages/opencode/test/cli/acp/prompt-content.test.ts` (+97, -0)
- `packages/opencode/test/cli/acp/skills.test.ts` (+38, -0)
- `packages/opencode/test/cli/cmd/tui/model-options.test.ts` (+30, -0)
- `packages/opencode/test/cli/cmd/tui/sync-fixture.tsx` (+5, -94)
- `packages/opencode/test/cli/run/entry.body.test.ts` (+5, -9)
- `packages/opencode/test/cli/run/scrollback.surface.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+54, -0)
- `packages/opencode/test/cli/tui/app-lifecycle.test.ts` (+261, -0)
- `packages/opencode/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+119, -0)
- `packages/opencode/test/cli/tui/keymap.test.tsx` (+83, -1)
- `packages/opencode/test/cli/tui/thinking.test.ts` (+36, -0)
- `packages/opencode/test/cli/tui/use-event.test.tsx` (+6, -29)
- `packages/opencode/test/config/config.test.ts` (+467, -708)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+29, -3)
- `packages/opencode/test/fixture/tui-sdk.ts` (+96, -0)
- `packages/opencode/test/fixtures/recordings/kilocode/session/native-openai-oauth-tool-loop.json` (+2, -2)
- `packages/opencode/test/fixtures/recordings/kilocode/session/native-zen-tool-loop.json` (+2, -2)
- `packages/opencode/test/fixtures/recordings/session/native-openai-oauth-tool-loop.json` (+5, -5)
- `packages/opencode/test/fixtures/recordings/session/native-zen-tool-loop.json` (+5, -5)
- `packages/opencode/test/kilocode/acp/agent-interface.test.ts` (+25, -0)
- `packages/opencode/test/kilocode/codex-refresh-user-agent.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/config-gitignore.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/config/config.test.ts` (+76, -0)
- `packages/opencode/test/kilocode/config/indexing-default-plugin.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/indexing-worktree.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/oauth-branding.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/primary-worktree.test.ts` (+147, -0)
- `packages/opencode/test/kilocode/project-config-update.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/recall-search.test.ts` (+312, -0)
- `packages/opencode/test/kilocode/session-list.test.ts` (+34, -0)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+10, -6)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/worktree-project-skills.test.ts` (+117, -28)
- `packages/opencode/test/mcp/auth.test.ts` (+78, -0)
- `packages/opencode/test/plugin/codex.test.ts` (+19, -1)
- `packages/opencode/test/plugin/openai-rollout.test.ts` (+17, -0)
- `packages/opencode/test/plugin/openai-ws.test.ts` (+711, -0)
- `packages/opencode/test/plugin/trigger.test.ts` (+2, -0)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+2, -0)
- `packages/opencode/test/project/project.test.ts` (+113, -11)
- `packages/opencode/test/project/worktree.test.ts` (+16, -0)
- `packages/opencode/test/provider/header-timeout.test.ts` (+232, -0)
- `packages/opencode/test/provider/provider.test.ts` (+2, -1)
- `packages/opencode/test/provider/transform.test.ts` (+96, -0)
- `packages/opencode/test/pty/info-schema.test.ts` (+33, -0)
- `packages/opencode/test/server/AGENTS.md` (+2, -2)
- `packages/opencode/test/server/experimental-session-list.test.ts` (+8, -0)
- `packages/opencode/test/server/httpapi-global.test.ts` (+63, -0)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+68, -30)
- `packages/opencode/test/server/{httpapi-raw-route-auth.test.ts => httpapi-instance-route-auth.test.ts}` (+5, -4)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+4, -0)
- `packages/opencode/test/server/httpapi-promptasync-context.test.ts` (+65, -24)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+8, -0)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+6, -0)
- `packages/opencode/test/server/httpapi-session.test.ts` (+69, -1)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+14, -0)
- `packages/opencode/test/server/httpapi-workspace-routing.test.ts` (+73, -56)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+24, -0)
- `packages/opencode/test/server/project-init-git.test.ts` (+1, -1)
- `packages/opencode/test/server/session-actions.test.ts` (+79, -0)
- `packages/opencode/test/server/session-list.test.ts` (+16, -0)
- `packages/opencode/test/server/workspace-proxy.test.ts` (+16, -0)
- `packages/opencode/test/server/worktree-endpoint-repro.test.ts` (+22, -0)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+19, -2)
- `packages/opencode/test/session/llm-native.test.ts` (+40, -1)
- `packages/opencode/test/session/llm.test.ts` (+1, -0)
- `packages/opencode/test/session/prompt.test.ts` (+29, -0)
- `packages/opencode/test/session/retry.test.ts` (+20, -0)
- `packages/opencode/test/session/schema-decoding.test.ts` (+2, -0)
- `packages/opencode/test/session/session.test.ts` (+31, -0)
- `packages/opencode/test/skill/skill.test.ts` (+2, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/plugin/src/index.ts` (+1, -0)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+12, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+60, -13)
- `packages/storybook/.storybook/mocks/app/context/global-sync.ts` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/apply-patch-file.test.ts` (+0, -1)
- `packages/ui/src/components/basic-tool.tsx` (+12, -4)
- `packages/ui/src/components/file.tsx` (+76, -13)
- `packages/ui/src/components/message-part.tsx` (+51, -11)
- `packages/ui/src/components/session-diff.test.ts` (+50, -5)
- `packages/ui/src/components/session-diff.ts` (+50, -98)
- `packages/ui/src/components/timeline-playground.stories.tsx` (+1, -1)
- `packages/ui/src/components/tool-error-card.tsx` (+18, -8)
- `packages/ui/src/v2/components/accordion-v2.css` (+1, -1)
- `packages/ui/src/v2/components/accordion-v2.stories.tsx` (+1, -1)
- `packages/ui/src/v2/components/avatar-v2.css` (+1, -1)
- `packages/ui/src/v2/components/badge-v2.css` (+1, -1)
- `packages/ui/src/v2/components/basic-tool-v2.css` (+1, -1)
- `packages/ui/src/v2/components/button-v2.css` (+1, -1)
- `packages/ui/src/v2/components/checkbox-v2.css` (+3, -3)
- `packages/ui/src/v2/components/checkbox-v2.stories.tsx` (+1, -1)
- `packages/ui/src/v2/components/dialog-v2.css` (+2, -2)
- `packages/ui/src/v2/components/diff-changes-v2.css` (+1, -1)
- `packages/ui/src/v2/components/field-v2.css` (+2, -2)
- `packages/ui/src/v2/components/icon-button-v2.css` (+0, -1)
- `packages/ui/src/v2/components/icon.tsx` (+20, -0)
- `packages/ui/src/v2/components/inline-input-v2.css` (+2, -2)
- `packages/ui/src/v2/components/inline-input-v2.stories.tsx` (+1, -1)
- `packages/ui/src/v2/components/keybind-v2.css` (+2, -2)
- `packages/ui/src/v2/components/line-comment-v2.css` (+1, -1)
- `packages/ui/src/v2/components/menu-v2.css` (+9, -9)
- `packages/ui/src/v2/components/menu-v2.stories.tsx` (+1, -1)
- `packages/ui/src/v2/components/radio-v2.css` (+5, -5)
- `packages/ui/src/v2/components/radio-v2.stories.tsx` (+1, -1)
- `packages/ui/src/v2/components/segmented-control-v2.css` (+1, -1)
- `packages/ui/src/v2/components/segmented-control-v2.stories.tsx` (+2, -2)
- `packages/ui/src/v2/components/select-v2.css` (+1, -1)
- `packages/ui/src/v2/components/switch-v2.css` (+2, -2)
- `packages/ui/src/v2/components/tabs-v2.css` (+1, -1)
- `packages/ui/src/v2/components/text-input-v2.css` (+1, -1)
- `packages/ui/src/v2/components/text-input-v2.stories.tsx` (+1, -1)
- `packages/ui/src/v2/components/textarea-v2.css` (+1, -1)
- `packages/ui/src/v2/components/textarea-v2.stories.tsx` (+1, -1)
- `packages/ui/src/v2/components/tool-error-card-v2.css` (+1, -1)
- `packages/ui/src/v2/styles/theme.css` (+3, -0)
- `patches/@ai-sdk%2Fxai@3.0.82.patch` (+99, -0)
- `patches/gcp-metadata@8.1.2.patch` (+14, -0)
- `script/upstream/package.json` (+1, -1)
- `script/upstream/transforms/skip-files.test.ts` (+10, -0)
- `script/upstream/utils/config.ts` (+2, -0)
- `specs/v2/catalog-config-plugin-lifecycle.md` (+322, -0)
- `specs/v2/config.md` (+395, -0)
- `specs/v2/provider-policy.md` (+291, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 3c8c63fdb..7f6af6685 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.50",
+  "version": "7.3.52",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -22,7 +22,8 @@
     "@types/bun": "catalog:",
     "@types/cross-spawn": "catalog:",
     "@types/npm-package-arg": "6.1.4",
-    "@types/npmcli__arborist": "6.3.3"
+    "@types/npmcli__arborist": "6.3.3",
+    "@types/semver": "catalog:"
   },
   "dependencies": {
     "@kilocode/kilo-gateway": "workspace:*",
@@ -45,15 +46,15 @@
     "xdg-basedir": "5.1.0",
     "zod": "catalog:",
     "@ai-sdk/alibaba": "1.0.17",
-    "@ai-sdk/amazon-bedrock": "4.0.96",
+    "@ai-sdk/amazon-bedrock": "4.0.107",
     "@ai-sdk/anthropic": "3.0.71",
     "@ai-sdk/azure": "3.0.49",
     "@ai-sdk/cerebras": "2.0.54",
     "@ai-sdk/cohere": "3.0.27",
     "@ai-sdk/deepinfra": "2.0.41",
     "@ai-sdk/gateway": "3.0.104",
-    "@ai-sdk/google": "3.0.63",
-    "@ai-sdk/google-vertex": "4.0.112",
+    "@ai-sdk/google": "3.0.73",
+    "@ai-sdk/google-vertex": "4.0.128",
     "@ai-sdk/groq": "3.0.31",
     "@ai-sdk/mistral": "3.0.27",
     "@ai-sdk/openai": "3.0.53",
@@ -67,10 +68,11 @@
     "@aws-sdk/credential-providers": "3.993.0",
     "@openrouter/ai-sdk-provider": "2.9.0",
     "ai-gateway-provider": "3.1.2",
-    "gitlab-ai-provider": "6.7.0",
+    "gitlab-ai-provider": "6.8.0",
     "google-auth-library": "10.5.0",
     "immer": "11.1.4",
-    "venice-ai-sdk-provider": "2.0.1"
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index 7f4456c59..ec7dfa2ad 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -1,147 +1,107 @@
 export * as AgentV2 from "./agent"
 
-import { Context, Effect, HashMap, Layer, Option, Order, pipe, Schema, Array } from "effect"
-import { produce, type Draft } from "immer"
+import { Array, Context, Effect, Layer, Schema, Scope } from "effect"
+import { castDraft, enableMapSet, type Draft } from "immer"
 import { ModelV2 } from "./model"
 import { PermissionV2 } from "./permission"
-import { PluginV2 } from "./plugin"
 import { ProviderV2 } from "./provider"
+import { PositiveInt } from "./schema"
+import { State } from "./state"
 
 export const ID = Schema.String.pipe(Schema.brand("AgentV2.ID"))
 export type ID = typeof ID.Type
 
-export const Mode = Schema.Literals(["subagent", "primary", "all"]).annotate({ identifier: "AgentV2.Mode" })
-export type Mode = typeof Mode.Type
+export const Color = Schema.Union([
+  Schema.String.check(Schema.isPattern(/^#[0-9a-fA-F]{6}$/)),
+  Schema.Literals(["primary", "secondary", "accent", "success", "warning", "error", "info"]),
+])
 
-export const Info = Schema.Struct({
-  name: ID,
-  description: Schema.optional(Schema.String),
-  mode: Mode,
-  hidden: Schema.Boolean.pipe(Schema.optional),
-  color: Schema.String.pipe(Schema.optional),
-  permission: PermissionV2.Ruleset,
+export class Info extends Schema.Class<Info>("AgentV2.Info")({
+  id: ID,
   model: ModelV2.Ref.pipe(Schema.optional),
+  options: ProviderV2.Options,
   system: Schema.String.pipe(Schema.optional),
-  options: ProviderV2.Options.pipe(Schema.optional),
-  steps: Schema.Int.pipe(Schema.optional),
-}).annotate({ identifier: "AgentV2.Info" })
-export type Info = typeof Info.Type
-
-export class NotFoundError extends Schema.TaggedErrorClass<NotFoundError>()("AgentV2.NotFound", {
-  agent: ID,
-}) {}
+  description: Schema.String.pipe(Schema.optional),
+  mode: Schema.Literals(["subagent", "primary", "all"]),
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index 2bbd7bc49..a12de5d47 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -1,18 +1,22 @@
 export * as Catalog from "./catalog"
 
-import { Context, Effect, HashMap, Layer, Option, Order, pipe, Schema, Array, Scope, Stream } from "effect"
-import { produce, type Draft } from "immer"
+import { Context, Effect, Layer, Option, Order, pipe, Schema, Array, Scope, Stream } from "effect"
+import { castDraft, enableMapSet, type Draft } from "immer"
 import { ModelV2 } from "./model"
 import { PluginV2 } from "./plugin"
 import { ProviderV2 } from "./provider"
 import { Location } from "./location"
 import { EventV2 } from "./event"
+import { Policy } from "./policy"
+import { State } from "./state"
 
 export type ProviderRecord = {
   provider: ProviderV2.Info
   models: Map<ModelV2.ID, ModelV2.Info>
 }
 
+export type DefaultModel = { providerID: ProviderV2.ID; modelID: ModelV2.ID }
+
 export class ProviderNotFoundError extends Schema.TaggedErrorClass<ProviderNotFoundError>()(
   "CatalogV2.ProviderNotFound",
   {
@@ -25,6 +29,8 @@ export class ModelNotFoundError extends Schema.TaggedErrorClass<ModelNotFoundErr
   modelID: ModelV2.ID,
 }) {}
 
+export const PolicyActions = Schema.Literals(["provider.use"])
+
 export const Event = {
   ModelUpdated: EventV2.define({
     type: "catalog.model.updated",
@@ -34,24 +40,31 @@ export const Event = {
   }),
 }
 
-export type Context = {
-  data: readonly ProviderRecord[]
-  updateProvider: (providerID: ProviderV2.ID, fn: (provider: Draft<ProviderV2.Info>) => void) => void
-  updateModel: (providerID: ProviderV2.ID, modelID: ModelV2.ID, fn: (model: Draft<ModelV2.Info>) => void) => void
+type Data = {
+  providers: Map<ProviderV2.ID, ProviderRecord>
+  defaultModel?: DefaultModel
+}
```

#### packages/core/src/config.ts
```diff
diff --git a/packages/core/src/config.ts b/packages/core/src/config.ts
new file mode 100644
index 000000000..c9e139673
--- /dev/null
+++ b/packages/core/src/config.ts
@@ -0,0 +1,203 @@
+export * as Config from "./config"
+
+import path from "path"
+import { type ParseError, parse } from "jsonc-parser"
+import { Context, Effect, Layer, Option, Schema } from "effect"
+import { AppFileSystem } from "./filesystem"
+import { Global } from "./global"
+import { Location } from "./location"
+import { PermissionV2 } from "./permission"
+import { Policy } from "./policy"
+import { AbsolutePath } from "./schema"
+import { ConfigAgent } from "./config/agent"
+import { ConfigAttachments } from "./config/attachments"
+import { ConfigCompaction } from "./config/compaction"
+import { ConfigExperimental } from "./config/experimental"
+import { ConfigFormatter } from "./config/formatter"
+import { ConfigLSP } from "./config/lsp"
+import { ConfigMCP } from "./config/mcp"
+import { ConfigPlugin } from "./config/plugin"
+import { ConfigProvider } from "./config/provider"
+import { ConfigReference } from "./config/reference"
+import { ConfigToolOutput } from "./config/tool-output"
+import { ConfigWatcher } from "./config/watcher"
+
+export class Info extends Schema.Class<Info>("Config.Info")({
+  $schema: Schema.optional(Schema.String).annotate({
+    description: "JSON schema reference for configuration validation",
+  }),
+  shell: Schema.String.pipe(Schema.optional).annotate({
+    description: "Default shell to use for terminal and shell tool execution",
+  }),
+  model: Schema.String.pipe(Schema.optional).annotate({
+    description: "Default model to use when no session or agent model is selected",
+  }),
+  autoupdate: Schema.Union([Schema.Boolean, Schema.Literal("notify")])
+    .pipe(Schema.optional)
+    .annotate({
+      description: "Automatically update or notify when a new version is available",
+    }),
+  share: Schema.Literals(["manual", "auto", "disabled"]).pipe(Schema.optional).annotate({
+    description: "Control whether sessions may be shared manually, automatically, or not at all",
+  }),
+  enterprise: Schema.Struct({
+    url: Schema.String.pipe(Schema.optional),
```

#### packages/core/src/config/agent.ts
```diff
diff --git a/packages/core/src/config/agent.ts b/packages/core/src/config/agent.ts
new file mode 100644
index 000000000..40d2bc94b
--- /dev/null
+++ b/packages/core/src/config/agent.ts
@@ -0,0 +1,25 @@
+export * as ConfigAgent from "./agent"
+
+import { Schema } from "effect"
+import { PermissionV2 } from "../permission"
+import { ConfigProvider } from "./provider"
+import { PositiveInt } from "../schema"
+
+export const Color = Schema.Union([
+  Schema.String.check(Schema.isPattern(/^#[0-9a-fA-F]{6}$/)),
+  Schema.Literals(["primary", "secondary", "accent", "success", "warning", "error", "info"]),
+])
+
+export class Info extends Schema.Class<Info>("ConfigV2.Agent")({
+  model: Schema.String.pipe(Schema.optional),
+  variant: Schema.String.pipe(Schema.optional),
+  options: ConfigProvider.Options.pipe(Schema.optional),
+  system: Schema.String.pipe(Schema.optional),
+  description: Schema.String.pipe(Schema.optional),
+  mode: Schema.Literals(["subagent", "primary", "all"]).pipe(Schema.optional),
+  hidden: Schema.Boolean.pipe(Schema.optional),
+  color: Color.pipe(Schema.optional),
+  steps: PositiveInt.pipe(Schema.optional),
+  disabled: Schema.Boolean.pipe(Schema.optional),
+  permissions: PermissionV2.Ruleset.pipe(Schema.optional),
+}) {}
```


*... and more files (showing first 5)*

## opencode Changes (d4d841b..4ecc3ac)

### Commits

- 4ecc3ac - chore: generate (opencode-agent[bot], 2026-06-22)
- c7efbe6 - run: inline files for attached servers (#33317) (Simon Klee, 2026-06-22)
- cd292a4 - chore: generate (opencode-agent[bot], 2026-06-22)
- 2bb4311 - refactor(core): simplify integration test fixtures (#33292) (Dax, 2026-06-22)
- cdc6d01 - chore: generate (opencode-agent[bot], 2026-06-22)
- 35b3fc8 - feat(core): expose session switching endpoints (Dax Raad, 2026-06-21)
- 9dadc24 - fix(tui): render skill load errors inline (#33298) (Aiden Cline, 2026-06-21)
- 06dae38 - chore: generate (opencode-agent[bot], 2026-06-21)
- 7d204b5 - feat(stats): show model unique users (Adam, 2026-06-21)
- 49593c1 - fix(core): settle interrupted assistant steps (#33266) (Kit Langton, 2026-06-21)
- ff837fe - fix(core): handle read file failures (#33260) (Kit Langton, 2026-06-21)
- 4c6750d - fix(stats): unblock stats sync (Adam, 2026-06-21)
- 69f1ec2 - fix(core): bound web tool failures (#33259) (Kit Langton, 2026-06-21)
- 823d327 - fix(core): handle missing read paths (#33255) (Kit Langton, 2026-06-21)
- 82d9cab - chore: generate (opencode-agent[bot], 2026-06-21)
- fb43c15 - refactor(core): simplify event model (#33238) (Dax, 2026-06-21)
- ca006a2 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-21)
- 8396395 - fix(stats): update defect schemas (Dax Raad, 2026-06-21)
- 1b8bab3 - fix(ci): avoid Playwright Chromium install hang (Dax Raad, 2026-06-21)
- 02687b6 - chore: generate (opencode-agent[bot], 2026-06-21)
- c780d7c - feat(plugin): add v2 effect host (#33111) (Dax, 2026-06-21)
- 7a9337d - chore: generate (opencode-agent[bot], 2026-06-21)
- f96e6aa - fix(stats): bypass worker runtime crash (Adam, 2026-06-21)
- c6f719e - fix(stats): restore worker data exports (Adam, 2026-06-21)
- 1a111be - fix(stats): run worker effects directly (Adam, 2026-06-21)
- a0aee82 - fix(stats): inline worker runtime import (Adam, 2026-06-21)
- c0dc6e5 - fix(stats): restore worker runtime (Adam, 2026-06-21)
- 418a9e4 - fix(stats): restore model page rendering (Adam, 2026-06-21)
- bd8ce5e - chore(stats): remove deploy migrations (Adam, 2026-06-21)
- a97c6de - fix(stats): support planetscale cli variants (Adam, 2026-06-21)
- 24ea4dd - chore: generate (opencode-agent[bot], 2026-06-21)
- ffcb754 - fix(stats): run production migration safely (Adam, 2026-06-21)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/application-tools.ts` (+5, -9)
- `packages/core/src/tool/http-body.ts` (+30, -0)
- `packages/core/src/tool/read-filesystem.ts` (+118, -58)
- `packages/core/src/tool/read.ts` (+3, -3)
- `packages/core/src/tool/webfetch.ts` (+13, -21)
- `packages/core/src/tool/websearch.ts` (+7, -4)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/core/src/permission/schema.ts` (+1, -1)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/bunfig.toml` (+2, -0)
- `packages/core/package.json` (+1, -0)
- `packages/core/src/agent.ts` (+9, -14)
- `packages/core/src/catalog.ts` (+54, -101)
- `packages/core/src/command.ts` (+9, -12)
- `packages/core/src/config/plugin/agent.ts` (+59, -59)
- `packages/core/src/config/plugin/command.ts` (+32, -33)
- `packages/core/src/config/plugin/provider.ts` (+102, -101)
- `packages/core/src/config/plugin/reference.ts` (+38, -43)
- `packages/core/src/config/plugin/skill.ts` (+33, -36)
- `packages/core/src/credential.ts` (+14, -14)
- `packages/core/src/credential/sql.ts` (+1, -1)
- `packages/core/src/event.ts` (+130, -177)
- `packages/core/src/filesystem.ts` (+1, -1)
- `packages/core/src/filesystem/search.ts` (+1, -1)
- `packages/core/src/integration.ts` (+77, -89)
- `packages/core/src/model-request.ts` (+1, -1)
- `packages/core/src/model.ts` (+11, -8)
- `packages/core/src/npm.ts` (+23, -27)
- `packages/core/src/plugin.ts` (+43, -20)
- `packages/core/src/plugin/agent.ts` (+13, -16)
- `packages/core/src/plugin/boot.ts` (+56, -54)
- `packages/core/src/plugin/command.ts` (+9, -15)
- `packages/core/src/plugin/host.ts` (+236, -0)
- `packages/core/src/plugin/models-dev.ts` (+19, -26)
- `packages/core/src/plugin/provider/alibaba.ts` (+8, -7)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+15, -9)
- `packages/core/src/plugin/provider/anthropic.ts` (+11, -8)
- `packages/core/src/plugin/provider/azure.ts` (+25, -16)
- `packages/core/src/plugin/provider/cerebras.ts` (+13, -10)
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+8, -7)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+15, -9)
- `packages/core/src/plugin/provider/cohere.ts` (+8, -7)
- `packages/core/src/plugin/provider/deepinfra.ts` (+8, -7)
- `packages/core/src/plugin/provider/dynamic.ts` (+10, -11)
- `packages/core/src/plugin/provider/gateway.ts` (+8, -7)
- `packages/core/src/plugin/provider/github-copilot.ts` (+23, -17)
- `packages/core/src/plugin/provider/gitlab.ts` (+12, -8)
- `packages/core/src/plugin/provider/google-vertex.ts` (+29, -17)
- `packages/core/src/plugin/provider/google.ts` (+8, -7)
- `packages/core/src/plugin/provider/groq.ts` (+8, -7)
- `packages/core/src/plugin/provider/kilo.ts` (+7, -7)
- `packages/core/src/plugin/provider/llmgateway.ts` (+8, -10)
- `packages/core/src/plugin/provider/mistral.ts` (+8, -7)
- `packages/core/src/plugin/provider/nvidia.ts` (+7, -7)
- `packages/core/src/plugin/provider/openai-compatible.ts` (+8, -7)
- `packages/core/src/plugin/provider/openai.ts` (+25, -19)
- `packages/core/src/plugin/provider/opencode.ts` (+8, -10)
- `packages/core/src/plugin/provider/openrouter.ts` (+11, -8)
- `packages/core/src/plugin/provider/perplexity.ts` (+8, -7)
- `packages/core/src/plugin/provider/sap-ai-core.ts` (+14, -12)
- `packages/core/src/plugin/provider/snowflake-cortex.ts` (+8, -7)
- `packages/core/src/plugin/provider/togetherai.ts` (+8, -7)
- `packages/core/src/plugin/provider/venice.ts` (+8, -7)
- `packages/core/src/plugin/provider/vercel.ts` (+11, -8)
- `packages/core/src/plugin/provider/xai.ts` (+12, -8)
- `packages/core/src/plugin/provider/zenmux.ts` (+7, -7)
- `packages/core/src/plugin/skill.ts` (+6, -9)
- `packages/core/src/provider.ts` (+6, -1)
- `packages/core/src/public/session.ts` (+2, -5)
- `packages/core/src/reference.ts` (+10, -11)
- `packages/core/src/session.ts` (+15, -16)
- `packages/core/src/session/event.ts` (+3, -3)
- `packages/core/src/session/input.ts` (+2, -40)
- `packages/core/src/session/projector.ts` (+18, -27)
- `packages/core/src/session/runner/llm.ts` (+3, -8)
- `packages/core/src/session/runner/model.ts` (+7, -9)
- `packages/core/src/session/runner/publish-llm-event.ts` (+21, -8)
- `packages/core/src/session/runner/to-llm-message.ts` (+10, -1)
- `packages/core/src/skill.ts` (+8, -9)
- `packages/core/src/state.ts` (+88, -72)
- `packages/core/src/v1/session.ts` (+1, -1)
- `packages/core/test/agent.test.ts` (+19, -24)
- `packages/core/test/catalog.test.ts` (+55, -174)
- `packages/core/test/command.test.ts` (+1, -2)
- `packages/core/test/config/agent.test.ts` (+7, -13)
- `packages/core/test/config/command.test.ts` (+2, -2)
- `packages/core/test/config/provider.test.ts` (+49, -36)
- `packages/core/test/config/skill.test.ts` (+25, -17)
- `packages/core/test/credential.test.ts` (+24, -38)
- `packages/core/test/event.test.ts` (+38, -91)
- `packages/core/test/filesystem/filesystem.test.ts` (+1, -1)
- `packages/core/test/filesystem/search.test.ts` (+2, -2)
- `packages/core/test/fixture/location.ts` (+14, -0)
- `packages/core/test/integration.test.ts` (+76, -138)
- `packages/core/test/location-layer.test.ts` (+54, -5)
- `packages/core/test/move-session.test.ts` (+18, -13)
- `packages/core/test/npm.test.ts` (+1, -1)
- `packages/core/test/permission.test.ts` (+12, -18)
- `packages/core/test/plugin.test.ts` (+10, -7)
- `packages/core/test/plugin/command.test.ts` (+6, -6)
- `packages/core/test/plugin/fixture.ts` (+48, -0)
- `packages/core/test/plugin/host.ts` (+319, -0)
- `packages/core/test/plugin/models-dev.test.ts` (+11, -7)
- `packages/core/test/plugin/provider-alibaba.test.ts` (+40, -9)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+181, -48)
- `packages/core/test/plugin/provider-anthropic.test.ts` (+42, -41)
- `packages/core/test/plugin/provider-azure-cognitive-services.test.ts` (+106, -23)
- `packages/core/test/plugin/provider-azure.test.ts` (+136, -95)
- `packages/core/test/plugin/provider-cerebras.test.ts` (+53, -17)
- `packages/core/test/plugin/provider-cloudflare-ai-gateway.test.ts` (+96, -23)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+99, -89)
- `packages/core/test/plugin/provider-cohere.test.ts` (+56, -8)
- `packages/core/test/plugin/provider-deepinfra.test.ts` (+76, -25)
- `packages/core/test/plugin/provider-dynamic.test.ts` (+63, -34)
- `packages/core/test/plugin/provider-gateway.test.ts` (+47, -8)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+120, -30)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+81, -114)
- `packages/core/test/plugin/provider-google-vertex-anthropic.test.ts` (+108, -33)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+106, -53)
- `packages/core/test/plugin/provider-google.test.ts` (+48, -26)
- `packages/core/test/plugin/provider-groq.test.ts` (+66, -32)
- `packages/core/test/plugin/provider-helper.ts` (+0, -159)
- `packages/core/test/plugin/provider-kilo.test.ts` (+50, -51)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+39, -40)
- `packages/core/test/plugin/provider-mistral.test.ts` (+64, -28)
- `packages/core/test/plugin/provider-nvidia.test.ts` (+44, -46)
- `packages/core/test/plugin/provider-openai-compatible.test.ts` (+45, -18)
- `packages/core/test/plugin/provider-openai.test.ts` (+79, -29)
- `packages/core/test/plugin/provider-opencode.test.ts` (+158, -103)
- `packages/core/test/plugin/provider-openrouter.test.ts` (+47, -51)
- `packages/core/test/plugin/provider-perplexity.test.ts` (+63, -35)
- `packages/core/test/plugin/provider-sap-ai-core.test.ts` (+58, -17)
- `packages/core/test/plugin/provider-snowflake-cortex.test.ts` (+72, -30)
- `packages/core/test/plugin/provider-togetherai.test.ts` (+68, -22)
- `packages/core/test/plugin/provider-venice.test.ts` (+64, -21)
- `packages/core/test/plugin/provider-vercel.test.ts` (+38, -31)
- `packages/core/test/plugin/provider-xai.test.ts` (+60, -37)
- `packages/core/test/plugin/provider-zenmux.test.ts` (+51, -57)
- `packages/core/test/plugin/skill.test.ts` (+2, -1)
- `packages/core/test/preload.ts` (+1, -0)
- `packages/core/test/project-copy.test.ts` (+6, -7)
- `packages/core/test/project-directories.test.ts` (+1, -4)
- `packages/core/test/project.test.ts` (+1, -14)
- `packages/core/test/question.test.ts` (+2, -4)
- `packages/core/test/reference.test.ts` (+3, -6)
- `packages/core/test/session-create.test.ts` (+43, -12)
- `packages/core/test/session-projector.test.ts` (+5, -136)
- `packages/core/test/session-prompt.test.ts` (+24, -69)
- `packages/core/test/session-runner-message.test.ts` (+33, -0)
- `packages/core/test/session-runner-model.test.ts` (+2, -2)
- `packages/core/test/session-runner-recorded.test.ts` (+10, -14)
- `packages/core/test/session-runner-tool-events.test.ts` (+4, -4)
- `packages/core/test/session-runner.test.ts` (+17, -47)
- `packages/core/test/session-todo.test.ts` (+1, -4)
- `packages/core/test/session-tool-progress.test.ts` (+1, -4)
- `packages/core/test/skill.test.ts` (+3, -5)
- `packages/core/test/state.test.ts` (+84, -3)
- `packages/core/test/tool-edit.test.ts` (+1, -1)
- `packages/core/test/tool-read-filesystem.test.ts` (+117, -0)
- `packages/core/test/tool-read.test.ts` (+78, -17)
- `packages/core/test/tool-skill.test.ts` (+3, -1)
- `packages/core/test/tool-todowrite.test.ts` (+8, -5)
- `packages/core/test/tool-webfetch.test.ts` (+19, -0)
- `packages/core/test/tool-websearch.test.ts` (+26, -3)
- `packages/core/test/tool-write.test.ts` (+1, -1)
- `packages/stats/core/package.json` (+1, -0)
- `packages/stats/core/src/athena.ts` (+35, -23)
- `packages/stats/core/src/database.ts` (+25, -10)
- `packages/stats/core/src/domain/home.ts` (+140, -44)
- `packages/stats/core/src/domain/inference.ts` (+5, -0)
- `packages/stats/core/src/ensure-unique-users.ts` (+42, -7)

#### Other Changes
- `.github/workflows/deploy.yml` (+0, -14)
- `.github/workflows/test.yml` (+2, -1)
- `bun.lock` (+2, -0)
- `nix/hashes.json` (+4, -4)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+3, -8)
- `packages/opencode/src/cli/cmd/run.ts` (+43, -2)
- `packages/opencode/src/event-v2-bridge.ts` (+5, -5)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+2, -2)
- `packages/opencode/test/cli/run/run-process.test.ts` (+258, -11)
- `packages/opencode/test/lib/cli-process.ts` (+61, -3)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+18, -0)
- `packages/plugin/package.json` (+3, -1)
- `packages/plugin/src/v2/effect/PLAN.md` (+515, -0)
- `packages/plugin/src/v2/effect/README.md` (+585, -0)
- `packages/plugin/src/v2/effect/agent.ts` (+17, -0)
- `packages/plugin/src/v2/effect/aisdk.ts` (+21, -0)
- `packages/plugin/src/v2/effect/catalog.ts` (+41, -0)
- `packages/plugin/src/v2/effect/command.ts` (+15, -0)
- `packages/plugin/src/v2/effect/event.ts` (+10, -0)
- `packages/plugin/src/v2/effect/filesystem.ts` (+17, -0)
- `packages/plugin/src/v2/effect/host.ts` (+27, -0)
- `packages/plugin/src/v2/effect/index.ts` (+17, -0)
- `packages/plugin/src/v2/effect/integration.ts` (+36, -0)
- `packages/plugin/src/v2/effect/location.ts` (+6, -0)
- `packages/plugin/src/v2/effect/npm.ts` (+11, -0)
- `packages/plugin/src/v2/effect/path.ts` (+8, -0)
- `packages/plugin/src/v2/effect/plugin.ts` (+11, -0)
- `packages/plugin/src/v2/effect/reference.ts` (+13, -0)
- `packages/plugin/src/v2/effect/registration.ts` (+16, -0)
- `packages/plugin/src/v2/effect/skill.ts` (+18, -0)
- `packages/sdk/js/package.json` (+2, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+86, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+95, -17)
- `packages/sdk/openapi.json` (+237, -74)
- `packages/server/src/groups/session.ts` (+32, -0)
- `packages/server/src/handlers/provider.ts` (+7, -10)
- `packages/server/src/handlers/session.ts` (+32, -0)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+4, -4)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+2, -2)
- `packages/stats/app/src/routes/api/health.ts` (+1, -17)
- `packages/stats/app/src/routes/index.tsx` (+2, -2)
- `packages/stats/app/src/stats-runtime.ts` (+5, -0)
- `packages/stats/server/src/ingest.ts` (+18, -11)
- `packages/tui/src/component/dialog-skill.tsx` (+40, -6)
- `turbo.json` (+4, -0)

### Key Diffs

#### packages/core/bunfig.toml
```diff
diff --git a/packages/core/bunfig.toml b/packages/core/bunfig.toml
new file mode 100644
index 0000000..786a377
--- /dev/null
+++ b/packages/core/bunfig.toml
@@ -0,0 +1,2 @@
+[test]
+preload = ["./test/preload.ts"]
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 7e12e5b..2aec5ec 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -91,6 +91,7 @@
     "@opencode-ai/effect-drizzle-sqlite": "workspace:*",
     "@opencode-ai/effect-sqlite-node": "workspace:*",
     "@opencode-ai/llm": "workspace:*",
+    "@opencode-ai/plugin": "workspace:*",
     "@opentelemetry/api": "1.9.0",
     "@opentelemetry/context-async-hooks": "2.6.1",
     "@opentelemetry/exporter-trace-otlp-http": "0.214.0",
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index fabf747..18e9e59 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -1,7 +1,6 @@
 export * as AgentV2 from "./agent"
 
-import { Array, Context, Effect, Layer, Schema, Scope } from "effect"
-import { castDraft, enableMapSet, type Draft } from "immer"
+import { Array, Context, Effect, Layer, Schema, Scope, Types } from "effect"
 import { ModelV2 } from "./model"
 import { PermissionSchema } from "./permission/schema"
 import { ProviderV2 } from "./provider"
@@ -49,21 +48,19 @@ export interface Selection {
 }
 
 type Data = {
-  agents: Map<ID, Info>
+  agents: Map<ID, Types.DeepMutable<Info>>
   default?: ID
 }
 
-export type Editor = {
+export type Draft = {
   list: () => readonly Info[]
   get: (id: ID) => Info | undefined
   default: (id: ID | undefined) => void
-  update: (id: ID, fn: (agent: Draft<Info>) => void) => void
+  update: (id: ID, fn: (agent: Types.DeepMutable<Info>) => void) => void
   remove: (id: ID) => void
 }
 
-export interface Interface {
-  readonly transform: State.Interface<Data, Editor>["transform"]
-  readonly update: State.Interface<Data, Editor>["update"]
+export interface Interface extends State.Transformable<Draft> {
   readonly get: (id: ID) => Effect.Effect<Info | undefined>
   readonly default: () => Effect.Effect<Info | undefined>
   readonly resolve: (id?: ID | string) => Effect.Effect<Info | undefined>
@@ -73,21 +70,19 @@ export interface Interface {
 
 export class Service extends Context.Service<Service, Interface>()("@opencode/v2/Agent") {}
 
-enableMapSet()
-
 export const layer = Layer.effect(
   Service,
   Effect.gen(function* () {
-    const state = State.create<Data, Editor>({
+    const state = State.create<Data, Draft>({
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index 4156db5..ed982cb 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -1,36 +1,21 @@
 export * as Catalog from "./catalog"
 
-import { Array, Context, Effect, Layer, Option, Order, pipe, Schema, Scope, Stream } from "effect"
-import { castDraft, enableMapSet, type Draft } from "immer"
+import { Array, Context, Effect, Layer, Option, Order, pipe, Schema } from "effect"
 import { ModelV2 } from "./model"
 import { ModelRequest } from "./model-request"
-import { PluginV2 } from "./plugin"
 import { ProviderV2 } from "./provider"
-import { Location } from "./location"
 import { EventV2 } from "./event"
 import { Policy } from "./policy"
 import { State } from "./state"
 import { Integration } from "./integration"
 
 export type ProviderRecord = {
-  provider: ProviderV2.Info
-  models: Map<ModelV2.ID, ModelV2.Info>
+  provider: ProviderV2.MutableInfo
+  models: Map<ModelV2.ID, ModelV2.MutableInfo>
 }
 
 export type DefaultModel = { providerID: ProviderV2.ID; modelID: ModelV2.ID }
 
-export class ProviderNotFoundError extends Schema.TaggedErrorClass<ProviderNotFoundError>()(
-  "CatalogV2.ProviderNotFound",
-  {
-    providerID: ProviderV2.ID,
-  },
-) {}
-
-export class ModelNotFoundError extends Schema.TaggedErrorClass<ModelNotFoundError>()("CatalogV2.ModelNotFound", {
-  providerID: ProviderV2.ID,
-  modelID: ModelV2.ID,
-}) {}
-
 export const PolicyActions = Schema.Literals(["provider.use"])
 
 export const Event = {
@@ -42,16 +27,16 @@ type Data = {
   defaultModel?: DefaultModel
 }
 
-export type Editor = {
+export type Draft = {
```

#### packages/core/src/command.ts
```diff
diff --git a/packages/core/src/command.ts b/packages/core/src/command.ts
index f6b8210..622702e 100644
--- a/packages/core/src/command.ts
+++ b/packages/core/src/command.ts
@@ -1,7 +1,6 @@
 export * as CommandV2 from "./command"
 
-import { Context, Effect, Layer, Schema } from "effect"
-import { castDraft, type Draft } from "immer"
+import { Context, Effect, Layer, Schema, Types } from "effect"
 import { ModelV2 } from "./model"
 import { State } from "./state"
 
@@ -15,19 +14,17 @@ export class Info extends Schema.Class<Info>("CommandV2.Info")({
 }) {}
 
 export type Data = {
-  commands: Map<string, Info>
+  commands: Map<string, Types.DeepMutable<Info>>
 }
 
-export type Editor = {
+export type Draft = {
   list: () => readonly Info[]
   get: (name: string) => Info | undefined
-  update: (name: string, update: (command: Draft<Info>) => void) => void
+  update: (name: string, update: (command: Types.DeepMutable<Info>) => void) => void
   remove: (name: string) => void
 }
 
-export interface Interface {
-  readonly transform: State.Interface<Data, Editor>["transform"]
-  readonly update: State.Interface<Data, Editor>["update"]
+export interface Interface extends State.Transformable<Draft> {
   readonly get: (name: string) => Effect.Effect<Info | undefined>
   readonly list: () => Effect.Effect<Info[]>
 }
@@ -37,13 +34,13 @@ export class Service extends Context.Service<Service, Interface>()("@opencode/v2
 export const layer = Layer.effect(
   Service,
   Effect.sync(() => {
-    const state = State.create<Data, Editor>({
+    const state = State.create<Data, Draft>({
       initial: () => ({ commands: new Map() }),
-      editor: (draft) => ({
+      draft: (draft) => ({
         list: () => Array.from(draft.commands.values()) as Info[],
         get: (name) => draft.commands.get(name),
         update: (name, update) => {
-          const current = draft.commands.get(name) ?? castDraft(new Info({ name, template: "" }))
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/agent.ts
- `src/core/` - review core changes from packages/core/src/catalog.ts
- `src/core/` - review core changes from packages/core/src/config.ts
- `src/core/` - review core changes from packages/core/src/config/agent.ts
- `src/core/` - review core changes from packages/core/src/config/attachments.ts
- `src/core/` - review core changes from packages/core/src/config/compaction.ts
- `src/core/` - review core changes from packages/core/src/config/experimental.ts
- `src/core/` - review core changes from packages/core/src/config/formatter.ts
- `src/core/` - review core changes from packages/core/src/config/lsp.ts
- `src/core/` - review core changes from packages/core/src/config/mcp.ts
- `src/core/` - review core changes from packages/core/src/config/plugin.ts
- `src/core/` - review core changes from packages/core/src/config/plugin/agent.ts
- `src/core/` - review core changes from packages/core/src/config/plugin/provider.ts
- `src/core/` - review core changes from packages/core/src/config/provider.ts
- `src/core/` - review core changes from packages/core/src/config/reference.ts
- `src/core/` - review core changes from packages/core/src/config/tool-output.ts
- `src/core/` - review core changes from packages/core/src/config/watcher.ts
- `src/core/` - review core changes from packages/core/src/event.ts
- `src/core/` - review core changes from packages/core/src/filesystem.ts
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/core/` - review core changes from packages/core/src/git.ts
- `src/core/` - review core changes from packages/core/src/location-layer.ts
- `src/core/` - review core changes from packages/core/src/location.ts
- `src/core/` - review core changes from packages/core/src/model.ts
- `src/core/` - review core changes from packages/core/src/plugin.ts
- `src/core/` - review core changes from packages/core/src/plugin/account.ts
- `src/core/` - review core changes from packages/core/src/plugin/agent.ts
- `src/core/` - review core changes from packages/core/src/plugin/boot.ts
- `src/core/` - review core changes from packages/core/src/plugin/env.ts
- `src/core/` - review core changes from packages/core/src/plugin/models-dev.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/amazon-bedrock.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/anthropic.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/azure.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cerebras.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cloudflare-workers-ai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/github-copilot.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/google-vertex.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/kilo.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/llmgateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/nvidia.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/opencode.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openrouter.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/vercel.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/zenmux.ts
- `src/core/` - review core changes from packages/core/src/policy.ts
- `src/core/` - review core changes from packages/core/src/project.ts
- `src/core/` - review core changes from packages/core/src/schema.ts
- `src/core/` - review core changes from packages/core/src/state.ts
- `src/core/` - review core changes from packages/core/test/account.test.ts
- `src/core/` - review core changes from packages/core/test/agent.test.ts
- `src/core/` - review core changes from packages/core/test/catalog.test.ts
- `src/core/` - review core changes from packages/core/test/config/agent.test.ts
- `src/core/` - review core changes from packages/core/test/config/config.test.ts
- `src/core/` - review core changes from packages/core/test/config/provider.test.ts
- `src/core/` - review core changes from packages/core/test/event.test.ts
- `src/core/` - review core changes from packages/core/test/fixture/location.ts
- `src/core/` - review core changes from packages/core/test/kilocode/provider-isolation.test.ts
- `src/core/` - review core changes from packages/core/test/location.test.ts
- `src/core/` - review core changes from packages/core/test/model.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-amazon-bedrock.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-anthropic.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure-cognitive-services.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cerebras.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-github-copilot.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-gitlab.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google-vertex-anthropic.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google-vertex.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-helper.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-kilo.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-llmgateway.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-nvidia.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-opencode.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openrouter.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-vercel.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-zenmux.test.ts
- `src/core/` - review core changes from packages/core/test/policy.test.ts
- `src/core/` - review core changes from packages/core/test/project.test.ts
- `src/tool/application-tools.ts` - update based on opencode packages/core/src/tool/application-tools.ts changes
- `src/tool/http-body.ts` - update based on opencode packages/core/src/tool/http-body.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on kilocode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/prompt.ts` - update based on kilocode packages/opencode/src/tool/shell/prompt.ts changes
- `src/tool/read-filesystem.ts` - update based on opencode packages/core/src/tool/read-filesystem.ts changes
- `src/tool/read.ts` - update based on opencode packages/core/src/tool/read.ts changes
- `src/tool/recall.test.ts` - update based on kilocode packages/opencode/test/tool/recall.test.ts changes
- `src/tool/recall.ts` - update based on kilocode packages/opencode/src/tool/recall.ts changes
- `src/tool/recall.txt.ts` - update based on kilocode packages/opencode/src/tool/recall.txt changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/shell.test.ts` - update based on kilocode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/task_status.test.ts` - update based on kilocode packages/opencode/test/tool/task_status.test.ts changes
- `src/tool/task_status.ts` - update based on kilocode packages/opencode/src/tool/task_status.ts changes
- `src/tool/task_status.txt.ts` - update based on kilocode packages/opencode/src/tool/task_status.txt changes
- `src/tool/webfetch.ts` - update based on opencode packages/core/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on opencode packages/core/src/tool/websearch.ts changes
