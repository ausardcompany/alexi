# Upstream Changes Report
Generated: 2026-05-11 09:41:09

## Summary
- kilocode: 39 commits, 39 files changed
- opencode: 66 commits, 154 files changed

## kilocode Changes (9d37a1aea..08a3e0a09)

### Commits

- 08a3e0a09 - Merge pull request #10131 from Kilo-Org/mark/opencode-version-file (Mark IJbema, 2026-05-11)
- 8155e3a50 - Merge pull request #10003 from Kilo-Org/mark/fix-root-pkgjson-regressions (Mark IJbema, 2026-05-11)
- c11f63391 - Fix cursor positioning when text ends with newline (#10133) (Imanol Maiztegui, 2026-05-11)
- 5b8121ea5 - fix(upstream): rename shadowing path local in writeVersion (kiloconnect[bot], 2026-05-11)
- d8582521c - fix(vscode): keep revert checkpoints accessible (#10129) (Marius, 2026-05-11)
- 1988db53e - chore: ignore generated Kilo config artifacts (#10128) (Marius, 2026-05-11)
- 5482cc0d0 - fix(vscode): improve review comment icon contrast (#10130) (Marius, 2026-05-11)
- 8710e9d9d - feat(upstream): record last merged tag in .opencode-version (kiloconnect[bot], 2026-05-11)
- ee3ee5b06 - fix(upstream-merge): always reconcile package.json post-merge (Mark IJbema, 2026-05-11)
- d79664f08 - fix(upstream-merge): preserve ours' key order in package.json dep merge (Mark IJbema, 2026-05-11)
- a156e7a98 - chore(upstream): preserve & prune root package.json entries on merge (Mark IJbema, 2026-05-11)
- 27da09614 - fix: restore root package.json entries dropped by upstream-compat (Mark IJbema, 2026-05-11)
- 2d37f83da - Merge pull request #9852 from Kilo-Org/mark/upstream-compat-base (Mark IJbema, 2026-05-11)
- 325900807 - fix(vscode): stabilize shell command streaming (#10127) (Marius, 2026-05-11)
- fc6ce735c - fix(vscode): hide empty task header graph (#10125) (Marius, 2026-05-11)
- ac25381af - Merge pull request #10082 from Kilo-Org/kaput-peach (Kirill Kalishev, 2026-05-10)
- 44e466173 - Merge remote-tracking branch 'origin/main' into kaput-peach (kirillk, 2026-05-09)
- d5b8ff3a9 - fix(vscode): keep Agent Manager add tab adjacent (kirillk, 2026-05-09)
- f8da29ce5 - Merge branch 'main' into kaput-peach (Kirill Kalishev, 2026-05-08)
- a1ffc7751 - Merge remote-tracking branch 'origin/main' into kaput-peach (kirillk, 2026-05-08)
- 706691d39 - style(vscode): format Agent Manager tab rendering (kirillk, 2026-05-08)
- abf2e2a20 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-05-08)
- 1c12c0be9 - fix(vscode): address Agent Manager tab review (kirillk, 2026-05-08)
- ccc556e79 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-05-08)
- e884c3509 - Merge branch 'main' into kaput-peach (Kirill Kalishev, 2026-05-08)
- eb4ae71b6 - fix(vscode): align Agent Manager tab tooltips (kirillk, 2026-05-08)
- 0aa908c7a - fix(vscode): keep Agent Manager add tab visible (kirillk, 2026-05-08)
- 78e40436b - fix(vscode): stabilize Agent Manager tab tooltips (kirillk, 2026-05-08)
- a5f2fbc9f - feat(vscode): move Agent Manager tab bar new/search controls to left with separators (kirillk, 2026-05-08)
- 76f49645f - Merge remote-tracking branch 'origin/main' into mark/upstream-compat-base (Mark IJbema, 2026-05-07)
- 70fde2221 - refactor(upstream): improve compatibility commit lookup using semver (kiloconnect[bot], 2026-05-06)
- ed9a53866 - Merge branch 'main' into mark/upstream-compat-base (Mark IJbema, 2026-05-06)
- 694773a7c - Merge remote-tracking branch 'origin/main' into mark/upstream-compat-base (Mark IJbema, 2026-05-05)
- 5c14ec2be - fix: preserve upstream ancestry on kilo merge (kiloconnect[bot], 2026-05-05)
- fe3724605 - fix: resolve compat bases from version tags (kiloconnect[bot], 2026-05-05)
- 4b22bfbc5 - fix: keep compat branches linear (kiloconnect[bot], 2026-05-05)
- 723d1c2a3 - Merge remote-tracking branch 'origin/main' into mark/upstream-compat-base (kiloconnect[bot], 2026-05-04)
- 4b1c1930c - fix: preserve upstream compat merge bases (kiloconnect[bot], 2026-05-04)
- 419ddea52 - chore(upstream): implement compatibility base tracking for merges (kiloconnect[bot], 2026-05-04)

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
- `.changeset/agent-manager-tab-add-button.md` (+5, -0)
- `.changeset/agent-manager-tab-controls.md` (+5, -0)
- `.changeset/hide-empty-task-header-graph.md` (+5, -0)
- `.changeset/revert-checkpoints-stay.md` (+5, -0)
- `.changeset/review-plus-contrast.md` (+6, -0)
- `.changeset/stable-shell-streaming.md` (+5, -0)
- `.github/workflows/check-kilo-generated-artifacts.yml` (+27, -0)
- `.gitignore` (+15, -1)
- `.kilo/package-lock.json` (+0, -376)
- `.kilocode/package-lock.json` (+0, -376)
- `.opencode-version` (+1, -0)
- `package.json` (+2, -6)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-multiple-tabs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-single-tab-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-with-review-tab-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/src/components/diff.tsx` (+2, -5)
- `packages/kilo-vscode/tests/unit/revert-checkpoints.test.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+17, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/CurrentTabsMenu.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+65, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/sortable-tab.tsx` (+76, -68)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SortableTerminalTab.tsx` (+35, -31)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+18, -11)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeSessionTurn.tsx` (+3, -5)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+7, -2)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+32, -15)
- `script/check-kilo-generated-artifacts.ts` (+51, -0)
- `script/check-workflows.ts` (+1, -0)
- `script/upstream/README.md` (+3, -1)
- `script/upstream/merge.ts` (+62, -2)
- `script/upstream/transforms/transform-package-json.test.ts` (+116, -0)
- `script/upstream/transforms/transform-package-json.ts` (+344, -91)
- `script/upstream/utils/git.test.ts` (+110, -0)
- `script/upstream/utils/git.ts` (+142, -0)
- `script/upstream/utils/upstream.ts` (+62, -0)

### Key Diffs

(no key diffs to show)

## opencode Changes (903d818..c933504)

### Commits

- c933504 - fix(ui): better handle patch file support when rendering patch/edit tools (#26828) (Brendan Allan, 2026-05-11)
- 2d0d3d5 - feat(compaction): serialize compaction tail (#26830) (Shoubhit Dash, 2026-05-11)
- 3bd98ea - chore: generate (opencode-agent[bot], 2026-05-11)
- 7e997cf - refactor(scout): resolve configured reference mentions (#26701) (Shoubhit Dash, 2026-05-11)
- 5d6f2a1 - fix(ui): use part_text_accum_delta to prevent markdown cutoff during streaming (#26822) (Brendan Allan, 2026-05-11)
- b1cb718 - chore: generate (opencode-agent[bot], 2026-05-11)
- 518264f - fix(opencode): fix full session fork (#26811) (Aiden Cline, 2026-05-11)
- 7235c9c - Trace data migrations (#26809) (Dax, 2026-05-11)
- 274033c - Validate prompt messages with Effect Schema (#26796) (Kit Langton, 2026-05-11)
- 9b369ee - chore(llm): make cache: 'auto' the default (#26798) (Kit Langton, 2026-05-10)
- 721ff51 - fix prompt history behaviour and session line up/down commands (#26797) (Sebastian, 2026-05-11)
- cfbf5d1 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-11)
- 02cb7e7 - chore: generate (opencode-agent[bot], 2026-05-11)
- 942630e - feat(llm): cache-policy auto-placement (#26786) (Kit Langton, 2026-05-10)
- ce66b19 - sync release versions for v1.14.48 (opencode, 2026-05-11)
- 6f1f594 - Delete unused opencode Zod helpers (#26793) (Kit Langton, 2026-05-10)
- 1c49b2e - chore: generate (opencode-agent[bot], 2026-05-11)
- 3c6be60 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-11)
- ddc02c2 - Drop synchronous SyncEvent facades (#26789) (Kit Langton, 2026-05-11)
- 2703eff - refactor(llm): normalize Usage as inclusive total + non-overlapping breakdown (#26735) (Kit Langton, 2026-05-10)
- 38e4540 - chore: generate (opencode-agent[bot], 2026-05-11)
- 4100fcb - disable image resizing (Dax Raad, 2026-05-10)
- 83cb0f6 - Drop EventV2 run facade (#26783) (Kit Langton, 2026-05-10)
- effd967 - Use SyncEvent service at event call sites (#26782) (Kit Langton, 2026-05-10)
- 5801cce - chore: generate (opencode-agent[bot], 2026-05-11)
- 77e6c0d - feat(llm): cache hint TTL, breakpoint cap, and tool placement (#26779) (Kit Langton, 2026-05-10)
- fed716a - Clarify compaction test harness (#26777) (Kit Langton, 2026-05-10)
- 426d92e - sync release versions for v1.14.47 (opencode, 2026-05-11)
- d0412a2 - chore: generate (opencode-agent[bot], 2026-05-11)
- 16aa670 - Effectify remaining compaction process tests (#26776) (Kit Langton, 2026-05-10)
- 7cea32e - Add background code migration service (#26652) (Dax, 2026-05-11)
- 128d10d - Simplify compaction test helpers (#26742) (Kit Langton, 2026-05-10)
- 5ef72e1 - Drop unused ID Zod statics (#26740) (Kit Langton, 2026-05-10)
- d8060dc - Drop compaction create facade (#26739) (Kit Langton, 2026-05-10)
- f71fb18 - Replace compaction create test fixtures (#26738) (Kit Langton, 2026-05-10)
- 5654dd2 - restore managed textarea keymap handling (#26771) (Sebastian, 2026-05-11)
- 64dde0c - Migrate compaction tool-call test (#26737) (Kit Langton, 2026-05-10)
- a658e43 - Migrate compaction plugin test (#26736) (Kit Langton, 2026-05-10)
- ca8a42c - Migrate LLM compaction tail tests (#26734) (Kit Langton, 2026-05-10)
- 8f5f75d - Migrate compaction LLM test (#26733) (Kit Langton, 2026-05-10)
- 4ff0d07 - Migrate configurable compaction tests (#26732) (Kit Langton, 2026-05-10)
- 2a571b3 - Migrate compaction overflow tests (#26731) (Kit Langton, 2026-05-10)
- 0fffcdf - Persist session model switches outside event flag (#26765) (Dax, 2026-05-10)
- 2ba2ee5 - docs: document bun dev tmux capture (#26764) (Dax, 2026-05-10)
- 56d818f - zen: fix reasoning token for openai compatible endpoint (Frank, 2026-05-10)
- 9c8da69 - Use Effect timeout in compaction test (#26728) (Kit Langton, 2026-05-10)
- a780186 - chore: generate (opencode-agent[bot], 2026-05-10)
- e45b6ef - refactor(http-recorder): use Schema.TaggedErrorClass for cassette errors (#26729) (Kit Langton, 2026-05-10)
- b616543 - chore: generate (opencode-agent[bot], 2026-05-10)
- 2bd3d9a - refactor(http-recorder): hide cassette format behind Cassette seam (#26725) (Kit Langton, 2026-05-10)
- fa15dbc - Migrate compaction process tests (#26723) (Kit Langton, 2026-05-10)
- 312e5c7 - chore: generate (opencode-agent[bot], 2026-05-10)
- 049502f - fix(server): return diagnosable body for schema rejections (#26631) (Kit Langton, 2026-05-10)
- cc2915b - chore: generate (opencode-agent[bot], 2026-05-10)
- ce061bf - Add explicit LLM stream lifecycle events (#26722) (Kit Langton, 2026-05-10)
- 3b8790e - zen: fix usage css on mobile (Frank, 2026-05-10)
- a4f3ced - Start effect-style compaction tests (Kit Langton, 2026-05-10)
- 1c9a2eb - chore: generate (opencode-agent[bot], 2026-05-10)
- 4fb417d - feat(http-recorder): default mode to "auto" (#26719) (Kit Langton, 2026-05-10)
- 11030c6 - Scope boolean query overrides (Kit Langton, 2026-05-10)
- c104098 - chore: generate (opencode-agent[bot], 2026-05-10)
- 49ee3ba - Source diff message query pattern (#26638) (Kit Langton, 2026-05-10)
- 4fc5383 - chore: generate (opencode-agent[bot], 2026-05-10)
- d28b5ad - refactor(http-recorder): Redactor + Recorder seams, README (#26636) (Kit Langton, 2026-05-10)
- 6589a66 - chore: generate (opencode-agent[bot], 2026-05-10)
- 5cf9abe - feat(scout): materialize configured reference repos (#26692) (Shoubhit Dash, 2026-05-10)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/glob.ts` (+7, -1)
- `packages/opencode/src/tool/grep.ts` (+4, -0)
- `packages/opencode/src/tool/read.ts` (+4, -1)
- `packages/opencode/src/tool/registry.ts` (+3, -0)
- `packages/opencode/src/tool/repo_clone.ts` (+18, -147)
- `packages/opencode/test/tool/glob.test.ts` (+2, -0)
- `packages/opencode/test/tool/grep.test.ts` (+2, -0)
- `packages/opencode/test/tool/read.test.ts` (+87, -0)
- `packages/opencode/test/tool/registry.test.ts` (+2, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+0, -72)
- `packages/opencode/test/agent/agent.test.ts` (+8, -31)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/effect-zod.ts` (+1, -1)

#### Other Changes
- `bun.lock` (+17, -17)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/context/global-sync/child-store.ts` (+1, -0)
- `packages/app/src/context/global-sync/event-reducer.test.ts` (+1, -0)
- `packages/app/src/context/global-sync/event-reducer.ts` (+17, -0)
- `packages/app/src/context/global-sync/session-cache.test.ts` (+5, -0)
- `packages/app/src/context/global-sync/session-cache.ts` (+4, -0)
- `packages/app/src/context/global-sync/types.ts` (+3, -0)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/workspace/[id]/usage/usage-section.module.css` (+2, -0)
- `packages/console/app/src/routes/workspace/[id]/usage/usage-section.tsx` (+1, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+2, -15)
- `packages/console/app/src/routes/zen/util/provider/openai.ts` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/README.md` (+214, -0)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/http-recorder/src/cassette.ts` (+120, -78)
- `packages/http-recorder/src/diff.ts` (+0, -95)
- `packages/http-recorder/src/effect.ts` (+59, -126)
- `packages/http-recorder/src/index.ts` (+23, -7)
- `packages/http-recorder/src/matching.ts` (+89, -1)
- `packages/http-recorder/src/recorder.ts` (+73, -0)
- `packages/http-recorder/src/redaction.ts` (+7, -8)
- `packages/http-recorder/src/redactor.ts` (+76, -0)
- `packages/http-recorder/src/schema.ts` (+3, -2)
- `packages/http-recorder/src/storage.ts` (+0, -34)
- `packages/http-recorder/src/websocket.ts` (+52, -97)
- `packages/http-recorder/test/record-replay.test.ts` (+98, -67)
- `packages/llm/README.md` (+129, -0)
- `packages/llm/example/tutorial.ts` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/cache-policy.ts` (+111, -0)
- `packages/llm/src/protocols/anthropic-messages.ts` (+114, -47)
- `packages/llm/src/protocols/bedrock-converse.ts` (+75, -26)
- `packages/llm/src/protocols/gemini.ts` (+25, -8)
- `packages/llm/src/protocols/openai-chat.ts` (+15, -9)
- `packages/llm/src/protocols/openai-responses.ts` (+26, -32)
- `packages/llm/src/protocols/shared.ts` (+36, -0)
- `packages/llm/src/protocols/utils/bedrock-cache.ts` (+24, -7)
- `packages/llm/src/protocols/utils/cache.ts` (+16, -0)
- `packages/llm/src/protocols/utils/tool-stream.ts` (+14, -24)
- `packages/llm/src/route/client.ts` (+2, -1)
- `packages/llm/src/schema/events.ts` (+147, -29)
- `packages/llm/src/schema/ids.ts` (+9, -0)
- `packages/llm/src/schema/messages.ts` (+6, -1)
- `packages/llm/src/schema/options.ts` (+28, -0)
- `packages/llm/src/tool-runtime.ts` (+14, -6)
- `packages/llm/test/adapter.test.ts` (+3, -1)
- `packages/llm/test/cache-policy.test.ts` (+262, -0)
- `packages/llm/test/fixtures/recordings/anthropic-messages-cache/writes-then-reads-cache-control-on-identical-second-call.json` (+48, -0)
- `packages/llm/test/fixtures/recordings/gemini-cache/reports-cachedcontenttokencount-on-identical-second-call.json` (+46, -0)
- `packages/llm/test/fixtures/recordings/openai-responses-cache/reports-cached-tokens-on-identical-second-call.json` (+46, -0)
- `packages/llm/test/llm.test.ts` (+1, -1)
- `packages/llm/test/provider/anthropic-messages-cache.recorded.test.ts` (+56, -0)
- `packages/llm/test/provider/anthropic-messages.recorded.test.ts` (+2, -1)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+146, -5)
- `packages/llm/test/provider/bedrock-converse-cache.recorded.test.ts` (+56, -0)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+79, -0)
- `packages/llm/test/provider/gemini-cache.recorded.test.ts` (+50, -0)
- `packages/llm/test/provider/gemini.test.ts` (+24, -19)
- `packages/llm/test/provider/golden.recorded.test.ts` (+4, -3)
- `packages/llm/test/provider/openai-chat.test.ts` (+15, -12)
- `packages/llm/test/provider/openai-responses-cache.recorded.test.ts` (+47, -0)
- `packages/llm/test/provider/openai-responses.test.ts` (+22, -15)
- `packages/llm/test/recorded-scenarios.ts` (+15, -0)
- `packages/llm/test/recorded-test.ts` (+1, -1)
- `packages/llm/test/recorded-websocket.ts` (+2, -3)
- `packages/llm/test/schema.test.ts` (+29, -1)
- `packages/opencode/AGENTS.md` (+7, -0)
- `packages/opencode/migration/20260511000411_data_migration_state/migration.sql` (+4, -0)
- `packages/opencode/migration/20260511000411_data_migration_state/snapshot.json` (+1490, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+11, -6)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+12, -21)
- `packages/opencode/src/cli/cmd/tui/component/prompt/traits.ts` (+3, -6)
- `packages/opencode/src/cli/cmd/tui/keymap.tsx` (+31, -7)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/validate-session.ts` (+9, -4)
- `packages/opencode/src/config/config.ts` (+2, -2)
- `packages/opencode/src/control-plane/schema.ts` (+0, -2)
- `packages/opencode/src/control-plane/workspace.ts` (+7, -9)
- `packages/opencode/src/data-migration.sql.ts` (+6, -0)
- `packages/opencode/src/data-migration.ts` (+59, -0)
- `packages/opencode/src/effect/app-runtime.ts` (+4, -0)
- `packages/opencode/src/project/bootstrap.ts` (+4, -1)
- `packages/opencode/src/project/instance-store.ts` (+3, -3)
- `packages/opencode/src/reference/reference.ts` (+237, -0)
- `packages/opencode/src/reference/repository-cache.ts` (+147, -0)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+3, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/query.ts` (+4, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+20, -3)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/schema-error.ts` (+30, -0)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+16, -16)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+3, -0)
- `packages/opencode/src/session/compaction.ts` (+58, -48)
- `packages/opencode/src/session/message-v2.ts` (+10, -65)
- `packages/opencode/src/session/processor.ts` (+153, -119)
- `packages/opencode/src/session/prompt.ts` (+262, -76)
- `packages/opencode/src/session/schema.ts` (+0, -4)
- `packages/opencode/src/sync/index.ts` (+14, -29)
- `packages/opencode/src/util/fn.ts` (+0, -21)
- `packages/opencode/src/util/repository.ts` (+15, -0)
- `packages/opencode/src/util/update-schema.ts` (+0, -13)
- `packages/opencode/src/v2/event.ts` (+0, -10)
- `packages/opencode/src/v2/session-message-updater.ts` (+1, -0)
- `packages/opencode/src/v2/session-message.ts` (+1, -0)
- `packages/opencode/src/v2/session-prompt.ts` (+13, -0)
- `packages/opencode/src/v2/session.ts` (+5, -3)
- `packages/opencode/test/cli/cmd/tui/prompt-traits.test.ts` (+8, -17)
- `packages/opencode/test/reference/reference.test.ts` (+244, -0)
- `packages/opencode/test/server/httpapi-query-schema-drift.test.ts` (+28, -10)
- `packages/opencode/test/server/httpapi-schema-error-body.test.ts` (+162, -0)
- `packages/opencode/test/server/httpapi-session.test.ts` (+0, -1)
- `packages/opencode/test/server/sdk-error-shape.test.ts` (+16, -6)
- `packages/opencode/test/server/sdk-v1-smoke.test.ts` (+60, -0)
- `packages/opencode/test/session/compaction.test.ts` (+796, -1139)
- `packages/opencode/test/session/messages-pagination.test.ts` (+8, -8)
- `packages/opencode/test/session/processor-effect.test.ts` (+2, -0)
- `packages/opencode/test/session/prompt.test.ts` (+102, -0)
- `packages/opencode/test/session/schema-decoding.test.ts` (+7, -7)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+5, -0)
- `packages/opencode/test/sync/index.test.ts` (+24, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/gen/types.gen.ts` (+5, -5)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+23, -5)
- `packages/sdk/openapi.json` (+74, -12)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/message-part.tsx` (+36, -15)
- `packages/ui/src/components/session-diff.ts` (+13, -5)
- `packages/ui/src/context/data.tsx` (+3, -0)
- `packages/web/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index fa9d8fe..986103e 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.14.46",
+  "version": "1.14.48",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 1567df4..e2ffa31 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.14.46",
+  "version": "1.14.48",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/effect-zod.ts
```diff
diff --git a/packages/core/src/effect-zod.ts b/packages/core/src/effect-zod.ts
index 1c88712..42d89ec 100644
--- a/packages/core/src/effect-zod.ts
+++ b/packages/core/src/effect-zod.ts
@@ -36,7 +36,7 @@ export function zod<S extends Schema.Top>(schema: S): z.ZodType<Schema.Schema.Ty
  * mapped `.omit()` / `.extend()` surface triggers brand-intersection
  * explosions for branded primitives (`string & Brand<"SessionID">` extends
  * `object` via the brand and gets walked into the prototype by `DeepPartial`,
- * `updateSchema`, etc.), and zod's inference through `z.ZodType<T | undefined>`
+ * mapped-schema helpers, and zod's inference through `z.ZodType<T | undefined>`
  * wrappers also can't reconstruct `T` cleanly. Consumers that care about the
  * post-`.omit()` shape should cast `c.req.valid(...)` to the expected type.
  */
```

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index a5876ac..777f6e6 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -27,9 +27,6 @@ import * as OtelTracer from "@effect/opentelemetry/Tracer"
 import { zod } from "@opencode-ai/core/effect-zod"
 import { withStatics, type DeepMutable } from "@opencode-ai/core/schema"
 
-type ReferenceEntry = NonNullable<Config.Info["reference"]>[string]
-type ResolvedReference = { kind: "git"; repository: string; branch?: string } | { kind: "local"; path: string }
-
 export const Info = Schema.Struct({
   name: Schema.String,
   description: Schema.optional(Schema.String),
@@ -303,75 +300,6 @@ export const layer = Layer.effect(
           item.permission = Permission.merge(item.permission, Permission.fromConfig(value.permission ?? {}))
         }
 
-        function referencePath(value: string) {
-          if (value.startsWith("~/")) return path.join(Global.Path.home, value.slice(2))
-          return path.isAbsolute(value)
-            ? value
-            : path.resolve(ctx.worktree === "/" ? ctx.directory : ctx.worktree, value)
-        }
-
-        function resolveReference(reference: ReferenceEntry): ResolvedReference {
-          if (typeof reference === "string") {
-            if (reference.startsWith(".") || reference.startsWith("/") || reference.startsWith("~")) {
-              return { kind: "local", path: referencePath(reference) }
-            }
-            return { kind: "git", repository: reference }
-          }
-          if ("path" in reference) return { kind: "local", path: referencePath(reference.path) }
-          return { kind: "git", repository: reference.repository, branch: reference.branch }
-        }
-
-        function referencePrompt(name: string, reference: ResolvedReference) {
-          if (reference.kind === "local") {
-            return [
-              PROMPT_SCOUT,
-              `You are Scout reference @${name}. This reference points to a local directory outside or alongside the current workspace.`,
-              `Local directory: ${reference.path}`,
-              `When invoked, inspect this directory as the primary reference source. Prefer repo_overview with path ${JSON.stringify(reference.path)} before broader searches. Do not edit files.`,
-            ].join("\n\n")
-          }
-
-          return [
-            PROMPT_SCOUT,
-            `You are Scout reference @${name}. This reference points to a git repository.`,
-            `Repository: ${reference.repository}`,
```

#### packages/opencode/src/tool/glob.ts
```diff
diff --git a/packages/opencode/src/tool/glob.ts b/packages/opencode/src/tool/glob.ts
index 0c97b9c..ce58331 100644
--- a/packages/opencode/src/tool/glob.ts
+++ b/packages/opencode/src/tool/glob.ts
@@ -7,6 +7,7 @@ import { Ripgrep } from "../file/ripgrep"
 import { assertExternalDirectoryEffect } from "./external-directory"
 import DESCRIPTION from "./glob.txt"
 import * as Tool from "./tool"
+import { Reference } from "@/reference/reference"
 
 export const Parameters = Schema.Struct({
   pattern: Schema.String.annotate({ description: "The glob pattern to match files against" }),
@@ -20,6 +21,7 @@ export const GlobTool = Tool.define(
   Effect.gen(function* () {
     const rg = yield* Ripgrep.Service
     const fs = yield* AppFileSystem.Service
+    const reference = yield* Reference.Service
 
     return {
       description: DESCRIPTION,
@@ -39,11 +41,15 @@ export const GlobTool = Tool.define(
 
           let search = params.path ?? ins.directory
           search = path.isAbsolute(search) ? search : path.resolve(ins.directory, search)
+          yield* reference.ensure(search)
           const info = yield* fs.stat(search).pipe(Effect.catch(() => Effect.succeed(undefined)))
           if (info?.type === "File") {
             throw new Error(`glob path must be a directory: ${search}`)
           }
-          yield* assertExternalDirectoryEffect(ctx, search, { kind: "directory" })
+          yield* assertExternalDirectoryEffect(ctx, search, {
+            bypass: yield* reference.contains(search),
+            kind: "directory",
+          })
 
           const limit = 100
           let truncated = false
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/agent.test.ts
- `src/tool/glob.test.ts` - update based on opencode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on opencode packages/opencode/src/tool/glob.ts changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on opencode packages/opencode/src/tool/grep.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_clone.ts` - update based on opencode packages/opencode/src/tool/repo_clone.ts changes
