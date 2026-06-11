# Upstream Changes Report
Generated: 2026-06-11 10:26:45

## Summary
- kilocode: 158 commits, 920 files changed
- opencode: 40 commits, 136 files changed

## kilocode Changes (c7a06d2f4..8b2a10008)

### Commits

- 8b2a10008 - fix(agent-manager): show local prompt feedback immediately (#11103) (Marius, 2026-06-11)
- 294c532f6 - fix(cli): prevent subagents asking questions (#11101) (Marius, 2026-06-11)
- 237fd1060 - Merge pull request #11097 from Kilo-Org/fix/remove-vscode-paste-summary (Marius, 2026-06-11)
- c922ca7f9 - Merge pull request #11100 from Kilo-Org/neighborly-visitor (Marius, 2026-06-11)
- 2e9d1f7b7 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-11)
- 5f7e5e8bd - fix(ui): align tool error text baselines (marius-kilocode, 2026-06-11)
- 5bc8df843 - fix(cli): cap cloud-managed shell command timeouts (#10478) (kilo-code-bot[bot], 2026-06-11)
- 5b38d299c - fix(vscode): keep HTTP status with error title (marius-kilocode, 2026-06-11)
- f31d370ea - Merge pull request #11085 from Kilo-Org/indicate-empty-model-list (Christiaan Arnoldus, 2026-06-11)
- f8ec1dc7a - fix(vscode): remove unsupported paste summary setting (marius-kilocode, 2026-06-11)
- 13fe10687 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-11)
- d52fb8003 - Merge pull request #11091 from Kilo-Org/fix/question-reply-locks (Christiaan Arnoldus, 2026-06-11)
- b16647471 - Merge branch 'main' into fix/question-reply-locks (Joshua Lambert, 2026-06-10)
- 3f9b5bed3 - Merge pull request #11051 from Kilo-Org/fix/question-custom-answer-selection (Joshua Lambert, 2026-06-10)
- f93fd619b - Merge branch 'main' into fix/question-custom-answer-selection (Joshua Lambert, 2026-06-10)
- f798faf72 - Merge branch 'main' into fix/question-reply-locks (Joshua Lambert, 2026-06-10)
- a58ec826d - chore(gateway): remove provider regression test (Josh Lambert, 2026-06-10)
- 3f9c025bb - fix(gateway): prevent duplicate streamed tool calls (Josh Lambert, 2026-06-10)
- 34f94e3b1 - fix: bump @openrouter/ai-sdk-provider to 2.9.0 (#30800) (Colin McDonnell, 2026-06-10)
- 77ad0bdd9 - Merge pull request #11094 from Kilo-Org/perf-opencode-transcript-model (Marius, 2026-06-10)
- a82394479 - style(vscode): format transcript virtualization (marius-kilocode, 2026-06-10)
- cfb24f7db - docs(vscode): describe shared transcript performance (marius-kilocode, 2026-06-10)
- 4acc1f8bc - adopt row based virtualization (marius-kilocode, 2026-06-10)
- 2aeb55934 - Merge pull request #11081 from Kilo-Org/fix/model-selector-metadata-badges (Christiaan Arnoldus, 2026-06-10)
- df0b145b3 - Merge branch 'main' into fix/model-selector-metadata-badges (Christiaan Arnoldus, 2026-06-10)
- c17588304 - fix(vscode): simplify custom answer actions (Josh Lambert, 2026-06-10)
- 57bef8ae6 - fix(vscode): prevent question reply locks (Josh Lambert, 2026-06-10)
- f180658b9 - feat(vscode): add category labels and clarify command titles in packa… (#10084) (sylwester-liljegren, 2026-06-10)
- 6addc10c3 - Merge pull request #11087 from Kilo-Org/fix-vscode-shared-session-db (Marius, 2026-06-10)
- e59f8863f - Merge pull request #11086 from Kilo-Org/necessary-open (Marius, 2026-06-10)
- 5969a4c21 - fix(vscode): restore shared session database (marius-kilocode, 2026-06-10)
- a367fa1e1 - fix(cli): scope empty model warning to provider (chrarnoldus, 2026-06-10)
- c4d5f2096 - fix(vscode): show training badge for paid models (chrarnoldus, 2026-06-10)
- 7edba0249 - Merge pull request #11082 from Kilo-Org/feat/lancedb-default (Marius, 2026-06-10)
- e7d0f9ec7 - chore: remove codesearch tool (marius-kilocode, 2026-06-10)
- 81de7502a - Merge branch 'main' into fix/model-selector-metadata-badges (Christiaan Arnoldus, 2026-06-10)
- 5d04b253b - Merge pull request #10922 from Kilo-Org/laced-secure (Catriel Müller, 2026-06-10)
- 7b54044cc - test(vscode): remove question dock browser spec (Josh Lambert, 2026-06-10)
- f6e18b766 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-10)
- a16e82a77 - feat: default semantic search to LanceDB (marius-kilocode, 2026-06-10)
- f0a997782 - refactor(vscode): clarify custom answer selection (Josh Lambert, 2026-06-10)
- 2a6596b0c - fix(cli): indicate an empty model list (chrarnoldus, 2026-06-10)
- c5ffbd1ae - chore(sdk): regenerate model metadata types (chrarnoldus, 2026-06-10)
- 9c279a16b - fix: respect model badge metadata (chrarnoldus, 2026-06-10)
- 94e8aba9f - refactor(vscode): derive custom question selection (Josh Lambert, 2026-06-10)
- 9e2994ca6 - Merge pull request #11006 from Kilo-Org/intriguing-hurricane (Marius, 2026-06-10)
- bc3af9a14 - fix(cli): avoid repeat compaction from stale totals (Catriel Müller, 2026-06-10)
- 563737587 - Merge pull request #11072 from Kilo-Org/curious-swordtail (Marius, 2026-06-10)
- 884602b4d - test(cli): normalize snapshot fixture line endings (marius-kilocode, 2026-06-10)
- a261b7e01 - chore: track local plans (#11062) (Marius, 2026-06-10)
- 69f193d3f - fix(vscode): submit selected question option (Josh Lambert, 2026-06-10)
- 856fc6665 - fix(vscode): sync custom question selection (Josh Lambert, 2026-06-10)
- 8df2f1e07 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-10)
- c1166dd56 - fix(cli): align snapshot seed with process runner (marius-kilocode, 2026-06-10)
- 69a0b384e - fix(cli): refresh connected provider models (marius-kilocode, 2026-06-10)
- 6920f37b7 - perf(cli): seed Agent Manager snapshots from worktree index (marius-kilocode, 2026-06-10)
- a17c167c0 - Merge pull request #11031 from Kilo-Org/marius-kilocode/kilo-opencode-v1.14.51 (Marius, 2026-06-10)
- a7a18b2e2 - release: v7.3.42 (kilo-maintainer[bot], 2026-06-10)
- b98fb9afd - fix(kilo-ui): preserve paused chat scroll position during non-overflow layouts (#11067) (Imanol Maiztegui, 2026-06-10)
- b2798ef41 - fix(vscode): preserve partial session updates (marius-kilocode, 2026-06-10)
- 45c4902aa - Merge pull request #11050 from Kilo-Org/tattered-echinodon (Catriel Müller, 2026-06-10)
- 339c70a94 - fix(ui): pause chat auto-scroll on upward wheel over nested content (#11065) (Imanol Maiztegui, 2026-06-10)
- 1a7cae426 - Merge pull request #11063 from Kilo-Org/chocolate-lunaria (Marius, 2026-06-10)
- 9581c6afe - Merge pull request #11064 from Kilo-Org/fix/review-prompt (Marian Alexandru Alecu, 2026-06-10)
- db7707d49 - fix(cli): allow review follow-up fixes (Alex Alecu, 2026-06-10)
- 8d248e9e3 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-10)
- 262ce0896 - chore(agent-manager): remove PR screenshot asset (marius-kilocode, 2026-06-10)
- 4446102da - feat(agent-manager): add completed session fork action (marius-kilocode, 2026-06-10)
- bbfd59b85 - fix(cli): preserve Scout code search (marius-kilocode, 2026-06-10)
- d6cde9fc4 - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.14.51 (marius-kilocode, 2026-06-10)
- 28a26b11c - fix(cli): restore TUI streaming and indexing layout (marius-kilocode, 2026-06-10)
- 8535d3d51 - fix(cli): keep Console terminals in TUI mode (Catriel Müller, 2026-06-10)
- ace77d96a - fix(cli): restore Kilo Gateway provider integration (marius-kilocode, 2026-06-09)
- dfbcbfc4f - fix(cli): use native ripgrep on Windows (marius-kilocode, 2026-06-09)
- fd6fd5023 - fix(cli): stabilize file search and event tests (marius-kilocode, 2026-06-09)
- 56c9abc6a - fix(kilo-docs): ignore DigitalOcean API base link (marius-kilocode, 2026-06-09)
- 5ccde61b3 - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.14.51 (marius-kilocode, 2026-06-09)
- 27d2c148d - fix: complete OpenCode v1.14.51 integration (marius-kilocode, 2026-06-09)
- 0e21edbca - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.14.51 (marius-kilocode, 2026-06-09)
- 1d23dc217 - resolve merge conflicts (marius-kilocode, 2026-06-09)
- f78492d73 - merge: record upstream v1.14.51 (marius-kilocode, 2026-06-09)
- 6ecaaab48 - refactor: kilo compat for v1.14.51 (marius-kilocode, 2026-06-09)
- a462b1c10 - release: v1.14.51 (opencode, 2026-05-15)
- e62ebd8fe - chore: generate (opencode-agent[bot], 2026-05-15)
- 195f59264 - refactor(server): simplify listener lifecycle (#27413) (Kit Langton, 2026-05-15)
- 78769010a - chore: generate (opencode-agent[bot], 2026-05-14)
- 4e143e3a3 - test(lib): promote pollWithTimeout/awaitWithTimeout helpers (#27626) (Kit Langton, 2026-05-14)
- dab567aa2 - chore: generate (opencode-agent[bot], 2026-05-14)
- 9d35b04e1 - test(acp): replace fixed sleeps with pollUntil in event-subscription (#27624) (Kit Langton, 2026-05-14)
- 273ab5694 - test(bus): fix flaky subscriber races with readiness latch (#27625) (Kit Langton, 2026-05-14)
- 302ba0ca0 - test(session): de-flake shell-cancel tests by waiting for busy state (#27622) (Kit Langton, 2026-05-14)
- d35e09f1f - test(workspace): use runtime flags in workspace tests (#27612) (Shoubhit Dash, 2026-05-15)
- fc34c7456 - refactor(flags): move channel db flag to runtime flags (#27615) (Shoubhit Dash, 2026-05-15)
- cb4f5cdea - refactor(flags): move auto share to runtime flags (#27611) (Shoubhit Dash, 2026-05-15)
- d34a0194e - feat(provider): add NVIDIA endpoints origin header (#27394) (nv-kasikritc, 2026-05-14)
- 43310f4d8 - refactor(flags): move embedded web ui flag to runtime flags (#27613) (Shoubhit Dash, 2026-05-15)
- e22cfa435 - refactor(lsp): move ty flag to runtime flags (#27610) (Shoubhit Dash, 2026-05-15)
- 93b1ccc02 - chore: generate (opencode-agent[bot], 2026-05-14)
- faca2b90c - refactor(flags): migrate icon discovery runtime flag (#27609) (Shoubhit Dash, 2026-05-15)
- 76ff18afd - refactor(format): move oxfmt flag to runtime flags (#27608) (Shoubhit Dash, 2026-05-15)
- 9914c9af1 - chore: generate (opencode-agent[bot], 2026-05-14)
- f202226bb - refactor(flags): move bash timeout to runtime flags (#27607) (Shoubhit Dash, 2026-05-15)
- 34198f422 - refactor(provider): use runtime flag for experimental models (#27606) (Shoubhit Dash, 2026-05-15)
- cccdeef29 - refactor(flags): migrate claude code skills flag to RuntimeFlags (#27605) (Shoubhit Dash, 2026-05-15)
- 83c145f88 - fix(plugin): scope digitalocean oauth to genai (#27599) (Musa, 2026-05-14)
- d353a6bc2 - fix(worktree): accept missing create payload (#27582) (Kit Langton, 2026-05-14)
- d25cc42d2 - docs(app): stale reference to removed multi-edit tool (#27579) (bo-tato, 2026-05-14)
- 6039b894c - chore: generate (opencode-agent[bot], 2026-05-14)
- b4fc5ef07 - refactor(http-recorder): tighten cassette safety, fix WS leaks + docs (#26730) (Kit Langton, 2026-05-14)
- f6c8e3538 - chore: generate (opencode-agent[bot], 2026-05-14)
- 94564f358 - fix(session): prevent double auto-compaction from filterCompacted reorder (#27545) (Kit Langton, 2026-05-14)
- 855bda838 - test(question): wait on question events (#27124) (Kit Langton, 2026-05-14)
- 756488d53 - chore: generate (opencode-agent[bot], 2026-05-14)
- 22de34c4d - feat: add experimental background subagents (#27084) (Shoubhit Dash, 2026-05-14)
- bdb0c16a9 - chore: update web stats (Adam, 2026-05-14)
- 7f7eb2e7f - fix(provider): remove LiteLLM workarounds ported upstream, requires LiteLLM v1.85.0-rc.2+ (#26819) (Sameer Kankute, 2026-05-14)
- e15fd0bb9 - chore: generate (opencode-agent[bot], 2026-05-14)
- 8f90697df - chore: generate (opencode-agent[bot], 2026-05-14)
- 17af25d1c - chore: generate (opencode-agent[bot], 2026-05-14)
- 3c81326a5 - docs(effect): refresh TODO with shipped P0 and RF work (#27536) (Kit Langton, 2026-05-14)
- 9f8d8f5b0 - chore: generate (opencode-agent[bot], 2026-05-14)
- 337993d53 - feat(desktop): add mcp client registration status and authentication handling (#27525) (OpeOginni, 2026-05-14)
- e26abd8da - fix(tool): close shell truncation stream (#27517) (Shoubhit Dash, 2026-05-14)
- 8c1ce0b80 - refactor(flags): simplify tui plugin runtime flags (#27506) (Shoubhit Dash, 2026-05-14)
- f8c3f560d - fix(desktop): await execFilePromise and read stdout properly (#27499) (Brendan Allan, 2026-05-14)
- 7e43d3e3f - refactor(lsp): type initialize errors (#27494) (Shoubhit Dash, 2026-05-14)
- 52db7a76e - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-14)
- be6e7b309 - refactor(provider): type init errors (#27484) (Shoubhit Dash, 2026-05-14)
- 0af242974 - deps: Upgrade OpenTUI to 0.2.10 (#27491) (Simon Klee, 2026-05-14)
- 27ac53aaa - fix(server): stop exposing named defects (#27471) (Shoubhit Dash, 2026-05-14)
- 78015571b - refactor(server): centralize session busy mapping (#27473) (Shoubhit Dash, 2026-05-14)
- e76cf967e - fix(session): finalize interrupted assistant messages (#27254) (Aiden Cline, 2026-05-14)
- c2723b5ea - chore: generate (opencode-agent[bot], 2026-05-14)
- 967557979 - fix: bug encountered when using azure gpt-5.5 w/ completions api (#26222) (Frederik, 2026-05-13)
- 4d8368970 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-14)
- 2a7af6acd - fix(tui): preserve text selection on question prompt options (#24988) (Nikhil Patel, 2026-05-13)
- bfd707abc - chore: generate (opencode-agent[bot], 2026-05-14)
- 981e00971 - fix: image resizer wasm loading, reenable image resizing (#26805) (Aiden Cline, 2026-05-13)
- c50d2b365 - Refactor event HTTP API route modules (#27441) (Aiden Cline, 2026-05-13)
- ddad0988e - sync release versions for v1.14.50 (opencode, 2026-05-14)
- cda8cc728 - test(httpapi): simplify event stream regression coverage (#27427) (Kit Langton, 2026-05-14)
- b928a1fff - fix(httpapi): preserve event stream context (#27425) (Kit Langton, 2026-05-13)
- 04286d041 - docs(effect): plan Instance deletion path (#27424) (Kit Langton, 2026-05-13)
- 33bb33ba9 - chore: generate (opencode-agent[bot], 2026-05-14)
- b0ade4026 - flip back to markdown renderable (#27421) (Sebastian, 2026-05-14)
- 681594b55 - refactor(storage): remove not found wire serializer (#27416) (Kit Langton, 2026-05-13)
- edf764940 - fix(session): type busy errors (#27410) (Kit Langton, 2026-05-14)
- 3fc7486d1 - test(session): fix shell-cancel race when trap hasn't installed yet (#27408) (Kit Langton, 2026-05-14)
- 8e353584c - test(format): remove formatter check sleeps (#27407) (Kit Langton, 2026-05-13)
- 5c35ea218 - notification docs (#27406) (Sebastian, 2026-05-14)
- faf871305 - chore: generate (opencode-agent[bot], 2026-05-14)
- 16c457e71 - refactor(core): move models.dev into core (#27347) (Dax, 2026-05-13)
- 9818c9e8d - fix(provider): make small model fallback optional (#27405) (Kit Langton, 2026-05-14)
- 5e41dbbcb - test(effect): use Effect sleep in instance state tests (#27404) (Kit Langton, 2026-05-13)
- ba5c8d382 - fix(llm): preserve tool error defects (#27403) (Kit Langton, 2026-05-13)
- 10c90eb44 - chore: generate (opencode-agent[bot], 2026-05-14)
- aa8a41d1b - effect(patch,tool): migrate patch/index and tool/read to AppFileSystem (#27155) (Kit Langton, 2026-05-13)
- 3f33be192 - effect(server): typed errors in session/sync handlers, fix concurrency (#27146) (Kit Langton, 2026-05-13)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/code-interpreter.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/file-search.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/image-generation.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/local-shell.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/web-search-preview.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/web-search.ts` (+0, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+1, -3)
- `packages/opencode/src/kilocode/tool/task.ts` (+13, -4)
- `packages/opencode/src/tool/apply_patch.ts` (+5, -2)
- `packages/opencode/src/tool/codesearch.ts` (+0, -63)
- `packages/opencode/src/tool/codesearch.txt` (+0, -12)
- `packages/opencode/src/tool/grep.ts` (+11, -10)
- `packages/opencode/src/tool/json-schema.ts` (+164, -0)
- `packages/opencode/src/tool/mcp-websearch.ts` (+0, -5)
- `packages/opencode/src/tool/read.ts` (+33, -30)
- `packages/opencode/src/tool/registry.ts` (+85, -22)
- `packages/opencode/src/tool/schema.ts` (+0, -2)
- `packages/opencode/src/tool/shell.ts` (+36, -16)
- `packages/opencode/src/tool/task.ts` (+228, -47)
- `packages/opencode/src/tool/task.txt` (+5, -4)
- `packages/opencode/src/tool/task_status.ts` (+186, -0)
- `packages/opencode/src/tool/task_status.txt` (+13, -0)
- `packages/opencode/src/tool/tool.ts` (+2, -0)
- `packages/opencode/src/tool/webfetch.ts` (+24, -31)
- `packages/opencode/src/tool/websearch.ts` (+7, -6)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+19, -9)
- `packages/opencode/test/tool/apply_patch.test.ts` (+407, -489)
- `packages/opencode/test/tool/edit.test.ts` (+443, -665)
- `packages/opencode/test/tool/external-directory.test.ts` (+105, -118)
- `packages/opencode/test/tool/fixtures/models-api.json` (+101065, -48945)
- `packages/opencode/test/tool/grep.test.ts` (+53, -0)
- `packages/opencode/test/tool/parameters.test.ts` (+39, -3)
- `packages/opencode/test/tool/question.test.ts` (+14, -3)
- `packages/opencode/test/tool/read.test.ts` (+50, -53)
- `packages/opencode/test/tool/registry.test.ts` (+216, -95)
- `packages/opencode/test/tool/shell.test.ts` (+801, -863)
- `packages/opencode/test/tool/task.test.ts` (+402, -7)
- `packages/opencode/test/tool/task_status.test.ts` (+124, -0)
- `packages/opencode/test/tool/tool-define.test.ts` (+62, -57)
- `packages/opencode/test/tool/truncation.test.ts` (+14, -6)
- `packages/opencode/test/tool/webfetch.test.ts` (+69, -112)
- `packages/opencode/test/tool/websearch.test.ts` (+19, -11)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+42, -28)
- `packages/opencode/src/agent/subagent-permissions.ts` (+5, -4)
- `packages/opencode/src/kilocode/agent/index.ts` (+5, -12)
- `packages/opencode/test/agent/agent.test.ts` (+517, -845)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+150, -79)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+33, -1)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+10, -28)
- `packages/opencode/src/permission/schema.ts` (+0, -3)
- `packages/opencode/test/kilocode/permission/external-directory-allow.test.ts` (+2, -0)
- `packages/opencode/test/permission/next.test.ts` (+260, -362)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/test/bus/bus-effect.test.ts` (+62, -12)
- `packages/opencode/test/bus/bus-integration.test.ts` (+67, -66)
- `packages/opencode/test/bus/bus.test.ts` (+185, -164)

#### Core (**/core/)
- `packages/core/package.json` (+30, -2)
- `packages/core/src/aisdk.ts` (+172, -0)
- `packages/core/src/catalog.ts` (+260, -0)
- `packages/core/src/effect-zod.ts` (+1, -1)
- `packages/core/src/flag/flag.ts` (+2, -10)
- `packages/core/src/instance-layer.ts` (+12, -0)
- `packages/core/src/instance.ts` (+10, -0)
- `packages/core/src/kilocode/models-refresh.ts` (+15, -0)
- `packages/core/src/model.ts` (+116, -0)
- `packages/core/src/models-snapshot.d.ts` (+2, -0)
- `packages/core/src/models-snapshot.js` (+71726, -0)
- `packages/core/src/models.ts` (+235, -0)
- `packages/core/src/plugin.ts` (+146, -0)
- `packages/core/src/plugin/auth.ts` (+30, -0)
- `packages/core/src/plugin/boot.ts` (+71, -0)
- `packages/core/src/plugin/env.ts` (+18, -0)
- `packages/core/src/plugin/layer-map.example.ts` (+94, -0)
- `packages/core/src/plugin/models-dev.ts` (+108, -0)
- `packages/core/src/plugin/provider.ts` (+1, -0)
- `packages/core/src/plugin/provider/alibaba.ts` (+15, -0)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+94, -0)
- `packages/core/src/plugin/provider/anthropic.ts` (+21, -0)
- `packages/core/src/plugin/provider/azure.ts` (+64, -0)
- `packages/core/src/plugin/provider/cerebras.ts` (+20, -0)
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+81, -0)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+69, -0)
- `packages/core/src/plugin/provider/cohere.ts` (+15, -0)
- `packages/core/src/plugin/provider/deepinfra.ts` (+15, -0)
- `packages/core/src/plugin/provider/dynamic.ts` (+31, -0)
- `packages/core/src/plugin/provider/gateway.ts` (+15, -0)
- `packages/core/src/plugin/provider/github-copilot.ts` (+44, -0)
- `packages/core/src/plugin/provider/gitlab.ts` (+65, -0)
- `packages/core/src/plugin/provider/google-vertex.ts` (+141, -0)
- `packages/core/src/plugin/provider/google.ts` (+15, -0)
- `packages/core/src/plugin/provider/groq.ts` (+15, -0)
- `packages/core/src/plugin/provider/index.ts` (+67, -0)
- `packages/core/src/plugin/provider/kilo.ts` (+37, -0)
- `packages/core/src/plugin/provider/llmgateway.ts` (+18, -0)
- `packages/core/src/plugin/provider/mistral.ts` (+15, -0)
- `packages/core/src/plugin/provider/nvidia.ts` (+17, -0)
- `packages/core/src/plugin/provider/openai-compatible.ts` (+17, -0)
- `packages/core/src/plugin/provider/openai.ts` (+27, -0)
- `packages/core/src/plugin/provider/opencode.ts` (+27, -0)
- `packages/core/src/plugin/provider/openrouter.ts` (+29, -0)
- `packages/core/src/plugin/provider/perplexity.ts` (+15, -0)
- `packages/core/src/plugin/provider/sap-ai-core.ts` (+44, -0)
- `packages/core/src/plugin/provider/togetherai.ts` (+15, -0)
- `packages/core/src/plugin/provider/venice.ts` (+15, -0)
- `packages/core/src/plugin/provider/vercel.ts` (+21, -0)
- `packages/core/src/plugin/provider/xai.ts` (+20, -0)
- `packages/core/src/plugin/provider/zenmux.ts` (+16, -0)
- `packages/core/src/process.ts` (+234, -0)
- `packages/core/src/provider.ts` (+120, -0)
- `packages/core/src/schema.ts` (+0, -2)
- `packages/core/src/util/error.ts` (+31, -22)
- `packages/core/src/util/log.ts` (+32, -12)
- `packages/core/test/catalog.test.ts` (+201, -0)
- `packages/core/test/plugin/fixtures/provider-factory.ts` (+9, -0)
- `packages/core/test/plugin/provider-alibaba.test.ts` (+67, -0)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+465, -0)
- `packages/core/test/plugin/provider-anthropic.test.ts` (+91, -0)
- `packages/core/test/plugin/provider-azure-cognitive-services.test.ts` (+127, -0)
- `packages/core/test/plugin/provider-azure.test.ts` (+245, -0)
- `packages/core/test/plugin/provider-cerebras.test.ts` (+102, -0)
- `packages/core/test/plugin/provider-cloudflare-ai-gateway.test.ts` (+384, -0)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+267, -0)
- `packages/core/test/plugin/provider-cohere.test.ts` (+86, -0)
- `packages/core/test/plugin/provider-deepinfra.test.ts` (+129, -0)
- `packages/core/test/plugin/provider-dynamic.test.ts` (+172, -0)
- `packages/core/test/plugin/provider-gateway.test.ts` (+87, -0)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+188, -0)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+346, -0)
- `packages/core/test/plugin/provider-google-vertex-anthropic.test.ts` (+147, -0)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+300, -0)
- `packages/core/test/plugin/provider-google.test.ts` (+70, -0)
- `packages/core/test/plugin/provider-groq.test.ts` (+101, -0)
- `packages/core/test/plugin/provider-helper.ts` (+100, -0)
- `packages/core/test/plugin/provider-kilo.test.ts` (+178, -0)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+63, -0)
- `packages/core/test/plugin/provider-mistral.test.ts` (+106, -0)
- `packages/core/test/plugin/provider-nvidia.test.ts` (+93, -0)
- `packages/core/test/plugin/provider-openai-compatible.test.ts` (+101, -0)
- `packages/core/test/plugin/provider-openai.test.ts` (+100, -0)
- `packages/core/test/plugin/provider-opencode.test.ts` (+197, -0)
- `packages/core/test/plugin/provider-openrouter.test.ts` (+105, -0)
- `packages/core/test/plugin/provider-perplexity.test.ts` (+107, -0)
- `packages/core/test/plugin/provider-sap-ai-core.test.ts` (+127, -0)
- `packages/core/test/plugin/provider-togetherai.test.ts` (+97, -0)
- `packages/core/test/plugin/provider-venice.test.ts` (+86, -0)
- `packages/core/test/plugin/provider-vercel.test.ts` (+62, -0)
- `packages/core/test/plugin/provider-xai.test.ts` (+115, -0)
- `packages/core/test/plugin/provider-zenmux.test.ts` (+103, -0)
- `packages/core/test/process/process.test.ts` (+292, -0)
- `packages/core/tsconfig.json` (+2, -1)
- `packages/kilo-indexing/src/indexing/orchestrator.ts` (+2, -1)

#### Other Changes
- `.changeset/avoid-repeat-compactions.md` (+5, -0)
- `.changeset/calm-shells-timeout.md` (+5, -0)
- `.changeset/calm-timeline-follow.md` (+0, -5)
- `.changeset/clear-empty-models.md` (+5, -0)
- `.changeset/clear-kilo-commands.md` (+5, -0)
- `.changeset/default-lancedb-search.md` (+7, -0)
- `.changeset/fast-agent-snapshots.md` (+5, -0)
- `.changeset/fast-agent-transcripts.md` (+5, -0)
- `.changeset/fix-jetbrains-reasoning.md` (+0, -5)
- `.changeset/fix-jetbrains-session-scroll.md` (+0, -5)
- `.changeset/fresh-provider-models.md` (+5, -0)
- `.changeset/gentle-canyon.md` (+0, -5)
- `.changeset/glob-jetbrains-view.md` (+0, -5)
- `.changeset/honest-model-badges.md` (+7, -0)
- `.changeset/jetbrains-session-icons.md` (+0, -5)
- `.changeset/keep-error-status-inline.md` (+5, -0)
- `.changeset/prevent-subagent-questions.md` (+6, -0)
- `.changeset/quick-local-prompts.md` (+5, -0)
- `.changeset/quiet-jetbrains-separators.md` (+0, -5)
- `.changeset/refine-jetbrains-card-borders.md` (+0, -5)
- `.changeset/relative-jetbrains-search-paths.md` (+0, -5)
- `.changeset/remove-vscode-paste-summary.md` (+5, -0)
- `.changeset/reset-jetbrains-session-hover.md` (+0, -5)
- `.changeset/restore-failed-question-replies.md` (+7, -0)
- `.changeset/restore-scout-codesearch.md` (+6, -0)
- `.changeset/restore-session-export.md` (+0, -5)
- `.changeset/search-jetbrains-view.md` (+0, -5)
- `.changeset/select-custom-question-answer.md` (+5, -0)
- `.changeset/session-patches-stay-whole.md` (+5, -0)
- `.changeset/share-vscode-session-database.md` (+5, -0)
- `.changeset/steady-tui-streams.md` (+5, -0)
- `.changeset/stellar-wolf.md` (+0, -5)
- `.changeset/sync-api-key-sessions.md` (+0, -5)
- `.github/actions/setup-bun/action.yml` (+11, -3)
- `.github/actions/setup-git-committer/action.yml` (+1, -1)
- `.github/workflows/close-issues.yml` (+1, -1)
- `.github/workflows/close-stale-prs.yml` (+1, -1)
- `.github/workflows/containers.yml` (+3, -3)
- `.github/workflows/disabled/compliance-close.yml.disabled` (+1, -1)
- `.github/workflows/disabled/notify-discord.yml.disabled` (+1, -1)
- `.github/workflows/disabled/pr-management.yml.disabled` (+2, -2)
- `.github/workflows/disabled/pr-standards.yml.disabled` (+2, -2)
- `.github/workflows/disabled/publish-github-action.yml.disabled` (+1, -1)
- `.github/workflows/disabled/release-github-action.yml.disabled` (+1, -1)
- `.github/workflows/disabled/review.yml.disabled` (+1, -1)
- `.github/workflows/disabled/stats.yml.disabled` (+1, -1)
- `.github/workflows/disabled/storybook.yml.disabled` (+1, -1)
- `.github/workflows/disabled/sync-zed-extension.yml.disabled` (+1, -1)
- `.github/workflows/nix-eval.yml` (+2, -2)
- `.github/workflows/nix-hashes.yml` (+2, -2)
- `.github/workflows/test.yml` (+2, -2)
- `.gitignore` (+0, -1)
- `.kilo/skills/release-jetbrains/script/dispatch-prepare.ts` (+3, -1)
- `.kilo/skills/release-jetbrains/script/resolve-version.ts` (+3, -1)
- `.kilo/skills/release-jetbrains/script/update-changelog.ts` (+8, -2)
- `.kilo/skills/release-jetbrains/script/watch-publish.ts` (+13, -3)
- `.opencode-version` (+1, -1)
- `.opencode/skills/improve-codebase-architecture/DEEPENING.md` (+37, -0)
- `.opencode/skills/improve-codebase-architecture/INTERFACE-DESIGN.md` (+44, -0)
- `.opencode/skills/improve-codebase-architecture/LANGUAGE.md` (+53, -0)
- `.opencode/skills/improve-codebase-architecture/SKILL.md` (+71, -0)
- `.opencode/tui.json` (+1, -1)
- `bun.lock` (+90, -105)
- `bunfig.toml` (+2, -2)
- `nix/hashes.json` (+4, -4)
- `package.json` (+10, -9)
- `packages/{opencode/src/v2 => core/src}/auth.ts` (+34, -15)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/README.md` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/convert-to-openai-compatible-chat-messages.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/get-response-metadata.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/map-openai-compatible-finish-reason.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/openai-compatible-api-types.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/openai-compatible-chat-language-model.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/openai-compatible-chat-options.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/openai-compatible-metadata-extractor.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/openai-compatible-prepare-tools.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/copilot-provider.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/openai-compatible-error.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/convert-to-openai-responses-input.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/map-openai-responses-finish-reason.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-config.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-error.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-responses-api-types.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-responses-language-model.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-responses-prepare-tools.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-responses-settings.ts` (+0, -0)
- `packages/{opencode/src/v2 => core/src}/session-prompt.ts` (+13, -0)
- `packages/{opencode/src/v2 => core/src}/tool-output.ts` (+0, -0)
- `packages/{opencode/src/v2/schema.ts => core/src/v2-schema.ts}` (+1, -1)
- `packages/{opencode/test/provider/copilot => core/test/github-copilot}/convert-to-copilot-messages.test.ts` (+1, -1)
- `packages/{opencode/test/provider/copilot => core/test/github-copilot}/copilot-chat-model.test.ts` (+1, -1)
- `packages/{opencode/test/util => core/test/kilocode}/effect-zod.test.ts` (+1, -1)
- `packages/{opencode/test/provider => core/test}/models.test.ts` (+13, -18)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/README.md` (+22, -28)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/http-recorder/src/cassette.ts` (+32, -20)
- `packages/http-recorder/src/effect.ts` (+9, -11)
- `packages/http-recorder/src/index.ts` (+1, -2)
- `packages/http-recorder/src/matching.ts` (+1, -19)
- `packages/http-recorder/src/recorder.ts` (+6, -31)
- `packages/http-recorder/src/redaction.ts` (+2, -2)
- `packages/http-recorder/src/websocket.ts` (+17, -16)
- `packages/http-recorder/sst-env.d.ts` (+1, -1)
- `packages/http-recorder/test/record-replay.test.ts` (+121, -32)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/lychee.toml` (+1, -0)
- `packages/kilo-docs/markdoc/nodes/heading.markdoc.ts` (+1, -6)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/how-tools-work.md` (+2, -3)
- `packages/kilo-docs/pages/automate/tools/index.md` (+1, -2)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+11, -0)
- `packages/kilo-docs/pages/customize/context/codebase-indexing.md` (+12, -11)
- `packages/kilo-docs/pages/customize/custom-modes.md` (+2, -2)
- `packages/kilo-docs/pages/getting-started/settings/auto-approving-actions.md` (+2, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-agent-manager-completed-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-subagent-to-queued-user-spacing-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-tool-to-queued-user-spacing-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/tool-errors-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/tool-errors-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-kilo-catalog-loading-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+8, -14)
- `packages/kilo-gateway/package.json` (+2, -2)
- `packages/kilo-gateway/src/api/models.ts` (+2, -0)
- `packages/kilo-gateway/test/api/models.test.ts` (+6, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-indexing/src/config.ts` (+6, -3)
- `packages/kilo-indexing/src/indexing/config-manager.ts` (+5, -5)
- `packages/kilo-indexing/src/indexing/constants/index.ts` (+2, -0)
- `packages/kilo-indexing/src/indexing/manager.ts` (+2, -2)
- `packages/kilo-indexing/src/indexing/service-factory.ts` (+2, -1)
- `packages/kilo-indexing/test/kilocode/indexing/config-manager.test.ts` (+14, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+20, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.css` (+31, -7)
- `packages/kilo-ui/src/components/message-part.tsx` (+13, -2)
- `packages/kilo-ui/src/hooks/auto-scroll.ts` (+0, -6)
- `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` (+186, -0)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+15, -34)
- `packages/kilo-vscode/CHANGELOG.md` (+21, -0)
- `packages/kilo-vscode/package.json` (+10, -2)
- `packages/kilo-vscode/src/KiloProvider.ts` (+185, -12)
- `packages/kilo-vscode/src/MarketplacePanelProvider.ts` (+5, -4)
- `packages/kilo-vscode/src/commands/toggle-auto-approve.ts` (+2, -2)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+162, -72)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+5, -5)
- `packages/kilo-vscode/src/services/cli-backend/connection-utils.ts` (+33, -38)
- `packages/kilo-vscode/src/services/cli-backend/sdk-sse-adapter.ts` (+5, -6)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+5, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/connection-utils.test.ts` (+122, -149)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+195, -47)
- `packages/kilo-vscode/tests/unit/model-preview-data-line.test.ts` (+9, -0)
- `packages/kilo-vscode/tests/unit/model-selector-utils.test.ts` (+13, -4)
- `packages/kilo-vscode/tests/unit/question-dock-contract.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/server-manager-utils.test.ts` (+13, -1)
- `packages/kilo-vscode/tests/unit/task-timeline-tooltip.test.ts` (+13, -5)
- `packages/kilo-vscode/tests/unit/timeline-geometry.test.ts` (+46, -0)
- `packages/kilo-vscode/tests/unit/transcript-cache.test.ts` (+86, -0)
- `packages/kilo-vscode/tests/unit/transcript-rows.test.ts` (+219, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+10, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/sortable-tab.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+24, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+109, -51)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+61, -41)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskTimeline.tsx` (+94, -60)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+130, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/transcript-cache.ts` (+85, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+0, -13)
- `packages/kilo-vscode/webview-ui/src/components/settings/IndexingTab.tsx` (+4, -3)
- `packages/kilo-vscode/webview-ui/src/components/settings/PermissionEditor.tsx` (+1, -5)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelPreview.tsx` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+6, -4)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/model-selector-utils.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+131, -20)
- `packages/kilo-vscode/webview-ui/src/context/transcript-rows.ts` (+193, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+2, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+54, -0)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+18, -32)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+9, -2)
- `packages/kilo-vscode/webview-ui/src/types/messages/providers.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/sessions.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/utils/timeline/geometry.ts` (+73, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/AGENTS.md` (+8, -4)
- `packages/llm/README.md` (+129, -0)
- `packages/llm/example/tutorial.ts` (+2, -2)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/cache-policy.ts` (+111, -0)
- `packages/llm/src/index.ts` (+1, -0)
- `packages/llm/src/llm.ts` (+4, -28)
- `packages/llm/src/protocols/anthropic-messages.ts` (+100, -46)
- `packages/llm/src/protocols/bedrock-converse.ts` (+82, -21)
- `packages/llm/src/protocols/gemini.ts` (+34, -13)
- `packages/llm/src/protocols/openai-chat.ts` (+26, -7)
- `packages/llm/src/protocols/openai-responses.ts` (+63, -31)
- `packages/llm/src/protocols/shared.ts` (+36, -0)
- `packages/llm/src/protocols/utils/lifecycle.ts` (+88, -0)
- `packages/llm/src/protocols/utils/tool-stream.ts` (+47, -15)
- `packages/llm/src/route/client.ts` (+2, -1)
- `packages/llm/src/schema/errors.ts` (+1, -0)
- `packages/llm/src/schema/events.ts` (+84, -22)
- `packages/llm/src/schema/messages.ts` (+3, -1)
- `packages/llm/src/schema/options.ts` (+28, -0)
- `packages/llm/src/tool-runtime.ts` (+108, -22)
- `packages/llm/src/tool.ts` (+8, -3)
- `packages/llm/sst-env.d.ts` (+1, -1)
- `packages/llm/test/adapter.test.ts` (+3, -3)
- `packages/llm/test/cache-policy.test.ts` (+266, -0)
- `packages/llm/test/fixtures/recordings/anthropic-messages-cache/writes-then-reads-cache-control-on-identical-second-call.json` (+48, -0)
- `packages/llm/test/fixtures/recordings/gemini-cache/reports-cachedcontenttokencount-on-identical-second-call.json` (+46, -0)
- `packages/llm/test/fixtures/recordings/openai-responses-cache/reports-cached-tokens-on-identical-second-call.json` (+46, -0)
- `packages/llm/test/llm.test.ts` (+15, -15)
- `packages/llm/test/provider/anthropic-messages-cache.recorded.test.ts` (+8, -1)
- `packages/llm/test/provider/anthropic-messages.recorded.test.ts` (+5, -5)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+55, -22)
- `packages/llm/test/provider/bedrock-converse-cache.recorded.test.ts` (+5, -0)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+28, -20)
- `packages/llm/test/provider/gemini-cache.recorded.test.ts` (+4, -2)
- `packages/llm/test/provider/gemini.test.ts` (+66, -33)
- `packages/llm/test/provider/openai-chat.test.ts` (+45, -24)
- `packages/llm/test/provider/openai-compatible-chat.test.ts` (+5, -5)
- `packages/llm/test/provider/openai-responses-cache.recorded.test.ts` (+3, -0)
- `packages/llm/test/provider/openai-responses.test.ts` (+61, -22)
- `packages/llm/test/recorded-scenarios.ts` (+15, -10)
- `packages/llm/test/schema.test.ts` (+34, -1)
- `packages/llm/test/tool-runtime.test.ts` (+117, -23)
- `packages/llm/test/tool-stream.test.ts` (+15, -4)
- `packages/opencode/CHANGELOG.md` (+12, -0)
- `packages/opencode/migration/20260510033149_session_usage/migration.sql` (+6, -0)
- `packages/opencode/migration/20260510033149_session_usage/snapshot.json` (+1519, -0)
- `packages/opencode/package.json` (+4, -7)
- `packages/opencode/parsers-config.ts` (+10, -0)
- `packages/opencode/script/build.ts` (+3, -1)
- `packages/opencode/script/kilocode/models-snapshot.ts` (+3, -1)
- `packages/opencode/script/schema.ts` (+60, -47)
- `packages/opencode/specs/effect/error-boundaries-plan.md` (+235, -0)
- `packages/opencode/specs/effect/errors.md` (+79, -285)
- `packages/opencode/specs/effect/guide.md` (+251, -0)
- `packages/opencode/specs/effect/migration.md` (+46, -283)
- `packages/opencode/specs/effect/routes.md` (+45, -48)
- `packages/opencode/specs/effect/schema.md` (+48, -359)
- `packages/opencode/specs/effect/server-package.md` (+42, -650)
- `packages/opencode/specs/effect/todo.md` (+304, -0)
- `packages/opencode/specs/effect/tools.md` (+2, -4)
- `packages/opencode/specs/openapi-translation-cleanup.md` (+1, -1)
- `packages/opencode/specs/tui-plugins.md` (+34, -0)
- `packages/opencode/specs/v2/notifications.md` (+13, -0)
- `packages/opencode/src/acp/agent.ts` (+28, -6)
- `packages/opencode/src/audio.d.ts` (+5, -0)
- `packages/opencode/src/auth/index.ts` (+2, -4)
- `packages/opencode/src/background/job.ts` (+200, -0)
- `packages/opencode/src/cli/cmd/db.ts` (+4, -4)
- `packages/opencode/src/cli/cmd/debug/index.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+46, -0)
- `packages/opencode/src/cli/cmd/github.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/import.ts` (+6, -4)
- `packages/opencode/src/cli/cmd/models.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/prompt-display.ts` (+39, -0)
- `packages/opencode/src/cli/cmd/providers.ts` (+5, -2)
- `packages/opencode/src/cli/cmd/run.ts` (+24, -5)
- `packages/opencode/src/cli/cmd/run/demo.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/run/event.ts` (+51, -0)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+18, -19)
- `packages/opencode/src/cli/cmd/run/prompt.shared.ts` (+4, -3)
- `packages/opencode/src/cli/cmd/run/session-data.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+4, -7)
- `packages/opencode/src/cli/cmd/run/subagent-data.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/stats.ts` (+18, -10)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+62, -5)
- `packages/opencode/src/cli/cmd/tui/asset/charge.wav` (+-, --)
- `packages/opencode/src/cli/cmd/tui/asset/pulse-a.wav` (+-, --)
- `packages/opencode/src/cli/cmd/tui/asset/pulse-b.wav` (+-, --)
- `packages/opencode/src/cli/cmd/tui/asset/pulse-c.wav` (+-, --)
- `packages/opencode/src/cli/cmd/tui/attention.ts` (+262, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+97, -37)
- `packages/opencode/src/cli/cmd/tui/component/logo.tsx` (+0, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+151, -11)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+31, -21)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+91, -40)
- `packages/opencode/src/cli/cmd/tui/config/tui-migrate.ts` (+28, -26)
- `packages/opencode/src/cli/cmd/tui/config/tui-schema.ts` (+72, -40)
- `packages/opencode/src/cli/cmd/tui/config/tui.ts` (+85, -39)
- `packages/opencode/src/cli/cmd/tui/context/editor-zed.ts` (+25, -22)
- `packages/opencode/src/cli/cmd/tui/context/editor.ts` (+85, -76)
- `packages/opencode/src/cli/cmd/tui/context/event.ts` (+74, -22)
- `packages/opencode/src/cli/cmd/tui/context/local.tsx` (+191, -1)
- `packages/opencode/src/cli/cmd/tui/context/sync-v2.tsx` (+107, -107)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+149, -127)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+192, -55)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips.tsx` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/context.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/notifications.ts` (+94, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+0, -12)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+5, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+27, -21)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+83, -50)
- `packages/opencode/src/cli/cmd/tui/routes/session/footer.tsx` (+0, -21)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+26, -38)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+18, -4)
- `packages/opencode/src/cli/cmd/tui/routes/session/subagent-footer.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/util/audio.ts` (+58, -0)
- `packages/opencode/src/cli/cmd/tui/util/clipboard.ts` (+18, -42)
- `packages/opencode/src/cli/cmd/tui/util/sound.ts` (+0, -156)
- `packages/opencode/src/cli/error.ts` (+57, -26)
- `packages/opencode/src/cli/ui.ts` (+2, -3)
- `packages/opencode/src/command/index.ts` (+2, -8)
- `packages/opencode/src/config/agent.ts` (+4, -7)
- `packages/opencode/src/config/attachment.ts` (+4, -9)
- `packages/opencode/src/config/command.ts` (+17, -8)
- `packages/opencode/src/config/config.ts` (+24, -35)
- `packages/opencode/src/config/console-state.ts` (+1, -4)
- `packages/opencode/src/config/error.ts` (+16, -14)
- `packages/opencode/src/config/formatter.ts` (+2, -6)
- `packages/opencode/src/config/layout.ts` (+1, -5)
- `packages/opencode/src/config/lsp.ts` (+3, -5)
- `packages/opencode/src/config/markdown.ts` (+5, -8)
- `packages/opencode/src/config/mcp.ts` (+3, -9)
- `packages/opencode/src/config/model-id.ts` (+1, -10)
- `packages/opencode/src/config/parse.ts` (+8, -17)
- `packages/opencode/src/config/permission.ts` (+3, -17)
- `packages/opencode/src/config/plugin.ts` (+2, -6)
- `packages/opencode/src/config/provider.ts` (+3, -6)
- `packages/opencode/src/config/reference.ts` (+1, -5)
- `packages/opencode/src/config/server.ts` (+2, -5)
- `packages/opencode/src/config/skills.ts` (+1, -3)
- `packages/opencode/src/control-plane/adapters/worktree.ts` (+3, -5)
- `packages/opencode/src/control-plane/types.ts` (+3, -3)
- `packages/opencode/src/control-plane/workspace.ts` (+9, -5)
- `packages/opencode/src/data-migration.ts` (+106, -4)
- `packages/opencode/src/effect/app-runtime.ts` (+5, -1)
- `packages/opencode/src/effect/promise.ts` (+17, -0)
- `packages/opencode/src/effect/runner.ts` (+8, -13)
- `packages/opencode/src/effect/runtime-flags.ts` (+66, -0)
- `packages/opencode/src/file/index.ts` (+4, -11)
- `packages/opencode/src/file/ripgrep.ts` (+5, -4)
- `packages/opencode/src/file/watcher.ts` (+0, -1)
- `packages/opencode/src/format/formatter.ts` (+4, -3)
- `packages/opencode/src/format/index.ts` (+16, -17)
- `packages/opencode/src/git/index.ts` (+20, -38)
- `packages/opencode/src/id/id.ts` (+1, -0)
- `packages/opencode/src/ide/index.ts` (+4, -8)
- `packages/opencode/src/image/image.ts` (+39, -47)
- `packages/opencode/src/index.ts` (+25, -118)
- `packages/opencode/src/installation/index.ts` (+221, -239)
- `packages/opencode/src/kilocode/cli/cmd/tui/context/tui-config.tsx` (+20, -1)
- `packages/opencode/src/kilocode/command-timeout.ts` (+114, -0)
- `packages/opencode/src/kilocode/commands.ts` (+6, -0)
- `packages/opencode/src/kilocode/components/dialog-indexing.tsx` (+7, -7)
- `packages/opencode/src/kilocode/components/free-model-disclosure.ts` (+3, -3)
- `packages/opencode/src/kilocode/components/session-indexing.tsx` (+0, -31)
- `packages/opencode/src/kilocode/config-validation.ts` (+13, -9)
- `packages/opencode/src/kilocode/config/config.ts` (+12, -5)
- `packages/opencode/src/kilocode/config/default-plugins.ts` (+14, -2)
- `packages/opencode/src/kilocode/config/overlay.ts` (+5, -4)
- `packages/opencode/src/kilocode/fn.ts` (+8, -0)
- `packages/opencode/src/kilocode/indexing-label.ts` (+4, -8)
- `packages/opencode/src/kilocode/kilo-errors.ts` (+2, -1)
- `packages/opencode/src/kilocode/lancedb.ts` (+5, -0)
- `packages/opencode/src/kilocode/plan-file.ts` (+1, -3)
- `packages/opencode/src/kilocode/plan-followup.ts` (+13, -4)
- `packages/opencode/src/kilocode/plugins/home-footer.tsx` (+0, -18)
- `packages/opencode/src/kilocode/plugins/sidebar-indexing.tsx` (+101, -0)
- `packages/opencode/src/kilocode/provider/models-refresh.ts` (+6, -0)
- `packages/opencode/src/kilocode/provider/provider.ts` (+4, -2)
- `packages/opencode/src/kilocode/pty/self-command.ts` (+19, -15)
- `packages/opencode/src/kilocode/review/local-review-uncommitted.txt` (+13, -4)
- `packages/opencode/src/kilocode/review/local-review.txt` (+13, -4)
- `packages/opencode/src/kilocode/session/cost-propagation.ts` (+1, -1)
- `packages/opencode/src/kilocode/session/index.ts` (+20, -12)
- `packages/opencode/src/kilocode/session/overflow.ts` (+6, -0)
- `packages/opencode/src/kilocode/skills/kilo-config.md` (+1, -1)
- `packages/opencode/src/kilocode/snapshot/seed.ts` (+170, -0)
- `packages/opencode/src/kilocode/tui/config.ts` (+13, -12)
- `packages/opencode/src/kilocode/tui/keybinds.ts` (+3, -3)
- `packages/opencode/src/lsp/client.ts` (+5, -14)
- `packages/opencode/src/lsp/lsp.ts` (+14, -25)
- `packages/opencode/src/lsp/server.ts` (+4, -3)
- `packages/opencode/src/mcp/auth.ts` (+27, -25)
- `packages/opencode/src/mcp/index.ts` (+12, -23)
- `packages/opencode/src/patch/index.ts` (+80, -72)
- `packages/opencode/src/plugin/digitalocean.ts` (+411, -0)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+39, -38)
- `packages/opencode/src/plugin/index.ts` (+12, -5)
- `packages/opencode/src/project/bootstrap.ts` (+1, -1)
- `packages/opencode/src/project/instance-store.ts` (+6, -4)
- `packages/opencode/src/project/project.ts` (+14, -17)
- `packages/opencode/src/project/schema.ts` (+0, -2)
- `packages/opencode/src/project/vcs.ts` (+6, -14)
- `packages/opencode/src/provider/auth.ts` (+24, -27)
- `packages/opencode/src/provider/model-cache.ts` (+1, -1)
- `packages/opencode/src/provider/model-status.ts` (+1, -2)
- `packages/opencode/src/provider/models.ts` (+83, -288)
- `packages/opencode/src/provider/provider.ts` (+148, -68)
- `packages/opencode/src/provider/schema.ts` (+1, -7)
- `packages/opencode/src/provider/transform.ts` (+17, -30)
- `packages/opencode/src/pty/index.ts` (+4, -7)
- `packages/opencode/src/pty/schema.ts` (+0, -2)
- `packages/opencode/src/question/index.ts` (+7, -23)
- `packages/opencode/src/question/schema.ts` (+0, -3)
- `packages/opencode/src/reference/reference.ts` (+10, -6)
- `packages/opencode/src/server/httpapi-server.node.ts` (+0, -35)
- `packages/opencode/src/server/httpapi-server.ts` (+0, -9)
- `packages/opencode/src/server/projectors.ts` (+0, -2)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/event.ts` (+24, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+22, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/provider.ts` (+22, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+15, -15)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2.ts` (+4, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/instance.ts` (+59, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/model.ts` (+29, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/provider.ts` (+47, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/{ => handlers}/event.ts` (+3, -24)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+13, -6)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/instance.ts` (+3, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+33, -12)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session-errors.ts` (+7, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+57, -43)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/sync.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2.ts` (+7, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/model.ts` (+19, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/provider.ts` (+32, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/compression.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+1, -26)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+4, -4)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+26, -29)
- `packages/opencode/src/server/server.ts` (+158, -97)
- `packages/opencode/src/server/shared/ui.ts` (+8, -10)
- `packages/opencode/src/session/compaction.ts` (+15, -8)
- `packages/opencode/src/session/llm.ts` (+11, -21)
- `packages/opencode/src/session/message-error.ts` (+14, -0)
- `packages/opencode/src/session/message-v2.ts` (+100, -152)
- `packages/opencode/src/session/message.ts` (+20, -66)
- `packages/opencode/src/session/network.ts` (+4, -4)
- `packages/opencode/src/session/overflow.ts` (+1, -2)
- `packages/opencode/src/session/processor.ts` (+34, -29)
- `packages/opencode/src/session/projectors.ts` (+53, -1)
- `packages/opencode/src/session/prompt.ts` (+361, -104)
- `packages/opencode/src/session/retry.ts` (+3, -2)
- `packages/opencode/src/session/revert.ts` (+5, -7)
- `packages/opencode/src/session/run-state.ts` (+51, -8)
- `packages/opencode/src/session/session.sql.ts` (+8, -2)
- `packages/opencode/src/session/session.ts` (+138, -68)
- `packages/opencode/src/session/status.ts` (+2, -6)
- `packages/opencode/src/session/summary.ts` (+8, -10)
- `packages/opencode/src/session/todo.ts` (+1, -6)
- `packages/opencode/src/share/session.ts` (+4, -2)
- `packages/opencode/src/share/share-next.ts` (+1, -1)
- `packages/opencode/src/skill/index.ts` (+52, -35)
- `packages/opencode/src/skill/prompt/customize-opencode.md` (+36, -13)
- `packages/opencode/src/snapshot/index.ts` (+702, -708)
- `packages/opencode/src/storage/db.ts` (+65, -46)
- `packages/opencode/src/storage/json-migration.ts` (+6, -0)
- `packages/opencode/src/storage/storage.ts` (+9, -10)
- `packages/opencode/src/sync/README.md` (+10, -10)
- `packages/opencode/src/sync/index.ts` (+27, -35)
- `packages/opencode/src/sync/schema.ts` (+0, -2)
- `packages/opencode/src/util/abort.ts` (+0, -35)
- `packages/opencode/src/util/color.ts` (+0, -19)
- `packages/opencode/src/util/filesystem.ts` (+7, -0)
- `packages/opencode/src/util/fn.ts` (+0, -21)
- `packages/opencode/src/util/lock.ts` (+0, -98)
- `packages/opencode/src/util/media.ts` (+3, -1)
- `packages/opencode/src/util/named-schema-error.ts` (+0, -61)
- `packages/opencode/src/util/network.ts` (+0, -9)
- `packages/opencode/src/util/scrap.ts` (+0, -10)
- `packages/opencode/src/util/update-schema.ts` (+0, -13)
- `packages/opencode/src/v2/model.ts` (+0, -193)
- `packages/opencode/src/v2/provider-parity-checklist.md` (+95, -0)
- `packages/opencode/src/v2/session-event.ts` (+6, -6)
- `packages/opencode/src/v2/session-message-updater.ts` (+1, -0)
- `packages/opencode/src/v2/session-message.ts` (+6, -5)
- `packages/opencode/src/v2/session.ts` (+38, -17)
- `packages/opencode/src/worktree/index.ts` (+121, -125)
- `packages/opencode/test/AGENTS.md` (+45, -0)
- `packages/opencode/test/EFFECT_TEST_MIGRATION.md` (+169, -0)
- `packages/opencode/test/acp/event-subscription.test.ts` (+126, -46)
- `packages/opencode/test/background/job.test.ts` (+127, -0)
- `packages/opencode/test/cli/cmd/tui/app-exit.test.ts` (+6, -2)
- `packages/opencode/test/cli/cmd/tui/attention.test.ts` (+484, -0)
- `packages/opencode/test/cli/cmd/tui/notifications.test.ts` (+267, -0)
- `packages/opencode/test/cli/cmd/tui/sync-fixture.tsx` (+37, -7)
- `packages/opencode/test/cli/cmd/tui/sync.test.tsx` (+41, -1)
- `packages/opencode/test/cli/effect-cmd-instance-als.test.ts` (+40, -30)
- `packages/opencode/test/cli/error.test.ts` (+77, -0)
- `packages/opencode/test/cli/install-artifact.test.ts` (+4, -1)
- `packages/opencode/test/cli/run/prompt.shared.test.ts` (+50, -0)
- `packages/opencode/test/cli/run/runtime.boot.test.ts` (+31, -44)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+22, -27)
- `packages/opencode/test/cli/tui/plugin-loader.test.ts` (+111, -1)
- `packages/opencode/test/cli/tui/prompt-submit-race.test.ts` (+98, -0)
- `packages/opencode/test/cli/tui/use-event.test.tsx` (+31, -27)
- `packages/opencode/test/config/agent-color.test.ts` (+32, -58)
- `packages/opencode/test/config/config.test.ts` (+57, -9)
- `packages/opencode/test/config/lsp.test.ts` (+0, -18)
- `packages/opencode/test/config/tui.test.ts` (+824, -750)
- `packages/opencode/test/control-plane/workspace.test.ts` (+287, -202)
- `packages/opencode/test/effect/app-runtime-logger.test.ts` (+50, -43)
- `packages/opencode/test/effect/instance-state.test.ts` (+7, -7)
- `packages/opencode/test/effect/runner.test.ts` (+32, -41)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+240, -0)
- `packages/opencode/test/fake/account.ts` (+9, -0)
- `packages/opencode/test/fake/auth.ts` (+8, -0)
- `packages/opencode/test/fake/npm.ts` (+8, -0)
- `packages/opencode/test/fake/skill.ts` (+8, -0)
- `packages/opencode/test/file/fsmonitor.test.ts` (+55, -51)
- `packages/opencode/test/file/index.test.ts` (+772, -859)
- `packages/opencode/test/file/path-traversal.test.ts` (+155, -176)
- `packages/opencode/test/file/ripgrep.test.ts` (+212, -223)
- `packages/opencode/test/file/watcher.test.ts` (+152, -139)
- `packages/opencode/test/fixture/db.ts` (+4, -3)
- `packages/opencode/test/fixture/fixture.ts` (+1, -1)
- `packages/opencode/test/fixture/tui-plugin.ts` (+19, -1)
- `packages/opencode/test/fixture/tui-runtime.ts` (+11, -1)
- `packages/opencode/test/fixture/workspace.ts` (+28, -0)
- `packages/opencode/test/format/format.test.ts` (+2, -2)
- `packages/opencode/test/git/git.test.ts` (+113, -110)
- `packages/opencode/test/image/fixtures/picture-5mb-base64.png` (+-, --)
- `packages/opencode/test/installation/installation.test.ts` (+94, -97)
- `packages/opencode/test/kilocode/ask-agent-permissions.test.ts` (+1, -3)
- `packages/opencode/test/kilocode/bash-permission-metadata.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/cli/cmd/tui/context/tui-config.test.ts` (+24, -2)
- `packages/opencode/test/kilocode/cli/error.test.ts` (+30, -0)
- `packages/opencode/test/kilocode/command-timeout.test.ts` (+177, -0)
- `packages/opencode/test/kilocode/compaction-payload-recovery.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/config/config.test.ts` (+16, -5)
- `packages/opencode/test/kilocode/config/indexing-default-plugin.test.ts` (+17, -21)
- `packages/opencode/test/kilocode/config/opentelemetry-default.test.ts` (+6, -5)
- `packages/opencode/test/kilocode/config/speech-to-text-config.test.ts` (+3, -2)
- `packages/opencode/test/kilocode/cost-propagation.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/custom-provider-delete.test.ts` (+7, -6)
- `packages/opencode/test/kilocode/free-model-disclosure.test.ts` (+5, -20)
- `packages/opencode/test/kilocode/indexing-label.test.ts` (+18, -6)
- `packages/opencode/test/kilocode/kilo-loader-auth.test.ts` (+25, -5)
- `packages/opencode/test/kilocode/lancedb-runtime.test.ts` (+18, -0)
- `packages/opencode/test/kilocode/local-model.test.ts` (+4, -0)
- `packages/opencode/test/kilocode/local-review-command.test.ts` (+12, -4)
- `packages/opencode/test/kilocode/lsp-typescript-lightweight.test.ts` (+5, -3)
- `packages/opencode/test/kilocode/patch.test.ts` (+51, -11)
- `packages/opencode/test/kilocode/provider-list-failed-state.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/provider-model-refresh.test.ts` (+107, -0)
- `packages/opencode/test/kilocode/pty-self-command.test.ts` (+52, -0)
- `packages/opencode/test/kilocode/server/httpapi-kilo-edit.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/session-compaction-cap.test.ts` (+4, -0)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+42, -8)
- `packages/opencode/test/kilocode/session-message-metadata.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/session-overflow.test.ts` (+31, -2)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/session-processor-network-offline.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/session-processor-retry-limit.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+8, -1)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+9, -1)
- `packages/opencode/test/kilocode/session-share.test.ts` (+4, -1)
- `packages/opencode/test/kilocode/session/session.test.ts` (+44, -27)
- `packages/opencode/test/kilocode/snapshot-seed.test.ts` (+119, -0)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+51, -32)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+17, -5)
- `packages/opencode/test/kilocode/tui-sync-event.test.ts` (+130, -0)
- `packages/opencode/test/lib/effect.ts` (+31, -1)
- `packages/opencode/test/lsp/index.test.ts` (+75, -11)
- `packages/opencode/test/mcp/headers.test.ts` (+47, -100)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+390, -362)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+122, -203)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+100, -161)
- `packages/opencode/test/memory/abort-leak-webfetch.ts` (+0, -49)
- `packages/opencode/test/memory/abort-leak.test.ts` (+0, -131)
- `packages/opencode/test/patch/patch.test.ts` (+154, -119)
- `packages/opencode/test/permission-task.test.ts` (+82, -92)
- `packages/opencode/test/plugin/auth-override.test.ts` (+33, -36)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+582, -506)
- `packages/opencode/test/plugin/trigger.test.ts` (+37, -15)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+55, -29)
- `packages/opencode/test/preload.ts` (+1, -6)
- `packages/opencode/test/project/instance-bootstrap.test.ts` (+62, -53)
- `packages/opencode/test/project/instance.test.ts` (+90, -65)
- `packages/opencode/test/project/migrate-global.test.ts` (+105, -99)
- `packages/opencode/test/project/project.test.ts` (+499, -390)
- `packages/opencode/test/project/vcs.test.ts` (+290, -302)
- `packages/opencode/test/project/worktree.test.ts` (+229, -178)
- `packages/opencode/test/provider/digitalocean.test.ts` (+122, -0)
- `packages/opencode/test/provider/model-status.test.ts` (+1, -1)
- `packages/opencode/test/provider/provider.test.ts` (+368, -253)
- `packages/opencode/test/provider/transform.test.ts` (+138, -15)
- `packages/opencode/test/pty/pty-output-isolation.test.ts` (+158, -144)
- `packages/opencode/test/pty/pty-session.test.ts` (+84, -87)
- `packages/opencode/test/pty/pty-shell.test.ts` (+41, -71)
- `packages/opencode/test/question/question.test.ts` (+20, -15)
- `packages/opencode/test/reference/reference.test.ts` (+119, -120)
- `packages/opencode/test/server/global-bus.ts` (+0, -3)
- `packages/opencode/test/server/global-session-list.test.ts` (+95, -155)
- `packages/opencode/test/server/httpapi-config.test.ts` (+76, -51)
- `packages/opencode/test/server/httpapi-cors.test.ts` (+18, -4)
- `packages/opencode/test/server/httpapi-error-middleware.test.ts` (+71, -0)
- `packages/opencode/test/server/httpapi-event.test.ts` (+102, -18)
- `packages/opencode/test/server/httpapi-exercise/backend.ts` (+9, -18)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+6, -0)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+15, -14)
- `packages/opencode/test/server/httpapi-exercise/runtime.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-exercise/types.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+248, -158)
- `packages/opencode/test/server/httpapi-file.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+4, -15)
- `packages/opencode/test/server/httpapi-instance.test.ts` (+5, -6)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+146, -0)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+115, -102)
- `packages/opencode/test/server/httpapi-mdns.test.ts` (+82, -0)
- `packages/opencode/test/server/httpapi-promptasync-context.test.ts` (+2, -10)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+188, -109)
- `packages/opencode/test/server/httpapi-pty-websocket.test.ts` (+12, -9)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-raw-route-auth.test.ts` (+4, -4)
- `packages/opencode/test/server/httpapi-schema-error-body.test.ts` (+63, -73)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+159, -107)
- `packages/opencode/test/server/httpapi-session.test.ts` (+243, -192)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+131, -108)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+244, -150)
- `packages/opencode/test/server/httpapi-workspace-routing.test.ts` (+2, -10)
- `packages/opencode/test/server/negative-tokens-regression.test.ts` (+54, -70)
- `packages/opencode/test/server/project-init-git.test.ts` (+86, -79)
- `packages/opencode/test/server/session-actions.test.ts` (+26, -33)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+42, -45)
- `packages/opencode/test/server/session-list.test.ts` (+187, -195)
- `packages/opencode/test/server/session-messages.test.ts` (+152, -164)
- `packages/opencode/test/server/session-select.test.ts` (+67, -75)
- `packages/opencode/test/server/worktree-endpoint-repro.test.ts` (+179, -35)
- `packages/opencode/test/session/compaction.test.ts` (+7, -5)
- `packages/opencode/test/session/llm.test.ts` (+23, -4)
- `packages/opencode/test/session/message-v2.test.ts` (+107, -0)
- `packages/opencode/test/session/messages-pagination.test.ts` (+622, -738)
- `packages/opencode/test/session/processor-effect.test.ts` (+28, -20)
- `packages/opencode/test/session/prompt.test.ts` (+29, -6)
- `packages/opencode/test/session/retry.test.ts` (+10, -10)
- `packages/opencode/test/session/schema-decoding.test.ts` (+2, -35)
- `packages/opencode/test/session/session-schema.test.ts` (+2, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+12, -1)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+183, -214)
- `packages/opencode/test/session/structured-output.test.ts` (+35, -30)
- `packages/opencode/test/skill/discovery.test.ts` (+91, -68)
- `packages/opencode/test/skill/skill.test.ts` (+57, -14)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+1021, -1439)
- `packages/opencode/test/storage/db.test.ts` (+23, -19)
- `packages/opencode/test/storage/storage.test.ts` (+10, -7)
- `packages/opencode/test/sync/index.test.ts` (+32, -11)
- `packages/opencode/test/util/error.test.ts` (+13, -0)
- `packages/opencode/test/util/lock.test.ts` (+0, -72)
- `packages/opencode/test/util/log.test.ts` (+71, -83)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+11, -10)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin-atomic-chat/src/cache/model-status-cache.ts` (+3, -5)
- `packages/plugin-atomic-chat/src/cache/shared-model-status-cache.ts` (+1, -1)
- `packages/plugin-atomic-chat/src/constants.ts` (+4, -4)
- `packages/plugin-atomic-chat/src/index.ts` (+2, -2)
- `packages/plugin-atomic-chat/src/plugin/auth-hook.ts` (+5, -5)
- `packages/plugin-atomic-chat/src/plugin/chat-params-hook.ts` (+22, -22)
- `packages/plugin-atomic-chat/src/plugin/config-hook.ts` (+7, -7)
- `packages/plugin-atomic-chat/src/plugin/enhance-config.ts` (+27, -29)
- `packages/plugin-atomic-chat/src/plugin/event-hook.ts` (+4, -4)
- `packages/plugin-atomic-chat/src/plugin/get-loaded-models.ts` (+4, -4)
- `packages/plugin-atomic-chat/src/plugin/index.ts` (+10, -10)
- `packages/plugin-atomic-chat/src/types/index.ts` (+4, -4)
- `packages/plugin-atomic-chat/src/ui/toast-notifier.ts` (+5, -5)
- `packages/plugin-atomic-chat/src/utils/atomic-chat-api.ts` (+12, -15)
- `packages/plugin-atomic-chat/src/utils/format-model-name.ts` (+5, -5)
- `packages/plugin-atomic-chat/src/utils/index.ts` (+54, -62)
- `packages/plugin-atomic-chat/src/utils/should-probe-atomic-chat.ts` (+5, -7)
- `packages/plugin-atomic-chat/src/utils/validation/index.ts` (+5, -5)
- `packages/plugin-atomic-chat/src/utils/validation/safe-operations.ts` (+1, -1)
- `packages/plugin-atomic-chat/src/utils/validation/type-guards.ts` (+4, -9)
- `packages/plugin-atomic-chat/src/utils/validation/validate-config.ts` (+14, -14)
- `packages/plugin-atomic-chat/src/utils/validation/validate-hook-input.ts` (+16, -16)
- `packages/plugin-atomic-chat/test/plugin.test.ts` (+80, -80)
- `packages/plugin-atomic-chat/test/should-probe-atomic-chat.test.ts` (+15, -15)
- `packages/plugin/package.json` (+4, -4)
- `packages/plugin/src/index.ts` (+4, -4)
- `packages/plugin/src/tool.ts` (+15, -1)
- `packages/plugin/src/tui.ts` (+83, -0)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/gen/types.gen.ts` (+3, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+97, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+497, -609)
- `packages/sdk/openapi.json` (+1438, -1826)
- `packages/storybook/.storybook/mocks/app/context/global-sync.ts` (+13, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/assets/audio/alert-01.mp3` (+-, --)
- `packages/ui/src/assets/audio/alert-02.mp3` (+-, --)
- `packages/ui/src/assets/audio/alert-03.mp3` (+-, --)
- `packages/ui/src/assets/audio/alert-04.mp3` (+-, --)
- `packages/ui/src/assets/audio/alert-05.mp3` (+-, --)
- `packages/ui/src/assets/audio/alert-06.mp3` (+-, --)
- `packages/ui/src/assets/audio/alert-07.mp3` (+-, --)
- `packages/ui/src/assets/audio/alert-08.mp3` (+-, --)
- `packages/ui/src/assets/audio/alert-09.mp3` (+-, --)
- `packages/ui/src/assets/audio/alert-10.mp3` (+-, --)
- `packages/ui/src/assets/audio/bip-bop-01.mp3` (+-, --)
- `packages/ui/src/assets/audio/bip-bop-02.mp3` (+-, --)
- `packages/ui/src/assets/audio/bip-bop-03.mp3` (+-, --)
- `packages/ui/src/assets/audio/bip-bop-04.mp3` (+-, --)
- `packages/ui/src/assets/audio/bip-bop-05.mp3` (+-, --)
- `packages/ui/src/assets/audio/bip-bop-06.mp3` (+-, --)
- `packages/ui/src/assets/audio/bip-bop-07.mp3` (+-, --)
- `packages/ui/src/assets/audio/bip-bop-08.mp3` (+-, --)
- `packages/ui/src/assets/audio/bip-bop-09.mp3` (+-, --)
- `packages/ui/src/assets/audio/bip-bop-10.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-01.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-02.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-03.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-04.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-05.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-06.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-07.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-08.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-09.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-10.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-11.mp3` (+-, --)
- `packages/ui/src/assets/audio/nope-12.mp3` (+-, --)
- `packages/ui/src/assets/audio/staplebops-01.mp3` (+-, --)
- `packages/ui/src/assets/audio/staplebops-02.mp3` (+-, --)
- `packages/ui/src/assets/audio/staplebops-03.mp3` (+-, --)
- `packages/ui/src/assets/audio/staplebops-04.mp3` (+-, --)
- `packages/ui/src/assets/audio/staplebops-05.mp3` (+-, --)
- `packages/ui/src/assets/audio/staplebops-06.mp3` (+-, --)
- `packages/ui/src/assets/audio/staplebops-07.mp3` (+-, --)
- `packages/ui/src/assets/audio/yup-01.mp3` (+-, --)
- `packages/ui/src/assets/audio/yup-02.mp3` (+-, --)
- `packages/ui/src/assets/audio/yup-03.mp3` (+-, --)
- `packages/ui/src/assets/audio/yup-04.mp3` (+-, --)
- `packages/ui/src/assets/audio/yup-05.mp3` (+-, --)
- `packages/ui/src/assets/audio/yup-06.mp3` (+-, --)
- `packages/ui/src/components/icon.tsx` (+43, -5)
- `packages/ui/src/components/message-part.tsx` (+43, -18)
- `packages/ui/src/components/session-diff.ts` (+14, -5)
- `packages/ui/src/context/data.tsx` (+3, -0)
- `patches/@silvia-odwyer%2Fphoton-node@0.3.4.patch` (+274, -3)
- `script/check-opencode-promise-facades.ts` (+2, -13)
- `script/upstream/package.json` (+1, -1)
- `specs/v2/api.html` (+1161, -0)
- `specs/v2/provider-model.md` (+330, -0)
- `specs/v2/todo.md` (+4, -2)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 2ba968c74..1b6678dce 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.41",
+  "version": "7.3.42",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -26,6 +26,7 @@
     "@types/semver": "catalog:"
   },
   "dependencies": {
+    "@kilocode/kilo-gateway": "workspace:*",
     "@effect/opentelemetry": "catalog:",
     "@effect/platform-node": "catalog:",
     "@npmcli/arborist": "9.4.0",
@@ -43,7 +44,34 @@
     "rotating-file-stream": "3.2.9",
     "semver": "^7.6.3",
     "xdg-basedir": "5.1.0",
-    "zod": "catalog:"
+    "zod": "catalog:",
+    "@ai-sdk/alibaba": "1.0.17",
+    "@ai-sdk/amazon-bedrock": "4.0.96",
+    "@ai-sdk/anthropic": "3.0.71",
+    "@ai-sdk/azure": "3.0.49",
+    "@ai-sdk/cerebras": "2.0.41",
+    "@ai-sdk/cohere": "3.0.27",
+    "@ai-sdk/deepinfra": "2.0.41",
+    "@ai-sdk/gateway": "3.0.104",
+    "@ai-sdk/google": "3.0.63",
+    "@ai-sdk/google-vertex": "4.0.112",
+    "@ai-sdk/groq": "3.0.31",
+    "@ai-sdk/mistral": "3.0.27",
+    "@ai-sdk/openai": "3.0.53",
+    "@ai-sdk/openai-compatible": "2.0.41",
+    "@ai-sdk/perplexity": "3.0.26",
+    "@ai-sdk/provider": "3.0.8",
+    "@ai-sdk/provider-utils": "4.0.23",
+    "@ai-sdk/togetherai": "2.0.41",
+    "@ai-sdk/vercel": "2.0.39",
+    "@ai-sdk/xai": "3.0.82",
+    "@aws-sdk/credential-providers": "3.993.0",
+    "@openrouter/ai-sdk-provider": "2.9.0",
+    "ai-gateway-provider": "3.1.2",
+    "gitlab-ai-provider": "6.6.0",
```

#### packages/core/src/aisdk.ts
```diff
diff --git a/packages/core/src/aisdk.ts b/packages/core/src/aisdk.ts
new file mode 100644
index 000000000..5fa229430
--- /dev/null
+++ b/packages/core/src/aisdk.ts
@@ -0,0 +1,172 @@
+export * as AISDK from "./aisdk"
+
+import type { LanguageModelV3 } from "@ai-sdk/provider"
+import { Cause, Context, Effect, Layer, Schema } from "effect"
+import { ModelV2 } from "./model"
+import { PluginV2 } from "./plugin"
+import { ProviderV2 } from "./provider"
+
+type SDK = any
+
+function wrapSSE(res: Response, ms: number, ctl: AbortController) {
+  if (typeof ms !== "number" || ms <= 0) return res
+  if (!res.body) return res
+  if (!res.headers.get("content-type")?.includes("text/event-stream")) return res
+
+  const reader = res.body.getReader()
+  const body = new ReadableStream<Uint8Array>({
+    async pull(ctrl) {
+      const part = await new Promise<Awaited<ReturnType<typeof reader.read>>>((resolve, reject) => {
+        const id = setTimeout(() => {
+          const err = new Error("SSE read timed out")
+          ctl.abort(err)
+          void reader.cancel(err)
+          reject(err)
+        }, ms)
+
+        reader.read().then(
+          (part) => {
+            clearTimeout(id)
+            resolve(part)
+          },
+          (err) => {
+            clearTimeout(id)
+            reject(err)
+          },
+        )
+      })
+
+      if (part.done) {
+        ctrl.close()
+        return
+      }
+
+      ctrl.enqueue(part.value)
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
new file mode 100644
index 000000000..70cdba785
--- /dev/null
+++ b/packages/core/src/catalog.ts
@@ -0,0 +1,260 @@
+export * as Catalog from "./catalog"
+
+import { Context, Effect, HashMap, Layer, Option, Order, pipe, Schema, Array } from "effect"
+import { produce, type Draft } from "immer"
+import { ModelV2 } from "./model"
+import { PluginV2 } from "./plugin"
+import { ProviderV2 } from "./provider"
+import { Instance } from "./instance"
+
+type ProviderRecord = {
+  provider: ProviderV2.Info
+  models: HashMap.HashMap<ModelV2.ID, ModelV2.Info>
+}
+
+export class ProviderNotFoundError extends Schema.TaggedErrorClass<ProviderNotFoundError>()(
+  "CatalogV2.ProviderNotFound",
+  {
+    providerID: ProviderV2.ID,
+  },
+) {}
+
+export class ModelNotFoundError extends Schema.TaggedErrorClass<ModelNotFoundError>()("CatalogV2.ModelNotFound", {
+  providerID: ProviderV2.ID,
+  modelID: ModelV2.ID,
+}) {}
+
+export interface Interface {
+  readonly provider: {
+    readonly get: (providerID: ProviderV2.ID) => Effect.Effect<ProviderV2.Info, ProviderNotFoundError>
+    readonly update: (providerID: ProviderV2.ID, fn: (provider: Draft<ProviderV2.Info>) => void) => Effect.Effect<void>
+    readonly all: () => Effect.Effect<ProviderV2.Info[]>
+    readonly available: () => Effect.Effect<ProviderV2.Info[]>
+  }
+  readonly model: {
+    readonly get: (
+      providerID: ProviderV2.ID,
+      modelID: ModelV2.ID,
+    ) => Effect.Effect<ModelV2.Info, ProviderNotFoundError | ModelNotFoundError>
+    readonly update: (
+      providerID: ProviderV2.ID,
+      modelID: ModelV2.ID,
+      fn: (model: Draft<ModelV2.Info>) => void,
+    ) => Effect.Effect<void, ProviderNotFoundError>
+    readonly all: () => Effect.Effect<ModelV2.Info[]>
```

#### packages/core/src/effect-zod.ts
```diff
diff --git a/packages/core/src/effect-zod.ts b/packages/core/src/effect-zod.ts
index 1c88712d7..68395379e 100644
--- a/packages/core/src/effect-zod.ts
+++ b/packages/core/src/effect-zod.ts
@@ -228,7 +228,7 @@ function issueMessage(issue: any): string | undefined {
 }
 
 function body(ast: SchemaAST.AST): z.ZodTypeAny {
-  if (SchemaAST.isOptional(ast)) return opt(ast)
+  if (SchemaAST.isOptional(ast) && ast._tag === "Union") return opt(ast)
 
   switch (ast._tag) {
     case "String":
```

#### packages/core/src/flag/flag.ts
```diff
diff --git a/packages/core/src/flag/flag.ts b/packages/core/src/flag/flag.ts
index 95c8e0163..ab0647c8a 100644
--- a/packages/core/src/flag/flag.ts
+++ b/packages/core/src/flag/flag.ts
@@ -11,8 +11,6 @@ function falsy(key: string) {
   return value === "false" || value === "0"
 }
 
-// Channels where new experiments default to ON (unstable / internal users).
-// Stable channels (`prod`, `latest`) stay opt-in.
 const UNSTABLE_CHANNELS = new Set(["dev", "beta", "local"])
 function unstableDefault(key: string) {
   return truthy(key) || (!falsy(key) && UNSTABLE_CHANNELS.has(InstallationChannel))
@@ -54,16 +52,13 @@ export const Flag = {
   KILO_DISABLE_CLAUDE_CODE,
   KILO_DISABLE_CLAUDE_CODE_PROMPT: KILO_DISABLE_CLAUDE_CODE || truthy("KILO_DISABLE_CLAUDE_CODE_PROMPT"),
   KILO_DISABLE_CLAUDE_CODE_SKILLS,
-  KILO_DISABLE_EXTERNAL_SKILLS: truthy("KILO_DISABLE_EXTERNAL_SKILLS"), // kilocode_change
-  // Default-on for dev/beta/local; opt-in for stable. Set
-  // KILO_EXPERIMENTAL_CUSTOMIZE_SKILL=false to force off, =true to force on.
+  KILO_DISABLE_EXTERNAL_SKILLS: truthy("KILO_DISABLE_EXTERNAL_SKILLS"),
   KILO_EXPERIMENTAL_CUSTOMIZE_SKILL: unstableDefault("KILO_EXPERIMENTAL_CUSTOMIZE_SKILL"),
   KILO_FAKE_VCS: process.env["KILO_FAKE_VCS"],
   KILO_SERVER_PASSWORD: process.env["KILO_SERVER_PASSWORD"],
   KILO_SERVER_USERNAME: process.env["KILO_SERVER_USERNAME"],
   KILO_ENABLE_QUESTION_TOOL: truthy("KILO_ENABLE_QUESTION_TOOL"),
 
-  // Experimental
   KILO_EXPERIMENTAL,
   KILO_EXPERIMENTAL_FILEWATCHER: Config.boolean("KILO_EXPERIMENTAL_FILEWATCHER").pipe(Config.withDefault(false)),
   KILO_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("KILO_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
@@ -93,9 +88,8 @@ export const Flag = {
   KILO_WORKSPACE_ID: process.env["KILO_WORKSPACE_ID"],
   KILO_EXPERIMENTAL_WORKSPACES: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_WORKSPACES"),
   KILO_EXPERIMENTAL_EVENT_SYSTEM: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_EVENT_SYSTEM"),
+  KILO_EXPERIMENTAL_SESSION_SWITCHING: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_SESSION_SWITCHING"),
 
-  // Evaluated at access time (not module load) because tests, the CLI, and
-  // external tooling set these env vars at runtime.
   get KILO_DISABLE_PROJECT_CONFIG() {
     return truthy("KILO_DISABLE_PROJECT_CONFIG")
   },
@@ -114,9 +108,7 @@ export const Flag = {
   get KILO_CLIENT() {
     return process.env["KILO_CLIENT"] ?? "cli"
   },
-  // kilocode_change start
   get KILO_SESSION_RETRY_LIMIT() {
     return number("KILO_SESSION_RETRY_LIMIT")
   },
```


*... and more files (showing first 5)*

## opencode Changes (97e713e..318dbe9)

### Commits

- 318dbe9 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-11)
- 8bd249d - upgrade opentui-spinner (#31561) (Sebastian, 2026-06-11)
- 710e408 - chore: generate (opencode-agent[bot], 2026-06-11)
- dac0dd5 - feat(core): add connector authentication (#31837) (Dax, 2026-06-11)
- bf05e8a - fix(mcp): preserve headers during auth and debug (#31802) (Aiden Cline, 2026-06-10)
- 51b10b1 - chore: generate (opencode-agent[bot], 2026-06-11)
- 47a4560 - refactor(tui): replace v2 sync with data context (#31826) (Dax, 2026-06-10)
- 69623c2 - chore: generate (opencode-agent[bot], 2026-06-11)
- 38536cf - test(opencode): simplify processor layer wiring (#31823) (James Long, 2026-06-10)
- 8bf0675 - feat(server): add v2 session API endpoints (#31822) (Dax, 2026-06-11)
- ff967e5 - chore: generate (opencode-agent[bot], 2026-06-11)
- 20bf18f - test(opencode): simplify share layer wiring (#31811) (James Long, 2026-06-10)
- 51891d5 - fix(snapshot): reuse source git objects to avoid re-hashing huge repos (#31798) (Dmitriy Kovalenko, 2026-06-11)
- cc22646 - docs: add branch naming guidance (Dax Raad, 2026-06-10)
- eb70b61 - test(opencode): simplify test registry layer wiring (#31761) (James Long, 2026-06-10)
- 6e2bcaf - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- 07b983e - feat(mcp): support server log notifications (#31752) (Aiden Cline, 2026-06-10)
- c51a158 - tui: fix session list search filtering (#31748) (Simon Klee, 2026-06-10)
- f43b0d3 - fix(mcp): apply timeouts to catalog requests (#31618) (Aiden Cline, 2026-06-10)
- 722f4dd - chore: pin gitlab-ai-provider to 6.9.0 (#31741) (Vladimir Glafirov, 2026-06-10)
- bb82aab - update opencode.jsonc (Dax Raad, 2026-06-10)
- 936363e - sync release versions for v1.17.3 (opencode, 2026-06-10)
- 8688ed7 - feat(web): data link (Adam, 2026-06-10)
- 5b54203 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- bed780f - chore: bump gitlab-ai-provider to 6.9.1 (#31728) (Vladimir Glafirov, 2026-06-10)
- 14ec7ed - fix fff disabling logic (Dax Raad, 2026-06-10)
- 2c65273 - sync release versions for v1.17.2 (opencode, 2026-06-10)
- 2e0f88d - fix(desktop): restore linux launcher identity (#31709) (Filip, 2026-06-10)
- e1073e5 - chore: generate (opencode-agent[bot], 2026-06-10)
- 649618c - fix(app): restore device attachment picker (#31707) (mridul, 2026-06-10)
- 02608a4 - fix: recover from expired enterprise auth on remote config load (#31661) (Ayush Thakur, 2026-06-10)
- 3ad6923 - fix(opencode): let subagents use their own permissions (#31696) (Aiden Cline, 2026-06-10)
- e4300e9 - fix(core): disable fff by default on windows (Dax Raad, 2026-06-10)
- 538cfaf - feat(core): enable fff by default (Dax Raad, 2026-06-10)
- 1dad38d - fix(core): do not gate fff on initial scan (Dax Raad, 2026-06-10)
- c9e2a38 - ci: change model from gpt-5.4-nano to gpt-5.4-mini (#31695) (Aiden Cline, 2026-06-10)
- 5863e12 - put fff behind flag (Dax Raad, 2026-06-10)
- 4c9abff - sync release versions for v1.17.1 (opencode, 2026-06-10)
- 2cf68f3 - chore: generate (opencode-agent[bot], 2026-06-10)
- 90fb32b - fix(core): accept deprecated reference config key (#31659) (Luke Parker, 2026-06-10)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/task.ts` (+0, -4)
- `packages/opencode/test/tool/registry.test.ts` (+12, -51)

#### Agent System (packages/*/src/agent/)
- `.opencode/agent/triage.md` (+1, -1)
- `packages/opencode/src/agent/agent.ts` (+3, -0)
- `packages/opencode/src/agent/subagent-permissions.ts` (+4, -12)
- `packages/opencode/test/agent/agent.test.ts` (+29, -0)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+14, -68)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/migration/20260611035744_credential/migration.sql` (+12, -0)
- `packages/core/migration/20260611035744_credential/snapshot.json` (+2095, -0)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/auth.ts` (+0, -340)
- `packages/core/src/catalog.ts` (+43, -18)
- `packages/core/src/connector.ts` (+492, -0)
- `packages/core/src/connector/schema.ts` (+9, -0)
- `packages/core/src/credential.ts` (+343, -0)
- `packages/core/src/credential/sql.ts` (+23, -0)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration/20260611035744_credential.ts` (+25, -0)
- `packages/core/src/effect/layer-node.ts` (+8, -1)
- `packages/core/src/filesystem/search.ts` (+4, -6)
- `packages/core/src/flag/flag.ts` (+2, -0)
- `packages/core/src/location-layer.ts` (+4, -2)
- `packages/core/src/plugin.ts` (+0, -8)
- `packages/core/src/plugin/account.ts` (+0, -45)
- `packages/core/src/plugin/agent.ts` (+1, -1)
- `packages/core/src/plugin/boot.ts` (+9, -6)
- `packages/core/src/plugin/models-dev.ts` (+20, -0)
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+1, -1)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+8, -2)
- `packages/core/src/plugin/provider/openai-auth.ts` (+252, -0)
- `packages/core/src/plugin/provider/openai.ts` (+7, -0)
- `packages/core/src/plugin/provider/opencode.ts` (+1, -1)
- `packages/core/src/provider.ts` (+3, -2)
- `packages/core/src/v1/config/config.ts` (+3, -0)
- `packages/core/src/v1/config/error.ts` (+5, -0)
- `packages/core/src/v1/config/migrate.ts` (+2, -1)
- `packages/core/test/account.test.ts` (+0, -284)
- `packages/core/test/catalog.test.ts` (+51, -1)
- `packages/core/test/config/config.test.ts` (+38, -0)
- `packages/core/test/connector.test.ts` (+401, -0)
- `packages/core/test/credential.test.ts` (+206, -0)
- `packages/core/test/location-layer.test.ts` (+6, -2)
- `packages/core/test/plugin/fixtures/models-dev.json` (+14, -0)
- `packages/core/test/plugin/models-dev.test.ts` (+65, -0)
- `packages/core/test/plugin/provider-azure.test.ts` (+15, -18)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+21, -23)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+19, -31)
- `packages/core/test/plugin/provider-helper.ts` (+9, -0)
- `packages/core/test/plugin/provider-openai.test.ts` (+33, -6)
- `packages/core/test/plugin/provider-opencode.test.ts` (+4, -1)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `AGENTS.md` (+6, -0)
- `bun.lock` (+31, -34)
- `bunfig.toml` (+1, -1)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/dialog-select-file.tsx` (+1, -9)
- `packages/app/src/components/prompt-input.tsx` (+12, -29)
- `packages/app/src/components/prompt-input/server-attachment.test.ts` (+0, -32)
- `packages/app/src/components/prompt-input/server-attachment.ts` (+0, -8)
- `packages/cli/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/header.tsx` (+9, -14)
- `packages/console/app/src/i18n/en.ts` (+1, -0)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/electron-builder.config.test.ts` (+48, -0)
- `packages/desktop/electron-builder.config.ts` (+37, -8)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/resources/linux/opencode-desktop.desktop` (+10, -0)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+2, -2)
- `packages/opencode/src/cli/cmd/mcp.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/providers.ts` (+4, -1)
- `packages/opencode/src/cli/error.ts` (+12, -0)
- `packages/opencode/src/config/config.ts` (+14, -4)
- `packages/opencode/src/mcp/catalog.ts` (+138, -0)
- `packages/opencode/src/mcp/index.ts` (+59, -161)
- `packages/opencode/src/snapshot/index.ts` (+46, -0)
- `packages/opencode/test/config/config.test.ts` (+52, -2)
- `packages/opencode/test/effect/app-graph-types.test.ts` (+9, -5)
- `packages/opencode/test/effect/app-graph.test.ts` (+11, -14)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+2, -1)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+9, -4)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+68, -0)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+24, -0)
- `packages/opencode/test/session/processor-effect.test.ts` (+23, -45)
- `packages/opencode/test/share/share-next.test.ts` (+76, -94)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+433, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+616, -74)
- `packages/sdk/openapi.json` (+1847, -312)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/api.ts` (+4, -0)
- `packages/server/src/groups/connector.ts` (+133, -0)
- `packages/server/src/groups/location.ts` (+18, -1)
- `packages/server/src/groups/question.ts` (+15, -0)
- `packages/server/src/groups/session.ts` (+35, -0)
- `packages/server/src/handlers.ts` (+4, -0)
- `packages/server/src/handlers/connector.ts` (+103, -0)
- `packages/server/src/handlers/location.ts` (+18, -0)
- `packages/server/src/handlers/question.ts` (+7, -0)
- `packages/server/src/handlers/session.ts` (+31, -0)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -2)
- `packages/tui/src/app.tsx` (+3, -3)
- `packages/tui/src/component/dialog-model.tsx` (+46, -43)
- `packages/tui/src/component/dialog-workspace-create.tsx` (+1, -1)
- `packages/tui/src/component/dialog-workspace-list.tsx` (+1, -1)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+17, -19)
- `packages/tui/src/component/use-connected.tsx` (+3, -5)
- `packages/tui/src/context/data.tsx` (+587, -0)
- `packages/tui/src/context/event.ts` (+2, -1)
- `packages/tui/src/context/local.tsx` (+27, -18)
- `packages/tui/src/context/sync-v2.tsx` (+0, -465)
- `packages/tui/src/feature-plugins/builtins.ts` (+0, -2)
- `packages/tui/src/feature-plugins/home/footer.tsx` (+5, -4)
- `packages/tui/src/feature-plugins/system/session-v2.tsx` (+0, -1196)
- `packages/tui/src/routes/home/session-destination.tsx` (+3, -5)
- `packages/tui/src/util/signal.ts` (+13, -3)
- `packages/tui/test/cli/tui/{sync-v2.test.tsx => data.test.tsx}` (+175, -306)
- `packages/tui/test/fixture/tui-sdk.ts` (+10, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### .opencode/agent/triage.md
```diff
diff --git a/.opencode/agent/triage.md b/.opencode/agent/triage.md
index 03df339..11c4c81 100644
--- a/.opencode/agent/triage.md
+++ b/.opencode/agent/triage.md
@@ -1,7 +1,7 @@
 ---
 mode: primary
 hidden: true
-model: opencode/gpt-5.4-nano
+model: opencode/gpt-5.4-mini
 color: "#44BA81"
 tools:
   "*": false
```

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 8de0eb9..447d372 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.0",
+  "version": "1.17.3",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/migration/20260611035744_credential/migration.sql
```diff
diff --git a/packages/core/migration/20260611035744_credential/migration.sql b/packages/core/migration/20260611035744_credential/migration.sql
new file mode 100644
index 0000000..c950306
--- /dev/null
+++ b/packages/core/migration/20260611035744_credential/migration.sql
@@ -0,0 +1,12 @@
+CREATE TABLE `credential` (
+	`id` text PRIMARY KEY,
+	`connector_id` text NOT NULL,
+	`method_id` text NOT NULL,
+	`label` text NOT NULL,
+	`value` text NOT NULL,
+	`active` integer DEFAULT false NOT NULL,
+	`time_created` integer NOT NULL,
+	`time_updated` integer NOT NULL
+);
+--> statement-breakpoint
+CREATE UNIQUE INDEX `credential_connector_active_idx` ON `credential` (`connector_id`) WHERE "credential"."active" = 1;
```

#### packages/core/migration/20260611035744_credential/snapshot.json
```diff
diff --git a/packages/core/migration/20260611035744_credential/snapshot.json b/packages/core/migration/20260611035744_credential/snapshot.json
new file mode 100644
index 0000000..6a18732
--- /dev/null
+++ b/packages/core/migration/20260611035744_credential/snapshot.json
@@ -0,0 +1,2095 @@
+{
+  "version": "7",
+  "dialect": "sqlite",
+  "id": "f25f9126-c7dc-4882-9ff4-af27e11d2da1",
+  "prevIds": ["d1bfa125-b81e-4c61-9b6e-e74abf6e488f"],
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
+      "name": "credential",
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
+      "name": "project_directory",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 3ca9618..cd60863 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.17.0",
+  "version": "1.17.3",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -104,7 +104,7 @@
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
-    "gitlab-ai-provider": "6.8.0",
+    "gitlab-ai-provider": "6.9.0",
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "gray-matter": "4.0.3",
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/subagent-permissions.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode .opencode/agent/triage.md
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/subagent-permissions.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/aisdk.ts
- `src/core/` - review core changes from packages/core/src/catalog.ts
- `src/core/` - review core changes from packages/core/src/effect-zod.ts
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/core/` - review core changes from packages/core/src/instance-layer.ts
- `src/core/` - review core changes from packages/core/src/instance.ts
- `src/core/` - review core changes from packages/core/src/kilocode/models-refresh.ts
- `src/core/` - review core changes from packages/core/src/model.ts
- `src/core/` - review core changes from packages/core/src/models-snapshot.d.ts
- `src/core/` - review core changes from packages/core/src/models-snapshot.js
- `src/core/` - review core changes from packages/core/src/models.ts
- `src/core/` - review core changes from packages/core/src/plugin.ts
- `src/core/` - review core changes from packages/core/src/plugin/auth.ts
- `src/core/` - review core changes from packages/core/src/plugin/boot.ts
- `src/core/` - review core changes from packages/core/src/plugin/env.ts
- `src/core/` - review core changes from packages/core/src/plugin/layer-map.example.ts
- `src/core/` - review core changes from packages/core/src/plugin/models-dev.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/alibaba.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/amazon-bedrock.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/anthropic.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/azure.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cerebras.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cloudflare-workers-ai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cohere.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/deepinfra.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/dynamic.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/gateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/github-copilot.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/gitlab.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/google-vertex.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/google.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/groq.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/index.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/kilo.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/llmgateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/mistral.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/nvidia.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openai-compatible.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/opencode.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openrouter.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/perplexity.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/sap-ai-core.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/togetherai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/venice.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/vercel.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/xai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/zenmux.ts
- `src/core/` - review core changes from packages/core/src/process.ts
- `src/core/` - review core changes from packages/core/src/provider.ts
- `src/core/` - review core changes from packages/core/src/schema.ts
- `src/core/` - review core changes from packages/core/src/util/error.ts
- `src/core/` - review core changes from packages/core/src/util/log.ts
- `src/core/` - review core changes from packages/core/test/catalog.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/fixtures/provider-factory.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-alibaba.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-amazon-bedrock.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-anthropic.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure-cognitive-services.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cerebras.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cloudflare-ai-gateway.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cohere.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-deepinfra.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-dynamic.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-gateway.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-github-copilot.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-gitlab.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google-vertex-anthropic.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google-vertex.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-groq.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-helper.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-kilo.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-llmgateway.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-mistral.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-nvidia.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openai-compatible.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-opencode.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openrouter.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-perplexity.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-sap-ai-core.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-togetherai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-venice.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-vercel.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-xai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-zenmux.test.ts
- `src/core/` - review core changes from packages/core/test/process/process.test.ts
- `src/core/` - review core changes from packages/core/tsconfig.json
- `src/core/` - review core changes from packages/kilo-indexing/src/indexing/orchestrator.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/schema.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/external-directory-allow.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.test.ts
- `src/tool/apply_patch.test.ts` - update based on kilocode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/apply_patch.ts` - update based on kilocode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/code-interpreter.ts` - update based on kilocode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/code-interpreter.ts changes
- `src/tool/codesearch.ts` - update based on kilocode packages/opencode/src/tool/codesearch.ts changes
- `src/tool/codesearch.txt.ts` - update based on kilocode packages/opencode/src/tool/codesearch.txt changes
- `src/tool/edit.test.ts` - update based on kilocode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/external-directory.test.ts` - update based on kilocode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/file-search.ts` - update based on kilocode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/file-search.ts changes
- `src/tool/grep.test.ts` - update based on kilocode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on kilocode packages/opencode/src/tool/grep.ts changes
- `src/tool/image-generation.ts` - update based on kilocode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/image-generation.ts changes
- `src/tool/json-schema.ts` - update based on kilocode packages/opencode/src/tool/json-schema.ts changes
- `src/tool/local-shell.ts` - update based on kilocode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/local-shell.ts changes
- `src/tool/mcp-websearch.ts` - update based on kilocode packages/opencode/src/tool/mcp-websearch.ts changes
- `src/tool/models-api.json.ts` - update based on kilocode packages/opencode/test/tool/fixtures/models-api.json changes
- `src/tool/parameters.test.ts.snap.ts` - update based on kilocode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/parameters.test.ts` - update based on kilocode packages/opencode/test/tool/parameters.test.ts changes
- `src/tool/question.test.ts` - update based on kilocode packages/opencode/test/tool/question.test.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/schema.ts` - update based on kilocode packages/opencode/src/tool/schema.ts changes
- `src/tool/shell.test.ts` - update based on kilocode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/task.txt.ts` - update based on kilocode packages/opencode/src/tool/task.txt changes
- `src/tool/task_status.test.ts` - update based on kilocode packages/opencode/test/tool/task_status.test.ts changes
- `src/tool/task_status.ts` - update based on kilocode packages/opencode/src/tool/task_status.ts changes
- `src/tool/task_status.txt.ts` - update based on kilocode packages/opencode/src/tool/task_status.txt changes
- `src/tool/tool-define.test.ts` - update based on kilocode packages/opencode/test/tool/tool-define.test.ts changes
- `src/tool/tool.ts` - update based on kilocode packages/opencode/src/tool/tool.ts changes
- `src/tool/truncation.test.ts` - update based on kilocode packages/opencode/test/tool/truncation.test.ts changes
- `src/tool/web-search-preview.ts` - update based on kilocode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/web-search-preview.ts changes
- `src/tool/web-search.ts` - update based on kilocode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/web-search.ts changes
- `src/tool/webfetch.test.ts` - update based on kilocode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/webfetch.ts` - update based on kilocode packages/opencode/src/tool/webfetch.ts changes
- `src/tool/websearch.test.ts` - update based on kilocode packages/opencode/test/tool/websearch.test.ts changes
- `src/tool/websearch.ts` - update based on kilocode packages/opencode/src/tool/websearch.ts changes
