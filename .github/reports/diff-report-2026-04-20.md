# Upstream Changes Report
Generated: 2026-04-20 08:09:55

## Summary
- kilocode: 197 commits, 632 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (883f12819..7038ce061)

### Commits

- 7038ce061 - fix(vscode): keep queued messages pinned at the bottom (#9195) (Marius, 2026-04-20)
- 7db99c37e - fix: re-prevent plan file corruption for OpenAI models by preserving write tool (#9188) (Josh Holmer, 2026-04-20)
- bec6b03d4 - Merge pull request #9193 from Kilo-Org/extreme-cauliflower (Marian Alexandru Alecu, 2026-04-20)
- 60709fd01 - fix(vscode): hide duplicate preview text while editing custom question answer (#9129) (Marius, 2026-04-20)
- 61ec925c5 - fix(vscode): restore chat turn spacing broken by virtualizer (#9141) (Marius, 2026-04-20)
- 42922b65d - docs(kilo-docs): add agent manager workflows guide (#9148) (Marius, 2026-04-20)
- f025e34b6 - docs(cli): require final summary before local review suggestion (marius-kilocode, 2026-04-20)
- 08a21d796 - Merge pull request #9160 from Kilo-Org/fix/smoke-test-draft-release (Joshua Lambert, 2026-04-19)
- a2ddeba4a - Merge pull request #9177 from Kilo-Org/docs/context-condensing-accurate-defaults (Joshua Lambert, 2026-04-19)
- 70b38bc17 - docs(kilo-docs): clarify reserved buffer behavior per model type (Josh Lambert, 2026-04-18)
- b296b8f79 - docs(kilo-docs): rewrite trigger rules in prose (Josh Lambert, 2026-04-18)
- 2dabf6821 - docs(kilo-docs): drop defensive framing in compaction trigger section (Josh Lambert, 2026-04-18)
- 8b5b9a52e - docs(kilo-docs): document actual compaction defaults and triggers (Josh Lambert, 2026-04-18)
- 8ea33da72 - Merge branch 'main' into fix/smoke-test-draft-release (Joshua Lambert, 2026-04-18)
- b24baf93e - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-18)
- 568d7463b - Merge pull request #9014 from Kilo-Org/johnnyamancio/kilo-opencode-v1.4.4 (Imanol Maiztegui, 2026-04-18)
- 4a8e1b547 - Merge branch 'main' into johnnyamancio/kilo-opencode-v1.4.4 (Imanol Maiztegui, 2026-04-18)
- a1321bf54 - ci: drop pagination and head pipe in asset URL lookup (Josh Lambert, 2026-04-18)
- 9d6d622e9 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-18)
- dfd939443 - Merge pull request #9164 from Kilo-Org/update-anthropic-sdk-3.0.71 (Christiaan Arnoldus, 2026-04-18)
- 41e0df6b4 - chore: improve changeset description with 3.0.71 fix detail (kiloconnect[bot], 2026-04-18)
- 448dba8ca - chore(cli,gateway): update @ai-sdk/anthropic to 3.0.71 with xhigh effort support (kiloconnect[bot], 2026-04-18)
- 46e785b03 - Merge pull request #8968 from Kilo-Org/feat/variant-chat-template-args (Christiaan Arnoldus, 2026-04-18)
- b3ce557f2 - ci: resolve draft release assets via API in smoke-test (Josh Lambert, 2026-04-18)
- 1b4f9cd3d - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-17)
- f1cb23a21 - Merge pull request #9152 from Kilo-Org/imanol/morph-sdk-version (Christiaan Arnoldus, 2026-04-17)
- afebe32c0 - chore: align morphsdk version to 0.2.166 across packages (Imanol Maiztegui, 2026-04-17)
- 8bae4413f - test(bash): migrate permission metadata tests to Effect runtime (Imanol Maiztegui, 2026-04-17)
- 2ee8394cf - feat: add workspace API endpoints, sanitize export flag, and update SDK types (Imanol Maiztegui, 2026-04-17)
- 5a2789167 - Merge branch 'main' into johnnyamancio/kilo-opencode-v1.4.4 (Imanol Maiztegui, 2026-04-17)
- 8aa490c66 - chore: Add kilocode_change marker (Johnny Amancio, 2026-04-17)
- 217261622 - fix: Remove Bash string appearing before commands - brought back on earlier opencode merge (Johnny Amancio, 2026-04-17)
- 024ad48c5 - release: v7.2.14 (kilo-maintainer[bot], 2026-04-17)
- d42e2b744 - Merge pull request #9147 from Kilo-Org/chore/disable-publish-smoke-test (Joshua Lambert, 2026-04-17)
- bec9d9b04 - Apply suggestions from code review (Joshua Lambert, 2026-04-17)
- c55a9a9af - ci: disable smoke-test job in publish workflow (Josh Lambert, 2026-04-17)
- 72fc5d991 - docs(cli): note cloud schema mirror when adding kilocode_change config keys (#9117) (Marius, 2026-04-17)
- 28abdeded - Merge pull request #9046 from Kilo-Org/fix/memory-leak-agent-manager (Marian Alexandru Alecu, 2026-04-17)
- 2367e279a - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-17)
- 213101da4 - fix(vscode): raise per-file diff cap to 20 MB (Alex Alecu, 2026-04-17)
- eac2dbafa - perf(vscode): paginated message loading with virtualized scroll (#8911) (Marius, 2026-04-17)
- 671129d4d - chore: add changeset for agent manager memory leak fix (Alex Alecu, 2026-04-17)
- e258fa2bc - Merge pull request #9048 from Kilo-Org/fix/publish-smoke-test-gate-main (Joshua Lambert, 2026-04-17)
- dc1bb7950 - Merge remote-tracking branch 'origin/main' into fix/memory-leak-agent-manager (Alex Alecu, 2026-04-17)
- 77e52748c - fix(vscode): cap diff detail reads at 2MB per side (Alex Alecu, 2026-04-17)
- b098d547f - Merge branch 'main' into feat/variant-chat-template-args (Christiaan Arnoldus, 2026-04-17)
- 2e0e66321 - Merge pull request #9132 from Kilo-Org/chore/add-dependabot-to-team-list (Christiaan Arnoldus, 2026-04-17)
- d02a658db - fix(vscode): move Agent Manager git polling into extension host (Alex Alecu, 2026-04-17)
- 96bd75067 - fix: suppress 'Thanks' credit for kilo-code-bot app in changelog (kiloconnect[bot], 2026-04-17)
- cbc96a25e - Merge pull request #9126 from Kilo-Org/docs/update-kilo-auto-models (Christiaan Arnoldus, 2026-04-17)
- 3895139f5 - chore: add dependabot[bot] to team list (kiloconnect[bot], 2026-04-17)
- 2ba069350 - docs(kilo-docs): note that kilo-auto underlying models can change (kiloconnect[bot], 2026-04-17)
- c8fd42182 - fix(vscode): restore sidebar diff viewer parity with Agent Manager (#9121) (Marius, 2026-04-17)
- 81173e3e8 - fix(vscode): set MIMALLOC_PURGE_DELAY=0 on spawned kilo serve (Alex Alecu, 2026-04-17)
- 830b4ffda - Merge remote-tracking branch 'origin/main' into fix/memory-leak-agent-manager (Alex Alecu, 2026-04-17)
- 7267b7dc9 - revert: undo all Agent Manager leak-fix attempts (Alex Alecu, 2026-04-17)
- 11343c447 - Merge pull request #9067 from Kilo-Org/fix/queued-prompt-reorder (Christiaan Arnoldus, 2026-04-17)
- 852b52e84 - Merge pull request #9118 from Kilo-Org/kilocode-model-switcher (Marian Alexandru Alecu, 2026-04-17)
- 20331784f - docs(kilo-docs): bump stale claude model IDs to current versions (kiloconnect[bot], 2026-04-17)
- b5bc3fe02 - docs(kilo-docs): remove legacy kilo/auto alias mentions (kiloconnect[bot], 2026-04-17)
- 9749cc178 - feat(kilo-ui): enhance MCP tool display with input/output sections and improved styling (#9123) (Marius, 2026-04-17)
- eb89a1966 - chore: Keep scope by project_id to prevent cross-project leakage (Johnny Amancio, 2026-04-17)
- 6231a54a5 - docs(kilo-docs): clarify balanced and free routing in auto-model guide (kiloconnect[bot], 2026-04-17)
- 25369c799 - Merge pull request #9122 from Kilo-Org/docs/changeset-contributing (Christiaan Arnoldus, 2026-04-17)
- 032761375 - docs(kilo-docs): update kilo-auto model mappings (kiloconnect[bot], 2026-04-17)
- 07df79659 - fix(cli): wrap auto-apply effect in change markers (Alex Alecu, 2026-04-17)
- 79990b31f - fix: Remove kilocode_change marker from kilo package (Johnny Amancio, 2026-04-17)
- a98b10ebc - docs: document changeset workflow in contributing guide (marius-kilocode, 2026-04-17)
- 3c7b0a7d3 - fix: Regenerage sdk and port tests to new v1.4.4 style (Johnny Amancio, 2026-04-17)
- 31808ccc6 - fix: improve GPT and Codex subagent usage (#9076) (Josh Holmer, 2026-04-17)
- 8bff3718a - fix: Fix proxy removal that was moved in v1.4.4 (Johnny Amancio, 2026-04-17)
- 0c3e31f6d - Merge remote-tracking branch 'origin/main' into johnnyamancio/kilo-opencode-v1.4.4 (Johnny Amancio, 2026-04-17)
- 4ef6bbff5 - feat(agent-manager): enable /sessions command to browse and resume session history (#8976) (Marius, 2026-04-17)
- 569a089d6 - chore: Re-add zod and rebuild bun.lock (Johnny Amancio, 2026-04-17)
- 530125828 - Add folder mentions (#9023) (Marius, 2026-04-17)
- 3caba2c5e - feat(vscode): clarify chat_template_args label mentions enabling thinking (kiloconnect[bot], 2026-04-17)
- 952b3096d - Merge pull request #9018 from Kilo-Org/kilocode-suggest-code-review (Marian Alexandru Alecu, 2026-04-17)
- 64eb4343f - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-04-17)
- 343455b87 - fix(cli): preserve per-agent model overrides (#9050) (Alex Alecu, 2026-04-17)
- 9dfa2ae35 - Merge remote-tracking branch 'origin/main' into kilocode-suggest-code-review (Alex Alecu, 2026-04-17)
- 2e1836a91 - Merge remote-tracking branch 'origin/main' into johnnyamancio/kilo-opencode-v1.4.4 (Johnny Amancio, 2026-04-17)
- 5a4daf692 - ci: trigger workflows (Alex Alecu, 2026-04-17)
- f27063987 - fix(vscode): surface config save errors instead of silently swallowing them (#9109) (Marius, 2026-04-17)
- 76f5d5dc0 - release: v7.2.12 (kilo-maintainer[bot], 2026-04-17)
- 0965571ab - fix(cli,vscode): evict idle worktree instances and stream git output (Alex Alecu, 2026-04-17)
- feea749c5 - fix: Resolve test failures for v1.4.4 merge (Johnny Amancio, 2026-04-17)
- 7d2f5a7ec - fix(agent-manager): preserve local sessions on reload (#9040) (Marius, 2026-04-17)
- a120efdc4 - refactor(cli): drop client-gated blocking flag from suggest tool (Alex Alecu, 2026-04-17)
- 15659e8f0 - test(vscode): lock prompt input/question decoupling (Alex Alecu, 2026-04-17)
- 233a4569f - fix(vscode): decouple prompt input from question tool (Alex Alecu, 2026-04-17)
- e744b75d0 - Merge remote-tracking branch 'origin/main' into feat/variant-chat-template-args (kiloconnect[bot], 2026-04-17)
- 1526a4b8a - fix(vscode): prioritize active session in streaming scheduler (#9057) (Marius, 2026-04-17)
- 49b283e72 - feat(vscode): add contribute CTA to marketplace (#9099) (Marius, 2026-04-17)
- cb0491eaa - Merge pull request #9068 from Kilo-Org/hide-kilo-models-without-tools (Christiaan Arnoldus, 2026-04-17)
- 8c2e586e0 - Merge pull request #9069 from Kilo-Org/fix/opus-4.7-adaptive-reasoning (Christiaan Arnoldus, 2026-04-17)
- 18d686877 - fix(review): drain stderr concurrently to avoid hang (Alex Alecu, 2026-04-17)
- 7682f1a28 - fix(review): surface truncated git output to callers (Alex Alecu, 2026-04-17)
- e60c32631 - fix(cli): add opus-4.7 adaptive reasoning and xhigh effort variant (kiloconnect[bot], 2026-04-17)
- 92c18e450 - fix(vscode): trim KiloProvider slimPart comment to fit max-lines cap (Alex Alecu, 2026-04-17)
- a0e4d8098 - Merge remote-tracking branch 'origin/main' into fix/memory-leak-agent-manager (Alex Alecu, 2026-04-17)
- 226f9e348 - fix(cli): drop state.cancel from prompt enqueue path (Alex Alecu, 2026-04-17)
- 04a3db91e - Merge remote-tracking branch 'origin/main' into kilocode-suggest-code-review (Alex Alecu, 2026-04-17)
- 0eb10ac23 - fix: Fix issue caused by kilo code not yet been ported to effect (Johnny Amancio, 2026-04-16)
- e65c2d99c - fix(gateway): hide models without tool support from list (kiloconnect[bot], 2026-04-16)
- 959a8b498 - fix(cli): move queued user prompts to end of history (kiloconnect[bot], 2026-04-16)
- 689f81070 - Merge remote-tracking branch 'origin/main' into johnnyamancio/kilo-opencode-v1.4.4 (Johnny Amancio, 2026-04-16)
- f0ceacaa1 - fix: Extension frozen on debug mode (Johnny Amancio, 2026-04-16)
- 448cf2683 - fix: use local smoke test in publish (Josh Lambert, 2026-04-16)
- d404bb201 - fix: gate publish on smoke test (Josh Lambert, 2026-04-16)
- 158b65d5f - fix(cli): throw 404 on unknown suggestion dismiss (Alex Alecu, 2026-04-16)
- e7a33dc50 - fix(vscode): honor blocking questions in prompt block state (Alex Alecu, 2026-04-16)
- 96ce0cb5f - fix(cli,vscode): fix native memory leak in Agent Manager git polling (Alex Alecu, 2026-04-16)
- af4bc89fc - Merge remote-tracking branch 'origin/main' into kilocode-suggest-code-review (Alex Alecu, 2026-04-16)
- ea507a454 - Merge remote-tracking branch 'origin/main' into kilocode-suggest-code-review (Alex Alecu, 2026-04-16)
- c85d062b9 - test(vscode,cli): add regression tests for question & suggestion prompt decoupling (Alex Alecu, 2026-04-16)
- 5948459e0 - feat(vscode): decouple question tool from input prompt (Alex Alecu, 2026-04-16)
- 23c7264d8 - Merge branch 'long-mushroom' of https://github.com/Kilo-Org/kilocode into kilocode-suggest-code-review (Alex Alecu, 2026-04-16)
- 9ce47254d - fix(vscode): show local review follow-up questions (marius-kilocode, 2026-04-16)
- 4f38dede4 - Merge branch 'main' into feat/variant-chat-template-args (Christiaan Arnoldus, 2026-04-16)
- 2f3408acd - feat: restore suggest code review tool (Alex Alecu, 2026-04-16)
- c78f49202 - fix: Fix unit tests (Johnny Amancio, 2026-04-16)
- 501ebbf0e - fix: Fix typecheck issues (Johnny Amancio, 2026-04-16)
- 87aaac92c - Merge remote-tracking branch 'origin/main' into johnnyamancio/kilo-opencode-v1.4.4 (Johnny Amancio, 2026-04-15)
- 915f12c7e - resolve merge conflicts (Johnny Amancio, 2026-04-15)
- f0eb8ca87 - feat(vscode): add chat_template_args UI to custom provider variant editor (kiloconnect[bot], 2026-04-15)
- 25fc7908d - feat(vscode): support chat_template_args variant in custom providers (kiloconnect[bot], 2026-04-15)
- beb9b3b07 - refactor: kilo compat for v1.4.4 (Johnny Amancio, 2026-04-15)
- bddf83008 - release: v1.4.4 (opencode, 2026-04-15)
- 50c1d0a43 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-14)
- 60b8041eb - zen: support alibaba cache write (Frank, 2026-04-14)
- 3b2a2c461 - sync zen (Frank, 2026-04-14)
- 6706358a6 - feat(core): bootstrap packages/server and document extraction plan (#22492) (Shoubhit Dash, 2026-04-15)
- f6409759e - fix: restore instance context in prompt runs (#22498) (Shoubhit Dash, 2026-04-15)
- f9d99f044 - fix(session): keep GitHub Copilot compaction requests valid (#22371) (Luke Parker, 2026-04-15)
- bbd5faf5c - chore(nix): remove external ripgrep (#22482) (Caleb Norton, 2026-04-14)
- aeb7d99d2 - fix(effect): preserve logger context in prompt runs (#22496) (Kit Langton, 2026-04-14)
- 3695057be - feat: add --sanitize flag to opencode export to strip PII or confidential info (#22489) (Aiden Cline, 2026-04-14)
- 4ed3afea8 - chore: generate (opencode-agent[bot], 2026-04-14)
- 3cf7c7536 - fix(question): restore flat reply sdk shape (#22487) (Kit Langton, 2026-04-14)
- 85674f4bf - chore: generate (opencode-agent[bot], 2026-04-14)
- f2525a63c - add experimental question HttpApi slice (#22357) (Kit Langton, 2026-04-14)
- 8c42d391f - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-14)
- 7f9bf9107 - upgrade opentui to 0.1.99 (#22283) (Sebastian, 2026-04-14)
- 6ce5c01b1 - ignore: v2 experiments (Dax Raad, 2026-04-14)
- a53fae151 - Fix diff line number contrast for built-in themes (#22464) (Sebastian, 2026-04-14)
- 462645817 - fix(mcp): persist immediate oauth connections (#22376) (Kit Langton, 2026-04-14)
- 9a5178e4a - fix(cli): handlePluginAuth asks for api key only if authorize method exists (#22475) (Goni Zahavy, 2026-04-14)
- 68384613b - refactor(session): remove async facade exports (#22471) (Kit Langton, 2026-04-14)
- 4f967d5bc - improve bash timeout retry hint (#22390) (Kit Langton, 2026-04-14)
- ff60859e3 - fix(project): reuse runtime in instance boot (#22470) (Kit Langton, 2026-04-14)
- 020c47a05 - refactor(project): remove async facade exports (#22387) (Kit Langton, 2026-04-14)
- 64171db17 - chore: generate (opencode-agent[bot], 2026-04-14)
- ad265797a - refactor(share): remove session share async facade exports (#22386) (Kit Langton, 2026-04-14)
- b1312a318 - core: prevent duplicate user messages in ACP clients (#22468) (Aiden Cline, 2026-04-14)
- a8f9f6b70 - fix(acp): stop emitting user_message_chunk during session/prompt turn (#21851) (RAIT-09, 2026-04-14)
- d312c677c - fix: rm effect logger from processor.ts, use old logger for now instead (#22460) (Aiden Cline, 2026-04-14)
- 5b60e51c9 - fix(opencode): resolve ripgrep worker path in builds (#22436) (Shoubhit Dash, 2026-04-14)
- 7cbe1627e - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-14)
- d6840868d - refactor(ripgrep): use embedded wasm backend (#21703) (Shoubhit Dash, 2026-04-14)
- 9b2648dd5 - build(opencode): shrink single-file executable size (#22362) (Luke Parker, 2026-04-14)
- f95485423 - refactor(instance): remove state helper (#22381) (Kit Langton, 2026-04-13)
- 6a9907901 - kit/env instance state (#22383) (Kit Langton, 2026-04-13)
- 0a8b6298c - refactor(tui): move config cache to InstanceState (#22378) (Kit Langton, 2026-04-13)
- f40209bdf - refactor(snapshot): remove async facade exports (#22370) (Kit Langton, 2026-04-13)
- a2cb4909d - refactor(plugin): remove async facade exports (#22367) (Kit Langton, 2026-04-13)
- 7a05ba47d - refactor(session): remove compaction async facade exports (#22366) (Kit Langton, 2026-04-13)
- 36745caa2 - refactor(worktree): remove async facade exports (#22369) (Kit Langton, 2026-04-13)
- c2403d0f1 - fix(provider): guard reasoningSummary injection for @ai-sdk/openai-compatible providers (#22352) (Nazar H., 2026-04-13)
- 34e2429c4 - feat: add experimental.compaction.autocontinue hook to disable auto continuing after compaction (#22361) (Aiden Cline, 2026-04-13)
- 10ba68c77 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-14)
- e8471256f - refactor(session): move llm stream into layer (#22358) (Kit Langton, 2026-04-13)
- 43b37346b - feat: add interactive burst to the TUI logo (#22098) (Kit Langton, 2026-04-13)
- d199648ae - refactor(permission): remove async facade exports (#22342) (Kit Langton, 2026-04-13)
- a06f40297 - fix grep exact file path searches (#22356) (Kit Langton, 2026-04-13)
- 59c0fc28e - ignore: v2 thoughts (Dax Raad, 2026-04-13)
- b22add292 - refactor(core): publish sync events to global event stream (#22347) (James Long, 2026-04-13)
- 67aaecaca - refactor(session): remove revert async facade exports (#22339) (Kit Langton, 2026-04-13)
- 29c202e6a - refactor(mcp): remove mcp auth async facade exports (#22338) (Kit Langton, 2026-04-13)
- dcbf11f41 - refactor(session): remove summary async facades (#22337) (Kit Langton, 2026-04-13)
- 14ccff403 - refactor(agent): remove async facade exports (#22341) (Kit Langton, 2026-04-13)
- 5b8b87473 - update effect docs (#22340) (Kit Langton, 2026-04-13)
- 1d81c0266 - chore: generate (opencode-agent[bot], 2026-04-13)
- 913120759 - session entry (Dax Raad, 2026-04-13)
- 7a6ce05d0 - 2.0 exploration (#22335) (Dax, 2026-04-13)
- 1dc69359d - refactor(mcp): remove async facade exports (#22324) (Kit Langton, 2026-04-13)
- 329fcb040 - chore: generate (opencode-agent[bot], 2026-04-13)
- bf50d1c02 - feat(core): expose workspace adaptors to plugins (#21927) (James Long, 2026-04-13)
- b8801dbd2 - refactor(file): remove async facade exports (#22322) (Kit Langton, 2026-04-13)
- f7c694381 - refactor(config): remove async facade exports (#22325) (Kit Langton, 2026-04-13)
- 91fe4db27 - Update VOUCHED list (github-actions[bot], 2026-04-13)
- 21d7a85e7 - refactor(lsp): remove async facade exports (#22321) (Kit Langton, 2026-04-13)
- 663e798e7 - refactor(provider): remove async facade exports (#22320) (Kit Langton, 2026-04-13)
- 5bc2d2498 - test: ensure project and global instructions are loaded (#22317) (Aiden Cline, 2026-04-13)
- c22e34853 - refactor(auth): remove async auth facade exports (#22306) (Kit Langton, 2026-04-13)
- 6825b0bbc - refactor(pty): remove async facade exports (#22305) (Kit Langton, 2026-04-13)
- 3644581b5 - refactor(file): stream ripgrep search parsing (#22303) (Kit Langton, 2026-04-13)
- 79cc15335 - fix: dispose e2e app runtime (#22316) (Kit Langton, 2026-04-13)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/read-directory.ts` (+47, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+20, -4)
- `packages/opencode/src/tool/apply_patch.ts` (+252, -242)
- `packages/opencode/src/tool/bash.ts` (+230, -217)
- `packages/opencode/src/tool/codesearch.ts` (+57, -126)
- `packages/opencode/src/tool/edit.ts` (+147, -133)
- `packages/opencode/src/tool/external-directory.ts` (+14, -11)
- `packages/opencode/src/tool/glob.ts` (+94, -71)
- `packages/opencode/src/tool/grep.ts` (+136, -147)
- `packages/opencode/src/tool/invalid.ts` (+16, -13)
- `packages/opencode/src/tool/ls.ts` (+87, -86)
- `packages/opencode/src/tool/lsp.ts` (+63, -69)
- `packages/opencode/src/tool/mcp-exa.ts` (+76, -0)
- `packages/opencode/src/tool/multiedit.ts` (+52, -37)
- `packages/opencode/src/tool/plan.ts` (+20, -81)
- `packages/opencode/src/tool/question.ts` (+17, -18)
- `packages/opencode/src/tool/read.ts` (+28, -15)
- `packages/opencode/src/tool/recall.ts` (+23, -14)
- `packages/opencode/src/tool/registry.ts` (+135, -77)
- `packages/opencode/src/tool/schema.ts` (+1, -2)
- `packages/opencode/src/tool/skill.ts` (+101, -122)
- `packages/opencode/src/tool/suggest.ts` (+2, -0)
- `packages/opencode/src/tool/task.ts` (+73, -91)
- `packages/opencode/src/tool/todo.ts` (+18, -19)
- `packages/opencode/src/tool/tool.ts` (+64, -60)
- `packages/opencode/src/tool/truncate.ts` (+7, -11)
- `packages/opencode/src/tool/warpgrep.ts` (+86, -72)
- `packages/opencode/src/tool/webfetch.ts` (+139, -148)
- `packages/opencode/src/tool/websearch.ts` (+50, -126)
- `packages/opencode/src/tool/write.ts` (+79, -67)
- `packages/opencode/test/tool/apply_patch.test.ts` (+27, -7)
- `packages/opencode/test/tool/bash.test.ts` (+379, -283)
- `packages/opencode/test/tool/edit.test.ts` (+281, -192)
- `packages/opencode/test/tool/external-directory.test.ts` (+21, -50)
- `packages/opencode/test/tool/glob.test.ts` (+98, -36)
- `packages/opencode/test/tool/grep.test.ts` (+77, -74)
- `packages/opencode/test/tool/question.test.ts` (+11, -7)
- `packages/opencode/test/tool/read.test.ts` (+21, -17)
- `packages/opencode/test/tool/recall.test.ts` (+15, -8)
- `packages/opencode/test/tool/registry.test.ts` (+163, -134)
- `packages/opencode/test/tool/skill.test.ts` (+154, -123)
- `packages/opencode/test/tool/suggest.test.ts` (+2, -0)
- `packages/opencode/test/tool/task.test.ts` (+115, -140)
- `packages/opencode/test/tool/tool-define.test.ts` (+23, -13)
- `packages/opencode/test/tool/truncation.test.ts` (+131, -96)
- `packages/opencode/test/tool/webfetch.test.ts` (+18, -11)
- `packages/opencode/test/tool/write.test.ts` (+192, -289)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+20, -31)
- `packages/opencode/src/kilocode/agent/index.ts` (+6, -1)
- `packages/opencode/test/agent/agent.test.ts` (+49, -42)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/routes.ts` (+7, -3)
- `packages/opencode/src/permission/index.ts` (+16, -32)
- `packages/opencode/src/permission/schema.ts` (+1, -5)
- `packages/opencode/test/kilocode/permission/next.always-rules.test.ts` (+319, -287)
- `packages/opencode/test/permission/next.test.ts` (+494, -556)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/bus-event.ts` (+11, -18)
- `packages/opencode/src/bus/global.ts` (+2, -0)
- `packages/opencode/src/bus/index.ts` (+12, -4)
- `packages/opencode/test/bus/bus-effect.test.ts` (+2, -4)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/custom-provider-xhigh-effort.md` (+0, -5)
- `.changeset/question-custom-answer-duplicate.md` (+5, -0)
- `.changeset/queued-messages-stay-at-bottom.md` (+5, -0)
- `.changeset/quiet-review-summary.md` (+5, -0)
- `.changeset/update-anthropic-sdk-3071.md` (+6, -0)
- `.changeset/vscode-subagent-spacing.md` (+5, -0)
- `.github/workflows/publish.yml` (+9, -73)
- `.github/workflows/smoke-test.yml` (+27, -8)
- `.github/workflows/test.yml` (+13, -0)
- `.opencode/.gitignore` (+2, -1)
- `.opencode/skills/effect/SKILL.md` (+21, -0)
- `.opencode/themes/mytheme.json` (+2, -2)
- `AGENTS.md` (+2, -0)
- `bun.lock` (+303, -310)
- `nix/hashes.json` (+4, -4)
- `nix/kilo.nix` (+18, -19)
- `package.json` (+6, -6)
- `packages/app/e2e/backend.ts` (+7, -3)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/context/global-sdk.tsx` (+6, -1)
- `packages/app/src/pages/layout/sidebar-workspace.tsx` (+1, -1)
- `packages/app/src/pages/session/message-timeline.tsx` (+2, -2)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop-electron/src/main/windows.ts` (+5, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/lib/nav/automate.ts` (+8, -1)
- `packages/kilo-docs/lib/nav/contributing.ts` (+4, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager-workflows.md` (+194, -0)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+7, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/auto-model.md` (+6, -2)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+3, -2)
- `packages/kilo-docs/pages/contributing/architecture/auto-model-tiers.md` (+6, -6)
- `packages/kilo-docs/pages/contributing/architecture/config-schema.md` (+33, -0)
- `packages/kilo-docs/pages/contributing/index.md` (+27, -0)
- `packages/kilo-docs/pages/customize/context/context-condensing.md` (+119, -63)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+22, -19)
- `packages/kilo-docs/source-links.md` (+3, -1)
- `packages/kilo-gateway/package.json` (+2, -2)
- `packages/kilo-gateway/src/api/models.ts` (+5, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-i18n/src/ar.ts` (+2, -0)
- `packages/kilo-i18n/src/br.ts` (+2, -0)
- `packages/kilo-i18n/src/bs.ts` (+2, -0)
- `packages/kilo-i18n/src/da.ts` (+2, -0)
- `packages/kilo-i18n/src/de.ts` (+2, -0)
- `packages/kilo-i18n/src/en.ts` (+2, -0)
- `packages/kilo-i18n/src/es.ts` (+2, -0)
- `packages/kilo-i18n/src/fr.ts` (+2, -0)
- `packages/kilo-i18n/src/ja.ts` (+2, -0)
- `packages/kilo-i18n/src/ko.ts` (+2, -0)
- `packages/kilo-i18n/src/nl.ts` (+2, -0)
- `packages/kilo-i18n/src/no.ts` (+2, -0)
- `packages/kilo-i18n/src/pl.ts` (+2, -0)
- `packages/kilo-i18n/src/ru.ts` (+2, -0)
- `packages/kilo-i18n/src/th.ts` (+2, -0)
- `packages/kilo-i18n/src/tr.ts` (+2, -0)
- `packages/kilo-i18n/src/uk.ts` (+2, -0)
- `packages/kilo-i18n/src/zh.ts` (+2, -0)
- `packages/kilo-i18n/src/zht.ts` (+2, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/basic-tool.css` (+18, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+68, -8)
- `packages/kilo-vscode/CHANGELOG.md` (+44, -0)
- `packages/kilo-vscode/package.json` (+2, -1)
- `packages/kilo-vscode/src/DiffViewerProvider.ts` (+39, -2)
- `packages/kilo-vscode/src/KiloProvider.ts` (+163, -162)
- `packages/kilo-vscode/src/SubAgentViewerProvider.ts` (+2, -12)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+7, -1)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+12, -1)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+25, -38)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+11, -4)
- `packages/kilo-vscode/src/agent-manager/__tests__/AgentManagerProvider.spec.ts` (+14, -0)
- `packages/kilo-vscode/src/agent-manager/local-diff.ts` (+386, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+5, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-diff-controller.ts` (+18, -34)
- `packages/kilo-vscode/src/extension.ts` (+1, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+135, -51)
- `packages/kilo-vscode/src/kilo-provider/commands.ts` (+34, -0)
- `packages/kilo-vscode/src/kilo-provider/file-search-items.ts` (+45, -0)
- `packages/kilo-vscode/src/kilo-provider/file-search.ts` (+54, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/question.ts` (+1, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/suggestion.ts` (+110, -0)
- `packages/kilo-vscode/src/kilo-provider/message-page.ts` (+64, -0)
- `packages/kilo-vscode/src/kilo-provider/session-stream-scheduler.ts` (+327, -0)
- `packages/kilo-vscode/src/kilo-provider/slim-metadata.ts` (+15, -5)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+12, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-utils.ts` (+11, -0)
- `packages/kilo-vscode/src/services/cli-backend/sdk-sse-adapter.ts` (+3, -5)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+10, -0)
- `packages/kilo-vscode/src/shared/custom-provider.ts` (+1, -0)
- `packages/kilo-vscode/src/shared/stream-messages.ts` (+24, -0)
- `packages/kilo-vscode/src/worktree-diff-client.ts` (+54, -0)
- `packages/kilo-vscode/tests/unit/connection-utils.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/custom-provider.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/diff-viewer-css-arch.test.ts` (+42, -0)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/git-stats-poller.test.ts` (+92, -86)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+244, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+232, -0)
- `packages/kilo-vscode/tests/unit/local-diff.test.ts` (+274, -0)
- `packages/kilo-vscode/tests/unit/message-contract.test.ts` (+14, -5)
- `packages/kilo-vscode/tests/unit/message-page.test.ts` (+118, -0)
- `packages/kilo-vscode/tests/unit/part-stash.test.ts` (+54, -0)
- `packages/kilo-vscode/tests/unit/prompt-input-utils.test.ts` (+80, -0)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+118, -0)
- `packages/kilo-vscode/tests/unit/session-queue.test.ts` (+34, -1)
- `packages/kilo-vscode/tests/unit/session-stream-scheduler.test.ts` (+406, -0)
- `packages/kilo-vscode/tests/unit/suggestion-recovery.test.ts` (+89, -0)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+11, -10)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/chat-view-with-pending-question-empty-input-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/message-list-subagent-to-queued-user-spacing-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/message-list-tool-to-queued-user-spacing-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/suggest-bar-review-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/components-shell/shell-execution-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/diff-summary-collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/mcp-tool-cards-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/mcp-tool-expanded-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/multiple-tool-calls-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/question-dismissed-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/tool-cards-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+71, -70)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffViewerApp.tsx` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+39, -18)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+18, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+113, -37)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+19, -8)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+5, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/SuggestBar.tsx` (+65, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeSessionTurn.tsx` (+14, -31)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+44, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceContribute.tsx` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceListView.tsx` (+11, -1)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/marketplace.css` (+31, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+16, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderModelCard.tsx` (+34, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+42, -14)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+30, -5)
- `packages/kilo-vscode/webview-ui/src/context/part-stash.ts` (+63, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-queue.ts` (+44, -16)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+498, -132)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+10, -4)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+14, -7)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+9, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+25, -1)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+188, -10)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+33, -1)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/settings.css` (+62, -14)
- `packages/kilo-vscode/webview-ui/src/styles/suggest-bar.css` (+49, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+88, -7)
- `packages/opencode/CHANGELOG.md` (+22, -0)
- `packages/opencode/migration/20260410174513_workspace-name/migration.sql` (+16, -0)
- `packages/opencode/migration/20260410174513_workspace-name/snapshot.json` (+1271, -0)
- `packages/opencode/migration/20260413175956_chief_energizer/migration.sql` (+13, -0)
- `packages/opencode/migration/20260413175956_chief_energizer/snapshot.json` (+1399, -0)
- `packages/opencode/package.json` (+17, -15)
- `packages/opencode/script/build.ts` (+12, -1)
- `packages/opencode/script/seed-e2e.ts` (+44, -28)
- `packages/opencode/specs/effect/facades.md` (+238, -0)
- `packages/opencode/specs/effect/http-api.md` (+394, -0)
- `packages/opencode/specs/effect/loose-ends.md` (+36, -0)
- `packages/opencode/specs/{effect-migration.md => effect/migration.md}` (+62, -65)
- `packages/opencode/specs/effect/routes.md` (+66, -0)
- `packages/opencode/specs/effect/schema.md` (+99, -0)
- `packages/opencode/specs/effect/server-package.md` (+666, -0)
- `packages/opencode/specs/effect/tools.md` (+96, -0)
- `packages/opencode/specs/tui-plugins.md` (+1, -4)
- `packages/opencode/src/account/index.ts` (+2, -17)
- `packages/opencode/src/account/repo.ts` (+2, -2)
- `packages/opencode/src/account/schema.ts` (+6, -26)
- `packages/opencode/src/acp/agent.ts` (+9, -14)
- `packages/opencode/src/audio.d.ts` (+4, -0)
- `packages/opencode/src/auth/index.ts` (+16, -25)
- `packages/opencode/src/cli/bootstrap.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/account.ts` (+6, -5)
- `packages/opencode/src/cli/cmd/agent.ts` (+5, -2)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+66, -45)
- `packages/opencode/src/cli/cmd/debug/config.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/debug/file.ts` (+22, -4)
- `packages/opencode/src/cli/cmd/debug/lsp.ts` (+14, -5)
- `packages/opencode/src/cli/cmd/debug/ripgrep.ts` (+14, -7)
- `packages/opencode/src/cli/cmd/debug/skill.ts` (+8, -1)
- `packages/opencode/src/cli/cmd/debug/snapshot.ts` (+4, -3)
- `packages/opencode/src/cli/cmd/export.ts` (+227, -11)
- `packages/opencode/src/cli/cmd/github.ts` (+99, -99)
- `packages/opencode/src/cli/cmd/import.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/mcp.ts` (+88, -47)
- `packages/opencode/src/cli/cmd/models.ts` (+43, -33)
- `packages/opencode/src/cli/cmd/pr.ts` (+18, -7)
- `packages/opencode/src/cli/cmd/providers.ts` (+49, -16)
- `packages/opencode/src/cli/cmd/run.ts` (+10, -8)
- `packages/opencode/src/cli/cmd/serve.ts` (+0, -10)
- `packages/opencode/src/cli/cmd/session.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/stats.ts` (+4, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+35, -110)
- `packages/opencode/src/cli/cmd/tui/asset/charge.wav` (+-, --)
- `packages/opencode/src/cli/cmd/tui/asset/pulse-a.wav` (+-, --)
- `packages/opencode/src/cli/cmd/tui/asset/pulse-b.wav` (+-, --)
- `packages/opencode/src/cli/cmd/tui/asset/pulse-c.wav` (+-, --)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+75, -4)
- `packages/opencode/src/cli/cmd/tui/component/dialog-status.tsx` (+4, -2)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-create.tsx` (+153, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-list.tsx` (+0, -320)
- `packages/opencode/src/cli/cmd/tui/component/logo.tsx` (+600, -52)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+15, -2)
- `packages/opencode/src/cli/cmd/tui/component/workspace/dialog-session-list.tsx` (+0, -151)
- `packages/opencode/src/cli/cmd/tui/context/directory.ts` (+3, -1)
- `packages/opencode/src/cli/cmd/tui/context/event.ts` (+45, -0)
- `packages/opencode/src/cli/cmd/tui/context/local.tsx` (+22, -14)
- `packages/opencode/src/cli/cmd/tui/context/project.tsx` (+106, -0)
- `packages/opencode/src/cli/cmd/tui/context/route.tsx` (+0, -1)
- `packages/opencode/src/cli/cmd/tui/context/sdk.tsx` (+9, -8)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+61, -44)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+6, -4)
- `packages/opencode/src/cli/cmd/tui/context/theme/aura.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/ayu.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/carbonfox.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/catppuccin-frappe.json` (+1, -4)
- `packages/opencode/src/cli/cmd/tui/context/theme/catppuccin-macchiato.json` (+1, -4)
- `packages/opencode/src/cli/cmd/tui/context/theme/catppuccin.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/cobalt2.json` (+1, -4)
- `packages/opencode/src/cli/cmd/tui/context/theme/cursor.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/dracula.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/everforest.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/flexoki.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/github.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/gruvbox.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/kanagawa.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/lucent-orng.json` (+1, -4)
- `packages/opencode/src/cli/cmd/tui/context/theme/material.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/matrix.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/monokai.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/nightowl.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/nord.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/one-dark.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/opencode.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/orng.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/osaka-jade.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/palenight.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/rosepine.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/solarized.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/synthwave84.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/tokyonight.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/vercel.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/vesper.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/zenburn.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+4, -10)
- `packages/opencode/src/cli/cmd/tui/routes/home.tsx` (+10, -3)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+76, -20)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+9, -1)
- `packages/opencode/src/cli/cmd/tui/routes/session/suggest.tsx` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+12, -14)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+42, -11)
- `packages/opencode/src/cli/cmd/tui/util/sound.ts` (+156, -0)
- `packages/opencode/src/cli/cmd/tui/util/terminal.ts` (+53, -30)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+3, -97)
- `packages/opencode/src/cli/cmd/uninstall.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/upgrade.ts` (+8, -3)
- `packages/opencode/src/cli/network.ts` (+2, -1)
- `packages/opencode/src/cli/upgrade.ts` (+5, -4)
- `packages/opencode/src/command/index.ts` (+11, -6)
- `packages/opencode/src/config/config.ts` (+583, -547)
- `packages/opencode/src/config/tui.ts` (+72, -33)
- `packages/opencode/src/control-plane/adaptors/index.ts` (+43, -11)
- `packages/opencode/src/control-plane/adaptors/worktree.ts` (+21, -16)
- `packages/opencode/src/control-plane/schema.ts` (+1, -2)
- `packages/opencode/src/control-plane/types.ts` (+8, -6)
- `packages/opencode/src/control-plane/workspace-context.ts` (+22, -0)
- `packages/opencode/src/control-plane/workspace.sql.ts` (+1, -1)
- `packages/opencode/src/control-plane/workspace.ts` (+106, -44)
- `packages/opencode/src/effect/app-runtime.ts` (+121, -0)
- `packages/opencode/src/effect/bootstrap-runtime.ts` (+27, -0)
- `packages/opencode/src/effect/cross-spawn-spawner.ts` (+13, -0)
- `packages/opencode/src/effect/instance-ref.ts` (+6, -2)
- `packages/opencode/src/effect/instance-state.ts` (+14, -6)
- `packages/opencode/src/effect/logger.ts` (+67, -0)
- `packages/opencode/src/effect/oltp.ts` (+32, -25)
- `packages/opencode/src/effect/run-service.ts` (+9, -7)
- `packages/opencode/src/env/index.ts` (+41, -13)
- `packages/opencode/src/file/index.ts` (+102, -110)
- `packages/opencode/src/file/ripgrep.ts` (+457, -253)
- `packages/opencode/src/file/ripgrep.worker.ts` (+103, -0)
- `packages/opencode/src/file/time.ts` (+5, -24)
- `packages/opencode/src/file/watcher.ts` (+7, -15)
- `packages/opencode/src/filesystem/index.ts` (+2, -2)
- `packages/opencode/src/format/formatter.ts` (+12, -24)
- `packages/opencode/src/format/index.ts` (+9, -17)
- `packages/opencode/src/git/index.ts` (+6, -11)
- `packages/opencode/src/id/id.ts` (+9, -7)
- `packages/opencode/src/index.ts` (+1, -1)
- `packages/opencode/src/installation/index.ts` (+2, -17)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+66, -6)
- `packages/opencode/src/kilocode/config-validation.ts` (+9, -26)
- `packages/opencode/src/kilocode/plan-followup.ts` (+61, -25)
- `packages/opencode/src/kilocode/project-id.ts` (+29, -8)
- `packages/opencode/src/kilocode/review/review.ts` (+29, -5)
- `packages/opencode/src/kilocode/ripgrep-stream.ts` (+23, -0)
- `packages/opencode/src/kilocode/server/instance.ts` (+8, -6)
- `packages/opencode/src/kilocode/server/routes/commit-message.ts` (+1, -0)
- `packages/opencode/src/kilocode/session/index.ts` (+8, -0)
- `packages/opencode/src/kilocode/session/prompt-queue.ts` (+19, -1)
- `packages/opencode/src/kilocode/soul.txt` (+13, -0)
- `packages/opencode/src/kilocode/suggestion/index.ts` (+190, -0)
- `packages/opencode/src/kilocode/suggestion/routes.ts` (+100, -0)
- `packages/opencode/src/kilocode/suggestion/tool.ts` (+111, -0)
- `packages/opencode/src/kilocode/suggestion/tool.txt` (+20, -0)
- `packages/opencode/src/kilocode/suggestion/tui/prompt.tsx` (+173, -0)
- `packages/opencode/src/kilocode/suggestion/tui/render.tsx` (+64, -0)
- `packages/opencode/src/kilocode/suggestion/tui/sync.ts` (+58, -0)
- `packages/opencode/src/lsp/index.ts` (+13, -34)
- `packages/opencode/src/mcp/auth.ts` (+3, -32)
- `packages/opencode/src/mcp/index.ts` (+65, -50)
- `packages/opencode/src/mcp/oauth-provider.ts` (+35, -29)
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+29, -11)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+4, -2)
- `packages/opencode/src/plugin/index.ts` (+32, -30)
- `packages/opencode/src/project/bootstrap.ts` (+21, -17)
- `packages/opencode/src/project/instance.ts` (+46, -31)
- `packages/opencode/src/project/project.ts` (+11, -36)
- `packages/opencode/src/project/schema.ts` (+1, -2)
- `packages/opencode/src/project/state.ts` (+0, -92)
- `packages/opencode/src/project/vcs.ts` (+8, -20)
- `packages/opencode/src/provider/auth.ts` (+16, -34)
- `packages/opencode/src/provider/models-snapshot.ts` (+0, -66215)
- `packages/opencode/src/provider/provider.ts` (+103, -100)
- `packages/opencode/src/provider/schema.ts` (+12, -14)
- `packages/opencode/src/provider/transform.ts` (+25, -7)
- `packages/opencode/src/pty/index.ts` (+6, -36)
- `packages/opencode/src/pty/schema.ts` (+1, -2)
- `packages/opencode/src/question/index.ts` (+114, -93)
- `packages/opencode/src/question/schema.ts` (+1, -5)
- `packages/opencode/src/server/adapter.bun.ts` (+40, -0)
- `packages/opencode/src/server/adapter.node.ts` (+66, -0)
- `packages/opencode/src/server/adapter.ts` (+21, -0)
- `packages/opencode/src/server/control/index.ts` (+165, -0)
- `packages/opencode/src/server/{routes => instance}/config.ts` (+10, -3)
- `packages/opencode/src/server/{routes => instance}/enhance-prompt.ts` (+0, -0)
- `packages/opencode/src/server/{routes => instance}/event.ts` (+7, -1)
- `packages/opencode/src/server/{routes => instance}/experimental.ts` (+75, -29)
- `packages/opencode/src/server/{routes => instance}/file.ts` (+33, -20)
- `packages/opencode/src/server/{routes => instance}/global.ts` (+41, -67)
- `packages/opencode/src/server/instance/httpapi/index.ts` (+7, -0)
- `packages/opencode/src/server/instance/httpapi/question.ts` (+99, -0)
- `packages/opencode/src/server/{instance.ts => instance/index.ts}` (+58, -95)
- `packages/opencode/src/server/{routes => instance}/kilocode.ts` (+0, -0)
- `packages/opencode/src/server/{routes => instance}/mcp.ts` (+34, -14)
- `packages/opencode/src/server/{router.ts => instance/middleware.ts}` (+53, -23)
- `packages/opencode/src/server/{routes => instance}/network.ts` (+0, -0)
- `packages/opencode/src/server/{routes => instance}/permission.ts` (+20, -11)
- `packages/opencode/src/server/{routes => instance}/project.ts` (+6, -6)
- `packages/opencode/src/server/{routes => instance}/provider.ts` (+55, -36)
- `packages/opencode/src/server/{routes => instance}/pty.ts` (+56, -8)
- `packages/opencode/src/server/{routes => instance}/question.ts` (+19, -8)
- `packages/opencode/src/server/{routes => instance}/remote.ts` (+0, -0)
- `packages/opencode/src/server/{routes => instance}/session.ts` (+157, -91)
- `packages/opencode/src/server/instance/suggestion.ts` (+2, -0)
- `packages/opencode/src/server/{routes => instance}/telemetry.ts` (+0, -0)
- `packages/opencode/src/server/{routes => instance}/tui.ts` (+2, -1)
- `packages/opencode/src/server/{routes => instance}/workspace.ts` (+50, -0)
- `packages/opencode/src/server/middleware.ts` (+89, -23)
- `packages/opencode/src/server/server.ts` (+29, -284)
- `packages/opencode/src/server/ui/index.ts` (+45, -0)
- `packages/opencode/src/session/compaction.ts` (+56, -61)
- `packages/opencode/src/session/index.ts` (+104, -97)
- `packages/opencode/src/session/instruction.ts` (+2, -17)
- `packages/opencode/src/session/llm.ts` (+384, -342)
- `packages/opencode/src/session/message-v2.ts` (+5, -2)
- `packages/opencode/src/session/network.ts` (+28, -6)
- `packages/opencode/src/session/processor.ts` (+41, -26)
- `packages/opencode/src/session/projectors.ts` (+4, -3)
- `packages/opencode/src/session/prompt.ts` (+193, -184)
- `packages/opencode/src/session/prompt/codex.txt` (+1, -0)
- `packages/opencode/src/session/prompt/gpt.txt` (+1, -0)
- `packages/opencode/src/session/revert.ts` (+10, -28)
- `packages/opencode/src/session/run-state.ts` (+2, -14)
- `packages/opencode/src/session/schema.ts` (+3, -6)
- `packages/opencode/src/session/session.sql.ts` (+20, -0)
- `packages/opencode/src/session/status.ts` (+8, -14)
- `packages/opencode/src/session/summary.ts` (+13, -19)
- `packages/opencode/src/session/system.ts` (+47, -41)
- `packages/opencode/src/session/todo.ts` (+2, -14)
- `packages/opencode/src/share/session.ts` (+59, -0)
- `packages/opencode/src/share/share-next.ts` (+7, -26)
- `packages/opencode/src/skill/discovery.ts` (+2, -2)
- `packages/opencode/src/skill/index.ts` (+11, -22)
- `packages/opencode/src/snapshot/index.ts` (+109, -42)
- `packages/opencode/src/storage/db.ts` (+4, -4)
- `packages/opencode/src/storage/storage.ts` (+22, -32)
- `packages/opencode/src/suggestion/index.ts` (+2, -0)
- `packages/opencode/src/sync/index.ts` (+35, -34)
- `packages/opencode/src/sync/schema.ts` (+1, -2)
- `packages/opencode/src/util/{context.ts => local-context.ts}` (+1, -1)
- `packages/opencode/src/util/log.ts` (+13, -8)
- `packages/opencode/src/util/schema.ts` (+5, -5)
- `packages/opencode/src/v2/session-common.ts` (+1, -0)
- `packages/opencode/src/v2/session-entry.ts` (+317, -0)
- `packages/opencode/src/v2/session-event.ts` (+443, -0)
- `packages/opencode/src/v2/session.ts` (+71, -0)
- `packages/opencode/src/worktree/index.ts` (+16, -28)
- `packages/opencode/test/AGENTS.md` (+52, -0)
- `packages/opencode/test/acp/event-subscription.test.ts` (+40, -0)
- `packages/opencode/test/auth/auth.test.ts` (+80, -52)
- `packages/opencode/test/cli/install-artifact.test.ts` (+1, -1)
- `packages/opencode/test/cli/tui/plugin-loader.test.ts` (+0, -5)
- `packages/opencode/test/cli/tui/sync-provider.test.tsx` (+295, -0)
- `packages/opencode/test/cli/tui/use-event.test.tsx` (+175, -0)
- `packages/opencode/test/config/agent-color.test.ts` (+9, -3)
- `packages/opencode/test/config/config.test.ts` (+221, -186)
- `packages/opencode/test/config/tui.test.ts` (+6, -3)
- `packages/opencode/test/control-plane/adaptors.test.ts` (+71, -0)
- `packages/opencode/test/effect/app-runtime-logger.test.ts` (+61, -0)
- `packages/opencode/test/effect/instance-state.test.ts` (+7, -7)
- `packages/opencode/test/effect/run-service.test.ts` (+4, -4)
- `packages/opencode/test/file/fsmonitor.test.ts` (+9, -3)
- `packages/opencode/test/file/index.test.ts` (+88, -78)
- `packages/opencode/test/file/path-traversal.test.ts` (+14, -8)
- `packages/opencode/test/file/ripgrep.test.ts` (+217, -14)
- `packages/opencode/test/file/time.test.ts` (+371, -394)
- `packages/opencode/test/file/watcher.test.ts` (+2, -0)
- `packages/opencode/test/fixture/fixture.ts` (+2, -2)
- `packages/opencode/test/fixture/tui-plugin.ts` (+1, -6)
- `packages/opencode/test/format/format.test.ts` (+40, -0)
- `packages/opencode/test/installation/installation.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/bash-permission-metadata.test.ts` (+64, -0)
- `packages/opencode/test/kilocode/config-gitignore.test.ts` (+2, -1)
- `packages/opencode/test/kilocode/local-model.test.ts` (+130, -2)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+97, -52)
- `packages/opencode/test/kilocode/prompt-dismiss-contract.test.ts` (+35, -0)
- `packages/opencode/test/kilocode/read-directory.test.ts` (+118, -0)
- `packages/opencode/test/kilocode/ripgrep-stream.test.ts` (+18, -0)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+5, -2)
- `packages/opencode/test/kilocode/session-processor-network-offline.test.ts` (+5, -2)
- `packages/opencode/test/kilocode/session-processor-retry-limit.test.ts` (+5, -2)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+67, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+98, -0)
- `packages/opencode/test/kilocode/suggestion/suggestion.test.ts` (+145, -0)
- `packages/opencode/test/kilocode/suggestion/tool.test.ts` (+187, -0)
- `packages/opencode/test/kilocode/transform-opus-4.7.test.ts` (+89, -0)
- `packages/opencode/test/lib/llm-server.ts` (+2, -2)
- `packages/opencode/test/lsp/index.test.ts` (+52, -52)
- `packages/opencode/test/lsp/lifecycle.test.ts` (+97, -92)
- `packages/opencode/test/mcp/headers.test.ts` (+45, -20)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+330, -296)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+91, -8)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+22, -3)
- `packages/opencode/test/memory/abort-leak-webfetch.ts` (+49, -0)
- `packages/opencode/test/memory/abort-leak.test.ts` (+38, -44)
- `packages/opencode/test/permission-task.test.ts` (+9, -6)
- `packages/opencode/test/plugin/auth-override.test.ts` (+7, -2)
- `packages/opencode/test/plugin/github-copilot-models.test.ts` (+46, -0)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+96, -63)
- `packages/opencode/test/plugin/trigger.test.ts` (+33, -28)
- `packages/opencode/test/plugin/workspace-adaptor.test.ts` (+102, -0)
- `packages/opencode/test/project/migrate-global.test.ts` (+18, -8)
- `packages/opencode/test/project/project.test.ts` (+84, -69)
- `packages/opencode/test/project/state.test.ts` (+0, -115)
- `packages/opencode/test/project/vcs.test.ts` (+70, -12)
- `packages/opencode/test/project/worktree-remove.test.ts` (+119, -89)
- `packages/opencode/test/project/worktree.test.ts` (+169, -128)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+21, -10)
- `packages/opencode/test/provider/gitlab-duo.test.ts` (+18, -18)
- `packages/opencode/test/provider/provider.test.ts` (+238, -77)
- `packages/opencode/test/provider/transform.test.ts` (+62, -0)
- `packages/opencode/test/pty/pty-output-isolation.test.ts` (+115, -110)
- `packages/opencode/test/pty/pty-session.test.ts` (+54, -44)
- `packages/opencode/test/pty/pty-shell.test.ts` (+26, -16)
- `packages/opencode/test/question/question.test.ts` (+91, -52)
- `packages/opencode/test/server/global-session-list.test.ts` (+41, -23)
- `packages/opencode/test/server/project-init-git.test.ts` (+10, -8)
- `packages/opencode/test/server/question-httpapi.test.ts` (+78, -0)
- `packages/opencode/test/server/session-actions.test.ts` (+22, -57)
- `packages/opencode/test/server/session-list.test.ts` (+29, -17)
- `packages/opencode/test/server/session-messages.test.ts` (+33, -12)
- `packages/opencode/test/server/session-select.test.ts` (+19, -3)
- `packages/opencode/test/session/compaction.test.ts` (+554, -216)
- `packages/opencode/test/session/instruction.test.ts` (+172, -71)
- `packages/opencode/test/session/llm.test.ts` (+31, -114)
- `packages/opencode/test/session/messages-pagination.test.ts` (+112, -91)
- `packages/opencode/test/session/processor-effect.test.ts` (+14, -1)
- `packages/opencode/test/session/prompt-effect.test.ts` (+127, -70)
- `packages/opencode/test/session/prompt.test.ts` (+283, -215)
- `packages/opencode/test/session/retry.test.ts` (+12, -7)
- `packages/opencode/test/session/revert-compact.test.ts` (+558, -540)
- `packages/opencode/test/session/session-entry.test.ts` (+624, -0)
- `packages/opencode/test/session/session.test.ts` (+65, -26)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+23, -6)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+191, -160)
- `packages/opencode/test/session/system.test.ts` (+14, -4)
- `packages/opencode/test/share/share-next.test.ts` (+2, -1)
- `packages/opencode/test/skill/skill.test.ts` (+278, -276)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+281, -147)
- `packages/opencode/test/storage/storage.test.ts` (+228, -230)
- `packages/opencode/test/suggestion/suggestion.test.ts` (+2, -0)
- `packages/opencode/test/util/log.test.ts` (+44, -0)
- `packages/plugin/package.json` (+6, -5)
- `packages/plugin/src/example-workspace.ts` (+34, -0)
- `packages/plugin/src/index.ts` (+51, -0)
- `packages/plugin/src/tool.ts` (+2, -1)
- `packages/plugin/src/tui.ts` (+0, -4)
- `packages/plugin/tsconfig.json` (+1, -0)
- `packages/script/package.json` (+1, -1)
- `packages/script/src/index.ts` (+3, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/client.ts` (+8, -2)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+184, -20)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+437, -148)
- `packages/sdk/openapi.json` (+1347, -580)
- `packages/server/package.json` (+24, -0)
- `packages/server/src/api/index.ts` (+1, -0)
- `packages/server/src/definition/api.ts` (+6, -0)
- `packages/server/src/definition/index.ts` (+1, -0)
- `packages/server/src/index.ts` (+3, -0)
- `packages/server/src/openapi.ts` (+14, -0)
- `packages/server/src/types.ts` (+14, -0)
- `packages/server/tsconfig.json` (+15, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/markdown.tsx` (+39, -5)
- `packages/ui/src/components/message-part.tsx` (+4, -0)
- `packages/ui/src/components/session-diff.ts` (+42, -19)
- `packages/ui/src/context/marked.tsx` (+10, -21)
- `packages/ui/src/i18n/ar.ts` (+2, -0)
- `packages/ui/src/i18n/br.ts` (+2, -0)
- `packages/ui/src/i18n/bs.ts` (+2, -0)
- `packages/ui/src/i18n/da.ts` (+2, -0)
- `packages/ui/src/i18n/de.ts` (+2, -0)
- `packages/ui/src/i18n/en.ts` (+2, -0)
- `packages/ui/src/i18n/es.ts` (+2, -0)
- `packages/ui/src/i18n/fr.ts` (+2, -0)
- `packages/ui/src/i18n/ja.ts` (+2, -0)
- `packages/ui/src/i18n/ko.ts` (+2, -0)
- `packages/ui/src/i18n/nl.ts` (+2, -0)
- `packages/ui/src/i18n/no.ts` (+2, -0)
- `packages/ui/src/i18n/pl.ts` (+2, -0)
- `packages/ui/src/i18n/ru.ts` (+2, -0)
- `packages/ui/src/i18n/th.ts` (+2, -0)
- `packages/ui/src/i18n/tr.ts` (+2, -0)
- `packages/ui/src/i18n/uk.ts` (+2, -0)
- `packages/ui/src/i18n/zh.ts` (+2, -0)
- `packages/ui/src/i18n/zht.ts` (+2, -0)
- `packages/ui/src/kilocode/markdown-fast-path.ts` (+29, -0)
- `packages/util/package.json` (+1, -1)
- `patches/install-korean-ime-fix.sh` (+120, -0)
- `script/changelog-github.cjs` (+2, -0)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)
- `specs/v2/session.md` (+17, -0)

### Key Diffs

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index d967031ed..bef34fc5c 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -9,6 +9,7 @@ import { Auth } from "../auth"
 import { ProviderTransform } from "../provider/transform"
 
 import PROMPT_GENERATE from "./generate.txt"
+import { makeRuntime } from "@/effect/run-service" // kilocode_change
 import PROMPT_COMPACTION from "./prompt/compaction.txt"
 import PROMPT_EXPLORE from "./prompt/explore.txt"
 import PROMPT_SUMMARY from "./prompt/summary.txt"
@@ -20,9 +21,8 @@ import { KilocodePaths } from "@/kilocode/paths" // kilocode_change
 import path from "path" // kilocode_change
 import { Plugin } from "@/plugin"
 import { Skill } from "../skill"
-import { Effect, ServiceMap, Layer } from "effect"
+import { Effect, Context, Layer } from "effect"
 import { InstanceState } from "@/effect/instance-state"
-import { makeRuntime } from "@/effect/run-service"
 import * as KiloAgent from "@/kilocode/agent" // kilocode_change
 
 export namespace Agent {
@@ -71,13 +71,14 @@ export namespace Agent {
 
   type State = Omit<Interface, "generate">
 
-  export class Service extends ServiceMap.Service<Service, Interface>()("@opencode/Agent") {}
+  export class Service extends Context.Service<Service, Interface>()("@opencode/Agent") {}
 
   export const layer = Layer.effect(
     Service,
     Effect.gen(function* () {
       const config = yield* Config.Service
       const auth = yield* Auth.Service
+      const plugin = yield* Plugin.Service
       const skill = yield* Skill.Service
       const provider = yield* Provider.Service
 
@@ -102,6 +103,7 @@ export namespace Agent {
               "*": "ask",
               ...Object.fromEntries(whitelistedDirs.map((dir) => [dir, "allow"])),
             },
+            suggest: "deny", // kilocode_change
             question: "deny",
             plan_enter: "deny",
             plan_exit: "deny",
@@ -130,6 +132,7 @@ export namespace Agent {
                 defaults,
                 Permission.fromConfig({
```

#### packages/opencode/src/bus/bus-event.ts
```diff
diff --git a/packages/opencode/src/bus/bus-event.ts b/packages/opencode/src/bus/bus-event.ts
index d97922290..aad5f398e 100644
--- a/packages/opencode/src/bus/bus-event.ts
+++ b/packages/opencode/src/bus/bus-event.ts
@@ -16,25 +16,18 @@ export namespace BusEvent {
   }
 
   export function payloads() {
-    return z
-      .discriminatedUnion(
-        "type",
-        registry
-          .entries()
-          .map(([type, def]) => {
-            return z
-              .object({
-                type: z.literal(type),
-                properties: def.properties,
-              })
-              .meta({
-                ref: "Event" + "." + def.type,
-              })
+    return registry
+      .entries()
+      .map(([type, def]) => {
+        return z
+          .object({
+            type: z.literal(type),
+            properties: def.properties,
+          })
+          .meta({
+            ref: "Event" + "." + def.type,
           })
-          .toArray() as any,
-      )
-      .meta({
-        ref: "Event",
       })
+      .toArray()
   }
 }
```

#### packages/opencode/src/bus/global.ts
```diff
diff --git a/packages/opencode/src/bus/global.ts b/packages/opencode/src/bus/global.ts
index dc23020d2..f759e38e3 100644
--- a/packages/opencode/src/bus/global.ts
+++ b/packages/opencode/src/bus/global.ts
@@ -4,6 +4,8 @@ export const GlobalBus = new EventEmitter<{
   event: [
     {
       directory?: string
+      project?: string
+      workspace?: string
       payload: any
     },
   ]
```

#### packages/opencode/src/bus/index.ts
```diff
diff --git a/packages/opencode/src/bus/index.ts b/packages/opencode/src/bus/index.ts
index fe26a6672..0638777bd 100644
--- a/packages/opencode/src/bus/index.ts
+++ b/packages/opencode/src/bus/index.ts
@@ -1,9 +1,10 @@
 import z from "zod"
-import { Effect, Exit, Layer, PubSub, Scope, ServiceMap, Stream } from "effect"
+import { Effect, Exit, Layer, PubSub, Scope, Context, Stream } from "effect"
+import { EffectLogger } from "@/effect/logger"
 import { Log } from "../util/log"
-import { Instance } from "../project/instance"
 import { BusEvent } from "./bus-event"
 import { GlobalBus } from "./global"
+import { WorkspaceContext } from "@/control-plane/workspace-context"
 import { InstanceState } from "@/effect/instance-state"
 import { makeRuntime } from "@/effect/run-service"
 
@@ -41,7 +42,7 @@ export namespace Bus {
     readonly subscribeAllCallback: (callback: (event: any) => unknown) => Effect.Effect<() => void>
   }
 
-  export class Service extends ServiceMap.Service<Service, Interface>()("@opencode/Bus") {}
+  export class Service extends Context.Service<Service, Interface>()("@opencode/Bus") {}
 
   export const layer = Layer.effect(
     Service,
@@ -91,8 +92,13 @@ export namespace Bus {
           yield* PubSub.publish(s.wildcard, payload)
 
           const dir = yield* InstanceState.directory
+          const context = yield* InstanceState.context
+          const workspace = yield* InstanceState.workspaceID
+
           GlobalBus.emit("event", {
             directory: dir,
+            project: context.project.id,
+            workspace,
             payload,
           })
         })
@@ -141,7 +147,7 @@ export namespace Bus {
 
           return () => {
             log.info("unsubscribing", { type })
-            Effect.runFork(Scope.close(scope, Exit.void))
+            Effect.runFork(Scope.close(scope, Exit.void).pipe(Effect.provide(EffectLogger.layer)))
           }
         })
       }
@@ -164,6 +170,8 @@ export namespace Bus {
```

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index 700c6c2c4..65e96116f 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -5,6 +5,7 @@ import { Glob } from "../../util/glob"
 import { Truncate } from "../../tool/truncate"
 import { Config } from "../../config/config"
 import { Instance } from "../../project/instance"
+import { makeRuntime } from "@/effect/run-service"
 import { Global } from "@/global"
 import { Telemetry } from "@kilocode/kilo-telemetry"
 import z from "zod"
@@ -231,6 +232,7 @@ export function patchAgents(
         defaults,
         Permission.fromConfig({
           question: "allow",
+          suggest: "allow", // kilocode_change
           plan_exit: "allow",
           bash: readOnlyBash,
           ...kilo.mcpRules,
@@ -289,6 +291,7 @@ export function patchAgents(
       defaults,
       Permission.fromConfig({
         question: "allow",
+        suggest: "allow", // kilocode_change
         plan_enter: "allow",
       }),
       user,
@@ -312,6 +315,7 @@ export function patchAgents(
         glob: "allow",
         list: "allow",
         question: "allow",
+        suggest: "allow", // kilocode_change
         task: "allow",
         todoread: "allow",
         todowrite: "allow",
@@ -388,7 +392,8 @@ export const RemoveError = NamedError.create(
  */
 export async function remove(name: string) {
   const { Agent } = await import("../../agent/agent")
-  const agent = await Agent.get(name)
+  const agents = makeRuntime(Agent.Service, Agent.defaultLayer)
+  const agent = await agents.runPromise((svc) => svc.get(name))
   if (!agent) throw new RemoveError({ name, message: "agent not found" })
   if (agent.native) throw new RemoveError({ name, message: "cannot remove native agent" })
   // Prevent removal of organization-managed agents
```


*... and more files (showing first 5)*

## opencode Changes (c57c531..91468fe)

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

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/routes.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/schema.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.always-rules.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.test.ts
- `src/tool/apply_patch.test.ts` - update based on kilocode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/apply_patch.ts` - update based on kilocode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/bash.test.ts` - update based on kilocode packages/opencode/test/tool/bash.test.ts changes
- `src/tool/bash.ts` - update based on kilocode packages/opencode/src/tool/bash.ts changes
- `src/tool/codesearch.ts` - update based on kilocode packages/opencode/src/tool/codesearch.ts changes
- `src/tool/edit.test.ts` - update based on kilocode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/edit.ts` - update based on kilocode packages/opencode/src/tool/edit.ts changes
- `src/tool/external-directory.test.ts` - update based on kilocode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/external-directory.ts` - update based on kilocode packages/opencode/src/tool/external-directory.ts changes
- `src/tool/glob.test.ts` - update based on kilocode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on kilocode packages/opencode/src/tool/glob.ts changes
- `src/tool/grep.test.ts` - update based on kilocode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on kilocode packages/opencode/src/tool/grep.ts changes
- `src/tool/invalid.ts` - update based on kilocode packages/opencode/src/tool/invalid.ts changes
- `src/tool/ls.ts` - update based on kilocode packages/opencode/src/tool/ls.ts changes
- `src/tool/lsp.ts` - update based on kilocode packages/opencode/src/tool/lsp.ts changes
- `src/tool/mcp-exa.ts` - update based on kilocode packages/opencode/src/tool/mcp-exa.ts changes
- `src/tool/multiedit.ts` - update based on kilocode packages/opencode/src/tool/multiedit.ts changes
- `src/tool/plan.ts` - update based on kilocode packages/opencode/src/tool/plan.ts changes
- `src/tool/question.test.ts` - update based on kilocode packages/opencode/test/tool/question.test.ts changes
- `src/tool/question.ts` - update based on kilocode packages/opencode/src/tool/question.ts changes
- `src/tool/read-directory.ts` - update based on kilocode packages/opencode/src/kilocode/tool/read-directory.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/recall.test.ts` - update based on kilocode packages/opencode/test/tool/recall.test.ts changes
- `src/tool/recall.ts` - update based on kilocode packages/opencode/src/tool/recall.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/schema.ts` - update based on kilocode packages/opencode/src/tool/schema.ts changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on kilocode packages/opencode/src/tool/skill.ts changes
- `src/tool/suggest.test.ts` - update based on kilocode packages/opencode/test/tool/suggest.test.ts changes
- `src/tool/suggest.ts` - update based on kilocode packages/opencode/src/tool/suggest.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/todo.ts` - update based on kilocode packages/opencode/src/tool/todo.ts changes
- `src/tool/tool-define.test.ts` - update based on kilocode packages/opencode/test/tool/tool-define.test.ts changes
- `src/tool/tool.ts` - update based on kilocode packages/opencode/src/tool/tool.ts changes
- `src/tool/truncate.ts` - update based on kilocode packages/opencode/src/tool/truncate.ts changes
- `src/tool/truncation.test.ts` - update based on kilocode packages/opencode/test/tool/truncation.test.ts changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
- `src/tool/webfetch.test.ts` - update based on kilocode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/webfetch.ts` - update based on kilocode packages/opencode/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on kilocode packages/opencode/src/tool/websearch.ts changes
- `src/tool/write.test.ts` - update based on kilocode packages/opencode/test/tool/write.test.ts changes
- `src/tool/write.ts` - update based on kilocode packages/opencode/src/tool/write.ts changes
